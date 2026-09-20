// THE GRADING TOLERANCE OF EVERY H3 CAPSTONE FIELD, DERIVED IN ONE PLACE.
//
// Carried forward from H1 and FC9, which removed the CLASS of defect where a
// field's tolerance lived in three places (the capstone generator, fields.json
// and a hand-kept mirror in the teaching lab) and the copies went stale. Here
// it is made once:
//
//     a field's tolerance is  max(stated, half a unit in the last place the
//                                  course PRINTS that class)
//
// MAX AND NEVER MIN, so the rule only ever loosens. A tolerance no printed
// precision can satisfy grades a learner on luck at unprinted digits.
//
// THE GRADER'S TOLERANCE IS ABSOLUTE. public.academy_submit_capstone grades
// abs(v_got - v_exp) <= v_tol, in the field's own units. That is why the two
// small-number classes (frequencies per year and PFDavg) print to TWELVE
// decimals: at six decimals a PFDavg of a few parts in ten thousand would be
// graded to one part in a thousand, and a wrong method that moves it by less
// than that would score.
//
// Nothing here imports anything, so a node script, a vitest run and a browser
// build all read the same numbers.

/**
 * What the H3 teaching digest prints each quantity class to. The digest header
 * is the authority, and it reads:
 *
 *   "Frequencies per year, probabilities, IPL PFDs and PFDavg values print to TWELVE
 *    decimals; risk reduction factors, hours and years print to SIX; failure
 *    rates per hour print in exponent form as stated; counts and SIL numbers
 *    are whole numbers."
 */
export const PRINTED_DECIMALS = {
  freq: 12, pfd: 12, rrf: 6, hours: 6,
};

/**
 * The eighteen graded fields in their published order: tier, key, quantity
 * class, and the tolerance this wave STATED. A key names what it measures and
 * carries its unit as a suffix.
 */
export const GRADED_FIELDS = [
  // Associate: one LOPA worksheet of four scenarios. FREQUENCIES, CREDIT AND
  // THE REQUIRED RISK REDUCTION. No PFDavg equation, no proof test interval.
  ['beginner', 'akpo_separator_unmitigated_frequency_per_yr', 'freq', 1e-15],
  ['beginner', 'akpo_separator_required_rrf', 'rrf', 1e-9],
  ['beginner', 'akpo_tank_mitigated_frequency_without_sif_per_yr', 'freq', 1e-15],
  ['beginner', 'akpo_tank_required_sif_pfdavg', 'pfd', 1e-15],
  ['beginner', 'akpo_compressor_mitigated_frequency_with_sif_per_yr', 'freq', 1e-15],
  ['beginner', 'akpo_export_catalogue_sif_mitigated_frequency_per_yr', 'freq', 1e-15],
  // Professional: one safety instrumented function, subsystem by subsystem.
  // PFDavg BY THE ANNEX B FORMS, the series sum, and the loop back to the TMEL.
  ['intermediate', 'usan_transmitters_2oo3_pfdavg', 'pfd', 1e-15],
  ['intermediate', 'usan_logic_solver_1oo1_pfdavg', 'pfd', 1e-15],
  ['intermediate', 'usan_valves_1oo2_pfdavg', 'pfd', 1e-15],
  ['intermediate', 'usan_sif_rrf', 'rrf', 1e-9],
  ['intermediate', 'usan_proposed_2oo2_transmitters_pfdavg', 'pfd', 1e-15],
  ['intermediate', 'usan_mitigated_frequency_with_sif_per_yr', 'freq', 1e-15],
  // Expert: the proof test. LONGEST INTERVALS, IMPERFECT COVERAGE, THE FLOOR
  // NO INTERVAL CAN REACH BELOW, and a SIF re-verified at a stretched interval.
  ['advanced', 'yoho_valves_1oo2_max_interval_hours', 'hours', 1e-9],
  ['advanced', 'yoho_valve_1oo1_ptc_pfdavg', 'pfd', 1e-15],
  ['advanced', 'yoho_valve_1oo1_ptc_max_interval_hours', 'hours', 1e-9],
  ['advanced', 'yoho_transmitter_ptc_floor_pfdavg', 'pfd', 1e-15],
  ['advanced', 'yoho_sif_rrf_at_three_year_interval', 'rrf', 1e-9],
  ['advanced', 'yoho_transmitters_2oo3_max_interval_hours', 'hours', 1e-9],
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
  if (!row) throw new Error(`${key} is not one of the eighteen graded H3 fields`);
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
