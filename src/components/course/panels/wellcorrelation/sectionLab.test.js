import { describe, it, expect } from 'vitest';
import {
  TEACHING_WELLS, ZONE, computeSection, structuralRelief,
} from '@/lib/correlationTeaching';

// Pins the section-explorer panel math to the live NG2 capstone oracle.
// If any of these drift, the teaching panel would let a learner produce
// readings the grader rejects.

const CAPSTONE_DATUM = { mode: 'flatten', topName: 'TOP_SAND', datumM: 1500 };

describe('well correlation section explorer: engine math', () => {
  const section = computeSection(CAPSTONE_DATUM);
  const byName = Object.fromEntries(section.rows.map((r) => [r.name, r]));

  it('reproduces the NG2 capstone six under the TOP_SAND 1500 m datum', () => {
    expect(byName['Ekene-2'].shift).toBe(-65);
    expect(byName['Ekene-3'].thickness).toBe(29);
    expect(byName['Ekene-4'].tops.find((t) => t.name === 'BASE_SAND').displayed).toBe(1525);
    expect(structuralRelief('TOP_SAND')).toBe(49);
    expect(section.polylines.find((p) => p.name === 'TOP_B').points).toHaveLength(3);
    expect(byName['Ekene-1'].tops.find((t) => t.name === 'TOP_B').displayed).toBe(1592);
  });

  it('pins the datum top to the datum in every well and preserves thickness', () => {
    for (const r of section.rows) {
      expect(r.tops.find((t) => t.name === ZONE.top).displayed).toBe(1500);
    }
    const structural = computeSection({ mode: 'structural' });
    const thickStructural = structural.rows.map((r) => r.thickness);
    expect(section.rows.map((r) => r.thickness)).toEqual(thickStructural);
    expect(thickStructural).toEqual([32, 36, 29, 25]);
  });

  it('reports the structural view at true depth with a 167 m span', () => {
    const structural = computeSection({ mode: 'structural' });
    expect(structural.rows.every((r) => r.shift === 0)).toBe(true);
    expect(structural.range).toEqual([1495, 1662]);
    expect(structural.range[1] - structural.range[0]).toBe(167);
  });

  it('skips wells missing a top rather than inventing a pick', () => {
    const w4 = TEACHING_WELLS.find((w) => w.name === 'Ekene-4');
    expect(w4.tops.some((t) => t.name === 'TOP_B')).toBe(false);
    const topB = section.polylines.find((p) => p.name === 'TOP_B');
    expect(topB.points.map((p) => p.wellId)).toEqual(['W1', 'W2', 'W3']);
  });

  it('matches the Professional TOP_A 1450 m datum shifts', () => {
    const pro = computeSection({ mode: 'flatten', topName: 'TOP_A', datumM: 1450 });
    expect(pro.rows.map((r) => r.shift)).toEqual([-50, -62, -45, -80]);
    expect(pro.range[1] - pro.range[0]).toBe(150);
  });
});
