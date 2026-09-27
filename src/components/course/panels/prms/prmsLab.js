// THE EC11 TEACHING LAB: Reserves & Resources under SPE-PRMS 2018.
//
// Every number this lab returns is a return value of the vendored engine
// (packages/engines/engines/economics/prms.js, sha-identical with
// petrolord-engines bb8ef5f, with the computeCashFlow and applyJV it imports
// from cashflow.ts, the canonical Monte Carlo it imports from lib/stats and
// the labels it imports from lib/conventions/percentile.js) on the vendored
// Ekene fixture (test-data/economics/ekene-prms), on the INPUTS of the
// vendored golden file (test-data/economics/goldens/prms_cases.json), or on
// the inputs a learner types into a calculator panel. The golden file's
// expected figures are oracle output and this lab never reads them:
// GOLDEN_ARGS carries the inputs only. prmsLab.test.js asserts that every
// number a teaching reader returns is printed in the teaching digest.
//
// THIS IS AN ENGINE COURSE. There is no Suite app: the course's practicals run
// in the three calculator panels this lab feeds.
//
// THE LAB NEVER READS THE CAPSTONE. It holds no graded answer, no tolerance and
// no capstone case, and panelCapstoneGuard.test.js greps this file, the three
// panels and the learning page for every rendering of all eighteen answers and
// every capstone name, label and distinctive input.
//
// NO REFUSAL MESSAGE IS WRITTEN HERE. The engine refuses by returning
// { error, field }; every route passes that object through untouched, so the
// lesson that quotes a refusal and the panel print the same words.
//
// NO HIDDEN DEFAULT. A control on a panel writes a stated input INTO the box
// (setStated); choosing "not stated" removes the key, and the engine refuses.
//
// Nothing here reads a clock, a random number or a locale. The one Monte Carlo
// (aggregate) is seeded by the seed the box states.
import FX from '@petrolord/engines/test-data/economics/ekene-prms/ekene-prms.json';
import GOLD from '@petrolord/engines/test-data/economics/goldens/prms_cases.json';
import {
  classify, categorize, economicLimit, aggregate, reconcile, DEFAULTS, PRMS_FIGURES,
} from '@petrolord/engines/engines/economics/prms.js';

export { DEFAULTS, PRMS_FIGURES };

const clone = (o) => JSON.parse(JSON.stringify(o));

/** The golden file's INPUTS, by case id; its expected figures are left out. */
export const GOLDEN_ARGS = Object.freeze(Object.fromEntries(GOLD.cases.map((c) => [c.id, Object.freeze({ fn: c.fn, args: c.args })])));

/** The Ekene field as the fixture states it. */
export const FIXTURE = FX;

/* ------------------------------------------------ what a learner can type */

/** JSON a learner pastes. Returns { value } or { error }. */
export const parseJson = (text) => {
  if (typeof text !== 'string' || text.trim() === '') return { error: 'the box is empty' };
  try {
    return { value: JSON.parse(text) };
  } catch (e) {
    return { error: `the box does not hold valid JSON (${e.message})` };
  }
};

/** Pretty JSON for a text box a learner edits. */
export const pretty = (v) => JSON.stringify(v, null, 1);

const isObj = (o) => o !== null && typeof o === 'object' && !Array.isArray(o);
const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

/**
 * A CASE FILE holds several calls under named BLOCK KEYS: the view's own name
 * ("economicLimit", "reconcile") or the view's name and a colon and a name
 * ("classify:prospect", "aggregate:contingent"), so one view can offer several
 * blocks. No engine input key is a view name, so a box that holds one call's
 * inputs is read as it stands, and a box that holds a case file is read at the
 * block the view chose.
 */
export const VIEWS = Object.freeze(['classify', 'categorize', 'economicLimit', 'aggregate', 'reconcile']);

/** The block keys of a case file a view can read, in the file's order ([] for one call's inputs). */
export const blockKeysOf = (c, view) => (isObj(c) ? Object.keys(c).filter((k) => (k === view || k.startsWith(`${view}:`)) && isObj(c[k])) : []);

/** The block of a box a key names, or the box itself when it holds one call's inputs. */
export const pick = (c, key) => (isObj(c) && own(c, key) && isObj(c[key]) ? c[key] : c);

const INDEX = /^\d+$/;
const step = (a, k) => (isObj(a) ? a[k] : (Array.isArray(a) && INDEX.test(k) ? a[Number(k)] : undefined));

/** The value at a dotted path of an object, or undefined. A numeric step reads an array entry (projects.0.distribution.type). */
export const getAt = (o, path) => path.split('.').reduce(step, o);

/**
 * Write ONE stated input into the block of the text in a box (a whole case
 * file or one call's inputs), at a dotted path. value undefined REMOVES the
 * key, so the engine refuses by name: the panel supplies no default. Returns
 * { text } or { error } (the box does not hold a JSON object).
 */
export const setStated = (text, blockKey, path, value) => {
  const p = parseJson(text);
  if (p.error) return p;
  if (!isObj(p.value)) return { error: 'the box does not hold a JSON object' };
  const next = clone(p.value);
  const block = pick(next, blockKey);
  if (!isObj(block)) return { error: `the box does not hold an object at ${blockKey}` };
  const keys = path.split('.');
  const container = (x) => isObj(x) || Array.isArray(x);
  let o = block;
  for (let i = 0; i < keys.length - 1; i += 1) {
    const k = Array.isArray(o) ? Number(keys[i]) : keys[i];
    if (Array.isArray(o) && !INDEX.test(keys[i])) return { error: `${keys.slice(0, i + 1).join('.')} is a list and needs a number` };
    if (!container(o[k])) {
      if (value === undefined) return { text: pretty(next) };
      o[k] = INDEX.test(keys[i + 1]) ? [] : {};
    }
    o = o[k];
  }
  const lastKey = keys[keys.length - 1];
  if (Array.isArray(o)) {
    if (!INDEX.test(lastKey)) return { error: `${path} is a list entry and needs a number` };
    if (value === undefined) o.splice(Number(lastKey), 1); else o[Number(lastKey)] = value;
  } else if (value === undefined) delete o[lastKey]; else o[lastKey] = value;
  // AN OPTIONAL GROUP LEFT EMPTY IS REMOVED WHOLE. Clearing the last stated
  // term of the optional Nigerian notes leaves no empty object behind for the
  // engine to refuse: the box then states no declaration at all.
  if (value === undefined && keys.length === 2 && OPTIONAL_GROUPS.includes(keys[0]) && isObj(block[keys[0]]) && !Object.keys(block[keys[0]]).length) delete block[keys[0]];
  return { text: pretty(next) };
};

/** Groups of optional inputs that are removed whole once their last input is cleared. */
export const OPTIONAL_GROUPS = Object.freeze(['nigeria']);

/**
 * THE ESTIMATES OF A CATEGORY SET, rewritten whole for a method: low, best and
 * high (cumulative) or first, second and third (incremental). A value is kept
 * only when the old estimates already carried it under the new method's keys;
 * nothing is converted, so the learner states the new form and the engine
 * checks it. method undefined returns undefined.
 */
export const estimatesFor = (method, old) => {
  if (method === undefined) return undefined;
  const keys = method === 'incremental' ? ['first', 'second', 'third'] : ['low', 'best', 'high'];
  const was = isObj(old) ? old : {};
  return Object.fromEntries(keys.filter((k) => was[k] !== undefined).map((k) => [k, was[k]]));
};

/**
 * THE DISTRIBUTION OF A PROJECT, rewritten whole for a type, so no term of the
 * old type is left behind for the engine to refuse: min, mode and max
 * (triangular), mean and stdDev (lognormal, normal), nothing (triangular-fit,
 * which reads the project's stated estimates). A term is kept only when the
 * old distribution carried it under the same family. type undefined returns
 * undefined.
 */
export const distributionFor = (type, old) => {
  if (type === undefined) return undefined;
  const was = isObj(old) ? old : {};
  const keep = (ks) => Object.fromEntries(ks.filter((k) => was[k] !== undefined).map((k) => [k, was[k]]));
  if (type === 'triangular') return { type, ...keep(['min', 'mode', 'max']) };
  if (type === 'lognormal' || type === 'normal') return { type, ...keep(['mean', 'stdDev']) };
  return { type };
};

/**
 * THE CORRELATION OF AN AGGREGATION, rewritten whole for a type: a uniform
 * rho, or pairs (each pair stated in the box). A rho is kept only when the old
 * correlation was uniform; pairs only when it carried pairs.
 */
export const correlationFor = (type, old) => {
  if (type === undefined) return undefined;
  const was = isObj(old) ? old : {};
  if (type === 'uniform') return was.type === 'uniform' && was.rho !== undefined ? { type, rho: was.rho } : { type };
  return was.type === 'pairs' && Array.isArray(was.pairs) ? { type, pairs: clone(was.pairs) } : { type, pairs: [] };
};

/**
 * A MOVEMENT OF A RECONCILIATION, rewritten whole for a type: one quantity for
 * production, low, best and high for every other type. A value is kept only
 * when the old movement carried it under the new type's keys; the note is kept.
 */
export const movementFor = (type, old) => {
  if (type === undefined) return undefined;
  const was = isObj(old) ? old : {};
  const out = { type };
  const keys = type === 'production' ? ['quantity'] : ['low', 'best', 'high'];
  keys.forEach((k) => { if (was[k] !== undefined) out[k] = was[k]; });
  if (was.note !== undefined) out.note = was.note;
  return out;
};

/* ------------------------------------------------ the engine routes, unchanged */

export const classifyOf = (a) => classify(clone(a));
export const categorizeOf = (a) => categorize(clone(a));
export const economicLimitOf = (a) => economicLimit(clone(a));
export const aggregateOf = (a) => aggregate(clone(a));
export const reconcileOf = (a) => reconcile(clone(a));

/* ------------------------------------------------ the view routes: what a pasted box goes through */

const ROUTE = { classify: classifyOf, categorize: categorizeOf, economicLimit: economicLimitOf, aggregate: aggregateOf, reconcile: reconcileOf };
/** Run a view on a box at a block key (the view's name when the box holds one call's inputs). */
export const viewRun = (view, v, blockKey = view) => ROUTE[view](pick(v, blockKey));
export const viewClassify = (v, k = 'classify') => viewRun('classify', v, k);
export const viewCategorize = (v, k = 'categorize') => viewRun('categorize', v, k);
export const viewEconomicLimit = (v, k = 'economicLimit') => viewRun('economicLimit', v, k);
export const viewAggregate = (v, k = 'aggregate') => viewRun('aggregate', v, k);
export const viewReconcile = (v, k = 'reconcile') => viewRun('reconcile', v, k);

/* ------------------------------------------------ the teaching cases, as a panel starts */

const G = (id) => GOLDEN_ARGS[id].args;
const project = (id) => FX.projects.find((p) => p.id === id).args;

/** The starting inputs of every panel view: the fixture and golden inputs only. */
export const STARTS = Object.freeze({
  // classify
  classEkn1: project('EKN-1'),
  classEkn2: project('EKN-2'),
  classEkn3: project('EKN-3'),
  classEkn4: project('EKN-4'),
  classEkn5: project('EKN-5'),
  classEkn6: project('EKN-6'),
  classEkn7: project('EKN-7'),
  classEkn8: project('EKN-8'),
  classJustified: G('class-justified'),
  classTimeFrame5: G('class-time-frame-5-met'),
  classTimeFrame6: G('class-time-frame-6-contingent'),
  classTimeFrame8: G('class-time-frame-8-justified'),
  classEconomicsUndetermined: G('class-economics-undetermined'),
  classNoFirmIntention: G('class-no-firm-intention'),
  classTechOnly: G('class-tech-under-development-only'),
  classPlay: G('class-play'),
  classPgZero: G('class-pg-zero'),
  classRetention10: G('class-nigeria-retention-10'),
  classRetention11: G('class-nigeria-retention-11'),
  classFdp2: G('class-nigeria-fdp-2'),
  classNoInterest: G('class-nigeria-no-interest'),
  classUndiscoveredUnrecoverable: G('class-undiscovered-unrecoverable'),
  // categorize
  catReservesCumulative: G('cat-reserves-cumulative'),
  catFaq33: G('cat-faq33-incremental'),
  catContingentIncremental: G('cat-contingent-incremental'),
  catContingentCumulative: G('cat-contingent-cumulative'),
  catProspective: G('cat-prospective'),
  catSingleValue: G('cat-single-value'),
  catZeroIncrement: G('cat-zero-increment'),
  // economicLimit
  econEkene: FX.economicLimit,
  econGross: G('econ-ekene-gross'),
  econWorkingInterest: G('econ-ekene-working-interest'),
  econProductionTax: G('econ-ekene-production-tax'),
  econRenewal: G('econ-ekene-renewal-expected'),
  econNoLossRelief: G('econ-ekene-no-loss-relief'),
  econFaq33: G('econ-faq33-low-fails'),
  econBestFails: G('econ-best-fails'),
  econExactlyZero: G('econ-exactly-zero-not-economic'),
  econTailZeroKept: G('econ-tail-exactly-zero-kept'),
  econTailOneBelow: G('econ-tail-one-below-cut'),
  econLimitsDisagree: G('econ-refuse-limit-disagrees'),
  // aggregate
  aggReserves: FX.aggregation.reserves,
  aggReservesAboveField: G('agg-ekene-reserves-above-field'),
  aggReservesIndependent: G('agg-ekene-reserves-independent'),
  aggReservesStrong: G('agg-ekene-reserves-strong'),
  aggNegativeCorrelation: G('agg-negative-correlation'),
  aggContingent: FX.aggregation.contingent,
  aggProspective: G('agg-prospective'),
  aggConstant: G('agg-constant-project'),
  aggAgIndependent: G('agg-ag2011-table62-independent'),
  aggAgDependent: G('agg-ag2011-table62-dependent'),
  aggNuprc: G('agg-nuprc-2026-gas-2p'),
  // reconcile
  recEkene: FX.reconciliation,
  recNotClosing: G('rec-ekene-not-closing'),
  recExactlyTolerance: G('rec-difference-exactly-tolerance'),
  recAboveTolerance: G('rec-difference-above-tolerance'),
  recContingent: G('rec-contingent'),
  recDivestAcquire: G('rec-divest-acquire'),
  recOrderBreaks: G('rec-order-breaks'),
  recNoProduction: G('rec-no-production'),
});

/** The golden inputs each stated reading acts on, for the readings view. */
export const READING_CASES = Object.freeze({
  timeFrame: G('class-time-frame-5-met'),
  economicTest: G('econ-exactly-zero-not-economic'),
  economicLimit: FX.economicLimit,
  reconciliation: FX.reconciliation,
  tolerance: G('rec-difference-exactly-tolerance'),
  monteCarlo: FX.aggregation.reserves,
});

/* ------------------------------------------------ the teaching readers (pinned by prmsLab.test.js) */

/** The eight Ekene projects: class, sub-class and chance of commerciality. */
export const classReader = () => FX.projects.map((p) => {
  const r = classifyOf(p.args);
  return { id: p.id, class: r.class, subClass: r.subClass, chanceOfCommercialityPct: r.chanceOfCommercialityPct };
});

/** The Ekene Main Reserves, stated cumulatively: the categories and the increments. */
export const categoryReader = () => {
  const r = categorizeOf(STARTS.catReservesCumulative);
  return { cumulative: r.cumulative.map((x) => x.value), incremental: r.incremental.map((x) => x.value) };
};

/** EKN-1's economic limit: each case's limit year, cash and the Reserves in BOE. */
export const economicReader = () => {
  const r = economicLimitOf(STARTS.econEkene);
  return {
    limitYears: ['low', 'best', 'high'].map((k) => r.cases[k].economicLimitYear),
    undiscounted: ['low', 'best', 'high'].map((k) => r.cases[k].undiscountedNetCashFlow),
    reservesBoe: ['1P', '2P', '3P'].map((k) => r.reserves.cumulative[k].boe),
  };
};

/** The Ekene Reserves aggregated at the field level: the arithmetic sums and the seeded Monte Carlo. */
export const aggregationReader = () => {
  const r = aggregateOf(STARTS.aggReserves);
  return {
    arithmetic: [r.arithmetic.low, r.arithmetic.best, r.arithmetic.high],
    statistical: [r.statistical.low, r.statistical.best, r.statistical.high],
    sumOfMeans: r.sumOfMeans, seed: r.seed, iterations: r.iterations,
  };
};

/** The Ekene Contingent Resources: the risked mean. */
export const riskedReader = () => {
  const r = aggregateOf(STARTS.aggContingent);
  return { riskedMean: r.riskedMean, sumOfMeans: r.sumOfMeans };
};

/** The Ekene reconciliation: the computed closing, the replacement ratio and the life index. */
export const reconcileReader = () => {
  const r = reconcileOf(STARTS.recEkene);
  return {
    computedClosing: [r.computedClosing.low, r.computedClosing.best, r.computedClosing.high],
    replacementRatio: r.replacementRatio, lifeIndexYears: r.lifeIndexYears, closes: r.closes,
  };
};
