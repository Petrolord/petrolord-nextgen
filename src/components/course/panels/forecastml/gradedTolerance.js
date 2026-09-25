// THE GRADING TOLERANCE OF EVERY D4 CAPSTONE FIELD, DERIVED IN ONE PLACE.
//
// Carried forward from D3, which carried it from D2, D1, H1, FC3, FC5 and FC9: a
// field's tolerance lived in three places (the capstone generator, fields.json
// and a hand-kept mirror in the teaching lab) and the copies went stale. Here
// it is made once:
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
 * What the D4 teaching digest prints each quantity class to. The digest header
 * is the authority, and it reads:
 *
 *   "Every rate, level, trend, forecast, fitted value, residual, error,
 *    smoothing parameter, sum of squares, mean squared error, percentage
 *    error, scaled error, scale, percentile, Arps qi, Di and b, R2 and RMSE
 *    prints to SIX decimals; counts, month indices, origins, steps, horizons,
 *    evaluations, seeds and path counts are whole numbers; ..."
 */
export const PRINTED_DECIMALS = {
  parameter: 6, rate: 6, mse: 6, percent: 6, scaled: 6, decline: 6,
};

/**
 * The eighteen graded fields in their published order: tier, key, quantity
 * class, and the tolerance this wave STATED.
 *
 * WHY SOME STATED TOLERANCES ARE WIDER THAN 1e-9. A field computed with every
 * smoothing parameter given (or not from a smoothing fit at all) is exact
 * arithmetic, and is stated at 1e-9 so the printed precision sets it. A field
 * that rests on FITTED parameters rests on where a search stops on a flat SSE
 * surface: the engine's compass search and the stdlib oracle's zoom grid reach
 * the same minimum by different roads and agree on the parameters to about
 * 1e-8 relative, which a forecast 24 steps out or a bootstrap percentile
 * carries as up to 1e-5 bbl/d. Each such field is stated at 10 x the worst
 * engine-oracle disagreement oracle_check.py measured on it, rounded up to a
 * power of ten, so an answer from any correct optimiser at six decimals grades
 * the same; oracle_check.py re-measures and requires the disagreement to stay
 * within a tenth of the tolerance, and discriminate.mjs requires every wrong
 * method to land outside it. A key names what it measures and
 * carries its unit as a suffix where it has one (bopd: bbl/d; bopd2: (bbl/d)^2;
 * pct: percent; per_month: a decline per month; MASE and alpha have no unit).
 */
export const GRADED_FIELDS = [
  // Associate: two wells. SMOOTHING A RATE SERIES INTO A FORECAST: a fitted
  // ses alpha, the MSE of holt with its parameters given, a fitted holt beta
  // and a holt forecast, a fitted damped phi and a damped forecast. No backtest, no
  // interval, no Arps.
  ['beginner', 'agulu2_ses_alpha', 'parameter', 1e-9],
  ['beginner', 'agulu1_holt_fixed_mse_bopd2', 'mse', 1e-9],
  ['beginner', 'agulu1_holt_beta', 'parameter', 1e-9],
  ['beginner', 'agulu1_holt_forecast_h12_bopd', 'rate', 1e-5],
  ['beginner', 'agulu1_damped_phi', 'parameter', 1e-9],
  ['beginner', 'agulu1_damped_forecast_h24_bopd', 'rate', 1e-4],
  // Professional: two wells, one shut in inside its hold-out. TESTING A
  // FORECAST HONESTLY: a hold-out sMAPE, MASE and mean error, a backtest RMSE,
  // a held-parameter backtest MASE and a by-horizon MAE.
  ['intermediate', 'nanka1_holdout_damped_smape_pct', 'percent', 1e-5],
  ['intermediate', 'nanka1_holdout_damped_mase', 'scaled', 1e-9],
  ['intermediate', 'nanka1_holdout_damped_me_bopd', 'rate', 1e-5],
  ['intermediate', 'nanka2_backtest_holt_rmse_bopd', 'rate', 1e-5],
  ['intermediate', 'nanka2_backtest_holt_held_mase', 'scaled', 1e-9],
  ['intermediate', 'nanka2_backtest_holt_step6_mae_bopd', 'rate', 1e-5],
  // Expert: two wells, one shut in and worked over. UNCERTAINTY, THE ARPS
  // BASELINE AND THE ENGINE'S RULES: a seeded bootstrap P90, P10 and P50, an
  // Arps Di per month, and a comparison's Arps MASE and best MASE.
  ['advanced', 'umunze1_damped_p90_h12_bopd', 'rate', 1e-4],
  ['advanced', 'umunze1_damped_p10_h12_bopd', 'rate', 1e-5],
  ['advanced', 'umunze1_damped_p50_h6_bopd', 'rate', 1e-5],
  ['advanced', 'umunze1_arps_di_per_month', 'decline', 1e-9],
  ['advanced', 'umunze2_compare_arps_mase', 'scaled', 1e-9],
  ['advanced', 'umunze2_compare_best_mase', 'scaled', 1e-9],
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
  if (!row) throw new Error(`${key} is not one of the eighteen graded D4 fields`);
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
