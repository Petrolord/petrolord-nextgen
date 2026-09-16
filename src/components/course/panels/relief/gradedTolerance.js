// THE GRADING TOLERANCE OF EVERY FC5 CAPSTONE FIELD, DERIVED IN ONE PLACE.
//
// WHY THIS FILE EXISTS. Across this programme the tolerance of a graded field
// has lived in THREE places: the capstone generator that writes fields.json,
// fields.json itself, and a hand-kept mirror inside the teaching lab that the
// panel test pinned. Three copies of one number is three chances to disagree,
// and a test that pins a mirror only tells you the mirror is stale AFTER
// somebody notices the failure. FC2 shipped a stale third copy. FC3 shipped a
// stale third copy. FC3 then removed the CLASS rather than the instance, and
// this file is that repair carried forward: nothing holds a tolerance any
// more.
//
// This file holds the two things a tolerance is MADE of, the quantity class a
// field belongs to and the tolerance this wave stated for it, and derives the
// rest. `reliefLab.js` and the wave capstone generator `fc5_capstone.mjs` both import
// from here, and fields.json is written out of the same derivation, so the
// shipped grader, the lab and the generator cannot drift.
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
// Nothing here imports anything. It is arithmetic over two literals per
// field, so a node script, a vitest run and a browser build all read the same
// numbers.

/**
 * What the FC5 teaching digest prints each quantity class to. The digest's own
 * header is the authority, and it reads:
 *
 *   "Required areas, pressures, dimensionless ratios and fractions,
 *    velocities, lengths, radiant intensities, setback distances, blowdown
 *    times, temperatures and the gas coefficient C print to SIX decimals;
 *    flows, duties, wetted areas and masses to FOUR; measured constants and
 *    ratios of them to TWELVE; counts are whole numbers."
 *
 * Every class below is one clause of that sentence. The twelve-decimal class
 * carries no graded field: a measured constant is evidence about the engine
 * and is never an answer a learner types.
 */
export const PRINTED_DECIMALS = {
  // the six-decimal clause
  in2: 6, psia: 6, ratio: 6, ftPerS: 6, ft: 6, kWm2: 6, m: 6, s: 6, degR: 6, coefficient: 6,
  // the four-decimal clause
  ft2: 4, lb: 4,
};

/**
 * The eighteen graded fields in their published order, each with the quantity
 * class it belongs to and the tolerance this wave STATED for it. The stated
 * figure is a floor on how tight the field may be graded, never a ceiling: the
 * derivation below raises any of them that the printed precision cannot meet.
 *
 * A key names WHAT IT MEASURES and carries its unit as a suffix so a learner
 * can see which units to answer in. No key is named for its unit alone.
 */
export const GRADED_FIELDS = [
  // Associate: one gas plant, three fluids, and the branch the back pressure
  // decides. Nothing here reads the Kv fit or an orifice letter. The plant's
  // name lives in the keys and nowhere else in this file.
  ['beginner', 'kolocreek_critical_pressure_ratio', 'ratio', 1e-9],
  ['beginner', 'kolocreek_gas_coefficient_c', 'coefficient', 1e-6],
  ['beginner', 'kolocreek_gas_critical_area_in2', 'in2', 1e-6],
  ['beginner', 'kolocreek_gas_subcritical_area_in2', 'in2', 1e-6],
  ['beginner', 'kolocreek_liquid_area_in2', 'in2', 1e-6],
  ['beginner', 'kolocreek_steam_area_in2', 'in2', 1e-6],
  // Professional: the geometry a fire case stands on, and the drum that keeps
  // liquid out of the header. No duty and no dropout velocity.
  ['intermediate', 'ogbainbiri_wetted_area_ft2', 'ft2', 1e-4],
  ['intermediate', 'ogbainbiri_tower_wetted_area_ft2', 'ft2', 1e-4],
  ['intermediate', 'ogbainbiri_liquid_area_fraction', 'ratio', 1e-9],
  ['intermediate', 'ogbainbiri_vapor_velocity_fts', 'ftPerS', 1e-6],
  ['intermediate', 'ogbainbiri_drum_length_ft', 'ft', 1e-6],
  ['intermediate', 'ogbainbiri_drum_length_wider_ft', 'ft', 1e-6],
  // Expert: a vessel emptying itself, and the point source asked both ways
  // against a stated project allowable.
  ['advanced', 'gbaran_initial_mass_lb', 'lb', 1e-6],
  ['advanced', 'gbaran_blowdown_time_s', 's', 1e-6],
  ['advanced', 'gbaran_final_temperature_degr', 'degR', 1e-6],
  ['advanced', 'gbaran_choked_floor_psia', 'psia', 1e-9],
  ['advanced', 'gbaran_radiant_intensity_kwm2', 'kWm2', 1e-9],
  ['advanced', 'gbaran_setback_distance_m', 'm', 1e-6],
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
  if (!row) throw new Error(`${key} is not one of the eighteen graded FC5 fields`);
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
 * digest header names quantities in English ("required areas", "wetted
 * areas"), the keys are code, and the word "area" appears in three clauses at
 * two different precisions: a required area in2 prints to six and a wetted
 * area ft2 prints to four, and `ogbainbiri_liquid_area_fraction` is an AREA
 * FRACTION that prints to six. Only a per-field declaration says which is
 * which, and a precision check that classifies one field in eighteen is an
 * unrun check rather than a pass.
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
