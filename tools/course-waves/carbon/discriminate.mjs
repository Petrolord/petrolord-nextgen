// THE DISCRIMINATE SWEEP, per gate-must-call-the-engine: for each of the
// eighteen graded fields, does a plausible WRONG ROUTE actually move it past
// its own tolerance? A field no error moves grades nothing, whatever the prompt
// claims it tests.
//
// Every wrong route is the ENGINE asked the wrong question (the wrong
// efficiency, the wrong GWP set, the wrong basis, the wrong exponent, a rule
// skipped) or the one piece of arithmetic a learner most plausibly does
// instead, and each is named for the mistake. The routes model the defects
// MD5-0 repaired and the ordinary ones: a blank destruction efficiency read as
// 100 percent, CO2 in the fuel gas treated as fuel, argon carried at the
// nitrogen molar mass, the percentage-point efficiency shortcut, the
// superheated steam exponent, a gauge pressure read as absolute, blank hours
// read as a full year, capital set against one year, a blank rate read as 0
// (straight line), a target built on a partial inventory, an unscheduled
// measure counted.
//
// It is run at the FINAL tolerances in fields.json. A route is BLIND if it lands
// inside the field's tolerance, and a field is WEAK if any route aimed at it is
// blind or fewer than three routes are aimed at it. The CLOSEST MISS is printed
// in tolerances, so "it discriminates" arrives with its margin.
//
// Usage: node discriminate.mjs [--plant] [--json]  (exit 1 on any WEAK field, 2 on a refusal)
// --plant is the negative control: it adds an identity route to one field and
// the sweep must then report exactly one WEAK field.
import fs from 'fs';
import * as K from './carbon_fields_capstone.mjs';

const HERE = new URL('.', import.meta.url).pathname;
const ROOT = process.env.MD_ENGINES || '/root/wt-et-carbon-nextgen/packages/engines';
const CA = await import(`${ROOT}/engines/downstream/carbonAbatement.js`);
const EE = await import(`${ROOT}/engines/downstream/energyEfficiency.js`);
const C = await import('./carbon_capstone.mjs');
const fields = Object.fromEntries(JSON.parse(fs.readFileSync(`${HERE}fields.json`, 'utf8')).map((f) => [f[1], f]));

/* ------------------------------ OWAZA ------------------------------ */
const G = C.gwpSet();
const gAlt = (k) => C.gwpSet({ ...K.CAP_GWP.values, ...K.ALT_GWP[k] }, `alt ${k}`);
const g1 = C.gwpSet({ CH4: 1, N2O: 1 }, 'methane read as CO2');
const oh = C.owazaHeat(); const of = C.owazaFlare();
const oh1 = C.owazaHeat({ destructionEfficiencyFraction: 1 }); const of1 = C.owazaFlare({ destructionEfficiencyFraction: 1 });
const inv = C.owazaInventory();
const invOn = (g) => C.owazaInventory(g);
const invDe1 = C.owazaInventory(G, oh1, of1);
const line = (i, lab) => i.lines.find((l) => l.label === lab);
const MR = 44 / 12; // the mass ratio a learner remembers
const carbonMass = (r) => (r.carbonKmolPerYear * CA.MW_C) / 1000;
const noVent = CA.buildInventory({ lines: inv.lines.filter((l) => l.label !== K.OWAZA_VENT.label), gwpSet: G });
const noHeaterCh4 = CA.buildInventory({ lines: inv.lines.filter((l) => l.label !== 'Fired heaters (unburned CH4)'), gwpSet: G });

/* ------------------------------ IGRITA ----------------------------- */
const IH = K.IGRITA_HEATER;
const st = C.igritaSt;
const f6 = IH.currentO2Percent / 100;
const dryStoich = st.products.co2PerKmolFuel + st.products.so2PerKmolFuel + st.products.n2PerKmolFuel;
const air21 = st.o2PerKmolFuel / 0.21;
const dry21 = st.products.co2PerKmolFuel + st.products.so2PerKmolFuel + st.products.fuelN2PerKmolFuel + air21 * 0.79;
const stCo2Fuel = EE.combustionStoichiometry({ components: C.igritaComponents(K.IGRITA_FUEL, { CO2: { o: 0 } }) });
const cur = C.igritaHeater(IH.currentO2Percent); const tgt = C.igritaHeater(IH.targetO2Percent);
const curH = C.igritaHeater(IH.currentO2Percent, 'HHV'); const tgtH = C.igritaHeater(IH.targetO2Percent, 'HHV');
const curCo2 = C.igritaHeater(IH.currentO2Percent, 'LHV', stCo2Fuel);
// Argon at the nitrogen molar mass: the dry flue gas weighed with every non-oxygen
// part of air at 28.014, as the engine did before MD5-0 (E8). Dry loss is linear
// in the mass, so the efficiency moves by the lost mass times cp dT over the HV.
const argonEff = (r) => {
  const e = r.excessAirPercent / 100;
  const lost = st.products.airN2PerKmolFuel * (EE.ATMOSPHERIC_N2_MOLAR_MASS - 28.014)
    + e * st.stoichAirPerKmolFuel * (EE.AIR_MOLAR_MASS - (EE.O2_MOLE_FRACTION_DRY_AIR * EE.O2_MOLAR_MASS + (1 - EE.O2_MOLE_FRACTION_DRY_AIR) * 28.014));
  return r.efficiencyPercent + (lost * EE.PROPERTY_REFERENCE.fluGasCpKJkgK.typical * (IH.stackTempC - IH.combustionAirTempC)) / (st.lhvMJPerKmolFuel * 1000) * 100;
};
const latentOnLhv = cur.efficiencyPercent - (cur.moistureKgPerKmolFuel * EE.PROPERTY_REFERENCE.waterLatentHeatKJkg.typical) / (st.lhvMJPerKmolFuel * 1000) * 100;
const A = IH.annualFuelEnergyGJ;
const saveWith = (c, t) => A * (1 - c / t);
const atFloor = C.igritaHeater(IH.minimumSafeO2Percent);
const trap = C.igritaTrap();
const IT = K.IGRITA_TRAP;
const pinch = (d) => EE.pinchTargets({ streams: K.IGRITA_STREAMS, minimumApproachC: d });
const p = pinch(K.IGRITA_DTMIN);

/* ------------------------------ IKORODU ---------------------------- */
const M = Object.fromEntries(K.IKORODU_MEASURES.map((m) => [m.label, m]));
const costed = Object.fromEntries(C.ikoroduCosted.map((m) => [m.label, m]));
const crfOf = (m) => costed[m.label].capitalRecoveryFactor;
const oneYear = (m) => (m.capitalCost + m.annualCost - m.annualSavings) / m.tonnesAbatedPerYear;
const straight = (m) => C.ikoroduCost(m, 0).costPerTonne;
const interestOnly = (m) => (m.capitalCost * K.IKORODU_DISCOUNT_RATE + m.annualCost - m.annualSavings) / m.tonnesAbatedPerYear;
const noSavings = (m) => (m.capitalCost * crfOf(m) + m.annualCost) / m.tonnesAbatedPerYear;
const BT = M['Tune the boilers']; const WH = M['Waste heat recovery on the gas turbine exhausts']; const FG = M['Flare gas recovery compressor'];
const invIk = C.ikoroduInventory();
const target = (invIk.totalTonnes * K.IKORODU_PLAN.targetReductionPercentByEnd) / 100;
const curveOf = (ms) => CA.abatementCurve({ measures: ms, sourceEmissions: C.ikoroduSources, targetTonnes: target });
const truthCurve = curveOf(C.ikoroduCosted);
const plainMean = C.ikoroduCosted.reduce((a, m) => a + m.costPerTonne, 0) / C.ikoroduCosted.length;
const withoutUnscheduled = curveOf(C.ikoroduCosted.filter((m) => m.label !== 'Vapour recovery on the condensate tanks')).weightedAverageCostPerTonne;
const allStraight = curveOf(K.IKORODU_MEASURES.map((m) => C.ikoroduCost(m, 0))).weightedAverageCostPerTonne;
const path = C.ikoroduPath();
const partial = C.ikoroduInventory(G, '');
const S = K.IKORODU_SAVING;
const sv = C.ikoroduSaving();

const WRONG = {
  owaza_heater_co2_t: {
    truth: oh.co2Tonnes,
    routes: {
      destruction_efficiency_read_as_100_percent: oh1.co2Tonnes,
      carbon_mass_times_44_over_12: carbonMass(oh) * 0.995 * MR,
      carbon_per_kmol_ignored: CA.combustionCo2FromCarbon({ ...K.OWAZA_HEATERS, carbonPerKmolFuel: 1 }).co2Tonnes,
      co2_at_a_rounded_44_01: (oh.carbonKmolPerYear * 0.995 * 44.01) / 1000,
    },
  },
  owaza_flare_co2_t: {
    truth: of.co2Tonnes,
    routes: {
      destruction_efficiency_read_as_100_percent: of1.co2Tonnes,
      carbon_per_kmol_ignored: CA.combustionCo2FromCarbon({ ...K.OWAZA_FLARE, carbonPerKmolFuel: 1 }).co2Tonnes,
      escaped_share_taken_as_burned: C.owazaFlare({ destructionEfficiencyFraction: 0.03 }).co2Tonnes,
      carbon_mass_times_44_over_12: carbonMass(of) * K.OWAZA_FLARE.destructionEfficiencyFraction * MR,
    },
  },
  owaza_flare_ch4_t: {
    truth: of.ch4Tonnes,
    routes: {
      destruction_efficiency_read_as_100_percent: of1.ch4Tonnes,
      escaped_carbon_weighed_as_carbon: carbonMass(of) * (1 - K.OWAZA_FLARE.destructionEfficiencyFraction),
      escaped_carbon_weighed_as_co2: (of.carbonKmolPerYear * (1 - K.OWAZA_FLARE.destructionEfficiencyFraction) * CA.MW_CO2) / 1000,
      carbon_per_kmol_ignored: CA.combustionCo2FromCarbon({ ...K.OWAZA_FLARE, carbonPerKmolFuel: 1 }).ch4Tonnes,
    },
  },
  owaza_flare_ch4_tco2e: {
    truth: line(inv, 'Flaring (unburned CH4)').tCo2e,
    routes: {
      ar5_fossil_30: line(invOn(gAlt('ar5Fossil')), 'Flaring (unburned CH4)').tCo2e,
      ar6_non_fossil_27: line(invOn(gAlt('ar6NonFossil')), 'Flaring (unburned CH4)').tCo2e,
      ar5_non_fossil_28: line(invOn(gAlt('ar5NonFossil')), 'Flaring (unburned CH4)').tCo2e,
      methane_tonnes_read_as_co2e: line(invOn(g1), 'Flaring (unburned CH4)').tCo2e,
    },
  },
  owaza_scope1_tco2e: {
    truth: inv.scope1Tonnes,
    routes: {
      destruction_efficiencies_read_as_100_percent: invDe1.scope1Tonnes,
      ar6_non_fossil_27: invOn(gAlt('ar6NonFossil')).scope1Tonnes,
      ar5_fossil_30: invOn(gAlt('ar5Fossil')).scope1Tonnes,
      vented_methane_left_out: noVent.scope1Tonnes,
      heater_methane_left_out: noHeaterCh4.scope1Tonnes,
      methane_tonnes_read_as_co2e: invOn(g1).scope1Tonnes,
    },
  },
  owaza_total_tco2e: {
    truth: inv.totalTonnes,
    routes: {
      scope_2_left_out: inv.scope1Tonnes,
      destruction_efficiencies_read_as_100_percent: invDe1.totalTonnes,
      ar5_fossil_30: invOn(gAlt('ar5Fossil')).totalTonnes,
      ar6_non_fossil_27: invOn(gAlt('ar6NonFossil')).totalTonnes,
      vented_methane_left_out: noVent.totalTonnes,
    },
  },
  igrita_excess_air_pct: {
    truth: cur.excessAirPercent,
    routes: {
      oxygen_over_20_9_less_oxygen: (IH.currentO2Percent / (20.9 - IH.currentO2Percent)) * 100,
      air_as_21_percent_oxygen: ((f6 * dry21) / (st.o2PerKmolFuel - f6 * air21)) * 100,
      oxygen_read_on_the_wet_flue_gas: ((f6 * (dryStoich + st.products.h2oPerKmolFuel)) / (st.o2PerKmolFuel - f6 * st.stoichAirPerKmolFuel)) * 100,
      co2_in_the_gas_treated_as_fuel: curCo2.excessAirPercent,
    },
  },
  igrita_efficiency_lhv_pct: {
    truth: cur.efficiencyPercent,
    routes: {
      argon_at_the_nitrogen_molar_mass: argonEff(cur),
      hhv_basis: curH.efficiencyPercent,
      latent_heat_counted_on_lhv: latentOnLhv,
      radiation_loss_left_out: cur.efficiencyPercent + IH.radiationLossPercent,
      co2_in_the_gas_treated_as_fuel: curCo2.efficiencyPercent,
    },
  },
  igrita_tuning_saving_gj: {
    truth: EE.excessAirSaving({ current: cur, target: tgt, minimumSafeO2Percent: IH.minimumSafeO2Percent, targetO2Percent: IH.targetO2Percent, annualFuelEnergyGJ: A }).annualEnergySavedGJ,
    routes: {
      percentage_point_shortcut: A * ((tgt.efficiencyPercent - cur.efficiencyPercent) / 100),
      divided_by_the_current_efficiency: A * ((tgt.efficiencyPercent - cur.efficiencyPercent) / cur.efficiencyPercent),
      hhv_efficiencies: saveWith(curH.efficiencyPercent, tgtH.efficiencyPercent),
      tuned_to_the_safe_floor: saveWith(cur.efficiencyPercent, atFloor.efficiencyPercent),
    },
  },
  igrita_trap_t_per_yr: {
    truth: trap.tonnesPerYear,
    routes: {
      superheated_exponent_1_3: C.igritaTrap({ specificHeatRatio: 1.3 }).tonnesPerYear,
      gauge_read_as_absolute: C.igritaTrap({ upstreamPressureBarA: IT.upstreamPressureBarG }).tonnesPerYear,
      a_full_year_of_hours: C.igritaTrap({ hoursPerYear: 8760 }).tonnesPerYear,
      discharge_coefficient_left_at_1: C.igritaTrap({ dischargeCoefficient: 1 }).tonnesPerYear,
    },
  },
  igrita_pinch_hot_utility_kw: {
    truth: p.hotUtilityKW,
    routes: {
      no_temperature_shift: pinch(0).hotUtilityKW,
      the_full_approach_on_both_sides: pinch(2 * K.IGRITA_DTMIN).hotUtilityKW,
      the_energy_balance_alone: Math.max(0, p.totalColdStreamDutyKW - p.totalHotStreamDutyKW),
      the_cascade_bottom_before_correction: p.coldUtilityKW - p.hotUtilityKW,
    },
  },
  igrita_pinch_cold_utility_kw: {
    truth: p.coldUtilityKW,
    routes: {
      no_temperature_shift: pinch(0).coldUtilityKW,
      the_full_approach_on_both_sides: pinch(2 * K.IGRITA_DTMIN).coldUtilityKW,
      the_energy_balance_alone: Math.max(0, p.totalHotStreamDutyKW - p.totalColdStreamDutyKW),
      no_heat_recovered: p.totalHotStreamDutyKW,
    },
  },
  ikorodu_boiler_tuning_cost_per_t_usd: {
    truth: costed[BT.label].costPerTonne,
    routes: {
      capital_against_one_year: oneYear(BT),
      straight_line_at_rate_0: straight(BT),
      interest_only_on_the_capital: interestOnly(BT),
      savings_left_out: noSavings(BT),
    },
  },
  ikorodu_waste_heat_cost_per_t_usd: {
    truth: costed[WH.label].costPerTonne,
    routes: {
      capital_against_one_year: oneYear(WH),
      straight_line_at_rate_0: straight(WH),
      interest_only_on_the_capital: interestOnly(WH),
      savings_left_out: noSavings(WH),
    },
  },
  ikorodu_flare_recovery_net_annual_cost_usd: {
    truth: costed[FG.label].netAnnualCost,
    routes: {
      straight_line_at_rate_0: C.ikoroduCost(FG, 0).netAnnualCost,
      capital_against_one_year: FG.capitalCost + FG.annualCost - FG.annualSavings,
      running_cost_left_out: costed[FG.label].netAnnualCost - FG.annualCost,
      savings_left_out: costed[FG.label].netAnnualCost + FG.annualSavings,
    },
  },
  ikorodu_curve_weighted_average_usd_per_t: {
    truth: truthCurve.weightedAverageCostPerTonne,
    routes: {
      plain_mean_of_the_costs_per_tonne: plainMean,
      the_unscheduled_measure_left_out: withoutUnscheduled,
      every_measure_straight_line: allStraight,
      net_cost_over_the_paying_measures_tonnes: truthCurve.netAnnualCostOfAll / truthCurve.paysForItselfTonnes,
    },
  },
  ikorodu_path_final_gap_t: {
    truth: path.finalGapTonnes,
    routes: {
      the_unscheduled_measure_counted: C.ikoroduPath(invIk.totalTonnes, K.IKORODU_MEASURES.map((m) => (m.startYear === null ? { ...m, startYear: K.IKORODU_PLAN.startYear } : m))).finalGapTonnes,
      target_on_a_partial_inventory: C.ikoroduPath(partial.totalTonnes).finalGapTonnes,
      the_curve_residual_read_as_the_gap: truthCurve.residualToTargetTonnes,
      baseline_on_non_fossil_methane: C.ikoroduPath(C.ikoroduInventory(gAlt('ar6NonFossil')).totalTonnes).finalGapTonnes,
    },
  },
  ikorodu_saving_cost_per_t_usd: {
    truth: sv.costPerTonneCo2e,
    routes: {
      capital_against_one_year: (S.implementationCost - sv.annualValue) / sv.annualTonnesCo2e,
      straight_line_at_rate_0: C.ikoroduSaving({ discountRate: 0 }).costPerTonneCo2e,
      savings_left_out: CA.abatementCost({ label: 'x', capitalCost: S.implementationCost, tonnesAbatedPerYear: sv.annualTonnesCo2e, lifeYears: S.lifeYears, discountRate: S.discountRate }).costPerTonne,
      factor_read_as_tonnes_per_gj: C.ikoroduSaving({ emissionFactorKgCo2ePerGJ: S.emissionFactorKgCo2ePerGJ * 1000 }).costPerTonneCo2e,
    },
  },
};

if (process.argv.includes('--plant')) WRONG.igrita_trap_t_per_yr.routes.planted_identity = WRONG.igrita_trap_t_per_yr.truth;
if (process.argv.includes('--json')) {
  process.stdout.write(`${JSON.stringify(Object.fromEntries(Object.entries(WRONG).map(([k, w]) => [k, { truth: w.truth, routes: w.routes }])))}\n`);
  process.exit(0);
}
let weak = 0; let routes = 0; let closest = { ratio: Infinity, key: null, name: null };
console.log('field                                         routes  moved  blind   closest miss (in tolerances)');
for (const [key, { truth, routes: rs }] of Object.entries(WRONG)) {
  if (!fields[key]) { console.log(`  REFUSES: ${key} is not in fields.json`); process.exit(2); }
  if (fields[key][2] !== truth) { console.log(`  REFUSES: ${key} in fields.json is ${fields[key][2]} and this sweep computes ${truth}`); process.exit(2); }
  const tol = fields[key][3];
  const blind = []; let nearest = Infinity; let nearestName = null;
  for (const [name, got] of Object.entries(rs)) {
    routes += 1;
    if (!Number.isFinite(got)) { console.log(`  REFUSES: route ${key}.${name} produced ${got}`); process.exit(2); }
    const d = Math.abs(got - truth);
    if (d <= tol) blind.push(`${name} (lands on ${got})`);
    else if (d / tol < nearest) { nearest = d / tol; nearestName = name; }
  }
  const n = Object.keys(rs).length;
  if (blind.length || n < 3) weak += 1;
  if (nearest < closest.ratio) closest = { ratio: nearest, key, name: nearestName };
  console.log(`${key.padEnd(45)} ${String(n).padStart(6)} ${String(n - blind.length).padStart(6)} ${String(blind.length).padStart(6)}   ${nearest.toFixed(1)} (${nearestName})`);
  blind.forEach((b) => console.log(`    BLIND ${b}`));
}
if (Object.keys(WRONG).length !== 18) { console.log('  REFUSES: not eighteen fields'); process.exit(2); }
console.log(`\ndiscriminate: 18 graded fields, ${routes} wrong routes swept, ${weak} WEAK field(s)`);
console.log(`the closest miss anywhere in the eighteen: ${closest.key} by route ${closest.name}, ${closest.ratio.toFixed(1)} tolerances out`);
if (routes < 18 * 3) { console.log('  GATE REFUSES: fewer than three wrong routes a field is not a sweep'); process.exit(2); }
process.exit(weak ? 1 : 0);
