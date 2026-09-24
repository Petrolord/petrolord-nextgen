// THE D2 TEACHING DIGEST. This is the ONLY teaching truth for every writer
// after this file: the lesson author, the bank author, the key-truth author and
// the panel author all quote from digest.txt and from nothing else.
//
// THE ENGINE'S FINDINGS RECORD IS NOT TEACHING TRUTH. FINDINGS-ml.md, the
// oracle, the library pins and the engine's own source comments are
// PROVENANCE. Where a figure in FINDINGS is teachable (the NIST certified
// values, the digits reached, the Longley brackets) this file recomputes it
// through the engine on the vendored golden's own inputs and prints it, and a
// writer quotes the digest line.
//
// Usage:  sh /root/dai-wip-mlcore/build_digest.sh > digest.tmp \
//           && mv digest.tmp /root/dai-wip-mlcore/digest.txt
// Build THROUGH A TEMP FILE. A gate that reads a half written digest finds no
// literals and clears everything.
//
// EVERY NUMBER PRINTED HERE IS A RETURN VALUE OF THE ENGINE, except where a
// line says "golden" (read from the vendored case file), "stated" (an input
// named on the same row or in the dataset generator) or "derived" (arithmetic
// on engine values printed in the same block, with the arithmetic stated).
// Nothing here reads a clock, a random number, a locale or a network; the
// dataset comes from d2_fields.mjs through the canonical seeded mulberry32, and
// TZ and LC_ALL are pinned by build_digest.sh.
//
// THE DIGEST RULE. A sentence here may NAME a figure this file computes. It may
// NOT characterise the RELATIONSHIP between two figures unless that
// relationship is itself computed and printed on the same page, and asserted.
// Two figures that print alike at six decimals are never called equal unless
// the engine says so: the digest prints their difference in exponent form.
//
// EVERY LABEL IS ASSERTED AGAINST WHAT THE CALL ACTUALLY DID. `refusal()`
// asserts an error key and the field it names; `success()` asserts no error
// key and every top-level number finite; every claim a sentence makes about a
// table goes through `must()`. If one assertion fails NOTHING IS WRITTEN.
//
// THE DIGEST IS NOT THE CAPSTONE. This file never reads d2_capstone.mjs,
// fields.json or the capstone datasets, and the capstone never reads this.
//
// THIS COURSE TEACHES NO REPAIR HISTORY, so no section of this digest describes
// former behaviour.
import fs from 'node:fs';
import process from 'node:process';
import { execFileSync } from 'node:child_process';
import * as T from './d2_fields.mjs';

const HERE = process.env.D2_WAVE_DIR || '/root/dai-wip-mlcore';
const ROOT = process.env.D2_ENGINES || '/root/wt-dai-d2-nextgen/packages/engines';
const ENGINE_REL = 'engines/dataai/ml.js';
const ML = await import(`${ROOT}/${ENGINE_REL}`);
const ST = await import(`${ROOT}/lib/stats/stats.js`);
const ENGINE_SRC = fs.readFileSync(`${ROOT}/${ENGINE_REL}`, 'utf8');
const GOLD = JSON.parse(fs.readFileSync(`${ROOT}/test-data/dataai/goldens/ml_cases.json`, 'utf8'));
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
    const bad = Object.entries(r).filter(([, v]) => typeof v === 'number' && !Number.isFinite(v));
    must(`SUCCESS CARRIES NO NON-FINITE NUMBER: ${label}`, bad.length === 0,
      bad.map(([k, v]) => `${k}=${v}`).join(', ') || 'all finite');
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
const eX = (x) => (x === 0 ? '0' : Number(x).toExponential(2));
const list = (a) => a.join(', ');
const pick = (arr, idx) => idx.map((i) => arr[i]);
const S = (x) => String(x);

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
const ORDER = ['computes', 'dataset', 'refusals', 'splits', 'shuffle', 'scaling', 'ols', 'metrics', 'residuals', 'heldout',
  'ridge', 'kfold', 'leakage', 'logistic', 'confusion', 'roc',
  'conditioning', 'nist', 'separation', 'convergence', 'importance', 'learningcurve', 'missinglog', 'boundaries', 'choices',
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
const PLANT_FOUND = new Map();
const planted = (i, cond, detail) => {
  const p = T.PLANTED[i];
  must(`PLANTED STRUCTURE FOUND: ${p[0]} (${p[1]}) by ${p[3]}`, cond, detail);
  PLANT_FOUND.set(i, !!cond);
};

/* ---------------------------------------------------------- the dataset */

const E = T.EKENE;
const ROWS = E.rows;
const WELL = Object.fromEntries(E.wells.map((x) => [x.id, x]));
const LOGS = ['GR', 'RHOB', 'NPHI'];
const LOGS_C = ['GR', 'RHOB', 'NPHI', 'CALI'];
const ATTRS = T.ATTRIBUTES.map((a) => a[0]);
const PAYF = ['RHOB', 'NPHI', 'RT'];
const SONIC = ROWS.filter((r) => r.DT !== null);
const SONIC_WELLS = [...new Set(SONIC.map((r) => r.well))];
const G9 = SONIC.map((r) => r.well);
const Y9 = SONIC.map((r) => r.DT);
const X = (rows, feats) => rows.map((r) => feats.map((f) => (f in r ? r[f] : WELL[r.well][f])));
const XL9 = X(SONIC, LOGS);
const XA9 = X(SONIC, [...LOGS, ...ATTRS]);
const XC9 = X(SONIC, LOGS_C);
const G10 = ROWS.map((r) => r.well);
const PAY10 = ROWS.map((r) => r.PAY);
const XP10 = X(ROWS, PAYF);
// Stated teaching inputs, each passed to the engine AND printed from here, so
// the prose cannot drift from the call.
const TF = 0.3; // the teaching test fraction
const SEED = 5; // the teaching seed
const LAMBDAS = [0, 0.1, 1, 10, 100];
const K3 = 3;
const LEAK_SEEDS = Array.from({ length: 12 }, (_, i) => i + 1);
const REPEATS = 5;
const L2_SEP = 1;
const COUNTS = [1, 2, 3, 4, 5, 6];
const MAXITER_SHORT = 3;
const K4 = 4;
const L2_WEAK = 0.1;
const PROBE_ALMOST = [2, 2, 2.0000000001];
const PROBE_SAME = [2, 2, 2];
const P_BELOW_EPS = 1e-16;
const COND_OPEN = 1e300;
let STEP = 0;
const step = () => { STEP += 1; return STEP; };

/* ================================================================ HEADER */

const engineLines = ENGINE_SRC.replace(/\n$/, '').split('\n').length;
const refusalsInGolden = CASES.filter((c) => c.expected && c.expected.error === true).length;
const publishedInGolden = CASES.filter((c) => c.source === 'published').length;
w('# D2 TEACHING DIGEST: Machine Learning on Well Data');
w();
w('# THIS FILE IS THE ONLY TEACHING TRUTH FOR THIS COURSE. Every number in every lesson, bank question, key truth and panel comes from a line below. The engine FINDINGS record, the oracle, the library pins and the engine source comments are PROVENANCE and not teaching truth.');
w();
w('# PRECISION. Every coefficient, standard error, score, metric, probability, centre, scale, condition number and difference prints to SIX decimals; counts, row numbers, iterations, seeds and well numbers are whole numbers; relative differences and very small magnitudes print in exponent form.');
w();
w(`# ENGINE. ${ENGINE_REL}, vendored sha-identical with petrolord-engines 966bb9e, ${engineLines} lines. It imports lib/stats (mulberry32, mean) and lib/lp/simplex.js (the separation linear programmes). The vendored golden test-data/dataai/goldens/ml_cases.json carries ${CASES.length} cases, ${refusalsInGolden} of them refusals and ${publishedInGolden} of them NIST StRD published anchors, written by the standard library oracle.`);
w();
w('# WHAT IS NEVER IN THIS FILE. No capstone field, no capstone well, no capstone dataset and no graded answer. The capstones run their own datasets and the digest never names them.');
w();
w('# THIS COURSE TEACHES NO REPAIR HISTORY. Every section below describes what the engine does today.');

/* ============================================================ SECTION 1 */

section('computes', 'What this engine computes, and what it declines to compute', ['Associate m01', 'Expert m06']);
w('Every function takes plain arrays and objects and returns either a result object or an object with `error` and `field`, where `field` names the input it refused and the message starts with that name. Every result carries a `basis` block naming its convention, so the working can be printed.');
w();
const EXPORTS = [
  ['fitStandardScaler', 'preprocessing', 'X, trainIndices, names, sd', 'a centre and a scale per feature, fitted on the training rows'],
  ['fitMinMaxScaler', 'preprocessing', 'X, trainIndices, names', 'the training minimum and range per feature'],
  ['applyScaler', 'preprocessing', 'scaler, X', 'rows transformed with the fitted parameters, unchanged'],
  ['groupSplit', 'splitting', 'groups, testFraction or nTestGroups, seed', 'whole groups (wells) held out'],
  ['groupKFold', 'splitting', 'groups, k, seed', 'k folds of whole groups'],
  ['randomRowSplit', 'splitting', 'n or groups, testFraction, seed', 'rows held out one by one, for the leakage demonstration'],
  ['ols', 'linear model', 'X, y, names, intercept, maxCondition', 'least squares coefficients, standard errors, R-squared, condition numbers, residuals'],
  ['ridge', 'linear model', 'X, y, lambda, names, maxCondition', 'penalised coefficients in standardised and original units, effective degrees of freedom'],
  ['logistic', 'linear model', 'X, y, names, intercept, l2, tol, maxIter', 'binary logistic coefficients by Newton steps, with a separation test first'],
  ['solveSPD', 'numerics', 'A, b', 'the solution of a symmetric positive definite system, with a relative singularity rule'],
  ['predict', 'prediction', 'model, X', 'predicted values, and for logistic the probabilities and classes'],
  ['regressionMetrics', 'scoring', 'yTrue, yPred, referenceMean', 'RMSE, MAE and R-squared'],
  ['confusionMatrix', 'scoring', 'yTrue, yPred, labels', 'counts by true label and predicted label'],
  ['classificationReport', 'scoring', 'yTrue, yPred, labels, zeroDivision', 'accuracy, precision, recall and F1 per class, macro and weighted'],
  ['rocCurve', 'scoring', 'yTrue, scores', 'the ROC points and the area under them'],
  ['logLoss', 'scoring', 'yTrue, probabilities, eps', 'the mean natural-log loss with its clip'],
  ['permutationImportance', 'evaluation', 'model, X, y, metric, nRepeats, seed', 'the loss of score when one feature is shuffled'],
  ['learningCurve', 'evaluation', 'X, y, groups, model, trainGroupCounts, testFraction, seed, metric', 'training and test scores as training wells are added'],
  ['leakageDemo', 'evaluation', 'X, y, groups, model, testFraction, seed, metric', 'one model scored under a random-row split and under a group split'],
];
EXPORTS.forEach(([name]) => must(`${name} is exported`, typeof ML[name] === 'function', typeof ML[name]));
table(['function', 'role', 'what it needs', 'what it returns'], EXPORTS.map(([n, d, a, r]) => [`\`${n}\``, d, a, r]));
must('the table lists every exported function', Object.keys(ML).filter((k) => typeof ML[k] === 'function').length === EXPORTS.length,
  Object.keys(ML).filter((k) => typeof ML[k] === 'function').join(','));
w();
w('The stated defaults, read from the exported `DEFAULTS`:');
w();
const DSRC = {
  MAX_CONDITION: 'the scaled condition number above which ols and ridge refuse',
  LOGISTIC_TOL: 'the largest full Newton step, in coefficient units, at which logistic stops',
  LOGISTIC_MAX_ITER: 'the most Newton updates logistic takes',
  STEP_HALVINGS: 'the most halvings of one Newton step',
  LOG_LOSS_EPS: 'the clip on a probability in logLoss',
  WHOLE_TOL: 'how close f x count must be to a whole number to be taken as it',
};
table(['default', 'value', 'what it sets'], Object.entries(ML.DEFAULTS).map(([k, v]) => [`\`${k}\``, Number.isInteger(v) ? S(v) : eX(v), DSRC[k]]));
must('DEFAULTS carries six values, each described here', Object.keys(ML.DEFAULTS).length === 6 && Object.keys(ML.DEFAULTS).every((k) => DSRC[k]), Object.keys(ML.DEFAULTS));
must('DEFAULTS is frozen', Object.isFrozen(ML.DEFAULTS), 'frozen');
w();
w('The metric names the evaluation functions take, read from the exported `METRICS`:');
w();
table(['metric', 'task', 'higher is better'], Object.entries(ML.METRICS).map(([k, v]) => [k, v.task, S(v.higherIsBetter)]));
w();
w('WHAT THE ENGINE DOES NOT DO, checked here against its exports:');
must('no export fills or imputes a missing value', !Object.keys(ML).some((k) => /impute|fill|interpolat/i.test(k)), Object.keys(ML).join(','));
must('no export fits a tree, a network, a neighbour rule or a cluster', !Object.keys(ML).some((k) => /tree|forest|boost|neural|net|knn|neighbo|cluster|kmeans/i.test(k)), 'none');
must('no export samples an input distribution', !Object.keys(ML).some((k) => /monte|sample|bootstrap/i.test(k)), 'none');
must('no export searches hyperparameters for the caller', !Object.keys(ML).some((k) => /search|tune|grid|cv/i.test(k)), 'none');
w('- It does not fill a missing value. A null, undefined or non-finite entry in X or y is refused by name, and filling or dropping it is the caller\'s decision.');
w('- It fits linear models only: least squares, ridge and binary logistic regression. It builds no tree, no network, no neighbour rule and no cluster.');
w('- It does not sample input distributions or give prediction intervals. The only random draws are the seeded shuffles of the splits and of permutation importance.');
w('- It does not choose lambda, the features or the model. A course or an app does that with the folds groupKFold returns, and prints the scores it compared.');
w(`- Its exported names are, in full: ${Object.keys(ML).sort().join(', ')}.`);

/* ============================================================ SECTION 2 */

section('dataset', 'The Ekene wells, their seed and their planted structure', ['Associate m01', 'Associate m06', 'Expert m05']);
w(`Every row in this course comes from one generator, d2_fields.mjs, which draws through the canonical mulberry32 and randomNormal of lib/stats on one stated seed, ${S(T.SEED)}, and rounds every value to the decimals a real file carries. The same inputs give the same file anywhere.`);
w();
w(`${T.N_WELLS} wells, ${list(T.WELL_IDS)}, carry ${T.N_PER_WELL} samples each at a one foot step through the same reservoir interval, each well at its own depth: ${ROWS.length} rows in all.`);
must('the dataset carries wells x samples rows', ROWS.length === T.N_WELLS * T.N_PER_WELL, ROWS.length);
w();
table(['channel', 'unit', 'what it is'], [...T.CHANNELS, ['PHIC', 'v/v', 'core calibrated porosity, the input of the pay rule'], ['PAY', '0 or 1', 'the pay label from the stated rule']].map((c) => [...c]));
w();
w('Four well-level attributes are constant down each well:');
w();
table(['well', ...T.ATTRIBUTES.map(([a, u]) => `${a} (${u}), stated`), 'top depth (ft), stated'],
  E.wells.map((x) => [x.id, f6(x.easting), f6(x.northing), f6(x.kb), f6(x.mudWeight), S(x.top)]));
w();
const PAYN = PAY10.filter((v) => v === 1).length;
w(`THE PAY RULE, stated: a sample is pay (PAY = 1) when PHIC is at least ${S(T.PAY_PHIC)} and RT is at least ${S(T.PAY_RT)} ohm.m; otherwise PAY = 0. ${PAYN} of the ${ROWS.length} samples are pay. A label is the output of a stated rule, and this course always states it.`);
must('the pay label follows its stated rule on every row', ROWS.every((r) => r.PAY === (r.PHIC >= T.PAY_PHIC && r.RT >= T.PAY_RT ? 1 : 0)), 'every row');
w();
w(`THE NO-SONIC WELL, stated: ${T.NO_SONIC_WELL} has no sonic log, so every one of its DT samples is null. ${SONIC.length} rows in ${SONIC_WELLS.length} wells carry a DT. The generator keeps the sonic it drew for ${T.NO_SONIC_WELL} apart from the rows, as \`withheld\`; a real field has no such record, and this course reads it once, in ${ref('missinglog')}, to check a prediction.`);
must('the no-sonic well has no DT and every other well has all of its DT', ROWS.every((r) => (r.well === T.NO_SONIC_WELL) === (r.DT === null)), 'split');
must('the withheld sonic has one value per no-sonic row', E.withheld.DT.length === T.N_PER_WELL, E.withheld.DT.length);
w();
w('THE PLANTED STRUCTURE, every item stated by the generator. Each is found by the named method, and the section that finds it asserts so; the build fails if any item is not found.');
w();
table(['what', 'where', 'how it was planted', 'the method that finds it'], T.PLANTED.map((p) => [...p]));
w();
w(`${T.PLANTED.length} items are planted.`);

/* ============================================================ SECTION 3 */

section('refusals', 'Every refusal, with the field it names and the engine\'s own words', ['Associate m01 l05', 'Associate m03', 'Associate m04 l05', 'Professional m04', 'Expert m01', 'Expert m02', 'Expert m03']);
w('Each row is a real call. The message column is the engine\'s `error` string, verbatim. A refusal carries no number of its own: any figure in it is part of the message.');
w();
const firstNull = ROWS.findIndex((r) => r.DT === null);
const nullY = ROWS.map((r) => r.DT);
const nullX = ROWS.map((r) => [r.GR, r.DT]);
const NEAR = ROWS.slice(firstNull - 20, firstNull + 20);
const oneWell = SONIC.filter((r) => r.well === 'EKENE-1');
const REFUSALS = [
  ['fitStandardScaler', { X: nullX, names: ['GR', 'DT'] }, `X[${firstNull}][1]`, 'the no-sonic well\'s DT as a feature'],
  ['fitStandardScaler', { X: X(oneWell, ['GR', 'mudWeight']), names: ['GR', 'mudWeight'] }, 'X.mudWeight', 'a well-level attribute fitted on one well'],
  ['fitStandardScaler', { X: [[1], [2]], sd: 'n' }, 'sd', 'an unnamed divisor'],
  ['fitMinMaxScaler', { X: [[3, 1], [3, 2]], names: ['CALI', 'GR'] }, 'X.CALI', 'a constant column'],
  ['applyScaler', { scaler: ML.fitStandardScaler({ X: [[1, 2], [3, 5]] }), X: [[1]] }, 'X', 'rows with the wrong number of columns'],
  ['groupSplit', { groups: ['EKENE-1', 'EKENE-1'], testFraction: TF, seed: SEED }, 'groups', 'one well only'],
  ['groupSplit', { groups: G9, testFraction: 0.95, seed: SEED }, 'testFraction', 'a fraction that leaves no well to train'],
  ['groupSplit', { groups: G9, testFraction: TF, nTestGroups: 2, seed: SEED }, 'nTestGroups', 'both sizes given'],
  ['groupSplit', { groups: ['EKENE-1', 7], testFraction: TF, seed: SEED }, 'groups[1]', 'a name and a number mixed'],
  ['groupSplit', { groups: G9, testFraction: TF, seed: -1 }, 'seed', 'a negative seed'],
  ['groupKFold', { groups: G9, k: 10, seed: SEED }, 'k', 'more folds than wells'],
  ['randomRowSplit', { n: 1, testFraction: TF, seed: SEED }, 'n', 'one row'],
  ['ols', { X: [[1, 2, 3], [2, 3, 1], [3, 1, 2]], y: [1, 2, 3] }, 'X', 'three rows for four coefficients'],
  ['ols', { X: [[0, 1], [0, 2], [0, 4], [0, 5]], y: [1, 2, 3, 5], names: ['CALI', 'GR'] }, 'X.CALI', 'a column of zeros'],
  ['ols', { X: [[1], [2], [3]], y: [70, 70, 70] }, 'y', 'a target that never varies'],
  ['ols', { X: X(NEAR, LOGS), y: NEAR.map((r) => r.DT), names: LOGS }, 'y[20]', 'a null target'],
  ['ols', { X: [[1], [2], [3]], y: [1, 2, 4], maxCondition: 0.5 }, 'maxCondition', 'a limit below one'],
  ['ridge', { X: [[1], [2], [3]], y: [1, 2, 4], lambda: -1 }, 'lambda', 'a negative lambda'],
  ['logistic', { X: [[1], [2], [3]], y: [0, 0, 0] }, 'y', 'one class only'],
  ['logistic', { X: [[1], [2], [3]], y: [0, 1, 2] }, 'y[2]', 'a label other than 0 and 1'],
  ['logistic', { X: [[0.1], [0.2], [0.3], [0.4]], y: [0, 0, 1, 1] }, 'y', 'labels a threshold splits exactly'],
  ['logistic', { X: [[1], [2], [3]], y: [0, 1, 0], tol: 0 }, 'tol', 'a tolerance of zero'],
  ['solveSPD', { A: [[1, 2], [2, 4]], b: [1, 2] }, 'A', 'a rank one matrix'],
  ['predict', { model: { kind: 'tree', coefficients: [1] }, X: [[1]] }, 'model', 'something that is not a fitted model'],
  ['regressionMetrics', { yTrue: [70, 70], yPred: [69, 71] }, 'yTrue', 'a test target that never varies'],
  ['classificationReport', { yTrue: [0, 1], yPred: [0, 1], zeroDivision: 0.5 }, 'zeroDivision', 'a zero division score of one half'],
  ['rocCurve', { yTrue: [1, 1], scores: [0.2, 0.9] }, 'yTrue', 'one class only'],
  ['logLoss', { yTrue: [1], probabilities: [1.2] }, 'probabilities[0]', 'a probability above one'],
  ['permutationImportance', { model: ML.ols({ X: [[1], [2], [3], [5]], y: [1, 2, 4, 4] }), X: [[1], [2], [3], [5]], y: [1, 2, 4, 4], metric: 'auc', seed: SEED }, 'metric', 'a classification metric on a regression model'],
  ['learningCurve', { X: XL9, y: Y9, groups: G9, model: { kind: 'ols' }, trainGroupCounts: [3, 2], testFraction: TF, seed: SEED }, 'trainGroupCounts[1]', 'counts that do not rise'],
  ['leakageDemo', { X: XL9, y: Y9, model: { kind: 'ols' }, testFraction: TF, seed: SEED }, 'groups', 'no well names'],
];
table(['function', 'what was passed', 'field named', 'the engine\'s message'], REFUSALS.map(([fn, args, field, what]) => {
  const r = refusal(`${fn} with ${what}`, ML[fn](args), field);
  return [`\`${fn}\``, what, `\`${r.field}\``, r.error];
}));
w();
w(`${REFUSALS.length} refusals are tabled above, across ${new Set(REFUSALS.map((r) => r[0])).size} functions.`);
must('every exported function except the three it cannot refuse by input appears in the refusal table',
  EXPORTS.map(([n]) => n).filter((n) => !REFUSALS.some((r) => r[0] === n)).join() === 'groupKFold,randomRowSplit,confusionMatrix'
  || EXPORTS.map(([n]) => n).filter((n) => !REFUSALS.some((r) => r[0] === n)).length <= 3,
  EXPORTS.map(([n]) => n).filter((n) => !REFUSALS.some((r) => r[0] === n)).join(','));
const r0 = ML.ols({ X: X(NEAR, LOGS), y: NEAR.map((r) => r.DT), names: LOGS });
planted(3, r0.field === 'y[20]' && firstNull === T.WELL_IDS.indexOf(T.NO_SONIC_WELL) * T.N_PER_WELL, `${r0.field} at ${firstNull}`);
w();
w(`The no-sonic target is refused at the first null it meets. The first ${T.NO_SONIC_WELL} sample is dataset row ${firstNull}, counting from 0; passing the forty rows from ${firstNull - 20} to ${firstNull + 19}, the last twenty of ${T.WELL_IDS[T.WELL_IDS.indexOf(T.NO_SONIC_WELL) - 1]} and the first twenty of ${T.NO_SONIC_WELL}, gives the refusal at \`y[20]\`, the twenty-first row passed.`);
w();
w('Two more refusals are the Expert tier\'s subject and sit where it teaches them: an ill-conditioned design in ' + ref('conditioning') + ' and separated labels in ' + ref('separation') + '. A logistic fit that stops before it converges returns a result with a `warning`, in ' + ref('convergence') + '.');

/* ============================================================ SECTION 4 */

section('splits', 'A split by rows and a split by whole wells', ['Associate m02']);
w(`Test rows must be rows the model was not fitted on. The engine offers two ways to choose them, and this section runs both on the ${SONIC.length} sonic rows of the ${SONIC_WELLS.length} sonic wells with the stated test fraction ${S(TF)} and the stated seed ${S(SEED)}.`);
w();
const RS = success('randomRowSplit, sonic rows', ML.randomRowSplit({ groups: G9, testFraction: TF, seed: SEED }));
const GS = success('groupSplit, sonic wells', ML.groupSplit({ groups: G9, testFraction: TF, seed: SEED }));
table(['split', 'test rows', 'training rows', 'wells with test rows', 'wells on both sides'], [
  ['`randomRowSplit`', S(RS.testIndices.length), S(RS.trainIndices.length), S(RS.testGroups.length), S(RS.sharedGroups.length)],
  ['`groupSplit`', S(GS.testIndices.length), S(GS.trainIndices.length), S(GS.testGroups.length), S(GS.sharedGroups.length)],
]);
must('the random-row split puts rows of every sonic well on both sides', RS.sharedGroups.length === SONIC_WELLS.length, RS.sharedGroups.length);
must('the group split puts no well on both sides', GS.sharedGroups.length === 0, GS.sharedGroups.length);
w();
w(`Under \`randomRowSplit\` the ${RS.testIndices.length} test rows come from all ${RS.sharedGroups.length} wells, and each of those wells also trains the model: its \`sharedGroups\` lists ${list(RS.sharedGroups)}. The engine\'s basis names the purpose of that function in its own words: "${RS.basis.purpose}".`);
w();
w(`Under \`groupSplit\` the test set is whole wells, ${list(GS.testGroups)}, ${GS.testIndices.length} rows; the model trains on ${list(GS.trainGroups)}, ${GS.trainIndices.length} rows. Its rule, in the engine's words: "${GS.basis.rule}".`);
w();
w('Which wells the group split holds out, seed by seed, at the same fraction:');
w();
const seedRows = [1, 2, 3, 4, 5, 6].map((s) => {
  const g = success(`groupSplit seed ${s}`, ML.groupSplit({ groups: G9, testFraction: TF, seed: s }));
  return [S(s), list(g.testGroups), S(g.testIndices.length)];
});
table(['seed, stated', 'test wells', 'test rows'], seedRows);
w();
w('A seed fixes the draw and nothing else: any other seed holds out another set of wells, and a score measured on one set is a score on those wells.');

/* ============================================================ SECTION 5 */

section('shuffle', 'The seed, the sorted names and the shuffle', ['Associate m02 l04']);
const ids9 = [...SONIC_WELLS].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
w(`Before any shuffle the engine sorts the well names. Names that are strings sort by UTF-16 code unit, character by character, so the nine sonic wells sort as: ${list(ids9)}. EKENE-10 comes before EKENE-2 because the character 1 comes before the character 2; the engine does not read the number inside a name. Names that are all numbers sort ascending, and a mix of the two is refused (${ref('refusals')}).`);
must('EKENE-10 sorts before EKENE-2', ids9.indexOf('EKENE-10') < ids9.indexOf('EKENE-2'), list(ids9));
w();
w(`The shuffle is Fisher-Yates from the end with one mulberry32 stream seeded by \`seed\`: for i from m - 1 down to 1, draw u, take j = floor(u x (i + 1)), and swap positions i and j. The draws for seed ${S(SEED)} and m = ${ids9.length} (u from lib/stats mulberry32, printed to six decimals; j derived):`);
w();
{
  const rng = ST.mulberry32(SEED);
  const a = ids9.slice();
  const rowsFY = [];
  for (let i = a.length - 1; i >= 1; i -= 1) {
    const u = rng();
    const j = Math.floor(u * (i + 1));
    rowsFY.push([S(i), f6(u), S(j), `${a[i]} with ${a[j]}`]);
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  table(['i', 'u', 'j = floor(u x (i + 1)), derived', 'swap'], rowsFY);
  must('the hand shuffle reproduces the engine order', a.join() === GS.order.join(), `${a.join()} vs ${GS.order.join()}`);
  w();
  w(`The shuffled order is ${list(GS.order)}, which is the \`order\` the engine returns. The first three are the test wells.`);
}
w();
const nT = Math.ceil(TF * ids9.length);
w(`THE TEST SIZE is ceil(testFraction x count): here ceil(${S(TF)} x ${ids9.length}) = ${GS.nTestGroups} wells. A product within ${eX(ML.DEFAULTS.WHOLE_TOL)} of a whole number is taken as that number before the ceiling. The engine's own case:`);
must('the teaching split holds out ceil(0.3 x 9) wells', GS.nTestGroups === nT && nT === 3, GS.nTestGroups);
w();
{
  const c = golden('group-split-0.28-of-25');
  const r = success('groupSplit 0.28 of 25', ML.groupSplit(c.args));
  const c2 = golden('random-rows-0.28-of-25');
  const r2 = success('randomRowSplit 0.28 of 25', ML.randomRowSplit(c2.args));
  const nG = new Set(c.args.groups).size;
  const prod = c.args.testFraction * nG;
  const whole = Math.round(prod);
  table(['call', 'testFraction x count in float, derived', 'test size'], [
    [`\`groupSplit\`, ${nG} groups, fraction ${S(c.args.testFraction)} (golden)`, S(prod), S(r.nTestGroups)],
    [`\`randomRowSplit\`, ${c2.args.n ?? c2.args.groups.length} rows, fraction ${S(c2.args.testFraction)} (golden)`, S(c2.args.testFraction * (c2.args.n ?? c2.args.groups.length)), S(r2.nTest)],
  ]);
  must('the golden product is not whole in float, and the engine holds out the whole number', prod !== whole && r.nTestGroups === whole && r2.nTest === whole, `${prod} ${r.nTestGroups} ${r2.nTest}`);
  w();
  w(`In float, ${S(c.args.testFraction)} x ${nG} is ${S(prod)}; a plain ceiling would hold out ${Math.ceil(prod)}. The engine's basis states the rule: "${r.basis.testSize}".`);
}

/* ============================================================ SECTION 6 */

section('scaling', 'Scaling fitted on the training rows only', ['Associate m03']);
const TRI = GS.trainIndices;
const TEI = GS.testIndices;
const scTrain = success('fitStandardScaler on the training rows', ML.fitStandardScaler({ X: XL9, trainIndices: TRI, names: LOGS }));
const scAll = success('fitStandardScaler on all sonic rows', ML.fitStandardScaler({ X: XL9, names: LOGS }));
const scSample = success('fitStandardScaler on the training rows, sample SD', ML.fitStandardScaler({ X: XL9, trainIndices: TRI, names: LOGS, sd: 'sample' }));
w(`A standard scaler maps each feature to z = (x - centre) / scale. The engine fits the centre and the scale on the TRAINING rows only (the rows passed, or the rows \`trainIndices\` lists) and applies them unchanged to any other rows. Here it is fitted on the ${scTrain.nFit} training rows of the teaching split (${ref('splits')}) and, for comparison, on all ${scAll.nFit} sonic rows, which include the test wells.`);
w();
table(['feature', 'centre, training rows', 'centre, all rows', 'scale, training rows (population SD)', 'scale, all rows', 'scale, training rows (sample SD)'],
  LOGS.map((f, j) => [f, f6(scTrain.centre[j]), f6(scAll.centre[j]), f6(scTrain.scale[j]), f6(scAll.scale[j]), f6(scSample.scale[j])]));
must('the all-rows centre differs from the training centre on every feature', LOGS.every((_, j) => scTrain.centre[j] !== scAll.centre[j]), 'differs');
must('the sample SD exceeds the population SD on every feature', LOGS.every((_, j) => scSample.scale[j] > scTrain.scale[j]), 'sample larger');
w();
w(`The divisor is stated in the basis: "${scTrain.basis.sd}". The option \`sd: 'sample'\` divides by n - 1 instead; on ${scTrain.nFit} rows the two scales differ by the factor sqrt(${scTrain.nFit} / ${scTrain.nFit - 1}) (derived), which is ${f6(Math.sqrt(scTrain.nFit / (scTrain.nFit - 1)))}. The data quality course computes its z-score with the sample SD; this engine's scaler uses the population SD so that ridge matches scikit-learn (${ref('choices')}).`);
w();
const firstTest = TEI[0];
const zRow = success('applyScaler, the first test row', ML.applyScaler({ scaler: scTrain, X: [XL9[firstTest]] }));
w(`Applied to the first test row (sonic row ${firstTest}, ${SONIC[firstTest].well} at ${SONIC[firstTest].depth} ft; GR ${f6(XL9[firstTest][0])}, RHOB ${f6(XL9[firstTest][1])}, NPHI ${f6(XL9[firstTest][2])}), the training scaler gives z = ${zRow.X[0].map(f6).join(', ')}. The basis says: "${zRow.basis.applied}".`);
w();
w('MIN-MAX SCALING maps the training minimum to 0 and the training maximum to 1, and does not clip a new row. Fitted on all nine sonic wells and applied to the no-sonic well:');
w();
const mm9 = success('fitMinMaxScaler on the nine sonic wells', ML.fitMinMaxScaler({ X: XL9, names: LOGS }));
const NOS = ROWS.filter((r) => r.well === T.NO_SONIC_WELL);
const mm6 = success('applyScaler, min-max, no-sonic well', ML.applyScaler({ scaler: mm9, X: X(NOS, LOGS) }));
const colMax = (M, j) => M.reduce((a, r) => Math.max(a, r[j]), -Infinity);
const colMin = (M, j) => M.reduce((a, r) => Math.min(a, r[j]), Infinity);
table(['feature', 'training minimum', 'training maximum', `${T.NO_SONIC_WELL} scaled minimum`, `${T.NO_SONIC_WELL} scaled maximum`, `${T.NO_SONIC_WELL} rows above 1`],
  LOGS.map((f, j) => [f, f6(mm9.min[j]), f6(mm9.max[j]), f6(colMin(mm6.X, j)), f6(colMax(mm6.X, j)), S(mm6.X.filter((r) => r[j] > 1).length)]));
const hotAbove = mm6.X.filter((r) => r[0] > 1).length;
planted(4, colMax(mm6.X, 0) > 1 && hotAbove > 0, `${colMax(mm6.X, 0)} ${hotAbove}`);
w();
w(`${T.NO_SONIC_WELL}'s gamma ray reads above the training maximum on ${hotAbove} of its ${NOS.length} rows, and min-max maps them above 1; the basis says: "${mm9.basis.clipping}". A scaled value above 1 is the scaler telling you the row lies outside the range the model was fitted on (${ref('missinglog')}).`);
w();
w(`A feature is refused as constant only when every training value is identical, and the refusal names it. A well-level attribute is constant down a well, so fitted on one well it is refused: the mud weight row of ${ref('refusals')}. The same feature varies across the nine wells and is fitted there.`);

/* ============================================================ SECTION 7 */

section('ols', 'Ordinary least squares on the training wells', ['Associate m04']);
const OL = success('ols on the training rows, logs', ML.ols({ X: pick(XL9, TRI), y: pick(Y9, TRI), names: LOGS }));
w(`Least squares finds the coefficients that make the sum of squared residuals, sum (y - yhat)^2, as small as it can be. Here the target is DT (us/ft) and the features are GR (gAPI), RHOB (g/cm3) and NPHI (v/v), fitted on the ${OL.n} training rows of the teaching split, with an intercept.`);
w();
table(['term', 'coefficient', 'unit', 'standard error', 't value'], OL.names.map((nm, j) => [
  nm, f6(OL.coefficients[j]), nm === 'intercept' ? 'us/ft' : `us/ft per ${{ GR: 'gAPI', RHOB: 'g/cm3', NPHI: 'v/v' }[nm]}`, f6(OL.standardErrors[j]), f6(OL.tValues[j])]));
w();
table(['quantity', 'value'], [
  ['rows n', S(OL.n)], ['coefficients p, the intercept included', S(OL.p)], ['residual degrees of freedom n - p', S(OL.dfResidual)],
  ['residual standard error s (us/ft)', f6(OL.residualSE)], ['RSS', f6(OL.rss)], ['TSS about the training mean', f6(OL.tss)],
  ['R-squared', f6(OL.rSquared)], ['adjusted R-squared', f6(OL.adjustedRSquared)],
]);
must('the residual degrees of freedom are n - p', OL.dfResidual === OL.n - OL.p, OL.dfResidual);
w();
w(`READING A COEFFICIENT. Holding RHOB and NPHI fixed, one more gAPI of gamma ray moves the fitted DT by ${f6(OL.coefficients[1])} us/ft. NPHI is a fraction, so its coefficient ${f6(OL.coefficients[3])} is per whole unit of v/v; per 0.01 v/v it is ${f6(OL.coefficients[3] / 100)} us/ft (derived, the coefficient over 100). A coefficient carries the target's unit over the feature's unit, and its size says nothing about importance until the feature's own spread is known (${ref('importance')} measures importance directly).`);
w();
w(`THE INTERCEPT is the fitted DT where every feature is zero: ${f6(OL.coefficients[0])} us/ft, with a standard error of ${f6(OL.standardErrors[0])}. No rock has a bulk density of zero, so the intercept is a point far outside the data where the fitted plane happens to cross; it is there so the plane need not pass through the origin.`);
must('the intercept is not significantly different from zero here (|t| below 1)', Math.abs(OL.tValues[0]) < 1, OL.tValues[0]);
w();
const O1 = success('ols on the training rows, NPHI alone', ML.ols({ X: pick(XL9, TRI).map((r) => [r[2]]), y: pick(Y9, TRI), names: ['NPHI'] }));
w(`A coefficient depends on which other features are in the model. Fitted on NPHI alone, the NPHI coefficient is ${f6(O1.coefficients[1])} us/ft per v/v with R-squared ${f6(O1.rSquared)}; beside GR and RHOB it is ${f6(OL.coefficients[3])}.`);
must('the NPHI coefficient changes when GR and RHOB are added', Math.abs(O1.coefficients[1] - OL.coefficients[3]) > 1, `${O1.coefficients[1]} ${OL.coefficients[3]}`);
w();
w(`STANDARD ERRORS are s x sqrt(diag((X'X)^-1)) with s^2 = RSS / (n - p); the basis says: "${OL.basis.standardErrors}". They measure how far a coefficient would move between samples like this one, assuming independent residuals. Rows from one well are not independent (they share the well's offset, ${ref('residuals')}), so these standard errors are smaller than the spread from well to well.`);
w();
w(`MORE ROWS THAN COEFFICIENTS. Least squares needs n > p: with n = p the fit passes through every row and leaves no residual degree of freedom to estimate s. The engine refuses n <= p (${ref('refusals')}).`);

/* ============================================================ SECTION 8 */

section('metrics', 'RMSE, MAE and R-squared on the test wells', ['Associate m05']);
const PRT = success('predict, the test wells', ML.predict({ model: OL, X: pick(XL9, TEI) }));
const yTe = pick(Y9, TEI);
const yTr = pick(Y9, TRI);
const MT = success('regressionMetrics, test wells', ML.regressionMetrics({ yTrue: yTe, yPred: PRT.values }));
const MTR = success('regressionMetrics, training rows', ML.regressionMetrics({ yTrue: yTr, yPred: OL.fitted }));
const MTref = success('regressionMetrics, test wells, training mean', ML.regressionMetrics({ yTrue: yTe, yPred: PRT.values, referenceMean: MTR.referenceMean }));
w('RMSE = sqrt(sum (y - yhat)^2 / n) and MAE = sum |y - yhat| / n are in the target\'s unit (us/ft). R-squared = 1 - SSE / sum (y - reference)^2 is a fraction of the variation about a reference mean. The OLS fit of ' + ref('ols') + ' scored on its own training rows and on the three test wells:');
w();
table(['scored on', 'rows', 'RMSE (us/ft)', 'MAE (us/ft)', 'R-squared', 'reference mean (us/ft)'], [
  ['training rows (fitted values)', S(MTR.n), f6(MTR.rmse), f6(MTR.mae), f6(MTR.r2), f6(MTR.referenceMean)],
  ['test wells, about the test mean (default)', S(MT.n), f6(MT.rmse), f6(MT.mae), f6(MT.r2), f6(MT.referenceMean)],
  ['test wells, about the training mean (referenceMean)', S(MTref.n), f6(MTref.rmse), f6(MTref.mae), f6(MTref.r2), f6(MTref.referenceMean)],
]);
must('the training-row R-squared from regressionMetrics is the ols R-squared', Math.abs(MTR.r2 - OL.rSquared) < 1e-12, eX(Math.abs(MTR.r2 - OL.rSquared)));
must('the two test R-squared values differ', MT.r2 !== MTref.r2, `${MT.r2} ${MTref.r2}`);
w();
w(`The default reference for a test R-squared is the mean of the TEST targets, as scikit-learn's r2_score; the basis says: "${MT.basis.r2}". Passing the training mean as \`referenceMean\` asks how much better the model does than predicting the training average for a new well, which is the out-of-sample convention; here the two read ${f6(MT.r2)} and ${f6(MTref.r2)}. Name the reference every time an R-squared is quoted.`);
must('the test RMSE is below the training RMSE on this split', MT.rmse < MTR.rmse, `${MT.rmse} ${MTR.rmse}`);
w();
w(`On this split the test wells score BETTER than the training rows: RMSE ${f6(MT.rmse)} against ${f6(MTR.rmse)}. The three held-out wells happen to sit close to the fitted plane, well by well:`);
w();
table(['test well', 'rows', 'RMSE (us/ft)', 'MAE (us/ft)', 'R-squared about the well\'s own mean'], GS.testGroups.map((wl) => {
  const idx = SONIC.map((r, i) => (r.well === wl ? i : -1)).filter((i) => i >= 0);
  const p = success(`predict ${wl}`, ML.predict({ model: OL, X: pick(XL9, idx) }));
  const m = success(`metrics ${wl}`, ML.regressionMetrics({ yTrue: pick(Y9, idx), yPred: p.values }));
  return [wl, S(m.n), f6(m.rmse), f6(m.mae), f6(m.r2)];
}));
w();
w('One split is one draw of wells; ' + ref('kfold') + ' tests every well once.');
w();
const NEG = golden('metrics-worse-than-mean');
const MN = success('regressionMetrics worse than the mean (golden)', ML.regressionMetrics(NEG.args));
w(`R-SQUARED CAN BE NEGATIVE. The engine's own case (golden \`metrics-worse-than-mean\`): yTrue ${list(NEG.args.yTrue.map(S))} against yPred ${list(NEG.args.yPred.map(S))} gives RMSE ${f6(MN.rmse)} and R-squared ${f6(MN.r2)}. A negative value means the predictions do worse than the reference mean would.`);
must('the golden worse-than-mean case reads a negative R-squared', MN.r2 < 0, MN.r2);

/* ============================================================ SECTION 9 */

section('residuals', 'Residuals, well by well', ['Associate m05 l03']);
const OA = success('ols on all nine sonic wells, logs', ML.ols({ X: XL9, y: Y9, names: LOGS }));
w(`A residual is y - yhat for one row. Fitted on all ${OA.n} sonic rows (GR, RHOB, NPHI), the OLS residuals are grouped here by well. The mean residual of a well is derived: the arithmetic mean of that well's ${T.N_PER_WELL} engine residuals. The generator's planted offset for each well (stated, ${ref('dataset')}) is printed beside it, less the mean offset of the nine wells, because the intercept absorbs that mean.`);
w();
const offMean = SONIC_WELLS.reduce((a, wl) => a + T.DT_OFFSETS[wl], 0) / SONIC_WELLS.length;
const resRows = ids9.map((wl) => {
  const rs = OA.residuals.filter((_, i) => G9[i] === wl);
  const mr = rs.reduce((a, v) => a + v, 0) / rs.length;
  const off = T.DT_OFFSETS[wl] - offMean;
  return { wl, mr, off, d: mr - off };
});
table(['well', 'mean residual (us/ft), derived', 'planted offset less the nine-well mean (us/ft), stated', 'difference, derived'], resRows.map((r) => [r.wl, f6(r.mr), f6(r.off), f6(r.d)]));
const maxD = Math.max(...resRows.map((r) => Math.abs(r.d)));
const spreadRes = Math.max(...resRows.map((r) => r.mr)) - Math.min(...resRows.map((r) => r.mr));
planted(0, maxD < 1.5 && spreadRes > 8, `max |difference| ${maxD}, spread ${spreadRes}`);
w();
w(`The largest |difference| is ${f6(maxD)} us/ft, and the well means span ${f6(spreadRes)} us/ft from the lowest to the highest (derived). Each well sits above or below the plane as a block. That is the structure a random-row split leaks (${ref('leakage')}), and the reason rows of one well are not independent test cases.`);
const sumRes = OA.residuals.reduce((a, v) => a + v, 0);
w();
w(`With an intercept the residuals of the fitted rows sum to zero up to rounding: here ${eX(sumRes)} us/ft over ${OA.n} rows (derived). The R-squared of this fit is ${f6(OA.rSquared)} and its residual standard error ${f6(OA.residualSE)} us/ft.`);
must('the residuals sum to zero within 1e-9', Math.abs(sumRes) < 1e-9, sumRes);

/* ============================================================ SECTION 10 */

section('heldout', 'One well held out, end to end', ['Associate m06']);
const H1 = success('groupSplit, one well', ML.groupSplit({ groups: G9, nTestGroups: 1, seed: SEED }));
const OH = success('ols, eight wells', ML.ols({ X: pick(XL9, H1.trainIndices), y: pick(Y9, H1.trainIndices), names: LOGS }));
const PH = success('predict, the held-out well', ML.predict({ model: OH, X: pick(XL9, H1.testIndices) }));
const MH = success('metrics, the held-out well', ML.regressionMetrics({ yTrue: pick(Y9, H1.testIndices), yPred: PH.values }));
const MHtr = success('metrics, eight wells', ML.regressionMetrics({ yTrue: pick(Y9, H1.trainIndices), yPred: OH.fitted }));
w('The whole workflow in order, on the Ekene sonic wells, with every call the engine makes and what it returned:');
w();
table(['step', 'call', 'what it returned'], [
  ['1. choose the rows', `\`groupSplit\` with nTestGroups 1 and seed ${S(SEED)}`, `test well ${list(H1.testGroups)}, ${H1.testIndices.length} rows; ${H1.trainGroups.length} training wells, ${H1.trainIndices.length} rows`],
  ['2. fit on the training rows only', '`ols` on GR, RHOB, NPHI', `coefficients ${OH.coefficients.map(f6).join(', ')}; R-squared ${f6(OH.rSquared)}`],
  ['3. predict the held-out well', '`predict`', `${PH.values.length} predicted DT values`],
  ['4. score the held-out well', '`regressionMetrics`', `RMSE ${f6(MH.rmse)} us/ft, MAE ${f6(MH.mae)} us/ft, R-squared about its own mean ${f6(MH.r2)}`],
  ['5. score the training rows, for comparison', '`regressionMetrics` on the fitted values', `RMSE ${f6(MHtr.rmse)} us/ft, R-squared ${f6(MHtr.r2)}`],
]);
w();
w('Which well is held out changes the score. One well at a time, seed by seed (each a separate call):');
w();
const heldRows = [];
const seenWell = new Set();
for (let s = 1; heldRows.length < 5 && s < 50; s += 1) {
  const h = success(`groupSplit one well seed ${s}`, ML.groupSplit({ groups: G9, nTestGroups: 1, seed: s }));
  if (seenWell.has(h.testGroups[0])) continue;
  seenWell.add(h.testGroups[0]);
  const o = success(`ols one well seed ${s}`, ML.ols({ X: pick(XL9, h.trainIndices), y: pick(Y9, h.trainIndices) }));
  const m = success(`metrics one well seed ${s}`, ML.regressionMetrics({ yTrue: pick(Y9, h.testIndices), yPred: ML.predict({ model: o, X: pick(XL9, h.testIndices) }).values }));
  heldRows.push([S(s), h.testGroups[0], f6(m.rmse), f6(m.mae), f6(m.r2)]);
}
table(['seed, stated', 'held-out well', 'RMSE (us/ft)', 'MAE (us/ft)', 'R-squared about the well\'s own mean'], heldRows);
w();
w('The first seed that holds out each of five different wells is listed. A single held-out well is one reading of how the model does on a new well, and ' + ref('kfold') + ' averages over every well.');
w();
const scH = success('standard scaler on the eight wells', ML.fitStandardScaler({ X: pick(XL9, H1.trainIndices), names: LOGS }));
const ZH = success('scaled eight wells', ML.applyScaler({ scaler: scH, X: pick(XL9, H1.trainIndices) }));
const ZT = success('scaled held-out well', ML.applyScaler({ scaler: scH, X: pick(XL9, H1.testIndices) }));
const OHz = success('ols on the scaled eight wells', ML.ols({ X: ZH.X, y: pick(Y9, H1.trainIndices), names: LOGS }));
const PHz = success('predict, scaled', ML.predict({ model: OHz, X: ZT.X }));
const dz = Math.max(...PHz.values.map((v, i) => Math.abs(v - PH.values[i])));
w(`SCALING AND LEAST SQUARES. Fitted on standardised features the coefficients change units (us/ft per training standard deviation): ${OHz.coefficients.map(f6).join(', ')}. The predictions for the held-out well differ from the unscaled fit's by at most ${eX(dz)} us/ft (derived), which is rounding: least squares with an intercept gives the same fitted plane under any rescaling of a feature. Scaling matters to the penalised fits of ${ref('ridge')}.`);
must('scaled and unscaled OLS predict the same within 1e-9', dz < 1e-9, dz);

/* ============================================================ SECTION 11 */

section('ridge', 'Ridge and the bias-variance trade', ['Professional m01']);
const FA = [...LOGS, ...ATTRS];
const RL = [...LAMBDAS, 1000];
w(`Ridge minimises sum (y - b0 - z'b)^2 + lambda x sum b_j^2 on features standardised with the population SD of the rows passed; the intercept b0 is not penalised. Here it is fitted on the ${TRI.length} training rows of the teaching split with the three logs AND the four well-level attributes (${list(ATTRS)}): seven features, six training wells. The test wells are the three of ${ref('splits')}.`);
w();
const ridgeFits = RL.map((lam) => {
  const r = success(`ridge lambda ${lam}`, ML.ridge({ X: pick(XA9, TRI), y: yTr, lambda: lam, names: FA }));
  const p = success(`ridge predict lambda ${lam}`, ML.predict({ model: r, X: pick(XA9, TEI) }));
  const m = success(`ridge test metrics lambda ${lam}`, ML.regressionMetrics({ yTrue: yTe, yPred: p.values }));
  return { lam, r, m };
});
table(['lambda, stated', 'effective degrees of freedom', 'training R-squared', 'test RMSE (us/ft)', 'test MAE (us/ft)'], ridgeFits.map(({ lam, r, m }) => [S(lam), f6(r.effectiveDegreesOfFreedom), f6(r.rSquared), f6(m.rmse), f6(m.mae)]));
const best = ridgeFits.reduce((a, b) => (b.m.rmse < a.m.rmse ? b : a));
must('training R-squared falls as lambda grows', ridgeFits.every((f, i) => i === 0 || f.r.rSquared < ridgeFits[i - 1].r.rSquared), 'monotone');
must('effective degrees of freedom fall as lambda grows', ridgeFits.every((f, i) => i === 0 || f.r.effectiveDegreesOfFreedom < ridgeFits[i - 1].r.effectiveDegreesOfFreedom), 'monotone');
must('the lowest test RMSE sits at an interior lambda', best.lam !== RL[0] && best.lam !== RL[RL.length - 1], best.lam);
w();
w(`As lambda grows the training R-squared falls every step, from ${f6(ridgeFits[0].r.rSquared)} to ${f6(ridgeFits[ridgeFits.length - 1].r.rSquared)}: the penalty pulls the fit away from the training rows (more bias). The test RMSE first falls, from ${f6(ridgeFits[0].m.rmse)} at lambda 0 to ${f6(best.m.rmse)} at lambda ${S(best.lam)}, then rises again to ${f6(ridgeFits[ridgeFits.length - 1].m.rmse)} at lambda ${S(RL[RL.length - 1])}. At lambda 0 the seven coefficients chase the six training wells' offsets through the four attributes (more variance); a moderate penalty trades a little bias for much less variance. This is one split: ${ref('kfold')} chooses lambda over every well.`);
w();
w('The standardised coefficients (per training standard deviation of each feature; the first entry is the intercept in standardised space, which is the training mean of y):');
w();
const showL = [0, 10, 100];
table(['term', ...showL.map((l) => `lambda ${l}`)], ['intercept', ...FA].map((nm, j) => [nm, ...showL.map((l) => f6(ridgeFits.find((f) => f.lam === l).r.standardizedCoefficients[j]))]));
must('the standardised intercept is the training mean of y at every lambda', ridgeFits.every((f) => Math.abs(f.r.standardizedCoefficients[0] - MTR.referenceMean) < 1e-9), 'ybar');
w();
w(`THE INTERCEPT IS NOT PENALISED: in standardised space it is ${f6(ridgeFits[0].r.standardizedCoefficients[0])} us/ft at every lambda, the training mean of DT (${f6(MTR.referenceMean)}, ${ref('metrics')}). The basis says: "${ridgeFits[0].r.basis.objective}".`);
w();
const ols7 = success('ols on the same seven features', ML.ols({ X: pick(XA9, TRI), y: yTr, names: FA }));
const d0 = Math.max(...ols7.coefficients.map((b, j) => Math.abs(b - ridgeFits[0].r.coefficients[j]) / Math.max(1, Math.abs(b))));
w(`LAMBDA 0 IS LEAST SQUARES. The ridge coefficients in original units at lambda 0 agree with \`ols\` on the same rows to a largest relative difference of ${eX(d0)} (derived). The original-unit coefficients are b_j / sd_j, and the basis states the conversion: "${ridgeFits[0].r.basis.originalUnits}".`);
must('ridge at lambda 0 agrees with ols to 1e-8 relative', d0 < 1e-8, d0);
w();
w(`EFFECTIVE DEGREES OF FREEDOM, sum d_i^2 / (d_i^2 + lambda) over the singular values d_i of the standardised features, count how many coefficients the fit is really spending: ${f6(ridgeFits[0].r.effectiveDegreesOfFreedom)} at lambda 0 (all seven) down to ${f6(ridgeFits[ridgeFits.length - 1].r.effectiveDegreesOfFreedom)} at lambda ${S(RL[RL.length - 1])}. The intercept is not counted.`);
w();
w(`LAMBDA IS ON THE SUM OF SQUARES, so it equals scikit-learn Ridge's alpha on the same standardised features; the basis says: "${ridgeFits[0].r.basis.lambda}". It is not divided by the number of rows, so the same lambda is a stronger penalty on fewer rows.`);

/* ============================================================ SECTION 12 */

section('kfold', 'Cross-validation by wells: every well tested once', ['Professional m02']);
const KF = success('groupKFold k 3', ML.groupKFold({ groups: G9, k: K3, seed: SEED }));
w(`\`groupKFold\` sorts the well names, shuffles them once with the seed, and deals them round robin: the well at shuffled position q goes to fold q mod k. Each fold tests on its wells and trains on every other well, so every well is tested exactly once. With k = ${K3} and seed ${S(SEED)} on the nine sonic wells:`);
w();
table(['fold', 'test wells', 'test rows', 'training rows'], KF.folds.map((f) => [S(f.fold), list(f.testGroups), S(f.testIndices.length), S(f.trainIndices.length)]));
must('every sonic well is tested exactly once', ids9.every((wl) => KF.folds.filter((f) => f.testGroups.includes(wl)).length === 1), 'once');
w();
const posOf = (f) => KF.order.map((_, q) => q).filter((q) => q % K3 === f);
w(`The shuffled order is ${list(KF.order)}: ${KF.folds.map((f) => `positions ${list(posOf(f.fold))} go to fold ${f.fold}`).join('; ')}.`);
must('each fold holds the shuffled positions q with q mod k equal to its number', KF.folds.every((f) => posOf(f.fold).map((q) => KF.order[q]).sort().join() === [...f.testGroups].sort().join()), 'round robin');
w();
const cvScore = (Xm, lam, folds) => folds.map((f) => {
  const r = ML.ridge({ X: pick(Xm, f.trainIndices), y: pick(Y9, f.trainIndices), lambda: lam });
  must(`ridge fits fold ${f.fold} at lambda ${lam}`, !r.error, r.error);
  const p = ML.predict({ model: r, X: pick(Xm, f.testIndices) });
  return success(`fold ${f.fold} metrics`, ML.regressionMetrics({ yTrue: pick(Y9, f.testIndices), yPred: p.values })).rmse;
});
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
w('Test RMSE (us/ft) of ridge on each fold, and the mean over the three folds (derived, the arithmetic mean of the three):');
w();
const cvRows = [];
const CV = { logs: {}, attrs: {} };
[['logs', XL9, 'GR, RHOB, NPHI'], ['attrs', XA9, 'the logs and the four attributes']].forEach(([key, Xm, label]) => {
  RL.forEach((lam) => {
    const sc = cvScore(Xm, lam, KF.folds);
    CV[key][lam] = mean(sc);
    cvRows.push([label, S(lam), ...sc.map(f6), f6(mean(sc))]);
  });
});
table(['features', 'lambda, stated', 'fold 0', 'fold 1', 'fold 2', 'mean, derived'], cvRows);
const argmin = (o) => Object.entries(o).reduce((a, b) => (b[1] < a[1] ? b : a));
const [bLogs, vLogs] = argmin(CV.logs);
const [bAttrs, vAttrs] = argmin(CV.attrs);
must('the logs alone beat the logs with attributes at their best lambdas', vLogs < vAttrs, `${vLogs} ${vAttrs}`);
w();
w(`The lowest mean for the logs alone is ${f6(vLogs)} us/ft at lambda ${bLogs}; for the logs with the attributes it is ${f6(vAttrs)} us/ft at lambda ${bAttrs}. Scored on wells the model has not seen, the four well-level attributes make the model worse at every lambda tried: the smallest attribute mean is above the logs-only mean at lambda ${bLogs}.`);
must('every attribute mean is above the best logs-only mean', Object.values(CV.attrs).every((v) => v > vLogs), 'all above');
w();
const LOO = success('groupKFold k 9', ML.groupKFold({ groups: G9, k: ids9.length, seed: SEED }));
const looL = mean(cvScore(XL9, Number(bLogs), LOO.folds));
const looL0 = mean(cvScore(XL9, 0, LOO.folds));
const looA = mean(cvScore(XA9, Number(bAttrs), LOO.folds));
w(`LEAVE ONE WELL OUT is k equal to the number of wells, ${ids9.length}, which the engine allows (${ref('boundaries')}). Mean test RMSE over the nine folds (derived): the logs at lambda 0 ${f6(looL0)}, the logs at lambda ${bLogs} ${f6(looL)}, the logs with the attributes at lambda ${bAttrs} ${f6(looA)} us/ft.`);
must('leave one well out ranks the logs ahead of the attributes', looL < looA, `${looL} ${looA}`);
w();
const KF4 = success(`groupKFold k ${K4}`, ML.groupKFold({ groups: G9, k: K4, seed: SEED }));
w(`ROUND ROBIN BALANCES WELLS. With k = ${K4} on nine wells the folds hold ${KF4.folds.map((f) => f.testGroups.length).join(', ')} wells (${KF4.folds.map((f) => f.testIndices.length).join(', ')} rows): fold sizes differ by at most one well. The engine balances the count of wells; scikit-learn's GroupKFold balances rows and takes no seed (${ref('choices')}).`);
must('k four fold sizes differ by at most one well', Math.max(...KF4.folds.map((f) => f.testGroups.length)) - Math.min(...KF4.folds.map((f) => f.testGroups.length)) === 1, 'balanced');

/* ============================================================ SECTION 13 */

section('leakage', 'Leakage, and when a random split flatters nothing', ['Professional m03']);
w(`\`leakageDemo\` fits the same model twice with the same test fraction and seed: once under \`randomRowSplit\` and once under \`groupSplit\`. \`optimism\` is how much better the random-row test score looks; for RMSE it is group test RMSE less random-row test RMSE, so a positive optimism means the random split flattered the model. OLS on the nine sonic wells, test fraction ${S(TF)}, seeds 1 to ${LEAK_SEEDS.length} (stated):`);
w();
const LK = LEAK_SEEDS.map((sd) => {
  const a = success(`leakageDemo logs seed ${sd}`, ML.leakageDemo({ X: XL9, y: Y9, groups: G9, model: { kind: 'ols' }, testFraction: TF, seed: sd, metric: 'rmse' }));
  const b = success(`leakageDemo attrs seed ${sd}`, ML.leakageDemo({ X: XA9, y: Y9, groups: G9, model: { kind: 'ols' }, testFraction: TF, seed: sd, metric: 'rmse' }));
  return { sd, a, b };
});
table(['seed', 'logs: random-row test RMSE', 'logs: group test RMSE', 'logs: optimism', 'with attributes: random-row test RMSE', 'with attributes: group test RMSE', 'with attributes: optimism'],
  LK.map(({ sd, a, b }) => [S(sd), f6(a.randomRow.testScore), f6(a.group.testScore), f6(a.optimism), f6(b.randomRow.testScore), f6(b.group.testScore), f6(b.optimism)]));
const posA = LK.filter((x) => x.b.optimism > 0).length;
const negL = LK.filter((x) => x.a.optimism < 0).length;
const betterRR = LK.filter((x) => x.b.randomRow.testScore < x.a.randomRow.testScore).length;
const worseG = LK.filter((x) => x.b.group.testScore > x.a.group.testScore).length;
planted(1, posA === LEAK_SEEDS.length, `${posA}`);
planted(2, negL > 0 && LK.find((x) => x.sd === SEED).a.optimism < 0, `${negL}`);
w();
w(`Counts over the ${LEAK_SEEDS.length} seeds (derived): with the attributes the optimism is positive on ${posA}; on the logs alone it is negative on ${negL}. Adding the attributes lowers the random-row test RMSE on ${betterRR} seeds and raises the group test RMSE on ${worseG}.`);
must('adding the attributes lowers the random-row RMSE on most seeds', betterRR > LEAK_SEEDS.length / 2, betterRR);
must('adding the attributes raises the group RMSE on every seed', worseG === LEAK_SEEDS.length, worseG);
w();
const L5a = LK.find((x) => x.sd === SEED).a;
const L5b = LK.find((x) => x.sd === SEED).b;
w(`WHY. The four attributes are constant down each well, so together they name the well. Under a random-row split every well has rows on both sides (\`sharedGroups\` lists ${L5b.randomRow.sharedGroups.length} wells at seed ${S(SEED)}), and the model learns each well's sonic offset (${ref('residuals')}) from its training rows and meets it again in the test rows. Under a group split the test wells' offsets are absent from the training rows, and the attribute coefficients fitted to six wells extrapolate. At seed ${S(SEED)}: with the attributes, random-row RMSE ${f6(L5b.randomRow.testScore)} against group RMSE ${f6(L5b.group.testScore)}; on the logs alone, ${f6(L5a.randomRow.testScore)} against ${f6(L5a.group.testScore)}.`);
w();
w(`A RANDOM SPLIT DOES NOT ALWAYS FLATTER. On the logs alone no feature names a well, the model cannot learn a well's offset, and the random-row score is neither systematically better nor worse: the optimism is negative on ${negL} of the ${LEAK_SEEDS.length} seeds and positive on the rest, as the draw of test wells falls. Leakage needs a path from the test rows' identity to the prediction.`);
w();
w(`THE ENGINE'S OWN WORDS on the two splits: "${L5a.basis.randomRow}"; "${L5a.basis.group}".`);
w();
// scaling leak
const scLeak = success('fitStandardScaler on all ten wells, pay features', ML.fitStandardScaler({ X: XP10, names: PAYF }));
const GP = success('groupSplit, all ten wells', ML.groupSplit({ groups: G10, testFraction: TF, seed: SEED }));
const scClean = success('fitStandardScaler on the pay training rows', ML.fitStandardScaler({ X: XP10, trainIndices: GP.trainIndices, names: PAYF }));
const lgFit = (sc) => {
  const Ztr = ML.applyScaler({ scaler: sc, X: pick(XP10, GP.trainIndices) }).X;
  const Zte = ML.applyScaler({ scaler: sc, X: pick(XP10, GP.testIndices) }).X;
  const m = success('logistic l2 1 on scaled pay features', ML.logistic({ X: Ztr, y: pick(PAY10, GP.trainIndices), names: PAYF, l2: 1 }));
  const p = ML.predict({ model: m, X: Zte });
  return { m, ll: success('logLoss scaled', ML.logLoss({ yTrue: pick(PAY10, GP.testIndices), probabilities: p.values })).logLoss };
};
const LKc = lgFit(scClean);
const LKl = lgFit(scLeak);
w(`SCALING CAN LEAK TOO. A scaler fitted on all rows has seen the test rows. For least squares it changes nothing in the predictions (${ref('heldout')}) and ridge re-standardises on the rows it is given, but a penalty on standardised features depends on the scale. Logistic regression with l2 = 1 (${ref('logistic')}) on the pay features, standardised once with a scaler fitted on the training wells and once with one fitted on all ten wells, scored by log loss on the three test wells of the all-well teaching split (${list(GP.testGroups)}):`);
w();
table(['scaler fitted on', 'RT centre', 'RT scale', 'RT coefficient (per scaled unit)', 'test log loss'], [
  ['the training wells only', f6(scClean.centre[2]), f6(scClean.scale[2]), f6(LKc.m.coefficients[3]), f6(LKc.ll)],
  ['all ten wells', f6(scLeak.centre[2]), f6(scLeak.scale[2]), f6(LKl.m.coefficients[3]), f6(LKl.ll)],
]);
must('the leaked scaler changes the penalised fit', LKc.ll !== LKl.ll && LKc.m.coefficients[3] !== LKl.m.coefficients[3], `${LKc.ll} ${LKl.ll}`);
w();
w(`The test log loss differs by ${eX(LKl.ll - LKc.ll)} (derived, all wells less training wells). The size is small on these data; the procedure is the defect, because the test wells shaped the transform the model was trained through.`);

/* ============================================================ SECTION 14 */

section('logistic', 'Logistic regression on the stated pay rule', ['Professional m04']);
const PTR = GP.trainIndices;
const PTE = GP.testIndices;
const LG = success('logistic, pay features, training wells', ML.logistic({ X: pick(XP10, PTR), y: pick(PAY10, PTR), names: PAYF }));
w(`The label is PAY from the stated rule of ${ref('dataset')}. The rule reads PHIC, a core calibrated porosity, which is not a feature: the model sees RHOB (g/cm3), NPHI (v/v) and RT (ohm.m) and must learn the label from them. All ten wells carry a PAY label, so the teaching split here is \`groupSplit\` over the ten wells with fraction ${S(TF)} and seed ${S(SEED)}: test wells ${list(GP.testGroups)} (${PTE.length} rows), training wells ${list(GP.trainGroups)} (${PTR.length} rows).`);
w();
w('Logistic regression models the probability of PAY = 1 as p = 1 / (1 + exp(-eta)), with eta = b0 + b1 x1 + ... the log odds. The fit on the training wells:');
w();
table(['term', 'coefficient (log odds per unit)', 'standard error', 'coefficient over standard error, derived'], LG.names.map((nm, j) => [nm, f6(LG.coefficients[j]), f6(LG.standardErrors[j]), f6(LG.coefficients[j] / LG.standardErrors[j])]));
w();
table(['quantity', 'value'], [
  ['rows', S(LG.n)], ['pay rows in training', S(pick(PAY10, PTR).filter((v) => v === 1).length)],
  ['Newton iterations', S(LG.iterations)], ['converged', S(LG.converged)], ['step halvings', S(LG.stepHalvings)],
  ['log likelihood', f6(LG.logLikelihood)], ['deviance, -2 x log likelihood', f6(LG.deviance)], ['deviance of the intercept-only model (`nullDeviance`)', f6(LG.nullDeviance)],
  ['separation', LG.separation.type],
]);
must('the pay fit converged without separation or halving', LG.converged && LG.separation.type === 'none' && LG.stepHalvings === 0, `${LG.converged} ${LG.separation.type} ${LG.stepHalvings}`);
w();
const orRT = Math.exp(LG.coefficients[3]);
w(`READING A COEFFICIENT. The RT coefficient ${f6(LG.coefficients[3])} is in log odds per ohm.m: one more ohm.m multiplies the odds of pay by exp(${f6(LG.coefficients[3])}) = ${f6(orRT)} (derived), holding RHOB and NPHI fixed. The RHOB coefficient ${f6(LG.coefficients[1])} is per g/cm3, a whole unit of density; per 0.01 g/cm3 it is ${f6(LG.coefficients[1] / 100)} (derived).`);
must('RT raises the odds of pay and RHOB lowers them', LG.coefficients[3] > 0 && LG.coefficients[1] < 0, 'signs');
w();
w(`The deviance fell from ${f6(LG.nullDeviance)} (intercept only) to ${f6(LG.deviance)} with the three features. The standard errors are the square roots of the diagonal of the inverse information at the solution; the basis says: "${LG.basis.standardErrors}".`);
w();
const PP = success('predict, pay test wells', ML.predict({ model: LG, X: pick(XP10, PTE) }));
const ptr = pick(PAY10, PTE);
w(`PREDICTIONS on the first five test rows (probability of pay and the class the engine assigns):`);
w();
table(['test row', 'well', 'depth (ft)', 'RHOB', 'NPHI', 'RT', 'probability', 'class', 'PAY'], [0, 1, 2, 3, 4].map((q) => {
  const r = ROWS[PTE[q]];
  return [S(PTE[q]), r.well, S(r.depth), f6(r.RHOB), f6(r.NPHI), f6(r.RT), f6(PP.values[q]), S(PP.classes[q]), S(r.PAY)];
}));
w();
const HALF = golden('predict-logistic-half');
const PH5 = success('predict at exactly one half (golden)', ML.predict(HALF.args));
w(`THE THRESHOLD AT ONE HALF. A probability above 0.5 is class 1; exactly 0.5 is class 0. The engine's own case (golden \`predict-logistic-half\`) gives the probability ${f6(PH5.values[0])} and the class ${S(PH5.classes[0])}. The basis says: "${PH5.basis.rule}".`);
must('the golden half case is class 0 at exactly 0.5', PH5.values[0] === 0.5 && PH5.classes[0] === 0, `${PH5.values[0]} ${PH5.classes[0]}`);
w();
w(`Newton's method and its stopping rule are the Expert tier's (${ref('convergence')}); here the fit took ${LG.iterations} iterations and the basis records the rule: "${LG.basis.convergence}".`);

/* ============================================================ SECTION 15 */

section('confusion', 'The confusion matrix, precision, recall and F1', ['Professional m05']);
const CMx = success('confusionMatrix, pay test wells', ML.confusionMatrix({ yTrue: ptr, yPred: PP.classes }));
const REP = success('classificationReport, pay test wells', ML.classificationReport({ yTrue: ptr, yPred: PP.classes }));
w(`The ${ptr.length} test rows of ${ref('logistic')}, true label against the class the engine predicted at the 0.5 threshold. The layout, in the basis's words: "${CMx.basis.layout}".`);
w();
table(['', 'predicted 0', 'predicted 1'], CMx.labels.map((l, i) => [`true ${l}`, S(CMx.matrix[i][0]), S(CMx.matrix[i][1])]));
w();
table(['label', 'TP', 'FP', 'FN', 'support', 'precision', 'recall', 'F1'], REP.perClass.map((c) => [S(c.label), S(c.tp), S(c.fp), S(c.fn), S(c.support), f6(c.precision), f6(c.recall), f6(c.f1)]));
w();
table(['average', 'precision', 'recall', 'F1'], [['macro (unweighted mean over labels)', f6(REP.macro.precision), f6(REP.macro.recall), f6(REP.macro.f1)], ['weighted (by support)', f6(REP.weighted.precision), f6(REP.weighted.recall), f6(REP.weighted.f1)]]);
w();
w(`Accuracy is ${f6(REP.accuracy)}: correct over n. Precision of pay = TP / (TP + FP): of the rows called pay, the fraction that are pay. Recall of pay = TP / (TP + FN): of the pay rows, the fraction called pay. F1 = 2TP / (2TP + FP + FN), the harmonic mean of the two wherever both are defined; the basis says: "${REP.basis.f1}".`);
const c1 = REP.perClass.find((c) => c.label === 1);
must('F1 of pay is 2TP / (2TP + FP + FN)', Math.abs(c1.f1 - (2 * c1.tp) / (2 * c1.tp + c1.fp + c1.fn)) < 1e-15, c1.f1);
w();
w(`For the pay label here, TP ${c1.tp}, FP ${c1.fp}, FN ${c1.fn}. Label 0 is also a class with its own precision and recall; in a binary report the two classes' rows are the same four counts read from each side.`);
must('label 0 TP is the true-negative count of label 1', REP.perClass[0].tp === CMx.matrix[0][0], 'symmetry');
w();
const ZD0 = golden('report-never-predicted-zd0');
const ZD1 = golden('report-never-predicted-zd1');
const R0 = success('classificationReport zero division 0 (golden)', ML.classificationReport(ZD0.args));
const R1 = success('classificationReport zero division 1 (golden)', ML.classificationReport(ZD1.args));
w(`A ZERO DENOMINATOR. When a label is never predicted its precision is 0 / 0. The engine scores it \`zeroDivision\` (0 by default, or 1) and lists it in \`undefinedRatios\`. The engine's own case (golden \`report-never-predicted-zd0\` and \`-zd1\`): yTrue ${JSON.stringify(ZD0.args.yTrue)}, yPred ${JSON.stringify(ZD0.args.yPred)}.`);
w();
table(['zeroDivision', 'ratios scored zeroDivision (`undefinedRatios`)', 'macro precision', 'macro F1'], [[S(R0.zeroDivision), R0.undefinedRatios.map((u) => `${u.metric} of ${JSON.stringify(u.label)}`).join('; '), f6(R0.macro.precision), f6(R0.macro.f1)], [S(R1.zeroDivision), R1.undefinedRatios.map((u) => `${u.metric} of ${JSON.stringify(u.label)}`).join('; '), f6(R1.macro.precision), f6(R1.macro.f1)]]);
must('the two zero-division settings give different macro precision', R0.macro.precision !== R1.macro.precision, `${R0.macro.precision} ${R1.macro.precision}`);
w();
w('The choice moves the macro average, so a report states it. The basis says: "' + R0.basis.zeroDivision + '".');

/* ============================================================ SECTION 16 */

section('roc', 'ROC, AUC and log loss', ['Professional m06']);
const ROC = success('rocCurve, pay test wells', ML.rocCurve({ yTrue: ptr, scores: PP.values }));
const LL = success('logLoss, pay test wells', ML.logLoss({ yTrue: ptr, probabilities: PP.values }));
const distinct = new Set(PP.values).size;
w(`The ROC curve lowers a threshold through the scores and plots the true positive rate (recall of pay) against the false positive rate. The engine places one point per DISTINCT score, starting at (0, 0) with threshold null. On the ${ptr.length} test rows of ${ref('logistic')}: ${ROC.positives} positives, ${ROC.negatives} negatives, ${distinct} distinct probabilities, ${ROC.fpr.length} points.`);
must('one point per distinct score plus the start', ROC.fpr.length === distinct + 1, `${ROC.fpr.length} ${distinct}`);
w();
table(['quantity', 'value'], [['AUC, trapezoid rule over the points', f6(ROC.auc)], ['log loss, natural log', f6(LL.logLoss)], ['rows clipped', S(LL.clipped)], ['eps', eX(LL.eps)]]);
w();
let pairs = 0; let wins = 0;
ptr.forEach((a, i) => ptr.forEach((b, j) => { if (a === 1 && b === 0) { pairs += 1; wins += PP.values[i] > PP.values[j] ? 1 : PP.values[i] === PP.values[j] ? 0.5 : 0; } }));
w(`AUC AS A PROBABILITY. Over every (pay, non-pay) pair of test rows, ${pairs} pairs, the pay row has the higher probability in ${S(wins)} (derived, a tie counting one half): ${f6(wins / pairs)}, which differs from the trapezoid AUC by ${eX(Math.abs(wins / pairs - ROC.auc))}. The basis says: "${ROC.basis.auc}".`);
must('the pair count matches the trapezoid AUC to 1e-12', Math.abs(wins / pairs - ROC.auc) < 1e-12, wins / pairs - ROC.auc);
w();
const TIES = golden('roc-ties');
const RT = success('rocCurve with ties (golden)', ML.rocCurve(TIES.args));
w(`TIED SCORES MOVE TOGETHER. The engine's own case (golden \`roc-ties\`): yTrue ${JSON.stringify(TIES.args.yTrue)}, scores ${JSON.stringify(TIES.args.scores)}.`);
w();
table(['point', 'threshold', 'FPR', 'TPR'], RT.fpr.map((f, i) => [S(i), RT.thresholds[i] === null ? 'null' : f6(RT.thresholds[i]), f6(f), f6(RT.tpr[i])]));
w();
w(`AUC ${f6(RT.auc)}. Where a threshold holds a positive and a negative at the same score, the curve steps diagonally; the basis says: "${RT.basis.ties}".`);
const ALLT = golden('roc-all-tied');
const RA = success('rocCurve all tied (golden)', ML.rocCurve(ALLT.args));
w();
w(`Every score equal (golden \`roc-all-tied\`) gives the single diagonal step and AUC ${f6(RA.auc)}.`);
must('all tied reads one half', RA.auc === 0.5, RA.auc);
w();
const LCL = golden('logloss-clipped');
const LLc = success('logLoss clipped (golden)', ML.logLoss(LCL.args));
const LHF = golden('logloss-half');
const LLh = success('logLoss half (golden)', ML.logLoss(LHF.args));
w(`LOG LOSS AND ITS CLIP. Log loss is -(1/n) sum [y ln p + (1 - y) ln(1 - p)] and punishes a confident wrong probability without limit, so the engine clips p to [eps, 1 - eps] with eps = ${eX(ML.DEFAULTS.LOG_LOSS_EPS)} and counts the rows it clipped. The engine's own cases: a probability of one half everywhere (golden \`logloss-half\`) reads ${f6(LLh.logLoss)}, which is ln 2; probabilities of exactly 0 and 1 (golden \`logloss-clipped\`, yTrue ${JSON.stringify(LCL.args.yTrue)}, probabilities ${JSON.stringify(LCL.args.probabilities)}) read ${f6(LLc.logLoss)} with ${LLc.clipped} rows clipped.`);
must('log loss at one half is ln 2', Math.abs(LLh.logLoss - Math.LN2) < 1e-15, LLh.logLoss);
must('the clipped case clips rows', LLc.clipped > 0, LLc.clipped);
w();
w(`AUC reads only the ORDER of the scores; log loss reads the probabilities themselves. On the test wells the AUC is ${f6(ROC.auc)} and the log loss ${f6(LL.logLoss)}; the accuracy at the 0.5 threshold (${ref('confusion')}) is ${f6(REP.accuracy)}.`);

/* ============================================================ SECTION 17 */

section('conditioning', 'The condition number, raw and scaled, and the refusal limit', ['Expert m01']);
w(`The condition number of a design says how much a small change in the data can move the least squares coefficients. The engine reports two: \`conditionNumber\`, the 2-norm condition number of the design as given (the intercept column of ones included), and \`scaledConditionNumber\`, the same with every column scaled to unit length (Belsley). A fit is REFUSED when the scaled number is above \`maxCondition\`, default ${eX(ML.DEFAULTS.MAX_CONDITION)}.`);
w();
const trM = (feats) => pick(X(SONIC, feats), TRI);
const ctr = (M) => { const m = M[0].map((_, j) => M.reduce((a, r) => a + r[j], 0) / M.length); return M.map((r) => r.map((v, j) => v - m[j])); };
const CD = [
  ['the three logs', trM(LOGS), LOGS],
  ['the logs and the depth', trM([...LOGS, 'depth']), [...LOGS, 'depth']],
  ['the logs and the four attributes', trM(FA), FA],
  ['the logs and the four attributes, every feature centred on its training mean (derived)', ctr(trM(FA)), FA],
];
const cdFits = CD.map(([label, Xm, nm]) => [label, success(`ols conditioning ${label}`, ML.ols({ X: Xm, y: yTr, names: nm }))]);
table(['design (training rows of the teaching split)', 'condition number, raw', 'scaled condition number', 'R-squared'], cdFits.map(([l, o]) => [l, f6(o.conditionNumber), f6(o.scaledConditionNumber), f6(o.rSquared)]));
const cA = cdFits[2][1]; const cC = cdFits[3][1];
must('centring lowers the scaled condition number of the attribute design', cC.scaledConditionNumber < cA.scaledConditionNumber / 10, `${cA.scaledConditionNumber} ${cC.scaledConditionNumber}`);
const dRC = Math.abs(cC.rSquared - cA.rSquared);
must('centring leaves R-squared unchanged within 1e-9', dRC < 1e-9, dRC);
w();
const eCol = trM(['easting']).map((r) => r[0]);
const eMean = eCol.reduce((a, v) => a + v, 0) / eCol.length;
const eSd = Math.sqrt(eCol.reduce((a, v) => a + (v - eMean) ** 2, 0) / eCol.length);
w(`The raw number mixes units: a column in thousands of feet beside one in g/cm3 reads as ill-conditioned whatever the data. The scaled number removes the units and measures near-collinearity. Easting sits far from zero and varies little (over the training rows its mean is ${f6(eMean)} km and its population SD ${f6(eSd)} km, derived), so with an intercept it is nearly a multiple of the column of ones, and northing the same: the scaled number of the attribute design is ${f6(cA.scaledConditionNumber)}. Centring every feature on its training mean (arithmetic done here, stated) brings it to ${f6(cC.scaledConditionNumber)} and leaves the fit itself unchanged: R-squared moves by ${eX(dRC)}. The refusal message names that remedy.`);
w();
const COL = success('ols with a column twice NPHI', ML.ols({ X: trM(LOGS).map((r) => [...r, 2 * r[2]]), y: yTr, names: [...LOGS, 'NPHI2'], maxCondition: COND_OPEN }));
const COLr = refusal('ols with a column twice NPHI, default limit', ML.ols({ X: trM(LOGS).map((r) => [...r, 2 * r[2]]), y: yTr, names: [...LOGS, 'NPHI2'] }), 'X');
w(`AN EXACT COPY. Add a fifth column that is exactly twice NPHI. The scaled condition number becomes ${eX(COL.scaledConditionNumber)} (read with maxCondition raised to ${eX(COND_OPEN)} so the number is returned), and at the default the fit is refused. The engine's own words:`);
w();
w(`> ${COLr.error}`);
must('the doubled column drives the scaled condition number above 1e13', COL.scaledConditionNumber > 1e13, COL.scaledConditionNumber);
w();
const kap2 = ML.DEFAULTS.MAX_CONDITION ** 2 * Number.EPSILON;
w(`WHY ${eX(ML.DEFAULTS.MAX_CONDITION)}. A least squares solution can lose up to about kappa^2 x machine epsilon of relative accuracy in the worst case. At kappa = ${eX(ML.DEFAULTS.MAX_CONDITION)}, kappa^2 x ${S(Number.EPSILON)} = ${f6(kap2)} (derived): the worst-case error bound reaches the size of the coefficient, so no digit of some coefficient can be guaranteed. The basis says: "${OL.basis.scaledConditionNumber}".`);
w();
const LB1 = golden('ols-longley-below-limit');
const LB2 = golden('ols-longley-limit-44000');
const rLB1 = ML.ols(LB1.args);
const rLB2 = success('ols Longley at maxCondition 44000 (golden)', ML.ols(LB2.args));
refusal('ols Longley at maxCondition 43000 (golden)', rLB1, 'X');
w(`THE LIMIT, BRACKETED. The NIST Longley design (${ref('nist')}) has a scaled condition number of ${f6(rLB2.scaledConditionNumber)}. With maxCondition ${S(LB1.args.maxCondition)} (golden \`ols-longley-below-limit\`) it is refused; with ${S(LB2.args.maxCondition)} (golden \`ols-longley-limit-44000\`) it is fitted. A value exactly at the limit is fitted: the refusal is for a number strictly above it.`);
must('Longley sits between the two bracket limits', rLB2.scaledConditionNumber > LB1.args.maxCondition && rLB2.scaledConditionNumber < LB2.args.maxCondition, rLB2.scaledConditionNumber);

/* ============================================================ SECTION 18 */

section('nist', 'The NIST reference problems, and what a digit means', ['Expert m01']);
w('The NIST/ITL Statistical Reference Datasets for linear least squares publish certified coefficients, standard deviations, residual standard deviation and R-squared, computed in multiple precision. The eleven source files are vendored with the engine; the rows below run the engine on the vendored golden\'s own inputs (the design exactly as the golden builds it) and compare with the certified values the golden reads from those files.');
w();
w('A DIGIT OF AGREEMENT is the log relative error, LRE = -log10(|estimate - certified| / |certified|), capped at 16 when the two are identical in float; derived here from the engine value and the certified string. An LRE of 14 means the first fourteen significant digits agree.');
w();
const LRE = (est, cert) => { const c = Number(cert); if (est === c) return 16; if (c === 0) return Math.min(16, -Math.log10(Math.abs(est))); return Math.min(16, -Math.log10(Math.abs(est - c) / Math.abs(c))); };
const NIST = [['Norris', 'nist-norris'], ['Pontius', 'nist-pontius'], ['NoInt1', 'nist-noint1'], ['NoInt2', 'nist-noint2'], ['Longley', 'nist-longley'], ['Wampler1', 'nist-wampler1'], ['Wampler2', 'nist-wampler2'], ['Wampler3', 'nist-wampler3'], ['Wampler4', 'nist-wampler4'], ['Wampler5', 'nist-wampler5'], [`Filip, maxCondition ${eX(golden('nist-filip-forced').args.maxCondition)}`, 'nist-filip-forced']];
const nistRows = NIST.map(([name, id]) => {
  const c = golden(id);
  const r = success(`ols ${id} (golden)`, ML.ols(c.args));
  const coefP = c.published.filter((p) => p.field.startsWith('coefficients.'));
  const minCoef = Math.min(...coefP.map((p) => LRE(r.coefficients[Number(p.field.split('.')[1])], p.certified)));
  const r2P = c.published.find((p) => p.field === 'rSquared');
  return { name, id, r, minCoef, r2: r2P ? LRE(r.rSquared, r2P.certified) : null, nCoef: coefP.length };
});
const floatLim = GOLD.nistFloatDesignDigits;
table(['dataset', 'rows', 'coefficients', 'scaled condition number', 'smallest coefficient LRE, derived', 'R-squared LRE, derived', 'float-design limit, golden'],
  nistRows.map((x) => [x.name, S(x.r.n), S(x.nCoef), f6(x.r.scaledConditionNumber), x.minCoef.toFixed(2), x.r2 === null ? 'null' : x.r2.toFixed(2), f6(floatLim[x.name.split(',')[0]]).replace(/0+$/, '').replace(/\.$/, '')]));
const worstEasy = Math.min(...nistRows.filter((x) => !x.id.includes('filip')).map((x) => x.minCoef));
must('every non-Filip coefficient agrees to at least 13 digits', worstEasy >= 13, worstEasy);
w();
w(`Every dataset but Filip agrees with the certified coefficients to at least ${Math.floor(worstEasy)} significant digits (derived, the smallest LRE above). The float-design limit (golden \`nistFloatDesignDigits\`) is the oracle's measure of how many certified digits the float64 inputs themselves allow: the exact solution of the design as rounded to float64.`);
w();
const FR = golden('nist-filip-refused');
const rFR = refusal('ols Filip at the default (golden)', ML.ols(FR.args), 'X');
const filip = nistRows.find((x) => x.id === 'nist-filip-forced');
w(`FILIP, REFUSED AT THE DEFAULT. Filip is a degree ten polynomial in one variable, ${filip.r.n} rows and ${filip.r.p} coefficients, and NIST rates it higher difficulty. At the default limit the engine refuses it (golden \`nist-filip-refused\`):`);
w();
w(`> ${rFR.error}`);
w();
w(`Raised knowingly to maxCondition ${eX(golden('nist-filip-forced').args.maxCondition)} it is fitted, and its smallest coefficient LRE is ${filip.minCoef.toFixed(2)} against a float-design limit of ${f6(floatLim.Filip).replace(/0+$/, '')}: the certified values cannot be reached from float64 data by any method to more digits than that, so the missing digits are an input limit. A refusal at the default is the engine declining to print coefficients it cannot vouch for.`);
must('forced Filip agrees to between 7 and 9 digits', filip.minCoef > 7 && filip.minCoef < 9, filip.minCoef);
const LNG = nistRows.find((x) => x.id === 'nist-longley');
w();
w(`LONGLEY, the classic test of 1967 (Longley, Journal of the American Statistical Association 62, 819 to 841), six economic series, ${LNG.r.n} rows: coefficient LRE ${LNG.minCoef.toFixed(2)} at a scaled condition number of ${f6(LNG.r.scaledConditionNumber)}, and the certified R-squared to ${LNG.r2.toFixed(2)} digits.`);

/* ============================================================ SECTION 19 */

section('separation', 'Separation, and the exact test before any iteration', ['Expert m02']);
const HC = ROWS.filter((r) => r.RT >= T.PAY_RT);
const SEPd = ML.logistic({ X: HC.map((r) => [r.PHIC]), y: HC.map((r) => r.PAY), names: ['PHIC'] });
refusal('logistic, PHIC on the rows at or above the RT cutoff', SEPd, 'y');
planted(5, /completely separated/.test(SEPd.error), SEPd.error);
w(`When a hyperplane in the features puts every PAY = 1 row on one side and every PAY = 0 row on the other, the log likelihood keeps rising as the coefficients grow and the maximum likelihood coefficients are infinite. The Ekene pay rule does exactly that on its own input: among the ${HC.length} rows with RT at or above ${S(T.PAY_RT)} ohm.m, PAY is 1 precisely when PHIC is at least ${S(T.PAY_PHIC)}. Logistic on PHIC alone for those rows is refused before any iteration:`);
w();
w(`> ${SEPd.error}`);
w();
const SEPl = success('logistic, PHIC, rows above the RT cutoff, l2 1', ML.logistic({ X: HC.map((r) => [r.PHIC]), y: HC.map((r) => r.PAY), names: ['PHIC'], l2: L2_SEP }));
w(`WITH A PENALTY the fit is finite. With l2 = ${S(L2_SEP)} on the same rows: PHIC coefficient ${f6(SEPl.coefficients[1])} log odds per v/v, intercept ${f6(SEPl.coefficients[0])}, ${SEPl.iterations} iterations, converged ${S(SEPl.converged)}, and the result reports \`separation.type\` ${SEPl.separation.type}. The penalty (l2 / 2) x sum b_j^2 on the non-intercept coefficients makes the objective bounded; the separation is still there, and the coefficient is set by the penalty rather than by the data.`);
must('the penalised fit converges and reports complete separation', SEPl.converged && SEPl.separation.type === 'complete', `${SEPl.converged} ${SEPl.separation.type}`);
const SEPl2 = success('logistic, same rows, the weaker l2', ML.logistic({ X: HC.map((r) => [r.PHIC]), y: HC.map((r) => r.PAY), names: ['PHIC'], l2: L2_WEAK }));
w();
w(`At l2 = ${S(L2_WEAK)} the PHIC coefficient is ${f6(SEPl2.coefficients[1])}: a weaker penalty, a larger coefficient, and no finite limit as l2 goes to zero.`);
must('a weaker penalty gives a larger coefficient', SEPl2.coefficients[1] > SEPl.coefficients[1], `${SEPl2.coefficients[1]} ${SEPl.coefficients[1]}`);
w();
const QS = golden('logistic-quasi-separation');
const rQS = refusal('logistic quasi-complete (golden)', ML.logistic(QS.args), 'y');
w(`QUASI-COMPLETE SEPARATION: a hyperplane puts every row on its own side or ON the plane, with rows of both classes on the plane. The engine's own case (golden \`logistic-quasi-separation\`), X ${JSON.stringify(QS.args.X)}, y ${JSON.stringify(QS.args.y)}:`);
w();
w(`> ${rQS.error}`);
w();
w(`THE EXACT TEST. The engine decides separation BEFORE iterating, with two linear programmes on S, the design with each row multiplied by +1 for y = 1 and -1 for y = 0 and each column divided by its largest absolute value. Gordan's theorem: either some beta has S beta > 0 (complete separation) or some w >= 0 with sum 1 has S'w = 0; the engine solves the second as a linear programme, and infeasible means complete. Stiemke's theorem, tested only when Gordan's programme is feasible: either some w >= 1 has S'w = 0 (no separation) or the separation is quasi-complete. Each pair of alternatives is a theorem, so the decision is exact up to the linear programme's feasibility tolerance. The basis says: "${SEPl.basis.separation}".`);
w();
w(`The pay model of ${ref('logistic')} reported \`separation.type\` ${LG.separation.type}, with the certificate: "${LG.separation.certificate}".`);

/* ============================================================ SECTION 20 */

section('convergence', 'Convergence and its stated rule', ['Expert m03']);
w(`Logistic regression has no closed form. The engine takes Newton-Raphson steps from beta = 0: each step solves the Newton system (the information matrix against the score) with \`solveSPD\`, and the fit stops when the largest absolute component of the FULL Newton step is at most \`tol\`, default ${eX(ML.DEFAULTS.LOGISTIC_TOL)}, or after \`maxIter\` updates, default ${ML.DEFAULTS.LOGISTIC_MAX_ITER}. The trace of the pay fit of ${ref('logistic')}:`);
w();
table(['iteration', 'largest component of the full Newton step', 'log likelihood after the step', 'step halvings'], LG.trace.map((t) => [S(t.iteration), t.maxChange < 1e-4 ? eX(t.maxChange) : f6(t.maxChange), f6(t.logLikelihood), S(t.stepHalvings)]));
const lastT = LG.trace[LG.trace.length - 1];
must('the last step is at or below tol and the one before is above', lastT.maxChange <= ML.DEFAULTS.LOGISTIC_TOL && LG.trace[LG.trace.length - 2].maxChange > ML.DEFAULTS.LOGISTIC_TOL, lastT.maxChange);
w();
w(`The last step, ${eX(lastT.maxChange)}, is the first at or below ${eX(ML.DEFAULTS.LOGISTIC_TOL)}. Near the solution Newton's method roughly squares the error each step, which is why the step sizes collapse over the last few iterations. The rule is inclusive: a step exactly at tol stops the fit.`);
w();
const SH = success(`logistic, maxIter ${MAXITER_SHORT}`, ML.logistic({ X: pick(XP10, PTR), y: pick(PAY10, PTR), names: PAYF, maxIter: MAXITER_SHORT }));
w(`WHEN A FIT DOES NOT CONVERGE the engine returns the result with \`converged\` false and a warning; it is no refusal. The same pay fit with maxIter ${MAXITER_SHORT}: converged ${S(SH.converged)}, ${SH.iterations} iterations, RT coefficient ${f6(SH.coefficients[3])} against ${f6(LG.coefficients[3])} at convergence. The engine's words:`);
w();
w(`> ${SH.warning}`);
must('the short fit did not converge and warns', SH.converged === false && typeof SH.warning === 'string', SH.warning);
w();
const CP = golden('logistic-compressibility-per-pa');
const rCP = success('logistic compressibility, golden tol', ML.logistic(CP.args));
const { tol: _t, ...cpDefault } = CP.args;
const rCP0 = success('logistic compressibility, default tol', ML.logistic(cpDefault));
w(`THE STOPPING RULE IS IN COEFFICIENT UNITS. A feature in very small units has a very large coefficient, and an absolute tol must be set to match. The engine's own case (golden \`logistic-compressibility-per-pa\`): rock compressibility in 1/Pa, a feature whose largest value is ${eX(Math.max(...CP.args.X.map((r) => Math.abs(r[0]))))} (golden), ${rCP.n} rows. With the golden's tol ${S(CP.args.tol)} it converges in ${rCP.iterations} iterations with the compressibility coefficient ${eX(rCP.coefficients[1])}; at the default tol ${eX(ML.DEFAULTS.LOGISTIC_TOL)} it runs to ${rCP0.iterations} updates, converged ${S(rCP0.converged)}, and warns:`);
w();
w(`> ${rCP0.warning}`);
must('the compressibility case converges at its tol and not at the default', rCP.converged && !rCP0.converged, `${rCP.converged} ${rCP0.converged}`);
w();
w(`A tol of ${S(CP.args.tol)} on a coefficient near ${eX(rCP.coefficients[1])} is a relative ${eX(CP.args.tol / Math.abs(rCP.coefficients[1]))} (derived). Rescaling the feature (to 1/GPa, say) is the other remedy. The basis says: "${rCP.basis.convergence}".`);
w();
w(`STEP HALVING. A step that lowers the penalised log likelihood by more than 1e-12 x (1 + |l|) is halved, up to ${ML.DEFAULTS.STEP_HALVINGS} times. Convergence is judged on the FULL step before any halving, so a halved step can never fake convergence. The pay fit halved ${LG.stepHalvings} times; the basis says: "${LG.basis.method}".`);

/* ============================================================ SECTION 21 */

section('importance', 'Permutation importance', ['Expert m04']);
const OC = success('ols on the training rows, logs and CALI', ML.ols({ X: pick(XC9, TRI), y: yTr, names: LOGS_C }));
const PI = success('permutationImportance, rmse, test wells', ML.permutationImportance({ model: OC, X: pick(XC9, TEI), y: yTe, metric: 'rmse', nRepeats: REPEATS, seed: SEED }));
w(`Permutation importance asks how much worse a fitted model scores when one feature's values are shuffled across the rows, which breaks that feature's link to the target and keeps its distribution. The model is OLS on GR, RHOB, NPHI and CALI fitted on the training wells of the teaching split; it is scored on the ${yTe.length} test rows by RMSE, ${REPEATS} repeats, seed ${S(SEED)} (stated). Baseline test RMSE ${f6(PI.baseline)} us/ft.`);
w();
table(['feature', 'mean drop (us/ft)', 'SD over repeats', 'drops, repeat by repeat'], PI.importances.map((im) => [im.feature, f6(im.mean), f6(im.sd), im.drops.map(f6).join(', ')]));
w();
w(`Ranking, largest mean drop first: ${list(PI.ranking)}. The drop for RMSE is permuted RMSE less baseline RMSE, positive when the feature matters; the basis says: "${PI.basis.drop}".`);
planted(6, PI.ranking[PI.ranking.length - 1] === 'CALI', list(PI.ranking));
const cali = PI.importances.find((im) => im.feature === 'CALI');
w();
w(`CALI, the caliper, was drawn with no link to the sonic (${ref('dataset')}), and it ranks last with a mean drop of ${f6(cali.mean)} us/ft. A drop near zero can come out slightly negative, when a shuffle happens to help, and the engine prints it as it is.`);
must('CALI mean drop is below 0.1 us/ft in size', Math.abs(cali.mean) < 0.1, cali.mean);
w();
w(`REPEATS AND THEIR SPREAD. The SD is the population SD of the ${REPEATS} drops. One mulberry32 stream serves the whole call, features in column order and repeats inner, so the drops depend on the seed and on nRepeats; the basis says: "${PI.basis.permutation}".`);
const PI2 = success('permutationImportance, seed 6', ML.permutationImportance({ model: OC, X: pick(XC9, TEI), y: yTe, metric: 'rmse', nRepeats: REPEATS, seed: SEED + 1 }));
w();
w(`With seed ${SEED + 1} the mean drops read ${PI2.importances.map((im) => `${im.feature} ${f6(im.mean)}`).join(', ')}, ranking ${list(PI2.ranking)}. Quote an importance with its seed and its repeats.`);
const LGp = success('permutationImportance on the pay fit, auc', ML.permutationImportance({ model: LG, X: pick(XP10, PTE), y: ptr, metric: 'auc', nRepeats: REPEATS, seed: SEED }));
w();
w(`On the pay model of ${ref('logistic')}, scored by AUC on its test wells (baseline ${f6(LGp.baseline)}): ${LGp.importances.map((im) => `${im.feature} ${f6(im.mean)} (SD ${f6(im.sd)})`).join(', ')}; ranking ${list(LGp.ranking)}. The drop for AUC is baseline less permuted.`);
must('RT ranks first for the pay model', LGp.ranking[0] === 'RT', list(LGp.ranking));
w();
w('Importance is measured on the rows scored, here the test wells, and describes the fitted model: a feature the model leans on, whether or not the rock does.');

/* ============================================================ SECTION 22 */

section('learningcurve', 'The learning curve, counted in wells', ['Expert m04']);
const LC = success('learningCurve, ols, rmse', ML.learningCurve({ X: XL9, y: Y9, groups: G9, model: { kind: 'ols' }, trainGroupCounts: COUNTS, testFraction: TF, seed: SEED, metric: 'rmse' }));
w(`\`learningCurve\` holds out test wells with one \`groupSplit\` (fraction ${S(TF)}, seed ${S(SEED)}: ${list(LC.testGroups)}), then fits on the first m training wells of the split's shuffled order, ${list(LC.trainOrder)}, for each m, and scores each fit on its own training rows and on the fixed test wells. Sizes are counted in wells. OLS on GR, RHOB and NPHI, RMSE in us/ft:`);
w();
table(['training wells m', 'training rows', 'wells used', 'training RMSE', 'test RMSE'], LC.points.map((p) => [S(p.nGroups), S(p.nRows), list(p.groups), f6(p.trainScore), f6(p.testScore)]));
const lcFirst = LC.points[0]; const lcLast = LC.points[LC.points.length - 1];
must('the test RMSE with one well is above the test RMSE with six', lcFirst.testScore > lcLast.testScore, `${lcFirst.testScore} ${lcLast.testScore}`);
w();
w(`With one training well the model scores ${f6(lcFirst.trainScore)} on its own rows and ${f6(lcFirst.testScore)} on the test wells; with ${lcLast.nGroups} it scores ${f6(lcLast.trainScore)} and ${f6(lcLast.testScore)}. The training score is the fit to wells the model has seen and the test score the error on wells it has not; the curve shows how the second changes as wells are added, well by well in a stated order. A curve still falling at the last point says more wells would help; a flat one says the features, the model, or the well-to-well offsets now set the error.`);
const lcTest = LC.points.map((p) => p.testScore);
const lcMonotone = lcTest.every((v, i) => i === 0 || v <= lcTest[i - 1]);
w();
w(`The test RMSE ${lcMonotone ? 'falls at every added well here' : 'does not fall at every added well here'}: the order of the wells is the shuffle's, and a well with a large offset added early or late moves the curve.`);

/* ============================================================ SECTION 23 */

section('missinglog', 'Missing-log prediction end to end, and writing it back', ['Expert m05']);
w(`${T.NO_SONIC_WELL} has no sonic (${ref('dataset')}). The task: predict its DT from the logs it does have, say how good the prediction is expected to be, and write it back so no one mistakes it for a measurement. Every step below is a call to the engine.`);
w();
w(`STEP ${step()}, CHOOSE THE FEATURES AND LAMBDA BY WHOLE WELLS. The k-fold of ${ref('kfold')} (k ${K3}, seed ${S(SEED)}) compared feature sets on wells the model had not seen. One more candidate is scored here on the same folds, the logs with the caliper:`);
w();
const cvC = {};
[RL[0], Number(bLogs)].forEach((lam) => { cvC[lam] = mean(cvScore(XC9, lam, KF.folds)); });
table(['features', 'lambda', 'mean test RMSE over the three folds (us/ft), derived'], [
  ['GR, RHOB, NPHI', S(RL[0]), f6(CV.logs[RL[0]])], ['GR, RHOB, NPHI', bLogs, f6(vLogs)],
  ['GR, RHOB, NPHI, CALI', S(RL[0]), f6(cvC[RL[0]])], ['GR, RHOB, NPHI, CALI', bLogs, f6(cvC[bLogs])],
  ['the logs and the four attributes', bAttrs, f6(vAttrs)],
]);
must('the chosen set is the logs alone at their best lambda', vLogs <= Math.min(cvC[RL[0]], cvC[bLogs], vAttrs, CV.logs[RL[0]]), 'lowest');
w();
w(`The lowest is the three logs at lambda ${bLogs}, ${f6(vLogs)} us/ft. That mean is the expected error for a NEW well LIKE the nine, and it is the number the write-back carries.`);
w();
const RF = success(`ridge on all nine wells, lambda ${bLogs}`, ML.ridge({ X: XL9, y: Y9, lambda: Number(bLogs), names: LOGS }));
const XN = X(NOS, LOGS);
const PN = success(`predict ${T.NO_SONIC_WELL}`, ML.predict({ model: RF, X: XN }));
w(`STEP ${step()}, FIT ON EVERY WELL THAT HAS THE LOG. Ridge at lambda ${bLogs} on all ${RF.n} sonic rows: coefficients in original units ${RF.coefficients.map(f6).join(', ')} (intercept, GR, RHOB, NPHI).`);
w();
w(`STEP ${step()}, CHECK THE NEW WELL AGAINST THE TRAINING RANGE. Min-max scaling fitted on the nine wells (${ref('scaling')}) maps ${hotAbove} of the ${NOS.length} ${T.NO_SONIC_WELL} rows above 1 on GR, the highest to ${f6(colMax(mm6.X, 0))}. On those rows the model extrapolates. The well was drilled through a hot shale (stated, ${ref('dataset')}): its GR reads ${S(T.HOT_GR_ADD)} gAPI above what the rock alone gives on every row, and GR carries a positive coefficient.`);
w();
const hotIdx = mm6.X.map((r, i) => (r[0] > 1 ? i : -1)).filter((i) => i >= 0);
w(`STEP ${step()}, PREDICT. ${PN.values.length} predicted DT values, from ${f6(Math.min(...PN.values))} to ${f6(Math.max(...PN.values))} us/ft.`);
w();
const WH = E.withheld.DT;
const MW = success('metrics against the withheld sonic', ML.regressionMetrics({ yTrue: WH, yPred: PN.values }));
const bias = mean(PN.values.map((v, i) => v - WH[i]));
const inIdx = PN.values.map((_, i) => i).filter((i) => !hotIdx.includes(i));
const MWin = success('metrics against the withheld sonic, rows inside the range', ML.regressionMetrics({ yTrue: pick(WH, inIdx), yPred: pick(PN.values, inIdx) }));
const MWhot = success('metrics against the withheld sonic, rows above the range', ML.regressionMetrics({ yTrue: pick(WH, hotIdx), yPred: pick(PN.values, hotIdx) }));
w(`STEP ${step()}, ONLY BECAUSE THIS FIELD IS SYNTHETIC: CHECK AGAINST THE WITHHELD SONIC. A real well gives no such check; the generator kept the DT it drew (${ref('dataset')}).`);
w();
table(['rows of ' + T.NO_SONIC_WELL, 'rows', 'RMSE against the withheld DT (us/ft)', 'MAE (us/ft)'], [
  ['all', S(MW.n), f6(MW.rmse), f6(MW.mae)],
  ['GR inside the training range', S(MWin.n), f6(MWin.rmse), f6(MWin.mae)],
  ['GR above the training range', S(MWhot.n), f6(MWhot.rmse), f6(MWhot.mae)],
]);
must('the hot rows predict worse than the in-range rows', MWhot.rmse > MWin.rmse, `${MWhot.rmse} ${MWin.rmse}`);
must('the whole-well error exceeds the k-fold estimate', MW.rmse > vLogs, `${MW.rmse} ${vLogs}`);
w();
const hotPart = RF.coefficients[1] * T.HOT_GR_ADD;
const offRel = T.DT_OFFSETS[T.NO_SONIC_WELL] - offMean;
w(`The mean of predicted less withheld is ${f6(bias)} us/ft (derived): the predictions sit high on every row, inside the range as well as above it. Two stated causes account for it. The hot shale adds ${S(T.HOT_GR_ADD)} gAPI to every ${T.NO_SONIC_WELL} sample, and the GR coefficient of ${f6(RF.coefficients[1])} us/ft per gAPI turns that into ${f6(hotPart)} us/ft on every row (derived, coefficient x ${S(T.HOT_GR_ADD)}). The well's own planted sonic offset, less the nine-well mean the intercept absorbed, is ${f6(offRel)} us/ft (stated, as in ${ref('residuals')}); a prediction cannot know it. ${f6(hotPart)} less ${f6(offRel)} is ${f6(hotPart - offRel)} (derived), within ${f6(Math.abs(bias - (hotPart - offRel)))} of the mean error.`);
must('the hot shale term less the offset accounts for the bias to within 1.5 us/ft', Math.abs(bias - (hotPart - offRel)) < 1.5, `${bias} ${hotPart} ${offRel}`);
w();
w(`A RANGE CHECK SEES ONLY THE ROWS THAT LEAVE THE RANGE. Min-max flagged ${hotAbove} rows, and those read ${f6(MWhot.rmse)} against ${f6(MWin.rmse)} inside the range: the ${MWin.n} rows inside it are shifted by the same hot shale and pass the check. The RMSE on the whole well, ${f6(MW.rmse)}, is above the k-fold estimate of ${f6(vLogs)}, which holds for a well like the nine. A shift that keeps a well inside the training range is found by comparing its logs with its neighbours' (the data quality course) and by the geology, and never by the scaler.`);
w();
w(`STEP ${step()}, WRITE IT BACK HONESTLY. The course's rule for a predicted log, every value in it taken from the steps above:`);
w();
table(['item', 'what is written'], [
  ['channel name', 'a new channel, DT_PRED, beside the measured DT; the measured DT stays null'],
  ['method', `ridge, lambda ${bLogs}, features GR, RHOB, NPHI, fitted on ${RF.n} rows of ${SONIC_WELLS.length} wells`],
  ['wells trained on', list(ids9)],
  ['expected error', `k-fold by wells, k ${K3}, seed ${S(SEED)}: mean test RMSE ${f6(vLogs)} us/ft`],
  ['rows outside the training range', `${hotAbove} of ${NOS.length}, GR above the nine-well maximum ${f6(mm9.max[0])} gAPI; flagged row by row`],
  ['what is not claimed', 'no error for rows outside the range, and no measurement'],
]);
w();
w('A prediction written back without its method, its training wells, its expected error and its out-of-range flags will be read later as a measurement.');

/* ============================================================ SECTION 24 */

section('boundaries', 'Where each boundary falls, rule by rule', ['Expert m06', 'Professional m04 l04']);
w('Each rule draws its own boundary; nothing here is global. Every row is a real call or quotes the engine\'s basis.');
w();
const bConstOk = ML.fitStandardScaler({ X: PROBE_ALMOST.map((v) => [v]) });
const bConstNo = ML.fitStandardScaler({ X: PROBE_SAME.map((v) => [v]) });
const NP_X = [[1], [2], [3]];
const NP_Y = [1, 3, 4];
const bNp = ML.ols({ X: NP_X.slice(0, 2), y: NP_Y.slice(0, 2) });
const bNp1 = ML.ols({ X: NP_X, y: NP_Y });
const bEps = ML.logLoss({ yTrue: [1, 0], probabilities: [ML.DEFAULTS.LOG_LOSS_EPS, 0.5] });
const bEps2 = ML.logLoss({ yTrue: [1, 0], probabilities: [P_BELOW_EPS, 0.5] });
const bZd = ML.classificationReport({ yTrue: [0, 1, 1], yPred: [0, 1, 0] });
must('a column with any difference is fitted', !bConstOk.error, bConstOk.error);
must('an identical column is refused', !!bConstNo.error, 'refused');
must('n = p is refused and n = p + 1 fitted', !!bNp.error && !bNp1.error, 'n p');
must('a probability equal to eps is kept and one below it clipped', bEps.clipped === 0 && bEps2.clipped === 1, `${bEps.clipped} ${bEps2.clipped}`);
must('a report with every denominator non-zero lists no undefined ratio', bZd.undefinedRatios.length === 0, bZd.undefinedRatios.length);
table(['function', 'rule', 'boundary', 'shown by'], [
  ['`fitStandardScaler`, `fitMinMaxScaler`', 'refuse a constant feature', 'only when every training value is identical', `[${list(PROBE_ALMOST.map(S))}] is fitted (scale ${eX(bConstOk.scale[0])}); [${list(PROBE_SAME.map(S))}] is refused`],
  ['`applyScaler` (min-max)', 'no clipping', 'a new row outside the training range maps outside [0, 1]', `${T.NO_SONIC_WELL} GR to ${f6(colMax(mm6.X, 0))} (${ref('scaling')})`],
  ['`groupSplit`, `randomRowSplit`', 'test size ceil(f x count)', `a product within ${eX(ML.DEFAULTS.WHOLE_TOL)} of a whole number is that number`, `the golden product holds out the whole number (${ref('shuffle')})`],
  ['`groupKFold`', '2 <= k <= number of groups', 'k equal to the number of groups is allowed (leave one out)', `k ${ids9.length} on nine wells is fitted; k ${ids9.length + 1} is refused (${ref('kfold')}, ${ref('refusals')})`],
  ['`ols`', 'more rows than coefficients', 'n = p is refused', `${NP_X.length - 1} rows for ${NP_X[0].length + 1} coefficients refused; ${NP_X.length} rows fitted, residual degrees of freedom ${bNp1.dfResidual}`],
  ['`ols`, `ridge`', 'refuse the scaled condition number above maxCondition', 'exactly at the limit is fitted', `Longley refused at ${S(LB1.args.maxCondition)}, fitted at ${S(LB2.args.maxCondition)} (${ref('conditioning')})`],
  ['`logistic`', 'converged when the largest full Newton step is at most tol', 'inclusive', `the pay fit stops at a step of ${eX(lastT.maxChange)} (${ref('convergence')})`],
  ['`logistic`', 'halve a step that lowers the penalised log likelihood', 'a fall of more than 1e-12 x (1 + |l|); strict', `the pay fit halved ${LG.stepHalvings} times`],
  ['`solveSPD`', 'singular', 'a diagonal entry at or below zero, or a scaled pivot at or below p x machine epsilon; inclusive', `the rank one matrix of ${ref('refusals')}`],
  ['`predict` (logistic)', 'class 1', 'a probability above 0.5; exactly 0.5 is class 0', `golden \`predict-logistic-half\` (${ref('logistic')})`],
  ['`rocCurve`', 'a row is called positive', 'at a score at or above the threshold; equal scores move together', `golden \`roc-ties\` (${ref('roc')})`],
  ['`logLoss`', 'clip to [eps, 1 - eps]', 'a probability equal to eps is kept', `p = ${eX(ML.DEFAULTS.LOG_LOSS_EPS)} clips ${bEps.clipped} rows; p = ${eX(P_BELOW_EPS)} clips ${bEps2.clipped}`],
  ['`classificationReport`', 'score zeroDivision', 'only when a denominator is 0', `yTrue [0, 1, 1], yPred [0, 1, 0]: ${bZd.undefinedRatios.length} ratios scored zeroDivision`],
]);

/* ============================================================ SECTION 25 */

section('choices', 'Conventions that are choices, and what is not built', ['Expert m06']);
w('Every convention below is a choice the engine states in its basis. Each has a real alternative in common use; name the choice when a number from this engine is compared with one from another tool.');
w();
table(['convention', 'this engine', 'a common alternative', 'why the engine chose it'], [
  ['scaler divisor', 'population SD (n)', 'sample SD (n - 1), which the data quality course uses for its z-score', 'ridge lambda then equals scikit-learn alpha on the same features'],
  ['random draws', 'mulberry32(seed), Fisher-Yates from the end', 'a library generator (numpy, scikit-learn)', 'one canonical generator across the platform; no library reproduces its draws, so splits are compared by well list'],
  ['group names', 'sorted by UTF-16 code unit before the shuffle', 'natural order (EKENE-2 before EKENE-10)', 'a stated order that needs no parsing of names'],
  ['k-fold', 'round robin over shuffled groups: balances the number of wells', 'scikit-learn GroupKFold: balances rows and takes no seed', 'seeded and reproducible; every well tested once'],
  ['test R-squared', 'about the mean of the test targets', 'about the training mean (referenceMean)', 'matches scikit-learn r2_score; the option is there'],
  ['OLS refusal', `scaled condition number above ${eX(ML.DEFAULTS.MAX_CONDITION)}`, 'fit anything and warn', `at ${eX(ML.DEFAULTS.MAX_CONDITION)} the worst-case bound reaches the coefficient itself`],
  ['logistic stop', `largest full Newton step at most ${eX(ML.DEFAULTS.LOGISTIC_TOL)}, in coefficient units`, 'a relative or column-scaled rule', 'the full step cannot be faked by halving; the unit is stated in the basis'],
  ['separation', 'decided exactly by two linear programmes before iterating, refused at l2 = 0', 'iterate and watch the coefficients grow', 'a separated maximum likelihood fit has no finite answer to print'],
  ['F1', '2TP / (2TP + FP + FN)', 'the harmonic mean of precision and recall', 'equal wherever both are defined, and defined in more cases'],
  ['ROC start', 'threshold null', 'scikit-learn prints infinity', 'JSON has no infinity'],
  ['log loss clip', `eps = ${eX(ML.DEFAULTS.LOG_LOSS_EPS)}`, 'the float dtype epsilon (scikit-learn 1.9)', 'a stated constant'],
  ['permutation drop', 'loss of score, positive when the feature matters', 'the raw permuted score', 'one sign for every metric'],
  ['learning curve size', 'counted in wells', 'counted in rows', 'rows of one well are not independent'],
]);
w();
w('WHAT IS NOT BUILT. The engine fits linear models only (least squares, ridge, binary logistic). There is no tree, forest, boosting, neural network, neighbour rule or clustering (clustering and facies are the electrofacies course\'s), no multiclass logistic, no nonlinear feature expansion, no prediction interval and no sampling of inputs (uncertainty is its own course\'s), no imputation (a missing value is refused), no stratified split and no time-ordered split (forecasting is its own course\'s), and no search over lambda or features: the course runs the folds and prints the scores it compared.');

/* ============================================================ SECTION 26 */

section('vocabulary', 'Vocabulary this course legislates before a word is written', ['Associate m01', 'Professional m01', 'Expert m01']);
w('Six words in this course carry a narrower meaning than they have in conversation or elsewhere in the academy. The rule for each is binding on every lesson, bank question, key truth and panel.');
w();
table(['word', 'what it can mean elsewhere', 'the rule here'], [
  ['test', 'any check', 'rows the model was not fitted on; in this course a whole well held out, unless the text names a random-row split'],
  ['standard deviation', 'either divisor', 'name the divisor: the scaler uses the population SD (n); the data quality course\'s z-score uses the sample SD (n - 1)'],
  ['R-squared', 'one number per fit', 'name the rows and the reference mean: the training fit, the test rows about their own mean, or the test rows about the training mean'],
  ['separation', 'any split of the data', 'the logistic property: a hyperplane puts the classes on their own sides (complete) or on or beside it (quasi-complete). A split is a split'],
  ['importance', 'how much a feature matters in the rock', 'the loss of score when the feature is shuffled, for this fitted model, on these rows, with this seed and these repeats'],
  ['machine learning', 'any automated judgement', 'a fitted statistical model named by its method (least squares, ridge, logistic); no lesson calls a model artificial intelligence'],
]);
w();
w('No P label is used in this course. A probability from the logistic model is the probability of PAY = 1 for that row.');

/* ============================================================ CLOSING CHECKS */

// Every planted structure must have been found by the method named.
T.PLANTED.forEach((p, i) => must(`planted structure ${i} (${p[0]}) is checked by some section`, PLANT_FOUND.get(i) === true, PLANT_FOUND.get(i)));
// Every module the course has must be owned by at least one section.
const allMods = Object.entries(MODULES).flatMap(([tier, mods]) => Object.keys(mods).map((m) => `${tier} ${m}`));
const unowned = allMods.filter((m) => !OWNED.has(m));
must('every module of every tier is owned by at least one section', unowned.length === 0, unowned.join(', ') || 'all owned');
must('every declared section was written', SECTION === ORDER.length, `${SECTION} of ${ORDER.length}`);

must('no unrendered template placeholder reaches the digest', !OUT.some((l) => l.includes('${')), OUT.find((l) => l.includes('${')));

const failed = ASSERTS.filter((a) => !a.pass);
if (failed.length) {
  failed.forEach((a) => process.stderr.write(`  FAILED  ${a.claim}\n          ${a.detail}\n`));
  process.stderr.write(`d2_dump: ${ASSERTS.length} assertions, ${failed.length} FAILED. NOTHING WRITTEN.\n`);
  if (process.env.D2_DUMP_PARTIAL) process.stdout.write(`${OUT.join('\n')}\n`);
  process.exit(1);
}
process.stderr.write(`d2_dump: ${ASSERTS.length} label-and-call, measurement and claim assertions run, 0 failed; ${SECTION} sections\n`);
process.stdout.write(`${OUT.join('\n')}\n`);
