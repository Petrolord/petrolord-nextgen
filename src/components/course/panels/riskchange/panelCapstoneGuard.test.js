// A PANEL MAY NOT PRINT A GRADED CAPSTONE ANSWER, IN ANY RENDERING AT ALL.
//
// THE SHAPE OF THIS WAVE'S ANSWER KEY. All eighteen graded fields are whole
// numbers graded at 0.5, and two of them are calendar dates packed as YYYYMMDD.
// So a leak here is an integer printed as a token, or one of the two dates in
// either of the forms a date takes on these pages: YYYYMMDD or YYYY-MM-DD.
//
// SO THE DETECTOR READS TOKENS, and the sweep is over every file a learner can
// reach: the lab, the shared atoms, the three panels and the course page. A
// standalone integer token is one with no letter, digit, point, hyphen, slash,
// hash or bracket before it and no letter, digit or decimal part after it,
// which keeps a date's month, a CSS opacity and a colour out of the count
// without letting a number at the end of a sentence through.
//
// A WHOLE-NUMBER KEY COLLIDES WITH HONEST TEACHING, and this guard says so rather
// than pretending otherwise. The teaching records carry levels one to five,
// targets, sweep offsets and approval levels, all of them small whole numbers
// the capstone also has among its answers. Every collision is therefore NAMED,
// per file, with the reason it is honest, and the named set must be EXACTLY the
// set found: a new collision fails, and so does a named one that has gone away.
// The three panels are held to an EMPTY set. The two dates and every answer of
// three digits or more are allowed nowhere at all.
//
// AND THE CAPSTONE'S RECORDS ARE SWEPT BY NAME. IGBARA, OKOMU and ETIM, every
// record id the capstone generator writes, and every capstone record title must
// appear in no swept file.
//
// IT NEVER EMPTIES ITSELF. The file list is asserted, a permanent plant is swept
// on every run, every answer is planted in every rendering and must be caught,
// and the wave inputs are read through waveInputs.mjs, which throws on a missing
// file rather than skipping.
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { waveInput } from '../../../../../tools/course-waves/waveInputs.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const WAVE_NAME = 'riskchange';
const FIELDS = JSON.parse(fs.readFileSync(waveInput(WAVE_NAME, 'fields.json'), 'utf8'));
const CAPSTONE = fs.readFileSync(waveInput(WAVE_NAME, 'riskchange_fields_capstone.mjs'), 'utf8');
const TEACHING = fs.readFileSync(waveInput(WAVE_NAME, 'riskchange_fields.mjs'), 'utf8');
const PAGE_FILE = 'RiskChangeLearningPage.jsx';
const LEARNING_PAGE = path.resolve(HERE, '../../../../pages/apps', PAGE_FILE);

/** Every file this guard sweeps. Asserted below, so a rename or an addition fails. */
const EXPECTED_FILES = [
  'riskchangeLab.js',
  'panelBits.jsx',
  'RiskExplorer.jsx',
  'ChangeExplorer.jsx',
  'ReviewExplorer.jsx',
  PAGE_FILE,
];

const readPage = () => {
  if (!fs.existsSync(LEARNING_PAGE)) {
    throw new Error(`the course learning page is missing: ${LEARNING_PAGE}. It reads the lab, so it is swept as a panel is.`);
  }
  return fs.readFileSync(LEARNING_PAGE, 'utf8');
};

const sources = fs
  .readdirSync(HERE)
  .filter((f) => (f.endsWith('.js') || f.endsWith('.jsx')) && !f.includes('.test.'))
  .map((f) => ({ file: f, text: fs.readFileSync(path.join(HERE, f), 'utf8') }))
  .concat([{ file: PAGE_FILE, text: readPage() }]);

/**
 * THE NAMED COLLISIONS, each with the reason it is honest. The panels carry none.
 */
const COLLISIONS = {
  // The lab carries the four teaching registers verbatim, and so every small
  // whole number in them: likelihood and impact levels on the one-to-five scale,
  // appetite targets, approval levels, the expiry and ratification sweep offsets
  // and the lesson review sweep. Nothing in the lab names a graded field or a
  // capstone record, which riskchangeLab.test.js asserts.
  'riskchangeLab.js': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12],
  'panelBits.jsx': [],
  'RiskExplorer.jsx': [],
  'ChangeExplorer.jsx': [],
  'ReviewExplorer.jsx': [],
  // Framer-motion's fully opaque entrance state, the same on every course page.
  [PAGE_FILE]: [1],
};

// ---------------------------------------------------------------------------
// THE DETECTOR.
// ---------------------------------------------------------------------------

const TOKEN = /(?<![\w.\-/#[])-?\d+(?![\w]|\.\d)/g;
const isDate = (key) => key.endsWith('_yyyymmdd');
const dashed = (v) => String(v).replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3');

/** Every rendering of every graded answer: the integer, and for a date both forms. */
const renderings = () => FIELDS.flatMap(([, key, value]) => [
  { key, value, s: String(value) },
  ...(isDate(key) ? [{ key, value, s: dashed(value) }] : []),
]);

/** What a text prints of the answer key: integer tokens, and dates as text. */
const printedIn = (text) => {
  const tokens = new Set((text.match(TOKEN) || []).map(Number));
  const hits = [];
  FIELDS.forEach(([, key, value]) => {
    if (tokens.has(value)) hits.push({ key, value, how: 'an integer token' });
    if (isDate(key) && text.includes(dashed(value))) hits.push({ key, value, how: 'a YYYY-MM-DD date' });
  });
  return hits;
};

/** The graded VALUES a text prints, as a sorted set. */
const valuesIn = (text) => [...new Set(printedIn(text).map((h) => h.value))].sort((a, b) => a - b);

/** Answers that may collide nowhere: the dates, and every answer of three digits or more. */
const STRICT = FIELDS.filter(([, key, value]) => isDate(key) || Math.abs(value) >= 100).map(([, , v]) => v);

/** The capstone's own record names, read out of its generator. */
const capstoneIds = [...new Set([...CAPSTONE.matchAll(/\bid: '([A-Z]+-[A-Z0-9]+)'/g)].map((m) => m[1]))]
  .filter((id) => !TEACHING.includes(`'${id}'`));
const capstoneTitles = [...new Set([...CAPSTONE.matchAll(/\btitle: '([^']{12,})'/g)].map((m) => m[1]))];

const PERMANENT_PLANT = `a permanent plant: ${dashed(FIELDS.find(([, k]) => isDate(k))[2])}`;

// ---------------------------------------------------------------------------

describe('THE PANEL GUARD: no panel may print a graded capstone answer', () => {
  it('the wave inputs carry the eighteen whole-number fields, two of them dates, all at 0.5', () => {
    expect(FIELDS).toHaveLength(18);
    FIELDS.forEach(([tier, key, value, tol]) => {
      expect(['beginner', 'intermediate', 'advanced']).toContain(tier);
      expect(typeof key).toBe('string');
      expect(Number.isInteger(value), `${key} is not a whole number`).toBe(true);
      expect(tol).toBe(0.5);
    });
    expect(FIELDS.filter(([, k]) => isDate(k)).map(([, , v]) => v)).toEqual([20261005, 20260819]);
    expect(STRICT.length).toBe(3);
  });

  it('there are sources to sweep, exactly the expected ones, none of them tiny', () => {
    expect(sources.map((s) => s.file).sort()).toEqual([...EXPECTED_FILES].sort());
    expect(Object.keys(COLLISIONS).sort()).toEqual([...EXPECTED_FILES].sort());
    sources.forEach((s) => expect(s.text.length, s.file).toBeGreaterThan(2000));
    const tokens = sources.reduce((a, s) => a + (s.text.match(TOKEN) || []).length, 0);
    expect(tokens, 'the sources carry almost no numbers, so the sweep is vacuous').toBeGreaterThanOrEqual(300);
  });

  it('THE PERMANENT PLANT is caught on every run', () => {
    expect(printedIn(PERMANENT_PLANT).map((h) => h.how)).toContain('a YYYY-MM-DD date');
  });

  it('NEGATIVE CONTROL: every graded answer in every rendering is caught when planted in a panel', () => {
    const missed = [];
    renderings().forEach(({ key, s }) => {
      [`<p>{'${s}'}</p>`, `const label = \`the answer is ${s}.\`;`, `<Tile value="${s}" />`].forEach((planted) => {
        if (!printedIn(planted).some((h) => h.key === key)) missed.push(`${key} as ${planted}`);
      });
    });
    expect(missed).toEqual([]);
    expect(renderings().length).toBe(20);
  });

  it('CONTROL: the detector is not trigger happy on a date\'s month, a CSS opacity or a colour', () => {
    expect(valuesIn("const d = '2026-10-01'; const c = 'bg-red-900/20 text-[#BFFF00]'; const x = 0.5;")).toEqual([]);
    expect(valuesIn('- the lead is 14 days')).toEqual([]);
  });

  it('the capstone record names are read, and there are enough of them to mean something', () => {
    expect(capstoneIds.length).toBeGreaterThanOrEqual(40);
    expect(capstoneTitles.length).toBeGreaterThanOrEqual(12);
  });

  sources.forEach(({ file, text }) => {
    it(`${file} prints exactly its named collisions and nothing else`, () => {
      expect(valuesIn(text), `${file} prints graded values beyond its named collisions`).toEqual(COLLISIONS[file]);
    });

    it(`${file} prints neither date in either form, and no answer of three digits or more`, () => {
      expect(printedIn(text).filter((h) => STRICT.includes(h.value)).map((h) => `${h.key} as ${h.how}`)).toEqual([]);
    });

    it(`${file} names no capstone register, record or title`, () => {
      expect(text).not.toMatch(/IGBARA|OKOMU|ETIM/i);
      expect(capstoneIds.filter((id) => new RegExp(`\\b${id}\\b`).test(text))).toEqual([]);
      expect(capstoneTitles.filter((t) => text.includes(t))).toEqual([]);
    });

    it(`${file} carries no em dash and no en dash, and only the lab reaches an engine`, () => {
      expect(text).not.toMatch(/[–—]/);
      if (file === 'riskchangeLab.js') expect(text).toMatch(/@petrolord\/engines/);
      else expect(text).not.toMatch(/@petrolord\/engines/);
      expect(text).not.toMatch(/Date\.now|Math\.random|new Date\(\s*\)/);
    });
  });
});
