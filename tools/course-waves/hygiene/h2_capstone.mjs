// THE EIGHTEEN GRADED H2 CAPSTONE ANSWERS, COMPUTED BY THE VENDORED ENGINE.
//
// Three sites, six graded fields each. Every value is a return value of
// engines/hse/exposure.js (vendored sha-identical from petrolord-engines
// b43f1d9; first vendored at 870cc8f), or arithmetic on two such values with the arithmetic stated.
//
//   UTOROGU  Associate     one operator's eight-hour dosimeter day, read
//                          under the OSHA PEL, the OSHA action level and the
//                          NIOSH REL
//   AMUKPE   Professional  a maintenance crew on a floating production vessel:
//                          LEX,8h, a weekly LEX, the engineering-controls
//                          protector estimate, and three chemical averages
//   OSIOKA   Expert        a hot-season turnaround on 11.25 hour shifts: the
//                          shift that is not eight hours, and the two heat
//                          INPUTS a NIOSH assessment is built from
//
// THE HEAT DECISION (BRIEF.md records it with the reason). The NIOSH 2016 RAL
// and REL equations and the WBGT weights are checked for TRANSCRIPTION ONLY:
// no public printed value reproduces them, and NIOSH's own worked example
// (27.8 C at 348.9 W, read off its Figure 8-2) disagrees with its own section
// 8.1 equation (27.459 C). So no graded field passes through a RAL, a REL, a
// margin, an exceedance verdict or a WBGT built from thermometer readings. The
// capstone STATES the WBGT readouts and the metabolic rates, and grades their
// one-hour time weighted averages, which are arithmetic by definition.
//
// Usage:
//   node h2_capstone.mjs              the human table, with the evidence report
//   node h2_capstone.mjs --json       the rows make_fields.mjs writes
//   node h2_capstone.mjs --evidence   the evidence and clearance ledger as JSON
//   node h2_capstone.mjs --inputs     the three frozen scenarios, so the course
//                                     migration RENDERS its prompts from the
//                                     conditions the engine was actually run on
//                                     rather than from a retyped copy of them
//
// NOTHING HERE READS THE DIGEST OR THE DIGEST GENERATOR, and the digest
// generator reads nothing here. gate_capstone_leak.py proves both directions.
import process from 'node:process';

const ROOT = process.env.H2_ENGINES || '/root/wt-h2-nextgen/packages/engines';
const E = await import(`${ROOT}/engines/hse/exposure.js`);
const TOLPATH = process.env.H2_TOLERANCE
  || '/root/wt-h2-nextgen/src/components/course/panels/hygiene/gradedTolerance.js';
const { GRADED_FIELDS, gradedTolerance, PRINTED_DECIMALS } = await import(TOLPATH);

/* ---------------------------------------------------------- the machinery */

const ASSERTS = [];
const must = (claim, cond, detail) => {
  ASSERTS.push({ claim, pass: !!cond, detail: String(detail) });
  return !!cond;
};
const keys = (r) => (r && typeof r === 'object' ? Object.keys(r).join(', ') : String(r));
/** A call this file LABELS a success: no error key, no non-finite number. */
const success = (label, r) => {
  must(`LABELLED A SUCCESS: ${label}`, !!(r && !r.error), r && r.error ? r.error : 'no error key');
  if (r && !r.error) {
    const bad = Object.entries(r).filter(([, v]) => typeof v === 'number' && !Number.isFinite(v));
    must(`SUCCESS CARRIES NO NON-FINITE NUMBER: ${label}`, bad.length === 0,
      bad.length ? bad.map(([k, v]) => `${k}=${v}`).join(', ') : 'every number finite');
  }
  return r;
};
/** A call this file LABELS a refusal: an error key AND the field it names. */
const refusal = (label, r, field) => {
  must(`LABELLED A REFUSAL: ${label}`, !!(r && r.error), r && r.error ? 'refused' : `returned keys [${keys(r)}]`);
  if (field) must(`THE REFUSAL NAMES ${field}: ${label}`, r && r.field === field, `field=${r && r.field}`);
  return r;
};

/* ============================================================ UTOROGU, Associate

   A gas compressor house. One operator, one full-shift dosimeter record of
   eight hours, logged as five periods. The record is read three ways: the
   OSHA PEL setup (criterion 90, exchange 5, threshold 90), the OSHA action
   level setup (the same criterion and exchange, threshold 80, limit 50
   percent) and the NIOSH REL (criterion 85, exchange 3, threshold 80). No
   period sits on a threshold, so the inclusive-threshold judgement (J2) moves
   nothing here, and that is asserted rather than assumed.
   ==================================================================== */

const UTOROGU = Object.freeze({
  periods: Object.freeze([
    Object.freeze({ levelDbA: 86.7, durationH: 2.35 }),
    Object.freeze({ levelDbA: 92.4, durationH: 1.6 }),
    Object.freeze({ levelDbA: 83.3, durationH: 2.2 }),
    Object.freeze({ levelDbA: 96.3, durationH: 0.55 }),
    Object.freeze({ levelDbA: 78.6, durationH: 1.3 }),
  ]),
  loudestDbA: 96.3,
});

const uPel = success('Utorogu noiseDose OSHA_PEL', E.noiseDose(UTOROGU.periods, 'OSHA_PEL'));
const uAl = success('Utorogu noiseDose OSHA_ACTION_LEVEL', E.noiseDose(UTOROGU.periods, 'OSHA_ACTION_LEVEL'));
const uRel = success('Utorogu noiseDose NIOSH_REL', E.noiseDose(UTOROGU.periods, 'NIOSH_REL'));
const uTLoud = success('Utorogu reference duration at the loudest level, OSHA_PEL',
  E.noiseReferenceDurationH(UTOROGU.loudestDbA, 'OSHA_PEL'));
const uMinutesLeft = (1 - uPel.dosePct / 100) * uTLoud.referenceDurationH * 60;

must('Utorogu: the record is exactly eight hours, so no field here is an extended shift', uPel.totalDurationH === 8, uPel.totalDurationH);
must('Utorogu: no period sits on either threshold, so J2 (inclusive threshold) cannot move a field',
  UTOROGU.periods.every((p) => p.levelDbA !== 80 && p.levelDbA !== 90), 'no level equals 80 or 90');
must('Utorogu: the day is under the PEL dose, so the minutes-left field is a real positive number',
  uPel.dosePct < 100 && uMinutesLeft > 0, `${uPel.dosePct}, ${uMinutesLeft}`);
must('Utorogu: the day EXCEEDS the action level while sitting under the PEL, which is the tier\'s lesson',
  uAl.exceedsLimit === true && uPel.exceedsLimit === false, `AL ${uAl.exceedsLimit}, PEL ${uPel.exceedsLimit}`);
must('Utorogu: the NIOSH REL dose exceeds 100 percent on the same day', uRel.exceedsLimit === true, uRel.dosePct);
must('Utorogu: the action level dose integrates periods the PEL setup ignores', uAl.dosePct > uPel.dosePct, `${uAl.dosePct} > ${uPel.dosePct}`);
must('Utorogu: no warning is raised on this record', uPel.warnings.length + uAl.warnings.length + uRel.warnings.length === 0,
  [...uPel.warnings, ...uAl.warnings, ...uRel.warnings].join(' | ') || 'none');

/* ========================================================= AMUKPE, Professional

   A maintenance crew on a floating production vessel. A task-based noise
   survey of one 9.2 hour day, the crew's five daily LEX,8h values for the
   week, a dosimeter's OSHA PEL noise dose (which the learner turns into a TWA
   with the Appendix A formula before derating) and the labelled NRR of the
   earmuff issued, and three
   personal air samples. The benzene record covers 6.35 hours of the shift and
   the capstone STATES that the unsampled time is taken as zero, as the
   regulation's divisor of 8 writes it (J6). The STEL record covers 11.5
   minutes and the capstone STATES the same for the remainder of the window.
   The mixture limits are public OSHA values typed as inputs.
   ==================================================================== */

const AMUKPE = Object.freeze({
  tasks: Object.freeze([
    Object.freeze({ laeqDbA: 89.6, durationH: 1.8 }),
    Object.freeze({ laeqDbA: 82.3, durationH: 3.9 }),
    Object.freeze({ laeqDbA: 98.2, durationH: 0.35 }),
    Object.freeze({ laeqDbA: 76.4, durationH: 2.45 }),
    Object.freeze({ laeqDbA: 93.1, durationH: 0.7 }),
  ]),
  weekLexDbA: Object.freeze([87.9, 84.6, 89.3, 82.2, 85.7]),
  dosimeterPelDosePct: 612.4,
  earmuffNrrDb: 29,
  benzene: Object.freeze([
    Object.freeze({ concentration: 0.86, durationH: 2.4 }),
    Object.freeze({ concentration: 0.34, durationH: 3.15 }),
    Object.freeze({ concentration: 1.73, durationH: 0.8 }),
  ]),
  tolueneShortTerm: Object.freeze([
    Object.freeze({ concentration: 212, durationMin: 6 }),
    Object.freeze({ concentration: 148, durationMin: 5.5 }),
  ]),
  mixture: Object.freeze([
    Object.freeze({ name: 'toluene', concentration: 61.4, limit: 200 }),
    Object.freeze({ name: 'xylene', concentration: 28.3, limit: 100 }),
    Object.freeze({ name: 'cyclohexane', concentration: 97.4, limit: 300 }),
  ]),
});

const aLex = success('Amukpe lexEightHourDbA', E.lexEightHourDbA(AMUKPE.tasks));
const aWeek = success('Amukpe lexWeeklyDbA', E.lexWeeklyDbA(AMUKPE.weekLexDbA));
const aTwa = success('Amukpe noiseTwaFromDoseDbA from the dosimeter PEL dose', E.noiseTwaFromDoseDbA(AMUKPE.dosimeterPelDosePct, 'OSHA_PEL'));
const aField = success('Amukpe hearingProtectorEstimate OSHA_FIELD_50', E.hearingProtectorEstimate({
  exposureDb: aTwa.twaDbA, weighting: 'A', nrrDb: AMUKPE.earmuffNrrDb, method: 'OSHA_FIELD_50',
}));
const aBenz = success('Amukpe chemicalTwa8h benzene', E.chemicalTwa8h(AMUKPE.benzene));
const aStel = success('Amukpe chemicalStel15Min toluene', E.chemicalStel15Min(AMUKPE.tolueneShortTerm));
const aMix = success('Amukpe mixtureExposureIndex', E.mixtureExposureIndex(
  AMUKPE.mixture.map(({ concentration, limit }) => ({ concentration, limit }))));

must('Amukpe: the survey day is longer than eight hours, so dividing by the day length is a real error',
  aLex.totalDurationH > 8, aLex.totalDurationH);
must('Amukpe: five days in the week, so the weekly divisor of 5 (J10) equals the day count and cannot move the field',
  aWeek.days === 5, aWeek.days);
must('Amukpe: the benzene record is short of eight hours and the engine SAYS so',
  aBenz.totalDurationH < 8 && aBenz.warnings.length === 1, aBenz.warnings.join(' | '));
must('Amukpe: the STEL record is short of fifteen minutes and the engine SAYS so',
  aStel.totalDurationMin < 15 && aStel.warnings.length === 1, aStel.warnings.join(' | '));
must('Amukpe: the field derating leaves a positive attenuation, so the floor at zero (J5) is not reached',
  aField.warnings.length === 0 && aField.attenuationDb > 0, aField.attenuationDb);
must('Amukpe: the mixture sits under unity, so J7 (unity passes) is not reached', aMix.index < 1 && aMix.exceeds === false, aMix.index);

/* ============================================================== OSIOKA, Expert

   A flow station turnaround in the hot season, on 11.25 hour shifts, four a
   week, so 45 hours. The heaviest hour of the shift is logged as three work
   periods, each with the WBGT the instrument READ OUT and a metabolic rate
   from the task table. A full-shift action-level dosimeter record. Full-shift
   average concentrations of three solvents with public OSHA limits typed as
   inputs, and a Brief and Scala adjustment of every limit for the schedule.
   ==================================================================== */

const OSIOKA = Object.freeze({
  shiftHours: 11.25,
  weeklyHours: 45,
  wbgtReadouts: Object.freeze([
    Object.freeze({ wbgtC: 31.6, durationMin: 22 }),
    Object.freeze({ wbgtC: 29.3, durationMin: 23 }),
    Object.freeze({ wbgtC: 26.9, durationMin: 15 }),
  ]),
  metabolic: Object.freeze([
    Object.freeze({ metabolicRateW: 418, durationMin: 22 }),
    Object.freeze({ metabolicRateW: 305, durationMin: 23 }),
    Object.freeze({ metabolicRateW: 165, durationMin: 15 }),
  ]),
  dosimeter: Object.freeze([
    Object.freeze({ levelDbA: 85.2, durationH: 3.4 }),
    Object.freeze({ levelDbA: 88.6, durationH: 2.1 }),
    Object.freeze({ levelDbA: 81.6, durationH: 3.3 }),
    Object.freeze({ levelDbA: 91.7, durationH: 0.8 }),
    Object.freeze({ levelDbA: 77.8, durationH: 1.65 }),
  ]),
  xyleneLimitPpm: 100,
  solvents: Object.freeze([
    Object.freeze({ name: 'xylene', concentration: 24.3, limit: 100 }),
    Object.freeze({ name: 'toluene', concentration: 41.8, limit: 200 }),
    Object.freeze({ name: 'n-hexane', concentration: 96.5, limit: 500 }),
  ]),
});

const oWbgt = success('Osioka wbgtTwaC', E.wbgtTwaC(OSIOKA.wbgtReadouts));
const oMet = success('Osioka metabolicRateTwaW', E.metabolicRateTwaW(OSIOKA.metabolic));
const oAlExt = success('Osioka oshaActionLevelForShiftDbA', E.oshaActionLevelForShiftDbA(OSIOKA.shiftHours));
const oDose = success('Osioka noiseDose OSHA_ACTION_LEVEL over the whole shift',
  E.noiseDose(OSIOKA.dosimeter, 'OSHA_ACTION_LEVEL'));
const oAdj = success('Osioka briefScalaAdjustedLimit xylene', E.briefScalaAdjustedLimit({
  limit: OSIOKA.xyleneLimitPpm, shiftHours: OSIOKA.shiftHours, weeklyHours: OSIOKA.weeklyHours,
}));
const adjusted = OSIOKA.solvents.map(({ concentration, limit }) => {
  const a = success(`Osioka briefScalaAdjustedLimit limit ${limit}`, E.briefScalaAdjustedLimit({
    limit, shiftHours: OSIOKA.shiftHours, weeklyHours: OSIOKA.weeklyHours,
  }));
  return { concentration, limit: a.adjustedLimit };
});
const oMixAdj = success('Osioka mixtureExposureIndex against the adjusted limits', E.mixtureExposureIndex(adjusted));
const oMixRaw = success('Osioka mixtureExposureIndex against the unadjusted limits', E.mixtureExposureIndex(
  OSIOKA.solvents.map(({ concentration, limit }) => ({ concentration, limit }))));

must('Osioka: both one-hour records total sixty minutes, as the NIOSH one-hour TWA requires',
  oWbgt.totalDurationMin === 60 && oMet.totalDurationMin === 60, `${oWbgt.totalDurationMin}, ${oMet.totalDurationMin}`);
must('Osioka: the dosimeter record covers the whole 11.25 hour shift', Math.abs(oDose.totalDurationH - OSIOKA.shiftHours) < 1e-12, oDose.totalDurationH);
must('Osioka: the shift dose exceeds 50 percent, and rescaling it to eight hours would take it UNDER 50',
  oDose.dosePct > 50 && oDose.dosePct * (8 / OSIOKA.shiftHours) < 50, `${oDose.dosePct}, rescaled ${oDose.dosePct * (8 / OSIOKA.shiftHours)}`);
must('Osioka: the daily factor governs', oAdj.governingBasis === 'daily', oAdj.governingBasis);
must('Osioka: the unadjusted mixture passes and the adjusted one fails, which is the tier\'s lesson',
  oMixRaw.exceeds === false && oMixAdj.exceeds === true, `${oMixRaw.index} and ${oMixAdj.index}`);
must('Osioka: the metabolic TWA sits inside the 116 to 580 W range the NIOSH figures plot, so no extrapolation warning attaches to its use',
  oMet.metabolicRateTwaW > E.NIOSH_HEAT_FIGURE_RANGE_W[0] && oMet.metabolicRateTwaW < E.NIOSH_HEAT_FIGURE_RANGE_W[1], oMet.metabolicRateTwaW);

/* ================================================== THE REFUSALS the capstones
   lean on, asserted so a tier cannot be written around behaviour the engine
   does not have. Each is LABELLED a refusal and must name its field.
   ==================================================================== */

refusal('a noise record over 24 hours', E.noiseDose([{ levelDbA: 88, durationH: 25 }], 'OSHA_PEL'), 'periods');
refusal('a STEL record over 15 minutes', E.chemicalStel15Min([{ concentration: 10, durationMin: 16 }]), 'periods');
refusal('the OSHA field derating on C-weighted data', E.hearingProtectorEstimate({
  exposureDb: 100, weighting: 'C', nrrDb: 29, method: 'OSHA_FIELD_50',
}), 'weighting');
refusal('a NIOSH assessment over 45 minutes', E.nioshHeatAssessment({
  acclimatized: true,
  wbgtPeriods: [{ wbgtC: 30, durationMin: 45 }],
  metabolicPeriods: [{ metabolicRateW: 300, durationMin: 60 }],
}), 'wbgtPeriods');

/* ================================================= THE EVIDENCE LEDGER

   Every item whose only evidence is TRANSCRIPTION (the engine and the oracle
   both copied it from the same page, and no printed value reproduces it), and
   every engine judgement call that could decide a graded value, against every
   graded field, with the MECHANISM that clears it:

     CONSTRUCTION  the capstone STATES the quantity the item would supply, so
                   the item is not in the chain
     EXCLUSION     the item is a limit, a verdict, a warning band or a method
                   no graded field calls
     MARGIN        the item decides a CHOICE and the measured margin between
                   the choices is reported
     BOUNDARY      the item is a judgement at a boundary, and no input sits on
                   the boundary (asserted above)
   ==================================================================== */

const ITEMS = [
  'T1 the NIOSH 2016 RAL constants 59.9 and 14.1 (transcription only)',
  'T2 the NIOSH 2016 REL constants 56.7 and 11.5 (transcription only)',
  'T3 the WBGT weights 0.7 and 0.3 indoors, 0.7, 0.2 and 0.1 outdoors (transcription only)',
  'T4 the NIOSH protector derating factors 0.75, 0.5 and 0.3 (oracle only)',
  'T5 the OSHA dual-protection 5 dB (oracle only)',
  'T6 the Brief and Scala WEEKLY formula (the ESTA note, no printed number)',
  'T7 the 116 to 580 W range of the NIOSH figures (a warning band)',
  'J2 the threshold is inclusive',
  'J5 protector credit floored at zero',
  'J6 the 8-hour TWA always divides by 8 (STATED in the prompt where it matters)',
  'J7 a mixture index of exactly 1 passes',
  'J8 the Brief and Scala factor is capped at 1 and the smaller factor governs',
  'J10 weekly LEX always divides by 5',
];

const CLEAR = [];
const clear = (key, items, mechanism, how) => CLEAR.push({ key, items, mechanism, how });
const ALL_T = 'T1 T2 T3 T4 T5 T6 T7';
const NOISE_KEYS = ['utorogu_osha_pel_dose_pct', 'utorogu_osha_pel_twa_dba', 'utorogu_action_level_dose_pct',
  'utorogu_niosh_rel_dose_pct', 'utorogu_niosh_rel_twa_dba', 'utorogu_pel_minutes_left_min'];
NOISE_KEYS.forEach((k) => {
  clear(k, ALL_T, 'EXCLUSION', 'a dosimeter dose, TWA or reference duration calls noiseDose or noiseReferenceDurationH, which read no heat constant, no protector factor and no reduction factor');
  clear(k, 'J2', 'BOUNDARY', 'no Utorogu period sits at 80 or 90 dBA, asserted');
  clear(k, 'J5 J6 J7 J8 J10', 'EXCLUSION', 'no protector, chemical average, mixture, reduction factor or weekly LEX is in the chain');
});

clear('amukpe_lex_8h_dba', ALL_T, 'EXCLUSION', 'lexEightHourDbA is the Schedule 1 energy sum, reproduced by L108 Figure 26');
clear('amukpe_lex_weekly_dba', ALL_T, 'EXCLUSION', 'lexWeeklyDbA reads the five stated daily values and nothing else');
clear('amukpe_field_derated_exposure_dba', `T1 T2 T3 T6 T7`, 'EXCLUSION', 'OSHA_FIELD_50 reads no heat constant and no reduction factor');
clear('amukpe_field_derated_exposure_dba', 'T4 T5', 'EXCLUSION', 'the NIOSH_TYPE and OSHA_DUAL methods are not called; the OTM Appendix E worked example (98 dBA, NRR 25, 89 dBA) reproduces the method that is');
['amukpe_benzene_twa8h_ppm', 'amukpe_toluene_stel_ppm', 'amukpe_mixture_index'].forEach((k) => {
  clear(k, ALL_T, 'EXCLUSION', 'a chemical average or index reads no heat constant, no protector factor and no reduction factor');
});
['amukpe_lex_8h_dba', 'amukpe_lex_weekly_dba', 'amukpe_field_derated_exposure_dba',
  'amukpe_benzene_twa8h_ppm', 'amukpe_toluene_stel_ppm', 'amukpe_mixture_index'].forEach((k) => {
  clear(k, 'J2', 'EXCLUSION', 'LEX has no threshold, and no Amukpe field calls noiseDose');
  clear(k, 'J8', 'EXCLUSION', 'no reduction factor is in any Amukpe chain');
});
clear('amukpe_field_derated_exposure_dba', 'J5', 'BOUNDARY', 'the attenuation is positive, so the floor is not reached, asserted');
['amukpe_lex_8h_dba', 'amukpe_lex_weekly_dba', 'amukpe_benzene_twa8h_ppm', 'amukpe_toluene_stel_ppm', 'amukpe_mixture_index']
  .forEach((k) => clear(k, 'J5', 'EXCLUSION', 'no protector estimate is in the chain'));
clear('amukpe_benzene_twa8h_ppm', 'J6', 'CONSTRUCTION', 'the prompt STATES that unsampled time counts as zero, which is what dividing by 8 writes');
['amukpe_lex_8h_dba', 'amukpe_lex_weekly_dba', 'amukpe_field_derated_exposure_dba', 'amukpe_toluene_stel_ppm', 'amukpe_mixture_index']
  .forEach((k) => clear(k, 'J6', 'EXCLUSION', 'chemicalTwa8h is not in the chain'));
clear('amukpe_mixture_index', 'J7', 'BOUNDARY', 'the index sits under unity, asserted, and the INDEX is graded, never the verdict');
['amukpe_lex_8h_dba', 'amukpe_lex_weekly_dba', 'amukpe_field_derated_exposure_dba', 'amukpe_benzene_twa8h_ppm', 'amukpe_toluene_stel_ppm']
  .forEach((k) => clear(k, 'J7', 'EXCLUSION', 'no mixture index is in the chain'));
clear('amukpe_lex_weekly_dba', 'J10', 'CONSTRUCTION', 'five days are given, so dividing by 5 and dividing by the day count are the same arithmetic; MEASURED equal below');
['amukpe_lex_8h_dba', 'amukpe_field_derated_exposure_dba', 'amukpe_benzene_twa8h_ppm', 'amukpe_toluene_stel_ppm', 'amukpe_mixture_index']
  .forEach((k) => clear(k, 'J10', 'EXCLUSION', 'no weekly LEX is in the chain'));

clear('osioka_wbgt_twa_c', 'T3', 'CONSTRUCTION', 'the capstone STATES the WBGT each period read out, so the weights that build a WBGT from globe, wet bulb and dry bulb temperatures are not in the chain');
clear('osioka_wbgt_twa_c', 'T1 T2 T7', 'EXCLUSION', 'the time weighted WBGT is the INPUT to a RAL or REL comparison; no limit, margin or verdict is graded');
clear('osioka_metabolic_twa_w', 'T1 T2', 'EXCLUSION', 'the time weighted metabolic rate is the INPUT the RAL or REL equation would take; the equation itself is not evaluated for any graded field');
clear('osioka_metabolic_twa_w', 'T3', 'EXCLUSION', 'no WBGT is in the chain');
clear('osioka_metabolic_twa_w', 'T7', 'BOUNDARY', 'the TWA sits inside the figure range, asserted, so the extrapolation warning is not in play');
['osioka_wbgt_twa_c', 'osioka_metabolic_twa_w'].forEach((k) => {
  clear(k, 'T4 T5 T6', 'EXCLUSION', 'no protector method and no reduction factor is in the chain');
  clear(k, 'J2 J5 J6 J7 J8 J10', 'EXCLUSION', 'a one-hour time weighted average of stated readings reads none of these');
});
['osioka_extended_action_level_dba', 'osioka_extended_action_dose_pct'].forEach((k) => {
  clear(k, ALL_T, 'EXCLUSION', 'the extended-shift action level and the shift dose read no heat constant, no protector factor and no reduction factor');
  clear(k, 'J5 J6 J7 J8 J10', 'EXCLUSION', 'none of these is in the chain');
});
clear('osioka_extended_action_dose_pct', 'J2', 'BOUNDARY', 'no Osioka dosimeter period sits at 80 dBA, asserted below');
clear('osioka_extended_action_level_dba', 'J2', 'EXCLUSION', 'the extended-shift action level is a closed form in the shift length with no threshold');
['osioka_adjusted_limit_ppm', 'osioka_adjusted_mixture_index'].forEach((k) => {
  clear(k, 'T1 T2 T3 T4 T5 T7', 'EXCLUSION', 'a reduction factor and a mixture index read no heat constant and no protector factor');
  clear(k, 'T6', 'MARGIN', 'the WEEKLY formula only decides WHICH factor governs; the governing daily factor is the one BC OHS Regulation 5.50 and the ESTA 12-hour example reproduce, and the weekly factor sits above it by the margin printed below');
  clear(k, 'J8', 'CONSTRUCTION', 'the smaller factor governs by the engine\'s rule and the prompt STATES that the more protective factor is used; the daily factor is below 1, so the cap is not reached, asserted');
  clear(k, 'J2 J5 J6 J10', 'EXCLUSION', 'none of these is in the chain');
});
clear('osioka_adjusted_limit_ppm', 'J7', 'EXCLUSION', 'no mixture index is in the chain');
clear('osioka_adjusted_mixture_index', 'J7', 'BOUNDARY', 'the index sits clear above unity, asserted, and the INDEX is graded, never the verdict');
['osioka_wbgt_twa_c', 'osioka_metabolic_twa_w', 'osioka_extended_action_level_dba', 'osioka_extended_action_dose_pct']
  .forEach((k) => { /* J-items covered above */ return k; });

// THE MEASUREMENTS BEHIND THE CLEARANCES.
must('CLEARANCE by BOUNDARY: no Osioka dosimeter period sits at 80 dBA', OSIOKA.dosimeter.every((p) => p.levelDbA !== 80), 'none at 80');
const weekByDays = 10 * Math.log10(AMUKPE.weekLexDbA.reduce((s, l) => s + 10 ** (0.1 * l), 0) / AMUKPE.weekLexDbA.length);
must('CLEARANCE by CONSTRUCTION (J10): the weekly LEX divided by the day count equals the engine to 1e-12',
  Math.abs(weekByDays - aWeek.lexWeeklyDbA) < 1e-12, `${weekByDays} against ${aWeek.lexWeeklyDbA}`);
const daily = oAdj.factors.find((f) => f.basis === 'daily');
const weekly = oAdj.factors.find((f) => f.basis === 'weekly');
const T6_MARGIN = weekly.rf - daily.rf;
must('CLEARANCE by MARGIN (T6): the weekly factor sits above the daily factor by more than 0.2',
  T6_MARGIN > 0.2, `weekly ${weekly.rf} minus daily ${daily.rf} = ${T6_MARGIN}`);
must('CLEARANCE by CONSTRUCTION (J8): the daily factor is below 1, so the cap is not reached', daily.rawRf < 1 && daily.rf === daily.rawRf, daily.rawRf);
must('CLEARANCE by BOUNDARY (J7): the adjusted index sits more than 0.1 above unity', oMixAdj.index - 1 > 0.1, oMixAdj.index);

/* ---------------------------------------------------------------- the rows */

const ROWS = [
  ['beginner', 'utorogu_osha_pel_dose_pct', 'pct', uPel.dosePct],
  ['beginner', 'utorogu_osha_pel_twa_dba', 'dba', uPel.twaDbA],
  ['beginner', 'utorogu_action_level_dose_pct', 'pct', uAl.dosePct],
  ['beginner', 'utorogu_niosh_rel_dose_pct', 'pct', uRel.dosePct],
  ['beginner', 'utorogu_niosh_rel_twa_dba', 'dba', uRel.twaDbA],
  ['beginner', 'utorogu_pel_minutes_left_min', 'min', uMinutesLeft],
  ['intermediate', 'amukpe_lex_8h_dba', 'dba', aLex.lexDbA],
  ['intermediate', 'amukpe_lex_weekly_dba', 'dba', aWeek.lexWeeklyDbA],
  ['intermediate', 'amukpe_field_derated_exposure_dba', 'dba', aField.protectedDbA],
  ['intermediate', 'amukpe_benzene_twa8h_ppm', 'ppm', aBenz.twa8h],
  ['intermediate', 'amukpe_toluene_stel_ppm', 'ppm', aStel.stel15Min],
  ['intermediate', 'amukpe_mixture_index', 'ratio', aMix.index],
  ['advanced', 'osioka_wbgt_twa_c', 'degC', oWbgt.wbgtTwaC],
  ['advanced', 'osioka_metabolic_twa_w', 'watt', oMet.metabolicRateTwaW],
  ['advanced', 'osioka_extended_action_level_dba', 'dba', oAlExt.actionLevelDbA],
  ['advanced', 'osioka_extended_action_dose_pct', 'pct', oDose.dosePct],
  ['advanced', 'osioka_adjusted_limit_ppm', 'ppm', oAdj.adjustedLimit],
  ['advanced', 'osioka_adjusted_mixture_index', 'ratio', oMixAdj.index],
].map(([tier, key, cls, value]) => ({ tier, key, cls, value }));

must('the eighteen rows are the eighteen declared fields, in the declared order and classes',
  JSON.stringify(ROWS.map((r) => [r.tier, r.key, r.cls]))
  === JSON.stringify(GRADED_FIELDS.map(([t, k, c]) => [t, k, c])), `${ROWS.length} rows`);
ROWS.forEach((r) => must(`${r.key} is a finite positive number`, Number.isFinite(r.value) && r.value > 0, r.value));
ROWS.forEach((r) => must(`${r.key} is not a whole number (never grade a round figure)`,
  Math.abs(r.value - Math.round(r.value)) > 1e-6, r.value));

/* Every item must be cleared for every field. Eighteen times thirteen. */
const missing = [];
GRADED_FIELDS.forEach(([, key]) => {
  ITEMS.forEach((h) => {
    const tag = h.split(' ')[0];
    if (!CLEAR.some((c) => c.key === key && c.items.split(/\s+/).includes(tag))) missing.push(`${key} has no clearance for ${tag}`);
  });
});
must('EVERY TRANSCRIPTION-ONLY ITEM AND EVERY JUDGEMENT CALL IS CLEARED FOR EVERY GRADED FIELD', missing.length === 0,
  missing.length ? missing.slice(0, 12).join('; ') : `${GRADED_FIELDS.length} fields x ${ITEMS.length} items, all cleared`);

/* THE EVIDENCE EACH FIELD STANDS ON: the published golden rows that reproduce
   the formula it is computed by. make_fields and gate_wavejson read this. */
const EVIDENCE = {
  utorogu_osha_pel_dose_pct: ['PUBLISHED', '1910.95 Table G-16a (g16a-*) reproduces T = 8 / 2^((L-90)/5); App. A D = 100 sum(C/T)'],
  utorogu_osha_pel_twa_dba: ['PUBLISHED', '1910.95 Table A-1 (a1-*) reproduces 16.61 log10(D/100) + 90 and separates 16.61 from 10; it cannot separate 16.61 from 5/log10 2 at one printed decimal, so the coefficient to the graded precision is the one the mandatory Appendix A TEXT writes (BRIEF.md, J1)'],
  utorogu_action_level_dose_pct: ['PUBLISHED', 'Table G-16a from 80 dBA (g16a-80 is called with OSHA_ACTION_LEVEL); 1910.95(d)(2)(i) integrates from 80'],
  utorogu_niosh_rel_dose_pct: ['PUBLISHED', 'NIOSH 98-126 Table 1-1 (niosh-t11-*) reproduces T = 480 / 2^((L-85)/3) min'],
  utorogu_niosh_rel_twa_dba: ['PUBLISHED', 'NIOSH 98-126 Table 1-2 (niosh-t12-*) reproduces 10.0 log(D/100) + 85 and separates 10.0 from 3/log10 2'],
  utorogu_pel_minutes_left_min: ['PUBLISHED', 'Table G-16a reference duration at the stated level, times the stated arithmetic (1 - D/100) x 60'],
  amukpe_lex_8h_dba: ['PUBLISHED', 'HSE L108 Figure 26 (l108-figure-26) reproduces the Schedule 1 energy sum with T0 = 8 h'],
  amukpe_lex_weekly_dba: ['DECISION', 'the Figure 26 energy average with the Schedule 1 divisor of 5; with five days given the divisor equals the day count, MEASURED, so no transcription-only constant can move it (BRIEF.md)'],
  amukpe_field_derated_exposure_dba: ['PUBLISHED', 'the TWA from the stated PEL noise dose by 1910.95 Table A-1 (a1-*), then the OSHA Technical Manual Appendix E worked example (otm-appE-field-50): 98 dBA, NRR 25, 89 dBA'],
  amukpe_benzene_twa8h_ppm: ['PUBLISHED', '1910.1000(d)(1) worked example (cfr-1000-d1-example): 81.25 ppm; unsampled time as zero is STATED in the prompt (J6)'],
  amukpe_toluene_stel_ppm: ['DECISION', 'a 15-minute time weighted average by definition; no constant beyond 15 is in the chain, and the zero remainder is STATED (BRIEF.md)'],
  amukpe_mixture_index: ['PUBLISHED', '1910.1000(d)(2) worked example (cfr-1000-d2-example): 0.925'],
  osioka_wbgt_twa_c: ['DECISION', 'a one-hour time weighted average of STATED readouts, arithmetic by definition (NIOSH 2016-106 s.1.1.1 defines the averaging, not a constant); no WBGT weight is in the chain (BRIEF.md)'],
  osioka_metabolic_twa_w: ['DECISION', 'a one-hour time weighted average of STATED rates, arithmetic by definition (s.1.1.3); the RAL and REL equations are not evaluated (BRIEF.md)'],
  osioka_extended_action_level_dba: ['PUBLISHED', 'OSHA Technical Manual Table IV-3 (otm-al-table-*) reproduces 16.61 log10(50 / (12.5 h)) + 90 to its printed decimal; the 16.61 to the graded precision is the coefficient the Manual TEXT writes (BRIEF.md, J1)'],
  osioka_extended_action_dose_pct: ['PUBLISHED', 'Table G-16a from 80 dBA; App. A sums the whole day with no rescaling to 8 h'],
  osioka_adjusted_limit_ppm: ['PUBLISHED', 'the DAILY factor governs, and BC OHS Reg 5.50 (0.7/0.5/0.25/0.1) and the ESTA 12-hour example (esta-glycol-12h) reproduce it'],
  osioka_adjusted_mixture_index: ['PUBLISHED', 'the 1910.1000(d)(2) index over limits adjusted by the governing daily factor'],
};
must('every graded field carries an evidence entry and no other entry exists',
  JSON.stringify(Object.keys(EVIDENCE).sort()) === JSON.stringify(GRADED_FIELDS.map(([, k]) => k).sort()), Object.keys(EVIDENCE).length);
must('no graded field stands on TRANSCRIPTION alone', Object.values(EVIDENCE).every(([cls]) => cls === 'PUBLISHED' || cls === 'DECISION'),
  Object.values(EVIDENCE).map(([c]) => c).join(','));

/* -------------------------------------------------------------- reporting */

const failed = ASSERTS.filter((a) => !a.pass);
if (failed.length) {
  failed.forEach((a) => process.stderr.write(`  FAILED  ${a.claim}\n          ${a.detail}\n`));
  process.stderr.write(`h2_capstone: ${ASSERTS.length} assertions, ${failed.length} FAILED. NOTHING WRITTEN.\n`);
  process.exit(1);
}
process.stderr.write(`h2_capstone: ${ASSERTS.length} label-and-call, evidence and clearance assertions run, 0 failed\n`);

if (process.argv.includes('--json')) {
  process.stdout.write(`${JSON.stringify(ROWS)}\n`);
} else if (process.argv.includes('--inputs')) {
  // The three frozen scenarios EXACTLY as the engine was called on them. Nothing
  // is reshaped here: gen_course.py renders every prompt from this object, so a
  // condition can never drift from the condition that was graded.
  process.stdout.write(`${JSON.stringify({ UTOROGU, AMUKPE, OSIOKA })}\n`);
} else if (process.argv.includes('--evidence')) {
  process.stdout.write(`${JSON.stringify({ items: ITEMS, clearances: CLEAR, evidence: EVIDENCE, t6MarginRf: T6_MARGIN }, null, 1)}\n`);
} else {
  const pad = (s, n2) => String(s).padEnd(n2);
  process.stdout.write(`${pad('TIER', 14)}${pad('KEY', 38)}${pad('CLASS', 7)}${pad('VALUE', 20)}${pad('TOLERANCE', 11)}EVIDENCE\n`);
  ROWS.forEach((r) => process.stdout.write(
    `${pad(r.tier, 14)}${pad(r.key, 38)}${pad(r.cls, 7)}${pad(r.value.toFixed(PRINTED_DECIMALS[r.cls]), 20)}${pad(gradedTolerance(r.key), 11)}${EVIDENCE[r.key][0]}\n`));
  process.stdout.write(`\n${CLEAR.length} clearance rows over ${GRADED_FIELDS.length} fields and ${ITEMS.length} items\n`);
  const byMech = {};
  CLEAR.forEach((c) => { byMech[c.mechanism] = (byMech[c.mechanism] || 0) + 1; });
  process.stdout.write(`by mechanism: ${Object.entries(byMech).sort().map(([m, n2]) => `${m} ${n2}`).join(', ')}\n`);
  // The margin itself stays in --evidence (t6MarginRf), which only the gates read:
  // this line is pinned into wave.json by finalise.py, which every writer reads.
  process.stdout.write(`T6 margin: weekly factor minus daily factor is above 0.2, asserted (the figure is in --evidence only)\n`);
}
