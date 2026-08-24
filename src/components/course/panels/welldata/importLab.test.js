import { describe, it, expect } from 'vitest';
import { TEACHING_FILES, computeIntermediate } from '@/lib/welldataTeaching';
import { parseLas } from '@petrolord/engines/engines/welldata/lasParse.js';
import { depthUnitToMetres, prepareLogs, uniformStepM } from '@petrolord/engines/engines/welldata/lasImport.js';

// Pins the import-explorer panel math to the live NG6 Professional capstone oracle.

describe('welldata import explorer: engine math', () => {
  const r = computeIntermediate();

  it('reproduces the NG6 professional capstone answer key', () => {
    expect(r.startMdM).toBeCloseTo(1493.52001953125, 9);
    expect(r.stopMdM).toBeCloseTo(1584.9599609375, 9);
    expect(r.stepM).toBeCloseTo(0.609619140625, 12);
    expect(r.convertedCurves).toBe(2);
    expect(r.recognizedKinds).toBe(4);
    expect(r.irregularUniform).toBe(0);
  });

  it('converts the depth column by exactly 0.3048', () => {
    const feet = TEACHING_FILES.find((f) => f.id === 'feet_20');
    const parsed = parseLas(feet.text);
    expect(parsed.curves[0].unit).toBe('F');
    expect(depthUnitToMetres('F')).toBe(0.3048);
    // The graded values are the float32 forms of the exact hand answers.
    expect(Math.fround(4900 * 0.3048)).toBeCloseTo(r.startMdM, 9);
    expect(Math.fround(5200 * 0.3048)).toBeCloseTo(r.stopMdM, 9);
    // ...and the hand answers still sit far inside the 0.01 tolerance.
    expect(Math.abs(r.startMdM - 1493.52)).toBeLessThan(0.01);
    expect(Math.abs(r.stopMdM - 1584.96)).toBeLessThan(0.01);
  });

  it('converts exactly two curves, and one of them is not the depth', () => {
    const converted = r.logs.filter((l) => l.converted).map((l) => l.mnemonic);
    expect(converted).toEqual(['DEPT', 'DT']);
    // DT converts because its unit carries a length in the denominator.
    const dt = r.logs.find((l) => l.mnemonic === 'DT');
    expect(dt.sourceUnit).toBe('US/F');
    expect(dt.unit).toBe('US/M');
    // The three that carry no length unit pass through untouched.
    for (const m of ['GR', 'RHOB', 'NPHI']) {
      const l = r.logs.find((x) => x.mnemonic === m);
      expect(l.converted).toBeFalsy();
      expect(l.unit).toBe(l.sourceUnit);
    }
  });

  it('recognises four kinds and excludes the index curve from the count', () => {
    const kinds = r.logs.filter((l, i) => i > 0 && l.kind).map((l) => l.kind);
    expect(kinds).toEqual(['gr', 'density', 'neutron', 'sonic']);
    expect(kinds).toHaveLength(4);
    // DEPT does carry a kind, but it is the index so it is not counted.
    expect(r.logs[0].mnemonic).toBe('DEPT');
    expect(r.logs[0].kind).toBe('depth');
    expect(r.recognizedKinds).toBe(4);
  });

  it('reports the FIRST difference as the step, not an average', () => {
    const feet = TEACHING_FILES.find((f) => f.id === 'feet_20');
    const prep = prepareLogs(parseLas(feet.text), { sourceFile: feet.label });
    const d = prep.logs[0].data;
    const first = d[1] - d[0];
    expect(first).toBeCloseTo(0.609619140625, 12);
    expect(uniformStepM(d)).toBeCloseTo(first, 12);
    // Float32 storage makes the differences non-identical...
    const distinct = new Set();
    for (let i = 1; i < d.length; i++) distinct.add(d[i] - d[i - 1]);
    expect(distinct.size).toBeGreaterThan(1);
    // ...but the spread is far inside the test's tolerance, so it passes.
    const spread = Math.max(...distinct) - Math.min(...distinct);
    expect(spread).toBeLessThan(0.01 * first);
    // The average differs from the graded step, which is why it is not used.
    const avg = (d[d.length - 1] - d[0]) / (d.length - 1);
    expect(avg).not.toBeCloseTo(first, 9);
    expect(avg).toBeCloseTo(0.609599609375, 9);
  });

  it('fails the same test on the genuinely irregular well', () => {
    const irr = parseLas(TEACHING_FILES.find((f) => f.id === 'irregular_20').text);
    const d = Array.from(irr.curves[0].data);
    expect(d).toHaveLength(121);
    expect(uniformStepM(d)).toBeNull();
    expect(r.irregularUniform).toBe(0);
    // Its differences really are different sizes, unlike float32 wobble.
    const distinct = [...new Set(d.slice(1).map((v, i) => Number((v - d[i]).toFixed(6))))];
    expect(distinct.length).toBeGreaterThan(2);
    expect(Math.max(...distinct) - Math.min(...distinct)).toBeGreaterThan(0.3);
  });
});
