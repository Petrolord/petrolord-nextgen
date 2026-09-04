// Teaching lab for PD1, Nodal Analysis and Well Performance. The panels, the
// lessons and the vitest file all read this one module, so a number shown to a
// learner and a number a test pins cannot drift apart.
//
// Everything here is the vendored engine's own output. Every IPR, every tubing
// curve, every Cullender and Smith column and every crossing below is a return
// value from a call into engines/production/nodal.js. Nothing in this file
// re-implements the engine. The two OUTFLOW INSTRUMENTS are the exception that
// proves the rule: the engine's header is explicit that the oil outflow is
// INJECTED as a function because a black oil traverse belongs to whoever owns
// the PVT stack, and the goldens' own oracle defines the two instruments used
// for gating. Those two shapes are reproduced here, with their constants, and
// everything else is a call.
//
// UNITS. Field units throughout, as the engine's header states: psia (never
// psig, never gauge), stb/d for oil, Mscf/d for gas (MMscf/d only where
// cullenderSmithBhp asks for it), ft, degF, in, stb/d/psi.
//
// PURITY. Every function here is pure and deterministic. There is no random
// number anywhere in this module and nothing is memoised, so two calls with the
// same arguments return the same numbers in the same order.

import cases from '@petrolord/engines/test-data/production/goldens/nodal_cases.json';
import chokeCases from '@petrolord/engines/test-data/production/goldens/choke_cases.json';
import {
  NODAL_RANKINE_OFFSET, nodalGasZ,
  linspace, brentSolve, num,
  colebrookFrictionFactor, moodyFrictionFactor,
  vogelRatio, OIL_IPR_MODELS,
  rateAtPwf, pwfAtRate, computeIpr, futureIpr,
  backPressureIpr, litIpr, gasPwfAtRate, gasPwfAtRateExact,
  gasReynolds, csIntegrand, csFrictionGroup,
  cullenderSmithBhp, averageTzBhp, tubingCurve,
  solveNodeCore, solveOilNode, solveGasNode, operatingPointSweep,
} from '@petrolord/engines/engines/production/nodal.js';
import {
  EROSIONAL_C, erosionalC, erosionalVelocityFtS, erosionalRateBpd,
  mixtureVelocityFtS, pipeAreaFt2, erosionalCheck,
  fitGilbertCoefficients, HAMMERSCHMIDT, hydrateFormationTempF,
} from '@petrolord/engines/engines/production/chokePerformance.js';

export {
  NODAL_RANKINE_OFFSET, nodalGasZ,
  linspace, brentSolve, num,
  colebrookFrictionFactor, moodyFrictionFactor,
  vogelRatio, OIL_IPR_MODELS,
  rateAtPwf, pwfAtRate, computeIpr, futureIpr,
  backPressureIpr, litIpr, gasPwfAtRate, gasPwfAtRateExact,
  gasReynolds, csIntegrand, csFrictionGroup,
  cullenderSmithBhp, averageTzBhp, tubingCurve,
  solveNodeCore, solveOilNode, solveGasNode, operatingPointSweep,
  EROSIONAL_C, erosionalC, erosionalVelocityFtS, erosionalRateBpd,
  mixtureVelocityFtS, pipeAreaFt2, erosionalCheck,
  fitGilbertCoefficients, HAMMERSCHMIDT, hydrateFormationTempF,
};

export const GOLDEN = cases;
export const CHOKE_GOLDEN = chokeCases;

/** solveNodeCore's own documented default scan resolution. */
export const DEFAULT_NGRID = 40;
/** cullenderSmithBhp's own default step count, which IS the published method. */
export const PUBLISHED_CS_STEPS = 2;
/** tubingCurve samples from this fraction of qMax, not from zero. */
export const TUBING_CURVE_QMIN_FRACTION = 1e-3;
/** solveNodeCore scans from qMax*1e-3 to qMax*0.999. */
export const SCAN_LO_FRACTION = 1e-3;
export const SCAN_HI_FRACTION = 0.999;
/** The central difference solveNodeCore classifies stability with. */
export const STABILITY_STEP_FRACTION = 5e-3;

// ---------------------------------------------------------------------------
// NEMBE-14, the capstone well.
//
// A near saturated oil well, 3450 psia reservoir pressure against a 3100 psia
// bubble point, on continuous gas lift and tied into a high pressure gathering
// system at 1236 psia. Three things were tuned into it and all three are
// verified from the printed values rather than assumed:
//
//   1. THE COLUMN OUTWEIGHS THE RESERVOIR AT LOW RATE. At the bottom of the
//      rate range the outflow asks for about 5047 psia at the node while the
//      reservoir can only offer 3450. The well cannot start itself. The
//      residual is POSITIVE at low rate, which is the precondition for two
//      crossings and the opposite of the textbook single crossing picture.
//
//   2. THE WELL IS A DOZEN PSI FROM DEAD. The wellhead pressure is set so that
//      inflow and outflow are very nearly tangent: the stable window between
//      the left branch crossing and the operating point is under 25 stb/d wide
//      on a well whose absolute open flow is 3848 stb/d.
//
//   3. THE DEFAULT SCAN CANNOT SEE IT. solveNodeCore's default of 40 grid
//      points spreads its samples 98 stb/d apart across this well's open flow,
//      both crossings fall inside one interval, the residual never changes
//      sign on the grid, and the engine reports the well DEAD.
// ---------------------------------------------------------------------------

export const NEMBE_LABEL = 'NEMBE-14';

export const CAP = {
  // the inflow: a composite (Standing) IPR calibrated from one production test
  iprModel: 'composite',
  prPsia: 3450,
  pbPsia: 3100,
  testQStbd: 1200,
  testPwfPsia: 2790,
  iprPoints: 61,

  // two stated flowing pressures the learner reads a rate at ...
  readQAtPwfPsia: 1650,
  // ... and two stated rates the learner reads a pressure at
  readPwfAtQStbd: 2400,
  readPwfAtQDeepStbd: 3300,

  // the outflow: the gravity plus friction instrument, four constants
  pWhPsia: 1236,
  gGravPsi: 3835,
  qRefStbd: 600,
  kFricPsiPerStbd2: 0.000238,
  vlpPoints: 49,

  // the node solve
  nGrid: 900,
  nGridDefault: 40,

  // the lift gas column: Cullender and Smith on the static injection gradient
  giPtfPsia: 1225,
  giGasSg: 0.72,
  giMdFt: 8900,
  giTvdFt: 8300,
  giWhtF: 96,
  giBhtF: 214,
  giSteps: 20,

  // the friction loaded diagnostic column, aux only
  diagQMmscfd: 9.6,
  diagIdIn: 1.995,
  diagRoughnessIn: 0.0007,
  diagMuCp: 0.0138,

  // the wellhead pressure sensitivity
  sweepPwhPsia: [1176, 1206, 1236, 1248],
  sweepGradedPwhPsia: 1176,
};

// ---------------------------------------------------------------------------
// The two outflow instruments the goldens' oracle defines.
//
// The engine takes the outflow as a FUNCTION and says why in its header. These
// are the two shapes the goldens hand it. Neither is a correlation and neither
// pretends to be: the first is J shaped for the reason a real column is, a term
// that falls as the column lightens plus a term that grows as the square of
// rate, and the second is an algebraic instrument whose crossings are the roots
// of a quadratic and are therefore known without any search at all.
// ---------------------------------------------------------------------------

/**
 * bhp(q) = pWh + gGrav / (1 + q/qRef) + kFric q^2, psia.
 * The gravity term is the weight of the column, lightening as rate rises and
 * gas breaks out. The friction term is the pressure spent pushing fluid up the
 * pipe, growing as the square of rate. Their sum is the J.
 */
export const gravityFrictionOutflow = ({ pWh, gGrav, qRef, kFric }) => (q) =>
  pWh + gGrav / (1 + q / qRef) + kFric * q * q;

/**
 * bhp(q) = iprPwfAt(q) + c0 + c2 (q - q0)^2: the residual IS the parabola, so
 * the crossings are q0 +/- sqrt(-c0/c2) exactly and the solver is gated against
 * arithmetic rather than against another numerical answer.
 */
export const quadraticResidualOutflow = ({ ipr, c0, c2, q0 }) => (q) =>
  pwfAtRate(ipr, q) + c0 + c2 * (q - q0) ** 2;

/** Build whichever instrument a golden case names. */
export const instrumentOutflow = (outflow, ipr) => (outflow.form === 'gravityFriction'
  ? gravityFrictionOutflow(outflow)
  : quadraticResidualOutflow({ ipr, ...outflow }));

/** NEMBE-14's own outflow, at its own wellhead pressure or at a stated one. */
export const nembeOutflow = (pWh = CAP.pWhPsia) => gravityFrictionOutflow({
  pWh, gGrav: CAP.gGravPsi, qRef: CAP.qRefStbd, kFric: CAP.kFricPsiPerStbd2,
});

// ---------------------------------------------------------------------------
// ASSOCIATE TIER: the inflow. What the reservoir will give.
// ---------------------------------------------------------------------------

/** NEMBE-14's calibrated composite IPR. Every graded inflow value comes off this. */
export const nembeIpr = (over = {}) => computeIpr({
  model: CAP.iprModel,
  pr: CAP.prPsia,
  pb: CAP.pbPsia,
  testPoint: { q: CAP.testQStbd, pwf: CAP.testPwfPsia },
  nPoints: CAP.iprPoints,
  ...over,
});

/** The curve as an array of { q, pwf } points, sampled evenly in PRESSURE. */
export const nembeIprPoints = () => nembeIpr().curve;

/** Rebuild a golden oil IPR spec as a calibrated engine model. */
export const goldenOilModel = (spec) => computeIpr({
  model: spec.model,
  pr: spec.pr,
  pb: spec.pb,
  pi: spec.pi,
  qmax: spec.qmax,
  c: spec.c,
  n: spec.n,
  a: spec.a,
  b: spec.b,
});

/** A golden oil IPR case by id, as a calibrated model. */
export const goldenIpr = (id) => {
  const c = GOLDEN.oilIpr.find((x) => x.id === id);
  if (!c) throw new Error(`No golden oil IPR case "${id}".`);
  return goldenOilModel({ model: c.model, ...c.inputs });
};

/** The golden's own published composite case: pr 3000, pb 2000, PI 1.2. */
export const publishedCompositeIpr = () => goldenIpr('compositeStanding');
export const publishedCompositeIprPoints = () => publishedCompositeIpr().curve;

/** Forward readings: rate at each stated flowing pressure. */
export const iprForwardTable = (ipr, pressures) => pressures.map((pwfPsia) => ({
  pwfPsia,
  qStbd: rateAtPwf(ipr, pwfPsia),
  drawdownPsi: ipr.pr - pwfPsia,
  fracOfAof: rateAtPwf(ipr, pwfPsia) / ipr.qmax,
}));

/** Inverse readings: flowing pressure at each stated rate. */
export const iprInverseTable = (ipr, rates) => rates.map((qStbd) => ({
  qStbd,
  pwfPsia: pwfAtRate(ipr, qStbd),
  drawdownPsi: ipr.pr - pwfAtRate(ipr, qStbd),
  fracOfAof: qStbd / ipr.qmax,
}));

/**
 * The local slope of the inflow curve, d(pwf)/dq, psi per stb/d.
 *
 * A central difference on the ENGINE's own inverse, Richardson extrapolated so
 * the leading h^2 term cancels. Negative everywhere: the harder you pull, the
 * less pressure is left at the sandface, and the steepening of this slope below
 * the bubble point is the whole of the composite argument.
 */
export const inflowSlope = (ipr, q, hFrac = 1e-4) => {
  const h = Math.max(ipr.qmax * hFrac, 1e-9);
  const d1 = (pwfAtRate(ipr, q + h) - pwfAtRate(ipr, q - h)) / (2 * h);
  const d2 = (pwfAtRate(ipr, q + 2 * h) - pwfAtRate(ipr, q - 2 * h)) / (4 * h);
  return (4 * d1 - d2) / 3;
};

/**
 * THE ARGUMENT THE ASSOCIATE TIER IS BUILT ON, as a table rather than an
 * assertion. Three inflow models calibrated from ONE production test on
 * NEMBE-14, 1200 stb/d at 2790 psia, and read at the same pressures.
 *
 * THE PIVOT IS THE TEST POINT, NOT THE BUBBLE POINT, and that is the part
 * everybody gets wrong. All three curves pass exactly through the test, because
 * all three were calibrated on it, and they diverge on BOTH sides of it:
 *
 *   Below the test the straight line runs away. It keeps promising rate the
 *   reservoir cannot deliver, because gas coming out of solution takes the
 *   relative permeability to oil down with it, and at the open flow it offers
 *   6273 stb/d against the composite's 3848, which is 1.63 times.
 *
 *   Above the test the straight line is LOW, and for a second reason worth
 *   naming on its own: NEMBE-14's test was taken at 2790 psia, which is BELOW
 *   the 3100 psia bubble point, so the productivity index the straight line
 *   backs out of it, 1.8182 stb/d/psi, is not the well's true single phase PI
 *   of 1.8569. Fitting a straight line to a two phase test corrupts the PI
 *   itself, not only the shape of the curve.
 *
 *   Vogel bends, and below the test it tracks the composite to within about
 *   44 stb/d out of 3848. What it cannot do is the undersaturated top: it
 *   treats the whole drawdown as saturated, so it reads about 14 stb/d high at
 *   the bubble point and finishes 1 per cent low at the open flow.
 *
 * `iprModelComparisonFromUndersaturatedTest` runs the controlled version of the
 * same experiment, so a lesson can separate the two effects.
 */
export const iprModelSet = () => ({
  straightLine: computeIpr({
    model: 'pi',
    pr: CAP.prPsia,
    pb: 0,
    testPoint: { q: CAP.testQStbd, pwf: CAP.testPwfPsia },
    nPoints: CAP.iprPoints,
  }),
  vogel: computeIpr({
    model: 'vogel',
    pr: CAP.prPsia,
    testPoint: { q: CAP.testQStbd, pwf: CAP.testPwfPsia },
    nPoints: CAP.iprPoints,
  }),
  composite: nembeIpr(),
});

export const IPR_COMPARISON_PRESSURES = [3450, 3300, 3100, 2790, 2400, 1650, 1000, 500, 0];

export const iprModelComparison = (pressures = IPR_COMPARISON_PRESSURES) => {
  const set = iprModelSet();
  return pressures.map((pwfPsia) => {
    const straightLineStbd = rateAtPwf(set.straightLine, pwfPsia);
    const vogelStbd = rateAtPwf(set.vogel, pwfPsia);
    const compositeStbd = rateAtPwf(set.composite, pwfPsia);
    return {
      pwfPsia,
      belowBubblePoint: pwfPsia < CAP.pbPsia,
      straightLineStbd,
      vogelStbd,
      compositeStbd,
      straightLineMinusCompositeStbd: straightLineStbd - compositeStbd,
      straightLineOverComposite: compositeStbd > 0 ? straightLineStbd / compositeStbd : NaN,
      vogelMinusCompositeStbd: vogelStbd - compositeStbd,
    };
  });
};

/** The three absolute open flows the same one test point produces. */
export const iprModelAofs = () => {
  const set = iprModelSet();
  return {
    straightLineStbd: set.straightLine.qmax,
    vogelStbd: set.vogel.qmax,
    compositeStbd: set.composite.qmax,
    straightLineOverComposite: set.straightLine.qmax / set.composite.qmax,
    vogelOverComposite: set.vogel.qmax / set.composite.qmax,
  };
};

/**
 * THE CONTROLLED VERSION OF THE SAME EXPERIMENT. All three models calibrated
 * from a test taken ABOVE the bubble point, read off the composite curve at
 * 3300 psia so it is the same well and not a different one.
 *
 * Now the straight line and the composite carry the SAME productivity index and
 * agree exactly at every pressure above pb, and the only thing left between
 * them below pb is the SHAPE. Run this table beside `iprModelComparison` and
 * the two failures of a straight line come apart: a corrupted calibration and a
 * wrong curve are different mistakes and they do not cancel.
 */
export const UNDERSATURATED_TEST_PWF_PSIA = 3300;

export const undersaturatedTestPoint = () => ({
  pwf: UNDERSATURATED_TEST_PWF_PSIA,
  q: rateAtPwf(nembeIpr(), UNDERSATURATED_TEST_PWF_PSIA),
});

export const iprModelSetFromUndersaturatedTest = () => {
  const testPoint = undersaturatedTestPoint();
  return {
    straightLine: computeIpr({
      model: 'pi', pr: CAP.prPsia, pb: 0, testPoint, nPoints: CAP.iprPoints,
    }),
    vogel: computeIpr({
      model: 'vogel', pr: CAP.prPsia, testPoint, nPoints: CAP.iprPoints,
    }),
    composite: computeIpr({
      model: 'composite', pr: CAP.prPsia, pb: CAP.pbPsia, testPoint, nPoints: CAP.iprPoints,
    }),
  };
};

export const iprModelComparisonFromUndersaturatedTest = (pressures = IPR_COMPARISON_PRESSURES) => {
  const set = iprModelSetFromUndersaturatedTest();
  return pressures.map((pwfPsia) => {
    const straightLineStbd = rateAtPwf(set.straightLine, pwfPsia);
    const vogelStbd = rateAtPwf(set.vogel, pwfPsia);
    const compositeStbd = rateAtPwf(set.composite, pwfPsia);
    return {
      pwfPsia,
      belowBubblePoint: pwfPsia < CAP.pbPsia,
      straightLineStbd,
      vogelStbd,
      compositeStbd,
      straightLineMinusCompositeStbd: straightLineStbd - compositeStbd,
      vogelMinusCompositeStbd: vogelStbd - compositeStbd,
    };
  });
};

/** The productivity index each calibration produces, and the one that is right. */
export const iprModelPis = () => {
  const fromTwoPhase = iprModelSet();
  const fromSinglePhase = iprModelSetFromUndersaturatedTest();
  return {
    truePiStbdPerPsi: fromTwoPhase.composite.pi,
    straightLineFromTwoPhaseTestStbdPerPsi: fromTwoPhase.straightLine.pi,
    straightLineFromSinglePhaseTestStbdPerPsi: fromSinglePhase.straightLine.pi,
    compositeFromSinglePhaseTestStbdPerPsi: fromSinglePhase.composite.pi,
    piErrorFromTwoPhaseTestStbdPerPsi:
      fromTwoPhase.straightLine.pi - fromTwoPhase.composite.pi,
    piErrorFraction:
      (fromTwoPhase.straightLine.pi - fromTwoPhase.composite.pi) / fromTwoPhase.composite.pi,
  };
};

export const NEMBE_FORWARD_PRESSURES = [3450, 3100, 2790, 2400, 1650, 1000, 500, 0];
export const NEMBE_INVERSE_RATES = [200, 650, 1200, 1800, 2400, 3000, 3300, 3600];

/**
 * Every inflow reading the course quotes on NEMBE-14, including the four graded
 * ones: the productivity index, the rate at the bubble point, the rate at
 * 1650 psia, the absolute open flow, and the pressures at 2400 and 3300 stb/d.
 */
export const nembeInflowReadings = () => {
  const ipr = nembeIpr();
  return {
    model: ipr.model,
    prPsia: ipr.pr,
    pbPsia: ipr.pb,
    piStbdPerPsi: ipr.pi,
    aofStbd: ipr.qmax,
    testQStbd: CAP.testQStbd,
    testPwfPsia: CAP.testPwfPsia,
    testDrawdownPsi: CAP.prPsia - CAP.testPwfPsia,
    qAtBubblePointStbd: rateAtPwf(ipr, CAP.pbPsia),
    qAtReadPressureStbd: rateAtPwf(ipr, CAP.readQAtPwfPsia),
    readPressurePsia: CAP.readQAtPwfPsia,
    pwfAtReadRatePsia: pwfAtRate(ipr, CAP.readPwfAtQStbd),
    readRateStbd: CAP.readPwfAtQStbd,
    pwfAtDeepRatePsia: pwfAtRate(ipr, CAP.readPwfAtQDeepStbd),
    deepRateStbd: CAP.readPwfAtQDeepStbd,
    // the undersaturated half of the composite: PI times the drawdown to pb
    qAtBubbleFromPiStbd: ipr.pi * (ipr.pr - ipr.pb),
    // and the saturated half: the Vogel block below pb
    vogelBlockStbd: (ipr.pi * ipr.pb) / 1.8,
    saturatedShareOfAof: ((ipr.pi * ipr.pb) / 1.8) / ipr.qmax,
    warnings: ipr.warnings,
    forward: iprForwardTable(ipr, NEMBE_FORWARD_PRESSURES),
    inverse: iprInverseTable(ipr, NEMBE_INVERSE_RATES),
    curveRows: ipr.curve.length,
  };
};

/** Inflow slope at a spread of rates, so the steepening below pb is a table. */
export const nembeInflowSlopes = (rates = NEMBE_INVERSE_RATES) => {
  const ipr = nembeIpr();
  return rates.map((qStbd) => ({
    qStbd,
    pwfPsia: pwfAtRate(ipr, qStbd),
    dpwfdqPsiPerStbd: inflowSlope(ipr, qStbd),
    belowBubblePoint: pwfAtRate(ipr, qStbd) < ipr.pb,
    straightLineSlopePsiPerStbd: -1 / ipr.pi,
  }));
};

/** Every golden oil IPR case, reproduced through the engine. */
export const goldenOilIprCases = () => GOLDEN.oilIpr.map((c) => {
  const m = goldenOilModel({ model: c.model, ...c.inputs });
  return {
    id: c.id,
    model: m.model,
    inputs: c.inputs,
    aofStbd: m.qmax,
    curveRows: m.curve.length,
    forward: c.forward.map((r) => ({ pwfPsia: r.pwf, qStbd: rateAtPwf(m, r.pwf), goldenQStbd: r.q })),
    inverse: c.inverse.map((r) => ({ qStbd: r.q, pwfPsia: pwfAtRate(m, r.q), goldenPwfPsia: r.pwf })),
    slopes: c.dpwfdq.map((r) => ({
      qStbd: r.q,
      dpwfdqPsiPerStbd: inflowSlope(m, r.q),
      goldenDpwfdqPsiPerStbd: r.dpwfdq,
    })),
  };
});

/** Every golden calibration case: one production test pins one curve. */
export const goldenCalibrationCases = () => GOLDEN.iprCalibration.map((c) => {
  const m = computeIpr({
    model: c.model,
    pr: c.inputs.pr,
    pb: c.inputs.pb,
    n: c.inputs.n,
    testPoint: { q: c.inputs.testQ, pwf: c.inputs.testPwf },
  });
  return {
    id: c.id,
    model: c.model,
    inputs: c.inputs,
    piStbdPerPsi: m.pi,
    fetkovichC: m.c,
    aofStbd: m.qmax,
    qAtTestPwfStbd: rateAtPwf(m, c.inputs.testPwf),
    golden: { pi: c.pi, c: c.c, qmax: c.qmax, qAtTestPwf: c.qAtTestPwf },
  };
});

/** Depletion: each family shifted to a future reservoir pressure by its own rule. */
export const goldenFutureIprCases = () => GOLDEN.futureIpr.map((c) => {
  const base = GOLDEN.oilIpr.find((x) => x.model === c.model);
  const f = futureIpr(goldenOilModel({ model: c.model, ...base.inputs }), { prFuture: c.prFuture });
  return {
    id: c.id,
    model: c.model,
    prPsia: c.pr,
    prFuturePsia: c.prFuture,
    aofStbd: f.qmax,
    pwfAtHalfAofPsia: pwfAtRate(f, 0.5 * f.qmax),
    golden: { qmax: c.qmax, pwfAtHalfQmax: c.pwfAtHalfQmax },
  };
});

/**
 * Gas deliverability, both empirical families, with the SAMPLED reading beside
 * the exact one. The chord reading is biased LOW on both families because the
 * curve is sampled evenly in pressure and is therefore sparse in rate exactly
 * where it is steepest. This is engine defect (a) as the golden records it, and
 * it does not touch NEMBE-14, whose oil inverse is a Brent root find on the
 * forward relation with no chord to be biased.
 */
export const goldenGasIprCases = () => GOLDEN.gasIpr.map((c) => {
  const m = c.model === 'backPressure' ? backPressureIpr(c.inputs) : litIpr(c.inputs);
  return {
    id: c.id,
    model: c.model,
    inputs: c.inputs,
    aofMscfd: m.aof,
    forward: c.forward.map((r) => ({ pwfPsia: r.pwf, qMscfd: m.qAt(r.pwf), goldenQMscfd: r.q })),
    inverse: c.inverse.map((r) => ({ qMscfd: r.q, pwfPsia: gasPwfAtRateExact(m, r.q), goldenPwfPsia: r.pwf })),
    chord40: c.chord40.map((r) => ({
      qMscfd: r.q,
      chordPwfPsia: gasPwfAtRate(m, r.q),
      exactPwfPsia: gasPwfAtRateExact(m, r.q),
      biasPsi: gasPwfAtRate(m, r.q) - gasPwfAtRateExact(m, r.q),
      goldenChordPwfPsia: r.pwf,
      goldenBiasPsi: r.biasPsi,
    })),
  };
});

// ---------------------------------------------------------------------------
// PROFESSIONAL TIER: the outflow. What the tubing will take.
// ---------------------------------------------------------------------------

/** NEMBE-14's tubing curve, sampled the way the capstone samples it. */
export const nembeTubingCurve = ({ pWh = CAP.pWhPsia, nPoints = CAP.vlpPoints } = {}) =>
  tubingCurve({ bhpAt: nembeOutflow(pWh), qMax: nembeIpr().qmax, nPoints });

/**
 * The same curve resolved 400 times finer. The MINIMUM is a REDUCTION over the
 * sampled rows and moves with the sampling, which is why the engine gates it as
 * its own value and why the course prints both.
 */
export const nembeTubingCurveFine = ({ pWh = CAP.pWhPsia, nPoints = 20001 } = {}) =>
  tubingCurve({ bhpAt: nembeOutflow(pWh), qMax: nembeIpr().qmax, nPoints });

/**
 * THE J, TAKEN APART. The same curve with its two limbs separated: the
 * wellhead pressure the column has to lift against, the GRAVITY term
 * gGrav/(1 + q/qRef) which falls as the column lightens, and the FRICTION term
 * kFric q^2 which grows as the square of rate. Their sum is the bhp the tubing
 * demands. Left of the minimum gravity is winning and the well is loading up;
 * right of it friction is winning and the well is stable.
 */
export const tubingDecomposition = (rates) => {
  const qs = rates || nembeTubingCurve().curve.map((p) => p.q);
  const { pWhPsia, gGravPsi, qRefStbd, kFricPsiPerStbd2 } = CAP;
  return qs.map((qStbd) => {
    const gravityPsi = gGravPsi / (1 + qStbd / qRefStbd);
    const frictionPsi = kFricPsiPerStbd2 * qStbd * qStbd;
    const bhpPsia = pWhPsia + gravityPsi + frictionPsi;
    return {
      qStbd,
      wellheadPsia: pWhPsia,
      gravityPsi,
      frictionPsi,
      bhpPsia,
      gravityShare: gravityPsi / (gravityPsi + frictionPsi),
      frictionShare: frictionPsi / (gravityPsi + frictionPsi),
      frictionExceedsGravity: frictionPsi > gravityPsi,
    };
  });
};

/**
 * The rate at which the friction term overtakes the gravity term, found by a
 * Brent root find on the ENGINE's own solver rather than by algebra. It is NOT
 * the same rate as the minimum of the curve, and the gap between the two is the
 * point: the minimum is where the SLOPES balance, this is where the TERMS do.
 */
export const tubingLimbCrossover = () => {
  const { gGravPsi, qRefStbd, kFricPsiPerStbd2 } = CAP;
  const qMax = nembeIpr().qmax;
  const gap = (q) => kFricPsiPerStbd2 * q * q - gGravPsi / (1 + q / qRefStbd);
  const solved = brentSolve(gap, qMax * 1e-6, qMax, { tol: 1e-9 });
  const out = nembeOutflow();
  return {
    qStbd: solved.root,
    converged: solved.converged,
    bhpPsia: out(solved.root),
    gravityPsi: gGravPsi / (1 + solved.root / qRefStbd),
    frictionPsi: kFricPsiPerStbd2 * solved.root * solved.root,
    tubingMinimumQStbd: nembeTubingCurveFine().minimum.q,
  };
};

/** The dead column: what the tubing asks for at zero rate, all gravity. */
export const deadColumnPsia = () => CAP.pWhPsia + CAP.gGravPsi;

/** Every number the course quotes off NEMBE-14's tubing curve. */
export const nembeOutflowReadings = () => {
  const sampled = nembeTubingCurve();
  const fine = nembeTubingCurveFine();
  const loadedEnd = sampled.curve[0];
  const frictionEnd = sampled.curve[sampled.curve.length - 1];
  return {
    nPoints: CAP.vlpPoints,
    qMaxStbd: nembeIpr().qmax,
    wellheadPsia: CAP.pWhPsia,
    gGravPsi: CAP.gGravPsi,
    qRefStbd: CAP.qRefStbd,
    kFricPsiPerStbd2: CAP.kFricPsiPerStbd2,
    deadColumnPsia: deadColumnPsia(),
    sampledMinimumQStbd: sampled.minimum.q,
    sampledMinimumBhpPsia: sampled.minimum.bhp,
    trueMinimumQStbd: fine.minimum.q,
    trueMinimumBhpPsia: fine.minimum.bhp,
    sampledMinusTrueQStbd: sampled.minimum.q - fine.minimum.q,
    sampledMinusTrueBhpPsi: sampled.minimum.bhp - fine.minimum.bhp,
    loadedEndQStbd: loadedEnd.q,
    loadedEndBhpPsia: loadedEnd.bhp,
    frictionEndQStbd: frictionEnd.q,
    frictionEndBhpPsia: frictionEnd.bhp,
    reservoirPressurePsia: CAP.prPsia,
    loadedEndAbovePrPsi: loadedEnd.bhp - CAP.prPsia,
    frictionEndAbovePrPsi: frictionEnd.bhp - CAP.prPsia,
  };
};

/**
 * WHAT MOVES THE BOTTOM OF THE J, one lever at a time, each read off the
 * engine's own reduction over a 20001 point curve.
 *
 * READ THE RATE COLUMN, NOT ONLY THE PRESSURE ONE. Wellhead pressure shifts the
 * whole curve vertically and moves the minimum's PRESSURE one for one while
 * leaving its RATE exactly where it was, because pWh drops out of the
 * derivative. qRef and kFric move both. That asymmetry is why choking a well
 * back does not change the rate at which it loads up, it changes how much
 * pressure the reservoir needs to hold it there.
 *
 * AND THE LIGHTENING CONSTANT IS NOT MONOTONE IN RATE. More friction always
 * pulls the bottom of the J in to a lower rate and lifts it, so kFric is
 * monotone in both columns. qRef is not: the minimum rate climbs with qRef to
 * an interior maximum near 1200 to 1400 stb/d and then falls away again, while
 * the minimum PRESSURE keeps climbing throughout. A column that lightens very
 * fast and a column that barely lightens at all both load up at a low rate, for
 * opposite reasons, and only the pressure column tells them apart.
 */
export const tubingMinimumSensitivity = ({
  pWhList = [1000, 1100, 1176, 1236, 1300, 1400],
  qRefList = [300, 450, 600, 800, 1200, 2000],
  kFricList = [0.0001, 0.00015, 0.000238, 0.0004, 0.0008],
  nPoints = 20001,
} = {}) => {
  const qMax = nembeIpr().qmax;
  const at = (over) => {
    const shape = {
      pWh: CAP.pWhPsia,
      gGrav: CAP.gGravPsi,
      qRef: CAP.qRefStbd,
      kFric: CAP.kFricPsiPerStbd2,
      ...over,
    };
    const t = tubingCurve({ bhpAt: gravityFrictionOutflow(shape), qMax, nPoints });
    return { minQStbd: t.minimum.q, minBhpPsia: t.minimum.bhp };
  };
  const base = at({});
  const row = (key, unitKey) => (value) => {
    const r = at({ [key]: value });
    return {
      [unitKey]: value,
      minQStbd: r.minQStbd,
      minBhpPsia: r.minBhpPsia,
      dMinQStbd: r.minQStbd - base.minQStbd,
      dMinBhpPsi: r.minBhpPsia - base.minBhpPsia,
    };
  };
  return {
    baseMinQStbd: base.minQStbd,
    baseMinBhpPsia: base.minBhpPsia,
    wellheadPressure: pWhList.map(row('pWh', 'pWhPsia')),
    lighteningConstant: qRefList.map(row('qRef', 'qRefStbd')),
    frictionConstant: kFricList.map(row('kFric', 'kFricPsiPerStbd2')),
  };
};

// --------------------------- the lift gas column ---------------------------

/** The static injection gas column's inputs, minus the step count. */
export const liftGasTubing = () => ({
  ptf: CAP.giPtfPsia,
  gasSg: CAP.giGasSg,
  mdFt: CAP.giMdFt,
  tvdFt: CAP.giTvdFt,
  whtF: CAP.giWhtF,
  bhtF: CAP.giBhtF,
});

/** The friction loaded diagnostic column: the same string, carrying gas at rate. */
export const diagnosticTubing = () => ({
  ...liftGasTubing(),
  qMmscfd: CAP.diagQMmscfd,
  idIn: CAP.diagIdIn,
  roughnessIn: CAP.diagRoughnessIn,
  muCp: CAP.diagMuCp,
});

export const liftGasColumn = (steps = CAP.giSteps) =>
  cullenderSmithBhp({ ...liftGasTubing(), steps });

export const diagnosticColumn = (steps = PUBLISHED_CS_STEPS) =>
  cullenderSmithBhp({ ...diagnosticTubing(), steps });

export const CS_STEP_LIST = [2, 4, 8, 20, 64, 256];

/**
 * TRUNCATION AS A CONVERGING TABLE, NOT AS AN ASSERTION.
 *
 * cullenderSmithBhp defaults to 2 sub-intervals, which IS the published two
 * station method: one midpoint station, two trapezoid halves, one Simpson pass.
 * The construction rests on the integrand I(p) being close to linear over the
 * whole column, which holds for a static or gently flowing gas well and stops
 * holding once the friction group F^2 becomes comparable to the gravity term.
 * The engine's own header states the direction and the size: the two station
 * answer runs LOW and the error falls roughly with the square of the step
 * count. This marches the same column at 2, 4, 8, 20, 64 and 256 and prints the
 * gap against the 256 step answer, which is the converged integral.
 */
export const cullenderSmithStepStudy = (tubing, stepList = CS_STEP_LIST) => {
  const converged = cullenderSmithBhp({ ...tubing, steps: 256 });
  return stepList.map((steps) => {
    const r = cullenderSmithBhp({ ...tubing, steps });
    return {
      requestedSteps: steps,
      actualSteps: r.steps,
      pwfPsia: r.pwf,
      pmfPsia: r.pmf,
      converged: r.converged,
      errorVsConvergedPsi: r.pwf - converged.pwf,
      convergedPwfPsia: converged.pwf,
    };
  });
};

/** The graded lift gas column, marched at every step count in the study. */
export const liftGasStepStudy = (stepList = CS_STEP_LIST) =>
  cullenderSmithStepStudy(liftGasTubing(), stepList);

/** The friction loaded column, where the truncation actually bites. */
export const diagnosticStepStudy = (stepList = CS_STEP_LIST) =>
  cullenderSmithStepStudy(diagnosticTubing(), stepList);

/**
 * The two columns side by side at each step count. A GRAVITY only column is
 * nearly free of the truncation, a fraction of a psi at two stations; the same
 * string carrying 9.6 MMscf/d is not. Same method, same well, two verdicts, and
 * the difference is entirely the friction group.
 */
export const columnTruncationTable = (stepList = CS_STEP_LIST) => {
  const gravity = liftGasStepStudy(stepList);
  const friction = diagnosticStepStudy(stepList);
  return stepList.map((steps, i) => ({
    steps,
    gravityOnlyPwfPsia: gravity[i].pwfPsia,
    gravityOnlyErrorPsi: gravity[i].errorVsConvergedPsi,
    frictionLoadedPwfPsia: friction[i].pwfPsia,
    frictionLoadedErrorPsi: friction[i].errorVsConvergedPsi,
    errorRatio: gravity[i].errorVsConvergedPsi === 0
      ? NaN
      : friction[i].errorVsConvergedPsi / gravity[i].errorVsConvergedPsi,
  }));
};

/** The friction group and the Reynolds number that make the diagnostic bite. */
export const diagnosticFrictionGroup = () => {
  const re = gasReynolds(CAP.diagQMmscfd, CAP.giGasSg, CAP.diagMuCp, CAP.diagIdIn);
  const fMoody = moodyFrictionFactor(re, CAP.diagRoughnessIn / CAP.diagIdIn);
  return {
    qMmscfd: CAP.diagQMmscfd,
    idIn: CAP.diagIdIn,
    roughnessIn: CAP.diagRoughnessIn,
    relativeRoughness: CAP.diagRoughnessIn / CAP.diagIdIn,
    muCp: CAP.diagMuCp,
    reynolds: re,
    fMoody,
    f2: csFrictionGroup({ qMmscfd: CAP.diagQMmscfd, fMoody, idIn: CAP.diagIdIn }),
  };
};

/**
 * The same column by the closed form cousin, Katz average temperature and z
 * (Guo and Ghalambor Eq. 4.54). A second opinion reached by a different road:
 * one average z over the whole column against a marched integral.
 */
export const liftGasVsAverageTz = (steps = CAP.giSteps) => {
  const t = liftGasTubing();
  const cs = cullenderSmithBhp({ ...t, steps });
  const csConverged = cullenderSmithBhp({ ...t, steps: 256 });
  const az = averageTzBhp({ ...t });
  return {
    cullenderSmithPwfPsia: cs.pwf,
    cullenderSmithPmfPsia: cs.pmf,
    cullenderSmithSteps: cs.steps,
    cullenderSmithConverged: cs.converged,
    convergedPwfPsia: csConverged.pwf,
    averageTzPwfPsia: az.pwf,
    averageTzZbar: az.zBar,
    averageTzConverged: az.converged,
    cullenderMinusAverageTzPsi: cs.pwf - az.pwf,
    convergedMinusAverageTzPsi: csConverged.pwf - az.pwf,
    zAtWellheadConditions: nodalGasZ({ pPsia: CAP.giPtfPsia, tF: CAP.giWhtF, gasSg: CAP.giGasSg }),
    zAtBottomholeConditions: nodalGasZ({ pPsia: cs.pwf, tF: CAP.giBhtF, gasSg: CAP.giGasSg }),
    injectionGradientPsiPerFt: (cs.pwf - CAP.giPtfPsia) / CAP.giTvdFt,
  };
};

/**
 * THE DEFINING EQUATION THE ANSWER HAS TO SATISFY, not another implementation
 * of the same method.
 *
 * Cullender and Smith is the statement that
 *
 *     integral from ptf to pwf of I(p) dp = 18.75 gammaG L
 *
 * with L the measured depth. Temperature is tied to depth and depth to
 * pressure, so this marches down the hole in equal depth steps, takes the
 * pressure increment from the relation itself and accumulates the integral by
 * the trapezoid over p with T at the matching depth. It returns what the
 * integral came to and what it was supposed to come to. This is a CLOSURE test:
 * it uses the engine's own integrand and z factor and nothing else.
 */
export const definingIntegralMarch = ({
  ptf, gasSg, mdFt, tvdFt = mdFt, whtF, bhtF,
  qMmscfd = 0, idIn = 2.441, roughnessIn = 0.0006, muCp = 0.012, fMoody,
  n = 1000,
}) => {
  const elevRatio = tvdFt / mdFt;
  let f2 = 0;
  let fUsed = 0;
  if (qMmscfd > 0) {
    fUsed = fMoody ?? moodyFrictionFactor(gasReynolds(qMmscfd, gasSg, muCp, idIn), roughnessIn / idIn);
    f2 = csFrictionGroup({ qMmscfd, fMoody: fUsed, idIn });
  }
  const rhs = 18.75 * gasSg;
  const h = mdFt / n;
  const tempAt = (lengthFt) => whtF + ((bhtF - whtF) * lengthFt) / mdFt;
  const iAt = (lengthFt, pPsia) => {
    const tF = tempAt(lengthFt);
    return csIntegrand({
      pPsia, tR: tF + NODAL_RANKINE_OFFSET, z: nodalGasZ({ pPsia, tF, gasSg }), elevRatio, f2,
    });
  };
  let p = ptf;
  let total = 0;
  for (let k = 0; k < n; k += 1) {
    const lengthFt = k * h;
    const i1 = iAt(lengthFt, p);
    const p2 = p + (h * rhs) / i1;
    const i2 = iAt(lengthFt + h, p2);
    total += 0.5 * (i1 + i2) * (p2 - p);
    p = p2;
  }
  return {
    integral: total,
    target: 18.75 * gasSg * mdFt,
    pwfPsia: p,
    fMoodyUsed: fUsed,
    frictionGroupF2: f2,
    closureError: total - 18.75 * gasSg * mdFt,
    steps: n,
  };
};

/** Every golden dry gas column, reproduced through the engine. */
export const goldenTubingCases = () => GOLDEN.tubing.map((c) => {
  const i = c.inputs;
  const fine = cullenderSmithBhp({ ...i, steps: 256, tolPsi: 1e-9 });
  const published = cullenderSmithBhp({ ...i });
  const az = averageTzBhp({ ...i, qMscfd: i.qMmscfd * 1000 });
  return {
    id: c.id,
    inputs: i,
    reynolds: i.qMmscfd > 0 ? gasReynolds(i.qMmscfd, i.gasSg, i.muCp, i.idIn) : 0,
    frictionGroupF2: i.qMmscfd > 0
      ? csFrictionGroup({ qMmscfd: i.qMmscfd, fMoody: c.fMoodyUsed, idIn: i.idIn })
      : 0,
    convergedPwfPsia: fine.pwf,
    convergedPmfPsia: fine.pmf,
    publishedTwoStationPwfPsia: published.pwf,
    twoStationErrorPsi: published.pwf - fine.pwf,
    averageTzPwfPsia: az.pwf,
    definingIntegral: definingIntegralMarch({ ...i, fMoody: c.fMoodyUsed || undefined }),
    golden: {
      pwfPsia: c.pwfPsia,
      pmfPsia: c.pmfPsia,
      avgTzPwfPsia: c.avgTzPwfPsia,
      reynolds: c.reynolds,
      frictionGroupF2: c.frictionGroupF2,
      fMoodyUsed: c.fMoodyUsed,
      definingIntegral: c.definingIntegral,
      definingIntegralTarget: c.definingIntegralTarget,
    },
  };
});

/**
 * The golden's own sampled outflow curve: a DRY GAS column against rate.
 *
 * Nothing in Cullender and Smith lightens with rate, so this outflow rises
 * monotonically and its "minimum" is simply the lowest sampled rate. That is
 * the control case for NEMBE-14's J: the bend is not a property of tubing, it
 * is a property of a column that carries liquid.
 */
export const goldenTubingCurveCase = () => {
  const t = GOLDEN.tubingCurve;
  const r = tubingCurve({
    bhpAt: (q) => cullenderSmithBhp({ ...t.tubing, qMmscfd: q / 1000, steps: 256, tolPsi: 1e-9 }).pwf,
    qMax: t.qMax,
    nPoints: t.nPoints,
  });
  return {
    curve: r.curve,
    minimum: r.minimum,
    minimumIsLowestSampledRate: r.minimum.q === r.curve[0].q,
    golden: t,
  };
};

// ---------------------------------------------------------------------------
// EXPERT TIER: the node. Where the two meet, and whether it holds.
// ---------------------------------------------------------------------------

/** NEMBE-14 solved at a stated scan resolution and a stated wellhead pressure. */
export const nembeNode = ({ nGrid = CAP.nGrid, pWh = CAP.pWhPsia } = {}) =>
  solveOilNode({ ipr: nembeIpr(), vlpBhpAt: nembeOutflow(pWh), nGrid });

/**
 * BOTH crossings, with the engine's own stability flag and the branch each one
 * sits on. The left crossing is the heading branch: there a rate perturbation
 * runs away, because the outflow requirement falls faster with rate than the
 * inflow does. The right one is the well that stays put. A learner who
 * classifies them the wrong way round swaps every graded node value.
 */
export const nembeCrossings = ({ nGrid = CAP.nGrid, pWh = CAP.pWhPsia } = {}) => {
  const node = nembeNode({ nGrid, pWh });
  return node.intersections.map((x, i) => ({
    index: i,
    qStbd: x.q,
    pwfPsia: x.pwf,
    stable: x.stable,
    branch: x.stable ? 'right (stable)' : 'left (heading)',
    isOperatingPoint: !!node.op && x.q === node.op.q,
  }));
};

/**
 * THE RESIDUAL, SAMPLED FINELY. g(q) = outflow(q) - inflow(q), psi. It is
 * POSITIVE at low rate on this well, which is the precondition for two
 * crossings and the opposite of the textbook single crossing picture: it dips
 * through zero, comes back up through zero, and the two zeros are the two
 * crossings. Plot this and the double crossing is a curve that touches zero
 * twice rather than a claim.
 */
export const nembeResidualSweep = ({ nPoints = 1201, pWh = CAP.pWhPsia } = {}) => {
  const ipr = nembeIpr();
  const out = nembeOutflow(pWh);
  const qMax = ipr.qmax;
  return linspace(qMax * SCAN_LO_FRACTION, qMax * SCAN_HI_FRACTION, nPoints).map((qStbd) => {
    const vlpBhpPsia = out(qStbd);
    const iprPwfPsia = pwfAtRate(ipr, qStbd);
    return { qStbd, vlpBhpPsia, iprPwfPsia, residualPsi: vlpBhpPsia - iprPwfPsia };
  });
};

/** The residual at one rate, which is what the solver is finding the zeros of. */
export const nembeResidualAt = (qStbd, pWh = CAP.pWhPsia) =>
  nembeOutflow(pWh)(qStbd) - pwfAtRate(nembeIpr(), qStbd);

/** Where the residual bottoms out, and how far below zero it gets. */
export const nembeResidualMinimum = ({ nPoints = 20001, pWh = CAP.pWhPsia } = {}) => {
  const rows = nembeResidualSweep({ nPoints, pWh });
  let best = rows[0];
  rows.forEach((r) => { if (r.residualPsi < best.residualPsi) best = r; });
  return {
    qStbd: best.qStbd,
    residualPsi: best.residualPsi,
    iprPwfPsia: best.iprPwfPsia,
    vlpBhpPsia: best.vlpBhpPsia,
    residualAtLowestSampledRatePsi: rows[0].residualPsi,
    lowestSampledRateStbd: rows[0].qStbd,
    residualAtHighestSampledRatePsi: rows[rows.length - 1].residualPsi,
    highestSampledRateStbd: rows[rows.length - 1].qStbd,
    signChanges: rows.reduce((n, r, i) => (
      i > 0 && Math.sign(r.residualPsi) !== Math.sign(rows[i - 1].residualPsi) ? n + 1 : n), 0),
  };
};

export const SCAN_GRIDS = [40, 60, 100, 200, 400, 900, 4000];

/** The spacing of solveNodeCore's scan, in stb/d, at a stated grid count. */
export const scanSpacingStbd = (nGrid, qMax = nembeIpr().qmax) =>
  (qMax * SCAN_HI_FRACTION - qMax * SCAN_LO_FRACTION) / (Math.max(2, nGrid) - 1);

/**
 * THE CENTRE OF THE EXPERT TIER. The same well, the same curves, the same
 * engine, solved at seven scan resolutions.
 *
 * solveNodeCore finds crossings by scanning a grid and looking for a SIGN
 * CHANGE in the residual between neighbouring samples. NEMBE-14's two crossings
 * are under 25 stb/d apart against an open flow of 3848, so at the documented
 * default of 40 points the samples are 98 stb/d apart, both crossings fall
 * inside one interval, the residual never changes sign on the grid, and the
 * engine reports the well DEAD. It is not a wrong number, it is a wrong
 * VERDICT, and it is reported with no warning attached because from the
 * scanner's point of view nothing went wrong.
 *
 * AND IT IS NOT MONOTONE IN RESOLUTION, WHICH IS THE PART THAT CATCHES PEOPLE.
 * A sign change scan sees the dip only if one of its intervals straddles it, so
 * whether the well is found depends on where the samples LAND and not only on
 * how many of them there are. On NEMBE-14 the engine reports the well dead at
 * nGrid 40 and again at nGrid 100, while nGrid 60 finds both crossings. Raising
 * the resolution is not a monotone improvement in the verdict, and no single
 * grid count can be trusted on a well this close to tangency: the check is the
 * residual, not the scan.
 */
export const scanResolutionStudy = (grids = SCAN_GRIDS, { pWh = CAP.pWhPsia } = {}) => {
  const qMax = nembeIpr().qmax;
  return grids.map((nGrid) => {
    const s = nembeNode({ nGrid, pWh });
    return {
      nGrid,
      spacingStbd: scanSpacingStbd(nGrid, qMax),
      status: s.status,
      crossings: s.intersections.length,
      opQStbd: s.op ? s.op.q : null,
      opPwfPsia: s.op ? s.op.pwf : null,
      unstableQStbd: s.intersections.length > 1 ? s.intersections[0].q : null,
      unstablePwfPsia: s.intersections.length > 1 ? s.intersections[0].pwf : null,
      windowStbd: s.intersections.length > 1 ? s.intersections[1].q - s.intersections[0].q : null,
      resolvesTheWindow: s.status === 'flowing' && s.intersections.length === 2,
    };
  });
};

/**
 * THE STABLE WINDOW, which is what the well actually has to live inside. Under
 * 25 stb/d wide against an absolute open flow of 3848, and the operating point
 * sits under 100 psi above the bottom of its own tubing curve.
 */
export const nembeStableWindow = ({ nGrid = CAP.nGrid, pWh = CAP.pWhPsia } = {}) => {
  const node = nembeNode({ nGrid, pWh });
  const ipr = nembeIpr();
  const fine = nembeTubingCurveFine({ pWh });
  if (!node.op || node.intersections.length < 2) {
    return {
      status: node.status, crossings: node.intersections.length, widthStbd: null, aofStbd: ipr.qmax,
    };
  }
  const unstable = node.intersections[0];
  return {
    status: node.status,
    crossings: node.intersections.length,
    unstableQStbd: unstable.q,
    unstablePwfPsia: unstable.pwf,
    opQStbd: node.op.q,
    opPwfPsia: node.op.pwf,
    widthStbd: node.op.q - unstable.q,
    pressureSpanPsi: unstable.pwf - node.op.pwf,
    aofStbd: ipr.qmax,
    widthAsFractionOfAof: (node.op.q - unstable.q) / ipr.qmax,
    opAsFractionOfAof: node.op.q / ipr.qmax,
    drawdownAtOpPsi: ipr.pr - node.op.pwf,
    tubingMinimumQStbd: fine.minimum.q,
    tubingMinimumBhpPsia: fine.minimum.bhp,
    opAboveTubingMinimumPsi: node.op.pwf - fine.minimum.bhp,
    opLeftOfTubingMinimumStbd: fine.minimum.q - node.op.q,
    residualAtOpPsi: nembeResidualAt(node.op.q, pWh),
    residualAtUnstablePsi: nembeResidualAt(unstable.q, pWh),
  };
};

/**
 * THE WELLHEAD PRESSURE SWEEP, through the engine's own sweep helper. Choking
 * the wellhead back lifts the whole tubing curve, the two crossings walk
 * towards each other, and at 1248 psia they meet and vanish: the curves no
 * longer touch and the well is DEAD. Twelve psi of separator pressure is the
 * whole margin this well has.
 */
export const pwhSweep = (pwhList = CAP.sweepPwhPsia, { nGrid = CAP.nGrid } = {}) => {
  const ipr = nembeIpr();
  return operatingPointSweep(pwhList.map((pWh) => ({
    label: `pWh ${pWh} psia`,
    value: pWh,
    solve: () => solveOilNode({ ipr, vlpBhpAt: nembeOutflow(pWh), nGrid }),
  })));
};

/** The same sweep with the window width and the crossing count beside each row. */
export const pwhSweepDetail = (pwhList = CAP.sweepPwhPsia, { nGrid = CAP.nGrid } = {}) =>
  pwhList.map((pWh) => {
    const s = nembeNode({ nGrid, pWh });
    const two = s.intersections.length === 2;
    return {
      pWhPsia: pWh,
      status: s.status,
      crossings: s.intersections.length,
      qStbd: s.op ? s.op.q : 0,
      pwfPsia: s.op ? s.op.pwf : NaN,
      unstableQStbd: two ? s.intersections[0].q : null,
      windowStbd: two ? s.intersections[1].q - s.intersections[0].q : null,
      minimumResidualPsi: nembeResidualMinimum({ nPoints: 20001, pWh }).residualPsi,
      deadColumnPsia: pWh + CAP.gGravPsi,
    };
  });

/**
 * The wellhead pressure at which the well dies, found by BISECTING the engine's
 * own status verdict rather than asserted. Below it there are two crossings,
 * above it none: the curves are tangent exactly there.
 */
export const searchDeadWellhead = ({
  lo = CAP.sweepPwhPsia[0], hi = 1400, iterations = 60, nGrid = CAP.nGrid,
} = {}) => {
  const ipr = nembeIpr();
  const alive = (pWh) => solveOilNode({ ipr, vlpBhpAt: nembeOutflow(pWh), nGrid }).status === 'flowing';
  let a = lo;
  let b = hi;
  for (let i = 0; i < iterations; i += 1) {
    const m = (a + b) / 2;
    if (alive(m)) a = m; else b = m;
  }
  const pWhPsia = (a + b) / 2;
  const s = solveOilNode({ ipr, vlpBhpAt: nembeOutflow(a), nGrid });
  return {
    pWhPsia,
    lastLivePWhPsia: a,
    firstDeadPWhPsia: b,
    marginFromCapstonePsi: pWhPsia - CAP.pWhPsia,
    statusAtCapstone: solveOilNode({ ipr, vlpBhpAt: nembeOutflow(CAP.pWhPsia), nGrid }).status,
    crossingsAtLastLive: s.intersections.length,
    windowAtLastLiveStbd: s.intersections.length === 2
      ? s.intersections[1].q - s.intersections[0].q
      : null,
  };
};

/**
 * THE TANGENCY ITSELF, which is a different number from the one the scan
 * reports and is the honest one.
 *
 * The residual is g(q) = pWh + gGrav/(1 + q/qRef) + kFric q^2 - iprPwf(q), and
 * the wellhead pressure enters it as a pure vertical shift: it moves every
 * value of g by the same amount and moves the rate of the dip not at all. So
 * the rate at the bottom of the dip is found once, by a Brent root find on the
 * residual's own slope, and the wellhead pressure at which the two curves
 * become tangent is the capstone's pressure LESS the depth of that dip. Above
 * it there is no crossing at any rate and the well is dead as physics, not as
 * a scanning artefact.
 */
export const nembeTangency = ({ pWh = CAP.pWhPsia, hFrac = 1e-6 } = {}) => {
  const ipr = nembeIpr();
  const qMax = ipr.qmax;
  const g = (q) => nembeResidualAt(q, pWh);
  const h = qMax * hFrac;
  const slope = (q) => (g(q + h) - g(q - h)) / (2 * h);
  const solved = brentSolve(slope, qMax * 0.01, qMax * 0.9, { tol: 1e-9 });
  const qStbd = solved.root;
  const dipPsi = g(qStbd);
  return {
    qStbd,
    converged: solved.converged,
    dipPsi,
    pWhPsia: pWh,
    tangentWellheadPsia: pWh - dipPsi,
    marginFromCapstonePsi: -dipPsi,
    iprPwfAtDipPsia: pwfAtRate(ipr, qStbd),
    vlpBhpAtDipPsia: nembeOutflow(pWh)(qStbd),
  };
};

/** Every golden node case, reproduced through the engine. */
export const goldenNodeCases = () => GOLDEN.nodes.map((c) => {
  const ipr = goldenOilModel(c.ipr);
  const vlp = instrumentOutflow(c.outflow, ipr);
  const nGrid = c.nGridRequired || DEFAULT_NGRID;
  const s = solveOilNode({ ipr, vlpBhpAt: vlp, nGrid });
  return {
    id: c.id,
    note: c.note,
    nGrid,
    aofStbd: ipr.qmax,
    status: s.status,
    intersections: s.intersections,
    op: s.op,
    probes: c.probes.map((p) => ({
      qStbd: p.q,
      iprPwfPsia: pwfAtRate(ipr, p.q),
      vlpBhpPsia: vlp(p.q),
      residualPsi: vlp(p.q) - pwfAtRate(ipr, p.q),
      golden: p,
    })),
    golden: c,
  };
});

/**
 * The golden's own pinched instrument at the default scan and at the one it
 * needs. The same finding as NEMBE-14, on an algebraic instrument whose
 * crossings are known in closed form: 20 stb/d apart on a 2000 stb/d open flow,
 * invisible at nGrid 40, exact at nGrid 400.
 */
export const goldenPinchedScanStudy = (grids = [40, 100, 200, 400, 900, 4000]) => {
  const c = GOLDEN.nodes.find((x) => x.id === 'analyticResidualPinched');
  const ipr = goldenOilModel(c.ipr);
  const vlp = instrumentOutflow(c.outflow, ipr);
  return grids.map((nGrid) => {
    const s = solveOilNode({ ipr, vlpBhpAt: vlp, nGrid });
    return {
      nGrid,
      spacingStbd: scanSpacingStbd(nGrid, ipr.qmax),
      status: s.status,
      crossings: s.intersections.length,
      opQStbd: s.op ? s.op.q : null,
      trueWindowStbd: c.intersections[1].q - c.intersections[0].q,
    };
  });
};

/** Both golden gas nodes: deliverability against the Cullender and Smith column. */
export const goldenGasNodeCases = () => GOLDEN.gasNodes.map((c) => {
  const ipr = backPressureIpr(c.ipr);
  const tubing = { ...c.tubing, steps: 256, tolPsi: 1e-9 };
  const s = solveGasNode({ iprResult: ipr, tubing, nGrid: DEFAULT_NGRID });
  const chord = {
    ...solveNodeCore({
      iprPwfAt: (q) => gasPwfAtRate(ipr, q),
      vlpBhpAt: (q) => cullenderSmithBhp({ ...tubing, qMmscfd: q / 1000 }).pwf,
      qMax: ipr.aof,
      nGrid: DEFAULT_NGRID,
    }),
  };
  return {
    id: c.id,
    aofMscfd: ipr.aof,
    status: s.status,
    intersections: s.intersections,
    op: s.op,
    opFromChordIpr: chord.op,
    chordRateBiasMscfd: chord.op ? chord.op.q - s.op.q : NaN,
    probes: c.probes.map((p) => ({
      qMscfd: p.q,
      iprPwfPsia: gasPwfAtRateExact(ipr, p.q),
      vlpBhpPsia: cullenderSmithBhp({ ...tubing, qMmscfd: p.q / 1000 }).pwf,
      golden: p,
    })),
    golden: c,
  };
});

/** The golden's own wellhead pressure sweep, on the gas node. */
export const goldenSweepCase = () => {
  const base = GOLDEN.gasNodes.find((x) => x.id === GOLDEN.sweep.node);
  const ipr = backPressureIpr(base.ipr);
  return {
    parameter: GOLDEN.sweep.parameter,
    node: GOLDEN.sweep.node,
    rows: operatingPointSweep(GOLDEN.sweep.cases.map((c) => ({
      label: c.label,
      value: c.value,
      solve: () => solveGasNode({
        iprResult: ipr,
        tubing: { ...base.tubing, ptf: c.value, steps: 256, tolPsi: 1e-9 },
        nGrid: DEFAULT_NGRID,
      }),
    }))),
    golden: GOLDEN.sweep.cases,
  };
};

// ---------------------------------------------------------------------------
// THE WELLHEAD: what actually sets pWh, and what caps the rate above it.
//
// The node solve takes the wellhead pressure as given. In the field a bean and
// a gathering system set it, and the same wellhead carries an erosional limit
// that no amount of inflow can buy past. Both come from the choke engine and
// both are gated against its own goldens.
// ---------------------------------------------------------------------------

export const chokeErosionalCases = () => CHOKE_GOLDEN.erosional.map((c) => ({
  rhoLbFt3: c.rhoLbFt3,
  cFactor: c.cFactor,
  erosionalFtS: erosionalVelocityFtS({ mixtureDensityLbFt3: c.rhoLbFt3, cFactor: c.cFactor }),
  maxRateBpd_2441: erosionalRateBpd({
    idIn: 2.441, mixtureDensityLbFt3: c.rhoLbFt3, cFactor: c.cFactor,
  }),
  golden: c,
}));

export const chokeVelocityCases = () => CHOKE_GOLDEN.velocity.map((c) => ({
  idIn: c.idIn,
  inSituBpd: c.inSituBpd,
  velocityFtS: mixtureVelocityFtS({ inSituBpd: c.inSituBpd, idIn: c.idIn }),
  areaFt2: pipeAreaFt2(c.idIn),
  golden: c,
}));

export const chokeGilbertFit = () => ({
  clean: fitGilbertCoefficients({ points: CHOKE_GOLDEN.fit.points, mode: 'all' }),
  noisy: fitGilbertCoefficients({ points: CHOKE_GOLDEN.fitNoisy.points, mode: 'all' }),
  golden: { clean: CHOKE_GOLDEN.fit, noisy: CHOKE_GOLDEN.fitNoisy },
});

export const chokeHydrateCases = () => CHOKE_GOLDEN.hydrate.map((c) => ({
  pPsia: c.pPsia,
  formationF: hydrateFormationTempF({ pPsia: c.pPsia }),
  golden: c,
}));

/**
 * NEMBE-14's operating rate against the erosional limit of the string it flows
 * up, at three published C factors. The oil is taken at 48 lb/ft3, a live
 * near saturated crude, and the rate is the in situ liquid rate at the node.
 * This is a SCREEN, not a design: turning surface rates into in situ ones is
 * PVT work the choke engine deliberately refuses to do.
 */
export const NEMBE_MIXTURE_DENSITY_LB_FT3 = 48;

export const nembeErosionalScreen = ({
  idIn = CAP.diagIdIn, mixtureDensityLbFt3 = NEMBE_MIXTURE_DENSITY_LB_FT3,
} = {}) => {
  const op = nembeNode().op;
  return EROSIONAL_C.map((cf) => {
    const check = erosionalCheck({
      inSituBpd: op.q, idIn, mixtureDensityLbFt3, cFactor: cf.c,
    });
    return {
      cFactorId: cf.id,
      cFactorLabel: cf.label,
      cFactor: cf.c,
      idIn,
      mixtureDensityLbFt3,
      opQStbd: op.q,
      velocityFtS: check.velocityFtS,
      erosionalFtS: check.erosionalFtS,
      ratio: check.ratio,
      exceeded: check.exceeded,
      marginPct: check.marginPct,
      erosionalRateBpd: erosionalRateBpd({ idIn, mixtureDensityLbFt3, cFactor: cf.c }),
    };
  });
};

// ---------------------------------------------------------------------------
// THE CAPSTONE: the eighteen graded fields.
//
// Reproduced here, call for call, so a lesson, a panel and the grader all read
// one derivation. Nothing below is typed from a table.
// ---------------------------------------------------------------------------

export const CAPSTONE_TIERS = {
  ipr_pi_stbd_per_psi: 'beginner',
  ipr_q_at_bubble_stbd: 'beginner',
  ipr_q_at_1650psia_stbd: 'beginner',
  ipr_aof_stbd: 'beginner',
  ipr_pwf_at_2400stbd_psia: 'beginner',
  ipr_pwf_at_3300stbd_psia: 'beginner',
  vlp_min_q_stbd: 'intermediate',
  vlp_min_bhp_psia: 'intermediate',
  vlp_loaded_end_bhp_psia: 'intermediate',
  vlp_friction_end_bhp_psia: 'intermediate',
  liftgas_valve_pwf_psia: 'intermediate',
  liftgas_mid_pmf_psia: 'intermediate',
  node_op_q_stbd: 'advanced',
  node_op_pwf_psia: 'advanced',
  node_unstable_q_stbd: 'advanced',
  node_unstable_pwf_psia: 'advanced',
  sweep_pwh1176_q_stbd: 'advanced',
  sweep_pwh1176_pwf_psia: 'advanced',
};

export const capstoneValues = () => {
  const ipr = nembeIpr();
  const vlpBhpAt = nembeOutflow(CAP.pWhPsia);
  const tub = tubingCurve({ bhpAt: vlpBhpAt, qMax: ipr.qmax, nPoints: CAP.vlpPoints });
  const gi = liftGasColumn(CAP.giSteps);
  const node = solveOilNode({ ipr, vlpBhpAt, nGrid: CAP.nGrid });
  const unstable = node.intersections[0];
  const graded = pwhSweep().find((c) => c.value === CAP.sweepGradedPwhPsia);
  return {
    ipr_pi_stbd_per_psi: ipr.pi,
    ipr_q_at_bubble_stbd: rateAtPwf(ipr, CAP.pbPsia),
    ipr_q_at_1650psia_stbd: rateAtPwf(ipr, CAP.readQAtPwfPsia),
    ipr_aof_stbd: ipr.qmax,
    ipr_pwf_at_2400stbd_psia: pwfAtRate(ipr, CAP.readPwfAtQStbd),
    ipr_pwf_at_3300stbd_psia: pwfAtRate(ipr, CAP.readPwfAtQDeepStbd),
    vlp_min_q_stbd: tub.minimum.q,
    vlp_min_bhp_psia: tub.minimum.bhp,
    vlp_loaded_end_bhp_psia: tub.curve[0].bhp,
    vlp_friction_end_bhp_psia: tub.curve[tub.curve.length - 1].bhp,
    liftgas_valve_pwf_psia: gi.pwf,
    liftgas_mid_pmf_psia: gi.pmf,
    node_op_q_stbd: node.op.q,
    node_op_pwf_psia: node.op.pwf,
    node_unstable_q_stbd: unstable.q,
    node_unstable_pwf_psia: unstable.pwf,
    sweep_pwh1176_q_stbd: graded.q,
    sweep_pwh1176_pwf_psia: graded.pwf,
  };
};

// ===========================================================================
// THE TEACHING WELLS.
//
// EVERYTHING ABOVE THIS LINE THAT MENTIONS NEMBE-14 IS CAPSTONE MATERIAL AND
// MUST NEVER REACH A LESSON. NEMBE-14 is the graded well: its conditions and
// its eighteen answers belong to `capstoneValues()` and `capstoneDigestText()`
// and to nothing else. Lessons are written from `digestText()`, which is built
// only from the published goldens and from the two wells below.
//
// Two wells, because the course needs two different pictures:
//
//   BONNY-7    the comfortable well. One clean crossing, on the RISING
//              friction limb, which is the textbook case every lesson should
//              establish BEFORE the Expert tier shows a well where the
//              textbook case fails.
//
//   FORCADOS-3 the double crossing well. A column heavy enough to outweigh the
//              reservoir at low rate, so the residual is positive at low rate
//              and there are two crossings, with a stable window 1890 stb/d
//              wide. Wide on purpose: a narrow window is the capstone's own
//              finding and stays there.
//
// Every condition on both wells differs from the capstone's AND from every
// published golden's, and the competing values are named on each line.
// ===========================================================================

/**
 * BONNY-7. An UNDERSATURATED oil well produced well above its bubble point,
 * on a light column into a low pressure separator. Nothing about it is
 * difficult, which is the point of it.
 *
 * The production test is taken ABOVE the bubble point, so the straight line
 * fitted to it carries the RIGHT productivity index and the only thing between
 * it and the composite below the bubble point is the SHAPE of the curve. That
 * is the controlled experiment; FORCADOS-3 below is the corrupted one.
 */
export const BONNY_7 = {
  label: 'BONNY-7',
  note: 'Comfortable single crossing on the rising friction limb.',

  // ---- inflow ----
  iprModel: 'composite',
  prPsia: 2740,        // capstone 3450; goldens 3200, 2400, 3000, 3500, 2800
  pbPsia: 1300,        // capstone 3100; goldens 2000 and 0
  testQStbd: 720,      // capstone 1200; goldens 900, 700, 600, 1500, 1100
  testPwfPsia: 2380,   // capstone 2790; goldens 2700, 1500, 2500, 1400, 2900
  iprPoints: 51,       // capstone 61; every golden curve is cut on 40

  // ---- outflow: the gravity plus friction instrument ----
  pWhPsia: 420,        // capstone 1236; goldens 250, 300, 1400
  gGravPsi: 2150,      // capstone 3835; goldens 3200, 900, 800
  qRefStbd: 375,       // capstone 600; goldens 250, 200, 300
  kFricPsiPerStbd2: 0.00064, // capstone 0.000238; goldens 0.00025, 0.0006, 0.001
  vlpPoints: 37,       // capstone 49; golden tubingCurve 25

  // ---- the node ----
  nGrid: 40,           // THE DEFAULT, and this well needs nothing more
  sweepPwhPsia: [280, 350, 420, 490], // capstone 1176/1206/1236/1248; golden 500/800/1200/1800

  // ---- a STATIC dry gas column, for the gas lift design lesson ----
  column: {
    ptf: 640,          // capstone 1225; goldens 800, 1000, 900
    gasSg: 0.61,       // capstone 0.72; goldens 0.65, 0.68, 0.70
    mdFt: 6700,        // capstone 8900; goldens 8000, 10000, 12000
    tvdFt: 6700,       // vertical; capstone 8300; goldens 8000, 10000, 10400
    whtF: 84,          // capstone 96; goldens 100, 90, 110
    bhtF: 176,         // capstone 214; goldens 200, 240, 220
  },
  columnSteps: 16,     // capstone 20; every golden is cut on the published 2

  // ---- the erosional screen ----
  mixtureDensityLbFt3: 52, // golden erosional rows 5, 20, 45, 62.4
  tubingIdIn: 2.875,   // capstone 1.995; goldens 2.441, 2.992, 3.958
};

/**
 * FORCADOS-3. A heavier well on a taller column into a higher pressure
 * gathering system, and the column outweighs the reservoir at low rate: the
 * dead column stands at 4310 psia against a reservoir pressure of 3720, so the
 * residual is POSITIVE at low rate and the well cannot start itself. That is
 * the precondition for two crossings, and this well has two.
 *
 * Its stable window is 1890 stb/d wide, which is seventy odd times wider than
 * the capstone's, and its stable crossing sits to the RIGHT of the bottom of
 * its own tubing curve, which the capstone's does not. So this is the textbook
 * double crossing picture: an unstable heading branch on the left, a stable
 * operating point on the right, and enough room between them that the engine's
 * default forty point scan resolves it without being told anything.
 *
 * Its production test is taken BELOW the bubble point, which is the corrupted
 * calibration: the straight line fitted to it backs out a productivity index
 * that is not the well's, and reads LOW above the test rather than high.
 */
export const FORCADOS_3 = {
  label: 'FORCADOS-3',
  note: 'Two crossings, a wide stable window, resolved at the default scan.',

  // ---- inflow ----
  iprModel: 'composite',
  prPsia: 3720,        // capstone 3450; goldens 3200, 2400, 3000, 3500, 2800; BONNY-7 2740
  pbPsia: 2450,        // capstone 3100; goldens 2000 and 0; BONNY-7 1300
  testQStbd: 2400,     // capstone 1200; goldens 900, 700, 600, 1500, 1100; BONNY-7 720
  testPwfPsia: 2180,   // capstone 2790; goldens 2700, 1500, 2500, 1400, 2900; BONNY-7 2380
  iprPoints: 45,       // capstone 61; goldens 40; BONNY-7 51

  // ---- outflow ----
  pWhPsia: 960,        // capstone 1236; goldens 250, 300, 1400; BONNY-7 420
  gGravPsi: 3350,      // capstone 3835; goldens 3200, 900, 800; BONNY-7 2150
  qRefStbd: 820,       // capstone 600; goldens 250, 200, 300; BONNY-7 375
  kFricPsiPerStbd2: 0.000105, // capstone 0.000238; goldens 0.00025, 0.0006, 0.001; BONNY-7 0.00064
  vlpPoints: 65,       // capstone 49; golden 25; BONNY-7 37

  // ---- the node ----
  nGrid: 40,           // THE DEFAULT: a well this wide open needs nothing more
  sweepPwhPsia: [860, 960, 1060, 1160], // capstone 1176/1206/1236/1248; golden 500/800/1200/1800

  // ---- a FLOWING dry gas column, where the truncation bites ----
  column: {
    ptf: 1080,         // capstone 1225; goldens 800, 1000, 900; BONNY-7 640
    gasSg: 0.66,       // capstone 0.72; goldens 0.65, 0.68, 0.70; BONNY-7 0.61
    mdFt: 11200,       // capstone 8900; goldens 8000, 10000, 12000; BONNY-7 6700
    tvdFt: 9750,       // capstone 8300; goldens 8000, 10000, 10400; BONNY-7 6700
    whtF: 78,          // capstone 96; goldens 100, 90, 110; BONNY-7 84
    bhtF: 232,         // capstone 214; goldens 200, 240, 220; BONNY-7 176
    qMmscfd: 10.5,     // capstone 9.6; goldens 4.0, 5.0, 6.0, 9.0
    idIn: 2.125,       // capstone 1.995; goldens 2.441, 2.992; BONNY-7 2.875
    roughnessIn: 0.00085, // capstone 0.0007; goldens 0.0006
    muCp: 0.0151,      // capstone 0.0138; goldens 0.012, 0.014
  },
  columnSteps: 24,     // capstone 20; goldens 2; BONNY-7 16

  // ---- the erosional screen ----
  mixtureDensityLbFt3: 41, // golden erosional rows 5, 20, 45, 62.4; BONNY-7 52
  tubingIdIn: 3.548,   // capstone 1.995; goldens 2.441, 2.992, 3.958; BONNY-7 2.875
};

/**
 * ESCRAVOS-9. THE FALLING LIMB WELL, and the reason it exists.
 *
 * A stable operating point does NOT have to sit on the rising friction limb.
 * Stability is a statement about the DIFFERENCE of two slopes and never about
 * the sign of one of them: the residual g(q) = outflow(q) - inflow(q) has to be
 * RISING through the crossing, and since the inflow always falls, g' is
 * outflow' + |inflow'|. That sum can be positive while outflow' is still
 * negative, which is exactly a stable crossing on the FALLING part of the
 * outflow curve. All it takes is for the column to be lightening more gently
 * than the reservoir is giving up pressure.
 *
 * This well does it and BONNY-7 and FORCADOS-3 do not, and that is the only
 * unusual thing about it. It is otherwise the most ordinary well in the file:
 * two crossings like FORCADOS-3, a comfortable 552.77 stb/d window, a static
 * column, and the engine's default forty point scan resolves it without being
 * told anything. So a lesson can attribute the behaviour to the falling limb
 * alone and to nothing else.
 *
 * HOW THE CONDITIONS PRODUCE IT. The lightening constant qRef is 1900 stb/d,
 * three times BONNY-7's and more than twice FORCADOS-3's, so the gravity term
 * sheds weight slowly and the outflow is still falling at a thousand stb/d.
 * The friction constant is small, so the bottom of the J is pushed out to
 * 1802.14 stb/d. Meanwhile the inflow is well into its Vogel section by then
 * and falling hard. The two curves therefore meet at 1009.76 stb/d, which is
 * 792.38 stb/d to the LEFT of the bottom of the tubing curve, with the outflow
 * still falling, and the crossing is stable anyway.
 */
export const ESCRAVOS_9 = {
  label: 'ESCRAVOS-9',
  note: 'Two crossings, and the STABLE one sits on the FALLING limb of the outflow.',

  // ---- inflow ----
  iprModel: 'composite',
  prPsia: 2260,        // capstone 3450; goldens 3200, 2400, 3000, 3500, 2800; BONNY-7 2740; FORCADOS-3 3720
  pbPsia: 1980,        // capstone 3100; goldens 2000 and 0; BONNY-7 1300; FORCADOS-3 2450
  testQStbd: 380,      // capstone 1200; goldens 900, 700, 600, 1500, 1100; BONNY-7 720; FORCADOS-3 2400
  testPwfPsia: 2100,   // capstone 2790; goldens 2700, 1500, 2500, 1400, 2900; BONNY-7 2380; FORCADOS-3 2180
  iprPoints: 57,       // capstone 61; goldens 40; BONNY-7 51; FORCADOS-3 45

  // ---- outflow ----
  pWhPsia: 480,        // capstone 1236; goldens 250, 300, 1400; BONNY-7 420; FORCADOS-3 960
  gGravPsi: 1950,      // capstone 3835; goldens 3200, 900, 800; BONNY-7 2150; FORCADOS-3 3350
  qRefStbd: 1900,      // capstone 600; goldens 250, 200, 300; BONNY-7 375; FORCADOS-3 820
  kFricPsiPerStbd2: 0.000075, // capstone 0.000238; goldens 0.00025, 0.0006, 0.001; BONNY-7 0.00064; FORCADOS-3 0.000105
  vlpPoints: 33,       // capstone 49; golden 25; BONNY-7 37; FORCADOS-3 65

  // ---- the node ----
  nGrid: 40,           // THE DEFAULT: the window is 552.77 stb/d wide and needs nothing more
  sweepPwhPsia: [400, 480, 560, 640], // capstone 1176/1206/1236/1248; golden 500/800/1200/1800

  // ---- a STATIC dry gas column ----
  column: {
    ptf: 820,          // capstone 1225; goldens 800, 1000, 900; BONNY-7 640; FORCADOS-3 1080
    gasSg: 0.63,       // capstone 0.72; goldens 0.65, 0.68, 0.70; BONNY-7 0.61; FORCADOS-3 0.66
    mdFt: 7450,        // capstone 8900; goldens 8000, 10000, 12000; BONNY-7 6700; FORCADOS-3 11200
    tvdFt: 7100,       // capstone 8300; goldens 8000, 10000, 10400; BONNY-7 6700; FORCADOS-3 9750
    whtF: 102,         // capstone 96; goldens 100, 90, 110; BONNY-7 84; FORCADOS-3 78
    bhtF: 188,         // capstone 214; goldens 200, 240, 220; BONNY-7 176; FORCADOS-3 232
  },
  columnSteps: 12,     // capstone 20; goldens 2; BONNY-7 16; FORCADOS-3 24

  // ---- the erosional screen ----
  mixtureDensityLbFt3: 57, // golden rows 5, 20, 45, 62.4; BONNY-7 52; FORCADOS-3 41
  tubingIdIn: 3.152,   // capstone 1.995; goldens 2.441, 2.992, 3.958; BONNY-7 2.875; FORCADOS-3 3.548
};

export const TEACHING_WELLS = [BONNY_7, FORCADOS_3, ESCRAVOS_9];

// --------------------------- generic well readers ---------------------------
// One set of functions, driven by whichever well is handed in, so the two
// teaching wells cannot drift apart in how they are read.

export const wellIpr = (W) => computeIpr({
  model: W.iprModel,
  pr: W.prPsia,
  pb: W.pbPsia,
  testPoint: { q: W.testQStbd, pwf: W.testPwfPsia },
  nPoints: W.iprPoints,
});

export const wellOutflow = (W, pWh = W.pWhPsia) => gravityFrictionOutflow({
  pWh, gGrav: W.gGravPsi, qRef: W.qRefStbd, kFric: W.kFricPsiPerStbd2,
});

export const wellTubingCurve = (W, { pWh = W.pWhPsia, nPoints = W.vlpPoints } = {}) =>
  tubingCurve({ bhpAt: wellOutflow(W, pWh), qMax: wellIpr(W).qmax, nPoints });

export const wellTubingCurveFine = (W, { pWh = W.pWhPsia, nPoints = 20001 } = {}) =>
  tubingCurve({ bhpAt: wellOutflow(W, pWh), qMax: wellIpr(W).qmax, nPoints });

export const wellNode = (W, { nGrid = W.nGrid, pWh = W.pWhPsia } = {}) =>
  solveOilNode({ ipr: wellIpr(W), vlpBhpAt: wellOutflow(W, pWh), nGrid });

export const wellResidualAt = (W, qStbd, pWh = W.pWhPsia) =>
  wellOutflow(W, pWh)(qStbd) - pwfAtRate(wellIpr(W), qStbd);

export const wellForwardPressures = (W) => {
  const step = (W.prPsia - 0) / 7;
  return [W.prPsia, W.pbPsia, W.testPwfPsia, ...[5, 4, 3, 2, 1].map((k) => Math.round(k * step)), 0]
    .filter((p, i, a) => a.indexOf(p) === i && p >= 0 && p <= W.prPsia)
    .sort((a, b) => b - a);
};

export const wellInverseRates = (W) => {
  const qmax = wellIpr(W).qmax;
  return [0.05, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 0.97].map((f) => Math.round(qmax * f));
};

/** Every inflow reading a lesson can quote on a teaching well. */
export const wellInflowReadings = (W) => {
  const ipr = wellIpr(W);
  return {
    label: W.label,
    model: ipr.model,
    prPsia: ipr.pr,
    pbPsia: ipr.pb,
    piStbdPerPsi: ipr.pi,
    aofStbd: ipr.qmax,
    testQStbd: W.testQStbd,
    testPwfPsia: W.testPwfPsia,
    testDrawdownPsi: W.prPsia - W.testPwfPsia,
    testIsBelowBubblePoint: W.testPwfPsia < W.pbPsia,
    qAtBubblePointStbd: rateAtPwf(ipr, ipr.pb),
    qAtBubbleFromPiStbd: ipr.pi * (ipr.pr - ipr.pb),
    vogelBlockStbd: (ipr.pi * ipr.pb) / 1.8,
    saturatedShareOfAof: ((ipr.pi * ipr.pb) / 1.8) / ipr.qmax,
    curveRows: ipr.curve.length,
    warnings: ipr.warnings,
    forward: iprForwardTable(ipr, wellForwardPressures(W)),
    inverse: iprInverseTable(ipr, wellInverseRates(W)),
  };
};

export const wellInflowSlopes = (W) => {
  const ipr = wellIpr(W);
  return wellInverseRates(W).map((qStbd) => ({
    qStbd,
    pwfPsia: pwfAtRate(ipr, qStbd),
    dpwfdqPsiPerStbd: inflowSlope(ipr, qStbd),
    belowBubblePoint: pwfAtRate(ipr, qStbd) < ipr.pb,
    straightLineSlopePsiPerStbd: -1 / ipr.pi,
  }));
};

/**
 * The three model comparison on a teaching well. BONNY-7's test sits ABOVE its
 * bubble point, so its straight line carries the right productivity index and
 * this is the CONTROLLED comparison, model shape alone. FORCADOS-3's test sits
 * BELOW its bubble point, so its straight line carries a corrupted index and
 * this is the CORRUPTED comparison, calibration and shape together. Running
 * both is what separates the two mistakes.
 */
export const wellModelSet = (W) => ({
  straightLine: computeIpr({
    model: 'pi', pr: W.prPsia, pb: 0,
    testPoint: { q: W.testQStbd, pwf: W.testPwfPsia }, nPoints: W.iprPoints,
  }),
  vogel: computeIpr({
    model: 'vogel', pr: W.prPsia,
    testPoint: { q: W.testQStbd, pwf: W.testPwfPsia }, nPoints: W.iprPoints,
  }),
  composite: wellIpr(W),
});

export const wellModelComparison = (W, pressures = wellForwardPressures(W)) => {
  const set = wellModelSet(W);
  return pressures.map((pwfPsia) => {
    const straightLineStbd = rateAtPwf(set.straightLine, pwfPsia);
    const vogelStbd = rateAtPwf(set.vogel, pwfPsia);
    const compositeStbd = rateAtPwf(set.composite, pwfPsia);
    return {
      pwfPsia,
      belowBubblePoint: pwfPsia < W.pbPsia,
      belowTestPressure: pwfPsia < W.testPwfPsia,
      straightLineStbd,
      vogelStbd,
      compositeStbd,
      straightLineMinusCompositeStbd: straightLineStbd - compositeStbd,
      vogelMinusCompositeStbd: vogelStbd - compositeStbd,
    };
  });
};

export const wellModelAofs = (W) => {
  const set = wellModelSet(W);
  return {
    straightLineStbd: set.straightLine.qmax,
    vogelStbd: set.vogel.qmax,
    compositeStbd: set.composite.qmax,
    straightLinePiStbdPerPsi: set.straightLine.pi,
    compositePiStbdPerPsi: set.composite.pi,
    piErrorStbdPerPsi: set.straightLine.pi - set.composite.pi,
    calibrationIsCorrupted: W.testPwfPsia < W.pbPsia,
  };
};

/** The J taken apart on a teaching well. */
export const wellDecomposition = (W, rates) => {
  const qs = rates || wellTubingCurve(W).curve.map((p) => p.q);
  return qs.map((qStbd) => {
    const gravityPsi = W.gGravPsi / (1 + qStbd / W.qRefStbd);
    const frictionPsi = W.kFricPsiPerStbd2 * qStbd * qStbd;
    return {
      qStbd,
      wellheadPsia: W.pWhPsia,
      gravityPsi,
      frictionPsi,
      bhpPsia: W.pWhPsia + gravityPsi + frictionPsi,
      gravityShare: gravityPsi / (gravityPsi + frictionPsi),
      frictionExceedsGravity: frictionPsi > gravityPsi,
    };
  });
};

export const wellLimbCrossover = (W) => {
  const qMax = wellIpr(W).qmax;
  const gap = (q) => W.kFricPsiPerStbd2 * q * q - W.gGravPsi / (1 + q / W.qRefStbd);
  const solved = brentSolve(gap, qMax * 1e-6, qMax * 4, { tol: 1e-9 });
  return {
    qStbd: solved.root,
    converged: solved.converged,
    bhpPsia: wellOutflow(W)(solved.root),
    tubingMinimumQStbd: wellTubingCurveFine(W).minimum.q,
  };
};

export const wellOutflowReadings = (W) => {
  const sampled = wellTubingCurve(W);
  const fine = wellTubingCurveFine(W);
  const first = sampled.curve[0];
  const last = sampled.curve[sampled.curve.length - 1];
  return {
    label: W.label,
    nPoints: W.vlpPoints,
    qMaxStbd: wellIpr(W).qmax,
    wellheadPsia: W.pWhPsia,
    deadColumnPsia: W.pWhPsia + W.gGravPsi,
    deadColumnAbovePrPsi: W.pWhPsia + W.gGravPsi - W.prPsia,
    columnOutweighsReservoirAtLowRate: W.pWhPsia + W.gGravPsi > W.prPsia,
    sampledMinimumQStbd: sampled.minimum.q,
    sampledMinimumBhpPsia: sampled.minimum.bhp,
    trueMinimumQStbd: fine.minimum.q,
    trueMinimumBhpPsia: fine.minimum.bhp,
    sampledMinusTrueQStbd: sampled.minimum.q - fine.minimum.q,
    sampledMinusTrueBhpPsi: sampled.minimum.bhp - fine.minimum.bhp,
    loadedEndQStbd: first.q,
    loadedEndBhpPsia: first.bhp,
    frictionEndQStbd: last.q,
    frictionEndBhpPsia: last.bhp,
  };
};

export const wellMinimumSensitivity = (W, {
  pWhList, qRefList, kFricList, nPoints = 20001,
} = {}) => {
  const qMax = wellIpr(W).qmax;
  const at = (over) => {
    const t = tubingCurve({
      bhpAt: gravityFrictionOutflow({
        pWh: W.pWhPsia, gGrav: W.gGravPsi, qRef: W.qRefStbd, kFric: W.kFricPsiPerStbd2, ...over,
      }),
      qMax,
      nPoints,
    });
    return { minQStbd: t.minimum.q, minBhpPsia: t.minimum.bhp };
  };
  const base = at({});
  const row = (key, unitKey) => (value) => {
    const r = at({ [key]: value });
    return {
      [unitKey]: value,
      minQStbd: r.minQStbd,
      minBhpPsia: r.minBhpPsia,
      dMinQStbd: r.minQStbd - base.minQStbd,
      dMinBhpPsi: r.minBhpPsia - base.minBhpPsia,
    };
  };
  return {
    baseMinQStbd: base.minQStbd,
    baseMinBhpPsia: base.minBhpPsia,
    wellheadPressure: (pWhList || W.sweepPwhPsia).map(row('pWh', 'pWhPsia')),
    lighteningConstant: (qRefList || [W.qRefStbd / 2, W.qRefStbd, W.qRefStbd * 2, W.qRefStbd * 4])
      .map(row('qRef', 'qRefStbd')),
    frictionConstant: (kFricList
      || [W.kFricPsiPerStbd2 / 2, W.kFricPsiPerStbd2, W.kFricPsiPerStbd2 * 2])
      .map(row('kFric', 'kFricPsiPerStbd2')),
  };
};

export const wellCrossings = (W, opts = {}) => {
  const node = wellNode(W, opts);
  return node.intersections.map((x, i) => ({
    index: i,
    qStbd: x.q,
    pwfPsia: x.pwf,
    stable: x.stable,
    branch: x.stable ? 'right (stable)' : 'left (heading)',
    isOperatingPoint: !!node.op && x.q === node.op.q,
  }));
};

export const wellResidualSweep = (W, { nPoints = 801, pWh = W.pWhPsia } = {}) => {
  const ipr = wellIpr(W);
  const out = wellOutflow(W, pWh);
  return linspace(ipr.qmax * SCAN_LO_FRACTION, ipr.qmax * SCAN_HI_FRACTION, nPoints)
    .map((qStbd) => {
      const vlpBhpPsia = out(qStbd);
      const iprPwfPsia = pwfAtRate(ipr, qStbd);
      return { qStbd, vlpBhpPsia, iprPwfPsia, residualPsi: vlpBhpPsia - iprPwfPsia };
    });
};

export const wellResidualMinimum = (W, { nPoints = 20001, pWh = W.pWhPsia } = {}) => {
  const rows = wellResidualSweep(W, { nPoints, pWh });
  let best = rows[0];
  rows.forEach((r) => { if (r.residualPsi < best.residualPsi) best = r; });
  return {
    qStbd: best.qStbd,
    residualPsi: best.residualPsi,
    residualAtLowestSampledRatePsi: rows[0].residualPsi,
    lowestSampledRateStbd: rows[0].qStbd,
    residualAtHighestSampledRatePsi: rows[rows.length - 1].residualPsi,
    highestSampledRateStbd: rows[rows.length - 1].qStbd,
    signChanges: rows.reduce((n, r, i) => (
      i > 0 && Math.sign(r.residualPsi) !== Math.sign(rows[i - 1].residualPsi) ? n + 1 : n), 0),
  };
};

/**
 * The local slope of the OUTFLOW curve, d(bhp)/dq, psi per stb/d. Same
 * Richardson extrapolated central difference as `inflowSlope`, on the injected
 * outflow function rather than on the inflow. Negative on the gravity limb,
 * zero at the bottom of the J, positive on the friction limb.
 */
export const outflowSlope = (bhpAt, q, h = 1e-3) => {
  const d1 = (bhpAt(q + h) - bhpAt(q - h)) / (2 * h);
  const d2 = (bhpAt(q + 2 * h) - bhpAt(q - 2 * h)) / (4 * h);
  return (4 * d1 - d2) / 3;
};

/** The closed form slope of the gravity plus friction instrument, for gating. */
export const gravityFrictionSlope = ({ gGrav, qRef, kFric }) => (q) =>
  -(gGrav / qRef) / (1 + q / qRef) ** 2 + 2 * kFric * q;

/**
 * THE SLOPE TEST, BOTH HALVES OF IT, AT ONE SET OF RATES.
 *
 * The stability criterion compares two slopes and the digest used to carry only
 * one of them. Here they are side by side, with the quantity the criterion
 * actually looks at: the DIFFERENCE, d(outflow)/dq - d(inflow)/dq, which is the
 * slope of the residual. Where that difference is positive the crossing holds;
 * where it is negative the crossing runs away. The sign of the outflow slope on
 * its own decides nothing, which is what ESCRAVOS-9 is in the file to show.
 */
export const wellSlopeTable = (W, rates = wellInverseRates(W)) => {
  const ipr = wellIpr(W);
  const out = wellOutflow(W);
  const analytic = gravityFrictionSlope({
    gGrav: W.gGravPsi, qRef: W.qRefStbd, kFric: W.kFricPsiPerStbd2,
  });
  return rates.map((qStbd) => {
    const inflowSlopePsiPerStbd = inflowSlope(ipr, qStbd);
    const outflowSlopePsiPerStbd = outflowSlope(out, qStbd);
    return {
      qStbd,
      iprPwfPsia: pwfAtRate(ipr, qStbd),
      vlpBhpPsia: out(qStbd),
      inflowSlopePsiPerStbd,
      outflowSlopePsiPerStbd,
      analyticOutflowSlopePsiPerStbd: analytic(qStbd),
      residualSlopePsiPerStbd: outflowSlopePsiPerStbd - inflowSlopePsiPerStbd,
      outflowIsFalling: outflowSlopePsiPerStbd < 0,
      residualIsRising: outflowSlopePsiPerStbd - inflowSlopePsiPerStbd > 0,
    };
  });
};

/**
 * A RESIDUAL TABLE SHAPED SO THE DIP IS VISIBLE, not three scattered values.
 *
 * The rates are chosen from the well's own solve: the bottom of the scan, two
 * rows on the way down, a bracket either side of every crossing, the bottom of
 * the dip, and the top of the scan. On a two crossing well that is enough rows
 * to read the whole story off the numbers, positive, down through zero,
 * negative, back up through zero, positive, without plotting anything.
 */
export const wellResidualTable = (W, { pWh = W.pWhPsia, nGrid = W.nGrid } = {}) => {
  const ipr = wellIpr(W);
  const out = wellOutflow(W, pWh);
  const qMax = ipr.qmax;
  const node = wellNode(W, { nGrid, pWh });
  const dip = wellResidualMinimum(W, { nPoints: 40001, pWh });
  const lo = qMax * SCAN_LO_FRACTION;
  const hi = qMax * SCAN_HI_FRACTION;
  const crossings = node.intersections.map((x) => x.q);
  const bracket = crossings.length > 1
    ? Math.max(qMax * 0.005, (crossings[crossings.length - 1] - crossings[0]) * 0.1)
    : qMax * 0.02;
  const rates = [
    lo,
    lo + (Math.min(...crossings, hi) - lo) * 0.33,
    lo + (Math.min(...crossings, hi) - lo) * 0.66,
    ...crossings.flatMap((q) => [q - bracket, q, q + bracket]),
    dip.qStbd,
    hi - (hi - Math.max(...crossings, lo)) * 0.5,
    hi,
  ]
    .filter((q) => q >= lo && q <= hi && Number.isFinite(q))
    .sort((a, b) => a - b)
    .filter((q, i, a) => i === 0 || q - a[i - 1] > qMax * 1e-4);
  return rates.map((qStbd) => {
    const vlpBhpPsia = out(qStbd);
    const iprPwfPsia = pwfAtRate(ipr, qStbd);
    return {
      qStbd,
      iprPwfPsia,
      vlpBhpPsia,
      residualPsi: vlpBhpPsia - iprPwfPsia,
      isCrossing: crossings.some((c) => Math.abs(c - qStbd) < qMax * 1e-9),
      isDip: Math.abs(qStbd - dip.qStbd) < qMax * 1e-9,
    };
  });
};

/**
 * The same table for a golden node, and for the same reason.
 *
 * The goldens publish five probe rates apiece, and on `compositeTwoCrossings`
 * the lowest of them sits at 126.6667 stb/d, which is already PAST the lower
 * crossing at 44.984487 and therefore already negative. Nothing in the
 * published rows shows the residual positive below that crossing, so the two
 * crossing story cannot be checked from the golden's own numbers. These rows
 * go below it.
 */
export const goldenNodeResidualTable = (id) => {
  const c = GOLDEN.nodes.find((x) => x.id === id);
  if (!c) throw new Error(`No golden node case "${id}".`);
  const ipr = goldenOilModel(c.ipr);
  const vlp = instrumentOutflow(c.outflow, ipr);
  const qMax = ipr.qmax;
  const lo = qMax * SCAN_LO_FRACTION;
  const hi = qMax * SCAN_HI_FRACTION;
  const crossings = c.intersections.map((x) => x.q);
  const first = crossings.length ? Math.min(...crossings) : hi;
  const bracket = crossings.length > 1
    ? Math.max(qMax * 0.002, (Math.max(...crossings) - first) * 0.08)
    : qMax * 0.02;
  const rates = [
    lo,
    lo + (first - lo) * 0.25,
    lo + (first - lo) * 0.5,
    lo + (first - lo) * 0.75,
    ...crossings.flatMap((q) => [q - bracket, q, q + bracket]),
    hi * 0.25,
    hi * 0.5,
    hi * 0.75,
    hi,
  ]
    .filter((q) => q >= lo && q <= hi && Number.isFinite(q))
    .sort((a, b) => a - b)
    .filter((q, i, a) => i === 0 || q - a[i - 1] > qMax * 1e-4);
  const analytic = c.outflow.form === 'gravityFriction'
    ? gravityFrictionSlope(c.outflow)
    : null;
  return rates.map((qStbd) => ({
    qStbd,
    iprPwfPsia: pwfAtRate(ipr, qStbd),
    vlpBhpPsia: vlp(qStbd),
    residualPsi: vlp(qStbd) - pwfAtRate(ipr, qStbd),
    inflowSlopePsiPerStbd: inflowSlope(ipr, qStbd),
    outflowSlopePsiPerStbd: outflowSlope(vlp, qStbd),
    analyticOutflowSlopePsiPerStbd: analytic ? analytic(qStbd) : null,
    residualSlopePsiPerStbd: outflowSlope(vlp, qStbd) - inflowSlope(ipr, qStbd),
    isCrossing: crossings.some((x) => Math.abs(x - qStbd) < qMax * 1e-9),
  }));
};

export const wellWindow = (W, opts = {}) => {
  const node = wellNode(W, opts);
  const ipr = wellIpr(W);
  const fine = wellTubingCurveFine(W, opts);
  if (!node.op) {
    return { label: W.label, status: node.status, crossings: node.intersections.length, widthStbd: null };
  }
  const two = node.intersections.length === 2;
  return {
    label: W.label,
    status: node.status,
    crossings: node.intersections.length,
    opQStbd: node.op.q,
    opPwfPsia: node.op.pwf,
    unstableQStbd: two ? node.intersections[0].q : null,
    unstablePwfPsia: two ? node.intersections[0].pwf : null,
    widthStbd: two ? node.op.q - node.intersections[0].q : null,
    pressureSpanPsi: two ? node.intersections[0].pwf - node.op.pwf : null,
    aofStbd: ipr.qmax,
    widthAsFractionOfAof: two ? (node.op.q - node.intersections[0].q) / ipr.qmax : null,
    opAsFractionOfAof: node.op.q / ipr.qmax,
    drawdownAtOpPsi: ipr.pr - node.op.pwf,
    tubingMinimumQStbd: fine.minimum.q,
    tubingMinimumBhpPsia: fine.minimum.bhp,
    opAboveTubingMinimumPsi: node.op.pwf - fine.minimum.bhp,
    opRightOfTubingMinimumStbd: node.op.q - fine.minimum.q,
    operatingPointIsOnTheFrictionLimb: node.op.q > fine.minimum.q,
  };
};

export const wellScanStudy = (W, grids = SCAN_GRIDS, { pWh = W.pWhPsia } = {}) => {
  const qMax = wellIpr(W).qmax;
  return grids.map((nGrid) => {
    const s = wellNode(W, { nGrid, pWh });
    return {
      nGrid,
      spacingStbd: scanSpacingStbd(nGrid, qMax),
      status: s.status,
      crossings: s.intersections.length,
      opQStbd: s.op ? s.op.q : null,
      opPwfPsia: s.op ? s.op.pwf : null,
      windowStbd: s.intersections.length > 1
        ? s.intersections[1].q - s.intersections[0].q
        : null,
    };
  });
};

export const wellPwhSweep = (W, pwhList = W.sweepPwhPsia, { nGrid = W.nGrid } = {}) => {
  const ipr = wellIpr(W);
  return operatingPointSweep(pwhList.map((pWh) => ({
    label: `pWh ${pWh} psia`,
    value: pWh,
    solve: () => solveOilNode({ ipr, vlpBhpAt: wellOutflow(W, pWh), nGrid }),
  })));
};

export const wellPwhSweepDetail = (W, pwhList = W.sweepPwhPsia, { nGrid = W.nGrid } = {}) =>
  pwhList.map((pWh) => {
    const s = wellNode(W, { nGrid, pWh });
    const two = s.intersections.length === 2;
    return {
      pWhPsia: pWh,
      status: s.status,
      crossings: s.intersections.length,
      qStbd: s.op ? s.op.q : 0,
      pwfPsia: s.op ? s.op.pwf : NaN,
      unstableQStbd: two ? s.intersections[0].q : null,
      windowStbd: two ? s.intersections[1].q - s.intersections[0].q : null,
      deadColumnPsia: pWh + W.gGravPsi,
    };
  });

export const wellColumn = (W, steps = W.columnSteps) =>
  cullenderSmithBhp({ ...W.column, steps });

export const wellColumnStepStudy = (W, stepList = CS_STEP_LIST) =>
  cullenderSmithStepStudy(W.column, stepList);

export const wellColumnVsAverageTz = (W) => {
  const cs = cullenderSmithBhp({ ...W.column, steps: W.columnSteps });
  const converged = cullenderSmithBhp({ ...W.column, steps: 256 });
  const az = averageTzBhp({
    ...W.column,
    qMscfd: (W.column.qMmscfd || 0) * 1000,
  });
  return {
    label: W.label,
    stepsUsed: cs.steps,
    pwfPsia: cs.pwf,
    pmfPsia: cs.pmf,
    convergedPwfPsia: converged.pwf,
    truncationAtStepsUsedPsi: cs.pwf - converged.pwf,
    averageTzPwfPsia: az.pwf,
    averageTzZbar: az.zBar,
    convergedMinusAverageTzPsi: converged.pwf - az.pwf,
    zAtWellheadConditions: nodalGasZ({
      pPsia: W.column.ptf, tF: W.column.whtF, gasSg: W.column.gasSg,
    }),
    gradientPsiPerFt: (cs.pwf - W.column.ptf) / W.column.tvdFt,
    definingIntegral: definingIntegralMarch({ ...W.column }),
  };
};

export const wellFrictionGroup = (W) => {
  const q = W.column.qMmscfd || 0;
  if (!(q > 0)) return null;
  const re = gasReynolds(q, W.column.gasSg, W.column.muCp, W.column.idIn);
  const fMoody = moodyFrictionFactor(re, W.column.roughnessIn / W.column.idIn);
  return {
    qMmscfd: q,
    idIn: W.column.idIn,
    relativeRoughness: W.column.roughnessIn / W.column.idIn,
    reynolds: re,
    fMoody,
    f2: csFrictionGroup({ qMmscfd: q, fMoody, idIn: W.column.idIn }),
  };
};

/**
 * THE SAME TRUNCATION VERDICT AS `columnTruncationTable`, ON THE TEACHING
 * WELLS, so a panel can put the two-station gap for a GRAVITY ONLY column and
 * for a FRICTION LOADED one side by side without reading a capstone column.
 *
 * BONNY-7 carries a static injection gradient and FORCADOS-3 carries the same
 * kind of string with gas moving up it, so the two rows differ in the friction
 * group and in nothing else that matters. The `errorRatio` column is the whole
 * argument in one number: the published two station method is not slightly
 * worse on a flowing column, it is worse by a different order, and a panel that
 * printed the two gaps without their ratio would be leaving the finding to be
 * eyeballed.
 *
 * The ratio is taken here rather than in a panel for the reason every other
 * number in this module is: a panel must not do arithmetic on engine output.
 */
export const teachingColumnTruncationTable = (
  stepList = CS_STEP_LIST,
  { gravityWell = BONNY_7, frictionWell = FORCADOS_3 } = {},
) => {
  const gravity = wellColumnStepStudy(gravityWell, stepList);
  const friction = wellColumnStepStudy(frictionWell, stepList);
  return stepList.map((steps, i) => ({
    steps,
    gravityLabel: gravityWell.label,
    frictionLabel: frictionWell.label,
    gravityOnlyPwfPsia: gravity[i].pwfPsia,
    gravityOnlyErrorPsi: gravity[i].errorVsConvergedPsi,
    gravityOnlyConvergedPwfPsia: gravity[i].convergedPwfPsia,
    frictionLoadedPwfPsia: friction[i].pwfPsia,
    frictionLoadedErrorPsi: friction[i].errorVsConvergedPsi,
    frictionLoadedConvergedPwfPsia: friction[i].convergedPwfPsia,
    errorRatio: gravity[i].errorVsConvergedPsi === 0
      ? NaN
      : friction[i].errorVsConvergedPsi / gravity[i].errorVsConvergedPsi,
  }));
};

export const wellErosionalScreen = (W) => {
  const op = wellNode(W).op;
  return EROSIONAL_C.map((cf) => {
    const check = erosionalCheck({
      inSituBpd: op.q, idIn: W.tubingIdIn, mixtureDensityLbFt3: W.mixtureDensityLbFt3, cFactor: cf.c,
    });
    return {
      cFactorId: cf.id,
      cFactor: cf.c,
      idIn: W.tubingIdIn,
      mixtureDensityLbFt3: W.mixtureDensityLbFt3,
      opQStbd: op.q,
      velocityFtS: check.velocityFtS,
      erosionalFtS: check.erosionalFtS,
      ratio: check.ratio,
      exceeded: check.exceeded,
      erosionalRateBpd: erosionalRateBpd({
        idIn: W.tubingIdIn, mixtureDensityLbFt3: W.mixtureDensityLbFt3, cFactor: cf.c,
      }),
    };
  });
};

/**
 * THE SCAN REVERSAL, on a teaching well rather than on the capstone.
 *
 * FORCADOS-3 choked back to a stated wellhead pressure, so its two crossings
 * close towards each other and its window drops below the spacing of a coarse
 * scan. The engine then loses it, finds it again, and loses it again as the
 * grid is refined, because a sign change scan sees the dip only if one of its
 * intervals STRADDLES it: whether the well is found depends on where the
 * samples land and not only on how many of them there are.
 *
 * Read the spacing column against the window column. The reversal is not a bug
 * and it is not noise. It is what a fixed resolution scan does to any well
 * whose window is narrower than one interval, and it is why the honest check on
 * a tight well is the RESIDUAL and never the scan.
 */
export const SCAN_REVERSAL_PWH_PSIA = 1469.15;

export const SCAN_REVERSAL_GRIDS = [40, 50, 60, 70, 80, 100, 120, 160, 200, 400, 900, 4000];

export const scanReversalStudy = (
  grids = SCAN_REVERSAL_GRIDS,
  pWh = SCAN_REVERSAL_PWH_PSIA,
) => wellScanStudy(FORCADOS_3, grids, { pWh });

/** The true window at the choked condition, resolved finely enough to trust. */
export const scanReversalTruth = (pWh = SCAN_REVERSAL_PWH_PSIA) => {
  const s = wellNode(FORCADOS_3, { nGrid: 20000, pWh });
  const two = s.intersections.length === 2;
  return {
    pWhPsia: pWh,
    status: s.status,
    crossings: s.intersections.length,
    unstableQStbd: two ? s.intersections[0].q : null,
    opQStbd: two ? s.intersections[1].q : null,
    windowStbd: two ? s.intersections[1].q - s.intersections[0].q : null,
    aofStbd: s.qMax,
    minimumResidualPsi: wellResidualMinimum(FORCADOS_3, { nPoints: 40001, pWh }).residualPsi,
  };
};

// ===========================================================================
// THE TWO DIGESTS. THEY HAVE DIFFERENT AUDIENCES AND THEY MUST NEVER MERGE.
//
//   digestText()          THE ONLY FILE LESSON WRITERS SEE. Built from the
//                         published goldens and from BONNY-7 and FORCADOS-3.
//                         Contains NOTHING derived from NEMBE-14: no capstone
//                         condition, no graded value, no near neighbour of one.
//                         `nodalLab.test.js` gates that mechanically, at ten
//                         times each graded field's tolerance and in the unit
//                         shifted forms too, because a value graded in one unit
//                         and restated in another is still a leak.
//
//   capstoneDigestText()  NEMBE-14 and its eighteen graded answers. For the
//                         migration headers and the go-live only. A lesson that
//                         quotes a line from this function voids the capstone.
//
// If you are adding a number for a lesson to quote, it goes in the FIRST one,
// and it has to come from a golden or from a teaching well.
// ===========================================================================

const fx = (v, dp) => (Number.isFinite(v) ? v.toFixed(dp) : String(v));
const yn = (b) => (b ? 'yes' : 'no');

/** Every number in a digest, for the coarse dimension blind sweep. */
export const digestNumbers = (text) =>
  (text.match(/-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?/g) || []).map(Number);

/**
 * THE LEAK GATE'S PARSER.
 *
 * Every number in the teaching digest that carries a unit a graded capstone
 * answer could also carry, together with that unit's DIMENSION. A learner can
 * only leak an answer by pasting a number into a box, and a box has a unit, so
 * the check that matters is dimension aware: a pressure against the pressure
 * fields, a rate against the rate fields, a productivity index against the one
 * index field. Numbers that carry no such unit, a Reynolds number, a gas
 * gravity, a friction factor, a depth in feet, a temperature in degF, a step
 * count, cannot be pasted into any of the eighteen boxes and are not compared.
 *
 * Rates are deliberately pooled across stb/d, Mscf/d, MMscf/d and bbl/d, and
 * pressures across psi and psia, because that is exactly the restatement the
 * unit shifted forms of the gate are there to catch.
 *
 * The unit alternation is ordered longest first so that "psi per stb/d" is read
 * as a slope and not as a pressure, and "stb/d/psi" as an index and not a rate.
 */
export const DIGEST_UNIT_PATTERN =
  /(-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?)\s+(psi per \(stb\/d\)\^2|psi per stb\/d|stb\/d\/psi\^2n|stb\/d\/psi|psi\/ft|psi units|MMscf\/d|Mscf\/d|bbl\/d|stb\/d|psia|psi)(?![A-Za-z0-9/])/g;

export const DIGEST_UNIT_DIMENSION = {
  psia: 'pressure',
  psi: 'pressure',
  'psi units': null,
  'stb/d': 'rate',
  'Mscf/d': 'rate',
  'MMscf/d': 'rate',
  'bbl/d': 'rate',
  'stb/d/psi': 'index',
  'stb/d/psi^2n': null,
  'psi/ft': null,
  'psi per stb/d': null,
  'psi per (stb/d)^2': null,
};

/** The dimension each graded capstone field is answered in. */
export const GRADED_FIELD_DIMENSION = {
  ipr_pi_stbd_per_psi: 'index',
  ipr_q_at_bubble_stbd: 'rate',
  ipr_q_at_1650psia_stbd: 'rate',
  ipr_aof_stbd: 'rate',
  ipr_pwf_at_2400stbd_psia: 'pressure',
  ipr_pwf_at_3300stbd_psia: 'pressure',
  vlp_min_q_stbd: 'rate',
  vlp_min_bhp_psia: 'pressure',
  vlp_loaded_end_bhp_psia: 'pressure',
  vlp_friction_end_bhp_psia: 'pressure',
  liftgas_valve_pwf_psia: 'pressure',
  liftgas_mid_pmf_psia: 'pressure',
  node_op_q_stbd: 'rate',
  node_op_pwf_psia: 'pressure',
  node_unstable_q_stbd: 'rate',
  node_unstable_pwf_psia: 'pressure',
  sweep_pwh1176_q_stbd: 'rate',
  sweep_pwh1176_pwf_psia: 'pressure',
};

/**
 * The grading tolerance of each capstone field, exactly as the capstone
 * publishes them. Carried here so the teaching digest can censor itself rather
 * than relying on anybody remembering to check.
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
 * `abs(v_got - v_exp) <= v_tol`, with no division by v_exp anywhere. The same
 * migration's own petrophysics answer key settles it beyond argument: net pay
 * 18.0 m carries tol 0.75, which is three quarters of a METRE and plainly not
 * seventy five per cent, and average porosity 0.208 v/v carries tol 0.01.
 *
 * So `vlp_min_bhp_psia` is accepted within 0.0014 psi of 2849.67283735105, not
 * within 3.99 psi of it. The bands are thousands of times tighter than a
 * relative reading of the same numbers, and a guard built on the relative
 * reading withholds a great deal of good teaching material for nothing. Read
 * the grader; do not infer it.
 */
export const CAPSTONE_TOLERANCES = {
  ipr_pi_stbd_per_psi: 1e-6,
  ipr_q_at_bubble_stbd: 3e-4,
  ipr_q_at_1650psia_stbd: 1.4e-3,
  ipr_aof_stbd: 1.9e-3,
  ipr_pwf_at_2400stbd_psia: 1e-3,
  ipr_pwf_at_3300stbd_psia: 5.5e-4,
  vlp_min_q_stbd: 6.4e-4,
  vlp_min_bhp_psia: 1.4e-3,
  vlp_loaded_end_bhp_psia: 2.5e-3,
  vlp_friction_end_bhp_psia: 2.6e-3,
  liftgas_valve_pwf_psia: 7.6e-4,
  liftgas_mid_pmf_psia: 6.9e-4,
  node_op_q_stbd: 4.6e-4,
  node_op_pwf_psia: 1.5e-3,
  node_unstable_q_stbd: 4.5e-4,
  node_unstable_pwf_psia: 1.5e-3,
  sweep_pwh1176_q_stbd: 5.7e-4,
  sweep_pwh1176_pwf_psia: 1.5e-3,
};

/**
 * How much wider than the grader's own acceptance band a teaching number has
 * to stand clear. Ten, so a lesson that rounds a number in prose still cannot
 * land on a graded answer. Ten times an ABSOLUTE tolerance is still a very
 * small target: ten times 0.0014 psi is 0.014 psi.
 */
export const LEAK_GUARD_MARGIN = 10;

/** The unit shifts a number can be restated under and still be the same answer. */
export const LEAK_GUARD_SCALINGS = [
  { factor: 1, tag: 'as graded' },
  { factor: 1000, tag: 'x1000' },
  { factor: 0.001, tag: 'x0.001' },
];

/**
 * Every forbidden neighbourhood: eighteen graded answers, three unit shiftings
 * each, each with the dimension it is answered in and a band ten times the
 * grader's own.
 */
export const leakGuardTargets = () => {
  const values = capstoneValues();
  const out = [];
  Object.keys(CAPSTONE_TOLERANCES).forEach((key) => {
    LEAK_GUARD_SCALINGS.forEach(({ factor, tag }) => {
      const v = values[key] * factor;
      // The tolerance is absolute, so under a unit shift it shifts with the
      // value: a band of 0.0014 psi restated in thousands is 0.0000014.
      const gradingBand = CAPSTONE_TOLERANCES[key] * Math.abs(factor);
      out.push({
        key,
        tag,
        dimension: GRADED_FIELD_DIMENSION[key],
        value: v,
        gradingBand,
        band: LEAK_GUARD_MARGIN * gradingBand,
      });
    });
  });
  return out;
};

/**
 * Is this number, carrying this dimension, inside a forbidden neighbourhood?
 * Returns the target it collides with, or null.
 */
export const leakGuardHit = (value, dimension, targets = leakGuardTargets()) => {
  if (!Number.isFinite(value) || !dimension) return null;
  for (const t of targets) {
    if (t.dimension !== dimension) continue;
    if (Math.abs(value - t.value) < t.band) return t;
  }
  return null;
};

export const LEAK_WITHHELD = '[withheld: too close to a graded capstone answer]';

/**
 * Mask every dimensioned number in one rendered digest line that stands inside
 * a forbidden neighbourhood. The label keeps its shape and the reason is
 * printed in place of the number, so a reader can see that something was
 * removed and why rather than finding a silent hole.
 */
export const censorDigestLine = (line, targets = leakGuardTargets()) => {
  let withheld = 0;

  // Pass one, DIMENSION AWARE at ten times the grading band. A pressure against
  // the ten pressure answers, a rate against the seven rate answers, an index
  // against the one index answer, each in all three unit shiftings. This is the
  // margin: a lesson that rounds a number in prose still cannot land on a
  // graded answer.
  const unitRe = new RegExp(DIGEST_UNIT_PATTERN.source, 'g');
  let out = line.replace(unitRe, (whole, numText, unit) => {
    const dimension = DIGEST_UNIT_DIMENSION[unit];
    if (!leakGuardHit(Number(numText), dimension, targets)) return whole;
    withheld += 1;
    return `${LEAK_WITHHELD} ${unit}`;
  });

  // Pass two, DIMENSION BLIND at the grading band itself, unshifted. This
  // catches the number that would literally be marked correct if it were pasted
  // into a graded box, whatever quantity it actually measures, because the
  // grader compares numbers and never checks what they were a measurement of.
  // Nothing in the goldens or in the two teaching wells trips it, and that is
  // the point of running it: the published cases are CLEAN, measured against
  // the grader's own absolute bands, and this pass is what lets that be
  // asserted rather than assumed.
  const bareTargets = targets.filter((t) => t.tag === 'as graded');
  out = out.replace(/-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?/g, (numText) => {
    const v = Number(numText);
    const hit = bareTargets.some((t) => Math.abs(v - t.value) < t.gradingBand);
    if (!hit) return numText;
    withheld += 1;
    return LEAK_WITHHELD;
  });

  return { line: out, withheld };
};

/** Dimensioned numbers in a digest, line by line, for the leak gate. */
export const digestDimensionedNumbers = (text) => {
  const out = [];
  text.split('\n').forEach((line, i) => {
    if (!line || line.startsWith('#')) return;
    const re = new RegExp(DIGEST_UNIT_PATTERN.source, 'g');
    let m = re.exec(line);
    while (m) {
      const dimension = DIGEST_UNIT_DIMENSION[m[2]];
      if (dimension) out.push({ line: i + 1, text: line, value: Number(m[1]), unit: m[2], dimension });
      m = re.exec(line);
    }
  });
  return out;
};

// ---------------------------------------------------------------------------
// THE TEACHING DIGEST.
// ---------------------------------------------------------------------------

/**
 * The unit every golden input key is carried in. Without this the guard cannot
 * see that a golden's reservoir pressure is a PRESSURE, and a condition printed
 * without its unit is exactly how a number slips past a dimension aware check.
 * One published reservoir pressure really does sit inside the grading band of a
 * capstone answer, so this map is load bearing and not decoration.
 */
export const GOLDEN_INPUT_UNITS = {
  pr: 'psia',
  pb: 'psia',
  ptf: 'psia',
  testPwf: 'psia',
  testQ: 'stb/d',
  qmax: 'stb/d',
  pi: 'stb/d/psi',
  mdFt: 'ft',
  tvdFt: 'ft',
  whtF: 'degF',
  bhtF: 'degF',
  qMmscfd: 'MMscf/d',
  idIn: 'in',
  roughnessIn: 'in',
  muCp: 'cp',
  gasSg: 'air = 1',
  fMoody: 'dimensionless',
  c: 'dimensionless',
  n: 'dimensionless',
  a: 'dimensionless',
  b: 'dimensionless',
};

export const teachingDigest = () => {
  const rows = [];
  const head = (text) => rows.push({ kind: 'heading', text });
  const add = (source, label, value, unit = '') =>
    rows.push({ kind: 'value', source, label, value: String(value), unit });

  // ---------------------------------------------------------------- goldens
  head('SOURCE 1: THE PUBLISHED GOLDEN CASES (test-data/production/goldens)');
  head('Cut by an independent oracle from the published method statements.');

  GOLDEN.zFactor.forEach((c) => add(
    `golden zFactor ${c.pPsia} psia ${c.tF} degF sg ${c.gasSg}`,
    'z factor',
    fx(nodalGasZ({ pPsia: c.pPsia, tF: c.tF, gasSg: c.gasSg }), 8),
    'dimensionless',
  ));
  GOLDEN.friction.forEach((c) => add(
    `golden friction Re ${c.re} relative roughness ${c.relRough}`,
    'Moody friction factor',
    fx(moodyFrictionFactor(c.re, c.relRough), 8),
    'dimensionless',
  ));

  head('Golden oil inflow: five families, forward, inverse and slope');
  goldenOilIprCases().forEach((c) => {
    const src = `golden oil IPR ${c.id}`;
    add(src, 'model', c.model);
    Object.entries(c.inputs).forEach(([k, v]) => add(src, `input ${k}`, String(v), GOLDEN_INPUT_UNITS[k] || ''));
    add(src, 'absolute open flow', fx(c.aofStbd, 6), 'stb/d');
    add(src, 'curve rows', String(c.curveRows), 'points');
    c.forward.forEach((r) => add(src, `rate at ${fx(r.pwfPsia, 0)} psia`, fx(r.qStbd, 6), 'stb/d'));
    c.inverse.forEach((r) => add(src, `pressure at ${fx(r.qStbd, 4)} stb/d`, fx(r.pwfPsia, 6), 'psia'));
    c.slopes.forEach((r) => add(src, `inflow slope at ${fx(r.qStbd, 4)} stb/d`, fx(r.dpwfdqPsiPerStbd, 8), 'psi per stb/d'));
  });

  head('Golden calibration: one production test pins one curve');
  goldenCalibrationCases().forEach((c) => {
    const src = `golden calibration ${c.id}`;
    add(src, 'model', c.model);
    add(src, 'reservoir pressure', String(c.inputs.pr), 'psia');
    add(src, 'bubble point pressure', String(c.inputs.pb), 'psia');
    add(src, 'test rate', String(c.inputs.testQ), 'stb/d');
    add(src, 'test flowing pressure', String(c.inputs.testPwf), 'psia');
    if (Number.isFinite(c.piStbdPerPsi)) add(src, 'productivity index', fx(c.piStbdPerPsi, 8), 'stb/d/psi');
    if (Number.isFinite(c.fetkovichC)) add(src, 'Fetkovich C', String(c.fetkovichC), 'stb/d/psi^2n');
    add(src, 'absolute open flow', fx(c.aofStbd, 6), 'stb/d');
    add(src, 'rate reproduced at the test pressure', fx(c.qAtTestPwfStbd, 6), 'stb/d');
  });

  head('Golden depletion: each family shifted by its own published rule');
  goldenFutureIprCases().forEach((c) => {
    const src = `golden depletion ${c.id}`;
    add(src, 'model', c.model);
    add(src, 'reservoir pressure now', String(c.prPsia), 'psia');
    add(src, 'reservoir pressure later', String(c.prFuturePsia), 'psia');
    add(src, 'future absolute open flow', fx(c.aofStbd, 6), 'stb/d');
    add(src, 'future pressure at half the open flow', fx(c.pwfAtHalfAofPsia, 6), 'psia');
  });

  head('Golden gas deliverability, and the sampled reading bias (engine defect a)');
  goldenGasIprCases().forEach((c) => {
    const src = `golden gas IPR ${c.id}`;
    add(src, 'model', c.model);
    Object.entries(c.inputs).forEach(([k, v]) => add(src, `input ${k}`, String(v), GOLDEN_INPUT_UNITS[k] || ''));
    add(src, 'absolute open flow', fx(c.aofMscfd, 6), 'Mscf/d');
    c.forward.forEach((r) => add(src, `rate at ${fx(r.pwfPsia, 0)} psia`, fx(r.qMscfd, 6), 'Mscf/d'));
    c.inverse.forEach((r) => {
      add(src, `exact pressure at ${fx(r.qMscfd, 4)} Mscf/d`, fx(r.pwfPsia, 6), 'psia');
    });
    c.chord40.forEach((r) => {
      add(src, `sampled chord pressure at ${fx(r.qMscfd, 4)} Mscf/d`, fx(r.chordPwfPsia, 6), 'psia');
      add(src, `chord reading bias at ${fx(r.qMscfd, 4)} Mscf/d`, fx(r.biasPsi, 6), 'psi');
    });
  });

  head('Golden dry gas columns: Cullender and Smith, and its truncation (engine defect b)');
  goldenTubingCases().forEach((c) => {
    const src = `golden column ${c.id}`;
    Object.entries(c.inputs).forEach(([k, v]) => add(src, `input ${k}`, String(v), GOLDEN_INPUT_UNITS[k] || ''));
    if (c.inputs.qMmscfd > 0) {
      add(src, 'Reynolds number', fx(c.reynolds, 2), 'dimensionless');
      add(src, 'Moody friction factor used', fx(c.golden.fMoodyUsed, 8), 'dimensionless');
      add(src, 'friction group F squared', fx(c.frictionGroupF2, 8), 'dimensionless');
    }
    add(src, 'converged bottomhole pressure at 256 steps', fx(c.convergedPwfPsia, 6), 'psia');
    add(src, 'converged midpoint pressure at 256 steps', fx(c.convergedPmfPsia, 6), 'psia');
    add(src, 'published two station bottomhole pressure', fx(c.publishedTwoStationPwfPsia, 6), 'psia');
    add(src, 'two station truncation error', fx(c.twoStationErrorPsi, 6), 'psi');
    add(src, 'average T and z bottomhole pressure', fx(c.averageTzPwfPsia, 6), 'psia');
    add(src, 'defining integral', fx(c.definingIntegral.integral, 4), 'psi units');
    add(src, 'defining integral target 18.75 gammaG L', fx(c.definingIntegral.target, 4), 'psi units');
  });

  head('Golden outflow curve: a DRY GAS column has no J in it');
  const gtc = goldenTubingCurveCase();
  add('golden outflow curve', 'sample count', String(GOLDEN.tubingCurve.nPoints), 'points');
  add('golden outflow curve', 'rate bound', fx(GOLDEN.tubingCurve.qMax, 6), 'Mscf/d');
  add('golden outflow curve', 'minimum rate', fx(gtc.minimum.q, 6), 'Mscf/d');
  add('golden outflow curve', 'minimum bottomhole pressure', fx(gtc.minimum.bhp, 6), 'psia');
  add('golden outflow curve', 'the minimum IS the lowest sampled rate', yn(gtc.minimumIsLowestSampledRate));
  gtc.curve.filter((_, i) => i % 4 === 0).forEach((p) => {
    add('golden outflow curve', `bottomhole pressure at ${fx(p.q, 4)} Mscf/d`, fx(p.bhp, 6), 'psia');
  });

  head('Golden nodes: crossings, stability and the operating point');
  goldenNodeCases().forEach((c) => {
    const src = `golden node ${c.id}`;
    add(src, 'note', c.note);
    add(src, 'scan resolution used', String(c.nGrid), 'grid points');
    add(src, 'absolute open flow', fx(c.aofStbd, 6), 'stb/d');
    add(src, 'status', c.status);
    add(src, 'crossings found', String(c.intersections.length), 'crossings');
    c.intersections.forEach((x, i) => {
      add(src, `crossing ${i + 1} rate`, fx(x.q, 6), 'stb/d');
      add(src, `crossing ${i + 1} flowing pressure`, fx(x.pwf, 6), 'psia');
      add(src, `crossing ${i + 1} is stable`, yn(x.stable));
    });
    c.probes.forEach((p) => {
      add(src, `inflow pressure at ${fx(p.qStbd, 4)} stb/d`, fx(p.iprPwfPsia, 6), 'psia');
      add(src, `outflow pressure at ${fx(p.qStbd, 4)} stb/d`, fx(p.vlpBhpPsia, 6), 'psia');
      add(src, `residual at ${fx(p.qStbd, 4)} stb/d`, fx(p.residualPsi, 6), 'psi');
    });
    // The published probes start ABOVE the lower crossing on the two crossing
    // case, so its residual is already negative at the first printed row and
    // the two crossing story cannot be read off the golden's own numbers.
    // These rows go below it, and carry both slopes and their difference.
    goldenNodeResidualTable(c.id).forEach((r) => {
      const tag = r.isCrossing ? ' (AT A CROSSING)' : '';
      add(src, `residual table, inflow pressure at ${fx(r.qStbd, 4)} stb/d${tag}`, fx(r.iprPwfPsia, 6), 'psia');
      add(src, `residual table, outflow pressure at ${fx(r.qStbd, 4)} stb/d${tag}`, fx(r.vlpBhpPsia, 6), 'psia');
      add(src, `residual table, residual at ${fx(r.qStbd, 4)} stb/d${tag}`, fx(r.residualPsi, 6), 'psi');
      add(src, `residual table, inflow slope at ${fx(r.qStbd, 4)} stb/d`, fx(r.inflowSlopePsiPerStbd, 8), 'psi per stb/d');
      add(src, `residual table, outflow slope at ${fx(r.qStbd, 4)} stb/d`, fx(r.outflowSlopePsiPerStbd, 8), 'psi per stb/d');
      add(src, `residual table, residual slope at ${fx(r.qStbd, 4)} stb/d`, fx(r.residualSlopePsiPerStbd, 8), 'psi per stb/d');
    });
  });

  head('Golden pinched instrument: a scan too coarse loses the well (engine defect c)');
  goldenPinchedScanStudy([40, 100, 110, 200, 400, 900, 4000]).forEach((r) => {
    const src = `golden pinched scan nGrid ${r.nGrid}`;
    add(src, 'scan spacing', fx(r.spacingStbd, 6), 'stb/d');
    add(src, 'true window between the crossings', fx(r.trueWindowStbd, 6), 'stb/d');
    add(src, 'status', r.status);
    add(src, 'crossings found', String(r.crossings), 'crossings');
    if (r.opQStbd !== null) add(src, 'operating rate', fx(r.opQStbd, 6), 'stb/d');
  });

  head('Golden gas nodes: deliverability against the column');
  goldenGasNodeCases().forEach((c) => {
    const src = `golden gas node ${c.id}`;
    add(src, 'absolute open flow', fx(c.aofMscfd, 6), 'Mscf/d');
    add(src, 'status', c.status);
    add(src, 'crossings found', String(c.intersections.length), 'crossings');
    add(src, 'operating rate', fx(c.op.q, 6), 'Mscf/d');
    add(src, 'operating flowing pressure', fx(c.op.pwf, 6), 'psia');
    add(src, 'operating rate read off the sampled inflow', fx(c.opFromChordIpr.q, 6), 'Mscf/d');
    add(src, 'rate bias from the sampled reading', fx(c.chordRateBiasMscfd, 6), 'Mscf/d');
  });
  const gsw = goldenSweepCase();
  gsw.rows.forEach((r) => {
    const src = `golden wellhead sweep ${r.label}`;
    add(src, 'status', r.status);
    add(src, 'operating rate', fx(r.q, 6), 'Mscf/d');
    add(src, 'operating flowing pressure', fx(r.pwf, 6), 'psia');
  });

  head('Golden wellhead hardware: erosional limits, Gilbert coefficients, hydrates');
  chokeErosionalCases().forEach((c) => {
    const src = `golden erosional rho ${c.rhoLbFt3} lb/ft3 C ${c.cFactor}`;
    add(src, 'erosional velocity', fx(c.erosionalFtS, 6), 'ft/s');
    add(src, 'erosional rate limit in 2.441 in tubing', fx(c.maxRateBpd_2441, 4), 'bbl/d in situ');
  });
  chokeVelocityCases().forEach((c) => {
    const src = `golden velocity ${c.idIn} in at ${c.inSituBpd} bbl/d`;
    add(src, 'mixture velocity', fx(c.velocityFtS, 6), 'ft/s');
    add(src, 'flow area', fx(c.areaFt2, 8), 'ft2');
  });
  const gil = chokeGilbertFit();
  add('golden Gilbert fit, clean tests', 'leading constant c', fx(gil.clean.c, 6), 'dimensionless');
  add('golden Gilbert fit, clean tests', 'gas liquid ratio exponent m', fx(gil.clean.m, 6), 'dimensionless');
  add('golden Gilbert fit, clean tests', 'bean exponent n', fx(gil.clean.n, 6), 'dimensionless');
  add('golden Gilbert fit, clean tests', 'RMSE', fx(gil.clean.rmsePct, 6), 'percent');
  add('golden Gilbert fit, noisy tests', 'leading constant c', fx(gil.noisy.c, 6), 'dimensionless');
  add('golden Gilbert fit, noisy tests', 'gas liquid ratio exponent m', fx(gil.noisy.m, 6), 'dimensionless');
  add('golden Gilbert fit, noisy tests', 'bean exponent n', fx(gil.noisy.n, 6), 'dimensionless');
  add('golden Gilbert fit, noisy tests', 'RMSE', fx(gil.noisy.rmsePct, 6), 'percent');
  chokeHydrateCases().forEach((c) => add(
    `golden hydrate at ${c.pPsia} psia`, 'Hammerschmidt formation temperature', fx(c.formationF, 6), 'degF',
  ));

  // -------------------------------------------------------- teaching wells
  TEACHING_WELLS.forEach((W) => {
    const src = `teaching well ${W.label}`;
    const inflow = wellInflowReadings(W);
    const out = wellOutflowReadings(W);
    const win = wellWindow(W);
    const col = wellColumnVsAverageTz(W);
    const cross = wellLimbCrossover(W);
    const resid = wellResidualMinimum(W);

    head(`SOURCE ${TEACHING_WELLS.indexOf(W) + 2}: TEACHING WELL ${W.label}. ${W.note}`);

    add(src, 'note', W.note);
    add(src, 'inflow model', W.iprModel);
    add(src, 'reservoir pressure', String(W.prPsia), 'psia');
    add(src, 'bubble point pressure', String(W.pbPsia), 'psia');
    add(src, 'production test rate', String(W.testQStbd), 'stb/d');
    add(src, 'production test flowing pressure', String(W.testPwfPsia), 'psia');
    add(src, 'production test drawdown', fx(inflow.testDrawdownPsi, 0), 'psi');
    add(src, 'the test was taken below the bubble point', yn(inflow.testIsBelowBubblePoint));
    add(src, 'IPR curve rows', String(inflow.curveRows), 'points');
    add(src, 'productivity index', fx(inflow.piStbdPerPsi, 8), 'stb/d/psi');
    add(src, 'absolute open flow', fx(inflow.aofStbd, 6), 'stb/d');
    add(src, 'rate at the bubble point', fx(inflow.qAtBubblePointStbd, 6), 'stb/d');
    add(src, 'undersaturated block, PI times drawdown to pb', fx(inflow.qAtBubbleFromPiStbd, 6), 'stb/d');
    add(src, 'saturated Vogel block, PI times pb over 1.8', fx(inflow.vogelBlockStbd, 6), 'stb/d');
    add(src, 'saturated share of the open flow', fx(inflow.saturatedShareOfAof, 8), 'fraction');
    inflow.forward.forEach((r) => {
      add(src, `inflow rate at ${fx(r.pwfPsia, 0)} psia`, fx(r.qStbd, 6), 'stb/d');
      add(src, `drawdown at ${fx(r.pwfPsia, 0)} psia`, fx(r.drawdownPsi, 4), 'psi');
    });
    inflow.inverse.forEach((r) => {
      add(src, `inflow pressure at ${fx(r.qStbd, 0)} stb/d`, fx(r.pwfPsia, 6), 'psia');
      add(src, `rate as a fraction of open flow at ${fx(r.qStbd, 0)} stb/d`, fx(r.fracOfAof, 8), 'fraction');
    });
    wellInflowSlopes(W).forEach((r) => add(
      src, `inflow slope at ${fx(r.qStbd, 0)} stb/d`, fx(r.dpwfdqPsiPerStbd, 8), 'psi per stb/d',
    ));
    add(src, 'straight line inflow slope, minus one over PI', fx(-1 / inflow.piStbdPerPsi, 8), 'psi per stb/d');
    // BOTH HALVES OF THE SLOPE TEST, at the same rates. The criterion compares
    // two slopes and looks at their DIFFERENCE, which is the slope of the
    // residual: positive and the crossing holds, negative and it runs away.
    wellSlopeTable(W).forEach((r) => {
      add(src, `outflow slope at ${fx(r.qStbd, 0)} stb/d`, fx(r.outflowSlopePsiPerStbd, 8), 'psi per stb/d');
      add(src, `residual slope at ${fx(r.qStbd, 0)} stb/d`, fx(r.residualSlopePsiPerStbd, 8), 'psi per stb/d');
      add(src, `the outflow is falling at ${fx(r.qStbd, 0)} stb/d`, yn(r.outflowIsFalling));
      add(src, `the residual is rising at ${fx(r.qStbd, 0)} stb/d`, yn(r.residualIsRising));
    });

    const aofs = wellModelAofs(W);
    const cmpLabel = aofs.calibrationIsCorrupted
      ? 'CORRUPTED comparison, the test sits BELOW the bubble point'
      : 'CONTROLLED comparison, the test sits ABOVE the bubble point';
    add(src, 'three model comparison kind', cmpLabel);
    add(src, 'open flow, straight line from the same test', fx(aofs.straightLineStbd, 6), 'stb/d');
    add(src, 'open flow, Vogel from the same test', fx(aofs.vogelStbd, 6), 'stb/d');
    add(src, 'open flow, composite from the same test', fx(aofs.compositeStbd, 6), 'stb/d');
    add(src, 'productivity index the straight line backs out', fx(aofs.straightLinePiStbdPerPsi, 8), 'stb/d/psi');
    add(src, 'productivity index the composite backs out', fx(aofs.compositePiStbdPerPsi, 8), 'stb/d/psi');
    add(src, 'productivity index error from this calibration', fx(aofs.piErrorStbdPerPsi, 8), 'stb/d/psi');
    wellModelComparison(W).forEach((r) => {
      add(src, `rate at ${fx(r.pwfPsia, 0)} psia, straight line`, fx(r.straightLineStbd, 6), 'stb/d');
      add(src, `rate at ${fx(r.pwfPsia, 0)} psia, Vogel`, fx(r.vogelStbd, 6), 'stb/d');
      add(src, `rate at ${fx(r.pwfPsia, 0)} psia, composite`, fx(r.compositeStbd, 6), 'stb/d');
      add(src, `straight line minus composite at ${fx(r.pwfPsia, 0)} psia`, fx(r.straightLineMinusCompositeStbd, 6), 'stb/d');
      add(src, `Vogel minus composite at ${fx(r.pwfPsia, 0)} psia`, fx(r.vogelMinusCompositeStbd, 6), 'stb/d');
    });

    add(src, 'wellhead pressure', String(W.pWhPsia), 'psia');
    add(src, 'gravity constant gGrav', String(W.gGravPsi), 'psi');
    add(src, 'lightening constant qRef', String(W.qRefStbd), 'stb/d');
    add(src, 'friction constant kFric', String(W.kFricPsiPerStbd2), 'psi per (stb/d)^2');
    add(src, 'tubing curve sample count', String(W.vlpPoints), 'points');
    add(src, 'dead column at zero rate', fx(out.deadColumnPsia, 0), 'psia');
    add(src, 'dead column above reservoir pressure', fx(out.deadColumnAbovePrPsi, 0), 'psi');
    add(src, 'the column outweighs the reservoir at low rate', yn(out.columnOutweighsReservoirAtLowRate));
    add(src, 'tubing curve loaded end rate', fx(out.loadedEndQStbd, 6), 'stb/d');
    add(src, 'tubing curve loaded end bhp', fx(out.loadedEndBhpPsia, 6), 'psia');
    add(src, 'tubing curve friction end rate', fx(out.frictionEndQStbd, 6), 'stb/d');
    add(src, 'tubing curve friction end bhp', fx(out.frictionEndBhpPsia, 6), 'psia');
    add(src, 'sampled tubing minimum rate', fx(out.sampledMinimumQStbd, 6), 'stb/d');
    add(src, 'sampled tubing minimum bhp', fx(out.sampledMinimumBhpPsia, 6), 'psia');
    add(src, 'true tubing minimum rate at 20001 points', fx(out.trueMinimumQStbd, 6), 'stb/d');
    add(src, 'true tubing minimum bhp at 20001 points', fx(out.trueMinimumBhpPsia, 6), 'psia');
    add(src, 'sampled minus true minimum rate', fx(out.sampledMinusTrueQStbd, 6), 'stb/d');
    add(src, 'sampled minus true minimum bhp', fx(out.sampledMinusTrueBhpPsi, 8), 'psi');
    add(src, 'friction overtakes gravity at', fx(cross.qStbd, 6), 'stb/d');
    add(src, 'bhp where friction overtakes gravity', fx(cross.bhpPsia, 6), 'psia');
    wellDecomposition(W).filter((_, i) => i % 4 === 0).forEach((r) => {
      add(src, `gravity term at ${fx(r.qStbd, 2)} stb/d`, fx(r.gravityPsi, 6), 'psi');
      add(src, `friction term at ${fx(r.qStbd, 2)} stb/d`, fx(r.frictionPsi, 6), 'psi');
      add(src, `outflow bhp at ${fx(r.qStbd, 2)} stb/d`, fx(r.bhpPsia, 6), 'psia');
      add(src, `gravity share at ${fx(r.qStbd, 2)} stb/d`, fx(r.gravityShare, 8), 'fraction');
    });
    const sens = wellMinimumSensitivity(W);
    sens.wellheadPressure.forEach((r) => {
      add(src, `tubing minimum rate at pWh ${r.pWhPsia} psia`, fx(r.minQStbd, 6), 'stb/d');
      add(src, `tubing minimum bhp at pWh ${r.pWhPsia} psia`, fx(r.minBhpPsia, 6), 'psia');
    });
    sens.lighteningConstant.forEach((r) => {
      add(src, `tubing minimum rate at qRef ${fx(r.qRefStbd, 2)} stb/d`, fx(r.minQStbd, 6), 'stb/d');
      add(src, `tubing minimum bhp at qRef ${fx(r.qRefStbd, 2)} stb/d`, fx(r.minBhpPsia, 6), 'psia');
    });
    sens.frictionConstant.forEach((r) => {
      add(src, `tubing minimum rate at kFric ${r.kFricPsiPerStbd2}`, fx(r.minQStbd, 6), 'stb/d');
      add(src, `tubing minimum bhp at kFric ${r.kFricPsiPerStbd2}`, fx(r.minBhpPsia, 6), 'psia');
    });

    add(src, 'lift gas column wellhead pressure', String(W.column.ptf), 'psia');
    add(src, 'lift gas column gas gravity', String(W.column.gasSg), 'air = 1');
    add(src, 'lift gas column measured depth', String(W.column.mdFt), 'ft');
    add(src, 'lift gas column true vertical depth', String(W.column.tvdFt), 'ft');
    add(src, 'lift gas column wellhead temperature', String(W.column.whtF), 'degF');
    add(src, 'lift gas column bottomhole temperature', String(W.column.bhtF), 'degF');
    if (W.column.qMmscfd) add(src, 'lift gas column rate', String(W.column.qMmscfd), 'MMscf/d');
    add(src, 'column steps used', String(col.stepsUsed), 'sub-intervals');
    add(src, 'column bottomhole pressure at the steps used', fx(col.pwfPsia, 6), 'psia');
    add(src, 'column midpoint pressure at the steps used', fx(col.pmfPsia, 6), 'psia');
    add(src, 'column converged bottomhole pressure at 256 steps', fx(col.convergedPwfPsia, 6), 'psia');
    add(src, 'column truncation at the steps used', fx(col.truncationAtStepsUsedPsi, 8), 'psi');
    add(src, 'column average T and z bottomhole pressure', fx(col.averageTzPwfPsia, 6), 'psia');
    add(src, 'column average z', fx(col.averageTzZbar, 8), 'dimensionless');
    add(src, 'converged minus average T and z', fx(col.convergedMinusAverageTzPsi, 6), 'psi');
    add(src, 'z at the column wellhead conditions', fx(col.zAtWellheadConditions, 8), 'dimensionless');
    add(src, 'column pressure gradient', fx(col.gradientPsiPerFt, 8), 'psi/ft');
    add(src, 'column defining integral', fx(col.definingIntegral.integral, 4), 'psi units');
    add(src, 'column defining integral target', fx(col.definingIntegral.target, 4), 'psi units');
    wellColumnStepStudy(W).forEach((r) => {
      add(src, `column bhp at ${r.requestedSteps} steps`, fx(r.pwfPsia, 6), 'psia');
      add(src, `column truncation at ${r.requestedSteps} steps`, fx(r.errorVsConvergedPsi, 8), 'psi');
    });
    const fg = wellFrictionGroup(W);
    if (fg) {
      add(src, 'column tubing ID', String(fg.idIn), 'in');
      add(src, 'column relative roughness', fx(fg.relativeRoughness, 8), 'dimensionless');
      add(src, 'column Reynolds number', fx(fg.reynolds, 2), 'dimensionless');
      add(src, 'column Moody friction factor', fx(fg.fMoody, 8), 'dimensionless');
      add(src, 'column friction group F squared', fx(fg.f2, 8), 'dimensionless');
    }

    add(src, 'scan resolution used at the node', String(W.nGrid), 'grid points');
    add(src, 'node status', win.status);
    add(src, 'crossings found', String(win.crossings), 'crossings');
    add(src, 'operating rate', fx(win.opQStbd, 6), 'stb/d');
    add(src, 'operating flowing pressure', fx(win.opPwfPsia, 6), 'psia');
    add(src, 'operating rate as a fraction of open flow', fx(win.opAsFractionOfAof, 8), 'fraction');
    add(src, 'drawdown at the operating point', fx(win.drawdownAtOpPsi, 6), 'psi');
    add(src, 'tubing minimum rate', fx(win.tubingMinimumQStbd, 6), 'stb/d');
    add(src, 'tubing minimum bhp', fx(win.tubingMinimumBhpPsia, 6), 'psia');
    add(src, 'operating point above the tubing minimum', fx(win.opAboveTubingMinimumPsi, 6), 'psi');
    add(src, 'operating point right of the tubing minimum', fx(win.opRightOfTubingMinimumStbd, 6), 'stb/d');
    add(src, 'the operating point is on the rising friction limb', yn(win.operatingPointIsOnTheFrictionLimb));
    add(src, 'the operating point is on the FALLING gravity limb', yn(!win.operatingPointIsOnTheFrictionLimb));
    add(src, 'operating point relative to the tubing minimum', fx(win.opRightOfTubingMinimumStbd, 6), 'stb/d');
    add(src, 'outflow slope at the operating point', fx(outflowSlope(wellOutflow(W), win.opQStbd), 8), 'psi per stb/d');
    add(src, 'inflow slope at the operating point', fx(inflowSlope(wellIpr(W), win.opQStbd), 8), 'psi per stb/d');
    add(src, 'residual slope at the operating point', fx(
      outflowSlope(wellOutflow(W), win.opQStbd) - inflowSlope(wellIpr(W), win.opQStbd), 8,
    ), 'psi per stb/d');
    if (win.unstableQStbd !== null) {
      add(src, 'unstable heading crossing rate', fx(win.unstableQStbd, 6), 'stb/d');
      add(src, 'unstable heading crossing flowing pressure', fx(win.unstablePwfPsia, 6), 'psia');
      add(src, 'STABLE WINDOW WIDTH', fx(win.widthStbd, 6), 'stb/d');
      add(src, 'stable window pressure span', fx(win.pressureSpanPsi, 6), 'psi');
      add(src, 'stable window as a fraction of open flow', fx(win.widthAsFractionOfAof, 8), 'fraction');
    }
    add(src, 'residual at the lowest sampled rate', fx(resid.residualAtLowestSampledRatePsi, 6), 'psi');
    add(src, 'lowest sampled rate on the scan', fx(resid.lowestSampledRateStbd, 6), 'stb/d');
    add(src, 'minimum residual', fx(resid.residualPsi, 6), 'psi');
    add(src, 'rate at the minimum residual', fx(resid.qStbd, 6), 'stb/d');
    add(src, 'residual at the highest sampled rate', fx(resid.residualAtHighestSampledRatePsi, 6), 'psi');
    add(src, 'residual sign changes', String(resid.signChanges), 'changes');
    // THE DIP AS A SHAPE, not as three scattered values: the bottom of the
    // scan, two rows on the way down, a bracket either side of every crossing,
    // the bottom of the dip, and the top of the scan.
    wellResidualTable(W).forEach((r) => {
      const tag = r.isCrossing ? ' (AT A CROSSING)' : (r.isDip ? ' (AT THE DIP)' : '');
      add(src, `residual table, inflow pressure at ${fx(r.qStbd, 4)} stb/d${tag}`, fx(r.iprPwfPsia, 6), 'psia');
      add(src, `residual table, outflow pressure at ${fx(r.qStbd, 4)} stb/d${tag}`, fx(r.vlpBhpPsia, 6), 'psia');
      add(src, `residual table, residual at ${fx(r.qStbd, 4)} stb/d${tag}`, fx(r.residualPsi, 6), 'psi');
    });
    wellScanStudy(W).forEach((r) => {
      add(src, `scan spacing at nGrid ${r.nGrid}`, fx(r.spacingStbd, 6), 'stb/d');
      add(src, `status at nGrid ${r.nGrid}`, r.status);
      add(src, `crossings at nGrid ${r.nGrid}`, String(r.crossings), 'crossings');
      if (r.opQStbd !== null) add(src, `operating rate at nGrid ${r.nGrid}`, fx(r.opQStbd, 6), 'stb/d');
    });
    wellPwhSweepDetail(W).forEach((r) => {
      add(src, `status at pWh ${r.pWhPsia} psia`, r.status);
      add(src, `operating rate at pWh ${r.pWhPsia} psia`, fx(r.qStbd, 6), 'stb/d');
      if (Number.isFinite(r.pwfPsia)) {
        add(src, `operating pressure at pWh ${r.pWhPsia} psia`, fx(r.pwfPsia, 6), 'psia');
      } else {
        add(src, `operating pressure at pWh ${r.pWhPsia} psia`, 'none, the well is dead');
      }
      add(src, `dead column at pWh ${r.pWhPsia} psia`, fx(r.deadColumnPsia, 0), 'psia');
      if (r.windowStbd !== null) add(src, `stable window at pWh ${r.pWhPsia} psia`, fx(r.windowStbd, 6), 'stb/d');
      // A dead status is a claim about the GRID, and only the minimum residual
      // settles whether the well is physically dead or instrumentally dead. The
      // capstone block has carried this pair from the start; without it here, a
      // teaching well that goes dead in a sweep leaves the reader no way to tell
      // the two apart, on the one tier whose doctrine says they are different.
      const resSweep = wellResidualMinimum(W, { pWh: r.pWhPsia });
      add(src, `minimum residual at pWh ${r.pWhPsia} psia`, fx(resSweep.residualPsi, 6), 'psi');
      add(src, `rate at the minimum residual at pWh ${r.pWhPsia} psia`, fx(resSweep.qStbd, 6), 'stb/d');
    });
    wellErosionalScreen(W).forEach((r) => {
      add(src, `erosional velocity at C ${r.cFactor}`, fx(r.erosionalFtS, 6), 'ft/s');
      add(src, `erosional rate limit at C ${r.cFactor}`, fx(r.erosionalRateBpd, 4), 'bbl/d in situ');
      add(src, `velocity ratio at the operating point, C ${r.cFactor}`, fx(r.ratio, 8), 'ratio');
    });
    add(src, 'tubing ID for the erosional screen', String(W.tubingIdIn), 'in');
    add(src, 'mixture density for the erosional screen', String(W.mixtureDensityLbFt3), 'lb/ft3');
  });

  // ------------------------------------------------------- the scan reversal
  head('SOURCE 3b: FORCADOS-3 CHOKED BACK. THE SCAN REVERSAL.');
  head('Read the spacing column against the window column. A finer scan is NOT');
  head('a better scan: nGrid 40 finds this well, nGrid 50 loses it, nGrid 60');
  head('finds it again. A sign change scan sees the dip only if one of its');
  head('intervals STRADDLES it, so the verdict depends on where the samples');
  head('LAND and not only on how many there are. On a tight well the honest');
  head('check is the RESIDUAL and never the scan.');
  const revSrc = 'teaching well FORCADOS-3 choked';
  const rev = scanReversalTruth();
  add(revSrc, 'wellhead pressure for the reversal study', String(SCAN_REVERSAL_PWH_PSIA), 'psia');
  add(revSrc, 'true status, resolved at nGrid 20000', rev.status);
  add(revSrc, 'true crossings', String(rev.crossings), 'crossings');
  add(revSrc, 'true unstable crossing rate', fx(rev.unstableQStbd, 6), 'stb/d');
  add(revSrc, 'true operating rate', fx(rev.opQStbd, 6), 'stb/d');
  add(revSrc, 'TRUE STABLE WINDOW WIDTH', fx(rev.windowStbd, 6), 'stb/d');
  add(revSrc, 'absolute open flow', fx(rev.aofStbd, 6), 'stb/d');
  add(revSrc, 'minimum residual', fx(rev.minimumResidualPsi, 6), 'psi');
  scanReversalStudy().forEach((r) => {
    add(revSrc, `nGrid ${r.nGrid}, scan spacing`, fx(r.spacingStbd, 6), 'stb/d');
    add(revSrc, `nGrid ${r.nGrid}, spacing over the true window`, fx(r.spacingStbd / rev.windowStbd, 6), 'ratio');
    add(revSrc, `nGrid ${r.nGrid}, status`, r.status);
    add(revSrc, `nGrid ${r.nGrid}, crossings found`, String(r.crossings), 'crossings');
  });

  return rows;
};

/**
 * One raw digest row rendered, before the leak guard sees it. A run of heading
 * lines is one block, so only the first of a run opens a blank line.
 */
export const renderDigestRow = (r, previous) => (r.kind === 'heading'
  ? `${previous && previous.kind === 'heading' ? '' : '\n'}# ${r.text}`
  : `${r.source}, ${r.label} = ${r.value}${r.unit ? ` ${r.unit}` : ''}`);

/**
 * The digest parsed back into a `source, label` to number map, so the test can
 * RE-DERIVE the file from its own printed inputs and prove it is internally
 * consistent. A digest whose stated conditions do not reproduce its stated
 * results is worse than no digest, because every lesson built on it inherits
 * the inconsistency.
 */
export const digestLookup = (text) => {
  const map = new Map();
  text.split('\n').forEach((line) => {
    if (!line || line.startsWith('#')) return;
    const eq = line.indexOf(' = ');
    if (eq < 0) return;
    const key = line.slice(0, eq);
    const rest = line.slice(eq + 3);
    const num = Number(rest.split(' ')[0]);
    map.set(key, Number.isFinite(num) ? num : rest);
  });
  return map;
};

/**
 * THE TEACHING DIGEST AS TEXT, WITH THE LEAK GUARD APPLIED.
 *
 * Every dimensioned number in every line is checked against all eighteen
 * graded capstone answers, in three unit shiftings, at ten times the grader's
 * own acceptance band, and any number inside one of those neighbourhoods is
 * replaced by a statement that it was withheld. The digest therefore cannot
 * leak the capstone even if somebody later adds a line without thinking, and
 * `nodalLab.test.js` proves the guard is live by planting one.
 */
export const digestText = () => {
  const targets = leakGuardTargets();
  const rows = teachingDigest();
  return rows
    .map((r, i) => censorDigestLine(renderDigestRow(r, rows[i - 1]), targets).line)
    .join('\n');
};

/** How many numbers the leak guard removed, and from which lines. */
export const digestWithheld = () => {
  const targets = leakGuardTargets();
  const out = [];
  const rows = teachingDigest();
  rows.forEach((r, i) => {
    const raw = renderDigestRow(r, rows[i - 1]);
    const c = censorDigestLine(raw, targets);
    if (c.withheld > 0) out.push({ raw, censored: c.line, withheld: c.withheld });
  });
  return out;
};

// ---------------------------------------------------------------------------
// THE CAPSTONE DIGEST. NEMBE-14 ONLY. NOT FOR LESSONS.
// ---------------------------------------------------------------------------

export const capstoneDigest = () => {
  const rows = [];
  const head = (text) => rows.push({ kind: 'heading', text });
  const add = (label, value, unit = '') =>
    rows.push({ kind: 'value', source: 'capstone NEMBE-14', label, value: String(value), unit });

  const ipr = nembeIpr();
  const inflow = nembeInflowReadings();
  const out = nembeOutflowReadings();
  const win = nembeStableWindow();
  const node = nembeNode();
  const lift = liftGasVsAverageTz();
  const diag = diagnosticFrictionGroup();
  const cross = tubingLimbCrossover();
  const dead = searchDeadWellhead();
  const tang = nembeTangency();
  const cap = capstoneValues();
  const pis = iprModelPis();

  head('CAPSTONE AUX: NEMBE-14. NOT FOR LESSONS, NOT FOR THE TEACHING DIGEST.');
  head('For the migration headers and the go-live only.');

  add('well', NEMBE_LABEL);
  add('inflow model', ipr.model);
  add('reservoir pressure', fx(CAP.prPsia, 0), 'psia');
  add('bubble point pressure', fx(CAP.pbPsia, 0), 'psia');
  add('production test rate', fx(CAP.testQStbd, 0), 'stb/d');
  add('production test flowing pressure', fx(CAP.testPwfPsia, 0), 'psia');
  add('production test drawdown', fx(inflow.testDrawdownPsi, 0), 'psi');
  add('IPR curve rows', String(inflow.curveRows), 'points');
  add('productivity index', fx(inflow.piStbdPerPsi, 6), 'stb/d/psi');
  add('absolute open flow', fx(inflow.aofStbd, 4), 'stb/d');
  add('rate at the bubble point', fx(inflow.qAtBubblePointStbd, 4), 'stb/d');
  add('rate at 1650 psia', fx(inflow.qAtReadPressureStbd, 4), 'stb/d');
  add('flowing pressure at 2400 stb/d', fx(inflow.pwfAtReadRatePsia, 4), 'psia');
  add('flowing pressure at 3300 stb/d', fx(inflow.pwfAtDeepRatePsia, 4), 'psia');
  add('undersaturated block, PI times drawdown to pb', fx(inflow.qAtBubbleFromPiStbd, 4), 'stb/d');
  add('saturated Vogel block', fx(inflow.vogelBlockStbd, 4), 'stb/d');
  add('saturated share of the open flow', fx(inflow.saturatedShareOfAof, 6), 'fraction');
  inflow.forward.forEach((r) => add(`inflow rate at ${r.pwfPsia} psia`, fx(r.qStbd, 4), 'stb/d'));
  inflow.inverse.forEach((r) => add(`inflow pressure at ${r.qStbd} stb/d`, fx(r.pwfPsia, 4), 'psia'));
  add('true productivity index', fx(pis.truePiStbdPerPsi, 6), 'stb/d/psi');
  add('productivity index from a straight line on the two phase test', fx(pis.straightLineFromTwoPhaseTestStbdPerPsi, 6), 'stb/d/psi');
  add('productivity index error from fitting below the bubble point', fx(pis.piErrorFromTwoPhaseTestStbdPerPsi, 6), 'stb/d/psi');
  iprModelComparison().forEach((r) => {
    add(`rate at ${r.pwfPsia} psia, straight line`, fx(r.straightLineStbd, 4), 'stb/d');
    add(`rate at ${r.pwfPsia} psia, Vogel`, fx(r.vogelStbd, 4), 'stb/d');
    add(`rate at ${r.pwfPsia} psia, composite`, fx(r.compositeStbd, 4), 'stb/d');
  });
  nembeInflowSlopes().forEach((r) => add(`inflow slope at ${r.qStbd} stb/d`, fx(r.dpwfdqPsiPerStbd, 6), 'psi per stb/d'));

  add('wellhead pressure', fx(CAP.pWhPsia, 0), 'psia');
  add('gravity constant gGrav', fx(CAP.gGravPsi, 0), 'psi');
  add('lightening constant qRef', fx(CAP.qRefStbd, 0), 'stb/d');
  add('friction constant kFric', String(CAP.kFricPsiPerStbd2), 'psi per (stb/d)^2');
  add('tubing curve sample count', String(CAP.vlpPoints), 'points');
  add('dead column at zero rate', fx(out.deadColumnPsia, 0), 'psia');
  add('tubing curve loaded end bhp', fx(out.loadedEndBhpPsia, 4), 'psia');
  add('tubing curve friction end bhp', fx(out.frictionEndBhpPsia, 4), 'psia');
  add('loaded end above reservoir pressure', fx(out.loadedEndAbovePrPsi, 2), 'psi');
  add('sampled tubing minimum rate', fx(out.sampledMinimumQStbd, 4), 'stb/d');
  add('sampled tubing minimum bhp', fx(out.sampledMinimumBhpPsia, 4), 'psia');
  add('true tubing minimum rate at 20001 points', fx(out.trueMinimumQStbd, 4), 'stb/d');
  add('true tubing minimum bhp at 20001 points', fx(out.trueMinimumBhpPsia, 4), 'psia');
  add('friction overtakes gravity at', fx(cross.qStbd, 4), 'stb/d');
  tubingDecomposition([100, 300, 600, 929.98, 1285.23, 2000, 3000, 3848]).forEach((r) => {
    add(`gravity term at ${fx(r.qStbd, 2)} stb/d`, fx(r.gravityPsi, 4), 'psi');
    add(`friction term at ${fx(r.qStbd, 2)} stb/d`, fx(r.frictionPsi, 4), 'psi');
  });

  add('lift gas injection wellhead pressure', fx(CAP.giPtfPsia, 0), 'psia');
  add('lift gas gravity', String(CAP.giGasSg), 'air = 1');
  add('lift gas column measured depth', fx(CAP.giMdFt, 0), 'ft');
  add('lift gas column true vertical depth', fx(CAP.giTvdFt, 0), 'ft');
  add('lift gas wellhead temperature', fx(CAP.giWhtF, 0), 'degF');
  add('lift gas bottomhole temperature', fx(CAP.giBhtF, 0), 'degF');
  add('lift gas valve pressure at 20 steps', fx(lift.cullenderSmithPwfPsia, 4), 'psia');
  add('lift gas midpoint pressure at 20 steps', fx(lift.cullenderSmithPmfPsia, 4), 'psia');
  add('lift gas converged pressure at 256 steps', fx(lift.convergedPwfPsia, 4), 'psia');
  add('lift gas average T and z pressure', fx(lift.averageTzPwfPsia, 4), 'psia');
  add('lift gas average z', fx(lift.averageTzZbar, 6), 'dimensionless');
  add('converged minus average T and z', fx(lift.convergedMinusAverageTzPsi, 6), 'psi');
  columnTruncationTable().forEach((r) => {
    add(`gravity only column at ${r.steps} steps`, fx(r.gravityOnlyPwfPsia, 4), 'psia');
    add(`gravity only truncation at ${r.steps} steps`, fx(r.gravityOnlyErrorPsi, 6), 'psi');
    add(`friction loaded column at ${r.steps} steps`, fx(r.frictionLoadedPwfPsia, 4), 'psia');
    add(`friction loaded truncation at ${r.steps} steps`, fx(r.frictionLoadedErrorPsi, 6), 'psi');
  });
  add('diagnostic column rate', String(diag.qMmscfd), 'MMscf/d');
  add('diagnostic column tubing ID', String(diag.idIn), 'in');
  add('diagnostic column Reynolds number', fx(diag.reynolds, 1), 'dimensionless');
  add('diagnostic column friction group F squared', fx(diag.f2, 8), 'dimensionless');

  add('node scan resolution used', String(CAP.nGrid), 'grid points');
  add('operating rate', fx(cap.node_op_q_stbd, 4), 'stb/d');
  add('operating flowing pressure', fx(cap.node_op_pwf_psia, 4), 'psia');
  add('unstable crossing rate', fx(cap.node_unstable_q_stbd, 4), 'stb/d');
  add('unstable crossing flowing pressure', fx(cap.node_unstable_pwf_psia, 4), 'psia');
  add('stable window width', fx(win.widthStbd, 4), 'stb/d');
  add('stable window as a fraction of open flow', fx(win.widthAsFractionOfAof, 8), 'fraction');
  add('drawdown at the operating point', fx(win.drawdownAtOpPsi, 4), 'psi');
  add('operating point above the tubing minimum', fx(win.opAboveTubingMinimumPsi, 4), 'psi');
  add('operating point LEFT of the tubing minimum', fx(win.opLeftOfTubingMinimumStbd, 4), 'stb/d');
  add('crossings found at nGrid 900', String(node.intersections.length), 'crossings');
  const resMin = nembeResidualMinimum({ nPoints: 20001 });
  add('residual at the lowest sampled rate', fx(resMin.residualAtLowestSampledRatePsi, 4), 'psi');
  add('minimum residual', fx(resMin.residualPsi, 6), 'psi');
  add('rate at the minimum residual', fx(resMin.qStbd, 4), 'stb/d');

  head('THE SCAN RESOLUTION STUDY. The verdict is NOT monotone in grid count:');
  head('nGrid 60 finds this well and the finer nGrid 100 loses it again.');
  scanResolutionStudy().forEach((r) => {
    add(`scan spacing at nGrid ${r.nGrid}`, fx(r.spacingStbd, 4), 'stb/d');
    add(`status at nGrid ${r.nGrid}`, r.status);
    add(`crossings at nGrid ${r.nGrid}`, String(r.crossings), 'crossings');
    if (r.opQStbd !== null) add(`operating rate at nGrid ${r.nGrid}`, fx(r.opQStbd, 4), 'stb/d');
  });

  head('THE WELLHEAD MARGIN. The sweep suggests twelve psi because 1248 psia is');
  head('its next step. The margin is 0.143288 psi: the residual dip is only that');
  head('deep, so the curves go tangent at 1236.143288 psia. Two independent');
  head('derivations, a Brent root find on the residual slope and a bisection on');
  head('the engine status verdict, agree to 1.3e-4 psi.');
  pwhSweepDetail().forEach((r) => {
    add(`status at pWh ${r.pWhPsia} psia`, r.status);
    add(`operating rate at pWh ${r.pWhPsia} psia`, fx(r.qStbd, 4), 'stb/d');
    if (Number.isFinite(r.pwfPsia)) {
      add(`operating pressure at pWh ${r.pWhPsia} psia`, fx(r.pwfPsia, 4), 'psia');
    } else {
      add(`operating pressure at pWh ${r.pWhPsia} psia`, 'none, the well is dead');
    }
    if (r.windowStbd !== null) add(`stable window at pWh ${r.pWhPsia} psia`, fx(r.windowStbd, 4), 'stb/d');
    add(`minimum residual at pWh ${r.pWhPsia} psia`, fx(r.minimumResidualPsi, 6), 'psi');
  });
  add('rate at the bottom of the residual dip', fx(tang.qStbd, 4), 'stb/d');
  add('depth of the residual dip', fx(tang.dipPsi, 6), 'psi');
  add('wellhead pressure at true tangency, by the residual slope', fx(tang.tangentWellheadPsia, 6), 'psia');
  add('wellhead pressure at which the scan loses the well, by bisection', fx(dead.pWhPsia, 6), 'psia');
  add('the two derivations differ by', fx(Math.abs(dead.pWhPsia - tang.tangentWellheadPsia), 8), 'psi');
  add('true wellhead margin before the well dies', fx(tang.marginFromCapstonePsi, 6), 'psi');

  head('THE EIGHTEEN GRADED FIELDS.');
  Object.entries(cap).forEach(([k, v]) => add(`graded ${k} (${CAPSTONE_TIERS[k]})`, String(v)));

  return rows;
};

export const capstoneDigestText = () => {
  const rows = capstoneDigest();
  return rows.map((r, i) => renderDigestRow(r, rows[i - 1])).join('\n');
};
