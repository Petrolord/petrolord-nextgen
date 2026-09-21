// THE H4 TEACHING DIGEST. This is the ONLY teaching truth for every writer
// after this file: the lesson author, the bank author, the key-truth author and
// the panel author all quote from digest.txt and from nothing else.
//
// THE ENGINE'S FINDINGS RECORD IS NOT TEACHING TRUTH. FINDINGS-consequence.md,
// the oracle and the engine's own source comments are PROVENANCE. Where a
// figure in FINDINGS is teachable (a Yellow Book worked example, a Purple Book
// table, an OSD/30 row, an erratum in a source) this file recomputes it through
// the engine or reads it from the vendored golden and prints it, and a writer
// quotes the digest line.
//
// Usage:  sh /root/hse-wip-consequence/build_digest.sh > digest.tmp \
//           && mv digest.tmp /root/hse-wip-consequence/digest.txt
// Build THROUGH A TEMP FILE. A gate that reads a half written digest finds no
// literals and clears everything.
//
// EVERY NUMBER PRINTED HERE IS A RETURN VALUE OF THE ENGINE, except where a
// line says "golden" (read from the vendored case file), "stated" (an input
// named on the same row) or "derived" (arithmetic on engine values printed in
// the same block, with the arithmetic stated). Nothing here reads a clock, a
// random number, a locale or a network, and TZ and LC_ALL are pinned by
// build_digest.sh.
//
// THE DIGEST RULE. A sentence here may NAME a figure this file computes. It may
// NOT characterise the RELATIONSHIP between two figures unless that
// relationship is itself computed and asserted on the same page.
//
// EVERY LABEL IS ASSERTED AGAINST WHAT THE CALL ACTUALLY DID. `refusal()`
// asserts an error key and the field it names; `success()` asserts no error key
// and every top-level number finite; every claim a sentence makes about a
// table goes through `must()`. If one assertion fails NOTHING IS WRITTEN.
//
// THE DIGEST IS NOT THE CAPSTONE. This file never reads h4_capstone.mjs,
// fields.json or the capstone scenarios, and the capstone never reads this.
//
// THIS ENGINE HAS NO REPAIR HISTORY, so no section of this digest describes
// former engine behaviour. The errata taught here are facts about published
// sources.
import fs from 'node:fs';
import process from 'node:process';
import { execFileSync } from 'node:child_process';
import * as T from './h4_fields.mjs';

const HERE = process.env.H4_WAVE_DIR || '/root/hse-wip-consequence';
const ROOT = process.env.H4_ENGINES || '/root/wt-h4-nextgen/packages/engines';
const ENGINE_REL = 'engines/hse/consequence.js';
const C = await import(`${ROOT}/${ENGINE_REL}`);
const ENGINE_SRC = fs.readFileSync(`${ROOT}/${ENGINE_REL}`, 'utf8');
const GOLD = JSON.parse(fs.readFileSync(`${ROOT}/test-data/hse/goldens/consequence_cases.json`, 'utf8'));
const MODULES = JSON.parse(execFileSync('python3', [`${HERE}/structure.py`, '--modules'], { encoding: 'utf8' }));

/* ---------------------------------------------------------- the machinery */

const OUT = [];
const w = (s = '') => OUT.push(s);
const ASSERTS = [];
const must = (claim, cond, detail) => {
  ASSERTS.push({ claim, pass: !!cond, detail: String(detail) });
  return !!cond;
};
const success = (label, r) => {
  must(`LABELLED A SUCCESS: ${label}`, !!(r && !r.error), r && r.error ? r.error : 'no error key');
  if (r && !r.error) {
    const bad = Object.entries(r).filter(([, v]) => typeof v === 'number' && !Number.isFinite(v));
    must(`SUCCESS CARRIES NO NON-FINITE NUMBER: ${label}`, bad.length === 0,
      bad.map(([k, v]) => `${k}=${v}`).join(', ') || 'every number finite');
  }
  return r || {};
};
const refusal = (label, r, field) => {
  must(`LABELLED A REFUSAL: ${label}`, !!(r && r.error), r && r.error ? 'refused' : `returned ${JSON.stringify(r).slice(0, 80)}`);
  must(`THE REFUSAL NAMES ${field}: ${label}`, r && r.field === field, r && r.field);
  const nums = r ? Object.values(r).filter((v) => typeof v === 'number') : [];
  must(`A REFUSAL CARRIES NO NUMBER: ${label}`, nums.length === 0, nums.join(','));
  return r || {};
};
const f6 = (x) => (x === null || x === undefined ? String(x) : Number(x).toFixed(6));
const f12 = (x) => (x === null || x === undefined ? String(x) : Number(x).toFixed(12));
const rel = (a, b) => (b === 0 ? Math.abs(a) : Math.abs(a - b) / Math.abs(b));
const relE = (a, b) => { const r = rel(a, b); return r === 0 ? '0' : r.toExponential(2); };
const pct = (x) => `${(100 * x).toFixed(2)} percent`;
const ex = (x) => String(x);

const ownerClause = (owners) => owners.map((o) => {
  const m = o.match(/^(Associate|Professional|Expert) (m\d{2})(?: (l\d{2}))?$/);
  if (!must(`owner "${o}" is well formed`, !!m, o)) return o;
  const mod = MODULES[m[1]] && MODULES[m[1]][m[2]];
  must(`owner "${o}" names a module structure.py has`, !!mod, o);
  if (m[3]) must(`owner "${o}" names a lesson structure.py has`, mod && mod.lessons.includes(m[3]), o);
  return o;
}).join(' and ');
const ORDER = ['computes', 'units', 'refusals', 'sources', 'liquid', 'gas', 'critical', 'pools', 'evaporation',
  'sigmas', 'plume', 'conversion', 'reach',
  'burning', 'flamelength', 'tilt', 'sep', 'viewfactor', 'transmissivity', 'solidflame', 'ybpoolfire', 'seam',
  'tnt', 'kinneygraham', 'blastinverse', 'probitbasics', 'thermal', 'overpressureprobit', 'toxic', 'inverse',
  'notdone', 'singleroute', 'judgement',
  'vocabulary'];
const ref = (key) => {
  const i = ORDER.indexOf(key);
  must(`a sentence refers to a declared section ${key}`, i >= 0, key);
  return `section ${i + 1}`;
};
let SECTION = 0;
const OWNED = new Set();
const section = (key, title, owners) => {
  SECTION += 1;
  must(`section ${key} is declared at position ${SECTION}`, ORDER[SECTION - 1] === key, `${ORDER[SECTION - 1]} at ${SECTION}`);
  owners.forEach((o) => OWNED.add(o.split(' ').slice(0, 2).join(' ')));
  w();
  w(`# SECTION ${SECTION}: ${title} (owned by ${ownerClause(owners)})`);
  w();
};
const table = (head, rows) => {
  w(`| ${head.join(' | ')} |`);
  w(`| ${head.map(() => '---').join(' | ')} |`);
  rows.forEach((r) => w(`| ${r.join(' | ')} |`));
};

/* ================================================================ HEADER */

const engineLines = ENGINE_SRC.replace(/\n$/, '').split('\n').length;
w('# H4 TEACHING DIGEST: Consequence Modelling');
w();
w('# THIS FILE IS THE ONLY TEACHING TRUTH FOR THIS COURSE. Every number in every lesson, bank question, key truth and panel comes from a line below. The engine FINDINGS record, the oracle and the engine source comments are PROVENANCE and not teaching truth.');
w();
w('# PRECISION. Mass rates in kg/s, distances and diameters in m, flame tilt in degrees, concentrations in ppm and mg/m3, heat fluxes and surface emissive powers in W/m2, overpressures in Pa, probit values, thermal doses, toxic loads and lethality probabilities print to SIX decimals; view factors, hole areas, mass transfer coefficients and evaporation fluxes print to TWELVE; stated inputs, temperatures and pressures print as typed; counts are whole numbers; relative differences print in exponent form.');
w();
w(`# ENGINE. ${ENGINE_REL}, vendored sha-identical with petrolord-engines 16fd6c9, ${engineLines} lines. It imports three helpers and restates none of them: the critical pressure ratio from engines/facilities/relief.js, the still air Thomas flame height from engines/facilities/spacing.js and the standard normal CDF from lib/stats/stats.js. The vendored golden test-data/hse/goldens/consequence_cases.json was written by an independent Python oracle.`);
w();
w('# PROPERTIES ARE ILLUSTRATIVE. Every property below is a stated teaching input or a value read from the golden, never data this course recommends.');
w();
w('# WHAT IS NEVER IN THIS FILE. No capstone facility, no capstone input and no graded answer. The capstones run their own facilities and the digest never names them.');
w();
w('# THIS ENGINE HAS NO REPAIR HISTORY. Every section below describes what the engine does today. The errata taught here belong to published sources.');

/* ============================================================ SECTION 1 */

section('computes', 'What this engine computes, and what it declines to compute', ['Associate m01', 'Expert m05']);
w('The engine turns a loss of containment into physical effects: how much gets out, where it goes, what a fire radiates, what a blast does and what fraction of the people exposed a probit says would be harmed. It computes effects and never frequencies. Every function returns either a result object carrying a `basis` block (the model, its source and its units) or an object with `error` and `field`, where `field` names the offending input.');
w();
const EXPORTS = [
  ['liquidOrificeDischarge', 'source terms', 'the liquid mass rate through a hole'],
  ['gasOrificeDischarge', 'source terms', 'the gas mass rate through a hole, choked or subsonic'],
  ['poolFromSpill', 'source terms', 'the pool area, depth and equivalent diameter of a spill'],
  ['poolEvaporationMackayMatsugu', 'source terms', 'the evaporation rate of a pool below its boiling point'],
  ['briggsRuralSigmas', 'dispersion', 'the Briggs rural sigma_y and sigma_z for a Pasquill-Gifford class'],
  ['gaussianPlume', 'dispersion', 'the concentration of a continuous plume at a receptor'],
  ['plumeDistanceToConcentration', 'dispersion', 'the distances at which the centreline concentration meets a target'],
  ['ppmToMgM3', 'dispersion', 'a concentration in ppm converted to mg/m3'],
  ['mgM3ToPpm', 'dispersion', 'a concentration in mg/m3 converted to ppm'],
  ['poolBurningRate', 'fires', 'the burning flux of a pool fire'],
  ['poolFireFlameLength', 'fires', 'the mean flame length, in still air or with wind'],
  ['poolFireTilt', 'fires', 'the flame tilt from the vertical'],
  ['surfaceEmissivePower', 'fires', 'the surface emissive power of the flame'],
  ['cylinderViewFactor', 'fires', 'the view factors of a cylindrical flame at a ground level target'],
  ['atmosphericTransmissivityBagster', 'fires', 'the atmospheric transmissivity by the Bagster fit'],
  ['solidFlameHeatFlux', 'fires', 'the heat flux as surface emissive power times view factor times transmissivity'],
  ['poolFireSolidFlame', 'fires', 'a confined pool fire end to end by the solid flame model'],
  ['solidFlameDistanceForHeatFlux', 'fires', 'the distance at which the solid flame heat flux falls to a target'],
  ['tntEquivalentMass', 'explosions', 'the TNT equivalent mass of a fuel'],
  ['scaledDistance', 'explosions', 'the Hopkinson-Cranz scaled distance'],
  ['kinneyGrahamOverpressure', 'explosions', 'the free air peak side-on overpressure'],
  ['distanceForOverpressure', 'explosions', 'the distance at which a TNT mass gives an overpressure'],
  ['probitToProbability', 'probits', 'the probability a probit value stands for'],
  ['probabilityToProbit', 'probits', 'the probit value of a probability'],
  ['probit', 'probits', 'a probit and its probability from coefficients and a thermal dose or toxic load'],
  ['probitDoseForProbability', 'probits', 'the thermal dose or toxic load at which a probit gives a probability'],
  ['thermalProbit', 'probits', 'a heat radiation lethality probit'],
  ['toxicDose', 'probits', 'the toxic load of a concentration history'],
  ['toxicProbit', 'probits', 'a toxic lethality probit'],
  ['overpressureProbit', 'probits', 'a blast overpressure fatality probit'],
];
EXPORTS.forEach(([name]) => must(`${name} is exported`, typeof C[name] === 'function', typeof C[name]));
table(['function', 'engine section', 'what it returns'], EXPORTS.map(([n, s, r]) => [`\`${n}\``, s, r]));
w();
const constNames = Object.keys(C).filter((k) => typeof C[k] !== 'function').sort();
w(`The constants and tables it exports: ${constNames.map((k) => `\`${k}\``).join(', ')}. The physical constants, as exported:`);
w();
table(['name', 'value'], [
  ['`G_M_S2`', String(C.G_M_S2)], ['`R_J_MOL_K`', String(C.R_J_MOL_K)], ['`ATM_PA`', String(C.ATM_PA)],
  ['`PA_PER_PSI`', String(C.PA_PER_PSI)], ['`MACKAY_MATSUGU_C`', String(C.MACKAY_MATSUGU_C)],
  ['`STABILITY_CLASSES`', C.STABILITY_CLASSES.join(', ')],
  ['`BRIGGS_ADVISORY_RANGE_M`', `${C.BRIGGS_ADVISORY_RANGE_M.min} to ${C.BRIGGS_ADVISORY_RANGE_M.max}`],
  ['`BAGSTER_RANGE_PA_M`', `${C.BAGSTER_RANGE_PA_M.min} to ${C.BAGSTER_RANGE_PA_M.max}`],
  ['`KINNEY_GRAHAM_Z_RANGE`', `${C.KINNEY_GRAHAM_Z_RANGE.min} to ${C.KINNEY_GRAHAM_Z_RANGE.max}`],
]);
must('every exported table is frozen', [C.BRIGGS_RURAL, C.POOL_FIRE_FUELS, C.THERMAL_PROBITS, C.TOXIC_PROBITS,
  C.OVERPRESSURE_PROBITS, C.STABILITY_CLASSES, C.CONSEQUENCE_SOURCES].every(Object.isFrozen), 'frozen');
w();
w('WHAT THE ENGINE DOES NOT EXPORT, checked here against its names:');
const names = Object.keys(C).join(',');
must('no export is a point source radiation model or a setback', !/radiationIntensity|distanceForIntensity|RADIATION_LEVELS|setback/i.test(names), names);
must('no export names a jet fire, a puff, two phase flow or the multi-energy method', !/jet|puff|twoPhase|multiEnergy|kingery/i.test(names), names);
must('no export names a frequency or a risk', !/frequency|risk|fn|pll/i.test(names), names);
w('- No point source heat radiation model and no setback distance. Those live in the facilities engines, and the Facilities courses teach them.');
w('- No two phase discharge, no instantaneous puff, no urban dispersion coefficients, no jet fire, no Kingery-Bulmash fit and no multi-energy blast method (' + ref('notdone') + ').');
w('- No frequency of any kind. A consequence model says what happens if the release occurs; how often it occurs belongs elsewhere (' + ref('seam') + ').');

/* ============================================================ SECTION 2 */

section('units', 'Every input carries its unit in its name', ['Associate m01']);
w('The engine reads its unit from the name of every argument, and it never converts a unit it was not asked to. The suffixes, and what each means:');
w();
table(['suffix in the argument name', 'unit', 'an example argument'], [
  ['KgS', 'kilograms per second', '`massRateKgS`'],
  ['M, M2, M3', 'metres, square metres, cubic metres', '`holeDiameterM`, `bundAreaM2`, `spillVolumeM3`'],
  ['Pa', 'pascals, ABSOLUTE for a pressure', '`upstreamPressurePa`, `ambientPressurePa`'],
  ['K', 'kelvin', '`upstreamTemperatureK`'],
  ['KgMol, GMol', 'kilograms per mole (source terms), grams per mole (concentrations)', '`molarMassKgMol`, `molarMassGMol`'],
  ['MS, 10mMS', 'metres per second; the 10m form is the wind at 10 m', '`windSpeedMS`, `windSpeed10mMS`'],
  ['KgM2S', 'kilograms per square metre per second', '`burningFluxKgM2S`'],
  ['WM2', 'watts per square metre', '`heatFluxWM2`, `surfaceEmissivePowerWM2`'],
  ['JKg, JKgK', 'joules per kilogram, joules per kilogram kelvin', '`heatOfCombustionJKg`'],
  ['S, Minutes', 'seconds for a thermal exposure, minutes for a toxic exposure', '`exposureTimeS`, `exposureMinutes`'],
  ['Ppm, MgM3', 'parts per million by volume, milligrams per cubic metre', '`concentrationPpm`, `concentrationMgM3`'],
  ['MKg13', 'metres per kilogram to the one third', '`scaledDistanceMKg13`'],
]);
w();
const kg = success('the molar mass of methane in kg/mol', C.gasOrificeDischarge({ ...T.AMENAM_GAS, upstreamPressurePa: 5e5 }));
const gRefuse = C.gasOrificeDischarge({ ...T.AMENAM_GAS, upstreamPressurePa: 5e5, molarMassKgMol: 0 });
refusal('a molar mass of zero', gRefuse, 'molarMassKgMol');
w(`TWO MOLAR MASS UNITS. The source terms take kg/mol (methane is ${T.AMENAM_GAS.molarMassKgMol}, stated) and the concentration functions take g/mol (carbon monoxide is ${T.UBIT.molarMassGMol}, stated). The engine's own reminder, from a refusal: "${gRefuse.error}".`);
w();
w(`PRESSURES ARE ABSOLUTE. Ambient is \`ATM_PA\`, ${C.ATM_PA} Pa, unless a call states otherwise. A gauge pressure typed where an absolute one is due understates the driving pressure by one atmosphere.`);
must('the methane call succeeded', kg.massRateKgS > 0, kg.massRateKgS);

/* ============================================================ SECTION 3 */

section('refusals', 'Every refusal, with the field it names and the engine\'s own words', ['Associate m01 l05', 'Professional m06 l03', 'Expert m03 l01']);
w('Each row is a real call. The message column is the engine\'s `error` string, verbatim. A refusal carries no number.');
w();
const LQ = T.AMENAM_LIQUID;
const GS = { ...T.AMENAM_GAS, upstreamPressurePa: 5e5 };
const PL = { massRateKgS: 2, windSpeedMS: 3, downwindDistanceM: 500, stabilityClass: 'D' };
const REFUSALS = [
  ['source terms', 'liquidOrificeDischarge', () => C.liquidOrificeDischarge({ ...LQ, dischargeCoefficient: 1.2 }), 'dischargeCoefficient', 'a discharge coefficient above one'],
  ['source terms', 'liquidOrificeDischarge', () => C.liquidOrificeDischarge({ ...LQ, holeDiameterM: 0 }), 'holeDiameterM', 'a hole diameter of zero'],
  ['source terms', 'liquidOrificeDischarge', () => C.liquidOrificeDischarge({ ...LQ, liquidHeadM: -1 }), 'liquidHeadM', 'a negative liquid head'],
  ['source terms', 'liquidOrificeDischarge', () => C.liquidOrificeDischarge({ ...LQ, liquidHeadM: 0, pressureAboveLiquidPa: 90000 }), 'pressureAboveLiquidPa', 'an ullage below ambient and no head'],
  ['source terms', 'gasOrificeDischarge', () => C.gasOrificeDischarge({ ...GS, upstreamPressurePa: 101325 }), 'upstreamPressurePa', 'an upstream pressure equal to ambient'],
  ['source terms', 'gasOrificeDischarge', () => C.gasOrificeDischarge({ ...GS, heatCapacityRatio: 1 }), 'heatCapacityRatio', 'a heat capacity ratio of one'],
  ['source terms', 'gasOrificeDischarge', () => C.gasOrificeDischarge({ ...GS, upstreamTemperatureK: 0 }), 'upstreamTemperatureK', 'a temperature of zero kelvin'],
  ['source terms', 'poolFromSpill', () => C.poolFromSpill({ spillVolumeM3: T.SPILL_M3 }), 'bundAreaM2', 'no bund area and no thickness'],
  ['source terms', 'poolFromSpill', () => C.poolFromSpill({ spillVolumeM3: T.SPILL_M3, ...T.SMALL_BUND }), 'spillVolumeM3', 'a spill that overtops its bund'],
  ['source terms', 'poolEvaporationMackayMatsugu', () => C.poolEvaporationMackayMatsugu({ ...T.EVAP, windSpeed10mMS: 0 }), 'windSpeed10mMS', 'calm air'],
  ['source terms', 'poolEvaporationMackayMatsugu', () => C.poolEvaporationMackayMatsugu({ ...T.EVAP, vapourPressurePa: 110000 }), 'vapourPressurePa', 'a vapour pressure above ambient'],
  ['dispersion', 'briggsRuralSigmas', () => C.briggsRuralSigmas({ stabilityClass: 'G', downwindDistanceM: 500 }), 'stabilityClass', 'a class the table does not carry'],
  ['dispersion', 'gaussianPlume', () => C.gaussianPlume({ ...PL, windSpeedMS: 0 }), 'windSpeedMS', 'a wind speed of zero'],
  ['dispersion', 'gaussianPlume', () => C.gaussianPlume({ ...PL, downwindDistanceM: 0 }), 'downwindDistanceM', 'a receptor at the source'],
  ['dispersion', 'gaussianPlume', () => C.gaussianPlume({ ...PL, stabilityClass: undefined }), 'sigmaYM', 'no class and no sigmas'],
  ['dispersion', 'plumeDistanceToConcentration', () => C.plumeDistanceToConcentration({ massRateKgS: 2, windSpeedMS: 3, stabilityClass: 'D', targetConcentrationMgM3: 0 }), 'targetConcentrationMgM3', 'a target of zero'],
  ['dispersion', 'ppmToMgM3', () => C.ppmToMgM3({ concentrationPpm: 50 }), 'molarMassGMol', 'no molar mass'],
  ['fires', 'poolBurningRate', () => C.poolBurningRate({ method: 'babrauskas', fuel: 'diesel', poolDiameterM: 10 }), 'fuel', 'a fuel the table does not carry'],
  ['fires', 'poolBurningRate', () => C.poolBurningRate({ method: 'burgess', ...T.BURGESS_HEXANE, boilingPointK: 231 }), 'boilingPointK', 'a boiling point below ambient'],
  ['fires', 'poolBurningRate', () => C.poolBurningRate({ method: 'thomas' }), 'method', 'a method the function does not know'],
  ['fires', 'poolFireFlameLength', () => C.poolFireFlameLength({ method: 'thomas-wind', poolDiameterM: 20, burningFluxKgM2S: 0 }), 'burningFluxKgM2S', 'a burning flux of zero'],
  ['fires', 'poolFireTilt', () => C.poolFireTilt({ poolDiameterM: 20, windSpeed10mMS: 4 }), 'airKinematicViscosityM2S', 'no air viscosity'],
  ['fires', 'surfaceEmissivePower', () => C.surfaceEmissivePower({ method: 'radiative-fraction', radiativeFraction: 1.5, burningFluxKgM2S: 0.1, heatOfCombustionJKg: 44.6e6, flameLengthM: 30, poolDiameterM: 20 }), 'radiativeFraction', 'a radiative fraction above one'],
  ['fires', 'cylinderViewFactor', () => C.cylinderViewFactor({ flameRadiusM: 10, flameLengthM: 30, distanceFromAxisM: 8 }), 'distanceFromAxisM', 'a target inside the flame base'],
  ['fires', 'cylinderViewFactor', () => C.cylinderViewFactor(T.VF_OVERHANG), 'tiltDeg', 'a flame that leans over the target'],
  ['fires', 'atmosphericTransmissivityBagster', () => C.atmosphericTransmissivityBagster({ waterVapourPartialPressurePa: T.BAGSTER_PW, pathLengthM: 2 }), 'pathLengthM', 'a path too short for the fit'],
  ['fires', 'solidFlameHeatFlux', () => C.solidFlameHeatFlux({ surfaceEmissivePowerWM2: 50000, viewFactor: 1.2, transmissivity: 0.8 }), 'viewFactor', 'a view factor above one'],
  ['fires', 'solidFlameDistanceForHeatFlux', () => C.solidFlameDistanceForHeatFlux({ targetHeatFluxWM2: 5000, poolDiameterM: 20, burningFluxKgM2S: 0.1, heatOfCombustionJKg: 44.6e6 }), 'transmissivity', 'a distance search with no fixed transmissivity'],
  ['explosions', 'tntEquivalentMass', () => C.tntEquivalentMass({ ...T.BONGA_TNT, tntBlastEnergyJKg: 4600 }), 'tntBlastEnergyJKg', 'the TNT energy typed in kJ/kg'],
  ['explosions', 'tntEquivalentMass', () => C.tntEquivalentMass({ ...T.BONGA_TNT, yieldFactor: 3 }), 'yieldFactor', 'a yield typed as a percentage'],
  ['explosions', 'kinneyGrahamOverpressure', () => C.kinneyGrahamOverpressure({ scaledDistanceMKg13: 60 }), 'scaledDistanceMKg13', 'a scaled distance beyond the range'],
  ['explosions', 'distanceForOverpressure', () => C.distanceForOverpressure({ tntMassKg: 500, overpressurePa: 500 }), 'overpressurePa', 'an overpressure below the range'],
  ['probits', 'probabilityToProbit', () => C.probabilityToProbit(1), 'probability', 'a probability of one'],
  ['probits', 'probit', () => C.probit({ a: -14.9, b: 2.56, dose: 0 }), 'dose', 'a thermal dose or toxic load of zero'],
  ['probits', 'thermalProbit', () => C.thermalProbit({ coefficients: 'tno', heatFluxWM2: 10000, exposureTimeS: 30 }), 'coefficients', 'a preset the engine does not carry'],
  ['probits', 'toxicProbit', () => C.toxicProbit({ coefficients: 'pb-hydrogen-sulfide', concentrationPpm: 500, exposureMinutes: 10 }), 'molarMassGMol', 'ppm on a mg/m3 preset with no molar mass'],
  ['probits', 'toxicDose', () => C.toxicDose({ n: 2, history: [] }), 'history', 'an empty history'],
];
table(['engine section', 'function', 'what was passed', 'field named', 'the engine\'s message'], REFUSALS.map(([sec, fn, call, field, what]) => {
  const r = refusal(`${fn} with ${what}`, call(), field);
  return [sec, `\`${fn}\``, what, `\`${r.field}\``, r.error];
}));
w();
w(`${REFUSALS.length} refusals are tabled above, across ${new Set(REFUSALS.map((r) => r[1])).size} functions.`);
must('every engine section appears in the refusal table', new Set(REFUSALS.map((r) => r[0])).size === 5, 'five sections');

/* ============================================================ SECTION 4 */

section('sources', 'The sources the engine names, and what each fixes', ['Associate m01 l04']);
w('The engine exports its sources as `CONSEQUENCE_SOURCES`, verbatim:');
w();
table(['key', 'the engine string, verbatim'], Object.entries(C.CONSEQUENCE_SOURCES).map(([k, v]) => [k, v]));
must('six sources', Object.keys(C.CONSEQUENCE_SOURCES).length === 6, Object.keys(C.CONSEQUENCE_SOURCES).join());
w();
table(['key', 'what it fixes in this engine'], [
  ['YB', 'liquid and gas outflow through a hole, Mackay and Matsugu evaporation, the pool diameter, the Babrauskas and Burgess burning rates, Thomas with wind, the flame tilt, the surface emissive power, the Bagster transmissivity, the solid flame heat flux, the view factors and the TNT equivalence'],
  ['PB', 'the probit to probability relation and its table, the toxic probit coefficients, the heat radiation probit and a worked carbon monoxide plume'],
  ['OSD', 'the thermal probits by name, the Lees toxic probits in ppm and the overpressure probit'],
  ['ALOHA', 'the continuous Gaussian plume with ground reflection and the Briggs rural sigma coefficients'],
  ['KG', 'the free air peak side-on overpressure closed form'],
  ['CCOHS', 'ppm and mg/m3 through a molar volume'],
]);
w();
w('Every basis block names the source it used, so a result carries its own citation. The Gaussian plume at 500 m in class D, for example, reports: "' + success('the plume basis', C.gaussianPlume(PL)).basis.source + '".');

/* ============================================================ SECTION 5 */

section('liquid', 'Liquid outflow through a hole', ['Associate m02']);
const lq = success('AMENAM liquid', C.liquidOrificeDischarge(LQ));
w(`The engine's model string, verbatim: "${lq.basis.model}". P is the absolute pressure at the hole: the static head rhoL g hL plus the pressure above the liquid, PaL. The mass rate depends on the driving pressure P minus ambient.`);
w();
w(`AMENAM is a crude run-down line (stated): discharge coefficient ${LQ.dischargeCoefficient}, hole diameter ${LQ.holeDiameterM} m, density ${LQ.liquidDensityKgM3} kg/m3, head ${LQ.liquidHeadM} m, pressure above the liquid ${LQ.pressureAboveLiquidPa} Pa absolute.`);
w();
table(['quantity', 'engine key', 'value'], [
  ['hole area, m2', '`holeAreaM2`', f12(lq.holeAreaM2)],
  ['pressure at the hole, Pa', '`pressureAtHolePa`', f6(lq.pressureAtHolePa)],
  ['driving pressure, Pa', '`drivingPressurePa`', f6(lq.drivingPressurePa)],
  ['mass rate, kg/s', '`massRateKgS`', f6(lq.massRateKgS)],
  ['jet velocity, m/s', '`jetVelocityMS`', f6(lq.jetVelocityMS)],
]);
must('the pressure at the hole is the head plus the ullage', rel(lq.pressureAtHolePa, LQ.liquidDensityKgM3 * C.G_M_S2 * LQ.liquidHeadM + LQ.pressureAboveLiquidPa) < 1e-15, lq.pressureAtHolePa);
w();
w('THE HEAD, SWEPT, with the ullage held:');
w();
const heads = T.HEAD_LADDER.map((h) => ({ h, r: success(`AMENAM head ${h}`, C.liquidOrificeDischarge({ ...LQ, liquidHeadM: h })) }));
table(['head m, stated', 'driving pressure Pa', 'mass rate kg/s'], heads.map(({ h, r }) => [String(h), f6(r.drivingPressurePa), f6(r.massRateKgS)]));
w();
w('THE ULLAGE PRESSURE, SWEPT, with the head held:');
w();
const ulls = T.ULLAGE_LADDER.map((p) => ({ p, r: success(`AMENAM ullage ${p}`, C.liquidOrificeDischarge({ ...LQ, pressureAboveLiquidPa: p })) }));
table(['pressure above the liquid Pa, stated', 'driving pressure Pa', 'mass rate kg/s'], ulls.map(({ p, r }) => [String(p), f6(r.drivingPressurePa), f6(r.massRateKgS)]));
must('with the ullage at ambient the driving pressure is the head alone', rel(ulls[0].r.drivingPressurePa, LQ.liquidDensityKgM3 * C.G_M_S2 * LQ.liquidHeadM) < 1e-12, ulls[0].r.drivingPressurePa);
w();
const tor = Math.sqrt(2 * C.G_M_S2 * LQ.liquidHeadM);
w(`With the ullage at ambient the driving pressure is the head alone, and the jet velocity is Torricelli's sqrt(2 g h): derived, ${f6(tor)} m/s against the engine's ${f6(ulls[0].r.jetVelocityMS)}.`);
must('the jet velocity at ambient ullage is Torricelli', rel(ulls[0].r.jetVelocityMS, tor) < 1e-12, ulls[0].r.jetVelocityMS);
w();
w('THE DISCHARGE COEFFICIENT AND THE HOLE, each swept with everything else held:');
w();
const cds = T.CD_LADDER.map((c) => ({ c, r: success(`AMENAM Cd ${c}`, C.liquidOrificeDischarge({ ...LQ, dischargeCoefficient: c })) }));
table(['discharge coefficient, stated', 'mass rate kg/s'], cds.map(({ c, r }) => [String(c), f6(r.massRateKgS)]));
w();
const holes = T.HOLE_LADDER.map((d) => ({ d, r: success(`AMENAM hole ${d}`, C.liquidOrificeDischarge({ ...LQ, holeDiameterM: d })) }));
table(['hole diameter m, stated', 'hole area m2', 'mass rate kg/s'], holes.map(({ d, r }) => [String(d), f12(r.holeAreaM2), f6(r.massRateKgS)]));
must('doubling the diameter quadruples the mass rate', rel(holes[3].r.massRateKgS / holes[2].r.massRateKgS, 4) < 1e-12, 'four');
w();
w(`The mass rate is linear in the discharge coefficient and in the hole AREA, so doubling the diameter from ${T.HOLE_LADDER[2]} to ${T.HOLE_LADDER[3]} m multiplies it by, derived, ${f6(holes[3].r.massRateKgS / holes[2].r.massRateKgS)}. The engine's refusal for a coefficient above one names the Yellow Book's recommendation: "${C.liquidOrificeDischarge({ ...LQ, dischargeCoefficient: 1.2 }).error}".`);
w();
const gl = GOLD.sourceTerms.liquid.find((c) => c.id === 'yb-acrylonitrile-500s');
const glr = success('published YB acrylonitrile', C.liquidOrificeDischarge(gl.args));
w(`THE PUBLISHED CASE (golden). ${gl.source}. The engine gives ${f6(glr.massRateKgS)} kg/s against the printed ${gl.printed}, a relative difference of ${relE(glr.massRateKgS, gl.printed)}; the level is printed to two decimals, which is why the golden allows ${gl.publishedRelTol} relative.`);
must('the acrylonitrile case reproduces within its stated tolerance', rel(glr.massRateKgS, gl.printed) < gl.publishedRelTol, glr.massRateKgS);
w();
const e28 = GOLD.sourceTerms.erratumTable28;
w(`AN ERRATUM IN THE SAME EXAMPLE (golden). Its table prints ${e28.printedT0MassRateKgS} kg/s at time zero for a level of ${e28.printedT0LevelM} m; Bernoulli at that level gives ${f6(e28.bernoulliAtThatLevel)} kg/s. The value at 500 s reproduces and the value at time zero does not, so the golden uses the one that reproduces.`);
const e28r = success('the time zero erratum', C.liquidOrificeDischarge({ ...gl.args, liquidHeadM: e28.printedT0LevelM }));
must('the engine matches the golden Bernoulli at the erratum level', rel(e28r.massRateKgS, e28.bernoulliAtThatLevel) < 1e-10, e28r.massRateKgS);

/* ============================================================ SECTION 6 */

section('gas', 'Gas outflow through a hole, choked and subsonic', ['Associate m03']);
const g0 = success('AMENAM gas at 5e5', C.gasOrificeDischarge(GS));
w(`The engine's model string, verbatim: "${g0.basis.model}".`);
w();
w(`AMENAM GAS is a methane line (stated): discharge coefficient ${T.AMENAM_GAS.dischargeCoefficient}, hole ${T.AMENAM_GAS.holeDiameterM} m, ${T.AMENAM_GAS.upstreamTemperatureK} K, molar mass ${T.AMENAM_GAS.molarMassKgMol} kg/mol, heat capacity ratio ${T.AMENAM_GAS.heatCapacityRatio}. The upstream pressure, absolute, swept:`);
w();
const gasRows = T.PRESSURE_LADDER.map((p) => ({ p, r: success(`AMENAM gas at ${p}`, C.gasOrificeDischarge({ ...T.AMENAM_GAS, upstreamPressurePa: p })) }));
table(['upstream Pa, stated', 'Pa over P0', 'regime', 'outflow coefficient psi', 'upstream density kg/m3', 'mass rate kg/s'],
  gasRows.map(({ p, r }) => [String(p), f6(r.pressureRatio), r.regime, f6(r.outflowCoefficientPsi), f6(r.upstreamDensityKgM3), f6(r.massRateKgS)]));
must('the ladder crosses from subsonic to choked', gasRows[0].r.regime === 'SUBSONIC' && gasRows.at(-1).r.regime === 'CHOKED', 'crosses');
must('psi is one exactly when choked', gasRows.every(({ r }) => (r.choked ? r.outflowCoefficientPsi === 1 : r.outflowCoefficientPsi < 1)), 'psi');
const chokedRows = gasRows.filter(({ r }) => r.choked);
must('a choked mass rate is linear in the upstream pressure', chokedRows.slice(1).every(({ p, r }) => rel(r.massRateKgS / chokedRows[0].r.massRateKgS, p / chokedRows[0].p) < 1e-12), 'linear');
w();
w(`The critical pressure ratio for this gas is ${f6(g0.criticalPressureRatio)}: the flow is CHOKED when ambient over upstream is at or below it. Once choked the mass rate is LINEAR in the upstream pressure: from ${chokedRows[0].p} to ${chokedRows.at(-1).p} Pa the mass rate grows by, derived, ${f6(chokedRows.at(-1).r.massRateKgS / chokedRows[0].r.massRateKgS)}, the same as the pressure ratio ${f6(chokedRows.at(-1).p / chokedRows[0].p)}. At or below the critical pressure ratio the downstream pressure cannot reach back into the hole.`);
w();
w('THE CRITICAL PRESSURE RATIO against the heat capacity ratio, from `gasOrificeDischarge` at the same line:');
w();
const gam = T.GAMMA_LADDER.map((gm) => ({ gm, r: success(`critical ratio at gamma ${gm}`, C.gasOrificeDischarge({ ...GS, heatCapacityRatio: gm })) }));
table(['heat capacity ratio, stated', 'critical pressure ratio', 'upstream pressure to choke at 101325 Pa, derived'], gam.map(({ gm, r }) => [String(gm), f6(r.criticalPressureRatio), f6(C.ATM_PA / r.criticalPressureRatio)]));
must('the critical ratio falls as gamma rises', gam.every((x, i) => i === 0 || x.r.criticalPressureRatio < gam[i - 1].r.criticalPressureRatio), 'falling');
w();
w('The critical pressure ratio falls as the heat capacity ratio rises, so a gas with a larger ratio needs a higher upstream pressure to choke into the atmosphere.');
w();
const gh = GOLD.sourceTerms.gas.find((c) => c.id === 'yb-hydrogen-t0');
const ghr = success('published YB hydrogen', C.gasOrificeDischarge(gh.args));
const gh140 = success('YB hydrogen at 1.40', C.gasOrificeDischarge({ ...gh.args, heatCapacityRatio: 1.4 }));
w(`THE PUBLISHED CASE (golden). ${gh.source}.`);
w();
table(['heat capacity ratio', 'engine mass rate kg/s', 'printed'], [
  [`${gh.args.heatCapacityRatio}, inferred`, f6(ghr.massRateKgS), String(gh.printed)],
  ['1.4', f6(gh140.massRateKgS), String(gh.printed)],
]);
must('the inferred gamma reproduces to two decimals and 1.40 does not', ghr.massRateKgS.toFixed(2) === String(gh.printed) && gh140.massRateKgS.toFixed(2) !== String(gh.printed), `${ghr.massRateKgS} ${gh140.massRateKgS}`);
w();
w(`The example does not print its heat capacity ratio. ${gh.args.heatCapacityRatio} reproduces the printed ${gh.printed} kg/s to its two decimals and 1.4 does not, so the golden records the ratio as INFERRED.`);
w();
const gb = GOLD.sourceTerms.gas.filter((c) => typeof c.routeB === 'number');
w(`A SECOND ROUTE (golden). For ${gb.length} gas cases the oracle maximises the isentropic nozzle mass flux over every throat pressure at or above ambient, which derives choking instead of testing a ratio. The engine against that route:`);
w();
table(['golden case', 'regime', 'engine kg/s', 'route B kg/s, golden', 'relative difference'], gb.map((c) => {
  const r = success(`route B gas ${c.id}`, C.gasOrificeDischarge(c.args));
  must(`gas ${c.id} agrees with route B`, rel(r.massRateKgS, c.routeB) < 1e-9, rel(r.massRateKgS, c.routeB));
  return [c.id, r.regime, f6(r.massRateKgS), f6(c.routeB), relE(r.massRateKgS, c.routeB)];
}));

/* ============================================================ SECTION 7 */

section('critical', 'Exactly at the critical ratio', ['Associate m03 l05']);
const crit = GOLD.sourceTerms.gas.filter((c) => /barely/i.test(c.id));
w('The Yellow Book tests P0 over Pa AT OR ABOVE ((gamma + 1) / 2) to the power gamma / (gamma - 1), so a ratio exactly at the critical value is CHOKED. The subsonic outflow coefficient equals one there, so the regime flag flips with no jump in the mass rate. The golden cases around the boundary, through the engine:');
w();
table(['golden case', 'Pa over P0', 'critical pressure ratio', 'regime', 'psi', 'mass rate kg/s'], crit.map((c) => {
  const r = success(`critical case ${c.id}`, C.gasOrificeDischarge(c.args));
  must(`critical case ${c.id} matches the golden`, rel(r.massRateKgS, c.expected.massRateKgS) < 1e-10 && (c.expected.choked === undefined || r.choked === c.expected.choked), `${r.massRateKgS} ${r.choked}`);
  return [c.id, r.pressureRatio.toPrecision(17), r.criticalPressureRatio.toPrecision(17), r.regime, f12(r.outflowCoefficientPsi), f6(r.massRateKgS)];
}));
must('at least two boundary cases', crit.length >= 2, crit.length);
w();
const pc = GS.upstreamPressurePa;
const gcrit = g0.criticalPressureRatio;
const pAt = C.ATM_PA / gcrit;
const at = success('AMENAM exactly at its critical ratio', C.gasOrificeDischarge({ ...T.AMENAM_GAS, upstreamPressurePa: pAt }));
const below = success('AMENAM just below', C.gasOrificeDischarge({ ...T.AMENAM_GAS, upstreamPressurePa: pAt * (1 - 1e-9) }));
w(`On the AMENAM line: the upstream pressure that puts the ratio at the critical value is, derived, ${f6(pAt)} Pa. There the engine reports ${at.regime} with psi ${f12(at.outflowCoefficientPsi)}; one part in a billion lower it reports ${below.regime} with psi ${f12(below.outflowCoefficientPsi)}, and the two mass rates differ by, derived, ${relE(below.massRateKgS, at.massRateKgS)} relative. The regime is a label on a continuous curve.`);
must('the boundary flips the regime with no jump', below.regime === 'SUBSONIC' && rel(below.massRateKgS, at.massRateKgS) < 1e-8, `${below.regime} ${rel(below.massRateKgS, at.massRateKgS)}`);
must('pc used', pc > 0, pc);

/* ============================================================ SECTION 8 */

section('pools', 'A spill becomes a pool: confined, unconfined and overtopping', ['Associate m04']);
const bund = success('the spill in its bund', C.poolFromSpill({ spillVolumeM3: T.SPILL_M3, ...T.BUND }));
w(`A spill of ${T.SPILL_M3} m3 (stated). CONFINED: the pool covers the bund floor, ${T.BUND.bundAreaM2} m2, with a wall of ${T.BUND.bundWallHeightM} m (stated).`);
w();
table(['quantity', 'engine key', 'value'], [
  ['containment', '`containment`', bund.containment], ['area m2', '`areaM2`', f6(bund.areaM2)],
  ['depth m', '`depthM`', f6(bund.depthM)], ['equivalent diameter m', '`equivalentDiameterM`', f6(bund.equivalentDiameterM)],
]);
w();
w(`The engine's model string for a bund, verbatim: "${bund.basis.model}".`);
w();
const over = C.poolFromSpill({ spillVolumeM3: T.SPILL_M3, ...T.SMALL_BUND });
w(`OVERTOPPING. The same spill in a bund of ${T.SMALL_BUND.bundAreaM2} m2 would stand, derived, ${f6(T.SPILL_M3 / T.SMALL_BUND.bundAreaM2)} m deep behind a ${T.SMALL_BUND.bundWallHeightM} m wall, and the engine refuses:`);
w();
w(`> ${over.error}`);
w();
w('UNCONFINED, at a STATED thickness. No spreading model is implemented; the thickness is the analyst\'s:');
w();
const thick = T.THICKNESS_LADDER.map((d) => ({ d, r: success(`spill at ${d} m`, C.poolFromSpill({ spillVolumeM3: T.SPILL_M3, poolThicknessM: d })) }));
table(['thickness m, stated', 'containment', 'area m2', 'equivalent diameter m'], thick.map(({ d, r }) => [String(d), r.containment, f6(r.areaM2), f6(r.equivalentDiameterM)]));
must('halving the thickness raises the diameter by root two', rel(thick[0].r.equivalentDiameterM / thick[1].r.equivalentDiameterM, Math.SQRT2) < 1e-12, 'root two');
w();
w(`The diameter goes as one over the square root of the thickness: halving it from ${T.THICKNESS_LADDER[1]} to ${T.THICKNESS_LADDER[0]} m raises the diameter by, derived, ${f6(thick[0].r.equivalentDiameterM / thick[1].r.equivalentDiameterM)}. The engine's model string, verbatim: "${thick[0].r.basis.model}".`);
w();
const noSpread = C.poolFromSpill({ spillVolumeM3: T.SPILL_M3 });
w(`With neither a bund nor a thickness the engine refuses, in its words: "${noSpread.error}".`);
w();
const gp = GOLD.sourceTerms.pools.find((c) => c.id === 'yb-benzene-pool');
const gpr = success('published YB pool', C.poolFromSpill(gp.args));
w(`THE PUBLISHED CASE (golden). ${gp.source}. The engine: diameter ${f6(gpr.equivalentDiameterM)} m and area ${f6(gpr.areaM2)} m2; the book prints its values truncated.`);
must('the YB pool reproduces its printed diameter', Math.abs(gpr.equivalentDiameterM - gp.printed.equivalentDiameterM) < 1e-3, gpr.equivalentDiameterM);

/* ============================================================ SECTION 9 */

section('evaporation', 'Evaporation of a pool below its boiling point', ['Associate m04 l04', 'Expert m05 l04']);
const ev = success('the hexane pool', C.poolEvaporationMackayMatsugu(T.EVAP));
w(`The engine's model string, verbatim: "${ev.basis.model}". The Schmidt number defaults to 0.8, the Yellow Book's value for gases and vapours in general; the constant \`MACKAY_MATSUGU_C\` is ${C.MACKAY_MATSUGU_C}.`);
w();
w(`A hexane-like pool (stated): diameter ${T.EVAP.poolDiameterM} m, wind at 10 m ${T.EVAP.windSpeed10mMS} m/s, vapour pressure ${T.EVAP.vapourPressurePa} Pa, molar mass ${T.EVAP.molarMassKgMol} kg/mol, liquid at ${T.EVAP.liquidTemperatureK} K.`);
w();
table(['quantity', 'engine key', 'value'], [
  ['mass transfer coefficient m/s', '`massTransferCoefficientMS`', f12(ev.massTransferCoefficientMS)],
  ['evaporation flux kg/(m2 s)', '`evaporationFluxKgM2S`', f12(ev.evaporationFluxKgM2S)],
  ['pool area m2', '`poolAreaM2`', f6(ev.poolAreaM2)],
  ['evaporation rate kg/s', '`evaporationRateKgS`', f6(ev.evaporationRateKgS)],
]);
w();
const evw = T.EVAP_WIND.map((u) => ({ u, r: success(`evaporation at wind ${u}`, C.poolEvaporationMackayMatsugu({ ...T.EVAP, windSpeed10mMS: u })) }));
const evd = T.EVAP_DIAMETER.map((d) => ({ d, r: success(`evaporation at diameter ${d}`, C.poolEvaporationMackayMatsugu({ ...T.EVAP, poolDiameterM: d })) }));
table(['wind m/s, stated', 'evaporation rate kg/s'], evw.map(({ u, r }) => [String(u), f6(r.evaporationRateKgS)]));
w();
table(['pool diameter m, stated', 'evaporation flux kg/(m2 s)', 'evaporation rate kg/s'], evd.map(({ d, r }) => [String(d), f12(r.evaporationFluxKgM2S), f6(r.evaporationRateKgS)]));
must('the rate grows with the wind to the 0.78', rel(evw[3].r.evaporationRateKgS / evw[2].r.evaporationRateKgS, (5 / 3) ** 0.78) < 1e-12, 'wind');
must('the evaporation flux falls with the diameter', evd.every((x, i) => i === 0 || x.r.evaporationFluxKgM2S < evd[i - 1].r.evaporationFluxKgM2S), 'falls');
w();
w('The rate grows with the wind to the power 0.78, and the evaporation flux per square metre FALLS slowly as the pool grows (the diameter enters to the power minus 0.11), while the rate still grows with the area.');
w();
w(`TWO REFUSALS DRAW THE MODEL'S EDGE (${ref('refusals')}). Calm air: "${C.poolEvaporationMackayMatsugu({ ...T.EVAP, windSpeed10mMS: 0 }).error}". A boiling pool: "${C.poolEvaporationMackayMatsugu({ ...T.EVAP, vapourPressurePa: 110000 }).error}".`);
w();
w(`SINGLE ROUTE. This correlation has no second derivation and no public worked number behind it in the engine's validation record: the only check is the transcription from the Yellow Book (${ref('singleroute')}). It is taught; it is never a graded answer.`);

/* ============================================================ SECTION 10 */

section('sigmas', 'Pasquill-Gifford classes and the Briggs rural sigmas', ['Associate m05']);
w(`The engine's model string, verbatim: "${success('sigma basis', C.briggsRuralSigmas({ stabilityClass: 'D', downwindDistanceM: 1000 })).basis.model}". The coefficients, as the engine exports them in \`BRIGGS_RURAL\`:`);
w();
table(['class', 'sy1', 'sy2', 'sz1', 'sz2', 'sz3'], C.STABILITY_CLASSES.map((k) => { const c = C.BRIGGS_RURAL[k]; return [k, String(c.sy1), String(c.sy2), String(c.sz1), String(c.sz2), String(c.sz3)]; }));
must('the exported table equals ALOHA Table 13 in the golden', C.STABILITY_CLASSES.every((k) => ['sy1', 'sy2', 'sz1', 'sz2', 'sz3'].every((q) => C.BRIGGS_RURAL[k][q] === GOLD.dispersion.briggsTable[k][q])), 'equal');
w();
w('Class A is the most unstable (a sunny afternoon, light wind) and class F the most stable (a clear night, light wind); D is neutral. sigma_y is the crosswind spread and sigma_z the vertical spread, both in m:');
w();
const sg = T.SIGMA_DISTANCES.map((x) => ({ x, rs: C.STABILITY_CLASSES.map((k) => success(`sigma ${k} ${x}`, C.briggsRuralSigmas({ stabilityClass: k, downwindDistanceM: x }))) }));
table(['distance m, stated', ...C.STABILITY_CLASSES.map((k) => `sigma_y ${k}`)], sg.map(({ x, rs }) => [String(x), ...rs.map((r) => f6(r.sigmaYM))]));
w();
table(['distance m, stated', ...C.STABILITY_CLASSES.map((k) => `sigma_z ${k}`), 'warning'], sg.map(({ x, rs }) => [String(x), ...rs.map((r) => f6(r.sigmaZM)), rs[0].warning ? 'yes' : 'no']));
must('sigma_z falls from A to F at every distance', sg.every(({ rs }) => rs.every((r, i) => i === 0 || r.sigmaZM < rs[i - 1].sigmaZM)), 'falls');
must('the warning fires outside 100 m to 10 km only', sg.every(({ x, rs }) => rs.every((r) => !!r.warning === (x < 100 || x > 10000))), 'warning');
w();
const wn = C.briggsRuralSigmas({ stabilityClass: 'D', downwindDistanceM: 60 });
w(`Outside 100 m to 10 km the sigmas carry a warning and are still returned: "${wn.warning}". The engine's validation record says that range is from memory of the usual textbooks and not from a source it read.`);
w();
w('THE sz2 NOTE. ALOHA prints the class D sz2 as 0.0015 and notes that a value of 0.00015 printed since Briggs 1973 is incorrect. The engine carries 0.0015. At 1000 m in class D the two would give (derived, from the table\'s own form):');
const d1000 = success('D at 1000', C.briggsRuralSigmas({ stabilityClass: 'D', downwindDistanceM: 1000 }));
const wrongSz = 0.06 * 1000 * (1 + 0.00015 * 1000) ** -0.5;
w();
table(['sz2', 'sigma_z at 1000 m, class D'], [['0.0015, the engine', f6(d1000.sigmaZM)], ['0.00015, the misprint, derived', f6(wrongSz)]]);
must('the misprint gives a larger sigma_z', wrongSz > d1000.sigmaZM, wrongSz);

/* ============================================================ SECTION 11 */

section('plume', 'The continuous Gaussian plume with ground reflection', ['Associate m05', 'Associate m06']);
const pbase = { massRateKgS: T.UBIT.massRateKgS, windSpeedMS: T.UBIT.windSpeedMS, stabilityClass: 'D', molarMassGMol: T.UBIT.molarMassGMol };
const p500 = success('UBIT at 500 m', C.gaussianPlume({ ...pbase, downwindDistanceM: 500 }));
w(`The engine's model string, verbatim: "${p500.basis.model}". The expression, from its header: C = Q / (2 pi sy sz u) exp(-y^2 / 2 sy^2) [exp(-(z - h)^2 / 2 sz^2) + exp(-(z + h)^2 / 2 sz^2)], with Q the release rate, u the wind speed, y the crosswind distance, z the receptor height and h the release height. The second exponential is the IMAGE SOURCE at minus h: the ground reflects what reaches it.`);
w();
w(`UBIT is a sustained carbon monoxide release (stated): ${T.UBIT.massRateKgS} kg/s in a ${T.UBIT.windSpeedMS} m/s wind, molar mass ${T.UBIT.molarMassGMol} g/mol. At ground level on the centreline, from a ground level release, class D:`);
w();
const pls = T.PLUME_DISTANCES.map((x) => ({ x, r: success(`UBIT D at ${x}`, C.gaussianPlume({ ...pbase, downwindDistanceM: x })) }));
table(['distance m, stated', 'sigma_y m', 'sigma_z m', 'concentration mg/m3', 'concentration ppm'], pls.map(({ x, r }) => [String(x), f6(r.sigmaYM), f6(r.sigmaZM), f6(r.concentrationMgM3), f6(r.concentrationPpm)]));
must('the ground level centreline concentration is Q / (pi sy sz u)', pls.every(({ r }) => rel(r.concentrationKgM3, T.UBIT.massRateKgS / (Math.PI * r.sigmaYM * r.sigmaZM * T.UBIT.windSpeedMS)) < 1e-12), 'special case');
must('the concentration falls with distance', pls.every((x, i) => i === 0 || x.r.concentrationMgM3 < pls[i - 1].r.concentrationMgM3), 'falls');
w();
w('At ground level on the centreline from a ground level release the two exponentials are both one and the expression is Q / (pi sy sz u): the reflection DOUBLES what an unbounded plume would give there.');
w();
w('THE CLASS, at 500 m, the same release:');
w();
const byClass = C.STABILITY_CLASSES.map((k) => ({ k, r: success(`UBIT ${k} at 500`, C.gaussianPlume({ ...pbase, stabilityClass: k, downwindDistanceM: 500 })) }));
table(['class', 'concentration mg/m3', 'concentration ppm'], byClass.map(({ k, r }) => [k, f6(r.concentrationMgM3), f6(r.concentrationPpm)]));
must('the stable class gives the highest ground level concentration', byClass.at(-1).r.concentrationMgM3 === Math.max(...byClass.map((b) => b.r.concentrationMgM3)), 'F highest');
w();
w(`The stable night-time class F gives the highest ground level concentration at 500 m, derived ${f6(byClass.at(-1).r.concentrationMgM3 / byClass[3].r.concentrationMgM3)} times class D: the plume stays thin and near the ground.`);
w();
w('THE WIND. The concentration is inversely proportional to the wind speed at fixed sigmas, and the plume has no calm air form. The refusal, verbatim: "' + C.gaussianPlume({ ...PL, windSpeedMS: 0 }).error + '".');
w();
const pb = GOLD.dispersion.plume.find((c) => c.id === 'pb-co-361m');
const pbr = success('published PB CO plume', C.gaussianPlume(pb.args));
w(`THE PUBLISHED CASE (golden). ${pb.source}. The engine gives ${f6(pbr.concentrationKgM3 * 1000)} g/m3 against the printed ${pb.printed.concentrationGM3} g/m3. The worked case is at z = h = 1 m with the sigmas given explicitly, which the engine accepts in place of a class.`);
w();
const mf = GOLD.dispersion.plume.filter((c) => typeof c.routeB === 'number');
w(`A SECOND ROUTE (golden). For ${mf.length} plume cases the oracle integrates u times the concentration over every crosswind distance and every height above the ground and recovers the release rate; the golden records that ratio, which is 1 to ${mf.every((c) => Math.abs(c.routeB - 1) < 1e-9) ? 'within one part in a billion in every case' : 'NOT WITHIN TOLERANCE'}. A plume that dropped the reflection would return a half.`);
must('every route B mass flux ratio is one', mf.every((c) => Math.abs(c.routeB - 1) < 1e-9), mf.map((c) => c.routeB).join());

/* ============================================================ SECTION 12 */

section('conversion', 'Parts per million and milligrams per cubic metre', ['Associate m05 l04', 'Expert m04 l03']);
const cv = success('CO 50 ppm at 25 C', C.ppmToMgM3({ concentrationPpm: 50, molarMassGMol: T.UBIT.molarMassGMol }));
w(`The engine's model string, verbatim: "${cv.basis.model}". The molar volume is the ideal gas R T / P at the STATED temperature and pressure, in L/mol:`);
w();
const vms = T.CONVERT_TEMPERATURES_K.map((t) => ({ t, vm: C.molarVolumeM3Mol(t) * 1000 }));
table(['temperature K, stated', 'molar volume L/mol at 101325 Pa'], vms.map(({ t, vm }) => [String(t), f6(vm)]));
w();
w(`At 298.15 K the molar volume is ${f6(vms[2].vm)} L/mol; the CCOHS and NIOSH figure of 24.45 is its rounding, which the golden gates at one part in a thousand.`);
w();
table(['substance', 'ppm, stated', ...T.CONVERT_TEMPERATURES_K.map((t) => `mg/m3 at ${t} K`)],
  [['carbon monoxide', T.UBIT.molarMassGMol], ['hydrogen sulphide', T.H2S_MOLAR_MASS]].flatMap(([name, mw]) => T.CONVERT_PPM.map((c) => [
    `${name}, ${mw} g/mol`, String(c), ...T.CONVERT_TEMPERATURES_K.map((t) => f6(success(`${name} ${c} at ${t}`, C.ppmToMgM3({ concentrationPpm: c, molarMassGMol: mw, temperatureK: t })).concentrationMgM3))])));
const rt = success('round trip', C.mgM3ToPpm({ concentrationMgM3: cv.concentrationMgM3, molarMassGMol: T.UBIT.molarMassGMol }));
must('the conversion round trips', rel(rt.concentrationPpm, 50) < 1e-14, rt.concentrationPpm);
w();
w('A colder gas is denser, so the same ppm is more mg/m3. The two functions are exact inverses at the same temperature and pressure. The plume returns mg/m3, and ppm only when a molar mass is given; a probit preset states which unit its coefficients expect (' + ref('toxic') + ').');

/* ============================================================ SECTION 13 */

section('reach', 'How far the plume reaches: the distance to a concentration', ['Associate m06']);
w('`plumeDistanceToConcentration` finds the downwind distances at which the centreline concentration at the receptor height equals a target. The states, from the engine header: REACHED, NOT_REACHED (the peak is below the target) and BEYOND_SEARCH_RANGE (still above the target at the largest distance searched).');
w();
const reach = (label, extra) => success(label, C.plumeDistanceToConcentration({ massRateKgS: T.UBIT.massRateKgS, windSpeedMS: T.UBIT.windSpeedMS, ...extra }));
w(`UBIT, ground level release and receptor, classes D and F, three targets (stated):`);
w();
const reachRows = ['D', 'F'].flatMap((k) => T.REACH_TARGETS.map((t) => ({ k, t, r: reach(`UBIT ${k} to ${t}`, { stabilityClass: k, targetConcentrationMgM3: t }) })));
table(['class', 'target mg/m3, stated', 'state', 'near distance m', 'far distance m'], reachRows.map(({ k, t, r }) => [k, String(t), r.state, f6(r.nearDistanceM), f6(r.farDistanceM)]));
must('ground level releases have one root only', reachRows.every(({ r }) => r.nearDistanceM === null && r.state === 'REACHED'), 'one root');
must('class F reaches further than D at every target', T.REACH_TARGETS.every((t, i) => reachRows[i + 3].r.farDistanceM > reachRows[i].r.farDistanceM), 'further');
w();
w('From the ground the concentration falls monotonically, so there is one distance. The round trip: the plume at the far distance returns the target.');
const rtp = success('round trip plume', C.gaussianPlume({ ...pbase, downwindDistanceM: reachRows[1].r.farDistanceM }));
w();
w(`Class D, target ${T.REACH_TARGETS[1]} mg/m3: at ${f6(reachRows[1].r.farDistanceM)} m the plume gives ${f6(rtp.concentrationMgM3)} mg/m3.`);
must('the round trip returns the target', rel(rtp.concentrationMgM3, T.REACH_TARGETS[1]) < 1e-9, rtp.concentrationMgM3);
w();
w(`FROM A STACK of ${T.STACK_HEIGHT_M} m (stated), receptor at ground level, class D. The concentration rises from nothing, peaks and falls, so a target below the peak is met twice:`);
w();
const stackRows = [...T.REACH_TARGETS, T.REACH_NOT_REACHED_MGM3].map((t) => ({ t, r: reach(`UBIT stack to ${t}`, { stabilityClass: 'D', targetConcentrationMgM3: t, releaseHeightM: T.STACK_HEIGHT_M }) }));
table(['target mg/m3, stated', 'state', 'peak mg/m3', 'peak distance m', 'near distance m', 'far distance m'], stackRows.map(({ t, r }) => [String(t), r.state, f6(r.peakConcentrationMgM3), f6(r.peakDistanceM), f6(r.nearDistanceM), f6(r.farDistanceM)]));
must('the stack gives two roots on a reached target', stackRows.some(({ r }) => r.state === 'REACHED' && r.nearDistanceM !== null), 'two roots');
must('the largest target is not reached', stackRows.at(-1).r.state === 'NOT_REACHED', stackRows.at(-1).r.state);
w();
const beyond = reach('UBIT F short search', { stabilityClass: 'F', targetConcentrationMgM3: T.REACH_TARGETS[2], maxDistanceM: T.REACH_SHORT_MAX_M });
w(`BEYOND THE SEARCH. Class F to ${T.REACH_TARGETS[2]} mg/m3 with the search capped at ${T.REACH_SHORT_MAX_M} m (stated) returns ${beyond.state} with a far distance of ${beyond.farDistanceM}: the plume is still above the target where the search stops, and the engine says so instead of returning the cap.`);
must('the short search is BEYOND_SEARCH_RANGE', beyond.state === 'BEYOND_SEARCH_RANGE' && beyond.farDistanceM === null, beyond.state);
w();
w(`The engine's method string, verbatim: "${reachRows[0].r.basis.model}".`);
w();
const cross = T.CROSSWIND_LADDER.map((y) => ({ y, r: success(`UBIT off axis ${y}`, C.gaussianPlume({ ...pbase, downwindDistanceM: 500, crosswindDistanceM: y })) }));
w('OFF THE CENTRELINE, 500 m downwind, class D, ground level release and receptor:');
w();
table(['crosswind m, stated', 'concentration mg/m3', 'over the centreline, derived'], cross.map(({ y, r }) => [String(y), f6(r.concentrationMgM3), f6(r.concentrationMgM3 / cross[0].r.concentrationMgM3)]));
must('the off axis ratio is the Gaussian factor', cross.every(({ y, r }) => rel(r.concentrationMgM3 / cross[0].r.concentrationMgM3, Math.exp(-(y * y) / (2 * r.sigmaYM * r.sigmaYM))) < 1e-12), 'gaussian');
w();
w('The ratio to the centreline is exp(-y^2 / 2 sigma_y^2): the distance to a concentration is ALWAYS a centreline distance, and a receptor to the side sees less.');

/* ============================================================ SECTION 14 */

section('burning', 'How fast a pool burns: Babrauskas and Burgess', ['Professional m01']);
w('THE SOLID FLAME MODEL treats a pool fire as a cylinder of flame with a uniform surface emissive power, and the heat flux at a target as that power times the fraction of the target\'s view the cylinder fills (the view factor) times the fraction the air lets through (the transmissivity). Every step starts from the burning flux.');
w();
w('BABRAUSKAS: m" = m"inf (1 - exp(-k beta D)), with m"inf and the k beta product from Yellow Book Table 6.5, exported as `POOL_FIRE_FUELS`:');
w();
table(['fuel key', 'm"inf kg/(m2 s)', 'k beta per m'], Object.entries(C.POOL_FIRE_FUELS).map(([k, v]) => [k, String(v.massBurningFluxInfKgM2S), v.kBetaPerM === null ? 'none, independent of the diameter' : String(v.kBetaPerM)]));
must('thirteen fuels', Object.keys(C.POOL_FIRE_FUELS).length === 13, Object.keys(C.POOL_FIRE_FUELS).length);
w();
w('A k beta of none means the table says the burning rate is independent of the diameter in the turbulent regime. The burning flux against the diameter (stated), for six fuels:');
w();
const burn = T.BURN_FUELS.map((f) => ({ f, rs: T.BURN_DIAMETERS.map((d) => success(`burn ${f} ${d}`, C.poolBurningRate({ method: 'babrauskas', fuel: f, poolDiameterM: d }))) }));
table(['diameter m, stated', ...T.BURN_FUELS], T.BURN_DIAMETERS.map((d, i) => [String(d), ...burn.map(({ rs }) => f6(rs[i].burningFluxKgM2S))]));
must('methanol is flat', burn.find((b) => b.f === 'methanol').rs.every((r) => r.burningFluxKgM2S === 0.015), 'flat');
const hep = burn.find((b) => b.f === 'heptane').rs;
w();
w(`WHEN THE DIAMETER STOPS MATTERING. At ${T.BURN_DIAMETERS.at(-1)} m every fuel with a k beta product sits at its asymptote to six decimals; heptane at ${T.BURN_DIAMETERS[0]} m burns at, derived, ${pct(hep[0].burningFluxKgM2S / C.POOL_FIRE_FUELS.heptane.massBurningFluxInfKgM2S)} of its asymptote. A large pool burns at m"inf, and its diameter then changes the area on fire but not the burning flux.`);
must('every fuel is at its asymptote to six decimals at the largest diameter', burn.every(({ f, rs }) => rs.at(-1).burningFluxKgM2S.toFixed(6) === C.POOL_FIRE_FUELS[f].massBurningFluxInfKgM2S.toFixed(6)), 'asymptote');
w();
const bg = success('Burgess hexane', C.poolBurningRate({ method: 'burgess', ...T.BURGESS_HEXANE }));
w(`BURGESS: "${bg.basis.model}", for a single-component liquid below its boiling point. n-hexane (stated): heat of combustion ${T.BURGESS_HEXANE.heatOfCombustionJKg} J/kg, heat of vaporisation ${T.BURGESS_HEXANE.heatOfVaporisationJKg} J/kg, liquid heat capacity ${T.BURGESS_HEXANE.liquidHeatCapacityJKgK} J/(kg K), boiling point ${T.BURGESS_HEXANE.boilingPointK} K, ambient ${T.BURGESS_HEXANE.ambientTemperatureK} K. Burning flux: ${f6(bg.burningFluxKgM2S)} kg/(m2 s). The Babrauskas asymptote for hexane is ${C.POOL_FIRE_FUELS.hexane.massBurningFluxInfKgM2S}.`);
w();
w(`A boiling point below ambient is refused, because the printed form would then shrink its denominator: "${C.poolBurningRate({ method: 'burgess', ...T.BURGESS_HEXANE, boilingPointK: 231 }).error}". Burgess is a SINGLE ROUTE quantity (${ref('singleroute')}), taught and never graded.`);

/* ============================================================ SECTION 15 */

section('flamelength', 'The flame length, in still air and with wind', ['Professional m02']);
const E = T.ERHA;
const eb = success('ERHA burning flux', C.poolBurningRate({ method: 'babrauskas', fuel: E.fuel, poolDiameterM: E.poolDiameterM }));
w(`ERHA is a heptane bund fire (stated): diameter ${E.poolDiameterM} m, air density ${E.airDensityKgM3} kg/m3. Its Babrauskas burning flux is ${f6(eb.burningFluxKgM2S)} kg/(m2 s).`);
w();
const still = success('ERHA still air', C.poolFireFlameLength({ method: 'thomas-still-air', poolDiameterM: E.poolDiameterM, burningFluxKgM2S: eb.burningFluxKgM2S, airDensityKgM3: E.airDensityKgM3 }));
w(`STILL AIR, Thomas: "${still.basis.model}". Flame length ${f6(still.flameLengthM)} m, L/D ${f6(still.lengthToDiameter)}. This is the same expression the facilities engine uses, imported and not restated.`);
w();
const wind0 = success('ERHA with wind', C.poolFireFlameLength({ method: 'thomas-wind', poolDiameterM: E.poolDiameterM, burningFluxKgM2S: eb.burningFluxKgM2S, airDensityKgM3: E.airDensityKgM3, windSpeed10mMS: 4 }));
w(`WITH WIND, Thomas as the Yellow Book states it: "${wind0.basis.model}". The characteristic wind speed uc = (g m" D / rho_air)^(1/3) is ${f6(wind0.characteristicWindSpeedMS)} m/s for ERHA. The wind swept (stated):`);
w();
const winds = T.WIND_LADDER.map((u) => ({ u, r: success(`ERHA wind ${u}`, C.poolFireFlameLength({ method: 'thomas-wind', poolDiameterM: E.poolDiameterM, burningFluxKgM2S: eb.burningFluxKgM2S, airDensityKgM3: E.airDensityKgM3, windSpeed10mMS: u })) }));
table(['wind at 10 m, m/s, stated', 'scaled wind speed u*', 'L/D', 'flame length m'], winds.map(({ u, r }) => [String(u), f6(r.scaledWindSpeed), f6(r.lengthToDiameter), f6(r.flameLengthM)]));
must('u* is held at one below uc', winds.filter(({ u }) => u < wind0.characteristicWindSpeedMS).every(({ r }) => r.scaledWindSpeed === 1), 'held');
must('the flame shortens as the wind rises above uc', winds.filter(({ r }) => r.scaledWindSpeed > 1).every((x, i, arr) => i === 0 || x.r.flameLengthM < arr[i - 1].r.flameLengthM), 'shortens');
const lowWindSame = winds.filter(({ u }) => u < wind0.characteristicWindSpeedMS);
must('every wind below uc gives the same length', lowWindSame.every(({ r }) => r.flameLengthM === lowWindSame[0].r.flameLengthM), 'same');
w();
w(`Below uc the scaled wind speed is HELD AT ONE, so every wind below ${f6(wind0.characteristicWindSpeedMS)} m/s gives the same length, ${f6(lowWindSame[0].r.flameLengthM)} m, including no wind at all. Above it the flame SHORTENS as the wind rises, as u*^-0.21. The wind form at no wind (${f6(lowWindSame[0].r.flameLengthM)} m) is a different correlation from the still air form (${f6(still.flameLengthM)} m); the method is named in every call and the two are not interchangeable.`);
must('the two correlations differ', lowWindSame[0].r.flameLengthM !== still.flameLengthM, 'differ');

/* ============================================================ SECTION 16 */

section('tilt', 'The flame tilt', ['Professional m03']);
const tl = success('ERHA tilt at 4', C.poolFireTilt({ poolDiameterM: E.poolDiameterM, windSpeed10mMS: 4, airKinematicViscosityM2S: E.airKinematicViscosityM2S }));
w(`The engine's model string, verbatim: "${tl.basis.model}". Fr10 = u10^2 / (g D) and Re = u10 D / nu, with nu the kinematic viscosity of air, an input with no default. ERHA with nu ${E.airKinematicViscosityM2S} m2/s (stated):`);
w();
const tilts = T.WIND_LADDER.map((u) => ({ u, r: success(`ERHA tilt ${u}`, C.poolFireTilt({ poolDiameterM: E.poolDiameterM, windSpeed10mMS: u, airKinematicViscosityM2S: E.airKinematicViscosityM2S })) }));
table(['wind m/s, stated', 'Froude number', 'Reynolds number', 'tilt parameter c', 'tilt degrees from the vertical'], tilts.map(({ u, r }) => [String(u), f6(r.froudeNumber), f6(r.reynoldsNumber), f6(r.tiltParameter), f6(r.tiltDeg)]));
must('no wind, no tilt', tilts[0].r.tiltDeg === 0, tilts[0].r.tiltDeg);
must('tilt rises with wind', tilts.every((x, i) => i === 0 || x.r.tiltDeg > tilts[i - 1].r.tiltDeg), 'rises');
w();
w('No wind, no tilt. The Reynolds number enters only to the power 0.117, so the viscosity matters weakly: the Yellow Book example used a viscosity half the physical value for air at 15 C (' + ref('ybpoolfire') + ').');

/* ============================================================ SECTION 17 */

section('sep', 'Surface emissive power: three methods', ['Professional m03']);
const sepd = T.SEP_DIAMETERS.map((d) => ({ d, r: success(`Mudan SEP ${d}`, C.surfaceEmissivePower({ method: 'mudan-diameter', poolDiameterM: d })) }));
w(`FROM THE DIAMETER, Mudan: "${sepd[0].r.basis.model}". A large sooty fire hides its bright core behind smoke, so the power falls toward 20e3 W/m2 as the pool grows:`);
w();
table(['diameter m, stated', 'surface emissive power W/m2'], sepd.map(({ d, r }) => [String(d), f6(r.surfaceEmissivePowerWM2)]));
must('Mudan falls with diameter toward 20e3', sepd.every((x, i) => i === 0 || x.r.surfaceEmissivePowerWM2 < sepd[i - 1].r.surfaceEmissivePowerWM2) && sepd.at(-1).r.surfaceEmissivePowerWM2 > 20000, 'falls');
w();
const eLen = success('ERHA length at 4 for SEP', C.poolFireFlameLength({ method: 'thomas-wind', poolDiameterM: E.poolDiameterM, burningFluxKgM2S: eb.burningFluxKgM2S, airDensityKgM3: E.airDensityKgM3, windSpeed10mMS: T.ERHA_WIND }));
const sepArgs = { poolDiameterM: E.poolDiameterM, radiativeFraction: E.radiativeFraction, burningFluxKgM2S: eb.burningFluxKgM2S, heatOfCombustionJKg: E.heatOfCombustionJKg, flameLengthM: eLen.flameLengthM };
const sepMax = success('ERHA SEPmax', C.surfaceEmissivePower({ method: 'radiative-fraction', ...sepArgs }));
const sepAct = success('ERHA SEPact', C.surfaceEmissivePower({ method: 'radiative-fraction-soot', ...sepArgs, sootFraction: E.sootFraction }));
const sepMud = success('ERHA Mudan', C.surfaceEmissivePower({ method: 'mudan-diameter', poolDiameterM: E.poolDiameterM }));
w(`FROM THE RADIATIVE FRACTION: "${sepMax.basis.model}". The radiative fraction Fs is the caller's (the Yellow Book: 0.1 to 0.4). WITH SOOT: "${sepAct.basis.model}", the soot fraction the caller's (the Yellow Book quotes 0.8 for oil products) and the soot emissive power 20e3 W/m2 by default.`);
w();
w(`ERHA at a ${T.ERHA_WIND} m/s wind (stated), flame length ${f6(eLen.flameLengthM)} m, heat of combustion ${E.heatOfCombustionJKg} J/kg, radiative fraction ${E.radiativeFraction}, soot fraction ${E.sootFraction} (stated):`);
w();
table(['method', 'surface emissive power W/m2'], [
  ['mudan-diameter', f6(sepMud.surfaceEmissivePowerWM2)],
  ['radiative-fraction (the clear flame, SEPmax)', f6(sepMax.surfaceEmissivePowerWM2)],
  ['radiative-fraction-soot (SEPact)', f6(sepAct.surfaceEmissivePowerWM2)],
]);
must('SEPact is the soot mix of SEPmax and 20e3', rel(sepAct.surfaceEmissivePowerWM2, sepMax.surfaceEmissivePowerWM2 * (1 - E.sootFraction) + 20000 * E.sootFraction) < 1e-14, 'mix');
must('the three methods disagree', new Set([sepMud, sepMax, sepAct].map((s) => s.surfaceEmissivePowerWM2.toFixed(0))).size === 3, 'disagree');
w();
w('The three methods give three different answers for one fire. That is why every call names its method, and why a heat flux is quoted with the method that made it.');

/* ============================================================ SECTION 18 */

section('viewfactor', 'The view factor of a cylindrical flame', ['Professional m04']);
const vf0 = success('view factor basis', C.cylinderViewFactor({ flameRadiusM: 10, flameLengthM: 30, distanceFromAxisM: 30 }));
w(`The engine's model strings, verbatim: at zero tilt "${vf0.basis.model}"; with tilt "${success('tilted basis', C.cylinderViewFactor({ flameRadiusM: 10, flameLengthM: 30, distanceFromAxisM: 30, tiltDeg: 20 })).basis.model}". a = L / R and b = X / R, with X the distance from the axis of the flame base to a small target at ground level. Fv is the view factor of a vertical target facing the flame, Fh of a horizontal one, and Fmax = sqrt(Fv^2 + Fh^2) is the most exposed orientation.`);
w();
w('A flame of radius 10 m and length 30 m (stated), targets swept, three tilts toward the target (stated):');
w();
const vfr = T.VF_TILTS.flatMap((t) => T.VF_TARGETS.map((x) => {
  const r = C.cylinderViewFactor({ flameRadiusM: 10, flameLengthM: 30, distanceFromAxisM: x, tiltDeg: t });
  return { t, x, r };
}));
T.VF_TILTS.forEach((t, ti) => {
  if (ti) w();
  w(`Tilt ${t} degrees toward the target (stated):`);
  w();
  table(['distance from axis m, stated', 'Fv', 'Fh', 'Fmax', 'or the refusal field'], vfr.filter((v) => v.t === t).map(({ x, r }) => (r.error ? [String(x), '', '', '', `\`${r.field}\``] : [String(x), f12(r.viewFactorVertical), f12(r.viewFactorHorizontal), f12(r.viewFactorMax), ''])));
});
vfr.filter(({ r }) => !r.error).forEach(({ t, x, r }) => must(`Fmax is the vector sum at ${t} ${x}`, rel(r.viewFactorMax, Math.hypot(r.viewFactorVertical, r.viewFactorHorizontal)) < 1e-15, 'hypot'));
const vfRef = vfr.filter(({ r }) => r.error);
must('some tilted near targets are refused and every refusal names tiltDeg', vfRef.length > 0 && vfRef.every(({ r }) => r.field === 'tiltDeg'), vfRef.length);
const vfAt = (t, x) => vfr.find((v) => v.t === t && v.x === x).r;
must('tilting toward the target raises Fmax at 50 m', vfAt(40, 50).viewFactorMax > vfAt(0, 50).viewFactorMax, 'raises');
w();
w(`Tilt toward the target raises the view factor: at 50 m Fmax goes from ${f12(vfAt(0, 50).viewFactorMax)} upright to ${f12(vfAt(40, 50).viewFactorMax)} at 40 degrees. The rows with a refusal field are targets the tilted flame reaches over.`);
w();
w(`A FLAME OVER THE TARGET IS REFUSED. The engine refuses when 1 + a sin(tilt) is at or above b: "${C.cylinderViewFactor(T.VF_OVERHANG).error}". The engine's validation record shows why with its second route, a numerical integration over the visible flame surface (golden):`);
w();
table(['probe, golden', 'closed form Fv', 'route B Fv', 'closed form Fh', 'route B Fh'], GOLD.fires.overhangDeparture.map((o) => [`a ${o.a}, b ${o.b}, tilt ${o.tiltDeg} degrees`, f6(o.closedFormFv), f6(o.routeBFv), f6(o.closedFormFh), f6(o.routeBFh)]));
must('in every overhang probe Fv departs and Fh does not', GOLD.fires.overhangDeparture.every((o) => Math.abs(o.closedFormFv - o.routeBFv) > 1e-3 && Math.abs(o.closedFormFh - o.routeBFh) < 1e-9), 'departs');
w();
w('Under the flame the closed form counts flame surface behind the target as seen, and its Fv is wrong while Fh stays right. The refusal is the engine\'s judgement, because the Yellow Book states no domain for the formula.');
w();
w(`A target at or inside the flame base is refused too: "${C.cylinderViewFactor({ flameRadiusM: 10, flameLengthM: 30, distanceFromAxisM: 8 }).error}".`);
w();
const gvf = GOLD.fires.viewFactor.filter((c) => c.routeB);
w(`THE SECOND ROUTE ON EVERY GOLDEN VIEW FACTOR (golden): ${gvf.length} cases where the closed form and a 400 by 400 Gauss-Legendre integration agree.`);
w();
table(['golden case', 'engine Fv', 'route B Fv', 'engine Fh', 'route B Fh'], gvf.map((c) => {
  const r = success(`golden vf ${c.id}`, C.cylinderViewFactor(c.args));
  must(`golden vf ${c.id} agrees with route B to 1e-9`, Math.abs(r.viewFactorVertical - c.routeB.viewFactorVertical) < 1e-9 && Math.abs(r.viewFactorHorizontal - c.routeB.viewFactorHorizontal) < 1e-9, c.id);
  return [c.id, f12(r.viewFactorVertical), f12(c.routeB.viewFactorVertical), f12(r.viewFactorHorizontal), f12(c.routeB.viewFactorHorizontal)];
}));
w();
const mis = GOLD.fires.rajTableMisprints;
w(`THE PRINTED TABLE (golden). The Yellow Book's Table 6.A.1 prints the Raj view factors times 1000; ${GOLD.fires.rajTable.length} cells reproduce to the last printed digit, and ${mis.length} Fmax cells do not follow from their own Fh and Fv:`);
w();
table(['table', 'X/R', 'L/R', 'printed', 'computed x 1000'], mis.map((m) => [m.table, String(m.xr), String(m.hr), String(m.printed), f6(m.computed1e3)]));
must('the misprints are two', mis.length === 2, mis.length);

/* ============================================================ SECTION 19 */

section('transmissivity', 'Atmospheric transmissivity by the Bagster fit', ['Professional m05']);
const bg1 = success('Bagster basis', C.atmosphericTransmissivityBagster({ waterVapourPartialPressurePa: T.BAGSTER_PW, pathLengthM: 30 }));
w(`The engine's model string, verbatim: "${bg1.basis.model}". pw is the partial pressure of water vapour in Pa (relative humidity times the saturation pressure) and x is the path length FROM THE FLAME SURFACE to the target, in m. With pw ${T.BAGSTER_PW} Pa (stated):`);
w();
const bgs = T.BAGSTER_PATHS.map((x) => ({ x, r: C.atmosphericTransmissivityBagster({ waterVapourPartialPressurePa: T.BAGSTER_PW, pathLengthM: x }) }));
table(['path m, stated', 'pw x N/m, derived', 'transmissivity, or the refusal field'], bgs.map(({ x, r }) => [String(x), f6(T.BAGSTER_PW * x), r.error ? `\`${r.field}\`` : f6(r.transmissivity)]));
must('outside the band is refused', bgs.filter(({ x }) => T.BAGSTER_PW * x < 1e4 || T.BAGSTER_PW * x > 1e5).every(({ r }) => r.error && r.field === 'pathLengthM'), 'refused');
must('inside the band is computed', bgs.filter(({ x }) => T.BAGSTER_PW * x >= 1e4 && T.BAGSTER_PW * x <= 1e5).every(({ r }) => !r.error), 'computed');
w();
w(`Outside 1e4 to 1e5 N/m the engine refuses, because the Yellow Book advises against the fit there, and below about 2.5e3 N/m the fit would exceed one: "${bgs[0].r.error}". The caller then supplies a transmissivity from another source. Bagster is a SINGLE ROUTE quantity (${ref('singleroute')}): taught, and never a graded answer.`);

/* ============================================================ SECTION 20 */

section('solidflame', 'The heat flux, and the distance to a heat flux', ['Professional m05']);
const hf = success('solid flame basis', C.solidFlameHeatFlux({ surfaceEmissivePowerWM2: sepAct.surfaceEmissivePowerWM2, viewFactor: vfAt(0, 50).viewFactorMax, transmissivity: T.ERHA_TAU }));
w(`The engine's model string, verbatim: "${hf.basis.model}". The heat flux is a PRODUCT of three factors, and \`poolFireSolidFlame\` chains every step from a pool to a heat flux.`);
w();
const solidArgs = {
  poolDiameterM: E.poolDiameterM, burningFluxKgM2S: eb.burningFluxKgM2S, heatOfCombustionJKg: E.heatOfCombustionJKg,
  flameLengthMethod: 'thomas-wind', airDensityKgM3: E.airDensityKgM3, windSpeed10mMS: T.ERHA_WIND,
  airKinematicViscosityM2S: E.airKinematicViscosityM2S, sep: { method: 'radiative-fraction-soot', radiativeFraction: E.radiativeFraction, sootFraction: E.sootFraction },
  transmissivity: T.ERHA_TAU,
};
w(`ERHA end to end (stated): the ${E.fuel} Babrauskas burning flux, Thomas with a ${T.ERHA_WIND} m/s wind, the tilt at nu ${E.airKinematicViscosityM2S}, the soot surface emissive power, a STATED transmissivity of ${T.ERHA_TAU}, targets downwind at distances from the pool centre:`);
w();
const sf = T.ERHA_DISTANCES.map((x) => ({ x, r: C.poolFireSolidFlame({ ...solidArgs, distanceFromCentreM: x }) }));
table(['distance from centre m, stated', 'flame length m', 'tilt degrees', 'surface emissive power W/m2', 'Fmax', 'heat flux W/m2, or the refusal field'], sf.map(({ x, r }) => (r.error ? [String(x), '', '', '', '', `\`${r.field}\``] : [String(x), f6(r.flameLengthM), f6(r.tiltDeg), f6(r.surfaceEmissivePowerWM2), f12(r.viewFactorMax), f6(r.heatFluxWM2)])));
const sfOk = sf.filter(({ r }) => !r.error);
must('the composite equals the product', sfOk.every(({ r }) => rel(r.heatFluxWM2, r.surfaceEmissivePowerWM2 * r.viewFactorMax * r.transmissivity) < 1e-15), 'product');
must('the composite heat flux falls with distance', sfOk.every((x, i) => i === 0 || x.r.heatFluxWM2 < sfOk[i - 1].r.heatFluxWM2), 'falls');
must('the composite surface emissive power is the soot value', sfOk.every(({ r }) => r.surfaceEmissivePowerWM2 === sepAct.surfaceEmissivePowerWM2), 'soot');
w();
w(`The flame base radius is D/2: the engine does not elongate the base in the wind, which matches the Yellow Book's own worked step. The heat flux uses Fmax, the most exposed target orientation. Where the table shows a refusal field the tilted flame reaches over the target (${ref('viewfactor')}).`);
w();
w('THE DISTANCE TO A HEAT FLUX, by bisection, with the same stated transmissivity (the search refuses without one, because a root search would walk out of the Bagster band):');
w();
const dh = T.HEAT_FLUX_TARGETS.map((q) => ({ q, r: success(`ERHA distance to ${q}`, C.solidFlameDistanceForHeatFlux({ ...solidArgs, targetHeatFluxWM2: q })) }));
table(['target heat flux W/m2, stated', 'state', 'distance from centre m', 'distance from edge m'], dh.map(({ q, r }) => [String(q), r.state, f6(r.distanceFromCentreM), r.distanceFromEdgeM === undefined ? 'null' : f6(r.distanceFromEdgeM)]));
dh.filter(({ r }) => r.state === 'REACHED').forEach(({ q, r }) => {
  const back = C.poolFireSolidFlame({ ...solidArgs, distanceFromCentreM: r.distanceFromCentreM });
  must(`the distance to ${q} round trips`, rel(back.heatFluxWM2, q) < 1e-9, back.heatFluxWM2);
});
must('at least one target is NOT_REACHED or REACHED', dh.some(({ r }) => r.state === 'REACHED'), 'reached');
w();
w(`The engine's method, verbatim: "${dh.find(({ r }) => r.state === 'REACHED').r.basis.model}". A target the heat flux never reaches even at the flame returns NOT_REACHED with the largest heat flux it found; one still exceeded at the search limit returns BEYOND_SEARCH_RANGE.`);

/* ============================================================ SECTION 21 */

section('ybpoolfire', 'The Yellow Book pool fire, reproduced step by step, and its errata', ['Professional m06']);
const yb = GOLD.fires.ybPoolFire;
w(`Source (golden): ${yb.source}.`);
w();
const ybr = success('the YB pool fire', C.poolFireSolidFlame(yb.args));
const ybLen = success('YB length', C.poolFireFlameLength({ method: 'thomas-wind', poolDiameterM: yb.args.poolDiameterM, burningFluxKgM2S: yb.args.burningFluxKgM2S, airDensityKgM3: yb.args.airDensityKgM3, windSpeed10mMS: yb.args.windSpeed10mMS }));
const ybTilt = success('YB tilt', C.poolFireTilt({ poolDiameterM: yb.args.poolDiameterM, windSpeed10mMS: yb.args.windSpeed10mMS, airKinematicViscosityM2S: yb.args.airKinematicViscosityM2S }));
const ybMud = success('YB Mudan', C.surfaceEmissivePower({ method: 'mudan-diameter', poolDiameterM: yb.args.poolDiameterM }));
const ybMax = success('YB SEPmax', C.surfaceEmissivePower({ method: 'radiative-fraction', poolDiameterM: yb.args.poolDiameterM, radiativeFraction: yb.args.sep.radiativeFraction, burningFluxKgM2S: yb.args.burningFluxKgM2S, heatOfCombustionJKg: yb.args.heatOfCombustionJKg, flameLengthM: ybLen.flameLengthM }));
const steps = [
  ['characteristic wind speed m/s', ybLen.characteristicWindSpeedMS, 'characteristicWindSpeedMS'],
  ['scaled wind speed', ybLen.scaledWindSpeed, 'scaledWindSpeed'],
  ['L/D', ybLen.lengthToDiameter, 'lengthToDiameter'],
  ['flame length m', ybr.flameLengthM, 'flameLengthM'],
  ['Reynolds number', ybTilt.reynoldsNumber, 'reynoldsNumber'],
  ['tilt parameter tan/cos', ybTilt.tiltParameter, 'tiltParameter'],
  ['tilt degrees', ybr.tiltDeg, 'tiltDeg'],
  ['surface emissive power, Mudan W/m2', ybMud.surfaceEmissivePowerWM2, 'sepMudan'],
  ['surface emissive power, clear flame W/m2', ybMax.surfaceEmissivePowerWM2, 'sepMax'],
  ['surface emissive power, with soot W/m2', ybr.surfaceEmissivePowerWM2, 'sepAct'],
  ['Fv', ybr.viewFactorVertical, 'viewFactorVertical'],
  ['Fh', ybr.viewFactorHorizontal, 'viewFactorHorizontal'],
  ['Fmax', ybr.viewFactorMax, 'viewFactorMax'],
  ['heat flux at 100 m from the centre W/m2', ybr.heatFluxWM2, 'heatFluxWM2'],
];
table(['step', 'engine', 'printed', 'relative difference', 'tolerance the golden allows'], steps.map(([label, v, k]) => {
  const p = yb.printed[k];
  const tol = yb.publishedRelTol[k];
  must(`YB step ${k} reproduces within its tolerance`, rel(v, p) <= tol, `${v} ${p} ${tol}`);
  return [label, /^(Fv|Fh|Fmax)$/.test(label) ? f12(v) : f6(v), String(p), relE(v, p), String(tol)];
}));
w();
w(`Every step reproduces within the tolerance the golden states for it, with the example's own inputs: the transmissivity as printed (${yb.args.transmissivity}, read from charts) and the air viscosity as printed (${yb.args.airKinematicViscosityM2S} m2/s).`);
w();
w('THE ERRATA IN THIS EXAMPLE, each a fact about the published source:');
w();
table(['what is printed', 'what the numbers say'], [
  [`Froude number ${yb.printed.froudeNumber}`, `u10^2 / (g D) is ${f6(ybTilt.froudeNumber)}, and the printed tilt parameter and tilt follow only from that value`],
  [`air viscosity ${yb.args.airKinematicViscosityM2S} m2/s "for air at 15 C"`, 'air at 15 C is about twice that; the golden uses the printed value because the printed tilt depends on it, and the Reynolds number enters only to the power 0.117'],
  ['"50 m from the flame surface" in three steps', 'the steps compute with 100 m, the distance from the pool centre given in the inputs'],
]);
must('the Froude erratum is real', Math.abs(ybTilt.froudeNumber - yb.printed.froudeNumber) > 0.005 && rel(ybTilt.froudeNumber, yb.intermediate.froudeNumber) < 1e-12, ybTilt.froudeNumber);

/* ============================================================ SECTION 22 */

section('seam', 'What this course does not grade: the seams with other courses', ['Professional m05 l04', 'Expert m06 l02']);
w('POINT SOURCE HEAT RADIATION. The facilities engines carry a point source model (the flame treated as a point that radiates a fraction of its heat release equally in every direction) and the flare and pool fire setbacks it implies; the Facilities courses on relief and flare systems and on layout teach and grade them. This engine does not re-expose them, and its validation record carries a test that asserts it exports none of them. This course adds the solid flame model, which the facilities pool fire setback states it does not provide, and grades only the solid flame.');
w();
w('FREQUENCIES AND RISK. A consequence model answers what happens if the release occurs. How often it occurs, and the risk a person or a population carries as a result, is the later quantitative risk course: individual risk, the potential loss of life and the F-N curve belong there, and this course never computes or grades one. The academy\'s risk matrices belong to the risk and change course.');
w();
w('EMISSIONS AND PRODUCED WATER. Routine emissions and their accounting, produced water treatment and tank vapour losses are other courses\' subjects. This course models an accidental release and nothing routine.');

/* ============================================================ SECTION 23 */

section('tnt', 'The TNT equivalent mass', ['Expert m01']);
const tn = success('BONGA TNT', C.tntEquivalentMass(T.BONGA_TNT));
w(`The engine's model string, verbatim: "${tn.basis.model}", with alpha_e the yield factor, Qf the fuel mass, Emf its heat of combustion and Em_TNT the TNT blast energy. BONGA is a butane cloud (stated): ${T.BONGA_TNT.fuelMassKg} kg, heat of combustion ${T.BONGA_TNT.heatOfCombustionJKg} J/kg, TNT blast energy ${T.BONGA_TNT.tntBlastEnergyJKg} J/kg.`);
w();
const yl = T.YIELD_LADDER.map((a) => ({ a, r: success(`BONGA yield ${a}`, C.tntEquivalentMass({ ...T.BONGA_TNT, yieldFactor: a })) }));
table(['yield factor, stated', 'TNT equivalent mass kg'], yl.map(({ a, r }) => [String(a), f6(r.tntMassKg)]));
must('the TNT mass is linear in the yield', rel(yl[1].r.tntMassKg / yl[0].r.tntMassKg, 2) < 1e-14, 'linear');
w();
w(`The yield factor is the caller's (the Yellow Book reports 0.02 to 0.2 in use), and the TNT mass is linear in it. The TNT blast energy is refused outside 4.0e6 to 5.0e6 J/kg to catch a units slip: "${C.tntEquivalentMass({ ...T.BONGA_TNT, tntBlastEnergyJKg: 4600 }).error}". TNT equivalence is a SINGLE ROUTE quantity (${ref('singleroute')}).`);

/* ============================================================ SECTION 24 */

section('kinneygraham', 'Cube root scaling and the Kinney and Graham overpressure', ['Expert m01', 'Expert m02']);
const sd = success('scaled distance basis', C.scaledDistance({ distanceM: 100, tntMassKg: T.BONGA_CHARGE_KG }));
w(`SCALED DISTANCE. The engine's model string, verbatim: "${sd.basis.model}". Two charges give the same overpressure at the same Z: a charge eight times heavier gives it at twice the distance.`);
w();
const kg1 = success('KG basis', C.kinneyGrahamOverpressure({ scaledDistanceMKg13: 1 }));
w(`THE OVERPRESSURE. The engine's model string, verbatim: "${kg1.basis.model}". Its range, verbatim: "${kg1.basis.validRange}". The ratio over ambient against Z (stated):`);
w();
const zr = T.Z_LADDER.map((z) => ({ z, r: success(`KG at Z ${z}`, C.kinneyGrahamOverpressure({ scaledDistanceMKg13: z })) }));
table(['Z m/kg^(1/3), stated', 'overpressure over ambient', 'overpressure Pa'], zr.map(({ z, r }) => [String(z), f6(r.overpressureRatio), f6(r.overpressurePa)]));
must('the overpressure falls with Z', zr.every((x, i) => i === 0 || x.r.overpressurePa < zr[i - 1].r.overpressurePa), 'falls');
w();
w(`BONGA's charge of ${T.BONGA_CHARGE_KG} kg of TNT (stated) at distances (stated):`);
w();
const bd = T.BONGA_DISTANCES.map((x) => ({ x, r: success(`BONGA at ${x}`, C.kinneyGrahamOverpressure({ distanceM: x, tntMassKg: T.BONGA_CHARGE_KG })) }));
table(['distance m, stated', 'Z m/kg^(1/3)', 'overpressure Pa'], bd.map(({ x, r }) => [String(x), f6(r.scaledDistanceMKg13), f6(r.overpressurePa)]));
const eight = success('eight times the charge at twice the distance', C.kinneyGrahamOverpressure({ distanceM: 2 * T.BONGA_DISTANCES[2], tntMassKg: 8 * T.BONGA_CHARGE_KG }));
w();
w(`Eight times the charge at twice ${T.BONGA_DISTANCES[2]} m gives ${f6(eight.overpressurePa)} Pa, against ${f6(bd[2].r.overpressurePa)} Pa for the original charge at ${T.BONGA_DISTANCES[2]} m: the same Z, the same overpressure.`);
must('cube root scaling holds', rel(eight.overpressurePa, bd[2].r.overpressurePa) < 1e-12, 'scaling');
w();
w(`THE RANGE THE FIT IS USED OVER is Z from ${C.KINNEY_GRAHAM_Z_RANGE.min} to ${C.KINNEY_GRAHAM_Z_RANGE.max}. The engine's validation record calls this a JUDGEMENT: the sources it read print no range for the Kinney and Graham fit itself, and the span is borrowed from the Kingery-Bulmash compilation. Outside it the engine refuses: "${C.kinneyGrahamOverpressure({ scaledDistanceMKg13: 60 }).error}".`);
w();
const cbu = GOLD.explosions.kinneyGraham.filter((c) => typeof c.printedKPa === 'number');
w(`THE PUBLISHED COLUMN (golden): ${cbu.length} values from a 2020 conference paper's table, at an ambient of 101.325 kPa.`);
w();
table(['golden case', 'engine kPa', 'printed kPa', 'relative difference'], cbu.map((c) => {
  const r = success(`CBU ${c.id}`, C.kinneyGrahamOverpressure(c.args));
  must(`CBU ${c.id} reproduces`, rel(r.overpressurePa / 1000, c.printedKPa) < c.publishedRelTol, r.overpressurePa);
  return [c.id, f6(r.overpressurePa / 1000), String(c.printedKPa), relE(r.overpressurePa / 1000, c.printedKPa)];
}));
w();
w('PRINTED CONSTANTS AND A COMPUTED COLUMN. The paper PRINTS the formula with 800 and 0.049, but its own column follows 808 and 0.048, the constants the engine uses and two other sources print. The column is the evidence, and the golden is labelled PUBLISHED because its numbers reproduce. The engine\'s validation record names this table as secondary.');
must('the CBU source line says so', cbu.some((c) => /800|0\.049/.test(c.source)), 'recorded');

/* ============================================================ SECTION 25 */

section('blastinverse', 'The distance for an overpressure, and what a free air burst leaves out', ['Expert m02']);
w(`\`distanceForOverpressure\` inverts the fit by bisection on Z. BONGA's ${T.BONGA_CHARGE_KG} kg, targets (stated):`);
w();
const inv = T.OVERPRESSURE_TARGETS.map((p) => ({ p, r: success(`BONGA inverse ${p}`, C.distanceForOverpressure({ tntMassKg: T.BONGA_CHARGE_KG, overpressurePa: p })) }));
table(['overpressure Pa, stated', 'Z m/kg^(1/3)', 'distance m'], inv.map(({ p, r }) => [String(p), f6(r.scaledDistanceMKg13), f6(r.distanceM)]));
inv.forEach(({ p, r }) => must(`inverse at ${p} round trips`, rel(C.kinneyGrahamOverpressure({ scaledDistanceMKg13: r.scaledDistanceMKg13 }).overpressurePa, p) < 1e-9, p));
w();
w(`The engine's method, verbatim: "${inv[0].r.basis.model}". Every row round trips through the forward fit. An overpressure the fit cannot give inside its range is refused: "${C.distanceForOverpressure({ tntMassKg: 500, overpressurePa: 500 }).error}".`);
w();
w('WHAT A FREE AIR BURST LEAVES OUT. The fit is a FREE AIR burst of TNT. A burst at the ground reflects its shock and is not modelled; the engine header says that is the caller\'s choice of charge weight. A vapour cloud is not TNT: the yield factor carries the whole difference, and the TNO multi-energy method, which treats congestion, is not in the engine (' + ref('notdone') + ').');
must('the free air statement is in the engine header', /surface \(hemispherical\) burst is NOT modelled/.test(ENGINE_SRC), 'header');

/* ============================================================ SECTION 26 */

section('probitbasics', 'A probit and a probability', ['Expert m03']);
const pp = success('probit 5', C.probitToProbability(5));
w(`The engine's model string, verbatim: "${pp.basis.model}". A probit Y is a normal deviate shifted by five, so Y = 5 is a probability of one half. The ladder (stated):`);
w();
const pl = T.PROBIT_LADDER.map((y) => ({ y, r: success(`probit ${y}`, C.probitToProbability(y)) }));
table(['probit, stated', 'probability'], pl.map(({ y, r }) => [String(y), f6(r.probability)]));
must('Y 5 is a half to six decimals', pl.find((x) => x.y === 5).r.probability.toFixed(6) === '0.500000', pl.find((x) => x.y === 5).r.probability);
w();
const t51 = GOLD.probits.table51;
const t51ok = t51.filter((c) => {
  const r = C.probabilityToProbit(c.probability);
  return !r.error && r.probit.toFixed(2) === c.printedProbit.toFixed(2);
});
w(`THE PRINTED TABLE (golden). The Purple Book's Table 5.1 prints the probit for a probability to two decimals. ${t51.length} cells are in the golden; the engine's inverse reproduces ${t51ok.length} of them to the printed two decimals. A selection:`);
w();
const pick = t51.filter((c) => [0.01, 0.05, 0.1, 0.25, 0.5, 0.75, 0.9, 0.99].includes(c.probability));
table(['probability', 'printed probit', 'engine probit'], pick.map((c) => [String(c.probability), c.printedProbit.toFixed(2), f6(C.probabilityToProbit(c.probability).probit)]));
must('every cell reproduces to two decimals', t51ok.length === t51.length, `${t51ok.length} of ${t51.length}`);
w();
const t51m = GOLD.probits.table51Misprints;
w(`${t51m.length} more cells sit on a rounding edge (golden): ${t51m.map((c) => `probability ${c.probability} printed ${c.printedProbit.toFixed(2)} where the value is ${f6(c.probit)}`).join('; ')}. They are within 0.006 of the printed digits and the golden keeps them apart.`);
w();
w(`GENERAL FORM. \`probit\` computes Y = a + b ln(V) and its probability for any coefficients and any thermal dose or toxic load; its model string, verbatim: "${success('probit basis', C.probit({ a: 1, b: 1, dose: 2 })).basis.model}". The logarithm is NATURAL.`);

/* ============================================================ SECTION 27 */

section('thermal', 'Thermal probits and the four thirds', ['Expert m03']);
w('`THERMAL_PROBITS`, Y = a + b ln(t I^(4/3)), t in seconds and I in the unit each source prints:');
w();
table(['preset', 'a', 'b', 'intensity unit', 'source, verbatim'], Object.entries(C.THERMAL_PROBITS).map(([k, v]) => [k, String(v.a), String(v.b), v.intensityUnit, v.source]));
must('four thermal presets', Object.keys(C.THERMAL_PROBITS).length === 4, 'four');
w();
w('THE THERMAL DOSE is t I^(4/3). Each preset is fed the heat flux in W/m2 and converts it to its own unit. Heat fluxes and exposure times (stated), every preset:');
w();
const thr = T.THERMAL_FLUXES_WM2.flatMap((q) => T.THERMAL_TIMES_S.map((t) => ({ q, t, rs: Object.keys(C.THERMAL_PROBITS).map((k) => success(`thermal ${k} ${q} ${t}`, C.thermalProbit({ coefficients: k, heatFluxWM2: q, exposureTimeS: t }))) })));
table(['exposure, stated', ...Object.keys(C.THERMAL_PROBITS).map((k) => `${k} probability`)], thr.map(({ q, t, rs }) => [`${q} W/m2 for ${t} s`, ...rs.map((r) => f6(r.probability))]));
const e20 = thr.find((x) => x.q === 20000 && x.t === 20).rs;
w();
w(`At 20000 W/m2 for 20 s the Eisenberg probit is ${f6(e20[0].probit)} with the thermal dose ${f6(e20[0].dose)} in ${e20[0].doseUnit}; Tsao and Perry gives ${f6(e20[1].probit)}, derived ${f6(e20[1].probit - e20[0].probit)} probit units higher, and the Purple Book form gives ${f6(e20[3].probit)}.`);
must('Tsao and Perry sits 2.1 above Eisenberg', Math.abs(e20[1].probit - e20[0].probit - 2.1) < 1e-12, e20[1].probit - e20[0].probit);
must('one exposure reads a few percent under Eisenberg and over half under Tsao and Perry', e20[0].probability < 0.05 && e20[1].probability > 0.5, `${e20[0].probability} ${e20[1].probability}`);
must('the Purple Book form sits with Tsao and Perry to three decimals', Math.abs(e20[3].probit - e20[1].probit) < 2e-3, e20[3].probit - e20[1].probit);
w();
w('NOT EVERY "TNO" HEAT PROBIT IS EISENBERG. The Purple Book\'s -36.38 + 2.56 ln(Q^(4/3) t) with Q in W/m2 is Tsao and Perry rewritten in W/m2: -12.8 - 2.56 ln(1e4) is -36.378. The presets are named by origin so the two cannot be confused. The same exposure can read as a few percent under one preset and most of the people exposed under another.');
w();
const bf = GOLD.probits.briefEisenbergForm;
const bfr = success('Eisenberg in W/m2 form', C.thermalProbit({ coefficients: 'eisenberg', heatFluxWM2: bf.heatFluxWM2, exposureTimeS: bf.exposureTimeS }));
w(`THE W/m2 FORM OF EISENBERG. -14.9 + 2.56 ln(t q^(4/3) / 1e4) with q in W/m2 is the same probit, because (1000 I)^(4/3) is 1e4 I^(4/3). At ${bf.heatFluxWM2} W/m2 for ${bf.exposureTimeS} s (golden) the engine gives ${f6(bfr.probit)}, the golden ${f6(bf.probit)}.`);
must('the W/m2 form agrees', Math.abs(bfr.probit - bf.probit) < 1e-12, bfr.probit);
w();
w('THE LETHAL DOSES THE SOURCE PRINTS (golden, OSD/30 Table 17), in (kW/m2)^(4/3) s:');
w();
table(['preset', 'engine lethal dose for one percent', 'printed', 'engine lethal dose for fifty percent', 'printed'], GOLD.probits.lethalDose.map((c) => {
  const d1 = success(`lethal dose 1 ${c.id}`, C.probitDoseForProbability({ a: c.a, b: c.b, probability: 0.01 }));
  const d50 = success(`lethal dose 50 ${c.id}`, C.probitDoseForProbability({ a: c.a, b: c.b, probability: 0.5 }));
  must(`${c.id} lethal doses within the golden tolerance`, rel(d1.dose, c.printed1) < c.publishedRelTol && rel(d50.dose, c.printed50) < c.publishedRelTol, `${d1.dose} ${d50.dose}`);
  return [c.id, f6(d1.dose), String(c.printed1), f6(d50.dose), String(c.printed50)];
}));
w();
const tno = GOLD.probits.tnoOsdRowDoesNotReproduce;
w(`AN ERRATUM IN THAT TABLE (golden). Its TNO row, a = ${tno.a} and b = ${tno.b}, prints lethal doses of ${tno.printed1} and ${tno.printed50}, which do not follow from its own coefficients (${f6(tno.computed1)} and ${f6(tno.computed50)}). The source does not say which is wrong, so the row is not a preset.`);

/* ============================================================ SECTION 28 */

section('overpressureprobit', 'The overpressure probit, in psig', ['Expert m03 l05']);
const opr = C.OVERPRESSURE_PROBITS.hsc;
w(`\`OVERPRESSURE_PROBITS\` carries one preset, hsc: Y = ${opr.a} + ${opr.b} ln(P) with P in ${opr.unit}, source, verbatim: "${opr.source}". The engine takes the overpressure in Pa and converts it with \`PA_PER_PSI\`, ${C.PA_PER_PSI}.`);
w();
const ops = T.OVERPRESSURE_PSIG.map((psi) => ({ psi, r: success(`hsc at ${psi} psig`, C.overpressureProbit({ overpressurePa: psi * C.PA_PER_PSI })) }));
table(['overpressure psig, stated', 'overpressure Pa, derived', 'probit', 'probability'], ops.map(({ psi, r }) => [String(psi), f6(psi * C.PA_PER_PSI), f6(r.probit), f6(r.probability)]));
must('the probit reads psig', ops.every(({ psi, r }) => Math.abs(r.probit - (opr.a + opr.b * Math.log(psi))) < 1e-12), 'psig');
w();
w('THE PRINTED POINTS (golden, OSD/30 Equation 4):');
w();
table(['probability', 'engine psig', 'printed psig', 'relative difference'], GOLD.probits.hscPrinted.map((c) => {
  const d = success(`hsc dose ${c.probability}`, C.probitDoseForProbability({ a: opr.a, b: opr.b, probability: c.probability }));
  must(`hsc ${c.probability} within one percent`, rel(d.dose, c.printedPsig) < c.publishedRelTol, d.dose);
  return [String(c.probability), f6(d.dose), String(c.printedPsig), relE(d.dose, c.printedPsig)];
}));
w();
w('The ninety-five percent point prints lower than the probit gives, which the engine\'s validation record lists as an erratum in the source. Fed the overpressure in Pa where psig is due, the probit would read a number `PA_PER_PSI` times too large.');

/* ============================================================ SECTION 29 */

section('toxic', 'Toxic probits: the toxic load, two sources, two units', ['Expert m04']);
w('`TOXIC_PROBITS`, Y = a + b ln(C^n t), t in MINUTES and C in the preset\'s unit. The Purple Book presets (pb-) are in mg/m3; the Lees presets, as OSD/30 prints them, are in ppm:');
w();
table(['preset', 'a', 'b', 'n', 'unit'], Object.entries(C.TOXIC_PROBITS).map(([k, v]) => [k, String(v.a), String(v.b), String(v.n), v.unit]));
must('thirty-five presets', Object.keys(C.TOXIC_PROBITS).length === 35, Object.keys(C.TOXIC_PROBITS).length);
w();
w(`TWO SOURCES FOR ONE SUBSTANCE. Chlorine for ${T.CHLORINE_MINUTES} minutes (stated), both presets, the ppm converted for the Purple Book at 25 C with a molar mass of ${T.CHLORINE_MOLAR_MASS} g/mol (stated):`);
w();
const cl = T.CHLORINE_PPM.map((c) => {
  const lees = success(`lees chlorine ${c}`, C.toxicProbit({ coefficients: 'lees-chlorine', concentrationPpm: c, exposureMinutes: T.CHLORINE_MINUTES }));
  const pbc = success(`pb chlorine ${c}`, C.toxicProbit({ coefficients: 'pb-chlorine', concentrationPpm: c, exposureMinutes: T.CHLORINE_MINUTES, molarMassGMol: T.CHLORINE_MOLAR_MASS }));
  return { c, lees, pbc };
});
table(['chlorine ppm, stated', 'lees toxic load', 'lees probability', 'pb concentration mg/m3', 'pb toxic load', 'pb probability'], cl.map(({ c, lees, pbc }) => [String(c), f6(lees.dose), f6(lees.probability), f6(pbc.concentrationInPresetUnit), f6(pbc.dose), f6(pbc.probability)]));
must('the two sources disagree at every concentration', cl.every(({ lees, pbc }) => rel(lees.probability, pbc.probability) > 0.05), 'disagree');
w();
w(`The two sources disagree for the same chlorine exposure, and the toxic load exponent n (${C.TOXIC_PROBITS['lees-chlorine'].n} for Lees, ${C.TOXIC_PROBITS['pb-chlorine'].n} for the Purple Book) decides how fast the harm grows with the concentration. The toxic load unit is printed with every result: ${cl[0].lees.doseUnit} and ${cl[0].pbc.doseUnit}.`);
w();
const h2s = success('H2S on the pb preset', C.toxicProbit({ coefficients: 'pb-hydrogen-sulfide', concentrationPpm: T.H2S_PB.concentrationPpm, exposureMinutes: T.H2S_PB.exposureMinutes, molarMassGMol: T.H2S_MOLAR_MASS, temperatureK: T.H2S_PB.temperatureK }));
const h2s25 = success('H2S at 25 C', C.toxicProbit({ coefficients: 'pb-hydrogen-sulfide', concentrationPpm: T.H2S_PB.concentrationPpm, exposureMinutes: T.H2S_PB.exposureMinutes, molarMassGMol: T.H2S_MOLAR_MASS }));
w(`A PRESET IN THE OTHER UNIT. Hydrogen sulphide at ${T.H2S_PB.concentrationPpm} ppm for ${T.H2S_PB.exposureMinutes} minutes on the pb-hydrogen-sulfide preset (mg/m3), molar mass ${T.H2S_MOLAR_MASS} g/mol (stated). The engine converts at the temperature it is given:`);
w();
table(['temperature K', 'concentration mg/m3', 'probit', 'probability'], [
  [String(T.H2S_PB.temperatureK), f6(h2s.concentrationInPresetUnit), f6(h2s.probit), f6(h2s.probability)],
  ['298.15, the default', f6(h2s25.concentrationInPresetUnit), f6(h2s25.probit), f6(h2s25.probability)],
]);
must('temperature moves the answer', h2s.probability !== h2s25.probability, 'moves');
w();
w(`Without a molar mass the conversion cannot be made and the engine refuses: "${C.toxicProbit({ coefficients: 'pb-hydrogen-sulfide', concentrationPpm: 500, exposureMinutes: 10 }).error}".`);
w();
const td = success('the toxic history', C.toxicDose({ n: 2, history: T.TOXIC_HISTORY }));
const tdMean = T.TOXIC_HISTORY.reduce((a, h) => a + h.concentration * h.minutes, 0) / T.TOXIC_HISTORY.reduce((a, h) => a + h.minutes, 0);
const tdFlat = success('the flat mean', C.toxicDose({ n: 2, history: [{ concentration: tdMean, minutes: T.TOXIC_HISTORY.reduce((a, h) => a + h.minutes, 0) }] }));
w(`A CONCENTRATION THAT CHANGES. \`toxicDose\` sums C^n dt over a history: "${td.basis.model}". The history (stated) ${T.TOXIC_HISTORY.map((h) => `${h.concentration} for ${h.minutes} minutes`).join(', ')}, at n = 2, gives a toxic load of ${f6(td.dose)}; the time-weighted mean concentration, derived ${f6(tdMean)}, held for the whole time gives ${f6(tdFlat.dose)}. With n above one a peak counts for more than its share of the average.`);
must('the history beats the flat mean for n 2', td.dose > tdFlat.dose, 'beats');
w();
const pco = GOLD.probits.toxic.find((c) => c.id === 'pb-co-appendix-6b');
const pcor = success('PB CO probit', C.toxicProbit(pco.args));
w(`THE PUBLISHED CASE (golden). ${pco.source}. The engine: probit ${f6(pcor.probit)}, probability ${f6(pcor.probability)}; printed: probit ${pco.printed.probit}, probability ${pco.printed.probability}. The Purple Book reads the probability off its Table 5.1, which is why the golden allows ${pco.printedProbabilityAbsTol} absolute on it.`);
w();
w(`THE LEES COLUMNS (golden). OSD/30 Table 2 prints, for 13 substances, the ppm that gives one and fifty percent at 5 and 30 minutes; all ${GOLD.probits.leesLc.length} values reproduce through the engine's inverse within one percent or one ppm.`);
GOLD.probits.leesLc.forEach((c) => {
  const k = C.TOXIC_PROBITS[c.preset];
  const d = C.probitDoseForProbability({ a: k.a, b: k.b, probability: c.probability });
  const ppm = (d.dose / c.exposureMinutes) ** (1 / k.n);
  must(`Lees ${c.preset} ${c.probability} ${c.exposureMinutes}`, rel(ppm, c.printedPpm) < 0.01 || Math.abs(ppm - c.printedPpm) <= 1, `${ppm} ${c.printedPpm}`);
});

/* ============================================================ SECTION 30 */

section('inverse', 'The inverse probit is approximate', ['Expert m05 l05']);
const inv5 = success('inverse at a half', C.probabilityToProbit(0.5));
w(`The standard normal CDF this engine uses is the repository's \`normalCDF\`, the Abramowitz and Stegun 7.1.26 approximation; the probability basis says so, verbatim: "${pp.basis.model}". The forward direction is good to about 1.5e-7 in probability, which is why this course prints probabilities to six decimals.`);
w();
w('THE INVERSE bisects on that same approximate CDF. The golden records the exact probit for every Table 5.1 cell, computed by the oracle with an exact normal distribution; against the engine:');
w();
const invRows = T.INVERSE_PROBABILITIES.map((p) => {
  const g = t51.find((c) => c.probability === p);
  const r = success(`inverse ${p}`, C.probabilityToProbit(p));
  return { p, g, r };
});
table(['probability, stated', 'engine probit', 'exact probit, golden', 'difference, derived'], invRows.map(({ p, g, r }) => [String(p), f6(r.probit), g ? f6(g.probit) : 'not in the golden', g ? (r.probit - g.probit).toExponential(2) : '']));
must('the half is five to six decimals', inv5.probit.toFixed(6) === '5.000000', inv5.probit);
const i01 = invRows[0];
must('the one percent inverse departs from exact by more than 1e-7', i01.g && Math.abs(i01.r.probit - i01.g.probit) > 1e-7, i01.g && i01.r.probit - i01.g.probit);
w();
const lc = C.TOXIC_PROBITS['lees-chlorine'];
const dEng = success('lees chlorine dose at one percent', C.probitDoseForProbability({ a: lc.a, b: lc.b, probability: 0.01 }));
const dEx = Math.exp((i01.g.probit - lc.a) / lc.b);
w(`At one percent the engine's probit departs from the exact one in the seventh decimal. Through a toxic load that small departure is magnified: for the lees-chlorine preset the engine's one percent toxic load is ${f6(dEng.dose)}, and the exact probit gives, derived, ${f6(dEx)}, a difference of ${f6(dEng.dose - dEx)}. A thermal dose or toxic load read back from a probability is therefore quoted to the figures the approximation supports, and this course never grades one.`);
must('the dose difference is large against six decimals', Math.abs(dEng.dose - dEx) > 1e-3, dEng.dose - dEx);

/* ============================================================ SECTION 31 */

section('notdone', 'What the engine does not do', ['Expert m05']);
w('Read from the engine header and its validation record, and checked against the exports in ' + ref('computes') + ':');
w();
table(['not in the engine', 'why, from the engine header and its validation record', 'what the analyst does instead'], [
  ['two phase discharge', 'no public closed form was read with a worked example; the Yellow Book two phase models are numerical', 'uses a two phase model outside this engine for a flashing liquid'],
  ['unconfined pool spreading', 'the Yellow Book spreading model is a differential equation for a fed pool; only a stated thickness is implemented', 'states a thickness and says where it came from'],
  ['an instantaneous puff', 'the puff sigmas were not in a source read', 'models a short release with a puff model elsewhere'],
  ['urban dispersion coefficients', 'a sourced urban sigma_y was not available; only the rural Briggs set is here', 'uses the rural set with care, or another tool, in a built-up area'],
  ['a jet fire', 'the only worked example read carries internal inconsistencies, so a golden could not tell a right engine from a wrong one', 'uses a jet fire model elsewhere'],
  ['the Kingery-Bulmash fits', 'the coefficients were not obtained; the sources read print curves', 'uses Kinney and Graham within its range'],
  ['the TNO multi-energy method', 'the blast charts are graphical and no published curve fit was found', 'treats congestion with a method outside this engine'],
  ['lung, eardrum and structural probits', 'their source was not read, so they are not included', 'uses the fatality probit here and states what it covers'],
  ['point source heat radiation and setbacks', 'they live in the facilities engines and the Facilities courses grade them', 'uses the solid flame model here'],
  ['any frequency or risk', 'a consequence model computes effects', 'takes frequencies from a risk study'],
]);
must('the header names the dropped items', /two\s+\*?\s*phase discharge/.test(ENGINE_SRC) && /instantaneous puff/.test(ENGINE_SRC) && /jet fires/.test(ENGINE_SRC) && /multi-energy/.test(ENGINE_SRC) && /Kingery-Bulmash/.test(ENGINE_SRC), 'header');
w();
w('None of these is taught as computed. Where a lesson names one, it names it as out of the engine.');

/* ============================================================ SECTION 32 */

section('singleroute', 'The single route quantities, and the published values that catch the rest', ['Expert m05 l04']);
w('The engine\'s validation record plants the same mistake in both the engine and its oracle and asks whether anything independent still catches it. Where a second route or a published worked number exists, the mistake is caught; where neither exists, it is not:');
w();
table(['quantity', 'what catches a mistake copied into both', 'graded in this course'], [
  ['liquid and gas outflow through a hole', 'the Yellow Book worked cases and the nozzle maximisation (' + ref('liquid') + ' and ' + ref('gas') + ')', 'yes'],
  ['the pool of stated thickness', 'the Yellow Book pool diameter (' + ref('pools') + ')', 'yes'],
  ['the reflected plume', 'the mass flux integral (' + ref('plume') + ')', 'yes'],
  ['the Briggs coefficients', 'ALOHA Table 13, read exactly (' + ref('sigmas') + ')', 'yes'],
  ['the tilted view factor', 'the numerical surface integral (' + ref('viewfactor') + ')', 'yes'],
  ['Thomas with wind, tilt and the surface emissive power', 'the Yellow Book pool fire (' + ref('ybpoolfire') + ')', 'yes'],
  ['Kinney and Graham', 'the published conference column (' + ref('kinneygraham') + ')', 'yes'],
  ['the Eisenberg, Tsao and Perry and Lees thermal presets', 'the OSD/30 lethal doses (' + ref('thermal') + ')', 'yes'],
  ['the overpressure probit', 'the OSD/30 printed points (' + ref('overpressureprobit') + ')', 'yes'],
  ['the Lees toxic coefficients', 'the OSD/30 columns (' + ref('toxic') + ')', 'yes'],
  ['the Purple Book toxic coefficients', 'one published worked case, carbon monoxide (' + ref('toxic') + '); every other substance rests on the transcription', 'no'],
  ['Mackay and Matsugu evaporation', 'nothing: the transcription alone', 'no'],
  ['the Bagster transmissivity', 'nothing: the transcription alone', 'no'],
  ['the Burgess burning rate', 'nothing: the transcription alone', 'no'],
  ['the TNT equivalence', 'nothing: the transcription alone', 'no'],
  ['Thomas in still air', 'nothing: the transcription alone', 'no'],
]);
w();
w('A single route quantity is taught and never carries a graded answer. Every capstone that needs a transmissivity or a TNT mass STATES it, and every graded toxic probit uses a Lees preset.');

/* ============================================================ SECTION 33 */

section('judgement', 'Judgement: from release to harm, and the consequence note', ['Expert m06']);
const chainQ = success('chain gas', C.gasOrificeDischarge({ ...T.AMENAM_GAS, upstreamPressurePa: 2e6 }));
const chainC = success('chain plume', C.gaussianPlume({ massRateKgS: chainQ.massRateKgS, windSpeedMS: T.UBIT.windSpeedMS, downwindDistanceM: 200, stabilityClass: 'F', molarMassGMol: T.UBIT.molarMassGMol }));
w(`FROM RELEASE TO HARM, one chain on the teaching streams. The AMENAM gas line at 2e6 Pa releases ${f6(chainQ.massRateKgS)} kg/s (${chainQ.regime}). Treated as a sustained release of carbon monoxide in the UBIT wind, class F, it gives ${f6(chainC.concentrationMgM3)} mg/m3 at ground level 200 m downwind. Each step is one engine call, and each carries its basis; a consequence note carries every one of them.`);
w();
const chainP = success('chain probit', C.toxicProbit({ coefficients: 'pb-carbon-monoxide', concentrationMgM3: chainC.concentrationMgM3, exposureMinutes: 30 }));
w(`Held for 30 minutes (stated) on the pb-carbon-monoxide preset that is a probit of ${f6(chainP.probit)} and a probability of ${f6(chainP.probability)}.`);
w();
w('WHAT A CONSEQUENCE NOTE STATES: the release case and its hole, pressure and temperature; the regime; the weather (wind and stability class) and why; the receptor height and whether it is on the centreline; every model named by the method the engine reports; every stated input that is not the engine\'s own (a pool thickness, a transmissivity, a TNT yield, a radiative fraction and soot fraction); every warning the engine returned; the probit preset and its source; and what the engine did not model.');
w();
w('WHEN TWO METHODS DISAGREE (the surface emissive power, the thermal presets, the two toxic sources), the note says which one it used and why, and shows the other beside it. The disagreement is information.');

/* ============================================================ SECTION 34 */

section('vocabulary', 'Vocabulary this course legislates before a word is written', ['Associate m01', 'Professional m01', 'Expert m01']);
w('Words in this course that already mean something else in the academy, or are easy to shorten wrongly. The rule for each is binding on every lesson, bank question, key truth and panel.');
w();
table(['word', 'what it already means, or the trap', 'the rule here'], [
  ['flux', 'a heat flux in W/m2, a burning flux in kg/(m2 s), an evaporation flux and a mass flux all appear in this one course', 'always qualified: "heat flux", "burning flux", "evaporation flux" or "mass flux"'],
  ['beta', 'a vapour fraction, an orifice diameter ratio and a beta factor in other courses', 'appears only inside "k beta", the Babrauskas product'],
  ['dose', 'a radiation dose in occupational hygiene', 'always "thermal dose", "toxic load" or "toxic dose"'],
  ['severity', 'a consequence category on a risk matrix', 'never used: this course computes effects in physical units'],
  ['likelihood', 'a matrix likelihood score, a Bayesian likelihood, a frequency', 'never used: this course computes no frequency'],
  ['risk', 'individual risk, societal risk and the F-N curve belong to the quantitative risk course', '"individual risk", "PLL", "F-N" and "ALARP" appear only where the seam is named'],
  ['radiation', 'ionising radiation in occupational hygiene', 'always "heat radiation" or "thermal radiation"'],
]);

/* ============================================================ CLOSING CHECKS */

const allMods = Object.entries(MODULES).flatMap(([tier, mods]) => Object.keys(mods).map((m) => `${tier} ${m}`));
const unowned = allMods.filter((m) => !OWNED.has(m));
must('every module of every tier is owned by at least one section', unowned.length === 0, unowned.join(', ') || 'all owned');
must('every declared section was written', SECTION === ORDER.length, `${SECTION} of ${ORDER.length}`);

const failed = ASSERTS.filter((a) => !a.pass);
if (failed.length) {
  failed.forEach((a) => process.stderr.write(`  FAILED  ${a.claim}\n          ${a.detail}\n`));
  process.stderr.write(`h4_dump: ${ASSERTS.length} assertions, ${failed.length} FAILED. NOTHING WRITTEN.\n`);
  process.exit(1);
}
process.stderr.write(`h4_dump: ${ASSERTS.length} label-and-call, measurement and claim assertions run, 0 failed; ${SECTION} sections\n`);
process.stdout.write(`${OUT.join('\n')}\n`);
