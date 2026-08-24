import { describe, it, expect } from 'vitest';
import { MODEL_SPEC, computeFramework } from '@/lib/earthmodelTeaching';
import { isNull } from '@petrolord/engines/engines/earthmodeling/framework.js';

// Pins the framework-explorer panel math to the live NG10 Beginner capstone oracle.
const NODES = MODEL_SPEC.nx * MODEL_SPEC.ny;
const CELL_AREA = MODEL_SPEC.dx * MODEL_SPEC.dy;

describe('earthmodel framework explorer: engine math', () => {
  const R = computeFramework();

  it('reproduces the NG10 beginner capstone answer key', () => {
    expect(R.s2Stats.mean).toBeCloseTo(1575.5, 6);
    expect(R.clampCounts[2]).toBe(180);
    expect(R.tkA.mean).toBeCloseTo(36, 6);
    expect(R.tkA.max).toBeCloseTo(42, 6);
    expect(R.tkB.mean).toBeCloseTo(10.24, 6);
    expect(R.bulkA / 1e6).toBeCloseTo(45, 6);
  });

  it('resamples every source grid onto one 25 by 20 frame', () => {
    expect(NODES).toBe(500);
    expect(CELL_AREA).toBe(2500);
    // All three surfaces end up fully populated on the model frame.
    for (const surf of R.fw.clamped) {
      expect(surf.filter((v) => !isNull(v))).toHaveLength(NODES);
    }
  });

  it('fixes nodes only on the deepest surface, and exactly 180 of them', () => {
    expect(R.clampCounts).toEqual([0, 0, 180]);
    // Where zone B has pinched out, BaseB has been pulled up onto TopB,
    // so the two surfaces share the same maximum.
    const maxOf = (g) => Math.max(...[...g].filter((v) => !isNull(v)));
    expect(maxOf(R.fw.clamped[2])).toBeCloseTo(maxOf(R.fw.clamped[1]), 9);
  });

  it('has the clamp count equal the pinched-out node count', () => {
    const zeroB = [...R.fw.thickness[1]].filter((v) => !isNull(v) && v <= 0).length;
    expect(zeroB).toBe(180);
    expect(zeroB).toBe(R.clampCounts[2]);
    expect(zeroB / NODES).toBeCloseTo(0.36, 9);
  });

  it('gives the same rock two different mean thicknesses', () => {
    // The course's central point: the denominator is the whole story.
    const present = [...R.fw.thickness[1]].filter((v) => !isNull(v) && v > 0);
    expect(present).toHaveLength(320);
    const meanWherePresent = present.reduce((a, b) => a + b, 0) / present.length;
    expect(meanWherePresent).toBeCloseTo(16, 6);
    expect(R.tkB.mean).toBeCloseTo(10.24, 6);
    // ...but the volume is identical either way.
    expect(meanWherePresent * present.length).toBeCloseTo(R.tkB.mean * NODES, 6);
    expect(meanWherePresent * present.length * CELL_AREA).toBeCloseTo(R.bulkB, 6);
    expect(R.bulkB).toBeCloseTo(12800000, 6);
  });

  it('satisfies the closed-form volume check on both zones', () => {
    expect(R.tkA.mean * NODES * CELL_AREA).toBeCloseTo(R.bulkA, 6);
    expect(R.tkB.mean * NODES * CELL_AREA).toBeCloseTo(R.bulkB, 6);
    expect(R.bulkA).toBeCloseTo(45000000, 6);
    // Zone A is positive everywhere, so it never needed the clamp.
    expect([...R.fw.thickness[0]].filter((v) => !isNull(v) && v > 0)).toHaveLength(NODES);
    expect(R.clampCounts[0] + R.clampCounts[1]).toBe(0);
  });
});
