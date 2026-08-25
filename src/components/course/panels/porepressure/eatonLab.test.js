import { describe, it, expect } from 'vitest';
import {
  computeEatonExplorer, computePrognosis, CAPSTONE_EATON_N,
} from '@/lib/porepressureTeaching';

// DC26 panel math pinned to the LIVE NG9 Professional capstone answer key
// and to the tier's engine-verified teaching facts (TRUTH digest 2026-08-25).

describe('Eaton explorer vs the live Professional capstone key', () => {
  const m = computeEatonExplorer(3.0, 'well', 0.05);

  it('reproduces all six graded values on the well trend at n = 3', () => {
    expect(m.onsetM).toBe(2520);
    expect(m.dtnTd).toBeCloseTo(259.5530276341839, 9);
    expect(m.pp3000Mpa).toBeCloseTo(33.307730125, 9);
    expect(m.ppTdMpa).toBeCloseTo(47.408579625, 9);
    expect(m.opTdMpa).toBeCloseTo(6, 9);
    expect(m.fpTdMpa).toBeCloseTo(76.55157117548856, 9);
  });

  it('matches the untouched capstone driver sample-for-sample at TD', () => {
    const drv = computePrognosis(CAPSTONE_EATON_N);
    expect(m.ppTdMpa * 1e6).toBeCloseTo(drv.ppTdPa, 6);
    expect(m.dtnTd).toBeCloseTo(drv.dtnTd, 12);
  });

  it('closes the loop: recovered overpressure equals the encoded ramp to under 1e-7 Pa', () => {
    expect(m.maxRampErrPa).toBeLessThan(1e-7);
  });

  it('reports the onset the detection rule sees, two samples deep of the ramp top', () => {
    // op at 2510 is a real 0.04 MPa but sits under the 0.05 MPa threshold.
    expect(computeEatonExplorer(3.0, 'well', 0.01).onsetM).toBe(2510);
    expect(computeEatonExplorer(3.0, 'well', 0.2).onsetM).toBe(2550);
  });

  it('carries the ratio structure: op = budget times (1 - r^3) at TD', () => {
    expect(m.ratioTd).toBeCloseTo(0.9580337483265022, 12);
    expect(m.budgetTdMpa * (1 - m.ratioTd ** 3)).toBeCloseTo(6, 9);
    expect(m.budgetTdMpa).toBeCloseTo(49.714487325732826, 9);
  });
});

describe('the trend lever (the tier\'s centrepiece)', () => {
  const f = computeEatonExplorer(3.0, 'fitted', 0.05);

  it('the fitted trend more than doubles the overpressure at TD', () => {
    expect(f.opTdMpa).toBeCloseTo(12.429177480013587, 9);
    expect(f.ppTdMpa).toBeCloseTo(53.83775710501359, 9);
    expect(f.fpTdMpa).toBeCloseTo(78.69463033549309, 9);
  });

  it('and manufactures a spurious onset at 120 m', () => {
    expect(f.onsetM).toBe(120);
  });

  it('so its ramp-recovery QC fails by megapascals, not nanopascals', () => {
    expect(f.maxRampErrPa).toBeGreaterThan(6e6);
  });
});

describe('the exponent amplifies without being linear', () => {
  it('op at TD for n = 1, 2, 4, 5', () => {
    expect(computeEatonExplorer(1.0, 'well').opTdMpa).toBeCloseTo(2.0863306869306193, 9);
    expect(computeEatonExplorer(2.0, 'well').opTdMpa).toBeCloseTo(4.085105895179361, 9);
    expect(computeEatonExplorer(4.0, 'well').opTdMpa).toBeCloseTo(7.834533176889628, 9);
    expect(computeEatonExplorer(5.0, 'well').opTdMpa).toBeCloseTo(9.592077872774526, 9);
  });

  it('each unit of n buys less than the one before', () => {
    const ops = [1, 2, 3, 4, 5].map((n) => computeEatonExplorer(n, 'well').opTdMpa);
    for (let i = 1; i < ops.length; i++) expect(ops[i]).toBeGreaterThan(ops[i - 1]);
    for (let i = 2; i < ops.length; i++) {
      expect(ops[i] - ops[i - 1]).toBeLessThan(ops[i - 1] - ops[i - 2]);
    }
  });
});
