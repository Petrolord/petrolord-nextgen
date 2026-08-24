import { describe, it, expect } from 'vitest';
import {
  computeSynthetic, computeIntermediate, PLANTED_LAG_MS, DT_MS, NS,
} from '@/lib/seismolordTeaching';
import { suggestBulkShift } from '@petrolord/engines/engines/seismolord/synthetics.js';

// Pins the shift-explorer panel math to the live NG6 Professional capstone oracle.
const I = computeIntermediate();

function scan() {
  const s25 = computeSynthetic(25);
  const lagSamples = PLANTED_LAG_MS / DT_MS;
  const seis = new Float32Array(NS).fill(NaN);
  for (let i = 0; i < NS - lagSamples; i++) seis[i + lagSamples] = s25.syn.synthetic[i];
  return suggestBulkShift(s25.syn.synthetic, seis, DT_MS, 40);
}

describe('seismolord professional: bulk shift and tuning', () => {
  it('reproduces the NG6 professional capstone answer key', () => {
    expect(I.bulkShiftMs).toBe(8);
    expect(I.corr).toBeCloseTo(1, 12);
    expect(I.peak15.abs).toBeCloseTo(0.1573149710893631, 12);
    expect(I.peak40.abs).toBeCloseTo(0.0362229160964489, 12);
    expect(I.peak15.twt).toBe(1580);
    expect(I.peak40.twt).toBe(1646);
  });

  it('recovers the planted lag exactly, because the scan is an autocorrelation', () => {
    const s = scan();
    expect(PLANTED_LAG_MS / DT_MS).toBe(4);
    expect(s.lagMs).toBe(PLANTED_LAG_MS);
    // Exactly 1: the observed trace IS this synthetic shifted, so a real
    // tie can never reproduce this number.
    expect(s.corr).toBeCloseTo(1, 12);
  });

  it('tests 41 lags and returns a curve symmetric about the answer', () => {
    const s = scan();
    expect(s.series).toHaveLength(41);
    expect(s.series[0].lagMs).toBe(-40);
    expect(s.series[s.series.length - 1].lagMs).toBe(40);
    const at = (ms) => s.series.find((e) => e.lagMs === ms).corr;
    for (const d of [2, 4, 6, 8]) {
      expect(at(PLANTED_LAG_MS - d)).toBeCloseTo(at(PLANTED_LAG_MS + d), 12);
    }
    expect(at(6)).toBeCloseTo(0.972386, 5);
    expect(at(0)).toBeCloseTo(0.621742, 5);
  });

  it('leaves an unshifted tie looking respectable while it is wrong', () => {
    const s = scan();
    const zero = s.series.find((e) => e.lagMs === 0).corr;
    // The trap: 0.62 is not an obviously broken number, yet the tie is
    // a full 8 ms out.
    expect(zero).toBeGreaterThan(0.6);
    expect(zero).toBeLessThan(s.corr);
    expect(Math.min(...s.series.map((e) => e.corr))).toBeCloseTo(-0.409277, 5);
  });

  it('moves both the peak amplitude and its time with frequency', () => {
    const p = (f) => {
      const s = computeSynthetic(f);
      return { abs: s.summary.synPeakAbs, twt: s.summary.synPeakTwt };
    };
    const a15 = p(15); const a25 = p(25); const a40 = p(40);
    // Amplitude FALLS as frequency rises, which inverts the usual intuition.
    expect(a15.abs).toBeGreaterThan(a25.abs);
    expect(a25.abs).toBeGreaterThan(a40.abs);
    expect(a15.abs / a40.abs).toBeGreaterThan(4);
    // ...and the peak time moves 66 ms across the same range.
    expect(a15.twt).toBe(1580);
    expect(a25.twt).toBe(1642);
    expect(a40.twt).toBe(1646);
    expect(a40.twt - a15.twt).toBe(66);
  });

  it('holds the reflectivity fixed while the peak moves', () => {
    // Reflectivity is a property of the rock, so it is frequency-independent.
    const rcs = [15, 25, 40].map((f) => {
      const s = computeSynthetic(f);
      return { abs: s.summary.rcPeakAbs, twt: s.summary.rcPeakTwt };
    });
    for (const rc of rcs) {
      expect(rc.abs).toBeCloseTo(0.017688043415546417, 12);
      expect(rc.twt).toBe(1582);
    }
    // At 15 Hz the peak sits essentially on the strongest coefficient;
    // by 40 Hz it has walked away from that same unmoved coefficient.
    expect(Math.abs(1580 - 1582)).toBe(2);
    expect(Math.abs(1646 - 1582)).toBe(64);
  });
});
