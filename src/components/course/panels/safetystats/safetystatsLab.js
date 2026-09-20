// THE H1 TEACHING LAB: Safety Performance Statistics & KPIs.
//
// Every number this lab returns is a return value of the vendored engine
// (packages/engines/engines/hse/safetyStats.js, sha-identical with
// petrolord-engines f123a57) on the teaching streams below, or on the counts
// and hours a learner types into a panel. The teaching streams are the same
// streams the wave's digest generator runs (tools/course-waves/safetystats/
// h1_fields.mjs), and safetystatsLab.test.js asserts they are deep-equal and
// that every number a teaching reader returns is printed in the digest.
//
// THE LAB NEVER READS THE CAPSTONE. It holds no graded answer, no tolerance and
// no capstone workplace, and panelCapstoneGuard.test.js greps this file, the
// three panels and the learning page for every rendering of all eighteen
// answers and every capstone name and input.
//
// NO REFUSAL MESSAGE IS WRITTEN HERE. A panel that shows a refusal shows the
// engine's own `error` string, so the lesson that quotes it and the panel agree.
//
// One convention the engine declines is computed here, labelled DERIVED
// everywhere it appears: the minlike two-sided p-value of R's poisson.test and
// scipy's binomtest, built from binomial terms on the engine's own logGamma.
// The course teaches why the engine uses the central p-value instead, and a
// learner can only see the difference by seeing both.
//
// Nothing here reads a clock, a random number or a locale.
import * as S from '@petrolord/engines/engines/hse/safetyStats.js';

export const BASES = S.RATE_BASES;

const freeze = (o) => Object.freeze(JSON.parse(JSON.stringify(o)));

/* ------------------------------------------------------------ the streams */

export const STREAMS = Object.freeze({
  UGHELLI: freeze({
    hours: 2318640, recordables: 9, dartCases: 4, lostTimeCases: 2, fatalities: 0, daysLost: 96, tier1Pse: 1, tier2Pse: 4,
  }),
  ROSTERS: freeze({
    headcount: 40, dayCrew: { hours: 80000, recordables: 1 }, rotationCrew: { hours: 116480, recordables: 1 },
  }),
  KWALE: freeze({
    sites: ['compression station', 'flow station', 'jetty'],
    counts: [3, 8, 1],
    hours: [512300, 1904760, 61480],
    mothballed: { counts: [3, 8, 1, 0], hours: [512300, 1904760, 61480, 0] },
    eventsWithoutHours: { counts: [3, 8, 1, 1], hours: [512300, 1904760, 61480, 0] },
  }),
  AKASO: freeze({
    counts: [2, 1, 0, 3, 0, 1, 2, 0, 1, 2, 1, 0, 2, 1, 1],
    hours: [212400, 198750, 224310, 205880, 0, 219960, 231040, 208520, 196330, 214670, 18240, 222150, 209880, 201460, 215790],
  }),
  IMO_LADDER: Object.freeze([1, 2, 5, 10, 20, 50, 100]),
  IMO_HOURS_PER_EVENT: 100000,
  COVERAGE_MEANS: Object.freeze([0.5, 1, 2, 3.5, 5, 10, 20]),
  ABO: freeze({ hours: 41300 }),
  ZERO_TARGETS: Object.freeze([2, 1, 0.5, 0.25]),
  ERHA: freeze({ east: { count: 6, hours: 240500 }, west: { count: 11, hours: 902700 } }),
  UTOROGU: freeze({
    north: { count: 7, hours: 355200 }, south: { count: 6, hours: 1048900 }, sweep: { maxCount1: 15, maxCount2: 24 },
  }),
  EGBEMA: freeze({
    counts: [6, 4, 4, 5, 3, 6, 5, 16, 4, 4, 2, 4],
    hours: [402350, 388120, 97230, 296410, 371880, 409930, 398470, 421090, 386940, 384560, 392710, 405240],
    shortMonth: 3,
    interventionMonth: 7,
  }),
  AMUKPE: freeze({
    companyHours: 846200, contractorHours: 1392750, companyRecordables: 4, contractorRecordables: 9, reclassified: 2, daysLost: 58,
  }),
  CONFIDENCES: Object.freeze([0.8, 0.9, 0.95, 0.99]),
});

/* ------------------------------------------------ what a learner can type */

/**
 * A comma, space or newline separated list of numbers, as a learner types it.
 * Returns { values } or { error } naming what could not be read; an empty entry
 * is an error rather than a zero, because a blank is a question and a zero is a
 * statement.
 */
export const parseSeries = (text) => {
  if (typeof text !== 'string' || text.trim() === '') return { error: 'the list is empty' };
  const parts = text.split(/[\s,;]+/).filter((p) => p !== '');
  const values = parts.map(Number);
  const bad = parts.filter((p, i) => !Number.isFinite(values[i]));
  if (bad.length) return { error: `these entries are not numbers: ${bad.join(', ')}` };
  return { values };
};

/** A single number from a text box; a blank box is undefined, never zero. */
export const parseNumber = (text) => {
  if (text === '' || text === null || text === undefined) return undefined;
  const v = Number(text);
  return Number.isFinite(v) ? v : NaN;
};

// The interactive routes are the engine's own functions, unchanged: a panel
// passes what the learner typed and shows what the engine returned, refusals
// included.
export const rateOn = (args) => S.incidenceRate(args);
export const farOf = (args) => S.fatalAccidentRate(args);
export const severityOn = (args) => S.severityRate(args);
export const pseOn = (args) => S.pseRate(args);
export const pooled = (args) => S.pooledRate(args);
export const rolling = (args) => S.rollingRate(args);
export const interval = (args) => S.rateConfidenceInterval(args);
export const compare = (args) => S.compareRates(args);
export const chart = (args) => S.uChart(args);

/**
 * The same chart redrawn with some periods set aside (one-based month
 * numbers). Setting a month aside is the learner's decision; this only redraws.
 */
export const revisedChart = ({ counts, exposureHours, base, setAside }) => {
  const drop = new Set((setAside || []).map((m) => m - 1));
  const keep = (counts || []).map((_, i) => i).filter((i) => !drop.has(i));
  return {
    kept: keep.map((i) => i + 1),
    chart: S.uChart({ counts: keep.map((i) => counts[i]), exposureHours: keep.map((i) => exposureHours[i]), base }),
  };
};

/**
 * Before and after a one-based month, with some months set aside, compared by
 * the engine's conditional exact test (after over before).
 */
export const beforeAfter = ({ counts, exposureHours, splitMonth, setAside, confidence }) => {
  const drop = new Set((setAside || []).map((m) => m - 1));
  const idx = (counts || []).map((_, i) => i).filter((i) => !drop.has(i));
  const before = idx.filter((i) => i < splitMonth - 1);
  const after = idx.filter((i) => i >= splitMonth - 1);
  const tot = (ix, a) => ix.reduce((s, i) => s + a[i], 0);
  const b = { count: tot(before, counts), hours: tot(before, exposureHours), months: before.map((i) => i + 1) };
  const a = { count: tot(after, counts), hours: tot(after, exposureHours), months: after.map((i) => i + 1) };
  return {
    before: b,
    after: a,
    result: S.compareRates({ count1: a.count, exposureHours1: a.hours, count2: b.count, exposureHours2: b.hours, confidence }),
  };
};

/** DERIVED: the rule of three, 3 events times the base over the hours. */
export const ruleOfThree = ({ exposureHours, base }) => (3 * base) / exposureHours;

const lch = (n, k) => S.logGamma(n + 1) - S.logGamma(k + 1) - S.logGamma(n - k + 1);
const bpmf = (n, k, p) => Math.exp(lch(n, k) + k * Math.log(p) + (n - k) * Math.log1p(-p));

/**
 * DERIVED, and the engine declines it: the minlike two-sided p-value, the sum
 * of the probabilities of every count no more likely than the one observed.
 * Returns null where the engine's comparison refuses, so the panel shows the
 * refusal once.
 */
export const minlikePValue = ({ count1, exposureHours1, count2, exposureHours2 }) => {
  const r = S.compareRates({ count1, exposureHours1, count2, exposureHours2, confidence: 0.95 });
  if (r.error) return null;
  const n = count1 + count2;
  const p = r.expectedProportion;
  const d = bpmf(n, count1, p);
  let s = 0;
  for (let j = 0; j <= n; j += 1) { const q = bpmf(n, j, p); if (q <= d * (1 + 1e-7)) s += q; }
  return Math.min(1, s);
};

/* ------------------------------------------------- the teaching readers */

const B2 = BASES.OSHA_200K;
const B6 = BASES.IOGP_1M;
const B8 = BASES.FAR_100M;

/** Associate: one stream on every base, and hours against headcount. */
export const ratesAndBases = () => {
  const U = STREAMS.UGHELLI;
  const onBases = [B2, B6, B8].map((base) => {
    const r = S.incidenceRate({ count: U.recordables, exposureHours: U.hours, base });
    return { base, rate: r.rate, baseLabel: r.basis.baseLabel };
  });
  const classes = [['recordable', U.recordables], ['DART', U.dartCases], ['lost time', U.lostTimeCases]].map(([name, count]) => ({
    name,
    count,
    per200k: S.incidenceRate({ count, exposureHours: U.hours, base: B2 }).rate,
    per1m: S.incidenceRate({ count, exposureHours: U.hours, base: B6 }).rate,
  }));
  const R = STREAMS.ROSTERS;
  const crews = [['day crew', R.dayCrew], ['rotation crew', R.rotationCrew]].map(([name, c]) => ({
    name, hours: c.hours, recordables: c.recordables,
    rate: S.incidenceRate({ count: c.recordables, exposureHours: c.hours, base: B2 }).rate,
  }));
  return {
    onBases,
    classes,
    crews,
    severityRates: [B2, B6].map((base) => ({ base, rate: S.severityRate({ daysLost: U.daysLost, exposureHours: U.hours, base }).rate })),
    pse: [[1, U.tier1Pse, B2], [1, U.tier1Pse, B6], [2, U.tier2Pse, B2], [2, U.tier2Pse, B6]].map(([tier, count, base]) => ({
      tier, count, base, rate: S.pseRate({ tier, pseCount: count, exposureHours: U.hours, base }).rate,
    })),
    noBase: S.incidenceRate({ count: U.recordables, exposureHours: U.hours }),
  };
};

/** Associate: sum then divide over KWALE's sites. */
export const pooling = () => {
  const K = STREAMS.KWALE;
  const r = S.pooledRate({ counts: K.counts, exposureHours: K.hours, base: B2 });
  return {
    sites: K.sites.map((name, i) => ({ name, count: K.counts[i], hours: K.hours[i], rate: r.periodRates[i] })),
    rate: r.rate,
    count: r.count,
    exposureHours: r.exposureHours,
    meanOfPeriodRates: r.meanOfPeriodRates,
    note: r.basis.note,
    eventsWithoutHours: S.pooledRate({ counts: K.eventsWithoutHours.counts, exposureHours: K.eventsWithoutHours.hours, base: B2 }),
  };
};

/** Associate: AKASO's rolling twelve-month windows. */
export const rollingWindows = () => {
  const A = STREAMS.AKASO;
  const r = S.rollingRate({ counts: A.counts, exposureHours: A.hours, base: B2, windowPeriods: 12 });
  return {
    windows: r.windows.map((w) => ({
      from: w.startIndex + 1, to: w.endIndex + 1, count: w.count, exposureHours: w.exposureHours,
      rate: w.rate, meanOfPeriodRates: w.meanOfPeriodRates, periodsWithoutHours: w.periodsWithoutHours,
    })),
    note: r.basis.note,
  };
};

/** Professional: the same observed rate at growing exposure. */
export const intervalLadder = () => STREAMS.IMO_LADDER.map((count) => {
  const hours = count * STREAMS.IMO_HOURS_PER_EVENT;
  const r = S.rateConfidenceInterval({ count, exposureHours: hours, base: B2, confidence: 0.95 });
  return { count, hours, rate: r.rate, lower: r.lower, upper: r.upper };
});

/** Professional: zero events on the ABO hours at every confidence the course prints. */
export const zeroEvents = () => {
  const { hours } = STREAMS.ABO;
  return {
    hours,
    limits: STREAMS.CONFIDENCES.map((confidence) => {
      const r = S.rateConfidenceInterval({ count: 0, exposureHours: hours, base: B2, confidence });
      return { confidence, countUpper: r.countUpper, upper: r.upper, lower: r.lower };
    }),
    ruleOfThree: ruleOfThree({ exposureHours: hours, base: B2 }),
  };
};

/** Professional: ERHA's comparison and UTOROGU's two conventions. */
export const twoRates = () => {
  const E = STREAMS.ERHA;
  const e = S.compareRates({ count1: E.east.count, exposureHours1: E.east.hours, count2: E.west.count, exposureHours2: E.west.hours, confidence: 0.95 });
  const N = STREAMS.UTOROGU;
  const nArgs = { count1: N.north.count, exposureHours1: N.north.hours, count2: N.south.count, exposureHours2: N.south.hours };
  const u = S.compareRates({ ...nArgs, confidence: 0.95 });
  return {
    erha: {
      expectedProportion: e.expectedProportion, lowerTail: e.lowerTail, upperTail: e.upperTail, pValue: e.pValue,
      rateRatio: e.rateRatio, rateRatioLower: e.rateRatioLower, rateRatioUpper: e.rateRatioUpper,
    },
    utorogu: {
      pValue: u.pValue, minlikeDerived: minlikePValue(nArgs), rateRatio: u.rateRatio,
      rateRatioLower: u.rateRatioLower, rateRatioUpper: u.rateRatioUpper,
    },
  };
};

/** Expert: EGBEMA on a u-chart, revised without its flagged month, and before and after. */
export const egbemaChart = () => {
  const G = STREAMS.EGBEMA;
  const c = S.uChart({ counts: G.counts, exposureHours: G.hours, base: B2 });
  const flagged = c.outOfControl.map((i) => i + 1);
  const rev = revisedChart({ counts: G.counts, exposureHours: G.hours, base: B2, setAside: flagged });
  const all = beforeAfter({ counts: G.counts, exposureHours: G.hours, splitMonth: G.interventionMonth, setAside: [], confidence: 0.95 });
  const out = beforeAfter({ counts: G.counts, exposureHours: G.hours, splitMonth: G.interventionMonth, setAside: flagged, confidence: 0.95 });
  const pick = (r) => ({ rateRatio: r.rateRatio, rateRatioLower: r.rateRatioLower, rateRatioUpper: r.rateRatioUpper, pValue: r.pValue });
  return {
    centre: c.centre,
    points: c.points.map((p) => ({
      month: p.index + 1, count: p.count, exposureHours: p.exposureHours, exposureUnits: p.exposureUnits,
      u: p.u, lcl: p.lcl, ucl: p.ucl, lclFloored: p.lclFloored, signal: p.signal,
    })),
    flagged,
    revisedCentre: rev.chart.centre,
    beforeAfterAll: pick(all.result),
    beforeAfterSetAside: pick(out.result),
  };
};

/** Every refusal a panel can show, with the engine's own words. */
export const refusalSamples = () => [
  ['incidenceRate', 'no base', S.incidenceRate({ count: 1, exposureHours: 1000 })],
  ['incidenceRate', 'a fractional count', S.incidenceRate({ count: 1.5, exposureHours: 1000, base: B2 })],
  ['pseRate', 'tier 3', S.pseRate({ tier: 3, pseCount: 1, exposureHours: 1000, base: B2 })],
  ['rateConfidenceInterval', 'confidence as a percentage', S.rateConfidenceInterval({ count: 1, exposureHours: 1000, base: B2, confidence: 95 })],
  ['compareRates', 'both groups empty', S.compareRates({ count1: 0, exposureHours1: 1000, count2: 0, exposureHours2: 1000, confidence: 0.95 })],
  ['uChart', 'a point with no hours', S.uChart({ counts: [1, 0, 2], exposureHours: [1000, 0, 1000], base: B2 })],
].map(([fn, what, r]) => ({ fn, what, field: r.field, error: r.error }));
