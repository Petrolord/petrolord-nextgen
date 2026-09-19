#!/usr/bin/env python3
"""GATE: an INDEPENDENT ORACLE computes every one of the eighteen graded fields.

Rule 4 of the brief: do not grade an output no oracle checks. The engines repo
carries a stdlib Python oracle per module, written from the rules rather than
from the JavaScript (FINDINGS-gasvalue.md says what each is independent of).
Its goldens show each graded EXPORT is covered; that is not yet proof that the
oracle reaches the same answer on THESE records. So this gate imports the
vendored oracles themselves and computes each graded field from the capstone
conditions with the oracle's own functions, chained oracle to oracle (the
credit breakeven is computed from the ORACLE's margin and the ORACLE's net
abatement, never from the engine's):

  oracle_flaretovalue.characterise  the gas in exact rationals carried in kg and
                                    m3: heating value, liquids, C3+ mass
  oracle_flaretovalue.flare         40 CFR 98.233(n) by moles, cross-checked by
                                    the rule's W-36 densities inside the oracle;
                                    CO2, CH4, CO2e and the recovered share
  oracle_flaretovalue.economics     product, margin per Mscf and the capital by
                                    the 0.9 power law
  oracle_flaretovalue.credits       the breakeven in closed form
  oracle_lpgcng.blend               the LPG blend on its three bases
  oracle_lpgcng.erlang_c            exact Erlang C in rationals on the floored
                                    positions
  oracle_lpgcng.mass                DAK by bisection on reduced density
  oracle_lpgcng.cascade             the cascade as a mass ledger by false
                                    position, conservation asserted

FOUR LEDGERS ARE TRANSCRIBED from the oracles' main() rather than called,
because the oracles compute them inline and export no function for them: the
net abatement (avoided - product + displaced, oracle_flaretovalue main()), the
LPG storage on a water-capacity basis (cap x 999.1 x fill / 1000,
oracle_lpgcng main()), the vaporizer's three terms and design margin, and the
conversion case's derived consumption, saving and payback (oracle_lpgcng
main()). Each is a one-line identity; RECON.md recommends exporting them, as
MD3-1 did for the supply wave.

WHAT IS COMPARED. Each oracle value must sit within the field's own grading
tolerance of the engine's value (one unit in the printed place, fields.json).
Where the engine rounds at the printed place the difference can reach half a
unit; the largest disagreement is printed in tolerances.

The capstone conditions are read out of gasvalue_fields_capstone.mjs by node
and handed over as JSON, so nothing is retyped here. The gauge pressures are
converted with the stated atmosphere, as the prompt instructs.

A second population: the digest's teaching records (EGBEMA's flare and CNG
route, KANO's storage and carousel, IBAFO's cascade) run through the same
oracles and are compared with the engine's figures, which are the digest's.

Negative control: --plant moves one oracle answer by ten tolerances and the
gate must go red on exactly that field.
"""
import json
import math
import os
import subprocess
import sys
from fractions import Fraction as Fr

WAVE = os.path.dirname(os.path.abspath(__file__))
ENG = os.environ.get('ET_ENGINES', '/root/wt-et-gasvalue-nextgen/packages/engines')
sys.path.insert(0, os.path.join(ENG, 'tools', 'validation', 'downstream'))
import oracle_flaretovalue as OF  # noqa: E402
import oracle_lpgcng as OL  # noqa: E402


def node_json(src):
    return json.loads(subprocess.run(['node', '--input-type=module', '-e', src],
                                     capture_output=True, text=True, check=True).stdout)


def exports(path):
    return node_json(f"""
const K = await import('{path}');
const out = {{}};
for (const [k, v] of Object.entries(K)) if (typeof v !== 'function') out[k] = v;
console.log(JSON.stringify(out));""")


K = exports(f'{WAVE}/gasvalue_fields_capstone.mjs')
T = exports(f'{WAVE}/gasvalue_fields.mjs')
FIELDS = json.load(open(os.path.join(WAVE, 'fields.json')))


def gas_of(rows):
    return OF.characterise([OF.component(code, y) for code, y in rows])


def flare_of(gas, p, rec=None):
    out, _ = OF.flare(gas, p['volumeMMscfd'], p['onstreamDays'], p['flareDestructionEfficiency'],
                      p.get('flareCombustionEfficiency'), p['gwpMethane'], rec)
    return out


def econ_of(gas, route, vol, days):
    case = {'routeId': route['id'], 'volumeMMscfd': vol, 'onstreamDays': days,
            **{k: route[k] for k in ('productUnitPerMscf', 'recoveryFraction', 'pricePerProductUnit',
                                     'referenceCapitalCost', 'referenceCapacityMMscfd',
                                     'fixedOpexPerYear', 'variableOpexPerMscf')}}
    return OF.economics(case, gas)


def storage_water(cap, fill):
    # transcribed from oracle_lpgcng main(): water-capacity basis
    return float(Fr(str(cap)) * Fr('999.1') * Fr(str(fill)) / 1000)


def vaporizer(v, latent):
    # transcribed from oracle_lpgcng main(): three terms, then the margin
    terms = [v['massFlowKgHr'] * v['liquidCpKJkgK'] * (v['boilingPointC'] - v['inletTempC']),
             v['massFlowKgHr'] * latent,
             v['massFlowKgHr'] * v['vapourCpKJkgK'] * (v['outletTempC'] - v['boilingPointC'])]
    return sum(terms) / 3600 * (1 + v['designMarginPercent'] / 100)


def conversion(c):
    # transcribed from oracle_lpgcng main(): energy equivalence, saving, payback
    b, n = c['baseFuel'], c['newFuel']
    nc = Fr(str(b['consumptionPer100Km'])) * Fr(str(b['energyPerUnitMJ'])) / (Fr(str(n['energyPerUnitMJ'])) * Fr(str(n['efficiencyRatio'])))
    km = Fr(str(c['annualDistanceKm']))
    base_cost = Fr(str(b['consumptionPer100Km'])) / 100 * km * Fr(str(b['pricePerUnit']))
    new_cost = nc / 100 * km * Fr(str(n['pricePerUnit']))
    saving = base_cost - new_cost - Fr(str(c['annualExtraMaintenance']))
    return float(Fr(str(c['conversionCost'])) / saving)


def capstone():
    out = {}
    # ERIEMU
    g = gas_of(K['ERIEMU_GAS'])
    fl = flare_of(g, K['ERIEMU_FLARE'])
    out['eriemu_ghv_btu_scf'] = g['ghvBtuScf']
    out['eriemu_gpm_c3plus'] = g['gpmC3Plus']
    out['eriemu_c3plus_kg_per_mscf'] = g['c3PlusKgPerMscf']
    out['eriemu_flare_co2_t'] = fl['flareCo2Tonnes']
    out['eriemu_flare_ch4_t'] = fl['flareCh4Tonnes']
    out['eriemu_flare_co2e_t'] = fl['flareCo2eTonnes']
    # ADIBAWA
    ga = gas_of(K['ADIBAWA_GAS'])
    fa = K['ADIBAWA_FLARE']
    route = K['ADIBAWA_ROUTE']
    ec = econ_of(ga, route, fa['volumeMMscfd'], fa['onstreamDays'])
    fla = flare_of(ga, fa, route['recoveryFraction'])
    cf = K['ADIBAWA_COUNTERFACTUAL']
    net = fla['avoidedFlareCo2eTonnes'] - cf['productCombustionTonnesCo2ePerYear'] + cf['displacedFuelTonnesCo2ePerYear']
    cr = OF.credits(net, K['ADIBAWA_CREDITS']['creditPrices'], ec['grossMarginPerYear'], K['ADIBAWA_CREDITS']['hurdleMarginPerYear'])
    out['adibawa_capital_usd'] = ec['capitalCost']
    out['adibawa_cng_kg_per_year'] = ec['productPerYear']
    out['adibawa_value_per_mscf'] = ec['valuePerMscf']
    out['adibawa_avoided_co2e_t'] = fla['avoidedFlareCo2eTonnes']
    out['adibawa_net_abatement_t'] = net
    out['adibawa_breakeven_credit_usd_per_t'] = cr['breakevenCreditPrice']
    # ASABA
    bl = OL.blend(K['ASABA_LPG'])
    v = K['ASABA_VESSEL']
    out['asaba_usable_lpg_t'] = storage_water(v['vesselCapacityM3'], v['maxFillRatio'])
    out['asaba_vaporizer_design_kw'] = vaporizer(K['ASABA_VAPORIZER'], bl['latentHeatKJkg'])
    b = K['ASABA_BOTTLING']
    c = math.floor(Fr(b['positions']) * Fr(str(b['availabilityFraction'])))
    out['asaba_carousel_wait_min'] = OL.erlang_c(Fr(b['cylindersPerDay']) / Fr(str(b['shiftHoursPerDay'])), b['fillMinutesPerCylinder'], c)['averageWaitMinutes']
    cng, atm = K['ASABA_CNG'], K['ASABA_CNG']['atmosphereBar']
    sb = K['ASABA_STORAGE_BANK']
    out['asaba_bank_mass_kg'] = OL.mass(sb['volumeM3'], sb['gaugeBar'] + atm, cng['temperatureC'], cng['gasSg'])
    cs = K['ASABA_CASCADE']
    banks = [{'label': x['label'], 'volumeM3': x['volumeM3'], 'pressureBar': x['gaugeBar'] + atm} for x in cs['banks']]
    cas = OL.cascade(banks, cs['vehicleTankM3'], cs['vehicleStartGaugeBar'] + atm, cs['vehicleTargetGaugeBar'] + atm,
                     cng['temperatureC'], cng['gasSg'])
    out['asaba_left_in_banks_kg'] = cas['leftInBanksKg']
    out['asaba_payback_years'] = conversion(K['ASABA_CONVERSION'])
    return out


def teaching():
    """The digest's own records through the same oracles, against the engine."""
    eng = node_json(f"""
const E = '{ENG}';
const F = await import(E + '/engines/downstream/flareToValue.js');
const L = await import(E + '/engines/downstream/lpgCng.js');
const T = await import('{WAVE}/gasvalue_fields.mjs');
const {{ components }} = await import('{WAVE}/gasvalue_capstone.mjs');
const g = F.characteriseGas({{ components: components(T.EGBEMA_GAS) }});
const a = F.abatement({{ gas: g, ...T.EGBEMA_PARCEL, recoveryFraction: T.EGBEMA_ROUTES.cng.recoveryFraction, ...T.EGBEMA_COUNTERFACTUALS[0] }});
const e = F.routeEconomics({{ route: F.ROUTE_TEMPLATES[0], gas: g, volumeMMscfd: T.EGBEMA_PARCEL.volumeMMscfd, onstreamDays: T.EGBEMA_PARCEL.onstreamDays, ...T.EGBEMA_ROUTES.cng }});
const cr = F.creditSensitivity({{ netAbatementTonnesCo2ePerYear: a.netAbatementTonnesCo2ePerYear, grossMarginPerYear: e.grossMarginPerYear, ...T.EGBEMA_CREDITS }});
const bp = L.bottlingPlant(T.KANO_BOTTLING);
const c = L.cascadeFills({{ banks: T.IBAFO_BANKS, ...T.IBAFO_VEHICLE, ...T.IBAFO_GAS }});
console.log(JSON.stringify({{ ghv: g.ghvBtuScf, gpm: g.gpmC3Plus, co2: a.flareCo2Tonnes, ch4: a.flareCh4Tonnes, co2e: a.flareCo2eTonnes,
  net: a.netAbatementTonnesCo2ePerYear, value: e.valuePerMscf, capex: e.capitalCost, breakeven: cr.breakevenCreditPrice,
  wait: bp.queue.averageWaitMinutes, fills: c.fillsBeforeRecharge, left: c.leftInBanksKg }}));""")
    g = gas_of(T['EGBEMA_GAS'])
    fl = flare_of(g, T['EGBEMA_PARCEL'], T['EGBEMA_ROUTES']['cng']['recoveryFraction'])
    cf = T['EGBEMA_COUNTERFACTUALS'][0]
    net = fl['avoidedFlareCo2eTonnes'] - cf['productCombustionTonnesCo2ePerYear'] + cf['displacedFuelTonnesCo2ePerYear']
    ec = econ_of(g, {'id': 'cng', **T['EGBEMA_ROUTES']['cng']}, T['EGBEMA_PARCEL']['volumeMMscfd'], T['EGBEMA_PARCEL']['onstreamDays'])
    cr = OF.credits(net, T['EGBEMA_CREDITS']['creditPrices'], ec['grossMarginPerYear'], T['EGBEMA_CREDITS']['hurdleMarginPerYear'])
    b = T['KANO_BOTTLING']
    q = OL.erlang_c(Fr(b['cylindersPerDay']) / Fr(str(b['shiftHoursPerDay'])), b['fillMinutesPerCylinder'],
                    math.floor(Fr(b['positions']) * Fr(str(b['availabilityFraction']))))
    cas = OL.cascade(T['IBAFO_BANKS'], T['IBAFO_VEHICLE']['vehicleTankM3'], T['IBAFO_VEHICLE']['vehicleStartBar'],
                     T['IBAFO_VEHICLE']['vehicleTargetBar'], T['IBAFO_GAS']['temperatureC'], T['IBAFO_GAS']['gasSg'])
    orc = {'ghv': g['ghvBtuScf'], 'gpm': g['gpmC3Plus'], 'co2': fl['flareCo2Tonnes'], 'ch4': fl['flareCh4Tonnes'],
           'co2e': fl['flareCo2eTonnes'], 'net': net, 'value': ec['valuePerMscf'], 'capex': ec['capitalCost'],
           'breakeven': cr['breakevenCreditPrice'], 'wait': q['averageWaitMinutes'], 'fills': cas['fillsBeforeRecharge'],
           'left': cas['leftInBanksKg']}
    tol = {'ghv': 1e-4, 'gpm': 1e-4, 'co2': 1e-3, 'ch4': 1e-3, 'co2e': 1e-3, 'net': 1e-3, 'value': 1e-4, 'capex': 1e-2,
           'breakeven': 1e-4, 'wait': 1e-4, 'fills': 0, 'left': 1e-3}
    bad = 0
    for k in orc:
        d = abs(orc[k] - eng[k])
        ok = d <= tol[k]
        bad += 0 if ok else 1
        print(f'  teaching {k:<10} engine {eng[k]!r:<22} oracle {orc[k]!r:<24} {"ok" if ok else "DIFFERS"}')
    return bad


def main():
    orc = capstone()
    if '--plant' in sys.argv:
        orc['adibawa_net_abatement_t'] += 10 * [f[3] for f in FIELDS if f[1] == 'adibawa_net_abatement_t'][0]
    ok, worst = 0, 0.0
    for tier, key, val, tol in FIELDS:
        o = orc[key]
        d = abs(o - val)
        worst = max(worst, d / tol)
        good = d <= tol
        ok += 1 if good else 0
        print(f'  {tier:<13} {key:<36} engine {val!r:<22} oracle {o!r:<24} {d / tol:.3g} tolerances {"ok" if good else "OUT"}')
    bad_t = teaching()
    print(f'  largest disagreement: {worst:.3g} of a tolerance; teaching records disagreeing: {bad_t}')
    print(f'graded fields the oracle reproduces within tolerance: {ok} of {len(FIELDS)}')
    if len(FIELDS) != 18 or len(orc) != 18:
        print('GATE REFUSES: it examined too little to have checked anything')
        return 2
    return 0 if ok == 18 and bad_t == 0 else 1


sys.exit(main())
