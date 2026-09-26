// THE EC9 MIRROR GATE: the committed wave inputs against the live wave
// directory, and a STATEMENT when there is no live one.
//
// WHY. The committed copy under tools/course-waves/joa is what every EC9
// suite reads, which is what makes them runnable on a CI runner. It can go
// stale: a digest rebuilt in the wave directory and not mirrored leaves the
// repository pinning numbers nothing produces any more, and every gate stays
// green, because a gate compares the lab against the file it was handed.
//
// THE FAILURE MODE THIS GATE MUST NOT HAVE. A mirror check that does nothing
// when there is no live wave directory is vacuous on exactly the machine that
// matters, the CI runner, where there never is one. So this gate does two
// different jobs and SAYS IN ITS OWN OUTPUT which one it did:
//
//   with a live wave directory     byte-compare every listed input, both ways
//   without one                    assert the committed copy is internally
//                                  whole: present, non-empty, the pinned
//                                  sha256, the section count the wave claims,
//                                  the eighteen graded fields, and every
//                                  graded key spelled by a committed generator
//
// Neither branch can pass by examining nothing: each one asserts a count.
// Nothing here guards a read with existsSync and a return.
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as crypto from 'node:crypto';
import {
  WAVES, waveInput, mirrorDir, liveWaveDir, readingMirror, requireWaveInputs,
} from '../../../../../tools/course-waves/waveInputs.mjs';
import { GRADED_FIELDS } from './gradedTolerance.js';

const WAVE_NAME = 'joa';
const entry = WAVES[WAVE_NAME];
const MIRROR = mirrorDir(WAVE_NAME);
const LIVE = liveWaveDir(WAVE_NAME);
const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');

describe('THE EC9 MIRROR GATE', () => {
  it('the wave is registered with a live directory, an inputs list and pins', () => {
    expect(entry, 'joa is not registered in tools/course-waves/waves.json').toBeTruthy();
    expect(entry.course).toBe('EC9');
    expect(entry.kit).toBe('full');
    expect(entry.inputs.length).toBeGreaterThanOrEqual(16);
    expect(entry.inputs).toContain('digest.txt');
    expect(entry.inputs).toContain('fields.json');
    expect(Object.keys(entry.pins).sort()).toEqual(['digest.txt', 'fields.json']);
    console.log(`[joa mirror] ${entry.inputs.length} committed inputs, 2 pinned by sha256`);
  });

  it('every listed input is present in the committed copy and carries bytes', () => {
    const paths = requireWaveInputs(WAVE_NAME);
    expect(Object.keys(paths).length).toBe(entry.inputs.length);
    Object.entries(paths).forEach(([f, p]) => expect(fs.statSync(p).size, f).toBeGreaterThan(0));
  });

  it('digest.txt and fields.json match the sha256 pinned in waves.json', () => {
    ['digest.txt', 'fields.json'].forEach((f) => {
      expect(sha(path.join(MIRROR, f)), `${f} is not the pinned revision. Re-pin with check-wave-inputs.mjs --update in the same commit.`)
        .toBe(entry.pins[f]);
    });
  });

  it('SAYS WHICH JOB IT DID, so a vacuous run is visible in the output', () => {
    console.log(LIVE
      ? `[joa mirror] a live wave directory is present at ${LIVE}: byte-comparing all ${entry.inputs.length} inputs`
      : `[joa mirror] no live wave directory: asserting the committed copy at ${MIRROR} is internally whole`);
    expect(typeof readingMirror(WAVE_NAME)).toBe('boolean');
  });

  // BRANCH ONE. NOTHING IS SKIPPED HERE. Where a live wave directory exists the
  // test byte-compares every listed input against it; where there is none it
  // ASSERTS that there is none and says so. A skipped test reports success
  // without examining anything, which is the shape this programme keeps paying
  // for, so the absence is an assertion rather than a skip.
  it('the committed copy is byte-identical to the live wave directory, or there is none and it says so', () => {
    if (!LIVE) {
      expect(LIVE).toBeNull();
      console.log('[joa mirror] no live wave directory to compare against, which is the CI case. '
        + 'The committed copy is checked on its own by the three statements below.');
      return;
    }
    const differ = [];
    const absent = [];
    entry.inputs.forEach((f) => {
      const live = path.join(LIVE, f);
      if (!fs.existsSync(live)) { absent.push(f); return; }
      if (sha(live) !== sha(path.join(MIRROR, f))) differ.push(f);
    });
    expect(absent, `listed inputs missing from the live wave directory ${LIVE}`).toEqual([]);
    expect(differ, `the committed copy has drifted from ${LIVE}. Re-mirror and re-pin in the same commit.`).toEqual([]);
    console.log(`[joa mirror] ${entry.inputs.length} inputs byte-identical against ${LIVE}`);
  });

  // BRANCH TWO. Always runs. Everything here is true of the committed copy on
  // its own, so a CI runner with no live wave directory still checks something.
  it('THE STATEMENT WHEN THERE IS NO LIVE COPY: the committed digest is whole and agrees with wave.json', () => {
    const digest = fs.readFileSync(waveInput(WAVE_NAME, 'digest.txt'), 'utf8');
    const wave = JSON.parse(fs.readFileSync(waveInput(WAVE_NAME, 'wave.json'), 'utf8'));
    const headings = digest.match(/^#\s*SECTION\s+\d+[^\n]*/gm) || [];
    const lines = digest.replace(/\n$/, '').split('\n').length;
    expect(headings.length, 'the digest prints too few section headings to be a whole digest').toBeGreaterThanOrEqual(20);
    expect(headings.length, 'wave.json and digest.txt disagree about the section count').toBe(wave.digest.sections);
    expect(lines, 'wave.json and digest.txt disagree about the line count').toBe(wave.digest.lines);
    // the section numbers are contiguous from one, so a missing section is a failure
    const numbers = headings.map((h) => Number(h.match(/SECTION\s+(\d+)/)[1]));
    expect(numbers).toEqual(Array.from({ length: headings.length }, (_, i) => i + 1));
    // THIS ENGINE HAS NO REPAIR HISTORY, so no section may frame itself as one,
    // and every section names an owner module.
    expect(headings.filter((h) => /USED TO|REPAIR HISTORY|NO LONGER/i.test(h))).toEqual([]);
    expect(headings.every((h) => /\(owned by (Associate|Professional|Expert) m\d{2}/.test(h))).toBe(true);
    console.log(`[joa mirror] committed digest: ${lines} lines, ${headings.length} contiguous sections, no history section`);
  });

  it('THE STATEMENT WHEN THERE IS NO LIVE COPY: the committed answer key is eighteen fields that the tolerance derivation spells', () => {
    const fields = JSON.parse(fs.readFileSync(waveInput(WAVE_NAME, 'fields.json'), 'utf8'));
    expect(fields).toHaveLength(18);
    const perTier = fields.reduce((a, f) => ({ ...a, [f[0]]: (a[f[0]] || 0) + 1 }), {});
    expect(perTier).toEqual({ beginner: 6, intermediate: 6, advanced: 6 });
    expect(fields.map((f) => f[1]).sort()).toEqual(GRADED_FIELDS.map((f) => f[1]).sort());
    fields.forEach(([tier, key, value, tol]) => {
      expect(Number.isFinite(value), `${key} is not a finite value`).toBe(true);
      expect(tol, `${key} has a non-positive tolerance`).toBeGreaterThan(0);
      expect(GRADED_FIELDS.find((f) => f[1] === key)[0], `${key} is in the wrong tier`).toBe(tier);
    });
    console.log('[joa mirror] committed answer key: 18 fields, six a tier, every key spelled by gradedTolerance.js');
  });

  it('THE STATEMENT WHEN THERE IS NO LIVE COPY: precision.json classifies every graded field', () => {
    // gradeprecision refuses on partial coverage, and two sibling waves shipped
    // with 3 of 18 and 7 of 18 classified while reading green. The committed
    // precision declaration is checked here so a CI runner proves 18 of 18.
    const precision = JSON.parse(fs.readFileSync(waveInput(WAVE_NAME, 'precision.json'), 'utf8'));
    const fields = JSON.parse(fs.readFileSync(waveInput(WAVE_NAME, 'fields.json'), 'utf8'));
    const covered = fields.filter(([, key]) => Object.values(precision)
      .some((c) => new RegExp(c.match).test(key)));
    expect(covered.length, 'precision.json does not classify every graded field').toBe(fields.length);
    Object.entries(precision).forEach(([cls, c]) => {
      expect(Number.isInteger(c.decimals), cls).toBe(true);
      expect(c.decimals, cls).toBeGreaterThan(0);
    });
    console.log(`[joa mirror] committed precision.json: ${Object.keys(precision).length} quantity `
      + `classes covering ${covered.length} of ${fields.length} graded fields`);
  });

  it('THE STATEMENT WHEN THERE IS NO LIVE COPY: every committed generator that spells a graded field name is present', () => {
    const fields = JSON.parse(fs.readFileSync(waveInput(WAVE_NAME, 'fields.json'), 'utf8'));
    const gens = entry.inputs.filter((f) => f.endsWith('.mjs') || f.endsWith('.py'))
      .map((f) => ({ f, text: fs.readFileSync(path.join(MIRROR, f), 'utf8') }));
    expect(gens.length).toBeGreaterThanOrEqual(6);
    const unspelled = fields.map(([, k]) => k).filter((k) => !gens.some((g) => g.text.includes(k)));
    expect(unspelled, 'a graded field name no committed generator spells').toEqual([]);
    console.log(`[joa mirror] ${gens.length} committed generators spell all ${fields.length} graded field names`);
  });

  it('THE STATEMENT WHEN THERE IS NO LIVE COPY: the committed digest carries none of the eighteen graded answers', () => {
    // The same check gate_capstone_leak.py runs in the wave directory, run here
    // against the COMMITTED pair, so a mirrored digest and a mirrored answer key
    // that drifted apart is a failure on a CI runner too.
    const digest = fs.readFileSync(waveInput(WAVE_NAME, 'digest.txt'), 'utf8');
    const fields = JSON.parse(fs.readFileSync(waveInput(WAVE_NAME, 'fields.json'), 'utf8'));
    const leaks = [];
    fields.forEach(([, key, value]) => {
      [String(value), value.toPrecision(12), value.toPrecision(9), value.toFixed(6), value.toFixed(4)]
        .map((s) => (s.includes('.') ? s.replace(/0+$/, '').replace(/\.$/, '') : s))
        .filter((s) => s.includes('.') && !s.includes('e') && s.length >= 6)
        .forEach((s) => { if (digest.includes(s)) leaks.push(`${key} as ${s}`); });
    });
    expect(leaks, 'the committed digest carries a graded capstone answer').toEqual([]);
    console.log(`[joa mirror] committed digest swept against 18 graded answers at five renderings each, 0 leaks`);
  });
});
