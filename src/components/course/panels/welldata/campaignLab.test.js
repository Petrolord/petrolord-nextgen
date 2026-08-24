import { describe, it, expect } from 'vitest';
import { TEACHING_FILES, computeAdvanced } from '@/lib/welldataTeaching';
import { parseLas } from '@petrolord/engines/engines/welldata/lasParse.js';

// Pins the campaign-explorer panel math to the live NG7 Expert capstone oracle.
const A = computeAdvanced();
const fileOf = (id) => TEACHING_FILES.find((f) => f.id === id);

describe('welldata expert: the six-file campaign', () => {
  it('reproduces the NG7 expert capstone answer key', () => {
    expect(A.campaignCurves).toBe(24);
    expect(A.convertedFiles).toBe(1);
    expect(A.deadCurves).toBe(1);
    expect(A.uniformFiles).toBe(5);
    expect(A.wrappedSamples).toBe(161);
    expect(A.nullheavyNulls).toBe(272);
  });

  it('totals 24 because every file contributes four once depth is excluded', () => {
    expect(A.perFile).toHaveLength(6);
    for (const f of A.perFile) expect(f.curves).toBe(4);
    expect(A.perFile.reduce((s, f) => s + f.curves, 0)).toBe(A.campaignCurves);
    expect(6 * 4).toBe(24);
  });

  it('finds exactly one exception in each of three campaign fields', () => {
    const converted = A.perFile.filter((f) => f.converted).map((f) => f.id);
    const notUniform = A.perFile.filter((f) => !f.uniform).map((f) => f.id);
    const withDead = A.perFile.filter((f) => f.dead > 0).map((f) => f.id);
    expect(converted).toEqual(['feet_20']);
    expect(notUniform).toEqual(['irregular_20']);
    expect(withDead).toEqual(['nullheavy_20']);
    // The uniform field counts the files that PASS, not the one that fails.
    expect(A.uniformFiles).toBe(A.perFile.length - notUniform.length);
    expect(A.uniformFiles).toBe(5);
  });

  it('hides two different findings inside the 272', () => {
    const parsed = parseLas(fileOf('nullheavy_20').text);
    const rows = [];
    for (let i = 1; i < parsed.curves.length; i++) {
      const c = parsed.curves[i];
      let finite = 0;
      for (const v of c.data) if (Number.isFinite(v)) finite += 1;
      rows.push({ m: c.mnemonic, nulls: c.data.length - finite, n: c.data.length, dead: finite === 0 });
    }
    expect(rows.map((r) => [r.m, r.nulls])).toEqual([
      ['GR', 71], ['RHOB', 0], ['NPHI', 201], ['DT', 0],
    ]);
    expect(rows.reduce((s, r) => s + r.nulls, 0)).toBe(A.nullheavyNulls);
    // 201 of the 272 are one curve that is entirely absent.
    const dead = rows.filter((r) => r.dead);
    expect(dead).toHaveLength(1);
    expect(dead[0].m).toBe('NPHI');
    expect(dead[0].nulls).toBe(dead[0].n);
    expect(dead[0].nulls).toBe(201);
    // ...leaving only 71 scattered nulls in a curve that does have data.
    expect(A.nullheavyNulls - dead[0].nulls).toBe(71);
    // So the dead-curve count and the null count are NOT independent.
    expect(A.deadCurves).toBe(1);
    expect(parsed.nullValue).toBe(-9999);
  });

  it('parses the wrapped file by flatten and reshape, not by wrap logic', () => {
    const raw = fileOf('wrapped_12').text;
    const parsed = parseLas(raw);
    expect(parsed.version).toBe(1.2);
    expect(parsed.wrap).toBe('YES');
    expect(parsed.curves).toHaveLength(5);
    const aIdx = raw.toUpperCase().indexOf('~A');
    const block = raw.slice(raw.indexOf('\n', aIdx) + 1);
    const tokens = block.split(/\s+/).filter(Boolean);
    expect(tokens).toHaveLength(805);
    // 805 tokens over 5 curves gives the graded 161 samples.
    expect(tokens.length / parsed.curves.length).toBe(161);
    expect(parsed.curves[0].data).toHaveLength(A.wrappedSamples);
    // Each depth step spans three physical lines, which the parser never
    // needs to know because it flattens first.
    const lines = block.trim().split(/\n/);
    expect(lines).toHaveLength(483);
    expect(lines.length / A.wrappedSamples).toBe(3);
  });

  it('leaves every campaign field a count with no tolerance to hide in', () => {
    for (const v of [A.campaignCurves, A.convertedFiles, A.deadCurves,
      A.uniformFiles, A.wrappedSamples, A.nullheavyNulls]) {
      expect(Number.isInteger(v)).toBe(true);
    }
  });
});
