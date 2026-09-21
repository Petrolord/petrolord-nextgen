// THE GRADING TOLERANCE OF EVERY H2 HYGIENE CAPSTONE FIELD, DERIVED IN ONE PLACE.
//
// Carried forward from the facilities waves (FC3 removed the CLASS of defect
// where a tolerance lived in three copies; FC5 and FC9 kept the repair). The
// capstone generator, make_fields.mjs, the teaching lab and the panel guard all
// import this file, so the number is made once.
//
// THE RULE, settled for this programme:
//
//     a field's tolerance is  max(stated, half a unit in the last place the
//                                  course PRINTS that class)
//
// MAX AND NEVER MIN, so the rule only ever loosens. A tolerance no printed
// precision can satisfy is a broken field: a learner who reads the right row,
// quotes it to the precision the course told them to, and still fails has been
// graded on luck.
//
// The grader is public.academy_submit_capstone, which marks a field correct when
// abs(got - expected) <= tol. The tolerance is ABSOLUTE, in the field's own units.
//
// Nothing here imports anything, so a node script, a vitest run and a browser
// build all read the same numbers.
//
// WHAT IS SPECIAL ABOUT H2. The engine's noise, chemical and protector arithmetic
// is checked against values the sources PRINT (1910.95 Tables G-16a and A-1,
// NIOSH 98-126 Tables 1-1 and 1-2, the OSHA Technical Manual Table IV-3 and its
// Appendix E worked example, HSE L108 Figure 26, the 1910.1000(d) worked
// examples, the BC reduction factors). The NIOSH 2016 heat equations (RAL and
// REL) and the WBGT weights are checked for TRANSCRIPTION ONLY: no public
// printed value reproduces them, and NIOSH's own worked example disagrees with
// its own equation. So this course TEACHES those equations and GRADES NOTHING
// that passes through them. The two heat fields below are time weighted averages
// of readings the capstone STATES, which is arithmetic by definition.

/**
 * What the H2 teaching digest prints each quantity class to. The digest's own
 * header is the authority, and it reads:
 *
 *   "Sound levels and exposure levels in dBA, doses and percentages, durations
 *    in hours and in minutes, concentrations in ppm, exposure indices and every
 *    dimensionless ratio, temperatures in degrees C and metabolic rates in watts
 *    print to SIX decimals; measured constants print to TWELVE; counts are whole
 *    numbers."
 *
 * Every class below is one clause of that sentence. The twelve-decimal class
 * carries no graded field: a measured constant is evidence about the engine and
 * never an answer a learner types.
 */
export const PRINTED_DECIMALS = {
  dba: 6, pct: 6, min: 6, ppm: 6, ratio: 6, degC: 6, watt: 6,
};

/**
 * The eighteen graded fields in their published order, each with the quantity
 * class it belongs to and the tolerance this wave STATED for it. The stated
 * figure is a floor on how tight the field may be graded; the derivation below
 * raises any that the printed precision cannot meet.
 *
 * THE THREE SITE NAMES LIVE IN THE KEYS AND NOWHERE ELSE IN THIS FILE. The panel
 * guard strips the eighteen keys and then requires that no site name survives.
 */
export const GRADED_FIELDS = [
  // Associate: the first site, one operator's eight-hour dosimeter day. NOISE
  // DOSE AND TWA UNDER THREE CRITERIA. Every value here is reproduced by a table
  // the source prints.
  ['beginner', 'utorogu_osha_pel_dose_pct', 'pct', 1e-9],
  ['beginner', 'utorogu_osha_pel_twa_dba', 'dba', 1e-9],
  ['beginner', 'utorogu_action_level_dose_pct', 'pct', 1e-9],
  ['beginner', 'utorogu_niosh_rel_dose_pct', 'pct', 1e-9],
  ['beginner', 'utorogu_niosh_rel_twa_dba', 'dba', 1e-9],
  ['beginner', 'utorogu_pel_minutes_left_min', 'min', 1e-9],
  // Professional: the second site, a maintenance crew on a floating production
  // vessel. LEX,8h, THE ENGINEERING-CONTROLS PROTECTOR ESTIMATE, AND THE CHEMICAL
  // AVERAGES. Every value is reproduced by a worked example the source prints.
  ['intermediate', 'amukpe_lex_8h_dba', 'dba', 1e-9],
  ['intermediate', 'amukpe_lex_weekly_dba', 'dba', 1e-9],
  ['intermediate', 'amukpe_field_derated_exposure_dba', 'dba', 1e-9],
  ['intermediate', 'amukpe_benzene_twa8h_ppm', 'ppm', 1e-9],
  ['intermediate', 'amukpe_toluene_stel_ppm', 'ppm', 1e-9],
  ['intermediate', 'amukpe_mixture_index', 'ratio', 1e-9],
  // Expert: the third site, a hot-season turnaround on extended shifts. THE
  // SHIFT THAT IS NOT EIGHT HOURS, AND THE HEAT INPUTS. No RAL, REL, margin,
  // exceedance verdict or WBGT built from thermometer readings is graded.
  ['advanced', 'osioka_wbgt_twa_c', 'degC', 1e-9],
  ['advanced', 'osioka_metabolic_twa_w', 'watt', 1e-9],
  ['advanced', 'osioka_extended_action_level_dba', 'dba', 1e-9],
  ['advanced', 'osioka_extended_action_dose_pct', 'pct', 1e-9],
  ['advanced', 'osioka_adjusted_limit_ppm', 'ppm', 1e-9],
  ['advanced', 'osioka_adjusted_mixture_index', 'ratio', 1e-9],
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
  if (!row) throw new Error(`${key} is not one of the eighteen graded H2 fields`);
  return { tier: row[0], cls: row[2], stated: row[3] };
};

/** The tolerance a field is graded at. The only place this number is made. */
export const gradedTolerance = (key) => {
  const { cls, stated } = gradedClassOf(key);
  return Math.max(stated, printedFloor(cls));
};

/**
 * The per-field precision declaration, in the shape `gradeprecision.py` reads,
 * DERIVED from the table above so it cannot declare one precision while the
 * tolerance was floored at another.
 */
export const precisionDeclaration = () => {
  const byClass = {};
  GRADED_FIELDS.forEach(([, key, cls]) => {
    (byClass[cls] = byClass[cls] || []).push(key);
  });
  return Object.fromEntries(Object.entries(byClass).sort().map(([cls, keys]) => [
    cls, { decimals: PRINTED_DECIMALS[cls], match: `^(?:${[...keys].sort().join('|')})$` },
  ]));
};
