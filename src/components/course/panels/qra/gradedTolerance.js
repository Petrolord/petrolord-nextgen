// THE GRADING TOLERANCE OF EVERY H5 CAPSTONE FIELD, DERIVED IN ONE PLACE.
//
// Carried forward from H3 (and H1 and FC9 before it), which removed the CLASS
// of defect where a field's tolerance lived in three places (the capstone
// generator, fields.json and a hand-kept mirror in the teaching lab) and the
// copies went stale. Here it is made once:
//
//     a field's tolerance is  max(stated, half a unit in the last place the
//                                  course PRINTS that class)
//
// MAX AND NEVER MIN, so the rule only ever loosens. A tolerance no printed
// precision can satisfy grades a learner on luck at unprinted digits.
//
// THE GRADER'S TOLERANCE IS ABSOLUTE. public.academy_submit_capstone grades
// abs(v_got - v_exp) <= v_tol, in the field's own units. That is why every
// per-year quantity (a frequency, an individual risk, a PLL) prints to TWELVE
// decimals: an individual risk of a few in a million printed to six decimals
// would be graded to a whole unit of its own size.
//
// Nothing here imports anything, so a node script, a vitest run and a browser
// build all read the same numbers.

/**
 * What the H5 teaching digest prints each quantity class to. The digest header
 * is the authority, and it reads:
 *
 *   "Frequencies, individual risks and PLL per year, and probabilities, print to
 *    TWELVE decimals; FAR values, ratios and fatality counts that need not be
 *    whole print to SIX; money prints to TWO; hours and years are whole
 *    numbers as stated."
 */
export const PRINTED_DECIMALS = {
  peryr: 12, far: 6, ratio: 6, fatalities: 6, gbp: 2,
};

/**
 * The eighteen graded fields in their published order: tier, key, quantity
 * class, and the tolerance this wave STATED. A key names what it measures and
 * carries its unit as a suffix.
 */
export const GRADED_FIELDS = [
  // Associate: one installation, one person. EVENT TREE FREQUENCIES,
  // LOCATION-SPECIFIC INDIVIDUAL RISK AND INDIVIDUAL RISK PER ANNUM. No PLL,
  // no F-N curve, no ALARP band, no cost-benefit.
  ['beginner', 'ukpokiti_compressor_explosion_frequency_per_yr', 'peryr', 1e-15],
  ['beginner', 'ukpokiti_camp_exposure_frequency_per_yr', 'peryr', 1e-15],
  ['beginner', 'ukpokiti_control_room_lsir_per_yr', 'peryr', 1e-15],
  ['beginner', 'ukpokiti_compressor_deck_lsir_per_yr', 'peryr', 1e-15],
  ['beginner', 'ukpokiti_operator_irpa_per_yr', 'peryr', 1e-15],
  ['beginner', 'ukpokiti_technician_irpa_per_yr', 'peryr', 1e-15],
  // Professional: how many at once. PLL, FAR, the F-N curve and the published
  // criteria it is compared with.
  ['intermediate', 'ogini_crew_pll_per_yr', 'peryr', 1e-15],
  ['intermediate', 'ogini_crew_far', 'far', 1e-9],
  ['intermediate', 'ogini_village_frequency_ten_or_more_per_yr', 'peryr', 1e-15],
  ['intermediate', 'ogini_village_vrom_max_ratio', 'ratio', 1e-9],
  ['intermediate', 'ogini_village_exceedance_from_fatalities', 'fatalities', 1e-9],
  ['intermediate', 'ogini_village_r2p2_point_ratio', 'ratio', 1e-9],
  // Expert: is a further measure reasonably practicable. The gross
  // disproportion test, the implied cost of averting a fatality and the
  // largest cost the test allows, under the two published discounting
  // conventions and undiscounted.
  ['advanced', 'ebughu_deluge_cost_to_benefit_ratio', 'ratio', 1e-9],
  ['advanced', 'ebughu_deluge_icaf_gbp', 'gbp', 1e-6],
  ['advanced', 'ebughu_deluge_maximum_reasonably_practicable_cost_gbp', 'gbp', 1e-6],
  ['advanced', 'ebughu_blast_wall_cost_to_benefit_ratio', 'ratio', 1e-9],
  ['advanced', 'ebughu_blast_wall_icaf_gbp', 'gbp', 1e-6],
  ['advanced', 'ebughu_gas_detection_cost_to_benefit_ratio', 'ratio', 1e-9],
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
  if (!row) throw new Error(`${key} is not one of the eighteen graded H5 fields`);
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
