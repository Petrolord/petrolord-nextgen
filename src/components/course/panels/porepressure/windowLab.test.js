import { describe, it, expect } from 'vitest';
import {
  computeWindowExplorer, computeBowersFacts, computeMudWindow, BOWERS_UNLOAD_V_MS,
} from '@/lib/porepressureTeaching';

// DC27 panel math pinned to the LIVE NG9 Expert capstone answer key and to
// the tier's engine-verified teaching facts (TRUTH digest 2026-08-25).

describe('Window explorer vs the live Expert capstone key', () => {
  const m = computeWindowExplorer(3.0);
  const b = computeBowersFacts();

  it('reproduces the graded EMW trio at TD', () => {
    expect(m.ppEmwTd).toBeCloseTo(1179.1048116553065, 9);
    expect(m.fpEmwTd).toBeCloseTo(1903.9238599165737, 9);
    expect(m.windowTd).toBeCloseTo(724.8190482612672, 9);
  });

  it('reproduces the graded Bowers pair', () => {
    expect(b.vLoad5MPa).toBeCloseTo(1949.944709834568, 9);
    expect(b.sigmaUnloadPa / 1e6).toBeCloseTo(10, 9);
  });

  it('reproduces the graded n = 1.2 pore pressure at TD', () => {
    expect(computeWindowExplorer(1.2).ppTdMpa).toBeCloseTo(43.901549937778526, 9);
  });

  it('agrees with the untouched capstone driver', () => {
    const drv = computeMudWindow();
    expect(m.ppEmwTd).toBeCloseTo(drv.ppEmwTd, 9);
    expect(m.windowTd).toBeCloseTo(drv.windowTd, 9);
    expect(b.vLoad5MPa).toBeCloseTo(drv.bowersV5MPa, 9);
  });
});

describe('the window down the well', () => {
  const m = computeWindowExplorer(3.0);
  const at = (z) => m.curve.find((p) => p.z === z);

  it('sits inside the Associate bracket at TD', () => {
    expect(m.hydroEmwTd).toBeCloseTo(1029.878048780488, 9);
    expect(m.obEmwTd).toBeCloseTo(2266.333384047207, 9);
    expect(m.ppEmwTd).toBeGreaterThan(m.hydroEmwTd);
    expect(m.fpEmwTd).toBeLessThan(m.obEmwTd);
  });

  it('is widest at the ramp top and shrinks below it', () => {
    const w2500 = at(2500).fpEmw - at(2500).ppEmw;
    const w3000 = at(3000).fpEmw - at(3000).ppEmw;
    expect(w2500).toBeCloseTo(750.2832396352455, 9);
    expect(w3000).toBeCloseTo(735.1476808049017, 9);
    expect(w2500).toBeGreaterThan(w3000);
    expect(w3000).toBeGreaterThan(m.windowTd);
  });

  it('overpressure lifts the floor by 149.23 kg/m3 at TD', () => {
    expect(m.ppEmwTd - m.hydroEmwTd).toBeCloseTo(149.2267628748185, 6);
  });

  it('n = 1.2 lowers the floor and widens the window', () => {
    const alt = computeWindowExplorer(1.2);
    expect(alt.ppEmwTd).toBeCloseTo(1091.881030400315, 9);
    expect(alt.windowTd).toBeCloseTo(782.968235764595, 9);
    expect(alt.windowTd).toBeGreaterThan(m.windowTd);
  });
});

describe('Bowers: mechanism decides the number', () => {
  const b = computeBowersFacts();

  it('the loading curve reads 29.24 MPa from the velocity unloading reads 10 from', () => {
    expect(b.sigmaLoadSameVPa / 1e6).toBeCloseTo(29.240177382128643, 9);
  });

  it('the two curves rejoin exactly at sigma_max', () => {
    expect(b.rejoinUnloadVMs).toBeCloseTo(b.rejoinLoadVMs, 12);
    expect(b.rejoinLoadVMs).toBeCloseTo(3919.263125861896, 9);
  });

  it('the mudline velocity is exactly 1524 m/s (5000 ft/s)', () => {
    expect(b.mudlineVMs).toBe(1524);
    expect(BOWERS_UNLOAD_V_MS).toBeCloseTo(3125.808993287662, 12);
  });

  it('the cross-check: Bowers loading agrees with Eaton at TD to 0.038 MPa', () => {
    expect(b.vTdMs).toBeCloseTo(3691.0906301457703, 9);
    expect(b.eatonSigmaTdPa / 1e6).toBeCloseTo(43.714487325732826, 9);
    expect(b.bowersSigmaTdPa / 1e6).toBeCloseTo(43.752391704220855, 9);
    expect(b.bowersPpTdPa / 1e6).toBeCloseTo(47.37067524651197, 9);
    expect(Math.abs(b.agreementPa) / 1e6).toBeCloseTo(0.03790437848802725, 9);
    expect(Math.abs(b.agreementPa) / 1e6).toBeLessThan(0.05);
  });
});
