// Teaching lab for PD3, ESP Design. The panels, the lessons and the vitest file
// all read this one module, so a number shown to a learner and a number a test
// pins cannot drift apart.
//
// Everything here is the vendored engine's own output. Every stage curve, every
// fit residual, every intake stream, every total dynamic head, every stack, every
// amp and every diagnosis below is a return value from a call into
// engines/production/espPump.js, espDesign.js or espMotorCable.js over
// data/espCatalog.js. Nothing in this file re-implements the engine. The only
// arithmetic done here is the arithmetic a PANEL would otherwise have to do on
// the engine's return values: a residual, a ratio, a share of a whole, a
// difference between two conventions. That arithmetic lives here on purpose, so
// that a panel is a renderer and never a calculator.
//
// UNITS. Field units throughout, as all three engine headers state: rate bbl/d
// IN SITU at pump conditions unless a name says stb/d, head ft, power hp and kW,
// pressure psia (never psig, never gauge), depth ft TVD, temperature degF,
// density lbm/ft3, gradient psi/ft, current A, voltage V, apparent power kVA,
// frequency Hz, conductor size in.
//
// PURITY. Every function here is pure and deterministic. There is no random
// number anywhere in this module and nothing is memoised, so two calls with the
// same arguments return the same numbers in the same order.
//
// THE CAPSTONE BOUNDARY, which is the thing to get right in this file.
//
// Everything above the CAPSTONE section is TEACHING material: the published
// goldens, the published catalogue, the published gate fixtures and three
// teaching cases designed for this wave and labelled as such on every row they
// appear on. It is free of capstone conditions, and `teachingDigestText()`
// renders exactly what the lesson writers read.
//
// Everything in the CAPSTONE section is OKARI-9, the graded well. It exists so
// that the grader and the lessons cannot read two different derivations, and it
// is for the grader, this file's own tests and the migration headers alone. Every
// export down there is named `CAP`, `OKARI_...`, `okari...`, `CAPSTONE_...`,
// `capstone...`, `LEAK_GUARD_...` or `leakGuard...`, and the guard in
// espLab.test.js greps the panel sources for exactly those names. A panel that
// wants what a capstone reader does has a teaching mirror of it:
//
//   okariTurndownLadder   ->  teachingTurndownRows / designTurndownRows
//   okariCableStudy       ->  teachingCableFlipStudy / twoPowerPickStudies
//   okariDiagnosis        ->  diagnosisFixture / diagnosisHeadRatioRows
//   okariGradientStudy    ->  gradientConventionRows
//   okariSeam             ->  loadFractionSeamRows
//   okariCase / okariCurve->  goldenDesign / teachingWellCase / VENDOR_CURVE

import golden from '@petrolord/engines/test-data/production/goldens/esp_cases.json';
import {
  HP_HEAD_DIVISOR, FT3_PER_BBL, SEC_PER_DAY, WATER_LBF_PER_FT3, FT_LBF_PER_S_PER_HP,
  hydraulicHp, brakeHp, polyFit, polyEval, fitStageCurve, referenceStageCurve, bepOf,
  stagePerformance, stackPerformance, viscosityCheck, applyViscosityFactors,
  VISCOSITY_CORRECTION_THRESHOLD_CST,
} from '@petrolord/engines/engines/production/espPump.js';
import {
  PSI_PER_FT_SG, gradientFromDensity, intakePressure, intakeStream, gasHandling,
  DEFAULT_GAS_LIMITS, totalDynamicHead, tdhBreakdown, stageCount, sizePump,
  diagnoseOperation, stackCurve,
} from '@petrolord/engines/engines/production/espDesign.js';
import {
  COPPER_ALPHA_PER_F, COPPER_REF_TEMP_F, conductorResistance, motorCurrent,
  cableVoltageDrop, cablePowerLossKw, surfaceRequirement, selectCable,
} from '@petrolord/engines/engines/production/espMotorCable.js';
import {
  REFERENCE_STAGES, CABLE_SIZES, MOTOR_FRAMES,
} from '@petrolord/engines/engines/production/data/espCatalog.js';

export {
  HP_HEAD_DIVISOR, FT3_PER_BBL, SEC_PER_DAY, WATER_LBF_PER_FT3, FT_LBF_PER_S_PER_HP,
  hydraulicHp, brakeHp, polyFit, polyEval, fitStageCurve, referenceStageCurve, bepOf,
  stagePerformance, stackPerformance, viscosityCheck, applyViscosityFactors,
  VISCOSITY_CORRECTION_THRESHOLD_CST,
  PSI_PER_FT_SG, gradientFromDensity, intakePressure, intakeStream, gasHandling,
  DEFAULT_GAS_LIMITS, totalDynamicHead, tdhBreakdown, stageCount, sizePump,
  diagnoseOperation, stackCurve,
  COPPER_ALPHA_PER_F, COPPER_REF_TEMP_F, conductorResistance, motorCurrent,
  cableVoltageDrop, cablePowerLossKw, surfaceRequirement, selectCable,
  REFERENCE_STAGES, CABLE_SIZES, MOTOR_FRAMES,
};

export const GOLDEN = golden;

// ---------------------------------------------------------------------------
// THE PUBLISHED THRESHOLDS AND THE CONVENTIONS THE COURSE IS COMPARED AGAINST.
//
// Every band a number in this course is judged against, read off the engine
// source rather than remembered, so no lesson and no panel has to guess where a
// limit came from.
// ---------------------------------------------------------------------------

/** The exact form of the water gradient, which gradientFromDensity uses. */
export const EXACT_PSI_PER_FT_SG = WATER_LBF_PER_FT3 / 144;

/** The familiar rounded pressure form divisor, hp = q dP / 58824. */
export const FAMILIAR_PRESSURE_DIVISOR = 58824;

/** The tallest published head point on the golden vendor curve, ft. */
export const VENDOR_TALLEST_HEAD_FT = Math.max(...golden.vendorCurve.points.map((p) => p.headFt));

/** fitStageCurve raises its transcription warning above this fraction of the tallest point. */
export const TRANSCRIPTION_WARNING_FRACTION = 0.02;

/** bepOf scans the efficiency fit across the published range in this many steps. */
export const BEP_SCAN_STEPS = 400;

/** referenceStageCurve generates this many points from its four parameters. */
export const REFERENCE_MODEL_POINTS = 9;

export const ESP_THRESHOLDS = Object.freeze({
  standardMaxGvf: DEFAULT_GAS_LIMITS.standardMax,
  handlerMaxGvf: DEFAULT_GAS_LIMITS.handlerMax,
  viscosityCorrectionCSt: VISCOSITY_CORRECTION_THRESHOLD_CST,
  downthrustBepFraction: 0.75,
  upthrustBepFraction: 1.25,
  transcriptionRmseFraction: TRANSCRIPTION_WARNING_FRACTION,
  underCurveRatio: 0.85,
  overCurveRatio: 1.15,
  ampsHighLoad: 1.05,
  ampsLowLoad: 0.40,
  motorOverloadedSelectionLoad: 1,
  motorUnderloadedSelectionLoad: 0.5,
  selectCableMaxDropPct: 5,
  weakCurrentEstimateBelowLoad: 0.5,
});

// ---------------------------------------------------------------------------
// THE PUBLISHED CATALOGUE.
// ---------------------------------------------------------------------------

export const catalogueStageRows = () => REFERENCE_STAGES.map((s) => ({
  id: s.id,
  label: s.label,
  housingOdIn: s.housingOdIn,
  bepBpd: s.bepBpd,
  bepHeadFt: s.bepHeadFt,
  shutoffRatio: s.shutoffRatio,
  bepEfficiency: s.bepEfficiency,
  qMin: s.qMin,
  qMax: s.qMax,
}));

export const catalogueCableRows = () => CABLE_SIZES.map((c) => ({
  awg: c.awg,
  label: c.label,
  ohmsPer1000FtAt77F: c.ohmsPer1000FtAt77F,
  // The ampacity column is deliberately absent from the shipped table. Section
  // 15's fails-open is this boolean and nothing else.
  ampacityDeclared: Object.prototype.hasOwnProperty.call(c, 'ampacityA'),
  ampacityA: c.ampacityA === undefined ? null : c.ampacityA,
}));

export const catalogueMotorRows = () => MOTOR_FRAMES.map((m) => ({
  id: m.id, hp: m.hp, volts: m.volts, amps: m.amps, seriesOdIn: m.seriesOdIn,
}));

// ---------------------------------------------------------------------------
// THE CURVES.
//
// TWO KINDS, AND THEY BEHAVE DIFFERENTLY. The VENDOR fit is a least squares
// cubic through five published points, so it does not pass through them and it
// carries a residual a lesson can quote. The REFERENCE model generates nine
// points from four named parameters with a quadratic shape and fits them with a
// quadratic, so it recovers itself to machine precision and its residual is
// nothing at all. A lesson that says "the cubic fit" means the vendor curve.
// ---------------------------------------------------------------------------

/** The published vendor stage curve: the cubic through the golden's five points. */
export const VENDOR_CURVE = fitStageCurve({ points: golden.vendorCurve.points });

export const REFERENCE_CURVE_IDS = ['ref-400-1000', 'ref-540-2500', 'ref-562-4000', 'ref-675-7000'];

/**
 * The spec a reference curve is generated from: the golden's own spec where the
 * golden publishes one, and the catalogue entry where it does not.
 */
export const referenceSpec = (id) => golden.referenceCurves.find((c) => c.id === id)?.spec
  || REFERENCE_STAGES.find((s) => s.id === id);

export const referenceCurve = (id) => referenceStageCurve(referenceSpec(id));

const REF_CURVES = Object.freeze(Object.fromEntries(
  REFERENCE_CURVE_IDS.map((id) => [id, referenceCurve(id)]),
));

/** Every curve this course teaches on, by the name the digest uses. */
export const curveById = (id) => (id === 'vendor' ? VENDOR_CURVE : REF_CURVES[id]);

/**
 * THE LAUNDERING CONVENTION, which is the one thing a caller of this package has
 * to get right and the subject of Professional m02.
 *
 * espDesign carries the same conversion twice: `gradientFromDensity` divides by
 * 144, which is exact, and `PSI_PER_FT_SG` is the rounded field 0.433. They are
 * 0.076982 percent apart. The convention the goldens are cut on, and the one
 * every consumer in the package uses, is to derive the specific gravity FROM the
 * design gradient, which makes PSI_PER_FT_SG times that gravity identically the
 * design gradient again and keeps the design chain and the diagnostics chain
 * exactly on one column.
 */
export const launderedSpecificGravity = (densityLbFt3) =>
  gradientFromDensity(densityLbFt3) / PSI_PER_FT_SG;

/** The specific gravity a learner reaches for instead, density over 62.4. */
export const trueSpecificGravity = (densityLbFt3) => densityLbFt3 / WATER_LBF_PER_FT3;

// A fixed iteration bisection, used only to LOCATE a boundary of an engine
// return (the rate where a fit reaches zero, the frequency where head goes). The
// iteration count is fixed so the answer is byte identical on every run.
const bisect = (lo, hi, predicate, iterations = 300) => {
  let a = lo;
  let b = hi;
  for (let i = 0; i < iterations; i += 1) {
    const m = 0.5 * (a + b);
    if (predicate(m)) a = m; else b = m;
  }
  return 0.5 * (a + b);
};

/** The drive frequency at which one stage's head reaches zero at a fixed duty rate. */
export const zeroHeadFrequencyHz = (curve, qBpd) => bisect(
  0.001, 200,
  (hz) => !(stagePerformance({ curve, qBpd, hz, specificGravity: 1 }).headFt > 0),
);

/** The reference rate at which a head fit reaches zero, past the end of the data. */
export const zeroHeadRateBpd = (curve) => bisect(
  curve.qMin, 200000, (q) => polyEval(curve.headFit, q) > 0,
);

// ===========================================================================
// ASSOCIATE TIER: THE STAGE.
//
// What the engine models and what it refuses, the three published curves that
// define a stage, the cubic fit and how good it is, the best efficiency point,
// reading head, efficiency and power at a duty rate, and what happens outside
// the data the fit was built on. Everything a stage explorer panel draws is
// here; the panel picks rows out of these and does no arithmetic of its own.
// ===========================================================================

/** The five points off the published vendor curve, as the golden publishes them. */
export const vendorPublishedPoints = () => golden.vendorCurve.points.map((p) => ({
  qBpd: p.qBpd, headFt: p.headFt, efficiencyPct: p.efficiencyPct,
}));

/**
 * The cubic through those five points, with the residual that makes it a fit
 * rather than an interpolation, and the threshold the transcription warning
 * fires on.
 */
export const vendorCurveFit = () => {
  const c = VENDOR_CURVE;
  return {
    qMin: c.qMin,
    qMax: c.qMax,
    refHz: c.refHz,
    curveSpecificGravity: c.curveSpecificGravity,
    headDegree: c.headFit.degree,
    headScale: c.headFit.scale,
    headCoeffs: [...c.headFit.coeffs],
    headRmse: c.headFit.rmse,
    goldenHeadRmse: golden.vendorCurve.headRmse,
    tallestHeadFt: VENDOR_TALLEST_HEAD_FT,
    rmseFractionOfTallest: c.headFit.rmse / VENDOR_TALLEST_HEAD_FT,
    transcriptionThresholdFt: TRANSCRIPTION_WARNING_FRACTION * VENDOR_TALLEST_HEAD_FT,
    warnings: [...c.warnings],
    warningCount: c.warnings.length,
    effDegree: c.effFit.degree,
    effCoeffs: [...c.effFit.coeffs],
    effRmse: c.effFit.rmse,
    bhpFitPresent: c.bhpFit !== null,
  };
};

/**
 * Four coefficients through five points, so the cubic misses every one of them.
 * By how much is the number a lesson on fit quality is looking for.
 */
export const vendorFitResidualRows = () => golden.vendorCurve.points.map((p) => {
  const fitHeadFt = polyEval(VENDOR_CURVE.headFit, p.qBpd);
  const fitEfficiency = polyEval(VENDOR_CURVE.effFit, p.qBpd);
  return {
    qBpd: p.qBpd,
    publishedHeadFt: p.headFt,
    fitHeadFt,
    headResidualFt: fitHeadFt - p.headFt,
    publishedEfficiency: p.efficiencyPct / 100,
    fitEfficiency,
    efficiencyResidual: fitEfficiency - p.efficiencyPct / 100,
  };
});

/**
 * The best efficiency point, and the spacing of the scan that found it. bepOf
 * takes 400 steps across the published range and returns the best sample, so the
 * rate it reports sits on that grid and is not a solved stationary point.
 */
export const vendorBep = () => ({
  qBpd: VENDOR_CURVE.bep.qBpd,
  headFt: VENDOR_CURVE.bep.headFt,
  efficiency: VENDOR_CURVE.bep.efficiency,
  goldenQBpd: golden.vendorCurve.bep.qBpd,
  goldenHeadFt: golden.vendorCurve.bep.headFt,
  goldenEfficiency: golden.vendorCurve.bep.efficiency,
  scanSpacingBpd: (VENDOR_CURVE.qMax - VENDOR_CURVE.qMin) / BEP_SCAN_STEPS,
  // The recommended duty band, the same two fractions of the best efficiency
  // rate that `referenceCurveSummary` already publishes for a reference stage
  // and that `stagePerformance` labels its `region` with.
  recommendedLowBpd: ESP_THRESHOLDS.downthrustBepFraction * VENDOR_CURVE.bep.qBpd,
  recommendedHighBpd: ESP_THRESHOLDS.upthrustBepFraction * VENDOR_CURVE.bep.qBpd,
});

export const VENDOR_DUTY_RATES = [1500, 1750, 2000, 2250, 2500, 2750, 3000, 3250, 3500];

/**
 * Head, efficiency and brake power per stage across the published range at 60 Hz
 * on two fluids, so a panel can show that gravity moves POWER and moves nothing
 * else.
 */
export const vendorDutyRows = (rates = VENDOR_DUTY_RATES) => rates.map((qBpd) => {
  const s1 = stagePerformance({ curve: VENDOR_CURVE, qBpd, hz: 60, specificGravity: 1.0 });
  const s9 = stagePerformance({ curve: VENDOR_CURVE, qBpd, hz: 60, specificGravity: 0.9 });
  return {
    qBpd,
    headFt: s1.headFt,
    efficiency: s1.efficiency,
    bhpPerStageSg100: s1.bhpPerStage,
    bhpPerStageSg090: s9.bhpPerStage,
    region: s1.region,
    inRange: s1.inRange,
  };
});

/**
 * A reference stage MODEL, its generating parameters and the fit of a quadratic
 * shape to itself. The residual is machine noise, which is not a good fit but a
 * fit of a shape to itself, and a lesson has to say so.
 */
export const referenceCurveSummary = (id) => {
  const spec = referenceSpec(id);
  const cv = REF_CURVES[id];
  const zeroHead = zeroHeadRateBpd(cv);
  return {
    id,
    label: cv.label,
    source: cv.source,
    bepBpd: spec.bepBpd,
    bepHeadFt: spec.bepHeadFt,
    shutoffRatio: spec.shutoffRatio,
    bepEfficiency: spec.bepEfficiency,
    qMin: cv.qMin,
    qMax: cv.qMax,
    pointSpacingBpd: (cv.qMax - cv.qMin) / (REFERENCE_MODEL_POINTS - 1),
    headDegree: cv.headFit.degree,
    headScale: cv.headFit.scale,
    headCoeffs: [...cv.headFit.coeffs],
    headRmse: cv.headFit.rmse,
    effRmse: cv.effFit.rmse,
    bepQBpd: cv.bep.qBpd,
    bepReadHeadFt: cv.bep.headFt,
    bepReadEfficiency: cv.bep.efficiency,
    // bepOf SCANS, so the rate it reports lands on the scan grid and not on the
    // rate the model was generated at. On a reference stage the generating rate
    // is known exactly, which is what makes the miss measurable at all.
    bepScanSpacingBpd: (cv.qMax - cv.qMin) / BEP_SCAN_STEPS,
    bepScanMissBpd: cv.bep.qBpd - spec.bepBpd,
    shutoffHeadFt: spec.bepHeadFt * spec.shutoffRatio,
    recommendedLowBpd: ESP_THRESHOLDS.downthrustBepFraction * cv.bep.qBpd,
    recommendedHighBpd: ESP_THRESHOLDS.upthrustBepFraction * cv.bep.qBpd,
    zeroHeadRateBpd: zeroHead,
    zeroHeadPastDataBpd: zeroHead - cv.qMax,
  };
};

/** The reference curve values the golden itself records, for the case for case pin. */
export const goldenReferenceCurveRows = () => golden.referenceCurves.map((rc) => ({
  id: rc.id,
  bepQBpd: rc.bep.qBpd,
  bepHeadFt: rc.bep.headFt,
  bepEfficiency: rc.bep.efficiency,
  headAtBepFt: rc.headAtBep,
  samples: rc.samples.map((s) => ({ qBpd: s.qBpd, headFt: s.headFt })),
}));

export const REFERENCE_DUTY_RATES = Object.freeze({
  'ref-540-2500': [1250, 1600, 1950, 2300, 2500, 2650, 3000, 3350, 3500],
  'ref-675-7000': [4000, 4800, 5600, 6400, 7000, 7200, 8000, 8800, 9800],
});

export const referenceDutyRows = (id, rates = REFERENCE_DUTY_RATES[id]) => rates.map((qBpd) => {
  const s = stagePerformance({ curve: REF_CURVES[id], qBpd, hz: 60, specificGravity: 1.0 });
  return {
    id, qBpd, headFt: s.headFt, efficiency: s.efficiency, bhpPerStage: s.bhpPerStage, region: s.region,
  };
});

// --------------------------------------------------------------- the affinity laws

/**
 * The twelve published affinity rows, engine against golden. The laws are exact
 * for a fixed impeller: rate with speed, head with speed squared, power with
 * speed cubed, efficiency unmoved. The engine maps the duty rate BACK to the
 * reference speed, reads the curve there, and maps forward again.
 */
export const goldenAffinityRows = () => golden.affinity.map((row) => {
  const s = stagePerformance({
    curve: VENDOR_CURVE, qBpd: row.qBpd, hz: row.hz, specificGravity: row.sg,
  });
  return {
    hz: row.hz,
    qBpd: row.qBpd,
    sg: row.sg,
    ratio: s.ratio,
    qRefBpd: s.qRefBpd,
    headFt: s.headFt,
    efficiency: s.efficiency,
    bhpPerStage: s.bhpPerStage,
    inRange: s.inRange,
    region: s.region,
    goldenHeadFt: row.headFt,
    goldenBhpPerStage: row.bhpPerStage,
    goldenEfficiency: row.efficiency,
    goldenQRefBpd: row.qRefBpd,
  };
});

/** The largest relative deviation between the engine and the golden across all twelve rows. */
export const affinityMaxDeviation = () => {
  let worst = 0;
  goldenAffinityRows().forEach((r) => {
    [['headFt', 'goldenHeadFt'], ['efficiency', 'goldenEfficiency'],
      ['bhpPerStage', 'goldenBhpPerStage'], ['qRefBpd', 'goldenQRefBpd']].forEach(([a, b]) => {
      const d = Math.abs(r[a] - r[b]) / Math.max(Math.abs(r[b]), 1e-12);
      if (d > worst) worst = d;
    });
  });
  return worst;
};

export const SPEED_SWEEP_HZ = [30, 35, 40, 45, 50, 55, 60, 65, 70];
export const SPEED_SWEEP_QBPD = 2500;
export const SPEED_SWEEP_SG = 0.9;

/**
 * One DUTY RATE held fixed while the speed changes. The head multiple column
 * does not equal the speed ratio squared, and that is not a bug in the affinity
 * laws: holding the duty fixed moves the reading to a different place on the
 * reference curve, so the square law and the curve shape act at once.
 */
export const speedSweepRows = (
  qBpd = SPEED_SWEEP_QBPD, hzList = SPEED_SWEEP_HZ, specificGravity = SPEED_SWEEP_SG,
) => {
  const base = stagePerformance({ curve: VENDOR_CURVE, qBpd, hz: 60, specificGravity });
  return hzList.map((hz) => {
    const s = stagePerformance({ curve: VENDOR_CURVE, qBpd, hz, specificGravity });
    return {
      hz,
      qBpd,
      qRefBpd: s.qRefBpd,
      headFt: s.headFt,
      efficiency: s.efficiency,
      bhpPerStage: s.bhpPerStage,
      headMultipleOf60Hz: s.headFt / base.headFt,
      speedRatioSquared: (hz / 60) ** 2,
      speedRatioCubed: (hz / 60) ** 3,
      inRange: s.inRange,
      region: s.region,
    };
  });
};

// --------------------------------------------------------------- the edge of the fit

/**
 * The golden's own extrapolated row. 3200 bbl/d at 40 Hz maps back to 4800 bbl/d
 * on the 60 Hz curve, 1300 bbl/d past the end of the published data, and the
 * engine returns a number rather than a refusal. `inRange: false` is a flag on
 * the answer, not a refusal, and the Associate tier owns that.
 */
export const goldenExtrapolatedRow = () => {
  const s = stagePerformance({ curve: VENDOR_CURVE, qBpd: 3200, hz: 40, specificGravity: 0.9 });
  const at60 = stagePerformance({ curve: VENDOR_CURVE, qBpd: 3200, hz: 60, specificGravity: 0.9 });
  return {
    qBpd: 3200,
    hz: 40,
    qRefBpd: s.qRefBpd,
    qMin: VENDOR_CURVE.qMin,
    qMax: VENDOR_CURVE.qMax,
    pastDataBpd: s.qRefBpd - VENDOR_CURVE.qMax,
    headFt: s.headFt,
    bhpPerStage: s.bhpPerStage,
    efficiency: s.efficiency,
    inRange: s.inRange,
    region: s.region,
    headFractionOfSameRateAt60Hz: s.headFt / at60.headFt,
  };
};

export const VENDOR_EXTRAPOLATION_RATES = [
  3000, 3200, 3400, 3500, 3600, 3800, 4000, 4200, 4400, 4600, 4800, 4806, 4900, 5100, 5500,
];

/**
 * Nothing snaps at the edge of the data. Read the head column down: it falls, it
 * flattens, it crosses zero, and no row differs IN KIND from the row above it.
 * The only thing that changes at the end of the published range is a boolean.
 */
export const vendorExtrapolationRows = (rates = VENDOR_EXTRAPOLATION_RATES) => rates.map((qBpd) => {
  const s = stagePerformance({ curve: VENDOR_CURVE, qBpd, hz: 60, specificGravity: 0.9 });
  return {
    qBpd,
    headFt: s.headFt,
    efficiency: s.efficiency,
    bhpPerStage: s.bhpPerStage,
    pastDataBpd: qBpd - VENDOR_CURVE.qMax,
    inRange: s.inRange,
    region: s.region,
  };
});

export const REFERENCE_EXTRAPOLATION_RATES = [3000, 3200, 3500, 3800, 4100, 4400, 4700, 4910, 5200, 5600];

/** The same sweep on a QUADRATIC head fit, so the behaviour is shown to belong to
 *  extrapolation and not to the cubic in particular. */
export const referenceExtrapolationRows = (
  id = 'ref-540-2500', rates = REFERENCE_EXTRAPOLATION_RATES,
) => rates.map((qBpd) => {
  const s = stagePerformance({ curve: REF_CURVES[id], qBpd, hz: 60, specificGravity: 0.9 });
  return {
    id, qBpd, headFt: s.headFt, efficiency: s.efficiency, bhpPerStage: s.bhpPerStage,
    inRange: s.inRange, region: s.region,
  };
});

export const EFFICIENCY_TAIL_RATES = [3500, 3700, 3900, 4100, 4300, 4500, 4800, 5100, 5500];

/**
 * The efficiency fit runs out too, and LATER than the head fit on both of these
 * curves, so the brake power per stage goes negative because the hydraulic power
 * did and not because the efficiency did.
 */
export const efficiencyTailRows = (rates = EFFICIENCY_TAIL_RATES) => rates.map((qBpd) => ({
  qBpd,
  vendorEfficiency: polyEval(VENDOR_CURVE.effFit, qBpd),
  referenceEfficiency: polyEval(REF_CURVES['ref-540-2500'].effFit, qBpd),
}));

/** Where each fit finally runs out, and how far apart the two exits are. */
export const fitExhaustion = () => {
  let vendorZeroEff = null;
  for (let q = VENDOR_CURVE.qMax; q < 12000; q += 0.01) {
    if (polyEval(VENDOR_CURVE.effFit, q) <= 0) { vendorZeroEff = q; break; }
  }
  const c540 = REF_CURVES['ref-540-2500'];
  const vendorZeroHead = zeroHeadRateBpd(VENDOR_CURVE);
  const referenceZeroHead = zeroHeadRateBpd(c540);
  // The reference model's efficiency shape is eta = eta_bep (2x - x^2) with
  // x = q / q_bep, so it returns to zero at exactly twice the BEP rate. That is
  // the generating shape read back, not a search.
  const referenceZeroEff = 2 * referenceSpec('ref-540-2500').bepBpd;
  return {
    vendorZeroHeadBpd: vendorZeroHead,
    vendorZeroHeadPastDataBpd: vendorZeroHead - VENDOR_CURVE.qMax,
    vendorZeroEfficiencyBpd: vendorZeroEff,
    vendorEfficiencyOutlivesHeadBpd: vendorZeroEff - vendorZeroHead,
    referenceZeroHeadBpd: referenceZeroHead,
    referenceZeroHeadPastDataBpd: referenceZeroHead - c540.qMax,
    referenceZeroEfficiencyBpd: referenceZeroEff,
    referenceEfficiencyOutlivesHeadBpd: referenceZeroEff - referenceZeroHead,
  };
};

// --------------------------------------------------------------- the transcription curve

export const BRASS_LABEL = 'BRASS-11';

/**
 * TEACHING CURVE BRASS-11, not a published case. The golden's vendor points as
 * transcribed by somebody who made a mistake, in two versions, so a panel can
 * watch the residual and the transcription warning do the job they exist for.
 * The mild error is the interesting one: the curve still looks like a pump
 * curve and the fit still answers at every rate.
 */
export const BRASS_VARIANTS = Object.freeze([
  { id: 'as published', mutate: (p) => p },
  {
    id: 'mild transcription error, 28.0 typed as 26.0 at 2500 bbl/d',
    mutate: (p) => (p.qBpd === 2500 ? { ...p, headFt: 26.0 } : p),
  },
  {
    id: 'decimal slip, 30.5 typed as 3.05 at 2000 bbl/d',
    mutate: (p) => (p.qBpd === 2000 ? { ...p, headFt: 3.05 } : p),
  },
]);

export const brassTranscriptionRows = () => BRASS_VARIANTS.map((v) => {
  const points = golden.vendorCurve.points.map(v.mutate);
  const cv = fitStageCurve({ points });
  // The quality check is the ROOT MEAN SQUARE and nothing else, so the per point
  // misses are the only place a single bad point is still visible. They are put
  // here rather than left to a panel because a panel that subtracts two numbers
  // is a calculator.
  const perPoint = points.map((p, i) => {
    const fitHeadFt = polyEval(cv.headFit, p.qBpd);
    return {
      qBpd: p.qBpd,
      publishedHeadFt: golden.vendorCurve.points[i].headFt,
      typedHeadFt: p.headFt,
      typedLessPublishedFt: p.headFt - golden.vendorCurve.points[i].headFt,
      fitHeadFt,
      residualFt: fitHeadFt - p.headFt,
    };
  });
  const worst = perPoint.reduce((a, b) => (Math.abs(b.residualFt) > Math.abs(a.residualFt) ? b : a));
  return {
    variant: v.id,
    headRmse: cv.headFit.rmse,
    transcriptionThresholdFt: TRANSCRIPTION_WARNING_FRACTION * Math.max(...points.map((p) => p.headFt)),
    warnings: [...cv.warnings],
    warningCount: cv.warnings.length,
    headAt2500Ft: polyEval(cv.headFit, 2500),
    bepQBpd: cv.bep.qBpd,
    bepHeadFt: cv.bep.headFt,
    points: perPoint,
    worstResidualQBpd: worst.qBpd,
    worstResidualFt: worst.residualFt,
    // How far the single worst miss is diluted by taking the root mean square of
    // five of them. On the mild variant this is the whole finding.
    worstResidualOverRmse: Math.abs(worst.residualFt) / cv.headFit.rmse,
  };
});

// --------------------------------------------------------------- viscosity

export const VISCOSITY_CASES = [[2, 55], [8, 58], [20, 58], [60, 58], [150, 60]];

/** What the engine will NOT guess at. It reports the in situ viscosity, flags when
 *  the Hydraulic Institute correction is required, and applies factors only when
 *  the user supplies them. */
export const viscosityCheckRows = (cases = VISCOSITY_CASES) => cases.map(([viscosityCp, densityLbFt3]) => {
  const v = viscosityCheck({ viscosityCp, densityLbFt3 });
  return {
    viscosityCp,
    densityLbFt3,
    specificGravity: densityLbFt3 / WATER_LBF_PER_FT3,
    viscosityCSt: v.viscosityCSt,
    correctionRequired: v.correctionRequired,
    factorsApplied: v.factorsApplied,
    note: v.note,
  };
});

export const VISCOSITY_FACTORS = Object.freeze({ cq: 0.9, ch: 0.85, ceta: 0.7 });

export const viscosityFactorRow = (factors = VISCOSITY_FACTORS) => {
  const stage = stagePerformance({
    curve: REF_CURVES['ref-540-2500'], qBpd: 2500, hz: 60, specificGravity: 0.95,
  });
  const corr = applyViscosityFactors(stage, factors);
  return {
    uncorrectedHeadFt: stage.headFt,
    uncorrectedEfficiency: stage.efficiency,
    headFactor: factors.ch,
    efficiencyFactor: factors.ceta,
    rateFactor: factors.cq,
    correctedHeadFt: corr.headFt,
    correctedEfficiency: corr.efficiency,
    correctedRateBpd: corr.qCorrectedBpd,
    unchangedWithNoFactors: applyViscosityFactors(stage, null) === stage,
  };
};

// ===========================================================================
// PROFESSIONAL TIER: THE FLUID AND THE LIFT.
//
// What the pump actually sees at its intake, intake pressure, free gas and gas
// volume fraction, mixture density, the gradient and the two conversions the
// module carries for it, rate at depth, total dynamic head and its three parts,
// and sizing a stack out of integer stages. Everything a lift explorer panel
// draws is here.
// ===========================================================================

export const GOLDEN_DESIGN_IDS = ['gassyOffshore', 'highWaterCut'];

export const goldenDesignRecord = (id) => golden.designs.find((d) => d.id === id);

/**
 * The whole design chain for one set of conditions, in the order espDesign's own
 * header walks it: intake pressure, then the black oil PVT at those conditions,
 * then what a separator takes out, then the gradient of what is left, then the
 * head that implies, then the stack that makes it.
 *
 * Every field is an engine return. The only derived quantity is `sg`, the
 * laundered specific gravity, and it is derived by the convention the module
 * header states and the goldens are cut on.
 */
export const buildCase = (inp) => {
  const curve = curveById(inp.curve);
  const pIntakePsia = intakePressure({
    pwfPsia: inp.pwfPsia,
    perfTvdFt: inp.perfTvdFt,
    pumpTvdFt: inp.pumpTvdFt,
    annulusGradPsiPerFt: inp.annulusGradPsiPerFt,
  });
  const stream = intakeStream({
    qoStbd: inp.qoStbd, wct: inp.wct, gorScfStb: inp.gorScfStb, pvt: inp.pvt,
  });
  const gas = gasHandling({ stream, separatorEfficiency: inp.separatorEfficiency });
  const gradientPsiPerFt = gradientFromDensity(gas.mixtureDensityLbFt3);
  const sg = launderedSpecificGravity(gas.mixtureDensityLbFt3);
  const tdh = totalDynamicHead({
    pIntakePsia, pDischargePsia: inp.pDischargePsia, gradientPsiPerFt,
  });
  const sized = sizePump({
    curve,
    qBpd: gas.pumpIntakeBpd,
    tdhFt: tdh.tdhFt,
    hz: inp.hz,
    specificGravity: sg,
    nameplateHp: inp.nameplateHp,
    thrustDeratePct: inp.thrustDeratePct,
  });
  return {
    id: inp.id, tag: inp.tag, kind: inp.kind, inp, curve,
    pIntakePsia, stream, gas, gradientPsiPerFt, sg, tdh, sized,
  };
};

export const goldenDesign = (id) => buildCase({
  ...goldenDesignRecord(id).inputs,
  id,
  tag: `golden design ${id}`,
  kind: 'golden design',
});

/**
 * TEACHING WELL QUA-IBOE-4, not a published case.
 *
 * Both published designs come back `standard`, so a lesson on the two gas
 * thresholds needs a well that trips the middle one. This one is built to land
 * between them, and its motor is deliberately undersized, so the SELECTION load
 * fraction crosses one while the ELECTRICAL load fraction does not: the module
 * seam, on a well a lesson may print in full.
 */
export const QUA_IBOE_4 = Object.freeze({
  id: 'QUA-IBOE-4',
  tag: 'teaching well QUA-IBOE-4',
  kind: 'teaching well',
  curve: 'ref-540-2500',
  hz: 60,
  qoStbd: 1400,
  wct: 0.35,
  gorScfStb: 700,
  pvt: { rs: 250, bo: 1.25, bw: 1.03, bg: 0.0014, rhoO: 47, rhoW: 63.5, rhoG: 5.5 },
  pwfPsia: 1600,
  perfTvdFt: 8200,
  pumpTvdFt: 7600,
  annulusGradPsiPerFt: 0.28,
  pDischargePsia: 2680,
  separatorEfficiency: 0.45,
  nameplateHp: 100,
  nameplateVolts: 1300,
  nameplateAmps: 49,
  thrustDeratePct: 12,
  cableLengthFt: 7600,
  cableTempF: 200,
  powerFactor: 0.86,
  whpPsia: 220,
});

/**
 * TEACHING WELL IBENO-2, not a published case.
 *
 * A short shallow stack. The rounding margin on a stack of a few dozen stages is
 * worth percent, where on a stack of two hundred it is worth tenths of a percent.
 * It exists so a lesson can show that the margin is bounded by ONE STAGE and
 * never by a percentage.
 */
export const IBENO_2 = Object.freeze({
  id: 'IBENO-2',
  tag: 'teaching well IBENO-2',
  kind: 'teaching well',
  curve: 'ref-562-4000',
  hz: 60,
  qoStbd: 1200,
  wct: 0.7,
  gorScfStb: 120,
  pvt: { rs: 120, bo: 1.08, bw: 1.01, bg: 0.0015, rhoO: 52, rhoW: 64.5, rhoG: 5 },
  pwfPsia: 900,
  perfTvdFt: 2400,
  pumpTvdFt: 2100,
  annulusGradPsiPerFt: 0.35,
  pDischargePsia: 1100,
  separatorEfficiency: 0,
  nameplateHp: 60,
  nameplateVolts: 1000,
  nameplateAmps: 38,
  thrustDeratePct: 10,
  cableLengthFt: 2100,
  cableTempF: 140,
  powerFactor: 0.85,
  whpPsia: 180,
});

export const TEACHING_WELLS = Object.freeze([QUA_IBOE_4, IBENO_2]);

export const teachingWellCase = (W) => buildCase(W);

/** The two published designs and the two teaching wells, in the order the course walks them. */
export const allCases = () => [
  ...GOLDEN_DESIGN_IDS.map(goldenDesign),
  ...TEACHING_WELLS.map(teachingWellCase),
];

// --------------------------------------------------------------- the intake side

/** What the pump actually SEES, every step of it, on one case. */
export const intakeReading = (c) => {
  const { inp, stream, gas } = c;
  return {
    tag: c.tag,
    pwfPsia: inp.pwfPsia,
    perfTvdFt: inp.perfTvdFt,
    pumpTvdFt: inp.pumpTvdFt,
    annulusColumnFt: inp.perfTvdFt - inp.pumpTvdFt,
    annulusGradPsiPerFt: inp.annulusGradPsiPerFt,
    annulusColumnPsi: inp.annulusGradPsiPerFt * (inp.perfTvdFt - inp.pumpTvdFt),
    pIntakePsia: c.pIntakePsia,
    qoStbd: inp.qoStbd,
    wct: inp.wct,
    gorScfStb: inp.gorScfStb,
    rs: inp.pvt.rs,
    bo: inp.pvt.bo,
    bw: inp.pvt.bw,
    bg: inp.pvt.bg,
    rhoO: inp.pvt.rhoO,
    rhoW: inp.pvt.rhoW,
    rhoG: inp.pvt.rhoG,
    qwStbd: stream.qwStbd,
    qoResBpd: stream.qoResBpd,
    qwResBpd: stream.qwResBpd,
    liquidResBpd: stream.liquidResBpd,
    freeGasScfd: stream.freeGasScfd,
    freeGasResBpd: stream.freeGasResBpd,
    totalResBpd: stream.totalResBpd,
    streamGvf: stream.gvf,
    liquidDensityLbFt3: stream.liquidDensityLbFt3,
    gasDensityLbFt3: stream.gasDensityLbFt3,
    streamMixtureDensityLbFt3: stream.mixtureDensityLbFt3,
    separatorEfficiency: gas.separatorEfficiency,
    ventedResBpd: gas.ventedResBpd,
    throughPumpGasResBpd: gas.throughPumpGasResBpd,
    pumpIntakeBpd: gas.pumpIntakeBpd,
    gvfThroughPump: gas.gvfThroughPump,
    pumpMixtureDensityLbFt3: gas.mixtureDensityLbFt3,
    verdict: gas.verdict,
    gradientPsiPerFt: c.gradientPsiPerFt,
    launderedSg: c.sg,
    formationVolumeMultiple: stream.liquidResBpd / (inp.qoStbd + stream.qwStbd),
  };
};

/** The intake values the golden itself records, for the case for case pin. */
export const goldenIntakeRecorded = (id) => {
  const d = goldenDesignRecord(id);
  return {
    id,
    intakePressurePsia: d.intakePressurePsia,
    streamGvf: d.stream.gvf,
    pumpMixtureDensityLbFt3: d.gas.mixtureDensityLbFt3,
    pumpIntakeBpd: d.gas.pumpIntakeBpd,
    gradientPsiPerFt: d.gradientPsiPerFt,
  };
};

/**
 * What the separator does to the DENSITY. Taking gas out leaves the pump
 * swallowing something HEAVIER than the whole stream was, so the gradient the
 * head conversion uses is not the stream gradient.
 */
export const separatorDensityRows = () => GOLDEN_DESIGN_IDS.map((id) => {
  const c = goldenDesign(id);
  return {
    id,
    tag: c.tag,
    streamMixtureDensityLbFt3: c.stream.mixtureDensityLbFt3,
    pumpMixtureDensityLbFt3: c.gas.mixtureDensityLbFt3,
    densityGainLbFt3: c.gas.mixtureDensityLbFt3 - c.stream.mixtureDensityLbFt3,
    gradientGainPsiPerFt: gradientFromDensity(c.gas.mixtureDensityLbFt3)
      - gradientFromDensity(c.stream.mixtureDensityLbFt3),
  };
});

// --------------------------------------------------------------- the gas verdict

export const SEPARATOR_EFFICIENCY_SWEEP = [0, 0.1, 0.2, 0.3, 0.4, 0.45, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];

/**
 * The verdict crossing both published thresholds on one well. Nothing about the
 * verdict is a correlation: the separator efficiency is a user or vendor number,
 * the two limits are inputs, no gas handling performance is modelled at all, and
 * the verdict names a class of equipment and stops.
 */
export const gasVerdictSweepRows = (c, effs = SEPARATOR_EFFICIENCY_SWEEP) => effs.map((separatorEfficiency) => {
  const g = gasHandling({ stream: c.stream, separatorEfficiency });
  return {
    separatorEfficiency,
    throughPumpGasResBpd: g.throughPumpGasResBpd,
    pumpIntakeBpd: g.pumpIntakeBpd,
    gvfThroughPump: g.gvfThroughPump,
    mixtureDensityLbFt3: g.mixtureDensityLbFt3,
    verdict: g.verdict,
  };
});

// --------------------------------------------------------------- the two gradients

/** The two forms of one conversion, side by side, with what they are worth. */
export const gradientConversionSummary = () => ({
  exactPsiPerFtSg: EXACT_PSI_PER_FT_SG,
  roundedPsiPerFtSg: PSI_PER_FT_SG,
  differencePsiPerFtSg: EXACT_PSI_PER_FT_SG - PSI_PER_FT_SG,
  differencePct: (100 * (EXACT_PSI_PER_FT_SG - PSI_PER_FT_SG)) / PSI_PER_FT_SG,
});

/**
 * What that disagreement is worth in feet of head, on every case in this course,
 * and what the convention costs when it is followed instead.
 *
 * The gap is a FIXED PERCENTAGE of whatever head it sits on, so a figure in feet
 * divides back to the head that produced it. That is why these figures are given
 * on the published designs and the teaching wells and nowhere else.
 */
export const gradientConventionRows = (cases = allCases()) => cases.map((c) => {
  const trueSg = trueSpecificGravity(c.gas.mixtureDensityLbFt3);
  const naiveGradient = PSI_PER_FT_SG * trueSg;
  const naiveTdhFt = c.tdh.dpPsi / naiveGradient;
  return {
    id: c.id,
    tag: c.tag,
    trueSg,
    launderedSg: c.gradientPsiPerFt / PSI_PER_FT_SG,
    designGradientPsiPerFt: c.gradientPsiPerFt,
    diagnosticsGradientOnTrueSgPsiPerFt: naiveGradient,
    headOnDesignGradientFt: c.tdh.tdhFt,
    headOnTrueSgFt: naiveTdhFt,
    gapFt: naiveTdhFt - c.tdh.tdhFt,
    gapPct: (100 * (naiveTdhFt - c.tdh.tdhFt)) / c.tdh.tdhFt,
    gapOnLaunderedSgFt: c.tdh.dpPsi / (PSI_PER_FT_SG * (c.gradientPsiPerFt / PSI_PER_FT_SG)) - c.tdh.tdhFt,
  };
});

// --------------------------------------------------------------- total dynamic head

/**
 * The wellhead pressure each case's three part reading is taken at. It is the
 * ONLY teaching input in the decomposition: everything else follows from the two
 * pressures, the gradient and the pump depth.
 */
export const TDH_TEACHING_WHP_PSIA = Object.freeze({
  gassyOffshore: 400, highWaterCut: 30, 'QUA-IBOE-4': 220, 'IBENO-2': 180,
});

/**
 * Total dynamic head and its three parts. TDH is the pressure the pump has to
 * ADD, converted to feet of the fluid it is pumping. It is NOT the friction plus
 * the wellhead: the net vertical lift is most of it, and leaving it out
 * understates the stage count by roughly an order of magnitude.
 */
export const tdhDecomposition = (c, whpPsia = TDH_TEACHING_WHP_PSIA[c.id]) => {
  const grad = c.gradientPsiPerFt;
  const fluidAboveIntakeFt = c.pIntakePsia / grad;
  const netLiftFt = c.inp.pumpTvdFt - fluidAboveIntakeFt;
  const whpHeadFt = whpPsia / grad;
  const frictionFt = c.tdh.tdhFt - netLiftFt - whpHeadFt;
  const bd = tdhBreakdown({ netLiftFt, frictionFt, whpHeadFt });
  return {
    id: c.id,
    tag: c.tag,
    pDischargePsia: c.inp.pDischargePsia,
    pIntakePsia: c.pIntakePsia,
    dpPsi: c.tdh.dpPsi,
    gradientPsiPerFt: grad,
    tdhFt: c.tdh.tdhFt,
    whpPsia,
    fluidAboveIntakeFt,
    dynamicFluidLevelFt: netLiftFt,
    netLiftFt: bd.netLiftFt,
    frictionFt: bd.frictionFt,
    whpHeadFt: bd.whpHeadFt,
    summedTdhFt: bd.tdhFt,
    summedLessPressureTdhFt: bd.tdhFt - c.tdh.tdhFt,
    netLiftSharePct: (100 * bd.netLiftFt) / c.tdh.tdhFt,
    frictionSharePct: (100 * bd.frictionFt) / c.tdh.tdhFt,
    whpSharePct: (100 * bd.whpHeadFt) / c.tdh.tdhFt,
    frictionPsi: bd.frictionFt * grad,
    identityPsi: c.inp.pDischargePsia - grad * c.inp.pumpTvdFt - whpPsia,
  };
};

// --------------------------------------------------------------- sizing the stack

/**
 * The stack, and the margin that integers buy. `stageCount` rounds UP always, so
 * the head the stack MAKES exceeds the head the duty REQUIRES by somewhere
 * between nothing and one whole stage, and the two brake powers that follow
 * differ by exactly that ratio.
 */
export const stackSizing = (c) => {
  const { sized, tdh, gas, inp } = c;
  const stagesExact = tdh.tdhFt / sized.stage.headFt;
  return {
    id: c.id,
    tag: c.tag,
    pumpIntakeBpd: gas.pumpIntakeBpd,
    tdhFt: tdh.tdhFt,
    hz: inp.hz,
    sg: c.sg,
    qRefBpd: sized.stage.qRefBpd,
    headPerStageFt: sized.stage.headFt,
    efficiency: sized.stage.efficiency,
    bhpPerStage: sized.stage.bhpPerStage,
    inRange: sized.stage.inRange,
    region: sized.stage.region,
    stagesExact,
    stages: sized.stages,
    stageRoundedAway: sized.stages - stagesExact,
    headMadeFt: sized.headMadeFt,
    headMarginFt: sized.headMarginFt,
    headMarginPct: (100 * sized.headMarginFt) / tdh.tdhFt,
    headMarginStages: sized.headMarginFt / sized.stage.headFt,
    hydraulicHp: sized.hydraulicHp,
    shaftHp: sized.shaftHp,
    stackBhpTotal: sized.stack.bhpTotal,
    twoPowerGapHp: sized.stack.bhpTotal - sized.shaftHp,
    twoPowerGapPct: (100 * (sized.stack.bhpTotal - sized.shaftHp)) / sized.shaftHp,
    powerRatio: sized.stack.bhpTotal / sized.shaftHp,
    headRatio: sized.headMadeFt / tdh.tdhFt,
    // brake power is linear in head at a fixed rate and efficiency, so the ratio
    // of the two powers IS the ratio of the two heads, to machine precision
    identity: sized.stack.bhpTotal / sized.shaftHp - sized.headMadeFt / tdh.tdhFt,
    deratePct: sized.motorLoad ? 100 * (1 - sized.motorLoad.derate) : null,
    selectionLoadFraction: sized.motorLoad ? sized.motorLoad.loadFraction : null,
    warnings: sized.warnings.map((w) => ({ code: w.code, message: w.message })),
    warningCount: sized.warnings.length,
  };
};

/** The sizing values the golden itself records, for the case for case pin. */
export const goldenSizingRecorded = (id) => {
  const d = goldenDesignRecord(id);
  return {
    id,
    stages: d.sized.stages,
    headMadeFt: d.sized.headMadeFt,
    shaftHp: d.sized.shaftHp,
    hydraulicHp: d.sized.hydraulicHp,
    headPerStageFt: d.sized.stage.headFt,
    efficiency: d.sized.stage.efficiency,
    bhpPerStage: d.sized.stage.bhpPerStage,
    loadFraction: d.sized.loadFraction,
    tdhFt: d.tdhFt,
  };
};

export const REQUIREMENT_SWEEP_FT = [
  550, 600, 650, 680, 700, 720, 725, 740, 750, 770, 790, 810, 830, 850, 900,
];

/**
 * THE MARGIN IS BOUNDED BY ONE STAGE, NOT BY A PERCENTAGE. The requirement swept
 * on the short teaching well, so the stage count can be watched stepping and the
 * identity checked at each step.
 */
export const requirementSweepRows = (W = IBENO_2, requirements = REQUIREMENT_SWEEP_FT) => {
  const c = teachingWellCase(W);
  return requirements.map((tdhFt) => {
    const sz = sizePump({
      curve: c.curve,
      qBpd: c.gas.pumpIntakeBpd,
      tdhFt,
      hz: W.hz,
      specificGravity: c.sg,
      nameplateHp: W.nameplateHp,
      thrustDeratePct: W.thrustDeratePct,
    });
    return {
      id: W.id,
      tdhFt,
      stagesExact: tdhFt / sz.stage.headFt,
      stages: sz.stages,
      headMadeFt: sz.headMadeFt,
      headMarginFt: sz.headMarginFt,
      headMarginPct: (100 * sz.headMarginFt) / tdhFt,
      headMarginStages: sz.headMarginFt / sz.stage.headFt,
      identity: sz.stack.bhpTotal / sz.shaftHp - sz.headMadeFt / tdhFt,
    };
  });
};

/**
 * What choosing the smaller of the two powers is worth, on every case.
 *
 * READ THE DENOMINATOR. `headMarginPct` and `twoPowerGapPct` in `stackSizing`
 * divide the gap by the SMALLER quantity; `understatementPct` here divides it by
 * the LARGER. They are the same gap, not two findings.
 */
export const twoPowerCostRows = (cases = allCases()) => cases.map((c) => ({
  id: c.id,
  tag: c.tag,
  electricalChainBuiltOnHp: c.sized.shaftHp,
  publishedMethodTakesHp: c.sized.stack.bhpTotal,
  understatementHp: c.sized.stack.bhpTotal - c.sized.shaftHp,
  understatementPct: (100 * (c.sized.stack.bhpTotal - c.sized.shaftHp)) / c.sized.stack.bhpTotal,
}));

/**
 * WHAT AN UNBOUNDED FIT COSTS A WHOLE DESIGN. This belongs to the Associate
 * tier's second result and it is placed here only because it needs the design
 * bundles above.
 *
 * One stage reading outside the data is a small wrong number. The same reading
 * carried through a stage count is a large one, because the stage count DIVIDES
 * by it. This is the TEACHING mirror of the capstone's turndown ladder: same
 * shape, published conditions, printable in full.
 */
export const TURNDOWN_LADDER_HZ = [55, 50, 46, 44, 42, 40];

export const designTurndownRows = (id) => {
  const c = goldenDesign(id);
  const designHz = c.inp.hz;
  const base = stagePerformance({
    curve: c.curve, qBpd: c.gas.pumpIntakeBpd, hz: designHz, specificGravity: c.sg,
  });
  const atDesign = sizePump({
    curve: c.curve, qBpd: c.gas.pumpIntakeBpd, tdhFt: c.tdh.tdhFt, hz: designHz, specificGravity: c.sg,
  });
  const rungs = [designHz, ...TURNDOWN_LADDER_HZ]
    .filter((h, i, a) => a.indexOf(h) === i && h <= designHz);
  return rungs.map((hz) => {
    const sz = sizePump({
      curve: c.curve,
      qBpd: c.gas.pumpIntakeBpd,
      tdhFt: c.tdh.tdhFt,
      hz,
      specificGravity: c.sg,
      nameplateHp: c.inp.nameplateHp,
    });
    return {
      id,
      hz,
      qRefBpd: sz.stage.qRefBpd,
      pastDataBpd: sz.stage.qRefBpd - c.curve.qMax,
      headPerStageFt: sz.stage.headFt,
      headShrinkFactor: base.headFt / sz.stage.headFt,
      stages: sz.stages,
      stagesMultipleOfDesign: sz.stages / atDesign.stages,
      inRange: sz.stage.inRange,
      region: sz.stage.region,
      warningCount: sz.warnings.length,
      warningCodes: sz.warnings.map((w) => w.code),
    };
  });
};

/** The frequency at which this design's head per stage reaches zero at its own duty. */
export const designZeroHeadFrequency = (id) => {
  const c = goldenDesign(id);
  const hz = zeroHeadFrequencyHz(c.curve, c.gas.pumpIntakeBpd);
  return { id, zeroHeadHz: hz, belowDesignHz: c.inp.hz - hz };
};

/**
 * The finding as the wave recorded it, conditions withheld. The engine finding
 * behind the course's second result was measured on a design the teaching
 * material does not carry, so only the headline sizes are quotable.
 */
export const RECORDED_FINDING_40HZ = Object.freeze({
  stagesReturned: 926,
  headPerStageFt: 3.9802,
  stagesMultipleOfDesign: 5.58,
  warningsRaised: 3,
  refusals: 0,
  headTurnsNegativeHz: 36.1016,
  hzBelowWhereAnswersStopMeaningAnything: 6.5,
});

// ===========================================================================
// EXPERT TIER: THE ELECTRICAL SYSTEM AND THE DIAGNOSIS.
//
// Shaft horsepower and the two powers the sizing returns, the motor's nameplate
// and its derate, load fraction and where the derate stops, amps, voltage drop,
// cable selection, the surface numbers, and diagnosing a running pump.
// Everything a power explorer panel draws is here.
// ===========================================================================

/**
 * The published electrical cases, end to end. A submersible motor nameplate is
 * power, volts and amps at full load, so current at part load is the nameplate
 * current scaled by the load fraction. No efficiency curve and no power factor
 * curve is invented: below about half load the estimate is FLAGGED rather than
 * extrapolated to zero.
 */
export const goldenElectricalRows = () => golden.electrical.map((e, i) => {
  const inp = e.inputs;
  const r = surfaceRequirement({
    shaftHp: inp.shaftHp,
    nameplateHp: inp.nameplateHp,
    nameplateAmps: inp.nameplateAmps,
    nameplateVolts: inp.nameplateVolts,
    powerFactor: inp.powerFactor,
    lengthFt: inp.lengthFt,
    ohmsPer1000FtAt77F: inp.ohmsPer1000FtAt77F,
    cableTempF: inp.cableTempF,
  });
  return {
    caseNumber: i + 1,
    shaftHp: inp.shaftHp,
    nameplateHp: inp.nameplateHp,
    nameplateVolts: inp.nameplateVolts,
    nameplateAmps: inp.nameplateAmps,
    lengthFt: inp.lengthFt,
    cableTempF: inp.cableTempF,
    ohmsPer1000FtAt77F: inp.ohmsPer1000FtAt77F,
    powerFactor: inp.powerFactor,
    loadFraction: r.loadFraction,
    amps: r.amps,
    estimateWeakBelowHalfLoad: r.estimateWeakBelowHalfLoad,
    resistanceOhmsPer1000Ft: r.resistanceOhmsPer1000Ft,
    dropV: r.dropV,
    dropPct: r.dropPct,
    surfaceVolts: r.surfaceVolts,
    kva: r.kva,
    kw: r.kw,
    lossKw: r.lossKw,
    lossSharePct: (100 * r.lossKw) / r.kw,
    goldenAmps: e.amps,
    goldenDropV: e.dropV,
    goldenDropPct: e.dropPct,
    goldenSurfaceVolts: e.surfaceVolts,
    goldenKva: e.kva,
    goldenKw: e.kw,
    goldenLossKw: e.lossKw,
    goldenLoadFraction: e.loadFraction,
    goldenResistanceOhmsPer1000Ft: e.resistanceOhmsPer1000Ft,
  };
});

export const electricalMaxDeviation = () => {
  let worst = 0;
  goldenElectricalRows().forEach((r) => {
    [['amps', 'goldenAmps'], ['dropV', 'goldenDropV'], ['dropPct', 'goldenDropPct'],
      ['surfaceVolts', 'goldenSurfaceVolts'], ['kva', 'goldenKva'], ['kw', 'goldenKw'],
      ['lossKw', 'goldenLossKw'], ['loadFraction', 'goldenLoadFraction'],
      ['resistanceOhmsPer1000Ft', 'goldenResistanceOhmsPer1000Ft']].forEach(([a, b]) => {
      const d = Math.abs(r[a] - r[b]) / Math.max(Math.abs(r[b]), 1e-12);
      if (d > worst) worst = d;
    });
  });
  return worst;
};

/** The three-phase constant. Power factor enters the kVA and does NOT enter the resistive drop. */
export const ROOT_THREE = Math.sqrt(3);

export const COPPER_TEMP_SWEEP_F = [77, 100, 140, 180, 200, 220, 250];
export const TWO_AWG_OHMS_PER_1000FT_AT_77F = 0.1593;

export const copperResistanceRows = (
  temps = COPPER_TEMP_SWEEP_F, ohmsPer1000FtAt77F = TWO_AWG_OHMS_PER_1000FT_AT_77F,
) => temps.map((tempF) => {
  const r = conductorResistance({ ohmsPer1000FtAt77F, tempF });
  return { tempF, ohmsPer1000Ft: r, multipleOf77F: r / ohmsPer1000FtAt77F };
});

// --------------------------------------------------------------- the module seam

export const DERATE_SWEEP_PCT = [0, 5, 8, 10, 12, 15, 20];

/**
 * THE SEAM. Two fields called `loadFraction`, in one domain, answering different
 * questions.
 *
 *   espDesign.sizePump      UTILISATION against the motor's USABLE rating, that
 *                           is shaft power over nameplate power times the
 *                           derate. The published selection rule.
 *   espMotorCable.motorCurrent  the ELECTRICAL load fraction, shaft power over
 *                           the PLATE, no derate, because the current a machine
 *                           draws at a shaft load does not move when its
 *                           permissible load is cut.
 *
 * BOTH ARE ARITHMETICALLY RIGHT FOR WHAT THEY MEAN. The trap is the shared name,
 * and the amps, the cable pick and the weak estimate flag are all built on the
 * underated one.
 */
export const loadFractionSeamRows = (cases = allCases(), pcts = DERATE_SWEEP_PCT) => cases.map((c) => {
  const nameplateHp = c.inp.nameplateHp;
  const electrical = c.sized.shaftHp / nameplateHp;
  return {
    id: c.id,
    tag: c.tag,
    nameplateHp,
    shaftHp: c.sized.shaftHp,
    electricalLoadFraction: electrical,
    derates: pcts.map((pct) => {
      const sz = sizePump({
        curve: c.curve,
        qBpd: c.gas.pumpIntakeBpd,
        tdhFt: c.tdh.tdhFt,
        hz: c.inp.hz,
        specificGravity: c.sg,
        nameplateHp,
        thrustDeratePct: pct || undefined,
      });
      return {
        deratePct: pct,
        derate: sz.motorLoad.derate,
        selectionLoadFraction: sz.motorLoad.loadFraction,
        gapPoints: 100 * (sz.motorLoad.loadFraction - electrical),
        warningCodes: sz.warnings.map((w) => w.code),
      };
    }),
    inputKw: c.sized.motorLoad.inputKw,
  };
});

/**
 * The size of the seam as the finding recorded it: the gap is the electrical load
 * fraction times one over the derate less one, evaluated at the finding's own
 * load fraction and derate.
 */
export const SEAM_FINDING = Object.freeze({
  electricalLoadFraction: 0.89714,
  derate: 0.88,
  gapPoints: 0.89714 * (1 / 0.88 - 1) * 100,
});

// --------------------------------------------------------------- the cable

/**
 * A cable pick, every candidate shown. `selectCable` sorts smallest conductor
 * first and takes the cheapest that passes BOTH checks, the voltage drop limit
 * and the ampacity. On the shipped table the second check is TRUE BY
 * CONSTRUCTION, because a candidate with no `ampacityA` passes it and the shipped
 * CABLE_SIZES carry no ampacity column at all. The honest statement is that the
 * check does not currently check anything, not that the cable is wrong.
 */
export const cablePick = (args) => {
  const pick = selectCable(args);
  return {
    candidates: pick.candidates.map((c) => ({
      label: c.cable.label,
      awg: c.cable.awg,
      ohmsPer1000FtAt77F: c.cable.ohmsPer1000FtAt77F,
      amps: c.requirement.amps,
      dropV: c.requirement.dropV,
      dropPct: c.requirement.dropPct,
      dropOk: c.dropOk,
      ampacityOk: c.ampacityOk,
      ampacityDeclared: c.cable.ampacityA === undefined ? null : c.cable.ampacityA,
      ok: c.ok,
    })),
    chosenLabel: pick.cable ? pick.cable.label : null,
    maxDropPct: pick.maxDropPct,
    dropPct: pick.requirement ? pick.requirement.dropPct : null,
    surfaceVolts: pick.requirement ? pick.requirement.surfaceVolts : null,
    kva: pick.requirement ? pick.requirement.kva : null,
    lossKw: pick.requirement ? pick.requirement.lossKw : null,
    everyCandidatePassedAmpacity: pick.candidates.every((c) => c.ampacityOk),
    acceptableEqualsDropOnEveryCandidate: pick.candidates.every((c) => c.ok === c.dropOk),
  };
};

export const goldenCablePickArgs = (i) => {
  const inp = golden.electrical[i].inputs;
  return {
    cables: CABLE_SIZES,
    maxDropPct: ESP_THRESHOLDS.selectCableMaxDropPct,
    shaftHp: inp.shaftHp,
    nameplateHp: inp.nameplateHp,
    nameplateAmps: inp.nameplateAmps,
    nameplateVolts: inp.nameplateVolts,
    powerFactor: inp.powerFactor,
    lengthFt: inp.lengthFt,
    cableTempF: inp.cableTempF,
  };
};

/** The manufacturer ampacity column the published gate supplies to make the check bite. */
export const GATE_AMPACITIES_A = [105, 140, 190, 220, 255];

/**
 * The published gate fixtures around the fails-open. 192 hp of shaft on a 200 hp,
 * 200 A, 4160 V motor is 192 A down the hole, and on the shipped table
 * selectCable takes 6 AWG at a current no 6 AWG is rated for. Supply the
 * ampacity column and the pick moves three sizes. The arithmetic did not change:
 * the DATA did.
 */
export const ampacityGateFixtures = () => ({
  onShippedTable: cablePick({
    cables: CABLE_SIZES,
    maxDropPct: ESP_THRESHOLDS.selectCableMaxDropPct,
    shaftHp: 192,
    nameplateHp: 200,
    nameplateAmps: 200,
    nameplateVolts: 4160,
    lengthFt: 1000,
    cableTempF: 150,
  }),
  withAmpacityColumn: cablePick({
    cables: CABLE_SIZES.map((c, i) => ({ ...c, ampacityA: GATE_AMPACITIES_A[i] })),
    maxDropPct: ESP_THRESHOLDS.selectCableMaxDropPct,
    shaftHp: 192,
    nameplateHp: 200,
    nameplateAmps: 200,
    nameplateVolts: 4160,
    lengthFt: 1000,
    cableTempF: 150,
  }),
  nothingQualifies: cablePick({
    cables: CABLE_SIZES.map((c) => ({ ...c, ampacityA: 10 })),
    maxDropPct: 1,
    shaftHp: 200,
    nameplateHp: 250,
    nameplateAmps: 67,
    nameplateVolts: 1000,
    lengthFt: 12000,
    cableTempF: 220,
  }),
});

export const wellCablePickArgs = (W) => {
  const c = teachingWellCase(W);
  return {
    cables: CABLE_SIZES,
    maxDropPct: ESP_THRESHOLDS.selectCableMaxDropPct,
    shaftHp: c.sized.shaftHp,
    nameplateHp: W.nameplateHp,
    nameplateAmps: W.nameplateAmps,
    nameplateVolts: W.nameplateVolts,
    powerFactor: W.powerFactor,
    lengthFt: W.cableLengthFt,
    cableTempF: W.cableTempF,
  };
};

/** The full electrical chain on a teaching well, on every conductor in the table. */
export const surfaceAcrossCablesRows = (W) => {
  const c = teachingWellCase(W);
  return CABLE_SIZES.map((cb) => {
    const r = surfaceRequirement({
      shaftHp: c.sized.shaftHp,
      nameplateHp: W.nameplateHp,
      nameplateAmps: W.nameplateAmps,
      nameplateVolts: W.nameplateVolts,
      powerFactor: W.powerFactor,
      lengthFt: W.cableLengthFt,
      ohmsPer1000FtAt77F: cb.ohmsPer1000FtAt77F,
      cableTempF: W.cableTempF,
    });
    return {
      id: W.id,
      cableLabel: cb.label,
      amps: r.amps,
      dropV: r.dropV,
      dropPct: r.dropPct,
      surfaceVolts: r.surfaceVolts,
      kva: r.kva,
      kw: r.kw,
      lossKw: r.lossKw,
    };
  });
};

/**
 * THE PICK, MADE TWICE, ON THE TWO POWERS.
 *
 * Everything electrical in this package is built on `shaftHp`, brake power at the
 * head REQUIRED. The published motor sizing method takes `stack.bhpTotal`, brake
 * power at the head the stack MAKES. Here `selectCable` runs twice on one case,
 * identical in every argument except which of the two horsepowers it is handed.
 *
 * A pick moves only when the winning candidate's drop sits between the limit
 * divided by the power ratio and the limit itself. That window is the rounding
 * margin wide, so the short stack is where the flip lives.
 */
export const twoPowerPick = (label, base, sized) => {
  const onShaft = cablePick({ ...base, shaftHp: sized.shaftHp });
  const onStack = cablePick({ ...base, shaftHp: sized.stack.bhpTotal });
  return {
    label,
    nameplateHp: base.nameplateHp,
    nameplateVolts: base.nameplateVolts,
    nameplateAmps: base.nameplateAmps,
    lengthFt: base.lengthFt,
    cableTempF: base.cableTempF,
    shaftHp: sized.shaftHp,
    stackBhpTotal: sized.stack.bhpTotal,
    onShaft,
    onStack,
    chosenOnShaft: onShaft.chosenLabel,
    chosenOnStack: onStack.chosenLabel,
    decidingDropOnShaftPct: onShaft.dropPct,
    decidingDropOnStackPct: onStack.dropPct,
    maxDropPct: onShaft.maxDropPct,
    pickMoved: onShaft.chosenLabel !== onStack.chosenLabel,
  };
};

/**
 * The teaching cable strings the two published designs are given for that
 * comparison. The goldens carry no cable string, so the motor is the catalogue
 * frame or the published gate fixture motor whose nameplate power equals the
 * design's own, and the length and the temperature are chosen for the
 * demonstration. They are not published values.
 */
export const TEACHING_CABLE_STRINGS = Object.freeze({
  gassyOffshore: {
    nameplateHp: 250, nameplateAmps: 67, nameplateVolts: 2400, powerFactor: 0.85,
    lengthFt: 7000, cableTempF: 180,
  },
  highWaterCut: {
    nameplateHp: 200, nameplateAmps: 200, nameplateVolts: 4160, powerFactor: 0.88,
    lengthFt: 5800, cableTempF: 180,
  },
});

/** The teaching cable string that puts IBENO-2's 6 AWG drop inside the flip window. */
export const IBENO_FLIP_CABLE_LENGTH_FT = 3300;

const cableBase = (extra) => ({
  cables: CABLE_SIZES, maxDropPct: ESP_THRESHOLDS.selectCableMaxDropPct, ...extra,
});

export const twoPowerPickStudies = () => {
  const qua = teachingWellCase(QUA_IBOE_4);
  const ibe = teachingWellCase(IBENO_2);
  const wellString = (W) => ({
    nameplateHp: W.nameplateHp,
    nameplateAmps: W.nameplateAmps,
    nameplateVolts: W.nameplateVolts,
    powerFactor: W.powerFactor,
    lengthFt: W.cableLengthFt,
    cableTempF: W.cableTempF,
  });
  return [
    twoPowerPick(
      'published design gassyOffshore, teaching cable string',
      cableBase(TEACHING_CABLE_STRINGS.gassyOffshore), goldenDesign('gassyOffshore').sized,
    ),
    twoPowerPick(
      'published design highWaterCut, teaching cable string',
      cableBase(TEACHING_CABLE_STRINGS.highWaterCut), goldenDesign('highWaterCut').sized,
    ),
    twoPowerPick(
      'teaching well QUA-IBOE-4, its own cable string',
      cableBase(wellString(QUA_IBOE_4)), qua.sized,
    ),
    twoPowerPick(
      'teaching well IBENO-2, its own cable string',
      cableBase(wellString(IBENO_2)), ibe.sized,
    ),
    twoPowerPick(
      `teaching well IBENO-2, teaching cable string of ${IBENO_FLIP_CABLE_LENGTH_FT} ft`,
      cableBase({ ...wellString(IBENO_2), lengthFt: IBENO_FLIP_CABLE_LENGTH_FT }), ibe.sized,
    ),
  ];
};

/**
 * THE TEACHING MIRROR of the capstone's cable sensitivity study: the one case in
 * this course where reading one number two defensible ways brings a different
 * conductor out of the same table under the same limit.
 */
export const teachingCableFlipStudy = () => twoPowerPickStudies().filter((s) => s.pickMoved);

// --------------------------------------------------------------- the diagnosis

/** The published gate fixture the diagnosis is taught on. */
export const DIAGNOSIS_FIXTURE = Object.freeze({
  curveId: 'ref-540-2500', stages: 200, specificGravity: 0.95, qBpd: 2500, hz: 60, nameplateAmps: 60,
});

const dgCurve = () => REF_CURVES[DIAGNOSIS_FIXTURE.curveId];

const dgExpected = () => stackPerformance({
  curve: dgCurve(),
  stages: DIAGNOSIS_FIXTURE.stages,
  qBpd: DIAGNOSIS_FIXTURE.qBpd,
  hz: DIAGNOSIS_FIXTURE.hz,
  specificGravity: DIAGNOSIS_FIXTURE.specificGravity,
});

/**
 * What the stack SHOULD be doing. `diagnoseOperation` reads the same curve
 * backwards, comparing the head the stack should make against what it IS making.
 * It does not guess WHY: wear, free gas through the stages and a wrong stage
 * count all look identical from here, and the flag says so.
 */
export const diagnosisFixture = () => {
  const e = dgExpected();
  return {
    stages: DIAGNOSIS_FIXTURE.stages,
    specificGravity: DIAGNOSIS_FIXTURE.specificGravity,
    qBpd: DIAGNOSIS_FIXTURE.qBpd,
    hz: DIAGNOSIS_FIXTURE.hz,
    headPerStageFt: e.headFt / DIAGNOSIS_FIXTURE.stages,
    headStackShouldMakeFt: e.headFt,
    efficiency: e.efficiency,
    bhpTotal: e.bhpTotal,
    region: e.region,
    diagnosticsGradientPsiPerFt: PSI_PER_FT_SG * DIAGNOSIS_FIXTURE.specificGravity,
  };
};

const diagnoseAtRatio = (ratio) => diagnoseOperation({
  curve: dgCurve(),
  stages: DIAGNOSIS_FIXTURE.stages,
  hz: DIAGNOSIS_FIXTURE.hz,
  specificGravity: DIAGNOSIS_FIXTURE.specificGravity,
  measured: { qBpd: DIAGNOSIS_FIXTURE.qBpd, headFt: ratio * dgExpected().headFt },
});

const diagnoseAtAmpsLoad = (load) => diagnoseOperation({
  curve: dgCurve(),
  stages: DIAGNOSIS_FIXTURE.stages,
  hz: DIAGNOSIS_FIXTURE.hz,
  specificGravity: DIAGNOSIS_FIXTURE.specificGravity,
  nameplateAmps: DIAGNOSIS_FIXTURE.nameplateAmps,
  measured: {
    qBpd: DIAGNOSIS_FIXTURE.qBpd,
    headFt: dgExpected().headFt,
    amps: load * DIAGNOSIS_FIXTURE.nameplateAmps,
  },
});

export const DIAGNOSIS_HEAD_RATIOS = [
  1.20, 1.16, 1.15, 1.10, 1.00, 0.95, 0.90, 0.87, 0.8600, 0.8520, 0.8500, 0.8499,
  0.8480, 0.8465, 0.8455, 0.8450, 0.8400, 0.80, 0.70, 0.55,
];

/** The head ratio swept from healthy down through both bands into a clear failure. */
export const diagnosisHeadRatioRows = (ratios = DIAGNOSIS_HEAD_RATIOS) => ratios.map((ratio) => {
  const d = diagnoseAtRatio(ratio);
  return {
    ratio,
    actualHeadFt: d.actualHeadFt,
    expectedHeadFt: d.expectedHeadFt,
    headRatio: d.headRatio,
    printedPct: d.headRatio * 100,
    wouldHavePrintedPct: (d.headRatio * 100).toFixed(0),
    flagCodes: d.flags.map((f) => f.code),
    messages: d.flags.map((f) => f.message),
  };
});

export const UNDER_CURVE_BAND_RATIOS = [
  0.8450, 0.8455, 0.8461, 0.8470, 0.8475, 0.8480, 0.8490, 0.8495, 0.8499,
];

/**
 * THE BOUNDARY BAND THAT WAS THE DEFECT, and the one fix this wave was allowed
 * to make. `underCurve` fires on a STRICT inequality below 0.85 and then prints
 * the ratio it fired on. Rounded to whole percent, everything in the first tenth
 * of a percent below the threshold rendered AS the threshold: a real warning that
 * reads like a false alarm and invites a user to dismiss it.
 */
export const underCurveBandRows = (ratios = UNDER_CURVE_BAND_RATIOS) => ratios.map((ratio) => {
  const d = diagnoseAtRatio(ratio);
  const p = d.headRatio * 100;
  return {
    ratio,
    flagRaised: d.flags.some((f) => f.code === 'underCurve'),
    printsNowPct: p.toFixed(1),
    printedBeforeFixPct: p.toFixed(0),
    oldPrintEqualledThreshold: p.toFixed(0) === '85',
  };
});

export const AMPS_HIGH_BAND_LOADS = [1.0500, 1.0505, 1.0510, 1.0520, 1.0530, 1.0540, 1.0550, 1.0600];

export const ampsHighBandRows = (loads = AMPS_HIGH_BAND_LOADS) => loads.map((load) => {
  const d = diagnoseAtAmpsLoad(load);
  const p = load * 100;
  return {
    load,
    amps: load * DIAGNOSIS_FIXTURE.nameplateAmps,
    ampsLoad: d.ampsLoad,
    flagRaised: d.flags.some((f) => f.code === 'ampsHigh'),
    printsNowPct: p.toFixed(1),
    printedBeforeFixPct: p.toFixed(0),
    oldPrintEqualledThreshold: p.toFixed(0) === '105',
    messages: d.flags.filter((f) => f.code === 'ampsHigh').map((f) => f.message),
  };
});

export const AMPS_LOW_BAND_LOADS = [0.3900, 0.3950, 0.3960, 0.3970, 0.3980, 0.3990, 0.3999, 0.4000, 0.4200];

export const ampsLowBandRows = (loads = AMPS_LOW_BAND_LOADS) => loads.map((load) => {
  const d = diagnoseAtAmpsLoad(load);
  const p = load * 100;
  return {
    load,
    amps: load * DIAGNOSIS_FIXTURE.nameplateAmps,
    flagRaised: d.flags.some((f) => f.code === 'ampsLow'),
    printsNowPct: p.toFixed(1),
    printedBeforeFixPct: p.toFixed(0),
    oldPrintEqualledThreshold: p.toFixed(0) === '40',
    messages: d.flags.filter((f) => f.code === 'ampsLow').map((f) => f.message),
  };
});

/**
 * WHAT THE FIX CHANGED AND WHAT IT DID NOT. `toFixed(0)` became `toFixed(1)` in
 * three message templates. No threshold, no comparison, no returned field and no
 * arithmetic anywhere. Every flag that fired before fires after, at the same
 * ratio, and every number the function RETURNS is bit for bit what it was.
 */
export const DIAGNOSIS_FIX = Object.freeze({
  thresholdsChanged: 0,
  returnedFieldsChanged: 0,
  messageTemplatesChanged: 3,
});

export const DIAGNOSIS_PRESSURE_FIXTURE = Object.freeze({ pIntakePsia: 800, headFt: 5000 });

/** Head can come from the two pressures instead of being handed over, and that is
 *  the route the gradient seam runs through. */
export const diagnosisFromPressures = () => {
  const gradient = PSI_PER_FT_SG * DIAGNOSIS_FIXTURE.specificGravity;
  const pDischargePsia = DIAGNOSIS_PRESSURE_FIXTURE.pIntakePsia
    + gradient * DIAGNOSIS_PRESSURE_FIXTURE.headFt;
  const d = diagnoseOperation({
    curve: dgCurve(),
    stages: DIAGNOSIS_FIXTURE.stages,
    hz: DIAGNOSIS_FIXTURE.hz,
    specificGravity: DIAGNOSIS_FIXTURE.specificGravity,
    measured: { qBpd: DIAGNOSIS_FIXTURE.qBpd, pIntakePsia: DIAGNOSIS_PRESSURE_FIXTURE.pIntakePsia, pDischargePsia },
  });
  return {
    pIntakePsia: DIAGNOSIS_PRESSURE_FIXTURE.pIntakePsia,
    pDischargePsia,
    gradientPsiPerFt: gradient,
    recoveredHeadFt: d.actualHeadFt,
    headRatio: d.headRatio,
    flagCodes: d.flags.map((f) => f.code),
  };
};

export const DIAGNOSIS_REGION_RATES = [1400, 1700, 1875, 2000, 2500, 3000, 3124, 3300, 3500];

/** The region flag prints the duty as a multiple of the best efficiency rate. */
export const diagnosisRegionRows = (rates = DIAGNOSIS_REGION_RATES) => rates.map((qBpd) => {
  const curve = dgCurve();
  const expected = stackPerformance({
    curve, stages: DIAGNOSIS_FIXTURE.stages, qBpd, hz: DIAGNOSIS_FIXTURE.hz,
    specificGravity: DIAGNOSIS_FIXTURE.specificGravity,
  });
  const d = diagnoseOperation({
    curve,
    stages: DIAGNOSIS_FIXTURE.stages,
    hz: DIAGNOSIS_FIXTURE.hz,
    specificGravity: DIAGNOSIS_FIXTURE.specificGravity,
    measured: { qBpd, headFt: expected.headFt },
  });
  return {
    qBpd,
    qOverBep: d.qOverBep,
    region: d.region,
    flagCodes: d.flags.map((f) => f.code),
    thrustMessages: d.flags.filter((f) => f.code === 'downthrust' || f.code === 'upthrust')
      .map((f) => f.message),
  };
});

// --------------------------------------------------------------- the stack curve

export const STACK_CURVE_FIXTURE = Object.freeze({ hz: 50, nPoints: 12 });

/**
 * Head the stack makes across a rate range, for plotting against a well. The rate
 * range is the published range scaled by the speed ratio, so a slower drive plots
 * a SHORTER curve.
 */
export const stackCurveRows = ({ hz = STACK_CURVE_FIXTURE.hz, nPoints = STACK_CURVE_FIXTURE.nPoints } = {}) => {
  const curve = dgCurve();
  const rows = stackCurve({
    curve,
    stages: DIAGNOSIS_FIXTURE.stages,
    hz,
    specificGravity: DIAGNOSIS_FIXTURE.specificGravity,
    nPoints,
  });
  return {
    hz,
    qLoBpd: rows[0].qBpd,
    qHiBpd: rows[rows.length - 1].qBpd,
    publishedLowTimesRatioBpd: curve.qMin * (hz / 60),
    publishedHighTimesRatioBpd: curve.qMax * (hz / 60),
    points: rows.map((r, i) => ({
      index: i + 1,
      qBpd: r.qBpd,
      headFt: r.headFt,
      efficiency: r.efficiency,
      bhpTotal: r.bhpTotal,
      region: r.region,
    })),
  };
};

// --------------------------------------------------------------- the refusals

/**
 * EVERY REFUSAL IN THE THREE MODULES, IN ONE PLACE. Every lesson in this course
 * has to say what its subject REFUSES to do, and these are the refusals the
 * engine actually makes, as opposed to the flags it raises while answering
 * anyway.
 */
export const refusals = () => {
  const short = fitStageCurve({ points: [{ qBpd: 1500, headFt: 32 }, { qBpd: 2500, headFt: 28 }] });
  const noEff = fitStageCurve({
    points: golden.vendorCurve.points.map((p) => ({ qBpd: p.qBpd, headFt: p.headFt })),
  });
  const noEffStage = stagePerformance({ curve: noEff, qBpd: 2500, hz: 60, specificGravity: 0.9 });
  const zeroHzStage = stagePerformance({
    curve: REF_CURVES['ref-540-2500'], qBpd: 2500, hz: 0, specificGravity: 0.9,
  });
  const c540 = REF_CURVES['ref-540-2500'];
  const noEffBep = bepOf({
    headFit: c540.headFit, effFit: null, qMin: c540.qMin, qMax: c540.qMax,
  });
  const partLoad = motorCurrent({ shaftHp: 20, nameplateHp: 100, nameplateAmps: 49 });
  const zeroGradient = totalDynamicHead({ pIntakePsia: 1000, pDischargePsia: 3000, gradientPsiPerFt: 0 });
  return {
    twoPointsOk: short.ok,
    twoPointsMessage: short.warnings[0],
    twoPointsHeadFitReturned: short.headFit !== undefined,
    noEfficiencyOk: noEff.ok,
    noEfficiencyWarning: noEff.warnings[0],
    noEfficiencyBepQBpd: noEff.bep.qBpd,
    noEfficiencyHeadAt2500Ft: noEffStage.headFt,
    noEfficiencyBhpPerStage: noEffStage.bhpPerStage,
    brakeHpAtZeroEfficiency: brakeHp({ qBpd: 2000, headFt: 5000, specificGravity: 1, efficiency: 0 }),
    stageCountAtZeroHead: stageCount({ tdhFt: 4000, headPerStageFt: 0 }),
    stageCountAtNegativeHead: stageCount({ tdhFt: 4000, headPerStageFt: -3 }),
    tdhAtZeroGradientFt: zeroGradient.tdhFt,
    tdhAtZeroGradientDpPsi: zeroGradient.dpPsi,
    motorCurrentAtZeroNameplateHp: motorCurrent({ shaftHp: 50, nameplateHp: 0, nameplateAmps: 49 }).amps,
    motorCurrentAtZeroNameplateAmps: motorCurrent({ shaftHp: 50, nameplateHp: 100, nameplateAmps: 0 }).amps,
    zeroFrequencyHeadFt: zeroHzStage.headFt,
    zeroFrequencyRegion: zeroHzStage.region,
    zeroFrequencyInRange: zeroHzStage.inRange,
    bepWithNoEfficiencyQBpd: noEffBep.qBpd,
    bepWithNoEfficiencyHeadFt: noEffBep.headFt,
    partLoadLoadFraction: partLoad.loadFraction,
    partLoadAmps: partLoad.amps,
    partLoadEstimateWeak: partLoad.estimateWeakBelowHalfLoad,
  };
};

// ===========================================================================
// THE CAPSTONE: OKARI-9 AND ITS EIGHTEEN GRADED FIELDS.
//
// EVERYTHING BELOW THIS LINE IS CAPSTONE MATERIAL AND MUST NEVER REACH A LESSON
// OR A PANEL. It is reproduced here, call for call, so that the grader, this
// file's own tests and the migration headers all read ONE derivation, and so
// that a panel author who wants what a capstone reader does is pushed to the
// teaching mirror instead of to the graded well.
//
// Every export from here down is named `CAP`, `OKARI_...`, `okari...`,
// `CAPSTONE_...`, `capstone...`, `LEAK_GUARD_...` or `leakGuard...`. That naming
// is the whole guard: espLab.test.js greps the panel sources for exactly those
// names and fails the build if one appears.
//
// OKARI-9 is a gassy, high water cut oil well on a variable speed drive, with the
// pump set 650 ft above the perforations and a 562 series stage whose vendor
// curve was published at 50 Hz while the design runs 57. Nothing about it is
// quotable.
// ===========================================================================

export const OKARI_LABEL = 'OKARI-9';

export const CAP = Object.freeze({
  stagePoints: [
    { qBpd: 1750, headFt: 22.6, efficiencyPct: 46.5 },
    { qBpd: 2400, headFt: 21.4, efficiencyPct: 60.5 },
    { qBpd: 3050, headFt: 19.6, efficiencyPct: 68.5 },
    { qBpd: 3700, headFt: 17.0, efficiencyPct: 71.0 },
    { qBpd: 4350, headFt: 13.4, efficiencyPct: 66.5 },
    { qBpd: 4900, headFt: 9.2, efficiencyPct: 55.5 },
  ],
  curveRefHz: 50,
  headDegree: 3,
  effDegree: 3,
  designHz: 57,
  // The ASSOCIATE tier's own duty and fluid. Deliberately NOT the well's.
  //
  // Until 2026-09-04 the three Associate stage reads were taken at
  // `gas.pumpIntakeBpd` on a specific gravity derived from
  // `gas.mixtureDensityLbFt3`, which are graded fields 10 and 9 of the
  // PROFESSIONAL tier. A stage cannot be read at a duty without a duty, so the
  // Associate PROMPT had to state both, which handed a Professional learner two
  // of their own answers. dc-wavekit/promptleak.py reported it as an exact hit.
  // Rounding was never a fix: field 4 is graded to 1.1e-5 ft, which pins the
  // rate harder than field 10's own 2.1e-3 bbl/d does.
  //
  // So the two were decoupled. espPump's header says the stage layer has
  // nothing about a well in it, and the Associate tier now honours that. The
  // design chain below is untouched and still runs at the well's own intake
  // rate and derived gravity, so graded fields 7 through 18 did not move.
  //
  // 4400 bbl/d also sharpens the affinity trap: divided by the 1.14 ratio it
  // reads the published curve at 3859.65 bbl/d, inside the data; multiplied by
  // it, which is the error, at 5016 bbl/d, 116 bbl/d PAST the 4900 bbl/d end,
  // where the cubic answers anyway and refuses nothing.
  dutyQBpd: 4400,
  dutySg: 0.82,
  qoStbd: 1136,
  wct: 0.66,
  gorScfStb: 1320,
  pvt: {
    rs: 415, bo: 1.285, bw: 1.037, bg: 0.00094, rhoO: 46.7, rhoW: 65.3, rhoG: 5.4,
  },
  separatorEfficiency: 0.55,
  gasLimits: DEFAULT_GAS_LIMITS,
  pwfPsia: 1385,
  perfTvdFt: 8390,
  pumpTvdFt: 7740,
  annulusGradPsiPerFt: 0.274,
  pDischargePsia: 2552,
  nameplateHp: 150,
  nameplateVolts: 2000,
  nameplateAmps: 48,
  motorEfficiency: 0.885,
  thrustDeratePct: 12,
  cableLengthFt: 8420,
  cableTempF: 195,
  powerFactor: 0.87,
  maxDropPct: 5,
  surveyQBpd: 3960,
  surveyIntakePsia: 1142,
  surveyDischargePsia: 2344,
  surveyAmps: 41.5,
  ladderHz: [60, 57, 54, 50, 46, 44, 43, 42, 41, 40, 38, 36],
  longerCableFt: 8440,
  hotterCableF: 196,
});

/** The capstone's stage curve: six vendor points of its own, published at 50 Hz. */
export const okariCurve = () => fitStageCurve({
  points: CAP.stagePoints,
  refHz: CAP.curveRefHz,
  headDegree: CAP.headDegree,
  effDegree: CAP.effDegree,
});

/** The whole capstone chain, in the order espDesign's header walks it. */
export const okariCase = () => {
  const curve = okariCurve();
  const bep = bepOf(curve);
  // The Associate tier's stage read, at its own duty on its own fluid. It does
  // not feed the design chain below and the design chain does not feed it.
  const dutyStage = stagePerformance({
    curve, qBpd: CAP.dutyQBpd, hz: CAP.designHz, specificGravity: CAP.dutySg,
  });
  const stream = intakeStream({
    qoStbd: CAP.qoStbd, wct: CAP.wct, gorScfStb: CAP.gorScfStb, pvt: CAP.pvt,
  });
  const gas = gasHandling({
    stream, separatorEfficiency: CAP.separatorEfficiency, limits: CAP.gasLimits,
  });
  const pIntakePsia = intakePressure({
    pwfPsia: CAP.pwfPsia,
    perfTvdFt: CAP.perfTvdFt,
    pumpTvdFt: CAP.pumpTvdFt,
    annulusGradPsiPerFt: CAP.annulusGradPsiPerFt,
  });
  const gradientPsiPerFt = gradientFromDensity(gas.mixtureDensityLbFt3);
  const sg = gradientPsiPerFt / PSI_PER_FT_SG;
  const tdh = totalDynamicHead({
    pIntakePsia, pDischargePsia: CAP.pDischargePsia, gradientPsiPerFt,
  });
  const sized = sizePump({
    curve,
    qBpd: gas.pumpIntakeBpd,
    tdhFt: tdh.tdhFt,
    hz: CAP.designHz,
    specificGravity: sg,
    nameplateHp: CAP.nameplateHp,
    motorEfficiency: CAP.motorEfficiency,
    thrustDeratePct: CAP.thrustDeratePct,
  });
  const selection = selectCable({
    cables: CABLE_SIZES,
    maxDropPct: CAP.maxDropPct,
    shaftHp: sized.shaftHp,
    nameplateHp: CAP.nameplateHp,
    nameplateAmps: CAP.nameplateAmps,
    nameplateVolts: CAP.nameplateVolts,
    powerFactor: CAP.powerFactor,
    lengthFt: CAP.cableLengthFt,
    cableTempF: CAP.cableTempF,
  });
  return {
    curve, bep, dutyStage, stream, gas, pIntakePsia, gradientPsiPerFt, sg, tdh,
    sized, selection, surface: selection.requirement,
  };
};

/** The same curve read backwards against OKARI-9's surveillance record. */
export const okariDiagnosis = () => {
  const c = okariCase();
  return diagnoseOperation({
    curve: c.curve,
    stages: c.sized.stages,
    hz: CAP.designHz,
    specificGravity: c.sg,
    measured: {
      qBpd: CAP.surveyQBpd,
      pIntakePsia: CAP.surveyIntakePsia,
      pDischargePsia: CAP.surveyDischargePsia,
      amps: CAP.surveyAmps,
    },
    nameplateAmps: CAP.nameplateAmps,
  });
};

/** The capstone's turndown ladder. The teaching mirror is `designTurndownRows`. */
export const okariTurndownLadder = () => {
  const c = okariCase();
  return CAP.ladderHz.map((hz) => {
    const s = stagePerformance({
      curve: c.curve, qBpd: c.gas.pumpIntakeBpd, hz, specificGravity: c.sg,
    });
    const stages = stageCount({ tdhFt: c.tdh.tdhFt, headPerStageFt: s.headFt });
    const rung = sizePump({
      curve: c.curve,
      qBpd: c.gas.pumpIntakeBpd,
      tdhFt: c.tdh.tdhFt,
      hz,
      specificGravity: c.sg,
      nameplateHp: CAP.nameplateHp,
      motorEfficiency: CAP.motorEfficiency,
      thrustDeratePct: CAP.thrustDeratePct,
    });
    return {
      hz,
      qRefBpd: s.qRefBpd,
      headPerStageFt: s.headFt,
      efficiency: s.efficiency,
      stagesReturned: stages,
      inRange: s.inRange,
      region: s.region,
      warningCodes: rung.warnings.map((w) => w.code),
    };
  });
};

/** The capstone's gradient study. The teaching mirror is `gradientConventionRows`. */
export const okariGradientStudy = () => {
  const c = okariCase();
  const naiveGradient = PSI_PER_FT_SG * (c.gas.mixtureDensityLbFt3 / WATER_LBF_PER_FT3);
  const naive = totalDynamicHead({
    pIntakePsia: c.pIntakePsia, pDischargePsia: CAP.pDischargePsia, gradientPsiPerFt: naiveGradient,
  });
  return {
    designGradientPsiPerFt: c.gradientPsiPerFt,
    naiveGradientPsiPerFt: naiveGradient,
    tdhFt: c.tdh.tdhFt,
    tdhFromNaiveSgFt: naive.tdhFt,
    conventionGapFt: naive.tdhFt - c.tdh.tdhFt,
  };
};

/** The capstone's seam reading. The teaching mirror is `loadFractionSeamRows`. */
export const okariSeam = () => {
  const c = okariCase();
  const electrical = motorCurrent({
    shaftHp: c.sized.shaftHp, nameplateHp: CAP.nameplateHp, nameplateAmps: CAP.nameplateAmps,
  });
  return {
    selectionLoadFraction: c.sized.motorLoad.loadFraction,
    electricalLoadFraction: electrical.loadFraction,
    gapPoints: (c.sized.motorLoad.loadFraction - electrical.loadFraction) * 100,
    shaftHp: c.sized.shaftHp,
    stackBhpTotal: c.sized.stack.bhpTotal,
    twoPowerGapHp: c.sized.stack.bhpTotal - c.sized.shaftHp,
  };
};

/** The capstone's cable sensitivity. The teaching mirror is `teachingCableFlipStudy`. */
export const okariCableStudy = () => {
  const c = okariCase();
  const pick = (over) => selectCable({
    cables: CABLE_SIZES,
    maxDropPct: CAP.maxDropPct,
    shaftHp: c.sized.shaftHp,
    nameplateHp: CAP.nameplateHp,
    nameplateAmps: CAP.nameplateAmps,
    nameplateVolts: CAP.nameplateVolts,
    powerFactor: CAP.powerFactor,
    lengthFt: CAP.cableLengthFt,
    cableTempF: CAP.cableTempF,
    ...over,
  });
  const atDesign = c.selection;
  const atLonger = pick({ lengthFt: CAP.longerCableFt });
  const atHotter = pick({ cableTempF: CAP.hotterCableF });
  return {
    chosenAwg: atDesign.cable.awg,
    dropPct: atDesign.requirement.dropPct,
    maxDropPct: atDesign.maxDropPct,
    longerAwg: atLonger.cable.awg,
    longerDropPct: atLonger.requirement.dropPct,
    hotterAwg: atHotter.cable.awg,
    hotterDropPct: atHotter.requirement.dropPct,
    ampacityCheckIsInert: atDesign.candidates.every((x) => x.ampacityOk === true),
  };
};

export const CAPSTONE_TIERS = Object.freeze({
  stage_fit_head_rmse_ft: 'beginner',
  stage_bep_q_bpd: 'beginner',
  stage_bep_head_ft: 'beginner',
  stage_head_at_duty_ft: 'beginner',
  stage_efficiency_at_duty_frac: 'beginner',
  stage_bhp_per_stage_hp: 'beginner',
  intake_pressure_psia: 'intermediate',
  intake_stream_gvf_frac: 'intermediate',
  pump_mixture_density_lbft3: 'intermediate',
  pump_intake_bpd: 'intermediate',
  tdh_ft: 'intermediate',
  design_head_made_ft: 'intermediate',
  design_shaft_hp: 'advanced',
  motor_amps_a: 'advanced',
  cable_drop_pct: 'advanced',
  surface_kva: 'advanced',
  cable_loss_kw: 'advanced',
  diag_head_ratio_frac: 'advanced',
});

/** The eighteen graded answers, every one a return value of the vendored engine. */
export const capstoneValues = () => {
  const c = okariCase();
  const diag = okariDiagnosis();
  return {
    stage_fit_head_rmse_ft: c.curve.headFit.rmse,
    stage_bep_q_bpd: c.bep.qBpd,
    stage_bep_head_ft: c.bep.headFt,
    stage_head_at_duty_ft: c.dutyStage.headFt,
    stage_efficiency_at_duty_frac: c.dutyStage.efficiency,
    stage_bhp_per_stage_hp: c.dutyStage.bhpPerStage,
    intake_pressure_psia: c.pIntakePsia,
    intake_stream_gvf_frac: c.stream.gvf,
    pump_mixture_density_lbft3: c.gas.mixtureDensityLbFt3,
    pump_intake_bpd: c.gas.pumpIntakeBpd,
    tdh_ft: c.tdh.tdhFt,
    design_head_made_ft: c.sized.headMadeFt,
    design_shaft_hp: c.sized.shaftHp,
    motor_amps_a: c.surface.amps,
    cable_drop_pct: c.surface.dropPct,
    surface_kva: c.surface.kva,
    cable_loss_kw: c.surface.lossKw,
    diag_head_ratio_frac: diag.headRatio,
  };
};

/**
 * The grading tolerance of each capstone field, exactly as the capstone publishes
 * them.
 *
 * THESE ARE ABSOLUTE TOLERANCES, IN EACH FIELD'S OWN UNITS. Not fractions of the
 * value. That is not an inference, it is what the grader does. From
 * `public.academy_submit_capstone` in
 * migrations/20260715_n4_petrophysics_capstone.sql:
 *
 *     v_tol := (v_field->>'tol')::numeric;
 *     ...
 *     if v_got is not null and abs(v_got - v_exp) <= v_tol then
 *
 * `abs(v_got - v_exp) <= v_tol`, with no division by v_exp anywhere. So `tdh_ft`
 * is accepted within 0.0018 FEET of its answer, not within 0.18 percent of it,
 * and the bands below are thousands of times tighter than a relative reading of
 * the same numbers. Read the grader; do not infer it.
 */
export const CAPSTONE_TOLERANCES = Object.freeze({
  stage_fit_head_rmse_ft: 1.1e-8,
  stage_bep_q_bpd: 1.8e-3,
  stage_bep_head_ft: 8.7e-6,
  stage_head_at_duty_ft: 1.1e-5,
  stage_efficiency_at_duty_frac: 3.5e-7,
  stage_bhp_per_stage_hp: 4.0e-7,
  intake_pressure_psia: 6.0e-4,
  intake_stream_gvf_frac: 1.0e-7,
  pump_mixture_density_lbft3: 2.6e-5,
  pump_intake_bpd: 2.1e-3,
  tdh_ft: 1.8e-3,
  design_head_made_ft: 1.9e-3,
  design_shaft_hp: 6.7e-5,
  motor_amps_a: 2.2e-5,
  cable_drop_pct: 2.5e-6,
  surface_kva: 7.8e-5,
  cable_loss_kw: 3.7e-6,
  diag_head_ratio_frac: 4.2e-7,
});

/** The unit each graded field is answered in, for the dimension aware half of the gate. */
export const CAPSTONE_FIELD_UNITS = Object.freeze({
  stage_fit_head_rmse_ft: 'ft',
  stage_bep_q_bpd: 'bbl/d',
  stage_bep_head_ft: 'ft',
  stage_head_at_duty_ft: 'ft',
  stage_efficiency_at_duty_frac: 'fraction',
  stage_bhp_per_stage_hp: 'hp',
  intake_pressure_psia: 'psia',
  intake_stream_gvf_frac: 'fraction',
  pump_mixture_density_lbft3: 'lbm/ft3',
  pump_intake_bpd: 'bbl/d',
  tdh_ft: 'ft',
  design_head_made_ft: 'ft',
  design_shaft_hp: 'hp',
  motor_amps_a: 'A',
  cable_drop_pct: 'percent',
  surface_kva: 'kVA',
  cable_loss_kw: 'kW',
  diag_head_ratio_frac: 'fraction',
});

/**
 * How much wider than the grader's own acceptance band a teaching number has to
 * stand clear. Ten, so a lesson that rounds a number in prose still cannot land
 * on a graded answer. Ten times an ABSOLUTE tolerance is still a very small
 * target: ten times 0.0018 ft is 0.018 ft on a total dynamic head, and ten times
 * 0.000022 A is 0.00022 A on a motor current.
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
      // value: a band of 0.0018 ft restated in thousands is 0.0000018.
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
 * Is this number inside a forbidden neighbourhood? Returns the target it collides
 * with, or null. Deliberately DIMENSION BLIND: the grader compares numbers and
 * never asks what they were a measurement of, so neither does this.
 */
export const leakGuardHit = (value, targets = leakGuardTargets()) => {
  if (!Number.isFinite(value)) return null;
  for (const t of targets) {
    if (Math.abs(value - t.value) <= t.band) return t;
  }
  return null;
};

// ===========================================================================
// THE TEACHING QUANTITIES.
//
// Every number and every verdict the 78 shipped lessons quote, as
// `{ label, value }`, with the label the teaching digest prints it under. The
// list is built ENTIRELY out of the accessors above, so it cannot drift from what
// a panel renders, and espLab.test.js pins every entry against
// /root/pd-wip-esp/digest.txt at that digest's own printed precision.
//
// A number that is not reachable from here is not teaching material. Nothing on
// this list is capstone material: the list never calls `okariCase`, `CAP`, or
// `capstoneValues`, and the leak gate in the test proves it by measurement
// rather than by inspection.
// ===========================================================================

const Q = (rows, label, value) => { rows.push({ label, value }); };

export const teachingQuantities = () => {
  const rows = [];
  const q = (label, value) => Q(rows, label, value);

  // ---- Section 1: the constants and the thresholds ------------------------
  q('constant, cubic feet per barrel', FT3_PER_BBL);
  q('constant, seconds per day', SEC_PER_DAY);
  q('constant, water specific weight', WATER_LBF_PER_FT3);
  q('constant, foot pounds force per second per horsepower', FT_LBF_PER_S_PER_HP);
  q('constant, HP_HEAD_DIVISOR', HP_HEAD_DIVISOR);
  q('golden, hpHeadDivisor', golden.constants.hpHeadDivisor);
  q('constant, HP_HEAD_DIVISOR against the golden, relative deviation',
    Math.abs(HP_HEAD_DIVISOR - golden.constants.hpHeadDivisor) / golden.constants.hpHeadDivisor);
  q('constant, HP_HEAD_DIVISOR times 62.4/144 (the pressure form divisor)',
    HP_HEAD_DIVISOR * EXACT_PSI_PER_FT_SG);
  q('constant, that against the familiar rounded 58824, relative deviation',
    Math.abs(HP_HEAD_DIVISOR * EXACT_PSI_PER_FT_SG - FAMILIAR_PRESSURE_DIVISOR) / FAMILIAR_PRESSURE_DIVISOR);
  q('constant, PSI_PER_FT_SG (the rounded field form)', PSI_PER_FT_SG);
  q('constant, 62.4 divided by 144 (the exact form gradientFromDensity uses)', EXACT_PSI_PER_FT_SG);
  q('constant, copper temperature coefficient per degF', COPPER_ALPHA_PER_F);
  q('constant, copper resistance reference temperature', COPPER_REF_TEMP_F);
  q('threshold, DEFAULT_GAS_LIMITS standardMax', ESP_THRESHOLDS.standardMaxGvf);
  q('threshold, DEFAULT_GAS_LIMITS handlerMax', ESP_THRESHOLDS.handlerMaxGvf);
  q('threshold, VISCOSITY_CORRECTION_THRESHOLD_CST', ESP_THRESHOLDS.viscosityCorrectionCSt);
  q('threshold, selectCable default maximum voltage drop', ESP_THRESHOLDS.selectCableMaxDropPct);

  // ---- Section 2: the published catalogue ---------------------------------
  catalogueStageRows().forEach((s) => {
    q(`catalogue stage ${s.id}, label`, s.label);
    q(`catalogue stage ${s.id}, housing outside diameter`, s.housingOdIn);
    q(`catalogue stage ${s.id}, rate at best efficiency`, s.bepBpd);
    q(`catalogue stage ${s.id}, head at best efficiency`, s.bepHeadFt);
    q(`catalogue stage ${s.id}, shutoff to BEP head ratio`, s.shutoffRatio);
    q(`catalogue stage ${s.id}, peak efficiency`, s.bepEfficiency);
    q(`catalogue stage ${s.id}, published range low`, s.qMin);
    q(`catalogue stage ${s.id}, published range high`, s.qMax);
  });
  catalogueCableRows().forEach((c) => {
    q(`catalogue cable ${c.label}, copper resistance at 77 degF`, c.ohmsPer1000FtAt77F);
    q(`catalogue cable ${c.label}, ampacity column present`, c.ampacityDeclared);
  });
  catalogueMotorRows().forEach((m) => {
    q(`catalogue motor ${m.id}, nameplate power`, m.hp);
    q(`catalogue motor ${m.id}, nameplate voltage`, m.volts);
    q(`catalogue motor ${m.id}, nameplate current`, m.amps);
    q(`catalogue motor ${m.id}, series outside diameter`, m.seriesOdIn);
  });

  // ---- Section 3: the vendor curve and the cubic through it ---------------
  vendorPublishedPoints().forEach((p) => {
    q(`golden vendor curve, published point at ${p.qBpd} bbl/d, head`, p.headFt);
    q(`golden vendor curve, published point at ${p.qBpd} bbl/d, efficiency`, p.efficiencyPct);
  });
  const fit = vendorCurveFit();
  q('golden vendor curve, published range low', fit.qMin);
  q('golden vendor curve, published range high', fit.qMax);
  q('golden vendor curve, reference frequency', fit.refHz);
  q('golden vendor curve, curve specific gravity', fit.curveSpecificGravity);
  q('golden vendor curve, head fit degree', fit.headDegree);
  q('golden vendor curve, head fit normalising scale', fit.headScale);
  fit.headCoeffs.forEach((c, i) => q(`golden vendor curve, head fit coefficient on z power ${i}`, c));
  q('golden vendor curve, head fit rmse', fit.headRmse);
  q('golden vendor curve, head fit rmse as recorded in the golden', fit.goldenHeadRmse);
  q('golden vendor curve, head fit rmse as a fraction of the tallest point', fit.rmseFractionOfTallest);
  q('golden vendor curve, transcription warning threshold, 2 percent of the tallest point',
    fit.transcriptionThresholdFt);
  q('golden vendor curve, warnings raised', fit.warningCount);
  q('golden vendor curve, efficiency fit degree', fit.effDegree);
  fit.effCoeffs.forEach((c, i) => q(`golden vendor curve, efficiency fit coefficient on z power ${i}`, c));
  q('golden vendor curve, efficiency fit rmse', fit.effRmse);
  q('golden vendor curve, brake power fit present', fit.bhpFitPresent);
  vendorFitResidualRows().forEach((r) => {
    q(`golden vendor curve, head fit read at ${r.qBpd} bbl/d`, r.fitHeadFt);
    q(`golden vendor curve, head residual at ${r.qBpd} bbl/d`, r.headResidualFt);
    q(`golden vendor curve, efficiency fit read at ${r.qBpd} bbl/d`, r.fitEfficiency);
    q(`golden vendor curve, efficiency residual at ${r.qBpd} bbl/d`, r.efficiencyResidual);
  });
  const bep = vendorBep();
  q('golden vendor curve, best efficiency rate', bep.qBpd);
  q('golden vendor curve, best efficiency head', bep.headFt);
  q('golden vendor curve, best efficiency value', bep.efficiency);
  q('golden vendor curve, best efficiency rate as recorded in the golden', bep.goldenQBpd);
  q('golden vendor curve, best efficiency head as recorded in the golden', bep.goldenHeadFt);
  q('golden vendor curve, best efficiency value as recorded in the golden', bep.goldenEfficiency);
  q('golden vendor curve, BEP scan spacing across the published range', bep.scanSpacingBpd);
  vendorDutyRows().forEach((r) => {
    q(`golden vendor curve, at ${r.qBpd} bbl/d 60 Hz, head`, r.headFt);
    q(`golden vendor curve, at ${r.qBpd} bbl/d 60 Hz, efficiency`, r.efficiency);
    q(`golden vendor curve, at ${r.qBpd} bbl/d 60 Hz SG 1.00, brake power per stage`, r.bhpPerStageSg100);
    q(`golden vendor curve, at ${r.qBpd} bbl/d 60 Hz SG 0.90, brake power per stage`, r.bhpPerStageSg090);
    q(`golden vendor curve, at ${r.qBpd} bbl/d 60 Hz, region`, r.region);
    q(`golden vendor curve, at ${r.qBpd} bbl/d 60 Hz, inside the published range`, r.inRange);
  });

  // ---- Section 4: the reference stage models -----------------------------
  REFERENCE_CURVE_IDS.forEach((id) => {
    const s = referenceCurveSummary(id);
    q(`reference stage ${id}, label`, s.label);
    q(`reference stage ${id}, source`, s.source);
    q(`reference stage ${id}, generating rate at best efficiency`, s.bepBpd);
    q(`reference stage ${id}, generating head at best efficiency`, s.bepHeadFt);
    q(`reference stage ${id}, generating shutoff head ratio`, s.shutoffRatio);
    q(`reference stage ${id}, generating peak efficiency`, s.bepEfficiency);
    q(`reference stage ${id}, published range low`, s.qMin);
    q(`reference stage ${id}, published range high`, s.qMax);
    q(`reference stage ${id}, generated point spacing`, s.pointSpacingBpd);
    q(`reference stage ${id}, head fit degree`, s.headDegree);
    q(`reference stage ${id}, head fit normalising scale`, s.headScale);
    s.headCoeffs.forEach((c, i) => q(`reference stage ${id}, head fit coefficient on z power ${i}`, c));
    q(`reference stage ${id}, head fit rmse`, s.headRmse);
    q(`reference stage ${id}, efficiency fit rmse`, s.effRmse);
    q(`reference stage ${id}, best efficiency rate`, s.bepQBpd);
    q(`reference stage ${id}, best efficiency head`, s.bepReadHeadFt);
    q(`reference stage ${id}, best efficiency value`, s.bepReadEfficiency);
    q(`reference stage ${id}, shutoff head from the generating shape`, s.shutoffHeadFt);
    q(`reference stage ${id}, recommended band low, 0.75 of the BEP rate`, s.recommendedLowBpd);
    q(`reference stage ${id}, recommended band high, 1.25 of the BEP rate`, s.recommendedHighBpd);
    q(`reference stage ${id}, reference rate at which head reaches zero`, s.zeroHeadRateBpd);
    q(`reference stage ${id}, that rate past the end of the published data`, s.zeroHeadPastDataBpd);
  });
  goldenReferenceCurveRows().forEach((rc) => {
    q(`golden reference curve ${rc.id}, best efficiency rate as recorded`, rc.bepQBpd);
    q(`golden reference curve ${rc.id}, best efficiency head as recorded`, rc.bepHeadFt);
    q(`golden reference curve ${rc.id}, best efficiency value as recorded`, rc.bepEfficiency);
    q(`golden reference curve ${rc.id}, head at the nominal BEP rate as recorded`, rc.headAtBepFt);
    rc.samples.forEach((s) => {
      q(`golden reference curve ${rc.id}, sampled head at ${s.qBpd} bbl/d`, s.headFt);
    });
  });
  ['ref-540-2500', 'ref-675-7000'].forEach((id) => {
    referenceDutyRows(id).forEach((r) => {
      q(`reference stage ${id}, at ${r.qBpd} bbl/d 60 Hz, head`, r.headFt);
      q(`reference stage ${id}, at ${r.qBpd} bbl/d 60 Hz, efficiency`, r.efficiency);
      q(`reference stage ${id}, at ${r.qBpd} bbl/d 60 Hz SG 1.00, brake power per stage`, r.bhpPerStage);
      q(`reference stage ${id}, at ${r.qBpd} bbl/d 60 Hz, region`, r.region);
    });
  });

  // ---- Section 5: the affinity laws ---------------------------------------
  goldenAffinityRows().forEach((r) => {
    const tag = `golden affinity ${r.hz} Hz ${r.qBpd} bbl/d`;
    q(`${tag}, speed ratio`, r.ratio);
    q(`${tag}, equivalent rate on the 60 Hz curve`, r.qRefBpd);
    q(`${tag}, head per stage`, r.headFt);
    q(`${tag}, efficiency`, r.efficiency);
    q(`${tag}, brake power per stage`, r.bhpPerStage);
    q(`${tag}, inside the published range`, r.inRange);
    q(`${tag}, region`, r.region);
    q(`${tag}, head as recorded in the golden`, r.goldenHeadFt);
    q(`${tag}, brake power as recorded in the golden`, r.goldenBhpPerStage);
  });
  q('golden affinity, largest relative deviation between the engine and the golden across all twelve rows',
    affinityMaxDeviation());
  speedSweepRows().forEach((r) => {
    const tag = `golden vendor curve at ${r.qBpd} bbl/d, ${r.hz} Hz`;
    q(`${tag}, equivalent 60 Hz rate`, r.qRefBpd);
    q(`${tag}, head per stage`, r.headFt);
    q(`${tag}, efficiency`, r.efficiency);
    q(`${tag}, brake power per stage`, r.bhpPerStage);
    q(`${tag}, head as a multiple of the 60 Hz head`, r.headMultipleOf60Hz);
    q(`${tag}, speed ratio squared`, r.speedRatioSquared);
    q(`${tag}, speed ratio cubed`, r.speedRatioCubed);
    q(`${tag}, inside the published range`, r.inRange);
    q(`${tag}, region`, r.region);
  });

  // ---- Section 6: the edge of the fit -------------------------------------
  const ex = goldenExtrapolatedRow();
  q('the golden extrapolated row, 40 Hz 3200 bbl/d, equivalent rate on the 60 Hz curve', ex.qRefBpd);
  q('the golden extrapolated row, published range low', ex.qMin);
  q('the golden extrapolated row, published range high', ex.qMax);
  q('the golden extrapolated row, distance past the end of the data', ex.pastDataBpd);
  q('the golden extrapolated row, head per stage', ex.headFt);
  q('the golden extrapolated row, brake power per stage', ex.bhpPerStage);
  q('the golden extrapolated row, efficiency', ex.efficiency);
  q('the golden extrapolated row, inside the published range', ex.inRange);
  q('the golden extrapolated row, region', ex.region);
  q('the golden extrapolated row, head as a fraction of the head at the same rate at 60 Hz',
    ex.headFractionOfSameRateAt60Hz);
  vendorExtrapolationRows().forEach((r) => {
    const tag = `golden vendor curve extrapolation, at ${r.qBpd} bbl/d 60 Hz`;
    q(`${tag}, head`, r.headFt);
    q(`${tag}, efficiency`, r.efficiency);
    q(`${tag}, brake power per stage`, r.bhpPerStage);
    q(`${tag}, distance past the end of the data`, r.pastDataBpd);
    q(`${tag}, inside the published range`, r.inRange);
    q(`${tag}, region`, r.region);
  });
  const ends = fitExhaustion();
  q('golden vendor curve, rate at which the cubic head fit reaches zero at 60 Hz', ends.vendorZeroHeadBpd);
  q('golden vendor curve, that rate past the end of the published data', ends.vendorZeroHeadPastDataBpd);
  referenceExtrapolationRows().forEach((r) => {
    const tag = `reference stage ref-540-2500 extrapolation, at ${r.qBpd} bbl/d 60 Hz`;
    q(`${tag}, head`, r.headFt);
    q(`${tag}, efficiency`, r.efficiency);
    q(`${tag}, brake power per stage`, r.bhpPerStage);
    q(`${tag}, inside the published range`, r.inRange);
    q(`${tag}, region`, r.region);
  });
  q('reference stage ref-540-2500, rate at which the head fit reaches zero at 60 Hz', ends.referenceZeroHeadBpd);
  q('reference stage ref-540-2500, that rate past the end of the published data',
    ends.referenceZeroHeadPastDataBpd);
  efficiencyTailRows().forEach((r) => {
    q(`golden vendor curve extrapolation, efficiency fit read at ${r.qBpd} bbl/d`, r.vendorEfficiency);
    q(`reference stage ref-540-2500 extrapolation, efficiency fit read at ${r.qBpd} bbl/d`, r.referenceEfficiency);
  });
  q('golden vendor curve, rate at which the efficiency fit reaches zero at 60 Hz', ends.vendorZeroEfficiencyBpd);
  q('golden vendor curve, that is BEYOND the rate at which head reaches zero by',
    ends.vendorEfficiencyOutlivesHeadBpd);
  q('reference stage ref-540-2500, rate at which the efficiency fit reaches zero at 60 Hz',
    ends.referenceZeroEfficiencyBpd);
  q('reference stage ref-540-2500, that is BEYOND the rate at which head reaches zero by',
    ends.referenceEfficiencyOutlivesHeadBpd);

  // ---- Section 7: what an unbounded fit costs a whole design --------------
  GOLDEN_DESIGN_IDS.forEach((id) => {
    designTurndownRows(id).forEach((r) => {
      const tag = `golden design ${id} swept to ${r.hz} Hz`;
      q(`${tag}, equivalent rate on the 60 Hz curve`, r.qRefBpd);
      q(`${tag}, distance past the end of the published data`, r.pastDataBpd);
      q(`${tag}, head per stage`, r.headPerStageFt);
      q(`${tag}, head per stage smaller than at the design speed by a factor of`, r.headShrinkFactor);
      q(`${tag}, stages required`, r.stages);
      q(`${tag}, stages as a multiple of the stages at the design speed`, r.stagesMultipleOfDesign);
      q(`${tag}, inside the published range`, r.inRange);
      q(`${tag}, region`, r.region);
      q(`${tag}, warnings raised`, r.warningCount);
      q(`${tag}, warning codes`, r.warningCodes.join(' ') || 'none');
    });
    const z = designZeroHeadFrequency(id);
    q(`golden design ${id}, frequency at which the head per stage reaches zero at this duty rate`, z.zeroHeadHz);
    q(`golden design ${id}, that frequency below the design speed`, z.belowDesignHz);
  });
  q('recorded finding at 40 Hz, stages returned', RECORDED_FINDING_40HZ.stagesReturned);
  q('recorded finding at 40 Hz, head per stage', RECORDED_FINDING_40HZ.headPerStageFt);
  q('recorded finding at 40 Hz, stages as a multiple of the design speed stack',
    RECORDED_FINDING_40HZ.stagesMultipleOfDesign);
  q('recorded finding at 40 Hz, warnings raised', RECORDED_FINDING_40HZ.warningsRaised);
  q('recorded finding at 40 Hz, refusals', RECORDED_FINDING_40HZ.refusals);
  q('recorded finding, frequency at which head finally goes negative', RECORDED_FINDING_40HZ.headTurnsNegativeHz);

  // ---- Section 8: the transcription curve ---------------------------------
  brassTranscriptionRows().forEach((r) => {
    const tag = `teaching curve ${BRASS_LABEL} ${r.variant}`;
    q(`${tag}, head fit rmse`, r.headRmse);
    q(`${tag}, transcription warning threshold`, r.transcriptionThresholdFt);
    q(`${tag}, warnings raised`, r.warningCount);
    r.warnings.forEach((w, i) => q(`${tag}, warning ${i + 1}`, w));
    q(`${tag}, head read at 2500 bbl/d 60 Hz`, r.headAt2500Ft);
    q(`${tag}, best efficiency rate`, r.bepQBpd);
    q(`${tag}, best efficiency head`, r.bepHeadFt);
  });


  // ---- Section 9: the intake side -----------------------------------------
  const intakeCases = [...GOLDEN_DESIGN_IDS.map(goldenDesign), teachingWellCase(QUA_IBOE_4)];
  intakeCases.forEach((c) => {
    const r = intakeReading(c);
    const t = c.tag;
    q(`${t}, flowing bottomhole pressure`, r.pwfPsia);
    q(`${t}, perforation depth`, r.perfTvdFt);
    q(`${t}, pump setting depth`, r.pumpTvdFt);
    q(`${t}, annulus column above the pump`, r.annulusColumnFt);
    q(`${t}, annulus gradient`, r.annulusGradPsiPerFt);
    q(`${t}, annulus column pressure`, r.annulusColumnPsi);
    q(`${t}, pump intake pressure`, r.pIntakePsia);
    q(`${t}, oil rate at the tank`, r.qoStbd);
    q(`${t}, water cut`, r.wct);
    q(`${t}, producing gas oil ratio`, r.gorScfStb);
    q(`${t}, solution gas at intake conditions, Rs`, r.rs);
    q(`${t}, oil formation volume factor, Bo`, r.bo);
    q(`${t}, water formation volume factor, Bw`, r.bw);
    q(`${t}, gas formation volume factor, Bg`, r.bg);
    q(`${t}, oil density at intake`, r.rhoO);
    q(`${t}, water density at intake`, r.rhoW);
    q(`${t}, gas density at intake`, r.rhoG);
    q(`${t}, water rate at the tank`, r.qwStbd);
    q(`${t}, oil rate at depth`, r.qoResBpd);
    q(`${t}, water rate at depth`, r.qwResBpd);
    q(`${t}, liquid rate at depth`, r.liquidResBpd);
    q(`${t}, free gas at standard conditions`, r.freeGasScfd);
    q(`${t}, free gas at depth`, r.freeGasResBpd);
    q(`${t}, total stream at depth`, r.totalResBpd);
    q(`${t}, gas volume fraction of the whole stream`, r.streamGvf);
    q(`${t}, liquid density at depth`, r.liquidDensityLbFt3);
    q(`${t}, gas density at depth`, r.gasDensityLbFt3);
    q(`${t}, mixture density of the whole stream`, r.streamMixtureDensityLbFt3);
    q(`${t}, separator efficiency`, r.separatorEfficiency);
    q(`${t}, gas vented up the annulus`, r.ventedResBpd);
    q(`${t}, gas through the pump`, r.throughPumpGasResBpd);
    q(`${t}, rate through the pump`, r.pumpIntakeBpd);
    q(`${t}, gas volume fraction through the pump`, r.gvfThroughPump);
    q(`${t}, mixture density through the pump`, r.pumpMixtureDensityLbFt3);
    q(`${t}, verdict`, r.verdict);
    q(`${t}, design gradient from the pumped mixture density`, r.gradientPsiPerFt);
    q(`${t}, laundered specific gravity, gradient divided by 0.433`, r.launderedSg);
    q(`${t}, rate at depth as a multiple of the tank liquid rate`, r.formationVolumeMultiple);
  });
  GOLDEN_DESIGN_IDS.forEach((id) => {
    const g = goldenIntakeRecorded(id);
    q(`golden design ${id}, intake pressure as recorded in the golden`, g.intakePressurePsia);
    q(`golden design ${id}, stream gas volume fraction as recorded in the golden`, g.streamGvf);
    q(`golden design ${id}, mixture density through the pump as recorded in the golden`,
      g.pumpMixtureDensityLbFt3);
    q(`golden design ${id}, rate through the pump as recorded in the golden`, g.pumpIntakeBpd);
    q(`golden design ${id}, design gradient as recorded in the golden`, g.gradientPsiPerFt);
  });
  separatorDensityRows().forEach((r) => {
    q(`${r.tag}, whole stream mixture density`, r.streamMixtureDensityLbFt3);
    q(`${r.tag}, through pump mixture density`, r.pumpMixtureDensityLbFt3);
    q(`${r.tag}, the separator makes the pumped fluid heavier by`, r.densityGainLbFt3);
    q(`${r.tag}, and the gradient heavier by`, r.gradientGainPsiPerFt);
  });

  // ---- Section 10: the gas verdict and its two thresholds -----------------
  gasVerdictSweepRows(teachingWellCase(QUA_IBOE_4)).forEach((r) => {
    const t = `teaching well QUA-IBOE-4, separator efficiency ${r.separatorEfficiency.toFixed(2)}`;
    q(`${t}, gas through the pump`, r.throughPumpGasResBpd);
    q(`${t}, rate through the pump`, r.pumpIntakeBpd);
    q(`${t}, gas volume fraction through the pump`, r.gvfThroughPump);
    q(`${t}, mixture density through the pump`, r.mixtureDensityLbFt3);
    q(`${t}, verdict`, r.verdict);
  });

  // ---- Section 11: two conversions for one gradient -----------------------
  const gc = gradientConversionSummary();
  q('gradient conversion, exact form, 62.4 divided by 144', gc.exactPsiPerFtSg);
  q('gradient conversion, rounded form, PSI_PER_FT_SG', gc.roundedPsiPerFtSg);
  q('gradient conversion, difference', gc.differencePsiPerFtSg);
  q('gradient conversion, difference as a percentage of the rounded form', gc.differencePct);
  gradientConventionRows().forEach((r) => {
    q(`${r.tag}, TRUE specific gravity, density divided by 62.4`, r.trueSg);
    q(`${r.tag}, laundered specific gravity, design gradient divided by 0.433`, r.launderedSg);
    q(`${r.tag}, design gradient, the exact conversion`, r.designGradientPsiPerFt);
    q(`${r.tag}, diagnostics gradient on the TRUE specific gravity`, r.diagnosticsGradientOnTrueSgPsiPerFt);
    q(`${r.tag}, head on the design gradient`, r.headOnDesignGradientFt);
    q(`${r.tag}, head on the TRUE specific gravity route`, r.headOnTrueSgFt);
    q(`${r.tag}, the two routes disagree by`, r.gapFt);
    q(`${r.tag}, and by`, r.gapPct);
    q(`${r.tag}, on the LAUNDERED specific gravity the two routes disagree by`, r.gapOnLaunderedSgFt);
  });

  // ---- Section 12: total dynamic head and its three parts -----------------
  allCases().forEach((c) => {
    const d = tdhDecomposition(c);
    const t = c.tag;
    q(`${t}, pump discharge pressure`, d.pDischargePsia);
    q(`${t}, pump intake pressure`, d.pIntakePsia);
    q(`${t}, pressure the pump must add`, d.dpPsi);
    q(`${t}, gradient of the fluid in the pump`, d.gradientPsiPerFt);
    q(`${t}, total dynamic head`, d.tdhFt);
    q(`${t}, TEACHING INPUT, wellhead pressure`, d.whpPsia);
    q(`${t}, fluid standing above the intake, intake pressure over the gradient`, d.fluidAboveIntakeFt);
    q(`${t}, dynamic fluid level below surface`, d.dynamicFluidLevelFt);
    q(`${t}, part one, net vertical lift`, d.netLiftFt);
    q(`${t}, part two, tubing friction`, d.frictionFt);
    q(`${t}, part three, the wellhead term`, d.whpHeadFt);
    q(`${t}, the three parts summed by tdhBreakdown`, d.summedTdhFt);
    q(`${t}, that sum against the head from the two pressures`, d.summedLessPressureTdhFt);
    q(`${t}, net vertical lift as a share of the whole`, d.netLiftSharePct);
    q(`${t}, tubing friction as a share of the whole`, d.frictionSharePct);
    q(`${t}, the wellhead term as a share of the whole`, d.whpSharePct);
    q(`${t}, tubing friction as a pressure`, d.frictionPsi);
    q(`${t}, the identity the decomposition rests on, discharge less the tubing`, d.identityPsi);
  });
  GOLDEN_DESIGN_IDS.forEach((id) => {
    q(`golden design ${id}, total dynamic head as recorded in the golden`, goldenSizingRecorded(id).tdhFt);
  });

  // ---- Section 13: sizing the stack ---------------------------------------
  allCases().forEach((c) => {
    const s = stackSizing(c);
    const t = c.tag;
    q(`${t}, rate through the pump`, s.pumpIntakeBpd);
    q(`${t}, total dynamic head required`, s.tdhFt);
    q(`${t}, drive frequency`, s.hz);
    q(`${t}, specific gravity of the fluid in the pump`, s.sg);
    q(`${t}, equivalent rate on the 60 Hz curve`, s.qRefBpd);
    q(`${t}, head per stage`, s.headPerStageFt);
    q(`${t}, efficiency at the duty`, s.efficiency);
    q(`${t}, brake power per stage`, s.bhpPerStage);
    q(`${t}, inside the published range`, s.inRange);
    q(`${t}, region`, s.region);
    q(`${t}, stages before rounding, head required over head per stage`, s.stagesExact);
    q(`${t}, stages after rounding up`, s.stages);
    q(`${t}, the fraction of a stage that was rounded away`, s.stageRoundedAway);
    q(`${t}, head the stack makes`, s.headMadeFt);
    q(`${t}, head margin over the requirement`, s.headMarginFt);
    q(`${t}, head margin as a percentage of the requirement`, s.headMarginPct);
    q(`${t}, head margin as a fraction of one stage`, s.headMarginStages);
    q(`${t}, hydraulic power at the head required`, s.hydraulicHp);
    q(`${t}, shaft horsepower, brake power at the head REQUIRED`, s.shaftHp);
    q(`${t}, stack brake power, brake power at the head the stack MAKES`, s.stackBhpTotal);
    q(`${t}, the two powers differ by`, s.twoPowerGapHp);
    q(`${t}, and by`, s.twoPowerGapPct);
    q(`${t}, the power ratio, stack brake power over shaft horsepower`, s.powerRatio);
    q(`${t}, the head ratio, head made over head required`, s.headRatio);
    q(`${t}, THE IDENTITY, power ratio less head ratio`, s.identity);
    if (s.deratePct !== null) {
      q(`${t}, thrust derate the sizing ran at`, s.deratePct);
      q(`${t}, SELECTION load fraction at that derate`, s.selectionLoadFraction);
    }
    q(`${t}, warnings raised`, s.warningCount);
    s.warnings.forEach((w) => q(`${t}, warning ${w.code}`, w.message));
  });
  GOLDEN_DESIGN_IDS.forEach((id) => {
    const g = goldenSizingRecorded(id);
    q(`golden design ${id}, stages as recorded in the golden`, g.stages);
    q(`golden design ${id}, head made as recorded in the golden`, g.headMadeFt);
    q(`golden design ${id}, shaft horsepower as recorded in the golden`, g.shaftHp);
    q(`golden design ${id}, hydraulic horsepower as recorded in the golden`, g.hydraulicHp);
    q(`golden design ${id}, head per stage as recorded in the golden`, g.headPerStageFt);
    q(`golden design ${id}, efficiency at the duty as recorded in the golden`, g.efficiency);
    q(`golden design ${id}, brake power per stage as recorded in the golden`, g.bhpPerStage);
    q(`golden design ${id}, load fraction as recorded in the golden`, g.loadFraction);
  });
  requirementSweepRows().forEach((r) => {
    const t = `teaching well IBENO-2 requirement swept to ${r.tdhFt} ft`;
    q(`${t}, stages before rounding`, r.stagesExact);
    q(`${t}, stages after rounding up`, r.stages);
    q(`${t}, head made`, r.headMadeFt);
    q(`${t}, head margin`, r.headMarginFt);
    q(`${t}, head margin as a percentage of the requirement`, r.headMarginPct);
    q(`${t}, head margin as a fraction of one stage`, r.headMarginStages);
    q(`${t}, power ratio less head ratio`, r.identity);
  });
  twoPowerCostRows().forEach((r) => {
    q(`${r.tag}, the electrical chain is built on`, r.electricalChainBuiltOnHp);
    q(`${r.tag}, the published sizing method would take`, r.publishedMethodTakesHp);
    q(`${r.tag}, the understatement`, r.understatementHp);
    q(`${r.tag}, the understatement as a percentage`, r.understatementPct);
  });

  // ---- Section 14: the electrical chain and the seam ----------------------
  goldenElectricalRows().forEach((r) => {
    const t = `golden electrical case ${r.caseNumber}`;
    q(`${t}, shaft horsepower`, r.shaftHp);
    q(`${t}, motor nameplate power`, r.nameplateHp);
    q(`${t}, motor nameplate voltage`, r.nameplateVolts);
    q(`${t}, motor nameplate current`, r.nameplateAmps);
    q(`${t}, cable length`, r.lengthFt);
    q(`${t}, cable temperature`, r.cableTempF);
    q(`${t}, conductor resistance at 77 degF`, r.ohmsPer1000FtAt77F);
    q(`${t}, power factor`, r.powerFactor);
    q(`${t}, ELECTRICAL load fraction, shaft power over nameplate power`, r.loadFraction);
    q(`${t}, motor current`, r.amps);
    q(`${t}, estimate flagged weak below half load`, r.estimateWeakBelowHalfLoad);
    q(`${t}, conductor resistance at the cable temperature`, r.resistanceOhmsPer1000Ft);
    q(`${t}, voltage drop`, r.dropV);
    q(`${t}, voltage drop as a percentage of nameplate voltage`, r.dropPct);
    q(`${t}, voltage required at surface`, r.surfaceVolts);
    q(`${t}, apparent power at surface`, r.kva);
    q(`${t}, real power at surface`, r.kw);
    q(`${t}, power lost as heat in the cable`, r.lossKw);
    q(`${t}, cable loss as a percentage of the real power`, r.lossSharePct);
    q(`${t}, motor current as recorded in the golden`, r.goldenAmps);
    q(`${t}, voltage drop as recorded in the golden`, r.goldenDropV);
    q(`${t}, voltage drop percentage as recorded in the golden`, r.goldenDropPct);
    q(`${t}, surface voltage as recorded in the golden`, r.goldenSurfaceVolts);
    q(`${t}, apparent power as recorded in the golden`, r.goldenKva);
    q(`${t}, cable loss as recorded in the golden`, r.goldenLossKw);
  });
  q('golden electrical, largest relative deviation between the engine and the golden across both cases',
    electricalMaxDeviation());
  q('electrical, root three', ROOT_THREE);
  copperResistanceRows().forEach((r) => {
    q(`electrical, 2 AWG conductor resistance at ${r.tempF} degF`, r.ohmsPer1000Ft);
    q(`electrical, 2 AWG resistance at ${r.tempF} degF as a multiple of the 77 degF value`, r.multipleOf77F);
  });
  q('the seam, the gap between the two is the electrical load fraction times one over the derate less one, evaluated at load fraction 0.89714 and a 12 percent derate',
    SEAM_FINDING.gapPoints);
  loadFractionSeamRows().forEach((r) => {
    q(`${r.tag}, motor nameplate power`, r.nameplateHp);
    q(`${r.tag}, shaft horsepower the chain is built on`, r.shaftHp);
    q(`${r.tag}, ELECTRICAL load fraction from motorCurrent, no derate`, r.electricalLoadFraction);
    r.derates.forEach((d) => {
      const t = `${r.tag}, thrust derate ${d.deratePct} percent`;
      q(`${t}, derating factor`, d.derate);
      q(`${t}, SELECTION load fraction from sizePump`, d.selectionLoadFraction);
      q(`${t}, the gap between the two fractions`, d.gapPoints);
      q(`${t}, warning codes`, d.warningCodes.join(' ') || 'none');
    });
    q(`${r.tag}, motor input power at 0.85 motor efficiency`, r.inputKw);
  });

  // ---- Section 15: the cable, and a check that checks nothing -------------
  const pickRows = (t, pick) => {
    pick.candidates.forEach((c) => {
      q(`${t}, candidate ${c.label}, resistance at 77 degF`, c.ohmsPer1000FtAt77F);
      q(`${t}, candidate ${c.label}, motor current`, c.amps);
      q(`${t}, candidate ${c.label}, voltage drop`, c.dropV);
      q(`${t}, candidate ${c.label}, voltage drop as a percentage`, c.dropPct);
      q(`${t}, candidate ${c.label}, drop check passed`, c.dropOk);
      q(`${t}, candidate ${c.label}, ampacity check passed`, c.ampacityOk);
      q(`${t}, candidate ${c.label}, ampacity declared`, c.ampacityDeclared === null ? 'none' : c.ampacityDeclared);
      q(`${t}, candidate ${c.label}, selected as acceptable`, c.ok);
    });
    q(`${t}, cable chosen`, pick.chosenLabel === null ? 'none' : pick.chosenLabel);
    q(`${t}, maximum drop allowed`, pick.maxDropPct);
    if (pick.chosenLabel !== null) {
      q(`${t}, chosen cable, voltage drop as a percentage`, pick.dropPct);
      q(`${t}, chosen cable, voltage required at surface`, pick.surfaceVolts);
      q(`${t}, chosen cable, apparent power at surface`, pick.kva);
      q(`${t}, chosen cable, power lost as heat in the cable`, pick.lossKw);
    }
    q(`${t}, every candidate passed the ampacity check`, pick.everyCandidatePassedAmpacity);
    q(`${t}, the acceptable flag equals the drop flag on every candidate`,
      pick.acceptableEqualsDropOnEveryCandidate);
  };
  golden.electrical.forEach((_, i) => {
    pickRows(`golden electrical case ${i + 1} cable pick`, cablePick(goldenCablePickArgs(i)));
  });
  const gates = ampacityGateFixtures();
  pickRows('gate fixture 192 A on the shipped table', gates.onShippedTable);
  pickRows('gate fixture 192 A with a manufacturer ampacity column', gates.withAmpacityColumn);
  pickRows('gate fixture where nothing qualifies', gates.nothingQualifies);
  TEACHING_WELLS.forEach((W) => {
    pickRows(`teaching well ${W.id} cable pick`, cablePick(wellCablePickArgs(W)));
  });
  TEACHING_WELLS.forEach((W) => {
    surfaceAcrossCablesRows(W).forEach((r) => {
      const t = `teaching well ${W.id} on ${r.cableLabel}`;
      q(`${t}, motor current`, r.amps);
      q(`${t}, voltage drop`, r.dropV);
      q(`${t}, voltage drop as a percentage`, r.dropPct);
      q(`${t}, voltage required at surface`, r.surfaceVolts);
      q(`${t}, apparent power at surface`, r.kva);
      q(`${t}, real power at surface`, r.kw);
      q(`${t}, power lost as heat in the cable`, r.lossKw);
    });
  });

  // ---- Section 15B: the pick, made twice, on the two powers ---------------
  twoPowerPickStudies().forEach((s) => {
    const t = s.label;
    q(`${t}, motor nameplate power`, s.nameplateHp);
    q(`${t}, motor nameplate voltage`, s.nameplateVolts);
    q(`${t}, motor nameplate current`, s.nameplateAmps);
    q(`${t}, cable length`, s.lengthFt);
    q(`${t}, cable temperature`, s.cableTempF);
    q(`${t}, shaftHp, brake power at the head REQUIRED`, s.shaftHp);
    q(`${t}, stack brake power, brake power at the head the stack MAKES`, s.stackBhpTotal);
    pickRows(`${t}, pick on shaftHp`, s.onShaft);
    pickRows(`${t}, pick on stack brake power`, s.onStack);
    q(`${t}, cable chosen on shaftHp`, s.chosenOnShaft === null ? 'none' : s.chosenOnShaft);
    q(`${t}, cable chosen on stack brake power`, s.chosenOnStack === null ? 'none' : s.chosenOnStack);
    if (s.decidingDropOnShaftPct !== null) q(`${t}, deciding drop on shaftHp`, s.decidingDropOnShaftPct);
    if (s.decidingDropOnStackPct !== null) {
      q(`${t}, deciding drop on stack brake power`, s.decidingDropOnStackPct);
    }
    q(`${t}, maximum drop allowed on both runs`, s.maxDropPct);
    q(`${t}, the pick moved`, s.pickMoved);
  });

  // ---- Section 16: the diagnosis -----------------------------------------
  const df = diagnosisFixture();
  q('gate fixture diagnosis, stages', df.stages);
  q('gate fixture diagnosis, specific gravity', df.specificGravity);
  q('gate fixture diagnosis, rate', df.qBpd);
  q('gate fixture diagnosis, drive frequency', df.hz);
  q('gate fixture diagnosis, head per stage', df.headPerStageFt);
  q('gate fixture diagnosis, head the stack should make', df.headStackShouldMakeFt);
  q('gate fixture diagnosis, efficiency the curve expects', df.efficiency);
  q('gate fixture diagnosis, brake power the stack should absorb', df.bhpTotal);
  q('gate fixture diagnosis, region', df.region);
  q('gate fixture diagnosis, diagnostics gradient, 0.433 times the specific gravity',
    df.diagnosticsGradientPsiPerFt);
  diagnosisHeadRatioRows().forEach((r) => {
    const t = `gate fixture diagnosis at head ratio ${r.ratio.toFixed(4)}`;
    q(`${t}, head measured`, r.actualHeadFt);
    q(`${t}, head expected`, r.expectedHeadFt);
    q(`${t}, head ratio returned`, r.headRatio);
    q(`${t}, head ratio printed to one decimal place`, r.printedPct);
    q(`${t}, head ratio as it WOULD have printed to no decimal places`, Number(r.wouldHavePrintedPct));
    q(`${t}, flags raised`, r.flagCodes.join(' ') || 'none');
    r.messages.forEach((m) => q(`${t}, message`, m));
  });
  underCurveBandRows().forEach((r) => {
    const t = `underCurve band at head ratio ${r.ratio.toFixed(4)}`;
    q(`${t}, flag raised`, r.flagRaised);
    q(`${t}, prints now`, Number(r.printsNowPct));
    q(`${t}, printed before the fix`, Number(r.printedBeforeFixPct));
    q(`${t}, the old print equalled the threshold`, r.oldPrintEqualledThreshold);
  });
  ampsHighBandRows().forEach((r) => {
    const t = `ampsHigh band at load ${r.load.toFixed(4)}`;
    q(`${t}, motor current`, r.amps);
    q(`${t}, amps over nameplate returned`, r.ampsLoad);
    q(`${t}, flag raised`, r.flagRaised);
    q(`${t}, prints now`, Number(r.printsNowPct));
    q(`${t}, printed before the fix`, Number(r.printedBeforeFixPct));
    q(`${t}, the old print equalled the threshold`, r.oldPrintEqualledThreshold);
    r.messages.forEach((m) => q(`${t}, message`, m));
  });
  ampsLowBandRows().forEach((r) => {
    const t = `ampsLow band at load ${r.load.toFixed(4)}`;
    q(`${t}, motor current`, r.amps);
    q(`${t}, flag raised`, r.flagRaised);
    q(`${t}, prints now`, Number(r.printsNowPct));
    q(`${t}, printed before the fix`, Number(r.printedBeforeFixPct));
    q(`${t}, the old print equalled the threshold`, r.oldPrintEqualledThreshold);
    r.messages.forEach((m) => q(`${t}, message`, m));
  });
  q('the fix, thresholds changed', DIAGNOSIS_FIX.thresholdsChanged);
  q('the fix, returned fields changed', DIAGNOSIS_FIX.returnedFieldsChanged);
  q('the fix, message templates changed', DIAGNOSIS_FIX.messageTemplatesChanged);
  const dp = diagnosisFromPressures();
  q('gate fixture diagnosis from pressures, intake pressure', dp.pIntakePsia);
  q('gate fixture diagnosis from pressures, discharge pressure', dp.pDischargePsia);
  q('gate fixture diagnosis from pressures, diagnostics gradient', dp.gradientPsiPerFt);
  q('gate fixture diagnosis from pressures, head recovered', dp.recoveredHeadFt);
  q('gate fixture diagnosis from pressures, head ratio', dp.headRatio);
  q('gate fixture diagnosis from pressures, flags raised', dp.flagCodes.join(' ') || 'none');
  diagnosisRegionRows().forEach((r) => {
    const t = `gate fixture diagnosis at ${r.qBpd} bbl/d`;
    q(`${t}, duty as a multiple of the best efficiency rate`, r.qOverBep);
    q(`${t}, region`, r.region);
    q(`${t}, flags raised`, r.flagCodes.join(' ') || 'none');
    r.thrustMessages.forEach((m) => q(`${t}, message`, m));
  });

  // ---- Section 17: the stack curve ---------------------------------------
  const sc = stackCurveRows();
  q('gate fixture stack curve at 50 Hz, rate range low', sc.qLoBpd);
  q('gate fixture stack curve at 50 Hz, rate range high', sc.qHiBpd);
  q('gate fixture stack curve at 50 Hz, published range low times the speed ratio', sc.publishedLowTimesRatioBpd);
  q('gate fixture stack curve at 50 Hz, published range high times the speed ratio', sc.publishedHighTimesRatioBpd);
  sc.points.forEach((p) => {
    const t = `gate fixture stack curve at 50 Hz, point ${p.index}`;
    q(`${t}, rate`, p.qBpd);
    q(`${t}, head`, p.headFt);
    q(`${t}, efficiency`, p.efficiency);
    q(`${t}, brake power total`, p.bhpTotal);
    q(`${t}, region`, p.region);
  });

  // ---- Section 18: viscosity ---------------------------------------------
  q('viscosity, correction threshold', ESP_THRESHOLDS.viscosityCorrectionCSt);
  viscosityCheckRows().forEach((r) => {
    const t = `viscosity check at ${r.viscosityCp} cp and ${r.densityLbFt3} lbm/ft3`;
    q(`${t}, specific gravity`, r.specificGravity);
    q(`${t}, kinematic viscosity`, r.viscosityCSt);
    q(`${t}, correction required`, r.correctionRequired);
    q(`${t}, factors applied`, r.factorsApplied);
    q(`${t}, note`, r.note);
  });
  const vf = viscosityFactorRow();
  q('viscosity factors, uncorrected head per stage', vf.uncorrectedHeadFt);
  q('viscosity factors, uncorrected efficiency', vf.uncorrectedEfficiency);
  q('viscosity factors, supplied head factor', vf.headFactor);
  q('viscosity factors, supplied efficiency factor', vf.efficiencyFactor);
  q('viscosity factors, supplied rate factor', vf.rateFactor);
  q('viscosity factors, corrected head per stage', vf.correctedHeadFt);
  q('viscosity factors, corrected efficiency', vf.correctedEfficiency);
  q('viscosity factors, corrected rate', vf.correctedRateBpd);
  q('viscosity factors, with no factors supplied the reading is returned unchanged', vf.unchangedWithNoFactors);

  // ---- Section 19: every refusal in the three modules ---------------------
  const rf = refusals();
  q('refusal, fitStageCurve on two points, ok', rf.twoPointsOk);
  q('refusal, fitStageCurve on two points, message', rf.twoPointsMessage);
  q('refusal, fitStageCurve on two points, a head fit was returned', rf.twoPointsHeadFitReturned);
  q('refusal, fitStageCurve with no efficiency points, ok', rf.noEfficiencyOk);
  q('refusal, fitStageCurve with no efficiency points, warning', rf.noEfficiencyWarning);
  q('refusal, fitStageCurve with no efficiency points, best efficiency rate', rf.noEfficiencyBepQBpd);
  q('refusal, with no efficiency fit the head still reads at 2500 bbl/d', rf.noEfficiencyHeadAt2500Ft);
  q('refusal, and the brake power per stage is', rf.noEfficiencyBhpPerStage);
  q('refusal, brakeHp at zero efficiency', rf.brakeHpAtZeroEfficiency);
  q('refusal, stageCount with a head per stage of zero', rf.stageCountAtZeroHead);
  q('refusal, stageCount with a negative head per stage', rf.stageCountAtNegativeHead);
  q('refusal, totalDynamicHead with a gradient of zero', rf.tdhAtZeroGradientFt);
  q('refusal, totalDynamicHead with a gradient of zero still returns the pressure difference',
    rf.tdhAtZeroGradientDpPsi);
  q('refusal, motorCurrent with a nameplate power of zero', rf.motorCurrentAtZeroNameplateHp);
  q('refusal, motorCurrent with a nameplate current of zero', rf.motorCurrentAtZeroNameplateAmps);
  q('refusal, stagePerformance at zero frequency, head', rf.zeroFrequencyHeadFt);
  q('refusal, stagePerformance at zero frequency, region', rf.zeroFrequencyRegion);
  q('refusal, stagePerformance at zero frequency, inside the published range', rf.zeroFrequencyInRange);
  q('refusal, bepOf with no efficiency fit, rate', rf.bepWithNoEfficiencyQBpd);
  q('refusal, bepOf with no efficiency fit, head', rf.bepWithNoEfficiencyHeadFt);
  q('refusal, motorCurrent at a fifth of plate, load fraction', rf.partLoadLoadFraction);
  q('refusal, motorCurrent at a fifth of plate, current', rf.partLoadAmps);
  q('refusal, motorCurrent at a fifth of plate, estimate flagged weak', rf.partLoadEstimateWeak);

  return rows;
};

/** The teaching quantities as a Map from label to the list of values printed under it. */
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
