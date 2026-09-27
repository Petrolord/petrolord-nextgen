#!/usr/bin/env python3
"""THE EIGHTEEN GRADED EC9 ANSWERS, RECOMPUTED BY THE VENDORED STDLIB ORACLE.

fields.json is written from the JavaScript engine. This replays the three
capstone cases through tools/validation/economics/oracle_jointventure.py
(python standard library only), which reads no JavaScript and takes its own
road: money as exact Fractions of the input doubles; interests as a
cost-bearing table built carry by carry; cash calls on a CUMULATIVE ledger;
overhead by first finding the band that holds the base; payout years for
premiums and refunds from cumulative availability; dates, weekdays and month
ends from datetime and calendar; the PSC order straight from the World Bank
and IMF texts with a limit on gross applied to gross, and nothing from
cashflow.ts; NPV as an exact Fraction sum. Nothing the engine returned is
handed to it except the typed capstone terms.

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
ENG = os.environ.get('EC9_ENGINES', '/root/wt-ec9-nextgen/packages/engines')
sys.path.insert(0, os.path.join(ENG, 'tools', 'validation', 'economics'))
PLANT = '--plant' in sys.argv
PLANTED_KEY = 'okwelle_default_interest'
T0 = time.time()

try:
    import oracle_jointventure as O  # noqa: E402
except Exception as e:  # pragma: no cover
    print(f'REFUSED: the vendored oracle could not be imported from {ENG} ({e})')
    sys.exit(2)

fields = json.load(open(os.path.join(HERE, 'fields.json')))
if len(fields) != 18:
    print('REFUSED: fields.json does not carry eighteen fields')
    sys.exit(2)
inp = json.loads(subprocess.run(['node', os.path.join(HERE, 'joa_capstone.mjs'), '--inputs'],
                                capture_output=True, text=True, check=True, env=dict(os.environ)).stdout)


def ok(r):
    if isinstance(r, dict) and r.get('error') is True:
        print(f'REFUSED: the oracle refused a capstone call: {r["field"]}: {r["message"]}')
        sys.exit(2)
    return r


def run(fn, args):
    return ok(O.run(fn, json.loads(json.dumps(args))))


def yr(rows, y):
    return next(x for x in rows if x['year'] == y)


def month(r, m):
    return next(x for x in r['months'] if x['month'] == m)


def party(rows, i):
    return next(x for x in rows if x['id'] == i)


idu, okw, ab = inp['IDUMU'], inp['OKWELLE'], inp['ABIAMA']
idcc = run('cashCalls', idu['cashCalls'])
idoh = run('overhead', idu['overhead'])
okd = run('defaultCover', okw['default'])
okcc = run('cashCalls', okw['cashCalls'])
abnc = run('nonConsent', ab['soleRisk'])
got = {
    'idumu_zed_paying_pct': party(run('participatingInterests', idu['interests'])['parties'], 'ZED')['payingPct'],
    'idumu_zed_june_call': party(month(idcc, '2029-06')['parties'], 'ZED')['call'],
    'idumu_zed_august_paid': party(month(idcc, '2029-08')['parties'], 'ZED')['paid'],
    'idumu_budget_allowed_overrun': run('budgetControl', idu['budget'])['total']['allowedOverrun'],
    'idumu_operating_overhead': next(c for c in idoh['categories'] if c['category'] == 'operating')['charge'],
    'idumu_development_overhead': next(c for c in idoh['categories'] if c['category'] == 'development')['charge'],
    'okwelle_2031_carry_balance': yr(run('carryRecovery', okw['carry'])['ledger'], 2031)['closing'],
    'okwelle_backin_refund_to_pra': party(run('backIn', okw['backIn'])['parties'], 'PRA')['refundReceived'],
    'okwelle_default_interest': okd['interestTotal'],
    'okwelle_default_cover_oko': party(okd['cover'], 'OKO')['cover'],
    'okwelle_prb_june_call': party(month(okcc, '2030-06')['parties'], 'PRB')['call'],
    'okwelle_2032_cost_recovered': yr(run('pscCostRecovery', okw['psc'])['years'], 2032)['costRecovered'],
    'abiama_spb_premium': party(abnc['nonConsenting'], 'SPB')['premium'],
    'abiama_spb_2036_receipt': yr(party(abnc['recovery'], 'SPB')['ledger'], 2036)['nonConsentingReceives'],
    'abiama_buy_in_to_spa': party(run('nonConsent', ab['buyIn'])['buyIn'][0]['toParties'], 'SPA')['amount'],
    'abiama_spa_carry_npv': party(run('carryRecovery', ab['carry'])['npv'], 'SPA')['npv'],
    'abiama_2035_government_profit_oil': yr(run('pscCostRecovery', ab['psc'])['years'], 2035)['governmentProfitOil'],
    'abiama_abo_after_forfeiture_pct': party(run('defaultCover', ab['default'])['interestsAfterForfeiture'], 'ABO')['participatingPct'],
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
    out = {k: {'value': float(got[k]), 'oracle': 'tools/validation/economics/oracle_jointventure.py'} for _, k, _v, _t in fields}
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
