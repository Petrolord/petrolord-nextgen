import { describe, it, expect } from 'vitest';
import { computeTieDetail, WELLS } from '@/lib/earthmodelTeaching';

// Pins the DC28 Professional panel math to the LIVE intermediate capstone
// answer key and to the tier's sharpest engine-verified teaching facts.

describe('tie explorer math (DC28)', () => {
  const w2 = computeTieDetail('W2');
  const row = (m, top) => m.rows.find((r) => r.top === top);

  it('reproduces the six graded capstone values', () => {
    expect(row(w2, 'TopA').tvdss).toBeCloseTo(1496.6634373420557, 9);
    expect(row(w2, 'TopB').residualM).toBeCloseTo(8.318351595797822, 9);
    expect(w2.worstAll.well).toBe('W2');
    expect(w2.worstAll.top).toBe('BaseB');
    expect(w2.worstAll.residualM).toBeCloseTo(45.02816332199586, 9);
    expect(w2.cp.x).toBeCloseTo(1610.8719179395334, 9);
    const w1 = computeTieDetail('W1');
    expect(row(w1, 'BaseB').residualM).toBeCloseTo(5, 12);
    const w3 = computeTieDetail('W3');
    expect(row(w3, 'TopA').residualM).toBeCloseTo(1, 12);
  });

  it('vertical wells tie with exact hand arithmetic: tvdss = md - kb', () => {
    for (const name of ['W1', 'W3', 'W4']) {
      const m = computeTieDetail(name);
      const w = WELLS.find((x) => x.name === name);
      for (const r of m.rows) {
        const top = w.tops.find((t) => t.name === r.top);
        expect(r.tvdss).toBeCloseTo(top.md_m - w.kb_m, 12);
      }
    }
  });

  it('the BaseB column is a zone ledger: res(BaseB) - res(TopB) = missing zone B', () => {
    // W3 and W4 are VERTICAL, yet carry 37 and 36 m BaseB residuals: the
    // model's zone B is clamped to zero thickness there while each well
    // logs 30 m of it.
    const w3 = computeTieDetail('W3');
    const w4 = computeTieDetail('W4');
    expect(row(w3, 'BaseB').residualM - row(w3, 'TopB').residualM).toBeCloseTo(30, 9);
    expect(row(w4, 'BaseB').residualM - row(w4, 'TopB').residualM).toBeCloseTo(30, 9);
    // W1's model zone B is 27 m against 30 m logged: ledger says +3.
    const w1 = computeTieDetail('W1');
    expect(row(w1, 'BaseB').residualM - row(w1, 'TopB').residualM).toBeCloseTo(3, 9);
  });

  it('the vertical assumption flips the sign of W2 TopA and inflates BaseB to 157', () => {
    const v = computeTieDetail('W2', true);
    expect(row(w2, 'TopA').residualM).toBeCloseTo(-35.75883821136131, 9);
    expect(row(v, 'TopA').residualM).toBeCloseTo(26, 9);
    expect(row(v, 'TopB').residualM).toBeCloseTo(112, 9);
    expect(row(v, 'BaseB').residualM).toBeCloseTo(157, 9);
    // and it drags the zone-A control point back to the wellhead
    expect(v.cp.x).toBeCloseTo(1400, 9);
    expect(v.cp.w).toBe(120); // the MD weight does not change
  });

  it('W2 build mechanics: the arc is shorter both ways than the hole', () => {
    // Station md 1500: dx 111.877, dz 270.095 over 300 m of hole.
    const st1500 = w2.path.find((p) => p.md === 1500);
    expect(st1500.x).toBeCloseTo(1511.876968573417, 9);
    expect(st1500.tvdss).toBeCloseTo(1440.0948948471319, 9);
    // Deepest pick lands 295.72 m east of the head.
    expect(row(w2, 'BaseB').lateralM).toBeCloseTo(295.72473168191937, 9);
    expect(row(w2, 'BaseB').x).toBeCloseTo(1695.7247316819194, 9);
  });

  it('every pick in the golden set lands on a live surface sample', () => {
    for (const name of ['W1', 'W2', 'W3', 'W4']) {
      const m = computeTieDetail(name);
      for (const r of m.rows) expect(r.residualM).not.toBeNull();
    }
  });

  it('the section window carries all three surfaces for drawing', () => {
    expect(w2.section.length).toBe(41);
    const mid = w2.section[20];
    expect(mid.topA).toBeLessThan(mid.topB);
    expect(mid.topB).toBeLessThanOrEqual(mid.baseB);
  });
});
