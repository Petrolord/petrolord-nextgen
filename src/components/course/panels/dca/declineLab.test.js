// Pins the DCA teaching lab to the RC1 truth digest (engine-derived from the
// committed ekene-dynamic goldens). Every capstone value of all three tiers
// is asserted here, so a drift in the vendored engine or fixtures fails the
// build before it can strand a live capstone.

import { describe, it, expect } from 'vitest';
import {
  WELLS, FLOOD_START, ECON_LIMIT_BOPD,
  fitWell, bookFromFit, typeCurvePipeline,
  bLeverageRow, FIELD_TRIANGLE, triangularSummary,
  monthlySnapshotNp, tangentEffectiveAnnual, arpsCum, timeToLimit,
} from './declineLab';

const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-12);

describe('fixture identity', () => {
  it('carries the four producers with their planted truth', () => {
    expect(WELLS.map((w) => w.name)).toEqual(['Ekene-1', 'Ekene-3', 'Ekene-5', 'Ekene-6']);
    expect(WELLS.map((w) => w.planted.model)).toEqual(['exponential', 'hyperbolic', 'harmonic', 'hyperbolic']);
    expect(FLOOD_START).toBe('2023-01-01');
  });
});

describe('Associate capstone values (Fit and book Ekene-1)', () => {
  const { fit, well } = fitWell('Ekene-1', 'Auto-Select', 'primary');
  const book = bookFromFit(fit.parameters, ECON_LIMIT_BOPD, well.start_date);

  it('recovers the planted exponential exactly', () => {
    expect(fit.parameters.modelType).toBe('Exponential');
    expect(rel(fit.parameters.qi, 120)).toBeLessThan(1e-9);
    expect(rel(fit.parameters.Di, 0.0012)).toBeLessThan(1e-9);
    expect(fit.R2).toBeCloseTo(1, 9);
  });
  it('books the graded values', () => {
    expect(rel(book.eur, 91666.6666666667)).toBeLessThan(1e-9);
    expect(rel(book.timeToLimitDays, 2070.75554149)).toBeLessThan(1e-9);
    expect(rel(book.npAtDate, 73157.9366256283)).toBeLessThan(1e-9);
    expect(rel(book.effectiveDeclinePct, 35.4674217142705)).toBeLessThan(1e-9);
  });
});

describe('Professional capstone values', () => {
  it('Ekene-3 primary fit: b on the grid float, EUR booked', () => {
    const { fit } = fitWell('Ekene-3', 'Auto-Select', 'primary');
    expect(fit.parameters.modelType).toBe('Hyperbolic');
    expect(fit.parameters.b).toBeCloseTo(0.5, 12);
    // the RAW grid float, stated in the course
    expect(fit.parameters.b).toBe(0.49999999999999994);
    const book = bookFromFit(fit.parameters, ECON_LIMIT_BOPD);
    expect(rel(book.eur, 111270.166537926)).toBeLessThan(1e-6);
  });
  it('Ekene-6 windowed-to-primary recovers Di 0.001', () => {
    const { fit } = fitWell('Ekene-6', 'Auto-Select', 'primary');
    expect(rel(fit.parameters.Di, 0.001)).toBeLessThan(1e-9);
    expect(fit.parameters.b).toBe(0.35);
  });
  it('Ekene-1 naive full-history fit is the recorded cautionary tale', () => {
    const { fit } = fitWell('Ekene-1', 'Auto-Select', 'full');
    expect(fit.parameters.modelType).toBe('Hyperbolic');
    expect(fit.parameters.b).toBeCloseTo(1.95, 9); // the b-ceiling alarm
    expect(fit.R2).toBeCloseTo(0.818388421218434, 9);
  });
  it('type-curve pipeline: pooled b collapses, applied booking runs 13% low', () => {
    const p = typeCurvePipeline();
    expect(p.tc.b).toBeCloseTo(0.05, 12);
    expect(p.applied.R2).toBeGreaterThan(0.999);
    expect(p.applied.quality).toBe('Good');
    expect(rel(p.eurFixedB, 91524.2759502962)).toBeLessThan(1e-6);
    expect(p.pctOff).toBeCloseTo(-13.0548028121744, 6);
  });
  it('field EUR sum matches the closed forms', () => {
    const sum = WELLS.reduce((s, w) => s + w.closed_form.eur_at_econ_limit_stb, 0);
    expect(rel(sum, 461709.132532792)).toBeLessThan(1e-9);
  });
});

describe('Expert capstone values', () => {
  it('Ekene-5 post-ramp window recovers the designed 0.00035/d exactly', () => {
    const { fit } = fitWell('Ekene-5', 'Auto-Select', 'postRamp');
    expect(fit.parameters.modelType).toBe('Exponential');
    expect(rel(fit.parameters.Di, 0.00035)).toBeLessThan(1e-9);
    expect(fit.R2).toBeCloseTo(1, 9);
  });
  it('b-leverage: b 1.2 books 3.51x the exponential EUR', () => {
    const row = bLeverageRow(1.2);
    expect(rel(row.eur, 321875.914758613)).toBeLessThan(1e-9);
    expect(row.ratioToExponential).toBeCloseTo(3.5113736155485, 9);
  });
  it('field triangle quantiles (closed form, petroleum convention)', () => {
    expect(rel(FIELD_TRIANGLE.mode, 461709.132532792)).toBeLessThan(1e-9);
    const s = triangularSummary();
    expect(rel(s.p90, 420425.025054486)).toBeLessThan(1e-9);
    expect(rel(s.p10, 531360.331525141)).toBeLessThan(1e-9);
    expect(s.fAtMode).toBeCloseTo(0.408545662663958, 12);
  });
  it('Ekene-6 oil declines 3.79x faster than the gross on the same window', () => {
    // The Expert pair: same post-ramp window, one well with no water cut and
    // one whose cut climbs toward 45 percent. An oil decline is not the
    // reservoir's decline. Graded as e6_oil_di (tol 0.00002).
    const { fit } = fitWell('Ekene-6', 'Auto-Select', 'postRamp');
    expect(fit.parameters.modelType).toBe('Exponential');
    expect(rel(fit.parameters.Di, 0.0013275893489185155)).toBeLessThan(1e-12);
    const { fit: f5 } = fitWell('Ekene-5', 'Auto-Select', 'postRamp');
    expect(fit.parameters.Di / f5.parameters.Di).toBeCloseTo(3.793112425481, 9);
  });
});

describe('Professional-tier teaching values (not Expert-graded)', () => {
  it('monthly snapshot overstates Ekene-1 primary Np by 1.838%', () => {
    // Owned by the Professional tier's forecast-mechanics module. It was
    // briefly an Expert capstone field, which graded recall of the tier
    // below; migration 20260827_rc1_dca_expert_capstone_fix.sql removed it.
    const r = monthlySnapshotNp('Ekene-1');
    expect(r.overstatementPct).toBeCloseTo(1.83847495692304, 9);
  });
});

describe('closed forms the lessons hand-work', () => {
  it('Ekene-1 spot values', () => {
    expect(arpsCum('exponential', 120, 0.0012, 0, 365)).toBeCloseTo(35467.4217142705, 6);
    expect(timeToLimit('exponential', 120, 0.0012, 0, 10)).toBeCloseTo(2070.75554149, 6);
    expect(tangentEffectiveAnnual(0.0012)).toBeCloseTo(0.354674217142705, 12);
  });
  it('Ekene-5 harmonic time to limit is exactly 6000 days', () => {
    expect(timeToLimit('harmonic', 100, 0.0015, 1, 10)).toBeCloseTo(6000, 9);
  });
});
