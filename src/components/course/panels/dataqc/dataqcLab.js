// THE D1 TEACHING LAB: Oilfield Data Quality.
//
// Every number this lab returns is a return value of the vendored engine
// (packages/engines/engines/dataai/quality.js, sha-identical with
// petrolord-engines cc82bf3) on the Ekene teaching dataset, or on the series a
// learner types into a panel. The dataset is ekeneDataset.json beside this
// file, the committed output of the wave's generator
// (tools/course-waves/dataqc/d1_fields.mjs, seeded through the canonical
// mulberry32), and dataqcLab.test.js asserts the copy is deep-equal to what the
// generator produces and that every number a teaching reader returns is
// printed in the teaching digest.
//
// THE LAB NEVER READS THE CAPSTONE. It holds no graded answer, no tolerance and
// no capstone dataset, and panelCapstoneGuard.test.js greps this file, the
// three panels and the learning page for every rendering of all eighteen
// answers and every capstone name and input.
//
// NO REFUSAL MESSAGE IS WRITTEN HERE. A panel that shows a refusal shows the
// engine's own `error` string, so the lesson that quotes it and the panel agree.
//
// Nothing here reads a clock, a random number or a locale.
import * as Q from '@petrolord/engines/engines/dataai/quality.js';
import DATA from './ekeneDataset.json';

export const DATASET = DATA;
export const CONSTANTS = Q.CONSTANTS;
export const DIMENSIONS = Q.DIMENSIONS;
export const DEFINITIONAL_LIMITS = Q.DEFINITIONAL_LIMITS;

/* ------------------------------------------------ what a learner can type */

/**
 * A comma, space or newline separated list of numbers, as a learner types it.
 * The words null, NaN and a lone dash are MISSING, because a blank in a series
 * is a question and a zero is a statement. Returns { values } or { error }
 * naming what could not be read.
 */
export const parseSeries = (text) => {
  if (typeof text !== 'string' || text.trim() === '') return { error: 'the list is empty' };
  const parts = text.split(/[\s,;]+/).filter((p) => p !== '');
  const values = parts.map((p) => (/^(null|nan|-)$/i.test(p) ? null : Number(p)));
  const bad = parts.filter((p, i) => values[i] !== null && !Number.isFinite(values[i]));
  if (bad.length) return { error: `these entries are not numbers: ${bad.join(', ')}` };
  return { values };
};

/** A list of names, one per line or separated by commas. */
export const parseNames = (text) => (typeof text === 'string' ? text.split(/[\n,]+/).map((s) => s.trim()).filter((s) => s !== '') : []);

/** A single number from a text box; a blank box is undefined, never zero. */
export const parseNumber = (text) => {
  if (text === '' || text === null || text === undefined) return undefined;
  const v = Number(text);
  return Number.isFinite(v) ? v : NaN;
};

// The interactive routes are the engine's own functions, unchanged: a panel
// passes what the learner typed and shows what the engine returned, refusals
// included.
export const completenessOf = (args) => Q.completeness(args);
export const coverageOf = (args) => Q.coverage(args);
export const rangeOf = (args) => Q.rangeCheck(args);
export const indexOf = (args) => Q.indexCheck(args);
export const ratesOf = (args) => Q.rateCheck(args);
export const cumulativeOf = (args) => Q.cumulativeCheck(args);
export const waterCutOf = (args) => Q.waterCutCheck(args);
export const phaseSumOf = (args) => Q.phaseSumCheck(args);
export const frozenOf = (args) => Q.frozenRuns(args);
export const namesOf = (args) => Q.duplicateIdentifiers(args);
export const zOf = (args) => Q.zScores(args);
export const modifiedZOf = (args) => Q.modifiedZScores(args);
export const fencesOf = (args) => Q.iqrFences(args);
export const hampelOf = (args) => Q.hampel(args);
export const grubbsOf = (args) => Q.grubbsTest(args);
export const mahalanobisOf = (args) => Q.mahalanobis(args);
export const individualsOf = (args) => Q.individualsChart(args);
export const ewmaOf = (args) => Q.ewmaChart(args);
export const cusumOf = (args) => Q.cusumChart(args);
export const scorecardOf = (args) => Q.scorecard(args);
export const quantileOf = (values, p, method) => Q.sampleQuantile(values, p, method);

/** Two typed series side by side as rows for mahalanobis; a length mismatch is reported, never padded. */
export const pairRows = (a, b) => {
  if (a.length !== b.length) return { error: `the two lists hold ${a.length} and ${b.length} values; give one value per row in each` };
  return { rows: a.map((v, i) => [v, b[i]]) };
};

/* ------------------------------------------------- the teaching readers */

const LOG = DATA.EKENE_LOG;
const CH = LOG.channels;
const PROD = DATA.EKENE_PROD;
const grClean = () => CH.GR.values.map((v) => (v === -999.25 ? null : v));

/** Associate: the EKENE-7 log through completeness, range and index checks. */
export const logChecks = () => {
  const channels = Object.entries(CH).map(([name, c]) => {
    const r = Q.completeness({ values: c.values });
    return { name, n: r.n, missing: r.missing, completeness: r.completeness, gapRuns: r.gapRuns.length };
  });
  const LIM = [['GR', 'gammaRay', 'gAPI'], ['RHOB', 'bulkDensity', 'g/cm3'], ['NPHI', 'fraction', 'v/v'], ['RT', 'resistivity', 'ohm.m'], ['DT', 'sonic', 'us/ft']];
  const ranges = LIM.map(([name, channel, unit]) => {
    const r = Q.rangeCheck({ values: CH[name].values, channel, unit });
    return { name, checked: r.checked, failed: r.failed, flagged: r.flags.map((f) => f.index) };
  });
  const ix = Q.indexCheck({ index: LOG.depth });
  const sp = Q.indexCheck({ index: DATA.EKENE_SPLICE.index });
  const cov = Q.coverage({ index: LOG.depth, values: grClean(), start: 8400, end: 8515, maxStep: 0.5 });
  const dt = Q.frozenRuns({ values: CH.DT.values });
  return {
    channels,
    ranges,
    index: { expectedStep: ix.expectedStep, irregularSteps: ix.irregularSteps },
    splice: { missing: sp.missing, duplicates: sp.duplicates, reversals: sp.reversals, irregularSteps: sp.irregularSteps },
    grCoverage: { coverage: cov.coverage, coveredLength: cov.coveredLength },
    frozenSonic: dt.runs.map((r) => ({ start: r.start, end: r.end, length: r.length, value: r.value })),
    spliceRefusal: Q.coverage({ index: DATA.EKENE_SPLICE.index, values: DATA.EKENE_SPLICE.index, start: 8520, end: 8526, maxStep: 0.5 }),
  };
};

/** Associate: the EKENE-3 production sheet through the rate and consistency checks. */
export const productionChecks = () => {
  const rc = Q.rateCheck({ rates: PROD.oil, hoursOn: PROD.hoursOn, status: PROD.status });
  const cc = Q.cumulativeCheck({ cumulative: PROD.cumOil });
  const wcDef = Q.waterCutCheck({ waterCut: PROD.waterCut, oil: PROD.oil, water: PROD.water });
  const wcRep = Q.waterCutCheck({ waterCut: PROD.waterCut, oil: PROD.oil, water: PROD.water, tolerance: 1e-4 });
  const ps = Q.phaseSumCheck({ parts: { oil: PROD.oil, water: PROD.water }, total: PROD.gross });
  const gas = Q.frozenRuns({ values: PROD.gas });
  return {
    oilCompleteness: Q.completeness({ values: PROD.oil }).completeness,
    rates: { checked: rc.checked, failed: rc.failed, days: rc.flags.map((f) => f.index + 1) },
    cumulative: cc.flags.map((f) => ({ day: f.index + 1, comparedWithDay: f.previousIndex + 1, drop: f.drop })),
    waterCut: { failedAtDefault: wcDef.failed, failedAtReporting: wcRep.failed },
    phaseSum: ps.flags.map((f) => ({ day: f.index + 1, sum: f.sum, total: f.total, allowed: f.allowed })),
    frozenGas: gas.runs.map((r) => ({ firstDay: r.start + 1, lastDay: r.end + 1, length: r.length, value: r.value })),
  };
};

/** Associate: the well names. */
export const wellNames = () => {
  const r = Q.duplicateIdentifiers({ ids: DATA.EKENE_IDS.ids });
  return {
    normalised: r.normalised,
    pairs: r.pairs.map((p) => ({ i: p.i, j: p.j, kind: p.kind, distance: p.distance, reason: p.reason })),
    exact: r.exact, normalisedDuplicates: r.normalisedDuplicates, near: r.near,
  };
};

/** Professional: the gauge, the core plugs and the two-plug copy. */
export const outliersOnSmallSets = () => {
  const G = DATA.EKENE_GAUGE.readings;
  const C = DATA.EKENE_CORE;
  const z = Q.zScores({ values: G });
  const m = Q.modifiedZScores({ values: G });
  const zc = Q.zScores({ values: C.porosity });
  const mc = Q.modifiedZScores({ values: C.porosity });
  const g1 = Q.grubbsTest({ values: C.porosity });
  const g2 = Q.grubbsTest({ values: C.twoSpikes });
  return {
    gauge: { mean: z.mean, sd: z.sd, maxAbsZ: z.maxAbsZ, maxPossibleAbsZ: z.maxPossibleAbsZ, median: m.median, mad: m.mad, modifiedZ: m.scores[7] },
    core: { maxAbsZ: zc.maxAbsZ, median: mc.median, mad: mc.mad, flaggedByModifiedZ: mc.flags.map((f) => f.index) },
    grubbs: [g1, g2].map((g) => ({ statistic: g.statistic, critical: g.critical, reject: g.reject })),
  };
};

/** Professional: fences and the Hampel window on the EKENE-7 gamma ray. */
export const gammaRayOutliers = () => {
  const gr = grClean();
  const sand = gr.slice(130, 200);
  const f = Q.iqrFences({ values: sand });
  const h = Q.hampel({ values: gr, halfWindow: 3 });
  return {
    waterSandFences: { q1: f.q1, q3: f.q3, lower: f.lower, upper: f.upper, flagged: f.flags.map((x) => x.index + 130) },
    hampel: h.flags.map((x) => ({ index: x.index, value: gr[x.index], median: h.points[x.index].median, threshold: h.points[x.index].threshold })),
  };
};

/** Professional: the oil-sand density and neutron cloud. */
export const densityNeutron = () => {
  const rows = [];
  for (let i = 40; i < 100; i += 1) rows.push([CH.RHOB.values[i], CH.NPHI.values[i]]);
  const r = Q.mahalanobis({ rows });
  return { n: r.n, cutoff: r.cutoff, centre: r.centre, flagged: r.flags.map((f) => f.index + 40), d2Entry60: r.d2[20] };
};

/** Expert: the EKENE-3 wellhead pressure through the three charts. */
export const pressureCharts = () => {
  const W = DATA.EKENE_WHP;
  const p1 = Q.individualsChart({ values: W.history });
  const ew = Q.ewmaChart({ values: W.monitored, lambda: 0.2, target: p1.centre, sigma: p1.sigma });
  const cu = Q.cusumChart({ values: W.monitored, target: p1.centre, k: 0.5, h: 4, units: 'sigma', sigma: p1.sigma });
  const firstLow = ew.flags.find((f) => f.rule === 'ewma-below-lcl');
  return {
    phaseOne: { centre: p1.centre, mrBar: p1.mrBar, sigma: p1.sigma, ucl: p1.ucl, lcl: p1.lcl, mrUcl: p1.mrUcl },
    ewma: { ucl: ew.ucl, lcl: ew.lcl, firstLowDay: firstLow ? firstLow.index + 1 : null },
    cusum: { kData: cu.kData, hData: cu.hData, firstHighDay: cu.firstSignalHigh + 1, firstLowDay: cu.firstSignalLow + 1 },
  };
};

/** Expert: the EKENE-3 scorecard, counted from the checks above, equal and stated weights. */
export const EKENE_WEIGHTS = Object.freeze({ completeness: 3, validity: 2, consistency: 2, uniqueness: 1, plausibility: 1 });
export const ekeneDimensions = () => {
  const oil = Q.completeness({ values: PROD.oil });
  const rc = Q.rateCheck({ rates: PROD.oil, hoursOn: PROD.hoursOn, status: PROD.status });
  const ps = Q.phaseSumCheck({ parts: { oil: PROD.oil, water: PROD.water }, total: PROD.gross });
  const du = Q.duplicateIdentifiers({ ids: DATA.EKENE_IDS.ids });
  const mz = Q.modifiedZScores({ values: PROD.oil });
  return [
    { name: 'completeness', checked: oil.n, failed: oil.missing },
    { name: 'validity', checked: rc.checked, failed: rc.failed },
    { name: 'consistency', checked: ps.sums.filter((v) => v !== null).length, failed: ps.failed },
    { name: 'uniqueness', checked: DATA.EKENE_IDS.ids.length, failed: new Set(du.pairs.map((p) => p.j)).size },
    { name: 'plausibility', checked: mz.n, failed: mz.flags.length },
  ];
};
export const ekeneScorecard = () => {
  const dims = ekeneDimensions();
  const eq = Q.scorecard({ dimensions: dims });
  const wt = Q.scorecard({ dimensions: dims, weights: EKENE_WEIGHTS });
  return {
    dimensions: wt.dimensions.map((d) => ({ name: d.name, checked: d.checked, failed: d.failed, score: d.score, weight: d.weight })),
    equalTotal: eq.total, weightedTotal: wt.total, weakest: wt.weakest,
  };
};

/** Every refusal a panel can show, with the engine's own words. */
export const refusalSamples = () => [
  ['completeness', 'an infinite value', Q.completeness({ values: [1, Infinity] })],
  ['coverage', 'the splice index', Q.coverage({ index: DATA.EKENE_SPLICE.index, values: DATA.EKENE_SPLICE.index, start: 8520, end: 8526, maxStep: 0.5 })],
  ['rangeCheck', 'an unlisted unit', Q.rangeCheck({ values: [1], channel: 'sonic', unit: 'us/s' })],
  ['modifiedZScores', 'a MAD of zero', Q.modifiedZScores({ values: [5, 5, 5, 6, 7] })],
  ['individualsChart', 'a gap in the series', Q.individualsChart({ values: [1, null, 2] })],
  ['ewmaChart', 'no target', Q.ewmaChart({ values: [1, 2], lambda: 0.2, sigma: 1 })],
  ['cusumChart', 'no units for k and h', Q.cusumChart({ values: [1, 2], target: 1, k: 0.5, h: 4 })],
].map(([fn, what, r]) => ({ fn, what, field: r.field, error: r.error }));
