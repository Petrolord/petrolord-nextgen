// Teaching lab for DR12, Well Cost & Time. The panels, the learning page and
// the vitest file all read this one module, so a number shown to a learner and
// a number a test pins cannot drift apart.
//
// Everything here is the vendored engine's own output. The activity kinds, the
// cost bases, the categories and the regional benchmark tables are IMPORTED
// rather than retyped, and every schedule, rollup, curve and unit cost below is
// a return value from a call. Nothing in this file re-implements the engine.

import cases from '@petrolord/engines/test-data/drilling/goldens/wellcost_cases.json';
import {
  activityDuration, evaluateProgram, afeCosts, costTimeCurve, costPerMeter,
  programFromSections, ACTIVITY_KINDS, COST_BASES, COST_CATEGORIES,
} from '@petrolord/engines/engines/drilling/wellCost.js';
import {
  benchmarkSuggestion, REGION_BENCHMARKS, WELL_TYPE_MODIFIERS,
} from '@petrolord/engines/engines/drilling/data/costBenchmarks.js';
import { createSeededRng } from '@petrolord/engines/engines/dca/monteCarlo.js';

export {
  activityDuration, evaluateProgram, afeCosts, costTimeCurve, costPerMeter,
  programFromSections, ACTIVITY_KINDS, COST_BASES, COST_CATEGORIES,
  benchmarkSuggestion, REGION_BENCHMARKS, WELL_TYPE_MODIFIERS,
};

/** The engine keeps this private, so the course states the unit once. */
export const HOURS_PER_DAY = 24;

export const GOLDEN = cases;
export const CASE = cases.caseDoc;
export const PROGRAM_DOC = cases.caseDoc.program;
export const COST_DOC = cases.caseDoc.costs;
export const ACTIVITIES = cases.caseDoc.program.activities;
export const ITEMS = cases.caseDoc.costs.items;
export const NPT_FRAC = cases.caseDoc.program.nptFrac;
export const CONTINGENCY_FRAC = cases.caseDoc.costs.contingencyFrac;

// ---------------------------------------------------------------------------
// The programme: schedule, time-depth curve and totals.
// ---------------------------------------------------------------------------

export const programOf = (over = {}) => evaluateProgram({
  activities: ACTIVITIES, nptFrac: NPT_FRAC, ...over,
});

export const publishedProgram = () => programOf();
export const publishedRows = () => publishedProgram().rows;
export const publishedTotals = () => publishedProgram().totals;
export const publishedTimeDepthCurve = () => publishedProgram().curve;

/**
 * A schedule SLIP as a multiplier on elapsed time. The engine has one lever for
 * stretching a programme, the NPT fraction, so a slip of s is applied by asking
 * for the fraction that makes the stretch (1 + nptFrac) exactly s times what it
 * was. Footage is untouched: a slip costs time, not metres, and that asymmetry
 * is the whole of `basisSlipSweep` below.
 */
export const programAtSlip = (slipFactor) => programOf({
  nptFrac: (1 + NPT_FRAC) * slipFactor - 1,
});

/**
 * A drill activity is t = deltaMd / ROP, so the hours are a HYPERBOLA in ROP
 * and the product ROP*t is the footage, invariant. Halving ROP doubles the
 * section, which is why a rate-of-penetration argument is a cost argument.
 */
export const ropSweep = (rops = [5, 8, 10, 15, 25, 40]) => rops.map((ropMPerHr) => {
  const a = { kind: 'drill', label: 'Production hole', fromMdM: 2000, toMdM: 3000, ropMPerHr };
  const hr = activityDuration(a);
  return { ropMPerHr, hr, footageM: ropMPerHr * hr, days: hr / HOURS_PER_DAY };
});

/**
 * A trip is t = 2*md / v. Linear in depth, and the 2 is the round trip: the
 * pipe comes out and goes back in. Reading it as a one-way run halves the
 * tripping time in the estimate, which is a fortnight on a deep well.
 */
export const tripDepthSweep = (depths = [500, 1000, 2000, 3000, 4500], tripSpeedMPerHr = 500) =>
  depths.map((mdM) => {
    const hr = activityDuration({ kind: 'trip', label: `Round trip at ${mdM} m`, mdM, tripSpeedMPerHr });
    return { mdM, tripSpeedMPerHr, hr, oneWayHr: mdM / tripSpeedMPerHr, roundTripRatio: hr / (mdM / tripSpeedMPerHr) };
  });

/**
 * Casing is t = md / v + flat, which is AFFINE and not proportional. The flat
 * time is rigging up, circulating, cementing and waiting on cement, and no run
 * speed removes it: as v grows the curve flattens onto flatHr, never onto zero.
 */
export const casingSpeedSweep = (speeds = [100, 200, 300, 400, 800, 2000], mdM = 3000, flatHr = 14) =>
  speeds.map((runSpeedMPerHr) => {
    const hr = activityDuration({ kind: 'casing', label: 'Run and cement', mdM, runSpeedMPerHr, flatHr });
    return { runSpeedMPerHr, hr, runHr: hr - flatHr, flatHr, floorHr: flatHr };
  });

/**
 * A flat activity is t = duration. It is the only kind with no rate at all, so
 * it is the only kind an ROP or a speed argument cannot touch. On this well the
 * two flats, rig move and completion, are 84 of the 384 productive hours.
 */
export const flatDurationSweep = (durations = [6, 12, 24, 48, 60, 96]) =>
  durations.map((durationHr) => ({
    durationHr,
    hr: activityDuration({ kind: 'flat', label: 'Flat time', durationHr }),
  }));

/**
 * The productive and NPT split against the NPT fraction.
 *
 * READ THE RATIOS, NOT THE NAME. The engine multiplies every activity by
 * (1 + nptFrac), so nptFrac is a fraction of PRODUCTIVE time: the NPT hours are
 * nptFrac*productiveHr, and their share of TOTAL time is the smaller
 * nptFrac/(1 + nptFrac). At the published 12.5 per cent that is 48 hours on 384
 * productive, which is 11.1 per cent of the 432 hour well. Quoting one
 * convention and computing the other is a real way to lose two days.
 */
export const nptSweep = (fracs = [0, 0.05, 0.125, 0.2, 0.3, 0.5]) => fracs.map((nptFrac) => {
  const t = programOf({ nptFrac }).totals;
  return {
    nptFrac,
    productiveHr: t.productiveHr, nptHr: t.nptHr, totalHr: t.totalHr, totalDays: t.totalDays,
    shareOfProductive: t.nptHr / t.productiveHr,
    shareOfTotal: t.nptHr / t.totalHr,
  };
});

// ---------------------------------------------------------------------------
// The AFE.
// ---------------------------------------------------------------------------

export const afeOf = (program = publishedProgram(), over = {}) => afeCosts({
  items: ITEMS,
  totalDays: program.totals.totalDays,
  drilledM: program.totals.drilledM,
  contingencyFrac: CONTINGENCY_FRAC,
  ...over,
});

export const publishedAfe = () => afeOf();
export const publishedAfeItems = () => publishedAfe().byItem;

/** The tangible / intangible split, straight off the rollup. */
export const publishedAfeSplit = () => {
  const a = publishedAfe();
  return {
    tangibleUsd: a.tangibleUsd,
    intangibleUsd: a.intangibleUsd,
    baseUsd: a.baseUsd,
    tangibleFrac: a.tangibleUsd / a.baseUsd,
  };
};

export const publishedContingencyUsd = () => publishedAfe().contingencyUsd;
export const publishedTotalUsd = () => publishedAfe().totalUsd;

/** The largest single line on the published AFE, by the engine's own amounts. */
export const largestItem = (afe = publishedAfe()) =>
  afe.byItem.reduce((best, r) => (r.amountUsd > best.amountUsd ? r : best), afe.byItem[0]);

/**
 * Nominal spend used by `basisSlipSweep`. One million dollars, spent three
 * ways, so the only thing separating the three lines is their BASIS.
 */
export const NOMINAL_USD = 1e6;

/** The same nominal spend written as a day rate, a metre rate and a lump. */
export const equalNominalItems = (program = publishedProgram(), nominalUsd = NOMINAL_USD) => [
  { id: 'nom-day', label: 'Nominal per-day', category: 'intangible', basis: 'per-day', rate: nominalUsd / program.totals.totalDays },
  { id: 'nom-meter', label: 'Nominal per-meter', category: 'intangible', basis: 'per-meter', rate: nominalUsd / program.totals.drilledM },
  { id: 'nom-lump', label: 'Nominal lump', category: 'tangible', basis: 'lump', value: nominalUsd },
];

/**
 * THE ARGUMENT THE PROFESSIONAL TIER IS BUILT ON. Three lines that cost exactly
 * the same on the base schedule, put through a slip. The per-day line tracks
 * the slip one for one, because it buys TIME. The per-meter line does not move
 * at all, because it buys METRES and a slip adds none. The lump does not move
 * either, because it was agreed as a price. So the exposure of an estimate to
 * schedule risk is not its size, it is the share of it that is on day rates.
 */
export const basisSlipSweep = (slips = [0.9, 1, 1.25, 1.5, 2]) => {
  const base = publishedProgram();
  const items = equalNominalItems(base);
  return slips.map((slipFactor) => {
    const program = programAtSlip(slipFactor);
    const a = afeCosts({
      items,
      totalDays: program.totals.totalDays,
      drilledM: program.totals.drilledM,
      contingencyFrac: 0,
    });
    const amount = (id) => a.byItem.find((r) => r.id === id).amountUsd;
    return {
      slipFactor,
      totalDays: program.totals.totalDays,
      drilledM: program.totals.drilledM,
      perDayUsd: amount('nom-day'),
      perMeterUsd: amount('nom-meter'),
      lumpUsd: amount('nom-lump'),
      baseUsd: a.baseUsd,
    };
  });
};

/**
 * Contingency and total against the contingency fraction. The base subtotal
 * does NOT move: contingency is a fraction of it, kept as its own line, so
 * every row here shares one baseUsd and differs only in the provision.
 */
export const contingencySweep = (fracs = [0, 0.05, 0.1, 0.2, 0.3, 0.35, 0.5]) => {
  const largest = largestItem();
  return fracs.map((contingencyFrac) => {
    const a = afeOf(publishedProgram(), { contingencyFrac });
    return {
      contingencyFrac,
      baseUsd: a.baseUsd,
      contingencyUsd: a.contingencyUsd,
      totalUsd: a.totalUsd,
      largestItemUsd: largest.amountUsd,
      outranksLargestItem: a.contingencyUsd > largest.amountUsd,
      rank: a.byItem.filter((r) => r.amountUsd > a.contingencyUsd).length + 1,
    };
  });
};

/**
 * DERIVED FROM THE ENGINE, NOT ASSERTED. A bisection on the engine's own rollup
 * for the contingency fraction at which the provision overtakes the largest
 * real line item on the AFE, which on this well is the rig day rate. The
 * closed form is largestItem / baseUsd, and the search is not told it. A
 * provision that can outrank the rig is not a rounding allowance, it is the
 * biggest number in the estimate and it belongs in the conversation.
 */
export const searchContingencyCrossing = ({ lo = 0, hi = 1, iterations = 200 } = {}) => {
  const largest = largestItem();
  const gap = (f) => afeOf(publishedProgram(), { contingencyFrac: f }).contingencyUsd - largest.amountUsd;
  let a = lo;
  let b = hi;
  for (let i = 0; i < iterations; i += 1) {
    const m = (a + b) / 2;
    if (gap(m) < 0) a = m; else b = m;
  }
  const frac = (a + b) / 2;
  const at = afeOf(publishedProgram(), { contingencyFrac: frac });
  return {
    frac,
    contingencyUsd: at.contingencyUsd,
    baseUsd: at.baseUsd,
    largestItemId: largest.id,
    largestItemUsd: largest.amountUsd,
    closedForm: largest.amountUsd / at.baseUsd,
  };
};

// ---------------------------------------------------------------------------
// The cost-time curve.
// ---------------------------------------------------------------------------

export const costCurveOf = (program = publishedProgram(), items = ITEMS) =>
  costTimeCurve({ program, items });

export const publishedCostCurve = () => costCurveOf();

/** The golden's own checkpoint, looked up on the engine's curve. */
export const publishedCostCurveCheckpoint = () => {
  const target = cases.costCurveCheckpoint.tHr;
  const point = publishedCostCurve().find((p) => Math.abs(p.tHr - target) < 1e-9);
  if (!point) throw new Error(`No cost-curve point at ${target} h.`);
  return point;
};

/**
 * THE IDENTITY THE WHOLE CURVE RESTS ON: the last point equals the AFE's BASE
 * subtotal, never the total. Contingency is a provision and provisions do not
 * accrue, so a curve that ended on the total would be drawing money nobody has
 * spent. This returns both so a panel can show the gap rather than hide it.
 */
export const curveEndpointCheck = (program = publishedProgram(), over = {}) => {
  const points = costCurveOf(program);
  const a = afeOf(program, over);
  const endUsd = points[points.length - 1].usd;
  return {
    endUsd,
    baseUsd: a.baseUsd,
    totalUsd: a.totalUsd,
    contingencyUsd: a.contingencyUsd,
    absErrorUsd: Math.abs(endUsd - a.baseUsd),
    relError: Math.abs(endUsd - a.baseUsd) / a.baseUsd,
  };
};

/** The same identity held across a range of schedules, which is the real test:
 *  it is not a coincidence of one fixture's round numbers. */
export const endpointIdentitySweep = (fracs = [0, 0.0333, 0.077, 0.125, 0.137, 0.31337, 0.5, 1]) =>
  fracs.map((nptFrac) => ({ nptFrac, ...curveEndpointCheck(programOf({ nptFrac })) }));

/** A lump with no linked activity steps in at SPUD, so the curve starts above
 *  zero. Every published lump is linked, which is why the golden starts at 0. */
export const unlinkedLumpCurve = (valueUsd = 123456) => costCurveOf(publishedProgram(), [
  ...ITEMS,
  { id: 'unlinked', label: 'Unlinked lump', category: 'tangible', basis: 'lump', value: valueUsd },
]);

// ---------------------------------------------------------------------------
// Cost per metre (ADE ch.1) and the section ranking.
// ---------------------------------------------------------------------------

export const publishedCostPerMeter = () => costPerMeter(cases.costPerMeter.inputs);
export const COST_PER_METER_INPUTS = cases.costPerMeter.inputs;

/**
 * The rig rate the section table charges, taken from the published AFE's own
 * per-day lines rather than invented: rig plus integrated services spread, per
 * hour. The ADE form charges rig time, so the spread that stands beside the rig
 * belongs in it.
 */
export const RIG_RATE_USD_PER_HR = ITEMS
  .filter((i) => i.basis === 'per-day')
  .reduce((s, i) => s + i.rate, 0) / HOURS_PER_DAY;

/** One stand of drill pipe every few minutes, as hours of connection per metre. */
export const CONNECTION_HR_PER_M = 0.004;

/** Bit spend per hole size. Bigger holes drill faster and cost less per bit. */
export const SECTION_BIT_USD = { surface: 25000, intermediate: 50000, production: 90000 };

/**
 * The published well's own three hole sections, with the drilling and tripping
 * hours read off the ENGINE's schedule rather than restated. The surface
 * section has no trip in the published programme, so its trip time is zero and
 * the table says so.
 */
export const publishedSections = () => {
  const rows = publishedRows();
  const tags = ['surface', 'intermediate', 'production'];
  return rows.filter((r) => r.kind === 'drill').map((r, i) => {
    const next = rows[r.index + 1];
    const tripHr = next && next.kind === 'trip' ? next.productiveHr : 0;
    return {
      name: r.label,
      tag: tags[i] ?? `section-${i + 1}`,
      intervalM: r.endMdM - r.startMdM,
      drillingHr: r.productiveHr,
      connectionHr: (r.endMdM - r.startMdM) * CONNECTION_HR_PER_M,
      tripHr,
      bitCostUsd: SECTION_BIT_USD[tags[i]] ?? 50000,
      rigRateUsdPerHr: RIG_RATE_USD_PER_HR,
    };
  });
};

/**
 * A LONG-INTERMEDIATE WELL, constructed for the ranking claim. Same rig, same
 * connection model, but the 17.5 inch hole carries 2000 m and the 12.25 inch
 * hole only 700. This is the common shape of a shelf well and it is the shape
 * on which the two rankings come apart: the intermediate is the single biggest
 * block of spend and at the same time the CHEAPEST metre on the well, while the
 * short production hole is the dearest metre and not the biggest cheque.
 */
export const LONG_INTERMEDIATE_SECTIONS = [
  {
    name: 'Drill 26in surface hole', tag: 'surface', intervalM: 500,
    drillingHr: 500 / 25, connectionHr: 500 * CONNECTION_HR_PER_M, tripHr: 0,
    bitCostUsd: SECTION_BIT_USD.surface, rigRateUsdPerHr: RIG_RATE_USD_PER_HR,
  },
  {
    name: 'Drill 17.5in intermediate hole', tag: 'intermediate', intervalM: 2000,
    drillingHr: 2000 / 15, connectionHr: 2000 * CONNECTION_HR_PER_M, tripHr: (2 * 2500) / 500,
    bitCostUsd: 60000, rigRateUsdPerHr: RIG_RATE_USD_PER_HR,
  },
  {
    name: 'Drill 12.25in production hole', tag: 'production', intervalM: 700,
    drillingHr: 700 / 8, connectionHr: 700 * CONNECTION_HR_PER_M, tripHr: (2 * 3200) / 500,
    bitCostUsd: 120000, rigRateUsdPerHr: RIG_RATE_USD_PER_HR,
  },
];

/**
 * Cost per metre across sections, and the section's whole cheque beside it. The
 * cheque is the engine's own unit cost multiplied back up by the interval,
 * which is the numerator of the ADE form and not a second calculation.
 */
export const sectionCostSweep = (sections = publishedSections()) => sections.map((s) => {
  const usdPerM = costPerMeter({
    bitCostUsd: s.bitCostUsd,
    rigRateUsdPerHr: s.rigRateUsdPerHr,
    drillingHr: s.drillingHr,
    connectionHr: s.connectionHr,
    tripHr: s.tripHr,
    intervalM: s.intervalM,
  });
  return { ...s, usdPerM, sectionUsd: usdPerM * s.intervalM };
});

/** The two orderings, worst first, so a panel can put them side by side. */
export const sectionRankings = (sections = publishedSections()) => {
  const rows = sectionCostSweep(sections);
  return {
    rows,
    bySpend: [...rows].sort((a, b) => b.sectionUsd - a.sectionUsd).map((r) => r.tag),
    byUnitCost: [...rows].sort((a, b) => b.usdPerM - a.usdPerM).map((r) => r.tag),
  };
};

/**
 * Cost per metre against footage at a FIXED rate of penetration, so the
 * drilling hours grow with the interval as they really do. The bit and the trip
 * amortise, so the unit cost falls, but it falls onto an ASYMPTOTE of
 * rigRate / ROP and not towards zero. That floor is what a technical limit
 * argument is actually arguing about.
 */
export const footageSweep = (intervals = [100, 250, 500, 1000, 2000, 5000, 20000], {
  ropMPerHr = 10, bitCostUsd = 50000, rigRateUsdPerHr = 6000, connectionHr = 4, tripHr = 16,
} = {}) => intervals.map((intervalM) => ({
  intervalM,
  usdPerM: costPerMeter({
    bitCostUsd, rigRateUsdPerHr, drillingHr: intervalM / ropMPerHr, connectionHr, tripHr, intervalM,
  }),
  asymptoteUsdPerM: rigRateUsdPerHr / ropMPerHr,
}));

// ---------------------------------------------------------------------------
// Benchmarks and the risk fixture's deterministic base.
// ---------------------------------------------------------------------------

export const publishedBenchmark = () => benchmarkSuggestion(cases.benchmark.inputs);
export const BENCHMARK_INPUTS = cases.benchmark.inputs;

export const MC_ANALYTIC = cases.mc.analytic;

/**
 * The risk fixture evaluated at the MODES of its distributions, which is what a
 * deterministic base case is. The suite's canonical Monte Carlo module samples
 * these same inputs; the engine stays pure and is called once per realization.
 * The base case and the risked MEAN are not the same number, and the sign of
 * the difference is not an accident: see the test.
 */
export const mcBaseAtModes = () => {
  const program = evaluateProgram(cases.mc.program);
  const costs = afeCosts({
    items: cases.mc.costs.items,
    totalDays: program.totals.totalDays,
    drilledM: program.totals.drilledM,
    contingencyFrac: cases.mc.costs.contingencyFrac,
  });
  return { program, costs, totalDays: program.totals.totalDays, totalUsd: costs.totalUsd };
};

// ---------------------------------------------------------------------------
// The mirror of the slip: footage at a fixed schedule.
// ---------------------------------------------------------------------------

/**
 * THE OTHER HALF OF THE BASIS ARGUMENT, run as a controlled experiment. The
 * same three equal-nominal lines as `basisSlipSweep`, but this time the well
 * gets DEEPER while the clock is held still: the last drill activity is
 * extended and its rate of penetration is raised by exactly enough to keep its
 * productive hours where the published programme put them. So elapsed days do
 * not move, drilled metres do, and the per-meter line moves alone while the
 * per-day line and the lump sit still. That is the mirror image of the slip,
 * where the day rate moved alone.
 *
 * It is an experiment and not a redesign: the trip and the casing run below
 * the deepened section keep the depths the published programme gave them, so
 * this sweep isolates FOOTAGE and changes nothing else. A real deepening buys
 * metres and hours together, and then both lines move, which is the point of
 * running the two sweeps side by side rather than one of them alone.
 */
export const deepeningSweep = (extras = [0, 250, 500, 1000]) => {
  const base = publishedProgram();
  const items = equalNominalItems(base);
  const deepened = [...ACTIVITIES].reverse().find((a) => a.kind === 'drill');
  const plannedHr = activityDuration(deepened);
  return extras.map((extraM) => {
    const activities = ACTIVITIES.map((a) => (a.id === deepened.id
      ? { ...a, toMdM: a.toMdM + extraM, ropMPerHr: (a.toMdM + extraM - a.fromMdM) / plannedHr }
      : a));
    const program = programOf({ activities });
    const a = afeCosts({
      items,
      totalDays: program.totals.totalDays,
      drilledM: program.totals.drilledM,
      contingencyFrac: 0,
    });
    const amount = (id) => a.byItem.find((r) => r.id === id).amountUsd;
    return {
      extraM,
      sectionId: deepened.id,
      ropMPerHr: activities.find((x) => x.id === deepened.id).ropMPerHr,
      totalDays: program.totals.totalDays,
      drilledM: program.totals.drilledM,
      perDayUsd: amount('nom-day'),
      perMeterUsd: amount('nom-meter'),
      lumpUsd: amount('nom-lump'),
      baseUsd: a.baseUsd,
    };
  });
};

// ---------------------------------------------------------------------------
// The risked run.
// ---------------------------------------------------------------------------

/**
 * The engine is deterministic by design and says so in its own header: the
 * Suite samples uncertainties around it and calls the evaluators once per
 * realization. That is exactly what happens here. `evaluateProgram` and
 * `afeCosts` are called once per iteration and nothing about them is
 * re-implemented; the only thing this section adds is the draw.
 *
 * The seeded generator is IMPORTED from the suite's canonical Monte Carlo
 * module rather than written again, because a reproducible run is the whole
 * value of quoting a percentile: same seed, same iterations, same numbers, and
 * a reviewer can re-derive them. That module's own sampler is written for Arps
 * decline curves and cannot evaluate a drilling programme, so the loop below
 * is the drilling one and the RNG underneath it is the shared one.
 */
export const RISK_DOC = CASE.risk;
export const RISK_UNCERTAINTIES = CASE.risk.uncertainties;
export const MC_UNCERTAINTIES = GOLDEN.mc.uncertainties;

/** A triangular mean is the average of the three corners, not the mode. */
export const triangularMean = ({ min, mode, max }) => (min + mode + max) / 3;

/** Inverse transform for a triangular distribution: u in [0,1) to a value. */
export function triangularQuantile(u, { min, mode, max }) {
  const fc = (mode - min) / (max - min);
  return u <= fc
    ? min + Math.sqrt(u * (max - min) * (mode - min))
    : max - Math.sqrt((1 - u) * (max - min) * (max - mode));
}

/** One realization: draw every declared uncertainty onto a copy of the case. */
function drawCase(rng, { activities, items, uncertainties }) {
  const acts = activities.map((a) => ({ ...a }));
  const its = items.map((i) => ({ ...i }));
  for (const u of uncertainties) {
    const row = (u.target === 'activity' ? acts : its).find((r) => r.id === u.id);
    if (row) row[u.field] = triangularQuantile(rng(), u.dist);
  }
  return { acts, its };
}

/**
 * The published case with every uncertainty pinned at its MODE, which is what
 * a deterministic base case is. On the published risk document every mode is
 * the planned value, so this reproduces the published AFE exactly, and saying
 * so is the point: the base case is a mode-of-modes.
 */
export const riskBaseAtModes = ({
  activities = ACTIVITIES, items = ITEMS, uncertainties = RISK_UNCERTAINTIES,
  nptFrac = NPT_FRAC, contingencyFrac = CONTINGENCY_FRAC,
} = {}) => {
  const acts = activities.map((a) => ({ ...a }));
  const its = items.map((i) => ({ ...i }));
  for (const u of uncertainties) {
    const row = (u.target === 'activity' ? acts : its).find((r) => r.id === u.id);
    if (row) row[u.field] = u.dist.mode;
  }
  const program = evaluateProgram({ activities: acts, nptFrac });
  const costs = afeCosts({
    items: its,
    totalDays: program.totals.totalDays,
    drilledM: program.totals.drilledM,
    contingencyFrac,
  });
  return { totalDays: program.totals.totalDays, totalUsd: costs.totalUsd, baseUsd: costs.baseUsd };
};

/**
 * PERCENTILE LABELS ARE A CONVENTION AND THIS RUN CARRIES BOTH.
 *
 * The suite's canonical sampler was written for reserves, where P90 is the
 * value you exceed nine times in ten, so it deliberately crosses the labels
 * over: its p10 field is read nine tenths of the way up the sorted list and its
 * p90 field one tenth of the way up. Push COST through it and the field called
 * p90 holds the cheap outcome. `sampler` below reproduces that convention
 * exactly, index for index, and `cost` holds the project-controls reading of
 * the same three numbers, where p90 is the expensive one. They are the same
 * sorted list read with two vocabularies, and a percentile printed without one
 * of them attached is not a number anybody can use.
 */
export function riskedRun({
  iterations = RISK_DOC.iterations,
  seed = RISK_DOC.seed,
  contingencyFrac = CONTINGENCY_FRAC,
  nptFrac = NPT_FRAC,
  activities = ACTIVITIES,
  items = ITEMS,
  uncertainties = RISK_UNCERTAINTIES,
} = {}) {
  const n = Math.max(1, Math.floor(iterations));
  const rng = createSeededRng(seed);
  const usd = new Array(n);
  const days = new Array(n);
  for (let i = 0; i < n; i += 1) {
    const { acts, its } = drawCase(rng, { activities, items, uncertainties });
    const program = evaluateProgram({ activities: acts, nptFrac });
    const costs = afeCosts({
      items: its,
      totalDays: program.totals.totalDays,
      drilledM: program.totals.drilledM,
      contingencyFrac,
    });
    usd[i] = costs.totalUsd;
    days[i] = program.totals.totalDays;
  }
  const sortedUsd = [...usd].sort((a, b) => a - b);
  const sortedDays = [...days].sort((a, b) => a - b);
  const mean = (xs) => xs.reduce((s, x) => s + x, 0) / xs.length;
  const meanUsd = mean(usd);
  const sdUsd = Math.sqrt(usd.reduce((s, x) => s + (x - meanUsd) ** 2, 0) / n);
  const at = (f) => sortedUsd[Math.min(n - 1, Math.floor(n * f))];
  const base = riskBaseAtModes({ activities, items, uncertainties, nptFrac, contingencyFrac });
  return {
    iterations: n,
    seed,
    contingencyFrac,
    sortedUsd,
    sortedDays,
    meanUsd,
    sdUsd,
    covUsd: sdUsd / meanUsd,
    medianUsd: at(0.5),
    meanDays: mean(days),
    medianDays: sortedDays[Math.min(n - 1, Math.floor(n * 0.5))],
    minUsd: sortedUsd[0],
    maxUsd: sortedUsd[n - 1],
    // the canonical sampler's own field names, petroleum convention
    sampler: { p10: at(0.9), p50: at(0.5), p90: at(0.1) },
    // the same three numbers read in the cost convention
    cost: { p10: at(0.1), p50: at(0.5), p90: at(0.9) },
    base,
  };
}

/**
 * Where a single figure sits in a finished run, as the fraction of
 * realizations at or below it. This is the cost-convention percentile of that
 * figure, and it is the only honest way to say what a deterministic estimate
 * or a chosen contingency fraction actually covers.
 */
export const costPercentile = (run, usdValue) => {
  if (!run || !run.sortedUsd || !run.sortedUsd.length || !Number.isFinite(usdValue)) return null;
  return run.sortedUsd.filter((v) => v <= usdValue).length / run.sortedUsd.length;
};

/** The sampled totals binned for a histogram, counts and shares per bin. */
export const riskHistogram = (run, bins = 24) => {
  if (!run || !run.sortedUsd || run.sortedUsd.length < 2) return [];
  const lo = run.minUsd;
  const hi = run.maxUsd;
  const width = (hi - lo) / bins;
  if (!(width > 0)) return [];
  const counts = new Array(bins).fill(0);
  for (const v of run.sortedUsd) {
    counts[Math.min(bins - 1, Math.floor((v - lo) / width))] += 1;
  }
  return counts.map((count, i) => ({
    x0: lo + i * width,
    x1: lo + (i + 1) * width,
    midUsd: lo + (i + 0.5) * width,
    count,
    frac: count / run.sortedUsd.length,
  }));
};
