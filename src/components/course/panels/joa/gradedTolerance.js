// THE GRADING TOLERANCE OF EVERY EC9 CAPSTONE FIELD, DERIVED IN ONE PLACE.
//
// Carried forward from EC8 gsa, EC7 pia, SC2 procurement and D5 appliedai (and before
// them D4, D3, D2, D1, H1, FC3, FC5 and FC9): a field's tolerance is made once, here,
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
 * What the EC9 teaching digest prints each quantity class to. The digest
 * header is the authority, and it reads:
 *
 *   "Every amount of money, interest, share, percentage, rate, multiple,
 *    balance and present value prints to SIX decimals; ..."
 */
export const PRINTED_DECIMALS = {
  money: 6, share: 6,
};

/**
 * The eighteen graded fields in their published order: tier, key, quantity
 * class, and the tolerance this wave STATED.
 *
 * EVERY STATED TOLERANCE IS 1e-9. No EC9 field rests on a search, a fit or a
 * random draw: every one is the engine's closed-form clause arithmetic on
 * stated agreement terms, which the vendored stdlib oracle
 * (tools/validation/economics/oracle_jointventure.py, written from the clause
 * arithmetic of the public texts with exact fractions) replays in
 * oracle_check.py. The printed floor, half a unit in the sixth decimal,
 * therefore sets every tolerance, and discriminate.mjs requires every wrong
 * method to land outside it and every stated reading of the engine to leave
 * the field exactly where it is. Money is US$, shares are per cent. A key
 * names what it measures: the capstone, the party, the year or month and the
 * figure.
 */
export const GRADED_FIELDS = [
  // Associate: IDUMU, a four-party Ekene synthetic joint venture with a carry.
  // INTERESTS AND THE JOINT ACCOUNT: a carrier's paying interest, two months
  // of one partner's cash calls, the allowed budget overrun, and the operating
  // and development overhead on a marginal scale.
  ['beginner', 'idumu_zed_paying_pct', 'share', 1e-9],
  ['beginner', 'idumu_zed_june_call', 'money', 1e-9],
  ['beginner', 'idumu_zed_august_paid', 'money', 1e-9],
  ['beginner', 'idumu_budget_allowed_overrun', 'money', 1e-9],
  ['beginner', 'idumu_operating_overhead', 'money', 1e-9],
  ['beginner', 'idumu_development_overhead', 'money', 1e-9],
  // Professional: OKWELLE, a four-party Ekene synthetic joint venture and its
  // production sharing variant. RECOVERY, DEFAULT AND COST RECOVERY: the carry
  // balance after a year with a compound uplift, a back-in refund under PIA
  // s.85(4) received by one partner, default interest compounded monthly and
  // one party's cover, a cash call in the reconciliation ledger, and a year's
  // PSC cost recovered.
  ['intermediate', 'okwelle_2031_carry_balance', 'money', 1e-9],
  ['intermediate', 'okwelle_backin_refund_to_pra', 'money', 1e-9],
  ['intermediate', 'okwelle_default_interest', 'money', 1e-9],
  ['intermediate', 'okwelle_default_cover_oko', 'money', 1e-9],
  ['intermediate', 'okwelle_prb_june_call', 'money', 1e-9],
  ['intermediate', 'okwelle_2032_cost_recovered', 'money', 1e-9],
  // Expert: ABIAMA, a four-party Ekene synthetic deepwater joint venture.
  // SOLE RISK AND READING THE ENGINE: a non-consent premium and the payout
  // year's receipt, a buy-in apportioned to one consenting party, a carrier's
  // NPV through the canonical npv, a year's government profit oil, and an
  // interest after forfeiture, every field free of every stated reading.
  ['advanced', 'abiama_spb_premium', 'money', 1e-9],
  ['advanced', 'abiama_spb_2036_receipt', 'money', 1e-9],
  ['advanced', 'abiama_buy_in_to_spa', 'money', 1e-9],
  ['advanced', 'abiama_spa_carry_npv', 'money', 1e-9],
  ['advanced', 'abiama_2035_government_profit_oil', 'money', 1e-9],
  ['advanced', 'abiama_abo_after_forfeiture_pct', 'share', 1e-9],
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
  if (!row) throw new Error(`${key} is not one of the eighteen graded EC9 fields`);
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
