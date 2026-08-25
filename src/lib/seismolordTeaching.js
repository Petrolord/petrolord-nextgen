// Seismolord teaching workflow (Beginner tier: synthetics-first) —
// drives the central @petrolord/engines synthetics engine over the
// basic_20 teaching well (the same golden LAS the Well Data Manager
// course QCs). The engine is consumed as-is; this module fixes the
// teaching time-depth function and computes the summary-panel numbers
// the capstone grades. The oracle was reproduced by running exactly
// this pipeline in Node before the migration was seeded.
import { parseLas } from '@petrolord/engines/engines/welldata/lasParse.js';
import {
  buildSynthetic, rickerWavelet, slownessToVelocity, isGap, suggestBulkShift,
} from '@petrolord/engines/engines/seismolord/synthetics.js';
import basicLas from '@petrolord/engines/test-data/wells/las/basic_20.las?raw';

// Teaching time-depth: a vertical well with the KB at MSL and a single
// 2000 m/s overburden velocity, so TWT(z) = 2z / 2000 s = z ms. Simple
// on purpose — the learner can hand-check every time on the panel.
export const V_OVERBURDEN_MS = 2000;
export const DT_MS = 2;                 // synthetic sample rate
export const NS = 900;                  // 0–1798 ms grid
export const CAPSTONE_FREQ_HZ = 25;     // the capstone's wavelet
export const WAVELET_HALF_MS = 60;

const mdToTvdss = (m) => m;
const tvdssToTwt = (z) => (2 * z / V_OVERBURDEN_MS) * 1000;

const parsed = parseLas(basicLas);
const curve = (m) => parsed.curves.find((c) => c.mnemonic === m).data;
export const WELL = {
  md: curve('DEPT'),
  dt: curve('DT'),
  rhob: curve('RHOB'),
  gr: curve('GR'),
};

// Build the synthetic at a given wavelet frequency. Returns the engine
// result plus the summary-panel numbers (validity-masked).
export function computeSynthetic(freqHz) {
  const wavelet = rickerWavelet(Number(freqHz), DT_MS, WAVELET_HALF_MS);
  const syn = buildSynthetic({
    dtCurve: WELL.dt, rhobCurve: WELL.rhob, mdArray: WELL.md,
    mdToTvdss, tvdssToTwt, dtMs: DT_MS, ns: NS, wavelet,
  });

  const vel = slownessToVelocity(WELL.dt);
  let vSum = 0;
  let vN = 0;
  for (const v of vel) if (!isGap(v)) { vSum += v; vN += 1; }

  let impMax = 0;
  for (const v of syn.impedance) if (!isGap(v) && v > impMax) impMax = v;

  const peak = (arr, mask) => {
    let maxAbs = 0;
    let idx = -1;
    for (let i = 0; i < arr.length; i++) {
      if (mask && !mask[i]) continue;
      if (isGap(arr[i])) continue;
      if (Math.abs(arr[i]) > maxAbs) { maxAbs = Math.abs(arr[i]); idx = i; }
    }
    return { maxAbs, twtMs: idx * DT_MS };
  };
  const rcPeak = peak(syn.rc, null);
  const synPeak = peak(syn.synthetic, syn.validity);

  return {
    wavelet,
    syn,
    summary: {
      meanVelocity: vSum / vN,
      twtLogTop: tvdssToTwt(WELL.md[0]),
      twtLogBase: tvdssToTwt(WELL.md[WELL.md.length - 1]),
      impMax,
      rcPeakAbs: rcPeak.maxAbs,
      rcPeakTwt: rcPeak.twtMs,
      synPeakAbs: synPeak.maxAbs,
      synPeakTwt: synPeak.twtMs,
    },
  };
}

// Chart rows: wavelet (time vs amplitude).
export function waveletRows(wavelet) {
  const n = (wavelet.length - 1) / 2;
  return Array.from(wavelet, (a, i) => ({ t: (i - n) * DT_MS, a }));
}

// Chart rows: RC + synthetic on the TWT grid, clipped to the live window.
export function traceRows(syn) {
  const rows = [];
  for (let i = 0; i < syn.synthetic.length; i++) {
    const rc = syn.rc[i];
    const s = syn.synthetic[i];
    if (isGap(rc) && isGap(s)) continue;
    rows.push({
      twt: i * DT_MS,
      rc: isGap(rc) ? null : rc,
      syn: isGap(s) || !syn.validity[i] ? null : s,
    });
  }
  return rows;
}

// ---- Advanced tier (NG7): wedge modeling + tuning of the SAND
// reflection pair (equal and opposite RC, the classic tuning setup) on
// the central rockphysics wedge engine. Oracle-reproduced in Node
// before the NG7 migration was seeded.
import { tuningCurve, tuningThicknessMs, wedgePanel } from '@petrolord/engines/engines/rockphysics/wedge.js';

export const WEDGE = { rcTop: 0.08, rcBase: -0.08, dtMs: 2, maxThicknessMs: 60 };

// The frequencies the Expert-tier panel offers. The capstone reads 25 and
// 40; the other three exist so the f*T law can be demonstrated rather than
// asserted (20 and 50 also land on a product of 400, 15 lands on 390).
export const WEDGE_FREQS = [15, 20, 25, 40, 50];

// The product f*T at the CONTINUOUS tuning maximum, in Hz times ms:
// 1000 * sqrt(6) / (2 pi) = 389.8484. Every frequency's theoretical tuning
// thickness is this constant divided by the frequency.
export const TUNING_PRODUCT_HZ_MS = (Math.sqrt(6) / (2 * Math.PI)) * 1000;

// The thin-bed peak-to-trough floor, 1.0493 / (pi f) in seconds, from the
// smaller root of 4u^4 - 12u^2 + 3 = 0 with u = pi f t.
const DOUBLET_U = Math.sqrt((12 - Math.sqrt(144 - 48)) / 8);
export function apparentFloorMs(freqHz) {
  return (2 * DOUBLET_U) / (Math.PI * freqHz) * 1000;
}

// One wedge panel at one frequency: the tuning curve, the panel-level
// readings the capstone grades, and a per-trace row carrying the readings
// that respond to the thickness selector (peak drift and apparent
// thickness). Everything comes from the shared rockphysics wedge engine.
export function computeWedge(freqHz) {
  const { rcTop, rcBase, dtMs, maxThicknessMs } = WEDGE;
  const f = Number(freqHz);
  const { thicknessesMs, amplitudes } = tuningCurve(rcTop, rcBase, f, dtMs, maxThicknessMs);
  const { traces, t0 } = wedgePanel(rcTop, rcBase, f, dtMs, maxThicknessMs);
  const tuneMs = tuningThicknessMs(amplitudes, dtMs);
  const theoryMs = (Math.sqrt(6) / (2 * Math.PI * f)) * 1000;

  // Same window the engine's tuningCurve uses, so the drift reported here
  // is the position of the amplitude the curve plots.
  const w = Math.round(((0.5 * Math.sqrt(6)) / (Math.PI * f)) * 1000 / dtMs) + 1;
  const rows = traces.map((trace, k) => {
    let peakIdx = t0;
    let best = -1;
    for (let i = Math.max(0, t0 - w); i <= Math.min(trace.length - 1, t0 + w); i++) {
      if (Math.abs(trace[i]) > best) { best = Math.abs(trace[i]); peakIdx = i; }
    }
    // Apparent thickness: largest positive to largest negative, over a
    // window wide enough to hold the base event at any modelled thickness.
    let hi = t0; let lo = t0; let hiV = -Infinity; let loV = Infinity;
    for (let i = t0 - 20; i <= Math.min(trace.length - 1, t0 + 40); i++) {
      if (trace[i] > hiV) { hiV = trace[i]; hi = i; }
      if (trace[i] < loV) { loV = trace[i]; lo = i; }
    }
    return {
      thicknessMs: thicknessesMs[k],
      amp: amplitudes[k],
      peakOffsetMs: (peakIdx - t0) * dtMs,
      apparentMs: (lo - hi) * dtMs,
    };
  });

  return {
    freqHz: f,
    thicknessesMs,
    amplitudes,
    traces,
    t0,
    dtMs,
    tuneMs,
    tuneAmp: amplitudes[tuneMs / dtMs],
    isoAmp: amplitudes[amplitudes.length - 1],
    theoryMs,
    overshootMs: tuneMs - theoryMs,
    productHzMs: f * tuneMs,
    floorMs: apparentFloorMs(f),
    rows,
  };
}

export function computeAdvanced() {
  return { f25: computeWedge(25), f40: computeWedge(40) };
}

// Chart rows for the two tuning curves (thickness vs peak amplitude).
export function tuningRows(adv) {
  return adv.f25.thicknessesMs.map((t, i) => ({
    thickness: t,
    a25: adv.f25.amplitudes[i],
    a40: adv.f40.amplitudes[i],
  }));
}

// ---- Intermediate tier: bulk shift + tuning.
// The "observed seismic" is the 25 Hz synthetic arriving 8 ms late (a
// known planted lag, so the scan's answer is checkable). Oracle
// reproduced in Node before the NG6 migration was seeded.
export const PLANTED_LAG_MS = 8;

export function computeIntermediate() {
  const s25 = computeSynthetic(25);
  const s15 = computeSynthetic(15);
  const s40 = computeSynthetic(40);
  const lagSamples = PLANTED_LAG_MS / DT_MS;
  const seis = new Float32Array(NS).fill(NaN);
  for (let i = 0; i < NS - lagSamples; i++) seis[i + lagSamples] = s25.syn.synthetic[i];
  const shift = suggestBulkShift(s25.syn.synthetic, seis, DT_MS, 40);
  return {
    bulkShiftMs: shift?.lagMs ?? null,
    corr: shift?.corr ?? null,
    peak15: { abs: s15.summary.synPeakAbs, twt: s15.summary.synPeakTwt },
    peak40: { abs: s40.summary.synPeakAbs, twt: s40.summary.synPeakTwt },
  };
}
