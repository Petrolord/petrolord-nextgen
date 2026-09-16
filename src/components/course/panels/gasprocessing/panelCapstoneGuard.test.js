// A PANEL MAY NOT REACH INTO THE CAPSTONE.
//
// The lab's leak gate in gasprocessingLab.test.js walks the TEACHING exports'
// return values. It says nothing about the PANELS, and the panels import the
// lab directly. The lab exports its whole capstone surface (IKOT_ABASI,
// OTUMARA, ESCRAVOS, capstoneRuns, capstoneFields and friends) beside its
// teaching surface, with nothing between them but a comment.
//
// A panel built on any of those would print graded answers to the learner
// sitting the assessment, and every other gate would stay green. So the guard
// is on the panel SOURCES, and on the course page, which imports the lab too.
// It is a grep, deliberately: a runtime check would only catch the modes
// somebody thought to render.
//
// The teaching equivalents exist and are what a panel must use:
//   IKOT_ABASI_LINE, IKOT_ABASI   ->  OBIAFU_LINE, OBIAFU, waterCarried,
//                                     waterToTakeOut, circulationChoice,
//                                     reboilerPaysFor, stillOverhead
//   OTUMARA_ABSORBER              ->  OBIAFU_ABSORPTION_FACTOR, OBIAFU_STAGES,
//                                     stagedDevice
//   OTUMARA                       ->  UBIE, acidGasByMoles, threeAmines
//   ESCRAVOS                      ->  AGBADA, coldEnd, flagControls
//   capstoneRuns                  ->  the twenty section readers
//   capstone*                     ->  nothing; a panel never needs a graded answer
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as L from './gasprocessingLab.js';
import { waveInput } from '../../../../../tools/course-waves/waveInputs.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
// THE GRADED ANSWERS, from the committed copy under tools/course-waves by
// default, so this guard runs on a CI runner. A missing input throws and names
// itself rather than skipping: see tools/course-waves/waveInputs.mjs.
const WAVE_NAME = 'gasprocessing';
const FIELDS_JSON = waveInput(WAVE_NAME, 'fields.json');
const LEARNING_PAGE = path.resolve(HERE, '../../../../pages/apps/GasProcessingLearningPage.jsx');

const panelSources = fs
  .readdirSync(HERE)
  .filter((f) => f.endsWith('.jsx') && !f.endsWith('.test.jsx'))
  .map((f) => ({ file: f, text: fs.readFileSync(path.join(HERE, f), 'utf8') }))
  .concat([{ file: 'GasProcessingLearningPage.jsx', text: fs.readFileSync(LEARNING_PAGE, 'utf8') }]);

const gradedValues = () => JSON.parse(fs.readFileSync(FIELDS_JSON, 'utf8'))
  .map((f) => ({ tier: f[0], key: f[1], value: f[2] }))
  .filter((f) => typeof f.value === 'number' && Number.isFinite(f.value));

/**
 * ONE CANONICAL RENDERING IS NOT A GUARD, and this is the hole it left.
 *
 * This gate used to build a single string per graded answer, `toPrecision(9)`,
 * and search each panel source for it. A sibling wave measured what that
 * catches: planting a graded value AT NINE SIGNIFICANT DIGITS failed the guard
 * correctly, and planting THE SAME VALUE at full float precision SLIPPED
 * STRAIGHT PAST IT and was caught only by the lab's numeric sweep. A guard that
 * a longer, more precise, more damaging rendering walks through is worse than no
 * guard, because its green is read as a statement about the panels.
 *
 * It matters more here than on any sibling. This course prints Joule-Thomson
 * coefficients, compressibilities and a temperature derivative, and a panel that
 * rendered one with `String(x)` or `{x}` in JSX would print all seventeen
 * significant digits.
 *
 * So the comparison is NUMERIC AND RENDERING-AGNOSTIC. Every decimal literal in
 * the source is read out, and a literal counts as printing a graded answer when
 * it is that answer CORRECTLY ROUNDED TO THE LITERAL'S OWN PRECISION. That
 * catches nine digits, seventeen digits, and every truncation in between,
 * without a list of renderings anybody has to keep complete.
 *
 * SIX SIGNIFICANT DIGITS IS THE FLOOR, and it is a floor rather than a
 * threshold: below it a panel's honest constants collide by arithmetic
 * coincidence rather than by leaking anything. A shorter rendering of an answer
 * is covered by the lab's numeric leak gate, which walks every value a panel can
 * reach with a cushion around the grading band.
 */
const DECIMAL_LITERAL = /\d+\.\d+(?:[eE][-+]?\d+)?/g;
const SIG_FLOOR = 6;

const significantDigits = (lit) => {
  const mantissa = lit.split(/[eE]/)[0].replace('.', '').replace(/^0+/, '');
  return mantissa.replace(/0+$/, '').length || 1;
};

/** Every graded answer a source prints, at any precision, with the evidence. */
const gradedAnswersPrintedIn = (text) => {
  const hits = [];
  const literals = text.match(DECIMAL_LITERAL) || [];
  gradedValues().forEach(({ tier, key, value }) => {
    literals.forEach((lit) => {
      const sig = significantDigits(lit);
      if (sig < SIG_FLOOR || sig > 21) return;
      if (Number(lit) === Number(Math.abs(value).toPrecision(sig))) {
        hits.push(`${lit} is ${tier}/${key} to ${sig} significant digits`);
      }
    });
  });
  return [...new Set(hits)];
};

describe('THE PANEL GUARD: no panel may read the capstone', () => {
  it('there are panels to check, so a rename cannot silently empty this gate', () => {
    expect(panelSources.map((s) => s.file).sort()).toEqual([
      'AbsorberExplorer.jsx', 'ColdEndExplorer.jsx', 'GasProcessingLearningPage.jsx', 'WaterExplorer.jsx',
    ]);
    panelSources.forEach((s) => expect(s.text.length, s.file).toBeGreaterThan(2000));
  });

  it('the lab names every capstone export in CAPSTONE_ONLY_EXPORTS, so the grep list cannot go stale', () => {
    const named = Object.keys(L).filter((k) => /ikot|otumara|escravos|capstone/i.test(k));
    expect(named.length).toBeGreaterThanOrEqual(12);
    named.forEach((k) => expect(L.CAPSTONE_ONLY_EXPORTS, `${k} is not listed as capstone-only`).toContain(k));
    const exported = Object.keys(L);
    L.CAPSTONE_ONLY_EXPORTS.forEach((k) => expect(exported, `${k} is listed but not exported`).toContain(k));
    L.CAPSTONE_ONLY_EXPORTS.forEach((k) => {
      if (k === 'CAPSTONE_ONLY_EXPORTS') return;
      expect(k, `${k} does not carry a capstone name`).toMatch(/ikot|otumara|escravos|capstone/i);
    });
  });

  it('NEGATIVE CONTROL: a planted capstone name and a planted graded answer are both found', () => {
    const graded = gradedValues();
    expect(graded.length).toBe(18);
    const planted = `import { capstoneValues } from './gasprocessingLab';\nconst x = ${graded[0].value.toPrecision(9)};`;
    expect(L.CAPSTONE_ONLY_EXPORTS.filter((name) => new RegExp(`\\b${name}\\b`).test(planted))).toEqual(['capstoneValues']);
    expect(gradedAnswersPrintedIn(planted)).toHaveLength(1);
  });

  it('NEGATIVE CONTROL: the SAME answer at FULL FLOAT PRECISION is found too', () => {
    // THIS IS THE ONE THAT USED TO WALK THROUGH. The old guard held one
    // rendering per answer, `toPrecision(9)`, so a panel printing the same
    // number with String() or in JSX passed it. Every graded value is planted
    // both ways here, and both must be caught, because the more precise plant is
    // the more damaging one: a learner reading it has the answer to more digits
    // than the course asks for.
    gradedValues().forEach(({ tier, key, value }) => {
      const nine = `const x = ${value.toPrecision(9)};`;
      const full = `const x = ${String(value)};`;
      expect(gradedAnswersPrintedIn(nine), `${tier}/${key} at nine significant digits`).not.toEqual([]);
      expect(gradedAnswersPrintedIn(full), `${tier}/${key} at full float precision`).not.toEqual([]);
    });
  });

  it('CONTROL: an honest panel constant of fewer than six significant digits is NOT a hit', () => {
    // A guard that fires on clear air is as much a defect as one that misses.
    // These are the shapes a panel legitimately carries.
    ['const w = 1.5;', 'const p = 0.25;', 'strokeWidth={1.5}', 'const sg = 1.02;', 'padding: 0.75rem']
      .forEach((line) => expect(gradedAnswersPrintedIn(line), line).toEqual([]));
  });

  panelSources.forEach(({ file, text }) => {
    it(`${file} names no capstone-only export`, () => {
      const hits = L.CAPSTONE_ONLY_EXPORTS.filter((name) => new RegExp(`\\b${name}\\b`).test(text));
      expect(hits, `${file} reaches into the capstone: ${hits.join(', ')}`).toEqual([]);
    });

    it(`${file} names no capstone stream and never says a capstone field's name`, () => {
      const hits = [...text.matchAll(/(?:ikot|otumara|escravos)\w*/gi)].map((x) => x[0]);
      expect([...new Set(hits)], `${file} reaches into the capstone`).toEqual([]);
    });

    it(`${file} prints none of the eighteen graded answers, at ANY precision`, () => {
      // Read from fields.json rather than from the lab, so a panel is checked
      // against what the GRADER holds. The comparison is numeric and
      // rendering-agnostic: see gradedAnswersPrintedIn above for why one
      // canonical string was not a guard. A bare integer answer is covered by
      // the lab's numeric leak gate, which walks every value a panel can reach.
      expect(JSON.parse(fs.readFileSync(FIELDS_JSON, 'utf8'))).toHaveLength(18);
      expect(gradedAnswersPrintedIn(text), `${file} prints a graded capstone answer`).toEqual([]);
    });

    it(`${file} carries no em dash and no en dash`, () => {
      expect(text).not.toMatch(/[–—]/);
    });

    it(`${file} computes no gas processing quantity of its own`, () => {
      // Every number a panel shows comes through the lab, which comes through
      // the vendored engine. A panel that imported an engine directly could
      // print a number no gate in this course has ever seen.
      expect(text, `${file} imports an engine directly`).not.toMatch(/@petrolord\/engines/);
      expect(text, `${file} reads a clock`).not.toMatch(/new Date\(|Date\.now|Math\.random/);
    });
  });
});
