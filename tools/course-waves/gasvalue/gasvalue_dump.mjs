// THE GASVALUE TEACHING DIGEST GENERATOR. Every figure, basis word and refusal
// in digest.txt is printed by this file straight out of the vendored engines
// (engines/downstream/flareToValue.js and engines/downstream/lpgCng.js, with
// modularRefinery.js for the capital power law they share) called on the
// teaching cases in gasvalue_fields.mjs. Nothing is typed: a computed figure is
// the engine's return formatted to the place the engine reports it, an input is
// printed as the case file types it, and a refusal is the engine's own sentence.
//
// THREE GUARDS BUILT INTO THE GENERATOR, so a digest that breaks one of them
// cannot be written at all:
//
//   THE VERDICT LABELS. refused() asserts the engine refused (an error string)
//   and prints its own sentence; a row cannot be labelled a refusal when the
//   engine answered.
//
//   THE CLAIM ASSERTIONS. Wherever a sentence characterises figures ("passes
//   through", "the same", "larger", "conserved", "refused"), the generator
//   asserts that the engine's figures say so before it prints the sentence, and
//   throws otherwise. A relationship between two figures is printed only as a
//   third computed figure (a "minus" or "over" column).
//
//   THE SECTION OWNERS. Each section's owning tier and module comes from ONE
//   table, SECTION_OWNERS, checked against structure.py's module keys at build
//   time, never typed into a heading.
//
// THE CLOCK. Neither engine file in scope reads a clock (no Date, no
// performance, no random), and gate_clock.sh proves the digest does not move
// when the machine clock does. There is no as-of date in this course.
//
// Usage: node gasvalue_dump.mjs   (build_digest.sh pins TZ)
import fs from 'fs';
import * as T from './gasvalue_fields.mjs';

const HERE = new URL('.', import.meta.url).pathname;
const ROOT = process.env.ET_ENGINES || '/root/wt-et-gasvalue-nextgen/packages/engines';
const F = await import(`${ROOT}/engines/downstream/flareToValue.js`);
const L = await import(`${ROOT}/engines/downstream/lpgCng.js`);
const MR = await import(`${ROOT}/engines/downstream/modularRefinery.js`);

/* ------------------------------------------------------------------ *
 * Output, verdicts and formatting.
 * ------------------------------------------------------------------ */
const Lines = [];
const out = (s = '') => Lines.push(s);
/** A computed figure, to dp decimals (4 unless the engine reports it coarser), a negative zero printed as zero. */
const fx = (v, dp = 4) => {
  if (typeof v !== 'number' || !Number.isFinite(v)) throw new Error(`fx: ${v} is not a finite number`);
  const s = v.toFixed(dp);
  return /^-0\.?0*$/.test(s) ? s.slice(1) : s;
};
const t3 = (v) => fx(v, 3); // tonnes and kilograms the engine rounds to three
const d2 = (v) => fx(v, 2); // money the engine rounds to two
/** A figure the engine may decline to give: its own absence word, never a number. */
const fxOr = (v, word, dp = 4) => (v === null || v === undefined ? word : fx(v, dp));
/** An input, as the case file types it. */
const inp = (v) => (v === null ? 'blank (null)' : v === '' ? "blank ('')" : v === undefined ? 'omitted' : String(v));
let refusedCount = 0;
const refused = (r, where) => {
  const msg = r && r.error;
  if (!msg) throw new Error(`VERDICT LABEL: ${where} was expected to be REFUSED with a sentence, and the engine said ${JSON.stringify(r)}`);
  refusedCount += 1;
  return `REFUSED: ${msg}`;
};
const must = (r, where) => { if (!r || r.error) throw new Error(`${where}: the engine refused: ${r && r.error}`); return r; };
const claim = (cond, what) => { if (!cond) throw new Error(`CLAIM: ${what} is false on the engine's own output`); };
const row = (...cells) => out(`| ${cells.join(' | ')} |`);
const head = (...cells) => { row(...cells); row(...cells.map(() => '---')); };
const yesNo = (b) => (b === true ? 'true' : b === false ? 'false' : 'no verdict');
const list = (a) => (a && a.length ? a.join('; ') : 'none');

/* ------------------------------------------------------------------ *
 * THE SECTION OWNERS, one table, checked against structure.py.
 * ------------------------------------------------------------------ */
const SECTION_OWNERS = {
  1: [['beginner', 'm01']], 2: [['beginner', 'm01']], 3: [['beginner', 'm01']], 4: [['beginner', 'm01']],
  5: [['beginner', 'm02']], 6: [['beginner', 'm02']],
  7: [['beginner', 'm03']], 8: [['beginner', 'm03']], 9: [['beginner', 'm03']],
  10: [['beginner', 'm04']], 11: [['beginner', 'm04']],
  12: [['beginner', 'm05']], 13: [['beginner', 'm05']], 14: [['beginner', 'm05']],
  15: [['beginner', 'm06']],
  16: [['intermediate', 'm01']], 17: [['intermediate', 'm01']],
  18: [['intermediate', 'm02']],
  19: [['intermediate', 'm03']], 20: [['intermediate', 'm03']],
  21: [['intermediate', 'm04']],
  22: [['intermediate', 'm05']], 23: [['intermediate', 'm05']],
  24: [['intermediate', 'm06']],
  25: [['advanced', 'm01']], 26: [['advanced', 'm01']],
  27: [['advanced', 'm02']], 28: [['advanced', 'm02']], 29: [['advanced', 'm02'], ['advanced', 'm05']],
  30: [['advanced', 'm03']],
  31: [['advanced', 'm04']], 32: [['advanced', 'm04']], 33: [['advanced', 'm04']],
  34: [['advanced', 'm05']],
  35: [['advanced', 'm06']], 36: [['advanced', 'm06']],
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
const fnLabel = (names) => { out(`function: ${names}`); out(''); };
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
 * Case helpers: gases from the engine's own reference table.
 * ------------------------------------------------------------------ */
const REF = Object.fromEntries(F.GAS_COMPONENT_REFERENCE.map((r) => [r.code, r]));
const comps = (rows) => rows.map(([code, moleFraction]) => {
  const r = REF[code];
  return {
    code, moleFraction, c: r.c, molarMassLbLbmol: r.molarMassLbLbmol, ghvBtuScf: r.typicalGhvBtuScf,
    liquidDensityLbGal: r.liquidDensityLbGal, recoverableAsNgl: r.recoverableAsNgl, inert: !!r.inert,
  };
});
const gasOf = (rows, where) => must(F.characteriseGas({ components: comps(rows) }), where);
const rowsText = (rows) => rows.map(([c, y]) => `${c} ${inp(y)}`).join(', ');
const template = (id) => F.ROUTE_TEMPLATES.find((t) => t.id === id);
const withLimits = (id, limits) => {
  const t = template(id);
  return { ...t, requirements: t.requirements.map((q) => ({ ...q, limit: limits && limits[q.key] !== undefined ? limits[q.key] : null })) };
};
/**
 * The molar masses the flare is weighed at are not exported, so the engine is
 * asked about itself: a gas that is all CO2 flared (its CO2 passes through), or
 * all methane flared with next to no destruction, gives back the molar mass.
 */
const flareMolarMass = (code) => {
  const probe = gasOf([[code, 1]], `pure ${code}`);
  const r = must(F.abatement({ gas: probe, volumeMMscfd: 1000, onstreamDays: 1, flareDestructionEfficiency: code === 'CO2' ? 1 : 1e-9, gwpMethane: 1 }), 'molar mass probe');
  const lbmol = (1000 * 1e6) / F.SCF_PER_LBMOL;
  const t = code === 'CO2' ? r.flareCo2Tonnes : r.flareCh4Tonnes / (1 - 1e-9);
  return (t * 1000 * F.LB_PER_KG) / lbmol;
};

/* ================================================================== */
out('# gasvalue: Flare Gas to Value & LPG/CNG. Teaching digest.');
out('# PRECISION: every computed figure prints to four decimals (Btu/scf, gal/Mscf, kg/Mscf, mole fractions, carbon per mole, lb/lbmol, t/Mscf, MWh/Mscf, dollars per Mscf, dollars per tonne, kg of product a year, tonnes of LPG, m3, days, kg/m3, kJ/kg, kg/kmol, kW, minutes, erlangs, Z, reduced pressure and temperature, kg in a vessel, bar, kg per fill, naira, litres, kg of fuel, years, shares and ratios) except where the engine itself reports a quantity coarser: tonnes of CO2, methane and CO2e a year and kilograms stored, delivered and left in a cascade to three decimals; revenue, operating cost, margin, capital and cash flows in dollars to two. Every input prints exactly as it is typed, in gasvalue_fields.mjs for a case or beside the question in gasvalue_dump.mjs for a probe. Counts print as whole numbers.');
out('# ENGINES: engines/downstream/flareToValue.js and engines/downstream/lpgCng.js at petrolord-engines df31f53 (MD45-1, after MD4-0), with modularRefinery.js for the capital power law, vendored in NextGen under packages/engines.');
out('# CASES: EGBEMA (a flow station in Imo State flaring associated gas, and the four ways to sell it), KANO (an LPG storage and bottling plant), IBAFO (a CNG mother station on the Lagos-Ibadan expressway and a Lagos bus operator switching to CNG), and beside them the two live apps\' own opening examples. EVERY ANALYSIS, EFFICIENCY, GWP, PRICE, COST, FILL LIMIT AND VEHICLE FIGURE IN THIS DIGEST IS INVENTED AND ILLUSTRATIVE: no figure is a published analysis, a measured flare, a market price or a regulation. Place names are real places; the records are not. The component heating values, liquid densities and LPG properties are the engine\'s own labelled typical tables.');
out('# NO CLOCK: nothing in scope reads a date or a clock, and the digest is the same bytes in every time zone and at every machine date.');
out('# Built by build_digest.sh from gasvalue_dump.mjs and gasvalue_fields.mjs. Never edited by hand.');

/* ------------------------------------------------------------------ */
section('WHAT THE TWO MODULES EXPORT');
fnLabel('every export of flareToValue and lpgCng, counted');
out('The Flare Gas to Value Studio calls flareToValue. The LPG & CNG Rollout Studio calls lpgCng, which calls the loading-rack queue in terminalDepot for its carousel and forecourt, the gas Z factor in production/gasProperties and the compressor train in facilities/compression, and writes none of the three itself. flareToValue scales capital with the power law in modularRefinery. The counts below are measured from the modules themselves.');
out('');
head('module', 'exported functions', 'exported constants and tables');
for (const [name, mod] of [['flareToValue', F], ['lpgCng', L]]) {
  const fns = Object.entries(mod).filter(([, v]) => typeof v === 'function').map(([k]) => k);
  const other = Object.entries(mod).filter(([, v]) => typeof v !== 'function').map(([k]) => k);
  row(name, `${fns.length} (${fns.join(', ')})`, `${other.length} (${other.join(', ')})`);
}
out('');
out('The questions the two studios answer, each with the function that answers it:');
head('question', 'function');
row('what is in this gas, and how much liquid could it give', 'characteriseGas');
row('which way of selling it does the gas allow', 'screenRoute against a route\'s requirement envelope');
row('what does a route make, earn and cost in a year', 'routeEconomics');
row('what does the flare emit, and what does recovering it abate', 'abatement');
row('does the project need carbon credits to clear its hurdle', 'creditSensitivity');
row('how do the routes compare in a bid', 'compareRoutes');
row('how much LPG can the vessel hold, and when to reorder', 'lpgBlendProperties, lpgStorageSizing');
row('how big a vaporizer, how many carousel positions, how many cylinders', 'vaporizerDuty, bottlingPlant, assetFloat');
row('how much gas is in a bank, and how many vehicles does a cascade fill', 'gasMassInVessel, cascadeFills');
row('what does the station compressor and forecourt need', 'cngCompression, cngDispensing');
row('does the customer save by switching fuel', 'conversionEconomics');

/* ------------------------------------------------------------------ */
section('A STANDARD CUBIC FOOT IS A COUNT OF MOLES');
fnLabel('flareToValue constants and lpgCng constants; characteriseGas');
out('A standard cubic foot counts gas at 60 F and 14.696 psia, so a volume of gas is a number of moles. The engine\'s unit constants, printed from the module:');
out('');
head('constant', 'value', 'what it is');
row('SCF_PER_LBMOL', inp(F.SCF_PER_LBMOL), 'standard cubic feet in one lb-mol');
row('LB_PER_KG', inp(F.LB_PER_KG), 'pounds in one kilogram');
row('GAL_PER_FT3', inp(F.GAL_PER_FT3), 'US gallons in one cubic foot');
row('BTU_PER_MWH', fx(F.BTU_PER_MWH), 'International Table Btu in one megawatt hour');
row('M3_PER_SCF (lpgCng)', inp(L.M3_PER_SCF), 'cubic metres in one standard cubic foot');
row('KJ_PER_KWH (lpgCng)', inp(L.KJ_PER_KWH), 'kilojoules in one kilowatt hour');
row('PSI_PER_BAR (lpgCng)', inp(L.PSI_PER_BAR), 'psi in one bar');
out('');
out('Asked about one Mscf of each pure component, characteriseGas gives the mass a thousand standard cubic feet carry. Every row is the same count of moles, so the mass follows the molar mass:');
head('pure component', 'molar mass lb/lbmol (reference)', 'kgPerMscf');
const perMw = [];
for (const code of ['C1', 'C2', 'C3', 'N2', 'CO2']) {
  const g = gasOf([[code, 1]], `pure ${code}`);
  perMw.push(g.kgPerMscf / REF[code].molarMassLbLbmol);
  row(REF[code].label, inp(REF[code].molarMassLbLbmol), fx(g.kgPerMscf));
}
claim(perMw.every((x) => Math.abs(x - perMw[0]) < 1e-7), 'the mass per Mscf over the molar mass is the same for every component');
out('');
out('kgPerMscf is built from two of those constants: the lb-mol in one Mscf is 1000 over SCF_PER_LBMOL, the pounds are that times the mole-weighted molar mass, and the kilograms are the pounds over LB_PER_KG. The same arithmetic done here on the engine\'s constants, beside the engine:');
head('pure component', '1000 / SCF_PER_LBMOL x molar mass / LB_PER_KG', 'kgPerMscf (engine)', 'difference');
for (const code of ['C1', 'CO2']) {
  const g = gasOf([[code, 1]], `pure ${code}`);
  const byHand = (1000 / F.SCF_PER_LBMOL) * REF[code].molarMassLbLbmol / F.LB_PER_KG;
  claim(Math.abs(byHand - g.kgPerMscf) < 1e-7, `${code}: kgPerMscf is built from SCF_PER_LBMOL and LB_PER_KG`);
  row(REF[code].label, fx(byHand), fx(g.kgPerMscf), fx(byHand - g.kgPerMscf));
}

/* ------------------------------------------------------------------ */
section('THE COMPONENT REFERENCE TABLE');
fnLabel('flareToValue.GAS_COMPONENT_REFERENCE, GAS_REFERENCE_NOTE');
out('GAS_COMPONENT_REFERENCE, as the engine exports it. The studio fills a gas analysis from these rows; the analysis carries the figures and the engine reads what it is given.');
out('');
head('code', 'label', 'carbon per molecule', 'molar mass lb/lbmol', 'typical heating value Btu/scf', 'liquid density lb/gal', 'recoverable as NGL', 'inert');
for (const r of F.GAS_COMPONENT_REFERENCE) {
  row(r.code, r.label, inp(r.c), inp(r.molarMassLbLbmol), inp(r.typicalGhvBtuScf), r.liquidDensityLbGal === null ? 'none' : inp(r.liquidDensityLbGal), yesNo(r.recoverableAsNgl), yesNo(!!r.inert));
}
out('');
out(`The engine's note on the table: "${F.GAS_REFERENCE_NOTE}"`);
out('');
out('The CO2 row carries one carbon per molecule and is marked inert: its carbon is counted when the carbon per mole is counted, and it is not a fuel.');

/* ------------------------------------------------------------------ */
section('AN ANALYSIS THAT DOES NOT SUM TO ONE');
fnLabel('flareToValue.characteriseGas');
const eg = gasOf(T.EGBEMA_GAS, 'EGBEMA gas');
const es = gasOf(T.EGBEMA_SHORT_GAS, 'EGBEMA short gas');
claim(T.EGBEMA_SHORT_GAS.map(([c, y], i) => (y < T.EGBEMA_GAS[i][1] ? c : '')).filter(Boolean).join(',') === 'C1,C2,C3', 'the short sheet types methane, ethane and propane short and nothing else');
out(`EGBEMA's laboratory sheet, typed in full: ${rowsText(T.EGBEMA_GAS)}. The same sheet typed short, with less methane, ethane and propane: ${rowsText(T.EGBEMA_SHORT_GAS)}.`);
out('');
head('sheet', 'rawMoleFractionSum', 'normalisationNote');
row('EGBEMA in full', fx(eg.rawMoleFractionSum), eg.normalisationNote === null ? 'none' : eg.normalisationNote);
row('EGBEMA typed short', fx(es.rawMoleFractionSum), es.normalisationNote === null ? 'none' : es.normalisationNote);
claim(eg.normalisationNote === null && es.normalisationNote !== null, 'only the short sheet is scaled with a note');
out('');
out('The engine scales a sheet to one and says so. The scaled fractions it works with:');
head('code', 'typed (short sheet)', 'normalised (short sheet)', 'typed (full sheet)', 'normalised (full sheet)');
T.EGBEMA_SHORT_GAS.forEach(([code, y], i) => {
  row(code, inp(y), fx(es.normalised[i].moleFraction), inp(T.EGBEMA_GAS[i][1]), fx(eg.normalised[i].moleFraction));
});

/* ------------------------------------------------------------------ */
section('THE GAS BY THE MOLE: HEATING VALUE, INERTS, CARBON AND MASS');
fnLabel('flareToValue.characteriseGas');
const lean = gasOf(T.OGUTA_LEAN_GAS, 'OGUTA lean gas');
const suiteGas = gasOf(T.SUITE_FLARE.gas, 'studio default gas');
out('Every property below is a mole-weighted sum over the normalised analysis: the heating value is the mole-weighted heating value, the carbon per mole counts every carbon atom (the CO2\'s included), the hydrocarbon carbon per mole counts only the carbon that can burn, and the mass in one Mscf is the moles in a thousand standard cubic feet times the molar mass.');
out(`EGBEMA is the associated gas above. OGUTA is a lean non-associated gas beside it: ${rowsText(T.OGUTA_LEAN_GAS)}. The studio's opening gas: ${rowsText(T.SUITE_FLARE.gas)}.`);
out('');
head('gas', 'ghvBtuScf', 'inertMoleFraction', 'co2MoleFraction', 'methaneMoleFraction', 'carbonPerMol', 'hydrocarbonCarbonPerMol', 'molarMassLbLbmol', 'kgPerMscf');
for (const [name, g] of [['EGBEMA', eg], ['OGUTA', lean], ['studio opening gas', suiteGas]]) {
  row(name, fx(g.ghvBtuScf), fx(g.inertMoleFraction), fx(g.co2MoleFraction), fx(g.methaneMoleFraction), fx(g.carbonPerMol), fx(g.hydrocarbonCarbonPerMol), fx(g.molarMassLbLbmol), fx(g.kgPerMscf));
  claim(Math.abs(g.carbonPerMol - g.hydrocarbonCarbonPerMol - g.co2MoleFraction) < 1e-7, `${name}: the carbon per mole is the hydrocarbon carbon plus the CO2`);
}
out('');
out('In every row, carbonPerMol minus hydrocarbonCarbonPerMol is the CO2 mole fraction: the only carbon that cannot burn is the carbon already in CO2.');
out('');
out('inertMoleFraction is the sum of the normalised fractions of the components the reference marks inert, nitrogen and CO2:');
head('gas', 'N2 (normalised)', 'CO2 (normalised)', 'N2 plus CO2', 'inertMoleFraction (engine)');
for (const [name, g] of [['EGBEMA', eg], ['OGUTA', lean], ['studio opening gas', suiteGas]]) {
  const y = (code) => (g.normalised.find((r) => r.code === code) || { moleFraction: 0 }).moleFraction;
  claim(Math.abs(y('N2') + y('CO2') - g.inertMoleFraction) < 1e-7, `${name}: the inerts are N2 plus CO2`);
  row(name, fx(y('N2')), fx(y('CO2')), fx(y('N2') + y('CO2')), fx(g.inertMoleFraction));
}
out('');
out('The heating value is blended on moles. Two shortcuts beside it on EGBEMA, each computed from the same reference table:');
const egMass = (() => { const m = T.EGBEMA_GAS.map(([c, y]) => y * REF[c].molarMassLbLbmol); const t = m.reduce((s, x) => s + x, 0); return m.map((x) => x / t); })();
const onMass = T.EGBEMA_GAS.reduce((s, [c], i) => s + egMass[i] * REF[c].typicalGhvBtuScf, 0);
const hcOnly = gasOf(T.EGBEMA_GAS.filter(([c]) => !REF[c].inert), 'EGBEMA hydrocarbons only');
head('heating value, Btu/scf', 'value', 'minus the engine\'s');
row('the engine, on moles', fx(eg.ghvBtuScf), fx(0));
row('the same heating values weighted by mass', fx(onMass), fx(onMass - eg.ghvBtuScf));
row('the engine asked about the hydrocarbons alone (inerts left out and the rest scaled to one)', fx(hcOnly.ghvBtuScf), fx(hcOnly.ghvBtuScf - eg.ghvBtuScf));
claim(onMass > eg.ghvBtuScf && hcOnly.ghvBtuScf > eg.ghvBtuScf, 'both shortcuts read higher than the engine');
out('');
out('Both shortcuts read higher than the engine on this gas.');

/* ------------------------------------------------------------------ */
section('A CARBON NUMBER IS NEVER ASSUMED, AND WHAT THE ANALYSIS REFUSES');
fnLabel('flareToValue.characteriseGas');
const typedC3 = comps([['C1', 0.9], ['C3', 0.1]]);
const noC = typedC3.map((c) => (c.code === 'C3' ? { ...c, c: null } : c));
const gTyped = must(F.characteriseGas({ components: typedC3 }), 'typed carbon');
const gNoC = must(F.characteriseGas({ components: noC }), 'carbon from reference');
out('A hydrocarbon typed without a carbon number takes it from the reference by its code. Probe: methane 0.9 and propane 0.1, once with propane\'s carbon number typed (3) and once with it left blank (null).');
head('probe', 'carbonPerMol', 'hydrocarbonCarbonPerMol');
row('propane carbon number typed', fx(gTyped.carbonPerMol), fx(gTyped.hydrocarbonCarbonPerMol));
row('propane carbon number left blank', fx(gNoC.carbonPerMol), fx(gNoC.hydrocarbonCarbonPerMol));
claim(gTyped.carbonPerMol === gNoC.carbonPerMol, 'the blank carbon number is read from the reference');
out('');
out('What characteriseGas refuses, in its own words:');
head('probe', 'engine');
const unknown = [...comps([['C1', 0.9]]), { code: 'XX', moleFraction: 0.1, c: null, molarMassLbLbmol: 30 }];
row('an unknown code (XX) with no carbon number', refused(F.characteriseGas({ components: unknown }), 'unknown code'));
row('a negative mole fraction (methane 1.1, ethane -0.1)', refused(F.characteriseGas({ components: comps([['C1', 1.1], ['C2', -0.1]]) }), 'negative'));
row('a blank mole fraction (methane typed as \'\')', refused(F.characteriseGas({ components: comps([['C1', '']]) }), 'blank'));
row('every mole fraction zero', refused(F.characteriseGas({ components: comps([['C1', 0], ['C2', 0]]) }), 'zero'));

/* ------------------------------------------------------------------ */
section('THE LIQUIDS IN THE GAS');
fnLabel('flareToValue.characteriseGas, RICHNESS_GPM');
out('gpmC2Plus and gpmC3Plus are gallons of liquid per thousand standard cubic feet, derived from the composition: the moles in a thousand standard cubic feet, times each component\'s mole fraction and molar mass, over its liquid density, summed over the recoverable components. The engine\'s basis sentence:');
out(`"${eg.gpmBasis}"`);
out('');
head('gas', 'gpmC2Plus (ethane and heavier)', 'gpmC3Plus (propane and heavier)', 'gpmC2Plus minus gpmC3Plus (the ethane)', 'richness');
for (const [name, g] of [['EGBEMA', eg], ['OGUTA', lean], ['studio opening gas', suiteGas]]) {
  row(name, fx(g.gpmC2Plus), fx(g.gpmC3Plus), fx(g.gpmC2Plus - g.gpmC3Plus), g.richness);
}
out('');
out('The rows each cut sums, and each row\'s gallons, for EGBEMA: gpmC2Plus sums ethane to pentanes plus, gpmC3Plus propane to pentanes plus, each row the moles in one Mscf (1000 over SCF_PER_LBMOL) times its normalised fraction and molar mass over its liquid density.');
head('component', 'recoverable as NGL', 'in gpmC2Plus', 'in gpmC3Plus', 'gal/Mscf');
let c2Sum = 0; let c3Sum = 0;
for (const r of eg.normalised) {
  const ref = REF[r.code];
  const inC2 = ['C2', 'C3', 'IC4', 'NC4', 'C5'].includes(r.code);
  const inC3 = ['C3', 'IC4', 'NC4', 'C5'].includes(r.code);
  const gal = ref.recoverableAsNgl ? ((1000 / F.SCF_PER_LBMOL) * r.moleFraction * ref.molarMassLbLbmol) / ref.liquidDensityLbGal : null;
  if (inC2) c2Sum += gal; if (inC3) c3Sum += gal;
  row(r.code, yesNo(ref.recoverableAsNgl), yesNo(inC2), yesNo(inC3), gal === null ? 'none' : fx(gal));
}
claim(Math.abs(c2Sum - eg.gpmC2Plus) < 1e-5 && Math.abs(c3Sum - eg.gpmC3Plus) < 1e-5, 'the rows sum to the engine\'s gpm');
row('sum', '', '', '', `${fx(c2Sum)} (gpmC2Plus), ${fx(c3Sum)} (gpmC3Plus)`);
out('');
// The richness edges are the engine's export RICHNESS_GPM. A methane and
// propane probe either side of each edge confirms the words before printing.
const leanEdge = F.RICHNESS_GPM.moderate;
const richEdge = F.RICHNESS_GPM.rich;
// In a methane and propane mix gpmC3Plus is proportional to the propane
// fraction, so the fraction for a target gpm is the target over the gpm of
// pure propane; the probe sits a ten-thousandth either side of each edge.
const gpmPropane = gasOf([['C3', 1]], 'pure propane').gpmC3Plus;
const probeAt = (edgeGpm) => [1 - 1e-4, 1 + 1e-4].map((k) => {
  const x = (edgeGpm * k) / gpmPropane;
  return gasOf([['C1', 1 - x], ['C3', x]], 'richness probe').richness;
});
claim(probeAt(leanEdge).join() === 'lean,moderate' && probeAt(richEdge).join() === 'moderate,rich', 'the words change at the exported edges');
out('The richness word is read off gpmC3Plus against the lower edges the engine exports as RICHNESS_GPM (a screening word; a route\'s own liquids limit governs):');
head('word changes', 'gpmC3Plus where it changes');
row('lean to moderate', fx(leanEdge));
row('moderate to rich', fx(richEdge));
out('');
out('A gas at or above the lower edge reads moderate; at or above the upper edge it reads rich.');

/* ------------------------------------------------------------------ */
section('A MISSING DENSITY IS A MISSING ANSWER');
fnLabel('flareToValue.characteriseGas');
const noDens = comps(T.EGBEMA_GAS).map((c) => (c.code === 'C3' ? { ...c, liquidDensityLbGal: null } : c));
const noGhv = comps(T.EGBEMA_GAS).map((c) => (c.code === 'NC4' ? { ...c, ghvBtuScf: null } : c));
const gNoDens = must(F.characteriseGas({ components: noDens }), 'no density');
const gNoGhv = must(F.characteriseGas({ components: noGhv }), 'no heating value');
out('EGBEMA\'s analysis with propane\'s liquid density left blank, and again with n-butane\'s heating value left blank:');
head('probe', 'gpmC2Plus', 'gpmC3Plus', 'richness', 'missingLiquidDensity', 'ghvBtuScf', 'ghvNote');
row('EGBEMA as typed', fxOr(eg.gpmC2Plus, 'null'), fxOr(eg.gpmC3Plus, 'null'), eg.richness, list(eg.missingLiquidDensity), fxOr(eg.ghvBtuScf, 'null'), eg.ghvNote === null ? 'none' : eg.ghvNote);
row('propane density blank', fxOr(gNoDens.gpmC2Plus, 'null'), fxOr(gNoDens.gpmC3Plus, 'null'), gNoDens.richness === null ? 'null' : gNoDens.richness, list(gNoDens.missingLiquidDensity), fxOr(gNoDens.ghvBtuScf, 'null'), gNoDens.ghvNote === null ? 'none' : gNoDens.ghvNote);
row('n-butane heating value blank', fxOr(gNoGhv.gpmC2Plus, 'null'), fxOr(gNoGhv.gpmC3Plus, 'null'), gNoGhv.richness, list(gNoGhv.missingLiquidDensity), fxOr(gNoGhv.ghvBtuScf, 'null'), gNoGhv.ghvNote === null ? 'none' : gNoGhv.ghvNote);
claim(gNoDens.gpmC3Plus === null && gNoDens.richness === null && gNoGhv.ghvBtuScf === null, 'a missing figure makes the answer missing');
out('');
out('A blank density leaves the liquids content and the richness word missing (null); a blank heating value leaves the mixture\'s heating value missing. Neither is a partial sum.');

/* ------------------------------------------------------------------ */
section('THE MASS CEILING ON LIQUIDS');
fnLabel('flareToValue.characteriseGas');
out('kgPerMscf is the mass of one Mscf of the gas; c3PlusKgPerMscf is the part of it that is propane and heavier. They are the most any route can take out of a thousand standard cubic feet, by mass.');
out('');
head('gas', 'kgPerMscf', 'c3PlusKgPerMscf', 'c3PlusKgPerMscf over kgPerMscf');
for (const [name, g] of [['EGBEMA', eg], ['OGUTA', lean], ['studio opening gas', suiteGas]]) {
  row(name, fx(g.kgPerMscf), fx(g.c3PlusKgPerMscf), fx(g.c3PlusKgPerMscf / g.kgPerMscf));
}
out('');
claim(gNoDens.c3PlusKgPerMscf === eg.c3PlusKgPerMscf && gNoDens.kgPerMscf === eg.kgPerMscf, 'the mass ceiling reads no liquid density');
out(`The mass ceiling reads no liquid density. With propane's liquid density left blank (SECTION 8), EGBEMA's c3PlusKgPerMscf is still ${fx(gNoDens.c3PlusKgPerMscf)} and its kgPerMscf ${fx(gNoDens.kgPerMscf)}.`);

/* ------------------------------------------------------------------ */
section('THE FLARE BY 40 CFR 98.233(n)');
fnLabel('flareToValue.abatement, FLARE_MOLAR_MASS');
const P = T.EGBEMA_PARCEL;
const efl = must(F.abatement({ gas: eg, ...P }), 'EGBEMA flare');
const mwCo2 = F.FLARE_MOLAR_MASS.CO2;
const mwCh4 = F.FLARE_MOLAR_MASS.CH4;
claim(Math.abs(flareMolarMass('CO2') - mwCo2) < 1e-6 && Math.abs(flareMolarMass('C1') - mwCh4) < 1e-6, 'an all-CO2 and an all-methane flare give back the exported molar masses');
out(`EGBEMA flares ${inp(P.volumeMMscfd)} MMscfd on ${inp(P.onstreamDays)} days a year. The flare study gives a destruction efficiency of ${inp(P.flareDestructionEfficiency)} and a combustion efficiency of ${inp(P.flareCombustionEfficiency)}, and the study uses a methane GWP of ${inp(P.gwpMethane)}.`);
out('');
out(`The engine's basis sentence: "${efl.basis}"`);
out('');
out('The molar masses the flare\'s tonnes are weighed at, as the engine exports them in FLARE_MOLAR_MASS (an all-CO2 flare and an all-methane flare give the same figures back). The reference table carries CO2 at its tabulated molar mass for the gas\'s mass and liquids (SECTION 3); the flare\'s tonnes use these:');
head('species', 'molar mass kg/kmol the flare uses');
row('CO2', fx(mwCo2, 3));
row('methane', fx(mwCh4, 3));
out('');
head('EGBEMA flare', 'value');
row('scfPerYear', inp(efl.scfPerYear));
row('flareCo2Tonnes (t/yr)', t3(efl.flareCo2Tonnes));
row('flareCh4Tonnes (t/yr)', t3(efl.flareCh4Tonnes));
row('flareCo2eTonnes (t/yr)', t3(efl.flareCo2eTonnes));
row('methaneShareOfFlareCo2e', fx(efl.methaneShareOfFlareCo2e));
claim(Math.abs(efl.flareCh4Tonnes * P.gwpMethane / efl.flareCo2eTonnes - efl.methaneShareOfFlareCo2e) < 1e-5, 'the methane share is methane x GWP over CO2e');
row('destructionEfficiency', inp(efl.destructionEfficiency));
row('combustionEfficiency', inp(efl.combustionEfficiency));
out('');
out('methaneShareOfFlareCo2e is flareCh4Tonnes times the GWP over flareCo2eTonnes.');
out('');
out('THE CO2 IN THE GAS PASSES THROUGH. Two probes at EGBEMA\'s volume and days: a gas that is all CO2, and a gas that is all methane, each flared at EGBEMA\'s efficiencies.');
const pureCo2 = must(F.abatement({ gas: gasOf([['CO2', 1]], 'pure CO2'), ...P }), 'pure CO2 flare');
const pureCo2Low = must(F.abatement({ gas: gasOf([['CO2', 1]], 'pure CO2'), ...P, flareDestructionEfficiency: 0.5, flareCombustionEfficiency: 0.5 }), 'pure CO2 flare low');
const pureCh4 = must(F.abatement({ gas: gasOf([['C1', 1]], 'pure methane'), ...P }), 'pure methane flare');
head('probe', 'flareCo2Tonnes', 'flareCh4Tonnes');
row('all CO2, EGBEMA efficiencies', t3(pureCo2.flareCo2Tonnes), t3(pureCo2.flareCh4Tonnes));
row('all CO2, both efficiencies 0.5', t3(pureCo2Low.flareCo2Tonnes), t3(pureCo2Low.flareCh4Tonnes));
row('all methane, EGBEMA efficiencies', t3(pureCh4.flareCo2Tonnes), t3(pureCh4.flareCh4Tonnes));
claim(pureCo2.flareCo2Tonnes === pureCo2Low.flareCo2Tonnes && pureCo2.flareCh4Tonnes === 0, 'the CO2 in the gas leaves as CO2 whatever the efficiency, and carries no methane');
out('');
out('The CO2 already in the gas leaves the flare as CO2 at every efficiency, and none of it is methane.');
out('');
out('METHANE FROM THE METHANE. The methane that escapes is the methane in the gas times one less the destruction efficiency. Unburned ethane and heavier are not methane and carry no GWP here. Beside the engine, the figure a flare gives if every unburned carbon atom is counted as methane, computed here as the lb-mol a year (scfPerYear over SCF_PER_LBMOL) times carbonPerMol (every carbon atom, the CO2\'s included) times one less the destruction efficiency, weighed at FLARE_MOLAR_MASS.CH4 and converted with LB_PER_KG:');
const lbmolYr = efl.scfPerYear / F.SCF_PER_LBMOL;
const allCarbonCh4 = (lbmolYr * eg.carbonPerMol * (1 - P.flareDestructionEfficiency) * mwCh4) / F.LB_PER_KG / 1000;
head('methane, t/yr', 'value', 'over the engine\'s');
row('the engine (methane in the gas)', t3(efl.flareCh4Tonnes), fx(1));
row('every unburned carbon counted as methane', t3(allCarbonCh4), fx(allCarbonCh4 / efl.flareCh4Tonnes));

/* ------------------------------------------------------------------ */
section('DESTRUCTION AND COMBUSTION EFFICIENCY');
fnLabel('flareToValue.abatement');
out('The rule separates two efficiencies. The DESTRUCTION efficiency is the share of hydrocarbon destroyed and sets the methane. The COMBUSTION efficiency is the share oxidised to CO2 and sets the CO2. A combustion efficiency cannot exceed the destruction efficiency. Left out, the destruction efficiency stands in for it, and the engine says so.');
const standIn = must(F.abatement({ gas: eg, ...P, flareCombustionEfficiency: null }), 'stand-in');
out('');
head('EGBEMA', 'combustion efficiency used', 'flareCo2Tonnes', 'flareCh4Tonnes', 'flareCo2eTonnes', 'combustionEfficiencyNote');
row('both efficiencies given', inp(efl.combustionEfficiency), t3(efl.flareCo2Tonnes), t3(efl.flareCh4Tonnes), t3(efl.flareCo2eTonnes), efl.combustionEfficiencyNote === null ? 'none' : efl.combustionEfficiencyNote);
const blankC = must(F.abatement({ gas: eg, ...P, flareCombustionEfficiency: '' }), 'blank combustion');
claim(blankC.flareCo2Tonnes === standIn.flareCo2Tonnes && blankC.combustionEfficiencyNote === standIn.combustionEfficiencyNote, 'a blank combustion efficiency behaves as left out');
row('combustion efficiency typed blank (\'\')', inp(blankC.combustionEfficiency), t3(blankC.flareCo2Tonnes), t3(blankC.flareCh4Tonnes), t3(blankC.flareCo2eTonnes), blankC.combustionEfficiencyNote);
row('combustion efficiency left out', inp(standIn.combustionEfficiency), t3(standIn.flareCo2Tonnes), t3(standIn.flareCh4Tonnes), t3(standIn.flareCo2eTonnes), standIn.combustionEfficiencyNote);
row('left out minus given', fx(standIn.combustionEfficiency - efl.combustionEfficiency), t3(standIn.flareCo2Tonnes - efl.flareCo2Tonnes), t3(standIn.flareCh4Tonnes - efl.flareCh4Tonnes), t3(standIn.flareCo2eTonnes - efl.flareCo2eTonnes), '');
claim(standIn.flareCh4Tonnes === efl.flareCh4Tonnes && standIn.flareCo2Tonnes > efl.flareCo2Tonnes, 'the stand-in moves the CO2 and leaves the methane');
out('');
out('Rounding note: the engine reports each tonnage to three decimals before the difference is taken, so the CO2e difference and the CO2 difference in the last row can differ in the third decimal though the methane is the same.');
out('');
out('The stand-in moves the CO2 and leaves the methane where it was, because the methane is set by the destruction efficiency alone.');
out('');
out('The destruction efficiency across a range, combustion left out so it stands in each time:');
head('destruction efficiency (input)', 'flareCo2Tonnes', 'flareCh4Tonnes', 'flareCo2eTonnes', 'methaneShareOfFlareCo2e');
for (const eta of [0.9, 0.95, 0.97, 0.99, 1]) {
  const r = must(F.abatement({ gas: eg, ...P, flareDestructionEfficiency: eta, flareCombustionEfficiency: null }), 'sweep');
  row(inp(eta), t3(r.flareCo2Tonnes), t3(r.flareCh4Tonnes), t3(r.flareCo2eTonnes), fx(r.methaneShareOfFlareCo2e));
}

/* ------------------------------------------------------------------ */
section('CO2e WITH A STATED GWP, AND THE METHANE SHARE');
fnLabel('flareToValue.abatement');
out('The methane GWP is an input with no default: the assessment report it comes from is the study\'s to choose, and this course does not choose it. CO2e is the CO2 plus the methane times the GWP. EGBEMA\'s flare at the study\'s GWP and at two others, for comparison only:');
head('GWP (input)', 'flareCo2eTonnes', 'methaneShareOfFlareCo2e');
for (const gwp of [P.gwpMethane, 20, 40]) {
  const r = must(F.abatement({ gas: eg, ...P, gwpMethane: gwp }), 'gwp sweep');
  row(inp(gwp), t3(r.flareCo2eTonnes), fx(r.methaneShareOfFlareCo2e));
}
const noGwp = must(F.abatement({ gas: eg, ...P, gwpMethane: '' }), 'no gwp');
out('');
out('With the GWP left blank:');
head('field', 'value');
row('flareCo2Tonnes', t3(noGwp.flareCo2Tonnes));
row('flareCh4Tonnes', t3(noGwp.flareCh4Tonnes));
row('flareCo2eTonnes', noGwp.flareCo2eTonnes === null ? 'null' : t3(noGwp.flareCo2eTonnes));
row('methaneShareOfFlareCo2e', noGwp.methaneShareOfFlareCo2e === null ? 'null' : fx(noGwp.methaneShareOfFlareCo2e));
row('blockedBy', noGwp.blockedBy);
claim(noGwp.flareCo2eTonnes === null, 'no CO2e without a GWP');

/* ------------------------------------------------------------------ */
section('NO EFFICIENCY, NO FLARE: WHAT abatement REFUSES');
fnLabel('flareToValue.abatement');
out('What abatement refuses, each probe on EGBEMA\'s gas with the rest of EGBEMA\'s parcel:');
head('probe', 'engine');
row('destruction efficiency left blank (\'\')', refused(F.abatement({ gas: eg, ...P, flareDestructionEfficiency: '' }), 'blank eta'));
row('destruction efficiency 1.2', refused(F.abatement({ gas: eg, ...P, flareDestructionEfficiency: 1.2 }), 'eta > 1'));
row('combustion efficiency 0.98 above a destruction efficiency of 0.97', refused(F.abatement({ gas: eg, ...P, flareCombustionEfficiency: 0.98 }), 'etaC > etaD'));
row('no volume', refused(F.abatement({ gas: eg, ...P, volumeMMscfd: '' }), 'no volume'));
row('on-stream days left blank (\'\')', refused(F.abatement({ gas: eg, ...P, onstreamDays: '' }), 'blank days'));
row('on-stream days 367', refused(F.abatement({ gas: eg, ...P, onstreamDays: 367 }), 'days > 366'));
row('a gas the analysis refused', refused(F.abatement({ gas: F.characteriseGas({ components: comps([['C1', '']]) }), ...P }), 'no gas'));
out('');
const omitted = must(F.abatement({ gas: eg, volumeMMscfd: P.volumeMMscfd, flareDestructionEfficiency: P.flareDestructionEfficiency, gwpMethane: P.gwpMethane }), 'days omitted');
out(`On-stream days OMITTED from the call (not typed at all) take the stated default: scfPerYear ${inp(omitted.scfPerYear)}. Typed blank, they are refused, as the table shows.`);
const daysDefault = must(F.routeEconomics({ route: template('cng'), gas: eg, volumeMMscfd: P.volumeMMscfd, ...T.EGBEMA_ROUTES.cng }), 'route days omitted').onstreamDays;
claim(omitted.scfPerYear === P.volumeMMscfd * 1e6 * daysDefault, 'the omitted default is the days routeEconomics reports');
out(`The default itself: routeEconomics, asked with the days omitted, reports onstreamDays ${inp(daysDefault)}, and ${inp(P.volumeMMscfd)} MMscfd times a million times ${inp(daysDefault)} is the scfPerYear above.`);

/* ------------------------------------------------------------------ */
section('WHAT THE FLARE MODEL LEAVES OUT');
fnLabel('flareToValue.abatement');
out('These are stated limits of the engine, taught and never computed with:');
out('- The efficiencies have no default. 40 CFR 98.233(n)(1) is a United States rule with tiered default pairs; whether a Nigerian flare study defaults to any tier, or to the NUPRC flare regulations\' basis, is a regulation reading, and both efficiencies stay inputs.');
out('- An unlit flare is not modelled. Gas sent to a flare that is not lit is vented, all of it methane; the engine\'s flare is lit.');
out('- The methane GWP and any credit price are case inputs; the engine ships neither.');
out('- The component heating values and liquid densities are typical figures (the engine\'s own note says the gas analysis and the certificate govern).');
out('');
out('The Flare Gas to Value Studio opens with both efficiencies and the GWP blank. On the studio\'s opening gas with its opening parcel, abatement answers:');
head('probe', 'engine');
row(`studio opening gas, ${inp(T.SUITE_FLARE.volumeMMscfd)} MMscfd, ${inp(T.SUITE_FLARE.onstreamDays)} days, efficiencies blank`, refused(F.abatement({ gas: suiteGas, volumeMMscfd: T.SUITE_FLARE.volumeMMscfd, onstreamDays: T.SUITE_FLARE.onstreamDays, flareDestructionEfficiency: '', gwpMethane: '' }), 'studio blank'));

/* ------------------------------------------------------------------ */
section('THE EGBEMA FLARE END TO END, AND THE STUDIO\'S OPENING GAS');
fnLabel('flareToValue.characteriseGas, abatement');
out('EGBEMA, read in one table from the analysis to the CO2e:');
head('step', 'figure');
row('sheet sum', fx(eg.rawMoleFractionSum));
row('heating value, Btu/scf', fx(eg.ghvBtuScf));
row('inerts, mole fraction', fx(eg.inertMoleFraction));
row('hydrocarbon carbon per mole', fx(eg.hydrocarbonCarbonPerMol));
row('mass, kg/Mscf', fx(eg.kgPerMscf));
row('propane and heavier, kg/Mscf', fx(eg.c3PlusKgPerMscf));
row('liquids, gal/Mscf C3+', fx(eg.gpmC3Plus));
row('richness', eg.richness);
row('flare CO2, t/yr', t3(efl.flareCo2Tonnes));
row('flare methane, t/yr', t3(efl.flareCh4Tonnes));
row('flare CO2e, t/yr', t3(efl.flareCo2eTonnes));
out('');
out('The studio\'s opening gas, read the same way (its flare is refused until the efficiencies are typed, SECTION 14):');
head('step', 'figure');
row('heating value, Btu/scf', fx(suiteGas.ghvBtuScf));
row('hydrocarbon carbon per mole', fx(suiteGas.hydrocarbonCarbonPerMol));
row('mass, kg/Mscf', fx(suiteGas.kgPerMscf));
row('propane and heavier, kg/Mscf', fx(suiteGas.c3PlusKgPerMscf));
row('liquids, gal/Mscf C3+', fx(suiteGas.gpmC3Plus));
row('richness', suiteGas.richness);

/* ------------------------------------------------------------------ */
section('FOUR ROUTES AND THEIR ENVELOPES');
fnLabel('flareToValue.ROUTE_TEMPLATES, ROUTE_TEMPLATE_NOTE');
out('ROUTE_TEMPLATES, as the engine exports them. Every limit ships unset (null): the envelope is the study\'s to fill.');
out('');
head('route id', 'label', 'yield unit', 'yield ceiling', 'requirement', 'direction', 'unit', 'limit');
for (const t of F.ROUTE_TEMPLATES) {
  for (const q of t.requirements) row(t.id, t.label, t.yieldBasis.unit, t.yieldBasis.ceiling, q.label, q.direction, q.unit, q.limit === null ? 'null' : inp(q.limit));
}
out('');
out(`The engine's note: "${F.ROUTE_TEMPLATE_NOTE}"`);
out('');
out('Notes the templates carry on two requirements:');
for (const t of F.ROUTE_TEMPLATES) for (const q of t.requirements) if (q.note) out(`- ${t.label}, ${q.label}: "${q.note}"`);

/* ------------------------------------------------------------------ */
section('SCREENING EGBEMA: PASS, FAIL AND NOT FULLY SCREENED');
fnLabel('flareToValue.screenRoute');
out('The EGBEMA study\'s limits, route by route (a requirement not listed is left unset):');
head('route', 'limits typed');
for (const t of F.ROUTE_TEMPLATES) row(t.label, Object.entries(T.EGBEMA_LIMITS[t.id]).map(([k, v]) => `${k} ${inp(v)}`).join(', '));
out('');
const screens = F.ROUTE_TEMPLATES.map((t) => must(F.screenRoute({ route: withLimits(t.id, T.EGBEMA_LIMITS[t.id]), gas: eg, volumeMMscfd: P.volumeMMscfd }), `screen ${t.id}`));
head('route', 'requirement', 'actual', 'limit', 'status', 'margin');
for (const s of screens) for (const c of s.checks) row(s.label, c.label, fxOr(c.actual, 'null'), c.limit === null ? 'unset' : inp(c.limit), c.status, fxOr(c.margin, 'none'));
out('');
head('route', 'verdict', 'failures (requirement: actual against limit, shortfall)', 'uncheckedRequirements');
for (const s of screens) row(s.label, s.verdict, s.failures.length ? s.failures.map((x) => `${x.requirement}: ${fx(x.actual)} against ${inp(x.limit)}, short by ${fx(x.shortfall)} ${x.unit}`).join('; ') : 'none', list(s.uncheckedRequirements));
claim(screens.map((s) => s.verdict).join(',') === 'passes,fails,passes,not fully screened', 'the four verdicts are passes, fails, passes, not fully screened');
out('');
claim(screens.every((sc) => sc.checks.every((c) => c.margin === null || Math.abs(c.margin - (c.direction === 'min' ? c.actual - c.limit : c.limit - c.actual)) < 1e-6)), 'the margin is actual minus limit on a minimum and limit minus actual on a maximum');
out('The margin column is the actual minus the limit on a minimum requirement and the limit minus the actual on a maximum; a negative margin is a failure, and the shortfall is its size.');
out('');
out('Three verdicts appear: passes, fails, and not fully screened. A requirement with no limit is reported unchecked; an unset limit is not a satisfied one.');
out('');
const unscreened = F.ROUTE_TEMPLATES.map((t) => must(F.screenRoute({ route: t, gas: eg, volumeMMscfd: P.volumeMMscfd }), 'unscreened'));
out('The same four routes with every limit unset, as the studio opens:');
head('route', 'verdict');
for (const s of unscreened) row(s.label, s.verdict);
claim(unscreened.every((s) => s.verdict === 'not fully screened'), 'with no limits every route is not fully screened');
out('');
row('probe', 'engine');
row('---', '---');
row('screenRoute on a gas the analysis refused', refused(F.screenRoute({ route: template('cng'), gas: { error: 'x' }, volumeMMscfd: 1 }), 'screen no gas'));

/* ------------------------------------------------------------------ */
section('WHAT THE GAS CAN YIELD: THE CEILING ON EACH ROUTE');
fnLabel("flareToValue.yieldCeiling; the refusals are routeEconomics'");
out('Each route\'s yield is typed per Mscf in the route\'s own unit, and each carries a basis for the most one Mscf of this gas can make (yieldCeiling): CNG and mini LNG on the whole gas mass, LPG on the propane and heavier, gas to power on the heating value in MWh (the heating value times a thousand over BTU_PER_MWH).');
out('');
head('route', 'yield unit', 'ceiling basis', 'EGBEMA ceiling per Mscf', 'OGUTA ceiling per Mscf', 'studio opening gas ceiling per Mscf', 'EGBEMA yield typed');
for (const t of F.ROUTE_TEMPLATES) {
  row(t.label, t.yieldBasis.unit, t.yieldBasis.ceiling, fx(F.yieldCeiling({ yieldBasis: t.yieldBasis, gas: eg })), fx(F.yieldCeiling({ yieldBasis: t.yieldBasis, gas: lean })), fx(F.yieldCeiling({ yieldBasis: t.yieldBasis, gas: suiteGas })), inp(T.EGBEMA_ROUTES[t.id].productUnitPerMscf));
  claim(T.EGBEMA_ROUTES[t.id].productUnitPerMscf <= F.yieldCeiling({ yieldBasis: t.yieldBasis, gas: eg }), `EGBEMA ${t.id} yield is within its ceiling`);
}
out('');
out('Every EGBEMA yield typed sits at or below its ceiling. A yield above the ceiling is refused, and a yield of zero is refused:');
head('probe', 'engine');
const lpgT = template('lpg_extraction');
row(`studio opening gas, LPG route at ${inp(T.SUITE_FLARE.lpgYieldBefore)} t/Mscf`, refused(F.routeEconomics({ route: lpgT, gas: suiteGas, volumeMMscfd: T.SUITE_FLARE.volumeMMscfd, productUnitPerMscf: T.SUITE_FLARE.lpgYieldBefore, recoveryFraction: 0.85 }), 'above ceiling'));
row('EGBEMA, CNG route at 30 kg/Mscf', refused(F.routeEconomics({ route: template('cng'), gas: eg, volumeMMscfd: P.volumeMMscfd, productUnitPerMscf: 30, recoveryFraction: 0.88 }), 'cng above'));
row('EGBEMA, gas to power at 0 MWh/Mscf', refused(F.routeEconomics({ route: template('gas_to_power'), gas: eg, volumeMMscfd: P.volumeMMscfd, productUnitPerMscf: 0, recoveryFraction: 0.94 }), 'zero yield'));
const suiteLpg = must(F.routeEconomics({ route: lpgT, gas: suiteGas, volumeMMscfd: T.SUITE_FLARE.volumeMMscfd, productUnitPerMscf: T.SUITE_FLARE.lpgYieldPerMscf, recoveryFraction: 0.85 }), 'studio lpg');
out('');
out(`The studio's LPG route on its opening gas at ${inp(T.SUITE_FLARE.lpgYieldPerMscf)} t/Mscf is within its ceiling of ${fx(suiteLpg.yieldCeilingPerMscf)} t/Mscf, and the typed yield over the ceiling is ${fx(T.SUITE_FLARE.lpgYieldPerMscf / suiteLpg.yieldCeilingPerMscf)}.`);

/* ------------------------------------------------------------------ */
section('A ROUTE\'S YEAR: PRODUCT, REVENUE, COST AND MARGIN');
fnLabel('flareToValue.routeEconomics');
out(`EGBEMA's four routes on ${inp(P.volumeMMscfd)} MMscfd and ${inp(P.onstreamDays)} days. The inputs typed:`);
head('route', 'yield per Mscf', 'recovery', 'price per unit, dollars', 'reference capital, dollars', 'reference capacity MMscfd', 'fixed opex, dollars a year', 'variable opex, dollars per Mscf');
for (const t of F.ROUTE_TEMPLATES) { const r = T.EGBEMA_ROUTES[t.id]; row(t.label, `${inp(r.productUnitPerMscf)} ${r.productUnitLabel}`, inp(r.recoveryFraction), inp(r.pricePerProductUnit), inp(r.referenceCapitalCost), inp(r.referenceCapacityMMscfd), inp(r.fixedOpexPerYear), inp(r.variableOpexPerMscf)); }
out('');
const econ = Object.fromEntries(F.ROUTE_TEMPLATES.map((t) => [t.id, must(F.routeEconomics({ route: t, gas: eg, volumeMMscfd: P.volumeMMscfd, onstreamDays: P.onstreamDays, ...T.EGBEMA_ROUTES[t.id] }), `econ ${t.id}`)]));
out('mscfPerYear is the volume in Mscf a day times the on-stream days; productPerYear is that times the yield times the recovery; revenue is product times price; operating cost is the fixed cost plus the variable cost per Mscf of the whole parcel; valuePerMscf is the margin over mscfPerYear.');
head('route', 'mscfPerYear', 'productPerYear', 'revenuePerYear, dollars', 'operatingCostPerYear, dollars', 'grossMarginPerYear, dollars', 'valuePerMscf, dollars');
for (const t of F.ROUTE_TEMPLATES) { const e = econ[t.id]; row(t.label, fx(e.mscfPerYear), `${fx(e.productPerYear)} ${e.productUnitLabel}`, d2(e.revenuePerYear), d2(e.operatingCostPerYear), d2(e.grossMarginPerYear), fx(e.valuePerMscf)); }
claim(F.ROUTE_TEMPLATES.every((t) => Math.abs(econ[t.id].revenuePerYear - econ[t.id].operatingCostPerYear - econ[t.id].grossMarginPerYear) < 0.02), 'the margin is revenue minus operating cost');
out('');
out('grossMarginPerYear is revenuePerYear minus operatingCostPerYear, on every row.');
const econOmit = must(F.routeEconomics({ route: template('cng'), gas: eg, volumeMMscfd: P.volumeMMscfd, ...T.EGBEMA_ROUTES.cng }), 'days omitted');
out(`On-stream days OMITTED from routeEconomics take the stated default: onstreamDays ${inp(econOmit.onstreamDays)}, mscfPerYear ${fx(econOmit.mscfPerYear)} on the CNG route. Typed blank, they are refused, as the table below shows.`);
out('');
out('Recovery is a design outcome typed per route. It is refused outside (0, 1]:');
head('probe', 'engine');
row('CNG recovery 0', refused(F.routeEconomics({ route: template('cng'), gas: eg, volumeMMscfd: P.volumeMMscfd, ...T.EGBEMA_ROUTES.cng, recoveryFraction: 0 }), 'rec 0'));
row('CNG recovery 1.2', refused(F.routeEconomics({ route: template('cng'), gas: eg, volumeMMscfd: P.volumeMMscfd, ...T.EGBEMA_ROUTES.cng, recoveryFraction: 1.2 }), 'rec 1.2'));
row('CNG recovery left blank (\'\')', refused(F.routeEconomics({ route: template('cng'), gas: eg, volumeMMscfd: P.volumeMMscfd, ...T.EGBEMA_ROUTES.cng, recoveryFraction: '' }), 'rec blank'));
row('CNG on-stream days left blank (\'\')', refused(F.routeEconomics({ route: template('cng'), gas: eg, volumeMMscfd: P.volumeMMscfd, ...T.EGBEMA_ROUTES.cng, onstreamDays: '' }), 'days blank'));
out('');
out('A BLANK COST IS NAMED. A cost box left blank is taken as zero and named in assumedZero:');
const blankVar = must(F.routeEconomics({ route: template('cng'), gas: eg, volumeMMscfd: P.volumeMMscfd, onstreamDays: P.onstreamDays, ...T.EGBEMA_ROUTES.cng, variableOpexPerMscf: '' }), 'blank var');
const blankFix = must(F.routeEconomics({ route: template('cng'), gas: eg, volumeMMscfd: P.volumeMMscfd, onstreamDays: P.onstreamDays, ...T.EGBEMA_ROUTES.cng, fixedOpexPerYear: null }), 'blank fix');
head('CNG route', 'operatingCostPerYear', 'valuePerMscf', 'assumedZero');
row('both costs typed', d2(econ.cng.operatingCostPerYear), fx(econ.cng.valuePerMscf), list(econ.cng.assumedZero));
row('variable cost left blank (\'\')', d2(blankVar.operatingCostPerYear), fx(blankVar.valuePerMscf), list(blankVar.assumedZero));
row('fixed cost left blank (null)', d2(blankFix.operatingCostPerYear), fx(blankFix.valuePerMscf), list(blankFix.assumedZero));
claim(blankVar.assumedZero.includes('variable operating cost') && blankFix.assumedZero.includes('fixed operating cost'), 'each blank cost is named');

/* ------------------------------------------------------------------ */
section('CAPITAL BY THE MODULAR POWER LAW, AND THE CASH FLOW HANDED ON');
fnLabel('flareToValue.routeEconomics, modularRefinery.scaleCapex and SCALING_EXPONENT');
out('Capital is scaled from the route\'s reference plant: cost = reference cost times (capacity over reference capacity) to the exponent. The exponents modularRefinery exports:');
head('SCALING_EXPONENT', 'value');
for (const [k, v] of Object.entries(MR.SCALING_EXPONENT)) row(k, inp(v));
out('');
head('route', 'capitalCost', 'scalingExponent', 'the six-tenths rule on the same plant', 'modular minus six-tenths');
for (const t of F.ROUTE_TEMPLATES) {
  const e = econ[t.id]; const r = T.EGBEMA_ROUTES[t.id];
  const stick = MR.scaleCapex({ baseCost: r.referenceCapitalCost, baseCapacity: r.referenceCapacityMMscfd, capacity: P.volumeMMscfd, exponent: MR.SCALING_EXPONENT.STICK_BUILT }).cost;
  row(t.label, d2(e.capitalCost), inp(e.scalingExponent), d2(stick), d2(e.capitalCost - stick));
}
out('');
out(`Every route's capital is scaled TO the parcel's ${inp(P.volumeMMscfd)} MMscfd from its reference capacity (the inputs table above); the six-tenths column is the same scaling at SCALING_EXPONENT.STICK_BUILT.`);
const blankExp = must(F.routeEconomics({ route: template('cng'), gas: eg, volumeMMscfd: P.volumeMMscfd, onstreamDays: P.onstreamDays, ...T.EGBEMA_ROUTES.cng, scalingExponent: '' }), 'blank exponent');
claim(blankExp.scalingExponent === MR.SCALING_EXPONENT.MODULAR && blankExp.capitalCost === econ.cng.capitalCost, 'a blank exponent takes the modular exponent');
out(`With the scaling exponent typed blank ('') routeEconomics takes the MODULAR exponent: scalingExponent ${inp(blankExp.scalingExponent)}, capitalCost ${d2(blankExp.capitalCost)} on the CNG route.`);
out('');
out('The engine assembles the cash flow and hands it on; it does not discount it. Year 0 is the capital as a negative, and the recurring figure is the margin:');
head('route', 'cashFlow.year0', 'cashFlow.recurring');
for (const t of F.ROUTE_TEMPLATES) row(t.label, d2(econ[t.id].cashFlow.year0), d2(econ[t.id].cashFlow.recurring));
out('');
out(`The engine's valuation note: "${econ.cng.valuationNote}"`);
const noRef = must(F.routeEconomics({ route: template('cng'), gas: eg, volumeMMscfd: P.volumeMMscfd, onstreamDays: P.onstreamDays, ...T.EGBEMA_ROUTES.cng, referenceCapitalCost: '' }), 'no ref');
out(`With the reference cost left blank the capital is null and the note reads: "${noRef.capexNote}"`);

/* ------------------------------------------------------------------ */
section('THE COUNTERFACTUAL: ONLY THE RECOVERED SHARE IS AVOIDED');
fnLabel('flareToValue.abatement');
out(`The CNG route recovers ${inp(T.EGBEMA_ROUTES.cng.recoveryFraction)} of EGBEMA's flare. The gas it does not recover is still flared, so the avoided flare CO2e is the flare's CO2e times the recovery. The net abatement is the avoided flare, less what burning the product emits, plus what the product displaces. Three counterfactuals on the same flare and the same route:`);
out('');
const abs = T.EGBEMA_COUNTERFACTUALS.map((cf) => must(F.abatement({ gas: eg, ...P, recoveryFraction: T.EGBEMA_ROUTES.cng.recoveryFraction, ...cf }), cf.counterfactualLabel));
head('counterfactual', 'flareCo2eTonnes', 'recoveryFraction', 'avoidedFlareCo2eTonnes', 'product combustion (input)', 'displaced fuel (input)', 'netAbatementTonnesCo2ePerYear', 'net minus the gross flare');
abs.forEach((a) => row(a.counterfactualLabel, t3(a.flareCo2eTonnes), inp(a.recoveryFraction), t3(a.avoidedFlareCo2eTonnes), inp(a.productCombustionTonnesCo2ePerYear), inp(a.displacedFuelTonnesCo2ePerYear), t3(a.netAbatementTonnesCo2ePerYear), t3(a.netAbatementTonnesCo2ePerYear - a.grossClaimIfNoCounterfactual)));
claim(abs[0].netAbatementTonnesCo2ePerYear > abs[0].grossClaimIfNoCounterfactual && abs[1].netAbatementTonnesCo2ePerYear < abs[1].grossClaimIfNoCounterfactual && abs[2].netAbatementTonnesCo2ePerYear < abs[2].grossClaimIfNoCounterfactual, 'displacing diesel abates more than the gross flare and the other two less');
out('');
out('One flare, three answers. Displacing diesel, the net abatement is larger than the gross flare; displacing gas already burned, or selling into a market that burned nothing, it is smaller.');
out('');
const power = must(F.abatement({ gas: eg, ...P, recoveryFraction: T.EGBEMA_ROUTES.gas_to_power.recoveryFraction, ...T.EGBEMA_POWER_COUNTERFACTUAL }), 'power');
out(`Gas to power recovers ${inp(power.recoveryFraction)}. Its counterfactual, "${power.counterfactualLabel}": product combustion ${inp(power.productCombustionTonnesCo2ePerYear)}, displaced ${inp(power.displacedFuelTonnesCo2ePerYear)}. avoidedFlareCo2eTonnes ${t3(power.avoidedFlareCo2eTonnes)}, netAbatementTonnesCo2ePerYear ${t3(power.netAbatementTonnesCo2ePerYear)}.`);
claim(power.netAbatementTonnesCo2ePerYear < 0, 'the power case adds emissions');
out('The net is below zero: this route adds emissions.');
out('');
out('BLOCKED UNTIL DECLARED. abatement gives no net without every input it rests on, and says which is missing first (blockedBy):');
const blk = (over) => must(F.abatement({ gas: eg, ...P, recoveryFraction: T.EGBEMA_ROUTES.cng.recoveryFraction, ...T.EGBEMA_COUNTERFACTUALS[0], ...over }), 'blocked');
head('probe', 'netAbatementTonnesCo2ePerYear', 'blockedBy');
for (const [label, over] of [['no GWP', { gwpMethane: '' }], ['no recovery fraction', { recoveryFraction: '' }], ['recovery 1.5', { recoveryFraction: 1.5 }], ['no counterfactual label', { counterfactualLabel: null }], ['no displaced fuel figure', { displacedFuelTonnesCo2ePerYear: '' }]]) {
  const r = blk(over);
  claim(r.netAbatementTonnesCo2ePerYear === null, `${label} blocks the net`);
  row(label, 'null', r.blockedBy);
}
out('');
out(`The warning printed while the counterfactual is undeclared: "${blk({ counterfactualLabel: null }).warning}"`);
out('');
out(`The flare's gross CO2e is still reported beside a blocked net, as grossClaimIfNoCounterfactual (${t3(blk({ counterfactualLabel: null }).grossClaimIfNoCounterfactual)} t/yr here): the claim the engine will not make.`);

/* ------------------------------------------------------------------ */
section('DOES THE PROJECT NEED CREDITS: THE BREAKEVEN CREDIT PRICE');
fnLabel('flareToValue.creditSensitivity');
const net0 = abs[0].netAbatementTonnesCo2ePerYear;
const cr = must(F.creditSensitivity({ netAbatementTonnesCo2ePerYear: net0, grossMarginPerYear: econ.cng.grossMarginPerYear, ...T.EGBEMA_CREDITS }), 'credits');
out(`The CNG route against the diesel counterfactual: net abatement ${t3(net0)} t/yr, gross margin ${d2(econ.cng.grossMarginPerYear)} a year, hurdle margin ${inp(T.EGBEMA_CREDITS.hurdleMarginPerYear)} a year. Credit prices typed in this order: ${T.EGBEMA_CREDITS.creditPrices.map(inp).join(', ')} dollars per tonne. Credit prices are case inputs; the engine ships none.`);
out('');
head('credit price (input, in the order typed)', 'creditRevenuePerYear', 'totalMarginPerYear', 'clearsHurdle');
for (const p of cr.points) row(inp(p.creditPrice), d2(p.creditRevenuePerYear), d2(p.totalMarginPerYear), yesNo(p.clearsHurdle));
claim(cr.points.every((p) => Math.abs(p.creditRevenuePerYear - p.creditPrice * net0) < 0.01 && Math.abs(p.totalMarginPerYear - econ.cng.grossMarginPerYear - p.creditRevenuePerYear) < 0.02), 'credit revenue is price times net tonnes, total margin is margin plus credit revenue');
out('');
out('creditRevenuePerYear is the credit price times the net abatement in tonnes; totalMarginPerYear is the route\'s gross margin plus that; a point clears when its total margin reaches the hurdle.');
out(`The breakeven's numerator, the hurdle minus the margin: ${d2(T.EGBEMA_CREDITS.hurdleMarginPerYear - econ.cng.grossMarginPerYear)} a year, over ${t3(net0)} t/yr.`);
out('');
head('field', 'value');
row('standsAloneWithoutCredits', yesNo(cr.standsAloneWithoutCredits));
row('breakevenCreditPrice ((hurdle minus margin) over net tonnes)', fx(cr.breakevenCreditPrice));
row('lowestTestedClearingPrice', inp(cr.lowestTestedClearingPrice));
row('the first price in the order typed that clears', inp(cr.points.find((p) => p.clearsHurdle).creditPrice));
row('verdict', cr.verdict);
claim(cr.lowestTestedClearingPrice !== cr.points.find((p) => p.clearsHurdle).creditPrice && cr.breakevenCreditPrice < cr.lowestTestedClearingPrice, 'the breakeven, the lowest clearing price and the first clearing price typed are three different figures');
out('');
out('The breakeven is the price at which the route just clears its hurdle, in closed form; the lowest tested price that clears is reported beside it; the first price in the order typed that clears is a third figure again, and it is neither.');
out('');
const crLow = must(F.creditSensitivity({ netAbatementTonnesCo2ePerYear: net0, grossMarginPerYear: econ.cng.grossMarginPerYear, creditPrices: T.EGBEMA_CREDITS.creditPrices, hurdleMarginPerYear: T.EGBEMA_LOW_HURDLE }), 'low hurdle');
out(`At a hurdle of ${inp(T.EGBEMA_LOW_HURDLE)} the route stands alone: standsAloneWithoutCredits ${yesNo(crLow.standsAloneWithoutCredits)}, breakevenCreditPrice ${fx(crLow.breakevenCreditPrice)}, verdict "${crLow.verdict}"`);
out('');
out('NO ABATEMENT, NO CREDITS. What creditSensitivity refuses, and what it answers without a verdict:');
head('probe', 'engine');
row('the gas-to-power counterfactual, which adds emissions', refused(F.creditSensitivity({ netAbatementTonnesCo2ePerYear: power.netAbatementTonnesCo2ePerYear, grossMarginPerYear: econ.gas_to_power.grossMarginPerYear, ...T.EGBEMA_CREDITS }), 'negative net'));
row('no net abatement (the counterfactual undeclared)', refused(F.creditSensitivity({ netAbatementTonnesCo2ePerYear: null, ...T.EGBEMA_CREDITS }), 'no net'));
row('a hurdle that is not a number (\'x\')', refused(F.creditSensitivity({ netAbatementTonnesCo2ePerYear: net0, grossMarginPerYear: econ.cng.grossMarginPerYear, creditPrices: [10], hurdleMarginPerYear: 'x' }), 'bad hurdle'));
const noMargin = must(F.creditSensitivity({ netAbatementTonnesCo2ePerYear: net0, grossMarginPerYear: null, ...T.EGBEMA_CREDITS }), 'no margin');
const blankHurdle = must(F.creditSensitivity({ netAbatementTonnesCo2ePerYear: net0, grossMarginPerYear: econ.cng.grossMarginPerYear, creditPrices: T.EGBEMA_CREDITS.creditPrices, hurdleMarginPerYear: '' }), 'blank hurdle');
row('no margin for the route (price missing)', `answers with no verdict: breakevenCreditPrice ${blankOr(noMargin.breakevenCreditPrice)}; "${noMargin.verdict}"`);
row('hurdle left blank (\'\')', `answers with no verdict: breakevenCreditPrice ${blankOr(blankHurdle.breakevenCreditPrice)}; "${blankHurdle.verdict}"`);
function blankOr(v) { return v === null ? 'null' : fx(v); }

/* ------------------------------------------------------------------ */
section('THE BID TABLE');
fnLabel('flareToValue.compareRoutes');
const abatementsFor = { cng: abs[0] };
const cmp = F.compareRoutes({ screenings: screens, economics: F.ROUTE_TEMPLATES.map((t) => econ[t.id]), abatements: abatementsFor });
out('compareRoutes lays the routes side by side. A route that fails screening stays in the table with its failure named. The EGBEMA study, with its limits:');
head('route', 'verdict', 'capitalCost', 'revenuePerYear', 'grossMarginPerYear', 'valuePerMscf', 'netAbatementTonnesCo2ePerYear');
for (const r of cmp.rows) row(r.label, r.verdict, d2(r.capitalCost), d2(r.revenuePerYear), d2(r.grossMarginPerYear), fx(r.valuePerMscf), r.netAbatementTonnesCo2ePerYear === null ? 'none declared' : t3(r.netAbatementTonnesCo2ePerYear));
out('');
head('field', 'value');
row('bestByValuePerMscf', cmp.bestByValuePerMscf === null ? 'null' : cmp.bestByValuePerMscf);
row('leaderNotFullyScreened', cmp.leaderNotFullyScreened === null ? 'null' : cmp.leaderNotFullyScreened);
row('screenedOut', list(cmp.screenedOut));
row('notFullyScreened', list(cmp.notFullyScreened));
row('rankingNote', cmp.rankingNote);
const passing = cmp.rows.filter((r) => r.verdict === 'passes');
claim(cmp.bestByValuePerMscf === passing.reduce((a, b) => (b.valuePerMscf > a.valuePerMscf ? b : a)).routeId, 'the best is the highest value among routes that pass');
out('');
const cmpOpen = F.compareRoutes({ screenings: unscreened, economics: F.ROUTE_TEMPLATES.map((t) => econ[t.id]) });
out('The same economics with every limit unset, as the studio opens:');
head('field', 'value');
row('bestByValuePerMscf', cmpOpen.bestByValuePerMscf === null ? 'null' : cmpOpen.bestByValuePerMscf);
row('leaderNotFullyScreened', cmpOpen.leaderNotFullyScreened === null ? 'null' : cmpOpen.leaderNotFullyScreened);
row('rankingNote', cmpOpen.rankingNote);
claim(cmpOpen.bestByValuePerMscf === null && cmpOpen.leaderNotFullyScreened !== null, 'with no limits nothing is ranked best');

/* ------------------------------------------------------------------ */
section('THE EGBEMA ROUTES END TO END, AND WHAT THE ORACLE CHECKS ON A PARCEL');
fnLabel('flareToValue.routeEconomics, abatement, creditSensitivity');
out('EGBEMA\'s CNG route, from the gas to the credit test:');
head('step', 'figure');
row('CNG yield ceiling, kg/Mscf', fx(econ.cng.yieldCeilingPerMscf));
row('CNG made, kg/yr', fx(econ.cng.productPerYear));
row('capital, dollars', d2(econ.cng.capitalCost));
row('gross margin, dollars a year', d2(econ.cng.grossMarginPerYear));
row('value per Mscf, dollars', fx(econ.cng.valuePerMscf));
row('flare CO2e, t/yr', t3(abs[0].flareCo2eTonnes));
row('avoided flare CO2e at the recovery, t/yr', t3(abs[0].avoidedFlareCo2eTonnes));
row('net abatement against diesel, t/yr', t3(abs[0].netAbatementTonnesCo2ePerYear));
row('breakeven credit price, dollars per tonne', fx(cr.breakevenCreditPrice));
out('');
out('What the validation oracle (oracle_flaretovalue.py, in packages/engines/tools/validation/downstream) checks, independently of the engine: the gas in exact rationals carried in kilograms and cubic metres; molar masses rebuilt from atomic weights; the standard molar volume derived from the gas constant; the flare by the rule by moles, cross-checked by the rule\'s own volumetric route; the route, credit and comparison ledgers. It does not validate the typical heating values and liquid densities: those are pinned, and the engine labels them typical.');

/* ------------------------------------------------------------------ */
section('THE LPG BLEND: THREE PROPERTIES ON THREE BASES');
fnLabel('lpgCng.lpgBlendProperties, LPG_REFERENCE');
out('LPG_REFERENCE, as the engine exports it:');
head('code', 'label', 'molar mass kg/kmol', 'typical liquid density kg/m3', 'range', 'typical latent heat kJ/kg', 'range', 'typical boiling point C');
for (const r of L.LPG_REFERENCE) row(r.code, r.label, inp(r.molarMassKgKmol), inp(r.typicalLiquidDensityKgM3), r.liquidDensityRange, inp(r.typicalLatentHeatKJkg), r.latentHeatRange, inp(r.typicalBoilingPointC));
out('');
out(`The engine's note: "${L.LPG_PROPERTY_NOTE}"`);
out('');
const lpgRef = Object.fromEntries(L.LPG_REFERENCE.map((r) => [r.code, r]));
const blendComps = (shares) => Object.entries(shares).map(([code, v]) => ({ code, volumeFraction: v, liquidDensityKgM3: lpgRef[code].typicalLiquidDensityKgM3, molarMassKgKmol: lpgRef[code].molarMassKgKmol, latentHeatKJkg: lpgRef[code].typicalLatentHeatKJkg }));
const kb = must(L.lpgBlendProperties({ components: blendComps(T.KANO_BLEND) }), 'KANO blend');
const studioBlend = must(L.lpgBlendProperties({ components: blendComps({ propane: 0.4, butane: 0.6 }) }), 'studio blend');
out(`KANO's blend by liquid volume: ${Object.entries(T.KANO_BLEND).map(([k, v]) => `${k} ${inp(v)}`).join(', ')}, on the typical figures. The studio's opening blend: propane 0.4, butane 0.6.`);
head('blend', 'densityKgM3 (basis)', 'latentHeatKJkg (basis)', 'molarMassKgKmol (basis)', 'propane mass fraction', 'butane mass fraction');
for (const [name, b] of [['KANO', kb], ['studio opening blend', studioBlend]]) row(name, `${fx(b.densityKgM3)} (${b.densityBasis})`, `${fx(b.latentHeatKJkg)} (${b.latentHeatBasis})`, `${fx(b.molarMassKgKmol)} (${b.molarMassBasis})`, fx(b.massFractions[0].massFraction), fx(b.massFractions[1].massFraction));
const latOnVol = Object.entries(T.KANO_BLEND).reduce((s, [k, v]) => s + v * lpgRef[k].typicalLatentHeatKJkg, 0);
out('');
out(`Density blends on volume; latent heat per kilogram blends on mass, through the mass fractions the densities give; molar mass blends on moles. KANO's latent heat averaged on the volume fractions instead would be ${fx(latOnVol)} kJ/kg, which is ${fx(latOnVol - kb.latentHeatKJkg)} kJ/kg from the engine's.`);
out('');
head('probe', 'engine');
row('a blank butane volume fraction', refused(L.lpgBlendProperties({ components: blendComps({ propane: 0.35, butane: '' }) }), 'blank vf'));
row('a butane liquid density left blank', refused(L.lpgBlendProperties({ components: blendComps(T.KANO_BLEND).map((c) => (c.code === 'butane' ? { ...c, liquidDensityKgM3: '' } : c)) }), 'no density'));
row('a negative volume fraction', refused(L.lpgBlendProperties({ components: blendComps({ propane: -0.1, butane: 1.1 }) }), 'negative vf'));
const noLatent = must(L.lpgBlendProperties({ components: blendComps(T.KANO_BLEND).map((c) => (c.code === 'butane' ? { ...c, latentHeatKJkg: '' } : c)) }), 'no latent');
claim(noLatent.latentHeatKJkg === null && noLatent.densityKgM3 === kb.densityKgM3, 'a blank latent heat leaves the blend latent heat missing and the density given');
out('');
out(`With butane's latent heat left blank the blend's latent heat is null, its density still ${fx(noLatent.densityKgM3)} kg/m3, and the note reads: "${noLatent.note}"`);

/* ------------------------------------------------------------------ */
section('THE VESSEL: THE FILL LIMIT AND ITS BASIS, COVER AND REORDER');
fnLabel('lpgCng.lpgStorageSizing, FILL_RATIO_BASIS, WATER_KG_M3');
out(`The fill limit is required and has no default; the code value is the site's. A code states it two ways, and the engine takes the basis explicitly (FILL_RATIO_BASIS: ${Object.values(L.FILL_RATIO_BASIS).join(', ')}). On the water-capacity basis the engine weighs the water capacity at WATER_KG_M3 = ${inp(L.WATER_KG_M3)} kg/m3. KANO's vessel, with two illustrative fill limits (neither is a code value):`);
out(`Vessel ${inp(T.KANO_VESSEL.vesselCapacityM3)} m3, demand ${inp(T.KANO_VESSEL.demandTonnesPerDay)} t/day, delivery ${inp(T.KANO_VESSEL.deliveryTonnes)} t, lead time ${inp(T.KANO_VESSEL.leadTimeDays)} days, safety stock ${inp(T.KANO_VESSEL.safetyDays)} days, liquid density the blend's ${fx(kb.densityKgM3)} kg/m3.`);
out('');
const storeK = T.KANO_FILL_LIMITS.map((f) => must(L.lpgStorageSizing({ ...T.KANO_VESSEL, ...f, liquidDensityKgM3: kb.densityKgM3 }), `storage ${f.fillRatioBasis}`));
head('fill limit (input)', 'fillRatioBasis', 'usableM3', 'usableTonnes', 'vapourSpaceM3', 'coverDays', 'safetyStockTonnes', 'reorderAtTonnes', 'ullageAtReorderTonnes', 'deliveryFitsUllage', 'deliveriesPerMonth');
storeK.forEach((s, i) => row(inp(T.KANO_FILL_LIMITS[i].maxFillRatio), s.fillRatioBasis, fx(s.usableM3), fx(s.usableTonnes), fx(s.vapourSpaceM3), fx(s.coverDays), fx(s.safetyStockTonnes), fx(s.reorderAtTonnes), fx(s.ullageAtReorderTonnes), yesNo(s.deliveryFitsUllage), fx(s.deliveriesPerMonth)));
const swapped = must(L.lpgStorageSizing({ ...T.KANO_VESSEL, maxFillRatio: T.KANO_FILL_LIMITS[1].maxFillRatio, fillRatioBasis: 'liquid_volume', liquidDensityKgM3: kb.densityKgM3 }), 'swapped');
out('');
out(`The same ${inp(T.KANO_FILL_LIMITS[1].maxFillRatio)} read on the other basis (as a share of the liquid volume) gives ${fx(swapped.usableTonnes)} t, which is ${fx(storeK[1].usableTonnes - swapped.usableTonnes)} t below the filling density's ${fx(storeK[1].usableTonnes)} t. The vapour space is the vessel less the usable liquid; the fill-limit refusal below states what it is for.`);
out('');
out('The rules behind the columns, each checked on both rows: usableM3 is usableTonnes over the density; vapourSpaceM3 is the vessel less usableM3; coverDays is usableTonnes over the demand; safetyStockTonnes is the demand times the safety days; reorderAtTonnes is the demand times the lead time plus the safety stock; ullageAtReorderTonnes is usableTonnes less reorderAtTonnes; deliveriesPerMonth is the demand times 30 over the delivery.');
const Kv = T.KANO_VESSEL;
head('fill limit (input)', 'usableTonnes over demand', 'demand x safety days', 'demand x lead + safety stock', 'usableTonnes less reorder', 'the engine\'s cover, safety, reorder, ullage');
storeK.forEach((st, i) => {
  const cover = st.usableTonnes / Kv.demandTonnesPerDay; const saf = Kv.demandTonnesPerDay * Kv.safetyDays;
  const reo = Kv.demandTonnesPerDay * Kv.leadTimeDays + saf; const ull = st.usableTonnes - reo;
  claim(Math.abs(cover - st.coverDays) < 1e-3 && Math.abs(saf - st.safetyStockTonnes) < 1e-4 && Math.abs(reo - st.reorderAtTonnes) < 1e-4 && Math.abs(ull - st.ullageAtReorderTonnes) < 1e-3, 'the storage rules reproduce the engine');
  row(inp(T.KANO_FILL_LIMITS[i].maxFillRatio), fx(cover), fx(saf), fx(reo), fx(ull), `${fx(st.coverDays)}, ${fx(st.safetyStockTonnes)}, ${fx(st.reorderAtTonnes)}, ${fx(st.ullageAtReorderTonnes)}`);
});
out('');
out('Rounding note: the engine reports coverDays to three decimals, so its cover prints with a final 0 at four decimals and can differ in the fourth decimal from usableTonnes over the demand.');
out('');
head('probe', 'engine');
row('fill limit left blank', refused(L.lpgStorageSizing({ ...T.KANO_VESSEL, liquidDensityKgM3: kb.densityKgM3 }), 'no fill'));
row('fill limit 1', refused(L.lpgStorageSizing({ ...T.KANO_VESSEL, maxFillRatio: 1, liquidDensityKgM3: kb.densityKgM3 }), 'fill 1'));
row('basis typed blank (\'\')', refused(L.lpgStorageSizing({ ...T.KANO_VESSEL, maxFillRatio: 0.85, fillRatioBasis: '', liquidDensityKgM3: kb.densityKgM3 }), 'blank basis'));
row('basis typed as \'weight\'', refused(L.lpgStorageSizing({ ...T.KANO_VESSEL, maxFillRatio: 0.42, fillRatioBasis: 'weight', liquidDensityKgM3: kb.densityKgM3 }), 'bad basis'));
row('a filling density of 0.6 on water capacity at the KANO blend density', refused(L.lpgStorageSizing({ ...T.KANO_VESSEL, maxFillRatio: 0.6, fillRatioBasis: 'water_capacity_mass', liquidDensityKgM3: kb.densityKgM3 }), 'liquid full'));
row('no liquid density', refused(L.lpgStorageSizing({ ...T.KANO_VESSEL, maxFillRatio: 0.85 }), 'no rho'));
out('');
const blankLead = must(L.lpgStorageSizing({ ...T.KANO_VESSEL, ...T.KANO_FILL_LIMITS[0], leadTimeDays: '', liquidDensityKgM3: kb.densityKgM3 }), 'blank lead');
out(`A BLANK LEAD TIME IS MISSING. With the lead time left blank (''): missingInputs ${list(blankLead.missingInputs)}; reorderAtTonnes ${blankOr(blankLead.reorderAtTonnes)}; deliveryFitsUllage ${yesNo(blankLead.deliveryFitsUllage)}. The cover (${fx(blankLead.coverDays)} days) does not depend on it and is still given.`);
claim(blankLead.reorderAtTonnes === null && blankLead.deliveryFitsUllage === null, 'a blank lead time leaves the reorder point unstated');
const { leadTimeDays: _lt, ...noLead } = T.KANO_VESSEL;
const omitLead = must(L.lpgStorageSizing({ ...noLead, ...T.KANO_FILL_LIMITS[0], liquidDensityKgM3: kb.densityKgM3 }), 'omitted lead');
out(`With the lead time OMITTED from the call it takes the stated 0: missingInputs ${list(omitLead.missingInputs)}; reorderAtTonnes ${fx(omitLead.reorderAtTonnes)} (the safety stock alone).`);
const { fillRatioBasis: _fb, ...noBasis } = T.KANO_FILL_LIMITS[0];
const omitBasis = must(L.lpgStorageSizing({ ...T.KANO_VESSEL, ...noBasis, liquidDensityKgM3: kb.densityKgM3 }), 'omitted basis');
claim(omitBasis.fillRatioBasis === L.FILL_RATIO_BASIS.LIQUID_VOLUME, 'the omitted basis is named in the output');
out(`THE BASIS, BLANK AND OMITTED. Typed blank ('') the basis is refused (the probe table above). OMITTED from the call, the engine takes ${omitBasis.fillRatioBasis} and names it in its output: fillRatioBasis ${omitBasis.fillRatioBasis}, usableTonnes ${fx(omitBasis.usableTonnes)} at a fill limit of ${inp(noBasis.maxFillRatio)}.`);

/* ------------------------------------------------------------------ */
section('THE VAPORIZER: THREE TERMS AND THE BOILING POINT AT PRESSURE');
fnLabel('lpgCng.vaporizerDuty');
const V = T.KANO_VAPORIZER;
const kv = must(L.vaporizerDuty({ ...V, latentHeatKJkg: kb.latentHeatKJkg }), 'KANO vaporizer');
out(`KANO's vaporizer: ${inp(V.massFlowKgHr)} kg/h of the blend (latent heat ${fx(kb.latentHeatKJkg)} kJ/kg, from the blend on mass), liquid in at ${inp(V.inletTempC)} C (liquid heat capacity ${inp(V.liquidCpKJkgK)} kJ/kg K), boiling at ${inp(V.boilingPointC)} C at the vaporizer's pressure, vapour out at ${inp(V.outletTempC)} C (vapour heat capacity ${inp(V.vapourCpKJkgK)} kJ/kg K), design margin ${inp(V.designMarginPercent)} percent.`);
out('');
head('term', 'kW', 'share of the duty');
for (const t of kv.terms) row(t.label, fx(t.kW), fx(t.share));
row('dutyKW', fx(kv.dutyKW), fx(1));
row('designDutyKW (with the margin)', fx(kv.designDutyKW), '');
out('');
const termsByHand = [V.massFlowKgHr * V.liquidCpKJkgK * (V.boilingPointC - V.inletTempC), V.massFlowKgHr * kb.latentHeatKJkg, V.massFlowKgHr * V.vapourCpKJkgK * (V.outletTempC - V.boilingPointC)].map((x) => x / L.KJ_PER_KWH);
claim(termsByHand.every((x, i) => Math.abs(x - kv.terms[i].kW) < 1e-5) && Math.abs(kv.designDutyKW - kv.dutyKW * (1 + V.designMarginPercent / 100)) < 1e-5, 'the three terms and the margin reproduce the engine');
out('The terms, each in kJ an hour over KJ_PER_KWH: warm the liquid is the mass flow times the liquid heat capacity times (boiling point less inlet); boil it is the mass flow times the latent heat; superheat is the mass flow times the vapour heat capacity times (outlet less boiling point). designDutyKW is dutyKW times one plus the margin percent over 100.');
out('');
const floorV = must(L.vaporizerDuty({ ...V, boilingPointC: null, latentHeatKJkg: kb.latentHeatKJkg }), 'no bp');
out(`With the boiling point left blank the engine gives the boil alone: dutyKW ${fx(floorV.dutyKW)}, missingTerms ${list(floorV.missingTerms)}, and the note "${floorV.note}"`);
out('');
out(`The boiling point that matters is the one at the vaporizer's pressure. n-butane's typical ATMOSPHERIC boiling point in LPG_REFERENCE is ${inp(lpgRef.butane.typicalBoilingPointC)} C; typed as the boiling point for a liquid entering at ${inp(V.inletTempC)} C, it is refused:`);
head('probe', 'engine');
row(`boiling point ${inp(lpgRef.butane.typicalBoilingPointC)} C, liquid in at ${inp(V.inletTempC)} C`, refused(L.vaporizerDuty({ ...V, boilingPointC: lpgRef.butane.typicalBoilingPointC, latentHeatKJkg: kb.latentHeatKJkg }), 'atm bp'));
row(`vapour out at 30 C, below the ${inp(V.boilingPointC)} C boiling point`, refused(L.vaporizerDuty({ ...V, outletTempC: 30, latentHeatKJkg: kb.latentHeatKJkg }), 'outlet below'));
row('no latent heat', refused(L.vaporizerDuty({ ...V }), 'no latent'));
row('a design margin of -5 percent', refused(L.vaporizerDuty({ ...V, designMarginPercent: -5, latentHeatKJkg: kb.latentHeatKJkg }), 'neg margin'));

/* ------------------------------------------------------------------ */
section('THE CAROUSEL IS A QUEUE, ON THE POSITIONS WHOLLY WORKING');
fnLabel('lpgCng.bottlingPlant (it calls terminalDepot.rackQueue)');
const B = T.KANO_BOTTLING;
const kq = must(L.bottlingPlant(B), 'KANO carousel');
out(`KANO fills ${inp(B.cylindersPerDay)} cylinders over a ${inp(B.shiftHoursPerDay)} hour shift, ${inp(B.fillMinutesPerCylinder)} minutes a cylinder, on ${inp(B.positions)} positions each available ${inp(B.availabilityFraction)} of the time. The carousel is the loading-rack queue (Erlang C) run on the positions wholly working: the floor of the positions times the availability.`);
out('');
head('field', 'value');
row('arrivalsPerHour', fx(kq.arrivalsPerHour));
row('effectivePositions', fx(kq.effectivePositions));
row('queuePositions', inp(kq.queuePositions));
row('positionRoundingNote', kq.positionRoundingNote);
row('the positions rounded to the nearest whole one (the shortcut the engine does not take)', inp(Math.round(kq.effectivePositions)));
row('minimumPositionsForThroughput', inp(kq.minimumPositionsForThroughput));
row('queue offered (erlangs)', fx(kq.queue.offered));
row('queue utilisation', fx(kq.queue.utilisation));
row('queue probabilityOfWaiting', fx(kq.queue.probabilityOfWaiting));
row('queue averageWaitMinutes', fx(kq.queue.averageWaitMinutes));
row('queue queueLength', fx(kq.queue.queueLength));
row('throughputCapacityPerDay', fx(kq.throughputCapacityPerDay));
row('meetsDemand', yesNo(kq.meetsDemand));
out('');
out(`The engine's note: "${kq.note}"`);
out('');
out('The same carousel run on other whole numbers of positions, to show what the count does to the wait (availability set to 1 so the count is the count typed):');
head('positions (input)', 'probabilityOfWaiting', 'averageWaitMinutes');
for (const n of [kq.queuePositions, kq.queuePositions + 1, B.positions]) {
  const r = must(L.bottlingPlant({ ...B, positions: n, availabilityFraction: 1 }), 'positions sweep');
  row(inp(n), fx(r.queue.probabilityOfWaiting), fx(r.queue.averageWaitMinutes));
}
out('');
const suiteQ = must(L.bottlingPlant(T.SUITE_ROLLOUT.bottling), 'studio carousel');
out(`The studio's opening carousel (${inp(T.SUITE_ROLLOUT.bottling.cylindersPerDay)} a day, ${inp(T.SUITE_ROLLOUT.bottling.fillMinutesPerCylinder)} minutes, ${inp(T.SUITE_ROLLOUT.bottling.positions)} positions at ${inp(T.SUITE_ROLLOUT.bottling.availabilityFraction)}, ${inp(T.SUITE_ROLLOUT.bottling.shiftHoursPerDay)} hours): effectivePositions ${fx(suiteQ.effectivePositions)}, queuePositions ${inp(suiteQ.queuePositions)}, averageWaitMinutes ${fx(suiteQ.queue.averageWaitMinutes)}.`);
out('');
head('probe', 'engine');
row('one position at availability 0.4', refused(L.bottlingPlant({ ...B, positions: 1, availabilityFraction: 0.4 }), 'fewer than one'));
row('shift hours left blank (\'\')', refused(L.bottlingPlant({ ...B, shiftHoursPerDay: '' }), 'blank shift'));
row('availability 1.2', refused(L.bottlingPlant({ ...B, availabilityFraction: 1.2 }), 'avail > 1'));
row('no fill time', refused(L.bottlingPlant({ ...B, fillMinutesPerCylinder: '' }), 'no fill time'));

/* ------------------------------------------------------------------ */
section('CYLINDERS AND TRAILERS IN CIRCULATION: LITTLE\'S LAW');
fnLabel('lpgCng.assetFloat');
const kf = must(L.assetFloat({ unitsPerDay: B.cylindersPerDay, cycleStages: T.KANO_CYLINDER_CYCLE, sparesFraction: T.KANO_CYLINDER_SPARES }), 'cylinders');
const tf = must(L.assetFloat({ unitsPerDay: T.IBAFO_TRAILER_TRIPS, cycleStages: T.IBAFO_TRAILER_CYCLE, sparesFraction: T.IBAFO_TRAILER_SPARES }), 'trailers');
out(`Assets in the system = throughput times time in the system. The cycle is the sum of its stage days, and the fleet is the ceiling of (the assets in circulation plus the spares allowance), the spares allowance being the assets in circulation times the spares fraction. KANO's cylinders: ${inp(B.cylindersPerDay)} a day, spares ${inp(T.KANO_CYLINDER_SPARES)}. IBAFO's trailers to its daughter stations: ${inp(T.IBAFO_TRAILER_TRIPS)} trips a day, spares ${inp(T.IBAFO_TRAILER_SPARES)}.`);
for (const [f, cyc, rate, sp] of [[kf, T.KANO_CYLINDER_CYCLE, B.cylindersPerDay, T.KANO_CYLINDER_SPARES], [tf, T.IBAFO_TRAILER_CYCLE, T.IBAFO_TRAILER_TRIPS, T.IBAFO_TRAILER_SPARES]]) {
  const days = cyc.reduce((a, x) => a + x.days, 0);
  claim(Math.abs(days - f.cycleDays) < 1e-9 && f.fleetRequired === Math.ceil(rate * days * (1 + sp)), 'the cycle is the sum of the stages and the fleet the ceiling of the sum');
}
out('');
for (const [name, f, cyc] of [['KANO cylinders', kf, T.KANO_CYLINDER_CYCLE], ['IBAFO trailers', tf, T.IBAFO_TRAILER_CYCLE]]) {
  head(`${name}: stage (input)`, 'days (input)', 'share of the cycle');
  f.stages.forEach((s, i) => row(s.label, inp(cyc[i].days), fx(s.share)));
  out('');
  head(`${name}: field`, 'value');
  row('cycleDays', fx(f.cycleDays));
  row('inCirculation', fx(f.inCirculation));
  row('sparesAllowance', fx(f.sparesAllowance));
  row('fleetRequired', inp(f.fleetRequired));
  row('spareCapacityUnits (what the ceiling adds)', fx(f.spareCapacityUnits));
  row('dominantStage', f.dominantStage);
  out('');
}
out(`The basis sentence: "${kf.basis}"`);
out('');
head('probe', 'engine');
row('KANO\'s cycle with "At the customer" left blank', refused(L.assetFloat({ unitsPerDay: B.cylindersPerDay, cycleStages: T.KANO_CYLINDER_CYCLE.map((s, i) => (i === 0 ? { ...s, days: '' } : s)), sparesFraction: T.KANO_CYLINDER_SPARES }), 'blank stage'));
row('no stages', refused(L.assetFloat({ unitsPerDay: 10, cycleStages: [] }), 'no stages'));
row('a negative spares allowance', refused(L.assetFloat({ unitsPerDay: 10, cycleStages: [{ label: 'x', days: 1 }], sparesFraction: -0.1 }), 'neg spares'));

/* ------------------------------------------------------------------ */
section('GAS IN A BANK: REAL GAS, IDEAL GAS, GAUGE AND ABSOLUTE');
fnLabel('lpgCng.gasMassInVessel, PRESSURE_BASIS, DAK_RANGE');
const G = T.IBAFO_GAS;
out(`Every pressure in lpgCng is absolute. The engine says so on every CNG result: pressureBasis "${L.PRESSURE_BASIS}". IBAFO's banks hold gas of specific gravity ${inp(G.gasSg)} at ${inp(G.temperatureC)} C. The mass is m = P V M over Z R T, with Z by Dranchuk-Abou-Kassem on Sutton pseudo-criticals: P the pressure in Pa (bar(a) times 100000), V the volume in m3, M the gas's molar mass (its specific gravity times the molar mass of air, in kg/kmol), T the temperature in K, R the gas constant, and the ideal mass is the same with Z taken as one.`);
out('');
const bankRows = T.IBAFO_BANKS.map((b) => ({ b, r: must(L.gasMassInVessel({ volumeM3: b.volumeM3, pressureBar: b.pressureBar, ...G }), b.label) }));
head('bank', 'volume m3 (input)', 'pressure bar(a) (input)', 'z', 'ppr', 'tpr', 'correlationInRange', 'massKg', 'idealMassKg', 'realVersusIdeal');
for (const { b, r } of bankRows) row(b.label, inp(b.volumeM3), inp(b.pressureBar), fx(r.z), fx(r.ppr), fx(r.tpr), yesNo(r.correlationInRange), fx(r.massKg), fx(r.idealMassKg), fx(r.realVersusIdeal));
claim(bankRows.every(({ r }) => r.realVersusIdeal > 1 && r.z < 1), 'Z is below one and the ideal gas law understates every bank');
out('');
out('At these pressures Z is below one, so every bank holds more gas than the ideal gas law says (realVersusIdeal above one).');
out('');
const Gg = T.IBAFO_GAUGE;
const asGauge = must(L.gasMassInVessel({ volumeM3: Gg.volumeM3, pressureBar: Gg.gaugeBar, ...G }), 'gauge as abs');
const asAbs = must(L.gasMassInVessel({ volumeM3: Gg.volumeM3, pressureBar: Gg.gaugeBar + Gg.atmosphereBar, ...G }), 'abs');
out(`GAUGE AND ABSOLUTE. A bank reads ${inp(Gg.gaugeBar)} bar on its gauge; the site's atmosphere is taken as ${inp(Gg.atmosphereBar)} bar(a).`);
head('pressure given to the engine', 'bar(a)', 'massKg');
row('the gauge reading typed as if absolute', inp(Gg.gaugeBar), fx(asGauge.massKg));
row('gauge plus atmosphere', fx(Gg.gaugeBar + Gg.atmosphereBar), fx(asAbs.massKg));
row('absolute minus gauge-as-absolute', fx(Gg.atmosphereBar), fx(asAbs.massKg - asGauge.massKg));
out('');
out(`THE CORRELATION'S RANGE. DAK_RANGE: ppr ${inp(L.DAK_RANGE.pprMin)} to ${inp(L.DAK_RANGE.pprMax)}, tpr ${inp(L.DAK_RANGE.tprMin)} to ${inp(L.DAK_RANGE.tprMax)}. Outside it the engine still answers and says so:`);
const cold = must(L.gasMassInVessel({ volumeM3: 2, pressureBar: 250, temperatureC: -80, gasSg: G.gasSg }), 'cold');
head('probe', 'tpr', 'correlationInRange', 'correlationNote');
row('the Low bank at -80 C', fx(cold.tpr), yesNo(cold.correlationInRange), cold.correlationNote);
out('');
head('probe', 'engine');
row('no pressure', refused(L.gasMassInVessel({ volumeM3: 2, pressureBar: '', ...G }), 'no p'));
row('gas gravity left blank (\'\')', refused(L.gasMassInVessel({ volumeM3: 2, pressureBar: 250, temperatureC: 30, gasSg: '' }), 'blank sg'));
row('no temperature', refused(L.gasMassInVessel({ volumeM3: 2, pressureBar: 250, temperatureC: '', gasSg: 0.62 }), 'no t'));

/* ------------------------------------------------------------------ */
section('THE CASCADE: EQUALISING BANK BY BANK');
fnLabel('lpgCng.cascadeFills');
const Vh = T.IBAFO_VEHICLE;
const kc = must(L.cascadeFills({ banks: T.IBAFO_BANKS, ...Vh, ...G }), 'IBAFO cascade');
out(`IBAFO's cascade: ${T.IBAFO_BANKS.map((b) => `${b.label} ${inp(b.volumeM3)} m3 at ${inp(b.pressureBar)} bar(a)`).join(', ')}. The gas is IBAFO's, specific gravity ${inp(G.gasSg)} at ${inp(G.temperatureC)} C. A bus tank of ${inp(Vh.vehicleTankM3)} m3 arrives at ${inp(Vh.vehicleStartBar)} bar(a) and is filled to ${inp(Vh.vehicleTargetBar)} bar(a). Each vehicle equalises with the lowest bank above it, then the next bank up, until it reaches its target; the engine counts whole fills until the next vehicle cannot reach its target.`);
out('');
head('field', 'value');
row('kgPerFill', fx(kc.kgPerFill));
row('fillsBeforeRecharge', inp(kc.fillsBeforeRecharge));
row('deliveredKg', t3(kc.deliveredKg));
row('storedKg', t3(kc.storedKg));
row('the Low, Mid and High bank masses summed (SECTION 30)', t3(bankRows.reduce((a, x) => a + x.r.massKg, 0)));
claim(Math.abs(bankRows.reduce((a, x) => a + x.r.massKg, 0) - kc.storedKg) < 0.002, 'storedKg is the sum of the bank masses');
row('leftInBanksKg', t3(kc.leftInBanksKg));
row('storedKg minus deliveredKg minus leftInBanksKg', t3(kc.storedKg - kc.deliveredKg - kc.leftInBanksKg));
row('cascadeEfficiency (delivered over stored)', fx(kc.cascadeEfficiency));
row('nextVehicleReachesBar', fx(kc.nextVehicleReachesBar));
row('hitFillLimit', yesNo(kc.hitFillLimit));
row('pressureBasis', kc.pressureBasis);
claim(Math.abs(kc.storedKg - kc.deliveredKg - kc.leftInBanksKg) < 0.002, 'the cascade conserves the gas');
claim(kc.nextVehicleReachesBar < Vh.vehicleTargetBar, 'the next vehicle stops short of its target');
out('');
out('The gas is conserved: what the banks held is what was delivered plus what is left in them.');
out('hitFillLimit reads true only when the count reaches the maxFills cap the call carries; here it stopped on a vehicle that could not reach its target.');
out('');
head('bank', 'startBar', 'endBar');
for (const b of kc.banksAfter) row(b.label, fx(b.startBar), fx(b.endBar));
out('');
out('The first fills and the last, with the banks each one drew on (lowest first):');
head('fill', 'banks used');
for (const f of [...kc.fills.slice(0, 3), ...kc.fills.slice(-2)]) row(inp(f.fill), f.banks.join(', '));
out('');
out(`The engine's note: "${kc.note}"`);
out('');
const oneBank = must(L.cascadeFills({ banks: [{ label: 'One bank', volumeM3: T.IBAFO_BANKS.reduce((s, b) => s + b.volumeM3, 0), pressureBar: T.IBAFO_BANKS[1].pressureBar }], ...Vh, ...G }), 'one bank');
out(`WHY THREE BANKS. The same ${fx(T.IBAFO_BANKS.reduce((s, b) => s + b.volumeM3, 0))} m3 as one bank at ${inp(T.IBAFO_BANKS[1].pressureBar)} bar(a): fillsBeforeRecharge ${inp(oneBank.fillsBeforeRecharge)}, cascadeEfficiency ${fx(oneBank.cascadeEfficiency)}, leftInBanksKg ${t3(oneBank.leftInBanksKg)}.`);
out('');
const sk = must(L.cascadeFills({ banks: T.SUITE_ROLLOUT.banks, vehicleTankM3: T.SUITE_ROLLOUT.vehicleTankM3, vehicleStartBar: T.SUITE_ROLLOUT.vehicleStartBar, vehicleTargetBar: T.SUITE_ROLLOUT.vehicleTargetBar, temperatureC: T.SUITE_ROLLOUT.temperatureC, gasSg: T.SUITE_ROLLOUT.gasSg }), 'studio cascade');
out(`The studio's opening cascade (three 1.5 m3 banks at 250 bar(a), a 0.08 m3 vehicle from 20 to 200, gas ${inp(T.SUITE_ROLLOUT.gasSg)} at ${inp(T.SUITE_ROLLOUT.temperatureC)} C): fillsBeforeRecharge ${inp(sk.fillsBeforeRecharge)}, cascadeEfficiency ${fx(sk.cascadeEfficiency)}, leftInBanksKg ${t3(sk.leftInBanksKg)}, nextVehicleReachesBar ${fx(sk.nextVehicleReachesBar)}.`);
out('');
out('Both engine and oracle are isothermal: the heat of a fast fill is not modelled, so a real fill settles lower and the count is a ceiling in that one respect.');
out('');
head('probe', 'engine');
row('a target below the start', refused(L.cascadeFills({ banks: T.IBAFO_BANKS, vehicleTankM3: 0.1, vehicleStartBar: 200, vehicleTargetBar: 25, ...G }), 'target below'));
row('no banks', refused(L.cascadeFills({ banks: [], ...Vh, ...G }), 'no banks'));
row('a bank with no pressure', refused(L.cascadeFills({ banks: [{ label: 'Low', volumeM3: 2, pressureBar: '' }], ...Vh, ...G }), 'bank no p'));
row('temperature left blank (\'\')', refused(L.cascadeFills({ banks: T.IBAFO_BANKS, ...Vh, gasSg: G.gasSg, temperatureC: '' }), 'blank t'));

/* ------------------------------------------------------------------ */
section('THE COMPRESSOR AS A UNIT BRIDGE');
fnLabel('lpgCng.cngCompression (it calls facilities/compression.compressorTrain)');
const Cm = T.IBAFO_COMPRESSION;
const kcm = must(L.cngCompression({ ...Cm, gasSg: G.gasSg }), 'compression');
out(`cngCompression does not compute compression itself. It converts the station's metric inputs to the field units the Facilities compression engine speaks, calls it, and converts the answer back. The thermodynamics belong to the Facilities course and are not graded here. IBAFO's compressor: ${inp(Cm.throughputKgPerHour)} kg/h of gas ${inp(G.gasSg)}, suction ${inp(Cm.suctionBar)} bar(a) at ${inp(Cm.suctionTempC)} C, discharge ${inp(Cm.dischargeBar)} bar(a).`);
out('');
head('bridge', 'value');
row('qMMscfd (the throughput as standard volume)', fx(kcm.qMMscfd));
row('suction, psia', fx(Cm.suctionBar * L.PSI_PER_BAR));
row('stageCount', inp(kcm.stageCount));
row('pressureBasis', kcm.pressureBasis);
row('basis', kcm.basis);
out('');
head('stage', 'suction bar(a)', 'discharge bar(a)', 'ratio');
for (const s of kcm.stages) row(inp(s.stage), fx(s.suctionBar), fx(s.dischargeBar), fx(s.ratio));
out('');
head('probe', 'engine');
row('discharge below suction', refused(L.cngCompression({ ...Cm, dischargeBar: 3, gasSg: G.gasSg }), 'dis below'));
row('no throughput', refused(L.cngCompression({ ...Cm, throughputKgPerHour: '', gasSg: G.gasSg }), 'no q'));

/* ------------------------------------------------------------------ */
section('THE FORECOURT QUEUE');
fnLabel('lpgCng.cngDispensing (it calls terminalDepot.rackQueue)');
const D = T.IBAFO_DISPENSING;
out(`A CNG forecourt is the same queue as the carousel and the loading rack. IBAFO: ${inp(D.vehiclesPerHour)} buses an hour, ${inp(D.fillMinutes)} minutes a fill, each fill the cascade's ${fx(kc.kgPerFill)} kg.`);
head('dispensers (input)', 'utilisation', 'probabilityOfWaiting', 'averageWaitMinutes', 'kgPerHour');
for (const n of D.dispenserCounts) {
  const r = must(L.cngDispensing({ vehiclesPerHour: D.vehiclesPerHour, fillMinutes: D.fillMinutes, dispensers: n, kgPerFill: kc.kgPerFill }), `dispensing ${n}`);
  row(inp(n), fx(r.queue.utilisation), fx(r.queue.probabilityOfWaiting), fx(r.queue.averageWaitMinutes), fx(r.kgPerHour));
}
const over = L.cngDispensing({ vehiclesPerHour: 25, fillMinutes: D.fillMinutes, dispensers: 2 });
out('');
out(`At 25 buses an hour on 2 dispensers the forecourt cannot keep up. The engine gives an answer and no refusal: stable ${yesNo(over.queue.stable)}, utilisation ${fx(over.queue.utilisation)}, and the queue's message "${over.queue.error}"`);
claim(!over.error && over.queue.stable === false, 'an overloaded forecourt is an answer');
out('');
head('probe', 'engine');
row('2.5 dispensers', refused(L.cngDispensing({ vehiclesPerHour: D.vehiclesPerHour, fillMinutes: D.fillMinutes, dispensers: 2.5 }), 'half dispenser'));
row('no fill time', refused(L.cngDispensing({ vehiclesPerHour: D.vehiclesPerHour, fillMinutes: '', dispensers: 2 }), 'no fill'));
out('');
out(`The engine's note: "${must(L.cngDispensing({ vehiclesPerHour: D.vehiclesPerHour, fillMinutes: D.fillMinutes, dispensers: 2 }), 'note').note}"`);

/* ------------------------------------------------------------------ */
section('THE CUSTOMER\'S SWITCH: COST PER KILOMETRE AND SIMPLE PAYBACK');
fnLabel('lpgCng.conversionEconomics');
const X = T.IBAFO_CONVERSION;
const kx = must(L.conversionEconomics(X), 'conversion');
out(`A Lagos bus covering ${inp(X.annualDistanceKm)} km a year on ${inp(X.baseFuel.consumptionPer100Km)} litres of PMS per 100 km at ${inp(X.baseFuel.pricePerUnit)} naira a litre (${inp(X.baseFuel.energyPerUnitMJ)} MJ a litre). CNG at ${inp(X.newFuel.pricePerUnit)} naira a kg (${inp(X.newFuel.energyPerUnitMJ)} MJ a kg); no consumption on CNG is measured, and the converted engine turns CNG energy into distance ${inp(X.newFuel.efficiencyRatio)} times as well as PMS energy. Conversion ${inp(X.conversionCost)} naira; extra maintenance ${inp(X.annualExtraMaintenance)} naira a year. Emission factors ${inp(X.baseFuel.emissionFactorKgCo2ePerUnit)} kg CO2e a litre of PMS and ${inp(X.newFuel.emissionFactorKgCo2ePerUnit)} a kg of CNG (illustrative).`);
out('');
head('field', 'value');
row('consumptionSource', kx.consumptionSource);
row('newFuelConsumptionPer100Km (kg)', fx(kx.newFuelConsumptionPer100Km));
row('PMS litres a year', fx(kx.baseFuel.unitsPerYear));
row('PMS cost a year', fx(kx.baseFuel.costPerYear));
row('PMS cost per km', fx(kx.baseFuel.costPerKm));
row('CNG kg a year', fx(kx.newFuel.unitsPerYear));
row('CNG cost a year', fx(kx.newFuel.costPerYear));
row('CNG cost per km', fx(kx.newFuel.costPerKm));
row('annualSaving (after maintenance)', fx(kx.annualSaving));
row('savingPerKm', fx(kx.savingPerKm));
row('simplePaybackYears', fx(kx.simplePaybackYears));
row('conversion cost over annualSaving', fx(X.conversionCost / kx.annualSaving));
row('PMS consumption x PMS energy over (CNG energy x efficiency ratio)', fx((X.baseFuel.consumptionPer100Km * X.baseFuel.energyPerUnitMJ) / (X.newFuel.energyPerUnitMJ * X.newFuel.efficiencyRatio)));
row('kgCo2eAvoidedPerYear', fx(kx.kgCo2eAvoidedPerYear));
row('paybackNote', kx.paybackNote);
out('');
out('The efficiency ratio moves the answer. The same bus at other ratios:');
head('efficiency ratio (input)', 'newFuelConsumptionPer100Km', 'annualSaving', 'simplePaybackYears');
for (const e of [0.8, X.newFuel.efficiencyRatio, 1]) {
  const r = must(L.conversionEconomics({ ...X, newFuel: { ...X.newFuel, efficiencyRatio: e } }), 'ratio sweep');
  row(inp(e), fx(r.newFuelConsumptionPer100Km), fx(r.annualSaving), fx(r.simplePaybackYears));
}
const measured = must(L.conversionEconomics({ ...X, newFuel: { ...X.newFuel, consumptionPer100Km: 9.5 } }), 'measured');
out('');
out(`With a measured CNG consumption of 9.5 kg per 100 km the engine uses it: consumptionSource "${measured.consumptionSource}", simplePaybackYears ${fx(measured.simplePaybackYears)}.`);
const pricey = must(L.conversionEconomics({ ...X, newFuel: { ...X.newFuel, pricePerUnit: 1100 } }), 'no saving');
claim(pricey.annualSaving <= 0 && pricey.simplePaybackYears === null, 'at 1100 naira a kg there is no saving and no payback');
out(`With CNG at 1100 naira a kg there is no saving: annualSaving ${fx(pricey.annualSaving)}, simplePaybackYears ${blankOr(pricey.simplePaybackYears)}, and the note "${pricey.paybackNote}"`);
out('');
head('probe', 'engine');
row('no measured consumption and the efficiency ratio left blank', refused(L.conversionEconomics({ ...X, newFuel: { ...X.newFuel, efficiencyRatio: '' } }), 'no ratio'));
row('no annual distance', refused(L.conversionEconomics({ ...X, annualDistanceKm: '' }), 'no km'));
out('');
out('The payback is simple and undiscounted. The annual cash flow the engine hands on:');
head('annualCashFlow', 'value');
row('year0', fx(kx.annualCashFlow.year0));
row('recurring', fx(kx.annualCashFlow.recurring));

/* ------------------------------------------------------------------ */
section('HELD LIMITS AND WHAT THE ORACLES CHECK');
fnLabel('none: stated limits');
out('HELD, taught as stated limits and never computed with:');
out('- The flare efficiencies have no default: the rule\'s tiered defaults are a United States rule, and the basis for a Nigerian study is a regulation reading.');
out('- An unlit flare is not modelled: gas sent to an unlit flare is vented, all of it methane.');
out('- Fill limits by code (NFPA 58, EN or NUPRC practice) are not shipped: the limit is a safety code value, typed by the site with its basis.');
out('- GWP values and credit prices are case inputs.');
out('');
out('PINNED, NOT VALIDATED: the component heating values and liquid densities, the typical LPG densities and latent heats, the DAK and Sutton coefficients, the form of the rule\'s equations as their variable definitions fix it, and water at 15 C for a filling density.');
out('');
out('What the validation oracles check, independently of the engines (oracle_flaretovalue.py and oracle_lpgcng.py): the gas in exact rationals in kilograms and cubic metres; the flare by the rule by moles, cross-checked by the rule\'s volumetric route; Z by bisection on reduced density with a second correlation as a plausibility check; the cascade as a mass ledger with conservation asserted; Erlang C in exact rationals on the positions wholly working; ledgers for the blend, storage, vaporizer, floats and the switch. The compressor train\'s thermodynamics are the Facilities engine\'s and are validated there; only the unit bridge is checked here.');

/* ------------------------------------------------------------------ */
section('THE KANO AND IBAFO ROLLOUT END TO END');
fnLabel('lpgCng, the figures above');
head('step', 'figure');
row('KANO blend density, kg/m3', fx(kb.densityKgM3));
row('KANO usable LPG at a 0.85 liquid fill, t', fx(storeK[0].usableTonnes));
row('KANO cover, days', fx(storeK[0].coverDays));
row('KANO vaporizer design duty, kW', fx(kv.designDutyKW));
row('KANO carousel positions wholly working', inp(kq.queuePositions));
row('KANO carousel average wait, minutes', fx(kq.queue.averageWaitMinutes));
row('KANO cylinders required', inp(kf.fleetRequired));
row('IBAFO Mid bank, kg', fx(bankRows[1].r.massKg));
row('IBAFO fills before recharge', inp(kc.fillsBeforeRecharge));
row('IBAFO left in the banks, kg', t3(kc.leftInBanksKg));
row('IBAFO trailers required', inp(tf.fleetRequired));
row('IBAFO bus simple payback, years', fx(kx.simplePaybackYears));

/* ------------------------------------------------------------------ */
out('');
out(`# Refusals printed in this digest, each asserted against the engine before it was printed: ${refusedCount}.`);
if (sectionNo !== Object.keys(SECTION_OWNERS).length) throw new Error(`SECTION OWNERS: ${sectionNo} sections printed, ${Object.keys(SECTION_OWNERS).length} owner rows`);
// gate_repro.sh's negative control, never set in a build: one line that reads
// the local zone, so the four-zone sweep is shown able to see a zone read.
if (process.env.ET_PLANT_TZ) out(`planted zone read: ${new Intl.DateTimeFormat('en', { timeZoneName: 'shortOffset' }).formatToParts(0).find((p) => p.type === 'timeZoneName').value}`);
process.stdout.write(`${Lines.join('\n')}\n`);
