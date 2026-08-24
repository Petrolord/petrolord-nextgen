import { describe, it, expect } from 'vitest';
import {
  computeSynthetic, CAPSTONE_FREQ_HZ, DT_MS, NS, V_OVERBURDEN_MS, WELL,
} from '@/lib/seismolordTeaching';

// Pins the synthetic-explorer panel math to the live NG3 capstone
// oracle. If any of these drift, the teaching panel would let a learner
// produce numbers the grader rejects.

describe('seismolord synthetic explorer: engine math', () => {
  const r = computeSynthetic(CAPSTONE_FREQ_HZ);
  const s = r.summary;

  it('reproduces the NG3 capstone six at 25 Hz', () => {
    expect(s.meanVelocity).toBeCloseTo(3145.2869374221345, 6);
    expect(s.twtLogTop).toBeCloseTo(1500, 10);
    expect(s.impMax).toBeCloseTo(10624.9560546875, 4);
    expect(s.rcPeakAbs).toBeCloseTo(0.017688043415546417, 12);
    expect(s.rcPeakTwt).toBe(1582);
    expect(s.synPeakTwt).toBe(1642);
  });

  it('keeps the teaching time-depth identity: TWT in ms equals depth in m', () => {
    expect(V_OVERBURDEN_MS).toBe(2000);
    expect(s.twtLogTop).toBe(WELL.md[0]);
    expect(s.twtLogBase).toBe(WELL.md[WELL.md.length - 1]);
    expect(s.twtLogBase).toBe(1650);
  });

  it('puts the strongest amplitude at a different time from the strongest reflection', () => {
    // The whole point of the convolution module: the trace is a sum of
    // overlapping wavelet copies, so the brightest sample is not the
    // biggest interface.
    expect(s.synPeakTwt).not.toBe(s.rcPeakTwt);
    expect(Math.abs(s.synPeakTwt - s.rcPeakTwt)).toBe(60);
  });

  it('moves both the peak amplitude and its time with wavelet frequency', () => {
    const f15 = computeSynthetic(15).summary;
    const f40 = computeSynthetic(40).summary;
    expect(f15.synPeakAbs).toBeCloseTo(0.157315, 5);
    expect(f15.synPeakTwt).toBe(1580);
    expect(s.synPeakAbs).toBeCloseTo(0.073005, 5);
    expect(f40.synPeakAbs).toBeCloseTo(0.036223, 5);
    expect(f40.synPeakTwt).toBe(1646);
    // Lower frequency gives the LARGER peak on this well: a longer
    // wavelet sums more neighbouring reflections constructively.
    expect(f15.synPeakAbs).toBeGreaterThan(s.synPeakAbs);
    expect(s.synPeakAbs).toBeGreaterThan(f40.synPeakAbs);
  });

  it('builds the wavelet and the time grid to the documented shape', () => {
    expect(r.wavelet.length).toBe(61);
    expect(DT_MS).toBe(2);
    expect(NS).toBe(900);
    const mid = (r.wavelet.length - 1) / 2;
    expect(r.wavelet[mid]).toBeCloseTo(1, 10);
    expect(Math.min(...r.wavelet)).toBeCloseTo(-0.4449, 3);
  });
});
