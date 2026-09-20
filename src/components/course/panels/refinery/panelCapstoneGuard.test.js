// A PANEL MAY NOT PRINT A GRADED CAPSTONE ANSWER, IN ANY RENDERING AT ALL.
//
// FC6's pattern. This course's eighteen graded answers are dollars, barrels,
// dollars a barrel, a percent and millions of dollars, most of them with a
// fractional part. Each one is rendered here at the precision the capstone
// prompt GRADES it at (the whole dollar, the whole barrel, the cent, two
// decimals of a percent, four decimals of a million) and at the precision the
// DIGEST prints its class at (precision.json), signed and bare, and at full float
// precision, and none of those renderings may appear as a WHOLE TOKEN in any
// panel, lab or page source. Whole token means no word character or dot before
// it, and no word character or dot-then-digit after it: a graded 14.32 is caught
// in "-14.32" and at the end of a sentence, and is never reported inside 114.32,
// 14.325 or a date.
//
// A NUMERIC HALF STANDS BEHIND THE STRINGS. Every decimal literal of six or more
// significant digits is read out and counts as a leak when it IS a graded answer
// rounded to the literal's own precision, which catches every rendering between
// the listed ones without anybody keeping a list complete.
//
// IT NEVER EMPTIES ITSELF. The file list it sweeps is asserted, a PERMANENT PLANT
// built from the answer key is swept by the same detector on every run and must
// be found, and a tiny or empty surface is refused rather than called clean. Every
// wave input is read through tools/course-waves/waveInputs.mjs, which throws and
// names the file when one is missing.
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { waveInput } from '../../../../../tools/course-waves/waveInputs.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const WAVE_NAME = 'refinery';
const FIELDS = JSON.parse(fs.readFileSync(waveInput(WAVE_NAME, 'fields.json'), 'utf8'));
const PRECISION = JSON.parse(fs.readFileSync(waveInput(WAVE_NAME, 'precision.json'), 'utf8'));
const CAPSTONE = JSON.parse(fs.readFileSync(waveInput(WAVE_NAME, 'capstone.json'), 'utf8'));
const LEARNING_PAGE = path.resolve(HERE, '../../../../pages/apps/RefineryLearningPage.jsx');

const EXPECTED_FILES = [
  'refineryLab.js',
  'panelBits.jsx',
  'ScreenExplorer.jsx',
  'PlanExplorer.jsx',
  'VarianceExplorer.jsx',
  'RefineryLearningPage.jsx',
];
const THE_LAB = 'refineryLab.js';

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
  .concat([{ file: 'RefineryLearningPage.jsx', text: readPage() }]);

// ---------------------------------------------------------------------------
// The precisions. The graded one is what each capstone prompt asks for, and the
// test below proves every prompt asks for it in those words.
// ---------------------------------------------------------------------------

const GRADED_DECIMALS = {
  usd: 0, bbl: 0, per_bbl: 2, pct: 2, mm: 4,
};
const GRADED_WORDS = {
  usd: 'to the whole dollar', bbl: 'to the whole barrel', per_bbl: 'to the cent', pct: 'in percent to two decimals', mm: 'to four decimals',
};
const classOf = (key) => {
  const hits = Object.entries(PRECISION).filter(([, v]) => new RegExp(v.match).test(key)).map(([k]) => k);
  if (hits.length !== 1) throw new Error(`${key} matches ${hits.length} precision classes`);
  return hits[0];
};

const trimZeros = (s) => (s.includes('.') ? s.replace(/\.?0+$/, '') : s);
/** Every rendering of one graded value, bare; the detector adds the sign. */
const renderingsOf = (value, cls) => {
  const a = Math.abs(value);
  return [...new Set([
    a.toFixed(GRADED_DECIMALS[cls]),
    a.toFixed(PRECISION[cls].decimals),
    String(a),
    trimZeros(a.toPrecision(9)),
  ])];
};
const RENDERINGS = FIELDS.flatMap(([tier, key, value]) => renderingsOf(value, classOf(key)).map((s) => ({ tier, key, s })));

// ---------------------------------------------------------------------------
// THE DETECTOR.
// ---------------------------------------------------------------------------

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const tokenRe = (s) => new RegExp(`(?<![\\w.])-?${esc(s)}(?!\\w|\\.\\d)`);
const DECIMAL_LITERAL = /\d+\.\d+/g;
const SIG_FLOOR = 6;
const significantDigits = (lit) => lit.replace('.', '').replace(/^0+/, '').replace(/0+$/, '').length || 1;

const CAPSTONE_NAMES = /\b(?:ikarama|amassoma|koloama|usan|yoho|amenam|okono|qua iboe)\b/gi;

const printedIn = (text) => {
  const hits = [];
  RENDERINGS.forEach(({ key, s }) => {
    if (tokenRe(s).test(text)) hits.push(`${key} as ${s}`);
  });
  (text.match(DECIMAL_LITERAL) || []).forEach((lit) => {
    const sig = significantDigits(lit);
    if (sig < SIG_FLOOR || sig > 21) return;
    FIELDS.forEach(([, key, value]) => {
      if (Number(lit) === Number(Math.abs(value).toPrecision(sig))) hits.push(`${key} as ${lit}, numerically`);
    });
  });
  return [...new Set(hits)];
};

/** A PERMANENT PLANT, built at run time from the answer key at a rendering no list carries. */
const PERMANENT_PLANT = `a permanent plant: const x = ${FIELDS[9][2].toFixed(7)};`;
const MIN_TOKENS = 300;

describe('THE PANEL GUARD: no panel, lab or page source prints a graded capstone answer', () => {
  it('the answer key is present: eighteen finite values, each in one precision class', () => {
    expect(FIELDS).toHaveLength(18);
    FIELDS.forEach(([tier, key, value, tol]) => {
      expect(['beginner', 'intermediate', 'advanced']).toContain(tier);
      expect(Number.isFinite(value), key).toBe(true);
      expect(tol).toBeGreaterThan(0);
      expect(Object.keys(GRADED_DECIMALS)).toContain(classOf(key));
    });
  });

  it('each graded precision is the one its capstone prompt asks for, in its own words', () => {
    const prompts = Object.values(CAPSTONE.tiers).map((t) => t.prompt).join(' ');
    new Set(FIELDS.map(([, key]) => classOf(key))).forEach((cls) => expect(prompts, cls).toContain(GRADED_WORDS[cls]));
  });

  it('the sources to sweep are the ones this course ships, so a rename cannot empty the gate', () => {
    expect(sources.map((s) => s.file).sort()).toEqual([...EXPECTED_FILES].sort());
    sources.forEach((s) => expect(s.text.length, s.file).toBeGreaterThan(2000));
    const tokens = sources.flatMap((s) => s.text.match(/\d+(?:\.\d+)?/g) || []);
    expect(tokens.length, 'the swept sources carry almost no numbers, so this sweep is vacuous').toBeGreaterThanOrEqual(MIN_TOKENS);
    expect(('const a = 1;'.match(/\d+(?:\.\d+)?/g) || []).length >= MIN_TOKENS).toBe(false);
  });

  it('THE PERMANENT PLANT is caught, so the detector cannot have stopped working', () => {
    expect(printedIn(PERMANENT_PLANT).length).toBeGreaterThan(0);
    RENDERINGS.filter((r) => r.key === FIELDS[9][1]).forEach((r) => expect(tokenRe(r.s).test(PERMANENT_PLANT)).toBe(false));
  });

  it('NEGATIVE CONTROL: all eighteen, at the graded and the digest precision, bare and signed, are caught', () => {
    const missed = [];
    FIELDS.forEach(([, key, value]) => {
      const cls = classOf(key);
      [GRADED_DECIMALS[cls], PRECISION[cls].decimals].forEach((d) => {
        const s = Math.abs(value).toFixed(d);
        [`{${s}}`, `value={-${s}}`, `max: ${s},`, `'${s} a barrel.'`, `ends at ${s}.`].forEach((plant) => {
          if (!printedIn(plant).some((h) => h.startsWith(key))) missed.push(`${key} in ${plant}`);
        });
      });
      if (!printedIn(`const f = ${String(value)};`).some((h) => h.startsWith(key))) missed.push(`${key} at full float`);
    });
    expect(missed).toEqual([]);
  });

  it('CONTROL: A NOT TRIGGER HAPPY GUARD. Dates, classes, longer numbers and the teaching figures are not reported', () => {
    const [, , v] = FIELDS[2];
    const clean = [
      "const start = '2027-03-01';",
      'className="h-56 mt-3 text-[11px]"',
      `const longer = 1${v.toFixed(2)}; const more = ${v.toFixed(2)}7;`,
      'const okordia = 83.7900; const abua = 7077935.48; const odioma = -5452450.00; const tax = 196.1780;',
    ];
    clean.forEach((t) => expect(printedIn(t), t).toEqual([]));
  });

  sources.forEach(({ file, text }) => {
    it(`${file} prints none of the eighteen graded answers, in any rendering`, () => {
      expect(printedIn(text)).toEqual([]);
    });

    it(`${file} names no capstone record`, () => {
      expect([...new Set((text.match(CAPSTONE_NAMES) || []).map((x) => x.toLowerCase()))]).toEqual([]);
    });

    it(`${file} carries no em dash and no en dash`, () => {
      expect(text).not.toMatch(/[–—]/);
    });

    it(`${file} reaches the engine only through the lab, and reads no clock`, () => {
      if (file === THE_LAB) expect(text).toMatch(/@petrolord\/engines\/engines\/downstream/);
      else expect(text).not.toMatch(/@petrolord\/engines/);
      const code = text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
      expect(code).not.toMatch(/new Date\(\s*\)|Date\.now|performance\.now|Math\.random/);
    });
  });
});
