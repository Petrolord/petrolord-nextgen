// THE DISCRIMINATE SWEEP, per gate-must-call-the-engine: for each of the
// eighteen graded fields, does a plausible WRONG ROUTE actually move it past its
// own tolerance? A field no error moves grades nothing, whatever the prompt
// claims it tests.
//
// Every wrong route is the ENGINE asked the wrong question (a blank efficiency
// read as a perfect flare, a recovery of one, a gauge pressure read as
// absolute, the other fill basis, the default gas, an efficiency ratio of one)
// or the one piece of arithmetic a learner most plausibly does instead, done
// with the engine's own tables where one exists. The MD4-0 defects are modelled
// by name, and where the pre-repair engine is the plainest model of a defect it
// is CALLED: petrolord-engines 13f0936 (the commit before MD4-0), unpacked
// read-only in this wave directory as engines-13f0936/. Those routes are named
// `pre_md4_engine_...`. A route is BLIND when it lands inside the tolerance,
// and a field is WEAK when any route aimed at it is blind or fewer than three
// numeric routes are aimed at it. The CLOSEST MISS is printed in multiples of
// the field's tolerance, so "it moved" arrives with its margin.
//
// Run at the final tolerances (fields.json).
//
//   node discriminate.mjs            exit 0 clean, 1 any WEAK field, 2 refused
//   node discriminate.mjs --plant    THE NEGATIVE CONTROL: adds one identity
//                                    route (the truth itself, renamed) to one
//                                    field, and the sweep must report exactly
//                                    one WEAK field
//   node discriminate.mjs --json     the routes and their values, for a later
//                                    go-live generator
import fs from 'fs';
import * as K from './gasvalue_fields_capstone.mjs';
import { components } from './gasvalue_capstone.mjs';

const HERE = new URL('.', import.meta.url).pathname;
const ROOT = process.env.ET_ENGINES || '/root/wt-et-gasvalue-nextgen/packages/engines';
const OLD = process.env.ET_OLD_ENGINES || `${HERE}engines-13f0936`;
const F = await import(`${ROOT}/engines/downstream/flareToValue.js`);
const L = await import(`${ROOT}/engines/downstream/lpgCng.js`);
const M = await import(`${ROOT}/engines/downstream/modularRefinery.js`);
const OF = await import(`${OLD}/engines/downstream/flareToValue.js`);
const OL = await import(`${OLD}/engines/downstream/lpgCng.js`);
const fields = Object.fromEntries(JSON.parse(fs.readFileSync(`${HERE}fields.json`, 'utf8')).map((f) => [f[1], f]));
if (Object.keys(fields).length !== 18) { console.log('REFUSED: fields.json does not carry eighteen fields'); process.exit(2); }
const ok = (r, where) => { if (!r || r.error) { console.log(`REFUSED: ${where}: ${r && r.error}`); process.exit(2); } return r; };
const ref = Object.fromEntries(F.GAS_COMPONENT_REFERENCE.map((r) => [r.code, r]));
const sum = (a) => a.reduce((s, x) => s + x, 0);

/* ------------------------------ ERIEMU ------------------------------ */
const eRows = K.ERIEMU_GAS;
const eGas = ok(F.characteriseGas({ components: components(eRows) }), 'ERIEMU gas');
const eP = K.ERIEMU_FLARE;
const eFl = ok(F.abatement({ gas: eGas, ...eP }), 'ERIEMU flare');
const flareWith = (over, gas = eGas) => ok(F.abatement({ gas, ...eP, ...over }), 'ERIEMU flare route');
const eOldGas = ok(OF.characteriseGas({ components: components(eRows) }), 'pre-MD4 gas');
const eOld = ok(OF.abatement({ gas: eOldGas, ...eP }), 'pre-MD4 flare');
// C2 counted with the liquids: the engine asked for ethane plus.
const massFrac = (() => { const m = eRows.map(([c, y]) => y * ref[c].molarMassLbLbmol); const t = sum(m); return m.map((x) => x / t); })();
const hcOnly = ok(F.characteriseGas({ components: components(eRows.filter(([c]) => !ref[c].inert)) }), 'hydrocarbons only');
const lbPerMscfC3 = eGas.c3PlusKgPerMscf * F.LB_PER_KG;
const c2PlusKg = eGas.c3PlusKgPerMscf + (1000 / F.SCF_PER_LBMOL) * (eGas.normalised.find((r) => r.code === 'C2').moleFraction) * ref.C2.molarMassLbLbmol / F.LB_PER_KG;
const noPentanes = ok(F.characteriseGas({ components: components(eRows).map((c) => (c.code === 'C5' ? { ...c, recoverableAsNgl: false } : c)) }), 'no C5');
const co2Burned = (() => { // the gas's CO2 treated as fuel: eta_C x all carbon, the CO2 not passed through
  const g = { ...eGas, hydrocarbonCarbonPerMol: eGas.carbonPerMol, co2MoleFraction: 0 };
  return flareWith({}, g);
})();
const perfect = flareWith({ flareDestructionEfficiency: 1, flareCombustionEfficiency: 1 });
const standIn = flareWith({ flareCombustionEfficiency: null });
const ch4FromCombustion = flareWith({ flareDestructionEfficiency: eP.flareCombustionEfficiency, flareCombustionEfficiency: eP.flareCombustionEfficiency });
const hcCarbonAsMethane = flareWith({}, { ...eGas, methaneMoleFraction: eGas.hydrocarbonCarbonPerMol });

/* ------------------------------ ADIBAWA ----------------------------- */
const aGas = ok(F.characteriseGas({ components: components(K.ADIBAWA_GAS) }), 'ADIBAWA gas');
const aP = K.ADIBAWA_FLARE;
const { id: _rid, ...aR } = K.ADIBAWA_ROUTE;
const tmpl = F.ROUTE_TEMPLATES.find((t) => t.id === K.ADIBAWA_ROUTE.id);
const econ = (over = {}) => ok(F.routeEconomics({ route: tmpl, gas: aGas, volumeMMscfd: aP.volumeMMscfd, onstreamDays: aP.onstreamDays, ...aR, ...over }), 'ADIBAWA route');
const aE = econ();
const cf = K.ADIBAWA_COUNTERFACTUAL;
const ab = (over = {}, gas = aGas) => ok(F.abatement({ gas, ...aP, recoveryFraction: aR.recoveryFraction, ...cf, ...over }), 'ADIBAWA abatement');
const aA = ab();
const aOldGas = ok(OF.characteriseGas({ components: components(K.ADIBAWA_GAS) }), 'pre-MD4 ADIBAWA gas');
const aOld = ok(OF.abatement({ gas: aOldGas, ...aP, ...cf }), 'pre-MD4 ADIBAWA abatement');
const credit = (net, margin = aE.grossMarginPerYear) => ok(F.creditSensitivity({ netAbatementTonnesCo2ePerYear: net, grossMarginPerYear: margin, ...K.ADIBAWA_CREDITS }), 'ADIBAWA credits');
const aC = credit(aA.netAbatementTonnesCo2ePerYear);
const cap = (exponent) => M.scaleCapex({ baseCost: aR.referenceCapitalCost, baseCapacity: aR.referenceCapacityMMscfd, capacity: aP.volumeMMscfd, exponent }).cost;
const firstClearing = aC.points.find((p) => p.clearsHurdle);
const hurdle = K.ADIBAWA_CREDITS.hurdleMarginPerYear;

/* ------------------------------- ASABA ------------------------------ */
const sB = ok(L.lpgBlendProperties({ components: K.ASABA_LPG }), 'ASABA blend');
const store = (over = {}) => ok(L.lpgStorageSizing({ ...K.ASABA_VESSEL, liquidDensityKgM3: sB.densityKgM3, ...over }), 'ASABA vessel');
const sS = store();
const V = K.ASABA_VAPORIZER;
const vap = (over = {}, lib = L) => ok(lib.vaporizerDuty({ ...V, latentHeatKJkg: sB.latentHeatKJkg, ...over }), 'ASABA vaporizer');
const sV = vap();
const latentOnVolume = sum(K.ASABA_LPG.map((c) => c.volumeFraction * c.latentHeatKJkg)) / sum(K.ASABA_LPG.map((c) => c.volumeFraction));
const butaneAtm = L.LPG_REFERENCE.find((r) => r.code === 'butane').typicalBoilingPointC;
const bottle = (over = {}, lib = L) => ok(lib.bottlingPlant({ ...K.ASABA_BOTTLING, ...over }), 'ASABA carousel');
const sQ = bottle();
const B = K.ASABA_BOTTLING;
const rackAt = (bays, hours = B.shiftHoursPerDay) => ok(L.bottlingPlant({ ...B, positions: bays, availabilityFraction: 1, shiftHoursPerDay: hours }), 'rack').queue.averageWaitMinutes;
const C = K.ASABA_CNG;
const atm = C.atmosphereBar;
const bank = (over = {}) => ok(L.gasMassInVessel({ volumeM3: K.ASABA_STORAGE_BANK.volumeM3, pressureBar: K.ASABA_STORAGE_BANK.gaugeBar + atm, temperatureC: C.temperatureC, gasSg: C.gasSg, ...over }), 'ASABA bank');
const sM = bank();
const cs = K.ASABA_CASCADE;
const cascadeArgs = (add) => ({
  banks: cs.banks.map((b) => ({ label: b.label, volumeM3: b.volumeM3, pressureBar: b.gaugeBar + add })),
  vehicleTankM3: cs.vehicleTankM3, vehicleStartBar: cs.vehicleStartGaugeBar + add, vehicleTargetBar: cs.vehicleTargetGaugeBar + add,
  temperatureC: C.temperatureC, gasSg: C.gasSg,
});
const casc = (over = {}, add = atm, lib = L) => ok(lib.cascadeFills({ ...cascadeArgs(add), ...over }), 'ASABA cascade');
const sK = casc();
const oldK = casc({}, atm, OL);
const conv = (newOver = {}, over = {}) => ok(L.conversionEconomics({ ...K.ASABA_CONVERSION, newFuel: { ...K.ASABA_CONVERSION.newFuel, ...newOver }, ...over }), 'ASABA conversion');
const sX = conv();

const WRONG = {
  eriemu_ghv_btu_scf: {
    truth: eGas.ghvBtuScf,
    routes: {
      sheet_used_without_scaling_to_one: sum(eRows.map(([c, y]) => y * ref[c].typicalGhvBtuScf)),
      heating_value_blended_on_mass: sum(eRows.map(([c], i) => massFrac[i] * ref[c].typicalGhvBtuScf)),
      inerts_dropped_and_hydrocarbons_rescaled: hcOnly.ghvBtuScf,
      methane_heating_value_read_for_the_gas: ref.C1.typicalGhvBtuScf,
    },
  },
  eriemu_gpm_c3plus: {
    truth: eGas.gpmC3Plus,
    routes: {
      ethane_counted_with_the_liquids: eGas.gpmC2Plus,
      sheet_used_without_scaling_to_one: eGas.gpmC3Plus * eGas.rawMoleFractionSum,
      pentanes_plus_left_out: noPentanes.gpmC3Plus,
      liquids_as_mass_over_the_propane_density: lbPerMscfC3 / ref.C3.liquidDensityLbGal,
    },
  },
  eriemu_c3plus_kg_per_mscf: {
    truth: eGas.c3PlusKgPerMscf,
    routes: {
      ethane_counted_with_the_liquids: c2PlusKg,
      sheet_used_without_scaling_to_one: eGas.c3PlusKgPerMscf * eGas.rawMoleFractionSum,
      pounds_read_as_kilograms: lbPerMscfC3,
      the_whole_gas_mass: eGas.kgPerMscf,
    },
  },
  eriemu_flare_co2_t: {
    truth: eFl.flareCo2Tonnes,
    routes: {
      pre_md4_engine_co2_in_the_gas_burned_as_fuel: eOld.flareCo2Tonnes,
      co2_in_the_gas_treated_as_fuel: co2Burned.flareCo2Tonnes,
      destruction_efficiency_standing_in_for_combustion: standIn.flareCo2Tonnes,
      blank_efficiency_read_as_a_perfect_flare: perfect.flareCo2Tonnes,
    },
  },
  eriemu_flare_ch4_t: {
    truth: eFl.flareCh4Tonnes,
    routes: {
      pre_md4_engine_every_unburned_carbon_as_methane: eOld.flareCh4Tonnes,
      unburned_hydrocarbon_carbon_as_methane: hcCarbonAsMethane.flareCh4Tonnes,
      combustion_efficiency_used_for_the_methane: ch4FromCombustion.flareCh4Tonnes,
      blank_efficiency_read_as_a_perfect_flare: perfect.flareCh4Tonnes,
    },
  },
  eriemu_flare_co2e_t: {
    truth: eFl.flareCo2eTonnes,
    routes: {
      pre_md4_engine: eOld.flareCo2eTonnes,
      blank_efficiency_read_as_a_perfect_flare: perfect.flareCo2eTonnes,
      destruction_efficiency_standing_in_for_combustion: standIn.flareCo2eTonnes,
      unburned_hydrocarbon_carbon_as_methane: hcCarbonAsMethane.flareCo2eTonnes,
      co2_only_methane_left_out: eFl.flareCo2Tonnes,
    },
  },
  adibawa_capital_usd: {
    truth: aE.capitalCost,
    routes: {
      scaled_linearly: cap(1),
      six_tenths_rule: cap(M.SCALING_EXPONENT.STICK_BUILT),
      reference_cost_unscaled: aR.referenceCapitalCost,
      scaled_on_the_recovered_volume: M.scaleCapex({ baseCost: aR.referenceCapitalCost, baseCapacity: aR.referenceCapacityMMscfd, capacity: aP.volumeMMscfd * aR.recoveryFraction }).cost,
    },
  },
  adibawa_cng_kg_per_year: {
    truth: aE.productPerYear,
    routes: {
      recovery_left_out: econ({ recoveryFraction: 1 }).productPerYear,
      a_365_day_year: econ({ onstreamDays: 365 }).productPerYear,
      yield_at_the_whole_gas_mass: econ({ productUnitPerMscf: aGas.kgPerMscf }).productPerYear,
      recovery_applied_twice: aE.productPerYear * aR.recoveryFraction,
    },
  },
  adibawa_value_per_mscf: {
    truth: aE.valuePerMscf,
    routes: {
      variable_cost_left_blank: econ({ variableOpexPerMscf: '' }).valuePerMscf,
      fixed_cost_left_blank: econ({ fixedOpexPerYear: '' }).valuePerMscf,
      capital_set_against_one_year: (aE.grossMarginPerYear - aE.capitalCost) / aE.mscfPerYear,
      per_mscf_recovered: aE.grossMarginPerYear / (aE.mscfPerYear * aR.recoveryFraction),
    },
  },
  adibawa_avoided_co2e_t: {
    truth: aA.avoidedFlareCo2eTonnes,
    routes: {
      whole_flare_credited: ab({ recoveryFraction: 1 }).avoidedFlareCo2eTonnes,
      pre_md4_engine_flare_times_the_recovery: aOld.flareCo2eTonnes * aR.recoveryFraction,
      destruction_efficiency_standing_in_for_combustion: ab({ flareCombustionEfficiency: null }).avoidedFlareCo2eTonnes,
      co2_in_the_gas_treated_as_fuel: ab({}, { ...aGas, hydrocarbonCarbonPerMol: aGas.carbonPerMol, co2MoleFraction: 0 }).avoidedFlareCo2eTonnes,
    },
  },
  adibawa_net_abatement_t: {
    truth: aA.netAbatementTonnesCo2ePerYear,
    routes: {
      whole_flare_credited: ab({ recoveryFraction: 1 }).netAbatementTonnesCo2ePerYear,
      gross_flare_claimed: aA.grossClaimIfNoCounterfactual,
      displaced_fuel_left_out: aA.avoidedFlareCo2eTonnes - cf.productCombustionTonnesCo2ePerYear,
      product_combustion_left_out: aA.avoidedFlareCo2eTonnes + cf.displacedFuelTonnesCo2ePerYear,
      pre_md4_engine_whole_flare: aOld.netAbatementTonnesCo2ePerYear,
    },
  },
  adibawa_breakeven_credit_usd_per_t: {
    truth: aC.breakevenCreditPrice,
    routes: {
      first_clearing_price_in_the_order_typed: firstClearing ? firstClearing.creditPrice : null,
      lowest_tested_price_that_clears: aC.lowestTestedClearingPrice,
      capital_set_against_one_year: (hurdle - (aE.grossMarginPerYear - aE.capitalCost)) / aA.netAbatementTonnesCo2ePerYear,
      whole_flare_credited: credit(ab({ recoveryFraction: 1 }).netAbatementTonnesCo2ePerYear).breakevenCreditPrice,
      gross_flare_tonnes: (hurdle - aE.grossMarginPerYear) / aA.grossClaimIfNoCounterfactual,
    },
  },
  asaba_usable_lpg_t: {
    truth: sS.usableTonnes,
    routes: {
      fill_basis_swapped_to_liquid_volume: store({ fillRatioBasis: 'liquid_volume' }).usableTonnes,
      water_taken_as_1000: (K.ASABA_VESSEL.vesselCapacityM3 * 1000 * K.ASABA_VESSEL.maxFillRatio) / 1000,
      no_fill_limit_vessel_full_of_liquid: (K.ASABA_VESSEL.vesselCapacityM3 * sB.densityKgM3) / 1000,
      liquid_volume_basis_at_the_propane_density: store({ fillRatioBasis: 'liquid_volume', liquidDensityKgM3: K.ASABA_LPG.find((c) => c.code === 'propane').liquidDensityKgM3 }).usableTonnes,
    },
  },
  asaba_vaporizer_design_kw: {
    truth: sV.designDutyKW,
    routes: {
      pre_md4_engine_atmospheric_butane_boiling_point: vap({ boilingPointC: butaneAtm }, OL).designDutyKW,
      latent_heat_blended_on_volume: vap({ latentHeatKJkg: latentOnVolume }).designDutyKW,
      design_margin_left_out: sV.dutyKW,
      superheat_skipped: vap({ outletTempC: null, vapourCpKJkgK: null }).designDutyKW,
    },
  },
  asaba_carousel_wait_min: {
    truth: sQ.queue.averageWaitMinutes,
    routes: {
      pre_md4_engine_positions_rounded_to_nearest: bottle({}, OL).queue.averageWaitMinutes,
      availability_ignored: rackAt(B.positions),
      arrivals_spread_over_24_hours: bottle({ shiftHoursPerDay: 24 }).queue.averageWaitMinutes,
      positions_rounded_up: rackAt(Math.ceil(B.positions * B.availabilityFraction)),
    },
  },
  asaba_bank_mass_kg: {
    truth: sM.massKg,
    routes: {
      gauge_read_as_absolute: bank({ pressureBar: K.ASABA_STORAGE_BANK.gaugeBar }).massKg,
      ideal_gas: sM.idealMassKg,
      default_gas_gravity: bank({ gasSg: undefined }).massKg,
      default_temperature: L.gasMassInVessel({ volumeM3: K.ASABA_STORAGE_BANK.volumeM3, pressureBar: K.ASABA_STORAGE_BANK.gaugeBar + atm, temperatureC: 15, gasSg: C.gasSg }).massKg,
    },
  },
  asaba_left_in_banks_kg: {
    truth: sK.leftInBanksKg,
    routes: {
      gauge_read_as_absolute: casc({}, 0).leftInBanksKg,
      pre_md4_engine_only_gas_above_the_target: oldK.storedKg - oldK.deliveredKg,
      default_gas_gravity: casc({ gasSg: undefined }).leftInBanksKg,
      default_temperature: casc({ temperatureC: undefined }).leftInBanksKg,
    },
  },
  asaba_payback_years: {
    truth: sX.simplePaybackYears,
    routes: {
      efficiency_ratio_taken_as_one: conv({ efficiencyRatio: 1 }).simplePaybackYears,
      extra_maintenance_left_out: conv({}, { annualExtraMaintenance: 0 }).simplePaybackYears,
      efficiency_ratio_multiplied: conv({ efficiencyRatio: 1 / K.ASABA_CONVERSION.newFuel.efficiencyRatio }).simplePaybackYears,
      energy_contents_swapped: conv({ energyPerUnitMJ: K.ASABA_CONVERSION.baseFuel.energyPerUnitMJ }, { baseFuel: { ...K.ASABA_CONVERSION.baseFuel, energyPerUnitMJ: K.ASABA_CONVERSION.newFuel.energyPerUnitMJ } }).simplePaybackYears,
    },
  },
};

if (process.argv.includes('--plant')) WRONG.asaba_bank_mass_kg.routes.planted_identity = sM.massKg;

let weak = 0; let closest = null;
const report = {};
for (const [key, { truth, routes }] of Object.entries(WRONG)) {
  const [, , graded, tol] = fields[key];
  if (Math.abs(graded - truth) > 1e-9 * Math.max(1, Math.abs(truth))) { console.log(`REFUSED: ${key}: the sweep's truth ${truth} is not fields.json's ${graded}`); process.exit(2); }
  const lines = []; let numeric = 0; let blind = 0;
  for (const [name, v] of Object.entries(routes)) {
    if (v === null || v === undefined || !Number.isFinite(v)) { lines.push(`    ${name}: NO NUMBER (not counted)`); continue; }
    numeric += 1;
    const miss = Math.abs(v - graded) / tol;
    if (miss <= 1) blind += 1;
    if (!closest || miss < closest.miss) closest = { key, name, miss };
    lines.push(`    ${name}: ${v} (${miss <= 1 ? 'BLIND' : `misses by ${miss.toExponential(3)} tolerances`})`);
  }
  const isWeak = blind > 0 || numeric < 3;
  if (isWeak) weak += 1;
  report[key] = { truth: graded, tol, routes };
  console.log(`${isWeak ? 'WEAK ' : 'ok   '} ${key} = ${graded} (tol ${tol}), ${numeric} numeric routes`);
  lines.forEach((l) => console.log(l));
}
if (process.argv.includes('--json')) { process.stdout.write(`${JSON.stringify(report)}\n`); }
console.log(`closest miss: ${closest.key} via ${closest.name}, ${closest.miss.toExponential(3)} tolerances`);
console.log(`WEAK fields: ${weak}`);
process.exit(weak ? 1 : 0);
