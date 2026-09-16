// THE GRADING TOLERANCE OF EVERY FC3 CAPSTONE FIELD, DERIVED IN ONE PLACE.
//
// WHY THIS FILE EXISTS. The tolerance used to live in three places: the
// capstone generator that writes fields.json, fields.json itself, and a
// hand-kept mirror inside rotatingLab.js that the panel and lab tests pinned.
// Three copies of one number is three chances to disagree, and a test that
// pins a mirror only tells you the mirror is stale AFTER somebody notices the
// failure. FC2 carried the same three copies and repaired only two of them.
//
// So nothing holds a tolerance any more. This file holds the two things a
// tolerance is MADE of, the quantity class a field belongs to and the
// tolerance the wave stated for it, and derives the rest. rotatingLab.js and
// fc3_capstone.mjs both import from here, and fields.json is written out of
// the same derivation, so the shipped grader, the lab and the generator cannot
// drift.
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
 * What the teaching digest prints each quantity class to. The digest's own
 * header is the authority: "Pump work prints to six decimals (gpm, ft, psi,
 * hp, kW, ratios, percentages); gas work to four (ft lbf per lbm, Btu per hr,
 * acfm, degF); exponents, small factors and MMscfd to nine".
 *
 * gasHp is the one that is not obvious. The header puts horsepower in the
 * six-decimal class, and the digest's Section 11 prints gas horsepower with
 * the four-decimal gas formatter. FOUR IS THE NUMBER A READER CAN TAKE OFF THE
 * PAGE, so four sets the floor.
 */
export const PRINTED_DECIMALS = {
  gpm: 6, ft: 6, psi: 6, pumpHp: 6, kW: 6,   // the pump classes
  gasHp: 4, degF: 4, ftLbfPerLbm: 4,         // the gas classes
  exponent: 9, ratio: 9, MMscfd: 9,          // exponents, small factors, MMscfd
};

/**
 * The eighteen graded fields in their published order, each with the quantity
 * class it belongs to and the tolerance this wave STATED for it. The stated
 * figure is a floor on how tight the field may be graded, never a ceiling: the
 * derivation below raises any of them that the printed precision cannot meet.
 */
export const GRADED_FIELDS = [
  // Associate: one pump against one station, end to end.
  ['beginner', 'escravos_duty_flow_gpm', 'gpm', 1e-4],
  ['beginner', 'escravos_duty_head_ft', 'ft', 1e-5],
  ['beginner', 'escravos_hydraulic_hp', 'pumpHp', 1e-6],
  ['beginner', 'escravos_brake_hp', 'pumpHp', 1e-6],
  ['beginner', 'escravos_motor_input_kw', 'kW', 1e-6],
  ['beginner', 'escravos_discharge_psi', 'psi', 1e-7],
  // Professional: the suction side, an exact affinity law, and a second machine.
  ['intermediate', 'bonga_pressure_head_ft', 'ft', 1e-7],
  ['intermediate', 'bonga_npsha_ft', 'ft', 1e-7],
  ['intermediate', 'bonga_npsha_raised_ft', 'ft', 1e-7],
  ['intermediate', 'bonga_speed_flow_gpm', 'gpm', 1e-4],
  ['intermediate', 'bonga_speed_head_ft', 'ft', 1e-5],
  ['intermediate', 'bonga_parallel_flow_gpm', 'gpm', 1e-4],
  // Expert: the thermodynamic path and what the driver burns for it.
  ['advanced', 'bonny_exponent_ratio', 'exponent', 1e-12],
  ['advanced', 'bonny_ratio_per_stage', 'ratio', 1e-9],
  ['advanced', 'bonny_stage1_discharge_f', 'degF', 1e-5],
  ['advanced', 'bonny_stage1_poly_head', 'ftLbfPerLbm', 1e-2],
  ['advanced', 'bonny_stage1_gas_hp', 'gasHp', 1e-5],
  ['advanced', 'bonny_fuel_mmscfd', 'MMscfd', 1e-9],
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
 * digest header states three of its four clauses with "decimals" elided, and
 * the word "ratio" is in two of them, because a pump speed ratio prints to six
 * and a compression stage ratio prints to nine. Only a per-field declaration
 * says which is which.
 */
export const precisionDeclaration = () => {
  const byClass = {};
  GRADED_FIELDS.forEach(([, key, cls]) => {
    (byClass[cls] = byClass[cls] || []).push(key);
  });
  return Object.fromEntries(Object.entries(byClass).map(([cls, keys]) => [
    cls, { decimals: PRINTED_DECIMALS[cls], match: `^(${keys.join('|')})$` },
  ]));
};
