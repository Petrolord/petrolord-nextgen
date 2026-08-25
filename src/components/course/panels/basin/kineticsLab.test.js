import { describe, it, expect } from 'vitest';
import { computeKineticsExplorer, roCrossing } from '@/lib/basinTeaching';
import { MaturityEngine } from '@petrolord/engines/engines/basin/MaturityEngine.js';
import { EasyRoWeights } from '@petrolord/engines/engines/basin/KerogenLibrary.js';

// Pins the kinetics panel math to the live NG11 Professional capstone
// answer key and to the teaching facts the DC30 lessons quote.

describe('basin kinetics explorer: engine math', () => {
  const m = computeKineticsExplorer(100, 'type2');

  it('reproduces the NG11 professional capstone answer key', () => {
    expect(m.roF0).toBeCloseTo(0.20189651799465538, 12);
    expect(m.roFull).toBeCloseTo(4.687971627022019, 12);
    expect(m.roAt(3, 150)).toBeCloseTo(0.9871413464062039, 12);
    expect(m.roAt(1, 150)).toBeCloseTo(1.1129254516555198, 12);
    expect(m.trAt(10)).toBeCloseTo(0.022481215976523083, 14);
    expect(m.trAt(50)).toBeCloseTo(0.05477927380797565, 14);
  });

  it('anchors are the closed forms exp(-1.6) and exp(-1.6 + 3.7 x 0.85)', () => {
    expect(m.roF0).toBe(Math.exp(-1.6));
    // The engine sums the twenty published weights in floating point,
    // landing within 1e-13 of the hand value exp(1.545).
    expect(m.roFull).toBeCloseTo(Math.exp(-1.6 + 3.7 * 0.85), 12);
    expect(EasyRoWeights.reduce((a, b) => a + b, 0)).toBeCloseTo(0.85, 12);
  });

  it('the slow ramp wins at every temperature, and by 12.74 pct at 150', () => {
    for (const t of [60, 100, 150, 200]) {
      expect(m.roAt(1, t)).toBeGreaterThan(m.roAt(3, t));
      expect(m.roAt(3, t)).toBeGreaterThan(m.roAt(10, t));
    }
    expect(m.roAt(1, 150) / m.roAt(3, 150)).toBeCloseTo(1.1274, 4);
    expect(m.roAt(10, 150)).toBeCloseTo(0.8795791051334334, 12);
  });

  it('a threshold is not a temperature: crossings shift with rate', () => {
    expect(m.crossings(0.5).map((c) => c.t_c)).toEqual([86, 92, 99]);
    expect(m.crossings(1.0).map((c) => c.t_c)).toEqual([144, 151, 159]);
    expect(roCrossing(m.ramps[1], 1.3)).toBe(162);
    expect(roCrossing(m.ramps[10], 1.3)).toBe(177);
  });

  it('the isothermal stall: 5x the time buys 2.44x the conversion', () => {
    expect(m.trAt(100)).toBeCloseTo(0.07419624543388115, 14);
    expect(m.trAt(50) / m.trAt(10)).toBeCloseTo(2.4367, 4);
    expect(m.trAt(100) / m.trAt(50)).toBeCloseTo(1.3545, 4);
  });

  it('kerogen type moves TR by two orders of magnitude and never moves Ro', () => {
    const t1 = computeKineticsExplorer(100, 'type1');
    const t3 = computeKineticsExplorer(100, 'type3');
    expect(t1.trAt(50)).toBeCloseTo(0.12881195813250912, 12);
    expect(t3.trAt(50)).toBeCloseTo(0.0009743781381545968, 14);
    expect(t1.trAt(50) / t3.trAt(50)).toBeGreaterThan(130);
    // The vitrinite clock is untouched by the kerogen selection.
    expect(t1.roAt(3, 150)).toBe(m.roAt(3, 150));
    expect(t3.roAt(1, 150)).toBe(m.roAt(1, 150));
    expect(t3.roF0).toBe(m.roF0);
  });

  it('temperature buys what time cannot: the 10 Ma walk', () => {
    const t120 = computeKineticsExplorer(120, 'type2');
    const t160 = computeKineticsExplorer(160, 'type2');
    expect(t120.trAt(10)).toBeCloseTo(0.11074154468752906, 12);
    expect(t160.trAt(10)).toBeCloseTo(0.5558799719796457, 12);
    // Twenty degrees at 10 Ma outbuys forty extra Ma at 100 degC.
    expect(t120.trAt(10) / m.trAt(10)).toBeGreaterThan(m.trAt(50) / m.trAt(10));
  });

  it('the 46 kcal bin rate landmarks from the lessons', () => {
    const k100 = MaturityEngine.arrheniusRate(1e13, 46, 373.15);
    const k110 = MaturityEngine.arrheniusRate(1e13, 46, 383.15);
    const k150 = MaturityEngine.arrheniusRate(1e13, 46, 423.15);
    expect(k100).toBeCloseTo(1.1411620329306917e-14, 26);
    expect(k110 / k100).toBeCloseTo(5.048799411678268, 10);
    expect(k150 / k100).toBeCloseTo(1526.0957738173342, 6);
  });

  it('ro is monotone along every ramp', () => {
    for (const r of [1, 3, 10]) {
      const ramp = m.ramps[r];
      for (let i = 1; i < ramp.length; i++) {
        expect(ramp[i].ro).toBeGreaterThanOrEqual(ramp[i - 1].ro);
      }
      expect(ramp[0].ro).toBeCloseTo(0.20189651799465538, 12);
      expect(ramp[ramp.length - 1].t_c).toBe(200);
    }
  });
});
