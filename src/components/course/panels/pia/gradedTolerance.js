// THE GRADING TOLERANCE OF EVERY EC7 CAPSTONE FIELD, DERIVED IN ONE PLACE.
//
// Carried forward from SC2 procurement and D5 appliedai (and before them D4,
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
 * What the EC7 teaching digest prints each quantity class to. The digest
 * header is the authority, and it reads:
 *
 *   "Every amount of money, rate, fraction, share, percentage and take prints
 *    to SIX decimals; ..."
 */
export const PRINTED_DECIMALS = {
  money: 6, ratio: 6, percent: 6,
};

/**
 * The eighteen graded fields in their published order: tier, key, quantity
 * class, and the tolerance this wave STATED.
 *
 * EVERY STATED TOLERANCE IS 1e-9. No EC7 field rests on a search, a fit or a
 * random draw: every one is the engine's closed-form ledger arithmetic on
 * stated terms and rows, which the vendored stdlib oracle
 * (tools/validation/economics/oracle_pia2021.py, typed from the gazetted
 * texts) replays in oracle_check.py. The printed floor, half a unit in the
 * sixth decimal, therefore sets every tolerance, and discriminate.mjs requires
 * every wrong method to land outside it and every open reading of the texts to
 * leave the field exactly where it is. Every money field is at the stated
 * working interest share. A key names what it measures: the capstone, the year
 * (or "total" for the life of the ledger) and the figure.
 */
export const GRADED_FIELDS = [
  // Associate: ODOZI, an onshore converted lease inside the small-field
  // tranches, with associated gas partly used in-country, every year under the
  // Nigeria Tax Act 2025. THE MAP OF THE ACT: the weighted royalty rate, the
  // production royalty, the hydrocarbon tax, the development levy, companies
  // income tax over the life and the government take.
  ['beginner', 'odozi_2028_liquids_royalty_rate', 'ratio', 1e-9],
  ['beginner', 'odozi_2029_production_royalty_usd', 'money', 1e-9],
  ['beginner', 'odozi_2030_hct_usd', 'money', 1e-9],
  ['beginner', 'odozi_2031_dev_levy_usd', 'money', 1e-9],
  ['beginner', 'odozi_total_cit_usd', 'money', 1e-9],
  ['beginner', 'odozi_government_take_pct', 'percent', 1e-9],
  // Professional: NKEMDI, a shallow water lease granted out of new acreage,
  // crossing the new-lease allowance cap, with condensate and gas, and a cost
  // price ratio carry that ends in forfeiture. THE HYDROCARBON TAX AS A SYSTEM,
  // every field free of the open new-lease rate question.
  ['intermediate', 'nkemdi_2028_liquids_royalty_usd', 'money', 1e-9],
  ['intermediate', 'nkemdi_2029_production_allowance_usd', 'money', 1e-9],
  ['intermediate', 'nkemdi_2029_hct_chargeable_profit_usd', 'money', 1e-9],
  ['intermediate', 'nkemdi_2031_cpr_deferred_usd', 'money', 1e-9],
  ['intermediate', 'nkemdi_cpr_forfeited_usd', 'money', 1e-9],
  ['intermediate', 'nkemdi_total_cit_usd', 'money', 1e-9],
  // Expert: ALAKU, a deep offshore lease granted out of new acreage whose
  // ledger crosses 1 January 2026, at a price above the top royalty by price
  // benchmark on either base year, with a decommissioning fund whose escrow
  // condition is not met. TRANSITIONS AND READING AN OUTCOME, every field free
  // of the deep offshore reading and of the base year.
  ['advanced', 'alaku_2026_total_royalty_usd', 'money', 1e-9],
  ['advanced', 'alaku_2026_hct_chargeable_profit_usd', 'money', 1e-9],
  ['advanced', 'alaku_2025_tet_usd', 'money', 1e-9],
  ['advanced', 'alaku_2027_dev_levy_usd', 'money', 1e-9],
  ['advanced', 'alaku_2028_cit_usd', 'money', 1e-9],
  ['advanced', 'alaku_total_cit_usd', 'money', 1e-9],
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
  if (!row) throw new Error(`${key} is not one of the eighteen graded EC7 fields`);
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
