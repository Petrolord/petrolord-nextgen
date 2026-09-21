// THE GASVALUE CAPSTONE GENERATOR. Runs the three capstone records through the
// vendored engines and writes the eighteen graded fields, six a tier, with
// their tolerances, the precision declaration and the draft capstone prompts.
//
// Nothing here is read by gasvalue_dump.mjs and nothing here is quoted into a
// lesson. The digest and the capstone are two separate roads, and
// gate_capstone_leak.py sweeps both directions to keep it that way.
//
// EVERY GRADED FIELD IS A RETURN VALUE OF THE ENGINE. None is arithmetic
// performed here, with one kind of exception stated where it happens: the
// ASABA CNG pressures are read on gauges, so the generator adds the stated
// atmosphere to each before the engine reads it (the engine reads bar(a) and
// says so in pressureBasis). That addition is the step the Expert capstone
// tests; the value graded is still the engine's return. oracle_check.py
// reproduces all eighteen with the vendored Python oracles, called on these
// same records.
//
// TOLERANCES, ONE RULE. Each field is graded at ONE UNIT IN THE LAST PLACE THE
// DIGEST PRINTS FOR ITS CLASS, and the digest prints each class at the place
// the engine reports it: tonnes of a flare or an abatement and kilograms left in
// a bank to three decimals (the engine rounds them there), a capital cost to
// two (the engine rounds dollars there), everything else to four. One unit, not
// half: where the engine itself rounds at that place, a correct reading and the
// unrounded truth differ by up to half a unit, and a learner computing by hand
// and rounding once may be out by the other half. That is still half the
// gradeprecision floor's width short of the nearest wrong route: the closest
// miss is reported by discriminate.mjs in multiples of these tolerances.
//
// ONE EXCEPTION, TONNES A YEAR OF A FLARE OR AN ABATEMENT: TEN UNITS (0.01 t).
// The engine converts pounds to kilograms with LB_PER_KG = 2.20462262, the
// reciprocal of the exact 0.45359237 kg/lb to nine figures; the oracle carries
// the exact figure. On a flare of a few hundred thousand tonnes a year the two
// part in the fourth significant place from the end, about 3e-4 t, and with the
// engine's own rounding to three decimals the oracle and the engine differ by
// up to about 1.1e-3 t (ERIEMU's CO2e: 1.05 thousandths). A tolerance of one
// thousandth would fail a learner who computes with the exact pound. Ten
// thousandths is still at least 1e5 tolerances short of every wrong route
// (discriminate.mjs).
export const CLASSES = {
  tonnes: { decimals: 3, units: 10, re: /_(flare_co2|flare_ch4|flare_co2e|avoided_co2e|net_abatement)_t$/ },
  kgLeft: { decimals: 3, re: /_left_in_banks_kg$/ },
  usd: { decimals: 2, re: /_capital_usd$/ },
  btuPerScf: { decimals: 4, re: /_btu_scf$/ },
  galPerMscf: { decimals: 4, re: /_gpm_c3plus$/ },
  kgPerMscf: { decimals: 4, re: /_kg_per_mscf$/ },
  kgPerYear: { decimals: 4, re: /_kg_per_year$/ },
  usdPerMscf: { decimals: 4, re: /_value_per_mscf$/ },
  usdPerTonne: { decimals: 4, re: /_usd_per_t$/ },
  lpgTonnes: { decimals: 4, re: /_lpg_t$/ },
  kW: { decimals: 4, re: /_kw$/ },
  minutes: { decimals: 4, re: /_min$/ },
  kgBank: { decimals: 4, re: /_bank_mass_kg$/ },
  years: { decimals: 4, re: /_years$/ },
};
const classOf = (key) => {
  const hit = Object.entries(CLASSES).filter(([, c]) => c.re.test(key));
  if (hit.length !== 1) throw new Error(`${key} matches ${hit.length} precision classes, expected exactly one`);
  return hit[0];
};
export const decimalsOf = (key) => classOf(key)[1].decimals;
export const toleranceOf = (key) => (classOf(key)[1].units || 1) / 10 ** decimalsOf(key);
//
// Usage: node gasvalue_capstone.mjs [--json]
import fs from 'fs';
import * as K from './gasvalue_fields_capstone.mjs';

const HERE = new URL('.', import.meta.url).pathname;
const ROOT = process.env.ET_ENGINES || '/root/wt-et-gasvalue-nextgen/packages/engines';
const F = await import(`${ROOT}/engines/downstream/flareToValue.js`);
const L = await import(`${ROOT}/engines/downstream/lpgCng.js`);
const M = await import(`${ROOT}/engines/downstream/modularRefinery.js`);

/** The molar masses the flare is worked at, read from the engine's export (MD45-1). */
export const flareMolarMass = (code) => (code === 'CO2' ? F.FLARE_MOLAR_MASS.CO2 : F.FLARE_MOLAR_MASS.CH4);
/** A gas analysis as components, with the engine's own reference figures. */
export const components = (rows) => rows.map(([code, moleFraction]) => {
  const r = F.GAS_COMPONENT_REFERENCE.find((x) => x.code === code);
  return {
    code, moleFraction, c: r.c, molarMassLbLbmol: r.molarMassLbLbmol, ghvBtuScf: r.typicalGhvBtuScf,
    liquidDensityLbGal: r.liquidDensityLbGal, recoverableAsNgl: r.recoverableAsNgl, inert: !!r.inert,
  };
});
const must = (r, where) => { if (!r || r.error) throw new Error(`${where} refused: ${r && r.error}`); return r; };

/* ---------------------------- ERIEMU ---------------------------- */
const eGas = must(F.characteriseGas({ components: components(K.ERIEMU_GAS) }), 'ERIEMU gas');
const eFlare = must(F.abatement({ gas: eGas, ...K.ERIEMU_FLARE }), 'ERIEMU flare');

/* ---------------------------- ADIBAWA --------------------------- */
const aGas = must(F.characteriseGas({ components: components(K.ADIBAWA_GAS) }), 'ADIBAWA gas');
const aTemplate = F.ROUTE_TEMPLATES.find((t) => t.id === K.ADIBAWA_ROUTE.id);
const { id: _aid, ...aRouteInputs } = K.ADIBAWA_ROUTE;
const aEcon = must(F.routeEconomics({
  route: aTemplate, gas: aGas, volumeMMscfd: K.ADIBAWA_FLARE.volumeMMscfd,
  onstreamDays: K.ADIBAWA_FLARE.onstreamDays, ...aRouteInputs,
}), 'ADIBAWA route');
const aAb = must(F.abatement({
  gas: aGas, ...K.ADIBAWA_FLARE, recoveryFraction: K.ADIBAWA_ROUTE.recoveryFraction, ...K.ADIBAWA_COUNTERFACTUAL,
}), 'ADIBAWA abatement');
const aCredit = must(F.creditSensitivity({
  netAbatementTonnesCo2ePerYear: aAb.netAbatementTonnesCo2ePerYear,
  grossMarginPerYear: aEcon.grossMarginPerYear, ...K.ADIBAWA_CREDITS,
}), 'ADIBAWA credits');

/* ----------------------------- ASABA ---------------------------- */
const sBlend = must(L.lpgBlendProperties({ components: K.ASABA_LPG }), 'ASABA blend');
const sStore = must(L.lpgStorageSizing({ ...K.ASABA_VESSEL, liquidDensityKgM3: sBlend.densityKgM3 }), 'ASABA vessel');
const sVap = must(L.vaporizerDuty({ ...K.ASABA_VAPORIZER, latentHeatKJkg: sBlend.latentHeatKJkg }), 'ASABA vaporizer');
const sBottle = must(L.bottlingPlant(K.ASABA_BOTTLING), 'ASABA carousel');
const atm = K.ASABA_CNG.atmosphereBar;
const sBank = must(L.gasMassInVessel({
  volumeM3: K.ASABA_STORAGE_BANK.volumeM3, pressureBar: K.ASABA_STORAGE_BANK.gaugeBar + atm,
  temperatureC: K.ASABA_CNG.temperatureC, gasSg: K.ASABA_CNG.gasSg,
}), 'ASABA bank');
const sCascade = must(L.cascadeFills({
  banks: K.ASABA_CASCADE.banks.map((b) => ({ label: b.label, volumeM3: b.volumeM3, pressureBar: b.gaugeBar + atm })),
  vehicleTankM3: K.ASABA_CASCADE.vehicleTankM3,
  vehicleStartBar: K.ASABA_CASCADE.vehicleStartGaugeBar + atm,
  vehicleTargetBar: K.ASABA_CASCADE.vehicleTargetGaugeBar + atm,
  temperatureC: K.ASABA_CNG.temperatureC, gasSg: K.ASABA_CNG.gasSg,
}), 'ASABA cascade');
const sConv = must(L.conversionEconomics(K.ASABA_CONVERSION), 'ASABA conversion');
if (!sVap.complete) throw new Error('ASABA vaporizer duty is a floor, not the duty');
if (sCascade.hitFillLimit) throw new Error('ASABA cascade hit the fill limit');
if (sStore.fillRatioBasis !== 'water_capacity_mass') throw new Error('ASABA vessel is not on the water-capacity basis');

export const FIELDS = [
  ['beginner', 'eriemu_ghv_btu_scf', eGas.ghvBtuScf],
  ['beginner', 'eriemu_gpm_c3plus', eGas.gpmC3Plus],
  ['beginner', 'eriemu_c3plus_kg_per_mscf', eGas.c3PlusKgPerMscf],
  ['beginner', 'eriemu_flare_co2_t', eFlare.flareCo2Tonnes],
  ['beginner', 'eriemu_flare_ch4_t', eFlare.flareCh4Tonnes],
  ['beginner', 'eriemu_flare_co2e_t', eFlare.flareCo2eTonnes],
  ['intermediate', 'adibawa_capital_usd', aEcon.capitalCost],
  ['intermediate', 'adibawa_cng_kg_per_year', aEcon.productPerYear],
  ['intermediate', 'adibawa_value_per_mscf', aEcon.valuePerMscf],
  ['intermediate', 'adibawa_avoided_co2e_t', aAb.avoidedFlareCo2eTonnes],
  ['intermediate', 'adibawa_net_abatement_t', aAb.netAbatementTonnesCo2ePerYear],
  ['intermediate', 'adibawa_breakeven_credit_usd_per_t', aCredit.breakevenCreditPrice],
  ['advanced', 'asaba_usable_lpg_t', sStore.usableTonnes],
  ['advanced', 'asaba_vaporizer_design_kw', sVap.designDutyKW],
  ['advanced', 'asaba_carousel_wait_min', sBottle.queue.averageWaitMinutes],
  ['advanced', 'asaba_bank_mass_kg', sBank.massKg],
  ['advanced', 'asaba_left_in_banks_kg', sCascade.leftInBanksKg],
  ['advanced', 'asaba_payback_years', sConv.simplePaybackYears],
].map(([tier, key, value]) => [tier, key, value, toleranceOf(key)]);

for (const [tier, key, v] of FIELDS) {
  if (!Number.isFinite(v)) throw new Error(`${tier}.${key} is ${v}, which is not a number the engine returned`);
  if (!K.FIELD_SOURCES[key]) throw new Error(`${key} has no FIELD_SOURCES row`);
}
if (FIELDS.length !== 18 || new Set(FIELDS.map((f) => f[1])).size !== 18) throw new Error('eighteen distinct graded keys expected');
for (const t of ['beginner', 'intermediate', 'advanced']) {
  if (FIELDS.filter((f) => f[0] === t).length !== 6) throw new Error(`${t} does not grade six fields`);
}
// The breakeven graded is a real breakeven: the route does not stand alone,
// and the breakeven is none of the prices tested.
if (aCredit.standsAloneWithoutCredits !== false) throw new Error('ADIBAWA stands alone, so its breakeven is 0 and grades nothing');
if (K.ADIBAWA_CREDITS.creditPrices.some((p) => Math.abs(p - aCredit.breakevenCreditPrice) < 0.5)) throw new Error('ADIBAWA breakeven sits on a tested price');

/* ------------------------- the prompts ------------------------- */
// DRAFT PROMPTS. They state every condition a field needs and nothing that
// hands over an answer: gate_promptleak.py refuses any prompt that carries a
// graded value, or any intermediate the engine derives on the way to one.
const f = (v) => String(v);
const refText = (rows) => rows.map(([code, y]) => {
  const r = F.GAS_COMPONENT_REFERENCE.find((x) => x.code === code);
  return `${r.label} (${code}) ${f(y)}: ${f(r.c)} carbon per molecule, molar mass ${f(r.molarMassLbLbmol)} lb/lbmol, heating value ${f(r.typicalGhvBtuScf)} Btu/scf${r.liquidDensityLbGal === null ? '' : `, liquid density ${f(r.liquidDensityLbGal)} lb/gal`}`;
}).join('; ');
const d = (key) => decimalsOf(key);
const places = (keys) => keys.map((k) => d(k)).join(', ');
export const PROMPTS = {
  beginner: `ERIEMU FLOW STATION. The station flares its associated gas. Every figure is invented and illustrative. The laboratory sheet, as mole fractions with the component figures to use: ${refText(K.ERIEMU_GAS)}. The sheet is used as reported: scale it to one before using it. Take one lb-mol as ${f(F.SCF_PER_LBMOL)} scf and one kg as ${f(F.LB_PER_KG)} lb. The station flares ${f(K.ERIEMU_FLARE.volumeMMscfd)} MMscfd on ${f(K.ERIEMU_FLARE.onstreamDays)} days a year. The flare study gives a destruction efficiency of ${f(K.ERIEMU_FLARE.flareDestructionEfficiency)} and a combustion efficiency of ${f(K.ERIEMU_FLARE.flareCombustionEfficiency)}, and uses a methane global warming potential of ${f(K.ERIEMU_FLARE.gwpMethane)}. Work the flare by 40 CFR 98.233(n) with CO2 at ${f(flareMolarMass('CO2'))} and methane at ${f(flareMolarMass('C1'))} kg/kmol. Give six numbers. (1) The gas's gross heating value in Btu/scf. (2) Its liquids content, propane and heavier, in gallons per Mscf. (3) The mass of propane and heavier in one Mscf, in kg. (4) The flare's CO2 in tonnes a year. (5) Its methane in tonnes a year. (6) Its CO2e in tonnes a year. Quote (1) to (3) to ${places(['eriemu_ghv_btu_scf'])} decimals and (4) to (6) to ${places(['eriemu_flare_co2_t'])}.`,
  intermediate: `ADIBAWA GAS PARCEL. A developer bids to take a flared parcel as CNG. Every figure is invented and illustrative. The gas, as mole fractions with the component figures to use: ${refText(K.ADIBAWA_GAS)}. Take one lb-mol as ${f(F.SCF_PER_LBMOL)} scf and one kg as ${f(F.LB_PER_KG)} lb. The parcel is ${f(K.ADIBAWA_FLARE.volumeMMscfd)} MMscfd on ${f(K.ADIBAWA_FLARE.onstreamDays)} days a year. The flare today has a destruction efficiency of ${f(K.ADIBAWA_FLARE.flareDestructionEfficiency)} and a combustion efficiency of ${f(K.ADIBAWA_FLARE.flareCombustionEfficiency)}; use a methane global warming potential of ${f(K.ADIBAWA_FLARE.gwpMethane)}, CO2 at ${f(flareMolarMass('CO2'))} and methane at ${f(flareMolarMass('C1'))} kg/kmol, and 40 CFR 98.233(n). The CNG plant yields ${f(K.ADIBAWA_ROUTE.productUnitPerMscf)} kg of CNG per Mscf processed and recovers ${f(K.ADIBAWA_ROUTE.recoveryFraction)} of the parcel; CNG sells at ${f(K.ADIBAWA_ROUTE.pricePerProductUnit)} dollars per kg. A reference plant of ${f(K.ADIBAWA_ROUTE.referenceCapacityMMscfd)} MMscfd cost ${f(K.ADIBAWA_ROUTE.referenceCapitalCost)} dollars; scale it by the modular power law with an exponent of ${f(M.SCALING_EXPONENT.MODULAR)}. Fixed operating cost is ${f(K.ADIBAWA_ROUTE.fixedOpexPerYear)} dollars a year and variable operating cost ${f(K.ADIBAWA_ROUTE.variableOpexPerMscf)} dollars per Mscf of the parcel. The declared counterfactual: ${K.ADIBAWA_COUNTERFACTUAL.counterfactualLabel.toLowerCase()}; burning the CNG emits ${f(K.ADIBAWA_COUNTERFACTUAL.productCombustionTonnesCo2ePerYear)} tCO2e a year and the diesel it displaces would have emitted ${f(K.ADIBAWA_COUNTERFACTUAL.displacedFuelTonnesCo2ePerYear)} tCO2e a year. The bid team typed credit prices of ${K.ADIBAWA_CREDITS.creditPrices.map(f).join(', ')} dollars per tonne, in that order, against a hurdle margin of ${f(K.ADIBAWA_CREDITS.hurdleMarginPerYear)} dollars a year. Give six numbers. (1) The plant's capital cost in dollars, to ${d('adibawa_capital_usd')} decimals. (2) The CNG it makes in kg a year, to ${d('adibawa_cng_kg_per_year')} decimals. (3) Its gross margin per Mscf of the parcel in dollars, to ${d('adibawa_value_per_mscf')} decimals. (4) The flare CO2e the plant avoids in tonnes a year, to ${d('adibawa_avoided_co2e_t')} decimals. (5) The net abatement against the counterfactual in tonnes a year, to ${d('adibawa_net_abatement_t')} decimals. (6) The credit price at which the route just clears the hurdle, in dollars per tonne, to ${d('adibawa_breakeven_credit_usd_per_t')} decimals.`,
  advanced: `ASABA ENERGY HUB. An LPG depot and a CNG station share a site. Every figure is invented and illustrative. The LPG is ${K.ASABA_LPG.map((c) => `${c.code} ${f(c.volumeFraction)} by liquid volume (density ${f(c.liquidDensityKgM3)} kg/m3, molar mass ${f(c.molarMassKgKmol)} kg/kmol, latent heat ${f(c.latentHeatKJkg)} kJ/kg)`).join(' and ')}. The vessel holds ${f(K.ASABA_VESSEL.vesselCapacityM3)} m3 of water capacity and its code limit is a filling density of ${f(K.ASABA_VESSEL.maxFillRatio)} of the water capacity by weight, with water at 15 C taken as ${f(L.WATER_KG_M3)} kg/m3. The vaporizer takes ${f(K.ASABA_VAPORIZER.massFlowKgHr)} kg/h of that LPG entering at ${f(K.ASABA_VAPORIZER.inletTempC)} C (liquid heat capacity ${f(K.ASABA_VAPORIZER.liquidCpKJkgK)} kJ/kg K); at the vaporizer's pressure it boils at ${f(K.ASABA_VAPORIZER.boilingPointC)} C, and the vapour leaves at ${f(K.ASABA_VAPORIZER.outletTempC)} C (vapour heat capacity ${f(K.ASABA_VAPORIZER.vapourCpKJkgK)} kJ/kg K); add a design margin of ${f(K.ASABA_VAPORIZER.designMarginPercent)} percent. The bottling carousel fills ${f(K.ASABA_BOTTLING.cylindersPerDay)} cylinders a day over a ${f(K.ASABA_BOTTLING.shiftHoursPerDay)} hour shift, ${f(K.ASABA_BOTTLING.fillMinutesPerCylinder)} minutes a cylinder, on ${f(K.ASABA_BOTTLING.positions)} positions each available ${f(K.ASABA_BOTTLING.availabilityFraction)} of the time; run the queue on the positions wholly working. The CNG is gas of specific gravity ${f(K.ASABA_CNG.gasSg)} at ${f(K.ASABA_CNG.temperatureC)} C, and every pressure below is read on a gauge; the site's atmosphere is ${f(K.ASABA_CNG.atmosphereBar)} bar. A storage bank of ${f(K.ASABA_STORAGE_BANK.volumeM3)} m3 reads ${f(K.ASABA_STORAGE_BANK.gaugeBar)} bar. The cascade: ${K.ASABA_CASCADE.banks.map((b) => `${b.label} bank ${f(b.volumeM3)} m3 at ${f(b.gaugeBar)} bar`).join(', ')}; each taxi tank is ${f(K.ASABA_CASCADE.vehicleTankM3)} m3 and arrives at ${f(K.ASABA_CASCADE.vehicleStartGaugeBar)} bar and is filled to ${f(K.ASABA_CASCADE.vehicleTargetGaugeBar)} bar, isothermally, equalising with the lowest bank first; use real-gas Z by Dranchuk-Abou-Kassem on Sutton pseudo-criticals. A taxi covers ${f(K.ASABA_CONVERSION.annualDistanceKm)} km a year on ${f(K.ASABA_CONVERSION.baseFuel.consumptionPer100Km)} litres of PMS per 100 km at ${f(K.ASABA_CONVERSION.baseFuel.pricePerUnit)} naira a litre (${f(K.ASABA_CONVERSION.baseFuel.energyPerUnitMJ)} MJ a litre); CNG costs ${f(K.ASABA_CONVERSION.newFuel.pricePerUnit)} naira a kg (${f(K.ASABA_CONVERSION.newFuel.energyPerUnitMJ)} MJ a kg), no measured consumption on CNG exists, and the converted engine turns CNG energy into distance ${f(K.ASABA_CONVERSION.newFuel.efficiencyRatio)} times as well as PMS energy. The conversion costs ${f(K.ASABA_CONVERSION.conversionCost)} naira and adds ${f(K.ASABA_CONVERSION.annualExtraMaintenance)} naira a year of maintenance. Give six numbers. (1) The usable LPG in the vessel, in tonnes, to ${d('asaba_usable_lpg_t')} decimals. (2) The vaporizer's design duty in kW, to ${d('asaba_vaporizer_design_kw')} decimals. (3) The average wait of a cylinder for a position, in minutes, to ${d('asaba_carousel_wait_min')} decimals. (4) The gas in the storage bank, in kg, to ${d('asaba_bank_mass_kg')} decimals. (5) The gas left in the three cascade banks when the next taxi can no longer be filled to target, in kg, to ${d('asaba_left_in_banks_kg')} decimals. (6) The taxi's simple payback in years, undiscounted, to ${d('asaba_payback_years')} decimals.`,
};

/* --------------------------- write ----------------------------- */
const fieldsOut = process.env.ET_FIELDS_OUT || `${HERE}fields.json`;
const precOut = process.env.ET_PRECISION_OUT || `${HERE}precision.json`;
const capOut = process.env.ET_CAPSTONE_OUT || `${HERE}capstone.json`;
const isMain = process.argv[1] && new URL(import.meta.url).pathname === fs.realpathSync(process.argv[1]);
if (isMain && process.argv.includes('--json')) {
  process.stdout.write(`${JSON.stringify(FIELDS.map(([tier, key, value, tol]) => ({ tier, key, value, tol })))}\n`);
} else if (isMain) {
  fs.writeFileSync(fieldsOut, `${JSON.stringify(FIELDS, null, 1)}\n`);
  const prec = Object.fromEntries(Object.entries(CLASSES).map(([k, c]) => [k, {
    decimals: c.decimals, match: `^(?:${FIELDS.map((x) => x[1]).filter((key) => c.re.test(key)).join('|')})$`,
  }]).filter(([, v]) => v.match !== '^(?:)$'));
  const covered = FIELDS.filter(([, key]) => Object.values(CLASSES).filter((c) => c.re.test(key)).length === 1).length;
  if (covered !== 18) throw new Error(`precision classes cover ${covered} of 18 keys exactly once`);
  fs.writeFileSync(precOut, `${JSON.stringify(prec, null, 1)}\n`);
  fs.writeFileSync(capOut, `${JSON.stringify({
    tiers: Object.fromEntries(['beginner', 'intermediate', 'advanced'].map((t) => [t, {
      record: { beginner: 'ERIEMU', intermediate: 'ADIBAWA', advanced: 'ASABA' }[t],
      prompt: PROMPTS[t],
      fields: FIELDS.filter((x) => x[0] === t).map(([, key, , tol]) => ({ key, source: K.FIELD_SOURCES[key], tol })),
    }])),
  }, null, 1)}\n`);
  for (const [t, k, v, tol] of FIELDS) process.stdout.write(`${t.padEnd(13)} ${k.padEnd(36)} ${v.toFixed(decimalsOf(k)).padStart(18)}   tol ${tol}   (${v})\n`);
}
