import { describe, it, expect } from 'vitest';
import {
  SAND_IN_SITU, PHI, KMIN, computeSubstitution, computeSubstitutionAt, computeShearEstimate,
} from '@/lib/rockphysicsTeaching';

// Pins the substitution-explorer panel math to the live NG6 Professional
// capstone oracle (rockphysics/goldens) and to the DC24 teaching facts.

describe('rockphysics substitution explorer: engine math', () => {
  const s = computeSubstitution();
  const gas = computeSubstitutionAt(0);

  it('reproduces the NG6 capstone answer key', () => {
    expect(s.mu / 1e9).toBeCloseTo(7.29, 9);
    expect(s.ksatInSitu / 1e9).toBeCloseTo(13.32, 9);
    expect(s.kDry / 1e9).toBeCloseTo(7.350343061720982, 9);
    expect(s.gasCase.vp).toBeCloseTo(2905.6972280296195, 6);
    expect(s.gasCase.rho).toBeCloseTo(2038.7104517793223, 6);
    expect(s.gcVs).toBeCloseTo(1521.197276567149, 6);
  });

  it('gives the first two graded moduli exactly, with no rounding at all', () => {
    // 2250 x 1800^2 and 2250 x 3200^2 - 4/3 mu are exact in binary floating point.
    expect(s.mu).toBe(7.29e9);
    expect(s.ksatInSitu).toBe(13.32e9);
    expect(SAND_IN_SITU.rho * SAND_IN_SITU.vs ** 2).toBe(s.mu);
  });

  it('leaves the shear modulus untouched and therefore raises vs', () => {
    expect(gas.result.mu ?? s.gasCase.mu).toBe(s.mu);
    expect(s.gasCase.vs).toBeCloseTo(1890.9758806113214, 6);
    expect(s.gasCase.vs).toBeGreaterThan(SAND_IN_SITU.vs);
    expect(s.gasCase.vs).toBeCloseTo(Math.sqrt(s.mu / s.gasCase.rho), 9);
    expect(SAND_IN_SITU.vp / SAND_IN_SITU.vs).toBeCloseTo(1.7777777777777777, 12);
    expect(gas.vpvs).toBeCloseTo(1.5366125278606173, 9);
  });

  it('drops the impedance by 17.7 percent', () => {
    expect(gas.impedanceLogged).toBe(7.2e6);
    expect(gas.impedance).toBeCloseTo(5923875.30849019, 4);
    expect(100 * (1 - gas.impedance / gas.impedanceLogged)).toBeCloseTo(17.72395404874737, 8);
  });

  it('round-trips back to the log exactly', () => {
    expect(gas.roundTrip.vp).toBeCloseTo(SAND_IN_SITU.vp, 9);
    expect(gas.roundTrip.vs).toBeCloseTo(SAND_IN_SITU.vs, 9);
    expect(gas.roundTrip.rho).toBeCloseTo(SAND_IN_SITU.rho, 9);
    // and the forward direction reproduces the saturated modulus it came from
    expect(gas.ksatCheck).toBeCloseTo(gas.ksatInSitu, 3);
  });

  it('separates the dry frame from the mineral frame', () => {
    expect(gas.kDry / 1e9).toBeCloseTo(7.350343061720982, 9);
    expect(gas.frame.k / 1e9).toBeCloseTo(30.87940062475596, 9);
    expect(gas.kDry).toBeLessThan(gas.frame.k / 4);
    expect(gas.kDry / gas.ksatInSitu).toBeCloseTo(0.5518275196487224, 6);
    expect(gas.kDry).toBeGreaterThan(gas.mu);
  });

  it('is far more sensitive to porosity than to the mineral modulus', () => {
    const k35 = computeSubstitutionAt(0, PHI, 35e9);
    const k40 = computeSubstitutionAt(0, PHI, 40e9);
    expect(k35.result.vp).toBeCloseTo(2931.3769460289113, 6);
    expect(k40.result.vp).toBeCloseTo(2871.716428512792, 6);
    const p20 = computeSubstitutionAt(0, 0.20, KMIN);
    const p30 = computeSubstitutionAt(0, 0.30, KMIN);
    expect(p20.result.vp).toBeCloseTo(2709.6398569624603, 6);
    expect(p30.result.vp).toBeCloseTo(3033.8186110096503, 6);
    // 0.10 of porosity moves vp four times as far as 5 GPa of K_min does
    expect(p30.result.vp - p20.result.vp).toBeGreaterThan(4 * (k35.result.vp - k40.result.vp));
  });

  it('saturates: the first percent of gas does a third of the work', () => {
    const sw99 = computeSubstitutionAt(0.99);
    const sw95 = computeSubstitutionAt(0.95);
    const sw73 = computeSubstitutionAt(0.73);
    expect(sw99.result.vp).toBeCloseTo(3078.8661575313054, 6);
    expect(sw95.result.vp).toBeCloseTo(2915.2644777573832, 6);
    expect(sw73.result.vp).toBeCloseTo(2830.2791905880454, 6);
    const full = SAND_IN_SITU.vp - sw73.result.vp;
    expect(full).toBeCloseTo(369.72080941195463, 6);
    expect((SAND_IN_SITU.vp - sw99.result.vp) / full).toBeCloseTo(0.3276359874397102, 9);
    expect((SAND_IN_SITU.vp - sw95.result.vp) / full).toBeCloseTo(0.7701365868355963, 9);
  });

  it('is not monotonic in saturation: pure gas is faster than 27 percent gas', () => {
    const sw73 = computeSubstitutionAt(0.73);
    const dry = computeSubstitutionAt(0);
    expect(sw73.result.vp).toBeLessThan(dry.result.vp);
    expect(dry.result.vp - sw73.result.vp).toBeCloseTo(75.41803744157409, 6);
  });

  it('puts oil much nearer brine than gas', () => {
    const o = computeSubstitutionAt(0);
    expect(o.oil.rho).toBeCloseTo(777.0630099023522, 6);
    // live oil substitution, run directly through the same driver inputs
    expect(o.brine.k / o.gas.k).toBeCloseTo(48.41845862000015, 6);
  });

  it('estimates shear, and the logged well shows what the estimate is worth', () => {
    const e = computeShearEstimate(3000);
    expect(e.sand).toBeCloseTo(1556.6, 6);
    expect(e.shale).toBeCloseTo(1441.72, 6);
    expect(e.arith).toBeCloseTo(1522.136, 6);
    expect(e.harm).toBeCloseTo(1520.2585531342977, 6);
    expect(0.5 * (e.arith + e.harm)).toBeCloseTo(e.gc, 9);
    expect(e.gc).toBeCloseTo(1521.197276567149, 6);
    expect(e.mudrock).toBeCloseTo(1413.8999999999996, 6);
    expect(e.gc - e.mudrock).toBeCloseTo(107.29727656714931, 6);
    // the same estimator at the logged velocity, against the measured shear
    expect(e.atLogged).toBeCloseTo(1679.9458454651794, 6);
    expect(e.loggedVs - e.atLogged).toBeCloseTo(120.05415453482057, 6);
  });
});
