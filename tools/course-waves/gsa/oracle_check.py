#!/usr/bin/env python3
"""THE EIGHTEEN GRADED EC8 ANSWERS, RECOMPUTED BY THE VENDORED STDLIB ORACLE.

fields.json is written from the JavaScript engine. This replays the three
capstone cases through tools/validation/economics/oracle_gascontract.py (python
standard library only), which reads no JavaScript and takes its own road:
quantities and money as exact Fractions of the input doubles, the take-or-pay
year as the model GSA formulas evaluated over a dated ledger of entries, the
window means as exact Fractions, the four-decimal rule on Decimal digits, the
gas royalty rate re-derived from the PIA Seventh Schedule para 10(6) without
importing cashflow.ts, and NPV as an exact Fraction sum. Nothing the engine
returned is handed to it except the typed capstone terms; the priced ledger
copies the ORACLE's own annual prices into the ORACLE's own ledger, by the
basis each case states.

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
ENG = os.environ.get('EC8_ENGINES', '/root/wt-ec8-nextgen/packages/engines')
sys.path.insert(0, os.path.join(ENG, 'tools', 'validation', 'economics'))
PLANT = '--plant' in sys.argv
PLANTED_KEY = 'ifeyi_2031_make_up_expired'
T0 = time.time()

try:
    import oracle_gascontract as O  # noqa: E402
except Exception as e:  # pragma: no cover
    print(f'REFUSED: the vendored oracle could not be imported from {ENG} ({e})')
    sys.exit(2)

fields = json.load(open(os.path.join(HERE, 'fields.json')))
if len(fields) != 18:
    print('REFUSED: fields.json does not carry eighteen fields')
    sys.exit(2)
inp = json.loads(subprocess.run(['node', os.path.join(HERE, 'gsa_capstone.mjs'), '--inputs'],
                                capture_output=True, text=True, check=True, env=dict(os.environ)).stdout)


def ok(r):
    if isinstance(r, dict) and r.get('error') is True:
        print(f'REFUSED: the oracle refused a capstone call: {r["field"]}: {r["message"]}')
        sys.exit(2)
    return r


BASIS = {'annual-average': 'averagePrice', 'last-month': 'lastMonthPrice'}


def priced(c):
    ps = ok(O.run('priceSeries', json.loads(json.dumps(c['price']))))
    by = {a['year']: a for a in ps['annual']}
    years = []
    for y in c['contract']['years']:
        a = by[y['year']]
        years.append(dict(y, contractPrice=a[BASIS[c['pricing']['contractPrice']]], topPrice=a[BASIS[c['pricing']['topPrice']]],
                          makeUpPrice=c['pricing']['makeUpPrice']))
    return ps, dict(c['contract'], years=years)


def yr(r, y):
    return next(x for x in r['years'] if x['year'] == y)


oz, ifc, nw = inp['OZUBU'], inp['IFEYI'], inp['NWAKA']
ozq = ok(O.run('contractQuantities', oz['quantities']))
ozd = ok(O.run('dailyBalance', oz['fortnight']))
ozt = ok(O.run('takeOrPay', oz['year']))
ifp, ifcon = priced(ifc)
ift = ok(O.run('takeOrPay', ifcon))
nwp, nwcon = priced(nw)
nwc = ok(O.run('gsaCashFlows', {'contract': nwcon, 'royalty': nw['royalty'], 'discountRate': nw['discountRate'], 'baseYear': nw['baseYear']}))
got = {
    'ozubu_march_2028_mmbtu': ok(O.run('toEnergy', oz['energy']))['mmbtu'],
    'ozubu_2028_acq': ozq['acq'],
    'ozubu_effective_swing': ozq['effectiveSwing'],
    'ozubu_fortnight_buyer_shortfall': ozd['annual']['buyerShortfall'],
    'ozubu_fortnight_seller_shortfall': ozd['annual']['sellerShortfall'],
    'ozubu_2029_deficiency_payment': yr(ozt, 2029)['deficiencyPayment'],
    'ifeyi_2030_average_price': next(a for a in ifp['annual'] if a['year'] == 2030)['averagePrice'],
    'ifeyi_2028_deficiency_payment': yr(ift, 2028)['deficiencyPayment'],
    'ifeyi_2031_make_up_taken': yr(ift, 2031)['makeUpTaken'],
    'ifeyi_2031_make_up_expired': sum(x['quantity'] for x in yr(ift, 2031)['makeUpExpired']),
    'ifeyi_total_net_to_seller': ift['totals']['netToSeller'],
    'ifeyi_2031_dgdo_penalty': ok(O.run('domesticGasObligation', ifc['dgdo']))['penalty'],
    'nwaka_july_2029_price': next(m for m in nwp['months'] if m['month'] == '2029-07')['price'],
    'nwaka_2034_average_price': next(a for a in nwp['annual'] if a['year'] == 2034)['averagePrice'],
    'nwaka_2030_carry_forward_credit': yr(nwc['takeOrPay'], 2030)['carryForwardApplied'],
    'nwaka_2035_refund': yr(nwc['takeOrPay'], 2035)['refund'],
    'nwaka_npv_seller_revenue': nwc['npvSellerRevenue'],
    'nwaka_2032_royalty': yr(nwc, 2032)['royalty'],
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
    out = {k: {'value': float(got[k]), 'oracle': 'tools/validation/economics/oracle_gascontract.py'} for _, k, _v, _t in fields}
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
