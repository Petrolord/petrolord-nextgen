import { describe, it, expect } from 'vitest';
import {
  CAPSTONE_OWC_M, PROPS, WELL_PHI, computePropertyModel,
} from '@/lib/reservoircalcTeaching';

// Pins the property-explorer panel math to the live NG7 Expert capstone
// oracle (reservoircalc/ekene-property-model) and to the teaching facts the
// DC23 lessons state as engine truth.

describe('reservoircalc property explorer: engine math', () => {
  const t = computePropertyModel('trend', CAPSTONE_OWC_M);

  it('reproduces the NG7 capstone answer key', () => {
    expect(t.phiAtP1).toBeCloseTo(0.20714187889686578, 12);
    expect(t.means.nodeMeanOverOil).toBeCloseTo(0.20936760570720417, 12);
    expect(t.model.poreMm3).toBeCloseTo(3.7558468705687864, 9);
    expect(t.model.hcpvMm3).toBeCloseTo(2.4413004882563025, 9);
    expect(t.model.stoiipMmstb).toBeCloseTo(12.79607650919541, 9);
    expect(t.deltaMmstb).toBeCloseTo(0.656868401698647, 9);
  });

  it('fits a plane that honours no well exactly', () => {
    // v = a + b x + c y, least squares, so the residuals sum to zero and
    // every well is missed by something.
    expect(t.plane.a).toBeCloseTo(0.24107144716926077, 12);
    expect(t.plane.b).toBeCloseTo(-0.00002043684820796242, 15);
    expect(t.plane.c).toBeCloseTo(-7.691319622844493e-7, 15);
    const resid = t.residuals.map((r) => r.modelled - r.measured);
    expect(resid.reduce((s, r) => s + r, 0)).toBeCloseTo(0, 12);
    const worst = t.residuals.find((r) => r.name === 'Ekene-3');
    expect(worst.modelled - worst.measured).toBeCloseTo(-0.019309143835140874, 12);
    expect(Math.max(...resid.map(Math.abs))).toBeCloseTo(0.019309143835140874, 12);
    // Porosity increases westward: the x gradient dominates the y gradient.
    expect(Math.abs(t.plane.b / t.plane.c)).toBeGreaterThan(20);
  });

  it('offers three different means, and books the volume weighted one', () => {
    expect(t.means.arithmeticWells).toBeCloseTo(0.20666666666666667, 12);
    expect(t.means.nodeMeanOverOil).toBeCloseTo(0.20936760570720417, 12);
    expect(t.means.volumeWeighted).toBeCloseTo(0.21082226429530276, 12);
    // The volume weighted mean is pore over net, and the hand route
    // sum(t.phi)/sum(t) agrees with it.
    expect(t.means.volumeWeighted).toBeCloseTo(t.means.byHand, 15);
    expect(t.means.arithmeticWells).toBeLessThan(t.means.nodeMeanOverOil);
    expect(t.means.nodeMeanOverOil).toBeLessThan(t.means.volumeWeighted);
  });

  it('changes the barrels without touching the geometry', () => {
    expect(t.model.cells).toBe(169);
    expect(t.model.grvMm3).toBe(t.constant.grvMm3);
    expect(t.model.netMm3).toBe(t.constant.netMm3);
    expect(t.model.poreMm3).not.toBe(t.constant.poreMm3);
    // The whole uplift is the effective porosity ratio.
    expect(t.ratio).toBeCloseTo(1.0541113057690301, 12);
    expect(t.means.volumeWeighted / PROPS.phi).toBeCloseTo(t.ratio, 7);
  });

  it('splits the uplift into a better constant and genuine spatial variation', () => {
    expect(t.atWellMean.stoiipMmstb).toBeCloseTo(12.543847985822008, 9);
    expect(t.fromBetterConstant).toBeCloseTo(0.404639878325245, 9);
    expect(t.fromSpatialVariation).toBeCloseTo(0.252228523373402, 9);
    expect(t.fromBetterConstant + t.fromSpatialVariation).toBeCloseTo(t.deltaMmstb, 12);
    // Most of the headline number is not spatial at all.
    expect(t.fromBetterConstant).toBeGreaterThan(t.fromSpatialVariation);
  });

  it('has a positive uplift because porosity correlates with column', () => {
    expect(t.corrPhiColumn).toBeCloseTo(0.46242377439477966, 12);
    expect(t.meanColumn).toBeCloseTo(13.176944168361686, 9);
    expect(t.deltaMmstb).toBeGreaterThan(0);
  });

  it('contrasts a plane with a method that honours the data', () => {
    const k = computePropertyModel('krige', CAPSTONE_OWC_M);
    const exact = k.residuals.filter((r) => Math.abs(r.modelled - r.measured) < 1e-12);
    expect(exact.map((r) => r.name).sort())
      .toEqual(['Ekene-1', 'Ekene-3', 'Ekene-4', 'Ekene-5', 'Ekene-6']);
    // Ekene-2 sits off a node row, so the sample there is bilinear. On a
    // plane that costs nothing; on a kriged grid it does.
    const kE2 = k.residuals.find((r) => r.name === 'Ekene-2');
    expect(kE2.modelled).toBeCloseTo(0.1911773281785734, 12);
    const tE2 = t.residuals.find((r) => r.name === 'Ekene-2');
    expect(tE2.modelled).toBeCloseTo(0.19522587935511634, 12);
    expect(k.model.stoiipMmstb).toBeCloseTo(13.337664775041226, 9);
    expect(k.phiAtP1).toBeCloseTo(0.22091998455326706, 12);
  });

  it('falls back to the arithmetic well mean for the constant method', () => {
    const c = computePropertyModel('constant', CAPSTONE_OWC_M);
    expect(c.grid[0]).toBeCloseTo(0.20666666666666667, 12);
    expect(Object.values(WELL_PHI).reduce((s, v) => s + v, 0) / 6)
      .toBeCloseTo(0.20666666666666667, 12);
    // populate returns a Float64Array; the constant route inside the
    // volumetric chain fills a Float32Array. The SAME porosity therefore
    // books two answers 2.05e-7 MMstb apart, which is worth knowing about
    // and worth ignoring.
    expect(c.model.stoiipMmstb).toBeCloseTo(12.543848190828738, 9);
    expect(t.atWellMean.stoiipMmstb).toBeCloseTo(12.543847985822008, 9);
    expect(c.model.stoiipMmstb - t.atWellMean.stoiipMmstb)
      .toBeCloseTo(2.0500672981427215e-7, 15);
  });

  it('carries a float32 constant, which the Associate booking can be read for', () => {
    // The chain stores its constants in Float32Arrays, so the porosity in
    // the Associate booking is float32(0.20) = 0.20000000298023224. Net
    // volume times the exact 0.2 misses the engine pore volume by 5.3e-8;
    // times the float32 value it lands to 8e-15.
    const net = t.constant.netMm3;
    expect(net * 0.2).toBeCloseTo(3.5630457562185178, 12);
    expect(net * Math.fround(0.2)).toBeCloseTo(t.constant.poreMm3, 12);
    expect(Math.abs(net * 0.2 - t.constant.poreMm3)).toBeGreaterThan(5e-8);
  });
});
