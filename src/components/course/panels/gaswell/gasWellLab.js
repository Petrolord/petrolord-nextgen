// Teaching lab for PD5, Gas Well Performance and Deliquification. The three
// panels, the 78 shipped lessons and the vitest file all read this one module,
// so a number shown to a learner and a number a test pins cannot drift apart.
//
// Everything here is the vendored engine's own output. Every gas density, every
// terminal velocity, every critical rate, every profile ratio, every sizing
// candidate, every plunger term, every screen verdict below is a return value
// from a call into engines/production/gasWellLoading.js, plungerLift.js or
// gasProperties.js over test-data/production/goldens/gaswell_cases.json.
// Nothing in this file re-implements the engine. The only arithmetic done here
// is the arithmetic a PANEL would otherwise have to do on the engine's return
// values: a difference, a ratio, a percentage, a margin, a shortfall. That
// arithmetic lives here on purpose, so that a panel is a renderer and never a
// calculator.
//
// UNITS. Field units throughout, as all three engine headers state: pressure
// psia (never psig, never gauge), depth ft, temperature degR at the
// gasWellLoading and plungerLift doors and degF at the gasProperties door,
// gas rate Mscf/d, tubing inside diameter in, flow area ft2, cross-section in2,
// gas density lbm/ft3, interfacial tension dyne/cm, velocity ft/s, slug length
// ft, liquid volume bbl, gas volume scf, gas-liquid ratio scf/bbl, gradient
// psi/ft. The z factor, the droplet constant and every ratio are dimensionless.
//
// FIVE PROVENANCE RULES THIS FILE EXISTS TO KEEP, all five already stated in
// the wave's teaching digest and all five easy to lose in a panel.
//
//   1. TWO ROADS TO ONE CRITICAL RATE. `stationSweep` and `stationBase` run the
//      published golden row 3 station through the ENGINE and get a Turner rate
//      of 1614.343766935 Mscf/d. `turnerColemanPairRows` prints the same
//      quantity for the same published row from the ORACLE and gets
//      1614.343188395 Mscf/d, 5.7854e-4 apart. Both are correct. They have
//      DISTINCT names here and a caption must never pair a rate from one with
//      a Turner-against-Coleman figure from the other.
//
//   2. THE CORRELATION IS CHOSEN AT ONE STATION AND USED AT EVERY STATION.
//      `ebochaWellheadRecommendation()` is what `recommendCorrelation` returns
//      for the WELLHEAD pressure, which is how the function is called in
//      practice, and `ebochaProfile(...)` under that answer is the shipped
//      reading. `ebochaStationRecommendationRows()` asks the same function at
//      every station and does not get the same answer back. A panel that
//      shows the second must say it is not what the study did.
//
//   3. TWO GRADIENTS FOR ONE COLUMN OF WATER. `PSI_PER_FT_SG` is the shipped
//      0.433 and `EXACT_PSI_PER_FT_SG` is 1000 kg/m3 times g restated in psi
//      per foot per unit specific gravity. They are 0.1218 percent apart, the
//      golden publishes the ORACLE's number for its own case, and the engine
//      cannot reproduce it. Both are here because the contrast is the teaching
//      point.
//
//   4. TWO MOLECULAR WEIGHTS OF AIR IN ONE DOMAIN. `gasWellLoading.AIR_MW` is
//      28.9647 and `gasProperties.AIR_MW` is 28.9625, 75.96 parts per million
//      apart, so the two modules return different densities for one station.
//      `airSeam()` prints both routes at a published station.
//
//   5. `sizeTubingForRate` NOW CARRIES AN `ok` KEY, and it is not decoration.
//      Before engines 5733550 a `largestUnloaded` of null meant two different
//      things with one value: "every candidate was evaluated and none of them
//      unloads this well", which is a finding, and "the question was never
//      evaluated at all", which is not. `ok` separates them. `rows` and
//      `largestUnloaded` are computed exactly as before, so `ok: false` with a
//      null pick is a REFUSAL and `ok: true` with a null pick is an ANSWER.
//      `ebochaSizing`, `ebochaHopelessSizing` and `ebochaSizingRefusals` all
//      carry it through, and three Professional lessons are written on it.
//
// THE CAPSTONE BOUNDARY. There is no capstone material in this file at all.
// PD5's graded well and its eighteen graded fields live in the wave's own
// derivation and never enter the lab, so a panel cannot reach one by mistake.
// What guards that is panelCapstoneGuard.test.js, which reads the graded field
// list out of the wave directory and checks every number this lab and the
// shipped digest expose against it, dimension blind, at ten times the grader's
// own absolute tolerance, under four restatements.
//
// PURITY AND CACHING. Every accessor is pure and deterministic: no random
// number anywhere, and two calls with the same arguments return equal values.
// The engine runs that are expensive and re-read from several accessors are
// cached, and every accessor maps a cached engine return value into fresh rows,
// so a panel cannot mutate one and change what another panel sees.

import golden from '@petrolord/engines/test-data/production/goldens/gaswell_cases.json';
import {
  R_OFFSET, AIR_MW as GAS_PROPERTIES_AIR_MW, toRankine, suttonPseudoCriticals,
  naturalGasZ, gasGradient,
} from '@petrolord/engines/engines/production/gasProperties.js';
import {
  P_STANDARD_PSIA, T_STANDARD_R, GC, DEFAULT_DRAG_COEFFICIENT,
  DEFAULT_CRITICAL_WEBER, DYNE_CM_TO_LBF_FT, TURNER_FLUIDS, turnerFluid,
  AIR_MW, R_PSIA_FT3_LBMOL_R, gasDensityLbFt3, terminalDropletVelocity,
  LOADING_ADJUSTMENT, COLEMAN_PRESSURE_LIMIT_PSIA, criticalVelocity,
  RATE_CONSTANT_MSCFD, rateAtVelocity, velocityAtRate, tubingAreaFt2,
  loadingAt, loadingProfile, recommendCorrelation, sizeTubingForRate,
} from '@petrolord/engines/engines/production/gasWellLoading.js';
import {
  FT3_PER_BBL, PSI_PER_FT_SG, TYPICAL, tubingAreaIn2, slugVolumeBbl,
  slugLengthForBbl, liftPressure, gasPerCycleScf, cycleTime,
  RULE_OF_THUMB_SCF_PER_BBL_PER_1000FT, ruleOfThumbGlr, screenPlungerLift,
  maxSlugLengthFt,
} from '@petrolord/engines/engines/production/plungerLift.js';

export {
  R_OFFSET, toRankine, suttonPseudoCriticals, naturalGasZ, gasGradient,
  P_STANDARD_PSIA, T_STANDARD_R, GC, DEFAULT_DRAG_COEFFICIENT,
  DEFAULT_CRITICAL_WEBER, DYNE_CM_TO_LBF_FT, TURNER_FLUIDS, turnerFluid,
  AIR_MW, GAS_PROPERTIES_AIR_MW, R_PSIA_FT3_LBMOL_R, gasDensityLbFt3,
  terminalDropletVelocity, LOADING_ADJUSTMENT, COLEMAN_PRESSURE_LIMIT_PSIA,
  criticalVelocity, RATE_CONSTANT_MSCFD, rateAtVelocity, velocityAtRate,
  tubingAreaFt2, loadingAt, loadingProfile, recommendCorrelation,
  sizeTubingForRate,
  FT3_PER_BBL, PSI_PER_FT_SG, TYPICAL, tubingAreaIn2, slugVolumeBbl,
  slugLengthForBbl, liftPressure, gasPerCycleScf, cycleTime,
  RULE_OF_THUMB_SCF_PER_BBL_PER_1000FT, ruleOfThumbGlr, screenPlungerLift,
  maxSlugLengthFt,
};

export const GOLDEN = golden;

// ---------------------------------------------------------------------------
// CONSTANTS THIS FILE DECLARES, none of them an engine value.
// ---------------------------------------------------------------------------

/** Standard gravity, m/s2. Declared so the exact water gradient is buildable. */
export const G_SI = 9.80665;

/** Metres per foot, exact. One of the wave's three declared constants. */
export const M_PER_FT = 0.3048;

/** Pascals per psi, exact. One of the wave's three declared constants. */
export const PA_PER_PSI = 6894.757293168;

/**
 * The exact water gradient: 1000 kg/m3 times g, restated in psi per foot per
 * unit specific gravity. `plungerLift.PSI_PER_FT_SG` is the rounded 0.433 and
 * the two are 0.1218 percent apart. This is built from the three constants
 * above rather than typed, so a reader can rebuild it.
 */
export const EXACT_PSI_PER_FT_SG = (1000 * G_SI * M_PER_FT) / PA_PER_PSI;

/** The two correlations this domain offers, in the order the digest prints. */
export const CORRELATIONS = Object.freeze(['coleman', 'turner']);

/** The exact ratio between them, which is one factor and not two equations. */
export const TURNER_OVER_COLEMAN = LOADING_ADJUSTMENT.turner / LOADING_ADJUSTMENT.coleman;

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

// ---------------------------------------------------------------------------
// SECTION 1. THE PUBLISHED CONSTANTS, AND WHAT EACH ONE IS BUILT FROM.
// Associate m03 and m04.
// ---------------------------------------------------------------------------

/**
 * The three numbers the goldens publish on their own, each re-derived by the
 * engine on its own route. The Turner droplet constant is the whole balance
 * collapsed into one number and the gate checks that the engine PRODUCES it
 * rather than storing it, so it is read back out of a terminal velocity call
 * on unit fluid properties rather than quoted.
 */
export const publishedConstants = () => {
  const t = terminalDropletVelocity({ sigmaDyneCm: 1, rhoLiquidLbFt3: 2, rhoGasLbFt3: 1 });
  const rho = gasDensityLbFt3({ pPsia: 1000, tempR: 600, z: 0.88, gasSg: 0.65 });
  return {
    goldenTurnerConstant: golden.constants.turnerConstant,
    engineTurnerConstant: t.constant,
    turnerConstantDiff: t.constant - golden.constants.turnerConstant,
    turnerConstantRelDiffMagnitude:
      Math.abs(t.constant - golden.constants.turnerConstant) / golden.constants.turnerConstant,
    goldenRateConstantMscfd: golden.constants.rateConstantMscfd,
    engineRateConstantMscfd: RATE_CONSTANT_MSCFD,
    rateConstantDiff: RATE_CONSTANT_MSCFD - golden.constants.rateConstantMscfd,
    goldenSpotDensityLbFt3: golden.constants.gasDensity_1000psia_600R_z088_sg065,
    engineSpotDensityLbFt3: rho,
    spotDensityDiff: rho - golden.constants.gasDensity_1000psia_600R_z088_sg065,
    dragCoefficient: DEFAULT_DRAG_COEFFICIENT,
    criticalWeber: DEFAULT_CRITICAL_WEBER,
    gc: GC,
    dyneCmToLbfFt: DYNE_CM_TO_LBF_FT,
    pStandardPsia: P_STANDARD_PSIA,
    tStandardR: T_STANDARD_R,
    turnerAdjustment: LOADING_ADJUSTMENT.turner,
    colemanAdjustment: LOADING_ADJUSTMENT.coleman,
    colemanPressureLimitPsia: COLEMAN_PRESSURE_LIMIT_PSIA,
    airMwLoading: AIR_MW,
    airMwProperties: GAS_PROPERTIES_AIR_MW,
    rPsiaFt3LbmolR: R_PSIA_FT3_LBMOL_R,
    // the 3.06 the texts print for MMscf/d, and the same constant rebuilt by
    // hand out of the standard conditions the module publishes
    rateConstantPerMMscfd: RATE_CONSTANT_MSCFD / 1000,
    rateConstantByHand: (86400 * T_STANDARD_R) / (P_STANDARD_PSIA * 1000),
  };
};

// ---------------------------------------------------------------------------
// SECTION 2 and 7. THE PUBLISHED VELOCITY TABLE, AND THE TWENTY PERCENT.
// Associate m02 through m05, Expert m01.
// ---------------------------------------------------------------------------

/** The 2.441 in flow area the published critical rates were cut through. */
export const PUBLISHED_AREA_FT2 = tubingAreaFt2(2.441);

/** All twelve rows as the ORACLE cut them. */
export const goldenVelocityRows = () => golden.velocity.map((r, i) => ({
  row: i + 1,
  fluid: r.fluid,
  sigmaDyneCm: r.sigmaDyneCm,
  rhoLiquidLbFt3: r.rhoLiquidLbFt3,
  pPsia: r.pPsia,
  tempR: r.tempR,
  z: r.z,
  gasSg: r.gasSg,
  rhoGasLbFt3: r.rhoGasLbFt3,
  terminalFtS: r.terminalFtS,
  colemanFtS: r.colemanFtS,
  turnerFtS: r.turnerFtS,
  criticalRateTurnerMscfd: r.criticalRateTurnerMscfd,
  // Coleman applies no adjustment, so the Coleman velocity IS the terminal
  // velocity and the goldens carry both names so the identity is visible.
  colemanIsTerminal: r.colemanFtS === r.terminalFtS,
  turnerOverColeman: r.turnerFtS / r.colemanFtS,
}));

/** The same twelve rows re-run through the ENGINE. Road one of two. */
export const engineVelocityRows = memoize(() => golden.velocity.map((r, i) => {
  const vT = criticalVelocity({
    correlation: 'turner', sigmaDyneCm: r.sigmaDyneCm, rhoLiquidLbFt3: r.rhoLiquidLbFt3,
    pPsia: r.pPsia, tempR: r.tempR, z: r.z, gasSg: r.gasSg,
  });
  const vC = criticalVelocity({
    correlation: 'coleman', sigmaDyneCm: r.sigmaDyneCm, rhoLiquidLbFt3: r.rhoLiquidLbFt3,
    pPsia: r.pPsia, tempR: r.tempR, z: r.z, gasSg: r.gasSg,
  });
  const at = { areaFt2: PUBLISHED_AREA_FT2, pPsia: r.pPsia, tempR: r.tempR, z: r.z };
  const qT = rateAtVelocity({ velocityFtS: vT.velocityFtS, ...at });
  const qC = rateAtVelocity({ velocityFtS: vC.velocityFtS, ...at });
  return {
    row: i + 1,
    fluid: r.fluid,
    pPsia: r.pPsia,
    tempR: r.tempR,
    rhoGasLbFt3: vT.rhoGasLbFt3,
    rhoGasDiffFromGolden: vT.rhoGasLbFt3 - r.rhoGasLbFt3,
    terminalFtS: vT.terminalFtS,
    colemanFtS: vC.velocityFtS,
    turnerFtS: vT.velocityFtS,
    turnerDiffFromGolden: vT.velocityFtS - r.turnerFtS,
    criticalRateTurnerMscfd: qT,
    turnerRateDiffFromGolden: qT - r.criticalRateTurnerMscfd,
    criticalRateColemanMscfd: qC,
    turnerMinusColemanMscfd: qT - qC,
    turnerOverColeman: qT / qC,
  };
}));

/**
 * The twenty percent on the ORACLE's own numbers. Road two of two, and it is
 * NOT the same road as `engineVelocityRows`: golden row 3 Turner is
 * 1614.343766935 Mscf/d there and 1614.343188395 Mscf/d here. A lesson stays
 * on one of the two.
 */
export const turnerColemanPairRows = () => golden.velocity.map((r, i) => {
  const qT = r.criticalRateTurnerMscfd;
  const qC = rateAtVelocity({
    velocityFtS: r.colemanFtS, areaFt2: PUBLISHED_AREA_FT2,
    pPsia: r.pPsia, tempR: r.tempR, z: r.z,
  });
  return {
    row: i + 1,
    colemanFtS: r.colemanFtS,
    turnerFtS: r.turnerFtS,
    turnerOverColemanVelocity: r.turnerFtS / r.colemanFtS,
    turnerRateMscfd: qT,
    colemanRateMscfd: qC,
    turnerMinusColemanMscfd: qT - qC,
    turnerOverColemanPct: pct(qT, qC),
  };
});

/**
 * One equation and one factor, checked rather than asserted. The terminal
 * velocity is IDENTICAL under both correlations, so a lesson that says the two
 * use different physics is wrong.
 */
export const adjustmentIdentity = () => {
  const a = { sigmaDyneCm: 60, rhoLiquidLbFt3: 67, pPsia: 1200, tempR: 600, z: 0.9, gasSg: 0.65 };
  const vt = criticalVelocity({ correlation: 'turner', ...a });
  const vc = criticalVelocity({ correlation: 'coleman', ...a });
  return {
    ...a,
    turnerAdjustment: LOADING_ADJUSTMENT.turner,
    colemanAdjustment: LOADING_ADJUSTMENT.coleman,
    adjustmentGapPct: (LOADING_ADJUSTMENT.turner / LOADING_ADJUSTMENT.coleman - 1) * 100,
    turnerTerminalFtS: vt.terminalFtS,
    colemanTerminalFtS: vc.terminalFtS,
    terminalDiff: vt.terminalFtS - vc.terminalFtS,
    turnerCriticalFtS: vt.velocityFtS,
    colemanCriticalFtS: vc.velocityFtS,
    sharedConstant: vt.constant,
  };
};

// ---------------------------------------------------------------------------
// SECTION 3. z, GAS DENSITY, AND THE TWO MOLECULAR WEIGHTS OF AIR.
// Associate m02 states the density; Expert m05 l03 owns the seam.
// ---------------------------------------------------------------------------

/**
 * The two production modules do not carry the same molecular weight of air.
 * Priced at published golden row 6: 2500.0 psia, 620.0 degR, z 0.9, gas gravity
 * 0.65. Both routes get the same p, T, z and gravity; the ONLY thing that
 * differs is M. The temperature crosses the boundary through the engine's own
 * `toRankine` rather than a typed 459.67, which is the only way over without
 * introducing a third constant.
 */
export const airSeam = memoize(() => {
  const pPsia = 2500;
  const tempR = 620;
  const z = 0.9;
  const gasSg = 0.65;
  const tF = tempR - R_OFFSET;
  const rhoLoading = gasDensityLbFt3({ pPsia, tempR, z, gasSg });
  const gradientPsiPerFt = gasGradient({ pPsia, tF, gasSg, z });
  const rhoProperties = gradientPsiPerFt * 144;
  const vLoading = criticalVelocity({
    correlation: 'turner', sigmaDyneCm: 60, rhoLiquidLbFt3: 67, pPsia, tempR, z, gasSg,
  });
  const tProperties = terminalDropletVelocity({
    sigmaDyneCm: 60, rhoLiquidLbFt3: 67, rhoGasLbFt3: rhoProperties,
  });
  const vPropertiesTurner = tProperties.velocityFtS * LOADING_ADJUSTMENT.turner;
  const densityFraction = Math.abs(rhoLoading - rhoProperties) / rhoLoading;
  const velocityFraction = Math.abs(vLoading.velocityFtS - vPropertiesTurner) / vLoading.velocityFtS;
  return {
    pPsia,
    tempR,
    tF,
    tempBackToR: toRankine(tF),
    z,
    gasSg,
    airMwLoading: AIR_MW,
    airMwProperties: GAS_PROPERTIES_AIR_MW,
    mwGap: AIR_MW - GAS_PROPERTIES_AIR_MW,
    mwGapPpm: ((AIR_MW - GAS_PROPERTIES_AIR_MW) / GAS_PROPERTIES_AIR_MW) * 1e6,
    rhoLoading,
    rhoProperties,
    gradientPsiPerFt,
    rhoGap: rhoLoading - rhoProperties,
    rhoGapFraction: (rhoLoading - rhoProperties) / rhoLoading,
    goldenRhoLbFt3: golden.velocity[5].rhoGasLbFt3,
    velocityLoadingFtS: vLoading.velocityFtS,
    velocityPropertiesFtS: vPropertiesTurner,
    velocityGap: vLoading.velocityFtS - vPropertiesTurner,
    densityFraction,
    velocityFraction,
    // a little over one half: the inverse square root plus the buoyancy term
    velocityOverDensityFraction: velocityFraction / densityFraction,
  };
});

/** The stations the compressibility route is walked at. */
export const DAK_STATIONS = Object.freeze([
  [300, 80.33], [1000, 80.33], [2500, 160.33], [1000, 140.33],
]);

/**
 * DAK z, which the goldens do not exercise: the velocity table pins z at 0.9 as
 * an INPUT, so the compressibility route is only reachable through
 * gasProperties.
 */
export const dakZRows = (stations = DAK_STATIONS) => stations.map(([pPsia, tF]) => ({
  pPsia,
  tF,
  gasSg: 0.65,
  z: naturalGasZ({ pPsia, tF, gasSg: 0.65 }),
  goldenTablePins: 0.9,
}));

/** Sutton's pseudo-criticals at the gravity the published table uses. */
export const suttonAt065 = () => suttonPseudoCriticals(0.65);

// ---------------------------------------------------------------------------
// SECTION 4. THE DROPLET BALANCE, AND WHAT MOVES IT. Associate m03.
// ---------------------------------------------------------------------------

const terminalOf = (sigmaDyneCm, densityDiff, rhoGasLbFt3) => terminalDropletVelocity({
  sigmaDyneCm, rhoLiquidLbFt3: rhoGasLbFt3 + densityDiff, rhoGasLbFt3,
}).velocityFtS;

/**
 * The power laws, checked rather than asserted. Sixteen times the tension
 * doubles the velocity, sixteen times the density difference doubles it, four
 * times the gas density halves it.
 *
 * READ THE CAPTION CAREFULLY. "Three groups and nothing else" is true of this
 * SWEEP, where the density difference is driven as an independent input. It is
 * NOT true of a real station, because there the gas density appears twice: once
 * on its own under the square root and once inside the density difference.
 */
export const powerLawRows = () => [
  { group: 'sigma', sigmaDyneCm: 1, densityDiff: 60, rhoGasLbFt3: 3 },
  { group: 'sigma', sigmaDyneCm: 16, densityDiff: 60, rhoGasLbFt3: 3, ratioTo: 0 },
  { group: 'density difference', sigmaDyneCm: 60, densityDiff: 1, rhoGasLbFt3: 3 },
  { group: 'density difference', sigmaDyneCm: 60, densityDiff: 16, rhoGasLbFt3: 3, ratioTo: 2 },
  { group: 'gas density', sigmaDyneCm: 60, densityDiff: 60, rhoGasLbFt3: 1 },
  { group: 'gas density', sigmaDyneCm: 60, densityDiff: 60, rhoGasLbFt3: 4, ratioTo: 4 },
].map((r, i, all) => {
  const velocityFtS = terminalOf(r.sigmaDyneCm, r.densityDiff, r.rhoGasLbFt3);
  const base = r.ratioTo === undefined ? null : all[r.ratioTo];
  return {
    ...r,
    velocityFtS,
    ratioToRowAbove: base
      ? velocityFtS / terminalOf(base.sigmaDyneCm, base.densityDiff, base.rhoGasLbFt3)
      : null,
  };
});

export const DRAG_COEFFICIENTS = Object.freeze([0.22, 0.33, 0.44, 0.55, 0.88, 1.10]);
export const CRITICAL_WEBERS = Object.freeze([10, 20, 30, 40, 60, 120]);

/**
 * The drag coefficient and the Weber number are INPUTS, so the 1.5935 moves
 * when they move. This is the whole difference between a derivation and a
 * remembered number.
 */
export const dragCoefficientRows = (values = DRAG_COEFFICIENTS) => values.map((dragCoefficient) => {
  const t = terminalDropletVelocity({
    sigmaDyneCm: 1, rhoLiquidLbFt3: 2, rhoGasLbFt3: 1, dragCoefficient,
  });
  return {
    dragCoefficient,
    constant: t.constant,
    ratioToShipped: t.constant / golden.constants.turnerConstant,
    isShipped: dragCoefficient === DEFAULT_DRAG_COEFFICIENT,
  };
});

export const criticalWeberRows = (values = CRITICAL_WEBERS) => values.map((criticalWeber) => {
  const t = terminalDropletVelocity({
    sigmaDyneCm: 1, rhoLiquidLbFt3: 2, rhoGasLbFt3: 1, criticalWeber,
  });
  return {
    criticalWeber,
    constant: t.constant,
    ratioToShipped: t.constant / golden.constants.turnerConstant,
    isShipped: criticalWeber === DEFAULT_CRITICAL_WEBER,
  };
});

/** The published gas density the two fluid sweeps sit on: golden row 4. */
export const SWEEP_STATION_RHO_LB_FT3 = golden.velocity[3].rhoGasLbFt3;

export const SURFACE_TENSIONS_DYNE_CM = Object.freeze([5, 10, 20, 30, 40, 50, 60, 70, 80]);
export const LIQUID_DENSITIES_LB_FT3 = Object.freeze([40, 45, 50, 55, 60, 62, 67, 70, 75]);

/** Surface tension at one published gas density, the whole contiguous sweep. */
export const surfaceTensionRows = (values = SURFACE_TENSIONS_DYNE_CM) => values.map((sigmaDyneCm) => {
  const t = terminalDropletVelocity({
    sigmaDyneCm, rhoLiquidLbFt3: 67, rhoGasLbFt3: SWEEP_STATION_RHO_LB_FT3,
  });
  return {
    sigmaDyneCm,
    rhoLiquidLbFt3: 67,
    terminalFtS: t.velocityFtS,
    turnerFtS: t.velocityFtS * LOADING_ADJUSTMENT.turner,
  };
});

/** Liquid density at the same published gas density, contiguous. */
export const liquidDensityRows = (values = LIQUID_DENSITIES_LB_FT3) => values.map((rhoLiquidLbFt3) => {
  const t = terminalDropletVelocity({
    sigmaDyneCm: 60, rhoLiquidLbFt3, rhoGasLbFt3: SWEEP_STATION_RHO_LB_FT3,
  });
  return {
    rhoLiquidLbFt3,
    sigmaDyneCm: 60,
    terminalFtS: t.velocityFtS,
    turnerFtS: t.velocityFtS * LOADING_ADJUSTMENT.turner,
  };
});

/** The Turner fluid properties the module publishes, as labelled starting points. */
export const turnerFluidRows = () => TURNER_FLUIDS.map((fl) => ({
  id: fl.id,
  label: fl.label,
  sigmaDyneCm: fl.sigmaDyneCm,
  densityLbFt3: fl.densityLbFt3,
}));

/** An unknown fluid id falls back rather than refusing. */
export const unknownFluidFallback = () => turnerFluid('nonsense');

/**
 * Brine against condensate at ONE published station, golden rows 4 and 10:
 * 1000.0 psia, 620.0 degR. Condensate loads a well at a LOWER rate than water,
 * because it has about a third the tension and a lower density, so its droplets
 * are easier to carry. Getting the sign of that backwards flags healthy wells
 * as loaded.
 *
 * THE RATIO IS NOT A FLUID CONSTANT. It belongs to this station and does not
 * hold at 300.0 or at 2500.0 psia, because the gas density enters the balance
 * twice. Quote it with its station, always.
 */
export const fluidPair = () => {
  const water = golden.velocity[3];
  const condensate = golden.velocity[9];
  return {
    pPsia: water.pPsia,
    tempR: water.tempR,
    waterFluid: water.fluid,
    condensateFluid: condensate.fluid,
    waterTerminalFtS: water.terminalFtS,
    condensateTerminalFtS: condensate.terminalFtS,
    terminalRatio: water.terminalFtS / condensate.terminalFtS,
    waterTurnerRateMscfd: water.criticalRateTurnerMscfd,
    condensateTurnerRateMscfd: condensate.criticalRateTurnerMscfd,
    rateRatio: water.criticalRateTurnerMscfd / condensate.criticalRateTurnerMscfd,
  };
};

/** What the balance refuses. A refusal is a return value, not a throw. */
export const balanceRefusals = () => {
  const lighterLiquid = terminalDropletVelocity({
    sigmaDyneCm: 60, rhoLiquidLbFt3: 2, rhoGasLbFt3: 5,
  });
  const noTension = terminalDropletVelocity({
    sigmaDyneCm: 0, rhoLiquidLbFt3: 67, rhoGasLbFt3: 3,
  });
  const unknownCorrelation = criticalVelocity({
    correlation: 'guess', sigmaDyneCm: 60, rhoLiquidLbFt3: 67,
    pPsia: 1000, tempR: 600, z: 0.9, gasSg: 0.65,
  });
  return [
    {
      label: 'a liquid lighter than the gas',
      ok: lighterLiquid.ok,
      velocityFtS: lighterLiquid.velocityFtS,
      error: lighterLiquid.error,
    },
    {
      label: 'no interfacial tension at all',
      ok: noTension.ok,
      velocityFtS: noTension.velocityFtS,
      error: noTension.error,
    },
    {
      label: 'an unknown correlation',
      ok: unknownCorrelation.ok,
      velocityFtS: unknownCorrelation.velocityFtS,
      error: unknownCorrelation.error,
    },
  ];
};

// ---------------------------------------------------------------------------
// SECTION 5. FLOW AREA, AND THE RATE THAT FOLLOWS FROM A VELOCITY.
// Associate m04 l01 and l02.
// ---------------------------------------------------------------------------

export const TUBING_IDS_IN = Object.freeze([
  4.494, 3.958, 3.826, 3.740, 3.548, 3.476, 3.068, 2.441, 2.041, 1.995, 1.610,
]);

/**
 * The area is where the tubing size enters, and it is the ONLY place it enters.
 * That is why a velocity string works at all.
 */
export const tubingAreaRows = (ids = TUBING_IDS_IN) => ids.map((idIn) => ({
  idIn,
  areaFt2: tubingAreaFt2(idIn),
  crossSectionIn2: tubingAreaIn2(idIn),
}));

/** Doubling the diameter multiplies the area by four, exactly. */
export const areaDoubling = () => ({
  fromIdIn: 2.441,
  toIdIn: 4.882,
  factor: tubingAreaFt2(4.882) / tubingAreaFt2(2.441),
});

/**
 * Rate and velocity are exact inverses. A rate quoted at surface and a velocity
 * quoted downhole are the same statement in two currencies.
 */
export const rateVelocityInverse = () => {
  const at = { areaFt2: PUBLISHED_AREA_FT2, pPsia: 900, tempR: 580, z: 0.9 };
  const velocityFtS = 12;
  const qMscfd = rateAtVelocity({ velocityFtS, ...at });
  const back = velocityAtRate({ qMscfd, ...at });
  return {
    ...at, idIn: 2.441, velocityFtS, qMscfd, backToVelocityFtS: back, closure: back - velocityFtS,
  };
};

/** Two more refusals, both of which return a number that is not a number. */
export const rateRefusals = () => ({
  velocityAtZeroArea: velocityAtRate({ qMscfd: 1000, areaFt2: 0, pPsia: 900, tempR: 580, z: 0.9 }),
  densityAtZeroTemperature: gasDensityLbFt3({ pPsia: 1000, tempR: 0, z: 0.88, gasSg: 0.65 }),
});

// ---------------------------------------------------------------------------
// SECTION 6. THE CRITICAL RATE, THE ACTUAL VELOCITY, AND THE RATIO.
// Associate m04 l03 to l05. ROAD ONE: everything here is the ENGINE.
// ---------------------------------------------------------------------------

/** Published golden row 3 conditions, which the rate sweep is walked on. */
export const STATION = Object.freeze({
  pPsia: 1000, tempR: 540, z: 0.9, gasSg: 0.65,
  sigmaDyneCm: 60, rhoLiquidLbFt3: 67, idIn: 2.441,
});

export const STATION_RATES_MSCFD = Object.freeze([
  400, 800, 1200, 1400, 1600, 1614, 1800, 2200, 2600,
]);

/**
 * The critical rate does not move across the sweep: it belongs to the STATION,
 * not to the well. The actual velocity and the ratio move with the rate, and
 * the ratio is the only one of the three that carries a verdict.
 */
export const stationBase = memoize(() => {
  const turner = loadingAt({ correlation: 'turner', ...STATION, qMscfd: 1000 });
  const coleman = loadingAt({ correlation: 'coleman', ...STATION, qMscfd: 1000 });
  return {
    ...STATION,
    rhoGasLbFt3: turner.rhoGasLbFt3,
    terminalFtS: turner.terminalFtS,
    areaFt2: turner.areaFt2,
    turnerCriticalVelocityFtS: turner.criticalVelocityFtS,
    turnerCriticalRateMscfd: turner.criticalRateMscfd,
    colemanCriticalVelocityFtS: coleman.criticalVelocityFtS,
    colemanCriticalRateMscfd: coleman.criticalRateMscfd,
  };
});

/**
 * The same five-step build on ANY published golden row, so a lesson can walk
 * the 2500.0 psia 620.0 degR station or the 300.0 psia one end to end without a
 * second accessor. `row` is one based, as the digest numbers them.
 */
export const goldenRowStation = (row, qMscfd = 1000, correlation = 'turner', idIn = 2.441) => {
  const r = golden.velocity[row - 1];
  const at = loadingAt({
    correlation,
    sigmaDyneCm: r.sigmaDyneCm,
    rhoLiquidLbFt3: r.rhoLiquidLbFt3,
    pPsia: r.pPsia,
    tempR: r.tempR,
    z: r.z,
    gasSg: r.gasSg,
    idIn,
    qMscfd,
  });
  return {
    row,
    fluid: r.fluid,
    pPsia: r.pPsia,
    tempR: r.tempR,
    z: r.z,
    gasSg: r.gasSg,
    sigmaDyneCm: r.sigmaDyneCm,
    rhoLiquidLbFt3: r.rhoLiquidLbFt3,
    idIn,
    qMscfd,
    correlation,
    rhoGasLbFt3: at.rhoGasLbFt3,
    terminalFtS: at.terminalFtS,
    criticalVelocityFtS: at.criticalVelocityFtS,
    areaFt2: at.areaFt2,
    criticalRateMscfd: at.criticalRateMscfd,
    actualVelocityFtS: at.actualVelocityFtS,
    ratio: at.ratio,
    loaded: at.loaded,
    // the ORACLE's answer for the same quantity, beside the engine's, because
    // the two roads are ten significant figures apart and no further
    goldenTerminalFtS: r.terminalFtS,
    goldenTurnerRateMscfd: r.criticalRateTurnerMscfd,
  };
};

export const stationSweepRows = (rates = STATION_RATES_MSCFD) => rates.map((qMscfd) => {
  const at = loadingAt({ correlation: 'turner', ...STATION, qMscfd });
  return {
    qMscfd,
    actualVelocityFtS: at.actualVelocityFtS,
    criticalRateMscfd: at.criticalRateMscfd,
    ratio: at.ratio,
    loaded: at.loaded,
    // the ratio is the rate ratio and the velocity ratio at once, because both
    // sides of it are evaluated at the same station on the same area
    velocityRatio: at.actualVelocityFtS / at.criticalVelocityFtS,
    ratioIdentityGap: at.actualVelocityFtS / at.criticalVelocityFtS - at.ratio,
  };
});

// ---------------------------------------------------------------------------
// SECTION 8. THE THRESHOLD, AND THE SENTENCE THAT PRINTS IT. Expert m01 l04.
// ---------------------------------------------------------------------------

export const THRESHOLD_PRESSURES_PSIA = Object.freeze([
  400.0, 850.0, 980.0, 999.04, 999.88, 999.96, 1000.0, 1000.04, 1000.5, 1500.0, 2500.0,
]);

/**
 * `recommendCorrelation` takes ONE pressure and switches on a STRICT comparison
 * against 1000 psia. The branch is unambiguous; the sentence attached to it was
 * where the trouble was. It used to round the pressure it branched on to a
 * whole number, so a well below the limit printed AS the limit under a branch
 * that only takes wells below it, and it hardcoded the word wellhead for
 * whatever station it was handed. Both are display-only and both are fixed:
 * one decimal, and a station label the caller sets.
 *
 * ONE DECIMAL NARROWS THE COLLISION BY TEN RATHER THAN CLOSING IT. Anything
 * inside 0.05 psi of the limit still renders as the limit, which is what
 * `printsAsTheLimit` records here.
 */
export const thresholdRows = (pressures = THRESHOLD_PRESSURES_PSIA) => pressures.map((pPsia) => {
  const r = recommendCorrelation(pPsia);
  return {
    pPsia,
    correlation: r.correlation,
    ok: r.ok,
    roundedWhole: Math.round(pPsia),
    printedOneDecimal: pPsia.toFixed(1),
    belowLimit: pPsia < COLEMAN_PRESSURE_LIMIT_PSIA,
    // the old collision: a whole-number print that names the limit it cleared
    collidedAtWholeNumbers: Math.round(pPsia) === COLEMAN_PRESSURE_LIMIT_PSIA,
    // the collision one decimal leaves behind
    printsAsTheLimit: pPsia.toFixed(1) === COLEMAN_PRESSURE_LIMIT_PSIA.toFixed(1),
    distanceToLimitPsi: COLEMAN_PRESSURE_LIMIT_PSIA - pPsia,
    reason: r.reason,
  };
});

/** The station label is an argument now, because the function takes any station. */
export const thresholdLabelling = () => ({
  withoutLabel: recommendCorrelation(1500.0).reason,
  withLabel: recommendCorrelation(1500.0, 'at the 7,500 ft shoe').reason,
  colemanSideReason: recommendCorrelation(850.0).reason,
  narrowMissReason: recommendCorrelation(999.88).reason,
});

// ---------------------------------------------------------------------------
// SECTION 9 to 13. THE TEACHING WELL EBOCHA-5.
//
// A TEACHING WELL. Not a published case, not a real well, and no oracle has
// ever checked it. It exists so the three functions a point check cannot reach
// have something to run on: the profile, the sizing and the correlation seam.
// Professional m01 to m03, Expert m01, m02 and m05 l04.
// ---------------------------------------------------------------------------

export const EBOCHA = Object.freeze({
  name: 'EBOCHA-5',
  depthFt: 7500,
  idIn: 3.548,
  gasSg: 0.62,
  sigmaDyneCm: 62,
  rhoLiquidLbFt3: 66.2,
  qMscfd: 3100,
  liquidLabel: 'produced brine',
  raw: Object.freeze([
    Object.freeze([0, 880, 112]),
    Object.freeze([1500, 978, 128.4]),
    Object.freeze([3000, 1090, 144.8]),
    Object.freeze([4500, 1218, 161.2]),
    Object.freeze([6000, 1350, 177.6]),
    Object.freeze([7500, 1500, 194]),
  ]),
});

/** The tubing sizes a velocity string is picked from on this well. */
export const EBOCHA_CANDIDATES_IN = Object.freeze([
  3.958, 3.826, 3.740, 3.548, 3.476, 3.068, 2.441, 2.041, 1.610,
]);

/**
 * The flowing traverse, top first. The traverse is PASSED IN: `loadingProfile`
 * does not solve multiphase flow and does not invent a gradient, so z is the
 * only thing computed here, through the compressibility route.
 */
export const ebochaStations = memoize(() => EBOCHA.raw.map(([depthFt, pPsia, tF]) => ({
  depthFt,
  pPsia,
  tF,
  tempR: toRankine(tF),
  z: naturalGasZ({ pPsia, tF, gasSg: EBOCHA.gasSg }),
  idIn: EBOCHA.idIn,
})));

/** The whole definition on one page, so a reader can rebuild the well. */
export const ebochaDefinition = () => {
  const stations = ebochaStations();
  return {
    ...EBOCHA,
    raw: undefined,
    areaFt2: tubingAreaFt2(EBOCHA.idIn),
    candidatesIdIn: [...EBOCHA_CANDIDATES_IN],
    wellheadPsia: stations[0].pPsia,
    shoePsia: stations[stations.length - 1].pPsia,
    pressureRatio: stations[stations.length - 1].pPsia / stations[0].pPsia,
  };
};

/** The traverse with its gas density at every station. */
export const ebochaTraverseRows = () => ebochaStations().map((s) => ({
  ...s,
  rhoGasLbFt3: gasDensityLbFt3({ pPsia: s.pPsia, tempR: s.tempR, z: s.z, gasSg: EBOCHA.gasSg }),
}));

/**
 * What `recommendCorrelation` returns for the WELLHEAD pressure, which is how
 * the function is called in practice. This one answer is then used at every
 * station including the one that actually controls.
 */
export const ebochaWellheadRecommendation = () =>
  recommendCorrelation(ebochaStations()[0].pPsia, 'wellhead');

/** The shipped correlation for this well: the wellhead's answer. */
export const ebochaShippedCorrelation = () => ebochaWellheadRecommendation().correlation;

const ebochaProfileCache = new Map();

/** The loading profile down the whole string, under either correlation. */
export const ebochaProfile = (correlation = ebochaShippedCorrelation(), qMscfd = EBOCHA.qMscfd) => {
  const key = `${correlation}|${qMscfd}`;
  if (!ebochaProfileCache.has(key)) {
    ebochaProfileCache.set(key, loadingProfile({
      stations: ebochaStations(),
      qMscfd,
      correlation,
      sigmaDyneCm: EBOCHA.sigmaDyneCm,
      rhoLiquidLbFt3: EBOCHA.rhoLiquidLbFt3,
      gasSg: EBOCHA.gasSg,
    }));
  }
  return ebochaProfileCache.get(key);
};

/** The profile station by station, top first, so the crossing is a sequence. */
export const ebochaProfileRows = (correlation = ebochaShippedCorrelation()) =>
  ebochaProfile(correlation).points.map((pt, i, all) => ({
    depthFt: pt.depthFt,
    pPsia: pt.pPsia,
    tempR: pt.tempR,
    z: pt.z,
    idIn: pt.idIn,
    rhoGasLbFt3: pt.rhoGasLbFt3,
    terminalFtS: pt.terminalFtS,
    criticalVelocityFtS: pt.criticalVelocityFtS,
    criticalRateMscfd: pt.criticalRateMscfd,
    actualVelocityFtS: pt.actualVelocityFtS,
    ratio: pt.ratio,
    loaded: pt.loaded,
    marginPct: (pt.ratio - 1) * 100,
    // the increments, so the shape is visible rather than asserted
    criticalRateRiseMscfd: i === 0 ? null : pt.criticalRateMscfd - all[i - 1].criticalRateMscfd,
    ratioFall: i === 0 ? null : all[i - 1].ratio - pt.ratio,
  }));

/**
 * The verdict for the well, and what a wellhead-only check would have said on
 * the same well on the same day. This is the whole Professional tier in one
 * object: the well passes at the gauge and loads at the shoe.
 */
export const ebochaProfileSummary = (correlation = ebochaShippedCorrelation()) => {
  const p = ebochaProfile(correlation);
  const pts = p.points;
  const wellhead = pts[0];
  const shoe = pts[pts.length - 1];
  let deepestHealthy = null;
  let shallowestLoading = null;
  pts.forEach((pt) => {
    if (pt.ratio >= 1) deepestHealthy = pt;
    else if (!shallowestLoading) shallowestLoading = pt;
  });
  return {
    correlation,
    ok: p.ok,
    loaded: p.loaded,
    marginPct: p.marginPct,
    controllingDepthFt: p.controlling.depthFt,
    controllingCriticalRateMscfd: p.controlling.criticalRateMscfd,
    controllingRatio: p.controlling.ratio,
    wellheadRatio: wellhead.ratio,
    shoeRatio: shoe.ratio,
    wellheadOverShoe: wellhead.ratio / shoe.ratio,
    wellheadMarginPct: (wellhead.ratio - 1) * 100,
    wellheadLoaded: wellhead.loaded,
    deepestHealthyDepthFt: deepestHealthy ? deepestHealthy.depthFt : null,
    deepestHealthyRatio: deepestHealthy ? deepestHealthy.ratio : null,
    shallowestLoadingDepthFt: shallowestLoading ? shallowestLoading.depthFt : null,
    shallowestLoadingRatio: shallowestLoading ? shallowestLoading.ratio : null,
    // the crossing lies inside the deepest x percent of the string and outside
    // the deepest y percent, which is as far as six stations can pin it
    insideDeepestPct: deepestHealthy
      ? ((EBOCHA.depthFt - deepestHealthy.depthFt) / EBOCHA.depthFt) * 100 : null,
    outsideDeepestPct: shallowestLoading
      ? ((EBOCHA.depthFt - shallowestLoading.depthFt) / EBOCHA.depthFt) * 100 : null,
  };
};

export const EBOCHA_RATE_SWEEP_MSCFD = Object.freeze([
  2400, 2700, 3000, 3100, 3200, 3450, 3700, 4000,
]);

/**
 * The same well at a contiguous set of gas rates, so the crossing can be
 * watched walking UP the hole as the well declines. Two of the rates cross
 * nothing at all, and they are printed rather than dropped.
 */
export const ebochaRateSweepRows = (
  rates = EBOCHA_RATE_SWEEP_MSCFD,
  correlation = ebochaShippedCorrelation(),
) => rates.map((qMscfd) => {
  const pr = ebochaProfile(correlation, qMscfd);
  const crossing = pr.points.find((pt) => pt.ratio < 1);
  return {
    qMscfd,
    ratios: pr.points.map((pt) => pt.ratio),
    loaded: pr.loaded,
    marginPct: pr.marginPct,
    shallowestLoadingDepthFt: crossing ? crossing.depthFt : null,
  };
});

/**
 * A profile run on the WELLHEAD ALONE. `loadingProfile` names the controlling
 * station out of the stations it was given, so handed one station it names
 * that one, calls it controlling, and returns a healthy well. The function is
 * right and the traverse was wrong, and nothing in the return says which.
 */
export const ebochaWellheadOnlyProfile = (correlation = ebochaShippedCorrelation()) => {
  const p = loadingProfile({
    stations: [ebochaStations()[0]],
    qMscfd: EBOCHA.qMscfd,
    correlation,
    sigmaDyneCm: EBOCHA.sigmaDyneCm,
    rhoLiquidLbFt3: EBOCHA.rhoLiquidLbFt3,
    gasSg: EBOCHA.gasSg,
  });
  const full = ebochaProfileSummary(correlation);
  return {
    correlation,
    ok: p.ok,
    stationCount: p.points.length,
    controllingDepthFt: p.controlling.depthFt,
    controllingRatio: p.controlling.ratio,
    loaded: p.loaded,
    marginPct: p.marginPct,
    fullTraverseControllingDepthFt: full.controllingDepthFt,
    fullTraverseControllingRatio: full.controllingRatio,
    fullTraverseLoaded: full.loaded,
    fullTraverseMarginPct: full.marginPct,
  };
};

/**
 * THE MIXED PROFILE. `recommendCorrelation` asked at every station and its
 * answer USED at that station, rather than the wellhead's answer used
 * everywhere. This is not what the study did and it is not what the module
 * offers: it exists so a reader can see what choosing per station costs.
 *
 * The crossing moves up the hole, and the critical rate stops rising smoothly:
 * a Coleman rate at one station against a Turner rate at the next is a step
 * that is an artefact of the choice and not a property of the well.
 */
export const ebochaMixedProfileRows = () => {
  const seam = ebochaSeamRows();
  const recs = ebochaStationRecommendationRows();
  return seam.map((r, i) => {
    const correlation = recs[i].correlation;
    const useTurner = correlation === 'turner';
    return {
      depthFt: r.depthFt,
      pPsia: r.pPsia,
      correlation,
      criticalRateMscfd: useTurner ? r.turnerCriticalRateMscfd : r.colemanCriticalRateMscfd,
      ratio: useTurner ? r.turnerRatio : r.colemanRatio,
      loaded: useTurner ? r.turnerLoaded : r.colemanLoaded,
    };
  });
};

/** What the mixed profile changes, against the shipped one-correlation reading. */
export const ebochaMixedProfileSummary = () => {
  const mixed = ebochaMixedProfileRows();
  const shipped = ebochaProfileSummary(ebochaShippedCorrelation());
  const firstLoaded = mixed.find((r) => r.loaded) || null;
  // the step the mixed reading introduces, where a Coleman rate at one station
  // is followed by a Turner rate at the next
  const stepIndex = mixed.findIndex((r, i) => i > 0 && r.correlation !== mixed[i - 1].correlation);
  return {
    shippedCorrelation: ebochaShippedCorrelation(),
    mixedShallowestLoadingDepthFt: firstLoaded ? firstLoaded.depthFt : null,
    shippedShallowestLoadingDepthFt: shipped.shallowestLoadingDepthFt,
    correlationChangesAtDepthFt: stepIndex > 0 ? mixed[stepIndex].depthFt : null,
    rateBeforeStepMscfd: stepIndex > 0 ? mixed[stepIndex - 1].criticalRateMscfd : null,
    rateAfterStepMscfd: stepIndex > 0 ? mixed[stepIndex].criticalRateMscfd : null,
  };
};

/** What the profile refuses. Both are return values and neither is a throw. */
export const profileRefusals = () => {
  const empty = loadingProfile({
    stations: [], qMscfd: EBOCHA.qMscfd, correlation: 'turner',
    sigmaDyneCm: EBOCHA.sigmaDyneCm, rhoLiquidLbFt3: EBOCHA.rhoLiquidLbFt3, gasSg: EBOCHA.gasSg,
  });
  const unknown = loadingProfile({
    stations: ebochaStations(), qMscfd: EBOCHA.qMscfd, correlation: 'guess',
    sigmaDyneCm: EBOCHA.sigmaDyneCm, rhoLiquidLbFt3: EBOCHA.rhoLiquidLbFt3, gasSg: EBOCHA.gasSg,
  });
  return [
    { label: 'an empty traverse', ok: empty.ok, error: empty.error },
    { label: 'an unknown correlation in a profile', ok: unknown.ok, error: unknown.error },
  ];
};

/**
 * THE CORRELATION SEAM AT FULL SIZE. The same six stations, evaluated once
 * under Coleman and once under Turner. The choice was made from the wellhead
 * pressure alone and is worth exactly twenty percent of every critical rate the
 * study goes on to compute.
 */
export const ebochaSeamRows = () => {
  const c = ebochaProfile('coleman');
  const t = ebochaProfile('turner');
  return c.points.map((pc, i) => {
    const pt = t.points[i];
    return {
      depthFt: pc.depthFt,
      pPsia: pc.pPsia,
      colemanCriticalVelocityFtS: pc.criticalVelocityFtS,
      turnerCriticalVelocityFtS: pt.criticalVelocityFtS,
      colemanCriticalRateMscfd: pc.criticalRateMscfd,
      turnerCriticalRateMscfd: pt.criticalRateMscfd,
      rateDifferenceMscfd: pt.criticalRateMscfd - pc.criticalRateMscfd,
      turnerOverColeman: pt.criticalRateMscfd / pc.criticalRateMscfd,
      colemanRatio: pc.ratio,
      turnerRatio: pt.ratio,
      colemanLoaded: pc.loaded,
      turnerLoaded: pt.loaded,
      verdictsAgree: pc.loaded === pt.loaded,
    };
  });
};

/** The two whole-well verdicts, and the stations where they disagree. */
export const ebochaSeamVerdicts = () => {
  const rows = ebochaSeamRows();
  const c = ebochaProfileSummary('coleman');
  const t = ebochaProfileSummary('turner');
  return {
    coleman: c,
    turner: t,
    disagreeAtDepthsFt: rows.filter((r) => !r.verdictsAgree).map((r) => r.depthFt),
    agreeAtDepthsFt: rows.filter((r) => r.verdictsAgree).map((r) => r.depthFt),
  };
};

/**
 * `recommendCorrelation` asked at EVERY station rather than only at the gauge.
 * The function takes one pressure, so this is the same call six times, and it
 * does not return the same answer. This is NOT what the study did: the shipped
 * reading uses the wellhead's answer everywhere.
 */
export const ebochaStationRecommendationRows = () => ebochaStations().map((s) => {
  const r = recommendCorrelation(s.pPsia, `at the ${s.depthFt.toLocaleString('en-US')} ft station`);
  return {
    depthFt: s.depthFt,
    pPsia: s.pPsia,
    correlation: r.correlation,
    reason: r.reason,
    matchesWellheadChoice: r.correlation === ebochaShippedCorrelation(),
  };
});

/** The same seam on a PUBLISHED station, golden row 5, so it is not only a teaching-well number. */
export const publishedSeam = () => {
  const gr = golden.velocity[4];
  const colemanRateMscfd = rateAtVelocity({
    velocityFtS: gr.colemanFtS, areaFt2: PUBLISHED_AREA_FT2,
    pPsia: gr.pPsia, tempR: gr.tempR, z: gr.z,
  });
  return {
    row: 5,
    pPsia: gr.pPsia,
    tempR: gr.tempR,
    colemanRateMscfd,
    turnerRateMscfd: gr.criticalRateTurnerMscfd,
    differenceMscfd: gr.criticalRateTurnerMscfd - colemanRateMscfd,
    // a well making exactly the Coleman rate is loading under Turner
    ratioUnderTurner: colemanRateMscfd / gr.criticalRateTurnerMscfd,
  };
};

// --------------------------------------------------------------- the sizing

const ebochaSizingCache = new Map();

/**
 * `sizeTubingForRate` at a named station on EBOCHA-5. `station` is 'controlling'
 * or 'wellhead'.
 *
 * THE RETURNED OBJECT CARRIES `rows`, `largestUnloaded` AND `ok`. `ok` is the
 * key that arrived at engines 5733550 and it is what separates a REFUSAL from
 * an ANSWER: a null `largestUnloaded` under `ok: true` means every candidate
 * was evaluated and none of them unloads this well, and a null under
 * `ok: false` means the question was never evaluated. `rows` and
 * `largestUnloaded` are computed exactly as before either way.
 *
 * THE STATION IS RECORDED NOWHERE. A row carries the pressure and temperature
 * only through the density and the velocity it produced, and the returned
 * object names no depth at all, so two sizings run at two stations on the same
 * well are indistinguishable from their return values.
 */
export const ebochaSizing = (correlation, station = 'controlling', qMscfd = EBOCHA.qMscfd) => {
  const key = `${correlation}|${station}|${qMscfd}`;
  if (!ebochaSizingCache.has(key)) {
    const at = station === 'wellhead'
      ? ebochaStations()[0]
      : ebochaProfile(ebochaShippedCorrelation()).controlling;
    ebochaSizingCache.set(key, sizeTubingForRate({
      candidatesIdIn: [...EBOCHA_CANDIDATES_IN],
      qMscfd,
      correlation,
      sigmaDyneCm: EBOCHA.sigmaDyneCm,
      rhoLiquidLbFt3: EBOCHA.rhoLiquidLbFt3,
      pPsia: at.pPsia,
      tempR: at.tempR,
      z: at.z,
      gasSg: EBOCHA.gasSg,
    }));
  }
  return ebochaSizingCache.get(key);
};

/** The station the sizing was handed, which the return value does not carry. */
export const ebochaSizingStation = (station = 'controlling') => {
  const at = station === 'wellhead'
    ? ebochaStations()[0]
    : ebochaProfile(ebochaShippedCorrelation()).controlling;
  return {
    station,
    depthFt: at.depthFt,
    pPsia: at.pPsia,
    tempR: at.tempR,
    z: at.z,
    idIn: at.idIn,
    qMscfd: EBOCHA.qMscfd,
  };
};

/** Every candidate and its ratio, largest diameter first, as the engine returns them. */
export const ebochaSizingRows = (correlation, station = 'controlling') =>
  ebochaSizing(correlation, station).rows.map((r) => ({
    idIn: r.idIn,
    ok: r.ok,
    correlation: r.correlation,
    adjustment: r.adjustment,
    areaFt2: r.areaFt2,
    criticalVelocityFtS: r.criticalVelocityFtS,
    criticalRateMscfd: r.criticalRateMscfd,
    actualVelocityFtS: r.actualVelocityFtS,
    ratio: r.ratio,
    unloads: r.ratio >= 1,
  }));

/** The pick, the rejects, and the `ok` that says which kind of answer this is. */
export const ebochaSizingVerdict = (correlation, station = 'controlling') => {
  const s = ebochaSizing(correlation, station);
  const rows = ebochaSizingRows(correlation, station);
  return {
    correlation,
    station,
    ok: s.ok,
    reason: s.reason,
    pickIdIn: s.largestUnloaded ? s.largestUnloaded.idIn : null,
    pickRatio: s.largestUnloaded ? s.largestUnloaded.ratio : null,
    unloadIdsIn: rows.filter((r) => r.unloads).map((r) => r.idIn),
    rejectedIdsIn: rows.filter((r) => !r.unloads).map((r) => r.idIn),
    bestRatioOnTheList: Math.max(...rows.map((r) => r.ratio)),
    objectKeys: Object.keys(s),
    rowKeys: Object.keys(s.rows[0]),
  };
};

/**
 * THE DISCARDED CANDIDATE. The pick is the largest candidate whose ratio clears
 * one, so it is a function of the CORRELATION CHOICE made somewhere else, and
 * nothing in the returned object says so.
 */
export const ebochaSizingComparison = (station = 'controlling') => {
  const c = ebochaSizing('coleman', station);
  const t = ebochaSizing('turner', station);
  const colemanPick = c.largestUnloaded;
  const turnerPick = t.largestUnloaded;
  const colemanPickUnderTurner = t.rows.find((r) => r.idIn === colemanPick.idIn);
  const turnerPickUnderColeman = c.rows.find((r) => r.idIn === turnerPick.idIn);
  return {
    station,
    colemanPickIdIn: colemanPick.idIn,
    colemanPickRatio: colemanPick.ratio,
    turnerPickIdIn: turnerPick.idIn,
    turnerPickRatio: turnerPick.ratio,
    picksAgree: colemanPick.idIn === turnerPick.idIn,
    sizeDifferenceIn: colemanPick.idIn - turnerPick.idIn,
    discardedIdIn: colemanPick.idIn,
    discardedRatioUnderColeman: colemanPick.ratio,
    discardedRatioUnderTurner: colemanPickUnderTurner.ratio,
    discardedRatioLoss: colemanPick.ratio - colemanPickUnderTurner.ratio,
    // the loss is exactly one sixth of the ratio, because Turner is Coleman
    // times 1.2 and the ratio is inversely linear in the critical rate
    discardedRatioLossPct: (1 - 1 / TURNER_OVER_COLEMAN) * 100,
    turnerPickRatioUnderColeman: turnerPickUnderColeman.ratio,
  };
};

/**
 * A rate nothing on the list can carry. `largestUnloaded` is null and `ok` is
 * TRUE, because the question was evaluated and the answer is that no candidate
 * unloads this well. That is a finding, and it is the half of the old null that
 * a reader can act on.
 */
export const ebochaHopelessSizing = () => {
  const s = ebochaSizing('turner', 'controlling', 40);
  return {
    qMscfd: 40,
    ok: s.ok,
    reason: s.reason,
    largestUnloaded: s.largestUnloaded,
    bestRatioOnTheList: Math.max(...s.rows.map((r) => r.ratio)),
    rowCount: s.rows.length,
  };
};

/**
 * The other half of the old null, and the reason `ok` had to exist. Every one
 * of these returns a null pick with `ok: false`, which is a REFUSAL: the
 * question was never evaluated, so `largestUnloaded` is not a finding about
 * this well at all.
 */
export const ebochaSizingRefusals = () => {
  const at = ebochaProfile(ebochaShippedCorrelation()).controlling;
  const base = {
    qMscfd: EBOCHA.qMscfd,
    correlation: 'turner',
    sigmaDyneCm: EBOCHA.sigmaDyneCm,
    rhoLiquidLbFt3: EBOCHA.rhoLiquidLbFt3,
    pPsia: at.pPsia,
    tempR: at.tempR,
    z: at.z,
    gasSg: EBOCHA.gasSg,
  };
  const noCandidates = sizeTubingForRate({ ...base, candidatesIdIn: [] });
  const noRate = sizeTubingForRate({
    ...base, candidatesIdIn: [...EBOCHA_CANDIDATES_IN], qMscfd: NaN,
  });
  const unreadable = sizeTubingForRate({
    ...base, candidatesIdIn: [...EBOCHA_CANDIDATES_IN], correlation: 'guess',
  });
  return [
    {
      label: 'no candidate sizes were given',
      ok: noCandidates.ok,
      largestUnloaded: noCandidates.largestUnloaded,
      rowCount: noCandidates.rows.length,
      reason: noCandidates.reason,
    },
    {
      label: 'no gas rate could be read',
      ok: noRate.ok,
      largestUnloaded: noRate.largestUnloaded,
      rowCount: noRate.rows.length,
      reason: noRate.reason,
    },
    {
      label: 'no candidate could be evaluated at these conditions',
      ok: unreadable.ok,
      largestUnloaded: unreadable.largestUnloaded,
      rowCount: unreadable.rows.length,
      reason: unreadable.reason,
    },
  ];
};

/**
 * THE SAME SIZING AT THE WRONG STATION. `sizeTubingForRate` takes bare pPsia,
 * tempR and z and has no opinion about which station they came from.
 * `loadingProfile`'s header says the controlling station is the shoe and that
 * evaluating at the wellhead is the classic error, and the sizing that consumes
 * that judgement accepts wellhead conditions without a murmur.
 */
export const ebochaStationCost = () => {
  const shipped = ebochaShippedCorrelation();
  const perCorrelation = CORRELATIONS.map((correlation) => {
    const wellhead = ebochaSizing(correlation, 'wellhead').largestUnloaded;
    const controlling = ebochaSizing(correlation, 'controlling').largestUnloaded;
    return {
      correlation,
      wellheadPickIdIn: wellhead ? wellhead.idIn : null,
      wellheadPickRatio: wellhead ? wellhead.ratio : null,
      controllingPickIdIn: controlling ? controlling.idIn : null,
      controllingPickRatio: controlling ? controlling.ratio : null,
      stationWorthIn: wellhead && controlling ? wellhead.idIn - controlling.idIn : null,
    };
  });
  const whRows = ebochaSizingRows(shipped, 'wellhead');
  const ctrlRows = ebochaSizingRows(shipped, 'controlling');
  const wellheadPick = ebochaSizing(shipped, 'wellhead').largestUnloaded;
  const summary = ebochaProfileSummary(shipped);
  return {
    correlation: shipped,
    perCorrelation,
    currentStringIdIn: EBOCHA.idIn,
    wellheadSizingPickIdIn: wellheadPick.idIn,
    // the wellhead sizing returns a string LARGER than the one in the hole, so
    // it reports that no workover is needed
    reportsNoWorkoverNeeded: wellheadPick.idIn >= EBOCHA.idIn,
    currentStringRatioAtWellhead: whRows.find((r) => r.idIn === EBOCHA.idIn).ratio,
    currentStringRatioAtControlling: ctrlRows.find((r) => r.idIn === EBOCHA.idIn).ratio,
    loadingOverBottomPct: summary.insideDeepestPct,
    controllingPointCarries: {
      pPsia: ebochaSizingStation('controlling').pPsia,
      tempR: ebochaSizingStation('controlling').tempR,
      z: ebochaSizingStation('controlling').z,
      idIn: ebochaSizingStation('controlling').idIn,
      depthFt: ebochaSizingStation('controlling').depthFt,
    },
  };
};

// ---------------------------------------------------------------------------
// SECTION 14. THE PUBLISHED PLUNGER LIFT CASE, TERM BY TERM.
// Professional m04 owns the reading.
// ---------------------------------------------------------------------------

/** The one plunger case the oracle publishes. */
export const PUBLISHED_PLUNGER_INPUTS = Object.freeze({ ...golden.plunger.inputs });

const publishedLift = memoize(() => liftPressure({
  linePressurePsia: PUBLISHED_PLUNGER_INPUTS.linePressurePsia,
  slugLengthFt: PUBLISHED_PLUNGER_INPUTS.slugLengthFt,
  liquidSg: PUBLISHED_PLUNGER_INPUTS.liquidSg,
  idIn: PUBLISHED_PLUNGER_INPUTS.idIn,
  plungerWeightLb: PUBLISHED_PLUNGER_INPUTS.plungerWeightLb,
  depthFt: PUBLISHED_PLUNGER_INPUTS.depthFt,
  gasSg: PUBLISHED_PLUNGER_INPUTS.gasSg,
  avgTempR: PUBLISHED_PLUNGER_INPUTS.avgTempR,
  z: PUBLISHED_PLUNGER_INPUTS.z,
}));

/**
 * The whole static force balance, term by term, with the oracle beside it. The
 * only term the two disagree on is the slug hydrostatic, and the disagreement
 * is the rounded gradient constant. See `gradientConstant()`.
 */
export const publishedPlunger = memoize(() => {
  const g = golden.plunger;
  const lift = publishedLift();
  const gasScf = gasPerCycleScf({
    depthFt: PUBLISHED_PLUNGER_INPUTS.depthFt,
    idIn: PUBLISHED_PLUNGER_INPUTS.idIn,
    pStartPsia: PUBLISHED_PLUNGER_INPUTS.casingPressurePsia,
    pEndPsia: lift.requiredPsia,
    avgTempR: PUBLISHED_PLUNGER_INPUTS.avgTempR,
    z: PUBLISHED_PLUNGER_INPUTS.z,
  });
  const liquidBbl = slugVolumeBbl({
    slugLengthFt: PUBLISHED_PLUNGER_INPUTS.slugLengthFt,
    idIn: PUBLISHED_PLUNGER_INPUTS.idIn,
  });
  const ruleOfThumb = ruleOfThumbGlr({ depthFt: PUBLISHED_PLUNGER_INPUTS.depthFt });
  return {
    inputs: PUBLISHED_PLUNGER_INPUTS,
    goldenSlugPsi: g.slugPsi,
    goldenPlungerPsi: g.plungerPsi,
    goldenGasColumnPsi: g.gasColumnPsi,
    goldenRequiredPsia: g.requiredPsia,
    goldenGasPerCycleScf: g.gasPerCycleScf,
    goldenLiquidPerCycleBbl: g.liquidPerCycleBbl,
    goldenRequiredGlrScfBbl: g.requiredGlrScfBbl,
    linePressurePsi: lift.terms.linePressurePsia,
    slugPsi: lift.terms.slugPsi,
    plungerPsi: lift.terms.plungerPsi,
    gasColumnPsi: lift.terms.gasColumnPsi,
    frictionPsi: lift.terms.frictionPsi,
    requiredPsia: lift.requiredPsia,
    areaIn2: lift.areaIn2,
    termsSum: Object.values(lift.terms).reduce((a, v) => a + v, 0),
    slugDiff: lift.terms.slugPsi - g.slugPsi,
    plungerDiff: lift.terms.plungerPsi - g.plungerPsi,
    gasColumnDiff: lift.terms.gasColumnPsi - g.gasColumnPsi,
    requiredDiff: lift.requiredPsia - g.requiredPsia,
    gasPerCycleScf: gasScf,
    gasPerCycleDiff: gasScf - g.gasPerCycleScf,
    liquidPerCycleBbl: liquidBbl,
    liquidPerCycleDiff: liquidBbl - g.liquidPerCycleBbl,
    requiredGlrScfBbl: gasScf / liquidBbl,
    requiredGlrDiff: gasScf / liquidBbl - g.requiredGlrScfBbl,
    slugLengthRoundTripFt: slugLengthForBbl({
      bbl: liquidBbl, idIn: PUBLISHED_PLUNGER_INPUTS.idIn,
    }),
    ruleOfThumbGlrScfBbl: ruleOfThumb,
    physicsOverHeuristic: (gasScf / liquidBbl) / ruleOfThumb,
    ft3PerBbl: FT3_PER_BBL,
    ruleOfThumbConstant: RULE_OF_THUMB_SCF_PER_BBL_PER_1000FT,
    typical: TYPICAL,
  };
});

/**
 * THE UNSTATED CONVENTION, PRICED. `liftPressure` evaluates its gas column at
 * the LINE pressure and applies that density over the whole tubing above the
 * slug. The header defends carrying the term and never says at which pressure
 * it is carried, so the same term is run three ways here. A defensible choice
 * stated is worth more than a better choice left implicit, and a reader cannot
 * judge the choice without the spread.
 */
export const gasColumnConvention = () => {
  const i = PUBLISHED_PLUNGER_INPUTS;
  const heightFt = i.depthFt - i.slugLengthFt;
  const term = (pPsia) => (gasDensityLbFt3({
    pPsia, tempR: i.avgTempR, gasSg: i.gasSg, z: i.z,
  }) * heightFt) / 144;
  const atLine = term(i.linePressurePsia);
  const pTopPsia = i.linePressurePsia + atLine;
  const pAvgPsia = (i.linePressurePsia + pTopPsia) / 2;
  return {
    heightFt,
    linePressurePsia: i.linePressurePsia,
    atLinePsi: atLine,
    pTopPsia,
    atSlugTopPsi: term(pTopPsia),
    pAvgPsia,
    atAveragePsi: term(pAvgPsia),
    spreadPsi: term(pTopPsia) - atLine,
    spreadAsFractionOfLift: Math.abs(term(pTopPsia) - atLine) / golden.plunger.requiredPsia,
  };
};

/** Friction is linear and additive, which is the easiest thing here to check by hand. */
export const publishedPlungerWithFriction = (frictionPsi = 40) => {
  const i = PUBLISHED_PLUNGER_INPUTS;
  const withF = liftPressure({
    linePressurePsia: i.linePressurePsia, slugLengthFt: i.slugLengthFt, liquidSg: i.liquidSg,
    idIn: i.idIn, plungerWeightLb: i.plungerWeightLb, depthFt: i.depthFt,
    gasSg: i.gasSg, avgTempR: i.avgTempR, z: i.z, frictionPsi,
  });
  return {
    frictionPsi,
    requiredPsia: withF.requiredPsia,
    addedPsi: withF.requiredPsia - publishedLift().requiredPsia,
  };
};

// ---------------------------------------------------------------------------
// SECTION 15. THE GRADIENT CONSTANT. Expert m03.
// ---------------------------------------------------------------------------

/**
 * `plungerLift.PSI_PER_FT_SG` is 0.433 where the oracle carries rho g exactly.
 * The two are 0.1218 percent apart, the gate knows it and loosens that ONE
 * assertion to a 5e-3 relative tolerance, and the golden publishes the ORACLE's
 * number for its own case, which the engine cannot reproduce.
 *
 * The cost is a FIXED PERCENTAGE of whatever slug it sits on, so a cost in psi
 * divides straight back to the slug that produced it.
 */
export const gradientConstant = () => {
  const i = PUBLISHED_PLUNGER_INPUTS;
  const engineSlugPsi = PSI_PER_FT_SG * i.liquidSg * i.slugLengthFt;
  return {
    gSi: G_SI,
    paPerMetre: 1000 * G_SI,
    paPerFt: 1000 * G_SI * M_PER_FT,
    mPerFt: M_PER_FT,
    paPerPsi: PA_PER_PSI,
    exactPsiPerFtSg: EXACT_PSI_PER_FT_SG,
    shippedPsiPerFtSg: PSI_PER_FT_SG,
    difference: EXACT_PSI_PER_FT_SG - PSI_PER_FT_SG,
    exactOverShipped: EXACT_PSI_PER_FT_SG / PSI_PER_FT_SG,
    roundingPctOfExact: ((EXACT_PSI_PER_FT_SG - PSI_PER_FT_SG) / EXACT_PSI_PER_FT_SG) * 100,
    roundingPctOfShipped: ((EXACT_PSI_PER_FT_SG - PSI_PER_FT_SG) / PSI_PER_FT_SG) * 100,
    goldenSlugPsi: golden.plunger.slugPsi,
    engineSlugPsi,
    costOnPublishedSlugPsi: golden.plunger.slugPsi - engineSlugPsi,
    costOnPublishedLiftPsi: golden.plunger.requiredPsia - publishedLift().requiredPsia,
    costOnPublishedLiftPct:
      ((golden.plunger.requiredPsia - publishedLift().requiredPsia) / golden.plunger.requiredPsia) * 100,
    // the same constant, at the same value, sits in espDesign in this domain,
    // beside an exact 62.4/144 elsewhere: one adjudication, not two local fixes
    sixtyTwoPointFourOver144: 62.4 / 144,
    gateRelativeTolerance: 5e-3,
    gateSlackFactor: 5e-3 / ((EXACT_PSI_PER_FT_SG - PSI_PER_FT_SG) / EXACT_PSI_PER_FT_SG),
  };
};

/**
 * WHICH OF THE FIVE LIFT TERMS CARRIES THE ROUNDED CONSTANT. One of five, and
 * it is compared against a casing pressure built from nothing at all, so
 * nothing cancels: the rounding survives whole into the verdict.
 */
export const liftTermProvenance = () => {
  const p = publishedPlunger();
  return [
    { term: 'line pressure', psi: p.linePressurePsi, builtFromTheConstant: false, note: 'an input' },
    { term: 'slug hydrostatic', psi: p.slugPsi, builtFromTheConstant: true, note: 'PSI_PER_FT_SG times the specific gravity times the slug length' },
    { term: 'plunger weight', psi: p.plungerPsi, builtFromTheConstant: false, note: 'weight over the tubing cross-section' },
    { term: 'gas column', psi: p.gasColumnPsi, builtFromTheConstant: false, note: 'the real-gas density over 144, carried at the line pressure' },
    { term: 'friction', psi: p.frictionPsi, builtFromTheConstant: false, note: 'an input, measured rather than modelled' },
  ];
};

export const GRADIENT_SLUG_LENGTHS_FT = Object.freeze([120, 180, 240, 300, 360, 420, 480]);

/** A TEACHING slug sweep at 1.06 SG, so the fixed percentage and the growing absolute cost are both visible. */
export const gradientSlugRows = (lengths = GRADIENT_SLUG_LENGTHS_FT, liquidSg = 1.06) =>
  lengths.map((slugLengthFt) => {
    const rounded = PSI_PER_FT_SG * liquidSg * slugLengthFt;
    const exact = EXACT_PSI_PER_FT_SG * liquidSg * slugLengthFt;
    return {
      slugLengthFt,
      liquidSg,
      roundedPsi: rounded,
      exactPsi: exact,
      costPsi: exact - rounded,
      costPct: ((exact - rounded) / exact) * 100,
    };
  });

// ---------------------------------------------------------------------------
// SECTION 16 to 19. THE TEACHING WELL OGUTA-2 AND THE PLUNGER SCREEN.
//
// A TEACHING WELL. Not a published case, not a real well, no oracle has checked
// it. It exists so the casing pressure can be walked down through the lift
// requirement, which the published case does not do. Professional m04, Expert
// m04 and m05.
// ---------------------------------------------------------------------------

export const OGUTA = Object.freeze({
  name: 'OGUTA-2',
  depthFt: 8200,
  idIn: 2.441,
  linePressurePsia: 145,
  casingPressurePsia: 720,
  slugLengthFt: 160,
  liquidSg: 1.06,
  plungerWeightLb: 8.2,
  gasSg: 0.66,
  avgTempR: 592,
  z: 0.87,
  wellGlrScfBbl: 5900,
  gasRateMscfd: 1150,
  riseFtMin: 750,
  fallInGasFtMin: 1000,
  fallInLiquidFtMin: 172,
  afterflowMin: 30,
  shutInMin: 40,
});

/** The screen's own argument list. `gasRateMscfd` is the well's, and the screen never sees it. */
export const ogutaScreenArgs = (patch = {}) => {
  const { name, gasRateMscfd, ...args } = OGUTA;
  return { ...args, ...patch };
};

const ogutaScreenCache = new Map();

export const ogutaScreen = (patch = {}) => {
  const key = JSON.stringify(patch);
  if (!ogutaScreenCache.has(key)) {
    ogutaScreenCache.set(key, screenPlungerLift(ogutaScreenArgs(patch)));
  }
  return ogutaScreenCache.get(key);
};

/** The whole definition on one page. */
export const ogutaDefinition = () => ({
  ...OGUTA,
  crossSectionIn2: tubingAreaIn2(OGUTA.idIn),
  areaFt2: tubingAreaFt2(OGUTA.idIn),
  avgTempF: OGUTA.avgTempR - R_OFFSET,
});

/** Every field the screen returns, including the ones the verdict never uses. */
export const ogutaScreenReading = () => {
  const s = ogutaScreen();
  const d = s.design;
  return {
    ok: s.ok,
    errorCount: s.errors.length,
    linePressurePsi: d.lift.terms.linePressurePsia,
    slugPsi: d.lift.terms.slugPsi,
    plungerPsi: d.lift.terms.plungerPsi,
    gasColumnPsi: d.lift.terms.gasColumnPsi,
    frictionPsi: d.lift.terms.frictionPsi,
    requiredPsia: d.lift.requiredPsia,
    casingExceedsByPsi: OGUTA.casingPressurePsia - d.lift.requiredPsia,
    gasPerCycleScf: d.gasPerCycleScf,
    liquidPerCycleBbl: d.liquidPerCycleBbl,
    requiredGlrScfBbl: d.requiredGlrScfBbl,
    wellGlrScfBbl: d.wellGlrScfBbl,
    ruleOfThumbGlrScfBbl: d.ruleOfThumbGlrScfBbl,
    ruleOfThumbAgrees: d.ruleOfThumbAgrees,
    requirementOverRuleOfThumb: d.requiredGlrScfBbl / d.ruleOfThumbGlrScfBbl,
    riseMin: d.timing.riseMin,
    fallMin: d.timing.fallMin,
    afterflowMin: d.timing.afterflowMin,
    shutInMin: d.timing.shutInMin,
    totalMin: d.timing.totalMin,
    cyclesPerDay: d.timing.cyclesPerDay,
    liquidPerDayBbl: d.liquidPerDayBbl,
    gasPerDayMscf: d.gasPerDayMscf,
    pressureOk: d.pressureOk,
    glrOk: d.glrOk,
    feasible: d.feasible,
    warningCodes: d.warnings.map((wn) => wn.code),
    warnings: d.warnings.map((wn) => ({ code: wn.code, message: wn.message })),
    designKeys: Object.keys(d),
  };
};

/** What the screen refuses outright, on the same well with one input broken. */
export const OGUTA_BROKEN_INPUTS = Object.freeze([
  ['zero depth', { depthFt: 0 }],
  ['zero plunger weight', { plungerWeightLb: 0 }],
  ['a slug longer than the tubing', { slugLengthFt: 9000 }],
  ['zero tubing diameter', { idIn: 0 }],
  ['zero slug', { slugLengthFt: 0 }],
  ['zero average temperature', { avgTempR: 0 }],
]);

export const ogutaScreenRefusals = (cases = OGUTA_BROKEN_INPUTS) => cases.map(([label, patch]) => {
  const r = ogutaScreen(patch);
  return { label, ok: r.ok, errors: r.errors.join(' ') };
});

// ------------------------------------------- the requirement that falls

export const OGUTA_CASING_SWEEP_PSIA = Object.freeze([
  900, 720, 600, 480, 400, 320, 285, 240, 180, 130, 90,
]);

/**
 * THE REQUIREMENT THAT FALLS THE WRONG WAY. `screenPlungerLift` computes the
 * gas a cycle needs as an expansion from the casing pressure down to the
 * pressure still needed at the top of the rise, and `gasPerCycleScf` averages
 * the two ends with no check that the expansion runs the right way. When the
 * casing cannot reach the requirement the average is simply smaller and a
 * number still comes back.
 *
 * THIS IS A RECORDED OWNER DECISION, NOT A DEFECT TO FIX HERE. `feasible` is
 * `pressureOk && glrOk`, so nothing ships a wrong composite verdict today, but
 * `requiredGlrScfBbl` is the headline number an operator quotes and it is
 * inverted, and `glrOk` flips from false to TRUE on a well that cannot move the
 * plunger at all.
 *
 * READ THE SWEEP IN TWO HALVES. Above the crossing the fall is defensible: less
 * casing pressure genuinely means less gas expanded per cycle. Below the
 * crossing there is no expansion at all and the number is an artefact, and that
 * is the half the missing guard belongs to. `expansionRunsTheRightWay` says
 * which half a row is in.
 */
export const ogutaCasingSweepRows = (pressures = OGUTA_CASING_SWEEP_PSIA) => {
  const requiredPsia = ogutaScreen().design.lift.requiredPsia;
  return pressures.map((casingPressurePsia) => {
    const d = ogutaScreen({ casingPressurePsia }).design;
    return {
      casingPressurePsia,
      requiredPsia: d.lift.requiredPsia,
      gasPerCycleScf: d.gasPerCycleScf,
      requiredGlrScfBbl: d.requiredGlrScfBbl,
      pressureOk: d.pressureOk,
      glrOk: d.glrOk,
      feasible: d.feasible,
      // the mechanism, printed rather than described: the average of the two
      // ends is the whole of it, and it keeps falling through the crossing
      averageOfEndsPsia: (casingPressurePsia + requiredPsia) / 2,
      casingMinusRequirementPsi: casingPressurePsia - requiredPsia,
      expansionRunsTheRightWay: casingPressurePsia > requiredPsia,
    };
  });
};

/** The headline: the drop across the sweep, and the flag that flips the wrong way. */
export const ogutaCasingSweepHeadline = () => {
  const rows = ogutaCasingSweepRows();
  const hi = rows[0];
  const lo = rows[rows.length - 1];
  return {
    requiredPsiaFixed: ogutaScreen().design.lift.requiredPsia,
    wellGlrScfBbl: OGUTA.wellGlrScfBbl,
    highCasingPsia: hi.casingPressurePsia,
    lowCasingPsia: lo.casingPressurePsia,
    highRequiredGlrScfBbl: hi.requiredGlrScfBbl,
    lowRequiredGlrScfBbl: lo.requiredGlrScfBbl,
    dropScfBbl: hi.requiredGlrScfBbl - lo.requiredGlrScfBbl,
    dropPct: ((hi.requiredGlrScfBbl - lo.requiredGlrScfBbl) / hi.requiredGlrScfBbl) * 100,
    highGlrOk: hi.glrOk,
    lowGlrOk: lo.glrOk,
    highFeasible: hi.feasible,
    lowFeasible: lo.feasible,
    // feasible still catches both, because it is pressureOk AND glrOk
    feasibleStillCatchesBoth: hi.feasible === false && lo.feasible === false,
    firstFlippedRow: rows.find((r) => r.glrOk && !r.expansionRunsTheRightWay) || null,
  };
};

export const PUBLISHED_CASING_SWEEP_PSIA = Object.freeze([600, 480, 400, 300, 240, 200, 150]);

/**
 * The same shape on the PUBLISHED case, so this is not a teaching-well
 * artefact. The well gas-liquid ratio here is a DERIVED figure of 4500.0
 * scf/bbl chosen to straddle the requirement; everything else is the published
 * input set.
 */
export const PUBLISHED_SCREEN_WELL_GLR_SCF_BBL = 4500;
export const PUBLISHED_SCREEN_GAS_RATE_MSCFD = 700;

const publishedScreen = (patch = {}) => {
  const i = PUBLISHED_PLUNGER_INPUTS;
  return screenPlungerLift({
    depthFt: i.depthFt, idIn: i.idIn, linePressurePsia: i.linePressurePsia,
    casingPressurePsia: i.casingPressurePsia, slugLengthFt: i.slugLengthFt,
    liquidSg: i.liquidSg, plungerWeightLb: i.plungerWeightLb, gasSg: i.gasSg,
    avgTempR: i.avgTempR, z: i.z, wellGlrScfBbl: PUBLISHED_SCREEN_WELL_GLR_SCF_BBL,
    afterflowMin: 20, shutInMin: 35, ...patch,
  });
};

export const publishedCasingSweepRows = (pressures = PUBLISHED_CASING_SWEEP_PSIA) =>
  pressures.map((casingPressurePsia) => {
    const d = publishedScreen({ casingPressurePsia }).design;
    return {
      casingPressurePsia,
      requiredPsia: d.lift.requiredPsia,
      gasPerCycleScf: d.gasPerCycleScf,
      requiredGlrScfBbl: d.requiredGlrScfBbl,
      pressureOk: d.pressureOk,
      glrOk: d.glrOk,
      feasible: d.feasible,
    };
  });

// ------------------------------------------- the clamp at zero

export const OGUTA_CLAMP_CASINGS_PSIA = Object.freeze([
  4000, 900, 720, 600, 480, 400, 320, 285, 240, 180, 130, 90,
]);

const ogutaMaxSlug = (casingPressurePsia) => maxSlugLengthFt({
  casingPressurePsia,
  linePressurePsia: OGUTA.linePressurePsia,
  liquidSg: OGUTA.liquidSg,
  idIn: OGUTA.idIn,
  plungerWeightLb: OGUTA.plungerWeightLb,
  depthFt: OGUTA.depthFt,
  gasSg: OGUTA.gasSg,
  avgTempR: OGUTA.avgTempR,
  z: OGUTA.z,
});

/** The terms the clamp is built out of, so the unclamped solution is buildable. */
export const ogutaClampTerms = () => {
  const areaIn2 = tubingAreaIn2(OGUTA.idIn);
  const plungerPsi = OGUTA.plungerWeightLb / areaIn2;
  const rhoGasLbFt3 = gasDensityLbFt3({
    pPsia: OGUTA.linePressurePsia, tempR: OGUTA.avgTempR, z: OGUTA.z, gasSg: OGUTA.gasSg,
  });
  const gasPerFt = rhoGasLbFt3 / 144;
  return {
    areaIn2,
    plungerPsi,
    rhoGasLbFt3,
    gasPsiPerFt: gasPerFt,
    netPsiPerFtOfSlug: PSI_PER_FT_SG * OGUTA.liquidSg - gasPerFt,
  };
};

/**
 * `maxSlugLengthFt` solves the balance directly and then clamps the answer into
 * [0, depthFt]. BOTH ends of that clamp print a number that is not a solution.
 * The unclamped value is beside the returned one at every point.
 */
export const ogutaClampRows = (pressures = OGUTA_CLAMP_CASINGS_PSIA) => {
  const t = ogutaClampTerms();
  return pressures.map((casingPressurePsia) => {
    const availablePsi = casingPressurePsia - OGUTA.linePressurePsia - t.plungerPsi
      - 0 - t.gasPsiPerFt * OGUTA.depthFt;
    const unclampedFt = availablePsi / t.netPsiPerFtOfSlug;
    const returnedFt = ogutaMaxSlug(casingPressurePsia);
    return {
      casingPressurePsia,
      availablePsi,
      unclampedFt,
      returnedFt,
      clamped: Math.abs(returnedFt - unclampedFt) > 1e-9,
      clampedAtZero: returnedFt === 0,
      clampedAtDepth: returnedFt === OGUTA.depthFt,
    };
  });
};

/**
 * What zero actually MEANS. At the casing pressures where the function returns
 * zero, the balance with NO SLUG AT ALL still is not satisfied, so zero is not
 * the longest slug the well can lift. It is a refusal wearing a number.
 */
export const ogutaZeroClampReading = (pressures = [130, 90]) => {
  const bare = liftPressure({
    linePressurePsia: OGUTA.linePressurePsia, slugLengthFt: 0, liquidSg: OGUTA.liquidSg,
    idIn: OGUTA.idIn, plungerWeightLb: OGUTA.plungerWeightLb, depthFt: OGUTA.depthFt,
    gasSg: OGUTA.gasSg, avgTempR: OGUTA.avgTempR, z: OGUTA.z,
  });
  return pressures.map((casingPressurePsia) => ({
    casingPressurePsia,
    returnedFt: ogutaMaxSlug(casingPressurePsia),
    bareBalanceRequiredPsia: bare.requiredPsia,
    shortByPsi: bare.requiredPsia - casingPressurePsia,
  }));
};

/** The upper clamp has the same shape: a depth returned as though it were a computed maximum. */
export const ogutaUpperClamp = (casingPressurePsia = 4000) => {
  const returnedFt = ogutaMaxSlug(casingPressurePsia);
  return {
    casingPressurePsia,
    returnedFt,
    depthFt: OGUTA.depthFt,
    identical: returnedFt === OGUTA.depthFt,
  };
};

/** In the range where the clamp does not bite, the solve is exact. */
export const ogutaMaxSlugCheck = (casingPressurePsia = OGUTA.casingPressurePsia) => {
  const maxFt = ogutaMaxSlug(casingPressurePsia);
  const atMax = liftPressure({
    linePressurePsia: OGUTA.linePressurePsia, slugLengthFt: maxFt, liquidSg: OGUTA.liquidSg,
    idIn: OGUTA.idIn, plungerWeightLb: OGUTA.plungerWeightLb, depthFt: OGUTA.depthFt,
    gasSg: OGUTA.gasSg, avgTempR: OGUTA.avgTempR, z: OGUTA.z,
  });
  return {
    casingPressurePsia,
    maxSlugFt: maxFt,
    requiredAtMaxPsia: atMax.requiredPsia,
    residualPsi: atMax.requiredPsia - casingPressurePsia,
    slugVolumeBbl: slugVolumeBbl({ slugLengthFt: maxFt, idIn: OGUTA.idIn }),
  };
};

/** The one place in this function that REFUSES instead of clamping. */
export const ogutaClampRefusal = () => {
  const returned = maxSlugLengthFt({
    casingPressurePsia: 720, linePressurePsia: 145, liquidSg: 0.005, idIn: OGUTA.idIn,
    plungerWeightLb: OGUTA.plungerWeightLb, depthFt: OGUTA.depthFt,
    gasSg: OGUTA.gasSg, avgTempR: OGUTA.avgTempR, z: OGUTA.z,
  });
  return {
    label: 'a liquid so light the net cost of a foot of slug is not positive',
    returned,
    isNaN: Number.isNaN(returned),
  };
};

// ------------------------------------------- what nobody checks

/**
 * `liquidPerDayBbl` is computed and returned and NEVER compared to anything.
 * `feasible` is built from the pressure balance and the gas-liquid ratio only.
 * The third step is arithmetic the screen already has every ingredient for.
 */
export const ogutaCapacity = () => {
  const d = ogutaScreen().design;
  const wellLiquidBpd = (OGUTA.gasRateMscfd * 1000) / OGUTA.wellGlrScfBbl;
  return {
    liquidPerCycleBbl: d.liquidPerCycleBbl,
    cyclesPerDay: d.timing.cyclesPerDay,
    liquidPerDayBbl: d.liquidPerDayBbl,
    gasRateMscfd: OGUTA.gasRateMscfd,
    wellGlrScfBbl: OGUTA.wellGlrScfBbl,
    wellLiquidBpd,
    wellOverCycle: wellLiquidBpd / d.liquidPerDayBbl,
    shortfallBpd: wellLiquidBpd - d.liquidPerDayBbl,
    feasible: d.feasible,
    pressureOk: d.pressureOk,
    glrOk: d.glrOk,
    designKeys: Object.keys(d),
    liquidComparisonAppearsInVerdict: false,
  };
};

export const OGUTA_SHUT_IN_SWEEP_MIN = Object.freeze([40, 30, 20, 10, 5, 2, 0]);

/**
 * What it would take to carry the well. A contiguous shut-in sweep with no
 * afterflow, so the trips a day rise and the liquid carried rises with them,
 * and the gap closes or does not.
 */
export const ogutaShutInSweepRows = (values = OGUTA_SHUT_IN_SWEEP_MIN) => {
  const wellLiquidBpd = (OGUTA.gasRateMscfd * 1000) / OGUTA.wellGlrScfBbl;
  return values.map((shutInMin) => {
    const d = ogutaScreen({ shutInMin, afterflowMin: 0 }).design;
    return {
      shutInMin,
      afterflowMin: 0,
      totalMin: d.timing.totalMin,
      cyclesPerDay: d.timing.cyclesPerDay,
      liquidPerDayBbl: d.liquidPerDayBbl,
      wellLiquidBpd,
      ratio: wellLiquidBpd / d.liquidPerDayBbl,
      carriesTheWell: d.liquidPerDayBbl >= wellLiquidBpd,
    };
  });
};

/** The same reading on the PUBLISHED case, so a lesson can make the point without a teaching well. */
export const publishedCapacity = () => {
  const d = publishedScreen().design;
  const wellLiquidBpd = (PUBLISHED_SCREEN_GAS_RATE_MSCFD * 1000) / PUBLISHED_SCREEN_WELL_GLR_SCF_BBL;
  return {
    wellGlrScfBbl: PUBLISHED_SCREEN_WELL_GLR_SCF_BBL,
    gasRateMscfd: PUBLISHED_SCREEN_GAS_RATE_MSCFD,
    totalMin: d.timing.totalMin,
    cyclesPerDay: d.timing.cyclesPerDay,
    liquidPerDayBbl: d.liquidPerDayBbl,
    wellLiquidBpd,
    ratio: wellLiquidBpd / d.liquidPerDayBbl,
    pressureOk: d.pressureOk,
    glrOk: d.glrOk,
    feasible: d.feasible,
  };
};

/** The slow-cycle warning is the only timing check there is, and it fires on trips per day rather than on barrels. */
export const ogutaSlowCycle = (shutInMin = 1500) => {
  const d = ogutaScreen({ shutInMin }).design;
  const warning = d.warnings.find((wn) => wn.code === 'slowCycle');
  return {
    shutInMin,
    totalMin: d.timing.totalMin,
    cyclesPerDay: d.timing.cyclesPerDay,
    warningCodes: d.warnings.map((wn) => wn.code),
    message: warning ? warning.message : null,
  };
};

// ---------------------------------------------------------------------------
// SECTION 20. WHAT THESE MODULES REFUSE TO DO.
// Every module that introduces a capability has to state its limit, and every
// tier needs at least one of them.
// ---------------------------------------------------------------------------

export const refusals = () => Object.freeze([
  'The droplet balance models ONE droplet at its terminal velocity. It does not model a droplet population, coalescence, break-up in transit, or any film flowing on the tubing wall, which is the other way a gas well carries liquid.',
  'Interfacial tension and liquid density are INPUTS. Neither is a function of anything these modules know, and the Turner fluid properties are offered as labelled starting points rather than as correlations.',
  'The drag coefficient of 0.44 is a rigid sphere in the Newton regime. A real droplet deforms, and nothing here knows that.',
  'There is no inflow performance anywhere in these modules. The gas rate is an input, so a loading verdict is a verdict at a rate somebody supplied and not a prediction of what the well will do next.',
  'The flowing traverse is PASSED IN as a list of stations with their own pressure, temperature, z and diameter. loadingProfile does not solve multiphase flow and does not invent a gradient.',
  'An empty traverse is refused rather than treated as a passing well, and an unknown correlation is refused rather than silently treated as turner.',
  'recommendCorrelation takes ONE pressure and returns guidance, not a decision. It does not switch the correlation for anybody, and it cannot see which station the pressure came from.',
  'sizeTubingForRate has no opinion about which station its pressure, temperature and z came from. Its ok key says whether the question was answerable, not whether the station was the right one.',
  'The plunger lift force balance is STATIC. No friction unless it is handed in, no velocity, no gas slippage past the plunger, and no fallback of the slug during the rise.',
  'The rise and fall velocities, the afterflow and the shut-in are operating inputs with stated typical bands. They are not computed and they are not optimised.',
  'The 400 scf per bbl per 1000 ft screening rule is carried for comparison only and is never used to decide feasibility. Which of the two a well sits between is reported through ruleOfThumbAgrees.',
  'gasPerCycleScf does NOT check that the expansion runs the right way. This is a KNOWN DEFECT and a recorded owner decision, not a thing to design on.',
  'maxSlugLengthFt clamps rather than refuses at both ends.',
  'screenPlungerLift never compares liquidPerDayBbl to anything.',
  'The two production modules carry two molecular weights of air and two temperature conventions at the door.',
]);

// ---------------------------------------------------------------------------
// THE THREE PANEL VIEWS.
//
// A panel reads one of these and nothing else. Each is a frozen object of named
// modes, so the panel is a renderer: it chooses a mode and lays out rows.
// ---------------------------------------------------------------------------

/** Associate: gas at a station, the droplet balance, critical velocity and rate. */
export const dropletExplorer = Object.freeze({
  wellLabel: 'the published golden velocity table',
  constants: publishedConstants,
  goldenRows: goldenVelocityRows,
  engineRows: engineVelocityRows,
  station: stationBase,
  goldenRowStation,
  stationSweep: stationSweepRows,
  rates: STATION_RATES_MSCFD,
  tension: surfaceTensionRows,
  tensions: SURFACE_TENSIONS_DYNE_CM,
  density: liquidDensityRows,
  densities: LIQUID_DENSITIES_LB_FT3,
  drag: dragCoefficientRows,
  weber: criticalWeberRows,
  powerLaws: powerLawRows,
  fluids: turnerFluidRows,
  fluidPair,
  areas: tubingAreaRows,
  inverse: rateVelocityInverse,
  pairs: turnerColemanPairRows,
  adjustment: adjustmentIdentity,
  threshold: thresholdRows,
  thresholdLabels: thresholdLabelling,
  air: airSeam,
  dakZ: dakZRows,
  refusals: balanceRefusals,
});

/** Professional: the traverse, the sizing and the plunger screen. */
export const profileExplorer = Object.freeze({
  wellLabel: EBOCHA.name,
  definition: ebochaDefinition,
  traverse: ebochaTraverseRows,
  recommendation: ebochaWellheadRecommendation,
  shippedCorrelation: ebochaShippedCorrelation,
  profile: ebochaProfileRows,
  summary: ebochaProfileSummary,
  wellheadOnly: ebochaWellheadOnlyProfile,
  rateSweep: ebochaRateSweepRows,
  rates: EBOCHA_RATE_SWEEP_MSCFD,
  sizingRows: ebochaSizingRows,
  sizingVerdict: ebochaSizingVerdict,
  sizingStation: ebochaSizingStation,
  hopeless: ebochaHopelessSizing,
  sizingRefusals: ebochaSizingRefusals,
  candidates: EBOCHA_CANDIDATES_IN,
  plunger: publishedPlunger,
  plungerWell: ogutaDefinition,
  screen: ogutaScreenReading,
  screenRefusals: ogutaScreenRefusals,
  refusals: profileRefusals,
});

/** Expert: the seam, the discarded candidate, the constant, the requirement that falls. */
export const remedyExplorer = Object.freeze({
  wellLabel: `${EBOCHA.name} and ${OGUTA.name}`,
  seam: ebochaSeamRows,
  seamVerdicts: ebochaSeamVerdicts,
  perStation: ebochaStationRecommendationRows,
  mixedProfile: ebochaMixedProfileRows,
  mixedSummary: ebochaMixedProfileSummary,
  publishedSeam,
  threshold: thresholdRows,
  thresholdLabels: thresholdLabelling,
  sizingComparison: ebochaSizingComparison,
  sizingRows: ebochaSizingRows,
  stationCost: ebochaStationCost,
  gradient: gradientConstant,
  gradientSlugs: gradientSlugRows,
  liftTerms: liftTermProvenance,
  gasColumn: gasColumnConvention,
  casingSweep: ogutaCasingSweepRows,
  casingHeadline: ogutaCasingSweepHeadline,
  publishedCasingSweep: publishedCasingSweepRows,
  clampTerms: ogutaClampTerms,
  clamp: ogutaClampRows,
  clampZero: ogutaZeroClampReading,
  clampTop: ogutaUpperClamp,
  clampCheck: ogutaMaxSlugCheck,
  clampRefusal: ogutaClampRefusal,
  capacity: ogutaCapacity,
  shutInSweep: ogutaShutInSweepRows,
  publishedCapacity,
  slowCycle: ogutaSlowCycle,
  air: airSeam,
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
    ['goldenVelocityRows', goldenVelocityRows],
    ['engineVelocityRows', engineVelocityRows],
    ['turnerColemanPairRows', turnerColemanPairRows],
    ['adjustmentIdentity', adjustmentIdentity],
    ['airSeam', airSeam],
    ['dakZRows', dakZRows],
    ['suttonAt065', suttonAt065],
    ['powerLawRows', powerLawRows],
    ['dragCoefficientRows', dragCoefficientRows],
    ['criticalWeberRows', criticalWeberRows],
    ['surfaceTensionRows', surfaceTensionRows],
    ['liquidDensityRows', liquidDensityRows],
    ['turnerFluidRows', turnerFluidRows],
    ['unknownFluidFallback', unknownFluidFallback],
    ['fluidPair', fluidPair],
    ['balanceRefusals', balanceRefusals],
    ['tubingAreaRows', tubingAreaRows],
    ['areaDoubling', areaDoubling],
    ['rateVelocityInverse', rateVelocityInverse],
    ['rateRefusals', rateRefusals],
    ['stationBase', stationBase],
    ['stationSweepRows', stationSweepRows],
    ['goldenRowStation', () => golden.velocity.map((_, i) => goldenRowStation(i + 1))],
    ['thresholdRows', thresholdRows],
    ['thresholdLabelling', thresholdLabelling],
    ['ebochaDefinition', ebochaDefinition],
    ['ebochaTraverseRows', ebochaTraverseRows],
    ['ebochaWellheadRecommendation', ebochaWellheadRecommendation],
    ['ebochaRateSweepRows', ebochaRateSweepRows],
    ['ebochaWellheadOnlyProfile', ebochaWellheadOnlyProfile],
    ['ebochaMixedProfileRows', ebochaMixedProfileRows],
    ['ebochaMixedProfileSummary', ebochaMixedProfileSummary],
    ['profileRefusals', profileRefusals],
    ['ebochaSeamRows', ebochaSeamRows],
    ['ebochaSeamVerdicts', ebochaSeamVerdicts],
    ['ebochaStationRecommendationRows', ebochaStationRecommendationRows],
    ['publishedSeam', publishedSeam],
    ['ebochaSizingComparison', ebochaSizingComparison],
    ['ebochaHopelessSizing', ebochaHopelessSizing],
    ['ebochaSizingRefusals', ebochaSizingRefusals],
    ['ebochaStationCost', ebochaStationCost],
    ['publishedPlunger', publishedPlunger],
    ['gasColumnConvention', gasColumnConvention],
    ['publishedPlungerWithFriction', publishedPlungerWithFriction],
    ['gradientConstant', gradientConstant],
    ['gradientSlugRows', gradientSlugRows],
    ['liftTermProvenance', liftTermProvenance],
    ['ogutaDefinition', ogutaDefinition],
    ['ogutaScreenReading', ogutaScreenReading],
    ['ogutaScreenRefusals', ogutaScreenRefusals],
    ['ogutaCasingSweepRows', ogutaCasingSweepRows],
    ['ogutaCasingSweepHeadline', ogutaCasingSweepHeadline],
    ['publishedCasingSweepRows', publishedCasingSweepRows],
    ['ogutaClampTerms', ogutaClampTerms],
    ['ogutaClampRows', ogutaClampRows],
    ['ogutaZeroClampReading', ogutaZeroClampReading],
    ['ogutaUpperClamp', ogutaUpperClamp],
    ['ogutaMaxSlugCheck', ogutaMaxSlugCheck],
    ['ogutaClampRefusal', ogutaClampRefusal],
    ['ogutaCapacity', ogutaCapacity],
    ['ogutaShutInSweepRows', ogutaShutInSweepRows],
    ['publishedCapacity', publishedCapacity],
    ['ogutaSlowCycle', ogutaSlowCycle],
  ];
  CORRELATIONS.forEach((c) => {
    named.push([`ebochaProfileRows ${c}`, () => ebochaProfileRows(c)]);
    named.push([`ebochaProfileSummary ${c}`, () => ebochaProfileSummary(c)]);
    ['controlling', 'wellhead'].forEach((station) => {
      named.push([`ebochaSizingRows ${c} ${station}`, () => ebochaSizingRows(c, station)]);
      named.push([`ebochaSizingVerdict ${c} ${station}`, () => ebochaSizingVerdict(c, station)]);
      named.push([`ebochaSizingStation ${station}`, () => ebochaSizingStation(station)]);
    });
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
