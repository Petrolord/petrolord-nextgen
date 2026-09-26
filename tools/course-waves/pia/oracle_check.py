#!/usr/bin/env python3
"""THE EIGHTEEN GRADED EC7 ANSWERS, RECOMPUTED BY THE VENDORED STDLIB ORACLE.

fields.json is written from the TypeScript engine. This replays the three
capstone cases through tools/validation/economics/oracle_pia2021.py (python
standard library only), whose every rate, band, threshold and cap was typed
from the gazetted texts (PIA 2021, the Petroleum Royalty Regulations 2022, the
Nigeria Tax Act 2025 June gazette, the Finance Act 2023), never from the
engine, and whose formulas are written the way the texts write them (royalty
as a sum over tranches, the benchmarks as a year-by-year table). Its ledger()
is the oracle's own chain end to end: nothing the engine returned is handed to
it except the typed capstone terms and rows.

ONE AGREEMENT FOR EVERY FIELD. Each must agree to 1e-12 relative AND within
its own grading tolerance absolute (the tolerance is half a unit in the sixth
decimal; two independent float chains over a many-row ledger cannot promise a
tenth of that on a value of hundreds of millions, so the bar is the grading
tolerance itself, and the worst disagreement is printed in tolerances).

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
ENG = os.environ.get('EC7_ENGINES', '/root/wt-ec7-nextgen/packages/engines')
sys.path.insert(0, os.path.join(ENG, 'tools', 'validation', 'economics'))
PLANT = '--plant' in sys.argv
PLANTED_KEY = 'nkemdi_2031_cpr_deferred_usd'
T0 = time.time()

try:
    import oracle_pia2021 as O  # noqa: E402
except Exception as e:  # pragma: no cover
    print(f'REFUSED: the vendored oracle could not be imported from {ENG} ({e})')
    sys.exit(2)

fields = json.load(open(os.path.join(HERE, 'fields.json')))
if len(fields) != 18:
    print('REFUSED: fields.json does not carry eighteen fields')
    sys.exit(2)
inp = json.loads(subprocess.run(['node', os.path.join(HERE, 'pia_capstone.mjs'), '--inputs'],
                                capture_output=True, text=True, check=True, env=dict(os.environ)).stdout)


def run(name):
    c = inp[name]
    return O.ledger(c['cfg'], c['prodRows'], c['capexRows'], c['opexRows'])


def row(led, y):
    return next(r for r in led['rows'] if r['year'] == y)


od, nk, al = run('ODOZI'), run('NKEMDI'), run('ALAKU')
got = {
    'odozi_2028_liquids_royalty_rate': row(od, 2028)['royalty_rate_liquids'],
    'odozi_2029_production_royalty_usd': row(od, 2029)['production_royalty'],
    'odozi_2030_hct_usd': row(od, 2030)['hct_tax'],
    'odozi_2031_dev_levy_usd': row(od, 2031)['dev_levy_tax'],
    'odozi_total_cit_usd': od['kpis']['total_cit'],
    'odozi_government_take_pct': od['kpis']['government_take_pct'],
    'nkemdi_2028_liquids_royalty_usd': row(nk, 2028)['liquids_production_royalty'],
    'nkemdi_2029_production_allowance_usd': row(nk, 2029)['production_allowance'],
    'nkemdi_2029_hct_chargeable_profit_usd': row(nk, 2029)['hct_chargeable_profit'],
    'nkemdi_2031_cpr_deferred_usd': row(nk, 2031)['cpr_deferred_to_next'],
    'nkemdi_cpr_forfeited_usd': nk['kpis'].get('cpr_forfeited_at_cessation', 0.0),
    'nkemdi_total_cit_usd': nk['kpis']['total_cit'],
    'alaku_2026_total_royalty_usd': row(al, 2026)['royalty'],
    'alaku_2026_hct_chargeable_profit_usd': row(al, 2026)['hct_chargeable_profit'],
    'alaku_2025_tet_usd': row(al, 2025)['tet_tax'],
    'alaku_2027_dev_levy_usd': row(al, 2027)['dev_levy_tax'],
    'alaku_2028_cit_usd': row(al, 2028)['cit_tax'],
    'alaku_total_cit_usd': al['kpis']['total_cit'],
}
graded = {k: (v, tol) for _, k, v, tol in fields}
if set(got) != set(graded):
    print(f'REFUSED: the oracle computed {sorted(set(got))} against {sorted(set(graded))}')
    sys.exit(2)

if PLANT:
    got[PLANTED_KEY] = got[PLANTED_KEY] + 10 * graded[PLANTED_KEY][1]

if '--json' in sys.argv:
    # For gen_golive.py: the oracle's value for every field, with the oracle
    # module it came from. Nothing else is printed, and the run still refuses
    # (exit 1) when any value disagrees with fields.json.
    out = {k: {'value': float(got[k]), 'oracle': 'tools/validation/economics/oracle_pia2021.py'} for _, k, _v, _t in fields}
    dis = [k for _, k, v, tol in fields if not (abs(float(got[k]) - v) / max(abs(v), 1e-300) <= 1e-12 and abs(float(got[k]) - v) <= tol)]
    print(json.dumps(out))
    sys.exit(1 if dis else 0)

worst_rel = worst_tol = 0.0
bad = []
print(f'{"field":40s} {"engine (fields.json)":>24s} {"oracle":>24s} {"relative":>10s} {"abs/tol":>9s}  within')
for _, k, v, tol in fields:
    o = float(got[k])
    rel = abs(o - v) / max(abs(v), 1e-300)
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
