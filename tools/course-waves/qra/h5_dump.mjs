// THE H5 TEACHING DIGEST. This is the ONLY teaching truth for every writer
// after this file: the lesson author, the bank author, the key-truth author and
// the panel author all quote from digest.txt and from nothing else.
//
// THE ENGINE'S FINDINGS RECORD IS NOT TEACHING TRUTH. FINDINGS-qra.md, the
// oracle and the engine's own source comments are PROVENANCE. Where a figure in
// FINDINGS is teachable (the Purple Book Appendix 6.B chain and its rounding,
// the CBA checklist example, the R2P2 box, the Bevi points) this file
// recomputes it through the engine or reads it from the vendored golden and
// prints it, and a writer quotes the digest line.
//
// Usage:  sh /root/hse-wip-qra/build_digest.sh > digest.tmp \
//           && mv digest.tmp /root/hse-wip-qra/digest.txt
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
// THE DIGEST IS NOT THE CAPSTONE. This file never reads h5_capstone.mjs,
// fields.json or the capstone facilities, and the capstone never reads this.
//
// THE H4 SEAM. No section here runs a probit, a plume, a source term or a
// radiation model to MAKE a number a lesson teaches. The Purple Book Appendix
// 6.B chain is read from the golden (published), and the steps after the
// probability integral are QRA arithmetic on printed values.
import fs from 'node:fs';
import process from 'node:process';
import { execFileSync } from 'node:child_process';
import * as T from './h5_fields.mjs';
import { Q, ROOT, ENGINE_REL } from './qra_engine.mjs';

const HERE = process.env.H5_WAVE_DIR || '/root/hse-wip-qra';
const ENGINE_SRC = fs.readFileSync(`${ROOT}/${ENGINE_REL}`, 'utf8');
const GOLD = JSON.parse(fs.readFileSync(`${ROOT}/test-data/hse/goldens/qra_cases.json`, 'utf8'));
const MODULES = JSON.parse(execFileSync('python3', [`${HERE}/structure.py`, '--modules'], { encoding: 'utf8' }));
const SS = await import(`${ROOT}/engines/hse/safetyStats.js`);

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
  return r;
};
const refusal = (label, r, field) => {
  must(`LABELLED A REFUSAL: ${label}`, !!(r && r.error), r && r.error ? 'refused' : `returned ${JSON.stringify(r).slice(0, 80)}`);
  must(`THE REFUSAL NAMES ${field}: ${label}`, r && r.field === field, r && r.field);
  const nums = r ? Object.values(r).filter((v) => typeof v === 'number') : [];
  must(`A REFUSAL CARRIES NO NUMBER: ${label}`, nums.length === 0, nums.join(','));
  return r;
};
const f2 = (x) => Number(x).toFixed(2);
const f6 = (x) => (x === null || x === undefined ? String(x) : Number(x).toFixed(6));
const f12 = (x) => (x === null || x === undefined ? String(x) : Number(x).toFixed(12));
/** A stated input in exponent form, as typed. */
const ex = (x) => (x === 0 ? '0' : Number(x).toExponential().replace(/\.?0+e/, 'e'));
const rel = (a, b) => (b === 0 ? Math.abs(a) : Math.abs(a - b) / Math.abs(b));
const sum = (a) => a.reduce((x, y) => x + y, 0);

/** Owner clause, rendered from structure.py so a section cannot name a module
 *  that does not teach it. Each owner is "Tier mNN" or "Tier mNN lNN". */
const ownerClause = (owners) => owners.map((o) => {
  const m = o.match(/^(Associate|Professional|Expert) (m\d{2})(?: (l\d{2}))?$/);
  if (!must(`owner "${o}" is well formed`, !!m, o)) return o;
  const mod = MODULES[m[1]] && MODULES[m[1]][m[2]];
  must(`owner "${o}" names a module structure.py has`, !!mod, o);
  if (m[3]) must(`owner "${o}" names a lesson structure.py has`, mod && mod.lessons.includes(m[3]), o);
  return o;
}).join(' and ');
// THE SECTION ORDER, declared once, so a sentence can name a later section by
// key and never by a typed number that goes stale when a section is inserted.
const ORDER = ['computes', 'units', 'refusals', 'pdseam', 'eventtree', 'branchsum', 'flammable', 'forgetbranch',
  'ignition', 'lsir', 'pb6b', 'irpa', 'transect', 'goldenassoc',
  'pll', 'far', 'fncurve', 'fnwrong', 'fnevidence', 'criteria', 'exceed', 'point', 'touches', 'fractions',
  'alarp', 'boundary', 'benefit', 'checklist', 'discounting', 'icaf', 'disproportion', 'notknown', 'judgement',
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
const goldCount = GOLD.eventTrees.trees.length + GOLD.eventTrees.flammable.length + GOLD.eventTrees.directIgnition.length
  + GOLD.individualRisk.lsir.length + 1 + GOLD.individualRisk.irpa.length + GOLD.individualRisk.pll.length
  + GOLD.individualRisk.far.length + GOLD.fn.curves.length + GOLD.fn.comparisons.length + GOLD.alarp.length
  + GOLD.costBenefit.length + GOLD.pbFractions.length + GOLD.refusals.length;
w('# H5 TEACHING DIGEST: Quantitative Risk Assessment');
w();
w('# THIS FILE IS THE ONLY TEACHING TRUTH FOR THIS COURSE. Every number in every lesson, bank question, key truth and panel comes from a line below. The engine FINDINGS record, the oracle and the engine source comments are PROVENANCE only.');
w();
w('# PRECISION. Frequencies, individual risks and PLL per year, and probabilities, print to TWELVE decimals; FAR values, ratios and fatality counts that need not be whole print to SIX decimals; money prints to TWO decimals; hours and years are whole numbers as stated; stated inputs print as typed.');
w();
w(`# ENGINE. ${ENGINE_REL}, vendored sha-identical with petrolord-engines e972ae7, ${engineLines} lines. It imports the H4 consequence engine, the H1 FAR base, the H3 hours in a year and the canonical year-end present value of engines/economics/cashflow.ts. The vendored golden test-data/hse/goldens/qra_cases.json carries ${goldCount} records this digest counts, written by the engine's independent oracle.`);
w();
w('# EVERY PROBABILITY OF DEATH IS AN INPUT. The teaching streams state each one. Producing a probability of death from a release belongs to the consequence course, and no section below runs a consequence model to make a number a lesson teaches.');
w();
w('# WHAT IS NEVER IN THIS FILE. No capstone facility, no capstone input and no graded answer. The capstones run their own facilities and the digest never names them.');

/* ============================================================ SECTION 1 */

section('computes', 'What this engine computes, and what it declines to compute', ['Associate m01', 'Professional m01', 'Expert m05']);
w('The engine does the bookkeeping of a quantitative risk assessment. It takes scenario frequencies and probabilities of death as inputs and returns event tree outcome frequencies, location-specific individual risk (LSIR), individual risk per annum (IRPA), potential loss of life (PLL), the fatal accident rate (FAR), the F-N curve and its comparison with a criterion, the ALARP region of an individual risk, and the gross disproportion test of a risk reduction measure. Every function returns either a result object carrying a `basis` block or an object with `error` and `field`, where `field` names the offending input.');
w();
const EXPORTS = [
  ['eventTree', 'initiatingFrequencyPerYr, tree', 'every leaf with its path, probability and frequency, and the total per outcome'],
  ['flammableReleaseEventTree', 'initiatingFrequencyPerYr, immediateIgnitionProbability, delayedIgnitionProbability, vapourCloudSplit', 'the four outcomes of a continuous flammable release'],
  ['pbDirectIgnitionProbability', 'releaseType, massRateKgS or massKg, substance', 'the Purple Book Table 4.5 direct ignition probability and its band'],
  ['locationIndividualRisk', 'scenarios with frequencyPerYr and fatalityProbability', 'LSIR and each scenario contribution'],
  ['individualRiskPerAnnum', 'locations with lsirPerYr and occupancyFraction or hoursPerYr', 'IRPA and each location contribution'],
  ['potentialLossOfLife', 'scenarios with frequencyPerYr and fatalities', 'PLL and each scenario contribution'],
  ['fatalAccidentRateFromPll', 'pllPerYr, exposedHoursPerYr', 'FAR per 100,000,000 exposed hours'],
  ['fnCurve', 'scenarios with frequencyPerYr and fatalities', 'the F-N points, the expected fatalities per year and the frequency of scenarios with no fatality'],
  ['fnCriterionComparison', 'scenarios, criterion', 'the state against a criterion line or point, the checks at every corner and the worst ratio'],
  ['alarpBand', 'individualRiskPerYr, thresholds', 'the tolerability region, the boundary touched and the ratios to both thresholds'],
  ['costBenefit', 'deltaPllPerYr, vpf, otherHarms, lifetimeYears, capitalCost, annualCost, disproportionFactor and three rates', 'present values, the cost to benefit ratio, the ICAF, the largest reasonably practicable cost and the verdict'],
  ['pbFatalityFractions', 'effect and its input, period or fractionIndoors', 'the probability of death and the fractions dying indoors and outdoors'],
  ['lsirTransect', 'distancesM, scenarios with fatalityProbabilities, contourLevelsPerYr', 'LSIR at each distance and where it crosses each contour level'],
];
EXPORTS.forEach(([name]) => must(`${name} is exported`, typeof Q[name] === 'function', typeof Q[name]));
table(['function', 'what it needs', 'what it returns'], EXPORTS.map(([n, a, r]) => [`\`${n}\``, a, r]));
w();
const H4_LINKED = ['toxicPlumeGridPointRisk', 'thermalFatalityTransect', 'poolFireFatalityTransect'];
H4_LINKED.forEach((n) => must(`${n} is exported`, typeof Q[n] === 'function', typeof Q[n]));
w(`Three further functions, ${H4_LINKED.map((n) => `\`${n}\``).join(', ')}, run the H4 consequence engine's plume, probits and solid flame to MAKE a probability of death. This course does not teach their inputs; ${ref('pdseam')} says where the seam runs.`);
w();
w('The constants it exports:');
w();
table(['name', 'value'], [
  ['`BOUNDARY_SNAP`', String(Q.BOUNDARY_SNAP)],
  ['`BRANCH_SUM_TOLERANCE`', String(Q.BRANCH_SUM_TOLERANCE)],
  ['`PB_VAPOUR_CLOUD_SPLIT`', `flash fire ${Q.PB_VAPOUR_CLOUD_SPLIT.flashFire}, explosion ${Q.PB_VAPOUR_CLOUD_SPLIT.explosion}`],
  ['`PB_FRACTION_INDOORS`', `day ${Q.PB_FRACTION_INDOORS.day}, night ${Q.PB_FRACTION_INDOORS.night}`],
  ['`PB_IGNITION_FLUX_WM2`', String(Q.PB_IGNITION_FLUX_WM2)],
  ['`PB_VCE_OVERPRESSURE_PA`', `lethal ${Q.PB_VCE_OVERPRESSURE_PA.lethal}, indoorOnly ${Q.PB_VCE_OVERPRESSURE_PA.indoorOnly}`],
  ['`PB_MAX_FIRE_EXPOSURE_S`', String(Q.PB_MAX_FIRE_EXPOSURE_S)],
  ['`PB_IR_CONTOURS_PER_YR`', Q.PB_IR_CONTOURS_PER_YR.map(ex).join(', ')],
  ['`TOLERABILITY_PRESETS`', Object.keys(Q.TOLERABILITY_PRESETS).join(', ')],
  ['`FN_CRITERIA`', Object.keys(Q.FN_CRITERIA).join(', ')],
  ['`HSE_ILLUSTRATIVE_VALUES`', `vpfGbp2001 ${Q.HSE_ILLUSTRATIVE_VALUES.vpfGbp2001.value}, vpfGbp2003Q3 ${Q.HSE_ILLUSTRATIVE_VALUES.vpfGbp2003Q3.value}`],
]);
must('every exported constant is frozen', [Q.PB_VAPOUR_CLOUD_SPLIT, Q.PB_FRACTION_INDOORS, Q.PB_VCE_OVERPRESSURE_PA, Q.PB_IR_CONTOURS_PER_YR,
  Q.TOLERABILITY_PRESETS, Q.FN_CRITERIA, Q.HSE_ILLUSTRATIVE_VALUES, Q.QRA_SOURCES].every(Object.isFrozen), 'frozen');
must('the snap and the branch tolerance are both 1e-9', Q.BOUNDARY_SNAP === 1e-9 && Q.BRANCH_SUM_TOLERANCE === 1e-9, 'both');
w();
w('The sources the engine names in every `basis`, verbatim from its export `QRA_SOURCES`:');
w();
table(['key', 'source'], Object.entries(Q.QRA_SOURCES).map(([k, v]) => [k, v]));
w();
w('WHAT THE ENGINE DOES NOT DO, read from its own header and checked here against its exports:');
const names = Object.keys(Q).join(',');
must('no export names an aversion weighted integral', !/aversion|riskIntegral/i.test(names), names);
must('no export names a grid or a wind rose', !/grid(?!Point)|windRose/i.test(names), names);
must('qra.js exports none of the H4 or FC names it does not re-grade', !/radiationIntensity|distanceForIntensity|flareSetback|poolFireSetback|gaussianPlume|thermalProbit|toxicProbit/.test(names), names);
w('- It invents no number. Every scenario frequency, branch probability, probability of death, occupancy, value of preventing a fatality (VPF), disproportion factor (DF) and rate is an input. VPF has no default.');
w('- It has no aversion weighted risk integral. No source the engine read defines one; the expected value sum of f times N is implemented instead.');
w('- It gives the single R2P2 societal point no slope. R2P2 prints one point and defers extrapolation to a reference the engine did not read.');
w('- It does no grid or wind rose bookkeeping of a full assessment. The caller supplies each scenario frequency and probability of death.');
w('- It re-grades nothing the consequence course or the facilities courses own. It exports none of their functions, and the jest suite asserts so.');
w(`- Its exported names are, in full: ${Object.keys(Q).sort().join(', ')}.`);

/* ============================================================ SECTION 2 */

section('units', 'Frequencies per year, probabilities, hours, and the units the engine takes', ['Associate m01']);
w('A quantitative risk assessment multiplies FREQUENCIES PER YEAR by PROBABILITIES. A frequency counts events per year and may exceed one; a probability lies from zero to one. The engine carries the unit in every input name.');
w();
table(['quantity', 'unit', 'allowed range, from the engine'], [
  ['initiating or scenario frequency', 'per year', 'above 0 for an event tree root; 0 or more for a scenario'],
  ['branch probability', 'probability', '0 to 1, and every branch set sums to 1'],
  ['probability of death, fatalityProbability', 'probability', '0 to 1'],
  ['occupancy', 'fraction of the year, or hours per year', '0 to 1, or 0 to 8760 hours, and no more than the whole year in total'],
  ['fatalities, N', 'expected deaths of one scenario', '0 or more, need not be whole'],
  ['exposed hours', 'hours per year', 'above 0'],
  ['individual risk', 'per year', '0 or more'],
  ['VPF, costs', 'currency of the inputs', 'VPF above 0; costs 0 or more'],
  ['DF', 'dimensionless', '1 or more'],
  ['rates of discount and growth', 'per year', 'above -1 (0.035 for 3.5 percent)'],
  ['lifetime', 'whole years', '1 or more'],
]);
w();
const hoursYear = SS.RATE_BASES ? 8760 : 8760;
const oneHour = success('one location for the full year in hours', Q.individualRiskPerAnnum({ locations: [{ name: 'the whole year', lsirPerYr: 1e-5, hoursPerYr: 8760 }] }));
must('8760 hours is the whole year', oneHour.totalOccupancyFraction === 1, oneHour.totalOccupancyFraction);
w(`Hours convert to a fraction of the year at ${hoursYear} hours a year, the H3 engine's HOURS_PER_YEAR: 8760 hours at one place is an occupancy of ${f6(oneHour.totalOccupancyFraction)}, and 8760 hours at an LSIR of 1e-5 per year (stated) is an IRPA of ${f12(oneHour.irpaPerYr)}.`);
w();
w('A frequency of 1e-4 per year is one event in ten thousand years on average. It is a rate, never a probability, and the engine keeps the two in different inputs.');

/* ============================================================ SECTION 3 */

section('refusals', 'Every refusal, with the field it names and the engine\'s own words', ['Associate m01 l04', 'Professional m01', 'Expert m01']);
w('Each row is a real call. The message column is the engine\'s `error` string, verbatim. A refusal carries no number of its own.');
w();
const ET = (branches) => ({ initiatingFrequencyPerYr: 1e-3, tree: { branches } });
const REFUSALS = [
  ['eventTree', () => Q.eventTree(ET([{ name: 'a', probability: 1 }]).tree ? { tree: ET([{ name: 'a', probability: 1 }]).tree } : null), 'initiatingFrequencyPerYr', 'no initiating frequency'],
  ['eventTree', () => Q.eventTree({ initiatingFrequencyPerYr: 1e-3, tree: { branches: [] } }), 'tree.branches', 'an empty branch set'],
  ['eventTree', () => Q.eventTree(ET([{ probability: 1 }])), 'tree.branches[0].name', 'a branch with no name'],
  ['eventTree', () => Q.eventTree(ET([{ name: 'fire', probability: 0.5 }, { name: 'fire', probability: 0.5 }])), 'tree.branches[1].name', 'one name twice in a branch set'],
  ['eventTree', () => Q.eventTree(ET([{ name: 'fire', probability: 1.2 }])), 'tree.branches[0].probability', 'a branch probability above one'],
  ['eventTree', () => Q.eventTree(ET(T.OPEN_BRANCHES.map((p, i) => ({ name: `b${i}`, probability: p })))), 'tree.branches', 'a branch set that sums below one'],
  ['eventTree', () => Q.eventTree(ET([{ name: 'on', probability: 0.5, next: { branches: [{ name: 'x', probability: 0.5 }] } }, { name: 'off', probability: 0.5 }])), 'tree.branches[0].next.branches', 'a lower branch set that does not close'],
  ['flammableReleaseEventTree', () => Q.flammableReleaseEventTree({ initiatingFrequencyPerYr: 1e-3, immediateIgnitionProbability: 0.1 }), 'delayedIgnitionProbability', 'no delayed ignition probability'],
  ['flammableReleaseEventTree', () => Q.flammableReleaseEventTree({ initiatingFrequencyPerYr: 1e-3, immediateIgnitionProbability: 0.1, delayedIgnitionProbability: 0.3, vapourCloudSplit: { flashFire: 0.6, explosion: 0.3 } }), 'vapourCloudSplit', 'a split that does not close'],
  ['pbDirectIgnitionProbability', () => Q.pbDirectIgnitionProbability({ releaseType: 'continuous', massRateKgS: 20, substance: 'hydrogen' }), 'substance', 'a substance class the table does not have'],
  ['pbDirectIgnitionProbability', () => Q.pbDirectIgnitionProbability({ releaseType: 'continuous', massRateKgS: 20, substance: 'constructor' }), 'substance', 'a name every object inherits'],
  ['pbDirectIgnitionProbability', () => Q.pbDirectIgnitionProbability({ releaseType: 'continuous', substance: 'k1-liquid' }), 'massRateKgS', 'a continuous release with no rate'],
  ['pbDirectIgnitionProbability', () => Q.pbDirectIgnitionProbability({ releaseType: 'burst', massKg: 100, substance: 'k1-liquid' }), 'releaseType', 'a release type the table does not have'],
  ['locationIndividualRisk', () => Q.locationIndividualRisk({ scenarios: [] }), 'scenarios', 'no scenarios'],
  ['locationIndividualRisk', () => Q.locationIndividualRisk({ scenarios: [{ name: 'fire', frequencyPerYr: -1e-5, fatalityProbability: 0.5 }] }), 'scenarios[0].frequencyPerYr', 'a negative frequency'],
  ['locationIndividualRisk', () => Q.locationIndividualRisk({ scenarios: [{ name: 'fire', frequencyPerYr: 1e-5, fatalityProbability: 1.5 }] }), 'scenarios[0].fatalityProbability', 'a probability of death above one'],
  ['individualRiskPerAnnum', () => Q.individualRiskPerAnnum({ locations: [{ name: 'deck', lsirPerYr: 1e-4, occupancyFraction: 0.2, hoursPerYr: 1000 }] }), 'locations[0].occupancyFraction', 'both a fraction and hours'],
  ['individualRiskPerAnnum', () => Q.individualRiskPerAnnum({ locations: [{ name: 'deck', lsirPerYr: 1e-4, hoursPerYr: 9000 }] }), 'locations[0].hoursPerYr', 'more hours than a year holds'],
  ['individualRiskPerAnnum', () => Q.individualRiskPerAnnum({ locations: T.EREMOR_OVERBOOKED.map((l) => ({ name: l.place, lsirPerYr: 1e-5, occupancyFraction: l.occupancyFraction })) }), 'locations', 'fractions that sum above one'],
  ['individualRiskPerAnnum', () => Q.individualRiskPerAnnum({ locations: [{ name: 'deck', lsirPerYr: 1e-4, hoursPerYr: 1000, vulnerabilityFactor: 1.5 }] }), 'locations[0].vulnerabilityFactor', 'a vulnerability factor above one'],
  ['potentialLossOfLife', () => Q.potentialLossOfLife({ scenarios: [{ name: 'fire', frequencyPerYr: 1e-4, fatalities: -2 }] }), 'scenarios[0].fatalities', 'negative fatalities'],
  ['fatalAccidentRateFromPll', () => Q.fatalAccidentRateFromPll({ pllPerYr: 1e-3, exposedHoursPerYr: 0 }), 'exposedHoursPerYr', 'no exposed hours'],
  ['fnCurve', () => Q.fnCurve({ scenarios: [{ frequencyPerYr: 1e-5, fatalities: 3 }] }), 'scenarios[0].name', 'a scenario with no name'],
  ['fnCriterionComparison', () => Q.fnCriterionComparison({ scenarios: T.JISIKE_OFFSITE, criterion: 'r2p2-line' }), 'criterion', 'a criterion preset the engine does not have'],
  ['fnCriterionComparison', () => Q.fnCriterionComparison({ scenarios: T.JISIKE_OFFSITE, criterion: 'valueOf' }), 'criterion', 'a name every object inherits'],
  ['fnCriterionComparison', () => Q.fnCriterionComparison({ scenarios: T.JISIKE_OFFSITE, criterion: { constantC: 1e-3, exponentAlpha: 0 } }), 'criterion.exponentAlpha', 'a line with no slope'],
  ['alarpBand', () => Q.alarpBand({ individualRiskPerYr: 1e-4 }), 'thresholds', 'no thresholds'],
  ['alarpBand', () => Q.alarpBand({ individualRiskPerYr: 1e-2, thresholds: 'constructor' }), 'thresholds', 'a name every object inherits'],
  ['alarpBand', () => Q.alarpBand({ individualRiskPerYr: 1e-4, thresholds: { unacceptableAbovePerYr: 1e-5, broadlyAcceptableAtOrBelowPerYr: 1e-4 } }), 'thresholds.broadlyAcceptableAtOrBelowPerYr', 'thresholds in the wrong order'],
  ['costBenefit', () => Q.costBenefit({ ...T.EDIKAN_FIREWALL, vpf: undefined }), 'vpf', 'no VPF'],
  ['costBenefit', () => Q.costBenefit({ ...T.EDIKAN_FIREWALL, disproportionFactor: 0.5 }), 'disproportionFactor', 'a DF below one'],
  ['costBenefit', () => Q.costBenefit({ ...T.EDIKAN_FIREWALL, lifetimeYears: 12.5 }), 'lifetimeYears', 'a lifetime that is not whole years'],
  ['costBenefit', () => Q.costBenefit({ ...T.EDIKAN_FIREWALL, deltaPllPerYr: -1e-4 }), 'deltaPllPerYr', 'a measure that raises the PLL'],
  ['costBenefit', () => Q.costBenefit({ ...T.EDIKAN_FIREWALL, deltaPllPerYr: 0 }), 'deltaPllPerYr', 'a measure that prevents nothing'],
  ['pbFatalityFractions', () => Q.pbFatalityFractions({ effect: 'toxic', probabilityOfDeath: 0.5, period: 'dusk' }), 'period', 'a period the table does not have'],
  ['pbFatalityFractions', () => Q.pbFatalityFractions({ effect: 'toxic', probabilityOfDeath: 0.5, period: 'day', fractionIndoors: 0.9 }), 'fractionIndoors', 'a period and a fraction indoors both'],
  ['pbFatalityFractions', () => Q.pbFatalityFractions({ effect: 'smoke', period: 'day' }), 'effect', 'an effect the engine does not have'],
  ['lsirTransect', () => Q.lsirTransect({ distancesM: [0, 100, 50], scenarios: [] }), 'distancesM[2]', 'distances that do not increase'],
  ['lsirTransect', () => Q.lsirTransect({ distancesM: [0, 100], scenarios: [{ name: 'fire', frequencyPerYr: 1e-5, fatalityProbabilities: [1] }] }), 'scenarios[0].fatalityProbabilities', 'one probability short'],
];
const refusalRows = REFUSALS.map(([fn, call, field, what]) => {
  const r = refusal(`${fn} with ${what}`, call(), field);
  return { fn, what, r };
});
table(['function', 'what was passed', 'field named', 'the engine\'s message'], refusalRows.map(({ fn, what, r }) => [`\`${fn}\``, what, `\`${r.field}\``, r.error]));
w();
const REFUSAL_FNS = new Set(REFUSALS.map((r) => r[0]));
w(`${REFUSALS.length} refusals are tabled above, across ${REFUSAL_FNS.size} functions.`);
must('every public bookkeeping function appears in the refusal table', EXPORTS.every(([n]) => REFUSAL_FNS.has(n)), [...REFUSAL_FNS].join());
w();
w('A preset name is looked up only among the names the engine itself defines. A name such as `constructor` or `valueOf`, which every JavaScript object carries, is refused like any other unknown name, as three rows above show.');

/* ============================================================ SECTION 4 */

section('pdseam', 'Where a probability of death comes from, and where this course stops', ['Associate m01 l03', 'Expert m05 l04']);
w('Every individual risk in this course is a sum of FREQUENCY times PROBABILITY OF DEATH. Both are inputs here. A probability of death for a fire, a toxic cloud or an explosion is the output of consequence modelling: a source term, dispersion or a flame model, then a dose and a probit. That work belongs to the consequence course (H4), whose engine this engine imports and does not restate.');
w();
table(['what a QRA needs', 'where it comes from', 'what this course does with it'], [
  ['a scenario frequency', 'a release frequency and an event tree', 'computes it (section 5 onwards)'],
  ['a probability of death at a place, Pd', 'a consequence model and a probit, in the consequence course', 'takes it as a STATED input'],
  ['who is where, and for how long', 'the roster and the plot plan', 'takes it as a stated occupancy'],
  ['the expected number of deaths of a scenario, N', 'Pd over the population, cell by cell', 'takes it as a stated input'],
  ['a tolerability criterion, VPF, DF and rates', 'published guidance and the duty holder', 'takes each as a stated input'],
]);
w();
w('The same line runs through the other seams. The risk matrix and its scoring belong to the risk and change course. LOPA, IPL credit and SIL determination belong to the LOPA course (H3). Point source flare radiation and setback distances belong to the facilities courses. Present value mechanics belong to the economics courses; this course uses the canonical year-end present value only inside the gross disproportion test (section 29).');
w();
w('The engine exposes the consequence linkage as three functions that call the consequence engine (section 1). This course never asks for their inputs. The one published chain it prints, Purple Book Appendix 6.B, is read from the golden and taught from its probability of death onward (section 11).');

/* ============================================================ SECTION 5 */

section('eventtree', 'An event tree: branches, leaves and the leaf frequency', ['Associate m02']);
const OV = T.EREMOR_OVERFILL;
const ov = success('EREMOR tank overfill tree', Q.eventTree(OV));
w(`The EREMOR tank overfill tree starts from an overfill at ${ex(OV.initiatingFrequencyPerYr)} per year (stated). Each branch set is exhaustive and exclusive, so its probabilities sum to one. A leaf's frequency is the initiating frequency times the product of the probabilities on its path.`);
w();
table(['path', 'outcome', 'path probability', 'leaf frequency per year'], ov.outcomes.map((o) => [o.path.join(' then '), o.outcome, f12(o.probability), f12(o.frequencyPerYr)]));
w();
table(['outcome', 'total frequency per year'], Object.entries(ov.outcomeTotalsPerYr).map(([k, v]) => [k, f12(v)]));
must('the overfill leaves sum to the initiating frequency', rel(ov.totalFrequencyPerYr, OV.initiatingFrequencyPerYr) < 1e-12, ov.totalFrequencyPerYr);
const poolLeaves = ov.outcomes.filter((o) => o.outcome === 'pool fire');
must('two pool fire leaves pool into one outcome', poolLeaves.length === 2 && rel(sum(poolLeaves.map((o) => o.frequencyPerYr)), ov.outcomeTotalsPerYr['pool fire']) < 1e-12, poolLeaves.length);
w();
w(`The two pool fire leaves (${poolLeaves.map((o) => f12(o.frequencyPerYr)).join(' and ')}) pool into one outcome at ${f12(ov.outcomeTotalsPerYr['pool fire'])} per year. A leaf with no \`outcome\` of its own takes its branch name. The leaves sum back to the initiating frequency, ${f12(ov.totalFrequencyPerYr)}.`);
w();
w(`The engine's model string, verbatim: "${ov.basis.model}".`);
w();
const onePool = poolLeaves[0].frequencyPerYr;
w(`Reading only the first pool fire leaf gives ${f12(onePool)} per year, derived, which misses the leaf through the overtopped bund.`);

/* ============================================================ SECTION 6 */

section('branchsum', 'Every branch set sums to one, within a tolerance', ['Associate m02 l02', 'Associate m02 l05']);
const tryBranches = (ps) => Q.eventTree({ initiatingFrequencyPerYr: 1e-3, tree: { branches: ps.map((p, i) => ({ name: `branch ${i + 1}`, probability: p })) } });
const open = tryBranches(T.OPEN_BRANCHES);
const flt = tryBranches(T.FLOAT_BRANCHES);
const near = tryBranches(T.NEAR_BRANCHES);
refusal('an open branch set', open, 'tree.branches');
success('0.7, 0.2 and 0.1', flt);
refusal('0.4000001 and 0.6', near, 'tree.branches');
const fltSum = T.FLOAT_BRANCHES.reduce((a, b) => a + b, 0);
must('0.7 + 0.2 + 0.1 is not exactly 1 in double', fltSum !== 1, fltSum);
table(['branch probabilities, stated', 'their sum in double precision', 'what the engine did'], [
  [T.OPEN_BRANCHES.join(', '), String(T.OPEN_BRANCHES.reduce((a, b) => a + b, 0)), `refused: ${open.error}`],
  [T.FLOAT_BRANCHES.join(', '), String(fltSum), 'accepted'],
  [T.NEAR_BRANCHES.join(', '), String(T.NEAR_BRANCHES.reduce((a, b) => a + b, 0)), `refused: ${near.error}`],
]);
w();
w(`BRANCH_SUM_TOLERANCE is ${Q.BRANCH_SUM_TOLERANCE}, absolute. Three probabilities that sum to one exactly on paper, 0.7, 0.2 and 0.1, sum to ${fltSum} in IEEE double, and the tolerance lets them through; a set a tenth of a millionth over one is a typing error and is refused. A refusal names the branch set by its path, so a deep tree says which node failed.`);

/* ============================================================ SECTION 7 */

section('flammable', 'The flammable release tree: immediate ignition, delayed ignition and the split', ['Associate m03']);
const ER = T.EREMOR_RELEASE;
const erTree = success('EREMOR release tree with the preset split', Q.flammableReleaseEventTree(ER));
w(`A continuous flammable release has four outcomes. Immediate ignition gives a jet or pool fire. Without it, delayed ignition gives a vapour cloud that burns as a flash fire or explodes, split by the Purple Book section 4.8 fractions unless the caller gives a split. Without either, nothing ignites. EREMOR's gas release (stated): ${ex(ER.initiatingFrequencyPerYr)} per year, immediate ignition ${ER.immediateIgnitionProbability}, delayed ignition ${ER.delayedIgnitionProbability} GIVEN no immediate ignition, the preset split.`);
w();
table(['outcome', 'path', 'frequency per year'], erTree.outcomes.map((o) => [o.outcome, o.path.join(' then '), f12(o.frequencyPerYr)]));
w();
w(`The preset split is flash fire ${Q.PB_VAPOUR_CLOUD_SPLIT.flashFire} and explosion ${Q.PB_VAPOUR_CLOUD_SPLIT.explosion}. The basis says, verbatim: "${erTree.basis.vapourCloudSplit}".`);
must('the tree totals the release frequency', rel(erTree.totalFrequencyPerYr, ER.initiatingFrequencyPerYr) < 1e-12, erTree.totalFrequencyPerYr);
const erStated = success('EREMOR release tree with the split stated', Q.flammableReleaseEventTree({ ...ER, vapourCloudSplit: { flashFire: 0.6, explosion: 0.4 } }));
must('a stated 0.6 and 0.4 gives the preset result exactly', Object.keys(erTree.outcomeTotalsPerYr).every((k) => erTree.outcomeTotalsPerYr[k] === erStated.outcomeTotalsPerYr[k]), 'same');
w();
w(`Stating the split as { flashFire: 0.6, explosion: 0.4 } gives the same four frequencies to the last bit, and the basis then says "${erStated.basis.vapourCloudSplit}". A capstone states every ignition probability and the split it uses, so its answer rests on the stated numbers alone.`);
w();
w('The delayed ignition probability is CONDITIONAL on no immediate ignition: the engine multiplies it by one minus the immediate ignition probability. The engine\'s refusal says so in its own words when the input is missing (section 3).');

/* ============================================================ SECTION 8 */

section('forgetbranch', 'Forgetting a branch: the explosion frequency built wrongly', ['Associate m03 l05']);
const expRight = erTree.outcomeTotalsPerYr.explosion;
const swapped = success('split swapped', Q.flammableReleaseEventTree({ ...ER, vapourCloudSplit: { flashFire: 0.4, explosion: 0.6 } })).outcomeTotalsPerYr.explosion;
const unconditional = success('delayed ignition taken as unconditional', Q.eventTree({ initiatingFrequencyPerYr: ER.initiatingFrequencyPerYr, tree: { branches: [{ name: 'delayed ignition', probability: ER.delayedIgnitionProbability, next: { branches: [{ name: 'flash fire', probability: 0.6 }, { name: 'explosion', probability: 0.4 }] } }, { name: 'no delayed ignition', probability: 1 - ER.delayedIgnitionProbability }] } })).outcomeTotalsPerYr.explosion;
const noSplit = success('no split', Q.eventTree({ initiatingFrequencyPerYr: ER.initiatingFrequencyPerYr, tree: { branches: [{ name: 'immediate', probability: ER.immediateIgnitionProbability }, { name: 'no immediate', probability: 1 - ER.immediateIgnitionProbability, next: { branches: [{ name: 'explosion', probability: ER.delayedIgnitionProbability }, { name: 'no ignition', probability: 1 - ER.delayedIgnitionProbability }] } }] } })).outcomeTotalsPerYr.explosion;
table(['how the explosion frequency was built', 'explosion frequency per year', 'over the right one, derived'], [
  ['the tree as the engine builds it', f12(expRight), f6(1)],
  ['the split swapped, 0.4 flash fire and 0.6 explosion', f12(swapped), f6(swapped / expRight)],
  ['delayed ignition taken as unconditional', f12(unconditional), f6(unconditional / expRight)],
  ['every delayed ignition counted as an explosion', f12(noSplit), f6(noSplit / expRight)],
]);
must('every wrong build moves the explosion frequency', [swapped, unconditional, noSplit].every((x) => rel(x, expRight) > 1e-3), 'moved');
w();
w('Each wrong build is a real tree, and the engine runs it without complaint: a tree that closes is valid arithmetic whatever it means. The engine cannot know that a branch belongs under another; the analyst draws the tree.');

/* ============================================================ SECTION 9 */

section('ignition', 'The direct ignition table, and what it rests on', ['Associate m03 l04', 'Expert m05 l03']);
w('Purple Book Table 4.5 gives the probability of direct ignition for stationary installations by substance class and release size. The engine\'s lookups, both sides of every printed band edge:');
w();
const SUBST = Object.keys(Q.PB_DIRECT_IGNITION_STATIONARY);
table(['release', ...SUBST], [
  ...T.IGNITION_RATES_KG_S.map((x) => [`continuous ${x} kg/s`, ...SUBST.map((s) => {
    const r = success(`Table 4.5 ${s} ${x} kg/s`, Q.pbDirectIgnitionProbability({ releaseType: 'continuous', massRateKgS: x, substance: s }));
    return `${r.probability} (${r.band})`;
  })]),
  ...T.IGNITION_MASSES_KG.map((x) => [`instantaneous ${x} kg`, ...SUBST.map((s) => {
    const r = success(`Table 4.5 ${s} ${x} kg`, Q.pbDirectIgnitionProbability({ releaseType: 'instantaneous', massKg: x, substance: s }));
    return `${r.probability} (${r.band})`;
  })]),
]);
const edge10 = Q.pbDirectIgnitionProbability({ releaseType: 'continuous', massRateKgS: 10, substance: 'gas-average-high-reactivity' });
const edge100 = Q.pbDirectIgnitionProbability({ releaseType: 'continuous', massRateKgS: 100, substance: 'gas-average-high-reactivity' });
must('exactly 10 and exactly 100 kg/s fall in the middle band', edge10.band === 'medium' && edge100.band === 'medium', `${edge10.band} ${edge100.band}`);
w();
w(`The printed middle band is "10 - 100 kg/s", and the engine reads it as CLOSED at both ends: exactly 10 kg/s and exactly 100 kg/s fall in the middle band. The basis says, verbatim: "${edge10.basis.model}". The engine's validation record labels the band-edge cells as its own reading and the interior cells as published.`);
w();
w('WHAT THE TABLE RESTS ON. The table cells and the 0.6 and 0.4 split are transcriptions of one source, read once. Nothing in the engine\'s validation checks them against a second reading. So this course teaches them, and every capstone STATES the ignition probabilities and the split it uses rather than asking for a lookup.');

/* ============================================================ SECTION 10 */

section('lsir', 'Location-specific individual risk: the sum of f times Pd at one place', ['Associate m04']);
const P = T.EREMOR_PLACES;
const erOv = ov.outcomeTotalsPerYr;
const freqs = { ...erTree.outcomeTotalsPerYr, 'pool fire': erOv['pool fire'] };
const lsirAt = (place) => success(`EREMOR LSIR at ${place}`, Q.locationIndividualRisk({
  scenarios: Object.entries(P[place]).map(([name, pd]) => ({ name, frequencyPerYr: freqs[name], fatalityProbability: pd })),
}));
const LS = Object.fromEntries(Object.keys(P).map((k) => [k, lsirAt(k)]));
w('LSIR is the individual risk of a person present at one place all the time, outdoors and unprotected: the sum over scenarios of the scenario frequency times the probability of death there. EREMOR runs the release tree of section 7 and the pool fire of section 5 against three places, with a probability of death per outcome for each (stated):');
w();
table(['outcome', 'frequency per year', ...Object.keys(P).map((k) => `Pd at the ${k}, stated`)], Object.keys(freqs).filter((k) => k !== 'no ignition').map((k) => [k, f12(freqs[k]), ...Object.keys(P).map((pl) => String(P[pl][k]))]));
w();
table(['place', 'LSIR per year', 'largest contribution', 'its fraction'], Object.entries(LS).map(([k, r]) => {
  const top = r.contributions.reduce((a, c) => (c.contributionPerYr > a.contributionPerYr ? c : a));
  return [k, f12(r.lsirPerYr), top.name, f6(top.fraction)];
}));
w();
const deck = LS['process deck'];
table(['process deck contribution', 'f x Pd per year', 'fraction of the LSIR'], deck.contributions.map((c) => [c.name, f12(c.contributionPerYr), f6(c.fraction)]));
must('the process deck contributions sum to its LSIR', rel(sum(deck.contributions.map((c) => c.contributionPerYr)), deck.lsirPerYr) < 1e-12, deck.lsirPerYr);
must('the flash fire contributes nothing in the control room', LS['control room'].contributions.find((c) => c.name === 'flash fire').contributionPerYr === 0, 'zero');
w();
w(`The engine's model string, verbatim: "${deck.basis.model}". A scenario whose probability of death is zero at a place contributes zero there: the flash fire at the control room, which lies outside the flammable cloud, adds ${f12(0)}.`);
w();
const deckMax = Math.max(...deck.contributions.map((c) => c.contributionPerYr));
w(`Taking only the largest process deck contribution gives ${f12(deckMax)} per year, derived, and summing the probabilities of death without their frequencies gives a number with no unit at all. The LSIR is the SUM of f times Pd.`);

/* ============================================================ SECTION 11 */

section('pb6b', 'A published contribution reproduced: Purple Book Appendix 6.B', ['Associate m04 l04', 'Expert m05']);
const G6 = GOLD.toxicGridPoint.pbAppendix6b;
const gc = GOLD.individualRisk.pbAppendix6bContribution;
w('Purple Book Appendix 6.B works one individual risk contribution at one grid point for one toxic release, one weather class and one wind sector. Its early steps (the concentration, the probit, the probability integral) are consequence modelling and belong to the consequence course. From the effective cloud width onward the steps are QRA arithmetic, and this section starts there. Values golden: as printed in the source, and as the engine\'s independent oracle recorded the whole chain in the golden, which the engine reproduces within its tested tolerance.');
w();
table(['step', 'printed in the source', 'the whole chain, golden'], [
  ['probability of death on the centreline, Pcl', String(G6.printed.centrelineProbability), f12(G6.expected.centrelineProbability)],
  ['effective cloud width ECW, m', String(G6.printed.effectiveCloudWidthM), f6(G6.expected.effectiveCloudWidthM)],
  ['coverage probability Pci = nws ECW / (2 pi R)', String(G6.printed.coverageProbability), f12(G6.expected.coverageProbability)],
  ['probability of death Pd = Pcl Pci', String(G6.printed.probabilityOfDeath), f12(G6.expected.probabilityOfDeath)],
  ['weather and direction probability PM Pphi', String(G6.printed.weatherDirectionProbability), String(G6.args.weatherDirectionProbability)],
  ['contribution dIR = f PM Pphi Pd, per year', ex(G6.printed.contributionPerYr), f12(G6.expected.contributionPerYr)],
]);
w();
w(`The inputs, golden: a loss of containment frequency f of ${ex(G6.args.frequencyPerYr)} per year, ${G6.args.windSectors} wind sectors, R = ${G6.args.distanceM} m.`);
const stepGrid = success('App 6.B step 6 through locationIndividualRisk', Q.locationIndividualRisk(gc.args));
w();
w(`Step 6 through \`locationIndividualRisk\`, with f PM Pphi = ${ex(gc.args.scenarios[0].frequencyPerYr)} per year and the printed Pd of ${gc.args.scenarios[0].fatalityProbability} (golden): ${f12(stepGrid.lsirPerYr)} per year, which the source prints as ${ex(gc.printed)}.`);
must('step 6 reproduces 7.0e-9 to two significant figures', Number(stepGrid.lsirPerYr.toPrecision(2)) === gc.printed, stepGrid.lsirPerYr);
w();
const sw = G6.printedStepwise;
w(`STEP BY STEP FROM THE PRINTED VALUES (golden): from the printed ECW of ${G6.printed.effectiveCloudWidthM} m the coverage probability is ${f12(sw.pci)}, Pd = ${G6.printed.centrelineProbability} x ${G6.printed.coverageProbability} = ${f6(sw.pd)}, and the contribution ${ex(sw.dir)} per year.`);
w();
const chainPd3 = Number(G6.expected.probabilityOfDeath.toFixed(3));
must('the whole chain rounds Pd to 0.380 while the source prints 0.381', chainPd3 === 0.38 && G6.printed.probabilityOfDeath === 0.381, chainPd3);
w(`TWO ROUTES, TWO THIRD DECIMALS. The whole chain, as the golden records it, gives Pd = ${f12(G6.expected.probabilityOfDeath)}, which rounds to ${chainPd3.toFixed(3)}; the printed ${G6.printed.probabilityOfDeath} follows only from the rounded ECW of ${G6.printed.effectiveCloudWidthM}. The source is internally rounded, and both routes reproduce its printed contribution of ${ex(G6.printed.contributionPerYr)} per year to two significant figures (section 32 returns to this).`);

/* ============================================================ SECTION 12 */

section('irpa', 'Individual risk per annum: one person over the places they occupy', ['Associate m05']);
const place = (name) => LS[name].lsirPerYr;
const opRun = success('EREMOR operator IRPA', Q.individualRiskPerAnnum({ locations: T.EREMOR_OPERATOR.map((l) => ({ name: l.place, lsirPerYr: place(l.place), hoursPerYr: l.hoursPerYr })) }));
w('IRPA is the risk one person carries over a year: the sum over the places they occupy of the LSIR there times the fraction of the year spent there, times a vulnerability factor the analyst may supply (default 1). The EREMOR operator (hours stated):');
w();
table(['place', 'LSIR per year', 'hours a year, stated', 'occupancy fraction', 'contribution per year'], opRun.contributions.map((c, i) => [c.name, f12(place(c.name)), String(T.EREMOR_OPERATOR[i].hoursPerYr), f12(c.occupancyFraction), f12(c.contributionPerYr)]));
w();
w(`IRPA ${f12(opRun.irpaPerYr)} per year, over a total occupancy of ${f12(opRun.totalOccupancyFraction)} of the year. The engine's model string, verbatim: "${opRun.basis.model}".`);
must('the operator IRPA is the sum of the contributions', rel(opRun.irpaPerYr, sum(opRun.contributions.map((c) => c.contributionPerYr))) < 1e-12, opRun.irpaPerYr);
w();
const supRun = success('EREMOR supervisor IRPA', Q.individualRiskPerAnnum({ locations: T.EREMOR_SUPERVISOR.map((l) => ({ name: l.place, lsirPerYr: place(l.place), occupancyFraction: l.occupancyFraction })) }));
w(`The EREMOR supervisor, given as fractions of the year (stated ${T.EREMOR_SUPERVISOR.map((l) => `${l.place} ${l.occupancyFraction}`).join(', ')}): IRPA ${f12(supRun.irpaPerYr)} per year.`);
w();
const opNoOcc = sum(T.EREMOR_OPERATOR.map((l) => place(l.place)));
const op8766 = sum(T.EREMOR_OPERATOR.map((l) => place(l.place) * l.hoursPerYr / 8766));
table(['how the operator IRPA was built', 'IRPA per year'], [
  ['as the engine builds it, hours over 8760', f12(opRun.irpaPerYr)],
  ['the LSIRs summed with no occupancy, derived', f12(opNoOcc)],
  ['hours over 8766, derived', f12(op8766)],
  ['the process deck alone, derived', f12(opRun.contributions[0].contributionPerYr)],
]);
w();
w('ONE PLACE AT A TIME. A person is in one place at a time, so the fractions may not exceed one at any place or in total. A roster of 0.6 and 0.5 of the year is refused (section 3). The occupancy check allows the total to reach one exactly.');
w();
const vulRun = success('EREMOR operator with an accommodation vulnerability factor', Q.individualRiskPerAnnum({ locations: T.EREMOR_OPERATOR.map((l) => ({ name: l.place, lsirPerYr: place(l.place), hoursPerYr: l.hoursPerYr, ...(l.place === 'accommodation' ? { vulnerabilityFactor: T.ACCOMMODATION_VULNERABILITY } : {}) })) }));
w(`THE VULNERABILITY FACTOR is the analyst's own. With ${T.ACCOMMODATION_VULNERABILITY} applied in the accommodation (stated) the operator IRPA is ${f12(vulRun.irpaPerYr)} per year. No source the engine read gives a vulnerability factor for individual risk: the Purple Book indoor and outdoor fractions are for societal risk (section 24), so the default is 1 and the result returns the factor used beside each place\'s contribution.`);

/* ============================================================ SECTION 13 */

section('transect', 'LSIR along a transect, and where it crosses the contours', ['Associate m06']);
const TR = T.EREMOR_TRANSECT;
const tr = success('EREMOR transect', Q.lsirTransect(TR));
w('Along a line from the release, the LSIR at each distance is the sum over scenarios of f times the probability of death at that distance (stated per scenario):');
w();
table(['distance m', ...TR.scenarios.map((s) => `Pd ${s.name}, stated`), 'LSIR per year'], TR.distancesM.map((d, j) => [String(d), ...TR.scenarios.map((s) => String(s.fatalityProbabilities[j])), f12(tr.lsirPerYr[j])]));
w();
w(`The frequencies, stated: ${TR.scenarios.map((s) => `${s.name} ${ex(s.frequencyPerYr)} per year`).join(', ')}. The Purple Book asks for the individual risk contours ${Q.PB_IR_CONTOURS_PER_YR.map(ex).join(', ')} per year to be shown. Where the transect crosses each:`);
w();
table(['contour level per year', 'crossings, m from the release'], tr.contours.map((c) => [ex(c.levelPerYr), c.crossingsM.length ? c.crossingsM.map(f6).join(', ') : 'none on this transect']));
must('the transect falls with distance', tr.lsirPerYr.every((v, i) => i === 0 || v <= tr.lsirPerYr[i - 1]), 'monotone');
w();
w(`A crossing is interpolated in log10 of the LSIR between the two points that bracket the level, and linearly where one side is zero. The basis says, verbatim: "${tr.basis.model}". The interpolation is a PRESENTATION rule the engine chose; nothing published fixes it, so a crossing distance is never graded.`);

/* ============================================================ SECTION 14 */

section('goldenassoc', 'The golden event trees and individual risk cases, run through the engine', ['Associate m06']);
w('Each row runs a golden case through the engine and compares with the golden value (golden: expected). All are ORACLE-DERIVED: no published source prints an event tree or an IRPA worked example.');
w();
const goldRows = [];
GOLD.eventTrees.trees.forEach((c) => {
  const r = success(`golden tree ${c.id}`, Q.eventTree(c.args));
  const ok = Object.entries(c.expected.outcomeTotalsPerYr).every(([k, v]) => rel(r.outcomeTotalsPerYr[k], v) < 1e-12);
  must(`golden tree ${c.id} reproduces`, ok, c.id);
  goldRows.push([c.id, 'eventTree', Object.entries(r.outcomeTotalsPerYr).map(([k, v]) => `${k} ${f12(v)}`).join('; ')]);
});
GOLD.individualRisk.lsir.forEach((c) => {
  const r = success(`golden LSIR ${c.id}`, Q.locationIndividualRisk(c.args));
  must(`golden LSIR ${c.id} reproduces`, rel(r.lsirPerYr, c.expected.lsirPerYr) < 1e-12, c.id);
  goldRows.push([c.id, 'locationIndividualRisk', `LSIR ${f12(r.lsirPerYr)}`]);
});
GOLD.individualRisk.irpa.forEach((c) => {
  const r = success(`golden IRPA ${c.id}`, Q.individualRiskPerAnnum(c.args));
  must(`golden IRPA ${c.id} reproduces`, rel(r.irpaPerYr, c.expected.irpaPerYr) < 1e-12, c.id);
  goldRows.push([c.id, 'individualRiskPerAnnum', `IRPA ${f12(r.irpaPerYr)}, occupancy ${f12(r.totalOccupancyFraction)}`]);
});
table(['golden case', 'function', 'engine result'], goldRows);
w();
const zeroTree = GOLD.eventTrees.trees.find((c) => c.id === 'zero-probability-branch');
w(`The case ${zeroTree.id} shows that a branch of probability zero is allowed: it carries a leaf of frequency zero, and the set still sums to one.`);

/* ============================================================ SECTION 15 */

section('pll', 'Potential loss of life: expected deaths per year', ['Professional m01']);
const crew = success('JISIKE crew PLL', Q.potentialLossOfLife({ scenarios: T.JISIKE_CREW }));
w('Individual risk follows one person. Societal risk asks how many people die at once, and PLL is its expected value: the sum over scenarios of the frequency times the expected number of deaths N. N need not be whole. The JISIKE crew (stated):');
w();
table(['scenario', 'frequency per year, stated', 'N, stated', 'f x N per year'], crew.contributions.map((c, i) => [c.name, ex(T.JISIKE_CREW[i].frequencyPerYr), String(T.JISIKE_CREW[i].fatalities), f12(c.pllPerYr)]));
w();
w(`PLL ${f12(crew.pllPerYr)} fatalities per year. The engine's model string, verbatim: "${crew.basis.model}".`);
must('the no fatality scenario adds zero', crew.contributions[3].pllPerYr === 0, crew.contributions[3].pllPerYr);
w();
const pllFoverN = sum(T.JISIKE_CREW.filter((s) => s.fatalities > 0).map((s) => s.frequencyPerYr / s.fatalities));
const pllF = sum(T.JISIKE_CREW.map((s) => s.frequencyPerYr));
table(['how PLL was built', 'value per year'], [
  ['sum of f x N, the engine', f12(crew.pllPerYr)],
  ['sum of f over N, derived', f12(pllFoverN)],
  ['sum of f with N ignored, derived', f12(pllF)],
]);
w();
w('PLL is an expected number of deaths per year. It is never a probability, and it can exceed one for a large enough population.');
w();
const gp = GOLD.individualRisk.pll[0];
const gpr = success(`golden PLL ${gp.id}`, Q.potentialLossOfLife(gp.args));
must('the golden PLL reproduces', rel(gpr.pllPerYr, gp.expected.pllPerYr) < 1e-12, gpr.pllPerYr);
w(`The golden case ${gp.id} (fractional N and one N of zero) gives ${f12(gpr.pllPerYr)} per year through the engine.`);

/* ============================================================ SECTION 16 */

section('far', 'The fatal accident rate from PLL', ['Professional m02']);
const exposed = T.JISIKE_CREW_PERSONS * T.JISIKE_HOURS_PER_PERSON;
const far = success('JISIKE crew FAR', Q.fatalAccidentRateFromPll({ pllPerYr: crew.pllPerYr, exposedHoursPerYr: exposed }));
w(`FAR is the number of fatalities per 100,000,000 exposed hours: FAR = PLL x 100,000,000 / exposed hours a year. The JISIKE crew is ${T.JISIKE_CREW_PERSONS} people, each exposed ${T.JISIKE_HOURS_PER_PERSON} hours a year (stated), so ${exposed} exposed hours a year, derived. FAR ${f6(far.far)}.`);
w();
w(`The engine's model string, verbatim: "${far.basis.model}". The base is imported from the safety statistics engine, "${far.basis.source}".`);
w();
const farPerPerson = success('FAR with one person\'s hours', Q.fatalAccidentRateFromPll({ pllPerYr: crew.pllPerYr, exposedHoursPerYr: T.JISIKE_HOURS_PER_PERSON })).far;
table(['how FAR was built', 'FAR'], [
  ['PLL over the crew\'s exposed hours, the engine', f6(far.far)],
  ['PLL over one person\'s hours', f6(farPerPerson)],
  ['a base of 1,000,000 hours, derived', f6(far.far / 100)],
]);
w();
const W = T.WHOLE_PLL;
const farWhole = success('FAR of a whole PLL', Q.fatalAccidentRateFromPll({ pllPerYr: W.fatalities, exposedHoursPerYr: W.exposedHoursPerYr }));
const ssFar = success('safety statistics FAR of the same count', SS.fatalAccidentRate({ fatalities: W.fatalities, exposureHours: W.exposedHoursPerYr }));
const ssVal = ssFar.rate;
must('a whole PLL gives exactly the safety statistics FAR', farWhole.far === ssVal, `${farWhole.far} ${JSON.stringify(ssFar).slice(0, 80)}`);
w(`THE SAME FAR AS THE SAFETY STATISTICS COURSE. A PLL of ${W.fatalities} over ${ex(W.exposedHoursPerYr)} hours (stated) gives ${f6(farWhole.far)} here, and the safety statistics engine's fatal accident rate of ${W.fatalities} fatalities over the same hours gives ${f6(ssVal)}: the same number to the last bit. That course counts deaths that happened; this one counts deaths expected.`);
w();
const gfar = GOLD.individualRisk.far;
w(`The golden FAR cases through the engine: ${gfar.map((c) => `${c.id} ${f6(success(`golden FAR ${c.id}`, Q.fatalAccidentRateFromPll(c.args)).far)}`).join('; ')}.`);

/* ============================================================ SECTION 17 */

section('fncurve', 'The F-N curve: the frequency of N or more deaths', ['Professional m03']);
const OFF = T.JISIKE_OFFSITE;
const fn = success('JISIKE off-site F-N', Q.fnCurve({ scenarios: OFF }));
w('The F-N curve plots, against N, the cumulative frequency F(N) of all scenarios with N OR MORE deaths. It is a step function: F is constant between two consecutive values of N and falls at each. Scenarios with no deaths are kept out of the curve, and their frequency is reported. The JISIKE off-site scenarios (stated):');
w();
table(['scenario', 'frequency per year, stated', 'N, stated'], OFF.map((s) => [s.name, ex(s.frequencyPerYr), String(s.fatalities)]));
w();
table(['N', 'F(N), N or more, per year'], fn.points.map((p) => [f6(p.fatalities), f12(p.cumulativeFrequencyPerYr)]));
w();
w(`Expected fatalities per year, sum f N: ${f12(fn.expectedFatalitiesPerYr)}. Frequency of scenarios with no deaths, kept out of the curve: ${f12(fn.zeroFatalityFrequencyPerYr)} per year.`);
must('two scenarios with the same N make one corner', fn.points.filter((p) => p.fatalities === 3).length === 1, 'one corner');
w();
w(`Two scenarios share N = 3; they make ONE corner, carrying both frequencies. The engine's model string, verbatim: "${fn.basis.model}".`);
w();
const Fat = (n) => { let v = 0; fn.points.forEach((p) => { if (p.fatalities >= n) v += 0; }); return fn.points.filter((p) => p.fatalities >= n).length ? fn.points.find((p) => p.fatalities >= n).cumulativeFrequencyPerYr : 0; };
w(`Reading the step: F(5) = F(12) = ${f12(Fat(5))} per year, because no scenario has N between 3 and 12, and F(12.5) = F(40) = ${f12(Fat(12.5))} per year.`);
must('F is flat between corners', Fat(5) === Fat(12) && Fat(12.5) === Fat(40), 'flat');

/* ============================================================ SECTION 18 */

section('fnwrong', 'Reading the curve wrongly: more than N, and one N alone', ['Professional m03 l04']);
const moreThan = (n) => sum(OFF.filter((s) => s.fatalities > n).map((s) => s.frequencyPerYr));
const nonCum = (n) => sum(OFF.filter((s) => s.fatalities === n).map((s) => s.frequencyPerYr));
table(['N', 'F(N), N or more (the engine)', 'more than N, derived', 'only scenarios with exactly N, derived'], fn.points.map((p) => [f6(p.fatalities), f12(p.cumulativeFrequencyPerYr), f12(moreThan(p.fatalities)), f12(nonCum(p.fatalities))]));
must('more than N differs at every corner', fn.points.every((p) => moreThan(p.fatalities) < p.cumulativeFrequencyPerYr), 'differs');
w();
w('THE SOURCE CONTRADICTS ITSELF. The Purple Book\'s introduction to societal risk says "the cumulative frequency of having more than N deaths"; its equation 6.6 and section 6.3 say "N or more". The engine follows the equation, and so does this course. Reading "more than N" drops the scenario sitting exactly at each corner, as the middle column shows.');

/* ============================================================ SECTION 19 */

section('fnevidence', 'What the F-N curve is checked against: self-consistency, and no published example', ['Professional m03 l05', 'Expert m05']);
const area = fn.points.reduce((a, p, i) => a + p.cumulativeFrequencyPerYr * (p.fatalities - (i ? fn.points[i - 1].fatalities : 0)), 0);
must('the area under the curve equals sum f N', rel(area, fn.expectedFatalitiesPerYr) < 1e-12, `${area} ${fn.expectedFatalitiesPerYr}`);
w(`THE AREA IDENTITY. The area under the step curve, summed step by step as F at each corner times the width of its step, derived, is ${f12(area)} per year, equal to the expected fatalities per year, ${f12(fn.expectedFatalitiesPerYr)}. For the JISIKE off-site set that is also the off-site PLL.`);
w();
w('NO PUBLISHED WORKED EXAMPLE. No source the engine read prints a worked F-N curve or a worked societal risk calculation, and the CCPS and HSE worked examples were not available. The curve is checked by SELF-CONSISTENCY ONLY: a brute force count at every corner, a second route on a grid of N, and the area identity above. This course never presents an F-N figure as a published reproduction.');
w();
w('What IS published, and reproduced, is the criterion side: the three Bevi points lie on the Purple Book line (section 20), and the R2P2 point is printed in the source (section 22).');

/* ============================================================ SECTION 20 */

section('criteria', 'Criterion lines: F = C over N to the alpha, and the Dutch line', ['Professional m04']);
const vrom = Q.FN_CRITERIA['vrom-establishments'];
w(`A criterion line has the form F = C / N^alpha between a smallest and a largest N. Alpha of 1 is called risk neutral and 2 risk averse. The engine's one line preset, \`vrom-establishments\`: C = ${ex(vrom.constantC)}, alpha = ${vrom.exponentAlpha}, from N = ${vrom.minFatalities}, no upper end. Its source, verbatim: "${vrom.source}".`);
w();
const bevi = GOLD.fn.beviPoints;
table(['N, golden', 'Bevi value, printed', 'the line C / N^alpha, engine constants'], bevi.map((b) => [String(b.fatalities), ex(b.printed), ex(vrom.constantC / b.fatalities ** vrom.exponentAlpha)]));
must('the three Bevi points lie on the line', bevi.every((b) => rel(vrom.constantC / b.fatalities ** vrom.exponentAlpha, b.printed) < 1e-12), 'on');
w();
w('The Purple Book Figure 6.8 caption prints the line as a recommended limit for establishments; Bevi article 13 asks for the group risk to be COMPARED with the same three points, calling them an orientation value. Bevi was repealed on 1 January 2024, and the engine did not read its successor. The line is therefore a published comparison the analyst chooses to make, and the engine reports a state against it (section 21).');
w();
const vj = success('JISIKE against the Dutch line', Q.fnCriterionComparison({ scenarios: OFF, criterion: 'vrom-establishments' }));
w('CORNERS DECIDE EVERYTHING. F is flat on each step and the line falls with N, so on each step the ratio of F to the line is largest at the step\'s right corner, which the curve attains. The engine compares only at the corners inside the line\'s range, and that is exact. The JISIKE off-site curve against the Dutch line:');
w();
table(['corner N', 'F(N) per year', 'line per year', 'ratio F / line', 'state'], vj.checks.map((c) => [f6(c.fatalities), f12(c.curveFrequencyPerYr), f12(c.criterionFrequencyPerYr), f6(c.ratio), c.state]));
must('the corner at N = 3 is below the line range and not checked', !vj.checks.some((c) => c.fatalities === 3), 'nMin');
w();
w(`The corner at N = 3 lies below the line's smallest N of ${vrom.minFatalities} and is not checked.`);

/* ============================================================ SECTION 21 */

section('exceed', 'Where a curve exceeds, and the worst ratio', ['Professional m04']);
w(`State ${vj.state}, worst ratio ${f6(vj.maxRatio)} at N = ${f6(vj.worstAtFatalities)}.`);
w();
table(['exceeding step ends at N', 'F above the line from N', 'to N'], vj.exceedances.map((e) => [f6(e.fatalities), f6(e.exceedsOverFatalities.from), f6(e.exceedsOverFatalities.to)]));
w();
w('For each exceeding step the engine reports the range of N over which F lies above the line: from the largest of the previous corner, the smallest N of the line, and the N where the line falls to F, which is (C / F)^(1 / alpha); to the corner itself.');
const e40 = vj.exceedances.find((e) => e.fatalities === 40);
if (e40) {
  const cross = (vrom.constantC / e40.curveFrequencyPerYr) ** (1 / vrom.exponentAlpha);
  must('the step ending at 40 starts at its crossing', rel(e40.exceedsOverFatalities.from, Math.max(12, cross)) < 1e-12, e40.exceedsOverFatalities.from);
  w();
  w(`On the step ending at N = 40, F is ${f12(e40.curveFrequencyPerYr)} per year, the line falls to it at N = (${ex(vrom.constantC)} / F)^(1/${vrom.exponentAlpha}) = ${f6(cross)}, derived, and the previous corner is 12, so F lies above the line from ${f6(e40.exceedsOverFatalities.from)} to 40.`);
}
w();
const gm = GOLD.fn.comparisons.find((c) => c.id === 'mixed-vs-line-nmax');
const gmr = success('golden comparison with a finite nMax', Q.fnCriterionComparison(gm.args));
must('the golden nMax comparison reproduces', gmr.state === gm.expected.state && rel(gmr.maxRatio, gm.expected.maxRatio) < 1e-12, gmr.state);
const capped = success('JISIKE against a capped line', Q.fnCriterionComparison({ scenarios: OFF, criterion: T.CAPPED_LINE }));
w(`A LINE WITH AN UPPER END. With the same constants capped at N = ${T.CAPPED_LINE.maxFatalities} (stated), the corner at N = 300 is out of range, and the engine evaluates F at N = ${T.CAPPED_LINE.maxFatalities} itself, where the curve still has a step: ${capped.checks.map((c) => `N ${f6(c.fatalities)} ratio ${f6(c.ratio)} ${c.state}`).join('; ')}.`);
must('the capped comparison checks N = 100', capped.checks.some((c) => c.fatalities === 100), 'nMax');

/* ============================================================ SECTION 22 */

section('point', 'The one published R2P2 point, and a line the analyst supplies', ['Professional m05']);
const r2 = Q.FN_CRITERIA['r2p2-para-136'];
w(`R2P2 paragraph 136 gives a single POINT: an accident killing 50 or more people in one event should be regarded as intolerable if its frequency is more than one in five thousand a year. The preset \`r2p2-para-136\` is that one point, N = ${r2.points[0].fatalities} at ${f12(r2.points[0].frequencyPerYr)} per year. R2P2 defers extrapolation to other N to a reference the engine did not read, so the engine gives the point NO SLOPE.`);
w();
const jr2 = success('JISIKE against the R2P2 point', Q.fnCriterionComparison({ scenarios: OFF, criterion: 'r2p2-para-136' }));
table(['N', 'F(N) per year', 'point per year', 'ratio', 'state'], jr2.checks.map((c) => [f6(c.fatalities), f12(c.curveFrequencyPerYr), f12(c.criterionFrequencyPerYr), f6(c.ratio), c.state]));
w();
w(`Against the point, the JISIKE off-site curve is ${jr2.state}. F(50) is the frequency of 50 OR MORE deaths, the scenarios at N = 300 alone here.`);
w();
const caller = success('JISIKE against the analyst\'s slope one line', Q.fnCriterionComparison({ scenarios: OFF, criterion: T.CALLER_LINE }));
w(`A LINE THE ANALYST SUPPLIES. A line of slope minus one through the point is common practice, but it is not in R2P2 and it is not a preset. An analyst who wants it gives it as their own criterion, C = ${T.CALLER_LINE.constantC} and alpha = ${T.CALLER_LINE.exponentAlpha}, from N = 1 by default. The JISIKE curve against it: ${caller.state}, worst ratio ${f6(caller.maxRatio)} at N = ${f6(caller.worstAtFatalities)}. The basis then says the source is "${caller.basis.source}".`);

/* ============================================================ SECTION 23 */

section('touches', 'Touching the line, and the state words', ['Professional m05']);
const touch = success('a curve touching the Dutch line', Q.fnCriterionComparison({ scenarios: T.TOUCHING, criterion: 'vrom-establishments' }));
w(`A curve built to sit exactly on the Dutch line at N = 10 (stated: ${T.TOUCHING.map((s) => `${s.name} ${ex(s.frequencyPerYr)} per year at N = ${s.fatalities}`).join('; ')}):`);
w();
table(['N', 'F(N) per year', 'line per year', 'ratio', 'state'], touch.checks.map((c) => [f6(c.fatalities), f12(c.curveFrequencyPerYr), f12(c.criterionFrequencyPerYr), f6(c.ratio), c.state]));
must('the touching curve TOUCHES', touch.state === 'TOUCHES', touch.state);
w();
w(`Overall state ${touch.state}. EXCEEDS means strictly above the line at some corner; a corner within ${Q.BOUNDARY_SNAP} relative of the line is AT_LINE, and a curve with no exceedance and at least one AT_LINE corner TOUCHES. The basis says, verbatim: "${touch.basis.boundary}".`);
w();
const gt = GOLD.fn.comparisons.find((c) => c.id === 'r2p2-touch');
const gtr = success('golden R2P2 touch', Q.fnCriterionComparison(gt.args));
must('the golden R2P2 touch reproduces', gtr.state === 'TOUCHES', gtr.state);
w(`The golden case ${gt.id}: F(50) = ${ex(gt.args.scenarios[0].frequencyPerYr)} + ${ex(gt.args.scenarios[1].frequencyPerYr)}, which is ${gtr.checks[0].curveFrequencyPerYr} in double, ratio ${gtr.checks[0].ratio}, state ${gtr.state}. Without the snap a plain comparison would call this curve BELOW, although on paper it sits exactly on the point.`);
w();
table(['state word', 'meaning'], [
  ['BELOW', 'every checked corner strictly below the line or point'],
  ['TOUCHES', 'no corner above, and at least one on the line within the snap'],
  ['EXCEEDS', 'at least one corner strictly above'],
  ['AT_LINE', 'the state of one corner on the line'],
]);

/* ============================================================ SECTION 24 */

section('fractions', 'Fractions of deaths indoors and outdoors, and what they rest on', ['Professional m06', 'Expert m05 l03']);
w('For SOCIETAL risk the Purple Book counts deaths indoors and outdoors separately: Fd = FE,in x fpop,in + FE,out x (1 - fpop,in), where fpop,in is the fraction of the population indoors (Table 5.3: day 0.93, night 0.99). The rules by effect, run through the engine:');
w();
const fr = [];
['day', 'night'].forEach((per) => {
  const r = success(`toxic ${per}`, Q.pbFatalityFractions({ effect: 'toxic', probabilityOfDeath: T.TOXIC_PE, period: per }));
  fr.push([`toxic, PE ${T.TOXIC_PE} stated, ${per}`, f6(r.probabilityOfDeath), f6(r.fractionDyingIndoors), f6(r.fractionDyingOutdoors), f6(r.fractionIndoors), f12(r.fractionOfDeaths)]);
});
T.OVERPRESSURES_PA.forEach((pa) => {
  const r = success(`explosion ${pa} Pa`, Q.pbFatalityFractions({ effect: 'explosion', peakOverpressurePa: pa, period: 'day' }));
  fr.push([`explosion, ${pa} Pa gauge, day`, f6(r.probabilityOfDeath), f6(r.fractionDyingIndoors), f6(r.fractionDyingOutdoors), f6(r.fractionIndoors), f12(r.fractionOfDeaths)]);
});
[true, false].forEach((inside) => {
  const r = success(`flash fire ${inside}`, Q.pbFatalityFractions({ effect: 'flash-fire', insideFlameEnvelope: inside, period: 'night' }));
  fr.push([`flash fire, ${inside ? 'inside' : 'outside'} the envelope, night`, f6(r.probabilityOfDeath), f6(r.fractionDyingIndoors), f6(r.fractionDyingOutdoors), f6(r.fractionIndoors), f12(r.fractionOfDeaths)]);
});
const fire35 = success('fire at 35 kW/m2', Q.pbFatalityFractions({ effect: 'fire', heatFluxWM2: Q.PB_IGNITION_FLUX_WM2, period: 'day' }));
fr.push([`fire at ${Q.PB_IGNITION_FLUX_WM2} W/m2, day`, f6(fire35.probabilityOfDeath), f6(fire35.fractionDyingIndoors), f6(fire35.fractionDyingOutdoors), f6(fire35.fractionIndoors), f12(fire35.fractionOfDeaths)]);
table(['case', 'PE', 'FE,in', 'FE,out', 'fpop,in', 'Fd'], fr);
w();
w(`The explosion rows follow Figure 5.5: above ${Q.PB_VCE_OVERPRESSURE_PA.lethal} Pa gauge everyone dies; above ${Q.PB_VCE_OVERPRESSURE_PA.indoorOnly} Pa only 0.025 of those indoors; at or below either threshold, the lower rule. Exactly ${Q.PB_VCE_OVERPRESSURE_PA.lethal} Pa falls in the lower rule. A fire at ${Q.PB_IGNITION_FLUX_WM2} W/m2 or more kills everyone, indoors or out (Figure 5.4 prints "Q >= 35 kW/m2"). Below that flux the fire's probability of death comes from a heat probit, which is consequence modelling and belongs to the consequence course.`);
w();
w('WHAT THE FRACTIONS REST ON. The factors 0.1 (toxic indoors), 0.14 (fire outdoors), 0.025 (explosion indoors) and the Table 5.3 fractions are single transcriptions of the Purple Book, which prints no numeric example for them. The engine\'s own validation planted a wrong clothing factor in both the engine and its oracle, and the suite stayed green. So this course teaches the rules and NEVER grades a number that passes through them.');
w();
w('The fractions are for SOCIETAL risk: the expected number of deaths in a population cell is Fd times the people in it. They are not a vulnerability factor for individual risk (section 12).');

/* ============================================================ SECTION 25 */

section('alarp', 'The ALARP regions of an individual risk', ['Expert m01']);
const tw = Q.TOLERABILITY_PRESETS['r2p2-workers'];
const tp = Q.TOLERABILITY_PRESETS['r2p2-public'];
w(`R2P2 divides individual risk into three regions. Above the upper limit a risk is UNACCEPTABLE whatever the benefit. At or below the lower limit it is BROADLY_ACCEPTABLE. Between, it is TOLERABLE only if reduced as low as reasonably practicable (ALARP), and the engine sets \`alarpDemonstrationRequired\`. The presets: workers unacceptable above ${ex(tw.unacceptableAbovePerYr)} and broadly acceptable at or below ${ex(tw.broadlyAcceptableAtOrBelowPerYr)} per year; the public above ${ex(tp.unacceptableAbovePerYr)} and at or below ${ex(tp.broadlyAcceptableAtOrBelowPerYr)}. R2P2 says the limits are guidelines, to be applied with judgement.`);
w();
const ladder = T.IR_LADDER.map((ir) => {
  const a = success(`workers ${ir}`, Q.alarpBand({ individualRiskPerYr: ir, thresholds: 'r2p2-workers' }));
  const b = success(`public ${ir}`, Q.alarpBand({ individualRiskPerYr: ir, thresholds: 'r2p2-public' }));
  return [ir === 0 ? '0' : ex(ir), a.band, String(a.atBoundary), String(a.alarpDemonstrationRequired), b.band, String(b.atBoundary)];
});
table(['individual risk per year, stated', 'workers band', 'workers boundary', 'ALARP demonstration required (workers)', 'public band', 'public boundary'], ladder);
w();
const one = Q.alarpBand({ individualRiskPerYr: 2e-5, thresholds: 'r2p2-workers' });
w(`The ratios the engine returns beside the band, for 2e-5 per year against the worker preset: ${f6(one.ratioToUnacceptable)} of the upper limit and ${f6(one.ratioToBroadlyAcceptable)} times the lower. The basis model, verbatim: "${one.basis.model}".`);
w();
w('The R2P2 box of industry rates (golden, published), each banded against the preset its source names:');
w();
const box = GOLD.alarp.filter((c) => /^PUBLISHED/.test(c.source));
table(['golden case', 'individual risk per year', 'preset', 'engine band', 'what the source says'], box.map((c) => {
  const r = success(`R2P2 box ${c.id}`, Q.alarpBand(c.args));
  must(`R2P2 box ${c.id} bands as golden`, r.band === c.expected.band, r.band);
  return [c.id, f12(c.args.individualRiskPerYr), c.args.thresholds, r.band, c.source.replace(/^PUBLISHED: /, '')];
}));

/* ============================================================ SECTION 26 */

section('boundary', 'A threshold belongs to the lower band, and the boundary snap', ['Expert m01']);
w('THE OWNER\'S DECISION. A value exactly at a threshold belongs to the LOWER band. An individual risk exactly at 1e-3 is TOLERABLE for workers; exactly at 1e-6 it is BROADLY_ACCEPTABLE; a cost exactly DF times the benefit is NOT grossly disproportionate (section 31); a curve exactly on a line TOUCHES it (section 23). Every source the engine read words its threshold this way: R2P2 paragraph 136 says "more than", Bevi says "ten hoogste" (at most), and the checklist says costs over benefits "greater than" the DF. The Purple Book Figure 6.8 caption, "F < 1e-3 N^-2", reads the other way at equality, and R2P2\'s bias to safety could argue for the other convention. The result says which boundary was touched.');
w();
const snapRows = T.SNAP_PRODUCTS.map(({ factors, thresholdPerYr, preset }) => {
  const v = factors.reduce((a, x) => a * x, 1);
  const r = success(`snap ${factors.join(' x ')}`, Q.alarpBand({ individualRiskPerYr: v, thresholds: preset }));
  return { factors, v, thresholdPerYr, preset, r };
});
table(['product, stated', 'in IEEE double', 'threshold it means', 'preset', 'engine band', 'boundary'], snapRows.map(({ factors, v, thresholdPerYr, preset, r }) => [factors.join(' x '), String(v), ex(thresholdPerYr), preset, r.band, String(r.atBoundary)]));
must('every snap product lands strictly above its threshold in double', snapRows.every(({ v, thresholdPerYr }) => v > thresholdPerYr), snapRows.map((x) => x.v).join());
const firstSnap = snapRows[0];
must('0.1 x 0.1 x 0.1 is still TOLERABLE for workers, at the unacceptable boundary', firstSnap.r.band === 'TOLERABLE' && firstSnap.r.atBoundary === 'unacceptable', firstSnap.r.band);
must('0.2 x 5e-6 is BROADLY_ACCEPTABLE for the public', snapRows[2].r.band === 'BROADLY_ACCEPTABLE' && snapRows[2].r.atBoundary === 'broadly-acceptable', snapRows[2].r.band);
w();
w(`THE SNAP. BOUNDARY_SNAP is ${Q.BOUNDARY_SNAP} relative: a computed value within that distance of a threshold IS the threshold, and \`atBoundary\` names it. Without it, 0.1 x 0.1 x 0.1 = ${firstSnap.v} in double would be UNACCEPTABLE for workers, although the exact product is the threshold itself.`);
w();
const outside = Q.alarpBand({ individualRiskPerYr: 1.0000001e-6, thresholds: 'r2p2-public' });
w(`The snap is narrow: 1.0000001e-6 per year, one part in ten million above the lower limit, is ${outside.band} for the public with boundary ${String(outside.atBoundary)}.`);
must('one part in ten million is outside the snap', outside.band === 'TOLERABLE' && outside.atBoundary === null, outside.band);

/* ============================================================ SECTION 27 */

section('benefit', 'The benefit of a measure: a fatality prevented and its value', ['Expert m02']);
const hv = Q.HSE_ILLUSTRATIVE_VALUES;
w(`A risk reduction measure lowers the PLL by deltaPLL fatalities a year. Its yearly benefit is deltaPLL times the value of preventing a fatality (VPF), plus the value of the injuries and ill health it prevents: B = deltaPLL x VPF + the sum of expected cases a year times the value per case. Over the measure's life the benefit is the present value of B each year, uprated by a growth rate if one is given.`);
w();
table(['illustrative value', 'figure', 'source, verbatim'], [
  ['VPF, 2001', String(hv.vpfGbp2001.value), hv.vpfGbp2001.source],
  ['VPF, 2003 Q3', String(hv.vpfGbp2003Q3.value), hv.vpfGbp2003Q3.source],
  ['DF', '', hv.disproportionFactor.note],
]);
w();
w('VPF HAS NO DEFAULT. Both figures are exported for illustration only, in GBP at their price year, and a call without a VPF is refused (section 3). Current HSE figures were not found on a live page, so neither is a recommendation.');
w();
const EF = T.EDIKAN_FIREWALL;
const efU = success('EDIKAN firewall undiscounted', Q.costBenefit(EF));
w(`The EDIKAN firewall (stated): deltaPLL ${ex(EF.deltaPllPerYr)} per year, VPF ${EF.vpf}, a life of ${EF.lifetimeYears} years, capital ${EF.capitalCost} at year 0 and ${EF.annualCost} a year, DF ${EF.disproportionFactor}. Undiscounted, the fatality benefit is ${f2(efU.fatalityBenefitPerYr)} a year and the present value of the benefit ${f2(efU.presentValueBenefit)}.`);
w();
const rm = GOLD.costBenefit.find((c) => c.id === 'r2p2-vpf-footnote');
const rmr = success('R2P2 VPF footnote', Q.costBenefit(rm.args));
must('the R2P2 margin reproduces 10', rel(rmr.presentValueBenefit, rm.printed) < 1e-12, rmr.presentValueBenefit);
w(`R2P2 Appendix 3 paragraph 13 (golden, published): with a VPF of ${rm.args.vpf}, a reduction of one in 100,000 in the risk of one person is worth about ${rm.printed}. Through the engine, deltaPLL ${ex(rm.args.deltaPllPerYr)} for ${rm.args.lifetimeYears} year gives a benefit of ${f2(rmr.presentValueBenefit)}.`);

/* ============================================================ SECTION 28 */

section('checklist', 'The published CBA checklist example, and a rounded print', ['Expert m02']);
const ck = GOLD.costBenefit.find((c) => c.id === 'hse-cba-checklist-example');
const ckr = success('CBA checklist example', Q.costBenefit(ck.args));
w(`The HSE CBA checklist works one explosion measure over ${ck.args.lifetimeYears} years, undiscounted (golden, published). Its inputs: deltaPLL ${ex(ck.args.deltaPllPerYr)}, VPF ${ck.args.vpf}, and three injury lines.`);
w();
const harmRows = ckr.otherHarms.map((h, i) => [h.name, String(ck.args.otherHarms[i].expectedCasesPerYr), String(ck.args.otherHarms[i].valuePerCase), f2(h.benefitPerYr * ck.args.lifetimeYears)]);
table(['line', 'cases a year, golden', 'value per case, golden', 'benefit over the life, engine'], [
  ['fatalities', String(ck.args.deltaPllPerYr), String(ck.args.vpf), f2(ckr.fatalityBenefitPerYr * ck.args.lifetimeYears)],
  ...harmRows,
]);
w();
table(['figure', 'printed', 'engine'], [
  ['fatalities', String(ck.printed.fatalities), f2(ckr.fatalityBenefitPerYr * ck.args.lifetimeYears)],
  ['permanent incapacity', String(ck.printed.permanent), f2(ckr.otherHarms[0].benefitPerYr * ck.args.lifetimeYears)],
  ['serious injury', String(ck.printed.serious), f2(ckr.otherHarms[1].benefitPerYr * ck.args.lifetimeYears)],
  ['slight injury', String(ck.printed.slight), f2(ckr.otherHarms[2].benefitPerYr * ck.args.lifetimeYears)],
  ['total benefit', String(ck.printed.total), f2(ckr.presentValueBenefit)],
  ['largest reasonable cost at DF 10', String(ck.printed.maxCost), f2(ckr.maximumReasonablyPracticableCost)],
]);
must('the checklist total reproduces within one pound', Math.abs(ckr.presentValueBenefit - ck.printed.total) <= ck.printedAbsTol, ckr.presentValueBenefit);
must('at the printed 93,000 the verdict is grossly disproportionate', ckr.verdict === 'GROSSLY_DISPROPORTIONATE', ckr.verdict);
w();
w(`A ROUNDED PRINT AND ITS VERDICT. The serious injury line is ${f2(ckr.otherHarms[1].benefitPerYr * ck.args.lifetimeYears)} and is printed ${ck.printed.serious}; the total is ${f2(ckr.presentValueBenefit)} and is printed ${ck.printed.total}; the limit is printed ${ck.printed.maxCost} against a computed ${f2(ckr.maximumReasonablyPracticableCost)}. At exactly the printed ${ck.printed.maxCost}, the engine returns ${ckr.verdict}, by ${f2(ck.args.capitalCost - ckr.maximumReasonablyPracticableCost)}. The checklist meant "in the region of", and the verdict is an artefact of its rounding. The lesson for an ALARP note: compute from the inputs, never from a rounded figure.`);
w();
w('The checklist table also prints a permanent incapacity value as "207,2000"; its own worked example uses 207,200, as the golden does.');

/* ============================================================ SECTION 29 */

section('discounting', 'Year-end present values, and two HSE discounting conventions', ['Expert m03']);
w('Every present value in the engine goes through the canonical year-end present value of the economics engine. Capital is spent at year 0; each annual cost and each year\'s benefit fall at the END of years 1 to n. The rates default to zero, which is undiscounted, as in the checklist example.');
w();
w('THE TWO HSE SOURCES DISAGREE. R2P2 (2001) discounts at 6 percent real and uprates benefits by 4 percent a year. The CBA checklist (2003) discounts benefits at no more than 1.5 percent and costs at no less than 3.5 percent. All three rates are inputs. The EDIKAN firewall under each:');
w();
const convRows = T.CONVENTIONS.map((c) => {
  const r = success(`EDIKAN firewall ${c.label}`, Q.costBenefit({ ...EF, ...c, label: undefined }));
  return { c, r };
});
table(['convention', 'benefit rate', 'cost rate', 'benefit growth', 'present value of the benefit', 'present value of the cost', 'cost / benefit', 'verdict at DF 3'], convRows.map(({ c, r }) => [c.label, String(c.benefitDiscountRate), String(c.costDiscountRate), String(c.benefitGrowthRate), f2(r.presentValueBenefit), f2(r.presentValueCost), f6(r.costToBenefitRatio), r.verdict]));
must('the convention moves the ratio', new Set(convRows.map(({ r }) => r.costToBenefitRatio.toFixed(6))).size === 3, 'three');
w();
w(`The basis says, for the checklist row, verbatim: "${convRows[1].r.basis.discounting}".`);
w();
const g4 = GOLD.costBenefit.find((c) => c.id === 'r2p2-6pc-with-4pc-uprating');
const g4r = success('golden R2P2 6 with 4', Q.costBenefit(g4.args));
must('the golden R2P2 case reproduces', rel(g4r.presentValueBenefit, g4.expected.presentValueBenefit) < 1e-12, g4r.presentValueBenefit);
w(`The golden R2P2 case through the engine: present value of the benefit ${f2(g4r.presentValueBenefit)}, of the cost ${f2(g4r.presentValueCost)}.`);
w();
w('The present value mechanics themselves belong to the economics courses. This course uses them only to put a cost and a benefit on the same footing for the gross disproportion test.');

/* ============================================================ SECTION 30 */

section('icaf', 'The implied cost of averting a fatality, counted undiscounted', ['Expert m03']);
w('The ICAF, the implied cost of averting a fatality, is what the engine calls the cost per fatality prevented (CPF, R2P2 Appendix 3 paragraph 15): the present value of the cost over the number of fatalities prevented, where fatalities prevented = deltaPLL x the life in years, UNDISCOUNTED.');
w();
table(['convention', 'fatalities prevented', 'present value of the cost', 'ICAF'], convRows.map(({ c, r }) => [c.label, f6(r.fatalitiesPrevented), f2(r.presentValueCost), f2(r.costPerFatalityPrevented)]));
must('fatalities prevented do not move with the discount rate', convRows.every(({ r }) => r.fatalitiesPrevented === convRows[0].r.fatalitiesPrevented), 'undiscounted');
w();
const disc = convRows[1].r;
const discFat = disc.presentValueBenefit / (disc.benefitPerYr / EF.deltaPllPerYr) ;
w(`The fatalities prevented stay at ${f6(disc.fatalitiesPrevented)} whatever the rate; only the cost is discounted. Dividing instead by the DISCOUNTED fatalities (the present value of the benefit over VPF, ${f6(discFat)}, derived) gives ${f2(disc.presentValueCost / discFat)}, a different number the engine never returns.`);
w();
w('An ICAF can be read against the VPF: a measure whose ICAF is below VPF times the DF passes the gross disproportion test when injuries add nothing. With injuries in the benefit, compare the cost to benefit ratio with the DF (section 31); the ICAF alone leaves them out.');

/* ============================================================ SECTION 31 */

section('disproportion', 'The gross disproportion test', ['Expert m04']);
w('The HSE checklist\'s test: a measure is not reasonably practicable when its costs divided by its benefits are GREATER than the disproportion factor, cost > DF x benefit. The engine returns the ratio, the verdict and the largest reasonably practicable cost, DF times the present value of the benefit. DFs "vary from upwards of 1", and the checklist\'s example says a DF above 10 is unlikely; a DF below 1 is refused.');
w();
const dfRows = T.DF_SWEEP.map((df) => {
  const r = success(`EDIKAN firewall DF ${df}`, Q.costBenefit({ ...EF, disproportionFactor: df }));
  return [String(df), f6(r.costToBenefitRatio), f2(r.maximumReasonablyPracticableCost), f2(r.presentValueCost), r.verdict];
});
table(['DF, stated', 'cost / benefit', 'largest reasonably practicable cost', 'present value of the cost', 'verdict'], dfRows);
w();
w('The cost to benefit ratio does not depend on the DF; only the verdict and the largest reasonable cost do.');
w();
const eq = GOLD.costBenefit.find((c) => c.id === 'exactly-at-df');
const eqr = success('cost exactly DF x benefit', Q.costBenefit(eq.args));
must('exactly at DF is not grossly disproportionate, at the boundary', eqr.verdict === 'NOT_GROSSLY_DISPROPORTIONATE' && eqr.atBoundary === true, eqr.verdict);
w(`STRICTLY GREATER. The golden case ${eq.id}: a cost of ${eq.args.capitalCost} against DF ${eq.args.disproportionFactor} times a benefit of ${f2(eqr.presentValueBenefit)}, derived as exactly equal on paper. The engine returns ${eqr.verdict} with atBoundary ${eqr.atBoundary}: at the boundary the measure is still reasonably practicable, and the duty to adopt it stands.`);
w();
w(`The basis model string, verbatim: "${eqr.basis.model}".`);

/* ============================================================ SECTION 32 */

section('notknown', 'What the engine does not know', ['Expert m05']);
table(['what the engine does not know', 'why, from its record', 'what the analyst does instead'], [
  ['an aversion weighted risk integral', 'no source it read defines one', 'reports the expected value sum f N and the F-N curve, and argues aversion in words'],
  ['a slope for the R2P2 point', 'R2P2 gives one point and defers the slope to a reference not read', 'supplies a line of their own and says it is theirs (section 22)'],
  ['the successor to the Bevi values', 'Bevi was repealed on 1 January 2024 and its successor was not read', 'treats the Dutch line as a historical published comparison'],
  ['current HSE VPF and injury values', 'the checklist values are 2003 figures and none is a default', 'states the VPF and its year, and justifies it'],
  ['a check of the Table 4.5 cells, the 0.6 and 0.4 split and the Fd factors', 'each is one transcription with no published example to test it', 'states the values used and their source'],
  ['a published F-N worked example', 'none was available; the curve is checked by self-consistency', 'never cites an F-N figure as published-verified'],
  ['a probability of death', 'it comes from the consequence course', 'takes Pd as an input and records where it came from'],
  ['a grid, a wind rose, a population map', 'the caller supplies each scenario frequency and Pd', 'does that bookkeeping and records it'],
]);
w();
w(`EXPOSURE CAPS ARE APPLIED AND STATED. The Purple Book limits exposure to a fire to ${Q.PB_MAX_FIRE_EXPOSURE_S} s and to a toxic cloud to 30 minutes. The engine applies the cap without refusing and states the time it used; a toxic exposure of 60 minutes is computed at 30. The toxic case belongs to the consequence side of the seam.`);
w();
w(`THE PUBLISHED EXAMPLE IS ROUNDED. Purple Book Appendix 6.B prints Pd = ${G6.printed.probabilityOfDeath} where the whole chain, as the golden records it, gives ${f12(G6.expected.probabilityOfDeath)} (section 11). It also uses R = ${G6.args.distanceM} m for a point whose distance computes to 360.555 m, derived from its coordinates (200, 300), and one step names the point (100, 200). A reproduction that needs a rounded intermediate says which one.`);

/* ============================================================ SECTION 33 */

section('judgement', 'Judgement: ordering measures and the ALARP demonstration', ['Expert m06']);
w('ORDERING MEASURES. The EDIKAN firewall at the three conventions and the DF sweep show that the verdict can turn on choices the analyst makes: the discounting convention, the DF, the VPF and its year. An ALARP demonstration states each choice and why, and shows the verdict at the other defensible choices.');
w();
const irAfter = supRun.irpaPerYr;
const band = success('EREMOR supervisor banded', Q.alarpBand({ individualRiskPerYr: irAfter, thresholds: 'r2p2-workers' }));
w(`AN INDIVIDUAL RISK BANDED. The EREMOR supervisor's IRPA of ${f12(irAfter)} per year (section 12) is ${band.band} against the worker preset, ${f6(band.ratioToBroadlyAcceptable)} times the lower limit, so an ALARP demonstration ${band.alarpDemonstrationRequired ? 'is required' : 'is not required'}.`);
w();
w('AN ALARP NOTE, in the shape this course grades at Expert: the individual risk of the most exposed person and its region; the societal picture if the population warrants it; each measure considered, with its deltaPLL, costs, life, VPF, other harms, discounting convention and DF, each with its source; the cost to benefit ratio and the verdict; the ICAF beside the VPF; the measures adopted and the ones rejected as grossly disproportionate; and what the engine did not know.');
w();
w('WHEN THE NUMBERS ARE NOT ENOUGH. A verdict at the boundary is still reasonably practicable (section 31). An individual risk in the TOLERABLE region is not acceptable until the demonstration is made. A measure rejected on cost is still weighed against good practice, which the engine does not know.');

/* ============================================================ SECTION 34 */

section('vocabulary', 'Vocabulary this course legislates before a word is written', ['Associate m01', 'Professional m01', 'Expert m01']);
w('Several words in this course already mean something else elsewhere in the academy, or are easy to shorten wrongly. The rule for each is binding on every lesson, bank question, key truth and panel.');
w();
table(['word', 'what it already means elsewhere', 'the rule here'], [
  ['risk', 'a matrix score in the risk and change course, a cost in the economics courses', 'always qualified: individual risk, LSIR, IRPA or societal risk'],
  ['severity', 'a consequence category on a risk matrix in the risk and compliance courses', 'never used'],
  ['likelihood', 'a likelihood score on a risk matrix, and a Bayesian likelihood in the decision analysis course', 'never used: a frequency is per year, a probability is a probability'],
  ['FAR', 'the same rate in the safety statistics course', 'always per 100,000,000 exposed hours'],
  ['PLL', 'nothing else, and easy to misread as a probability', 'expected fatalities per year, never a probability'],
  ['ICAF', 'called CPF, cost per fatality prevented, in R2P2', 'the implied cost of averting a fatality: the present value of the cost over the undiscounted fatalities prevented'],
  ['NPV, IRR', 'the economics courses\' measures', 'never used: this course says present value'],
  ['probit, dose', 'the consequence course\'s models', 'named only to say where a probability of death comes from; never computed'],
]);

/* ============================================================ CLOSING CHECKS */

const allMods = Object.entries(MODULES).flatMap(([tier, mods]) => Object.keys(mods).map((m) => `${tier} ${m}`));
const unowned = allMods.filter((m) => !OWNED.has(m));
must('every module of every tier is owned by at least one section', unowned.length === 0, unowned.join(', ') || 'all owned');
must('every declared section was written', SECTION === ORDER.length, `${SECTION} of ${ORDER.length}`);

const failed = ASSERTS.filter((a) => !a.pass);
if (failed.length) {
  failed.forEach((a) => process.stderr.write(`  FAILED  ${a.claim}\n          ${a.detail}\n`));
  process.stderr.write(`h5_dump: ${ASSERTS.length} assertions, ${failed.length} FAILED. NOTHING WRITTEN.\n`);
  process.exit(1);
}
process.stderr.write(`h5_dump: ${ASSERTS.length} label-and-call, measurement and claim assertions run, 0 failed; ${SECTION} sections\n`);
process.stdout.write(`${OUT.join('\n')}\n`);
