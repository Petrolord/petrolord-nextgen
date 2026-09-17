// A PANEL MAY NOT PRINT A GRADED CAPSTONE ANSWER, IN ANY RENDERING AT ALL.
//
// THE HOLE THIS CLOSES, found on 2026-09-16. The FC1-style guard rendered each
// graded value ONE way, `Number.prototype.toPrecision(9)` with trailing zeros
// stripped, and grepped the panel sources for that string. A panel printing the
// same value at FULL FLOAT PRECISION walks straight past it: the string
// "182.97142857142856" does not contain "182.971429", so the grep finds nothing
// and the only thing left looking is the lab's numeric sweep, on a wave that has
// one and runs it. MEASURED on FC4: NINE OF ITS EIGHTEEN GRADED FIELDS would have
// walked through that guard at full float precision. FC6 prints film
// coefficients, Reynolds numbers and five resistances, so a number copied out of
// a console into a panel is a live risk here rather than a theoretical one.
//
// SO THE COMPARISON IS NUMERIC AND RENDERING-AGNOSTIC. Every decimal literal in
// every swept source is read out and a literal counts as printing a graded answer
// when it IS that answer correctly rounded to the literal's own precision. That
// catches six digits, nine digits, seventeen digits and every truncation between,
// without anybody keeping a list of renderings complete. The three-shape list
// from the one tolerance derivation is swept as well, because it is what the
// class's own printed precision looks like and it costs nothing to keep.
//
// AND IT IS PROVEN WITH ALL THREE SHAPES OF ALL EIGHTEEN FIELDS. Every graded
// answer is planted at full float precision, at nine significant digits and at
// its class's printed precision, and the guard must go red for each of the
// fifty-four plants. A not-trigger-happy control then proves it stays green on
// the teaching figures the panels actually print.
//
// IT ALSO NEVER EMPTIES ITSELF, in three ways. The file list it sweeps is
// asserted, so a rename or a deletion fails instead of quietly reducing the sweep
// to nothing. A PERMANENT PLANTED LEAK sits in the guard's own surface and must
// be found on every run, so the detector cannot silently stop working. And an
// empty or tiny surface is REFUSED rather than called clean. The wave inputs are
// read through tools/course-waves/waveInputs.mjs, which THROWS and names the file
// when an input is missing: no existsSync, no return, no skipIf, because a gate
// that empties itself when its subject is missing reports success without
// examining anything, which is this programme's most repeated defect.
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  GRADED_FIELDS, gradedRenderings, gradedClassOf, gradedTolerance, PRINTED_DECIMALS,
} from './gradedTolerance.js';
import { waveInput } from '../../../../../tools/course-waves/waveInputs.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const WAVE_NAME = 'heattransfer';
const FIELDS_JSON = waveInput(WAVE_NAME, 'fields.json');
const FIELDS = JSON.parse(fs.readFileSync(FIELDS_JSON, 'utf8'));
/** The course page reads the lab too, so it is swept exactly as a panel is. */
const LEARNING_PAGE = path.resolve(HERE, '../../../../pages/apps/HeatTransferLearningPage.jsx');

/**
 * The sources this guard sweeps. Every non-test file in the panel directory, plus
 * the course learning page. THE LIST IS ASSERTED below, so a panel added without
 * adding it here fails, and a panel renamed away fails too.
 */
const EXPECTED_FILES = [
  'gradedTolerance.js',
  'heattransferLab.js',
  'panelBits.jsx',
  'ExchangerExplorer.jsx',
  'CoefficientExplorer.jsx',
  'RatingExplorer.jsx',
  'HeatTransferLearningPage.jsx',
];
/** The one file that may call the engine. Every other swept file must not. */
const THE_LAB = 'heattransferLab.js';
/** The one file that may name a graded field key: it is the answer key's own table. */
const THE_DERIVATION = 'gradedTolerance.js';

const readPage = () => {
  if (!fs.existsSync(LEARNING_PAGE)) {
    throw new Error(`the course learning page is missing: ${LEARNING_PAGE}. `
      + 'It imports the teaching lab, so it is swept as a panel is, and a rename fails here '
      + 'rather than emptying the sweep that reads it.');
  }
  return fs.readFileSync(LEARNING_PAGE, 'utf8');
};

const sources = fs
  .readdirSync(HERE)
  .filter((f) => (f.endsWith('.js') || f.endsWith('.jsx')) && !f.includes('.test.'))
  .map((f) => ({ file: f, text: fs.readFileSync(path.join(HERE, f), 'utf8') }))
  .concat([{ file: 'HeatTransferLearningPage.jsx', text: readPage() }]);

// ---------------------------------------------------------------------------
// THE DETECTOR. Numeric first, then the three renderings from the one
// derivation, so neither half can be the only thing looking.
// ---------------------------------------------------------------------------

const DECIMAL_LITERAL = /\d+\.\d+(?:[eE][-+]?\d+)?/g;
/**
 * AND A BARE INTEGER, WHICH IS A HOLE THE FOUNDATION'S GUARD STILL CARRIED.
 *
 * One of this wave's eighteen graded answers is a WHOLE NUMBER. Its full-float
 * rendering and its nine-significant-digit rendering are both the bare digit
 * string with no decimal point in it, and every rendering list in this programme
 * drops those on purpose, because a bare 68 sits inside a longer number and would
 * report a leak on any page carrying a year. MEASURED: a panel printing that
 * answer as `{4099440}` walked straight past both halves of this detector until
 * this line was added.
 *
 * The fix is not to widen the lists. It is to match a STANDALONE integer of at
 * least six digits, exactly, which is long enough that a collision with an honest
 * constant is a real coincidence rather than the normal case. This wave's own
 * sources carry 20000000 and 15500000 as teaching inputs and neither is a graded
 * answer, so the floor is doing what it is there for.
 */
const INTEGER_LITERAL = /(?<![\d.])\d{6,}(?![\d.])/g;
/**
 * SIX SIGNIFICANT DIGITS IS A FLOOR AND NOT A THRESHOLD. Below it a panel's
 * honest inputs collide with a graded answer by arithmetic coincidence rather
 * than by leaking anything: this wave's teaching fields carry 0.55, 0.782 and
 * 14.7, and a floor is what keeps those out of the report. Anything shorter is
 * covered by the lab suite's numeric leak sweep, which walks every value a panel
 * can reach with a cushion around the grading band.
 */
const SIG_FLOOR = 6;

const significantDigits = (lit) => {
  const mantissa = lit.split(/[eE]/)[0].replace('.', '').replace(/^0+/, '');
  return mantissa.replace(/0+$/, '').length || 1;
};

/** Every rendering of every graded answer, from the one derivation. */
const allRenderings = () => FIELDS.flatMap(([, key, value]) => {
  const { cls } = gradedClassOf(key);
  return gradedRenderings(value, cls).map((s) => ({ key, s }));
});

/**
 * What a text prints of the answer key, both ways round. The numeric half reads
 * every decimal literal and asks whether it IS a graded answer at its own
 * precision; the string half asks whether any of the three renderings appears
 * verbatim. A hit from either is a leak.
 */
const printedIn = (text) => {
  const hits = [];
  const literals = text.match(DECIMAL_LITERAL) || [];
  const integers = text.match(INTEGER_LITERAL) || [];
  FIELDS.forEach(([tier, key, value]) => {
    if (!Number.isFinite(value)) return;
    literals.forEach((lit) => {
      const sig = significantDigits(lit);
      if (sig < SIG_FLOOR || sig > 21) return;
      if (Number(lit) === Number(Math.abs(value).toPrecision(sig))) {
        hits.push({ key, s: lit, how: `numeric, ${sig} significant digits, ${tier}` });
      }
    });
    if (Number.isInteger(value)) {
      integers.forEach((lit) => {
        if (Number(lit) === Math.abs(value)) {
          hits.push({ key, s: lit, how: `a bare whole number, ${tier}` });
        }
      });
    }
  });
  allRenderings().forEach(({ key, s }) => {
    if (text.includes(s)) hits.push({ key, s, how: 'rendering from the derivation' });
  });
  return [...new Map(hits.map((h) => [`${h.key}=${h.s}`, h])).values()];
};

/**
 * A PERMANENT PLANTED LEAK, in the guard's own surface rather than in a panel.
 *
 * WHY IT IS HERE. Every negative control below fires inside its own test, so all
 * of them could be deleted or skipped together and the per-file sweeps would stay
 * green while checking nothing. This plant is swept on EVERY run, by the same
 * detector the per-file sweeps use, at a rendering that is on none of the three
 * lists: `toFixed(12)`. If the detector ever stops working, this goes quiet and
 * the test below fails, whatever happened to the controls.
 */
const PERMANENT_PLANT_KEY = 'ubit_u_clean';
const PERMANENT_PLANT = (() => {
  const row = FIELDS.find(([, k]) => k === PERMANENT_PLANT_KEY);
  return `a permanent plant, twelve decimals: ${row[2].toFixed(12)}`;
})();

/** The floors a surface has to clear before this guard may call anything clean. */
const MIN_FILES = 7;
const MIN_BYTES_PER_FILE = 200;
/** MEASURED on this wave: 118 decimal literals and 24 standalone six-digit
 *  integers across the seven swept files. The floor is set below the measurement
 *  so an ordinary edit does not trip it, and far above what a gutted surface
 *  would carry. */
const MIN_LITERALS = 100;

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
    sources.forEach((s) => expect(s.text.length, s.file).toBeGreaterThan(MIN_BYTES_PER_FILE));
  });

  it('THE SURFACE IS REFUSED WHEN IT IS EMPTY OR TINY, rather than called clean', () => {
    // A guard whose subject has gone missing must fail. These three floors are the
    // difference between "nothing was found" and "nothing was looked at", and the
    // controls below prove each of them can fire.
    expect(sources.length, 'fewer files than this wave shipped').toBeGreaterThanOrEqual(MIN_FILES);
    const literals = sources.flatMap((s) => (s.text.match(DECIMAL_LITERAL) || [])
      .concat(s.text.match(INTEGER_LITERAL) || []));
    expect(literals.length, 'the swept sources carry almost no numbers, so this sweep is vacuous')
      .toBeGreaterThanOrEqual(MIN_LITERALS);
    // CONTROL ON THE REFUSAL ITSELF: an empty surface and a one-line surface both
    // fail these floors, so the floors are not decoration.
    const emptySurface = [];
    const tinySurface = [{ file: 'tiny.jsx', text: 'const a = 1;\n' }];
    expect(emptySurface.length >= MIN_FILES).toBe(false);
    expect(tinySurface.length >= MIN_FILES).toBe(false);
    expect((tinySurface[0].text.match(DECIMAL_LITERAL) || []).length >= MIN_LITERALS).toBe(false);
    expect(tinySurface[0].text.length >= MIN_BYTES_PER_FILE).toBe(false);
  });

  it('THE PERMANENT PLANT is still caught, so the detector cannot have stopped working', () => {
    const hits = printedIn(PERMANENT_PLANT);
    expect(hits.map((h) => h.key), 'the permanent plant went undetected, so this guard is blind')
      .toContain(PERMANENT_PLANT_KEY);
    // And it is a rendering NONE of the three lists carries, so the numeric half
    // is what found it.
    const { cls } = gradedClassOf(PERMANENT_PLANT_KEY);
    const value = FIELDS.find(([, k]) => k === PERMANENT_PLANT_KEY)[2];
    gradedRenderings(value, cls).forEach((s) => expect(PERMANENT_PLANT).not.toContain(s));
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

  it('NEGATIVE CONTROL: ALL EIGHTEEN at NINE SIGNIFICANT DIGITS are caught', () => {
    const missed = [];
    FIELDS.forEach(([, key, value]) => {
      const planted = `const label = 'the answer is ${value.toPrecision(9).replace(/\.?0+$/, '')}';`;
      if (!printedIn(planted).map((h) => h.key).includes(key)) missed.push(key);
    });
    expect(missed, 'these graded answers walked through at nine significant digits').toEqual([]);
  });

  it('NEGATIVE CONTROL: ALL EIGHTEEN at FULL FLOAT PRECISION are caught', () => {
    // THIS IS THE SHAPE THE FC1-STYLE GUARD WALKED PAST, on nine of FC4's
    // eighteen fields. The plant prints the same quantity as the one above, so the
    // only difference between the two is the rendering.
    const missed = [];
    const alsoAtNineDigits = [];
    FIELDS.forEach(([, key, value]) => {
      const nine = value.toPrecision(9).replace(/\.?0+$/, '');
      const planted = `const label = \`the answer is ${String(value)}\`;`;
      if (!planted.includes(nine)) alsoAtNineDigits.push(key);
      if (!printedIn(planted).map((h) => h.key).includes(key)) missed.push(key);
    });
    expect(missed, 'these graded answers walked through at full float precision').toEqual([]);
    // MEASURED: how many of the eighteen a nine-digit grep would have MISSED here.
    // It is the count that made this guard worth rewriting.
    expect(alsoAtNineDigits.length, 'no field distinguishes the two renderings on this wave, so this control proves nothing')
      .toBeGreaterThan(0);
  });

  it('NEGATIVE CONTROL: ALL EIGHTEEN at the CLASS PRINTED PRECISION are caught', () => {
    const missed = [];
    FIELDS.forEach(([, key, value]) => {
      const { cls } = gradedClassOf(key);
      const dp = PRINTED_DECIMALS[cls];
      const planted = `<span>{'${value.toFixed(dp)}'}</span>`;
      if (!printedIn(planted).map((h) => h.key).includes(key)) missed.push(`${key} at ${dp} decimals`);
    });
    expect(missed, 'these graded answers walked through at the precision the course prints').toEqual([]);
  });

  it('CONTROL: A NOT TRIGGER HAPPY GUARD. The teaching figures are not reported', () => {
    // Every one of these is a figure the panels DO print, straight out of the
    // teaching digest. If the guard flagged any of them it would be unusable, and
    // every wave would learn to ignore it.
    const teaching = [
      'const uDirty = 92.110348; const uClean = 134.459410;',
      'const re = 44051.846000; const pr = 15.119375; const hi = 547.762384;',
      'const lmtd = 130.064846; const arithmetic = 132.812500;',
      'const area = 229.543151; const actual = 232.477856; const overshoot = 1.278498;',
      'const ua = 234565.8720; const eff = 0.645161; const ntu = 1.172829;',
      'const bundle = 9.899233; const shell = 12.399233;',
      'const fanBhp = 94.003933; const motorHp = 102.178189;',
      'const ratio = 1.127984; const thinnest = 1.002005;',
    ];
    teaching.forEach((t) => expect(printedIn(t), `a teaching figure was reported as a leak: ${t}`).toEqual([]));
  });

  sources.forEach(({ file, text }) => {
    it(`${file} prints none of the eighteen graded answers, in any rendering`, () => {
      const hits = printedIn(text);
      expect(hits.map((h) => `${h.key}=${h.s} (${h.how})`), `${file} prints a graded capstone answer`).toEqual([]);
    });

    it(`${file} names no capstone unit`, () => {
      // THE DERIVATION IS THE ONE EXEMPTION, by name and with a reason: it is the
      // answer key's own tolerance table, not a panel, and it cannot list the
      // eighteen graded fields without naming the units they belong to. Every
      // OTHER file swept here is a panel, the lab or the course page, and may not
      // name one.
      const hits = [...new Set([...text.matchAll(/(?:amenam|ubit|okwori)\w*/gi)].map((x) => x[0].toLowerCase()))];
      if (file === THE_DERIVATION) {
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
      // THE LAB IS THE ONE FILE THAT CALLS THE ENGINE, which is the whole point of
      // having a lab: one module reads the engine and every panel reads the module,
      // so a panel cannot become a second source of truth. Every other swept file
      // must not reach the engine at all.
      if (file === THE_LAB) {
        expect(text, 'the lab has stopped calling the engine').toMatch(/@petrolord\/engines/);
      } else {
        expect(text, `${file} imports an engine directly`).not.toMatch(/@petrolord\/engines/);
      }
      expect(text, `${file} reads a clock`).not.toMatch(/new Date\(|Date\.now|Math\.random/);
    });
  });
});
