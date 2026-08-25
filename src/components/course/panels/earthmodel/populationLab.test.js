import { describe, it, expect } from 'vitest';
import { computePopulation, KRIGE_PARAMS } from '@/lib/earthmodelTeaching';

// Pins the DC29 Expert panel math to the LIVE advanced capstone answer key
// and to the tier's sharpest engine-verified teaching facts.

describe('population explorer math (DC29)', () => {
  const base = computePopulation();

  it('reproduces the six graded capstone values', () => {
    expect(base.census['1']).toBe(174);
    expect(base.probes.trendProbe).toBeCloseTo(0.3075, 9);
    expect(base.probes.krigeProbe).toBeCloseTo(0.2914277719922997, 12);
    expect(base.probes.krigeAtW1).toBeCloseTo(0.315, 12);
    expect(base.phiBlock0).toBeCloseTo(0.28631191845445614, 14);
    expect(base.volsA['1'].bulk_m3).toBeCloseTo(13998749.999999998, 3);
  });

  it('the census is hand-countable and closes: 9x12 + 11x6 = 174, 326 + 174 = 500', () => {
    expect(base.census['0']).toBe(326);
    expect(base.census['0'] + base.census['1']).toBe(500);
    // rows 0..8 hold 12 block-1 nodes each, rows 9..19 hold 6
    const rowCount = (r) => base.labels.slice(r * 25, r * 25 + 25).filter((v) => v === 1).length;
    expect(rowCount(0)).toBe(12);
    expect(rowCount(8)).toBe(12);
    expect(rowCount(9)).toBe(6);
    expect(rowCount(19)).toBe(6);
  });

  it('W2 crosses the fault: wellhead in block 1, control point in block 0', () => {
    expect(base.byBlock[1].map((p) => p.well)).toEqual(['W1']);
    expect(base.byBlock[0].map((p) => p.well)).toEqual(['W2', 'W3', 'W4']);
    expect(base.phiBlock1).toBeCloseTo(0.315, 12);
    const w2cp = base.byBlock[0].find((p) => p.well === 'W2');
    expect(w2cp.x).toBeCloseTo(1610.8719179395334, 9);
  });

  it('two different means live in one engine', () => {
    expect(base.arithmeticMean).toBeCloseTo(0.2905162808206047, 14);
    expect(base.weightedConstant).toBeCloseTo(0.2903935560727246, 14);
    expect(base.probes.far).toBeCloseTo(base.arithmeticMean, 14);
    expect(base.probes.far).not.toBeCloseTo(base.weightedConstant, 6);
  });

  it('the nugget never moves the value AT a well, only how fast the map jumps off it', () => {
    for (const nugget of [0, 0.001, 0.002]) {
      expect(computePopulation('krige', nugget).probes.krigeAtW1).toBeCloseTo(0.315, 12);
    }
    expect(computePopulation('krige', 0.002).probes.krigeProbe)
      .toBeCloseTo(0.29060333792448684, 12);
  });

  it('beyond the spherical range, kriging IS the mean: range 300 at the probe', () => {
    const r300 = computePopulation('krige', KRIGE_PARAMS.nugget, 300);
    expect(r300.probes.krigeProbe).toBeCloseTo(0.2905162808206047, 14);
    const r1800 = computePopulation('krige', KRIGE_PARAMS.nugget, 1800);
    expect(r1800.probes.krigeProbe).toBeCloseTo(0.2924708301904079, 12);
  });

  it('the trend fit is exact on this fixture: a plane through the data', () => {
    expect(base.trend.a).toBeCloseTo(0.38, 9);
    expect(base.trend.b).toBeCloseTo(-4.0e-5, 12);
    expect(base.trend.c).toBeCloseTo(-1.0e-5, 12);
    // hand-reachable graded value: 0.38 - 0.00004 x 1250 - 0.00001 x 2250
    expect(0.38 - 0.00004 * 1250 - 0.00001 * 2250).toBeCloseTo(0.3075, 12);
    // and it has no floor: negative porosity at x 9000, y 2500
    expect(base.trend.at(9000, 2500)).toBeLessThan(0);
  });

  it('the fallback ladder is recorded, never silent', () => {
    const t = computePopulation('trend');
    const b1 = t.provenance.find((p) => p.block === 1);
    expect(b1.methodUsed).toBe('constant');
    expect(b1.fellBack).toBe(true);
    const k = base.provenance.find((p) => p.block === 1);
    expect(k.methodUsed).toBe('krige');
    expect(k.fellBack).toBe(false);
  });

  it('the profile row shows the fault jump and block 1 flat at 0.315', () => {
    expect(base.profileY).toBe(2200);
    expect(base.profile[11].block).toBe(1);
    expect(base.profile[12].block).toBe(0);
    expect(base.profile[11].phi).toBeCloseTo(0.315, 12);
    expect(base.profile[12].phi - base.profile[11].phi).toBeCloseTo(-0.023016035393453593, 12);
    const t = computePopulation('constant');
    expect(t.profile[12].phi - t.profile[11].phi).toBeCloseTo(-0.028688081545543864, 12);
  });

  it('per-block volumes close exactly in bulk and in cells', () => {
    const v = base.volsA;
    expect(v['0'].bulk_m3 + v['1'].bulk_m3 - v.total.bulk_m3).toBe(0);
    expect(v['0'].cells + v['1'].cells).toBe(v.total.cells);
    expect(v.total.bulk_m3).toBe(45000000);
    expect(v['0'].bulk_m3).toBe(31001250);
  });

  it('the hand chain per block: net, pore and HCPV from the block constants', () => {
    expect(13998749.999999998 * 0.798).toBeCloseTo(11171002.5, 6);
    expect(13998749.999999998 * 0.798 * 0.315).toBeCloseTo(3518865.7875, 4);
    expect(13998749.999999998 * 0.798 * 0.315 * (1 - 0.252)).toBeCloseTo(2632111.60905, 4);
  });
});
