// THE D3 TEACHING LAB: Electrofacies.
//
// Every number this lab returns is a return value of the vendored engines
// (packages/engines/engines/dataai/cluster.js, and ml.js where a scaler or a
// classification report is read, sha-identical with petrolord-engines
// 4dfbb29) on the Ekene facies wells, or on the rows a learner types into a
// panel, or arithmetic on engine values where the digest prints the same
// figure and says it is derived. The dataset is ekeneFacies.json beside this
// file, the committed output of the wave's generator
// (tools/course-waves/facies/d3_fields.mjs, seeded through the canonical
// mulberry32), and faciesLab.test.js asserts the copy is byte-identical to
// what the generator produces and that every number a teaching reader returns
// is printed in the teaching digest.
//
// THE LAB NEVER READS THE CAPSTONE. It holds no graded answer, no tolerance and
// no capstone dataset, and panelCapstoneGuard.test.js greps this file, the
// three panels and the learning page for every rendering of all eighteen
// answers and every capstone name and input.
//
// NO REFUSAL MESSAGE IS WRITTEN HERE. A panel that shows a refusal shows the
// engine's own `error` string, so the lesson that quotes it and the panel agree.
//
// Nothing here reads a clock, a random number or a locale. The only random
// draws are the engine's own seeded k-means++ starts and silhouette samples.
import * as CL from '@petrolord/engines/engines/dataai/cluster.js';
import * as ML from '@petrolord/engines/engines/dataai/ml.js';
import DATA from './ekeneFacies.json';

export const DATASET = DATA;
export const DEFAULTS = CL.DEFAULTS;

/* ------------------------------------------------ what a learner can type */

/** A single number from a text box; a blank box is undefined, never zero. */
export const parseNumber = (text) => {
  if (text === '' || text === null || text === undefined) return undefined;
  const v = Number(text);
  return Number.isFinite(v) ? v : NaN;
};

/** A comma, space or newline separated list of labels: numbers stay numbers, anything else is a name. */
export const parseLabels = (text) => {
  if (typeof text !== 'string' || text.trim() === '') return { error: 'the list is empty' };
  const parts = text.split(/[\s,;]+/).filter((p) => p !== '');
  const allNum = parts.every((p) => Number.isFinite(Number(p)));
  return { values: parts.map((p) => (allNum ? Number(p) : p)) };
};

/** A list of names (logs or wells), separated by commas, spaces or new lines. */
export const parseNames = (text) => (typeof text === 'string' ? text.split(/[\s,]+/).map((s) => s.trim()).filter((s) => s !== '') : []);

const TEXT_COLUMNS = ['well', 'FACIES'];

/**
 * A table as a learner types or pastes it: the first line names the columns,
 * then one row per line, cells separated by commas, tabs or spaces. A column
 * named `well` holds the well name and a column named `FACIES` the core facies
 * (text); every other cell must be a number. null or a dash is a missing value,
 * which the engine then refuses by name. Returns { columns, rows } or { error }.
 */
export const parseTable = (text) => {
  if (typeof text !== 'string' || text.trim() === '') return { error: 'the table is empty' };
  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l !== '');
  const split = (l) => l.split(/[\s,;\t]+/).filter((c) => c !== '');
  const columns = split(lines[0]);
  if (columns.length < 2) return { error: 'the first line must name at least two columns' };
  if (new Set(columns).size !== columns.length) return { error: 'a column name is repeated in the first line' };
  const rows = [];
  for (let i = 1; i < lines.length; i += 1) {
    const cells = split(lines[i]);
    if (cells.length !== columns.length) return { error: `line ${i + 1} holds ${cells.length} cells for ${columns.length} columns` };
    const row = {};
    for (let j = 0; j < columns.length; j += 1) {
      const c = cells[j];
      const missing = /^(null|nan|-)$/i.test(c);
      if (TEXT_COLUMNS.includes(columns[j])) { row[columns[j]] = missing ? null : c; continue; }
      const v = missing ? null : Number(c);
      if (v !== null && !Number.isFinite(v)) return { error: `line ${i + 1}, column ${columns[j]}: ${c} is not a number` };
      row[columns[j]] = v;
    }
    rows.push(row);
  }
  if (!rows.length) return { error: 'the table has a header and no rows' };
  return { columns, rows };
};

/** Picks feature columns as the engine's X; a missing value passes through for the engine to refuse. */
export const matrixOf = (rows, features) => rows.map((r) => features.map((f) => (r[f] === undefined ? null : r[f])));

/** Rows of the Ekene dataset as the text a panel starts from. */
export const tableText = (rows, columns) => [columns.join(', '), ...rows.map((r) => columns.map((c) => (r[c] === null || r[c] === undefined ? 'null' : String(r[c]))).join(', '))].join('\n');

// The interactive routes are the engine's own functions, unchanged: a panel
// passes what the learner typed and shows what the engine returned, refusals
// included.
export const pcaOf = (args) => CL.pca(args);
export const pcaTransformOf = (args) => CL.pcaTransform(args);
export const kmeansOf = (args) => CL.kmeans(args);
export const assignOf = (args) => CL.assignClusters(args);
export const silhouetteOf = (args) => CL.silhouette(args);
export const elbowOf = (args) => CL.elbow(args);
export const agglomerativeOf = (args) => CL.agglomerative(args);
export const cutTreeOf = (args) => CL.cutTree(args);
export const knnOf = (args) => CL.knnClassify(args);
export const cartFitOf = (args) => CL.cartFit(args);
export const cartPredictOf = (args) => CL.cartPredict(args);
export const ariOf = (args) => CL.adjustedRandIndex(args);
export const matchOf = (args) => CL.matchClusters(args);
export const standardScalerOf = (args) => ML.fitStandardScaler(args);
export const minMaxScalerOf = (args) => ML.fitMinMaxScaler(args);
export const applyScalerOf = (args) => ML.applyScaler(args);
export const reportOf = (args) => ML.classificationReport(args);

const pick = (a, idx) => idx.map((i) => a[i]);

/**
 * A facies predicted for held-out rows, every step an engine call: kNN or a
 * CART tree trained on the rows of the training wells, the held-out rows
 * predicted, and, where their core facies is known, scored by the machine
 * learning engine's classificationReport. Returns each result or the first
 * refusal.
 */
export const predictHeldOut = ({ rows, features, heldWells, method = 'knn', k = 5, scale = 'standard', maxDepth, minSamplesLeaf }) => {
  const held = new Set(heldWells);
  const tr = rows.filter((r) => !held.has(r.well));
  const te = rows.filter((r) => held.has(r.well));
  const X = matrixOf(tr, features);
  const y = tr.map((r) => (r.FACIES === undefined ? null : r.FACIES));
  const Xnew = matrixOf(te, features);
  let predictions;
  let model = null;
  if (method === 'tree') {
    model = CL.cartFit({ X, y, names: features, ...(maxDepth === undefined ? {} : { maxDepth }), ...(minSamplesLeaf === undefined ? {} : { minSamplesLeaf }) });
    if (model.error) return { refusal: model };
    const p = CL.cartPredict({ model, X: Xnew });
    if (p.error) return { model, refusal: p };
    predictions = p.predictions;
  } else {
    const r = CL.knnClassify({ X, y, Xnew, k, scale, names: features });
    if (r.error) return { refusal: r };
    model = r;
    predictions = r.predictions;
  }
  const truth = te.map((r) => r.FACIES);
  const known = truth.every((f) => f !== null && f !== undefined);
  const report = known && te.length ? ML.classificationReport({ yTrue: truth, yPred: predictions }) : null;
  return { trainRows: tr.length, testRows: te.length, model, predictions, report: report && !report.error ? report : null };
};

/**
 * New rows against the training range: min-max scaling fitted on the training
 * rows, applied unchanged. A scaled value above 1 or below 0 is outside.
 */
export const rangeCheck = ({ trainRows, newRows, features }) => {
  const mm = ML.fitMinMaxScaler({ X: matrixOf(trainRows, features), names: features });
  if (mm.error) return { refusal: mm };
  const s = ML.applyScaler({ scaler: mm, X: matrixOf(newRows, features) });
  if (s.error) return { refusal: s };
  const col = (j) => s.X.map((r) => r[j]);
  return {
    min: mm.min, max: mm.max,
    features: features.map((f, j) => ({ feature: f, lowest: Math.min(...col(j)), highest: Math.max(...col(j)), above: col(j).filter((v) => v > 1).length, below: col(j).filter((v) => v < 0).length })),
  };
};

/* ------------------------------------------------- the teaching readers */

const LOGS = ['GR', 'RHOB', 'NPHI', 'PEF'];
const LOGS_C = [...LOGS, 'CALI'];
const X = (rows, feats = LOGS) => rows.map((r) => feats.map((f) => r[f]));
const ROWS = DATA.rows;
const CORED = ROWS.filter((r) => r.FACIES !== null);
const XC = X(CORED);
const XC5 = X(CORED, LOGS_C);
const YC = CORED.map((r) => r.FACIES);
const GC = CORED.map((r) => r.well);
const UNCORED = ['EKENE-7', 'EKENE-8'];
const R7 = ROWS.filter((r) => r.well === UNCORED[0]);
const R8 = ROWS.filter((r) => r.well === UNCORED[1]);
const K4 = 4;
const SEED = 3;
const HELD = 'EKENE-6';
const TRI = GC.map((g, i) => (g !== HELD ? i : -1)).filter((i) => i >= 0);
const TEI = GC.map((g, i) => (g === HELD ? i : -1)).filter((i) => i >= 0);
const acc = (t, p) => ML.classificationReport({ yTrue: t, yPred: p }).accuracy;

export const TEACHING = Object.freeze({ logs: LOGS, k: K4, seed: SEED, heldOut: HELD, uncored: UNCORED, knnK: 5 });
export const coredTableText = () => tableText(CORED, ['well', 'GR', 'RHOB', 'NPHI', 'PEF', 'CALI', 'FACIES']);
export const coredLogsText = () => tableText(CORED, ['well', 'GR', 'RHOB', 'NPHI', 'PEF']);
export const uncoredTableText = (well = UNCORED[0]) => tableText(ROWS.filter((r) => r.well === well), ['well', 'GR', 'RHOB', 'NPHI', 'PEF', 'CALI']);
export const coreFaciesText = () => YC.join(', ');

const KM = () => CL.kmeans({ X: XC, k: K4, seed: SEED, names: LOGS });

/** Associate: the scalers fitted on the cored rows, and the first uncored well under the min-max scaler. */
export const scalingReader = () => {
  const sc = ML.fitStandardScaler({ X: XC, names: LOGS });
  const sm = ML.fitStandardScaler({ X: XC, names: LOGS, sd: 'sample' });
  const mm = ML.fitMinMaxScaler({ X: XC, names: LOGS });
  const s7 = ML.applyScaler({ scaler: mm, X: X(R7) }).X;
  return LOGS.map((f, j) => ({
    log: f, centre: sc.centre[j], scale: sc.scale[j], sampleScale: sm.scale[j], min: mm.min[j], max: mm.max[j], range: mm.scale[j],
    newWellLowest: Math.min(...s7.map((r) => r[j])), newWellHighest: Math.max(...s7.map((r) => r[j])),
  }));
};

/** Associate: every cored row's nearest other cored row, raw and standardised, counted by facies. */
export const distanceReader = () => {
  const same = (scale) => {
    const r = CL.knnClassify({ X: XC, y: YC, Xnew: XC, k: 2, scale });
    return r.neighbours.map((nb, i) => (nb[0] === i ? nb[1] : nb[0])).filter((j, i) => YC[j] === YC[i]).length;
  };
  const raw = same('none'); const std = same('standard');
  return { rows: XC.length, raw: { same: raw, other: XC.length - raw }, standard: { same: std, other: XC.length - std } };
};

/** Associate: the correlation PCA of the cored rows, and the first uncored well projected on two components. */
export const pcaReader = () => {
  const p = CL.pca({ X: XC, names: LOGS });
  const p2 = CL.pca({ X: XC, names: LOGS, nComponents: 2 });
  const t = CL.pcaTransform({ model: p2, X: X(R7) });
  return {
    correlation: p.covarianceMatrix, eigenvalues: p.eigenvalues, ratio: p.explainedVarianceRatio, cumulative: p.cumulativeRatio,
    components: p.components, loadings: p.loadings.slice(0, 2), firstScores: p.scores.slice(0, 3), newWellScores: t.scores.slice(0, 3),
  };
};

/** Associate: one k-means start pass by pass, the ten starts, and one start against ten seed by seed. */
export const kmeansReader = () => {
  const one = CL.kmeans({ X: XC, k: K4, seed: SEED, nInit: 1, names: LOGS });
  const ten = KM();
  return {
    startingRows: one.initialRows,
    trace: one.trace.map((t) => ({ pass: t.pass, inertia: t.inertia, changed: t.changed })),
    oneStart: { inertia: one.inertia, sizes: one.sizes, centres: one.centres },
    starts: ten.runs.map((r) => ({ run: r.run, inertia: r.inertia, iterations: r.iterations })),
    teaching: { inertia: ten.inertia, sizes: ten.sizes, centresOriginal: ten.centresOriginal },
    bySeed: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => ({
      seed: s, one: CL.kmeans({ X: XC, k: K4, seed: s, nInit: 1 }).inertia, ten: CL.kmeans({ X: XC, k: K4, seed: s }).inertia,
    })),
  };
};

/** Associate: the covariance PCA, and k-means on raw and min-max scaled logs beside the standard one. */
export const covarianceReader = () => {
  const p = CL.pca({ X: XC, names: LOGS, matrix: 'covariance' });
  const run = (scale) => { const k = CL.kmeans({ X: XC, k: K4, seed: SEED, scale, names: LOGS }); return { inertia: k.inertia, sizes: k.sizes, centresOriginal: k.centresOriginal }; };
  return { eigenvalues: p.eigenvalues, ratio: p.explainedVarianceRatio, components: p.components, raw: run('none'), minmax: run('minmax') };
};

/** Professional: the elbow, k 1 to 8 at the teaching seed, with the silhouette. */
export const elbowReader = () => CL.elbow({ X: XC, kMin: 1, kMax: 8, seed: SEED, names: LOGS, withSilhouette: true }).table
  .map((r) => ({ k: r.k, inertia: r.inertia, drop: r.drop, dropFraction: r.dropFraction, iterations: r.iterations, silhouette: r.silhouette }));

/** Professional: the silhouette of the teaching clusters and of the core facies, cluster by cluster. */
export const silhouetteReader = () => {
  const sk = CL.silhouette({ X: XC, labels: KM().labels, names: LOGS });
  const sf = CL.silhouette({ X: XC, labels: YC, names: LOGS });
  return {
    clusters: { mean: sk.mean, perCluster: sk.perCluster.map((c) => ({ label: c.label, size: c.size, mean: c.mean })) },
    facies: { mean: sf.mean, perCluster: sf.perCluster.map((c) => ({ size: c.size, mean: c.mean })) },
  };
};

/** Professional: Ward, complete and average linkage cut at four, the Ward merges either end, and the re-cuts. */
export const agglomerativeReader = () => {
  const link = (linkage) => CL.agglomerative({ X: XC, linkage, k: K4, names: LOGS });
  const w = link('ward');
  const lm = w.linkageMatrix;
  return {
    cuts: ['ward', 'complete', 'average'].map((l) => { const a = link(l); return { linkage: l, below: a.cutHeights.below, above: a.cutHeights.above }; }),
    wardFirst: lm.slice(0, 5).map((r) => ({ height: r[2], size: r[3] })),
    wardLast: lm.slice(-5).map((r) => ({ height: r[2], size: r[3] })),
    recut: [2, 3, 4, 5, 6].map((k) => ({ k, undoneFirst: lm[lm.length + 1 - k][2] })),
  };
};

/** Professional: the teaching clusters matched to core one to one, and five clusters by majority. */
export const matchReader = () => {
  const m = CL.matchClusters({ yTrue: YC, clusters: KM().labels });
  const m5 = CL.matchClusters({ yTrue: YC, clusters: CL.kmeans({ X: XC, k: 5, seed: SEED, names: LOGS }).labels, mode: 'majority' });
  return {
    contingency: m.contingency, matchedRows: m.matchedRows, accuracy: m.report.accuracy, macroF1: m.report.macro.f1,
    perClass: m.report.perClass.map((c) => ({ precision: c.precision, recall: c.recall, f1: c.f1 })),
    majority: { accuracy: m5.report.accuracy, macroF1: m5.report.macro.f1 },
  };
};

/** Professional: the adjusted Rand index of each labelling against the core facies. */
export const ariReader = () => {
  const ag = (linkage) => CL.agglomerative({ X: XC, linkage, k: K4, names: LOGS }).labels;
  const ari = (b) => CL.adjustedRandIndex({ a: YC, b }).ari;
  return { kmeans: ari(KM().labels), ward: ari(ag('ward')), complete: ari(ag('complete')), average: ari(ag('average')), wells: ari(GC) };
};

/** Expert: kNN with EKENE-6 held out: the scaler, the first row's neighbours, and the accuracy by k. */
export const knnReader = () => {
  const r = CL.knnClassify({ X: pick(XC, TRI), y: pick(YC, TRI), Xnew: pick(XC, TEI), k: 5, names: LOGS });
  const yte = pick(YC, TEI);
  return {
    trainRows: TRI.length, testRows: TEI.length, centre: r.scaler.centre, scale: r.scaler.scale,
    firstNeighbours: r.neighbours[0], firstDistances: r.distances[0],
    accuracy: acc(yte, r.predictions),
    byK: [1, 3, 5, 7, 9, 15].map((k) => ({ k, accuracy: acc(yte, CL.knnClassify({ X: pick(XC, TRI), y: pick(YC, TRI), Xnew: pick(XC, TEI), k, names: LOGS }).predictions) })),
    rawAccuracy: acc(yte, CL.knnClassify({ X: pick(XC, TRI), y: pick(YC, TRI), Xnew: pick(XC, TEI), k: 5, scale: 'none' }).predictions),
  };
};

/** Expert: the five-channel tree on the cored rows, its split nodes, and the depth sweep with EKENE-6 held out. */
export const cartReader = () => {
  const t = CL.cartFit({ X: XC5, y: YC, names: LOGS_C });
  const yte = pick(YC, TEI);
  return {
    nodes: t.nNodes, leaves: t.nLeaves, trainingAccuracy: t.trainingAccuracy, importances: t.featureImportances, printed: t.printed,
    splits: t.nodes.filter((d) => !d.leaf).map((d) => ({ id: d.id, depth: d.depth, n: d.n, gini: d.gini, threshold: d.threshold, decrease: d.impurityDecrease })),
    byDepth: [0, 1, 2, 3, 4, 5, 6].map((d) => {
      const full = CL.cartFit({ X: XC5, y: YC, names: LOGS_C, maxDepth: d });
      const h = CL.cartFit({ X: pick(XC5, TRI), y: pick(YC, TRI), names: LOGS_C, maxDepth: d });
      return { maxDepth: d, nodes: full.nNodes, leaves: full.nLeaves, trainingAccuracy: full.trainingAccuracy, heldOut: acc(yte, CL.cartPredict({ model: h, X: pick(XC5, TEI) }).predictions) };
    }),
  };
};

/** Expert: the root tie between NPHI and PEF, in both column orders. */
export const tieReader = () => {
  const a = CL.cartFit({ X: XC, y: YC, names: LOGS, maxDepth: 1 }).nodes[0];
  const b = CL.cartFit({ X: XC.map((r) => [r[0], r[1], r[3], r[2]]), y: YC, names: ['GR', 'RHOB', 'PEF', 'NPHI'], maxDepth: 1 }).nodes[0];
  return [{ feature: a.feature, threshold: a.threshold, decrease: a.impurityDecrease }, { feature: b.feature, threshold: b.threshold, decrease: b.impurityDecrease }];
};

/** Expert: the uncored wells predicted from every cored row, and the range check of the second. */
export const uncoredReader = () => {
  const t = CL.cartFit({ X: XC5, y: YC, names: LOGS_C });
  const well = (rows) => {
    const kn = CL.knnClassify({ X: XC, y: YC, Xnew: X(rows), k: 5, names: LOGS });
    const tr = CL.cartPredict({ model: t, X: X(rows, LOGS_C) });
    return { agree: kn.predictions.filter((p, i) => p === tr.predictions[i]).length };
  };
  const mm = ML.fitMinMaxScaler({ X: XC, names: LOGS });
  const s8 = ML.applyScaler({ scaler: mm, X: X(R8) }).X.map((r) => r[0]);
  return { first: well(R7), second: well(R8), secondAbove: s8.filter((v) => v > 1).length, secondHighest: Math.max(...s8) };
};

/** A few refusals the panels show on the Ekene data, each the engine's own words. */
export const refusalSamples = () => {
  const e1 = ROWS.filter((r) => r.well === 'EKENE-1');
  const flat = e1.map((r) => [r.GR, 8.5]);
  return [
    { fn: 'kmeans', what: 'a caliper that never changes', r: CL.kmeans({ X: flat, k: 2, seed: SEED, names: ['GR', 'CALI'] }) },
    { fn: 'kmeans', what: 'no seed', r: CL.kmeans({ X: XC, k: K4, names: LOGS }) },
    { fn: 'matchClusters', what: 'five clusters, four facies, one-to-one', r: CL.matchClusters({ yTrue: YC, clusters: CL.kmeans({ X: XC, k: 5, seed: SEED }).labels }) },
    { fn: 'cartFit', what: 'a negative depth', r: CL.cartFit({ X: XC, y: YC, maxDepth: -1 }) },
  ].map(({ fn, what, r }) => ({ fn, what, error: r.error, field: r.field }));
};
