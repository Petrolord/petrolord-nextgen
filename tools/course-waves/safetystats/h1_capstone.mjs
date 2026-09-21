// THE EIGHTEEN GRADED H1 CAPSTONE ANSWERS, COMPUTED BY THE ENGINE.
//
// Three workplaces, six graded fields each, every one a RETURN VALUE of the
// vendored engines/hse/safetyStats.js (or, for the one revised centre line, the
// engine re-run on the months the engine itself did not flag). A gate that
// restates the formula validates nothing, so nothing here computes a rate, a
// limit or a p-value by its own arithmetic: every number is read off an engine
// result object, and discriminate.mjs is where the wrong methods live.
//
//   OKRIKA    Associate     rates and bases, sum-then-divide, the rolling rate
//   BONNY     Professional  the exact interval, zero events, comparing two rates
//   FORCADOS  Expert        the u-chart, a revised centre, and the judgement a
//                           signal calls for
//
// Usage:
//   node h1_capstone.mjs            the human table
//   node h1_capstone.mjs --json     the rows make_fields.mjs writes
//   node h1_capstone.mjs --inputs   the three scenarios, for oracle_check.py
//
// NOTHING HERE READS THE DIGEST OR THE TEACHING STREAMS, and the digest
// generator reads nothing here. The two run different workplaces on different
// numbers, and gate_capstone_leak.py proves it in both directions.
import process from 'node:process';

const ROOT = process.env.H1_ENGINES || '/root/wt-h1-nextgen/packages/engines';
const S = await import(`${ROOT}/engines/hse/safetyStats.js`);
const TOLPATH = process.env.H1_TOLERANCE
  || '/root/wt-h1-nextgen/src/components/course/panels/safetystats/gradedTolerance.js';
const { GRADED_FIELDS, gradedTolerance, PRINTED_DECIMALS } = await import(TOLPATH);

/* ---------------------------------------------------------- the machinery */

const ASSERTS = [];
const must = (claim, cond, detail) => {
  ASSERTS.push({ claim, pass: !!cond, detail: String(detail) });
  return !!cond;
};
const keys = (r) => (r && typeof r === 'object' ? Object.keys(r).join(', ') : String(r));
/** A call this file LABELS a success: no error key, and every top-level number finite. */
const success = (label, r) => {
  must(`LABELLED A SUCCESS: ${label}`, !!(r && !r.error), r && r.error ? r.error : 'no error key');
  if (r && !r.error) {
    const bad = Object.entries(r).filter(([, v]) => typeof v === 'number' && !Number.isFinite(v));
    must(`SUCCESS CARRIES NO NON-FINITE NUMBER: ${label}`, bad.length === 0,
      bad.length ? bad.map(([k, v]) => `${k}=${v}`).join(', ') : 'every number finite');
  }
  return r;
};
const sum = (a) => a.reduce((x, y) => x + y, 0);

/* ======================================================= OKRIKA, Associate

   An export terminal's annual safety report, company employees and
   contractors reported separately, plus a fourteen-month series of combined
   recordables and hours. Months one to twelve are the calendar year, so they
   sum to the annual totals; months thirteen and fourteen are the first two of
   the next year, and month fourteen is a short month with one recordable.
   ==================================================================== */

const OKRIKA = Object.freeze({
  employeeHours: 1846220,
  contractorHours: 3127655,
  employeeRecordables: 5,
  contractorRecordables: 11,
  lostTimeInjuries: 4,
  fatalities: 1,
  daysLost: 187,
  tier1Pse: 3,
  tier2Pse: 7,
  monthlyRecordables: [1, 2, 0, 1, 3, 1, 0, 2, 1, 2, 1, 2, 1, 1],
  monthlyHours: [452115, 439760, 468930, 27450, 446205, 461880, 455330, 448615, 470470, 441905, 458240, 402975, 449820, 36180],
});

const okHours = OKRIKA.employeeHours + OKRIKA.contractorHours;
must('Okrika: the first twelve months sum to the annual hours',
  sum(OKRIKA.monthlyHours.slice(0, 12)) === okHours, `${sum(OKRIKA.monthlyHours.slice(0, 12))} against ${okHours}`);
must('Okrika: the first twelve months sum to the annual recordables',
  sum(OKRIKA.monthlyRecordables.slice(0, 12)) === OKRIKA.employeeRecordables + OKRIKA.contractorRecordables,
  sum(OKRIKA.monthlyRecordables.slice(0, 12)));

const okPooled = success('Okrika pooledRate over the two workforces', S.pooledRate({
  counts: [OKRIKA.employeeRecordables, OKRIKA.contractorRecordables],
  exposureHours: [OKRIKA.employeeHours, OKRIKA.contractorHours],
  base: S.RATE_BASES.OSHA_200K,
}));
must('Okrika: the pooled rate and the mean of the two workforce rates differ',
  Math.abs(okPooled.rate - okPooled.meanOfPeriodRates) > 1e-3, `${okPooled.rate} against ${okPooled.meanOfPeriodRates}`);
const okLtir = success('Okrika incidenceRate, lost time on the IOGP base', S.incidenceRate({
  count: OKRIKA.lostTimeInjuries, exposureHours: okHours, base: S.RATE_BASES.IOGP_1M,
}));
const okFar = success('Okrika fatalAccidentRate', S.fatalAccidentRate({
  fatalities: OKRIKA.fatalities, exposureHours: okHours,
}));
must('Okrika: FAR carries the 100,000,000 hour base', okFar.basis.base === 1e8, okFar.basis.base);
const okSev = success('Okrika severityRate on the OSHA base', S.severityRate({
  daysLost: OKRIKA.daysLost, exposureHours: okHours, base: S.RATE_BASES.OSHA_200K,
}));
const okPse = success('Okrika pseRate, Tier 1 on the OSHA base', S.pseRate({
  tier: 1, pseCount: OKRIKA.tier1Pse, exposureHours: okHours, base: S.RATE_BASES.OSHA_200K,
}));
must('Okrika: the Tier 1 rate is labelled Tier 1', okPse.tier === 1, okPse.tier);
const okRolling = success('Okrika rollingRate, twelve-month window', S.rollingRate({
  counts: OKRIKA.monthlyRecordables, exposureHours: OKRIKA.monthlyHours,
  base: S.RATE_BASES.OSHA_200K, windowPeriods: 12,
}));
must('Okrika: fourteen months give three complete twelve-month windows', okRolling.windows.length === 3, okRolling.windows.length);
const okLast = okRolling.windows[2];
must('Okrika: the last window ends at month fourteen', okLast.endIndex === 13 && okLast.startIndex === 2,
  `${okLast.startIndex}..${okLast.endIndex}`);
must('Okrika: the first window IS the calendar year, so its rate equals the pooled annual rate',
  okRolling.windows[0].rate === okPooled.rate, `${okRolling.windows[0].rate} against ${okPooled.rate}`);

/* ==================================================== BONNY, Professional

   Two contractor crews on the same scope and one small crew with no events.
   ALPHA has the fewer hours and the more recordables. The comparison is built
   so the engine's CENTRAL p-value sits above 0.05 while the minlike
   convention of R's poisson.test and scipy's binomtest would sit below it,
   and the engine's own rate-ratio interval agrees with the central answer.
   ==================================================================== */

const BONNY = Object.freeze({
  alphaRecordables: 9,
  alphaHours: 612340,
  betaRecordables: 7,
  betaHours: 1406775,
  crewRecordables: 0,
  crewHours: 83560,
  confidence: 0.95,
});

const bnAlpha = success('Bonny rateConfidenceInterval, Alpha crew', S.rateConfidenceInterval({
  count: BONNY.alphaRecordables, exposureHours: BONNY.alphaHours,
  base: S.RATE_BASES.OSHA_200K, confidence: BONNY.confidence,
}));
const bnCrew = success('Bonny rateConfidenceInterval, the crew with no events', S.rateConfidenceInterval({
  count: BONNY.crewRecordables, exposureHours: BONNY.crewHours,
  base: S.RATE_BASES.OSHA_200K, confidence: BONNY.confidence,
}));
must('Bonny: at zero events the lower limit is zero', bnCrew.lower === 0, bnCrew.lower);
const bnCmp = success('Bonny compareRates, Alpha against Beta', S.compareRates({
  count1: BONNY.alphaRecordables, exposureHours1: BONNY.alphaHours,
  count2: BONNY.betaRecordables, exposureHours2: BONNY.betaHours, confidence: BONNY.confidence,
}));
must('Bonny: the central p-value is above 0.05', bnCmp.pValue > 0.05, bnCmp.pValue);
must('Bonny: the rate-ratio interval includes 1, agreeing with the p-value',
  bnCmp.rateRatioLower < 1 && bnCmp.rateRatioUpper > 1, `${bnCmp.rateRatioLower}..${bnCmp.rateRatioUpper}`);
must('Bonny: the ratio is bounded above', bnCmp.upperUnbounded === false, bnCmp.upperUnbounded);

/* ===================================================== FORCADOS, Expert

   A year of monthly recordables across a producing field, with a turnaround
   in month seven (the most hours) and a shutdown in month nine (the fewest).
   Month six carries a cluster of recordables that the chart flags. An
   intervention went in at the start of month seven, so the question the
   capstone asks is whether the second half is really lower than the first,
   with month six in and with month six out.
   ==================================================================== */

const FORCADOS = Object.freeze({
  monthlyRecordables: [14, 11, 17, 9, 13, 38, 21, 12, 2, 13, 10, 11],
  monthlyHours: [736410, 702885, 781260, 544370, 719935, 902640, 1386215, 748120, 118460, 731055, 694830, 752390],
  confidence: 0.95,
});

const fcChart = success('Forcados uChart', S.uChart({
  counts: FORCADOS.monthlyRecordables, exposureHours: FORCADOS.monthlyHours, base: S.RATE_BASES.OSHA_200K,
}));
must('Forcados: the chart flags exactly month six, above', JSON.stringify(fcChart.outOfControl) === '[5]'
  && fcChart.points[5].signal === 'above', JSON.stringify(fcChart.outOfControl));
const hoursRank = [...FORCADOS.monthlyHours].sort((a, b) => a - b);
must('Forcados: month nine has the fewest hours', FORCADOS.monthlyHours[8] === hoursRank[0], FORCADOS.monthlyHours[8]);
must('Forcados: month seven has the most hours', FORCADOS.monthlyHours[6] === hoursRank[11], FORCADOS.monthlyHours[6]);
must('Forcados: month nine lower limit is floored at zero', fcChart.points[8].lclFloored === true, fcChart.points[8].lcl);
must('Forcados: month seven lower limit is positive and not floored',
  fcChart.points[6].lclFloored === false && fcChart.points[6].lcl > 0, fcChart.points[6].lcl);

const kept = FORCADOS.monthlyRecordables.map((_, i) => i).filter((i) => !fcChart.outOfControl.includes(i));
const fcRevised = success('Forcados uChart, revised without the flagged month', S.uChart({
  counts: kept.map((i) => FORCADOS.monthlyRecordables[i]),
  exposureHours: kept.map((i) => FORCADOS.monthlyHours[i]),
  base: S.RATE_BASES.OSHA_200K,
}));
must('Forcados: the revised chart flags nothing', fcRevised.outOfControl.length === 0, JSON.stringify(fcRevised.outOfControl));

const half = (idx) => ({
  count: sum(idx.map((i) => FORCADOS.monthlyRecordables[i])),
  hours: sum(idx.map((i) => FORCADOS.monthlyHours[i])),
});
const before = half([0, 1, 2, 3, 4, 5]);
const after = half([6, 7, 8, 9, 10, 11]);
const beforeOut = half([0, 1, 2, 3, 4]);
const fcCmp = success('Forcados compareRates, after against before', S.compareRates({
  count1: after.count, exposureHours1: after.hours, count2: before.count, exposureHours2: before.hours,
  confidence: FORCADOS.confidence,
}));
const fcCmpOut = success('Forcados compareRates, after against before without month six', S.compareRates({
  count1: after.count, exposureHours1: after.hours, count2: beforeOut.count, exposureHours2: beforeOut.hours,
  confidence: FORCADOS.confidence,
}));
must('Forcados: with month six the drop is significant at 0.05', fcCmp.pValue < 0.05, fcCmp.pValue);
must('Forcados: without month six it is not', fcCmpOut.pValue > 0.05, fcCmpOut.pValue);

/* ---------------------------------------------------------------- the rows */

const ROWS = [
  ['beginner', 'okrika_combined_trir_per_200k', 'rate', okPooled.rate],
  ['beginner', 'okrika_combined_ltir_per_1m', 'rate', okLtir.rate],
  ['beginner', 'okrika_far_per_100m', 'rate', okFar.rate],
  ['beginner', 'okrika_severity_rate_per_200k', 'rate', okSev.rate],
  ['beginner', 'okrika_tier1_pse_rate_per_200k', 'rate', okPse.rate],
  ['beginner', 'okrika_rolling12_trir_month14_per_200k', 'rate', okLast.rate],
  ['intermediate', 'bonny_alpha_trir_lower95_per_200k', 'rate', bnAlpha.lower],
  ['intermediate', 'bonny_alpha_trir_upper95_per_200k', 'rate', bnAlpha.upper],
  ['intermediate', 'bonny_crew_zero_event_upper95_per_200k', 'rate', bnCrew.upper],
  ['intermediate', 'bonny_rate_ratio_lower95', 'ratio', bnCmp.rateRatioLower],
  ['intermediate', 'bonny_rate_ratio_upper95', 'ratio', bnCmp.rateRatioUpper],
  ['intermediate', 'bonny_compare_p_value', 'p', bnCmp.pValue],
  ['advanced', 'forcados_centre_per_200k', 'rate', fcChart.centre],
  ['advanced', 'forcados_ucl_month09_per_200k', 'rate', fcChart.points[8].ucl],
  ['advanced', 'forcados_lcl_month07_per_200k', 'rate', fcChart.points[6].lcl],
  ['advanced', 'forcados_revised_centre_per_200k', 'rate', fcRevised.centre],
  ['advanced', 'forcados_before_after_p_value', 'p', fcCmp.pValue],
  ['advanced', 'forcados_before_after_p_value_without_month06', 'p', fcCmpOut.pValue],
].map(([tier, key, cls, value]) => ({ tier, key, cls, value }));

must('the eighteen rows are the eighteen declared fields, in the declared order and classes',
  JSON.stringify(ROWS.map((r) => [r.tier, r.key, r.cls]))
  === JSON.stringify(GRADED_FIELDS.map(([t, k, c]) => [t, k, c])),
  `${ROWS.length} rows`);
ROWS.forEach((r) => must(`${r.key} is a finite positive number`, Number.isFinite(r.value) && r.value > 0, r.value));
// NEVER GRADE A SMALL INTEGER (kit README section 11): a whole number sits
// inside every guard band. Every graded value must carry a fractional part a
// learner reads off the engine.
ROWS.forEach((r) => must(`${r.key} is not a whole number`, Math.abs(r.value - Math.round(r.value)) > 1e-3, r.value));

/* -------------------------------------------------------------- reporting */

const failed = ASSERTS.filter((a) => !a.pass);
if (failed.length) {
  failed.forEach((a) => process.stderr.write(`  FAILED  ${a.claim}\n          ${a.detail}\n`));
  process.stderr.write(`h1_capstone: ${ASSERTS.length} assertions, ${failed.length} FAILED. NOTHING WRITTEN.\n`);
  process.exit(1);
}
process.stderr.write(`h1_capstone: ${ASSERTS.length} label-and-call and scenario assertions run, 0 failed\n`);

if (process.argv.includes('--json')) {
  process.stdout.write(`${JSON.stringify(ROWS)}\n`);
} else if (process.argv.includes('--inputs')) {
  process.stdout.write(`${JSON.stringify({ OKRIKA, BONNY, FORCADOS })}\n`);
} else {
  const pad = (s, n2) => String(s).padEnd(n2);
  process.stdout.write(`${pad('TIER', 14)}${pad('KEY', 48)}${pad('CLASS', 7)}${pad('VALUE', 16)}TOLERANCE\n`);
  ROWS.forEach((r) => process.stdout.write(
    `${pad(r.tier, 14)}${pad(r.key, 48)}${pad(r.cls, 7)}${pad(r.value.toFixed(PRINTED_DECIMALS[r.cls]), 16)}${gradedTolerance(r.key)}\n`));
}
