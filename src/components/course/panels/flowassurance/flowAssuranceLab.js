// Teaching lab for PD6, Flow Assurance. The three panels, the 78 shipped
// lessons and the vitest file all read this one module, so a number shown to a
// learner and a number a test pins cannot drift apart.
//
// Everything here is the vendored engine's own output. Every layer resistance,
// every share, every overall U, every relaxation length, every arrival
// temperature, every ntu, every cooldown, every depression and every injection
// rate below is a return value from a call into
// engines/production/flowlineThermal.js or hydrateInhibition.js, run over
// test-data/production/goldens/flowassurance_cases.json or over the one
// TEACHING LINE this wave declared for itself. Nothing in this file
// re-implements the engine. The only arithmetic done here is the arithmetic a
// PANEL would otherwise have to do on the engine's return values: a
// difference, a ratio, a percentage, a share, a margin, a shortfall. That
// arithmetic lives here on purpose, so that a panel is a renderer and never a
// calculator.
//
// UNITS. Field units throughout, as both engine headers state: temperature
// degF, pressure psia and never psig, length ft, diameter in unless a name
// ends Ft, mass rate lb/hr, time hr, mass per length lbm/ft, density lbm/ft3
// except an inhibitor density which the module carries in lb/gal, inhibitor
// concentration weight percent, water and injection rates bbl/d, U in
// Btu/(hr ft2 degF), a conductivity k in Btu/(hr ft degF), a heat capacity Cp
// in Btu/(lb degF), an M Cp per foot in Btu/(ft degF), and a resistance in
// hr ft degF/Btu per foot of pipe. Never SI, except the two places a golden is
// published in SI and is named so: `goldenTotalResistanceSI` in K m / W and
// `goldenBurialAtHalfDiameterSI` in K m / W.
//
// NINE PROVENANCE RULES THIS FILE EXISTS TO KEEP. All nine were found in the
// material rather than assumed, and all nine are easy to lose in a panel.
//
//   1. TWO ROADS TO ONE NUMBER, AND THEY CARRY DISTINCT NAMES. The goldens
//      were cut by an independent SI oracle and the engine recomputes the same
//      quantity in field units. On the published insulated build the ORACLE
//      says 1.334879072040 Btu/(hr ft2 degF) and the ENGINE says
//      1.334879113149, 3.0796e-8 apart. Both are correct. Every such pair here
//      is `goldenXxx` and `engineXxx` with a named `xxxRelDiff` between them,
//      never one field that could be either, so a caption cannot pair a golden
//      U with an engine relaxation length and call the result one reading.
//      Three overall U values, three relaxation lengths, three arrival
//      temperatures with their ntu, one cooldown and 24 inhibitor rows are
//      published on both roads.
//
//      AND A ROAD CARRIES ITS OWN U. The engine road through the published
//      cooldown runs on the ENGINE's insulated U and not on the oracle's,
//      which is what the wave's digest does. Pairing the oracle's U with the
//      engine's function is a THIRD road that belongs to neither, and
//      `PUBLISHED_COOLDOWN.goldenUBtuHrFt2F` is named so nobody reaches for it
//      by accident.
//
//   2. THE ORACLE WORKS IN SI AND CONVERTS ONLY AT THE BOUNDARY, AND IT
//      COMPUTES BOTH INHIBITOR RELATIONS IN CELSIUS WITH THE METRIC CONSTANTS
//      1297 AND 72. That is the sharpest available check on two remembered
//      numbers: the field constants the engine carries have to FALL OUT of the
//      metric ones. Nielsen-Bucklin does, exactly: 72 times 1.8 is the 129.6
//      the module ships. Hammerschmidt does not. 1297 times 1.8 is 2334.6, the
//      module carries 2335, and the value at which the module's OWN two
//      relations meet in the dilute limit is 129.6 times 18.015, which is
//      2334.744. Three values of one constant, and `hammerschmidtConstants()`
//      prints all three rather than choosing.
//
//   3. A SWEEP POINT IS NOT A PUBLISHED CASE. Every row this file produces by
//      moving one input on a published pipe carries `published: false`, and
//      the one row in each sweep that IS the published build carries
//      `published: true`. A foam thickness of 8.625 in is a published case; a
//      foam thickness of 10.625 in is a sweep point on published inputs, and a
//      lesson that quotes the second as though it were the first has published
//      a number no oracle has ever seen.
//
//   4. A TEACHING LINE IS NEITHER. AKASO SPUR is a construct this wave
//      declared because the published cases set no pressures, carry no
//      coating, sit in no trench that can be got wrong and have no hydrate
//      boundary, so four things this course has to teach cannot be shown on
//      them at all. Every AKASO SPUR accessor is named `akaso...` and every row
//      it returns carries `teaching: true`. No oracle has ever checked any of
//      it.
//
//   5. THE HYDRATE BOUNDARY IS AN INPUT AND BOTH ENGINE HEADERS SAY SO.
//      flowlineThermal says hydrate and wax boundaries are fluid properties
//      that come from a lab or a compositional flash and that the consumer
//      supplies them; hydrateInhibition says it does NOT compute where the
//      boundary is. So every hydrate temperature and every subcooling in this
//      file is a TEACHING INPUT, never an engine output, and every margin
//      computed against one is conditional on it. `HYDRATE_BOUNDARY_IS_AN_INPUT`
//      is exported as a constant true so a panel can say so on the screen.
//
//   6. A U TRAVELS WITH ITS REFERENCE OR IT MEANS NOTHING. `overallU` returns
//      `referenceIdIn` and the module's own header calls mixing two references
//      the commonest mistake in a flow assurance hand calculation. None of the
//      three consumers accepts that field: `relaxationLengthFt`,
//      `steadyStateProfile` and `cooldownTime` each take a bare `idIn`. Every
//      U this file exposes is carried in an object beside the diameter it was
//      referred to, and `mixedReferenceRows()` prices what happens when the
//      pair is broken.
//
//   7. A SIZED DEPRESSION AND A DELIVERED DEPRESSION ARE TWO ROADS TOO.
//      `inhibitionRequirement` picks a concentration by inverting
//      HAMMERSCHMIDT and then checks that concentration with NIELSEN-BUCKLIN,
//      and never compares the two. `sizedDepressionF` is what was asked for
//      and what the Hammerschmidt inverse delivers by construction;
//      `deliveredDepressionF` is what the engine's own check says the same dose
//      gives. They are different numbers on the same return object and they
//      have different names here for that reason.
//
// THE CAPSTONE BOUNDARY. There is no capstone material in this file at all.
// PD6's graded flowline and its eighteen graded fields live in the wave's own
// derivation and never enter the lab, so a panel cannot reach one by mistake.
// What guards that is panelCapstoneGuard.test.js, which reads the graded field
// list out of the wave directory and checks every number this lab exposes
// against it, dimension blind, at ten times the grader's own absolute
// tolerance, under the same restatements the PD5 guard uses.
//
// PURITY AND CACHING. Every accessor is pure and deterministic: no random
// number anywhere, and two calls with the same arguments return equal values.
// The engine runs that are expensive and re-read from several accessors are
// cached, and every accessor maps a cached engine return value into FRESH
// rows, so a panel cannot mutate one and change what another panel sees.

import golden from '@petrolord/engines/test-data/production/goldens/flowassurance_cases.json';
import {
  CONDUCTIVITIES, conductivity, FILM_COEFFICIENTS, INSIDE_FILMS, filmCoefficient,
  layerResistance, burialResistance, overallU, relaxationLengthFt,
  steadyStateProfile, uForArrivalTemp, cooldownTime, pipeMassLbPerFt,
  contentsMassLbPerFt, STEEL_DENSITY_LB_FT3,
} from '@petrolord/engines/engines/production/flowlineThermal.js';
import {
  INHIBITORS, inhibitor, HAMMERSCHMIDT_RELIABLE_WT_PCT, MAX_PRACTICAL_WT_PCT,
  NIELSEN_BUCKLIN_CONSTANT_F, WATER_MOLECULAR_WEIGHT,
  hammerschmidtDepression, weightPctForDepression, weightPctToMoleFraction,
  nielsenBucklinDepression, depression, injectionRate, inhibitionRequirement,
} from '@petrolord/engines/engines/production/hydrateInhibition.js';

export {
  CONDUCTIVITIES, conductivity, FILM_COEFFICIENTS, INSIDE_FILMS, filmCoefficient,
  layerResistance, burialResistance, overallU, relaxationLengthFt,
  steadyStateProfile, uForArrivalTemp, cooldownTime, pipeMassLbPerFt,
  contentsMassLbPerFt, STEEL_DENSITY_LB_FT3,
  INHIBITORS, inhibitor, HAMMERSCHMIDT_RELIABLE_WT_PCT, MAX_PRACTICAL_WT_PCT,
  NIELSEN_BUCKLIN_CONSTANT_F, WATER_MOLECULAR_WEIGHT,
  hammerschmidtDepression, weightPctForDepression, weightPctToMoleFraction,
  nielsenBucklinDepression, depression, injectionRate, inhibitionRequirement,
};

export const GOLDEN = golden;

// ---------------------------------------------------------------------------
// CONSTANTS THIS FILE DECLARES. Three of them are the wave's own declared
// constants and the rest are published case inputs, read off the golden file
// or off the engine gate that cut it. None of them is an engine value dressed
// up as something else.
// ---------------------------------------------------------------------------

/** Metres per foot, exact. One of the wave's three declared constants. */
export const M_PER_FT = 0.3048;

/** Pascals per psi, exact. One of the wave's three declared constants. */
export const PA_PER_PSI = 6894.757293168;

/** Square inches per square foot. One of the wave's three declared constants. */
export const SQ_IN_PER_SQ_FT = 144;

/**
 * Neither engine computes a hydrate boundary and both headers say so. Exported
 * as a constant so a panel can put the sentence on the screen without a lesson
 * author having to remember it.
 */
export const HYDRATE_BOUNDARY_IS_AN_INPUT = true;

/** The published pipe: a steel wall, then two inches of syntactic foam. */
export const PUBLISHED_LAYER_LABELS = Object.freeze(['carbon steel wall', 'syntactic PP foam']);

export const PUBLISHED_LAYERS = Object.freeze(golden.overallU.layers.map((l, i) => Object.freeze({
  idIn: l.idIn, odIn: l.odIn, k: l.k, label: PUBLISHED_LAYER_LABELS[i],
})));

/** The published boundary conditions, which the engine gate cut the goldens on. */
export const PUBLISHED_INSIDE_FILM_H = 250;
export const PUBLISHED_OUTSIDE_FILM_H = 200;
export const PUBLISHED_BORE_IN = golden.profile.idIn;
export const PUBLISHED_COATED_OD_IN = PUBLISHED_LAYERS[PUBLISHED_LAYERS.length - 1].odIn;
export const PUBLISHED_BURIAL_FT = 4;
export const PUBLISHED_K_SOIL = 1.2;

/** The published fluid, which every published relaxation length and arrival sits on. */
export const PUBLISHED_FLUID = Object.freeze({
  inletTempF: golden.profile.inletTempF,
  ambientTempF: golden.profile.ambientTempF,
  massRateLbHr: golden.profile.massRateLbHr,
  cpBtuLbF: golden.profile.cpBtuLbF,
  idIn: golden.profile.idIn,
});

/** The one published cooldown case, inputs and all. */
export const PUBLISHED_COOLDOWN = Object.freeze({
  startTempF: 150,
  ambientTempF: 40,
  targetTempF: 70,
  contentsRhoLbFt3: 55,
  contentsCp: 0.5,
  shellCp: 0.11,
  idIn: golden.profile.idIn,
  odIn: PUBLISHED_LAYERS[0].odIn,
  // THE ORACLE'S U, kept under a name that says whose it is. The ENGINE road
  // through this case runs on the engine's own insulated U, which is what
  // `publishedCooldownRun` uses, and the two are 3.0796e-8 apart. Pairing the
  // oracle's U with the engine's function is a third road and belongs to
  // neither.
  goldenUBtuHrFt2F: golden.cooldown.uBtuHrFt2F,
});

/**
 * THREE VALUES OF ONE CONSTANT, all three declared here so a lesson can print
 * them side by side. See provenance rule 2.
 */
export const ENGINE_HAMMERSCHMIDT_K = INHIBITORS[0].k;
export const GOLDEN_HAMMERSCHMIDT_K_FROM_METRIC = golden.constants.hammerschmidtKfromMetric;
export const HAMMERSCHMIDT_K_FOR_DILUTE_MATCH = NIELSEN_BUCKLIN_CONSTANT_F * WATER_MOLECULAR_WEIGHT;

// ---------------------------------------------------------------------------
// Small internals. Nothing exported from here computes physics.
// ---------------------------------------------------------------------------

const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) cache.set(key, fn(...args));
    return cache.get(key);
  };
};

const pct = (a, b) => ((a - b) / b) * 100;

const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-300);

/**
 * A deterministic bisection on ONE ENGINE FUNCTION, used in exactly one place:
 * to ask what concentration Nielsen-Bucklin would have picked for a wanted
 * depression. The engine offers a closed-form inverse of HAMMERSCHMIDT and no
 * inverse of Nielsen-Bucklin at all, and writing one here would be
 * re-implementing engine math. Bracketing the engine's own forward function is
 * not: every value this touches is a `nielsenBucklinDepression` return. Fixed
 * iteration count, no tolerance argument, no randomness, so it is pure.
 */
const bisectOnEngine = (fn, target, lo, hi, iterations = 200) => {
  let a = lo;
  let b = hi;
  for (let i = 0; i < iterations; i += 1) {
    const mid = (a + b) / 2;
    if (fn(mid) < target) a = mid; else b = mid;
  }
  return (a + b) / 2;
};

// ---------------------------------------------------------------------------
// SECTION 1. THE PUBLISHED CONSTANTS AND EVERY CATALOG VALUE THE ENGINES OFFER.
// Associate m01 and m02.
// ---------------------------------------------------------------------------

/**
 * The two published constants are inhibitor constants, and the oracle reached
 * both of them through its metric round trip. Everything else here is an
 * engine constant, read out of the module rather than typed.
 */
export const publishedConstants = () => ({
  goldenHammerschmidtKFromMetric: GOLDEN_HAMMERSCHMIDT_K_FROM_METRIC,
  goldenNielsenBucklinFFromMetric: golden.constants.nielsenBucklinFfromMetric,
  engineNielsenBucklinConstantF: NIELSEN_BUCKLIN_CONSTANT_F,
  engineHammerschmidtK: ENGINE_HAMMERSCHMIDT_K,
  nielsenBucklinRelDiff: rel(NIELSEN_BUCKLIN_CONSTANT_F, golden.constants.nielsenBucklinFfromMetric),
  hammerschmidtRelDiff: rel(ENGINE_HAMMERSCHMIDT_K, GOLDEN_HAMMERSCHMIDT_K_FROM_METRIC),
  waterMolecularWeight: WATER_MOLECULAR_WEIGHT,
  hammerschmidtReliableWtPct: HAMMERSCHMIDT_RELIABLE_WT_PCT,
  maxPracticalWtPct: MAX_PRACTICAL_WT_PCT,
  steelDensityLbFt3: STEEL_DENSITY_LB_FT3,
  goldenBurialAtHalfDiameterSI: golden.burialAtHalfDiameter,
  goldenTotalResistanceSI: golden.overallU.totalResistanceSI,
});

/**
 * THREE VALUES OF ONE CONSTANT, and the dilute limit that adjudicates between
 * them. The module's two relations have to agree as the concentration goes to
 * zero, because Nielsen-Bucklin's leading term is the Hammerschmidt form with
 * K over the molecular weight of water. At 0.001 weight percent the series
 * correction is far below the gap, so the residual ratio is the constant and
 * nothing else. Both depressions below are ENGINE returns.
 */
export const hammerschmidtConstants = memoize(() => {
  const weightPct = 0.001;
  const molecularWeight = INHIBITORS[0].molecularWeight;
  const ham = hammerschmidtDepression({ weightPct, molecularWeight });
  const nb = nielsenBucklinDepression({ weightPct, molecularWeight });
  return {
    weightPct,
    molecularWeight,
    engineK: ENGINE_HAMMERSCHMIDT_K,
    goldenKFromMetric: GOLDEN_HAMMERSCHMIDT_K_FROM_METRIC,
    diluteMatchK: HAMMERSCHMIDT_K_FOR_DILUTE_MATCH,
    engineOverGolden: ENGINE_HAMMERSCHMIDT_K / GOLDEN_HAMMERSCHMIDT_K_FROM_METRIC,
    engineOverDiluteMatch: ENGINE_HAMMERSCHMIDT_K / HAMMERSCHMIDT_K_FOR_DILUTE_MATCH,
    diluteMatchOverGolden: HAMMERSCHMIDT_K_FOR_DILUTE_MATCH / GOLDEN_HAMMERSCHMIDT_K_FROM_METRIC,
    hammerschmidtF: ham,
    nielsenBucklinF: nb,
    ratioAtDiluteLimit: ham / nb,
    // the gate's own two tolerances, five and a half orders of magnitude apart
    hammerschmidtGateTolerance: 5e-4,
    nielsenBucklinGateTolerance: 1e-9,
    gateToleranceRatio: 5e-4 / 1e-9,
  };
});

/** Every conductivity the module offers, with the steel it is measured against. */
export const conductivityRows = () => CONDUCTIVITIES.map((c) => ({
  id: c.id,
  label: c.label,
  kBtuHrFtF: c.k,
  ratioToSteel: c.k / conductivity('steel'),
  steelOverThis: conductivity('steel') / c.k,
}));

/** Every film coefficient, outside and inside, in their own two catalogs. */
export const filmRows = () => [
  ...FILM_COEFFICIENTS.map((f) => ({ id: f.id, label: f.label, hBtuHrFt2F: f.h, side: 'outside' })),
  ...INSIDE_FILMS.map((f) => ({ id: f.id, label: f.label, hBtuHrFt2F: f.h, side: 'inside' })),
];

/**
 * NO SILENT FALLBACK. An id in neither catalog is a NaN, and the header says
 * why: an earlier version returned the first entry, carbon steel, so a typo in
 * an insulation id made a line look two thousand times better insulated than
 * it is. The ratio that mistake was worth is on the aerogel row above.
 */
export const catalogRefusals = () => {
  const badLayer = overallU({
    layers: [{ idIn: 6, odIn: 7, k: conductivity('aerogelBlanket') }],
    insideFilmH: PUBLISHED_INSIDE_FILM_H,
    outsideFilmH: PUBLISHED_OUTSIDE_FILM_H,
  });
  return [
    {
      label: 'a conductivity id that is not in the catalog',
      returned: conductivity('aerogelBlanket'),
      isNaN: Number.isNaN(conductivity('aerogelBlanket')),
    },
    {
      label: 'a film coefficient id that is not in either catalog',
      returned: filmCoefficient('seabedStill'),
      isNaN: Number.isNaN(filmCoefficient('seabedStill')),
    },
    {
      label: 'and the NaN propagates into a refusal when a layer carries it',
      ok: badLayer.ok,
      error: badLayer.error,
    },
  ];
};

// ---------------------------------------------------------------------------
// SECTION 2 and 3. THE PUBLISHED PIPE IN FIVE BUILDS, EVERY LAYER, EVERY SHARE.
// Associate m02 and m03. Provenance rules 1 and 3 both live here.
// ---------------------------------------------------------------------------

/** The five builds this lab offers on the published pipe, in reading order. */
export const PUBLISHED_BUILDS = Object.freeze([
  'bare', 'insulated', 'buried4ft', 'stillWater', 'stagnantBore',
]);

export const PUBLISHED_BUILD_LABELS = Object.freeze({
  bare: 'the steel wall alone, no foam and no trench',
  insulated: 'the steel wall and two inches of syntactic foam',
  buried4ft: 'the insulated build in a four foot trench in wet soil',
  stillWater: 'the insulated build in still water, outside film 50',
  stagnantBore: 'the insulated build shut in, inside film 5',
});

/** Which of the five the goldens publish a U for, and which are sweep points. */
export const PUBLISHED_BUILD_IS_PUBLISHED = Object.freeze({
  bare: true, insulated: true, buried4ft: true, stillWater: false, stagnantBore: false,
});

const publishedBuildArgs = (id) => {
  const base = {
    layers: PUBLISHED_LAYERS.map((l) => ({ ...l })),
    insideFilmH: PUBLISHED_INSIDE_FILM_H,
    outsideFilmH: PUBLISHED_OUTSIDE_FILM_H,
    referenceIdIn: PUBLISHED_BORE_IN,
  };
  if (id === 'bare') return { ...base, layers: [{ ...PUBLISHED_LAYERS[0] }] };
  if (id === 'buried4ft') return { ...base, burialFt: PUBLISHED_BURIAL_FT, kSoil: PUBLISHED_K_SOIL };
  if (id === 'stillWater') return { ...base, outsideFilmH: 50 };
  if (id === 'stagnantBore') return { ...base, insideFilmH: 5 };
  return base;
};

const publishedBuildRun = memoize((id) => overallU(publishedBuildArgs(id)));

/** The stack of one build, term by term, as the ENGINE returns it with its own shares. */
export const publishedBuildRows = (id = 'insulated') => publishedBuildRun(id).resistances.map((r) => ({
  build: id,
  term: r.id,
  label: r.label || null,
  resistance: r.r,
  sharePct: r.sharePct,
  published: PUBLISHED_BUILD_IS_PUBLISHED[id],
}));

/** One build in one object, with the reference the U is meaningless without. */
export const publishedBuildSummary = (id = 'insulated') => {
  const u = publishedBuildRun(id);
  const rows = publishedBuildRows(id);
  return {
    build: id,
    label: PUBLISHED_BUILD_LABELS[id],
    published: PUBLISHED_BUILD_IS_PUBLISHED[id],
    ok: u.ok,
    engineUBtuHrFt2F: u.uBtuHrFt2F,
    totalResistance: u.totalResistance,
    referenceIdIn: u.referenceIdIn,
    termCount: rows.length,
    sharesSumPct: rows.reduce((a, r) => a + r.sharePct, 0),
    largestTerm: rows.reduce((a, r) => (r.sharePct > a.sharePct ? r : a), rows[0]).term,
    largestSharePct: Math.max(...rows.map((r) => r.sharePct)),
    // U times its reference diameter IN FEET is the same number whichever
    // reference is chosen, because U times pi times that diameter is the
    // conductance per foot of pipe and a conductance per foot does not care
    // what area was named. The diameter has to be in FEET here: the engine
    // carries diameters in inches and the resistance per foot in feet, and
    // multiplying a U by a diameter in inches is a number with no meaning.
    uTimesReferenceIdFt: u.uBtuHrFt2F * (u.referenceIdIn / 12),
    conductancePerFootBtuHrFtF: 1 / u.totalResistance,
    conductanceFromU: u.uBtuHrFt2F * Math.PI * (u.referenceIdIn / 12),
  };
};

/**
 * THE THREE PUBLISHED U VALUES ON BOTH ROADS. The golden is the oracle
 * stacking the same resistances in SI and converting back at the end; the
 * engine is the shipped JavaScript stacking them in field units and never
 * leaving them. Provenance rule 1: the two have distinct names and a named
 * relative difference, and a lesson stays on one of them.
 */
export const publishedUPairRows = () => [
  ['bare', golden.overallU.bare],
  ['insulated', golden.overallU.insulated],
  ['buried4ft', golden.overallU.buried4ft],
].map(([id, goldenU]) => {
  const engineU = publishedBuildRun(id).uBtuHrFt2F;
  return {
    build: id,
    label: PUBLISHED_BUILD_LABELS[id],
    goldenUBtuHrFt2F: goldenU,
    engineUBtuHrFt2F: engineU,
    uRelDiff: rel(goldenU, engineU),
    uDiff: engineU - goldenU,
    referenceIdIn: PUBLISHED_BORE_IN,
    published: true,
  };
});

/** What each build costs and buys, as ratios rather than as numbers. */
export const publishedBuildRatios = () => {
  const bare = publishedBuildRun('bare').uBtuHrFt2F;
  const insulated = publishedBuildRun('insulated').uBtuHrFt2F;
  const buried = publishedBuildRun('buried4ft').uBtuHrFt2F;
  return {
    bareUBtuHrFt2F: bare,
    insulatedUBtuHrFt2F: insulated,
    buriedUBtuHrFt2F: buried,
    bareOverInsulated: bare / insulated,
    insulatedOverBuried: insulated / buried,
    bareOverBuried: bare / buried,
  };
};

/**
 * THE SAME FOAM LAYER ACROSS FOUR BUILDS. Its RESISTANCE never changes. Its
 * SHARE does, and it is the share that tells a lesson what to look at. A share
 * is a property of a build and not a number to memorise.
 */
export const foamShareRows = () => ['insulated', 'buried4ft', 'stillWater', 'stagnantBore']
  .map((id) => {
    const row = publishedBuildRows(id).find((r) => r.term === 'layer1');
    return {
      build: id,
      label: PUBLISHED_BUILD_LABELS[id],
      resistance: row.resistance,
      sharePct: row.sharePct,
      published: PUBLISHED_BUILD_IS_PUBLISHED[id],
    };
  });

/** And the steel wall, for contrast: the strongest material carrying the least. */
export const steelShareRows = () => ['bare', 'insulated', 'buried4ft'].map((id) => {
  const row = publishedBuildRows(id).find((r) => r.term === 'layer0');
  return {
    build: id,
    resistance: row.resistance,
    sharePct: row.sharePct,
    published: true,
  };
});

/**
 * WHY THE STEEL CARRIES NOTHING, in two ratios that multiply to the third. A
 * layer resistance is ln(Do/Di) over k, so a layer with the thinnest log and
 * the largest conductivity carries the least. Both layer resistances below are
 * ENGINE returns and the two logs are the arithmetic a panel would do on the
 * diameters it is already showing.
 */
export const layerLogTerms = () => {
  const steel = PUBLISHED_LAYERS[0];
  const foam = PUBLISHED_LAYERS[1];
  const steelR = layerResistance(steel);
  const foamR = layerResistance(foam);
  const steelLog = Math.log(steel.odIn / steel.idIn);
  const foamLog = Math.log(foam.odIn / foam.idIn);
  return {
    steelIdIn: steel.idIn,
    steelOdIn: steel.odIn,
    foamIdIn: foam.idIn,
    foamOdIn: foam.odIn,
    steelLogTerm: steelLog,
    foamLogTerm: foamLog,
    logRatio: foamLog / steelLog,
    steelK: steel.k,
    foamK: foam.k,
    conductivityRatio: steel.k / foam.k,
    productOfRatios: (foamLog / steelLog) * (steel.k / foam.k),
    steelResistance: steelR,
    foamResistance: foamR,
    resistanceRatio: foamR / steelR,
  };
};

/** What the stack refuses outright, and it does refuse a bad LAYER properly. */
export const stackRefusals = () => {
  const noLayers = overallU({ layers: [] });
  const inverted = overallU({
    layers: [{ idIn: 6, odIn: 5, k: 26 }],
    insideFilmH: PUBLISHED_INSIDE_FILM_H, outsideFilmH: PUBLISHED_OUTSIDE_FILM_H,
  });
  const zeroK = overallU({
    layers: [{ idIn: 6, odIn: 7, k: 0 }],
    insideFilmH: PUBLISHED_INSIDE_FILM_H, outsideFilmH: PUBLISHED_OUTSIDE_FILM_H,
  });
  return [
    { label: 'no layers at all', ok: noLayers.ok, error: noLayers.error },
    { label: 'an outside diameter smaller than the inside', ok: inverted.ok, error: inverted.error },
    { label: 'a conductivity of zero', ok: zeroK.ok, error: zeroK.error },
  ];
};

// ---------------------------------------------------------------------------
// SECTION 4. WHAT THICKER FOAM BUYS, AND WHERE IT STOPS BUYING IT.
// Associate m03. Every row but one is a SWEEP POINT on published inputs.
// ---------------------------------------------------------------------------

export const FOAM_OD_SWEEP_IN = Object.freeze([
  6.625, 7.125, 7.625, 8.125, 8.625, 9.625, 10.625, 12.625, 16.625,
]);

/**
 * The published pipe, the published films and the published foam conductivity,
 * with ONLY the foam outside diameter moved. The 8.625 in row is the published
 * build and carries `published: true`. Every other row is a sweep point.
 *
 * The last column is a contiguous slice: each row against the one above it, so
 * a marginal return reads as a sequence rather than as an assertion. The first
 * row has no foam at all, which is the bare build, so its foam resistance is
 * null rather than zero.
 */
export const foamThicknessRows = (odsIn = FOAM_OD_SWEEP_IN) => {
  const steel = PUBLISHED_LAYERS[0];
  const foam = PUBLISHED_LAYERS[1];
  const runs = odsIn.map((odIn) => {
    const layers = odIn <= steel.odIn
      ? [{ ...steel }]
      : [{ ...steel }, { ...foam, odIn }];
    const u = overallU({
      layers,
      insideFilmH: PUBLISHED_INSIDE_FILM_H,
      outsideFilmH: PUBLISHED_OUTSIDE_FILM_H,
      referenceIdIn: PUBLISHED_BORE_IN,
    });
    const foamRow = u.resistances.find((r) => r.id === 'layer1') || null;
    return { odIn, u, foamRow };
  });
  return runs.map(({ odIn, u, foamRow }, i) => ({
    foamOdIn: odIn,
    wallIn: Math.max(0, odIn - steel.odIn) / 2,
    engineUBtuHrFt2F: u.uBtuHrFt2F,
    totalResistance: u.totalResistance,
    foamResistance: foamRow ? foamRow.r : null,
    foamSharePct: foamRow ? foamRow.sharePct : 0,
    uRatioToRowAbove: i === 0 ? null : runs[i - 1].u.uBtuHrFt2F / u.uBtuHrFt2F,
    published: odIn === PUBLISHED_COATED_OD_IN,
  }));
};

/**
 * WHY THE FIRST QUARTER INCH IS WORTH MORE THAN THE LAST TWO. A layer
 * resistance goes as ln(Do/Di), so equal THICKNESS added far out is less log
 * than the same thickness added close in. Both logs are on diameters the sweep
 * already prints.
 */
export const foamLogComparison = () => {
  const firstQuarter = Math.log(7.125 / 6.625);
  const outerQuarter = Math.log(16.625 / 16.125);
  return {
    firstQuarterLog: firstQuarter,
    outerQuarterLog: outerQuarter,
    logRatio: firstQuarter / outerQuarter,
  };
};

export const INSULATION_MATERIAL_IDS = Object.freeze([
  'syntacticPP', 'polyurethane', 'polypropylene', 'aerogel', 'concrete',
]);

/**
 * The same two inches of coating in five materials, on the published pipe at
 * the published foam outside diameter. SWEEP POINTS on published inputs, all
 * five, and the syntactic row is the published one.
 *
 * The layer resistance is exactly inverse in k, so the table reads off one row
 * and a division. What is NOT inverse in k is the U, because the films and the
 * steel do not move.
 */
export const insulationMaterialRows = (ids = INSULATION_MATERIAL_IDS) => ids.map((id) => {
  const layers = [
    { ...PUBLISHED_LAYERS[0] },
    { ...PUBLISHED_LAYERS[1], k: conductivity(id), label: id },
  ];
  const u = overallU({
    layers,
    insideFilmH: PUBLISHED_INSIDE_FILM_H,
    outsideFilmH: PUBLISHED_OUTSIDE_FILM_H,
    referenceIdIn: PUBLISHED_BORE_IN,
  });
  const layerRow = u.resistances.find((r) => r.id === 'layer1');
  return {
    materialId: id,
    label: (CONDUCTIVITIES.find((c) => c.id === id) || {}).label,
    kBtuHrFtF: conductivity(id),
    engineUBtuHrFt2F: u.uBtuHrFt2F,
    layerResistance: layerRow.r,
    layerSharePct: layerRow.sharePct,
    published: id === 'syntacticPP',
  };
});

/** The two ends of that table: resistance is exactly inverse in k, and U is not. */
export const insulationMaterialContrast = () => {
  const rows = insulationMaterialRows();
  const foam = rows.find((r) => r.materialId === 'syntacticPP');
  const aerogel = rows.find((r) => r.materialId === 'aerogel');
  return {
    foamK: foam.kBtuHrFtF,
    aerogelK: aerogel.kBtuHrFtF,
    conductivityRatio: foam.kBtuHrFtF / aerogel.kBtuHrFtF,
    layerResistanceRatio: aerogel.layerResistance / foam.layerResistance,
    uRatio: foam.engineUBtuHrFt2F / aerogel.engineUBtuHrFt2F,
    resistanceIsExactlyInverse: true,
    uIsNot: true,
  };
};

// ---------------------------------------------------------------------------
// SECTION 5. THE BURIAL TERM, ITS DEPTH SWEEP, ITS SOIL SWEEP AND ITS FLOOR.
// Associate m04.
// ---------------------------------------------------------------------------

/** Half the published coated diameter, in feet. Below this the term is NaN. */
export const PUBLISHED_HALF_DIAMETER_FT = PUBLISHED_COATED_OD_IN / 24;

/**
 * THE H = D/2 LIMIT ON TWO ROADS, AND THE TWO ARE IN DIFFERENT UNITS ON
 * PURPOSE. The golden publishes it in SI, K m / W, because the whole oracle is
 * SI; the engine returns it in hr ft degF/Btu per foot. Both are floating point
 * residue of an exact zero and the two residues are different sizes because
 * the two arithmetics reach acosh(1) by different routes. Do not read them as
 * a disagreement and do not convert one into the other.
 */
export const burialFloor = () => {
  const engineFt = burialResistance({
    odIn: PUBLISHED_COATED_OD_IN,
    burialFt: PUBLISHED_HALF_DIAMETER_FT,
    kSoil: PUBLISHED_K_SOIL,
  });
  return {
    odIn: PUBLISHED_COATED_OD_IN,
    burialFt: PUBLISHED_HALF_DIAMETER_FT,
    kSoil: PUBLISHED_K_SOIL,
    goldenBurialAtHalfDiameterSI: golden.burialAtHalfDiameter,
    engineBurialAtHalfDiameterField: engineFt,
    bothAreResidueOfAnExactZero: true,
    exactAnswer: 0,
  };
};

export const BURIAL_DEPTH_SWEEP_FT = Object.freeze([
  PUBLISHED_COATED_OD_IN / 24, 0.4, 0.5, 1, 2, 3, 4, 6, 10, 20,
]);

/**
 * Depth sweep on the published coated diameter in the published wet soil. The
 * 4.0 ft row is the published build and carries `published: true`; every other
 * row is a SWEEP POINT.
 *
 * Doubling the depth does NOT double the ground term, because acosh grows like
 * a logarithm once 2H/D is past about two. Depth is cheap insulation at first
 * and then it is nothing.
 */
export const burialDepthRows = (depths = BURIAL_DEPTH_SWEEP_FT, kSoil = PUBLISHED_K_SOIL) =>
  depths.map((burialFt) => {
    const r = burialResistance({ odIn: PUBLISHED_COATED_OD_IN, burialFt, kSoil });
    const u = overallU({
      ...publishedBuildArgs('insulated'), burialFt, kSoil,
    });
    const groundRow = u.resistances.find((x) => x.id === 'burial') || null;
    return {
      burialFt,
      kSoil,
      twoHOverD: (2 * burialFt) / (PUBLISHED_COATED_OD_IN / 12),
      acoshTerm: Math.acosh(Math.max(1, (2 * burialFt) / (PUBLISHED_COATED_OD_IN / 12))),
      groundResistance: r,
      engineUBtuHrFt2F: u.uBtuHrFt2F,
      groundSharePct: groundRow ? groundRow.sharePct : 0,
      termPresent: groundRow !== null,
      published: burialFt === PUBLISHED_BURIAL_FT && kSoil === PUBLISHED_K_SOIL,
    };
  });

export const SOIL_SWEEP_K = Object.freeze([1.2, 0.5, 0.9, 2.0]);

/** Soil sweep at the published depth. The ground term is exactly inverse in k. */
export const soilRows = (ks = SOIL_SWEEP_K) => ks.map((kSoil) => {
  const r = burialResistance({
    odIn: PUBLISHED_COATED_OD_IN, burialFt: PUBLISHED_BURIAL_FT, kSoil,
  });
  const u = overallU({
    ...publishedBuildArgs('insulated'), burialFt: PUBLISHED_BURIAL_FT, kSoil,
  });
  const groundRow = u.resistances.find((x) => x.id === 'burial');
  return {
    kSoil,
    label: (CONDUCTIVITIES.find((c) => c.k === kSoil) || {}).label || null,
    groundResistance: r,
    engineUBtuHrFt2F: u.uBtuHrFt2F,
    groundSharePct: groundRow.sharePct,
    published: kSoil === PUBLISHED_K_SOIL,
  };
});

/**
 * WHAT THE BURIAL TERM ASSUMES, priced. It is the shape factor for an
 * ISOTHERMAL cylinder in a SEMI-INFINITE medium, so one uniform soil
 * conductivity everywhere, a flat surface at ambient, no groundwater movement,
 * no seasonal front, and a burial measured to the CENTRELINE and not to the
 * top of pipe. None of those is checked by anything in the module, and the
 * last of them is a reading error a careful person makes.
 */
export const burialCentrelineConvention = (burialFt = PUBLISHED_BURIAL_FT) => {
  const toCentreline = burialResistance({
    odIn: PUBLISHED_COATED_OD_IN, burialFt, kSoil: PUBLISHED_K_SOIL,
  });
  const readToTopFt = burialFt + PUBLISHED_COATED_OD_IN / 24;
  const toTop = burialResistance({
    odIn: PUBLISHED_COATED_OD_IN, burialFt: readToTopFt, kSoil: PUBLISHED_K_SOIL,
  });
  return {
    burialFt,
    toCentrelineResistance: toCentreline,
    readAsTopOfPipeFt: readToTopFt,
    readAsTopOfPipeResistance: toTop,
    relDiffPct: pct(toTop, toCentreline),
  };
};

// ---------------------------------------------------------------------------
// SECTION 6. BRIEF DEFECT (iii). THE GROUND TERM THAT IS CAUGHT AND DROPPED
// RATHER THAN REFUSED. Expert m02.
// ---------------------------------------------------------------------------

/**
 * `burialResistance` returns NaN when the burial is shallower than half the
 * coated diameter, because 2H/D is then below 1 and acosh has no real value
 * there. `overallU` guards that NaN with `Number.isFinite` BEFORE pushing the
 * term, so the term never reaches the refusal three lines later that would
 * have caught it. A buried line comes back as an EXPOSED line, with `ok: true`
 * and no note.
 *
 * BOTH U VALUES ARE HERE AND THEY HAVE DISTINCT NAMES.
 * `droppedTermUBtuHrFt2F` is what the engine returns when the trench is
 * swallowed. `withTermUBtuHrFt2F` is what the same stack gives at the trench
 * that was meant. The error between them is returned with `ok: true` and no
 * note anywhere in the object.
 *
 * `typoBurialFt` is the depth as it was ENTERED and `intendedBurialFt` is the
 * depth that was meant, which is the whole shape of the mistake: a decimal
 * point, not a wrong pipe.
 */
export const droppedTrench = (intendedBurialFt = 3, typoBurialFt = 0.3) => {
  const withTerm = overallU({
    ...publishedBuildArgs('insulated'), burialFt: intendedBurialFt, kSoil: PUBLISHED_K_SOIL,
  });
  const dropped = overallU({
    ...publishedBuildArgs('insulated'), burialFt: typoBurialFt, kSoil: PUBLISHED_K_SOIL,
  });
  const exposed = publishedBuildRun('insulated');
  const withRow = withTerm.resistances.find((r) => r.id === 'burial');
  return {
    intendedBurialFt,
    typoBurialFt,
    halfDiameterFt: PUBLISHED_HALF_DIAMETER_FT,
    intendedResistance: burialResistance({
      odIn: PUBLISHED_COATED_OD_IN, burialFt: intendedBurialFt, kSoil: PUBLISHED_K_SOIL,
    }),
    typoResistance: burialResistance({
      odIn: PUBLISHED_COATED_OD_IN, burialFt: typoBurialFt, kSoil: PUBLISHED_K_SOIL,
    }),
    typoResistanceIsNaN: Number.isNaN(burialResistance({
      odIn: PUBLISHED_COATED_OD_IN, burialFt: typoBurialFt, kSoil: PUBLISHED_K_SOIL,
    })),
    withTermOk: withTerm.ok,
    withTermUBtuHrFt2F: withTerm.uBtuHrFt2F,
    withTermCount: withTerm.resistances.length,
    withTermGroundSharePct: withRow.sharePct,
    droppedTermOk: dropped.ok,
    droppedTermUBtuHrFt2F: dropped.uBtuHrFt2F,
    droppedTermCount: dropped.resistances.length,
    droppedTermHasBurial: dropped.resistances.some((r) => r.id === 'burial'),
    droppedTermError: dropped.error === undefined ? null : dropped.error,
    droppedTermNote: dropped.note === undefined ? null : dropped.note,
    uErrorPct: pct(dropped.uBtuHrFt2F, withTerm.uBtuHrFt2F),
    // the whole finding on one line: the buried answer and the exposed answer
    // are the same number, and nothing in the return says a trench was asked for
    exposedBuildUBtuHrFt2F: exposed.uBtuHrFt2F,
    droppedEqualsExposed: dropped.uBtuHrFt2F === exposed.uBtuHrFt2F,
    droppedAgainstExposedRelDiff: rel(dropped.uBtuHrFt2F, exposed.uBtuHrFt2F),
  };
};

/**
 * TWO FAILURES, ONE INPUT CLASS, OPPOSITE TREATMENT. The same module refuses a
 * bad LAYER properly and swallows a bad TRENCH, and the conductivity helper's
 * own header states the discipline the trench branch does not follow: a NaN
 * propagates into a refusal, a plausible wrong number does not.
 */
export const refusalAsymmetry = () => {
  const badLayer = overallU({
    layers: [{ idIn: 6, odIn: 7, k: conductivity('nonsense') }],
    insideFilmH: PUBLISHED_INSIDE_FILM_H, outsideFilmH: PUBLISHED_OUTSIDE_FILM_H,
  });
  const badTrench = overallU({
    ...publishedBuildArgs('insulated'), burialFt: 0.3, kSoil: PUBLISHED_K_SOIL,
  });
  return [
    {
      label: 'a layer whose conductivity could not be resolved',
      ok: badLayer.ok,
      error: badLayer.error === undefined ? null : badLayer.error,
      refused: badLayer.ok === false,
    },
    {
      label: 'a trench whose ground resistance could not be resolved',
      ok: badTrench.ok,
      error: badTrench.error === undefined ? null : badTrench.error,
      refused: badTrench.ok === false,
    },
  ];
};

// ---------------------------------------------------------------------------
// SECTION 7 and 8. WHAT A U IS REFERRED TO, AND WHAT A CONSUMER DOES WITH THE
// OTHER REFERENCE. Associate m02 l05 states it, Expert m05 prices it.
// BRIEF defect (iv). Provenance rule 6.
// ---------------------------------------------------------------------------

/**
 * THE SAME PHYSICAL LINE EXPRESSED TWICE. Nothing about the pipe changes
 * between the two rows: the same layers, the same films, the same trench, the
 * same total resistance to the last figure. Only `referenceIdIn` moves. U is a
 * resistance divided by an AREA, so naming a different area gives a different
 * U for identical physics, and the engine reports which one it used.
 */
export const referenceRows = (build = 'buried4ft') => [PUBLISHED_BORE_IN, PUBLISHED_COATED_OD_IN]
  .map((referenceIdIn) => {
    const u = overallU({ ...publishedBuildArgs(build), referenceIdIn });
    return {
      build,
      referenceIdIn,
      engineUBtuHrFt2F: u.uBtuHrFt2F,
      totalResistance: u.totalResistance,
      uTimesReferenceIdFt: u.uBtuHrFt2F * (referenceIdIn / 12),
      published: PUBLISHED_BUILD_IS_PUBLISHED[build],
    };
  });

/** The invariant, stated as a ratio and checked against the diameter ratio. */
export const referenceInvariant = (build = 'buried4ft') => {
  const [bore, coated] = referenceRows(build);
  return {
    build,
    boreReferenceIdIn: bore.referenceIdIn,
    coatedReferenceIdIn: coated.referenceIdIn,
    boreUBtuHrFt2F: bore.engineUBtuHrFt2F,
    coatedUBtuHrFt2F: coated.engineUBtuHrFt2F,
    uRatio: bore.engineUBtuHrFt2F / coated.engineUBtuHrFt2F,
    diameterRatio: coated.referenceIdIn / bore.referenceIdIn,
    ratioDifference: bore.engineUBtuHrFt2F / coated.engineUBtuHrFt2F
      - coated.referenceIdIn / bore.referenceIdIn,
    resistancesRelDiff: rel(bore.totalResistance, coated.totalResistance),
    conductancePerFootBtuHrFtF: 1 / bore.totalResistance,
    boreUTimesIdFt: bore.uTimesReferenceIdFt,
    coatedUTimesIdFt: coated.uTimesReferenceIdFt,
    // and that product times pi IS the conductance per foot, both ways
    conductanceFromBoreU: bore.uTimesReferenceIdFt * Math.PI,
  };
};

export const MIXED_REFERENCE_LENGTHS_FT = Object.freeze(
  golden.profile.points.map((p) => p.lengthFt),
);

/**
 * THE OMISSION, PRICED. `relaxationLengthFt`, `steadyStateProfile` and
 * `cooldownTime` each take a bare `idIn`, none of them takes the `overallU`
 * result, and none of them can see `referenceIdIn`. Handing a consumer the
 * OD-referred U with the BORE diameter is dimensionally consistent and raises
 * no complaint anywhere.
 *
 * Three rows per length: the pair kept together at the bore, the pair kept
 * together at the coated outside diameter, and the mixed pair. The two correct
 * routes agree because the error and the correction cancel exactly; the mixed
 * one does not, and its relaxation length is wrong by exactly the reference
 * ratio and nothing else.
 */
export const mixedReferenceRows = (lengths = MIXED_REFERENCE_LENGTHS_FT, build = 'buried4ft') => {
  const [bore, coated] = referenceRows(build);
  const routes = [
    { route: 'bore referred U with the bore diameter', correct: true, u: bore.engineUBtuHrFt2F, idIn: PUBLISHED_BORE_IN },
    { route: 'OD referred U with the coated outside diameter', correct: true, u: coated.engineUBtuHrFt2F, idIn: PUBLISHED_COATED_OD_IN },
    { route: 'OD referred U with the bore diameter', correct: false, u: coated.engineUBtuHrFt2F, idIn: PUBLISHED_BORE_IN },
  ];
  const out = [];
  lengths.forEach((lengthFt) => {
    const priced = routes.map((r) => {
      const p = steadyStateProfile({
        lengthFt,
        inletTempF: PUBLISHED_FLUID.inletTempF,
        ambientTempF: PUBLISHED_FLUID.ambientTempF,
        massRateLbHr: PUBLISHED_FLUID.massRateLbHr,
        cpBtuLbF: PUBLISHED_FLUID.cpBtuLbF,
        uBtuHrFt2F: r.u,
        idIn: r.idIn,
      });
      return { ...r, lengthFt, relaxationLengthFt: p.relaxationLengthFt, ntu: p.ntu, arrivalTempF: p.arrivalTempF };
    });
    const correct = priced[0];
    priced.forEach((r) => out.push({
      ...r,
      arrivalErrorF: r.arrivalTempF - correct.arrivalTempF,
      relaxationErrorPct: pct(r.relaxationLengthFt, correct.relaxationLengthFt),
      published: false,
    }));
  });
  return out;
};

/** The headline: the mixed route's relaxation error is the reference ratio exactly. */
export const mixedReferenceHeadline = (build = 'buried4ft') => {
  const inv = referenceInvariant(build);
  const rows = mixedReferenceRows(MIXED_REFERENCE_LENGTHS_FT, build);
  const mixed = rows.filter((r) => !r.correct);
  return {
    build,
    diameterRatio: inv.diameterRatio,
    referenceRatioAsPct: (inv.diameterRatio - 1) * 100,
    relaxationErrorPct: mixed[0].relaxationErrorPct,
    worstArrivalErrorF: Math.max(...mixed.map((r) => Math.abs(r.arrivalErrorF))),
    worstAtLengthFt: mixed.reduce((a, r) => (Math.abs(r.arrivalErrorF) > Math.abs(a.arrivalErrorF) ? r : a), mixed[0]).lengthFt,
    errorsByLengthFt: mixed.map((r) => ({ lengthFt: r.lengthFt, arrivalErrorF: r.arrivalErrorF })),
    consumersThatAcceptAReference: 0,
    consumersThatTakeABareIdIn: 3,
  };
};

// ---------------------------------------------------------------------------
// SECTION 9. BOTH MASSES, AND THE LAYERS THAT CARRY NONE.
// Associate m05, and BRIEF defect (v) begins here.
// ---------------------------------------------------------------------------

/**
 * The module has exactly two mass helpers and both are geometry and nothing
 * else. The published cooldown case supplies the two densities used here.
 */
export const publishedMasses = memoize(() => {
  const steelMass = pipeMassLbPerFt({
    idIn: PUBLISHED_COOLDOWN.idIn, odIn: PUBLISHED_COOLDOWN.odIn,
  });
  const contentsMass = contentsMassLbPerFt({
    idIn: PUBLISHED_COOLDOWN.idIn, densityLbFt3: PUBLISHED_COOLDOWN.contentsRhoLbFt3,
  });
  const contentsMcp = contentsMass * PUBLISHED_COOLDOWN.contentsCp;
  const steelMcp = steelMass * PUBLISHED_COOLDOWN.shellCp;
  return {
    idIn: PUBLISHED_COOLDOWN.idIn,
    odIn: PUBLISHED_COOLDOWN.odIn,
    steelDensityLbFt3: STEEL_DENSITY_LB_FT3,
    contentsDensityLbFt3: PUBLISHED_COOLDOWN.contentsRhoLbFt3,
    steelMassLbPerFt: steelMass,
    contentsMassLbPerFt: contentsMass,
    steelAreaFt2: (Math.PI / 4) * ((PUBLISHED_COOLDOWN.odIn / 12) ** 2 - (PUBLISHED_COOLDOWN.idIn / 12) ** 2),
    boreAreaFt2: (Math.PI / 4) * (PUBLISHED_COOLDOWN.idIn / 12) ** 2,
    steelOverContentsMass: steelMass / contentsMass,
    contentsCp: PUBLISHED_COOLDOWN.contentsCp,
    shellCp: PUBLISHED_COOLDOWN.shellCp,
    contentsMcpBtuFtF: contentsMcp,
    steelMcpBtuFtF: steelMcp,
    totalMcpBtuFtF: contentsMcp + steelMcp,
    contentsShareOfMcpPct: (contentsMcp / (contentsMcp + steelMcp)) * 100,
  };
});

/**
 * BRIEF POINT (xi). THE HEADER'S WARNING AND THE HEADER'S OWN PUBLISHED CASE
 * DISAGREE, AND THE REVERSAL IS THE TEACHING POINT RATHER THAN A DEFECT.
 * `cooldownTime` says that on an insulated small-bore line the steel can hold
 * as much heat as the oil in it. On the published case the steel DOES outweigh
 * the contents, by mass. Once the two heat capacities are applied, Cp 0.11
 * against Cp 0.50, the ranking reverses and the contents carry most of the
 * M Cp. Mass is not heat capacity, and the same pipe answers the two questions
 * in opposite orders.
 */
export const massAgainstHeatCapacity = () => {
  const m = publishedMasses();
  const akaso = akasoMasses();
  return {
    publishedSteelMassLbPerFt: m.steelMassLbPerFt,
    publishedContentsMassLbPerFt: m.contentsMassLbPerFt,
    publishedSteelOverContentsMass: m.steelOverContentsMass,
    publishedSteelOutweighsContents: m.steelMassLbPerFt > m.contentsMassLbPerFt,
    publishedSteelMcpBtuFtF: m.steelMcpBtuFtF,
    publishedContentsMcpBtuFtF: m.contentsMcpBtuFtF,
    publishedContentsOverSteelMcp: m.contentsMcpBtuFtF / m.steelMcpBtuFtF,
    publishedContentsCarriesMostOfTheMcp: m.contentsMcpBtuFtF > m.steelMcpBtuFtF,
    rankingReverses: (m.steelMassLbPerFt > m.contentsMassLbPerFt)
      !== (m.steelMcpBtuFtF > m.contentsMcpBtuFtF),
    publishedContentsShareOfMcpPct: m.contentsShareOfMcpPct,
    // and on the TEACHING gas line the split runs the other way again, because
    // a gas at 8.6 lbm/ft3 has very little mass in the bore at all
    teachingContentsShareOfApiMcpPct: akaso.contentsShareOfApiMcpPct,
    teachingSteelOverContentsMass: akaso.steelMassLbPerFt / akaso.contentsMassLbPerFt,
  };
};

/**
 * THE LAYERS THAT CARRY NONE. `overallU` takes an UNBOUNDED layer list.
 * `cooldownTime` has exactly two mass slots, contents and shell. There is no
 * slot for a coating, no helper that lumps one, and no warning anywhere when
 * the layer list is longer than two. On the published insulated build the foam
 * carries almost the whole resistance and, as the API reads, none of the mass.
 *
 * The foam density and heat capacity below are TEACHING numbers. No golden
 * publishes them and the engine has no catalog of them, so they are named on
 * the returned object as teaching values.
 */
export const TEACHING_FOAM_DENSITY_LB_FT3 = 44;
export const TEACHING_FOAM_CP = 0.28;

export const publishedFoamMass = () => {
  const foam = PUBLISHED_LAYERS[1];
  const mass = pipeMassLbPerFt({
    idIn: foam.idIn, odIn: foam.odIn, densityLbFt3: TEACHING_FOAM_DENSITY_LB_FT3,
  });
  const mcp = mass * TEACHING_FOAM_CP;
  const pub = publishedMasses();
  return {
    teaching: true,
    foamDensityLbFt3: TEACHING_FOAM_DENSITY_LB_FT3,
    foamCp: TEACHING_FOAM_CP,
    foamMassLbPerFt: mass,
    foamMcpBtuFtF: mcp,
    publishedCooldownMcpBtuFtF: pub.totalMcpBtuFtF,
    asFractionOfCooldownMcpPct: (mcp / pub.totalMcpBtuFtF) * 100,
    foamShareOfInsulatedResistancePct:
      publishedBuildRows('insulated').find((r) => r.term === 'layer1').sharePct,
    foamShareOfBuriedResistancePct:
      publishedBuildRows('buried4ft').find((r) => r.term === 'layer1').sharePct,
    layersOverallUAccepted: PUBLISHED_LAYERS.length,
    massSlotsCooldownOffers: 2,
    massSlotsTheFoamFitsInto: 0,
  };
};

/** Both mass helpers refuse what they cannot compute, and they do refuse. */
export const massRefusals = () => [
  {
    label: 'a pipe whose outside diameter is no larger than its inside',
    returned: pipeMassLbPerFt({ idIn: 7, odIn: 6 }),
    isNaN: Number.isNaN(pipeMassLbPerFt({ idIn: 7, odIn: 6 })),
  },
  {
    label: 'contents at zero density',
    returned: contentsMassLbPerFt({ idIn: 6.065, densityLbFt3: 0 }),
    isNaN: Number.isNaN(contentsMassLbPerFt({ idIn: 6.065, densityLbFt3: 0 })),
  },
  {
    label: 'contents in a bore of zero',
    returned: contentsMassLbPerFt({ idIn: 0, densityLbFt3: 55 }),
    isNaN: Number.isNaN(contentsMassLbPerFt({ idIn: 0, densityLbFt3: 55 })),
  },
];

/**
 * WHAT COOLDOWN DOES WITH A NaN MASS IS THE SAME SHAPE AS WHAT overallU DOES
 * WITH A NaN TRENCH. `cooldownTime` reads its masses as
 * `(contents?.massLbPerFt || 0)`, and NaN is falsy in JavaScript, so a NaN mass
 * becomes a zero mass. If BOTH slots are NaN the total M Cp is zero and the
 * call is refused. If only ONE is, the term is silently dropped and the answer
 * comes back with `ok: true` and no note.
 */
export const nanMassDrop = () => {
  const m = publishedMasses();
  const run = (contentsMassLbPerFt2, shellMass) => cooldownTime({
    contents: { massLbPerFt: contentsMassLbPerFt2, cpBtuLbF: PUBLISHED_COOLDOWN.contentsCp },
    shell: { massLbPerFt: shellMass, cpBtuLbF: PUBLISHED_COOLDOWN.shellCp },
    uBtuHrFt2F: publishedCooldownU(),
    idIn: PUBLISHED_COOLDOWN.idIn,
    startTempF: PUBLISHED_COOLDOWN.startTempF,
    ambientTempF: PUBLISHED_COOLDOWN.ambientTempF,
    targetTempF: PUBLISHED_COOLDOWN.targetTempF,
  });
  const both = run(m.contentsMassLbPerFt, m.steelMassLbPerFt);
  const neither = run(NaN, NaN);
  const contentsGone = run(NaN, m.steelMassLbPerFt);
  return {
    bothGoodOk: both.ok,
    bothGoodHours: both.hours,
    bothGoodTimeConstantHr: both.timeConstantHr,
    bothNaNOk: neither.ok,
    bothNaNError: neither.error,
    contentsNaNOk: contentsGone.ok,
    contentsNaNHours: contentsGone.hours,
    contentsNaNTimeConstantHr: contentsGone.timeConstantHr,
    contentsNaNNote: contentsGone.note === undefined ? null : contentsGone.note,
    droppedAgainstCorrectPct: pct(contentsGone.hours, both.hours),
    contentsShareOfMcpPct: m.contentsShareOfMcpPct,
  };
};

// ---------------------------------------------------------------------------
// SECTION 10. THE PUBLISHED RELAXATION LENGTHS, ON BOTH ROADS.
// Professional m01. Provenance rule 1.
// ---------------------------------------------------------------------------

/**
 * Three published cases, all on the published insulated U and the published
 * bore, with the mass rate doubled between the first two and the heat capacity
 * raised between the last two. `goldenRelaxationLengthFt` is the ORACLE in SI
 * and `engineRelaxationLengthFt` is the shipped function in field units.
 */
export const goldenRelaxationRows = () => golden.relaxation.map((r, i) => {
  const engine = relaxationLengthFt({
    massRateLbHr: r.massRateLbHr, cpBtuLbF: r.cpBtuLbF,
    uBtuHrFt2F: r.uBtuHrFt2F, idIn: r.idIn,
  });
  return {
    caseNumber: i + 1,
    massRateLbHr: r.massRateLbHr,
    cpBtuLbF: r.cpBtuLbF,
    goldenUBtuHrFt2F: r.uBtuHrFt2F,
    idIn: r.idIn,
    goldenRelaxationLengthFt: r.lengthFt,
    engineRelaxationLengthFt: engine,
    relaxationRelDiff: rel(engine, r.lengthFt),
    published: true,
  };
});

/** The two exact scalings, checked between engine returns rather than asserted. */
export const relaxationScalings = () => {
  const rows = goldenRelaxationRows();
  return {
    massRateRatio: rows[1].massRateLbHr / rows[0].massRateLbHr,
    lengthRatioAcrossMassRate: rows[1].engineRelaxationLengthFt / rows[0].engineRelaxationLengthFt,
    cpRatio: rows[2].cpBtuLbF / rows[1].cpBtuLbF,
    lengthRatioAcrossCp: rows[2].engineRelaxationLengthFt / rows[1].engineRelaxationLengthFt,
  };
};

/** The same fluid on each of the three published builds, so the inverse in U reads. */
export const relaxationByBuildRows = (builds = ['bare', 'insulated', 'buried4ft']) =>
  builds.map((build) => {
    const u = publishedBuildRun(build).uBtuHrFt2F;
    return {
      build,
      engineUBtuHrFt2F: u,
      referenceIdIn: PUBLISHED_BORE_IN,
      engineRelaxationLengthFt: relaxationLengthFt({
        massRateLbHr: PUBLISHED_FLUID.massRateLbHr,
        cpBtuLbF: PUBLISHED_FLUID.cpBtuLbF,
        uBtuHrFt2F: u,
        idIn: PUBLISHED_BORE_IN,
      }),
      published: PUBLISHED_BUILD_IS_PUBLISHED[build],
    };
  });

/**
 * The relaxation length REFUSES rather than guessing, and it is a bare NaN and
 * not an object, so a caller who does not check gets a NaN everywhere
 * downstream.
 */
export const relaxationRefusals = () => [
  ['a U of zero', { massRateLbHr: 120000, cpBtuLbF: 0.5, uBtuHrFt2F: 0, idIn: 6.065 }],
  ['a mass rate of zero', { massRateLbHr: 0, cpBtuLbF: 0.5, uBtuHrFt2F: 1.33, idIn: 6.065 }],
  ['a heat capacity of zero', { massRateLbHr: 120000, cpBtuLbF: 0, uBtuHrFt2F: 1.33, idIn: 6.065 }],
].map(([label, args]) => {
  const returned = relaxationLengthFt(args);
  return {
    label, returned, isNaN: Number.isNaN(returned), isAnObject: false,
  };
});

// ---------------------------------------------------------------------------
// SECTION 11 and 12. THE PUBLISHED ARRIVALS, THEIR NTU, AND THE STATION TABLE.
// Professional m01 and m05.
// ---------------------------------------------------------------------------

const publishedProfileRun = memoize((lengthFt, nStations) => steadyStateProfile({
  lengthFt,
  inletTempF: PUBLISHED_FLUID.inletTempF,
  ambientTempF: PUBLISHED_FLUID.ambientTempF,
  massRateLbHr: PUBLISHED_FLUID.massRateLbHr,
  cpBtuLbF: PUBLISHED_FLUID.cpBtuLbF,
  uBtuHrFt2F: golden.profile.uBtuHrFt2F,
  idIn: PUBLISHED_FLUID.idIn,
  nStations,
}));

/**
 * The three published arrivals on both roads. NO PRESSURES ARE SET IN ANY
 * PUBLISHED CASE, so the Joule-Thomson term is exactly zero in every row here
 * and `pPsia` comes back NaN at every station, which is printed rather than
 * hidden.
 */
export const goldenProfileRows = () => golden.profile.points.map((pt, i) => {
  const p = publishedProfileRun(pt.lengthFt, 21);
  const retained = (p.arrivalTempF - PUBLISHED_FLUID.ambientTempF)
    / (PUBLISHED_FLUID.inletTempF - PUBLISHED_FLUID.ambientTempF);
  return {
    pointNumber: i + 1,
    lengthFt: pt.lengthFt,
    goldenNtu: pt.ntu,
    engineNtu: p.ntu,
    goldenArrivalTempF: pt.arrivalTempF,
    engineArrivalTempF: p.arrivalTempF,
    arrivalRelDiff: rel(p.arrivalTempF, pt.arrivalTempF),
    ntuRelDiff: rel(p.ntu, pt.ntu),
    retainedExcessFraction: retained,
    retainedExcessPct: retained * 100,
    lostExcessPct: (1 - retained) * 100,
    jouleThomsonTermIsZero: true,
    published: true,
  };
});

export const NTU_SWEEP = Object.freeze([0.1, 0.25, 0.5, 1, 1.5, 2, 3, 4, 5]);

/**
 * NTU IS THE WHOLE STORY. It is the length measured in relaxation lengths, and
 * the arrival depends on nothing else once the inlet and the ambient are fixed.
 * Every row here is an ENGINE profile run at the length that gives that ntu on
 * the published relaxation length, so the retained fraction is an engine
 * return and not an exponential this file typed.
 *
 * SWEEP POINTS, all of them. None of these lengths is a published case.
 */
export const ntuSweepRows = (ntus = NTU_SWEEP) => {
  const lc = relaxationLengthFt({
    massRateLbHr: PUBLISHED_FLUID.massRateLbHr,
    cpBtuLbF: PUBLISHED_FLUID.cpBtuLbF,
    uBtuHrFt2F: golden.profile.uBtuHrFt2F,
    idIn: PUBLISHED_FLUID.idIn,
  });
  return ntus.map((ntu) => {
    const p = publishedProfileRun(lc * ntu, 21);
    const excess = p.arrivalTempF - PUBLISHED_FLUID.ambientTempF;
    return {
      ntu: p.ntu,
      lengthFt: lc * ntu,
      retainedExcessFraction: excess / (PUBLISHED_FLUID.inletTempF - PUBLISHED_FLUID.ambientTempF),
      arrivalTempF: p.arrivalTempF,
      excessOverAmbientF: excess,
      published: false,
    };
  });
};

/**
 * The published profile station by station at the longest published length.
 * The engine returns 21 stations by default and the golden publishes only the
 * arrival, so this table is ENGINE on PUBLISHED inputs.
 */
export const publishedStationRows = (lengthFt = 105600, nStations = 21) => {
  const p = publishedProfileRun(lengthFt, nStations);
  const inletExcess = PUBLISHED_FLUID.inletTempF - PUBLISHED_FLUID.ambientTempF;
  return p.stations.map((st, i, all) => ({
    station: i,
    xFt: st.xFt,
    tempF: st.tempF,
    pPsia: st.pPsia,
    pressureIsNaN: Number.isNaN(st.pPsia),
    excessOverAmbientF: st.tempF - PUBLISHED_FLUID.ambientTempF,
    retainedExcessFraction: (st.tempF - PUBLISHED_FLUID.ambientTempF) / inletExcess,
    dropFromStationAboveF: i === 0 ? null : all[i - 1].tempF - st.tempF,
    published: lengthFt === 105600,
  }));
};

/**
 * WHERE THE LINE IS COLDEST is the far end and only the far end, because the
 * profile is a monotone exponential with nothing else in it. The ratio of the
 * first drop to the last is NOT exp(ntu): the two intervals are equal in
 * length, so each carries the same factor and the ratio is the ratio of the
 * two starting excesses.
 */
export const stationDropRatio = (lengthFt = 105600, nStations = 21) => {
  const rows = publishedStationRows(lengthFt, nStations);
  const p = publishedProfileRun(lengthFt, nStations);
  const first = rows[1].dropFromStationAboveF;
  const last = rows[rows.length - 1].dropFromStationAboveF;
  const inletExcess = PUBLISHED_FLUID.inletTempF - PUBLISHED_FLUID.ambientTempF;
  return {
    lengthFt,
    nStations,
    stationSpacingFt: rows[1].xFt - rows[0].xFt,
    firstIntervalDropF: first,
    lastIntervalDropF: last,
    dropRatio: first / last,
    // the same ratio built out of the two starting excesses, which is what it is
    excessRatioAcrossTheInnerSpan:
      rows[0].excessOverAmbientF / rows[rows.length - 2].excessOverAmbientF,
    // and the whole-line excess ratio, for contrast, which is a different number
    wholeLineExcessRatio: inletExcess / rows[rows.length - 1].excessOverAmbientF,
    ntu: p.ntu,
  };
};

export const STATION_COUNT_SWEEP = Object.freeze([2, 3, 5, 11, 21, 51, 101, 501]);

/**
 * The station count is a RESOLUTION setting and nothing more: the arrival is a
 * closed form and does not move. The ugly two station row is kept rather than
 * dropped, because it is the one that proves the point.
 */
export const stationCountRows = (counts = STATION_COUNT_SWEEP, lengthFt = 105600) => {
  const reference = publishedProfileRun(lengthFt, 21).arrivalTempF;
  return counts.map((nStations) => {
    const p = publishedProfileRun(lengthFt, nStations);
    return {
      nStations,
      stationsReturned: p.stations.length,
      arrivalTempF: p.arrivalTempF,
      differenceFrom21StationArrivalF: p.arrivalTempF - reference,
      published: false,
    };
  });
};

/** What the profile refuses, and the one direction of the balance that needs no case. */
export const profileRefusals = () => {
  const zeroLength = steadyStateProfile({ lengthFt: 0 });
  const zeroU = steadyStateProfile({
    lengthFt: 1000, massRateLbHr: 120000, cpBtuLbF: 0.5, uBtuHrFt2F: 0, idIn: 6.065,
  });
  const colderThanAmbient = steadyStateProfile({
    lengthFt: 105600,
    inletTempF: PUBLISHED_FLUID.ambientTempF - 20,
    ambientTempF: PUBLISHED_FLUID.ambientTempF,
    massRateLbHr: PUBLISHED_FLUID.massRateLbHr,
    cpBtuLbF: PUBLISHED_FLUID.cpBtuLbF,
    uBtuHrFt2F: golden.profile.uBtuHrFt2F,
    idIn: PUBLISHED_FLUID.idIn,
  });
  return [
    { label: 'a length of zero', ok: zeroLength.ok, error: zeroLength.error, arrivalTempF: null },
    { label: 'a U of zero', ok: zeroU.ok, error: zeroU.error, arrivalTempF: null },
    {
      label: 'an inlet twenty degF BELOW ambient, which is not a refusal and should not be',
      ok: colderThanAmbient.ok,
      error: colderThanAmbient.error === undefined ? null : colderThanAmbient.error,
      arrivalTempF: colderThanAmbient.arrivalTempF,
    },
  ];
};

// ---------------------------------------------------------------------------
// SECTION 15. THE INVERSE: THE U A TARGET ARRIVAL NEEDS, AND WHERE IT REFUSES.
// Professional m02.
// ---------------------------------------------------------------------------

export const PUBLISHED_TARGET_SWEEP_F = Object.freeze([160, 140, 120, 100, 80, 60, 45, 41]);

/**
 * `uForArrivalTemp` inverts the same exponential and returns the ntu the
 * target implies alongside the U, which is the same ntu the forward profile
 * would report. Every row round trips through the FORWARD profile, so the
 * closure below is two engine calls agreeing and not an identity this file
 * asserted.
 */
export const uForTargetRows = (targets = PUBLISHED_TARGET_SWEEP_F, lengthFt = 26400) =>
  targets.map((targetTempF) => {
    const need = uForArrivalTemp({
      lengthFt,
      inletTempF: PUBLISHED_FLUID.inletTempF,
      ambientTempF: PUBLISHED_FLUID.ambientTempF,
      targetTempF,
      massRateLbHr: PUBLISHED_FLUID.massRateLbHr,
      cpBtuLbF: PUBLISHED_FLUID.cpBtuLbF,
      idIn: PUBLISHED_FLUID.idIn,
    });
    const back = steadyStateProfile({
      lengthFt,
      inletTempF: PUBLISHED_FLUID.inletTempF,
      ambientTempF: PUBLISHED_FLUID.ambientTempF,
      massRateLbHr: PUBLISHED_FLUID.massRateLbHr,
      cpBtuLbF: PUBLISHED_FLUID.cpBtuLbF,
      uBtuHrFt2F: need.uBtuHrFt2F,
      idIn: PUBLISHED_FLUID.idIn,
    });
    return {
      targetTempF,
      lengthFt,
      ok: need.ok,
      uBtuHrFt2F: need.uBtuHrFt2F,
      ntuImplied: need.ntu,
      forwardArrivalTempF: back.arrivalTempF,
      roundTripErrorF: back.arrivalTempF - targetTempF,
      published: false,
    };
  });

/**
 * TWO REFUSALS AND THEY ARE DIFFERENT REFUSALS. A target at or below ambient
 * is a physical impossibility, no insulation reaches it. A target at or above
 * the inlet is not a cooling problem at all. Collapsing them into one message
 * would send an engineer looking in the wrong place.
 */
export const inverseRefusals = (targets = [40, 39, 180, 185], lengthFt = 26400) =>
  targets.map((targetTempF) => {
    const r = uForArrivalTemp({
      lengthFt,
      inletTempF: PUBLISHED_FLUID.inletTempF,
      ambientTempF: PUBLISHED_FLUID.ambientTempF,
      targetTempF,
      massRateLbHr: PUBLISHED_FLUID.massRateLbHr,
      cpBtuLbF: PUBLISHED_FLUID.cpBtuLbF,
      idIn: PUBLISHED_FLUID.idIn,
    });
    return {
      targetTempF,
      ok: r.ok,
      reason: r.reason === undefined ? null : r.reason,
      uBtuHrFt2F: r.uBtuHrFt2F === undefined ? null : r.uBtuHrFt2F,
      kind: targetTempF <= PUBLISHED_FLUID.ambientTempF
        ? 'at or below ambient'
        : 'at or above the inlet',
    };
  });

// ---------------------------------------------------------------------------
// SECTION 16. THE PUBLISHED COOLDOWN, ON BOTH ROADS, STATION BY STATION.
// Professional m03.
// ---------------------------------------------------------------------------

/** The engine's own insulated U, which the ENGINE road through the cooldown uses. */
const publishedCooldownU = () => publishedBuildRun('insulated').uBtuHrFt2F;

const publishedCooldownRun = memoize((uBtuHrFt2F) => {
  const m = publishedMasses();
  return cooldownTime({
    contents: { massLbPerFt: m.contentsMassLbPerFt, cpBtuLbF: PUBLISHED_COOLDOWN.contentsCp },
    shell: { massLbPerFt: m.steelMassLbPerFt, cpBtuLbF: PUBLISHED_COOLDOWN.shellCp },
    uBtuHrFt2F,
    idIn: PUBLISHED_COOLDOWN.idIn,
    startTempF: PUBLISHED_COOLDOWN.startTempF,
    ambientTempF: PUBLISHED_COOLDOWN.ambientTempF,
    targetTempF: PUBLISHED_COOLDOWN.targetTempF,
  });
});

/**
 * ONE published case, on both roads. `goldenHours` is the oracle in SI seconds
 * and `engineHours` is the shipped function in field hours. The terms below
 * are the arithmetic a panel would do on the masses and the U it is already
 * showing.
 */
export const publishedCooldown = () => {
  const m = publishedMasses();
  const engineU = publishedCooldownU();
  const cd = publishedCooldownRun(engineU);
  const uaPerFt = engineU * Math.PI * (PUBLISHED_COOLDOWN.idIn / 12);
  const logTerm = Math.log(
    (PUBLISHED_COOLDOWN.startTempF - PUBLISHED_COOLDOWN.ambientTempF)
    / (PUBLISHED_COOLDOWN.targetTempF - PUBLISHED_COOLDOWN.ambientTempF),
  );
  return {
    startTempF: PUBLISHED_COOLDOWN.startTempF,
    ambientTempF: PUBLISHED_COOLDOWN.ambientTempF,
    targetTempF: PUBLISHED_COOLDOWN.targetTempF,
    goldenUBtuHrFt2F: golden.cooldown.uBtuHrFt2F,
    engineUBtuHrFt2F: engineU,
    uRelDiff: rel(engineU, golden.cooldown.uBtuHrFt2F),
    goldenHours: golden.cooldown.hours,
    engineHours: cd.hours,
    hoursRelDiff: rel(cd.hours, golden.cooldown.hours),
    goldenTimeConstantHr: golden.cooldown.timeConstantHr,
    engineTimeConstantHr: cd.timeConstantHr,
    timeConstantRelDiff: rel(cd.timeConstantHr, golden.cooldown.timeConstantHr),
    ok: cd.ok,
    stationsReturned: cd.stations.length,
    uaPerFtBtuHrFtF: uaPerFt,
    mcpBtuFtF: m.totalMcpBtuFtF,
    logTerm,
    noTouchTimeInTimeConstants: logTerm,
    published: true,
  };
};

/** The station table, which runs to 1.5 times the answer so the last station is past it. */
export const publishedCooldownStationRows = () => publishedCooldownRun(publishedCooldownU())
  .stations.map((st, i) => ({
    station: i,
    hours: st.hours,
    tempF: st.tempF,
    excessOverAmbientF: st.tempF - PUBLISHED_COOLDOWN.ambientTempF,
    pastTheTarget: st.tempF < PUBLISHED_COOLDOWN.targetTempF,
  }));

/**
 * THE COOLDOWN U IS THE FLOWING U. A shut-in line has a stagnant bore and its
 * inside film falls from the flowing catalog value to something near the
 * stagnant one. The engine will take whichever U it is given and nothing in
 * `cooldownTime` asks whether the U it got was measured on a flowing line.
 */
export const stagnantBoreCooldown = () => {
  const flowingU = publishedCooldownU();
  const flowing = publishedCooldownRun(flowingU);
  const stagnantU = publishedBuildRun('stagnantBore').uBtuHrFt2F;
  const stagnant = publishedCooldownRun(stagnantU);
  return {
    flowingUBtuHrFt2F: flowingU,
    flowingHours: flowing.hours,
    flowingTimeConstantHr: flowing.timeConstantHr,
    stagnantUBtuHrFt2F: stagnantU,
    stagnantHours: stagnant.hours,
    stagnantTimeConstantHr: stagnant.timeConstantHr,
    hoursRatio: stagnant.hours / flowing.hours,
    insideFilmFlowing: filmCoefficient('multiphaseFlowing'),
    insideFilmStagnant: filmCoefficient('stagnant'),
    nothingInCooldownAsksWhichUItGot: true,
  };
};

// ---------------------------------------------------------------------------
// SECTIONS 13 to 18. THE TEACHING LINE AKASO SPUR.
//
// A TEACHING LINE. Not a published case, not a real line, and no oracle has
// ever checked it. It exists because the published cases set no pressures,
// carry no coating, sit in no trench that can be got wrong and have no hydrate
// boundary, so four things this course has to teach cannot be shown on them at
// all. Provenance rules 4 and 5 both live here.
// ---------------------------------------------------------------------------

export const AKASO = Object.freeze({
  name: 'AKASO SPUR',
  teaching: true,
  layers: Object.freeze([
    Object.freeze({ idIn: 9.562, odIn: 10.75, k: 26, label: 'carbon steel wall' }),
    Object.freeze({ idIn: 10.75, odIn: 13.75, k: 0.07, label: 'polyurethane foam' }),
    Object.freeze({ idIn: 13.75, odIn: 16.75, k: 0.9, label: 'concrete weight coat' }),
  ]),
  insideFilmH: 200,
  outsideFilmH: 200,
  burialFt: 3,
  kSoil: 1.2,
  boreIn: 9.562,
  coatedOdIn: 16.75,
  lengthFt: 60000,
  inletTempF: 195,
  seabedTempF: 45,
  massRateLbHr: 90000,
  cpBtuLbF: 0.62,
  inletPsia: 2400,
  outletPsia: 1500,
  jtCoeffFPerPsi: 0.028,
  // A LABORATORY INPUT AND NOT AN ENGINE OUTPUT. Both engine headers say so.
  hydrateFlowingF: 71,
  hydrateShutInF: 78,
  contentsRhoLbFt3: 8.6,
  contentsCp: 0.62,
  steelCp: 0.11,
  foamRhoLbFt3: 44,
  foamCp: 0.28,
  coatRhoLbFt3: 190,
  coatCp: 0.21,
  waterRateBpd: 420,
  subcoolingF: 36,
  safetyMarginF: 5,
  leanMethanolWtPct: 96,
  leanMegWtPct: 89,
  cooldownStartTempF: 120,
});

const akasoLayers = (which = 'full') => (which === 'noFoam'
  ? [
    { ...AKASO.layers[0] },
    { idIn: AKASO.layers[0].odIn, odIn: AKASO.coatedOdIn, k: AKASO.layers[2].k, label: AKASO.layers[2].label },
  ]
  : AKASO.layers.map((l) => ({ ...l })));

const akasoURun = memoize((referenceIdIn, burialFt, which) => overallU({
  layers: akasoLayers(which),
  insideFilmH: AKASO.insideFilmH,
  outsideFilmH: AKASO.outsideFilmH,
  burialFt,
  kSoil: AKASO.kSoil,
  referenceIdIn,
}));

/** The whole definition on one page, so a reader can rebuild the line. */
export const akasoDefinition = () => {
  const u = akasoURun(AKASO.boreIn, AKASO.burialFt, 'full');
  return {
    ...AKASO,
    layers: AKASO.layers.map((l) => ({ ...l })),
    steelWallIn: (AKASO.layers[0].odIn - AKASO.layers[0].idIn) / 2,
    foamWallIn: (AKASO.layers[1].odIn - AKASO.layers[1].idIn) / 2,
    coatWallIn: (AKASO.layers[2].odIn - AKASO.layers[2].idIn) / 2,
    pressureDropPsi: AKASO.inletPsia - AKASO.outletPsia,
    inletExcessOverSeabedF: AKASO.inletTempF - AKASO.seabedTempF,
    halfCoatedDiameterFt: AKASO.coatedOdIn / 24,
    engineUBtuHrFt2F: u.uBtuHrFt2F,
    referenceIdIn: u.referenceIdIn,
    totalResistance: u.totalResistance,
    hydrateBoundaryIsAnInput: HYDRATE_BOUNDARY_IS_AN_INPUT,
  };
};

/** The resistance stack of the teaching line, with a coating and a trench on it. */
export const akasoStackRows = (referenceIdIn = AKASO.boreIn, which = 'full') =>
  akasoURun(referenceIdIn, AKASO.burialFt, which).resistances.map((r) => ({
    teaching: true,
    referenceIdIn,
    term: r.id,
    label: r.label || null,
    resistance: r.r,
    sharePct: r.sharePct,
  }));

export const akasoStackSummary = (referenceIdIn = AKASO.boreIn, which = 'full') => {
  const u = akasoURun(referenceIdIn, AKASO.burialFt, which);
  const rows = akasoStackRows(referenceIdIn, which);
  return {
    teaching: true,
    build: which,
    ok: u.ok,
    engineUBtuHrFt2F: u.uBtuHrFt2F,
    totalResistance: u.totalResistance,
    referenceIdIn: u.referenceIdIn,
    termCount: rows.length,
    sharesSumPct: rows.reduce((a, r) => a + r.sharePct, 0),
    uTimesReferenceIdFt: u.uBtuHrFt2F * (u.referenceIdIn / 12),
    conductancePerFootBtuHrFtF: 1 / u.totalResistance,
  };
};

/**
 * The same stack referred to the bore and to the coated outside diameter, and
 * the same stack again with the foam taken out and the weight coat carried
 * straight from the steel wall to the same outside diameter, so the line is
 * the same size on the outside. The coat becomes a thicker layer as well as a
 * larger share, and the trench term, which did not move at all, goes from a
 * third of the stack to more than three quarters of it.
 */
export const akasoReferencePair = () => {
  const bore = akasoStackSummary(AKASO.boreIn, 'full');
  const coated = akasoStackSummary(AKASO.coatedOdIn, 'full');
  return {
    teaching: true,
    boreUBtuHrFt2F: bore.engineUBtuHrFt2F,
    coatedUBtuHrFt2F: coated.engineUBtuHrFt2F,
    uRatio: bore.engineUBtuHrFt2F / coated.engineUBtuHrFt2F,
    diameterRatio: AKASO.coatedOdIn / AKASO.boreIn,
    boreUTimesIdFt: bore.uTimesReferenceIdFt,
    coatedUTimesIdFt: coated.uTimesReferenceIdFt,
    resistancesRelDiff: rel(bore.totalResistance, coated.totalResistance),
  };
};

export const akasoFoamRemoved = () => {
  const withFoam = akasoStackSummary(AKASO.boreIn, 'full');
  const without = akasoStackSummary(AKASO.boreIn, 'noFoam');
  const withRows = akasoStackRows(AKASO.boreIn, 'full');
  const withoutRows = akasoStackRows(AKASO.boreIn, 'noFoam');
  return {
    teaching: true,
    withFoamUBtuHrFt2F: withFoam.engineUBtuHrFt2F,
    withoutFoamUBtuHrFt2F: without.engineUBtuHrFt2F,
    uRatio: without.engineUBtuHrFt2F / withFoam.engineUBtuHrFt2F,
    coatResistanceWithFoam: withRows.find((r) => r.term === 'layer2').resistance,
    coatSharePctWithFoam: withRows.find((r) => r.term === 'layer2').sharePct,
    coatResistanceWithoutFoam: withoutRows.find((r) => r.term === 'layer1').resistance,
    coatSharePctWithoutFoam: withoutRows.find((r) => r.term === 'layer1').sharePct,
    trenchResistanceWithFoam: withRows.find((r) => r.term === 'burial').resistance,
    trenchSharePctWithFoam: withRows.find((r) => r.term === 'burial').sharePct,
    trenchResistanceWithoutFoam: withoutRows.find((r) => r.term === 'burial').resistance,
    trenchSharePctWithoutFoam: withoutRows.find((r) => r.term === 'burial').sharePct,
    trenchResistanceMoved: withRows.find((r) => r.term === 'burial').resistance
      - withoutRows.find((r) => r.term === 'burial').resistance,
  };
};

/**
 * BRIEF DEFECT (iii) ON THE TEACHING LINE, where the coated diameter is large
 * enough that a plausible typo falls below D/2. Both U values are named.
 */
export const akasoSwallowedTrench = (typoBurialFt = 0.3) => {
  const correct = akasoURun(AKASO.boreIn, AKASO.burialFt, 'full');
  const swallowed = akasoURun(AKASO.boreIn, typoBurialFt, 'full');
  return {
    teaching: true,
    intendedBurialFt: AKASO.burialFt,
    typoBurialFt,
    halfCoatedDiameterFt: AKASO.coatedOdIn / 24,
    withTermUBtuHrFt2F: correct.uBtuHrFt2F,
    withTermCount: correct.resistances.length,
    droppedTermUBtuHrFt2F: swallowed.uBtuHrFt2F,
    droppedTermCount: swallowed.resistances.length,
    droppedTermOk: swallowed.ok,
    droppedTermHasBurial: swallowed.resistances.some((r) => r.id === 'burial'),
    droppedTermNote: swallowed.note === undefined ? null : swallowed.note,
    uErrorPct: pct(swallowed.uBtuHrFt2F, correct.uBtuHrFt2F),
  };
};

// -------------------------------------------------- the energy balance

const akasoProfileRun = memoize((lengthFt, withJt, nStations) => steadyStateProfile({
  lengthFt,
  inletTempF: AKASO.inletTempF,
  ambientTempF: AKASO.seabedTempF,
  massRateLbHr: AKASO.massRateLbHr,
  cpBtuLbF: AKASO.cpBtuLbF,
  uBtuHrFt2F: akasoURun(AKASO.boreIn, AKASO.burialFt, 'full').uBtuHrFt2F,
  idIn: AKASO.boreIn,
  nStations,
  ...(withJt
    ? { inletPsia: AKASO.inletPsia, outletPsia: AKASO.outletPsia, jtCoeffFPerPsi: AKASO.jtCoeffFPerPsi }
    : {}),
}));

/**
 * The teaching line with NO pressures passed, so the Joule-Thomson term is
 * zero and this is the pure exponential. It is the baseline the whole Expert
 * argument is measured from.
 *
 * The margin is against a LABORATORY hydrate temperature the engine never
 * computes, and the returned object says so on its own face.
 */
export const akasoHeatLossOnly = (lengthFt = AKASO.lengthFt) => {
  const p = akasoProfileRun(lengthFt, false, 21);
  const u = akasoURun(AKASO.boreIn, AKASO.burialFt, 'full');
  const excess = p.arrivalTempF - AKASO.seabedTempF;
  return {
    teaching: true,
    lengthFt,
    engineUBtuHrFt2F: u.uBtuHrFt2F,
    referenceIdIn: u.referenceIdIn,
    relaxationLengthFt: p.relaxationLengthFt,
    ntu: p.ntu,
    retainedExcessFraction: excess / (AKASO.inletTempF - AKASO.seabedTempF),
    inletExcessOverSeabedF: AKASO.inletTempF - AKASO.seabedTempF,
    arrivalTempF: p.arrivalTempF,
    arrivalExcessOverSeabedF: excess,
    hydrateFlowingF: AKASO.hydrateFlowingF,
    hydrateBoundaryIsAnInput: HYDRATE_BOUNDARY_IS_AN_INPUT,
    marginF: p.arrivalTempF - AKASO.hydrateFlowingF,
    outsideTheHydrateRegion: p.arrivalTempF > AKASO.hydrateFlowingF,
    stationsReturned: p.stations.length,
    stationSpacingFt: lengthFt / (p.stations.length - 1),
  };
};

/** The teaching line station by station, with the margin at every station. */
export const akasoStationRows = (lengthFt = AKASO.lengthFt, withJt = false, nStations = 21) =>
  akasoProfileRun(lengthFt, withJt, nStations).stations.map((st, i) => ({
    teaching: true,
    station: i,
    xFt: st.xFt,
    tempF: st.tempF,
    pPsia: st.pPsia,
    excessOverSeabedF: st.tempF - AKASO.seabedTempF,
    marginAgainstFlowingBoundaryF: st.tempF - AKASO.hydrateFlowingF,
    insideTheHydrateRegion: st.tempF < AKASO.hydrateFlowingF,
  }));

export const AKASO_TARGET_SWEEP_F = Object.freeze([100, 90, 80, 71, 60, 50]);

/** The inverse on the teaching line, against its own laboratory boundary. */
export const akasoTargetRows = (targets = AKASO_TARGET_SWEEP_F) => {
  const actualU = akasoURun(AKASO.boreIn, AKASO.burialFt, 'full').uBtuHrFt2F;
  return targets.map((targetTempF) => {
    const need = uForArrivalTemp({
      lengthFt: AKASO.lengthFt,
      inletTempF: AKASO.inletTempF,
      ambientTempF: AKASO.seabedTempF,
      targetTempF,
      massRateLbHr: AKASO.massRateLbHr,
      cpBtuLbF: AKASO.cpBtuLbF,
      idIn: AKASO.boreIn,
    });
    return {
      teaching: true,
      targetTempF,
      ok: need.ok,
      uNeededBtuHrFt2F: need.uBtuHrFt2F,
      ntuImplied: need.ntu,
      actualUBtuHrFt2F: actualU,
      ratioToTheUThisLineHas: need.uBtuHrFt2F / actualU,
      reachable: need.uBtuHrFt2F >= actualU,
      isTheHydrateBoundary: targetTempF === AKASO.hydrateFlowingF,
    };
  });
};

// -------------------------------------------------- BRIEF defect (v), the mass

/**
 * TWO MASSES FOR ONE LINE, AND THEY ARE LABELLED DIFFERENTLY.
 *
 * `apiMassLbPerFt` is what the `cooldownTime` signature leads a caller to:
 * contents in one slot, the steel shell in the other, and no slot for a
 * coating. `lumpedMassLbPerFt` folds the foam and the weight coat into the
 * shell slot by hand at their own heat capacities, which is the only way the
 * API allows it. Both are the same line at the same U.
 *
 * The insulation and the weight coat carry most of the RESISTANCE and, as the
 * API reads, none of the MASS.
 */
export const akasoMasses = memoize(() => {
  const contents = contentsMassLbPerFt({ idIn: AKASO.boreIn, densityLbFt3: AKASO.contentsRhoLbFt3 });
  const steel = pipeMassLbPerFt({ idIn: AKASO.layers[0].idIn, odIn: AKASO.layers[0].odIn });
  const foam = pipeMassLbPerFt({
    idIn: AKASO.layers[1].idIn, odIn: AKASO.layers[1].odIn, densityLbFt3: AKASO.foamRhoLbFt3,
  });
  const coat = pipeMassLbPerFt({
    idIn: AKASO.layers[2].idIn, odIn: AKASO.layers[2].odIn, densityLbFt3: AKASO.coatRhoLbFt3,
  });
  const mcpApi = contents * AKASO.contentsCp + steel * AKASO.steelCp;
  const mcpLumped = mcpApi + foam * AKASO.foamCp + coat * AKASO.coatCp;
  const rows = akasoStackRows(AKASO.boreIn, 'full');
  const leftOutShare = rows
    .filter((r) => r.term === 'layer1' || r.term === 'layer2')
    .reduce((a, r) => a + r.sharePct, 0);
  return {
    teaching: true,
    contentsMassLbPerFt: contents,
    steelMassLbPerFt: steel,
    foamMassLbPerFt: foam,
    coatMassLbPerFt: coat,
    apiMassLbPerFt: contents + steel,
    massLeftOutLbPerFt: foam + coat,
    resistanceShareLeftOutPct: leftOutShare,
    mcpApiBtuFtF: mcpApi,
    mcpLumpedBtuFtF: mcpLumped,
    mcpRatio: mcpLumped / mcpApi,
    contentsShareOfApiMcpPct: (contents * AKASO.contentsCp / mcpApi) * 100,
    // the shell mass the lumped reading hands cooldownTime, which carries the
    // foam and the coat at their own heat capacities scaled onto the steel Cp
    lumpedShellMassLbPerFt: steel
      + foam * (AKASO.foamCp / AKASO.steelCp)
      + coat * (AKASO.coatCp / AKASO.steelCp),
  };
});

const akasoCooldownRun = memoize((reading, startTempF, targetTempF) => {
  const m = akasoMasses();
  return cooldownTime({
    contents: { massLbPerFt: m.contentsMassLbPerFt, cpBtuLbF: AKASO.contentsCp },
    shell: {
      massLbPerFt: reading === 'lumped' ? m.lumpedShellMassLbPerFt : m.steelMassLbPerFt,
      cpBtuLbF: AKASO.steelCp,
    },
    uBtuHrFt2F: akasoURun(AKASO.boreIn, AKASO.burialFt, 'full').uBtuHrFt2F,
    idIn: AKASO.boreIn,
    startTempF,
    ambientTempF: AKASO.seabedTempF,
    targetTempF,
  });
});

/**
 * THE HONEST CONTRAST FOR BRIEF DEFECT (v). The same line, the same U, the
 * same start and the same target, cooled with two different masses. Both
 * no-touch times are here and both are named, and the ratio of them is the
 * ratio of the two heat capacities exactly, because the log term is identical
 * in both and only M Cp moved.
 */
export const akasoCooldownPair = (
  startTempF = AKASO.cooldownStartTempF, targetTempF = AKASO.hydrateFlowingF,
) => {
  const api = akasoCooldownRun('api', startTempF, targetTempF);
  const lumped = akasoCooldownRun('lumped', startTempF, targetTempF);
  const m = akasoMasses();
  return {
    teaching: true,
    startTempF,
    targetTempF,
    seabedTempF: AKASO.seabedTempF,
    hydrateBoundaryIsAnInput: HYDRATE_BOUNDARY_IS_AN_INPUT,
    apiMassLbPerFt: m.apiMassLbPerFt,
    apiMcpBtuFtF: m.mcpApiBtuFtF,
    apiNoTouchHours: api.hours,
    apiTimeConstantHr: api.timeConstantHr,
    apiStationsReturned: api.stations.length,
    lumpedMassLbPerFt: m.apiMassLbPerFt + m.massLeftOutLbPerFt,
    lumpedMcpBtuFtF: m.mcpLumpedBtuFtF,
    lumpedNoTouchHours: lumped.hours,
    lumpedTimeConstantHr: lumped.timeConstantHr,
    hoursRatio: lumped.hours / api.hours,
    timeConstantRatio: lumped.timeConstantHr / api.timeConstantHr,
    mcpRatio: m.mcpRatio,
    hoursGivenAwayByTheApiReading: lumped.hours - api.hours,
    sharedLogTerm: Math.log((startTempF - AKASO.seabedTempF) / (targetTempF - AKASO.seabedTempF)),
    resistanceShareLeftOutPct: m.resistanceShareLeftOutPct,
    massSlotsCooldownOffers: 2,
    layersOverallUAccepted: AKASO.layers.length,
  };
};

/** The API reading station by station, so the fall reads as a sequence. */
export const akasoCooldownStationRows = (
  reading = 'api',
  startTempF = AKASO.cooldownStartTempF,
  targetTempF = AKASO.hydrateFlowingF,
) => akasoCooldownRun(reading, startTempF, targetTempF).stations.map((st, i) => ({
  teaching: true,
  reading,
  station: i,
  hours: st.hours,
  tempF: st.tempF,
  excessOverSeabedF: st.tempF - AKASO.seabedTempF,
}));

// -------------------------------------------------- BRIEF defect (vi)

/**
 * BRIEF DEFECT (vi). `cooldownTime` guards `startTempF > ambientTempF` and
 * `targetTempF > ambientTempF`. It never checks `startTempF > targetTempF`.
 * When the target is above the start, `Math.log` of a ratio below 1 is
 * negative and the function returns a NEGATIVE number of hours as a normal
 * answer, with `ok: true`, no note, no error, and a station table that runs
 * backwards in time and WARMS UP.
 *
 * This is not a contrived input. The line stops with its far end at the engine
 * arrival, and once it packs up the LABORATORY hydrate boundary moves to a
 * temperature ABOVE the one the line is at, so this is the correct question to
 * ask. The right answer is that there is NO no-touch time at all.
 *
 * The mirror of it is already handled in the same module: `uForArrivalTemp`
 * refuses an inlet at or below its target with a written reason. Two functions
 * in one module, opposite positions on the same pair of temperatures.
 */
export const akasoBackwardsCooldown = () => {
  const startTempF = akasoProfileRun(AKASO.lengthFt, true, 21).arrivalTempF;
  const targetTempF = AKASO.hydrateShutInF;
  const cd = akasoCooldownRun('api', startTempF, targetTempF);
  const mirror = uForArrivalTemp({
    lengthFt: AKASO.lengthFt,
    inletTempF: startTempF,
    ambientTempF: AKASO.seabedTempF,
    targetTempF,
    massRateLbHr: AKASO.massRateLbHr,
    cpBtuLbF: AKASO.cpBtuLbF,
    idIn: AKASO.boreIn,
  });
  const stations = akasoCooldownStationRows('api', startTempF, targetTempF);
  return {
    teaching: true,
    startTempF,
    targetTempF,
    seabedTempF: AKASO.seabedTempF,
    hydrateBoundaryIsAnInput: HYDRATE_BOUNDARY_IS_AN_INPUT,
    ok: cd.ok,
    hours: cd.hours,
    hoursAreNegative: cd.hours < 0,
    timeConstantHr: cd.timeConstantHr,
    note: cd.note === undefined ? null : cd.note,
    error: cd.error === undefined ? null : cd.error,
    logTerm: Math.log((startTempF - AKASO.seabedTempF) / (targetTempF - AKASO.seabedTempF)),
    stationsReturned: stations.length,
    firstStationHours: stations[0].hours,
    lastStationHours: stations[stations.length - 1].hours,
    firstStationTempF: stations[0].tempF,
    lastStationTempF: stations[stations.length - 1].tempF,
    temperatureRiseAcrossTheTableF: stations[stations.length - 1].tempF - stations[0].tempF,
    stationsRunBackwards: stations[stations.length - 1].hours < stations[0].hours,
    mirrorOk: mirror.ok,
    mirrorReason: mirror.reason === undefined ? null : mirror.reason,
    theRightAnswerIsThatThereIsNoNoTouchTime: true,
  };
};

/** The three branches printed together, so the missing one reads as a gap in a set. */
export const akasoCooldownBranches = () => {
  const cold = akasoCooldownRun('api', 40, AKASO.hydrateFlowingF);
  const belowAmbient = akasoCooldownRun('api', AKASO.cooldownStartTempF, 40);
  const backwards = akasoBackwardsCooldown();
  return [
    {
      branch: 1,
      label: 'a start already below the seabed',
      ok: cold.ok,
      hours: cold.hours === undefined ? null : cold.hours,
      note: cold.note === undefined ? null : cold.note,
      error: cold.error === undefined ? null : cold.error,
      handled: true,
    },
    {
      branch: 2,
      label: 'a target below the seabed, which the module DOES handle and handles well',
      ok: belowAmbient.ok,
      hours: belowAmbient.hours,
      hoursAreInfinite: belowAmbient.hours === Infinity,
      timeConstantHr: belowAmbient.timeConstantHr,
      stationsReturned: belowAmbient.stations.length,
      note: belowAmbient.note === undefined ? null : belowAmbient.note,
      error: belowAmbient.error === undefined ? null : belowAmbient.error,
      handled: true,
    },
    {
      branch: 3,
      label: 'a target above the start, which is the missing one',
      ok: backwards.ok,
      hours: backwards.hours,
      note: backwards.note,
      error: backwards.error,
      handled: false,
    },
  ];
};

// ---------------------------------------------------------------------------
// BRIEF DEFECT (ii). THE JOULE-THOMSON TERM, APPLIED UNDAMPED. Expert m01.
//
// The engine writes the arrival as
//     ambient + (inlet - ambient) exp(-ntu) - jt dp
// and the header justifies the linear carry as what a linear pressure profile
// implies. It does not. A linear pressure profile implies a CONSTANT
// Joule-Thomson heat sink per foot, and a constant sink inside an
// exponentially relaxing line integrates to a SATURATING offset:
//     jt dp (1 - exp(-ntu)) / ntu
// so the engine over-applies the cooling by ntu / (1 - exp(-ntu)), which is 1
// on a short line and unbounded on a long one.
//
// NOTHING HERE RE-IMPLEMENTS AN EXPONENTIAL. The retained fraction is a RATIO
// of two engine returns, the arrival with heat loss only and the seabed and
// inlet the profile was given. The damping factor is that ratio and the
// engine's own ntu. The undamped drop is the DIFFERENCE between two engine
// arrivals. The damped drop is that difference divided by the factor. Every
// step is a difference or a ratio of engine returns, which is exactly the
// arithmetic a panel would otherwise have to do.
// ---------------------------------------------------------------------------

export const akasoJouleThomson = (lengthFt = AKASO.lengthFt) => {
  const heat = akasoProfileRun(lengthFt, false, 21);
  const withJt = akasoProfileRun(lengthFt, true, 21);
  const inletExcess = AKASO.inletTempF - AKASO.seabedTempF;
  const retained = (heat.arrivalTempF - AKASO.seabedTempF) / inletExcess;
  const dampingFactor = heat.ntu / (1 - retained);
  const engineJtDropF = heat.arrivalTempF - withJt.arrivalTempF;
  const dampedJtDropF = engineJtDropF / dampingFactor;
  const dampedArrivalTempF = heat.arrivalTempF - dampedJtDropF;
  const boundary = AKASO.hydrateFlowingF;
  return {
    teaching: true,
    lengthFt,
    inletPsia: AKASO.inletPsia,
    outletPsia: AKASO.outletPsia,
    pressureDropPsi: AKASO.inletPsia - AKASO.outletPsia,
    jtCoeffFPerPsi: AKASO.jtCoeffFPerPsi,
    ntu: heat.ntu,
    retainedExcessFraction: retained,
    dampingFactor,
    heatLossOnlyArrivalTempF: heat.arrivalTempF,
    engineJtArrivalTempF: withJt.arrivalTempF,
    dampedJtArrivalTempF: dampedArrivalTempF,
    engineJtDropF,
    dampedJtDropF,
    spuriousCoolingF: dampedArrivalTempF - withJt.arrivalTempF,
    hydrateFlowingF: boundary,
    hydrateBoundaryIsAnInput: HYDRATE_BOUNDARY_IS_AN_INPUT,
    heatLossOnlyMarginF: heat.arrivalTempF - boundary,
    engineJtMarginF: withJt.arrivalTempF - boundary,
    dampedJtMarginF: dampedArrivalTempF - boundary,
    engineSaysInsideTheHydrateRegion: withJt.arrivalTempF < boundary,
    dampedSaysInsideTheHydrateRegion: dampedArrivalTempF < boundary,
    verdictFlips: (withJt.arrivalTempF < boundary) !== (dampedArrivalTempF < boundary),
  };
};

export const AKASO_JT_LENGTH_SWEEP_FT = Object.freeze([
  20000, 40000, 60000, 90000, 120000, 150000, 180000, 210000,
]);

/**
 * The same line at a contiguous set of lengths, so the damping factor can be
 * watched growing from near one to unbounded. The 60000 ft row is the teaching
 * line's own length and is marked; none of the rows is a published case,
 * because the goldens set no pressures anywhere.
 *
 * `arrivalBelowSeabed` is the row that matters: past a certain length the
 * engine returns an arrival BELOW the seabed the line is losing heat to.
 */
export const akasoJtLengthRows = (lengths = AKASO_JT_LENGTH_SWEEP_FT) => lengths.map((lengthFt) => {
  const jt = akasoJouleThomson(lengthFt);
  return {
    teaching: true,
    lengthFt,
    isTheTeachingLength: lengthFt === AKASO.lengthFt,
    ntu: jt.ntu,
    dampingFactor: jt.dampingFactor,
    heatLossOnlyArrivalTempF: jt.heatLossOnlyArrivalTempF,
    engineJtArrivalTempF: jt.engineJtArrivalTempF,
    dampedJtArrivalTempF: jt.dampedJtArrivalTempF,
    spuriousCoolingF: jt.spuriousCoolingF,
    seabedTempF: AKASO.seabedTempF,
    arrivalBelowSeabed: jt.engineJtArrivalTempF < AKASO.seabedTempF,
    engineJtMarginF: jt.engineJtMarginF,
    dampedJtMarginF: jt.dampedJtMarginF,
    published: false,
  };
});

/**
 * THE COLLISION INSIDE ONE MODULE. At three times the teaching length the
 * engine returns an arrival BELOW the seabed, with `ok: true`. Handed that
 * exact temperature as a TARGET, `uForArrivalTemp` in the same file refuses it
 * as impossible, and the refusal is right.
 */
export const akasoBelowSeabed = (lengthFt = AKASO.lengthFt * 3) => {
  const p = akasoProfileRun(lengthFt, true, 21);
  const refusal = uForArrivalTemp({
    lengthFt,
    inletTempF: AKASO.inletTempF,
    ambientTempF: AKASO.seabedTempF,
    targetTempF: p.arrivalTempF,
    massRateLbHr: AKASO.massRateLbHr,
    cpBtuLbF: AKASO.cpBtuLbF,
    idIn: AKASO.boreIn,
  });
  const jt = akasoJouleThomson(lengthFt);
  return {
    teaching: true,
    lengthFt,
    lengthMultipleOfTheTeachingLine: lengthFt / AKASO.lengthFt,
    seabedTempF: AKASO.seabedTempF,
    profileOk: p.ok,
    engineJtArrivalTempF: p.arrivalTempF,
    belowSeabedByF: AKASO.seabedTempF - p.arrivalTempF,
    dampedJtArrivalTempF: jt.dampedJtArrivalTempF,
    // THE DAMPED READING DIPS BELOW THE SEABED TOO, and the lab says so rather
    // than telling a nicer story. A constant cooling sink inside a relaxing
    // line legitimately takes the fluid below ambient for a while, because the
    // sink is laid down faster than the sea gives the heat back. THE FINDING
    // IS THE SIZE, not the sign: at this length the engine is tens of degF
    // under the seabed where the correctly damped reading is a few.
    dampedIsAboveSeabed: jt.dampedJtArrivalTempF > AKASO.seabedTempF,
    dampedBelowSeabedByF: AKASO.seabedTempF - jt.dampedJtArrivalTempF,
    engineOverDampedExcursion: (AKASO.seabedTempF - p.arrivalTempF)
      / (AKASO.seabedTempF - jt.dampedJtArrivalTempF),
    ntu: p.ntu,
    dampingFactor: jt.dampingFactor,
    inverseOk: refusal.ok,
    inverseReason: refusal.reason === undefined ? null : refusal.reason,
    twoFunctionsOppositePositions: p.ok === true && refusal.ok === false,
  };
};

// ---------------------------------------------------------------------------
// THE PUBLISHED INHIBITOR TABLE, ON BOTH ROADS. Expert m03.
// ---------------------------------------------------------------------------

/**
 * 24 published rows: four fluids at six concentrations each, every one
 * carrying a Hammerschmidt and a Nielsen-Bucklin depression from the ORACLE
 * beside the ENGINE's own return for the same case.
 *
 * NOTE THE TWO RELATIVE DIFFERENCES. Nielsen-Bucklin agrees to machine
 * precision because 72 times 1.8 is exactly the 129.6 the module carries.
 * Hammerschmidt does not, and the residual is the constant, not the arithmetic.
 */
export const goldenInhibitionRows = () => golden.inhibition.map((r, i) => {
  const ham = hammerschmidtDepression({
    weightPct: r.weightPct, molecularWeight: r.molecularWeight,
  });
  const nb = nielsenBucklinDepression({
    weightPct: r.weightPct, molecularWeight: r.molecularWeight,
  });
  return {
    rowNumber: i + 1,
    inhibitorId: r.inhibitor,
    molecularWeight: r.molecularWeight,
    weightPct: r.weightPct,
    goldenHammerschmidtF: r.hammerschmidtF,
    engineHammerschmidtF: ham,
    // TWO DENOMINATORS FOR ONE GAP, and they differ in the fifth figure. The
    // wave's own generator divides by the ENGINE value and this lab's `rel`
    // divides by the reference it is comparing against, which here is the
    // GOLDEN. Both are here with the denominator in the name, because a
    // relative difference without its base is not a reading.
    hammerschmidtRelDiff: rel(ham, r.hammerschmidtF),
    hammerschmidtRelDiffOverEngine: Math.abs(ham - r.hammerschmidtF) / Math.abs(ham),
    goldenNielsenBucklinF: r.nielsenBucklinF,
    engineNielsenBucklinF: nb,
    nielsenBucklinRelDiff: rel(nb, r.nielsenBucklinF),
    spreadF: Math.abs(ham - nb),
    spreadPctOfHammerschmidt: (Math.abs(ham - nb) / ham) * 100,
    published: true,
  };
});

/**
 * The engine's own `depression` call at each published concentration for
 * methanol, so the basis switch and the note are visible rather than described.
 * The glycols have no Nielsen-Bucklin at all, which is a different row shape
 * and is why `nielsenBucklinF` can be null here.
 */
export const DEPRESSION_SWEEP_WT_PCT = Object.freeze([5, 10, 15, 20, 25, 30, 35, 40, 45, 50]);

export const depressionRows = (inhibitorId = 'methanol', weightPcts = DEPRESSION_SWEEP_WT_PCT) =>
  weightPcts.map((weightPct) => {
    const d = depression({ weightPct, inhibitorId });
    return {
      inhibitorId,
      weightPct,
      ok: d.ok,
      hammerschmidtF: d.hammerschmidtF,
      nielsenBucklinF: d.nielsenBucklinF,
      recommendedF: d.recommendedF,
      basis: d.basis,
      reliable: d.reliable,
      spreadF: d.spreadF,
      // the ratio, which is the honest measure of how far the relation is
      // being pushed, and it is null wherever there is no second relation
      ratioHammerschmidtOverNielsenBucklin: d.nielsenBucklinF === null
        ? null : d.hammerschmidtF / d.nielsenBucklinF,
      hasNote: d.note !== null,
      published: golden.inhibition.some((r) => r.inhibitor === inhibitorId && r.weightPct === weightPct),
    };
  });

export const DILUTE_LIMIT_WT_PCT = Object.freeze([1, 0.1, 0.01, 0.001]);

/**
 * THE DILUTE LIMIT, WALKED DOWN. The ratio of the two relations approaches the
 * ratio of the carried constant to the constant that makes them meet, and what
 * is left over is the series correction on the logarithm. The gap is a
 * CONSTANT and not a curvature, which is what makes it adjudicable.
 */
export const diluteLimitRows = (weightPcts = DILUTE_LIMIT_WT_PCT) => weightPcts.map((weightPct) => {
  const molecularWeight = INHIBITORS[0].molecularWeight;
  const ham = hammerschmidtDepression({ weightPct, molecularWeight });
  const nb = nielsenBucklinDepression({ weightPct, molecularWeight });
  return {
    weightPct,
    hammerschmidtF: ham,
    nielsenBucklinF: nb,
    ratio: ham / nb,
    constantRatio: ENGINE_HAMMERSCHMIDT_K / HAMMERSCHMIDT_K_FOR_DILUTE_MATCH,
    seriesCorrection: ham / nb - ENGINE_HAMMERSCHMIDT_K / HAMMERSCHMIDT_K_FOR_DILUTE_MATCH,
    published: false,
  };
});

/**
 * THE RELIABLE LINE IS NOT WHERE THE TWO RELATIONS START TO DISAGREE. At the
 * reliable ceiling itself the engine already reports a spread, and reports
 * `reliable: true` beside it.
 */
export const reliableLineReading = (inhibitorId = 'methanol') => {
  const at = depression({ weightPct: HAMMERSCHMIDT_RELIABLE_WT_PCT, inhibitorId });
  const justPast = depression({ weightPct: HAMMERSCHMIDT_RELIABLE_WT_PCT + 0.001, inhibitorId });
  return {
    inhibitorId,
    reliableWtPct: HAMMERSCHMIDT_RELIABLE_WT_PCT,
    hammerschmidtF: at.hammerschmidtF,
    nielsenBucklinF: at.nielsenBucklinF,
    spreadF: at.spreadF,
    spreadPctOfHammerschmidt: (at.spreadF / at.hammerschmidtF) * 100,
    reliable: at.reliable,
    basis: at.basis,
    justPastReliable: justPast.reliable,
    justPastBasis: justPast.basis,
    // the recommended depression jumps at the line even though neither
    // relation moved, because the BASIS moved
    recommendedAtTheLineF: at.recommendedF,
    recommendedJustPastF: justPast.recommendedF,
    recommendedJumpF: justPast.recommendedF - at.recommendedF,
  };
};

/** Methanol beats the glycols per pound, and the molecular weight does the work. */
export const inhibitorRows = (weightPct = 20) => INHIBITORS.map((inh) => {
  const d = depression({ weightPct, inhibitorId: inh.id });
  return {
    id: inh.id,
    label: inh.label,
    molecularWeight: inh.molecularWeight,
    k: inh.k,
    densityLbGal: inh.densityLbGal,
    nielsenBucklinAvailable: inh.nielsenBucklin,
    weightPct,
    hammerschmidtF: d.hammerschmidtF,
    nielsenBucklinF: d.nielsenBucklinF,
    published: golden.inhibition.some((r) => r.inhibitor === inh.id && r.weightPct === weightPct),
  };
});

/** An unknown inhibitor id FALLS BACK to methanol rather than refusing. */
export const unknownInhibitorFallback = () => ({
  askedFor: 'nonsense',
  returnedId: inhibitor('nonsense').id,
  returnedLabel: inhibitor('nonsense').label,
  fellBack: inhibitor('nonsense').id === INHIBITORS[0].id,
});

// ---------------------------------------------------------------------------
// BRIEF RESULT 4 AND DEFECT (i). SIZED ONE WAY, CHECKED ANOTHER. Expert m04.
// ---------------------------------------------------------------------------

/**
 * The inverse of Nielsen-Bucklin, which the module does not offer, reached by
 * BRACKETING the engine's own forward function. See `bisectOnEngine`. Used to
 * say what concentration the relation the engine CHECKS with would have picked
 * if it had been the relation the engine SIZED with.
 */
export const weightPctForNielsenBucklin = memoize(({ depressionF, molecularWeight }) =>
  bisectOnEngine(
    (w) => nielsenBucklinDepression({ weightPct: w, molecularWeight }),
    depressionF,
    0,
    99.999,
  ));

const akasoRequirementRun = memoize((inhibitorId) => inhibitionRequirement({
  subcoolingF: AKASO.subcoolingF,
  safetyMarginF: AKASO.safetyMarginF,
  waterRateBpd: AKASO.waterRateBpd,
  inhibitorId,
  leanWtPct: inhibitorId === 'methanol' ? AKASO.leanMethanolWtPct : AKASO.leanMegWtPct,
}));

/**
 * BRIEF DEFECT (i), IN ONE OBJECT. The chain inside one engine call is:
 * `weightPctForDepression` inverts HAMMERSCHMIDT to pick the concentration;
 * `depression` is then called on that concentration, decides it is above the
 * reliable line, and reports NIELSEN-BUCKLIN as `recommendedF`; and nothing
 * compares the second back to the first.
 *
 * TWO DEPRESSIONS, TWO NAMES, PROVENANCE RULE 7.
 *   `sizedDepressionF` is what was ASKED FOR, and it is what the Hammerschmidt
 *   inverse delivers by construction, to the last figure.
 *   `deliveredDepressionF` is what the engine's OWN check says the same
 *   concentration gives. For methanol that is Nielsen-Bucklin. For a glycol
 *   `nielsenBucklinF` is null, so there is no check at all and the engine's
 *   recommended depression IS the number it was asked for, which reads as a
 *   design delivering exactly what was ordered.
 *
 * `handRunNielsenBucklinF` is Nielsen-Bucklin run on the glycol concentration
 * by hand through the engine's own function, which the module could have done
 * and does not.
 */
export const akasoRequirement = (inhibitorId = 'methanol') => {
  const r = akasoRequirementRun(inhibitorId);
  const inh = inhibitor(inhibitorId);
  const need = AKASO.subcoolingF + AKASO.safetyMarginF;
  const check = r.depressionCheck;
  const handRun = nielsenBucklinDepression({
    weightPct: r.weightPct, molecularWeight: inh.molecularWeight,
  });
  const delivered = check.nielsenBucklinF === null ? handRun : check.nielsenBucklinF;
  return {
    teaching: true,
    inhibitorId,
    inhibitorLabel: inh.label,
    molecularWeight: inh.molecularWeight,
    subcoolingF: AKASO.subcoolingF,
    safetyMarginF: AKASO.safetyMarginF,
    hydrateBoundaryIsAnInput: HYDRATE_BOUNDARY_IS_AN_INPUT,
    ok: r.ok,
    required: r.required,
    neededDepressionF: r.neededDepressionF,
    designWtPct: r.weightPct,
    // the two roads, named apart
    sizedDepressionF: check.hammerschmidtF,
    sizedRelation: 'hammerschmidt',
    deliveredDepressionF: delivered,
    deliveredRelation: 'nielsenBucklin',
    engineCheckNielsenBucklinF: check.nielsenBucklinF,
    handRunNielsenBucklinF: handRun,
    thereIsNoCheckAtAll: check.nielsenBucklinF === null,
    engineRecommendedF: check.recommendedF,
    engineBasis: check.basis,
    engineReliable: check.reliable,
    shortfallF: need - delivered,
    shortfallAgainstBareSubcoolingF: AKASO.subcoolingF - delivered,
    shortOfTheBareSubcooling: delivered < AKASO.subcoolingF,
    moleFractionOfInhibitor: weightPctToMoleFraction({
      weightPct: r.weightPct, molecularWeight: inh.molecularWeight,
    }),
    leanWtPct: inhibitorId === 'methanol' ? AKASO.leanMethanolWtPct : AKASO.leanMegWtPct,
    waterRateBpd: AKASO.waterRateBpd,
    rateBpd: r.rate.rateBpd,
    rateGpd: r.rate.rateGpd,
    massLbDay: r.rate.massLbDay,
    pureMassLbDay: r.rate.pureMassLbDay,
    streamDensityLbGal: r.rate.streamDensityLbGal,
  };
};

export const SHORTFALL_SWEEP_NEEDS_F = Object.freeze([
  15, 20, 25, 30, 35, 41, 50, 60, 80, 100, 120, 140, 160, 170, 180,
]);

/**
 * HOW SHORT IS SHORT, ACROSS A SWEEP OF NEEDS. Every row calls
 * `inhibitionRequirement` on the teaching line's water rate and lean strength
 * with only the subcooling moved, and reads the function's OWN
 * `depressionCheck` back.
 *
 * READ IT IN TWO HALVES. BELOW the reliability line the check reports
 * HAMMERSCHMIDT, which is the same relation the dose was sized with, so the
 * shortfall reads as exactly zero and the check has proved nothing at all.
 * ABOVE it the check switches relation and the shortfall appears in one step
 * and then grows monotonically, while `ok` stays true.
 *
 * THE ONE ROW THAT IS REFUSED IS NOT REFUSED FOR BEING SHORT. It is refused
 * for asking a concentration past the practical ceiling. Sort this table by
 * shortfall and the refusal stays exactly where it is.
 *
 * SWEEP POINTS on teaching inputs, every one of them.
 */
export const shortfallSweepRows = (needs = SHORTFALL_SWEEP_NEEDS_F, inhibitorId = 'methanol') => {
  const inh = inhibitor(inhibitorId);
  return needs.map((subcoolingF) => {
    const r = inhibitionRequirement({
      subcoolingF,
      waterRateBpd: AKASO.waterRateBpd,
      inhibitorId,
      leanWtPct: inhibitorId === 'methanol' ? AKASO.leanMethanolWtPct : AKASO.leanMegWtPct,
    });
    const check = r.depressionCheck;
    const handRun = nielsenBucklinDepression({
      weightPct: r.weightPct, molecularWeight: inh.molecularWeight,
    });
    const delivered = check ? check.recommendedF : handRun;
    return {
      teaching: true,
      inhibitorId,
      neededDepressionF: subcoolingF,
      ok: r.ok,
      accepted: r.ok === true,
      designWtPct: r.weightPct,
      basis: check ? check.basis : null,
      reliable: check ? check.reliable : null,
      deliveredDepressionF: delivered,
      handRunNielsenBucklinF: handRun,
      shortfallF: subcoolingF - delivered,
      shortfallAgainstNielsenBucklinF: subcoolingF - handRun,
      shortfallPctOfNeed: ((subcoolingF - delivered) / subcoolingF) * 100,
      refusedOnConcentration: r.ok === false,
      pastTheCeiling: r.weightPct > MAX_PRACTICAL_WT_PCT,
      error: r.error === undefined ? null : r.error,
      published: false,
    };
  });
};

/**
 * ONE NEED, FOUR FLUIDS, ONE MOLE FRACTION, ONE CHECK. The Hammerschmidt
 * inverse fixes the inhibitor to water MOLE RATIO at the molecular weight of
 * water times the depression over the constant, and all four fluids carry the
 * same constant, so every fluid sized for one need lands on the same mole
 * fraction and therefore on the same Nielsen-Bucklin answer.
 *
 * The catalogue sets the Nielsen-Bucklin flag true on methanol and FALSE on
 * all three glycols, and the stated reason is that the relation was developed
 * for methanol. THE ARITHMETIC DOES NOT SUPPORT THAT REASON: the mole fraction
 * contains no molecular weight at all. Suppressing the check for three of the
 * four fluids removes a check and changes no answer.
 */
export const oneNeedFourFluidsRows = (neededDepressionF = 36) => INHIBITORS.map((inh) => {
  const weightPct = weightPctForDepression({
    depressionF: neededDepressionF, molecularWeight: inh.molecularWeight, k: inh.k,
  });
  const check = depression({ weightPct, inhibitorId: inh.id });
  return {
    inhibitorId: inh.id,
    label: inh.label,
    k: inh.k,
    molecularWeight: inh.molecularWeight,
    neededDepressionF,
    designWtPct: weightPct,
    moleFraction: weightPctToMoleFraction({ weightPct, molecularWeight: inh.molecularWeight }),
    hammerschmidtBackF: hammerschmidtDepression({
      weightPct, molecularWeight: inh.molecularWeight, k: inh.k,
    }),
    handRunNielsenBucklinF: nielsenBucklinDepression({
      weightPct, molecularWeight: inh.molecularWeight,
    }),
    engineCheckNielsenBucklinF: check.nielsenBucklinF,
    thereIsNoCheckAtAll: check.nielsenBucklinF === null,
    published: false,
  };
});

/**
 * THE SAME NaN-IS-FALSY HABIT AS THE SWALLOWED TRENCH AND THE SWALLOWED MASS,
 * in the one place where the fails-open answer is the dangerous one. The guard
 * is `!(need > 0)`, which is TRUE for a not-a-number, so the branch written for
 * "the fluid is already outside the hydrate region" also catches "nobody said
 * where the fluid is". The caller is told NO INHIBITOR IS NEEDED, with
 * `ok: true`, and the note prints the words not-a-number to a user.
 */
export const missingSubcoolingFallsOpen = () => {
  const r = inhibitionRequirement({ waterRateBpd: AKASO.waterRateBpd });
  const outside = inhibitionRequirement({ subcoolingF: -5, waterRateBpd: AKASO.waterRateBpd });
  return {
    ok: r.ok,
    required: r.required,
    neededDepressionIsNaN: Number.isNaN(r.neededDepressionF),
    hasAWeightPct: r.weightPct !== undefined,
    hasARate: r.rate !== undefined,
    noteMentionsNotANumber: typeof r.note === 'string' && r.note.includes('NaN'),
    note: r.note,
    // the branch it was borrowed from, which is a real answer and reads the same
    outsideOk: outside.ok,
    outsideRequired: outside.required,
    outsideNote: outside.note,
    theTwoAreIndistinguishableFromOkAndRequired:
      r.ok === outside.ok && r.required === outside.required,
  };
};

/**
 * WHAT THE OTHER RELATION WOULD HAVE PICKED, and what it costs. The
 * concentration comes from bracketing the engine's own Nielsen-Bucklin, and
 * the rate at that concentration comes from the engine's own `injectionRate`.
 */
export const akasoNielsenSizedDose = (inhibitorId = 'methanol') => {
  const base = akasoRequirement(inhibitorId);
  const inh = inhibitor(inhibitorId);
  const weightPct = weightPctForNielsenBucklin({
    depressionF: base.neededDepressionF, molecularWeight: inh.molecularWeight,
  });
  const rate = injectionRate({
    waterRateBpd: AKASO.waterRateBpd,
    weightPct,
    inhibitorId,
    leanWtPct: base.leanWtPct,
  });
  return {
    teaching: true,
    inhibitorId,
    neededDepressionF: base.neededDepressionF,
    hammerschmidtSizedWtPct: base.designWtPct,
    nielsenBucklinSizedWtPct: weightPct,
    wtPctDifference: weightPct - base.designWtPct,
    checkAtTheNielsenDoseF: nielsenBucklinDepression({
      weightPct, molecularWeight: inh.molecularWeight,
    }),
    hammerschmidtSizedRateBpd: base.rateBpd,
    nielsenBucklinSizedRateBpd: rate.rateBpd,
    extraRateBpd: rate.rateBpd - base.rateBpd,
    extraRatePct: pct(rate.rateBpd, base.rateBpd),
  };
};

/**
 * THE TWO DOSES SIT AT THE SAME MOLE FRACTION. For one wanted depression the
 * Hammerschmidt inverse fixes the inhibitor to water MOLE ratio and nothing
 * else, so a methanol dose and a MEG dose sized for the same subcooling land
 * on the same mole fraction and therefore on the same Nielsen-Bucklin
 * depression, to the last figure. The module could check the glycol against
 * that number and does not.
 */
export const akasoMoleFractionSeam = () => {
  const meoh = akasoRequirement('methanol');
  const meg = akasoRequirement('meg');
  return {
    teaching: true,
    methanolWtPct: meoh.designWtPct,
    megWtPct: meg.designWtPct,
    methanolMoleFraction: meoh.moleFractionOfInhibitor,
    megMoleFraction: meg.moleFractionOfInhibitor,
    moleFractionDifference: meoh.moleFractionOfInhibitor - meg.moleFractionOfInhibitor,
    methanolDeliveredF: meoh.deliveredDepressionF,
    megDeliveredF: meg.deliveredDepressionF,
    deliveredDifferenceF: meoh.deliveredDepressionF - meg.deliveredDepressionF,
    methanolHasACheck: !meoh.thereIsNoCheckAtAll,
    megHasACheck: !meg.thereIsNoCheckAtAll,
  };
};

// ---------------------------------------------------------------------------
// BRIEF DEFECTS (vii) AND (ix). CEILINGS AND CONVENTIONS. Expert m05.
// ---------------------------------------------------------------------------

/**
 * BRIEF DEFECT (vii). `MAX_PRACTICAL_WT_PCT` is compared against the
 * concentration the HAMMERSCHMIDT inverse produced, so the refusal boundary is
 * drawn in the coordinates of the relation the module says over-predicts up
 * there. The engine will therefore accept and design for a stated subcooling
 * anywhere up to the Hammerschmidt depression at the ceiling, while the
 * deepest subcooling that concentration can actually kill is the
 * Nielsen-Bucklin one.
 *
 * `ceilingInNielsenBucklinWtPct` is the concentration Nielsen-Bucklin would
 * need to deliver the Hammerschmidt depression at the ceiling, which is past
 * the ceiling itself.
 */
export const ceilingCoordinates = (inhibitorId = 'methanol') => {
  const inh = inhibitor(inhibitorId);
  const ham = hammerschmidtDepression({
    weightPct: MAX_PRACTICAL_WT_PCT, molecularWeight: inh.molecularWeight, k: inh.k,
  });
  const nb = nielsenBucklinDepression({
    weightPct: MAX_PRACTICAL_WT_PCT, molecularWeight: inh.molecularWeight,
  });
  return {
    inhibitorId,
    maxPracticalWtPct: MAX_PRACTICAL_WT_PCT,
    hammerschmidtAtCeilingF: ham,
    nielsenBucklinAtCeilingF: nb,
    bandF: ham - nb,
    bandPctOfHammerschmidt: ((ham - nb) / ham) * 100,
    ceilingInNielsenBucklinWtPct: weightPctForNielsenBucklin({
      depressionF: ham, molecularWeight: inh.molecularWeight,
    }),
    theCeilingIsMeasuredIn: 'hammerschmidt',
    theCheckIsMeasuredIn: 'nielsenBucklin',
  };
};

/**
 * The refusal itself, on a subcooling past what anything is actually run at.
 * The concentration prints at one decimal because the sentence names the
 * ceiling beside it, and at whole percent a required 70.25 read as the limit
 * it had just cleared.
 */
export const ceilingRefusal = (inhibitorId = 'methanol', overshootWtPct = 0.25) => {
  const inh = inhibitor(inhibitorId);
  const subcoolingF = hammerschmidtDepression({
    weightPct: MAX_PRACTICAL_WT_PCT + overshootWtPct,
    molecularWeight: inh.molecularWeight,
    k: inh.k,
  });
  const r = inhibitionRequirement({ subcoolingF, waterRateBpd: 200, inhibitorId });
  return {
    inhibitorId,
    subcoolingF,
    ok: r.ok,
    required: r.required,
    weightPct: r.weightPct,
    printedToOneDecimal: r.weightPct.toFixed(1),
    printedWhole: Math.round(r.weightPct),
    printsAsTheCeiling: r.weightPct.toFixed(1) === MAX_PRACTICAL_WT_PCT.toFixed(1),
    error: r.error,
    maxPracticalWtPct: MAX_PRACTICAL_WT_PCT,
  };
};

/**
 * BRIEF DEFECT (ix). Inside `injectionRate`, `leanWtPct` is a WEIGHT percent
 * on one line and a VOLUME percent on the next:
 *
 *   streamLbDay  = pureLbDay * (100 / lean)                      mass, correct
 *   streamDensity = (rhoInhibitor * lean + rhoWater * (100 - lean)) / 100
 *
 * The gross-up treats `lean` as a weight percent, which it is. The density
 * blend weights the two densities by the same number, which is the
 * volume-fraction rule. The mass-fraction form of an ideal blend is
 * 1/rho = w_i/rho_i + w_w/rho_w. The arithmetic mean of two densities always
 * exceeds the harmonic mean, so the stream density comes out HIGH and, since
 * the rate is a mass over a density, the injection rate comes out LOW.
 *
 * `engineStreamDensityLbGal` is the ENGINE's own returned density.
 * `massAdditiveDensityLbGal` is the same blend done the other way on the same
 * two densities, which is arithmetic on engine catalog values and not a second
 * correlation.
 */
export const LEAN_SWEEP_WT_PCT = Object.freeze([100, 96, 90, 89, 80, 70, 60, 50]);

export const leanBlendRows = (
  inhibitorId = 'methanol', leans = LEAN_SWEEP_WT_PCT, weightPct = 30, waterRateBpd = 420,
) => {
  const inh = inhibitor(inhibitorId);
  const waterDensityLbGal = 8.34;
  return leans.filter((lean) => lean > weightPct).map((leanWtPct) => {
    const r = injectionRate({
      waterRateBpd, weightPct, inhibitorId, leanWtPct, waterDensityLbGal,
    });
    const massAdditive = 100 / (
      leanWtPct / inh.densityLbGal + (100 - leanWtPct) / waterDensityLbGal
    );
    const correctedRateBpd = r.rateBpd * (r.streamDensityLbGal / massAdditive);
    return {
      inhibitorId,
      leanWtPct,
      weightPct,
      waterRateBpd,
      inhibitorDensityLbGal: inh.densityLbGal,
      waterDensityLbGal,
      engineStreamDensityLbGal: r.streamDensityLbGal,
      massAdditiveDensityLbGal: massAdditive,
      densityDifferenceLbGal: r.streamDensityLbGal - massAdditive,
      densityHighByPct: pct(r.streamDensityLbGal, massAdditive),
      engineRateBpd: r.rateBpd,
      massAdditiveRateBpd: correctedRateBpd,
      // TWO DENOMINATORS FOR ONE ERROR, AND THEY ARE DIFFERENT NUMBERS. Taken
      // against the ENGINE'S own rate the shortfall is the same percentage as
      // the density is high by, which is the identity worth showing. Taken
      // against the corrected rate it is a slightly smaller number. Both are
      // here with their denominators in their names, because a percentage
      // without its base is not a reading.
      rateLowByPctOfEngineRate: pct(correctedRateBpd, r.rateBpd),
      rateLowByPctOfCorrectRate: pct(r.rateBpd, correctedRateBpd),
      isTheTeachingLean: leanWtPct === AKASO.leanMethanolWtPct || leanWtPct === AKASO.leanMegWtPct,
      published: false,
    };
  });
};

/** The same seam priced on the teaching line's own two doses. */
export const akasoLeanBlend = () => ['methanol', 'meg'].map((inhibitorId) => {
  const base = akasoRequirement(inhibitorId);
  const inh = inhibitor(inhibitorId);
  const waterDensityLbGal = 8.34;
  const massAdditive = 100 / (
    base.leanWtPct / inh.densityLbGal + (100 - base.leanWtPct) / waterDensityLbGal
  );
  const correctedRateBpd = base.rateBpd * (base.streamDensityLbGal / massAdditive);
  return {
    teaching: true,
    inhibitorId,
    leanWtPct: base.leanWtPct,
    designWtPct: base.designWtPct,
    engineStreamDensityLbGal: base.streamDensityLbGal,
    massAdditiveDensityLbGal: massAdditive,
    densityHighByPct: pct(base.streamDensityLbGal, massAdditive),
    engineRateBpd: base.rateBpd,
    massAdditiveRateBpd: correctedRateBpd,
    rateLowByPctOfEngineRate: pct(correctedRateBpd, base.rateBpd),
    rateLowByPctOfCorrectRate: pct(base.rateBpd, correctedRateBpd),
  };
});

/** What the injection rate refuses, and it does refuse the one that matters. */
export const injectionRefusals = () => {
  const weakLean = injectionRate({
    waterRateBpd: 420, weightPct: 30, inhibitorId: 'meg', leanWtPct: 25,
  });
  const noWater = injectionRate({
    waterRateBpd: -1, weightPct: 30, inhibitorId: 'meg', leanWtPct: 90,
  });
  const badTarget = injectionRate({
    waterRateBpd: 420, weightPct: 0, inhibitorId: 'meg', leanWtPct: 90,
  });
  const outsideAlready = inhibitionRequirement({ subcoolingF: -5, waterRateBpd: 420 });
  return [
    { label: 'a lean stream weaker than the concentration it has to produce', ok: weakLean.ok, error: weakLean.error },
    { label: 'no water rate at all', ok: noWater.ok, error: noWater.error },
    { label: 'a target concentration of zero', ok: badTarget.ok, error: badTarget.error },
    {
      label: 'a fluid already outside the hydrate region, which is a real answer and not a rate of zero',
      ok: outsideAlready.ok,
      required: outsideAlready.required,
      note: outsideAlready.note,
      hasARate: outsideAlready.rate !== undefined,
    },
  ];
};

// ---------------------------------------------------------------------------
// WHAT THESE MODULES REFUSE TO DO. Every module that introduces a capability
// has to state its limit, and every tier needs at least one of them.
// ---------------------------------------------------------------------------

export const refusals = () => Object.freeze([
  'THE HYDRATE BOUNDARY IS NOT COMPUTED ANYWHERE. Both module headers say so in as many words: hydrate and wax boundaries are fluid properties, they come from a lab or a compositional flash, and the consumer supplies them. Every verdict in this course is conditional on a laboratory number somebody else measured.',
  'There is no wax boundary either, and no deposition model of any kind. This module says where the fluid IS in pressure and temperature and nothing about what comes out of it.',
  'There is no pressure traverse. The Joule-Thomson term is carried linearly along the line because a linear pressure profile is assumed, and a consumer with a real traverse is told to pass its own stations instead.',
  'The Joule-Thomson coefficient is an INPUT. It is a fluid property out of an equation of state and nothing in this module knows it.',
  'Every layer conductivity is an INPUT. The catalog is a set of defaults offered, not product data, and the film coefficients are exposed precisely because they are the one genuinely uncertain number in a U.',
  'The burial term is the classical shape factor for an ISOTHERMAL cylinder in a SEMI-INFINITE medium. One uniform soil conductivity everywhere, a flat surface at ambient, no groundwater movement, no seasonal front, and a burial measured to the CENTRELINE. None of those is checked.',
  'An unknown conductivity or film id is a NaN and never a fallback, because an earlier version returned carbon steel for an unknown id and made a line look two thousand times better insulated than it is.',
  'overallU REPORTS the diameter its U is referred to and none of its three consumers accepts one. relaxationLengthFt, steadyStateProfile and cooldownTime each take a bare idIn, so keeping the pair together is the caller job.',
  'overallU CATCHES a burial resistance it cannot compute and DROPS THE TERM rather than refusing. A buried line comes back as an exposed line with ok true and no note, which is the opposite of the discipline the same file states for a layer.',
  'The cooldown is LUMPED CAPACITANCE. One temperature for the whole cross section, no radial gradient, no axial conduction, and no phase change in anything that is cooling.',
  'cooldownTime has exactly two mass slots, contents and shell, while overallU takes an unbounded layer list. There is no slot for a coating and no warning when the layers outnumber the slots.',
  'cooldownTime never checks its start against its target, so an inverted pair returns a NEGATIVE number of hours with ok true, no note, and a station table that runs backwards and warms up.',
  'The steady state profile is STEADY STATE. No transient, no slugging, no holdup, no elevation change and no seabed that varies along the route.',
  'inhibitionRequirement sizes the dose by inverting HAMMERSCHMIDT and checks it with NIELSEN-BUCKLIN, and never compares the two. Above the reliable line it can return ok true at a dose whose own check falls short of the subcooling asked for.',
  'For a glycol there is no check at all, because Nielsen-Bucklin was developed for methanol and the module will not use it where it does not apply. The consequence is that the glycol design reads as delivering exactly what was ordered.',
  'The practical concentration ceiling is compared against a concentration measured in HAMMERSCHMIDT coordinates, so the refusal boundary sits in the coordinates of the relation the module says over-predicts up there.',
  'Salt in the produced water inhibits too, and it is left out and said to be left out rather than approximated, because the depression from salinity depends on the ions present and is a flash calculation.',
  'The injection rate is a mass balance on the aqueous phase and nothing more. There is no methanol lost to the gas or to the condensate, which on a real line is most of the reason a project chooses glycol.',
]);

// ---------------------------------------------------------------------------
// THE THREE PANEL VIEWS.
//
// A panel reads one of these and nothing else. Each is a frozen object of named
// accessors, so the panel is a renderer: it chooses a mode and lays out rows.
// ---------------------------------------------------------------------------

/** Associate: the resistance stack, the layers, the trench and both masses. */
export const thermalExplorer = Object.freeze({
  lineLabel: 'the published pipe, in five builds',
  constants: publishedConstants,
  conductivities: conductivityRows,
  films: filmRows,
  catalogRefusals,
  builds: PUBLISHED_BUILDS,
  buildLabels: PUBLISHED_BUILD_LABELS,
  buildRows: publishedBuildRows,
  buildSummary: publishedBuildSummary,
  uPairs: publishedUPairRows,
  buildRatios: publishedBuildRatios,
  foamShares: foamShareRows,
  steelShares: steelShareRows,
  logTerms: layerLogTerms,
  stackRefusals,
  foamOds: FOAM_OD_SWEEP_IN,
  foamThickness: foamThicknessRows,
  foamLogs: foamLogComparison,
  materials: insulationMaterialRows,
  materialContrast: insulationMaterialContrast,
  burialFloor,
  burialDepths: burialDepthRows,
  burialDepthSweep: BURIAL_DEPTH_SWEEP_FT,
  soils: soilRows,
  soilSweep: SOIL_SWEEP_K,
  burialConvention: burialCentrelineConvention,
  references: referenceRows,
  referenceInvariant,
  masses: publishedMasses,
  massAgainstHeatCapacity,
  foamMass: publishedFoamMass,
  massRefusals,
  refusals,
});

/** Professional: the line in operation, the inverse, the cooldown and the margin. */
export const lineExplorer = Object.freeze({
  lineLabel: `the published fluid and ${AKASO.name}`,
  fluid: PUBLISHED_FLUID,
  relaxationRows: goldenRelaxationRows,
  relaxationScalings,
  relaxationByBuild: relaxationByBuildRows,
  relaxationRefusals,
  profileRows: goldenProfileRows,
  ntus: NTU_SWEEP,
  ntuSweep: ntuSweepRows,
  stations: publishedStationRows,
  dropRatio: stationDropRatio,
  stationCounts: STATION_COUNT_SWEEP,
  stationCountRows,
  profileRefusals,
  targets: PUBLISHED_TARGET_SWEEP_F,
  targetRows: uForTargetRows,
  inverseRefusals,
  cooldown: publishedCooldown,
  cooldownStations: publishedCooldownStationRows,
  massAgainstHeatCapacity,
  nanMassDrop,
  stagnantBore: stagnantBoreCooldown,
  akaso: akasoDefinition,
  akasoHeatLoss: akasoHeatLossOnly,
  akasoStations: akasoStationRows,
  akasoTargets: akasoTargetRows,
  akasoTargetSweep: AKASO_TARGET_SWEEP_F,
  akasoMasses,
  akasoCooldown: akasoCooldownPair,
  akasoCooldownStations: akasoCooldownStationRows,
  akasoBackwards: akasoBackwardsCooldown,
  akasoBranches: akasoCooldownBranches,
  refusals,
});

/** Expert: the boundary, the undamped term, the dropped trench and the chemical. */
export const hydrateExplorer = Object.freeze({
  lineLabel: `${AKASO.name}, the teaching line`,
  akaso: akasoDefinition,
  jouleThomson: akasoJouleThomson,
  jtLengths: akasoJtLengthRows,
  jtLengthSweep: AKASO_JT_LENGTH_SWEEP_FT,
  belowSeabed: akasoBelowSeabed,
  droppedTrench,
  akasoSwallowedTrench,
  refusalAsymmetry,
  mixedReference: mixedReferenceRows,
  mixedReferenceHeadline,
  akasoReferencePair,
  akasoFoamRemoved,
  goldenInhibition: goldenInhibitionRows,
  depressionRows,
  reliableLine: reliableLineReading,
  inhibitors: inhibitorRows,
  unknownInhibitor: unknownInhibitorFallback,
  requirement: akasoRequirement,
  nielsenSized: akasoNielsenSizedDose,
  moleFractionSeam: akasoMoleFractionSeam,
  hammerschmidtConstants,
  ceiling: ceilingCoordinates,
  ceilingRefusal,
  shortfallNeeds: SHORTFALL_SWEEP_NEEDS_F,
  shortfallSweep: shortfallSweepRows,
  oneNeedFourFluids: oneNeedFourFluidsRows,
  missingSubcooling: missingSubcoolingFallsOpen,
  diluteLimit: diluteLimitRows,
  depressionSweep: DEPRESSION_SWEEP_WT_PCT,
  leans: LEAN_SWEEP_WT_PCT,
  leanBlend: leanBlendRows,
  akasoLeanBlend,
  injectionRefusals,
  refusals,
});

// ---------------------------------------------------------------------------
// THE TEACHING SURFACE, for the leak guard.
//
// Every accessor a panel or a lesson can reach, by the name a panel reads it
// on. The guard walks these and checks every number that falls out of them
// against the wave's graded field list, so a new accessor is covered the moment
// it is added here, and an accessor that is NOT here is not covered.
// ---------------------------------------------------------------------------

export const teachingAccessors = () => {
  const named = [
    ['publishedConstants', publishedConstants],
    ['hammerschmidtConstants', hammerschmidtConstants],
    ['conductivityRows', conductivityRows],
    ['filmRows', filmRows],
    ['catalogRefusals', catalogRefusals],
    ['publishedUPairRows', publishedUPairRows],
    ['publishedBuildRatios', publishedBuildRatios],
    ['foamShareRows', foamShareRows],
    ['steelShareRows', steelShareRows],
    ['layerLogTerms', layerLogTerms],
    ['stackRefusals', stackRefusals],
    ['foamThicknessRows', foamThicknessRows],
    ['foamLogComparison', foamLogComparison],
    ['insulationMaterialRows', insulationMaterialRows],
    ['insulationMaterialContrast', insulationMaterialContrast],
    ['burialFloor', burialFloor],
    ['burialDepthRows', burialDepthRows],
    ['soilRows', soilRows],
    ['burialCentrelineConvention', burialCentrelineConvention],
    ['droppedTrench', droppedTrench],
    ['refusalAsymmetry', refusalAsymmetry],
    ['referenceInvariant', referenceInvariant],
    ['mixedReferenceRows', mixedReferenceRows],
    ['mixedReferenceHeadline', mixedReferenceHeadline],
    ['publishedMasses', publishedMasses],
    ['massAgainstHeatCapacity', massAgainstHeatCapacity],
    ['publishedFoamMass', publishedFoamMass],
    ['massRefusals', massRefusals],
    ['nanMassDrop', nanMassDrop],
    ['goldenRelaxationRows', goldenRelaxationRows],
    ['relaxationScalings', relaxationScalings],
    ['relaxationByBuildRows', relaxationByBuildRows],
    ['relaxationRefusals', relaxationRefusals],
    ['goldenProfileRows', goldenProfileRows],
    ['ntuSweepRows', ntuSweepRows],
    ['publishedStationRows', publishedStationRows],
    ['stationDropRatio', stationDropRatio],
    ['stationCountRows', stationCountRows],
    ['profileRefusals', profileRefusals],
    ['uForTargetRows', uForTargetRows],
    ['inverseRefusals', inverseRefusals],
    ['publishedCooldown', publishedCooldown],
    ['publishedCooldownStationRows', publishedCooldownStationRows],
    ['stagnantBoreCooldown', stagnantBoreCooldown],
    ['akasoDefinition', akasoDefinition],
    ['akasoReferencePair', akasoReferencePair],
    ['akasoFoamRemoved', akasoFoamRemoved],
    ['akasoSwallowedTrench', akasoSwallowedTrench],
    ['akasoHeatLossOnly', akasoHeatLossOnly],
    ['akasoStationRows', akasoStationRows],
    ['akasoTargetRows', akasoTargetRows],
    ['akasoMasses', akasoMasses],
    ['akasoCooldownPair', akasoCooldownPair],
    ['akasoCooldownStationRows', akasoCooldownStationRows],
    ['akasoBackwardsCooldown', akasoBackwardsCooldown],
    ['akasoCooldownBranches', akasoCooldownBranches],
    ['akasoJouleThomson', akasoJouleThomson],
    ['akasoJtLengthRows', akasoJtLengthRows],
    ['akasoBelowSeabed', akasoBelowSeabed],
    ['goldenInhibitionRows', goldenInhibitionRows],
    ['reliableLineReading', reliableLineReading],
    ['unknownInhibitorFallback', unknownInhibitorFallback],
    ['akasoMoleFractionSeam', akasoMoleFractionSeam],
    ['ceilingRefusal', ceilingRefusal],
    ['shortfallSweepRows', shortfallSweepRows],
    ['oneNeedFourFluidsRows', oneNeedFourFluidsRows],
    ['missingSubcoolingFallsOpen', missingSubcoolingFallsOpen],
    ['diluteLimitRows', diluteLimitRows],
    ['akasoLeanBlend', akasoLeanBlend],
    ['injectionRefusals', injectionRefusals],
  ];
  PUBLISHED_BUILDS.forEach((build) => {
    named.push([`publishedBuildRows ${build}`, () => publishedBuildRows(build)]);
    named.push([`publishedBuildSummary ${build}`, () => publishedBuildSummary(build)]);
    named.push([`referenceRows ${build}`, () => referenceRows(build)]);
  });
  ['methanol', 'meg', 'deg', 'teg'].forEach((id) => {
    named.push([`depressionRows ${id}`, () => depressionRows(id)]);
    named.push([`ceilingCoordinates ${id}`, () => ceilingCoordinates(id)]);
    named.push([`leanBlendRows ${id}`, () => leanBlendRows(id)]);
  });
  ['methanol', 'meg'].forEach((id) => {
    named.push([`akasoRequirement ${id}`, () => akasoRequirement(id)]);
    named.push([`akasoNielsenSizedDose ${id}`, () => akasoNielsenSizedDose(id)]);
  });
  [5, 10, 20, 30, 40, 50].forEach((w) => {
    named.push([`inhibitorRows ${w}`, () => inhibitorRows(w)]);
  });
  ['api', 'lumped'].forEach((reading) => {
    named.push([`akasoCooldownStationRows ${reading}`, () => akasoCooldownStationRows(reading)]);
  });
  return named;
};

/** Every value a panel can reach, labelled by the path a panel reads it on. */
export const teachingQuantities = memoize(() => {
  const rows = [];
  const walk = (v, at) => {
    if (typeof v === 'number' || typeof v === 'boolean' || typeof v === 'string') {
      rows.push({ label: at, value: v });
      return;
    }
    if (Array.isArray(v)) { v.forEach((x, i) => walk(x, `${at}[${i}]`)); return; }
    if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => walk(x, `${at}.${k}`));
  };
  teachingAccessors().forEach(([name, fn]) => walk(fn(), name));
  return rows;
});

/** Every finite number a lesson or a panel can read out of this lab. */
export const teachingNumbers = () => teachingQuantities()
  .map((r) => r.value)
  .filter((v) => typeof v === 'number' && Number.isFinite(v));
