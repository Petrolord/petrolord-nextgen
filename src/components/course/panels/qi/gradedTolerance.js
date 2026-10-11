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
 * Professional and Expert fields are added when their engines pass the
 * extraction gate (golden plus an independent oracle).
 */
export const GRADED_FIELDS = [
  ['beginner', 'tamberlo_low6_hz', 'frequency', 1e-9],
  ['beginner', 'tamberlo_centroid_hz', 'frequency', 1e-9],
  ['beginner', 'tamberlo_shear_slope', 'slope', 1e-9],
  ['beginner', 'tamberlo_ai_brine', 'impedance', 1e-9],
  ['beginner', 'tamberlo_vpvs_brine', 'ratio', 1e-9],
  ['beginner', 'tamberlo_wet_distance', 'ratio', 1e-9],
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
