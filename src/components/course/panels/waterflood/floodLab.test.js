// floodLab pins. Every one of the eighteen RC4 capstone oracles is reproduced
// here THROUGH the teaching lab, so a panel and the live grader can never drift
// apart, plus the supporting truth the lessons quote at full precision.
// Source of truth: RC4-TRUTH.md, derived by running the vendored engines.

import { describe, it, expect } from 'vitest';
import * as lab from './floodLab.js';

const near = (a, b, tol) => expect(Math.abs(a - b)).toBeLessThanOrEqual(tol);

describe('floodLab: Associate capstone oracles', () => {
  it('field cumulative VRR', () => {
    near(lab.fieldLedger().summary.cumulativeVRR, 1.034899536109, 1e-12);
  });

  it('produced and injected voidage', () => {
    const s = lab.fieldLedger().summary;
    near(s.totalProducedVoidage, 221736.43680913927, 1e-8);
    near(s.totalInjectedVoidage, 229474.93559224083, 1e-8);
  });

  it('fill-up month index', () => {
    expect(lab.ledgerWith({}).fillUp).toEqual({ index: 11, label: '2023-12', startedAbove: false });
  });

  it('months under the 1.00 to 1.20 operator band', () => {
    expect(lab.ledgerWith({ window: 3, band: lab.TARGET_BAND }).monthsUnder).toBe(4);
    expect(lab.ledgerWith({ window: 3, band: lab.TARGET_BAND }).monthsOver).toBe(0);
  });

  it('the 2023-01 voidage chain', () => {
    const v = lab.periodVoidage('2023-01');
    near(v.producedVoidage, 5747.317402456214, 1e-9);
    near(v.injectedVoidage, 4885.219792087782, 1e-9);
    near(v.instantaneousVRR, 0.85, 1e-12);
    expect(v.freeGasProdMscf).toBe(0);
    near(v.solutionGasMscf, v.period.Gp, 1e-9);
  });
});

describe('floodLab: Professional capstone oracles', () => {
  it('out-of-zone injection', () => {
    const a = lab.allocationAudit();
    near(a.unallocated.winj_stb, 26997.051246145966, 1e-8);
    expect(a.residual).toBe(0);
    near(a.outOfZoneFraction, 0.11999999999999997, 1e-15);
  });

  it('North and South cumulative VRR', () => {
    near(lab.patternLedger('North').cumulativeVRR, 1.2024353717815623, 1e-12);
    near(lab.patternLedger('South').cumulativeVRR, 0.6097477559533482, 1e-12);
  });

  it('South recommended injection at target 1.0', () => {
    const r = lab.patternAdvice('South', { targetVRR: 1.0, windowPeriods: 3 });
    expect(r.withheld).toBe(false);
    near(r.recommendedWi, 2683.051749612857, 1e-8);
    near(r.currentVRR, 0.6082528252875008, 1e-12);
    near(r.scale, 1.644053193714856, 1e-12);
    expect(r.clamped).toBe(false);
  });

  it('the Hall slope ratio for Ekene-4 above the reference pressure', () => {
    const h = lab.hallPlots({ aboveReference: true });
    const e4 = h.plots.find((p) => p.injector === 'Ekene-4');
    near(e4.slope_ratio, 1.4285714285714286, 1e-12);
    near(e4.slope_baseline, 2, 1e-12);
    near(e4.slope_last, 1 / 0.35, 1e-12);
    expect(h.alerts).toHaveLength(1);
  });

  it('the Chan late-time slope on Ekene-6', () => {
    const c = lab.chanDiagnostics();
    const e6 = c.producers.find((p) => p.producer === 'Ekene-6');
    near(e6.lateSlope, 2.348281726147951, 1e-12);
    expect(e6.classification.code).toBe('channeling');
  });
});

describe('floodLab: Expert capstone oracles', () => {
  it('Dykstra-Parsons permeability variation recovers the plant', () => {
    const v = lab.permeabilityVariation();
    near(v.V, 0.5, 1e-15);
    near(v.sigma, Math.log(2), 1e-15);
    near(v.k50, 250, 1e-9);
    expect(v.n).toBe(5);
  });

  it('coverage at first breakthrough and the Stiles water cut', () => {
    const s = lab.layerSweep({});
    near(s.dykstraParsons[0].coverage, 0.5146907350993352, 1e-12);
    expect(s.stiles[0].water_cut).toBeUndefined();
    near(s.stiles[0].waterCut, 0.5843728303284756, 1e-12);
    near(s.A, 1.4304000000000001, 1e-15);
    expect(s.netPayFt).toBe(84);
  });

  it('areal sweep at breakthrough for the design mobility ratio', () => {
    near(lab.arealSweepAtBreakthrough(1.2), 0.6573574366303985, 1e-12);
  });

  it('the design case breaks through at 639.1875 days', () => {
    const f = lab.namedForecast('design');
    near(f.summary.breakthrough_days, 639.1875, 1e-9);
    near(f.summary.Np_stb, 1709784.4164781766, 1e-6);
    near(f.summary.recoveryFactorOfFloodedOOIP, 0.5545614215589451, 1e-12);
    expect(f.summary.stopped).toBe('wor-limit');
  });

  it('the implied swept fraction of the element', () => {
    const c = lab.channelBackout();
    near(c.fractionOfElement, 0.014697005138728762, 1e-15);
    near(c.impliedSweptPvRb, 164686.15596920124, 1e-8);
  });
});

describe('floodLab: supporting truth the lessons quote', () => {
  // Taught in Associate m05 l03. NOT graded anywhere: it lands 4.6e-5 from the
  // Associate's own graded field cumulative VRR, so no usable tolerance can
  // separate the two. See RC4-TRUTH section J.
  it('cumulative VRR on a pressure-tracked Bo, taught but not graded', () => {
    const t = lab.trackedFvfLedger();
    near(t.tracked, 1.0349459620241488, 1e-12);
    near(t.frozen, 1.034899536109, 1e-12);
    near(t.differencePct, 0.004486031110162436, 1e-12);
    expect(Math.abs(t.tracked - t.frozen)).toBeLessThan(0.0005);
  });

  it('the break-even VRR is Boi/Bo(ledger), not 1.0', () => {
    near(lab.BREAK_EVEN_VRR, 0.9869719699960521, 1e-15);
    expect(lab.BREAK_EVEN_VRR).toBeLessThan(1);
  });

  it('the pressure trough and the cadence that misses it', () => {
    const p = lab.pressureView();
    expect(p.trough.label).toBe('2023-04');
    near(p.trough.p_end_psia, 2088.9530115439275, 1e-9);
    expect(p.interpolatedTrough.label).toBe('2023-07');
    near(p.troughMissedByPsi, 2.427063793101752, 1e-9);
    near(p.recoveryPsi, 34.4931292839633, 1e-9);
  });

  it('the rolling window is a lag, not a smoother', () => {
    const one = lab.ledgerWith({ window: 1 });
    expect(one.rolling.every((v, i) => v === one.series[i].instantaneousVRR)).toBe(true);
    const twelve = lab.ledgerWith({ window: 12 });
    near(twelve.rolling[7], 0.9775428385647656, 1e-12);
  });

  it('the three cumulative VRR numbers one flood produces', () => {
    const c = lab.vrrComparison();
    near(c.ledgerVolumes, 1.034899536109, 1e-12);
    near(c.dailyRowsAsDays, 1.034709324454895, 1e-12);
    near(c.dailyVsLedgerPct, -0.018379721651073933, 1e-12);
    near(c.wrongCaseRatio, 1.185218598407499, 1e-12);
    near(c.wrongCase, 1.2263567352896008, 1e-12);
  });

  it('the absolute-pressure Hall run raises no alert at all', () => {
    const h = lab.hallPlots({ aboveReference: false });
    const e4 = h.plots.find((p) => p.injector === 'Ekene-4');
    near(e4.slope_ratio, 1.0669369155108472, 1e-12);
    expect(e4.slope_ratio).toBeLessThan(1.2);
    expect(h.alerts).toHaveLength(0);
    expect(lab.HALL_REFERENCE_PSIA).toBe(2050);
  });

  it('Chan reads channeling on both wet producers, and two producers get no curve', () => {
    const c = lab.chanDiagnostics();
    near(c.field.lateSlope, 2.2114559940777454, 1e-12);
    expect(c.field.classification.code).toBe('channeling');
    expect(c.producers.map((p) => p.producer)).toEqual(['Ekene-3', 'Ekene-6']);
    near(c.producers[0].lateSlope, 1.6028659409443355, 1e-12);
    near(c.producers[1].lateSlope, 2.348281726147951, 1e-12);
  });

  it('the lag table cannot separate two proportional injectors', () => {
    const lags = lab.lagTable();
    const byProducer = {};
    lags.forEach((l) => { (byProducer[l.producer] ||= []).push(l); });
    Object.values(byProducer).forEach((pair) => {
      expect(pair[0].lag_days).toBe(pair[1].lag_days);
      expect(Math.abs(pair[0].corr - pair[1].corr)).toBeLessThan(1e-9);
    });
    expect(byProducer['Ekene-6'][0].lag_days).toBe(0);
    expect(byProducer['Ekene-5'][0].lag_days).toBe(6);
  });

  it('the whole-field pattern invariant', () => {
    near(lab.wholeFieldPattern(), 1.034899536109, 1e-12);
  });

  it('advice is withheld, never faked, without allocation', () => {
    const r = lab.patternAdvice('Nowhere');
    expect(r.withheld).toBe(true);
    expect(r.reason).toMatch(/never assumed/);
  });

  it('the clamp reports itself', () => {
    const r = lab.patternAdvice('South', { targetVRR: 3.0, windowPeriods: 3 });
    expect(r.clamped).toBe(true);
    expect(r.scale).toBe(2);
  });

  it('North fill-up started above 1, South never reaches it', () => {
    expect(lab.patternLedger('North').fillUp).toEqual({ index: 0, label: '2023-01', startedAbove: true });
    expect(lab.patternLedger('South').fillUp).toBeNull();
  });

  it('the observed injection rate never floods the element', () => {
    const f = lab.namedForecast('observed');
    expect(f.summary.breakthrough_days).toBeNull();
    expect(f.summary.stopped).toBe('horizon');
    near(f.summary.recoveryFactorOfFloodedOOIP, 0.1575013967147545, 1e-12);
  });

  it('free gas delays breakthrough and manufactures early water', () => {
    const f = lab.namedForecast('fillup');
    near(f.summary.breakthrough_days, 791.375, 1e-9);
    expect(f.warnings.some((w) => /free gas/i.test(w))).toBe(true);
  });

  it('the pre-breakthrough identity is exact', () => {
    const f = lab.namedForecast('design');
    near(f.series[4].qo_stbd * lab.ELEMENT.Bo, 2000, 1e-9);
    near(f.series.at(-1).qo_stbd * lab.ELEMENT.Bo + f.series.at(-1).qw_stbd * lab.ELEMENT.Bw, 2000, 1e-9);
  });

  it('rate buys time, not oil', () => {
    const slow = lab.forecast({ iw: 1000 });
    const fast = lab.forecast({ iw: 4000 });
    near(slow.summary.breakthrough_days, 1278.375, 1e-9);
    near(fast.summary.breakthrough_days, 334.8125, 1e-9);
    expect(Math.abs(fast.summary.Np_stb / slow.summary.Np_stb - 1)).toBeLessThan(0.002);
  });

  it('a worse mobility ratio breaks through earlier and recovers less', () => {
    const base = lab.forecast({});
    const bad = lab.forecast({ muO: 10 });
    near(bad.summary.M, 20 / 3, 1e-12);
    near(bad.summary.EAbt, 0.5171816802422665, 1e-12);
    expect(bad.summary.breakthrough_days).toBeLessThan(base.summary.breakthrough_days);
    expect(bad.summary.recoveryFactorOfFloodedOOIP).toBeLessThan(base.summary.recoveryFactorOfFloodedOOIP);
  });

  it('the field-unit pore volume constant is not exact', () => {
    const p = lab.poreVolumeUnits();
    near(p.relDiff, -0.00004565110161166218, 1e-15);
    near(p.fieldUnits, 11204911.22581217, 1e-6);
  });

  it('the layer column is ordered by permeability, not by depth', () => {
    const ordered = lab.normalizeLayers(lab.LAYERS.map((l) => ({ h: l.h_ft, k: l.k_md })));
    expect(ordered[0].k).toBe(lab.LAYERS[1].k_md);
    expect(ordered.map((l) => l.h)).toEqual([22, 14, 16, 18, 14]);
  });

  it('Stiles equals Dykstra-Parsons in the unit-mobility limit', () => {
    const st = lab.analyzeStiles({ layers: lab.LAYERS.map((l) => ({ h: l.h_ft, k: l.k_md })), A: 1 });
    const dp = lab.analyzeDykstraParsons({ layers: lab.LAYERS.map((l) => ({ h: l.h_ft, k: l.k_md })), M: 1 });
    expect(st.stages.map((s) => s.coverage)).toEqual(dp.stages.map((s) => s.coverage));
  });

  it('a WOR limit is only resolved to the time step', () => {
    const tight = lab.forecast({ worLimit: 10 });
    const loose = lab.forecast({ worLimit: 25 });
    expect(tight.summary.elapsed_days).toBe(loose.summary.elapsed_days);
    near(tight.summary.finalWOR, 31.119000015950355, 1e-9);
  });
});
