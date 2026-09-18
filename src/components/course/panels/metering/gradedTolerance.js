// THE GRADING TOLERANCE OF EVERY FC8 CAPSTONE FIELD, DERIVED IN ONE PLACE.
//
// WHY THIS FILE EXISTS. Across this programme the tolerance of a graded field
// has lived in THREE places at once: the capstone generator that writes
// fields.json, fields.json itself, and a hand-kept mirror inside the teaching
// lab that the panel test pinned. Three copies of one number is three chances
// to disagree, and a test that pins a mirror only reports that the mirror is
// stale after somebody notices the failure. FC2 shipped a stale third copy and
// so did FC3. This file is the single derivation for FC8, and fc8_capstone.mjs,
// make_fields.mjs, discriminate.mjs, gate_collisions.mjs and the teaching lab
// all read it rather than carrying a number of their own.
//
// THE RULE, settled for this programme:
//
//     a field's tolerance is  max(stated, half a unit in the last place the
//                                  course PRINTS that class)
//
// MAX AND NEVER MIN, so the rule only ever loosens and no answer that graded
// correct before can grade wrong now. A tolerance no printed precision can
// satisfy is not a hard field, it is a BROKEN one: a learner who reads the
// right row, quotes it to the precision the course told them to, and still
// fails has been graded on their luck at guessing unprinted digits. A sibling
// wave shipped a field 11.7 tolerances out on exactly that shape.
//
// Nothing here imports anything. It is arithmetic over two literals per field,
// so a node script, a vitest run and a browser build all read the same numbers.
//
// WHAT IS SPECIAL ABOUT FC8. This course teaches three engines whose most
// important sentences are refusals. `storageTank.js` computes a fire duty and
// WITHHOLDS the vent capacity that duty is for, by name, because the two
// plausible forms of the API 2000 air-equivalence relation differ by a factor
// of about 24 and an emergency vent sized 24 times too small is how a tank is
// destroyed. `metering.js` WITHHOLDS the straight-run requirement for two
// elbows in different planes. Both are TAUGHT as limits and NEITHER IS GRADED.
// Beyond the two withdrawals, every table value in these three engines says of
// itself that it is the engine's stated data and is cited to no document in
// this repository: the valve style FL and xT, the sigma ladder, the noise
// bands, the authority screen, the straight-run columns, the thermal venting
// factors and the API 650 minimum plate band. So where a capstone needs one of
// those, IT STATES IT, the way a project states a certified vendor figure or a
// standard's own table, and the wave's clearance report says field by field
// which mechanism clears which held item.

/**
 * What the FC8 teaching digest prints each quantity class to. The digest's own
 * header is the authority, and it reads:
 *
 *   "Beta ratios, pressure differentials in psi, percentages, shell
 *    thicknesses in inches, valve coefficients, cavitation indices,
 *    authorities, travel percentages and every dimensionless ratio print to
 *    SIX decimals; volumes in barrels, vent rates in scfh, movement rates in
 *    barrels per hour and annual losses in pounds print to FOUR, because a number in the thousands carries no
 *    information in its millionths; counts are whole numbers."
 *
 * Every class below is one clause of that sentence. Counts carry no graded
 * field: a count is evidence about the engine's shape and is checked in the
 * digest with its tree and its rule beside it.
 */
export const PRINTED_DECIMALS = {
  // the six-decimal clause
  ratio: 6, psi: 6, pct: 6, inch: 6, cv: 6,
  // the four-decimal clause
  bbl: 4, scfh: 4, bblPerHr: 4, lbPerYr: 4,
};

/**
 * The eighteen graded fields in their published order, each with the quantity
 * class it belongs to and the tolerance this wave STATED for it. The stated
 * figure is a floor on how tight a field may be graded and never a ceiling:
 * the derivation below raises any of them the printed precision cannot meet.
 *
 * A key names WHAT IT MEASURES and carries its unit as a suffix, so a learner
 * can see which units to answer in. No key is named for its unit alone.
 *
 * THE THREE PLANT NAMES LIVE IN THE KEYS AND NOWHERE ELSE IN THIS FILE.
 */
export const GRADED_FIELDS = [
  // Associate: KRAKAMA, an export meter run. WHAT THE RUN MEASURES AND HOW WELL
  // IT MEASURES IT. Every one of the six is arithmetic over the stated inputs,
  // a definition, or a published equation evaluated inside its own published
  // range. No table value, no screening band and no withheld item is in any
  // chain, and the clearance report measures that rather than asserting it.
  ['beginner', 'krakama_beta_ratio', 'ratio', 1e-12],
  ['beginner', 'krakama_differential_psi', 'psi', 1e-9],
  ['beginner', 'krakama_transmitter_uncertainty_pct', 'pct', 1e-9],
  ['beginner', 'krakama_flow_turndown_ratio', 'ratio', 1e-12],
  ['beginner', 'krakama_total_uncertainty_pct', 'pct', 1e-9],
  ['beginner', 'krakama_turbine_gross_bbl', 'bbl', 1e-6],
  // Professional: UTONANA, a control valve on a hot condensate transfer. THE
  // CHOKING BOUNDARY AND WHAT SITS EITHER SIDE OF IT. The capstone STATES the
  // certified FL and the rangeability for this trim, which is what takes the
  // engine's own valve style table out of every chain below.
  ['intermediate', 'utonana_ff_critical_ratio', 'ratio', 1e-12],
  ['intermediate', 'utonana_allowable_drop_psi', 'psi', 1e-9],
  ['intermediate', 'utonana_liquid_cv', 'cv', 1e-9],
  ['intermediate', 'utonana_cavitation_sigma', 'ratio', 1e-12],
  ['intermediate', 'utonana_valve_authority', 'ratio', 1e-12],
  ['intermediate', 'utonana_normal_travel_pct', 'pct', 1e-9],
  // Expert: SAGHARA, a fixed-roof tank farm. INVERSION ON THE ENGINE'S OWN
  // VERDICT. Two of the six are found by bisecting an engine call until a
  // returned word turns over, so the answer is the engine's and not an
  // algebraic shortcut around it. The thermal venting factors, the allowable
  // stresses and the minimum plate thickness are STATED by the capstone,
  // because the engine says of every one of them that it is its own stated
  // choice rather than a value read from a standard.
  ['advanced', 'saghara_bottom_course_required_in', 'inch', 1e-9],
  ['advanced', 'saghara_sg_at_which_test_governs', 'ratio', 1e-9],
  ['advanced', 'saghara_inbreathing_scfh', 'scfh', 1e-6],
  ['advanced', 'saghara_vacuum_governing_draw_bblhr', 'bblPerHr', 1e-6],
  ['advanced', 'saghara_working_capacity_bbl', 'bbl', 1e-6],
  ['advanced', 'saghara_recovery_saved_lb_yr', 'lbPerYr', 1e-6],
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
  if (!row) throw new Error(`${key} is not one of the eighteen graded FC8 fields`);
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
 * digest header names quantities in English and the keys are code, and the
 * word "ratio" appears on a beta, on a critical pressure ratio, on a turndown
 * and on a specific gravity, while "pct" appears on an uncertainty and on a
 * valve travel. A precision check that classifies seventeen fields out of
 * eighteen is an unrun check rather than a pass, so the map is per field key.
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
