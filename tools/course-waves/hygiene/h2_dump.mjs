// THE H2 TEACHING DIGEST. This is the ONLY teaching truth for every writer after
// this file: the lesson author, the bank author, the key-truth author and the
// panel author all quote from digest.txt and from nothing else.
//
// FINDINGS-exposure.md, vendored beside the oracle, and the engine's own source
// comments are PROVENANCE. Where this file restates a finding it RE-MEASURES it
// through the engine or re-reads it out of the vendored golden, and says which.
//
// Usage:  sh /root/hse-wip-hygiene/build_digest.sh > digest.tmp \
//           && mv digest.tmp /root/hse-wip-hygiene/digest.txt
// Build THROUGH A TEMP FILE. A gate that reads a half written digest finds no
// literals and clears everything.
//
// Engine, vendored sha-identical with petrolord-engines b43f1d9 (PR #217, re-vendored after #220):
// engines/hse/exposure.js. It imports nothing.
//
// EVERY NUMBER PRINTED HERE IS A RETURN VALUE OF THE ENGINE, except where a line
// says "golden" (read from the vendored case file), "printed" (the value a
// source prints, as the golden records it), "stated" (an input named on the
// same row) or "derived" (arithmetic on engine values printed in the same block,
// with the arithmetic stated). Where the engine keeps a constant to itself, the
// constant is MEASURED by asking the engine a question whose answer is that
// constant and nothing else, and compared against a literal typed in this
// file, which is a THIRD location. Nothing here reads a clock, a random number,
// a locale or a network, and TZ and LC_ALL are pinned by build_digest.sh.
//
// THE DIGEST RULE. A sentence here may NAME a figure this file computes. It may
// NOT characterise the RELATIONSHIP between two figures unless that
// relationship is itself computed and printed on the same page.
//
// EVERY LABEL IS ASSERTED AGAINST WHAT THE CALL ACTUALLY DID. `refusal()`
// asserts an error key and the field it names, `success()` asserts the absence
// of an error key and that every number is finite, and every branch, warning
// and flag claim goes through `must()`. If one assertion fails NOTHING IS
// WRITTEN and the build exits non-zero.
//
// THIS ENGINE HAS NO REPAIR HISTORY, so no section here describes what it used
// to do. The ERRATA section is about the SOURCES, which print values their own
// formulas refute; that is current and permanent.
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {
  OBEN, ORONI, LOUD_117, LOUD_132, OLOMORO, EVWRENI, EVWRENI_LONG, WEEK_5, WEEK_4, WEEK_6,
  PROTECTOR_A, PROTECTOR_C, NRR_SWEEP, IGBO_PARTIAL, IGBO_FULL, IGBO_LONG, STEL_FULL, STEL_SHORT,
  MIXTURE, HEAT_INDOOR, HEAT_OUTDOOR, HEAT_WBGT_HOUR, HEAT_MET_HOUR, MET_SWEEP, SHIFT_SWEEP,
  WEEK_HOURS_SWEEP, BS_PAIRS,
} from './h2_fields.mjs';

const HERE = path.dirname(new URL(import.meta.url).pathname);
const ROOT = process.env.H2_ENGINES || '/root/wt-h2-nextgen/packages/engines';
const E = await import(`${ROOT}/engines/hse/exposure.js`);
const GOLD = JSON.parse(fs.readFileSync(`${ROOT}/test-data/hse/goldens/exposure_cases.json`, 'utf8'));
const SRC = fs.readFileSync(`${ROOT}/engines/hse/exposure.js`, 'utf8');

const out = [];
const w = (s = '') => out.push(s);
const n = (x, d) => (x === null || x === undefined || !Number.isFinite(Number(x)) ? String(x) : Number(x).toFixed(d));
const e6 = (x) => n(x, 6);
const e12 = (x) => n(x, 12);
const sci = (x) => (x === 0 ? '0' : x.toExponential(3));

/* ------------------------------------------------ THE ASSERTION MACHINERY */

const ASSERTS = [];
const must = (claim, cond, detail) => {
  ASSERTS.push({ claim, pass: !!cond, detail: String(detail) });
  return !!cond;
};
const keys = (r) => (r && typeof r === 'object' ? Object.keys(r).join(', ') : String(r));
const noNonFinite = (label, r) => {
  if (!r || typeof r !== 'object') return;
  const bad = Object.entries(r).filter(([, v]) => typeof v === 'number' && !Number.isFinite(v));
  must(`CARRIES NO NON-FINITE NUMBER: ${label}`, bad.length === 0,
    bad.length ? bad.map(([k, v]) => `${k}=${v}`).join(', ') : 'every number finite');
};
const refusal = (label, r, field) => {
  must(`LABELLED A REFUSAL: ${label}`, !!(r && r.error), `returned keys [${keys(r)}]`);
  if (field !== undefined) must(`THE REFUSAL NAMES ${field}: ${label}`, r && r.field === field, `field=${r && r.field}`);
  noNonFinite(`refusal ${label}`, r);
  return r;
};
const success = (label, r) => {
  must(`LABELLED A SUCCESS: ${label}`, !!(r && !r.error), r && r.error ? r.error : 'no error key');
  noNonFinite(`success ${label}`, r);
  return r;
};
const measured = (label, v) => { must(`MEASURED AND FINITE: ${label}`, Number.isFinite(v), v); return v; };
const PINS = [];
const pin = (label, m, literal, tol = 1e-12) => {
  const rel = Math.abs(m - literal) / Math.max(Math.abs(literal), 1e-300);
  must(`PINNED: ${label} measured out of the engine equals the literal in this file`, rel <= tol,
    `measured ${m}, literal ${literal}, relative ${rel}`);
  PINS.push({ label, m, literal, rel });
  return m;
};
const relDiff = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-300);
const bisect = (lo, hi, pred, label) => {
  let a = lo; let b = hi;
  const pa = pred(a);
  if (!must(`BISECTION BRACKET STRADDLES THE EDGE: ${label}`, pa !== pred(b), `pred(${lo})=${pa} pred(${hi})=${pred(b)}`)) return NaN;
  for (let i = 0; i < 300; i += 1) {
    const m = (a + b) / 2;
    if (pred(m) === pa) a = m; else b = m;
    if (Math.abs(b - a) <= Math.abs(b) * 1e-15) break;
  }
  return (a + b) / 2;
};
const at = (obj, key) => key.split('.').reduce(
  (o, k) => (o === undefined || o === null ? undefined : o[/^\d+$/.test(k) ? Number(k) : k]), obj);

/* ----------------------------------------------------- THE OWNER CLAUSES */

const STRUCTURE = (() => {
  const text = fs.readFileSync(path.join(HERE, 'structure.py'), 'utf8');
  const tiers = new Map();
  let tier = null; let mod = null;
  for (const line of text.split('\n')) {
    let m = /^ '(beginner|intermediate|advanced)': \[\s*$/.exec(line);
    if (m) { tier = m[1]; tiers.set(tier, new Map()); mod = null; continue; }
    m = /^ {2}\('(m\d\d)[^']*', '([^']*)', \[\s*$/.exec(line);
    if (m && tier) { mod = m[1]; tiers.get(tier).set(mod, { title: m[2], lessons: new Set() }); continue; }
    m = /^ {4}\('(l\d\d)[^']*', '/.exec(line);
    if (m && mod) tiers.get(tier).get(mod).lessons.add(m[1]);
  }
  let lessons = 0;
  for (const [t, mods] of tiers) {
    if (mods.size !== 6) throw new Error(`GENERATOR REFUSES: structure.py gives tier ${t} ${mods.size} modules`);
    for (const [, v] of mods) lessons += v.lessons.size;
  }
  if (tiers.size !== 3 || lessons !== 78) throw new Error(`GENERATOR REFUSES: structure.py parses to ${tiers.size} tiers and ${lessons} lessons`);
  return tiers;
})();
const TIER_WORD = { beginner: 'Associate', intermediate: 'Professional', advanced: 'Expert' };
const owners = (...spec) => {
  let note = null;
  if (typeof spec[spec.length - 1] === 'string') note = spec.pop();
  const parts = spec.map(([tier, mkey, lkey]) => {
    const word = TIER_WORD[tier];
    if (!word) throw new Error(`GENERATOR REFUSES: unknown tier ${tier}`);
    const mods = STRUCTURE.get(tier);
    if (!mods.has(mkey)) throw new Error(`GENERATOR REFUSES: ${word} has no ${mkey}`);
    if (lkey && !mods.get(mkey).lessons.has(lkey)) throw new Error(`GENERATOR REFUSES: ${word} ${mkey} has no ${lkey}`);
    return { word, mkey, lkey };
  });
  const words = parts.map((p, i) => {
    const prev = i ? parts[i - 1] : null;
    const key = p.lkey ? `${p.mkey} ${p.lkey}` : p.mkey;
    if (prev && prev.word === p.word && prev.mkey === p.mkey && p.lkey) return p.lkey;
    return `${p.word} ${key}`;
  });
  return `(owned by ${words.join(' and ')}${note ? `, ${note}` : ''})`;
};
const sec = (no, title, ...spec) => `# SECTION ${no}: ${title} ${owners(...spec)}`;
if (process.env.H2_OWNERS_SELFTEST) {
  const control = (what, fn) => {
    let msg = null;
    try { fn(); } catch (err) { msg = err.message; }
    if (!msg) { process.stderr.write(`OWNERS SELFTEST FAILED: ${what} did not refuse\n`); process.exit(1); }
    process.stderr.write(`OWNERS SELFTEST: ${what} refused: ${msg}\n`);
  };
  control('an unknown tier', () => owners(['postgraduate', 'm01']));
  control('a module that tier does not have', () => owners(['beginner', 'm09']));
  control('a lesson that is not in the module named beside it', () => owners(['advanced', 'm01', 'l05']));
  const good = owners(['intermediate', 'm05'], ['advanced', 'm05', 'l03'], ['advanced', 'm05', 'l04']);
  if (good !== '(owned by Professional m05 and Expert m05 l03 and l04)') { process.stderr.write(`OWNERS SELFTEST FAILED: ${good}\n`); process.exit(1); }
  process.stderr.write(`OWNERS SELFTEST: a valid clause renders as ${good}\n`);
  process.exit(0);
}

/* ==================================================================
   MEASUREMENTS, taken before anything is printed.
   ================================================================== */

const C = E.NOISE_CRITERIA;
const PRESETS = ['OSHA_PEL', 'OSHA_ACTION_LEVEL', 'NIOSH_REL'];
// The TWA coefficient: the TWA of a 1000 percent noise dose, less the criterion level.
const K = Object.fromEntries(PRESETS.map((p) => [p, measured(`TWA coefficient ${p}`,
  E.noiseTwaFromDoseDbA(1000, p).twaDbA - C[p].criterionLevelDbA)]));
// The exchange rate: the level for a 4 hour reference duration, less the criterion level.
const Q = Object.fromEntries(PRESETS.map((p) => [p, measured(`exchange rate ${p}`,
  E.noiseLevelForReferenceDurationDbA(4, p).levelDbA - C[p].criterionLevelDbA)]));
// The criterion level: the level whose reference duration is 8 hours.
const LC = Object.fromEntries(PRESETS.map((p) => [p, measured(`criterion level ${p}`,
  E.noiseLevelForReferenceDurationDbA(8, p).levelDbA)]));
// The threshold: bisected on the belowThreshold flag the engine returns.
const TH = Object.fromEntries(PRESETS.map((p) => [p, measured(`threshold ${p}`,
  bisect(40, 120, (L) => E.noiseReferenceDurationH(L, p).belowThreshold === true, `threshold ${p}`))]));
// The limit dose: the dose at which exceedsLimit turns over, on a single 8 hour period.
const LIM = Object.fromEntries(PRESETS.map((p) => [p, measured(`limit dose ${p}`, (() => {
  const L = bisect(C[p].criterionLevelDbA - 30, C[p].criterionLevelDbA + 30,
    (x) => E.noiseDose([{ levelDbA: x, durationH: 8 }], p).exceedsLimit === true, `limit ${p}`);
  return E.noiseDose([{ levelDbA: L, durationH: 8 }], p).dosePct;
})())]));
const EXACT5 = 5 / Math.log10(2);
const EXACT3 = 3 / Math.log10(2);
// Protector constants, each read off one call.
const APP_B_SEVEN = 30 - E.hearingProtectorEstimate({ exposureDb: 100, nrrDb: 30, method: 'OSHA_APPENDIX_B' }).attenuationDb;
const FIELD_FRACTION = E.hearingProtectorEstimate({ exposureDb: 100, nrrDb: 27, method: 'OSHA_FIELD_50' }).attenuationDb / (27 - 7);
const DUAL_ADD = E.hearingProtectorEstimate({ exposureDb: 100, nrrDb: 30, method: 'OSHA_DUAL' }).attenuationDb - (30 - 7);
const DERATE = Object.fromEntries(['earmuff', 'formableEarplug', 'otherEarplug'].map((t) => [t,
  E.hearingProtectorEstimate({ exposureDb: 100, nrrDb: 40, method: 'NIOSH_TYPE', protectorType: t, weighting: 'C' }).creditedNrrDb / 40]));
// LEX constants: T0 from one period of 4 hours, the points pivot from EP = 100.
const LEX_T0 = 4 * 10 ** ((90 - E.lexEightHourDbA([{ laeqDbA: 90, durationH: 4 }]).lexDbA) / 10);
const POINTS_PIVOT = E.lexFromExposurePointsDbA(100).lexDbA;
// Chemical divisors.
const TWA_DIVISOR = 10 / E.chemicalTwa8h([{ concentration: 10, durationH: 1 }]).twa8h;
const STEL_DIVISOR = 10 / E.chemicalStel15Min([{ concentration: 10, durationMin: 1 }]).stel15Min;
// Brief and Scala: the daily RF at 12 h is (8/12)(12/16) = 0.5; solve for the 16 from the raw factor at 4 h.
const BS_DAILY_DEN = (8 / 4) * (24 - 4) / E.briefScalaDailyRf(4).rawRf;
const BS_WEEKLY_DEN = (40 / 20) * (168 - 20) / E.briefScalaWeeklyRf(20).rawRf;
// Heat: WBGT weights by unit impulses.
const WI = { tnwb: E.wbgtIndoorC({ naturalWetBulbC: 1, globeC: 0 }).wbgtC, tg: E.wbgtIndoorC({ naturalWetBulbC: 0, globeC: 1 }).wbgtC };
const WO = {
  tnwb: E.wbgtOutdoorC({ naturalWetBulbC: 1, globeC: 0, dryBulbC: 0 }).wbgtC,
  tg: E.wbgtOutdoorC({ naturalWetBulbC: 0, globeC: 1, dryBulbC: 0 }).wbgtC,
  ta: E.wbgtOutdoorC({ naturalWetBulbC: 0, globeC: 0, dryBulbC: 1 }).wbgtC,
};
// Heat: RAL and REL constants from M = 1 W (the intercept) and M = 10 W (intercept less slope).
const RAL_A = E.nioshRecommendedAlertLimitC(1).limitWbgtC;
const RAL_B = RAL_A - E.nioshRecommendedAlertLimitC(10).limitWbgtC;
const REL_A = E.nioshRecommendedExposureLimitC(1).limitWbgtC;
const REL_B = REL_A - E.nioshRecommendedExposureLimitC(10).limitWbgtC;
must('the RAL and REL intercept probes at 1 W and 10 W carry the extrapolation warning, as they must',
  E.nioshRecommendedAlertLimitC(1).warnings.length === 1 && E.nioshRecommendedExposureLimitC(10).warnings.length === 1, 'warned');

const PIN_ROWS = [
  ['OSHA PEL TWA coefficient', K.OSHA_PEL, 16.61, 1e-12, 'noiseTwaFromDoseDbA(1000) less the criterion level'],
  ['OSHA action level TWA coefficient', K.OSHA_ACTION_LEVEL, 16.61, 1e-12, 'the same, action-level preset'],
  ['NIOSH REL TWA coefficient', K.NIOSH_REL, 10.0, 1e-12, 'the same, NIOSH preset'],
  ['OSHA PEL exchange rate, dB', Q.OSHA_PEL, 5, 1e-12, 'level for a 4 hour reference duration less the criterion'],
  ['OSHA action level exchange rate, dB', Q.OSHA_ACTION_LEVEL, 5, 1e-12, 'the same'],
  ['NIOSH REL exchange rate, dB', Q.NIOSH_REL, 3, 1e-12, 'the same'],
  ['OSHA PEL criterion level, dBA', LC.OSHA_PEL, 90, 1e-12, 'level for an 8 hour reference duration'],
  ['OSHA action level criterion level, dBA', LC.OSHA_ACTION_LEVEL, 90, 1e-12, 'the same'],
  ['NIOSH REL criterion level, dBA', LC.NIOSH_REL, 85, 1e-12, 'the same'],
  ['OSHA PEL threshold, dBA', TH.OSHA_PEL, 90, 1e-12, 'bisected on belowThreshold'],
  ['OSHA action level threshold, dBA', TH.OSHA_ACTION_LEVEL, 80, 1e-12, 'bisected on belowThreshold'],
  ['NIOSH REL threshold, dBA', TH.NIOSH_REL, 80, 1e-12, 'bisected on belowThreshold'],
  ['OSHA PEL limit noise dose, percent', LIM.OSHA_PEL, 100, 1e-9, 'bisected on exceedsLimit over one 8 hour period'],
  ['OSHA action level limit noise dose, percent', LIM.OSHA_ACTION_LEVEL, 50, 1e-9, 'the same'],
  ['NIOSH REL limit noise dose, percent', LIM.NIOSH_REL, 100, 1e-9, 'the same'],
  ['Appendix B A-weighted subtraction, dB', APP_B_SEVEN, 7, 1e-12, '30 less the attenuation at NRR 30'],
  ['OSHA field derating fraction', FIELD_FRACTION, 0.5, 1e-12, 'attenuation over (NRR less 7) at NRR 27'],
  ['OSHA dual-protection addition, dB', DUAL_ADD, 5, 1e-12, 'attenuation less (NRR less 7) at NRR 30'],
  ['NIOSH earmuff derating', DERATE.earmuff, 0.75, 1e-12, 'credited NRR over 40 on C-weighted data'],
  ['NIOSH formable earplug derating', DERATE.formableEarplug, 0.5, 1e-12, 'the same'],
  ['NIOSH other earplug derating', DERATE.otherEarplug, 0.3, 1e-12, 'the same'],
  ['LEX reference duration T0, hours', LEX_T0, 8, 1e-12, 'from the LEX of 4 hours at 90 dBA'],
  ['exposure points pivot, dBA', POINTS_PIVOT, 85, 1e-12, 'the LEX of 100 points'],
  ['EU lower exposure action value, dBA', E.EU_NOISE_VALUES.lowerActionLexDbA, 80, 0, 'exported'],
  ['EU upper exposure action value, dBA', E.EU_NOISE_VALUES.upperActionLexDbA, 85, 0, 'exported'],
  ['EU exposure limit value, dBA', E.EU_NOISE_VALUES.limitLexDbA, 87, 0, 'exported'],
  ['chemical TWA divisor, hours', TWA_DIVISOR, 8, 1e-12, '10 ppm for 1 hour gives 10 over the divisor'],
  ['STEL divisor, minutes', STEL_DIVISOR, 15, 1e-12, '10 ppm for 1 minute gives 10 over the divisor'],
  ['Brief and Scala daily denominator, hours', BS_DAILY_DEN, 16, 1e-12, 'from the raw factor at 4 hours'],
  ['Brief and Scala weekly denominator, hours', BS_WEEKLY_DEN, 128, 1e-12, 'from the raw factor at 20 hours'],
  ['WBGT indoor natural wet bulb weight', WI.tnwb, 0.7, 1e-12, 'unit impulse'],
  ['WBGT indoor globe weight', WI.tg, 0.3, 1e-12, 'unit impulse'],
  ['WBGT outdoor natural wet bulb weight', WO.tnwb, 0.7, 1e-12, 'unit impulse'],
  ['WBGT outdoor globe weight', WO.tg, 0.2, 1e-12, 'unit impulse'],
  ['WBGT outdoor dry bulb weight', WO.ta, 0.1, 1e-12, 'unit impulse'],
  ['NIOSH RAL intercept, C', RAL_A, 59.9, 1e-12, 'the RAL at 1 W'],
  ['NIOSH RAL slope per decade, C', RAL_B, 14.1, 1e-12, 'the RAL at 1 W less the RAL at 10 W'],
  ['NIOSH REL intercept, C', REL_A, 56.7, 1e-12, 'the REL at 1 W'],
  ['NIOSH REL slope per decade, C', REL_B, 11.5, 1e-12, 'the REL at 1 W less the REL at 10 W'],
  ['OSHA extended-shift action level at 8 h, dBA', E.oshaActionLevelForShiftDbA(8).actionLevelDbA, 16.61 * Math.log10(0.5) + 90, 1e-12, 'the closed form at 8 hours'],
];
PIN_ROWS.forEach(([label, m, lit, tol]) => pin(label, m, lit, tol));

/* ==================================================================
   THE DIGEST ITSELF.
   ================================================================== */

const countBy = (arr, f) => arr.reduce((a, x) => { const k = f(x); a[k] = (a[k] || 0) + 1; return a; }, {});
const basisCounts = countBy(GOLD.cases, (c) => c.basis);

w('# H2 TEACHING DIGEST: Occupational Hygiene: Noise, Chemical & Heat Exposure');
w();
w('# THIS FILE IS THE ONLY TEACHING TRUTH FOR THIS COURSE. Every number in every lesson, bank question, key truth and panel comes from a line below. FINDINGS-exposure.md, vendored beside the oracle, and the engine source comments are PROVENANCE. Where this file states a finding it re-measures it through the engine or re-reads it out of the vendored golden, and says which.');
w();
w('# PRECISION. Sound levels and exposure levels in dBA, doses and percentages, durations in hours and in minutes, concentrations in ppm, exposure indices and every dimensionless ratio, temperatures in degrees C and metabolic rates in watts print to SIX decimals; measured constants print to TWELVE; counts are whole numbers.');
w();
w(`# ENGINE. engines/hse/exposure.js, vendored sha-identical with petrolord-engines b43f1d9, ${(SRC.match(/\n/g) || []).length} lines, importing nothing. The vendored golden test-data/hse/goldens/exposure_cases.json carries ${GOLD.cases.length} cases, ${GOLD.errata.length} errata and ${GOLD.refusals.length} refusals, generated by ${GOLD.generatedBy}. Of the ${GOLD.cases.length} cases, ${basisCounts.published} are checked against a value a source PRINTS and ${basisCounts.oracle} against the oracle only.`);
w();
w('# WHAT IS NEVER GRADED IN THIS COURSE. No NIOSH recommended alert limit or recommended exposure limit for heat, no margin against one, no exceedance verdict, no WBGT built from thermometer readings, no NIOSH protector derating by type, no dual-protection estimate, no Brief and Scala weekly factor on its own, and no ACGIH value of any kind. Section 23 gives the reason for each. The eighteen graded capstone fields are noise doses and TWAs, LEX values, the OSHA engineering-controls protector estimate, chemical averages and indices, reduction-factor arithmetic, and two one-hour averages of readings the capstone states.');
w();
w('# THIS ENGINE HAS NO REPAIR HISTORY. It was written for this course and merged once. Nothing in this file describes former behaviour. Section 19 is about the SOURCES, which print values their own formulas refute.');
w();

/* ------------------------------------------------------------- SECTION 1 */

w(sec(1, 'What this engine computes, and what it refuses to compute', ['beginner', 'm01'], ['advanced', 'm03']));
w();
const FNS = Object.keys(E).filter((k) => typeof E[k] === 'function').sort();
const EXPORTED_CONSTS = Object.keys(E).filter((k) => typeof E[k] !== 'function').sort();
w(`The engine exports ${FNS.length} functions and ${EXPORTED_CONSTS.length} frozen tables. Every function returns a finite result or an object carrying \`error\` and \`field\`, the name of the input it refused. Every result names the criterion or source it was computed against.`);
w();
const DOORS = [
  ['noiseReferenceDurationH', 'the hours at a level that give 100 percent noise dose, or belowThreshold', 'a level and a criterion'],
  ['noiseLevelForReferenceDurationDbA', 'the level at which a stated number of hours gives 100 percent', 'hours and a criterion'],
  ['noiseTwaFromDoseDbA', 'the TWA a noise dose restates', 'a noise dose above zero and a criterion'],
  ['noiseDoseFromTwaPct', 'the noise dose a TWA restates', 'a TWA and a criterion'],
  ['noiseDose', 'the daily noise dose, its TWA, each period\'s contribution, whether the limit is exceeded, and warnings', 'periods of level and hours, and a criterion'],
  ['oshaActionLevelForShiftDbA', 'the OSHA action level for a shift that is not eight hours', 'shift hours'],
  ['hearingProtectorEstimate', 'the estimated A-weighted level under a protector by a named method', 'a level, its weighting, the NRR and a method'],
  ['lexEightHourDbA', 'LEX,8h, each task\'s contribution and exposure points, and the two action flags', 'tasks of LAeq and hours'],
  ['lexWeeklyDbA', 'the weekly noise exposure level', 'up to seven daily LEX,8h values'],
  ['hseExposurePoints', 'the HSE exposure points for one task', 'an LAeq and hours'],
  ['lexFromExposurePointsDbA', 'the LEX,8h a points total restates', 'points above zero'],
  ['lexAllowedDurationH', 'the hours at a level that alone reach a target LEX', 'an LAeq and a target'],
  ['chemicalTwa8h', 'the 8-hour chemical TWA, and a warning when the record is not 8 hours', 'periods of concentration and hours'],
  ['chemicalStel15Min', 'the 15-minute short-term average, and a warning when the record is short', 'periods of concentration and minutes'],
  ['mixtureExposureIndex', 'the additive mixture index, each term, and whether it exceeds 1', 'components of concentration and limit'],
  ['briefScalaDailyRf', 'the daily reduction factor, capped at 1, and the raw factor', 'shift hours'],
  ['briefScalaWeeklyRf', 'the weekly reduction factor, capped at 1, and the raw factor', 'weekly hours'],
  ['briefScalaAdjustedLimit', 'the adjusted limit under the smaller of the two factors, and which governs', 'a limit and a schedule'],
  ['wbgtIndoorC', 'WBGT without solar load', 'natural wet bulb and globe temperatures'],
  ['wbgtOutdoorC', 'WBGT with solar load', 'natural wet bulb, globe and dry bulb temperatures'],
  ['wbgtTwaC', 'the time weighted WBGT', 'periods of WBGT and minutes'],
  ['metabolicRateTwaW', 'the time weighted metabolic rate', 'periods of watts and minutes'],
  ['nioshRecommendedAlertLimitC', 'the NIOSH 2016 section 8.1 RAL equation, in C WBGT', 'a metabolic rate in watts'],
  ['nioshRecommendedExposureLimitC', 'the NIOSH 2016 section 8.1 REL equation, in C WBGT', 'a metabolic rate in watts'],
  ['nioshHeatAssessment', 'a one-hour assessment against the RAL or REL', 'a WBGT hour, a metabolic hour and acclimatized true or false'],
  ['resolveNoiseCriterion', 'a preset or a custom criterion, resolved or refused', 'a preset name or an object'],
];
must('the door table names every exported function exactly once', JSON.stringify(DOORS.map((d) => d[0]).sort()) === JSON.stringify(FNS), `${DOORS.length} against ${FNS.length}`);
w('| door | what it returns | what it needs |');
w('| --- | --- | --- |');
DOORS.forEach(([d, r, nd]) => w(`| \`${d}\` | ${r} | ${nd} |`));
w();
w(`THE FROZEN TABLES: ${EXPORTED_CONSTS.map((k) => `\`${k}\``).join(', ')}. The sources the engine names, verbatim from \`EXPOSURE_SOURCES\`:`);
Object.entries(E.EXPOSURE_SOURCES).forEach(([k, v]) => w(`- ${k}: ${v}`));
w();
w('THE ENGINE\'S JUDGEMENT CALLS, each MEASURED below by the call that shows it. These are decisions the sources leave open, and the engine makes one choice for each:');
const jRows = [];
{
  const j2 = success('J2 probe: 80 dBA under the action level', E.noiseReferenceDurationH(80, 'OSHA_ACTION_LEVEL'));
  must('J2: a level exactly at the threshold is integrated', j2.belowThreshold === false, j2.belowThreshold);
  jRows.push(['J2', 'the threshold is inclusive', `80 dBA under the action level gives belowThreshold ${j2.belowThreshold} and a reference duration of ${e6(j2.referenceDurationH)} h`]);
  const j3 = success('J3 probe: 132 dBA', E.noiseDose(LOUD_132, 'OSHA_PEL'));
  must('J3: above 130 warns rather than refusing', j3.warnings.length >= 1, j3.warnings.join(' | '));
  jRows.push(['J3', 'above 130 dBA, above 115 dBA and above the NIOSH ceiling the result WARNS and still integrates', `a 132 dBA period gives a noise dose of ${e6(j3.dosePct)} percent with ${j3.warnings.length} warnings`]);
  const j4 = refusal('J4 probe: 25 hours', E.noiseDose([{ levelDbA: 85, durationH: 25 }], 'OSHA_PEL'), 'periods');
  jRows.push(['J4', 'noise, LEX and chemical periods totalling over 24 hours are refused', `25 hours refuses on field \`${j4.field}\``]);
  const j5 = success('J5 probe: NRR 5 on A-weighted data', E.hearingProtectorEstimate({ exposureDb: 92, nrrDb: 5, method: 'OSHA_APPENDIX_B' }));
  must('J5: the credit floors at zero with a warning', j5.attenuationDb === 0 && j5.warnings.length === 1, j5.attenuationDb);
  jRows.push(['J5', 'protector credit is floored at 0 with a warning; the field derating refuses C-weighted data', `NRR 5 on 92 dBA gives an attenuation of ${e6(j5.attenuationDb)} dB`]);
  const j6 = success('J6 probe: a partial shift', E.chemicalTwa8h(IGBO_PARTIAL));
  jRows.push(['J6', 'the 8-hour chemical TWA always divides by 8 and warns under or over 8 hours; the STEL divides by 15 and refuses over 15 minutes', `a ${e6(j6.totalDurationH)} hour record carries ${j6.warnings.length} warning`]);
  const j7 = success('J7 probe: unity', E.mixtureExposureIndex([{ concentration: 50, limit: 100 }, { concentration: 25, limit: 50 }]));
  must('J7: exactly 1 passes', j7.exceeds === false && j7.index === 1, j7.index);
  jRows.push(['J7', 'a mixture index of exactly 1 passes', `index ${e6(j7.index)} gives exceeds ${j7.exceeds}`]);
  const j8 = success('J8 probe: 6 hours', E.briefScalaDailyRf(6));
  must('J8: the factor is capped at 1', j8.rf === 1 && j8.rawRf > 1, j8.rawRf);
  jRows.push(['J8', 'the Brief and Scala factor is capped at 1 with rawRf kept, the smaller factor governs, and 24 hours a day gives 0', `6 hours gives rf ${e6(j8.rf)} and rawRf ${e6(j8.rawRf)}`]);
  const j9 = refusal('J9 probe: 45 minutes', E.nioshHeatAssessment({ acclimatized: true, wbgtPeriods: [{ wbgtC: 28, durationMin: 45 }], metabolicPeriods: [{ metabolicRateW: 300, durationMin: 60 }] }), 'wbgtPeriods');
  jRows.push(['J9', 'the NIOSH assessment requires 60 minutes of periods and warns outside 116 to 580 W; inputs are watts only', `45 minutes refuses on field \`${j9.field}\``]);
  const j10 = success('J10 probe: four days', E.lexWeeklyDbA(WEEK_4));
  jRows.push(['J10', 'the weekly LEX always divides by 5 and accepts at most 7 days', `four days report days ${j10.days} and are still divided by 5`]);
  jRows.push(['J1', 'each preset uses the coefficient its source PRINTS (16.61, 10.0); a custom criterion defaults to the exact exchange rate over log10 2', `measured in section 3 and set against both tables in section 5`]);
}
w('| call | the decision | the measurement |');
w('| --- | --- | --- |');
jRows.sort((a, b) => Number(a[0].slice(1)) - Number(b[0].slice(1))).forEach((r) => w(`| ${r[0]} | ${r[1]} | ${r[2]} |`));
w();
w('WHAT THE ENGINE DOES NOT PROVIDE, and says so by having no door for it: spectral (octave-band) protector methods, ISO 9612 uncertainty budgets, ISO 7243 clothing and body-height adjustments, chemical ceiling comparisons, the withdrawn NIOSH heat ceilings, and any licensed limit table. Every exposure limit is an INPUT.');
w();

/* ------------------------------------------------------------- SECTION 2 */

w(sec(2, 'The evidence behind every formula: published, oracle only, or transcription', ['advanced', 'm03']));
w();
w('The vendored golden records, for every case, whether its expected value is one a source PRINTS or one only the independent oracle computed. Counted here out of the golden, by door:');
w();
const byFn = {};
GOLD.cases.forEach((c) => { byFn[c.fn] = byFn[c.fn] || { published: 0, oracle: 0 }; byFn[c.fn][c.basis] += 1; });
GOLD.errata.forEach((c) => { byFn[c.fn] = byFn[c.fn] || { published: 0, oracle: 0 }; byFn[c.fn].errata = (byFn[c.fn].errata || 0) + 1; });
const refByFn = countBy(GOLD.refusals, (c) => c.fn);
w('| door | published cases | oracle-only cases | errata | refusals | evidence class |');
w('| --- | --- | --- | --- | --- | --- |');
const TRANSCRIPTION = new Set(['wbgtIndoorC', 'wbgtOutdoorC', 'nioshRecommendedAlertLimitC', 'nioshRecommendedExposureLimitC', 'nioshHeatAssessment']);
const DEFINITION = new Set(['wbgtTwaC', 'metabolicRateTwaW', 'chemicalStel15Min']);
const evClass = (fn) => {
  if (TRANSCRIPTION.has(fn)) return 'TRANSCRIPTION ONLY';
  if (DEFINITION.has(fn)) return 'ARITHMETIC BY DEFINITION';
  return (byFn[fn] && byFn[fn].published) ? 'PUBLISHED, REPRODUCED' : 'ORACLE ONLY';
};
FNS.filter((f) => f !== 'resolveNoiseCriterion').forEach((f) => {
  const b = byFn[f] || { published: 0, oracle: 0 };
  w(`| \`${f}\` | ${b.published} | ${b.oracle} | ${b.errata || 0} | ${refByFn[f] || 0} | ${evClass(f)} |`);
});
w();
w('HOW TO READ THE LAST COLUMN.');
w('- PUBLISHED, REPRODUCED: at least one value a source prints is reproduced by the engine at the precision the source prints it. Two people copying the same page wrongly would be caught by that value.');
w('- ARITHMETIC BY DEFINITION: a time weighted average whose only constant is the length of its window. There is nothing to transcribe beyond the averaging itself.');
w('- ORACLE ONLY: the engine and an independent oracle agree, and no printed value is known to set against either.');
w('- TRANSCRIPTION ONLY: the engine and the oracle each copied the constants from the same page. A shared misreading would pass every check in the suite. FINDINGS-exposure.md section 6 records that planting the same error in both files left the suite green for the WBGT outdoor weights and for the REL slope, which is the expected result and the reason for this class.');
w();
w(`NOTE ON THE PROTECTOR ROWS. \`hearingProtectorEstimate\` is PUBLISHED, REPRODUCED for two methods only: the OSHA Technical Manual Appendix E worked example gives 98 dBA with an NRR of 25 as ${e6(E.hearingProtectorEstimate({ exposureDb: 98, nrrDb: 25, method: 'OSHA_FIELD_50' }).protectedDbA)} dBA under the field derating and ${e6(E.hearingProtectorEstimate({ exposureDb: 98, nrrDb: 25, method: 'OSHA_APPENDIX_B' }).protectedDbA)} dBA under Appendix B. The NIOSH derating by type and the dual-protection rule are ORACLE ONLY.`);
w(`NOTE ON THE WEEKLY LEX. \`lexWeeklyDbA\` carries ${byFn.lexWeeklyDbA.published} published case, five equal days at 85 dBA giving 85, which any averaging of five equal numbers reproduces. The energy averaging it shares with the daily LEX is reproduced by L108 Figure 26 (section 11); the divisor of 5 is the statutory formula and no printed case with other than five days is known, so the divisor is ORACLE ONLY.`);
must('the weekly LEX has exactly one published case, the equal-days one', byFn.lexWeeklyDbA.published === 1 && GOLD.cases.some((c) => c.id === 'lex-weekly-equal-days' && c.basis === 'published'), byFn.lexWeeklyDbA.published);
w('NOTE ON BRIEF AND SCALA. The DAILY factor is PUBLISHED, REPRODUCED: the BC Occupational Health and Safety Regulation factors at 10, 12, 16 and 20 hours are reproduced in section 21. The WEEKLY factor is ORACLE ONLY.');
w();

/* ------------------------------------------------------------- SECTION 3 */

w(sec(3, 'The constants this engine stands on, MEASURED out of the engine and pinned against a literal typed in the generator', ['beginner', 'm02'], ['advanced', 'm03']));
w();
w('Every constant below is measured by asking the engine a question whose answer is that constant and nothing else, then compared against a literal typed in the digest generator, a third location beside the engine and the oracle. The method column states the question.');
w();
w('| constant | measured | literal | relative difference | method |');
w('| --- | --- | --- | --- | --- |');
PIN_ROWS.forEach(([label, m, lit, , how]) => w(`| ${label} | ${e12(m)} | ${e12(lit)} | ${sci(relDiff(m, lit))} | ${how} |`));
w();
w(`THE TWO PRINTED COEFFICIENTS AND THE EXACT ONES. OSHA prints 16.61 and NIOSH prints 10.0. The exact values, the exchange rate over log10 2, are ${e12(EXACT5)} for 5 dB and ${e12(EXACT3)} for 3 dB. The printed OSHA coefficient sits ${e12(16.61 - EXACT5)} dB above the exact one and the printed NIOSH coefficient ${e12(10 - EXACT3)} dB above its exact one. Section 5 shows which one each published table follows.`);
w();

/* ------------------------------------------------------------- SECTION 4 */

w(sec(4, 'Reference durations: OSHA Table G-16a and NIOSH Table 1-1, reproduced by the engine', ['beginner', 'm01'], ['beginner', 'm05']));
w();
w('THE REFERENCE DURATION is the time at a level that gives exactly 100 percent noise dose. OSHA: T = 8 / 2^((L - 90)/5) hours. NIOSH: T = 480 / 2^((L - 85)/3) minutes. Every row below is a golden case whose printed value the engine is checked against; the engine column is a fresh call.');
w();
const g16a = GOLD.cases.filter((c) => c.id.startsWith('g16a-'));
w('| level, dBA | engine T, hours | printed T, hours | printed tolerance | engine minus printed |');
w('| --- | --- | --- | --- | --- |');
g16a.forEach((c) => {
  const r = success(`G-16a ${c.id}`, E[c.fn](...c.args));
  const p = c.published.referenceDurationH;
  must(`G-16a ${c.id} reproduces the printed value`, Math.abs(r.referenceDurationH - p.value) <= p.tolerance, r.referenceDurationH);
  w(`| ${e6(c.args[0])} | ${e6(r.referenceDurationH)} | ${e6(p.value)} | ${e6(p.tolerance)} | ${e6(r.referenceDurationH - p.value)} |`);
});
w();
w(`${g16a.length} rows of Table G-16a, 80 to 130 dBA. THE 125 dBA ROW: the formula gives exactly ${e6(E.noiseReferenceDurationH(125, 'OSHA_PEL').referenceDurationH)} h and the table prints 0.063, a round-half-up of the fourth decimal.`);
w();
const t11 = GOLD.cases.filter((c) => c.id.startsWith('niosh-t11-'));
w('NIOSH Table 1-1, the same quantity on the 85 dBA, 3 dB criterion. The table prints hours, minutes and seconds; the golden stores hours.');
w();
w('| level, dBA | engine T, hours | engine T, minutes | printed T, hours | engine minus printed, hours |');
w('| --- | --- | --- | --- | --- |');
t11.forEach((c) => {
  const r = success(`NIOSH 1-1 ${c.id}`, E[c.fn](...c.args));
  const p = c.published.referenceDurationH;
  must(`NIOSH 1-1 ${c.id} reproduces the printed value`, Math.abs(r.referenceDurationH - p.value) <= p.tolerance, r.referenceDurationH);
  w(`| ${e6(c.args[0])} | ${e6(r.referenceDurationH)} | ${e6(r.referenceDurationH * 60)} | ${e6(p.value)} | ${e6(r.referenceDurationH - p.value)} |`);
});
w();
w(`${t11.length} rows reproduced, plus one printed row the formula refutes, which is an erratum and lives in section 19.`);
w();

/* ------------------------------------------------------------- SECTION 5 */

w(sec(5, 'Noise dose to TWA: OSHA Table A-1 and NIOSH Table 1-2, and the exact coefficient beside the printed one', ['beginner', 'm02'], ['beginner', 'm05']));
w();
w('THE TWA restates a noise dose as the constant level that would give it over 8 hours: TWA = K log10(D/100) + Lc. OSHA prints K = 16.61 with Lc = 90; NIOSH prints K = 10.0 with Lc = 85. The column headed "exact K" is the same TWA with the exact coefficient, computed through the engine with a custom criterion.');
w();
const a1 = GOLD.cases.filter((c) => c.id.startsWith('a1-'));
const exactOsha = { id: 'EXACT_OSHA', criterionLevelDbA: 90, exchangeRateDb: 5, thresholdDbA: 90 };
const exactNiosh = { id: 'EXACT_NIOSH', criterionLevelDbA: 85, exchangeRateDb: 3, thresholdDbA: 80 };
let a1ExactFails = 0;
w('| noise dose, percent | engine TWA with 16.61 | printed TWA | TWA with exact K | printed minus exact |');
w('| --- | --- | --- | --- | --- |');
a1.forEach((c) => {
  const r = success(`A-1 ${c.id}`, E[c.fn](...c.args));
  const p = c.published.twaDbA;
  const x = E.noiseTwaFromDoseDbA(c.args[0], exactOsha).twaDbA;
  must(`A-1 ${c.id} reproduces the printed value`, Math.abs(r.twaDbA - p.value) <= p.tolerance, r.twaDbA);
  if (Math.abs(x - p.value) > p.tolerance) a1ExactFails += 1;
  w(`| ${e6(c.args[0])} | ${e6(r.twaDbA)} | ${e6(p.value)} | ${e6(x)} | ${e6(p.value - x)} |`);
});
w();
w(`${a1.length} rows of Table A-1 reproduced with 16.61. With the exact coefficient ${a1ExactFails} of the ${a1.length} printed rows fall outside their printed tolerance.`);
w();
const t12 = GOLD.cases.filter((c) => c.id.startsWith('niosh-t12-'));
let t12ExactFails = 0;
w('NIOSH Table 1-2, noise dose to TWA on the NIOSH criterion.');
w();
w('| noise dose, percent | engine TWA with 10.0 | printed TWA | TWA with exact K | printed minus exact |');
w('| --- | --- | --- | --- | --- |');
t12.forEach((c) => {
  const r = success(`NIOSH 1-2 ${c.id}`, E[c.fn](...c.args));
  const p = c.published.twaDbA;
  const x = E.noiseTwaFromDoseDbA(c.args[0], exactNiosh).twaDbA;
  must(`NIOSH 1-2 ${c.id} reproduces the printed value`, Math.abs(r.twaDbA - p.value) <= p.tolerance, r.twaDbA);
  if (Math.abs(x - p.value) > p.tolerance) t12ExactFails += 1;
  w(`| ${e6(c.args[0])} | ${e6(r.twaDbA)} | ${e6(p.value)} | ${e6(x)} | ${e6(p.value - x)} |`);
});
w();
must('the exact NIOSH coefficient fails more printed Table 1-2 rows than the printed one', t12ExactFails > 0, t12ExactFails);
must('Table A-1 cannot tell 16.61 from the exact coefficient at its printed precision', a1ExactFails === 0, a1ExactFails);
w(`${t12.length} rows reproduced with 10.0. With the exact coefficient ${t12ExactFails} of the ${t12.length} printed rows fall outside their printed tolerance.`);
w();
w(`WHAT THE TWO TABLES CAN AND CANNOT TELL APART (judgement J1). NIOSH Table 1-2 separates its printed 10.0 from the exact coefficient: ${t12ExactFails} of its ${t12.length} rows reject the exact one. OSHA Table A-1 does not separate 16.61 from the exact coefficient: ${a1ExactFails} of its ${a1.length} rows reject the exact one, because the two coefficients differ by ${e12(16.61 - EXACT5)} dB and the table prints one decimal. What fixes 16.61 for OSHA is the text of the mandatory Appendix A, which writes TWA = 16.61 log10(D/100) + 90, and the engine uses the coefficient the regulation writes.`);
w();
const tw100 = E.noiseTwaFromDoseDbA(E.noiseDose([{ levelDbA: 100, durationH: 8 }], 'NIOSH_REL').dosePct, 'NIOSH_REL').twaDbA;
w(`THE COST OF THAT CHOICE, measured. Eight hours at a constant 100 dBA on the NIOSH preset gives a TWA of ${e6(tw100)} dBA, where the level itself is 100. On a custom criterion with the exact coefficient the same record gives ${e6(E.noiseDose([{ levelDbA: 100, durationH: 8 }], exactNiosh).twaDbA)} dBA.`);
must('the NIOSH preset reads 8 h at 100 dBA above 100', tw100 > 100, tw100);
w();
w('THE ZERO NOISE DOSE HAS NO TWA. A dose of zero is refused by `noiseTwaFromDoseDbA`, and `noiseDose` over a record with nothing integrated returns a TWA of null with a dose of zero:');
const zeroDose = success('a record entirely below the PEL threshold', E.noiseDose([{ levelDbA: 85, durationH: 8 }], 'OSHA_PEL'));
must('a record below threshold gives dose 0 and twa null', zeroDose.dosePct === 0 && zeroDose.twaDbA === null, zeroDose.twaDbA);
const zeroRef = refusal('noiseTwaFromDoseDbA(0)', E.noiseTwaFromDoseDbA(0, 'OSHA_PEL'), 'dosePct');
w(`- eight hours at 85 dBA on the PEL setup: noise dose ${e6(zeroDose.dosePct)} percent, TWA reported as absent (the engine returns null)`);
w(`- a noise dose of 0 asked for its TWA refuses on \`${zeroRef.field}\`: "${zeroRef.error}"`);
w();

/* ------------------------------------------------------------- SECTION 6 */

w(sec(6, 'The threshold decides what counts', ['beginner', 'm01', 'l04'], ['beginner', 'm03']));
w();
w('THE OBEN WALKDOWN, stated: an eight-hour dosimeter record of six periods.');
w();
w('| period | level, dBA | hours |');
w('| --- | --- | --- |');
OBEN.forEach((p, i) => w(`| ${i + 1} | ${e6(p.levelDbA)} | ${e6(p.durationH)} |`));
w();
const obPel = success('Oben PEL', E.noiseDose(OBEN, 'OSHA_PEL'));
const obAl = success('Oben AL', E.noiseDose(OBEN, 'OSHA_ACTION_LEVEL'));
const obRel = success('Oben REL', E.noiseDose(OBEN, 'NIOSH_REL'));
w('EACH PERIOD\'S CONTRIBUTION under each criterion, in percent of noise dose. "not integrated" means the level is below that criterion\'s threshold.');
w();
w('| period | level, dBA | OSHA PEL | OSHA action level | NIOSH REL |');
w('| --- | --- | --- | --- | --- |');
const cell = (c) => (c.integrated ? e6(c.dosePct) : 'not integrated');
OBEN.forEach((p, i) => w(`| ${i + 1} | ${e6(p.levelDbA)} | ${cell(obPel.contributions[i])} | ${cell(obAl.contributions[i])} | ${cell(obRel.contributions[i])} |`));
w();
const nInt = (r) => r.contributions.filter((c) => c.integrated).length;
w(`The PEL setup integrates ${nInt(obPel)} of the ${OBEN.length} periods, the action level ${nInt(obAl)} and the NIOSH REL ${nInt(obRel)}.`);
must('the three criteria integrate different subsets', nInt(obPel) < nInt(obAl) && nInt(obAl) === nInt(obRel), `${nInt(obPel)} ${nInt(obAl)} ${nInt(obRel)}`);
w();
w('THE THRESHOLD IS INCLUSIVE (judgement J2). The ORONI record puts a period exactly on each threshold and one just under:');
w();
w('| level, dBA | hours | OSHA PEL | OSHA action level | NIOSH REL |');
w('| --- | --- | --- | --- | --- |');
const orPel = success('Oroni PEL', E.noiseDose(ORONI, 'OSHA_PEL'));
const orAl = success('Oroni AL', E.noiseDose(ORONI, 'OSHA_ACTION_LEVEL'));
const orRel = success('Oroni REL', E.noiseDose(ORONI, 'NIOSH_REL'));
ORONI.forEach((p, i) => w(`| ${e6(p.levelDbA)} | ${e6(p.durationH)} | ${cell(orPel.contributions[i])} | ${cell(orAl.contributions[i])} | ${cell(orRel.contributions[i])} |`));
must('J2 on Oroni: 90 integrated by the PEL, 80 by the AL, 79.9 by nobody',
  orPel.contributions[1].integrated && !orPel.contributions[0].integrated && orAl.contributions[0].integrated && !orAl.contributions[2].integrated, 'ok');
w();
w(`Totals for ORONI: PEL ${e6(orPel.dosePct)} percent (TWA ${e6(orPel.twaDbA)} dBA), action level ${e6(orAl.dosePct)} percent (TWA ${e6(orAl.twaDbA)} dBA), NIOSH REL ${e6(orRel.dosePct)} percent (TWA ${e6(orRel.twaDbA)} dBA).`);
w();

/* ------------------------------------------------------------- SECTION 7 */

w(sec(7, 'Three criteria, one record', ['beginner', 'm03'], ['beginner', 'm04']));
w();
w('THE OBEN WALKDOWN read three ways. Same periods, same instrument record.');
w();
w('| criterion | criterion level, dBA | decibel exchange rate, dB | threshold, dBA | limit noise dose, percent | noise dose, percent | TWA, dBA | exceeds its limit |');
w('| --- | --- | --- | --- | --- | --- | --- | --- |');
[['OSHA_PEL', obPel], ['OSHA_ACTION_LEVEL', obAl], ['NIOSH_REL', obRel]].forEach(([p, r]) => {
  w(`| ${C[p].label} | ${e6(C[p].criterionLevelDbA)} | ${e6(C[p].exchangeRateDb)} | ${e6(C[p].thresholdDbA)} | ${e6(r.limitDosePct)} | ${e6(r.dosePct)} | ${e6(r.twaDbA)} | ${r.exceedsLimit} |`);
});
w();
must('Oben: under the PEL, over the action level, over the NIOSH REL', !obPel.exceedsLimit && obAl.exceedsLimit && obRel.exceedsLimit, 'ok');
w('ONE DAY, THREE ANSWERS. The OBEN day is under the OSHA PEL, over the OSHA action level and over the NIOSH REL, all three computed from one record. None of the three is the "real" noise dose: each is the noise dose against its own criterion, and a report that quotes a noise dose without naming the criterion has not said anything.');
w();
w(`THE ACTION LEVEL IS HALF A NOISE DOSE. 1910.95(c)(1) sets the action level at a TWA of 85 dBA "or, equivalently, a dose of fifty percent". On the action-level setup the OBEN day's TWA is ${e6(obAl.twaDbA)} dBA against 85 and its noise dose is ${e6(obAl.dosePct)} percent against 50. A TWA of 85 on the OSHA scale is a noise dose of ${e6(E.noiseDoseFromTwaPct(85, 'OSHA_ACTION_LEVEL').dosePct)} percent, measured by \`noiseDoseFromTwaPct\`.`);
w();
w('EVERY PERIOD\'S REFERENCE DURATION on the OBEN record, hours, which is the denominator of each contribution above:');
w();
w('| level, dBA | OSHA, hours | NIOSH, hours |');
w('| --- | --- | --- |');
OBEN.forEach((p) => {
  const o = E.noiseReferenceDurationH(p.levelDbA, 'OSHA_ACTION_LEVEL');
  const ni = E.noiseReferenceDurationH(p.levelDbA, 'NIOSH_REL');
  w(`| ${e6(p.levelDbA)} | ${o.belowThreshold ? 'below threshold' : e6(o.referenceDurationH)} | ${ni.belowThreshold ? 'below threshold' : e6(ni.referenceDurationH)} |`);
});
w();
const loudest = OBEN.reduce((m, p) => (p.levelDbA > m.levelDbA ? p : m));
const loudShare = obPel.contributions[OBEN.indexOf(loudest)].dosePct / obPel.dosePct;
w(`THE LOUDEST PERIOD IS ONE TERM. The ${e6(loudest.levelDbA)} dBA period lasts ${e6(loudest.durationH)} h and carries ${e6(100 * loudShare)} percent of the PEL noise dose; the rest comes from the other integrated periods.`);
w();

/* ------------------------------------------------------------- SECTION 8 */

w(sec(8, 'Warnings: the tops of the tables and the NIOSH ceiling', ['beginner', 'm03', 'l05'], ['beginner', 'm05', 'l04']));
w();
w('THE ENGINE WARNS AND STILL INTEGRATES (judgement J3). Each warning below is quoted verbatim from the engine.');
w();
const warnCase = (label, periods, p) => {
  const r = success(label, E.noiseDose(periods, p));
  return r;
};
[['a 117 dBA period on the OSHA PEL setup', LOUD_117, 'OSHA_PEL'],
  ['a 117 dBA period on the NIOSH REL', LOUD_117, 'NIOSH_REL'],
  ['a 132 dBA period on the OSHA PEL setup', LOUD_132, 'OSHA_PEL'],
  ['a 132 dBA period on the NIOSH REL', LOUD_132, 'NIOSH_REL']].forEach(([label, periods, p]) => {
  const r = warnCase(label, periods, p);
  must(`${label} carries at least one warning`, r.warnings.length >= 1, r.warnings.length);
  w(`${label.replace(/^a /, 'A ')}: noise dose ${e6(r.dosePct)} percent, TWA ${e6(r.twaDbA)} dBA, ${r.warnings.length} warning(s):`);
  r.warnings.forEach((x) => w(`> ${x}`));
  w();
});
w(`THE TABLE TOPS. \`OSHA_TABLE_G16A_MAX_DBA\` is ${E.OSHA_TABLE_G16A_MAX_DBA} and \`OSHA_TABLE_G16_MAX_DBA\` is ${E.OSHA_TABLE_G16_MAX_DBA}. The NIOSH ceiling on the REL preset is ${C.NIOSH_REL.ceilingDbA} dBA. Above any of them the formula is still evaluated and the number is still reported; the warning is the engine telling the reader the source stops there.`);
w();

/* ------------------------------------------------------------- SECTION 9 */

w(sec(9, 'Inverse questions, and the time left at a level', ['beginner', 'm04'], ['beginner', 'm05']));
w();
w('THE LEVEL FOR A REFERENCE DURATION, from `noiseLevelForReferenceDurationDbA`:');
w();
w('| hours | OSHA level, dBA | NIOSH level, dBA |');
w('| --- | --- | --- |');
[0.25, 0.5, 1, 2, 3, 4, 6, 8, 12, 16].forEach((h) => {
  const o = success(`level for ${h} h OSHA`, E.noiseLevelForReferenceDurationDbA(h, 'OSHA_PEL'));
  const ni = success(`level for ${h} h NIOSH`, E.noiseLevelForReferenceDurationDbA(h, 'NIOSH_REL'));
  w(`| ${e6(h)} | ${e6(o.levelDbA)} | ${e6(ni.levelDbA)} |`);
});
w();
w('THE NOISE DOSE FROM A TWA, from `noiseDoseFromTwaPct`:');
w();
w('| TWA, dBA | OSHA noise dose, percent | NIOSH noise dose, percent |');
w('| --- | --- | --- |');
[80, 82, 85, 87, 88, 90, 92, 95, 100].forEach((t) => {
  w(`| ${e6(t)} | ${e6(E.noiseDoseFromTwaPct(t, 'OSHA_PEL').dosePct)} | ${e6(E.noiseDoseFromTwaPct(t, 'NIOSH_REL').dosePct)} |`);
});
w();
const oneDbOsha = E.noiseDoseFromTwaPct(91, 'OSHA_PEL').dosePct / E.noiseDoseFromTwaPct(90, 'OSHA_PEL').dosePct;
const oneDbNiosh = E.noiseDoseFromTwaPct(86, 'NIOSH_REL').dosePct / E.noiseDoseFromTwaPct(85, 'NIOSH_REL').dosePct;
w(`WHAT ONE DECIBEL IS WORTH. One decibel on the TWA multiplies the OSHA noise dose by ${e6(oneDbOsha)} and the NIOSH noise dose by ${e6(oneDbNiosh)}, both measured as the ratio of the doses at a TWA one decibel apart.`);
w();
const obLeft = (1 - obPel.dosePct / 100);
const T95 = E.noiseReferenceDurationH(95, 'OSHA_PEL').referenceDurationH;
w(`TIME LEFT AT A LEVEL. After the OBEN day the PEL noise dose stands at ${e6(obPel.dosePct)} percent, so ${e6(100 * obLeft)} percent of the allowance remains. At 95 dBA the reference duration is ${e6(T95)} h, so the time left at 95 dBA is ${e6(obLeft * T95)} h, which is ${e6(obLeft * T95 * 60)} minutes (derived: the fraction remaining times the reference duration).`);
must('Oben leaves allowance under the PEL', obLeft > 0, obLeft);
w();
w('A RECORD LONGER THAN A DAY IS REFUSED (judgement J4):');
const long = refusal('a 25 hour noise record', E.noiseDose([{ levelDbA: 85, durationH: 13 }, { levelDbA: 88, durationH: 12 }], 'NIOSH_REL'), 'periods');
w(`> ${long.error}`);
w();

/* ------------------------------------------------------------ SECTION 10 */

w(sec(10, 'Every refusal the engine produces, run through the engine', ['beginner', 'm01', 'l05'], ['beginner', 'm04', 'l04'], ['intermediate', 'm04', 'l04'], ['advanced', 'm02', 'l05']));
w();
w(`The vendored golden carries ${GOLD.refusals.length} refusal cases. Each one is called here and must return \`error\` and the named \`field\`. The message is the engine's own words.`);
w();
w('| golden id | door | refused field | message |');
w('| --- | --- | --- | --- |');
GOLD.refusals.forEach((c) => {
  const r = refusal(`golden refusal ${c.id}`, E[c.fn](...c.args), c.field);
  w(`| ${c.id} | \`${c.fn}\` | \`${r.field}\` | ${String(r.error).replace(/\|/g, '/')} |`);
});
w();
const refFields = countBy(GOLD.refusals, (c) => c.field.replace(/\[\d+\]/g, '[i]'));
w(`Refused fields, counted: ${Object.entries(refFields).sort().map(([k, v]) => `\`${k}\` ${v}`).join(', ')}.`);
w();

/* ------------------------------------------------------------ SECTION 11 */

w(sec(11, 'LEX,8h, the daily noise exposure level', ['intermediate', 'm01']));
w();
w('LEX,8h = 10 log10( sum( t_i / 8 x 10^(L_i/10) ) ). It is an ENERGY average normalised to 8 hours, with no threshold: every task counts. Exposure points: EP = 100 (t/8) 10^((L - 85)/10), and 100 points is LEX,8h 85.');
w();
const fig26 = GOLD.cases.find((c) => c.id === 'l108-figure-26');
const f26 = success('L108 Figure 26', E.lexEightHourDbA(...fig26.args));
w('THE HSE L108 FIGURE 26 WORKED EXAMPLE, reproduced. Tasks stated by the source: 80 dBA for 5 h, 86 dBA for 2 h, 95 dBA for 45 min.');
w();
w('| task | LAeq, dBA | hours | task LEX, dBA | points |');
w('| --- | --- | --- | --- | --- |');
fig26.args[0].forEach((t, i) => w(`| ${i + 1} | ${e6(t.laeqDbA)} | ${e6(t.durationH)} | ${e6(f26.contributions[i].lexDbA)} | ${e6(f26.contributions[i].exposurePoints)} |`));
w();
Object.entries(fig26.published || {}).forEach(([k, p]) => {
  const got = at(f26, k);
  must(`Figure 26 ${k} reproduces the printed value`, Math.abs(got - p.value) <= p.tolerance, got);
});
w(`Day total: LEX,8h ${e6(f26.lexDbA)} dBA, ${e6(f26.exposurePoints)} points. The source prints 87 dB(A) and 145 points, which the engine reproduces at the precision printed.`);
w();
const ev = success('Evwreni LEX', E.lexEightHourDbA(EVWRENI));
const evL = success('Evwreni long LEX', E.lexEightHourDbA(EVWRENI_LONG));
w('THE EVWRENI SURVEY, stated, and the same crew on a longer day:');
w();
w('| task | LAeq, dBA | hours, 8 hour day | hours, long day | task LEX, 8 hour day | task points, 8 hour day |');
w('| --- | --- | --- | --- | --- | --- |');
EVWRENI.forEach((t, i) => w(`| ${i + 1} | ${e6(t.laeqDbA)} | ${e6(t.durationH)} | ${e6(EVWRENI_LONG[i].durationH)} | ${e6(ev.contributions[i].lexDbA)} | ${e6(ev.contributions[i].exposurePoints)} |`));
w();
w(`| day | hours | LEX,8h, dBA | points | at or above the lower action value | at or above the upper action value |`);
w('| --- | --- | --- | --- | --- | --- |');
w(`| 8 hour day | ${e6(ev.totalDurationH)} | ${e6(ev.lexDbA)} | ${e6(ev.exposurePoints)} | ${ev.exceedsLowerAction} | ${ev.exceedsUpperAction} |`);
w(`| long day | ${e6(evL.totalDurationH)} | ${e6(evL.lexDbA)} | ${e6(evL.exposurePoints)} | ${evL.exceedsLowerAction} | ${evL.exceedsUpperAction} |`);
w();
const evLongOver = 10 * Math.log10(EVWRENI_LONG.reduce((s, t) => s + (t.durationH / evL.totalDurationH) * 10 ** (t.laeqDbA / 10), 0));
w(`THE EIGHT-HOUR NORMALISER. The long day's energy is still divided by 8, so its LEX,8h is ${e6(evL.lexDbA)} dBA. Divided by its own ${e6(evL.totalDurationH)} hours instead, the same energy averages to ${e6(evLongOver)} dBA (derived), which is the LAeq over the day and a different quantity.`);
w();
const probes = [[{ laeqDbA: 88, durationH: 4 }], [{ laeqDbA: 85, durationH: 10 }], [{ laeqDbA: 85, durationH: 8 }], [{ laeqDbA: 80, durationH: 8 }], [{ laeqDbA: 0, durationH: 8 }], [{ laeqDbA: 100, durationH: 0 }, { laeqDbA: 85, durationH: 8 }]];
w('SMALL CASES:');
w();
w('| tasks | LEX,8h, dBA | points | lower action | upper action |');
w('| --- | --- | --- | --- | --- |');
probes.forEach((p) => {
  const r = success(`LEX probe ${JSON.stringify(p)}`, E.lexEightHourDbA(p));
  w(`| ${p.map((t) => `${e6(t.laeqDbA)} dBA for ${e6(t.durationH)} h`).join(' and ')} | ${e6(r.lexDbA)} | ${e6(r.exposurePoints)} | ${r.exceedsLowerAction} | ${r.exceedsUpperAction} |`);
});
w();
w(`A zero-length task contributes nothing and its own task LEX is reported as absent. The EU values are exported as \`EU_NOISE_VALUES\`: lower action ${e6(E.EU_NOISE_VALUES.lowerActionLexDbA)}, upper action ${e6(E.EU_NOISE_VALUES.upperActionLexDbA)}, limit ${e6(E.EU_NOISE_VALUES.limitLexDbA)} dBA. The two flags are at or above; the limit value applies to the exposure at the ear with protection taken into account, which this engine does not compute.`);
w();
w('POINTS AND LEX, from `hseExposurePoints` and `lexFromExposurePointsDbA`:');
w();
w('| points | LEX,8h, dBA |');
w('| --- | --- |');
[10, 25, 31.622777, 50, 100, 150, 200, 320, 500, 1000].forEach((p) => w(`| ${e6(p)} | ${e6(E.lexFromExposurePointsDbA(p).lexDbA)} |`));
w();

/* ------------------------------------------------------------ SECTION 12 */

w(sec(12, 'The week, and the time to reach a target', ['intermediate', 'm02']));
w();
w('LEX,w = 10 log10( (1/5) sum 10^(0.1 LEX,8h,k) ), up to 7 days, and the divisor is 5 whatever the number of days (judgement J10).');
w();
w('| week | daily LEX,8h values, dBA | days | weekly LEX, dBA | arithmetic mean of the days, dBA |');
w('| --- | --- | --- | --- | --- |');
[['five days', WEEK_5], ['four days', WEEK_4], ['six equal days', WEEK_6]].forEach(([label, days]) => {
  const r = success(`weekly ${label}`, E.lexWeeklyDbA(days));
  w(`| ${label} | ${days.map(e6).join(', ')} | ${r.days} | ${e6(r.lexWeeklyDbA)} | ${e6(days.reduce((s, x) => s + x, 0) / days.length)} |`);
});
w();
const wk5 = E.lexWeeklyDbA(WEEK_5).lexWeeklyDbA;
const loudDay = Math.max(...WEEK_5);
const without = E.lexWeeklyDbA(WEEK_5.filter((x) => x !== loudDay)).lexWeeklyDbA;
w(`ONE LOUD DAY DOMINATES. Remove the ${e6(loudDay)} dBA day from the five-day week and the weekly level falls from ${e6(wk5)} to ${e6(without)} dBA, because the remaining four are still divided by 5.`);
const g4 = GOLD.cases.find((c) => c.id === 'lex-weekly-four-days');
w(`The golden's own four-day case: four days at 90 dBA give ${e6(E.lexWeeklyDbA(...g4.args).lexWeeklyDbA)} dBA.`);
w();
w('THE TIME TO REACH A TARGET, from `lexAllowedDurationH`: the hours at a level that alone reach the target LEX,8h.');
w();
w('| LAeq, dBA | hours to 80 | hours to 85 | hours to 87 |');
w('| --- | --- | --- | --- |');
[82, 85, 88, 91, 94, 97, 100, 103, 106].forEach((L) => {
  const h = (t) => e6(E.lexAllowedDurationH({ laeqDbA: L, targetLexDbA: t }).durationH);
  w(`| ${e6(L)} | ${h(80)} | ${h(85)} | ${h(87)} |`);
});
w();

/* ------------------------------------------------------------ SECTION 13 */

w(sec(13, 'Hearing protector estimates, by method', ['intermediate', 'm03'], ['intermediate', 'm06']));
w();
w('FOUR NAMED METHODS, each a different question. `OSHA_APPENDIX_B`: the adequacy test, A-weighted minus (NRR - 7), C-weighted minus NRR. `OSHA_FIELD_50`: the OSHA Technical Manual Appendix E field derating, A-weighted only, minus (NRR - 7) x 50 percent, used when deciding whether engineering controls are needed. `OSHA_DUAL`: the higher NRR, minus 7 if A-weighted, plus 5. `NIOSH_TYPE`: the NRR derated by protector type, then minus 7 if A-weighted.');
w();
const pe = (o) => E.hearingProtectorEstimate(o);
w(`THE TEACHING CASES, stated: an A-weighted TWA of ${e6(PROTECTOR_A.exposureDb)} dBA and a C-weighted level of ${e6(PROTECTOR_C.exposureDb)} dBC, each with an NRR of ${e6(PROTECTOR_A.nrrDb)} dB.`);
w();
w('| method | weighting | credited NRR, dB | attenuation, dB | estimated level, dBA | warnings |');
w('| --- | --- | --- | --- | --- | --- |');
const pcases = [
  ['OSHA_APPENDIX_B', 'A', undefined], ['OSHA_APPENDIX_B', 'C', undefined],
  ['OSHA_FIELD_50', 'A', undefined],
  ['OSHA_DUAL', 'A', undefined], ['OSHA_DUAL', 'C', undefined],
  ['NIOSH_TYPE', 'A', 'earmuff'], ['NIOSH_TYPE', 'C', 'earmuff'],
  ['NIOSH_TYPE', 'A', 'formableEarplug'], ['NIOSH_TYPE', 'C', 'formableEarplug'],
  ['NIOSH_TYPE', 'A', 'otherEarplug'], ['NIOSH_TYPE', 'C', 'otherEarplug'],
];
pcases.forEach(([method, wt, type]) => {
  const base = wt === 'A' ? PROTECTOR_A : PROTECTOR_C;
  const r = success(`protector ${method} ${wt} ${type}`, pe({ exposureDb: base.exposureDb, nrrDb: base.nrrDb, weighting: wt, method, protectorType: type }));
  w(`| ${method}${type ? ` (${type})` : ''} | ${wt} | ${e6(r.creditedNrrDb)} | ${e6(r.attenuationDb)} | ${e6(r.protectedDbA)} | ${r.warnings.length} |`);
});
w();
const fieldC = refusal('field derating on C-weighted data', pe({ exposureDb: PROTECTOR_C.exposureDb, nrrDb: PROTECTOR_C.nrrDb, weighting: 'C', method: 'OSHA_FIELD_50' }), 'weighting');
w(`THE FIELD DERATING REFUSES C-WEIGHTED DATA (judgement J5), because the source publishes it for A-weighted exposures only:`);
w(`> ${fieldC.error}`);
w();
w(`THE OTM WORKED EXAMPLE, reproduced: 98 dBA with an NRR of 25 gives ${e6(pe({ exposureDb: 98, nrrDb: 25, method: 'OSHA_FIELD_50' }).protectedDbA)} dBA under the field derating (the engineering-controls question) and ${e6(pe({ exposureDb: 98, nrrDb: 25, method: 'OSHA_APPENDIX_B' }).protectedDbA)} dBA under Appendix B (the hearing-conservation question). Same protector, same exposure, two answers to two questions.`);
w();
w('THE NRR SWEEP on the A-weighted teaching case, estimated level in dBA:');
w();
w('| NRR, dB | Appendix B | field derating | dual | NIOSH earmuff | NIOSH formable plug | NIOSH other plug |');
w('| --- | --- | --- | --- | --- | --- | --- |');
NRR_SWEEP.forEach((nrr) => {
  const v = (method, type) => e6(pe({ exposureDb: PROTECTOR_A.exposureDb, nrrDb: nrr, method, protectorType: type }).protectedDbA);
  w(`| ${e6(nrr)} | ${v('OSHA_APPENDIX_B')} | ${v('OSHA_FIELD_50')} | ${v('OSHA_DUAL')} | ${v('NIOSH_TYPE', 'earmuff')} | ${v('NIOSH_TYPE', 'formableEarplug')} | ${v('NIOSH_TYPE', 'otherEarplug')} |`);
});
w();
const floor = success('floor probe', pe({ exposureDb: PROTECTOR_A.exposureDb, nrrDb: 5, method: 'OSHA_APPENDIX_B' }));
w('THE FLOOR AT ZERO. An NRR under 7 on A-weighted data would give a negative attenuation and RAISE the estimate. The engine credits zero and warns:');
w(`> ${floor.warnings[0]}`);
must('the floor warns once', floor.warnings.length === 1 && floor.attenuationDb === 0, floor.attenuationDb);
w();

/* ------------------------------------------------------------ SECTION 14 */

w(sec(14, 'Chemical averages: the 8-hour TWA and the 15-minute STEL', ['intermediate', 'm04']));
w();
const d1 = GOLD.cases.find((c) => c.id === 'cfr-1000-d1-example');
const d1r = success('1910.1000(d)(1) example', E.chemicalTwa8h(...d1.args));
w(`THE 1910.1000(d)(1) WORKED EXAMPLE, reproduced: ${d1.args[0].map((p) => `${e6(p.concentration)} ppm for ${e6(p.durationH)} h`).join(', ')} gives an 8-hour TWA of ${e6(d1r.twa8h)} ppm. The regulation writes E = (C_a T_a + C_b T_b + ... + C_n T_n) / 8.`);
w();
w('THE IGBOMOTORU SAMPLES, stated, three ways:');
w();
w('| record | samples, ppm for hours | hours covered | 8-hour TWA, ppm | average over the hours covered, ppm | warnings |');
w('| --- | --- | --- | --- | --- | --- |');
[['partial shift', IGBO_PARTIAL], ['full shift', IGBO_FULL], ['ten-hour shift', IGBO_LONG]].forEach(([label, rec]) => {
  const r = success(`Igbomotoru ${label}`, E.chemicalTwa8h(rec));
  const sum = rec.reduce((s, p) => s + p.concentration * p.durationH, 0);
  if (label === 'partial shift') must('the partial record averaged over its own hours is HIGHER than its 8-hour TWA', sum / r.totalDurationH > r.twa8h, sum / r.totalDurationH);
  w(`| ${label} | ${rec.map((p) => `${e6(p.concentration)} for ${e6(p.durationH)}`).join('; ')} | ${e6(r.totalDurationH)} | ${e6(r.twa8h)} | ${e6(sum / r.totalDurationH)} | ${r.warnings.length} |`);
});
w();
w('THE WARNINGS, verbatim:');
[IGBO_PARTIAL, IGBO_LONG].forEach((rec) => E.chemicalTwa8h(rec).warnings.forEach((x) => w(`> ${x}`)));
w();
w('UNSAMPLED TIME COUNTS AS ZERO. The partial record covers under 8 hours and is still divided by 8, which is what the regulation writes; the column beside it divides by the hours covered instead and is a different, higher number (derived). A hygienist who knows the unsampled time was clean may accept the first; one who does not has a record that cannot say.');
w();
w('THE STEL is a 15-minute time weighted average: sum(C t) / 15, t in minutes. A shorter record counts the remainder as zero and warns; a longer one is refused.');
w();
w('| record | samples, ppm for minutes | minutes covered | STEL, ppm | warnings |');
w('| --- | --- | --- | --- | --- |');
[['full window', STEL_FULL], ['short record', STEL_SHORT]].forEach(([label, rec]) => {
  const r = success(`STEL ${label}`, E.chemicalStel15Min(rec));
  w(`| ${label} | ${rec.map((p) => `${e6(p.concentration)} for ${e6(p.durationMin)}`).join('; ')} | ${e6(r.totalDurationMin)} | ${e6(r.stel15Min)} | ${r.warnings.length} |`);
});
w();
E.chemicalStel15Min(STEL_SHORT).warnings.forEach((x) => w(`> ${x}`));
const stelLong = refusal('STEL over 15 minutes', E.chemicalStel15Min([...STEL_FULL, { concentration: 40, durationMin: 2 }]), 'periods');
w(`> ${stelLong.error}`);
w();

/* ------------------------------------------------------------ SECTION 15 */

w(sec(15, 'Mixtures: the additive index of 1910.1000(d)(2)', ['intermediate', 'm05'], ['advanced', 'm06', 'l02']));
w();
const d2 = GOLD.cases.find((c) => c.id === 'cfr-1000-d2-example');
const d2r = success('1910.1000(d)(2) example', E.mixtureExposureIndex(...d2.args));
w(`THE 1910.1000(d)(2) WORKED EXAMPLE, reproduced: ${d2.args[0].map((c) => `${e6(c.concentration)} against ${e6(c.limit)}`).join(', ')} gives terms ${d2r.terms.map(e6).join(', ')} and an index of ${e6(d2r.index)}, exceeds ${d2r.exceeds}.`);
w();
const mx = success('teaching mixture', E.mixtureExposureIndex(MIXTURE.map(({ concentration, limit }) => ({ concentration, limit }))));
w('THE TEACHING MIXTURE, stated. The limits are public OSHA values typed as inputs.');
w();
w('| substance | concentration, ppm | limit, ppm | term |');
w('| --- | --- | --- | --- |');
MIXTURE.forEach((c, i) => w(`| ${c.name} | ${e6(c.concentration)} | ${e6(c.limit)} | ${e6(mx.terms[i])} |`));
w();
w(`Index ${e6(mx.index)}, exceeds ${mx.exceeds}. The largest single term is ${e6(Math.max(...mx.terms))}, so every component is under its own limit and the mixture still exceeds.`);
must('teaching mixture: every term under 1 and the index over 1', mx.terms.every((t) => t < 1) && mx.exceeds, mx.index);
w();
const unity = success('unity', E.mixtureExposureIndex([{ concentration: 50, limit: 100 }, { concentration: 25, limit: 50 }]));
const over = GOLD.cases.find((c) => c.id === 'mixture-over-unity');
w(`UNITY PASSES (judgement J7): an index of ${e6(unity.index)} gives exceeds ${unity.exceeds}; the golden's over-unity case gives ${e6(E.mixtureExposureIndex(...over.args).index)} and exceeds ${E.mixtureExposureIndex(...over.args).exceeds}. The regulation says the index "shall not exceed unity".`);
w();
w('WHEN ADDITIVITY IS THE WRONG MODEL. The index assumes the components act on the same organ by the same mechanism. Where they act independently, each is compared against its own limit and the sum means nothing; where they are known to potentiate each other, the sum understates the hazard. The engine computes the additive index only and cannot tell which case a mixture is in.');
w();

/* ------------------------------------------------------------ SECTION 16 */

w(sec(16, 'The wet bulb globe temperature', ['advanced', 'm01']));
w();
w('THE WEIGHTS ARE TRANSCRIPTION ONLY (section 2). The engine uses NIOSH 2016-106 section 9.3.2: indoors, or without solar load, WBGT = 0.7 Tnwb + 0.3 Tg; outdoors with solar load, WBGT = 0.7 Tnwb + 0.2 Tg + 0.1 Ta. Section 3 measures each weight by a unit impulse.');
w();
const wi = success('indoor WBGT', E.wbgtIndoorC(HEAT_INDOOR));
const wo = success('outdoor WBGT', E.wbgtOutdoorC(HEAT_OUTDOOR));
const woAsIn = success('the outdoor readings through the indoor form', E.wbgtIndoorC({ naturalWetBulbC: HEAT_OUTDOOR.naturalWetBulbC, globeC: HEAT_OUTDOOR.globeC }));
w('| readings | natural wet bulb, C | globe, C | dry bulb, C | form | WBGT, C |');
w('| --- | --- | --- | --- | --- | --- |');
w(`| indoor set | ${e6(HEAT_INDOOR.naturalWetBulbC)} | ${e6(HEAT_INDOOR.globeC)} | not used | ${wi.form} | ${e6(wi.wbgtC)} |`);
w(`| outdoor set | ${e6(HEAT_OUTDOOR.naturalWetBulbC)} | ${e6(HEAT_OUTDOOR.globeC)} | ${e6(HEAT_OUTDOOR.dryBulbC)} | ${wo.form} | ${e6(wo.wbgtC)} |`);
w(`| outdoor set through the indoor form | ${e6(HEAT_OUTDOOR.naturalWetBulbC)} | ${e6(HEAT_OUTDOOR.globeC)} | not used | ${woAsIn.form} | ${e6(woAsIn.wbgtC)} |`);
w();
w(`THE FORM MATTERS. The same outdoor readings give ${e6(wo.wbgtC)} C through the outdoor form and ${e6(woAsIn.wbgtC)} C through the indoor one, a difference of ${e6(woAsIn.wbgtC - wo.wbgtC)} C (derived).`);
w();
const hw = success('the work and rest hour, WBGT', E.wbgtTwaC(HEAT_WBGT_HOUR));
w('THE ONE-HOUR AVERAGE. NIOSH states its limits against a one-hour time weighted WBGT. The teaching hour, stated:');
w();
w('| period | WBGT, C | minutes |');
w('| --- | --- | --- |');
HEAT_WBGT_HOUR.forEach((p, i) => w(`| ${i + 1} | ${e6(p.wbgtC)} | ${e6(p.durationMin)} |`));
w();
w(`Time weighted WBGT ${e6(hw.wbgtTwaC)} C over ${e6(hw.totalDurationMin)} minutes. The plain mean of the two readings is ${e6((HEAT_WBGT_HOUR[0].wbgtC + HEAT_WBGT_HOUR[1].wbgtC) / 2)} C (derived), which weights a 20 minute rest the same as a 40 minute work period.`);
const gw = GOLD.cases.find((c) => c.id === 'wbgt-twa-work-rest');
w(`The golden's own case: ${gw.args[0].map((p) => `${e6(p.wbgtC)} C for ${e6(p.durationMin)} min`).join(' and ')} gives ${e6(E.wbgtTwaC(...gw.args).wbgtTwaC)} C.`);
w();
const tz = refusal('an empty hour', E.wbgtTwaC([{ wbgtC: 30, durationMin: 0 }]), 'periods');
w(`A record of zero minutes is refused: "${tz.error}"`);
w();

/* ------------------------------------------------------------ SECTION 17 */

w(sec(17, 'Metabolic rate, and the NIOSH 2016 RAL and REL equations', ['advanced', 'm02']));
w();
w('THESE ARE THE NIOSH 2016-106 SECTION 8.1 EQUATIONS, CHECKED FOR TRANSCRIPTION ONLY (section 2 and section 18). RAL, for unacclimatized workers: 59.9 - 14.1 log10 M. REL, for acclimatized workers: 56.7 - 11.5 log10 M. M is the one-hour time weighted metabolic rate in watts and the result is in degrees C WBGT. Every figure below is the equation evaluated by the engine, and no figure below is graded in this course.');
w();
const hm = success('the work and rest hour, metabolic', E.metabolicRateTwaW(HEAT_MET_HOUR));
w(`THE ONE-HOUR METABOLIC AVERAGE of the teaching hour: ${HEAT_MET_HOUR.map((p) => `${e6(p.metabolicRateW)} W for ${e6(p.durationMin)} min`).join(' and ')} gives ${e6(hm.metabolicRateTwaW)} W.`);
w();
w('| M, W | RAL equation, C WBGT | REL equation, C WBGT | REL minus RAL, C | outside the 116 to 580 W figure range |');
w('| --- | --- | --- | --- | --- |');
MET_SWEEP.forEach((M) => {
  const ral = success(`RAL at ${M}`, E.nioshRecommendedAlertLimitC(M));
  const rel = success(`REL at ${M}`, E.nioshRecommendedExposureLimitC(M));
  w(`| ${e6(M)} | ${e6(ral.limitWbgtC)} | ${e6(rel.limitWbgtC)} | ${e6(rel.limitWbgtC - ral.limitWbgtC)} | ${ral.warnings.length ? 'yes, warned' : 'no'} |`);
});
w();
w(`THE FIGURE RANGE. \`NIOSH_HEAT_FIGURE_RANGE_W\` is ${E.NIOSH_HEAT_FIGURE_RANGE_W.map(e6).join(' to ')} W. Outside it the equation is still evaluated and the engine warns:`);
w(`> ${E.nioshRecommendedExposureLimitC(600).warnings[0]}`);
w();
w('THE TEACHING HOUR ASSESSED BOTH WAYS. Acclimatisation is an input the engine cannot infer:');
w();
w('| acclimatized | criterion | time weighted WBGT, C | time weighted M, W | limit by the equation, C | margin, C | exceeds |');
w('| --- | --- | --- | --- | --- | --- | --- |');
[true, false].forEach((acc) => {
  const r = success(`teaching assessment acclimatized ${acc}`, E.nioshHeatAssessment({ acclimatized: acc, wbgtPeriods: HEAT_WBGT_HOUR, metabolicPeriods: HEAT_MET_HOUR }));
  w(`| ${acc} | ${r.criterion} | ${e6(r.wbgtTwaC)} | ${e6(r.metabolicRateTwaW)} | ${e6(r.limitWbgtC)} | ${e6(r.marginC)} | ${r.exceeds} |`);
});
w();
w('THE SIXTY-MINUTE RULE (judgement J9). Both sets of periods must total 60 minutes, and acclimatized must be a boolean:');
[
  ['a 45 minute WBGT record', { acclimatized: true, wbgtPeriods: [{ wbgtC: 30, durationMin: 45 }], metabolicPeriods: HEAT_MET_HOUR }, 'wbgtPeriods'],
  ['a 75 minute metabolic record', { acclimatized: true, wbgtPeriods: HEAT_WBGT_HOUR, metabolicPeriods: [{ metabolicRateW: 300, durationMin: 75 }] }, 'metabolicPeriods'],
  ['acclimatized given as a word', { acclimatized: 'yes', wbgtPeriods: HEAT_WBGT_HOUR, metabolicPeriods: HEAT_MET_HOUR }, 'acclimatized'],
].forEach(([label, args, field]) => {
  const r = refusal(label, E.nioshHeatAssessment(args), field);
  w(`- ${label} refuses on \`${r.field}\`: "${r.error}"`);
});
w();

/* ------------------------------------------------------------ SECTION 18 */

w(sec(18, 'The worked example that disagrees, and band summaries that are not the equation', ['advanced', 'm03']));
w();
const exRel = GOLD.errata.find((c) => c.id === 'niosh-heat-example-rel');
const exRal = GOLD.errata.find((c) => c.id === 'niosh-heat-example-ral');
[exRel, exRal].forEach((c) => {
  const r = success(`heat example ${c.id}`, E[c.fn](...c.args));
  const got = at(r, c.key);
  must(`${c.id}: the engine stays outside the printed tolerance`, Math.abs(got - c.printed) > c.tolerance, `${got} vs ${c.printed}`);
  w(`- ${c.id}: at ${e6(c.args[0])} W the equation gives ${e6(got)} C; the document prints ${e6(c.printed)} C, read off its figure. Difference ${e6(c.printed - got)} C, against a printed tolerance of ${e6(c.tolerance)} C. The golden's note: "${c.why}".`);
});
w();
w('WHAT THIS MEANS. NIOSH 2016-106 publishes the equation in section 8.1 and a worked example in section 1.1.3, and the example was read off Figure 8-1 or 8-2 rather than computed from the equation. The two do not agree. A learner who reads the figure and a learner who evaluates the equation get different answers, and both did what the document shows. That is one of the two reasons no heat limit is graded in this course; the other is that no public printed value reproduces the equation constants at all.');
w();
w('BAND SUMMARIES. NIOSH 2016 Table 5-1 summarises the limits in bands (30, 28, 26 and 25 C). They are band summaries: the equation at the band rates gives the values below, and the golden does not gate the table.');
w();
w('| M, W | REL equation, C | band value printed, C | band minus equation, C |');
w('| --- | --- | --- | --- |');
[[233, 30], [349, 28], [465, 26], [580, 25]].forEach(([M, band]) => {
  const r = E.nioshRecommendedExposureLimitC(M).limitWbgtC;
  w(`| ${e6(M)} | ${e6(r)} | ${e6(band)} | ${e6(band - r)} |`);
});
w();

/* ------------------------------------------------------------ SECTION 19 */

w(sec(19, 'Published errata: printed values the source\'s own formula refutes', ['advanced', 'm04']));
w();
w(`The vendored golden pins ${GOLD.errata.length} errata. For each, the engine must stay OUTSIDE the printed tolerance, so an engine that matched the typo would turn the suite red. Each row is a fresh engine call.`);
w();
w('| golden id | door | argument | printed | engine | engine minus printed | printed tolerance | tolerances away |');
w('| --- | --- | --- | --- | --- | --- | --- | --- |');
GOLD.errata.forEach((c) => {
  const r = success(`erratum ${c.id}`, E[c.fn](...c.args));
  const got = at(r, c.key);
  must(`erratum ${c.id}: engine outside the printed tolerance`, Math.abs(got - c.printed) > c.tolerance, got);
  w(`| ${c.id} | \`${c.fn}\` | ${e6(c.args[0])} | ${e6(c.printed)} | ${e6(got)} | ${e6(got - c.printed)} | ${e6(c.tolerance)} | ${e6(Math.abs(got - c.printed) / c.tolerance)} |`);
});
w();
w('THE NOTES THE GOLDEN CARRIES, verbatim:');
GOLD.errata.forEach((c) => w(`- ${c.id}: ${c.why}`));
w();
const a114 = E.noiseTwaFromDoseDbA(114, 'OSHA_PEL').twaDbA;
const a115 = E.noiseTwaFromDoseDbA(115, 'OSHA_PEL').twaDbA;
const a116 = E.noiseTwaFromDoseDbA(116, 'OSHA_PEL').twaDbA;
w(`A ROW ITS NEIGHBOURS CONTRADICT. Table A-1 prints 115 percent as 91.1 dBA. The engine gives ${e6(a114)}, ${e6(a115)} and ${e6(a116)} dBA at 114, 115 and 116 percent; the table prints the neighbours as 90.9 and 91.1. Two adjacent rows cannot both print 91.1 when the formula climbs ${e6(a116 - a114)} dB across them.`);
w();
w('TRUNCATION AND ROUNDING. NIOSH Table 1-1 truncates at rows 124 and 127 where it rounds elsewhere, so the golden gates that table at one printed unit. HSE Figure 26 prints 6:21 for 6 h 20.97 min and 2:00 for 2 h 0.57 min, so it is gated at one minute. Table G-16a prints 0.063 at 125 dBA for an exact 0.0625. A gate that demands every printed digit of a source that is not consistent with itself will fail on the source.');
w();
w('WHAT AN ERRATUM DOES TO A GATE. Pinning a known typo as a case the engine must MISS turns the typo into a test: an engine edited to agree with the printed value fails. Dropping the row instead would leave the typo invisible and a future edit free to match it.');
w();

/* ------------------------------------------------------------ SECTION 20 */

w(sec(20, 'The extended shift: the OSHA action level and the noise dose over a long shift', ['advanced', 'm05']));
w();
w('THE OSHA TECHNICAL MANUAL EXTENDED-SHIFT ACTION LEVEL: AL = 16.61 log10( 50 / (12.5 h) ) + 90, for a shift of h hours. The PEL is not reduced. Table IV-3 prints the rows for 8, 9, 10, 12 and 16 hours.');
w();
w('| shift, hours | action level, dBA | Table IV-3 printed, dBA |');
w('| --- | --- | --- |');
const iv3 = Object.fromEntries(GOLD.cases.filter((c) => c.id.startsWith('otm-al-table-')).map((c) => [c.args[0], c.published.actionLevelDbA.value]));
SHIFT_SWEEP.forEach((h) => {
  const r = success(`AL for ${h} h`, E.oshaActionLevelForShiftDbA(h));
  if (iv3[h] !== undefined) must(`Table IV-3 ${h} h reproduced`, Math.abs(r.actionLevelDbA - iv3[h]) <= 0.05 + 1e-9, r.actionLevelDbA);
  w(`| ${e6(h)} | ${e6(r.actionLevelDbA)} | ${iv3[h] !== undefined ? e6(iv3[h]) : 'not printed'} |`);
});
w();
const al8 = E.oshaActionLevelForShiftDbA(8).actionLevelDbA;
w(`AT EIGHT HOURS the closed form gives ${e6(al8)} dBA and the printed row is 85: the printed 16.61 is a rounding, and 50 / (12.5 x 8) is 0.5, so the result is 90 - 16.61 log10 2.`);
w();
const ol = success('Olomoro AL', E.noiseDose(OLOMORO, 'OSHA_ACTION_LEVEL'));
const olPel = success('Olomoro PEL', E.noiseDose(OLOMORO, 'OSHA_PEL'));
w('THE OLOMORO TEN-HOUR SHIFT, stated:');
w();
w('| period | level, dBA | hours | action-level contribution, percent |');
w('| --- | --- | --- | --- |');
OLOMORO.forEach((p, i) => w(`| ${i + 1} | ${e6(p.levelDbA)} | ${e6(p.durationH)} | ${cell(ol.contributions[i])} |`));
w();
const olAl = E.oshaActionLevelForShiftDbA(ol.totalDurationH).actionLevelDbA;
w(`Over the whole ${e6(ol.totalDurationH)} hours the action-level noise dose is ${e6(ol.dosePct)} percent, exceeds ${ol.exceedsLimit}; the PEL noise dose is ${e6(olPel.dosePct)} percent. The TWA the action-level dosimeter reports is ${e6(ol.twaDbA)} dBA against a ten-hour action level of ${e6(olAl)} dBA.`);
w(`THE DOSE IS NOT RESCALED TO EIGHT HOURS. The dose sums every period of the shift. Rescaling it by 8 over ${e6(ol.totalDurationH)} would give ${e6(ol.dosePct * 8 / ol.totalDurationH)} percent (derived), which is not the quantity 1910.95 Appendix A defines.`);
must('Olomoro: the TWA against the ten-hour AL agrees with the dose against 50', (ol.twaDbA > olAl) === (ol.dosePct > 50), `${ol.twaDbA} ${olAl} ${ol.dosePct}`);
w(`AND THE TWO TESTS AGREE. Comparing the reported TWA with the ${e6(ol.totalDurationH)} hour action level gives the same verdict as comparing the noise dose with 50 percent, because both restate the same sum; the engine's closed form is the level that, held for the whole shift, gives exactly 50 percent.`);
w();

/* ------------------------------------------------------------ SECTION 21 */

w(sec(21, 'Brief and Scala: the daily and weekly reduction factors, and which governs', ['advanced', 'm05']));
w();
w('DAILY RF = (8/h) x (24 - h)/16. WEEKLY RF = (40/h) x (168 - h)/128. Each lowers a limit and never raises one: the engine caps the factor at 1 and keeps the raw value (judgement J8). When both schedules are given, the SMALLER factor governs.');
w();
w('| shift, hours | raw daily factor | daily factor | adjusted limit for a limit of 100 |');
w('| --- | --- | --- | --- |');
SHIFT_SWEEP.forEach((h) => {
  const r = success(`BS daily ${h}`, E.briefScalaDailyRf(h));
  w(`| ${e6(h)} | ${e6(r.rawRf)} | ${e6(r.rf)} | ${e6(100 * r.rf)} |`);
});
w();
const bc = GOLD.cases.filter((c) => c.fn === 'briefScalaDailyRf' && c.basis === 'published');
w(`THE BC OCCUPATIONAL HEALTH AND SAFETY REGULATION FACTORS, reproduced (${bc.length} rows): ${bc.map((c) => `${e6(c.args[0])} h prints ${e6(c.published.rf.value)}, engine ${e6(E.briefScalaDailyRf(c.args[0]).rf)}`).join('; ')}.`);
bc.forEach((c) => must(`BC ${c.args[0]} h reproduced`, Math.abs(E.briefScalaDailyRf(c.args[0]).rf - c.published.rf.value) <= c.published.rf.tolerance, c.args[0]));
w();
w('| week, hours | raw weekly factor | weekly factor |');
w('| --- | --- | --- |');
WEEK_HOURS_SWEEP.forEach((h) => {
  const r = success(`BS weekly ${h}`, E.briefScalaWeeklyRf(h));
  w(`| ${e6(h)} | ${e6(r.rawRf)} | ${e6(r.rf)} |`);
});
w();
w('WHICH GOVERNS, for a limit of 100:');
w();
w('| shift, hours | week, hours | daily factor | weekly factor | governing | adjusted limit |');
w('| --- | --- | --- | --- | --- | --- |');
BS_PAIRS.forEach(([h, wk]) => {
  const r = success(`BS pair ${h} ${wk}`, E.briefScalaAdjustedLimit({ limit: 100, shiftHours: h, weeklyHours: wk }));
  w(`| ${e6(h)} | ${e6(wk)} | ${e6(r.factors[0].rf)} | ${e6(r.factors[1].rf)} | ${r.governingBasis} | ${e6(r.adjustedLimit)} |`);
});
w();
const esta = GOLD.cases.find((c) => c.id === 'esta-glycol-12h');
const estaR = success('ESTA example', E.briefScalaAdjustedLimit(...esta.args));
w(`THE ESTA 12-HOUR EXAMPLE, reproduced: a limit of ${e6(esta.args[0].limit)} on ${e6(esta.args[0].shiftHours)} hour shifts and ${e6(esta.args[0].weeklyHours)} hours a week adjusts to ${e6(estaR.adjustedLimit)}, the ${estaR.governingBasis} factor governing.`);
w();
w('THE WEEKLY FACTOR IS ORACLE ONLY (section 2). No value a source prints reproduces it. Where the daily factor governs by a clear margin, the weekly formula only decides which factor is used and does not enter the adjusted limit.');
w();

/* ------------------------------------------------------------ SECTION 22 */

w(sec(22, 'From exposures to a sampling decision', ['advanced', 'm06']));
w();
w('ONE TEACHING CREW, three hazards, on 10-hour shifts, 5 a week. Every figure is a call above re-made for this crew.');
w();
const crewNoise = success('crew noise', E.noiseDose(OLOMORO, 'OSHA_ACTION_LEVEL'));
const crewAdj = MIXTURE.map(({ name, concentration, limit }) => {
  const a = success(`crew adjusted ${name}`, E.briefScalaAdjustedLimit({ limit, shiftHours: 10, weeklyHours: 50 }));
  return { name, concentration, limit, adjusted: a.adjustedLimit, basis: a.governingBasis };
});
const crewMixRaw = E.mixtureExposureIndex(MIXTURE.map(({ concentration, limit }) => ({ concentration, limit })));
const crewMixAdj = success('crew adjusted mixture', E.mixtureExposureIndex(crewAdj.map(({ concentration, adjusted }) => ({ concentration, limit: adjusted }))));
const crewHeat = success('crew heat', E.nioshHeatAssessment({ acclimatized: true, wbgtPeriods: HEAT_WBGT_HOUR, metabolicPeriods: HEAT_MET_HOUR }));
w('| hazard | quantity | value | against | read as |');
w('| --- | --- | --- | --- | --- |');
w(`| noise | action-level noise dose over the shift, percent | ${e6(crewNoise.dosePct)} | 50 | exceeds ${crewNoise.exceedsLimit} |`);
crewAdj.forEach((c) => w(`| chemical | ${c.name} limit adjusted for 10 h and 50 h a week, ppm | ${e6(c.adjusted)} | ${e6(c.limit)} unadjusted | ${c.basis} factor governs |`));
w(`| chemical | mixture index, unadjusted limits | ${e6(crewMixRaw.index)} | 1 | exceeds ${crewMixRaw.exceeds} |`);
w(`| chemical | mixture index, adjusted limits | ${e6(crewMixAdj.index)} | 1 | exceeds ${crewMixAdj.exceeds} |`);
w(`| heat stress | one-hour time weighted WBGT, C | ${e6(crewHeat.wbgtTwaC)} | the REL equation at ${e6(crewHeat.metabolicRateTwaW)} W, ${e6(crewHeat.limitWbgtC)} | an input to the transcription-only equation |`);
w();
w('WHAT THE TABLE SUPPORTS AND WHAT IT DOES NOT.');
w('- The noise row and the chemical rows stand on formulas a source prints and the engine reproduces.');
w('- The adjusted mixture index applies each limit\'s own reduction factor and then adds. The adjustment and the index are each published; composing them is a judgement the hygienist makes and must state.');
w('- The heat row compares a measured average with an equation checked for transcription only, which is a screening argument and should be reported as one.');
w();
w('WHAT TO MEASURE NEXT is decided by which row is least certain and nearest its line. A record that covers under 8 hours, a STEL window that is short, a noise dose read under the wrong criterion, or a WBGT built from a form that does not match the site are each a reason to sample again before a control is chosen.');
w();

/* ------------------------------------------------------------ SECTION 23 */

w(sec(23, 'What this course never grades, and why', ['beginner', 'm06', 'l03'], ['intermediate', 'm06', 'l03'], ['advanced', 'm03']));
w();
w('THE HEAT DECISION. No graded field passes through the NIOSH RAL or REL equation, a margin against one, an exceedance verdict, or a WBGT built from thermometer readings. The two graded heat fields are one-hour time weighted averages of readings the capstone STATES.');
w('- WHY: the equation constants and the WBGT weights are checked for transcription only (section 2); planting the same error in the engine and the oracle leaves the suite green; and NIOSH\'s own worked example disagrees with its own equation (section 18), so a learner who follows the document\'s figure would be marked wrong.');
w('- WHAT IS TAUGHT INSTEAD: the equations as published, evaluated by the engine, with "the NIOSH 2016-106 section 8.1 equation, transcription only" beside every figure.');
w();
w('THE OTHER ITEMS NEVER GRADED:');
w('1. the NIOSH protector derating by type (oracle only)');
w('2. the OSHA dual-protection 5 dB (oracle only)');
w('3. the Brief and Scala weekly factor on its own (oracle only)');
w('4. any verdict word: exceeds, passes, at or above an action value');
w('5. any ACGIH TLV or other licensed limit, which is never quoted');
w();
w('THE JUDGEMENT CALLS ARE TAUGHT BY NAME AND NEVER TESTED AT THEIR BOUNDARY. No capstone input sits on a threshold (J2), reaches the protector floor (J5), leaves unsampled time undeclared (J6), lands exactly on unity (J7), reaches the reduction-factor cap (J8) or puts a number of days other than five into a weekly LEX (J10).');
w();

/* ------------------------------------------------------------ SECTION 24 */

w(sec(24, 'Vocabulary collisions, legislated before any lesson is written (binding on every writer and reviewer)', ['beginner', 'm01'], ['intermediate', 'm01'], ['advanced', 'm01']));
w();
w('1. "dose" already means an inhibitor or methanol dose in the Flow Assurance and Gas Processing courses. Here it is a percentage of a daily noise allowance. RULE: write "noise dose" on first use in every lesson and every bank question, and never bare "dose" in a prompt, an option or a heading.');
w('2. "exposure" already means a financial or cost exposure in the Field Development Planning, Uncertainty and Well Cost courses. RULE: always qualify it: noise exposure, chemical exposure, heat exposure.');
w('3. "noise" already means scatter in data in the Decline Curve Analysis, Well Test and Seismolord courses. Here it is sound. RULE: say "sound level" for a reading and "noise exposure" for a dose.');
w('4. "exchange rate" already means a currency rate in the Economics courses. RULE: always "decibel exchange rate" or "an exchange rate of 5 dB".');
w('5. "heat" already means a heat duty in the Heat Transfer course and flare radiation in the Separation and Relief courses. RULE: always "heat stress" for this course\'s subject.');
w();
w('AND TWO MISREADINGS ON THE SAME FOOTING. "REL" is the NIOSH recommended exposure limit for noise in the Associate tier and the NIOSH recommended exposure limit for heat in the Expert tier: always write "NIOSH noise REL" or "NIOSH heat REL". "Action level" is the OSHA hearing-conservation trigger; the EU uses "action values", which are LEX,8h levels and a different metric.');
w();

/* ------------------------------------------------------------ SECTION 25 */

w(sec(25, 'Scope seams, units, and licensed material (binding on every writer)', ['beginner', 'm06'], ['intermediate', 'm06'], ['advanced', 'm06']));
w();
w('CITE, DO NOT TEACH:');
w('- Flare and pool-fire thermal radiation, in kW/m2, is owned by the Separation and Relief courses. It is a radiant flux on a surface, and heat stress here is a WBGT index and a body\'s metabolic load.');
w('- BTEX as an emission from a glycol unit is owned by the Gas Processing course. A personal air sample and an 8-hour TWA are a different measurement of a different quantity.');
w('- Incident and injury rates are owned by the Safety Performance Statistics course (safetystats), the first course of this module.');
w('- The 5x5 risk matrix is owned by the Risk, Change and Learning course.');
w();
w('UNITS. Levels in dBA (A-weighted) unless a row says dBC. Durations in hours for noise dose, LEX and the 8-hour TWA, and in minutes for the STEL and the heat averages. Concentrations in whatever unit the caller types, the same for C and L; this course uses ppm. Metabolic rates in watts only: the engine takes no kcal/h input.');
w();
w('LICENSED MATERIAL IS NEVER QUOTED. ACGIH TLVs, ISO 9612 and ISO 7243 text are licensed. The engine embeds no limit table, and every limit in this course is typed as an input from a public OSHA or NIOSH value.');
w();

/* --------------------------------------------------------- THE ASSERTIONS */

const failed = ASSERTS.filter((a) => !a.pass);
process.stderr.write(`h2_dump: ${ASSERTS.length} label-and-call, measurement and pin assertions run, ${failed.length} failed, ${PINS.length} constants pinned\n`);
if (ASSERTS.length < 400) { process.stderr.write(`REFUSED: only ${ASSERTS.length} assertions ran\n`); process.exit(2); }
if (PINS.length < 30) { process.stderr.write(`REFUSED: only ${PINS.length} constants pinned\n`); process.exit(2); }
if (failed.length) {
  failed.slice(0, 40).forEach((a) => process.stderr.write(`  FAILED  ${a.claim}\n          ${a.detail}\n`));
  process.stderr.write('NOTHING WRITTEN.\n');
  process.exit(1);
}
process.stdout.write(`${out.join('\n')}\n`);
