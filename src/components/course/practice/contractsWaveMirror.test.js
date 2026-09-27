// THE SC5 MIRROR GATE: the committed practice kit against the live wave
// directory, and a STATEMENT when there is no live one (the CI runner).
//
// A practice course has no engine digest and no graded fields; its teaching
// truth is PACK.md, built from passages.json and sources/SOURCES.json, and
// those three are pinned in waves.json. With a live wave directory every
// listed input is byte-compared both ways; without one, the committed copy is
// asserted whole: present, pinned, 22 pack sections, every passage printed,
// and no fields.json or digest.txt. Neither branch passes by examining
// nothing: each asserts a count.
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as crypto from 'node:crypto';
import { WAVES, mirrorDir, liveWaveDir, requireWaveInputs } from '../../../../tools/course-waves/waveInputs.mjs';

const WAVE_NAME = 'contracts';
const entry = WAVES[WAVE_NAME];
const MIRROR = mirrorDir(WAVE_NAME);
const LIVE = liveWaveDir(WAVE_NAME);
const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const PINNED = ['PACK.md', 'passages.json', 'sources/SOURCES.json'];

describe('THE SC5 MIRROR GATE', () => {
  it('is registered as a practice kit with its pack pinned', () => {
    expect(entry.course).toBe('SC5');
    expect(entry.kit).toBe('practice');
    expect(Object.keys(entry.pins).sort()).toEqual([...PINNED].sort());
    expect(entry.inputs).not.toContain('digest.txt');
    expect(entry.inputs).not.toContain('fields.json');
    expect(entry.inputs.filter((f) => f.startsWith('banks/'))).toHaveLength(21);
  });

  it('every listed input is committed and carries bytes, and the pins hold', () => {
    const paths = requireWaveInputs(WAVE_NAME);
    expect(Object.keys(paths).length).toBe(entry.inputs.length);
    Object.entries(paths).forEach(([f, p]) => expect(fs.statSync(p).size, f).toBeGreaterThan(0));
    PINNED.forEach((f) => expect(sha(path.join(MIRROR, f)), f).toBe(entry.pins[f]));
    expect(fs.existsSync(path.join(MIRROR, 'fields.json'))).toBe(false);
    expect(fs.existsSync(path.join(MIRROR, 'digest.txt'))).toBe(false);
  });

  it('the pack prints every passage under its sections', () => {
    const pack = fs.readFileSync(path.join(MIRROR, 'PACK.md'), 'utf8');
    const passages = JSON.parse(fs.readFileSync(path.join(MIRROR, 'passages.json'), 'utf8')).passages;
    expect(pack.match(/^# SECTION \d+: /gm)).toHaveLength(22);
    const printed = new Set(pack.match(/^\[P\d{3}\]/gm).map((x) => x.slice(1, -1)));
    expect(printed.size).toBe(passages.length);
    passages.forEach((p) => expect(printed.has(p.id), p.id).toBe(true));
  });

  it('the committed copy is the live wave, byte for byte, or there is none and it says so', () => {
    if (!LIVE) {
      console.log(`[contracts mirror] no live wave directory: the committed copy of ${entry.inputs.length} inputs was checked whole`);
      expect(entry.inputs.length).toBeGreaterThan(40);
      return;
    }
    const differ = entry.inputs.filter((f) => !fs.existsSync(path.join(LIVE, f))
      || !fs.readFileSync(path.join(LIVE, f)).equals(fs.readFileSync(path.join(MIRROR, f))));
    console.log(`[contracts mirror] ${entry.inputs.length} inputs compared with ${LIVE}: ${differ.length} differ`);
    expect(differ).toEqual([]);
  });
});
