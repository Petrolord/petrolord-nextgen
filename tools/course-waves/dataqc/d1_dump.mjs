// THE D1 TEACHING DIGEST. This is the ONLY teaching truth for every writer
// after this file: the lesson author, the bank author, the key-truth author and
// the panel author all quote from digest.txt and from nothing else.
//
// THE ENGINE'S FINDINGS RECORD IS NOT TEACHING TRUTH. FINDINGS-quality.md, the
// oracle, the library pins and the engine's own source comments are
// PROVENANCE. Where a figure in FINDINGS is teachable (the NIST worked examples
// and their printed-figure errata) this file recomputes it through the engine
// and prints it, and a writer quotes the digest line.
//
// Usage:  sh /root/dai-wip-dataqc/build_digest.sh > digest.tmp \
//           && mv digest.tmp /root/dai-wip-dataqc/digest.txt
// Build THROUGH A TEMP FILE. A gate that reads a half written digest finds no
// literals and clears everything.
//
// EVERY NUMBER PRINTED HERE IS A RETURN VALUE OF THE ENGINE, except where a
// line says "golden" (read from the vendored case file), "stated" (an input
// named on the same row or in the dataset generator) or "derived" (arithmetic
// on engine values printed in the same block, with the arithmetic stated).
// Nothing here reads a clock, a random number, a locale or a network; the
// dataset comes from d1_fields.mjs through the canonical seeded mulberry32, and
// TZ and LC_ALL are pinned by build_digest.sh.
//
// THE DIGEST RULE. A sentence here may NAME a figure this file computes. It may
// NOT characterise the RELATIONSHIP between two figures unless that
// relationship is itself computed and printed on the same page, and asserted.
//
// EVERY LABEL IS ASSERTED AGAINST WHAT THE CALL ACTUALLY DID. `refusal()`
// asserts an error key and the field it names; `success()` asserts no error
// key and every top-level number finite; every claim a sentence makes about a
// table goes through `must()`. If one assertion fails NOTHING IS WRITTEN.
//
// THE DIGEST IS NOT THE CAPSTONE. This file never reads d1_capstone.mjs,
// fields.json or the capstone datasets, and the capstone never reads this.
//
// THIS COURSE TEACHES NO REPAIR HISTORY, so no section of this digest describes
// former behaviour. The NIST errata are errata in a published source.
import fs from 'node:fs';
import process from 'node:process';
import { execFileSync } from 'node:child_process';
import * as T from './d1_fields.mjs';

const HERE = process.env.D1_WAVE_DIR || '/root/dai-wip-dataqc';
const ROOT = process.env.D1_ENGINES || '/root/wt-dai-d1-nextgen/packages/engines';
const ENGINE_REL = 'engines/dataai/quality.js';
const Q = await import(`${ROOT}/${ENGINE_REL}`);
const ST = await import(`${ROOT}/lib/stats/stats.js`);
const ENGINE_SRC = fs.readFileSync(`${ROOT}/${ENGINE_REL}`, 'utf8');
const GOLD = JSON.parse(fs.readFileSync(`${ROOT}/test-data/dataai/goldens/quality_cases.json`, 'utf8'));
const CASES = GOLD.cases;
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
    const bad = Object.entries(r).filter(([, v]) => typeof v === 'number' && Number.isNaN(v));
    must(`SUCCESS CARRIES NO NaN: ${label}`, bad.length === 0,
      bad.map(([k, v]) => `${k}=${v}`).join(', ') || 'no NaN');
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
const golden = (id) => {
  const c = CASES.find((x) => x.id === id);
  if (!must(`the golden case ${id} exists`, !!c, id)) return { args: {}, expected: {}, published: [] };
  return c;
};
const f6 = (x) => (x === null || x === undefined ? String(x) : Number(x).toFixed(6));
const num = (x) => (x === null || x === undefined ? 'null' : (Number.isInteger(x) ? String(x) : f6(x)));
const rel = (a, b) => (b === 0 ? Math.abs(a) : Math.abs(a - b) / Math.abs(b));
const relE = (a, b) => { const r = rel(a, b); return r === 0 ? '0' : r.toExponential(2); };
const idxs = (flags) => flags.map((f) => f.index);
const list = (a) => a.join(', ');

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
const ORDER = ['computes', 'dataset', 'missing', 'refusals', 'completeness', 'coverage', 'range', 'units', 'rates',
  'index', 'cumulative', 'watercut', 'phasesum', 'frozen', 'identifiers', 'endtoend',
  'zscore', 'modz', 'quantiles', 'fences', 'hampel', 'grubbs', 'mahalanobis', 'outlierreport',
  'individuals', 'ewma', 'cusum', 'whichchart', 'scorecard', 'policy', 'errata', 'vocabulary'];
const ref = (key) => {
  const i = ORDER.indexOf(key);
  must(`a sentence refers to a declared section ${key}`, i >= 0, key);
  return `section ${i + 1}`;
};
const Ref = (key) => ref(key).replace(/^s/, 'S');
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
const PLANT_FOUND = new Map();
const planted = (i, cond, detail) => {
  const p = T.PLANTED[i];
  must(`PLANTED DEFECT FOUND: ${p[0]} ${p[1]} ${p[2]} by ${p[4]}`, cond, detail);
  PLANT_FOUND.set(i, !!cond);
};

/* ---------------------------------------------------------- the dataset */

const LOG = T.EKENE_LOG;
const CH = LOG.channels;
const PROD = T.EKENE_PROD;
const day = (i) => i + 1;
const SENTINEL = -999.25; // the LAS null value the generator leaves in the gamma ray, stated
const GR_CLEAN = CH.GR.values.map((v) => (v === SENTINEL ? null : v));
const K = Q.CONSTANTS;
const S = (x) => String(x);
// Stated teaching inputs, each passed to the engine AND printed from here, so
// the prose cannot drift from the call.
const CUM_TOL = 8000;
const WC_TOL = 1e-4;
const PS_REL_WIDE = 0.01;
const PS_ABS = 50;
const DRIFT_TOL = 0.15;
const SPLICE_STEP = 0.5;
const SPLICE_TOL = 0.6;
const UPLOG = [8410, 8409.5, 8409, 8408.5, 8408];
const MAD0 = [5, 5, 5, 6, 7];
const THIN = [2.3, null, null, 2.9, null, null, 2.31];
const TIE = [['validity', 0.9], ['completeness', 0.9], ['consistency', 0.95]];
const ZPOP_THR = 2.9;
const LAMBDA = 0.2;
const LM = 3;
const K_S = 0.5;
const H_S = 4;
const NIST_ALPHA = 0.0027; // the printed design inputs of the CUSUM page
const NIST_BETA = 0.01;
const COV_START = 8400;
const COV_END = 8515;
const WSAND = [130, 199]; // the water sand, asserted against LITH_RANGES below
const OSAND = [40, 99];
const DAY10 = 9;
const eTxt = (x) => x.toExponential(0);

/* ================================================================ HEADER */

const engineLines = ENGINE_SRC.replace(/\n$/, '').split('\n').length;
const refusalsInGolden = CASES.filter((c) => c.expected && c.expected.error === true).length;
const publishedInGolden = CASES.filter((c) => c.source === 'published').length;
w('# D1 TEACHING DIGEST: Oilfield Data Quality');
w();
w('# THIS FILE IS THE ONLY TEACHING TRUTH FOR THIS COURSE. Every number in every lesson, bank question, key truth and panel comes from a line below. The engine FINDINGS record, the oracle, the library pins and the engine source comments are PROVENANCE and not teaching truth.');
w();
w('# PRECISION. Every measured value, statistic, limit, fraction, score, step and difference prints to SIX decimals; counts, entry numbers and days are whole numbers; relative differences print in exponent form.');
w();
w(`# ENGINE. ${ENGINE_REL}, vendored sha-identical with petrolord-engines a4e9592, ${engineLines} lines. It imports lib/stats (mean, median, standard deviations), engines/petrophysics/conditioning.js (despikeHampel), engines/hse/safetyStats.js (chiSquareQuantile, logGamma) and lib/linalg/solveDense.js. The vendored golden test-data/dataai/goldens/quality_cases.json carries ${CASES.length} cases, ${refusalsInGolden} of them refusals and ${publishedInGolden} of them NIST/SEMATECH published anchors, written by the standard library oracle.`);
w();
w('# WHAT IS NEVER IN THIS FILE. No capstone field, no capstone well, no capstone series and no graded answer. The capstones run their own datasets and the digest never names them.');
w();
w('# THIS COURSE TEACHES NO REPAIR HISTORY. Every section below describes what the engine does today.');

/* ============================================================ SECTION 1 */

section('computes', 'What this engine computes, and what it declines to compute', ['Associate m01', 'Expert m06']);
w('Every function takes plain arrays and objects and returns either a result object or an object with `error` and `field`, where `field` names the input it refused. Every flag carries the `rule` that fired and a `reason` sentence, and every result carries a `basis` block naming its convention.');
w();
const EXPORTS = [
  ['completeness', 'completeness', 'values', 'present over n, and one flag per run of missing values'],
  ['coverage', 'completeness', 'index, values, start, end, maxStep', 'the fraction of an interval spanned by steps no longer than maxStep'],
  ['rangeCheck', 'validity', 'values, a channel and unit or min and max', 'values outside a definitional or a supplied limit'],
  ['indexCheck', 'validity', 'index, direction, expectedStep, stepTolerance', 'missing entries, duplicates, reversals and irregular steps'],
  ['rateCheck', 'validity', 'rates, hoursOn, status', 'a negative rate, and a positive rate while shut in'],
  ['cumulativeCheck', 'consistency', 'cumulative, tolerance', 'a cumulative that falls'],
  ['waterCutCheck', 'consistency', 'waterCut, oil, water, tolerance', 'a water cut outside [0, 1] or unequal to water over liquid'],
  ['phaseSumCheck', 'consistency', 'parts, total, relTolerance, absTolerance', 'parts that do not add to their total'],
  ['frozenRuns', 'consistency', 'values, minRun, tolerance', 'runs of a stuck value'],
  ['duplicateIdentifiers', 'uniqueness', 'ids, maxDistance, digitsMustMatch', 'exact, normalised and near duplicate names'],
  ['zScores', 'plausibility', 'values, threshold, sd', 'z-scores and the largest z the sample size allows'],
  ['modifiedZScores', 'plausibility', 'values, threshold', 'the median and MAD based modified z-score'],
  ['iqrFences', 'plausibility', 'values, k, method', 'Tukey fences on stated quartiles'],
  ['hampel', 'plausibility', 'values, halfWindow, nSigma', 'a moving-window median test, with replacements'],
  ['grubbsTest', 'plausibility', 'values, alpha, side', 'the Grubbs test for one outlier'],
  ['mahalanobis', 'plausibility', 'rows, alpha', 'squared distances from the centre against a chi-square cutoff'],
  ['individualsChart', 'monitoring', 'values, centre, mrBar', 'a Shewhart individuals chart and its moving range chart'],
  ['ewmaChart', 'monitoring', 'values, lambda, target, sigma, L, limits', 'an EWMA chart'],
  ['cusumChart', 'monitoring', 'values, target, k, h, units, sigma', 'a tabular CUSUM'],
  ['scorecard', 'scoring', 'dimensions, weights', 'a weighted score per dimension and the weakest dimension'],
];
EXPORTS.forEach(([name]) => must(`${name} is exported`, typeof Q[name] === 'function', typeof Q[name]));
table(['function', 'dimension or role', 'what it needs', 'what it returns'], EXPORTS.map(([n, d, a, r]) => [`\`${n}\``, d, a, r]));
w();
w('Helpers exported beside them: `levenshtein`, `normalizeIdentifier`, `sampleQuantile`, `regularizedBeta` and `studentTUpperQuantile`.');
w();
w('The dimension names the engine exports in `DIMENSIONS`, in display order:');
w();
table(['order', 'dimension'], Q.DIMENSIONS.map((d, i) => [String(i + 1), d]));
must('DIMENSIONS carries five names', Q.DIMENSIONS.length === 5, Q.DIMENSIONS.join(','));
w();
w('The published constants, read from the exported `CONSTANTS`:');
w();
const CSRC = {
  MODIFIED_Z_SCALE: 'Iglewicz and Hoaglin (1993), as NIST/SEMATECH 1.3.5.17 prints it',
  MODIFIED_Z_THRESHOLD: 'the same source: a modified z beyond it is labelled a potential outlier',
  HAMPEL_MAD_SCALE: 'the petrophysics conditioning engine, despikeHampel',
  D2_N2: 'NIST/SEMATECH 6.3.2.2, d2 for a moving range of two',
  D4_N2: 'NIST/SEMATECH 6.3.2.1 table, D4 for a moving range of two',
  TUKEY_K: 'the Tukey inner fence multiplier',
};
table(['constant', 'value', 'source'], Object.entries(Q.CONSTANTS).map(([k, v]) => [`\`${k}\``, f6(v), CSRC[k]]));
must('CONSTANTS carries six constants, each with a source here', Object.keys(Q.CONSTANTS).length === 6 && Object.keys(Q.CONSTANTS).every((k) => CSRC[k]), Object.keys(Q.CONSTANTS));
must('CONSTANTS is frozen', Object.isFrozen(Q.CONSTANTS), 'frozen');
w();
w('WHAT THE ENGINE DOES NOT DO, checked here against its exports:');
must('no export repairs, fills or deletes data', !Object.keys(Q).some((k) => /repair|fill|impute|delete|drop|fix/i.test(k)), Object.keys(Q).join(','));
must('no export carries a grade band', !Object.keys(Q).some((k) => /grade|band|rating/i.test(k)), 'no grade');
must('no export converts units', !Object.keys(Q).some((k) => /convert|unit/i.test(k)), 'no conversion');
w('- It does not fill, repair or delete a value. `hampel` returns a `cleaned` series beside its flags, and choosing to use it is the caller\'s decision.');
w('- It does not convert units. A value in an unlisted unit is refused by name.');
w('- It carries no plausibility range for any basin or tool, and no grade band for a score.');
w('- It does not decide whether a flagged value is wrong. A flag is a rule that fired, with its reason.');
w(`- Its exported names are, in full: ${Object.keys(Q).sort().join(', ')}.`);
w();
const sampleFlag = Q.rateCheck({ rates: [120, -3] }).flags[0];
w('One flag, exactly as the engine returns it (a negative rate, entry 1 of a two-entry series):');
w();
table(['key', 'value'], Object.entries(sampleFlag).map(([k, v]) => [`\`${k}\``, typeof v === 'number' ? num(v) : String(v)]));
must('a flag carries index, rule and reason', ['index', 'rule', 'reason'].every((k) => k in sampleFlag), Object.keys(sampleFlag));

/* ============================================================ SECTION 2 */

section('dataset', 'The Ekene teaching dataset, its seeds and its planted defects', ['Associate m01', 'Associate m06', 'Expert m05']);
w('Every series in this course comes from one generator, d1_fields.mjs, which draws through the canonical mulberry32 and randomNormal of lib/stats on stated seeds, rounds every value to the decimals a real file carries, and then plants documented defects. The same inputs give the same file anywhere.');
w();
table(['stream', 'seed, stated'], Object.entries(T.SEEDS).map(([k, v]) => [k, String(v)]));
w();
table(['stream', 'what it is', 'entries'], [
  ['EKENE-7 log', `a well log at a ${num(LOG.step)} ft step from ${num(LOG.depth[0])} ft, channels ${Object.keys(CH).join(', ')}`, String(LOG.n)],
  ['EKENE-7 splice', 'the delivered depth index where two logging runs were spliced', String(T.EKENE_SPLICE.index.length)],
  ['EKENE-3 production', 'daily oil, water, gas, gross liquid, reported water cut, hours on, status and cumulative oil', String(PROD.n)],
  ['well names', T.EKENE_IDS.source, String(T.EKENE_IDS.ids.length)],
  ['EKENE-7 core', 'core plug porosity, v/v, and a copy with a second high plug', String(T.EKENE_CORE.porosity.length)],
  ['EKENE-3 gauge', 'ten bottom-hole gauge temperature readings, degF', String(T.EKENE_GAUGE.readings.length)],
  ['EKENE-3 pressure', `flowing wellhead pressure, psig: ${T.EKENE_WHP.history.length} in-control days, then ${T.EKENE_WHP.monitored.length} monitored days`, String(T.EKENE_WHP.history.length + T.EKENE_WHP.monitored.length)],
]);
w();
w(`The EKENE-7 lithology by entry (stated): ${T.LITH_RANGES.map(([l, a, b]) => `${l} ${a} to ${b}`).join(', ')}. Inside a sand the porosity is drawn first and density, neutron and sonic follow it, so density and neutron move against each other there.`);
must('the water and oil sand ranges printed here are the generator\'s', T.LITH_RANGES[3][1] === WSAND[0] && T.LITH_RANGES[3][2] === WSAND[1] && T.LITH_RANGES[1][1] === OSAND[0] && T.LITH_RANGES[1][2] === OSAND[1], 'ranges');
w();
w('THE PLANTED DEFECTS, every one stated by the generator. Each is found by the check named, and the section that finds it asserts so; the build fails if any defect is not found.');
w();
table(['stream', 'channel', 'where', 'what was done', 'the check that finds it'], T.PLANTED.map((p) => [...p]));
w();
w(`${T.PLANTED.length} defects are planted.`);

/* ============================================================ SECTION 3 */

section('missing', 'What missing means, and the sentinel that counts as present', ['Associate m01']);
w(`The engine's missing value is null, undefined or NaN. Plus or minus infinity is refused as invalid. A number such as ${S(SENTINEL)}, the null value a LAS file declares, is a present number until someone converts it.`);
w();
const probe = [
  ['`null`', [1, null, 3]],
  ['`undefined`', [1, undefined, 3]],
  ['`NaN`', [1, NaN, 3]],
  [S(SENTINEL), [1, SENTINEL, 3]],
  ['0', [1, 0, 3]],
];
table(['middle entry', 'missing', 'present', 'completeness'], probe.map(([label, v]) => {
  const r = success(`completeness with ${label}`, Q.completeness({ values: v }));
  return [label, String(r.missing), String(r.present), f6(r.completeness)];
}));
const inf = refusal('completeness with Infinity', Q.completeness({ values: [1, Infinity, 3] }), 'values[1]');
w();
w('Infinity is refused, naming the entry. The engine\'s own words:');
w();
w(`> ${inf.error}`);
w();
const grComp = success('GR completeness with the sentinel', Q.completeness({ values: CH.GR.values }));
const grRange = success('GR range with the sentinel', Q.rangeCheck({ values: CH.GR.values, channel: 'gammaRay', unit: 'gAPI' }));
const grCompClean = success('GR completeness with the sentinel converted', Q.completeness({ values: GR_CLEAN }));
w(`On EKENE-7 the gamma ray carries ${S(SENTINEL)} at entries ${list(CH.GR.values.map((v, i) => (v === SENTINEL ? i : -1)).filter((i) => i >= 0))} (stated). Completeness reads it as present; the definitional range check reads it as a value below the gamma ray minimum.`);
w();
table(['gamma ray, as delivered or converted', 'completeness', 'missing', 'range failures'], [
  [`as delivered, ${S(SENTINEL)} in place`, f6(grComp.completeness), String(grComp.missing), String(grRange.failed)],
  [`with ${S(SENTINEL)} converted to null`, f6(grCompClean.completeness), String(grCompClean.missing), String(success('GR range converted', Q.rangeCheck({ values: GR_CLEAN, channel: 'gammaRay', unit: 'gAPI' })).failed)],
]);
planted(2, grComp.missing === 0 && grRange.failed === 4 && idxs(grRange.flags).join() === '236,237,238,239', idxs(grRange.flags));
w();
w(`The first range flag's reason, verbatim: "${grRange.flags[0].reason}".`);

/* ============================================================ SECTION 4 */

section('refusals', 'Every refusal, with the field it names and the engine\'s own words', ['Associate m01 l05', 'Associate m02', 'Associate m03 l03', 'Professional m02 l05', 'Professional m05', 'Expert m01', 'Expert m02 l02', 'Expert m03 l02', 'Expert m04']);
w('Each row is a real call. The message column is the engine\'s `error` string, verbatim. A refusal carries no number.');
w();
const REFUSALS = [
  ['completeness', { values: [] }, 'values', 'an empty series'],
  ['completeness', { values: [1, Infinity] }, 'values[1]', 'an infinite value'],
  ['coverage', { index: T.EKENE_SPLICE.index, values: T.EKENE_SPLICE.index, start: 8520, end: 8526, maxStep: 0.5 }, 'index[5]', 'the splice index, which steps back'],
  ['rangeCheck', { values: [1], channel: 'sonic', unit: 'us/s' }, 'unit', 'an unlisted unit'],
  ['rangeCheck', { values: [1], channel: 'porosity' }, 'channel', 'an unlisted channel'],
  ['indexCheck', { index: [1] }, 'index', 'a one-entry index'],
  ['rateCheck', { rates: [1, 2], hoursOn: [24] }, 'hoursOn', 'hours shorter than the rates'],
  ['cumulativeCheck', { cumulative: [1], tolerance: -1 }, 'tolerance', 'a negative tolerance'],
  ['waterCutCheck', {}, 'waterCut', 'no water cut and no rates'],
  ['phaseSumCheck', { parts: [1], total: [1] }, 'parts', 'parts given as an array'],
  ['frozenRuns', { values: [1], minRun: 1 }, 'minRun', 'a run of one'],
  ['duplicateIdentifiers', { ids: [] }, 'ids', 'no names'],
  ['zScores', { values: [2, 2, 2] }, 'values', 'no spread'],
  ['modifiedZScores', { values: [5, 5, 5, 6, 7] }, 'values', 'a MAD of zero'],
  ['iqrFences', { values: [1, 2, 3], k: 0 }, 'k', 'a multiplier of zero'],
  ['hampel', { values: [1, 2, 3], halfWindow: 0 }, 'halfWindow', 'a half window of zero'],
  ['grubbsTest', { values: [1, 2, 3, 4], alpha: 5 }, 'alpha', 'alpha as a percentage'],
  ['mahalanobis', { rows: [[1, 2], [2, 4], [3, 7]] }, 'rows', 'too few rows'],
  ['mahalanobis', { rows: [[1, 2], [2, 4], [3, 6], [4, 8], [5, 10]] }, 'rows', 'one variable a multiple of the other'],
  ['individualsChart', { values: [1, null, 2] }, 'values[1]', 'a gap in the series'],
  ['ewmaChart', { values: [1, 2], lambda: 0.2, sigma: 1 }, 'target', 'no target'],
  ['cusumChart', { values: [1, 2], target: 1, k: 0.5, h: 4 }, 'units', 'no units for k and h'],
  ['scorecard', { dimensions: [{ name: 'completeness', score: 0.9 }, { name: 'validity', score: 0.8 }], weights: { completeness: 1 } }, 'weights.validity', 'a weight missing'],
];
table(['function', 'what was passed', 'field named', 'the engine\'s message'], REFUSALS.map(([fn, args, field, what]) => {
  const r = refusal(`${fn} with ${what}`, Q[fn](args), field);
  return [`\`${fn}\``, what, `\`${r.field}\``, r.error];
}));
w();
w(`${REFUSALS.length} refusals are tabled above, across ${new Set(REFUSALS.map((r) => r[0])).size} functions.`);
must('every public check appears in the refusal table', EXPORTS.every(([n]) => REFUSALS.some((r) => r[0] === n)), 'all twenty');

/* ============================================================ SECTION 5 */

section('completeness', 'Completeness, the missing fraction and gap runs', ['Associate m02']);
w('Completeness is present over n. A gap run is a maximal stretch of consecutive missing values, and each run is one flag.');
w();
const compRows = Object.entries(CH).map(([name, c]) => {
  const r = success(`completeness ${name}`, Q.completeness({ values: c.values }));
  return { name, r };
});
table(['EKENE-7 channel', 'n', 'missing', 'present', 'missing fraction, `nullFraction`', 'completeness', 'gap runs (start, length)', 'longest gap'], compRows.map(({ name, r }) => [
  name, String(r.n), String(r.missing), String(r.present), f6(r.nullFraction), f6(r.completeness),
  r.gapRuns.length ? r.gapRuns.map((g) => `${g.start}, ${g.length}`).join('; ') : 'none', String(r.longestGap)]));
const rhobC = compRows.find((x) => x.name === 'RHOB').r;
const nphiC = compRows.find((x) => x.name === 'NPHI').r;
planted(0, rhobC.gapRuns.length === 1 && rhobC.gapRuns[0].start === 80 && rhobC.gapRuns[0].length === 12, JSON.stringify(rhobC.gapRuns));
planted(1, nphiC.gapRuns.length === 3 && nphiC.gapRuns.every((g) => g.length === 1), JSON.stringify(nphiC.gapRuns));
w();
w(`The density flag's reason, verbatim: "${rhobC.flags[0].reason}". A neutron flag's reason: "${nphiC.flags[0].reason}".`);
w();
const oilC = success('completeness oil', Q.completeness({ values: PROD.oil }));
w('EKENE-3, the production sheet:');
w();
table(['EKENE-3 column', 'n', 'missing', 'completeness', 'gap runs (first day, length)'], ['oil', 'water', 'gas', 'gross', 'waterCut', 'cumOil'].map((k) => {
  const r = success(`completeness ${k}`, Q.completeness({ values: PROD[k] }));
  return [k, String(r.n), String(r.missing), f6(r.completeness), r.gapRuns.length ? r.gapRuns.map((g) => `day ${day(g.start)}, ${g.length}`).join('; ') : 'none'];
}));
planted(10, oilC.gapRuns.length === 1 && oilC.gapRuns[0].start === 30 && oilC.gapRuns[0].length === 3, JSON.stringify(oilC.gapRuns));
w();
must('RHOB and NPHI differ in completeness and in run count', rhobC.completeness !== nphiC.completeness && rhobC.gapRuns.length !== nphiC.gapRuns.length, 'differ');
w(`RHOB loses ${rhobC.missing} samples in ${rhobC.gapRuns.length} run and NPHI ${nphiC.missing} in ${nphiC.gapRuns.length} runs. Completeness counts samples; the gap runs say how they were lost. A twelve-sample hole in a half-foot log is ${num(rhobC.longestGap * LOG.step)} ft of rock with no density, derived as twelve times the step.`);

/* ============================================================ SECTION 6 */

section('coverage', 'Coverage of an interval, and a step too long', ['Associate m02']);
w('A step between two consecutive PRESENT samples covers the index between them when it is at most `maxStep`, inclusive; a longer step is a hole. The stretch before the first and after the last present sample is uncovered.');
w();
const covStart = COV_START; const covEnd = COV_END;
const covs = [['RHOB', 0.5], ['NPHI', 0.5], ['NPHI', 1.0], ['GR', 0.5], ['GR', 1.0]].map(([ch, ms]) => {
  const vals = ch === 'GR' ? GR_CLEAN : CH[ch].values;
  const r = success(`coverage ${ch} ${ms}`, Q.coverage({ index: LOG.depth, values: vals, start: covStart, end: covEnd, maxStep: ms }));
  return { ch, ms, r };
});
w(`Interval ${num(covStart)} to ${num(covEnd)} ft (stated), on the EKENE-7 depth index; GR with its sentinel converted to null.`);
w();
table(['channel', 'maxStep, ft', 'coverage', 'covered ft', 'holes (from, to)'], covs.map(({ ch, ms, r }) => [ch, f6(ms), f6(r.coverage), f6(r.coveredLength), r.uncovered.map((h) => `${f6(h.from)} to ${f6(h.to)}`).join('; ')]));
const grHalf = covs.find((c) => c.ch === 'GR' && c.ms === 0.5).r;
const grOne = covs.find((c) => c.ch === 'GR' && c.ms === 1.0).r;
must('with a half-foot maxStep GR has one hole, at the index skip', grHalf.uncovered.length === 1 && grHalf.uncovered[0].from === 8474.5 && grHalf.uncovered[0].to === 8475.5, JSON.stringify(grHalf.uncovered));
must('with a one-foot maxStep GR has no hole', grOne.uncovered.length === 0, JSON.stringify(grOne.uncovered));
planted(8, grHalf.uncovered.length === 1, 'the index skip is a hole at maxStep 0.5');
w();
w(`The gamma ray has no missing value inside the interval once the sentinel is converted, and at a half-foot maxStep it still has one hole, from ${f6(grHalf.uncovered[0].from)} to ${f6(grHalf.uncovered[0].to)} ft: the depth index skips a sample there. At a one-foot maxStep the same step covers. The hole's reason, verbatim: "${grHalf.flags[0].reason}".`);
w();
const BOUND = { index: [0, 1, 2], values: [5, 5, 5], start: 0, end: 2, maxStep: 1 };
const onB = success('coverage with a step exactly maxStep', Q.coverage(BOUND));
w(`ON THE BOUNDARY. An index ${BOUND.index.join(', ')} with every value present and maxStep ${S(BOUND.maxStep)} reads coverage ${f6(onB.coverage)}: a step equal to maxStep covers.`);
must('a step equal to maxStep covers', onB.coverage === 1, onB.coverage);
w();
const cvRef = refusal('coverage on the splice index', Q.coverage({ index: T.EKENE_SPLICE.index, values: T.EKENE_SPLICE.index, start: 8520, end: 8526, maxStep: 0.5 }), 'index[5]');
w('Coverage needs a strictly increasing index. On the EKENE-7 splice index it refuses:');
w();
w(`> ${cvRef.error}`);

/* ============================================================ SECTION 7 */

section('range', 'Definitional limits and the range check', ['Associate m03']);
w('The engine ships DEFINITIONAL limits only: bounds a value cannot cross by definition. Each is keyed by unit, and a bound marked exclusive means the bound itself is not allowed.');
w();
const limRows = [];
Object.entries(Q.DEFINITIONAL_LIMITS).forEach(([ch, units]) => Object.entries(units).forEach(([u, l]) => {
  limRows.push([ch, u, num(l.min), l.max === Infinity ? 'none' : num(l.max), l.minExclusive ? 'yes' : 'no', l.note]);
}));
table(['channel', 'unit', 'minimum', 'maximum', 'minimum excluded', 'the engine note'], limRows);
w();
w(`${limRows.length} channel and unit pairs across ${Object.keys(Q.DEFINITIONAL_LIMITS).length} channels.`);
w();
const rangeRows = [
  ['GR', 'gammaRay', 'gAPI', CH.GR.values],
  ['RHOB', 'bulkDensity', 'g/cm3', CH.RHOB.values],
  ['NPHI', 'fraction', 'v/v', CH.NPHI.values],
  ['RT', 'resistivity', 'ohm.m', CH.RT.values],
  ['DT', 'sonic', 'us/ft', CH.DT.values],
].map(([name, ch, u, v]) => ({ name, r: success(`range ${name}`, Q.rangeCheck({ values: v, channel: ch, unit: u })) }));
table(['EKENE-7 channel', 'checked', 'failed', 'entries flagged', 'rule'], rangeRows.map(({ name, r }) => [name, String(r.checked), String(r.failed), r.flags.length ? list(idxs(r.flags)) : 'none', r.flags.length ? [...new Set(r.flags.map((f) => f.rule))].join(', ') : 'none']));
const rtR = rangeRows.find((x) => x.name === 'RT').r;
planted(4, rtR.failed === 1 && rtR.flags[0].index === 120, JSON.stringify(idxs(rtR.flags)));
w();
w(`RT at entry ${rtR.flags[0].index} is zero (stated), and the resistivity minimum is exclusive. Its reason, verbatim: "${rtR.flags[0].reason}".`);
w();
w('PLAUSIBILITY RANGES ARE THE CALLER\'S. A gamma ray above some value, a density below some value, are claims about a basin and a tool, and the engine carries none. Passed by the caller as min and max, a range is checked the same way:');
w();
const callerGr = success('caller range on GR', Q.rangeCheck({ values: GR_CLEAN, min: 0, max: 150 }));
const callerRh = success('caller range on RHOB', Q.rangeCheck({ values: CH.RHOB.values, min: 1.95, max: 2.95 }));
table(['channel', 'caller minimum, stated', 'caller maximum, stated', 'checked', 'failed', 'the basis source'], [
  ['GR, sentinel converted', num(callerGr.min), num(callerGr.max), String(callerGr.checked), String(callerGr.failed), callerGr.basis.source],
  ['RHOB', f6(callerRh.min), f6(callerRh.max), String(callerRh.checked), String(callerRh.failed), callerRh.basis.source],
]);

/* ============================================================ SECTION 8 */

section('units', 'Units are never converted, and a fraction written in percent', ['Associate m03']);
const nphiR = rangeRows.find((x) => x.name === 'NPHI').r;
planted(3, nphiR.failed === 10 && idxs(nphiR.flags).join() === '150,151,152,153,154,155,156,157,158,159', idxs(nphiR.flags));
w(`EKENE-7 NPHI entries ${nphiR.flags[0].index} to ${nphiR.flags.at(-1).index} were written in percent (stated). Against the fraction limit in v/v they fail as above the maximum:`);
w();
table(['entry', 'NPHI as delivered', 'the engine reason'], nphiR.flags.slice(0, 3).map((f) => [String(f.index), f6(f.value), f.reason]));
w();
w(`The first three of the ${nphiR.failed} flags are shown. A value of 1 is allowed and a value above 1 is not: the maximum is inclusive.`);
w();
const unitRef = refusal('sonic in an unlisted unit', Q.rangeCheck({ values: CH.DT.values, channel: 'sonic', unit: 'us/s' }), 'unit');
w('A unit the engine does not list is refused, and nothing is converted:');
w();
w(`> ${unitRef.error}`);
w();
const dtM = success('sonic in us/m', Q.rangeCheck({ values: CH.DT.values, channel: 'sonic', unit: 'us/m' }));
w(`The same EKENE-7 sonic, declared in us/m, passes ${dtM.checked} checked with ${dtM.failed} failed: the definitional limit is positive in either unit, so a unit mislabel is invisible to it. The label is the caller's responsibility.`);
must('the sonic passes in either listed unit', dtM.failed === 0, dtM.failed);

/* ============================================================ SECTION 9 */

section('rates', 'Negative rates and rates while shut in', ['Associate m03 l05']);
const rc = success('EKENE-3 rateCheck', Q.rateCheck({ rates: PROD.oil, hoursOn: PROD.hoursOn, status: PROD.status }));
w('Shut in means `status` is \'shut-in\' or `hoursOn` is 0. A negative rate is flagged; a positive rate while shut in is flagged; a zero rate while shut in is correct.');
w();
table(['day', 'oil, bbl/d', 'hours on', 'status', 'rule', 'the engine reason'], rc.flags.map((f) => [String(day(f.index)), f6(PROD.oil[f.index]), f6(PROD.hoursOn[f.index]), PROD.status[f.index], f.rule, f.reason]));
planted(11, rc.flags.some((f) => f.index === 46 && f.rule === 'negative-rate'), JSON.stringify(rc.flags));
planted(12, rc.flags.some((f) => f.index === 60 && f.rule === 'rate-while-shut-in'), JSON.stringify(rc.flags));
w();
const shutI = PROD.status.indexOf('shut-in');
const partI = PROD.hoursOn.findIndex((h) => h > 0 && h < 24);
w(`${rc.checked} days checked, ${rc.failed} failed; the three missing days are not checked. Day ${day(shutI)} is shut in with an oil rate of ${f6(PROD.oil[shutI])} and is not flagged. Day ${day(partI)} ran ${f6(PROD.hoursOn[partI])} hours (stated) and is not shut in.`);
must('day 60 is shut in and not flagged', PROD.status[59] === 'shut-in' && !rc.flags.some((f) => f.index === 59), 'day 60');
w();
const statusOnly = success('rateCheck with status only', Q.rateCheck({ rates: PROD.oil, status: PROD.status }));
const hoursOnly = success('rateCheck with hours only', Q.rateCheck({ rates: PROD.oil, hoursOn: PROD.hoursOn }));
table(['what the check is given', 'failed'], [
  ['rates alone', String(success('rateCheck rates alone', Q.rateCheck({ rates: PROD.oil })).failed)],
  ['rates and status', String(statusOnly.failed)],
  ['rates and hours on', String(hoursOnly.failed)],
  ['rates, status and hours on', String(rc.failed)],
]);

/* ============================================================ SECTION 10 */

section('index', 'The depth and time index: duplicates, reversals and irregular steps', ['Associate m04']);
const ix = success('EKENE-7 depth indexCheck', Q.indexCheck({ index: LOG.depth }));
w(`A duplicate is a value equal to ANY earlier value. A reversal is a step against the stated direction. An irregular step is a step in the right direction whose size differs from the expected step by more than the tolerance. The expected step defaults to the ${ix.expectedStepSource}, and the tolerance to ${ix.basis.stepTolerance}.`);
w();
table(['EKENE-7 depth index', 'value'], [
  ['entries', String(ix.n)],
  ['expected step, ft', f6(ix.expectedStep)],
  ['expected step source', ix.expectedStepSource],
  ['step tolerance, ft', ix.stepTolerance.toExponential(2)],
  ['duplicates', String(ix.duplicates)], ['reversals', String(ix.reversals)], ['irregular steps', String(ix.irregularSteps)],
  ['monotonic', String(ix.monotonic)],
]);
w();
w(`The one flag, verbatim: "${ix.flags[0].reason}".`);
w();
const sp = success('EKENE-7 splice indexCheck', Q.indexCheck({ index: T.EKENE_SPLICE.index }));
w(`THE SPLICE. The delivered index where two runs meet (stated): ${T.EKENE_SPLICE.index.map((v) => (v === null ? 'null' : f6(v))).join(', ')}.`);
w();
const spEntries = [...new Set(idxs(sp.flags))];
table(['entry', 'value', 'rules', 'the engine reasons'], spEntries.map((e) => {
  const fs = sp.flags.filter((f) => f.index === e);
  return [String(e), T.EKENE_SPLICE.index[e] === null ? '`null`' : f6(T.EKENE_SPLICE.index[e]), fs.map((f) => f.rule).join(', '), fs.map((f) => f.reason).join('; ')];
}));
planted(9, sp.duplicates === 2 && sp.reversals === 1 && sp.irregularSteps === 3 && sp.missing === 1, JSON.stringify([sp.duplicates, sp.reversals, sp.irregularSteps, sp.missing]));
planted(8, ix.irregularSteps === 1 && ix.flags[0].index === 150, JSON.stringify(ix.flags));
w();
table(['splice summary', 'count'], [['missing', String(sp.missing)], ['duplicates', String(sp.duplicates)], ['reversals', String(sp.reversals)], ['irregular steps', String(sp.irregularSteps)], ['monotonic', String(sp.monotonic)]]);
must('entry 5 is both a duplicate and a reversal', sp.flags.filter((f) => f.index === 5).map((f) => f.rule).join() === 'duplicate-index,reversal', JSON.stringify(sp.flags.filter((f) => f.index === 5)));
w();
const dupRev = sp.flags.find((f) => f.rule === 'duplicate-index' && sp.flags.some((g) => g.index === f.index && g.rule === 'reversal'));
w(`Entry ${dupRev.index} returns to a depth entry ${dupRev.firstIndex} already holds, so it is flagged twice: as a duplicate and as a reversal. The step after the lost entry is measured from the last present entry.`);
w();
const spStated = success('splice with a stated step', Q.indexCheck({ index: T.EKENE_SPLICE.index, expectedStep: SPLICE_STEP, stepTolerance: SPLICE_TOL }));
w(`A STATED EXPECTED STEP AND A LOOSE TOLERANCE. With expectedStep ${S(SPLICE_STEP)} and stepTolerance ${S(SPLICE_TOL)} (stated) the splice reads ${spStated.irregularSteps} irregular steps and still ${spStated.duplicates} duplicates and ${spStated.reversals} reversal: a tolerance loosens the step test only.`);
must('a loose tolerance clears the irregular steps and keeps the rest', spStated.irregularSteps === 0 && spStated.duplicates === 2 && spStated.reversals === 1, JSON.stringify(spStated));
w();
const down = success('an index logged upward, declared decreasing', Q.indexCheck({ index: UPLOG, direction: 'decreasing' }));
w(`A LOG RECORDED UPWARD. The index ${UPLOG.join(', ')} (stated) declared decreasing reads ${down.reversals} reversals and expected step ${f6(down.expectedStep)}.`);
must('an upward log declared decreasing is clean', down.reversals === 0 && down.irregularSteps === 0, JSON.stringify(down));
const upRef = refusal('an upward log declared increasing', Q.indexCheck({ index: UPLOG }), 'index');
w('Declared increasing, the same index is refused, because no step runs in the stated direction:');
w();
w(`> ${upRef.error}`);
must('the declared-increasing call on the upward log refuses', upRef.error.includes('no step'), upRef.error);

/* ============================================================ SECTION 11 */

section('cumulative', 'A cumulative never falls', ['Associate m05']);
const cc = success('EKENE-3 cumulativeCheck', Q.cumulativeCheck({ cumulative: PROD.cumOil }));
w('Each present value is compared with the LAST PRESENT value before it; a drop larger than the tolerance is flagged.');
w();
table(['day', 'cumulative oil, bbl'], [67, 68, 69, 70, 71].map((d) => [String(d), PROD.cumOil[d - 1] === null ? 'null' : f6(PROD.cumOil[d - 1])]));
w();
table(['flagged day', 'compared with day', 'drop, bbl', 'the engine reason'], cc.flags.map((f) => [String(day(f.index)), String(day(f.previousIndex)), f6(f.drop), f.reason]));
planted(17, cc.flags.length === 1 && cc.flags[0].index === 69 && cc.flags[0].previousIndex === 67, JSON.stringify(cc.flags));
w();
const cf = cc.flags[0];
w(`Day ${day(cf.index - 1)} is missing (stated), so day ${day(cf.index)} is measured against day ${day(cf.previousIndex)}. The keying error planted on day ${day(cf.index)} is ten thousand barrels (stated); the \`drop\` field is ${f6(cc.flags[0].drop)} bbl, which is that error less the oil produced on days ${day(cf.index - 1)} and ${day(cf.index)}. Derived: ten thousand less the drop is ${f6(10000 - cc.flags[0].drop)} bbl, the two days of production, and it is not the drop.`);
w();
const ccTol = success('cumulativeCheck with a meter tolerance', Q.cumulativeCheck({ cumulative: PROD.cumOil, tolerance: CUM_TOL }));
w(`READING THE FLAG. The engine counts entries from 0, so "entry ${cf.previousIndex}" in the reason is day ${day(cf.previousIndex)}. The flag carries its figures as fields: \`previous\` ${f6(cf.previous)}, \`value\` ${f6(cf.value)} and \`drop\` ${f6(cf.drop)}. The reason prints each cumulative as the shortest decimal that reads back to its field, and a lesson quotes the fields at six decimals.`);
must('the reason carries previous and value exactly as their fields', cf.reason.includes(String(cf.previous)) && cf.reason.includes(String(cf.value)), cf.reason);
must('every figure in the reason parses back to a field of the flag', (cf.reason.match(/-?\d+(?:\.\d+)?(?:e[-+]?\d+)?/g) || []).map(Number).every((x) => [cf.previous, cf.value, cf.previousIndex].includes(x)), cf.reason);
must('drop is previous less value', cf.drop === cf.previous - cf.value, cf.drop);
w();
w(`With a tolerance of ${S(CUM_TOL)} bbl (stated) the same drop is ${ccTol.failed === 0 ? 'not flagged' : 'flagged'}: a tolerance is for meter noise, and a tolerance wide enough to swallow a keying error hides it.`);
must('a tolerance above the drop clears it', ccTol.failed === 0 && cc.flags[0].drop < CUM_TOL, ccTol.failed);

/* ============================================================ SECTION 12 */

section('watercut', 'Water cut on a liquid basis, and the reporting tolerance', ['Associate m05']);
w(`The engine's water cut is water / (oil + water), a liquid basis. A reported water cut outside [0, 1] is flagged as out of range; one that disagrees with the computed value by more than the tolerance is a mismatch. The default tolerance is ${eTxt(Q.waterCutCheck({ waterCut: [0.5] }).basis.tolerance)}.`);
w();
const wcDef = success('waterCutCheck default tolerance', Q.waterCutCheck({ waterCut: PROD.waterCut, oil: PROD.oil, water: PROD.water }));
const wcRep = success('waterCutCheck at the reporting tolerance', Q.waterCutCheck({ waterCut: PROD.waterCut, oil: PROD.oil, water: PROD.water, tolerance: WC_TOL }));
table(['tolerance', 'failed', 'out of range', 'mismatch'], [
  [`${eTxt(wcDef.basis.tolerance)}, the default`, String(wcDef.failed), String(wcDef.flags.filter((f) => f.rule === 'water-cut-out-of-range').length), String(wcDef.flags.filter((f) => f.rule === 'water-cut-mismatch').length)],
  [`${eTxt(WC_TOL)}, one unit in the fourth decimal`, String(wcRep.failed), String(wcRep.flags.filter((f) => f.rule === 'water-cut-out-of-range').length), String(wcRep.flags.filter((f) => f.rule === 'water-cut-mismatch').length)],
]);
w();
w('The EKENE-3 sheet reports water cut to four decimals (stated), so a correct value can differ from water / (oil + water) by up to half a unit in the fourth decimal. At the default tolerance that rounding is flagged as a mismatch; at one unit in the fourth decimal only the planted defects remain:');
w();
table(['day', 'reported', 'computed, water / (oil + water)', 'rule'], wcRep.flags.map((f) => [String(day(f.index)), f6(PROD.waterCut[f.index]), wcRep.computed[f.index] === null ? 'null' : f6(wcRep.computed[f.index]), f.rule]));
planted(13, wcRep.flags.filter((f) => f.rule === 'water-cut-out-of-range').map((f) => f.index).join() === '19,20,21,22,23', JSON.stringify(wcRep.flags));
planted(14, wcRep.flags.some((f) => f.index === 54 && f.rule === 'water-cut-mismatch'), JSON.stringify(wcRep.flags));
w();
const d55 = wcRep.flags.find((f) => f.index === 54);
w(`Day ${day(d55.index)}'s reason, verbatim: "${d55.reason}".`);
w();
const d10 = DAY10;
w(`THE BASIS MATTERS. On day ${day(d10)} the computed liquid-basis water cut is ${f6(wcRep.computed[d10])}. Derived on the same day: water over oil, the water-oil ratio, is ${f6(PROD.water[d10] / PROD.oil[d10])}, and oil over liquid, the oil cut, is ${f6(1 - wcRep.computed[d10])}. Only the first is what the engine checks.`);
w();
w(`Where the engine cannot compute a liquid-basis cut (a missing or negative rate, or no liquid) the \`computed\` entry is null: on EKENE-3 that is days ${list(wcRep.computed.map((v, i) => (v === null ? day(i) : null)).filter((v) => v !== null))}.`);

/* ============================================================ SECTION 13 */

section('phasesum', 'Parts that add to a total, and the tolerance on the total', ['Associate m05', 'Expert m05']);
const ps = success('EKENE-3 phaseSumCheck', Q.phaseSumCheck({ parts: { oil: PROD.oil, water: PROD.water }, total: PROD.gross }));
w(`The parts must add to the total within max(absTolerance, relTolerance x |total|). The Petrolord default is relTolerance ${S(ps.basis.relTolerance)} of the TOTAL and absTolerance ${S(ps.basis.absTolerance)}; both are choices, stated in the basis.`);
w();
table(['day', 'oil + water, bbl/d', 'gross total, bbl/d', 'difference', 'allowed', 'flagged'], [39, 40].map((i) => {
  const s = PROD.oil[i] + PROD.water[i];
  const allowed = Math.max(ps.basis.absTolerance, ps.basis.relTolerance * Math.abs(PROD.gross[i]));
  return [String(day(i)), f6(ps.sums[i]), f6(PROD.gross[i]), f6(s - PROD.gross[i]), f6(allowed), String(ps.flags.some((f) => f.index === i))];
}));
planted(15, ps.flags.length === 1 && ps.flags[0].index === 39, JSON.stringify(idxs(ps.flags)));
must('day 41 is inside tolerance', !ps.flags.some((f) => f.index === 40), 'day 41');
w();
w(`The difference and allowed columns are derived (the sum less the total, and ${S(ps.basis.relTolerance)} times the total); the flagged column is the engine's.`);
w();
w(`Day ${day(ps.flags[0].index)}'s reason, verbatim: "${ps.flags[0].reason}".`);
w();
const psRel = success('phaseSumCheck at one percent', Q.phaseSumCheck({ parts: { oil: PROD.oil, water: PROD.water }, total: PROD.gross, relTolerance: PS_REL_WIDE }));
const psAbs = success('phaseSumCheck with an absolute floor', Q.phaseSumCheck({ parts: { oil: PROD.oil, water: PROD.water }, total: PROD.gross, absTolerance: PS_ABS }));
table(['tolerance, stated', 'failed', 'days flagged'], [
  [`relTolerance ${S(ps.basis.relTolerance)}, the default`, String(ps.failed), list(ps.flags.map((f) => day(f.index)))],
  [`relTolerance ${S(PS_REL_WIDE)}`, String(psRel.failed), list(psRel.flags.map((f) => day(f.index))) || 'none'],
  [`relTolerance ${S(ps.basis.relTolerance)} with absTolerance ${S(PS_ABS)} bbl/d`, String(psAbs.failed), list(psAbs.flags.map((f) => day(f.index))) || 'none'],
]);
w();
w(`${ps.sums.filter((v) => v === null).length} days carry no sum (\`null\`): a day with any part or the total missing is not checked.`);

/* ============================================================ SECTION 14 */

section('frozen', 'Frozen values, and a slow drift that is not one', ['Associate m05']);
w(`A frozen run is at least \`minRun\` consecutive present values each within \`tolerance\` of the run's FIRST value. A missing value ends a run. The Petrolord defaults are minRun ${Q.frozenRuns({ values: [1] }).basis.minRun} and tolerance ${S(Q.frozenRuns({ values: [1] }).basis.tolerance)}.`);
w();
const fzG = success('frozen gas', Q.frozenRuns({ values: PROD.gas }));
const fzD = success('frozen DT', Q.frozenRuns({ values: CH.DT.values }));
table(['series', 'runs', 'start', 'end', 'length', 'value held'], [
  ...fzD.runs.map((r) => ['EKENE-7 DT, us/ft, entries', String(fzD.runs.length), String(r.start), String(r.end), String(r.length), f6(r.value)]),
  ...fzG.runs.map((r) => ['EKENE-3 gas, Mscf/d, days', String(fzG.runs.length), String(day(r.start)), String(day(r.end)), String(r.length), f6(r.value)]),
]);
planted(6, fzD.runs.length === 1 && fzD.runs[0].start === 175 && fzD.runs[0].length === 9, JSON.stringify(fzD.runs));
planted(16, fzG.runs.length === 1 && fzG.runs[0].start === 73 && fzG.runs[0].length === 8, JSON.stringify(fzG.runs));
w();
w(`The gas meter held its day ${day(fzG.runs[0].start)} value for the seven days after it (stated), so the run is eight days long, days ${day(fzG.runs[0].start)} to ${day(fzG.runs[0].end)}. The reason, verbatim: "${fzG.flags[0].reason}".`);
w();
const others = ['oil', 'water', 'gross'].map((k) => [k, Q.frozenRuns({ values: PROD[k] }).runs.length]);
table(['EKENE-3 column', 'frozen runs at the defaults'], others.map(([k, n]) => [k, String(n)]));
w();
const drift = T.SLOW_DRIFT;
const dr = success('slow drift at the stated tolerance', Q.frozenRuns({ values: drift, tolerance: DRIFT_TOL }));
w(`A SLOW DRIFT. The readings ${drift.map(f6).join(', ')} (stated) rise ${f6(drift[1] - drift[0])} at a time. At tolerance ${S(DRIFT_TOL)} and minRun ${dr.basis.minRun} the engine finds ${dr.runs.length} runs, because each value is compared with the run's first value.`);
must('the slow drift is not a frozen run', dr.runs.length === 0, dr.runs.length);
const prevRule = (() => { let best = 1; let cur = 1; for (let i = 1; i < drift.length; i += 1) { if (Math.abs(drift[i] - drift[i - 1]) <= DRIFT_TOL) { cur += 1; best = Math.max(best, cur); } else cur = 1; } return best; })();
w(`Derived, and a rule the engine does not use: comparing each value with the one before it would chain all ${prevRule} readings into one run.`);
must('the previous-value rule would chain the whole drift', prevRule === drift.length, prevRule);

/* ============================================================ SECTION 15 */

section('identifiers', 'Well names: normalisation, near duplicates and the digit rule', ['Associate m06']);
const ids = T.EKENE_IDS.ids;
const du = success('duplicateIdentifiers on the well names', Q.duplicateIdentifiers({ ids }));
w('The stated normalisation: NFKD, trim, upper case, keep A to Z and 0 to 9, and strip leading zeros in each digit group. A pair is EXACT when the raw strings are equal, NORMALISED when the normalised forms are equal, and NEAR when the normalised forms are within `maxDistance` Levenshtein edits (1 by default) AND carry the same digits in the same order. A pair is reported under its strongest class only.');
w();
table(['entry', 'as written', 'normalised'], ids.map((s, i) => [String(i), s, du.normalised[i]]));
w();
table(['pair', 'kind', 'distance', 'the engine reason'], du.pairs.map((p) => [`${p.i}, ${p.j}`, p.kind, String(p.distance), p.reason]));
w();
table(['kind', 'pairs'], [['exact', String(du.exact)], ['normalised', String(du.normalisedDuplicates)], ['near', String(du.near)]]);
planted(18, du.exact === 1 && du.near === 1 && du.normalisedDuplicates > 0, JSON.stringify([du.exact, du.normalisedDuplicates, du.near]));
w();
const lv = [['EKENE2', 'EKENE12'], ['EKENE1', 'EKENE10'], ['EKNE4', 'EKENE4'], ['EKENE1', 'EKENE7']];
table(['normalised pair', 'Levenshtein distance', 'digits', 'reported as near'], lv.map(([a, b]) => {
  const d = Q.levenshtein(a, b);
  const i = du.normalised.indexOf(a); const j = du.normalised.indexOf(b);
  const near = du.pairs.some((p) => p.kind === 'near' && ((du.normalised[p.i] === a && du.normalised[p.j] === b) || (du.normalised[p.i] === b && du.normalised[p.j] === a)));
  must(`${a} and ${b} are both in the list`, i >= 0 && j >= 0, `${i} ${j}`);
  return [`${a}, ${b}`, String(d), `${a.replace(/\D/g, '')} and ${b.replace(/\D/g, '')}`, String(near)];
}));
must('EKENE2 and EKENE12 are one edit apart and not near', Q.levenshtein('EKENE2', 'EKENE12') === 1 && du.near === 1, du.near);
w();
w('The digit rule is why EKENE-2 and EKENE-12, two real wells one edit apart, are not called near duplicates, while EKNE-4, a typing slip, is paired with EKENE-4.');
w();
const noDigit = success('duplicateIdentifiers without the digit rule', Q.duplicateIdentifiers({ ids, digitsMustMatch: false }));
const keepZeros = success('duplicateIdentifiers keeping leading zeros', Q.duplicateIdentifiers({ ids, stripLeadingZeros: false }));
table(['setting, stated', 'exact', 'normalised', 'near'], [
  ['the defaults', String(du.exact), String(du.normalisedDuplicates), String(du.near)],
  ['digitsMustMatch false', String(noDigit.exact), String(noDigit.normalisedDuplicates), String(noDigit.near)],
  ['stripLeadingZeros false', String(keepZeros.exact), String(keepZeros.normalisedDuplicates), String(keepZeros.near)],
]);
w();
const accent = ids.findIndex((x) => x.normalize('NFKD') !== x);
w(`The accented entry ${accent} normalises to ${du.normalised[accent]}: NFKD separates the accent and the letter filter drops it.`);

/* ============================================================ SECTION 16 */

section('endtoend', 'One dataset, every check', ['Associate m06']);
w('EKENE-3\'s production sheet through every Associate check, with the settings stated in the sections above:');
w();
w('Two different counts appear below and are kept in separate columns. ENTRIES FAILED is the number of entries (days, samples) the check faults: missing values for completeness, failed entries for the others. FLAGS is the number of flag objects the engine returns: completeness returns one flag per gap run, and frozenRuns one flag per run, so a run of several entries is one flag.');
w();
table(['check', 'column', 'setting, stated', 'checked or n', 'entries failed', 'flags'], [
  ['completeness', 'oil', 'none', String(oilC.n), String(oilC.missing), String(oilC.flags.length)],
  ['rateCheck', 'oil', 'hours on and status', String(rc.checked), String(rc.failed), String(rc.flags.length)],
  ['cumulativeCheck', 'cumOil', `tolerance ${S(cc.basis.tolerance)}`, String(PROD.cumOil.filter((v) => v !== null).length), String(cc.failed), String(cc.flags.length)],
  ['waterCutCheck', 'waterCut', `tolerance ${eTxt(WC_TOL)}`, String(PROD.n), String(wcRep.failed), String(wcRep.flags.length)],
  ['phaseSumCheck', 'oil + water against gross', `relTolerance ${S(ps.basis.relTolerance)}`, String(ps.sums.filter((v) => v !== null).length), String(ps.failed), String(ps.flags.length)],
  ['frozenRuns', 'gas', `minRun ${fzG.basis.minRun}, tolerance ${S(fzG.basis.tolerance)}`, String(PROD.n), String(fzG.runs.reduce((a, r) => a + r.length, 0)), String(fzG.flags.length)],
]);
w();
w('EKENE-7\'s log through the same checks:');
w();
table(['check', 'channel', 'entries failed', 'flags'], [
  ['completeness', 'RHOB', String(rhobC.missing), String(rhobC.flags.length)],
  ['completeness', 'NPHI', String(nphiC.missing), String(nphiC.flags.length)],
  ['rangeCheck', 'GR as delivered', String(grRange.failed), String(grRange.flags.length)],
  ['rangeCheck', 'NPHI', String(nphiR.failed), String(nphiR.flags.length)],
  ['rangeCheck', 'RT', String(rtR.failed), String(rtR.flags.length)],
  ['indexCheck', 'depth', String(new Set(idxs(ix.flags)).size), String(ix.flags.length)],
  ['frozenRuns', 'DT', String(fzD.runs.reduce((a, r) => a + r.length, 0)), String(fzD.flags.length)],
]);
w();
w('Every one of these flags is a planted defect. The Associate tier checks whether data are fit to use; which values stand apart from the rest is the next tier\'s question.');

/* ============================================================ SECTION 17 */

section('zscore', 'The z-score, sample or population, and its ceiling', ['Professional m01']);
const G = T.EKENE_GAUGE.readings;
const zg = success('z on the gauge', Q.zScores({ values: G }));
const zgP = success('z on the gauge, population SD', Q.zScores({ values: G, sd: 'population' }));
w(`z = (x - mean) / s, with the SAMPLE standard deviation (n - 1) by default, as NIST/SEMATECH 1.3.5.17 defines it. A value is flagged when |z| > 3. The largest |z| any value can reach with the sample SD is (n - 1) / sqrt(n).`);
w();
const GL = G.indexOf(Math.max(...G));
w(`EKENE-3's ten gauge readings (stated): ${G.map(f6).join(', ')}. Entry ${GL} is a gauge glitch.`);
w();
table(['what', 'sample SD', 'population SD'], [
  ['mean', f6(zg.mean), f6(zgP.mean)],
  ['standard deviation', f6(zg.sd), f6(zgP.sd)],
  [`z of entry ${GL}`, f6(zg.z[GL]), f6(zgP.z[GL])],
  ['largest |z|', f6(zg.maxAbsZ), f6(zgP.maxAbsZ)],
  ['flags at |z| > 3', String(zg.flags.length), String(zgP.flags.length)],
]);
w();
w(`THE CEILING. At n = ${zg.n} the engine reports \`maxPossibleAbsZ\` ${f6(zg.maxPossibleAbsZ)} and \`thresholdReachable\` ${zg.thresholdReachable}: no value in ten can pass |z| > 3 with the sample SD, however wild. Entry ${GL} reaches ${f6(zg.z[GL])}.`);
must('the gauge glitch is not flagged by z and the threshold is unreachable', zg.flags.length === 0 && zg.thresholdReachable === false, `${zg.flags.length} ${zg.thresholdReachable}`);
planted(20, zg.flags.length === 0, 'z cannot flag the glitch');
w();
table(['n', 'largest possible |z| with the sample SD', 'reachable at 3'], [5, 8, 10, 11, 12, 20, 50].map((n) => {
  const v = Array.from({ length: n }, (_, i) => (i === n - 1 ? 1 : 0));
  const r = success(`z ceiling at n=${n}`, Q.zScores({ values: v }));
  return [String(n), f6(r.maxPossibleAbsZ), String(r.thresholdReachable)];
}));
must('the ceiling first passes 3 at n = 11', !Q.zScores({ values: Array.from({ length: 10 }, (_, i) => +(i === 9)) }).thresholdReachable && Q.zScores({ values: Array.from({ length: 11 }, (_, i) => +(i === 10)) }).thresholdReachable, 'n = 11');
w();
w('Each row is one value of 1 among zeros, which is how a value sits as far out as the sample allows.');
w();
const C = T.EKENE_CORE;
const FR = C.porosity.indexOf(Math.max(...C.porosity));
const zc = success('z on the core', Q.zScores({ values: C.porosity }));
const coreOut = C.porosity.filter((_, i) => i !== FR);
const zco = success('z on the core without plug 9', Q.zScores({ values: coreOut }));
w(`ONE OUTLIER INFLATES THE SPREAD. EKENE-7's ${C.porosity.length} core plugs (stated): ${C.porosity.map(f6).join(', ')}. Entry ${FR} is a fractured plug.`);
w();
table(['plugs', 'mean', 'sample SD', 'largest |z|', 'flags'], [
  ['all fourteen', f6(zc.mean), f6(zc.sd), f6(zc.maxAbsZ), String(zc.flags.length)],
  [`entry ${FR} left out`, f6(zco.mean), f6(zco.sd), f6(zco.maxAbsZ), String(zco.flags.length)],
]);
w();
const zOut8 = (C.porosity[FR] - zco.mean) / zco.sd;
w(`Derived: entry ${FR} measured against the other thirteen plugs' mean and SD sits at ${f6(zOut8)}. Measured against a spread that includes itself, it reads ${f6(zc.z[FR])} and is not flagged.`);
must('entry 8 against the rest passes 3, and against all does not', zOut8 > 3 && zc.flags.length === 0, `${zOut8} ${zc.flags.length}`);
w();
const nistZ = golden('nist-1.3.5.17-zscore-uranium');
const nz = success('NIST uranium z', Q.zScores(nistZ.args));
w(`NIST's uranium isotope example (golden, ${nistZ.args.values.length} values): the engine's largest |z| is ${f6(nz.maxAbsZ)}; NIST prints ${nistZ.published[0].value}. ${Ref('errata')} reads that printed figure.`);

/* ============================================================ SECTION 18 */

section('modz', 'The median, the MAD and the modified z-score', ['Professional m02']);
w(`MAD is the raw median of |x - median|. The modified z-score is M = ${S(K.MODIFIED_Z_SCALE)} (x - median) / MAD, and |M| > ${S(K.MODIFIED_Z_THRESHOLD)} labels a potential outlier (Iglewicz and Hoaglin, as NIST/SEMATECH 1.3.5.17 prints them).`);
w();
const mg = success('modified z on the gauge', Q.modifiedZScores({ values: G }));
const mc = success('modified z on the core', Q.modifiedZScores({ values: C.porosity }));
table(['series', 'median', 'MAD', 'largest |M|', 'entries flagged'], [
  ['EKENE-3 gauge', f6(mg.median), f6(mg.mad), f6(Math.max(...mg.scores.map(Math.abs))), list(idxs(mg.flags))],
  ['EKENE-7 core', f6(mc.median), f6(mc.mad), f6(Math.max(...mc.scores.map(Math.abs))), list(idxs(mc.flags))],
]);
planted(20, mg.flags.length === 1 && mg.flags[0].index === GL, JSON.stringify(mg.flags));
must('the modified z flags the fractured plug that z does not', mc.flags.some((f) => f.index === FR) && zc.flags.length === 0, 'core');
w();
w(`On the gauge the median is ${f6(mg.median)} with or without the glitch, and the modified z of entry ${GL} is ${f6(mg.scores[GL])}. Its reason, verbatim: "${mg.flags[0].reason}".`);
w();
const mgOut = success('modified z on the gauge without the glitch', Q.modifiedZScores({ values: G.filter((_, i) => i !== GL) }));
table(['gauge readings', 'mean, derived', 'median', 'sample SD', 'MAD'], [
  ['all ten', f6(ST.mean(G)), f6(mg.median), f6(zg.sd), f6(mg.mad)],
  [`entry ${GL} left out`, f6(ST.mean(G.filter((_, i) => i !== GL))), f6(mgOut.median), f6(success('z gauge without the glitch', Q.zScores({ values: G.filter((_, i) => i !== GL) })).sd), f6(mgOut.mad)],
]);
w();
w('The mean column is lib/stats `mean`, the function the engine itself imports.');
w();
const scale = 1 / K.HAMPEL_MAD_SCALE;
w(`THE PRINTED CONSTANT. The engine uses ${S(K.MODIFIED_Z_SCALE)} as printed. Derived: 1 / ${S(K.HAMPEL_MAD_SCALE)} is ${f6(scale)}, and entry ${GL} on the gauge with that constant would read ${f6((scale * (G[GL] - mg.median)) / mg.mad)} against the engine's ${f6(mg.scores[GL])}. Hampel's scale, ${S(K.HAMPEL_MAD_SCALE)} x MAD, is the same idea from the other side (${ref('hampel')}).`);
w();
const mad0 = refusal('modified z with MAD zero', Q.modifiedZScores({ values: MAD0 }), 'values');
w(`WHEN THE MAD IS ZERO. At least half the values equal the median, and the engine refuses rather than invent a fallback. On ${MAD0.join(', ')} (stated):`);
w();
table(['function', 'the engine\'s refusal, verbatim'], [['`modifiedZScores`', mad0.error]]);

/* ============================================================ SECTION 19 */

section('quantiles', 'Three quantile rules, R6, R7 and R8', ['Professional m03']);
w('The engine implements Hyndman and Fan R6, R7 and R8 exactly as NIST/SEMATECH 7.2.6.2 states them: h = p(N + 1) for R6, 1 + p(N - 1) for R7 and p(N + 1/3) + 1/3 for R8; with h = k + d the quantile is Y[k] + d (Y[k+1] - Y[k]) on the ordered values, clamped to the minimum and maximum. R7 is the default of Excel, R and numpy; R6 is NIST\'s.');
w();
const qn = ['R6', 'R7', 'R8'].map((m) => golden(`nist-7.2.6.2-p90-${m}`));
table(['rule', `engine ${S(qn[0].args[1])} quantile`, 'golden', 'NIST printed', 'relative difference against golden'], qn.map((g) => {
  const v = Q.sampleQuantile(...g.args);
  must(`NIST 7.2.6.2 ${g.args[2]} reproduces`, Math.abs(v - g.published[0].value) < 0.00005 + 1e-9, v);
  return [g.args[2], f6(v), f6(g.expected), String(g.published[0].value), relE(v, g.expected)];
}));
w();
w(`The NIST silicon wafer resistivities (golden, ${qn[0].args[0].length} values), 90th percentile by each rule.`);
w();
const wsand = GR_CLEAN.slice(WSAND[0], WSAND[1] + 1);
w(`THE SAME QUESTION ON EKENE-7. The water sand gamma ray, entries ${WSAND[0]} to ${WSAND[1]}:`);
w();
table(['rule', 'first quartile', 'third quartile', 'IQR, derived'], ['R6', 'R7', 'R8'].map((m) => {
  const a = Q.sampleQuantile(wsand, 0.25, m); const b = Q.sampleQuantile(wsand, 0.75, m);
  return [m, f6(a), f6(b), f6(b - a)];
}));
must('the three rules give three different first quartiles on the water sand', new Set(['R6', 'R7', 'R8'].map((m) => Q.sampleQuantile(wsand, 0.25, m))).size === 3, 'three');

/* ============================================================ SECTION 20 */

section('fences', 'Tukey fences: inner, outer and on the fence', ['Professional m03']);
const fz = success('fences water sand', Q.iqrFences({ values: wsand }));
const fz3 = success('fences water sand k 3', Q.iqrFences({ values: wsand, k: 3 }));
const fz6 = success('fences water sand R6', Q.iqrFences({ values: wsand, method: 'R6' }));
w(`The fences are Q1 - k IQR and Q3 + k IQR, k = ${S(K.TUKEY_K)} by default (3 for far out values), quartiles by the stated rule, ${fz.method} by default. A value strictly outside a fence is flagged.`);
w();
table(['setting, stated', 'Q1', 'Q3', 'IQR', 'lower fence', 'upper fence', 'entries flagged'], [
  [`${fz.method}, k ${S(fz.k)} (the defaults)`, f6(fz.q1), f6(fz.q3), f6(fz.iqr), f6(fz.lower), f6(fz.upper), list(idxs(fz.flags).map((i) => i + WSAND[0]))],
  [`${fz6.method}, k ${S(fz6.k)}`, f6(fz6.q1), f6(fz6.q3), f6(fz6.iqr), f6(fz6.lower), f6(fz6.upper), list(idxs(fz6.flags).map((i) => i + WSAND[0]))],
  [`${fz3.method}, k ${S(fz3.k)}`, f6(fz3.q1), f6(fz3.q3), f6(fz3.iqr), f6(fz3.lower), f6(fz3.upper), list(idxs(fz3.flags).map((i) => i + WSAND[0]))],
]);
const SPIKES = [70, 170]; // the two planted gamma ray spikes, stated in the generator
planted(5, fz.flags.some((f) => f.index + WSAND[0] === SPIKES[1]), 'the fence catches the second spike inside the water sand');
w();
w(`The flagged entries are EKENE-7 entries, the water sand read from entry ${WSAND[0]}. Entry ${SPIKES[1]} is a planted spike.`);
w();
const fAll = success('fences on the whole GR', Q.iqrFences({ values: GR_CLEAN }));
w(`On the whole log, shale and sand together, the gamma ray fences are ${f6(fAll.lower)} and ${f6(fAll.upper)} and flag ${fAll.flags.length} entries: the spike at entry ${SPIKES[1]} reads ${f6(GR_CLEAN[SPIKES[1]])}, inside a spread that includes the shale.`);
must('the whole-log fences flag nothing', fAll.flags.length === 0, fAll.flags.length);
w();
const onf = golden('iqr-exactly-on-both-fences');
const onr = success('golden on both fences', Q.iqrFences(onf.args));
w(`ON THE FENCE IS INSIDE. The golden case ${onf.id}: values ${onf.args.values.map(num).join(', ')} (n = ${onf.args.values.length}), at the defaults, rule ${onr.method} and k ${S(onr.k)}. The engine returns Q1 ${num(onr.q1)}, Q3 ${num(onr.q3)} and IQR ${num(onr.iqr)}, fences ${num(onr.lower)} and ${num(onr.upper)}, and ${onr.flags.length} flags: the lowest and highest values sit exactly on the fences.`);
must('a value on a fence is not flagged', onr.flags.length === 0 && onf.args.values.includes(onr.lower) && onf.args.values.includes(onr.upper), JSON.stringify(onr));

/* ============================================================ SECTION 21 */

section('hampel', 'The Hampel window: local against global', ['Professional m04']);
w(`For each sample, the window is 2 x halfWindow + 1 samples centred on it, truncated at the ends; missing values never enter a window; a window with fewer than three present samples is not judged. A sample is flagged when |x - window median| > nSigma x ${S(K.HAMPEL_MAD_SCALE)} x MAD of the window, strictly. The decision is the petrophysics engine's despikeHampel, imported; the replacement is the window median.`);
w();
const hp = success('hampel GR hw 3', Q.hampel({ values: GR_CLEAN, halfWindow: 3 }));
table(['entry', 'GR', 'window median', 'window MAD', 'threshold', '|x - median|, derived', 'replacement'], hp.flags.map((f) => {
  const p = hp.points[f.index];
  return [String(f.index), f6(p.value), f6(p.median), f6(p.mad), f6(p.threshold), f6(Math.abs(p.value - p.median)), f6(f.replacement)];
}));
planted(5, SPIKES.every((sp0) => hp.flags.some((f) => f.index === sp0)), JSON.stringify(idxs(hp.flags)));
w();
w(`EKENE-7 gamma ray, sentinel converted, halfWindow 3 and nSigma 3: ${hp.flags.length} flags. Entries ${SPIKES.join(' and ')} are the planted spikes. The other ${hp.flags.length - 2} are not planted defects: each is a sample farther from its window median than three scaled MADs of a seven-sample window, which is what the rule flags.`);
w();
const zGR = success('z on GR', Q.zScores({ values: GR_CLEAN }));
w(`GLOBAL AGAINST LOCAL. On the same channel the z-score flags ${zGR.flags.length}: entry ${SPIKES[0]} reads z ${f6(zGR.z[SPIKES[0]])} and entry ${SPIKES[1]} ${f6(zGR.z[SPIKES[1]])}, because a sand spike to ${f6(GR_CLEAN[SPIKES[0]])} gAPI looks like shale to a global mean and SD.`);
must('z flags no GR sample', zGR.flags.length === 0, zGR.flags.length);
w();
const hpSweep = [[3, 3], [3, 4], [3, 5], [5, 3], [5, 5], [10, 3]].map(([hw, ns]) => {
  const r = success(`hampel hw ${hw} ns ${ns}`, Q.hampel({ values: GR_CLEAN, halfWindow: hw, nSigma: ns }));
  return [String(hw), String(ns), String(2 * hw + 1), String(r.flags.length), String(SPIKES.every((sp0) => r.flags.some((f) => f.index === sp0)))];
});
table(['halfWindow, stated', 'nSigma, stated', 'window samples', 'flags', 'both spikes flagged'], hpSweep);
w();
const edge = hp.points[0];
const gapPt = success('hampel next to a gap', Q.hampel({ values: CH.RHOB.values, halfWindow: 3 }));
const g0 = rhobC.gapRuns[0].start;
w('EDGES. The engine returns one point per entry, and a point carries `windowCount` (present samples in its window) and `judged` (true when that count is three or more). The first four EKENE-7 gamma ray points, halfWindow 3, as returned:');
w();
table(['entry', 'windowCount', 'judged', 'window median', 'window MAD', 'threshold', 'flagged'], hp.points.slice(0, 4).map((pt) => [String(pt.index), String(pt.windowCount), String(pt.judged), f6(pt.median), f6(pt.mad), f6(pt.threshold), String(hp.flags.some((f) => f.index === pt.index))]));
must('entry 0 is judged on a truncated window of four', edge.windowCount === 4 && edge.judged === true, JSON.stringify(edge));
w();
w(`EDGES AND GAPS. At entry 0 the window is truncated to ${edge.windowCount} samples, which is at least three, so entry 0 is judged (\`judged\` ${edge.judged}) and is not flagged. On the density, entry ${g0 - 1} sits beside the twelve-sample gap and its window holds ${gapPt.points[g0 - 1].windowCount} present samples; entry ${g0} is missing and is not judged (\`judged\` ${gapPt.points[g0].judged}).`);
const thin = success('hampel on a thin window', Q.hampel({ values: THIN, halfWindow: 1 }));
w(`A window too thin to judge: on ${THIN.map((v) => (v === null ? 'null' : S(v))).join(', ')} (stated) with halfWindow 1, entry 3 has ${thin.points[3].windowCount} present sample in its window and \`judged\` ${thin.points[3].judged}.`);
must('entry 3 of the thin series is not judged', thin.points[3].judged === false && thin.flags.length === 0, JSON.stringify(thin.points[3]));
w();
const ht = golden('hampel-on-the-threshold');
const htr = success('golden on the Hampel threshold', Q.hampel(ht.args));
w(`ON THE THRESHOLD. The golden case ${ht.id}: values ${ht.args.values.map(num).join(', ')}, halfWindow ${ht.args.halfWindow} and nSigma ${ht.args.nSigma}. Entry 2 sits exactly on its threshold (window median ${num(htr.points[2].median)}, MAD ${num(htr.points[2].mad)}, threshold ${f6(htr.points[2].threshold)}) and is not flagged; the case flags entry ${list(idxs(htr.flags))}.`);
must('the value on the Hampel threshold is not flagged, and one other entry is', htr.flags.length === 1 && !htr.flags.some((f) => f.index === 2) && Math.abs(ht.args.values[2] - htr.points[2].median) === htr.points[2].threshold, JSON.stringify(htr.flags));

/* ============================================================ SECTION 22 */

section('grubbs', 'Grubbs for one outlier, its critical value, and masking', ['Professional m05']);
w('Grubbs\' G is the largest |Y - mean| / s (two-sided), with the sample SD. It is compared with (N - 1) / sqrt(N) x sqrt(t^2 / (N - 2 + t^2)), t the upper alpha / (2N) point of Student\'s t on N - 2 degrees of freedom (alpha / N one-sided). G above the critical value rejects. The test is for ONE outlier; NIST points to the generalised ESD test for several, which the engine does not build.');
w();
const g1 = success('grubbs core', Q.grubbsTest({ values: C.porosity }));
const g2 = success('grubbs core two spikes', Q.grubbsTest({ values: C.twoSpikes }));
table(['core plugs', 'n', 'sample SD', 'G', `critical at alpha ${S(g1.basis.alpha)}`, 't', 'tail probability', 'reject', 'suspect entry'], [
  ['one fractured plug', String(g1.n), f6(g1.sd), f6(g1.statistic), f6(g1.critical), f6(g1.tCritical), f6(g1.tailProbability), String(g1.reject), String(g1.suspectIndex)],
  ['two high plugs', String(g2.n), f6(g2.sd), f6(g2.statistic), f6(g2.critical), f6(g2.tCritical), f6(g2.tailProbability), String(g2.reject), String(g2.suspectIndex)],
]);
planted(19, g1.reject && g1.suspectIndex === FR && !g2.reject, `${g1.reject} ${g2.reject}`);
w();
const SEC = C.twoSpikes.findIndex((v, i) => v !== C.porosity[i]);
w(`MASKING. With a second high plug at entry ${SEC} (stated ${f6(C.twoSpikes[SEC])}), G falls to ${f6(g2.statistic)} and the test no longer rejects: the sample SD rises from ${f6(g1.sd)} to ${f6(g2.sd)} with the second plug in it. G is the largest |z|: on the single-spike plugs G is ${f6(g1.statistic)} and the largest |z| in ${ref('zscore')} is ${f6(zc.maxAbsZ)}.`);
must('the two-plug SD is larger', g2.sd > g1.sd, `${g1.sd} ${g2.sd}`);
must('G equals the largest |z|', Math.abs(g1.statistic - zc.maxAbsZ) < 1e-12, `${g1.statistic} ${zc.maxAbsZ}`);
w();
table(['n', `two-sided critical at ${S(g1.basis.alpha)}`, `one-sided critical at ${S(g1.basis.alpha)}`, 'largest possible G'], [6, 8, 10, 14, 20, 30].map((n) => {
  const v = Array.from({ length: n }, (_, i) => i * i);
  const a = success(`grubbs critical two n=${n}`, Q.grubbsTest({ values: v }));
  const b = success(`grubbs critical one n=${n}`, Q.grubbsTest({ values: v, side: 'max' }));
  return [String(n), f6(a.critical), f6(b.critical), f6(a.maxPossible)];
}));
w();
w('The critical value depends on n, alpha and the side only; the values the rows were run on do not enter it.');
w();
const ng = golden('nist-1.3.5.17.1-grubbs-max');
const ngr = success('NIST Grubbs', Q.grubbsTest(ng.args));
w(`NIST 1.3.5.17.1, the uranium example (golden, one-sided max, alpha ${S(ng.args.alpha)}): G ${f6(ngr.statistic)} against the printed ${ng.published[0].value}; critical ${f6(ngr.critical)} against the printed ${ng.published[1].value}; reject ${ngr.reject}.`);
must('NIST Grubbs rejects', ngr.reject === true, ngr.reject);

/* ============================================================ SECTION 23 */

section('mahalanobis', 'The Mahalanobis distance and its chi-square cutoff', ['Professional m05']);
w(`For each complete row, d^2 = (x - mean)' S^-1 (x - mean), with the classical mean and the SAMPLE covariance S (n - 1). A row is flagged when d^2 exceeds the chi-square quantile at 1 - alpha on p degrees of freedom, alpha ${S(Q.mahalanobis({ rows: [[1, 2], [2, 1], [3, 5], [4, 3]] }).alpha)} by default; the quantile is safetyStats' chiSquareQuantile, imported. Rows with a missing value are skipped and listed. The classical estimates are themselves pulled by outliers; a robust covariance is not built.`);
w();
const osRows = [];
for (let i = OSAND[0]; i <= OSAND[1]; i += 1) osRows.push([CH.RHOB.values[i], CH.NPHI.values[i]]);
const mh = success('mahalanobis oil sand', Q.mahalanobis({ rows: osRows }));
const flagged = idxs(mh.flags);
table(['EKENE-7 oil sand, RHOB and NPHI', 'value'], [
  ['rows', String(osRows.length)],
  ['complete rows used', String(mh.n)],
  ['rows skipped (EKENE-7 entries)', list(mh.skippedRows.map((i) => i + OSAND[0]))],
  ['centre RHOB, g/cm3', f6(mh.centre[0])], ['centre NPHI, v/v', f6(mh.centre[1])],
  ['covariance RHOB RHOB', f6(mh.covariance[0][0])], ['covariance RHOB NPHI', f6(mh.covariance[0][1])], ['covariance NPHI NPHI', f6(mh.covariance[1][1])],
  ['correlation, derived', f6(mh.covariance[0][1] / Math.sqrt(mh.covariance[0][0] * mh.covariance[1][1]))],
  [`cutoff, chi-square ${S(1 - mh.alpha)} on ${mh.p} degrees of freedom`, f6(mh.cutoff)],
  ['rows flagged (EKENE-7 entries)', list(flagged.map((i) => i + OSAND[0]))],
]);
const OFF = flagged[0];
planted(7, flagged.length === 1 && OFF + OSAND[0] === 60, JSON.stringify(flagged));
w();
const zR = success('z RHOB oil sand', Q.zScores({ values: osRows.map((r) => r[0]) }));
const zN = success('z NPHI oil sand', Q.zScores({ values: osRows.map((r) => r[1]) }));
w(`Entry ${OFF + OSAND[0]} (stated RHOB ${f6(CH.RHOB.values[OFF + OSAND[0]])}, NPHI ${f6(CH.NPHI.values[OFF + OSAND[0]])}) has d^2 ${f6(mh.d2[OFF])}. Each of its values alone is ordinary: z ${f6(zR.z[OFF])} on density and ${f6(zN.z[OFF])} on neutron, and neither z-score flags anything in the oil sand (${zR.flags.length} and ${zN.flags.length} flags). The pair sits off the density-neutron trend, and only a distance that knows the correlation sees it.`);
must('neither univariate z flags the off-trend entry', Math.abs(zR.z[OFF]) < 3 && Math.abs(zN.z[OFF]) < 3, `${zR.z[OFF]} ${zN.z[OFF]}`);
w();
w(`The flag's reason, verbatim: "${mh.flags[0].reason}".`);
w();
table(['alpha, stated', `cutoff on ${mh.p} degrees of freedom`, 'rows flagged'], [0.1, 0.05, 0.025, 0.01, 0.001].map((a) => {
  const r = success(`mahalanobis alpha ${a}`, Q.mahalanobis({ rows: osRows, alpha: a }));
  return [f6(a), f6(r.cutoff), String(r.flags.length)];
}));
w();
const top = mh.d2.map((d, i) => [i, d]).filter(([, d]) => d !== null).sort((a, b) => b[1] - a[1]).slice(0, 3);
table(['EKENE-7 entry', 'd^2'], top.map(([i, d]) => [String(i + OSAND[0]), f6(d)]));
w();
w('The three largest squared distances in the oil sand.');

/* ============================================================ SECTION 24 */

section('outlierreport', 'Which method for which question', ['Professional m06']);
w('Every Professional method run on the same three teaching series, at its defaults (Hampel halfWindow 3):');
w();
const methods = (label, v) => {
  const z = Q.zScores({ values: v }); const m = Q.modifiedZScores({ values: v }); const f = Q.iqrFences({ values: v });
  const h = Q.hampel({ values: v, halfWindow: 3 }); const g = Q.grubbsTest({ values: v });
  [z, m, f, h, g].forEach((r, i) => success(`${label} method ${i}`, r));
  return [label, list(idxs(z.flags)) || 'none', list(idxs(m.flags)) || 'none', list(idxs(f.flags)) || 'none', list(idxs(h.flags)) || 'none', g.reject ? String(g.suspectIndex) : 'none'];
};
table(['series', 'z beyond 3', `modified z beyond ${S(K.MODIFIED_Z_THRESHOLD)}`, `Tukey fences, R7 k ${S(K.TUKEY_K)}`, 'Hampel', 'Grubbs rejects'], [
  methods('EKENE-3 gauge', G),
  methods('EKENE-7 core', C.porosity),
  methods('EKENE-7 core, two high plugs', C.twoSpikes),
]);
w();
w('The entries are positions in each series. Each method answers its own question: z and Grubbs measure against a mean and SD the outlier helps set; the modified z and the fences against a median and quartiles it barely moves; Hampel against a local window; Mahalanobis (the section before) against a correlation. A flag from any of them is a question about that entry, and none of them deletes it.');
const gc2 = Q.modifiedZScores({ values: C.twoSpikes });
must('on two high plugs the modified z flags both and Grubbs rejects neither', idxs(gc2.flags).includes(SEC) && idxs(gc2.flags).includes(FR) && !g2.reject, idxs(gc2.flags));

/* ============================================================ SECTION 25 */

section('individuals', 'The individuals and moving range chart', ['Expert m01']);
w(`MR_i = |x_i - x_(i-1)|, sigma = MRbar / ${S(K.D2_N2)} (d2 for a moving range of two), limits centre +/- 3 sigma; the moving range chart has upper limit ${S(K.D4_N2)} MRbar (D4) and lower limit 0. Centre and MRbar default to the data's own averages, and either may be given as a standard. A point strictly outside its limits signals. A chart refuses a series with a gap.`);
w();
const ni = golden('nist-6.3.2.2-individuals-flowrate');
const nir = success('NIST individuals', Q.individualsChart(ni.args));
const at = (o, pathStr) => pathStr.split('.').reduce((a, k) => (a === undefined || a === null ? a : a[k]), o);
table([`NIST 6.3.2.2 flow rate, ${ni.args.values.length} batches`, 'engine', 'NIST printed'], ni.published.map((p) => {
  const v = at(nir, p.field);
  must(`NIST individuals ${p.field} reproduces to its printed decimals`, Math.abs(v - p.value) <= 0.5 * 10 ** -p.decimals + 1e-9, v);
  return [p.field, f6(v), String(p.value)];
}));
w();
w(`The moving ranges (engine): ${nir.movingRanges.slice(1).map(f6).join(', ')}. Flags on the NIST data: ${nir.flags.length}.`);
w();
const W = T.EKENE_WHP;
const ph1 = success('EKENE phase one', Q.individualsChart({ values: W.history }));
w(`EKENE-3 FLOWING WELLHEAD PRESSURE, PHASE ONE: ${W.history.length} in-control days, psig (stated in the generator).`);
w();
table(['phase one', 'value'], [
  ['centre, psig', f6(ph1.centre)], ['MRbar, psi', f6(ph1.mrBar)], [`sigma = MRbar / ${S(K.D2_N2)}, psi`, f6(ph1.sigma)],
  ['upper limit, psig', f6(ph1.ucl)], ['lower limit, psig', f6(ph1.lcl)], ['moving range upper limit, psi', f6(ph1.mrUcl)],
  ['flags', String(ph1.flags.length)],
  ['sample SD of phase one, lib/stats, derived', f6(ST.ss.sampleStandardDeviation(W.history))],
]);
must('phase one is in control', ph1.flags.length === 0, ph1.flags.length);
w();
const ph2 = success('EKENE phase two against phase one', Q.individualsChart({ values: W.monitored, centre: ph1.centre, mrBar: ph1.mrBar }));
const ph2own = success('EKENE phase two on its own averages', Q.individualsChart({ values: W.monitored }));
w('PHASE TWO, the forty monitored days, charted with phase one\'s centre and MRbar as the standard, and on its own averages:');
w();
table(['chart', 'centre', 'upper limit', 'lower limit', 'days signalling (rule)'], [
  ['phase one as the standard', f6(ph2.centre), f6(ph2.ucl), f6(ph2.lcl), ph2.flags.map((f) => `${f.index + 1} (${f.rule})`).join('; ')],
  ['phase two on its own averages', f6(ph2own.centre), f6(ph2own.ucl), f6(ph2own.lcl), ph2own.flags.map((f) => `${f.index + 1} (${f.rule})`).join('; ') || 'none'],
]);
planted(21, ph2.flags.some((f) => f.index === W.glitchDay - 1 && f.rule === 'individuals-above-ucl'), JSON.stringify(ph2.flags));
w();
w(`Day ${W.glitchDay} is the planted gauge glitch (${f6(W.monitored[W.glitchDay - 1])} psig). A chart drawn on the monitored data's own averages takes its centre from data that include the shift from day ${W.shiftStartsDay}.`);

/* ============================================================ SECTION 26 */

section('ewma', 'The EWMA chart: a weighted memory with limits from history', ['Expert m02']);
w('EWMA_t = lambda x_t + (1 - lambda) EWMA_(t-1), starting at EWMA_0 = the target. Limits are target +/- L sigma sqrt(lambda / (2 - lambda)) (asymptotic), or the exact ones, which multiply the variance by 1 - (1 - lambda)^(2t). Target and sigma are REQUIRED and come from historical in-control data; the chart does not estimate them from the data it monitors.');
const noLam = refusal('ewmaChart with no lambda', Q.ewmaChart({ values: [1, 2], target: 1, sigma: 1 }), 'lambda');
w();
w('NO ENGINE DEFAULT FOR LAMBDA. The engine takes no default smoothing constant: a call without `lambda` is refused, naming the field, in the engine\'s own words:');
w();
w(`> ${noLam.error}`);
w();
const ne = golden('nist-6.3.2.4-ewma');
const ner = success('NIST EWMA', Q.ewmaChart(ne.args));
table([`NIST 6.3.2.4, lambda ${S(ne.args.lambda)}, target ${S(ne.args.target)}, s ${S(ne.args.sigma)}`, 'engine', 'NIST printed'], ne.published.filter((p) => ['ucl', 'lcl'].includes(p.field)).map((p) => [p.field, f6(ner[p.field]), String(p.value)]));
w();
w(`The NIST EWMA values (engine, first five): ${ner.ewma.slice(0, 5).map(f6).join(', ')}. ${Ref('errata')} reads the printed lower limit.`);
w();
const ewA = success('EKENE EWMA asymptotic', Q.ewmaChart({ values: W.monitored, lambda: LAMBDA, target: ph1.centre, sigma: ph1.sigma, L: LM }));
const ewX = success('EKENE EWMA exact', Q.ewmaChart({ values: W.monitored, lambda: LAMBDA, target: ph1.centre, sigma: ph1.sigma, L: LM, limits: 'exact' }));
w(`EKENE-3 PHASE TWO, lambda ${S(LAMBDA)} and L ${S(LM)} (stated), target ${f6(ph1.centre)} and sigma ${f6(ph1.sigma)} from phase one:`);
w();
table(['day', 'pressure', 'EWMA', 'asymptotic lower', 'asymptotic upper', 'exact lower', 'exact upper', 'signal'], ewA.points.map((p, i) => [
  String(i + 1), f6(p.value), f6(p.ewma), f6(p.lcl), f6(p.ucl), f6(ewX.points[i].lcl), f6(ewX.points[i].ucl),
  ewA.flags.find((f) => f.index === i) ? ewA.flags.find((f) => f.index === i).rule : 'none']));
planted(21, ewA.flags.some((f) => f.rule === 'ewma-below-lcl' && f.index >= W.shiftStartsDay - 1), JSON.stringify(ewA.flags));
w();
const firstLowE = ewA.flags.find((f) => f.rule === 'ewma-below-lcl');
const exLow = ewX.flags.filter((f) => f.rule === 'ewma-below-lcl').map((f) => f.index + 1);
const exHigh = ewX.flags.filter((f) => f.rule === 'ewma-above-ucl').map((f) => f.index + 1);
w(`The signal column is the asymptotic chart's. With the EXACT limits the engine signals low on days ${list(exLow)} and high on days ${list(exHigh)}; with the asymptotic limits, low on days ${list(ewA.flags.filter((f) => f.rule === 'ewma-below-lcl').map((f) => f.index + 1))} and high on days ${list(ewA.flags.filter((f) => f.rule === 'ewma-above-ucl').map((f) => f.index + 1))}. ${JSON.stringify(ewX.flags.map((f) => [f.index, f.rule])) === JSON.stringify(ewA.flags.map((f) => [f.index, f.rule])) ? 'The two sets are the same days: the exact limits are narrower, most of all in the first days, and on no day does the EWMA fall between an exact and an asymptotic limit.' : 'The two sets differ.'}`);
must('the exact chart signals on at least the asymptotic chart\'s days', ewA.flags.every((f) => ewX.flags.some((g) => g.index === f.index && g.rule === f.rule)), 'exact contains asymptotic');
w();
w(`The first low signal is day ${firstLowE.index + 1}. The days with an upper signal are ${list(ewA.flags.filter((f) => f.rule === 'ewma-above-ucl').map((f) => f.index + 1))}. Derived: day ${W.glitchDay}'s value enters the EWMA with weight lambda, ${f6(LAMBDA)}, and keeps weight lambda (1 - lambda)^(t - ${W.glitchDay}) on day t, which is ${f6(LAMBDA * (1 - LAMBDA) ** 5)} on day ${W.glitchDay + 5}.`);
w();
table(['lambda, stated', 'asymptotic half-width, psi, derived', 'first low signal day', 'days signalling'], [0.1, 0.2, 0.3, 0.5, 1].map((lam) => {
  const r = success(`EKENE EWMA lambda ${lam}`, Q.ewmaChart({ values: W.monitored, lambda: lam, target: ph1.centre, sigma: ph1.sigma }));
  const lo = r.flags.find((f) => f.rule === 'ewma-below-lcl');
  return [f6(lam), f6(r.ucl - ph1.centre), lo ? String(lo.index + 1) : 'none', String(r.flags.length)];
}));
w();
const lam1 = Q.ewmaChart({ values: W.monitored, lambda: 1, target: ph1.centre, sigma: ph1.sigma });
w(`At lambda 1 the EWMA is the observation itself and the limits are target +/- ${f6((lam1.ucl - ph1.centre) / ph1.sigma)} sigma, derived: the individuals chart.`);
must('lambda 1 gives three sigma limits', Math.abs((lam1.ucl - ph1.centre) / ph1.sigma - 3) < 1e-12, lam1.ucl);

/* ============================================================ SECTION 27 */

section('cusum', 'The tabular CUSUM: k, h, stated units, and no reset', ['Expert m03']);
w('S_hi(i) = max(0, S_hi(i-1) + x_i - target - k) and S_lo(i) = max(0, S_lo(i-1) + target - k - x_i), both starting at 0. A signal is S_hi or S_lo strictly above h. `units` is required, and the engine\'s own refusal (section 4) names the two choices, sigma and data, with its rule of thumb. No reset after a signal. The plain cumulative sum of x - target is returned too.');
const noK = refusal('cusumChart with no k', Q.cusumChart({ values: [1, 2], target: 1, units: 'data', h: 4 }), 'k');
const noH = refusal('cusumChart with no h', Q.cusumChart({ values: [1, 2], target: 1, units: 'data', k: 0.5 }), 'h');
w();
w('NO ENGINE DEFAULT FOR K OR H. The engine takes neither the reference value nor the decision interval by default; the rule of thumb in its units refusal is advice, and a call without either is refused, naming the field:');
w();
table(['what was left out', 'field named', 'the engine\'s message'], [['k', `\`${noK.field}\``, noK.error], ['h', `\`${noH.field}\``, noH.error]]);
w();
const nc = golden('nist-6.3.2.3-cusum-tabular');
const ncr = success('NIST CUSUM', Q.cusumChart(nc.args));
w(`NIST 6.3.2.3, target ${num(nc.args.target)}, k ${num(nc.args.k)} and h ${num(nc.args.h)} in data units (golden): the first upper signal is group ${ncr.firstSignalHigh + 1}.`);
must('NIST CUSUM first signals at group 14', ncr.firstSignalHigh === 13, ncr.firstSignalHigh);
w();
table(['group', `x - ${S(nc.args.target)}`, 'S_hi', 'S_lo', 'cumulative sum'], ncr.points.slice(10, 15).map((p, i) => [String(i + 11), f6(p.deviation), f6(p.sHigh), f6(p.sLow), f6(p.cusum)]));
w();
const cu = success('EKENE CUSUM', Q.cusumChart({ values: W.monitored, target: ph1.centre, k: K_S, h: H_S, units: 'sigma', sigma: ph1.sigma }));
w(`EKENE-3 PHASE TWO, k ${S(K_S)} and h ${S(H_S)} in sigma units (stated), target and sigma from phase one: k is ${f6(cu.kData)} psi and h is ${f6(cu.hData)} psi.`);
w();
table(['day', 'pressure', 'S_hi', 'S_lo', 'cumulative sum', 'signal'], cu.points.map((p, i) => [String(i + 1), f6(p.value), f6(p.sHigh), f6(p.sLow), f6(p.cusum), p.signalHigh ? 'high' : (p.signalLow ? 'low' : 'none')]));
planted(21, cu.firstSignalLow !== null && cu.firstSignalLow >= W.shiftStartsDay - 1, cu.firstSignalLow);
w();
w(`The first upper signal is day ${cu.firstSignalHigh + 1} and the first lower signal is day ${cu.firstSignalLow + 1}. NO RESET: S_hi is above h on ${cu.points.filter((p) => p.signalHigh).length} days from day ${cu.firstSignalHigh + 1} to day ${cu.points.map((p, i) => (p.signalHigh ? i + 1 : 0)).reduce((a, b) => Math.max(a, b), 0)}; after a signal the sum carries on from where it stood.`);
w();
const cuData = success('EKENE CUSUM, k and h read in psi', Q.cusumChart({ values: W.monitored, target: ph1.centre, k: K_S, h: H_S, units: 'data' }));
w(`THE UNIT MATTERS. The same k ${S(K_S)} and h ${S(H_S)} read as psi give a first upper signal on day ${cuData.firstSignalHigh + 1}, a first lower signal on day ${cuData.firstSignalLow + 1}, and ${cuData.flags.length} flags against ${cu.flags.length}.`);
w();
const hDesign = (alpha) => (2 / 1) * Math.log((1 - NIST_BETA) / alpha) * nc.args.k;
w(`NIST's design line, derived here with its own printed inputs (alpha ${S(NIST_ALPHA)}, beta ${S(NIST_BETA)}, delta 1 sigma, and the printed k ${num(nc.args.k)}): h = (2 / delta^2) ln((1 - beta) / alpha) k gives ${f6(hDesign(NIST_ALPHA))}, and ${f6(hDesign(NIST_ALPHA / 2))} with alpha halved, both in the data's units. The table uses h ${num(nc.args.h)}. The engine has no design helper: k and h are inputs (${ref('errata')}).`);

/* ============================================================ SECTION 28 */

section('whichchart', 'Which chart sees what', ['Expert m03 l05']);
w(`EKENE-3 phase two carries two planted events: a glitch on day ${W.glitchDay} and a downward shift from day ${W.shiftStartsDay} (stated in the generator). Each chart with its settings from the sections above:`);
w();
const firstOf = (flags, pred) => { const f = flags.find(pred); return f ? String(f.index + 1) : 'none'; };
const SH = W.shiftStartsDay - 1;
const GD = W.glitchDay - 1;
table(['chart', `first signal at or after day ${W.shiftStartsDay}, low side`, `signals on day ${W.glitchDay}`, 'days with any signal'], [
  ['individuals, phase one standard', firstOf(ph2.flags, (f) => f.index >= SH && f.rule === 'individuals-below-lcl'), String(ph2.flags.some((f) => f.index === GD)), String(new Set(idxs(ph2.flags)).size)],
  [`EWMA, lambda ${S(LAMBDA)}, asymptotic`, firstOf(ewA.flags, (f) => f.index >= SH && f.rule === 'ewma-below-lcl'), String(ewA.flags.some((f) => f.index === GD)), String(new Set(idxs(ewA.flags)).size)],
  [`CUSUM, k ${S(K_S)} and h ${S(H_S)} sigma`, firstOf(cu.flags, (f) => f.index >= SH && f.rule === 'cusum-low'), String(cu.flags.some((f) => f.index === GD)), String(new Set(idxs(cu.flags)).size)],
]);
w();
const indLow = ph2.flags.filter((f) => f.index >= SH && f.rule === 'individuals-below-lcl').length;
const ewLowDays = ewA.flags.filter((f) => f.index >= SH && f.rule === 'ewma-below-lcl').length;
const cuLowDays = cu.flags.filter((f) => f.index >= SH && f.rule === 'cusum-low').length;
table(['chart', `low signals from day ${W.shiftStartsDay} to day ${W.monitored.length}`], [['individuals', String(indLow)], ['EWMA', String(ewLowDays)], ['CUSUM', String(cuLowDays)]]);
must('the individuals chart sees fewer shifted days than EWMA and CUSUM', indLow < ewLowDays && indLow < cuLowDays, `${indLow} ${ewLowDays} ${cuLowDays}`);
w();
w('All three see the glitch. The individuals chart signals on the shifted days only where a single day falls past three sigma; EWMA and CUSUM accumulate the shift and hold it.');

/* ============================================================ SECTION 29 */

section('scorecard', 'The scorecard: a score per dimension, weights and the weakest', ['Expert m04']);
w('Each dimension scores either `score` directly or 1 - failed / checked. The total is the weighted mean with weights normalised by their sum; with no weights every listed dimension weighs the same. The weakest dimension is the lowest score, and a tie goes to the dimension listed first. There are no grade bands: a band would be an invented number.');
w();
const oilMz = success('modified z on oil', Q.modifiedZScores({ values: PROD.oil }));
const ek3dims = [
  { name: 'completeness', checked: oilC.n, failed: oilC.missing },
  { name: 'validity', checked: rc.checked, failed: rc.failed },
  { name: 'consistency', checked: ps.sums.filter((v) => v !== null).length, failed: ps.failed },
  { name: 'uniqueness', checked: ids.length, failed: new Set(du.pairs.map((p) => p.j)).size },
  { name: 'plausibility', checked: oilMz.n, failed: oilMz.flags.length },
];
w('EKENE-3, each dimension counted from a check printed above: completeness from the oil column, validity from rateCheck, consistency from phaseSumCheck, uniqueness from the well names (a name is failed when it duplicates an earlier one), plausibility from the modified z-score on oil.');
w();
const scEq = success('EKENE-3 scorecard, equal weights', Q.scorecard({ dimensions: ek3dims }));
const WTS = { completeness: 3, validity: 2, consistency: 2, uniqueness: 1, plausibility: 1 };
const scW = success('EKENE-3 scorecard, weighted', Q.scorecard({ dimensions: ek3dims, weights: WTS }));
table(['dimension', 'checked', 'failed', 'score', 'weight, equal', 'weight, stated', 'normalised weight', 'contribution, weighted'], scW.dimensions.map((d, i) => [
  d.name, String(d.checked), String(d.failed), f6(d.score), f6(scEq.dimensions[i].weight), String(WTS[d.name]), f6(d.weight), f6(d.contribution)]));
w();
table(['scorecard', 'total', 'weakest'], [['equal weights', f6(scEq.total), scEq.weakest], [`stated weights ${Object.values(WTS).join(', ')}`, f6(scW.total), scW.weakest]]);
must('the weakest EKENE-3 dimension is uniqueness', scW.weakest === 'uniqueness' && scEq.weakest === 'uniqueness', scW.weakest);
w();
w(`The oil column's modified z flags entries ${list(idxs(oilMz.flags))}, which are days ${list(idxs(oilMz.flags).map(day))}: the negative rate and the shut-in day. The negative rate, day ${day(rc.flags.find((f) => f.rule === 'negative-rate').index)}, is flagged under validity too. A scorecard counts flags from checks, and two checks can flag the same entry.`);
w();
const tie = success('scorecard tie', Q.scorecard({ dimensions: TIE.map(([name, score]) => ({ name, score })) }));
w(`A TIE. Scores ${TIE.map(([, v]) => S(v)).join(', ')} for ${TIE.map(([nm]) => nm).join(', ')} (stated, listed in that order): weakest ${tie.weakest}, total ${f6(tie.total)}.`);
must('day 47 is flagged by both rateCheck and the modified z on oil', rc.flags.some((f) => f.index === 46) && oilMz.flags.some((f) => f.index === 46), 'day 47');
must('a tie goes to the first listed', tie.weakest === 'validity', tie.weakest);
w();
const direct = success('scorecard with direct scores', Q.scorecard({ dimensions: [{ name: 'completeness', score: rhobC.completeness }, { name: 'validity', checked: nphiR.checked, failed: nphiR.failed }] }));
w(`A direct score and a counted one mix: RHOB completeness ${f6(rhobC.completeness)} as a score beside NPHI validity (${nphiR.checked} checked, ${nphiR.failed} failed) gives a total of ${f6(direct.total)}.`);
w();
w(`The basis block, verbatim: weights "${scW.basis.weights}"; score "${scW.basis.score}"; tie break "${scW.basis.tieBreak}".`);

/* ============================================================ SECTION 30 */

section('policy', 'The Petrolord defaults, presented as choices, and the order of checks', ['Expert m05']);
w('Every default below is a choice written in a basis block, open to change by the caller. Where a published source states the number, it is named; where none does, the row says Petrolord.');
w();
const ewDef = Q.ewmaChart({ values: [1, 2], lambda: LAMBDA, target: 1, sigma: 1 });
const idDef = Q.duplicateIdentifiers({ ids: ['A'] });
const hpDef = Q.hampel({ values: [1, 2, 3], halfWindow: 1 });
w('Each default below is read from the basis block of a call that left it unset.');
w();
table(['setting', 'default', 'whose choice'], [
  ['phaseSumCheck relTolerance, on the TOTAL', f6(ps.basis.relTolerance), 'Petrolord'],
  ['phaseSumCheck absTolerance', S(ps.basis.absTolerance), 'Petrolord'],
  ['frozenRuns minRun', S(fzG.basis.minRun), 'Petrolord'],
  ['frozenRuns tolerance, against the run\'s first value', S(fzG.basis.tolerance), 'Petrolord'],
  ['waterCutCheck tolerance', eTxt(wcDef.basis.tolerance), 'Petrolord'],
  ['indexCheck stepTolerance', ix.basis.stepTolerance, 'Petrolord'],
  ['indexCheck expected step', ix.expectedStepSource, 'Petrolord'],
  ['duplicateIdentifiers maxDistance and the digit rule', `${idDef.basis.maxDistance}, ${idDef.basis.digitsMustMatch ? 'digits must match' : 'digits need not match'}`, 'Petrolord'],
  ['mahalanobis alpha', f6(mh.alpha), 'Petrolord'],
  ['zScores threshold', S(zg.threshold), 'the usual convention'],
  ['modifiedZScores threshold', f6(mg.threshold), 'Iglewicz and Hoaglin, as NIST prints it'],
  ['iqrFences k and quartile rule', `${f6(fz.k)}, ${fz.method}`, 'Tukey for k; Petrolord for the rule, so a spreadsheet reproduces it'],
  ['hampel nSigma and MAD scale', `${S(hpDef.basis.nSigma)}, ${S(hpDef.basis.madScale)}`, 'the petrophysics conditioning engine'],
  ['ewmaChart L and limits', `${ewDef.basis.L}, ${ewDef.basis.limits}`, 'NIST 6.3.2.4'],
  ['grubbsTest alpha', f6(g1.basis.alpha), 'NIST 1.3.5.17.1'],
]);
w();
w('THE ORDER OF CHECKS. The control charts refuse a series with a gap, so completeness comes first:');
w();
const orderRef = refusal('individuals on the oil column', Q.individualsChart({ values: PROD.oil }), 'values[30]');
w(`> ${orderRef.error}`);
w();
w('An index that steps back is refused by coverage, so indexCheck comes before coverage. A sentinel is present to completeness and invalid to the range check, so the range check runs before any statistic. A frozen run is an agreement of a meter with itself, and it is found before any outlier test that would read a flat stretch as a perfectly quiet one.');
w();
const FZ = [fzD.runs[0].start - 1, fzD.runs[0].end + 6];
const flatMz = Q.modifiedZScores({ values: CH.DT.values.slice(FZ[0], FZ[1] + 1) });
w(`On the EKENE-7 sonic, entries ${FZ[0]} to ${FZ[1]}, which hold the stuck run, the modified z-score refuses:`);
w();
table(['function', 'the engine\'s refusal, verbatim'], [['`modifiedZScores`', refusal('modified z on the frozen stretch', flatMz, 'values').error]]);

/* ============================================================ SECTION 31 */

section('errata', 'Reading the engine honestly: printed-figure errata and what is not built', ['Expert m06', 'Professional m06 l01']);
w('NIST/SEMATECH printed figures, read against the engine. Each is a note about a published page; the engine reproduces each printed figure within the stated allowance.');
w();
const gNist = success('NIST Grubbs again', Q.grubbsTest(golden('nist-1.3.5.17.1-grubbs-max').args));
const eLcl = ner.lcl;
const roundedFactor = Math.round(Math.sqrt(ne.args.lambda / (2 - ne.args.lambda)) * 10000) / 10000;
const pubOf = (g, field) => g.published.find((x) => x.field === field).value;
const gNistCase = golden('nist-1.3.5.17.1-grubbs-max');
table(['page', 'printed', 'engine', 'what differs'], [
  ['1.3.5.17.1 Grubbs G', S(pubOf(gNistCase, 'statistic')), f6(gNist.statistic), 'truncated rather than rounded; rounded to four decimals the engine reads ' + gNist.statistic.toFixed(4)],
  ['6.3.2.4 EWMA lower limit', S(pubOf(ne, 'lcl')), f6(eLcl), `NIST rounds sqrt(${S(ne.args.lambda)} / ${S(2 - ne.args.lambda)}) to ${roundedFactor.toFixed(4)} before multiplying; to four decimals the engine reads ${eLcl.toFixed(4)}`],
  ['6.3.2.3 CUSUM design h', S(nc.args.h), `${f6(hDesign(NIST_ALPHA))} or ${f6(hDesign(NIST_ALPHA / 2))}, derived`, 'the page\'s own design formula gives neither; the table is reproduced from the printed k and h'],
]);
must('the Grubbs G rounds to 2.4688', gNist.statistic.toFixed(4) === '2.4688', gNist.statistic);
must('the CUSUM design formula gives neither printed h', Math.abs(hDesign(NIST_ALPHA) - nc.args.h) > 0.001 && Math.abs(hDesign(NIST_ALPHA / 2) - nc.args.h) > 0.001, `${hDesign(NIST_ALPHA)} ${hDesign(NIST_ALPHA / 2)}`);
must('the EWMA lower limit rounds to 47.4116', eLcl.toFixed(4) === '47.4116', eLcl);
w();
const TYPO = [[9, '0.54'], [12, '0.47']]; // the two cells the NIST page prints with the wrong sign, quoted as printed
const n9 = ncr.points[TYPO[0][0] - 1]; const n12 = ncr.points[TYPO[1][0] - 1];
w(`The CUSUM page's "${S(nc.args.target)} - k - x" column prints ${TYPO[0][1]} and ${TYPO[1][1]} at groups ${TYPO[0][0]} and ${TYPO[1][0]}. Derived with the printed k: ${f6(nc.args.target - nc.args.k - nc.args.values[TYPO[0][0] - 1])} and ${f6(nc.args.target - nc.args.k - nc.args.values[TYPO[1][0] - 1])}. The S_lo the engine returns at those groups is ${f6(n9.sLow)} and ${f6(n12.sLow)}. That column is not an engine output.`);
w();
w('WHAT IS NOT BUILT, and the engine says so in its basis blocks and messages:');
w();
table(['not built', 'what the engine does instead'], [
  ['a test for several outliers (generalised ESD)', 'Grubbs for one, and the masking it suffers is shown in the Professional tier'],
  ['a robust covariance for Mahalanobis', `the classical estimate, labelled "${mh.basis.covariance}"`],
  ['a CUSUM design helper from alpha and beta', 'k and h are inputs with a stated unit'],
  ['plausibility ranges for any basin or tool', 'definitional limits only; the caller supplies ranges'],
  ['grade bands for a scorecard', 'a total and the weakest dimension'],
  ['unit conversion', 'an unlisted unit is refused'],
  ['a fallback when the MAD is zero', 'a refusal'],
]);
w();
w('WHERE THE OUTPUT NEEDS READING WITH CARE:');
w();
const zPop = success('z population ceiling probe', Q.zScores({ values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1], sd: 'population', threshold: ZPOP_THR }));
w(`- The ceiling follows the chosen standard deviation. With \`sd: 'population'\` on nine zeros and a one (stated) at threshold ${S(ZPOP_THR)}, the engine returns maxPossibleAbsZ ${f6(zPop.maxPossibleAbsZ)}, \`thresholdReachable\` ${zPop.thresholdReachable} and ${zPop.flags.length} flag at z ${f6(zPop.maxAbsZ)}; its basis names the ceiling "${zPop.basis.ceiling}". With the sample SD the same ten values reach ${f6(zg.maxPossibleAbsZ)} at most (${ref('zscore')}).`);
must('population z: the ceiling is sqrt(n - 1) and the flag is reachable', Math.abs(zPop.maxPossibleAbsZ - Math.sqrt(zPop.n - 1)) < 1e-12 && zPop.thresholdReachable === true && zPop.flags.length === 1, JSON.stringify([zPop.maxPossibleAbsZ, zPop.thresholdReachable]));
w(`- A reason string prints every figure as the shortest decimal that reads back to the field it quotes, so a computed statistic prints every digit. The flag above reads, verbatim: "${zPop.flags[0].reason}". Its \`statistic\` field printed at the digest's precision is ${f6(zPop.flags[0].statistic)}. A lesson quotes the field at six decimals, and quotes a reason only as the engine's own words.`);
must('the population flag reason carries the full statistic', zPop.flags[0].reason.includes(String(zPop.flags[0].statistic)) && String(zPop.flags[0].statistic).length > 10, zPop.flags[0].reason);
w('- The Mahalanobis refusal for a singular covariance uses an absolute pivot test inside lib/linalg; variables with very small variance in the caller\'s units can be refused as singular, and rescaling avoids it.');
w('- The Hampel decision is imported from the petrophysics engine, whose own entry point turns a null into 0; `hampel` converts missing values to NaN before the call, so this engine is unaffected.');

/* ============================================================ SECTION 32 */

section('vocabulary', 'Vocabulary this course legislates before a word is written', ['Associate m01', 'Professional m01', 'Expert m01']);
w('Five words in this course carry a narrower meaning than they have in conversation or elsewhere in the academy. The rule for each is binding on every lesson, bank question, key truth and panel.');
w();
table(['word', 'what it can mean elsewhere', 'the rule here'], [
  ['outlier', 'a value that is wrong', 'a value a STATED RULE flags; say which rule. The engine\'s word for the modified z is "potential outlier". A flag is a question about the value'],
  ['sigma', 'any standard deviation', `a standard deviation with its source named: sample SD, MRbar / ${S(K.D2_N2)}, ${S(K.HAMPEL_MAD_SCALE)} x MAD, or historical in-control data`],
  ['control limit', 'a specification or an acceptable range', 'a limit computed from in-control data; never a specification and never a plausibility range'],
  ['missing', 'any bad or absent value', `null, undefined or NaN; a sentinel such as ${S(SENTINEL)} is a present value until converted`],
  ['percentile', 'a P label, whose meaning differs between exceedance and non-exceedance conventions', 'a quantile at a stated probability by a stated rule (R6, R7 or R8); no P label is used anywhere in this course'],
]);
w();
w('No lesson calls any method in this course artificial intelligence or machine learning: every one is a stated statistical rule.');

/* ============================================================ CLOSING CHECKS */

// Every planted defect must have been found by the check named.
T.PLANTED.forEach((p, i) => must(`planted defect ${i} (${p[0]} ${p[1]} ${p[2]}) is checked by some section`, PLANT_FOUND.get(i) === true, PLANT_FOUND.get(i)));
// Every module the course has must be owned by at least one section.
const allMods = Object.entries(MODULES).flatMap(([tier, mods]) => Object.keys(mods).map((m) => `${tier} ${m}`));
const unowned = allMods.filter((m) => !OWNED.has(m));
must('every module of every tier is owned by at least one section', unowned.length === 0, unowned.join(', ') || 'all owned');

const failed = ASSERTS.filter((a) => !a.pass);
if (failed.length) {
  failed.forEach((a) => process.stderr.write(`  FAILED  ${a.claim}\n          ${a.detail}\n`));
  process.stderr.write(`d1_dump: ${ASSERTS.length} assertions, ${failed.length} FAILED. NOTHING WRITTEN.\n`);
  process.exit(1);
}
process.stderr.write(`d1_dump: ${ASSERTS.length} label-and-call, measurement and claim assertions run, 0 failed; ${SECTION} sections\n`);
process.stdout.write(`${OUT.join('\n')}\n`);
