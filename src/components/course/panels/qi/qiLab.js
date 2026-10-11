// THE QI TEACHING LAB: Quantitative Interpretation.
//
// Every number this lab returns is a return value of a vendored engine
// (packages/engines/engines/qi/*, engines/rockphysics/*, lib/gridding/closure,
// sha-identical with petrolord-engines at their canonical paths) on the Ekene
// teaching pack (ekeneQiPack.json, cut from release ekene-demo-v3 by the wave's
// cut_pack.py) or on the inputs a learner pastes into a panel. The teaching
// digest is printed FROM these functions by the wave's qi_dump.mjs, which
// imports this very file, so a lesson figure and a panel figure cannot drift.
//
// THIS IS AN APP COURSE. The Suite app is QI Studio, which runs the same
// engines; the course's practicals run in the four explorer panels this lab
// feeds, so a learner without a Suite seat can work every exercise.
//
// THE LAB NEVER READS THE CAPSTONE. It holds no graded answer, no tolerance and
// no capstone case; panelCapstoneGuard.test.js greps this directory for every
// rendering of every graded answer and every capstone name.
//
// NO REFUSAL MESSAGE IS WRITTEN HERE. An engine that refuses throws; every
// route here catches the throw and returns { error } carrying the engine's own
// message, so a lesson that quotes a refusal and the panel print the same words.
//
// NO HIDDEN DEFAULT. Every choice a result depends on (the taper, the window,
// the selection of wet samples, the block length, the fluids, the angle) is an
// argument a caller states; the Ekene settings the course teaches with are
// exported by name (EKENE) so a panel shows them as stated inputs.
//
// Depth: the pack carries metres exactly as the kit writes them; everything a
// learner reads is in feet (metres / 0.3048). Velocity m/s, density kg/m3,
// impedance kg/(m2 s), time ms.
//
// Nothing here reads a clock, a random number or a locale.
import PACK from './ekeneQiPack.json';
import {
  amplitudeSpectrum, averageSpectrum, spectrumStats, snrFromCoherency, footprint,
} from '@petrolord/engines/engines/qi/seismicQc.js';
import {
  elasticPoint, fitVsRegression, predictVs,
} from '@petrolord/engines/engines/rockphysics/elasticSet.js';
import {
  blockLogs, interfacePoints, fitFluidLine, distanceFromLine, backgroundSlope,
} from '@petrolord/engines/engines/rockphysics/avoTrend.js';
import { brine, liveOil, apiToRho0, woodMix } from '@petrolord/engines/engines/rockphysics/fluids.js';
import { substituteVels } from '@petrolord/engines/engines/rockphysics/gassmann.js';
import { mixMinerals, MINERALS } from '@petrolord/engines/engines/rockphysics/minerals.js';
import { gcSandShaleVs, GC_COEFF } from '@petrolord/engines/engines/rockphysics/vsEstimate.js';
import { zoeppritzRpp, shuey, avoClass } from '@petrolord/engines/engines/rockphysics/avo.js';
import { rickerWavelet } from '@petrolord/engines/lib/waveform.js';

export { PACK, MINERALS, GC_COEFF };

/* ------------------------------------------------------------- units */

export const M_PER_FT = 0.3048;
export const mToFt = (m) => m / M_PER_FT;
export const ftToM = (ft) => ft * M_PER_FT;
export const degFToC = (f) => (f - 32) / 1.8;
export const PSI_PER_MPA = 145.03773773020923;
export const psiToMPa = (psi) => psi / PSI_PER_MPA;
/** Standard cubic feet per stock tank barrel to litres per litre. */
export const scfPerStbToLL = (gor) => gor * 0.028316846592 / 0.158987294928;

/** Run an engine call; a throw becomes { error } carrying the engine's own words. */
export const attempt = (fn) => {
  try {
    return fn();
  } catch (e) {
    return { error: e && e.message ? e.message : String(e) };
  }
};

const mean = (xs) => xs.reduce((s, v) => s + v, 0) / xs.length;

/* ------------------------------------------------- the stated settings */

/**
 * The settings the course teaches with on the Ekene pack. Each is a stated
 * input of the call it feeds; a panel prints them and a learner can change
 * them. Depth settings are in feet: the logs are sampled every 0.5 ft.
 */
export const EKENE = Object.freeze({
  netSandVshCut: 0.35,            // net sand: Vsh at or below (the kit's cut-off)
  qcTaper: 0.1,                   // Tukey taper fraction for every spectrum
  qcWindowsMs: [[800, 1600], [1600, 2400]],
  snrMaxLag: 3,                   // samples searched either side for the best alignment
  footprintPeriods: [2, 16],      // periods searched, in lines
  shearForm: 'linear',
  shearLevel: 0.9,                // the prediction interval's level
  trendBlockFt: 16,               // block length for the wet trend
  shaleAboveFt: 65,               // the cap rock read as this much log above the top
  avoAngles: [0, 5, 10, 15, 20, 25, 30, 35],
  stacks: { near: [5, 15], mid: [15, 25], far: [25, 35] },
  minerals: { sand: 'quartz', shale: 'clay' },
});

/* ------------------------------------------------------- wells */

export const PACK_WELLS = Object.freeze(Object.keys(PACK.wells));

/**
 * A well as the lab reads it: { name, rows, topFt, baseFt, owcFt }, every row
 * { md_ft, vp, vs, rho, phit, vsh, sw } (gr where the source has it). The
 * pack's metres become feet here; a capstone case file is already in feet.
 */
export function packWell(name) {
  const w = PACK.wells[name];
  if (!w) return { error: `The teaching pack has no logs for ${name}.` };
  return {
    name,
    topFt: mToFt(w.tops_m.ekeneTop),
    baseFt: mToFt(w.tops_m.ekeneBase),
    owcFt: mToFt(PACK.contacts_m.ekeneOwc),
    rows: w.rows.map((r) => ({
      md_ft: mToFt(r[0]), vp: r[1], vs: r[2], rho: r[3], gr: r[4], phit: r[5], vsh: r[6], sw: r[7],
    })),
  };
}

/**
 * The samples of one zone of a well:
 *   'oil'    net sand above the oil-water contact, inside the reservoir
 *   'water'  net sand at or below the contact, inside the reservoir
 *   'sand'   every net sand sample of the reservoir
 *   'shale'  the stated thickness of log above the top of the reservoir
 *   'window' every sample
 * Net sand is Vsh at or below the stated cut-off. A sample with a missing or
 * non-positive Vp, Vs or density is never selected.
 */
export function zoneSamples(well, zone, { vshCut = EKENE.netSandVshCut, shaleAboveFt = EKENE.shaleAboveFt } = {}) {
  if (!well || well.error) return well || { error: 'No well given.' };
  const inRes = (r) => r.md_ft >= well.topFt && r.md_ft <= well.baseFt;
  const net = (r) => r.vsh <= vshCut;
  const ok = (r) => r.vp > 0 && r.vs > 0 && r.rho > 0;
  const pick = {
    oil: (r) => inRes(r) && net(r) && r.md_ft < well.owcFt,
    water: (r) => inRes(r) && net(r) && r.md_ft >= well.owcFt,
    sand: (r) => inRes(r) && net(r),
    shale: (r) => r.md_ft >= well.topFt - shaleAboveFt && r.md_ft < well.topFt,
    window: () => true,
  }[zone];
  if (!pick) return { error: `Unknown zone ${zone}: give oil, water, sand, shale or window.` };
  return well.rows.filter((r) => ok(r) && pick(r));
}

/** Mean Vp, Vs, density, porosity, Vsh and Sw of a set of samples. */
export function layerMeans(samples) {
  if (!samples || samples.error) return samples || { error: 'No samples.' };
  if (!samples.length) return { error: 'No samples to average.' };
  const k = ['vp', 'vs', 'rho', 'phit', 'vsh', 'sw'];
  return Object.fromEntries([...k.map((x) => [x, mean(samples.map((s) => s[x]))]), ['n', samples.length]]);
}

/** The sample at a stated depth (ft), to the half foot. */
export function sampleAt(well, mdFt) {
  const r = well.rows.find((x) => Math.abs(x.md_ft - mdFt) < 0.25);
  return r || { error: `No sample at ${mdFt} ft.` };
}

/* ------------------------------------------------- a pasted case */

/**
 * A case file a learner pastes (a capstone case, or their own data in the
 * same shape): its well as the lab reads wells. The columns are read by name,
 * so a file may carry them in any order. Returns { error } naming what is
 * missing.
 */
export function caseWell(c) {
  const w = c && c.well;
  if (!w) return { error: 'The case has no well block.' };
  for (const k of ['topFt', 'baseFt', 'owcFt']) if (!Number.isFinite(w[k])) return { error: `The case well has no ${k}.` };
  const cols = w.columns || [];
  const need = ['md_ft', 'vp', 'vs', 'rho', 'phit', 'vsh', 'sw'];
  const ix = Object.fromEntries(need.map((k) => [k, cols.indexOf(k)]));
  const missing = need.filter((k) => ix[k] < 0);
  if (missing.length) return { error: `The case well has no column ${missing.join(', ')}.` };
  if (!Array.isArray(w.rows) || w.rows.length < 4) return { error: 'The case well has fewer than four rows.' };
  return {
    name: w.name || 'the case well',
    topFt: w.topFt, baseFt: w.baseFt, owcFt: w.owcFt,
    rows: w.rows.map((row) => Object.fromEntries(need.map((k) => [k, row[ix[k]]]))),
  };
}

/** A case file's traces: { dtMs, traces }. */
export function caseTraces(c) {
  const t = c && c.traces;
  if (!t || !Array.isArray(t.traces) || !t.traces.length) return { error: 'The case has no traces block.' };
  if (!(t.dt_ms > 0)) return { error: 'The case traces have no sample interval (dt_ms).' };
  return { dtMs: t.dt_ms, traces: t.traces };
}

/* ------------------------------------------------- the data inventory */

/** One row per well of the kit: what the pack's headers say each holds. */
export function inventory() {
  const num = (w) => Number(String(w).split('-')[1]);
  return Object.entries(PACK.headers).sort((x, y) => num(x[0]) - num(y[0])).map(([well, h]) => ({
    well,
    kind: h.kind,
    logs: h.logs,
    curves: h.curves || [],
    sonic: !!h.curves?.includes('DT'),
    shear: !!h.curves?.includes('DTS'),
    density: !!h.curves?.includes('RHOB'),
    checkshots: h.checkshots ?? 0,
    ekeneTop_ft: h.ekeneTop_m != null ? mToFt(h.ekeneTop_m) : null,
    ekeneBase_ft: h.ekeneBase_m != null ? mToFt(h.ekeneBase_m) : null,
  }));
}

/* ------------------------------------------------------- seismic QC */

/**
 * Traces for seismic QC, from the pack:
 *   'spread'      the full-stack traces spread over the survey (ten inlines by
 *                 twelve crosslines), for the spectra
 *   'neighbours'  21 neighbouring traces along the inline through Ekene-1, in
 *                 crossline order, for signal to noise
 *   'ekene1'      the one trace at Ekene-1
 * Every trace runs from the pack's t0 to its t1 on its sample interval.
 */
export function qcTraces(which = 'spread') {
  if (which === 'spread') return PACK.qcSpread.traces.flat();
  if (which === 'neighbours') return PACK.qcNeighbours.traces;
  if (which === 'ekene1') return [PACK.qcNeighbours.traces[(PACK.qcNeighbours.traces.length - 1) / 2]];
  return { error: `Unknown selection ${which}: give spread, neighbours or ekene1.` };
}

export const QC_CLOCK = Object.freeze({ dtMs: PACK.qcSpread.dt_ms, t0Ms: PACK.qcSpread.t0_ms, t1Ms: PACK.qcSpread.t1_ms });

/** Restrict traces to a time window (ms) on the QC traces' own clock. */
export function timeWindow(traces, { t0Ms, t1Ms, dtMs = QC_CLOCK.dtMs, startMs = QC_CLOCK.t0Ms }) {
  const i0 = Math.round((t0Ms - startMs) / dtMs);
  const i1 = Math.round((t1Ms - startMs) / dtMs);
  if (i0 < 0 || i1 < i0) return { error: `The window ${t0Ms} to ${t1Ms} ms is outside the traces.` };
  return traces.map((t) => t.slice(i0, i1 + 1));
}

/** The mean spectrum of traces and its peak, centroid and band edges. */
export function spectrum(traces, dtMs, { taper } = {}) {
  if (traces && traces.error) return traces;
  return attempt(() => {
    const s = averageSpectrum(traces, dtMs, { taper });
    const st = spectrumStats(s);
    return {
      traces: s.traces, df: s.df, freqHz: Array.from(s.freqHz), amp: Array.from(s.amp),
      peakHz: st.peakHz, peakAmp: st.peakAmp, centroidHz: st.centroidHz,
      low6Hz: st.band6[0], high6Hz: st.band6[1], low20Hz: st.band20[0], high20Hz: st.band20[1],
      bandwidth6Hz: st.bandwidth6Hz,
    };
  });
}

/** One trace's spectrum (amplitudeSpectrum + spectrumStats). */
export function traceSpectrum(trace, dtMs, { taper } = {}) {
  return attempt(() => {
    const st = spectrumStats(amplitudeSpectrum(trace, dtMs, { taper }));
    return { peakHz: st.peakHz, centroidHz: st.centroidHz, low6Hz: st.band6[0], high6Hz: st.band6[1], bandwidth6Hz: st.bandwidth6Hz };
  });
}

/** A zero-phase Ricker wavelet sampled on the stated clock (lib/waveform). */
export function ricker(freqHz, dtMs, halfLengthMs) {
  return attempt(() => Array.from(rickerWavelet(freqHz, dtMs, halfLengthMs)));
}

/** Signal to noise from neighbouring traces. */
export function snr(traces, { maxLag } = {}) {
  return attempt(() => snrFromCoherency(traces, { maxLag }));
}

/** The pack's RMS amplitude slice (inlines by crosslines). */
export const packSlice = () => PACK.slice.values;

/** The strongest periodic stripe along each axis of a slice. */
export function stripe(slice, { minPeriod, maxPeriod } = {}) {
  return attempt(() => footprint(slice, { minPeriod, maxPeriod }));
}

/**
 * A slice with a stated stripe added: every `period`-th crossline (counting
 * from `offset`) multiplied by `gain`. A designed teaching case, labelled as
 * such wherever it is printed.
 */
export function withStripe(slice, { period, gain, offset = 0 }) {
  return slice.map((row) => row.map((v, j) => ((j - offset) % period === 0 ? v * gain : v)));
}

/* ------------------------------------------------- shear and elastic */

/** Greenberg-Castagna shear on the sand-shale split, against the measured shear. */
export function shearAgainstGc(samples) {
  const rows = samples.map((s) => {
    const gc = gcSandShaleVs(s.vp, s.vsh);
    return { md_ft: s.md_ft, vp: s.vp, vs: s.vs, vsh: s.vsh, gc, ratio: s.vs / gc };
  });
  return { rows, meanRatio: mean(rows.map((r) => r.ratio)), n: rows.length };
}

/** The local shear trend fitted to measured pairs, with predictions at stated Vp. */
export function shearTrend(samples, { form = EKENE.shearForm, level = EKENE.shearLevel, at = [] } = {}) {
  const fit = attempt(() => fitVsRegression(samples.map((s) => ({ vp: s.vp, vs: s.vs })), { form }));
  if (fit.error) return fit;
  const predictions = at.map((vp) => {
    const p = attempt(() => predictVs(fit, vp, { level }));
    return { vp, ...p };
  });
  return {
    form: fit.form, coef: fit.coef, n: fit.n, dof: fit.dof, s: fit.s, r2: fit.r2,
    vpRange: fit.vpRange, level, predictions, fit,
  };
}

/** Every elastic quantity at one sample (SI). */
export const elastic = (vp, vs, rho) => elasticPoint(vp, vs, rho);

/* ------------------------------------------------------- fluids */

/**
 * Brine and live oil at stated conditions (Batzle-Wang through the engine).
 * cond: { tF, pPsia, salinity (weight fraction), api, gorScfStb, gasSg }
 */
export function fluidsAt(cond) {
  return attempt(() => {
    const tC = degFToC(cond.tF);
    const pMPa = psiToMPa(cond.pPsia);
    const gorLL = scfPerStbToLL(cond.gorScfStb);
    const rho0 = apiToRho0(cond.api);
    return { tC, pMPa, gorLL, rho0, brine: brine(tC, pMPa, cond.salinity), oil: liveOil(tC, pMPa, rho0, gorLL, cond.gasSg) };
  });
}

/** The pore fluid of a sample at saturation sw: brine and oil mixed by Wood. */
export function poreFluid(fluids, sw) {
  return attempt(() => woodMix([{ ...fluids.brine, sat: sw }, { ...fluids.oil, sat: 1 - sw }]));
}

/** The mineral of a sample: quartz and clay by Voigt-Reuss-Hill on its Vsh. */
export function mineralOf(vsh) {
  return attempt(() => mixMinerals([{ name: EKENE.minerals.sand, frac: 1 - vsh }, { name: EKENE.minerals.shale, frac: vsh }]));
}

/**
 * One sample taken from its own saturation to a stated one (1 = brine) by
 * Gassmann (substituteVels), with the elastic set before and after.
 */
export function substituteSample(s, fluids, { toSw = 1 } = {}) {
  const flA = poreFluid(fluids, s.sw);
  if (flA.error) return flA;
  const flB = poreFluid(fluids, toSw);
  if (flB.error) return flB;
  const min = mineralOf(s.vsh);
  if (min.error) return min;
  const out = attempt(() => substituteVels(s.vp, s.vs, s.rho, min.k, s.phit, flA, flB));
  if (out.error) return out;
  const before = elasticPoint(s.vp, s.vs, s.rho);
  const after = elasticPoint(out.vp, out.vs, out.rho);
  return {
    md_ft: s.md_ft, kmin: min.k, kflA: flA.k, kflB: flB.k,
    vp: out.vp, vs: out.vs, rho: out.rho,
    aiBefore: before.ai, aiAfter: after.ai, vpvsBefore: before.vpvs, vpvsAfter: after.vpvs,
  };
}

/** A zone substituted sample by sample, with the means before and after. */
export function substituteZone(samples, fluids, opts) {
  const rows = [];
  for (const s of samples) {
    const r = substituteSample(s, fluids, opts);
    if (r.error) return { error: r.error, at: s.md_ft };
    rows.push(r);
  }
  const m = (k) => mean(rows.map((r) => r[k]));
  return {
    rows, n: rows.length,
    aiBefore: m('aiBefore'), aiAfter: m('aiAfter'), vpvsBefore: m('vpvsBefore'), vpvsAfter: m('vpvsAfter'),
    vpAfter: m('vp'), vsAfter: m('vs'), rhoAfter: m('rho'),
  };
}

/* ------------------------------------------------- the wet trend */

/**
 * The wet background trend over a well's pack window, as QI Studio and Rock
 * Physics Studio draw it: every sample with oil in it taken to brine by
 * Gassmann, the logs blocked, an (A, B) point at every block boundary, and the
 * fluid line through the origin fitted to the points (engines avoTrend).
 */
export function wetTrend(well, fluids, { blockFt = EKENE.trendBlockFt } = {}) {
  const rows = zoneSamples(well, 'window');
  if (rows.error) return rows;
  if (rows.length < 4) return { error: 'The trend window holds fewer than four samples.' };
  const vp = []; const vs = []; const rho = [];
  let substituted = 0;
  for (const s of rows) {
    if (s.sw < 1) {
      const r = substituteSample(s, fluids, { toSw: 1 });
      if (r.error) return { error: r.error, at: s.md_ft };
      vp.push(r.vp); vs.push(r.vs); rho.push(r.rho);
      substituted += 1;
    } else {
      vp.push(s.vp); vs.push(s.vs); rho.push(s.rho);
    }
  }
  const steps = rows.slice(1).map((r, i) => r.md_ft - rows[i].md_ft).sort((x, y) => x - y);
  const step = steps[Math.floor((steps.length - 1) / 2)];
  const blockSamples = Math.max(1, Math.round(blockFt / step));
  const idx = rows.map((_, i) => i);
  const blocks = blockLogs(vp, vs, rho, idx, blockSamples);
  const points = interfacePoints(blocks).map((p) => ({ a: p.a, b: p.b, md_ft: rows[p.at].md_ft }));
  const vsVp = mean(blocks.map((b) => b.vs / b.vp));
  const line = attempt(() => fitFluidLine(points));
  if (line.error) return line;
  return {
    samples: rows.length, substituted, stepFt: step, blockSamples, blocks: blocks.length, points, line,
    vsVp, castagnaSlope: backgroundSlope(vsVp),
  };
}

/** Shuey's intercept and gradient of one interface (upper over lower layer). */
export function interfaceAB(upper, lower) {
  if (!upper || upper.error) return upper || { error: 'No upper layer.' };
  if (!lower || lower.error) return lower || { error: 'No lower layer.' };
  return attempt(() => {
    const r = shuey(upper.vp, upper.vs, upper.rho, lower.vp, lower.vs, lower.rho, 0);
    return { a: r.a, b: r.b, c: r.c };
  });
}

/** Signed distance of (A, B) from a line B = slope x A (negative: the hydrocarbon side). */
export const distance = (a, b, slope) => distanceFromLine(a, b, { slope });

/* ------------------------------------------------- modelled AVO */

/**
 * Exact Zoeppritz at stated angles, Shuey's terms, the class, and the mean of
 * the exact coefficient over each stated angle range (every whole degree, ends
 * included), the way the kit's angle stacks were built.
 */
export function modelledAvo(upper, lower, { angles = EKENE.avoAngles, stacks = EKENE.stacks } = {}) {
  return attempt(() => {
    const R = (th) => {
      const z = zoeppritzRpp(upper.vp, upper.vs, upper.rho, lower.vp, lower.vs, lower.rho, th);
      if (Math.abs(z.im) > 0) throw new Error(`The angle ${th} is past the critical angle; the coefficient is complex.`);
      return z.re;
    };
    const sh = shuey(upper.vp, upper.vs, upper.rho, lower.vp, lower.vs, lower.rho, 0);
    const exact = angles.map((th) => ({ angle: th, r: R(th) }));
    const stackMeans = Object.fromEntries(Object.entries(stacks).map(([k, [lo, hi]]) => {
      const vals = [];
      for (let th = lo; th <= hi; th += 1) vals.push(R(th));
      return [k, mean(vals)];
    }));
    return { exact, a: sh.a, b: sh.b, c: sh.c, avoClass: avoClass(sh.a, sh.b), stackMeans };
  });
}
