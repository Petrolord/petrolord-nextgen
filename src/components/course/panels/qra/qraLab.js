// THE H5 TEACHING LAB: Quantitative Risk Assessment.
//
// Every number this lab returns is a return value of the vendored engine
// (packages/engines/engines/hse/qra.js, sha-identical with petrolord-engines
// 16fd6c9) on the teaching streams below, on the published cases read from the
// vendored golden, or on the inputs a learner types into a panel. The teaching
// streams are the same streams the wave's digest generator runs
// (tools/course-waves/qra/h5_fields.mjs), and qraLab.test.js asserts they are
// deep-equal and that every number a teaching reader returns is printed in the
// digest.
//
// THE LAB NEVER READS THE CAPSTONE. It holds no graded answer, no tolerance and
// no capstone facility or input, and panelCapstoneGuard.test.js greps this
// file, the three panels and the learning page for every rendering of all
// eighteen answers and every distinctive capstone input.
//
// NO REFUSAL MESSAGE IS WRITTEN HERE. A panel that shows a refusal shows the
// engine's own `error` string, so the lesson that quotes it and the panel agree.
//
// EVERY PROBABILITY OF DEATH IS A STATED INPUT. The consequence models that
// produce one belong to the consequence course; the three engine functions that
// call them are never reached from this lab.
//
// Nothing here reads a clock, a random number or a locale.
import * as E from '@petrolord/engines/engines/hse/qra.js';
import GOLD from '@petrolord/engines/test-data/hse/goldens/qra_cases.json';

const freeze = (o) => Object.freeze(JSON.parse(JSON.stringify(o)));

/* ------------------------------------------------------------ the streams */

export const STREAMS = Object.freeze({
  ACCOMMODATION_VULNERABILITY: 0.5,
  CALLER_LINE: freeze({ constantC: 0.01, exponentAlpha: 1 }),
  CAPPED_LINE: freeze({ constantC: 0.001, exponentAlpha: 2, minFatalities: 10, maxFatalities: 100 }),
  CONVENTIONS: freeze([
    { label: 'undiscounted', benefitDiscountRate: 0, costDiscountRate: 0, benefitGrowthRate: 0 },
    {
      label: 'the 2003 checklist limits',
      benefitDiscountRate: 0.015,
      costDiscountRate: 0.035,
      benefitGrowthRate: 0,
    },
    { label: 'R2P2 Appendix 3', benefitDiscountRate: 0.06, costDiscountRate: 0.06, benefitGrowthRate: 0.04 },
  ]),
  DF_SWEEP: freeze([1, 2, 3, 5, 10]),
  EDIKAN_FIREWALL: freeze({
    deltaPllPerYr: 0.002,
    vpf: 1000000,
    lifetimeYears: 20,
    capitalCost: 250000,
    annualCost: 5000,
    disproportionFactor: 3,
  }),
  EREMOR_OPERATOR: freeze([
    { place: 'process deck', hoursPerYr: 1000 },
    { place: 'control room', hoursPerYr: 800 },
    { place: 'accommodation', hoursPerYr: 2560 },
  ]),
  EREMOR_OVERBOOKED: freeze([{ place: 'process deck', occupancyFraction: 0.6 }, { place: 'control room', occupancyFraction: 0.5 }]),
  EREMOR_OVERFILL: freeze({
    initiatingFrequencyPerYr: 0.002,
    tree: {
      branches: [
        { name: 'high level alarm answered', probability: 0.95, outcome: 'no release' },
        {
          name: 'high level alarm missed',
          probability: 0.05,
          next: {
            branches: [
              {
                name: 'bund contains the spill',
                probability: 0.7,
                next: {
                  branches: [
                    { name: 'ignited in the bund', probability: 0.1, outcome: 'pool fire' },
                    { name: 'not ignited in the bund', probability: 0.9, outcome: 'no fire' },
                  ],
                },
              },
              {
                name: 'bund overtopped',
                probability: 0.3,
                next: {
                  branches: [
                    { name: 'ignited outside the bund', probability: 0.25, outcome: 'pool fire' },
                    { name: 'not ignited outside the bund', probability: 0.75, outcome: 'no fire' },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  }),
  EREMOR_PLACES: freeze({
    'process deck': { 'jet or pool fire': 0.5, 'flash fire': 1, explosion: 0.7, 'pool fire': 0.3 },
    'control room': { 'jet or pool fire': 0.02, 'flash fire': 0, explosion: 0.1, 'pool fire': 0.01 },
    accommodation: { 'jet or pool fire': 0, 'flash fire': 0, explosion: 0.002, 'pool fire': 0 },
  }),
  EREMOR_RELEASE: freeze({ initiatingFrequencyPerYr: 0.0005, immediateIgnitionProbability: 0.1, delayedIgnitionProbability: 0.3 }),
  EREMOR_SUPERVISOR: freeze([
    { place: 'process deck', occupancyFraction: 0.05 },
    { place: 'control room', occupancyFraction: 0.2 },
    { place: 'accommodation', occupancyFraction: 0.25 },
  ]),
  EREMOR_TRANSECT: freeze({
    distancesM: [0, 50, 100, 150, 200, 300, 400],
    scenarios: [
      { name: 'jet fire', frequencyPerYr: 0.00005, fatalityProbabilities: [1, 0.9, 0.35, 0.05, 0.004, 0, 0] },
      {
        name: 'explosion',
        frequencyPerYr: 0.00002,
        fatalityProbabilities: [1, 0.8, 0.4, 0.1, 0.02, 0.001, 0],
      },
    ],
  }),
  FLOAT_BRANCHES: freeze([0.7, 0.2, 0.1]),
  IGNITION_MASSES_KG: freeze([500, 1000, 5000, 10000, 20000]),
  IGNITION_RATES_KG_S: freeze([5, 10, 50, 100, 200]),
  IR_LADDER: freeze([0.01, 0.002, 0.001, 0.0005, 0.0001, 0.00002, 0.000001, 5e-7, 0]),
  JISIKE_CREW: freeze([
    { name: 'process fire', frequencyPerYr: 0.0005, fatalities: 1.2 },
    { name: 'module explosion', frequencyPerYr: 0.00004, fatalities: 8 },
    { name: 'fall from height', frequencyPerYr: 0.003, fatalities: 0.5 },
    { name: 'spill with no one near', frequencyPerYr: 0.006, fatalities: 0 },
  ]),
  JISIKE_CREW_PERSONS: 60,
  JISIKE_HOURS_PER_PERSON: 2000,
  JISIKE_OFFSITE: freeze([
    { name: 'toxic cloud over the town', frequencyPerYr: 2e-7, fatalities: 300 },
    { name: 'vapour cloud explosion', frequencyPerYr: 0.0000015, fatalities: 40 },
    { name: 'flash fire at the road', frequencyPerYr: 0.000008, fatalities: 12 },
    { name: 'jet fire at the fence', frequencyPerYr: 0.00003, fatalities: 3 },
    { name: 'second jet fire at the fence', frequencyPerYr: 0.00001, fatalities: 3 },
    { name: 'release that reaches no one', frequencyPerYr: 0.00005, fatalities: 0 },
  ]),
  NEAR_BRANCHES: freeze([0.4000001, 0.6]),
  OPEN_BRANCHES: freeze([0.6, 0.3]),
  OVERPRESSURES_PA: freeze([5000, 10000, 20000, 30000, 40000]),
  SNAP_PRODUCTS: freeze([
    { factors: [0.1, 0.1, 0.1], thresholdPerYr: 0.001, preset: 'r2p2-workers' },
    { factors: [0.1, 0.1, 0.01], thresholdPerYr: 0.0001, preset: 'r2p2-public' },
    { factors: [0.2, 0.000005], thresholdPerYr: 0.000001, preset: 'r2p2-public' },
  ]),
  TOUCHING: freeze([
    { name: 'touching scenario', frequencyPerYr: 0.00001, fatalities: 10 },
    { name: 'small scenario', frequencyPerYr: 0.00002, fatalities: 1 },
  ]),
  TOXIC_PE: 0.4,
  WHOLE_PLL: freeze({ fatalities: 2, exposedHoursPerYr: 40000000 }),
});

export const PRESETS = Object.freeze({
  tolerability: Object.keys(E.TOLERABILITY_PRESETS),
  criteria: Object.keys(E.FN_CRITERIA),
});

/* ------------------------------------------------ what a learner can type */

/** A single number from a text box; a blank box is undefined, never zero. */
export const parseNumber = (text) => {
  if (text === '' || text === null || text === undefined) return undefined;
  const v = Number(text);
  return Number.isFinite(v) ? v : NaN;
};

/** A comma, space or newline separated list of numbers. */
export const parseSeries = (text) => {
  if (typeof text !== 'string' || text.trim() === '') return { error: 'the list is empty' };
  const parts = text.split(/[\s,;]+/).filter((p) => p !== '');
  const values = parts.map(Number);
  const bad = parts.filter((p, i) => !Number.isFinite(values[i]));
  if (bad.length) return { error: `these entries are not numbers: ${bad.join(', ')}` };
  return { values };
};

/**
 * Rows of "name, a, b" one per line, into objects with the given keys. The
 * engine checks every value; this only splits. A blank field stays undefined,
 * so a blank reaches the engine as missing and never as zero.
 */
export const parseRows = (text, keys) => {
  const rows = (typeof text === 'string' ? text : '').split('\n').map((l) => l.trim()).filter((l) => l !== '').map((l) => {
    const parts = l.split(',').map((p) => p.trim());
    const row = { name: parts[0] };
    keys.forEach((k, i) => { const v = parseNumber(parts[i + 1]); if (v !== undefined) row[k] = v; });
    return row;
  });
  return { rows };
};
export const rowsText = (rows, keys) => rows.map((r) => [r.name, ...keys.map((k) => (r[k] === undefined ? '' : String(r[k])))].join(', ')).join('\n');

/* -------------------------------------------------- the interactive routes */

export const eventTree = (args) => E.eventTree(args);
export const flammableTree = (args) => E.flammableReleaseEventTree(args);
export const directIgnition = (args) => E.pbDirectIgnitionProbability(args);
export const lsir = (args) => E.locationIndividualRisk(args);
export const irpa = (args) => E.individualRiskPerAnnum(args);
export const pll = (args) => E.potentialLossOfLife(args);
export const farOf = (args) => E.fatalAccidentRateFromPll(args);
export const fnCurve = (args) => E.fnCurve(args);
export const fnCompare = (args) => E.fnCriterionComparison(args);
export const alarp = (args) => E.alarpBand(args);
export const costBenefit = (args) => E.costBenefit(args);
export const fractions = (args) => E.pbFatalityFractions(args);
export const transect = (args) => E.lsirTransect(args);

/* ------------------------------------------------- the teaching readers */

const S = STREAMS;
const sum = (a) => a.reduce((x, y) => x + y, 0);

/** Associate: the EREMOR overfill tree, its leaves and its pooled outcomes. */
export const overfill = () => {
  const r = E.eventTree(S.EREMOR_OVERFILL);
  return { outcomes: r.outcomes, totals: r.outcomeTotalsPerYr, total: r.totalFrequencyPerYr, model: r.basis.model };
};

/** Associate: three branch sets against the branch-sum tolerance. */
export const branchSums = () => [S.OPEN_BRANCHES, S.FLOAT_BRANCHES, S.NEAR_BRANCHES].map((ps) => {
  const r = E.eventTree({ initiatingFrequencyPerYr: 1e-3, tree: { branches: ps.map((p, i) => ({ name: `branch ${i + 1}`, probability: p })) } });
  return { probabilities: ps, sum: String(ps.reduce((a, b) => a + b, 0)), accepted: !r.error, error: r.error || null };
});

/** Associate: the EREMOR release through the flammable release tree. */
export const release = () => {
  const r = E.flammableReleaseEventTree(S.EREMOR_RELEASE);
  return { outcomes: r.outcomes.map((o) => ({ outcome: o.outcome, frequencyPerYr: o.frequencyPerYr })), totals: r.outcomeTotalsPerYr, split: r.basis.vapourCloudSplit };
};

/** Associate: the explosion frequency built three wrong ways. */
export const forgotten = () => {
  const R = S.EREMOR_RELEASE;
  const right = E.flammableReleaseEventTree(R).outcomeTotalsPerYr.explosion;
  const swapped = E.flammableReleaseEventTree({ ...R, vapourCloudSplit: { flashFire: 0.4, explosion: 0.6 } }).outcomeTotalsPerYr.explosion;
  const unconditional = E.eventTree({
    initiatingFrequencyPerYr: R.initiatingFrequencyPerYr,
    tree: {
      branches: [
        { name: 'delayed ignition', probability: R.delayedIgnitionProbability, next: { branches: [{ name: 'flash fire', probability: 0.6 }, { name: 'explosion', probability: 0.4 }] } },
        { name: 'no delayed ignition', probability: 1 - R.delayedIgnitionProbability },
      ],
    },
  }).outcomeTotalsPerYr.explosion;
  const noSplit = E.eventTree({
    initiatingFrequencyPerYr: R.initiatingFrequencyPerYr,
    tree: {
      branches: [
        { name: 'immediate', probability: R.immediateIgnitionProbability },
        {
          name: 'no immediate',
          probability: 1 - R.immediateIgnitionProbability,
          next: { branches: [{ name: 'explosion', probability: R.delayedIgnitionProbability }, { name: 'no ignition', probability: 1 - R.delayedIgnitionProbability }] },
        },
      ],
    },
  }).outcomeTotalsPerYr.explosion;
  return [
    { what: 'the tree as the engine builds it', explosion: right, overRight: 1 },
    { what: 'the split swapped, 0.4 flash fire and 0.6 explosion', explosion: swapped, overRight: swapped / right },
    { what: 'delayed ignition taken as unconditional', explosion: unconditional, overRight: unconditional / right },
    { what: 'every delayed ignition counted as an explosion', explosion: noSplit, overRight: noSplit / right },
  ];
};

/** Associate: Purple Book Table 4.5 either side of every band edge. */
export const ignitionTable = () => {
  const subs = Object.keys(E.PB_DIRECT_IGNITION_STATIONARY);
  const row = (releaseType, x) => ({
    release: releaseType === 'continuous' ? `continuous ${x} kg/s` : `instantaneous ${x} kg`,
    cells: subs.map((substance) => {
      const r = E.pbDirectIgnitionProbability({ releaseType, substance, ...(releaseType === 'continuous' ? { massRateKgS: x } : { massKg: x }) });
      return { substance, probability: r.probability, band: r.band };
    }),
  });
  return [...S.IGNITION_RATES_KG_S.map((x) => row('continuous', x)), ...S.IGNITION_MASSES_KG.map((x) => row('instantaneous', x))];
};

const outcomeFrequencies = () => ({
  ...E.flammableReleaseEventTree(S.EREMOR_RELEASE).outcomeTotalsPerYr,
  'pool fire': E.eventTree(S.EREMOR_OVERFILL).outcomeTotalsPerYr['pool fire'],
});
const lsirAt = (place) => {
  const f = outcomeFrequencies();
  return E.locationIndividualRisk({
    scenarios: Object.entries(S.EREMOR_PLACES[place]).map(([name, pd]) => ({ name, frequencyPerYr: f[name], fatalityProbability: pd })),
  });
};

/** Associate: LSIR at the three EREMOR places, and the process deck broken down. */
export const places = () => ({
  lsir: Object.keys(S.EREMOR_PLACES).map((place) => ({ place, lsirPerYr: lsirAt(place).lsirPerYr })),
  processDeck: lsirAt('process deck').contributions,
});

/** Associate: the EREMOR operator and supervisor, and the operator built wrongly. */
export const people = () => {
  const L = Object.fromEntries(Object.keys(S.EREMOR_PLACES).map((p) => [p, lsirAt(p).lsirPerYr]));
  const op = E.individualRiskPerAnnum({ locations: S.EREMOR_OPERATOR.map((l) => ({ name: l.place, lsirPerYr: L[l.place], hoursPerYr: l.hoursPerYr })) });
  const sup = E.individualRiskPerAnnum({ locations: S.EREMOR_SUPERVISOR.map((l) => ({ name: l.place, lsirPerYr: L[l.place], occupancyFraction: l.occupancyFraction })) });
  const vul = E.individualRiskPerAnnum({
    locations: S.EREMOR_OPERATOR.map((l) => ({
      name: l.place, lsirPerYr: L[l.place], hoursPerYr: l.hoursPerYr, ...(l.place === 'accommodation' ? { vulnerabilityFactor: S.ACCOMMODATION_VULNERABILITY } : {}),
    })),
  });
  return {
    operator: { irpaPerYr: op.irpaPerYr, totalOccupancyFraction: op.totalOccupancyFraction, contributions: op.contributions },
    supervisor: { irpaPerYr: sup.irpaPerYr },
    withVulnerability: { irpaPerYr: vul.irpaPerYr },
    wrong: {
      noOccupancy: sum(S.EREMOR_OPERATOR.map((l) => L[l.place])),
      hoursOver8766: sum(S.EREMOR_OPERATOR.map((l) => (L[l.place] * l.hoursPerYr) / 8766)),
      deckAlone: op.contributions[0].contributionPerYr,
    },
  };
};

/** Associate: the EREMOR transect and its contour crossings. */
export const transectTable = () => {
  const r = E.lsirTransect(S.EREMOR_TRANSECT);
  return { lsirPerYr: r.lsirPerYr, contours: r.contours };
};

/** Associate: Purple Book Appendix 6.B from the golden, and step 6 through the engine. */
export const appendix6b = () => {
  const G = GOLD.toxicGridPoint.pbAppendix6b;
  const c = GOLD.individualRisk.pbAppendix6bContribution;
  return {
    printed: {
      centrelineProbability: G.printed.centrelineProbability,
      effectiveCloudWidthM: G.printed.effectiveCloudWidthM,
      coverageProbability: G.printed.coverageProbability,
      probabilityOfDeath: G.printed.probabilityOfDeath,
      weatherDirectionProbability: G.printed.weatherDirectionProbability,
      contributionPerYr: G.printed.contributionPerYr,
    },
    chain: {
      centrelineProbability: G.expected.centrelineProbability,
      effectiveCloudWidthM: G.expected.effectiveCloudWidthM,
      coverageProbability: G.expected.coverageProbability,
      probabilityOfDeath: G.expected.probabilityOfDeath,
      contributionPerYr: G.expected.contributionPerYr,
    },
    stepwise: { coverageProbability: G.printedStepwise.pci, probabilityOfDeath: G.printedStepwise.pd, contributionPerYr: G.printedStepwise.dir },
    step6: E.locationIndividualRisk(c.args).lsirPerYr,
  };
};

/** Professional: the JISIKE crew PLL and FAR, and each built wrongly. */
export const crew = () => {
  const p = E.potentialLossOfLife({ scenarios: S.JISIKE_CREW });
  const hours = S.JISIKE_CREW_PERSONS * S.JISIKE_HOURS_PER_PERSON;
  const far = E.fatalAccidentRateFromPll({ pllPerYr: p.pllPerYr, exposedHoursPerYr: hours }).far;
  return {
    pllPerYr: p.pllPerYr,
    contributions: p.contributions,
    exposedHoursPerYr: hours,
    far,
    wrong: {
      fOverN: sum(S.JISIKE_CREW.filter((s) => s.fatalities > 0).map((s) => s.frequencyPerYr / s.fatalities)),
      nIgnored: sum(S.JISIKE_CREW.map((s) => s.frequencyPerYr)),
      farOnePerson: E.fatalAccidentRateFromPll({ pllPerYr: p.pllPerYr, exposedHoursPerYr: S.JISIKE_HOURS_PER_PERSON }).far,
      farBaseMillion: far / 100,
    },
    wholeCount: E.fatalAccidentRateFromPll({ pllPerYr: S.WHOLE_PLL.fatalities, exposedHoursPerYr: S.WHOLE_PLL.exposedHoursPerYr }).far,
  };
};

/** Professional: the JISIKE off-site F-N curve, read rightly and wrongly. */
export const offsite = () => {
  const r = E.fnCurve({ scenarios: S.JISIKE_OFFSITE });
  const moreThan = (n) => sum(S.JISIKE_OFFSITE.filter((s) => s.fatalities > n).map((s) => s.frequencyPerYr));
  const exactly = (n) => sum(S.JISIKE_OFFSITE.filter((s) => s.fatalities === n).map((s) => s.frequencyPerYr));
  return {
    points: r.points.map((p) => ({ ...p, moreThanN: moreThan(p.fatalities), exactlyN: exactly(p.fatalities) })),
    expectedFatalitiesPerYr: r.expectedFatalitiesPerYr,
    zeroFatalityFrequencyPerYr: r.zeroFatalityFrequencyPerYr,
  };
};

/** Professional: the off-site curve against the Dutch line, a capped line, the R2P2 point and a caller line. */
export const criteria = () => {
  const pick = (r) => ({ state: r.state, maxRatio: r.maxRatio, worstAtFatalities: r.worstAtFatalities, checks: r.checks });
  const short = (r) => ({ state: r.state, checks: r.checks.map((c) => ({ fatalities: c.fatalities, ratio: c.ratio, state: c.state })) });
  const caller = E.fnCriterionComparison({ scenarios: S.JISIKE_OFFSITE, criterion: S.CALLER_LINE });
  return {
    dutch: pick(E.fnCriterionComparison({ scenarios: S.JISIKE_OFFSITE, criterion: 'vrom-establishments' })),
    capped: short(E.fnCriterionComparison({ scenarios: S.JISIKE_OFFSITE, criterion: S.CAPPED_LINE })),
    point: pick(E.fnCriterionComparison({ scenarios: S.JISIKE_OFFSITE, criterion: 'r2p2-para-136' })),
    caller: { state: caller.state, maxRatio: caller.maxRatio, worstAtFatalities: caller.worstAtFatalities },
    touching: pick(E.fnCriterionComparison({ scenarios: S.TOUCHING, criterion: 'vrom-establishments' })),
    boundary: E.fnCriterionComparison({ scenarios: S.TOUCHING, criterion: 'vrom-establishments' }).basis.boundary,
  };
};

/** Professional: the Purple Book fractions for societal risk, by effect. */
export const fractionTable = () => [
  ...['day', 'night'].map((period) => ({ effectCase: `toxic, PE ${S.TOXIC_PE} stated, ${period}`, ...E.pbFatalityFractions({ effect: 'toxic', probabilityOfDeath: S.TOXIC_PE, period }) })),
  ...S.OVERPRESSURES_PA.map((pa) => ({ effectCase: `explosion, ${pa} Pa gauge, day`, ...E.pbFatalityFractions({ effect: 'explosion', peakOverpressurePa: pa, period: 'day' }) })),
  ...[true, false].map((inside) => ({ effectCase: `flash fire, ${inside ? 'inside' : 'outside'} the envelope, night`, ...E.pbFatalityFractions({ effect: 'flash-fire', insideFlameEnvelope: inside, period: 'night' }) })),
  { effectCase: `fire at ${E.PB_IGNITION_FLUX_WM2} W/m2, day`, ...E.pbFatalityFractions({ effect: 'fire', heatFluxWM2: E.PB_IGNITION_FLUX_WM2, period: 'day' }) },
].map(({ basis, ...rest }) => rest);

/** Expert: individual risks against both R2P2 presets. */
export const alarpLadder = () => S.IR_LADDER.map((ir) => {
  const w = E.alarpBand({ individualRiskPerYr: ir, thresholds: 'r2p2-workers' });
  const p = E.alarpBand({ individualRiskPerYr: ir, thresholds: 'r2p2-public' });
  return {
    individualRiskPerYr: ir,
    workers: { band: w.band, atBoundary: w.atBoundary, alarpDemonstrationRequired: w.alarpDemonstrationRequired },
    publicBand: { band: p.band, atBoundary: p.atBoundary },
  };
});

/** Expert: products that land a hair above a threshold, and the snap. */
export const snap = () => S.SNAP_PRODUCTS.map(({ factors, thresholdPerYr, preset }) => {
  const v = factors.reduce((a, x) => a * x, 1);
  const r = E.alarpBand({ individualRiskPerYr: v, thresholds: preset });
  return { factors: factors.join(' x '), double: String(v), preset, band: r.band, atBoundary: r.atBoundary };
});

/** Expert: the EDIKAN firewall under the three conventions, and the DF sweep. */
export const firewall = () => {
  const F = S.EDIKAN_FIREWALL;
  const conv = S.CONVENTIONS.map(({ label, ...rates }) => {
    const r = E.costBenefit({ ...F, ...rates });
    return {
      label,
      presentValueBenefit: r.presentValueBenefit,
      presentValueCost: r.presentValueCost,
      costToBenefitRatio: r.costToBenefitRatio,
      fatalitiesPrevented: r.fatalitiesPrevented,
      icaf: r.costPerFatalityPrevented,
      verdict: r.verdict,
    };
  });
  const sweep = S.DF_SWEEP.map((disproportionFactor) => {
    const r = E.costBenefit({ ...F, disproportionFactor });
    return { disproportionFactor, costToBenefitRatio: r.costToBenefitRatio, maximumReasonablyPracticableCost: r.maximumReasonablyPracticableCost, verdict: r.verdict };
  });
  return { conventions: conv, sweep };
};

/** Expert: the published CBA checklist example and the R2P2 margin, from the golden. */
export const checklist = () => {
  const ck = GOLD.costBenefit.find((c) => c.id === 'hse-cba-checklist-example');
  const r = E.costBenefit(ck.args);
  const rm = GOLD.costBenefit.find((c) => c.id === 'r2p2-vpf-footnote');
  return {
    printed: ck.printed,
    presentValueBenefit: r.presentValueBenefit,
    maximumReasonablyPracticableCost: r.maximumReasonablyPracticableCost,
    verdict: r.verdict,
    r2p2Margin: E.costBenefit(rm.args).presentValueBenefit,
  };
};

/** Every refusal a panel can show, with the engine's own words. */
export const refusalSamples = () => [
  { fn: 'eventTree', what: 'a branch set that sums below one', r: E.eventTree({ initiatingFrequencyPerYr: 1e-3, tree: { branches: S.OPEN_BRANCHES.map((p, i) => ({ name: `b${i}`, probability: p })) } }) },
  { fn: 'individualRiskPerAnnum', what: 'fractions that sum above one', r: E.individualRiskPerAnnum({ locations: S.EREMOR_OVERBOOKED.map((l) => ({ name: l.place, lsirPerYr: 1e-5, occupancyFraction: l.occupancyFraction })) }) },
  { fn: 'fnCriterionComparison', what: 'a name every object inherits', r: E.fnCriterionComparison({ scenarios: S.JISIKE_OFFSITE, criterion: 'valueOf' }) },
  { fn: 'alarpBand', what: 'a name every object inherits', r: E.alarpBand({ individualRiskPerYr: 1e-2, thresholds: 'constructor' }) },
  { fn: 'costBenefit', what: 'a DF below one', r: E.costBenefit({ ...S.EDIKAN_FIREWALL, disproportionFactor: 0.5 }) },
  { fn: 'costBenefit', what: 'no VPF', r: E.costBenefit({ ...S.EDIKAN_FIREWALL, vpf: undefined }) },
].map(({ fn, what, r }) => ({ fn, what, field: r.field, error: r.error }));
