#!/usr/bin/env python3
"""GATE: an INDEPENDENT ORACLE computes every one of the eighteen graded fields.

Rule 4 of the brief: do not grade an output no oracle checks. The engines repo
carries two stdlib Python oracles for this scope, oracle_terminaldepot.py and
oracle_fuelpricing.py, written from the rules rather than from the JavaScript,
and their goldens show each graded EXPORT is covered. That is not yet proof
that the oracle reaches the same answer on THESE records, so this gate imports
the vendored oracles themselves and computes each graded field from the
capstone conditions, then compares with fields.json.

WHAT IS CALLED AND WHAT IS TRANSCRIBED, said plainly. Most fields go through a
FUNCTION the oracle exports:

  interp                 strapping-table interpolation by search (both tanks)
  horizontal_volume      the bullet's geometry, printed beside the table answer
  erlang_exact           Erlang C by the exact factorial form in rationals
  invoice                the cargo invoice over outturn litres, with insurance
                         on CIF by fixed-point iteration
  lane_ledger            the per-trip truck ledger
  fleet_search           the fleet by integer search
  pump                   the pump price walked element by element

Three computations live INSIDE the oracles' main() rather than in a function,
so they cannot be called with other inputs: the day ledger (expected close,
gap, tolerance; oracle_terminaldepot.py main, the `days` loop), the tank farm
(pumpable stock tank by tank, days of cover; the `farm` block) and the FX
breakeven (closed form; oracle_fuelpricing.py main). For the first two this
file TRANSCRIBES the oracle's own lines, marked below, which is the weakest
kind of coverage and is reported as such in RECON.md. The breakeven is not
transcribed: it is solved from the oracle's own invoice() and pump() by
linearity (the pump price is affine in the landed cost, and the landed cost is
linear in the exchange rate), which is the oracle's closed-form method run on
its own functions.

THE COMPARISON. The engine rounds several graded figures itself (CIF and the
landed total to the cent, the landed and pump prices to four decimals, the lane
cost to six); the oracle does not. So each field must agree with the oracle
within its own graded tolerance, the oracle's answer typed by a learner being
graded right, and the gate prints the largest disagreement as a fraction of the
tolerance.

Negative control: --plant moves one oracle answer by two tolerances and the
gate must go red on exactly that field.
"""
import json
import math
import os
import subprocess
import sys
from fractions import Fraction as Fr

WAVE = os.path.dirname(os.path.abspath(__file__))
ENG = os.environ.get('MD_ENGINES', '/root/wt-md-supply-nextgen/packages/engines')
sys.path.insert(0, os.path.join(ENG, 'tools', 'validation', 'downstream'))
import oracle_terminaldepot as OT  # noqa: E402
import oracle_fuelpricing as OF  # noqa: E402

K = json.loads(subprocess.run(['node', '--input-type=module', '-e', f"""
const K = await import('{WAVE}/supply_fields_capstone.mjs');
const out = {{}};
for (const [k, v] of Object.entries(K)) if (typeof v !== 'function') out[k] = v;
console.log(JSON.stringify(out));
"""], capture_output=True, text=True, check=True).stdout)
FIELDS = json.load(open(os.path.join(WAVE, 'fields.json')))

# ------------------------------ OKOMU -------------------------------
T1, T2, DY = K['OKOMU_T1'], K['OKOMU_T2'], K['OKOMU_DAY']
tab1, tab2 = K['OKOMU_T1_TABLE'], K['OKOMU_T2_TABLE']
g1 = OT.interp(tab1, T1['dipMm']) - OT.interp(tab1, T1['waterMm'])
g2 = OT.interp(tab2, T2['dipMm']) - OT.interp(tab2, T2['waterMm'])
s1, s2 = g1 * T1['vcfTyped'], g2 * T2['vcfTyped']
# TRANSCRIBED from oracle_terminaldepot.py main(), the `days` loop:
#   expected = opening + rec - dlv - known; gap = dipped - expected; through = rec + dlv
#   tolerance = through * tol / 100
expected = DY['openingM3'] + DY['receiptsM3'] - DY['deliveriesM3'] - DY['knownLossM3']
gap = (s1 + s2) - expected
through = DY['receiptsM3'] + DY['deliveriesM3']
tolerance = through * DY['tolerancePercentOfThroughput'] / 100

# ----------------------------- OGWASHI ------------------------------
R = K['OGWASHI_RACK']
q = OT.erlang_exact(R['arrivalsPerHour'], Fr(60) / Fr(R['loadMinutes']), R['bays'])
# TRANSCRIBED from oracle_terminaldepot.py main(), the `farm` block:
#   pumpableStockM3 = sum(max(0, stock - heel)); daysOfCover = pumpable / daily
pumpable = sum(max(0, t['stockM3'] - t['heelM3']) for t in K['OGWASHI_TANKS'])
cover = pumpable / K['OGWASHI_LIFTINGS_M3']
lane = OF.lane_ledger(K['OGWASHI_LANE'])
fleet = OF.fleet_search(K['OGWASHI_DEMAND_L_PER_DAY'], K['OGWASHI_LANE']['payloadLitres'], lane['tripsPerDay'])

# ------------------------------- ORON -------------------------------
C = K['ORON_CARGO']
assert K['ORON_INSURANCE_BASIS'] == 'percent_of_cif'
inv = OF.invoice(C['quantity'], C['densityKgM3'], C['fobPrice'], K['ORON_RATES'], C['oceanLossPercent'], C['fxRate'],
                 insurance_on='percent_of_cif')
EL = K['ORON_ELEMENTS']
REC = {'depot': 'Terminal', 'bridging': 'Chain', 'transport': 'Transporter', 'marketer': 'Marketer',
       'dealer': 'Dealer', 'levies': 'Government', 'vat': 'Government'}
elements = [(k, REC[k], 'percent_of_running' if k == 'vat' else 'per_litre', EL[k])
            for k in ['depot', 'bridging', 'transport', 'marketer', 'dealer', 'levies', 'vat']]
# The prompt starts the build-up from the landed cost per litre as the app carries
# it, to four decimals (the engine's own rounding of perLitreLocal).
landed4 = round(inv['perLitreLocal'], 4)
pp = OF.pump(landed4, elements)
# The breakeven by linearity on the oracle's own functions: price(fx) =
# pump(perLitreUsd * fx); pump is affine in its landed input.
p0 = OF.pump(0.0, elements)['price']
p1 = OF.pump(inv['perLitreUsd'], elements)['price']
fx_break = (K['ORON_CAP'] - p0) / (p1 - p0)

ORACLE = {
    'okomu_t1_gross_m3': ('oracle_terminaldepot.interp', g1),
    'okomu_t1_standard_m3': ('oracle_terminaldepot.interp x the typed VCF', s1),
    'okomu_t2_standard_m3': ('oracle_terminaldepot.interp x the typed VCF', s2),
    'okomu_expected_closing_m3': ('the oracle day ledger (transcribed)', expected),
    'okomu_unaccounted_m3': ('the oracle day ledger (transcribed) on the interp stocks', gap),
    'okomu_tolerance_m3': ('the oracle day ledger (transcribed)', tolerance),
    'ogwashi_rack_probability_of_waiting': ('oracle_terminaldepot.erlang_exact', q['probabilityOfWaiting']),
    'ogwashi_rack_mean_wait_min': ('oracle_terminaldepot.erlang_exact', q['averageWaitMinutes']),
    'ogwashi_pumpable_stock_m3': ('the oracle farm block (transcribed)', pumpable),
    'ogwashi_days_of_cover': ('the oracle farm block (transcribed)', cover),
    'ogwashi_cost_per_litre_delivered_ngn': ('oracle_fuelpricing.lane_ledger', lane['costPerLitreDelivered']),
    'ogwashi_trucks_required': ('oracle_fuelpricing.fleet_search', fleet['trucksRequired']),
    'oron_cif_usd': ('oracle_fuelpricing.invoice, insurance by fixed point', inv['cif']),
    'oron_landed_total_usd': ('oracle_fuelpricing.invoice', inv['totalUsd']),
    'oron_landed_per_litre_ngn': ('oracle_fuelpricing.invoice over outturn litres', inv['perLitreLocal']),
    'oron_pump_price_ngn': ('oracle_fuelpricing.pump', pp['price']),
    'oron_government_share_ngn': ('oracle_fuelpricing.pump byRecipient Government', pp['byRecipient']['Government']),
    'oron_breakeven_fx': ('closed form on oracle_fuelpricing.invoice and pump', fx_break),
}


def main():
    if '--plant' in sys.argv:
        m, v = ORACLE['ogwashi_days_of_cover']
        ORACLE['ogwashi_days_of_cover'] = (m, v + 0.02)
    bad, worst = [], (0.0, None)
    print(f'  {"field":<40} {"engine (fields.json)":>24} {"oracle":>24}  diff/tol  oracle method')
    for tier, key, val, tol in FIELDS:
        if key not in ORACLE:
            bad.append(f'{key} has no oracle computation')
            continue
        how, o = ORACLE[key]
        d = abs(val - o)
        r = d / tol
        if r > worst[0]:
            worst = (r, key)
        flag = '' if d <= tol else '  DISAGREES'
        print(f'  {key:<40} {val:>24.10f} {o:>24.10f}  {r:8.4f}  {how}{flag}')
        if d > tol:
            bad.append(f'{tier}.{key}: engine {val}, oracle {o}, |diff| {d:.3g} > tol {tol}')
    horiz_truth = (OT.horizontal_volume(T2['diameterM'], T2['lengthM'], T2['dipMm'])
                   - OT.horizontal_volume(T2['diameterM'], T2['lengthM'], T2['waterMm']))
    print(f'  OK-2 gross: the table answers {g2:.4f} m3 and the bullet geometry {horiz_truth:.4f} m3; the graded field is the table\'s answer')
    print(f'  fleet: the oracle searched {fleet["trucksRequired"]} trucks one at a time; the engine takes a ceiling')
    if len(ORACLE) != 18 or len(FIELDS) != 18:
        print('  GATE REFUSES: not eighteen fields')
        return 2
    for b in bad:
        print(f'  FAIL {b}')
    print(f'  fields compared: {len(FIELDS)}; disagreements beyond tolerance: {len(bad)}; '
          f'largest disagreement {worst[0]:.4f} of a tolerance ({worst[1]})')
    return 1 if bad else 0


sys.exit(main())
