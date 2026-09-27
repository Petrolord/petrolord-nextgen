#!/usr/bin/env python3
"""THE EIGHTEEN GRADED SC4 ANSWERS, RECOMPUTED BY THE VENDORED STDLIB ORACLE.

fields.json is written from the JavaScript engine. This replays the three
capstone cases through tools/validation/supplychain/oracle_marine.py (python
standard library only), which reads no JavaScript and takes its own road:
every stated figure is read as the decimal it was typed as and carried as an
exact Fraction, so capacity checks, rounded-up counts and the binding
constraint are decided exactly; the M/M/c delay probability is the direct sum
of Adan and Resing eq. (5.1) (the engine uses the Erlang B recursion); first-fit
decreasing is coded from the "one open bin at a time" description. Nothing the
engine returned is handed to it except the typed capstone terms, and the
oracle stops (exit 2) if a rounding decision falls within 1e-9 of a whole
number without being one.

ONE AGREEMENT FOR EVERY FIELD. Each must agree to 1e-12 relative AND within
its own grading tolerance absolute (the tolerance is half a unit in the sixth
decimal), and the worst disagreement is printed in tolerances.

    python3 oracle_check.py [--plant | --json]

--plant is THE NEGATIVE CONTROL: it perturbs one graded value by ten
tolerances before comparing, and must exit 1 naming it.

Exit 0 clean, 1 a disagreement, 2 could not run.
"""
import json
import os
import subprocess
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
ENG = os.environ.get('SC4_ENGINES', '/root/wt-sc4-nextgen/packages/engines')
sys.path.insert(0, os.path.join(ENG, 'tools', 'validation', 'supplychain'))
PLANT = '--plant' in sys.argv
PLANTED_KEY = 'akokwa_vessel_days'
T0 = time.time()

try:
    import oracle_marine as O  # noqa: E402
except Exception as e:  # pragma: no cover
    print(f'REFUSED: the vendored oracle could not be imported from {ENG} ({e})')
    sys.exit(2)

fields = json.load(open(os.path.join(HERE, 'fields.json')))
if len(fields) != 18:
    print('REFUSED: fields.json does not carry eighteen fields')
    sys.exit(2)
inp = json.loads(subprocess.run(['node', os.path.join(HERE, 'marine_capstone.mjs'), '--inputs'],
                                capture_output=True, text=True, check=True, env=dict(os.environ)).stdout)


def run(fn, args):
    r = O.call(fn, json.loads(json.dumps(args)))
    if isinstance(r, dict) and r.get('error') is True:
        print(f'REFUSED: the oracle refused a capstone call: {r["field"]}: {r["message"]}')
        sys.exit(2)
    return r


nk, ak, mg = inp['NKEREFI'], inp['AKOKWA'], inp['MGBIDI']
nkm = run('voyagePlan', nk['voyagePlan:milk-run'])
nkd = run('voyagePlan', nk['voyagePlan:dedicated'])
akf = run('fleetSize', ak['fleetSize'])
akd = run('deckPlan', ak['deckPlan'])
mgm = run('shoreBase', mg['shoreBase:mmc'])
mgd = run('shoreBase', mg['shoreBase:mdc'])
got = {
    'nkerefi_milkrun_hours': nkm['voyages'][0]['hours']['total'],
    'nkerefi_milkrun_fuel_t': nkm['voyages'][0]['fuelT']['total'],
    'nkerefi_milkrun_fuel_cost': nkm['voyages'][0]['fuelCost'],
    'nkerefi_milkrun_deadweight_t': nkm['voyages'][0]['load']['deadweightT'],
    'nkerefi_binding_utilisation': nkm['voyages'][0]['binding']['utilisation'],
    'nkerefi_dedicated_days': nkd['totals']['days'],
    'akokwa_voyages_exact': akf['voyageSets'][0]['voyagesExact'],
    'akokwa_vessel_days': akf['vesselDays'],
    'akokwa_vessels_exact': akf['vesselsExact'],
    'akokwa_spare_vessel_days': akf['spareVesselDays'],
    'akokwa_ffd_v1_area_m2': akd['voyages'][0]['areaM2'],
    'akokwa_ffd_v2_load_utilisation': akd['voyages'][1]['loadUtilisation'],
    'mgbidi_mmc_wait_hours': mgm['meanWaitHours'],
    'mgbidi_mmc_probability_wait': mgm['probabilityWait'],
    'mgbidi_mmc_time_at_base_hours': mgm['meanTimeAtBaseHours'],
    'mgbidi_mdc_wait_hours': mgd['meanWaitHours'],
    'mgbidi_mdc_mean_queue': mgd['meanQueue'],
    'mgbidi_target_wait_hours': mgm['target']['meanWaitHours'],
}
graded = {k: (v, tol) for _, k, v, tol in fields}
if set(got) != set(graded):
    print(f'REFUSED: the oracle computed {sorted(set(got))} against {sorted(set(graded))}')
    sys.exit(2)

if PLANT:
    got[PLANTED_KEY] = got[PLANTED_KEY] + 10 * graded[PLANTED_KEY][1]

# No SC4 field is a difference of large figures, so every relative bound is
# taken against the field itself.
SCALE = {}

if '--json' in sys.argv:
    out = {k: {'value': float(got[k]), 'oracle': 'tools/validation/supplychain/oracle_marine.py'} for _, k, _v, _t in fields}
    dis = [k for _, k, v, tol in fields if not (abs(float(got[k]) - v) / max(abs(v), SCALE.get(k, 0), 1e-300) <= 1e-12 and abs(float(got[k]) - v) <= tol)]
    print(json.dumps(out))
    sys.exit(1 if dis else 0)

worst_rel = worst_tol = 0.0
bad = []
print(f'{"field":40s} {"engine (fields.json)":>24s} {"oracle":>24s} {"relative":>10s} {"abs/tol":>9s}  within')
for _, k, v, tol in fields:
    o = float(got[k])
    rel = abs(o - v) / max(abs(v), SCALE.get(k, 0), 1e-300)
    worst_rel = max(worst_rel, rel)
    worst_tol = max(worst_tol, abs(o - v) / tol)
    ok = rel <= 1e-12 and abs(o - v) <= tol
    if not ok:
        bad.append(k)
    print(f'{k:40s} {v:24.17g} {o:24.17g} {rel:10.2e} {abs(o - v) / tol:9.2e}  {"yes" if ok else "NO"}')
print(f'oracle_check: 18 graded values replayed through the stdlib oracle in {time.time() - T0:.0f} s; '
      f'every chain the oracle\'s own; worst relative difference {worst_rel:.2e}, worst {worst_tol:.2e} tolerances; '
      f'disagreements: {len(bad)}')
if PLANT:
    print(f'NEGATIVE CONTROL: {PLANTED_KEY} was moved by ten tolerances; {"caught" if bad == [PLANTED_KEY] else "NOT CAUGHT as planted"}')
    sys.exit(1 if bad == [PLANTED_KEY] else 2)
sys.exit(1 if bad else 0)
