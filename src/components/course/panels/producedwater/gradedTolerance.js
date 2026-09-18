// THE GRADING TOLERANCE OF EVERY FC7 CAPSTONE FIELD, DERIVED IN ONE PLACE.
//
// WHY THIS FILE EXISTS, AND WHY IT EXISTS FROM THE FIRST DAY OF THE WAVE. On
// FC2 and FC3 the tolerance lived in three places: the capstone generator that
// writes fields.json, fields.json itself, and a hand-kept mirror inside the
// teaching lab that the panel tests pinned. Three copies of one number is
// three chances to disagree, and each of those waves shipped a stale third
// copy in the lab before anybody noticed. FC3 ended with one derivation. FC7
// starts with it: producedWaterLab.js, fc7_capstone.mjs and the panel guard all
// import from here, and fields.json is written out of the same derivation, so
// the shipped grader, the lab and the generator cannot drift.
//
// THE RULE, settled for this programme:
//
//     a field's tolerance is max(stated, half a unit in the last place the
//     course PRINTS that class)
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
 * header is the authority, and it reads:
 *
 *   "Densities in kg/m3, cut sizes and droplet medians in micron,
 *    concentrations in ppm, removals in percent, centrifugal fields in g and
 *    dimensionless ratios print to six decimals; viscosities in Pa.s,
 *    velocities in m/s and volume fractions print to twelve."
 *
 * Twelve is not decoration on this wave. A produced water viscosity is about
 * 5e-4 Pa.s and a droplet rise velocity about 8e-5 m/s, so six decimals would
 * leave a learner three significant figures to answer with and the grader
 * would be reading digits the course never printed. The two fine classes are
 * the two whose SI unit is small, and they are printed at twelve for that
 * reason and for no other.
 */
export const PRINTED_DECIMALS = {
  'kg/m3': 6,     // brine and crude densities
  micron: 6,      // cut sizes and droplet medians
  ppm: 6,         // oil in water
  percent: 6,     // a stage or train removal
  g: 6,           // a centrifugal field, in multiples of gravity
  ratio: 6,       // turndown, gas holdup, a Reynolds number
  'Pa.s': 12,     // a water viscosity, about 5e-4
  'm/s': 12,      // a droplet or bubble rise velocity, 8e-5 to 4e-2
  fraction: 12,   // a volume fraction of the droplet distribution
};

/**
 * The eighteen graded fields in their published order, each with the quantity
 * class it belongs to and the tolerance this wave STATED for it. The stated
 * figure is a floor on how tight the field may be graded, never a ceiling: the
 * derivation below raises any of them that the printed precision cannot meet.
 *
 * Four of the eighteen are stated tighter than their class prints and are
 * WIDENED here rather than shipped unanswerable: the four `ratio` fields are
 * stated at 1e-9 and are graded at 5e-7, because six decimals is what a reader
 * can take off the page.
 *
 * TWO FIELDS WERE REPLACED RATHER THAN WIDENED, on the kit's digest leak gate.
 * The centrifugal field of an overloaded liner bank is ALWAYS 1690 g, because
 * it is the rated field times the square of the operating envelope and the
 * envelope is where it stops rising; and the truncated tail of the droplet grid
 * is ALWAYS 6.3372072e-05 at a four sigma span, because it is twice the normal
 * cdf at the span edge and does not depend on the water at all. Both are
 * therefore printed in the teaching digest, where a candidate could read them
 * off the page without touching their own capstone stream. A graded answer that
 * is a CONSTANT OF THE MODULE is not a hard field, it is a free one. The shear
 * penalty and the mid-train droplet median replaced them: both are properties
 * of the stream being graded.
 */
export const GRADED_FIELDS = [
  // Associate: the water, the oil, one droplet, and two gravity devices.
  ['beginner', 'ogulagha_water_viscosity_pas', 'Pa.s', 1e-12],
  ['beginner', 'ogulagha_water_density_kgm3', 'kg/m3', 1e-4],
  ['beginner', 'ogulagha_oil_density_kgm3', 'kg/m3', 1e-4],
  ['beginner', 'ogulagha_droplet_rise_ms', 'm/s', 1e-10],
  ['beginner', 'ogulagha_basin_cut_micron', 'micron', 1e-6],
  ['beginner', 'ogulagha_plate_cut_micron', 'micron', 1e-6],
  // Professional: the three devices whose cut is not gravity alone.
  ['intermediate', 'izombe_liner_turndown_ratio', 'ratio', 1e-9],
  ['intermediate', 'izombe_cyclone_shear_penalty', 'ratio', 1e-9],
  ['intermediate', 'izombe_cyclone_cut_micron', 'micron', 1e-6],
  ['intermediate', 'izombe_bubble_rise_ms', 'm/s', 1e-10],
  ['intermediate', 'izombe_gas_holdup_ratio', 'ratio', 1e-9],
  ['intermediate', 'izombe_filter_cut_micron', 'micron', 1e-6],
  // Expert: the coupling through a three stage train, and the band.
  ['advanced', 'tunu_cyclone_stage_median_micron', 'micron', 1e-6],
  ['advanced', 'tunu_plate_stage_removal_pct', 'percent', 1e-6],
  ['advanced', 'tunu_cyclone_stage_removal_pct', 'percent', 1e-6],
  ['advanced', 'tunu_train_outlet_ppm', 'ppm', 1e-6],
  ['advanced', 'tunu_train_outlet_median_micron', 'micron', 1e-6],
  ['advanced', 'tunu_coarse_droplet_reynolds', 'ratio', 1e-9],
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
  if (!row) throw new Error(`${key} is not one of the eighteen graded FC7 fields`);
  return { tier: row[0], cls: row[2], stated: row[3] };
};

/** The tolerance a field is graded at. The only place this number is made. */
export const gradedTolerance = (key) => {
  const { cls, stated } = gradedClassOf(key);
  return Math.max(stated, printedFloor(cls));
};

/**
 * The per-field precision declaration, in the shape gradeprecision.py reads.
 * DERIVED from the table above rather than hand kept, so it cannot declare one
 * precision while the tolerance was floored at another.
 *
 * It exists because a word matcher cannot settle this course: the digest names
 * nine quantity classes across two clauses, "ratios" and "fractions" are both
 * dimensionless English words at two different precisions, and gradeprecision
 * REFUSES a wave it cannot classify in full. A per-field declaration is what
 * makes 18 OF 18 CLASSIFIED possible at all.
 */
export const precisionDeclaration = () => {
  const byClass = {};
  GRADED_FIELDS.forEach(([, key, cls]) => {
    (byClass[cls] = byClass[cls] || []).push(key);
  });
  return Object.fromEntries(Object.entries(byClass).sort((a, b) => (a[0] < b[0] ? -1 : 1)).map(([cls, keys]) => [
    cls, { decimals: PRINTED_DECIMALS[cls], match: `^(${keys.slice().sort().join('|')})$` },
  ]));
};

/**
 * Every rendering of a graded answer a leak gate must search for.
 *
 * WHY MORE THAN ONE. FC1's guard string-matched graded answers at NINE
 * significant digits only, and that was proved insufficient by planting both
 * shapes: 2.88817656 was caught, and the same value at full float precision,
 * 2.8881765597102644, walked straight past it and was caught only by a numeric
 * sweep. This engine returns Reynolds numbers, cut sizes and medians at full
 * precision through several coupled devices, so the full float shape is the
 * likely one here, not the exotic one.
 */
export const renderings = (value, cls) => {
  const out = new Set();
  if (!Number.isFinite(value)) return [];
  out.add(String(value));                                   // full float
  out.add(value.toPrecision(9).replace(/\.?0+$/, ''));       // nine significant digits
  out.add(value.toPrecision(9));
  if (cls && Number.isInteger(PRINTED_DECIMALS[cls])) {
    out.add(value.toFixed(PRINTED_DECIMALS[cls]));            // as the digest prints it
  }
  out.add(value.toExponential(6));
  return [...out].filter((s) => s.includes('.'));
};
