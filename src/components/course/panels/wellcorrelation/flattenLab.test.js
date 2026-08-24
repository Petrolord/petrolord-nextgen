import { describe, it, expect } from 'vitest';
import {
  TEACHING_WELLS, INTERMEDIATE_DATUM, computeIntermediate, computeAdvanced, structuralRelief,
} from '@/lib/correlationTeaching';

const pick = (id, name) => TEACHING_WELLS.find((w) => w.id === id).tops.find((t) => t.name === name)?.md_m ?? null;

// Pins the two wellcorrelation panels to the live NG6 Professional and
// NG7 Expert capstone oracles.
describe('wellcorrelation professional: flattening and growth', () => {
  const I = computeIntermediate();
  const row = (id) => I.rows.find((r) => r.id === id);

  it('reproduces the NG6 professional capstone answer key', () => {
    expect(row('W4').shift).toBe(-80);
    expect(row('W2').sandDisplayed).toBe(1503);
    expect(row('W4').aToSand).toBe(60);
    expect(I.growthRange).toBe(14);
    expect(I.wellsWithAllTops).toBe(3);
    expect(I.displayedSpan).toBe(150);
  });

  it('makes every shift a single subtraction from the datum', () => {
    expect(INTERMEDIATE_DATUM).toEqual({ topName: 'TOP_A', datumM: 1450 });
    for (const r of I.rows) {
      expect(r.shift).toBe(INTERMEDIATE_DATUM.datumM - pick(r.id, 'TOP_A'));
      // Every TOP_A is deeper than the datum here, so every well moves up.
      expect(r.shift).toBeLessThan(0);
    }
    expect(I.rows.map((r) => r.shift)).toEqual([-50, -62, -45, -80]);
  });

  it('lands every flattening top exactly on the datum', () => {
    for (const r of I.rows) {
      expect(pick(r.id, 'TOP_A') + r.shift).toBe(INTERMEDIATE_DATUM.datumM);
    }
  });

  it('leaves intervals unchanged by the shift', () => {
    // Both ends of an interval carry the same shift, so growth is real.
    for (const r of I.rows) {
      const raw = pick(r.id, 'TOP_SAND') - pick(r.id, 'TOP_A');
      expect(r.aToSand).toBe(raw);
    }
    expect(I.rows.map((r) => r.aToSand)).toEqual([48, 53, 46, 60]);
    expect(I.growthRange).toBe(60 - 46);
  });

  it('spans from the datum to the deepest displayed pick', () => {
    const displayed = I.rows.flatMap((r) => {
      const w = TEACHING_WELLS.find((x) => x.id === r.id);
      return w.tops.map((t) => t.md_m + r.shift);
    });
    expect(Math.min(...displayed)).toBe(INTERMEDIATE_DATUM.datumM);
    expect(Math.max(...displayed)).toBe(1600);
    expect(I.displayedSpan).toBe(150);
    // The deepest displayed pick is Ekene-2's TOP_B, not the deepest raw one.
    expect(pick('W2', 'TOP_B') + row('W2').shift).toBe(1600);
    expect(pick('W2', 'TOP_B')).toBeLessThan(pick('W4', 'TOP_A') + 150);
  });

  it('counts three wells with all four tops', () => {
    expect(I.wellsWithAllTops).toBe(3);
    expect(row('W4').allFourTops).toBe(false);
    expect(pick('W4', 'TOP_B')).toBeNull();
  });
});

describe('wellcorrelation expert: predicting the missing pick', () => {
  const A = computeAdvanced();

  it('reproduces the NG7 expert capstone answer key', () => {
    expect(A.aToBMean).toBe(141);
    expect(A.sandToBMean).toBe(92);
    expect(A.w4TopBLayercake).toBe(1671);
    expect(A.w4TopBFromSand).toBe(1682);
    expect(A.predictionSpread).toBe(11);
    expect(A.topBRelief).toBe(34);
  });

  it('averages only the three wells that carry TOP_B', () => {
    expect(A.rows).toHaveLength(3);
    expect(A.rows.map((r) => r.aToB)).toEqual([140, 150, 133]);
    expect(A.rows.map((r) => r.sandToB)).toEqual([92, 97, 87]);
    expect((140 + 150 + 133) / 3).toBe(A.aToBMean);
    expect((92 + 97 + 87) / 3).toBe(A.sandToBMean);
  });

  it('projects each estimate from a marker Ekene-4 actually has', () => {
    expect(pick('W4', 'TOP_A') + A.aToBMean).toBe(A.w4TopBLayercake);
    expect(pick('W4', 'TOP_SAND') + A.sandToBMean).toBe(A.w4TopBFromSand);
    // The from-SAND projection is the shorter extrapolation.
    expect(A.sandToBMean).toBeLessThan(A.aToBMean);
  });

  it('makes the spread the measured uncertainty, not a rounding', () => {
    expect(A.w4TopBFromSand - A.w4TopBLayercake).toBe(A.predictionSpread);
    expect(A.predictionSpread).toBe(11);
    // The two disagree BECAUSE the section grows. Ekene-4 carries the
    // thickest A-to-SAND interval in the section.
    const I = computeIntermediate();
    expect(Math.max(...I.rows.map((r) => r.aToSand))).toBe(I.rows.find((r) => r.id === 'W4').aToSand);
    expect(I.growthRange).toBeGreaterThan(0);
  });

  it('makes the spread exactly the target well\'s excess thickness', () => {
    // Not an approximation. The two predictions differ by precisely how
    // much Ekene-4's A-to-SAND departs from the carriers' mean, because
    // (SAND_4 + meanSandToB) - (A_4 + meanAToB) reduces to
    // (SAND_4 - A_4) - (meanAToB - meanSandToB).
    const carriers = TEACHING_WELLS.filter((w) => pick(w.id, 'TOP_B') != null);
    const carrierMeanASand = carriers
      .reduce((s, w) => s + (pick(w.id, 'TOP_SAND') - pick(w.id, 'TOP_A')), 0) / carriers.length;
    expect(carrierMeanASand).toBe(49);
    // The difference of the two graded means IS that carrier mean.
    expect(A.aToBMean - A.sandToBMean).toBe(carrierMeanASand);
    const targetASand = pick('W4', 'TOP_SAND') - pick('W4', 'TOP_A');
    expect(targetASand).toBe(60);
    expect(targetASand - carrierMeanASand).toBe(A.predictionSpread);
    expect(A.predictionSpread).toBe(11);
  });

  it('keeps relief and prediction spread as different quantities', () => {
    expect(A.topBRelief).toBe(structuralRelief('TOP_B'));
    expect(A.topBRelief).toBe(1662 - 1628);
    expect(A.topBRelief).not.toBe(A.predictionSpread);
    // Relief is a structural spread across wells; the prediction spread
    // is disagreement between two methods on one well.
    expect(A.topBRelief).toBeGreaterThan(A.predictionSpread);
  });
});
