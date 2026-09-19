#!/usr/bin/env python3
"""GATE: an INDEPENDENT ORACLE computes every one of the eighteen graded fields.

Rule 4 of the brief: do not grade an output no oracle checks. The engines repo
carries two stdlib Python oracles for this scope, oracle_carbonabatement.py and
oracle_energyefficiency.py, written from the rules rather than from the
JavaScript. This gate imports the vendored oracles themselves, computes each
graded field from the capstone conditions, and compares with fields.json.

WHAT IS CALLED, said plainly. Every field goes through a FUNCTION the oracle
exports:

  oracle_carbonabatement.combustion      combustion by MASS in exact rationals
  oracle_carbonabatement.inventory       the inventory as a ledger
  oracle_carbonabatement.levelised       the cost per tonne from a PV ledger
  oracle_carbonabatement.curve           the curve by explicit rank
  oracle_carbonabatement.path            the path as a year ledger
  oracle_energyefficiency.species_ledger combustion as a species ledger
  oracle_energyefficiency.excess_by_bisection  excess air by bisection
  oracle_energyefficiency.efficiency     efficiency as a loss ledger
  oracle_energyefficiency.trap_nozzle    the trap as an isentropic nozzle
  oracle_energyefficiency.pinch_by_deficit     pinch by the largest deficit
  oracle_energyefficiency.levelised      the saving's cost per tonne

  oracle_energyefficiency.duty_ledger    the tuning saving as a duty ledger
                                         (exported in MD45-1; the foundation
                                         transcribed it from main())

THE COMPARISON. The engine rounds several graded figures itself (tonnes to six
decimals, percents to six, money to four); the oracle does not. Each field
must agree with the oracle within its own graded tolerance, and the gate
prints the largest disagreement as a fraction of the tolerance.

Negative control: --plant moves one oracle answer by two tolerances and the
gate must go red on exactly that field.
"""
import json
import os
import subprocess
import sys
from fractions import Fraction as Fr

WAVE = os.path.dirname(os.path.abspath(__file__))
ENG = os.environ.get('MD_ENGINES', '/root/wt-et-carbon-nextgen/packages/engines')
sys.path.insert(0, os.path.join(ENG, 'tools', 'validation', 'downstream'))
import oracle_carbonabatement as OC  # noqa: E402
import oracle_energyefficiency as OE  # noqa: E402

K = json.loads(subprocess.run(['node', '--input-type=module', '-e', f"""
const K = await import('{WAVE}/carbon_fields_capstone.mjs');
const out = {{}};
for (const [k, v] of Object.entries(K)) if (typeof v !== 'function') out[k] = v;
console.log(JSON.stringify(out));
"""], capture_output=True, text=True, check=True).stdout)
FIELDS = json.load(open(os.path.join(WAVE, 'fields.json')))
GWP = K['CAP_GWP']['values']

# ------------------------------ OWAZA -------------------------------
H, FL = K['OWAZA_HEATERS'], K['OWAZA_FLARE']
oh = OC.combustion(H['fuelKmolPerYear'], str(H['carbonPerKmolFuel']), str(H['destructionEfficiencyFraction']))
of = OC.combustion(FL['fuelKmolPerYear'], str(FL['carbonPerKmolFuel']), str(FL['destructionEfficiencyFraction']))
V, PW = K['OWAZA_VENT'], K['OWAZA_POWER']
ow_lines = [
    {'label': 'Fired heaters (CO2)', 'scope': 1, 'gas': 'CO2', 'activity': oh['co2Tonnes'], 'factor': 1, 'sourced': True},
    {'label': 'Fired heaters (unburned CH4)', 'scope': 1, 'gas': 'CH4', 'activity': oh['ch4Tonnes'], 'factor': 1, 'sourced': True},
    {'label': 'Flaring (CO2)', 'scope': 1, 'gas': 'CO2', 'activity': of['co2Tonnes'], 'factor': 1, 'sourced': True},
    {'label': 'Flaring (unburned CH4)', 'scope': 1, 'gas': 'CH4', 'activity': of['ch4Tonnes'], 'factor': 1, 'sourced': True},
    {'label': V['label'], 'scope': 1, 'gas': 'CH4', 'activity': V['activity'], 'factor': V['factor']['value'], 'sourced': True},
    {'label': PW['label'], 'scope': 2, 'gas': 'CO2', 'activity': PW['activity'], 'factor': PW['factor']['value'], 'sourced': True},
]
ow_inv = OC.inventory(ow_lines, K['CAP_GWP']['label'], GWP)
assert ow_inv['reportable']
ow_flare_ch4 = next(x['tCo2e'] for x in ow_inv['ledger'] if x['label'] == 'Flaring (unburned CH4)')

# ------------------------------ IGRITA ------------------------------
st = OE.species_ledger([(c, str(y)) for c, y in K['IGRITA_FUEL']])
IH = K['IGRITA_HEATER']
heater = {'stackTempC': IH['stackTempC'], 'combustionAirTempC': IH['combustionAirTempC'], 'flueGasCpKJkgK': '1.10',
          'waterVapourCpKJkgK': '1.95', 'waterLatentHeatKJkg': 2442, 'radiationLossPercent': str(IH['radiationLossPercent']),
          'unburnedLossPercent': IH['unburnedLossPercent']}
excess = OE.excess_by_bisection(st, str(IH['currentO2Percent'])) * 100
eff_c = OE.efficiency(st, str(IH['currentO2Percent']), heater, 'LHV')['eff']
eff_t = OE.efficiency(st, str(IH['targetO2Percent']), heater, 'LHV')['eff']
saving_gj = OE.duty_ledger(str(eff_c), str(eff_t), IH['annualFuelEnergyGJ'])['annualEnergySavedGJ']
T = K['IGRITA_TRAP']
p_abs = Fr(str(T['upstreamPressureBarG'])) + Fr(str(T['atmosphereBarA']))
trap = OE.trap_nozzle(T['orificeDiameterMm'], float(p_abs), T['dischargeCoefficient'], T['steamDensityKgM3'], T['specificHeatRatio'], T['hoursPerYear'])
pinch = OE.pinch_by_deficit(K['IGRITA_STREAMS'], K['IGRITA_DTMIN'])

# ------------------------------ IKORODU -----------------------------
r = str(K['IKORODU_DISCOUNT_RATE'])
costed = [OC.levelised(m, r) for m in K['IKORODU_MEASURES']]
by = {c['label']: c for c in costed}
IL = K['IKORODU_LINES']
ik_lines = [
    {'label': 'Boilers (CO2)', 'scope': 1, 'gas': 'CO2', 'activity': IL['boilersCo2T'], 'factor': 1, 'sourced': True},
    {'label': 'Gas turbines (CO2)', 'scope': 1, 'gas': 'CO2', 'activity': IL['turbinesCo2T'], 'factor': 1, 'sourced': True},
    {'label': 'Flaring (CO2)', 'scope': 1, 'gas': 'CO2', 'activity': IL['flareCo2T'], 'factor': 1, 'sourced': True},
    {'label': 'Flaring (unburned CH4)', 'scope': 1, 'gas': 'CH4', 'activity': IL['flareCh4T'], 'factor': 1, 'sourced': True},
    {'label': 'Vented and fugitive methane', 'scope': 1, 'gas': 'CH4', 'activity': IL['ventCh4T'], 'factor': 1, 'sourced': True},
    {'label': 'Purchased electricity', 'scope': 2, 'gas': 'CO2', 'activity': IL['powerMWh'], 'factor': IL['powerFactor'], 'sourced': True},
]
ik_inv = OC.inventory(ik_lines, K['CAP_GWP']['label'], GWP)
P = K['IKORODU_PLAN']
target = Fr(str(ik_inv['totalTonnes'])) * P['targetReductionPercentByEnd'] / 100
cv = OC.curve(costed, {}, float(target))
pth = OC.path(ik_inv['totalTonnes'], K['IKORODU_MEASURES'], P['startYear'], P['endYear'], P['targetReductionPercentByEnd'])
S = K['IKORODU_SAVING']
sav = OE.levelised(S['implementationCost'], Fr(str(S['energySavedGJ'])) * Fr(str(S['fuelCostPerGJ'])),
                   Fr(str(S['energySavedGJ'])) * Fr(str(S['emissionFactorKgCo2ePerGJ'])) / 1000, S['lifeYears'], str(S['discountRate']))

ORACLE = {
    'owaza_heater_co2_t': ('oracle_carbonabatement.combustion', oh['co2Tonnes']),
    'owaza_flare_co2_t': ('oracle_carbonabatement.combustion', of['co2Tonnes']),
    'owaza_flare_ch4_t': ('oracle_carbonabatement.combustion', of['ch4Tonnes']),
    'owaza_flare_ch4_tco2e': ('oracle_carbonabatement.inventory ledger line', ow_flare_ch4),
    'owaza_scope1_tco2e': ('oracle_carbonabatement.inventory', ow_inv['scope1Tonnes']),
    'owaza_total_tco2e': ('oracle_carbonabatement.inventory', ow_inv['totalTonnes']),
    'igrita_excess_air_pct': ('oracle_energyefficiency.excess_by_bisection', float(excess)),
    'igrita_efficiency_lhv_pct': ('oracle_energyefficiency.efficiency (species ledger)', float(eff_c)),
    'igrita_tuning_saving_gj': ('oracle_energyefficiency.duty_ledger on its efficiency()', float(saving_gj)),
    'igrita_trap_t_per_yr': ('oracle_energyefficiency.trap_nozzle', trap['tonnesPerYear']),
    'igrita_pinch_hot_utility_kw': ('oracle_energyefficiency.pinch_by_deficit', pinch['hotUtilityKW']),
    'igrita_pinch_cold_utility_kw': ('oracle_energyefficiency.pinch_by_deficit', pinch['coldUtilityKW']),
    'ikorodu_boiler_tuning_cost_per_t_usd': ('oracle_carbonabatement.levelised (PV ledger)', by['Tune the boilers']['costPerTonne']),
    'ikorodu_waste_heat_cost_per_t_usd': ('oracle_carbonabatement.levelised (PV ledger)', by['Waste heat recovery on the gas turbine exhausts']['costPerTonne']),
    'ikorodu_flare_recovery_net_annual_cost_usd': ('oracle_carbonabatement.levelised (PV over the annuity)', by['Flare gas recovery compressor']['netAnnualCost']),
    'ikorodu_curve_weighted_average_usd_per_t': ('oracle_carbonabatement.curve on the levelised measures', cv['weightedAverageCostPerTonne']),
    'ikorodu_path_final_gap_t': ('oracle_carbonabatement.path (year ledger)', pth['rows'][-1]['unabatedGapTonnes']),
    'ikorodu_saving_cost_per_t_usd': ('oracle_energyefficiency.levelised (PV ledger)', float(sav)),
}


def main():
    if '--plant' in sys.argv:
        m, v = ORACLE['igrita_trap_t_per_yr']
        ORACLE['igrita_trap_t_per_yr'] = (m, v + 0.02)
    bad, worst = [], (0.0, None)
    print(f'  {"field":<44} {"engine (fields.json)":>22} {"oracle":>22}  diff/tol  oracle method')
    for tier, key, val, tol in FIELDS:
        if key not in ORACLE:
            bad.append(f'{key} has no oracle computation')
            continue
        how, o = ORACLE[key]
        d = abs(val - o)
        rr = d / tol
        if rr > worst[0]:
            worst = (rr, key)
        flag = '' if d <= tol else '  DISAGREES'
        print(f'  {key:<44} {val:>22.10f} {o:>22.10f}  {rr:8.4f}  {how}{flag}')
        if d > tol:
            bad.append(f'{tier}.{key}: engine {val}, oracle {o}, |diff| {d:.3g} > tol {tol}')
    print(f'  unscheduled on the oracle path: {pth["unscheduled"]}; oracle inventory reportable: {ow_inv["reportable"]} and {ik_inv["reportable"]}')
    if len(ORACLE) != 18 or len(FIELDS) != 18:
        print('  GATE REFUSES: not eighteen fields')
        return 2
    for b in bad:
        print(f'  FAIL {b}')
    print(f'  fields compared: {len(FIELDS)}; disagreements beyond tolerance: {len(bad)}; '
          f'largest disagreement {worst[0]:.4f} of a tolerance ({worst[1]})')
    return 1 if bad else 0


if '--json' in sys.argv:
    print(json.dumps({k: {'method': m, 'value': float(v)} for k, (m, v) in ORACLE.items()}))
    sys.exit(0)
sys.exit(main())
