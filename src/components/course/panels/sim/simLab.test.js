// simLab pins. Every one of the eighteen RC5 capstone oracles is reproduced
// here THROUGH the teaching lab, so a panel and the live grader can never
// drift apart, plus the supporting truth the lessons quote at full precision.
// Source of truth: RC5-TRUTH.md, derived by running the vendored engines.

import { describe, it, expect } from 'vitest';
import * as lab from './simLab.js';

const near = (a, b, tol) => expect(Math.abs(a - b)).toBeLessThanOrEqual(tol);

describe('simLab: Associate capstone oracles', () => {
  it('deck cell count', () => {
    expect(lab.gridSummary().cellCount).toBe(4500);
    expect(lab.gridSummary().nx).toBe(30);
    expect(lab.gridSummary().nz).toBe(5);
  });

  it('crest top depth', () => {
    near(Math.min(...lab.topsFt()), 5055.774278215223, 1e-9);
    near(lab.gridSummary().topMin, 5055.774278215223, 1e-9);
  });

  it('the first layer thickness, from RC4 proportions scaled to the mapped net pay', () => {
    near(lab.gridSummary().layerDzFt[0], 7.411104817049187, 1e-12);
    near(lab.gridSummary().layerDzFt.reduce((a, b) => a + b, 0), 34.585155812896204, 1e-9);
  });

  it('SWOF starts at Swc with zero water mobility', () => {
    const s = lab.satFnTables();
    expect(s.swofFirstSw).toBe(0.35);
    expect(s.swof[0].krw).toBe(0);
    expect(s.swofLastSw).toBe(1);
  });

  it('SGOF closes at 1 - Swc, the SPE1 axis lesson', () => {
    near(lab.satFnTables().sgofLastSg, 0.65, 1e-12);
    expect(lab.satFnTables().sgof[0].krg).toBe(0);
  });

  it('every vertical well connects all five layers', () => {
    const v = lab.verticalWells();
    expect(v).toHaveLength(6);
    v.forEach((w) => expect(w.connectionCount).toBe(5));
  });
});

describe('simLab: Professional capstone oracles', () => {
  it('the deck STOIIP under the Eclipse cell-centre rule', () => {
    near(lab.volumetrics('centre').stoiip_stb, 12132366.897955146, 1e-6);
  });

  it('the gap against the NG5 booking', () => {
    near(lab.volumetrics('centre').gapPct, -0.05635630826191784, 1e-12);
    expect(lab.reconciliation().bookedStoiipStb).toBe(12139208.107496763);
  });

  it('the oil cell count it takes to match that volume', () => {
    expect(lab.volumetrics('centre').oilCells).toBe(266);
    expect(lab.reconciliation().bookedOilCells).toBe(169);
    expect(lab.reconciliation().extraCells).toBe(97);
  });

  it('the depth Ekene-2 inherits, being off the lattice', () => {
    const e2 = lab.wellTops().find((r) => r.well === 'Ekene-2');
    expect(e2.onLattice).toBe(false);
    near(e2.deck_top_m, 1564.3183173003902, 1e-12);
    // Shallower than its mapped 1565 m: the deck samples the nearest cell
    // centre, which sits 50 m north of the well.
    expect(e2.deck_top_m).toBeLessThan(e2.mapped_top_m);
    near(e2.delta_m, -0.6816826996098371, 1e-12);
  });

  it('what the correlation says Bo is at the initial pressure', () => {
    near(lab.pvtDivergence().correlated_bo_at_pi, 1.2292846175634324, 1e-12);
    // The designed line returns exactly 1.2 there. The gap is the lesson.
    expect(lab.pvtTables().boAtPi).toBe(1.2);
    near(lab.pvtTables().boAtPb, 1.21728, 1e-12);
  });

  it('how far the correlation would have moved the solution gas', () => {
    near(lab.pvtDivergence().rs_gap_pct, 5.484806880676496, 1e-12);
    expect(lab.pvtDivergence().designed_rsi).toBe(400);
  });
});

describe('simLab: Expert capstone oracles', () => {
  it('the deviated connection list, re-intersected from the trajectory', () => {
    const d = lab.deviatedPath();
    expect(d.connections).toHaveLength(11);
    expect(d.connections.map((c) => `${c.i},${c.j},${c.k}`))
      .toEqual(lab.deviatedWell().connections.map((c) => `${c.i},${c.j},${c.k}`));
  });

  it('the columns that path crosses', () => {
    expect(lab.deviatedPath().distinctColumns).toBe(8);
    expect(lab.deviatedPath().fromCell).toEqual({ i: 20, j: 19 });
    expect(lab.deviatedPath().toCell).toEqual({ i: 16, j: 22 });
  });

  it('the other clipping convention, against the booking', () => {
    near(lab.volumetrics('tapered').gapPct, 0.7343442164196246, 1e-12);
  });

  it('the history oil total, rebuilt from rates and month lengths', () => {
    near(lab.historySummary().totalOilStb, 176923.83644033302, 1e-6);
    expect(lab.historySummary().periodCount).toBe(36);
  });

  it('the rules the validator refuses', () => {
    expect(lab.validationCases()).toHaveLength(7);
    lab.validationCases().forEach((c) => expect(c.errors.length).toBeGreaterThan(0));
  });

  it('the equilibration datum depth', () => {
    near(lab.datumDepthFt(), 5129.97013005754, 1e-9);
  });
});

describe('simLab: supporting truth the lessons quote', () => {
  it('composes the committed deck', () => {
    expect(lab.deckLines()).toHaveLength(940);
    const sections = lab.deckSections();
    expect(sections.map((s) => s.name)).toEqual(lab.SECTIONS);
    expect(sections.map((s) => s.line)).toEqual([3, 32, 169, 253, 262, 311]);
    sections.forEach((s, i) => { if (i) expect(s.line).toBeGreaterThan(sections[i - 1].line); });
  });

  it('writes one WCONHIST, WCONINJH and DATES block per history period', () => {
    const k = lab.keywordCounts();
    expect(k.WCONHIST).toBe(36);
    expect(k.WCONINJH).toBe(36);
    expect(k.DATES).toBe(36);
    expect(k.TSTEP).toBe(1);
  });

  it('recovers five of the six mapped tops exactly, and names the sixth', () => {
    const tops = lab.wellTops();
    const onLattice = tops.filter((r) => r.onLattice);
    expect(onLattice).toHaveLength(5);
    // Not literally zero: the deck stores tops in FEET, so reading a depth
    // back in metres is a unit round trip. Machine scale, not structure.
    onLattice.forEach((r) => expect(Math.abs(r.delta_m)).toBeLessThan(1e-9));
    expect(tops.filter((r) => !r.onLattice).map((r) => r.well)).toEqual(['Ekene-2']);
  });

  it('puts each well in the cell its map coordinates fall in', () => {
    expect(lab.cellOfFieldXY(1000, 1000)).toEqual({ i: 11, j: 11 });
    expect(lab.cellOfFieldXY(2200, 1150)).toEqual({ i: 23, j: 13 });
    expect(lab.cellCentreFieldM(11, 11)).toEqual({ x: 1000, y: 1000 });
  });

  it('carries RC4 permeabilities into the deck unchanged', () => {
    expect(lab.gridSummary().layerPermxMd).toEqual(lab.EKENE_FLOOD.layers.map((l) => l.k_md));
  });

  it('validates the Ekene spec and refuses a well outside the grid', () => {
    expect(lab.validateSpec(lab.SPEC).ok).toBe(true);
    const v = lab.validateMutated((s) => {
      s.wells = [{ ...s.wells[0], i: s.grid.nx + 5, connections: undefined }];
      return s;
    });
    expect(v.ok).toBe(false);
    expect(v.errors.join(' ')).toMatch(/outside the grid/);
  });

  it('moves the connection list when the trajectory moves', () => {
    const moved = lab.deviatedPath({ from: { x: 1900, y: 1800 }, to: { x: 1900, y: 1800 } });
    expect(moved.distinctColumns).toBe(1);
    expect(moved.connections.length).toBeLessThan(11);
  });

  it('keeps the SPE1 reference spec available as the literature anchor', () => {
    const ref = lab.referenceSpec();
    expect(ref.grid.nx).toBe(10);
    expect(ref.wells.map((w) => w.name)).toEqual(['PROD', 'INJ']);
  });
});
