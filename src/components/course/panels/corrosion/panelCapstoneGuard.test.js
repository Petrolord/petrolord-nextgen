// A PANEL MAY NOT REACH INTO THE FC9 CAPSTONE, AND THE GUARD MUST CATCH THE FULL
// FLOAT SHAPE AS WELL AS THE ROUNDED ONE.
//
// WHY THE SHAPES MATTER. A sibling wave's guard string-matched its graded answers
// at nine significant digits only. Planting the rounded shape was caught.
// Planting the SAME NUMBER at full double precision went past the guard entirely
// and was caught only by a separate numeric sweep. A panel that writes `${value}`
// prints the full double, so the likelier leak was the one the guard could not
// see. This guard holds four shapes and BOTH PLANTS ARE PROVED BELOW.
//
// WHAT IT SWEEPS. Every source file in this panel directory, plus every panel
// component and the course learning page once they exist. The inventory is
// DECLARED, so a rename or a deletion cannot quietly empty this gate: the test
// asserts the listing on disk equals the declared one and fails on a mismatch in
// either direction.
//
// The wave inputs are read through tools/course-waves/waveInputs.mjs, so this
// suite runs on a CI runner against the committed copy. A missing input throws and
// names itself. Nothing here guards a read with existsSync and a return, and no
// path under /root appears anywhere in this file.
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { waveInput, readingMirror, waveDir } from '../../../../../tools/course-waves/waveInputs.mjs';
import { allRenderings, leaksIn, renderingsOf, MIN_CHARS } from './gradedAnswerGuard.js';
import { GRADED_FIELDS, PRINTED_DECIMALS, gradedClassOf, gradedTolerance, printedFloor } from './gradedTolerance.js';

const WAVE_NAME = 'corrosion';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const FIELDS = JSON.parse(fs.readFileSync(waveInput(WAVE_NAME, 'fields.json'), 'utf8'));

/**
 * WHAT THIS DIRECTORY IS EXPECTED TO HOLD AT THIS PHASE OF THE WAVE, declared so
 * the sweep cannot go vacuous. The foundation phase ships the tolerance
 * derivation and this guard. The panels phase adds the lab and the three panel
 * components and MUST extend this list in the same commit, because a listing that
 * does not match fails.
 */
const EXPECTED_SOURCES = [
  'gradedAnswerGuard.js',
  'gradedTolerance.js',
];

const sources = fs
  .readdirSync(HERE)
  .filter((f) => (f.endsWith('.js') || f.endsWith('.jsx')) && !f.includes('.test.'))
  .sort()
  .map((f) => ({ file: f, text: fs.readFileSync(path.join(HERE, f), 'utf8') }));

describe('THE FC9 PANEL GUARD: no source in this directory may carry a graded capstone answer', () => {
  it('reads its inputs through the course-wave resolver and says which copy it read', () => {
    expect(FIELDS).toHaveLength(18);
    const where = readingMirror(WAVE_NAME) ? 'the committed copy' : 'a live wave directory';
    expect(waveDir(WAVE_NAME).length).toBeGreaterThan(0);
    console.log(`[corrosion guard] read fields.json from ${where}: ${waveDir(WAVE_NAME)}`);
  });

  it('there are sources to check, and the listing matches the declared inventory', () => {
    expect(sources.map((s) => s.file)).toEqual(EXPECTED_SOURCES);
    expect(sources.length).toBeGreaterThan(1);
    sources.forEach((s) => expect(s.text.length, s.file).toBeGreaterThan(500));
  });

  it('the guard holds four shapes, and every field contributes at least the full double', () => {
    const r = allRenderings(FIELDS);
    const shapes = new Set(r.map((x) => x.shape));
    expect([...shapes].sort()).toEqual(['full', 'nine', 'printed', 'twelve']);
    // EVERY field must contribute the full double, because that is the shape a
    // template literal produces and the one a nine-only matcher misses.
    GRADED_FIELDS.forEach(([, key]) => {
      const mine = r.filter((x) => x.key === key);
      expect(mine.map((x) => x.shape), key).toContain('full');
      expect(mine.length, key).toBeGreaterThanOrEqual(2);
    });
    // A field is NOT required to contribute a distinct nine shape. Six of the
    // eighteen FC9 values already fit inside nine significant digits, so their
    // nine rendering is the same STRING as a longer one and the deduplication
    // drops the duplicate. The string is still searched. Requiring a distinct
    // nine shape for every field would be asserting something false about this
    // answer key, so the count is asserted instead and printed.
    const withNine = GRADED_FIELDS.filter(([, key]) => r.some((x) => x.key === key && x.shape === 'nine'));
    expect(withNine.length).toBeGreaterThanOrEqual(10);
    expect(r.length).toBeGreaterThanOrEqual(18 * 2);
    console.log(`[corrosion guard] ${r.length} searchable renderings over 18 graded fields, `
      + `minimum ${MIN_CHARS} characters, shapes: ${[...shapes].sort().join(', ')}. `
      + `${withNine.length} of 18 contribute a DISTINCT nine-digit string; the other `
      + `${18 - withNine.length} already fit in nine significant digits so their nine shape is a string `
      + 'a longer rendering already carries.');
  });

  it('PLANT ONE: the guard catches the ROUNDED shape', () => {
    const r = allRenderings(FIELDS);
    const row = FIELDS.find(([, k]) => renderingsOf(k, FIELDS.find((f) => f[1] === k)[2]).some((x) => x.shape === 'nine'));
    expect(row, 'no field contributes a nine-digit shape, so this plant could not be built').toBeTruthy();
    const nine = renderingsOf(row[1], row[2]).find((x) => x.shape === 'nine');
    const planted = `Quote it as ${nine.text} in your answer`;
    const hits = leaksIn(planted, r);
    expect(hits.map((h) => h.shape)).toContain('nine');
    expect(hits.every((h) => h.key === row[1])).toBe(true);
  });

  it('PLANT TWO: the guard catches the FULL FLOAT shape, and a nine-only matcher provably does not', () => {
    const r = allRenderings(FIELDS);
    // The probe must be a field whose nine-digit string is NOT a substring of its
    // full double. Where it is a prefix, a nine-only matcher would catch the full
    // plant by accident and the two plants would prove nothing. Seven of the
    // eighteen are exactly that, so the probe is SEARCHED FOR.
    const probe = FIELDS.find(([, key, value]) => {
      const shapes = renderingsOf(key, value);
      const full = shapes.find((x) => x.shape === 'full');
      const nine = shapes.find((x) => x.shape === 'nine');
      return full && nine && !full.text.includes(nine.text);
    });
    expect(probe, 'no field has a nine-digit shape absent from its own full double, so the two '
      + 'matchers could not be distinguished on this answer key').toBeTruthy();
    const [, key, value] = probe;
    const planted = `const x = ${value}; // a panel printing \${value} with no formatter`;
    expect(planted).toContain(String(value));
    const hits = leaksIn(planted, r);
    expect(hits.map((h) => h.shape)).toContain('full');
    expect(hits.every((h) => h.key === key)).toBe(true);
    // AND THE NINE-DIGIT-ONLY MATCHER THE SIBLING WAVE SHIPPED DOES NOT SEE IT.
    const nineOnly = r.filter((x) => x.shape === 'nine' && x.key === key);
    expect(nineOnly.length).toBeGreaterThan(0);
    expect(leaksIn(planted, nineOnly)).toEqual([]);
    console.log(`[corrosion guard] both plants proved on ${key}: the four-shape guard catches the full `
      + `double ${String(value)}, and the nine-only matcher does not.`);
  });

  it('PLANT THREE: the guard catches the PRINTED shape a learner would be told to quote', () => {
    const r = allRenderings(FIELDS);
    const row = FIELDS.find(([, k]) => k === 'soku_allowance_to_reinstate_mm');
    expect(row).toBeTruthy();
    const printed = renderingsOf(row[1], row[2]).find((x) => x.shape === 'printed');
    expect(printed).toBeTruthy();
    expect(leaksIn(`An allowance of ${printed.text} mm`, r).map((h) => h.shape)).toContain('printed');
  });

  it('THE TOLERANCE IS MADE IN ONE PLACE, and it is max and never min', () => {
    GRADED_FIELDS.forEach(([, key, cls, stated]) => {
      const tol = gradedTolerance(key);
      const floor = printedFloor(cls);
      expect(tol, `${key} is graded tighter than its class prints`).toBeGreaterThanOrEqual(floor);
      expect(tol, `${key} is graded tighter than the wave stated`).toBeGreaterThanOrEqual(stated);
      expect(tol, `${key} is max(stated, floor)`).toBe(Math.max(stated, floor));
    });
    // and the answer key on disk carries exactly that derivation
    FIELDS.forEach(([, key, , tol]) => expect(tol, key).toBe(gradedTolerance(key)));
    expect(Object.keys(PRINTED_DECIMALS).length).toBeGreaterThanOrEqual(8);
    console.log('[corrosion guard] all eighteen tolerances are max(stated, printed floor), and the '
      + 'committed answer key carries the same numbers.');
  });

  it('every quantity class a graded field uses has a declared printed precision', () => {
    GRADED_FIELDS.forEach(([, key, cls]) => {
      expect(Number.isInteger(PRINTED_DECIMALS[cls]), `${key} class ${cls}`).toBe(true);
      expect(gradedClassOf(key).cls).toBe(cls);
    });
  });

  it('the graded field keys are spelled in the tolerance derivation, so the key exemption is not a blanket', () => {
    const tol = sources.find((s) => s.file === 'gradedTolerance.js');
    expect(tol).toBeTruthy();
    GRADED_FIELDS.forEach(([, key]) => expect(tol.text, `${key} is not spelled in gradedTolerance.js`).toContain(key));
    expect(GRADED_FIELDS).toHaveLength(18);
  });

  it('NEGATIVE CONTROL: a capstone CONDITION import is caught even after the keys are removed', () => {
    const planted = "import { OBIGBO_STREAM, SOKU_INSPECTION } from './conditions';";
    let rest = planted;
    GRADED_FIELDS.forEach(([, key]) => { rest = rest.split(key).join(' GRADEDKEY '); });
    const hits = [...rest.matchAll(/\b(obigbo|nembe|soku)\w*/gi)].map((x) => x[0]);
    expect([...new Set(hits)].sort()).toEqual(['OBIGBO_STREAM', 'SOKU_INSPECTION']);
  });

  sources.forEach(({ file, text }) => {
    it(`${file} prints none of the eighteen graded answers, in any of the four shapes`, () => {
      const hits = leaksIn(text, allRenderings(FIELDS));
      expect(hits.map((h) => `${h.key} as ${h.shape} (${h.text})`), `${file} prints a graded capstone answer`).toEqual([]);
    });

    it(`${file} names no capstone plant outside a graded field KEY`, () => {
      // The eighteen graded KEYS carry their plant's name, and the tolerance
      // derivation has to spell all eighteen: that is what makes the precision
      // declaration per-field rather than per-word. So the keys are removed first,
      // by exact string, and what is left must name no plant at all. The exemption
      // is not a blanket: the test above asserts the keys really are there, so a
      // file could not claim it by spelling none of them.
      let rest = text;
      GRADED_FIELDS.forEach(([, key]) => { rest = rest.split(key).join(' GRADEDKEY '); });
      const hits = [...rest.matchAll(/\b(obigbo|nembe|soku)\w*/gi)].map((x) => x[0]);
      expect([...new Set(hits)], `${file} names a capstone plant outside a graded field key`).toEqual([]);
    });

    it(`${file} carries no em dash and no en dash`, () => {
      expect(text).not.toMatch(/[–—]/);
    });

    it(`${file} carries no "X, not Y" contrastive`, () => {
      // The owner copy rule, over everything a learner could read. The five
      // verbatim engine strings that breach it live in the digest and not here.
      expect(text.match(/,\s+not\s+\w+/g) ?? []).toEqual([]);
    });

    it(`${file} reads no clock and no random number`, () => {
      expect(text, `${file} reads a clock`).not.toMatch(/new Date\(|Date\.now|Math\.random/);
    });

    it(`${file} contains no absolute path under /root`, () => {
      // The portability rule: a test or a source that names a wave author's home
      // directory cannot run on a CI runner.
      expect(text, `${file} names an absolute /root path`).not.toMatch(/\/root\//);
    });
  });

  it('THIS TEST FILE ITSELF names no path under /root', () => {
    const me = fs.readFileSync(fileURLToPath(import.meta.url), 'utf8');
    expect(me).not.toMatch(/\/root\//);
  });
});
