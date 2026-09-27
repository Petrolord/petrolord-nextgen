#!/usr/bin/env python3
"""THE EIGHTEEN GRADED EC11 ANSWERS, RECOMPUTED BY THE VENDORED STDLIB ORACLE.

fields.json is written from the JavaScript engine. This replays the three
capstone cases through tools/validation/economics/oracle_prms.py (python
standard library only), which reads no JavaScript and takes its own road: the
PRMS 2.1 decision list written out as data; categories and reconciliations on
exact Fractions; the economic limit as an annual ledger on Fractions per case
(revenue, royalty, opex, capex, straight-line allowances, the loss pool, tax,
ADR at the last kept year, NPV as an exact Fraction sum) with the trailing-year
trim coded from the rule and the PRMS 3.1.3.1 peak read off the untrimmed
ledger; the closed-form low and high estimates of a stated lognormal, normal
and triangular; the risked mean as a Fraction sum. Nothing the engine returned
is handed to it except the typed capstone terms.

THE ORACLE'S OWN HELPERS. oracle_prms.py imports its formatting and refusal
helpers from oracle_jointventure.py and mulberry32 and the quantile from
oracle_screening.py. NextGen vendors older blobs of those two files than
engines bb8ef5f; the oracle reproduces all 139 cases of the vendored golden
identically on them (checked when the closure was vendored), and no field
here reads a Monte Carlo figure.

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
ENG = os.environ.get('EC11_ENGINES', '/root/wt-ec11-nextgen/packages/engines')
sys.path.insert(0, os.path.join(ENG, 'tools', 'validation', 'economics'))
PLANT = '--plant' in sys.argv
PLANTED_KEY = 'awkuzu_p2_boe'
T0 = time.time()

try:
    import oracle_prms as O  # noqa: E402
except Exception as e:  # pragma: no cover
    print(f'REFUSED: the vendored oracle could not be imported from {ENG} ({e})')
    sys.exit(2)

fields = json.load(open(os.path.join(HERE, 'fields.json')))
if len(fields) != 18:
    print('REFUSED: fields.json does not carry eighteen fields')
    sys.exit(2)
inp = json.loads(subprocess.run(['node', os.path.join(HERE, 'prms_capstone.mjs'), '--inputs'],
                                capture_output=True, text=True, check=True, env=dict(os.environ)).stdout)


def run(fn, args):
    r = O.run(fn, json.loads(json.dumps(args)))
    if isinstance(r, tuple):
        r = r[0]
    if isinstance(r, dict) and r.get('error') is True:
        print(f'REFUSED: the oracle refused a capstone call: {r["field"]}: {r["message"]}')
        sys.exit(2)
    return r


def label(rows, lab):
    return next(x['value'] for x in rows if x['label'] == lab)


ab, aw, isf = inp['ABAGANA'], inp['AWKUZU'], inp['ISUOFIA']
abr = run('categorize', ab['categorize:reserves'])
abc = run('categorize', ab['categorize:contingent'])
awe = run('economicLimit', aw['economicLimit'])
isr = run('aggregate', isf['aggregate:reserves'])
isc = run('aggregate', isf['aggregate:contingent'])
isq = run('reconcile', isf['reconcile'])
got = {
    'abagana_prospect_pc_pct': run('classify', ab['classify:prospect'])['chanceOfCommercialityPct'],
    'abagana_lead_pc_pct': run('classify', ab['classify:lead'])['chanceOfCommercialityPct'],
    'abagana_reserves_p2': label(abr['incremental'], 'Probable (P2)'),
    'abagana_reserves_p3': label(abr['incremental'], 'Possible (P3)'),
    'abagana_contingent_2c': label(abc['cumulative'], '2C'),
    'abagana_contingent_3c': label(abc['cumulative'], '3C'),
    'awkuzu_best_ncf_share': awe['cases']['best']['undiscountedNetCashFlowShare'],
    'awkuzu_best_npv_share': awe['cases']['best']['npvShare'],
    'awkuzu_2p_net_oil': awe['reserves']['cumulative']['2P']['oil'],
    'awkuzu_p2_boe': awe['reserves']['incremental']['P2']['boe'],
    'awkuzu_p3_boe': awe['reserves']['incremental']['P3']['boe'],
    'awkuzu_high_beyond_licence_oil': awe['cases']['high']['beyondLicence']['oil'],
    'isuofia_reserves_arith_1p': isr['arithmetic']['low'],
    'isuofia_reserves_arith_3p': isr['arithmetic']['high'],
    'isuofia_contingent_risked_mean': isc['riskedMean'],
    'isuofia_closing_1p': isq['computedClosing']['low'],
    'isuofia_closing_3p': isq['computedClosing']['high'],
    'isuofia_difference_2p': isq['difference']['best'],
}
graded = {k: (v, tol) for _, k, v, tol in fields}
if set(got) != set(graded):
    print(f'REFUSED: the oracle computed {sorted(set(got))} against {sorted(set(graded))}')
    sys.exit(2)

if PLANT:
    got[PLANTED_KEY] = got[PLANTED_KEY] + 10 * graded[PLANTED_KEY][1]

# A difference is a small figure made of large ones (a stated closing less a
# computed one), so its relative bound is taken against the size of the
# figures it is made of: the opening 2P of the reconciliation.
SCALE = {'isuofia_difference_2p': float(isf['reconcile']['opening']['best'])}

if '--json' in sys.argv:
    out = {k: {'value': float(got[k]), 'oracle': 'tools/validation/economics/oracle_prms.py'} for _, k, _v, _t in fields}
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
