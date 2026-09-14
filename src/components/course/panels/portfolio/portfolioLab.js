// Teaching lab for EC5, Capital Portfolio & Cost Control. The three panels, the
// course page and the vitest files all read this one module, so a number shown
// to a learner and a number a test pins cannot drift apart.
//
// EVERYTHING HERE IS THE VENDORED ENGINES' OWN OUTPUT. Every funded set, every
// frontier point, every risk summary, every earned value, every S-curve point
// and every partner share below is a return value of
// engines/economics/portfolio.js (the Capital Portfolio Studio) or
// engines/economics/afe.js (the AFE Cost Control Manager), as repaired in EC5-0.
//
// NOTHING IN THIS FILE COMPUTES AN ECONOMIC QUANTITY. Where a reader carries a
// value the digest calls "derived" (unspent capex, frontier steps, the greedy
// fill, a line's forecast variance, the old normal approximation rebuilt from
// the engine's own emv and stdDev), it is the digest's own arithmetic on
// numbers the engine returned, and the key name says Derived. The lab and
// /root/ec-wip-portfolio/digest.txt agree because both call the engines on the
// same inputs, not because either copied the other.
//
// UNITS. Portfolio money is million USD; AFE money is whole units of the AFE
// currency (USD); percents run 0 to 100; probabilities and ratios are plain
// fractions.
//
// THE CLOCK. Every AFE call passes an explicit asOf. The published cases that
// carry no asOf of their own are run at DIGEST_CUT_DATE (sections 9 and 10,
// where the digest's generator read the clock on the day it was cut) or at
// UNDATED_METRICS_AS_OF (sections 7 and 8, the generator's own fallback). No
// value here depends on the day it runs; a clock gate in portfolioLab.test.js
// proves it under two faked system dates.
//
// PURITY. Every function is pure and deterministic; every Monte Carlo is the
// engine's seeded one. Nothing is memoised.

import portfolioGolden from '@petrolord/engines/test-data/economics/goldens/portfolio_cases.json';
import afeGolden from '@petrolord/engines/test-data/economics/goldens/afe_cases.json';
// Namespaces, not named imports: eslint's resolver follows the node_modules
// symlink to the SHARED checkout's engines, which predate EC5-0 and export no
// DEFAULT_RISK_SEED, DEFAULT_RISK_ITERATIONS or itemForecast. Vite and vitest
// alias @petrolord/engines to this worktree's packages/engines, which do.
// import/namespace still checks members against the shared copy, so it is off
// for this file only; the vitest files prove every member resolves.
/* eslint-disable import/namespace */
import * as P from '@petrolord/engines/engines/economics/portfolio.js';
import * as A from '@petrolord/engines/engines/economics/afe.js';
import * as ST from '@petrolord/engines/lib/stats/stats.js';

export const DEFAULT_RISK_SEED = P.DEFAULT_RISK_SEED;
export const DEFAULT_RISK_ITERATIONS = P.DEFAULT_RISK_ITERATIONS;

// ---------------------------------------------------------------------------
// Helpers. Pure, and none of them computes an economic quantity.
// ---------------------------------------------------------------------------

const clone = (o) => (o === undefined ? undefined : JSON.parse(JSON.stringify(o)));
const byKey = (list, key) => Object.fromEntries(list.map((c) => [c[key], c]));

const GPC = Object.fromEntries(Object.entries(portfolioGolden)
  .filter(([, v]) => Array.isArray(v)).map(([k, v]) => [k, byKey(v, 'id')]));
const GAC = Object.fromEntries(Object.entries(afeGolden)
  .filter(([, v]) => Array.isArray(v) && v[0]?.name).map(([k, v]) => [k, byKey(v, 'name')]));

const ids = (projects) => projects.map((p) => p.id);

const attempt = (fn) => {
  try { return { ok: true, name: null, error: null, value: fn() }; } catch (e) { return { ok: false, name: e.name, error: e.message, value: null }; }
};

export const goldenCounts = () => ({
  portfolio: Object.values(portfolioGolden).filter(Array.isArray).reduce((s, v) => s + v.length, 0),
  afe: Object.values(afeGolden).filter(Array.isArray).reduce((s, v) => s + v.length, 0),
});

// ---------------------------------------------------------------------------
// THE TEACHING FIELDS, copied VERBATIM from /root/ec-wip-portfolio/ec5_dump.mjs.
// None of them is a golden case and none of them is graded anywhere.
// ---------------------------------------------------------------------------

// THE TEACHING INVENTORY. Integer capex in million USD, so the exact 1 million
// USD grid applies at every limit below 5000.
export const OKONO = [
  { id: 'OK-1', name: 'Infill drilling', capex: 120, npv_p50: 95, npv_p10: 150, npv_p90: 50, pos: 0.95, fail_cost: 10 },
  { id: 'OK-2', name: 'Gas compression', capex: 180, npv_p50: 130, npv_p10: 190, npv_p90: 80, pos: 0.9, fail_cost: 20 },
  { id: 'OK-3', name: 'Exploration well', capex: 90, npv_p50: 420, npv_p10: 700, npv_p90: 210, pos: 0.25, fail_cost: 85 },
  { id: 'OK-4', name: 'Waterflood', capex: 240, npv_p50: 210, npv_p10: 320, npv_p90: 120, pos: 0.8, fail_cost: 40 },
  { id: 'OK-5', name: 'Workovers', capex: 60, npv_p50: 38, npv_p10: 55, npv_p90: 22, pos: 1 },
  { id: 'OK-6', name: 'Satellite tie-back', capex: 310, npv_p50: 360, npv_p10: 560, npv_p90: 190, pos: 0.55, fail_cost: 120 },
];
export const OKONO_LIMITS = [300, 450, 600, 750, 1000];
// THE TEACHING AFE. A well AFE in USD over 2027, read at stated as-of dates.
export const OFON_AFE = { afe_number: 'OFON-1', start_date: '2027-02-01', end_date: '2027-11-30', currency: 'USD' };
export const OFON_ITEMS = [
  { code: 'DRL-01', description: 'Rig and drilling services', budget: 14200000, commitment: 2600000, actual: 9800000, progress: 72 },
  { code: 'CSG-02', description: 'Casing and tubulars', budget: 3900000, commitment: 0, actual: 4300000, progress: 100 },
  { code: 'CMT-03', description: 'Cementing', budget: 1250000, commitment: 300000, actual: 640000, forecast: 1400000, progress: 55 },
  { code: 'LOG-04', description: 'Logging and testing', budget: 2100000, commitment: 900000, actual: 350000, progress: 20 },
  { code: 'CMP-05', description: 'Completion', budget: 5600000, commitment: 1200000, actual: 0, progress: 0 },
];
export const OFON_INVOICES = [
  { invoice_date: '2027-02-20', amount: 3100000 },
  { invoice_date: '2027-04-10', amount: 5200000 },
  { invoice_date: '2027-06-05', amount: 4400000 },
  { invoice_date: '2027-07-18', amount: 2390000 },
];
export const OFON_AS_OF = ['2027-01-15', '2027-02-01', '2027-06-30', '2027-08-15', '2027-11-30', '2028-01-10'];
export const OFON_PARTNERS = [
  { name: 'Ofon Energy', working_interest: 40 },
  { name: 'Enang Petroleum', working_interest: 22.5 },
  { name: 'Mfem Resources', working_interest: 12.5 },
];

/** The as-of date the digest reads OFON-1's lines, S-curve and shares at. */
export const OFON_MID_AS_OF = '2027-08-15';
/** The day the digest was cut: its generator read the clock for the undated published cases of sections 9 and 10. */
export const DIGEST_CUT_DATE = '2026-09-14';
/** The generator's own fallback for the undated published metrics cases of sections 7 and 8. */
export const UNDATED_METRICS_AS_OF = '2030-01-01';
/** The two budgets whose frontiers the digest prints. */
export const FRONTIER_LIMITS = [450, 600];
/** The limit the greedy fill is tried at, and the limit whose set leaves money unspent. */
export const GREEDY_LIMIT = 450;
export const SLACK_LIMIT = 750;
/** The correlation sweep, and the funded set it is run on. */
export const RHO_SWEEP = [0, 0.3, 0.6, 0.9, 1];
export const CORRELATION_LIMIT = 600;
/** The seed and iteration table of section 15, on the funded set at 450. */
export const SEED_TABLE = [[P.DEFAULT_RISK_SEED, 1000], [P.DEFAULT_RISK_SEED, 10000], [P.DEFAULT_RISK_SEED, 40000], [1, 10000], [2, 10000], [3, 10000]];
/** The z multiplier the old normal approximation used for its P90 card. */
export const OLD_NORMAL_Z = 1.2816;

const okonoProject = (id) => clone(OKONO.find((p) => p.id === id));
const okonoRun = (limit) => P.optimizePortfolio({ projects: clone(OKONO), capexLimit: limit });
const ofonMetrics = (asOf, items = OFON_ITEMS, invoices = OFON_INVOICES) => A.calculateMetrics(clone(OFON_AFE), clone(items), clone(invoices), asOf);

/** A funded set as the digest joins it. */
export const setLabel = (projectIds = []) => projectIds.join(' + ') || 'none';

// ---------------------------------------------------------------------------
// SECTION 1. The portfolio engine, what it models and what it refuses.
// ---------------------------------------------------------------------------

export const RISKED_EMV_RULE = 'Risked EMV per project = pos x npv_p50 - (1 - pos) x fail_cost, pos the chance of success (0 to 1, default 1), fail_cost the loss if it fails (0 or more, default 0).';
export const KNAPSACK_RULE = 'The optimizer funds each project in full or not at all (a 0/1 knapsack) and maximises the summed risked EMV with total capex within the limit on its grid.';
export const GRID_RULE = 'Grid: 1 million USD per cell when the limit and every candidate capex are whole numbers and the limit is at most 5000; otherwise limit / 2000 per cell, each project weighing max(1, round(capex / cell)) cells.';
export const NEVER_FUNDED_RULE = 'A project with risked EMV of 0 or less is never funded; money may be left unspent.';

export const CLAMP_CASE_IDS = ['posAboveOneClamps', 'posBelowZeroClamps', 'negativeFailCostIsZero', 'nonNumericPosIsDefault', 'missingNpvIsZero'];

const emvCase = (id) => {
  const c = GPC.projectEmv[id];
  return { id, project: clone(c.project), emv: P.projectEmv(clone(c.project)), goldenEmv: c.expected.emv };
};

const portfolioRefusals = () => portfolioGolden.optimizeRefusals.map((c) => {
  const a = attempt(() => P.optimizePortfolio({ projects: clone(c.projects), capexLimit: c.capexLimit }));
  return { id: c.id, ok: a.ok, name: a.name, error: a.error };
});

/** The pos probe of section 1: npv_p50 80, fail_cost 30, pos typed four ways. */
export const POS_PROBE_PROJECT = { capex: 10, npv_p50: 80, fail_cost: 30 };
export const POS_PROBES = [['pos left out', undefined], ['pos null', null], ['pos typed as an empty string ""', ''], ['pos typed as "n/a"', 'n/a']];
/** The non-numeric capex probe of section 1 (finding EC5-7). */
export const TEXT_CAPEX_PROBE = { projects: [{ id: 'T', capex: 'abc', npv_p50: 50 }, { id: 'U', capex: 40, npv_p50: 30 }], capexLimit: 100 };

export const engineRules = () => {
  const textCapex = attempt(() => P.optimizePortfolio(clone(TEXT_CAPEX_PROBE)));
  return {
    seed: P.DEFAULT_RISK_SEED,
    iterations: P.DEFAULT_RISK_ITERATIONS,
    rules: [RISKED_EMV_RULE, KNAPSACK_RULE, GRID_RULE, NEVER_FUNDED_RULE],
    refusals: portfolioRefusals(),
    clampCases: CLAMP_CASE_IDS.map(emvCase),
    // A blank pos is the number 0, certain failure; an absent, null or
    // non-numeric one is read as 1 (finding EC5-6).
    posProbes: POS_PROBES.map(([label, pos]) => {
      const proj = pos === undefined ? clone(POS_PROBE_PROJECT) : { ...clone(POS_PROBE_PROJECT), pos };
      return { label, emv: P.projectEmv(proj) };
    }),
    textCapexProbe: textCapex.ok
      ? { ok: true, error: null, ids: ids(textCapex.value.optimalProjects), totalCapex: textCapex.value.totalCapex, totalEmv: textCapex.value.totalEmv }
      : { ok: false, error: textCapex.error, ids: [], totalCapex: null, totalEmv: null },
  };
};

// ---------------------------------------------------------------------------
// SECTION 2. Risking a project, the OKONO inventory.
// ---------------------------------------------------------------------------

export const SPREAD_DIVISOR = 2.5631;

export const okonoInventory = () => {
  const rows = clone(OKONO).map((p) => {
    const mo = P.projectMoments(p);
    return {
      ...p,
      failCost: p.fail_cost ?? 0,
      emv: P.projectEmv(p),
      successSpread: P.successStdDev(p),
      mixtureMean: mo.mean,
      mixtureVariance: mo.variance,
      mixtureSdDerived: Math.sqrt(mo.variance),
    };
  });
  const ok3 = okonoProject('OK-3');
  const ok3Emv = P.projectEmv(ok3);
  return {
    rows,
    hand: {
      id: ok3.id,
      pos: ok3.pos,
      failWeightDerived: 1 - ok3.pos,
      npvP50: ok3.npv_p50,
      failCost: ok3.fail_cost,
      emv: ok3Emv,
      emvShareOfSuccessDerived: ok3Emv / ok3.npv_p50,
    },
    publishedEmv: ['unrisked', 'risked', 'posZero'].map(emvCase),
    publishedSpread: ['explicitStddev', 'percentileFallback', 'invertedPercentiles', 'zeroStddevFallsBack'].map((id) => {
      const c = GPC.successStdDev[id];
      return { id, project: clone(c.project), sd: P.successStdDev(clone(c.project)), goldenSd: c.expected.sd };
    }),
  };
};

// ---------------------------------------------------------------------------
// SECTION 3. Choosing under a budget.
// ---------------------------------------------------------------------------

export const PUBLISHED_BUDGET_CASE_IDS = ['classic450', 'riskedVsSure', 'negativeNeverForced', 'zeroEmvExcluded', 'negativeEmvHugeBudget', 'limitBelowEveryProject', 'tieIdenticalProjects', 'tieDifferentComposition', 'exactFit'];

const runSummary = (o) => ({
  ids: ids(o.optimalProjects),
  totalCapex: o.totalCapex,
  totalEmv: o.totalEmv,
  totalNpvSuccess: o.totalNpvSuccess,
  capexLimit: o.capexLimit,
  unspentDerived: o.capexLimit - o.totalCapex,
  resolution: o.resolution,
  overLimit: o.overLimit,
  overLimitBy: o.overLimitBy,
});

const publishedOptimize = (id) => {
  const c = GPC.optimize[id];
  const o = P.optimizePortfolio({ projects: clone(c.projects), capexLimit: c.capexLimit, correlation: c.correlation, ...(clone(c.riskOptions) || {}) });
  return { id, capexLimit: c.capexLimit, o, c };
};

export const okonoBudgets = () => {
  const runs = Object.fromEntries(OKONO_LIMITS.map((lim) => [lim, okonoRun(lim)]));
  const ranking = [...clone(OKONO)].sort((a, b) => P.projectEmv(b) / b.capex - P.projectEmv(a) / a.capex);
  let spent = 0;
  const greedy = [];
  for (const p of ranking) { if (spent + p.capex <= GREEDY_LIMIT) { greedy.push(p); spent += p.capex; } }
  const slack = runs[SLACK_LIMIT];
  return {
    rows: OKONO_LIMITS.map((lim) => ({ limit: lim, ...runSummary(runs[lim]) })),
    ranking: ranking.map((p) => ({ id: p.id, emvPerCapexDerived: P.projectEmv(p) / p.capex })),
    greedy: {
      limit: GREEDY_LIMIT,
      ids: ids(greedy),
      capexDerived: spent,
      emvDerived: greedy.reduce((s, p) => s + P.projectEmv(p), 0),
      optimalIds: ids(runs[GREEDY_LIMIT].optimalProjects),
      optimalEmv: runs[GREEDY_LIMIT].totalEmv,
    },
    slack: {
      limit: SLACK_LIMIT,
      unspentDerived: slack.capexLimit - slack.totalCapex,
      tieBackCapex: okonoProject('OK-6').capex,
    },
    published: PUBLISHED_BUDGET_CASE_IDS.map((id) => {
      const { capexLimit, o, c } = publishedOptimize(id);
      return {
        id, capexLimit, ids: ids(o.optimalProjects), totalCapex: o.totalCapex, totalEmv: o.totalEmv,
        projects: c.projects.map((p) => ({ id: p.id, capex: p.capex, emv: P.projectEmv(clone(p)) })),
        goldenOptimalSets: c.expected.quantized.optimalSets.map((s) => s.ids),
      };
    }),
  };
};

// ---------------------------------------------------------------------------
// SECTION 4. The efficient frontier.
// ---------------------------------------------------------------------------

export const okonoFrontiers = () => {
  const frontiers = FRONTIER_LIMITS.map((lim) => {
    const o = okonoRun(lim);
    const points = o.frontierData.map((pt, i) => {
      const prev = o.frontierData[i - 1];
      return {
        index: i,
        capex: pt.capex,
        emv: pt.emv,
        emvGainedDerived: prev ? pt.emv - prev.emv : null,
        capexAddedDerived: prev ? pt.capex - prev.capex : null,
        emvPerExtraMillionDerived: prev ? (pt.emv - prev.emv) / (pt.capex - prev.capex) : null,
      };
    });
    return { limit: lim, points, ids: ids(o.optimalProjects), totalEmv: o.totalEmv, totalCapex: o.totalCapex };
  });
  // The set behind each point of the 600 frontier. DERIVED, as the digest
  // derives it: every subset of OKONO whose capex and risked EMV equal the point.
  const subsetsAt = (capex, emv) => {
    const n = OKONO.length;
    const hits = [];
    for (let mask = 0; mask < (1 << n); mask += 1) {
      // eslint-disable-next-line no-bitwise
      const sel = OKONO.filter((_, i) => (mask >> i) & 1);
      const c = sel.reduce((s, p) => s + p.capex, 0);
      const e = sel.reduce((s, p) => s + P.projectEmv(clone(p)), 0);
      if (Math.abs(c - capex) < 1e-9 && Math.abs(e - emv) < 1e-9) hits.push(ids(sel));
    }
    return hits;
  };
  const larger = frontiers[1];
  const smaller = frontiers[0];
  return {
    frontiers,
    setsBehindLargerFrontier: larger.points.map((pt) => ({ index: pt.index, setsDerived: subsetsAt(pt.capex, pt.emv) })),
    gainSmallerToLarger: {
      from: smaller.limit,
      to: larger.limit,
      emvGainedDerived: larger.totalEmv - smaller.totalEmv,
      capexAddedDerived: larger.totalCapex - smaller.totalCapex,
    },
    notNested: {
      smaller: { limit: FRONTIER_LIMITS[0], ids: frontiers[0].ids },
      larger: { limit: FRONTIER_LIMITS[1], ids: frontiers[1].ids },
      droppedAtLarger: frontiers[0].ids.filter((id) => !frontiers[1].ids.includes(id)),
    },
  };
};

// ---------------------------------------------------------------------------
// SECTION 5. The grid under the answer.
// ---------------------------------------------------------------------------

export const GRID_CASE_IDS = ['rawDollars', 'nonIntegerLimit', 'gridOvershoot', 'gridUndershoot', 'freeProjectZeroLimit', 'freeProjectTightLimit', 'freeProjectSlack'];

export const gridCases = () => GRID_CASE_IDS.map((id) => {
  const { capexLimit, o, c } = publishedOptimize(id);
  return {
    id,
    capexLimit,
    resolution: o.resolution,
    projects: c.projects.map((p) => ({ id: p.id, capex: p.capex, emv: P.projectEmv(clone(p)) })),
    ...runSummary(o),
    // The grid, DERIVED exactly as the digest restates the engine's rule.
    gridCellsDerived: Math.round(Math.max(0, Number(c.capexLimit) || 0) / o.resolution),
    cellWeightsDerived: c.projects.map((p) => ({ id: p.id, cells: Math.max(1, Math.round((Number(p.capex) || 0) / o.resolution)) })),
    gridUnspentDerived: Math.max(0, Number(c.capexLimit) - o.totalCapex),
    goldenExactEmv: c.expected.exact.optimalEmv,
    goldenExactSets: c.expected.exact.optimalSets.map((s) => s.ids),
    goldenGap: c.expected.quantizationGap,
    goldenSetChanged: c.expected.setChanged,
  };
});

// ---------------------------------------------------------------------------
// SECTION 6. An AFE and its lines, OFON-1.
// ---------------------------------------------------------------------------

export const ofonLines = () => {
  const mt = ofonMetrics(OFON_MID_AS_OF);
  return {
    afe: clone(OFON_AFE),
    asOf: OFON_MID_AS_OF,
    items: clone(OFON_ITEMS).map((i) => ({ ...i, enteredForecast: i.forecast ? i.forecast : null })),
    invoices: clone(OFON_INVOICES),
    invoiceTotalDerived: OFON_INVOICES.reduce((s, v) => s + v.amount, 0),
    totalBudget: mt.totalBudget,
    totalCommitments: mt.totalCommitments,
    totalActuals: mt.totalActuals,
  };
};

// ---------------------------------------------------------------------------
// SECTION 7. One forecast rule.
// ---------------------------------------------------------------------------

export const FORECAST_RULE = 'itemForecast: the entered forecast when it is positive, otherwise the larger of the budget and actual + commitment.';
/** CMT-03's budget, commitment and actual, with no forecast of its own: the probe line of section 7. */
export const FORECAST_PROBE_LINE = { code: 'X', budget: 1250000, commitment: 300000, actual: 640000, progress: 55 };
export const FORECAST_PROBES = [['entered forecast 0', 0], ['entered forecast 1 (below the 940000 already spent and committed)', 1], ['entered forecast 900000 (below the 940000 already spent and committed)', 900000], ['no entered forecast', undefined]];
export const FORECAST_CASE_NAMES = ['suite test: entered forecast', 'suite test: under budget forecasts the budget', 'suite test: committed past the budget', 'negative entered forecast is ignored (the S-curve ignores it too)'];

const publishedMetrics = (name, fallbackAsOf) => {
  const c = GAC.metrics[name];
  const asOfUsed = c.inputs.asOf ?? fallbackAsOf;
  return { c, asOfUsed, x: A.calculateMetrics(clone(c.inputs.afe), clone(c.inputs.costItems), clone(c.inputs.invoices), asOfUsed) };
};

export const forecastRule = () => {
  const mt = ofonMetrics(OFON_MID_AS_OF);
  return {
    rule: FORECAST_RULE,
    rows: clone(OFON_ITEMS).map((i) => {
      const fc = A.itemForecast(i);
      const spend = i.actual + i.commitment;
      const rule = (Number(i.forecast) || 0) > 0 ? 'entered' : (spend > i.budget ? 'actual + commitment' : 'budget');
      return {
        code: i.code, budget: i.budget, spendDerived: spend, enteredForecast: i.forecast ? i.forecast : null,
        itemForecast: fc, rule, lineVarianceDerived: i.budget - fc,
      };
    }),
    eac: mt.totalForecast,
    variance: mt.variance,
    // CMT-03's budget, commitment and actual with its entered forecast varied:
    // 0 falls back to the formula; any positive entry is taken as typed, even
    // one below the money already spent and committed (finding EC5-1).
    probes: FORECAST_PROBES.map(([label, fc]) => {
      const item = fc === undefined ? clone(FORECAST_PROBE_LINE) : { ...clone(FORECAST_PROBE_LINE), forecast: fc };
      return { label, enteredForecast: fc === undefined ? null : fc, itemForecast: A.itemForecast(item) };
    }),
    published: FORECAST_CASE_NAMES.map((name) => {
      const { c, asOfUsed, x } = publishedMetrics(name, UNDATED_METRICS_AS_OF);
      return { name, asOfUsed, items: clone(c.inputs.costItems), eac: x.totalForecast, variance: x.variance };
    }),
  };
};

// ---------------------------------------------------------------------------
// SECTION 8. Earned value.
// ---------------------------------------------------------------------------

export const EARNED_CASE_NAMES = ['suite test: weighted earned value', 'suite test: CPI 1.25', 'progress beyond 100 percent earns beyond the budget', 'suite test: empty AFE'];
export const PLANNED_VALUE_RULE = 'Planned value is the budget times the elapsed fraction of the window at the as-of date; SPI is earned value over planned value, and null where planned value is zero, except that an AFE whose budget is 0 reports SPI 1 by a guard that fires first (the published empty AFE below).';

export const earnedValue = () => {
  const mt = ofonMetrics(OFON_MID_AS_OF);
  return {
    asOf: OFON_MID_AS_OF,
    rows: clone(OFON_ITEMS).map((i) => ({
      code: i.code, budget: i.budget, progress: i.progress, earnedDerived: i.budget * i.progress / 100, actual: i.actual,
    })),
    earnedValue: mt.earnedValue,
    totalActuals: mt.totalActuals,
    cpi: mt.cpi,
    percentSpent: mt.percentSpent,
    percentComplete: mt.percentComplete,
    published: EARNED_CASE_NAMES.map((name) => {
      const { asOfUsed, x } = publishedMetrics(name, UNDATED_METRICS_AS_OF);
      return { name, asOfUsed, earnedValue: x.earnedValue, totalActuals: x.totalActuals, cpi: x.cpi, spi: x.spi };
    }),
  };
};

// ---------------------------------------------------------------------------
// SECTION 9. The as-of date.
// ---------------------------------------------------------------------------

export const AS_OF_CASE_NAMES = ['asOf mid-window: SPI against 256 of 729 days', 'asOf before the start: SPI null', 'asOf on the start day: no whole day elapsed, SPI null', 'asOf after the end: time progress 1', 'no dates: time progress 1'];

/** OFON-1 at one of the digest's six as-of dates. Any other date is refused: the panel's picker offers only these. */
export const ofonAsOf = (asOf) => {
  if (!OFON_AS_OF.includes(asOf)) {
    throw new Error(`OFON-1 is read at the digest's as-of dates only (${OFON_AS_OF.join(', ')}); ${asOf} is not one`);
  }
  const x = ofonMetrics(asOf);
  return {
    asOf, timeProgress: x.timeProgress, plannedValue: x.plannedValue, earnedValue: x.earnedValue,
    spi: x.spi, cpi: x.cpi, totalActuals: x.totalActuals, totalForecast: x.totalForecast,
  };
};

/** The two as-of dates whose whole-day counts the digest works by hand. */
export const DAY_COUNT_DATES = ['2027-06-30', '2027-08-15'];
const DAY_MS = 86400000;
const wholeDays = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / DAY_MS);

export const asOfTable = () => ({
  rows: OFON_AS_OF.map(ofonAsOf),
  // Whole days, DERIVED from the dates as the digest counts them; the ratio
  // matches the engine's time progress column.
  dayCounts: {
    windowDaysDerived: wholeDays(OFON_AFE.start_date, OFON_AFE.end_date),
    elapsed: DAY_COUNT_DATES.map((d) => ({
      asOf: d,
      elapsedDaysDerived: wholeDays(OFON_AFE.start_date, d),
      timeProgressDerived: wholeDays(OFON_AFE.start_date, d) / wholeDays(OFON_AFE.start_date, OFON_AFE.end_date),
    })),
  },
  published: AS_OF_CASE_NAMES.map((name) => {
    const { c, asOfUsed, x } = publishedMetrics(name, DIGEST_CUT_DATE);
    return {
      name,
      startDate: c.inputs.afe.start_date ?? null,
      endDate: c.inputs.afe.end_date ?? null,
      caseAsOf: c.inputs.asOf ?? null,
      asOfUsed,
      timeProgress: x.timeProgress,
      spi: x.spi,
    };
  }),
});

// ---------------------------------------------------------------------------
// SECTION 10. The S-curve.
// ---------------------------------------------------------------------------

export const S_CURVE_CASE_NAMES = ['suite test: 1200 over 2020 with two invoices', 'past window, asOf mid-year: actuals to June, forecast projected after', 'future window ending on a bucket: the last forecast point is the whole EAC', 'past window, all invoices unpaid: none dated'];

const publishedCurve = (name) => {
  const c = GAC.sCurve[name];
  const asOfUsed = c.inputs.asOf ?? DIGEST_CUT_DATE;
  return { c, asOfUsed, pts: A.generateSCurveData(clone(c.inputs.afe), clone(c.inputs.costItems), clone(c.inputs.invoices), asOfUsed) };
};

// TIMEZONE (finding EC5-5). generateSCurveData parses the window as UTC
// midnight but steps months and prints labels in LOCAL time. Every value here
// is the engine's, in whatever timezone the lab runs: the digest and the lab
// tests are pinned to UTC, and a browser west of UTC (America/Los_Angeles, say)
// labels OFON-1's first point "Jan 27" and shifts every Planned value. Lagos
// agrees with UTC. The panels show what the lab returns and say so.
export const sCurve = () => {
  const points = A.generateSCurveData(clone(OFON_AFE), clone(OFON_ITEMS), clone(OFON_INVOICES), OFON_MID_AS_OF);
  const mt = ofonMetrics(OFON_MID_AS_OF);
  const cutIndex = points.map((p) => p.Actual !== null).lastIndexOf(true);
  return {
    asOf: OFON_MID_AS_OF,
    points,
    plannedAddedDerived: points.map((p, i) => (i ? p.Planned - points[i - 1].Planned : null)),
    lastForecast: points[points.length - 1].Forecast,
    eac: mt.totalForecast,
    variance: mt.variance,
    pointCount: points.length,
    cutIndex,
    cutLabel: cutIndex >= 0 ? points[cutIndex].date : null,
    lastPlanned: points[points.length - 1].Planned,
    totalBudget: mt.totalBudget,
    lastActual: points[cutIndex].Actual,
    firstProjectedForecast: points.find((p) => p.Actual === null).Forecast,
    published: S_CURVE_CASE_NAMES.map((name) => {
      const { c, asOfUsed, pts } = publishedCurve(name);
      return {
        name,
        startDate: c.inputs.afe.start_date,
        endDate: c.inputs.afe.end_date,
        caseAsOf: c.inputs.asOf ?? null,
        asOfUsed,
        lines: clone(c.inputs.costItems),
        invoices: clone(c.inputs.invoices),
        pointCount: pts.length,
        first: pts[0],
        last: pts[pts.length - 1],
      };
    }),
  };
};

// ---------------------------------------------------------------------------
// SECTION 11. Portfolio risk by simulation.
// ---------------------------------------------------------------------------

export const DRAW_ORDER = 'Draw order per iteration: F1, F2, then for each project in array order e1, e2, all from randomNormal on mulberry32(seed). z1 = sqrt(rho) F1 + sqrt(1 - rho) e1 decides success (normalCDF(z1) < pos); z2 = sqrt(rho) F2 + sqrt(1 - rho) e2 scales the success spread. Every normal is drawn whether or not it is used.';

/** What the pre-EC5-0 normal approximation would have said, rebuilt from the engine's own emv and stdDev. */
const oldNormalProbLoss = (risk) => (risk.stdDev > 0 ? ST.normalCDF(-risk.emv / risk.stdDev) : (risk.emv < 0 ? 1 : 0));

export const riskMethods = () => ({
  drawOrder: DRAW_ORDER,
  published: portfolioGolden.riskMethod.map((c) => {
    const x = P.portfolioRiskMetrics(clone(c.selected), c.correlation, clone(c.riskOptions));
    return {
      id: c.id,
      kind: c.kind,
      projectCount: c.selected.length,
      goldenExactProbLoss: c.exact.probLoss,
      goldenNormalProbLoss: c.normalApprox.probLoss,
      engineProbLoss: x.probLoss,
      goldenStandardError: c.probLossSE,
      goldenZ: c.probLossZ,
      // The exact low case: a discrete outcome, or a continuous value (a
      // number, or an object carrying `value`), or none published.
      goldenExactP90Outcome: c.exact.p90?.outcome !== undefined ? c.exact.p90.outcome : null,
      goldenExactP90Continuous: c.exact.p90?.outcome !== undefined ? null
        : (typeof c.exact.p90 === 'number' ? c.exact.p90 : (c.exact.p90?.value !== undefined ? c.exact.p90.value : null)),
      correlation: c.correlation,
      riskOptions: clone(c.riskOptions),
      selected: clone(c.selected),
      goldenNormalP90: c.normalApprox.p90,
      engineP90: x.p90,
      seed: x.seed,
      iterations: x.iterations,
    };
  }),
  okono: OKONO_LIMITS.map((lim) => {
    const o = okonoRun(lim);
    const x = o.risk;
    return {
      limit: lim, ids: ids(o.optimalProjects), emv: x.emv, stdDev: x.stdDev, probLoss: x.probLoss, p90: x.p90, p10: x.p10,
      seed: x.seed, iterations: x.iterations,
      normalProbLossDerived: oldNormalProbLoss(x),
      normalP90Derived: x.emv - OLD_NORMAL_Z * x.stdDev,
    };
  }),
});

// ---------------------------------------------------------------------------
// SECTION 12. Correlation.
// ---------------------------------------------------------------------------

export const CORRELATION_CASE_IDS = ['correlation_0', 'correlation_0p5', 'correlation_1', 'clampAbove', 'clampBelow', 'singleProject'];
export const SPREAD_FORMULA = 'sqrt(sum var + rho x ((sum sd)^2 - sum var))';

export const correlation = () => {
  const set = okonoRun(CORRELATION_LIMIT).optimalProjects;
  const sds = set.map((p) => Math.sqrt(P.projectMoments(p).variance));
  const varSum = sds.reduce((s, v) => s + v * v, 0);
  const sdSum = sds.reduce((s, v) => s + v, 0);
  return {
    limit: CORRELATION_LIMIT,
    ids: ids(set),
    projectSdsDerived: sds,
    varianceSumDerived: varSum,
    sdSumSquaredDerived: sdSum * sdSum,
    formula: SPREAD_FORMULA,
    rows: RHO_SWEEP.map((rho) => {
      const x = P.portfolioRiskMetrics(clone(set), rho);
      return {
        rho, stdDev: x.stdDev, independentStdDev: x.independentStdDev,
        formulaDerived: Math.sqrt(varSum + rho * (sdSum * sdSum - varSum)),
        emv: x.emv, probLoss: x.probLoss, p90: x.p90, p10: x.p10, seed: x.seed, iterations: x.iterations,
      };
    }),
    published: CORRELATION_CASE_IDS.map((id) => {
      const c = GPC.riskMetrics[id];
      const x = P.portfolioRiskMetrics(clone(c.selected), c.correlation === 'NaN' ? NaN : c.correlation, c.useEngineDefaults ? undefined : clone(c.riskOptions));
      return { id, correlationUsed: x.correlation, stdDev: x.stdDev, probLoss: x.probLoss, goldenStdDev: c.expected.stdDev };
    }),
  };
};

// ---------------------------------------------------------------------------
// SECTION 13. Joint venture shares.
// ---------------------------------------------------------------------------

export const PARTNER_CASE_NAMES = ['suite test: 70 and 45 is more than the whole', 'suite test: a 10 percent shortfall is valid', 'negative interest: refused, allocation still shown', 'negative interest and a total over 100: both sentences, negative first', 'suite test: no partners'];

const splitSummary = (s) => ({
  partners: s.partnerAllocations.map((p) => ({ name: p.name, workingInterest: p.working_interest, shareAmount: p.shareAmount })),
  operatorShare: s.operatorShare,
  operatorAmount: s.operatorAmount,
  partnerTotal: s.partnerTotal,
  valid: s.valid,
  note: s.note,
});

export const partnerShares = () => {
  const mt = ofonMetrics(OFON_MID_AS_OF);
  const split = A.calculatePartnerCosts(mt.totalBudget, clone(OFON_PARTNERS));
  const billed = A.calculatePartnerCosts(mt.totalActuals, clone(OFON_PARTNERS));
  return {
    budget: { cost: mt.totalBudget, ...splitSummary(split), sharesSumDerived: split.partnerAllocations.reduce((s, p) => s + p.shareAmount, 0) + split.operatorAmount },
    billed: { cost: mt.totalActuals, ...splitSummary(billed) },
    published: PARTNER_CASE_NAMES.map((name) => {
      const c = GAC.partnerSplit[name];
      const x = A.calculatePartnerCosts(c.inputs.totalCost, clone(c.inputs.partners));
      return {
        name,
        cost: c.inputs.totalCost,
        interests: c.inputs.partners.map((p) => p.working_interest),
        partnerAmounts: x.partnerAllocations.map((p) => p.shareAmount),
        operatorShare: x.operatorShare,
        operatorAmount: x.operatorAmount,
        valid: x.valid,
        note: x.note,
      };
    }),
  };
};

// ---------------------------------------------------------------------------
// SECTION 14. Refusals and flags.
// ---------------------------------------------------------------------------

export const REPAIRED = 'Repaired in EC5-0: the risk summary (simulation, seed shown), the overshoot flag, the negative capex refusal, the as-of date, SPI null, the S-curve bounded to its window, one forecast rule, negative progress refused, a negative working interest flagged. The Suite repair removed the invented partners and integrations, added AFE dates, one EAC rule on every screen and the resolution and overshoot on screen.';
export const NOT_REPAIRED = 'Not repaired (findings, taught as properties): the grid undershoot (D4) and the free project charged a cell (D2); CPI reported as 1 before any money is spent; SPI 1 on a zero-budget AFE; time progress 1 on an AFE with no dates; an entered forecast below the money already spent taken as typed; an invoice with a null date counted from 1970 while an invoice with no date field is silently dropped; progress above 100 percent accepted although the refusal message says progress runs from 0 to 100; a blank pos read as certain failure; a non-numeric capex neither refused nor flagged; S-curve labels and plan shifting with the viewer\'s timezone west of UTC; the S-curve plan stopping short of the budget and its forecast ignoring actuals after the as-of date; the correlation slider stopping at 0.9; the unused risk score.';

export const refusalsAndFlags = () => {
  const { o } = publishedOptimize('gridOvershoot');
  return {
    portfolio: portfolioRefusals(),
    afe: afeGolden.metricsRefusals.map((c) => {
      const a = attempt(() => A.calculateMetrics(clone(c.inputs.afe), clone(c.inputs.costItems), clone(c.inputs.invoices), c.inputs.asOf));
      return { name: c.name, asOf: c.inputs.asOf, ok: a.ok, errorName: a.name, error: a.error };
    }),
    overshoot: { id: 'gridOvershoot', overLimit: o.overLimit, overLimitBy: o.overLimitBy, totalCapex: o.totalCapex, capexLimit: o.capexLimit },
    repaired: REPAIRED,
    notRepaired: NOT_REPAIRED,
  };
};

// ---------------------------------------------------------------------------
// SECTION 15. Numbers to distrust.
// ---------------------------------------------------------------------------

export const NULL_DATED_CASE_NAME = 'past window, all invoices unpaid: none dated';
export const MODEL_LIMITS = 'What a portfolio model cannot tell you, as properties of these modules: projects are funded whole; capex is spent in one period and never phased; there is no time value beyond the NPVs entered; correlation is one average number; the success spread is normal; the AFE plan is a straight line; earned value is only as good as the progress typed in.';

export const distrust = () => {
  const noSpend = ofonMetrics(OFON_MID_AS_OF, OFON_ITEMS.map((i) => ({ ...i, actual: 0 })), []);
  const { c, asOfUsed, pts } = publishedCurve(NULL_DATED_CASE_NAME);
  const curve = A.generateSCurveData(clone(OFON_AFE), clone(OFON_ITEMS), clone(OFON_INVOICES), OFON_MID_AS_OF);
  const mt = ofonMetrics(OFON_MID_AS_OF);
  const set450 = okonoRun(GREEDY_LIMIT).optimalProjects;
  const lastPlanned = curve[curve.length - 1].Planned;
  return {
    cpiBeforeSpend: { asOf: OFON_MID_AS_OF, cpi: noSpend.cpi, earnedValue: noSpend.earnedValue, totalActuals: noSpend.totalActuals },
    nullDated: { name: NULL_DATED_CASE_NAME, asOfUsed, invoices: clone(c.inputs.invoices), firstActual: pts[0].Actual, lastActual: pts[pts.length - 1].Actual },
    shortPlan: { lastPlanned, totalBudget: mt.totalBudget, shortDerived: mt.totalBudget - lastPlanned },
    // An overrun drawn as an underrun: the curve's last Forecast point sits
    // below the budget while the EAC is above it.
    underrunPicture: { lastForecast: curve[curve.length - 1].Forecast, totalBudget: mt.totalBudget, eac: mt.totalForecast, variance: mt.variance },
    seedTable: {
      limit: GREEDY_LIMIT,
      ids: ids(set450),
      rows: SEED_TABLE.map(([seed, it]) => {
        const x = P.portfolioRiskMetrics(clone(set450), 0, { seed, iterations: it });
        return { seed, iterations: it, probLoss: x.probLoss, standardErrorDerived: Math.sqrt(x.probLoss * (1 - x.probLoss) / it), p90: x.p90 };
      }),
    },
    modelLimits: MODEL_LIMITS,
  };
};

// ---------------------------------------------------------------------------
// SECTION 16. The teaching fields end to end.
// ---------------------------------------------------------------------------

export const endToEnd = () => {
  const mt = ofonMetrics(OFON_MID_AS_OF);
  const split = A.calculatePartnerCosts(mt.totalBudget, clone(OFON_PARTNERS));
  return {
    okono: FRONTIER_LIMITS.map((lim) => {
      const o = okonoRun(lim);
      return { limit: lim, ids: ids(o.optimalProjects), totalCapex: o.totalCapex, totalEmv: o.totalEmv, probLoss: o.risk.probLoss, p90: o.risk.p90 };
    }),
    ofon: { asOf: OFON_MID_AS_OF, eac: mt.totalForecast, variance: mt.variance, earnedValue: mt.earnedValue, cpi: mt.cpi, spi: mt.spi },
    operator: { share: split.operatorShare, budget: mt.totalBudget, amount: split.operatorAmount },
  };
};

// ===========================================================================
// THE CAPSTONE. IDOHO ONLY. NOT FOR LESSONS, NOT FOR PANELS.
//
// EVERYTHING BELOW THIS LINE IS CAPSTONE MATERIAL. IDOHO's inventory, limits,
// excluded project, correlation, AFE, cost lines, as-of date and partners are
// copied VERBATIM from /root/ec-wip-portfolio/ec5_fields.mjs so the grader, the
// lab's own tests and the migration headers all read one derivation. Every
// name carries IDOHO or idoho, and panelCapstoneGuard.test.js greps the three
// panel sources and the learning page for every one of them. The leak gate in
// portfolioLab.test.js checks every TEACHING export's return values against
// the eighteen graded answers.
//
// The teaching digest and the capstone are two files with opposite audiences
// and they never share a number.
// ===========================================================================

export const IDOHO = [
  { id: 'ID-1', name: 'Infill wells', capex: 145, npv_p50: 118.4, npv_p10: 176.2, npv_p90: 71.5, pos: 0.92, fail_cost: 14.6 },
  { id: 'ID-2', name: 'Compression upgrade', capex: 215, npv_p50: 163.7, npv_p10: 241.9, npv_p90: 102.3, pos: 0.86, fail_cost: 23.8 },
  { id: 'ID-3', name: 'Near-field exploration', capex: 105, npv_p50: 388.5, npv_p10: 655.4, npv_p90: 198.7, pos: 0.3, fail_cost: 72.4 },
  { id: 'ID-4', name: 'Water injection', capex: 265, npv_p50: 231.9, npv_p10: 338.6, npv_p90: 141.2, pos: 0.78, fail_cost: 46.3 },
  { id: 'ID-5', name: 'Well interventions', capex: 75, npv_p50: 47.3, npv_p10: 63.8, npv_p90: 31.6, pos: 0.97, fail_cost: 5.1 },
  { id: 'ID-6', name: 'Subsea tie-back', capex: 340, npv_p50: 402.6, npv_p10: 611.3, npv_p90: 224.8, pos: 0.5, fail_cost: 131.5 },
  { id: 'ID-7', name: 'Flare recovery', capex: 190, npv_p50: 121.2, npv_p10: 170.4, npv_p90: 79.9, pos: 0.88, fail_cost: 18.7 },
];
export const IDOHO_LIMITS = { first: 520, second: 640, third: 900 };
export const IDOHO_EXCLUDED = 'ID-3';
export const IDOHO_RHO = 0.45;
export const IDOHO_AFE = { afe_number: 'IDOHO-2', start_date: '2028-03-06', end_date: '2029-01-19', currency: 'USD' };
export const IDOHO_ITEMS = [
  { code: 'RIG-01', description: 'Rig and drilling services', budget: 11384650, commitment: 1937400, actual: 8215730, progress: 67.5 },
  { code: 'TUB-02', description: 'Casing and tubulars', budget: 2963180, commitment: 0, actual: 3148920, progress: 100 },
  { code: 'CEM-03', description: 'Cementing', budget: 1476325, commitment: 412600, actual: 688140, forecast: 1591870, progress: 48 },
  { code: 'EVL-04', description: 'Evaluation and testing', budget: 3208470, commitment: 1265300, actual: 1418260, progress: 37.5 },
  { code: 'CPL-05', description: 'Completion', budget: 4719850, commitment: 873900, actual: 0, progress: 0 },
];
export const IDOHO_AS_OF = '2028-10-03';
export const IDOHO_PARTNERS = [
  { name: 'Asabo Oil', working_interest: 37.25 },
  { name: 'Okwori Energy', working_interest: 18.6 },
  { name: 'Ebok Resources', working_interest: 9.15 },
];

const IDOHO_MONEY = 0.001; // million USD
const IDOHO_USD = 0.5; // whole AFE currency units
const IDOHO_RATIO = 0.00001;
const IDOHO_PROB = 0.00005;

/** The capstone runs, exactly as the derivation makes them. */
export const idohoRuns = () => {
  const inv = () => clone(IDOHO);
  const o1 = P.optimizePortfolio({ projects: inv(), capexLimit: IDOHO_LIMITS.first });
  const o2 = P.optimizePortfolio({ projects: inv(), capexLimit: IDOHO_LIMITS.second });
  const o3 = P.optimizePortfolio({ projects: inv(), capexLimit: IDOHO_LIMITS.third });
  const oExcl = P.optimizePortfolio({ projects: inv().filter((p) => p.id !== IDOHO_EXCLUDED), capexLimit: IDOHO_LIMITS.first });
  const risk0 = P.portfolioRiskMetrics(o2.optimalProjects, 0);
  const riskRho = P.portfolioRiskMetrics(o2.optimalProjects, IDOHO_RHO);
  const mt = A.calculateMetrics(clone(IDOHO_AFE), clone(IDOHO_ITEMS), [], IDOHO_AS_OF);
  const split = A.calculatePartnerCosts(mt.totalActuals, clone(IDOHO_PARTNERS));
  return { o1, o2, o3, oExcl, risk0, riskRho, mt, split };
};

/**
 * The eighteen graded fields as [tier, key, value, tolerance], in the order and
 * with the tolerances the capstone publishes. THE TOLERANCE IS ABSOLUTE, in the
 * field's own units: academy_submit_capstone grades abs(v_got - v_exp) <= v_tol.
 */
export const idohoCapstoneFields = () => {
  const { o1, o2, o3, oExcl, risk0, riskRho, mt, split } = idohoRuns();
  return [
    ['beginner', 'id_emv_at_first_limit_musd', o1.totalEmv, IDOHO_MONEY],
    ['beginner', 'id_emv_at_second_limit_musd', o2.totalEmv, IDOHO_MONEY],
    ['beginner', 'id_emv_at_third_limit_musd', o3.totalEmv, IDOHO_MONEY],
    ['beginner', 'id_success_npv_at_first_limit_musd', o1.totalNpvSuccess, IDOHO_MONEY],
    ['beginner', 'id_value_of_excluded_project_musd', o1.totalEmv - oExcl.totalEmv, IDOHO_MONEY],
    ['beginner', 'id_risked_emv_tie_back_musd', P.projectEmv(clone(IDOHO[5])), IDOHO_MONEY],
    ['intermediate', 'id_eac_usd', mt.totalForecast, IDOHO_USD],
    ['intermediate', 'id_variance_at_completion_usd', mt.variance, IDOHO_USD],
    ['intermediate', 'id_earned_value_usd', mt.earnedValue, IDOHO_USD],
    ['intermediate', 'id_planned_value_usd', mt.plannedValue, IDOHO_USD],
    ['intermediate', 'id_cpi', mt.cpi, IDOHO_RATIO],
    ['intermediate', 'id_spi', mt.spi, IDOHO_RATIO],
    ['advanced', 'id_p90_npv_second_limit_independent_musd', risk0.p90, IDOHO_MONEY],
    ['advanced', 'id_stddev_second_limit_correlated_musd', riskRho.stdDev, IDOHO_MONEY],
    ['advanced', 'id_prob_loss_second_limit_correlated', riskRho.probLoss, IDOHO_PROB],
    ['advanced', 'id_p90_npv_second_limit_correlated_musd', riskRho.p90, IDOHO_MONEY],
    ['advanced', 'id_second_partner_billed_usd', split.partnerAllocations[1].shareAmount, IDOHO_USD],
    ['advanced', 'id_operator_billed_usd', split.operatorAmount, IDOHO_USD],
  ];
};

/** The graded answers keyed by field. A field list already in hand can be passed in. */
export const idohoCapstoneValues = (fieldList) =>
  Object.fromEntries((fieldList ?? idohoCapstoneFields()).map(([, key, v]) => [key, v]));

/** The grading tolerance of each field, absolute, in the field's own units. */
export const idohoCapstoneTolerances = (fieldList) =>
  Object.fromEntries((fieldList ?? idohoCapstoneFields()).map(([, key, , tol]) => [key, tol]));

/**
 * Every export of this module that is built on the capstone. The panel guard
 * greps the panel sources for each name; the leak gate skips each one when it
 * walks the teaching surface.
 */
export const CAPSTONE_ONLY_EXPORTS = [
  'IDOHO', 'IDOHO_LIMITS', 'IDOHO_EXCLUDED', 'IDOHO_RHO', 'IDOHO_AFE', 'IDOHO_ITEMS', 'IDOHO_AS_OF', 'IDOHO_PARTNERS',
  'idohoRuns', 'idohoCapstoneFields', 'idohoCapstoneValues', 'idohoCapstoneTolerances',
  'CAPSTONE_ONLY_EXPORTS',
];

// ---------------------------------------------------------------------------
// The leak guard machinery, the EC3 course's, unchanged.
// ---------------------------------------------------------------------------

/** How much wider than the grader's own band a teaching number has to stand clear. */
export const LEAK_GUARD_MARGIN = 10;

/** The unit shifts a number can be restated under and still be the same answer. */
export const LEAK_GUARD_SCALINGS = [
  { factor: 1, tag: 'as graded' },
  { factor: 1000, tag: 'x1000' },
  { factor: 0.001, tag: 'x0.001' },
];

/**
 * Every forbidden neighbourhood: eighteen answers, three shiftings, ten times
 * the grading band, the band SCALED with the shifting because the grader's
 * tolerance is absolute in the field's own units.
 */
export const leakGuardTargets = (fieldList) => {
  const out = [];
  fieldList.forEach(([tier, key, v, tol]) => {
    LEAK_GUARD_SCALINGS.forEach(({ factor, tag }) => {
      const gradingBand = tol * Math.abs(factor);
      out.push({ tier, key, tag, value: v * factor, gradingBand, band: LEAK_GUARD_MARGIN * gradingBand });
    });
  });
  return out;
};

/** The target a number collides with, or null. Dimension blind: a box takes any number. */
export const leakGuardHit = (v, targets) => {
  if (!Number.isFinite(v)) return null;
  for (const t of targets) {
    if (Math.abs(v - t.value) < t.band) return t;
  }
  return null;
};

/** Every finite number reachable inside a value, with the path it sits at. */
export const collectNumbers = (v, path = '', out = [], depth = 0) => {
  if (depth > 12) return out;
  if (typeof v === 'number') {
    if (Number.isFinite(v)) out.push({ path, value: v });
    return out;
  }
  if (Array.isArray(v)) {
    v.forEach((x, i) => collectNumbers(x, `${path}[${i}]`, out, depth + 1));
    return out;
  }
  if (v && typeof v === 'object') {
    Object.entries(v).forEach(([k, x]) => collectNumbers(x, path ? `${path}.${k}` : k, out, depth + 1));
  }
  return out;
};
