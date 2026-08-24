import { describe, it, expect } from 'vitest';
import {
  TEACHING_WELLS, TOP_NAME, CAPSTONE_CELL_M, TARGET, computeMap,
} from '@/lib/mappingTeaching';

// Pins the map-explorer panel math to the live NG4 capstone oracle.

describe('mapping map explorer: engine math', () => {
  const m = computeMap(CAPSTONE_CELL_M);
  const s = m.summary;

  it('reproduces the NG4 capstone six at a 100 m cell', () => {
    expect(s.nPoints).toBe(6);
    expect(s.nx).toBe(25);
    expect(s.liveNodes).toBe(201);
    expect(s.zMin).toBeCloseTo(1539.7181396484375, 6);
    expect(s.depthAtTarget).toBeCloseTo(1542.619873046875, 6);
    expect(s.contourStep).toBe(10);
  });

  it('maps a crest shallower than any well pick (spline overshoot)', () => {
    const picks = TEACHING_WELLS.map((w) => w.tops.find((t) => t.name === TOP_NAME).md_m);
    const shallowestPick = Math.min(...picks);
    expect(shallowestPick).toBe(1541);
    expect(s.zMin).toBeLessThan(shallowestPick);
    expect(shallowestPick - s.zMin).toBeCloseTo(1.2819, 3);
    // ...while the deepest mapped value is exactly the deepest pick.
    expect(s.zMax).toBe(Math.max(...picks));
    expect(s.zMax).toBe(1590);
  });

  it('leaves most of the frame unmapped by design', () => {
    expect(s.nx * s.ny).toBe(500);
    expect(s.liveNodes).toBe(201);
    expect(s.nx * s.ny - s.liveNodes).toBe(299);
  });

  it('changes node counts with cell size while the surface stays put', () => {
    const fine = computeMap(50).summary;
    const coarse = computeMap(200).summary;
    expect(fine.liveNodes).toBe(794);
    expect(coarse.liveNodes).toBe(50);
    // The crest barely moves: only the sampling of the same surface changed.
    expect(fine.zMin).toBeCloseTo(s.zMin, 1);
    expect(coarse.zMin).toBeCloseTo(s.zMin, 1);
    // And the sampled prospect depth is stable across all three.
    expect(fine.depthAtTarget).toBeCloseTo(s.depthAtTarget, 3);
    expect(coarse.depthAtTarget).toBeCloseTo(s.depthAtTarget, 3);
  });

  it('samples the prospect where there is no well', () => {
    const near = TEACHING_WELLS
      .map((w) => Math.hypot(w.surface_x - TARGET.x, w.surface_y - TARGET.y))
      .sort((a, b) => a - b)[0];
    expect(near).toBeGreaterThan(300);
    expect(Number.isFinite(s.depthAtTarget)).toBe(true);
  });
});
