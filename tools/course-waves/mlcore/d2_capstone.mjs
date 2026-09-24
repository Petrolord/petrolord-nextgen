// THE EIGHTEEN GRADED D2 CAPSTONE ANSWERS, COMPUTED BY THE ENGINE.
//
// Three fields, six graded values each, every one a RETURN VALUE of the
// vendored engines/dataai/ml.js. A gate that restates the formula validates
// nothing, so nothing here computes a coefficient, a score or a scale by its
// own arithmetic: every number is read off an engine result object, and
// discriminate.mjs is where the wrong methods live.
//
//   AKPARA    Associate     a model and its test: a training-row centre and
//                           scale, an OLS coefficient and residual standard
//                           error, the held-out wells' RMSE and R-squared
//   OBORIA    Professional  validating a model: a ridge coefficient, a
//                           whole-well fold, the optimism of a random split,
//                           a logistic coefficient, F1 of pay, test log loss
//   ISUAMA    Expert        refuses, stops, extrapolates: a scaled condition
//                           number, a penalised coefficient on a separated
//                           label, a coefficient after three Newton updates,
//                           a permutation importance, a learning-curve point
//                           and a written-back prediction
//
// The datasets are generated here, deterministically, through the canonical
// mulberry32 and randomNormal of lib/stats on stated seeds that differ from the
// teaching dataset's, with their own well names, sample counts and log
// physics, and every scenario claim the brief will make is asserted.
//
// TWO CARE RULES FROM THE PROGRAMME, both asserted below:
//   * STOPPING RULE. A graded logistic value must not depend on the
//     convergence tolerance: each converged fit is refitted at tol 1e-14 and
//     must agree to a hundredth of the field's tolerance. The three-update
//     field is a stated iterate, asserted to stop by maxIter and never by tol.
//   * SEED. A value that depends on a seed carries its seed as a stated input,
//     and the same call on the next seed must move it by more than ten
//     tolerances, so a learner who drops the seed cannot land on it.
//
// Usage:
//   node d2_capstone.mjs            the human table
//   node d2_capstone.mjs --json     the rows make_fields.mjs writes
//   node d2_capstone.mjs --inputs   the three datasets and their stated
//                                   inputs, for oracle_check.py,
//                                   discriminate.mjs and gate_capstone_leak.mjs
//
// NOTHING HERE READS THE DIGEST OR THE TEACHING DATASET, and the digest
// generator reads nothing here.
import process from 'node:process';

const ROOT = process.env.D2_ENGINES || '/root/wt-dai-d2-nextgen/packages/engines';
const ML = await import(`${ROOT}/engines/dataai/ml.js`);
const { mulberry32, randomNormal } = await import(`${ROOT}/lib/stats/stats.js`);
const TOLPATH = process.env.D2_TOLERANCE
  || '/root/wt-dai-d2-nextgen/src/components/course/panels/mlcore/gradedTolerance.js';
const { GRADED_FIELDS, gradedTolerance, PRINTED_DECIMALS } = await import(TOLPATH);

/* ---------------------------------------------------------- the machinery */

const ASSERTS = [];
const must = (claim, cond, detail) => {
  ASSERTS.push({ claim, pass: !!cond, detail: String(detail) });
  return !!cond;
};
/** A call this file LABELS a success: no error key, and every top-level number finite. */
const success = (label, r) => {
  must(`LABELLED A SUCCESS: ${label}`, !!(r && !r.error), r && r.error ? r.error : 'no error key');
  if (r && !r.error) {
    const bad = Object.entries(r).filter(([, v]) => typeof v === 'number' && !Number.isFinite(v));
    must(`SUCCESS CARRIES NO NON-FINITE NUMBER: ${label}`, bad.length === 0,
      bad.length ? bad.map(([k, v]) => `${k}=${v}`).join(', ') : 'every number finite');
  }
  return r;
};
const r1 = (x) => Math.round(x * 10) / 10;
const r2 = (x) => Math.round(x * 100) / 100;
const r3 = (x) => Math.round(x * 1000) / 1000;
const freeze = (o) => Object.freeze(JSON.parse(JSON.stringify(o)));
const pick = (a, idx) => idx.map((i) => a[i]);

/**
 * One capstone field: nWells wells of nPer samples, the stated physics below,
 * drawn on ONE stream. Every constant differs from the teaching generator's.
 */
const buildField = ({ prefix, seed, nWells, nPer, topBase, dtOffsetSd, shaleTerm, noSonic = null, hotAdd = 0, payPhic, payRt }) => {
  const g = mulberry32(seed);
  const nz = () => randomNormal(g);
  const wells = Array.from({ length: nWells }, (_, w) => ({
    id: `${prefix}-${w + 1}`,
    easting: r2(506 + 5 * g()),
    northing: r2(131 + 4 * g()),
    kb: r1(12 + 16 * g()),
    mudWeight: r1(9.4 + 1.2 * g()),
    top: topBase + 47 * w + Math.round(26 * g()),
    dtOffset: dtOffsetSd * nz(),
  }));
  const rows = [];
  const withheld = [];
  wells.forEach((W) => {
    for (let i = 0; i < nPer; i += 1) {
      const vsh = Math.min(0.9, Math.max(0.03, 0.32 + 0.23 * nz()));
      const phi = Math.max(0.04, 0.29 * (1 - vsh) + 0.028 * nz());
      const gr = r2(24 + 88 * vsh + 4.5 * nz() + (W.id === noSonic ? hotAdd : 0));
      const rhob = r3(2.66 - 1.66 * phi + 0.1 * vsh + 0.014 * nz());
      const nphi = r3(phi + 0.24 * vsh + 0.011 * nz());
      const hc = phi > 0.14 && g() < 0.55;
      const rt = r2(hc ? 10 + 110 * phi * Math.exp(0.28 * nz()) : 1.1 + 2.8 * vsh * Math.exp(0.22 * nz()));
      const cali = r2(8.75 + Math.abs(0.3 * nz()));
      const dt = r1(56 * (1 - phi) + 185 * phi + shaleTerm * vsh + W.dtOffset + 2.2 * nz());
      const phic = r3(phi + 0.018 * nz());
      const pay = phic >= payPhic && rt >= payRt ? 1 : 0;
      if (W.id === noSonic) withheld.push(dt);
      rows.push({ well: W.id, depth: W.top + i, GR: gr, RHOB: rhob, NPHI: nphi, RT: rt, CALI: cali, DT: W.id === noSonic ? null : dt, PHIC: phic, PAY: pay });
    }
  });
  return { wells: wells.map(({ id, easting, northing, kb, mudWeight, top }) => ({ id, easting, northing, kb, mudWeight, top })), rows };
};

const LOGS = ['GR', 'RHOB', 'NPHI'];
const ATTRS = ['easting', 'northing', 'kb', 'mudWeight'];
const Xof = (F, rows, feats) => {
  const W = Object.fromEntries(F.wells.map((w) => [w.id, w]));
  return rows.map((r) => feats.map((f) => (f in r ? r[f] : W[r.well][f])));
};
const sonicOf = (F) => F.rows.filter((r) => r.DT !== null);

/* ========================================================= AKPARA, Associate

   Seven wells, twenty-four samples each, every well with a sonic. The brief
   states the split: groupSplit, test fraction 0.3, seed 11, which holds out
   ceil(0.3 x 7) = 3 wells. */

const AKPARA = freeze({
  field: buildField({ prefix: 'AKPARA', seed: 70111, nWells: 7, nPer: 24, topBase: 6120, dtOffsetSd: 3.6, shaleTerm: 62, payPhic: 0.17, payRt: 11 }),
  stated: { testFraction: 0.3, seed: 11, features: LOGS, target: 'DT' },
});
{
  const F = AKPARA.field; const S = AKPARA.stated;
  const son = sonicOf(F);
  must('Akpara: every row carries a sonic', son.length === F.rows.length, son.length);
}
const akSon = sonicOf(AKPARA.field);
const akX = Xof(AKPARA.field, akSon, LOGS);
const akY = akSon.map((r) => r.DT);
const akG = akSon.map((r) => r.well);
const akSplit = success('Akpara groupSplit', ML.groupSplit({ groups: akG, testFraction: AKPARA.stated.testFraction, seed: AKPARA.stated.seed }));
must('Akpara: the split holds out three wells', akSplit.nTestGroups === 3, akSplit.nTestGroups);
const akSc = success('Akpara fitStandardScaler on the training rows', ML.fitStandardScaler({ X: akX, trainIndices: akSplit.trainIndices, names: LOGS }));
const akOls = success('Akpara ols on the training rows', ML.ols({ X: pick(akX, akSplit.trainIndices), y: pick(akY, akSplit.trainIndices), names: LOGS }));
const akPred = success('Akpara predict the test wells', ML.predict({ model: akOls, X: pick(akX, akSplit.testIndices) }));
const akMet = success('Akpara regressionMetrics on the test wells', ML.regressionMetrics({ yTrue: pick(akY, akSplit.testIndices), yPred: akPred.values }));
must('Akpara: the test R-squared is positive', akMet.r2 > 0, akMet.r2);

/* ======================================================= OBORIA, Professional

   Eight wells, twenty-five samples each, four well-level attributes and a
   stated pay rule (PHIC >= 0.18 and RT >= 12 ohm.m). The brief states: the
   split, groupSplit test fraction 0.25 seed 3 (two test wells); ridge lambda
   20 on the logs and the attributes; groupKFold k 4 seed 3 with OLS on the
   logs; leakageDemo on the logs and the attributes, OLS, RMSE, test fraction
   0.25, seed 3; logistic on RHOB, NPHI and RT over all eight wells, split
   by groupSplit test fraction 0.25 with its own stated seed, 9. */

const OBORIA = freeze({
  field: buildField({ prefix: 'OBORIA', seed: 70222, nWells: 8, nPer: 25, topBase: 9310, dtOffsetSd: 4.2, shaleTerm: 66, payPhic: 0.18, payRt: 12 }),
  stated: { testFraction: 0.25, seed: 3, lambda: 20, k: 4, fold: 2, payFeatures: ['RHOB', 'NPHI', 'RT'], paySeed: 9 },
});
const obS = OBORIA.stated;
const obSon = sonicOf(OBORIA.field);
const obXL = Xof(OBORIA.field, obSon, LOGS);
const obXA = Xof(OBORIA.field, obSon, [...LOGS, ...ATTRS]);
const obY = obSon.map((r) => r.DT);
const obG = obSon.map((r) => r.well);
const obSplit = success('Oboria groupSplit', ML.groupSplit({ groups: obG, testFraction: obS.testFraction, seed: obS.seed }));
must('Oboria: the split holds out two wells', obSplit.nTestGroups === 2, obSplit.nTestGroups);
const obRidge = success('Oboria ridge on the training rows', ML.ridge({ X: pick(obXA, obSplit.trainIndices), y: pick(obY, obSplit.trainIndices), lambda: obS.lambda, names: [...LOGS, ...ATTRS] }));
const obKF = success('Oboria groupKFold', ML.groupKFold({ groups: obG, k: obS.k, seed: obS.seed }));
const obFold = obKF.folds[obS.fold];
const obFoldFit = success('Oboria ols on fold 2 training rows', ML.ols({ X: pick(obXL, obFold.trainIndices), y: pick(obY, obFold.trainIndices), names: LOGS }));
const obFoldMet = success('Oboria fold 2 metrics', ML.regressionMetrics({ yTrue: pick(obY, obFold.testIndices), yPred: ML.predict({ model: obFoldFit, X: pick(obXL, obFold.testIndices) }).values }));
const obLeak = success('Oboria leakageDemo', ML.leakageDemo({ X: obXA, y: obY, groups: obG, model: { kind: 'ols' }, testFraction: obS.testFraction, seed: obS.seed, metric: 'rmse' }));
must('Oboria: the random split flatters the attribute model', obLeak.optimism > 0, obLeak.optimism);
const obAll = OBORIA.field.rows;
const obXP = Xof(OBORIA.field, obAll, obS.payFeatures);
const obP = obAll.map((r) => r.PAY);
const obGP = obAll.map((r) => r.well);
const obPSplit = success('Oboria pay groupSplit', ML.groupSplit({ groups: obGP, testFraction: obS.testFraction, seed: obS.paySeed }));
const obLg = success('Oboria logistic on the training wells', ML.logistic({ X: pick(obXP, obPSplit.trainIndices), y: pick(obP, obPSplit.trainIndices), names: obS.payFeatures }));
must('Oboria: the pay fit converged with no separation', obLg.converged && obLg.separation.type === 'none', `${obLg.converged} ${obLg.separation.type}`);
const obPP = success('Oboria predict the pay test wells', ML.predict({ model: obLg, X: pick(obXP, obPSplit.testIndices) }));
const obYt = pick(obP, obPSplit.testIndices);
const obRep = success('Oboria classificationReport', ML.classificationReport({ yTrue: obYt, yPred: obPP.classes }));
const obF1 = obRep.perClass.find((c) => c.label === 1);
must('Oboria: pay has both a false positive or false negative and true positives', obF1.tp > 0 && obF1.fp + obF1.fn > 0, JSON.stringify(obF1));
const obLL = success('Oboria logLoss', ML.logLoss({ yTrue: obYt, probabilities: obPP.values }));

/* ========================================================== ISUAMA, Expert

   Eight sonic wells and ISUAMA-9 without a sonic (a hot shale of 24 gAPI),
   twenty-five samples each, with a caliper. The brief states: the design of
   the logs and the four attributes on all sonic rows; logistic on PHIC for
   rows with RT at or above 12 with l2 0.5; logistic on RHOB, NPHI, RT with
   maxIter 3 on all rows; permutationImportance of OLS on the logs and CALI
   fitted on the training wells of groupSplit fraction 0.25 seed 9, RMSE on
   the test wells, 5 repeats, seed 9; learningCurve OLS on the logs, fraction
   0.25, seed 9, counts 1 to 6, RMSE; ridge lambda 5 on all sonic rows and the
   first row of ISUAMA-9. */

const ISUAMA = freeze({
  field: buildField({ prefix: 'ISUAMA', seed: 70333, nWells: 9, nPer: 25, topBase: 11240, dtOffsetSd: 3.9, shaleTerm: 58, noSonic: 'ISUAMA-9', hotAdd: 24, payPhic: 0.17, payRt: 12 }),
  stated: { l2: 0.5, rtCut: 12, maxIter: 3, testFraction: 0.25, seed: 9, nRepeats: 5, counts: [1, 2, 3, 4, 5, 6], countIndex: 2, lambda: 5, payFeatures: ['RHOB', 'NPHI', 'RT'] },
});
const isS = ISUAMA.stated;
const isSon = sonicOf(ISUAMA.field);
const isXA = Xof(ISUAMA.field, isSon, [...LOGS, ...ATTRS]);
const isXL = Xof(ISUAMA.field, isSon, LOGS);
const isXC = Xof(ISUAMA.field, isSon, [...LOGS, 'CALI']);
const isY = isSon.map((r) => r.DT);
const isG = isSon.map((r) => r.well);
const isCond = success('Isuama ols on the logs and attributes', ML.ols({ X: isXA, y: isY, names: [...LOGS, ...ATTRS] }));
must('Isuama: the attribute design is fitted at the default limit', isCond.scaledConditionNumber < ML.DEFAULTS.MAX_CONDITION, isCond.scaledConditionNumber);
const isHC = ISUAMA.field.rows.filter((r) => r.RT >= isS.rtCut);
const isSepRefused = ML.logistic({ X: isHC.map((r) => [r.PHIC]), y: isHC.map((r) => r.PAY), names: ['PHIC'] });
must('Isuama: PHIC on the high-RT rows is refused as completely separated', !!isSepRefused.error && /completely separated/.test(isSepRefused.error), isSepRefused.error);
const isSep = success('Isuama logistic PHIC l2', ML.logistic({ X: isHC.map((r) => [r.PHIC]), y: isHC.map((r) => r.PAY), names: ['PHIC'], l2: isS.l2 }));
must('Isuama: the penalised fit converges and reports complete separation', isSep.converged && isSep.separation.type === 'complete', `${isSep.converged} ${isSep.separation.type}`);
const isXP = Xof(ISUAMA.field, ISUAMA.field.rows, isS.payFeatures);
const isP = ISUAMA.field.rows.map((r) => r.PAY);
const is3 = success('Isuama logistic maxIter 3', ML.logistic({ X: isXP, y: isP, names: isS.payFeatures, maxIter: isS.maxIter }));
must('Isuama: the three-update fit stops by maxIter, not by tol', is3.converged === false && is3.iterations === 3 && typeof is3.warning === 'string', `${is3.converged} ${is3.iterations}`);
const isFull = success('Isuama logistic converged', ML.logistic({ X: isXP, y: isP, names: isS.payFeatures }));
must('Isuama: the converged NPHI coefficient differs from the three-update one by over a thousand tolerances', Math.abs(isFull.coefficients[2] - is3.coefficients[2]) > 1000 * 5e-7, `${isFull.coefficients[2]} ${is3.coefficients[2]}`);
const isSplit = success('Isuama groupSplit', ML.groupSplit({ groups: isG, testFraction: isS.testFraction, seed: isS.seed }));
const isOC = success('Isuama ols logs and CALI', ML.ols({ X: pick(isXC, isSplit.trainIndices), y: pick(isY, isSplit.trainIndices), names: [...LOGS, 'CALI'] }));
const isPI = success('Isuama permutationImportance', ML.permutationImportance({ model: isOC, X: pick(isXC, isSplit.testIndices), y: pick(isY, isSplit.testIndices), metric: 'rmse', nRepeats: isS.nRepeats, seed: isS.seed }));
const isNphi = isPI.importances.find((im) => im.feature === 'NPHI');
const isLC = success('Isuama learningCurve', ML.learningCurve({ X: isXL, y: isY, groups: isG, model: { kind: 'ols' }, trainGroupCounts: isS.counts, testFraction: isS.testFraction, seed: isS.seed, metric: 'rmse' }));
const isLC3 = isLC.points[isS.countIndex];
must('Isuama: the learning-curve point is the three-well point', isLC3.nGroups === 3, isLC3.nGroups);
const isRF = success('Isuama ridge on all sonic rows', ML.ridge({ X: isXL, y: isY, lambda: isS.lambda, names: LOGS }));
const isNo = ISUAMA.field.rows.filter((r) => r.DT === null);
must('Isuama: ISUAMA-9 is the no-sonic well with 25 rows', isNo.length === 25 && isNo.every((r) => r.well === 'ISUAMA-9'), isNo.length);
const isPN = success('Isuama predict ISUAMA-9', ML.predict({ model: isRF, X: Xof(ISUAMA.field, isNo, LOGS) }));

/* ---------------------------------------------------------------- the rows */

const ROWS = [
  ['beginner', 'akpara_rhob_train_centre_g_cm3', 'scaler', akSc.centre[1]],
  ['beginner', 'akpara_gr_train_scale_gapi', 'scaler', akSc.scale[0]],
  ['beginner', 'akpara_ols_nphi_coef_us_ft_per_vv', 'coefficient', akOls.coefficients[3]],
  ['beginner', 'akpara_ols_residual_se_us_ft', 'error', akOls.residualSE],
  ['beginner', 'akpara_test_rmse_us_ft', 'error', akMet.rmse],
  ['beginner', 'akpara_test_r2', 'score', akMet.r2],
  ['intermediate', 'oboria_ridge_gr_coef_us_ft_per_gapi', 'coefficient', obRidge.coefficients[1]],
  ['intermediate', 'oboria_fold2_test_rmse_us_ft', 'error', obFoldMet.rmse],
  ['intermediate', 'oboria_leak_optimism_rmse_us_ft', 'error', obLeak.optimism],
  ['intermediate', 'oboria_logistic_rt_coef_per_ohmm', 'coefficient', obLg.coefficients[3]],
  ['intermediate', 'oboria_pay_f1', 'score', obF1.f1],
  ['intermediate', 'oboria_test_log_loss', 'score', obLL.logLoss],
  ['advanced', 'isuama_scaled_condition_attrs', 'condition', isCond.scaledConditionNumber],
  ['advanced', 'isuama_l2_phic_coef_per_vv', 'coefficient', isSep.coefficients[1]],
  ['advanced', 'isuama_nphi_coef_after_three_updates_per_vv', 'coefficient', is3.coefficients[2]],
  ['advanced', 'isuama_perm_nphi_mean_drop_us_ft', 'error', isNphi.mean],
  ['advanced', 'isuama_lc_test_rmse_three_wells_us_ft', 'error', isLC3.testScore],
  ['advanced', 'isuama_pred_dt_first_row_us_ft', 'prediction', isPN.values[0]],
].map(([tier, key, cls, value]) => ({ tier, key, cls, value }));

must('the eighteen rows are the eighteen declared fields, in the declared order and classes',
  JSON.stringify(ROWS.map((r) => [r.tier, r.key, r.cls]))
  === JSON.stringify(GRADED_FIELDS.map(([t, k, c]) => [t, k, c])),
  `${ROWS.length} rows`);
ROWS.forEach((r) => must(`${r.key} is a finite positive number`, Number.isFinite(r.value) && r.value > 0, r.value));
// NEVER GRADE A SMALL INTEGER: a whole number sits inside every guard band.
ROWS.forEach((r) => must(`${r.key} is not a whole number`, Math.abs(r.value - Math.round(r.value)) > 1e-3, r.value));
const byKey = Object.fromEntries(ROWS.map((r) => [r.key, r.value]));

/* ------------------------------------------------ the stopping-rule check */

// Every graded value a CONVERGED logistic fit returns, refitted at tol 1e-14:
// the value must not move by a hundredth of its tolerance.
const tight = [
  ['oboria_logistic_rt_coef_per_ohmm', () => ML.logistic({ X: pick(obXP, obPSplit.trainIndices), y: pick(obP, obPSplit.trainIndices), names: obS.payFeatures, tol: 1e-14 }).coefficients[3]],
  ['oboria_pay_f1', () => {
    const m = ML.logistic({ X: pick(obXP, obPSplit.trainIndices), y: pick(obP, obPSplit.trainIndices), names: obS.payFeatures, tol: 1e-14 });
    const p = ML.predict({ model: m, X: pick(obXP, obPSplit.testIndices) });
    return ML.classificationReport({ yTrue: obYt, yPred: p.classes }).perClass.find((c) => c.label === 1).f1;
  }],
  ['oboria_test_log_loss', () => {
    const m = ML.logistic({ X: pick(obXP, obPSplit.trainIndices), y: pick(obP, obPSplit.trainIndices), names: obS.payFeatures, tol: 1e-14 });
    return ML.logLoss({ yTrue: obYt, probabilities: ML.predict({ model: m, X: pick(obXP, obPSplit.testIndices) }).values }).logLoss;
  }],
  ['isuama_l2_phic_coef_per_vv', () => ML.logistic({ X: isHC.map((r) => [r.PHIC]), y: isHC.map((r) => r.PAY), names: ['PHIC'], l2: isS.l2, tol: 1e-14 }).coefficients[1]],
];
tight.forEach(([key, f]) => {
  const v = f();
  must(`STOPPING RULE: ${key} at tol 1e-14 agrees within a hundredth of its tolerance`, Math.abs(v - byKey[key]) <= gradedTolerance(key) / 100, `${v} vs ${byKey[key]}`);
});
// The three-update field is the same at any tol that the first three steps do not meet.
must('STOPPING RULE: the three-update value is the same at tol 1e-3',
  ML.logistic({ X: isXP, y: isP, names: isS.payFeatures, maxIter: isS.maxIter, tol: 1e-3 }).coefficients[2] === byKey.isuama_nphi_coef_after_three_updates_per_vv, 'identical');
// Every probability that sets F1 sits away from the 0.5 threshold by more
// than float noise, so the class cannot flip on a rounding.
const nearHalf = Math.min(...obPP.values.map((p) => Math.abs(p - 0.5)));
must('F1: no test probability lies within 1e-6 of the 0.5 threshold', nearHalf > 1e-6, nearHalf);

/* ----------------------------------------------------------- the seed check */

// A seeded value on the next seed must move by more than ten tolerances.
const nextSeed = [
  ['akpara_test_rmse_us_ft', () => { const s = ML.groupSplit({ groups: akG, testFraction: AKPARA.stated.testFraction, seed: AKPARA.stated.seed + 1 }); const o = ML.ols({ X: pick(akX, s.trainIndices), y: pick(akY, s.trainIndices) }); return ML.regressionMetrics({ yTrue: pick(akY, s.testIndices), yPred: ML.predict({ model: o, X: pick(akX, s.testIndices) }).values }).rmse; }],
  ['oboria_fold2_test_rmse_us_ft', () => { const f = ML.groupKFold({ groups: obG, k: obS.k, seed: obS.seed + 1 }).folds[obS.fold]; const o = ML.ols({ X: pick(obXL, f.trainIndices), y: pick(obY, f.trainIndices) }); return ML.regressionMetrics({ yTrue: pick(obY, f.testIndices), yPred: ML.predict({ model: o, X: pick(obXL, f.testIndices) }).values }).rmse; }],
  ['oboria_leak_optimism_rmse_us_ft', () => ML.leakageDemo({ X: obXA, y: obY, groups: obG, model: { kind: 'ols' }, testFraction: obS.testFraction, seed: obS.seed + 1, metric: 'rmse' }).optimism],
  ['oboria_test_log_loss', () => {
    const sp = ML.groupSplit({ groups: obGP, testFraction: obS.testFraction, seed: obS.paySeed + 1 });
    const m = ML.logistic({ X: pick(obXP, sp.trainIndices), y: pick(obP, sp.trainIndices), names: obS.payFeatures });
    return ML.logLoss({ yTrue: pick(obP, sp.testIndices), probabilities: ML.predict({ model: m, X: pick(obXP, sp.testIndices) }).values }).logLoss;
  }],
  ['isuama_perm_nphi_mean_drop_us_ft', () => ML.permutationImportance({ model: isOC, X: pick(isXC, isSplit.testIndices), y: pick(isY, isSplit.testIndices), metric: 'rmse', nRepeats: isS.nRepeats, seed: isS.seed + 1 }).importances.find((im) => im.feature === 'NPHI').mean],
  ['isuama_lc_test_rmse_three_wells_us_ft', () => ML.learningCurve({ X: isXL, y: isY, groups: isG, model: { kind: 'ols' }, trainGroupCounts: isS.counts, testFraction: isS.testFraction, seed: isS.seed + 1, metric: 'rmse' }).points[isS.countIndex].testScore],
];
nextSeed.forEach(([key, f]) => {
  const v = f();
  must(`SEED: ${key} on the next seed moves by more than ten tolerances`, Math.abs(v - byKey[key]) > 10 * gradedTolerance(key), `${v} vs ${byKey[key]}`);
});

/* -------------------------------------------------------------- reporting */

const failed = ASSERTS.filter((a) => !a.pass);
if (failed.length) {
  failed.forEach((a) => process.stderr.write(`  FAILED  ${a.claim}\n          ${a.detail}\n`));
  process.stderr.write(`d2_capstone: ${ASSERTS.length} assertions, ${failed.length} FAILED. NOTHING WRITTEN.\n`);
  process.exit(1);
}
process.stderr.write(`d2_capstone: ${ASSERTS.length} label-and-call, scenario, stopping-rule and seed assertions run, 0 failed\n`);

if (process.argv.includes('--json')) {
  process.stdout.write(`${JSON.stringify(ROWS)}\n`);
} else if (process.argv.includes('--inputs')) {
  process.stdout.write(`${JSON.stringify({ AKPARA, OBORIA, ISUAMA })}\n`);
} else {
  const pad = (s, n2) => String(s).padEnd(n2);
  process.stdout.write(`${pad('TIER', 14)}${pad('KEY', 48)}${pad('CLASS', 13)}${pad('VALUE', 20)}TOLERANCE\n`);
  ROWS.forEach((r) => process.stdout.write(
    `${pad(r.tier, 14)}${pad(r.key, 48)}${pad(r.cls, 13)}${pad(r.value.toFixed(PRINTED_DECIMALS[r.cls]), 20)}${gradedTolerance(r.key)}\n`));
}
