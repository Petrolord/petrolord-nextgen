import { describe, it, expect } from 'vitest';
import {
  computeAdvanced, computeValidationMap, CONTROL_SETS, ALL_SIX, PLUS_SEVEN, E7,
  TEACHING_WELLS, TOP_NAME, CAPSTONE_CELL_M, PAD_CELLS, MAX_EXTRAP_M, TARGET,
} from '@/lib/mappingTeaching';
import { topsToPoints, specForPoints } from '@petrolord/engines/engines/mapping/surface.js';
import { gridSurface } from '@petrolord/engines/lib/gridding/gridding.js';
import { sampleAtXY } from '@petrolord/engines/lib/gridding/gridmath.js';

// Pins the validation-explorer panel math to the live NG7 Expert capstone
// oracle, and to the readings the lessons quote.
const A = computeAdvanced();
const all6 = computeValidationMap(ALL_SIX);
const plus7 = computeValidationMap(PLUS_SEVEN);
const drop = (n) => computeValidationMap(`drop:Ekene-${n}`);

describe('mapping expert: validating the map', () => {
  it('reproduces the NG7 expert capstone answer key', () => {
    expect(A.crossValidatableWells).toBe(1);
    expect(A.looResidE6).toBeCloseTo(9.8438720703125, 12);
    expect(A.predAtE7).toBeCloseTo(1543.3271484375, 12);
    expect(A.blindResidualE7).toBeCloseTo(-5.6728515625, 12);
    expect(A.zminWithE7).toBeCloseTo(1540.70556640625, 12);
    expect(A.liveWithE7).toBe(201);
  });

  it('offers eight control sets', () => {
    expect(CONTROL_SETS).toHaveLength(8);
    expect(CONTROL_SETS[0].key).toBe(ALL_SIX);
    expect(CONTROL_SETS[7].key).toBe(PLUS_SEVEN);
  });

  it('reads the six-well map the tiers below built', () => {
    const s = all6.summary;
    expect(s.nControl).toBe(6);
    expect(s.liveNodes).toBe(201);
    expect(s.crossValidatable).toBe(1);
    expect(s.crest).toBeCloseTo(1539.7181396484375, 12);
    expect(s.deepest).toBe(1590);
    expect(s.mapMean).toBeCloseTo(1550.2667801131063, 12);
    expect(s.atTarget).toBeCloseTo(1542.619873046875, 12);
    expect(s.contourStep).toBe(10);
    expect(s.testedName).toBeNull();
    expect(s.pred).toBeNull();
  });

  it('loses map wherever a control well is removed', () => {
    const live = [1, 2, 3, 4, 5, 6].map((n) => drop(n).summary.liveNodes);
    expect(live).toEqual([144, 130, 183, 133, 155, 201]);
    // Only the interior well leaves the mask untouched.
    expect(drop(6).summary.liveNodes).toBe(all6.summary.liveNodes);
  });

  it('predicts at only one of the six withheld wells', () => {
    const preds = [1, 2, 3, 4, 5, 6].map((n) => drop(n).summary.pred);
    expect(preds.slice(0, 5).every((p) => p === null)).toBe(true);
    const e6 = drop(6).summary;
    expect(e6.testedName).toBe('Ekene-6');
    expect(e6.actual).toBe(1546);
    expect(e6.pred).toBeCloseTo(1555.8438720703125, 12);
    expect(e6.resid).toBeCloseTo(A.looResidE6, 12);
    // A blank prediction is a finding about the control geometry: the
    // five remaining wells no longer enclose the withheld one.
    expect(drop(1).summary.resid).toBeNull();
    expect(e6.nearestControlM).toBeCloseTo(707.1067811865476, 6);
    expect([1, 2, 3, 4, 5, 6].map((n) => drop(n).summary.crossValidatable))
      .toEqual([1, 0, 1, 0, 1, 0]);
  });

  it('runs the blind test at Ekene-7 on the six-well map', () => {
    const s = plus7.summary;
    expect(E7.actual).toBe(1549);
    expect(s.testedName).toBe('Ekene-7');
    expect(s.pred).toBeCloseTo(A.predAtE7, 12);
    expect(s.resid).toBeCloseTo(A.blindResidualE7, 12);
    expect(s.nearestControlM).toBeCloseTo(500, 9);
    // The two residuals carry opposite signs.
    expect(drop(6).summary.resid).toBeGreaterThan(0);
    expect(s.resid).toBeLessThan(0);
  });

  it('changes the map when the new pick joins the control', () => {
    const s = plus7.summary;
    expect(s.nControl).toBe(7);
    expect(s.liveNodes).toBe(201);
    expect(s.crossValidatable).toBe(2);
    expect(s.crest).toBeCloseTo(1540.70556640625, 12);
    expect(s.crest - all6.summary.crest).toBeCloseTo(0.9874267578125, 9);
    expect(s.deepest).toBe(1590);
    expect(s.atTarget).toBeCloseTo(1547.105224609375, 12);
    expect(s.atTarget - all6.summary.atTarget).toBeCloseTo(4.4853515625, 9);
    // A range that shrank by 1 m produced a finer contour interval.
    expect(s.contourStep).toBe(5);
  });

  it('puts the largest change at the new well, equal to the blind residual', () => {
    let maxAbs = 0;
    let sum = 0;
    let n = 0;
    for (let i = 0; i < all6.z.length; i++) {
      const a = all6.z[i];
      const b = plus7.z[i];
      if (!Number.isFinite(a) || !Number.isFinite(b)) continue;
      if (Math.abs(a) >= 1e29 || Math.abs(b) >= 1e29) continue;
      const d = Math.abs(b - a);
      if (d > maxAbs) maxAbs = d;
      sum += d; n += 1;
    }
    expect(n).toBe(201);
    expect(maxAbs).toBeCloseTo(Math.abs(A.blindResidualE7), 9);
    expect(sum / n).toBeCloseTo(1.919145119130908, 9);
  });

  it('gives module 5 its jackknife straight off the P-1 tile', () => {
    const p1 = [1, 2, 3, 4, 5, 6].map((n) => drop(n).summary.atTarget);
    const lo = Math.min(...p1);
    const hi = Math.max(...p1);
    expect(lo).toBeCloseTo(1541.939208984375, 9);   // without Ekene-2
    expect(hi).toBeCloseTo(1549.7083740234375, 9);  // without Ekene-6
    expect(hi - lo).toBeCloseTo(7.7691650390625, 9);
    // The spread predicted the move: the real Ekene-7 pushed P-1 to
    // 1547.11 m, comfortably inside a range available before it was drilled.
    expect(plus7.summary.atTarget).toBeGreaterThan(lo);
    expect(plus7.summary.atTarget).toBeLessThan(hi);
    expect(all6.summary.atTarget).toBeGreaterThan(lo);
    expect(all6.summary.atTarget).toBeLessThan(hi);
  });

  it('keeps the frame fixed, which three of the six subsets would not', () => {
    // The lessons claim the frame discipline is a construction rather than a
    // check: derived once from the full control and reused. Three five-well
    // subsets derive a different frame, and the interior well's does not move,
    // which is why the one cross-validatable run agrees either way.
    const pts = topsToPoints(TEACHING_WELLS, TOP_NAME);
    const shared = specForPoints(pts, CAPSTONE_CELL_M, PAD_CELLS);
    const moved = [];
    for (let i = 0; i < pts.length; i++) {
      const own = specForPoints(pts.filter((_, k) => k !== i), CAPSTONE_CELL_M, PAD_CELLS);
      if (JSON.stringify(own) !== JSON.stringify(shared)) moved.push(TEACHING_WELLS[i].name);
    }
    expect(moved).toEqual(['Ekene-1', 'Ekene-4', 'Ekene-5']);

    // Only the Ekene-1 removal actually moves the prospect reading, because its
    // origin shift takes P-1 off a node and the value is then interpolated.
    const at = (i, spec) => sampleAtXY(
      gridSurface(pts.filter((_, k) => k !== i), spec, { maxExtrapolation: MAX_EXTRAP_M }).z,
      spec, TARGET.x, TARGET.y,
    );
    const own0 = specForPoints(pts.filter((_, k) => k !== 0), CAPSTONE_CELL_M, PAD_CELLS);
    expect(own0.y0).toBe(950);
    expect(at(0, own0) - at(0, shared)).toBeCloseTo(0.0351562, 6);
    for (const i of [3, 4]) {
      const own = specForPoints(pts.filter((_, k) => k !== i), CAPSTONE_CELL_M, PAD_CELLS);
      expect(at(i, own)).toBeCloseTo(at(i, shared), 9);
    }
  });

  it('reproduces the blind residual through the seven-well leave-one-out', () => {
    const pts = topsToPoints(TEACHING_WELLS, TOP_NAME);
    const spec = specForPoints(pts, CAPSTONE_CELL_M, PAD_CELLS);
    const pts7 = [...pts, { x: E7.x, y: E7.y, z: E7.actual }];
    // Removing Ekene-7 from the seven-well set restores the original six, so
    // the prediction there is the same calculation as the blind test.
    const without7 = gridSurface(pts, spec, { maxExtrapolation: MAX_EXTRAP_M }).z;
    expect(sampleAtXY(without7, spec, E7.x, E7.y) - E7.actual)
      .toBeCloseTo(A.blindResidualE7, 12);
    // Ekene-6's residual barely moves once Ekene-7 joins the control.
    const without6 = gridSurface(pts7.filter((p) => !(p.x === 1900 && p.y === 1800)), spec,
      { maxExtrapolation: MAX_EXTRAP_M }).z;
    expect(sampleAtXY(without6, spec, 1900, 1800) - 1546).toBeCloseTo(9.815673828125, 9);
    expect(A.looResidE6 - 9.815673828125).toBeCloseTo(0.028198242, 6);
  });
});
