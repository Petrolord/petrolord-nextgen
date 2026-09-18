// A PANEL MAY NOT REACH INTO THE FC5 CAPSTONE, AND THE GUARD MUST CATCH THE
// FULL-FLOAT SHAPE AS WELL AS THE ROUNDED ONE.
//
// WHY THE SHAPES MATTER. A sibling wave's guard string-matched its graded
// answers at nine significant digits only. Planting `2.88817656` was caught.
// Planting `2.8881765597102644`, the SAME NUMBER at full double precision, went
// past the guard entirely and was caught only by the lab's separate numeric
// sweep. A panel that writes `${value}` prints the full float, so the likelier
// leak was the one the guard could not see. This guard holds four shapes and
// both of those plants are proved below.
//
// WHAT IT SWEEPS. Every source file in this panel directory, plus every panel
// component and the course learning page once they exist. The inventory is
// DECLARED, so a rename or a deletion cannot quietly empty this gate: the test
// asserts the listing on disk equals the declared one and fails on a mismatch
// in either direction.
//
// The wave inputs are read through tools/course-waves/waveInputs.mjs, so this
// suite runs on a CI runner against the committed copy. A missing input throws
// and names itself. Nothing here guards a read with existsSync and a return.
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { waveInput, readingMirror, waveDir } from '../../../../../tools/course-waves/waveInputs.mjs';
import { allRenderings, leaksIn, renderingsOf, MIN_CHARS } from './gradedAnswerGuard.js';
import { GRADED_FIELDS } from './gradedTolerance.js';

const WAVE_NAME = 'relief';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const FIELDS = JSON.parse(fs.readFileSync(waveInput(WAVE_NAME, 'fields.json'), 'utf8'));

/**
 * WHAT THIS DIRECTORY IS EXPECTED TO HOLD AT THIS PHASE OF THE WAVE, declared so
 * the sweep cannot go vacuous. The foundation phase shipped the tolerance
 * derivation and this guard. THE PANELS PHASE ADDED the teaching lab and the
 * three panel components, and extended this list in the same commit, because a
 * listing that does not match the declared inventory fails in either direction.
 */
const EXPECTED_SOURCES = [
  'BlowdownExplorer.jsx',
  'FireDrumExplorer.jsx',
  'SizingExplorer.jsx',
  'gradedAnswerGuard.js',
  'gradedTolerance.js',
  'reliefLab.js',
];

/**
 * THE COURSE LEARNING PAGE IS SWEPT TOO. It imports the lab directly, so it can
 * reach every teaching reader, and a graded answer printed there would reach the
 * learner sitting the assessment with every other gate still green. It is proven
 * to be there rather than skipped: a page that moved makes this list stale, and a
 * stale list is what empties a gate.
 */
const LEARNING_PAGE = path.resolve(HERE, '../../../../pages/apps/ReliefLearningPage.jsx');

const sources = fs
  .readdirSync(HERE)
  .filter((f) => (f.endsWith('.js') || f.endsWith('.jsx')) && !f.includes('.test.'))
  .sort()
  .map((f) => ({ file: f, text: fs.readFileSync(path.join(HERE, f), 'utf8') }))
  .concat([{
    file: 'ReliefLearningPage.jsx',
    text: (() => {
      if (!fs.existsSync(LEARNING_PAGE)) {
        throw new Error(`[relief guard] the course learning page is not at ${LEARNING_PAGE}. `
          + 'This guard sweeps it because it imports the teaching lab. A missing page is a failure '
          + 'rather than one fewer file to check.');
      }
      return fs.readFileSync(LEARNING_PAGE, 'utf8');
    })(),
  }]);

describe('THE FC5 PANEL GUARD: no source in this directory may carry a graded capstone answer', () => {
  it('reads its inputs through the course-wave resolver and says which copy it read', () => {
    expect(FIELDS).toHaveLength(18);
    const where = readingMirror(WAVE_NAME) ? 'the committed copy' : 'a live wave directory';
    expect(waveDir(WAVE_NAME).length).toBeGreaterThan(0);
    // printed so a reader of the run output knows which file the numbers came from
    console.log(`[relief guard] read fields.json from ${where}: ${waveDir(WAVE_NAME)}`);
  });

  it('there are sources to check, and the listing matches the declared inventory', () => {
    expect(sources.map((s) => s.file)).toEqual([...EXPECTED_SOURCES, 'ReliefLearningPage.jsx']);
    expect(sources.length).toBeGreaterThan(1);
    sources.forEach((s) => expect(s.text.length, s.file).toBeGreaterThan(500));
    // The lab and all three panels are on the list, so the sweep below covers
    // every file a graded answer could be printed from.
    ['reliefLab.js', 'SizingExplorer.jsx', 'FireDrumExplorer.jsx', 'BlowdownExplorer.jsx', 'ReliefLearningPage.jsx']
      .forEach((f) => expect(sources.map((s) => s.file), `${f} is not being swept`).toContain(f));
  });

  it('NEGATIVE CONTROL, both plants at once: every one of the eighteen is caught at FULL FLOAT and at NINE digits', () => {
    // The foundation proved this on the first field. It is proved here on ALL
    // EIGHTEEN, because a guard that catches one shape of one answer is not a
    // guard over eighteen: a field whose full float and nine-digit renderings
    // both fall under MIN_CHARS would be unsearchable and nothing would say so.
    const r = allRenderings(FIELDS);
    const missed = [];
    const nineOnlyMisses = [];
    const nineOnlyCatchesByPrefix = [];
    FIELDS.forEach(([tier, key, value]) => {
      const full = `const x = ${value}; // a panel printing \${value} with no formatter`;
      const nine = `const x = ${value.toPrecision(9).replace(/0+$/, '').replace(/\.$/, '')};`;
      if (!leaksIn(full, r).some((h) => h.key === key && h.shape === 'full')) missed.push(`${tier}/${key} at full float`);
      if (!leaksIn(nine, r).some((h) => h.key === key && h.shape === 'nine')) missed.push(`${tier}/${key} at nine digits`);
      // WHAT THE NINE-ONLY MATCHER THE SIBLING WAVE SHIPPED DOES WITH THE FULL
      // FLOAT, split rather than claimed. On a field whose ninth digit rounds UP
      // the nine-digit string is not a prefix of the full float and the nine-only
      // matcher is blind to it. On a field whose ninth digit rounds DOWN it is a
      // prefix, and the nine-only matcher finds the full float by accident. The
      // first group is what makes the four shapes necessary; the second is why a
      // guard cannot be left resting on that accident, because which group a
      // field falls in is decided by its tenth digit.
      const nineOnly = r.filter((x) => x.shape === 'nine' && x.key === key);
      (leaksIn(full, nineOnly).length === 0 ? nineOnlyMisses : nineOnlyCatchesByPrefix).push(key);
    });
    expect(missed, 'the guard does not go red on both plants for every graded field').toEqual([]);
    // The four shapes are NECESSARY, and this is the measurement that says so.
    expect(nineOnlyMisses.length, 'a nine-digit-only matcher would have caught every full float, so the '
      + 'four shapes would be unnecessary here').toBeGreaterThan(0);
    expect(nineOnlyMisses.length + nineOnlyCatchesByPrefix.length).toBe(18);
    console.log(`[relief guard] BOTH PLANTS on all 18 fields: full float and nine digits both caught by the four `
      + `shapes. A nine-digit-only matcher is BLIND to the full float on ${nineOnlyMisses.length} of the 18 `
      + `(${nineOnlyMisses.join(', ')}) and finds it only by prefix on the other ${nineOnlyCatchesByPrefix.length}.`);
  });

  it('the guard holds four shapes of every graded answer, and enough of them to search for', () => {
    const r = allRenderings(FIELDS);
    const shapes = new Set(r.map((x) => x.shape));
    expect([...shapes].sort()).toEqual(['full', 'nine', 'printed', 'twelve']);
    // every one of the eighteen contributes at least the full float and the
    // nine-digit shape, so no field is unsearchable
    GRADED_FIELDS.forEach(([, key]) => {
      const mine = r.filter((x) => x.key === key);
      expect(mine.map((x) => x.shape), key).toContain('full');
      expect(mine.map((x) => x.shape), key).toContain('nine');
    });
    expect(r.length).toBeGreaterThanOrEqual(18 * 3);
    console.log(`[relief guard] ${r.length} searchable renderings over 18 graded fields, `
      + `minimum ${MIN_CHARS} characters, shapes: ${[...shapes].sort().join(', ')}`);
  });

  it('NEGATIVE CONTROL, both plants: the guard catches the ROUNDED shape', () => {
    const r = allRenderings(FIELDS);
    const [, key, value] = FIELDS[0];
    const rounded = value.toPrecision(9).replace(/0+$/, '').replace(/\.$/, '');
    const planted = `const x = ${rounded}; // a panel printing a rounded graded answer`;
    const hits = leaksIn(planted, r);
    expect(hits.map((h) => h.shape)).toContain('nine');
    expect(hits.every((h) => h.key === key)).toBe(true);
  });

  it('NEGATIVE CONTROL, both plants: the guard catches the FULL FLOAT shape, which the sibling guard missed', () => {
    const r = allRenderings(FIELDS);
    const [, key, value] = FIELDS[0];
    const planted = `const x = ${value}; // a panel printing \${value} with no formatter`;
    expect(planted).toContain(String(value));
    const hits = leaksIn(planted, r);
    expect(hits.map((h) => h.shape)).toContain('full');
    expect(hits.every((h) => h.key === key)).toBe(true);
    // and the nine-digit-only matcher the sibling wave shipped does NOT see it,
    // which is the whole reason this guard holds four shapes
    const nineOnly = r.filter((x) => x.shape === 'nine');
    expect(leaksIn(planted, nineOnly)).toEqual([]);
  });

  it('NEGATIVE CONTROL: the guard catches the PRINTED shape a learner would be told to quote', () => {
    const r = allRenderings(FIELDS);
    const row = FIELDS.find(([, k]) => k === 'gbaran_initial_mass_lb');
    const printed = renderingsOf(row[1], row[2]).find((x) => x.shape === 'printed');
    expect(printed).toBeTruthy();
    expect(leaksIn(`Inventory ${printed.text} lb`, r).map((h) => h.shape)).toContain('printed');
  });

  it('the graded field keys are spelled in the tolerance derivation, so the key exemption is not a blanket', () => {
    const tol = sources.find((s) => s.file === 'gradedTolerance.js');
    expect(tol).toBeTruthy();
    GRADED_FIELDS.forEach(([, key]) => expect(tol.text, `${key} is not spelled in gradedTolerance.js`).toContain(key));
    expect(GRADED_FIELDS).toHaveLength(18);
  });

  it('NEGATIVE CONTROL: a capstone CONDITION import is caught even after the keys are removed', () => {
    const planted = "import { KOLO_CREEK_GAS, GBARAN_BLOWDOWN } from './conditions';";
    let rest = planted;
    GRADED_FIELDS.forEach(([, key]) => { rest = rest.split(key).join(' GRADEDKEY '); });
    const hits = [...rest.matchAll(/\b(kolo[_ ]?creek|ogbainbiri|gbaran)\w*/gi)].map((x) => x[0]);
    expect([...new Set(hits)].sort()).toEqual(['GBARAN_BLOWDOWN', 'KOLO_CREEK_GAS']);
  });

  sources.forEach(({ file, text }) => {
    it(`${file} prints none of the eighteen graded answers, in any of the four shapes`, () => {
      const hits = leaksIn(text, allRenderings(FIELDS));
      expect(hits.map((h) => `${h.key} as ${h.shape} (${h.text})`), `${file} prints a graded capstone answer`).toEqual([]);
    });

    it(`${file} names no capstone plant outside a graded field KEY`, () => {
      // The eighteen graded KEYS carry their plant's name, and the tolerance
      // derivation has to spell all eighteen: that is what makes the precision
      // declaration per-field rather than per-word. So the keys are removed
      // first, by exact string, and what is left must name no plant at all. The
      // exemption is not a blanket: the test below asserts the keys really are
      // there, so a file could not claim it by spelling none of them.
      let rest = text;
      GRADED_FIELDS.forEach(([, key]) => { rest = rest.split(key).join(' GRADEDKEY '); });
      const hits = [...rest.matchAll(/\b(kolo[_ ]?creek|ogbainbiri|gbaran)\w*/gi)].map((x) => x[0]);
      expect([...new Set(hits)], `${file} names a capstone plant outside a graded field key`).toEqual([]);
    });

    it(`${file} carries no em dash and no en dash`, () => {
      expect(text).not.toMatch(/[–—]/);
    });

    it(`${file} reads no clock and no random number`, () => {
      expect(text, `${file} reads a clock`).not.toMatch(/new Date\(|Date\.now|Math\.random/);
    });

    it(`${file} contains no absolute path under /root`, () => {
      // The portability rule: a test or a source that names a wave author's
      // home directory cannot run on a CI runner.
      expect(text, `${file} names an absolute /root path`).not.toMatch(/\/root\//);
    });
  });
});
