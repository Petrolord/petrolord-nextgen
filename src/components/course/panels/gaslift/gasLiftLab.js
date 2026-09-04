// Teaching lab for PD2, Gas Lift Design. The three panels, the 78 shipped
// lessons and the vitest file all read this one module, so a number shown to a
// learner and a number a test pins cannot drift apart.
//
// Everything here is the vendored engine's own output. Every z, every gradient,
// every column, every spaced depth, every dome charge, every spread, every
// throughput, every unloading verdict and every injection point below is a
// return value from a call into engines/production/gasLiftDesign.js,
// gasLiftValves.js or gasProperties.js over
// test-data/production/goldens/gaslift_cases.json. Nothing in this file
// re-implements the engine. The only arithmetic done here is the arithmetic a
// PANEL would otherwise have to do on the engine's return values: a difference,
// a ratio, an error against a converged reference, a margin between two
// pressures. That arithmetic lives here on purpose, so that a panel is a
// renderer and never a calculator.
//
// UNITS. Field units throughout, as all three engine headers state: pressure
// psia (never psig, never gauge), depth ft TVD, temperature degF, gradient
// psi/ft, gas rate Mscf/d, port and bellows dimensions in and in2, density
// lbm/ft3. The z factor and the port to bellows ratio R are dimensionless.
//
// THREE PROVENANCE RULES THIS FILE EXISTS TO KEEP, all three already stated in
// the wave's teaching digest and all three easy to lose in a panel.
//
//   1. TWO ROADS TO THE SPACING DEPTHS. `spacingRecursionRows` re-runs the
//      recursion standalone, iterate by iterate, so a learner can watch it
//      converge. `designDepthRows` prints what the design itself returned. They
//      agree to about seven significant figures and no further: valve 1 to
//      valve 2 on westTexasOil is 1563.466592902 ft on the first road and
//      1563.466503048 ft on the second. Neither is wrong, the fixed point is
//      stopped at a tolerance rather than solved. The two have DISTINCT names
//      here and a panel must never pair a depth from one with an increment from
//      the other.
//
//   2. TWO RUNS OF THE INJECTION POINT. `injectionPointShipped` is the shipped
//      engine line: the published 1000 ft tabulation AND the injection curve at
//      the engine's own default sample count, which is the answer a user of the
//      studio is handed. `injectionPointTabulationRows` holds the injection
//      column CONVERGED and varies only the tabulation, which isolates the
//      traverse chord. Different residuals, different ratios, the same shipped
//      answer at the shipped spacing. DISTINCT names, and a caption must say
//      which run it is quoting.
//
//   3. TWO CLOSED FORMS FOR THE ISOTHERMAL COLUMN. The textbook coefficient
//      0.01875 and the engine's own AIR_MW / (144 R). The march PARKS against
//      the first, because the two constants differ by 4.43e-4 relative and no
//      amount of refinement removes a difference between two formulations, and
//      it CONVERGES against the second. Both are here because the contrast is
//      the teaching point: a truncation is a thing refinement removes, a
//      formulation gap is not.
//
// THE CAPSTONE BOUNDARY, which is the thing to get right in this file.
//
// Everything above the CAPSTONE section is TEACHING material: the four
// published golden design cases, the published columns, gas properties,
// nitrogen rows, Thornhill and Craver rows and injection point case, sweeps run
// on those published inputs, and two clearly labelled teaching constructs this
// wave designed for itself, the teaching well AKASO-3 and the teaching traverse
// on it. It is free of capstone conditions, and `teachingDigestText()` renders
// exactly what the lesson writers read, line for line.
//
// Everything in the CAPSTONE section is OKPARA-9, the graded well. It exists so
// that the grader and the lessons cannot read two different derivations, and it
// is for the grader, this file's own tests and the migration headers alone.
// Every export down there is named `CAP`, `OKPARA_...`, `okpara...`,
// `CAPSTONE_...`, `capstone...`, `LEAK_GUARD_...` or `leakGuard...`, and the
// guard in gasLiftLab.test.js greps the panel sources for exactly those names.
// A panel that wants what a capstone reader does has a teaching mirror of it:
//
//   okparaCase          ->  publishedDesign / teachingWellDesign
//   okparaColumnStudy   ->  stepRefinementRows / ruleOfThumbRows
//   okparaInjectionPointStudy -> injectionPointTabulationRows / teachingTraverseRefinementRows
//   okparaKnifeEdge     ->  knifeEdgeDecrementRows (the PUBLISHED knife edge)
//   okparaPortLadder    ->  knifeEdgeGasRateRows
//   okparaPpoStudy      ->  ppoDivergence
//
// PURITY AND CACHING. Every accessor is pure and deterministic: no random
// number anywhere, and two calls with the same arguments return equal values.
// Two things ARE cached internally, because both are expensive and both are
// pure functions of their arguments: the converged 20000 step reference columns
// and the four published design runs. The caches hold engine return values and
// every accessor maps them into fresh rows, so a panel cannot mutate one and
// change what another panel sees.

import golden from '@petrolord/engines/test-data/production/goldens/gaslift_cases.json';
import {
  R_OFFSET, AIR_MW, R_UNIVERSAL, toRankine, suttonPseudoCriticals, wichertAziz,
  dakZ, naturalGasZ, N2_CRITICALS, nitrogenZ, gasGradient, gasColumnPressure,
  gasColumnSurfacePressure,
} from '@petrolord/engines/engines/production/gasProperties.js';
import {
  TEST_RACK_TEMP_F, TC_DISCHARGE_COEFF, portArea, portToBellowsRatio,
  domePressureAtTemp, domePressureAt60, temperatureCorrectionFactor,
  ipoOpeningPressure, ipoDomeFromOpening, ppoOpeningPressure, ppoDomeFromOpening,
  testRackOpening, domeFromTestRack, valveSpread, criticalPressureRatio,
  thornhillCraver, selectPort,
} from '@petrolord/engines/engines/production/gasLiftValves.js';
import {
  linearTemperature, injectionPressureCurve, topValveDepth,
  deepestInjectionPoint, spaceValves, valveSetting, unloadingSequence,
  designGasLift,
} from '@petrolord/engines/engines/production/gasLiftDesign.js';

export {
  R_OFFSET, AIR_MW, R_UNIVERSAL, toRankine, suttonPseudoCriticals, wichertAziz,
  dakZ, naturalGasZ, N2_CRITICALS, nitrogenZ, gasGradient, gasColumnPressure,
  gasColumnSurfacePressure,
  TEST_RACK_TEMP_F, TC_DISCHARGE_COEFF, portArea, portToBellowsRatio,
  domePressureAtTemp, domePressureAt60, temperatureCorrectionFactor,
  ipoOpeningPressure, ipoDomeFromOpening, ppoOpeningPressure, ppoDomeFromOpening,
  testRackOpening, domeFromTestRack, valveSpread, criticalPressureRatio,
  thornhillCraver, selectPort,
  linearTemperature, injectionPressureCurve, topValveDepth,
  deepestInjectionPoint, spaceValves, valveSetting, unloadingSequence,
  designGasLift,
};

export const GOLDEN = golden;

// ---------------------------------------------------------------------------
// FORMATTERS. The digest prints a fixed number of decimals or an exponent, and
// `teachingDigestLines()` has to reproduce it character for character, so the
// two formatters live here rather than in the renderer. A panel formats for a
// human and should not use these.
// ---------------------------------------------------------------------------

const f = (x, n = 6) => ((x === null || x === undefined || Number.isNaN(x))
  ? 'n/a' : Number(x).toFixed(n));
const e = (x, n = 4) => ((x === null || x === undefined) ? 'n/a' : Number(x).toExponential(n));

// ---------------------------------------------------------------------------
// THE PUBLISHED THRESHOLDS AND THE CONVENTIONS THE COURSE IS COMPARED AGAINST.
//
// Every band a number in this course is judged against, read off the engine
// source rather than remembered, so no lesson and no panel has to guess where a
// limit came from.
// ---------------------------------------------------------------------------

/** The flat rule of thumb the engine header names as the thing it does not do. */
export const RULE_OF_THUMB_PSI_PER_FT = 0.02;

/** The textbook coefficient in p(D) = pSurf exp(0.01875 sg D / T). */
export const TEXTBOOK_COLUMN_COEFF = 0.01875;

/** The same coefficient built from the engine's own two constants. */
export const ENGINE_COLUMN_COEFF = AIR_MW / (144 * R_UNIVERSAL);

/** The linear dome rule of thumb printed in older manuals, which the engine refuses. */
export const LINEAR_DOME_RULE_SLOPE_PER_F = 0.00215;

/** Ratio of specific heats Thornhill and Craver is published with, in this engine. */
export const TC_K = 1.27;

/** steps hardcoded inside spaceValves, topValveDepth and valveSetting. */
export const ENGINE_SPACING_STEPS = 20;

/** The default sample count of injectionPressureCurve, and so of a plotted design. */
export const ENGINE_CURVE_STEPS = 40;

/** topValveDepth and the spacing recursion both stop at this move, in ft. */
export const FIXED_POINT_TOLERANCE_FT = 0.01;

/** The residual the engine's own jest gate allows deepestInjectionPoint, psi. */
export const INJECTION_POINT_GATE_PSI = 0.5;

/** The converged reference every march in this lab is measured against. */
export const REFERENCE_COLUMN_STEPS = 20000;

export const GAS_LIFT_THRESHOLDS = Object.freeze({
  ruleOfThumbPsiPerFt: RULE_OF_THUMB_PSI_PER_FT,
  textbookColumnCoeff: TEXTBOOK_COLUMN_COEFF,
  engineColumnCoeff: ENGINE_COLUMN_COEFF,
  spacingSteps: ENGINE_SPACING_STEPS,
  curveSteps: ENGINE_CURVE_STEPS,
  fixedPointToleranceFt: FIXED_POINT_TOLERANCE_FT,
  injectionPointGatePsi: INJECTION_POINT_GATE_PSI,
  testRackTempF: TEST_RACK_TEMP_F,
  dischargeCoefficient: TC_DISCHARGE_COEFF,
  criticalPressureRatio: criticalPressureRatio(TC_K),
});

// ---------------------------------------------------------------------------
// SHARED PLUMBING.
// ---------------------------------------------------------------------------

/** The geotherm of a published design or column case, as the engine builds it. */
export const temperatureOf = (i) => linearTemperature({
  whtF: i.wht ?? i.whtF, bhtF: i.bht ?? i.bhtF, refDepthFt: i.refDepth ?? i.refDepthFt,
});

/**
 * The golden's stored inputs adapted to what `designGasLift` takes: a
 * temperature FUNCTION and a port catalogue of objects rather than bare bores.
 */
export const adaptDesignInputs = (i) => ({
  ...i,
  tempAtDepthF: temperatureOf(i),
  ports: i.ports.map((idIn) => ({ idIn, label: String(idIn) })),
});

/** The four published design cases, by id, in the order the golden publishes them. */
export const PUBLISHED_DESIGN_IDS = Object.freeze(golden.designs.map((g) => g.id));

/** The golden record of one published design. */
export const publishedDesignRecord = (id) => golden.designs.find((g) => g.id === id);

/**
 * Memoise a pure function on a JSON key. Used only where a call is expensive
 * and its arguments are plain data: the design sweeps, the two chord
 * refinements and the digest itself are each asked for by more than one caller,
 * and every one of them is a pure function of the published inputs.
 */
const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) cache.set(key, fn(...args));
    return cache.get(key);
  };
};

const designCache = new Map();

/**
 * The shipped engine re-run on one published design's own inputs. Cached
 * because it is called from a dozen accessors and it is a pure function of the
 * published inputs.
 */
export const publishedDesign = (id) => {
  if (!designCache.has(id)) {
    designCache.set(id, designGasLift(adaptDesignInputs(publishedDesignRecord(id).inputs)));
  }
  return designCache.get(id);
};

/** The same design re-run with one input overridden. A sweep point, not a published case. */
export const designVariant = memoize((id, over) => designGasLift(
  adaptDesignInputs({ ...publishedDesignRecord(id).inputs, ...over }),
));

const refCache = new Map();

/**
 * A CONVERGED COLUMN REFERENCE. One 20000 step march per labelled column, read
 * back by linear interpolation between adjacent samples. The sample spacing is
 * under half a foot, so the interpolation error is orders of magnitude below
 * anything measured against it. This is the ruler; nothing in the course claims
 * it is a physical truth, only that it is far finer than the marches it judges.
 */
export const referenceColumn = (pSurfPsia, tvdFt, gasSg, tempAtDepthF, key) => {
  const kk = `${key}|${pSurfPsia}|${tvdFt}|${gasSg}`;
  if (!refCache.has(kk)) {
    refCache.set(kk, gasColumnPressure({
      pSurfPsia, tvdFt, gasSg, tempAtDepthF, steps: REFERENCE_COLUMN_STEPS,
    }).profile);
  }
  const prof = refCache.get(kk);
  const n = prof.length - 1;
  return (d) => {
    if (!(d > 0)) return prof[0].pPsia;
    if (d >= tvdFt) return prof[n].pPsia;
    const x = (d / tvdFt) * n;
    const j = Math.floor(x);
    return prof[j].pPsia + (x - j) * (prof[j + 1].pPsia - prof[j].pPsia);
  };
};

// ===========================================================================
// ASSOCIATE TIER: THE GAS COLUMN.
//
// Why a dead well is full of kill fluid, what the engine models and what it
// refuses, the real gas column in the annulus, z at pressure and temperature,
// why the gradient is not the 0.02 psi/ft rule of thumb, marching down and
// marching back up, the three straight lines, the top valve, and one honest
// negative result: this column converges.
// ===========================================================================

// --------------------------------------------------------------- gas properties

/** The five published gas property rows, as the oracle cut them. */
export const goldenGasPropertyRows = () => golden.gasProperties.map((r) => ({
  gasSg: r.gasSg,
  pPsia: r.pPsia,
  tF: r.tF,
  z: r.z,
  gradPsiPerFt: r.gradPsiPerFt,
}));

/** The shipped engine on the same five rows, with the difference from the golden. */
export const engineGasPropertyRows = () => golden.gasProperties.map((r) => {
  const z = naturalGasZ({ pPsia: r.pPsia, tF: r.tF, gasSg: r.gasSg });
  const gradPsiPerFt = gasGradient({ pPsia: r.pPsia, tF: r.tF, gasSg: r.gasSg });
  return {
    gasSg: r.gasSg,
    pPsia: r.pPsia,
    tF: r.tF,
    z,
    gradPsiPerFt,
    zDiffFromGolden: z - r.z,
    goldenZ: r.z,
    goldenGradPsiPerFt: r.gradPsiPerFt,
  };
});

/** The published acid gas row, with the Wichert and Aziz correction opened up. */
export const acidGasRows = () => golden.gasPropertiesAcid.map((r) => {
  const raw = suttonPseudoCriticals(r.gasSg);
  const wa = wichertAziz({ ...raw, yCo2: r.yCo2, yH2s: r.yH2s });
  return {
    gasSg: r.gasSg,
    pPsia: r.pPsia,
    tF: r.tF,
    yCo2: r.yCo2,
    yH2s: r.yH2s,
    goldenZ: r.z,
    cleanZ: naturalGasZ({ pPsia: r.pPsia, tF: r.tF, gasSg: r.gasSg }),
    epsilonR: wa.epsilon,
    correctedTpcR: wa.tpcR,
    correctedPpcPsia: wa.ppcPsia,
    uncorrectedTpcR: raw.tpcR,
    uncorrectedPpcPsia: raw.ppcPsia,
  };
});

// --------------------------------------------------------------- the columns

/** The three published columns, marched down and inverted back up. */
export const goldenColumnRows = () => golden.columns.map((c, i) => {
  const T = linearTemperature({ whtF: c.whtF, bhtF: c.bhtF, refDepthFt: c.tvdFt });
  const engineBottomPsia = gasColumnPressure({
    pSurfPsia: c.pSurfPsia, tvdFt: c.tvdFt, gasSg: c.gasSg, tempAtDepthF: T, steps: 40,
  }).pBottomPsia;
  const engineSurfacePsia = gasColumnSurfacePressure({
    pAtDepthPsia: c.pBottomPsia, tvdFt: c.tvdFt, gasSg: c.gasSg, tempAtDepthF: T, steps: 40,
  });
  return {
    index: i + 1,
    pSurfPsia: c.pSurfPsia,
    tvdFt: c.tvdFt,
    gasSg: c.gasSg,
    whtF: c.whtF,
    bhtF: c.bhtF,
    goldenBottomPsia: c.pBottomPsia,
    goldenSurfaceFromBottomPsia: c.surfaceFromBottom,
    roundTripClosurePsi: c.surfaceFromBottom - c.pSurfPsia,
    engineBottomPsia,
    engineBottomDiffPsi: engineBottomPsia - c.pBottomPsia,
    engineSurfacePsia,
    engineSurfaceDiffPsi: engineSurfacePsia - c.surfaceFromBottom,
    totalLiftPsi: c.pBottomPsia - c.pSurfPsia,
    averageGradientPsiPerFt: (c.pBottomPsia - c.pSurfPsia) / c.tvdFt,
  };
});

/** How many depths the rule of thumb comparison is printed at, per column. */
export const RULE_OF_THUMB_STATIONS = 10;

const columnProfile = (c, tempAtDepthF, steps) => gasColumnPressure({
  pSurfPsia: c.pSurfPsia, tvdFt: c.tvdFt, gasSg: c.gasSg, tempAtDepthF, steps,
}).profile;

/**
 * The real gas column against the flat 0.02 psi/ft rule of thumb, at eleven
 * depths down one published column. PLOT READY: depth on one axis, two
 * pressures and a gradient ratio on the other.
 *
 * The rule errs in BOTH directions and a caption must say so. It reads LOW on
 * the 1414.7 psia column, whose local gradient is close to twice the rule, and
 * HIGH on the 614.7 psia one, where the gradient is about a third below it. A
 * flat rule has no pressure in it at all.
 */
export const ruleOfThumbRows = (index) => {
  const c = golden.columns[index - 1];
  const T = linearTemperature({ whtF: c.whtF, bhtF: c.bhtF, refDepthFt: c.tvdFt });
  const prof = columnProfile(c, T, 2000);
  const rows = [];
  for (let k = 0; k <= RULE_OF_THUMB_STATIONS; k += 1) {
    const tvdFt = (c.tvdFt * k) / RULE_OF_THUMB_STATIONS;
    const row = prof[Math.round((tvdFt / c.tvdFt) * (prof.length - 1))];
    const flatPsia = c.pSurfPsia + RULE_OF_THUMB_PSI_PER_FT * tvdFt;
    rows.push({
      index,
      pSurfPsia: c.pSurfPsia,
      gasSg: c.gasSg,
      tvdFt,
      enginePsia: row.pPsia,
      flatPsia,
      ruleErrorPsi: flatPsia - row.pPsia,
      localGradientPsiPerFt: row.gradPsiPerFt,
      gradientOverRule: row.gradPsiPerFt / RULE_OF_THUMB_PSI_PER_FT,
      z: row.z,
      tF: row.tF,
    });
  }
  return rows;
};

/**
 * The one comparison that settles the course's corrected result. The geothermal
 * column and the SAME column held at its wellhead temperature, side by side.
 * With the temperature moving the local gradient FALLS with depth on all three
 * published columns; with it held the gradient RISES, which is compression on
 * its own. The gradient grows with PRESSURE. Whether it grows with DEPTH is a
 * race, and it has to be computed rather than assumed.
 */
export const ruleOfThumbSummary = (index) => {
  const c = golden.columns[index - 1];
  const T = linearTemperature({ whtF: c.whtF, bhtF: c.bhtF, refDepthFt: c.tvdFt });
  const prof = columnProfile(c, T, 2000);
  const iso = gasColumnPressure({
    pSurfPsia: c.pSurfPsia, tvdFt: c.tvdFt, gasSg: c.gasSg, tempAtDepthF: () => c.whtF, steps: 2000,
  }).profile;
  const top = prof[0];
  const bot = prof[prof.length - 1];
  const isoTop = iso[0];
  const isoBot = iso[iso.length - 1];
  const flatAtBottomPsia = c.pSurfPsia + RULE_OF_THUMB_PSI_PER_FT * c.tvdFt;
  return {
    index,
    pSurfPsia: c.pSurfPsia,
    tvdFt: c.tvdFt,
    gasSg: c.gasSg,
    surfaceGradientPsiPerFt: top.gradPsiPerFt,
    bottomGradientPsiPerFt: bot.gradPsiPerFt,
    gradientChangePct: 100 * (bot.gradPsiPerFt / top.gradPsiPerFt - 1),
    surfaceZ: top.z,
    bottomZ: bot.z,
    surfaceTempF: top.tF,
    bottomTempF: bot.tF,
    isothermalTempF: c.whtF,
    isothermalSurfaceGradientPsiPerFt: isoTop.gradPsiPerFt,
    isothermalBottomGradientPsiPerFt: isoBot.gradPsiPerFt,
    isothermalGradientChangePct: 100 * (isoBot.gradPsiPerFt / isoTop.gradPsiPerFt - 1),
    isothermalBottomPsia: isoBot.pPsia,
    isothermalMinusGeothermalPsi: isoBot.pPsia - bot.pPsia,
    flatAtBottomPsia,
    flatMissAtBottomPsi: flatAtBottomPsia - bot.pPsia,
    flatMissAsPctOfLift: (Math.abs(flatAtBottomPsia - bot.pPsia) / (bot.pPsia - c.pSurfPsia)) * 100,
    gradientFallsWithDepth: bot.gradPsiPerFt < top.gradPsiPerFt,
    isothermalGradientRisesWithDepth: isoBot.gradPsiPerFt > isoTop.gradPsiPerFt,
  };
};

/**
 * THE SAME COMPARISON AS `ruleOfThumbSummary`, AT EVERY STATION RATHER THAN AT
 * THE TWO ENDS.
 *
 * `ruleOfThumbSummary` reports the local gradient at surface and at the packer
 * and the same two on the isothermal control, which is enough to state the
 * result and not enough to DRAW it. The argument of the course is two curves on
 * one plot, one with the temperature moving and one with it held, so the pair
 * has to exist at every station the plot has.
 *
 * The control is the SAME column with the SAME surface pressure, the SAME
 * gravity and the SAME march, and the only thing changed is that the
 * temperature is held at the wellhead value. That is what makes it a control:
 * the difference between the two curves is the geotherm and nothing else.
 *
 * It reports the two GRADIENTS and not the two pressures. The geothermal
 * pressures are already on `ruleOfThumbRows` and the isothermal pressure at the
 * packer is already on `ruleOfThumbSummary`, so publishing an isothermal
 * pressure at every station adds no teaching value and does cost something: the
 * isothermal station at 800 ft on published column 2 lands 45 grading bands from
 * a graded capstone pressure, where the closest any other teaching number comes
 * is 183. The leak gate would still pass. Keeping the distance is free, so keep
 * it.
 */
export const isothermalControlRows = (index) => {
  const c = golden.columns[index - 1];
  const T = linearTemperature({ whtF: c.whtF, bhtF: c.bhtF, refDepthFt: c.tvdFt });
  const prof = columnProfile(c, T, 2000);
  const iso = gasColumnPressure({
    pSurfPsia: c.pSurfPsia, tvdFt: c.tvdFt, gasSg: c.gasSg, tempAtDepthF: () => c.whtF, steps: 2000,
  }).profile;
  const rows = [];
  for (let k = 0; k <= RULE_OF_THUMB_STATIONS; k += 1) {
    const tvdFt = (c.tvdFt * k) / RULE_OF_THUMB_STATIONS;
    const at = Math.round((tvdFt / c.tvdFt) * (prof.length - 1));
    const g = prof[at];
    const i = iso[at];
    rows.push({
      index,
      tvdFt,
      pSurfPsia: c.pSurfPsia,
      gasSg: c.gasSg,
      geothermalPsia: g.pPsia,
      geothermalGradientPsiPerFt: g.gradPsiPerFt,
      isothermalGradientPsiPerFt: i.gradPsiPerFt,
      ruleGradientPsiPerFt: RULE_OF_THUMB_PSI_PER_FT,
      geothermalTempF: g.tF,
      isothermalTempF: i.tF,
      geothermalZ: g.z,
      isothermalZ: i.z,
      isothermalLessGeothermalGradientPsiPerFt: i.gradPsiPerFt - g.gradPsiPerFt,
    });
  }
  return rows;
};

// --------------------------------------------------------------- the refinement study

/** The step counts the refinement study walks. Contiguous, so a ratio column is readable. */
export const REFINEMENT_STEPS = Object.freeze([1, 2, 4, 5, 10, 20, 40, 80, 160, 320, 640, 1280]);

/** The six columns the refinement study is run on: three published, three at a packer. */
export const refinementTargets = () => {
  const out = golden.columns.map((c, i) => ({
    label: `published column ${i + 1}`,
    pSurfPsia: c.pSurfPsia,
    tvdFt: c.tvdFt,
    gasSg: c.gasSg,
    tempAtDepthF: linearTemperature({ whtF: c.whtF, bhtF: c.bhtF, refDepthFt: c.tvdFt }),
  }));
  golden.designs.forEach((g) => {
    out.push({
      label: `published design ${g.id} at its packer`,
      pSurfPsia: g.inputs.pKickoffPsia,
      tvdFt: g.inputs.maxDepthFt,
      gasSg: g.inputs.gasSg,
      tempAtDepthF: temperatureOf(g.inputs),
    });
  });
  return out;
};

/**
 * The honest negative result, made watchable. The march is a predictor with a
 * trapezoidal corrector on the gradient, so it is second order: every doubling
 * of the step count cuts the remaining error by about four. The RATIO column is
 * what makes that checkable rather than assertable, and it runs over a
 * contiguous slice of the step sequence.
 */
export const stepRefinementRows = (target) => {
  const ref = referenceColumn(
    target.pSurfPsia, target.tvdFt, target.gasSg, target.tempAtDepthF, target.label,
  )(target.tvdFt);
  let prevErr = null;
  return REFINEMENT_STEPS.map((steps) => {
    const pPsia = gasColumnPressure({
      pSurfPsia: target.pSurfPsia, tvdFt: target.tvdFt, gasSg: target.gasSg,
      tempAtDepthF: target.tempAtDepthF, steps,
    }).pBottomPsia;
    const errorPsi = pPsia - ref;
    const errorRatio = (prevErr === null || errorPsi === 0) ? null : prevErr / errorPsi;
    prevErr = errorPsi;
    return {
      label: target.label, steps, pPsia, errorPsi, errorRatio, referencePsia: ref,
    };
  });
};

/** The headline of one refinement block: the step count the engine actually uses. */
export const stepRefinementHeadline = (target) => {
  const ref = referenceColumn(
    target.pSurfPsia, target.tvdFt, target.gasSg, target.tempAtDepthF, target.label,
  )(target.tvdFt);
  const at = (steps) => gasColumnPressure({
    pSurfPsia: target.pSurfPsia, tvdFt: target.tvdFt, gasSg: target.gasSg,
    tempAtDepthF: target.tempAtDepthF, steps,
  }).pBottomPsia;
  const p20 = at(20);
  const p2000 = at(2000);
  return {
    label: target.label,
    at20StepsPsia: p20,
    at2000StepsPsia: p2000,
    spreadPsi: p20 - p2000,
    liftPsi: ref - target.pSurfPsia,
    spreadAsFractionOfLift: (p20 - p2000) / (ref - target.pSurfPsia),
  };
};

// --------------------------------------------------------------- the chord bias

/** The sample counts the injection pressure curve is tabulated at. */
export const CHORD_SAMPLE_COUNTS = Object.freeze([4, 8, 16, 32, 64, 128, 256, 512, 1024]);

/**
 * `injectionPressureCurve` tabulates the march and then reads any depth by
 * STRAIGHT LINE between two samples. Three numbers per row and they mean
 * different things: the deviation AT a sample is pure march truncation, the
 * deviation BETWEEN samples is truncation plus chord, and the CHORD COMPONENT
 * is the second less the average of the two bracketing nodes, which isolates
 * the straight line from the march. The chord component is NEGATIVE on these
 * columns, because their gradient falls slightly with depth, so the pressure
 * curve is concave and a chord under a concave curve reads low.
 */
export const chordBiasRows = memoize((index) => {
  const c = golden.columns[index - 1];
  const T = linearTemperature({ whtF: c.whtF, bhtF: c.bhtF, refDepthFt: c.tvdFt });
  const ref = referenceColumn(c.pSurfPsia, c.tvdFt, c.gasSg, T, `published column ${index}`);
  return CHORD_SAMPLE_COUNTS.map((n) => {
    const cur = injectionPressureCurve({
      pSurfPsia: c.pSurfPsia, gasSg: c.gasSg, tempAtDepthF: T, maxDepthFt: c.tvdFt, steps: n,
    });
    let worstPsi = 0;
    let worstAtFt = 0;
    const m = 200;
    for (let k = 1; k < m; k += 1) {
      const d = (c.tvdFt * k) / m;
      const bias = cur.at(d) - ref(d);
      if (Math.abs(bias) > Math.abs(worstPsi)) { worstPsi = bias; worstAtFt = d; }
    }
    const h = c.tvdFt / n;
    const jNode = Math.floor(n / 2);
    const nodeFt = jNode * h;
    const nextNodeFt = (jNode + 1) * h;
    const midFt = nodeFt + h / 2;
    const atNodePsi = cur.at(nodeFt) - ref(nodeFt);
    const atNextNodePsi = cur.at(nextNodeFt) - ref(nextNodeFt);
    const betweenPsi = cur.at(midFt) - ref(midFt);
    return {
      index,
      pSurfPsia: c.pSurfPsia,
      tvdFt: c.tvdFt,
      samples: n,
      sampleSpacingFt: h,
      worstPsi,
      worstAtFt,
      nodeFt,
      atNodePsi,
      midFt,
      betweenPsi,
      chordComponentPsi: betweenPsi - 0.5 * (atNodePsi + atNextNodePsi),
    };
  });
});

// --------------------------------------------------------------- the two closed forms

/**
 * THE THREE REFERENCES AGAINST ONE MARCH. The textbook coefficient is a rounded
 * 0.01875; the engine's own is AIR_MW / (144 R). They differ by 4.43e-4
 * relative, so the march CANNOT converge onto the textbook form and its error
 * against it PARKS at a floor that refinement never removes. Against the
 * engine-constant form the march converges properly.
 */
export const closedFormCoefficients = () => ({
  airMolarMass: AIR_MW,
  gasConstant: R_UNIVERSAL,
  textbookCoeff: TEXTBOOK_COLUMN_COEFF,
  engineCoeff: ENGINE_COLUMN_COEFF,
  relativeDifference: (TEXTBOOK_COLUMN_COEFF - ENGINE_COLUMN_COEFF) / ENGINE_COLUMN_COEFF,
});

/** The three isothermal cases the closed form gate is run on. */
export const CLOSED_FORM_CASES = Object.freeze([
  { pSurfPsia: 1014.7, tvdFt: 8000, gasSg: 0.65, tF: 140 },
  { pSurfPsia: 1414.7, tvdFt: 11000, gasSg: 0.7, tF: 175 },
  { pSurfPsia: 614.7, tvdFt: 4000, gasSg: 0.6, tF: 115 },
]);

/** The step counts the closed form gate refines through. */
export const CLOSED_FORM_STEPS = Object.freeze([2, 10, 40, 200, 2000]);

/** One isothermal case: both closed forms, and the march refined against each. */
export const closedFormCase = (c) => {
  const textbookPsia = c.pSurfPsia
    * Math.exp((TEXTBOOK_COLUMN_COEFF * c.gasSg * c.tvdFt) / (c.tF + R_OFFSET));
  const enginePsia = c.pSurfPsia
    * Math.exp((ENGINE_COLUMN_COEFF * c.gasSg * c.tvdFt) / (c.tF + R_OFFSET));
  return {
    ...c,
    textbookPsia,
    enginePsia,
    formDifferencePsi: textbookPsia - enginePsia,
    marches: CLOSED_FORM_STEPS.map((steps) => {
      const pPsia = gasColumnPressure({
        pSurfPsia: c.pSurfPsia, tvdFt: c.tvdFt, gasSg: c.gasSg,
        tempAtDepthF: () => c.tF, steps, zOverride: 1,
      }).pBottomPsia;
      return {
        steps,
        pPsia,
        errorAgainstTextbookPsi: pPsia - textbookPsia,
        errorAgainstEnginePsi: pPsia - enginePsia,
      };
    }),
  };
};

/** All three isothermal cases. */
export const closedFormRows = () => CLOSED_FORM_CASES.map(closedFormCase);

// --------------------------------------------------------------- the top valve

/** How many iterates the top valve fixed point is shown for. */
export const TOP_VALVE_MAX_ITERATES = 8;

/**
 * The fixed point that finds valve 1, iterate by iterate. Valve 1 sits where
 * the injection line first overcomes a full column of kill fluid above the
 * unloading wellhead pressure. The depth depends on the injection pressure
 * which depends on the depth, so the engine iterates. Iterate 0 is the answer
 * you would get if gas were weightless, and the sequence shows exactly what the
 * weight of the gas buys.
 */
export const topValveIteration = (id) => {
  const g = publishedDesignRecord(id);
  const i = g.inputs;
  const T = temperatureOf(i);
  const floor = i.maxDepthFt;
  const weightlessFt = Math.min(
    Math.max((i.pKickoffPsia - i.pWhUnloadPsia) / i.killGradPsiPerFt, 0), floor,
  );
  let d = weightlessFt;
  const iterates = [];
  for (let k = 1; k <= TOP_VALVE_MAX_ITERATES; k += 1) {
    const pInjPsia = gasColumnPressure({
      pSurfPsia: i.pKickoffPsia, tvdFt: d, gasSg: i.gasSg, tempAtDepthF: T,
      steps: ENGINE_SPACING_STEPS,
    }).pBottomPsia;
    const nextFt = Math.min(Math.max((pInjPsia - i.pWhUnloadPsia) / i.killGradPsiPerFt, 0), floor);
    iterates.push({ iterate: k, atFt: d, pInjPsia, nextFt, moveFt: nextFt - d });
    if (Math.abs(nextFt - d) < FIXED_POINT_TOLERANCE_FT) { d = nextFt; break; }
    d = nextFt;
  }
  const engineFt = topValveDepth({
    pKickoffPsia: i.pKickoffPsia, pWhUnloadPsia: i.pWhUnloadPsia,
    killGradPsiPerFt: i.killGradPsiPerFt, gasSg: i.gasSg, tempAtDepthF: T,
    maxDepthFt: i.maxDepthFt,
  });
  return {
    id,
    pKickoffPsia: i.pKickoffPsia,
    pWhUnloadPsia: i.pWhUnloadPsia,
    killGradPsiPerFt: i.killGradPsiPerFt,
    weightlessFt,
    iterates,
    engineFt,
    publishedValve1Ft: g.depths[0],
    gasWeightBuysFt: engineFt - weightlessFt,
    gasWeightBuysPct: 100 * (engineFt / weightlessFt - 1),
  };
};

/** The four sweeps that say what moves the top valve, on published westTexasOil inputs. */
export const TOP_VALVE_SWEEPS = Object.freeze({
  pKickoffPsia: [864.7, 914.7, 964.7, 1014.7, 1064.7, 1114.7, 1164.7],
  pWhUnloadPsia: [64.7, 89.7, 114.7, 139.7, 164.7, 214.7],
  killGradPsiPerFt: [0.35, 0.40, 0.45, 0.50, 0.55, 0.60],
  gasSg: [0.55, 0.60, 0.65, 0.70, 0.75, 0.80],
});

/** One input walked at a time, all others held at the published westTexasOil values. */
export const topValveSweepRows = (which, values = TOP_VALVE_SWEEPS[which]) => {
  const i = publishedDesignRecord('westTexasOil').inputs;
  const T = temperatureOf(i);
  return values.map((value) => ({
    which,
    value,
    topValveFt: topValveDepth({
      pKickoffPsia: which === 'pKickoffPsia' ? value : i.pKickoffPsia,
      pWhUnloadPsia: which === 'pWhUnloadPsia' ? value : i.pWhUnloadPsia,
      killGradPsiPerFt: which === 'killGradPsiPerFt' ? value : i.killGradPsiPerFt,
      gasSg: which === 'gasSg' ? value : i.gasSg,
      tempAtDepthF: T,
      maxDepthFt: i.maxDepthFt,
    }),
  }));
};

// --------------------------------------------------------------- the three lines

/** How many stations the three straight lines are drawn at. */
export const THREE_LINE_STATIONS = 24;

/**
 * The three straight lines of the classic construction on one depth pressure
 * plot, with the top valve where the injection line first beats the unloading
 * line. PLOT READY: one row per depth, three pressures on it.
 *
 * The injection line is not straight at all, which is the point of drawing it
 * beside two that are: it is the real gas column, and the course's whole first
 * tier is about what that costs.
 */
export const threeLineRows = (id, stations = THREE_LINE_STATIONS) => {
  const i = publishedDesignRecord(id).inputs;
  const T = temperatureOf(i);
  const curve = injectionPressureCurve({
    pSurfPsia: i.pKickoffPsia, gasSg: i.gasSg, tempAtDepthF: T,
    maxDepthFt: i.maxDepthFt, steps: ENGINE_CURVE_STEPS,
  });
  const rows = [];
  for (let k = 0; k <= stations; k += 1) {
    const tvdFt = (i.maxDepthFt * k) / stations;
    rows.push({
      tvdFt,
      injectionPsia: curve.at(tvdFt),
      unloadingPsia: i.pWhUnloadPsia + i.killGradPsiPerFt * tvdFt,
      transferPsia: i.pWhUnloadPsia + i.unloadGradPsiPerFt * tvdFt,
    });
  }
  return rows;
};

/** Where the injection line and the unloading line meet: valve 1. */
export const threeLineCrossing = (id) => {
  const t = topValveIteration(id);
  const i = publishedDesignRecord(id).inputs;
  return {
    id,
    tvdFt: t.engineFt,
    injectionPsia: gasColumnPressure({
      pSurfPsia: i.pKickoffPsia, tvdFt: t.engineFt, gasSg: i.gasSg,
      tempAtDepthF: temperatureOf(i), steps: ENGINE_SPACING_STEPS,
    }).pBottomPsia,
    unloadingPsia: i.pWhUnloadPsia + i.killGradPsiPerFt * t.engineFt,
    transferPsia: i.pWhUnloadPsia + i.unloadGradPsiPerFt * t.engineFt,
  };
};

// ===========================================================================
// PROFESSIONAL TIER: THE VALVES.
//
// Spacing as a recursion, the surface decrement, the transfer differential, the
// two spacing conventions as one recursion with a different decrement, the
// valve as dome plus bellows plus port, the port to bellows ratio, a dome as a
// thermometer, the test rack opening, IPO against PPO, the closing test, spread
// and throughput by Thornhill and Craver with port selection.
// ===========================================================================

// --------------------------------------------------------------- the dome

/**
 * The four published nitrogen rows, with the linear rule of thumb beside the
 * real gas answer. A dome charge is a THERMOMETER as much as a spring: at a
 * fixed 60 degF charge the pressure the valve feels rises with valve depth
 * because the valve gets hotter, and the rule of thumb drifts further the
 * hotter and the deeper it gets.
 */
export const nitrogenRows = () => golden.nitrogen.map((r) => {
  const engineDomeAtTempPsia = domePressureAtTemp({ pd60Psia: r.pd60Psia, tF: r.tF });
  const engineBackTo60Psia = domePressureAt60({ pdTPsia: r.domeAtTempPsia, tF: r.tF });
  const engineCt = temperatureCorrectionFactor({ pdTPsia: r.domeAtTempPsia, tF: r.tF });
  const linearCt = 1 / (1 + LINEAR_DOME_RULE_SLOPE_PER_F * (r.tF - TEST_RACK_TEMP_F));
  return {
    pd60Psia: r.pd60Psia,
    tF: r.tF,
    goldenDomeAtTempPsia: r.domeAtTempPsia,
    goldenCt: r.ct,
    goldenZ60: r.z60,
    goldenZt: r.zT,
    engineDomeAtTempPsia,
    engineDomeDiffPsi: engineDomeAtTempPsia - r.domeAtTempPsia,
    engineBackTo60Psia,
    engineInverseDiffPsi: engineBackTo60Psia - r.pd60Psia,
    engineCt,
    engineCtDiff: engineCt - r.ct,
    linearCt,
    linearCtErrror: linearCt - r.ct,
    linearCtErrorPct: (100 * (linearCt - r.ct)) / r.ct,
    linearDomePsia: r.pd60Psia / linearCt,
    linearDomeMissPsi: r.pd60Psia / linearCt - r.domeAtTempPsia,
  };
});

// --------------------------------------------------------------- throughput

/** The four published Thornhill and Craver rows, engine beside oracle. */
export const thornhillCraverRows = () => golden.thornhillCraver.map((r) => {
  const engine = thornhillCraver({
    pUpPsia: r.pUpPsia, pDnPsia: r.pDnPsia, portIdIn: r.portIdIn, gasSg: r.gasSg, tF: r.tF,
  });
  return {
    portIdIn: r.portIdIn,
    pUpPsia: r.pUpPsia,
    pDnPsia: r.pDnPsia,
    gasSg: r.gasSg,
    tF: r.tF,
    goldenQMscfd: r.qMscfd,
    goldenCriticalRatio: r.criticalRatio,
    engineQMscfd: engine.qMscfd,
    engineDiffMscfd: engine.qMscfd - r.qMscfd,
    ratio: engine.ratio,
    regime: engine.regime,
    areaIn2: engine.areaIn2,
  };
});

/** The pressure ratios the regime sweep walks, including the critical one exactly. */
export const THROUGHPUT_REGIME_RATIOS = Object.freeze([
  0.10, 0.20, 0.30, 0.40, 0.50, 0.551208317714, 0.60, 0.70, 0.80, 0.90, 0.95, 0.98, 0.999,
]);

/**
 * One port, one upstream pressure, the downstream walked from choked to nearly
 * balanced. THE POINT: below the critical ratio the rate does not change at all
 * as the downstream pressure falls, so a throughput quoted without its regime
 * is half a statement.
 */
export const throughputRegimeRows = (ratios = THROUGHPUT_REGIME_RATIOS) => {
  const base = golden.thornhillCraver[0];
  return ratios.map((ratio) => {
    const pDnPsia = base.pUpPsia * ratio;
    const r = thornhillCraver({
      pUpPsia: base.pUpPsia, pDnPsia, portIdIn: base.portIdIn, gasSg: base.gasSg, tF: base.tF,
    });
    return {
      portIdIn: base.portIdIn,
      pUpPsia: base.pUpPsia,
      tF: base.tF,
      gasSg: base.gasSg,
      pDnPsia,
      ratio,
      qMscfd: r.qMscfd,
      regime: r.regime,
    };
  });
};

/** The two bellows sizes the published cases use. */
export const BELLOWS_AREAS_IN2 = Object.freeze([0.31, 0.77]);

/** The eleven catalogue bores the published port ladders are drawn from. */
export const CATALOGUE_PORTS_IN = Object.freeze([
  0.125, 0.15625, 0.1875, 0.21875, 0.25, 0.3125, 0.375, 0.4375, 0.5, 0.625, 0.75,
]);

/** R = Ap / Ab across both bellows families, with the 1 / (1 - R) amplifier beside it. */
export const portGeometryRows = () => {
  const rows = [];
  BELLOWS_AREAS_IN2.forEach((bellowsAreaIn2) => {
    CATALOGUE_PORTS_IN.forEach((portIdIn) => {
      const r = portToBellowsRatio({ portIdIn, bellowsAreaIn2 });
      rows.push({
        portIdIn,
        areaIn2: portArea(portIdIn),
        bellowsAreaIn2,
        r,
        oneOverOneMinusR: 1 / (1 - r),
      });
    });
  });
  return rows;
};

// --------------------------------------------------------------- the four designs

/** The published inputs of one design, as the golden stores them. */
export const designInputs = (id) => publishedDesignRecord(id).inputs;

/**
 * THE DEPTHS THE DESIGN ITSELF RETURNED, road two of the two roads to a spacing
 * depth. Pair these with `designSpacingIncrements`, never with the standalone
 * recursion in `spacingRecursionRows`.
 */
export const designDepthRows = (id) => {
  const g = publishedDesignRecord(id);
  return g.depths.map((depthFt, k) => ({
    valve: k + 1,
    depthFt,
    surfacePressurePsia: g.surfacePressures[k],
  }));
};

/** The increments of the design's own depths. Road two. */
export const designSpacingIncrements = (id) => {
  const g = publishedDesignRecord(id);
  return g.depths.slice(1).map((depthFt, k) => ({
    from: k + 1,
    to: k + 2,
    incrementFt: depthFt - g.depths[k],
    minSpacingFt: g.inputs.minSpacingFt,
  }));
};

/** The shipped engine on the published inputs, against the golden depths. */
export const designAgreement = (id) => {
  const g = publishedDesignRecord(id);
  const r = publishedDesign(id);
  return {
    id,
    goldenStopReason: g.stopReason,
    engineStopReason: r.stopReason,
    goldenValveCount: g.depths.length,
    engineValveCount: r.depths.length,
    largestDepthDiffFt: Math.max(...r.depths.map((d, k) => Math.abs(d - g.depths[k]))),
    pOperatingPsia: r.pOperatingPsia,
    warningCodes: r.warnings.map((x) => x.code),
    warnings: r.warnings.map((x) => ({ code: x.code, message: x.message })),
  };
};

/** Every published valve of one design, golden beside engine. */
export const designValveRows = (id) => {
  const g = publishedDesignRecord(id);
  const r = publishedDesign(id);
  return g.valves.map((v, k) => {
    const ev = r.valves[k];
    const diffKeys = [
      'pInjAtDepthPsia', 'domeAtTempPsia', 'dome60Psia', 'testRackOpeningPsia',
      'spreadPsi', 'closingSurfacePressurePsia', 'throughputMscfd',
    ];
    return {
      valve: k + 1,
      depthFt: v.depthFt,
      tempF: v.tempF,
      valveType: v.valveType,
      portIdIn: v.portIdIn,
      pInjAtDepthPsia: v.pInjAtDepthPsia,
      pProdAtDepthPsia: v.pProdAtDepthPsia,
      r: v.r ?? null,
      domeAtTempPsia: v.domeAtTempPsia ?? null,
      dome60Psia: v.dome60Psia ?? null,
      testRackOpeningPsia: v.testRackOpeningPsia ?? null,
      spreadPsi: v.spreadPsi ?? null,
      closingSurfacePressurePsia: v.closingSurfacePressurePsia ?? null,
      throughputMscfd: v.throughputMscfd,
      engineThroughputRegime: ev.throughputRegime,
      enginePassesTarget: ev.passesTarget,
      engineClosesAtOperating: ev.closesAtOperating,
      differences: diffKeys
        .filter((kk) => v[kk] !== null && v[kk] !== undefined
          && ev[kk] !== null && ev[kk] !== undefined)
        .map((kk) => ({ key: kk, diff: ev[kk] - v[kk] })),
    };
  });
};

/**
 * The port ladder at one valve's own stage differential.
 *
 * The differential is the ENGINE's pressures at that valve and the temperature
 * is read at the GOLDEN's depth, which is how the wave's digest cut it. The two
 * depths differ in the last digits, so mixing them the other way moves the
 * passed rate in its ninth significant figure and every port candidate row with
 * it. Stated because it looks like a copying slip and is not.
 */
export const designPortSelection = (id, valve) => {
  const i = designInputs(id);
  const r = publishedDesign(id);
  const ev = r.valves[valve - 1];
  const goldenDepthFt = publishedDesignRecord(id).valves[valve - 1].depthFt;
  const pick = selectPort({
    ports: i.ports.map((idIn) => ({ idIn })),
    targetMscfd: i.qgiTargetMscfd,
    pUpPsia: ev.pInjAtDepthPsia,
    pDnPsia: ev.pProdAtDepthPsia,
    gasSg: i.gasSg,
    tF: temperatureOf(i)(goldenDepthFt),
  });
  return {
    id,
    valve,
    targetMscfd: i.qgiTargetMscfd,
    chosenIdIn: pick.port ? pick.port.idIn : null,
    candidates: pick.candidates.map((c) => ({
      portIdIn: c.port.idIn, qMscfd: c.qMscfd, regime: c.regime, ratio: c.ratio,
    })),
  };
};

// --------------------------------------------------------------- the recursion

/** How many iterates the standalone spacing recursion is shown for, per valve. */
export const SPACING_MAX_ITERATES = 10;

/**
 * ROAD ONE TO THE SPACING DEPTHS. The recursion re-run STANDALONE, iterate by
 * iterate, so a panel can show it converging. Valve n is the fixed point of
 *
 *   d = d(n-1) + ( pInj(pSurf(n), d) - dpTransfer - pProd(n-1) ) / killGrad
 *
 * and the engine stops it at 0.01 ft. These depths agree with the design's own
 * to about seven significant figures and no further. Do NOT pair a depth from
 * here with an increment from `designSpacingIncrements`.
 */
export const spacingRecursionRows = (id, decrement) => {
  const g = publishedDesignRecord(id);
  const i = g.inputs;
  const T = temperatureOf(i);
  const dec = decrement ?? i.dpPerValvePsi;
  const out = [];
  for (let n = 2; n <= g.depths.length; n += 1) {
    const pSurfPsia = i.pKickoffPsia - (n - 1) * dec;
    const previousFt = g.depths[n - 2];
    const previousTransferPsia = i.pWhUnloadPsia + i.unloadGradPsiPerFt * previousFt;
    let d = previousFt + i.minSpacingFt;
    const iterates = [];
    for (let k = 1; k <= SPACING_MAX_ITERATES; k += 1) {
      const pInjPsia = gasColumnPressure({
        pSurfPsia, tvdFt: d, gasSg: i.gasSg, tempAtDepthF: T, steps: ENGINE_SPACING_STEPS,
      }).pBottomPsia;
      const nextFt = previousFt
        + (pInjPsia - i.dpTransferPsi - previousTransferPsia) / i.killGradPsiPerFt;
      iterates.push({
        iterate: k,
        atFt: d,
        pInjPsia,
        availableHeadPsi: pInjPsia - i.dpTransferPsi - previousTransferPsia,
        nextFt,
        moveFt: nextFt - d,
      });
      if (Math.abs(nextFt - d) < FIXED_POINT_TOLERANCE_FT) { d = nextFt; break; }
      d = nextFt;
    }
    out.push({
      valve: n,
      decrementPsi: dec,
      surfacePressurePsia: pSurfPsia,
      previousValve: n - 1,
      previousFt,
      previousTransferPsia,
      seedFt: previousFt + i.minSpacingFt,
      iterates,
      convergedFt: d,
      publishedFt: g.depths[n - 1],
      incrementFt: d - previousFt,
      isTargetDepthMandrel: n === g.depths.length,
    });
  }
  return out;
};

/** The decrements each published case's sweep walks. */
export const DECREMENT_SWEEPS = Object.freeze({
  westTexasOil: [15, 20, 22.5, 25, 27.5, 30, 35, 40, 50],
  midDecrementKnifeEdge: [20, 23, 25, 26, 26.75, 27.5, 30, 35, 40],
});

/**
 * CHANGE ONE DECREMENT, MOVE EVERY DEPTH BELOW IT. Valve 1 NEVER moves, because
 * it is set by the kickoff pressure alone, and every valve under it does, with
 * the move compounding downward. A decrement is not a property of one valve, it
 * is the step size of the whole recursion.
 */
export const decrementSweepRows = (id, decrements = DECREMENT_SWEEPS[id]) => {
  const i = designInputs(id);
  const base = publishedDesign(id);
  return decrements.map((decrementPsi) => {
    const r = designVariant(id, { dpPerValvePsi: decrementPsi });
    return {
      id,
      decrementPsi,
      isPublished: decrementPsi === i.dpPerValvePsi,
      valveCount: r.depths.length,
      stopReason: r.stopReason,
      depths: r.depths.map((depthFt, k) => ({
        valve: k + 1,
        depthFt,
        shiftFt: k < base.depths.length ? depthFt - base.depths[k] : null,
      })),
      deepestFt: r.depths[r.depths.length - 1],
      multipointingStages: r.unloading.filter((s) => s.multipointing).map((s) => s.stage),
    };
  });
};

/**
 * TWO CONVENTIONS, ONE RECURSION. `surfaceClose` drops the surface pressure a
 * fixed amount per valve, `constantPressure` sets the decrement to ZERO and
 * runs the same recursion, leaning on the transfer differential alone. THE
 * TRADE: holding the surface pressure reaches the target in fewer valves and
 * wider steps, and it removes the very mechanism that shuts the upper valves.
 */
export const conventionComparison = (id) => {
  const surfaceClose = publishedDesign(id);
  const constantPressure = designVariant(id, { method: 'constantPressure' });
  const n = Math.max(surfaceClose.depths.length, constantPressure.depths.length);
  const rows = [];
  for (let k = 0; k < n; k += 1) {
    rows.push({
      valve: k + 1,
      surfaceCloseFt: k < surfaceClose.depths.length ? surfaceClose.depths[k] : null,
      surfaceClosePsia: k < surfaceClose.depths.length ? surfaceClose.surfacePressures[k] : null,
      constantPressureFt: k < constantPressure.depths.length ? constantPressure.depths[k] : null,
      constantPressurePsia: k < constantPressure.depths.length
        ? constantPressure.surfacePressures[k] : null,
    });
  }
  return {
    id,
    decrementPsi: designInputs(id).dpPerValvePsi,
    surfaceClose: {
      valveCount: surfaceClose.depths.length,
      stopReason: surfaceClose.stopReason,
      deepestFt: surfaceClose.depths[surfaceClose.depths.length - 1],
      multipointingStages: surfaceClose.unloading
        .filter((s) => s.multipointing).map((s) => s.stage),
    },
    constantPressure: {
      valveCount: constantPressure.depths.length,
      stopReason: constantPressure.stopReason,
      deepestFt: constantPressure.depths[constantPressure.depths.length - 1],
      multipointingStages: constantPressure.unloading
        .filter((s) => s.multipointing).map((s) => s.stage),
    },
    rows,
  };
};

// --------------------------------------------------------------- where spacing stops

/**
 * WHERE SPACING STOPS, AND THE MINIMUM SPACING EXEMPTION. Four stop reasons
 * exist and three of them raise a warning. DEFECT (d), stated as a limit: when
 * the recursion lands at or past the floor, `spaceValves` pushes that mandrel
 * to the floor and returns BEFORE the minSpacingFt test, so the target depth
 * mandrel is exempt from the minimum the design declared, with no warning.
 */
export const stopReasonRows = () => golden.designs.map((g) => {
  const last = g.depths.length - 1;
  const lastIncrementFt = g.depths[last] - g.depths[last - 1];
  return {
    id: g.id,
    stopReason: g.stopReason,
    lastIncrementFt,
    minSpacingFt: g.inputs.minSpacingFt,
    exempt: g.stopReason === 'targetDepth' && lastIncrementFt < g.inputs.minSpacingFt,
  };
});

/** The two branches side by side: the case that skips the test and the case that takes it. */
export const minSpacingExemption = () => {
  const wt = publishedDesignRecord('westTexasOil');
  const dh = publishedDesignRecord('deepHighPressure');
  return {
    exemptId: 'westTexasOil',
    exemptLastIncrementFt: wt.depths[7] - wt.depths[6],
    exemptMinSpacingFt: wt.inputs.minSpacingFt,
    checkedId: 'deepHighPressure',
    checkedValveCount: dh.depths.length,
    checkedDeepestFt: dh.depths[6],
    checkedShortOfFloorFt: dh.inputs.maxDepthFt - dh.depths[6],
    checkedFloorFt: dh.inputs.maxDepthFt,
    checkedMinSpacingFt: dh.inputs.minSpacingFt,
  };
};

/** The sweeps that drive westTexasOil into each of the other stop reasons. */
export const STOP_REASON_SWEEPS = Object.freeze({
  maxValves: [3, 5, 7, 8, 12],
  minSpacingFt: [100, 250, 400, 600, 900, 1400],
  dpPerValvePsi: [60, 90, 130, 200],
});

/** One input walked at a time on westTexasOil, with the stop reason it produces. */
export const stopReasonSweepRows = (which, values = STOP_REASON_SWEEPS[which]) => values
  .map((value) => {
    const r = designVariant('westTexasOil', { [which]: value });
    return {
      which,
      value,
      valveCount: r.depths.length,
      stopReason: r.stopReason,
      deepestFt: r.depths[r.depths.length - 1],
      warningCodes: r.warnings.map((x) => x.code),
    };
  });

/** The catalogue that cannot pass the target, so `portTooSmall` fires. */
export const portTooSmallStudy = () => {
  const r = designVariant('westTexasOil', {
    ports: [0.125], orificeIdIn: 0.125, qgiTargetMscfd: 900,
  });
  return {
    warningCodes: r.warnings.map((x) => x.code),
    messages: r.warnings.filter((x) => x.code === 'portTooSmall').map((x) => x.message),
  };
};

// --------------------------------------------------------------- the PPO divergence

/**
 * A PINNED KNOWN DIVERGENCE, not a bug to be worked around and not a worked
 * example. The engine computes `closingSurfacePressurePsia` by taking the dome
 * charge, which for a PPO valve balances against the TUBING, and inverting it
 * up a CASING gas column; `unloadingSequence` then compares that number with
 * the casing pressure, so a production operated string is closed on the wrong
 * fluid. Not fixed, because the engine is consumed by a live Suite app.
 *
 * The negative spreads are the SECOND SYMPTOM of the SAME line: `valveSpread`
 * is handed the production pressure as the opening side and the casing as the
 * other side. A spread is a pressure fall, so a negative one is the two sides
 * swapped and not a valve property.
 */
export const ppoDivergence = () => {
  const g = publishedDesignRecord('constantPressurePPO');
  const r = publishedDesign('constantPressurePPO');
  const casingSide = [];
  const casingRows = [];
  g.valves.forEach((v, k) => {
    if (v.closingSurfacePressurePsia === null || v.closingSurfacePressurePsia === undefined) return;
    const clearsByPsi = g.inputs.pKickoffPsia - v.closingSurfacePressurePsia;
    casingSide.push(clearsByPsi);
    casingRows.push({
      valve: k + 1,
      depthFt: v.depthFt,
      surfacePsia: g.inputs.pKickoffPsia,
      closingSurfacePressurePsia: v.closingSurfacePressurePsia,
      clearsByPsi,
    });
  });
  const seen = new Set();
  const tubingRows = [];
  g.unloading.forEach((s) => s.closingMargins.forEach((m) => {
    if (seen.has(m.valve)) return;
    seen.add(m.valve);
    tubingRows.push({
      valve: m.valve,
      actingPressurePsia: m.actingPressurePsia,
      domeAtTempPsia: m.domeAtTempPsia,
      missesByPsi: -m.marginPsi,
    });
  }));
  const tubingSide = tubingRows.map((x) => x.missesByPsi);
  return {
    casingRows,
    tubingRows,
    casingClearsFromPsi: Math.min(...casingSide),
    casingClearsToPsi: Math.max(...casingSide),
    tubingMissesFromPsi: Math.min(...tubingSide),
    tubingMissesToPsi: Math.max(...tubingSide),
    engineMultipointingStages: r.unloading.filter((s) => s.multipointing).map((s) => s.stage),
    engineOpenByStage: r.unloading.map((s) => s.upperValvesOpen),
    oracleMultipointingStages: g.unloading.filter((s) => s.multipointing).map((s) => s.stage),
    laterStages: g.unloading.filter((s, k) => k > 0).length,
    spreads: g.valves.map((v, k) => ({ valve: k + 1, spreadPsi: v.spreadPsi })),
    everySpreadNegative: g.valves.every((v) => v.spreadPsi < 0),
  };
};

// ===========================================================================
// EXPERT TIER: THE UNLOADING SEQUENCE AND THE POINT OF INJECTION.
//
// Unloading stage by stage, the closing surface pressure, multipointing and the
// margin the verdict sits on, the deepest injection point, the chord that
// cannot see its own error, and sweeping a design instead of reporting one.
// ===========================================================================

// --------------------------------------------------------------- unloading

/**
 * The unloading sequence of one published design, stage by stage, oracle beside
 * engine. The golden closing margins come from the oracle, which evaluates the
 * published closing rule (Takacs ch. 3, Brown vol. 2a, API Book 6) AT VALVE
 * DEPTH off a forward RK4 column. The engine evaluates the same rule AT SURFACE
 * by inverting a coarser column. Two roads to one verdict, and a lesson may say
 * so.
 *
 * The `unloading` key exists at all only because engines PR #110 closed the
 * validation gap: the oracle's `unloading()` used to be a stub that appended an
 * empty open valve list for every stage without ever evaluating the condition.
 */
export const designUnloadingRows = (id) => {
  const g = publishedDesignRecord(id);
  const r = publishedDesign(id);
  return g.unloading.map((s, k) => {
    const es = r.unloading[k];
    const surfaceTests = [];
    for (let j = 0; j < k; j += 1) {
      const closingPsia = r.valves[j].closingSurfacePressurePsia;
      if (closingPsia === null || closingPsia === undefined) continue;
      surfaceTests.push({
        valve: j + 1,
        casingPsia: es.surfaceInjectionPsia,
        closingSurfacePressurePsia: closingPsia,
        surfaceMarginPsi: es.surfaceInjectionPsia - closingPsia,
        open: es.surfaceInjectionPsia >= closingPsia,
      });
    }
    return {
      stage: s.stage,
      valve: s.valve,
      depthFt: s.depthFt,
      surfaceInjectionPsia: s.surfaceInjectionPsia,
      injectionAtDepthPsia: s.injectionAtDepthPsia,
      productionAtDepthPsia: s.productionAtDepthPsia,
      fluidLevelFt: s.fluidLevelFt,
      gasRateMscfd: s.gasRateMscfd,
      passesTarget: s.passesTarget,
      oracleUpperValvesOpen: s.upperValvesOpen,
      oracleMultipointing: s.multipointing,
      engineUpperValvesOpen: es.upperValvesOpen,
      engineMultipointing: es.multipointing,
      closingMargins: s.closingMargins.map((m) => ({
        valve: m.valve,
        family: m.family,
        actingOn: m.actingOn,
        actingPressurePsia: m.actingPressurePsia,
        domeAtTempPsia: m.domeAtTempPsia,
        marginPsi: m.marginPsi,
        spreadPsi: m.spreadPsi,
        open: m.open,
        casingDropPsi: m.casingDropPsi ?? null,
      })),
      surfaceTests,
    };
  });
};

/** Does the shipped engine agree with the oracle on every stage of this design? */
export const unloadingVerdictAgreement = (id) => {
  const g = publishedDesignRecord(id);
  const r = publishedDesign(id);
  return g.unloading.every((s, k) => s.multipointing === r.unloading[k].multipointing
    && JSON.stringify(s.upperValvesOpen) === JSON.stringify(r.unloading[k].upperValvesOpen));
};

// --------------------------------------------------------------- the knife edge

/** The published case the multipointing verdict is taught on. Never the capstone. */
export const KNIFE_EDGE_ID = 'midDecrementKnifeEdge';

/**
 * THE PUBLISHED KNIFE EDGE. `midDecrementKnifeEdge` is spaced on 26.75 psi per
 * valve, a decrement in the middle of the usual 20 to 50 psi band. It
 * multipoints at stages 2 to 5, is clean at 1, 6 and 7, and its stage 5 verdict
 * on valve 4 hangs on a fraction of a psi on a system of over a thousand psia.
 */
export const knifeEdge = () => {
  const g = publishedDesignRecord(KNIFE_EDGE_ID);
  const r = publishedDesign(KNIFE_EDGE_ID);
  const oracleMarginPsi = g.unloading[4].closingMargins.find((m) => m.valve === 4).marginPsi;
  const engineMarginPsi = r.unloading[4].surfaceInjectionPsia
    - r.valves[3].closingSurfacePressurePsia;
  return {
    id: KNIFE_EDGE_ID,
    decrementPsi: g.inputs.dpPerValvePsi,
    pKickoffPsia: g.inputs.pKickoffPsia,
    stage: 5,
    valve: 4,
    oracleMarginPsi,
    engineMarginPsi,
    injectionAtValve4Psia: r.valves[3].pInjAtDepthPsia,
    multipointingStages: g.unloading.filter((s) => s.multipointing).map((s) => s.stage),
    cleanStages: g.unloading.filter((s) => !s.multipointing).map((s) => s.stage),
  };
};

/**
 * THE MECHANISM, STATED OUTRIGHT. Across every charged valve of the published
 * knife edge case the open flag IS the test of the casing DROP since that
 * valve's own opening stage against that valve's SPREAD. And the trap that
 * follows: the SURFACE decrement is 26.75 psi per valve, but the drop a valve
 * actually feels AT DEPTH is larger and grows with depth. Compare a spread
 * against the decrement rather than against the drop and you pick the wrong
 * valves.
 */
export const knifeEdgeMechanismRows = () => {
  const g = publishedDesignRecord(KNIFE_EDGE_ID);
  const seen = new Map();
  g.unloading.forEach((s) => s.closingMargins.forEach((m) => {
    if (m.casingDropPsi === null || m.casingDropPsi === undefined) return;
    if (!seen.has(m.valve)) {
      seen.set(m.valve, {
        valve: m.valve,
        spreadPsi: m.spreadPsi,
        casingDropPsi: m.casingDropPsi,
        spreadLessDropPsi: m.spreadPsi - m.casingDropPsi,
        open: m.open,
        decrementPsi: g.inputs.dpPerValvePsi,
      });
    }
  }));
  return [...seen.values()].sort((a, b) => a.valve - b.valve);
};

/** The decrements the fine knife edge sweep walks, straddling the flip. */
export const KNIFE_EDGE_DECREMENTS = Object.freeze([
  26.00, 26.25, 26.50, 26.60, 26.70, 26.74, 26.75, 26.76, 26.80, 26.85, 26.90,
  27.00, 27.25, 27.50,
]);

/** The decrement moves the verdict SMOOTHLY. Compare with the gas rate sweep. */
export const knifeEdgeDecrementRows = (decrements = KNIFE_EDGE_DECREMENTS) => decrements
  .map((decrementPsi) => {
    const r = designVariant(KNIFE_EDGE_ID, { dpPerValvePsi: decrementPsi });
    return {
      decrementPsi,
      isPublished: decrementPsi === designInputs(KNIFE_EDGE_ID).dpPerValvePsi,
      stage5MarginPsi: r.unloading[4].surfaceInjectionPsia
        - r.valves[3].closingSurfacePressurePsia,
      stage5Multipointing: r.unloading[4].multipointing,
      multipointingStages: r.unloading.filter((s) => s.multipointing).map((s) => s.stage),
    };
  });

/** Port bores the knife edge is walked over, one port for the whole string. */
export const KNIFE_EDGE_PORTS_IN = Object.freeze([0.25, 0.3125, 0.375, 0.4375, 0.5, 0.625]);

/** Port size reaches the verdict through R = Ap / Ab and so through the dome charge. */
export const knifeEdgePortRows = (ports = KNIFE_EDGE_PORTS_IN) => ports.map((portIdIn) => {
  const r = designVariant(KNIFE_EDGE_ID, {
    ports: [portIdIn], orificeIdIn: portIdIn, qgiTargetMscfd: 1,
  });
  return {
    portIdIn,
    r: r.valves[0].r,
    closingSurfacePressures: r.valves.map((v) => v.closingSurfacePressurePsia),
    stage5MarginPsi: r.unloading[4].surfaceInjectionPsia
      - r.valves[3].closingSurfacePressurePsia,
    multipointingStages: r.unloading.filter((s) => s.multipointing).map((s) => s.stage),
  };
});

/** Bellows areas the knife edge is walked over, the other half of R. */
export const KNIFE_EDGE_BELLOWS_IN2 = Object.freeze([0.29, 0.31, 0.50, 0.62, 0.77, 0.90, 0.99]);

export const knifeEdgeBellowsRows = (areas = KNIFE_EDGE_BELLOWS_IN2) => areas
  .map((bellowsAreaIn2) => {
    const r = designVariant(KNIFE_EDGE_ID, { bellowsAreaIn2 });
    return {
      bellowsAreaIn2,
      isPublished: bellowsAreaIn2 === designInputs(KNIFE_EDGE_ID).bellowsAreaIn2,
      r: r.valves[0].r,
      stage5MarginPsi: r.unloading[4].surfaceInjectionPsia
        - r.valves[3].closingSurfacePressurePsia,
      multipointingStages: r.unloading.filter((s) => s.multipointing).map((s) => s.stage),
    };
  });

/** Design gas rates the knife edge is walked over. */
export const KNIFE_EDGE_GAS_RATES_MSCFD = Object.freeze([
  400, 600, 800, 1000, 1200, 1400, 1600, 2000, 2200, 2400, 3000, 3500,
]);

/**
 * THE STEP, not a slope. The design gas rate reaches the verdict ONLY through
 * `selectPort`, so it does nothing at all until the target crosses a catalogue
 * step and then it moves the verdict in one jump. That is a different SHAPE of
 * sensitivity from the decrement, and drawing the two on the same axes is the
 * whole point of the sweep mode: a sweep's resolution has to match the
 * mechanism, not the axis.
 */
export const knifeEdgeGasRateRows = (targets = KNIFE_EDGE_GAS_RATES_MSCFD) => targets
  .map((qgiTargetMscfd) => {
    const r = designVariant(KNIFE_EDGE_ID, { qgiTargetMscfd });
    return {
      qgiTargetMscfd,
      isPublished: qgiTargetMscfd === designInputs(KNIFE_EDGE_ID).qgiTargetMscfd,
      ports: r.valves.map((v) => v.portIdIn),
      stage5MarginPsi: r.unloading[4].surfaceInjectionPsia
        - r.valves[3].closingSurfacePressurePsia,
      multipointingStages: r.unloading.filter((s) => s.multipointing).map((s) => s.stage),
    };
  });

/** Transfer differentials and unloading gradients, for completeness. */
export const KNIFE_EDGE_TRANSFERS_PSI = Object.freeze([40, 50, 60, 70, 80, 100]);
export const KNIFE_EDGE_UNLOAD_GRADS = Object.freeze([0.06, 0.09, 0.12, 0.15, 0.20]);

const knifeEdgeShapeRow = (key, value) => {
  const r = designVariant(KNIFE_EDGE_ID, { [key]: value });
  return {
    which: key,
    value,
    isPublished: value === designInputs(KNIFE_EDGE_ID)[key],
    valveCount: r.depths.length,
    deepestFt: r.depths[r.depths.length - 1],
    multipointingStages: r.unloading.filter((s) => s.multipointing).map((s) => s.stage),
  };
};

export const knifeEdgeTransferRows = (values = KNIFE_EDGE_TRANSFERS_PSI) => values
  .map((v) => knifeEdgeShapeRow('dpTransferPsi', v));

export const knifeEdgeUnloadGradientRows = (values = KNIFE_EDGE_UNLOAD_GRADS) => values
  .map((v) => knifeEdgeShapeRow('unloadGradPsiPerFt', v));

/**
 * DEFECT (a), now closed. What the goldens gained when engines PR #110 replaced
 * the stub oracle, counted rather than asserted, and the sign agreement between
 * the engine's surface margin and the oracle's valve depth margin on every IPO
 * closing margin row.
 */
export const validationGap = () => {
  const stageRows = golden.designs.reduce((a, x) => a + x.unloading.length, 0);
  const marginRows = golden.designs
    .reduce((a, x) => a + x.unloading.reduce((b, s) => b + s.closingMargins.length, 0), 0);
  const ipoStages = golden.designs
    .filter((x) => x.inputs.valveType === 'IPO')
    .reduce((a, x) => a + x.unloading.length, 0);
  let worst = 0;
  golden.designs.forEach((x) => {
    if (x.inputs.valveType !== 'IPO') return;
    const r = publishedDesign(x.id);
    x.unloading.forEach((s, k) => s.closingMargins.forEach((m) => {
      const engineMargin = r.unloading[k].surfaceInjectionPsia
        - r.valves[m.valve - 1].closingSurfacePressurePsia;
      worst = Math.max(worst, Math.abs(Math.sign(engineMargin) - Math.sign(m.marginPsi)));
    }));
  });
  return {
    stageRows,
    marginRows,
    ipoStages,
    publishedCases: golden.designs.length,
    signAgreement: worst === 0,
  };
};

// --------------------------------------------------------------- the injection point

/** The published injection point case, as the golden publishes it. */
export const injectionPointGolden = () => {
  const ip = golden.injectionPoint;
  return {
    pSurfPsia: ip.pSurfPsia,
    gasSg: ip.gasSg,
    dpTransferPsi: ip.dpTransferPsi,
    maxDepthFt: ip.maxDepthFt,
    whtF: ip.whtF,
    bhtF: ip.bhtF,
    refDepthFt: ip.refDepthFt,
    traverse: ip.traverse.map((r) => ({ tvdFt: r.tvdFt, pPsia: r.pPsia })),
    rows: ip.traverse.length,
    rowSpacingFt: ip.traverse[1].tvdFt - ip.traverse[0].tvdFt,
    expectedDepthFt: ip.expected.depthFt,
    expectedPInjPsia: ip.expected.pInjPsia,
    expectedPProdPsia: ip.expected.pProdPsia,
    expectedLimitedBy: ip.expected.limitedBy,
  };
};

const injectionPointTemperature = () => {
  const ip = golden.injectionPoint;
  return linearTemperature({ whtF: ip.whtF, bhtF: ip.bhtF, refDepthFt: ip.refDepthFt });
};

/**
 * A monotone cubic through the published traverse rows, treated as the
 * continuous flowing traverse the tabulation samples. It reproduces every
 * published row exactly. TO REFINE A TABULATION YOU NEED SOMETHING TO REFINE IT
 * TOWARD. This is a TEACHING CONSTRUCT and not a published curve.
 */
const monotoneCubic = (X, Y) => {
  const n = X.length;
  const h = [];
  const dd = [];
  for (let k = 0; k < n - 1; k += 1) {
    h.push(X[k + 1] - X[k]);
    dd.push((Y[k + 1] - Y[k]) / h[k]);
  }
  const m = new Array(n);
  m[0] = dd[0];
  m[n - 1] = dd[n - 2];
  for (let k = 1; k < n - 1; k += 1) {
    if (dd[k - 1] * dd[k] <= 0) m[k] = 0;
    else {
      const w1 = 2 * h[k] + h[k - 1];
      const w2 = h[k] + 2 * h[k - 1];
      m[k] = (w1 + w2) / (w1 / dd[k - 1] + w2 / dd[k]);
    }
  }
  return (x) => {
    let k = 0;
    while (k < n - 2 && x > X[k + 1]) k += 1;
    const t = (x - X[k]) / h[k];
    const t2 = t * t;
    const t3 = t2 * t;
    return Y[k] * (2 * t3 - 3 * t2 + 1) + h[k] * m[k] * (t3 - 2 * t2 + t)
      + Y[k + 1] * (-2 * t3 + 3 * t2) + h[k] * m[k + 1] * (t3 - t2);
  };
};

/** The continuous stand in for the published traverse. */
export const publishedTraverseCurve = () => monotoneCubic(
  golden.injectionPoint.traverse.map((r) => r.tvdFt),
  golden.injectionPoint.traverse.map((r) => r.pPsia),
);

const bisectCrossing = (resid, lo, hi, iterations = 200) => {
  let a = lo;
  let b = hi;
  for (let k = 0; k < iterations; k += 1) {
    const mid = (a + b) / 2;
    if (resid(a) * resid(mid) <= 0) b = mid; else a = mid;
  }
  return (a + b) / 2;
};

/** The converged crossing of the published case, against a converged column. */
export const injectionPointConverged = () => {
  const ip = golden.injectionPoint;
  const T = injectionPointTemperature();
  const P = publishedTraverseCurve();
  const trueInj = referenceColumn(ip.pSurfPsia, ip.maxDepthFt, ip.gasSg, T, 'golden injectionPoint');
  const resid = (d) => trueInj(d) - ip.dpTransferPsi - P(d);
  const depthFt = bisectCrossing(resid, 0, ip.maxDepthFt);
  return {
    depthFt,
    pInjPsia: trueInj(depthFt),
    pProdPsia: P(depthFt),
    residualPsi: resid(depthFt),
  };
};

/**
 * RUN ONE, THE SHIPPED ENGINE LINE. The published 1000 ft tabulation AND the
 * injection curve at the sample count the engine defaults to. This is the
 * answer a user of the studio is actually handed, and it is the run to quote
 * when the question is what the shipped software says.
 */
export const injectionPointShipped = () => {
  const ip = golden.injectionPoint;
  const T = injectionPointTemperature();
  const shipped = deepestInjectionPoint({
    prodTraverse: ip.traverse,
    pSurfPsia: ip.pSurfPsia,
    gasSg: ip.gasSg,
    tempAtDepthF: T,
    dpTransferPsi: ip.dpTransferPsi,
    maxDepthFt: ip.maxDepthFt,
  });
  const conv = injectionPointConverged();
  const P = publishedTraverseCurve();
  const trueInj = referenceColumn(ip.pSurfPsia, ip.maxDepthFt, ip.gasSg, T, 'golden injectionPoint');
  const reportedResidualPsi = shipped.pInjPsia - ip.dpTransferPsi - shipped.pProdPsia;
  const trueResidualPsi = trueInj(shipped.depthFt) - ip.dpTransferPsi - P(shipped.depthFt);
  return {
    depthFt: shipped.depthFt,
    pInjPsia: shipped.pInjPsia,
    pProdPsia: shipped.pProdPsia,
    limitedBy: shipped.limitedBy,
    reportedResidualPsi,
    trueResidualPsi,
    trueOverReported: Math.abs(trueResidualPsi / reportedResidualPsi),
    depthErrorFt: shipped.depthFt - conv.depthFt,
    pressureErrorPsi: shipped.pInjPsia - conv.pInjPsia,
    gatePsi: INJECTION_POINT_GATE_PSI,
  };
};

/** The tabulation row counts the refinement walks. */
export const INJECTION_POINT_SEGMENTS = Object.freeze([2, 4, 8, 16, 32, 64, 128, 256, 512, 1024]);

/** The tabulation spacing the published case ships, in segments of the whole depth. */
export const PUBLISHED_TABULATION_SEGMENTS = 8;

/**
 * RUN TWO, THE REFINEMENT. The traverse resampled from the continuous curve at
 * rising row counts with the injection COLUMN HELD CONVERGED, so the chord being
 * measured is the traverse chord alone. This is the run that isolates the
 * mechanism. Its numbers at the shipped 1000 ft spacing are close to but NOT
 * the same as the shipped engine line's, because the two answer different
 * questions.
 *
 * Watch the depth march and the reported residual fail to track it: the
 * residual does NOT fall as the error falls, because both sides of it come off
 * the same pair of chords.
 */
export const injectionPointTabulationRows = memoize((segments = INJECTION_POINT_SEGMENTS) => {
  const ip = golden.injectionPoint;
  const T = injectionPointTemperature();
  const P = publishedTraverseCurve();
  const trueInj = referenceColumn(ip.pSurfPsia, ip.maxDepthFt, ip.gasSg, T, 'golden injectionPoint');
  const conv = injectionPointConverged();
  return segments.map((nseg) => {
    const rows = [];
    for (let k = 0; k <= nseg; k += 1) {
      const tvdFt = (ip.maxDepthFt * k) / nseg;
      rows.push({ tvdFt, pPsia: P(tvdFt) });
    }
    const r = deepestInjectionPoint({
      prodTraverse: rows,
      pSurfPsia: ip.pSurfPsia,
      gasSg: ip.gasSg,
      tempAtDepthF: T,
      dpTransferPsi: ip.dpTransferPsi,
      maxDepthFt: ip.maxDepthFt,
      steps: 2048,
    });
    const reportedResidualPsi = r.pInjPsia - ip.dpTransferPsi - r.pProdPsia;
    const trueResidualPsi = trueInj(r.depthFt) - ip.dpTransferPsi - P(r.depthFt);
    return {
      segments: nseg,
      rows: nseg + 1,
      spacingFt: ip.maxDepthFt / nseg,
      isShippedSpacing: nseg === PUBLISHED_TABULATION_SEGMENTS,
      depthFt: r.depthFt,
      depthErrorFt: r.depthFt - conv.depthFt,
      pInjPsia: r.pInjPsia,
      reportedResidualPsi,
      trueResidualPsi,
      trueOverReported: Math.abs(trueResidualPsi / reportedResidualPsi),
    };
  });
});

/** The column sample counts the other chord is refined over. */
export const INJECTION_POINT_COLUMN_STEPS = Object.freeze([
  8, 16, 20, 40, 80, 160, 320, 640, 1280, 2560,
]);

/**
 * THE OTHER CHORD, with the published 9 row tabulation held fixed. It barely
 * moves the answer, which is exactly why the defect is hard to see: refining
 * the thing that is easy to refine changes nothing.
 */
export const injectionPointColumnRows = memoize((steps = INJECTION_POINT_COLUMN_STEPS) => {
  const ip = golden.injectionPoint;
  const T = injectionPointTemperature();
  return steps.map((s) => {
    const r = deepestInjectionPoint({
      prodTraverse: ip.traverse,
      pSurfPsia: ip.pSurfPsia,
      gasSg: ip.gasSg,
      tempAtDepthF: T,
      dpTransferPsi: ip.dpTransferPsi,
      maxDepthFt: ip.maxDepthFt,
      steps: s,
    });
    return {
      steps: s,
      depthFt: r.depthFt,
      pInjPsia: r.pInjPsia,
      reportedResidualPsi: r.pInjPsia - ip.dpTransferPsi - r.pProdPsia,
    };
  });
});

/** Surface pressures that drive the crossing into each of its three returns. */
export const LIMITED_BY_HIGH_PSIA = Object.freeze([1014.7, 1214.7, 1414.7, 1614.7]);
export const LIMITED_BY_LOW_PSIA = Object.freeze([714.7, 614.7, 514.7, 414.7, 314.7]);

/**
 * THE OTHER STOP. When gas still wins at the deepest tabulated row the function
 * returns that row and says DEPTH, not pressure, and a lesson must not read
 * that as a crossing. THE THIRD RETURN: when the gas loses at the very first
 * tabulated row it returns depth 0 and calls it limitedBy pressure, which is
 * the engine's way of saying the well will not lift at all.
 */
export const injectionPointLimitedByRows = (pressures) => {
  const ip = golden.injectionPoint;
  const T = injectionPointTemperature();
  return pressures.map((pSurfPsia) => {
    const r = deepestInjectionPoint({
      prodTraverse: ip.traverse,
      pSurfPsia,
      gasSg: ip.gasSg,
      tempAtDepthF: T,
      dpTransferPsi: ip.dpTransferPsi,
      maxDepthFt: ip.maxDepthFt,
    });
    return {
      pSurfPsia,
      depthFt: r.depthFt,
      pInjPsia: r.pInjPsia,
      pProdPsia: r.pProdPsia,
      limitedBy: r.limitedBy,
    };
  });
};

/** What depth costs: the crossing walked against surface pressure and transfer. */
export const DEPTH_PURCHASE_SURFACE_PSIA = Object.freeze([
  814.7, 864.7, 914.7, 964.7, 1014.7, 1064.7, 1114.7, 1164.7,
]);
export const DEPTH_PURCHASE_TRANSFER_PSI = Object.freeze([0, 25, 50, 75, 100, 150, 200]);

export const depthPurchaseBySurfaceRows = (pressures = DEPTH_PURCHASE_SURFACE_PSIA) => {
  const ip = golden.injectionPoint;
  const T = injectionPointTemperature();
  return pressures.map((pSurfPsia) => {
    const r = deepestInjectionPoint({
      prodTraverse: ip.traverse,
      pSurfPsia,
      gasSg: ip.gasSg,
      tempAtDepthF: T,
      dpTransferPsi: ip.dpTransferPsi,
      maxDepthFt: ip.maxDepthFt,
    });
    return { pSurfPsia, depthFt: r.depthFt, limitedBy: r.limitedBy };
  });
};

export const depthPurchaseByTransferRows = (values = DEPTH_PURCHASE_TRANSFER_PSI) => {
  const ip = golden.injectionPoint;
  const T = injectionPointTemperature();
  return values.map((dpTransferPsi) => {
    const r = deepestInjectionPoint({
      prodTraverse: ip.traverse,
      pSurfPsia: ip.pSurfPsia,
      gasSg: ip.gasSg,
      tempAtDepthF: T,
      dpTransferPsi,
      maxDepthFt: ip.maxDepthFt,
    });
    return {
      dpTransferPsi,
      isPublished: dpTransferPsi === ip.dpTransferPsi,
      depthFt: r.depthFt,
      limitedBy: r.limitedBy,
    };
  });
};

// ===========================================================================
// THE TWO TEACHING CONSTRUCTS.
//
// AKASO-3 and the teaching traverse on it. NEITHER IS A PUBLISHED CASE. No
// oracle has ever checked either one, and a lesson or a panel must say
// "teaching well" or "teaching traverse" every time it prints one of these
// numbers. They exist because no single published case can do what they do:
// AKASO-3 runs the SAME string three ways, and the teaching traverse is an
// explicit smooth curve whose exact crossing is known.
// ===========================================================================

/** The teaching well. Not in the goldens, not a real well. */
export const TEACHING_WELL = Object.freeze({
  id: 'AKASO-3',
  wht: 98,
  bht: 178,
  refDepth: 7600,
  maxDepthFt: 7200,
  gasSg: 0.63,
  pKickoffPsia: 1064.7,
  pOperatingPsia: 964.7,
  pWhUnloadPsia: 144.7,
  killGradPsiPerFt: 0.44,
  unloadGradPsiPerFt: 0.10,
  dpTransferPsi: 55,
  dpPerValvePsi: 30,
  bellowsAreaIn2: 0.77,
  ports: [0.25, 0.3125, 0.375, 0.4375, 0.5, 0.625, 0.75],
  orificeIdIn: 0.3125,
  qgiTargetMscfd: 700,
  minSpacingFt: 250,
  maxValves: 12,
  method: 'surfaceClose',
  valveType: 'IPO',
  bottomOrifice: true,
});

/** The three ways the same teaching string is run. */
export const TEACHING_WELL_VARIANTS = Object.freeze([
  { name: 'surfaceClose IPO', over: {} },
  { name: 'constantPressure IPO', over: { method: 'constantPressure' } },
  { name: 'surfaceClose PPO', over: { valveType: 'PPO', bottomOrifice: false } },
]);

/** The depths the teaching well's operating injection curve is read at. */
export const TEACHING_WELL_STATIONS_FT = Object.freeze([
  0, 900, 1800, 2700, 3600, 4500, 5400, 6300, 7200,
]);

const teachingWellCache = new Map();

/** One variant of the teaching well, run through the shipped engine. */
export const teachingWellDesign = (name) => {
  if (!teachingWellCache.has(name)) {
    const v = TEACHING_WELL_VARIANTS.find((x) => x.name === name);
    teachingWellCache.set(name, designGasLift(adaptDesignInputs({ ...TEACHING_WELL, ...v.over })));
  }
  return teachingWellCache.get(name);
};

/** The valves of one teaching variant, plot ready. */
export const teachingWellValveRows = (name) => teachingWellDesign(name).valves.map((v, k) => ({
  valve: k + 1,
  depthFt: v.depthFt,
  surfacePressurePsia: v.pSurfOpenPsia ?? teachingWellDesign(name).surfacePressures[k],
  tempF: v.tempF,
  valveType: v.valveType,
  portIdIn: v.portIdIn,
  pInjAtDepthPsia: v.pInjAtDepthPsia,
  pProdAtDepthPsia: v.pProdAtDepthPsia,
  throughputMscfd: v.throughputMscfd,
  throughputRegime: v.throughputRegime,
  r: v.r,
  domeAtTempPsia: v.domeAtTempPsia,
  dome60Psia: v.dome60Psia,
  testRackOpeningPsia: v.testRackOpeningPsia,
  spreadPsi: v.spreadPsi,
  closingSurfacePressurePsia: v.closingSurfacePressurePsia,
}));

/** The unloading walk of one teaching variant, with the surface test on every upper valve. */
export const teachingWellUnloadingRows = (name) => {
  const r = teachingWellDesign(name);
  return r.unloading.map((s, k) => {
    const surfaceTests = [];
    for (let j = 0; j < k; j += 1) {
      const closingPsia = r.valves[j].closingSurfacePressurePsia;
      if (closingPsia === null || closingPsia === undefined) continue;
      surfaceTests.push({
        valve: j + 1,
        casingPsia: s.surfaceInjectionPsia,
        closingSurfacePressurePsia: closingPsia,
        marginPsi: s.surfaceInjectionPsia - closingPsia,
      });
    }
    return {
      stage: s.stage,
      surfaceInjectionPsia: s.surfaceInjectionPsia,
      fluidLevelFt: s.fluidLevelFt,
      gasRateMscfd: s.gasRateMscfd,
      upperValvesOpen: s.upperValvesOpen,
      multipointing: s.multipointing,
      surfaceTests,
    };
  });
};

/** The three straight lines on the teaching well, at its own stations. */
export const teachingWellLineRows = (name, stations = TEACHING_WELL_STATIONS_FT) => {
  const curve = teachingWellDesign(name).injectionCurve;
  return stations.map((tvdFt) => ({
    tvdFt,
    operatingInjectionPsia: curve.at(tvdFt),
    unloadingPsia: TEACHING_WELL.pWhUnloadPsia + TEACHING_WELL.killGradPsiPerFt * tvdFt,
    transferPsia: TEACHING_WELL.pWhUnloadPsia + TEACHING_WELL.unloadGradPsiPerFt * tvdFt,
  }));
};

// --------------------------------------------------------------- the teaching traverse

/**
 * THE TEACHING TRAVERSE. The published golden traverse is nearly straight, so
 * its chord error is small. Real flowing traverses curve, because holdup and
 * friction change with depth. This one is an explicit smooth curve,
 *
 *   p(D) = 144.7 + 0.11 D + 8e-6 D^2 psia, 0 to 7200 ft,
 *
 * so its exact crossing against a converged gas column is known to machine
 * precision and the tabulation can be coarsened and refined at will. It is NOT
 * a published case and NOT a measured traverse. It exists so the chord defect
 * can be shown at a size a learner can see: the published case alone makes the
 * defect look negligible, and it is the RATIO, not the magnitude, that is the
 * finding.
 */
export const TEACHING_TRAVERSE = Object.freeze({
  interceptPsia: 144.7,
  slopePsiPerFt: 0.11,
  curvaturePsiPerFt2: 8e-6,
  maxDepthFt: TEACHING_WELL.maxDepthFt,
});

/** The teaching traverse as a function of depth. */
export const teachingTraverseAt = (tvdFt) => TEACHING_TRAVERSE.interceptPsia
  + TEACHING_TRAVERSE.slopePsiPerFt * tvdFt
  + TEACHING_TRAVERSE.curvaturePsiPerFt2 * tvdFt * tvdFt;

/** The teaching traverse sampled at the teaching well's own stations. */
export const teachingTraverseRows = (stations = TEACHING_WELL_STATIONS_FT) => stations
  .map((tvdFt) => ({ tvdFt, pProdPsia: teachingTraverseAt(tvdFt) }));

/** The exact crossing of the teaching traverse against a converged column. */
export const teachingTraverseExact = () => {
  const T = temperatureOf(TEACHING_WELL);
  const trueInj = referenceColumn(
    TEACHING_WELL.pOperatingPsia, TEACHING_WELL.maxDepthFt, TEACHING_WELL.gasSg, T,
    'teaching AKASO-3',
  );
  const resid = (d) => trueInj(d) - TEACHING_WELL.dpTransferPsi - teachingTraverseAt(d);
  const depthFt = bisectCrossing(resid, 0, TEACHING_WELL.maxDepthFt);
  return {
    pSurfPsia: TEACHING_WELL.pOperatingPsia,
    dpTransferPsi: TEACHING_WELL.dpTransferPsi,
    depthFt,
    pInjPsia: trueInj(depthFt),
    pProdPsia: teachingTraverseAt(depthFt),
    residualPsi: resid(depthFt),
  };
};

/** The tabulation row counts the teaching refinement walks. */
export const TEACHING_TRAVERSE_SEGMENTS = Object.freeze([
  3, 4, 6, 8, 12, 16, 24, 32, 48, 64, 128, 256, 512,
]);

/**
 * The chord defect at full size. On the coarsest tabulations the crossing lands
 * tens of feet shallow of the truth while the function reports a residual of
 * hundredths of a psi, comfortably inside the 0.5 psi its own gate allows, and
 * the residual it cannot see is hundreds of times larger than the one it can.
 * The ratio holds near 670 all the way down the refinement, which is what makes
 * it a property of the mechanism rather than of one tabulation.
 */
export const teachingTraverseRefinementRows = memoize((segments = TEACHING_TRAVERSE_SEGMENTS) => {
  const T = temperatureOf(TEACHING_WELL);
  const trueInj = referenceColumn(
    TEACHING_WELL.pOperatingPsia, TEACHING_WELL.maxDepthFt, TEACHING_WELL.gasSg, T,
    'teaching AKASO-3',
  );
  const exact = teachingTraverseExact();
  return segments.map((nseg) => {
    const rows = [];
    for (let k = 0; k <= nseg; k += 1) {
      const tvdFt = (TEACHING_WELL.maxDepthFt * k) / nseg;
      rows.push({ tvdFt, pPsia: teachingTraverseAt(tvdFt) });
    }
    const r = deepestInjectionPoint({
      prodTraverse: rows,
      pSurfPsia: TEACHING_WELL.pOperatingPsia,
      gasSg: TEACHING_WELL.gasSg,
      tempAtDepthF: T,
      dpTransferPsi: TEACHING_WELL.dpTransferPsi,
      maxDepthFt: TEACHING_WELL.maxDepthFt,
      steps: 2048,
    });
    const reportedResidualPsi = r.pInjPsia - TEACHING_WELL.dpTransferPsi - r.pProdPsia;
    const trueResidualPsi = trueInj(r.depthFt) - TEACHING_WELL.dpTransferPsi
      - teachingTraverseAt(r.depthFt);
    return {
      segments: nseg,
      rows: nseg + 1,
      spacingFt: TEACHING_WELL.maxDepthFt / nseg,
      depthFt: r.depthFt,
      depthErrorFt: r.depthFt - exact.depthFt,
      pInjPsia: r.pInjPsia,
      pressureErrorPsi: r.pInjPsia - exact.pInjPsia,
      reportedResidualPsi,
      trueResidualPsi,
      trueOverReported: Math.abs(trueResidualPsi / reportedResidualPsi),
    };
  });
});

// ===========================================================================
// WHAT THE ENGINE REFUSES TO DO.
//
// Every module that introduces a capability must state its limit. These are the
// engine's own refusals, taken from its headers and its code, and every tier
// needs at least one of them.
// ===========================================================================

export const refusals = () => Object.freeze([
  'the module does not solve the well inflow. There is no IPR anywhere in it.',
  'the module does not solve multiphase outflow. The flowing production traverse used to locate the deepest injection point is PASSED IN as a depth-pressure table, so the caller can build it from a validated nodal model rather than this module inventing a gradient.',
  'the unloading and transfer lines are STRAIGHT LINES on constant gradients. A real unloading column is neither straight nor constant, and the engine does not pretend otherwise, it simply declares the gradient as an input.',
  'the column is STATIC. There is no friction, no velocity, no injection rate in the annulus at all, so the casing pressure it computes is the shut-in gas column and not a flowing one.',
  'intermittent lift is not modelled. Everything here is continuous lift.',
  'the dome charge z uses Dranchuk and Abou-Kassem with nitrogen criticals, which is an extrapolation off the natural gas basis DAK was fitted to. The header says so plainly and pins the window it is defensible in, Tpr 2.3 to 3.1 and Ppr 1 to 5, and it asserts no agreement with data this repo has not verified.',
  'the throughput is Thornhill and Craver, which is an ORIFICE equation. It does not know that a real gas lift valve throttles on its stem before it is fully open, so it is an upper bound on what a valve passes and not a prediction of it.',
  'the target depth mandrel is exempt from minSpacingFt.',
  'for a PPO string the closing test is evaluated on the wrong fluid. This is a PINNED KNOWN DIVERGENCE, not a thing to design on.',
  'deepestInjectionPoint reports a residual that cannot see its own error. Treat the residual as a consistency check between two chords.',
]);

// ===========================================================================
// THE PANEL SURFACE.
//
// Three panels, one per tier, and every mode of every one of them is a call
// into the accessors above. The panels COMPUTE NOTHING. Each entry returns
// plot ready rows plus a VERDICT object, which is the sentence the caption has
// to be able to make without doing arithmetic of its own.
// ===========================================================================

/** `pd-column-explorer`, Associate. Four modes over the published columns. */
export const columnExplorer = Object.freeze({
  columnIds: golden.columns.map((c, i) => i + 1),

  column: (index) => ({
    rows: ruleOfThumbRows(index),
    verdict: (() => {
      const s = ruleOfThumbSummary(index);
      return {
        ruleReadsLow: s.flatMissAtBottomPsi < 0,
        ruleReadsHigh: s.flatMissAtBottomPsi > 0,
        missAtPackerPsi: s.flatMissAtBottomPsi,
        missAsPctOfLift: s.flatMissAsPctOfLift,
        note: 'A flat rule has no pressure in it, so it is wrong in one direction on a high pressure column and in the other on a low pressure one.',
      };
    })(),
  }),

  gradient: (index) => {
    const s = ruleOfThumbSummary(index);
    return {
      rows: ruleOfThumbRows(index),
      control: isothermalControlRows(index),
      isothermal: s,
      verdict: {
        geothermalGradientFallsWithDepth: s.gradientFallsWithDepth,
        isothermalGradientRisesWithDepth: s.isothermalGradientRisesWithDepth,
        geothermalChangePct: s.gradientChangePct,
        isothermalChangePct: s.isothermalGradientChangePct,
        note: 'The gradient grows with PRESSURE. Whether it grows with DEPTH is a race between compression and the geotherm, and on these columns the geotherm wins.',
      },
    };
  },

  convergence: (label) => {
    const target = refinementTargets().find((t) => t.label === label) ?? refinementTargets()[0];
    return {
      rows: stepRefinementRows(target),
      headline: stepRefinementHeadline(target),
      closedForm: closedFormRows(),
      coefficients: closedFormCoefficients(),
      verdict: {
        marchConverges: true,
        textbookFormParks: true,
        note: 'Three references against one march: the truncation column goes to zero, the textbook closed form parks at a floor, the engine constant closed form converges.',
      },
    };
  },

  lines: (id) => ({
    rows: threeLineRows(id),
    crossing: threeLineCrossing(id),
    verdict: {
      topValveFt: threeLineCrossing(id).tvdFt,
      note: 'The top valve sits where the injection line first overcomes a full column of kill fluid, and it is the one depth in the string a decrement change cannot move.',
    },
  }),
});

/** `pd-valve-explorer`, Professional. Four modes over the published designs. */
export const valveExplorer = Object.freeze({
  designIds: PUBLISHED_DESIGN_IDS,

  spacing: (id, decrement) => ({
    recursion: spacingRecursionRows(id, decrement),
    design: designDepthRows(id),
    increments: designSpacingIncrements(id),
    sweep: DECREMENT_SWEEPS[id] ? decrementSweepRows(id) : [],
    verdict: {
      valve1MovesWithDecrement: false,
      note: 'Valve 1 is set by the kickoff pressure alone. Every valve under it moves when the decrement moves, and the move compounds downward.',
    },
  }),

  valve: (id) => ({
    rows: designValveRows(id),
    nitrogen: nitrogenRows(),
    geometry: portGeometryRows(),
    verdict: {
      domeIsAThermometer: true,
      note: 'A dome charge is a thermometer as much as a spring: at a fixed 60 degF charge the pressure the valve feels rises with valve depth, and the linear rule of thumb drifts further the hotter and the deeper it gets.',
    },
  }),

  spread: () => {
    const ppo = ppoDivergence();
    return {
      ipoRows: PUBLISHED_DESIGN_IDS
        .filter((id) => designInputs(id).valveType === 'IPO')
        .map((id) => ({ id, spreads: designValveRows(id).map((v) => ({ valve: v.valve, spreadPsi: v.spreadPsi })) })),
      ppoRows: ppo.spreads,
      verdict: {
        everyPpoSpreadNegative: ppo.everySpreadNegative,
        note: 'A spread is a pressure fall, so a negative one is the two sides swapped and not a valve property. It is a KNOWN DIVERGENCE and the same line that closes a PPO string on the casing.',
      },
    };
  },

  throughput: () => ({
    published: thornhillCraverRows(),
    regime: throughputRegimeRows(),
    portLadder: knifeEdgeGasRateRows(),
    verdict: {
      criticalRatio: criticalPressureRatio(TC_K),
      gasRateMovesInSteps: true,
      note: 'The design gas rate reaches the verdict only through selectPort, so it moves in catalogue steps and not as a slope.',
    },
  }),
});

/** `pd-unloading-explorer`, Expert. Four modes, and the knife edge is PUBLISHED. */
export const unloadingExplorer = Object.freeze({
  designIds: PUBLISHED_DESIGN_IDS,

  stages: (id) => ({
    rows: designUnloadingRows(id),
    verdict: {
      engineAgreesWithOracle: unloadingVerdictAgreement(id),
      multipointingStages: designUnloadingRows(id)
        .filter((s) => s.oracleMultipointing).map((s) => s.stage),
      note: 'The oracle evaluates the closing rule at valve depth off a forward RK4 column, the engine evaluates it at surface by inverting a coarser column. Two roads, one verdict.',
    },
  }),

  knifeedge: (decrement) => {
    const k = knifeEdge();
    return {
      published: k,
      mechanism: knifeEdgeMechanismRows(),
      sweep: decrement === undefined
        ? knifeEdgeDecrementRows()
        : knifeEdgeDecrementRows([decrement]),
      verdict: {
        stage5MarginPsi: k.oracleMarginPsi,
        multipointingStages: k.multipointingStages,
        cleanStages: k.cleanStages,
        note: 'The published case is spaced on 26.75 psi per valve and its stage 5 verdict hangs on a fraction of a psi, flipping on a quarter of a psi of decrement.',
      },
    };
  },

  injectionpoint: () => {
    const shipped = injectionPointShipped();
    const teaching = teachingTraverseRefinementRows();
    const atShippedSpacing = injectionPointTabulationRows()
      .find((r) => r.isShippedSpacing);
    const teachingCoarse = teaching[0];
    return {
      golden: injectionPointGolden(),
      shipped,
      converged: injectionPointConverged(),
      tabulation: injectionPointTabulationRows(),
      column: injectionPointColumnRows(),
      teaching,
      verdict: {
        shippedRatio: shipped.trueOverReported,
        refinementRatioAtShippedSpacing: atShippedSpacing.trueOverReported,
        teachingRatio: teachingCoarse.trueOverReported,
        note: 'The residual does NOT fall as the error falls, because both sides of it come off the same pair of chords. Quote the shipped engine line or the refinement, never both in one sentence.',
      },
    };
  },

  sweep: () => ({
    decrement: knifeEdgeDecrementRows(),
    gasRate: knifeEdgeGasRateRows(),
    verdict: {
      decrementIsSmooth: true,
      gasRateIsAStep: true,
      note: 'Drawing the two on the same axes is the point: a sweep resolution has to match the mechanism, not the axis.',
    },
  }),
});

// ===========================================================================
// THE TEACHING DIGEST.
//
// `teachingDigestLines()` renders, line for line, the file the 78 shipped
// lessons were written from: /root/pd-wip-gaslift/digest.txt, 23 numbered
// sections. It is built ENTIRELY out of the accessors above, so it cannot drift
// from what a panel renders, and gasLiftLab.test.js compares it with that file
// line for line rather than spot checking it. A lab value that disagrees with
// the digest breaks a lesson that is already written.
//
// A number that is not reachable from here is not teaching material. Nothing on
// this list is capstone material: the renderer never calls `okpara...`, `CAP`,
// or `capstoneValues`, and the leak gate in the test proves it by measurement
// rather than by inspection.
// ===========================================================================

const DESIGN_SECTION_NO = Object.freeze({
  westTexasOil: 9,
  deepHighPressure: 10,
  constantPressurePPO: 11,
  midDecrementKnifeEdge: 12,
});

const stageList = (stages) => (stages.length ? stages.join(', ') : 'none');

const buildTeachingDigestLines = () => {
  const out = [];
  const w = (s) => out.push(s);

  // ---------------------------------------------------------------- header
  w('PD2 Gas Lift Design: TEACHING DIGEST');
  w('');
  w('THE ONLY NUMBERS A LESSON MAY QUOTE. Every line names its source: a PUBLISHED');
  w('golden case out of packages/engines/test-data/production/goldens/gaslift_cases.json,');
  w('a DERIVED sweep run on published inputs, or one of the two TEACHING constructs');
  w('this wave designed for itself. NOTHING in this file comes from the graded');
  w('capstone well. The capstone conditions and its eighteen graded answers live in');
  w('a separate file that the generator of this digest never opens.');
  w('');
  w('A leak guard, pd2_leakcheck.mjs, reads the capstone graded field list and every');
  w('number in every line of this file, and rejects the digest if any number lands');
  w('within TEN TIMES a graded field tolerance of that field value, in three unit');
  w('shiftings (as printed, times 1000, times 0.001). academy_submit_capstone grades');
  w('with abs(got - expected) <= tol, so tol is ABSOLUTE in the field own units and');
  w('is not a fraction of anything: ten times it is under a hundredth of a psi on a');
  w('pressure and under a twentieth of a foot on a depth. This file passed that');
  w('guard, and the closest approach anywhere in it is over two hundred tolerances');
  w('away, on a PUBLISHED golden valve setting that this digest is obliged to carry.');
  w('');
  w('Generator: /root/pd-wip-gaslift/pd2_dump.mjs');
  w('Engine:    packages/engines/engines/production/gasLiftDesign.js');
  w('           packages/engines/engines/production/gasLiftValves.js');
  w('           packages/engines/engines/production/gasProperties.js');
  w('Goldens:   packages/engines/test-data/production/goldens/gaslift_cases.json');
  w(`Golden oracle: ${golden.generator}`);
  w('Units: psia, Mscf/d, ft TVD, degF, psi/ft, in, in2, lbm/ft3. Never psig, never SI.');
  w('');
  w('WHAT PROVENANCE LABEL MEANS WHAT');
  w('  golden ...    a value committed in gaslift_cases.json, cut by the independent');
  w('                stdlib oracle (RK4 column, bisection roots) named above.');
  w('  engine ...    the shipped engine re-run on published golden inputs. Where a');
  w('                golden carries the same quantity, the two are reported together');
  w('                so a lesson can see the agreement or the divergence.');
  w('  derived ...   a sweep or refinement run on PUBLISHED inputs by this generator.');
  w('                A sweep point is not a published case. Say so if you print one.');
  w('  teaching ...  a construct this wave invented: the teaching well AKASO-3 and the');
  w('                teaching traverse on it. Not a published case, not a real well,');
  w('                and never to be presented as either.');
  w('');
  w('THE FOUR PUBLISHED DESIGN CASES AT A GLANCE');
  golden.designs.forEach((g) => {
    w(`  ${g.id}`);
    w(`      ${g.note}`);
    w(`      valves = ${g.depths.length}, stop reason = ${g.stopReason}, `
      + `multipointing stages = ${stageList(g.unloading.filter((s) => s.multipointing).map((s) => s.stage))}`);
  });
  w('');
  w('THE ONE TEACHING WELL');
  w('  AKASO-3   a 7200 ft IPO string this wave designed so the same well can be run');
  w('            three ways, on the surface-close convention, on the constant-pressure');
  w('            convention, and as a PPO string, and so a curved flowing traverse');
  w('            exists whose exact crossing is known. It is a TEACHING WELL. It is');
  w('            not in the goldens and no oracle has ever checked it.');
  w('');

  // ---------------------------------------------------------------- section 1
  w('# SECTION 1: PUBLISHED GOLDEN GAS PROPERTIES');
  w('# z of the injection gas from Sutton pseudo-criticals and Dranchuk & Abou-Kassem,');
  w('# and the static gas gradient rho/144 that follows from it. Associate m02 owns');
  w('# these. Note how far the gradient moves between the shallow cold row and the');
  w('# deep hot row: it is not one number.');
  goldenGasPropertyRows().forEach((r) => {
    w(`golden gasProperties, sg ${r.gasSg} at ${f(r.pPsia, 1)} psia ${f(r.tF, 1)} degF, z = ${f(r.z, 9)} dimensionless`);
    w(`golden gasProperties, sg ${r.gasSg} at ${f(r.pPsia, 1)} psia ${f(r.tF, 1)} degF, gas gradient = ${f(r.gradPsiPerFt, 9)} psi/ft`);
  });
  engineGasPropertyRows().forEach((r) => {
    w(`engine gasProperties, sg ${r.gasSg} at ${f(r.pPsia, 1)} psia ${f(r.tF, 1)} degF, z = ${f(r.z, 9)}, gradient = ${f(r.gradPsiPerFt, 9)} psi/ft, `
      + `z difference from golden = ${e(r.zDiffFromGolden, 3)}`);
  });
  acidGasRows().forEach((r) => {
    w(`golden gasPropertiesAcid, sg ${r.gasSg} at ${f(r.pPsia, 1)} psia ${f(r.tF, 1)} degF with yCO2 ${r.yCo2} and yH2S ${r.yH2s}, z = ${f(r.goldenZ, 9)} dimensionless`);
    w(`derived gasPropertiesAcid, the SAME gas with no acid correction, z = ${f(r.cleanZ, 9)} dimensionless`);
    w(`derived gasPropertiesAcid, Wichert and Aziz epsilon = ${f(r.epsilonR, 6)} degR, corrected Tpc = ${f(r.correctedTpcR, 6)} degR, corrected Ppc = ${f(r.correctedPpcPsia, 6)} psia`);
    w(`derived gasPropertiesAcid, uncorrected Sutton Tpc = ${f(r.uncorrectedTpcR, 6)} degR, uncorrected Ppc = ${f(r.uncorrectedPpcPsia, 6)} psia`);
  });
  w('');

  // ---------------------------------------------------------------- section 2
  w('# SECTION 2: PUBLISHED GOLDEN GAS COLUMNS, DOWN AND BACK UP');
  w('# Three columns marched from surface to depth, and the same three inverted back');
  w('# to the surface pressure that produced them. Associate m02 l04 and l05 own the');
  w('# march and the inverse. The round trip closes to under a millionth of a psi,');
  w('# which is what a lesson should say about the inverse: it is a secant on the');
  w('# forward march, so it is exactly as good as the march it inverts and no better.');
  goldenColumnRows().forEach((c) => {
    w(`golden column ${c.index}, inputs: surface ${f(c.pSurfPsia, 1)} psia, depth ${f(c.tvdFt, 1)} ft, sg ${c.gasSg}, wellhead ${f(c.whtF, 1)} degF, bottom ${f(c.bhtF, 1)} degF, linear geotherm`);
    w(`golden column ${c.index}, pressure at depth = ${f(c.goldenBottomPsia, 9)} psia`);
    w(`golden column ${c.index}, surface pressure recovered from that depth pressure = ${f(c.goldenSurfaceFromBottomPsia, 9)} psia`);
    w(`golden column ${c.index}, round trip closure = ${e(c.roundTripClosurePsi, 3)} psi`);
    w(`engine column ${c.index}, pressure at depth at the 40 step default = ${f(c.engineBottomPsia, 9)} psia, difference from golden = ${e(c.engineBottomDiffPsi, 3)} psi`);
    w(`engine column ${c.index}, surface recovered at the 40 step default = ${f(c.engineSurfacePsia, 9)} psia, difference from golden = ${e(c.engineSurfaceDiffPsi, 3)} psi`);
    w(`derived column ${c.index}, total lift of the column = ${f(c.totalLiftPsi, 6)} psi over ${f(c.tvdFt, 0)} ft`);
    w(`derived column ${c.index}, average gradient over the whole column = ${f(c.averageGradientPsiPerFt, 9)} psi/ft`);
  });
  w('');

  // ---------------------------------------------------------------- section 3
  w('# SECTION 3: THE REAL GAS COLUMN AGAINST THE 0.02 PSI/FT RULE OF THUMB');
  w('# DERIVED from the published column cases. Associate m02 l03 and m05 l03 turn on');
  w('# this comparison, so print it rather than assert it. The engine header names the');
  w('# 0.02 psi/ft rule of thumb explicitly as the thing it does not do.');
  w('# READ THE SIGN CAREFULLY, because it is the whole lesson. The real gas gradient');
  w('# is rho / 144 and rho is proportional to p / (z T), so the gradient tracks the');
  w('# PRESSURE LEVEL of the column and not the depth. On the 1414.7 psia column it is');
  w('# close to twice the rule of thumb, on the 1014.7 psia column about a quarter');
  w('# above it, and on the 614.7 psia column about a third BELOW it. A flat rule has');
  w('# no pressure in it at all, so it is wrong in one direction on a high pressure');
  w('# system and wrong in the other direction on a low pressure one. A lesson that');
  w('# says only that the rule of thumb reads low has learned half of it.');
  w('# AND A SECOND THING, which contradicts the easy story. Down a real well the');
  w('# gradient DOES NOT simply grow with depth. Compression pushes it up and the');
  w('# rising geotherm pushes it down, and on all three published columns, which carry');
  w('# ordinary linear geotherms, the temperature wins: the local gradient FALLS a few');
  w('# percent from surface to packer. Hold the temperature constant and the same');
  w('# column shows the gradient rising, which is the isothermal block printed with');
  w('# each column below. The gradient grows with PRESSURE. Whether it grows with');
  w('# DEPTH is a race between two effects and it has to be computed, not assumed.');
  golden.columns.forEach((c, i) => {
    const index = i + 1;
    ruleOfThumbRows(index).forEach((row) => {
      w(`derived rule of thumb, column ${index} (surface ${f(row.pSurfPsia, 1)} psia, sg ${row.gasSg}) at ${f(row.tvdFt, 1)} ft: `
        + `engine column = ${f(row.enginePsia, 6)} psia, flat 0.02 psi/ft rule = ${f(row.flatPsia, 6)} psia, `
        + `rule error = ${f(row.ruleErrorPsi, 6)} psi, engine local gradient = ${f(row.localGradientPsiPerFt, 9)} psi/ft, `
        + `local gradient over 0.02 = ${f(row.gradientOverRule, 6)} ratio, z = ${f(row.z, 9)}, temperature = ${f(row.tF, 4)} degF`);
    });
    const s = ruleOfThumbSummary(index);
    w(`derived rule of thumb, column ${index} summary: the local gradient goes from ${f(s.surfaceGradientPsiPerFt, 9)} psi/ft at surface `
      + `to ${f(s.bottomGradientPsiPerFt, 9)} psi/ft at ${f(s.tvdFt, 0)} ft, a CHANGE of ${f(s.gradientChangePct, 4)} percent, `
      + `while z goes from ${f(s.surfaceZ, 9)} to ${f(s.bottomZ, 9)} and the temperature goes from ${f(s.surfaceTempF, 4)} to ${f(s.bottomTempF, 4)} degF`);
    w(`derived rule of thumb, column ${index} summary: the local gradient therefore FALLS with depth on this well, because the geotherm outruns the compression`);
    w(`derived rule of thumb, column ${index} ISOTHERMAL CONTROL, the same column held at its wellhead temperature ${f(s.isothermalTempF, 1)} degF throughout: `
      + `local gradient goes from ${f(s.isothermalSurfaceGradientPsiPerFt, 9)} psi/ft at surface to ${f(s.isothermalBottomGradientPsiPerFt, 9)} psi/ft at ${f(s.tvdFt, 0)} ft, `
      + `a CHANGE of ${f(s.isothermalGradientChangePct, 4)} percent, and the pressure at depth is ${f(s.isothermalBottomPsia, 9)} psia`);
    w(`derived rule of thumb, column ${index} ISOTHERMAL CONTROL: with the temperature held the gradient RISES with depth, which is compression on its own. `
      + `The geothermal column above is that effect plus the opposite one, and the difference at the packer is ${f(s.isothermalMinusGeothermalPsi, 6)} psi.`);
    w(`derived rule of thumb, column ${index} summary: the flat rule misses the pressure at ${f(s.tvdFt, 0)} ft by ${f(s.flatMissAtBottomPsi, 6)} psi, `
      + `which is ${f(s.flatMissAsPctOfLift, 4)} percent of the whole lift of the column`);
  });
  w('');

  // ---------------------------------------------------------------- section 4
  w('# SECTION 4: THE COLUMN CONVERGES. THE STEP REFINEMENT STUDY');
  w('# DERIVED from the published column cases and the published design packer depths.');
  w('# This is the honest negative result the module is built on, and Associate m05');
  w('# owns it. The march is a predictor with a trapezoidal corrector on the gradient,');
  w('# so it is second order: every doubling of the step count cuts the remaining error');
  w('# by about four. Print the SEQUENCE, not a summary of it, because the skill being');
  w('# taught is reading a convergence sequence and not trusting a claim about one.');
  w('# The engine calls this march internally at steps = 20 for spacing and valve');
  w('# settings, and at steps = 40 for the plotted injection curve, so the last two');
  w('# rows of each block are the number a design actually carries.');
  refinementTargets().forEach((t) => {
    w(`derived step refinement, ${t.label}: surface ${f(t.pSurfPsia, 1)} psia, depth ${f(t.tvdFt, 1)} ft, sg ${t.gasSg}`);
    stepRefinementRows(t).forEach((r) => {
      w(`derived step refinement, ${t.label}, steps = ${String(r.steps).padStart(5)}: column at depth = ${f(r.pPsia, 9)} psia, `
        + `error against the 20000 step reference = ${e(r.errorPsi, 4)} psi`
        + (r.errorRatio === null ? '' : `, error ratio against the previous row = ${f(r.errorRatio, 4)}`));
    });
    const h = stepRefinementHeadline(t);
    w(`derived step refinement, ${t.label}, THE HEADLINE: 20 steps gives ${f(h.at20StepsPsia, 9)} psia, 2000 steps gives ${f(h.at2000StepsPsia, 9)} psia, `
      + `spread = ${e(h.spreadPsi, 4)} psi on a column that lifts ${f(h.liftPsi, 4)} psi`);
    w(`derived step refinement, ${t.label}, the 20 step error as a fraction of the lift = ${e(h.spreadAsFractionOfLift, 4)} ratio`);
  });
  w('derived step refinement, THE LESSON: this column has no truncation problem. The');
  w('derived step refinement, error at the step count the engine actually uses is');
  w('derived step refinement, thousandths of a psi on systems of over a thousand psia,');
  w('derived step refinement, and the error ratio near 4.0 in every block says the');
  w('derived step refinement, method is behaving exactly as its order predicts. A');
  w('derived step refinement, learner who leaves believing every numerical method is');
  w('derived step refinement, suspect has learned the wrong lesson. The skill is');
  w('derived step refinement, telling the two cases apart, and the way you tell them');
  w('derived step refinement, apart is by refining and watching.');
  w('');

  // ---------------------------------------------------------------- section 5
  w('# SECTION 5: THE INJECTION PRESSURE CURVE AND ITS CHORD BIAS');
  w('# DERIVED from the published column cases. injectionPressureCurve tabulates the');
  w('# march at `steps` samples and then reads any depth by STRAIGHT LINE between two');
  w('# samples. That is a second source of error, separate from the march itself, and');
  w('# it is the one the deepest injection point later trips over. Everything here is');
  w('# measured against a converged 20000 step march of the same column.');
  w('# THREE NUMBERS PER ROW, and they mean different things.');
  w('#   deviation AT A SAMPLE is pure march truncation: at a tabulated node there is');
  w('#     no chord, so this is the error of the march at that step count.');
  w('#   deviation BETWEEN SAMPLES is truncation plus chord, which is what a reader of');
  w('#     the plotted curve actually suffers.');
  w('#   CHORD COMPONENT is the second minus the average of the deviations at the two');
  w('#     nodes that bracket it, so it isolates the straight line from the march.');
  w('# The chord component is NEGATIVE on these columns because their gradient falls');
  w('# slightly with depth, which makes the pressure curve concave, and a chord under a');
  w('# concave curve reads low. Associate m05 and Expert m04 both need this block.');
  golden.columns.forEach((c, i) => {
    const index = i + 1;
    chordBiasRows(index).forEach((r) => {
      w(`derived chord bias, column ${index} (surface ${f(r.pSurfPsia, 1)} psia, ${f(r.tvdFt, 0)} ft) at ${String(r.samples).padStart(4)} samples: `
        + `sample spacing = ${f(r.sampleSpacingFt, 4)} ft, worst deviation anywhere = ${e(r.worstPsi, 4)} psi at ${f(r.worstAtFt, 1)} ft, `
        + `deviation AT the sample at ${f(r.nodeFt, 1)} ft = ${e(r.atNodePsi, 4)} psi, `
        + `deviation BETWEEN samples at ${f(r.midFt, 1)} ft = ${e(r.betweenPsi, 4)} psi, `
        + `CHORD COMPONENT = ${e(r.chordComponentPsi, 4)} psi`);
    });
    w(`derived chord bias, column ${index}, THE HEADLINE: the chord component falls by a factor near four for every doubling of the `
      + 'sample count, exactly like the march itself, and at the 64 sample resolution it is thousandths of a psi or smaller. '
      + 'It is NEGATIVE throughout, because these columns have a slightly falling gradient and a chord under a concave curve reads low.');
  });
  w('');

  // ---------------------------------------------------------------- section 6
  w('# SECTION 6: THE ISOTHERMAL CLOSED FORM, THE MARCH SELF CHECK');
  w('# DERIVED. With z pinned at 1 and the temperature held constant the march has a');
  w('# closed form to reproduce, and reproducing it is the self asserting gate on the');
  w('# routine: a numerical method that cannot reproduce the one case it HAS a closed');
  w('# form for is not to be trusted on the cases it has none for.');
  w('#');
  w('# TWO CLOSED FORMS ARE PRINTED HERE AND THE DIFFERENCE BETWEEN THEM IS THE POINT.');
  w('# The textbook form carries the ROUNDED coefficient 0.01875. The engine carries');
  w('# its own constants, AIR_MW 28.9625 lbm/lbmol and R 10.7316 psia ft3 per lbmol');
  w('# degR, whose coefficient is AIR_MW / (144 R) = 0.0187417041, lower by 4.43e-4');
  w('# relative. So the march CANNOT converge onto the textbook form, and against it');
  w('# the error parks at a floor that refinement never removes.');
  w('#');
  w('# The first draft of this block printed only the textbook form and called the');
  w('# result convergence. It was not: the gate could not fail, because it was');
  w('# measuring a fixed constant mismatch. TWO lesson writers independently refined');
  w('# the march, watched the residual park, and reported it rather than writing');
  w('# around it. Against the ENGINE-CONSTANT form the march converges properly, to');
  w('# about 1e-7 psi at 2000 steps, and that number does keep shrinking.');
  w('#');
  w('# Both forms stay in the file. The parked residual is teaching material in its');
  w('# own right, and it is the cleanest demonstration in the wave of the difference');
  w('# between a truncation, which refinement removes, and a difference between two');
  w('# FORMULATIONS, which it never touches. Associate m02 l04 and m05 l04 use it.');
  {
    const k = closedFormCoefficients();
    w(`derived closed form, engine molar mass of air AIR_MW = ${f(k.airMolarMass, 4)} lbm per lbmol`);
    w(`derived closed form, engine gas constant R_UNIVERSAL = ${f(k.gasConstant, 4)} psia ft3 per lbmol degR`);
    w(`derived closed form, textbook coefficient = ${f(k.textbookCoeff, 10)}`);
    w(`derived closed form, engine coefficient, AIR_MW over 144 R = ${f(k.engineCoeff, 10)}`);
    w(`derived closed form, the two coefficients differ by = ${e(k.relativeDifference, 4)} relative`);
    closedFormRows().forEach((c) => {
      w(`derived closed form, surface ${f(c.pSurfPsia, 1)} psia, ${f(c.tvdFt, 0)} ft, sg ${c.gasSg}, isothermal at ${f(c.tF, 1)} degF, z pinned at 1.0:`);
      w(`derived closed form, exact p(D) = pSurf * exp(0.01875 * sg * D / T) = ${f(c.textbookPsia, 9)} psia`);
      w(`derived closed form, ENGINE-CONSTANT p(D) = pSurf * exp(AIR_MW / (144 R) * sg * D / T) = ${f(c.enginePsia, 9)} psia`);
      w(`derived closed form, the two closed forms differ by = ${e(c.formDifferencePsi, 4)} psi`);
      c.marches.forEach((m) => {
        w(`derived closed form, march at ${String(m.steps).padStart(4)} steps = ${f(m.pPsia, 9)} psia, error against the closed form = ${e(m.errorAgainstTextbookPsi, 4)} psi`);
        w(`derived closed form, march at ${String(m.steps).padStart(4)} steps, error against the ENGINE-CONSTANT form = ${e(m.errorAgainstEnginePsi, 4)} psi`);
      });
    });
  }
  w('');

  // ---------------------------------------------------------------- section 7
  w('# SECTION 7: PUBLISHED GOLDEN NITROGEN DOME CHARGES, AND A DOME AS A THERMOMETER');
  w('# The dome charge is set on a 60 degF test rack and then works at valve');
  w('# temperature. The correction is a fixed volume real gas ratio P/(z T) = constant');
  w('# on nitrogen z, and Ct = Pd60 / PdT. Professional m02 l03 owns this. The linear');
  w('# 1 + 0.00215 (T - 60) rule of thumb printed in older manuals is shown beside it,');
  w('# because the engine header names that rule of thumb as the thing it refuses.');
  nitrogenRows().forEach((r) => {
    w(`golden nitrogen, 60 degF charge ${f(r.pd60Psia, 1)} psia at valve temperature ${f(r.tF, 1)} degF, dome at temperature = ${f(r.goldenDomeAtTempPsia, 9)} psia`);
    w(`golden nitrogen, 60 degF charge ${f(r.pd60Psia, 1)} psia at valve temperature ${f(r.tF, 1)} degF, Ct = Pd60 / PdT = ${f(r.goldenCt, 9)} dimensionless`);
    w(`golden nitrogen, 60 degF charge ${f(r.pd60Psia, 1)} psia at valve temperature ${f(r.tF, 1)} degF, z at 60 degF = ${f(r.goldenZ60, 9)}, z at valve temperature = ${f(r.goldenZt, 9)}`);
    w(`engine nitrogen, 60 degF charge ${f(r.pd60Psia, 1)} psia at ${f(r.tF, 1)} degF, dome at temperature = ${f(r.engineDomeAtTempPsia, 9)} psia, difference from golden = ${e(r.engineDomeDiffPsi, 3)} psi`);
    w(`engine nitrogen, inverse from ${f(r.goldenDomeAtTempPsia, 6)} psia at ${f(r.tF, 1)} degF back to 60 degF = ${f(r.engineBackTo60Psia, 9)} psia, difference from the golden charge = ${e(r.engineInverseDiffPsi, 3)} psi`);
    w(`engine nitrogen, temperatureCorrectionFactor at ${f(r.tF, 1)} degF = ${f(r.engineCt, 9)}, difference from golden Ct = ${e(r.engineCtDiff, 3)}`);
    w(`derived nitrogen, the linear rule of thumb 1 / (1 + 0.00215 (T - 60)) at ${f(r.tF, 1)} degF = ${f(r.linearCt, 9)}, `
      + `real gas Ct = ${f(r.goldenCt, 9)}, rule of thumb error = ${f(r.linearCtErrror, 9)} which is ${f(r.linearCtErrorPct, 4)} percent`);
    w(`derived nitrogen, the dome pressure the linear rule of thumb would predict at ${f(r.tF, 1)} degF = ${f(r.linearDomePsia, 6)} psia against the real gas ${f(r.goldenDomeAtTempPsia, 6)} psia, a miss of ${f(r.linearDomeMissPsi, 6)} psi`);
  });
  w('derived nitrogen, a dome charge is therefore a THERMOMETER as much as a spring:');
  w('derived nitrogen, at a fixed 60 degF charge the pressure the valve actually feels');
  w('derived nitrogen, rises with valve depth because the valve gets hotter, and the');
  w('derived nitrogen, rule of thumb drifts further the hotter and the deeper it gets.');
  w('');

  // ---------------------------------------------------------------- section 8
  w('# SECTION 8: PUBLISHED GOLDEN THORNHILL AND CRAVER THROUGHPUT');
  w('# The industry convention for what a port will pass, with the ratio clamped at');
  w('# the critical value so one expression covers both branches continuously.');
  w(`# Professional m05 owns this. Discharge coefficient = ${TC_DISCHARGE_COEFF}, k = 1.27, critical ratio = ${f(criticalPressureRatio(TC_K), 9)}.`);
  thornhillCraverRows().forEach((r) => {
    w(`golden thornhillCraver, port ${r.portIdIn} in, upstream ${f(r.pUpPsia, 1)} psia, downstream ${f(r.pDnPsia, 1)} psia, sg ${r.gasSg}, ${f(r.tF, 1)} degF, `
      + `throughput = ${f(r.goldenQMscfd, 9)} Mscf/d`);
    w(`golden thornhillCraver, port ${r.portIdIn} in, critical pressure ratio = ${f(r.goldenCriticalRatio, 9)} dimensionless`);
    w(`engine thornhillCraver, port ${r.portIdIn} in, upstream ${f(r.pUpPsia, 1)} psia, downstream ${f(r.pDnPsia, 1)} psia, `
      + `throughput = ${f(r.engineQMscfd, 9)} Mscf/d, difference from golden = ${e(r.engineDiffMscfd, 3)} Mscf/d`);
    w(`engine thornhillCraver, port ${r.portIdIn} in, actual pressure ratio = ${f(r.ratio, 9)}, regime = ${r.regime}, port flow area = ${f(r.areaIn2, 9)} in2`);
  });
  w('# DERIVED regime sweep on the first published row: one port, one upstream');
  w('# pressure, downstream walked from choked to nearly balanced. Professional m05 l02');
  w('# owns the flat part of this curve.');
  throughputRegimeRows().forEach((r) => {
    w(`derived throughput regime, port ${r.portIdIn} in, upstream ${f(r.pUpPsia, 1)} psia at ${f(r.tF, 1)} degF sg ${r.gasSg}, `
      + `downstream ${f(r.pDnPsia, 4)} psia, ratio ${f(r.ratio, 9)}, throughput = ${f(r.qMscfd, 6)} Mscf/d, regime = ${r.regime}`);
  });
  w('derived throughput regime, THE POINT: below the critical ratio the rate does not');
  w('derived throughput regime, change at all as the downstream pressure falls, so a');
  w('derived throughput regime, throughput number quoted without its regime is half a');
  w('derived throughput regime, statement.');
  w('# DERIVED port area and ratio table for the two bellows sizes the published cases');
  w('# use. Professional m02 l02 owns R = Ap / Ab.');
  portGeometryRows().forEach((r) => {
    w(`derived port geometry, port ${r.portIdIn} in, area = ${f(r.areaIn2, 9)} in2, bellows ${r.bellowsAreaIn2} in2, `
      + `R = ${f(r.r, 9)}, `
      + `1 / (1 - R) = ${f(r.oneOverOneMinusR, 9)}`);
  });
  w('');

  // ------------------------------------------------------- sections 9 to 12
  golden.designs.forEach((g) => {
    const id = g.id;
    const i = g.inputs;
    const agree = designAgreement(id);
    w(`# SECTION ${DESIGN_SECTION_NO[id]}: PUBLISHED DESIGN CASE ${id}`);
    w(`# ${g.note}`);
    w(`golden design ${id}, input pKickoffPsia = ${f(i.pKickoffPsia, 1)} psia`);
    w(`golden design ${id}, input pOperatingPsia = ${f(i.pOperatingPsia, 1)} psia`);
    w(`golden design ${id}, input pWhUnloadPsia = ${f(i.pWhUnloadPsia, 1)} psia`);
    w(`golden design ${id}, input method = ${i.method}`);
    w(`golden design ${id}, input dpPerValvePsi = ${f(i.dpPerValvePsi, 2)} psi per valve`);
    w(`golden design ${id}, input dpTransferPsi = ${f(i.dpTransferPsi, 1)} psi`);
    w(`golden design ${id}, input killGradPsiPerFt = ${i.killGradPsiPerFt} psi/ft`);
    w(`golden design ${id}, input unloadGradPsiPerFt = ${i.unloadGradPsiPerFt} psi/ft`);
    w(`golden design ${id}, input gasSg = ${i.gasSg}`);
    w(`golden design ${id}, input maxDepthFt = ${f(i.maxDepthFt, 1)} ft, minSpacingFt = ${f(i.minSpacingFt, 1)} ft, maxValves = ${i.maxValves}`);
    w(`golden design ${id}, input wellhead temperature = ${f(i.wht, 1)} degF, bottom temperature = ${f(i.bht, 1)} degF at reference depth ${f(i.refDepth, 1)} ft`);
    w(`golden design ${id}, input valveType = ${i.valveType}, bellowsAreaIn2 = ${i.bellowsAreaIn2} in2, bottomOrifice = ${i.bottomOrifice}, orificeIdIn = ${i.orificeIdIn}`);
    w(`golden design ${id}, input port catalog = ${i.ports.join(', ')} in`);
    w(`golden design ${id}, input qgiTargetMscfd = ${f(i.qgiTargetMscfd, 1)} Mscf/d`);
    w(`golden design ${id}, stop reason = ${g.stopReason}`);
    w(`golden design ${id}, valve count = ${g.depths.length}`);
    designDepthRows(id).forEach((d) => {
      w(`golden design ${id}, valve ${d.valve} depth = ${f(d.depthFt, 9)} ft, surface injection pressure at its stage = ${f(d.surfacePressurePsia, 4)} psia`);
    });
    designSpacingIncrements(id).forEach((d) => {
      w(`derived design ${id}, spacing increment valve ${d.from} to valve ${d.to} = ${f(d.incrementFt, 9)} ft against a stated minimum of ${f(d.minSpacingFt, 1)} ft`);
    });
    w(`engine design ${id}, stop reason = ${agree.engineStopReason}, valve count = ${agree.engineValveCount}, `
      + `largest depth difference from the golden = ${e(agree.largestDepthDiffFt, 3)} ft`);
    w(`engine design ${id}, pOperatingPsia carried into the plotted injection curve = ${f(agree.pOperatingPsia, 4)} psia`);
    w(`engine design ${id}, warnings raised = ${agree.warningCodes.length ? agree.warningCodes.join(', ') : 'none'}`);
    agree.warnings.forEach((x, k) => w(`engine design ${id}, warning ${k + 1} (${x.code}): ${x.message}`));
    designValveRows(id).forEach((v) => {
      const tag = `${id} valve ${v.valve}`;
      w(`golden ${tag}, depth = ${f(v.depthFt, 9)} ft, temperature at depth = ${f(v.tempF, 9)} degF, type = ${v.valveType}, port = ${v.portIdIn} in`);
      w(`golden ${tag}, injection pressure at depth = ${f(v.pInjAtDepthPsia, 9)} psia, production pressure at depth = ${f(v.pProdAtDepthPsia, 9)} psia`);
      if (v.r !== null) w(`golden ${tag}, port to bellows ratio R = ${f(v.r, 9)}`);
      if (v.domeAtTempPsia !== null) w(`golden ${tag}, dome pressure at valve temperature = ${f(v.domeAtTempPsia, 9)} psia`);
      if (v.dome60Psia !== null) w(`golden ${tag}, dome pressure at the 60 degF test rack = ${f(v.dome60Psia, 9)} psia`);
      if (v.testRackOpeningPsia !== null) w(`golden ${tag}, test rack opening pressure = ${f(v.testRackOpeningPsia, 9)} psia`);
      if (v.spreadPsi !== null) w(`golden ${tag}, spread = ${f(v.spreadPsi, 9)} psi`);
      if (v.closingSurfacePressurePsia !== null) w(`golden ${tag}, closing surface pressure = ${f(v.closingSurfacePressurePsia, 9)} psia`);
      w(`golden ${tag}, throughput = ${f(v.throughputMscfd, 9)} Mscf/d`);
      w(`engine ${tag}, throughput regime = ${v.engineThroughputRegime}, passes the ${f(i.qgiTargetMscfd, 0)} Mscf/d target = ${v.enginePassesTarget}, `
        + `closes at the operating surface pressure ${f(agree.pOperatingPsia, 1)} psia = ${v.engineClosesAtOperating}`);
      w(`engine ${tag}, differences from the golden: ${v.differences.map((d) => `${d.key} ${e(d.diff, 2)}`).join(', ')}`);
      if (v.valveType !== 'orifice') {
        const pick = designPortSelection(id, v.valve);
        w(`derived ${tag}, port selection at this stage differential, smallest port that passes ${f(i.qgiTargetMscfd, 0)} Mscf/d = `
          + `${pick.chosenIdIn === null ? 'none in the catalog' : `${pick.chosenIdIn} in`}`);
        pick.candidates.forEach((c) => {
          w(`derived ${tag}, port candidate ${c.portIdIn} in passes ${f(c.qMscfd, 6)} Mscf/d, regime ${c.regime}, ratio ${f(c.ratio, 9)}`);
        });
      }
    });
    w(`# ${id} unloading, stage by stage. The golden closingMargins come from the`);
    w('# oracle, which evaluates the published closing rule (Takacs ch. 3, Brown vol. 2a,');
    w('# API Book 6) AT VALVE DEPTH off a forward RK4 column. The engine evaluates the');
    w('# same rule AT SURFACE by inverting a coarser column, so the two are different');
    w('# roads to the same verdict and a lesson may say so.');
    designUnloadingRows(id).forEach((s) => {
      w(`golden ${id} stage ${s.stage}, point of injection transfers to valve ${s.valve} at ${f(s.depthFt, 9)} ft`);
      w(`golden ${id} stage ${s.stage}, surface injection pressure = ${f(s.surfaceInjectionPsia, 4)} psia`);
      w(`golden ${id} stage ${s.stage}, injection pressure at that depth = ${f(s.injectionAtDepthPsia, 9)} psia, production pressure at that depth = ${f(s.productionAtDepthPsia, 9)} psia`);
      w(`golden ${id} stage ${s.stage}, fluid level = ${f(s.fluidLevelFt, 9)} ft, gas rate through the valve = ${f(s.gasRateMscfd, 9)} Mscf/d, passes target = ${s.passesTarget}`);
      w(`golden ${id} stage ${s.stage}, upper valves still open = ${s.oracleUpperValvesOpen.length ? s.oracleUpperValvesOpen.join(', ') : 'none'}, multipointing = ${s.oracleMultipointing}`);
      s.closingMargins.forEach((m) => {
        w(`golden ${id} stage ${s.stage}, closing margin on valve ${m.valve}: family ${m.family}, acting on the ${m.actingOn} side, `
          + `acting pressure at valve depth = ${f(m.actingPressurePsia, 9)} psia, dome at valve temperature = ${f(m.domeAtTempPsia, 9)} psia, `
          + `margin = ${f(m.marginPsi, 9)} psi, spread = ${f(m.spreadPsi, 9)} psi, open = ${m.open}`
          + (m.casingDropPsi === null ? '' : `, casing has dropped ${f(m.casingDropPsi, 9)} psi from this valve own opening stage`));
      });
      w(`engine ${id} stage ${s.stage}, upper valves still open = ${s.engineUpperValvesOpen.length ? s.engineUpperValvesOpen.join(', ') : 'none'}, multipointing = ${s.engineMultipointing}`);
      s.surfaceTests.forEach((t) => {
        w(`engine ${id} stage ${s.stage}, surface test on valve ${t.valve}: casing ${f(t.casingPsia, 4)} psia against the closing surface pressure ${f(t.closingSurfacePressurePsia, 9)} psia, `
          + `surface margin = ${f(t.surfaceMarginPsi, 9)} psi, open = ${t.open}`);
      });
    });
    w(`engine design ${id}, VERDICT AGREEMENT with the oracle across all ${g.unloading.length} stages = ${unloadingVerdictAgreement(id)}`);
    w('');
  });

  // ---------------------------------------------------------------- section 13
  w('# SECTION 13: THE PPO DIVERGENCE, BOTH SIDES OF IT');
  w('# A PINNED KNOWN DIVERGENCE, not a bug to be worked around in a lesson and not a');
  w('# worked example. Professional m03 states it as a limit. Expert may cite it as the');
  w('# clearest case in the course of a verdict that is confident and wrong.');
  w('# The engine computes closingSurfacePressurePsia by taking the dome charge, which');
  w('# for a PPO valve balances against the TUBING, and inverting it up a CASING gas');
  w('# column. unloadingSequence then compares that number with the casing pressure. So');
  w('# a production operated string is closed on the wrong fluid. Not fixed, because the');
  w('# engine is consumed by a live Suite app.');
  {
    const p = ppoDivergence();
    p.casingRows.forEach((r) => {
      w(`engine PPO divergence, valve ${r.valve} at ${f(r.depthFt, 6)} ft: the engine casing side test compares the constant surface pressure `
        + `${f(r.surfacePsia, 1)} psia with a closing surface pressure of ${f(r.closingSurfacePressurePsia, 9)} psia, `
        + `so it clears the open threshold by ${f(r.clearsByPsi, 9)} psi and the engine calls the valve OPEN`);
    });
    p.tubingRows.forEach((r) => {
      w(`golden PPO divergence, valve ${r.valve}: the published rule for a PPO valve tests the TUBING at valve depth, `
        + `${f(r.actingPressurePsia, 9)} psia against a dome at valve temperature of ${f(r.domeAtTempPsia, 9)} psia, `
        + `so it MISSES the open threshold by ${f(r.missesByPsi, 9)} psi and the oracle calls the valve SHUT`);
    });
    w(`derived PPO divergence, the casing side clears by ${f(p.casingClearsFromPsi, 6)} to ${f(p.casingClearsToPsi, 6)} psi across the six valves`);
    w(`derived PPO divergence, the tubing side rule it should be judged by misses by ${f(p.tubingMissesFromPsi, 6)} to ${f(p.tubingMissesToPsi, 6)} psi on every valve`);
    w(`engine PPO divergence, the engine therefore reports multipointing at stages ${p.engineMultipointingStages.join(', ')} `
      + `with upper valves ${JSON.stringify(p.engineOpenByStage)}`);
    w(`golden PPO divergence, the oracle reports multipointing at ${p.oracleMultipointingStages.length ? p.oracleMultipointingStages.join(', ') : 'no stage at all'}, `
      + 'every stage clean');
    w(`derived PPO divergence, the two disagree on all ${p.laterStages} later stages of this design`);
    w('derived PPO divergence, THE SECOND SYMPTOM: every spread in this PPO string is');
    w('derived PPO divergence, NEGATIVE, because valveSpread is handed the production');
    w('derived PPO divergence, pressure as the opening side and the casing as the other');
    w('derived PPO divergence, side, and on this well the casing is far above the tubing.');
    p.spreads.forEach((s) => {
      w(`golden PPO divergence, valve ${s.valve} spread = ${f(s.spreadPsi, 9)} psi, which a lesson must read as a sign that the sides have been swapped and not as a valve property`);
    });
  }
  w('');

  // ---------------------------------------------------------------- section 14
  w('# SECTION 14: THE TOP VALVE, AND THE FIXED POINT THAT FINDS IT');
  w('# DERIVED on published inputs. Valve 1 sits where the injection line first');
  w('# overcomes a full column of kill fluid above the unloading wellhead pressure.');
  w('# The depth depends on the injection pressure which depends on the depth, so the');
  w('# engine iterates. The first iterate is the answer you would get if gas were');
  w('# weightless, and the sequence shows exactly what the weight of the gas buys you.');
  w('# Associate m04 owns all of this.');
  golden.designs.forEach((g) => {
    const t = topValveIteration(g.id);
    w(`derived top valve, ${g.id}: kickoff ${f(t.pKickoffPsia, 1)} psia, unloading wellhead ${f(t.pWhUnloadPsia, 1)} psia, kill fluid ${t.killGradPsiPerFt} psi/ft`);
    w(`derived top valve, ${g.id}, iterate 0 (weightless gas, (pKickoff - pWhUnload) / killGrad) = ${f(t.weightlessFt, 9)} ft`);
    t.iterates.forEach((it) => {
      w(`derived top valve, ${g.id}, iterate ${it.iterate}: injection pressure at ${f(it.atFt, 6)} ft = ${f(it.pInjPsia, 9)} psia, next depth = ${f(it.nextFt, 9)} ft, move = ${f(it.moveFt, 9)} ft`);
    });
    w(`engine top valve, ${g.id}, topValveDepth returns ${f(t.engineFt, 9)} ft, and the published valve 1 depth is ${f(t.publishedValve1Ft, 9)} ft`);
    w(`derived top valve, ${g.id}, the weight of the gas moves the top valve DEEPER by ${f(t.gasWeightBuysFt, 9)} ft `
      + `against the weightless answer, which is ${f(t.gasWeightBuysPct, 4)} percent`);
    w(`derived top valve, ${g.id}, the top valve depends on the kickoff pressure and NOT on the decrement, so it is the one depth in the string that a decrement change cannot move`);
  });
  w('# DERIVED: what moves the top valve. One input walked at a time, all others held');
  w('# at the published westTexasOil values. Associate m04 l03 owns this.');
  topValveSweepRows('pKickoffPsia').forEach((r) => {
    w(`derived top valve sweep, westTexasOil with kickoff ${f(r.value, 1)} psia, top valve = ${f(r.topValveFt, 9)} ft`);
  });
  topValveSweepRows('pWhUnloadPsia').forEach((r) => {
    w(`derived top valve sweep, westTexasOil with unloading wellhead ${f(r.value, 1)} psia, top valve = ${f(r.topValveFt, 9)} ft`);
  });
  topValveSweepRows('killGradPsiPerFt').forEach((r) => {
    w(`derived top valve sweep, westTexasOil with kill fluid ${r.value} psi/ft, top valve = ${f(r.topValveFt, 9)} ft`);
  });
  topValveSweepRows('gasSg').forEach((r) => {
    w(`derived top valve sweep, westTexasOil with injection gas sg ${r.value}, top valve = ${f(r.topValveFt, 9)} ft`);
  });
  w('derived top valve sweep, THE ORDER OF INFLUENCE on this well: the kill fluid');
  w('derived top valve sweep, gradient and the kickoff pressure move the top valve');
  w('derived top valve sweep, hundreds of feet, the wellhead pressure moves it tens of');
  w('derived top valve sweep, feet, and the gas gravity moves it tens of feet through');
  w('derived top valve sweep, the weight of the injection column alone.');
  w('');

  // ---------------------------------------------------------------- section 15
  w('# SECTION 15: SPACING IS A RECURSION, MADE VISIBLE');
  w('#');
  w('# PROVENANCE, AND IT MATTERS BECAUSE TWO SETS OF NUMBERS LIVE IN THIS FILE.');
  w('# The depths and increments below come from a STANDALONE RE-RUN of the spacing');
  w('# recursion, iterate by iterate, so a lesson can show it converging. Section 9');
  w('# prints the depths and increments the DESIGN ITSELF returned. The two agree to');
  w('# about seven significant figures and disagree after that: valve 1 to valve 2 is');
  w('# 1563.466592902 ft here and 1563.466503048 ft there, and the pattern repeats');
  w('# down the string. Neither is wrong. They are two roads to one quantity, and the');
  w('# fixed point is stopped at a tolerance rather than solved exactly.');
  w('#');
  w('# So do not pair a head from this section with an increment from section 9. A');
  w('# lesson writer reported the trap after keeping each of their lessons internally');
  w('# consistent on one road or the other, which is the right way to handle it.');
  w('#');
  w('# DERIVED on published westTexasOil inputs. Professional m01 owns this. Valve n');
  w('# sits where the injection line at the decremented surface pressure, less the');
  w('# transfer differential, still beats the transfer pressure at valve n-1, with kill');
  w('# fluid in between. Written out, valve n is the fixed point of');
  w('#   d = d(n-1) + ( pInj(pSurf(n), d) - dpTransfer - pProd(n-1) ) / killGrad');
  w('# and the engine iterates it to 0.01 ft. Here is that iteration, valve by valve.');
  {
    const i = designInputs('westTexasOil');
    spacingRecursionRows('westTexasOil').forEach((v) => {
      w(`derived spacing recursion, westTexasOil valve ${v.valve}: surface pressure at this stage = ${f(i.pKickoffPsia, 1)} - ${v.valve - 1} x ${f(v.decrementPsi, 2)} = ${f(v.surfacePressurePsia, 4)} psia`);
      w(`derived spacing recursion, westTexasOil valve ${v.valve}: valve ${v.previousValve} sits at ${f(v.previousFt, 9)} ft and its transfer production pressure is `
        + `${f(i.pWhUnloadPsia, 1)} + ${i.unloadGradPsiPerFt} x ${f(v.previousFt, 6)} = ${f(v.previousTransferPsia, 9)} psia`);
      w(`derived spacing recursion, westTexasOil valve ${v.valve}: iterate 0 (the minimum spacing seed) = ${f(v.seedFt, 9)} ft`);
      v.iterates.forEach((it) => {
        w(`derived spacing recursion, westTexasOil valve ${v.valve}: iterate ${it.iterate}: injection at ${f(it.atFt, 6)} ft = ${f(it.pInjPsia, 9)} psia, `
          + `available head = ${f(it.availableHeadPsi, 9)} psi, next depth = ${f(it.nextFt, 9)} ft, move = ${f(it.moveFt, 9)} ft`);
      });
      w(`derived spacing recursion, westTexasOil valve ${v.valve}: converged at ${f(v.convergedFt, 9)} ft, published depth is ${f(v.publishedFt, 9)} ft`
        + (v.isTargetDepthMandrel ? ' (the last mandrel is pulled to the target depth, see section 18)' : ''));
      w(`derived spacing recursion, westTexasOil valve ${v.valve}: increment from valve ${v.previousValve} = ${f(v.incrementFt, 9)} ft`);
    });
    w('derived spacing recursion, THE SHAPE OF IT: the increments SHRINK on the way down,');
    w('derived spacing recursion, because the surface pressure is falling by a fixed');
    w('derived spacing recursion, amount per valve while the transfer pressure it has to');
    w('derived spacing recursion, beat is rising with depth. That is why a string runs out');
    w('derived spacing recursion, of room rather than running out of valves.');
    designSpacingIncrements('westTexasOil').forEach((d) => {
      w(`derived spacing recursion, westTexasOil increment ${d.from} to ${d.to} = ${f(d.incrementFt, 9)} ft`);
    });
  }
  w('');

  // ---------------------------------------------------------------- section 16
  w('# SECTION 16: CHANGE ONE DECREMENT, MOVE EVERY DEPTH BELOW IT');
  w('# DERIVED on published inputs, one input walked. This is the block that proves');
  w('# result 2 of the course: a design is a string and not a list of valves.');
  w('# Valve 1 NEVER moves, because it is set by the kickoff pressure alone. Every valve');
  w('# under it moves, and the move compounds downward.');
  ['westTexasOil', 'midDecrementKnifeEdge'].forEach((id) => {
    decrementSweepRows(id).forEach((r) => {
      const tag = r.isPublished ? ' (THE PUBLISHED VALUE)' : '';
      w(`derived decrement sweep, ${id} at ${f(r.decrementPsi, 2)} psi per valve${tag}: valve count = ${r.valveCount}, stop reason = ${r.stopReason}`);
      r.depths.forEach((d) => {
        w(`derived decrement sweep, ${id} at ${f(r.decrementPsi, 2)} psi per valve, valve ${d.valve} depth = ${f(d.depthFt, 9)} ft`
          + (d.shiftFt === null ? ' (this valve does not exist in the published design)' : `, shift against the published design = ${f(d.shiftFt, 9)} ft`));
      });
      w(`derived decrement sweep, ${id} at ${f(r.decrementPsi, 2)} psi per valve, deepest valve = ${f(r.deepestFt, 9)} ft, `
        + `multipointing stages = ${stageList(r.multipointingStages)}`);
    });
    w(`derived decrement sweep, ${id}, THE POINT: valve 1 reads the same depth in every`);
    w(`derived decrement sweep, ${id}, row of this sweep and nothing below it does. A`);
    w(`derived decrement sweep, ${id}, decrement is not a property of one valve, it is the`);
    w(`derived decrement sweep, ${id}, step size of the whole recursion.`);
  });
  w('');

  // ---------------------------------------------------------------- section 17
  w('# SECTION 17: TWO CONVENTIONS, ONE RECURSION');
  w('# DERIVED. surfaceClose drops the surface injection pressure a fixed amount per');
  w('# valve, which is what makes the upper valves close as the point of injection moves');
  w('# down. constantPressure holds the surface pressure and leans on the transfer');
  w('# differential alone: the engine sets the decrement to zero and runs the SAME');
  w('# recursion. Professional m01 l04 owns this. The published constantPressurePPO case');
  w('# is the convention seen on its own; here it is seen as a difference, by running');
  w('# two published designs both ways.');
  ['westTexasOil', 'midDecrementKnifeEdge'].forEach((id) => {
    const c = conventionComparison(id);
    w(`derived convention, ${id} on surfaceClose at ${f(c.decrementPsi, 2)} psi per valve (THE PUBLISHED SETUP): `
      + `${c.surfaceClose.valveCount} valves, stop reason ${c.surfaceClose.stopReason}, deepest ${f(c.surfaceClose.deepestFt, 9)} ft`);
    w(`derived convention, ${id} on constantPressure: ${c.constantPressure.valveCount} valves, stop reason ${c.constantPressure.stopReason}, deepest ${f(c.constantPressure.deepestFt, 9)} ft`);
    c.rows.forEach((r) => {
      w(`derived convention, ${id} valve ${r.valve}: surfaceClose = ${r.surfaceCloseFt === null ? 'no valve' : `${f(r.surfaceCloseFt, 9)} ft at ${f(r.surfaceClosePsia, 4)} psia`}, `
        + `constantPressure = ${r.constantPressureFt === null ? 'no valve' : `${f(r.constantPressureFt, 9)} ft at ${f(r.constantPressurePsia, 4)} psia`}`);
    });
    w(`derived convention, ${id} on constantPressure, multipointing stages = ${stageList(c.constantPressure.multipointingStages)}`);
    w(`derived convention, ${id} on surfaceClose, multipointing stages = ${stageList(c.surfaceClose.multipointingStages)}`);
  });
  w('derived convention, THE TRADE: holding the surface pressure reaches the target in');
  w('derived convention, FEWER valves and wider steps, and it removes the very mechanism');
  w('derived convention, that shuts the upper valves, so the string that needs fewer');
  w('derived convention, mandrels is the string more likely to inject at two depths.');
  w('');

  // ---------------------------------------------------------------- section 18
  w('# SECTION 18: WHERE SPACING STOPS, AND THE MINIMUM SPACING EXEMPTION');
  w('# Four stop reasons exist and three of them raise a warning. Professional m01 l05');
  w('# owns this. The exemption is a real engine behaviour and a lesson must state it.');
  w('# DEFECT (d), stated as a limit: when the recursion lands at or past the floor the');
  w('# engine pushes that mandrel to the floor and stops WITHOUT testing minSpacingFt,');
  w('# so the target-depth mandrel is exempt from the minimum the design declared.');
  stopReasonRows().forEach((r) => {
    w(`golden stop reason, ${r.id} = ${r.stopReason}, last increment = ${f(r.lastIncrementFt, 9)} ft against a stated minSpacingFt of ${f(r.minSpacingFt, 1)} ft, `
      + `exempt = ${r.exempt}`);
  });
  {
    const m = minSpacingExemption();
    w('derived minSpacing exemption, the published westTexasOil case lands its last mandrel '
      + `${f(m.exemptLastIncrementFt, 9)} ft from its neighbour against a stated 250 ft minimum, `
      + 'and no warning is raised, because the stop reason is targetDepth and that branch returns before the minSpacing test');
    w(`derived minSpacing exemption, the published deepHighPressure case DOES stop on minSpacing, at ${m.checkedValveCount} valves, `
      + `its deepest mandrel at ${f(m.checkedDeepestFt, 9)} ft and so still `
      + `${f(m.checkedShortOfFloorFt, 9)} ft short of its floor of ${f(m.checkedFloorFt, 1)} ft. `
      + 'The next valve the recursion wanted would have sat inside the 300 ft minimum, so the string stopped and the minSpacing warning WAS raised. '
      + 'That is the branch westTexasOil never reaches, and the two can be shown side by side');
  }
  w('# DERIVED: driving westTexasOil into each of the other stop reasons, one input at a time.');
  stopReasonSweepRows('maxValves').forEach((r) => {
    w(`derived stop reason sweep, westTexasOil with maxValves ${r.value}: ${r.valveCount} valves, stop reason ${r.stopReason}, `
      + `deepest ${f(r.deepestFt, 9)} ft, warnings ${r.warningCodes.join(', ') || 'none'}`);
  });
  stopReasonSweepRows('minSpacingFt').forEach((r) => {
    w(`derived stop reason sweep, westTexasOil with minSpacingFt ${f(r.value, 1)} ft: ${r.valveCount} valves, stop reason ${r.stopReason}, `
      + `deepest ${f(r.deepestFt, 9)} ft, warnings ${r.warningCodes.join(', ') || 'none'}`);
  });
  stopReasonSweepRows('dpPerValvePsi').forEach((r) => {
    w(`derived stop reason sweep, westTexasOil with ${f(r.value, 1)} psi per valve: ${r.valveCount} valves, stop reason ${r.stopReason}, `
      + `deepest ${f(r.deepestFt, 9)} ft, warnings ${r.warningCodes.join(', ') || 'none'}`);
  });
  {
    const small = portTooSmallStudy();
    w('derived stop reason sweep, westTexasOil with only a 0.125 in port in the catalog against a 900 Mscf/d target: '
      + `warnings ${small.warningCodes.join(', ') || 'none'}`);
    small.messages.slice(0, 3).forEach((msg) => w(`derived stop reason sweep, portTooSmall message: ${msg}`));
  }
  w('');

  // ---------------------------------------------------------------- section 19
  w('# SECTION 19: WHAT FLIPS THE MULTIPOINTING VERDICT');
  w('# DERIVED sweeps on the PUBLISHED midDecrementKnifeEdge case. Expert m02 and m05');
  w('# own this. That case is spaced on 26.75 psi per valve, a decrement in the middle of');
  w('# the usual 20 to 50 psi band, and its stage 5 verdict on valve 4 hangs on a fraction');
  w('# of a psi. The engine surface margin and the oracle valve-depth margin are two');
  w('# different numbers for the same knife edge, and BOTH are small, which is the point.');
  w('#');
  w('# THE MECHANISM, STATED OUTRIGHT, because it is more teachable than "hangs on a');
  w('# fraction of a psi" and the file only ever implied it. Across all six charged');
  w('# valves of this case the open flag IS the test of the casing DROP since a valve');
  w('# own opening stage against that valve SPREAD. Valve 4 opens with a spread of');
  w('# 32.272254090 psi against a drop of 32.122462454 psi, and the difference between');
  w('# those two numbers, 0.149791635 psi, is the whole knife edge. Section 12 carries');
  w('# the drop beside the spread on every valve, so the rule can be checked rather');
  w('# than believed. A lesson writer worked it out from those rows and said so.');
  w('#');
  w('# AND A TRAP THAT FOLLOWS FROM IT. The SURFACE decrement is 26.75 psi per valve,');
  w('# but the drop a valve actually feels AT DEPTH runs from 28.652797457 psi at valve');
  w('# 1 to 33.355029522 psi at valve 6. Compare a spread against the decrement rather');
  w('# than against the drop and you will pick the wrong valves.');
  {
    const k = knifeEdge();
    w('golden knife edge, published stage 5 closing margin on valve 4 (oracle, at valve depth) = '
      + `${f(k.oracleMarginPsi, 9)} psi`);
    w('engine knife edge, published stage 5 surface margin on valve 4 (engine, at surface) = '
      + `${f(k.engineMarginPsi, 9)} psi`);
    w(`derived knife edge, the whole system runs at ${f(k.pKickoffPsia, 1)} psia at surface and ${f(k.injectionAtValve4Psia, 6)} psia at valve 4, `
      + 'so that verdict is a fraction of a psi on a system of over a thousand psia');
    w('# 19a. DECREMENT. Fine sweep across the flip.');
    knifeEdgeDecrementRows().forEach((r) => {
      w(`derived knife edge decrement, ${f(r.decrementPsi, 2)} psi per valve${r.isPublished ? ' (THE PUBLISHED VALUE)' : ''}: `
        + `stage 5 surface margin on valve 4 = ${f(r.stage5MarginPsi, 9)} psi, stage 5 multipointing = ${r.stage5Multipointing}, `
        + `all multipointing stages = ${stageList(r.multipointingStages)}`);
    });
    w('derived knife edge decrement, THE FLIP sits between 26.80 and 26.90 psi per valve,');
    w('derived knife edge decrement, so under a tenth of a psi per valve of decrement, on');
    w('derived knife edge decrement, a design nobody would look at twice, changes the most');
    w('derived knife edge decrement, consequential boolean this engine emits.');
    w('# 19b. PORT SIZE, which reaches the verdict through R = Ap / Ab and therefore');
    w('# through the dome charge and the closing pressure. Catalog reduced to a single');
    w('# port so every valve carries it.');
    knifeEdgePortRows().forEach((r) => {
      w(`derived knife edge port, every valve on a ${r.portIdIn} in port: R = ${f(r.r, 9)}, `
        + `closing surface pressures = ${r.closingSurfacePressures.map((x) => (x === null ? 'orifice' : f(x, 6))).join(' ')}, `
        + `stage 5 surface margin on valve 4 = ${f(r.stage5MarginPsi, 9)} psi, multipointing stages = ${stageList(r.multipointingStages)}`);
    });
    w('# 19c. BELLOWS AREA, the other half of R.');
    knifeEdgeBellowsRows().forEach((r) => {
      w(`derived knife edge bellows, bellows ${r.bellowsAreaIn2} in2${r.isPublished ? ' (THE PUBLISHED VALUE)' : ''}: R = ${f(r.r, 9)}, `
        + `stage 5 surface margin on valve 4 = ${f(r.stage5MarginPsi, 9)} psi, multipointing stages = ${stageList(r.multipointingStages)}`);
    });
    w('# 19d. DESIGN GAS RATE, which reaches the verdict only through port SELECTION, so');
    w('# it does nothing at all until the target crosses a catalog step and then it moves');
    w('# the verdict in one jump. This is a different SHAPE of sensitivity from the');
    w('# decrement, and a lesson should say so.');
    knifeEdgeGasRateRows().forEach((r) => {
      w(`derived knife edge gas rate, target ${f(r.qgiTargetMscfd, 0)} Mscf/d${r.isPublished ? ' (THE PUBLISHED VALUE)' : ''}: `
        + `ports chosen = ${r.ports.join(', ')}, stage 5 surface margin on valve 4 = ${f(r.stage5MarginPsi, 9)} psi, `
        + `multipointing stages = ${stageList(r.multipointingStages)}`);
    });
    w('# 19e. THE TRANSFER DIFFERENTIAL and the UNLOADING GRADIENT, for completeness.');
    knifeEdgeTransferRows().forEach((r) => {
      w(`derived knife edge transfer, dpTransferPsi ${f(r.value, 1)} psi${r.isPublished ? ' (THE PUBLISHED VALUE)' : ''}: valve count ${r.valveCount}, `
        + `deepest ${f(r.deepestFt, 9)} ft, multipointing stages = ${stageList(r.multipointingStages)}`);
    });
    knifeEdgeUnloadGradientRows().forEach((r) => {
      w(`derived knife edge unloading gradient, ${r.value} psi/ft${r.isPublished ? ' (THE PUBLISHED VALUE)' : ''}: valve count ${r.valveCount}, `
        + `deepest ${f(r.deepestFt, 9)} ft, multipointing stages = ${stageList(r.multipointingStages)}`);
    });
    w('# 19f. THE VALIDATION GAP, stated. Defect (a), now closed.');
    w('derived validation gap, the oracle unloading() was a STUB: it walked the valves and');
    w('derived validation gap, appended an empty open-valve list for every stage without');
    w('derived validation gap, ever evaluating the condition, and no unloading key was');
    w('derived validation gap, written into the goldens at all. The multipointing verdict');
    w('derived validation gap, was therefore UNGATED while looking gated, which is worse');
    w('derived validation gap, than an ungated function, because the extraction gate whole');
    w('derived validation gap, premise is that an independent oracle checked the engine.');
    w('derived validation gap, Closed by engines PR #110, which derives the verdict from the');
    w('derived validation gap, published closing rule at valve depth off a forward RK4');
    w('derived validation gap, column, where the engine evaluates it at surface by inverting');
    w('derived validation gap, a coarser column. The goldens gained an unloading key on');
    const vg = validationGap();
    w(`derived validation gap, every design, ${vg.stageRows} stage rows and ${vg.marginRows} closing-margin`);
    w('derived validation gap, rows, plus a fourth published case, midDecrementKnifeEdge.');
    w(`derived validation gap, Engine agreement is exact on all ${vg.ipoStages} stages of the three`);
    w('derived validation gap, IPO designs. THE LESSON TO DRAW is about the shape of the');
    w('derived validation gap, failure: coverage that is not coverage. A boolean that');
    w('derived validation gap, consequential is not a detail of the output, it IS the output.');
    w(`derived validation gap, sign agreement between the engine surface margin and the oracle valve-depth margin on every IPO closing-margin row = ${vg.signAgreement}`);
  }
  w('');

  // ---------------------------------------------------------------- section 20
  w('# SECTION 20: THE DEEPEST INJECTION POINT, AND THE CHORD THAT CANNOT SEE ITSELF');
  w('# DEFECT (b). Expert m03 and m04 own this. deepestInjectionPoint locates the');
  w('# crossing between two tabulated traverse points by straight line on the margin,');
  w('# and it reads the injection pressure by straight line between two tabulated column');
  w('# samples. BOTH SIDES of the residual therefore come off the same pair of chords,');
  w('# so the residual it reports is a statement that the two chords agree with each');
  w('# other and nothing more. Refine the tabulation and the answer moves while the');
  w('# reported residual stays small.');
  w('#');
  w('# TWO RUNS LIVE IN THIS SECTION AND THEY ARE NOT THE SAME RUN. Read the labels.');
  w('#');
  w('#   THE ENGINE LINE, below, is the shipped answer as the shipped engine produces');
  w('#   it: the published 1000 ft tabulation AND the injection curve at the sample');
  w('#   count the engine defaults to. It reports -1.317711139 ft of depth error, a');
  w('#   residual of 4.6770e-3 psi, a true residual of 1.58211e-1 psi, and a ratio of');
  w('#   33.83. That is the number a user of the studio is actually handed.');
  w('#');
  w('#   THE REFINEMENT ROWS hold the injection column CONVERGED and vary only the');
  w('#   tabulation spacing, so the chord error being measured is the traverse chord');
  w('#   alone. At the same shipped 1000 ft spacing they report -1.318735072 ft,');
  w('#   4.8890e-3 psi, 1.5833e-1 psi and a ratio of 32.386. That is the number that');
  w('#   isolates the mechanism.');
  w('#');
  w('# Both are correct and they answer different questions. Quote either, never both');
  w('# in one sentence, and say which one you are quoting. TWO lesson writers hit this');
  w('# fork independently and both kept their lessons on one road, which is why it is');
  w('# now labelled here rather than left for a third to find.');
  {
    const ip = injectionPointGolden();
    w(`golden injectionPoint, inputs: surface ${f(ip.pSurfPsia, 1)} psia, sg ${ip.gasSg}, transfer differential ${f(ip.dpTransferPsi, 1)} psi, `
      + `maximum depth ${f(ip.maxDepthFt, 1)} ft, wellhead ${f(ip.whtF, 1)} degF, bottom ${f(ip.bhtF, 1)} degF at ${f(ip.refDepthFt, 1)} ft`);
    ip.traverse.forEach((row) => w(`golden injectionPoint, published flowing traverse row: ${f(row.tvdFt, 1)} ft, ${f(row.pPsia, 4)} psia`));
    w(`derived injectionPoint, the published tabulation is ${ip.rows} rows at ${f(ip.rowSpacingFt, 1)} ft spacing`);
    w(`golden injectionPoint, expected depth = ${f(ip.expectedDepthFt, 9)} ft`);
    w(`golden injectionPoint, expected injection pressure at that depth = ${f(ip.expectedPInjPsia, 9)} psia`);
    w(`golden injectionPoint, expected production pressure at that depth = ${f(ip.expectedPProdPsia, 9)} psia`);
    w(`golden injectionPoint, expected limitedBy = ${ip.expectedLimitedBy}`);
    const shipped = injectionPointShipped();
    w(`engine injectionPoint, depth = ${f(shipped.depthFt, 9)} ft, injection = ${f(shipped.pInjPsia, 9)} psia, production = ${f(shipped.pProdPsia, 9)} psia, limitedBy = ${shipped.limitedBy}`);
    w(`engine injectionPoint, REPORTED residual at the crossing = ${e(shipped.reportedResidualPsi, 5)} psi, against the 0.5 psi its own gate allows`);
    w('derived injectionPoint, TO REFINE A TABULATION YOU NEED SOMETHING TO REFINE IT');
    w('derived injectionPoint, TOWARD. This digest builds a monotone cubic through the');
    w('derived injectionPoint, published traverse rows and treats it as the continuous');
    w('derived injectionPoint, flowing traverse the tabulation samples. It reproduces every');
    w('derived injectionPoint, published row exactly and it is a TEACHING CONSTRUCT, not a');
    w('derived injectionPoint, published curve, so a lesson may quote its numbers only as');
    w('derived injectionPoint, a refinement study and never as the golden answer.');
    const conv = injectionPointConverged();
    w(`derived injectionPoint, converged crossing against that continuous traverse and a converged column = ${f(conv.depthFt, 9)} ft`);
    w(`derived injectionPoint, converged injection pressure = ${f(conv.pInjPsia, 9)} psia, converged production pressure = ${f(conv.pProdPsia, 9)} psia, converged residual = ${e(conv.residualPsi, 3)} psi`);
    w(`derived injectionPoint, the SHIPPED tabulation answer sits ${f(shipped.depthErrorFt, 9)} ft and ${f(shipped.pressureErrorPsi, 9)} psi from the converged answer`);
    w(`derived injectionPoint, and the TRUE residual at the shipped answer is ${e(shipped.trueResidualPsi, 5)} psi, `
      + `which is ${f(shipped.trueOverReported, 2)} times the residual the function reported`);
    w('# 20a. TABULATION REFINEMENT: the traverse resampled from that continuous curve at');
    w('# rising row counts, with the column held converged. Watch the depth march and the');
    w('# reported residual fail to track it.');
    injectionPointTabulationRows().forEach((r) => {
      w(`derived injectionPoint refinement, tabulation spacing ${f(r.spacingFt, 4)} ft (${r.rows} rows)`
        + `${r.isShippedSpacing ? ' (THE SPACING THE PUBLISHED CASE SHIPS)' : ''}: `
        + `depth = ${f(r.depthFt, 9)} ft, depth error = ${f(r.depthErrorFt, 9)} ft, injection = ${f(r.pInjPsia, 9)} psia, `
        + `REPORTED residual = ${e(r.reportedResidualPsi, 4)} psi, TRUE residual at that depth = ${e(r.trueResidualPsi, 4)} psi, `
        + `true over reported = ${f(r.trueOverReported, 3)}`);
    });
    w('# 20b. COLUMN REFINEMENT with the published 9 row tabulation held fixed. This is');
    w('# the other chord, and it barely moves the answer, which is exactly why the defect');
    w('# is hard to see: refining the thing that is easy to refine changes nothing.');
    injectionPointColumnRows().forEach((r) => {
      w(`derived injectionPoint column refinement, injection curve at ${String(r.steps).padStart(4)} samples: depth = ${f(r.depthFt, 9)} ft, `
        + `injection = ${f(r.pInjPsia, 9)} psia, reported residual = ${e(r.reportedResidualPsi, 4)} psi`);
    });
    w('derived injectionPoint, THE LESSON: a small residual proves the two chords agree');
    w('derived injectionPoint, with each other. It says nothing whatever about whether');
    w('derived injectionPoint, either chord is near the curve. The residual does NOT fall');
    w('derived injectionPoint, as the error falls, and on the coarsest rows it is the');
    w('derived injectionPoint, SMALLEST reported residual that carries the LARGEST error.');
    w('# 20c. THE OTHER STOP: limitedBy. When gas still wins at the deepest tabulated row');
    w('# the function returns that row and says depth, not pressure, and a lesson must not');
    w('# read that as a crossing.');
    injectionPointLimitedByRows(LIMITED_BY_HIGH_PSIA).forEach((r) => {
      w(`derived injectionPoint limitedBy, surface ${f(r.pSurfPsia, 1)} psia: depth = ${f(r.depthFt, 9)} ft, injection = ${f(r.pInjPsia, 9)} psia, `
        + `production = ${f(r.pProdPsia, 9)} psia, limitedBy = ${r.limitedBy}`);
    });
    injectionPointLimitedByRows(LIMITED_BY_LOW_PSIA).forEach((r) => {
      w(`derived injectionPoint limitedBy, surface ${f(r.pSurfPsia, 1)} psia: depth = ${f(r.depthFt, 9)} ft, injection = ${f(r.pInjPsia, 9)} psia, `
        + `production = ${f(r.pProdPsia, 9)} psia, limitedBy = ${r.limitedBy}`);
    });
    w('derived injectionPoint limitedBy, THE THIRD RETURN: when the gas loses at the very');
    w('derived injectionPoint limitedBy, first tabulated row the function returns depth 0');
    w('derived injectionPoint limitedBy, and calls it limitedBy pressure, which is the');
    w('derived injectionPoint limitedBy, engine way of saying the well will not lift at all');
    w('derived injectionPoint limitedBy, on this injection pressure.');
    w('# 20d. WHAT DEPTH BUYS. The crossing walked against the surface injection pressure');
    w('# and against the transfer differential, on the published traverse.');
    depthPurchaseBySurfaceRows().forEach((r) => {
      w(`derived injectionPoint depth purchase, surface ${f(r.pSurfPsia, 1)} psia buys ${f(r.depthFt, 9)} ft of injection depth (limitedBy ${r.limitedBy})`);
    });
    depthPurchaseByTransferRows().forEach((r) => {
      w(`derived injectionPoint depth purchase, transfer differential ${f(r.dpTransferPsi, 1)} psi${r.isPublished ? ' (THE PUBLISHED VALUE)' : ''} gives ${f(r.depthFt, 9)} ft (limitedBy ${r.limitedBy})`);
    });
  }
  w('');

  // ---------------------------------------------------------------- section 21
  w('# SECTION 21: TEACHING WELL AKASO-3');
  w('# A TEACHING WELL. It is not in the goldens, no oracle has ever checked it, and a');
  w('# lesson must call it a teaching well every time it prints one of these numbers.');
  w('# It exists so the SAME string can be shown three ways: on the surface-close');
  w('# convention, on the constant-pressure convention, and as a PPO string, which no');
  w('# single published case can do.');
  {
    const TW = TEACHING_WELL;
    w(`teaching well AKASO-3, input pKickoffPsia = ${f(TW.pKickoffPsia, 1)} psia`);
    w(`teaching well AKASO-3, input pOperatingPsia = ${f(TW.pOperatingPsia, 1)} psia`);
    w(`teaching well AKASO-3, input pWhUnloadPsia = ${f(TW.pWhUnloadPsia, 1)} psia`);
    w(`teaching well AKASO-3, input killGradPsiPerFt = ${TW.killGradPsiPerFt} psi/ft, unloadGradPsiPerFt = ${TW.unloadGradPsiPerFt} psi/ft`);
    w(`teaching well AKASO-3, input dpTransferPsi = ${f(TW.dpTransferPsi, 1)} psi, dpPerValvePsi = ${f(TW.dpPerValvePsi, 1)} psi per valve`);
    w(`teaching well AKASO-3, input gasSg = ${TW.gasSg}, maxDepthFt = ${f(TW.maxDepthFt, 1)} ft, minSpacingFt = ${f(TW.minSpacingFt, 1)} ft, maxValves = ${TW.maxValves}`);
    w(`teaching well AKASO-3, input wellhead temperature = ${f(TW.wht, 1)} degF, bottom temperature = ${f(TW.bht, 1)} degF at reference depth ${f(TW.refDepth, 1)} ft`);
    w(`teaching well AKASO-3, input bellowsAreaIn2 = ${TW.bellowsAreaIn2} in2, orificeIdIn = ${TW.orificeIdIn} in, qgiTargetMscfd = ${f(TW.qgiTargetMscfd, 1)} Mscf/d`);
    w(`teaching well AKASO-3, input port catalog = ${TW.ports.join(', ')} in`);
    TEACHING_WELL_VARIANTS.forEach(({ name }) => {
      const r = teachingWellDesign(name);
      w(`teaching well AKASO-3 (${name}), stop reason = ${r.stopReason}, valve count = ${r.depths.length}, warnings = ${r.warnings.map((x) => x.code).join(', ') || 'none'}`);
      teachingWellValveRows(name).forEach((v) => {
        w(`teaching well AKASO-3 (${name}), valve ${v.valve}: depth = ${f(v.depthFt, 9)} ft, surface injection pressure at its stage = ${f(v.surfacePressurePsia, 4)} psia, `
          + `temperature = ${f(v.tempF, 6)} degF, type = ${v.valveType}, port = ${v.portIdIn} in`);
        w(`teaching well AKASO-3 (${name}), valve ${v.valve}: injection at depth = ${f(v.pInjAtDepthPsia, 9)} psia, production at depth = ${f(v.pProdAtDepthPsia, 9)} psia, `
          + `throughput = ${f(v.throughputMscfd, 9)} Mscf/d, regime = ${v.throughputRegime}`);
        if (v.domeAtTempPsia !== null && v.domeAtTempPsia !== undefined) {
          w(`teaching well AKASO-3 (${name}), valve ${v.valve}: R = ${f(v.r, 9)}, dome at temperature = ${f(v.domeAtTempPsia, 9)} psia, `
            + `dome at 60 degF = ${f(v.dome60Psia, 9)} psia, test rack opening = ${f(v.testRackOpeningPsia, 9)} psia, `
            + `spread = ${f(v.spreadPsi, 9)} psi, closing surface pressure = ${f(v.closingSurfacePressurePsia, 9)} psia`);
        }
      });
      teachingWellUnloadingRows(name).forEach((s) => {
        w(`teaching well AKASO-3 (${name}), stage ${s.stage}: casing ${f(s.surfaceInjectionPsia, 4)} psia, fluid level ${f(s.fluidLevelFt, 9)} ft, `
          + `gas rate ${f(s.gasRateMscfd, 9)} Mscf/d, upper valves open = ${s.upperValvesOpen.length ? s.upperValvesOpen.join(', ') : 'none'}, multipointing = ${s.multipointing}`);
        s.surfaceTests.forEach((t) => {
          w(`teaching well AKASO-3 (${name}), stage ${s.stage}, surface test on valve ${t.valve}: casing ${f(t.casingPsia, 4)} psia against closing ${f(t.closingSurfacePressurePsia, 9)} psia, `
            + `margin = ${f(t.marginPsi, 9)} psi`);
        });
      });
      teachingWellLineRows(name).forEach((r2) => {
        w(`teaching well AKASO-3 (${name}), operating injection curve at ${f(r2.tvdFt, 1)} ft = ${f(r2.operatingInjectionPsia, 9)} psia`);
      });
      w(`teaching well AKASO-3 (${name}), unloading line, kill fluid from surface: pressure at ${f(TW.maxDepthFt, 0)} ft = ${f(TW.pWhUnloadPsia + TW.killGradPsiPerFt * TW.maxDepthFt, 9)} psia`);
      w(`teaching well AKASO-3 (${name}), transfer line, wellhead plus lifted gradient: pressure at ${f(TW.maxDepthFt, 0)} ft = ${f(TW.pWhUnloadPsia + TW.unloadGradPsiPerFt * TW.maxDepthFt, 9)} psia`);
    });
  }
  w('');

  // ---------------------------------------------------------------- section 22
  w('# SECTION 22: TEACHING TRAVERSE ON AKASO-3, AND THE CHORD DEFECT AT FULL SIZE');
  w('# A TEACHING CONSTRUCT. The published golden traverse is nearly straight, so its');
  w('# chord error is small. Real flowing traverses curve, because holdup and friction');
  w('# change with depth. This teaching traverse is an explicit smooth curve,');
  w('#   p(D) = 144.7 + 0.11 D + 8e-6 D^2 psia, 0 to 7200 ft,');
  w('# so its exact crossing against a converged gas column is known to machine');
  w('# precision and the tabulation can be coarsened and refined at will. It is NOT a');
  w('# published case and NOT a measured traverse. It is here so Expert m04 can show the');
  w('# defect at a size a learner can see.');
  {
    teachingTraverseRows().forEach((r) => {
      w(`teaching traverse AKASO-3, flowing production pressure at ${f(r.tvdFt, 1)} ft = ${f(r.pProdPsia, 9)} psia`);
    });
    const x = teachingTraverseExact();
    w(`teaching traverse AKASO-3, EXACT crossing against a converged column at ${f(x.pSurfPsia, 1)} psia surface with a ${f(x.dpTransferPsi, 1)} psi transfer differential = ${f(x.depthFt, 9)} ft`);
    w(`teaching traverse AKASO-3, exact injection pressure at the crossing = ${f(x.pInjPsia, 9)} psia`);
    w(`teaching traverse AKASO-3, exact production pressure at the crossing = ${f(x.pProdPsia, 9)} psia`);
    w(`teaching traverse AKASO-3, residual at the exact crossing = ${e(x.residualPsi, 3)} psi`);
    teachingTraverseRefinementRows().forEach((r) => {
      w(`teaching traverse AKASO-3 refinement, tabulation spacing ${f(r.spacingFt, 4)} ft (${r.rows} rows): `
        + `depth = ${f(r.depthFt, 9)} ft, depth error = ${f(r.depthErrorFt, 9)} ft, `
        + `injection = ${f(r.pInjPsia, 9)} psia, pressure error = ${f(r.pressureErrorPsi, 9)} psi, `
        + `REPORTED residual = ${e(r.reportedResidualPsi, 4)} psi, TRUE residual at that depth = ${e(r.trueResidualPsi, 4)} psi, `
        + `true over reported = ${f(r.trueOverReported, 2)}`);
    });
    w('teaching traverse AKASO-3 refinement, THE HEADLINE A LESSON CAN PRINT: on a 2400 ft');
    w('teaching traverse AKASO-3 refinement, tabulation the crossing lands tens of feet');
    w('teaching traverse AKASO-3 refinement, shallow of the truth while the function reports');
    w('teaching traverse AKASO-3 refinement, a residual of hundredths of a psi, comfortably');
    w('teaching traverse AKASO-3 refinement, inside the 0.5 psi its own gate allows, and the');
    w('teaching traverse AKASO-3 refinement, residual it cannot see is hundreds of times');
    w('teaching traverse AKASO-3 refinement, larger than the one it can. A self consistent');
    w('teaching traverse AKASO-3 refinement, wrong answer is the hardest kind to catch.');
  }
  w('');

  // ---------------------------------------------------------------- section 23
  w('# SECTION 23: WHAT THE ENGINE REFUSES TO DO');
  w('# Every module that introduces a capability must state its limit. These are the');
  w('# engine own refusals, taken from its headers and its code, and every tier needs');
  w('# at least one of them.');
  w('refusal, the module does not solve the well inflow. There is no IPR anywhere in it.');
  w('refusal, the module does not solve multiphase outflow. The flowing production');
  w('refusal, traverse used to locate the deepest injection point is PASSED IN as a');
  w('refusal, depth-pressure table, so the caller can build it from a validated nodal');
  w('refusal, model rather than this module inventing a gradient.');
  w('refusal, the unloading and transfer lines are STRAIGHT LINES on constant gradients.');
  w('refusal, a real unloading column is neither straight nor constant, and the engine');
  w('refusal, does not pretend otherwise, it simply declares the gradient as an input.');
  w('refusal, the column is STATIC. There is no friction, no velocity, no injection rate');
  w('refusal, in the annulus at all, so the casing pressure it computes is the shut-in');
  w('refusal, gas column and not a flowing one.');
  w('refusal, intermittent lift is not modelled. Everything here is continuous lift.');
  w('refusal, the dome charge z uses Dranchuk and Abou-Kassem with nitrogen criticals,');
  w('refusal, which is an extrapolation off the natural gas basis DAK was fitted to. The');
  w('refusal, header says so plainly and pins the window it is defensible in, Tpr 2.3 to');
  w('refusal, 3.1 and Ppr 1 to 5, and it asserts no agreement with data this repo has not');
  w('refusal, verified.');
  w('refusal, the throughput is Thornhill and Craver, which is an ORIFICE equation. It');
  w('refusal, does not know that a real gas lift valve throttles on its stem before it is');
  w('refusal, fully open, so it is an upper bound on what a valve passes and not a');
  w('refusal, prediction of it.');
  w('refusal, the target depth mandrel is exempt from minSpacingFt. See section 18.');
  w('refusal, for a PPO string the closing test is evaluated on the wrong fluid. See');
  w('refusal, section 13. This is a PINNED KNOWN DIVERGENCE, not a thing to design on.');
  w('refusal, deepestInjectionPoint reports a residual that cannot see its own error. See');
  w('refusal, section 20. Treat the residual as a consistency check between two chords.');
  w('');
  w('END OF DIGEST');

  return out;
};

/**
 * The digest, line for line. Memoised: it is a pure render of the accessors
 * above and both the panels and the tests ask for it more than once.
 */
export const teachingDigestLines = memoize(buildTeachingDigestLines);

/** The digest as one string, exactly as the generator writes the file. */
export const teachingDigestText = () => `${teachingDigestLines().join('\n')}\n`;

// ===========================================================================
// THE TEACHING QUANTITIES.
//
// Every number a panel can render or a lesson can quote, reachable as
// `{ label, value }` by a deep walk of the panel facing accessors, plus every
// number the digest prints. The list is built ENTIRELY out of the accessors
// above, so it cannot drift from what a panel shows, and the leak gate in
// gasLiftLab.test.js is run over BOTH lists.
//
// A number that is not reachable from here is not teaching material. Nothing on
// either list is capstone material: neither ever calls `okpara...`, `CAP` or
// `capstoneValues`, and the leak gate proves it by measurement rather than by
// inspection.
// ===========================================================================

/** Every accessor a panel may call, by name, with the arguments a panel would pass. */
export const teachingAccessors = () => {
  const named = [
    ['GAS_LIFT_THRESHOLDS', () => GAS_LIFT_THRESHOLDS],
    ['goldenGasPropertyRows', goldenGasPropertyRows],
    ['engineGasPropertyRows', engineGasPropertyRows],
    ['acidGasRows', acidGasRows],
    ['goldenColumnRows', goldenColumnRows],
    ['closedFormCoefficients', closedFormCoefficients],
    ['closedFormRows', closedFormRows],
    ['nitrogenRows', nitrogenRows],
    ['thornhillCraverRows', thornhillCraverRows],
    ['throughputRegimeRows', throughputRegimeRows],
    ['portGeometryRows', portGeometryRows],
    ['stopReasonRows', stopReasonRows],
    ['minSpacingExemption', minSpacingExemption],
    ['ppoDivergence', ppoDivergence],
    ['knifeEdge', knifeEdge],
    ['knifeEdgeMechanismRows', knifeEdgeMechanismRows],
    ['knifeEdgeDecrementRows', knifeEdgeDecrementRows],
    ['knifeEdgePortRows', knifeEdgePortRows],
    ['knifeEdgeBellowsRows', knifeEdgeBellowsRows],
    ['knifeEdgeGasRateRows', knifeEdgeGasRateRows],
    ['knifeEdgeTransferRows', knifeEdgeTransferRows],
    ['knifeEdgeUnloadGradientRows', knifeEdgeUnloadGradientRows],
    ['validationGap', validationGap],
    ['injectionPointGolden', injectionPointGolden],
    ['injectionPointShipped', injectionPointShipped],
    ['injectionPointConverged', injectionPointConverged],
    ['injectionPointTabulationRows', injectionPointTabulationRows],
    ['injectionPointColumnRows', injectionPointColumnRows],
    ['injectionPointLimitedByHigh', () => injectionPointLimitedByRows(LIMITED_BY_HIGH_PSIA)],
    ['injectionPointLimitedByLow', () => injectionPointLimitedByRows(LIMITED_BY_LOW_PSIA)],
    ['depthPurchaseBySurfaceRows', depthPurchaseBySurfaceRows],
    ['depthPurchaseByTransferRows', depthPurchaseByTransferRows],
    ['teachingTraverseRows', teachingTraverseRows],
    ['teachingTraverseExact', teachingTraverseExact],
    ['teachingTraverseRefinementRows', teachingTraverseRefinementRows],
    ['portTooSmallStudy', portTooSmallStudy],
    ['columnExplorer.convergence', () => columnExplorer.convergence('published column 1')],
    ['valveExplorer.spread', valveExplorer.spread],
    ['valveExplorer.throughput', valveExplorer.throughput],
    ['unloadingExplorer.injectionpoint', unloadingExplorer.injectionpoint],
    ['unloadingExplorer.knifeedge', () => unloadingExplorer.knifeedge()],
    ['unloadingExplorer.sweep', unloadingExplorer.sweep],
  ];
  golden.columns.forEach((c, i) => {
    named.push([`ruleOfThumbRows ${i + 1}`, () => ruleOfThumbRows(i + 1)]);
    named.push([`ruleOfThumbSummary ${i + 1}`, () => ruleOfThumbSummary(i + 1)]);
    named.push([`isothermalControlRows ${i + 1}`, () => isothermalControlRows(i + 1)]);
    named.push([`chordBiasRows ${i + 1}`, () => chordBiasRows(i + 1)]);
    named.push([`columnExplorer.column ${i + 1}`, () => columnExplorer.column(i + 1)]);
    named.push([`columnExplorer.gradient ${i + 1}`, () => columnExplorer.gradient(i + 1)]);
  });
  refinementTargets().forEach((t) => {
    named.push([`stepRefinementRows ${t.label}`, () => stepRefinementRows(t)]);
    named.push([`stepRefinementHeadline ${t.label}`, () => stepRefinementHeadline(t)]);
  });
  PUBLISHED_DESIGN_IDS.forEach((id) => {
    named.push([`designDepthRows ${id}`, () => designDepthRows(id)]);
    named.push([`designSpacingIncrements ${id}`, () => designSpacingIncrements(id)]);
    named.push([`designAgreement ${id}`, () => designAgreement(id)]);
    named.push([`designValveRows ${id}`, () => designValveRows(id)]);
    named.push([`designUnloadingRows ${id}`, () => designUnloadingRows(id)]);
    named.push([`spacingRecursionRows ${id}`, () => spacingRecursionRows(id)]);
    named.push([`topValveIteration ${id}`, () => topValveIteration(id)]);
    named.push([`threeLineRows ${id}`, () => threeLineRows(id)]);
    named.push([`threeLineCrossing ${id}`, () => threeLineCrossing(id)]);
    named.push([`conventionComparison ${id}`, () => conventionComparison(id)]);
    named.push([`unloadingExplorer.stages ${id}`, () => unloadingExplorer.stages(id)]);
    named.push([`valveExplorer.valve ${id}`, () => valveExplorer.valve(id)]);
    named.push([`valveExplorer.spacing ${id}`, () => valveExplorer.spacing(id)]);
    named.push([`columnExplorer.lines ${id}`, () => columnExplorer.lines(id)]);
    publishedDesignRecord(id).valves.forEach((v, k) => {
      if (v.valveType === 'orifice') return;
      named.push([`designPortSelection ${id} ${k + 1}`, () => designPortSelection(id, k + 1)]);
    });
  });
  Object.keys(TOP_VALVE_SWEEPS).forEach((which) => {
    named.push([`topValveSweepRows ${which}`, () => topValveSweepRows(which)]);
  });
  Object.keys(STOP_REASON_SWEEPS).forEach((which) => {
    named.push([`stopReasonSweepRows ${which}`, () => stopReasonSweepRows(which)]);
  });
  Object.keys(DECREMENT_SWEEPS).forEach((id) => {
    named.push([`decrementSweepRows ${id}`, () => decrementSweepRows(id)]);
  });
  TEACHING_WELL_VARIANTS.forEach(({ name }) => {
    named.push([`teachingWellValveRows ${name}`, () => teachingWellValveRows(name)]);
    named.push([`teachingWellUnloadingRows ${name}`, () => teachingWellUnloadingRows(name)]);
    named.push([`teachingWellLineRows ${name}`, () => teachingWellLineRows(name)]);
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

/** The teaching quantities as a Map from label to the list of values under it. */
export const teachingQuantityMap = () => {
  const map = new Map();
  teachingQuantities().forEach(({ label, value }) => {
    if (!map.has(label)) map.set(label, []);
    map.get(label).push(value);
  });
  return map;
};

/** Every finite number a lesson or a panel can read out of this lab. */
export const teachingNumbers = () => teachingQuantities()
  .map((r) => r.value)
  .filter((v) => typeof v === 'number' && Number.isFinite(v));

/** The number token pattern the wave's own leak guard, pd2_leakcheck.mjs, uses. */
const DIGEST_NUMBER = /-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g;

/** Every number PRINTED in the digest, at the precision it is printed. */
export const teachingDigestNumbers = (lines = teachingDigestLines()) => {
  const out = [];
  lines.forEach((line) => {
    const m = line.match(DIGEST_NUMBER);
    if (!m) return;
    m.forEach((tok) => {
      const x = Number(tok);
      if (Number.isFinite(x)) out.push(x);
    });
  });
  return out;
};

// ===========================================================================
// THE CAPSTONE: OKPARA-9 AND ITS EIGHTEEN GRADED FIELDS.
//
// EVERYTHING BELOW THIS LINE IS CAPSTONE MATERIAL AND MUST NEVER REACH A LESSON
// OR A PANEL. It is reproduced here, call for call, so that the grader, this
// file's own tests and the migration headers all read ONE derivation, and so
// that a panel author who wants what a capstone reader does is pushed to the
// teaching mirror instead of to the graded well.
//
// Every export from here down is named `CAP`, `OKPARA_...`, `okpara...`,
// `CAPSTONE_...`, `capstone...`, `LEAK_GUARD_...` or `leakGuard...`. That naming
// is the whole guard: gasLiftLab.test.js greps the panel sources for exactly
// those names and fails the build if one appears.
//
// OKPARA-9 is a 9640 ft oil well on continuous gas lift whose string multipoints
// in the MIDDLE and not at the top or the bottom, whose stage 4 verdict sits on
// fourteen hundredths of a psi, and whose deepest injection point was solved on
// the kickoff pressure the well does not run on. Nothing about it is quotable.
// ===========================================================================

export const OKPARA_LABEL = 'OKPARA-9';

export const CAP = Object.freeze({
  gasSg: 0.682,
  whtF: 103.5,
  bhtF: 236.5,
  refDepthFt: 10250,
  maxDepthFt: 9640,
  pKickoffPsia: 1268.3,
  pOperatingPsia: 1178.3,
  dpPerValvePsi: 48.9,
  dpTransferPsi: 58.5,
  killGradPsiPerFt: 0.468,
  unloadGradPsiPerFt: 0.094,
  pWhUnloadPsia: 186.4,
  minSpacingFt: 335,
  maxValves: 11,
  bellowsAreaIn2: 0.99,
  portsIn: [0.28125, 0.34375, 0.40625, 0.46875, 0.5625],
  orificeIdIn: 0.34375,
  qgiTargetMscfd: 2062,
  valveType: 'IPO',
  method: 'surfaceClose',
  bottomOrifice: true,
  colSteps: 96,
  curveSteps: 64,
  injCurveReadFt: 5375,
  packerTargetPsia: 1585,
  pwhFlowPsia: 224.6,
  gTopPsiPerFt: 0.062,
  gBotPsiPerFt: 0.229,
  travRowsFine: 401,
  travRowsCoarse: 7,
  knifeEdgeDecrements: [46.5, 48.6, 48.9, 49.02, 49.03, 49.2, 51],
  columnStepLadder: [2, 20, 40, 96, 400, 2000],
  traverseRowLadder: [7, 13, 25, 41, 97, 401, 2001],
});

/**
 * The capstone's own lifted flowing traverse: an analytic gradient rising
 * linearly from gTop at surface to gBot at the packer, sampled into the table
 * the engine asks for. The teaching mirror is `teachingTraverseRows`.
 */
export const okparaTraverse = (rows) => Array.from({ length: rows }, (_, i) => {
  const tvdFt = (CAP.maxDepthFt * i) / (rows - 1);
  return {
    tvdFt,
    pPsia: CAP.pwhFlowPsia + CAP.gTopPsiPerFt * tvdFt
      + ((CAP.gBotPsiPerFt - CAP.gTopPsiPerFt) * tvdFt * tvdFt) / (2 * CAP.maxDepthFt),
  };
});

/** The whole capstone chain, in the order the engine headers walk it. */
export const okparaCase = () => {
  const tempAtDepthF = linearTemperature({
    whtF: CAP.whtF, bhtF: CAP.bhtF, refDepthFt: CAP.refDepthFt,
  });
  const zKickoff = naturalGasZ({ pPsia: CAP.pKickoffPsia, tF: CAP.whtF, gasSg: CAP.gasSg });
  const gradKickoff = gasGradient({
    pPsia: CAP.pKickoffPsia, tF: CAP.whtF, gasSg: CAP.gasSg, z: zKickoff,
  });
  const colArgs = { gasSg: CAP.gasSg, tempAtDepthF, steps: CAP.colSteps };
  const colAtPacker = gasColumnPressure({
    pSurfPsia: CAP.pKickoffPsia, tvdFt: CAP.maxDepthFt, ...colArgs,
  });
  const surfForPacker = gasColumnSurfacePressure({
    pAtDepthPsia: CAP.packerTargetPsia, tvdFt: CAP.maxDepthFt, ...colArgs,
  });
  const injCurve = injectionPressureCurve({
    pSurfPsia: CAP.pKickoffPsia, gasSg: CAP.gasSg, tempAtDepthF,
    maxDepthFt: CAP.maxDepthFt, steps: CAP.curveSteps,
  });
  const dip = (rows, pSurfPsia = CAP.pKickoffPsia) => deepestInjectionPoint({
    prodTraverse: okparaTraverse(rows), pSurfPsia, gasSg: CAP.gasSg, tempAtDepthF,
    dpTransferPsi: CAP.dpTransferPsi, maxDepthFt: CAP.maxDepthFt, steps: CAP.curveSteps,
  });
  const ipFine = dip(CAP.travRowsFine);
  const ipCoarse = dip(CAP.travRowsCoarse);
  const cfg = {
    pKickoffPsia: CAP.pKickoffPsia,
    pOperatingPsia: CAP.pOperatingPsia,
    method: CAP.method,
    dpPerValvePsi: CAP.dpPerValvePsi,
    dpTransferPsi: CAP.dpTransferPsi,
    killGradPsiPerFt: CAP.killGradPsiPerFt,
    unloadGradPsiPerFt: CAP.unloadGradPsiPerFt,
    pWhUnloadPsia: CAP.pWhUnloadPsia,
    gasSg: CAP.gasSg,
    tempAtDepthF,
    maxDepthFt: CAP.maxDepthFt,
    targetDepthFt: ipFine.depthFt,
    minSpacingFt: CAP.minSpacingFt,
    maxValves: CAP.maxValves,
    valveType: CAP.valveType,
    bellowsAreaIn2: CAP.bellowsAreaIn2,
    ports: CAP.portsIn.map((idIn) => ({ idIn, label: `${idIn} in` })),
    qgiTargetMscfd: CAP.qgiTargetMscfd,
    bottomOrifice: CAP.bottomOrifice,
    orificeIdIn: CAP.orificeIdIn,
  };
  const design = designGasLift(cfg);
  return {
    tempAtDepthF,
    cfg,
    dip,
    zKickoff,
    gradKickoff,
    colAtPacker,
    surfForPacker,
    injCurve,
    ipFine,
    ipCoarse,
    design,
  };
};

/** The capstone's column study. The teaching mirror is `stepRefinementRows`. */
export const okparaColumnStudy = () => {
  const c = okparaCase();
  const at = (steps) => gasColumnPressure({
    pSurfPsia: CAP.pKickoffPsia, tvdFt: CAP.maxDepthFt, gasSg: CAP.gasSg,
    tempAtDepthF: c.tempAtDepthF, steps,
  }).pBottomPsia;
  const converged = at(2000);
  return {
    atPackerBySteps: CAP.columnStepLadder.map((steps) => ({ steps, pPsia: at(steps) })),
    gradedMinusConvergedPsi: c.colAtPacker.pBottomPsia - converged,
    inverseRoundTripPsia: gasColumnPressure({
      pSurfPsia: c.surfForPacker, tvdFt: CAP.maxDepthFt, gasSg: CAP.gasSg,
      tempAtDepthF: c.tempAtDepthF, steps: CAP.colSteps,
    }).pBottomPsia,
    zAtPacker: naturalGasZ({
      pPsia: c.colAtPacker.pBottomPsia,
      tF: c.tempAtDepthF(CAP.maxDepthFt),
      gasSg: CAP.gasSg,
    }),
    tempAtPackerF: c.tempAtDepthF(CAP.maxDepthFt),
  };
};

/** The capstone's chord study. The teaching mirror is `injectionPointTabulationRows`. */
export const okparaInjectionPointStudy = () => {
  const c = okparaCase();
  return {
    byTraverseRows: CAP.traverseRowLadder.map((rows) => {
      const h = c.dip(rows);
      return {
        rows,
        rowSpacingFt: CAP.maxDepthFt / (rows - 1),
        depthFt: h.depthFt,
        pInjPsia: h.pInjPsia,
        pProdPsia: h.pProdPsia,
        limitedBy: h.limitedBy,
        residualPsi: h.pInjPsia - CAP.dpTransferPsi - h.pProdPsia,
      };
    }),
    coarseMinusFineFt: c.ipCoarse.depthFt - c.ipFine.depthFt,
    coarseMinusFinePInjPsi: c.ipCoarse.pInjPsia - c.ipFine.pInjPsia,
    deepestMandrelFt: c.design.depths[c.design.depths.length - 1],
    shortfallFt: c.ipFine.depthFt - c.design.depths[c.design.depths.length - 1],
    operatingInjectionPointFt: c.dip(CAP.travRowsFine, CAP.pOperatingPsia).depthFt,
  };
};

/** The capstone's knife edge. The teaching mirror is `knifeEdgeDecrementRows`. */
export const okparaKnifeEdge = () => {
  const c = okparaCase();
  return CAP.knifeEdgeDecrements.map((dpPerValvePsi) => {
    const d = designGasLift({ ...c.cfg, dpPerValvePsi });
    return {
      dpPerValvePsi,
      multipointingStages: d.unloading.filter((s) => s.multipointing).map((s) => s.stage),
      openByStage: d.unloading.map((s) => s.upperValvesOpen),
      tightestMarginPsi: d.unloading
        .flatMap((s, i) => d.valves.slice(0, i)
          .filter((u) => u.closingSurfacePressurePsia !== null)
          .map((u) => s.surfaceInjectionPsia - u.closingSurfacePressurePsia))
        .reduce((a, b) => (Math.abs(b) < Math.abs(a) ? b : a), Infinity),
    };
  });
};

/** The capstone's port ladder. The teaching mirror is `knifeEdgeGasRateRows`. */
export const okparaPortLadder = () => {
  const c = okparaCase();
  const v3 = c.design.valves[2];
  const pick = selectPort({
    ports: c.cfg.ports,
    targetMscfd: CAP.qgiTargetMscfd,
    pUpPsia: v3.pInjAtDepthPsia,
    pDnPsia: v3.pProdAtDepthPsia,
    gasSg: CAP.gasSg,
    tF: v3.tempF,
  });
  return {
    ports: c.design.valves.map((v) => v.portIdIn),
    valve3Candidates: pick.candidates.map((x) => ({ portIdIn: x.port.idIn, qMscfd: x.qMscfd })),
    valve3ChosenIdIn: pick.port ? pick.port.idIn : null,
    valve3SpreadPsi: v3.spreadPsi,
    valve3ClosingSurfacePsia: v3.closingSurfacePressurePsia,
  };
};

/** The capstone declared PPO. The teaching mirror is `ppoDivergence`. */
export const okparaPpoStudy = () => {
  const c = okparaCase();
  const ppo = designGasLift({ ...c.cfg, valveType: 'PPO' });
  return {
    spreads: ppo.valves.map((x) => x.spreadPsi),
    closingSurfacePressures: ppo.valves.map((x) => x.closingSurfacePressurePsia),
    openByStage: ppo.unloading.map((s) => s.upperValvesOpen),
    multipointingStages: ppo.unloading.filter((s) => s.multipointing).map((s) => s.stage),
  };
};

export const CAPSTONE_TIERS = Object.freeze({
  gas_z_at_kickoff: 'beginner',
  gas_gradient_at_kickoff_psi_per_ft: 'beginner',
  inj_column_at_packer_psia: 'beginner',
  inj_surface_for_1585psia_psia: 'beginner',
  top_valve_depth_ft: 'beginner',
  inj_curve_at_5375ft_psia: 'beginner',
  valve2_depth_ft: 'intermediate',
  valve4_depth_ft: 'intermediate',
  valve2_dome_at_temp_psia: 'intermediate',
  valve2_test_rack_opening_psia: 'intermediate',
  valve4_spread_psi: 'intermediate',
  valve4_throughput_mscfd: 'intermediate',
  valve1_closing_surface_psia: 'advanced',
  valve3_closing_surface_psia: 'advanced',
  injection_point_depth_ft: 'advanced',
  injection_point_pinj_psia: 'advanced',
  injection_point_depth_coarse_ft: 'advanced',
  operating_inj_at_injection_pt_psia: 'advanced',
});

/** The eighteen graded answers, every one a return value of the vendored engine. */
export const capstoneValues = () => {
  const c = okparaCase();
  const v = c.design.valves;
  return {
    gas_z_at_kickoff: c.zKickoff,
    gas_gradient_at_kickoff_psi_per_ft: c.gradKickoff,
    inj_column_at_packer_psia: c.colAtPacker.pBottomPsia,
    inj_surface_for_1585psia_psia: c.surfForPacker,
    top_valve_depth_ft: c.design.depths[0],
    inj_curve_at_5375ft_psia: c.injCurve.at(CAP.injCurveReadFt),
    valve2_depth_ft: c.design.depths[1],
    valve4_depth_ft: c.design.depths[3],
    valve2_dome_at_temp_psia: v[1].domeAtTempPsia,
    valve2_test_rack_opening_psia: v[1].testRackOpeningPsia,
    valve4_spread_psi: v[3].spreadPsi,
    valve4_throughput_mscfd: v[3].throughputMscfd,
    valve1_closing_surface_psia: v[0].closingSurfacePressurePsia,
    valve3_closing_surface_psia: v[2].closingSurfacePressurePsia,
    injection_point_depth_ft: c.ipFine.depthFt,
    injection_point_pinj_psia: c.ipFine.pInjPsia,
    injection_point_depth_coarse_ft: c.ipCoarse.depthFt,
    operating_inj_at_injection_pt_psia: c.design.injectionCurve.at(c.ipFine.depthFt),
  };
};

/**
 * The grading tolerance of each capstone field, exactly as the capstone
 * publishes them.
 *
 * THESE ARE ABSOLUTE TOLERANCES, IN EACH FIELD'S OWN UNITS. Not fractions of
 * the value. That is not an inference, it is what the grader does. From
 * `public.academy_submit_capstone` in
 * migrations/20260715_n4_petrophysics_capstone.sql:
 *
 *     v_tol := (v_field->>'tol')::numeric;
 *     ...
 *     if v_got is not null and abs(v_got - v_exp) <= v_tol then
 *
 * `abs(v_got - v_exp) <= v_tol`, with no division by v_exp anywhere. So
 * `injection_point_depth_ft` is accepted within 0.0046 FEET of its answer, not
 * within 0.000046 per cent of it, and the bands below are thousands of times
 * tighter than a relative reading of the same numbers. Read the grader; do not
 * infer it.
 */
export const CAPSTONE_TOLERANCES = Object.freeze({
  gas_z_at_kickoff: 4.2e-7,
  gas_gradient_at_kickoff_psi_per_ft: 1.7e-8,
  inj_column_at_packer_psia: 7.9e-4,
  inj_surface_for_1585psia_psia: 6.3e-4,
  top_valve_depth_ft: 1.2e-3,
  inj_curve_at_5375ft_psia: 7.3e-4,
  valve2_depth_ft: 2.2e-3,
  valve4_depth_ft: 3.5e-3,
  valve2_dome_at_temp_psia: 6.6e-4,
  valve2_test_rack_opening_psia: 5.7e-4,
  valve4_spread_psi: 2.3e-5,
  valve4_throughput_mscfd: 1.4e-3,
  valve1_closing_surface_psia: 6.1e-4,
  valve3_closing_surface_psia: 5.6e-4,
  injection_point_depth_ft: 4.6e-3,
  injection_point_pinj_psia: 7.9e-4,
  injection_point_depth_coarse_ft: 4.6e-3,
  operating_inj_at_injection_pt_psia: 7.3e-4,
});

/** The unit each graded field is answered in, for the dimension aware half of the gate. */
export const CAPSTONE_FIELD_UNITS = Object.freeze({
  gas_z_at_kickoff: 'dimensionless',
  gas_gradient_at_kickoff_psi_per_ft: 'psi/ft',
  inj_column_at_packer_psia: 'psia',
  inj_surface_for_1585psia_psia: 'psia',
  top_valve_depth_ft: 'ft TVD',
  inj_curve_at_5375ft_psia: 'psia',
  valve2_depth_ft: 'ft TVD',
  valve4_depth_ft: 'ft TVD',
  valve2_dome_at_temp_psia: 'psia',
  valve2_test_rack_opening_psia: 'psia',
  valve4_spread_psi: 'psi',
  valve4_throughput_mscfd: 'Mscf/d',
  valve1_closing_surface_psia: 'psia',
  valve3_closing_surface_psia: 'psia',
  injection_point_depth_ft: 'ft TVD',
  injection_point_pinj_psia: 'psia',
  injection_point_depth_coarse_ft: 'ft TVD',
  operating_inj_at_injection_pt_psia: 'psia',
});

/**
 * How much wider than the grader's own acceptance band a teaching number has to
 * stand clear. Ten, so a lesson that rounds a number in prose still cannot land
 * on a graded answer. Ten times an ABSOLUTE tolerance is still a very small
 * target: ten times 0.0046 ft is 0.046 ft on an injection depth, and ten times
 * 0.00000042 is 0.0000042 on a z factor.
 */
export const LEAK_GUARD_MARGIN = 10;

/** The unit shifts a number can be restated under and still be the same answer. */
export const LEAK_GUARD_SCALINGS = Object.freeze([
  { factor: 1, tag: 'as graded' },
  { factor: 1000, tag: 'x1000' },
  { factor: 0.001, tag: 'x0.001' },
]);

/**
 * Every forbidden neighbourhood: eighteen graded answers, three unit shiftings
 * each, each with a band ten times the grader's own.
 */
export const leakGuardTargets = () => {
  const values = capstoneValues();
  const out = [];
  Object.keys(CAPSTONE_TOLERANCES).forEach((key) => {
    LEAK_GUARD_SCALINGS.forEach(({ factor, tag }) => {
      // The tolerance is absolute, so under a unit shift it shifts with the
      // value: a band of 0.0046 ft restated in thousands is 0.0000046.
      const gradingBand = CAPSTONE_TOLERANCES[key] * Math.abs(factor);
      out.push({
        key,
        tag,
        tier: CAPSTONE_TIERS[key],
        unit: CAPSTONE_FIELD_UNITS[key],
        value: values[key] * factor,
        gradingBand,
        band: LEAK_GUARD_MARGIN * gradingBand,
      });
    });
  });
  return out;
};

/**
 * Is this number inside a forbidden neighbourhood? Returns the target it
 * collides with, or null. Deliberately DIMENSION BLIND: the grader compares
 * numbers and never asks what they were a measurement of, so neither does this.
 */
export const leakGuardHit = (value, targets = leakGuardTargets()) => {
  if (!Number.isFinite(value)) return null;
  for (const t of targets) {
    if (Math.abs(value - t.value) <= t.band) return t;
  }
  return null;
};
