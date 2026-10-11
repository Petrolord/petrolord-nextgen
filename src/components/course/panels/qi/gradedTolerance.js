// THE GRADING TOLERANCE OF EVERY QI CAPSTONE FIELD, DERIVED IN ONE PLACE.
//
// Carried forward from SC4 marine and the waves before it: a field's
// tolerance is made once, here,
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
 * What the QI teaching digest and the panels print each quantity class to.
 * The digest header is the authority: "Every depth (ft), velocity (m/s),
 * density (kg/m3), impedance, modulus, frequency (Hz), time (ms), amplitude,
 * reflection coefficient, intercept, gradient, slope, ratio, fraction ...
 * prints to SIX decimals".
 */
export const PRINTED_DECIMALS = {
  frequency: 6, slope: 6, impedance: 6, ratio: 6, velocity: 6, angle: 6, depth: 6, amplitude: 6, probability: 6, fraction: 6,
};

/**
 * The graded fields in their published order: tier, key, quantity class, and
 * the tolerance this wave STATED.
 *
 * Associate: TAMBERLO, a held-out synthetic feasibility case (one well and a
 * patch of eighteen traces; never the Ekene field). Every field is closed-form
 * engine arithmetic on the case file's own numbers (a padded FFT and the
 * spectrum statistics, an ordinary least squares fit, Batzle-Wang fluids,
 * Wood and Voigt-Reuss-Hill mixes and Gassmann, Shuey's intercept and
 * gradient, a total least squares line through the origin and a perpendicular
 * distance), so the stated tolerance is 1e-9 and the printed floor, half a
 * unit in the sixth decimal, sets every tolerance. No field is a random draw.
 *
 * Expert fields (DELSHOLM) follow in their own block below.
 */
export const GRADED_FIELDS = [
  ['beginner', 'tamberlo_low6_hz', 'frequency', 1e-9],
  ['beginner', 'tamberlo_centroid_hz', 'frequency', 1e-9],
  ['beginner', 'tamberlo_shear_slope', 'slope', 1e-9],
  ['beginner', 'tamberlo_ai_brine', 'impedance', 1e-9],
  ['beginner', 'tamberlo_vpvs_brine', 'ratio', 1e-9],
  ['beginner', 'tamberlo_wet_distance', 'ratio', 1e-9],
  // Professional: QUARVIN, a held-out synthetic prestack case (one NMO-corrected
  // gather, its RMS velocity table, and four wells' modelled and seismic A and
  // B; never the Ekene field). Every field is closed-form engine arithmetic on
  // the case file's numbers (Dix, Walden's straight-ray angle, the NMO
  // stretch, angle binning and a fold-weighted partial stack, a two-term Shuey
  // least squares, the one least-squares scale of engines/qi/avoWells), so the
  // printed floor sets every tolerance. Engines gated by E1a, E1b and E2.
  ['intermediate', 'quarvin_dix_vint', 'velocity', 1e-9],
  ['intermediate', 'quarvin_walden_deg', 'angle', 1e-9],
  ['intermediate', 'quarvin_nmo_stretch', 'ratio', 1e-9],
  ['intermediate', 'quarvin_far_stack_amp', 'amplitude', 1e-9],
  ['intermediate', 'quarvin_shuey_a', 'amplitude', 1e-9],
  ['intermediate', 'quarvin_one_scale', 'ratio', 1e-9],
  // Expert: DELSHOLM, a held-out synthetic case (three wells' low-passed ln(AI)
  // in time with their horizons, a target trace with its stacks, wavelets and
  // supplied low-frequency models, calibration samples and a depth grid in
  // feet; never the Ekene field). Engines gated by E1c (lfm.js) and the
  // engines' own goldens and oracles (inversion.js, prestackInversion.js,
  // propertyPrediction.js, lib/gridding/closure.js).
  // Closed-form fields (inverse-distance LFM, a least-squares transform and its
  // Student-t interval, a Gaussian posterior, the crest-to-spill column of a
  // priority flood) sit at the printed floor.
  // The two solver fields: the engine at the stated iteration count is
  // deterministic arithmetic (CGLS with no random draw and no Math.sin or
  // Math.cos in the loop), and on the case it has converged before the stated
  // count (the field does not move between the stated count and four times it,
  // measured by qi_capstone_e.mjs). The tolerance is set from the engines'
  // measured agreement with the independent pylops oracle in the vendored
  // goldens: post-stack modelBased within 1e-6 in ln(AI)
  // (qi.inversion.test.js), simultaneous within 2e-4 in each ln parameter
  // (qi.prestackInversion.test.js), times a stated safety factor of 10, carried
  // to the field's own units at the field's order of magnitude:
  //   model-based AI:  1e-6 x 10 x an AI of order 6e6 kg/(m2 s), about 60
  //   Vp/Vs:           2e-4 x 2 (ln AI and ln SI) x 10 x a Vp/Vs of order 1.7, about 0.0068
  // Both FAILED the wave's gates. The leak sweeps compare a field against
  // every digest and golden number within ten tolerances in three unit
  // shiftings, and windows that wide reach unrelated literals; and for Vp/Vs
  // two plausible wrong methods (the full-stack wavelet at every angle, a
  // background Vs/Vp of 0.5) move the field by less than 0.0068. The oracle
  // agreement measures the engine against the exact least-squares solution,
  // which is not what a learner reproduces: the learner runs the same engine,
  // whose only browser-dependent arithmetic is Math.sin, Math.tan and Math.exp
  // at ulp level (oracle_check.py's exact normal-equation solve agrees with the
  // converged engine to about 1e-13 relative on this case). So both solver
  // tolerances are set by discrimination, well above any reproduction error:
  // model-based AI 1 kg/(m2 s), Vp/Vs 5e-6 (ten times the printed floor);
  // discriminate.mjs reports every wrong method's distance in these.
  ['advanced', 'delsholm_lfm_lnai_b', 'ratio', 1e-9],
  ['advanced', 'delsholm_mb_ai', 'impedance', 1],
  ['advanced', 'delsholm_sim_vpvs', 'ratio', 5e-6],
  ['advanced', 'delsholm_phi_q90', 'fraction', 1e-9],
  ['advanced', 'delsholm_p_oil', 'probability', 1e-9],
  ['advanced', 'delsholm_column_ft', 'depth', 1e-9],
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
  if (!row) throw new Error(`${key} is not one of the graded QI fields`);
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
