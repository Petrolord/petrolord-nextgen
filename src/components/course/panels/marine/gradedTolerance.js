// THE GRADING TOLERANCE OF EVERY SC4 CAPSTONE FIELD, DERIVED IN ONE PLACE.
//
// Carried forward from EC11 prms, EC10 farmout, EC9 joa, EC8 gsa, EC7 pia,
// SC2 procurement and D5 appliedai (and before them D4, D3, D2, D1, H1, FC3,
// FC5 and FC9): a field's tolerance is made once, here,
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
 * What the SC4 teaching digest prints each quantity class to. The digest
 * header is the authority, and it reads:
 *
 *   "Every distance, speed, time in hours or days, vessel-day, fuel tonnage,
 *    amount of money, area, weight, volume, fraction, utilisation,
 *    probability, factor, count that is not whole and queue figure prints to
 *    SIX decimals; ..."
 */
export const PRINTED_DECIMALS = {
  time: 6, mass: 6, money: 6, ratio: 6, area: 6, count: 6,
};

/**
 * The eighteen graded fields in their published order: tier, key, quantity
 * class, and the tolerance this wave STATED.
 *
 * EVERY STATED TOLERANCE IS 1e-9. No SC4 field rests on a search tolerance, a
 * fit or a random draw: every one is the engine's closed-form arithmetic on
 * stated inputs (leg distances over a speed, hours times a weather factor and
 * a burn rate, a sum of loads, a load over a capacity, the largest demand
 * ratio, a voyage count times voyage days, a first-fit decreasing packing of
 * stated footprints, the Erlang C delay probability and mean wait by the
 * stable recursion, the Cosmetatos M/D/c approximation, the fewest berths
 * meeting a stated wait by an exhaustive count), which the vendored stdlib
 * oracle (tools/validation/supplychain/oracle_marine.py, written from the
 * published equations with exact fractions) replays in oracle_check.py. No
 * field comes from the Monte Carlo of fleetVariability. The printed floor,
 * half a unit in the sixth decimal, therefore sets every tolerance, and
 * discriminate.mjs requires every wrong method to land outside it and every
 * stated reading of the engine to leave the field exactly where it is. A time
 * is in hours or days as its key says, a mass in tonnes, money in US$, an
 * area in square metres, a ratio a plain fraction, a count a number of
 * voyages, vessels or vessels in the queue. A key names what it measures: the
 * capstone, the call and the figure.
 */
export const GRADED_FIELDS = [
  // Associate: NKEREFI, an Ekene synthetic cluster of three installations
  // served by one PSV. VOYAGES, CAPACITY AND THE BINDING CONSTRAINT: the milk
  // run's hours, fuel and fuel cost with the weather factor on the stated
  // activities, its deadweight load from the stated densities, the binding
  // constraint's utilisation, and the days of the dedicated voyages.
  ['beginner', 'nkerefi_milkrun_hours', 'time', 1e-9],
  ['beginner', 'nkerefi_milkrun_fuel_t', 'mass', 1e-9],
  ['beginner', 'nkerefi_milkrun_fuel_cost', 'money', 1e-9],
  ['beginner', 'nkerefi_milkrun_deadweight_t', 'mass', 1e-9],
  ['beginner', 'nkerefi_binding_utilisation', 'ratio', 1e-9],
  ['beginner', 'nkerefi_dedicated_days', 'time', 1e-9],
  // Professional: AKOKWA, an Ekene synthetic cluster of four installations and
  // one voyage of deck cargo. FLEET SIZING AND DECK PLANNING: the voyages of
  // demand before rounding, the vessel-days, the vessels before rounding and
  // the spare vessel-days for the week, and the first-fit decreasing plan's
  // first-voyage area and second-voyage deck load utilisation.
  ['intermediate', 'akokwa_voyages_exact', 'count', 1e-9],
  ['intermediate', 'akokwa_vessel_days', 'time', 1e-9],
  ['intermediate', 'akokwa_vessels_exact', 'count', 1e-9],
  ['intermediate', 'akokwa_spare_vessel_days', 'time', 1e-9],
  ['intermediate', 'akokwa_ffd_v1_area_m2', 'area', 1e-9],
  ['intermediate', 'akokwa_ffd_v2_load_utilisation', 'ratio', 1e-9],
  // Expert: MGBIDI, an Ekene synthetic supply base with three berths on a
  // twenty-hour working day. SHORE BASE QUEUES: the M/M/c mean wait, delay
  // probability and mean time at the base, the M/D/c mean wait and mean
  // queue, and the M/M/c mean wait at the fewest berths meeting a stated
  // target, every field free of every stated reading and of every draw.
  ['advanced', 'mgbidi_mmc_wait_hours', 'time', 1e-9],
  ['advanced', 'mgbidi_mmc_probability_wait', 'ratio', 1e-9],
  ['advanced', 'mgbidi_mmc_time_at_base_hours', 'time', 1e-9],
  ['advanced', 'mgbidi_mdc_wait_hours', 'time', 1e-9],
  ['advanced', 'mgbidi_mdc_mean_queue', 'count', 1e-9],
  ['advanced', 'mgbidi_target_wait_hours', 'time', 1e-9],
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
  if (!row) throw new Error(`${key} is not one of the eighteen graded SC4 fields`);
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
