// THE CARBON TEACHING DIGEST GENERATOR. Every figure, table row and refusal in
// digest.txt is printed by this file straight out of the vendored
// engines/downstream/carbonAbatement.js and energyEfficiency.js, called on the
// teaching cases in carbon_fields.mjs. Nothing is typed: a tonne is the
// engine's tonne, an efficiency is the engine's efficiency, and a refusal is
// the engine's own sentence, printed after "REFUSED:".
//
// THREE GUARDS BUILT INTO THE GENERATOR, so a digest that breaks one of them
// cannot be written at all:
//
//   THE VERDICT LABELS. refused() asserts the engine returned no figure and a
//   reason, and prints the reason; answered() asserts the opposite.
//
//   THE SECTION OWNERS. Each section's owning tier and module comes from ONE
//   table, SECTION_OWNERS, checked against structure.py's module keys at build
//   time, never typed into a heading.
//
//   THE NON-VALUES. The build throws if a line would print NaN, undefined,
//   Infinity or an object where a measurement belongs, and a signed zero
//   prints without its sign.
//
// A FEW FIGURES ARE ARITHMETIC ON ENGINE RETURNS AND SAY SO where they print:
// a difference between two engine figures, a share, the percentage-point
// shortcut and the one-year cost per tonne that the engine refuses to compute.
// Each such line names itself "computed here from the engine's figures".
//
// NO CLOCK. Neither module reads a date or a random number (gate_clock.sh reads
// both sources and rebuilds this digest under a moved machine clock), so
// nothing here needs an as-of date. The path's years are inputs.
//
// PRINT PRECISION is one table, PRINT, and the header prints it.
//
// Usage: node carbon_dump.mjs   (build_digest.sh pins TZ)
import fs from 'fs';
import * as F from './carbon_fields.mjs';

const HERE = new URL('.', import.meta.url).pathname;
const ROOT = process.env.MD_ENGINES || '/root/wt-et-carbon-nextgen/packages/engines';
const CA = await import(`${ROOT}/engines/downstream/carbonAbatement.js`);
const EE = await import(`${ROOT}/engines/downstream/energyEfficiency.js`);

/* ------------------------------------------------------------------ *
 * Output, verdicts and formatting.
 * ------------------------------------------------------------------ */
const L = [];
const out = (s = '') => L.push(s);
export const PRINT = {
  t: 3, kmol: 3, pct: 4, frac: 6, gj: 3, kgh: 4, kw: 3, c: 3, usd: 2, usdt: 4, crf: 8, mm: 4, kg: 4, mjt: 4, inten: 8, share: 6,
};
const f = (cls) => (v) => {
  if (v === null || v === undefined) return 'none';
  if (typeof v !== 'number' || !Number.isFinite(v)) throw new Error(`NON-VALUE: a ${cls} figure is ${v}`);
  const s = v.toFixed(PRINT[cls]);
  if (/^-0(\.0+)?$/.test(s)) return s.slice(1);
  return s;
};
const t3 = f('t'); const km = f('kmol'); const pct = f('pct'); const frac = f('frac'); const gj = f('gj');
const kgh = f('kgh'); const kw = f('kw'); const degc = f('c'); const usd = f('usd'); const usdt = f('usdt');
const crf = f('crf'); const mm = f('mm'); const kg = f('kg'); const mjt = f('mjt'); const inten = f('inten'); const share = f('share');
const plain = (v) => (v === null || v === undefined ? 'none' : v === '' ? 'blank' : String(v));
const yn = (v) => (v === true ? 'true' : v === false ? 'false' : 'none');

let refusedCount = 0; let answeredCount = 0;
const refused = (r, where) => {
  const reason = r && r.error;
  if (!reason || !String(reason).trim()) {
    throw new Error(`VERDICT LABEL: ${where} was expected to be REFUSED with a reason, and the engine said ${JSON.stringify(r)}`);
  }
  refusedCount += 1;
  return `REFUSED: ${reason}`;
};
const answered = (r, key, where) => {
  if (!r || r.error || r[key] === null || r[key] === undefined) throw new Error(`VERDICT LABEL: ${where} was expected to answer ${key}, and the engine said ${JSON.stringify(r)}`);
  answeredCount += 1;
  return r[key];
};
const row = (...cells) => out(`| ${cells.join(' | ')} |`);
const head = (...cells) => { row(...cells); row(...cells.map(() => '---')); };

/* ------------------------------------------------------------------ *
 * THE SECTION OWNERS, one table, checked against structure.py.
 * ------------------------------------------------------------------ */
const SECTION_OWNERS = {
  1: [['beginner', 'm01']], 2: [['beginner', 'm01'], ['beginner', 'm02']], 3: [['beginner', 'm02']],
  4: [['beginner', 'm02'], ['beginner', 'm06']], 5: [['beginner', 'm03'], ['beginner', 'm06']], 6: [['beginner', 'm04']],
  7: [['beginner', 'm05'], ['beginner', 'm06']], 8: [['beginner', 'm04']], 9: [['beginner', 'm05']], 10: [['beginner', 'm05']],
  11: [['intermediate', 'm01']], 12: [['intermediate', 'm02']], 13: [['intermediate', 'm03'], ['intermediate', 'm06']],
  14: [['intermediate', 'm04'], ['intermediate', 'm06']], 15: [['intermediate', 'm05'], ['intermediate', 'm06']],
  16: [['intermediate', 'm05']], 17: [['intermediate', 'm05'], ['intermediate', 'm06']],
  18: [['advanced', 'm01']], 19: [['advanced', 'm01']], 20: [['advanced', 'm02'], ['advanced', 'm06']],
  21: [['advanced', 'm03']], 22: [['advanced', 'm04'], ['advanced', 'm06']], 23: [['advanced', 'm05']],
  24: [['advanced', 'm05']], 25: [['beginner', 'm06'], ['advanced', 'm06']], 26: [['advanced', 'm06']],
};
const TIER_WORD = { beginner: 'Associate', intermediate: 'Professional', advanced: 'Expert' };
const structureKeys = (() => {
  const src = fs.readFileSync(`${HERE}structure.py`, 'utf8');
  const keys = new Set(); let tier = null;
  for (const line of src.split('\n')) {
    const t = /^ '(beginner|intermediate|advanced)': \[/.exec(line);
    if (t) tier = t[1];
    const m = /^  \('(m\d\d)-/.exec(line);
    if (m && tier) keys.add(`${tier}:${m[1]}`);
  }
  return keys;
})();
if (structureKeys.size !== 18) throw new Error(`SECTION OWNERS: structure.py yielded ${structureKeys.size} module keys, expected 18`);
let sectionNo = 0;
const section = (title) => {
  sectionNo += 1;
  const own = SECTION_OWNERS[sectionNo];
  if (!own) throw new Error(`SECTION OWNERS: section ${sectionNo} has no owner row`);
  for (const [t, m] of own) {
    if (!structureKeys.has(`${t}:${m}`)) throw new Error(`SECTION OWNERS: section ${sectionNo} names ${t} ${m}, which structure.py does not declare`);
  }
  const tiers = [...new Set(own.map(([t]) => t))];
  const owners = tiers.map((t) => `${TIER_WORD[t]} ${own.filter(([x]) => x === t).map(([, m]) => m).join(' and ')}`).join(' and ');
  out('');
  out(`# SECTION ${sectionNo}: ${title} (owned by ${owners})`);
  out('');
};

/* ------------------------------------------------------------------ *
 * The cases, built once.
 * ------------------------------------------------------------------ */
const GW = Object.fromEntries(Object.entries(F.GWP_SETS).map(([k, s]) => [k, CA.makeGwpSet({ label: s.label, values: s.values })]));
const G = GW[F.COURSE_SET];
const atomFactor = (gas) => CA.makeFactor({
  label: `${gas} from the atom balance`, value: 1, unit: `t${gas}/t${gas}`, gas,
  source: 'Atom balance (conservation of mass)', version: 'not applicable',
});
const regFactor = (fc) => CA.makeFactor(fc);
/** The page's own way of turning an atom-balance result into lines: skipped when absent or zero. */
const atomLines = (label, r, gwpSet) => {
  const rows = [];
  if (r && !r.error && r.co2Tonnes) rows.push(CA.emissionLine({ label: `${label} (CO2)`, scope: 1, activity: r.co2Tonnes, activityUnit: 't CO2', factor: atomFactor('CO2'), gwpSet }));
  if (r && !r.error && r.ch4Tonnes) rows.push(CA.emissionLine({ label: `${label} (unburned CH4)`, scope: 1, activity: r.ch4Tonnes, activityUnit: 't CH4', factor: atomFactor('CH4'), gwpSet }));
  return rows;
};
const lineOf = (spec, gwpSet, over = {}) => CA.emissionLine({
  label: spec.label, scope: spec.scope, activity: spec.activity, activityUnit: spec.activityUnit,
  factor: regFactor({ ...spec.factor, ...(over.factor || {}) }), gwpSet, ...(over.line || {}),
});

const igHeat = CA.combustionCo2FromCarbon(F.IGBOGENE_HEATERS);
const igFlare = CA.combustionCo2FromCarbon({ ...F.IGBOGENE_FLARE, destructionEfficiencyFraction: F.IGBOGENE_FLARE_DE });
const igLines = (gwpSet) => [
  ...atomLines('Fired heaters', igHeat, gwpSet), ...atomLines('Flaring', igFlare, gwpSet),
  lineOf(F.IGBOGENE_VENT, gwpSet), lineOf(F.IGBOGENE_POWER, gwpSet),
];
const igInv = CA.buildInventory({ lines: igLines(G), gwpSet: G });
if (!igInv.reportable) throw new Error(`IGBOGENE inventory is not reportable: ${igInv.notReportableBecause}`);

const ref = (c) => EE.FUEL_REFERENCE.find((r) => r.code === c);
const fuelComponents = (fuel) => fuel.map(([c, y]) => {
  const r = ref(c);
  return { code: c, moleFraction: y, c: r.c, h: r.h, o: r.o, s: r.s, n: r.n, molarMassKgKmol: r.molarMassKgKmol, lhvMJKmol: r.typicalLhvMJKmol, hhvMJKmol: r.typicalHhvMJKmol };
});
const isSt = EE.combustionStoichiometry({ components: fuelComponents(F.ISIOKPO_FUEL) });
const H = F.ISIOKPO_HEATER;
const PR = EE.PROPERTY_REFERENCE;
const heaterAt = (o2, basis = EE.HEATING_VALUE_BASIS.LHV, over = {}) => {
  const ea = EE.excessAirFromFlueOxygen({ stoichiometry: isSt, dryO2Percent: o2 });
  if (ea.error) return ea;
  return EE.stackLossEfficiency({
    stoichiometry: isSt, excessAir: ea, basis, stackTempC: H.stackTempC, combustionAirTempC: H.combustionAirTempC,
    flueGasCpKJkgK: PR.fluGasCpKJkgK.typical, waterVapourCpKJkgK: PR.waterVapourCpKJkgK.typical,
    waterLatentHeatKJkg: PR.waterLatentHeatKJkg.typical, radiationLossPercent: H.radiationLossPercent,
    unburnedLossPercent: H.unburnedLossPercent, ...over,
  });
};
const isCur = heaterAt(H.currentO2Percent); const isTgt = heaterAt(H.targetO2Percent);
const isCurH = heaterAt(H.currentO2Percent, EE.HEATING_VALUE_BASIS.HHV); const isTgtH = heaterAt(H.targetO2Percent, EE.HEATING_VALUE_BASIS.HHV);
const H2O_KG = isCur.moistureKgPerKmolFuel / isSt.products.h2oPerKmolFuel;
const isSave = EE.excessAirSaving({ current: isCur, target: isTgt, minimumSafeO2Percent: H.minimumSafeO2Percent, targetO2Percent: H.targetO2Percent, annualFuelEnergyGJ: H.annualFuelEnergyGJ });

const costOf = (m, r = F.AGBOR_DISCOUNT_RATE) => CA.abatementCost({ ...m, discountRate: r });
const agCosted = F.AGBOR_MEASURES.map((m) => costOf(m));
agCosted.forEach((m) => { if (m.error) throw new Error(`AGBOR measure refused: ${m.error}`); });
const agHeat = CA.combustionCo2FromCarbon(F.AGBOR_SOURCES.heaters);
const agFlare = CA.combustionCo2FromCarbon(F.AGBOR_SOURCES.flare);
const agVent = { label: 'Vented and fugitive methane', scope: 1, activity: F.AGBOR_VENT_T_CH4, activityUnit: 't CH4', factor: { label: 'Measured methane mass', value: 1, unit: 'tCH4/t', gas: 'CH4', source: 'Ika leak detection survey (invented)', version: '2026 Q1', vintage: '2026' } };
const agPowerSpec = (factor) => ({ label: 'Purchased electricity', scope: 2, activity: F.AGBOR_POWER.activity, activityUnit: 'MWh', factor: { label: 'Grid electricity factor (SYNTHETIC)', value: factor, unit: 'tCO2/MWh', gas: 'CO2', source: factor === '' ? null : 'Supplier statement (invented)', version: factor === '' ? null : '2025', vintage: '2025' } });
const agLines = (powerFactor = F.AGBOR_POWER.factor) => [
  ...atomLines('Fired heaters', agHeat, G), ...atomLines('Flaring', agFlare, G), lineOf(agVent, G), lineOf(agPowerSpec(powerFactor), G),
];
const agInv = CA.buildInventory({ lines: agLines(), gwpSet: G });
if (!agInv.reportable) throw new Error('AGBOR inventory is not reportable');
const co2e = (r) => r.co2Tonnes + r.ch4Tonnes * G.values.CH4;
const agSources = { heaters: co2e(agHeat), flare: co2e(agFlare) };
const pct30 = F.AGBOR_PLAN.targetReductionPercentByEnd;
const agTarget = (agInv.totalTonnes * pct30) / 100;
const agCurve = CA.abatementCurve({ measures: agCosted, sourceEmissions: agSources, targetTonnes: agTarget });
const targetsFor = (base) => {
  const out2 = {};
  const { startYear: y0, endYear: y1 } = F.AGBOR_PLAN;
  for (let y = y0; y <= y1; y += 1) out2[y] = base * (1 - (pct30 / 100) * ((y - y0) / (y1 - y0)));
  return out2;
};
const pathFor = (base, measures = F.AGBOR_MEASURES) => CA.decarbonisationPath({
  baselineTonnes: base, measures: measures.map((m) => ({ label: m.label, tonnesAbatedPerYear: m.tonnesAbatedPerYear, startYear: m.startYear })),
  startYear: F.AGBOR_PLAN.startYear, endYear: F.AGBOR_PLAN.endYear, targetByYear: targetsFor(base),
});
const agPath = pathFor(agInv.totalTonnes);

/* ================================================================== */
out('# carbon: Carbon & Energy Efficiency. Teaching digest.');
out('# PRECISION: tonnes (of CO2, of methane, of CO2e, of steam) print to three decimals and kilomoles to three; percents (efficiency, excess air, losses) to four; fractions and shares to six; gigajoules to three; kilograms an hour and kilograms per kilomole to four; kilowatts and temperatures to three; money in US dollars to two decimals and US dollars per tonne to four; capital recovery factors to eight; megajoules per tonne to four; carbon intensities to eight. Counts and years are whole numbers.');
out('# NO CLOCK: neither engine reads a date or a random number, so no figure below depends on when or where the digest was built. Every year below is an input.');
out('# ENGINES: engines/downstream/carbonAbatement.js and engines/downstream/energyEfficiency.js at petrolord-engines f0aef14 (MD5-0 repaired both, engines PR #226), vendored in NextGen under packages/engines.');
out('# CASES: IGBOGENE (a Niger Delta flow station and gas plant: its fired heaters, its flare, its vented methane and its purchased power, rolled into one inventory), ISIOKPO (a gas plant: one fired heater, a failed steam trap, its condensate system and four process streams), AGBOR (a gas processing and distribution complex: six abatement measures, a curve, a target, a path, one priced saving and the plant energy intensity). All three are invented records.');
out(`# GWP: every global warming potential below is an INPUT the engine ships none of. The values are IPCC ${F.GWP_HORIZON} figures as tabulated in ${F.GWP_SOURCE}. The course computes its inventories on the set "${F.GWP_SETS[F.COURSE_SET].label}" (CH4 ${F.GWP_SETS[F.COURSE_SET].values.CH4}, N2O ${F.GWP_SETS[F.COURSE_SET].values.N2O}) and prints the other three beside it.`);
out('# RATES: every cost, saving, price, emission factor, flow, temperature and destruction efficiency below is INVENTED for this course and is not a published figure. The electricity factor and the fuel emission factor are SYNTHETIC.');
out('# Built by build_digest.sh from carbon_dump.mjs and carbon_fields.mjs. Never edited by hand.');

/* ------------------------------------------------------------------ */
section('WHAT THE TWO APPS COMPUTE, AND WHAT THE ENGINES SHIP');
out('Each module exports its rules as functions and its fixed data as constants. The counts below are measured from the modules themselves.');
out('');
head('module', 'exported functions', 'exported constants', 'names');
for (const [name, mod] of [['carbonAbatement', CA], ['energyEfficiency', EE]]) {
  const fns = Object.entries(mod).filter(([, v]) => typeof v === 'function').map(([k]) => k);
  const other = Object.entries(mod).filter(([, v]) => typeof v !== 'function').map(([k]) => k);
  row(name, fns.length, other.length, [...fns, ...other].join(', '));
}
out('');
out('The Carbon Footprint & Abatement Studio calls carbonAbatement. The Energy & Utilities Efficiency Studio calls energyEfficiency, and its cost per tonne is carbonAbatement.abatementCost called from inside energyEfficiency.priceSaving.');
out('');
out(`carbonAbatement.SCOPE: ONE ${CA.SCOPE.ONE}, TWO ${CA.SCOPE.TWO}`);
out(`carbonAbatement.MW_CO2: ${CA.MW_CO2}`);
out(`carbonAbatement.MW_C: ${CA.MW_C}`);
out(`carbonAbatement.MW_CH4: ${CA.MW_CH4}`);
out(`energyEfficiency.O2_MOLE_FRACTION_DRY_AIR: ${EE.O2_MOLE_FRACTION_DRY_AIR}`);
out(`energyEfficiency.AIR_MOLAR_MASS: ${EE.AIR_MOLAR_MASS}`);
out(`energyEfficiency.O2_MOLAR_MASS: ${EE.O2_MOLAR_MASS}`);
out(`energyEfficiency.ATMOSPHERIC_N2_MOLAR_MASS: ${kg(EE.ATMOSPHERIC_N2_MOLAR_MASS)} (printed to four decimals; derived by the engine from the two air constants above)`);
out(`energyEfficiency.HEATING_VALUE_BASIS: ${Object.values(EE.HEATING_VALUE_BASIS).join(', ')}`);
out('');
out('energyEfficiency.FUEL_REFERENCE, atom counts and typical heating values in MJ per kmol:');
head('code', 'label', 'C', 'H', 'O', 'S', 'N', 'molar mass kg/kmol', 'typical LHV MJ/kmol', 'typical HHV MJ/kmol', 'inert');
EE.FUEL_REFERENCE.forEach((r) => row(r.code, r.label, r.c, r.h, r.o, r.s, r.n, r.molarMassKgKmol.toFixed(3), r.typicalLhvMJKmol, r.typicalHhvMJKmol, r.inert ? 'yes' : 'no'));
out('');
out(`energyEfficiency.FUEL_REFERENCE_NOTE: "${EE.FUEL_REFERENCE_NOTE}"`);
out('');
out('energyEfficiency.PROPERTY_REFERENCE, typical values a stack loss needs, each labelled as typical:');
head('property', 'typical', 'range', 'note');
for (const [k, v] of Object.entries(EE.PROPERTY_REFERENCE)) row(k, v.typical, v.range, v.note);
out('');
{
  const empty = CA.makeGwpSet({});
  out('WHAT IS NOT SHIPPED. Neither module exports an emission factor or a global warming potential. A GWP set built with nothing in it:');
  head('call', 'label', 'gases', 'declared');
  row('makeGwpSet({})', plain(empty.label), empty.gases.length, yn(empty.declared));
  const bare = CA.makeFactor({ label: 'A factor typed with no source', value: 2.5, unit: 'tCO2/t', gas: 'CO2' });
  out('');
  out('A factor typed with a value and nothing else is still a record, and the record says what it lacks:');
  head('label', 'value', 'unit', 'gas', 'hasValue', 'provenanceComplete', 'missingProvenance');
  row(bare.label, bare.value, bare.unit, bare.gas, yn(bare.hasValue), yn(bare.provenanceComplete), bare.missingProvenance.join(', '));
}

/* ------------------------------------------------------------------ */
section('MISSING STAYS MISSING: WHAT THE CARBON ENGINE REFUSES');
out('Each row is one call to the engine. A blank box reaches the engine as an empty string or null; an argument left out of the call takes the stated default.');
out('');
head('function', 'the call', 'the engine says');
const fl0 = F.IGBOGENE_FLARE;
const refRows = [
  ['combustionCo2FromCarbon', 'flare, destruction efficiency blank', { ...fl0, destructionEfficiencyFraction: '' }],
  ['combustionCo2FromCarbon', 'flare, destruction efficiency null', { ...fl0, destructionEfficiencyFraction: null }],
  ['combustionCo2FromCarbon', 'flare, destruction efficiency 0', { ...fl0, destructionEfficiencyFraction: 0 }],
  ['combustionCo2FromCarbon', 'flare, destruction efficiency 98 (a percentage typed)', { ...fl0, destructionEfficiencyFraction: 98 }],
  ['combustionCo2FromCarbon', 'flare, fuel blank', { ...fl0, fuelKmolPerYear: '', destructionEfficiencyFraction: 0.98 }],
  ['combustionCo2FromCarbon', 'flare, carbon per kmol left out', { fuelKmolPerYear: fl0.fuelKmolPerYear, destructionEfficiencyFraction: 0.98 }],
  ['combustionCo2FromCarbon', 'flare, fuel -1 kmol', { ...fl0, fuelKmolPerYear: -1, destructionEfficiencyFraction: 0.98 }],
];
for (const [fn, what, args] of refRows) row(fn, what, refused(CA.combustionCo2FromCarbon(args), what));
{
  const noFactor = CA.emissionLine({ label: 'Purchased electricity', scope: 2, activity: 31500, activityUnit: 'MWh', gwpSet: G });
  row('emissionLine', 'a line with no registered factor', refused(noFactor, 'emissionLine no factor'));
  const inv = CA.buildInventory({ lines: [], gwpSet: G });
  const ci = (args, what) => row('carbonIntensity', what, refused(CA.carbonIntensity({ inventory: inv, ...args }), what));
  ci({ denominatorValue: 3650000, denominatorUnit: 'boe' }, 'no boundary named');
  ci({ denominatorValue: 0, denominatorUnit: 'boe', boundaryLabel: 'site' }, 'a denominator of 0');
  ci({ denominatorValue: '', denominatorUnit: 'boe', boundaryLabel: 'site' }, 'a blank denominator');
}
out('');
{
  const left = CA.combustionCo2FromCarbon({ fuelKmolPerYear: 1000, carbonPerKmolFuel: 1 });
  out(`Left out of the call, the destruction efficiency takes its stated default of complete combustion: combustionCo2FromCarbon({ fuelKmolPerYear: 1000, carbonPerKmolFuel: 1 }) answers destructionEfficiencyFraction ${left.destructionEfficiencyFraction}, co2Tonnes ${t3(answered(left, 'co2Tonnes', 'left out'))}, ch4Tonnes ${t3(left.ch4Tonnes)}. A burner is the case that default is for. A flare is asked for its efficiency every time.`);
}

/* ------------------------------------------------------------------ */
section('CARBON IN, CO2 OUT: THE ATOM BALANCE AND ITS MOLAR MASSES');
{
  const one = CA.combustionCo2FromCarbon({ fuelKmolPerYear: 1000, carbonPerKmolFuel: 1, destructionEfficiencyFraction: 1 });
  out(`The engine's molar masses come from the IUPAC conventional atomic weights: MW_C ${CA.MW_C}, MW_CO2 ${CA.MW_CO2} (${CA.MW_C} plus two oxygens at ${((CA.MW_CO2 - CA.MW_C) / 2).toFixed(3)}), MW_CH4 ${CA.MW_CH4} (${CA.MW_C} plus four hydrogens at ${((CA.MW_CH4 - CA.MW_C) / 4).toFixed(3)}). The oxygen and hydrogen weights are read back from the engine's own molar masses (computed here).`);
  out('');
  out(`The engine's method, verbatim: "${one.method}"`);
  out('');
  out('One thousand kilomoles of a fuel with one carbon atom a molecule, burned completely and burned at three lower efficiencies:');
  head('destruction efficiency', 'carbon kmol', 'co2Tonnes', 'ch4Tonnes');
  for (const eta of [1, 0.99, 0.98, 0.95]) {
    const r = CA.combustionCo2FromCarbon({ fuelKmolPerYear: 1000, carbonPerKmolFuel: 1, destructionEfficiencyFraction: eta });
    row(eta, km(r.carbonKmolPerYear), t3(answered(r, 'co2Tonnes', `unit ${eta}`)), t3(r.ch4Tonnes));
  }
  out('');
  out(`Each kilomole of carbon that burns leaves as MW_CO2 kilograms of CO2, so 1000 kmol burned completely is ${t3(one.co2Tonnes)} t. Each kilomole that escapes leaves as MW_CH4 kilograms of methane.`);
  out(`The engine's result carries these keys and no other gas: ${Object.keys(one).filter((k) => /Tonnes$/.test(k)).join(', ')}. Nitrous oxide from combustion is not computed by the atom balance (FINDINGS-carbon H4); it needs an emission factor line.`);
}

/* ------------------------------------------------------------------ */
section('THE IGBOGENE FIRED HEATERS');
{
  const h = F.IGBOGENE_HEATERS;
  out(`Inputs (invented): fuel ${h.fuelKmolPerYear} kmol a year, ${h.carbonPerKmolFuel} kmol of carbon per kmol of fuel, destruction efficiency ${h.destructionEfficiencyFraction} (complete combustion, typed).`);
  out('');
  head('output', 'value');
  row('carbonKmolPerYear', km(answered(igHeat, 'carbonKmolPerYear', 'ig heat')));
  row('co2Tonnes', t3(igHeat.co2Tonnes));
  row('ch4Tonnes', t3(igHeat.ch4Tonnes));
  row('unburnedNote', plain(igHeat.unburnedNote));
  out('');
  out('The same heaters with a lower destruction efficiency typed, to show a burner line splitting into CO2 and methane:');
  head('destruction efficiency', 'co2Tonnes', 'ch4Tonnes');
  for (const eta of [0.999, 0.995]) {
    const r = CA.combustionCo2FromCarbon({ ...h, destructionEfficiencyFraction: eta });
    row(eta, t3(answered(r, 'co2Tonnes', `heat ${eta}`)), t3(r.ch4Tonnes));
  }
  out('');
  out('The carbon per kilomole of fuel is the fuel analysis read as carbon atoms: the Igbogene figure is an input, and the heaters\' CO2 moves with it:');
  head('carbon per kmol of fuel', 'co2Tonnes');
  for (const c of [1.0, 1.05, 1.09, 1.15]) {
    const r = CA.combustionCo2FromCarbon({ ...h, carbonPerKmolFuel: c });
    row(c.toFixed(2), t3(answered(r, 'co2Tonnes', `c ${c}`)));
  }
}

/* ------------------------------------------------------------------ */
section('THE IGBOGENE FLARE AS AN INVENTORY LINE');
{
  const fl = F.IGBOGENE_FLARE;
  out(`Inputs (invented): gas to the flare ${fl.fuelKmolPerYear} kmol a year, ${fl.carbonPerKmolFuel} kmol of carbon per kmol. The operator's flare study states a destruction efficiency of ${F.IGBOGENE_FLARE_DE} (invented). The methane line is converted at the course's GWP set (${G.label}, CH4 ${G.values.CH4}).`);
  out('');
  head('destruction efficiency', 'co2Tonnes', 'ch4Tonnes', 'methane line tCO2e', 'flare tCO2e (CO2 plus methane line)');
  for (const eta of F.IGBOGENE_FLARE_SWEEP) {
    const r = CA.combustionCo2FromCarbon({ ...fl, destructionEfficiencyFraction: eta });
    const lines = atomLines('Flaring', r, G);
    const ch4Line = lines.find((l) => l.gas === 'CH4');
    const tot = lines.reduce((a, l) => a + l.tCo2e, 0);
    row(eta, t3(answered(r, 'co2Tonnes', `flare ${eta}`)), t3(r.ch4Tonnes), ch4Line ? t3(ch4Line.tCo2e) : 'no line (no methane)', t3(tot));
  }
  out('');
  out(`Blank: ${refused(CA.combustionCo2FromCarbon({ ...fl, destructionEfficiencyFraction: '' }), 'flare blank')}`);
  out('');
  const lines = atomLines('Flaring', igFlare, G);
  const ch4Line = lines.find((l) => l.gas === 'CH4');
  const tot = lines.reduce((a, l) => a + l.tCo2e, 0);
  out(`At ${F.IGBOGENE_FLARE_DE} the methane line is ${t3(ch4Line.tCo2e)} tCO2e of the flare's ${t3(tot)} tCO2e, a share of ${share(ch4Line.tCo2e / tot)} (computed here from the engine's figures).`);
  const at1 = CA.combustionCo2FromCarbon({ ...fl, destructionEfficiencyFraction: 1 });
  out(`Read as 100 percent, the same flare is ${t3(at1.co2Tonnes)} tCO2e with no methane line: ${t3(tot - at1.co2Tonnes)} tCO2e below the flare at ${F.IGBOGENE_FLARE_DE} (computed here from the engine's figures).`);
  out('');
  out(`The engine's note on the escaped carbon, verbatim: "${igFlare.unburnedNote}"`);
  out('');
  out('HELD, FINDINGS-carbon H3: every carbon atom that escapes is counted as methane. That is the engine\'s stated and conservative assumption. A method that uses the gas\'s own methane content is a different method and is the owner\'s decision; this course teaches the assumption as the assumption it is and grades nothing that depends on changing it.');
  out('This course teaches the flare as one line of an inventory. The flare as a resource (what the gas is worth, how to recover it) belongs to the sibling course Flare Gas to Value & LPG/CNG.');
}

/* ------------------------------------------------------------------ */
section('GLOBAL WARMING POTENTIALS: A SET CARRIES ITS REPORT');
{
  out(`The engine ships no GWP. makeGwpSet takes a label and values from the caller. The four sets below are IPCC ${F.GWP_HORIZON} values as tabulated in ${F.GWP_SOURCE}.`);
  out('');
  head('set', 'report', 'horizon', 'CH4', 'N2O', 'declared by the engine');
  for (const [k, s] of Object.entries(F.GWP_SETS)) row(s.label, s.report, F.GWP_HORIZON, s.values.CH4, s.values.N2O, yn(GW[k].declared));
  out('');
  out(`The engine's note on every set, verbatim: "${G.note}"`);
  out('');
  out(`The engine's methane note on every set, verbatim: "${G.methaneNote}"`);
  out('');
  out(`THE COURSE'S SET. Every inventory in this course is computed on "${G.label}", because the engine counts escaped carbon as methane and not as CO2 (the methane note above). The other three sets are printed beside it in SECTION 8.`);
  out('');
  out('HELD, FINDINGS-carbon H1: which assessment report an operator should file on. AR5 is what UNFCCC reporting has required and AR6 is what the GHG Protocol now recommends; which one a Nigerian operator files on is a regulatory reading, and a recommended default is the owner\'s decision. The course teaches both sets and grades no choice between them.');
  const noLabel = CA.makeGwpSet({ values: { CH4: 29.8 } });
  const noValues = CA.makeGwpSet({ label: 'IPCC AR6 GWP100' });
  out('');
  out('A set is declared only with a label and at least one value:');
  head('call', 'declared');
  row('values given, no label', yn(noLabel.declared));
  row('label given, no values', yn(noValues.declared));
  row(`label and values (${G.label})`, yn(G.declared));
}

/* ------------------------------------------------------------------ */
section('THE IGBOGENE INVENTORY');
{
  out(`Four sources on the course's set (${G.label}). The atom-balance lines carry a factor of 1 whose source is conservation of mass, as the Carbon Studio builds them. The vented methane line and the purchased electricity line carry registered factors (invented; the electricity factor is SYNTHETIC).`);
  out('');
  head('line', 'scope', 'gas', 'activity', 'unit', 'factor', 'factor unit', 'GWP', 'tonnes of gas', 'tCO2e', 'source', 'version', 'provenance complete');
  for (const l of igInv.lines) {
    row(l.label, l.scope, l.gas, t3(l.activity), l.activityUnit, l.factor, l.factorUnit, l.gwp, t3(l.tonnesGas), t3(l.tCo2e), l.source, l.version, yn(l.provenanceComplete));
  }
  out('');
  head('total', 'tCO2e');
  for (const s of igInv.byScope) row(s.label, t3(s.tCo2e));
  row('Total, Scope 1 and Scope 2', t3(igInv.totalTonnes));
  out('');
  out(`gwpSetLabel: ${igInv.gwpSetLabel}. computed: ${yn(igInv.computed)}. reportable: ${yn(igInv.reportable)}. blocked lines: ${igInv.blockedLines.length}. unsourced lines: ${igInv.unsourcedLines.length}.`);
  out('');
  out(`The engine's disclaimer, verbatim: "${igInv.disclaimer}"`);
  out('');
  const shares = igInv.lines.map((l) => [l.label, l.tCo2e / igInv.totalTonnes]);
  out('Each line as a share of the total (computed here from the engine\'s figures):');
  head('line', 'share of the total');
  shares.forEach(([lab, s]) => row(lab, share(s)));
  const printedShareSum = shares.reduce((a, [, s]) => a + Number(share(s)), 0);
  if (share(printedShareSum) !== share(1)) out(`ROUNDING NOTE: the shares as printed sum to ${share(printedShareSum)}; each is rounded to six decimals from the unrounded quotient, and the unrounded shares sum to 1.`);
}

/* ------------------------------------------------------------------ */
section('ONE INVENTORY ON FOUR GWP SETS');
{
  out('The Igbogene inventory rebuilt on each set. Only the methane lines move; every CO2 line has a GWP of 1 on every set.');
  out('');
  head('set', 'Scope 1 tCO2e', 'Scope 2 tCO2e', 'total tCO2e', 'total less the course set (computed here)');
  for (const [k, s] of Object.entries(F.GWP_SETS)) {
    const inv = CA.buildInventory({ lines: igLines(GW[k]), gwpSet: GW[k] });
    row(s.label, t3(inv.scope1Tonnes), t3(inv.scope2Tonnes), t3(inv.totalTonnes), t3(inv.totalTonnes - igInv.totalTonnes));
  }
  out('');
  out('The methane lines alone, on each set:');
  head('set', ...igInv.lines.filter((l) => l.gas === 'CH4').map((l) => `${l.label} tCO2e`));
  for (const [k, s] of Object.entries(F.GWP_SETS)) {
    const inv = CA.buildInventory({ lines: igLines(GW[k]), gwpSet: GW[k] });
    row(s.label, ...inv.lines.filter((l) => l.gas === 'CH4').map((l) => t3(l.tCo2e)));
  }
  out('');
  out('An inventory on one set is not comparable with one on another. The engine states its set on every result (gwpSetLabel), and an intensity carries it too (SECTION 10).');
}

/* ------------------------------------------------------------------ */
section('COMPUTED AND REPORTABLE');
{
  out('The Igbogene inventory as a first pass: no GWP set declared, the electricity factor box blank, the vented methane survey not yet referenced, the flare\'s destruction efficiency blank. Then each gap closed in turn. Every row is a buildInventory call.');
  out('');
  const noSet = CA.makeGwpSet({ label: '', values: {} });
  const flareBlank = CA.combustionCo2FromCarbon({ ...F.IGBOGENE_FLARE, destructionEfficiencyFraction: '' });
  const ventUnsourced = (g) => lineOf(F.IGBOGENE_VENT, g, { factor: { source: null, version: null } });
  const powerBlank = (g) => lineOf(F.IGBOGENE_POWER, g, { factor: { value: '', source: null, version: null } });
  const steps = [
    ['as a first pass', noSet, (g) => [...atomLines('Fired heaters', igHeat, g), ...atomLines('Flaring', flareBlank, g), ventUnsourced(g), powerBlank(g)]],
    ['the GWP set declared', G, (g) => [...atomLines('Fired heaters', igHeat, g), ...atomLines('Flaring', flareBlank, g), ventUnsourced(g), powerBlank(g)]],
    ['the flare efficiency entered', G, (g) => [...atomLines('Fired heaters', igHeat, g), ...atomLines('Flaring', igFlare, g), ventUnsourced(g), powerBlank(g)]],
    ['the electricity factor entered with its source', G, (g) => [...atomLines('Fired heaters', igHeat, g), ...atomLines('Flaring', igFlare, g), ventUnsourced(g), lineOf(F.IGBOGENE_POWER, g)]],
    ['the survey referenced', G, (g) => igLines(g)],
  ];
  head('step', 'lines', 'Scope 1 tCO2e', 'Scope 2 tCO2e', 'total tCO2e', 'computed', 'reportable', 'not reportable because');
  for (const [what, g, lines] of steps) {
    const inv = CA.buildInventory({ lines: lines(g), gwpSet: g });
    row(what, inv.lines.length, t3(inv.scope1Tonnes), t3(inv.scope2Tonnes), t3(inv.totalTonnes), yn(inv.computed), yn(inv.reportable), inv.notReportableBecause ? inv.notReportableBecause.join('; ') : 'none');
  }
  out('');
  const first = CA.buildInventory({ lines: steps[0][2](noSet), gwpSet: noSet });
  out(`In the first pass the flare contributes no line at all, because the engine refused it (SECTION 2), and the Carbon Studio builds atom-balance lines only from a result that computed. The first pass has ${first.blockedLines.length} blocked line(s) and ${first.unsourcedLines.length} unsourced line(s); a blocked line is not also counted as unsourced. The blocked lines, as the engine names them:`);
  head('line', 'blocked by, or missing');
  first.blockedLines.forEach((b) => row(b.label, `blocked: ${b.reason}`));
  first.unsourcedLines.forEach((u) => row(u.label, `unsourced: missing ${u.missing.join(' and ')}`));
  out('');
  const withBad = CA.buildInventory({
    lines: [...igLines(G), CA.emissionLine({ label: 'Diesel generators', scope: 1, activity: 1200, activityUnit: 'GJ', gwpSet: G }),
      lineOf({ ...F.IGBOGENE_POWER, label: 'Business travel', scope: 3, activity: 400 }, G)],
    gwpSet: G,
  });
  out('Two more lines added to the complete inventory: one with no registered factor, and one on scope 3. Both are blocked and named, the totals stay the Scope 1 and Scope 2 figures of SECTION 7, and the inventory stops being reportable:');
  head('line', 'reason');
  withBad.blockedLines.forEach((b) => row(b.label, b.reason));
  out('');
  out(`total tCO2e ${t3(withBad.totalTonnes)}; reportable ${yn(withBad.reportable)}; not reportable because: ${withBad.notReportableBecause.join('; ')}.`);
}

/* ------------------------------------------------------------------ */
section('INTENSITY AND ITS BOUNDARY');
{
  const a = CA.carbonIntensity({ inventory: igInv, ...F.IGBOGENE_INTENSITY });
  const b = CA.carbonIntensity({ inventory: igInv, ...F.IGBOGENE_INTENSITY_ALT });
  out('The same Igbogene inventory over two boundaries (both invented):');
  head('boundary', 'denominator', 'unit', 'Scope 1 intensity', 'Scope 2 intensity', 'total intensity', 'reportable');
  for (const r of [a, b]) row(r.boundaryLabel, r.denominatorValue, r.unit, inten(answered(r, 'scope1Intensity', r.boundaryLabel)), inten(r.scope2Intensity), inten(r.totalIntensity), yn(r.reportable));
  out('');
  out(`The comparability note on the first, verbatim: "${a.comparabilityNote}"`);
  out('');
  const firstPass = CA.buildInventory({ lines: [...atomLines('Fired heaters', igHeat, G), ...atomLines('Flaring', igFlare, G), lineOf(F.IGBOGENE_VENT, G), lineOf(F.IGBOGENE_POWER, G, { factor: { value: '', source: null, version: null } })], gwpSet: G });
  const c = CA.carbonIntensity({ inventory: firstPass, ...F.IGBOGENE_INTENSITY });
  out(`An intensity inherits its inventory's status. With the electricity factor blank the total intensity is ${inten(c.totalIntensity)} ${c.unit}, reportable ${yn(c.reportable)}, because: ${c.notReportableBecause.join('; ')}.`);
  out(`${refused(CA.carbonIntensity({ inventory: igInv, denominatorValue: 3650000, denominatorUnit: 'boe' }), 'no boundary')}`);
}

/* ------------------------------------------------------------------ */
section('THE ISIOKPO FUEL GAS: COMBUSTION FROM THE ANALYSIS');
{
  out(`The fuel gas analysis (invented), in mole fractions, with the engine's typical heating values: ${F.ISIOKPO_FUEL.map(([c, y]) => `${c} ${y}`).join(', ')}.`);
  out('');
  head('output', 'value', 'unit');
  row('o2PerKmolFuel', frac(answered(isSt, 'o2PerKmolFuel', 'isSt')), 'kmol O2 per kmol fuel');
  row('stoichAirPerKmolFuel', frac(isSt.stoichAirPerKmolFuel), 'kmol air per kmol fuel');
  row('stoichAirKgPerKgFuel', frac(isSt.stoichAirKgPerKgFuel), 'kg air per kg fuel');
  row('fuelMolarMassKgKmol', kg(isSt.fuelMolarMassKgKmol), 'kg per kmol');
  row('products.co2PerKmolFuel', frac(isSt.products.co2PerKmolFuel), 'kmol per kmol fuel');
  row('products.h2oPerKmolFuel', frac(isSt.products.h2oPerKmolFuel), 'kmol per kmol fuel');
  row('products.airN2PerKmolFuel', frac(isSt.products.airN2PerKmolFuel), 'kmol per kmol fuel');
  row('products.fuelN2PerKmolFuel', frac(isSt.products.fuelN2PerKmolFuel), 'kmol per kmol fuel');
  row('lhvMJPerKmolFuel', isSt.lhvMJPerKmolFuel.toFixed(4), 'MJ per kmol fuel');
  row('hhvMJPerKmolFuel', isSt.hhvMJPerKmolFuel.toFixed(4), 'MJ per kmol fuel');
  out('');
  out(`The oxygen demand is c + h/4 + s - o/2 for each component, weighted by its mole fraction. The CO2 in the fuel has c = 1 and o = 2, so it demands no oxygen and passes into the flue gas: the ${F.ISIOKPO_FUEL.find(([c]) => c === 'CO2')[1]} kmol of fuel CO2 is inside products.co2PerKmolFuel above. The fuel's nitrogen is carried separately from the air's.`);
  const noCo2 = EE.combustionStoichiometry({ components: fuelComponents(F.ISIOKPO_FUEL.filter(([c]) => c !== 'CO2')) });
  out(`With the CO2 taken out of the analysis and the rest renormalised, o2PerKmolFuel is ${frac(noCo2.o2PerKmolFuel)} and lhvMJPerKmolFuel ${noCo2.lhvMJPerKmolFuel.toFixed(4)}: the inerts dilute the fuel.`);
  out('');
  const ea3 = EE.excessAirFromFlueOxygen({ stoichiometry: isSt, dryO2Percent: 3 });
  const eff3 = EE.stackLossEfficiency({ stoichiometry: isSt, excessAir: ea3, stackTempC: H.stackTempC, combustionAirTempC: H.combustionAirTempC, flueGasCpKJkgK: 1.1, waterVapourCpKJkgK: 1.95, radiationLossPercent: H.radiationLossPercent });
  const inKg = isSt.fuelMolarMassKgKmol + ea3.actualAirPerKmolFuel * EE.AIR_MOLAR_MASS;
  const outKg = eff3.dryFlueGasKgPerKmolFuel + eff3.moistureKgPerKmolFuel;
  out('THE MASS BALANCE at 3 percent stack oxygen, per kmol of fuel. Air enters at AIR_MOLAR_MASS; the air\'s non-oxygen part leaves as "atmospheric nitrogen" at ATMOSPHERIC_N2_MOLAR_MASS, which carries air\'s argon:');
  head('side', 'kg per kmol of fuel');
  row('fuel plus air in (fuel molar mass plus actual air times AIR_MOLAR_MASS)', kg(inKg));
  row('flue gas out (engine dry flue gas plus engine moisture)', kg(outKg));
  row('out less in (computed here)', frac(outKg - inKg));
}

/* ------------------------------------------------------------------ */
section('EXCESS AIR FROM THE STACK OXYGEN');
{
  const ex = EE.excessAirFromFlueOxygen({ stoichiometry: isSt, dryO2Percent: H.currentO2Percent });
  out(`The engine's assumption, verbatim: "${ex.assumption}"`);
  out('');
  out('The Isiokpo fuel gas at a range of measured dry stack oxygen readings:');
  head('dry O2 percent', 'excess air percent', 'actual air kmol per kmol fuel', 'dry flue gas kmol per kmol fuel', 'wet flue gas kmol per kmol fuel');
  for (const o2 of F.ISIOKPO_O2_SWEEP) {
    const r = EE.excessAirFromFlueOxygen({ stoichiometry: isSt, dryO2Percent: o2 });
    row(o2, pct(answered(r, 'excessAirPercent', `o2 ${o2}`)), frac(r.actualAirPerKmolFuel), frac(r.dryFlueGasPerKmolFuel), frac(r.wetFlueGasPerKmolFuel));
  }
  out('');
  head('the call', 'the engine says');
  for (const [what, o2] of [['dry O2 20.946 percent (all air)', 20.946], ['dry O2 21 percent', 21], ['dry O2 -1 percent', -1], ['dry O2 blank', '']]) {
    row(what, refused(EE.excessAirFromFlueOxygen({ stoichiometry: isSt, dryO2Percent: o2 }), what));
  }
  row('no stoichiometry', refused(EE.excessAirFromFlueOxygen({ dryO2Percent: 3 }), 'no st'));
  out('');
  out('The relation is solved in closed form: with E the excess-air fraction, E times the oxygen demand over (the stoichiometric dry products plus E times the stoichiometric air) equals the measured fraction. The oracle finds the same E by bisection on the full dry flue gas (SECTION 26).');
}

/* ------------------------------------------------------------------ */
section('STACK LOSS EFFICIENCY ON LHV AND ON HHV');
{
  out(`The Isiokpo heater (invented): stack ${H.stackTempC} C, combustion air ${H.combustionAirTempC} C, radiation and convection loss ${H.radiationLossPercent} percent read off the heater vendor's chart (invented), unburned loss ${H.unburnedLossPercent}. Flue gas cp ${PR.fluGasCpKJkgK.typical}, vapour cp ${PR.waterVapourCpKJkgK.typical} and latent heat ${PR.waterLatentHeatKJkg.typical} kJ/kg are the engine's typical values.`);
  out('');
  head('case', 'basis', 'excess air percent', 'dry flue gas loss', 'moisture loss', 'radiation', 'unburned', 'total loss percent', 'efficiency percent');
  for (const [what, r] of [[`current, ${H.currentO2Percent} percent O2`, isCur], [`target, ${H.targetO2Percent} percent O2`, isTgt], [`current, ${H.currentO2Percent} percent O2`, isCurH], [`target, ${H.targetO2Percent} percent O2`, isTgtH]]) {
    const l = Object.fromEntries(r.losses.map((x) => [x.label, x.percent]));
    row(what, r.basis, pct(r.excessAirPercent), pct(l['Dry flue gas']), pct(l['Moisture from hydrogen']), pct(l['Radiation and convection']), pct(l['Unburned and other']), pct(r.totalLossPercent), pct(answered(r, 'efficiencyPercent', what)));
  }
  out('');
  out(`dryFlueGasKgPerKmolFuel at ${H.currentO2Percent} percent: ${kg(isCur.dryFlueGasKgPerKmolFuel)}; moistureKgPerKmolFuel: ${kg(isCur.moistureKgPerKmolFuel)}.`);
  out(`The same heater at the same oxygen reads ${pct(isCur.efficiencyPercent)} percent on LHV and ${pct(isCurH.efficiencyPercent)} percent on HHV, a difference of ${pct(isCur.efficiencyPercent - isCurH.efficiencyPercent)} percentage points (computed here from the engine's figures).`);
  out('');
  out(`The moisture note on LHV, verbatim: "${isCur.moistureBasisNote}"`);
  out(`The moisture note on HHV, verbatim: "${isCurH.moistureBasisNote}"`);
  out(`The comparison warning on LHV, verbatim: "${isCur.comparisonWarning}"`);
  out('');
  head('the call', 'the engine says');
  row('radiation loss blank', refused(heaterAt(H.currentO2Percent, 'LHV', { radiationLossPercent: '' }), 'rad blank'));
  row('HHV with no latent heat', refused(heaterAt(H.currentO2Percent, 'HHV', { waterLatentHeatKJkg: null }), 'hhv latent'));
  row('stack temperature blank', refused(heaterAt(H.currentO2Percent, 'LHV', { stackTempC: '' }), 'stack blank'));
  row('flue gas cp blank', refused(heaterAt(H.currentO2Percent, 'LHV', { flueGasCpKJkgK: '' }), 'cp blank'));
  out('');
  out('The radiation loss moves the efficiency one for one:');
  head('radiation and convection loss percent', 'efficiency percent, LHV, current');
  for (const rad of [1.0, 1.8, 2.5]) row(rad.toFixed(1), pct(answered(heaterAt(H.currentO2Percent, 'LHV', { radiationLossPercent: rad }), 'efficiencyPercent', `rad ${rad}`)));
}

/* ------------------------------------------------------------------ */
section('WHAT TUNING THE EXCESS AIR IS WORTH');
{
  out(`Current ${H.currentO2Percent} percent O2, target ${H.targetO2Percent} percent, a minimum safe stack oxygen of ${H.minimumSafeO2Percent} percent declared after a combustion test (invented), and ${H.annualFuelEnergyGJ} GJ of fuel a year on LHV (invented).`);
  out('');
  head('output', 'value');
  row('basis', isSave.basis);
  row('currentEfficiencyPercent', pct(isSave.currentEfficiencyPercent));
  row('targetEfficiencyPercent', pct(isSave.targetEfficiencyPercent));
  row('fuelSavingFraction', isSave.fuelSavingFraction.toFixed(10));
  row('fuelSavingPercent', pct(answered(isSave, 'fuelSavingPercent', 'save')));
  row('annualEnergySavedGJ', gj(isSave.annualEnergySavedGJ));
  out('');
  out(`The engine's method, verbatim: "${isSave.method}"`);
  const shortcut = (isSave.targetEfficiencyPercent - isSave.currentEfficiencyPercent) / 100;
  out(`The percentage-point shortcut on the same figures (computed here from the engine's efficiencies; the engine does not return it): a saving fraction of ${shortcut.toFixed(10)}, which is ${gj(shortcut * H.annualFuelEnergyGJ)} GJ a year, ${gj(isSave.annualEnergySavedGJ - shortcut * H.annualFuelEnergyGJ)} GJ below the engine's saving.`);
  const onH = EE.excessAirSaving({ current: isCurH, target: isTgtH, minimumSafeO2Percent: H.minimumSafeO2Percent, targetO2Percent: H.targetO2Percent, annualFuelEnergyGJ: H.annualFuelEnergyGJ });
  out(`On HHV the same tuning is a saving fraction of ${onH.fuelSavingFraction.toFixed(10)} (fuelSavingPercent ${pct(onH.fuelSavingPercent)}), computed from the two HHV efficiencies of SECTION 13. The engine multiplies a saving fraction by the annual fuel it is given, and the basis of that fuel figure is the caller's to match.`);
  out('');
  head('the call', 'the engine says');
  const sv = (what, args) => row(what, refused(EE.excessAirSaving({ current: isCur, target: isTgt, annualFuelEnergyGJ: H.annualFuelEnergyGJ, ...args }), what));
  sv('minimum safe oxygen blank', { minimumSafeO2Percent: '', targetO2Percent: H.targetO2Percent });
  sv('target oxygen blank', { minimumSafeO2Percent: H.minimumSafeO2Percent, targetO2Percent: '' });
  sv(`a target of 1.5 percent against the ${H.minimumSafeO2Percent} percent floor`, { minimumSafeO2Percent: H.minimumSafeO2Percent, targetO2Percent: 1.5 });
  row('current on LHV, target on HHV', refused(EE.excessAirSaving({ current: isCur, target: isTgtH, minimumSafeO2Percent: H.minimumSafeO2Percent, targetO2Percent: H.targetO2Percent }), 'bases'));
  out('');
  out('The saving at a sweep of target oxygen readings, every one at or above the declared floor:');
  head('target O2 percent', 'target efficiency percent LHV', 'fuelSavingPercent', 'annualEnergySavedGJ');
  for (const o2 of [2.0, 2.8, 3.5, 4.5]) {
    const tg = heaterAt(o2);
    const s = EE.excessAirSaving({ current: isCur, target: tg, minimumSafeO2Percent: H.minimumSafeO2Percent, targetO2Percent: o2, annualFuelEnergyGJ: H.annualFuelEnergyGJ });
    row(o2.toFixed(1), pct(tg.efficiencyPercent), pct(answered(s, 'fuelSavingPercent', `sweep ${o2}`)), gj(s.annualEnergySavedGJ));
  }
}

/* ------------------------------------------------------------------ */
section('THE ISIOKPO STEAM TRAP');
{
  const T = F.ISIOKPO_TRAP;
  const tr = EE.steamTrapLoss(T);
  const tr13 = EE.steamTrapLoss({ ...T, specificHeatRatio: 1.3 });
  out(`One trap failed open (invented): orifice ${T.orificeDiameterMm} mm, ${T.upstreamPressureBarA} bar a upstream, discharge coefficient ${T.dischargeCoefficient}, steam density ${T.steamDensityKgM3} kg/m3, isentropic exponent ${T.specificHeatRatio} (dry saturated steam), ${T.hoursPerYear} hours in service a year, steam at ${T.steamCostPerTonne} USD a tonne and ${T.steamEnergyMJPerTonne} MJ a tonne, a boiler efficiency of ${T.boilerEfficiencyFraction} and a SYNTHETIC fuel emission factor of ${T.emissionFactorKgCo2ePerGJ} kg CO2e per GJ.`);
  out('');
  head('isentropic exponent', 'kg an hour', 'tonnes a year', 'annual cost USD', 'annual fuel GJ', 'annual tCO2e');
  for (const [k, r] of [[T.specificHeatRatio, tr], [1.3, tr13]]) row(k, kgh(answered(r, 'kgPerHour', `trap ${k}`)), t3(r.tonnesPerYear), usd(r.annualCost), gj(r.annualFuelGJ), t3(r.annualTonnesCo2e));
  out('');
  out(`At the superheated exponent the same trap loses ${t3(tr13.tonnesPerYear - tr.tonnesPerYear)} tonnes a year more, a ratio of ${share(tr13.tonnesPerYear / tr.tonnesPerYear)} to the saturated figure (computed here from the engine's figures).`);
  out(`The choked-flow note, verbatim: "${tr.chokedNote}"`);
  out('');
  head('the call', 'the engine says');
  const tq = (what, args) => row(what, refused(EE.steamTrapLoss({ ...T, ...args }), what));
  tq('isentropic exponent blank', { specificHeatRatio: '' });
  tq('isentropic exponent 1', { specificHeatRatio: 1 });
  tq('hours a year blank', { hoursPerYear: '' });
  tq('hours a year 9000', { hoursPerYear: 9000 });
  tq('discharge coefficient blank', { dischargeCoefficient: '' });
  tq('orifice blank', { orificeDiameterMm: '' });
  out('');
  const noEta = EE.steamTrapLoss({ ...T, boilerEfficiencyFraction: '' });
  out(`With the boiler efficiency blank the trap still loses ${t3(noEta.tonnesPerYear)} tonnes a year, and the fuel and carbon are none. fuelNote, verbatim: "${noEta.fuelNote}" carbonNote, verbatim: "${noEta.carbonNote}"`);
  const left = EE.steamTrapLoss({ ...T, hoursPerYear: undefined });
  out(`Hours left out of the call take the stated default of 8760: ${t3(answered(left, 'tonnesPerYear', 'hours left'))} tonnes a year.`);
}

/* ------------------------------------------------------------------ */
section('CONDENSATE RETURN AND ITS FLOOR');
{
  const C = F.ISIOKPO_CONDENSATE;
  const full = EE.condensateReturnValue(C);
  const floor = EE.condensateReturnValue({ ...C, treatmentCostPerTonne: null });
  out(`Isiokpo raises condensate return (invented): ${C.steamTonnesPerHour} t of steam an hour, return from ${C.currentReturnFraction} to ${C.targetReturnFraction}, condensate at ${C.condensateTempC} C against makeup at ${C.makeupTempC} C, boiler efficiency ${C.boilerEfficiencyFraction}, fuel at ${C.fuelCostPerGJ} USD a GJ, raw water ${C.waterCostPerTonne} and treatment ${C.treatmentCostPerTonne} USD a tonne, ${C.hoursPerYear} hours, a SYNTHETIC factor of ${C.emissionFactorKgCo2ePerGJ} kg CO2e per GJ.`);
  out('');
  head('output', 'with treatment priced', 'with treatment left blank');
  row('extraCondensateTonnesPerYear', t3(answered(full, 'extraCondensateTonnesPerYear', 'cond')), t3(floor.extraCondensateTonnesPerYear));
  row('energySavedGJPerYear', gj(full.energySavedGJPerYear), gj(floor.energySavedGJPerYear));
  full.components.forEach((c, i) => row(c.label, usd(c.amount), usd(floor.components[i].amount)));
  row('annualValue', usd(full.annualValue), usd(floor.annualValue));
  row('complete', yn(full.complete), yn(floor.complete));
  row('annualTonnesCo2e', t3(full.annualTonnesCo2e), t3(floor.annualTonnesCo2e));
  out('');
  out(`valueNote with the treatment blank, verbatim: "${floor.valueNote}"`);
  out('');
  head('the call', 'the engine says');
  row('boiler efficiency blank', refused(EE.condensateReturnValue({ ...C, boilerEfficiencyFraction: '' }), 'cond eta'));
  row('hours a year blank', refused(EE.condensateReturnValue({ ...C, hoursPerYear: '' }), 'cond hours'));
  row('target return 1.2', refused(EE.condensateReturnValue({ ...C, targetReturnFraction: 1.2 }), 'cond 1.2'));
}

/* ------------------------------------------------------------------ */
section('THE PINCH: MINIMUM UTILITIES BY THE PROBLEM TABLE');
{
  out('Four Isiokpo process streams (invented). A stream is hot when its supply is above its target.');
  out('');
  head('stream', 'supply C', 'target C', 'CP kW/K');
  F.ISIOKPO_STREAMS.forEach((s) => row(s.label, s.supplyC, s.targetC, s.cpKWperK));
  out('');
  head('minimum approach C', 'hot utility kW', 'cold utility kW', 'pinch hot C', 'pinch cold C', 'heat recovered kW', 'total hot stream duty kW', 'total cold stream duty kW', 'balance check', 'threshold problem');
  for (const d of F.ISIOKPO_DTMIN) {
    const p = EE.pinchTargets({ streams: F.ISIOKPO_STREAMS, minimumApproachC: d });
    row(d, kw(answered(p, 'hotUtilityKW', `pinch ${d}`)), kw(p.coldUtilityKW), degc(p.pinchHotC), degc(p.pinchColdC), kw(p.heatRecoveredKW), kw(p.totalHotStreamDutyKW), kw(p.totalColdStreamDutyKW), kw(p.balanceCheck), yn(p.thresholdProblem));
  }
  out('');
  const p = EE.pinchTargets({ streams: F.ISIOKPO_STREAMS, minimumApproachC: F.ISIOKPO_DTMIN_CASE });
  out(`The problem table at ${F.ISIOKPO_DTMIN_CASE} C. Hot streams are shifted down and cold streams up by half the minimum approach; the cascade below already carries the hot utility at the top:`);
  head('top shifted C', 'bottom shifted C', 'CP hot kW/K', 'CP cold kW/K', 'surplus kW', 'heat flow below kW');
  p.intervals.forEach((iv) => row(degc(iv.topShiftedC), degc(iv.bottomShiftedC), frac(iv.cpHotKWperK), frac(iv.cpColdKWperK), kw(iv.surplusKW), kw(iv.cascadeKW)));
  out('');
  out(`The heat flow is zero at shifted ${degc(p.pinchShiftedC)} C, inside the range: the pinch, ${degc(p.pinchHotC)} C on the hot side and ${degc(p.pinchColdC)} C on the cold side.`);
  out(`The engine's note, verbatim: "${p.crossPinchNote}"`);
  out('');
  const thr = EE.pinchTargets({ streams: [{ label: 'Hot', supplyC: 200, targetC: 50, cpKWperK: 10 }, { label: 'Cold', supplyC: 30, targetC: 60, cpKWperK: 1 }], minimumApproachC: 10 });
  out('A threshold problem: one hot stream from 200 C to 50 C at 10 kW/K and one cold stream from 30 C to 60 C at 1 kW/K, at 10 C:');
  head('hot utility kW', 'cold utility kW', 'pinch hot C', 'threshold problem');
  row(kw(thr.hotUtilityKW), kw(thr.coldUtilityKW), degc(thr.pinchHotC), yn(thr.thresholdProblem));
  out('Its heat flow down the shifted temperatures (the grand composite):');
  head('shifted C', 'heat flow kW');
  thr.grandComposite.forEach((g) => row(degc(g.shiftedC), kw(g.heatFlowKW)));
  const zeros = thr.grandComposite.filter((g) => Math.abs(g.heatFlowKW) < 1e-6);
  if (zeros.length !== 1 || zeros[0] !== thr.grandComposite[0]) throw new Error('THRESHOLD CLAIM: the threshold case is not zero at the top alone');
  out('The heat flow is zero only at the top of the cascade, where the hot utility is zero. The engine reports no pinch there: a zero at either end of the cascade is a threshold, and naming it a pinch would invent a constraint.');
  out('');
  head('the call', 'the engine says');
  row('a stream with CP -2', refused(EE.pinchTargets({ streams: [{ supplyC: 100, targetC: 50, cpKWperK: -2 }, { supplyC: 20, targetC: 80, cpKWperK: 1 }], minimumApproachC: 10 }), 'neg cp'));
  row('minimum approach blank', refused(EE.pinchTargets({ streams: F.ISIOKPO_STREAMS, minimumApproachC: '' }), 'dtmin blank'));
  row('no stream changes temperature', refused(EE.pinchTargets({ streams: [{ supplyC: 50, targetC: 50, cpKWperK: 1 }], minimumApproachC: 10 }), 'flat'));
}

/* ------------------------------------------------------------------ */
section('THE COST OF A TONNE ABATED');
{
  out(`Six Agbor measures (every figure invented, US dollars), annualised at a discount rate of ${F.AGBOR_DISCOUNT_RATE} (a fraction). A negative cost per tonne means the measure pays for itself and abates carbon as a side effect.`);
  out('');
  head('measure', 'capital USD', 'annual savings USD', 'annual cost USD', 'tonnes abated a year', 'life years', 'acts on');
  F.AGBOR_MEASURES.forEach((m) => row(m.label, m.capitalCost, m.annualSavings, m.annualCost, m.tonnesAbatedPerYear, m.lifeYears, m.actsOn.join(', ')));
  out('');
  head('measure', 'capital recovery factor', 'annualised capital USD', 'net annual cost USD', 'cost per tonne USD', 'pays for itself');
  agCosted.forEach((m) => row(m.label, crf(m.capitalRecoveryFactor), usd(m.annualisedCapital), usd(m.netAnnualCost), usdt(answered(m, 'costPerTonne', m.label)), yn(m.paysForItself)));
  out('');
  out('The capital recovery factor is r(1 + r)^n / ((1 + r)^n - 1). At a rate of 0 it is 1/n, straight line. The net annual cost is the annualised capital plus the annual cost less the annual savings; the cost per tonne is that over the tonnes abated a year.');
  out('');
  out('The same measures at a rate of 0 (straight line), and with the whole capital set against one year (computed here from the inputs; the engine refuses to compare a one-off cost with a recurring saving):');
  head('measure', 'cost per tonne at rate 0 USD', 'capital against one year USD per tonne (computed here)');
  F.AGBOR_MEASURES.forEach((m) => {
    const z = costOf(m, 0);
    row(m.label, usdt(answered(z, 'costPerTonne', `${m.label} r0`)), usdt((m.capitalCost + m.annualCost - m.annualSavings) / m.tonnesAbatedPerYear));
  });
}

/* ------------------------------------------------------------------ */
section('WHAT THE COST OF A TONNE REFUSES, AND WHAT IT NAMES');
{
  const m = F.AGBOR_MEASURES[2];
  head('the call', 'the engine says');
  const ac = (what, args) => row(what, refused(CA.abatementCost({ ...m, discountRate: F.AGBOR_DISCOUNT_RATE, ...args }), what));
  ac('abatement -500 t a year', { tonnesAbatedPerYear: -500 });
  ac('abatement blank', { tonnesAbatedPerYear: '' });
  ac('capital cost blank', { capitalCost: '' });
  ac('discount rate blank', { discountRate: '' });
  ac('discount rate 10 (a percentage typed)', { discountRate: 10 });
  ac('life blank', { lifeYears: '' });
  out('');
  const named = CA.abatementCost({ ...m, discountRate: F.AGBOR_DISCOUNT_RATE, annualSavings: '', annualCost: null });
  out(`Blank running figures are taken as 0 and NAMED. ${m.label} with the savings and the running cost blank: costPerTonne ${usdt(answered(named, 'costPerTonne', 'named'))} USD, assumedZero: ${named.assumedZero.join(', ')}.`);
  const zero = CA.abatementCost({ ...m, capitalCost: 0, lifeYears: '', discountRate: '' });
  out(`A capital of 0 typed needs no life and no rate: ${m.label} with capital 0 answers costPerTonne ${usdt(answered(zero, 'costPerTonne', 'zero cap'))} USD and capitalRecoveryFactor ${crf(zero.capitalRecoveryFactor)}.`);
  const none = CA.abatementCost({ ...m, tonnesAbatedPerYear: 0 });
  out(`An abatement of 0 is accepted and has no cost per tonne: costPerTonne ${usdt(none.costPerTonne)}, paysForItself ${yn(none.paysForItself)}.`);
}

/* ------------------------------------------------------------------ */
section('THE AGBOR MARGINAL ABATEMENT COST CURVE');
{
  out('The six measures ranked cheapest first. Each step\'s width is its tonnes a year and its height its cost per tonne; the steps tile the axis from 0.');
  out('');
  head('order', 'measure', 'cost per tonne USD', 'tonnes a year', 'cumulative start t', 'cumulative end t', 'pays for itself');
  agCurve.steps.forEach((s, i) => row(i + 1, s.label, usdt(s.costPerTonne), t3(s.tonnesAbatedPerYear), t3(s.cumulativeStartTonnes), t3(s.cumulativeEndTonnes), yn(s.paysForItself)));
  out('');
  head('output', 'value');
  row('totalAbatementTonnes', t3(answered(agCurve, 'totalAbatementTonnes', 'curve')));
  row('paysForItselfTonnes', t3(agCurve.paysForItselfTonnes));
  row('paysForItselfMeasures', agCurve.paysForItselfMeasures.join('; '));
  row('netAnnualCostOfAll USD', usd(agCurve.netAnnualCostOfAll));
  const printedNetSum = agCosted.reduce((a, m) => a + Number(usd(m.netAnnualCost)), 0);
  row('weightedAverageCostPerTonne USD', usdt(agCurve.weightedAverageCostPerTonne));
  row('additive', yn(agCurve.additive));
  if (usd(printedNetSum) !== usd(agCurve.netAnnualCostOfAll)) out(`ROUNDING NOTE: the six net annual costs as printed in SECTION 18 sum to ${usd(printedNetSum)} USD; the engine sums the net annual costs it holds to four decimals, which gives ${usd(agCurve.netAnnualCostOfAll)} USD.`);
  out('');
  const simpleMean = agCosted.reduce((a, m) => a + m.costPerTonne, 0) / agCosted.length;
  out(`The weighted average is the net annual cost of all the measures over the total tonnes. The plain mean of the six costs per tonne (computed here) is ${usdt(simpleMean)} USD, which weights a small measure the same as a large one.`);
  out('');
  out('Measures that act on the same source interact:');
  head('source', 'measures');
  agCurve.interactions.forEach((x) => row(x.sourceId, x.measures.join('; ')));
  out('');
  out(`The interaction note, verbatim: "${agCurve.interactionNote}"`);
}

/* ------------------------------------------------------------------ */
section('SOURCES, INTERACTIONS AND OVER-CLAIMS');
{
  out(`The Agbor inventory the measures act on, on the course's set (${G.label}). Each source's emission is its CO2 plus its methane in CO2e, as the Carbon Studio passes it to the curve.`);
  out('');
  head('line', 'scope', 'tCO2e');
  agInv.lines.forEach((l) => row(l.label, l.scope, t3(l.tCo2e)));
  row('Total, Scope 1 and Scope 2', '', t3(agInv.totalTonnes));
  out('');
  head('source id', 'emission passed to the curve tCO2e');
  Object.entries(agSources).forEach(([k, v]) => row(k, t3(v)));
  out('');
  out(`The target is ${pct30} percent of the inventory total: ${t3(agTarget)} tCO2e (computed here, as the Carbon Studio computes it).`);
  out('');
  const over = CA.abatementCurve({ measures: agCosted.map((m) => (m.label === 'Flare gas recovery' ? costOf({ ...F.AGBOR_MEASURES[3], tonnesAbatedPerYear: F.AGBOR_FLARE_OVERCLAIM_T }) : m)), sourceEmissions: agSources, targetTonnes: agTarget });
  const noSrc = CA.abatementCurve({ measures: agCosted.map((m) => (m.label === 'Flare gas recovery' ? costOf({ ...F.AGBOR_MEASURES[3], tonnesAbatedPerYear: F.AGBOR_FLARE_OVERCLAIM_T }) : m)), sourceEmissions: { heaters: agSources.heaters }, targetTonnes: agTarget });
  head('curve', 'total abatement t', 'target t', 'meetsTarget', 'targetBasis', 'residual to target t', 'over-claims');
  const rw = (what, c) => row(what, t3(c.totalAbatementTonnes), t3(c.targetTonnes), yn(c.meetsTarget), plain(c.targetBasis), t3(c.residualToTargetTonnes), c.overClaims.length ? c.overClaims.map((o) => `${o.sourceId}: claimed ${t3(o.claimedTonnes)} against ${t3(o.emittedTonnes)} emitted`).join('; ') : 'none');
  rw('the six measures as costed', agCurve);
  rw(`flare gas recovery claiming ${F.AGBOR_FLARE_OVERCLAIM_T} t`, over);
  rw(`the same claim, the flare's emission not passed`, noSrc);
  out('');
  out('Where measures only interact, the verdict stands and is labelled an upper bound. Where a claim exceeds what its source emits, the curve adds up tonnes that do not exist, and the verdict is none. A source whose emission is not passed cannot be checked, and the claim against it stands unexamined.');
}

/* ------------------------------------------------------------------ */
section('THE TARGET AND THE PATH');
{
  const { startYear: y0, endYear: y1 } = F.AGBOR_PLAN;
  out(`The Agbor baseline is the inventory total, ${t3(agInv.totalTonnes)} tCO2e. The target falls in a straight line from the baseline in ${y0} to ${pct30} percent below it in ${y1}, as the Carbon Studio draws it. Each measure counts in full from its start year.`);
  out('');
  head('year', 'abated t', 'emissions t', 'target t', 'unabated gap t', 'measures live');
  agPath.rows.forEach((r) => row(r.year, t3(r.abatedTonnes), t3(r.emissionsTonnes), t3(r.targetTonnes), t3(r.unabatedGapTonnes), r.measuresLive.length ? r.measuresLive.join('; ') : 'none'));
  out('');
  out(`firstShortfallYear: ${plain(agPath.firstShortfallYear)}. finalGapTonnes: ${t3(agPath.finalGapTonnes)}.`);
  if (agPath.gapNote) out(`The gap note, verbatim: "${agPath.gapNote}"`);
  out('');
  const partial = CA.buildInventory({ lines: agLines(''), gwpSet: G });
  const pPath = pathFor(partial.totalTonnes);
  out(`ON A PARTIAL INVENTORY. With the electricity factor blank, the inventory totals ${t3(partial.totalTonnes)} tCO2e and is reportable ${yn(partial.reportable)} (${partial.notReportableBecause.join('; ')}). A target and a path built on that total:`);
  head('baseline', 'target in the end year t', 'finalGapTonnes', 'firstShortfallYear');
  row('the full inventory', t3(agPath.rows[agPath.rows.length - 1].targetTonnes), t3(agPath.finalGapTonnes), plain(agPath.firstShortfallYear));
  row('the partial inventory', t3(pPath.rows[pPath.rows.length - 1].targetTonnes), t3(pPath.finalGapTonnes), plain(pPath.firstShortfallYear));
  out('');
  const uns = pathFor(agInv.totalTonnes, F.AGBOR_MEASURES.map((m) => (m.label === 'Vapour recovery on the storage tanks' ? { ...m, startYear: null } : m)));
  out(`A measure with no start year is named and left off the path: unscheduledMeasures ${uns.unscheduledMeasures.map((u) => `${u.label} (${u.reason})`).join('; ')}; finalGapTonnes ${t3(uns.finalGapTonnes)}.`);
  out(refused(CA.decarbonisationPath({ baselineTonnes: 0, measures: [], startYear: y0, endYear: y1 }), 'zero baseline'));
  out(refused(CA.decarbonisationPath({ baselineTonnes: agInv.totalTonnes, measures: [], startYear: y1, endYear: y0 }), 'reversed years'));
}

/* ------------------------------------------------------------------ */
section('ONE SAVING IN MONEY AND IN CARBON');
{
  const S = F.AGBOR_SAVING;
  const ps = EE.priceSaving({ ...S, energyBasis: 'LHV', fuelCostBasis: 'LHV', emissionFactorBasis: 'LHV' });
  out(`An Agbor saving (invented): ${S.energySavedGJ} GJ a year, fuel at ${S.fuelCostPerGJ} USD a GJ, a SYNTHETIC factor of ${S.emissionFactorKgCo2ePerGJ} kg CO2e per GJ, an implementation cost of ${S.implementationCost} USD over ${S.lifeYears} years at a rate of ${S.discountRate}, all three quantities declared on LHV.`);
  out('');
  head('output', 'value');
  row('annualValue USD', usd(ps.annualValue));
  row('annualTonnesCo2e', t3(ps.annualTonnesCo2e));
  row('simplePaybackYears', frac(ps.simplePaybackYears));
  row('costPerTonneCo2e USD', usdt(answered(ps, 'costPerTonneCo2e', 'ps')));
  row('basis', ps.basis);
  out('');
  out(`The cost per tonne is carbonAbatement.abatementCost called with the implementation cost as capital, the annual value as the saving and the annual tonnes as the abatement. Setting the whole implementation cost against one year's value and one year's tonnes (computed here) gives ${usdt((S.implementationCost - ps.annualValue) / ps.annualTonnesCo2e)} USD a tonne.`);
  out('');
  head('the call', 'what comes back');
  row('no life and no rate', `costPerTonneCo2e ${usdt(EE.priceSaving({ ...S, lifeYears: null, discountRate: null }).costPerTonneCo2e)}; costPerTonneNote "${EE.priceSaving({ ...S, lifeYears: null, discountRate: null }).costPerTonneNote}"`);
  row('no emission factor', `annualTonnesCo2e ${t3(EE.priceSaving({ ...S, emissionFactorKgCo2ePerGJ: null }).annualTonnesCo2e)}; carbonNote "${EE.priceSaving({ ...S, emissionFactorKgCo2ePerGJ: null }).carbonNote}"`);
  row('no basis declared', `basisNote "${EE.priceSaving(S).basisNote}"`);
  row('saving on LHV, factor on HHV', refused(EE.priceSaving({ ...S, energyBasis: 'LHV', emissionFactorBasis: 'HHV' }), 'basis'));
  row('saving blank', refused(EE.priceSaving({ ...S, energySavedGJ: '' }), 'saving blank'));
}

/* ------------------------------------------------------------------ */
section('ENERGY INTENSITY AND THE PEER');
{
  const E = F.AGBOR_ENERGY;
  const en = EE.energyIntensity({ energyStreams: E.streams, throughputTonnes: E.throughputTonnes, peerIntensityMJPerTonne: E.peerIntensityMJPerTonne });
  out(`Agbor's energy (invented): ${E.streams.map((s) => `${s.label} ${s.energyGJ} GJ`).join(', ')}; ${E.throughputTonnes} tonnes of throughput; a peer intensity of ${E.peerIntensityMJPerTonne} MJ a tonne that Agbor has the right to use (invented).`);
  out('');
  head('stream', 'GJ', 'share');
  en.streams.forEach((s) => row(s.label, gj(s.energyGJ), share(s.share)));
  out('');
  head('output', 'complete', 'total GJ', 'intensity MJ per tonne', 'versus peer', 'gap MJ per tonne');
  row('all three streams', yn(en.complete), gj(en.totalEnergyGJ), mjt(answered(en, 'intensityMJPerTonne', 'en')), frac(en.versusPeer), mjt(en.gapMJPerTonne));
  const miss = EE.energyIntensity({ energyStreams: E.streams.map((s) => (s.label === 'Purchased power' ? { ...s, energyGJ: '' } : s)), throughputTonnes: E.throughputTonnes, peerIntensityMJPerTonne: E.peerIntensityMJPerTonne });
  row('purchased power blank', yn(miss.complete), gj(miss.totalEnergyGJ), mjt(miss.intensityMJPerTonne), frac(miss.versusPeer), mjt(miss.gapMJPerTonne));
  out('');
  out(`peerNote with a stream missing, verbatim: "${miss.peerNote}"`);
  out(`The disclaimer, verbatim: "${en.disclaimer}"`);
  out(refused(EE.energyIntensity({ energyStreams: E.streams, throughputTonnes: '' }), 'no throughput'));
}

/* ------------------------------------------------------------------ */
section('WHAT IS HELD, AND THE MD5-0 RULES IN FORCE');
{
  out('HELD, taught as stated limits and never graded (FINDINGS-carbon):');
  head('item', 'the limit');
  row('H1', 'Which IPCC assessment report a Nigerian operator files on (AR5 or AR6) is a regulatory reading and the owner\'s decision. The engine ships no GWP; the course prints both reports (SECTION 6).');
  row('H2', `The engine's typical methane heating values are ${ref('CH4').typicalLhvMJKmol} LHV and ${ref('CH4').typicalHhvMJKmol} HHV MJ per kmol, a difference of ${(ref('CH4').typicalHhvMJKmol - ref('CH4').typicalLhvMJKmol).toFixed(1)} (computed here); two moles of water condensed at the engine's own latent heat is ${(2 * H2O_KG * EE.PROPERTY_REFERENCE.waterLatentHeatKJkg.typical / 1000).toFixed(3)} MJ (computed here: 2 x ${H2O_KG.toFixed(3)} kg, the engine's water molar mass read back from its moisture figure, x ${EE.PROPERTY_REFERENCE.waterLatentHeatKJkg.typical} kJ/kg). The pair is labelled typical and is not corrected without ISO 6976 in hand; the fuel analysis governs.`);
  row('H3', 'Every escaped carbon atom is counted as methane (SECTION 5).');
  row('H4', 'Combustion N2O is not computed by the atom balance; it needs an emission factor line (SECTION 3).');
  row('inputs', 'GWP values, emission factors and every price are inputs. Neither engine ships one.');
  out('');
  out('THE RULES MD5-0 PUT IN FORCE, each as the engine answers now, with a figure from this digest:');
  head('rule', 'where it prints');
  row('A blank or null destruction efficiency is refused; left out of the call it is complete combustion', 'SECTION 2');
  row('A line that errors, and a line off Scope 1 and Scope 2, is a blocked line with its reason', 'SECTION 9');
  row('A negative abatement, a blank capital cost, a blank rate with capital, and a rate outside (-1, 1) are refused; blank savings and running costs are 0 and named', 'SECTION 19');
  row('A curve with a claim above what its source emits returns meetsTarget none and says why', 'SECTION 21');
  row('A baseline that is not positive is refused, and a measure with no start year is named', 'SECTION 22');
  row('An intensity carries its inventory\'s reportable status', 'SECTION 10');
  row('The GWP set carries a methane note', 'SECTION 6');
  row('The cost per tonne of a saving is the levelised abatementCost, and needs a life and a rate', 'SECTION 23');
  row('A target oxygen is required and checked against the declared floor', 'SECTION 14');
  row('A trap needs a boiler efficiency for fuel and carbon, an isentropic exponent, and hours a year', 'SECTION 15');
  row('Only an interior zero of the cascade is a pinch', 'SECTION 17');
  row('A negative heat capacity flowrate is refused', 'SECTION 17');
  row('An intensity with a stream missing is not compared with the peer', 'SECTION 24');
  row('Air\'s argon is carried at ATMOSPHERIC_N2_MOLAR_MASS, and the flue gas mass balance closes', 'SECTION 11');
  row('A saving, its price and its factor declared on different heating value bases are refused', 'SECTION 23');
}

/* ------------------------------------------------------------------ */
section('WHAT THE ORACLES CHECK');
{
  out('Two independent oracles in the engines repository (tools/validation/downstream) recompute these modules by other routes, and their goldens are asserted by the engine test suites:');
  head('oracle', 'what it computes, and by which route');
  row('oracle_carbonabatement.py', 'combustion by MASS in exact rationals (kg of carbon times the CO2/C and CH4/C mass ratios, molar masses built from atomic weights); the inventory as a ledger; the cost per tonne LEVELISED from a year-by-year present value ledger where the engine uses a capital recovery factor; the curve by explicit rank; the path as a year ledger');
  row('oracle_energyefficiency.py', 'combustion as a species ledger whose mass balance must close; excess air by BISECTION where the engine solves a closed form; efficiency as a loss ledger; the tuning saving as a duty ledger; the steam trap as an ISENTROPIC NOZZLE where the engine uses the choked-flux formula; the pinch by the LARGEST HEAT DEFICIT with no cascade; a levelised cost per tonne');
  out('');
  out('Not recomputed by either oracle: carbonIntensity, the curve\'s residual to target and paysForItselfTonnes, compositeCurve and the simple payback. They are taught from the engine and never graded.');
  out('');
  out(`This digest: ${answeredCount} engine answers asserted and ${refusedCount} refusals asserted before printing.`);
}

// MD_PLANT_TZ is the reproducibility gate's negative control: one line that
// reads the zone, so the gate can show it would see a zone-dependent figure.
if (process.env.MD_PLANT_TZ) out(`planted: ${new Date(2026, 0, 1).toISOString()}`);

process.stdout.write(`${L.join('\n')}\n`);
