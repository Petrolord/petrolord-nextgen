// THE D2 TEACHING LAB: Machine Learning on Well Data.
//
// Every number this lab returns is a return value of the vendored engine
// (packages/engines/engines/dataai/ml.js, sha-identical with petrolord-engines
// 966bb9e) on the Ekene teaching wells, or on the rows a learner types into a
// panel, or the arithmetic mean of engine values where the digest prints the
// same mean and says it is derived. The dataset is ekeneWells.json beside this
// file, the committed output of the wave's generator
// (tools/course-waves/mlcore/d2_fields.mjs, seeded through the canonical
// mulberry32), and mlcoreLab.test.js asserts the copy is deep-equal to what the
// generator produces and that every number a teaching reader returns is
// printed in the teaching digest.
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
// draws are the engine's own seeded shuffles.
import * as ML from '@petrolord/engines/engines/dataai/ml.js';
import DATA from './ekeneWells.json';

export const DATASET = DATA;
export const DEFAULTS = ML.DEFAULTS;
export const METRICS = ML.METRICS;

/* ------------------------------------------------ what a learner can type */

/** A single number from a text box; a blank box is undefined, never zero. */
export const parseNumber = (text) => {
  if (text === '' || text === null || text === undefined) return undefined;
  const v = Number(text);
  return Number.isFinite(v) ? v : NaN;
};

/** A comma, space or newline separated list of numbers. null or a dash is a missing value. */
export const parseSeries = (text) => {
  if (typeof text !== 'string' || text.trim() === '') return { error: 'the list is empty' };
  const parts = text.split(/[\s,;]+/).filter((p) => p !== '');
  const values = parts.map((p) => (/^(null|nan|-)$/i.test(p) ? null : Number(p)));
  const bad = parts.filter((p, i) => values[i] !== null && !Number.isFinite(values[i]));
  if (bad.length) return { error: `these entries are not numbers: ${bad.join(', ')}` };
  return { values };
};

/** A list of names (well names), one per line or separated by commas. */
export const parseNames = (text) => (typeof text === 'string' ? text.split(/[\n,]+/).map((s) => s.trim()).filter((s) => s !== '') : []);

/**
 * A table as a learner types or pastes it: the first line names the columns,
 * then one row per line, cells separated by commas, tabs or spaces. A column
 * named `well` holds text (the group); every other cell must be a number, or
 * null or a dash for a missing value, which the engine then refuses by name.
 * Returns { columns, rows } with rows as objects, or { error }.
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
      if (columns[j] === 'well') { row.well = c; continue; }
      const v = /^(null|nan|-)$/i.test(c) ? null : Number(c);
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

/** Rows of the Ekene dataset as the text a panel starts from. Well-level attributes are joined in. */
export const tableText = (rows, columns) => {
  const W = Object.fromEntries(DATA.wells.map((w) => [w.id, w]));
  const cell = (r, c) => {
    const v = c in r ? r[c] : W[r.well][c];
    return v === null ? 'null' : String(v);
  };
  return [columns.join(', '), ...rows.map((r) => columns.map((c) => cell(r, c)).join(', '))].join('\n');
};

// The interactive routes are the engine's own functions, unchanged: a panel
// passes what the learner typed and shows what the engine returned, refusals
// included.
export const standardScalerOf = (args) => ML.fitStandardScaler(args);
export const minMaxScalerOf = (args) => ML.fitMinMaxScaler(args);
export const applyScalerOf = (args) => ML.applyScaler(args);
export const groupSplitOf = (args) => ML.groupSplit(args);
export const groupKFoldOf = (args) => ML.groupKFold(args);
export const randomRowSplitOf = (args) => ML.randomRowSplit(args);
export const olsOf = (args) => ML.ols(args);
export const ridgeOf = (args) => ML.ridge(args);
export const logisticOf = (args) => ML.logistic(args);
export const predictOf = (args) => ML.predict(args);
export const regressionMetricsOf = (args) => ML.regressionMetrics(args);
export const confusionOf = (args) => ML.confusionMatrix(args);
export const reportOf = (args) => ML.classificationReport(args);
export const rocOf = (args) => ML.rocCurve(args);
export const logLossOf = (args) => ML.logLoss(args);
export const importanceOf = (args) => ML.permutationImportance(args);
export const learningCurveOf = (args) => ML.learningCurve(args);
export const leakageOf = (args) => ML.leakageDemo(args);

const pick = (a, idx) => idx.map((i) => a[i]);

/**
 * Fits a model on the rows of the training wells and scores it on the rest,
 * every step an engine call: groupSplit, then ols, ridge or logistic, then
 * predict and a metric. Returns each engine result, or the first refusal.
 */
export const fitAndScore = ({ rows, features, target, kind = 'ols', lambda, l2, testFraction, nTestGroups, seed }) => {
  const X = matrixOf(rows, features);
  const y = rows.map((r) => (r[target] === undefined ? null : r[target]));
  const groups = rows.map((r) => r.well);
  const split = ML.groupSplit({ groups, testFraction, nTestGroups, seed });
  if (split.error) return { refusal: split };
  const Xtr = pick(X, split.trainIndices); const ytr = pick(y, split.trainIndices);
  const Xte = pick(X, split.testIndices); const yte = pick(y, split.testIndices);
  let model;
  if (kind === 'ridge') model = ML.ridge({ X: Xtr, y: ytr, lambda, names: features });
  else if (kind === 'logistic') model = ML.logistic({ X: Xtr, y: ytr, names: features, l2: l2 ?? 0 });
  else model = ML.ols({ X: Xtr, y: ytr, names: features });
  if (model.error) return { split, refusal: model };
  const pred = ML.predict({ model, X: Xte });
  if (pred.error) return { split, model, refusal: pred };
  if (kind === 'logistic') {
    const report = ML.classificationReport({ yTrue: yte, yPred: pred.classes });
    const roc = ML.rocCurve({ yTrue: yte, scores: pred.values });
    const loss = ML.logLoss({ yTrue: yte, probabilities: pred.values });
    return { split, model, pred, report, roc, loss };
  }
  const test = ML.regressionMetrics({ yTrue: yte, yPred: pred.values });
  const train = ML.regressionMetrics({ yTrue: ytr, yPred: ML.predict({ model, X: Xtr }).values });
  return { split, model, pred, test, train };
};

/**
 * Cross-validation by wells: groupKFold, then the model fitted on each fold's
 * training wells and scored on its test wells. The mean over the folds is the
 * arithmetic mean of the engine's fold scores, as the digest prints it.
 */
export const crossValidate = ({ rows, features, target, k, seed, kind = 'ols', lambda, metric = 'rmse' }) => {
  const X = matrixOf(rows, features);
  const y = rows.map((r) => (r[target] === undefined ? null : r[target]));
  const kf = ML.groupKFold({ groups: rows.map((r) => r.well), k, seed });
  if (kf.error) return { refusal: kf };
  const folds = [];
  for (let f = 0; f < kf.folds.length; f += 1) {
    const fo = kf.folds[f];
    const Xtr = pick(X, fo.trainIndices); const ytr = pick(y, fo.trainIndices);
    const model = kind === 'ridge' ? ML.ridge({ X: Xtr, y: ytr, lambda, names: features }) : ML.ols({ X: Xtr, y: ytr, names: features });
    if (model.error) return { refusal: model, fold: fo.fold };
    const pr = ML.predict({ model, X: pick(X, fo.testIndices) });
    const m = ML.regressionMetrics({ yTrue: pick(y, fo.testIndices), yPred: pr.values });
    if (m.error) return { refusal: m, fold: fo.fold };
    folds.push({ fold: fo.fold, testGroups: fo.testGroups, rows: fo.testIndices.length, score: m[metric] });
  }
  return { folds, order: kf.order, mean: folds.reduce((a, f) => a + f.score, 0) / folds.length };
};

/**
 * A log predicted for a new well: ridge (lambda 0 is least squares) fitted on
 * every training row, the new rows predicted, and each feature of the new rows
 * checked against the training range by min-max scaling fitted on the
 * training rows. A scaled value above 1 or below 0 is outside the range.
 */
export const predictNewWell = ({ trainRows, newRows, features, target, lambda = 0 }) => {
  const X = matrixOf(trainRows, features);
  const y = trainRows.map((r) => (r[target] === undefined ? null : r[target]));
  const model = ML.ridge({ X, y, lambda, names: features });
  if (model.error) return { refusal: model };
  const Xn = matrixOf(newRows, features);
  const pred = ML.predict({ model, X: Xn });
  if (pred.error) return { refusal: pred };
  const mm = ML.fitMinMaxScaler({ X, names: features });
  if (mm.error) return { refusal: mm };
  const scaled = ML.applyScaler({ scaler: mm, X: Xn });
  if (scaled.error) return { refusal: scaled };
  const outside = features.map((f, j) => ({ feature: f, above: scaled.X.filter((r) => r[j] > 1).length, below: scaled.X.filter((r) => r[j] < 0).length }));
  const flagged = scaled.X.map((r, i) => (r.some((v) => v > 1 || v < 0) ? i : -1)).filter((i) => i >= 0);
  return { model, values: pred.values, min: mm.min, max: mm.max, outside, flagged };
};

/* ------------------------------------------------- the teaching readers */

const W = Object.fromEntries(DATA.wells.map((w) => [w.id, w]));
const X = (rows, feats) => rows.map((r) => feats.map((f) => (f in r ? r[f] : W[r.well][f])));
const LOGS = ['GR', 'RHOB', 'NPHI'];
const LOGS_C = ['GR', 'RHOB', 'NPHI', 'CALI'];
const ATTRS = ['easting', 'northing', 'kb', 'mudWeight'];
const FA = [...LOGS, ...ATTRS];
const PAYF = ['RHOB', 'NPHI', 'RT'];
const TF = 0.3;
const SEED = 5;
const ROWS = DATA.rows;
const SONIC = ROWS.filter((r) => r.DT !== null);
const G9 = SONIC.map((r) => r.well);
const Y9 = SONIC.map((r) => r.DT);
const XL9 = X(SONIC, LOGS);
const XA9 = X(SONIC, FA);
const XC9 = X(SONIC, LOGS_C);
const G10 = ROWS.map((r) => r.well);
const PAY10 = ROWS.map((r) => r.PAY);
const XP10 = X(ROWS, PAYF);
const NOS = ROWS.filter((r) => r.DT === null);
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;

export const TEACHING = Object.freeze({ testFraction: TF, seed: SEED, logs: LOGS, attributes: ATTRS, payFeatures: PAYF });
export const sonicTableText = () => tableText(SONIC, ['well', 'GR', 'RHOB', 'NPHI', 'CALI', 'DT']);
export const attributeTableText = () => tableText(SONIC, ['well', 'GR', 'RHOB', 'NPHI', ...ATTRS, 'DT']);
export const payTableText = () => tableText(ROWS, ['well', 'RHOB', 'NPHI', 'RT', 'PAY']);
export const noSonicTableText = () => tableText(NOS, ['well', 'GR', 'RHOB', 'NPHI']);
export const highRtTableText = () => tableText(ROWS.filter((r) => r.RT >= 10), ['well', 'PHIC', 'RT', 'PAY']);
export const sonicWellNames = () => [...new Set(G9)];

/** Associate: the two splits of the sonic rows at the teaching fraction and seed. */
export const splitsReader = () => {
  const rs = ML.randomRowSplit({ groups: G9, testFraction: TF, seed: SEED });
  const gs = ML.groupSplit({ groups: G9, testFraction: TF, seed: SEED });
  return {
    randomRow: { test: rs.testIndices.length, train: rs.trainIndices.length, shared: rs.sharedGroups.length },
    group: { test: gs.testIndices.length, train: gs.trainIndices.length, shared: gs.sharedGroups.length, testGroups: gs.testGroups, order: gs.order },
    bySeed: [1, 2, 3, 4, 5, 6].map((s) => ({ seed: s, testGroups: ML.groupSplit({ groups: G9, testFraction: TF, seed: s }).testGroups })),
  };
};

const GS = () => ML.groupSplit({ groups: G9, testFraction: TF, seed: SEED });

/** Associate: the standard scaler on the training rows and on all rows, and min-max against the no-sonic well. */
export const scalingReader = () => {
  const gs = GS();
  const tr = ML.fitStandardScaler({ X: XL9, trainIndices: gs.trainIndices, names: LOGS });
  const all = ML.fitStandardScaler({ X: XL9, names: LOGS });
  const smp = ML.fitStandardScaler({ X: XL9, trainIndices: gs.trainIndices, names: LOGS, sd: 'sample' });
  const mm = ML.fitMinMaxScaler({ X: XL9, names: LOGS });
  const mm6 = ML.applyScaler({ scaler: mm, X: X(NOS, LOGS) }).X;
  return {
    features: LOGS.map((f, j) => ({
      name: f, centreTrain: tr.centre[j], centreAll: all.centre[j], scaleTrain: tr.scale[j], scaleAll: all.scale[j], scaleSample: smp.scale[j],
      min: mm.min[j], max: mm.max[j], noSonicScaledMax: Math.max(...mm6.map((r) => r[j])), noSonicAbove1: mm6.filter((r) => r[j] > 1).length,
    })),
    nFit: tr.nFit,
  };
};

/** Associate: OLS on the training wells, scored on the test wells. */
export const olsReader = () => {
  const gs = GS();
  const o = ML.ols({ X: pick(XL9, gs.trainIndices), y: pick(Y9, gs.trainIndices), names: LOGS });
  const te = ML.regressionMetrics({ yTrue: pick(Y9, gs.testIndices), yPred: ML.predict({ model: o, X: pick(XL9, gs.testIndices) }).values });
  const trm = ML.regressionMetrics({ yTrue: pick(Y9, gs.trainIndices), yPred: o.fitted });
  return {
    names: o.names, coefficients: o.coefficients, standardErrors: o.standardErrors, tValues: o.tValues,
    n: o.n, p: o.p, dfResidual: o.dfResidual, residualSE: o.residualSE, rSquared: o.rSquared, adjustedRSquared: o.adjustedRSquared,
    train: { rmse: trm.rmse, mae: trm.mae, r2: trm.r2 }, test: { rmse: te.rmse, mae: te.mae, r2: te.r2, referenceMean: te.referenceMean },
  };
};

/** Associate: the mean OLS residual of each sonic well, all nine fitted together (derived means, as the digest prints them). */
export const residualsReader = () => {
  const o = ML.ols({ X: XL9, y: Y9, names: LOGS });
  const ids = [...new Set(G9)].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  return { rSquared: o.rSquared, residualSE: o.residualSE, wells: ids.map((w) => ({ well: w, meanResidual: mean(o.residuals.filter((_, i) => G9[i] === w)) })) };
};

/** Professional: the ridge path on the logs and the attributes. */
export const ridgeReader = () => {
  const gs = GS();
  return [0, 0.1, 1, 10, 100, 1000].map((lambda) => {
    const r = ML.ridge({ X: pick(XA9, gs.trainIndices), y: pick(Y9, gs.trainIndices), lambda, names: FA });
    const m = ML.regressionMetrics({ yTrue: pick(Y9, gs.testIndices), yPred: ML.predict({ model: r, X: pick(XA9, gs.testIndices) }).values });
    return { lambda, edf: r.effectiveDegreesOfFreedom, trainR2: r.rSquared, testRmse: m.rmse, testMae: m.mae };
  });
};

/** Professional: group k-fold, k 3, the fold RMSE of ridge by lambda and the mean over the folds (derived). */
export const kfoldReader = () => {
  const kf = ML.groupKFold({ groups: G9, k: 3, seed: SEED });
  const score = (Xm, lambda) => kf.folds.map((f) => {
    const r = ML.ridge({ X: pick(Xm, f.trainIndices), y: pick(Y9, f.trainIndices), lambda });
    return ML.regressionMetrics({ yTrue: pick(Y9, f.testIndices), yPred: ML.predict({ model: r, X: pick(Xm, f.testIndices) }).values }).rmse;
  });
  const rows = [];
  [['logs', XL9], ['attributes', XA9]].forEach(([features, Xm]) => [0, 0.1, 1, 10, 100, 1000].forEach((lambda) => {
    const folds = score(Xm, lambda);
    rows.push({ features, lambda, folds, mean: mean(folds) });
  }));
  return { folds: kf.folds.map((f) => ({ fold: f.fold, testGroups: f.testGroups })), order: kf.order, rows };
};

/** Professional: the leakage demonstration over twelve seeds, logs alone and with the attributes. */
export const leakageReader = () => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((seed) => {
  const a = ML.leakageDemo({ X: XL9, y: Y9, groups: G9, model: { kind: 'ols' }, testFraction: TF, seed, metric: 'rmse' });
  const b = ML.leakageDemo({ X: XA9, y: Y9, groups: G9, model: { kind: 'ols' }, testFraction: TF, seed, metric: 'rmse' });
  return {
    seed,
    logs: { randomRow: a.randomRow.testScore, group: a.group.testScore, optimism: a.optimism },
    attributes: { randomRow: b.randomRow.testScore, group: b.group.testScore, optimism: b.optimism },
  };
});

/** Professional: logistic on the pay rule, scored on the test wells. */
export const payReader = () => {
  const gp = ML.groupSplit({ groups: G10, testFraction: TF, seed: SEED });
  const lg = ML.logistic({ X: pick(XP10, gp.trainIndices), y: pick(PAY10, gp.trainIndices), names: PAYF });
  const pp = ML.predict({ model: lg, X: pick(XP10, gp.testIndices) });
  const yt = pick(PAY10, gp.testIndices);
  const rep = ML.classificationReport({ yTrue: yt, yPred: pp.classes });
  const roc = ML.rocCurve({ yTrue: yt, scores: pp.values });
  const ll = ML.logLoss({ yTrue: yt, probabilities: pp.values });
  return {
    testGroups: gp.testGroups, names: lg.names, coefficients: lg.coefficients, standardErrors: lg.standardErrors,
    iterations: lg.iterations, deviance: lg.deviance, nullDeviance: lg.nullDeviance,
    matrix: rep.matrix, accuracy: rep.accuracy,
    perClass: rep.perClass.map((c) => ({ label: c.label, tp: c.tp, fp: c.fp, fn: c.fn, support: c.support, precision: c.precision, recall: c.recall, f1: c.f1 })),
    macro: rep.macro, weighted: rep.weighted, auc: roc.auc, points: roc.fpr.length, logLoss: ll.logLoss,
  };
};

/** Expert: conditioning, separation, convergence, importance, the learning curve and the missing log. */
export const diagnoseReader = () => {
  const gs = GS();
  const tr = (feats) => pick(X(SONIC, feats), gs.trainIndices);
  const yTr = pick(Y9, gs.trainIndices);
  const cond = (Xm) => { const o = ML.ols({ X: Xm, y: yTr }); return { raw: o.conditionNumber, scaled: o.scaledConditionNumber }; };
  const hc = ROWS.filter((r) => r.RT >= 10);
  const sep = (l2) => ML.logistic({ X: hc.map((r) => [r.PHIC]), y: hc.map((r) => r.PAY), names: ['PHIC'], l2 }).coefficients[1];
  const gp = ML.groupSplit({ groups: G10, testFraction: TF, seed: SEED });
  const lg = ML.logistic({ X: pick(XP10, gp.trainIndices), y: pick(PAY10, gp.trainIndices), names: PAYF });
  const short = ML.logistic({ X: pick(XP10, gp.trainIndices), y: pick(PAY10, gp.trainIndices), names: PAYF, maxIter: 3 });
  const oc = ML.ols({ X: pick(XC9, gs.trainIndices), y: yTr, names: LOGS_C });
  const pi = ML.permutationImportance({ model: oc, X: pick(XC9, gs.testIndices), y: pick(Y9, gs.testIndices), metric: 'rmse', nRepeats: 5, seed: SEED });
  const lc = ML.learningCurve({ X: XL9, y: Y9, groups: G9, model: { kind: 'ols' }, trainGroupCounts: [1, 2, 3, 4, 5, 6], testFraction: TF, seed: SEED, metric: 'rmse' });
  const rf = ML.ridge({ X: XL9, y: Y9, lambda: 10, names: LOGS });
  const pn = ML.predict({ model: rf, X: X(NOS, LOGS) });
  const mw = ML.regressionMetrics({ yTrue: DATA.withheld.DT, yPred: pn.values });
  return {
    condition: { logs: cond(tr(LOGS)), attributes: cond(tr(FA)) },
    separation: { l2One: sep(1), l2Tenth: sep(0.1), rows: hc.length },
    convergence: { iterations: lg.iterations, rtConverged: lg.coefficients[3], rtAfterThree: short.coefficients[3] },
    importance: pi.importances.map((im) => ({ feature: im.feature, mean: im.mean, sd: im.sd })),
    learningCurve: lc.points.map((p) => ({ wells: p.nGroups, rows: p.nRows, train: p.trainScore, test: p.testScore })),
    missingLog: { well: DATA.withheld.well, rows: pn.values.length, lowest: Math.min(...pn.values), highest: Math.max(...pn.values), rmse: mw.rmse, mae: mw.mae },
  };
};

/** A few refusals the panels show on the Ekene data, each the engine's own words. */
export const refusalSamples = () => {
  const nullRows = ROWS.slice(130, 170);
  return [
    { fn: 'ols', what: 'a null target', r: ML.ols({ X: X(nullRows, LOGS), y: nullRows.map((r) => r.DT), names: LOGS }) },
    { fn: 'groupKFold', what: 'more folds than wells', r: ML.groupKFold({ groups: G9, k: 10, seed: SEED }) },
    { fn: 'logistic', what: 'labels a threshold splits exactly', r: ML.logistic({ X: [[0.1], [0.2], [0.3], [0.4]], y: [0, 0, 1, 1] }) },
    { fn: 'leakageDemo', what: 'no well names', r: ML.leakageDemo({ X: XL9, y: Y9, model: { kind: 'ols' }, testFraction: TF, seed: SEED }) },
  ].map(({ fn, what, r }) => ({ fn, what, error: r.error, field: r.field }));
};
