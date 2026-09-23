// THE GRADING TOLERANCE OF EVERY D1 CAPSTONE FIELD, DERIVED IN ONE PLACE.
//
// Carried forward from H1, which carried it from FC3, FC5 and FC9: a field's
// tolerance lived in three places (the capstone generator, fields.json and a
// hand-kept mirror in the teaching lab) and the copies went stale. Here it is
// made once:
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
 * What the D1 teaching digest prints each quantity class to. The digest header
 * is the authority, and it reads:
 *
 *   "Every measured value, statistic, limit, fraction, score, step and
 *    difference prints to SIX decimals; counts, entry numbers and days are
 *    whole numbers; relative differences print in exponent form."
 */
export const PRINTED_DECIMALS = {
  fraction: 6, measure: 6, statistic: 6, limit: 6, score: 6,
};

/**
 * The eighteen graded fields in their published order: tier, key, quantity
 * class, and the tolerance this wave STATED. A key names what it measures and
 * carries its unit as a suffix where it has one.
 */
export const GRADED_FIELDS = [
  // Associate: a well log, a SCADA time index and a production sheet. IS THE
  // DATA FIT TO USE: completeness, coverage, the index step, water cut on a
  // liquid basis, a cumulative that falls, a phase-sum tolerance. No outlier
  // statistic and no chart.
  ['beginner', 'odudu_rhob_completeness', 'fraction', 1e-9],
  ['beginner', 'odudu_nphi_coverage', 'fraction', 1e-9],
  ['beginner', 'odudu_scada_expected_step_h', 'measure', 1e-9],
  ['beginner', 'odudu_water_cut_day23', 'fraction', 1e-9],
  ['beginner', 'odudu_cumulative_drop_bbl', 'measure', 1e-9],
  ['beginner', 'odudu_phase_sum_allowed_day44_bbl_d', 'measure', 1e-9],
  // Professional: core plugs, a density interval and a density-neutron cloud.
  // WHICH VALUES STAND APART: the z ceiling, the modified z-score, a Tukey
  // fence, a Hampel threshold, a Grubbs critical value, a Mahalanobis distance.
  ['intermediate', 'ikoro_core_max_abs_z', 'statistic', 1e-9],
  ['intermediate', 'ikoro_core_max_abs_modified_z', 'statistic', 1e-9],
  ['intermediate', 'ikoro_rhob_upper_fence_g_cm3', 'limit', 1e-9],
  ['intermediate', 'ikoro_rhob_hampel_threshold_entry57_g_cm3', 'limit', 1e-9],
  ['intermediate', 'ikoro_core_grubbs_critical', 'statistic', 1e-9],
  ['intermediate', 'ikoro_max_mahalanobis_d2', 'statistic', 1e-9],
  // Expert: a casing pressure in two phases and a stated scorecard. HAS THE
  // PROCESS CHANGED: individuals and moving range limits from phase one, EWMA
  // and CUSUM on phase two, and a weighted scorecard.
  ['advanced', 'amasiri_phase1_individuals_ucl_psig', 'limit', 1e-9],
  ['advanced', 'amasiri_phase1_mr_ucl_psig', 'limit', 1e-9],
  ['advanced', 'amasiri_ewma_day14_psig', 'statistic', 1e-9],
  ['advanced', 'amasiri_ewma_exact_ucl_day2_psig', 'limit', 1e-9],
  ['advanced', 'amasiri_cusum_upper_day18_psi', 'statistic', 1e-9],
  ['advanced', 'amasiri_scorecard_total', 'score', 1e-9],
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
  if (!row) throw new Error(`${key} is not one of the eighteen graded D1 fields`);
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
