import { describe, it, expect } from 'vitest';
import {
  computeWedge, computeAdvanced, apparentFloorMs, TUNING_PRODUCT_HZ_MS, WEDGE, WEDGE_FREQS,
} from '@/lib/seismolordTeaching';
import { tuningCurve, tuningThicknessMs } from '@petrolord/engines/engines/rockphysics/wedge.js';
import { substituteVels } from '@petrolord/engines/engines/rockphysics/gassmann.js';
import { brine, gas } from '@petrolord/engines/engines/rockphysics/fluids.js';
import { MINERALS } from '@petrolord/engines/engines/rockphysics/minerals.js';
import { zoeppritzRpp, shuey, avoClass } from '@petrolord/engines/engines/rockphysics/avo.js';

// Pins the wedge-explorer panel math to the live NG7 Expert capstone
// answer key and to the teaching facts the DC19 lessons state.
const A = computeAdvanced();

describe('seismolord expert: wedge tuning', () => {
  it('reproduces the NG7 expert capstone answer key', () => {
    expect(A.f25.tuneMs).toBe(16);
    expect(A.f25.tuneAmp).toBeCloseTo(0.1155947595834732, 12);
    expect(A.f40.tuneMs).toBe(10);
    expect(A.f40.tuneAmp).toBeCloseTo(0.1155947595834732, 12);
    expect(A.f25.isoAmp).toBeCloseTo(0.07999999821186066, 12);
    expect(A.f25.theoryMs).toBeCloseTo(15.593936024673521, 12);
  });

  it('gives the two graded amplitudes as the SAME number, not merely close', () => {
    // 25 x 16 = 40 x 10 = 400 Hz ms, so both evaluate the Ricker at the
    // same argument and the arithmetic is identical.
    expect(A.f25.tuneAmp).toBe(A.f40.tuneAmp);
    expect(A.f25.productHzMs).toBe(400);
    expect(A.f40.productHzMs).toBe(400);
  });

  it('pins the panel geometry the lessons describe', () => {
    expect(A.f25.thicknessesMs).toHaveLength(31);
    expect(A.f25.traces).toHaveLength(31);
    expect(A.f25.traces[0]).toHaveLength(91);
    expect(A.f25.t0).toBe(30);
    expect(A.f25.t0 * WEDGE.dtMs).toBe(60);
    expect(A.f25.amplitudes[0]).toBe(0);
  });

  it('returns the top coefficient at the thick end, at either frequency', () => {
    expect(A.f25.isoAmp).toBe(Math.fround(WEDGE.rcTop));
    expect(A.f40.isoAmp).toBe(Math.fround(WEDGE.rcTop));
    // Against the float32 isolated level the brightening factor is
    // 1.4449345271; against the exact 0.08 it is 1.4449344948.
    expect(A.f25.tuneAmp / A.f25.isoAmp).toBeCloseTo(1.4449345270902185, 10);
    expect(A.f25.tuneAmp / WEDGE.rcTop).toBeCloseTo(1.444934494793415, 10);
  });

  it('is a function of frequency times thickness only', () => {
    // Equal products give equal amplitudes across different frequencies.
    const a25 = computeWedge(25); const a40 = computeWedge(40);
    expect(a25.amplitudes[16 / 2]).toBe(a40.amplitudes[10 / 2]);
    expect(a25.amplitudes[32 / 2]).toBe(a40.amplitudes[20 / 2]);
    expect(a25.amplitudes[48 / 2]).toBe(a40.amplitudes[30 / 2]);
    // 20 and 50 Hz land on 400 too and therefore share the same peak.
    for (const f of [20, 50]) {
      const m = computeWedge(f);
      expect(m.productHzMs).toBe(400);
      expect(m.tuneAmp).toBe(a25.tuneAmp);
    }
    // 15 Hz lands on 390, nearer the ideal, and peaks slightly HIGHER.
    const m15 = computeWedge(15);
    expect(m15.tuneMs).toBe(26);
    expect(m15.productHzMs).toBe(390);
    expect(m15.tuneAmp).toBeCloseTo(0.1157008037, 9);
    expect(m15.tuneAmp).toBeGreaterThan(a25.tuneAmp);
    expect(TUNING_PRODUCT_HZ_MS).toBeCloseTo(389.8484, 4);
  });

  it('closes the closed form: amp = rcTop * (1 - ricker(f T)) at the top interface', () => {
    const ricker = (f, T) => {
      const x = (Math.PI * f * (T / 1000)) ** 2;
      return (1 - 2 * x) * Math.exp(-x);
    };
    for (const [f, T] of [[25, 14], [25, 16], [25, 20], [25, 32], [40, 10], [40, 20]]) {
      const m = computeWedge(f);
      expect(m.amplitudes[T / 2]).toBeCloseTo(WEDGE.rcTop * (1 - ricker(f, T)), 7);
    }
    // The ideal peak has no frequency in it at all.
    expect(WEDGE.rcTop * (1 + 2 * Math.exp(-1.5))).toBeCloseTo(0.1157008256, 9);
  });

  it('overshoots theory by the same fraction at both capstone frequencies', () => {
    expect(A.f25.overshootMs).toBeCloseTo(0.406063975326479, 9);
    expect(A.f40.overshootMs).toBeCloseTo(0.253789984579049, 9);
    expect(16 / A.f25.theoryMs).toBeCloseTo(10 / A.f40.theoryMs, 12);
    expect(16 / A.f25.theoryMs).toBeCloseTo(1.026043, 5);
  });

  it('drifts the peak EARLY below tuning and holds it at the top above', () => {
    const at = (m, T) => m.rows[T / 2].peakOffsetMs;
    const m25 = computeWedge(25);
    expect(at(m25, 2)).toBe(-6);
    expect(at(m25, 4)).toBe(-4);
    expect(at(m25, 8)).toBe(-2);
    expect(at(m25, 16)).toBe(0);
    expect(at(m25, 40)).toBe(0);
    const m40 = computeWedge(40);
    expect(at(m40, 2)).toBe(-4);
    expect(at(m40, 8)).toBe(0);
  });

  it('floors the apparent thickness and matches it above tuning', () => {
    const m25 = computeWedge(25);
    const app = (T) => m25.rows[T / 2].apparentMs;
    expect(app(2)).toBe(14);
    expect(app(4)).toBe(12);
    expect(app(16)).toBe(16);
    for (const T of [26, 30, 40, 60]) expect(app(T)).toBe(T);
    const floor = Math.min(...m25.rows.slice(1).map((r) => r.apparentMs));
    expect(floor).toBe(12);
    expect(apparentFloorMs(25)).toBeCloseTo(13.360042020108319, 9);
    expect(apparentFloorMs(40)).toBeCloseTo(8.3500262625677, 9);
  });

  it('holds the tuning thickness while the RC pair scales the amplitude', () => {
    const run = (rt, rb) => {
      const { amplitudes } = tuningCurve(rt, rb, 25, WEDGE.dtMs, WEDGE.maxThicknessMs);
      const tm = tuningThicknessMs(amplitudes, WEDGE.dtMs);
      return { tm, amp: amplitudes[tm / WEDGE.dtMs] };
    };
    for (const [rt, rb] of [[0.08, -0.08], [0.08, -0.05], [0.08, -0.02], [0.05, -0.08]]) {
      expect(run(rt, rb).tm).toBe(16);
    }
    expect(run(0.05, -0.05).amp).toBeCloseTo(0.05 * 1.4449344, 8);
    // A SAME-signed pair has no tuning peak at all: the maximum is at zero
    // thickness and 16 ms is a notch.
    const same = tuningCurve(0.08, 0.08, 25, WEDGE.dtMs, WEDGE.maxThicknessMs);
    expect(tuningThicknessMs(same.amplitudes, WEDGE.dtMs)).toBe(0);
    expect(same.amplitudes[0]).toBeCloseTo(0.16, 6);
    const minIdx = same.amplitudes.reduce((b, v, i, a) => (v < a[b] ? i : b), 0);
    expect(minIdx * WEDGE.dtMs).toBe(16);
    expect(same.amplitudes[minIdx]).toBeCloseTo(0.04440523684024811, 9);
  });

  it('offers exactly the frequencies the lessons name', () => {
    expect(WEDGE_FREQS).toEqual([15, 20, 25, 40, 50]);
  });
});

describe('seismolord expert: the fluid chain into AVO', () => {
  const SHALE = { vp: 2500, vs: 1150, rho: 2350 };
  const SAND = { vp: 3000, vs: 1700, rho: 2200 };
  const PHI = 0.25;
  const imp = (r) => r.vp * r.rho;
  const rc = (a, b) => (imp(b) - imp(a)) / (imp(b) + imp(a));

  const br = brine(60, 25, 0.035);
  const gs = gas(60, 25, 0.6);
  const gasSand = substituteVels(SAND.vp, SAND.vs, SAND.rho, MINERALS.quartz.k, PHI,
    { k: br.k, rho: br.rho }, { k: gs.k, rho: gs.rho });

  it('reproduces the fluid properties the lesson quotes', () => {
    expect(br.rho).toBeCloseTo(1017.8249875, 6);
    expect(br.k).toBeCloseTo(2697811289.9395995, 4);
    expect(gs.rho).toBeCloseTo(172.66679461728904, 8);
    expect(gs.k).toBeCloseTo(55718652.90286663, 4);
  });

  it('softens vp, raises vs and drops the density on a gas substitution', () => {
    expect(gasSand.vp).toBeCloseTo(2542.0806987141495, 8);
    expect(gasSand.vs).toBeCloseTo(1788.0286926977965, 8);
    expect(gasSand.rho).toBeCloseTo(1988.7104517793223, 8);
    expect(gasSand.vs).toBeGreaterThan(SAND.vs);
    expect(gasSand.mu).toBeCloseTo(SAND.rho * SAND.vs * SAND.vs, 3);
    expect(gasSand.rho).toBeCloseTo(SAND.rho + PHI * (gs.rho - br.rho), 8);
  });

  it('flips the polarity of the top reflection', () => {
    expect(rc(SHALE, SAND)).toBeCloseTo(0.05811623246492986, 12);
    expect(rc(SHALE, gasSand)).toBeCloseTo(-0.07497738989450066, 12);
  });

  it('scales the tuning curve without moving the tuning thickness', () => {
    const run = (r) => {
      const { amplitudes } = tuningCurve(r, -r, 25, WEDGE.dtMs, WEDGE.maxThicknessMs);
      const tm = tuningThicknessMs(amplitudes, WEDGE.dtMs);
      return { tm, amp: amplitudes[tm / WEDGE.dtMs], iso: amplitudes[amplitudes.length - 1] };
    };
    const b = run(rc(SHALE, SAND));
    const g = run(rc(SHALE, gasSand));
    expect(b.tm).toBe(16);
    expect(g.tm).toBe(16);
    expect(b.amp).toBeCloseTo(0.08397415280342102, 9);
    expect(g.amp).toBeCloseTo(0.1083374172449112, 9);
    // The amplitude ratio IS the |RC| ratio, to float32.
    expect(g.amp / b.amp).toBeCloseTo(Math.abs(rc(SHALE, gasSand) / rc(SHALE, SAND)), 6);
    expect(g.amp / b.amp).toBeCloseTo(1.2901281361959467, 6);
  });

  it('separates the two sands across angle and classifies them', () => {
    const z = (s, th) => zoeppritzRpp(SHALE.vp, SHALE.vs, SHALE.rho, s.vp, s.vs, s.rho, th).re;
    expect(z(SAND, 0)).toBeCloseTo(0.05811623, 7);
    expect(z(SAND, 20)).toBeCloseTo(0.02762833, 7);
    expect(z(SAND, 40)).toBeCloseTo(-0.02413992, 7);
    expect(z(gasSand, 0)).toBeCloseTo(-0.07497739, 7);
    expect(z(gasSand, 40)).toBeCloseTo(-0.23967569, 7);
    const sb = shuey(SHALE.vp, SHALE.vs, SHALE.rho, SAND.vp, SAND.vs, SAND.rho, 0);
    const sg = shuey(SHALE.vp, SHALE.vs, SHALE.rho, gasSand.vp, gasSand.vs, gasSand.rho, 0);
    expect(sb.a).toBeCloseTo(0.057942057942057944, 12);
    expect(sb.b).toBeCloseTo(-0.2882281355008628, 12);
    expect(sg.a).toBeCloseTo(-0.07492528263920104, 12);
    expect(sg.b).toBeCloseTo(-0.46844215020775365, 12);
    expect(avoClass(sb.a, sb.b)).toBe('I');
    expect(avoClass(sg.a, sg.b)).toBe('III');
  });

  it('breaks the opposite-pair assumption away from normal incidence', () => {
    const top = zoeppritzRpp(SHALE.vp, SHALE.vs, SHALE.rho, SAND.vp, SAND.vs, SAND.rho, 30).re;
    const base = zoeppritzRpp(SAND.vp, SAND.vs, SAND.rho, SHALE.vp, SHALE.vs, SHALE.rho, 30).re;
    const top0 = zoeppritzRpp(SHALE.vp, SHALE.vs, SHALE.rho, SAND.vp, SAND.vs, SAND.rho, 0).re;
    const base0 = zoeppritzRpp(SAND.vp, SAND.vs, SAND.rho, SHALE.vp, SHALE.vs, SHALE.rho, 0).re;
    expect(top0 + base0).toBeCloseTo(0, 12);
    expect(Math.abs(top + base)).toBeGreaterThan(0.007);
  });
});
