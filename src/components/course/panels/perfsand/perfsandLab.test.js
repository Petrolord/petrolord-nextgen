import { describe, it, expect } from 'vitest';
import {
  IN, UM, THOU, PSI, FT_PER_M, GOLDEN, PARAMS, CURVES, STATIONS,
  KT_PHASING_TABLE, KT_PHASINGS_DEG, KT_RPD_RANGE, KT_HD_MAX, UNDERBALANCE_BANDS,
  SAUCIER_RANGE, FINES_CUTOFF_M, CAVITY_GEOMETRIES,
  GUN_CATALOG, GRAVEL_CATALOG, SCREEN_GAUGE_THOU,
  karakasTariq, productivityRatio, underbalanceAdvice, sieveStats, saucierGravel,
  screenSelection, sandControlAdvisor, sandingOnset,
  publishedGun, PUBLISHED_KEYS, skinOf, prOf, publishedSkin, publishedPr,
  catalogRow, catalogSweep, zeroCrossing, outOfRange, phasingSweep, sensitivity,
  reSweep, ptsOf, PUBLISHED_SIEVE, publishedStats, RUNG_SANDS, rungTable,
  saucierSweep, gaugeTable, packFor, cdpFor, stepIndependence, weakenedCurves,
  boostSweep, boostAtZeroMargin, oracleCheck,
  CAPSTONE, capstoneSkin, capstonePr, capstoneStats, capstonePack, capstoneCdp,
  capstoneValues,
} from './perfsandLab.js';

const near = (a, b, tol) => expect(Math.abs(a - b)).toBeLessThanOrEqual(tol);

describe('the fixtures', () => {
  it('carries two published guns, nine catalog guns and a nine point sieve', () => {
    expect(PUBLISHED_KEYS).toEqual(['through-tubing-2-1-8', 'hsd-4-5-8']);
    expect(GUN_CATALOG).toHaveLength(9);
    expect(GRAVEL_CATALOG).toHaveLength(7);
    expect(SCREEN_GAUGE_THOU).toEqual([6, 8, 10, 12, 16, 20, 25]);
    expect(PUBLISHED_SIEVE).toHaveLength(9);
    expect(KT_PHASINGS_DEG).toEqual([0, 45, 60, 90, 120, 180]);
    expect(CAVITY_GEOMETRIES).toEqual(['perf-tunnel', 'openhole']);
    near(PARAMS.rwM, 4.25 * IN, 1e-12);
    near(FINES_CUTOFF_M, 44 * UM, 1e-15);
    expect(SAUCIER_RANGE).toEqual([5, 6]);
  });

  it('agrees with the published oracle everywhere it can be checked', () => {
    const o = oracleCheck();
    expect(o.checked).toBe(122);
    // the golden rounds every value to nine decimal places, so the floor on
    // the agreement is that rounding and not the arithmetic
    expect(o.worstRel).toBeLessThan(1e-5);
  });
});

describe('Karakas-Tariq skin', () => {
  it('reproduces both published guns component by component', () => {
    for (const g of GOLDEN.guns) {
      const s = skinOf(g.inputs);
      for (const k of ['sH', 'sV', 'sWb', 'sCz', 'total', 'rwPrimeM', 'hM', 'hD', 'rpD', 'a', 'b', 'rwD']) {
        near(s[k], g.expected.skin[k], Math.max(1e-9, Math.abs(g.expected.skin[k]) * 1e-8));
      }
      near(prOf(s.total).ratio, g.expected.pr.ratio, 1e-8);
    }
  });

  it('takes the effective wellbore radius as a quarter of the tunnel at zero phasing', () => {
    const i = publishedGun('through-tubing-2-1-8');
    expect(i.phasingDeg).toBe(0);
    near(publishedSkin('through-tubing-2-1-8').rwPrimeM, i.lpM / 4, 1e-15);
    // and as alpha times (rw + lp) at every other angle
    for (const deg of KT_PHASINGS_DEG.filter((d) => d !== 0)) {
      const s = skinOf(i, { phasingDeg: deg });
      near(s.rwPrimeM, KT_PHASING_TABLE[deg].alpha * (PARAMS.rwM + i.lpM), 1e-15);
    }
  });

  it('makes the perf spacing the reciprocal of the shot density and nothing else', () => {
    for (const spf of [2, 4, 6, 8, 12, 20]) {
      const s = skinOf(publishedGun('hsd-4-5-8'), { spfPerM: spf * FT_PER_M });
      near(s.hM, 1 / (spf * FT_PER_M), 1e-15);
      near(s.hM, 0.3048 / spf, 1e-12);
    }
  });

  it('zeroes the crushed zone when the crushed permeability equals the rock', () => {
    const i = publishedGun('hsd-4-5-8');
    expect(skinOf(i, { kOverKc: 1 }).sCz).toBe(0);
    expect(skinOf(i, { rcM: null, kOverKc: null }).sCz).toBe(0);
    // and grows linearly in (k/kc - 1)
    const a = skinOf(i, { kOverKc: 3 }).sCz;
    const b = skinOf(i, { kOverKc: 5 }).sCz;
    near(b / a, (5 - 1) / (3 - 1), 1e-12);
  });

  it('refuses the inputs that describe nothing', () => {
    const i = publishedGun('hsd-4-5-8');
    expect(() => skinOf(i, { lpM: 0 })).toThrow(/length/);
    expect(() => skinOf(i, { rpM: -1 })).toThrow(/radius/);
    expect(() => skinOf(i, { spfPerM: 0 })).toThrow(/density/);
    expect(() => skinOf(i, { rwM: 0 })).toThrow(/Wellbore/);
    expect(() => skinOf(i, { khOverKv: 0 })).toThrow(/kH\/kV/);
    expect(() => skinOf(i, { phasingDeg: 30 })).toThrow(/18247/);
    expect(() => skinOf(i, { rcM: i.rpM / 2 })).toThrow(/Crushed/);
    expect(() => skinOf(i, { kOverKc: 0.5 })).toThrow(/k\/kc/);
  });
});

describe('the gun catalog at one rock', () => {
  const rows = catalogSweep();

  it('ranks by gun size, from a damaging through-tubing gun to a stimulating big-hole one', () => {
    expect(rows).toHaveLength(9);
    for (let i = 1; i < rows.length; i += 1) {
      expect(rows[i].odIn).toBeGreaterThan(rows[i - 1].odIn);
      expect(rows[i].total).toBeLessThan(rows[i - 1].total);
    }
    near(rows[0].total, 2.678504627812436, 1e-9);
    near(rows[8].total, -2.0567742160176636, 1e-9);
    near(rows[0].ratio, 0.7475103563344349, 1e-9);
    near(rows[8].ratio, 1.3502027606755092, 1e-9);
  });

  it('crosses zero between the two smallest through-tubing guns and the rest', () => {
    const z = zeroCrossing();
    expect(z.above.odIn).toBe(2.125);
    expect(z.below.odIn).toBe(2.875);
    expect(z.above.conveyance).toBe('through-tubing');
    expect(z.above.total).toBeGreaterThan(0);
    expect(z.below.total).toBeLessThan(0);
    // both through-tubing guns at zero phasing damage; everything else helps
    const damaging = rows.filter((r) => r.total > 0);
    expect(damaging.map((r) => r.phasingDeg)).toEqual([0, 0]);
    expect(damaging.every((r) => r.conveyance === 'through-tubing')).toBe(true);
  });

  it('puts one row and only one row outside the correlation development range', () => {
    const out = outOfRange();
    expect(out).toHaveLength(1);
    expect(out[0].odIn).toBe(7);
    expect(out[0].warnings[0]).toMatch(/rpD/);
    near(out[0].rpD, 0.27603629710708033, 1e-12);
    expect(out[0].rpD).toBeGreaterThan(KT_RPD_RANGE[1]);
    // it is also the most attractive row on the sheet, which is the point
    expect(out[0].total).toBe(Math.min(...rows.map((r) => r.total)));
    expect(rows.filter((r) => r.hD > KT_HD_MAX)).toHaveLength(0);
  });

  it('takes the perforation radius as HALF the entrance hole', () => {
    for (const g of GUN_CATALOG) {
      near(catalogRow(g).rpM, (g.entranceHoleIn * IN) / 2, 1e-15);
      near(catalogRow(g).lpM, g.penetrationIn * IN, 1e-15);
    }
  });
});

describe('the sweeps', () => {
  it('makes phasing the single biggest lever on the plane-flow skin', () => {
    const sw = phasingSweep();
    expect(sw).toHaveLength(6);
    const zero = sw.find((r) => r.phasingDeg === 0);
    const best = sw.reduce((a, b) => (b.total < a.total ? b : a));
    expect(best.phasingDeg).toBe(45);
    // going from in-line shots to 45 degrees is worth about one and a half
    // skin units on this gun, which is more than any other single input buys
    expect(zero.total - best.total).toBeGreaterThan(1.4);
    near(zero.total - best.total, 1.445291566734837, 1e-9);
    // and it is almost entirely the plane-flow term
    const dH = zero.sH - best.sH;
    expect(dH / (zero.total - best.total)).toBeGreaterThan(0.9);
    // alpha decreases monotonically with angle above zero, so rw' grows
    const above = sw.filter((r) => r.phasingDeg > 0);
    for (let i = 1; i < above.length; i += 1) {
      expect(above[i].alpha).toBeLessThan(above[i - 1].alpha);
    }
  });

  it('moves the total the way physics says when one input moves at a time', () => {
    const s = sensitivity();
    expect(s.lpDouble.total).toBeLessThan(s.baseline.total);
    expect(s.lpHalf.total).toBeGreaterThan(s.baseline.total);
    expect(s.spfDouble.sV).toBeLessThan(s.baseline.sV);
    expect(s.spfHalf.sV).toBeGreaterThan(s.baseline.sV);
    expect(s.anisotropic10.sV).toBeGreaterThan(s.isotropic.sV);
    expect(s.crushSevere.sCz).toBeGreaterThan(s.crushClean.sCz);
    expect(s.crushClean.sCz).toBe(0);
    // a severely crushed zone eats a third of the benefit of a good gun
    // without reversing its sign on this one
    expect(s.baseline.total).toBeLessThan(0);
    expect(s.crushSevere.total).toBeLessThan(0);
    near(s.crushSevere.total, -1.1431761350232248, 1e-9);
    expect((s.crushSevere.total - s.baseline.total) / Math.abs(s.baseline.total))
      .toBeGreaterThan(0.3);
  });

  it('makes the productivity ratio depend on the drainage radius, weakly', () => {
    const s = publishedSkin('hsd-4-5-8').total;
    const sw = reSweep(s);
    for (let i = 1; i < sw.length; i += 1) expect(sw[i].ratio).toBeLessThan(sw[i - 1].ratio);
    // forty times the drainage radius moves the ratio by under a fifth
    expect(sw[0].ratio - sw.at(-1).ratio).toBeLessThan(0.2);
    near(sw[0].ratio, 1.3850579235438367, 1e-9);
    near(sw.at(-1).ratio, 1.2101395300063886, 1e-9);
  });

  it('refuses a skin at or below minus the log of the radius ratio', () => {
    const { lnReRw } = prOf(0);
    near(lnReRw, Math.log(PARAMS.reM / PARAMS.rwM), 1e-15);
    near(prOf(0).ratio, 1, 1e-15);
    expect(() => prOf(-lnReRw)).toThrow(/undefined/);
    expect(() => productivityRatio({ reM: 1, rwM: 2, sTotal: 0 })).toThrow(/re > rw/);
  });
});

describe('underbalance', () => {
  it('returns a band with provenance and never a point value', () => {
    const u = underbalanceAdvice({ kMd: 50, fluid: 'oil' });
    expect(u.approx).toBe(true);
    expect(u.provenance).toMatch(/guideline/);
    expect(u.maxPa).toBeGreaterThan(u.minPa);
    near(u.minPa, u.minPsi * PSI, 1e-9);
    near(u.maxPa, u.maxPsi * PSI, 1e-9);
    expect(UNDERBALANCE_BANDS).toHaveLength(3);
  });

  it('asks gas for more underbalance than oil at every permeability class', () => {
    for (const kMd of [200, 50, 5]) {
      const oil = underbalanceAdvice({ kMd, fluid: 'oil' });
      const gas = underbalanceAdvice({ kMd, fluid: 'gas' });
      expect(gas.minPsi).toBeGreaterThan(oil.minPsi);
      expect(gas.maxPsi).toBeGreaterThan(oil.maxPsi);
      expect(gas.classLabel).toBe(oil.classLabel);
    }
    // and tighter rock more than looser rock
    expect(underbalanceAdvice({ kMd: 5, fluid: 'oil' }).minPsi)
      .toBeGreaterThan(underbalanceAdvice({ kMd: 200, fluid: 'oil' }).minPsi);
  });

  it('makes the class boundaries inclusive from below', () => {
    expect(underbalanceAdvice({ kMd: 100, fluid: 'oil' }).classLabel).toMatch(/high/);
    expect(underbalanceAdvice({ kMd: 99.999, fluid: 'oil' }).classLabel).toMatch(/moderate/);
    expect(underbalanceAdvice({ kMd: 10, fluid: 'oil' }).classLabel).toMatch(/moderate/);
    expect(underbalanceAdvice({ kMd: 9.999, fluid: 'oil' }).classLabel).toMatch(/low/);
    expect(() => underbalanceAdvice({ kMd: 0 })).toThrow(/Permeability/);
    expect(() => underbalanceAdvice({ kMd: 10, fluid: 'water' })).toThrow(/fluid/);
  });
});

describe('the sieve', () => {
  it('reproduces every published D-value and statistic', () => {
    const s = publishedStats();
    for (const k of ['d10M', 'd40M', 'd50M', 'd70M', 'd90M', 'd95M', 'uniformity', 'sorting', 'finesPct']) {
      // the golden rounds to nine decimal places, which on a 26 micron D95 is
      // the whole of the disagreement
      near(s[k], GOLDEN.sieve.expected[k], Math.abs(GOLDEN.sieve.expected[k]) * 1e-6 + 5e-10);
    }
    near(s.uniformity, s.d40M / s.d90M, 1e-15);
    near(s.sorting, s.d10M / s.d95M, 1e-15);
  });

  it('reads cumulative RETAINED, so the coarse decile is D10', () => {
    const s = publishedStats();
    expect(s.d10M).toBeGreaterThan(s.d50M);
    expect(s.d50M).toBeGreaterThan(s.d90M);
    expect(s.d90M).toBeGreaterThan(s.d95M);
  });

  it('interpolates log-linearly, which a linear reading would get wrong', () => {
    // two points a decade apart at 40 and 60 percent retained: the 50th
    // percentile is the GEOMETRIC mean and not the arithmetic one
    const pts = ptsOf([[1000, 10], [1000, 40], [100, 60], [100, 90]]);
    const s = sieveStats(pts);
    near(s.d50M, Math.sqrt(1000 * 100) * UM, 1e-15);
    expect(s.d50M).toBeLessThan(((1000 + 100) / 2) * UM);
  });

  it('returns null rather than extrapolating past the measured curve', () => {
    const short = ptsOf([[500, 5], [300, 20], [200, 40], [120, 60]]);
    const s = sieveStats(short);
    expect(s.d70M).toBeNull();
    expect(s.d90M).toBeNull();
    expect(s.uniformity).toBeNull();
    expect(sandControlAdvisor(s).indication).toBe('insufficient sieve coverage');
  });

  it('refuses a curve that is not a curve', () => {
    expect(() => sieveStats([{ sizeM: 1e-4, cumRetainedPct: 10 }])).toThrow(/at least 4/);
    expect(() => sieveStats(ptsOf([[500, 5], [300, 20], [200, 40], [-1, 60]]))).toThrow(/positive/);
    expect(() => sieveStats(ptsOf([[500, 5], [300, 20], [200, 40], [120, 101]]))).toThrow(/0-100/);
    // sizes must fall as retained rises
    expect(() => sieveStats(ptsOf([[100, 5], [300, 20], [200, 40], [120, 60]]))).toThrow(/monotone/);
  });

  it('puts the fines cutoff at 325 mesh and interpolates to it', () => {
    near(FINES_CUTOFF_M, 44 * UM, 1e-18);
    // a curve whose last point IS the cutoff reads the complement directly
    const onCut = sieveStats(ptsOf([[500, 2], [200, 30], [100, 70], [44, 96]]));
    near(onCut.finesPct, 4, 1e-12);
    // one that stops coarse of it reports what is below the last sieve
    const coarse = sieveStats(ptsOf([[500, 2], [300, 30], [200, 70], [100, 96]]));
    near(coarse.finesPct, 4, 1e-12);
  });
});

describe('the advisor ladder', () => {
  const rungs = rungTable();

  it('lands five sands on the four rungs in order', () => {
    expect(rungs).toHaveLength(5);
    expect(rungs.map((r) => r.indication)).toEqual([
      'standalone wire-wrap screen viable',
      'standalone wire-wrap screen viable',
      'standalone premium screen viable',
      'gravel pack',
      'gravel pack with fines management / frac-pack evaluation',
    ]);
    for (let i = 1; i < rungs.length; i += 1) {
      expect(rungs[i].uniformity).toBeGreaterThan(rungs[i - 1].uniformity);
    }
  });

  it('lets the FINES decide in the middle of the range, not the uniformity', () => {
    const graded = rungs.find((r) => r.name === 'graded');
    const gp = rungs.find((r) => r.name === 'gravel-pack sand');
    // near-identical uniformity, different rung
    expect(Math.abs(gp.uniformity - graded.uniformity)).toBeLessThan(0.2);
    expect(gp.finesPct).toBeGreaterThan(graded.finesPct);
    expect(gp.indication).not.toBe(graded.indication);
    near(graded.finesPct, 4, 1e-9);
    near(gp.finesPct, 7, 1e-9);
  });

  it('is an exhaustive ordered ladder with the published sand on the third rung', () => {
    const s = publishedStats();
    const a = sandControlAdvisor(s);
    expect(a.indication).toBe(GOLDEN.gravel.advisorIndication);
    expect(a.checks).toHaveLength(4);
    expect(a.checks.filter((c) => c.pass).length).toBeGreaterThan(0);
    expect(a.provenance).toMatch(/39437/);
    // every (cu, fines) pair reaches a rung
    for (const cu of [1, 2.9, 3, 4.9, 5, 9]) {
      for (const fines of [0, 1.9, 2, 4.9, 5, 9.9, 10, 30]) {
        const fake = { uniformity: cu, finesPct: fines };
        expect(sandControlAdvisor(fake).indication).toBeTruthy();
      }
    }
  });
});

describe('gravel and screens', () => {
  it('sizes the gravel at five to six times the formation D50', () => {
    const s = publishedStats();
    const sa = saucierGravel({ d50M: s.d50M });
    near(sa.bandMinM, 5 * s.d50M, 1e-18);
    near(sa.bandMaxM, 6 * s.d50M, 1e-18);
    near(sa.bandMinM, GOLDEN.gravel.expected.bandMinM, 1e-9);
    expect(sa.matches.map((m) => m.mesh)).toEqual(GOLDEN.gravel.expected.matches);
    expect(() => saucierGravel({ d50M: 0 })).toThrow(/D50/);
  });

  it('leaves three of seven sample sands with no commercial match at all', () => {
    const sw = saucierSweep();
    const noMatch = sw.filter((r) => r.noMatch);
    expect(noMatch).toHaveLength(3);
    expect(noMatch.map((r) => r.d50Um)).toEqual([100, 200, 300]);
    // the band is only 1.2 times wide and the catalog rows are dual designations
    for (const r of sw) near(r.bandMaxM / r.bandMinM, 6 / 5, 1e-12);
    // and the nearest sand is always reported, match or not
    expect(sw.every((r) => typeof r.nearest === 'string')).toBe(true);
  });

  it('picks the largest standard gauge strictly below the smallest gravel grain', () => {
    const t = gaugeTable();
    for (const r of t) {
      near(r.maxGaugeM, r.minM, 1e-18);
      expect(r.gaugeM).toBeLessThan(r.maxGaugeM);
      expect(r.marginM).toBeGreaterThan(0);
      // no larger standard gauge would also have fitted
      const bigger = SCREEN_GAUGE_THOU.map((x) => x * THOU).filter((g) => g > r.gaugeM && g < r.maxGaugeM);
      expect(bigger).toHaveLength(0);
    }
    near(t.find((r) => r.mesh === '20/40').gaugeThou, GOLDEN.gravel.screenGaugeThou, 1e-12);
  });

  it('saturates at both ends, so the gauge is not a one to one map of the gravel', () => {
    const t = gaugeTable();
    const thous = t.map((r) => r.gaugeThou);
    expect(new Set(thous).size).toBeLessThan(t.length);
    expect(t.find((r) => r.mesh === '8/12').gaugeThou).toBe(25);
    expect(t.find((r) => r.mesh === '12/20').gaugeThou).toBe(25);
    expect(t.find((r) => r.mesh === '40/60').gaugeThou).toBe(8);
    expect(t.find((r) => r.mesh === '50/70').gaugeThou).toBe(8);
  });

  it('opens a Coberly window on D10 for a standalone screen', () => {
    const s = publishedStats();
    const sa = screenSelection({ mode: 'standalone', stats: s });
    near(sa.slotMinM, s.d10M, 1e-18);
    near(sa.slotMaxM, 2 * s.d10M, 1e-18);
    expect(sa.rule).toMatch(/Coberly/);
    expect(() => screenSelection({ mode: 'nonsense' })).toThrow(/mode/);
    expect(() => screenSelection({ mode: 'gravel-pack' })).toThrow(/catalog row/);
    expect(() => screenSelection({ mode: 'standalone', stats: {} })).toThrow(/D10/);
  });
});

describe('sanding onset', () => {
  it('is the Kirsch hoop closed form and nothing more', () => {
    const fx = GOLDEN.sanding.fixture;
    const r = sandingOnset(fx.inputs);
    near(r.pwfCritPa, fx.expected.pwfCritPa, 1e-9);
    near(r.pwfCritPa, (3 * fx.inputs.s1Pa - fx.inputs.s2Pa - fx.inputs.ucsPa) / 2, 1e-9);
    expect(r.screeningGrade).toBe(true);
    // the boost multiplies the strength and nothing else
    near(sandingOnset({ ...fx.inputs, boostFactor: 2 }).uPa, 2 * fx.inputs.ucsPa, 1e-9);
    expect(() => sandingOnset({ s1Pa: 1, s2Pa: 2, ucsPa: 1 })).toThrow(/S1 >= S2/);
    expect(() => sandingOnset({ s1Pa: 2, s2Pa: 1, ucsPa: 0 })).toThrow(/UCS/);
    expect(() => sandingOnset({ s1Pa: 2, s2Pa: 1, ucsPa: 1, boostFactor: 0 })).toThrow(/boost/);
  });

  it('reproduces both published sweeps row for row', () => {
    for (const geometry of CAVITY_GEOMETRIES) {
      const r = cdpFor({ geometry });
      const exp = GOLDEN.sanding.cdp[geometry];
      expect(r.rows).toHaveLength(exp.rows.length);
      r.rows.forEach((row, i) => {
        near(row.tvdM, exp.rows[i].tvdM, 1e-6);
        near(row.cdpPa, exp.rows[i].cdpPa, Math.abs(exp.rows[i].cdpPa) * 1e-9);
      });
      near(r.governing.cdpPa, exp.governing.cdpPa, 1e-3);
    }
  });

  it('makes the perf tunnel the tighter of the two cavity geometries here', () => {
    const pt = cdpFor({ geometry: 'perf-tunnel' }).governing;
    const oh = cdpFor({ geometry: 'openhole' }).governing;
    expect(pt.cdpPa).toBeLessThan(oh.cdpPa);
    // both govern at the interval TOP on this profile, because the rock
    // strengthens faster with depth than the pore pressure rises
    expect(pt.mdM).toBe(PARAMS.interval.topMdM);
    expect(oh.mdM).toBe(PARAMS.interval.topMdM);
    const rows = cdpFor({ geometry: 'perf-tunnel' }).rows;
    for (let i = 1; i < rows.length; i += 1) expect(rows[i].cdpPa).toBeGreaterThan(rows[i - 1].cdpPa);
  });

  it('raises the margin with the strength boost, monotonically', () => {
    const sw = boostSweep();
    for (let i = 1; i < sw.length; i += 1) {
      expect(sw[i].governingCdpPa).toBeGreaterThan(sw[i - 1].governingCdpPa);
    }
    // the margin is linear in the boost, because the boost only scales U
    const d1 = sw[3].governingCdpPa - sw[2].governingCdpPa;
    const d2 = sw[4].governingCdpPa - sw[3].governingCdpPa;
    near(d2 / d1, (sw[4].boostFactor - sw[3].boostFactor) / (sw[3].boostFactor - sw[2].boostFactor), 1e-9);
  });
});

describe('the sweep, and the row that was missing', () => {
  it('reaches the interval bottom at every step size, dividing or not', () => {
    const t = stepIndependence();
    expect(t).toHaveLength(8);
    for (const r of t) {
      near(r.firstMdM, PARAMS.interval.topMdM, 1e-9);
      near(r.lastMdM, PARAMS.interval.bottomMdM, 1e-9);
      expect(r.rows).toBeGreaterThanOrEqual(2);
    }
    // a step that divides the interval and one that does not
    expect(t.find((r) => r.stepMdM === 10).rows).toBe(11);
    expect(t.find((r) => r.stepMdM === 30).rows).toBe(5);
    expect(t.find((r) => r.stepMdM === 150).rows).toBe(2);
  });

  it('matches the golden ragged case, which the ten metre case cannot test', () => {
    const rg = GOLDEN.sanding.cdpRagged;
    expect(rg.stepMdM).toBe(30);
    const r = cdpFor({ geometry: rg.geometry, stepMdM: rg.stepMdM });
    expect(r.rows).toHaveLength(rg.rows.length);
    r.rows.forEach((row, i) => {
      near(row.mdM, rg.rows[i].mdM, 1e-9);
      near(row.cdpPa, rg.rows[i].cdpPa, Math.abs(rg.rows[i].cdpPa) * 1e-9);
    });
    expect(r.rows.map((x) => x.mdM)).toEqual([2450, 2480, 2510, 2540, 2550]);
    // 100 divided by 30 is not a whole number, and the last step is short
    expect(r.rows[4].mdM - r.rows[3].mdM).toBe(10);
  });

  it('flips the sign of the governing margin on a base that is the weak rock', () => {
    // the profile the missing row was hiding: the truncated sweep reported a
    // POSITIVE margin at 2540 while the interval bottom was already negative
    const curves = weakenedCurves();
    const fine = cdpFor({ curves, stepMdM: 10 });
    const coarse = cdpFor({ curves, stepMdM: 30 });
    expect(fine.governing.mdM).toBe(2550);
    expect(coarse.governing.mdM).toBe(2550);
    expect(fine.governing.cdpPa).toBeLessThan(0);
    near(coarse.governing.cdpPa, fine.governing.cdpPa, 1e-9);
    near(fine.governing.cdpPa, -1252576.943446286, 1e-6);
    // and the row the old sweep would have stopped on was positive
    const at2540 = coarse.rows.find((r) => r.mdM === 2540);
    expect(at2540.cdpPa).toBeGreaterThan(0);
    near(at2540.cdpPa, 654391.6456972882, 1e-6);
  });

  it('refuses an interval or a step that describes nothing', () => {
    expect(() => cdpFor({ topMdM: 2550, bottomMdM: 2450 })).toThrow(/bottom/);
    expect(() => cdpFor({ stepMdM: 0 })).toThrow(/Step/);
    expect(() => cdpFor({ geometry: 'sausage' })).toThrow(/geometry/);
  });
});

describe('the capstone', () => {
  const V = capstoneValues();

  it('runs a hole, a charge, a sand and an interval the lessons never use', () => {
    near(CAPSTONE.rwM, 4.9375 * IN, 1e-15);
    expect(CAPSTONE.rwM).not.toBe(PARAMS.rwM);
    expect(CAPSTONE.reM).not.toBe(PARAMS.reM);
    expect(CAPSTONE.khOverKv).not.toBe(PARAMS.khOverKv);
    expect(CAPSTONE.kMd).not.toBe(PARAMS.kMd);
    // a phasing neither published gun uses
    expect(CAPSTONE.phasingDeg).toBe(90);
    expect(GOLDEN.guns.map((g) => g.inputs.phasingDeg)).not.toContain(90);
    // a charge no catalog row carries
    expect(GUN_CATALOG.some((g) => g.penetrationIn === CAPSTONE.penetrationIn
      && g.entranceHoleIn === CAPSTONE.entranceHoleIn)).toBe(false);
    // and a step that does not divide the interval
    expect((CAPSTONE.bottomMdM - CAPSTONE.topMdM) % CAPSTONE.stepMdM).not.toBe(0);
  });

  it('pins all eighteen graded values', () => {
    near(V.spf_per_m, 26.246719160104984, 1e-9);
    near(V.perf_spacing_m, 0.0381, 1e-12);
    near(V.d50_m, 0.00015154816894736884, 1e-14);
    near(V.d10_m, 0.0003658764876914779, 1e-14);
    near(V.uniformity, 3.4289759314122965, 1e-9);
    near(V.fines_pct, 6.136789960794047, 1e-9);
    near(V.skin_h, -1.3764549734793852, 1e-9);
    near(V.skin_v, 0.3651263069479987, 1e-9);
    near(V.skin_cz, 0.25795865826120373, 1e-9);
    near(V.skin_total, -0.7474989638653953, 1e-9);
    near(V.productivity_ratio, 1.1111973107176247, 1e-9);
    near(V.rp_d, 0.07980073645961891, 1e-12);
    near(V.gravel_band_min_m, 0.0007577408447368442, 1e-14);
    near(V.gauge_margin_m, 0.00008699999999999995, 1e-14);
    near(V.pwf_crit_pa, 11691094.102374725, 1e-4);
    near(V.cdp_governing_pa, 8884412.847751666, 1e-4);
    near(V.cdp_bottom_pa, 12588855.56336058, 1e-4);
    near(V.boost_at_zero_margin, 0.7896888993074376, 1e-9);
  });

  it('has no two graded values inside either tolerance of each other', () => {
    const F = [
      ['spf_per_m', 5e-7], ['perf_spacing_m', 5e-8], ['d50_m', 5e-10], ['d10_m', 5e-10],
      ['uniformity', 5e-7], ['fines_pct', 5e-6], ['skin_h', 5e-7], ['skin_v', 5e-7],
      ['skin_cz', 5e-7], ['skin_total', 5e-7], ['productivity_ratio', 5e-7], ['rp_d', 5e-8],
      ['gravel_band_min_m', 5e-10], ['gauge_margin_m', 5e-10], ['pwf_crit_pa', 500],
      ['cdp_governing_pa', 500], ['cdp_bottom_pa', 500], ['boost_at_zero_margin', 5e-7],
    ];
    expect(F).toHaveLength(18);
    for (let a = 0; a < F.length; a += 1) {
      for (let b = a + 1; b < F.length; b += 1) {
        const gap = Math.abs(V[F[a][0]] - V[F[b][0]]);
        expect(gap).toBeGreaterThan(Math.max(F[a][1], F[b][1]));
      }
    }
  });

  it('has no graded value within its tolerance of anything the golden publishes', () => {
    const pub = [];
    (function walk(o) {
      if (typeof o === 'number') { pub.push(o); return; }
      if (Array.isArray(o)) { o.forEach(walk); return; }
      if (o && typeof o === 'object') Object.values(o).forEach(walk);
    }(GOLDEN));
    expect(pub.length).toBeGreaterThan(800);
    const tol = {
      d50_m: 5e-10, d10_m: 5e-10, gravel_band_min_m: 5e-10, gauge_margin_m: 5e-10,
      perf_spacing_m: 5e-8, rp_d: 5e-8, fines_pct: 5e-6,
      pwf_crit_pa: 500, cdp_governing_pa: 500, cdp_bottom_pa: 500,
    };
    for (const [k, v] of Object.entries(V)) {
      const t = tol[k] ?? 5e-7;
      for (const p of pub) if (p !== 0) expect(Math.abs(p - v)).toBeGreaterThan(t);
    }
  });

  it('closes each tier on a check the learner can run without the answer', () => {
    // the spacing is the reciprocal of the density
    near(V.perf_spacing_m * V.spf_per_m, 1, 1e-12);
    // the coarse decile is coarser than the median
    expect(V.d10_m).toBeGreaterThan(V.d50_m);
    // the four components sum to the total
    const s = capstoneSkin();
    near(V.skin_h + V.skin_v + s.sWb + V.skin_cz, V.skin_total, 1e-12);
    // a negative total gives a ratio above one
    expect(V.skin_total).toBeLessThan(0);
    expect(V.productivity_ratio).toBeGreaterThan(1);
    // the gravel band is five times the sand
    near(V.gravel_band_min_m, 5 * V.d50_m, 1e-15);
    // the bottom row is looser than the governing row, and the governing row
    // is the interval TOP on this profile
    expect(V.cdp_bottom_pa).toBeGreaterThan(V.cdp_governing_pa);
    expect(capstoneCdp().governing.mdM).toBe(CAPSTONE.topMdM);
  });

  it('needs the interval bottom row that the old sweep never computed', () => {
    const cdp = capstoneCdp();
    expect(cdp.rows.map((r) => r.mdM)).toEqual([2200, 2225, 2250, 2275, 2300, 2320]);
    expect(cdp.rows[cdp.rows.length - 1].mdM).toBe(CAPSTONE.bottomMdM);
    // the last step is short, which is exactly the case the defect dropped
    expect(cdp.rows[5].mdM - cdp.rows[4].mdM).toBe(20);
    expect(cdp.rows[4].mdM - cdp.rows[3].mdM).toBe(25);
  });

  it('sits below the strength the rock actually has, at a boost under one', () => {
    // the margin is positive at the stated boost and the crossing is below it
    expect(V.cdp_governing_pa).toBeGreaterThan(0);
    expect(V.boost_at_zero_margin).toBeLessThan(CAPSTONE.boostFactor);
    expect(V.boost_at_zero_margin).toBeLessThan(1);
    // so the interval is screened as safe even with no strength boost at all
    expect(capstoneCdp({ boostFactor: 1 }).governing.cdpPa).toBeGreaterThan(0);
  });

  it('lands the capstone sand on the gravel pack rung with a real match', () => {
    const stats = capstoneStats();
    expect(sandControlAdvisor(stats).indication).toBe('gravel pack');
    const pack = capstonePack();
    expect(pack.noMatch).toBe(false);
    expect(pack.mesh).toBe('16/30');
    expect(pack.gaugeThou).toBe(20);
    near(pack.marginM, V.gauge_margin_m, 1e-18);
    // and the capstone permeability puts it in a different underbalance class
    // from the lessons
    expect(underbalanceAdvice({ kMd: CAPSTONE.kMd, fluid: 'oil' }).classLabel).toMatch(/low/);
    expect(underbalanceAdvice({ kMd: PARAMS.kMd, fluid: 'oil' }).classLabel).toMatch(/moderate/);
  });
});
