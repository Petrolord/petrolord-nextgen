// THE QI EXPERT TEACHING LAB: inversion, properties and the decision.
//
// Same rules as qiLab.js: every number returned is a return value of a
// vendored engine (engines/qi/inversion.js, inversionSpread.js,
// prestackInversion.js, propertyPrediction.js, lfm.js, prospectAssessment.js,
// lib/gridding/closure.js, engines/seismolord/synthetics.js resampleToDt,
// lib/waveform.js rickerWavelet) on the Ekene teaching pack, the Ekene Sand
// top grid (ekeneQiGrid.json) or a case a learner pastes, plus the small
// arithmetic the lab names where it does it (depth to time on the checkshots,
// least squares scales, unit conversions). The digest's Expert sections are
// printed from these functions by the wave's qi_dump_e.mjs.
//
// GATE STATUS (plan section 3). inversion.js, inversionSpread.js,
// prestackInversion.js, propertyPrediction.js and closure.js carry a golden
// and an independent oracle. lfm.js (G5) and prospectAssessment.js (G8) await
// their oracles (engines PR E1c): the lab teaches them and no capstone field
// is graded through them until that PR lands.
//
// No refusal message is written here for an engine refusal: attempt() returns
// the engine's own words. Nothing reads a clock or a random number; every
// noise realisation is seeded by a stated seed.
import GRID from './ekeneQiGrid.json';
import { PACK, mToFt, attempt, packWell } from './qiLab.js';
import {
  modelBased, sparseSpike, fistaReflectivity, lowFrequencyModel, forwardPoststack,
  convolveCentred, convolveCentredAdjoint, diffCentred, diffCentredAdjoint,
  impedanceSpectrumSlope, colouredOperator, applyColoured,
} from '@petrolord/engines/engines/qi/inversion.js';
import { quantilesAcross, relativeSpread, addNoise } from '@petrolord/engines/engines/qi/inversionSpread.js';
import { fattiCoefficients, forwardFatti, simultaneousInversion } from '@petrolord/engines/engines/qi/prestackInversion.js';
import {
  fitLinearTransform, predictWithInterval, fitFaciesModel, faciesPosterior, confusionMatrix,
} from '@petrolord/engines/engines/qi/propertyPrediction.js';
import { lfmTrace, blindWellScore } from '@petrolord/engines/engines/qi/lfm.js';
import { anomalyConformance, evidenceIndependence, assessProspect } from '@petrolord/engines/engines/qi/prospectAssessment.js';
import { spillAnalysis, closureAt, closureCurve } from '@petrolord/engines/lib/gridding/closure.js';
import { resampleToDt } from '@petrolord/engines/engines/seismolord/synthetics.js';
import { rickerWavelet } from '@petrolord/engines/lib/waveform.js';
import { fft, nextPow2 } from '@petrolord/engines/lib/fft.js';

export { GRID, fattiCoefficients, convolveCentred, convolveCentredAdjoint, diffCentred, diffCentredAdjoint, forwardPoststack };

const fin = Number.isFinite;
const mean = (xs) => xs.reduce((s, v) => s + v, 0) / xs.length;

/* ------------------------------------------------- the stated settings */

/**
 * The Expert settings on the Ekene pack, each a stated input of the call it
 * feeds (the Suite's own inversion defaults where QI Studio has one: lfmHz 8,
 * truthHz 50, eps 0.05, epsTV 0.02, outer 4, iters 60, lambda 0.002, IDW power
 * 2, coloured band 8 to 60 Hz).
 */
export const EXPERT = Object.freeze({
  windowMs: [1100, 1500],         // the inversion window on the well traces
  waveletHz: 25,                  // a zero-phase Ricker on the trace clock
  waveletHalfMs: 40,
  lfmHz: 8,                       // the low-frequency model keeps what lies below this
  truthHz: 50,                    // the log is compared after this high cut
  eps: 0.05,
  epsTV: 0.02,
  outer: 4,
  iters: 60,
  lambda: 0.002,
  idwPower: 2,
  band: [8, 60],
  noiseSnr: 4,                    // realisations: the trace plus seeded noise at this ratio
  seeds: Array.from({ length: 20 }, (_, i) => 101 + i),
  angles: { near: 10, mid: 20, far: 30 },
  simEps: [0.05, 0.05, 0.05],
  levelInterval: 0.8,             // the 80 percent interval: Q10 and Q90
});

/* ------------------------------------------------- the trace clock */

export const TRACE_CLOCK = Object.freeze({ dtMs: PACK.wellTraces.dt_ms, t0Ms: PACK.wellTraces.t0_ms });

/** Index range of the stated window on the well-trace clock. */
export function windowIndex([t0, t1] = EXPERT.windowMs) {
  const i0 = Math.round((t0 - TRACE_CLOCK.t0Ms) / TRACE_CLOCK.dtMs);
  const i1 = Math.round((t1 - TRACE_CLOCK.t0Ms) / TRACE_CLOCK.dtMs);
  return { i0, i1, ns: i1 - i0 + 1, t0Ms: t0, dtMs: TRACE_CLOCK.dtMs };
}

/** A stack's trace at a well, cut to the window. */
export function wellTrace(well, stack = 'full', win = windowIndex()) {
  const t = PACK.wellTraces.wells[well];
  if (!t) return { error: `The teaching pack has no traces at ${well}.` };
  return Float64Array.from(t[stack].slice(win.i0, win.i1 + 1));
}

/* ------------------------------------------------- depth to time */

/** One-way time (ms) at a measured depth (m), linear between checkshot levels. */
export function owtAt(well, mdM) {
  const cs = PACK.checkshots[well].rows;
  for (let i = 1; i < cs.length; i++) {
    if (cs[i][0] >= mdM) {
      const [m0, t0] = cs[i - 1]; const [m1, t1] = cs[i];
      return t0 + ((mdM - m0) / (m1 - m0)) * (t1 - t0);
    }
  }
  return NaN;
}

/**
 * A pack well's logs in two-way time on the window's clock: ln(AI), ln(SI),
 * ln(density), Vp/Vs, PHIT, VSH and SW, each resampled by the engine's
 * resampleToDt (linear in time; NaN outside the logged depths), with the
 * times of the top and base of the Ekene Sand from the checkshots.
 */
export function wellInTime(well, win = windowIndex()) {
  const W = PACK.wells[well];
  if (!W) return { error: `The teaching pack has no logs for ${well}.` };
  const rows = W.rows.filter((r) => r[1] > 0 && r[2] > 0 && r[3] > 0);
  const twt = rows.map((r) => 2 * owtAt(well, r[0]) - win.t0Ms);
  const col = (f) => Array.from(resampleToDt(twt, rows.map(f), win.dtMs, win.ns), (v) => (fin(v) ? v : NaN));
  const tops = W.tops_m;
  return {
    name: well, x: W.x, y: W.y,
    lnAi: col((r) => Math.log(r[1] * r[3])),
    lnSi: col((r) => Math.log(r[2] * r[3])),
    lnRho: col((r) => Math.log(r[3])),
    vpvs: col((r) => r[1] / r[2]),
    phit: col((r) => r[5]), vsh: col((r) => r[6]), sw: col((r) => r[7]),
    horizonsMs: [2 * owtAt(well, tops.ekeneTop), 2 * owtAt(well, tops.ekeneBase)],
    win,
  };
}

/** Moving-average half window (samples) for a cut frequency, as QI Studio sets it. */
export const halfWindowFor = (hz, dtMs) => Math.max(1, Math.round(1000 / (hz * dtMs) / 2));

/** The finite runs of a series low-passed by the engine's lowFrequencyModel; gaps stay gaps. */
export function lowPassFinite(values, half) {
  const out = Float64Array.from(values, (v) => (fin(v) ? v : NaN));
  const lp = lowFrequencyModel(out, half);
  for (let i = 0; i < out.length; i++) out[i] = fin(out[i]) ? lp[i] : NaN;
  return out;
}

/* ------------------------------------------------- the wavelet */

/** The stated Ricker on the trace clock (lib/waveform). */
export const teachingWavelet = (hz = EXPERT.waveletHz, halfMs = EXPERT.waveletHalfMs) =>
  Float64Array.from(rickerWavelet(hz, TRACE_CLOCK.dtMs, halfMs));

/** Hold a log's first and last values over its gaps, so the forward model has no step at a gap. */
function holdFill(values) {
  let first = -1;
  for (let i = 0; i < values.length; i++) if (fin(values[i])) { first = i; break; }
  if (first < 0) return null;
  const out = Float64Array.from(values, (v) => (fin(v) ? v : NaN));
  for (let i = 0; i < first; i++) out[i] = out[first];
  for (let i = first + 1; i < out.length; i++) if (!fin(out[i])) out[i] = out[i - 1];
  return out;
}

const covered = (values, i, half) => {
  for (let j = i - half - 1; j <= i + half + 1; j++) if (!(j >= 0 && j < values.length && fin(values[j]))) return false;
  return true;
};

/**
 * The least-squares scale s that makes s x forwardPoststack(ln AI) match the
 * seismic at the wells, pooled over every sample whose wavelet span the log
 * covers (the rule QI Studio's waveletScale states).
 */
export function waveletScale(pairs, wavelet) {
  let sxy = 0; let sxx = 0; let n = 0;
  const half = (wavelet.length - 1) / 2;
  for (const { trace, lnAi } of pairs) {
    const filled = holdFill(lnAi);
    if (!filled) continue;
    const syn = forwardPoststack(filled, wavelet);
    for (let i = 0; i < trace.length; i++) {
      if (!fin(trace[i]) || !covered(lnAi, i, half)) continue;
      sxy += syn[i] * trace[i]; sxx += syn[i] * syn[i]; n += 1;
    }
  }
  if (n < 10 || !(sxx > 0)) return { error: 'The wells overlap too little seismic to scale the wavelet.' };
  return { scale: sxy / sxx, samples: n };
}

/* ------------------------------------------------- the low-frequency model */

/** The LFM wells: positions, horizon times and the log low-passed at the stated cut. */
export function lfmWells(logs, key = 'lnAi', hz = EXPERT.lfmHz) {
  const win = logs[0].win;
  const half = halfWindowFor(hz, win.dtMs);
  return logs.map((w) => ({
    name: w.name, x: w.x, y: w.y, t0Ms: win.t0Ms, dtMs: win.dtMs,
    values: lowPassFinite(w[key], half), horizons: w.horizonsMs,
  }));
}

/** The LFM at one position and horizon pair (lfmTrace; G5, awaiting its oracle). */
export function lfmAt(wells, at, win, { power = EXPERT.idwPower, exclude } = {}) {
  return attempt(() => lfmTrace(wells, at, { t0Ms: win.t0Ms, dtMs: win.dtMs, ns: win.ns }, { power, exclude }));
}

/* ------------------------------------------------- post-stack inversion */

/**
 * Everything one Ekene well's post-stack inversion needs, built once: the
 * logs of all four pack wells in time, the scaled wavelet, the LFM wells.
 */
export function ekeneSetup(win = windowIndex(), { waveletHz = EXPERT.waveletHz, waveletHalfMs = EXPERT.waveletHalfMs, lfmHz = EXPERT.lfmHz } = {}) {
  if (!(win.ns >= 4) || win.i0 < 0 || win.i1 >= PACK.wellTraces.wells['Ekene-1'].full.length) return { error: `The window must lie inside the well traces, ${PACK.wellTraces.t0_ms} to ${PACK.wellTraces.t1_ms} ms.` };
  const logs = Object.keys(PACK.wells).map((w) => wellInTime(w, win));
  const raw = attempt(() => teachingWavelet(waveletHz, waveletHalfMs));
  if (raw.error) return raw;
  const sc = waveletScale(logs.map((l) => ({ trace: wellTrace(l.name, 'full', win), lnAi: l.lnAi })), raw);
  if (sc.error) return sc;
  const wavelet = raw.map((v) => v * sc.scale);
  return { win, logs, raw, scale: sc.scale, scaleSamples: sc.samples, wavelet, lfm: lfmWells(logs, 'lnAi', lfmHz), lfmHz };
}

/** The truth a well's inversion is scored against: its ln(AI) after the stated high cut. */
export const truthOf = (log, hz = EXPERT.truthHz) => lowPassFinite(log.lnAi, halfWindowFor(hz, log.win.dtMs));

/** Invert one well's full-stack trace by a stated method, the well left out of its LFM or kept in. */
export function invertAt(S, well, {
  method = 'model_based', exclude = null, d = null, eps = EXPERT.eps, iters = EXPERT.iters,
  lambda = EXPERT.lambda, epsTV = EXPERT.epsTV, outer = EXPERT.outer, power = EXPERT.idwPower,
} = {}) {
  const log = S.logs.find((l) => l.name === well);
  const m0 = lfmAt(S.lfm, { x: log.x, y: log.y, horizons: log.horizonsMs }, S.win, { exclude: exclude ? well : undefined, power });
  if (m0.error) return m0;
  const trace = d || wellTrace(well, 'full', S.win);
  return attempt(() => {
    if (method === 'sparse_spike') return { ...sparseSpike({ d: trace, wavelet: S.wavelet, m0, lambda, dtMs: S.win.dtMs, crossoverHz: S.lfmHz ?? EXPERT.lfmHz, iters }), m0 };
    const blocky = method === 'blocky' ? { epsTV, outer } : null;
    return { ...modelBased({ d: trace, wavelet: S.wavelet, m0, eps, blocky, iters }), m0 };
  });
}

/** The blind-well table: each well with itself left out of the LFM, and kept in. */
export function blindTable(S, method = 'model_based', opts = {}) {
  return S.logs.map((log) => {
    const truth = truthOf(log, opts.truthHz);
    const blind = invertAt(S, log.name, { ...opts, method, exclude: true });
    const kept = invertAt(S, log.name, { ...opts, method });
    return {
      name: log.name,
      blind: blind.error ? blind : blindWellScore(blind.m, truth),
      withWell: kept.error ? kept : blindWellScore(kept.m, truth),
      lfmOnly: blindWellScore(blind.m0, truth),
    };
  });
}

/** Seeded noise realisations of one well's inversion and their Q10, Q50 and Q90 of AI. */
export function spreadAt(S, well, { snr = EXPERT.noiseSnr, seeds = EXPERT.seeds, ...opts } = {}) {
  const d = wellTrace(well, 'full', S.win);
  const reals = [];
  for (const seed of seeds) {
    const noisy = attempt(() => addNoise(d, snr, seed));
    if (noisy.error) return noisy;
    const r = invertAt(S, well, { ...opts, exclude: true, d: noisy });
    if (r.error) return r;
    reals.push(r.ai);
  }
  const [q10, q50, q90] = quantilesAcross(reals);
  return { realisations: reals.length, q10, q50, q90, spread: relativeSpread(q10, q50, q90) };
}

/** The seismic amplitude spectrum averaged over traces and smoothed over five bins, as a function of frequency. */
export function averageAmplitude(traces, dtMs) {
  const n = traces[0].length;
  const N = nextPow2(n) * 2;
  const acc = new Float64Array(N / 2 + 1);
  for (const t of traces) {
    const re = new Float64Array(N); const im = new Float64Array(N);
    for (let i = 0; i < n; i++) re[i] = fin(t[i]) ? t[i] : 0;
    fft(re, im, false);
    for (let k = 0; k <= N / 2; k++) acc[k] += Math.hypot(re[k], im[k]) / traces.length;
  }
  const sm = new Float64Array(acc.length);
  for (let k = 0; k < acc.length; k++) {
    let s = 0; let c = 0;
    for (let j = Math.max(0, k - 2); j <= Math.min(acc.length - 1, k + 2); j++) { s += acc[j]; c += 1; }
    sm[k] = s / c;
  }
  const df = 1000 / (N * dtMs);
  return (f) => {
    const x = f / df; const i = Math.floor(x);
    if (i < 0 || i >= sm.length - 1) return 0;
    return sm[i] + (x - i) * (sm[i + 1] - sm[i]);
  };
}

/** Coloured inversion of every pack well: the slope from each log's AI, the operator, the output. */
export function colouredAt(S, { band = EXPERT.band } = {}) {
  return attempt(() => {
    const slopes = S.logs.map((l) => {
      const ai = l.lnAi.filter(fin).map(Math.exp);
      return { name: l.name, samples: ai.length, alpha: impedanceSpectrumSlope(ai, S.win.dtMs) };
    });
    const alpha = mean(slopes.map((s) => s.alpha));
    const traces = S.logs.map((l) => wellTrace(l.name, 'full', S.win));
    const op = colouredOperator({ seismicAmp: averageAmplitude(traces, S.win.dtMs), alpha, n: S.win.ns, dtMs: S.win.dtMs, band });
    const out = S.logs.map((l, k) => ({ name: l.name, rel: Float64Array.from(applyColoured(traces[k], op)) }));
    return { slopes, alpha, N: op.N, out };
  });
}

/** Correlation of two series over the samples where both are finite. */
export function corrOf(a, b) {
  const x = []; const y = [];
  for (let i = 0; i < Math.min(a.length, b.length); i++) if (fin(a[i]) && fin(b[i])) { x.push(a[i]); y.push(b[i]); }
  const n = x.length;
  if (n < 3) return { corr: NaN, n };
  const mx = mean(x); const my = mean(y);
  let sxy = 0; let sxx = 0; let syy = 0;
  for (let i = 0; i < n; i++) { sxy += (x[i] - mx) * (y[i] - my); sxx += (x[i] - mx) ** 2; syy += (y[i] - my) ** 2; }
  return { corr: sxx > 0 && syy > 0 ? sxy / Math.sqrt(sxx * syy) : NaN, n };
}

/* ------------------------------------------------- simultaneous inversion */

/** The background Vs/Vp: the mean of Vs / Vp over every log sample in the window. */
export function backgroundVsVp(logs) {
  const v = [];
  for (const l of logs) for (const r of l.vpvs) if (fin(r)) v.push(1 / r);
  return mean(v);
}

/** Least-squares scale of a Fatti synthetic (unit wavelet amplitude) to one angle stack over the wells. */
export function fattiScale(logs, stack, theta, wavelet, vsVp, win) {
  let sxy = 0; let sxx = 0; let n = 0;
  const half = (wavelet.length - 1) / 2;
  for (const l of logs) {
    const a = holdFill(l.lnAi); const s = holdFill(l.lnSi); const r = holdFill(l.lnRho);
    if (!a || !s || !r) continue;
    const syn = forwardFatti({ lnAi: a, lnSi: s, lnRho: r }, [theta], [wavelet], vsVp)[0];
    const tr = wellTrace(l.name, stack, win);
    for (let i = 0; i < tr.length; i++) {
      if (!covered(l.lnAi, i, half)) continue;
      sxy += syn[i] * tr[i]; sxx += syn[i] * syn[i]; n += 1;
    }
  }
  return n >= 10 && sxx > 0 ? { scale: sxy / sxx, samples: n } : { error: 'Too little overlap to scale the angle wavelet.' };
}

/** Everything the simultaneous inversion needs on the Ekene pack: angle wavelets scaled per stack, the three LFMs. */
export function ekeneSimSetup(S, stacks = ['near', 'mid', 'far']) {
  const vsVp = backgroundVsVp(S.logs);
  const angles = stacks.map((k) => EXPERT.angles[k]);
  const scales = stacks.map((k, i) => fattiScale(S.logs, k, angles[i], S.raw, vsVp, S.win));
  const bad = scales.find((s) => s.error);
  if (bad) return bad;
  return {
    stacks, angles, vsVp, scales,
    wavelets: scales.map((s) => S.raw.map((v) => v * s.scale)),
    lfm: { lnAi: lfmWells(S.logs, 'lnAi'), lnSi: lfmWells(S.logs, 'lnSi'), lnRho: lfmWells(S.logs, 'lnRho') },
  };
}

/** Simultaneous inversion at one well, the well left out of its three LFMs or kept in. */
export function simAt(S, M, well, { exclude = false, stacks = M.stacks, eps = EXPERT.simEps, iters = EXPERT.iters, power = EXPERT.idwPower } = {}) {
  const log = S.logs.find((l) => l.name === well);
  const at = { x: log.x, y: log.y, horizons: log.horizonsMs };
  const opt = { exclude: exclude ? well : undefined, power };
  const m0 = {};
  for (const k of ['lnAi', 'lnSi', 'lnRho']) {
    const t = lfmAt(M.lfm[k], at, S.win, opt);
    if (t.error) return t;
    m0[k] = t;
  }
  const idx = stacks.map((s) => M.stacks.indexOf(s));
  return attempt(() => simultaneousInversion({
    traces: stacks.map((s) => wellTrace(well, s, S.win)),
    thetaDeg: idx.map((i) => M.angles[i]),
    wavelets: idx.map((i) => M.wavelets[i]),
    vsVp: M.vsVp, m0, eps, iters,
  }));
}

/** Score the three parameters of a simultaneous result against the well's logs after the high cut. */
export function scoreSim(res, log) {
  const half = halfWindowFor(EXPERT.truthHz, log.win.dtMs);
  const tA = lowPassFinite(log.lnAi, half); const tS = lowPassFinite(log.lnSi, half); const tR = lowPassFinite(log.lnRho, half);
  const lnVpVs = (a, s) => Float64Array.from(a, (v, i) => v - s[i]);
  return {
    ai: blindWellScore(res.lnAi, tA),
    vpvs: blindWellScore(lnVpVs(res.lnAi, res.lnSi), lnVpVs(tA, tS)),
    rho: blindWellScore(res.lnRho, tR),
  };
}

/* ------------------------------------------------- properties from impedance */

/**
 * The calibration samples at seismic scale: each well's ln(AI), Vp/Vs and
 * PHIT after the stated upscaling cut, inside the Ekene Sand (between its top
 * and base times), with a facies label: oil sand (Vsh at or below the cut,
 * Sw below 1), brine sand (Vsh at or below the cut, Sw 1) or shale (Vsh above
 * the cut, any depth of the window).
 */
export function calibrationSamples(logs, { upscaleHz = EXPERT.truthHz, vshCut = 0.35, sandOnly = false } = {}) {
  const out = [];
  for (const l of logs) {
    const half = halfWindowFor(upscaleHz, l.win.dtMs);
    const a = lowPassFinite(l.lnAi, half); const r = lowPassFinite(l.vpvs, half);
    const p = lowPassFinite(l.phit, half); const v = lowPassFinite(l.vsh, half); const s = lowPassFinite(l.sw, half);
    for (let i = 0; i < a.length; i++) {
      if (![a[i], r[i], p[i], v[i], s[i]].every(fin)) continue;
      const t = l.win.t0Ms + i * l.win.dtMs;
      const inSand = t >= l.horizonsMs[0] && t <= l.horizonsMs[1];
      const facies = v[i] > vshCut ? 'shale' : (s[i] < 0.999 ? 'oil sand' : 'brine sand');
      if (sandOnly && !inSand) continue;
      out.push({ well: l.name, tMs: t, ai: Math.exp(a[i]), vpvs: r[i], phit: p[i], facies, inSand });
    }
  }
  return out;
}

/** Porosity from AI by least squares, with the predictions and 80 percent intervals at stated AIs. */
export function porosityTransform(samples, at = [], level = EXPERT.levelInterval) {
  const fit = attempt(() => fitLinearTransform(samples.map((s) => s.ai), samples.map((s) => s.phit)));
  if (fit.error) return fit;
  return { fit, predictions: at.map((x) => ({ ai: x, ...predictWithInterval(fit, x, level) })) };
}

/** A Bayesian facies model on AI (one attribute) or AI and Vp/Vs (two), its posteriors at stated points, its confusion matrix. */
export function faciesModel(samples, { attrs = ['ai'], kind = 'gaussian', priors = null, at = [] } = {}) {
  const lab = samples.map((s) => ({ facies: s.facies, x: attrs.map((k) => s[k]) }));
  const model = attempt(() => fitFaciesModel(lab, { kind, priors }));
  if (model.error) return model;
  return {
    model,
    posteriors: at.map((x) => ({ x, ...faciesPosterior(model, x) })),
    confusion: confusionMatrix(model, lab),
  };
}

/* ------------------------------------------------- prospects */

/** The Ekene Sand top grid in feet: elevation (negative below sea level), spacing and origin. */
export function gridFt(g = GRID) {
  const z = Float64Array.from(g.z, (v) => (v == null ? 1e30 : mToFt(v)));
  const s = g.spec;
  return { z, spec: { nx: s.nx, ny: s.ny, x0: mToFt(s.x0), y0: mToFt(s.y0), dx: mToFt(s.dx), dy: mToFt(s.dy) } };
}

/** Crest, spill, closure at the spill and at a stated contact, and the area-depth curve, on a grid. */
export function closureOf({ z, spec }, { contact = null, levels = 8, seed = null } = {}) {
  return attempt(() => {
    const sp = spillAnalysis(z, spec, { seed });
    const atSpill = closureAt(sp, spec, sp.spillZ);
    const atContact = contact == null ? null : closureAt(sp, spec, contact);
    return { spill: sp, crestZ: sp.crest.z, spillZ: sp.spillZ, columnFt: sp.crest.z - sp.spillZ, limitedByEdge: sp.limitedByEdge, atSpill, atContact, curve: closureCurve(sp, spec, { levels }) };
  });
}

/** An anomaly mask on a grid: every live node shallower than a stated elevation (a designed case when labelled so). */
export function maskAbove({ z }, elevation) {
  return Float64Array.from(z, (v) => (Math.abs(v) < 1e29 && v > elevation ? 1 : 0));
}

/** The same with every node east of a stated x dropped (a designed anomaly that cuts across the contours). */
export function maskCut(g, elevation, xMax) {
  const m = maskAbove(g, elevation);
  for (let r = 0; r < g.spec.ny; r++) for (let c = 0; c < g.spec.nx; c++) if (g.spec.x0 + c * g.spec.dx > xMax) m[r * g.spec.nx + c] = 0;
  return m;
}

/** Conformance of an anomaly mask to the trap (prospectAssessment; G8, awaiting its oracle). */
export function conformanceOf(g, mask, spill) {
  return attempt(() => anomalyConformance({ z: g.z, spec: g.spec, mask, spill }));
}

export { evidenceIndependence, assessProspect };

/* ------------------------------------------------- the pack's wells, for the panels */

export const EXPERT_WELLS = Object.freeze(Object.keys(PACK.wells));
export const packWellFt = packWell;

/* ------------------------------------------------- a pasted Expert case */

/**
 * The parts of an Expert case file (a capstone case, or a learner's own in
 * the same shape) as the functions above read them. Returns { error } naming
 * what is missing.
 */
export function caseExpert(c) {
  if (!c || !c.clock || !Array.isArray(c.wells) || !c.traceA) return { error: 'The case needs a clock, wells and a traceA block.' };
  const win = { t0Ms: c.clock.t0_ms, dtMs: c.clock.dt_ms, ns: c.clock.samples };
  const lfm = c.wells.map((w) => ({ name: w.name, x: w.x, y: w.y, t0Ms: win.t0Ms, dtMs: win.dtMs, values: Float64Array.from(w.lnAiLowPassed), horizons: w.horizonsMs }));
  const A = c.traceA;
  const g = c.grid ? { z: Float64Array.from(c.grid.z, (v) => (v == null ? 1e30 : v)), spec: c.grid.spec } : null;
  return {
    win, lfm, A, B: c.positionB && { x: c.positionB.x, y: c.positionB.y, horizons: c.positionB.horizonsMs }, grid: g,
    porositySamples: (c.calibration?.porosity?.rows || []).map(([ai, phit]) => ({ ai, phit })),
    faciesSamples: (c.calibration?.facies?.rows || []).map(([facies, ai]) => ({ facies, ai })),
  };
}

/** Model-based inversion of a stated trace with a stated wavelet, LFM, weight and iteration count. */
export const modelBasedOn = ({ d, wavelet, m0, eps, iters }) => attempt(() => modelBased({ d, wavelet, m0, eps, iters }));

/** Simultaneous inversion of stated angle traces with stated wavelets, LFMs, weights and iterations. */
export const simultaneousOn = ({ traces, thetaDeg, wavelets, vsVp, m0, eps, iters }) =>
  attempt(() => simultaneousInversion({ traces, thetaDeg, wavelets, vsVp, m0, eps, iters }));

/** The FISTA reflectivity of a trace (for the sparse-spike lesson). */
export const reflectivityOf = ({ d, wavelet, lambda, iters }) => attempt(() => fistaReflectivity({ d, wavelet, lambda, iters }));

/**
 * Calibration samples at LOG scale (every log sample, no upscaling) from the
 * pack wells: net sand of the Ekene Sand as oil sand (above the oil-water
 * contact) or brine sand (at or below it), and shale (Vsh above the cut-off)
 * anywhere in the pack window; net sand outside the Ekene Sand is left out.
 */
export function logScaleSamples(wells = EXPERT_WELLS, { vshCut = 0.35 } = {}) {
  const out = [];
  for (const name of wells) {
    const w = packWell(name);
    for (const r of w.rows) {
      if (!(r.vp > 0 && r.vs > 0 && r.rho > 0)) continue;
      const inSand = r.md_ft >= w.topFt && r.md_ft <= w.baseFt;
      let facies = null;
      if (r.vsh > vshCut) facies = 'shale';
      else if (inSand) facies = r.md_ft < w.owcFt ? 'oil sand' : 'brine sand';
      if (!facies) continue;
      out.push({ well: name, md_ft: r.md_ft, ai: r.vp * r.rho, vpvs: r.vp / r.vs, phit: r.phit, facies });
    }
  }
  return out;
}
