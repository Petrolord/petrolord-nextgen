// THE H2 TEACHING LAB: Occupational Hygiene: Noise, Chemical & Heat Exposure.
//
// Every number a panel or the course page shows comes from here, and every
// number here is a return value of the vendored engine
// (@petrolord/engines/engines/hse/exposure.js, sha-identical with
// petrolord-engines 870cc8f) on the TEACHING records of the wave, or a value
// read out of the vendored golden. hygieneLab.test.js walks every reader below
// and requires every finite number it returns to appear in the teaching digest
// (tools/course-waves/hygiene/digest.txt), so a panel cannot show a figure the
// lessons were not written from.
//
// THE TEACHING RECORDS ARE NOT THE CAPSTONE SITES. They are copied from the
// wave's h2_fields.mjs, and the test asserts the copy is exact. No capstone site,
// input or answer appears in this file, and panelCapstoneGuard.test.js greps it.
//
// THE HEAT EQUATIONS ARE TRANSCRIPTION ONLY. The NIOSH 2016 RAL and REL
// equations and the WBGT weights are evaluated here because the course TEACHES
// them, and every reader that returns one carries `evidence` saying so. No
// graded field reads any of them.
//
// Nothing here reads a clock, a random number or a locale.
import exposureGolden from '@petrolord/engines/test-data/hse/goldens/exposure_cases.json';
import * as E from '@petrolord/engines/engines/hse/exposure.js';

export const GOLD = exposureGolden;

/** The engine's doors as a plain object, so a golden case can name the one it calls. */
const DOORS = { ...E };

/** The label every figure built on a transcription-only constant carries. */
export const TRANSCRIPTION_ONLY = 'the NIOSH 2016-106 section 8.1 equation, checked for transcription only';
export const WBGT_TRANSCRIPTION_ONLY = 'the NIOSH 2016-106 section 9.3.2 weights, checked for transcription only';

const f = (o) => Object.freeze(o);
const fa = (a) => Object.freeze(a.map(f));

/* ------------------------------------------------ THE TEACHING RECORDS */

export const OBEN = fa([
  { levelDbA: 84.3, durationH: 2.6 },
  { levelDbA: 89.8, durationH: 1.9 },
  { levelDbA: 94.6, durationH: 0.8 },
  { levelDbA: 81.2, durationH: 1.75 },
  { levelDbA: 99.1, durationH: 0.2 },
  { levelDbA: 76.5, durationH: 0.75 },
]);
export const ORONI = fa([
  { levelDbA: 80, durationH: 3 },
  { levelDbA: 90, durationH: 2 },
  { levelDbA: 79.9, durationH: 3 },
]);
export const LOUD_117 = fa([{ levelDbA: 117, durationH: 0.1 }, { levelDbA: 86, durationH: 7.9 }]);
export const LOUD_132 = fa([{ levelDbA: 132, durationH: 0.02 }, { levelDbA: 84, durationH: 7.98 }]);
export const OLOMORO = fa([
  { levelDbA: 86.1, durationH: 3.1 },
  { levelDbA: 83.4, durationH: 3.6 },
  { levelDbA: 90.8, durationH: 1.2 },
  { levelDbA: 78.9, durationH: 2.1 },
]);
export const EVWRENI = fa([
  { laeqDbA: 87.2, durationH: 2.2 },
  { laeqDbA: 80.9, durationH: 3.4 },
  { laeqDbA: 95.4, durationH: 0.6 },
  { laeqDbA: 73.8, durationH: 1.8 },
]);
export const EVWRENI_LONG = fa([
  { laeqDbA: 87.2, durationH: 2.9 },
  { laeqDbA: 80.9, durationH: 4.4 },
  { laeqDbA: 95.4, durationH: 0.6 },
  { laeqDbA: 73.8, durationH: 2.6 },
]);
export const WEEK_5 = Object.freeze([86.4, 83.1, 88.2, 84.9, 81.7]);
export const WEEK_4 = Object.freeze([89.5, 87.1, 90.2, 86.3]);
export const WEEK_6 = Object.freeze([84.2, 84.2, 84.2, 84.2, 84.2, 84.2]);
export const PROTECTOR_A = f({ exposureDb: 97.6, nrrDb: 27 });
export const PROTECTOR_C = f({ exposureDb: 103.2, nrrDb: 27 });
export const NRR_SWEEP = Object.freeze([0, 5, 7, 10, 15, 20, 25, 30, 33]);
export const IGBO_PARTIAL = fa([
  { concentration: 38, durationH: 2.5 },
  { concentration: 64, durationH: 1.25 },
  { concentration: 22, durationH: 3 },
]);
export const IGBO_FULL = fa([
  { concentration: 38, durationH: 2.5 },
  { concentration: 64, durationH: 1.25 },
  { concentration: 22, durationH: 3 },
  { concentration: 15, durationH: 1.25 },
]);
export const IGBO_LONG = fa([
  { concentration: 38, durationH: 3.5 },
  { concentration: 64, durationH: 1.75 },
  { concentration: 22, durationH: 3 },
  { concentration: 15, durationH: 1.75 },
]);
export const STEL_FULL = fa([{ concentration: 240, durationMin: 5 }, { concentration: 110, durationMin: 10 }]);
export const STEL_SHORT = fa([{ concentration: 180, durationMin: 4 }, { concentration: 95, durationMin: 7 }]);
export const MIXTURE = fa([
  { name: 'toluene', concentration: 72.5, limit: 200 },
  { name: 'xylene', concentration: 31.2, limit: 100 },
  { name: 'acetone', concentration: 385, limit: 1000 },
]);
export const HEAT_INDOOR = f({ naturalWetBulbC: 26.4, globeC: 38.7 });
export const HEAT_OUTDOOR = f({ naturalWetBulbC: 27.1, globeC: 45.3, dryBulbC: 33.8 });
export const HEAT_WBGT_HOUR = fa([{ wbgtC: 30.8, durationMin: 40 }, { wbgtC: 25.6, durationMin: 20 }]);
export const HEAT_MET_HOUR = fa([{ metabolicRateW: 380, durationMin: 40 }, { metabolicRateW: 140, durationMin: 20 }]);
export const MET_SWEEP = Object.freeze([100, 116, 150, 200, 233, 300, 348.9, 400, 465, 500, 580, 600]);
export const SHIFT_SWEEP = Object.freeze([4, 6, 8, 9, 10, 10.5, 12, 14, 16, 20, 24]);
export const WEEK_HOURS_SWEEP = Object.freeze([30, 40, 48, 50, 56, 60, 72, 84]);
export const BS_PAIRS = Object.freeze([[12, 48], [12, 60], [10, 70], [10, 40], [9, 54], [14, 42]]);

/* ------------------------------------------------------------ helpers */

/** Every call goes through here: an engine refusal becomes a thrown error
 *  carrying the engine's own message, so no panel prints a half-result. */
const ok = (r) => {
  if (!r || r.error) throw new Error(r ? r.error : 'the engine returned nothing');
  return r;
};
/** A refusal the course teaches: the field and the engine's own words. */
const refused = (r) => {
  if (!r || !r.error) throw new Error('a call the lab expects the engine to refuse succeeded');
  return { field: r.field, message: r.error };
};
export const PRESETS = Object.freeze(['OSHA_PEL', 'OSHA_ACTION_LEVEL', 'NIOSH_REL']);
export const CRITERIA = E.NOISE_CRITERIA;
const EXACT = {
  OSHA_PEL: { id: 'EXACT_OSHA', criterionLevelDbA: 90, exchangeRateDb: 5, thresholdDbA: 90 },
  NIOSH_REL: { id: 'EXACT_NIOSH', criterionLevelDbA: 85, exchangeRateDb: 3, thresholdDbA: 80 },
};

/* ------------------------------------------------------ NOISE DOSE */

/** One record read under each preset: every period's contribution, the totals. */
export const readRecord = (periods) => PRESETS.map((id) => {
  const r = ok(E.noiseDose(periods, id));
  return {
    id,
    label: CRITERIA[id].label,
    criterionLevelDbA: CRITERIA[id].criterionLevelDbA,
    exchangeRateDb: CRITERIA[id].exchangeRateDb,
    thresholdDbA: CRITERIA[id].thresholdDbA,
    limitDosePct: r.limitDosePct,
    dosePct: r.dosePct,
    twaDbA: r.twaDbA,
    exceedsLimit: r.exceedsLimit,
    integrated: r.contributions.filter((c) => c.integrated).length,
    contributions: r.contributions.map((c) => ({ levelDbA: c.levelDbA, durationH: c.durationH, integrated: c.integrated, dosePct: c.integrated ? c.dosePct : null })),
    warnings: r.warnings,
  };
});

export const threeCriteria = () => {
  const oben = readRecord(OBEN);
  const pel = oben[0];
  const loud = OBEN.reduce((m, p) => (p.levelDbA > m.levelDbA ? p : m));
  const t95 = ok(E.noiseReferenceDurationH(95, 'OSHA_PEL')).referenceDurationH;
  const left = 1 - pel.dosePct / 100;
  return {
    record: OBEN,
    oben,
    oroni: readRecord(ORONI),
    referenceDurations: OBEN.map((p) => {
      const o = ok(E.noiseReferenceDurationH(p.levelDbA, 'OSHA_ACTION_LEVEL'));
      const n = ok(E.noiseReferenceDurationH(p.levelDbA, 'NIOSH_REL'));
      return { levelDbA: p.levelDbA, oshaH: o.belowThreshold ? null : o.referenceDurationH, nioshH: n.belowThreshold ? null : n.referenceDurationH };
    }),
    loudestLevelDbA: loud.levelDbA,
    loudestSharePct: (100 * pel.contributions[OBEN.indexOf(loud)].dosePct) / pel.dosePct,
    actionTwaAt85DosePct: ok(E.noiseDoseFromTwaPct(85, 'OSHA_ACTION_LEVEL')).dosePct,
    timeLeft: { dosePct: pel.dosePct, remainingPct: 100 * left, at95H: t95, leftH: left * t95, leftMin: left * t95 * 60 },
  };
};

/** The warnings, verbatim, for the four loud records. */
export const warnings = () => [
  ['a 117 dBA period, OSHA PEL', LOUD_117, 'OSHA_PEL'],
  ['a 117 dBA period, NIOSH REL', LOUD_117, 'NIOSH_REL'],
  ['a 132 dBA period, OSHA PEL', LOUD_132, 'OSHA_PEL'],
  ['a 132 dBA period, NIOSH REL', LOUD_132, 'NIOSH_REL'],
].map(([label, periods, id]) => {
  const r = ok(E.noiseDose(periods, id));
  return { label, dosePct: r.dosePct, twaDbA: r.twaDbA, warnings: r.warnings };
});

/** The published tables: every G-16a, A-1, NIOSH 1-1 and 1-2 row, engine against printed. */
export const publishedTables = () => {
  const rows = (prefix, key) => GOLD.cases.filter((c) => c.id.startsWith(prefix)).map((c) => {
    const r = ok(DOORS[c.fn](...c.args));
    return { argument: c.args[0], engine: r[key], printed: c.published[key].value, tolerance: c.published[key].tolerance };
  });
  const a1 = rows('a1-', 'twaDbA').map((r) => ({ ...r, exact: ok(E.noiseTwaFromDoseDbA(r.argument, EXACT.OSHA_PEL)).twaDbA }));
  const t12 = rows('niosh-t12-', 'twaDbA').map((r) => ({ ...r, exact: ok(E.noiseTwaFromDoseDbA(r.argument, EXACT.NIOSH_REL)).twaDbA }));
  return {
    g16a: rows('g16a-', 'referenceDurationH'),
    // Table 1-1 is gated at one printed unit (60 seconds in hours), a tolerance the
    // digest does not print, so the reader returns the rows without it.
    t11: rows('niosh-t11-', 'referenceDurationH').map(({ tolerance, ...r }) => r),
    a1,
    t12,
    a1ExactFailures: a1.filter((r) => Math.abs(r.exact - r.printed) > r.tolerance).length,
    t12ExactFailures: t12.filter((r) => Math.abs(r.exact - r.printed) > r.tolerance).length,
    exact5: 5 / Math.log10(2),
    exact3: 3 / Math.log10(2),
    nioshAt100: ok(E.noiseDose([{ levelDbA: 100, durationH: 8 }], 'NIOSH_REL')).twaDbA,
    nioshAt100Exact: ok(E.noiseDose([{ levelDbA: 100, durationH: 8 }], EXACT.NIOSH_REL)).twaDbA,
  };
};

/** The inverse doors. */
export const inverses = () => ({
  levels: [0.25, 0.5, 1, 2, 3, 4, 6, 8, 12, 16].map((h) => ({
    hours: h,
    oshaDbA: ok(E.noiseLevelForReferenceDurationDbA(h, 'OSHA_PEL')).levelDbA,
    nioshDbA: ok(E.noiseLevelForReferenceDurationDbA(h, 'NIOSH_REL')).levelDbA,
  })),
  doses: [80, 82, 85, 87, 88, 90, 92, 95, 100].map((t) => ({
    twaDbA: t,
    oshaPct: ok(E.noiseDoseFromTwaPct(t, 'OSHA_PEL')).dosePct,
    nioshPct: ok(E.noiseDoseFromTwaPct(t, 'NIOSH_REL')).dosePct,
  })),
  oneDbOsha: ok(E.noiseDoseFromTwaPct(91, 'OSHA_PEL')).dosePct / ok(E.noiseDoseFromTwaPct(90, 'OSHA_PEL')).dosePct,
  oneDbNiosh: ok(E.noiseDoseFromTwaPct(86, 'NIOSH_REL')).dosePct / ok(E.noiseDoseFromTwaPct(85, 'NIOSH_REL')).dosePct,
  zeroDoseTwa: refused(E.noiseTwaFromDoseDbA(0, 'OSHA_PEL')),
  overADay: refused(E.noiseDose([{ levelDbA: 85, durationH: 13 }, { levelDbA: 88, durationH: 12 }], 'NIOSH_REL')),
});

/** The extended shift: the action level sweep and the OLOMORO ten-hour record. */
export const extendedShift = () => {
  const iv3 = Object.fromEntries(GOLD.cases.filter((c) => c.id.startsWith('otm-al-table-')).map((c) => [c.args[0], c.published.actionLevelDbA.value]));
  const al = ok(E.noiseDose(OLOMORO, 'OSHA_ACTION_LEVEL'));
  const pel = ok(E.noiseDose(OLOMORO, 'OSHA_PEL'));
  return {
    sweep: SHIFT_SWEEP.map((h) => ({ hours: h, actionLevelDbA: ok(E.oshaActionLevelForShiftDbA(h)).actionLevelDbA, printed: iv3[h] ?? null })),
    record: OLOMORO,
    contributions: al.contributions.map((c) => (c.integrated ? c.dosePct : null)),
    hours: al.totalDurationH,
    actionDosePct: al.dosePct,
    pelDosePct: pel.dosePct,
    actionTwaDbA: al.twaDbA,
    shiftActionLevelDbA: ok(E.oshaActionLevelForShiftDbA(al.totalDurationH)).actionLevelDbA,
    rescaledPct: (al.dosePct * 8) / al.totalDurationH,
  };
};

/* ------------------------------------------------------------ LEX */

export const lex = () => {
  const fig = GOLD.cases.find((c) => c.id === 'l108-figure-26');
  const f26 = ok(E.lexEightHourDbA(...fig.args));
  const day = ok(E.lexEightHourDbA(EVWRENI));
  const long = ok(E.lexEightHourDbA(EVWRENI_LONG));
  const week = (days) => ok(E.lexWeeklyDbA(days));
  const loud = Math.max(...WEEK_5);
  return {
    figure26: { tasks: fig.args[0], contributions: f26.contributions.map((c) => ({ lexDbA: c.lexDbA, exposurePoints: c.exposurePoints })), lexDbA: f26.lexDbA, exposurePoints: f26.exposurePoints },
    day: { tasks: EVWRENI, contributions: day.contributions.map((c) => ({ lexDbA: c.lexDbA, exposurePoints: c.exposurePoints })), lexDbA: day.lexDbA, exposurePoints: day.exposurePoints, lower: day.exceedsLowerAction, upper: day.exceedsUpperAction },
    long: { tasks: EVWRENI_LONG, hours: long.totalDurationH, lexDbA: long.lexDbA, exposurePoints: long.exposurePoints, overOwnHoursDbA: 10 * Math.log10(EVWRENI_LONG.reduce((s, t) => s + (t.durationH / long.totalDurationH) * 10 ** (t.laeqDbA / 10), 0)) },
    weeks: [['five days', WEEK_5], ['four days', WEEK_4], ['six equal days', WEEK_6]].map(([label, days]) => ({
      label, days, count: week(days).days, lexWeeklyDbA: week(days).lexWeeklyDbA, meanDbA: days.reduce((s, x) => s + x, 0) / days.length,
    })),
    withoutLoudestDbA: week(WEEK_5.filter((x) => x !== loud)).lexWeeklyDbA,
    loudestDayDbA: loud,
    allowed: [82, 85, 88, 91, 94, 97, 100, 103, 106].map((L) => ({
      laeqDbA: L,
      to80: ok(E.lexAllowedDurationH({ laeqDbA: L, targetLexDbA: 80 })).durationH,
      to85: ok(E.lexAllowedDurationH({ laeqDbA: L, targetLexDbA: 85 })).durationH,
      to87: ok(E.lexAllowedDurationH({ laeqDbA: L, targetLexDbA: 87 })).durationH,
    })),
    points: [10, 25, 31.622777, 50, 100, 150, 200, 320, 500, 1000].map((p) => ({ points: p, lexDbA: ok(E.lexFromExposurePointsDbA(p)).lexDbA })),
    euValues: E.EU_NOISE_VALUES,
  };
};

/* ------------------------------------------------------ PROTECTORS */

export const PROTECTOR_ROWS = Object.freeze([
  ['OSHA_APPENDIX_B', 'A', undefined], ['OSHA_APPENDIX_B', 'C', undefined],
  ['OSHA_FIELD_50', 'A', undefined],
  ['OSHA_DUAL', 'A', undefined], ['OSHA_DUAL', 'C', undefined],
  ['NIOSH_TYPE', 'A', 'earmuff'], ['NIOSH_TYPE', 'C', 'earmuff'],
  ['NIOSH_TYPE', 'A', 'formableEarplug'], ['NIOSH_TYPE', 'C', 'formableEarplug'],
  ['NIOSH_TYPE', 'A', 'otherEarplug'], ['NIOSH_TYPE', 'C', 'otherEarplug'],
]);

export const protectors = () => {
  const est = (o) => ok(E.hearingProtectorEstimate(o));
  const floor = est({ exposureDb: PROTECTOR_A.exposureDb, nrrDb: 5, method: 'OSHA_APPENDIX_B' });
  return {
    a: PROTECTOR_A,
    c: PROTECTOR_C,
    rows: PROTECTOR_ROWS.map(([method, weighting, protectorType]) => {
      const base = weighting === 'A' ? PROTECTOR_A : PROTECTOR_C;
      const r = est({ exposureDb: base.exposureDb, nrrDb: base.nrrDb, weighting, method, protectorType });
      return { method, weighting, protectorType: protectorType ?? null, creditedNrrDb: r.creditedNrrDb, attenuationDb: r.attenuationDb, protectedDbA: r.protectedDbA };
    }),
    sweep: NRR_SWEEP.map((nrr) => {
      const v = (method, protectorType) => est({ exposureDb: PROTECTOR_A.exposureDb, nrrDb: nrr, method, protectorType }).protectedDbA;
      return {
        nrrDb: nrr,
        appendixB: v('OSHA_APPENDIX_B'),
        field50: v('OSHA_FIELD_50'),
        dual: v('OSHA_DUAL'),
        earmuff: v('NIOSH_TYPE', 'earmuff'),
        formable: v('NIOSH_TYPE', 'formableEarplug'),
        other: v('NIOSH_TYPE', 'otherEarplug'),
      };
    }),
    otm: {
      field50: est({ exposureDb: 98, nrrDb: 25, method: 'OSHA_FIELD_50' }).protectedDbA,
      appendixB: est({ exposureDb: 98, nrrDb: 25, method: 'OSHA_APPENDIX_B' }).protectedDbA,
    },
    fieldOnC: refused(E.hearingProtectorEstimate({ exposureDb: PROTECTOR_C.exposureDb, nrrDb: PROTECTOR_C.nrrDb, weighting: 'C', method: 'OSHA_FIELD_50' })),
    floorWarning: floor.warnings[0],
  };
};

/* ------------------------------------------------------- CHEMICALS */

export const chemicals = () => {
  const d1 = GOLD.cases.find((c) => c.id === 'cfr-1000-d1-example');
  const d2 = GOLD.cases.find((c) => c.id === 'cfr-1000-d2-example');
  const mix = ok(E.mixtureExposureIndex(MIXTURE.map(({ concentration, limit }) => ({ concentration, limit }))));
  const d2r = ok(E.mixtureExposureIndex(...d2.args));
  return {
    d1Example: ok(E.chemicalTwa8h(...d1.args)).twa8h,
    twa: [['partial shift', IGBO_PARTIAL], ['full shift', IGBO_FULL], ['ten-hour shift', IGBO_LONG]].map(([label, rec]) => {
      const r = ok(E.chemicalTwa8h(rec));
      const sum = rec.reduce((s, p) => s + p.concentration * p.durationH, 0);
      return { label, samples: rec, hours: r.totalDurationH, twa8h: r.twa8h, overHoursCovered: sum / r.totalDurationH, warnings: r.warnings };
    }),
    stel: [['full window', STEL_FULL], ['short record', STEL_SHORT]].map(([label, rec]) => {
      const r = ok(E.chemicalStel15Min(rec));
      return { label, samples: rec, minutes: r.totalDurationMin, stel15Min: r.stel15Min, warnings: r.warnings };
    }),
    stelTooLong: refused(E.chemicalStel15Min([...STEL_FULL, { concentration: 40, durationMin: 2 }])),
    d2Example: { terms: d2r.terms, index: d2r.index, exceeds: d2r.exceeds },
    mixture: { components: MIXTURE, terms: mix.terms, index: mix.index, exceeds: mix.exceeds, largestTerm: Math.max(...mix.terms) },
    unity: ok(E.mixtureExposureIndex([{ concentration: 50, limit: 100 }, { concentration: 25, limit: 50 }])),
  };
};

/* ------------------------------------------------- BRIEF AND SCALA */

export const briefScala = () => {
  const esta = GOLD.cases.find((c) => c.id === 'esta-glycol-12h');
  const estaR = ok(E.briefScalaAdjustedLimit(...esta.args));
  return {
    daily: SHIFT_SWEEP.map((h) => { const r = ok(E.briefScalaDailyRf(h)); return { hours: h, rawRf: r.rawRf, rf: r.rf, adjusted100: 100 * r.rf }; }),
    weekly: WEEK_HOURS_SWEEP.map((h) => { const r = ok(E.briefScalaWeeklyRf(h)); return { hours: h, rawRf: r.rawRf, rf: r.rf }; }),
    pairs: BS_PAIRS.map(([h, wk]) => {
      const r = ok(E.briefScalaAdjustedLimit({ limit: 100, shiftHours: h, weeklyHours: wk }));
      return { shiftHours: h, weeklyHours: wk, dailyRf: r.factors[0].rf, weeklyRf: r.factors[1].rf, governing: r.governingBasis, adjusted: r.adjustedLimit };
    }),
    esta: { ...esta.args[0], adjusted: estaR.adjustedLimit, governing: estaR.governingBasis },
    weeklyEvidence: 'oracle only: no value a source prints reproduces the weekly factor',
  };
};

/* ------------------------------------------------------------ HEAT */

export const heat = () => {
  const wi = ok(E.wbgtIndoorC(HEAT_INDOOR));
  const wo = ok(E.wbgtOutdoorC(HEAT_OUTDOOR));
  const woIn = ok(E.wbgtIndoorC({ naturalWetBulbC: HEAT_OUTDOOR.naturalWetBulbC, globeC: HEAT_OUTDOOR.globeC }));
  const hw = ok(E.wbgtTwaC(HEAT_WBGT_HOUR));
  const hm = ok(E.metabolicRateTwaW(HEAT_MET_HOUR));
  return {
    wbgt: { indoor: wi.wbgtC, outdoor: wo.wbgtC, outdoorThroughIndoor: woIn.wbgtC, evidence: WBGT_TRANSCRIPTION_ONLY },
    hour: { wbgt: HEAT_WBGT_HOUR, metabolic: HEAT_MET_HOUR, wbgtTwaC: hw.wbgtTwaC, plainMeanC: HEAT_WBGT_HOUR.reduce((s, p) => s + p.wbgtC, 0) / HEAT_WBGT_HOUR.length, metabolicTwaW: hm.metabolicRateTwaW },
    sweep: MET_SWEEP.map((M) => {
      const ral = ok(E.nioshRecommendedAlertLimitC(M));
      const rel = ok(E.nioshRecommendedExposureLimitC(M));
      return { metabolicRateW: M, ralC: ral.limitWbgtC, relC: rel.limitWbgtC, warned: ral.warnings.length > 0 };
    }),
    range: E.NIOSH_HEAT_FIGURE_RANGE_W,
    assessments: [true, false].map((acclimatized) => {
      const r = ok(E.nioshHeatAssessment({ acclimatized, wbgtPeriods: HEAT_WBGT_HOUR, metabolicPeriods: HEAT_MET_HOUR }));
      return { acclimatized, criterion: r.criterion, limitWbgtC: r.limitWbgtC, marginC: r.marginC, exceeds: r.exceeds };
    }),
    refusals: [
      refused(E.nioshHeatAssessment({ acclimatized: true, wbgtPeriods: [{ wbgtC: 30, durationMin: 45 }], metabolicPeriods: HEAT_MET_HOUR })),
      refused(E.nioshHeatAssessment({ acclimatized: true, wbgtPeriods: HEAT_WBGT_HOUR, metabolicPeriods: [{ metabolicRateW: 300, durationMin: 75 }] })),
      refused(E.nioshHeatAssessment({ acclimatized: 'yes', wbgtPeriods: HEAT_WBGT_HOUR, metabolicPeriods: HEAT_MET_HOUR })),
    ],
    evidence: TRANSCRIPTION_ONLY,
  };
};

/** The worked example that disagrees, and the band summaries. */
export const disagreement = () => ({
  examples: GOLD.errata.filter((c) => c.id.startsWith('niosh-heat-example-')).map((c) => {
    const got = ok(DOORS[c.fn](...c.args))[c.key];
    return { id: c.id, metabolicRateW: c.args[0], equationC: got, printedC: c.printed, differenceC: c.printed - got, toleranceC: c.tolerance };
  }),
  bands: [[233, 30], [349, 28], [465, 26], [580, 25]].map(([M, band]) => {
    const r = ok(E.nioshRecommendedExposureLimitC(M)).limitWbgtC;
    return { metabolicRateW: M, relC: r, bandC: band, bandMinusEquationC: band - r };
  }),
  evidence: TRANSCRIPTION_ONLY,
});

/* ------------------------------------------------ EVIDENCE AND ERRATA */

const TRANSCRIPTION_DOORS = new Set(['wbgtIndoorC', 'wbgtOutdoorC', 'nioshRecommendedAlertLimitC', 'nioshRecommendedExposureLimitC', 'nioshHeatAssessment']);
const DEFINITION_DOORS = new Set(['wbgtTwaC', 'metabolicRateTwaW', 'chemicalStel15Min']);

/** Every door's evidence class, counted out of the vendored golden. */
export const evidence = () => {
  const by = {};
  GOLD.cases.forEach((c) => { by[c.fn] = by[c.fn] || { published: 0, oracle: 0, errata: 0 }; by[c.fn][c.basis] += 1; });
  GOLD.errata.forEach((c) => { by[c.fn] = by[c.fn] || { published: 0, oracle: 0, errata: 0 }; by[c.fn].errata += 1; });
  return Object.keys(DOORS).filter((k) => typeof DOORS[k] === 'function' && k !== 'resolveNoiseCriterion').sort().map((fn) => {
    const b = by[fn] || { published: 0, oracle: 0, errata: 0 };
    let cls = b.published ? 'PUBLISHED, REPRODUCED' : 'ORACLE ONLY';
    if (DEFINITION_DOORS.has(fn)) cls = 'ARITHMETIC BY DEFINITION';
    if (TRANSCRIPTION_DOORS.has(fn)) cls = 'TRANSCRIPTION ONLY';
    return { fn, published: b.published, oracle: b.oracle, errata: b.errata, refusals: GOLD.refusals.filter((c) => c.fn === fn).length, cls };
  });
};

export const errata = () => ({
  rows: GOLD.errata.map((c) => {
    const got = ok(DOORS[c.fn](...c.args))[c.key];
    return { id: c.id, fn: c.fn, argument: c.args[0], printed: c.printed, engine: got, difference: got - c.printed, tolerance: c.tolerance, tolerancesAway: Math.abs(got - c.printed) / c.tolerance, why: c.why };
  }),
  neighbours: [114, 115, 116].map((d) => ({ dosePct: d, twaDbA: ok(E.noiseTwaFromDoseDbA(d, 'OSHA_PEL')).twaDbA })),
});

/** Every reader, by name. The test walks all of them. */
export const READERS = Object.freeze({
  threeCriteria, warnings, publishedTables, inverses, extendedShift, lex, protectors, chemicals, briefScala, heat, disagreement, evidence, errata,
});
