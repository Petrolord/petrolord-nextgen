import { describe, it, expect } from 'vitest';
import {
  TW, WATER_LEG, ZONES,
  porosityCurves, vshLinearCurve, swCurve, zoneMean,
  fitPickett, isoSwSegment, bookSandA, waterLegMeanSw,
  rwArps, spK, rweFromSsp,
} from './typewellLab';

// Pins the panel math to the live capstone oracles (NG6 intermediate and
// NG7 advanced migrations). If any of these drift, the teaching panels
// would let a learner produce numbers the grader rejects.

describe('petrophysics teaching panels: engine math', () => {
  const givens = { rhoMa: TW.rho_ma, rhoFl: TW.rho_fl, dtMa: TW.dt_ma, dtFl: TW.dt_fl };

  it('porosity lab reproduces the NG6 zone means at the given constants', () => {
    const { phiW, phiNdArr } = porosityCurves(givens);
    expect(zoneMean(phiNdArr, ZONES.SAND_A)).toBeCloseTo(0.17615030026601647, 10);
    expect(zoneMean(phiW, ZONES.SAND_A)).toBeCloseTo(0.2069057569286416, 10);
  });

  it('pickett explorer fit over the water leg recovers m 2.000 and aRw 0.0500 from 6 points', () => {
    const { phiNdArr } = porosityCurves(givens);
    const fit = fitPickett(phiNdArr, WATER_LEG[0], WATER_LEG[1]);
    expect(fit.nPoints).toBe(6);
    expect(fit.m).toBeCloseTo(2.0, 6);
    expect(fit.aRw).toBeCloseTo(0.05, 6);
  });

  it('W1: the Professional capstone grades the Pickett fit over 2072 to 2078 m, and the panel prints it inside tol', () => {
    const { phiNdArr } = porosityCurves(givens);
    const fit = fitPickett(phiNdArr, 2072, 2078);
    expect(fit.nPoints).toBe(12);
    expect(fit.aRw).toBeCloseTo(0.6886854786769905, 10);
    expect(fit.m).toBeCloseTo(0.8784525453945112, 10);
    // the Tile prints aRw to 4 dp (tol 0.002) and m to 4 dp (tol 0.0002)
    expect(Math.abs(Number(fit.aRw.toFixed(4)) - fit.aRw)).toBeLessThanOrEqual(0.002);
    expect(Math.abs(Number(fit.m.toFixed(4)) - fit.m)).toBeLessThanOrEqual(0.0002);
    // the course prints NTG 0.878 (18.0/20.5) and a shaly-sand 0.8769; neither may pass for m
    for (const v of [0.878, 18 / 20.5, 0.8769]) expect(Math.abs(v - fit.m)).toBeGreaterThan(0.0002);
    // the given water-leg answers no longer pass
    expect(Math.abs(0.05 - fit.aRw)).toBeGreaterThan(0.002);
    expect(Math.abs(2 - fit.m)).toBeGreaterThan(0.0002);
  });

  it('shaly-sand lab reproduces the NG6 Simandoux and Indonesia SAND_A means', () => {
    const { phiNdArr } = porosityCurves(givens);
    const vsh = vshLinearCurve(TW.gr_clean, TW.gr_clay);
    const base = { phi: phiNdArr, vsh, rw: TW.rw, rsh: TW.rsh, a: TW.a, m: TW.m, n: TW.n };
    expect(zoneMean(swCurve({ method: 'simandoux', ...base }), ZONES.SAND_A))
      .toBeCloseTo(0.43350268917150697, 10);
    expect(zoneMean(swCurve({ method: 'indonesia', ...base }), ZONES.SAND_A))
      .toBeCloseTo(0.4280109754526606, 10);
  });

  it('rw triangulator reproduces the NG7 oracle end to end', () => {
    const arps = rwArps(0.114, 75, 180);
    expect(arps).toBeCloseTo(0.049910478128179045, 12);
    expect(spK(180)).toBeCloseTo(84.94, 10);
    expect(rweFromSsp(-93, 0.62, 180)).toBeCloseTo(0.049831180824251246, 12);
    expect(waterLegMeanSw(arps)).toBeCloseTo(0.9991043802143901, 10);
    const corrected = bookSandA(arps);
    expect(corrected.net_m).toBeCloseTo(18, 10);
    expect(corrected.sw_avg).toBeCloseTo(0.3609390898147585, 10);
    expect(bookSandA(0.114).net_m).toBeCloseTo(16.5, 10);
  });

  it('iso-Sw segment matches the engine line in (phi, rt) orientation', () => {
    const pts = isoSwSegment(1, { aRw: TW.rw, m: TW.m, n: TW.n }, 0.05, 0.4);
    expect(pts).toHaveLength(2);
    expect(pts[0].phi).toBeCloseTo(0.05, 12);
    expect(pts[0].rt).toBeCloseTo(20, 10);
    expect(pts[1].phi).toBeCloseTo(0.4, 12);
    expect(pts[1].rt).toBeCloseTo(0.3125, 10);
  });
});
