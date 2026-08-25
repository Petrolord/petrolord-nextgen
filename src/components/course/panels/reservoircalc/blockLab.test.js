import { describe, it, expect } from 'vitest';
import {
  FAULT_X_M, CAPSTONE_OWC_M, computeBlockModel, computeVolumes,
} from '@/lib/reservoircalcTeaching';

// Pins the block-explorer panel math to the live NG6 Professional capstone
// oracle (reservoircalc/ekene-fault-blocks) and to the teaching facts the
// DC22 lessons state as engine truth.

describe('reservoircalc block explorer: engine math', () => {
  const b = computeBlockModel(FAULT_X_M, CAPSTONE_OWC_M, CAPSTONE_OWC_M);

  it('reproduces the NG6 capstone answer key at the 1800 m fault', () => {
    expect(b.west.cells).toBe(117);
    expect(b.east.cells).toBe(52);
    expect(b.west.grvMm3).toBeCloseTo(18.079852294921874, 9);
    expect(b.east.grvMm3).toBeCloseTo(4.189183349609375, 9);
    expect(b.west.stoiipMmstb).toBeCloseTo(9.85561714769438, 9);
    expect(b.east.stoiipMmstb).toBeCloseTo(2.2835909598023787, 9);
  });

  it('partitions the Associate booking without changing it', () => {
    const field = computeVolumes(CAPSTONE_OWC_M).summary;
    expect(b.west.cells + b.east.cells).toBe(field.oilCells);
    expect(b.total.stoiipMmstb).toBe(field.stoiipMmstb);
    // Cells and gross rock volume add bit for bit; the barrels do not,
    // because zoneVolumes keeps a separate accumulator for the total.
    expect(b.west.grvMm3 + b.east.grvMm3).toBe(field.grvMm3);
    expect(b.sumStoiipMmstb).not.toBe(b.total.stoiipMmstb);
    expect(Math.abs(b.stoiipSumResidual)).toBeLessThan(1e-13);
    expect(b.stoiipSumResidual).toBeCloseTo(-5.329070518200751e-15, 20);
  });

  it('splits area and barrels in different proportions', () => {
    // 69.2 pct of the cells carry 81.2 pct of the barrels: the west block
    // holds the crest, so its mean column is nearly twice the east's.
    expect(b.west.cells / (b.west.cells + b.east.cells)).toBeCloseTo(0.6923076923076923, 12);
    expect(b.west.stoiipMmstb / b.total.stoiipMmstb).toBeCloseTo(0.8118830372145844, 12);
    expect(b.west.meanCol).toBeCloseTo(15.452865209334936, 9);
    expect(b.east.meanCol).toBeCloseTo(8.056121826171875, 9);
    expect(b.west.maxCol).toBeCloseTo(20.2818603515625, 9);
    expect(b.east.maxCol).toBeCloseTo(16.5079345703125, 9);
  });

  it('puts the whole fault column in the east, which is worth real barrels', () => {
    expect(b.faultOnNode).toBe(true);
    expect(b.onFaultColumnCells).toBe(13);
    // The same fault one column further east is the inclusive convention.
    const inclusive = computeBlockModel(FAULT_X_M + 100, CAPSTONE_OWC_M, CAPSTONE_OWC_M);
    expect(inclusive.west.cells).toBe(130);
    expect(inclusive.east.cells).toBe(39);
    expect(inclusive.west.stoiipMmstb - b.west.stoiipMmstb)
      .toBeCloseTo(0.901423070198863, 9);
  });

  it('moves the split monotonically as the fault moves, and mirrors mid field', () => {
    const at = (fx) => computeBlockModel(fx, CAPSTONE_OWC_M, CAPSTONE_OWC_M);
    expect(at(1500).west.cells).toBe(78);
    expect(at(1500).east.cells).toBe(91);
    expect(at(1600).west.cells).toBe(91);
    expect(at(1600).east.cells).toBe(78);
    // No oil cell lies east of 2200 m.
    expect(at(2300).east.cells).toBe(0);
    expect(at(2300).west.stoiipMmstb).toBeCloseTo(12.139208107496763, 9);
  });

  it('books each block against its own contact', () => {
    const shallowEast = computeBlockModel(FAULT_X_M, 1560, 1550);
    expect(shallowEast.west.stoiipMmstb).toBeCloseTo(9.85561714769438, 9);
    expect(shallowEast.east.cells).toBe(18);
    expect(shallowEast.east.stoiipMmstb).toBeCloseTo(0.3278594720205908, 9);
    const deepEast = computeBlockModel(FAULT_X_M, 1560, 1570);
    expect(deepEast.east.cells).toBe(73);
    expect(deepEast.east.stoiipMmstb).toBeCloseTo(5.810976711955219, 9);
    expect(deepEast.west.stoiipMmstb + deepEast.east.stoiipMmstb)
      .toBeCloseTo(15.666593859649598, 9);
  });

  it('assigns three wells to each block, and only one east well found oil', () => {
    const west = b.wells.filter((w) => w.west);
    const east = b.wells.filter((w) => !w.west);
    expect(west.map((w) => w.name)).toEqual(['Ekene-1', 'Ekene-3', 'Ekene-5']);
    expect(east.map((w) => w.name)).toEqual(['Ekene-2', 'Ekene-4', 'Ekene-6']);
    expect(west.every((w) => w.top < CAPSTONE_OWC_M)).toBe(true);
    expect(east.filter((w) => w.top < CAPSTONE_OWC_M).map((w) => w.name)).toEqual(['Ekene-6']);
  });
});
