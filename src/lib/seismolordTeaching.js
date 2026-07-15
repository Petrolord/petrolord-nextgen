// Seismolord teaching workflow (Beginner tier: synthetics-first) —
// drives the central @petrolord/engines synthetics engine over the
// basic_20 teaching well (the same golden LAS the Well Data Manager
// course QCs). The engine is consumed as-is; this module fixes the
// teaching time-depth function and computes the summary-panel numbers
// the capstone grades. The oracle was reproduced by running exactly
// this pipeline in Node before the migration was seeded.
import { parseLas } from '@petrolord/engines/engines/welldata/lasParse.js';
import {
  buildSynthetic, rickerWavelet, slownessToVelocity, isGap,
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
