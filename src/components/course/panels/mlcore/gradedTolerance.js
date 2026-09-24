// THE GRADING TOLERANCE OF EVERY D2 CAPSTONE FIELD, DERIVED IN ONE PLACE.
//
// Carried forward from D1, which carried it from H1, FC3, FC5 and FC9: a field's
// tolerance lived in three places (the capstone generator, fields.json and a
// hand-kept mirror in the teaching lab) and the copies went stale. Here it is
// made once:
//
//     a field's tolerance is  max(stated, half a unit in the last place the
//                                  course PRINTS that class)
//
// MAX AND NEVER MIN, so the rule only ever loosens. A tolerance no printed
// precision can satisfy grades a learner on luck at unprinted digits.
//
// THE GRADER'S TOLERANCE IS ABSOLUTE. public.academy_submit_capstone grades
// abs(v_got - v_exp) <= v_tol, in the field's own units.
//
// Nothing here imports anything, so a node script, a vitest run and a browser
// build all read the same numbers.

/**
 * What the D2 teaching digest prints each quantity class to. The digest header
 * is the authority, and it reads:
 *
 *   "Every coefficient, standard error, score, metric, probability, centre,
 *    scale, condition number and difference prints to SIX decimals; counts,
 *    row numbers, iterations, seeds and well numbers are whole numbers;
 *    relative differences and very small magnitudes print in exponent form."
 */
export const PRINTED_DECIMALS = {
  scaler: 6, coefficient: 6, error: 6, score: 6, condition: 6, prediction: 6,
};

/**
 * The eighteen graded fields in their published order: tier, key, quantity
 * class, and the tolerance this wave STATED. A key names what it measures and
 * carries its unit as a suffix where it has one.
 */
export const GRADED_FIELDS = [
  // Associate: seven wells, a stated whole-well split. A MODEL AND ITS TEST:
  // a training-row centre and scale, an OLS coefficient and its residual
  // standard error, the held-out wells' RMSE and R-squared. No penalty, no
  // classifier, no k-fold.
  ['beginner', 'akpara_rhob_train_centre_g_cm3', 'scaler', 1e-9],
  ['beginner', 'akpara_gr_train_scale_gapi', 'scaler', 1e-9],
  ['beginner', 'akpara_ols_nphi_coef_us_ft_per_vv', 'coefficient', 1e-9],
  ['beginner', 'akpara_ols_residual_se_us_ft', 'error', 1e-9],
  ['beginner', 'akpara_test_rmse_us_ft', 'error', 1e-9],
  ['beginner', 'akpara_test_r2', 'score', 1e-9],
  // Professional: eight wells with attributes and a stated pay rule.
  // VALIDATING A MODEL: a ridge coefficient, a whole-well fold's RMSE, the
  // optimism of a random split, a logistic coefficient, F1 of pay and the
  // test log loss.
  ['intermediate', 'oboria_ridge_gr_coef_us_ft_per_gapi', 'coefficient', 1e-9],
  ['intermediate', 'oboria_fold2_test_rmse_us_ft', 'error', 1e-9],
  ['intermediate', 'oboria_leak_optimism_rmse_us_ft', 'error', 1e-9],
  ['intermediate', 'oboria_logistic_rt_coef_per_ohmm', 'coefficient', 1e-9],
  ['intermediate', 'oboria_pay_f1', 'score', 1e-9],
  ['intermediate', 'oboria_test_log_loss', 'score', 1e-9],
  // Expert: eight sonic wells and one without. WHEN THE ENGINE REFUSES, STOPS
  // OR EXTRAPOLATES: a scaled condition number, a penalised coefficient on a
  // separated label, a coefficient after a stated number of Newton updates,
  // a permutation importance, a learning-curve point and a written-back
  // prediction.
  ['advanced', 'isuama_scaled_condition_attrs', 'condition', 1e-9],
  ['advanced', 'isuama_l2_phic_coef_per_vv', 'coefficient', 1e-9],
  ['advanced', 'isuama_nphi_coef_after_three_updates_per_vv', 'coefficient', 1e-9],
  ['advanced', 'isuama_perm_nphi_mean_drop_us_ft', 'error', 1e-9],
  ['advanced', 'isuama_lc_test_rmse_three_wells_us_ft', 'error', 1e-9],
  ['advanced', 'isuama_pred_dt_first_row_us_ft', 'prediction', 1e-9],
];

/**
 * Half a unit in the last place the course prints this class, PARSED FROM A
 * LITERAL rather than multiplied: 0.5 * 10 ** -4 is not 0.00005 in binary.
 */
export const printedFloor = (cls) => {
  const dp = PRINTED_DECIMALS[cls];
  if (!Number.isInteger(dp)) {
    throw new Error(`no printed precision is declared for the quantity class ${cls}`);
  }
  return Number(`5e-${dp + 1}`);
};

/** The tier, class and stated tolerance of one field, by key. */
export const gradedClassOf = (key) => {
  const row = GRADED_FIELDS.find(([, k]) => k === key);
  if (!row) throw new Error(`${key} is not one of the eighteen graded D2 fields`);
  return { tier: row[0], cls: row[2], stated: row[3] };
};

/** The tolerance a field is graded at. The only place this number is made. */
export const gradedTolerance = (key) => {
  const { cls, stated } = gradedClassOf(key);
  return Math.max(stated, printedFloor(cls));
};

/** The per-field precision declaration, in the shape gradeprecision.py reads. */
export const precisionDeclaration = () => {
  const byClass = {};
  GRADED_FIELDS.forEach(([, key, cls]) => {
    (byClass[cls] = byClass[cls] || []).push(key);
  });
  return Object.fromEntries(Object.entries(byClass).sort().map(([cls, keys]) => [
    cls, { decimals: PRINTED_DECIMALS[cls], match: `^(?:${[...keys].sort().join('|')})$` },
  ]));
};
