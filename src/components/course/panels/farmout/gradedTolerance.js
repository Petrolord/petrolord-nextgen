// THE GRADING TOLERANCE OF EVERY EC10 CAPSTONE FIELD, DERIVED IN ONE PLACE.
//
// Carried forward from EC9 joa, EC8 gsa, EC7 pia, SC2 procurement and D5
// appliedai (and before them D4, D3, D2, D1, H1, FC3, FC5 and FC9): a field's
// tolerance is made once, here,
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
 * What the EC10 teaching digest prints each quantity class to. The digest
 * header is the authority, and it reads:
 *
 *   "Every amount of money, value, EMV, payment, cost, carry, fee, surcharge,
 *    price, NPV, balance, percentage, share, interest, promote, ratio,
 *    probability and chance prints to SIX decimals; ..."
 */
export const PRINTED_DECIMALS = {
  money: 6, share: 6, ratio: 6,
};

/**
 * The eighteen graded fields in their published order: tier, key, quantity
 * class, and the tolerance this wave STATED.
 *
 * EVERY STATED TOLERANCE IS 1e-9. No EC10 field rests on a search, a fit or a
 * random draw: every one is the engine's closed-form deal arithmetic on stated
 * terms (the break-evens are exact interpolations on straight segments), which
 * the vendored stdlib oracle (tools/validation/economics/oracle_farmout.py,
 * written from the stated deal arithmetic with exact fractions) replays in
 * oracle_check.py. No field comes from the Monte Carlo of riskSharing. The
 * printed floor, half a unit in the sixth decimal, therefore sets every
 * tolerance, and discriminate.mjs requires every wrong method to land outside
 * it and every stated reading of the engine to leave the field exactly where
 * it is. Money is US$, shares are per cent, a ratio has no unit. A key names
 * what it measures: the capstone, the party or event and the figure.
 */
export const GRADED_FIELDS = [
  // Associate: OGBAKU, a two-party Ekene synthetic licence farmed out for one
  // exploration well. THE DEAL AND WHAT IT COSTS: what the farminee and the
  // farmor pay for the well, the promote ratio, the carry, the consideration
  // and the equivalent working interest.
  ['beginner', 'ogbaku_ihe_well_payment', 'money', 1e-9],
  ['beginner', 'ogbaku_ogb_well_payment', 'money', 1e-9],
  ['beginner', 'ogbaku_promote_ratio', 'ratio', 1e-9],
  ['beginner', 'ogbaku_carry', 'money', 1e-9],
  ['beginner', 'ogbaku_consideration', 'money', 1e-9],
  ['beginner', 'ogbaku_equivalent_wi_pct', 'share', 1e-9],
  // Professional: UMUNZE, a two-party Ekene synthetic licence with a
  // drill-to-earn farm-out and a risked prospect. CAPS, VESTING, VALUE AND THE
  // FEE: the farminee's payment under a gross-cost cap exceeded, the farmor's
  // payment under a carry cap exceeded, the farminee's EMV, the break-even
  // share paid and chance of success, and the consent fee.
  ['intermediate', 'umunze_well1_amg_payment', 'money', 1e-9],
  ['intermediate', 'umunze_well2_umz_payment', 'money', 1e-9],
  ['intermediate', 'umunze_amg_emv', 'money', 1e-9],
  ['intermediate', 'umunze_breakeven_share_pct', 'share', 1e-9],
  ['intermediate', 'umunze_amg_breakeven_chance_pct', 'share', 1e-9],
  ['intermediate', 'umunze_consent_fee', 'money', 1e-9],
  // Expert: AKPUGO, a two-party Ekene synthetic licence, its prospect, a
  // seismic survey, a price for an interest and what follows the farm-in.
  // INFORMATION, PRICE AND AFTER THE FARM-IN: the farminee's EVII, the chance
  // of success after the strong signal, the risked value per percent, the
  // price-to-value ratio, a development carry balance and a back-in refund,
  // every field free of every stated reading and of every draw.
  ['advanced', 'akpugo_ezi_evii', 'money', 1e-9],
  ['advanced', 'akpugo_strong_posterior_pct', 'share', 1e-9],
  ['advanced', 'akpugo_risked_value_per_pct', 'money', 1e-9],
  ['advanced', 'akpugo_price_to_value', 'ratio', 1e-9],
  ['advanced', 'akpugo_2035_carry_balance', 'money', 1e-9],
  ['advanced', 'akpugo_backin_refund_to_obr', 'money', 1e-9],
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
  if (!row) throw new Error(`${key} is not one of the eighteen graded EC10 fields`);
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
