// THE TEACHING STREAMS OF THE H1 DIGEST, and the sweeps around them.
//
// THESE ARE NOT THE CAPSTONE WORKPLACES. The capstones run three other
// workplaces on other counts and other hours, no count series, hours figure or
// scenario name is shared between the two files, nothing here imports
// h1_capstone.mjs and nothing there imports this. gate_capstone_leak.mjs proves
// both directions.
//
// Every stream exists to reach a BRANCH of the engine that a lesson has to
// teach, and each one says which. The NextGen teaching lab
// (src/components/course/panels/safetystats/safetystatsLab.js) carries the same
// streams, and its vitest suite asserts they are deep-equal to these.

/** UGHELLI: one site's annual report. The single rates on every base. */
export const UGHELLI = Object.freeze({
  hours: 2318640,
  recordables: 9,
  dartCases: 4,
  lostTimeCases: 2,
  fatalities: 0,
  daysLost: 96,
  tier1Pse: 1,
  tier2Pse: 4,
});

/** Two crews of the SAME headcount on different rosters, one recordable each.
 *  Why hours and never headcount: the rates differ, the headcount ratio does not. */
export const ROSTERS = Object.freeze({
  headcount: 40,
  dayCrew: { hours: 80000, recordables: 1 },
  rotationCrew: { hours: 116480, recordables: 1 },
});

/** KWALE: three sites and one mothballed site. Sum then divide against the
 *  mean of the site rates, and a site with no hours. */
export const KWALE = Object.freeze({
  sites: ['compression station', 'flow station', 'jetty'],
  counts: [3, 8, 1],
  hours: [512300, 1904760, 61480],
  mothballed: { counts: [3, 8, 1, 0], hours: [512300, 1904760, 61480, 0] },
  eventsWithoutHours: { counts: [3, 8, 1, 1], hours: [512300, 1904760, 61480, 0] },
});

/** AKASO: fifteen months of recordables and hours, with a shutdown month of no
 *  hours (month five) and a short month with one event (month eleven). */
export const AKASO = Object.freeze({
  counts: [2, 1, 0, 3, 0, 1, 2, 0, 1, 2, 1, 0, 2, 1, 1],
  hours: [212400, 198750, 224310, 205880, 0, 219960, 231040, 208520, 196330, 214670, 18240, 222150, 209880, 201460, 215790],
});

/** IMO: the SAME observed rate, 2 per 200,000 hours, at growing exposure:
 *  each count is paired with IMO_HOURS_PER_EVENT hours per event. */
export const IMO_LADDER = Object.freeze([1, 2, 5, 10, 20, 50, 100]);
export const IMO_HOURS_PER_EVENT = 100000;

/** The count the Garwood mechanics are shown on, on a base of 1 over 1 hour. */
export const GARWOOD_COUNT = 7;

/** Three periods and a window of two: the first window has no hours at all. */
export const NO_HOURS_WINDOW = Object.freeze({ counts: [0, 0, 1], hours: [0, 0, 5000], windowPeriods: 2 });

/** Garwood coverage probes: true Poisson means at which the 95 percent
 *  interval's exact coverage is computed from the engine's gamma functions. */
export const COVERAGE_MEANS = Object.freeze([0.5, 1, 2, 3.5, 5, 10, 20]);

/** ABO: a crew with no recordables. The zero-event limits. */
export const ABO = Object.freeze({ hours: 41300 });
/** Target rates, per 200,000 hours, for the exposure-needed question. */
export const ZERO_TARGETS = Object.freeze([2, 1, 0.5, 0.25]);

/** ERHA: two crews, a plain comparison. */
export const ERHA = Object.freeze({
  east: { count: 6, hours: 240500 },
  west: { count: 11, hours: 902700 },
});

/** UTOROGU: a pair on which the central and minlike p-values fall either side
 *  of 0.05. The engine computes the central one only. */
export const UTOROGU = Object.freeze({
  north: { count: 7, hours: 355200 },
  south: { count: 6, hours: 1048900 },
  sweep: { maxCount1: 15, maxCount2: 24 },
});

/** EGBEMA: twelve months on a u-chart. Month three is a short month (a
 *  shutdown) whose high u does not signal; month eight carries a cluster that
 *  does; an intervention went in at the start of month seven. */
export const EGBEMA = Object.freeze({
  counts: [6, 4, 4, 5, 3, 6, 5, 16, 4, 4, 2, 4],
  hours: [402350, 388120, 97230, 296410, 371880, 409930, 398470, 421090, 386940, 384560, 392710, 405240],
  shortMonth: 3,
  interventionMonth: 7,
});

/** AMUKPE: the traps. Company hours, contractor hours and events, and a
 *  reclassification of two recordables to first aid with the days unchanged. */
export const AMUKPE = Object.freeze({
  companyHours: 846200,
  contractorHours: 1392750,
  companyRecordables: 4,
  contractorRecordables: 9,
  reclassified: 2,
  daysLost: 58,
});

/** Confidence levels the interval tables are printed at. */
export const CONFIDENCES = Object.freeze([0.8, 0.9, 0.95, 0.99]);
