// THE GRADING TOLERANCE OF EVERY EC8 CAPSTONE FIELD, DERIVED IN ONE PLACE.
//
// Carried forward from EC7 pia, SC2 procurement and D5 appliedai (and before them D4,
// D3, D2, D1, H1, FC3, FC5 and FC9): a field's tolerance is made once, here,
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
 * What the EC8 teaching digest prints each quantity class to. The digest
 * header is the authority, and it reads:
 *
 *   "Every quantity, price, amount of money, rate, ratio, fraction, share,
 *    percentage, slope and present value prints to SIX decimals; ..."
 */
export const PRINTED_DECIMALS = {
  quantity: 6, price: 6, money: 6, ratio: 6,
};

/**
 * The eighteen graded fields in their published order: tier, key, quantity
 * class, and the tolerance this wave STATED.
 *
 * EVERY STATED TOLERANCE IS 1e-9. No EC8 field rests on a search, a fit or a
 * random draw: every one is the engine's closed-form clause arithmetic on
 * stated contract terms, which the vendored stdlib oracle
 * (tools/validation/economics/oracle_gascontract.py, written from the clause
 * arithmetic of the public texts with exact fractions) replays in
 * oracle_check.py. The printed floor, half a unit in the sixth decimal,
 * therefore sets every tolerance, and discriminate.mjs requires every wrong
 * method to land outside it and every stated reading of the engine to leave
 * the field exactly where it is. Quantities are MMBtu, prices US$ per MMBtu,
 * money US$. A key names what it measures: the capstone, the year or period
 * and the figure.
 */
export const GRADED_FIELDS = [
  // Associate: OZUBU, one Ekene synthetic supply to an industrial buyer.
  // QUANTITIES AND ONE CONTRACT YEAR: a metered month in MMBtu, the ACQ of a
  // leap contract year, the effective swing, a fortnight's buyer and seller
  // shortfall, and one year's deficiency payment.
  ['beginner', 'ozubu_march_2028_mmbtu', 'quantity', 1e-9],
  ['beginner', 'ozubu_2028_acq', 'quantity', 1e-9],
  ['beginner', 'ozubu_effective_swing', 'ratio', 1e-9],
  ['beginner', 'ozubu_fortnight_buyer_shortfall', 'quantity', 1e-9],
  ['beginner', 'ozubu_fortnight_seller_shortfall', 'quantity', 1e-9],
  ['beginner', 'ozubu_2029_deficiency_payment', 'money', 1e-9],
  // Professional: IFEYI, a six-year Ekene synthetic supply at an oil-indexed
  // price with averaging, lag and a quarterly reset. THE LEDGER, THE PRICE AND
  // THE NIGERIAN RULES: an annual average price, a deficiency payment, make-up
  // taken and make-up expired in one year, the net to the seller over the term,
  // and the lessee's Domestic Gas Delivery Obligation penalty.
  ['intermediate', 'ifeyi_2030_average_price', 'price', 1e-9],
  ['intermediate', 'ifeyi_2028_deficiency_payment', 'money', 1e-9],
  ['intermediate', 'ifeyi_2031_make_up_taken', 'quantity', 1e-9],
  ['intermediate', 'ifeyi_2031_make_up_expired', 'quantity', 1e-9],
  ['intermediate', 'ifeyi_total_net_to_seller', 'money', 1e-9],
  ['intermediate', 'ifeyi_2031_dgdo_penalty', 'money', 1e-9],
  // Expert: NWAKA, a seven-year Ekene synthetic supply at an S-curve
  // oil-indexed price, with carry-forward, make-up refunded at the end of the
  // term, the imported gas royalty and the canonical NPV. PARITY, THE WHOLE
  // CONTRACT AND READING THE ENGINE, every field free of every stated reading.
  ['advanced', 'nwaka_july_2029_price', 'price', 1e-9],
  ['advanced', 'nwaka_2034_average_price', 'price', 1e-9],
  ['advanced', 'nwaka_2030_carry_forward_credit', 'quantity', 1e-9],
  ['advanced', 'nwaka_2035_refund', 'money', 1e-9],
  ['advanced', 'nwaka_npv_seller_revenue', 'money', 1e-9],
  ['advanced', 'nwaka_2032_royalty', 'money', 1e-9],
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
  if (!row) throw new Error(`${key} is not one of the eighteen graded EC8 fields`);
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
