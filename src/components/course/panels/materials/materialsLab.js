// THE SC3 TEACHING LAB: Materials, Spares & Inventory Management.
//
// Every number this lab returns is a return value of the vendored engine
// (packages/engines/engines/supplychain/inventory.js, sha-identical with
// petrolord-engines 110f0a0, with the canonical sampler it imports from
// lib/stats, the exceedance sentence it imports from
// lib/conventions/percentile.js and the regularised incomplete gamma it
// imports from engines/hse/safetyStats.js) on the vendored Ekene materials
// register (test-data/supplychain/ekene-materials), on the INPUTS of the
// vendored golden file (test-data/supplychain/goldens/inventory_cases.json),
// or on the inputs a learner types into a calculator panel. The golden file's
// expected figures are oracle output and this lab never reads them:
// GOLDEN_ARGS carries the inputs only. materialsLab.test.js asserts that every
// number a teaching reader returns is printed in the teaching digest.
//
// THIS IS AN APP COURSE. The Suite app is the Materials & Spares Planner, which
// vendors this same engine; the three calculator panels this lab feeds carry
// every practical for a learner without a Suite seat.
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
// (leadTimeRisk) is seeded by the seed the box states.
import FX from '@petrolord/engines/test-data/supplychain/ekene-materials/register.json';
import GOLD from '@petrolord/engines/test-data/supplychain/goldens/inventory_cases.json';
import {
  criticality, abcClassification, eoq, quantityDiscount, safetyStock, poissonStock, insuranceSpares, leadTimeRisk, slowMoving, DEFAULTS,
} from '@petrolord/engines/engines/supplychain/inventory.js';

export { DEFAULTS };

const clone = (o) => JSON.parse(JSON.stringify(o));

/** The golden file's INPUTS, by case id; its expected figures are left out. */
export const GOLDEN_ARGS = Object.freeze(Object.fromEntries(GOLD.cases.map((c) => [c.id, Object.freeze({ fn: c.fn, args: c.args })])));

/** The Ekene materials register as the fixture states it. */
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
 * ("eoq", "insuranceSpares") or the view's name and a colon and a name
 * ("safetyStock:fill-rate"), so one view can offer several blocks. No engine
 * input key is a view name, so a box that holds one call's inputs is read as it
 * stands, and a box that holds a case file is read at the block the view chose.
 */
export const VIEWS = Object.freeze(['criticality', 'abcClassification', 'eoq', 'slowMoving', 'quantityDiscount', 'safetyStock', 'poissonStock', 'insuranceSpares', 'leadTimeRisk']);

/** The block keys of a case file a view can read, in the file's order ([] for one call's inputs). */
export const blockKeysOf = (c, view) => (isObj(c) ? Object.keys(c).filter((k) => (k === view || k.startsWith(`${view}:`)) && isObj(c[k])) : []);

/** The block of a box a key names, or the box itself when it holds one call's inputs. */
export const pick = (c, key) => (isObj(c) && own(c, key) && isObj(c[key]) ? c[key] : c);

const INDEX = /^\d+$/;
const step = (a, k) => (isObj(a) ? a[k] : (Array.isArray(a) && INDEX.test(k) ? a[Number(k)] : undefined));

/** The value at a dotted path of an object, or undefined. A numeric step reads a list entry (breaks.1.unitPrice). */
export const getAt = (o, path) => path.split('.').reduce(step, o);

/** The engine's name for a dotted path: breaks.1.unitPrice is breaks[1].unitPrice. */
export const fieldName = (path) => path.split('.').reduce((s, k) => (INDEX.test(k) ? `${s}[${k}]` : (s ? `${s}.${k}` : k)), '');

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
    if (value === undefined) delete o[Number(lastKey)]; else o[Number(lastKey)] = value;
  } else if (value === undefined) delete o[lastKey]; else o[lastKey] = value;
  // A list entry removed whole (a price band, a class, a band) is spliced out, so no hole is left.
  if (Array.isArray(o) && value === undefined) {
    const kept = o.filter((_, i) => own(o, i));
    o.length = 0;
    kept.forEach((x) => o.push(x));
  }
  return { text: pretty(next) };
};

/**
 * A ROUNDING RULE, rewritten whole for a rule: { rule: 'none' }, or up, down or
 * nearest with the multiple kept when the old rule carried one. rule
 * undefined returns undefined (the rounding is then not stated).
 */
export const roundingFor = (rule, old) => {
  if (rule === undefined) return undefined;
  if (rule === 'none') return { rule };
  const was = isObj(old) ? old : {};
  return was.multiple !== undefined ? { rule, multiple: was.multiple } : { rule };
};

/** A SAFETY-FACTOR ROUNDING, rewritten whole: { rule: 'none' } or { rule: 'nearest', decimals } (the decimals kept when stated). */
export const factorRoundingFor = (rule, old) => {
  if (rule === undefined) return undefined;
  if (rule === 'none') return { rule };
  const was = isObj(old) ? old : {};
  return was.decimals !== undefined ? { rule, decimals: was.decimals } : { rule };
};

/** A TRIANGULAR INPUT or a constant: a number stays a number; a triangle keeps its min, mode and max. */
export const shapeFor = (shape, old) => {
  if (shape === undefined) return undefined;
  if (shape === 'constant') return typeof old === 'number' ? old : (isObj(old) && typeof old.mode === 'number' ? old.mode : undefined);
  if (isObj(old)) return { ...old };
  return typeof old === 'number' ? { min: old, mode: old, max: old } : {};
};

/* ------------------------------------------------ the engine routes, unchanged */

export const criticalityOf = (a) => criticality(clone(a));
export const abcOf = (a) => abcClassification(clone(a));
export const eoqOf = (a) => eoq(clone(a));
export const quantityDiscountOf = (a) => quantityDiscount(clone(a));
export const safetyStockOf = (a) => safetyStock(clone(a));
export const poissonStockOf = (a) => poissonStock(clone(a));
export const insuranceSparesOf = (a) => insuranceSpares(clone(a));
export const leadTimeRiskOf = (a) => leadTimeRisk(clone(a));
export const slowMovingOf = (a) => slowMoving(clone(a));

export const ROUTES = Object.freeze({
  criticality: criticalityOf,
  abcClassification: abcOf,
  eoq: eoqOf,
  quantityDiscount: quantityDiscountOf,
  safetyStock: safetyStockOf,
  poissonStock: poissonStockOf,
  insuranceSpares: insuranceSparesOf,
  leadTimeRisk: leadTimeRiskOf,
  slowMoving: slowMovingOf,
});

/** Run a view on a box at a block key (the view's name when the box holds one call's inputs). */
export const viewRun = (view, v, blockKey = view) => ROUTES[view](pick(v, blockKey));

/* ------------------------------------------------ the teaching cases, as a panel starts */

const G = (id) => GOLDEN_ARGS[id].args;
const caseArgs = (k) => { const { item, note, ...args } = clone(FX.cases[k]); return args; };
const POL = FX.policy;

/** The Ekene register as each list-shaped call reads it. */
const REGISTER = {
  criticality: { ...clone(POL.criticality), items: FX.items.map((it) => ({ id: it.id, name: it.name, scores: clone(it.scores) })) },
  abcClassification: { items: FX.items.map((it) => ({ id: it.id, name: it.name, annualUsage: it.annualUsage, unitCost: it.unitCost })), cutoffs: clone(POL.abc.cutoffs), boundaryRule: POL.abc.boundaryRule },
  slowMoving: {
    items: FX.items.map((it) => ({ id: it.id, name: it.name, onHand: it.onHand, unitCost: it.unitCost, monthsSinceLastIssue: it.monthsSinceLastIssue, monthlyUsage: it.monthlyUsage })),
    bands: clone(POL.slowMoving.bands),
    excessCoverMonths: POL.slowMoving.excessCoverMonths,
  },
};

/** A case with every required input not stated: the engine refuses the first one by name. */
export const BLANK = Object.freeze({});

/** The starting inputs of every panel view: the fixture, golden inputs and the blank case only. */
export const STARTS = Object.freeze({
  blank: BLANK,
  // criticality
  critEkene: REGISTER.criticality,
  critAtCutoff: G('crit-at-cutoff-is-in'),
  critJustBelow: G('crit-just-below-cutoff'),
  critOverride: G('crit-override-forces-top'),
  critOverrideOneBelow: G('crit-override-one-below-max'),
  crit12Digit: G('crit-12-digit-key'),
  // abc
  abcEkene: REGISTER.abcClassification,
  abcEkeneCrossing: { ...REGISTER.abcClassification, boundaryRule: 'include-crossing' },
  abcExactAtOrBelow: G('abc-cutoff-exact-at-or-below'),
  abcExactCrossing: G('abc-cutoff-exact-include-crossing'),
  abcTies: G('abc-ties-by-id'),
  // eoq
  eoqBaryte: caseArgs('eoq'),
  eoqHarris: G('harris-1913-example'),
  eoqHarrisStud: G('harris-1913-stud-say-49'),
  eoqCaplice: G('caplice-l8-eoq'),
  eoqHoldingDirect: G('eoq-holding-direct'),
  eoqHalf: G('eoq-q-exactly-half-of-multiple'),
  // slow-moving
  smEkene: REGISTER.slowMoving,
  smBoundaries: G('sm-boundaries'),
  // quantity discounts
  qdCasing: caseArgs('quantityDiscount'),
  qdCasingIncremental: G('qd-ekene-casing-incremental'),
  qdCapliceIncremental: G('caplice-l8-incremental'),
  qdCapliceAllUnits: G('caplice-l8-all-units-2pct'),
  qdTie: G('qd-tie-exact'),
  // safety stock
  ssChokeBeans: caseArgs('safetyStock'),
  ssChokeBeansFill: G('ss-ekene-choke-beans-fill'),
  ssLeadTimeOnly: G('ss-lead-time-variance-only'),
  ssCapliceIfr95: G('caplice-l11-ifr-95'),
  ssCaplicePeriodic: G('caplice-l12-periodic-rs'),
  ssFloor: G('ss-floor-at-zero'),
  ssCertain: G('ss-certain-demand'),
  // Poisson stock
  psPsvKits: caseArgs('poissonStock'),
  psCapliceFill: G('caplice-l13-poisson-fill'),
  psLamps: G('mil-hdbk-338b-lamps'),
  psExactlyMet: G('ps-level-exactly-met'),
  psFillWithReview: G('ps-fill-with-review'),
  // insurance spares
  insEspMotor: caseArgs('insuranceSpares'),
  insHandbookMean: G('ins-mil-hdbk-mean'),
  insSearchLimit: G('ins-search-limit'),
  insTie: G('ins-tie-takes-fewer'),
  // lead-time risk
  ltrMechSeal: caseArgs('leadTimeRisk'),
  ltrOtherSeed: G('ltr-other-seed'),
  ltrEqualToStock: G('ltr-constant-demand-equal-to-stock'),
  ltrLeadTimeOnly: G('ltr-lead-time-only'),
});

/* ------------------------------------------------ the teaching readers (pinned by materialsLab.test.js) */

/** The Ekene register's criticality: each item's weighted score and class. */
export const criticalityReader = () => criticalityOf(STARTS.critEkene).items.map((x) => ({ id: x.id, weightedScore: x.weightedScore, class: x.class }));

/** The Ekene register ranked by annual usage value: rank, value and cumulative share. */
export const abcReader = () => abcOf(STARTS.abcEkene).items.map((x) => ({ id: x.id, rank: x.rank, annualValue: x.annualValue, cumulativePct: x.cumulativePct, class: x.class }));

/** Baryte's EOQ and its costs. */
export const eoqReader = () => {
  const r = eoqOf(STARTS.eoqBaryte);
  return { eoq: r.eoq, quantity: r.quantity, relevantCost: r.relevantCost, relevantCostAtEoq: r.relevantCostAtEoq, roundingPenaltyPct: r.roundingPenaltyPct };
};

/** The Ekene slow-moving stock: the write-downs by band and the totals. */
export const slowReader = () => {
  const r = slowMovingOf(STARTS.smEkene);
  return { totalStockValue: r.totalStockValue, totalWriteDown: r.totalWriteDown, excessCount: r.excessCount };
};

/** The casing's all-units discount: the quantity and the total cost. */
export const discountReader = () => {
  const r = quantityDiscountOf(STARTS.qdCasing);
  return { quantity: r.quantity, totalCost: r.totalCost, savings: r.savingsAgainstNoDiscount };
};

/** The choke bean set at its cycle service level: sigma, k, safety stock and the reorder point. */
export const safetyReader = () => {
  const r = safetyStockOf(STARTS.ssChokeBeans);
  return { sigma: r.sigma, safetyFactor: r.safetyFactorExact, safetyStock: r.safetyStock, level: r.level, achievedCycleService: r.achievedCycleService };
};

/** The PSV kits on Poisson demand: the mean and the level. */
export const poissonReader = () => {
  const r = poissonStockOf(STARTS.psPsvKits);
  return { mean: r.mean, level: r.level, achievedCycleService: r.achievedCycleService };
};

/** The ESP motor as an insurance spare: the cheapest stock and its cost. */
export const sparesReader = () => {
  const r = insuranceSparesOf(STARTS.insEspMotor);
  return { meanOutstanding: r.meanOutstanding, spares: r.spares, totalCost: r.totalCost };
};

/** The mechanical seal's lead-time risk: sampled, with its seed and draw count, and ungraded. */
export const leadTimeReader = () => {
  const r = leadTimeRiskOf(STARTS.ltrMechSeal);
  return {
    probabilityOfStockout: r.probabilityOfStockout, reorderPointForService: r.reorderPointForService,
    p90: r.leadTimeDemand.p90, p10: r.leadTimeDemand.p10, seed: STARTS.ltrMechSeal.seed, iterations: STARTS.ltrMechSeal.iterations,
  };
};
