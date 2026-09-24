// THE D3 TEACHING DIGEST. This is the ONLY teaching truth for every writer
// after this file: the lesson author, the bank author, the key-truth author and
// the panel author all quote from digest.txt and from nothing else.
//
// THE ENGINE'S FINDINGS RECORD IS NOT TEACHING TRUTH. FINDINGS-cluster.md, the
// oracle, the library pins and the engine's own source comments are
// PROVENANCE. Where a figure in FINDINGS is teachable (the iris explained
// variance ratio scikit-learn publishes, the iris k-means inertia) this file
// recomputes it through the engine on the vendored iris file and prints it,
// and a writer quotes the digest line.
//
// Usage:  sh /root/dai-wip-facies/build_digest.sh > digest.tmp \
//           && mv digest.tmp /root/dai-wip-facies/digest.txt
// Build THROUGH A TEMP FILE. A gate that reads a half written digest finds no
// literals and clears everything.
//
// EVERY NUMBER PRINTED HERE IS A RETURN VALUE OF AN ENGINE (cluster.js, or
// ml.js where a mapped facies is scored), except where a line says "golden"
// (read from the vendored case file), "stated" (an input named on the same row
// or in the dataset generator) or "derived" (arithmetic on engine values or
// stated inputs printed in the same block, with the arithmetic stated).
// Nothing here reads a clock, a random number, a locale or a network; the
// dataset comes from d3_fields.mjs through the canonical seeded mulberry32, and
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
// THE DIGEST IS NOT THE CAPSTONE. This file never reads d3_capstone.mjs,
// fields.json or the capstone datasets, and the capstone never reads this.
//
// THIS COURSE TEACHES NO REPAIR HISTORY, so no section of this digest describes
// former behaviour.
import fs from 'node:fs';
import process from 'node:process';
import { execFileSync } from 'node:child_process';
import * as T from './d3_fields.mjs';

const HERE = process.env.D3_WAVE_DIR || '/root/dai-wip-facies';
const ROOT = process.env.D3_ENGINES || '/root/wt-dai-d3-nextgen/packages/engines';
const ENGINE_REL = 'engines/dataai/cluster.js';
const CL = await import(`${ROOT}/${ENGINE_REL}`);
const ML = await import(`${ROOT}/engines/dataai/ml.js`);
const ST = await import(`${ROOT}/lib/stats/stats.js`);
const ENGINE_SRC = fs.readFileSync(`${ROOT}/${ENGINE_REL}`, 'utf8');
const GOLD = JSON.parse(fs.readFileSync(`${ROOT}/test-data/dataai/goldens/cluster_cases.json`, 'utf8'));
const CASES = GOLD.cases;
const IRIS_TEXT = fs.readFileSync(`${ROOT}/test-data/dataai/iris/iris.csv`, 'utf8');
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
const sum = (a) => a.reduce((s, v) => s + v, 0);
const mean = (a) => sum(a) / a.length;
const count = (a) => a.reduce((m, v) => { m.set(v, (m.get(v) || 0) + 1); return m; }, new Map());
const byChar = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

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
const ORDER = ['computes', 'dataset', 'refusals', 'distance', 'scaling', 'pca', 'loadings', 'kmeans', 'starts', 'reading', 'covariance', 'iris', 'workflow',
  'elbow', 'silhouette', 'agglomerative', 'linkage', 'matching', 'ari', 'judging',
  'knn', 'cart', 'ties', 'uncored', 'boundaries', 'bands', 'choices',
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
const LOGS = [...T.LOGS];
const LOGS_C = [...T.LOGS, 'CALI'];
const X = (rows, feats = LOGS) => rows.map((r) => feats.map((f) => r[f]));
const CORED_ROWS = ROWS.filter((r) => r.FACIES !== null);
const XC = X(CORED_ROWS);
const XC5 = X(CORED_ROWS, LOGS_C);
const YC = CORED_ROWS.map((r) => r.FACIES);
const GC = CORED_ROWS.map((r) => r.well);
const FACIES_SORTED = [...new Set(YC)].sort(byChar);
const wellRows = (id) => ROWS.filter((r) => r.well === id);
const [UN1, UN2] = T.UNCORED;
const R7 = wellRows(UN1);
const R8 = wellRows(UN2);
const X7 = X(R7);
const X8 = X(R8);
const W7 = E.withheld[UN1];
const W8 = E.withheld[UN2];
// Stated teaching inputs, each passed to the engine AND printed from here, so
// the prose cannot drift from the call.
const K4 = 4; // the teaching number of clusters: four core facies
const SEED = 3; // the teaching seed
const KMAX = 8; // the largest k of the elbow
const KNN_K = 5; // the teaching number of neighbours
const KNN_KS = [1, 3, 5, 7, 9, 15];
const DEPTHS = [0, 1, 2, 3, 4, 5, 6];
const HELD = 'EKENE-6'; // the cored well held out to score a prediction, stated
const SAMPLE = 60; // a seeded silhouette sample, stated
const CHECK_TOL = 1e-9; // the tolerance of the derived checks the digest names
const accOf = (yTrue, yPred) => ML.classificationReport({ yTrue, yPred });
let STEP = 0;
const step = () => { STEP += 1; return STEP; };

/* ================================================================ HEADER */

const engineLines = ENGINE_SRC.replace(/\n$/, '').split('\n').length;
const refusalsInGolden = CASES.filter((c) => c.expected && c.expected.error === true).length;
const publishedInGolden = CASES.filter((c) => c.source === 'published').length;
w('# D3 TEACHING DIGEST: Electrofacies');
w();
w('# THIS FILE IS THE ONLY TEACHING TRUTH FOR THIS COURSE. Every number in every lesson, bank question, key truth and panel comes from a line below. The engine FINDINGS record, the oracle, the library pins and the engine source comments are PROVENANCE and not teaching truth.');
w();
w('# PRECISION. Every log value, centre, scale, distance, eigenvalue, ratio, loading, score, inertia, silhouette, merge height, index, accuracy, impurity, importance and threshold prints to SIX decimals; counts, row numbers, cluster numbers, passes, depths, seeds and well numbers are whole numbers; very small magnitudes and tie bands print in exponent form; an engine message is printed verbatim, figures and all.');
w();
w(`# ENGINE. ${ENGINE_REL}, vendored sha-identical with petrolord-engines 4dfbb29, ${engineLines} lines. It imports lib/stats (mulberry32) and, from engines/dataai/ml.js, the two scalers, applyScaler and classificationReport. The vendored golden test-data/dataai/goldens/cluster_cases.json carries ${CASES.length} cases, ${refusalsInGolden} of them refusals and ${publishedInGolden} of them a published anchor, written by the standard library oracle.`);
w();
w('# WHAT IS NEVER IN THIS FILE. No capstone field, no capstone well, no capstone dataset and no graded answer. The capstones run their own datasets and the digest never names them.');
w();
w('# THIS COURSE TEACHES NO REPAIR HISTORY. Every section below describes what the engine does today.');

/* ============================================================ SECTION 1 */

section('computes', 'What this engine computes, and what it declines to compute', ['Associate m01', 'Expert m06']);
w('Every function takes plain arrays and objects and returns either a result object or an object with `error` and `field`, where `field` names the input it refused and the message starts with that name. Every result carries a `basis` block naming its convention, so the working can be printed.');
w();
const EXPORTS = [
  ['pca', 'components', 'X, names, matrix, nComponents', 'eigenvalues, explained variance ratios, unit components, loadings and scores'],
  ['pcaTransform', 'components', 'model, X', 'scores of new rows with the fitted centre, scale and components'],
  ['kmeans', 'clustering', 'X, k, seed, nInit, maxIter, init, scale, names', 'labels, sizes, centres (scaled and in log units), inertia, passes and every start'],
  ['assignClusters', 'clustering', 'model, X', 'the nearest centre of a fitted k-means for each new row, with its distance'],
  ['silhouette', 'judging clusters', 'X, labels, scale, names, sampleSize, seed', 'the silhouette of every row, its mean, and the mean of each cluster'],
  ['elbow', 'judging clusters', 'X, kMin, kMax, seed, nInit, scale, withSilhouette', 'k-means inertia for each k, the drops, and the silhouette when asked'],
  ['agglomerative', 'clustering', 'X, linkage, k, scale, names', 'the full merge history as a linkage matrix, and the labels of a cut'],
  ['cutTree', 'clustering', 'linkageMatrix, k', 'the labels of a k-cluster cut of a returned linkage matrix'],
  ['knnClassify', 'classification', 'X, y, Xnew, k, scale, names', 'a predicted facies for each new row, its neighbours, distances and votes'],
  ['cartFit', 'classification', 'X, y, names, maxDepth, minSamplesLeaf, minSamplesSplit', 'a Gini classification tree, its printed form, importances and training accuracy'],
  ['cartPredict', 'classification', 'model, X', 'the facies of the leaf each new row reaches'],
  ['adjustedRandIndex', 'agreement', 'a, b', 'the adjusted Rand index of two labellings and their contingency table'],
  ['matchClusters', 'agreement', 'yTrue, clusters, mode, zeroDivision', 'clusters mapped to core facies, the mapped predictions scored, and the adjusted Rand index'],
];
EXPORTS.forEach(([name]) => must(`${name} is exported`, typeof CL[name] === 'function', typeof CL[name]));
table(['function', 'role', 'what it needs', 'what it returns'], EXPORTS.map(([n, d, a, r]) => [`\`${n}\``, d, a, r]));
must('the table lists every exported function', Object.keys(CL).filter((k) => typeof CL[k] === 'function').length === EXPORTS.length,
  Object.keys(CL).filter((k) => typeof CL[k] === 'function').join(','));
w();
w('The stated defaults, read from the exported `DEFAULTS`:');
w();
const DSRC = {
  JACOBI_MAX_SWEEPS: 'the most sweeps of Jacobi rotations pca takes',
  SIGN_TIE_REL: 'how close a loading must be to the largest to count as largest, in the sign rule',
  REPEATED_EIGEN_REL: 'how close two eigenvalues must be, relative to the largest, to be flagged as repeated',
  KMEANS_MAX_ITER: 'the most assignment passes one k-means start takes',
  KMEANS_N_INIT: 'the number of k-means++ starts when nInit is left out',
  SILHOUETTE_MAX_ROWS: 'the most rows the silhouette scores in full',
  AGGLOMERATIVE_MAX_ROWS: 'the most rows agglomerative clustering accepts',
  TIE_REL: 'how close a distance or merge height must be to the smallest, relative, to be tied',
  KNN_MAX_PAIRS: 'the most training rows x new rows kNN computes',
  CART_MAX_DEPTH: 'the tree depth cartFit grows to when maxDepth is left out (the root is depth 0)',
  MATCH_MAX_LABELS: 'the most distinct clusters or facies matchClusters takes',
};
table(['default', 'value', 'what it sets'], Object.entries(CL.DEFAULTS).map(([k, v]) => [`\`${k}\``, Number.isInteger(v) ? S(v) : eX(v), DSRC[k]]));
must('DEFAULTS carries eleven values, each described here', Object.keys(CL.DEFAULTS).length === 11 && Object.keys(CL.DEFAULTS).every((k) => DSRC[k]), Object.keys(CL.DEFAULTS));
must('DEFAULTS is frozen', Object.isFrozen(CL.DEFAULTS), 'frozen');
w();
w('WHAT THE ENGINE DOES NOT DO, checked here against its exports:');
must('no export fills or imputes a missing value', !Object.keys(CL).some((k) => /impute|fill|interpolat/i.test(k)), Object.keys(CL).join(','));
must('no export builds a self-organising map, a mixture model, a forest or a network', !Object.keys(CL).some((k) => /som|organi|mixture|gmm|gauss|forest|boost|neural|network|dbscan|spectral/i.test(k)), 'none');
must('no export splits wells or cross-validates', !Object.keys(CL).some((k) => /split|fold|cross|leak/i.test(k)), 'none');
w('- It does not fill a missing value. A null or non-finite entry in X is refused by name, and filling or dropping it is the caller\'s decision (the data quality course conditions logs).');
w('- It builds no self-organising map, no Gaussian mixture, no density clustering, no forest, no boosting and no neural network. Clustering is k-means and agglomerative; classification is k nearest neighbours and one CART tree.');
w('- It does not split wells or cross-validate. A split by whole wells and its scores are the machine learning course\'s; this course states which wells train and which are held out.');
w('- It does not choose k, the logs or the linkage. The elbow and the silhouette print what a choice rests on; no elbow is picked automatically.');
w(`- Its exported names are, in full: ${Object.keys(CL).sort().join(', ')}.`);

/* ============================================================ SECTION 2 */

section('dataset', 'The Ekene facies wells, their seed and their planted structure', ['Associate m01', 'Associate m06', 'Expert m04']);
w(`Every row in this course comes from one generator, d3_fields.mjs, which draws through the canonical mulberry32 and randomNormal of lib/stats on one stated seed, ${S(T.SEED)}, and rounds every value to the decimals a real file carries. The same inputs give the same file anywhere. The Ekene field is synthetic.`);
w();
w(`${T.N_WELLS} wells, ${list(T.WELL_IDS)}, carry ${T.N_PER_WELL} samples each at a one foot step, each well at its own depth: ${ROWS.length} rows in all.`);
must('the dataset carries wells x samples rows', ROWS.length === T.N_WELLS * T.N_PER_WELL, ROWS.length);
w();
table(['channel', 'unit', 'what it is'], [...T.CHANNELS, ['FACIES', 'a name', 'the core facies, on cored wells only']].map((c) => [...c]));
w();
w(`Every well, its top depth and whether it was cored (stated):`);
w();
table(['well', 'top depth (ft), stated', 'cored', 'rows'], E.wells.map((x) => [x.id, S(x.top), T.UNCORED.includes(x.id) ? 'no' : 'yes', S(wellRows(x.id).length)]));
w();
w(`THE FACIES, stated. Each sample belongs to one of four facies. A well keeps the facies of the sample above with probability ${S(T.STAY)} and otherwise draws a facies at random, so facies come in blocky runs. Each facies draws each log from its own normal distribution, mean and standard deviation stated:`);
w();
table(['facies', 'GR (gAPI)', 'RHOB (g/cm3)', 'NPHI (v/v)', 'PEF (b/e)'], T.FACIES.map(([n, ...p]) => [n, ...p.map(([m, s]) => `${S(m)} (SD ${S(s)})`)]));
w();
w(`CALI is drawn as ${S(T.CALI_BASE)} in plus the size of a normal draw with SD ${S(T.CALI_SD)} in, whatever the facies (stated).`);
w();
const fc = count(YC);
w(`Names sort by character, so every list the engine returns puts the facies in the order ${list(FACIES_SORTED)}. On the ${CORED_ROWS.length} cored rows of the ${T.CORED.length} cored wells the facies count:`);
w();
table(['facies', 'cored rows'], FACIES_SORTED.map((f) => [f, S(fc.get(f))]));
must('the four facies are present on the cored rows', FACIES_SORTED.length === 4, FACIES_SORTED.join(','));
must('the facies counts sum to the cored rows', sum([...fc.values()]) === CORED_ROWS.length, CORED_ROWS.length);
w();
w(`THE UNCORED WELLS, stated: ${UN1} and ${UN2} have no core, so FACIES is null on every one of their rows. The generator keeps the facies it drew for them apart from the rows, as \`withheld\`; a real field has no such record, and this course reads it once, in ${ref('uncored')}, to check a prediction.`);
must('FACIES is null on the uncored wells and on no other row', ROWS.every((r) => T.UNCORED.includes(r.well) === (r.FACIES === null)), 'null pattern');
must('the withheld facies has one value per uncored row', W7.length === T.N_PER_WELL && W8.length === T.N_PER_WELL, `${W7.length} ${W8.length}`);
w();
w(`THE LIMESTONE BOUNDS, stated: limestone NPHI is held at or below ${S(T.LIME_NPHI_MAX)} and every other facies' NPHI at or above ${S(T.OTHER_NPHI_MIN)}; limestone PEF is held at or above ${S(T.LIME_PEF_MIN)} and every other facies' PEF at or below ${S(T.OTHER_PEF_MAX)}.`);
must('every limestone row holds the stated bounds and every other row the other side', ROWS.every((r, i) => {
  const f = r.FACIES ?? (r.well === UN1 ? W7 : W8)[i % T.N_PER_WELL];
  return f === 'limestone' ? (r.NPHI <= T.LIME_NPHI_MAX && r.PEF >= T.LIME_PEF_MIN) : (r.NPHI >= T.OTHER_NPHI_MIN && r.PEF <= T.OTHER_PEF_MAX);
}), 'bounds');
w();
w(`THE UNCALIBRATED TOOL, stated: ${T.HOT_WELL} was logged with a gamma ray tool that reads ${S(T.HOT_GR_ADD)} gAPI above what the rock gives, on every sample.`);
w();
w('THE PLANTED STRUCTURE, every item stated by the generator. Each is found by the named method, and the section that finds it asserts so; the build fails if any item is not found.');
w();
table(['what', 'where', 'how it was planted', 'the method that finds it'], T.PLANTED.map((p) => [...p]));
w();
w(`${T.PLANTED.length} items are planted.`);

/* ============================================================ SECTION 3 */

section('refusals', 'Every refusal, with the field it names and the engine\'s own words', ['Associate m01 l05', 'Associate m02 l04', 'Associate m03', 'Associate m04', 'Professional m01', 'Professional m02', 'Professional m03', 'Professional m04', 'Expert m01', 'Expert m02', 'Expert m05']);
w('Each row is a real call. The message column is the engine\'s `error` string, verbatim. A refusal carries no number of its own: any figure in it is part of the message.');
w();
const E1 = wellRows('EKENE-1');
const CALI_CONST = 8.5; // a caliper that never changes, stated
const NULL_ROW = 40; // the row whose RHOB is set null, stated
const PAIRS_TRAIN = CL.DEFAULTS.KNN_MAX_PAIRS / 1e4 + 1; // training rows in the pair-cap refusal
const PAIRS_NEW = CL.DEFAULTS.KNN_MAX_PAIRS / 1e4; // new rows in the pair-cap refusal
const withNull = CORED_ROWS.map((r, i) => (i === NULL_ROW ? [r.GR, null, r.NPHI, r.PEF] : [r.GR, r.RHOB, r.NPHI, r.PEF]));
const constCali = X(E1, ['GR', 'CALI']).map((r) => [r[0], CALI_CONST]);
const KM = CL.kmeans({ X: XC, k: K4, seed: SEED, names: LOGS });
const PCM = CL.pca({ X: XC, names: LOGS });
const CT = CL.cartFit({ X: XC, y: YC, names: LOGS, maxDepth: 2 });
const WARD = CL.agglomerative({ X: XC, linkage: 'ward', names: LOGS });
const TILE = (n) => Array.from({ length: n }, (_, i) => XC[i % XC.length]);
const TILE_Y = (n) => Array.from({ length: n }, (_, i) => YC[i % YC.length]);
const REFUSALS = [
  ['pca', { X: [XC[0]], names: LOGS }, 'X', 'one row'],
  ['pca', { X: XC, names: LOGS, nComponents: 5 }, 'nComponents', 'five components of four logs'],
  ['pca', { X: XC, names: LOGS, matrix: 'spearman' }, 'matrix', 'a matrix it does not build'],
  ['pca', { X: withNull, names: LOGS }, `X[${NULL_ROW}][1]`, `the ${CORED_ROWS.length} cored rows with row ${NULL_ROW}'s RHOB null`],
  ['pca', { X: constCali, names: ['GR', 'CALI'] }, 'X.CALI', `GR and a caliper reading ${S(CALI_CONST)} on all ${E1.length} rows of EKENE-1`],
  ['pca', { X: [XC[0], XC[0]], matrix: 'covariance' }, 'X', 'one cored row passed twice, covariance matrix'],
  ['pca', { X: XC, names: ['GR', 'RHOB', 'GR', 'PEF'] }, 'names[2]', 'a log name given twice'],
  ['pcaTransform', { model: KM, X: X7 }, 'model', 'a k-means result where a PCA was expected'],
  ['pcaTransform', { model: PCM, X: X(R7, ['GR', 'RHOB']) }, 'X', 'new rows with two logs for a PCA of four'],
  ['kmeans', { X: XC, k: 0, seed: SEED }, 'k', 'k of 0'],
  ['kmeans', { X: [XC[0], XC[1]], k: 3, seed: SEED, scale: 'none' }, 'k', 'three clusters of two rows'],
  ['kmeans', { X: [XC[0], XC[0], XC[1], XC[1]], k: 3, seed: SEED }, 'X', 'two cored rows passed twice each, three clusters'],
  ['kmeans', { X: XC, k: K4, names: LOGS }, 'seed', 'no seed'],
  ['kmeans', { X: XC, k: K4, seed: -1, names: LOGS }, 'seed', 'a negative seed'],
  ['kmeans', { X: XC, k: 2, nInit: 5, init: [XC[0], XC[1]] }, 'nInit', 'starting centres and five starts'],
  ['kmeans', { X: XC, k: 2, init: [XC[0]] }, 'init', 'one starting centre for two clusters'],
  ['kmeans', { X: XC, k: K4, seed: SEED, scale: 'log' }, 'scale', 'a scaling it does not offer'],
  ['kmeans', { X: XC, k: K4, seed: SEED, nInit: 0 }, 'nInit', 'no starts'],
  ['kmeans', { X: XC, k: K4, seed: SEED, maxIter: 0 }, 'maxIter', 'no passes'],
  ['kmeans', { X: constCali, k: 2, seed: SEED, names: ['GR', 'CALI'] }, 'X.CALI', `GR and a caliper reading ${S(CALI_CONST)} on all ${E1.length} rows of EKENE-1, standard scaling`],
  ['kmeans', { X: constCali, k: 2, seed: SEED, names: ['GR', 'CALI'], scale: 'minmax' }, 'X.CALI', 'the same rows, min-max scaling'],
  ['assignClusters', { model: PCM, X: X7 }, 'model', 'a PCA result where a k-means was expected'],
  ['assignClusters', { model: KM, X: X(R7, ['GR', 'RHOB', 'NPHI']) }, 'X', 'new rows with three logs for a model of four'],
  ['silhouette', { X: XC, labels: YC.map(() => 0) }, 'labels', 'every row in one cluster'],
  ['silhouette', { X: XC.slice(0, 4), labels: [0, 1, 2, 3] }, 'labels', 'four rows in four clusters'],
  ['silhouette', { X: XC, labels: KM.labels.slice(1) }, 'labels', 'one label too few'],
  ['silhouette', { X: XC.slice(0, 3), labels: [0, 1, 'shale'] }, 'labels[2]', 'a number and a name mixed'],
  ['silhouette', { X: XC, labels: KM.labels, sampleSize: CORED_ROWS.length + 1, seed: SEED }, 'sampleSize', 'a sample larger than the rows'],
  ['silhouette', { X: XC, labels: KM.labels, sampleSize: SAMPLE }, 'seed', 'a sample with no seed'],
  ['silhouette', { X: TILE(CL.DEFAULTS.SILHOUETTE_MAX_ROWS + 1), labels: TILE_Y(CL.DEFAULTS.SILHOUETTE_MAX_ROWS + 1) }, 'X', `${CL.DEFAULTS.SILHOUETTE_MAX_ROWS + 1} rows (the cored rows repeated) and no sample`],
  ['elbow', { X: XC, kMin: 4, kMax: 3, seed: SEED }, 'kMax', 'kMax below kMin'],
  ['elbow', { X: XC, kMin: 0, kMax: 3, seed: SEED }, 'kMin', 'kMin of 0'],
  ['elbow', { X: XC, kMax: 3, seed: SEED, withSilhouette: 'yes' }, 'withSilhouette', 'a word where true or false belongs'],
  ['agglomerative', { X: XC, linkage: 'single' }, 'linkage', 'single linkage'],
  ['agglomerative', { X: XC.slice(0, 6), k: 7 }, 'k', 'seven clusters of six rows'],
  ['agglomerative', { X: [XC[0]] }, 'X', 'one row'],
  ['agglomerative', { X: TILE(CL.DEFAULTS.AGGLOMERATIVE_MAX_ROWS + 1) }, 'X', `${CL.DEFAULTS.AGGLOMERATIVE_MAX_ROWS + 1} rows (the cored rows repeated)`],
  ['cutTree', { linkageMatrix: WARD.linkageMatrix, k: 0 }, 'k', 'k of 0 on the Ward tree of the cored rows'],
  ['cutTree', { linkageMatrix: [[0, 1, 1, 2], [3, 5, 2, 3]], k: 2 }, 'linkageMatrix[1]', 'a merge that names a cluster not yet made'],
  ['cutTree', { linkageMatrix: [], k: 1 }, 'linkageMatrix', 'an empty matrix'],
  ['knnClassify', { X: XC, y: YC, Xnew: X7, k: CORED_ROWS.length + 1 }, 'k', 'more neighbours than training rows'],
  ['knnClassify', { X: XC, y: YC, Xnew: X(R7, ['GR']) }, 'Xnew', 'new rows with one log for training rows of four'],
  ['knnClassify', { X: XC, y: YC.slice(1), Xnew: X7 }, 'y', 'one facies too few'],
  ['knnClassify', { X: XC.slice(0, 3), y: ['shale', null, 'shale'], Xnew: X7 }, 'y[1]', 'a null facies'],
  ['knnClassify', { X: TILE(PAIRS_TRAIN), y: TILE_Y(PAIRS_TRAIN), Xnew: TILE(PAIRS_NEW) }, 'Xnew', `${PAIRS_NEW} new rows against ${PAIRS_TRAIN} training rows (the cored rows repeated)`],
  ['cartFit', { X: XC, y: YC, maxDepth: -1 }, 'maxDepth', 'a negative depth'],
  ['cartFit', { X: XC, y: YC, minSamplesLeaf: 0 }, 'minSamplesLeaf', 'a leaf of no rows'],
  ['cartFit', { X: XC, y: YC, minSamplesSplit: 1 }, 'minSamplesSplit', 'a split of one row'],
  ['cartFit', { X: XC.slice(0, 3), y: ['shale', 'shale', 2] }, 'y[2]', 'a name and a number mixed'],
  ['cartFit', { X: XC, y: YC, names: ['GR', 'RHOB'] }, 'names', 'two names for four logs'],
  ['cartPredict', { model: KM, X: X7 }, 'model', 'a k-means result where a tree was expected'],
  ['cartPredict', { model: CT, X: X(R7, ['GR', 'RHOB']) }, 'X', 'new rows with two logs for a tree of four'],
  ['adjustedRandIndex', { a: ['shale'], b: ['shale'] }, 'a', 'one row'],
  ['adjustedRandIndex', { a: YC, b: KM.labels.slice(1) }, 'b', 'one label too few'],
  ['matchClusters', { yTrue: YC, clusters: CL.kmeans({ X: XC, k: 5, seed: SEED }).labels }, 'clusters', 'five clusters, four facies, one-to-one'],
  ['matchClusters', { yTrue: YC, clusters: KM.labels, mode: 'greedy' }, 'mode', 'a mode it does not offer'],
  ['matchClusters', { yTrue: YC, clusters: KM.labels.slice(1) }, 'clusters', 'one label too few'],
  ['matchClusters', { yTrue: YC, clusters: KM.labels, zeroDivision: 0.5 }, 'zeroDivision', 'a zero division score of one half, which ml.js refuses'],
];
const REF_OUT = REFUSALS.map(([fn, args, field, what]) => {
  const r = refusal(`${fn} with ${what}`, CL[fn](args), field);
  return [fn, what, r.field, r.error];
});
table(['function', 'what was passed', 'field named', 'the engine\'s message'], REF_OUT.map(([fn, what, field, msg]) => [`\`${fn}\``, what, `\`${field}\``, msg]));
const refFns = new Set(REF_OUT.map((r) => r[0]));
w();
w(`${REF_OUT.length} refusals are tabled above, across ${refFns.size} functions.`);
must('every exported function is refused at least once above', EXPORTS.every(([n]) => refFns.has(n)), [...refFns].join(','));
w();
const trainingWord = REF_OUT.filter((r) => /training rows/.test(r[3]) && r[0] !== 'knnClassify');
w(`A CONSTANT LOG IS REFUSED BY THE SCALER. pca (correlation), kmeans, silhouette, elbow, agglomerative and knnClassify scale through the machine learning engine's own scalers, so a constant log is refused in that engine's words, which call the rows the scaler is fitted on its training rows. In pca and in clustering those are every row passed; in knnClassify they are the training rows (${ref('knn')}). ${trainingWord.length} rows of the table above carry that wording outside knnClassify.`);
must('the scaler refusals carry the ml.js wording', trainingWord.length >= 3, trainingWord.length);
w();
w(`A MISSING VALUE IS REFUSED BY NAME at the first row and column it meets, counting from 0: row ${NULL_ROW}, column 1 (RHOB) above. Nothing is filled.`);


/* ============================================================ SECTION 4 */

section('distance', 'Rows, features and a distance between two rows', ['Associate m01 l04', 'Associate m02 l01']);
const firstOf = Object.fromEntries(FACIES_SORTED.map((f) => [f, YC.indexOf(f)]));
const iSand = firstOf.sandstone; const iSs = firstOf['shaly-sand']; const iLime = firstOf.limestone; const iSh = firstOf.shale;
w(`A row is one depth sample; its features are its logs. Every method in this course compares rows by the Euclidean distance between them: the square root of the sum, over the logs, of the squared difference. Four rows of the cored wells, the first of each facies (row numbers count the ${CORED_ROWS.length} cored rows from 0):`);
w();
table(['row', 'well', 'depth (ft)', 'core facies', 'GR', 'RHOB', 'NPHI', 'PEF'], [iSand, iSs, iLime, iSh].map((i) => [S(i), CORED_ROWS[i].well, S(CORED_ROWS[i].depth), YC[i], ...XC[i].map(f6)]));
w();
const rawD = (a, b) => Math.sqrt(sum(XC[a].map((v, j) => (v - XC[b][j]) ** 2)));
const knnRaw = success('knnClassify, raw logs, every cored row a neighbour', CL.knnClassify({ X: XC, y: YC, Xnew: [XC[iSand]], k: CORED_ROWS.length, scale: 'none' }));
const knnStd = success('knnClassify, standardised logs, every cored row a neighbour', CL.knnClassify({ X: XC, y: YC, Xnew: [XC[iSand]], k: CORED_ROWS.length }));
const dOf = (res, j) => res.distances[0][res.neighbours[0].indexOf(j)];
const shareGR = (a, b) => ((XC[a][0] - XC[b][0]) ** 2) / sum(XC[a].map((v, j) => (v - XC[b][j]) ** 2));
w(`THE RAW DISTANCE from row ${iSand} (sandstone) to the other three, as the engine measures it (knnClassify with scale 'none', every cored row a neighbour), and the share of the squared distance that GR alone contributes (derived, (GR difference)^2 / (sum of squared differences)):`);
w();
table(['to row', 'core facies', 'raw distance', 'share from GR, derived'], [iSs, iLime, iSh].map((j) => [S(j), YC[j], f6(dOf(knnRaw, j)), f6(shareGR(iSand, j))]));
[iSs, iLime, iSh].forEach((j) => must(`the engine's raw distance to row ${j} is the hand distance`, Math.abs(dOf(knnRaw, j) - rawD(iSand, j)) < 1e-9, `${dOf(knnRaw, j)} ${rawD(iSand, j)}`));
const minShare = Math.min(...[iSs, iLime, iSh].map((j) => shareGR(iSand, j)));
must('GR carries the least share printed above, and it is above 0.97', minShare > 0.97, minShare);
w();
w(`GR is in gAPI and differs by tens of units between facies; RHOB and NPHI differ by hundredths and PEF by units. On the three pairs above GR contributes at least ${f6(minShare)} of the squared distance, so a raw distance is mostly a gamma ray distance: the density, neutron and photoelectric logs barely move it.`);
w();
const zOf = (i) => knnStd.scaler.centre.map((c, j) => (XC[i][j] - c) / knnStd.scaler.scale[j]);
w(`THE SCALED DISTANCE. Each log standardised with the centre and population standard deviation fitted on the ${CORED_ROWS.length} cored rows (${ref('scaling')}), the same four rows read in standard units (derived, (x - centre) / scale, with the scaler the engine returned):`);
w();
table(['row', 'core facies', 'GR', 'RHOB', 'NPHI', 'PEF'], [iSand, iSs, iLime, iSh].map((i) => [S(i), YC[i], ...zOf(i).map(f6)]));
w();
const shareZ = (a, b) => { const za = zOf(a); const zb = zOf(b); return (za[0] - zb[0]) ** 2 / sum(za.map((v, j) => (v - zb[j]) ** 2)); };
table(['from row ' + S(iSand) + ' to row', 'core facies', 'scaled distance', 'share from GR, derived'], [iSs, iLime, iSh].map((j) => [S(j), YC[j], f6(dOf(knnStd, j)), f6(shareZ(iSand, j))]));
// Every cored row's nearest OTHER cored row, raw and scaled: knnClassify with
// k 2 on the cored rows themselves (the first neighbour of a row is the row).
const nn2 = (scale) => success(`knnClassify k 2 on the cored rows, scale ${scale}`, CL.knnClassify({ X: XC, y: YC, Xnew: XC, k: 2, scale }));
const nnOther = (res) => res.neighbours.map((nb, i) => (nb[0] === i ? nb[1] : nb[0]));
const NNr = nnOther(nn2('none'));
const NNs = nnOther(nn2('standard'));
must('every cored row is its own first neighbour, raw and scaled', nn2('none').neighbours.every((nb, i) => nb[0] === i) && nn2('standard').neighbours.every((nb, i) => nb[0] === i), 'self first');
const sameR = NNr.filter((j, i) => YC[j] === YC[i]).length;
const sameS = NNs.filter((j, i) => YC[j] === YC[i]).length;
must('scaling raises the rows whose nearest other row shares their core facies', sameS > sameR, `${sameR} ${sameS}`);
w();
w(`THE NEAREST OTHER ROW. For every one of the ${CORED_ROWS.length} cored rows, the engine's nearest other cored row (knnClassify, k 2, the cored rows as both training and new rows, so each row's first neighbour is itself):`);
w();
table(['distance on', 'rows whose nearest other row has the same core facies', 'rows whose nearest other row has another facies'], [
  ['raw logs', S(sameR), S(CORED_ROWS.length - sameR)],
  ['standardised logs', S(sameS), S(CORED_ROWS.length - sameS)],
]);
w();
w(`Scaling moves ${CORED_ROWS.length - sameR - (CORED_ROWS.length - sameS)} more rows next to a row of their own facies (derived, the difference of the two counts). Scaling decides which rows are near, and so which rows cluster together.`);

/* ============================================================ SECTION 5 */

section('scaling', 'Standard and min-max scaling of the logs', ['Associate m02']);
const SC = success('fitStandardScaler on the cored rows', ML.fitStandardScaler({ X: XC, names: LOGS }));
const SCs = success('fitStandardScaler on the cored rows, sample SD', ML.fitStandardScaler({ X: XC, names: LOGS, sd: 'sample' }));
const MM = success('fitMinMaxScaler on the cored rows', ML.fitMinMaxScaler({ X: XC, names: LOGS }));
must('the k-means scaler is the fitStandardScaler of the rows clustered', KM.scaler.centre.every((c, j) => c === SC.centre[j]) && KM.scaler.scale.every((s, j) => s === SC.scale[j]), 'identical');
w(`k-means, the silhouette, agglomerative clustering and kNN scale the logs before any distance is taken; the default \`scale\` is 'standard'. The scalers are the machine learning engine's own (fitStandardScaler and fitMinMaxScaler), fitted on the rows clustered. On the ${CORED_ROWS.length} cored rows:`);
w();
table(['log', 'centre (mean)', 'scale, population SD (n)', 'sample SD (n - 1), for comparison', 'min', 'max', 'range (min-max scale)'], LOGS.map((f, j) => [f, f6(SC.centre[j]), f6(SC.scale[j]), f6(SCs.scale[j]), f6(MM.min[j]), f6(MM.max[j]), f6(MM.scale[j])]));
const ratio = SCs.scale[0] / SC.scale[0];
must('the sample to population ratio is the same for every log', LOGS.every((_, j) => Math.abs(SCs.scale[j] / SC.scale[j] - ratio) < 1e-12), ratio);
w();
w(`The standard scale is the POPULATION standard deviation, divisor n = ${CORED_ROWS.length}; the basis reads: "${KM.basis.scaling}". The sample standard deviation is larger by the factor ${f6(ratio)} on every log (derived, sqrt(${CORED_ROWS.length} / ${CORED_ROWS.length - 1})). A standard-scaled log has mean 0 and population SD 1 on the rows it was fitted on.`);
w();
const mmRow = MM.min.map((m, j) => (XC[iSand][j] - m) / MM.scale[j]);
w(`MIN-MAX SCALING maps each log's minimum to 0 and its maximum to 1 on the fitted rows: (x - min) / (max - min). Row ${iSand} (sandstone) reads ${LOGS.map((f, j) => `${f} ${f6(mmRow[j])}`).join(', ')} (derived with the fitted min and range). Its basis reads: "${CL.kmeans({ X: XC, k: K4, seed: SEED, scale: 'minmax' }).basis.scaling}".`);
w();
const mm7 = success(`applyScaler, min-max on ${UN1}`, ML.applyScaler({ scaler: MM, X: X7 }));
const colMax = (A, j) => Math.max(...A.map((r) => r[j]));
const colMin = (A, j) => Math.min(...A.map((r) => r[j]));
w(`A row outside the fitted range maps outside [0, 1]; nothing is clipped. ${UN1}'s ${R7.length} rows under the cored-row min-max scaler run:`);
w();
table(['log', `lowest scaled ${UN1} value`, `highest scaled ${UN1} value`], LOGS.map((f, j) => [f, f6(colMin(mm7.X, j)), f6(colMax(mm7.X, j))]));
w();
w(`A LOG THAT NEVER CHANGES cannot be scaled: its standard deviation and its range are 0. The scaler refuses it by name, in the engine's words (${ref('refusals')}), and the call returns no clusters.`);

/* ============================================================ SECTION 6 */

section('pca', 'Principal components: the correlation matrix and its eigenvalues', ['Associate m03 l01', 'Associate m03 l02']);
const PC = success('pca, correlation, the cored rows', CL.pca({ X: XC, names: LOGS }));
w(`\`pca\` finds the directions along which the rows spread most. By default it works on the CORRELATION matrix: each log is centred and divided by its SAMPLE standard deviation (n - 1), so every log counts equally whatever its unit. The basis reads: "${PC.basis.matrix}".`);
w();
w(`The correlation matrix of the four logs on the ${PC.n} cored rows (the engine's \`covarianceMatrix\` of the standardised logs):`);
w();
table(['', ...LOGS], LOGS.map((f, a) => [f, ...PC.covarianceMatrix[a].map(f6)]));
must('the diagonal of the correlation matrix is 1 to 1e-12', PC.covarianceMatrix.every((r, a) => Math.abs(r[a] - 1) < 1e-12), 'diag');
w();
w(`Its eigenvalues, largest first, are the variances of the component scores; their ratios to the total are the explained variance ratios:`);
w();
table(['component', 'eigenvalue', 'explained variance ratio', 'cumulative ratio'], PC.eigenvalues.map((v, k) => [`PC${k + 1}`, f6(v), f6(PC.explainedVarianceRatio[k]), f6(PC.cumulativeRatio[k])]));
must('the eigenvalues of a correlation matrix sum to the number of logs', Math.abs(PC.totalVariance - LOGS.length) < 1e-12, PC.totalVariance);
must('the eigenvalues are sorted descending', PC.eigenvalues.every((v, k) => k === 0 || v <= PC.eigenvalues[k - 1]), 'sorted');
w();
w(`The eigenvalues sum to ${f6(PC.totalVariance)}, the number of logs, because each standardised log has variance 1. The first two components carry ${f6(PC.cumulativeRatio[1])} of the variance of the four logs, and the last two ${f6(1 - PC.cumulativeRatio[1])} (derived, 1 less the cumulative ratio). Jacobi rotations took ${PC.jacobiSweeps} sweeps and converged (\`converged\` ${S(PC.converged)}); the basis reads: "${PC.basis.eigen}".`);
must('the Jacobi sweeps converged', PC.converged === true, PC.converged);
must('no repeated eigenvalues are flagged on the cored rows', PC.repeatedEigenvalues.length === 0 && !PC.warning, PC.warning);
w();
w(`The ratio is taken over all four components even when fewer are kept: \`nComponents\` 2 returns the same first two ratios.`);
const PC2 = success('pca, nComponents 2', CL.pca({ X: XC, names: LOGS, nComponents: 2 }));
must('nComponents 2 keeps the same first two ratios', PC2.explainedVarianceRatio.every((r, k) => r === PC.explainedVarianceRatio[k]) && PC2.explainedVarianceRatio.length === 2, 'same');

/* ============================================================ SECTION 7 */

section('loadings', 'Loadings, components and scores', ['Associate m03 l03', 'Associate m03 l04', 'Expert m05 l03']);
w(`A component is a unit vector: one weight per log, squares summing to 1. A LOADING is that weight times the square root of the eigenvalue, which in the correlation form is the correlation between the log and the component score. The basis reads: "${PC.basis.loadings}".`);
w();
table(['log', ...PC.components.map((_, k) => `PC${k + 1} weight`), ...PC.loadings.slice(0, 2).map((_, k) => `PC${k + 1} loading`)], LOGS.map((f, j) => [f, ...PC.components.map((c) => f6(c[j])), ...PC.loadings.slice(0, 2).map((l) => f6(l[j]))]));
PC.components.forEach((c, k) => must(`component ${k + 1} is a unit vector`, Math.abs(sum(c.map((v) => v * v)) - 1) < 1e-12, sum(c.map((v) => v * v))));
const l1 = PC.loadings[0]; const l2 = PC.loadings[1];
const pc1Pos = LOGS.filter((_, j) => l1[j] > 0); const pc1Neg = LOGS.filter((_, j) => l1[j] < 0);
const pc2Pos = LOGS.filter((_, j) => l2[j] > 0);
must('PC1 loads GR and NPHI positive and RHOB and PEF negative', pc1Pos.join() === 'GR,NPHI' && pc1Neg.join() === 'RHOB,PEF', `${pc1Pos} ${pc1Neg}`);
must('PC2 loads all four logs positive', pc2Pos.length === 4, pc2Pos.join());
w();
w(`READING PC1. GR and NPHI load positive (${f6(l1[0])} and ${f6(l1[2])}) and RHOB and PEF negative (${f6(l1[1])} and ${f6(l1[3])}): a row high on PC1 reads high gamma ray and neutron with low density and photoelectric factor, and a row low on PC1 reads the reverse. READING PC2. All four logs load positive (${list(l2.map(f6))}). A component is a direction in the logs; the rock types it separates are read by matching against core (the Professional tier), never assumed from the signs.`);
w();
w(`THE SIGN IS A CONVENTION. Multiplying a component by -1 describes the same direction. The engine fixes it so the largest absolute weight in each component is positive; the basis reads: "${PC.basis.sign}".`);
w();
w(`SCORES. A row's score on a component is its standardised logs times the component's weights; the basis reads: "${PC.basis.scores}". The first three cored rows:`);
w();
table(['row', 'core facies', 'PC1 score', 'PC2 score', 'PC3 score', 'PC4 score'], [0, 1, 2].map((i) => [S(i), YC[i], ...PC.scores[i].map(f6)]));
const sv = PC.scores[0].map((_, k) => { const col = PC.scores.map((r) => r[k]); const m = mean(col); return sum(col.map((v) => (v - m) ** 2)) / (col.length - 1); });
must('the sample variance of each score column equals its eigenvalue to 1e-9', sv.every((v, k) => Math.abs(v - PC.eigenvalues[k]) < CHECK_TOL), sv.join(','));
w();
w(`The sample variance of each score column is its eigenvalue (derived and checked to ${eX(CHECK_TOL)} on all four columns): PC1 scores vary with variance ${f6(sv[0])}.`);
w();
const PT = success(`pcaTransform, ${UN1}`, CL.pcaTransform({ model: PC2, X: X7 }));
w(`A NEW WELL PROJECTED. \`pcaTransform\` scores new rows with the centre, scale and components fitted on the cored rows, never refitted; the basis reads: "${PT.basis.rule}". The first three rows of ${UN1}, on the two-component model:`);
w();
table(['row of ' + UN1, 'depth (ft)', 'PC1 score', 'PC2 score'], [0, 1, 2].map((i) => [S(i), S(R7[i].depth), ...PT.scores[i].map(f6)]));
const PT4 = success(`pcaTransform, ${UN1}, four components`, CL.pcaTransform({ model: PC, X: X7 }));
must('the two-component scores are the first two of the four-component scores', PT.scores.every((r, i) => r[0] === PT4.scores[i][0] && r[1] === PT4.scores[i][1]), 'same');

/* ============================================================ SECTION 8 */

section('kmeans', 'k-means: k-means++ seeding and Lloyd passes', ['Associate m04 l01', 'Associate m04 l02', 'Associate m04 l03', 'Associate m04 l04']);
const K1 = success(`kmeans k ${K4}, seed ${SEED}, one start`, CL.kmeans({ X: XC, k: K4, seed: SEED, nInit: 1, names: LOGS }));
w(`k-means splits the rows into k clusters, each with a CENTRE, and puts every row in the cluster whose centre is nearest. It runs on the standardised logs of ${ref('scaling')}. One start, k ${K4}, seed ${SEED} (stated), on the ${K1.n} cored rows.`);
w();
const u0 = ST.mulberry32(SEED)();
w(`K-MEANS++ SEEDING. The first centre is row floor(u x n) for the first draw u of mulberry32(seed); each later centre is drawn with probability proportional to the squared distance D^2 from the nearest centre already chosen. The basis reads: "${K1.basis.init}". For seed ${SEED} the first draw is u = ${f6(u0)} (lib/stats mulberry32), so the first centre is row ${Math.floor(u0 * K1.n)} (derived, floor(${f6(u0)} x ${K1.n})). The four starting rows, in the order drawn: ${list(K1.initialRows)}.`);
must('the first starting row is floor(u n)', K1.initialRows[0] === Math.floor(u0 * K1.n), `${K1.initialRows[0]} ${u0}`);
must('the starting rows are four distinct rows', new Set(K1.initialRows).size === K4, K1.initialRows.join(','));
w();
table(['starting row', 'core facies', 'GR', 'RHOB', 'NPHI', 'PEF'], K1.initialRows.map((i) => [S(i), YC[i], ...XC[i].map(f6)]));
w();
w(`LLOYD PASSES. Each pass assigns every row to its nearest centre, then moves each centre to the mean of its rows. The run stops when a pass returns the same labels as the pass before; \`iterations\` counts assignment passes, the confirming pass included. The basis reads: "${K1.basis.convergence}".`);
w();
table(['pass', 'inertia after the assignment', 'rows that changed cluster'], K1.trace.map((t) => [S(t.pass), f6(t.inertia), S(t.changed)]));
must('the trace ends on a pass with no change', K1.trace[K1.trace.length - 1].changed === 0 && K1.converged, K1.trace.length);
must('the first pass counts every row as changed', K1.trace[0].changed === K1.n, K1.trace[0].changed);
must('inertia never rises from pass to pass', K1.trace.every((t, i) => i === 0 || t.inertia <= K1.trace[i - 1].inertia), 'monotone');
w();
w(`The run took ${K1.iterations} passes; the first pass counts all ${K1.n} rows as changed. INERTIA is the sum over the rows of the squared distance to their own centre, in standard units: ${f6(K1.inertia)} at the end. The basis reads: "${K1.basis.inertia}". Inertia never rose from one pass to the next here.`);
w();
w(`THE ASSIGNMENT TIE RULE. A row equally near two centres goes to the lower centre number; "equally" means squared distances within 1e-12 of each other, relative. The basis reads: "${K1.basis.assignment}".`);
w();
table(['cluster', 'rows', ...LOGS.map((f) => `${f} centre, standard units`)], K1.centres.map((c, k) => [S(k), S(K1.sizes[k]), ...c.map(f6)]));
must('the sizes sum to the rows', sum(K1.sizes) === K1.n, sum(K1.sizes));

/* ============================================================ SECTION 9 */

section('starts', 'Several starts and the lowest inertia', ['Associate m04 l05', 'Professional m01 l05']);
w(`One start can stop in a poor arrangement. \`nInit\` starts (default ${CL.DEFAULTS.KMEANS_N_INIT}) draw their starting rows in turn from ONE mulberry32(seed) stream, each runs Lloyd passes to convergence, and the lowest inertia wins. The basis reads: "${KM.basis.best}". k ${K4}, seed ${SEED}, the default ${CL.DEFAULTS.KMEANS_N_INIT} starts:`);
w();
table(['start', 'starting rows', 'passes', 'inertia'], KM.runs.map((r) => [S(r.run), list(r.initialRows), S(r.iterations), f6(r.inertia)]));
const minRun = Math.min(...KM.runs.map((r) => r.inertia));
must('the best run is the first run with the lowest inertia', KM.runs[KM.bestRun].inertia === minRun && KM.runs.findIndex((r) => r.inertia <= minRun * (1 + CL.DEFAULTS.TIE_REL)) === KM.bestRun, KM.bestRun);
must('start 0 of the ten is the one-start run', KM.runs[0].inertia === K1.inertia && KM.runs[0].initialRows.join() === K1.initialRows.join(), 'same');
const distinctInertia = [...new Set(KM.runs.map((r) => f6(r.inertia)))];
w();
const sameAsBest = KM.runs.filter((r) => f6(r.inertia) === f6(KM.inertia));
const bandGap = Math.max(...sameAsBest.map((r) => Math.abs(r.inertia - KM.inertia)));
must('the runs printing the best inertia sit within the tie band of it', sameAsBest.every((r) => Math.abs(r.inertia - KM.inertia) <= KM.inertia * CL.DEFAULTS.TIE_REL), bandGap);
w(`Start ${KM.bestRun} wins with inertia ${f6(KM.inertia)}. The ${KM.runs.length} starts print ${distinctInertia.length} distinct inertias at six decimals: ${list(distinctInertia)}. ${sameAsBest.length} starts print the winning figure; the largest difference between any of them and the winner is ${eX(bandGap)}, inside the tie band of ${eX(CL.DEFAULTS.TIE_REL)} relative, so the earliest of them, start ${KM.bestRun}, keeps the win. Start 0 is the one-start run of ${ref('kmeans')}.`);
w();
const seedsOne = Array.from({ length: 10 }, (_, i) => i + 1);
const one = seedsOne.map((s) => ({ s, r: success(`kmeans one start seed ${s}`, CL.kmeans({ X: XC, k: K4, seed: s, nInit: 1 })) }));
const ten = seedsOne.map((s) => ({ s, r: success(`kmeans ten starts seed ${s}`, CL.kmeans({ X: XC, k: K4, seed: s })) }));
w(`ONE START AGAINST TEN, seed by seed (seeds stated):`);
w();
table(['seed', 'inertia, one start', 'inertia, ten starts'], seedsOne.map((s, i) => [S(s), f6(one[i].r.inertia), f6(ten[i].r.inertia)]));
const tenMin = Math.min(...ten.map((t) => t.r.inertia));
const tenAtMin = ten.filter((t) => t.r.inertia <= tenMin * (1 + CL.DEFAULTS.TIE_REL));
const tenOff = ten.filter((t) => t.r.inertia > tenMin * (1 + CL.DEFAULTS.TIE_REL));
const oneWorse = one.filter((o) => o.r.inertia > tenMin * (1 + CL.DEFAULTS.TIE_REL)).length;
const oneWorst = one.reduce((b, o) => (o.r.inertia > b.r.inertia ? o : b));
const oneWorstSeeds = one.filter((o) => f6(o.r.inertia) === f6(oneWorst.r.inertia)).map((o) => o.s);
must('ten starts reach the lowest inertia on most seeds shown and miss it on at least one', tenAtMin.length > seedsOne.length / 2 && tenOff.length >= 1, `${tenAtMin.length} ${tenOff.length}`);
must('one start is worse than the lowest on more seeds than ten starts are', oneWorse > tenOff.length, `${oneWorse} ${tenOff.length}`);
w();
w(`The lowest inertia in the table is ${f6(tenMin)}. With ten starts, ${tenAtMin.length} of the ${seedsOne.length} seeds reach it and ${tenOff.length === 1 ? 'one stops' : `${tenOff.length} stop`} above it (${tenOff.map((t) => `seed ${t.s} at ${f6(t.r.inertia)}`).join(', ')}); with one start, ${oneWorse} of the ${seedsOne.length} seeds stop above it, the highest printed figure being ${f6(oneWorst.r.inertia)} (seed ${oneWorstSeeds.join(' and seed ')}), with clusters of ${list(oneWorst.r.sizes)} rows at seed ${oneWorst.s}. More starts make a poor stop less likely and do not rule it out; a result is quoted with its seed and its number of starts. A lower inertia is a better fit of the same k; it says nothing yet about rock types.`);

/* ============================================================ SECTION 10 */

section('reading', 'Reading the clusters: centres in log units, numbers as names, new rows', ['Associate m05 l01', 'Associate m05 l02', 'Associate m05 l03']);
w(`The teaching clustering, used from here on: k ${K4}, seed ${SEED}, ${CL.DEFAULTS.KMEANS_N_INIT} starts, standard scaling, the ${KM.n} cored rows; inertia ${f6(KM.inertia)}, ${KM.iterations} passes in the winning start. \`centresOriginal\` puts each centre back in log units (derived by the engine as centre x scale + mean):`);
w();
table(['cluster', 'rows', ...LOGS.map((f, j) => `${f} (${T.CHANNELS[j][1]})`)], KM.centresOriginal.map((c, k) => [S(k), S(KM.sizes[k]), ...c.map(f6)]));
KM.centresOriginal.forEach((c, k) => must(`centre ${k} in log units is the member mean`, c.every((v, j) => Math.abs(v - mean(XC.filter((_, i) => KM.labels[i] === k).map((r) => r[j]))) < 1e-9), k));
w();
w(`Each centre in log units is the mean of its member rows (checked to ${eX(CHECK_TOL)}). A cluster is described by its centre: high GR, high NPHI and low PEF, or low GR, low NPHI and high PEF, and so on. A name such as shale belongs to a cluster only after it is compared with core.`);
w();
const KS1 = ten[0].r;
const cross = KM.labels.reduce((m, a, i) => { const key = `${a}->${KS1.labels[i]}`; m.set(key, (m.get(key) || 0) + 1); return m; }, new Map());
must('seed 1 and the teaching seed reach the same inertia to the tie band', Math.abs(KS1.inertia - KM.inertia) <= KM.inertia * CL.DEFAULTS.TIE_REL, `${KS1.inertia} ${KM.inertia}`);
must('seed 1 and seed 3 find the same partition with different numbers', cross.size === K4 && [...cross.keys()].some((k) => k.split('->')[0] !== k.split('->')[1]), [...cross.entries()].join(' '));
w(`CLUSTER NUMBERS ARE NAMES. The same partition can come back numbered differently. With ten starts, seed 1 reaches the same inertia as seed ${SEED}; each row's cluster under seed ${SEED} and under seed 1 (derived, counted from the two label lists):`);
w();
table([`cluster, seed ${SEED}`, 'cluster, seed 1', 'rows'], [...cross.entries()].sort().map(([k, v]) => [...k.split('->'), S(v)]));
w();
w(`Every cluster of one run is exactly one cluster of the other, so the grouping is the same and only the numbers differ. Cluster 0 carries no meaning of its own; numbers are assigned by where the starting rows fell.`);
w();
const AS = success(`assignClusters, ${UN1}`, CL.assignClusters({ model: KM, X: X7 }));
const asCount = count(AS.labels);
w(`NEW ROWS. \`assignClusters\` scales new rows with the scaler fitted on the clustered rows and puts each at its nearest centre; nothing is refitted. The basis reads: "${AS.basis.rule}". ${UN1}, uncored, ${R7.length} rows:`);
w();
table(['cluster', `${UN1} rows assigned`], [...asCount.entries()].sort((a, b) => a[0] - b[0]).map(([k, v]) => [S(k), S(v)]));
w();
w(`Its first row (depth ${S(R7[0].depth)} ft) goes to cluster ${AS.labels[0]} at a distance of ${f6(AS.distances[0])} standard units from that centre. The largest distance of any ${UN1} row to its centre is ${f6(Math.max(...AS.distances))}; over the cored rows it is ${f6(Math.sqrt(Math.max(...CL.assignClusters({ model: KM, X: XC }).distances.map((d) => d * d))))}.`);
must('assigning the cored rows reproduces the fitted labels', CL.assignClusters({ model: KM, X: XC }).labels.every((l, i) => l === KM.labels[i]), 'same');
w();
w('Assigning the cored rows themselves returns exactly the fitted labels.');

/* ============================================================ SECTION 11 */

section('covariance', 'Covariance against correlation, and clustering the raw logs', ['Associate m05 l04', 'Associate m02 l01']);
const PV = success('pca, covariance, the cored rows', CL.pca({ X: XC, names: LOGS, matrix: 'covariance' }));
w(`\`matrix: 'covariance'\` centres each log and keeps its unit, divisor n - 1. The basis reads: "${PV.basis.matrix}". On the ${PV.n} cored rows:`);
w();
table(['component', 'eigenvalue (in squared log units)', 'explained variance ratio', 'GR weight', 'RHOB weight', 'NPHI weight', 'PEF weight'], PV.eigenvalues.map((v, k) => [`PC${k + 1}`, f6(v), f6(PV.explainedVarianceRatio[k]), ...PV.components[k].map(f6)]));
const grIsLead = PV.components[0].every((v, j) => j === 0 || Math.abs(v) < Math.abs(PV.components[0][0]));
planted(1, PV.explainedVarianceRatio[0] > 0.99 && grIsLead, `${PV.explainedVarianceRatio[0]} ${PV.components[0]}`);
w();
w(`The first covariance component is almost GR alone (weight ${f6(PV.components[0][0])}) and carries ${f6(PV.explainedVarianceRatio[0])} of the variance, because GR's variance in gAPI squared dwarfs the others': the covariance matrix's first diagonal entry is ${f6(PV.covarianceMatrix[0][0])} against ${list(PV.covarianceMatrix.slice(1).map((r, a) => f6(r[a + 1])))} for RHOB, NPHI and PEF. On the correlation matrix (${ref('pca')}) the first component carries ${f6(PC.explainedVarianceRatio[0])} and draws on all four logs. The engine's default is the correlation matrix.`);
w();
const KR = success('kmeans k 4, raw logs', CL.kmeans({ X: XC, k: K4, seed: SEED, scale: 'none', names: LOGS }));
const KMM = success('kmeans k 4, min-max', CL.kmeans({ X: XC, k: K4, seed: SEED, scale: 'minmax', names: LOGS }));
w(`THE SAME CHOICE IN K-MEANS. k ${K4}, seed ${SEED}, ten starts, three scalings. Sizes are the rows in each cluster; the centres are in log units:`);
w();
const centreRows = (res, lab) => res.centresOriginal.map((c, k) => [lab, S(k), S(res.sizes[k]), ...c.map(f6)]);
table(['scaling', 'cluster', 'rows', 'GR', 'RHOB', 'NPHI', 'PEF'], [...centreRows(KM, 'standard'), ...centreRows(KR, 'none'), ...centreRows(KMM, 'minmax')]);
const grSpanRaw = Math.max(...KR.centresOriginal.map((c) => c[0])) - Math.min(...KR.centresOriginal.map((c) => c[0]));
const pefSpanRaw = Math.max(...KR.centresOriginal.map((c) => c[3])) - Math.min(...KR.centresOriginal.map((c) => c[3]));
w();
w(`Raw, the four centres spread over ${f6(grSpanRaw)} gAPI of GR and ${f6(pefSpanRaw)} b/e of PEF (derived, largest centre less smallest), and their sizes are ${list(KR.sizes)} rows against the facies counts below. The inertias are in different units and cannot be compared across the three: standard ${f6(KM.inertia)}, raw ${f6(KR.inertia)}, min-max ${f6(KMM.inertia)}.`);
w();
w(`Facies on the cored rows, for comparison: ${FACIES_SORTED.map((f) => `${f} ${fc.get(f)}`).join(', ')}.`);

/* ============================================================ SECTION 12 */

section('iris', 'Fisher\'s iris: a published check on the engine', ['Associate m06 l02']);
const irisLines = IRIS_TEXT.trim().split('\n');
const irisHead = irisLines[0].split(',');
const IRIS = irisLines.slice(1).map((l) => l.split(',').map(Number));
const IX = IRIS.map((r) => r.slice(0, 4));
const ISP = IRIS.map((r) => irisHead[2 + r[4]]);
const IRIS_NAMES = ['sepal_length', 'sepal_width', 'petal_length', 'petal_width'];
must('the iris file carries 150 rows of four measurements and a species', IX.length === Number(irisHead[0]) && IX.every((r) => r.length === Number(irisHead[1])), IX.length);
w(`Fisher's iris data (Fisher, 1936, The use of multiple measurements in taxonomic problems, Annals of Eugenics, volume seven, pages 179-188): ${IX.length} flowers, four measurements in cm (${list(IRIS_NAMES)}), three species. The vendored copy is the file scikit-learn ships, test-data/dataai/iris/iris.csv. It has nothing to do with rock; it is here because a published figure for it exists, so the engine's arithmetic can be checked against a source outside this programme.`);
w();
const PI = success('pca, covariance, iris', CL.pca({ X: IX, names: IRIS_NAMES, matrix: 'covariance' }));
const pubCase = golden('pca-iris-covariance');
const pub = pubCase.published.map((p) => p.value);
const r8 = (x) => Number(x.toFixed(8));
must('the engine rounds to the published iris ratios at eight decimals', r8(PI.explainedVarianceRatio[0]) === pub[0] && r8(PI.explainedVarianceRatio[1]) === pub[1], `${PI.explainedVarianceRatio.slice(0, 2)} ${pub}`);
w(`THE PUBLISHED FIGURE. The scikit-learn example "Comparison of LDA and PCA 2D projection of Iris dataset" prints the explained variance ratio of the first two covariance components as [${pub.map((v) => v.toFixed(8)).join(' ')}] (golden, recorded with its source). The engine, covariance matrix, all ${IX.length} flowers:`);
w();
table(['component', 'eigenvalue', 'explained variance ratio', 'to eight decimals, as published'], PI.eigenvalues.map((v, k) => [`PC${k + 1}`, f6(v), f6(PI.explainedVarianceRatio[k]), k < 2 ? PI.explainedVarianceRatio[k].toFixed(8) : 'not published']));
w();
w(`The engine agrees with the published figure at all eight printed decimals, on both components.`);
w();
const PIc = success('pca, correlation, iris', CL.pca({ X: IX, names: IRIS_NAMES }));
w(`On the correlation matrix the same flowers give eigenvalues ${list(PIc.eigenvalues.map(f6))} and a first ratio of ${f6(PIc.explainedVarianceRatio[0])}: the choice of matrix moves the figure, and the published one is the covariance form.`);
w();
const IRIS_K = 3; // three species, stated
const IK = success('kmeans k 3, iris, raw, seed 3', CL.kmeans({ X: IX, k: IRIS_K, seed: SEED, scale: 'none' }));
const perSpecies = [...count(ISP).values()];
const ikCase = golden('kmeans-iris-k3-none-seed3');
must('the iris k-means inertia is the golden inertia to 1e-10 relative', Math.abs(IK.inertia - ikCase.expected.inertia) <= 1e-10 * ikCase.expected.inertia, `${IK.inertia} ${ikCase.expected.inertia}`);
w(`K-MEANS ON IRIS, raw measurements (all four in cm, so no scaling is needed), k ${IRIS_K} (one per species), seed ${SEED}, ten starts: inertia ${f6(IK.inertia)} in squared cm, clusters of ${list(IK.sizes)} flowers. The oracle's golden for the same call reads ${f6(ikCase.expected.inertia)}. The species hold ${perSpecies[0]} flowers each; the sizes alone show that the clusters and the species differ.`);
must('the species counts are equal', perSpecies.every((v) => v === perSpecies[0]), perSpecies);
must('the iris cluster sizes are not the species counts', IK.sizes.some((v) => v !== perSpecies[0]), IK.sizes);

/* ============================================================ SECTION 13 */

section('workflow', 'One field clustered end to end, and written up', ['Associate m06']);
w(`The Associate workflow, every step an engine call, on the Ekene cored wells:`);
w();
table(['step', 'call', 'what it returns here'], [
  [S(step()), `choose the logs: ${list(LOGS)}; leave out CALI, the hole size, which carries no rock signal`, `${LOGS.length} features on ${CORED_ROWS.length} rows`],
  [S(step()), '`pca` on the correlation matrix', `the first two components carry ${f6(PC.cumulativeRatio[1])} of the variance`],
  [S(step()), `\`kmeans\` k ${K4}, seed ${SEED}, ${CL.DEFAULTS.KMEANS_N_INIT} starts, standard scaling`, `inertia ${f6(KM.inertia)}; clusters of ${list(KM.sizes)} rows`],
  [S(step()), 'read `centresOriginal`', `cluster centres in gAPI, g/cm3, v/v and b/e (${ref('reading')})`],
  [S(step()), `\`assignClusters\` for ${UN1}`, `${R7.length} rows placed at the nearest of the ${K4} centres`],
]);
w();
w(`WRITING UP A CLUSTERING. Everything a reader needs to reproduce it and nothing it has not earned:`);
w();
table(['item', 'what is written'], [
  ['rows', `${CORED_ROWS.length} rows of the ${T.CORED.length} cored wells, ${list(T.CORED)}`],
  ['logs and scaling', `${list(LOGS)}, standard scaling (population SD) fitted on those rows`],
  ['method', `k-means, k ${K4}, k-means++ seeding, seed ${SEED}, ${CL.DEFAULTS.KMEANS_N_INIT} starts`],
  ['result', `inertia ${f6(KM.inertia)} in standard units; cluster sizes ${list(KM.sizes)}; centres in log units`],
  ['what is not claimed', 'no cluster is named as a facies until it is matched against core; k was stated, and the choice of k is judged in the Professional tier'],
]);

/* ============================================================ SECTION 14 */

section('elbow', 'The elbow: inertia against k', ['Professional m01']);
const EL = success(`elbow k 1 to ${KMAX}, seed ${SEED}, with the silhouette`, CL.elbow({ X: XC, kMin: 1, kMax: KMAX, seed: SEED, names: LOGS, withSilhouette: true }));
w(`\`elbow\` runs k-means for each k from kMin to kMax on the same rows and prints the inertia, how much it fell from the k before, and that fall as a fraction of the inertia before. The ${CORED_ROWS.length} cored rows, standard scaling, seed ${SEED}, ${CL.DEFAULTS.KMEANS_N_INIT} starts at every k:`);
w();
table(['k', 'inertia', 'drop from k - 1', 'drop fraction', 'passes (winning start)', 'mean silhouette'], EL.table.map((r) => [S(r.k), f6(r.inertia), r.drop === null ? 'none (first row)' : f6(r.drop), r.dropFraction === null ? 'none (first row)' : f6(r.dropFraction), S(r.iterations), r.silhouette === null ? 'none (k 1)' : f6(r.silhouette)]));
must('the elbow row at k 4 is the teaching k-means', EL.table[K4 - 1].inertia === KM.inertia, `${EL.table[K4 - 1].inertia} ${KM.inertia}`);
const firstRow = EL.table[0];
must('the k 1 inertia is the number of rows times the number of logs', Math.abs(firstRow.inertia - CORED_ROWS.length * LOGS.length) < 1e-9, firstRow.inertia);
const fr = EL.table.filter((r) => r.dropFraction !== null);
const bigFrac = fr.reduce((b, r) => (r.dropFraction > b.dropFraction ? r : b));
must('the inertia falls at every k here', EL.inertiaRises.length === 0 && !EL.warning, EL.inertiaRises.join(','));
w();
w(`At k 1 every row sits in one cluster about the mean, and in standard units the inertia is the number of rows times the number of logs, ${f6(firstRow.inertia)} (each standardised log contributes n). The basis reads: "${EL.basis.drop}". The largest drop fraction is at k ${bigFrac.k}, ${f6(bigFrac.dropFraction)}; at k ${K4} it is ${f6(EL.table[K4 - 1].dropFraction)} and at k ${K4 + 1} ${f6(EL.table[K4].dropFraction)}.`);
w();
w(`NO ELBOW IS PICKED FOR YOU. Inertia always falls as k grows when every k is fitted well, down to 0 at one cluster per distinct row, so the smallest inertia is never the answer. The engine prints the drops and picks nothing; the basis reads: "${EL.basis.pick}". The core describes ${FACIES_SORTED.length} facies. The drop fraction reads ${f6(EL.table[K4 - 2].dropFraction)} at k ${K4 - 1}, ${f6(EL.table[K4 - 1].dropFraction)} at k ${K4} and ${f6(EL.table[K4].dropFraction)} at k ${K4 + 1}, and no larger k shown reaches the k ${K4 + 1} figure again. Where the elbow sits is a reading of that table, and the reading is written down with the table.`);
must('no drop fraction beyond k 5 reaches the k 5 figure', EL.table.slice(K4 + 1).every((r) => r.dropFraction < EL.table[K4].dropFraction), 'below');
w();
const RISE_SEED = 265; const RISE_KMAX = KMAX;
const ER = success(`elbow one start, seed ${RISE_SEED}`, CL.elbow({ X: XC, kMin: 1, kMax: RISE_KMAX, seed: RISE_SEED, nInit: 1 }));
const ERten = success(`elbow ten starts, seed ${RISE_SEED}`, CL.elbow({ X: XC, kMin: 1, kMax: RISE_KMAX, seed: RISE_SEED }));
must('one start at the stated seed shows a rise', ER.inertiaRises.length > 0 && typeof ER.warning === 'string', ER.inertiaRises);
must('ten starts at the same seed show none', ERten.inertiaRises.length === 0, ERten.inertiaRises);
const rk = ER.inertiaRises[0];
w(`AN INERTIA THAT RISES. With one start per k, seed ${RISE_SEED} (stated), k 1 to ${RISE_KMAX}, the inertia at k ${rk} is ${f6(ER.table[rk - 1].inertia)} against ${f6(ER.table[rk - 2].inertia)} at k ${rk - 1}: a larger k fitted worse. The engine lists it in \`inertiaRises\` and warns, verbatim:`);
w();
w(`> ${ER.warning}`);
w();
w(`With the default ${CL.DEFAULTS.KMEANS_N_INIT} starts the same seed shows no rise (k ${rk}: ${f6(ERten.table[rk - 1].inertia)}).`);
w();
const single = success(`kmeans k 6 seed ${SEED}`, CL.kmeans({ X: XC, k: 6, seed: SEED }));
must('an elbow row equals the single kmeans call at that k and seed', EL.table[5].inertia === single.inertia, `${EL.table[5].inertia} ${single.inertia}`);
w(`ONE SEED STREAM FOR EACH K. Each k runs with its own fresh mulberry32(seed), so an elbow row is exactly the single \`kmeans\` call at that k and seed: at k ${single.k} both return ${f6(single.inertia)}. The basis reads: "${EL.basis.runs}".`);

/* ============================================================ SECTION 15 */

section('silhouette', 'The silhouette', ['Professional m02']);
const TOY = [[0], [1], [4], [6]]; const TOYL = [0, 0, 1, 1];
const ST0 = success('silhouette of four stated points', CL.silhouette({ X: TOY, labels: TOYL, scale: 'none' }));
const aT = Math.abs(TOY[1][0] - TOY[0][0]); const bT = (Math.abs(TOY[2][0] - TOY[0][0]) + Math.abs(TOY[3][0] - TOY[0][0])) / 2;
must('the engine gives the hand silhouette of row 0', Math.abs(ST0.values[0] - (bT - aT) / Math.max(aT, bT)) < 1e-12, ST0.values[0]);
w(`For each row, a is its mean distance to the other rows of its own cluster and b its smallest mean distance to the rows of another cluster; its silhouette is (b - a) / max(a, b), from -1 to 1. The basis reads: "${ST0.basis.formula}".`);
w();
w(`FOUR POINTS ON A LINE, stated: ${list(TOY.map((r) => S(r[0])))}, labelled ${list(TOYL.map(S))}, no scaling. For the first point a = ${f6(aT)} and b = ${f6(bT)} (derived, the mean of its distances ${S(Math.abs(TOY[2][0] - TOY[0][0]))} and ${S(Math.abs(TOY[3][0] - TOY[0][0]))}), so s = ${f6((bT - aT) / Math.max(aT, bT))} (derived); the engine returns ${list(ST0.values.map(f6))} for the four points and a mean of ${f6(ST0.mean)}.`);
w();
const SK = success('silhouette of the teaching k-means', CL.silhouette({ X: XC, labels: KM.labels, names: LOGS }));
const SF = success('silhouette of the core facies', CL.silhouette({ X: XC, labels: YC, names: LOGS }));
w(`THE TEACHING CLUSTERS, standard scaling (the same space k-means clustered in), and, for comparison, the core facies used as the labels:`);
w();
table(['labels', 'group', 'rows', 'mean silhouette'], [
  ...SK.perCluster.map((c) => ['k-means clusters', `cluster ${c.label}`, S(c.size), f6(c.mean)]), ['k-means clusters', 'all rows', S(SK.n), f6(SK.mean)],
  ...SF.perCluster.map((c) => ['core facies', c.label, S(c.size), f6(c.mean)]), ['core facies', 'all rows', S(SF.n), f6(SF.mean)],
]);
const lowK = SK.perCluster.reduce((b, c) => (c.mean < b.mean ? c : b));
const lowF = SF.perCluster.reduce((b, c) => (c.mean < b.mean ? c : b));
const negK = SK.values.filter((v) => v < 0).length;
w();
w(`The lowest cluster mean is cluster ${lowK.label}'s, ${f6(lowK.mean)}; among the core facies it is ${lowF.label}, ${f6(lowF.mean)}. ${negK} rows of the k-means clustering score below 0: each sits nearer, on average, to another cluster than to its own. The mean silhouette of the k-means clusters is ${f6(SK.mean)} and of the core facies ${f6(SF.mean)}: a silhouette scores how compact and apart the groups are, and says nothing of whether they are the rock types.`);
w();
const AVG4 = success('agglomerative average k 4', CL.agglomerative({ X: XC, linkage: 'average', k: K4, names: LOGS }));
const SA = success('silhouette of average linkage k 4', CL.silhouette({ X: XC, labels: AVG4.labels, names: LOGS }));
const single1 = SA.perCluster.find((c) => c.size === 1);
must('average linkage at k 4 leaves a cluster of one row', !!single1, SA.perCluster.map((c) => c.size).join(','));
const singleRow = AVG4.labels.indexOf(single1.label);
w(`A ROW ALONE IN ITS CLUSTER scores 0: it has no a. Average linkage cut at k ${K4} (${ref('agglomerative')}) leaves row ${singleRow} (${YC[singleRow]}, ${CORED_ROWS[singleRow].well} at ${S(CORED_ROWS[singleRow].depth)} ft) alone in cluster ${single1.label}; its silhouette is ${f6(SA.values[singleRow])}. The basis reads: "${SA.basis.singleton}". Cluster sizes: ${list(SA.perCluster.map((c) => S(c.size)))}; mean silhouette ${f6(SA.mean)}.`);
must('the singleton scores exactly 0', SA.values[singleRow] === 0, SA.values[singleRow]);
w();
const SS = success(`silhouette sample ${SAMPLE}, seed ${SEED}`, CL.silhouette({ X: XC, labels: KM.labels, names: LOGS, sampleSize: SAMPLE, seed: SEED }));
const SS2 = success(`silhouette sample ${SAMPLE}, seed ${SEED + 1}`, CL.silhouette({ X: XC, labels: KM.labels, names: LOGS, sampleSize: SAMPLE, seed: SEED + 1 }));
w(`A SEEDED SAMPLE. The silhouette compares every pair of rows, so above ${CL.DEFAULTS.SILHOUETTE_MAX_ROWS} rows it is refused unless a sample is asked for (${ref('refusals')}). A sample of ${SAMPLE} rows, seed ${SEED}, scores ${f6(SS.mean)}; seed ${SEED + 1} scores ${f6(SS2.mean)}; all ${SK.n} rows score ${f6(SK.mean)}. The basis reads: "${SS.basis.sample}". A sampled silhouette is quoted with its size and seed.`);
w();
const SKraw = success('silhouette of the teaching k-means on raw logs', CL.silhouette({ X: XC, labels: KM.labels, scale: 'none' }));
w(`The same labels scored on the raw logs (\`scale: 'none'\`) read ${f6(SKraw.mean)}: the silhouette is measured in a space, and it is quoted with its scaling. The engine's default scores the standardised logs, the space k-means clustered in.`);
w();
const SIL_BEST = EL.bestSilhouetteK;
w(`WHEN THE SILHOUETTE AND THE ELBOW DISAGREE. Over k 2 to ${KMAX} (${ref('elbow')}) the highest mean silhouette is at k ${SIL_BEST}, ${f6(EL.table[SIL_BEST - 1].silhouette)}; at k ${K4} it is ${f6(EL.table[K4 - 1].silhouette)}. The core describes ${FACIES_SORTED.length} facies. \`bestSilhouetteK\` is ${SIL_BEST}; the basis reads: "${EL.basis.pick}". Neither figure chooses k alone.`);
must('the best silhouette k differs from the four core facies', SIL_BEST !== FACIES_SORTED.length, SIL_BEST);

/* ============================================================ SECTION 16 */

section('agglomerative', 'Agglomerative clustering: Ward, complete and average linkage', ['Professional m03 l01', 'Professional m03 l02', 'Professional m02 l03']);
const LINKS = ['ward', 'complete', 'average'];
const AG = Object.fromEntries(LINKS.map((L) => [L, success(`agglomerative ${L} k 4`, CL.agglomerative({ X: XC, linkage: L, k: K4, names: LOGS }))]));
w(`Agglomerative clustering starts with every row as its own cluster and merges the two closest clusters, again and again, until one is left; the whole history is kept, and a cut at k clusters is read from it. What "closest" means is the LINKAGE. On the ${CORED_ROWS.length} cored rows, standard scaling:`);
w();
table(['linkage', 'the distance between two clusters, the engine\'s basis'], LINKS.map((L) => [L, AG[L].basis.linkage]));
w();
const sizesOf = (lab) => { const c = count(lab); return [...c.keys()].sort((a, b) => a - b).map((k) => c.get(k)); };
w(`Each tree cut at k ${K4}; cluster sizes in cluster order, and the merge heights either side of the cut (\`cutHeights\`):`);
w();
table(['linkage', 'cluster sizes', 'last merge made (below the cut)', 'next merge (above the cut)', 'tied steps'], LINKS.map((L) => [L, list(sizesOf(AG[L].labels).map(S)), f6(AG[L].cutHeights.below), f6(AG[L].cutHeights.above), S(AG[L].tiedSteps)]));
must('no linkage met a tied merge on the cored rows', LINKS.every((L) => AG[L].tiedSteps === 0), LINKS.map((L) => AG[L].tiedSteps).join(','));
const avgBig = Math.max(...sizesOf(AG.average.labels));
must('average linkage makes one cluster larger than any core facies', avgBig > Math.max(...fc.values()), avgBig);
w();
w(`Ward merges the pair whose union raises the within-cluster sum of squares least; complete linkage judges a pair by its two farthest rows; average by the mean of all cross pairs. Here average linkage puts ${avgBig} rows in one cluster, more than any core facies holds (largest ${Math.max(...fc.values())}), and leaves one row alone (${ref('silhouette')}). The heights are in standard units; Ward's are on a different scale from the other two (its basis: the square root of twice the rise in the sum of squares) and are never compared with them.`);
LINKS.forEach((L) => must(`${L} merge heights never fall`, AG[L].heights.every((h, i) => i === 0 || h >= AG[L].heights[i - 1] * (1 - 1e-12)), L));
w();
w(`On these rows the merge heights of all three linkages never fall from one merge to the next, so each tree can be drawn with every merge above its parts.`);

/* ============================================================ SECTION 17 */

section('linkage', 'The linkage matrix, the cut and a re-cut', ['Professional m03 l03', 'Professional m03 l04', 'Professional m03 l05']);
const WD = AG.ward;
const nC = WD.n;
w(`The history is a linkage matrix with one row per merge, n - 1 = ${nC - 1} rows for ${nC} rows. Each row is [smaller id, larger id, height, size]: rows of the data are ids 0 to ${nC - 1}, and the cluster made at merge s is id ${nC} + s. The basis reads: "${WD.basis.ids}". The first five and the last five merges of the Ward tree:`);
w();
const lmRow = (r, s) => [S(s), S(r[0]), S(r[1]), f6(r[2]), S(r[3]), `id ${nC + s}`];
const LM = WD.linkageMatrix;
table(['merge s', 'id 1', 'id 2', 'height', 'rows in the new cluster', 'the new cluster'], [...LM.slice(0, 5).map((r, s) => lmRow(r, s)), ...LM.slice(-5).map((r, s) => lmRow(r, LM.length - 5 + s))]);
must('the last merge holds every row', LM[LM.length - 1][3] === nC, LM[LM.length - 1][3]);
must('every row puts the smaller id first', LM.every((r) => r[0] < r[1]), 'ordered');
w();
w(`The first merge joins rows ${LM[0][0]} and ${LM[0][1]} (${YC[LM[0][0]]} and ${YC[LM[0][1]]}), the closest pair. The last merge joins the final two clusters, ${LM[LM.length - 1][3]} rows.`);
w();
w(`THE CUT. A cut at k keeps the first n - k merges; clusters are then numbered 0 to k - 1 in the order of their first row. The basis reads: "${WD.basis.cut}". At k ${K4} the Ward cut keeps ${nC - K4} merges; the last kept has height ${f6(WD.cutHeights.below)} and the first undone ${f6(WD.cutHeights.above)}, so any cutting height between the two gives the same ${K4} clusters.`);
must('the cut heights are the merges either side of the cut', WD.cutHeights.below === LM[nC - K4 - 1][2] && WD.cutHeights.above === LM[nC - K4][2], 'rows');
must('row 0 is in cluster 0 of every cut', WD.labels[0] === 0, WD.labels[0]);
w();
const RECUT = [2, 3, 4, 5, 6].map((k) => ({ k, c: success(`cutTree k ${k}`, CL.cutTree({ linkageMatrix: LM, k })) }));
RECUT.forEach(({ k, c }) => must(`cutTree at k ${k} equals agglomerative with k ${k}`, c.labels.join() === success(`agglomerative ward k ${k}`, CL.agglomerative({ X: XC, linkage: 'ward', k, names: LOGS })).labels.join(), k));
w(`RE-CUTTING WITHOUT RE-RUNNING. \`cutTree\` cuts a returned linkage matrix at any k, and gives exactly the labels \`agglomerative\` gives with that k (checked at k ${RECUT[0].k} to ${RECUT[RECUT.length - 1].k}):`);
w();
table(['k', 'cluster sizes, in cluster order', 'height of the merge undone first'], RECUT.map(({ k, c }) => [S(k), list(sizesOf(c.labels).map(S)), f6(LM[nC - k][2])]));
w();
const K3m = success('kmeans k 3 seed 3', CL.kmeans({ X: XC, k: 3, seed: SEED }));
const splitK = (fine, coarse) => { const m = new Map(); fine.forEach((l, r) => { if (!m.has(l)) m.set(l, new Set()); m.get(l).add(coarse[r]); }); return [...m.values()].filter((v) => v.size > 1).length; };
const kmSplit = splitK(KM.labels, K3m.labels);
must('the k-means clusters at k 4 do not nest in those at k 3', kmSplit > 0, kmSplit);
w(`A cluster of the k cut is always the union of clusters of the k + 1 cut: the tree nests (checked on every pair of cuts above). k-means has no such rule: at seed ${SEED}, ${kmSplit === 1 ? 'one' : kmSplit} of the ${K4} k-means clusters at k ${K4} ${kmSplit === 1 ? 'has' : 'have'} rows in more than one cluster at k ${K3m.k} (derived from the two label lists).`);
RECUT.forEach(({ k, c }, i) => { if (i + 1 < RECUT.length) { const f = RECUT[i + 1].c.labels; const m = new Map(); const ok = f.every((l, r) => { const had = m.get(l); if (had === undefined) { m.set(l, c.labels[r]); return true; } return had === c.labels[r]; }); must(`the k ${k + 1} cut nests in the k ${k} cut`, ok, k); } });

/* ============================================================ SECTION 18 */

section('matching', 'Matching clusters to core facies', ['Professional m04']);
const MC = success('matchClusters one-to-one, teaching k-means', CL.matchClusters({ yTrue: YC, clusters: KM.labels }));
w(`A cluster becomes an electrofacies with a rock name only when it is compared with core. The CONTINGENCY TABLE counts, for each cluster, the cored rows of each facies. The basis reads: "${MC.basis.contingency}". The teaching k-means (k ${K4}, seed ${SEED}):`);
w();
table(['cluster', ...MC.faciesLabels, 'rows'], MC.contingency.map((r, i) => [S(MC.clusterLabels[i]), ...r.map(S), S(sum(r))]));
w();
w(`ONE-TO-ONE MATCHING gives each cluster a different facies, choosing the assignment that matches the most rows (the Hungarian method). The basis reads: "${MC.basis.mode}".`);
w();
table(['cluster', 'matched facies', 'rows of that facies in the cluster', 'rows in the cluster'], MC.mapping.map((m) => [S(m.cluster), m.facies, S(m.rows), S(m.clusterSize)]));
w();
w(`${MC.matchedRows} of the ${CORED_ROWS.length} cored rows land on their own facies under this mapping. The mapped predictions are scored by the machine learning engine's classificationReport (the precision, recall and F1 of a label are taught in the machine learning course; here they are read, and never re-derived). The basis reads: "${MC.basis.report}".`);
must('matched rows over the rows is the report accuracy', Math.abs(MC.matchedRows / CORED_ROWS.length - MC.report.accuracy) < 1e-12, MC.report.accuracy);
w();
table(['facies', 'rows (support)', 'precision', 'recall', 'F1'], MC.report.perClass.map((c) => [c.label, S(c.support), f6(c.precision), f6(c.recall), f6(c.f1)]));
w();
w(`Accuracy ${f6(MC.report.accuracy)} (derived check: ${MC.matchedRows} / ${CORED_ROWS.length}); macro F1 ${f6(MC.report.macro.f1)}.`);
const ssRow = MC.contingency.map((r, i) => ({ cl: MC.clusterLabels[i], r })).find(({ r }) => r[MC.faciesLabels.indexOf('sandstone')] > 0 && r[MC.faciesLabels.indexOf('shaly-sand')] > 0);
const mixedRows = MC.contingency.filter((r) => r.filter((v) => v > 0).length > 1).length;
must('exactly one cluster holds rows of more than one facies, and it holds sandstone and shaly-sand', !!ssRow && mixedRows === 1, mixedRows);
w();
w(`One cluster, cluster ${ssRow.cl}, holds rows of two facies: ${ssRow.r[MC.faciesLabels.indexOf('sandstone')]} sandstone and ${ssRow.r[MC.faciesLabels.indexOf('shaly-sand')]} shaly-sand. Matched to sandstone, its shaly-sand rows are scored wrong; every other cluster holds one facies only.`);
w();
const K5 = success('kmeans k 5 seed 3', CL.kmeans({ X: XC, k: 5, seed: SEED, names: LOGS }));
const MJ5 = success('matchClusters majority, k 5', CL.matchClusters({ yTrue: YC, clusters: K5.labels, mode: 'majority' }));
const dup5 = [...count(MJ5.mapping.map((m) => m.facies)).entries()].filter(([, v]) => v > 1);
must('majority matching at k 5 gives one facies to two clusters', dup5.length === 1 && dup5[0][1] === 2, JSON.stringify(dup5));
w(`MORE CLUSTERS THAN FACIES. At k ${K5.k} one-to-one matching is refused, because a cluster would be left without a facies (${ref('refusals')}). MAJORITY MATCHING gives each cluster its most common facies, so two clusters can share one; the basis reads: "${MJ5.basis.mode}".`);
w();
table(['cluster', 'majority facies', 'rows of that facies', 'rows in the cluster'], MJ5.mapping.map((m) => [S(m.cluster), m.facies, S(m.rows), S(m.clusterSize)]));
w();
must('the k 5 majority accuracy is above the k 4 one-to-one accuracy', MJ5.report.accuracy > MC.report.accuracy, `${MJ5.report.accuracy} ${MC.report.accuracy}`);
w(`${dup5[0][0]} takes two clusters. Accuracy ${f6(MJ5.report.accuracy)}, macro F1 ${f6(MJ5.report.macro.f1)}, above the one-to-one accuracy at k ${K4}, ${f6(MC.report.accuracy)}. Splitting a facies into two clusters costs majority matching nothing, so a higher majority score at a larger k is no evidence for that k.`);
w();
const K3 = K3m;
const M3 = success('matchClusters one-to-one, k 3', CL.matchClusters({ yTrue: YC, clusters: K3.labels }));
const missing3 = M3.faciesLabels.filter((f) => !M3.mapping.some((m) => m.facies === f));
must('one-to-one at k 3 leaves one facies with no cluster', missing3.length === 1, missing3.join(','));
const recall0 = M3.report.perClass.find((c) => c.label === missing3[0]).recall;
must('the facies with no cluster has recall 0', recall0 === 0, recall0);
w(`FEWER CLUSTERS THAN FACIES. At k ${K3.k}, one-to-one matching leaves ${missing3[0]} with no cluster: its recall is ${f6(recall0)}. Accuracy ${f6(M3.report.accuracy)}.`);
w();
const TIEm = golden('match-tie-first-mapping');
const MT = success('matchClusters, the tied golden', CL.matchClusters(TIEm.args));
w(`A TIED MAPPING. Golden \`match-tie-first-mapping\`: facies ${list(TIEm.args.yTrue)}, clusters ${list(TIEm.args.clusters.map(S))}. Both one-to-one mappings match ${MT.matchedRows} rows; the engine takes the first in cluster order that gives cluster 0 the first facies: ${MT.mapping.map((m) => `cluster ${m.cluster} to ${m.facies}`).join(', ')}.`);
must('the tied golden maps cluster 0 to the first facies', MT.mapping[0].facies === [...new Set(TIEm.args.yTrue)].sort(byChar)[0], MT.mapping[0].facies);

/* ============================================================ SECTION 19 */

section('ari', 'The adjusted Rand index', ['Professional m05']);
w(`The adjusted Rand index (ARI; Hubert and Arabie, 1985) scores the agreement of two labellings of the same rows without mapping one onto the other. It counts PAIRS of rows: a pair agrees when both labellings put it together or both put it apart. It is 1 when the two labellings are the same grouping, near 0 for labellings no more alike than chance, and can fall below 0.`);
w();
const TA = [0, 0, 0, 1, 1, 1]; const TB = ['p', 'p', 'q', 'q', 'r', 'r'];
const ARt = success('adjustedRandIndex of two stated labellings', CL.adjustedRandIndex({ a: TA, b: TB }));
const c2 = (x) => (x * (x - 1)) / 2;
const sij = sum(ARt.contingency.flat().map(c2));
const sa = sum(ARt.contingency.map((r) => c2(sum(r))));
const colS = ARt.contingency[0].map((_, j) => sum(ARt.contingency.map((r) => r[j])));
const sb = sum(colS.map(c2));
const Ex = (sa * sb) / c2(TA.length);
const hand = (sij - Ex) / ((sa + sb) / 2 - Ex);
must('the engine ARI is the hand ARI', Math.abs(hand - ARt.ari) < 1e-12, `${hand} ${ARt.ari}`);
w(`BY HAND, six rows, stated: a = ${list(TA.map(S))}, b = ${list(TB)}. The engine's contingency table, rows a, columns b:`);
w();
table(['a \\ b', ...ARt.colLabels], ARt.contingency.map((r, i) => [S(ARt.rowLabels[i]), ...r.map(S)]));
w();
w(`Pairs together in both: the sum of C(n_ij, 2) = ${S(sij)}. Pairs together in a: ${S(sa)}; together in b: ${S(sb)}; all pairs: C(${TA.length}, 2) = ${S(c2(TA.length))}. The expected count by chance is ${S(sa)} x ${S(sb)} / ${S(c2(TA.length))} = ${f6(Ex)}. ARI = (${S(sij)} - ${f6(Ex)}) / ((${S(sa)} + ${S(sb)}) / 2 - ${f6(Ex)}) = ${f6(hand)} (all derived); the engine returns ${f6(ARt.ari)}. The basis reads: "${ARt.basis.formula}".`);
w();
const ARk = success('ARI k-means against core', CL.adjustedRandIndex({ a: YC, b: KM.labels }));
const ARw = success('ARI Ward against core', CL.adjustedRandIndex({ a: YC, b: AG.ward.labels }));
const ARc = success('ARI complete against core', CL.adjustedRandIndex({ a: YC, b: AG.complete.labels }));
const ARa = success('ARI average against core', CL.adjustedRandIndex({ a: YC, b: AG.average.labels }));
const ARwell = success('ARI wells against core', CL.adjustedRandIndex({ a: YC, b: GC }));
const ARkw = success('ARI k-means against Ward', CL.adjustedRandIndex({ a: KM.labels, b: AG.ward.labels }));
planted(0, MC.mapping.map((m) => m.facies).length === new Set(MC.mapping.map((m) => m.facies)).size && ARk.ari > 0.8, `${ARk.ari}`);
w(`ON THE CORED ROWS, every labelling at k ${K4} against the core facies:`);
w();
table(['labelling', 'ARI against the core facies'], [
  [`k-means, seed ${SEED}`, f6(ARk.ari)], [`Ward, cut at ${K4}`, f6(ARw.ari)], [`complete, cut at ${K4}`, f6(ARc.ari)], [`average, cut at ${K4}`, f6(ARa.ari)],
  [`the well each row came from (${T.CORED.length} groups)`, f6(ARwell.ari)],
]);
const best = [['k-means', ARk.ari], ['Ward', ARw.ari], ['complete', ARc.ari], ['average', ARa.ari]].reduce((b, x) => (x[1] > b[1] ? x : b));
w();
w(`Of the four methods, ${best[0]} agrees best with the core here, ${f6(best[1])}. The well names group the rows too, and score ${f6(ARwell.ari)}: a grouping that knows nothing about the rock. The one-to-one matching of ${ref('matching')} returns the same k-means figure, ${f6(MC.ari)}; the basis reads: "${MC.basis.ari}".`);
must('matchClusters and adjustedRandIndex agree on the k-means ARI', MC.ari === ARk.ari, `${MC.ari} ${ARk.ari}`);
w();
const ARren = success('ARI seed 1 labels against core', CL.adjustedRandIndex({ a: YC, b: KS1.labels }));
const ARself = success('ARI seed 1 against seed 3', CL.adjustedRandIndex({ a: KS1.labels, b: KM.labels }));
must('renamed clusters score the same ARI', ARren.ari === ARk.ari, `${ARren.ari} ${ARk.ari}`);
must('the renamed partition scores 1 against the original', ARself.ari === 1, ARself.ari);
w(`RENAMED CLUSTERS SCORE THE SAME. The seed 1 clustering is the teaching partition with other numbers (${ref('reading')}): against the core it scores ${f6(ARren.ari)}, and against the teaching clustering ${f6(ARself.ari)}. k-means against Ward, neither of them the core: ${f6(ARkw.ari)}.`);
w();
const AR1 = success('golden ari-both-one-cluster', CL.adjustedRandIndex(golden('ari-both-one-cluster').args));
const ARn = success('golden ari-negative', CL.adjustedRandIndex(golden('ari-negative').args));
must('the negative golden is below 0', ARn.ari < 0, ARn.ari);
w(`TWO EDGES. Two labellings that each put every row in one cluster have no pair to disagree on, and the formula divides zero by zero; the engine returns ${f6(AR1.ari)} (golden \`ari-both-one-cluster\`); the basis reads: "${AR1.basis.special}". Labellings that disagree more than chance go below 0: golden \`ari-negative\`, a = ${list(golden('ari-negative').args.a.map(S))} against b = ${list(golden('ari-negative').args.b.map(S))}, scores ${f6(ARn.ari)}.`);

/* ============================================================ SECTION 20 */

section('judging', 'Electrofacies against core, end to end', ['Professional m06']);
w(`The Professional workflow on the Ekene cored wells, every step an engine call:`);
w();
table(['step', 'call', 'what it returns here'], [
  [S(1), `\`elbow\` k 1 to ${KMAX}, seed ${SEED}, with the silhouette`, `drop fractions ${f6(EL.table[K4 - 2].dropFraction)}, ${f6(EL.table[K4 - 1].dropFraction)}, ${f6(EL.table[K4].dropFraction)} at k ${K4 - 1}, ${K4}, ${K4 + 1}; best silhouette at k ${SIL_BEST}`],
  [S(2), `\`kmeans\` and \`agglomerative\` (Ward, complete, average) at k ${K4}`, `four labellings of the ${CORED_ROWS.length} rows`],
  [S(3), '`silhouette` of each', `k-means ${f6(SK.mean)}, average ${f6(SA.mean)}`],
  [S(4), '`matchClusters` one-to-one', `k-means: ${MC.matchedRows} rows matched, accuracy ${f6(MC.report.accuracy)}`],
  [S(5), '`adjustedRandIndex` against the core', `k-means ${f6(ARk.ari)}, Ward ${f6(ARw.ari)}, complete ${f6(ARc.ari)}, average ${f6(ARa.ari)}`],
]);
const SAc = success('silhouette of complete linkage k 4', CL.silhouette({ X: XC, labels: AG.complete.labels, names: LOGS }));
const SAw = success('silhouette of Ward k 4', CL.silhouette({ X: XC, labels: AG.ward.labels, names: LOGS }));
w();
w(`The silhouettes of the Ward and complete cuts at k ${K4} are ${f6(SAw.mean)} and ${f6(SAc.mean)}.`);
w();
const fm = (f) => LOGS.map((_, j) => mean(XC.filter((_, i) => YC[i] === f).map((r) => r[j])));
w(`A FACIES THE LOGS BARELY SEPARATE. The mean logs of each core facies (derived, the mean of its cored rows):`);
w();
table(['facies', 'rows', ...LOGS], FACIES_SORTED.map((f) => [f, S(fc.get(f)), ...fm(f).map(f6)]));
const recSS = MC.report.perClass.find((c) => c.label === 'shaly-sand').recall;
must('shaly-sand has the lowest core-facies silhouette and the lowest recall', lowF.label === 'shaly-sand' && MC.report.perClass.every((c) => c.recall >= recSS), `${lowF.label} ${recSS}`);
w();
const between = LOGS.every((_, j) => { const a = fm('sandstone')[j]; const b = fm('shale')[j]; const c = fm('shaly-sand')[j]; return c > Math.min(a, b) && c < Math.max(a, b); });
must('shaly-sand means sit between sandstone and shale on every log', between, 'between');
w(`Shaly-sand's mean sits between sandstone's and shale's on every log. It has the lowest silhouette of the four core facies, ${f6(lowF.mean)} (${ref('silhouette')}), and the lowest recall under the k-means mapping, ${f6(recSS)}: ${ssRow.r[MC.faciesLabels.indexOf('shaly-sand')]} of its rows fall in the sandstone cluster. On these four logs k-means puts part of it with sandstone.`);
w();
w(`WRITING UP A COMPARISON WITH CORE. What a reader needs, taken from the steps above:`);
w();
table(['item', 'what is written'], [
  ['rows and logs', `${CORED_ROWS.length} cored rows of ${list(T.CORED)}; ${list(LOGS)}, standard scaling`],
  ['how k was chosen', `the core describes ${FACIES_SORTED.length} facies; the elbow's drop fractions and the silhouette at k ${EL.table[1].k} to ${KMAX} are printed beside the choice`],
  ['methods compared', `k-means (seed ${SEED}, ${CL.DEFAULTS.KMEANS_N_INIT} starts) and Ward, complete and average linkage, each at k ${K4}`],
  ['agreement with core', `ARI k-means ${f6(ARk.ari)}, Ward ${f6(ARw.ari)}, complete ${f6(ARc.ari)}, average ${f6(ARa.ari)}; one-to-one accuracy of k-means ${f6(MC.report.accuracy)}`],
  ['where it fails', `shaly-sand: ${ssRow.r[MC.faciesLabels.indexOf('shaly-sand')]} of ${fc.get('shaly-sand')} rows fall with sandstone`],
  ['what is not claimed', 'no facies for an uncored well; that is the Expert tier\'s prediction, checked against held-out core'],
]);

/* ============================================================ SECTION 21 */

section('knn', 'k nearest neighbours', ['Expert m01']);
const TRI = GC.map((g, i) => (g !== HELD ? i : -1)).filter((i) => i >= 0);
const TEI = GC.map((g, i) => (g === HELD ? i : -1)).filter((i) => i >= 0);
const XTR = pick(XC, TRI); const YTR = pick(YC, TRI); const XTE = pick(XC, TEI); const YTE = pick(YC, TEI);
const TRW = [...new Set(pick(GC, TRI))];
w(`\`knnClassify\` gives a new row the facies most common among its k nearest TRAINING rows. To see how well it predicts a well it has not seen, one cored well is held out, stated: ${HELD}, ${TEI.length} rows; the model trains on the ${TRI.length} rows of ${list(TRW)}. Choosing which wells to hold out, and scoring every well in turn, is the machine learning course's subject; here the held-out well is stated.`);
w();
const KN = success(`knnClassify k ${KNN_K}, ${HELD} held out`, CL.knnClassify({ X: XTR, y: YTR, Xnew: XTE, k: KNN_K, names: LOGS }));
const KNrep = success(`accuracy of kNN k ${KNN_K} on ${HELD}`, accOf(YTE, KN.predictions));
w(`THE SCALER IS FITTED ON THE TRAINING ROWS ONLY and applied unchanged to the new rows. The basis reads: "${KN.basis.scaling}". The fitted centre and scale:`);
w();
const allSc = success('fitStandardScaler on every cored row', ML.fitStandardScaler({ X: XC, names: LOGS }));
table(['log', `centre, the ${TRI.length} training rows`, `centre, all ${CORED_ROWS.length} cored rows`, 'scale, training rows', 'scale, all cored rows'], LOGS.map((f, j) => [f, f6(KN.scaler.centre[j]), f6(allSc.centre[j]), f6(KN.scaler.scale[j]), f6(allSc.scale[j])]));
w();
w(`THE FIRST ROW OF ${HELD} (depth ${S(CORED_ROWS[TEI[0]].depth)} ft, core facies ${YTE[0]}): its ${KNN_K} nearest training rows, nearest first. The basis reads: "${KN.basis.neighbours}".`);
w();
table(['neighbour', 'training row', 'well', 'core facies', 'distance, standard units'], KN.neighbours[0].map((j, q) => [S(q + 1), S(j), pick(GC, TRI)[j], YTR[j], f6(KN.distances[0][q])]));
w();
w(`Votes: ${KN.votes[0].map((v) => `${v.label} ${v.count}`).join(', ')}; predicted ${KN.predictions[0]}. The basis reads: "${KN.basis.vote}".`);
w();
w(`On all ${TEI.length} rows of ${HELD}, k ${KNN_K}: ${KNrep.perClass.reduce((a, c) => a + c.tp, 0)} rows predicted as their core facies, accuracy ${f6(KNrep.accuracy)} (the machine learning engine's classificationReport; accuracy here is on the held-out well's rows). ${KN.tiedVotes} votes were tied.`);
must('the held-out accuracy is the share of rows predicted right', Math.abs(KNrep.accuracy - KN.predictions.filter((p, i) => p === YTE[i]).length / TEI.length) < 1e-12, KNrep.accuracy);
w();
w(`CHOOSING K FOR NEIGHBOURS. The same held-out well at several k (stated):`);
w();
const KSW = KNN_KS.map((k) => { const r = success(`knn k ${k} on ${HELD}`, CL.knnClassify({ X: XTR, y: YTR, Xnew: XTE, k, names: LOGS })); return { k, r, a: accOf(YTE, r.predictions).accuracy }; });
table(['k', `accuracy on ${HELD}`, 'tied votes'], KSW.map(({ k, r, a }) => [S(k), f6(a), S(r.tiedVotes)]));
const bestK = KSW.reduce((b, x) => (x.a > b.a ? x : b));
w();
const bestKs = KSW.filter((x) => x.a === bestK.a).map((x) => x.k);
w(`The highest accuracy on this one well is ${f6(bestK.a)}, at k ${bestKs.join(' and ')}. One held-out well is one draw: a k chosen on it is quoted with the well it was chosen on. k 1 copies the single nearest row; a larger k averages over more rows and reaches further from the new row.`);
w();
const ownScaled = (Xn) => ML.applyScaler({ scaler: ML.fitStandardScaler({ X: Xn }), X: Xn }).X;
const trZ = ML.applyScaler({ scaler: ML.fitStandardScaler({ X: XTR }), X: XTR }).X;
const KNown = success('knn with the new rows scaled by their own scaler', CL.knnClassify({ X: trZ, y: YTR, Xnew: ownScaled(XTE), k: KNN_K, scale: 'none' }));
const KNraw = success('knn on the raw logs', CL.knnClassify({ X: XTR, y: YTR, Xnew: XTE, k: KNN_K, scale: 'none' }));
const aOwn = accOf(YTE, KNown.predictions).accuracy; const aRaw = accOf(YTE, KNraw.predictions).accuracy;
must('scaling the new rows with their own scaler lowers the held-out accuracy', aOwn < KNrep.accuracy, `${aOwn} ${KNrep.accuracy}`);
w(`TWO WRONG WAYS, same k and well. Scaling ${HELD}'s rows with a scaler fitted on ${HELD} itself (so each well is standardised on its own statistics) scores ${f6(aOwn)}; no scaling at all scores ${f6(aRaw)}; the engine's way, ${f6(KNrep.accuracy)}. A well scaled on its own statistics has its own mean mapped to 0, the training centre, whatever its rock.`);
w();
const TIEK = 2;
const KT = success(`knnClassify k ${TIEK}, the uncored rows`, CL.knnClassify({ X: XC, y: YC, Xnew: X8, k: TIEK, names: LOGS }));
const tRow = KT.votes.findIndex((v) => v.length > 1 && v.every((x) => x.count === v[0].count));
must('k 2 on the second uncored well meets a tied vote', tRow >= 0 && KT.tiedVotes >= 1, KT.tiedVotes);
const tNb = KT.neighbours[tRow].map((j) => YC[j]);
w(`A TIED VOTE. Trained on all ${CORED_ROWS.length} cored rows, k ${TIEK}, row ${tRow} of ${UN2}: its neighbours, nearest first, are ${list(tNb)} (distances ${list(KT.distances[tRow].map(f6))}). One vote each; the engine gives the row the facies of the nearer neighbour, ${KT.predictions[tRow]}. scikit-learn would give it the facies that sorts first, ${[...new Set(tNb)].sort(byChar)[0]}. \`tiedVotes\` counts ${KT.tiedVotes} such row${KT.tiedVotes === 1 ? '' : 's'} in the well.`);
must('the tied vote goes to the nearer neighbour', KT.predictions[tRow] === tNb[0] && tNb[0] !== [...new Set(tNb)].sort(byChar)[0], `${KT.predictions[tRow]} ${tNb}`);
w();
const gv = golden('knn-vote-tie-nearest-b');
const GV = success('golden knn-vote-tie-nearest-b', CL.knnClassify(gv.args));
w(`The same rule on a stated golden, \`knn-vote-tie-nearest-b\`: training rows ${list(gv.args.X.map((r) => S(r[0])))} labelled ${list(gv.args.y)}, a new row at ${S(gv.args.Xnew[0][0])}, k ${gv.args.k}, no scaling. Neighbours ${list(GV.neighbours[0].map((j) => `${gv.args.X[j][0]} (${gv.args.y[j]})`))}; votes ${GV.votes[0].map((v) => `${v.label} ${v.count}`).join(', ')}; predicted ${GV.predictions[0]}, the facies of the nearest row.`);
must('the golden tie goes to b', GV.predictions[0] === gv.expected.predictions[0], GV.predictions[0]);
w();
const ge = golden('knn-equidistant-lower-row');
const GE = success('golden knn-equidistant-lower-row', CL.knnClassify(ge.args));
w(`EQUIDISTANT NEIGHBOURS. Golden \`knn-equidistant-lower-row\`: training rows ${list(ge.args.X.map((r) => S(r[0])))} labelled ${list(ge.args.y)}, a new row at ${S(ge.args.Xnew[0][0])}, k ${ge.args.k}. Row 1 sits on it; rows 0 and 2 are both ${f6(GE.distances[0][1])} away. The engine takes the lower row, row ${GE.neighbours[0][1]}, so the neighbours are rows ${list(GE.neighbours[0].map(S))} and the prediction ${GE.predictions[0]}. "Equally far" is judged within 1e-12, relative, of the smallest remaining squared distance (${ref('bands')}).`);
must('the equidistant golden takes row 0', GE.neighbours[0][1] === 0, GE.neighbours[0].join(','));

/* ============================================================ SECTION 22 */

section('cart', 'Classification trees', ['Expert m02']);
const T5 = success('cartFit on the cored rows, five channels, default depth', CL.cartFit({ X: XC5, y: YC, names: LOGS_C }));
const g0 = T5.nodes[0];
const giniHand = 1 - sum(g0.counts.map((c) => (c / g0.n) ** 2));
must('the root Gini is 1 - sum of squared shares', Math.abs(giniHand - g0.gini) < 1e-15, `${giniHand} ${g0.gini}`);
w(`\`cartFit\` grows one classification tree: each node splits its rows on one log at one threshold, the split that most lowers the Gini impurity, until a stopping rule. GINI IMPURITY of a node is 1 - the sum over facies of (share)^2: 0 for a node of one facies. The basis reads: "${T5.basis.criterion}".`);
w();
w(`The root holds all ${g0.n} cored rows, counts ${list(g0.counts.map(S))} in the order ${list(T5.classes)}: Gini = 1 - (${g0.counts.map((c) => `(${c}/${g0.n})^2`).join(' + ')}) = ${f6(giniHand)} (derived); the engine returns ${f6(g0.gini)}.`);
w();
w(`THE TREE, five channels (${list(LOGS_C)}), default depth ${T5.maxDepth} (the root is depth 0), grown on all ${CORED_ROWS.length} cored rows. The engine's printed form, verbatim (x <= threshold goes left):`);
w();
T5.printed.split('\n').forEach((l) => w(`    ${l}`));
w();
must('the printed tree has one line per leaf and two per split', T5.printed.split('\n').length === T5.nLeaves + 2 * (T5.nNodes - T5.nLeaves), T5.printed.split('\n').length);
w(`${T5.nNodes} nodes, ${T5.nLeaves} leaves, depth ${T5.depth}; training accuracy ${f6(T5.trainingAccuracy)} (on the rows it was grown on). The basis for the node order reads: "${T5.basis.nodes}".`);
w();
const splitNodes = T5.nodes.filter((d) => !d.leaf);
table(['node', 'depth', 'rows', 'Gini', 'split on', 'threshold', 'weighted impurity decrease'], splitNodes.map((d) => [S(d.id), S(d.depth), S(d.n), f6(d.gini), d.feature, f6(d.threshold), f6(d.impurityDecrease)]));
w();
w(`MIDPOINT THRESHOLDS. A candidate threshold sits halfway between two neighbouring distinct values of the log in the node, computed as a/2 + b/2. The basis reads: "${T5.basis.thresholds}". The printed tree shows each threshold as the shortest decimal that reads back to the stored number, so a midpoint that is not exact in binary prints with its tail: \`${T5.printed.split('\n').find((l) => /\d{12,}/.test(l)).trim()}\`. The table above prints the same thresholds at six decimals.`);
must('some printed threshold carries a binary tail', T5.printed.split('\n').some((l) => /\d{12,}/.test(l)), 'tail');
const root = T5.nodes[0];
const lft = XC5.filter((r) => r[root.featureIndex] <= root.threshold).length;
must('the root threshold sends its left rows left', lft === T5.nodes[root.left].n, `${lft}`);
w();
w(`STOPPING. The basis reads: "${T5.basis.stopping}". Depth by depth, grown on all ${CORED_ROWS.length} cored rows and, separately, on the ${TRI.length} rows of ${list(TRW)} and scored on ${HELD} (held out, stated):`);
w();
const TREE_ON = (d, Xs, ys) => success(`cartFit depth ${d}`, CL.cartFit({ X: Xs, y: ys, names: LOGS_C, maxDepth: d }));
const XTR5 = pick(XC5, TRI); const XTE5 = pick(XC5, TEI);
const DS = DEPTHS.map((d) => { const t = TREE_ON(d, XC5, YC); const h = TREE_ON(d, XTR5, YTR); const p = success('cartPredict held out', CL.cartPredict({ model: h, X: XTE5 })); return { d, t, h, a: accOf(YTE, p.predictions).accuracy }; });
table(['maxDepth', 'nodes', 'leaves', 'training accuracy, all cored rows', `accuracy on ${HELD}, grown without it`], DS.map(({ d, t, a }) => [S(d), S(t.nNodes), S(t.nLeaves), f6(t.trainingAccuracy), f6(a)]));
const bestD = DS.reduce((b, x) => (x.a > b.a ? x : b));
must('training accuracy never falls with depth', DS.every((x, i) => i === 0 || x.t.trainingAccuracy >= DS[i - 1].t.trainingAccuracy), 'monotone');
w();
const bestDs = DS.filter((x) => x.a === bestD.a).map((x) => x.d);
w(`Training accuracy never falls as the tree deepens; the held-out accuracy is highest, ${f6(bestD.a)}, at maxDepth ${bestDs.join(' and ')}, and moves up and down with depth. A deep tree fits its own rows; the held-out well is what says how far that carries. At maxDepth 0 the tree is one leaf predicting the most common facies, ${DS[0].t.nodes[0].prediction}.`);
w();
const TL = success('cartFit minSamplesLeaf 5', CL.cartFit({ X: XC5, y: YC, names: LOGS_C, minSamplesLeaf: 5 }));
const LEAF = 5;
must('no leaf of the minimum-leaf tree holds fewer rows than the minimum', TL.nodes.filter((d) => d.leaf).every((d) => d.n >= LEAF), 'leaves');
w(`MINIMUM ROWS. \`minSamplesLeaf\` ${LEAF} (stated) forbids any split that leaves fewer than ${LEAF} rows on a side: ${TL.nLeaves} leaves, the smallest holding ${Math.min(...TL.nodes.filter((d) => d.leaf).map((d) => d.n))} rows, training accuracy ${f6(TL.trainingAccuracy)}; without it the smallest leaf holds ${Math.min(...T5.nodes.filter((d) => d.leaf).map((d) => d.n))}.`);

/* ============================================================ SECTION 23 */

section('ties', 'Ties and exact comparisons in the tree', ['Expert m03']);
const XC4 = XC; const XC4sw = XC.map((r) => [r[0], r[1], r[3], r[2]]);
const TA1 = success('cartFit depth 1, GR RHOB NPHI PEF', CL.cartFit({ X: XC4, y: YC, names: LOGS, maxDepth: 1 }));
const TB1 = success('cartFit depth 1, GR RHOB PEF NPHI', CL.cartFit({ X: XC4sw, y: YC, names: ['GR', 'RHOB', 'PEF', 'NPHI'], maxDepth: 1 }));
const rA = TA1.nodes[0]; const rB = TB1.nodes[0];
const leftA = XC4.map((r) => r[rA.featureIndex] <= rA.threshold); const leftB = XC4sw.map((r) => r[rB.featureIndex] <= rB.threshold);
const samePart = leftA.every((v, i) => v === !leftB[i]) || leftA.every((v, i) => v === leftB[i]);
planted(2, rA.feature === 'NPHI' && rB.feature === 'PEF' && rA.impurityDecrease === rB.impurityDecrease && samePart, `${rA.feature} ${rB.feature} ${rA.impurityDecrease} ${rB.impurityDecrease}`);
w(`THE ROOT TIE BETWEEN TWO LOGS. Limestone is the only facies with NPHI at or below the stated ${S(T.LIME_NPHI_MAX)} and the only one with PEF at or above ${S(T.LIME_PEF_MIN)} (${ref('dataset')}), so NPHI and PEF each split off exactly the ${fc.get('limestone')} limestone rows. Two depth-1 trees on the ${CORED_ROWS.length} cored rows, the four logs in two column orders:`);
w();
table(['column order', 'root split', 'weighted impurity decrease', 'rows sent left'], [
  [list(LOGS), `${rA.feature} <= ${f6(rA.threshold)}`, f6(rA.impurityDecrease), S(TA1.nodes[rA.left].n)],
  [list(['GR', 'RHOB', 'PEF', 'NPHI']), `${rB.feature} <= ${f6(rB.threshold)}`, f6(rB.impurityDecrease), S(TB1.nodes[rB.left].n)],
]);
w();
w(`The two splits make the same two groups of rows and the same decrease (the engine returns the two decreases exactly equal). The tie goes to the log with the LOWER COLUMN INDEX, so the order the logs are passed in decides the printed tree. The basis reads: "${TA1.basis.ties}". Splits are compared EXACTLY on the integer facies counts, so a tie is a tie and never a rounding.`);
w();
const xor = golden('cart-xor-no-split');
const TX = success('golden cart-xor-no-split', CL.cartFit(xor.args));
must('the XOR golden stays one leaf', TX.nLeaves === 1, TX.nLeaves);
w(`A SPLIT NEEDS A DECREASE ABOVE ZERO. Golden \`cart-xor-no-split\`: four rows ${list(xor.args.X.map((r) => `(${r.join(', ')})`))} labelled ${list(xor.args.y.map(S))}, maxDepth ${xor.args.maxDepth}. Every single split leaves each side half one label and half the other, so no split lowers the Gini (root ${f6(TX.nodes[0].gini)}), and the tree stays a single leaf (${TX.nLeaves} node) predicting ${TX.nodes[0].prediction}. CART judges one split at a time.`);
w();
const ir0 = golden('cart-iris-depth0');
const TI0 = success('golden cart-iris-depth0', CL.cartFit(ir0.args));
must('the iris one-leaf tree is a three-way tie resolved to setosa', TI0.nodes[0].counts.every((c) => c === TI0.nodes[0].counts[0]) && TI0.nodes[0].prediction === TI0.classes[0], TI0.nodes[0].counts);
w(`A TIED LEAF. A leaf predicts its most common facies; a tie goes to the facies that sorts first. The basis reads: "${TI0.basis.prediction}". Golden \`cart-iris-depth0\`: Fisher's iris, maxDepth 0, one leaf with counts ${list(TI0.nodes[0].counts.map(S))} for ${list(TI0.classes)}; it predicts ${TI0.nodes[0].prediction}, training accuracy ${f6(TI0.trainingAccuracy)}.`);
w();
w(`FEATURE IMPORTANCES. A log's importance is the sum, over the splits on it, of the weighted Gini decrease, normalised so all sum to 1. The basis reads: "${T5.basis.importance}". The five-channel tree of ${ref('cart')}:`);
w();
table(['log', 'importance'], LOGS_C.map((f, j) => [f, f6(T5.featureImportances[j])]));
const caliImp = T5.featureImportances[LOGS_C.indexOf('CALI')];
const caliSplit = T5.nodes.some((d) => !d.leaf && d.feature === 'CALI');
planted(3, caliImp === 0 && !caliSplit, `${caliImp} ${caliSplit}`);
must('the importances sum to 1', Math.abs(sum(T5.featureImportances) - 1) < 1e-12, sum(T5.featureImportances));
w();
w(`CALI is never split on and its importance is ${f6(caliImp)}. An importance describes this tree: in the depth-1 trees above, NPHI takes all of it in one column order and PEF in the other (${f6(TA1.featureImportances[2])} and ${f6(TB1.featureImportances[2])}), although the two logs split the rows the same way.`);
must('the swapped order moves all importance from NPHI to PEF', TA1.featureImportances[2] === 1 && TB1.featureImportances[2] === 1, `${TA1.featureImportances} ${TB1.featureImportances}`);

/* ============================================================ SECTION 24 */

section('uncored', 'Predicting the uncored wells, and writing the facies back', ['Expert m04']);
STEP = 0;
w(`${UN1} and ${UN2} have no core. Both methods are trained on all ${CORED_ROWS.length} cored rows: kNN with k ${KNN_K}, and the five-channel tree of ${ref('cart')} (default depth). Every step below is an engine call.`);
w();
const KU7 = success(`knn k ${KNN_K}, ${UN1}`, CL.knnClassify({ X: XC, y: YC, Xnew: X7, k: KNN_K, names: LOGS }));
const KU8 = success(`knn k ${KNN_K}, ${UN2}`, CL.knnClassify({ X: XC, y: YC, Xnew: X8, k: KNN_K, names: LOGS }));
const CU7 = success(`cartPredict ${UN1}`, CL.cartPredict({ model: T5, X: X(R7, LOGS_C) }));
const CU8 = success(`cartPredict ${UN2}`, CL.cartPredict({ model: T5, X: X(R8, LOGS_C) }));
const cnt = (p) => FACIES_SORTED.map((f) => S(p.filter((x) => x === f).length));
w(`STEP ${step()}, PREDICT. Rows predicted as each facies:`);
w();
table(['well', 'method', ...FACIES_SORTED], [[UN1, `kNN, k ${KNN_K}`, ...cnt(KU7.predictions)], [UN1, 'tree', ...cnt(CU7.predictions)], [UN2, `kNN, k ${KNN_K}`, ...cnt(KU8.predictions)], [UN2, 'tree', ...cnt(CU8.predictions)]]);
const agree7 = KU7.predictions.filter((p, i) => p === CU7.predictions[i]).length;
const agree8 = KU8.predictions.filter((p, i) => p === CU8.predictions[i]).length;
w();
w(`The two methods give the same facies on ${agree7} of ${R7.length} rows of ${UN1} and ${agree8} of ${R8.length} rows of ${UN2}. Agreement between two methods trained on the same rows is not a check against rock.`);
w();
const mm8 = success(`applyScaler min-max, ${UN2}`, ML.applyScaler({ scaler: MM, X: X8 }));
const hot = mm8.X.filter((r) => r[0] > 1).length;
w(`STEP ${step()}, CHECK THE NEW WELLS AGAINST THE TRAINING RANGE. Min-max scaling fitted on the cored rows (${ref('scaling')}) maps ${hot} of the ${R8.length} ${UN2} rows above 1 on GR, the highest to ${f6(colMax(mm8.X, 0))}; ${UN1}'s highest GR maps to ${f6(colMax(mm7.X, 0))}. ${UN2} was logged with an uncalibrated tool (stated, ${ref('dataset')}): its GR reads ${S(T.HOT_GR_ADD)} gAPI high on every row.`);
w();
const A7k = accOf(W7, KU7.predictions); const A8k = accOf(W8, KU8.predictions);
const A7c = accOf(W7, CU7.predictions); const A8c = accOf(W8, CU8.predictions);
planted(4, KU7.predictions.length === W7.length && KU8.predictions.length === W8.length && CU7.predictions.length === W7.length, 'predicted');
planted(5, A8k.accuracy < A7k.accuracy && hot > 0, `${A8k.accuracy} ${A7k.accuracy} ${hot}`);
w(`STEP ${step()}, ONLY BECAUSE THIS FIELD IS SYNTHETIC: CHECK AGAINST THE WITHHELD FACIES. A real uncored well gives no such check; the generator kept the facies it drew (${ref('dataset')}).`);
w();
table(['well', 'method', 'rows predicted as the withheld facies', 'accuracy'], [
  [UN1, `kNN, k ${KNN_K}`, S(KU7.predictions.filter((p, i) => p === W7[i]).length), f6(A7k.accuracy)],
  [UN1, 'tree', S(CU7.predictions.filter((p, i) => p === W7[i]).length), f6(A7c.accuracy)],
  [UN2, `kNN, k ${KNN_K}`, S(KU8.predictions.filter((p, i) => p === W8[i]).length), f6(A8k.accuracy)],
  [UN2, 'tree', S(CU8.predictions.filter((p, i) => p === W8[i]).length), f6(A8c.accuracy)],
]);
const wrong8 = KU8.predictions.map((p, i) => (p !== W8[i] ? `${W8[i]} as ${p}` : null)).filter(Boolean);
const wrongKinds = [...count(wrong8).entries()];
w();
const grMean = (f) => T.FACIES.find((x) => x[0] === f)[1][0];
must('the stated offset lifts the sandstone GR mean above the shaly-sand GR mean', grMean('sandstone') + T.HOT_GR_ADD > grMean('shaly-sand'), 'means');
w(`kNN misses ${wrong8.length} rows of ${UN2}: ${wrongKinds.map(([k, v]) => `${v} ${k}`).join('; ')}. The stated sandstone GR mean is ${S(grMean('sandstone'))} gAPI and the shaly-sand mean ${S(grMean('shaly-sand'))} gAPI (${ref('dataset')}); ${S(T.HOT_GR_ADD)} gAPI more puts a sandstone's mean GR above the shaly-sand mean.`);
must('every kNN miss on the hot well is sandstone predicted as shaly-sand', wrongKinds.length === 1 && wrongKinds[0][0] === 'sandstone as shaly-sand', JSON.stringify(wrongKinds));
const X8fix = X8.map((r) => [r[0] - T.HOT_GR_ADD, r[1], r[2], r[3]]);
const KU8fix = success(`knn k ${KNN_K}, ${UN2} with the stated offset removed`, CL.knnClassify({ X: XC, y: YC, Xnew: X8fix, k: KNN_K, names: LOGS }));
const A8fix = accOf(W8, KU8fix.predictions);
w();
w(`With the stated ${S(T.HOT_GR_ADD)} gAPI taken off every ${UN2} GR value (possible here only because the offset was planted and stated), kNN scores ${f6(A8fix.accuracy)} on the same well. In a real field the fix is a gamma ray normalisation between wells, which is the data quality course's, done before any facies is predicted.`);
must('removing the stated offset raises the hot well accuracy', A8fix.accuracy > A8k.accuracy, `${A8fix.accuracy} ${A8k.accuracy}`);
w();
const inside8 = KU8.predictions.filter((p, i) => p !== W8[i] && mm8.X[i][0] <= 1).length;
w(`A RANGE CHECK SEES ONLY THE ROWS THAT LEAVE THE RANGE. Min-max flagged ${hot} rows of ${UN2}; kNN missed ${wrong8.length}, and ${inside8 === wrong8.length ? `all ${inside8}` : inside8} of the misses sit inside the GR range. Every row of ${UN2} carries the same offset, flagged or not.`);
w();
w(`STEP ${step()}, WRITE IT BACK HONESTLY. The course's rule for a predicted facies, every value in it taken from the steps above:`);
w();
table(['item', 'what is written'], [
  ['channel name', 'a new channel, FACIES_PRED, beside the empty core facies; the core facies stays null'],
  ['method', `kNN, k ${KNN_K}, standard scaling fitted on the training rows, logs ${list(LOGS)}`],
  ['wells trained on', `${list(T.CORED)}, ${CORED_ROWS.length} cored rows`],
  ['expected agreement', `on ${HELD} held out, kNN k ${KNN_K} trained on the other five cored wells scored ${f6(KNrep.accuracy)} (${ref('knn')})`],
  ['rows outside the training range', `${UN2}: ${hot} of ${R8.length} rows above the cored GR maximum ${f6(MM.max[0])} gAPI; flagged row by row, and the whole well flagged for a gamma ray to be normalised`],
  ['what is not claimed', 'no core facies and no accuracy for an uncored well'],
]);
w();
w('A predicted facies written back without its method, its training wells, its held-out score and its range flags will be read later as core.');

/* ============================================================ SECTION 25 */

section('boundaries', 'Where each boundary falls, rule by rule', ['Expert m05 l01', 'Expert m05 l04']);
w('Each rule draws its own boundary; nothing here is global. Every row is a real call, and the refused side is also in the refusal table.');
w();
const ok = (label, r) => !!success(label, r) && !r.error;
const no = (r) => !!(r && r.error);
const two = XC.slice(0, 2); const six = XC.slice(0, 6);
const B = [];
const brow = (fn, rule, acc, ref2, cond, label) => { must(`BOUNDARY ${label}`, cond, label); B.push([`\`${fn}\``, rule, acc, ref2]); };
brow('pca', 'rows', `n = 2 is fitted`, 'n = 1 refused', ok('pca two rows', CL.pca({ X: two })) && no(CL.pca({ X: [XC[0]] })), 'pca rows');
brow('pca', 'nComponents', `1 and ${LOGS.length} (the number of logs) accepted`, `0 and ${LOGS.length + 1} refused`, ok('pca q 1', CL.pca({ X: XC, nComponents: 1 })) && ok('pca q p', CL.pca({ X: XC, nComponents: LOGS.length })) && no(CL.pca({ X: XC, nComponents: 0 })) && no(CL.pca({ X: XC, nComponents: LOGS.length + 1 })), 'pca q');
brow('kmeans', 'k', `1 and n accepted (${S(six.length)} rows, k ${S(six.length)})`, `0 and n + 1 refused`, ok('kmeans k 1', CL.kmeans({ X: XC, k: 1, seed: SEED })) && ok('kmeans k n', CL.kmeans({ X: six, k: six.length, seed: SEED })) && no(CL.kmeans({ X: six, k: six.length + 1, seed: SEED })), 'kmeans k');
const dup = [XC[0], XC[0], XC[1], XC[1]];
brow('kmeans', 'distinct rows against k', 'distinct rows equal to k accepted', 'fewer distinct rows than k refused (counted after scaling)', ok('kmeans distinct = k', CL.kmeans({ X: dup, k: 2, seed: SEED })) && no(CL.kmeans({ X: dup, k: 3, seed: SEED })), 'distinct');
const lab6 = [0, 0, 1, 1, 2, 2];
brow('silhouette', 'distinct clusters', '2 and n - 1 accepted', '1 and n refused', ok('sil 2', CL.silhouette({ X: six, labels: [0, 0, 0, 1, 1, 1] })) && ok('sil n-1', CL.silhouette({ X: six, labels: [0, 1, 2, 3, 4, 4] })) && no(CL.silhouette({ X: six, labels: [0, 0, 0, 0, 0, 0] })) && no(CL.silhouette({ X: six, labels: [0, 1, 2, 3, 4, 5] })), 'sil clusters');
brow('silhouette', 'sampleSize', `2 to min(n, ${CL.DEFAULTS.SILHOUETTE_MAX_ROWS})`, 'n + 1 refused', ok('sil sample 2', CL.silhouette({ X: six, labels: lab6, sampleSize: six.length, seed: SEED })) && no(CL.silhouette({ X: six, labels: lab6, sampleSize: six.length + 1, seed: SEED })), 'sil sample');
const SILN = CL.DEFAULTS.SILHOUETTE_MAX_ROWS;
brow('silhouette', 'rows scored in full', `${SILN} rows scored in full`, `${SILN + 1} refused without a sample`, ok('silhouette at the cap', CL.silhouette({ X: TILE(SILN), labels: TILE_Y(SILN) })) && no(CL.silhouette({ X: TILE(SILN + 1), labels: TILE_Y(SILN + 1) })), 'sil cap');
const AGN = CL.DEFAULTS.AGGLOMERATIVE_MAX_ROWS;
brow('agglomerative', 'rows', `${AGN} rows clustered`, `${AGN + 1} refused`, ok('agglomerative at the cap', CL.agglomerative({ X: TILE(AGN), k: K4 })) && no(CL.agglomerative({ X: TILE(AGN + 1) })), 'agg cap');
brow('agglomerative, cutTree', 'k', '1 and n accepted', '0 and n + 1 refused', ok('agg k 1', CL.agglomerative({ X: six, k: 1 })) && ok('agg k n', CL.agglomerative({ X: six, k: six.length })) && no(CL.agglomerative({ X: six, k: six.length + 1 })) && no(CL.cutTree({ linkageMatrix: WD.linkageMatrix, k: 0 })), 'agg k');
brow('knnClassify', 'k', '1 and the number of training rows accepted', 'one more refused', ok('knn k 1', CL.knnClassify({ X: XTR, y: YTR, Xnew: XTE, k: 1 })) && ok('knn k n', CL.knnClassify({ X: six, y: YC.slice(0, 6), Xnew: XTE, k: six.length })) && no(CL.knnClassify({ X: six, y: YC.slice(0, 6), Xnew: XTE, k: six.length + 1 })), 'knn k');
const KP = Math.sqrt(CL.DEFAULTS.KNN_MAX_PAIRS);
brow('knnClassify', 'training rows x new rows', `${KP} x ${KP} = ${CL.DEFAULTS.KNN_MAX_PAIRS} computed`, `${KP + 1} x ${KP} refused`, ok('knn at the pair cap', CL.knnClassify({ X: TILE(KP), y: TILE_Y(KP), Xnew: TILE(KP), k: 1 })) && no(CL.knnClassify({ X: TILE(KP + 1), y: TILE_Y(KP + 1), Xnew: TILE(KP), k: 1 })), 'knn cap');
brow('cartFit', 'maxDepth', '0 accepted (a single leaf)', '-1 refused', ok('cart depth 0', CL.cartFit({ X: XC, y: YC, maxDepth: 0 })) && no(CL.cartFit({ X: XC, y: YC, maxDepth: -1 })), 'depth');
brow('cartFit', 'minSamplesLeaf, minSamplesSplit', '1 and 2 accepted', '0 and 1 refused', ok('cart leaf 1', CL.cartFit({ X: XC, y: YC, minSamplesLeaf: 1, minSamplesSplit: 2 })) && no(CL.cartFit({ X: XC, y: YC, minSamplesLeaf: 0 })) && no(CL.cartFit({ X: XC, y: YC, minSamplesSplit: 1 })), 'leaf');
brow('cartFit', 'a split', 'a decrease above zero splits', `a decrease of exactly zero leaves a leaf (golden \`cart-xor-no-split\`)`, TX.nLeaves === 1 && T5.nLeaves > 1, 'decrease');
brow('matchClusters', 'one-to-one', 'clusters equal to facies accepted', 'more clusters than facies refused; majority mode accepts them', ok(`match one-to-one k ${K4}`, CL.matchClusters({ yTrue: YC, clusters: KM.labels })) && no(CL.matchClusters({ yTrue: YC, clusters: K5.labels })) && ok(`majority k ${K5.k}`, CL.matchClusters({ yTrue: YC, clusters: K5.labels, mode: 'majority' })), 'match');
brow('kmeans, agglomerative, knnClassify', 'a tie in distance or height', `within ${eX(CL.DEFAULTS.TIE_REL)} of the smallest, relative, inclusive: tied`, 'beyond it: ordered by size', true, 'band stated');
brow('pca', 'the sign rule', `a weight within ${eX(CL.DEFAULTS.SIGN_TIE_REL)} of the largest, relative, inclusive, counts as largest`, 'the first such weight is made positive', true, 'sign stated');
brow('elbow', 'bestSilhouetteK', 'the highest mean silhouette', 'a tie goes to the smaller k', EL.basis.pick.includes('smaller k'), 'best k');
table(['function', 'rule', 'at the boundary', 'across it'], B);
w();
w(`The row caps trade memory and time for rows: the silhouette and agglomerative clustering hold every pair of rows, so they stop at ${SILN} and ${AGN} rows, and kNN computes every training row against every new row, so it stops at ${CL.DEFAULTS.KNN_MAX_PAIRS} pairs. A larger dataset is sampled with a stated seed (the silhouette's \`sampleSize\`), clustered by k-means, or classified in batches.`);

/* ============================================================ SECTION 26 */

section('bands', 'The tie band, the sign rule and a repeated eigenvalue', ['Expert m05 l02', 'Expert m05 l03']);
w(`DECIMAL LOGS ARE NOT EXACT IN BINARY. Two distances that are equal on paper can differ in the last bits once computed, so the engine judges every distance tie inside a band: squared distances (k-means, kNN) or merge heights (agglomerative) within ${eX(CL.DEFAULTS.TIE_REL)} of the smallest, relative, are tied, and the tie goes to the lower centre, the lower row or the lowest cluster ids. Three goldens, each built so a tie is certain:`);
w();
const gk = golden('kmeans-assignment-tie-lower-centre');
const GK = success('golden kmeans-assignment-tie-lower-centre', CL.kmeans(gk.args));
const tieRow = gk.args.X.findIndex((r) => r[0] === 5);
w(`k-means, golden \`kmeans-assignment-tie-lower-centre\`: rows ${list(gk.args.X.map((r) => `(${r.join(', ')})`))}, starting centres ${list(gk.args.init.map((r) => `(${r.join(', ')})`))}, one pass, no scaling. Row ${tieRow}, (${gk.args.X[tieRow].join(', ')}), is equally far from both centres and goes to centre ${GK.labels[tieRow]}, the lower. Labels ${list(GK.labels.map(S))}.`);
must('the tied row goes to centre 0', GK.labels[tieRow] === 0, GK.labels[tieRow]);
w();
const ga = golden('agglomerative-grid-ties-ward');
const GA = success('golden agglomerative-grid-ties-ward', CL.agglomerative(ga.args));
must('the grid golden meets tied steps', GA.tiedSteps > 0, GA.tiedSteps);
w(`Agglomerative, golden \`agglomerative-grid-ties-ward\`: the corners of a unit square and two more points, ${list(ga.args.X.map((r) => `(${r.join(', ')})`))}, Ward, no scaling. ${GA.tiedSteps} of the ${GA.linkageMatrix.length} merges met a tie; the basis reads: "${GA.basis.ties}". The first three merges, all at height ${f6(GA.linkageMatrix[0][2])}: ${GA.linkageMatrix.slice(0, 3).map((r) => `[${r[0]}, ${r[1]}]`).join(', ')}.`);
w();
w(`kNN, golden \`knn-equidistant-lower-row\`, is in ${ref('knn')}: of two training rows equally far away, the lower row is the neighbour.`);
w();
w(`TIED STARTS. In ${ref('starts')}, ${sameAsBest.length} of the ${KM.runs.length} starts print the winning inertia ${f6(KM.inertia)}; the largest difference between any of them and the winner is ${eX(bandGap)}, inside the band, so they are tied and the earliest start wins. The band is what makes that rule safe: two figures that agree at six decimals are equal only where the engine says so, and a difference in the last bits would otherwise decide the winner.`);
w();
const gs = golden('pca-two-features-sign-tie');
const GS = success('golden pca-two-features-sign-tie', CL.pca(gs.args));
must('the two-feature golden has equal absolute weights and a positive first', Math.abs(Math.abs(GS.components[0][0]) - Math.abs(GS.components[0][1])) < 1e-12 && GS.components[0][0] > 0, GS.components[0]);
w(`THE SIGN RULE. In each component the engine makes the largest absolute weight positive, and a weight within ${eX(CL.DEFAULTS.SIGN_TIE_REL)} of the largest, relative, counts as largest: the first such weight is made positive. With two standardised features the first component's two weights are equal in size, so which is "largest" would otherwise be decided by rounding. Golden \`pca-two-features-sign-tie\`: rows ${list(gs.args.X.map((r) => `(${r.join(', ')})`))}; the first component is (${list(GS.components[0].map(f6))}), its first weight positive. The basis reads: "${GS.basis.sign}".`);
w();
const ISO = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const GI = success('pca of a stated symmetric cross', CL.pca({ X: ISO, matrix: 'covariance' }));
must('the symmetric cross repeats its eigenvalue and warns', GI.repeatedEigenvalues.length === 1 && typeof GI.warning === 'string', GI.warning);
w(`A REPEATED EIGENVALUE. Four stated rows, ${list(ISO.map((r) => `(${r.join(', ')})`))}, spread equally in every direction: covariance eigenvalues ${list(GI.eigenvalues.map(f6))}. Any direction is as good as any other, so the components are one valid choice among many, and the engine says so, verbatim:`);
w();
w(`> ${GI.warning}`);
w();
w(`The repeated check is relative to the largest eigenvalue, band ${eX(CL.DEFAULTS.REPEATED_EIGEN_REL)}. On the Ekene cored rows no pair is repeated (${ref('pca')}).`);

/* ============================================================ SECTION 27 */

section('choices', 'Conventions that are choices, and what is not built', ['Expert m06']);
w('Every convention below is a choice the engine states in its basis. Each has a real alternative in common use; name the choice when a number from this engine is compared with one from another tool.');
w();
table(['convention', 'this engine', 'a common alternative', 'why the engine chose it'], [
  ['clustering scaler', 'standard, population SD (n), fitted on the rows clustered', 'no scaling, or min-max', 'logs in different units would otherwise be ruled by GR'],
  ['PCA matrix', 'correlation, sample SD (n - 1)', 'covariance (scikit-learn PCA)', 'score variances equal the eigenvalues, and every log counts'],
  ['PCA sign', 'largest absolute weight positive, with a band', 'whatever the solver returns', 'the same data give the same signs'],
  ['k-means seeding', 'k-means++, one candidate per step, mulberry32(seed)', 'greedy k-means++ (scikit-learn tries several candidates)', 'one canonical generator across the platform; a learner can follow each draw'],
  ['k-means starts', `${CL.DEFAULTS.KMEANS_N_INIT} by default`, 'one (scikit-learn n_init auto)', 'one start can stop in a poor arrangement'],
  ['k-means passes', 'counted as assignment passes, the confirming pass included', 'centre updates', 'matches scikit-learn n_iter_ when the stop is by labels'],
  ['silhouette distance', 'Euclidean on the scaled logs', 'raw logs', 'scores the space the clusters were made in'],
  ['agglomerative ids and heights', 'scipy linkage matrix; Ward height sqrt(2 x rise in sum of squares)', 'scikit-learn children_ with no heights', 'the whole tree can be re-cut and drawn'],
  ['kNN tied vote', 'the tied facies whose nearest member comes first', 'the facies that sorts first (scikit-learn)', 'it falls back toward the single nearest row, which a learner can check by hand'],
  ['CART split tie', 'lower feature index, then lower threshold, compared exactly', 'a random feature order (scikit-learn random_state)', 'the same data give the same tree'],
  ['CART zero-decrease split', 'refused: the node stays a leaf', 'allowed (scikit-learn)', 'a split that separates nothing is not a split'],
  ['one-to-one matching', 'maximum rows matched, first mapping on ties', 'greedy, cluster by cluster', 'the optimum is unique in count and stated in order'],
  ['ARI of two labellings that each put every row in one cluster', '1', 'no value (the formula divides zero by zero)', 'matches scikit-learn'],
]);
w();
w('WHAT IS NOT BUILT. No self-organising map (the Suite\'s older facies code had one that drew from an unseeded generator; it needs its own seeded engine before a course can teach it), no Gaussian mixture, no density clustering (DBSCAN), no spectral clustering, no random forest, no boosting, no neural network, no probability for a predicted facies, no cross-validation (the machine learning course\'s), no filling of a missing log (refused), and no gamma ray normalisation between wells (the data quality course\'s).');
must('the not-built list matches the exports', !Object.keys(CL).some((k) => /som|mixture|dbscan|spectral|forest|boost|proba/i.test(k)), Object.keys(CL).join(','));

/* ============================================================ SECTION 28 */

section('vocabulary', 'Vocabulary this course legislates before a word is written', ['Associate m01', 'Professional m01', 'Expert m01']);
w('Six words in this course carry a narrower meaning than they have in conversation or elsewhere in the academy. The rule for each is binding on every lesson, bank question, key truth and panel.');
w();
table(['word', 'what it can mean elsewhere', 'the rule here'], [
  ['cluster', 'any group', 'a group the engine made without core, numbered from 0; the number is a name and carries no meaning'],
  ['facies', 'any rock description', 'the core facies of a cored row, or a facies predicted from core by kNN or a tree and called predicted. An electrofacies is a cluster read as a rock type, and it takes a facies name only after matching against core'],
  ['standard deviation', 'either divisor', 'name the divisor: the clustering scaler uses the population SD (n); the correlation PCA the sample SD (n - 1)'],
  ['distance', 'any difference', 'Euclidean on the scaled logs unless the text says raw, and quoted with its scaling'],
  ['accuracy', 'any agreement', 'name the rows: the training rows of a tree, a held-out cored well, or (only in this synthetic field) the withheld facies of an uncored well'],
  ['machine learning', 'any automated judgement', 'a method named by what it is: k-means, agglomerative clustering, k nearest neighbours, a CART tree; no lesson calls a method artificial intelligence'],
]);
w();
w('A TIE names its rule: a distance or merge height within the stated band, an exact equality of Gini counts, or a tied vote. No P label is used in this course.');

/* ============================================================ CLOSING CHECKS */

// Every planted structure must have been found by the method named.
T.PLANTED.forEach((p, i) => must(`planted structure ${i} (${p[0]}) is checked by some section`, PLANT_FOUND.get(i) === true, PLANT_FOUND.get(i)));
// Every module the course has must be owned by at least one section.
const allMods = Object.entries(MODULES).flatMap(([tier, mods]) => Object.keys(mods).map((m) => `${tier} ${m}`));
const unowned = allMods.filter((m) => !OWNED.has(m));
must('every module of every tier is owned by at least one section', unowned.length === 0, unowned.join(', ') || 'all owned');
must('every declared section was written', SECTION === ORDER.length, `${SECTION} of ${ORDER.length}`);

must('no unrendered template placeholder reaches the digest', !OUT.some((l) => l.includes('${')), OUT.find((l) => l.includes('${')));
must('no NaN, undefined or Infinity reaches the digest', !OUT.some((l) => /\bNaN\b|\bundefined\b|Infinity/.test(l)), OUT.find((l) => /\bNaN\b|\bundefined\b|Infinity/.test(l)));

const failed = ASSERTS.filter((a) => !a.pass);
if (failed.length) {
  failed.forEach((a) => process.stderr.write(`  FAILED  ${a.claim}\n          ${a.detail}\n`));
  process.stderr.write(`d3_dump: ${ASSERTS.length} assertions, ${failed.length} FAILED. NOTHING WRITTEN.\n`);
  if (process.env.D3_DUMP_PARTIAL) process.stdout.write(`${OUT.join('\n')}\n`);
  process.exit(1);
}
process.stderr.write(`d3_dump: ${ASSERTS.length} label-and-call, measurement and claim assertions run, 0 failed; ${SECTION} sections\n`);
process.stdout.write(`${OUT.join('\n')}\n`);
