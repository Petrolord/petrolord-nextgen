// Well-test teaching lab for the RC7 course (app 'welltest'). Pure functions
// over the vendored engine and its goldens; every exported value is pinned by
// welltestLab.test.js against the RC7 truth digest, which was derived by
// running the same engine. Panels and the learning page import THIS module,
// so a panel and the live grader cannot drift apart.
//
// The course's spine is one sentence: a well test measures a pressure history,
// and everything else is an interpretation CHOICE. Which points are in the
// line, which model is fitted, which time transform is on the axis. This
// module exposes those choices as arguments rather than hiding them.

import goldens from '@petrolord/engines/test-data/welltest/goldens.json';
import {
  hornerAnalysis, mdhAnalysis, multiRateSemilogAnalysis, radiusOfInvestigation,
  skinPressureDrop, flowEfficiency, cartesianPssAnalysis, sqrtTimeAnalysis,
} from '@petrolord/engines/engines/welltest/analysis.js';
import { bourdetDerivative, detectFlowRegimes, logDecimate, trimSpikes }
  from '@petrolord/engines/engines/welltest/derivative.js';
import {
  hornerTime, agarwalEquivalentTime, rateStepsFromHistory, equivalentProducingTime,
  detectFlowPeriods, superposeDeltaP,
} from '@petrolord/engines/engines/welltest/superposition.js';
import { autoFitModel } from '@petrolord/engines/engines/welltest/autoFit.js';
import { getModel, toDimensionlessGroups, modelPwd, OILFIELD }
  from '@petrolord/engines/engines/welltest/models/modelCatalog.js';
import {
  buildGasPvtTable, makePseudoPressure, deliverabilityAnalysis, gasZFactor, gasViscosity,
  gasEquivalentReservoir,
} from '@petrolord/engines/engines/welltest/gas.js';
import {
  prepareProductionRows, materialBalanceTime, flowingMaterialBalanceOil,
  flowingMaterialBalanceGas, transientLinearAnalysis,
} from '@petrolord/engines/engines/welltest/rta.js';

const FX = goldens.fixtures;

// ---------------------------------------------------------------------------
// The subject. One reservoir, ten fixtures, every planted truth stated.
// ---------------------------------------------------------------------------

export const RESERVOIR = FX.buildup.reservoir;

/** The transient fixtures a diagnostic plot can be drawn for. */
export const TRANSIENT_FIXTURES = [
  { id: 'buildup', label: 'Buildup', kind: 'buildup',
    story: 'The subject well shut in after 36 hours. Damaged, storage-dominated early.' },
  { id: 'drawdown', label: 'Drawdown', kind: 'drawdown',
    story: 'The same well flowing at 450 stb/d for 100 hours.' },
  { id: 'faultDrawdown', label: 'Sealing fault', kind: 'drawdown',
    story: 'A fault 800 ft away. The derivative starts to double and never finishes.' },
  { id: 'icFractureDrawdown', label: 'Fractured well', kind: 'drawdown',
    story: 'A 250 ft infinite-conductivity fracture in 5 mD rock. Half slope for three decades.' },
  { id: 'dualPorosityDrawdown', label: 'Dual porosity', kind: 'drawdown',
    story: 'Fissures at omega 0.08 feeding from the matrix at lambda 5e-7. The derivative dips.' },
  { id: 'rectangleDrawdown', label: 'Closed rectangle', kind: 'drawdown',
    story: 'No-flow on all four sides, 2000 by 1400 ft. The only fixture with a volume in it.' },
  { id: 'horizontalDrawdown', label: 'Horizontal well', kind: 'drawdown',
    story: '2000 ft of lateral at kv/kh 0.1. Vertical radial, then linear, then pseudoradial.' },
];

export const fixture = (id) => FX[id];
export const fixtureTruth = (id) => FX[id]?.truth || null;

/** Elapsed time and pressure change for any transient fixture, engine keys. */
export const fixtureSeries = (id) => {
  const f = FX[id];
  if (!f) return [];
  if (id === 'buildup') {
    return f.points.map((p) => ({ x: p.dt, dp: p.dp, p: p.pws }));
  }
  return f.points.map((p) => ({ x: p.t, dp: p.dp, p: p.pwf }));
};

// ---------------------------------------------------------------------------
// Associate: the straight line, and the window it is fitted over.
// ---------------------------------------------------------------------------

/** Horner analysis of the buildup over the points at or after minDt hours. */
export const buildupWindow = (minDt = 0) => {
  const bu = FX.buildup;
  const points = bu.points.filter((p) => p.dt >= minDt).map((p) => ({ dt: p.dt, pws: p.pws }));
  const r = hornerAnalysis({ points, tp: bu.tp, pwfShutIn: bu.pwfShutIn, ...bu.reservoir });
  if (!r) return null;
  const R = bu.reservoir;
  const dpSkin = skinPressureDrop({ q: R.q, B: R.B, mu: R.mu, k: r.k, h: R.h, skin: r.skin });
  return {
    ...r,
    minDt,
    dpSkin,
    riAtTp: radiusOfInvestigation({ k: r.k, tHours: bu.tp, phi: R.phi, mu: R.mu, ct: R.ct }),
    flowEfficiency: flowEfficiency({ pAvg: r.pStar, pwf: bu.pwfShutIn, dpSkin }),
    kErrorPct: (100 * (r.k - bu.truth.k)) / bu.truth.k,
    skinError: r.skin - bu.truth.skin,
  };
};

/** MDH analysis of the drawdown over the points at or after minT hours. */
export const drawdownWindow = (minT = 0) => {
  const dd = FX.drawdown;
  const points = dd.points.filter((p) => p.t >= minT).map((p) => ({ t: p.t, pwf: p.pwf }));
  const r = mdhAnalysis({ points, pi: dd.reservoir.pi, ...dd.reservoir });
  if (!r) return null;
  return { ...r, minT, kErrorPct: (100 * (r.k - dd.truth.k)) / dd.truth.k,
    skinError: r.skin - dd.truth.skin };
};

/** The window walk: the same 40 points, five different lines. */
export const WINDOW_CUTS = [0, 0.5, 1, 2, 5];
export const windowWalk = () => WINDOW_CUTS.map((c) => buildupWindow(c));

/** Horner and Agarwal time for one shut-in time. */
export const timeTransforms = (dt) => ({
  dt,
  horner: hornerTime(FX.buildup.tp, dt),
  agarwal: agarwalEquivalentTime(FX.buildup.tp, dt),
});

// ---------------------------------------------------------------------------
// Professional: the derivative, and what a regime label is worth.
// ---------------------------------------------------------------------------

/**
 * Bourdet derivative of a fixture. Buildups are differentiated against
 * Agarwal equivalent time, drawdowns against elapsed time, which is the same
 * choice autoFitModel makes internally.
 */
export const derivative = (id, { L = 0.1 } = {}) => {
  const f = FX[id];
  if (!f) return { points: [], regimes: [] };
  const rows = id === 'buildup'
    ? f.points.map((p) => ({ x: agarwalEquivalentTime(f.tp, p.dt), y: p.dp }))
    : f.points.map((p) => ({ x: p.t, y: p.dp }));
  const points = bourdetDerivative(rows, { L });
  return { points, regimes: detectFlowRegimes(points) };
};

/** Mean derivative over a window, which is how a plateau is read off. */
export const plateauMean = (id, { from = 0, to = Infinity, L = 0.1 } = {}) => {
  const { points } = derivative(id, { L });
  const sel = points.filter((p) => p.x >= from && p.x <= to && Number.isFinite(p.derivative));
  if (!sel.length) return NaN;
  return sel.reduce((a, p) => a + p.derivative, 0) / sel.length;
};

/** The theoretical radial plateau, 70.6 q B mu / (k h). */
export const theoreticalPlateau = (k, R = RESERVOIR) =>
  (OILFIELD.DERIVATIVE_PLATEAU * R.q * R.B * R.mu) / (k * R.h);

/** Semilog slope at a given permeability, 162.6 q B mu / (k h). */
export const theoreticalSlope = (k, R = RESERVOIR) =>
  (OILFIELD.SEMILOG_SLOPE * R.q * R.B * R.mu) / (k * R.h);

/** MDH over an explicit time window of any drawdown fixture. */
export const drawdownFixtureWindow = (id, lo, hi) => {
  const f = FX[id];
  const points = f.points.filter((p) => p.t >= lo && p.t <= hi).map((p) => ({ t: p.t, pwf: p.pwf }));
  const r = mdhAnalysis({ points, pi: f.reservoir.pi, ...f.reservoir });
  return r ? { ...r, lo, hi, n: points.length } : null;
};

/** The fault: an early line, a late line, and the ratio between them. */
export const faultLines = ({ earlyLo = 1, earlyHi = 20, lateLo = 200, lateHi = 1000 } = {}) => {
  const early = drawdownFixtureWindow('faultDrawdown', earlyLo, earlyHi);
  const late = drawdownFixtureWindow('faultDrawdown', lateLo, lateHi);
  return {
    early, late,
    slopeRatio: late.m / early.m,
    kRatio: late.k / early.k,
    derivEarly: plateauMean('faultDrawdown', { from: earlyLo, to: earlyHi }),
    derivLate: plateauMean('faultDrawdown', { from: lateLo, to: lateHi }),
    truth: FX.faultDrawdown.truth,
  };
};

/** The fracture: the sqrt-time line, and the half-length it implies. */
export const fractureLinearFit = ({ lo = 0.1, hi = 10, k = null } = {}) => {
  const f = FX.icFractureDrawdown;
  const points = f.points.filter((p) => p.t >= lo && p.t <= hi);
  const fit = sqrtTimeAnalysis({ points });
  const R = f.reservoir;
  const kUsed = k ?? f.truth.k;
  const xf = (4.064 * R.q * R.B * Math.sqrt(R.mu / (kUsed * R.phi * R.ct))) / (R.h * fit.slope);
  return { ...fit, lo, hi, kUsed, xf, xfErrorPct: (100 * (xf - f.truth.xf)) / f.truth.xf,
    truth: f.truth };
};

/** What a semilog analysis claims about the fractured well if you run it. */
export const fractureAsRadial = ({ lo = 0.1, hi = 10 } = {}) =>
  drawdownFixtureWindow('icFractureDrawdown', lo, hi);

/** The closed rectangle: pore volume and drainage area from the late line. */
export const rectanglePss = ({ minT = 500 } = {}) => {
  const f = FX.rectangleDrawdown, R = f.reservoir;
  const points = f.points.filter((p) => p.t >= minT).map((p) => ({ t: p.t, pwf: p.pwf }));
  const r = cartesianPssAnalysis({ points, q: R.q, B: R.B, ct: R.ct });
  if (!r) return null;
  const areaFt2 = r.poreVolumeFt3 / (R.phi * R.h);
  const truthArea = (f.truth.L1 + f.truth.L2) * (f.truth.W1 + f.truth.W2);
  return {
    ...r, minT, areaFt2, areaAcres: areaFt2 / 43560,
    truthAreaFt2: truthArea, areaErrorPct: (100 * (areaFt2 - truthArea)) / truthArea,
  };
};

/** Dual porosity: the derivative minimum against the late plateau. */
export const dualPorosityDip = ({ L = 0.1, lateFrom = 300 } = {}) => {
  const { points } = derivative('dualPorosityDrawdown', { L });
  const usable = points.filter((p) => Number.isFinite(p.derivative) && p.derivative > 0);
  let dip = null;
  for (const p of usable) {
    if (p.x > 0.05 && p.x < 50 && (!dip || p.derivative < dip.derivative)) dip = p;
  }
  const late = plateauMean('dualPorosityDrawdown', { from: lateFrom, L });
  return { dipX: dip?.x, dipDerivative: dip?.derivative, latePlateau: late,
    dipRatio: dip ? dip.derivative / late : NaN, truth: FX.dualPorosityDrawdown.truth };
};

/** Gauge preparation: decimation, spike removal, and what a spike costs. */
export const dataPrep = ({ pointsPerDecade = 6, spikeIndex = 20, spikeFactor = 1.6 } = {}) => {
  const dense = FX.drawdown.points.map((p) => ({ x: p.t, y: p.dp }));
  const decimated = logDecimate(dense, { pointsPerDecade });
  const spiked = dense.map((p, i) => (i === spikeIndex ? { ...p, y: p.y * spikeFactor } : p));
  const { kept, removed } = trimSpikes(spiked, { window: 5, threshold: 6 });
  const clean = bourdetDerivative(dense, { L: 0.1 });
  const dirty = bourdetDerivative(spiked, { L: 0.1 });
  const shift = clean.map((p, i) => Math.abs((dirty[i].derivative - p.derivative) / p.derivative) * 100);
  return {
    denseN: dense.length, decimatedN: decimated.length, pointsPerDecade,
    removedN: removed.length, removedAt: removed.map((p) => p.x), keptN: kept.length,
    maxDerivativeShiftPct: Math.max(...shift.filter(Number.isFinite)),
  };
};

// ---------------------------------------------------------------------------
// Expert: regression, rate history, gas, production data.
// ---------------------------------------------------------------------------

/** Models the regression panel offers. The closed rectangle is excluded on
 *  purpose: its seven parameters take about ten seconds to fit and a teaching
 *  panel that appears to hang teaches the wrong thing. */
export const FIT_MODELS = [
  'homogeneous', 'homogeneous-sealing-fault', 'dual-porosity-pss',
  'fracture-infinite-conductivity', 'horizontal-well',
];

/** Levenberg-Marquardt fit of a catalog model to a fixture. */
export const fitModel = (modelId, fixtureId, { derivativeWeight = 1, initialParams = {}, smoothingL = 0.1 } = {}) => {
  const model = getModel(modelId);
  const f = FX[fixtureId];
  if (!model || !f) return null;
  const isBuildup = fixtureId === 'buildup';
  const data = isBuildup
    ? f.points.map((p) => ({ dt: p.dt, dp: p.dp }))
    : f.points.map((p) => ({ t: p.t, dp: p.dp }));
  const fit = autoFitModel({
    model, testType: isBuildup ? 'buildup' : 'drawdown', data, reservoir: f.reservoir,
    tp: isBuildup ? f.tp : undefined, derivativeWeight, initialParams, smoothingL,
  });
  if (!fit) return null;
  const width = Object.fromEntries(
    Object.entries(fit.confidence95).map(([k, [lo, hi]]) => [k, hi - lo])
  );
  return { ...fit, modelId, fixtureId, intervalWidth: width, truth: f.truth,
    parameterMeta: model.parameters };
};

/**
 * The phantom fault: the sealing-fault model fitted to a buildup with no
 * boundary in it, written two arithmetically equivalent ways. The pressure
 * change is either the fixture's own dp or pws minus the flowing pressure at
 * shut-in, and those differ by less than 5e-13 psi. The homogeneous fit does
 * not notice. The phantom fault moves 116 ft and its two 95 percent intervals
 * do not overlap, which is why this quantity is taught and never graded.
 */
export const phantomFault = () => {
  const bu = FX.buildup;
  const run = (data) => {
    const fit = autoFitModel({ model: getModel('homogeneous-sealing-fault'), testType: 'buildup',
      data, reservoir: bu.reservoir, tp: bu.tp });
    return { L: fit.params.L, ci: fit.confidence95.L, ssr: fit.ssr, k: fit.params.k,
      iterations: fit.iterations };
  };
  const storedDp = bu.points.map((p) => ({ dt: p.dt, dp: p.dp }));
  const subtracted = bu.points.map((p) => ({ dt: p.dt, dp: p.pws - bu.pwfShutIn }));
  const dataGap = Math.max(...storedDp.map((p, i) => Math.abs(p.dp - subtracted[i].dp)));
  const a = run(storedDp);
  const b = run(subtracted);
  const homogeneous = autoFitModel({ model: getModel('homogeneous'), testType: 'buildup',
    data: storedDp, reservoir: bu.reservoir, tp: bu.tp });
  return {
    storedDp: a, subtracted: b, dataGap,
    distanceGapFt: Math.abs(a.L - b.L),
    intervalsOverlap: a.ci[1] >= b.ci[0] && b.ci[1] >= a.ci[0],
    homogeneousK: homogeneous.params.k,
  };
};

/** The three-rate history the superposition lessons are built on. */
export const RATE_HISTORY = [{ t: 0, q: 450 }, { t: 24, q: 250 }, { t: 60, q: 700 }];
export const SHUT_IN_HOUR = 96;

/**
 * A variable-rate drawdown built by superposing the planted homogeneous
 * response, then analysed back with the multi-rate semilog. The engine
 * generates the data and the engine recovers the answer, so the exercise is
 * reproducible rather than asserted.
 */
export const multiRateCase = ({ history = RATE_HISTORY } = {}) => {
  const bu = FX.buildup, R = bu.reservoir;
  const steps = rateStepsFromHistory(history);
  const groups = toDimensionlessGroups({ ...R, k: bu.truth.k });
  const dimless = { skin: bu.truth.skin, cd: bu.truth.C * groups.cdPerBblPsi };
  const model = getModel('homogeneous');
  const pwdOfHours = (hours) => modelPwd(model, groups.tdPerHour * hours, dimless, 12);
  const dpPerPdPerUnitRate = (OILFIELD.PD_FACTOR * R.B * R.mu) / (bu.truth.k * R.h);
  const times = [];
  for (let d = -1; d <= 2.0001; d += 1 / 12) times.push(Number(Math.pow(10, d).toFixed(6)));
  const points = times.filter((t) => t > 0 && t <= 120).map((t) => {
    const dp = superposeDeltaP({ pwdOfHours, steps, t, dpPerPdPerUnitRate });
    return { t, dp, pwf: R.pi - dp };
  });
  const late = points.filter((p) => (p.t > 5 && p.t <= 24) || (p.t > 30 && p.t <= 60) || p.t > 65);
  const multiRate = multiRateSemilogAnalysis({ points: late, steps, pi: R.pi, B: R.B, mu: R.mu,
    h: R.h, phi: R.phi, ct: R.ct, rw: R.rw });
  const naive = mdhAnalysis({
    points: points.filter((p) => p.t > 65).map((p) => ({ t: p.t - 60, pwf: p.pwf })),
    pi: R.pi, ...R, q: 700 });
  return {
    steps, periods: detectFlowPeriods(history, { endTime: 120 }), points, fitPoints: late.length,
    multiRate, naive,
    truthK: bu.truth.k, truthSkin: bu.truth.skin,
    multiRateKErrorPct: (100 * (multiRate.k - bu.truth.k)) / bu.truth.k,
    naiveKErrorPct: (100 * (naive.k - bu.truth.k)) / bu.truth.k,
    equivalentTp: equivalentProducingTime(
      rateStepsFromHistory([...history, { t: SHUT_IN_HOUR, q: 0 }]), SHUT_IN_HOUR),
    lastRateHours: SHUT_IN_HOUR - history[history.length - 1].t,
  };
};

/** Gas PVT and pseudo-pressure at the fixture's own gravity and temperature. */
export const gasPvt = ({ gasGravity = 0.65, tempF = 180, pMax = 10000, points = 200 } = {}) => {
  const rows = buildGasPvtTable({ gasGravity, tempF, pMax, points });
  const pvt = makePseudoPressure(rows);
  return { rows, pvt, gasGravity, tempF };
};

/** What m(p) says against what p squared says, between two pressures. */
export const pseudoPressureGap = (p1, p2, opts = {}) => {
  const { pvt } = gasPvt(opts);
  const m1 = pvt.mOfP(p1), m2 = pvt.mOfP(p2);
  return {
    p1, p2, m1, m2,
    mRatio: m2 / m1,
    pSquaredRatio: (p2 * p2) / (p1 * p1),
    overstatementPct: (100 * ((p2 * p2) / (p1 * p1) - m2 / m1)) / (m2 / m1),
    z1: gasZFactor(p1, opts.tempF ?? 180, opts.gasGravity ?? 0.65),
    z2: gasZFactor(p2, opts.tempF ?? 180, opts.gasGravity ?? 0.65),
  };
};

/** The equivalent-liquid adapter constant, which is not a fluid property. */
export const equivalentLiquidB = ({ tempR = 640, muI = 0.02 } = {}) =>
  gasEquivalentReservoir({ phi: 0.18, rw: 0.354, h: 45, qg: 5000, tempR, muI, ctI: 1.5e-4 }).B;

/** The flow-after-flow test behind the engine's deliverability goldens. */
export const DELIVERABILITY_PR = 1952;
export const deliverabilityCase = ({ pr = DELIVERABILITY_PR } = {}) => {
  const points = goldens.deliverabilityFits.points.map((r) => ({
    q: r.q, pwf: Math.sqrt(pr * pr - r.delta), delta: r.delta,
  }));
  const result = deliverabilityAnalysis({ points, pr, method: 'pressure-squared' });
  return {
    ...result, pr, points,
    aofGapPct: (100 * (result.backPressure.aof - result.lit.aof)) / result.lit.aof,
  };
};

/** Oil rate transient: material-balance time and the flowing material balance. */
export const OIL_DECLINE_ROWS = FX.rtaOilDecline.rows;

export const rtaOil = ({ rows = null, ct = null } = {}) => {
  const f = FX.rtaOilDecline;
  const prepared = materialBalanceTime(prepareProductionRows(rows || f.rows));
  const ctUsed = ct ?? f.truth.ct;
  const fmb = flowingMaterialBalanceOil({ rowsTe: prepared, pi: f.truth.pi, ct: ctUsed });
  if (!fmb) return null;
  return { ...fmb, rowsTe: prepared, ctUsed, truth: f.truth,
    nErrorPct: (100 * (fmb.N - f.truth.N)) / f.truth.N };
};

/** Gas rate transient: the dynamic material balance and its pseudo-time. */
export const rtaGas = () => {
  const f = FX.rtaGasDecline;
  const { pvt } = gasPvt({ gasGravity: f.truth.gasGravity, tempF: f.truth.tempF });
  const prepared = materialBalanceTime(prepareProductionRows(f.rows));
  const ctI = pvt.cgOf(f.truth.pi);
  const fmb = flowingMaterialBalanceGas({ rowsTe: prepared, pi: f.truth.pi, pvt, ctI });
  return { ...fmb, ctI, truth: f.truth,
    teLast: prepared[prepared.length - 1].te,
    tcaLast: fmb.tca[fmb.tca.length - 1],
    gErrorPct: (100 * (fmb.G - f.truth.G)) / f.truth.G };
};

/** Transient linear flow: the product xf sqrt(k), and the split it will not do. */
export const rtaLinear = ({ splitK = [1, 5, 10, 50] } = {}) => {
  const f = FX.rtaLinearFlow, t = f.truth;
  const fit = transientLinearAnalysis({ rows: f.rows, pi: t.pi, B: t.B, mu: t.mu,
    phi: t.phi, ct: t.ct, h: t.h });
  return { ...fit, truth: t,
    errorPct: (100 * (fit.xfSqrtK - t.xfSqrtK)) / t.xfSqrtK,
    split: splitK.map((k) => ({ k, xf: fit.xfSqrtK / Math.sqrt(k) })) };
};

// ---------------------------------------------------------------------------
// The eighteen graded values, in one place, computed rather than transcribed.
// The capstone rows in the seed migration carry the same numbers and
// welltestLab.test.js is what keeps the two honest.
// ---------------------------------------------------------------------------

export const capstoneValues = () => {
  const associate = buildupWindow(5);
  const fault = faultLines();
  const rect = rectanglePss();
  const dip = dualPorosityDip();
  const faultFit = fitModel('homogeneous-sealing-fault', 'faultDrawdown');
  const mr = multiRateCase();
  const deliv = deliverabilityCase();
  const oil = rtaOil();
  const gas = rtaGas();
  return {
    beginner: {
      horner_k_md: associate.k,
      horner_skin: associate.skin,
      horner_slope_psi_cycle: associate.m,
      horner_pstar_psia: associate.pStar,
      skin_dp_psi: associate.dpSkin,
      ri_at_tp_ft: associate.riAtTp,
    },
    intermediate: {
      radial_plateau_psi: plateauMean('buildup', { from: 5 }),
      fault_late_k_md: fault.late.k,
      fault_slope_ratio: fault.slopeRatio,
      fracture_sqrt_slope: fractureLinearFit().slope,
      rect_drainage_area_ft2: rect.areaFt2,
      dp_dip_ratio: dip.dipRatio,
    },
    advanced: {
      fault_fit_distance_ft: faultFit.params.L,
      multirate_k_md: mr.multiRate.k,
      equivalent_producing_time_h: mr.equivalentTp,
      aof_disagreement_pct: deliv.aofGapPct,
      rta_oil_n_stb: oil.N,
      rta_gas_g_mscf: gas.G,
    },
  };
};
