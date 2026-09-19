// THE CARBON CAPSTONE GENERATOR. Runs the three capstone records through the
// vendored engines and writes the eighteen graded fields, six a tier, with
// their tolerances, the precision declaration, and the draft capstone prompts.
//
// Nothing here is read by carbon_dump.mjs and nothing here is quoted into a
// lesson. The digest and the capstone are two separate roads, and
// gate_capstone_leak.py sweeps both directions to keep it that way.
//
// EVERY GRADED FIELD IS A RETURN VALUE OF THE ENGINE, stored at the engine's
// full precision. None is arithmetic performed here. The one thing this file
// does itself is carry an engine return into the next engine call exactly as
// the live apps do: a combustion result becomes inventory lines through a
// factor of one (the Carbon Studio's atomLines), the two stack efficiencies go
// into excessAirSaving (the Efficiency Studio's tuningSaving), the gauge
// pressure plus the stated atmosphere is the absolute pressure the trap takes,
// the inventory total is the path's baseline with a straight-line target (the
// Carbon Studio's path), and the costed measures go into the curve.
//
// TOLERANCES, one table, CLASSES, and one rule. A learner is asked for each
// figure to a stated number of decimals (the prompt says which), and the
// tolerance is ONE UNIT IN THAT LAST PLACE. Every tolerance clears
// gradeprecision.py (half a unit in the declared place) and discriminate.mjs
// is run at these tolerances. The fuel saved by tuning is asked to the whole
// GJ: it is the ratio of two efficiencies the engine itself rounds to six
// decimals, and a learner who reads the two efficiencies to the four decimals
// the course prints lands up to about half a GJ from the stored value.
//
// Usage: node carbon_capstone.mjs [--json]
import fs from 'fs';
import * as K from './carbon_fields_capstone.mjs';

const HERE = new URL('.', import.meta.url).pathname;
const ROOT = process.env.MD_ENGINES || '/root/wt-et-carbon-nextgen/packages/engines';
const CA = await import(`${ROOT}/engines/downstream/carbonAbatement.js`);
const EE = await import(`${ROOT}/engines/downstream/energyEfficiency.js`);

/** decimals the prompt asks for, and the tolerance: one unit there. */
export const CLASSES = {
  tonnes: { decimals: 2, tol: 0.01, re: /^(?!.*_usd).*_(t|tco2e|t_per_yr)$/ },
  percent: { decimals: 4, tol: 0.0001, re: /_pct$/ },
  gj: { decimals: 0, tol: 1, re: /_gj$/ },
  kw: { decimals: 2, tol: 0.01, re: /_kw$/ },
  usdPerTonne: { decimals: 2, tol: 0.01, re: /_usd_per_t$|_per_t_usd$/ },
  usd: { decimals: 2, tol: 0.01, re: /_annual_cost_usd$/ },
};
const classOf = (key) => {
  const hit = Object.entries(CLASSES).filter(([, c]) => c.re.test(key));
  if (hit.length !== 1) throw new Error(`${key} matches ${hit.length} tolerance classes`);
  return hit[0][0];
};

/* ---------------------------- shared ---------------------------- */
export const gwpSet = (values = K.CAP_GWP.values, label = K.CAP_GWP.label) => CA.makeGwpSet({ label, values });
export const atomFactor = (gas) => CA.makeFactor({ label: `${gas} from the atom balance`, value: 1, unit: `t${gas}/t${gas}`, gas, source: 'Atom balance (conservation of mass)', version: 'not applicable' });
// The engine's own atomBalanceLines (MD45-1): CO2 and escaped methane through a
// factor of one, or one blocked line carrying a refusal.
export const atomLines = (label, r, g) => CA.atomBalanceLines({ label, combustion: r, gwpSet: g });
export const specLine = (spec, g) => CA.emissionLine({ label: spec.label, scope: spec.scope, activity: spec.activity, activityUnit: spec.activityUnit, factor: CA.makeFactor(spec.factor), gwpSet: g });

/* ---------------------------- OWAZA ----------------------------- */
export const owazaHeat = (over = {}) => CA.combustionCo2FromCarbon({ ...K.OWAZA_HEATERS, ...over });
export const owazaFlare = (over = {}) => CA.combustionCo2FromCarbon({ ...K.OWAZA_FLARE, ...over });
export const owazaInventory = (g = gwpSet(), heat = owazaHeat(), flare = owazaFlare()) => CA.buildInventory({
  lines: [...atomLines('Fired heaters', heat, g), ...atomLines('Flaring', flare, g), specLine(K.OWAZA_VENT, g), specLine(K.OWAZA_POWER, g)], gwpSet: g,
});
const owH = owazaHeat(); const owF = owazaFlare();
const owInv = owazaInventory();
if (!owInv.reportable) throw new Error(`OWAZA inventory is not reportable: ${owInv.notReportableBecause}`);
const owFlareCh4Line = owInv.lines.find((l) => l.label === 'Flaring (unburned CH4)');

/* ---------------------------- IGRITA ---------------------------- */
const ref = (c) => EE.FUEL_REFERENCE.find((r) => r.code === c);
export const igritaComponents = (fuel = K.IGRITA_FUEL, patch = {}) => fuel.map(([c, y]) => {
  const r = ref(c);
  return { code: c, moleFraction: y, c: r.c, h: r.h, o: r.o, s: r.s, n: r.n, molarMassKgKmol: r.molarMassKgKmol, lhvMJKmol: r.typicalLhvMJKmol, hhvMJKmol: r.typicalHhvMJKmol, ...(patch[c] || {}) };
});
export const igritaSt = EE.combustionStoichiometry({ components: igritaComponents() });
const IH = K.IGRITA_HEATER;
const PR = EE.PROPERTY_REFERENCE;
export const igritaHeater = (o2, basis = EE.HEATING_VALUE_BASIS.LHV, st = igritaSt, over = {}) => {
  const ea = EE.excessAirFromFlueOxygen({ stoichiometry: st, dryO2Percent: o2 });
  if (ea.error) return ea;
  return EE.stackLossEfficiency({
    stoichiometry: st, excessAir: ea, basis, stackTempC: IH.stackTempC, combustionAirTempC: IH.combustionAirTempC,
    flueGasCpKJkgK: PR.fluGasCpKJkgK.typical, waterVapourCpKJkgK: PR.waterVapourCpKJkgK.typical,
    waterLatentHeatKJkg: PR.waterLatentHeatKJkg.typical, radiationLossPercent: IH.radiationLossPercent,
    unburnedLossPercent: IH.unburnedLossPercent, ...over,
  });
};
const igEa = EE.excessAirFromFlueOxygen({ stoichiometry: igritaSt, dryO2Percent: IH.currentO2Percent });
const igCur = igritaHeater(IH.currentO2Percent); const igTgt = igritaHeater(IH.targetO2Percent);
const igSave = EE.excessAirSaving({ current: igCur, target: igTgt, minimumSafeO2Percent: IH.minimumSafeO2Percent, targetO2Percent: IH.targetO2Percent, annualFuelEnergyGJ: IH.annualFuelEnergyGJ });
if (igSave.error) throw new Error(`IGRITA saving refused: ${igSave.error}`);
const IT = K.IGRITA_TRAP;
export const igritaTrapBarA = IT.upstreamPressureBarG + IT.atmosphereBarA;
export const igritaTrap = (over = {}) => EE.steamTrapLoss({
  orificeDiameterMm: IT.orificeDiameterMm, upstreamPressureBarA: igritaTrapBarA, dischargeCoefficient: IT.dischargeCoefficient,
  steamDensityKgM3: IT.steamDensityKgM3, specificHeatRatio: IT.specificHeatRatio, hoursPerYear: IT.hoursPerYear, ...over,
});
const igTrap = igritaTrap();
const igPinch = EE.pinchTargets({ streams: K.IGRITA_STREAMS, minimumApproachC: K.IGRITA_DTMIN });
if (igPinch.error || igPinch.thresholdProblem) throw new Error('IGRITA pinch is refused or a threshold problem');

/* --------------------------- IKORODU ---------------------------- */
const r0 = K.IKORODU_DISCOUNT_RATE;
export const ikoroduCost = (m, r = r0) => CA.abatementCost({ ...m, discountRate: r });
export const ikoroduCosted = K.IKORODU_MEASURES.map((m) => ikoroduCost(m));
ikoroduCosted.forEach((m) => { if (m.error) throw new Error(`IKORODU measure refused: ${m.error}`); });
const IL = K.IKORODU_LINES;
export const ikoroduLines = (g = gwpSet(), powerFactor = IL.powerFactor) => {
  const co2 = (label, t) => CA.emissionLine({ label, scope: 1, activity: t, activityUnit: 't CO2', factor: atomFactor('CO2'), gwpSet: g });
  const ch4 = (label, t, source) => CA.emissionLine({ label, scope: 1, activity: t, activityUnit: 't CH4', factor: CA.makeFactor({ label: 'Measured methane mass', value: 1, unit: 'tCH4/t', gas: 'CH4', source, version: '2026' }), gwpSet: g });
  return [
    co2('Boilers (CO2)', IL.boilersCo2T), co2('Gas turbines (CO2)', IL.turbinesCo2T), co2('Flaring (CO2)', IL.flareCo2T),
    ch4('Flaring (unburned CH4)', IL.flareCh4T, 'Atom balance (conservation of mass)'), ch4('Vented and fugitive methane', IL.ventCh4T, 'Lagoon leak survey (invented)'),
    CA.emissionLine({ label: 'Purchased electricity', scope: 2, activity: IL.powerMWh, activityUnit: 'MWh', factor: CA.makeFactor({ label: 'Grid electricity factor (SYNTHETIC)', value: powerFactor, unit: 'tCO2/MWh', gas: 'CO2', source: powerFactor === '' ? null : 'Supplier statement (invented)', version: powerFactor === '' ? null : '2025' }), gwpSet: g }),
  ];
};
export const ikoroduInventory = (g = gwpSet(), powerFactor = IL.powerFactor) => CA.buildInventory({ lines: ikoroduLines(g, powerFactor), gwpSet: g });
const ikInv = ikoroduInventory();
if (!ikInv.reportable) throw new Error('IKORODU inventory is not reportable');
const P = K.IKORODU_PLAN;
export const ikoroduTargets = (base) => {
  const t = {};
  for (let y = P.startYear; y <= P.endYear; y += 1) t[y] = base * (1 - (P.targetReductionPercentByEnd / 100) * ((y - P.startYear) / (P.endYear - P.startYear)));
  return t;
};
export const ikoroduPath = (base = ikInv.totalTonnes, measures = K.IKORODU_MEASURES) => CA.decarbonisationPath({
  baselineTonnes: base, measures: measures.map((m) => ({ label: m.label, tonnesAbatedPerYear: m.tonnesAbatedPerYear, startYear: m.startYear })),
  startYear: P.startYear, endYear: P.endYear, targetByYear: ikoroduTargets(base),
});
const ikPath = ikoroduPath();
if (ikPath.error || !(ikPath.finalGapTonnes > 0)) throw new Error(`IKORODU path has no final gap: ${ikPath.error || ikPath.finalGapTonnes}`);
if (ikPath.unscheduledMeasures.length !== 1) throw new Error('IKORODU path should name exactly one unscheduled measure');
const G = CA.makeGwpSet({ label: K.CAP_GWP.label, values: K.CAP_GWP.values });
export const ikoroduSources = {
  boilers: IL.boilersCo2T, turbines: IL.turbinesCo2T, flare: IL.flareCo2T + IL.flareCh4T * G.values.CH4,
  vents: IL.ventCh4T * G.values.CH4, power: IL.powerMWh * IL.powerFactor,
};
const ikTarget = (ikInv.totalTonnes * P.targetReductionPercentByEnd) / 100;
const ikCurve = CA.abatementCurve({ measures: ikoroduCosted, sourceEmissions: ikoroduSources, targetTonnes: ikTarget });
if (ikCurve.overClaims.length) throw new Error('IKORODU curve over-claims a source');
const S = K.IKORODU_SAVING;
export const ikoroduSaving = (over = {}) => EE.priceSaving({ ...S, energyBasis: 'LHV', fuelCostBasis: 'LHV', emissionFactorBasis: 'LHV', ...over });
const ikSave = ikoroduSaving();
const byLabel = (lab) => ikoroduCosted.find((m) => m.label === lab);

export const FIELDS = [
  ['beginner', 'owaza_heater_co2_t', owH.co2Tonnes],
  ['beginner', 'owaza_flare_co2_t', owF.co2Tonnes],
  ['beginner', 'owaza_flare_ch4_t', owF.ch4Tonnes],
  ['beginner', 'owaza_flare_ch4_tco2e', owFlareCh4Line.tCo2e],
  ['beginner', 'owaza_scope1_tco2e', owInv.scope1Tonnes],
  ['beginner', 'owaza_total_tco2e', owInv.totalTonnes],
  ['intermediate', 'igrita_excess_air_pct', igEa.excessAirPercent],
  ['intermediate', 'igrita_efficiency_lhv_pct', igCur.efficiencyPercent],
  ['intermediate', 'igrita_tuning_saving_gj', igSave.annualEnergySavedGJ],
  ['intermediate', 'igrita_trap_t_per_yr', igTrap.tonnesPerYear],
  ['intermediate', 'igrita_pinch_hot_utility_kw', igPinch.hotUtilityKW],
  ['intermediate', 'igrita_pinch_cold_utility_kw', igPinch.coldUtilityKW],
  ['advanced', 'ikorodu_boiler_tuning_cost_per_t_usd', byLabel('Tune the boilers').costPerTonne],
  ['advanced', 'ikorodu_waste_heat_cost_per_t_usd', byLabel('Waste heat recovery on the gas turbine exhausts').costPerTonne],
  ['advanced', 'ikorodu_flare_recovery_net_annual_cost_usd', byLabel('Flare gas recovery compressor').netAnnualCost],
  ['advanced', 'ikorodu_curve_weighted_average_usd_per_t', ikCurve.weightedAverageCostPerTonne],
  ['advanced', 'ikorodu_path_final_gap_t', ikPath.finalGapTonnes],
  ['advanced', 'ikorodu_saving_cost_per_t_usd', ikSave.costPerTonneCo2e],
].map(([tier, key, value]) => [tier, key, value, CLASSES[classOf(key)].tol]);

for (const [tier, key, v] of FIELDS) {
  if (typeof v !== 'number' || !Number.isFinite(v)) throw new Error(`${tier}.${key} is ${v}, which is not a number the engine returned`);
  if (!K.FIELD_SOURCES[key]) throw new Error(`${key} has no FIELD_SOURCES row`);
}
if (FIELDS.length !== 18 || new Set(FIELDS.map((x) => x[1])).size !== 18) throw new Error('eighteen distinct graded keys expected');
for (const t of ['beginner', 'intermediate', 'advanced']) {
  if (FIELDS.filter((x) => x[0] === t).length !== 6) throw new Error(`${t} does not grade six fields`);
}

/* ------------------------- the prompts ------------------------- */
// DRAFT PROMPTS. They state every condition a field needs and nothing that
// hands over an answer: gate_promptleak.py refuses any prompt that carries a
// graded value, or an engine-derived intermediate, in any rendering.
const GW = `${K.CAP_GWP.label} (IPCC Sixth Assessment Report, 100-year horizon): methane ${K.CAP_GWP.values.CH4}, nitrous oxide ${K.CAP_GWP.values.N2O}`;
const OH = K.OWAZA_HEATERS; const OF = K.OWAZA_FLARE; const OV = K.OWAZA_VENT; const OP = K.OWAZA_POWER;
const msr = (m) => `${m.label}: capital ${m.capitalCost} USD, savings ${m.annualSavings} USD a year, running cost ${m.annualCost} USD a year, ${m.tonnesAbatedPerYear} tCO2e abated a year, a life of ${m.lifeYears} years, acting on the ${m.actsOn[0]}, ${m.startYear === null ? 'no start year agreed yet' : `starting in ${m.startYear}`}`;
export const PROMPTS = {
  beginner: `OWAZA FLOW STATION, Ukwa Basin Energy Ltd (an invented record; every flow, factor and efficiency is invented for the course). Compute the inventory on the ${GW}. The fired heaters burn ${OH.fuelKmolPerYear} kmol of fuel gas a year carrying ${OH.carbonPerKmolFuel} kmol of carbon per kmol, at a destruction efficiency of ${OH.destructionEfficiencyFraction}. The flare receives ${OF.fuelKmolPerYear} kmol a year carrying ${OF.carbonPerKmolFuel} kmol of carbon per kmol, and the operator's flare study states a destruction efficiency of ${OF.destructionEfficiencyFraction}. Carbon that escapes a burner or the flare is counted as methane. A leak survey (referenced, version ${OV.factor.version}) measured ${OV.activity} t of vented and fugitive methane. The station buys ${OP.activity} MWh of electricity at a SYNTHETIC factor of ${OP.factor.value} tCO2 per MWh from a referenced supplier statement (Scope 2). Every other line is Scope 1. Give six numbers, each to two decimals. (1) The fired heaters' CO2 in tonnes. (2) The flare's CO2 in tonnes. (3) The flare's methane in tonnes. (4) The flare's methane line in tCO2e. (5) Scope 1 in tCO2e. (6) The inventory total, Scope 1 and Scope 2, in tCO2e.`,
  intermediate: `IGRITA GAS CONDITIONING PLANT, Aluu Gas Services Ltd (an invented record; every figure is invented for the course). The fired heater burns a fuel gas of mole fractions ${K.IGRITA_FUEL.map(([c, y]) => `${c} ${y}`).join(', ')}, with the typical heating values the Efficiency Studio carries for each component. Stack ${IH.stackTempC} C, combustion air ${IH.combustionAirTempC} C, a radiation and convection loss of ${IH.radiationLossPercent} percent from the vendor's chart, no unburned loss, the Studio's typical flue gas and vapour specific heats and latent heat, efficiency on LHV. The dry stack oxygen reads ${IH.currentO2Percent} percent; a combustion test has declared ${IH.minimumSafeO2Percent} percent the minimum safe oxygen, and the plan is to tune to ${IH.targetO2Percent} percent. The heater burns ${IH.annualFuelEnergyGJ} GJ of fuel a year on LHV. A steam trap has failed open: a ${IT.orificeDiameterMm} mm orifice, the steam upstream at ${IT.upstreamPressureBarG} bar on the gauge with the local atmosphere at ${IT.atmosphereBarA} bar, a discharge coefficient of ${IT.dischargeCoefficient}, dry saturated steam of density ${IT.steamDensityKgM3} kg/m3 and isentropic exponent ${IT.specificHeatRatio}, in service ${IT.hoursPerYear} hours a year. Four process streams, at a minimum approach of ${K.IGRITA_DTMIN} C: ${K.IGRITA_STREAMS.map((s) => `${s.label} from ${s.supplyC} C to ${s.targetC} C at ${s.cpKWperK} kW/K`).join('; ')}. Give six numbers. (1) The excess air at the current oxygen, in percent, to four decimals. (2) The heater's efficiency on LHV at the current oxygen, in percent, to four decimals. (3) The fuel saved a year by tuning to the target oxygen, in GJ, to the nearest whole GJ. (4) The steam lost through the trap in tonnes a year, to two decimals. (5) The minimum hot utility in kW, to two decimals. (6) The minimum cold utility in kW, to two decimals.`,
  advanced: `IKORODU GAS DISTRIBUTION AND POWER COMPLEX, Lagoon Midstream Holdings Ltd (an invented record; every cost, saving and factor is invented for the course, money in US dollars). The baseline inventory, on the ${GW}: boilers ${IL.boilersCo2T} tCO2, gas turbines ${IL.turbinesCo2T} tCO2, flaring ${IL.flareCo2T} tCO2 and ${IL.flareCh4T} t of unburned methane, vented and fugitive methane ${IL.ventCh4T} t (from a referenced leak survey), and ${IL.powerMWh} MWh of purchased electricity at a SYNTHETIC factor of ${IL.powerFactor} tCO2 per MWh from a referenced supplier statement. Six measures, each annualised with a capital recovery factor at a discount rate of ${r0}: ${K.IKORODU_MEASURES.map(msr).join('; ')}. The target falls in a straight line from the baseline in ${P.startYear} to ${P.targetReductionPercentByEnd} percent below it in ${P.endYear}, and each scheduled measure counts in full from its start year. One saving is priced separately: ${S.label}, ${S.energySavedGJ} GJ a year at ${S.fuelCostPerGJ} USD a GJ, a SYNTHETIC factor of ${S.emissionFactorKgCo2ePerGJ} kg CO2e per GJ, all on LHV, costing ${S.implementationCost} USD over ${S.lifeYears} years at a rate of ${S.discountRate}. Give six numbers, each to two decimals. (1) The cost per tonne of Tune the boilers, USD. (2) The cost per tonne of the waste heat recovery, USD. (3) The net annual cost of the flare gas recovery compressor, USD. (4) The curve's weighted average cost per tonne over all six measures, USD. (5) The unabated gap in ${P.endYear}, in tCO2e. (6) The economiser's cost per tonne of CO2e, USD.`,
};

/* ------------------ derived intermediates, for promptleak ----------------- */
export const DERIVED = {
  owaza_heater_ch4_t: owH.ch4Tonnes, owaza_heater_carbon_kmol: owH.carbonKmolPerYear, owaza_flare_carbon_kmol: owF.carbonKmolPerYear,
  owaza_vent_tco2e: owInv.lines.find((l) => l.label === OV.label).tCo2e, owaza_scope2_tco2e: owInv.scope2Tonnes,
  igrita_o2_demand: igritaSt.o2PerKmolFuel, igrita_stoich_air: igritaSt.stoichAirPerKmolFuel, igrita_lhv: igritaSt.lhvMJPerKmolFuel,
  igrita_target_eff: igTgt.efficiencyPercent, igrita_saving_pct: igSave.fuelSavingPercent, igrita_trap_bar_a: igritaTrapBarA,
  // The pinch's hot-side temperature is not listed: a pinch sits on a shifted
  // stream boundary, so it is always a supply or target temperature the prompt
  // must state. The cold side is that less the approach, and is listed.
  igrita_trap_kgh: igTrap.kgPerHour, igrita_pinch_cold_c: igPinch.pinchColdC,
  igrita_heat_recovered: igPinch.heatRecoveredKW,
  ikorodu_baseline_t: ikInv.totalTonnes, ikorodu_target_end_t: ikPath.rows[ikPath.rows.length - 1].targetTonnes,
  ikorodu_total_abatement_t: ikCurve.totalAbatementTonnes, ikorodu_net_annual_all: ikCurve.netAnnualCostOfAll,
  ikorodu_saving_value: ikSave.annualValue, ikorodu_saving_tco2e: ikSave.annualTonnesCo2e,
  ikorodu_waste_heat_crf: byLabel('Waste heat recovery on the gas turbine exhausts').capitalRecoveryFactor,
};

/* --------------------------- write ----------------------------- */
const fieldsOut = process.env.MD_FIELDS_OUT || `${HERE}fields.json`;
const precOut = process.env.MD_PRECISION_OUT || `${HERE}precision.json`;
const capOut = process.env.MD_CAPSTONE_OUT || `${HERE}capstone.json`;
const MAIN = process.argv[1] && new URL(import.meta.url).pathname === process.argv[1];
if (!MAIN) {
  // imported by discriminate.mjs or a gate: compute, write nothing
} else if (process.argv.includes('--json')) {
  process.stdout.write(`${JSON.stringify({ fields: FIELDS.map(([tier, key, value, tol]) => ({ tier, key, value, tol })), derived: DERIVED })}\n`);
} else {
  fs.writeFileSync(fieldsOut, `${JSON.stringify(FIELDS, null, 1)}\n`);
  const prec = {};
  for (const [cls, c] of Object.entries(CLASSES)) {
    const keys = FIELDS.map((x) => x[1]).filter((k) => classOf(k) === cls);
    if (keys.length) prec[cls] = { decimals: c.decimals, match: `^(?:${keys.join('|')})$` };
  }
  fs.writeFileSync(precOut, `${JSON.stringify(prec, null, 1)}\n`);
  fs.writeFileSync(capOut, `${JSON.stringify({
    tiers: Object.fromEntries(['beginner', 'intermediate', 'advanced'].map((t) => [t, {
      record: { beginner: 'OWAZA', intermediate: 'IGRITA', advanced: 'IKORODU' }[t],
      prompt: PROMPTS[t],
      fields: FIELDS.filter((x) => x[0] === t).map(([, key, , tol]) => ({ key, source: K.FIELD_SOURCES[key], decimals: CLASSES[classOf(key)].decimals, tol })),
    }])),
  }, null, 1)}\n`);
  for (const [tier, key, v, tol] of FIELDS) process.stdout.write(`${tier.padEnd(13)} ${key.padEnd(44)} ${String(v).padEnd(22)} tol ${tol}\n`);
}
