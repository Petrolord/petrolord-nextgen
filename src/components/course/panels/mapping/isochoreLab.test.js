import { describe, it, expect } from 'vitest';
import {
  computeIntermediate, computeIsochoreMap, CAPSTONE_CELL_M, TARGET,
} from '@/lib/mappingTeaching';

// Pins the isochore-explorer panel math to the live NG6 Professional
// capstone oracle, and to the readings the lessons quote.
const I = computeIntermediate();
const iso = computeIsochoreMap(CAPSTONE_CELL_M, 'ISOCHORE');
const top = computeIsochoreMap(CAPSTONE_CELL_M, 'TOP_SAND');
const base = computeIsochoreMap(CAPSTONE_CELL_M, 'BASE_SAND');

describe('mapping professional: the isochore', () => {
  it('reproduces the NG6 professional capstone answer key', () => {
    expect(I.isoMin).toBeCloseTo(25, 12);
    expect(I.isoMax).toBeCloseTo(35.897705078125, 12);
    expect(I.isoMean).toBeCloseTo(32.25429068038713, 12);
    expect(I.isoLive).toBe(201);
    expect(I.isoAtP1).toBeCloseTo(34.050048828125, 12);
    expect(I.meanWellThickness).toBeCloseTo(31.166666666666668, 12);
  });

  it('reads the same six numbers through the panel', () => {
    const s = iso.summary;
    expect(s.min).toBeCloseTo(I.isoMin, 12);
    expect(s.max).toBeCloseTo(I.isoMax, 12);
    expect(s.mapMean).toBeCloseTo(I.isoMean, 12);
    expect(s.liveNodes).toBe(I.isoLive);
    expect(s.atTarget).toBeCloseTo(I.isoAtP1, 12);
    expect(s.wellMean).toBeCloseTo(I.meanWellThickness, 12);
  });

  it('grids both surfaces on one frame, so the mask is shared', () => {
    expect([iso.spec.nx, iso.spec.ny]).toEqual([25, 20]);
    expect(iso.spec.nx * iso.spec.ny).toBe(500);
    for (const m of [top, base, iso]) expect(m.summary.liveNodes).toBe(201);
    expect(top.summary.min).toBeCloseTo(1539.7181396484375, 12);
    expect(top.summary.max).toBe(1590);
    expect(top.summary.mapMean).toBeCloseTo(1550.2667801131063, 12);
    expect(top.summary.atTarget).toBeCloseTo(1542.619873046875, 12);
    expect(base.summary.min).toBe(1570);
    expect(base.summary.max).toBe(1615);
    expect(base.summary.mapMean).toBeCloseTo(1582.5210707934934, 12);
  });

  it('subtracts means exactly while the extremes do not subtract', () => {
    // The spline is linear in the control values and both surfaces use
    // the same control locations, so the mean does subtract node for node.
    expect(base.summary.mapMean - top.summary.mapMean).toBeCloseTo(iso.summary.mapMean, 9);
    // The extremes sit at different nodes, so they do not.
    expect(base.summary.min - top.summary.min).toBeCloseTo(30.2818603515625, 9);
    expect(iso.summary.min).toBeCloseTo(25, 12);
  });

  it('honours five wells on the isochore and cannot report the sixth', () => {
    const byName = Object.fromEntries(iso.posted.map((p) => [p.name, p]));
    expect(byName['Ekene-1'].value).toBe(32);
    for (const n of ['Ekene-1', 'Ekene-3', 'Ekene-4', 'Ekene-5', 'Ekene-6']) {
      expect(byName[n].mapped).toBeCloseTo(byName[n].value, 9);
    }
    // Ekene-2 sits at (2200,1150), which is not a node of a 100 m frame
    // pinned at y0 800; three of its four bilinear corners are dead.
    expect(byName['Ekene-2'].value).toBe(36);
    expect(byName['Ekene-2'].mapped).toBeNull();
  });

  it('separates the two honest means', () => {
    const s = iso.summary;
    expect(s.mapMinusWell).toBeCloseTo(1.0876240137204611, 12);
    expect(s.nodesAboveWellMean).toBe(146);
    expect(s.liveNodes - s.nodesAboveWellMean).toBe(55);
  });

  it('quantises the contour interval independently of precision', () => {
    expect(iso.summary.contourStep).toBe(2);
    expect(top.summary.contourStep).toBe(10);
  });

  it('holds the thickness at P-1 byte-identical across cell sizes', () => {
    const at = (c) => computeIsochoreMap(c, 'ISOCHORE');
    const c50 = at(50); const c100 = at(100); const c200 = at(200);
    // P-1 lands on a node in all three frames, and a node value IS the fit.
    expect(c50.summary.atTarget).toBe(c100.summary.atTarget);
    expect(c200.summary.atTarget).toBe(c100.summary.atTarget);
    expect(c100.summary.atTarget).toBeCloseTo(34.050048828125, 12);
    expect([c50.summary.liveNodes, c100.summary.liveNodes, c200.summary.liveNodes])
      .toEqual([794, 201, 50]);
    // The 100 m maximum is a node-placement artefact: at 50 m a node
    // lands on Ekene-2 and the map returns its measured 36 m exactly.
    expect(c50.summary.max).toBeCloseTo(36, 9);
    expect(c100.summary.max).toBeCloseTo(35.897705078125, 12);
    expect(c200.summary.min).toBeCloseTo(26.733154296875, 12);
    expect([c50.summary.contourStep, c100.summary.contourStep, c200.summary.contourStep])
      .toEqual([2, 2, 1]);
    // The map-mean gap is a property of the field, not of the grid.
    for (const m of [c50, c100, c200]) {
      expect(m.summary.mapMinusWell).toBeGreaterThan(1.08);
      expect(m.summary.mapMinusWell).toBeLessThan(1.13);
    }
  });

  it('keeps the prospect inside the mapped area', () => {
    expect(TARGET.label).toBe('P-1');
    expect(iso.summary.atTarget).not.toBeNull();
  });
});
