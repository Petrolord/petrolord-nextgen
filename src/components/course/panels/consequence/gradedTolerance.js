// THE GRADING TOLERANCE OF EVERY H4 CAPSTONE FIELD, DERIVED IN ONE PLACE.
//
// Carried forward from H1, H3 and FC9, which removed the CLASS of defect where
// a field's tolerance lived in three places (the capstone generator,
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
// abs(v_got - v_exp) <= v_tol, in the field's own units. That is why one
// dimensionless class, the view factor, prints to more places than the classes
// that carry a unit: a view factor of a few hundredths printed to six decimals
// would be graded to about one part in a thousand, and a wrong method that
// moves it by less than that would score. A lethality probability stays at SIX
// decimals, which is the accuracy the standard normal CDF this engine uses
// carries (Abramowitz and Stegun 7.1.26, absolute error at most 1.5e-7);
// printing one to twelve would promise precision the model does not have.
//
// Nothing here imports anything, so a node script, a vitest run and a browser
// build all read the same numbers.

/**
 * What the H4 teaching digest prints each quantity class to. The digest header
 * is the authority, and it reads:
 *
 *   "Mass rates in kg/s, distances and diameters in m, flame tilt in degrees,
 *    concentrations in ppm and mg/m3, heat fluxes and surface emissive powers
 *    in W/m2, overpressures in Pa, probit values, probit doses and lethality
 *    probabilities print to SIX decimals; view factors print to TWELVE; stated
 *    inputs, failure rates, temperatures and pressures print as typed; counts
 *    are whole numbers."
 */
export const PRINTED_DECIMALS = {
  kgPerS: 6,
  m: 6,
  ppm: 6,
  deg: 6,
  wPerM2: 6,
  pa: 6,
  viewFactor: 12,
  probability: 6,
};

// NO INVERSE OF THE NORMAL CDF IS GRADED. probabilityToProbit and
// probitDoseForProbability invert the engine's Abramowitz and Stegun CDF by
// bisection, and at a one percent probability the dose they return differs from
// the exact inverse by about one part in a million (0.14 on a dose near 1.5e5).
// That is a thousand times any printed-precision tolerance, so a learner with an
// exact inverse normal would be marked wrong. The inverse is taught and never
// graded; the forward probabilities agree with an exact CDF to six decimals.

/**
 * The eighteen graded fields in their published order: tier, key, quantity
 * class, and the tolerance this wave STATED. A key names what it measures and
 * carries its unit as a suffix.
 */
export const GRADED_FIELDS = [
  // Associate: OKAN. HOW MUCH GETS OUT AND WHERE DOES IT GO. Source terms and
  // the Gaussian plume. No fire, no blast and no probit.
  ['beginner', 'okan_condensate_leak_mass_rate_kg_s', 'kgPerS', 1e-12],
  ['beginner', 'okan_gas_riser_choked_mass_rate_kg_s', 'kgPerS', 1e-12],
  ['beginner', 'okan_vent_subsonic_mass_rate_kg_s', 'kgPerS', 1e-12],
  ['beginner', 'okan_deck_spill_equivalent_diameter_m', 'm', 1e-12],
  ['beginner', 'okan_plume_receptor_concentration_ppm', 'ppm', 1e-12],
  ['beginner', 'okan_plume_far_distance_m', 'm', 1e-9],
  // Professional: YOKRI. WHAT DOES THE FIRE RADIATE. The solid flame chain,
  // flame length to heat flux. No point source and no setback distance.
  ['intermediate', 'yokri_flame_length_with_wind_m', 'm', 1e-12],
  ['intermediate', 'yokri_flame_tilt_deg', 'deg', 1e-12],
  ['intermediate', 'yokri_surface_emissive_power_mudan_w_m2', 'wPerM2', 1e-12],
  ['intermediate', 'yokri_surface_emissive_power_actual_w_m2', 'wPerM2', 1e-12],
  ['intermediate', 'yokri_view_factor_max', 'viewFactor', 1e-15],
  ['intermediate', 'yokri_solid_flame_heat_flux_w_m2', 'wPerM2', 1e-12],
  // Expert: PENNINGTON. WHO IS HURT. The blast field and the probits that turn
  // a dose into a probability, and back.
  ['advanced', 'pennington_blast_overpressure_pa', 'pa', 1e-12],
  ['advanced', 'pennington_blast_distance_for_overpressure_m', 'm', 1e-9],
  ['advanced', 'pennington_overpressure_fatality_probability', 'probability', 1e-12],
  ['advanced', 'pennington_thermal_lethality_probability', 'probability', 1e-12],
  ['advanced', 'pennington_toxic_lethality_probability', 'probability', 1e-12],
  ['advanced', 'pennington_ammonia_lethality_probability', 'probability', 1e-12],
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
  if (!row) throw new Error(`${key} is not one of the eighteen graded H4 fields`);
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
