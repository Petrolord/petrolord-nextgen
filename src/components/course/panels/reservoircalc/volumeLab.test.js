import { describe, it, expect } from 'vitest';
import {
  TEACHING_WELLS, CAPSTONE_OWC_M, PROPS, M3_TO_STB, computeVolumes,
} from '@/lib/reservoircalcTeaching';

// Pins the volume-explorer panel math to the live NG5 capstone oracle.

describe('reservoircalc volume explorer: engine math', () => {
  const v = computeVolumes(CAPSTONE_OWC_M);
  const s = v.summary;

  it('reproduces the NG5 capstone answer key at a 1560 m contact', () => {
    expect(s.oilCells).toBe(169);
    expect(s.maxOilColumn).toBeCloseTo(20.2818603515625, 6);
    expect(s.grvMm3).toBeCloseTo(22.26903564453125, 6);
    expect(s.poreMm3).toBeCloseTo(3.563045809312045, 6);
    expect(s.hcpvMm3).toBeCloseTo(2.3159797972902343, 6);
    expect(s.stoiipMmstb).toBeCloseTo(12.139208107496763, 6);
  });

  it('multiplies out the chain exactly, one constant at a time', () => {
    expect(s.grvMm3 * PROPS.ntg).toBeCloseTo(s.netMm3, 6);
    expect(s.netMm3 * PROPS.phi).toBeCloseTo(s.poreMm3, 6);
    expect(s.poreMm3 * (1 - PROPS.sw)).toBeCloseTo(s.hcpvMm3, 6);
    expect((s.hcpvMm3 / PROPS.bo) * M3_TO_STB).toBeCloseTo(s.stoiipMmstb, 6);
  });

  it('measures the maximum column down from the mapped crest, not from a well', () => {
    // The DC8 crest is spline overshoot: 1.2819 m shallower than any pick.
    const crest = 1539.7181396484375;
    const shallowestPick = Math.min(
      ...TEACHING_WELLS.map((w) => w.tops.find((t) => t.name === 'TOP_SAND').md_m),
    );
    expect(shallowestPick).toBe(1541);
    expect(s.maxOilColumn).toBeCloseTo(CAPSTONE_OWC_M - crest, 9);
    // Booking from the shallowest PICK instead would lose 1.2819 m of column.
    expect(s.maxOilColumn - (CAPSTONE_OWC_M - shallowestPick)).toBeCloseTo(1.2819, 4);
  });

  it('is contact-limited everywhere at the capstone contact', () => {
    // Every oil cell is clipped by the contact, so the column is owc - top
    // and the base surface contributes nothing to this booking.
    const maxThickness = Math.max(...v.oilNodes.map((n) => n.t));
    expect(v.oilNodes).toHaveLength(169);
    expect(maxThickness).toBeCloseTo(s.maxOilColumn, 9);
    // The base crest is deeper than the contact, which is why.
    expect(CAPSTONE_OWC_M).toBeLessThan(1570);
  });

  it('books only part of the mapped area, and leaves two wells dry', () => {
    expect(s.oilCells).toBe(169);
    expect(s.oilCells).toBeLessThan(201); // 201 mapped nodes from the Mapping course
    const dry = TEACHING_WELLS.filter(
      (w) => w.tops.find((t) => t.name === 'TOP_SAND').md_m >= CAPSTONE_OWC_M,
    ).map((w) => w.name);
    expect(dry).toEqual(['Ekene-2', 'Ekene-4']);
  });

  it('moves the volume by a factor of five across the three contact cases', () => {
    const shallow = computeVolumes(1550).summary;
    const deep = computeVolumes(1570).summary;
    expect(shallow.oilCells).toBe(128);
    expect(deep.oilCells).toBe(190);
    expect(shallow.stoiipMmstb).toBeCloseTo(3.835815, 5);
    expect(deep.stoiipMmstb).toBeCloseTo(22.044451, 5);
    // Area and column both grow, so the response is steeper than linear.
    expect(deep.stoiipMmstb / shallow.stoiipMmstb).toBeGreaterThan(5);
    expect(deep.maxOilColumn - s.maxOilColumn).toBeCloseTo(10, 9);
  });
});
