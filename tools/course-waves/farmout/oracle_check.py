#!/usr/bin/env python3
"""THE EIGHTEEN GRADED EC10 ANSWERS, RECOMPUTED BY THE VENDORED STDLIB ORACLE.

fields.json is written from the JavaScript engine. This replays the three
capstone cases through tools/validation/economics/oracle_farmout.py (python
standard library only), which reads no JavaScript and takes its own road:
Fractions throughout; the cost split as a dollar ledger cut into the promoted
segment and the excess, each with its own payer table; EMV straight from the
payoffs with no tree; interest times value with no applyJV; the break-even
promote by exact bisection; Bayes on Fractions; the development carry and the
back-in through the EC9 oracle it imports as its witness. Nothing the engine
returned is handed to it except the typed capstone terms.

ONE AGREEMENT FOR EVERY FIELD. Each must agree to 1e-12 relative AND within
its own grading tolerance absolute (the tolerance is half a unit in the sixth
decimal), and the worst disagreement is printed in tolerances. The one looser
relative bound is the break-even share, which the oracle bisects to a
Fraction interval 2^-200 wide: it too must land within 1e-12.

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
ENG = os.environ.get('EC10_ENGINES', '/root/wt-ec10-nextgen/packages/engines')
sys.path.insert(0, os.path.join(ENG, 'tools', 'validation', 'economics'))
PLANT = '--plant' in sys.argv
PLANTED_KEY = 'umunze_amg_emv'
T0 = time.time()

try:
    import oracle_farmout as O  # noqa: E402
except Exception as e:  # pragma: no cover
    print(f'REFUSED: the vendored oracle could not be imported from {ENG} ({e})')
    sys.exit(2)

fields = json.load(open(os.path.join(HERE, 'fields.json')))
if len(fields) != 18:
    print('REFUSED: fields.json does not carry eighteen fields')
    sys.exit(2)
inp = json.loads(subprocess.run(['node', os.path.join(HERE, 'farmout_capstone.mjs'), '--inputs'],
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


og, um, ak = inp['OGBAKU'], inp['UMUNZE'], inp['AKPUGO']
oge = run('earningObligation', og['earning'])
ume = run('earningObligation', um['earning'])
umd = run('dealValue', um['deal'])
aki = run('informationValue', ak['information'])
akp = run('interestValue', ak['price'])
got = {
    'ogbaku_ihe_well_payment': oge['events'][0]['farmineePays'],
    'ogbaku_ogb_well_payment': oge['events'][0]['farmorPays'],
    'ogbaku_promote_ratio': oge['events'][0]['promoteRatio'],
    'ogbaku_carry': oge['events'][0]['carry'],
    'ogbaku_consideration': oge['totals']['consideration'],
    'ogbaku_equivalent_wi_pct': oge['totals']['equivalentWorkingInterestPct'],
    'umunze_well1_amg_payment': ume['events'][0]['farmineePays'],
    'umunze_well2_umz_payment': ume['events'][1]['farmorPays'],
    'umunze_amg_emv': umd['farmineeSide']['farmIn']['emv'],
    'umunze_breakeven_share_pct': umd['breakEvenPromote']['farmineePaysPct'],
    'umunze_amg_breakeven_chance_pct': umd['breakEvenChance']['farminee']['chanceOfSuccessPct'],
    'umunze_consent_fee': run('consentFee', um['fee'])['fee'],
    'akpugo_ezi_evii': aki['evii'],
    'akpugo_strong_posterior_pct': aki['perSignal'][0]['posteriorSuccessPct'],
    'akpugo_risked_value_per_pct': akp['perPct']['risked'],
    'akpugo_price_to_value': akp['transaction']['priceToValue'],
    'akpugo_2035_carry_balance': yr(run('developmentCarry', ak['devCarry'])['ledger'], 2035)['closing'],
    'akpugo_backin_refund_to_obr': party(run('backInRight', ak['backIn'])['parties'], 'OBR')['refundReceived'],
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
    out = {k: {'value': float(got[k]), 'oracle': 'tools/validation/economics/oracle_farmout.py'} for _, k, _v, _t in fields}
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
