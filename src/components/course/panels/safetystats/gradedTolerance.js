// THE GRADING TOLERANCE OF EVERY H1 CAPSTONE FIELD, DERIVED IN ONE PLACE.
//
// Carried forward from FC3, FC5 and FC9, which removed the CLASS of defect
// where a field's tolerance lived in three places (the capstone generator,
// fields.json and a hand-kept mirror in the teaching lab) and the copies went
// stale. Here it is made once:
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
 * What the H1 teaching digest prints each quantity class to. The digest header
 * is the authority, and it reads:
 *
 *   "Rates on every base, interval limits, rate ratios, p-values, proportions,
 *    exposure units and centre lines print to SIX decimals; chi-square and
 *    gamma quantities print to TWELVE; counts and hours are whole numbers."
 *
 * The twelve-decimal class carries no graded field.
 */
export const PRINTED_DECIMALS = {
  rate: 6, ratio: 6, p: 6,
};

/**
 * The eighteen graded fields in their published order: tier, key, quantity
 * class, and the tolerance this wave STATED. A key names what it measures and
 * carries its base as a suffix, so a learner can see which base to answer on.
 */
export const GRADED_FIELDS = [
  // Associate: a terminal's annual report and its monthly series. RATES AND
  // BASES, and sum-then-divide. No interval, no test, no chart.
  ['beginner', 'okrika_combined_trir_per_200k', 'rate', 1e-9],
  ['beginner', 'okrika_combined_ltir_per_1m', 'rate', 1e-9],
  ['beginner', 'okrika_far_per_100m', 'rate', 1e-9],
  ['beginner', 'okrika_severity_rate_per_200k', 'rate', 1e-9],
  ['beginner', 'okrika_tier1_pse_rate_per_200k', 'rate', 1e-9],
  ['beginner', 'okrika_rolling12_trir_month14_per_200k', 'rate', 1e-9],
  // Professional: two contractor crews and a small crew with no events.
  // UNCERTAINTY: the exact interval, the zero-event limit, and the comparison.
  ['intermediate', 'bonny_alpha_trir_lower95_per_200k', 'rate', 1e-9],
  ['intermediate', 'bonny_alpha_trir_upper95_per_200k', 'rate', 1e-9],
  ['intermediate', 'bonny_crew_zero_event_upper95_per_200k', 'rate', 1e-9],
  ['intermediate', 'bonny_rate_ratio_lower95', 'ratio', 1e-9],
  ['intermediate', 'bonny_rate_ratio_upper95', 'ratio', 1e-9],
  ['intermediate', 'bonny_compare_p_value', 'p', 1e-9],
  // Expert: a year of monthly recordables on a u-chart, and the judgement a
  // signal calls for. MONITORING: centre, limits, a revised centre, and two
  // before-and-after comparisons that disagree for a reason.
  ['advanced', 'forcados_centre_per_200k', 'rate', 1e-9],
  ['advanced', 'forcados_ucl_month09_per_200k', 'rate', 1e-9],
  ['advanced', 'forcados_lcl_month07_per_200k', 'rate', 1e-9],
  ['advanced', 'forcados_revised_centre_per_200k', 'rate', 1e-9],
  ['advanced', 'forcados_before_after_p_value', 'p', 1e-9],
  ['advanced', 'forcados_before_after_p_value_without_month06', 'p', 1e-9],
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
  if (!row) throw new Error(`${key} is not one of the eighteen graded H1 fields`);
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
