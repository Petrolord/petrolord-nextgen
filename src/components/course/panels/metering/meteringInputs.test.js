// FC8 METERING: THE COMMITTED WAVE INPUTS, AND THE SINGLE SOURCE OF TOLERANCE.
//
// This suite runs on a CI runner. It reads the wave's inputs through
// tools/course-waves/waveInputs.mjs, which defaults to the copy committed under
// tools/course-waves/metering, so nothing here contains an absolute path into
// anybody's home directory. Until 2026-09-16 every course suite in this
// repository read its inputs from an absolute path inside the wave author's own
// home directory, which is why the course gates had never once run in CI: a
// runner has no such directory, so a suite either died on a missing file or,
// worse, guarded the read and skipped itself while reporting success. No test
// file in this wave spells an absolute path of that shape, and this sentence is
// careful not to spell one either.
//
// ABSENCE FAILS BY NAME. waveInput() throws and names the file it wanted and the
// wave it belongs to. Nothing here guards a read with existsSync and a return.
//
// WHAT THIS SUITE IS FOR, while the panels are still unbuilt:
//
//   1. THE TOLERANCE LIVES IN ONE PLACE. gradedTolerance.js in this directory is
//      the only place a FC8 tolerance is derived. fields.json is written out of
//      it by the wave's make_fields.mjs. This suite recomputes every tolerance
//      from the derivation and requires fields.json to agree, so a hand edit to
//      either one is a red build rather than a silent third copy.
//
//   2. THE GRADED ANSWER MATCHER IS PROVED AT FULL FLOAT PRECISION. A sibling
//      wave's panel guard held ONE canonical rendering per answer,
//      toPrecision(9), and the same value written by String() or interpolated
//      into JSX walked straight past it: 9 of 18 graded fields were reachable
//      that way. The matcher below is numeric and rendering agnostic, and both
//      plants are run on every one of the eighteen answers rather than argued
//      about.
//
//   3. EVERY FILE THAT ALREADY EXISTS IN THIS PANEL DIRECTORY IS SWEPT. Today
//      that is the tolerance derivation itself, which must carry no graded
//      answer. When the panels are built they join the sweep by being in the
//      directory, and the count below is asserted so a rename cannot quietly
//      empty the gate.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { waveInput, mirrorDir, readingMirror } from '../../../../../tools/course-waves/waveInputs.mjs';
import {
  GRADED_FIELDS, PRINTED_DECIMALS, gradedTolerance, printedFloor, precisionDeclaration,
} from './gradedTolerance.js';

const WAVE_NAME = 'metering';
const HERE = path.dirname(fileURLToPath(import.meta.url));

const FIELDS = JSON.parse(fs.readFileSync(waveInput(WAVE_NAME, 'fields.json'), 'utf8'));
const PRECISION = JSON.parse(fs.readFileSync(waveInput(WAVE_NAME, 'precision.json'), 'utf8'));
const DIGEST = fs.readFileSync(waveInput(WAVE_NAME, 'digest.txt'), 'utf8');

/**
 * Every graded answer a source prints, at any precision, with the evidence.
 *
 * A literal counts as printing a graded answer when it is that answer CORRECTLY
 * ROUNDED TO THE LITERAL'S OWN PRECISION. That catches nine digits, seventeen
 * digits and every truncation in between, without a list of renderings anybody
 * has to keep complete.
 *
 * SIX SIGNIFICANT DIGITS IS A FLOOR rather than a threshold: below it an honest
 * constant collides by arithmetic coincidence rather than by leaking anything.
 */
const DECIMAL_LITERAL = /\d+\.\d+(?:[eE][-+]?\d+)?/g;
const SIG_FLOOR = 6;
const significantDigits = (lit) => {
  const mantissa = lit.split(/[eE]/)[0].replace('.', '').replace(/^0+/, '');
  return mantissa.replace(/0+$/, '').length || 1;
};
const gradedAnswersPrintedIn = (text) => {
  const hits = [];
  const literals = text.match(DECIMAL_LITERAL) || [];
  FIELDS.forEach(([tier, key, value]) => {
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

const panelSources = fs
  .readdirSync(HERE)
  .filter((f) => (f.endsWith('.js') || f.endsWith('.jsx')) && !f.includes('.test.'))
  .map((f) => ({ file: f, text: fs.readFileSync(path.join(HERE, f), 'utf8') }));

describe('FC8 metering: the committed wave inputs', () => {
  it('reads its inputs from the committed copy by default, and says which it read', () => {
    expect(typeof readingMirror(WAVE_NAME)).toBe('boolean');
    expect(fs.existsSync(mirrorDir(WAVE_NAME))).toBe(true);
  });

  it('the digest is whole: thirty two sections, numbered without a gap', () => {
    const sections = DIGEST.split('\n').filter((l) => l.startsWith('# SECTION'));
    expect(sections).toHaveLength(32);
    sections.forEach((l, i) => {
      expect(Number(/^# SECTION (\d+):/.exec(l)[1]), l.slice(0, 40)).toBe(i + 1);
    });
  });

  it('the digest names the module that owns every one of the eighteen modules', () => {
    ['Associate', 'Professional', 'Expert'].forEach((tier) => {
      ['m01', 'm02', 'm03', 'm04', 'm05', 'm06'].forEach((m) => {
        expect(DIGEST, `${tier} ${m} owns no digest section`).toContain(`owned by ${tier} ${m}`);
      });
    });
  });

  it('the digest teaches both withholdings as CURRENT behaviour', () => {
    expect(DIGEST).toContain('straightRunDiameters returns withheld true for two elbows in different planes');
    expect(DIGEST).toContain('fireVenting returns ventWithheld true and a null vent capacity at every wetted area');
  });

  it('carries eighteen graded fields, six in each of three tiers', () => {
    expect(FIELDS).toHaveLength(18);
    const perTier = FIELDS.reduce((a, f) => ({ ...a, [f[0]]: (a[f[0]] || 0) + 1 }), {});
    expect(perTier).toEqual({ beginner: 6, intermediate: 6, advanced: 6 });
  });
});

describe('FC8 metering: the tolerance is derived in ONE place', () => {
  it('fields.json carries exactly the declared fields, in the declared order', () => {
    expect(FIELDS.map((f) => [f[0], f[1]])).toEqual(GRADED_FIELDS.map(([t, k]) => [t, k]));
  });

  it('every tolerance in fields.json is the one the derivation produces', () => {
    FIELDS.forEach(([, key, , tol]) => {
      expect(tol, `${key} is graded at a tolerance the derivation does not produce`)
        .toBe(gradedTolerance(key));
    });
  });

  it('the rule is a MAXIMUM, so no field is graded tighter than its class prints', () => {
    GRADED_FIELDS.forEach(([, key, cls, stated]) => {
      const tol = gradedTolerance(key);
      expect(tol, `${key} is graded below its printed floor`).toBeGreaterThanOrEqual(printedFloor(cls));
      expect(tol, `${key} is graded below its own stated tolerance`).toBeGreaterThanOrEqual(stated);
    });
  });

  it('precision.json is the derivation written out, and classifies all eighteen', () => {
    expect(PRECISION).toEqual(precisionDeclaration());
    FIELDS.forEach(([, key]) => {
      const cls = Object.entries(PRECISION).find(([, p]) => new RegExp(p.match).test(key));
      expect(cls, `${key} is classified by no precision class`).toBeTruthy();
      expect(PRINTED_DECIMALS[cls[0]]).toBe(cls[1].decimals);
    });
  });

  it('a learner quoting a value at the precision the course prints is inside its tolerance', () => {
    FIELDS.forEach(([, key, value, tol]) => {
      const cls = Object.entries(PRECISION).find(([, p]) => new RegExp(p.match).test(key))[1];
      const quoted = Number(value.toFixed(cls.decimals));
      expect(Math.abs(quoted - value), `${key} cannot be answered at the precision it prints`)
        .toBeLessThanOrEqual(tol);
    });
  });
});

describe('FC8 metering: the graded answer matcher, proved at full float precision', () => {
  it('NEGATIVE CONTROL: every answer is caught at nine significant digits AND at full float', () => {
    // THIS IS THE ONE THAT USED TO WALK THROUGH on a sibling wave. The more
    // precise plant is the more damaging one: a reader has the answer to more
    // digits than the course asks for.
    expect(FIELDS).toHaveLength(18);
    FIELDS.forEach(([tier, key, value]) => {
      const nine = `const x = ${value.toPrecision(9)};`;
      const full = `const x = ${String(value)};`;
      expect(gradedAnswersPrintedIn(nine), `${tier}/${key} at nine significant digits`).not.toEqual([]);
      expect(gradedAnswersPrintedIn(full), `${tier}/${key} at full float precision`).not.toEqual([]);
    });
  });

  it('CONTROL: an honest constant of fewer than six significant digits is not a hit', () => {
    ['const w = 1.5;', 'const p = 0.25;', 'strokeWidth={1.5}', 'const sg = 1.02;', 'padding: 0.75rem']
      .forEach((line) => expect(gradedAnswersPrintedIn(line), line).toEqual([]));
  });

  it('there are sources in this directory to check, so a rename cannot empty this gate', () => {
    expect(panelSources.length).toBeGreaterThanOrEqual(1);
    expect(panelSources.map((s) => s.file)).toContain('gradedTolerance.js');
  });

  panelSources.forEach(({ file, text }) => {
    it(`${file} prints none of the eighteen graded answers, at ANY precision`, () => {
      expect(gradedAnswersPrintedIn(text), `${file} prints a graded capstone answer`).toEqual([]);
    });

    it(`${file} carries no em dash and no en dash`, () => {
      expect(text).not.toMatch(/[–—]/);
    });

    it(`${file} reads no clock and no randomness`, () => {
      expect(text).not.toMatch(/new Date\(|Date\.now|Math\.random/);
    });
  });
});
