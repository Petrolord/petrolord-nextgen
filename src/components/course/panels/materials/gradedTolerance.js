// THE GRADING TOLERANCE OF EVERY SC3 CAPSTONE FIELD, DERIVED IN ONE PLACE.
//
// Carried forward from EC11 prms, EC10 farmout, EC9 joa, EC8 gsa, EC7 pia, SC2
// procurement and D5 appliedai (and before them D4, D3, D2, D1, H1, FC3, FC5
// and FC9): a field's tolerance is made once, here,
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
 * What the SC3 teaching digest prints each quantity class to. The digest
 * header is the authority, and it reads:
 *
 *   "Every quantity, cost, amount of money, score, share, percentage,
 *    probability, safety factor, sigma and ratio prints to SIX decimals; ..."
 */
export const PRINTED_DECIMALS = {
  share: 6, quantity: 6, money: 6, factor: 6, probability: 6,
};

/**
 * The eighteen graded fields in their published order: tier, key, quantity
 * class, and the tolerance this wave STATED.
 *
 * EVERY STATED TOLERANCE IS 1e-9. No SC3 field rests on a random draw: every
 * one is the engine's arithmetic on stated inputs (a weighted score, a
 * cumulative share, a square root, a cost at a rounded quantity, a band's
 * write-down, a discount candidate's cost, a safety stock from the inverse
 * normal or from the unit normal loss solved to the last binary digit, a
 * Poisson loss, an insurance-spares cost and probability), which the vendored
 * stdlib oracle (tools/validation/supplychain/oracle_inventory.py, written from
 * the published rules with exact fractions and Decimal) replays in
 * oracle_check.py. No field comes from the Monte Carlo of leadTimeRisk. The
 * printed floor, half a unit in the sixth decimal, therefore sets every
 * tolerance, and discriminate.mjs requires every wrong method to land outside
 * it and every stated reading of the engine to leave the field exactly where
 * it is. A quantity is in the unit its case states (drums, joints, elements,
 * kits, seals), money is US$, a share is per cent or a score out of 100, a
 * factor is the safety factor k, a probability is a fraction from 0 to 1. A
 * key names what it measures: the capstone, the item and the figure.
 */
export const GRADED_FIELDS = [
  // Associate: IGBARIAM, the materials register of a synthetic flow station.
  // CRITICALITY, CLASSES AND THE ORDER QUANTITY: an item's weighted
  // criticality score, an item's cumulative share of annual usage value, the
  // EOQ of the corrosion inhibitor, its relevant cost at the rounded quantity
  // and the rounding penalty, and the total write-down of the slow-moving
  // stock.
  ['beginner', 'igbariam_trim_weighted_score', 'share', 1e-9],
  ['beginner', 'igbariam_inhibitor_cumulative_pct', 'share', 1e-9],
  ['beginner', 'igbariam_inhibitor_eoq', 'quantity', 1e-9],
  ['beginner', 'igbariam_inhibitor_relevant_cost', 'money', 1e-9],
  ['beginner', 'igbariam_inhibitor_rounding_penalty_pct', 'share', 1e-9],
  ['beginner', 'igbariam_total_write_down', 'money', 1e-9],
  // Professional: OGIDI, a synthetic field's stock of tubing, filter
  // elements and valve repair kits. SERVICE LEVELS, SAFETY STOCK AND
  // DISCOUNTS: the order quantity and total cost under an incremental
  // discount, the safety stock at a cycle service level, the safety factor
  // for a fill rate, the order-up-to level under periodic review, and the
  // expected units short a cycle of a Poisson slow mover.
  ['intermediate', 'ogidi_tubing_discount_quantity', 'quantity', 1e-9],
  ['intermediate', 'ogidi_tubing_discount_total_cost', 'money', 1e-9],
  ['intermediate', 'ogidi_filter_csl_safety_stock', 'quantity', 1e-9],
  ['intermediate', 'ogidi_filter_fill_rate_k', 'factor', 1e-9],
  ['intermediate', 'ogidi_filter_periodic_level', 'quantity', 1e-9],
  ['intermediate', 'ogidi_kit_poisson_short', 'quantity', 1e-9],
  // Expert: UMUCHU, a synthetic compressor station's insurance spare and a
  // slow-moving seal. SPARES, LEAD-TIME RISK AND THE LIMITS: the insurance
  // spare's annual cost, its expected downtime cost, its probability of no
  // shortage and its fill rate at the cheapest stock, and the seal's expected
  // units short a cycle and achieved fill rate, every field free of every
  // stated reading and of every draw.
  ['advanced', 'umuchu_motor_total_cost', 'money', 1e-9],
  ['advanced', 'umuchu_motor_downtime_cost', 'money', 1e-9],
  ['advanced', 'umuchu_motor_no_shortage', 'probability', 1e-9],
  ['advanced', 'umuchu_motor_fill_rate', 'probability', 1e-9],
  ['advanced', 'umuchu_seal_poisson_short', 'quantity', 1e-9],
  ['advanced', 'umuchu_seal_poisson_fill_rate', 'probability', 1e-9],
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
  if (!row) throw new Error(`${key} is not one of the eighteen graded SC3 fields`);
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
