// THE GRADING TOLERANCE OF EVERY FC9 CAPSTONE FIELD, DERIVED IN ONE PLACE.
//
// WHY THIS FILE EXISTS. Across this programme the tolerance of a graded field
// has lived in THREE places: the capstone generator that writes fields.json,
// fields.json itself, and a hand-kept mirror inside the teaching lab that the
// panel test pinned. Three copies of one number is three chances to disagree,
// and a test that pins a mirror only tells you the mirror is stale AFTER
// somebody notices the failure. FC2 shipped a stale third copy and so did FC3.
// FC3 removed the CLASS rather than the instance, FC5 carried that repair
// forward, and this file is the same single derivation for FC9.
//
// THE RULE, settled for this programme:
//
//     a field's tolerance is  max(stated, half a unit in the last place the
//                                  course PRINTS that class)
//
// MAX AND NEVER MIN, so the rule only ever LOOSENS and no answer that graded
// correct before can grade wrong now. A tolerance no printed precision can
// satisfy is not a hard field, it is a broken one: a learner who reads the
// right row, quotes it to the precision the course told them to, and still
// fails has been graded on their luck at guessing unprinted digits.
//
// Nothing here imports anything. It is arithmetic over two literals per field,
// so a node script, a vitest run and a browser build all read the same numbers.
//
// WHAT IS SPECIAL ABOUT FC9. Every corrosion RATE this engine computes stands
// on eleven constants that are not sourced anywhere in the repository, and one
// unresolved question about where the protective-scale factor belongs. So FC9
// GRADES NO CORROSION RATE THE CORRELATION PRODUCED. It grades the stream
// bookkeeping, the flow definition, the inhibitor arithmetic and the allowance
// arithmetic, and where a rate is needed the capstone STATES it from an
// inspection survey. That is why every field below is clear of every held item,
// and the wave's clearance report says field by field how.

/**
 * What the FC9 teaching digest prints each quantity class to. The digest's own
 * header is the authority, and it reads:
 *
 *   "Partial pressures in bar and in psia, wall thicknesses and allowances in
 *    mm, corrosion rates in mm/yr, lives in years, percentages, percentage
 *    points and every dimensionless ratio print to SIX decimals; Reynolds
 *    numbers print to FOUR, because a number in the hundreds of thousands
 *    carries no information in its millionths; measured constants and ratios of
 *    them print to TWELVE; counts are whole numbers."
 *
 * Every class below is one clause of that sentence. The twelve-decimal class
 * carries no graded field: a measured constant is evidence about the engine and
 * is never an answer a learner types. That matters more here than in any
 * sibling wave, because in FC9 every measured constant is a HELD constant.
 */
export const PRINTED_DECIMALS = {
  // the six-decimal clause
  bar: 6, psia: 6, mm: 6, mmPerYr: 6, yr: 6, pct: 6, pp: 6, ratio: 6,
  // the four-decimal clause
  reynolds: 4,
};

/**
 * The eighteen graded fields in their published order, each with the quantity
 * class it belongs to and the tolerance this wave STATED for it. The stated
 * figure is a floor on how tight the field may be graded, never a ceiling: the
 * derivation below raises any of them that the printed precision cannot meet.
 *
 * A key names WHAT IT MEASURES and carries its unit as a suffix so a learner
 * can see which units to answer in. No key is named for its unit alone.
 *
 * THE THREE PLANT NAMES LIVE IN THE KEYS AND NOWHERE ELSE IN THIS FILE, which
 * the panel guard asserts by stripping the eighteen keys and then requiring that
 * no plant name survives. That is what keeps the key exemption from being a
 * blanket: a file may spell a plant name only as part of a graded field key.
 */
export const GRADED_FIELDS = [
  // Associate: the first plant, a high-pressure wet gas gathering line. WHAT IS
  // IN THE STREAM AND HOW FAST IT MOVES. No rate, no band, no verdict, no threshold comparison. Every
  // one of these six is arithmetic over the inputs and the one exact conversion
  // factor the engine exports, so not one held constant is in any chain.
  ['beginner', 'obigbo_co2_partial_pressure_bar', 'bar', 1e-9],
  ['beginner', 'obigbo_h2s_partial_pressure_psia', 'psia', 1e-9],
  ['beginner', 'obigbo_h2s_to_co2_mole_ratio', 'ratio', 1e-12],
  ['beginner', 'obigbo_reynolds_number', 'reynolds', 1e-6],
  ['beginner', 'obigbo_effective_inhibition_pct', 'pct', 1e-9],
  ['beginner', 'obigbo_metal_loss_ratio_vs_datasheet', 'ratio', 1e-12],
  // Professional: the second plant, an oil line whose wall-loss rate came off a
  // two-year ultrasonic survey rather than out of the correlation. THE INHIBITOR
  // ARITHMETIC AND THE ALLOWANCE. The stated survey rate is what
  // clears every de Waard-Milliams constant out of these six by construction.
  ['intermediate', 'nembe_retained_metal_loss_fraction', 'ratio', 1e-12],
  ['intermediate', 'nembe_inhibitor_shortfall_pp', 'pp', 1e-9],
  ['intermediate', 'nembe_inhibited_rate_mmyr', 'mmPerYr', 1e-9],
  ['intermediate', 'nembe_remaining_life_yr', 'yr', 1e-6],
  ['intermediate', 'nembe_required_allowance_mm', 'mm', 1e-9],
  ['intermediate', 'nembe_life_lost_to_availability_yr', 'yr', 1e-6],
  // Expert: the third plant, a line where the wall shear has already taken the
  // corrosion inhibitor credit away. INVERSION ON THE ENGINE'S OWN VERDICT. Each of these six is
  // found by bisecting an engine call until a returned flag or a returned
  // number turns over, so the answer is the engine's and not an algebraic
  // shortcut around it.
  ['advanced', 'soku_tolerable_rate_mmyr', 'mmPerYr', 1e-9],
  ['advanced', 'soku_required_availability_pct', 'pct', 1e-9],
  ['advanced', 'soku_availability_for_design_life_pct', 'pct', 1e-9],
  ['advanced', 'soku_allowance_to_reinstate_mm', 'mm', 1e-9],
  ['advanced', 'soku_stripped_film_life_yr', 'yr', 1e-6],
  ['advanced', 'soku_film_credit_life_ratio', 'ratio', 1e-9],
];

/**
 * Half a unit in the last place the course prints this class, PARSED FROM A
 * LITERAL rather than multiplied: 0.5 * 10 ** -4 is 0.000049999999999999996 in
 * binary, and a tolerance is a number a human reads off a file.
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
  if (!row) throw new Error(`${key} is not one of the eighteen graded FC9 fields`);
  return { tier: row[0], cls: row[2], stated: row[3] };
};

/** The tolerance a field is graded at. The only place this number is made. */
export const gradedTolerance = (key) => {
  const { cls, stated } = gradedClassOf(key);
  return Math.max(stated, printedFloor(cls));
};

/**
 * The per-field precision declaration, in the shape `gradeprecision.py` reads.
 * DERIVED from the table above rather than hand kept, so it cannot declare one
 * precision while the tolerance was floored at another.
 *
 * It exists because a word matcher cannot classify these keys either way. The
 * digest header names quantities in English ("partial pressures", "lives"), the
 * keys are code, and the word "rate" appears on a corrosion rate in mm/yr, on a
 * RATIO of two rates and on a percentage, at two different precisions:
 * `nembe_inhibited_rate_mmyr` is a rate and prints to six, while
 * `obigbo_metal_loss_ratio_vs_datasheet` is a ratio OF two rates and also
 * prints to six, and `obigbo_reynolds_number` prints to four while carrying
 * neither word. Only a per-field declaration says which is which, and a
 * precision check that classifies seventeen fields in eighteen is an unrun
 * check rather than a pass.
 */
export const precisionDeclaration = () => {
  const byClass = {};
  GRADED_FIELDS.forEach(([, key, cls]) => {
    (byClass[cls] = byClass[cls] || []).push(key);
  });
  return Object.fromEntries(Object.entries(byClass).sort().map(([cls, keys]) => [
    cls, { decimals: PRINTED_DECIMALS[cls], match: `^(?:${[...keys].sort().join('|')})$` },
  ]));
};
