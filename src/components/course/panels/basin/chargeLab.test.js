import { describe, it, expect, beforeAll } from 'vitest';
import {
  computeErosionScenario, retentionCapOf, sourcePotentialMass,
} from '@/lib/basinTeaching';

// Pins the charge panel math to the live NG11 Expert capstone answer key
// and to the teaching facts the DC31 lessons quote: the squeeze identity,
// the forgetful thermometer, and the amount sensitivity.

describe('basin charge explorer: engine math', () => {
  let ref;
  beforeAll(async () => {
    ref = await computeErosionScenario(600);
  });

  it('reproduces the NG11 expert capstone answer key', () => {
    expect(ref.finalRo).toBeCloseTo(1.6718288798752388, 12);
    expect(ref.finalTempC).toBeCloseTo(149.76037539670858, 10);
    expect(ref.finalTr).toBeCloseTo(0.7423743797385286, 12);
    expect(ref.generated).toBeCloseTo(13946.54641524398, 8);
    expect(ref.expelled).toBeCloseTo(10048.985378825158, 8);
    expect(ref.roDelta).toBeCloseTo(0.05665081052235643, 12);
  });

  it('the potential is the closed form 2720 x Hs x TOC/100 x HI/1000', () => {
    expect(sourcePotentialMass()).toBeCloseTo(2720 * 345.33834344581027 * 0.04 * 0.5, 8);
    expect(ref.potentialMass).toBeCloseTo(18786.405883452077, 8);
    // Generated is exactly potential times TR.
    expect(ref.potentialMass * ref.finalTr).toBeCloseTo(ref.generated, 8);
  });

  it('the squeeze identity: expelled was set at 11 Ma as gen minus cap, exactly', () => {
    const b11 = ref.burial.find((b) => b.age === 11);
    const g11 = ref.generation.find((g) => g.age === 11).value;
    expect(b11.top).toBeCloseTo(3128.7948635060234, 8);
    expect(b11.thickness).toBeCloseTo(390.577400265013, 8);
    const cap11 = retentionCapOf(b11);
    expect(cap11).toBeCloseTo(3858.026119789524, 8);
    expect(g11 - cap11).toBe(ref.expelled);
    // The rebound regrows the bucket, and the monotone rule holds the charge.
    const b0 = ref.burial[ref.burial.length - 1];
    expect(retentionCapOf(b0)).toBeCloseTo(4662.34280519763, 8);
    expect(ref.generated - retentionCapOf(b0)).toBeLessThan(ref.expelled);
  });

  it('the thermometer forgets, the reflectance remembers', async () => {
    const base = await computeErosionScenario(0);
    expect(base.roDelta).toBe(0);
    expect(base.finalRo).toBeCloseTo(1.6151780693528823, 12);
    expect(base.expelled).toBeCloseTo(8790.335784168848, 8);
    // Present-day temperatures differ by a ten-thousandth of a degree.
    expect(Math.abs(ref.finalTempC - base.finalTempC)).toBeLessThan(2e-4);
    // Present-day reflectances differ by 57x the graded tolerance.
    expect(ref.finalRo - base.finalRo).toBeGreaterThan(0.05);
    // Three fifths of the event's charge is squeeze, not extra generation.
    const chargeGain = ref.expelled - base.expelled;
    const genGain = ref.generated - base.generated;
    expect(chargeGain).toBeCloseTo(1258.64959465631, 6);
    expect(genGain).toBeCloseTo(493.8678258775017, 6);
    expect((chargeGain - genGain) / chargeGain).toBeCloseTo(0.6076, 3);
  });

  it('the hot decade: deepest and hottest during the phantom, rebound after', () => {
    const deepest = ref.burial.reduce((a, b) => (b.bottom > a.bottom ? b : a));
    expect(deepest.bottom).toBeCloseTo(3519.372263771036, 8);
    expect(deepest.age).toBeGreaterThanOrEqual(11);
    expect(deepest.age).toBeLessThanOrEqual(20);
    const hottest = ref.temperature.reduce((a, b) => (b.value > a.value ? b : a));
    expect(hottest.value).toBeCloseTo(168.51433459340572, 8);
    expect(hottest.age).toBe(18);
    // Present geometry is the input stack, exactly.
    const b0 = ref.burial[ref.burial.length - 1];
    expect(b0.top).toBe(2800);
    expect(b0.bottom).toBe(3200);
  });

  it('amount sensitivity is convex: 300 and 900 m bracket the reference', async () => {
    const a300 = await computeErosionScenario(300);
    const a900 = await computeErosionScenario(900);
    expect(a300.finalRo).toBeCloseTo(1.6295732164506467, 10);
    expect(a900.finalRo).toBeCloseTo(1.7681223140036129, 10);
    expect(a300.expelled).toBeCloseTo(9258.598763497212, 6);
    expect(a900.expelled).toBeCloseTo(11219.679224563748, 6);
    // Signature grows faster than linearly in the amount.
    expect(ref.roDelta / a300.roDelta).toBeGreaterThan(3.5);
    expect(a900.roDelta / ref.roDelta).toBeGreaterThan(2.5);
  });

  it('both monotone diaries only ever rise', () => {
    for (const series of [ref.maturity, ref.expulsion]) {
      for (let i = 1; i < series.length; i++) {
        expect(series[i].value).toBeGreaterThanOrEqual(series[i - 1].value);
      }
    }
  });
});
