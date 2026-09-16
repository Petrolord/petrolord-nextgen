// A PANEL MAY NOT PRINT A GRADED CAPSTONE ANSWER, IN EITHER SHAPE.
//
// THE HOLE THIS CLOSES, found on 2026-09-16. The FC1-style guard rendered each
// graded value ONE way, `Number.prototype.toPrecision(9)` with trailing zeros
// stripped, and grepped the panel sources for that string. A panel printing the
// same value at FULL FLOAT PRECISION walks straight past it: the string
// "182.97142857142856" does not contain "182.971429", so the grep finds nothing
// and the only thing left looking is the lab's numeric sweep, on a wave that has
// one and runs it. FC6 prints film coefficients, Reynolds numbers and five
// resistances, so a number copied out of a console into a panel is a live risk
// here rather than a theoretical one.
//
// This guard renders every graded answer THREE ways, from the ONE derivation the
// grader and the generator also read, and it is proven with BOTH PLANTS below.
//
// IT ALSO NEVER EMPTIES ITSELF. The file list it sweeps is asserted, so a rename
// or a deletion fails instead of quietly reducing the sweep to nothing, and the
// wave inputs are read through tools/course-waves/waveInputs.mjs, which THROWS
// and names the file when an input is missing. No existsSync, no return, no
// skipIf: a gate that empties itself when its subject is missing reports success
// without examining anything, which is this programme's most repeated defect.
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GRADED_FIELDS, gradedRenderings, gradedClassOf, gradedTolerance } from './gradedTolerance.js';
import { waveInput } from '../../../../../tools/course-waves/waveInputs.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const WAVE_NAME = 'heattransfer';
const FIELDS_JSON = waveInput(WAVE_NAME, 'fields.json');
const FIELDS = JSON.parse(fs.readFileSync(FIELDS_JSON, 'utf8'));

/**
 * The sources this guard sweeps. Every non-test file in the panel directory,
 * plus the course learning page when it exists. THE LIST IS ASSERTED below, so a
 * panel added without adding it here fails, and a panel renamed away fails too.
 */
const EXPECTED_FILES = ['gradedTolerance.js'];
const sources = fs
  .readdirSync(HERE)
  .filter((f) => (f.endsWith('.js') || f.endsWith('.jsx')) && !f.includes('.test.'))
  .map((f) => ({ file: f, text: fs.readFileSync(path.join(HERE, f), 'utf8') }));

/** Every rendering of every graded answer, from the one derivation. */
const allRenderings = () => FIELDS.flatMap(([, key, value]) => {
  const { cls } = gradedClassOf(key);
  return gradedRenderings(value, cls).map((s) => ({ key, s }));
});

/** The shape a leak takes: which graded strings a text prints. */
const printedIn = (text) => allRenderings().filter(({ s }) => text.includes(s));

describe('THE PANEL GUARD: no panel may print a graded capstone answer', () => {
  it('the wave inputs are present and carry the eighteen graded fields', () => {
    expect(FIELDS).toHaveLength(18);
    FIELDS.forEach(([tier, key, value, tol]) => {
      expect(typeof tier).toBe('string');
      expect(typeof key).toBe('string');
      expect(Number.isFinite(value)).toBe(true);
      expect(tol).toBeGreaterThan(0);
    });
  });

  it('fields.json and the ONE tolerance derivation agree on every tolerance', () => {
    // The lab, the generator and the grader all read the same derivation, so a
    // third copy cannot appear without this failing. FC2 and FC3 each shipped one.
    expect(GRADED_FIELDS).toHaveLength(18);
    FIELDS.forEach(([tier, key, , tol]) => {
      expect(gradedClassOf(key).tier, `${key} is in the wrong tier`).toBe(tier);
      expect(tol, `${key} is graded at a tolerance the derivation does not produce`).toBe(gradedTolerance(key));
    });
  });

  it('there are sources to sweep, so a rename cannot silently empty this gate', () => {
    expect(sources.map((s) => s.file).sort()).toEqual([...EXPECTED_FILES].sort());
    sources.forEach((s) => expect(s.text.length, s.file).toBeGreaterThan(200));
  });

  it('every graded answer with a fractional part renders in at least two distinct shapes', () => {
    // If a value rendered only one way, the both-shapes claim below would be
    // vacuous for it. MEASURED rather than assumed, and the measurement found the
    // one class where it cannot hold: a value that is a whole number renders the
    // same string every way, and the full-float shape of it carries no decimal
    // point, so it is deliberately dropped rather than matched against any year or
    // count that happens to share its digits. The lab's numeric sweep is what
    // covers those, which is why this test states the split instead of asserting
    // a floor over both halves.
    const fractional = FIELDS.filter(([, , value]) => !Number.isInteger(value));
    const whole = FIELDS.filter(([, , value]) => Number.isInteger(value));
    expect(fractional.length + whole.length).toBe(18);
    expect(whole.length, 'more whole-number answers than this wave cut').toBeLessThanOrEqual(2);
    fractional.forEach(([, key, value]) => {
      expect(gradedRenderings(value, gradedClassOf(key).cls).length, `${key} renders one way only`)
        .toBeGreaterThanOrEqual(2);
    });
    whole.forEach(([, key, value]) => {
      expect(gradedRenderings(value, gradedClassOf(key).cls).length, `${key} renders no way at all`)
        .toBeGreaterThanOrEqual(1);
    });
  });

  it('NEGATIVE CONTROL, PLANT ONE: a NINE SIGNIFICANT DIGIT answer is caught', () => {
    const [, key, value] = FIELDS.find(([, k]) => k === 'okwori_hotday_process_out_f');
    const planted = `const label = 'the process leaves at ${value.toPrecision(9).replace(/\.?0+$/, '')} degF';`;
    const hits = printedIn(planted);
    expect(hits.map((h) => h.key)).toContain(key);
  });

  it('NEGATIVE CONTROL, PLANT TWO: the SAME answer at FULL FLOAT PRECISION is caught', () => {
    // THIS IS THE PLANT THE FC1-STYLE GUARD WALKED PAST. The two plants print the
    // same quantity, so the only difference between them is the rendering.
    const [, key, value] = FIELDS.find(([, k]) => k === 'okwori_hotday_process_out_f');
    const planted = `const label = \`the process leaves at ${String(value)} degF\`;`;
    expect(planted).not.toContain(value.toPrecision(9).replace(/\.?0+$/, ''));
    const hits = printedIn(planted);
    expect(hits.map((h) => h.key)).toContain(key);
  });

  it('NEGATIVE CONTROL, PLANT THREE: the class precision rendering is caught', () => {
    const [, key, value] = FIELDS.find(([, k]) => k === 'ubit_u_dirty');
    const planted = `<span>{'${value.toFixed(6)}'}</span>`;
    expect(printedIn(planted).map((h) => h.key)).toContain(key);
  });

  it('CONTROL FOUR: a number that is NOT a graded answer is not reported', () => {
    expect(printedIn('const u = 92.110348; const re = 44051.846000;')).toEqual([]);
  });

  sources.forEach(({ file, text }) => {
    it(`${file} prints none of the eighteen graded answers, in any of the three shapes`, () => {
      const hits = printedIn(text);
      expect(hits.map((h) => `${h.key}=${h.s}`), `${file} prints a graded capstone answer`).toEqual([]);
    });

    it(`${file} names no capstone unit`, () => {
      // THE DERIVATION IS THE ONE EXEMPTION, by name and with a reason: it is the
      // answer key's own tolerance table, not a panel, and it cannot list the
      // eighteen graded fields without naming the units they belong to. Every
      // OTHER file in this directory is a panel or a lab and may not name one.
      const DERIVATION = 'gradedTolerance.js';
      const hits = [...new Set([...text.matchAll(/(?:amenam|ubit|okwori)\w*/gi)].map((x) => x[0].toLowerCase()))];
      if (file === DERIVATION) {
        const keys = GRADED_FIELDS.map(([, k]) => k);
        const outside = hits.filter((h) => !keys.includes(h) && !['amenam', 'ubit', 'okwori'].includes(h));
        expect(outside, 'the derivation names something beyond its own graded keys').toEqual([]);
        return;
      }
      expect(hits, `${file} names a capstone unit`).toEqual([]);
    });

    it(`${file} carries no em dash and no en dash`, () => {
      expect(text).not.toMatch(/[–—]/);
    });

    it(`${file} computes no heat transfer quantity of its own`, () => {
      expect(text, `${file} imports an engine directly`).not.toMatch(/@petrolord\/engines/);
      expect(text, `${file} reads a clock`).not.toMatch(/new Date\(|Date\.now|Math\.random/);
    });
  });
});
