// THE DISCRIMINATE SWEEP over every D2 capstone route.
//
// The programme rule: a gate that restates the formula validates nothing. For
// each of the eighteen graded fields, does a PLAUSIBLE WRONG METHOD move it
// past its own ABSOLUTE tolerance? A field no plausible error moves grades
// nothing, whatever its prompt claims to test.
//
// A route is WEAK if fewer than three of the errors aimed at it move it, or if
// any error aimed at it is BLIND (lands inside the tolerance). The closest miss
// is reported in tolerances so "it discriminates" arrives with a margin.
//
// The TRUTH of every route is an engine call, checked against fields.json. The
// wrong methods are the mistakes a learner makes, and most are the ENGINE
// CALLED WRONGLY: the scaler fitted on every row, the sample SD, a random-row
// split, the floor of the test size, the next seed, contiguous folds, lambda
// multiplied by n, the sign of the optimism reversed, the penalty read as
// scikit-learn's C, the converged value quoted for the three-update iterate,
// the learning curve in sorted order, OLS where ridge was stated.
//
//   node discriminate.mjs
//   node discriminate.mjs --slack-tolerances   THE NEGATIVE CONTROL
//
// The control multiplies every tolerance by 1e12 and must report EIGHTEEN WEAK
// ROUTES, proving the sweep reads the tolerances rather than printing a
// constant.
//
// Exit 0 clean, 1 if any route is WEAK, 2 if the sweep could not run.
import fs from 'node:fs';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const HERE = process.env.D2_WAVE_DIR || '/root/dai-wip-mlcore';
const ROOT = process.env.D2_ENGINES || '/root/wt-dai-d2-nextgen/packages/engines';
const ML = await import(`${ROOT}/engines/dataai/ml.js`);
const SLACK = process.argv.includes('--slack-tolerances') ? 1e12 : 1;
const fields = Object.fromEntries(
  JSON.parse(fs.readFileSync(`${HERE}/fields.json`, 'utf8')).map((f) => [f[1], [f[0], f[1], f[2], f[3] * SLACK]]));
if (Object.keys(fields).length !== 18) { console.log('REFUSED: fields.json does not carry eighteen fields'); process.exit(2); }

/* The datasets come from the capstone generator itself, so this file cannot
   drift from it by carrying a second typed copy of any input. */
const inp = JSON.parse(execFileSync('node', [`${HERE}/d2_capstone.mjs`, '--inputs'],
  { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 1e8 }));

/* ---- helpers for the WRONG methods only ---- */
const sum = (a) => a.reduce((x, y) => x + y, 0);
const mean = (a) => sum(a) / a.length;
const median = (a) => { const s = [...a].sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const sdS = (a) => { const m = mean(a); return Math.sqrt(sum(a.map((v) => (v - m) ** 2)) / (a.length - 1)); };
const pick = (a, idx) => idx.map((i) => a[i]);
const LOGS = ['GR', 'RHOB', 'NPHI'];
const ATTRS = ['easting', 'northing', 'kb', 'mudWeight'];
const xof = (F, rows, feats) => { const W = Object.fromEntries(F.wells.map((w) => [w.id, w])); return rows.map((r) => feats.map((f) => (f in r ? r[f] : W[r.well][f]))); };
const idxOf = (groups, set) => groups.map((g, i) => (set.has(g) ? i : -1)).filter((i) => i >= 0);
const olsFitScore = (X, y, tr, te) => {
  const o = ML.ols({ X: pick(X, tr), y: pick(y, tr) });
  return ML.regressionMetrics({ yTrue: pick(y, te), yPred: ML.predict({ model: o, X: pick(X, te) }).values });
};

/* ---- AKPARA ---- */
const AKf = inp.AKPARA.field; const AKs = inp.AKPARA.stated;
const akR = AKf.rows.filter((r) => r.DT !== null);
const akX = xof(AKf, akR, LOGS); const akY = akR.map((r) => r.DT); const akG = akR.map((r) => r.well);
const akSp = ML.groupSplit({ groups: akG, testFraction: AKs.testFraction, seed: AKs.seed });
const akSp2 = ML.groupSplit({ groups: akG, nTestGroups: 2, seed: AKs.seed });
const akRR = ML.randomRowSplit({ groups: akG, testFraction: AKs.testFraction, seed: AKs.seed });
const akTr = pick(akX, akSp.trainIndices);
const akOls = ML.ols({ X: akTr, y: pick(akY, akSp.trainIndices), names: LOGS });
const akTe = ML.regressionMetrics({ yTrue: pick(akY, akSp.testIndices), yPred: ML.predict({ model: akOls, X: pick(akX, akSp.testIndices) }).values });

/* ---- OBORIA ---- */
const OBf = inp.OBORIA.field; const OBs = inp.OBORIA.stated;
const obR = OBf.rows.filter((r) => r.DT !== null);
const obXL = xof(OBf, obR, LOGS); const obXA = xof(OBf, obR, [...LOGS, ...ATTRS]); const obY = obR.map((r) => r.DT); const obG = obR.map((r) => r.well);
const obSp = ML.groupSplit({ groups: obG, testFraction: OBs.testFraction, seed: OBs.seed });
const obRidge = (lam, X = obXA, tr = obSp.trainIndices) => ML.ridge({ X: pick(X, tr), y: pick(obY, tr), lambda: lam });
const obKF = ML.groupKFold({ groups: obG, k: OBs.k, seed: OBs.seed });
const obIds = [...new Set(obG)].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
const foldRmse = (testWells) => { const te = idxOf(obG, new Set(testWells)); const tr = obG.map((_, i) => i).filter((i) => !te.includes(i)); return olsFitScore(obXL, obY, tr, te).rmse; };
const obXP = xof(OBf, OBf.rows, OBs.payFeatures); const obP = OBf.rows.map((r) => r.PAY); const obGP = OBf.rows.map((r) => r.well);
const obPS = ML.groupSplit({ groups: obGP, testFraction: OBs.testFraction, seed: OBs.paySeed });
const obPS3 = ML.groupSplit({ groups: obGP, testFraction: OBs.testFraction, seed: OBs.seed });
const lgOn = (sp) => ML.logistic({ X: pick(obXP, sp.trainIndices), y: pick(obP, sp.trainIndices), names: OBs.payFeatures });
const obLg = ML.logistic({ X: pick(obXP, obPS.trainIndices), y: pick(obP, obPS.trainIndices), names: OBs.payFeatures });
const obYt = pick(obP, obPS.testIndices);
const obPred = ML.predict({ model: obLg, X: pick(obXP, obPS.testIndices) });
const obRep = ML.classificationReport({ yTrue: obYt, yPred: obPred.classes });

/* ---- ISUAMA ---- */
const ISf = inp.ISUAMA.field; const ISs = inp.ISUAMA.stated;
const isR = ISf.rows.filter((r) => r.DT !== null);
const isXA = xof(ISf, isR, [...LOGS, ...ATTRS]); const isXL = xof(ISf, isR, LOGS); const isXC = xof(ISf, isR, [...LOGS, 'CALI']);
const isY = isR.map((r) => r.DT); const isG = isR.map((r) => r.well);
const isHC = ISf.rows.filter((r) => r.RT >= ISs.rtCut);
const sepFit = (l2, rows = isHC) => ML.logistic({ X: rows.map((r) => [r.PHIC]), y: rows.map((r) => r.PAY), names: ['PHIC'], l2 });
const isXP = xof(ISf, ISf.rows, ISs.payFeatures); const isP = ISf.rows.map((r) => r.PAY);
const itFit = (maxIter) => ML.logistic({ X: isXP, y: isP, names: ISs.payFeatures, maxIter });
const isSp = ML.groupSplit({ groups: isG, testFraction: ISs.testFraction, seed: ISs.seed });
const isOC = ML.ols({ X: pick(isXC, isSp.trainIndices), y: pick(isY, isSp.trainIndices), names: [...LOGS, 'CALI'] });
const permNphi = (o) => ML.permutationImportance({ model: isOC, X: pick(isXC, isSp.testIndices), y: pick(isY, isSp.testIndices), metric: 'rmse', nRepeats: ISs.nRepeats, seed: ISs.seed, ...o }).importances.find((im) => im.feature === 'NPHI').mean;
const lcAt = (o) => ML.learningCurve({ X: isXL, y: isY, groups: isG, model: { kind: 'ols' }, trainGroupCounts: ISs.counts, testFraction: ISs.testFraction, seed: ISs.seed, metric: 'rmse', ...o });
const isNo = ISf.rows.filter((r) => r.DT === null);
const isNoX = xof(ISf, isNo, LOGS);

const ROUTES = {
  akpara_rhob_train_centre_g_cm3: {
    truth: () => ML.fitStandardScaler({ X: akX, trainIndices: akSp.trainIndices, names: LOGS }).centre[1],
    wrong: {
      fitted_on_every_row: () => ML.fitStandardScaler({ X: akX, names: LOGS }).centre[1],
      fitted_on_the_test_wells: () => ML.fitStandardScaler({ X: akX, trainIndices: akSp.testIndices, names: LOGS }).centre[1],
      random_row_split: () => ML.fitStandardScaler({ X: akX, trainIndices: akRR.trainIndices, names: LOGS }).centre[1],
      floor_of_the_test_size: () => ML.fitStandardScaler({ X: akX, trainIndices: akSp2.trainIndices, names: LOGS }).centre[1],
      median_of_the_training_rows: () => median(akTr.map((r) => r[1])),
    },
  },
  akpara_gr_train_scale_gapi: {
    truth: () => ML.fitStandardScaler({ X: akX, trainIndices: akSp.trainIndices, names: LOGS }).scale[0],
    wrong: {
      sample_sd: () => ML.fitStandardScaler({ X: akX, trainIndices: akSp.trainIndices, names: LOGS, sd: 'sample' }).scale[0],
      fitted_on_every_row: () => ML.fitStandardScaler({ X: akX, names: LOGS }).scale[0],
      min_max_range: () => ML.fitMinMaxScaler({ X: akX, trainIndices: akSp.trainIndices, names: LOGS }).scale[0],
      next_seed: () => ML.fitStandardScaler({ X: akX, trainIndices: ML.groupSplit({ groups: akG, testFraction: AKs.testFraction, seed: AKs.seed + 1 }).trainIndices }).scale[0],
    },
  },
  akpara_ols_nphi_coef_us_ft_per_vv: {
    truth: () => akOls.coefficients[3],
    wrong: {
      nphi_alone: () => ML.ols({ X: akTr.map((r) => [r[2]]), y: pick(akY, akSp.trainIndices) }).coefficients[1],
      no_intercept: () => ML.ols({ X: akTr, y: pick(akY, akSp.trainIndices), intercept: false }).coefficients[2],
      standardised_coefficient: () => akOls.coefficients[3] * ML.fitStandardScaler({ X: akTr }).scale[2],
      fitted_on_every_row: () => ML.ols({ X: akX, y: akY }).coefficients[3],
      per_hundredth_of_vv: () => akOls.coefficients[3] / 100,
    },
  },
  akpara_ols_residual_se_us_ft: {
    truth: () => akOls.residualSE,
    wrong: {
      rss_over_n: () => Math.sqrt(akOls.rss / akOls.n),
      rss_over_n_minus_one: () => Math.sqrt(akOls.rss / (akOls.n - 1)),
      variance_not_rooted: () => akOls.rss / akOls.dfResidual,
      test_rmse_quoted: () => akTe.rmse,
    },
  },
  akpara_test_rmse_us_ft: {
    truth: () => akTe.rmse,
    wrong: {
      training_rmse: () => Math.sqrt(akOls.rss / akOls.n),
      test_mae: () => akTe.mae,
      random_row_split: () => olsFitScore(akX, akY, akRR.trainIndices, akRR.testIndices).rmse,
      floor_of_the_test_size: () => olsFitScore(akX, akY, akSp2.trainIndices, akSp2.testIndices).rmse,
      next_seed: () => { const s = ML.groupSplit({ groups: akG, testFraction: AKs.testFraction, seed: AKs.seed + 1 }); return olsFitScore(akX, akY, s.trainIndices, s.testIndices).rmse; },
    },
  },
  akpara_test_r2: {
    truth: () => akTe.r2,
    wrong: {
      about_the_training_mean: () => ML.regressionMetrics({ yTrue: pick(akY, akSp.testIndices), yPred: ML.predict({ model: akOls, X: pick(akX, akSp.testIndices) }).values, referenceMean: mean(pick(akY, akSp.trainIndices)) }).r2,
      training_r2_quoted: () => akOls.rSquared,
      adjusted_training_r2: () => akOls.adjustedRSquared,
      random_row_split: () => olsFitScore(akX, akY, akRR.trainIndices, akRR.testIndices).r2,
    },
  },
  oboria_ridge_gr_coef_us_ft_per_gapi: {
    truth: () => obRidge(OBs.lambda).coefficients[1],
    wrong: {
      standardised_coefficient: () => obRidge(OBs.lambda).standardizedCoefficients[1],
      lambda_times_n: () => obRidge(OBs.lambda * obSp.trainIndices.length).coefficients[1],
      least_squares: () => obRidge(0).coefficients[1],
      logs_only: () => obRidge(OBs.lambda, obXL).coefficients[1],
      fitted_on_every_row: () => obRidge(OBs.lambda, obXA, obG.map((_, i) => i)).coefficients[1],
    },
  },
  oboria_fold2_test_rmse_us_ft: {
    truth: () => foldRmse(obKF.folds[OBs.fold].testGroups),
    wrong: {
      fold_zero: () => foldRmse(obKF.folds[0].testGroups),
      contiguous_folds_in_sorted_order: () => foldRmse(obIds.slice(OBs.fold * 2, OBs.fold * 2 + 2)),
      round_robin_unshuffled: () => foldRmse(obIds.filter((_, q) => q % OBs.k === OBs.fold)),
      next_seed: () => foldRmse(ML.groupKFold({ groups: obG, k: OBs.k, seed: OBs.seed + 1 }).folds[OBs.fold].testGroups),
      fold_numbered_from_one: () => foldRmse(obKF.folds[OBs.fold - 1].testGroups),
    },
  },
  oboria_leak_optimism_rmse_us_ft: {
    truth: () => ML.leakageDemo({ X: obXA, y: obY, groups: obG, model: { kind: 'ols' }, testFraction: OBs.testFraction, seed: OBs.seed, metric: 'rmse' }).optimism,
    wrong: {
      sign_reversed: () => -ML.leakageDemo({ X: obXA, y: obY, groups: obG, model: { kind: 'ols' }, testFraction: OBs.testFraction, seed: OBs.seed, metric: 'rmse' }).optimism,
      logs_only: () => ML.leakageDemo({ X: obXL, y: obY, groups: obG, model: { kind: 'ols' }, testFraction: OBs.testFraction, seed: OBs.seed, metric: 'rmse' }).optimism,
      next_seed: () => ML.leakageDemo({ X: obXA, y: obY, groups: obG, model: { kind: 'ols' }, testFraction: OBs.testFraction, seed: OBs.seed + 1, metric: 'rmse' }).optimism,
      mae_in_place_of_rmse: () => ML.leakageDemo({ X: obXA, y: obY, groups: obG, model: { kind: 'ols' }, testFraction: OBs.testFraction, seed: OBs.seed, metric: 'mae' }).optimism,
      ridge_in_place_of_ols: () => ML.leakageDemo({ X: obXA, y: obY, groups: obG, model: { kind: 'ridge', lambda: OBs.lambda }, testFraction: OBs.testFraction, seed: OBs.seed, metric: 'rmse' }).optimism,
    },
  },
  oboria_logistic_rt_coef_per_ohmm: {
    truth: () => obLg.coefficients[3],
    wrong: {
      odds_ratio_quoted: () => Math.exp(obLg.coefficients[3]),
      penalised_l2_one: () => ML.logistic({ X: pick(obXP, obPS.trainIndices), y: pick(obP, obPS.trainIndices), l2: 1 }).coefficients[3],
      fitted_on_every_row: () => ML.logistic({ X: obXP, y: obP }).coefficients[3],
      no_intercept: () => ML.logistic({ X: pick(obXP, obPS.trainIndices), y: pick(obP, obPS.trainIndices), intercept: false }).coefficients[2],
      rt_alone: () => ML.logistic({ X: pick(obXP, obPS.trainIndices).map((r) => [r[2]]), y: pick(obP, obPS.trainIndices) }).coefficients[1],
      the_sonic_seed_used_for_pay: () => lgOn(obPS3).coefficients[3],
    },
  },
  oboria_pay_f1: {
    truth: () => obRep.perClass.find((c) => c.label === 1).f1,
    wrong: {
      f1_of_label_zero: () => obRep.perClass.find((c) => c.label === 0).f1,
      macro_f1: () => obRep.macro.f1,
      weighted_f1: () => obRep.weighted.f1,
      accuracy: () => obRep.accuracy,
      precision_of_pay: () => obRep.perClass.find((c) => c.label === 1).precision,
    },
  },
  oboria_test_log_loss: {
    truth: () => ML.logLoss({ yTrue: obYt, probabilities: obPred.values }).logLoss,
    wrong: {
      base_ten_log: () => ML.logLoss({ yTrue: obYt, probabilities: obPred.values }).logLoss / Math.LN10,
      on_the_training_rows: () => ML.logLoss({ yTrue: pick(obP, obPS.trainIndices), probabilities: obLg.probabilities }).logLoss,
      summed_not_averaged: () => ML.logLoss({ yTrue: obYt, probabilities: obPred.values }).logLoss * obYt.length,
      pay_rows_only: () => mean(obYt.map((y, i) => (y === 1 ? -Math.log(obPred.values[i]) : null)).filter((v) => v !== null)),
      the_sonic_seed_used_for_pay: () => { const m = lgOn(obPS3); return ML.logLoss({ yTrue: pick(obP, obPS3.testIndices), probabilities: ML.predict({ model: m, X: pick(obXP, obPS3.testIndices) }).values }).logLoss; },
    },
  },
  isuama_scaled_condition_attrs: {
    truth: () => ML.ols({ X: isXA, y: isY }).scaledConditionNumber,
    wrong: {
      raw_condition_number: () => ML.ols({ X: isXA, y: isY }).conditionNumber,
      logs_only: () => ML.ols({ X: isXL, y: isY }).scaledConditionNumber,
      no_intercept: () => ML.ols({ X: isXA, y: isY, intercept: false }).scaledConditionNumber,
      features_centred: () => { const m = isXA[0].map((_, j) => mean(isXA.map((r) => r[j]))); return ML.ols({ X: isXA.map((r) => r.map((v, j) => v - m[j])), y: isY }).scaledConditionNumber; },
      squared_gram_number: () => ML.ols({ X: isXA, y: isY }).scaledConditionNumber ** 2,
    },
  },
  isuama_l2_phic_coef_per_vv: {
    truth: () => sepFit(ISs.l2).coefficients[1],
    wrong: {
      penalty_not_halved: () => sepFit(2 * ISs.l2).coefficients[1],
      read_as_sklearn_C: () => sepFit(1 / ISs.l2).coefficients[1],
      every_row_not_the_high_rt_rows: () => sepFit(ISs.l2, ISf.rows).coefficients[1],
      penalty_times_n: () => sepFit(ISs.l2 * isHC.length).coefficients[1],
    },
  },
  isuama_nphi_coef_after_three_updates_per_vv: {
    truth: () => itFit(ISs.maxIter).coefficients[2],
    wrong: {
      converged_value_quoted: () => itFit(100).coefficients[2],
      two_updates: () => itFit(2).coefficients[2],
      four_updates: () => itFit(4).coefficients[2],
      one_update: () => itFit(1).coefficients[2],
      rt_coefficient_quoted: () => itFit(ISs.maxIter).coefficients[3],
    },
  },
  isuama_perm_nphi_mean_drop_us_ft: {
    truth: () => permNphi({}),
    wrong: {
      next_seed: () => permNphi({ seed: ISs.seed + 1 }),
      ten_repeats: () => permNphi({ nRepeats: 10 }),
      one_repeat: () => permNphi({ nRepeats: 1 }),
      r2_in_place_of_rmse: () => permNphi({ metric: 'r2' }),
      scored_on_the_training_rows: () => ML.permutationImportance({ model: isOC, X: pick(isXC, isSp.trainIndices), y: pick(isY, isSp.trainIndices), metric: 'rmse', nRepeats: ISs.nRepeats, seed: ISs.seed }).importances.find((im) => im.feature === 'NPHI').mean,
    },
  },
  isuama_lc_test_rmse_three_wells_us_ft: {
    truth: () => lcAt({}).points[ISs.countIndex].testScore,
    wrong: {
      training_score_quoted: () => lcAt({}).points[ISs.countIndex].trainScore,
      the_fourth_point: () => lcAt({}).points[ISs.countIndex + 1].testScore,
      next_seed: () => lcAt({ seed: ISs.seed + 1 }).points[ISs.countIndex].testScore,
      first_three_in_sorted_order: () => {
        const c = lcAt({}); const test = new Set(c.testGroups);
        const sorted = [...new Set(isG)].filter((g) => !test.has(g)).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)).slice(0, 3);
        return olsFitScore(isXL, isY, idxOf(isG, new Set(sorted)), c.testIndices).rmse;
      },
    },
  },
  isuama_pred_dt_first_row_us_ft: {
    truth: () => ML.predict({ model: ML.ridge({ X: isXL, y: isY, lambda: ISs.lambda }), X: [isNoX[0]] }).values[0],
    wrong: {
      least_squares: () => ML.predict({ model: ML.ols({ X: isXL, y: isY }), X: [isNoX[0]] }).values[0],
      fitted_on_the_training_wells_only: () => ML.predict({ model: ML.ridge({ X: pick(isXL, isSp.trainIndices), y: pick(isY, isSp.trainIndices), lambda: ISs.lambda }), X: [isNoX[0]] }).values[0],
      lambda_times_n: () => ML.predict({ model: ML.ridge({ X: isXL, y: isY, lambda: ISs.lambda * isXL.length }), X: [isNoX[0]] }).values[0],
      last_row_of_the_well: () => ML.predict({ model: ML.ridge({ X: isXL, y: isY, lambda: ISs.lambda }), X: [isNoX[isNoX.length - 1]] }).values[0],
    },
  },
};

let totalWrong = 0;
let weak = 0;
let closest = { key: null, name: null, ratio: Infinity };
const report = [];
const summary = {};
console.log('field                                            tol        errors  moved  blind  closest miss (tolerances)');
Object.entries(ROUTES).forEach(([key, { truth, wrong }]) => {
  if (!fields[key]) { console.log(`REFUSED: ${key} is not a graded field`); process.exit(2); }
  const tol = fields[key][3];
  const t = truth();
  if (!Number.isFinite(t)) { console.log(`REFUSED: the true value of ${key} did not evaluate`); process.exit(2); }
  if (SLACK === 1 && Math.abs(t - fields[key][2]) > 1e-12 * Math.abs(t)) {
    console.log(`REFUSED: the truth route for ${key} gives ${t}, and fields.json carries ${fields[key][2]}`); process.exit(2);
  }
  const moved = []; const blind = [];
  let nearest = Infinity; let nearestName = null;
  Object.entries(wrong).forEach(([name, f]) => {
    totalWrong += 1;
    let got;
    try { got = f(); } catch (e) { got = NaN; }
    const d = Math.abs(got - t);
    if (!Number.isFinite(got) || d > tol) {
      moved.push(name);
      const ratio = Number.isFinite(got) ? d / tol : Infinity;
      if (ratio < nearest) { nearest = ratio; nearestName = name; }
      report.push({ key, name, value: got });
    } else { blind.push(`${name} (off by ${d.toExponential(3)})`); }
  });
  summary[key] = Object.keys(wrong).map((n) => n.replace(/_/g, ' ')).join(', ');
  if (nearest < closest.ratio) closest = { key, name: nearestName, ratio: nearest };
  const isWeak = moved.length < 3 || blind.length > 0;
  if (isWeak) weak += 1;
  console.log(`${key.padEnd(48)} ${String(tol).padEnd(10)} ${String(moved.length + blind.length).padStart(6)} ${String(moved.length).padStart(6)} ${String(blind.length).padStart(6)}  ${nearest === Infinity ? 'all infinite' : nearest.toExponential(3)} (${nearestName})${isWeak ? '   WEAK' : ''}`);
  if (blind.length) console.log(`${' '.repeat(49)}BLIND TO: ${blind.join(', ')}`);
});
console.log();
console.log(`routes swept: ${Object.keys(ROUTES).length}  plausible wrong methods aimed at them: ${totalWrong}  WEAK routes: ${weak}`);
console.log(`CLOSEST MISS ACROSS THE WHOLE SWEEP: ${closest.key} via ${closest.name}, ${closest.ratio.toExponential(3)} tolerances away`);
if (process.argv.includes('--values')) {
  report.forEach((r) => console.log(`  wrong ${r.key} ${r.name} = ${r.value}`));
}
if (process.argv.includes('--summary')) process.stdout.write(`${JSON.stringify(summary)}\n`);
if (Object.keys(ROUTES).length !== 18 || totalWrong < 54) {
  console.log('REFUSED: a sweep with fewer than three wrong methods a field is not a sweep');
  process.exit(2);
}
if (SLACK !== 1) {
  console.log(`NEGATIVE CONTROL: tolerances multiplied by ${SLACK}. Expected 18 WEAK routes, got ${weak}.`);
  process.exit(weak === 18 ? 1 : 2);
}
if (typeof sdS !== 'function') process.exit(2);
process.exit(weak ? 1 : 0);
