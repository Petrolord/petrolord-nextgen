// THE GRADING TOLERANCE OF EVERY FC6 CAPSTONE FIELD, DERIVED IN ONE PLACE.
//
// WHY THIS FILE EXISTS. On two earlier waves the tolerance lived in three
// places: the capstone generator that writes fields.json, fields.json itself,
// and a hand-kept mirror inside the teaching lab that the panel tests pinned.
// Three copies of one number is three chances to disagree, and FC2 and FC3
// each shipped a stale THIRD copy in the lab. Nothing holds a tolerance any
// more. This file holds the two things a tolerance is MADE of, the quantity
// class a field belongs to and the tolerance this wave stated for it, and
// derives the rest. `heattransferLab.js` and `fc6_capstone.mjs` both import
// from here, and fields.json and precision.json are written out of the same
// derivation, so the shipped grader, the lab and the generator cannot drift.
//
// THE RULE, settled for this programme: a field's tolerance is
//
//     max(stated, half a unit in the last place the course PRINTS that class)
//
// MAX and never min, so the rule only ever LOOSENS and no answer that graded
// correct before can grade wrong now. A tolerance no printed precision can
// satisfy is not a hard field, it is a broken one: a learner who reads the
// right row, quotes it to the precision the course told them to, and still
// fails has been graded on their luck at guessing unprinted digits.
//
// Nothing here imports anything. It is arithmetic over two literals per field,
// so a node script, a vitest run and a browser build all read the same numbers.

/**
 * What the FC6 teaching digest prints each quantity class to. The digest's own
 * header is the authority:
 *
 *   "Temperatures, log means, areas, overall coefficients, film coefficients,
 *    diameters, percentages and dimensionless groups print to six decimals;
 *    duties, capacity rates and UA in Btu an hour to four; resistances in
 *    hr.ft2.F per Btu to nine; tube and shell counts are whole numbers."
 *
 * `count` is declared and NOTHING IS GRADED IN IT, on purpose. A whole number
 * prints to zero decimals, so half a unit in its last place is 0.5, and a
 * tolerance of 0.5 is what a count means. It is also what makes an integer
 * field unusable here: the kit's digest leak gate guards at ten tolerances, so
 * a count graded at 0.5 flags every number within five of it, and this digest
 * carries tube counts, resistance shares and percentages all through that band.
 * MEASURED, not reasoned: the first cut of this wave graded the AMENAM tube
 * count and digestleak reported seventeen leaks, every one of them that one
 * field against an unrelated number. The count is TAUGHT instead, and the
 * rounding that produces it is graded through the area margin, which cannot be
 * right unless the count is.
 */
export const PRINTED_DECIMALS = {
  degF: 6, ft2: 6, coefficient: 6, inch: 6, pct: 6, ratio: 6, // the six-decimal classes
  btuHr: 4,                                                   // duties, capacity rates, UA
  resistance: 9,                                              // hr.ft2.F per Btu
  count: 0,                                                   // tubes, passes, shells
};

/**
 * The eighteen graded fields in their published order, each with the quantity
 * class it belongs to and the tolerance this wave STATED for it. The stated
 * figure is a floor on how tight the field may be graded, never a ceiling: the
 * derivation below raises any of them the printed precision cannot meet.
 *
 * NOT ONE OF THE EIGHTEEN READS A HELD OR FITTED ITEM. The neutralisation is
 * by CONSTRUCTION and it is asserted in fc6_capstone.mjs rather than reasoned
 * about here: every film coefficient is STATED by the capstone instead of
 * computed, so none of the five fitted Dittus-Boelter and Sieder-Tate numbers
 * is on any graded path; no graded field reads a bundle or shell diameter, so
 * the held BUNDLE_K table is not on one either; and the whole hot-day rating
 * holds effectiveness from its DEFINITION at fixed UA, so it assumes no
 * arrangement and needs no cross-flow F, which is the one correction this
 * module cannot source.
 */
export const GRADED_FIELDS = [
  // Associate, AMENAM: one exchanger from its balance to its tube count.
  ['beginner', 'amenam_duty_btu_hr', 'btuHr', 1e-2],
  ['beginner', 'amenam_cold_outlet_f', 'degF', 1e-6],
  ['beginner', 'amenam_lmtd_f', 'degF', 1e-6],
  ['beginner', 'amenam_area_ft2', 'ft2', 1e-6],
  ['beginner', 'amenam_area_per_tube_ft2', 'ft2', 1e-6],
  ['beginner', 'amenam_area_margin_pct', 'pct', 1e-9],  // right only if the tube count is
  // Professional, UBIT: the correction the shell count buys, and U from its parts.
  ['intermediate', 'ubit_f_correction', 'ratio', 1e-9],
  ['intermediate', 'ubit_p1_two_shells', 'ratio', 1e-9],
  ['intermediate', 'ubit_u_clean', 'coefficient', 1e-6],
  ['intermediate', 'ubit_u_dirty', 'coefficient', 1e-6],
  ['intermediate', 'ubit_fouling_penalty_pct', 'pct', 1e-6],
  ['intermediate', 'ubit_controlling_margin_pct', 'pct', 1e-6],
  // Expert, OKWORI: the bay at its design point and on the hot day it is bought for.
  ['advanced', 'okwori_design_lmtd_f', 'degF', 1e-6],
  ['advanced', 'okwori_design_effectiveness', 'ratio', 1e-9],
  ['advanced', 'okwori_capacity_ratio', 'ratio', 1e-9],
  ['advanced', 'okwori_ua_btu_hr_f', 'btuHr', 1e-2],
  ['advanced', 'okwori_hotday_ntu', 'ratio', 1e-9],
  ['advanced', 'okwori_hotday_process_out_f', 'degF', 1e-6],
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

/** The class and the stated tolerance of one field, by key. */
export const gradedClassOf = (key) => {
  const row = GRADED_FIELDS.find(([, k]) => k === key);
  if (!row) throw new Error(`${key} is not one of the eighteen graded fields`);
  return { tier: row[0], cls: row[2], stated: row[3] };
};

/** The tolerance a field is graded at. The only place this number is made. */
export const gradedTolerance = (key) => {
  const { cls, stated } = gradedClassOf(key);
  return Math.max(stated, printedFloor(cls));
};

/**
 * The per-field precision declaration, in the shape gradeprecision.py and the
 * lab's answerability gate read. It is DERIVED from the table above rather
 * than hand kept, so it cannot declare one precision while the tolerance was
 * floored at another.
 *
 * It exists because a word matcher cannot settle this course either way: the
 * digest header names nine quantity kinds across three clauses, the word
 * "coefficient" appears in two of them (an overall coefficient and a film
 * coefficient, both six), and a tube count prints to no decimals at all, which
 * no header clause can say in the form the matcher reads. Only a per-field
 * declaration says which is which, and gradeprecision.py REFUSES below
 * eighteen of eighteen classified.
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

/**
 * EVERY WAY A GRADED ANSWER CAN BE PRINTED, as strings, for the panel guard.
 *
 * THE HOLE THIS CLOSES. The FC1-style capstone guard rendered each graded
 * value ONE way, `Number.prototype.toPrecision(9)` with trailing zeros
 * stripped, and grepped the panel sources for that string. A panel printing
 * the same value at FULL float precision walks straight past it: 92.11034802267143
 * does not contain 92.1103480, so the grep finds nothing and only the lab's
 * numeric sweep would catch it, on a wave that has a numeric sweep and runs it.
 * This wave prints film coefficients, Reynolds numbers and five resistances, so
 * a panel author copying a number out of a console is a live risk.
 *
 * Both shapes are rendered here, plus the class's own printed precision, which
 * is the shape a panel is most likely to use because it is the shape the digest
 * uses. Renderings without a decimal point are dropped: a bare 68 sits inside
 * a longer number and would report a leak on any page carrying a year.
 */
export const gradedRenderings = (value, cls) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return [];
  const out = [String(value), value.toPrecision(9).replace(/\.?0+$/, '')];
  if (cls && Number.isInteger(PRINTED_DECIMALS[cls]) && PRINTED_DECIMALS[cls] > 0) {
    out.push(value.toFixed(PRINTED_DECIMALS[cls]));
  }
  return [...new Set(out)].filter((s) => !s.includes('e') && s.includes('.'));
};
