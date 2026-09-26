#!/usr/bin/env python3
"""THE EIGHTEEN GRADED SC2 ANSWERS, RECOMPUTED BY THE VENDORED STDLIB ORACLE.

fields.json is written from the JavaScript engine. This replays the three
capstone datasets through tools/validation/supplychain/oracle_tender.py
(python standard library only: money, scores, content percentages, the
life-cycle net present cost and the Monte Carlo accumulators in exact
Fractions; its own ranking with the 12-digit tie key by Decimal ROUND_HALF_UP;
mulberry32 in unsigned 32-bit integers; the triangular inverse CDF from the
CDF's definition; the wellCost duration forms and the AFE rollup re-derived;
the partner split as 100 less the partner interests; the ALB standard
deviation by exact variance and Decimal square root), which was written
independently of the engine from the published rules.

EVERY CHAIN IS THE ORACLE'S OWN. The oracle's evaluated costs feed its own
ALB test and its own should-cost ratios; its own content percentages feed its
own s.14 call. Nothing the engine returned is handed to the oracle except the
typed capstone inputs.

ONE AGREEMENT FOR EVERY FIELD. Each must agree to 1e-10 relative AND to a
tenth of its own grading tolerance absolute.

    python3 oracle_check.py [--plant | --json]

--json prints {key: {value, oracle}} for gen_golive.py and nothing else.

--plant is THE NEGATIVE CONTROL: it perturbs one graded value by ten
tolerances before comparing, and must exit 1 naming it.

Exit 0 clean, 1 a disagreement, 2 could not run.
"""
import copy
import json
import os
import subprocess
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
ENG = os.environ.get('SC2_ENGINES', '/root/wt-sc2-nextgen/packages/engines')
sys.path.insert(0, os.path.join(ENG, 'tools', 'validation', 'supplychain'))
PLANT = '--plant' in sys.argv
PLANTED_KEY = 'umuahia_s14_lead_relative'
T0 = time.time()

try:
    import oracle_tender as O  # noqa: E402
except Exception as e:  # pragma: no cover
    print(f'REFUSED: the vendored oracle could not be imported from {ENG} ({e})')
    sys.exit(2)

fields = json.load(open(os.path.join(HERE, 'fields.json')))
if len(fields) != 18:
    print('REFUSED: fields.json does not carry eighteen fields')
    sys.exit(2)
graded = {k: (v, tol) for _, k, v, tol in fields}
env = dict(os.environ)
inp = json.loads(subprocess.run(['node', os.path.join(HERE, 'sc2_capstone.mjs'), '--inputs'], capture_output=True, text=True, check=True, env=env).stdout)
ON, UM, OK = inp['ONITSHA'], inp['UMUAHIA'], inp['OKIGWE']
D = O.DESCRIPTIONS


def refused(r, what):
    if isinstance(r, dict) and r.get('error'):
        print(f'REFUSED: the oracle refused {what}: {r["error"]}')
        sys.exit(2)
    return r


got = {}
# ---- ONITSHA
on = refused(O.evaluate_tender(copy.deepcopy(ON), D), 'ONITSHA evaluate_tender')
row = lambda rows, i: next(b for b in rows if b['id'] == i)  # noqa: E731
got['onitsha_on3_technical_percent'] = row(on['technical']['bids'], 'ON3')['technicalPercent']
got['onitsha_on2_corrected_price'] = row(on['commercial']['bids'], 'ON2')['correctedPrice']
got['onitsha_on3_omission_amount'] = row(on['commercial']['bids'], 'ON3')['omissions'][0]['amount']
got['onitsha_on1_evaluated_cost'] = row(on['commercial']['bids'], 'ON1')['evaluatedCost']
got['onitsha_on2_commercial_score'] = row(on['ranking']['bids'], 'ON2')['commercialScore']
got['onitsha_top_combined_score'] = on['ranking']['bids'][0]['combinedScore']

# ---- UMUAHIA
weights = lambda b: {l['id']: l['quotedAmount'] for l in b['lines'] if l['id'] != 'inspection'}  # noqa: E731
nc = refused(O.nigerian_content({'items': copy.deepcopy(UM['ncItems']), 'bids': [{'id': b['id'], 'items': copy.deepcopy(b['nc']), 'weights': weights(b)} for b in UM['bids']]}, D), 'UMUAHIA nigerian_content')
pct = {b['id']: b['ncPct'] for b in nc['bids']}
bids = []
for b in UM['bids']:
    c = copy.deepcopy(b)
    del c['nc']
    c['ncPct'] = pct[b['id']]
    bids.append(c)
args = {'criteria': UM['criteria'], 'passMark': UM['passMark'], 'omissionRule': UM['omissionRule'], 'schedule': UM['schedule'],
        'lifeCycle': UM['lifeCycle'], 'award': 'lowest-cost', 'bids': bids, 'nigerianContent': {'ncLeadBasis': 'points'}}
um = refused(O.evaluate_tender(copy.deepcopy(args), D), 'UMUAHIA evaluate_tender points')
args['nigerianContent'] = {'ncLeadBasis': 'relative'}
umr = refused(O.evaluate_tender(copy.deepcopy(args), D), 'UMUAHIA evaluate_tender relative')
got['umuahia_um2_life_cycle_cost'] = row(um['commercial']['bids'], 'UM2')['lifeCycleCost']
got['umuahia_um4_evaluated_cost'] = row(um['commercial']['bids'], 'UM4')['evaluatedCost']
alb = refused(O.abnormally_low({'bids': [{'id': b['id'], 'evaluatedCost': b['evaluatedCost']} for b in um['commercial']['bids']]}), 'UMUAHIA abnormally_low')
got['umuahia_alb_limit'] = alb['limit']
got['umuahia_um3_overall_content'] = pct['UM3']
got['umuahia_s14_lead_points'] = um['contentPreference']['section14']['lead']
got['umuahia_s14_lead_relative'] = umr['contentPreference']['section14']['lead']

# ---- OKIGWE
ct = refused(O.contract_types(copy.deepcopy(OK['contracting'])), 'OKIGWE contract_types')
okt = refused(O.evaluate_tender(copy.deepcopy(OK['tender']), D), 'OKIGWE evaluate_tender')
sc_args = copy.deepcopy(OK['shouldCost'])
sc_args['bids'] = [{'id': b['id'], 'evaluatedCost': b['evaluatedCost']} for b in okt['commercial']['bids']]
sc = refused(O.should_cost(sc_args), 'OKIGWE should_cost')
got['okigwe_dayrate_mean_cost'] = ct['types']['dayRate']['companyCost']['mean']
got['okigwe_reimbursable_p90_cost'] = ct['types']['reimbursable']['companyCost']['p90']
got['okigwe_dayrate_company_pays'] = ct['types']['dayRate']['overrun']['companyPays']
got['okigwe_should_cost_estimate'] = sc['estimate']
got['okigwe_operator_amount'] = sc['split']['operatorAmount']
got['okigwe_award_ratio'] = row(sc['bids'], okt['award'])['ratio']

if set(got) != set(graded):
    print(f'REFUSED: the oracle computed {sorted(set(got))} against {sorted(set(graded))}')
    sys.exit(2)

if PLANT:
    got[PLANTED_KEY] = got[PLANTED_KEY] + 10 * graded[PLANTED_KEY][1]

if '--json' in sys.argv:
    # For gen_golive.py: the oracle's value for every field, with the oracle
    # module it came from. Nothing else is printed, and the run still refuses
    # (exit 1) when any value disagrees with fields.json.
    out = {k: {'value': float(got[k]), 'oracle': 'tools/validation/supplychain/oracle_tender.py'} for _, k, _v, _t in fields}
    dis = [k for _, k, v, tol in fields if not (abs(float(got[k]) - v) / max(abs(v), 1e-300) <= 1e-10 and abs(float(got[k]) - v) <= tol / 10)]
    print(json.dumps(out))
    sys.exit(1 if dis else 0)

worst = 0.0
bad = []
print(f'{"field":34s} {"engine (fields.json)":>22s} {"oracle":>22s} {"relative":>10s} {"abs/tol":>9s}  within')
for _, k, v, tol in fields:
    o = float(got[k])
    rel = abs(o - v) / max(abs(v), 1e-300)
    worst = max(worst, rel)
    ok = rel <= 1e-10 and abs(o - v) <= tol / 10
    if not ok:
        bad.append(k)
    print(f'{k:34s} {v:22.15g} {o:22.15g} {rel:10.2e} {abs(o - v) / tol:9.2e}  {"yes" if ok else "NO"}')
print(f'oracle_check: 18 graded values replayed through the stdlib oracle in {time.time() - T0:.0f} s; '
      f'every chain the oracle\'s own; worst relative difference {worst:.2e}; disagreements: {len(bad)}')
if PLANT:
    print(f'NEGATIVE CONTROL: {PLANTED_KEY} was moved by ten tolerances; {"caught" if bad == [PLANTED_KEY] else "NOT CAUGHT as planted"}')
    sys.exit(1 if bad == [PLANTED_KEY] else 2)
sys.exit(1 if bad else 0)
