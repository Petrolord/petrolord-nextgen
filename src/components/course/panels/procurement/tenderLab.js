// THE SC2 TEACHING LAB: Procurement, Tendering & Contracting.
//
// Every number this lab returns is a return value of the vendored engine
// (packages/engines/engines/supplychain/tender.js, sha-identical with
// petrolord-engines 527a197, which imports lib/stats for the seeded Monte
// Carlo, lib/conventions/percentile.js for the cost P-label definition,
// engines/economics/cashflow.ts for the canonical npv, engines/drilling/
// wellCost.js for the programme days and the should-cost, and
// engines/economics/afe.js for the partner split) on the Ekene tender fixtures,
// or on the bids, criteria and settings a learner types into a calculator
// panel. The dataset is the vendored fixture set itself, imported from
// packages/engines/test-data/supplychain/ekene-tender, so the lab, the digest
// generator and the engine's own gate read the same files, and
// tenderLab.test.js asserts that every number a teaching reader returns is
// printed in the teaching digest.
//
// THIS IS AN ENGINE COURSE. There is no Suite app: the course's practicals
// run in the three calculator panels this lab feeds.
//
// THE LAB NEVER READS THE CAPSTONE. It holds no graded answer, no tolerance and
// no capstone dataset, and panelCapstoneGuard.test.js greps this file, the
// three panels and the learning page for every rendering of all eighteen
// answers and every capstone name, bid code and distinctive input.
//
// NO REFUSAL MESSAGE IS WRITTEN HERE. A panel that shows a refusal shows the
// engine's own `error` string, so the lesson that quotes it and the panel agree.
//
// Nothing here reads a clock, a random number or a locale. The only random
// draws are the engine's own seeded mulberry32 stream.
import * as T from '@petrolord/engines/engines/supplychain/tender.js';
import WELL_SERVICES from '@petrolord/engines/test-data/supplychain/ekene-tender/well-services.json';
import MATERIALS from '@petrolord/engines/test-data/supplychain/ekene-tender/materials.json';

export const DATASET = Object.freeze({ wellServices: WELL_SERVICES, materials: MATERIALS });
export const DEFAULTS = T.DEFAULTS;
export const NC_SCHEDULE = T.NC_SCHEDULE;
export const NC_MEASURES = T.NC_MEASURES;

/* ------------------------------------------------ the Ekene fixture views */

const clone = (o) => JSON.parse(JSON.stringify(o));
/** A fixture bid as the engine takes it: the display name and the content records stay in the fixture. */
export const bidOf = (b) => { const { name, nc, ncWeights, ...rest } = clone(b); return rest; };
export const criteriaOf = (f) => f.criteria.map(({ id, weight, maxScore }) => ({ id, weight, maxScore }));
export const WS_BIDS = WELL_SERVICES.bids.map(bidOf);
export const MS_BIDS = MATERIALS.bids.map(bidOf);
export const WS_CRITERIA = criteriaOf(WELL_SERVICES);
export const MS_CRITERIA = criteriaOf(MATERIALS);
export const WS_CONTENT = { items: WELL_SERVICES.nc.items, bids: WELL_SERVICES.bids.map((b) => ({ id: b.id, items: b.nc })) };
export const MS_CONTENT = { items: MATERIALS.nc.items, bids: MATERIALS.bids.map((b) => ({ id: b.id, items: b.nc, weights: b.ncWeights })) };
export const WS_CONTRACTING = (() => { const { note, ...rest } = clone(WELL_SERVICES.contracting); return rest; })();
export const WS_SHOULD_COST = (() => { const { note, ...rest } = clone(WELL_SERVICES.shouldCost); return { ...rest, program: clone(WELL_SERVICES.contracting.duration.program) }; })();

/** The stated settings of each fixture tender, as the panels start from them. */
export const WELL_SERVICES_SETTINGS = Object.freeze({
  passMark: WELL_SERVICES.passMark,
  schedule: WELL_SERVICES.schedule,
  technicalWeight: WELL_SERVICES.award.technicalWeight,
  priceMethod: WELL_SERVICES.award.priceMethod,
  technicalMethod: WELL_SERVICES.award.technicalMethod,
  risk: WELL_SERVICES.award.risk,
  estimatedCostUsd: WELL_SERVICES.award.estimatedCostUsd,
});
export const MATERIALS_SETTINGS = Object.freeze({
  passMark: MATERIALS.passMark,
  schedule: MATERIALS.schedule,
  lifeCycle: MATERIALS.lifeCycle,
});

/** The well services tender as one evaluateTender call, at the fixture's settings. */
export const WS_TENDER = Object.freeze({
  criteria: WS_CRITERIA,
  passMark: WELL_SERVICES.passMark,
  bids: WS_BIDS,
  omissionRule: WELL_SERVICES.omissionRule,
  schedule: WELL_SERVICES.schedule,
  award: WELL_SERVICES.award.basis,
  technicalWeight: WELL_SERVICES.award.technicalWeight,
  priceMethod: WELL_SERVICES.award.priceMethod,
  technicalMethod: WELL_SERVICES.award.technicalMethod,
});

/** The materials tender, lowest-cost award with its life cycle, before any content rule. */
export const MS_TENDER = Object.freeze({
  criteria: MS_CRITERIA,
  passMark: MATERIALS.passMark,
  bids: MS_BIDS,
  omissionRule: MATERIALS.omissionRule,
  schedule: MATERIALS.schedule,
  lifeCycle: MATERIALS.lifeCycle,
  award: MATERIALS.award.basis,
});

/* ------------------------------------------------ what a learner can type */

/** A single number from a text box; a blank box is undefined, never zero. */
export const parseNumber = (text) => {
  if (text === '' || text === null || text === undefined) return undefined;
  const v = Number(text);
  return Number.isFinite(v) ? v : NaN;
};

/** JSON a learner pastes (bids, criteria, lines, a programme). Returns { value } or { error }. */
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

// The interactive routes are the engine's own functions, unchanged: a panel
// passes what the learner typed and shows what the engine returned, refusals
// included.
export const bandOf = (args) => T.weightingBand(args);
export const arithmeticOf = (args) => T.correctArithmetic(args);
export const technicalOf = (args) => T.technicalEvaluation(args);
export const evaluatedOf = (args) => T.evaluatedCosts(args);
export const rankOf = (args) => T.rankTender(args);
export const contentOf = (args) => T.nigerianContent(args);
export const preferenceOf = (args) => T.contentPreference(args);
export const contractsOf = (args) => T.contractTypes(args);
export const shouldCostOf = (args) => T.shouldCost(args);
export const albOf = (args) => T.abnormallyLow(args);
export const tenderOf = (args) => T.evaluateTender(args);

/* ------------------------------------------------- the teaching readers */

/** Associate: the well services tender end to end, at the fixture settings. */
export const wellServicesReader = () => {
  const r = T.evaluateTender(clone(WS_TENDER));
  const low = T.evaluateTender({ ...clone(WS_TENDER), award: 'lowest-cost' });
  return {
    technical: r.technical.bids.map((b) => ({ id: b.id, status: b.status, technicalPercent: b.technicalPercent, weightedPoints: b.weightedPoints })),
    commercial: r.commercial.bids.map((b) => ({ id: b.id, correctedPrice: b.correctedPrice, discount: b.discount, deviationTotal: b.deviationTotal, omissionTotal: b.omissionTotal, scheduleAdjustment: b.scheduleAdjustment, evaluatedCost: b.evaluatedCost })),
    ranking: r.ranking.bids.map((b) => ({ id: b.id, technicalScore: b.technicalScore, commercialScore: b.commercialScore, combinedScore: b.combinedScore })),
    award: r.award,
    lowestEvaluatedCost: r.commercial.lowestEvaluatedCost,
    lowestCostAward: low.award,
    excluded: r.excluded.map((x) => ({ id: x.id, stage: x.stage })),
  };
};

/** Professional: the materials tender with its life cycle, content and both s.14 readings. */
export const materialsReader = () => {
  const nc = T.nigerianContent(clone(MS_CONTENT));
  const pct = Object.fromEntries(nc.bids.map((b) => [b.id, b.ncPct]));
  const withNc = MS_BIDS.map((b) => ({ ...b, ncPct: pct[b.id] }));
  const run = (basis) => T.evaluateTender({ ...clone(MS_TENDER), bids: clone(withNc), nigerianContent: { ncLeadBasis: basis } });
  const pts = run('points');
  const rel = run('relative');
  return {
    commercial: pts.commercial.bids.map((b) => ({ id: b.id, lifeCycleCost: b.lifeCycleCost, evaluatedCost: b.evaluatedCost })),
    content: nc.bids.map((b) => ({ id: b.id, ncPct: b.ncPct, itemsMet: b.itemsMet })),
    points: { lead: pts.contentPreference.section14.lead, applied: pts.contentPreference.section14.applied, award: pts.award },
    relative: { lead: rel.contentPreference.section14.lead, applied: rel.contentPreference.section14.applied, award: rel.award },
    lowestEvaluatedCost: pts.commercial.lowestEvaluatedCost,
  };
};

/** Expert: the well services contract types at the fixture's seed and iterations. */
export const contractsReader = () => {
  const r = T.contractTypes(clone(WS_CONTRACTING));
  const pick = (t) => ({ plannedPayment: r.types[t].plannedPayment, mean: r.types[t].companyCost.mean, p90: r.types[t].companyCost.p90, p50: r.types[t].companyCost.p50, p10: r.types[t].companyCost.p10, companyPays: r.types[t].overrun.companyPays, contractorAbsorbs: r.types[t].overrun.contractorAbsorbs });
  return {
    planDays: r.plan.days,
    overrunProbability: r.overrun.probability,
    expectedOverrun: r.overrun.expectedOverrun,
    lumpSum: pick('lumpSum'),
    dayRate: pick('dayRate'),
    reimbursable: pick('reimbursable'),
    definition: r.percentileDefinition,
  };
};

/** Expert: the well services should-cost and each responsive bid's ratio to it. */
export const shouldCostReader = () => {
  const bids = wellServicesReader().commercial.map((b) => ({ id: b.id, evaluatedCost: b.evaluatedCost }));
  const r = T.shouldCost({ ...clone(WS_SHOULD_COST), bids });
  return {
    totalDays: r.totalDays, baseUsd: r.baseUsd, contingencyUsd: r.contingencyUsd, estimate: r.estimate, operatorAmount: r.split.operatorAmount,
    ratios: r.bids.map((b) => ({ id: b.id, ratio: b.ratio, flag: b.flag })),
  };
};

/** A handful of the engine's refusals, for a panel that shows what a refusal looks like. */
export const refusalSamples = () => [
  ['technicalEvaluation', 'no pass mark', T.technicalEvaluation({ criteria: WS_CRITERIA, bids: clone(WS_BIDS) })],
  ['rankTender', 'a price method it does not offer', T.rankTender({ technicalWeight: 0.7, priceMethod: 'mean-deviation', technicalMethod: 'relative', bids: [] })],
  ['contentPreference', 'no s.14 reading', T.contentPreference({ bids: [] })],
  ['contractTypes', 'no seed', T.contractTypes({ ...clone(WS_CONTRACTING), seed: undefined })],
  ['evaluateTender', 'no award basis', T.evaluateTender({ ...clone(WS_TENDER), award: undefined })],
].map(([fn, what, r]) => ({ fn, what, field: r.field, error: r.error }));
