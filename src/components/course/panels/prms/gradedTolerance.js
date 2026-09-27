// THE GRADING TOLERANCE OF EVERY EC11 CAPSTONE FIELD, DERIVED IN ONE PLACE.
//
// Carried forward from EC10 farmout, EC9 joa, EC8 gsa, EC7 pia, SC2
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
 * What the EC11 teaching digest prints each quantity class to. The digest
 * header is the authority, and it reads:
 *
 *   "Every quantity, volume, barrel, BOE, Mscf, amount of money, cash flow,
 *    NPV, percentage, chance, probability, correlation, ratio and index prints
 *    to SIX decimals; ..."
 */
export const PRINTED_DECIMALS = {
  volume: 6, money: 6, share: 6,
};

/**
 * The eighteen graded fields in their published order: tier, key, quantity
 * class, and the tolerance this wave STATED.
 *
 * EVERY STATED TOLERANCE IS 1e-9. No EC11 field rests on a search, a fit or a
 * random draw: every one is the engine's closed-form arithmetic on stated
 * inputs (a product of two stated chances, a difference or a sum of stated
 * estimates, the canonical cash flow of cashflow.ts on stated forecasts, the
 * closed-form low and high estimates of a stated lognormal, normal or
 * triangular, a sum of chance times mean, a reconciliation's sums), which the
 * vendored stdlib oracle (tools/validation/economics/oracle_prms.py, written
 * from the published rules with exact fractions) replays in oracle_check.py.
 * No field comes from the Monte Carlo of aggregate. The printed floor, half a
 * unit in the sixth decimal, therefore sets every tolerance, and
 * discriminate.mjs requires every wrong method to land outside it and every
 * stated reading of the engine to leave the field exactly where it is. A
 * volume is in the unit its case states (barrels, BOE or millions of barrels),
 * money is US$, a share is per cent. A key names what it measures: the
 * capstone, the project or category and the figure.
 */
export const GRADED_FIELDS = [
  // Associate: ABAGANA, an Ekene synthetic licence with a prospect, a lead, a
  // Reserves category set and a Contingent Resources category set. CLASSES,
  // CATEGORIES AND THE LOW ESTIMATE: the chance of commerciality of the
  // prospect and of the lead, the Probable and Possible increments of the
  // Reserves, and the 2C and 3C of the Contingent Resources.
  ['beginner', 'abagana_prospect_pc_pct', 'share', 1e-9],
  ['beginner', 'abagana_lead_pc_pct', 'share', 1e-9],
  ['beginner', 'abagana_reserves_p2', 'volume', 1e-9],
  ['beginner', 'abagana_reserves_p3', 'volume', 1e-9],
  ['beginner', 'abagana_contingent_2c', 'volume', 1e-9],
  ['beginner', 'abagana_contingent_3c', 'volume', 1e-9],
  // Professional: AWKUZU, an Ekene synthetic field with three technical
  // forecasts, a licence that expires with no renewal expected and a royalty
  // interest. MATURITY, COMMERCIALITY AND THE ECONOMIC LIMIT: the best case's
  // undiscounted net cash flow and NPV at the working interest, the 2P net
  // entitlement oil, the P2 and P3 increments in BOE with the low case failing
  // the economic test, and the high case's oil beyond the licence.
  ['intermediate', 'awkuzu_best_ncf_share', 'money', 1e-9],
  ['intermediate', 'awkuzu_best_npv_share', 'money', 1e-9],
  ['intermediate', 'awkuzu_2p_net_oil', 'volume', 1e-9],
  ['intermediate', 'awkuzu_p2_boe', 'volume', 1e-9],
  ['intermediate', 'awkuzu_p3_boe', 'volume', 1e-9],
  ['intermediate', 'awkuzu_high_beyond_licence_oil', 'volume', 1e-9],
  // Expert: ISUOFIA, an Ekene synthetic field with three Reserves projects,
  // three Contingent Resources projects and a year's reconciliation.
  // AGGREGATION, RECONCILIATION AND THE LIMITS: the arithmetic 1P and 3P of the
  // Reserves projects, the risked mean of the Contingent Resources, and the
  // computed closing 1P and 3P and the 2P difference of the reconciliation,
  // every field free of every stated reading and of every draw.
  ['advanced', 'isuofia_reserves_arith_1p', 'volume', 1e-9],
  ['advanced', 'isuofia_reserves_arith_3p', 'volume', 1e-9],
  ['advanced', 'isuofia_contingent_risked_mean', 'volume', 1e-9],
  ['advanced', 'isuofia_closing_1p', 'volume', 1e-9],
  ['advanced', 'isuofia_closing_3p', 'volume', 1e-9],
  ['advanced', 'isuofia_difference_2p', 'volume', 1e-9],
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
  if (!row) throw new Error(`${key} is not one of the eighteen graded EC11 fields`);
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
