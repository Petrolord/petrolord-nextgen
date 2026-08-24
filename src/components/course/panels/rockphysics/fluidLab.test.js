import { describe, it, expect } from 'vitest';
import {
  CAPSTONE_SW, FRAME, MINERALS, computeFluids,
} from '@/lib/rockphysicsTeaching';

// Pins the fluid-explorer panel math to the live NG8 Beginner capstone oracle.
const GPA = 1e9;
const MPA = 1e6;

describe('rockphysics fluid explorer: engine math', () => {
  const r = computeFluids(CAPSTONE_SW);

  it('reproduces the NG8 beginner capstone answer key at Sw 0.8', () => {
    expect(r.brine.rho).toBeCloseTo(1017.8249875, 6);
    expect(r.brine.k / GPA).toBeCloseTo(2.6978112899395996, 9);
    expect(r.gas.k / MPA).toBeCloseTo(55.71865290286663, 9);
    expect(r.oil.rho).toBeCloseTo(777.0630099023522, 6);
    expect(r.frame.k / GPA).toBeCloseTo(30.87940062475596, 9);
    expect(r.mixed.k / MPA).toBeCloseTo(257.3340919366766, 9);
  });

  it('mixes the frame between its Voigt and Reuss bounds', () => {
    const voigt = (p) => FRAME.reduce((a, f) => a + f.frac * MINERALS[f.name][p], 0);
    const reuss = (p) => 1 / FRAME.reduce((a, f) => a + f.frac / MINERALS[f.name][p], 0);
    for (const p of ['k', 'mu']) {
      expect(r.frame[p]).toBeGreaterThan(reuss(p));
      expect(r.frame[p]).toBeLessThan(voigt(p));
      expect(r.frame[p]).toBeCloseTo((voigt(p) + reuss(p)) / 2, 3);
    }
    // The shear bounds are far apart, so VRH mu is a much weaker claim
    // than VRH K. This is the module 3 honesty lesson.
    expect(voigt('k') / reuss('k')).toBeCloseTo(1.067669, 5);
    expect(voigt('mu') / reuss('mu')).toBeCloseTo(1.981765, 5);
  });

  it('mixes frame and fluid density linearly', () => {
    expect(r.frame.rho).toBe(0.7 * MINERALS.quartz.rho + 0.3 * MINERALS.clay.rho);
    expect(r.frame.rho).toBe(2629);
    expect(r.mixed.rho).toBeCloseTo(
      CAPSTONE_SW * r.brine.rho + (1 - CAPSTONE_SW) * r.gas.rho, 9,
    );
    expect(r.mixed.rho).toBeCloseTo(848.7933489234579, 6);
  });

  it('mixes the fluid modulus harmonically, so the gas dominates', () => {
    const cBrine = CAPSTONE_SW / r.brine.k;
    const cGas = (1 - CAPSTONE_SW) / r.gas.k;
    expect(1 / (cBrine + cGas)).toBeCloseTo(r.mixed.k, 3);
    // 20 percent gas carries 92.4 percent of the compliance.
    expect((cGas / (cBrine + cGas)) * 100).toBeCloseTo(92.4, 1);
    // The mix sits far nearer the soft phase than any average would put it.
    expect(r.mixed.k).toBeLessThan((r.brine.k + r.gas.k) / 2);
    expect(r.brine.k / r.gas.k).toBeCloseTo(48.42, 2);
  });

  it('loses a third of the fluid modulus to one percent of gas', () => {
    const wet = computeFluids(1).mixed;
    const almostWet = computeFluids(0.99).mixed;
    expect(wet.k / MPA).toBeCloseTo(2697.8113, 3);
    expect(almostWet.k / MPA).toBeCloseTo(1830.0363, 3);
    expect(almostWet.k / wet.k).toBeLessThan(0.7);
    // ...while the density barely moves over the same step.
    expect(almostWet.rho / wet.rho).toBeGreaterThan(0.99);
  });

  it('returns the dry gas end member at Sw 0', () => {
    const dry = computeFluids(0);
    expect(dry.mixed.k).toBeCloseTo(dry.gas.k, 6);
    expect(dry.mixed.rho).toBeCloseTo(dry.gas.rho, 6);
  });
});
