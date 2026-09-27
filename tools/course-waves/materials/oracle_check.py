#!/usr/bin/env python3
"""THE EIGHTEEN GRADED SC3 ANSWERS, RECOMPUTED BY THE VENDORED STDLIB ORACLE.

fields.json is written from the JavaScript engine. This replays the three
capstone cases through tools/validation/supplychain/oracle_inventory.py
(python standard library only), which reads no JavaScript and takes its own
road: every stated input as the exact rational of its double; square roots in
Decimal at 60 digits; Phi from the Maclaurin series of erf in Decimal at 90
digits (the engine uses AS241 for the inverse and the regularised incomplete
gamma for Phi); Phi^-1 and the fill-rate k by Decimal bisection to 1e-40;
each Poisson probability by its own formula and the loss E[(X - s)+] as the
direct partial expectation (the engine recurses); the ABC ranking by
insertion; discount candidates costed from the lot-cost definition on
Fractions. Nothing the engine returned is handed to it except the typed
capstone terms.

ONE AGREEMENT FOR EVERY FIELD. Each must agree to 1e-12 relative AND within
its own grading tolerance absolute (the tolerance is half a unit in the sixth
decimal), and the worst disagreement is printed in tolerances. The fill-rate
safety factor is solved by bisection in both (the engine to the last binary
digit, the oracle to 1e-40), so its relative agreement is held to 1e-12 too.

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
ENG = os.environ.get('SC3_ENGINES', '/root/wt-sc3-nextgen/packages/engines')
sys.path.insert(0, os.path.join(ENG, 'tools', 'validation', 'supplychain'))
PLANT = '--plant' in sys.argv
PLANTED_KEY = 'ogidi_filter_csl_safety_stock'
T0 = time.time()

try:
    import oracle_inventory as O  # noqa: E402
except Exception as e:  # pragma: no cover
    print(f'REFUSED: the vendored oracle could not be imported from {ENG} ({e})')
    sys.exit(2)

fields = json.load(open(os.path.join(HERE, 'fields.json')))
if len(fields) != 18:
    print('REFUSED: fields.json does not carry eighteen fields')
    sys.exit(2)
inp = json.loads(subprocess.run(['node', os.path.join(HERE, 'materials_capstone.mjs'), '--inputs'],
                                capture_output=True, text=True, check=True, env=dict(os.environ)).stdout)


def run(fn, args):
    try:
        r = O.evaluate(fn, json.loads(json.dumps(args)))
    except O.OracleStop as e:
        print(f'REFUSED: the oracle stopped on a capstone call ({fn}): {e}')
        sys.exit(2)
    if isinstance(r, dict) and r.get('error') is True:
        print(f'REFUSED: the oracle refused a capstone call: {r["field"]}: {r["message"]}')
        sys.exit(2)
    return r


def item(rows, iid):
    return next(x for x in rows if x['id'] == iid)


ig, og, um = inp['IGBARIAM'], inp['OGIDI'], inp['UMUCHU']
igc = run('criticality', ig['criticality'])
iga = run('abcClassification', ig['abcClassification'])
ige = run('eoq', ig['eoq'])
igs = run('slowMoving', ig['slowMoving'])
ogq = run('quantityDiscount', og['quantityDiscount'])
ogc = run('safetyStock', og['safetyStock:cycle-service'])
ogf = run('safetyStock', og['safetyStock:fill-rate'])
ogp = run('safetyStock', og['safetyStock:periodic'])
ogk = run('poissonStock', og['poissonStock'])
umi = run('insuranceSpares', um['insuranceSpares'])
ums = run('poissonStock', um['poissonStock'])
best = umi['options'][umi['spares']]
got = {
    'igbariam_trim_weighted_score': item(igc['items'], 'IGB-V204')['weightedScore'],
    'igbariam_inhibitor_cumulative_pct': item(iga['items'], 'IGB-C515')['cumulativePct'],
    'igbariam_inhibitor_eoq': ige['eoq'],
    'igbariam_inhibitor_relevant_cost': ige['relevantCost'],
    'igbariam_inhibitor_rounding_penalty_pct': ige['roundingPenaltyPct'],
    'igbariam_total_write_down': igs['totalWriteDown'],
    'ogidi_tubing_discount_quantity': ogq['quantity'],
    'ogidi_tubing_discount_total_cost': ogq['totalCost'],
    'ogidi_filter_csl_safety_stock': ogc['safetyStock'],
    'ogidi_filter_fill_rate_k': ogf['safetyFactorExact'],
    'ogidi_filter_periodic_level': ogp['level'],
    'ogidi_kit_poisson_short': ogk['expectedShortPerCycle'],
    'umuchu_motor_total_cost': umi['totalCost'],
    'umuchu_motor_downtime_cost': best['downtimeCost'],
    'umuchu_motor_no_shortage': best['probabilityNoShortage'],
    'umuchu_motor_fill_rate': best['fillRate'],
    'umuchu_seal_poisson_short': ums['expectedShortPerCycle'],
    'umuchu_seal_poisson_fill_rate': ums['achievedFillRate'],
}
graded = {k: (v, tol) for _, k, v, tol in fields}
if set(got) != set(graded):
    print(f'REFUSED: the oracle computed {sorted(set(got))} against {sorted(set(graded))}')
    sys.exit(2)

if PLANT:
    got[PLANTED_KEY] = got[PLANTED_KEY] + 10 * graded[PLANTED_KEY][1]

# A small figure made of large ones is held to its relative bound against the
# size of the figures it is made of: the rounding penalty is a percentage
# difference of two relevant costs, so it is taken against 100.
SCALE = {'igbariam_inhibitor_rounding_penalty_pct': 100.0}

if '--json' in sys.argv:
    out = {k: {'value': float(got[k]), 'oracle': 'tools/validation/supplychain/oracle_inventory.py'} for _, k, _v, _t in fields}
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
