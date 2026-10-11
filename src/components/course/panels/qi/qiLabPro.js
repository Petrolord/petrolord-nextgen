// THE QI TEACHING LAB, PROFESSIONAL TIER: from the tie to AVO on the seismic.
//
// The same rules as qiLab.js. Every number is a return value of a vendored
// engine (engines/seismolord/synthetics.js and tieWarp.js for synthetics,
// statistical wavelets, the bulk shift and the phase; engines/qi/wavelets.js,
// prestack.js, prestackQc.js and avo.js for wavelets across wells, gathers,
// angles and AVO) on the Ekene teaching pack or on a pasted case. The only
// arithmetic here is stated bookkeeping, each named where it happens: the
// checkshot time-depth line (two-way time = 2 x one-way time, linear between
// checkshot levels), the trace clock (sample i at t0 + i dt), and picking the
// sample of an event (the largest amplitude in a stated window).
//
// An engine that refuses throws or returns null; every route here returns
// { error } carrying the engine's own message (or, for a null, a lab message
// that says the engine returned no answer and why it does that).
//
// Depth in feet (the pack's metres / 0.3048); offsets in metres, as the kit's
// gathers record them; times in ms; velocities in m/s.
import {
  PACK, PACK_WELLS as PACK_WELLS_PRO, attempt, mToFt, ftToM, packWell, zoneSamples, layerMeans, interfaceAB, traceSpectrum,
} from './qiLab.js';
import {
  computeImpedance, resampleToDt, reflectivity, convolveSame, extractStatisticalWavelet, suggestBulkShift,
} from '@petrolord/engines/engines/seismolord/synthetics.js';
import {
  makeTieWarp, rotateConstantPhase, estimatePhaseRotation, windowedTieQc,
} from '@petrolord/engines/engines/seismolord/tieWarp.js';
import { resampleWavelet, normaliseWavelet, compareWavelets } from '@petrolord/engines/engines/qi/wavelets.js';
import {
  dixInterval, layeredRms, rayTraceAngle, waldenAngle, binOffsets, angleGather, partialStack, usableAngle, velocityOnGrid,
} from '@petrolord/engines/engines/qi/prestack.js';
import { nmoStretch, stretchMuteOffset, residualMoveout, foldSummary } from '@petrolord/engines/engines/qi/prestackQc.js';
import {
  fitShuey, contrastsFromAB, backgroundTrend, offTrend, chiProjection, avoClass as qiAvoClass,
} from '@petrolord/engines/engines/qi/avo.js';
import { rickerWavelet } from '@petrolord/engines/lib/waveform.js';
import { compareAtWells } from '@petrolord/engines/engines/qi/avoWells.js';
import { extractWellWavelet } from '@petrolord/engines/engines/seismolord/wellWavelet.js';

/* ------------------------------------------------- the stated settings */

export const EKENE_PRO = Object.freeze({
  waveletLengthMs: 120,          // extractStatisticalWavelet's window (its default)
  waveletSmoothHz: 5,            // its spectral smoothing (its default)
  waveletWindowMs: [1100, 1500], // the trace window the statistical wavelet reads
  bulkMaxLagMs: 20,
  tieQcWindowMs: 40, tieQcStepMs: 8,
  compareMaxLag: 5,              // samples, compareWavelets
  binWidthM: 200,
  maxStretch: 0.3,               // the stretch-mute limit, a fraction
  rmoCentreMs: null,             // the event time is picked per gather, see pickEvent
  rmoWindowMs: 40, rmoMaxLagMs: 24, rmoNearCount: 3,
  angleEdges: [5, 15, 25, 35],   // near, mid and far bins, degrees
  angleEdgesFine: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45],
  minFold: 2,
  stackAngles: [10, 20, 30],     // the mean angle of the near, mid and far bins
  pickHalfWindowMs: 8,
  chiDeg: 30,
});

/* ------------------------------------------------- the pack's clocks */

/** The pack's trace at a well, one stack: { dtMs, t0Ms, values }. */
export function wellTrace(well, stack) {
  const W = PACK.wellTraces.wells[well];
  if (!W) return { error: `The teaching pack has no traces at ${well}.` };
  if (!W[stack]) return { error: `Unknown stack ${stack}: give full, near, mid or far.` };
  return { dtMs: PACK.wellTraces.dt_ms, t0Ms: PACK.wellTraces.t0_ms, values: W[stack] };
}

/** The time of sample i on a trace clock. */
export const sampleTime = (clock, i) => clock.t0Ms + i * clock.dtMs;

/**
 * Two-way time (ms) at a depth (ft) from a well's checkshots: 2 x the one-way
 * time, linear between the bracketing levels, plus a stated shift.
 */
export function checkshotTwt(well, mdFt, { shiftMs = 0 } = {}) {
  const cs = PACK.checkshots[well];
  if (!cs) return { error: `The teaching pack has no checkshots for ${well}.` };
  const m = ftToM(mdFt);
  const r = cs.rows;
  for (let i = 1; i < r.length; i++) {
    if (r[i][0] >= m) {
      const f = (m - r[i - 1][0]) / (r[i][0] - r[i - 1][0]);
      return 2 * (r[i - 1][1] + f * (r[i][1] - r[i - 1][1])) + shiftMs;
    }
  }
  return { error: `${mdFt} ft is below the last checkshot at ${well}.` };
}

/* ------------------------------------------------- synthetics and wavelets */

/**
 * The synthetic at a well on its trace clock (Seismolord's pipeline): the
 * impedance Vp x density in (m/s)(g/cc) (computeImpedance), each log sample
 * placed at its checkshot two-way time, resampled to the trace's samples
 * (resampleToDt), the reflection coefficients (reflectivity, SEG normal
 * polarity) and the convolution with the stated wavelet (convolveSame).
 */
export function synthetic(well, wavelet, { shiftMs = 0, clock = null } = {}) {
  const w = packWell(well);
  if (w.error) return w;
  const ck = clock || wellTrace(well, 'full');
  if (ck.error) return ck;
  const ns = ck.values ? ck.values.length : ck.ns;
  return attempt(() => {
    const rows = w.rows.filter((r) => r.vp > 0 && r.rho > 0);
    const imp = computeImpedance(rows.map((r) => r.vp), rows.map((r) => r.rho / 1000));
    const twt = rows.map((r) => {
      const t = checkshotTwt(well, r.md_ft, { shiftMs });
      if (t.error) throw new Error(t.error);
      return t - ck.t0Ms;
    });
    const it = resampleToDt(twt, imp, ck.dtMs, ns);
    const rc = reflectivity(it);
    const { data } = convolveSame(rc, wavelet);
    const syn = Float64Array.from(data, (v, i) => (Number.isFinite(rc[i]) ? v : NaN));
    let live = 0;
    for (const v of syn) if (Number.isFinite(v)) live += 1;
    return { synthetic: syn, rc, impedanceTime: it, live, dtMs: ck.dtMs, t0Ms: ck.t0Ms };
  });
}

/** Restrict one trace to a time window on its clock. */
export function traceWindow(clock, values, t0Ms, t1Ms) {
  const i0 = Math.round((t0Ms - clock.t0Ms) / clock.dtMs);
  const i1 = Math.round((t1Ms - clock.t0Ms) / clock.dtMs);
  if (i0 < 0 || i1 >= values.length || i1 < i0) return { error: `The window ${t0Ms} to ${t1Ms} ms is outside the trace.` };
  return Array.from(values).slice(i0, i1 + 1);
}

/** The statistical (zero-phase) wavelet of traces, on the stated length and smoothing. */
export function statWavelet(traces, dtMs, { lengthMs = EKENE_PRO.waveletLengthMs, smoothHz = EKENE_PRO.waveletSmoothHz } = {}) {
  return attempt(() => Array.from(extractStatisticalWavelet(traces, dtMs, { waveletLengthMs: lengthMs, smoothHz })));
}

/** The statistical wavelet at a well from its full-stack trace over the stated window. */
export function wellStatWavelet(well, { window = EKENE_PRO.waveletWindowMs, ...opts } = {}) {
  const t = wellTrace(well, 'full');
  if (t.error) return t;
  const seg = traceWindow(t, t.values, window[0], window[1]);
  if (seg.error) return seg;
  return statWavelet([seg], t.dtMs, opts);
}

/**
 * The least-squares (Wiener) wavelet from the well (seismolord/wellWavelet):
 * the wavelet that best convolves the well's reflectivity into the trace at the
 * well, on the stated half length and damping.
 */
export function wellWavelet(well, { halfLength = 15, damping = 1e-3, wavelet = null } = {}) {
  const w = wavelet || wellStatWavelet(well);
  if (w.error) return w;
  const syn = synthetic(well, w);
  if (syn.error) return syn;
  const t = wellTrace(well, 'full');
  return attempt(() => {
    const r = extractWellWavelet(syn.rc, t.values, { halfLength, damping });
    return { wavelet: Array.from(r.wavelet), used: r.used, fitCorr: r.fitCorr };
  });
}

/** A zero-phase Ricker on the stated clock (lib/waveform). */
export const rickerOf = (freqHz, dtMs, halfLengthMs) => attempt(() => Array.from(rickerWavelet(freqHz, dtMs, halfLengthMs)));

/** Peak and centroid of a wavelet (amplitudeSpectrum + spectrumStats, no taper). */
export const waveletSpectrum = (w, dtMs) => traceSpectrum(w, dtMs, { taper: 0 });

/** The constant-phase rotation of a trace or wavelet (degrees). */
export const rotate = (trace, deg) => attempt(() => Array.from(rotateConstantPhase(trace, (deg * Math.PI) / 180)));

/** The bulk shift that best aligns a synthetic with a seismic trace (positive: the seismic is later). */
export function bulkShift(syn, seis, dtMs, { maxLagMs = EKENE_PRO.bulkMaxLagMs } = {}) {
  const r = attempt(() => suggestBulkShift(syn, seis, dtMs, maxLagMs));
  if (r && r.error) return r;
  return r || { error: 'suggestBulkShift returned no answer: no lag had eight or more overlapping samples with energy.' };
}

/** The constant phase that best matches a synthetic to the seismic. */
export function phaseMatch(syn, seis) {
  // the Hilbert transform cannot run across a gap, so the match is made on
  // the synthetic's live span and the seismic samples under it
  let i0 = syn.findIndex((v) => Number.isFinite(v));
  let i1 = syn.length - 1;
  while (i1 >= 0 && !Number.isFinite(syn[i1])) i1 -= 1;
  if (i0 < 0) i0 = 0;
  const a = Array.from(syn).slice(i0, i1 + 1);
  const b = Array.from(seis).slice(i0, i1 + 1);
  if (a.some((v) => !Number.isFinite(v))) return { error: 'The synthetic has a gap inside its live span.' };
  const r = attempt(() => estimatePhaseRotation(a, b));
  if (r && r.error) return r;
  return r || { error: 'estimatePhaseRotation returned no answer: fewer than eight overlapping samples.' };
}

/** Windowed zero-lag correlation of synthetic and seismic. */
export const tieQc = (syn, seis, dtMs, { windowMs = EKENE_PRO.tieQcWindowMs, stepMs = EKENE_PRO.tieQcStepMs } = {}) => attempt(() => windowedTieQc(syn, seis, dtMs, { windowMs, stepMs }));

/** A piecewise-linear tie warp from anchors (synthetic time, seismic time). */
export const tieWarp = (anchors) => attempt(() => makeTieWarp(anchors));

/** Wavelets compared, aligned, averaged (engines qi/wavelets). */
export function compare(wavelets, { maxLag = EKENE_PRO.compareMaxLag } = {}) {
  return attempt(() => compareWavelets(wavelets, { maxLag }));
}

export const resample = (w, dtIn, dtOut) => attempt(() => Array.from(resampleWavelet(w, dtIn, dtOut)));
export const unitEnergy = (w) => Array.from(normaliseWavelet(w));

/* ------------------------------------------------- gathers and velocity */

/** One of the pack's CDP gathers: { inline, crossline, traces, offsets, dtMs, t0Ms }. */
export function packGather(index) {
  const G = PACK.gathers;
  const c = G.cdps[index];
  if (!c) return { error: `The teaching pack has ${G.cdps.length} gathers; there is no gather ${index}.` };
  return { inline: c.inline, crossline: c.crossline, traces: c.traces, offsets: G.offsets_m, dtMs: G.dt_ms, t0Ms: G.t0_ms };
}

/** The pack's RMS velocity table, { tMs, vrms }. */
export const packVelocity = () => ({ tMs: PACK.rmsVelocity.rows.map((r) => r[0]), vrms: PACK.rmsVelocity.rows.map((r) => r[1]) });

/** Dix interval velocities of a table (times in ms, converted to s for the engine). */
export const dix = (table) => attempt(() => Array.from(dixInterval(table.vrms, table.tMs.map((t) => t / 1000))));

/** The table on a trace clock: Vrms by linear interpolation, Vint the Dix velocity of the segment. */
export function velocityOn(table, clock, ns) {
  return attempt(() => {
    const r = velocityOnGrid(table.tMs, table.vrms, ns, clock.dtMs, clock.t0Ms);
    return { vrms: Array.from(r.vrms), vint: Array.from(r.vint) };
  });
}

/** Vrms and Vint at one time (ms) from a table. */
export function velocityAt(table, tMs) {
  const r = velocityOn(table, { dtMs: 1, t0Ms: tMs }, 1);
  if (r.error) return r;
  return { vrms: r.vrms[0], vint: r.vint[0] };
}

export const walden = (offsetM, tMs, vrms, vint) => waldenAngle(offsetM, tMs / 1000, vrms, vint);
export const rayTrace = (layers, target, offsetM) => attempt(() => rayTraceAngle(layers, target, offsetM));
export const layered = (layers) => layeredRms(layers);
export const stretch = (offsetM, tMs, v) => nmoStretch(offsetM, tMs / 1000, v);
export const muteOffset = (tMs, v, maxStretch) => stretchMuteOffset(tMs / 1000, v, maxStretch);
export const offsetBins = (offsets, widthM) => attempt(() => binOffsets(offsets, widthM));
export const foldOf = (fold, centres, minFold) => foldSummary(fold, centres, minFold);

/**
 * The time of the event nearest a stated time on a trace: the sample of
 * the largest amplitude within the stated half window.
 */
export function pickEvent(clock, values, tMs, { halfWindowMs = EKENE_PRO.pickHalfWindowMs, sign = 1 } = {}) {
  const c = Math.round((tMs - clock.t0Ms) / clock.dtMs);
  const h = Math.round(halfWindowMs / clock.dtMs);
  let best = -1; let bv = -Infinity;
  for (let i = Math.max(0, c - h); i <= Math.min(values.length - 1, c + h); i++) {
    const v = sign * values[i];
    if (Number.isFinite(v) && v > bv) { bv = v; best = i; }
  }
  if (best < 0) return { error: `No live sample within ${halfWindowMs} ms of ${tMs} ms.` };
  return { index: best, tMs: sampleTime(clock, best), value: values[best] };
}

/** Residual moveout of a gather about an event at an absolute time (ms). */
export function rmo(g, eventMs, { windowMs = EKENE_PRO.rmoWindowMs, maxLagMs = EKENE_PRO.rmoMaxLagMs, nearCount = EKENE_PRO.rmoNearCount } = {}) {
  return attempt(() => residualMoveout({
    traces: g.traces, offsets: g.offsets, dtMs: g.dtMs, centreMs: eventMs - g.t0Ms, windowMs, maxLagMs, nearCount,
  }));
}

/** A gather mapped to angle bins with the stated velocity table and edges. */
export function angles(g, table, { edges = EKENE_PRO.angleEdges } = {}) {
  const ns = g.traces[0].length;
  const v = velocityOn(table, g, ns);
  if (v.error) return v;
  return attempt(() => angleGather({ traces: g.traces, offsets: g.offsets, vrms: v.vrms, vint: v.vint, dtMs: g.dtMs, edges, t0Ms: g.t0Ms }));
}

export const stackOf = (ag, from, to) => Array.from(partialStack(ag, from, to));
export const usable = (ag, edges, minFold) => Array.from(usableAngle(ag, edges, minFold));

/* ------------------------------------------------- AVO */

export const shueyFit = (anglesDeg, amps, { terms = 2 } = {}) => fitShuey(anglesDeg, amps, { terms });
export const contrasts = (A, B, vsVp) => contrastsFromAB(A, B, vsVp);
export const trend = (As, Bs) => backgroundTrend(As, Bs);
export const off = (A, B, m) => offTrend(A, B, m);
export const chi = (A, B, deg) => chiProjection(A, B, deg);
export const classOf = (A, B, band) => qiAvoClass(A, B, band === undefined ? {} : { band });

/**
 * Observed intercept and gradient at a well's top of reservoir from the near,
 * mid and far stack traces: the top picked on the near trace (pickEvent about
 * the checkshot time of the top), every stack read at that sample, and Shuey's
 * two-term fit at the stated mean angles.
 */
export function observedAtWell(well, { anglesDeg = EKENE_PRO.stackAngles, halfWindowMs = EKENE_PRO.pickHalfWindowMs } = {}) {
  const w = packWell(well);
  if (w.error) return w;
  const near = wellTrace(well, 'near');
  if (near.error) return near;
  const t = checkshotTwt(well, w.topFt);
  if (t && t.error) return t;
  const p = pickEvent(near, near.values, t, { halfWindowMs });
  if (p.error) return p;
  const amps = ['near', 'mid', 'far'].map((s) => wellTrace(well, s).values[p.index]);
  const fit = fitShuey(anglesDeg, amps, { terms: 2 });
  return { well, topFt: w.topFt, checkshotTwtMs: t, pickMs: p.tMs, amps, A: fit.A, B: fit.B, n: fit.n };
}

/** Modelled intercept and gradient at a well's top: its cap rock over its oil leg (or its sand where it has no oil leg). */
export function modelledAtWell(well) {
  const w = packWell(well);
  if (w.error) return w;
  const cap = layerMeans(zoneSamples(w, 'shale'));
  let res = zoneSamples(w, 'oil');
  let which = 'oil leg';
  if (!res.length) { res = zoneSamples(w, 'sand'); which = 'net sand'; }
  const lower = layerMeans(res);
  if (cap.error) return cap;
  if (lower.error) return lower;
  const ab = interfaceAB(cap, lower);
  return { well, layer: which, A: ab.a, B: ab.b };
}

/**
 * AVO at the wells (qi/avoWells compareAtWells): one least-squares scale over
 * every well, A and B together, then each well's scaled seismic point, its
 * residual and the two classes. rows: [{ name, modelled: {A, B}, observed: {A, B} }].
 */
export const avoAtWells = (rows) => attempt(() => compareAtWells(rows));

/** The comparison on the pack's four wells, modelled and seismic as above. */
export function packAvoAtWells(opts = {}) {
  const rows = [];
  for (const w of PACK_WELLS_PRO) {
    const o = observedAtWell(w, opts); if (o.error) return o;
    const m = modelledAtWell(w); if (m.error) return m;
    rows.push({ name: w, layer: m.layer, pickMs: o.pickMs, csMs: o.checkshotTwtMs, modelled: { A: m.A, B: m.B }, observed: { A: o.A, B: o.B } });
  }
  const c = avoAtWells(rows);
  return c.error ? c : { ...c, rows };
}

export { mToFt };
