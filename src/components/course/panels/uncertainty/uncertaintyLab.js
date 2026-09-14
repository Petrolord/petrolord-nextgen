// Teaching lab for EC3, Probabilistic Economics. The three panels, the course
// page and the vitest file all read this one module, so a number shown to a
// learner and a number a test pins cannot drift apart.
//
// EVERYTHING HERE IS THE VENDORED ENGINES' OWN OUTPUT. Every ledger row, every
// fit, every draw, every breakeven price, every percentile and every insight
// sentence below is a return value of engines/economics/screening.js (the NPV
// Scenario Builder), engines/economics/breakeven.js (the Probabilistic
// Breakeven Analyzer) or lib/stats/stats.js, as repaired in EC3-0. Every
// percentile word is a return value of lib/conventions/percentile.js, imported
// and never retyped.
//
// NOTHING IN THIS FILE COMPUTES AN ECONOMIC QUANTITY. Where a reader carries a
// value the digest calls "derived", it is arithmetic on numbers the engine
// returned (or on the inputs the engine was handed) with the arithmetic stated,
// and the key name says Derived. The lab and /root/ec-wip-uncertainty/digest.txt
// agree because both call the engines on the same inputs, not because either
// copied the other.
//
// UNITS. Money is millions of United States dollars, prices USD per bbl,
// production bbl a year, rates percent 0 to 100, draws and ratios plain
// fractions.
//
// PURITY. Every function is pure and deterministic. Every Monte Carlo reader
// hands the engine its seed EXPLICITLY, so two calls with the same arguments
// return the same numbers in the same order. Nothing is memoised. The readers
// over runMonteCarlo are async because THE ENGINE'S runMonteCarlo is declared
// async.
//
// COST. A breakeven run at 5000 iterations is several thousand bisections; the
// readers that make one say so, and the panels run them on request.

import screeningGolden from '@petrolord/engines/test-data/economics/goldens/screening_cases.json';
import breakevenGolden from '@petrolord/engines/test-data/economics/goldens/breakeven_cases.json';
import {
  calculateEconomics, runSensitivityAnalysis, generateScenarios, runMonteCarlo, expandQuickInputs,
  // eslint's node resolver finds node_modules/@petrolord/engines first, a symlink to the SHARED
  // checkout's engines, which predate EC3-0 and do not export this. Vite and vitest resolve the
  // alias to this worktree's packages/engines, which does (screening.js, DEFAULT_MC_SEED).
  // eslint-disable-next-line import/named
  DEFAULT_MC_SEED,
} from '@petrolord/engines/engines/economics/screening.js';
import {
  DEFAULT_SEED, npvAtPrice, solveBreakevenPrice, generateBreakevenData,
} from '@petrolord/engines/engines/economics/breakeven.js';
import {
  mulberry32, fitTriangularToPercentiles, triInvCDF, quantile,
} from '@petrolord/engines/lib/stats/stats.js';
import {
  EXCEEDANCE_DEFINITION, OUTCOME_LABELS, CASES, PARAMETER_ORDER, PARAMETER_PERCENTILES,
  parameterPercentileLabel, casePercentile, caseLabel, outcomeOrderViolation,
} from '@petrolord/engines/lib/conventions/percentile.js';

export { DEFAULT_MC_SEED, DEFAULT_SEED };

// ---------------------------------------------------------------------------
// Helpers. Pure, and none of them computes an economic quantity.
// ---------------------------------------------------------------------------

const clone = (o) => JSON.parse(JSON.stringify(o));
const byId = (list) => Object.fromEntries(list.map((c) => [c.id, c]));

const SC = Object.fromEntries(
  Object.entries(screeningGolden).filter(([, v]) => Array.isArray(v)).map(([k, v]) => [k, byId(v)]));
const BC = { monteCarlo: byId(breakevenGolden.monteCarlo), solve: byId(breakevenGolden.solve) };

export const goldenCounts = () => ({
  screening: Object.values(screeningGolden).filter(Array.isArray).reduce((s, v) => s + v.length, 0),
  breakeven: breakevenGolden.monteCarlo.length + breakevenGolden.solve.length,
});

// ---------------------------------------------------------------------------
// THE TEACHING FIELDS, copied VERBATIM from /root/ec-wip-uncertainty/ec3_dump.mjs.
// None of them is a golden case and none of them is graded anywhere.
// ---------------------------------------------------------------------------

// THE TEACHING FIELD. Scenario Builder quick inputs near the app's own
// defaults; the same field's oil profile feeds the Breakeven Analyzer.
export const ISIALA = { initialRate: 4400, declineRate: 12, oilPrice: 70, capex: 180, fixedOpex: 2.5, opexPerBbl: 13, royaltyRate: 15, taxRate: 35, discountRate: 12, startYear: 2027 };
// ISIALA's breakeven beliefs: three exact fits, and one narrow opex belief
// that no triangular can honour.
export const BELIEF = { capex: [150, 180, 220], opex: [16, 20, 26], eff: [85, 91, 96] };
export const NARROW_OPEX = [16, 17, 26];
// Two edge fields. OKPOMA pays back inside its first year, dips below zero in
// its second and still reports a payback of 0; its only IRR root is negative
// and the engine reports its Newton clamp of 1000. NTEJE never pays back, has
// no root at all, and still reports an IRR of 1000.
export const OKPOMA = { initialRate: 6800, declineRate: 18, oilPrice: 78, capex: 260, fixedOpex: 4, opexPerBbl: 10, royaltyRate: 10, taxRate: 40, discountRate: 10, startYear: 2027 };
export const NTEJE = { initialRate: 3000, declineRate: 20, oilPrice: 66, capex: 240, fixedOpex: 6, opexPerBbl: 14, royaltyRate: 15, taxRate: 30, discountRate: 12, startYear: 2027 };
export const APP_MC = { iterations: 1000, uncertainties: { price: 0.2, capex: 0.2, reserves: 0.2 } };

export const FIELD_KEYS = ['isiala', 'okpoma', 'nteje'];
export const FIELD_LABELS = {
  isiala: 'ISIALA, the teaching field',
  okpoma: 'OKPOMA, the edge field that pays back in year 1 and then dips',
  nteje: 'NTEJE, the edge field that never pays back',
};
const FIELDS = { isiala: ISIALA, okpoma: OKPOMA, nteje: NTEJE };

const field = (key) => {
  const q = FIELDS[key];
  if (!q) throw new Error(`no teaching field named ${key}; the fields are ${FIELD_KEYS.join(', ')}`);
  return clone(q);
};

/** One line of prose for a field's quick inputs, exactly as the digest words it. */
export const quickLine = (q) => `${q.initialRate} bopd declining ${q.declineRate} percent a year, oil ${q.oilPrice} USD/bbl, capex ${q.capex} $MM (half in each of the first two years), fixed opex ${q.fixedOpex} $MM a year, variable opex ${q.opexPerBbl} USD/bbl, royalty ${q.royaltyRate} percent, tax ${q.taxRate} percent, discount rate ${q.discountRate} percent, first year ${q.startYear}`;

const expanded = (key) => expandQuickInputs(field(key));
const economics = (key) => calculateEconomics(expanded(key));

/** ISIALA's oil profile as the Breakeven Analyzer takes it. */
const isialaRows = () => {
  const inp = expanded('isiala');
  return inp.production.oil.map((q, i) => ({ year: ISIALA.startYear + i, oil_production_bbl: q }));
};

/** The Breakeven Analyzer's inputs for ISIALA, exactly as the digest builds them. */
const beInputs = (belief, opex = belief.opex, extra = {}) => ({
  iterations: 5000, seed: DEFAULT_SEED, discountRate: ISIALA.discountRate, royaltyRate: ISIALA.royaltyRate, taxRate: ISIALA.taxRate, targetNpv: 0,
  productionData: { data: isialaRows() },
  variables: [
    { id: 1, name: 'Total CAPEX ($MM)', p10: belief.capex[0], p50: belief.capex[1], p90: belief.capex[2] },
    { id: 2, name: 'Annual OPEX ($MM/year)', p10: opex[0], p50: opex[1], p90: opex[2] },
    { id: 3, name: 'Production Efficiency (%)', p10: belief.eff[0], p50: belief.eff[1], p90: belief.eff[2] },
  ],
  ...extra,
});

/** The engine key that holds a parameter percentile: q10 is kept under `p10`. */
const engineKeyOf = (q) => `p${PARAMETER_PERCENTILES[q]}`;

/** The engine's tornado as rows, in the engine's own rank order. */
export const tornadoRows = (tornadoData) => tornadoData.y.map((name, i) => ({
  rank: i + 1,
  variable: name,
  low: tornadoData.low[i],
  high: tornadoData.high[i],
  swingDerived: tornadoData.high[i] - tornadoData.low[i],
}));

/** A breakeven run's three percentiles, worded by the convention module. */
const pricePercentiles = (res) => {
  const n = res.plotData.cdf.x.length;
  return PARAMETER_ORDER.map((q) => ({
    key: q,
    engineKey: engineKeyOf(q),
    label: parameterPercentileLabel('breakeven price', q),
    sortedIndexDerived: Math.min(n - 1, Math.floor((PARAMETER_PERCENTILES[q] / 100) * n)),
    value: res.kpis[engineKeyOf(q)],
  }));
};

// ---------------------------------------------------------------------------
// SECTION 1. The screening engine, its conventions, and what it refuses to be.
// ---------------------------------------------------------------------------

/** The convention bullets, verbatim from the digest, the seeds read off the engines. */
export const screeningConventions = () => {
  const inp = expanded('isiala');
  return {
    projectLife: inp.projectLife,
    fiscalType: inp.fiscalType,
    gasPrice: inp.price.gas[0],
    gasVolume: inp.production.gas[0],
    capexFirstTwoYears: [inp.capex[0], inp.capex[1]],
    defaultMcSeed: DEFAULT_MC_SEED,
    defaultBreakevenSeed: DEFAULT_SEED,
    lines: [
      '- Discounting is MID-YEAR: year index i is discounted by (1 + rate/100)^(i + 0.5).',
      `- The quick form always builds a ${inp.projectLife} year case (expandQuickInputs life ${inp.projectLife}), TaxRoyalty only, gas volume 0 at a gas price of ${inp.price.gas[0]}, capex split 50/50 over the first two years, fixed opex flat, variable opex = oil volume x USD/bbl / 1e6.`,
      '- Units: production in bbl a year, prices USD/bbl, money $MM (volume x price / 1e6), rates in percent 0 to 100.',
      '- There is NO economic limit: every year of the life is produced and charged, including years whose net cash flow is negative.',
      `- The Monte Carlo is seeded: runMonteCarlo draws from mulberry32(settings.seed), default DEFAULT_MC_SEED ${DEFAULT_MC_SEED}; the breakeven default seed is DEFAULT_SEED ${DEFAULT_SEED}.`,
      '- It is a SCREENING engine: no PIA terms, no cost oil in the quick form, no working interest, no inflation basis. Those live in Petroleum Economics Studio (the EC1 course).',
    ],
  };
};

/** OKPOMA's last year: produced and charged although it loses money. */
export const noEconomicLimit = () => {
  const res = economics('okpoma');
  const last = res.cashflow[res.cashflow.length - 1];
  return {
    fieldKey: 'okpoma',
    line: quickLine(OKPOMA),
    lossYearsAfterCapex: res.cashflow.filter((x, i) => i >= 2 && x.ncf < 0).map((x) => x.year),
    lastYear: { year: last.year, ncf: last.ncf, grossRevenue: last.grossRevenue, opex: last.opex },
  };
};

// ---------------------------------------------------------------------------
// SECTION 2. A field from quick inputs to a case.
// ---------------------------------------------------------------------------

export const quickCase = (fieldKey = 'isiala') => {
  const q = field(fieldKey);
  const inp = expandQuickInputs(clone(q));
  const oil = inp.production.oil;
  return {
    fieldKey,
    label: FIELD_LABELS[fieldKey],
    quick: q,
    line: quickLine(q),
    projectLife: inp.projectLife,
    fiscalType: inp.fiscalType,
    royaltyRate: inp.royaltyRate,
    taxRate: inp.taxRate,
    discountRate: inp.discountRate,
    rows: oil.map((bbl, i) => ({
      year: q.startYear + i,
      oilBbl: bbl,
      oilPrice: inp.price.oil[i],
      gasPrice: inp.price.gas[i],
      capex: inp.capex[i],
      opexFixed: inp.opexFixed[i],
      opexVariable: inp.opexVariable[i],
    })),
    declineYear2OverYear1Derived: oil[1] / oil[0],
    declineYear20OverYear1Derived: oil[19] / oil[0],
  };
};

// ---------------------------------------------------------------------------
// SECTION 3. The royalty and tax ledger.
// ---------------------------------------------------------------------------

export const LEDGER_COLUMNS = ['year', 'grossRevenue', 'royalty', 'capex', 'opex', 'depreciation', 'tax', 'ncf', 'cumulativeNCF', 'govTake'];

export const ledger = (fieldKey = 'isiala') => {
  const res = economics(fieldKey);
  const paybackIndex = res.cashflow.findIndex((x) => x.cumulativeNCF >= 0);
  return {
    fieldKey,
    label: FIELD_LABELS[fieldKey],
    line: quickLine(field(fieldKey)),
    rows: res.cashflow,
    metrics: res.metrics,
    positiveTaxYearCount: res.cashflow.filter((x) => x.tax > 0).length,
    zeroTaxYears: res.cashflow.filter((x) => x.tax === 0).map((x) => x.year),
    // The first row whose cumulative is non-negative, which is the row the
    // engine's payback reads. On OKPOMA that is row 0 and it is never revisited.
    paybackIndex,
    paybackRowYear: paybackIndex >= 0 ? res.cashflow[paybackIndex].year : null,
  };
};

// ---------------------------------------------------------------------------
// SECTION 4. The published royalty and tax cases, and depreciation.
// ---------------------------------------------------------------------------

export const TAX_ROYALTY_CASE_IDS = screeningGolden.taxRoyalty.map((c) => c.id);

/**
 * A published royalty and tax case run through the engine. `shown` is the rows
 * the digest prints: all of them when there are four or fewer, otherwise the
 * first three and the last. `recordedEngine` is the oracle disagreement the
 * golden records, or null.
 */
export const publishedTaxRoyalty = (caseId) => {
  const c = SC.taxRoyalty[caseId];
  if (!c) throw new Error(`no published royalty and tax case named ${caseId}`);
  const res = calculateEconomics(clone(c.inputs));
  const n = res.cashflow.length;
  return {
    id: c.id,
    note: c.note,
    rowCount: n,
    shown: res.cashflow.filter((_, i) => n <= 4 || i < 3 || i === n - 1),
    metrics: res.metrics,
    recordedEngine: c.engine ?? null,
  };
};

export const depreciationCases = () => screeningGolden.depreciation.map((c) => {
  const res = calculateEconomics(clone(c.inputs));
  return {
    id: c.id, note: c.note,
    npv: res.metrics.npv, irr: res.metrics.irr, payback: res.metrics.payback, totalTax: res.metrics.totalTax,
  };
});

// ---------------------------------------------------------------------------
// SECTION 5. Value from a ledger: discounting, NPV, payback, IRR, exposure.
// ---------------------------------------------------------------------------

export const value = (fieldKey = 'isiala') => {
  const q = field(fieldKey);
  const res = economics(fieldKey);
  const firstPos = res.cashflow.findIndex((x) => x.cumulativeNCF >= 0);
  const byHand = firstPos > 0
    ? {
      index: firstPos,
      year: res.cashflow[firstPos].year,
      shortfallCarriedIn: res.cashflow[firstPos - 1].cumulativeNCF,
      ncfThatYear: res.cashflow[firstPos].ncf,
      paybackDerived: firstPos + Math.abs(res.cashflow[firstPos - 1].cumulativeNCF) / res.cashflow[firstPos].ncf,
    }
    : null;
  return {
    fieldKey,
    discountRate: q.discountRate,
    // The first six years, as the digest prints them. The factor is derived as
    // (1 + rate/100)^(i + 0.5), the engine's own mid-year exponent.
    factorRows: res.cashflow.slice(0, 6).map((row, i) => {
      const factor = Math.pow(1 + q.discountRate / 100, i + 0.5);
      return { year: row.year, ncf: row.ncf, factorDerived: factor, discountedNcfDerived: row.ncf / factor };
    }),
    npv: res.metrics.npv,
    irr: res.metrics.irr,
    payback: res.metrics.payback,
    maxExposure: res.metrics.maxExposure,
    paybackByHand: byHand,
  };
};

export const paybackCases = () => screeningGolden.payback.map((c) => {
  const res = calculateEconomics(clone(c.inputs));
  return { id: c.id, note: c.note, payback: res.metrics.payback, maxExposure: res.metrics.maxExposure };
});

/** The engine's IRR beside the golden's, with every root the oracle found. */
export const irrCases = () => screeningGolden.irr.map((c) => {
  const res = calculateEconomics(clone(c.inputs));
  return {
    id: c.id,
    note: c.note,
    engineIrr: res.metrics.irr,
    goldenIrr: c.expected.metrics.irr,
    goldenRoots: c.expected.metrics.irrRoots,
    recordedEngine: c.engine ?? null,
  };
});

export const sweeps = () => screeningGolden.sweeps.map((c) => {
  const res = calculateEconomics(clone(c.inputs));
  return { id: c.id, npv: res.metrics.npv, irr: res.metrics.irr, payback: res.metrics.payback };
});

// ---------------------------------------------------------------------------
// SECTION 6. One number becomes three: sensitivity and scenarios.
// ---------------------------------------------------------------------------

/** What each sensitivity bar scales, read off runSensitivityAnalysis. */
export const SENSITIVITY_SCALES = {
  'Oil Price': 'price.oil',
  CAPEX: 'capex',
  OPEX: 'opexFixed ONLY (opexVariable is untouched)',
  Production: 'production.oil ONLY (variable opex does not follow the volume)',
};

export const SENSITIVITY_FACTORS = { low: 0.7, high: 1.3 };

export const sensitivity = (fieldKey = 'isiala') => runSensitivityAnalysis(expanded(fieldKey)).map((s) => ({
  name: s.name,
  lowParamNPV: s.lowParamNPV,
  baseNPV: s.baseNPV,
  highParamNPV: s.highParamNPV,
  swingDerived: s.highParamNPV - s.lowParamNPV,
  scales: SENSITIVITY_SCALES[s.name],
}));

export const SCENARIO_RULE = 'Low: price and production x0.8, capex and fixed opex x1.2; High: the mirror';
export const SCENARIO_ORDER = ['Low', 'Base', 'High'];

export const scenarios = (fieldKey = 'isiala') => {
  const sc = generateScenarios(expanded(fieldKey));
  return SCENARIO_ORDER.map((name) => ({ name, metrics: sc[name].metrics }));
};

export const publishedSensitivity = () => {
  const c = SC.sensitivity.sens_base_10yr;
  return {
    id: c.id, note: c.note,
    rows: runSensitivityAnalysis(clone(c.inputs)).map((s) => ({ name: s.name, lowParamNPV: s.lowParamNPV, highParamNPV: s.highParamNPV })),
  };
};

export const publishedScenarios = () => {
  const c = SC.scenarios.scen_base_10yr;
  const sc = generateScenarios(clone(c.inputs));
  return { id: c.id, rows: SCENARIO_ORDER.map((name) => ({ name, npv: sc[name].metrics.npv })) };
};

// ---------------------------------------------------------------------------
// SECTION 7. Percentiles are not endpoints: the triangular fit.
// ---------------------------------------------------------------------------

export const FIT_VARIABLES = [
  ['capex', 'capex $MM', 'capex'],
  ['opex', 'opex $MM/yr', 'opex'],
  ['efficiency', 'efficiency %', 'eff'],
];

const fitRow = (key, name, stated) => {
  const fit = fitTriangularToPercentiles(...stated);
  return {
    key,
    name,
    stated: [...stated],
    shapeRatioDerived: (stated[1] - stated[0]) / (stated[2] - stated[0]),
    min: fit.min,
    mode: fit.mode,
    max: fit.max,
    mDerived: (fit.mode - fit.min) / (fit.max - fit.min),
    exact: fit.exact,
    note: fit.note,
  };
};

/** The percentile a stated belief sits at, worded for a parameter. */
export const beliefLabels = (quantity) => PARAMETER_ORDER.map((q) => parameterPercentileLabel(quantity, q));

export const fits = () => {
  const rows = [
    ...FIT_VARIABLES.map(([key, name, b]) => fitRow(key, name, BELIEF[b])),
    fitRow('narrowOpex', 'opex, narrow belief', NARROW_OPEX),
  ];
  const capex = rows[0];
  const unitRatio = (c) => (triInvCDF(0.5, 0, c, 1) - triInvCDF(0.1, 0, c, 1)) / (triInvCDF(0.9, 0, c, 1) - triInvCDF(0.1, 0, c, 1));
  return {
    rows,
    narrowNote: rows[3].note,
    band: { modeAtMinimumDerived: unitRatio(0), modeAtMaximumDerived: unitRatio(1) },
    capexCheck: {
      quantiles: [0.1, 0.5, 0.9],
      fitted: [0.1, 0.5, 0.9].map((u) => triInvCDF(u, capex.min, capex.mode, capex.max)),
      // THE OLD ERROR: the beliefs used as minimum, mode and maximum.
      beliefsAsEndpoints: [0.1, 0.5, 0.9].map((u) => triInvCDF(u, BELIEF.capex[0], BELIEF.capex[1], BELIEF.capex[2])),
    },
  };
};

/** The published case whose two fits both clamp. Runs 300 breakeven iterations. */
export const publishedInexactFit = () => {
  const c = BC.monteCarlo.mc_inexact_fit_note;
  return { id: c.id, note: c.note, fits: generateBreakevenData(clone(c.inputs)).distributionFits };
};

// ---------------------------------------------------------------------------
// SECTION 8. Sampling: the inverse CDF, the seeded generator, three draws.
// ---------------------------------------------------------------------------

export const SAMPLE_ORDER = ['capex', 'opex', 'efficiency'];

export const samplingWalk = (seed = DEFAULT_SEED) => {
  const rng = mulberry32(seed);
  const draws = Array.from({ length: 6 }, () => rng());
  const fitted = {
    capex: fitTriangularToPercentiles(...BELIEF.capex),
    opex: fitTriangularToPercentiles(...BELIEF.opex),
    efficiency: fitTriangularToPercentiles(...BELIEF.eff),
  };
  return {
    seed,
    draws,
    iteration1: SAMPLE_ORDER.map((variable, i) => {
      const fit = fitted[variable];
      const fModeDerived = (fit.mode - fit.min) / (fit.max - fit.min);
      return {
        draw: i + 1,
        u: draws[i],
        variable,
        fModeDerived,
        branch: draws[i] <= fModeDerived ? 'lower' : 'upper',
        sampled: triInvCDF(draws[i], fit.min, fit.mode, fit.max),
      };
    }),
  };
};

/**
 * Same seed, same answer, and another seed. THREE breakeven runs at the given
 * iteration count: the default seed twice and the other seed once.
 */
export const seedComparison = (otherSeed = 7, iterations = 5000) => {
  const main = generateBreakevenData(beInputs(BELIEF, BELIEF.opex, { iterations }));
  const again = generateBreakevenData(beInputs(BELIEF, BELIEF.opex, { iterations }));
  const other = generateBreakevenData(beInputs(BELIEF, BELIEF.opex, { iterations, seed: otherSeed }));
  return {
    iterations,
    seed: main.seed,
    otherSeed: other.seed,
    identicalSamples: JSON.stringify(main.plotData.histogram.x) === JSON.stringify(again.plotData.histogram.x),
    medianLabel: parameterPercentileLabel('breakeven price', 'q50'),
    medianAtSeed: main.kpis.p50,
    medianAtOtherSeed: other.kpis.p50,
  };
};

// ---------------------------------------------------------------------------
// SECTION 9. The breakeven price.
// ---------------------------------------------------------------------------

export const CURVE_PRICES = [20, 40, 60, 70, 80, 100, 150];
export const HURDLES_MUSD = [100, 250];
export const PRICE_BRACKET_TOP = 500;

const baseArgs = () => ({
  rows: isialaRows(), discountRate: ISIALA.discountRate, royaltyRate: ISIALA.royaltyRate, taxRate: ISIALA.taxRate,
  capexMM: BELIEF.capex[1], opexMM: BELIEF.opex[1], efficiency: BELIEF.eff[1] / 100,
});

export const breakevenCurve = () => {
  const args = baseArgs();
  return {
    capexMM: args.capexMM,
    opexMM: args.opexMM,
    efficiency: args.efficiency,
    baseBreakeven: solveBreakevenPrice(args, 0),
    points: CURVE_PRICES.map((price) => ({ price, npv: npvAtPrice({ ...args, price }) })),
  };
};

export const hurdles = () => {
  const args = baseArgs();
  return {
    rows: HURDLES_MUSD.map((target) => ({ targetNpv: target, price: solveBreakevenPrice(args, target) })),
    bracketTop: PRICE_BRACKET_TOP,
    npvAtBracketTop: npvAtPrice({ ...args, price: PRICE_BRACKET_TOP }),
  };
};

/**
 * Where each year's tax switches on: (opex + capex expensed that year) /
 * ((1 - royalty) x volume x efficiency) x 1e6. DERIVED FROM THE INPUTS the
 * engine is handed (the oracle's closed-form kink); the breakeven engine puts
 * ALL capex in year 1, so year 1 carries it.
 */
export const taxKinks = () => isialaRows().map((row, i) => ({
  index: i,
  year: row.year,
  kinkPriceDerived: ((BELIEF.opex[1] + (i === 0 ? BELIEF.capex[1] : 0))
    / ((1 - ISIALA.royaltyRate / 100) * row.oil_production_bbl * (BELIEF.eff[1] / 100))) * 1e6,
}));

export const solveCases = () => breakevenGolden.solve.map((c) => ({
  id: c.id,
  note: c.note,
  targetNpv: c.targetNpv ?? 0,
  enginePrice: solveBreakevenPrice(clone(c.args), c.targetNpv ?? 0),
  goldenPrice: c.expected.price,
}));

// ---------------------------------------------------------------------------
// SECTION 10 and SECTION 11. Reading the sample, and the two-sided tornado.
// ---------------------------------------------------------------------------

export const S_CURVE_POINTS = 100;

const runSummary = (res, iterations) => {
  const sorted = res.plotData.cdf.x;
  const n = sorted.length;
  const medianIndex = Math.min(n - 1, Math.floor(0.5 * n));
  return {
    iterations,
    seed: res.seed,
    sampleSize: n,
    excluded: res.excludedIterations,
    percentiles: pricePercentiles(res),
    mean: res.kpis.mean,
    baseBreakeven: res.baseBreakeven,
    lowest: sorted[0],
    highest: sorted[n - 1],
    medianIndex,
    sCurveYAtMedianIndex: res.plotData.cdf.y[medianIndex],
    meanMinusMedianDerived: res.kpis.mean - res.kpis.p50,
    insights: res.insights,
    // The S-curve, every (n / 100)th sorted price, so y runs 0.01 to 1.
    sCurve: Array.from({ length: Math.min(S_CURVE_POINTS, n) }, (_, k) => {
      const index = Math.max(0, Math.round(((k + 1) / Math.min(S_CURVE_POINTS, n)) * n) - 1);
      return { index, price: sorted[index], y: res.plotData.cdf.y[index] };
    }),
    tornado: tornadoRows(res.tornadoData),
    fits: res.distributionFits,
  };
};

/**
 * ISIALA's breakeven run. Defaults are the digest's: 5000 iterations at the
 * default seed with the stated beliefs.
 */
export const breakevenRun = ({ iterations = 5000, seed = DEFAULT_SEED } = {}) => {
  const res = generateBreakevenData(beInputs(BELIEF, BELIEF.opex, { iterations, seed }));
  return runSummary(res, iterations);
};

/** The published breakeven Monte Carlo cases, and the two that exclude iterations. */
export const publishedBreakevenRuns = () => {
  const runs = breakevenGolden.monteCarlo.filter((c) => !c.expected.throws).map((c) => {
    const res = generateBreakevenData(clone(c.inputs));
    return {
      id: c.id, note: c.note, seed: res.seed, iterations: c.inputs.iterations,
      p10: res.kpis.p10, p50: res.kpis.p50, p90: res.kpis.p90, mean: res.kpis.mean,
      baseBreakeven: res.baseBreakeven, excluded: res.excludedIterations,
    };
  });
  const allUnr = BC.monteCarlo.mc_all_unreachable_throws;
  let thrown = null;
  try { generateBreakevenData(clone(allUnr.inputs)); } catch (e) { thrown = e.message; }
  return {
    runs,
    allUnreachable: { id: allUnr.id, note: allUnr.note, iterations: allUnr.inputs.iterations, error: thrown },
  };
};

const unreachableRun = () => {
  const c = BC.monteCarlo.mc_with_unreachable;
  const res = generateBreakevenData(clone(c.inputs));
  return {
    id: c.id, note: c.note, iterations: c.inputs.iterations, excluded: res.excludedIterations,
    p10: res.kpis.p10, p50: res.kpis.p50, p90: res.kpis.p90,
    tornado: tornadoRows(res.tornadoData),
  };
};

/** The published case where part of the sample never breaks even (120 iterations). */
export const publishedUnreachable = () => unreachableRun();

/**
 * The two-sided tornado for ISIALA. The tornado does not depend on the sample,
 * so a run the caller already holds can be handed in; a bare call makes its own
 * 5000 iteration run exactly as the digest does.
 */
export const tornado = (run = breakevenRun()) => ({
  rows: run.tornado,
  efficiencyLowPriceEndFrom: BELIEF.eff[2],
  efficiencyHighPriceEndFrom: BELIEF.eff[0],
  lowPriceEndLabel: parameterPercentileLabel('efficiency', 'q90'),
  highPriceEndLabel: parameterPercentileLabel('efficiency', 'q10'),
});

// ---------------------------------------------------------------------------
// SECTION 12. One meaning of a P-label.
// ---------------------------------------------------------------------------

/** The case a P-label names, the P-label, and the engine key holding its NPV. */
const outcomeCases = () => CASES.map((c) => ({
  caseKey: c.key,
  caseLabel: c.label,
  pLabel: OUTCOME_LABELS[c.outcome],
  // Through the convention module: NPV is an outcome where more is better, so
  // the low case takes its 10th percentile, which the engine keeps under p10.
  engineKey: engineKeyOf(casePercentile(c.key, true)),
}));

/** What the results panel printed before EC3-0, quoted as history. */
export const SWAPPED_CARDS = [
  { oldLabel: 'P90 (Conservative)', engineKey: 'p90' },
  { oldLabel: 'P10 (Optimistic)', engineKey: 'p10' },
];

export const pLabelWords = () => ({
  definition: EXCEEDANCE_DEFINITION,
  cases: outcomeCases(),
  npvLowCasePercentile: parameterPercentileLabel(null, casePercentile('low', true)),
  npvLowCaseLabel: caseLabel('low', 'NPV', true),
  breakevenPrice: PARAMETER_ORDER.map((q) => parameterPercentileLabel('breakeven price', q)),
  parameters: {
    capex: beliefLabels('capex'),
    opex: beliefLabels('opex'),
    efficiency: beliefLabels('efficiency'),
  },
});

export const scenarioBuilderCases = async (seed = DEFAULT_MC_SEED) => {
  const mc = await runMonteCarlo(expanded('isiala'), { ...clone(APP_MC), seed });
  const rows = outcomeCases().map((c) => ({ ...c, npv: mc[c.engineKey] }));
  return {
    seed: mc.seed,
    iterations: mc.iterations,
    rows,
    orderViolation: outcomeOrderViolation({ p90: mc.p10, p50: mc.p50, p10: mc.p90 }, 'NPV'),
    swappedCards: SWAPPED_CARDS.map((s) => ({ ...s, quoted: `"${s.oldLabel}"`, value: mc[s.engineKey] })),
    conservativeCardHeldTheLargerNumber: mc.p90 > mc.p10,
  };
};

// ---------------------------------------------------------------------------
// SECTION 13. The Scenario Builder's Monte Carlo.
// ---------------------------------------------------------------------------

export const MC_SAMPLING_LINES = [
  '- Sampling: each value v with a range r is drawn uniformly on [v(1 - r), v(1 + r)], one draw per year per array, in the order oil volume, gas volume, oil price, gas price, capex, with a falsy range consuming no draw.',
  '- reserves scales oil AND gas volumes; price scales oil AND gas prices; capex scales capex; opex and royalty and tax are never sampled.',
];

export const scenarioBuilderMonteCarlo = async (settings = APP_MC) => {
  const s = clone(settings);
  const seed = s.seed ?? DEFAULT_MC_SEED;
  const mc = await runMonteCarlo(expanded('isiala'), { ...s, seed });
  return {
    iterations: mc.iterations,
    seed: mc.seed,
    uncertainties: s.uncertainties,
    emv: mc.emv,
    p10: mc.p10,
    p50: mc.p50,
    p90: mc.p90,
    lowest: mc.allValues[0],
    highest: mc.allValues[mc.allValues.length - 1],
    // The bin edges are not handed out: the counts, the width and the two ends
    // are what the digest prints.
    histogram: {
      binCount: mc.histogram.length,
      widthDerived: mc.histogram[0].binEnd - mc.histogram[0].binStart,
      counts: mc.histogram.map((b) => b.count),
    },
    sCurve: {
      pointCount: mc.cdf.length,
      stepDerived: Math.max(1, Math.floor(mc.iterations / 50)),
      firstProbability: mc.cdf[0].probability,
      lastProbability: mc.cdf[mc.cdf.length - 1].probability,
      // EC3-6: the S-curve reads SORTED values, so its point at probability 10
      // is a single sorted NPV, not the screening rule's average on the Low case card.
      valueAtTenPercent: (mc.cdf.find((x) => Math.abs(x.probability - 10) < 1e-9) ?? { value: null }).value,
      points: mc.cdf,
    },
  };
};

export const mcSeedComparison = async (otherSeed = 43) => {
  const a = await runMonteCarlo(expanded('isiala'), { ...clone(APP_MC), seed: DEFAULT_MC_SEED });
  const b = await runMonteCarlo(expanded('isiala'), { ...clone(APP_MC), seed: DEFAULT_MC_SEED });
  const o = await runMonteCarlo(expanded('isiala'), { ...clone(APP_MC), seed: otherSeed });
  return {
    seed: a.seed,
    otherSeed: o.seed,
    sameSeedRepeatsEveryValue: JSON.stringify(a.allValues) === JSON.stringify(b.allValues),
    medianAtSeed: a.p50,
    medianAtOtherSeed: o.p50,
  };
};

export const publishedPriceOnly = () => {
  const c = SC.monteCarloSeeded.mc_seed3_price_only;
  return { id: c.id, note: c.note, uncertainties: c.settings.uncertainties };
};

// ---------------------------------------------------------------------------
// SECTION 14. Two percentile rules in one module, and the wobble.
// ---------------------------------------------------------------------------

export const twoRules = async (seed = DEFAULT_MC_SEED) => {
  const mc = await runMonteCarlo(expanded('isiala'), { ...clone(APP_MC), seed });
  const sorted = mc.allValues;
  const n = sorted.length;
  return {
    seed: mc.seed,
    n,
    nTimesTenthDerived: n * 0.1,
    nTimesHalfDerived: n * 0.5,
    nTimesNinetiethDerived: n * 0.9,
    rows: PARAMETER_ORDER.map((q) => {
      const frac = PARAMETER_PERCENTILES[q] / 100;
      const screeningRule = quantile(sorted, frac);
      const floorRule = sorted[Math.min(n - 1, Math.floor(frac * n))];
      return {
        key: q,
        label: parameterPercentileLabel(null, q),
        screeningRule,
        floorRule,
        differenceDerived: screeningRule - floorRule,
      };
    }),
  };
};

export const WOBBLE_SEEDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const WOBBLE_SEED_ITERATIONS = 5000;
export const WOBBLE_ITERATION_COUNTS = [100, 500, 1000, 5000, 20000];

/** The runs the wobble is made of, one breakeven run each, so a panel can step through them. */
export const wobbleSteps = ({
  seeds = WOBBLE_SEEDS, seedIterations = WOBBLE_SEED_ITERATIONS, counts = WOBBLE_ITERATION_COUNTS,
} = {}) => [
  ...seeds.map((seed) => ({ kind: 'seed', seed, iterations: seedIterations })),
  ...counts.map((iterations) => ({ kind: 'iterations', seed: DEFAULT_SEED, iterations })),
];

export const wobbleStep = (step) => {
  const res = generateBreakevenData(beInputs(BELIEF, BELIEF.opex, { seed: step.seed, iterations: step.iterations }));
  return { ...step, p10: res.kpis.p10, p50: res.kpis.p50, p90: res.kpis.p90 };
};

export const wobbleCollect = (results) => {
  const bySeed = results.filter((x) => x.kind === 'seed');
  const byIterations = results.filter((x) => x.kind === 'iterations');
  const range = (k) => (bySeed.length ? Math.max(...bySeed.map((x) => x[k])) - Math.min(...bySeed.map((x) => x[k])) : null);
  const atDefault = byIterations.find((x) => x.iterations === WOBBLE_SEED_ITERATIONS) ?? null;
  const lo = bySeed.length ? Math.min(...bySeed.map((x) => x.p50)) : null;
  const hi = bySeed.length ? Math.max(...bySeed.map((x) => x.p50)) : null;
  return {
    labels: { p10: parameterPercentileLabel('breakeven price', 'q10'), p50: parameterPercentileLabel('breakeven price', 'q50'), p90: parameterPercentileLabel('breakeven price', 'q90') },
    bySeed,
    p10RangeDerived: range('p10'),
    p50RangeDerived: range('p50'),
    byIterations,
    defaultSeedMedianOutsideSeedSpan: atDefault && lo !== null ? (atDefault.p50 < lo || atDefault.p50 > hi) : null,
  };
};

/** The whole wobble: about fifteen 5000 iteration runs of work. Slow. */
export const wobble = (opts = {}) => wobbleCollect(wobbleSteps(opts).map(wobbleStep));

// ---------------------------------------------------------------------------
// SECTION 15. Repaired edges and one still open, B1 (the one-sided tornado bar).
// ---------------------------------------------------------------------------

export const edges = async () => {
  const zero = await runMonteCarlo(expanded('isiala'), { iterations: 30, uncertainties: { price: 0, capex: 0, reserves: 0 }, seed: DEFAULT_MC_SEED });
  const short = await runMonteCarlo(expanded('isiala'), { ...clone(APP_MC), iterations: 40, seed: DEFAULT_MC_SEED });
  const unr = unreachableRun();
  return {
    zeroRanges: {
      iterations: 30,
      p10: zero.p10, p50: zero.p50, p90: zero.p90, emv: zero.emv,
      deterministicNpv: economics('isiala').metrics.npv,
      binZeroCount: zero.histogram[0].count,
    },
    fortyIterations: { iterations: 40, sCurvePoints: short.cdf.length },
    oneSidedTornado: { id: unr.id, rows: unr.tornado },
  };
};

/** ISIALA with the narrow opex belief. A 5000 iteration breakeven run by default. */
export const narrowBeliefRun = ({ iterations = 5000 } = {}) => {
  const res = generateBreakevenData(beInputs(BELIEF, NARROW_OPEX, { iterations }));
  return {
    stated: [...NARROW_OPEX],
    statedLabels: beliefLabels('opex'),
    opexFit: res.distributionFits.opex,
    percentiles: pricePercentiles(res),
    baseBreakeven: res.baseBreakeven,
    tornado: tornadoRows(res.tornadoData),
    insightCarriesFitNote: res.insights.includes('the stated median sits too near'),
    insights: res.insights,
  };
};

// ---------------------------------------------------------------------------
// SECTION 16. Numbers to distrust.
// ---------------------------------------------------------------------------

export const OKPOMA_FIRST_ROW_COLUMNS = ['year', 'grossRevenue', 'royalty', 'capex', 'opex', 'tax', 'ncf', 'cumulativeNCF'];
export const IRR_DISTRUST_CASE_IDS = ['irr_beyond_clamp', 'irr_tiny_cash_flows_derivative_guard', 'irr_two_roots'];

export const distrust = () => {
  const nt = economics('nteje');
  const ok = economics('okpoma');
  const is = economics('isiala');
  const fdp = SC.fdp.fdp_never_pays_back;
  const fdpRes = calculateEconomics(clone(fdp.inputs));
  const yearEnd = is.cashflow.reduce((s, row, i) => s + row.ncf / Math.pow(1 + ISIALA.discountRate / 100, i + 1), 0);
  return {
    nteje: {
      line: quickLine(NTEJE),
      npv: nt.metrics.npv, irr: nt.metrics.irr, payback: nt.metrics.payback, maxExposure: nt.metrics.maxExposure,
      finalCumulative: nt.cashflow[nt.cashflow.length - 1].cumulativeNCF,
    },
    okpoma: {
      npv: ok.metrics.npv, irr: ok.metrics.irr, payback: ok.metrics.payback, maxExposure: ok.metrics.maxExposure,
      firstRows: ok.cashflow.slice(0, 3).map((row) => Object.fromEntries(OKPOMA_FIRST_ROW_COLUMNS.map((k) => [k, row[k]]))),
    },
    irrCases: IRR_DISTRUST_CASE_IDS.map((id) => {
      const c = SC.irr[id];
      return { id, note: c.note, engineIrr: calculateEconomics(clone(c.inputs)).metrics.irr, goldenRoots: c.expected.metrics.irrRoots };
    }),
    fdpNeverPaysBack: { id: fdp.id, note: fdp.note, npv: fdpRes.metrics.npv, irr: fdpRes.metrics.irr, payback: fdpRes.metrics.payback },
    midYear: {
      engineNpv: is.metrics.npv,
      yearEndNpvDerived: yearEnd,
      ratioDerived: is.metrics.npv / yearEnd,
      rootOfOnePlusRateDerived: Math.sqrt(1 + ISIALA.discountRate / 100),
    },
  };
};

// ---------------------------------------------------------------------------
// SECTION 17. ISIALA end to end.
// ---------------------------------------------------------------------------

/** The four headline blocks. Makes a 5000 iteration breakeven run unless one is handed in. */
export const endToEnd = async (run = breakevenRun()) => {
  const led = ledger('isiala');
  const sc = scenarios('isiala');
  const cases = await scenarioBuilderCases(DEFAULT_MC_SEED);
  const mc = await scenarioBuilderMonteCarlo(APP_MC);
  return {
    deterministic: { npv: led.metrics.npv, irr: led.metrics.irr, payback: led.metrics.payback, maxExposure: led.metrics.maxExposure },
    scenarios: sc.map((x) => ({ name: x.name, npv: x.metrics.npv })),
    breakeven: { baseBreakeven: run.baseBreakeven, percentiles: run.percentiles },
    scenarioBuilder: { rows: cases.rows, emv: mc.emv, seed: mc.seed },
  };
};

// ===========================================================================
// THE CAPSTONE. UMUNEDE ONLY. NOT FOR LESSONS, NOT FOR PANELS.
//
// EVERYTHING BELOW THIS LINE IS CAPSTONE MATERIAL. UMUNEDE, its beliefs, its
// seed, its Monte Carlo settings, its breakeven iteration count and its hurdle
// are copied VERBATIM from /root/ec-wip-uncertainty/ec3_fields.mjs so the
// grader, the lab's own tests and the migration headers all read one
// derivation. Every name carries UMUNEDE or umunede, and
// panelCapstoneGuard.test.js greps the three panel sources and the learning
// page for every one of them. The leak gate in uncertaintyLab.test.js checks
// every TEACHING export's return values against the eighteen graded answers.
//
// The teaching digest and the capstone are two files with opposite audiences
// and they never share a number.
// ===========================================================================

export const UMUNEDE = { initialRate: 3900, declineRate: 10, oilPrice: 64, capex: 150, fixedOpex: 2.1, opexPerBbl: 14.5, royaltyRate: 17.5, taxRate: 38, discountRate: 13, startYear: 2028 };
export const UMUNEDE_BELIEF = { capex: [125, 150, 185], opex: [14, 17.5, 23], eff: [84, 90, 95] };
export const UMUNEDE_SEED = 9031;
export const UMUNEDE_MC = { iterations: 1200, uncertainties: { price: 0.22, capex: 0.15, reserves: 0.2 } };
export const UMUNEDE_BREAKEVEN_ITERATIONS = 4000;
export const UMUNEDE_HURDLE_MUSD = 100;

const UMUNEDE_MONEY = 0.001;
const UMUNEDE_PRICE = 0.001;

const umunedeRows = () => expandQuickInputs(clone(UMUNEDE)).production.oil
  .map((q, i) => ({ year: UMUNEDE.startYear + i, oil_production_bbl: q }));

export const umunedeBreakevenInputs = (seed = UMUNEDE_SEED) => ({
  iterations: UMUNEDE_BREAKEVEN_ITERATIONS, seed, discountRate: UMUNEDE.discountRate, royaltyRate: UMUNEDE.royaltyRate, taxRate: UMUNEDE.taxRate, targetNpv: 0,
  productionData: { data: umunedeRows() },
  variables: [
    { id: 1, name: 'Total CAPEX ($MM)', p10: UMUNEDE_BELIEF.capex[0], p50: UMUNEDE_BELIEF.capex[1], p90: UMUNEDE_BELIEF.capex[2] },
    { id: 2, name: 'Annual OPEX ($MM/year)', p10: UMUNEDE_BELIEF.opex[0], p50: UMUNEDE_BELIEF.opex[1], p90: UMUNEDE_BELIEF.opex[2] },
    { id: 3, name: 'Production Efficiency (%)', p10: UMUNEDE_BELIEF.eff[0], p50: UMUNEDE_BELIEF.eff[1], p90: UMUNEDE_BELIEF.eff[2] },
  ],
});

/** The capstone runs, exactly as the derivation makes them. Two 4000 iteration breakeven runs. */
export const umunedeRuns = async () => {
  const inp = expandQuickInputs(clone(UMUNEDE));
  const res = calculateEconomics(inp);
  const sens = runSensitivityAnalysis(inp);
  const mc = await runMonteCarlo(inp, { ...clone(UMUNEDE_MC), seed: UMUNEDE_SEED });
  const be = generateBreakevenData(umunedeBreakevenInputs());
  const beAlt = generateBreakevenData(umunedeBreakevenInputs(UMUNEDE_SEED + 1));
  const args = {
    rows: umunedeRows(), discountRate: UMUNEDE.discountRate, royaltyRate: UMUNEDE.royaltyRate, taxRate: UMUNEDE.taxRate,
    capexMM: UMUNEDE_BELIEF.capex[1], opexMM: UMUNEDE_BELIEF.opex[1], efficiency: UMUNEDE_BELIEF.eff[1] / 100,
  };
  return { res, sens, mc, be, beAlt, hurdlePrice: solveBreakevenPrice(args, UMUNEDE_HURDLE_MUSD) };
};

/**
 * The eighteen graded fields as [tier, key, value, tolerance], in the order and
 * with the tolerances the capstone publishes. THE TOLERANCE IS ABSOLUTE, in the
 * field's own units: academy_submit_capstone grades abs(v_got - v_exp) <= v_tol.
 */
export const umunedeCapstoneFields = async () => {
  const { res, sens, mc, be, beAlt, hurdlePrice } = await umunedeRuns();
  const paybackIdx = res.cashflow.findIndex((x) => x.cumulativeNCF >= 0);
  const capexBar = be.tornadoData.y.indexOf('Total CAPEX');
  return [
    ['beginner', 'um_y5_royalty_musd', res.cashflow[4].royalty, UMUNEDE_MONEY],
    ['beginner', 'um_y4_tax_musd', res.cashflow[3].tax, UMUNEDE_MONEY],
    ['beginner', 'um_y11_ncf_musd', res.cashflow[10].ncf, UMUNEDE_MONEY],
    ['beginner', 'um_payback_year_cum_ncf_musd', res.cashflow[paybackIdx].cumulativeNCF, UMUNEDE_MONEY],
    ['beginner', 'um_npv_musd', res.metrics.npv, UMUNEDE_MONEY],
    ['beginner', 'um_npv_price_up_30_musd', sens.find((s) => s.name === 'Oil Price').highParamNPV, UMUNEDE_MONEY],
    ['intermediate', 'um_capex_fit_max_musd', be.distributionFits.capex.max, UMUNEDE_MONEY],
    ['intermediate', 'um_opex_fit_mode_musd', be.distributionFits.opex.mode, UMUNEDE_MONEY],
    ['intermediate', 'um_base_breakeven_usd_bbl', be.baseBreakeven, UMUNEDE_PRICE],
    ['intermediate', 'um_breakeven_10th_percentile_usd_bbl', be.kpis.p10, UMUNEDE_PRICE],
    ['intermediate', 'um_breakeven_90th_percentile_usd_bbl', be.kpis.p90, UMUNEDE_PRICE],
    ['intermediate', 'um_tornado_capex_high_side_usd_bbl', be.tornadoData.high[capexBar], UMUNEDE_PRICE],
    ['advanced', 'um_mc_low_case_p90_npv_musd', mc.p10, UMUNEDE_MONEY],
    ['advanced', 'um_mc_high_case_p10_npv_musd', mc.p90, UMUNEDE_MONEY],
    ['advanced', 'um_mc_emv_musd', mc.emv, UMUNEDE_MONEY],
    ['advanced', 'um_mc_10th_percentile_floor_rule_musd', mc.allValues[Math.min(mc.allValues.length - 1, Math.floor(0.1 * mc.allValues.length))], UMUNEDE_MONEY],
    ['advanced', 'um_breakeven_median_next_seed_usd_bbl', beAlt.kpis.p50, UMUNEDE_PRICE],
    ['advanced', 'um_breakeven_at_hurdle_usd_bbl', hurdlePrice, UMUNEDE_PRICE],
  ];
};

/** The graded answers keyed by field. A field list already in hand can be passed in. */
export const umunedeCapstoneValues = async (fieldList) =>
  Object.fromEntries((fieldList ?? await umunedeCapstoneFields()).map(([, key, v]) => [key, v]));

/** The grading tolerance of each field, absolute, in the field's own units. */
export const umunedeCapstoneTolerances = async (fieldList) =>
  Object.fromEntries((fieldList ?? await umunedeCapstoneFields()).map(([, key, , tol]) => [key, tol]));

/**
 * Every export of this module that is built on the capstone. The panel guard
 * greps the panel sources for each name; the leak gate skips each one when it
 * walks the teaching surface.
 */
export const CAPSTONE_ONLY_EXPORTS = [
  'UMUNEDE', 'UMUNEDE_BELIEF', 'UMUNEDE_SEED', 'UMUNEDE_MC', 'UMUNEDE_BREAKEVEN_ITERATIONS', 'UMUNEDE_HURDLE_MUSD',
  'umunedeBreakevenInputs', 'umunedeRuns', 'umunedeCapstoneFields', 'umunedeCapstoneValues', 'umunedeCapstoneTolerances',
  'CAPSTONE_ONLY_EXPORTS',
];

// ---------------------------------------------------------------------------
// The leak guard machinery, the fiscal course's, unchanged.
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
