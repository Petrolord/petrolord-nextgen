// THE GRADING TOLERANCE OF EVERY SC2 CAPSTONE FIELD, DERIVED IN ONE PLACE.
//
// Carried forward from D5, which carried it from D4, D3, D2, D1, H1, FC3, FC5 and FC9: a
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
 * What the SC2 teaching digest prints each quantity class to. The digest
 * header is the authority, and it reads:
 *
 *   "Every price, amount, total, correction, discount, deviation, omission,
 *    adjustment, evaluated cost, life-cycle cost, estimate, share amount,
 *    payment, margin, overrun, cost, day count, score, points total,
 *    percentage, content, lead, ratio, weight, mean, standard deviation,
 *    limit, percentile and probability prints to SIX decimals; ..."
 */
export const PRINTED_DECIMALS = {
  money: 6, score: 6, percent: 6, ratio: 6,
};

/**
 * The eighteen graded fields in their published order: tier, key, quantity
 * class, and the tolerance this wave STATED.
 *
 * EVERY STATED TOLERANCE IS 1e-9. No SC2 field rests on a search or a fit:
 * every one is closed-form arithmetic on stated inputs (a technical
 * percentage, a corrected price, an average, an evaluated cost, a score, a
 * net present cost, a mean less a standard deviation, a content percentage, a
 * lead, an estimate, a share, a ratio) or a statistic of a seeded lib/stats
 * Monte Carlo run on a stated seed and iteration count, which the stdlib
 * oracle replays (oracle_check.py measures the engine-oracle disagreement on
 * each and requires it within a tenth of the tolerance). The printed floor,
 * half a unit in the sixth decimal, therefore sets every tolerance, and
 * discriminate.mjs requires every wrong method to land outside it. A key names
 * what it measures: the capstone, the bid or the contract type, and the
 * figure.
 */
export const GRADED_FIELDS = [
  // Associate: ONITSHA, six well services bids. TWO ENVELOPES, BY HAND: a
  // technical percentage, a corrected price, an omission at the average, an
  // evaluated cost, a commercial score and the top combined score.
  ['beginner', 'onitsha_on3_technical_percent', 'percent', 1e-9],
  ['beginner', 'onitsha_on2_corrected_price', 'money', 1e-9],
  ['beginner', 'onitsha_on3_omission_amount', 'money', 1e-9],
  ['beginner', 'onitsha_on1_evaluated_cost', 'money', 1e-9],
  ['beginner', 'onitsha_on2_commercial_score', 'score', 1e-9],
  ['beginner', 'onitsha_top_combined_score', 'score', 1e-9],
  // Professional: UMUAHIA, six materials bids. LOWEST EVALUATED COST AND THE
  // CONTENT ACT: a life-cycle cost, an evaluated cost, the relative ALB
  // limit, an overall content and the s.14 lead under both readings.
  ['intermediate', 'umuahia_um2_life_cycle_cost', 'money', 1e-9],
  ['intermediate', 'umuahia_um4_evaluated_cost', 'money', 1e-9],
  ['intermediate', 'umuahia_alb_limit', 'money', 1e-9],
  ['intermediate', 'umuahia_um3_overall_content', 'percent', 1e-9],
  ['intermediate', 'umuahia_s14_lead_points', 'percent', 1e-9],
  ['intermediate', 'umuahia_s14_lead_relative', 'percent', 1e-9],
  // Expert: OKIGWE, one workover under three contract types, its should-cost
  // and its tender. CONTRACTS, SHOULD-COST AND THE WHOLE TENDER: the day-rate
  // mean cost, the reimbursable P90 cost (the LOW cost), what the company
  // pays of the overrun on the day rate, the should-cost estimate, the
  // operator's share of it, and the award's ratio to it.
  ['advanced', 'okigwe_dayrate_mean_cost', 'money', 1e-9],
  ['advanced', 'okigwe_reimbursable_p90_cost', 'money', 1e-9],
  ['advanced', 'okigwe_dayrate_company_pays', 'money', 1e-9],
  ['advanced', 'okigwe_should_cost_estimate', 'money', 1e-9],
  ['advanced', 'okigwe_operator_amount', 'money', 1e-9],
  ['advanced', 'okigwe_award_ratio', 'ratio', 1e-9],
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
  if (!row) throw new Error(`${key} is not one of the eighteen graded SC2 fields`);
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
