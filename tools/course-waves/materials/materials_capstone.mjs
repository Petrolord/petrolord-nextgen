// THE THREE SC3 CAPSTONES AND THEIR EIGHTEEN GRADED FIELDS.
//
// Every graded value is a RETURN VALUE of the vendored engine
// (engines/supplychain/inventory.js, with the regularised incomplete gamma it
// imports from engines/hse/safetyStats.js, the canonical sampler it imports
// from lib/stats/stats.js and the labels it imports from
// lib/conventions/percentile.js) on the inputs typed below. Nothing here
// computes a score, a share, an order quantity, a cost, a safety stock, a
// probability or a write-down by its own arithmetic: every number is read off
// an engine result object, and discriminate.mjs is where the wrong methods
// live.
//
//   IGBARIAM  Associate     criticality, classes and the order quantity: an
//                           item's weighted criticality score, an item's
//                           cumulative share of annual usage value, the EOQ of
//                           a corrosion inhibitor, its relevant cost at the
//                           rounded quantity and the rounding penalty, and the
//                           total write-down of the slow-moving stock
//   OGIDI     Professional  service levels, safety stock and discounts: the
//                           order quantity and total cost under an incremental
//                           discount, the safety stock at a cycle service
//                           level, the safety factor for a fill rate, the
//                           order-up-to level under periodic review, and the
//                           expected units short a cycle of a Poisson slow mover
//   UMUCHU    Expert        spares, lead-time risk and the limits: an
//                           insurance spare's annual cost, expected downtime
//                           cost, probability of no shortage and fill rate at
//                           the cheapest stock, and a slow-moving seal's
//                           expected units short a cycle and achieved fill rate
//
// THE CASES ARE EKENE-PROGRAMME SYNTHETIC SITES OF THEIR OWN, typed here with
// their own items, scores, usages, costs, schedules, demands, lead times,
// service targets, failure rates and bands, none of them the digest's. Their
// names, terms and values must never enter a lesson, a bank, a panel default
// or a brief (gate_capstone_leak.mjs).
//
// EVERY FIELD IS FREE OF EVERY STATED READING AND OF EVERY DRAW. The engine
// states its readings (figures compared at twelve significant digits; the
// nearest multiple with halves upward; a class, band or service target met at
// or above its minimum; excess strictly above the cover limit; a discount tie
// to the smaller quantity and a spares tie to fewer spares; an ABC tie broken
// by id ascending; a lead-time demand equal to the stock met; the P90 of a
// sampled figure the low one; the reorder point for a service level at the
// sorted index ceil(level x n) - 1). This file runs every capstone again
// through the engine with the OTHER side of each (materials_loader.mjs
// reading_* variants) and ASSERTS that every graded value comes out
// bit-identical. The one sampling call (UMUCHU's leadTimeRisk block, worked in
// the Expert brief with its seed and draw count) is never graded: no READ route
// calls it, and every graded value is asserted bit-identical on a second seed
// and draw count.
//
// THE CARE RULES, all asserted below:
//   * ONE ANSWER. Every graded value is finite, non-zero and not a whole number.
//   * EVERY TERM IS STATED. Every input a value depends on is in the case,
//     printed by --inputs for the capstone brief and the case files.
//   * NO COLLISION. No two graded values sit within one tolerance of each other.
//
// Usage:
//   node materials_capstone.mjs            the human table
//   node materials_capstone.mjs --json     the rows make_fields.mjs writes
//   node materials_capstone.mjs --inputs   the three cases, for gen_course.py,
//                                          discriminate.mjs, oracle_check.py and
//                                          gate_capstone_leak.mjs
//
// NOTHING HERE READS THE DIGEST, and the digest generator reads nothing here.
import process from 'node:process';

const HERE = process.env.SC3_WAVE_DIR || '/root/cat-wip-materials';
const { I, variant } = await import(`${HERE}/materials_engine.mjs`);
const TOLPATH = process.env.SC3_TOLERANCE
  || '/root/wt-sc3-nextgen/src/components/course/panels/materials/gradedTolerance.js';
const { GRADED_FIELDS, gradedTolerance } = await import(TOLPATH);

/* ---------------------------------------------------------- the machinery */

const ASSERTS = [];
const must = (claim, cond, detail) => { ASSERTS.push({ claim, pass: !!cond, detail: String(detail) }); return !!cond; };
const clone = (o) => JSON.parse(JSON.stringify(o));
const ok = (label, r) => {
  if (!r || r.error) throw new Error(`${label} was refused: ${r && r.error}`);
  return r;
};

/* ==================================================== IGBARIAM, Associate

   The Igbariam flow station (synthetic). Four items scored on four stated
   criteria out of 4; eight items ranked by annual usage value against stated
   cut-offs; a corrosion inhibitor ordered in drums on a pallet of six; four
   items banded by months since the last issue. */

const IGBARIAM = {
  name: 'IGBARIAM',
  label: 'IGBARIAM, the materials register of the Igbariam flow station (synthetic)',
  criticality: {
    criteria: [
      { id: 'safety', label: 'Consequence of failure for people and the environment', weight: 35 },
      { id: 'production', label: 'Consequence of failure for oil throughput', weight: 30 },
      { id: 'leadTime', label: 'Replacement lead time', weight: 20 },
      { id: 'redundancy', label: 'Lack of an installed standby', weight: 15 },
    ],
    scoreMax: 4,
    items: [
      { id: 'IGB-P101', name: 'Crude transfer pump seal kit (synthetic)', scores: { safety: 3, production: 4, leadTime: 3, redundancy: 1 } },
      { id: 'IGB-V204', name: 'Separator level control valve trim (synthetic)', scores: { safety: 2, production: 3, leadTime: 3, redundancy: 3 } },
      { id: 'IGB-E310', name: 'Flare igniter module (synthetic)', scores: { safety: 4, production: 1, leadTime: 2, redundancy: 2 } },
      { id: 'IGB-F412', name: 'Instrument air dryer cartridge (synthetic)', scores: { safety: 1, production: 2, leadTime: 1, redundancy: 3 } },
    ],
    classes: [{ label: 'V', minScore: 72 }, { label: 'E', minScore: 45 }, { label: 'D', minScore: 0 }],
    topClassOnMaxScore: ['safety'],
  },
  abcClassification: {
    items: [
      { id: 'IGB-P101', name: 'Crude transfer pump seal kit (synthetic)', annualUsage: 14, unitCost: 3625 },
      { id: 'IGB-V204', name: 'Separator level control valve trim (synthetic)', annualUsage: 6, unitCost: 8740 },
      { id: 'IGB-E310', name: 'Flare igniter module (synthetic)', annualUsage: 3, unitCost: 5210 },
      { id: 'IGB-F412', name: 'Instrument air dryer cartridge (synthetic)', annualUsage: 48, unitCost: 187.5 },
      { id: 'IGB-C515', name: 'Corrosion inhibitor, drum (synthetic)', annualUsage: 130, unitCost: 212 },
      { id: 'IGB-G618', name: 'Glycol top-up, pail (synthetic)', annualUsage: 75, unitCost: 46.8 },
      { id: 'IGB-H721', name: 'Hydraulic hose assembly (synthetic)', annualUsage: 22, unitCost: 158 },
      { id: 'IGB-K824', name: 'Gauge glass kit (synthetic)', annualUsage: 9, unitCost: 94.25 },
    ],
    cutoffs: { aPct: 75, bPct: 92 },
    boundaryRule: 'at-or-below',
  },
  eoq: {
    annualDemand: 130,
    orderCost: 1450,
    unitCost: 212,
    holdingRate: 0.24,
    rounding: { rule: 'up', multiple: 6 },
  },
  slowMoving: {
    items: [
      { id: 'IGB-P101', name: 'Crude transfer pump seal kit (synthetic)', onHand: 5, unitCost: 3625, monthsSinceLastIssue: 2.5, monthlyUsage: 1.1667 },
      { id: 'IGB-V204', name: 'Separator level control valve trim (synthetic)', onHand: 3, unitCost: 8740, monthsSinceLastIssue: 10.5, monthlyUsage: 0.5 },
      { id: 'IGB-E310', name: 'Flare igniter module (synthetic)', onHand: 4, unitCost: 5210, monthsSinceLastIssue: 21, monthlyUsage: 0.25 },
      { id: 'IGB-M927', name: 'Superseded meter prover seal set (synthetic)', onHand: 7, unitCost: 1387.35, monthsSinceLastIssue: 33.5, monthlyUsage: 0 },
    ],
    bands: [
      { label: 'active', minMonths: 0, writeDownPct: 0 },
      { label: 'slow', minMonths: 9, writeDownPct: 20 },
      { label: 'very slow', minMonths: 18, writeDownPct: 45 },
      { label: 'obsolete', minMonths: 30, writeDownPct: 100 },
    ],
    excessCoverMonths: 18,
  },
};

/* =================================================== OGIDI, Professional

   The Ogidi field (synthetic). Production tubing bought on an incremental
   price schedule; a filter element stocked at a cycle service level, at a fill
   rate and under monthly periodic review; a valve repair kit on Poisson demand
   under monthly review. Periods are months. */

const OGIDI = {
  name: 'OGIDI',
  label: 'OGIDI, the stock policy of the Ogidi field (synthetic)',
  quantityDiscount: {
    annualDemand: 420,
    orderCost: 2650,
    holdingRate: 0.22,
    breaks: [{ minQuantity: 0, unitPrice: 318 }, { minQuantity: 100, unitPrice: 296.5 }, { minQuantity: 250, unitPrice: 281.25 }],
    discountType: 'incremental',
    rounding: { rule: 'none' },
  },
  'safetyStock:cycle-service': {
    demandMean: 11.5, demandSd: 4.2, leadTime: 1.75, leadTimeSd: 0.35, reviewPeriod: 0,
    serviceMeasure: 'cycle-service', serviceLevel: 0.975,
    safetyFactorRounding: { rule: 'none' }, minimumSafetyFactor: 0, rounding: { rule: 'none' },
  },
  'safetyStock:fill-rate': {
    demandMean: 11.5, demandSd: 4.2, leadTime: 1.75, leadTimeSd: 0.35, reviewPeriod: 0,
    serviceMeasure: 'fill-rate', serviceLevel: 0.985, orderQuantity: 46,
    safetyFactorRounding: { rule: 'none' }, minimumSafetyFactor: 0, rounding: { rule: 'none' },
  },
  'safetyStock:periodic': {
    demandMean: 11.5, demandSd: 4.2, leadTime: 1.75, leadTimeSd: 0, reviewPeriod: 1,
    serviceMeasure: 'cycle-service', serviceLevel: 0.95,
    safetyFactorRounding: { rule: 'none' }, minimumSafetyFactor: 0, rounding: { rule: 'none' },
  },
  poissonStock: {
    demandRate: 0.35, leadTime: 3.5, reviewPeriod: 1,
    serviceMeasure: 'fill-rate', serviceLevel: 0.97, orderQuantity: 2,
  },
};

/* ========================================================= UMUCHU, Expert

   The Umuchu compressor station (synthetic). A gas compressor motor held as
   an insurance spare against failures across the installed trains; a
   mechanical seal cartridge on Poisson demand under two-monthly review, and
   the same seal's lead-time risk by the canonical Monte Carlo (never graded). */

const UMUCHU = {
  name: 'UMUCHU',
  label: 'UMUCHU, the spares of the Umuchu compressor station (synthetic)',
  insuranceSpares: {
    failuresPerYear: 3.25,
    leadTimeDays: 120,
    daysPerYear: 365,
    unitCost: 142500,
    holdingRate: 0.18,
    downtimeCostPerDay: 24750,
    maxSpares: 8,
  },
  poissonStock: {
    demandRate: 0.18, leadTime: 5, reviewPeriod: 2,
    serviceMeasure: 'fill-rate', serviceLevel: 0.99, orderQuantity: 3,
  },
  // THE LEAD-TIME MONTE CARLO BLOCK. Worked in the brief with its seed and
  // draw count, and NEVER GRADED: no READ route below calls leadTimeRisk, and
  // every graded value is asserted bit-identical on a second seed and draw count.
  leadTimeRisk: {
    demandPerDay: { min: 0.004, mode: 0.0065, max: 0.011 },
    leadTimeDays: { min: 95, mode: 140, max: 235 },
    reorderPoint: 2,
    serviceLevel: 0.98,
    iterations: 20000,
    seed: 20291114,
  },
};

export const CASES = { IGBARIAM, OGIDI, UMUCHU };

/* ------------------------------------------------------ the engine routes

   READ[key] = [case, (E) => value]: the value the key names, read off the
   engine module E. The true engine is I; discriminate.mjs passes a variant. */

const igC = (E) => ok('criticality', E.criticality(clone(IGBARIAM.criticality)));
const igA = (E) => ok('abcClassification', E.abcClassification(clone(IGBARIAM.abcClassification)));
const igE = (E) => ok('eoq', E.eoq(clone(IGBARIAM.eoq)));
const igS = (E) => ok('slowMoving', E.slowMoving(clone(IGBARIAM.slowMoving)));
const ogQ = (E) => ok('quantityDiscount', E.quantityDiscount(clone(OGIDI.quantityDiscount)));
const ogC = (E) => ok('safetyStock', E.safetyStock(clone(OGIDI['safetyStock:cycle-service'])));
const ogF = (E) => ok('safetyStock', E.safetyStock(clone(OGIDI['safetyStock:fill-rate'])));
const ogP = (E) => ok('safetyStock', E.safetyStock(clone(OGIDI['safetyStock:periodic'])));
const ogK = (E) => ok('poissonStock', E.poissonStock(clone(OGIDI.poissonStock)));
const umI = (E) => ok('insuranceSpares', E.insuranceSpares(clone(UMUCHU.insuranceSpares)));
const umS = (E) => ok('poissonStock', E.poissonStock(clone(UMUCHU.poissonStock)));
const atBest = (r) => r.options[r.spares];

export const READ = {
  igbariam_trim_weighted_score: ['IGBARIAM', (E) => igC(E).items.find((x) => x.id === 'IGB-V204').weightedScore],
  igbariam_inhibitor_cumulative_pct: ['IGBARIAM', (E) => igA(E).items.find((x) => x.id === 'IGB-C515').cumulativePct],
  igbariam_inhibitor_eoq: ['IGBARIAM', (E) => igE(E).eoq],
  igbariam_inhibitor_relevant_cost: ['IGBARIAM', (E) => igE(E).relevantCost],
  igbariam_inhibitor_rounding_penalty_pct: ['IGBARIAM', (E) => igE(E).roundingPenaltyPct],
  igbariam_total_write_down: ['IGBARIAM', (E) => igS(E).totalWriteDown],
  ogidi_tubing_discount_quantity: ['OGIDI', (E) => ogQ(E).quantity],
  ogidi_tubing_discount_total_cost: ['OGIDI', (E) => ogQ(E).totalCost],
  ogidi_filter_csl_safety_stock: ['OGIDI', (E) => ogC(E).safetyStock],
  ogidi_filter_fill_rate_k: ['OGIDI', (E) => ogF(E).safetyFactorExact],
  ogidi_filter_periodic_level: ['OGIDI', (E) => ogP(E).level],
  ogidi_kit_poisson_short: ['OGIDI', (E) => ogK(E).expectedShortPerCycle],
  umuchu_motor_total_cost: ['UMUCHU', (E) => umI(E).totalCost],
  umuchu_motor_downtime_cost: ['UMUCHU', (E) => atBest(umI(E)).downtimeCost],
  umuchu_motor_no_shortage: ['UMUCHU', (E) => atBest(umI(E)).probabilityNoShortage],
  umuchu_motor_fill_rate: ['UMUCHU', (E) => atBest(umI(E)).fillRate],
  umuchu_seal_poisson_short: ['UMUCHU', (E) => umS(E).expectedShortPerCycle],
  umuchu_seal_poisson_fill_rate: ['UMUCHU', (E) => umS(E).achievedFillRate],
};

/** The other side of each reading the engine states in inventory.js. No graded value may move under any of them. */
export const OPEN_READINGS = ['reading_exact_comparison', 'reading_nearest_halves_down', 'reading_class_minimum_exclusive', 'reading_discount_tie_larger',
  'reading_poisson_target_exclusive', 'reading_poisson_fill_exclusive', 'reading_abc_ties_by_id_descending', 'reading_spares_tie_more',
  'reading_band_minimum_exclusive', 'reading_cover_limit_inclusive', 'reading_stockout_at_equality', 'reading_service_index_one_high', 'reading_p90_as_high'];

/* ------------------------------------------------------------ the checks */

const KEYS = GRADED_FIELDS.map(([, k]) => k);
must('READ carries exactly the eighteen graded keys, in order', JSON.stringify(Object.keys(READ)) === JSON.stringify(KEYS), Object.keys(READ).join(','));
const rows = GRADED_FIELDS.map(([tier, key, cls]) => {
  const value = READ[key][1](I);
  return { tier, key, cls, value, tol: gradedTolerance(key), case: READ[key][0] };
});
rows.forEach((r) => {
  must(`ONE ANSWER: ${r.key} is finite`, Number.isFinite(r.value), r.value);
  must(`ONE ANSWER: ${r.key} is not zero`, r.value !== 0, r.value);
  must(`ONE ANSWER: ${r.key} is not a whole number`, !Number.isInteger(r.value), r.value);
  must(`PRINTABLE: ${r.key} prints at six decimals in fewer than sixteen significant digits`, r.value.toFixed(6).replace(/^-/, '').replace('.', '').replace(/^0+/, '').length <= 15, r.value.toFixed(6));
});
for (let i = 0; i < rows.length; i += 1) {
  for (let j = i + 1; j < rows.length; j += 1) {
    must(`NO COLLISION: ${rows[i].key} and ${rows[j].key}`, Math.abs(rows[i].value - rows[j].value) > Math.max(rows[i].tol, rows[j].tol), `${rows[i].value} ${rows[j].value}`);
  }
}
// Every stated reading leaves every graded value bit-identical.
for (const name of OPEN_READINGS) {
  const V = await variant(name);
  rows.forEach((r) => {
    const v = READ[r.key][1](V);
    must(`READING-FREE: ${r.key} under ${name}`, Object.is(v, r.value), `${v} against ${r.value}`);
  });
}
// The one sampling block (UMUCHU leadTimeRisk) runs, and no graded value reads it.
const umL = (E) => ok('leadTimeRisk', E.leadTimeRisk(clone(UMUCHU.leadTimeRisk)));
const mc = umL(I);
must('DRAW-FREE: only UMUCHU carries a leadTimeRisk block, and no READ route names it',
  Object.entries(CASES).every(([n, c]) => n === 'UMUCHU' || !Object.keys(c).some((k) => k.startsWith('leadTimeRisk')))
  && Object.values(READ).every(([, f]) => !String(f).includes('umL') && !String(f).includes('leadTimeRisk')), 'routes');
must('DRAW-FREE: the UMUCHU Monte Carlo runs on its stated seed and draw count and states the P-label convention',
  Number.isFinite(mc.probabilityOfStockout) && mc.percentileDefinition && mc.basis.sampling.includes(`mulberry32(${UMUCHU.leadTimeRisk.seed})`), mc.reason);
{
  const saved = [UMUCHU.leadTimeRisk.seed, UMUCHU.leadTimeRisk.iterations];
  UMUCHU.leadTimeRisk.seed = 7; UMUCHU.leadTimeRisk.iterations = 5000;
  const other = umL(I);
  must('DRAW-FREE: the second seed moves the sampled stockout probability (the draws are live)', other.probabilityOfStockout !== mc.probabilityOfStockout, `${other.probabilityOfStockout} ${mc.probabilityOfStockout}`);
  rows.forEach((r) => {
    const v = READ[r.key][1](I);
    must(`DRAW-FREE: ${r.key} on another seed and draw count`, Object.is(v, r.value), `${v} against ${r.value}`);
  });
  [UMUCHU.leadTimeRisk.seed, UMUCHU.leadTimeRisk.iterations] = saved;
}

// SCENARIO CLAIMS the capstone briefs make, each asserted.
const igc = igC(I);
const trim = igc.items.find((x) => x.id === 'IGB-V204');
must('IGBARIAM: the valve trim is class E by its weighted score, with no override', trim.class === 'E' && trim.forcedBy.length === 0, trim.reason);
must('IGBARIAM: the flare igniter is forced to V by its maximum safety score', igc.items.find((x) => x.id === 'IGB-E310').forcedBy.join() === 'safety', 'override');
must('IGBARIAM: no weighted score sits exactly on a class minimum', igc.items.every((x) => ![72, 45, 0].includes(x.weightedScore)), igc.items.map((x) => x.weightedScore).join());
const iga = igA(I);
const inh = iga.items.find((x) => x.id === 'IGB-C515');
must('IGBARIAM: the corrosion inhibitor is the item that crosses the A cut-off, so it is B under at-or-below', inh.class === 'B' && inh.cumulativePct > 75 && inh.cumulativePct - inh.sharePct < 75, `${inh.cumulativePct} ${inh.class}`);
must('IGBARIAM: no two items tie on annual usage value', new Set(iga.items.map((x) => x.annualValue)).size === iga.items.length, 'ties');
const ige = igE(I);
must('IGBARIAM: the EOQ is rounded up to a pallet of six and costs more than at the EOQ', ige.quantity > ige.eoq && ige.relevantCost > ige.relevantCostAtEoq && ige.quantity % 6 === 0, `${ige.quantity}`);
must('IGBARIAM: rounding up and rounding to the nearest multiple give different quantities (so the rule matters)', Math.ceil(ige.eoq / 6) !== Math.round(ige.eoq / 6), ige.eoq / 6);
const igs = igS(I);
must('IGBARIAM: each of the four bands holds one item, and the no-usage item is all excess', ['active', 'slow', 'very slow', 'obsolete'].every((b) => igs.byBand[b].count === 1) && igs.items.find((x) => x.id === 'IGB-M927').excess, JSON.stringify(igs.byBand));
must('IGBARIAM: no item sits exactly on a band minimum or on the cover limit', igs.items.every((x) => x.coverMonths === null || x.coverMonths !== 18) && IGBARIAM.slowMoving.items.every((x) => ![0, 9, 18, 30].includes(x.monthsSinceLastIssue)), 'edges');
const ogq = ogQ(I);
must('OGIDI: the incremental schedule is won in the top band at its own EOQ, unrounded', ogq.band === 2 && ogq.candidates[2].feasible && ogq.quantity === ogq.candidates[2].eoq, `${ogq.band} ${ogq.quantity}`);
must('OGIDI: the two feasible candidates do not tie on cost', ogq.candidates.filter((c) => c.feasible).length === 2 && Math.abs(ogq.candidates[1].totalCost - ogq.candidates[2].totalCost) > 1, 'tie');
const ogc = ogC(I);
must('OGIDI: the cycle-service call is continuous review with lead-time variation in sigma', ogc.policy === 'continuous (s, Q)' && ogc.sigma > Math.sqrt(1.75) * 4.2, ogc.sigma);
const ogf = ogF(I);
must('OGIDI: the fill-rate safety factor is below the cycle-service one', ogf.safetyFactorExact < ogc.safetyFactorExact && ogf.safetyFactorExact > 0, ogf.safetyFactorExact);
const ogp = ogP(I);
must('OGIDI: the periodic call is (R, S) over the lead time plus the review period', ogp.policy === 'periodic (R, S)' && ogp.protectionPeriod === 2.75, ogp.protectionPeriod);
const ogk = ogK(I);
must('OGIDI: the Poisson kit is a fill-rate call under review, met at a whole level', ogk.level >= 1 && Number.isInteger(ogk.level) && ogk.achievedFillRate > 0.97, `${ogk.level} ${ogk.achievedFillRate}`);
const umi = umI(I);
must('UMUCHU: the cheapest stock of spares lies inside the search, with a marginal spare after it', !umi.atSearchLimit && umi.spares > 0 && umi.spares < UMUCHU.insuranceSpares.maxSpares, `${umi.spares}`);
must('UMUCHU: no two stocks of spares tie on total cost', new Set(umi.options.map((o) => o.totalCost)).size === umi.options.length, 'ties');
const ums = umS(I);
must('UMUCHU: the seal is a Poisson fill-rate call under review, above its target', ums.level >= 1 && ums.achievedFillRate > 0.99, `${ums.level} ${ums.achievedFillRate}`);

/* ------------------------------------------------------------ the output */

const failed = ASSERTS.filter((a) => !a.pass);
if (failed.length) {
  failed.forEach((a) => process.stderr.write(`  FAILED  ${a.claim}\n          ${a.detail}\n`));
  process.stderr.write(`materials_capstone: ${ASSERTS.length} assertions, ${failed.length} FAILED\n`);
  if (process.argv.includes('--show')) rows.forEach((r) => console.log(`${r.tier.padEnd(13)} ${r.key.padEnd(40)} ${String(r.value)}`));
  process.exit(1);
}
const MAIN = import.meta.url === `file://${process.argv[1]}`;
if (MAIN && process.argv.includes('--json')) {
  process.stdout.write(`${JSON.stringify(rows.map(({ tier, key, cls, value }) => ({ tier, key, cls, value })))}\n`);
} else if (MAIN && process.argv.includes('--inputs')) {
  process.stdout.write(`${JSON.stringify(CASES)}\n`);
} else if (MAIN) {
  rows.forEach((r) => console.log(`${r.tier.padEnd(13)} ${r.key.padEnd(40)} ${String(r.value).padEnd(24)} tol ${r.tol}`));
  console.log(`materials_capstone: ${ASSERTS.length} assertions, 0 failed; ${OPEN_READINGS.length} stated readings and a second seed, every field bit-identical under each; the one Monte Carlo block is never graded`);
}
