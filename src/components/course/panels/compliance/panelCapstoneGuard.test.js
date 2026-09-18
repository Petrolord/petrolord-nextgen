// A PANEL MAY NOT PRINT A GRADED CAPSTONE ANSWER.
//
// Every one of this course's eighteen graded answers is a WHOLE NUMBER: a day
// count, an age, a count or a percent the engine has already rounded. So the
// comparison is by WHOLE TOKEN, never by substring: a graded 55 must be caught
// as `55` and as `-55`, and must not be reported inside 2055, 5.5 or a date.
// The token rule is the one gate_promptleak.py uses on the capstone prompts: a
// run of digits, optionally signed, with no word character, dot or hyphen
// before it and no word character or dot after it. That keeps every
// YYYY-MM-DD date and every Tailwind class like h-56 out of the report, and
// catches the answer written into a label, a prop or a slider bound.
//
// IT ALSO REFUSES THE FIVE DATES THE ENGINE DERIVES on the way to a graded day
// count (the rolled due date, the period start and the review dates). A source
// that prints one of those has turned a graded field into counting days on a
// calendar. They are READ FROM THE ENGINE here, from the capstone's own
// records, exactly as gate_promptleak.py reads them, rather than typed. This
// test is the only file in the directory that reads the capstone records, and it
// reads them to know what to refuse.
//
// IT NEVER EMPTIES ITSELF. The file list it sweeps is asserted, a PERMANENT
// PLANT built from the answer key is swept by the same detector on every run and
// must be found, and a tiny or empty surface is refused rather than called
// clean. Every wave input is read through tools/course-waves/waveInputs.mjs,
// which throws and names the file when one is missing.
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as CAL from '@petrolord/engines/engines/assurance/calendar.js';
import * as C from '@petrolord/engines/engines/assurance/complianceStatus.js';
import * as D from '@petrolord/engines/engines/assurance/documentControl.js';
import { waveInput } from '../../../../../tools/course-waves/waveInputs.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const WAVE_NAME = 'compliance';
const FIELDS = JSON.parse(fs.readFileSync(waveInput(WAVE_NAME, 'fields.json'), 'utf8'));
const K = await import(pathToFileURL(waveInput(WAVE_NAME, 'compliance_fields_capstone.mjs')).href);
const LEARNING_PAGE = path.resolve(HERE, '../../../../pages/apps/ComplianceLearningPage.jsx');

const EXPECTED_FILES = [
  'complianceLab.js',
  'panelBits.jsx',
  'RegisterExplorer.jsx',
  'PlanExplorer.jsx',
  'ReadinessExplorer.jsx',
  'ComplianceLearningPage.jsx',
];
const THE_LAB = 'complianceLab.js';

const readPage = () => {
  if (!fs.existsSync(LEARNING_PAGE)) {
    throw new Error(`the course learning page is missing: ${LEARNING_PAGE}. It is swept as a panel is, and a rename fails here.`);
  }
  return fs.readFileSync(LEARNING_PAGE, 'utf8');
};

const sources = fs
  .readdirSync(HERE)
  .filter((f) => (f.endsWith('.js') || f.endsWith('.jsx')) && !f.includes('.test.'))
  .map((f) => ({ file: f, text: fs.readFileSync(path.join(HERE, f), 'utf8') }))
  .concat([{ file: 'ComplianceLearningPage.jsx', text: readPage() }]);

// ---------------------------------------------------------------------------
// THE DETECTOR.
// ---------------------------------------------------------------------------

/** gate_promptleak.py's number token, signed or bare, whole. */
const TOKEN = /(?<![\w.-])-?\d+(?:\.\d+)?(?![\w.])/g;
const GRADED = new Map(FIELDS.map(([tier, key, value]) => [Math.abs(value), `${tier}.${key}`]));

/** The five dates the engine derives on the way to a graded field, read from the engine. */
const DERIVED = (() => {
  const o = Object.fromEntries(K.EKPE_OBLIGATIONS.map((x) => [x.id, x]));
  const [d1, d2] = K.EKPE_DOCUMENTS;
  return [
    C.rollForward(o.e2.due_date, o.e2.frequency),
    C.periodStart(o.e3.due_date, o.e3.frequency),
    C.rollForward(o.e4.due_date, o.e4.frequency),
    D.nextReviewDate(d1.issue_date, d1.review_period_months),
    D.nextReviewDate(d2.issue_date, d2.review_period_months),
  ].map((d) => CAL.toDateOnlyString(d));
})();

/** The capstone's own records, by name. */
const CAPSTONE_NAMES = /ekpe|utapate|obeakpu|QAP-2026-022/gi;

const leaksIn = (text) => {
  const hits = [];
  (text.match(TOKEN) || []).forEach((tok) => {
    const v = Math.abs(Number(tok));
    if (GRADED.has(v)) hits.push(`${tok} is the graded value of ${GRADED.get(v)}`);
  });
  DERIVED.forEach((d) => { if (text.includes(d)) hits.push(`${d} is a date the engine derives on the way to a graded field`); });
  return hits;
};

/**
 * A PERMANENT PLANT, swept by the same detector on every run. It is built from
 * the answer key at run time, signed, so it is no literal in this file, and if
 * the detector ever stops working it goes quiet and the test below fails.
 */
const PERMANENT_PLANT = `a permanent plant: const due = ${FIELDS[16][2]};`;

const MIN_TOKENS = 400;

describe('THE PANEL GUARD: no panel, lab or page source prints a graded capstone answer', () => {
  it('the answer key is present, eighteen whole numbers', () => {
    expect(FIELDS).toHaveLength(18);
    FIELDS.forEach(([tier, key, value, tol]) => {
      expect(['beginner', 'intermediate', 'advanced']).toContain(tier);
      expect(typeof key).toBe('string');
      expect(Number.isInteger(value), `${key} is not a whole number`).toBe(true);
      expect(tol).toBeGreaterThan(0);
    });
    expect(GRADED.size).toBe(18);
  });

  it('the five engine-derived dates are read, and they are real days', () => {
    expect(DERIVED).toHaveLength(5);
    DERIVED.forEach((d) => expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/));
    expect(new Set(DERIVED).size).toBe(5);
  });

  it('the sources to sweep are the ones this course ships, so a rename cannot empty the gate', () => {
    expect(sources.map((s) => s.file).sort()).toEqual([...EXPECTED_FILES].sort());
    sources.forEach((s) => expect(s.text.length, s.file).toBeGreaterThan(2000));
    const tokens = sources.flatMap((s) => s.text.match(TOKEN) || []);
    expect(tokens.length, 'the swept sources carry almost no numbers, so this sweep is vacuous').toBeGreaterThanOrEqual(MIN_TOKENS);
    // CONTROL: a tiny surface fails the same floors.
    expect(('const a = 1;'.match(TOKEN) || []).length >= MIN_TOKENS).toBe(false);
  });

  it('THE PERMANENT PLANT is caught, so the detector cannot have stopped working', () => {
    expect(leaksIn(PERMANENT_PLANT).length).toBeGreaterThan(0);
  });

  it('NEGATIVE CONTROL: all eighteen, bare and signed, are caught as whole tokens', () => {
    const missed = [];
    FIELDS.forEach(([, key, value]) => {
      [`{${Math.abs(value)}}`, `value={-${Math.abs(value)}}`, `max: ${Math.abs(value)},`, `'${value} days'`].forEach((plant) => {
        if (!leaksIn(plant).length) missed.push(`${key} in ${plant}`);
      });
    });
    expect(missed).toEqual([]);
  });

  it('NEGATIVE CONTROL: each engine-derived date is caught', () => {
    DERIVED.forEach((d) => expect(leaksIn(`<Tile value="${d}" />`).length, d).toBe(1));
  });

  it('CONTROL: A NOT TRIGGER HAPPY GUARD. Dates, classes and longer numbers are not reported', () => {
    const graded = [...GRADED.keys()];
    const clean = [
      "const due = '2026-10-15'; const also = '2025-11-03';",
      'className="h-56 mt-3 text-[11px]"',
      `const long = ${graded[0]}0${graded[0]}; const dec = ${graded[0]}.5;`,
      "const code = 'REG-2026-012';",
    ];
    clean.forEach((t) => expect(leaksIn(t), t).toEqual([]));
  });

  sources.forEach(({ file, text }) => {
    it(`${file} prints none of the eighteen graded answers and none of the five derived dates`, () => {
      expect(leaksIn(text)).toEqual([]);
    });

    it(`${file} names no capstone record`, () => {
      expect([...new Set((text.match(CAPSTONE_NAMES) || []).map((x) => x.toLowerCase()))]).toEqual([]);
    });

    it(`${file} carries no em dash and no en dash`, () => {
      expect(text).not.toMatch(/[–—]/);
    });

    it(`${file} reaches the engine only through the lab, and reads no clock`, () => {
      if (file === THE_LAB) expect(text).toMatch(/@petrolord\/engines\/engines\/assurance/);
      else expect(text).not.toMatch(/@petrolord\/engines/);
      const code = text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
      expect(code).not.toMatch(/new Date\(\s*\)|Date\.now|performance\.now|Math\.random/);
    });
  });
});
