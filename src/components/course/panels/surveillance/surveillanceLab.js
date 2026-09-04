// Teaching lab for PD9, Production Surveillance. The three panels, the shipped
// lessons and the vitest files all read this one module, so a number shown to a
// learner and a number a test pins cannot drift apart.
//
// Everything here is the vendored engines' own output. Every derived point,
// every window mean, every exception, every allocation factor, every screening
// score and every refusal sentence below is a return value from a call into
// engines/production/surveillance.js, allocation.js, liftScreening.js or
// liftAdvisor.js, run over the four published goldens or over the TEACHING
// CASES this wave declared for itself. Nothing in this file re-implements an
// engine. The only arithmetic done here is the arithmetic a PANEL would
// otherwise have to do on the engine's return values: a difference, a ratio, a
// percentage change, a count, a share. That arithmetic lives here on purpose,
// so a panel is a renderer and never a calculator.
//
// UNITS. Oil and water volumes in stb OVER ONE LEDGER ROW, which every module
// here reads as a calendar day whatever the row actually covers. Gas in Mscf.
// Producing-day rates in stb/d and Mscf/d, the volume scaled to 24 hours. Hours
// on stream in h. A watercut is a 0 to 1 FRACTION in surveillance and
// allocation and a PER CENT in the two lift modules, so every field carrying
// one says which in its name. A gas-oil ratio is scf/stb. An allocation factor
// is dimensionless. A nominal decline is per DAY and an effective decline is a
// PER CENT over the first year. A screening score is unitless and is a ranking
// device, not a probability. Nothing here is SI.
//
// TEN PROVENANCE RULES THIS FILE EXISTS TO KEEP. Every one was found in the
// material rather than assumed, and every one is easy to lose in a panel.
//
//   1. THE HEADLINE RULE OF THIS WAVE. THE EXCEPTION ENGINE NEVER READS THE
//      PRODUCING-DAY RATE. `detectExceptions` sets its rate key to 'oil', the
//      CALENDAR VOLUME. The producing-day rate is computed on every point as
//      oilPd, waterPd, gasPd and liquidPd and is read by exactly one function
//      in the file, the decline overlay. So EVERY accessor here that exposes a
//      window reading exposes BOTH columns side by side, under distinctly
//      named fields:
//
//         calendarMean          the column detectExceptions actually reads
//         producingDayMean      the column it never reads
//         dropPctOnCalendar     the percentage the engine reports
//         dropPctOnProducingDay the percentage nobody computes
//
//      A panel cannot show one of those without the other, because no accessor
//      here returns one without the other.
//
//   2. TWO FUNCTIONS IN ONE FILE FORM THE SAME TWO RATIOS TWO DIFFERENT WAYS.
//      `computeKpis` forms a period watercut and gas-oil ratio VOLUMETRICALLY,
//      sum over sum. `detectExceptions` forms the same two as the MEAN OF THE
//      DAILY RATIOS. Neither is wrong and they disagree, so every seam
//      accessor returns `meanOfRatios` and `volumetric` together with the
//      severity each one prints.
//
//   3. A SEVERITY IS NOT A MEASUREMENT. high, medium and info are the names of
//      two threshold crossings, so every exception row here carries the
//      SETTING it was measured against and the doubling point that took it to
//      high, and the three types that do not work that way at all are flagged:
//      shut_in is always high, downtime is ALWAYS MEDIUM whatever the hours,
//      and stale_data cannot exceed medium however long the silence.
//
//   4. A MISSING VALUE HAS FOUR SPELLINGS AND FOUR MEANINGS ACROSS THE FOUR
//      MODULES. `derivePoint` coerces a volume with `row.oil_stb || 0`, which
//      returns the STRING when the column arrived as text; `buildFieldSeries`
//      accumulates onto it and CONCATENATES. The same absent hours column is
//      uptime unknown in surveillance and a full day on in allocation. So
//      every coercion row here carries the spelling, both readings and the
//      factor between them.
//
//   5. THREE GUARDS DECIDE MORE THAN THE LIMITS THEY NAME. `maxTestAgeDays` is
//      guarded with `Number.isFinite(x) && x > 0`, so ZERO turns the age check
//      OFF. `minOilRate` gates the rate check and the gas-oil ratio check and
//      does not gate the watercut check. `decimate` strides by a ceiling, so
//      the count it returns can be MORE than the maximum its own argument
//      names. Every guard row carries what was asked and what came back.
//
//   6. NOTHING IN A LEDGER ROW SAYS HOW LONG THE ROW COVERS. `derivePoint`
//      reads every row as a calendar day; `detectExceptions` widens its
//      WINDOWS for a coarse cadence and never rescales the VOLUMES. Every
//      period row here carries the elapsed days beside the period volume.
//
//   7. ONE FUNCTION IN surveillance.js READS THE WALL CLOCK.
//      `summarizeDeferments` defaults its asOf to today. Every deferment
//      accessor here takes an EXPLICIT asOf, and the wall-clock finding is
//      exposed as a BOOLEAN and as anchored recomputations, never as a bare
//      number, because a number that changes daily cannot be pinned.
//
//   8. TWO FAILURE CONTRACTS, AND SEVERAL REFUSALS THAT NAME THE WRONG THING.
//      `computeKpis` returns null on an empty series; `derivePoint` returns
//      null members; the lift advisor returns `{ ok: false, reason }` and one
//      of its guards fails OPEN on a NaN. Every refusal row here carries `ok`
//      or `isFinite` explicitly and the exact words the engine printed.
//
//   9. A GOLDEN, A DERIVED SWEEP AND A TEACHING CASE ARE THREE DIFFERENT
//      CLAIMS AND EVERY ROW SAYS WHICH IT IS. A `golden` value was committed
//      by an independent stdlib oracle: the surveillance oracle does every
//      date arithmetic on the CALENDAR where the module counts
//      epoch-millisecond day numbers; the allocation oracle splits the metered
//      total as a SHARE where the module multiplies by a precomputed factor;
//      the screening oracle re-expresses every rule as a declarative penalty
//      ledger walked by one generic scorer; the advisor oracle takes the
//      reference stage as a covering SET and the reconciliation as a full
//      four-way truth table. A `derived` row is the shipped engine re-run on
//      published inputs or a sweep around them, and a sweep point is not a
//      published case. A `teaching` row belongs to OGUTA and the constructed
//      demonstrations, invented by this wave: no oracle has ever checked any
//      of it.
//
//  10. WHAT THE ORACLES NEVER GATE, WHICH IS WHERE MOST OF THIS COURSE LIVES.
//      They gate what each function RETURNS on the inputs the goldens publish.
//      They do not gate which of two functions a caller should have used, what
//      a missing column means, or what a refusal sentence says. Two of the
//      seams the goldens DO publish, as measured disagreements rather than as
//      expected values, are `surveillance_cases.ratioSeam` and
//      `lift_screening_cases.seams`, and every accessor that quotes one says
//      so, because publishing a disagreement rather than resolving it is the
//      right thing to have done.
//
// THE CAPSTONE BOUNDARY. There is no capstone material in this file at all.
// PD9's graded field is a different field with different wells, different
// dates, different tests and a different meter from anything in this lab, and
// its eighteen graded fields live in the wave's own derivation and never enter
// the lab, so a panel cannot reach one by mistake. What guards that is
// panelCapstoneGuard.test.js, which reads the graded field list out of the
// wave directory and checks every number this lab exposes against it,
// dimension blind, at ten times the grader's own absolute tolerance, under the
// same restatements the PD5 to PD8 guards use.
//
// PURITY AND CACHING. Every accessor is pure and deterministic: no random
// number anywhere, no wall clock anywhere, and two calls with the same
// arguments return equal values. The engine runs that several accessors
// re-read are cached, and every accessor maps a cached return into FRESH rows,
// so a panel cannot mutate one and change what another panel sees.

import surveillanceGolden from '@petrolord/engines/test-data/production/goldens/surveillance_cases.json';
import allocationGolden from '@petrolord/engines/test-data/production/goldens/allocation_cases.json';
import screeningGolden from '@petrolord/engines/test-data/production/goldens/lift_screening_cases.json';
import advisorGolden from '@petrolord/engines/test-data/production/goldens/lift_advisor_cases.json';
import {
  DEFAULT_SURVEILLANCE_SETTINGS, EXCEPTION_TYPES, FIT_STREAMS,
  derivePoint, buildWellSeries, buildFieldSeries, seriesCadenceDays,
  movingAverage, decimate, detectExceptions, summarizeDeferments, computeKpis,
  rateSeriesForFit, annualEffectiveDecline, fitWellDecline,
} from '@petrolord/engines/engines/production/surveillance.js';
import {
  DEFAULT_ALLOCATION_SETTINGS, DEFAULT_TEST_QC_SETTINGS, DEFAULT_NODAL_CHECK_SETTINGS,
  PHASES, TEST_ISSUES,
  groupTests, testInForce, computeAllocation, monthlyFactors, allocatedLedgerRows,
  imbalanceSeries, validateWellTests,
} from '@petrolord/engines/engines/production/allocation.js';
import {
  LIFT_METHODS, screenLift, screeningInputsFromModel,
} from '@petrolord/engines/engines/production/liftScreening.js';
import {
  ROD_TRIALS, RATE_TOLERANCE, ATM_PSIA,
  num, psigToPsia, liquidGravity, plungerWellGlr, pickReferenceStage, pickMotorFrame,
  runDesignPass, reconcile,
} from '@petrolord/engines/engines/production/liftAdvisor.js';

export {
  DEFAULT_SURVEILLANCE_SETTINGS, DEFAULT_ALLOCATION_SETTINGS, DEFAULT_TEST_QC_SETTINGS,
  DEFAULT_NODAL_CHECK_SETTINGS, EXCEPTION_TYPES, TEST_ISSUES, PHASES, FIT_STREAMS,
  LIFT_METHODS, ROD_TRIALS, RATE_TOLERANCE, ATM_PSIA,
  derivePoint, buildWellSeries, buildFieldSeries, seriesCadenceDays, movingAverage,
  decimate, detectExceptions, summarizeDeferments, computeKpis, rateSeriesForFit,
  annualEffectiveDecline, fitWellDecline,
  groupTests, testInForce, computeAllocation, monthlyFactors, allocatedLedgerRows,
  imbalanceSeries, validateWellTests,
  screenLift, screeningInputsFromModel,
  num, psigToPsia, liquidGravity, plungerWellGlr, pickReferenceStage, pickMotorFrame,
  runDesignPass, reconcile,
};

export const SURVEILLANCE_GOLDEN = surveillanceGolden;
export const ALLOCATION_GOLDEN = allocationGolden;
export const SCREENING_GOLDEN = screeningGolden;
export const ADVISOR_GOLDEN = advisorGolden;

// ---------------------------------------------------------------------------
// CONSTANTS THIS FILE DECLARES. Four are the wave's own declared constants and
// the rest are published case inputs read off a golden file or off a module's
// own exported defaults. None of them is an engine value dressed up as
// something else.
// ---------------------------------------------------------------------------

/** Milliseconds per day, the epoch day number both modules count in. */
export const MS_PER_DAY = 86400000;

/** scf per Mscf, the only unit conversion in surveillance.js. */
export const SCF_PER_MSCF = 1000;

/** Hours in a producing day, the divisor in every producing-day rate. */
export const HOURS_PER_DAY = 24;

/** The day count annualEffectiveDecline evaluates the Arps rate law at. */
export const DAYS_IN_YEAR = 365;

/** The teaching field this wave invented. Never a real field. */
export const TEACHING_FIELD_NAME = 'OGUTA';

/** The teaching field's own latest ledger date, which every window anchors on. */
export const TEACHING_AS_OF = '2024-11-20';

/** The teaching lift well's true vertical depth, ft. */
export const TEACHING_LIFT_DEPTH_FT = 9200;

// ---------------------------------------------------------------------------
// SMALL HELPERS
// ---------------------------------------------------------------------------

const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const k = JSON.stringify(args);
    if (!cache.has(k)) cache.set(k, fn(...args));
    return cache.get(k);
  };
};

const dayOf = (isoDate) => Math.round(new Date(`${isoDate}T00:00:00Z`).getTime() / MS_PER_DAY);
const isoOfDay = (d) => new Date(d * MS_PER_DAY).toISOString().slice(0, 10);

const finiteOrNull = (v) => (Number.isFinite(v) ? v : null);

const meanOf = (values) => {
  const fin = values.filter((v) => Number.isFinite(v));
  return fin.length ? fin.reduce((a, b) => a + b, 0) / fin.length : null;
};

const sumOf = (values) => values.reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0);

/**
 * The same window reading `detectExceptions` makes internally, over the same
 * half-open interval (fromDay, toDay]. It is reproduced here rather than
 * imported because the engine does not export it, and a panel that formed its
 * own window would be a panel that computes.
 */
const windowRead = (points, key, fromDay, toDay) => {
  const vals = [];
  points.forEach((p) => {
    const d = dayOf(p.date);
    if (d > fromDay && d <= toDay) vals.push(p[key]);
  });
  const fin = vals.filter((v) => Number.isFinite(v));
  return {
    mean: fin.length ? fin.reduce((a, b) => a + b, 0) / fin.length : null,
    count: fin.length,
    rowsInWindow: vals.length,
  };
};

/** The engine's own widening rule, read off the branch rather than assumed. */
const widenedWindows = (cadenceDays, settings = DEFAULT_SURVEILLANCE_SETTINGS) => {
  const cad = cadenceDays || 1;
  return {
    cadenceDays: cad,
    recentDays: Math.max(settings.recentDays, Math.ceil(cad * 1.5)),
    baselineDays: Math.max(settings.baselineDays, Math.ceil(cad * 4)),
    staleDays: Math.max(settings.staleDays, Math.ceil(cad * 1.5)),
  };
};

const pctChange = (recent, base) => (
  Number.isFinite(recent) && Number.isFinite(base) && base !== 0
    ? ((recent - base) / base) * 100
    : null
);

const dropPct = (recent, base) => (
  Number.isFinite(recent) && Number.isFinite(base) && base !== 0
    ? ((base - recent) / base) * 100
    : null
);

// ---------------------------------------------------------------------------
// SECTION 0 SURFACE. THE FOUR MODULES, THEIR DIALS AND THEIR SEVERITY LADDER.
// ---------------------------------------------------------------------------

/** The four modules, what each one owns, and what a course must never call it. */
export const moduleRows = () => [
  {
    file: 'surveillance.js',
    owns: 'Reads a ledger and says which wells to go and look at.',
    functions: ['derivePoint', 'buildWellSeries', 'buildFieldSeries', 'seriesCadenceDays',
      'movingAverage', 'decimate', 'detectExceptions', 'summarizeDeferments', 'computeKpis',
      'rateSeriesForFit', 'fitWellDecline', 'annualEffectiveDecline'],
    provenance: 'derived',
  },
  {
    file: 'allocation.js',
    owns: 'Splits one metered stream across the wells.',
    functions: ['groupTests', 'testInForce', 'computeAllocation', 'monthlyFactors',
      'allocatedLedgerRows', 'imbalanceSeries', 'validateWellTests',
      'crossCheckTestsAgainstNodal'],
    provenance: 'derived',
  },
  {
    file: 'liftScreening.js',
    owns: 'A rules matrix. Six methods, each starting at 100 and deducting with a stated reason. Nothing here is derived from anything, so it is a checklist with a number attached and never a calculation.',
    functions: ['screenLift', 'screeningInputsFromModel'],
    provenance: 'derived',
  },
  {
    file: 'liftAdvisor.js',
    owns: 'The design pass. It runs each method real design chain on one shared well record and reconciles the answer against the matrix. When the two disagree the design wins.',
    functions: ['runDesignPass', 'reconcile', 'plungerWellGlr', 'pickReferenceStage',
      'pickMotorFrame', 'liquidGravity'],
    provenance: 'derived',
  },
];

/** Every dial in the domain, with the module that reads it. */
export const settingRows = () => [
  ...Object.entries(DEFAULT_SURVEILLANCE_SETTINGS).map(([key, value]) => ({
    module: 'surveillance', key, value, provenance: 'derived',
  })),
  ...Object.entries(DEFAULT_ALLOCATION_SETTINGS).map(([key, value]) => ({
    module: 'allocation', key, value: typeof value === 'boolean' ? value : value, provenance: 'derived',
  })),
  ...Object.entries(DEFAULT_TEST_QC_SETTINGS).map(([key, value]) => ({
    module: 'test QC', key, value, provenance: 'derived',
  })),
].filter((r) => typeof r.value !== 'string');

/**
 * The severity ladder, and the three types that do not climb it. Every row
 * carries the SETTING the crossing is measured against, because a severity
 * with no threshold beside it is a word rather than a finding.
 */
export const severityLadderRows = () => [
  {
    type: 'shut_in', settingKey: 'minOilRate',
    settingValue: DEFAULT_SURVEILLANCE_SETTINGS.minOilRate,
    doublingAt: null, canReachHigh: true, alwaysHigh: true, alwaysMedium: false,
    cannotExceedMedium: false, gatedByMinOilRate: true,
    note: 'Always high whatever the size of the well, and it sits inside the minimum rate gate, so a small well that stops altogether raises nothing at all.',
  },
  {
    type: 'rate_drop', settingKey: 'rateDropPct',
    settingValue: DEFAULT_SURVEILLANCE_SETTINGS.rateDropPct,
    doublingAt: DEFAULT_SURVEILLANCE_SETTINGS.rateDropPct * 2,
    canReachHigh: true, alwaysHigh: false, alwaysMedium: false,
    cannotExceedMedium: false, gatedByMinOilRate: true,
    note: 'Measured on the CALENDAR volume and never on the producing-day rate.',
  },
  {
    type: 'injection_drop', settingKey: 'rateDropPct',
    settingValue: DEFAULT_SURVEILLANCE_SETTINGS.rateDropPct,
    doublingAt: DEFAULT_SURVEILLANCE_SETTINGS.rateDropPct * 2,
    canReachHigh: true, alwaysHigh: false, alwaysMedium: false,
    cannotExceedMedium: false, gatedByMinOilRate: true,
    note: 'The same branch as a rate drop, with the injection column as the rate key.',
  },
  {
    type: 'watercut_rise', settingKey: 'watercutRisePts',
    settingValue: DEFAULT_SURVEILLANCE_SETTINGS.watercutRisePts,
    doublingAt: DEFAULT_SURVEILLANCE_SETTINGS.watercutRisePts * 2,
    canReachHigh: true, alwaysHigh: false, alwaysMedium: false,
    cannotExceedMedium: false, gatedByMinOilRate: false,
    note: 'The one comparison the minimum rate gate does NOT cover, so a well too small to have a rate collapse reported still raises this one.',
  },
  {
    type: 'gor_rise', settingKey: 'gorRisePct',
    settingValue: DEFAULT_SURVEILLANCE_SETTINGS.gorRisePct,
    doublingAt: DEFAULT_SURVEILLANCE_SETTINGS.gorRisePct * 2,
    canReachHigh: true, alwaysHigh: false, alwaysMedium: false,
    cannotExceedMedium: false, gatedByMinOilRate: true,
    note: 'Formed as the MEAN OF THE DAILY RATIOS, which is not how the field roll-up forms the same quantity: that one is VOLUMETRIC, a ratio of the window sums.',
  },
  {
    type: 'downtime', settingKey: 'downtimeHours',
    settingValue: DEFAULT_SURVEILLANCE_SETTINGS.downtimeHours,
    doublingAt: null, canReachHigh: false, alwaysHigh: false, alwaysMedium: true,
    cannotExceedMedium: true, gatedByMinOilRate: false,
    note: 'ALWAYS MEDIUM, unconditionally, whatever the hours. The branch also requires the mean hours to be ABOVE zero, so a well shut for the whole window is the one case it refuses to report.',
  },
  {
    type: 'stale_data', settingKey: 'staleDays',
    settingValue: DEFAULT_SURVEILLANCE_SETTINGS.staleDays,
    doublingAt: DEFAULT_SURVEILLANCE_SETTINGS.staleDays * 2,
    canReachHigh: false, alwaysHigh: false, alwaysMedium: false,
    cannotExceedMedium: true, gatedByMinOilRate: false,
    note: 'Doubling takes it only from info to medium, and it RETURNS EARLY, so no other comparison on that well is ever made.',
  },
].map((r) => ({
  ...r,
  label: EXCEPTION_TYPES[r.type].label,
  description: EXCEPTION_TYPES[r.type].description,
  provenance: 'derived',
}));

export const severityLadderHeadline = () => {
  const rows = severityLadderRows();
  return {
    provenance: 'derived',
    types: rows.length,
    typesThatCanReachHigh: rows.filter((r) => r.canReachHigh).length,
    typesThatCannotExceedMedium: rows.filter((r) => r.cannotExceedMedium).length,
    theOneThatIsAlwaysMediumUnconditionally: rows.find((r) => r.alwaysMedium).type,
    theOneThatIsAlwaysHigh: rows.find((r) => r.alwaysHigh).type,
    sortIsSeverityThenWellName: true,
    severityRanks: { high: 0, medium: 1, info: 2 },
  };
};

// ---------------------------------------------------------------------------
// THE TEACHING FIELD. OGUTA is a field this wave invented so that every Expert
// result has a case a lesson may quote. It is not a real field, none of its
// wells is a real well, and not one of its rows is a published case. It runs a
// DAILY ledger from 2024-09-12 to 2024-11-20 inclusive, seventy calendar days,
// with one well on a MONTHLY ledger so the widening rule has something to
// widen against. Every constant below is a DESIGN CONDITION of an invented
// field and not a result.
// ---------------------------------------------------------------------------

export const TEACHING_FIELD = Object.freeze({
  field: TEACHING_FIELD_NAME,
  firstDate: '2024-09-12',
  lastDate: '2024-11-20',
  // OGUTA-2, the seam well. A perfectly constant watercut and a perfectly
  // constant gas-oil ratio through the baseline, so that where the daily ratio
  // does not move a mean of ratios and a ratio of sums are the same number.
  o2BaselineOilCycle: Object.freeze([1042, 1019, 1063, 1031]),
  o2WaterPerOil: 0.31,
  o2GasPerOil: 0.58,
  o2Recent: Object.freeze([
    Object.freeze([1008, 312, 585]),
    Object.freeze([1021, 316, 592]),
    Object.freeze([88, 246, 149]),
    Object.freeze([82, 231, 141]),
    Object.freeze([1035, 321, 600]),
    Object.freeze([79, 224, 137]),
    Object.freeze([1014, 314, 588]),
  ]),
  // OGUTA-6, the uptime well. The producing-day oil rate is held EXACTLY
  // constant across the recent window and the calendar volume swings by a
  // factor of nearly three, because only the hours move.
  o6BaselineOilCycle: Object.freeze([503, 488, 517]),
  o6WaterPerOil: 0.22,
  o6GasPerOil: 0.47,
  o6PdRate: 512,
  o6RecentHours: Object.freeze([16.5, 7.8, 19.2, 14.1, 9.4, 21.6, 12.3]),
  // OGUTA-9, the clean decliner. Raises no exception at any default setting.
  o9Qi: 1180,
  o9Di: 0.0034,
  o9WaterPerOil: 0.36,
  o9GasPerOil: 0.72,
  // OGUTA-14, the monthly well, whose last period covers FOURTEEN days.
  o14Rows: Object.freeze([
    Object.freeze(['2024-05-31', 26400]), Object.freeze(['2024-06-30', 25600]),
    Object.freeze(['2024-07-31', 24800]), Object.freeze(['2024-08-31', 24000]),
    Object.freeze(['2024-09-30', 23200]), Object.freeze(['2024-10-14', 11600]),
  ]),
  o14WaterPerOil: 0.44,
  o14GasPerOil: 0.63,
  // OGUTA-17, the well that stops sending rows. It does not stop producing.
  o17Qi: 690,
  o17Di: 0.0092,
  o17WaterPerOil: 0.29,
  o17GasPerOil: 0.51,
  o17LastReportDate: '2024-10-28',
  // OGUTA-5, the small well, whose oil baseline sits UNDER minOilRate.
  o5BaselineOil: 3.6,
  o5BaselineWater: 1.4,
  o5RecentOil: 1.1,
  o5RecentWater: 7.2,
  o5GasPerOil: 0.4,
  // OGUTA-3W, the injector.
  o3wBaselineCycle: Object.freeze([2860, 2790, 2910]),
  o3wRecent: Object.freeze([1980, 2020, 1940, 2060, 1900, 2100, 1960]),
  // OGUTA-21, the observation well. Zero volumes, a full 24 hours every day.
  o21HoursOn: 24,
  meterBias: 1.028,
  allocFromDate: '2024-10-31',
});

export const TEACHING_WELLS = Object.freeze({
  o2: Object.freeze({ id: 'w-oguta-2', name: 'OGUTA-2', well_type: 'producer' }),
  o5: Object.freeze({ id: 'w-oguta-5', name: 'OGUTA-5', well_type: 'producer' }),
  o6: Object.freeze({ id: 'w-oguta-6', name: 'OGUTA-6', well_type: 'producer' }),
  o9: Object.freeze({ id: 'w-oguta-9', name: 'OGUTA-9', well_type: 'producer' }),
  o14: Object.freeze({ id: 'w-oguta-14', name: 'OGUTA-14', well_type: 'producer' }),
  o17: Object.freeze({ id: 'w-oguta-17', name: 'OGUTA-17', well_type: 'producer' }),
  o3w: Object.freeze({ id: 'w-oguta-3w', name: 'OGUTA-3W', well_type: 'injector' }),
  o21: Object.freeze({ id: 'w-oguta-21', name: 'OGUTA-21', well_type: 'observation' }),
});

/** What each teaching well exists to carry, one line each. */
export const teachingWellPurposes = () => [
  ['OGUTA-2', 'THE SEAM WELL. Its baseline watercut and gas-oil ratio are exactly constant day by day, so over the baseline a mean of daily ratios and a ratio of the sums are the same number. Three days inside the recent window then drop the oil by more than a factor of twelve while the gas falls by only about four.'],
  ['OGUTA-5', 'THE SMALL WELL, whose oil baseline sits under the minimum rate gate.'],
  ['OGUTA-6', 'THE UPTIME WELL. Its producing-day oil rate is held exactly constant across the recent window while the calendar volume swings by a factor of nearly three, because only the hours move.'],
  ['OGUTA-9', 'THE CLEAN DECLINER, and the only well on the field that raises no exception at any default setting.'],
  ['OGUTA-14', 'THE MONTHLY WELL, whose last row covers fourteen days rather than a month, so its period volume halves while its rate per elapsed day rises.'],
  ['OGUTA-17', 'THE WELL THAT STOPS SENDING ROWS. It does not stop producing: the facility meter keeps seeing it.'],
  ['OGUTA-3W', 'THE INJECTOR, whose injection falls in the recent window.'],
  ['OGUTA-21', 'THE OBSERVATION WELL. Zero volumes and a full twenty-four hours recorded every single day.'],
].map(([name, purpose]) => ({ name, purpose, provenance: 'teaching' }));

const teachingRow = (well, date, over) => ({
  well,
  well_id: well.id,
  prod_date: date,
  oil_stb: 0,
  water_stb: 0,
  gas_mscf: 0,
  winj_stb: 0,
  ginj_mscf: 0,
  hours_on: 24,
  ...over,
});

export const teachingDates = memoize(() => {
  const from = dayOf(TEACHING_FIELD.firstDate);
  const to = dayOf(TEACHING_FIELD.lastDate);
  const out = [];
  for (let d = from; d <= to; d += 1) out.push(isoOfDay(d));
  return out;
});

const o9OilAt = (i) => TEACHING_FIELD.o9Qi * Math.exp(-TEACHING_FIELD.o9Di * i);
const o17OilAt = (i) => TEACHING_FIELD.o17Qi * Math.exp(-TEACHING_FIELD.o17Di * i);

/** The whole teaching ledger, built once. */
export const teachingLedger = memoize(() => {
  const TF = TEACHING_FIELD;
  const W = TEACHING_WELLS;
  const dates = teachingDates();
  const n = dates.length;
  const o17LastIndex = dayOf(TF.o17LastReportDate) - dayOf(TF.firstDate);
  const ledger = [];

  dates.forEach((date, i) => {
    const back = n - 1 - i;
    const recent = back < 7;
    const r = 6 - back;

    if (recent) {
      const [o, wa, g] = TF.o2Recent[r];
      ledger.push(teachingRow(W.o2, date, { oil_stb: o, water_stb: wa, gas_mscf: g }));
    } else {
      const o = TF.o2BaselineOilCycle[i % TF.o2BaselineOilCycle.length];
      ledger.push(teachingRow(W.o2, date, {
        oil_stb: o, water_stb: o * TF.o2WaterPerOil, gas_mscf: o * TF.o2GasPerOil,
      }));
    }

    if (recent) {
      const h = TF.o6RecentHours[r];
      const o = (TF.o6PdRate * h) / HOURS_PER_DAY;
      ledger.push(teachingRow(W.o6, date, {
        hours_on: h, oil_stb: o, water_stb: o * TF.o6WaterPerOil, gas_mscf: o * TF.o6GasPerOil,
      }));
    } else {
      const o = TF.o6BaselineOilCycle[i % TF.o6BaselineOilCycle.length];
      ledger.push(teachingRow(W.o6, date, {
        oil_stb: o, water_stb: o * TF.o6WaterPerOil, gas_mscf: o * TF.o6GasPerOil,
      }));
    }

    const q9 = o9OilAt(i);
    ledger.push(teachingRow(W.o9, date, {
      oil_stb: q9, water_stb: q9 * TF.o9WaterPerOil, gas_mscf: q9 * TF.o9GasPerOil,
    }));

    if (i <= o17LastIndex) {
      const q17 = o17OilAt(i);
      ledger.push(teachingRow(W.o17, date, {
        oil_stb: q17, water_stb: q17 * TF.o17WaterPerOil, gas_mscf: q17 * TF.o17GasPerOil,
        hours_on: null,
      }));
    }

    const o5o = recent ? TF.o5RecentOil : TF.o5BaselineOil;
    const o5w = recent ? TF.o5RecentWater : TF.o5BaselineWater;
    ledger.push(teachingRow(W.o5, date, {
      oil_stb: o5o, water_stb: o5w, gas_mscf: o5o * TF.o5GasPerOil,
    }));

    const winj = recent
      ? TF.o3wRecent[r]
      : TF.o3wBaselineCycle[i % TF.o3wBaselineCycle.length];
    ledger.push(teachingRow(W.o3w, date, { winj_stb: winj }));

    ledger.push(teachingRow(W.o21, date, { hours_on: TF.o21HoursOn }));
  });

  TF.o14Rows.forEach(([date, oil]) => {
    ledger.push(teachingRow(W.o14, date, {
      oil_stb: oil, water_stb: oil * TF.o14WaterPerOil, gas_mscf: oil * TF.o14GasPerOil,
      hours_on: null,
    }));
  });

  return ledger;
});

export const teachingWellSeries = memoize(() => buildWellSeries(teachingLedger()));
export const teachingFieldSeries = memoize(() => buildFieldSeries(teachingLedger()));
export const teachingExceptionRun = memoize((settings = {}) => detectExceptions(teachingWellSeries(), settings));

const seriesNamed = (name) => teachingWellSeries().find((s) => s.well.name === name);

/** The teaching well tests. Invented by this wave, checked by no oracle. */
export const teachingTests = () => [
  { id: 'g-o2-1', well_id: TEACHING_WELLS.o2.id, well: TEACHING_WELLS.o2, test_date: '2024-06-18', oil_rate_stbd: 1074, water_rate_stbd: 333, gas_rate_mscfd: 623, duration_hours: 24, thp_psia: 305, is_valid: true },
  { id: 'g-o2-2', well_id: TEACHING_WELLS.o2.id, well: TEACHING_WELLS.o2, test_date: '2024-11-02', oil_rate_stbd: 1036, water_rate_stbd: 321, gas_rate_mscfd: 601, duration_hours: 18, thp_psia: 298, is_valid: true },
  { id: 'g-o6-1', well_id: TEACHING_WELLS.o6.id, well: TEACHING_WELLS.o6, test_date: '2024-08-25', oil_rate_stbd: 509, water_rate_stbd: 112, gas_rate_mscfd: 239, duration_hours: 12, thp_psia: 271, is_valid: true },
  { id: 'g-o9-1', well_id: TEACHING_WELLS.o9.id, well: TEACHING_WELLS.o9, test_date: '2024-10-09', oil_rate_stbd: 928, water_rate_stbd: 604, gas_rate_mscfd: 668, duration_hours: 24, thp_psia: 288, is_valid: true },
  { id: 'g-o17-1', well_id: TEACHING_WELLS.o17.id, well: TEACHING_WELLS.o17, test_date: '2024-05-09', oil_rate_stbd: 688, water_rate_stbd: 199, gas_rate_mscfd: 351, duration_hours: 20, thp_psia: 244, is_valid: true },
  { id: 'g-o17-2', well_id: TEACHING_WELLS.o17.id, well: TEACHING_WELLS.o17, test_date: '2024-11-06', oil_rate_stbd: 421, water_rate_stbd: 122, gas_rate_mscfd: 215, duration_hours: 2.5, thp_psia: 236, is_valid: false },
];

/**
 * The metered facility totals for the last twenty-one days of the ledger, at a
 * bias of 1.028 on the wells' own true production. OGUTA-17 keeps producing
 * after it stops filing rows, and only the meter ever sees it.
 */
export const teachingTotals = memoize(() => {
  const TF = TEACHING_FIELD;
  const W = TEACHING_WELLS;
  const ledger = teachingLedger();
  const d0 = dayOf(TF.firstDate);
  const allocFrom = dayOf(TF.allocFromDate);
  const o17LastIndex = dayOf(TF.o17LastReportDate) - d0;
  return teachingDates().filter((d) => dayOf(d) >= allocFrom).map((date) => {
    const i = dayOf(date) - d0;
    const rows = ledger.filter((r) => r.prod_date === date
      && r.well_id !== W.o3w.id && r.well_id !== W.o21.id);
    let oil = 0; let wat = 0; let gas = 0;
    rows.forEach((r) => { oil += r.oil_stb; wat += r.water_stb; gas += r.gas_mscf; });
    if (i > o17LastIndex) {
      const q = o17OilAt(i);
      oil += q; wat += q * TF.o17WaterPerOil; gas += q * TF.o17GasPerOil;
    }
    return {
      total_date: date,
      oil_stb: oil * TF.meterBias,
      water_stb: wat * TF.meterBias,
      gas_mscf: gas * TF.meterBias,
    };
  });
});

export const teachingAllocation = memoize((settings = {}) => computeAllocation({
  wells: Object.values(TEACHING_WELLS),
  tests: teachingTests(),
  ledger: teachingLedger(),
  totals: teachingTotals(),
  settings,
}));

/** The teaching field at a glance. Nothing here is real and nothing is published. */
export const teachingFieldHeadline = memoize(() => {
  const ledger = teachingLedger();
  const series = teachingWellSeries();
  return {
    provenance: 'teaching',
    field: TEACHING_FIELD_NAME,
    ledgerRows: ledger.length,
    firstDate: TEACHING_FIELD.firstDate,
    lastDate: TEACHING_FIELD.lastDate,
    calendarDaysSpanned: dayOf(TEACHING_FIELD.lastDate) - dayOf(TEACHING_FIELD.firstDate) + 1,
    wells: series.length,
    fieldDays: teachingFieldSeries().length,
    meterBias: TEACHING_FIELD.meterBias,
    allocatedFrom: TEACHING_FIELD.allocFromDate,
    meteredDays: teachingTotals().length,
    itIsInventedByThisWaveAndIsNotAPublishedCase: true,
  };
});

/** Every teaching well, with its totals. */
export const teachingWellRows = () => teachingWellSeries().map(({ well, points }) => ({
  provenance: 'teaching',
  name: well.name,
  wellType: well.well_type,
  points: points.length,
  firstDate: points[0].date,
  lastDate: points[points.length - 1].date,
  cadenceDays: finiteOrNull(seriesCadenceDays(points)),
  totalOil: sumOf(points.map((p) => p.oil)),
  totalWater: sumOf(points.map((p) => p.water)),
  totalGas: sumOf(points.map((p) => p.gas)),
  totalInjection: sumOf(points.map((p) => p.winj)),
  rowsCarryingAnHoursOn: points.filter((p) => p.hoursOn != null).length,
}));

// ---------------------------------------------------------------------------
// ASSOCIATE. THE ROW, THE RATIOS, THE FIELD AND THE KPIs.
// ---------------------------------------------------------------------------

/** The five published ledger rows and the five derived points they must give. */
export const publishedRowRows = () => surveillanceGolden.derivePoint.rows.map((row, i) => {
  const published = surveillanceGolden.derivePoint.points[i];
  const engine = derivePoint(row);
  return {
    provenance: 'golden',
    index: i + 1,
    date: row.prod_date,
    oilStb: row.oil_stb,
    waterStb: row.water_stb,
    gasMscf: row.gas_mscf,
    hoursOnIn: row.hours_on,
    hoursOnOut: engine.hoursOn,
    liquid: engine.liquid,
    watercut: engine.watercut,
    gor: engine.gor,
    oilPd: engine.oilPd,
    waterPd: engine.waterPd,
    gasPd: engine.gasPd,
    liquidPd: engine.liquidPd,
    publishedLiquid: published.liquid,
    publishedWatercut: published.watercut,
    publishedGor: published.gor,
    publishedOilPd: published.oilPd,
    engineReproducesThePublishedPoint:
      engine.liquid === published.liquid
      && engine.watercut === published.watercut
      && engine.gor === published.gor
      && engine.oilPd === published.oilPd
      && engine.liquidPd === published.liquidPd,
    theRowSaysNothingAboutHowLongItCovers: true,
  };
});

/** The fourteen keys, and which of the five are computed and can refuse. */
export const pointMemberRows = () => [
  ['date', 'copied', 'The row date, unchanged.', false],
  ['oil', 'copied', 'The oil VOLUME over the row, in stb. Coerced with a falsy test, so a text column comes through as text.', false],
  ['water', 'copied', 'The water VOLUME over the row, in stb, coerced the same way.', false],
  ['gas', 'copied', 'The gas VOLUME over the row, in Mscf.', false],
  ['winj', 'copied', 'Water injected over the row, in stb.', false],
  ['ginj', 'copied', 'Gas injected over the row, in Mscf.', false],
  ['hoursOn', 'copied', 'Hours on stream, in h, and only when it is a finite number. Anything else is uptime UNKNOWN and comes back null.', false],
  ['liquid', 'computed', 'oil plus water, in stb over the row. A VOLUME and not a rate. This is the one member formed by ADDITION, which is why a text column breaks it.', false],
  ['watercut', 'computed', 'water over liquid, a FRACTION. Null when the row made no liquid.', true],
  ['gor', 'computed', 'gas times a thousand over oil, in scf/stb. Null when the row made no OIL, however much gas it made.', true],
  ['oilPd', 'computed', 'The oil volume scaled to twenty-four hours, in stb/d. Null when the hours are zero.', true],
  ['waterPd', 'computed', 'The water volume scaled to twenty-four hours, in stb/d.', true],
  ['gasPd', 'computed', 'The gas volume scaled to twenty-four hours, in Mscf/d.', true],
  ['liquidPd', 'computed', 'The liquid volume scaled to twenty-four hours, in stb/d.', true],
].map(([key, kind, meaning, canRefuse]) => ({
  key, kind, meaning, canRefuse, provenance: 'derived',
}));

/** One constructed row of 600 stb of oil, swept across the hours column. */
export const HOURS_SWEEP = Object.freeze([24, 23.5, 20, 18, 16, 12, 8, 6, 4, 2, 1, 0.5]);

const HOURS_ROW = Object.freeze({
  prod_date: '2024-01-01', oil_stb: 600, water_stb: 150, gas_mscf: 300,
});

export const hoursSweepRows = (hours = HOURS_SWEEP) => hours.map((h) => {
  const p = derivePoint({ ...HOURS_ROW, hours_on: h });
  return {
    provenance: 'derived',
    hoursOn: h,
    calendarOilStb: p.oil,
    oilPd: finiteOrNull(p.oilPd),
    gasPd: finiteOrNull(p.gasPd),
    upliftOverTheCalendarVolume: Number.isFinite(p.oilPd) ? p.oilPd / p.oil : null,
    theyAreTheSameNumberOnlyAtAFullDay: p.oilPd === p.oil,
  };
});

/** The spellings that are not a number of hours, all read as uptime unknown. */
export const hoursSpellingRows = () => [
  ['null', null],
  ['the undefined spelling', undefined],
  ['not a number', NaN],
  ['the string "12"', '12'],
  ['the empty string', ''],
].map(([label, value]) => {
  const p = derivePoint({ ...HOURS_ROW, hours_on: value });
  return {
    provenance: 'derived',
    label,
    hoursOnReturned: p.hoursOn,
    uptimeIsUnknown: p.hoursOn === null,
    oilPd: finiteOrNull(p.oilPd),
    theRateFellBackToTheCalendarVolume: p.oilPd === p.oil,
  };
});

/** The values that are out of range and are not refused. */
export const HOURS_OUT_OF_RANGE = Object.freeze([26, 30, 36, 48, 168, -3, -24]);

export const hoursOutOfRangeRows = (hours = HOURS_OUT_OF_RANGE) => hours.map((h) => {
  const p = derivePoint({ ...HOURS_ROW, hours_on: h });
  return {
    provenance: 'derived',
    hoursOn: p.hoursOn,
    oilPd: finiteOrNull(p.oilPd),
    refused: p.oilPd === null,
    ratioToTheCalendarVolume: Number.isFinite(p.oilPd) ? p.oilPd / p.oil : null,
    theRateIsBelowTheCalendarVolume: Number.isFinite(p.oilPd) && p.oilPd < p.oil,
    theNegativeHoursAreReturnedAsThemselves: h < 0 && p.hoursOn === h,
  };
});

/**
 * THE UPTIME WELL, RECENT WINDOW. Seven different calendar volumes, seven
 * different hours, one rate. This is the row set the whole Associate tier
 * turns on, and the two columns move in OPPOSITE directions.
 */
export const uptimeWellRows = memoize(() => {
  const pts = seriesNamed('OGUTA-6').points.slice(-7);
  return pts.map((p) => ({
    provenance: 'teaching',
    date: p.date,
    hoursOn: p.hoursOn,
    calendarOilStb: p.oil,
    producingDayOilStbd: finiteOrNull(p.oilPd),
    watercutFraction: finiteOrNull(p.watercut),
    gorScfStb: finiteOrNull(p.gor),
  }));
});

export const uptimeWellHeadline = memoize(() => {
  const series = seriesNamed('OGUTA-6');
  const asOfDay = dayOf(TEACHING_AS_OF);
  const win = widenedWindows(seriesCadenceDays(series.points));
  const recentCal = windowRead(series.points, 'oil', asOfDay - win.recentDays, asOfDay);
  const recentPd = windowRead(series.points, 'oilPd', asOfDay - win.recentDays, asOfDay);
  const recentHrs = windowRead(series.points, 'hoursOn', asOfDay - win.recentDays, asOfDay);
  const from = asOfDay - win.recentDays - win.baselineDays;
  const baseCal = windowRead(series.points, 'oil', from, asOfDay - win.recentDays);
  const basePd = windowRead(series.points, 'oilPd', from, asOfDay - win.recentDays);
  const baseHrs = windowRead(series.points, 'hoursOn', from, asOfDay - win.recentDays);
  const rows = uptimeWellRows();
  const cals = rows.map((r) => r.calendarOilStb);
  const pds = rows.map((r) => r.producingDayOilStbd);
  return {
    provenance: 'teaching',
    name: 'OGUTA-6',
    asOf: TEACHING_AS_OF,
    recentDays: win.recentDays,
    baselineDays: win.baselineDays,
    recentRows: recentCal.count,
    baselineRows: baseCal.count,
    recentCalendarMean: recentCal.mean,
    recentProducingDayMean: recentPd.mean,
    recentHoursMean: recentHrs.mean,
    baselineCalendarMean: baseCal.mean,
    baselineProducingDayMean: basePd.mean,
    baselineHoursMean: baseHrs.mean,
    dropPctOnCalendar: dropPct(recentCal.mean, baseCal.mean),
    dropPctOnProducingDay: dropPct(recentPd.mean, basePd.mean),
    rateDropTrigger: DEFAULT_SURVEILLANCE_SETTINGS.rateDropPct,
    rateDropDoublingToHigh: DEFAULT_SURVEILLANCE_SETTINGS.rateDropPct * 2,
    downtimeThresholdHours: DEFAULT_SURVEILLANCE_SETTINGS.downtimeHours,
    theDowntimeExceptionFires: recentHrs.mean < DEFAULT_SURVEILLANCE_SETTINGS.downtimeHours,
    lowestCalendarVolume: Math.min(...cals),
    highestCalendarVolume: Math.max(...cals),
    calendarSwingFactor: Math.max(...cals) / Math.min(...cals),
    producingDayValuesAgreeToNineDecimals:
      new Set(pds.map((v) => v.toFixed(9))).size === 1,
    distinctProducingDayValues: new Set(pds.map((v) => v.toFixed(9))).size,
    theTwoColumnsMoveInOppositeDirections:
      dropPct(recentCal.mean, baseCal.mean) > 0 && dropPct(recentPd.mean, basePd.mean) < 0,
  };
});

/** The ratios a row carries, and where the two refuse on different conditions. */
export const RATIO_ROWS = Object.freeze([
  Object.freeze([900, 100, 450]),
  Object.freeze([500, 500, 250]),
  Object.freeze([100, 900, 300]),
  Object.freeze([0, 400, 200]),
  Object.freeze([400, 0, 200]),
  Object.freeze([0, 0, 500]),
  Object.freeze([0, 0, 0]),
  Object.freeze([-500, 200, 400]),
  Object.freeze([800, -900, 400]),
]);

export const ratioRefusalRows = (rows = RATIO_ROWS) => rows.map(([oil, water, gas]) => {
  const p = derivePoint({
    prod_date: '2024-01-01', oil_stb: oil, water_stb: water, gas_mscf: gas, hours_on: 24,
  });
  return {
    provenance: 'derived',
    oilStb: oil,
    waterStb: water,
    gasMscf: gas,
    liquidStb: p.liquid,
    watercutFraction: p.watercut,
    watercutRefused: p.watercut === null,
    gorScfStb: p.gor,
    gorRefused: p.gor === null,
    isACorrectionRow: oil < 0 || water < 0,
    whyItRefused: [
      p.watercut === null ? 'no watercut, because the liquid is not above zero' : null,
      p.gor === null ? 'no gas-oil ratio, because the oil is not above zero' : null,
    ].filter(Boolean).join(' and ') || 'neither ratio refused',
  };
});

/** The published field series, formed VOLUMETRICALLY, which is what a period ratio means. */
export const publishedFieldDayRows = () => {
  const engine = buildFieldSeries(surveillanceGolden.ledger);
  const wanted = [0, 1, 2, 24, 25, 48, 49, 50];
  return wanted.map((i) => {
    const day = surveillanceGolden.fieldSeries[i];
    const run = engine[i];
    return {
      provenance: 'golden',
      index: i + 1,
      date: day.date,
      oil: day.oil,
      water: day.water,
      gas: day.gas,
      winj: day.winj,
      wellsOn: day.wellsOn,
      liquid: run.liquid,
      watercutFraction: finiteOrNull(run.watercut),
      gorScfStb: finiteOrNull(run.gor),
      engineMatchesThePublishedDay: Math.abs(run.oil - day.oil) < 1e-9,
    };
  });
};

export const publishedFieldSeriesHeadline = memoize(() => {
  const engine = buildFieldSeries(surveillanceGolden.ledger);
  return {
    provenance: 'golden',
    publishedDays: surveillanceGolden.fieldSeries.length,
    engineDays: engine.length,
    everyPublishedDayReproduced: engine.every(
      (d, i) => Math.abs(d.oil - surveillanceGolden.fieldSeries[i].oil) < 1e-9,
    ),
    theOnCountAddsBarrelsToThousandCubicFeet: true,
    theOnCountTest: '(oil_stb + water_stb + gas_mscf) > 0 and (hours_on is null or above zero)',
  };
});

/** What counts as a well on stream, and the two units the boolean adds together. */
export const onCountRows = () => [
  ['a well making only gas', { gas_mscf: 700 }],
  ['a well making only water', { water_stb: 400 }],
  ['an injector taking 3000 stb', { winj_stb: 3000 }],
  ['a producer with volumes and zero hours', { oil_stb: 900, water_stb: 100, hours_on: 0 }],
  ['a well that filed a row of zeroes', {}],
].map(([label, over]) => {
  const day = buildFieldSeries([{
    prod_date: '2024-01-01', oil_stb: 0, water_stb: 0, gas_mscf: 0, winj_stb: 0, hours_on: 24, ...over,
  }])[0];
  return {
    provenance: 'derived',
    label,
    wellsOn: day.wellsOn,
    countsAsProducing: day.wellsOn === 1,
    fieldOil: day.oil,
    fieldWinj: day.winj,
  };
});

/** The rows nobody attached a well to, and the two functions that disagree about them. */
export const orphanRowHeadline = memoize(() => {
  const rows = [
    { prod_date: '2024-01-01', oil_stb: 900 },
    { well: TEACHING_WELLS.o2, well_id: TEACHING_WELLS.o2.id, prod_date: '2024-01-01', oil_stb: 900 },
  ];
  const wells = buildWellSeries(rows);
  const field = buildFieldSeries(rows);
  return {
    provenance: 'derived',
    rowsHandedIn: rows.length,
    wellSeriesReturned: wells.length,
    pointsOnThem: sumOf(wells.map((s) => s.points.length)),
    fieldDays: field.length,
    fieldOil: field[0].oil,
    oilOnTheWellSeries: sumOf(wells.flatMap((s) => s.points.map((p) => p.oil))),
    theDifference: field[0].oil - sumOf(wells.flatMap((s) => s.points.map((p) => p.oil))),
    nothingInEitherReturnSaysSo: true,
  };
});

/**
 * THE FOUR ROW SWEEP. `d.oil += r.oil_stb || 0` starts at a numeric zero and
 * the first STRING turns the accumulator itself into a string, so every later
 * row is CONCATENATED onto it rather than added.
 */
export const STRING_ACCUMULATOR_COUNTS = Object.freeze([1, 2, 3, 4]);

export const stringAccumulatorRows = (counts = STRING_ACCUMULATOR_COUNTS) => counts.map((k) => {
  const mk = (oil) => Array.from({ length: k }, () => ({
    prod_date: '2024-01-01', oil_stb: oil, water_stb: 0, gas_mscf: 0, hours_on: 24,
  }));
  const asNumbers = buildFieldSeries(mk(800))[0];
  const asStrings = buildFieldSeries(mk('800'))[0];
  const numeric = Number(asNumbers.oil);
  const concatenated = Number(asStrings.oil);
  return {
    provenance: 'derived',
    rows: k,
    fieldOilAsNumbers: numeric,
    fieldOilAsStrings: concatenated,
    overstatementFactor: numeric === 0 ? null : concatenated / numeric,
    theAccumulatorConcatenated: concatenated !== numeric,
    nothingReportsThatAColumnArrivedAsText: true,
  };
});

/** One row of text, and the two members that pass through liquid. */
export const stringRowHeadline = memoize(() => {
  const asNumbers = derivePoint({
    prod_date: '2024-01-01', oil_stb: 800, water_stb: 200, gas_mscf: 400, hours_on: 24,
  });
  const asStrings = derivePoint({
    prod_date: '2024-01-01', oil_stb: '800', water_stb: '200', gas_mscf: '400', hours_on: 24,
  });
  return {
    provenance: 'derived',
    numbersLiquid: Number(asNumbers.liquid),
    stringsLiquid: Number(asStrings.liquid),
    numbersWatercut: asNumbers.watercut,
    stringsWatercut: asStrings.watercut,
    numbersGor: asNumbers.gor,
    stringsGor: asStrings.gor,
    numbersOilPd: Number(asNumbers.oilPd),
    stringsOilPd: Number(asStrings.oilPd),
    numbersLiquidPd: Number(asNumbers.liquidPd),
    stringsLiquidPd: Number(asStrings.liquidPd),
    theGorIsExactlyRight: asStrings.gor === asNumbers.gor,
    theOilProducingDayRateIsExactlyRight: Number(asStrings.oilPd) === Number(asNumbers.oilPd),
    theWatercutIsUnderstatedByAFactorOf: asStrings.watercut === 0
      ? null : asNumbers.watercut / asStrings.watercut,
    theLiquidRateIsOverstatedByAFactorOf:
      Number(asStrings.liquidPd) / Number(asNumbers.liquidPd),
    onlyTheMembersFormedByAdditionAreWrong: true,
  };
});

/** The published field KPIs at both published windows. */
export const publishedKpiRows = () => {
  const wells = buildWellSeries(
    surveillanceGolden.ledger.map((r) => ({ ...r, well: surveillanceGolden.wells[r.well_id] })),
  );
  const field = buildFieldSeries(surveillanceGolden.ledger);
  return [surveillanceGolden.kpis, surveillanceGolden.kpis30].map((published) => {
    const engine = computeKpis(wells, field, { windowDays: published.windowDays });
    return {
      provenance: 'golden',
      windowDays: published.windowDays,
      asOf: engine.asOf,
      oil: engine.oil,
      water: engine.water,
      gas: engine.gas,
      winj: engine.winj,
      liquid: engine.liquid,
      watercutFraction: engine.watercut,
      gorScfStb: engine.gor,
      uptimePct: engine.uptimePct,
      wellCount: engine.wellCount,
      producerCount: engine.producerCount,
      engineReproducesThePublishedKpi:
        engine.oil === published.oil
        && engine.watercut === published.watercut
        && engine.gor === published.gor
        && engine.uptimePct === published.uptimePct,
    };
  });
};

/** The window the object reports against the days it actually averaged. */
export const KPI_WINDOW_SWEEP = Object.freeze([1, 7, 14, 30, 60, 90, 180, 365]);

export const kpiWindowSweepRows = (windows = KPI_WINDOW_SWEEP) => {
  const wells = buildWellSeries(
    surveillanceGolden.ledger.map((r) => ({ ...r, well: surveillanceGolden.wells[r.well_id] })),
  );
  const field = buildFieldSeries(surveillanceGolden.ledger);
  return windows.map((windowDays) => {
    const k = computeKpis(wells, field, { windowDays });
    const fromDay = dayOf(k.asOf) - windowDays + 1;
    const daysInWindow = field.filter((d) => dayOf(d.date) >= fromDay).length;
    return {
      provenance: 'derived',
      windowDaysAsked: windowDays,
      fieldDaysActuallyAveraged: daysInWindow,
      itAveragedFewerDaysThanItReports: daysInWindow < windowDays,
      oil: k.oil,
      watercutFraction: k.watercut,
      gorScfStb: k.gor,
      uptimePct: finiteOrNull(k.uptimePct),
    };
  });
};

/** Who is in the count, and who is in the uptime. */
export const kpiMembershipHeadline = memoize(() => {
  const wells = buildWellSeries(
    surveillanceGolden.ledger.map((r) => ({ ...r, well: surveillanceGolden.wells[r.well_id] })),
  );
  const field = buildFieldSeries(surveillanceGolden.ledger);
  const k = computeKpis(wells, field, { windowDays: 7 });
  const byType = (t) => wells.filter((w) => w.well.well_type === t).length;
  return {
    provenance: 'derived',
    wellCount: k.wellCount,
    producerCount: k.producerCount,
    seriesHandedIn: wells.length,
    typedInjector: byType('injector'),
    typedObservation: byType('observation'),
    typedProducer: byType('producer'),
    wellCountIsEverySeriesHandedIn: k.wellCount === wells.length,
    anObservationWellIsCountedAsAProducer: byType('observation') > 0
      && k.producerCount === wells.length - byType('injector'),
    theUptimeSkipsInjectorsAndReadsEverythingElse: true,
  };
});

/** The guard that is on one line and not on the next. */
export const kpiNullGuardRows = () => [
  ['a field day with a null oil and 5 stb of water', [{ date: '2024-01-01', oil: null, water: 5, gas: 10, winj: 0 }]],
  ['a field day of all zeroes', [{ date: '2024-01-01', oil: 0, water: 0, gas: 0, winj: 0 }]],
].map(([label, series]) => {
  const k = computeKpis([], series, { windowDays: 7 });
  return {
    provenance: 'derived',
    label,
    liquid: k.liquid,
    liquidRefused: k.liquid === null,
    watercutFraction: k.watercut,
    watercutRefused: k.watercut === null,
    gorScfStb: k.gor,
    uptimePct: k.uptimePct,
    theGuardIsOnLiquidAndNotOnTheNextLine: k.liquid === null && k.watercut !== null,
  };
});

export const kpiEmptyRefusal = () => ({
  provenance: 'derived',
  label: 'an empty field series',
  returnedNull: computeKpis([], [], { windowDays: 7 }) === null,
  contract: 'computeKpis returns null outright rather than an object of nulls, which is the one refusal in this function.',
});

/** The teaching field KPIs at four windows, on a field known well by well. */
export const TEACHING_KPI_WINDOWS = Object.freeze([7, 14, 30, 70]);

export const teachingKpiRows = (windows = TEACHING_KPI_WINDOWS) => windows.map((windowDays) => {
  const k = computeKpis(teachingWellSeries(), teachingFieldSeries(), { windowDays });
  return {
    provenance: 'teaching',
    windowDays,
    asOf: k.asOf,
    oil: k.oil,
    water: k.water,
    gas: k.gas,
    winj: k.winj,
    liquid: k.liquid,
    watercutFraction: k.watercut,
    gorScfStb: k.gor,
    uptimePct: k.uptimePct,
    wellCount: k.wellCount,
    producerCount: k.producerCount,
  };
});

/** The observation well in the uptime, and the wells that record no hours at all. */
export const uptimeMembershipRows = (windows = Object.freeze([7, 30])) => windows.map((windowDays) => {
  const all = teachingWellSeries();
  const noObs = all.filter((s) => s.well.well_type !== 'observation');
  const withIt = computeKpis(all, teachingFieldSeries(), { windowDays });
  const without = computeKpis(noObs, teachingFieldSeries(), { windowDays });
  return {
    provenance: 'teaching',
    windowDays,
    uptimePctWithTheObservationWell: withIt.uptimePct,
    uptimePctWithItDropped: without.uptimePct,
    differenceInPoints: withIt.uptimePct - without.uptimePct,
    wellCountWithIt: withIt.wellCount,
    wellCountWithout: without.wellCount,
  };
});

export const uptimeMembershipHeadline = memoize(() => {
  const read = teachingWellSeries().filter((s) => s.well.well_type !== 'injector');
  return {
    provenance: 'teaching',
    seriesReadForUptime: read.length,
    ofWhichAtLeastOneRowCarriesAnHoursOn:
      read.filter((s) => s.points.some((p) => p.hoursOn != null)).length,
    aWellThatRecordsNoHoursIsNotInItEitherWay: true,
    theUptimeIsTheMeanOfTheWellsThatFilledTheColumnIn: true,
  };
});

// ---------------------------------------------------------------------------
// PROFESSIONAL. THE TWO WINDOWS, WHAT FIRES, THE TEST THAT CARRIES A WELL AND
// THE METER SHARED OVER MANY WELLS.
// ---------------------------------------------------------------------------

/** Where the two windows start, on the published field and on the teaching one. */
export const windowArithmeticRows = () => {
  const golden = surveillanceGolden.exceptions;
  const gAsOfDay = dayOf(golden.asOf);
  const teaching = teachingExceptionRun();
  const tAsOfDay = dayOf(teaching.asOf);
  const s = DEFAULT_SURVEILLANCE_SETTINGS;
  return [
    {
      provenance: 'golden',
      label: 'the published field, at the default settings',
      asOf: golden.asOf,
      asOfDayNumber: gAsOfDay,
      recentFrom: isoOfDay(gAsOfDay - s.recentDays + 1),
      recentTo: golden.asOf,
      recentDays: s.recentDays,
      baselineFrom: isoOfDay(gAsOfDay - s.recentDays - s.baselineDays + 1),
      baselineTo: isoOfDay(gAsOfDay - s.recentDays),
      baselineDays: s.baselineDays,
      exceptionsRaised: golden.exceptions.length,
      engineRaises: detectExceptions(buildWellSeries(
        surveillanceGolden.ledger.map((r) => ({ ...r, well: surveillanceGolden.wells[r.well_id] })),
      )).exceptions.length,
    },
    {
      provenance: 'teaching',
      label: 'the teaching field, at the same settings',
      asOf: teaching.asOf,
      asOfDayNumber: tAsOfDay,
      recentFrom: isoOfDay(tAsOfDay - s.recentDays + 1),
      recentTo: teaching.asOf,
      recentDays: s.recentDays,
      baselineFrom: isoOfDay(tAsOfDay - s.recentDays - s.baselineDays + 1),
      baselineTo: isoOfDay(tAsOfDay - s.recentDays),
      baselineDays: s.baselineDays,
      exceptionsRaised: teaching.exceptions.length,
      engineRaises: teaching.exceptions.length,
    },
  ].map((r) => ({
    ...r,
    theWindowsAreHalfOpenAndDoNotOverlap: true,
    theyAnchorOnTheFieldLatestLedgerDateAndNeverOnTheWallClock: true,
  }));
};

/** The published seam window, quoted as the golden publishes it. */
export const publishedSeamWindow = () => ({
  provenance: 'golden',
  well: surveillanceGolden.ratioSeam.well,
  recentFrom: surveillanceGolden.ratioSeam.window.recentFrom,
  recentTo: surveillanceGolden.ratioSeam.window.recentTo,
  baselineFrom: surveillanceGolden.ratioSeam.window.baselineFrom,
  baselineTo: surveillanceGolden.ratioSeam.window.baselineTo,
});

/** The windows widen for a coarse ledger, and the volumes do not. */
export const CADENCE_SWEEP = Object.freeze([1, 2, 7, 14, 28, 30, 30.5, 31, 60, 90]);

export const wideningRows = (cadences = CADENCE_SWEEP) => cadences.map((cadenceDays) => ({
  provenance: 'derived',
  ...widenedWindows(cadenceDays),
  theVolumesAreNeverRescaled: true,
}));

/** The cadence itself, published then derived, including the half-day median. */
export const publishedCadenceRows = () => {
  const wells = buildWellSeries(
    surveillanceGolden.ledger.map((r) => ({ ...r, well: surveillanceGolden.wells[r.well_id] })),
  );
  return wells.map((s) => ({
    provenance: 'golden',
    name: s.well.name,
    points: s.points.length,
    cadenceDays: finiteOrNull(seriesCadenceDays(s.points)),
  }));
};

export const CADENCE_GAP_CASES = Object.freeze([
  Object.freeze([1, 1, 1, 1]),
  Object.freeze([1, 1, 30, 30]),
  Object.freeze([30, 31, 30, 31, 30]),
  Object.freeze([30, 31, 31, 30, 31, 20]),
  Object.freeze([7, 7, 7]),
  Object.freeze([1]),
  Object.freeze([]),
]);

export const cadenceGapRows = (cases = CADENCE_GAP_CASES) => cases.map((gaps) => {
  let day = dayOf('2024-01-01');
  const points = [{ date: isoOfDay(day) }];
  gaps.forEach((g) => { day += g; points.push({ date: isoOfDay(day) }); });
  const cad = seriesCadenceDays(points);
  return {
    provenance: 'derived',
    gaps: gaps.join(', ') || 'one point only',
    points: points.length,
    cadenceDays: finiteOrNull(cad),
    refused: cad === null,
    aMedianOverAnEvenCountAveragesTheTwoMiddleGaps:
      Number.isFinite(cad) && !Number.isInteger(cad),
  };
});

/** The teaching monthly well, period volume against rate per elapsed day. */
export const monthlyPeriodRows = memoize(() => {
  const series = seriesNamed('OGUTA-14');
  return series.points.map((p, i) => {
    const prev = i > 0 ? series.points[i - 1] : null;
    const elapsed = prev ? dayOf(p.date) - dayOf(prev.date) : null;
    return {
      provenance: 'teaching',
      date: p.date,
      periodOilStb: p.oil,
      daysSinceThePreviousRow: elapsed,
      oilPerElapsedDayStbd: elapsed ? p.oil / elapsed : null,
      theModuleOnlyEverReadsThePeriodColumn: true,
    };
  });
});

export const monthlyPeriodHeadline = memoize(() => {
  const series = seriesNamed('OGUTA-14');
  const rows = monthlyPeriodRows();
  const last = rows[rows.length - 1];
  const prev = rows[rows.length - 2];
  const win = widenedWindows(seriesCadenceDays(series.points));
  const ex = teachingExceptionRun().exceptions.find((e) => e.wellName === 'OGUTA-14');
  return {
    provenance: 'teaching',
    name: 'OGUTA-14',
    cadenceDays: win.cadenceDays,
    recentDays: win.recentDays,
    baselineDays: win.baselineDays,
    staleDays: win.staleDays,
    lastPeriodVolume: last.periodOilStb,
    previousPeriodVolume: prev.periodOilStb,
    lastPeriodElapsedDays: last.daysSinceThePreviousRow,
    previousPeriodElapsedDays: prev.daysSinceThePreviousRow,
    lastRatePerElapsedDay: last.oilPerElapsedDayStbd,
    previousRatePerElapsedDay: prev.oilPerElapsedDayStbd,
    thePeriodVolumeFell: last.periodOilStb < prev.periodOilStb,
    theRatePerElapsedDayRose: last.oilPerElapsedDayStbd > prev.oilPerElapsedDayStbd,
    exceptionType: ex ? ex.type : null,
    exceptionSeverity: ex ? ex.severity : null,
    exceptionValue: ex ? ex.value : null,
    exceptionBaseline: ex ? ex.baseline : null,
    exceptionMessage: ex ? ex.message : null,
    reportedAtTheTopOfTheLadderForProducingMoreOilPerDay: true,
  };
});

/** The published monthly well, whose rows are months read as days. */
export const publishedMonthlyRows = memoize(() => {
  const wells = buildWellSeries(
    surveillanceGolden.ledger.map((r) => ({ ...r, well: surveillanceGolden.wells[r.well_id] })),
  );
  const p3 = wells.find((s) => s.well.name === 'P-3');
  const ex = detectExceptions(wells).exceptions.find((e) => e.wellName === 'P-3');
  return {
    provenance: 'golden',
    name: 'P-3',
    rows: p3.points.map((p) => ({
      date: p.date,
      periodOilStb: p.oil,
      oilPd: finiteOrNull(p.oilPd),
      hoursOn: p.hoursOn,
    })),
    exceptionType: ex ? ex.type : null,
    exceptionSeverity: ex ? ex.severity : null,
    exceptionMessage: ex ? ex.message : null,
    theMessageHardCodesTheUnit: true,
  };
});

/**
 * THE TWO READINGS OF THE TEACHING FIELD, well by well. Each row carries the
 * CALENDAR column the engine reads and the PRODUCING-DAY column it never
 * reads, because a window mean with only one of them beside it is not a
 * finding a reader can check.
 */
export const TEACHING_WINDOW_KEYS = Object.freeze([
  Object.freeze(['OGUTA-2', 'oil']),
  Object.freeze(['OGUTA-2', 'watercut']),
  Object.freeze(['OGUTA-2', 'gor']),
  Object.freeze(['OGUTA-5', 'oil']),
  Object.freeze(['OGUTA-5', 'watercut']),
  Object.freeze(['OGUTA-6', 'oil']),
  Object.freeze(['OGUTA-6', 'hoursOn']),
  Object.freeze(['OGUTA-9', 'oil']),
  Object.freeze(['OGUTA-3W', 'winj']),
]);

export const windowMeanRows = (keys = TEACHING_WINDOW_KEYS) => keys.map(([name, key]) => {
  const series = seriesNamed(name);
  const asOfDay = dayOf(TEACHING_AS_OF);
  const win = widenedWindows(seriesCadenceDays(series.points));
  const recent = windowRead(series.points, key, asOfDay - win.recentDays, asOfDay);
  const base = windowRead(
    series.points, key, asOfDay - win.recentDays - win.baselineDays, asOfDay - win.recentDays,
  );
  const isWatercut = key === 'watercut';
  return {
    provenance: 'teaching',
    name,
    key,
    recentMean: recent.mean,
    recentRows: recent.count,
    baselineMean: base.mean,
    baselineRows: base.count,
    riseInPoints: isWatercut ? (recent.mean - base.mean) * 100 : null,
    changePct: isWatercut ? null : pctChange(recent.mean, base.mean),
    measuredOn: key === 'oil' ? 'the CALENDAR volume, which is the column detectExceptions reads'
      : key === 'winj' ? 'the injection volume, the rate key for an injector'
        : key === 'hoursOn' ? 'the hours column, which only the downtime check reads'
          : 'a ratio formed on the row and then averaged, a MEAN OF DAILY RATIOS',
  };
});

/** OGUTA-6 read two ways, which is the largest finding on the surveillance side. */
export const twoReadingsHeadline = uptimeWellHeadline;

/** The seven exceptions on the published field, with the threshold each crossed. */
export const publishedExceptionRows = memoize(() => {
  const wells = buildWellSeries(
    surveillanceGolden.ledger.map((r) => ({ ...r, well: surveillanceGolden.wells[r.well_id] })),
  );
  const engine = detectExceptions(wells).exceptions;
  const ladder = severityLadderRows();
  return surveillanceGolden.exceptions.exceptions.map((e, i) => {
    const rung = ladder.find((r) => r.type === e.type);
    return {
      provenance: 'golden',
      index: i + 1,
      wellName: e.wellName,
      type: e.type,
      label: EXCEPTION_TYPES[e.type].label,
      severity: e.severity,
      value: e.value,
      baseline: e.baseline,
      message: engine[i] ? engine[i].message : null,
      settingKey: rung.settingKey,
      settingValue: rung.settingValue,
      doublingAt: rung.doublingAt,
      canReachHigh: rung.canReachHigh,
      alwaysMedium: rung.alwaysMedium,
      cannotExceedMedium: rung.cannotExceedMedium,
      engineReproducesIt: Boolean(engine[i]) && engine[i].type === e.type
        && engine[i].severity === e.severity,
    };
  });
});

/** The exceptions on the teaching field, and the two wells that raise nothing. */
export const teachingExceptionRows = memoize(() => {
  const run = teachingExceptionRun();
  const ladder = severityLadderRows();
  return run.exceptions.map((e, i) => {
    const rung = ladder.find((r) => r.type === e.type);
    return {
      provenance: 'teaching',
      index: i + 1,
      wellName: e.wellName,
      type: e.type,
      label: EXCEPTION_TYPES[e.type].label,
      severity: e.severity,
      value: e.value,
      baseline: e.baseline,
      message: e.message,
      settingKey: rung.settingKey,
      settingValue: rung.settingValue,
      doublingAt: rung.doublingAt,
      alwaysMedium: rung.alwaysMedium,
      cannotExceedMedium: rung.cannotExceedMedium,
    };
  });
});

export const teachingExceptionHeadline = memoize(() => {
  const run = teachingExceptionRun();
  const raised = new Set(run.exceptions.map((e) => e.wellName));
  const surveilled = teachingWellSeries()
    .filter((s) => s.points.length && s.well.well_type !== 'observation');
  return {
    provenance: 'teaching',
    asOf: run.asOf,
    raised: run.exceptions.length,
    wellsSurveilled: surveilled.length,
    wellsHandedIn: teachingWellSeries().length,
    theObservationWellIsDroppedBeforeAnyComparisonRuns: true,
    wellsThatRaisedNothing: teachingWellSeries()
      .map((s) => s.well.name).filter((n) => !raised.has(n)),
    highCount: run.exceptions.filter((e) => e.severity === 'high').length,
    mediumCount: run.exceptions.filter((e) => e.severity === 'medium').length,
    infoCount: run.exceptions.filter((e) => e.severity === 'info').length,
    theRateKeyIsTheCalendarVolume: true,
    theProducingDayRateIsReadByExactlyOneFunctionInTheFile: 'the decline overlay',
  };
});

/** Any unrecognised well type is read as a producer. */
export const WELL_TYPE_SWEEP = Object.freeze([
  'producer', 'injector', 'observation', 'water_injector', 'gas_injector', '', 'unset',
]);

export const wellTypeRows = (types = WELL_TYPE_SWEEP) => types.map((wellType) => {
  const well = {
    id: `w-type-${wellType || 'blank'}`,
    name: `TYPE-${wellType || 'blank'}`,
    well_type: wellType === 'unset' ? undefined : wellType,
  };
  const rows = teachingDates().map((date, i) => {
    const back = teachingDates().length - 1 - i;
    const oil = back < 7 ? 120 : 900;
    return {
      well, well_id: well.id, prod_date: date, hours_on: 24,
      oil_stb: oil, water_stb: oil * 0.3, gas_mscf: oil * 0.5, winj_stb: oil, ginj_mscf: 0,
    };
  });
  const run = detectExceptions(buildWellSeries(rows));
  return {
    provenance: 'derived',
    wellType: wellType === 'unset' ? 'the key is absent' : (wellType || 'the empty string'),
    surveilled: run.exceptions.length > 0 || wellType !== 'observation',
    exceptionsRaised: run.exceptions.length,
    types: run.exceptions.map((e) => e.type).join(', ') || 'none',
    readAsAProducer: run.exceptions.some((e) => e.type === 'rate_drop'),
    readAsAnInjector: run.exceptions.some((e) => e.type === 'injection_drop'),
    filteredOutEntirely: wellType === 'observation',
  };
});

/** Which dial raises which flag, one setting at a time on the published field. */
export const SETTINGS_SWEEPS = Object.freeze({
  rateDropPct: Object.freeze([5, 10, 15, 20, 25, 30, 40, 50, 70, 90]),
  watercutRisePts: Object.freeze([2, 5, 10, 15, 20, 25, 40]),
  gorRisePct: Object.freeze([10, 20, 30, 50, 70, 100, 200]),
  downtimeHours: Object.freeze([0, 1, 4, 8, 12, 16, 20, 24]),
  staleDays: Object.freeze([1, 3, 7, 10, 20, 21, 40, 60]),
  minOilRate: Object.freeze([0, 1, 5, 50, 200, 400, 1000, 20000]),
});

export const settingsSweepRows = (key = 'rateDropPct') => {
  const wells = buildWellSeries(
    surveillanceGolden.ledger.map((r) => ({ ...r, well: surveillanceGolden.wells[r.well_id] })),
  );
  return (SETTINGS_SWEEPS[key] || []).map((value) => {
    const run = detectExceptions(wells, { [key]: value });
    const bySeverity = { high: 0, medium: 0, info: 0 };
    run.exceptions.forEach((e) => { bySeverity[e.severity] += 1; });
    return {
      provenance: 'derived',
      settingKey: key,
      settingValue: value,
      isTheDefault: DEFAULT_SURVEILLANCE_SETTINGS[key] === value,
      exceptions: run.exceptions.length,
      high: bySeverity.high,
      medium: bySeverity.medium,
      info: bySeverity.info,
      types: [...new Set(run.exceptions.map((e) => e.type))].sort().join(', '),
      noRowInTheReturnNamesTheSettingThatPutItThere: true,
    };
  });
};

/** The test in force, published: one function decides which wells are in the split at all. */
export const publishedTestInForceRows = (limit = 12) => allocationGolden.testInForce
  .slice(0, limit).map((probe, i) => ({
    provenance: 'golden',
    index: i + 1,
    wellId: probe.wellId,
    date: probe.date,
    maxTestAgeDays: probe.maxTestAgeDays,
    testInForce: probe.testId,
    theWellTakesNoShare: probe.testId === null,
  }));

/**
 * THE AGE DIAL, SWEPT. `Number.isFinite(maxTestAgeDays) && maxTestAgeDays > 0`,
 * so any setting that is not a finite positive number turns the age check OFF
 * entirely and the oldest test on file carries the well for ever.
 */
export const AGE_GUARD_SWEEP = Object.freeze([
  Object.freeze(['180 days, the default value', 180]),
  Object.freeze(['365 days', 365]),
  Object.freeze(['1 day', 1]),
  Object.freeze(['0 days, which reads as the strictest setting on the dial', 0]),
  Object.freeze(['-1 days', -1]),
  Object.freeze(['not a number', NaN]),
  Object.freeze(['null', null]),
  Object.freeze(['Infinity', Infinity]),
]);

export const ageGuardRows = (sweep = AGE_GUARD_SWEEP) => {
  const probeDate = TEACHING_AS_OF;
  const testDate = '2019-03-04';
  const tests = [{
    id: 'demo-old', well_id: 'w-demo', test_date: testDate, oil_rate_stbd: 500,
  }];
  const ageDays = dayOf(probeDate) - dayOf(testDate);
  const rows = sweep.map(([label, value]) => {
    const t = testInForce(tests, probeDate, value);
    return {
      provenance: 'derived',
      label,
      maxTestAgeDaysAsSet: Number.isFinite(value) ? value : null,
      settingIsAFinitePositiveNumber: Number.isFinite(value) && value > 0,
      testInForce: t ? t.id : null,
      theOldTestCarriesTheWell: Boolean(t),
      theAgeCheckRan: Number.isFinite(value) && value > 0,
      testAgeDays: ageDays,
    };
  });
  rows.push({
    provenance: 'derived',
    label: 'the argument omitted entirely, so the default parameter substitutes',
    maxTestAgeDaysAsSet: DEFAULT_ALLOCATION_SETTINGS.maxTestAgeDays,
    settingIsAFinitePositiveNumber: true,
    testInForce: (testInForce(tests, probeDate) || {}).id || null,
    theOldTestCarriesTheWell: Boolean(testInForce(tests, probeDate)),
    theAgeCheckRan: true,
    testAgeDays: ageDays,
  });
  return rows;
};

export const ageGuardHeadline = memoize(() => {
  const rows = ageGuardRows();
  const off = rows.filter((r) => !r.theAgeCheckRan);
  return {
    provenance: 'derived',
    settingsSwept: rows.length,
    settingsThatTurnTheCheckOff: off.length,
    settingsThatCarryTheOldTest: rows.filter((r) => r.theOldTestCarriesTheWell).length,
    testAgeDays: rows[0].testAgeDays,
    zeroTurnsTheCheckOff: rows.find((r) => r.maxTestAgeDaysAsSet === 0).theOldTestCarriesTheWell,
    undefinedAndNullMeanOppositeThings: true,
    theStrictestLookingSettingIsTheLoosestBehaviour: true,
  };
});

/** The teaching allocation swept on the same dial, which is where it costs money. */
export const MAX_TEST_AGE_SWEEP = Object.freeze([365, 240, 180, 150, 120, 90, 60, 45, 30, 14, 7, 1, 0]);

export const maxTestAgeSweepRows = (sweep = MAX_TEST_AGE_SWEEP) => sweep.map((maxTestAgeDays) => {
  const alloc = teachingAllocation({ maxTestAgeDays });
  const counts = {};
  alloc.diagnostics.forEach((d) => { counts[d.code] = (counts[d.code] || 0) + 1; });
  return {
    provenance: 'teaching',
    maxTestAgeDays,
    theAgeCheckRan: Number.isFinite(maxTestAgeDays) && maxTestAgeDays > 0,
    wellsTakingAShare: alloc.wells.length,
    theoreticalOil: alloc.totals.theoretical.oil,
    allocatedOil: alloc.totals.allocated.oil,
    measuredOil: alloc.totals.measured.oil,
    unallocatedMeteredOil: alloc.totals.measured.oil - alloc.totals.allocated.oil,
    diagnostics: Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(', ') || 'none',
  };
});

export const maxTestAgeHeadline = memoize(() => {
  const rows = maxTestAgeSweepRows();
  const at60 = rows.find((r) => r.maxTestAgeDays === 60);
  const at0 = rows.find((r) => r.maxTestAgeDays === 0);
  const at1 = rows.find((r) => r.maxTestAgeDays === 1);
  return {
    provenance: 'teaching',
    theoreticalOilAt60Days: at60.theoreticalOil,
    theoreticalOilAt0Days: at0.theoreticalOil,
    theoreticalOilAt1Day: at1.theoreticalOil,
    wellsAt60Days: at60.wellsTakingAShare,
    wellsAt0Days: at0.wellsTakingAShare,
    wellsAt1Day: at1.wellsTakingAShare,
    zeroGivesMoreThanSixtyDoes: at0.theoreticalOil > at60.theoreticalOil,
    tighteningFromOneDayToZeroTurnsTheCheckOff:
      at0.wellsTakingAShare > at1.wellsTakingAShare,
    theAllocatedTotalIsUnchangedByAgeingATestOut:
      Math.abs(at60.allocatedOil - at0.allocatedOil) < 1e-6,
  };
});

/** Which tests are even candidates: groupTests drops one only when is_valid is strictly false. */
export const groupTestsRows = () => {
  const mix = [
    { id: 'v-true', well_id: 'w-1', test_date: '2024-01-01', oil_rate_stbd: 100, is_valid: true },
    { id: 'v-false', well_id: 'w-1', test_date: '2024-01-02', oil_rate_stbd: 100, is_valid: false },
    { id: 'v-absent', well_id: 'w-1', test_date: '2024-01-03', oil_rate_stbd: 100 },
    { id: 'v-null', well_id: 'w-1', test_date: '2024-01-04', oil_rate_stbd: 100, is_valid: null },
    { id: 'v-string-false', well_id: 'w-1', test_date: '2024-01-05', oil_rate_stbd: 100, is_valid: 'false' },
    { id: 'v-zero', well_id: 'w-1', test_date: '2024-01-06', oil_rate_stbd: 100, is_valid: 0 },
  ];
  const kept = (opts) => new Set((groupTests(mix, opts).get('w-1') || []).map((t) => t.id));
  const byDefault = kept({});
  const withInvalid = kept({ includeInvalid: true });
  return mix.map((t) => ({
    provenance: 'derived',
    id: t.id,
    isValidAsWritten: t.is_valid === undefined ? 'absent'
      : t.is_valid === null ? 'null' : String(t.is_valid),
    keptByDefault: byDefault.has(t.id),
    keptWithIncludeInvalid: withInvalid.has(t.id),
    droppedOnlyBecauseItIsStrictlyFalse: t.is_valid === false,
  }));
};

/** The teaching tests, and which one carries which well on which day. */
export const teachingTestRows = () => teachingTests().map((t) => ({
  provenance: 'teaching',
  id: t.id,
  wellName: t.well.name,
  testDate: t.test_date,
  oilRateStbd: t.oil_rate_stbd,
  waterRateStbd: t.water_rate_stbd,
  gasRateMscfd: t.gas_rate_mscfd,
  durationHours: t.duration_hours,
  thpPsia: t.thp_psia,
  isValid: t.is_valid,
}));

export const TEACHING_TEST_PROBE_DATES = Object.freeze([
  '2024-10-31', '2024-11-05', '2024-11-06', '2024-11-20',
]);

export const teachingTestInForceRows = (dates = TEACHING_TEST_PROBE_DATES) => {
  const grouped = groupTests(teachingTests(), {});
  const producers = Object.values(TEACHING_WELLS)
    .filter((w) => w.well_type !== 'injector' && w.well_type !== 'observation');
  const out = [];
  dates.forEach((date) => {
    producers.forEach((w) => {
      const t = testInForce(grouped.get(w.id), date, DEFAULT_ALLOCATION_SETTINGS.maxTestAgeDays);
      out.push({
        provenance: 'teaching',
        date,
        wellName: w.name,
        testId: t ? t.id : null,
        testDate: t ? t.test_date : null,
        oilRateStbd: t ? t.oil_rate_stbd : null,
        ageDays: t ? dayOf(date) - dayOf(t.test_date) : null,
        noTestInForce: !t,
      });
    });
  });
  return out;
};

/** Well test QC, and what it is never asked. */
export const publishedQcRows = memoize(() => {
  const wells = buildWellSeries(
    allocationGolden.testQc.ledger.map((r) => ({ ...r, well: allocationGolden.testQc.well })),
  );
  const results = validateWellTests(allocationGolden.testQc.tests, wells);
  return results.map((r, i) => ({
    provenance: 'golden',
    index: i + 1,
    testId: r.testId,
    testDate: r.testDate,
    severity: r.severity,
    codes: (r.issues || []).map((x) => x.code).join(', '),
    messages: (r.issues || []).map((x) => x.message).join(' '),
  }));
});

export const qcCoverageHeadline = memoize(() => {
  const wells = buildWellSeries(
    allocationGolden.testQc.ledger.map((r) => ({ ...r, well: allocationGolden.testQc.well })),
  );
  const results = validateWellTests(allocationGolden.testQc.tests, wells);
  return {
    provenance: 'derived',
    testsHandedIn: allocationGolden.testQc.tests.length,
    rowsReturned: results.length,
    testsWithNoIssueAndThereforeAbsent: allocationGolden.testQc.tests.length - results.length,
    rowsReturnedOnAnEmptyTestList: validateWellTests([], wells).length,
    anEmptyArrayMeansEitherAllCleanOrNothingRan: true,
    thereIsNoCountOfTestsCheckedInTheReturn: true,
    theOutlierCheckNeedsThreePriorTestsOnTheSameWell: true,
  };
});

export const teachingQcRows = memoize(() => validateWellTests(
  teachingTests(), teachingWellSeries(),
).map((r) => ({
  provenance: 'teaching',
  testId: r.testId,
  wellName: r.wellName,
  testDate: r.testDate,
  severity: r.severity,
  codes: (r.issues || []).map((x) => x.code).join(', '),
  messages: (r.issues || []).map((x) => x.message).join(' '),
  andGroupTestsCarriesTheWellOnItAnyway: true,
})));

/** The outlier check cannot see the first three tests of a well. */
export const OUTLIER_REACH_COUNTS = Object.freeze([2, 3, 4, 5, 6]);

export const outlierReachRows = (counts = OUTLIER_REACH_COUNTS) => counts.map((n) => {
  const tests = Array.from({ length: n }, (_, i) => ({
    id: `seq-${i + 1}`,
    well_id: 'w-seq',
    test_date: isoOfDay(dayOf('2024-01-01') + i * 30),
    oil_rate_stbd: i === n - 1 ? 1500 : 500,
    water_rate_stbd: 100,
    gas_rate_mscfd: 250,
    duration_hours: 12,
    is_valid: true,
  }));
  const res = validateWellTests(tests, []);
  const last = res.find((r) => r.testId === `seq-${n}`);
  return {
    provenance: 'derived',
    testsOnTheWell: n,
    priorTestsAvailable: n - 1,
    codesOnTheLastTest: last ? (last.issues || []).map((x) => x.code).join(', ') : 'none',
    theOutlierFired: Boolean(last && (last.issues || []).some((x) => x.code === 'rate_outlier')),
    theFirstBadTestBecomesPartOfTheMedianThatJudgesTheLaterOnes: true,
  };
});

/** Back allocation on the published field, at every published setting. */
export const publishedAllocationRows = () => [
  ['allocation', 'the default settings'],
  ['allocationNoUptime', 'the uptime turned off'],
  ['allocationAged120', 'the test age limit tightened to 120 days'],
  ['allocationWithInvalidTests', 'the failed tests included'],
  ['allocationLedgerBasis', 'the wells own meters as the basis'],
].map(([key, label]) => {
  const g = allocationGolden[key];
  const grand = g.grand;
  return {
    provenance: 'golden',
    key,
    label,
    days: grand.days,
    basis: g.settings.basis,
    useUptime: g.settings.useUptime,
    maxTestAgeDays: g.settings.maxTestAgeDays,
    includeInvalidTests: g.settings.includeInvalidTests,
    measuredOil: grand.measured_oil,
    theoreticalOil: grand.theoretical_oil,
    allocatedOil: grand.allocated_oil,
    grandFactor: grand.theoretical_oil > 0 ? grand.measured_oil / grand.theoretical_oil : null,
    unallocatedMeteredOil: grand.measured_oil - grand.allocated_oil,
    wellsTakingAShare: (g.wells || []).length,
    diagnostics: Object.entries(g.diagnosticCounts || {})
      .map(([k, v]) => `${k} ${v}`).join(', ') || 'none',
    theFactorIsTheOutputAndIsNeverNormalised: true,
  };
});

/** Closure holds per day, exactly, and fails silently at the grand total. */
export const closureRows = () => {
  const days = allocationGolden.allocation.days;
  return [0, 1, 11, 23].map((i) => {
    const d = days[i];
    return {
      provenance: 'golden',
      index: i + 1,
      date: d.date,
      oilFactor: d.factors.oil,
      waterFactor: d.factors.water,
      gasFactor: d.factors.gas,
      measuredOil: d.measured.oil,
      theoreticalOil: d.theoretical.oil,
      allocatedOil: d.allocated.oil,
      closureResidual: d.measured.oil - d.allocated.oil,
      itClosesExactly: Math.abs(d.measured.oil - d.allocated.oil) < 1e-9,
    };
  });
};

export const noBasisHeadline = () => {
  const nb = allocationGolden.noBasis.allocation;
  return {
    provenance: 'golden',
    days: nb.grand.days,
    measuredOil: nb.grand.measured_oil,
    allocatedOil: nb.grand.allocated_oil,
    meteredOilInNoWellAndInNoTotal: nb.grand.measured_oil - nb.grand.allocated_oil,
    diagnostics: Object.entries(allocationGolden.noBasis.allocation.diagnosticCounts || {})
      .map(([k, v]) => `${k} ${v}`).join(', ') || 'none',
    theSecondDayHasNoFactorAtAll: nb.days[1].factors.oil === null,
    thereIsNoClosureFigureInTheReturn: true,
    aConsumerHasToSubtractItItself: true,
  };
};

/** Back allocation on the teaching field, day by day. */
export const teachingAllocationDayRows = memoize(() => teachingAllocation().days.map((d, i) => ({
  provenance: 'teaching',
  index: i + 1,
  date: d.date,
  entries: d.entries.length,
  oilFactor: finiteOrNull(d.factors.oil),
  waterFactor: finiteOrNull(d.factors.water),
  gasFactor: finiteOrNull(d.factors.gas),
  measuredOil: d.measured.oil,
  theoreticalOil: d.theoretical.oil,
  allocatedOil: d.allocated.oil,
  factorIsInsideTheWarningBand: d.factors.oil != null
    && d.factors.oil >= DEFAULT_ALLOCATION_SETTINGS.factorWarnLow
    && d.factors.oil <= DEFAULT_ALLOCATION_SETTINGS.factorWarnHigh,
})));

export const teachingAllocationWellRows = memoize(() => teachingAllocation().wells.map((w) => ({
  provenance: 'teaching',
  wellName: w.wellName,
  days: w.days,
  theoreticalOil: w.theoretical.oil,
  allocatedOil: w.allocated.oil,
  allocatedWater: w.allocated.water,
  allocatedGas: w.allocated.gas,
  creditedOverTheoretical: w.theoretical.oil > 0 ? w.allocated.oil / w.theoretical.oil : null,
})));

export const teachingAllocationHeadline = memoize(() => {
  const a = teachingAllocation();
  const counts = {};
  a.diagnostics.forEach((d) => { counts[d.code] = (counts[d.code] || 0) + 1; });
  return {
    provenance: 'teaching',
    allocatedDays: a.days.length,
    firstDate: a.days[0].date,
    lastDate: a.days[a.days.length - 1].date,
    wellsTakingAShare: a.wells.length,
    diagnostics: a.diagnostics.length,
    diagnosticsByCode: Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(', ') || 'none',
    measuredOil: a.totals.measured.oil,
    theoreticalOil: a.totals.theoretical.oil,
    allocatedOil: a.totals.allocated.oil,
    closureResidualOil: a.totals.measured.oil - a.totals.allocated.oil,
    measuredWater: a.totals.measured.water,
    allocatedWater: a.totals.allocated.water,
    measuredGas: a.totals.measured.gas,
    allocatedGas: a.totals.allocated.gas,
    everyShareIsTheSameFactorTimesATheoretical: true,
  };
});

/** The missing row that takes a full share, as a demonstration and then for real. */
export const missingRowRows = () => {
  const wells = [
    { id: 'share-a', name: 'SHARE-A', well_type: 'producer' },
    { id: 'share-b', name: 'SHARE-B', well_type: 'producer' },
  ];
  const tests = wells.map((w) => ({
    id: `t-${w.id}`, well_id: w.id, test_date: '2024-02-01', oil_rate_stbd: 1000,
    water_rate_stbd: 0, gas_rate_mscfd: 0, is_valid: true,
  }));
  const totals = [{ total_date: '2024-03-01', oil_stb: 1000, water_stb: 0, gas_mscf: 0 }];
  const rowA = {
    well: wells[0], well_id: 'share-a', prod_date: '2024-03-01', oil_stb: 1000,
    water_stb: 0, gas_mscf: 0, hours_on: 24,
  };
  const cases = [
    ['SHARE-B shut in and SAID so, hours_on 0', [rowA, {
      well: wells[1], well_id: 'share-b', prod_date: '2024-03-01', oil_stb: 0,
      water_stb: 0, gas_mscf: 0, hours_on: 0,
    }]],
    ['SHARE-B shut in and filed NO ROW at all', [rowA]],
    ['SHARE-B filed a row of zeroes with hours_on 24', [rowA, {
      well: wells[1], well_id: 'share-b', prod_date: '2024-03-01', oil_stb: 0,
      water_stb: 0, gas_mscf: 0, hours_on: 24,
    }]],
    ['SHARE-B filed a row with a null hours_on', [rowA, {
      well: wells[1], well_id: 'share-b', prod_date: '2024-03-01', oil_stb: 0,
      water_stb: 0, gas_mscf: 0, hours_on: null,
    }]],
  ];
  return cases.map(([label, ledger]) => {
    const a = computeAllocation({ wells, tests, ledger, totals, settings: {} });
    const day = a.days[0];
    const entry = (id) => day.entries.find((e) => e.wellId === id) || null;
    const b = entry('share-b');
    return {
      provenance: 'derived',
      label,
      oilFactor: finiteOrNull(day.factors.oil),
      shareAUptime: entry('share-a').uptime,
      shareAAllocatedOil: entry('share-a').allocated.oil,
      shareBUptime: b ? b.uptime : null,
      shareBTheoreticalOil: b ? b.theoretical.oil : null,
      shareBAllocatedOil: b ? b.allocated.oil : null,
      diagnostics: a.diagnostics.map((d) => d.code).join(', ') || 'none',
      shareBWasCreditedWithBarrelsItNeverMade: Boolean(b && b.allocated.oil > 0),
    };
  });
};

/** The teaching well that goes quiet and keeps producing. */
export const quietWellRows = memoize(() => {
  const a = teachingAllocation();
  const ledger = teachingLedger();
  const id = TEACHING_WELLS.o17.id;
  return a.days.map((d, i) => {
    const entry = d.entries.find((e) => e.wellId === id) || null;
    const filed = ledger.some((r) => r.well_id === id && r.prod_date === d.date);
    return {
      provenance: 'teaching',
      index: i + 1,
      date: d.date,
      ledgerRowFiled: filed,
      uptime: entry ? entry.uptime : null,
      testId: entry ? entry.testId : null,
      theoreticalOil: entry ? entry.theoretical.oil : null,
      allocatedOil: entry ? entry.allocated.oil : null,
      tookNoShareAtAll: !entry,
      creditedWithAFullDayOnStream: Boolean(entry) && entry.uptime === 1 && !filed,
    };
  });
});

export const quietWellHeadline = memoize(() => {
  const rows = quietWellRows();
  const ex = teachingExceptionRun().exceptions.find((e) => e.wellName === 'OGUTA-17');
  return {
    provenance: 'teaching',
    name: 'OGUTA-17',
    allocatedDays: rows.length,
    daysWithNoLedgerRow: rows.filter((r) => !r.ledgerRowFiled).length,
    daysCreditedWithAFullDayOnStream: rows.filter((r) => r.creditedWithAFullDayOnStream).length,
    daysThatTookNoShareAtAll: rows.filter((r) => r.tookNoShareAtAll).length,
    surveillanceExceptionType: ex ? ex.type : null,
    surveillanceExceptionSeverity: ex ? ex.severity : null,
    surveillanceExceptionValue: ex ? ex.value : null,
    surveillanceExceptionMessage: ex ? ex.message : null,
    oneWellTwoModulesTwoOppositeReadingsOfTheSameSilence: true,
  };
});

/** The imbalance, which is the unaccounted volume an allocation engineer chases. */
export const publishedImbalanceRows = () => allocationGolden.imbalance.slice(0, 6)
  .map((d, i) => ({
    provenance: 'golden',
    index: i + 1,
    date: d.date,
    measuredOil: d.oil.measured,
    bookedOil: d.oil.booked,
    imbalanceOil: d.oil.imbalance,
    imbalanceOilPct: finiteOrNull(d.oil.imbalancePct),
    imbalanceWater: d.water.imbalance,
    imbalanceWaterPct: finiteOrNull(d.water.imbalancePct),
    imbalanceGas: d.gas.imbalance,
    imbalanceGasPct: finiteOrNull(d.gas.imbalancePct),
    thePercentageIsAgainstWhatTheWellsBookedAndNotAgainstTheMeter: true,
  }));

export const teachingImbalanceRows = memoize(() => imbalanceSeries(
  teachingAllocation(), teachingLedger(),
).map((d, i) => ({
  provenance: 'teaching',
  index: i + 1,
  date: d.date,
  measuredOil: d.oil.measured,
  bookedOil: d.oil.booked,
  imbalanceOil: d.oil.imbalance,
  imbalanceOilPct: finiteOrNull(d.oil.imbalancePct),
})));

/** The monthly factors, and the one that means nothing to scale. */
export const teachingMonthlyFactorRows = memoize(() => monthlyFactors(teachingAllocation())
  .map((m) => ({
    provenance: 'teaching',
    wellName: m.wellName,
    periodMonth: m.periodMonth,
    theoreticalOil: m.theoretical.oil,
    allocatedOil: m.allocated.oil,
    oilFactor: finiteOrNull(m.factors.oil),
    waterFactor: finiteOrNull(m.factors.water),
    gasFactor: finiteOrNull(m.factors.gas),
  })));

export const nothingToScaleHeadline = memoize(() => {
  const wells = [{ id: 'd-1', name: 'DEMO-1', well_type: 'producer' }];
  const tests = [{
    id: 'dt-1', well_id: 'd-1', test_date: '2024-03-01',
    oil_rate_stbd: 1000, water_rate_stbd: 100, gas_rate_mscfd: 0, is_valid: true,
  }];
  const totals = [{ total_date: '2024-03-05', oil_stb: 900, water_stb: 100, gas_mscf: 500 }];
  const a = computeAllocation({ wells, tests, ledger: [], totals, settings: {} });
  const m = monthlyFactors(a)[0];
  return {
    provenance: 'derived',
    oilFactor: finiteOrNull(m.factors.oil),
    waterFactor: finiteOrNull(m.factors.water),
    gasFactor: finiteOrNull(m.factors.gas),
    meteredGas: a.totals.measured.gas,
    theoreticalGas: a.totals.theoretical.gas,
    allocatedGas: a.totals.allocated.gas,
    diagnosticsRaised: a.diagnostics.map((d) => d.code).join(', ') || 'none',
    aFactorOfOneMeansEitherNothingToScaleOrTheTestsAgreedExactly: true,
    theDiagnosticThatTellsThemApartIsOnADifferentArray: true,
  };
});

/** The write-back shape, which carries the uptime through as an hours_on. */
export const allocatedLedgerHeadline = memoize(() => {
  const rows = allocatedLedgerRows(teachingAllocation());
  const lastDate = teachingAllocation().days[teachingAllocation().days.length - 1].date;
  return {
    provenance: 'teaching',
    rows: rows.length,
    distinctWells: new Set(rows.map((r) => r.wellId)).size,
    rowsCarryingAnHoursOn: rows.filter((r) => Number.isFinite(r.hours_on)).length,
    lastDayRows: rows.filter((r) => r.date === lastDate).map((r) => ({
      wellId: r.wellId,
      oilStb: r.oil_stb,
      waterStb: r.water_stb,
      gasMscf: r.gas_mscf,
      hoursOn: r.hours_on,
    })),
    aWellThatNeverFiledARowGetsOne: true,
  };
});

/** The factor warning band, which raises a diagnostic and clamps nothing. */
export const FACTOR_BAND_SWEEP = Object.freeze([0.4, 0.6, 0.69, 0.7, 0.71, 1, 1.29, 1.3, 1.31, 2.5]);

export const factorBandRows = (sweep = FACTOR_BAND_SWEEP) => sweep.map((target) => {
  const wells = [{ id: 'f-1', name: 'BAND-1', well_type: 'producer' }];
  const tests = [{
    id: 'ft-1', well_id: 'f-1', test_date: '2024-02-01',
    oil_rate_stbd: 1000, water_rate_stbd: 0, gas_rate_mscfd: 0, is_valid: true,
  }];
  const totals = [{ total_date: '2024-03-01', oil_stb: 1000 * target, water_stb: 0, gas_mscf: 0 }];
  const a = computeAllocation({ wells, tests, ledger: [], totals, settings: {} });
  return {
    provenance: 'derived',
    meteredOverTheoretical: target,
    reportedFactor: finiteOrNull(a.days[0].factors.oil),
    allocatedOil: a.days[0].allocated.oil,
    diagnostics: a.diagnostics.filter((d) => d.phase === 'oil').map((d) => d.code).join(', ') || 'none',
    outOfBand: a.diagnostics.some((d) => d.code === 'factor_out_of_band' && d.phase === 'oil'),
    nothingClampsAFactorIntoTheBand: true,
  };
});

// ---------------------------------------------------------------------------
// DEFERMENTS. The one function in surveillance.js that reads the wall clock,
// and every accessor here hands it an EXPLICIT asOf so that nothing this lab
// returns can change tomorrow on the same data.
// ---------------------------------------------------------------------------

export const publishedDefermentHeadline = memoize(() => {
  const g = surveillanceGolden.deferments;
  const run = summarizeDeferments(g.events, g.asOf);
  return {
    provenance: 'golden',
    asOf: g.asOf,
    events: run.totals.events,
    openEvents: run.openCount,
    totalDays: run.totals.days,
    totalOil: run.totals.oil,
    totalWater: run.totals.water,
    totalGas: run.totals.gas,
    categories: run.byCategory.map((c) => c.category),
    theSortIsByOilDescendingThenByDays: true,
    theAsOfWasHandedInExplicitly: true,
  };
});

export const publishedDefermentCategoryRows = memoize(() => {
  const g = surveillanceGolden.deferments;
  return summarizeDeferments(g.events, g.asOf).byCategory.map((c, i) => ({
    provenance: 'golden',
    index: i + 1,
    category: c.category,
    events: c.events,
    days: c.days,
    oil: c.oil,
    water: c.water,
    gas: c.gas,
  }));
});

/** The day count is inclusive and is clamped at one. */
export const DEFERMENT_DAY_CASES = Object.freeze([
  Object.freeze(['same day', '2024-06-10', '2024-06-10']),
  Object.freeze(['three days', '2024-06-10', '2024-06-12']),
  Object.freeze(['end one day BEFORE the start', '2024-06-10', '2024-06-09']),
  Object.freeze(['end a month before the start', '2024-06-10', '2024-05-10']),
  Object.freeze(['a full month', '2024-06-01', '2024-06-30']),
]);

export const defermentDayRows = (cases = DEFERMENT_DAY_CASES) => cases.map(([label, start, end]) => {
  const run = summarizeDeferments(
    [{ category: 'Facility', start_date: start, end_date: end, oil_deferred_stb: 100 }],
    TEACHING_AS_OF,
  );
  return {
    provenance: 'derived',
    label,
    startDate: start,
    endDate: end,
    days: run.totals.days,
    events: run.totals.events,
    theDatesWereTheWrongWayRound: dayOf(end) < dayOf(start),
    itWasClampedToOne: run.totals.days === 1 && dayOf(end) < dayOf(start),
    nothingSaysTheDatesWereTheWrongWayRound: true,
  };
});

/**
 * THE WALL CLOCK, STATED AS A BOOLEAN AND AS ANCHORED RECOMPUTATIONS. An OPEN
 * event accrues days to asOf, and when asOf is OMITTED the function
 * substitutes today. The unanchored number is deliberately NOT returned here,
 * because a value that changes on every render cannot be pinned by a test and
 * cannot be quoted in a lesson.
 */
export const DEFERMENT_ANCHORS = Object.freeze([
  '2024-06-30', '2024-08-31', '2024-11-20', '2025-06-30',
]);

const OPEN_EVENT = Object.freeze([Object.freeze({
  category: 'Facility', start_date: '2024-06-01', end_date: null,
  oil_deferred_stb: 3200, water_deferred_stb: 800, gas_deferred_mscf: 1900,
})]);

export const defermentAnchorRows = (anchors = DEFERMENT_ANCHORS) => anchors.map((asOf) => {
  const run = summarizeDeferments(OPEN_EVENT, asOf);
  return {
    provenance: 'derived',
    asOf,
    days: run.totals.days,
    openCount: run.openCount,
    oil: run.totals.oil,
    theAnchorWasHandedInExplicitly: true,
  };
});

export const wallClockHeadline = memoize(() => {
  const anchored = summarizeDeferments(OPEN_EVENT, '2024-06-30');
  const unanchored = summarizeDeferments(OPEN_EVENT);
  return {
    provenance: 'derived',
    theFunction: 'summarizeDeferments',
    itDefaultsItsAsOfToToday: true,
    theDayCountDiffersFromTheAnchoredOne: unanchored.totals.days !== anchored.totals.days,
    theOpenCountIsTheSameEitherWay: unanchored.openCount === anchored.openCount,
    theDeferredVolumesAreTheSameEitherWay: unanchored.totals.oil === anchored.totals.oil,
    everyOtherWindowInTheModuleAnchorsOnTheFieldLatestLedgerDate: true,
    theUnanchoredDayCountIsNotReturnedByThisLab: true,
    whyItIsNotReturned: 'A number that changes on every render cannot be pinned by a test and cannot be quoted in a lesson, so the finding is stated as a property and as anchored recomputations instead.',
    anchorsOffered: DEFERMENT_ANCHORS.length,
  };
});

export const teachingDeferments = () => [
  { category: 'Facility', start_date: '2024-10-02', end_date: '2024-10-05', oil_deferred_stb: 4180, water_deferred_stb: 1296, gas_deferred_mscf: 2424 },
  { category: 'Facility', start_date: '2024-11-08', end_date: '2024-11-10', oil_deferred_stb: 1640, water_deferred_stb: 502, gas_deferred_mscf: 947 },
  { category: 'Artificial lift', start_date: '2024-10-18', end_date: '2024-10-27', oil_deferred_stb: 3140, water_deferred_stb: 973, gas_deferred_mscf: 1821 },
  { category: 'Well work', start_date: '2024-11-12', end_date: '2024-11-20', oil_deferred_stb: 2960, water_deferred_stb: 651, gas_deferred_mscf: 1391 },
  { category: 'Pipeline', start_date: '2024-11-18', end_date: null, oil_deferred_stb: 880, water_deferred_stb: 272, gas_deferred_mscf: 510 },
];

export const teachingDefermentRows = memoize(() => summarizeDeferments(
  teachingDeferments(), TEACHING_AS_OF,
).byCategory.map((c, i) => ({
  provenance: 'teaching',
  index: i + 1,
  category: c.category,
  events: c.events,
  days: c.days,
  oil: c.oil,
  water: c.water,
  gas: c.gas,
})));

// ---------------------------------------------------------------------------
// EXPERT. THE SAME DATA READ TWICE: one ratio read two ways, a decline
// exponent read as falsy, three guards in the wrong place, and one rate handed
// to two modules that disagree about which phase it is.
// ---------------------------------------------------------------------------

/**
 * THE PUBLISHED RATIO SEAM. The golden publishes the DISAGREEMENT rather than
 * an expected value, which is the right thing to have done, so every field
 * below says which of the two readings it is.
 */
export const publishedSeamHeadline = () => {
  const s = surveillanceGolden.ratioSeam;
  return {
    provenance: 'golden',
    well: s.well,
    recentFrom: s.window.recentFrom,
    recentTo: s.window.recentTo,
    baselineFrom: s.window.baselineFrom,
    baselineTo: s.window.baselineTo,
    gorBaselineMeanOfRatios: s.gor.baselineMeanOfRatios,
    gorBaselineVolumetric: s.gor.baselineVolumetric,
    gorRecentMeanOfRatios: s.gor.recentMeanOfRatios,
    gorRecentVolumetric: s.gor.recentVolumetric,
    gorRiseByMeanOfRatiosPct: s.gor.riseByMeanOfRatiosPct,
    gorRiseByVolumetricPct: s.gor.riseByVolumetricPct,
    gorOverstatementPct: s.gor.overstatementPct,
    gorSeverityByMeanOfRatios: s.gor.severityByMeanOfRatios,
    gorSeverityByVolumetric: s.gor.severityByVolumetric,
    gorRiseRatio: s.gor.riseByMeanOfRatiosPct / s.gor.riseByVolumetricPct,
    watercutBaselineMeanOfRatios: s.watercut.baselineMeanOfRatios,
    watercutBaselineVolumetric: s.watercut.baselineVolumetric,
    watercutRecentMeanOfRatios: s.watercut.recentMeanOfRatios,
    watercutRecentVolumetric: s.watercut.recentVolumetric,
    watercutRiseByMeanOfRatiosPts: s.watercut.riseByMeanOfRatiosPts,
    watercutRiseByVolumetricPts: s.watercut.riseByVolumetricPts,
    watercutRiseDifferenceInPoints:
      s.watercut.riseByMeanOfRatiosPts - s.watercut.riseByVolumetricPts,
    watercutSeverityByMeanOfRatios: s.watercut.severityByMeanOfRatios,
    watercutSeverityByVolumetric: s.watercut.severityByVolumetric,
    gorTrigger: DEFAULT_SURVEILLANCE_SETTINGS.gorRisePct,
    gorDoublingToHigh: DEFAULT_SURVEILLANCE_SETTINGS.gorRisePct * 2,
    watercutTrigger: DEFAULT_SURVEILLANCE_SETTINGS.watercutRisePts,
    watercutDoublingToHigh: DEFAULT_SURVEILLANCE_SETTINGS.watercutRisePts * 2,
    theSeverityMovesOnBothRatiosAtOnce:
      s.gor.severityByMeanOfRatios !== s.gor.severityByVolumetric
      && s.watercut.severityByMeanOfRatios !== s.watercut.severityByVolumetric,
    theGoldenPublishesTheDisagreementRatherThanResolvingIt: true,
    theEnginePrintsTheHigherOne: true,
  };
};

/** Which function reads which way, so a lesson can name it rather than gesture. */
export const seamReaderRows = () => [
  {
    fn: 'detectExceptions',
    reading: 'the MEAN OF THE DAILY RATIOS',
    how: 'windowMean(points, "gor", ...) and windowMean(points, "watercut", ...). Each point ratio was formed in derivePoint from that row alone, and the window mean is an unweighted arithmetic mean of those ratios.',
    answers: 'what did a typical day of this well look like',
    provenance: 'derived',
  },
  {
    fn: 'computeKpis',
    reading: 'VOLUMETRIC',
    how: 'mean of the field oil, mean of the field water, mean of the field gas, and THEN water over oil plus water and gas times a thousand over oil, off the means. Volume weighted by construction.',
    answers: 'what did this period produce',
    provenance: 'derived',
  },
  {
    fn: 'buildFieldSeries',
    reading: 'VOLUMETRIC',
    how: 'sum over sum, per day, on the whole field at once.',
    answers: 'what did the field produce on this date',
    provenance: 'derived',
  },
];

const seamRead = (points, fromDay, toDay) => {
  const rows = points.filter((p) => {
    const d = dayOf(p.date);
    return d > fromDay && d <= toDay;
  });
  const oil = sumOf(rows.map((p) => p.oil));
  const water = sumOf(rows.map((p) => p.water));
  const gas = sumOf(rows.map((p) => p.gas));
  return {
    rows: rows.length,
    oil,
    water,
    gas,
    gorMeanOfRatios: meanOf(rows.map((p) => p.gor)),
    gorVolumetric: oil > 0 ? (gas * SCF_PER_MSCF) / oil : null,
    watercutMeanOfRatios: meanOf(rows.map((p) => p.watercut)),
    watercutVolumetric: oil + water > 0 ? water / (oil + water) : null,
  };
};

const severityForGor = (rise) => (rise >= DEFAULT_SURVEILLANCE_SETTINGS.gorRisePct * 2 ? 'high'
  : rise >= DEFAULT_SURVEILLANCE_SETTINGS.gorRisePct ? 'medium' : 'none');
const severityForWatercut = (rise) => (
  rise >= DEFAULT_SURVEILLANCE_SETTINGS.watercutRisePts * 2 ? 'high'
    : rise >= DEFAULT_SURVEILLANCE_SETTINGS.watercutRisePts ? 'medium' : 'none');

/** The same seam on the teaching well, where it is bigger and changes the verdict. */
export const teachingSeamHeadline = memoize(() => {
  const points = seriesNamed('OGUTA-2').points;
  const asOfDay = dayOf(TEACHING_AS_OF);
  const win = widenedWindows(seriesCadenceDays(points));
  const recent = seamRead(points, asOfDay - win.recentDays, asOfDay);
  const base = seamRead(
    points, asOfDay - win.recentDays - win.baselineDays, asOfDay - win.recentDays,
  );
  const gorRiseMean = pctChange(recent.gorMeanOfRatios, base.gorMeanOfRatios);
  const gorRiseVol = pctChange(recent.gorVolumetric, base.gorVolumetric);
  const wcRiseMean = (recent.watercutMeanOfRatios - base.watercutMeanOfRatios) * 100;
  const wcRiseVol = (recent.watercutVolumetric - base.watercutVolumetric) * 100;
  return {
    provenance: 'teaching',
    name: 'OGUTA-2',
    asOf: TEACHING_AS_OF,
    baselineRows: base.rows,
    baselineOil: base.oil,
    baselineWater: base.water,
    baselineGas: base.gas,
    baselineGorMeanOfRatios: base.gorMeanOfRatios,
    baselineGorVolumetric: base.gorVolumetric,
    baselineGorDifference: base.gorMeanOfRatios - base.gorVolumetric,
    baselineWatercutMeanOfRatios: base.watercutMeanOfRatios,
    baselineWatercutVolumetric: base.watercutVolumetric,
    baselineWatercutDifference: base.watercutMeanOfRatios - base.watercutVolumetric,
    theTwoReadingsAgreeExactlyOverTheBaseline:
      Math.abs(base.gorMeanOfRatios - base.gorVolumetric) < 1e-9
      && Math.abs(base.watercutMeanOfRatios - base.watercutVolumetric) < 1e-12,
    recentRows: recent.rows,
    recentOil: recent.oil,
    recentWater: recent.water,
    recentGas: recent.gas,
    recentGorMeanOfRatios: recent.gorMeanOfRatios,
    recentGorVolumetric: recent.gorVolumetric,
    recentGorTimes: recent.gorMeanOfRatios / recent.gorVolumetric,
    recentWatercutMeanOfRatios: recent.watercutMeanOfRatios,
    recentWatercutVolumetric: recent.watercutVolumetric,
    recentWatercutDifference: recent.watercutMeanOfRatios - recent.watercutVolumetric,
    gorRiseByMeanOfRatiosPct: gorRiseMean,
    gorRiseByVolumetricPct: gorRiseVol,
    gorSeverityByMeanOfRatios: severityForGor(gorRiseMean),
    gorSeverityByVolumetric: severityForGor(gorRiseVol),
    watercutRiseByMeanOfRatiosPts: wcRiseMean,
    watercutRiseByVolumetricPts: wcRiseVol,
    watercutSeverityByMeanOfRatios: severityForWatercut(wcRiseMean),
    watercutSeverityByVolumetric: severityForWatercut(wcRiseVol),
    itIsAHighExceptionAgainstNoExceptionAtAll:
      severityForGor(gorRiseMean) === 'high' && severityForGor(gorRiseVol) === 'none',
    neitherReadingIsWrong: true,
  };
});

/** The two day shapes, so the factors can be checked by hand. */
export const seamDayShapeRows = () => [
  ['an ordinary recent day', [1008, 312, 585]],
  ['a collapsed recent day', [82, 231, 141]],
].map(([label, [oil, water, gas]]) => {
  const p = derivePoint({
    prod_date: '2024-11-17', oil_stb: oil, water_stb: water, gas_mscf: gas, hours_on: 24,
  });
  return {
    provenance: 'teaching',
    label,
    oilStb: p.oil,
    waterStb: p.water,
    gasMscf: p.gas,
    watercutFraction: p.watercut,
    gorScfStb: p.gor,
  };
});

export const seamCollapseHeadline = () => {
  const rows = seamDayShapeRows();
  const [ordinary, collapsed] = rows;
  return {
    provenance: 'teaching',
    oilFallsByAFactorOf: ordinary.oilStb / collapsed.oilStb,
    waterFallsByAFactorOf: ordinary.waterStb / collapsed.waterStb,
    gasFallsByAFactorOf: ordinary.gasMscf / collapsed.gasMscf,
    soTheGorRisesByAFactorOf: collapsed.gorScfStb / ordinary.gorScfStb,
    theOilFallsFasterThanTheGasWhichIsWhatDrivesTheDailyRatioUp: true,
  };
};

/**
 * THE SEAM SWEPT. A window of SEVEN days built out of those two shapes only,
 * with k of them collapsed. It is a DEMONSTRATION and not the teaching well's
 * own recent window, whose ordinary days differ slightly from each other, so
 * do not quote one for the other.
 */
export const SEAM_SWEEP_COUNTS = Object.freeze([0, 1, 2, 3, 4, 5, 6, 7]);

export const seamSweepRows = (counts = SEAM_SWEEP_COUNTS) => {
  const ordinary = [1008, 312, 585];
  const collapsed = [82, 231, 141];
  return counts.map((k) => {
    const points = Array.from({ length: 7 }, (_, i) => {
      const [oil, water, gas] = i < k ? collapsed : ordinary;
      return derivePoint({
        prod_date: isoOfDay(dayOf('2024-11-14') + i),
        oil_stb: oil, water_stb: water, gas_mscf: gas, hours_on: 24,
      });
    });
    const read = seamRead(points, dayOf('2024-11-13'), dayOf('2024-11-21'));
    return {
      provenance: 'teaching',
      collapsedDays: k,
      totalDays: 7,
      gorMeanOfRatios: read.gorMeanOfRatios,
      gorVolumetric: read.gorVolumetric,
      gorRatio: read.gorMeanOfRatios / read.gorVolumetric,
      watercutMeanOfRatios: read.watercutMeanOfRatios,
      watercutVolumetric: read.watercutVolumetric,
      watercutDifference: read.watercutMeanOfRatios - read.watercutVolumetric,
      theTwoReadingsAreIdentical:
        Math.abs(read.gorMeanOfRatios - read.gorVolumetric) < 1e-9,
      itIsADemonstrationAndNotTheTeachingWellOwnWindow: true,
    };
  });
};

export const seamSweepHeadline = memoize(() => {
  const rows = seamSweepRows();
  const widest = rows.reduce((a, b) => (b.gorRatio > a.gorRatio ? b : a));
  return {
    provenance: 'teaching',
    pointsSwept: rows.length,
    pointsWhereTheTwoReadingsAgree: rows.filter((r) => r.theTwoReadingsAreIdentical).length,
    widestDisagreementAtCollapsedDays: widest.collapsedDays,
    widestGorRatio: widest.gorRatio,
    identicalAtBothEnds: rows[0].theTwoReadingsAreIdentical
      && rows[rows.length - 1].theTwoReadingsAreIdentical,
    aWindowOfUniformDaysCannotShowIt: true,
    aWindowWithAMixtureOfRatesShowsItAtItsWorst: true,
  };
});

/**
 * THE DECLINE EXPONENT GUARD. `if (modelType === "Exponential" || !b)` takes
 * the exponential form, and `!b` is TRUE for NaN, for null and for undefined,
 * so a hyperbolic fit with an unusable exponent silently returns the
 * EXPONENTIAL answer rather than a refusal or a not-a-number.
 */
export const publishedDeclineRows = () => surveillanceGolden.effectiveDecline.map((c, i) => ({
  provenance: 'golden',
  index: i + 1,
  diPerDay: c.Di,
  b: c.b,
  modelType: c.modelType,
  publishedEffectivePct: c.effectivePct,
  engineEffectivePct: annualEffectiveDecline(c.Di, c.b, c.modelType),
  engineReproducesThePublishedCase:
    annualEffectiveDecline(c.Di, c.b, c.modelType) === c.effectivePct,
}));

export const B_GUARD_SWEEP = Object.freeze([
  Object.freeze(['b = 0.5, an ordinary hyperbolic', 0.5]),
  Object.freeze(['b = 1, the harmonic limit', 1]),
  Object.freeze(['b = 0, the exponential limit', 0]),
  Object.freeze(['b as not a number', NaN]),
  Object.freeze(['b as null', null]),
  Object.freeze(['b as the undefined spelling', undefined]),
  Object.freeze(['b as the string "0.5"', '0.5']),
  Object.freeze(['b = -0.5, physically impossible', -0.5]),
  Object.freeze(['b = 5, far past any real b', 5]),
  Object.freeze(['b = 1e-9', 1e-9]),
]);

export const bGuardRows = (sweep = B_GUARD_SWEEP, diPerDay = 0.0015) => {
  const exponentialAnswer = annualEffectiveDecline(diPerDay, 0, 'Exponential');
  return sweep.map(([label, b]) => {
    const value = annualEffectiveDecline(diPerDay, b, 'Hyperbolic');
    return {
      provenance: 'derived',
      label,
      diPerDay,
      modelTypeAsked: 'Hyperbolic',
      bIsFalsy: !b,
      effectivePct: finiteOrNull(value),
      refused: value === null || !Number.isFinite(value),
      itReturnedTheExponentialAnswer: value === exponentialAnswer,
      exponentialAnswerAtTheSameDi: exponentialAnswer,
      aReaderHasNoWayToDistrustIt: value === exponentialAnswer && !Number.isFinite(Number(b)),
    };
  });
};

export const bGuardHeadline = memoize(() => {
  const rows = bGuardRows();
  const spellings = rows.filter((r) => r.itReturnedTheExponentialAnswer && r.bIsFalsy);
  return {
    provenance: 'derived',
    settingsSwept: rows.length,
    spellingsThatSilentlyTakeTheExponentialBranch: spellings.length,
    exponentialAnswerPct: rows.find((r) => r.label.includes('b = 0,')).effectivePct,
    publishedCaseOnePct: surveillanceGolden.effectiveDecline[0].effectivePct,
    itIsCaseOneOfThePublishedGolden:
      rows.find((r) => r.label.includes('b = 0,')).effectivePct
      === surveillanceGolden.effectiveDecline[0].effectivePct,
    hyperbolicAnswerAtHalfPct: rows.find((r) => r.label.includes('b = 0.5')).effectivePct,
    theTwoDifferBy: rows.find((r) => r.label.includes('b = 0,')).effectivePct
      - rows.find((r) => r.label.includes('b = 0.5')).effectivePct,
    theStringIsCoercedAndAnswersAsAHyperbolic:
      rows.find((r) => r.label.includes('string')).effectivePct
      === rows.find((r) => r.label.includes('b = 0.5')).effectivePct,
    aNegativeExponentIsNotRefusedEither:
      Number.isFinite(rows.find((r) => r.label.includes('-0.5')).effectivePct),
  };
});

/** A negative b is a negative base raised to a whole power, so it is not refused. */
export const NEGATIVE_B_CASES = Object.freeze([
  Object.freeze([0.01, -0.5]),
  Object.freeze([0.005, -0.5]),
  Object.freeze([0.0015, -0.5]),
  Object.freeze([0.01, -0.25]),
  Object.freeze([0.001, -2]),
]);

export const negativeBRows = (cases = NEGATIVE_B_CASES) => cases.map(([diPerDay, b]) => ({
  provenance: 'derived',
  diPerDay,
  b,
  bracket: 1 + b * diPerDay * DAYS_IN_YEAR,
  exponent: -1 / b,
  effectivePct: finiteOrNull(annualEffectiveDecline(diPerDay, b, 'Hyperbolic')),
  refused: annualEffectiveDecline(diPerDay, b, 'Hyperbolic') === null,
  anImpossibleExponentReturnsAPlausiblePercentage: true,
}));

/** What IS guarded, and it is guarded properly: the nominal decline itself. */
export const DI_GUARD_SWEEP = Object.freeze([
  Object.freeze(['Di = 0', 0]),
  Object.freeze(['Di = -0.001', -0.001]),
  Object.freeze(['Di as not a number', NaN]),
  Object.freeze(['Di as null', null]),
  Object.freeze(['Di = 1e-9', 1e-9]),
]);

export const diGuardRows = (sweep = DI_GUARD_SWEEP) => sweep.map(([label, di]) => {
  const v = annualEffectiveDecline(di, 0.5, 'Hyperbolic');
  return {
    provenance: 'derived',
    label,
    effectivePct: finiteOrNull(v),
    refused: v === null,
    contract: v === null ? 'refused with a null rather than a number nobody can distrust' : 'accepted',
  };
});

/** The series the fitter is handed, and the day it deletes. */
export const fitSeriesRows = () => {
  const points = [
    { prod_date: '2024-01-01', oil_stb: 900, hours_on: 24 },
    { prod_date: '2024-01-03', oil_stb: 880, hours_on: 24 },
    { prod_date: '2024-01-04', oil_stb: 100, hours_on: 0 },
    { prod_date: '2024-01-05', oil_stb: 860, hours_on: 24 },
  ].map(derivePoint);
  const producing = rateSeriesForFit(points, 'oil', 'producing');
  const calendar = rateSeriesForFit(points, 'oil', 'calendar');
  return [
    { basis: 'producing', rows: producing },
    { basis: 'calendar', rows: calendar },
  ].map(({ basis, rows }) => ({
    provenance: 'derived',
    basis,
    pointsHandedIn: points.length,
    pointsKept: rows.length,
    pointsDropped: points.length - rows.length,
    dates: rows.map((r) => r.date).join(', '),
    theContradictoryDayWasDeleted: basis === 'producing' && rows.length < points.length,
  }));
};

/** The teaching decliner, fitted end to end through the canonical Arps engine. */
export const TEACHING_FIT_CASES = Object.freeze([
  Object.freeze(['OGUTA-9', 'oil', 'producing']),
  Object.freeze(['OGUTA-9', 'oil', 'calendar']),
  Object.freeze(['OGUTA-9', 'gas', 'producing']),
  Object.freeze(['OGUTA-9', 'liquid', 'producing']),
  Object.freeze(['OGUTA-17', 'oil', 'producing']),
]);

export const teachingDeclineRows = (cases = TEACHING_FIT_CASES) => cases.map(([name, stream, basis]) => {
  const series = seriesNamed(name);
  const run = fitWellDecline(series.points, { stream, basis });
  const p = run && run.fit ? run.fit.parameters : null;
  return {
    provenance: 'teaching',
    name,
    stream,
    basis,
    pointsFitted: run && run.fitSeries ? run.fitSeries.length : null,
    insufficient: Boolean(run && run.insufficient),
    modelType: p ? p.modelType : null,
    qi: p ? finiteOrNull(p.qi) : null,
    diPerDay: p ? finiteOrNull(p.Di) : null,
    b: p ? finiteOrNull(p.b) : null,
    annualEffectivePct: p
      ? finiteOrNull(annualEffectiveDecline(p.Di, p.b, p.modelType)) : null,
    theOverlayCallsTheCanonicalArpsEngineAndDoesNotReDeriveDecline: true,
  };
});

/** The refusals, which are honest: too few points, a flat series and a rising one. */
export const fitRefusalRows = () => [
  ['two points', [900, 880]],
  ['thirty flat points', Array.from({ length: 30 }, () => 900)],
  ['thirty rising points', Array.from({ length: 30 }, (_, i) => 900 + i * 5)],
].map(([label, rates]) => {
  const points = rates.map((oil, i) => derivePoint({
    prod_date: isoOfDay(dayOf('2024-01-01') + i), oil_stb: oil, hours_on: 24,
  }));
  const run = fitWellDecline(points, { stream: 'oil', basis: 'producing' });
  return {
    provenance: 'derived',
    label,
    insufficient: Boolean(run && run.insufficient),
    usablePoints: run && run.fitSeries ? run.fitSeries.length : points.length,
    itCameBackInsufficientRatherThanAsADeclineOfZero: Boolean(run && run.insufficient),
  };
});

/**
 * THE DECIMATOR. It takes a maxPoints and strides by a CEILING, and it always
 * keeps the last point, so the returned count lands wherever the rounding puts
 * it and can be MORE than the maximum the argument names.
 */
export const DECIMATE_SWEEP = Object.freeze([
  1500, 1501, 1600, 2000, 2999, 3000, 3001, 3200, 4500, 4501, 6000, 10000, 45000,
]);

export const decimateRows = (sizes = DECIMATE_SWEEP, maxPoints = 1500) => sizes.map((n) => {
  const points = Array.from({ length: n }, (_, i) => i);
  const out = decimate(points, maxPoints);
  return {
    provenance: n === surveillanceGolden.decimate.n && maxPoints === surveillanceGolden.decimate.maxPoints
      ? 'golden' : 'derived',
    n,
    maxPoints,
    stride: n > maxPoints ? Math.ceil(n / maxPoints) : 1,
    outLength: out.length,
    outOverMaxPoints: out.length / maxPoints,
    overTheCapItsOwnArgumentNames: out.length > maxPoints,
    halfTheBudgetOrLess: out.length / maxPoints <= 0.51,
    theAlwaysKeepTheLastRuleIsWhatPutsItOver: out.length > maxPoints,
  };
});

export const decimateHeadline = memoize(() => {
  const rows = decimateRows();
  const g = surveillanceGolden.decimate;
  return {
    provenance: 'golden',
    publishedN: g.n,
    publishedMaxPoints: g.maxPoints,
    publishedStride: g.stride,
    publishedOutLength: g.outLength,
    publishedLastIndexKept: g.lastIndex,
    engineReproducesThePublishedCase:
      decimate(Array.from({ length: g.n }, (_, i) => i), g.maxPoints).length === g.outLength,
    sweepPoints: rows.length,
    pointsOverTheCap: rows.filter((r) => r.overTheCapItsOwnArgumentNames).length,
    pointsAtHalfTheBudgetOrLess: rows.filter((r) => r.halfTheBudgetOrLess).length,
    worstUnderrunAt: rows.reduce((a, b) => (b.outOverMaxPoints < a.outOverMaxPoints ? b : a)).n,
    worstUnderrunOutLength:
      rows.reduce((a, b) => (b.outOverMaxPoints < a.outOverMaxPoints ? b : a)).outLength,
    itIsNeitherACeilingNorAFloor: true,
  };
});

/** minOilRate gates the rate check and the ratio check and not the watercut check. */
export const MIN_OIL_RATE_SWEEP = Object.freeze([0, 1, 2, 3, 5, 10]);

const smallWellSeries = memoize(() => {
  const well = { id: 'w-small', name: 'SMALL-1', well_type: 'producer' };
  const rows = teachingDates().map((date, i) => {
    const back = teachingDates().length - 1 - i;
    const recent = back < 7;
    const oil = recent ? 1.2 : 3;
    const water = recent ? 8.8 : 1.8;
    // the gas holds up while the oil collapses, so the ratio rises too and
    // the gate has all three checks to gate rather than only two
    const gas = recent ? oil * 3.5 : oil * 1.4;
    return {
      well, well_id: well.id, prod_date: date, hours_on: 24,
      oil_stb: oil, water_stb: water, gas_mscf: gas, winj_stb: 0, ginj_mscf: 0,
    };
  });
  return buildWellSeries(rows);
});

export const minOilRateSweepRows = (sweep = MIN_OIL_RATE_SWEEP) => sweep.map((minOilRate) => {
  const run = detectExceptions(smallWellSeries(), { minOilRate });
  return {
    provenance: 'derived',
    minOilRate,
    isTheDefault: minOilRate === DEFAULT_SURVEILLANCE_SETTINGS.minOilRate,
    exceptionsRaised: run.exceptions.length,
    raised: run.exceptions.map((e) => `${e.severity} ${e.type}`).join('; ') || 'none',
    rateDropRaised: run.exceptions.some((e) => e.type === 'rate_drop'),
    watercutRiseRaised: run.exceptions.some((e) => e.type === 'watercut_rise'),
    gorRiseRaised: run.exceptions.some((e) => e.type === 'gor_rise'),
  };
});

export const minOilRateHeadline = memoize(() => {
  const atDefault = minOilRateSweepRows().find(
    (r) => r.minOilRate === DEFAULT_SURVEILLANCE_SETTINGS.minOilRate,
  );
  const run = detectExceptions(smallWellSeries(), {});
  const series = smallWellSeries()[0];
  const asOfDay = dayOf(series.points[series.points.length - 1].date);
  const win = widenedWindows(seriesCadenceDays(series.points));
  const recent = windowRead(series.points, 'oil', asOfDay - win.recentDays, asOfDay);
  const base = windowRead(
    series.points, 'oil', asOfDay - win.recentDays - win.baselineDays, asOfDay - win.recentDays,
  );
  return {
    provenance: 'derived',
    baselineOil: base.mean,
    recentOil: recent.mean,
    theOilActuallyFellByPct: dropPct(recent.mean, base.mean),
    rateDropTrigger: DEFAULT_SURVEILLANCE_SETTINGS.rateDropPct,
    minOilRate: DEFAULT_SURVEILLANCE_SETTINGS.minOilRate,
    exceptionsRaisedAtTheDefault: atDefault.exceptionsRaised,
    rateDropRaisedAtTheDefault: atDefault.rateDropRaised,
    watercutRiseRaisedAtTheDefault: atDefault.watercutRiseRaised,
    theWatercutMessage: (run.exceptions.find((e) => e.type === 'watercut_rise') || {}).message || null,
    theWellIsTooSmallToHaveItsRateCollapseReportedAndStillRaisesAHighWatercut:
      !atDefault.rateDropRaised && atDefault.watercutRiseRaised,
  };
});

/** A well below the minimum rate that stops altogether raises nothing at all. */
export const stoppedWellRows = () => [
  ['a small well, baseline 3.4 stb/d, fully shut recent week', 3.4],
  ['the SAME rows scaled to a baseline of 840 stb/d', 840],
].map(([label, baseline]) => {
  const well = { id: `w-stop-${baseline}`, name: `STOP-${baseline}`, well_type: 'producer' };
  const rows = teachingDates().map((date, i) => {
    const back = teachingDates().length - 1 - i;
    const recent = back < 7;
    return {
      well, well_id: well.id, prod_date: date,
      hours_on: recent ? 0 : 24,
      oil_stb: recent ? 0 : baseline,
      water_stb: recent ? 0 : baseline * 0.3,
      gas_mscf: recent ? 0 : baseline * 0.5,
      winj_stb: 0, ginj_mscf: 0,
    };
  });
  const run = detectExceptions(buildWellSeries(rows));
  return {
    provenance: 'derived',
    label,
    baselineOil: baseline,
    aboveTheMinimumRateGate: baseline >= DEFAULT_SURVEILLANCE_SETTINGS.minOilRate,
    exceptionsRaised: run.exceptions.length,
    raised: run.exceptions.map((e) => `${e.severity} ${e.type}`).join('; ') || 'nothing at all',
    shutInRaised: run.exceptions.some((e) => e.type === 'shut_in'),
    downtimeRaised: run.exceptions.some((e) => e.type === 'downtime'),
  };
});

/** The downtime test refuses at exactly zero hours, which is a well shut all week. */
export const DOWNTIME_BOUNDARY_HOURS = Object.freeze([24, 16, 12, 11.99, 6, 1, 0.1, 0]);

export const downtimeBoundaryRows = (hours = DOWNTIME_BOUNDARY_HOURS) => hours.map((h) => {
  const well = { id: `w-dt-${h}`, name: `DT-${h}`, well_type: 'producer' };
  const rows = teachingDates().map((date, i) => {
    const back = teachingDates().length - 1 - i;
    const recent = back < 7;
    const oil = recent ? 240 : 900;
    return {
      well, well_id: well.id, prod_date: date,
      hours_on: recent ? h : 24,
      oil_stb: oil, water_stb: recent ? oil * 2.2 : oil * 0.35, gas_mscf: oil * 0.5,
      winj_stb: 0, ginj_mscf: 0,
    };
  });
  const run = detectExceptions(buildWellSeries(rows));
  return {
    provenance: 'derived',
    recentHours: h,
    belowTheThreshold: h < DEFAULT_SURVEILLANCE_SETTINGS.downtimeHours,
    aboveZero: h > 0,
    downtimeRaised: run.exceptions.some((e) => e.type === 'downtime'),
    downtimeSeverity: (run.exceptions.find((e) => e.type === 'downtime') || {}).severity || 'none',
    raised: run.exceptions.map((e) => `${e.severity} ${e.type}`).join('; ') || 'none',
    theOneValueTheCheckRefusesToReport: h === 0,
  };
});

/** stale_data returns early and cannot exceed medium. */
export const STALE_GAP_SWEEP = Object.freeze([7, 8, 14, 15, 16, 30, 60, 120, 400]);

export const staleSeverityRows = (gaps = STALE_GAP_SWEEP) => {
  const staleDays = DEFAULT_SURVEILLANCE_SETTINGS.staleDays;
  const anchor = { id: 'w-anchor', name: 'ANCHOR-1', well_type: 'producer' };
  const quiet = { id: 'w-quiet', name: 'QUIET-1', well_type: 'producer' };
  const lastDay = dayOf(TEACHING_AS_OF);
  return gaps.map((gap) => {
    const rows = [];
    for (let i = 59; i >= 0; i -= 1) {
      rows.push({
        well: anchor, well_id: anchor.id, prod_date: isoOfDay(lastDay - i), hours_on: 24,
        oil_stb: 900, water_stb: 300, gas_mscf: 450, winj_stb: 0, ginj_mscf: 0,
      });
    }
    for (let i = 0; i < 40; i += 1) {
      rows.push({
        well: quiet, well_id: quiet.id, prod_date: isoOfDay(lastDay - gap - i), hours_on: 24,
        oil_stb: 700, water_stb: 200, gas_mscf: 350, winj_stb: 0, ginj_mscf: 0,
      });
    }
    const run = detectExceptions(buildWellSeries(rows));
    const own = run.exceptions.filter((e) => e.wellName === 'QUIET-1');
    const stale = own.find((e) => e.type === 'stale_data') || null;
    return {
      provenance: 'derived',
      gapDays: gap,
      staleDays,
      doublingAt: staleDays * 2,
      staleRaised: Boolean(stale),
      severity: stale ? stale.severity : 'none',
      value: stale ? stale.value : null,
      baseline: stale ? stale.baseline : null,
      exceptionsOnThatWell: own.length,
      everyOtherComparisonOnThatWellWasSkipped: Boolean(stale) && own.length === 1,
      itCannotExceedMedium: !stale || stale.severity !== 'high',
    };
  });
};

/** A clause that can never be true, proved by construction rather than by argument. */
export const UNREACHABLE_CLAUSE_CASES = Object.freeze([
  Object.freeze([0, 0]),
  Object.freeze([0, 100]),
  Object.freeze([3, 0]),
  Object.freeze([3, 100]),
  Object.freeze([900, 500]),
]);

export const unreachableClauseRows = (cases = UNREACHABLE_CLAUSE_CASES) => cases.map(([oil, gas]) => {
  const points = Array.from({ length: 40 }, (_, i) => derivePoint({
    prod_date: isoOfDay(dayOf('2024-01-01') + i),
    oil_stb: oil, water_stb: 100, gas_mscf: gas, hours_on: 24,
  }));
  const withGor = points.filter((p) => Number.isFinite(p.gor)).length;
  const withOil = points.filter((p) => Number.isFinite(p.oil)).length;
  return {
    provenance: 'derived',
    oilStb: oil,
    gasMscf: gas,
    pointsWithAFiniteGor: withGor,
    pointsWithAFiniteOil: withOil,
    aWindowWithAGorAndNoOil: withGor > 0 && withOil === 0,
    theEscapeHatchCouldFire: withGor > 0 && withOil === 0,
  };
});

export const unreachableClauseHeadline = memoize(() => {
  const rows = unreachableClauseRows();
  return {
    provenance: 'derived',
    constructionsTried: rows.length,
    constructionsInWhichTheEscapeHatchCouldFire:
      rows.filter((r) => r.theEscapeHatchCouldFire).length,
    theClause: 'gorRecent.count && gorBase.count && gorBase.mean > 0 && (base.mean == null || base.mean >= minOilRate)',
    whyItIsUnreachable: 'derivePoint sets oil with a falsy coercion, so oil is always a finite number on every point. The baseline is the mean of oil over the SAME window, so it is null only when the window holds no points at all, and in that case the gas-oil ratio count is zero and the gate has already shut two clauses earlier.',
    itIsProvedByConstructionRatherThanByArgument: true,
  };
});

/** The same absent hours column, read by two modules that disagree about it. */
export const HOURS_SPELLINGS_ACROSS_MODULES = Object.freeze([
  Object.freeze(['24 as a number', 24]),
  Object.freeze(['0', 0]),
  Object.freeze(['null', null]),
  Object.freeze(['the undefined spelling', undefined]),
  Object.freeze(['not a number', NaN]),
  Object.freeze(['the string "20"', '20']),
  Object.freeze(['the empty string', '']),
]);

export const hoursAcrossModulesRows = (sweep = HOURS_SPELLINGS_ACROSS_MODULES) => {
  const well = { id: 'x-1', name: 'CROSS-1', well_type: 'producer' };
  const tests = [{
    id: 'xt-1', well_id: 'x-1', test_date: '2024-02-01',
    oil_rate_stbd: 1000, water_rate_stbd: 0, gas_rate_mscfd: 0, is_valid: true,
  }];
  const totals = [{ total_date: '2024-03-01', oil_stb: 1000, water_stb: 0, gas_mscf: 0 }];
  return sweep.map(([label, hours]) => {
    const row = {
      well, well_id: well.id, prod_date: '2024-03-01',
      oil_stb: 800, water_stb: 200, gas_mscf: 400, winj_stb: 0, ginj_mscf: 0, hours_on: hours,
    };
    const p = derivePoint(row);
    const a = computeAllocation({
      wells: [well], tests, ledger: [row], totals, settings: {},
    });
    const entry = a.days[0].entries[0] || null;
    return {
      provenance: 'derived',
      label,
      surveillanceHoursOn: p.hoursOn,
      surveillanceOilPd: finiteOrNull(p.oilPd),
      surveillanceReading: p.hoursOn === null ? 'uptime UNKNOWN, the volume left unscaled'
        : p.oilPd === null ? 'shut in, the rate refused' : 'a scaled producing-day rate',
      allocationUptime: entry ? entry.uptime : null,
      allocationTheoreticalOil: entry ? entry.theoretical.oil : null,
      allocationReading: entry && entry.uptime === 1 && p.hoursOn === null
        ? 'TWENTY-FOUR HOURS ON, and a full share' : 'the hours as filed',
      theSameNumberIsNotTheSameClaim: p.hoursOn === null && Boolean(entry) && entry.uptime === 1,
      aNumericStringReachesNeitherReading: typeof hours === 'string',
    };
  });
};

/** The four coercion conventions, one line of source each. */
export const coercionConventionRows = () => [
  ['surveillance.derivePoint', 'row.oil_stb || 0', 'an absent volume is ZERO, and so is a numeric STRING, which is neither a number nor zero.'],
  ['surveillance.derivePoint', 'Number.isFinite(row.hours_on) ? ... : null', 'an absent hours column is UPTIME UNKNOWN.'],
  ['allocation.computeAllocation', 'Number.isFinite(row.hours_on) ? ... : 24', 'the same absent column is A FULL DAY ON.'],
  ['liftScreening.screenLift', 'Number(x) || 0 and inputs?.x !== false', 'an absent number is ZERO and an absent BOOLEAN is TRUE, so a missing number reads as the worst possible well and a missing boolean as the best possible facility.'],
  ['liftAdvisor.num', 'a fallback per call site, 32 for an API', 'an absent API is a 32 degree oil, and a STATED zero is taken literally.'],
].map(([fn, source, meaning]) => ({ fn, source, meaning, provenance: 'derived' }));

/**
 * THE LIFT HANDOFF. liftScreening documents its targetRate as bbl/d of LIQUID;
 * liftAdvisor uses the identical input as the OIL design rate. The shipped
 * studio passes ONE number to both.
 */
export const publishedScreeningSeam = () => {
  const s = screeningGolden.seams.targetRateOilVersusLiquid;
  const asOil = screenLift({
    api: 32, bhtF: 200, depthFt: 8000, gor: 600, targetRate: s.oilRate, wctPct: s.wctPct,
  });
  const asLiquid = screenLift({
    api: 32, bhtF: 200, depthFt: 8000, gor: 600, targetRate: s.liquidRate, wctPct: s.wctPct,
  });
  return {
    provenance: 'golden',
    note: s.note,
    oilRateBpd: s.oilRate,
    wctPct: s.wctPct,
    liquidRateBpd: s.liquidRate,
    asOilScores: s.asOilScores,
    asLiquidScores: s.asLiquidScores,
    asOilOrder: s.asOilOrder,
    asLiquidOrder: s.asLiquidOrder,
    asOilRecommended: s.asOilRecommended,
    asLiquidRecommended: s.asLiquidRecommended,
    engineReproducesTheOilReading:
      asOil.every((r) => r.score === s.asOilScores[r.id]),
    engineReproducesTheLiquidReading:
      asLiquid.every((r) => r.score === s.asLiquidScores[r.id]),
    deltas: Object.fromEntries(
      Object.keys(s.asOilScores).map((k) => [k, s.asLiquidScores[k] - s.asOilScores[k]]),
    ),
    theRecommendationSetIsTheSameAndTheOrderIsNot:
      JSON.stringify(s.asOilRecommended) === JSON.stringify(s.asLiquidRecommended)
      && JSON.stringify(s.asOilOrder) !== JSON.stringify(s.asLiquidOrder),
    theGoldenPublishesTheDisagreementRatherThanResolvingIt: true,
  };
};

const teachingLiftModel = () => ({
  phase: 'oil',
  tvdMax: TEACHING_LIFT_DEPTH_FT,
  tAt: (t) => 96 + (232 - 96) * (t / TEACHING_LIFT_DEPTH_FT),
  trajectory: {
    points: [
      { md: 0, tvd: 0 }, { md: 3400, tvd: 3400 },
      { md: 6900, tvd: 6600 }, { md: 10600, tvd: TEACHING_LIFT_DEPTH_FT },
    ],
    mdMax: 10600,
  },
  vlp: { idIn: 2.441, nodeMd: 10600, whp: 190 },
  fluidModel: { api: 24.6, gor: 640, gasSg: 0.68 },
  ipr: { qmax: 2480 },
});

export const teachingLiftConditions = () => {
  const m = teachingLiftModel();
  return {
    provenance: 'teaching',
    trueVerticalDepthFt: m.tvdMax,
    tubingIdIn: m.vlp.idIn,
    api: m.fluidModel.api,
    gasGravity: m.fluidModel.gasSg,
    wellheadPressurePsia: m.vlp.whp,
    bottomholeTemperatureF: m.tAt(m.tvdMax),
    wellheadTemperatureF: m.tAt(0),
    absoluteOpenFlowStbd: m.ipr.qmax,
  };
};

export const teachingLiftHandoff = memoize(() => {
  const alloc = teachingAllocation();
  const lastDay = alloc.days[alloc.days.length - 1];
  const target = lastDay.entries.find((e) => e.wellId === TEACHING_WELLS.o6.id).allocated.oil;
  const kpi = computeKpis(teachingWellSeries(), teachingFieldSeries(), { windowDays: 7 });
  const wctPct = kpi.watercut * 100;
  const gorScfStb = kpi.gor;
  const glr = plungerWellGlr({ targetRate: target, gorScfStb, wctPct });
  return {
    provenance: 'teaching',
    targetRateBpd: target,
    takenFrom: 'the last allocated day for the uptime well',
    date: lastDay.date,
    wctPct,
    gorScfStb,
    bothFromTheSevenDayFieldKpis: true,
    liquidRateBpd: glr.liquidBpd,
    liquidOverTheNumberHandedOver: glr.liquidBpd / target,
    glrScfBbl: glr.glrScfBbl,
    wctFraction: glr.wctFrac,
    liquidGravityAtThatWatercut: liquidGravity({ api: 24.6, wct: kpi.watercut }),
    dutyIndexOnTheOilRate: (target * TEACHING_LIFT_DEPTH_FT) / 1e6,
    dutyIndexOnTheLiquidRate: (glr.liquidBpd * TEACHING_LIFT_DEPTH_FT) / 1e6,
    dutyIndexBands: [3, 6],
    referenceStageAtTheOilRate: pickReferenceStage(target).id,
    referenceStageAtTheLiquidRate: pickReferenceStage(glr.liquidBpd).id,
    oneNumberIsHandedToTwoModulesThatDisagreeAboutWhichPhaseItIs: true,
  };
});

const teachingScreenBase = () => {
  const h = teachingLiftHandoff();
  return {
    depthFt: TEACHING_LIFT_DEPTH_FT, gor: h.gorScfStb, wctPct: h.wctPct,
    api: 24.6, bhtF: 232, isDeviated: true,
  };
};

export const teachingScreeningRows = memoize(() => {
  const h = teachingLiftHandoff();
  const base = teachingScreenBase();
  const cases = [
    ['read as OIL', screenLift({ ...base, targetRate: h.targetRateBpd })],
    ['read as LIQUID', screenLift({ ...base, targetRate: h.liquidRateBpd })],
    ['read as OIL with no API stated', screenLift({
      depthFt: base.depthFt, gor: base.gor, wctPct: base.wctPct, bhtF: base.bhtF,
      isDeviated: true, targetRate: h.targetRateBpd,
    })],
  ];
  return cases.map(([label, res]) => ({
    provenance: 'teaching',
    label,
    scores: Object.fromEntries(res.map((r) => [r.id, r.score])),
    order: res.map((r) => r.id),
    recommended: res.filter((r) => r.recommended).map((r) => r.id),
    recommendedCount: res.filter((r) => r.recommended).length,
    theBandCanBeEmptyAndNothingInTheReturnSaysSo:
      res.filter((r) => r.recommended).length === 0,
  }));
});

/** The rate read two ways, swept across the bands the rules use. */
export const RATE_PHASE_SWEEP = Object.freeze([120, 200, 260, 310, 364, 400, 460, 500, 650, 900, 1240]);

export const ratePhaseSweepRows = (rates = RATE_PHASE_SWEEP) => {
  const h = teachingLiftHandoff();
  const base = teachingScreenBase();
  return rates.map((oilRate) => {
    const glr = plungerWellGlr({
      targetRate: oilRate, gorScfStb: h.gorScfStb, wctPct: h.wctPct,
    });
    const asOil = screenLift({ ...base, targetRate: oilRate });
    const asLiquid = screenLift({ ...base, targetRate: glr.liquidBpd });
    const so = Object.fromEntries(asOil.map((r) => [r.id, r.score]));
    const sl = Object.fromEntries(asLiquid.map((r) => [r.id, r.score]));
    const deltas = Object.fromEntries(Object.keys(so).map((k) => [k, sl[k] - so[k]]));
    const moved = Object.entries(deltas).filter(([, v]) => v !== 0);
    return {
      provenance: 'teaching',
      oilRateBpd: oilRate,
      liquidRateBpd: glr.liquidBpd,
      asOilScores: so,
      asLiquidScores: sl,
      deltas,
      methodsThatMoved: moved.map(([k]) => k),
      largestMoveMethod: moved.length
        ? moved.reduce((a, b) => (Math.abs(b[1]) > Math.abs(a[1]) ? b : a))[0] : null,
      largestMovePoints: moved.length
        ? moved.reduce((a, b) => (Math.abs(b[1]) > Math.abs(a[1]) ? b : a))[1] : 0,
      recommendedAsOil: asOil.filter((r) => r.recommended).map((r) => r.id),
      recommendedAsLiquid: asLiquid.filter((r) => r.recommended).map((r) => r.id),
      notOneDatumAboutTheWellChanged: true,
    };
  });
};

export const ratePhaseHeadline = memoize(() => {
  const rows = ratePhaseSweepRows();
  const movers = new Set();
  let worst = { points: 0, method: null, rate: null };
  rows.forEach((r) => {
    r.methodsThatMoved.forEach((m) => movers.add(m));
    if (Math.abs(r.largestMovePoints) > Math.abs(worst.points)) {
      worst = { points: r.largestMovePoints, method: r.largestMoveMethod, rate: r.oilRateBpd };
    }
  });
  return {
    provenance: 'teaching',
    ratesSwept: rows.length,
    methodsInTheMatrix: LIFT_METHODS.length,
    methodsThatMoveSomewhere: movers.size,
    largestSingleMovePoints: worst.points,
    largestSingleMoveMethod: worst.method,
    largestSingleMoveAtOilRateBpd: worst.rate,
    rowsWhereNothingMoved: rows.filter((r) => r.methodsThatMoved.length === 0).length,
    dutyIndexReachesThreeAtBpd: (3 * 1e6) / TEACHING_LIFT_DEPTH_FT,
    dutyIndexReachesSixAtBpd: (6 * 1e6) / TEACHING_LIFT_DEPTH_FT,
    theDeltasColumnIsTheFinding: true,
  };
});

/** Two coercion conventions for one quantity, two files apart. */
export const API_COERCION_SWEEP = Object.freeze([
  Object.freeze(['the undefined spelling', undefined]),
  Object.freeze(['null', null]),
  Object.freeze(['a stated zero', 0]),
  Object.freeze(['10', 10]),
  Object.freeze(['24.6', 24.6]),
  Object.freeze(['32', 32]),
  Object.freeze(['45', 45]),
]);

export const apiCoercionRows = (sweep = API_COERCION_SWEEP) => sweep.map(([label, api]) => {
  const scores = Object.fromEntries(screenLift({
    api, bhtF: 200, depthFt: 8000, gor: 600, targetRate: 800, wctPct: 50,
  }).map((r) => [r.id, r.score]));
  return {
    provenance: 'derived',
    label,
    apiStated: api === undefined ? null : api,
    liquidGravityAtZeroWatercut: liquidGravity({ api, wct: 0 }),
    denserThanWater: liquidGravity({ api, wct: 0 }) > 1,
    espScore: scores.esp,
    pcpScore: scores.pcp,
    rodPumpScore: scores.rodPump,
    screenLiftReadsAnAbsentApiAsZero: api === undefined || api === null,
    liftAdvisorReadsAnAbsentApiAsThirtyTwo: api === undefined || api === null,
  };
});

/** Screening on no information at all. */
export const emptyScreeningHeadline = () => {
  const res = screenLift({});
  const stated = screenLift({ powerAvailable: false, gasAvailable: false });
  return {
    provenance: 'golden',
    scores: Object.fromEntries(res.map((r) => [r.id, r.score])),
    order: res.map((r) => r.id),
    recommended: res.filter((r) => r.recommended).map((r) => r.id),
    publishedScores: Object.fromEntries(screeningGolden.emptyInput.map((r) => [r.id, r.score])),
    engineReproducesThePublishedCase: res.every(
      (r) => r.score === (screeningGolden.emptyInput.find((g) => g.id === r.id) || {}).score,
    ),
    scoresWithPowerAndGasStatedAbsent: Object.fromEntries(stated.map((r) => [r.id, r.score])),
    theMissingNumbersReadAsTheWorstPossibleWell: true,
    theMissingBooleansReadAsTheBestPossibleFacility: true,
    theTwoDominantDeductionsAreTheTwoSilenceCanNeverTrigger: true,
  };
};

/** A well that suits nothing, where the recommendation band comes back empty. */
export const emptyBandHeadline = () => {
  const res = screenLift({
    depthFt: 16000, bhtF: 360, api: 8, gor: 40, targetRate: 30, wctPct: 96,
    hasSand: true, isHorizontal: true, isOffshore: true, isDeviated: true,
    powerAvailable: false, gasAvailable: false, reservoirPressureLow: true,
  });
  return {
    provenance: 'derived',
    scores: Object.fromEntries(res.map((r) => [r.id, r.score])),
    topScore: res[0].score,
    recommendedCount: res.filter((r) => r.recommended).length,
    methods: res.length,
    theBandIsScoreAtLeastTopLessFifteenAndAboveFifty: true,
    theCallerGetsARankedListWithNoAnswerInIt:
      res.filter((r) => r.recommended).length === 0,
    theScoreIsClampedToZeroSoAPrintedZeroMeansAtOrBelowZero: true,
    nothingInTheReturnSaysTheBandIsEmpty: true,
  };
};

/** What a model-driven screening never fills in. */
export const modelScreeningRows = () => {
  const model = teachingLiftModel();
  const withFluid = screeningInputsFromModel(model, { targetRate: 800, wctPct: 50 });
  const bare = { ...model, fluidModel: undefined };
  const withoutFluid = screeningInputsFromModel(bare, { targetRate: 800, wctPct: 50 });
  const score = (inputs) => Object.fromEntries(screenLift(inputs).map((r) => [r.id, r.score]));
  return [
    ['with a fluid description', withFluid],
    ['with NO fluid description', withoutFluid],
  ].map(([label, inputs]) => ({
    provenance: 'derived',
    label,
    statedKeys: Object.keys(inputs).filter((k) => inputs[k] !== undefined).sort(),
    unstatedConditions: ['isOffshore', 'hasSand', 'isHorizontal', 'powerAvailable',
      'gasAvailable', 'reservoirPressureLow'].length,
    apiStated: inputs.api !== undefined,
    gorStated: inputs.gor !== undefined,
    scores: score(inputs),
    recommended: screenLift(inputs).filter((r) => r.recommended).map((r) => r.id),
    everyUnstatedConditionDefaultsToTheFavourableReading: true,
  }));
};

/** The design pass on the teaching well, and the four refusals it prints. */
export const teachingDesignPass = memoize(() => {
  const h = teachingLiftHandoff();
  const pass = runDesignPass({
    model: teachingLiftModel(),
    targetRate: h.targetRateBpd,
    wctPct: h.wctPct,
    gorScfStb: h.gorScfStb,
    whp: 190,
    facility: {},
    chain: {},
  });
  const screening = screenLift({ ...teachingScreenBase(), targetRate: h.targetRateBpd });
  const rec = reconcile({ screening, designPass: pass });
  return {
    provenance: 'teaching',
    passOk: pass.ok,
    methods: pass.results.length,
    results: pass.results.map((r) => ({
      id: r.id,
      ok: r.ok,
      reason: r.reason || null,
      itSaysNothingAboutTheWell: /No .* design chain was supplied/.test(r.reason || ''),
    })),
    verdicts: Object.fromEntries(rec.rows.map((r) => [r.id, r.verdict])),
    workable: rec.workable.length,
    disagreements: rec.disagreements.length,
    ranked: rec.ranked.map((r) => r.id),
    threeRefusalsAreTheSameSentenceAndMeanOnlyThatNoChainWasInjected:
      pass.results.filter((r) => /design chain was supplied/.test(r.reason || '')).length,
    everyVerdictHereIsAStatementAboutTheAdvisorCallAndNotAboutTheWell: true,
  };
});

/** The reconciliation truth table, and the sixth name no input can produce. */
export const truthTableRows = () => advisorGolden.truthTable.map((r, i) => ({
  provenance: 'golden',
  index: i + 1,
  hasEngine: r.hasEngine,
  hasDesign: r.hasDesign,
  designOk: r.designOk,
  recommended: r.recommended,
  verdict: r.verdict,
}));

export const reconcileHeadline = () => {
  const verdicts = [...new Set(advisorGolden.truthTable.map((r) => r.verdict))];
  return {
    provenance: 'golden',
    rows: advisorGolden.truthTable.length,
    distinctVerdicts: verdicts.length,
    verdicts,
    theInitialValueIsASixthNameNoInputCanProduce: true,
    theDeadInitialValue: 'screened',
    notRunIsTheOneVerdictWithNoNoteAttached: true,
    andItIsTheOneAReaderMostNeedsASentenceFor: true,
  };
};

/** The plunger gas-liquid ratio, where a water cut is clamped rather than refused. */
export const PLUNGER_WCT_SWEEP = Object.freeze([0, 25, 50, 75, 90, 95, 99, 99.9, 100, 120, -10]);

export const plungerClampRows = (sweep = PLUNGER_WCT_SWEEP, targetRate = 260, gorScfStb = 1450) => sweep.map((wctPct) => {
  const g = plungerWellGlr({ targetRate, gorScfStb, wctPct });
  return {
    provenance: 'derived',
    wctPctStated: wctPct,
    wctFractionUsed: g.wctFrac,
    liquidBpd: g.liquidBpd,
    glrScfBbl: g.glrScfBbl,
    itWasClamped: wctPct >= 100 || wctPct < 0,
    theClampIsSilent: true,
    noFlagInTheReturnSaysAStatedConditionWasOverwritten: true,
  };
});

/** The published plunger cases, so the clamp can be read against a golden. */
export const publishedPlungerRows = () => advisorGolden.plungerGlr.map((c, i) => {
  const g = plungerWellGlr({
    targetRate: c.targetRate, gorScfStb: c.gorScfStb, wctPct: c.wctPct,
  });
  return {
    provenance: 'golden',
    index: i + 1,
    targetRate: c.targetRate,
    gorScfStb: c.gorScfStb,
    wctPct: c.wctPct,
    publishedWctFrac: c.wctFrac,
    publishedLiquidBpd: c.liquidBpd,
    publishedGlrScfBbl: c.glrScfBbl,
    engineWctFrac: g.wctFrac,
    engineLiquidBpd: g.liquidBpd,
    engineGlrScfBbl: g.glrScfBbl,
    engineReproducesIt: g.glrScfBbl === c.glrScfBbl && g.liquidBpd === c.liquidBpd,
  };
});

/** The motor frame, which falls back to the largest in the catalog and says nothing. */
export const motorFrameRows = () => advisorGolden.motorFrame.sweep.map((probe, i) => {
  const frame = pickMotorFrame(probe.shaftHp);
  return {
    provenance: 'golden',
    index: i + 1,
    shaftHp: probe.shaftHp,
    frameHp: frame ? frame.hp : null,
    frameId: frame ? frame.id : null,
    actualHeadroom: frame ? frame.hp / probe.shaftHp : null,
    headroomRule: advisorGolden.catalog.headroom,
    meetsTheRule: probe.meetsHeadroom,
    overloaded: Boolean(frame) && probe.shaftHp > frame.hp,
    largestFrameHp: advisorGolden.motorFrame.largestFrameHp,
    headroomLostAboveShaftHp: advisorGolden.motorFrame.headroomLostAboveShaftHp,
    itFellBackToTheLargestFrameAndSaidNothing: !probe.meetsHeadroom,
  };
});

/** The reference stage ranges overlap, and catalog order decides inside them. */
export const REFERENCE_DUTY_SWEEP = Object.freeze([
  100, 500, 1250, 1450, 1451, 2200, 2500, 3250, 3499, 3500, 3501, 4000, 5600, 5601, 9800, 50000,
]);

export const referenceStageRows = (duties = REFERENCE_DUTY_SWEEP) => {
  const stages = advisorGolden.catalog.referenceStages;
  return duties.map((qBpd) => {
    const picked = pickReferenceStage(qBpd);
    const nearest = stages.reduce((a, b) => (
      Math.abs(b.bepBpd - qBpd) < Math.abs(a.bepBpd - qBpd) ? b : a
    ));
    return {
      provenance: 'derived',
      dutyBpd: qBpd,
      pickedId: picked ? picked.id : null,
      pickedBepBpd: picked ? picked.bepBpd : null,
      pickedDistance: picked ? Math.abs(picked.bepBpd - qBpd) : null,
      nearestBepId: nearest.id,
      nearestBepDistance: Math.abs(nearest.bepBpd - qBpd),
      theyAgree: Boolean(picked) && picked.id === nearest.id,
      theRangesOverlapAndCatalogOrderDecidesInsideThem: true,
    };
  });
};

// ---------------------------------------------------------------------------
// PANEL FACADES. Each panel reads exactly one of these, so what a panel can
// reach is a list rather than the whole module.
// ---------------------------------------------------------------------------

/** THE LEDGER AND WHAT A ROW MEANS. The Associate panel. */
export const ledgerExplorer = Object.freeze({
  modules: moduleRows,
  settings: settingRows,
  publishedRows: publishedRowRows,
  members: pointMemberRows,
  hoursSweep: hoursSweepRows,
  hoursSpellings: hoursSpellingRows,
  hoursOutOfRange: hoursOutOfRangeRows,
  uptimeRows: uptimeWellRows,
  uptimeHeadline: uptimeWellHeadline,
  ratios: ratioRefusalRows,
  fieldDays: publishedFieldDayRows,
  fieldHeadline: publishedFieldSeriesHeadline,
  onCount: onCountRows,
  orphan: orphanRowHeadline,
  stringAccumulator: stringAccumulatorRows,
  stringRow: stringRowHeadline,
  publishedKpis: publishedKpiRows,
  kpiWindowSweep: kpiWindowSweepRows,
  kpiMembership: kpiMembershipHeadline,
  kpiNullGuard: kpiNullGuardRows,
  kpiEmpty: kpiEmptyRefusal,
  teachingKpis: teachingKpiRows,
  uptimeMembership: uptimeMembershipRows,
  uptimeMembershipHeadline,
  fieldSummary: teachingFieldHeadline,
  teachingWells: teachingWellRows,
  purposes: teachingWellPurposes,
});

/** THE WINDOWED READING AND WHAT IT FIRES. The Professional panel. */
export const exceptionExplorer = Object.freeze({
  windows: windowArithmeticRows,
  seamWindow: publishedSeamWindow,
  widening: wideningRows,
  cadences: publishedCadenceRows,
  cadenceGaps: cadenceGapRows,
  monthlyRows: monthlyPeriodRows,
  monthlyHeadline: monthlyPeriodHeadline,
  publishedMonthly: publishedMonthlyRows,
  windowMeans: windowMeanRows,
  twoReadings: twoReadingsHeadline,
  uptimeRows: uptimeWellRows,
  ladder: severityLadderRows,
  ladderHeadline: severityLadderHeadline,
  publishedExceptions: publishedExceptionRows,
  teachingExceptions: teachingExceptionRows,
  teachingExceptionHeadline,
  wellTypes: wellTypeRows,
  settingsSweep: settingsSweepRows,
  settingsSweepKeys: () => Object.keys(SETTINGS_SWEEPS),
  publishedTestInForce: publishedTestInForceRows,
  ageGuard: ageGuardRows,
  ageGuardHeadline,
  maxTestAgeSweep: maxTestAgeSweepRows,
  maxTestAgeHeadline,
  groupTests: groupTestsRows,
  teachingTests: teachingTestRows,
  teachingTestInForce: teachingTestInForceRows,
  publishedQc: publishedQcRows,
  qcCoverage: qcCoverageHeadline,
  teachingQc: teachingQcRows,
  outlierReach: outlierReachRows,
  publishedAllocation: publishedAllocationRows,
  closure: closureRows,
  noBasis: noBasisHeadline,
  allocationDays: teachingAllocationDayRows,
  allocationWells: teachingAllocationWellRows,
  allocationHeadline: teachingAllocationHeadline,
  missingRow: missingRowRows,
  quietWell: quietWellRows,
  quietWellHeadline,
  publishedImbalance: publishedImbalanceRows,
  teachingImbalance: teachingImbalanceRows,
  monthlyFactors: teachingMonthlyFactorRows,
  nothingToScale: nothingToScaleHeadline,
  writeBack: allocatedLedgerHeadline,
  factorBand: factorBandRows,
  publishedDeferments: publishedDefermentHeadline,
  defermentCategories: publishedDefermentCategoryRows,
  defermentDays: defermentDayRows,
  defermentAnchors: defermentAnchorRows,
  wallClock: wallClockHeadline,
  teachingDeferments: teachingDefermentRows,
});

/** WHAT A NUMBER IS WORTH ONCE YOU KNOW WHICH COLUMN IT CAME FROM. The Expert panel. */
export const readingExplorer = Object.freeze({
  publishedSeam: publishedSeamHeadline,
  seamReaders: seamReaderRows,
  teachingSeam: teachingSeamHeadline,
  dayShapes: seamDayShapeRows,
  collapse: seamCollapseHeadline,
  seamSweep: seamSweepRows,
  seamSweepHeadline,
  publishedDecline: publishedDeclineRows,
  bGuard: bGuardRows,
  bGuardHeadline,
  negativeB: negativeBRows,
  diGuard: diGuardRows,
  fitSeries: fitSeriesRows,
  teachingDecline: teachingDeclineRows,
  fitRefusals: fitRefusalRows,
  decimate: decimateRows,
  decimateHeadline,
  minOilRateSweep: minOilRateSweepRows,
  minOilRateHeadline,
  stoppedWell: stoppedWellRows,
  downtimeBoundary: downtimeBoundaryRows,
  staleSeverity: staleSeverityRows,
  unreachable: unreachableClauseRows,
  unreachableHeadline: unreachableClauseHeadline,
  hoursAcrossModules: hoursAcrossModulesRows,
  coercion: coercionConventionRows,
  publishedScreeningSeam,
  liftConditions: teachingLiftConditions,
  handoff: teachingLiftHandoff,
  teachingScreening: teachingScreeningRows,
  ratePhaseSweep: ratePhaseSweepRows,
  ratePhaseHeadline,
  apiCoercion: apiCoercionRows,
  emptyScreening: emptyScreeningHeadline,
  emptyBand: emptyBandHeadline,
  modelScreening: modelScreeningRows,
  designPass: teachingDesignPass,
  truthTable: truthTableRows,
  reconcileHeadline,
  plungerClamp: plungerClampRows,
  publishedPlunger: publishedPlungerRows,
  motorFrames: motorFrameRows,
  referenceStages: referenceStageRows,
  ladder: severityLadderRows,
});

/** What these four modules do not do, stated rather than implied. */
export const limits = () => [
  'Surveillance never measures a well. It compares a well against a reading of itself over a window, so the output is always "this well changed" and never "this well is bad".',
  'Nothing in a ledger row says how long the row covers, so a month of production read by derivePoint is a calendar day with a daily rate printed after it.',
  'The exception engine reads the CALENDAR volume and never the producing-day rate, so a well whose performance is flat and whose hours halved is reported as a rate problem.',
  'A severity is not a measurement. high, medium and info are the names of two threshold crossings, and the thresholds are settings a caller chose.',
  'The allocation splits a metered total. It does not measure a well, and a well that filed no ledger row at all is credited with a full day on stream.',
  'There is no closure figure anywhere in the allocation return, so a consumer that wants to know whether the field closed has to subtract the two totals itself.',
  'The screening matrix derives nothing from anything. It is a checklist with a number attached, and its score is a ranking device rather than a probability.',
  'The design pass reports a method it was given no chain for as a failure, in a sentence that says nothing whatever about the well.',
  'There is no economics here. A barrel credited to a well by an allocation is a booking and not a measurement.',
];

/** What the four oracles cover, and where they stop. */
export const oracleCoverage = () => ({
  provenance: 'derived',
  publishedLedgerRows: surveillanceGolden.ledger.length,
  publishedFieldDays: surveillanceGolden.fieldSeries.length,
  publishedExceptions: surveillanceGolden.exceptions.exceptions.length,
  publishedAllocatedDays: allocationGolden.allocation.grand.days,
  publishedTestInForceProbes: allocationGolden.testInForce.length,
  publishedArchetypes: screeningGolden.archetypes.length,
  publishedTruthTableRows: advisorGolden.truthTable.length,
  theFourIndependentRoutes: [
    'the surveillance oracle does every date arithmetic on the CALENDAR where the module counts epoch-millisecond day numbers, and measures effective decline through the Arps rate law where the module evaluates a closed form',
    'the allocation oracle splits the metered total as a SHARE where the module multiplies by a precomputed factor, and bisects into explicit validity intervals where the module scans and breaks',
    'the screening oracle re-expresses every rule as a declarative penalty ledger walked by one generic scorer with no branch on a method anywhere',
    'the advisor oracle takes the reference stage as a covering SET and the reconciliation as a full four-way truth table',
  ],
  whatTheyDoNotGate: [
    'which of two functions a caller should have used',
    'what a missing column means',
    'what a refusal sentence says',
  ],
  theTwoSeamsTheGoldensPublishAsDisagreements: [
    'surveillance_cases.ratioSeam',
    'lift_screening_cases.seams',
  ],
  publishingADisagreementRatherThanResolvingItIsTheRightThingToHaveDone: true,
});

// ---------------------------------------------------------------------------
// GUARD SUPPORT. Everything this lab can put on a screen, flattened, so the
// capstone guard can check every one of them against the graded field list
// without knowing what any of them means.
// ---------------------------------------------------------------------------

const flattenInto = (label, value, out, depth = 0) => {
  if (value === null || value === undefined || depth > 6) return;
  if (typeof value === 'number') {
    if (Number.isFinite(value)) out.push({ label, value });
    return;
  }
  if (typeof value === 'boolean' || typeof value === 'string') return;
  if (Array.isArray(value)) {
    value.forEach((v, i) => flattenInto(`${label}[${i}]`, v, out, depth + 1));
    return;
  }
  if (typeof value === 'object') {
    Object.keys(value).forEach((k) => flattenInto(`${label}.${k}`, value[k], out, depth + 1));
  }
};

/** Every number this lab exposes, with a label saying where it came from. */
export const teachingQuantities = () => {
  const out = [];
  const add = (label, fn) => {
    try {
      flattenInto(label, fn(), out);
    } catch {
      // an accessor that refuses is still an accessor that leaks nothing
    }
  };
  [ledgerExplorer, exceptionExplorer, readingExplorer].forEach((facade, i) => {
    const name = ['ledgerExplorer', 'exceptionExplorer', 'readingExplorer'][i];
    Object.keys(facade).forEach((key) => {
      add(`${name}.${key}`, facade[key]);
    });
  });
  Object.keys(SETTINGS_SWEEPS).forEach((k) => add(`settingsSweepRows(${k})`, () => settingsSweepRows(k)));
  add('teachingFieldHeadline', teachingFieldHeadline);
  add('teachingWellRows', teachingWellRows);
  add('teachingAllocationHeadline', teachingAllocationHeadline);
  add('teachingImbalanceRows', teachingImbalanceRows);
  add('teachingMonthlyFactorRows', teachingMonthlyFactorRows);
  add('oracleCoverage', oracleCoverage);
  add('severityLadderRows', severityLadderRows);
  add('settingRows', settingRows);
  return out;
};

/** The same set as bare numbers, which is what the leak guard measures. */
export const teachingNumbers = () => teachingQuantities().map((q) => q.value);
