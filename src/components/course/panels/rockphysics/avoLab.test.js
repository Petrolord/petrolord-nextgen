import { describe, it, expect } from 'vitest';
import {
  SHALE, SAND_IN_SITU, WEDGE, ROMAN_CLASS, computeAvoScreen, computeAvoDetail,
} from '@/lib/rockphysicsTeaching';

// Pins the AVO-explorer panel math to the live NG7 Expert capstone oracle
// (rockphysics/ekene shale-over-sand + wedge) and to the DC25 teaching facts.

describe('rockphysics AVO explorer: engine math', () => {
  const a = computeAvoScreen(25);
  const d = computeAvoDetail(25, 0.02);

  it('reproduces the NG7 capstone answer key, all seven fields', () => {
    expect(a.brineShuey.a).toBeCloseTo(0.03434399848203321, 12);
    expect(a.brineShuey.b).toBeCloseTo(-0.16766246414664518, 12);
    expect(a.gasShuey.a).toBeCloseTo(-0.06282494068620303, 12);
    expect(a.gasShuey.b).toBeCloseTo(-0.2565633444602355, 12);
    expect(ROMAN_CLASS[a.gasClass]).toBe(3);
    expect(a.zoep30.re).toBeCloseTo(-0.12239091302671612, 12);
    expect(a.tuning.tuningMs).toBe(16);
  });

  it('flips the class when the fluid is substituted', () => {
    expect(a.brineClass).toBe('I');
    expect(a.gasClass).toBe('III');
    expect(d.brine.klassNum).toBe(1);
    expect(d.gas.klassNum).toBe(3);
  });

  it('calls the class from a threshold that is a convention, not physics', () => {
    // The brine intercept is only 1.72x the default 0.02 band.
    expect(a.brineShuey.a / 0.02).toBeCloseTo(1.7171999241016604, 9);
    expect(computeAvoDetail(25, 0.01).brine.klass).toBe('I');
    expect(computeAvoDetail(25, 0.04).brine.klass).toBe('II');
    expect(computeAvoDetail(25, 0.05).brine.klass).toBe('II');
    // the gas case is class III at every threshold tried
    for (const t of [0.01, 0.02, 0.04, 0.05]) {
      expect(computeAvoDetail(25, t).gas.klass).toBe('III');
    }
  });

  it('changes the polarity of the brine reflection near 29 degrees', () => {
    expect(d.brine.crossingDeg).toBe(30);
    const at29 = d.brine.curve.find((p) => p.theta === 29);
    const at30 = d.brine.curve.find((p) => p.theta === 30);
    expect(at29.shuey).toBeGreaterThan(0);
    expect(at30.shuey).toBeLessThan(0);
    // the exact solution crosses about half a degree later than Shuey does
    expect(at30.exact).toBeLessThan(0);
    expect(at30.exact).toBeGreaterThan(at30.shuey);
  });

  it('builds its gradient mostly out of the shear contrast', () => {
    const t = d.gradientTerms;
    expect(t.vpTerm).toBeCloseTo(0.028802610843132695, 12);
    expect(t.rhoTerm).toBeCloseTo(0.12395208861462988, 12);
    expect(t.vsTerm).toBeCloseTo(-0.4093180439179981, 12);
    expect(t.vpTerm + t.rhoTerm + t.vsTerm).toBeCloseTo(a.gasShuey.b, 12);
    // the density term pushes the gradient UP, against the intuition
    expect(t.rhoTerm).toBeGreaterThan(0);
    expect(Math.abs(t.vsTerm)).toBeGreaterThan(Math.abs(t.rhoTerm) + Math.abs(t.vpTerm));
  });

  it('misses the exact solution by more than the capstone tolerance', () => {
    expect(d.gas.shuey30).toBeCloseTo(-0.12456555923100084, 12);
    expect(d.gas.zoep30).toBeCloseTo(-0.12239091302671612, 12);
    const gap = Math.abs(d.gas.shuey30 - d.gas.zoep30);
    expect(gap).toBeCloseTo(0.0021746462042847164, 12);
    expect(gap).toBeGreaterThan(2 * 0.001);
  });

  it('agrees with the exact solution at normal incidence and drifts with angle', () => {
    const p0 = d.gas.curve.find((p) => p.theta === 0);
    expect(p0.shuey).toBeCloseTo(a.gasShuey.a, 12);
    expect(Math.abs(p0.err)).toBeLessThan(0.0002);
    const p40 = d.gas.curve.find((p) => p.theta === 40);
    expect(p40.shuey).toBeCloseTo(-0.1604517011187572, 9);
    expect(p40.exact).toBeCloseTo(-0.16020585411368574, 9);
    expect(Math.abs(p40.err)).toBeCloseTo(0.0002458470050714645, 12);
  });

  it('approximates the brine case far worse than the gas case', () => {
    // The class I response carries nearly three times the curvature term, so
    // Shuey drifts from the exact solution much faster on it.
    expect(d.brine.c).toBeCloseTo(0.07689718997139491, 12);
    expect(d.gas.c).toBeCloseTo(0.028802610843132695, 12);
    expect(d.brine.maxErr).toBeCloseTo(0.005972095765271403, 12);
    expect(d.gas.maxErr).toBeCloseTo(0.0021919285920672105, 12);
    expect(d.brine.maxErr).toBeGreaterThan(2 * d.gas.maxErr);
    const b40 = d.brine.curve.find((p) => p.theta === 40);
    expect(b40.shuey).toBeCloseTo(-0.012559756059599872, 9);
    expect(b40.exact).toBeCloseTo(-0.006587660294328469, 9);
    // Shuey says the brine reflection is twice as negative as it really is
    expect(b40.shuey / b40.exact).toBeGreaterThan(1.9);
  });

  it('tunes where the wavelet says, not where the reflection strength does', () => {
    expect(d.tuning.tuningMs).toBe(16);
    expect(d.tuning.theoryMs).toBeCloseTo(15.593936024673521, 9);
    expect(d.tuning.peak).toBeCloseTo(0.1444934457540512, 9);
    expect(d.tuning.isolated).toBeCloseTo(Math.fround(WEDGE.rcTop), 9);
    const at40 = computeAvoDetail(40, 0.02).tuning;
    expect(at40.tuningMs).toBe(10);
    expect(at40.peak).toBeCloseTo(d.tuning.peak, 9);
    const at15 = computeAvoDetail(15, 0.02).tuning;
    expect(at15.tuningMs).toBe(26);
    expect(at15.peak).toBeGreaterThan(d.tuning.peak);
  });

  it('flips the intercept on density, not on velocity', () => {
    expect(d.brine.lower.vp).toBe(SAND_IN_SITU.vp);
    expect(d.gas.lower.vp).toBeCloseTo(2905.6972280296195, 6);
    expect(SHALE.vp).toBe(2743);
    // The gas sand is STILL faster than the shale, by 162.70 m/s, so the
    // velocity contrast stays positive across the interface.
    expect(d.gas.lower.vp).toBeGreaterThan(SHALE.vp);
    expect(d.gas.lower.vp - SHALE.vp).toBeCloseTo(162.69722802961946, 6);
    // The intercept goes negative anyway, because the density contrast
    // reverses and outweighs it.
    const vpm = 0.5 * (SHALE.vp + d.gas.lower.vp);
    const rhom = 0.5 * (SHALE.rho + d.gas.lower.rho);
    const vpPart = 0.5 * ((d.gas.lower.vp - SHALE.vp) / vpm);
    const rhoPart = 0.5 * ((d.gas.lower.rho - SHALE.rho) / rhom);
    expect(vpPart).toBeGreaterThan(0);
    expect(rhoPart).toBeLessThan(0);
    expect(Math.abs(rhoPart)).toBeGreaterThan(2 * vpPart);
    expect(vpPart + rhoPart).toBeCloseTo(d.gas.a, 12);
    // under brine both contrasts are positive and the intercept is positive
    expect(SAND_IN_SITU.rho).toBeGreaterThan(SHALE.rho - 250);
    expect(d.brine.a).toBeGreaterThan(0);
  });
});
