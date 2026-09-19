// A PANEL MAY NOT PRINT A GRADED CAPSTONE ANSWER, IN ANY RENDERING AT ALL.
//
// FC6's pattern. Every one of this course's eighteen graded answers is a
// fraction, so each is rendered the ways a panel author could print it: to four
// decimals (the digest's precision and the capstone's), to two, at nine
// significant digits and at full float precision, signed and unsigned. Every
// number literal in every swept source is read out as a WHOLE TOKEN and compared
// with those renderings, so a graded 0.45 is caught as `0.45` and `-0.45` and is
// not reported inside 10.4512. Beside the renderings, a numeric half catches any
// literal of six or more significant digits that IS a graded answer rounded to
// its own precision, so a truncation nobody listed is caught too.
//
// IT ALSO REFUSES THE CAPSTONE'S NAMES: the three records (IDAMA, OGBELE, ONNE)
// and the crudes they carry. The list is anchored: each name must appear in the
// capstone prompts, so the list cannot rot into names that were never there.
//
// IT NEVER EMPTIES ITSELF. The file list it sweeps is asserted, a PERMANENT
// PLANT built from the answer key at run time is swept by the same detector on
// every run and must be found, and a tiny or empty surface is refused rather
// than called clean. Every wave input is read through
// tools/course-waves/waveInputs.mjs, which throws and names a missing file.
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { waveInput } from '../../../../../tools/course-waves/waveInputs.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const WAVE_NAME = 'crude';
const FIELDS = JSON.parse(fs.readFileSync(waveInput(WAVE_NAME, 'fields.json'), 'utf8'));
const CAPSTONE = JSON.parse(fs.readFileSync(waveInput(WAVE_NAME, 'capstone.json'), 'utf8'));
const LEARNING_PAGE = path.resolve(HERE, '../../../../pages/apps/CrudeLearningPage.jsx');

const EXPECTED_FILES = [
  'crudeLab.js',
  'panelBits.jsx',
  'AssayExplorer.jsx',
  'ValuationExplorer.jsx',
  'RecipeExplorer.jsx',
  'CrudeLearningPage.jsx',
];
const THE_LAB = 'crudeLab.js';

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
  .concat([{ file: 'CrudeLearningPage.jsx', text: readPage() }]);

// ---------------------------------------------------------------------------
// THE DETECTOR.
// ---------------------------------------------------------------------------

/** A number token, whole: no word character, dot or digit either side. The sign is read off separately. */
const TOKEN = /(?<![\w.])\d+(?:\.\d+)?(?:[eE][-+]?\d+)?(?![\w.])/g;
const SIG_FLOOR = 6;

/** Every rendering of every graded answer, unsigned; a signed print is the same token behind a minus. */
const renderingsOf = (value) => {
  const v = Math.abs(value);
  return [...new Set([v.toFixed(4), v.toFixed(2), String(v), v.toPrecision(9).replace(/\.?0+$/, '')])]
    .filter((s) => s.includes('.'));
};
const RENDERINGS = FIELDS.flatMap(([tier, key, value]) => renderingsOf(value).map((s) => ({ key: `${tier}.${key}`, s })));

const significantDigits = (lit) => {
  const mantissa = lit.split(/[eE]/)[0].replace('.', '').replace(/^0+/, '');
  return mantissa.replace(/0+$/, '').length || 1;
};

const leaksIn = (text) => {
  const hits = [];
  (text.match(TOKEN) || []).forEach((tok) => {
    RENDERINGS.forEach(({ key, s }) => { if (tok === s) hits.push(`${tok} is a rendering of ${key}`); });
    if (tok.includes('.')) {
      const sig = significantDigits(tok);
      if (sig >= SIG_FLOOR && sig <= 21) {
        FIELDS.forEach(([tier, key, value]) => {
          if (Number(tok) === Number(Math.abs(value).toPrecision(sig))) hits.push(`${tok} is ${tier}.${key} at ${sig} significant digits`);
        });
      }
    }
  });
  return [...new Set(hits)];
};

/** The capstone's records and the crudes they carry, each anchored to the capstone prompts below. */
const CAPSTONE_NAMES = ['IDAMA', 'OGBELE', 'ONNE', 'Opuama', 'Abiteye', 'Omoku', 'Light naphtha', 'Alkylate'];
const NAME_RE = new RegExp(`\\b(?:${CAPSTONE_NAMES.join('|')})\\b`, 'gi');
const PROMPTS = Object.values(CAPSTONE.tiers).map((t) => `${t.record} ${t.prompt}`).join('\n');

/**
 * A PERMANENT PLANT, swept by the same detector on every run. It is built from
 * the answer key at run time, signed and at eleven decimals, a rendering on none
 * of the lists, so the numeric half is what must find it.
 */
const PERMANENT_PLANT = `a permanent plant: const x = -${Math.abs(FIELDS[15][2]).toFixed(11)};`;

const MIN_TOKENS = 400;

/**
 * TWO TYPED INPUTS COINCIDE WITH A TWO-DECIMAL RENDERING, and both are the live
 * Suite apps' own opening examples, copied into the wave's fields file from the
 * Suite source and into the lab's VERBATIM block, which crudeLab.test.js pins
 * byte for byte to that file. They are exempt BY EXACT LINE, inside that block
 * only, and only from the two-decimal comparison: the four-decimal, full and
 * numeric halves still sweep them, and a dead exemption fails below.
 */
const VERBATIM_EXEMPT = [
  ['0.45', "  { id: 'sms', name: 'Medium sour (example)', api: 24.0, sulfurWtPct: 2.20, tanMgKohG: 0.45, nitrogenWtPct: 0.22,"],
  ['0.80', "  { id: 'reformate', name: 'Reformate', cost: 92, sg: 0.80, density: 0.800, ron: 100, mon: 89, sulfurPpm: 2, rvp: 3.0, minVolume: 0, maxVolume: 600 },"],
];
const BEGIN = '// ---- BEGIN VERBATIM crude_fields.mjs ----';
const END = '// ---- END VERBATIM crude_fields.mjs ----';
/** The lab with each exempt line's exempt token removed, inside the verbatim block only. */
const withExemptions = (text) => {
  const a = text.indexOf(BEGIN);
  const b = text.indexOf(END);
  if (a < 0 || b < a) return text;
  let block = text.slice(a, b);
  VERBATIM_EXEMPT.forEach(([tok, line]) => { block = block.replace(line, line.replace(tok, 'EXEMPT')); });
  return text.slice(0, a) + block + text.slice(b);
};

describe('THE PANEL GUARD: no panel, lab or page source prints a graded capstone answer', () => {
  it('the answer key is present, eighteen fractions graded at four decimals', () => {
    expect(FIELDS).toHaveLength(18);
    FIELDS.forEach(([tier, key, value, tol]) => {
      expect(['beginner', 'intermediate', 'advanced']).toContain(tier);
      expect(typeof key).toBe('string');
      expect(Number.isFinite(value) && !Number.isInteger(value), `${key} is not a fraction`).toBe(true);
      expect(tol).toBeGreaterThan(0);
    });
    expect(RENDERINGS.length).toBeGreaterThanOrEqual(18 * 3);
  });

  it('every capstone name the guard refuses is in the capstone prompts', () => {
    CAPSTONE_NAMES.forEach((n) => expect(PROMPTS.toLowerCase(), n).toContain(n.toLowerCase()));
    expect(Object.values(CAPSTONE.tiers).map((t) => t.record).sort()).toEqual(['IDAMA', 'OGBELE', 'ONNE']);
  });

  it('the sources to sweep are the ones this course ships, so a rename cannot empty the gate', () => {
    expect(sources.map((s) => s.file).sort()).toEqual([...EXPECTED_FILES].sort());
    sources.forEach((s) => expect(s.text.length, s.file).toBeGreaterThan(2000));
    const tokens = sources.flatMap((s) => s.text.match(TOKEN) || []);
    expect(tokens.length, 'the swept sources carry almost no numbers, so this sweep is vacuous').toBeGreaterThanOrEqual(MIN_TOKENS);
    // CONTROL: a tiny surface fails the same floor.
    expect(('const a = 1;'.match(TOKEN) || []).length >= MIN_TOKENS).toBe(false);
  });

  it('THE PERMANENT PLANT is caught, so the detector cannot have stopped working', () => {
    expect(leaksIn(PERMANENT_PLANT).length).toBeGreaterThan(0);
  });

  it('NEGATIVE CONTROL: all eighteen, at four decimals and at two, signed and bare, are caught', () => {
    const missed = [];
    FIELDS.forEach(([, key, value]) => {
      const v = Math.abs(value);
      [v.toFixed(4), v.toFixed(2)].forEach((r) => {
        [`{${r}}`, `value={-${r}}`, `max: ${r},`, `'${r} $/bbl'`, `-${r}`].forEach((plant) => {
          if (!leaksIn(plant).length) missed.push(`${key} in ${plant}`);
        });
      });
      [String(value), value.toPrecision(9)].forEach((plant) => { if (!leaksIn(plant).length) missed.push(`${key} in ${plant}`); });
    });
    expect(missed).toEqual([]);
  });

  it('NEGATIVE CONTROL: each capstone name is caught, and a word that merely contains one is not', () => {
    CAPSTONE_NAMES.forEach((n) => expect(`the ${n} case`.match(NAME_RE), n).not.toBeNull());
    expect('connect the channel'.match(NAME_RE)).toBeNull();
  });

  it('CONTROL: A NOT TRIGGER HAPPY GUARD. Longer numbers, classes and teaching figures are not reported', () => {
    const [, , v0] = FIELDS[0];
    const clean = [
      `const long = 1${v0.toFixed(4)}; const more = ${v0.toFixed(4)}7;`,
      'className="h-56 mt-3 text-[11px]"',
      'const api = 32.8173; const sulfur = 0.2642; const netback = 64.9473; const cost = 698701.5605;',
    ];
    clean.forEach((t) => expect(leaksIn(t), t).toEqual([]));
  });

  it('A DEAD EXEMPTION FAILS: each exempt line is in the verbatim block, and without the exemption it is caught', () => {
    const lab = sources.find((x) => x.file === THE_LAB).text;
    const block = lab.slice(lab.indexOf(BEGIN), lab.indexOf(END));
    VERBATIM_EXEMPT.forEach(([tok, line]) => {
      expect(block, tok).toContain(`${line}\n`);
      expect(leaksIn(line).length, `${tok} no longer collides, so drop its exemption`).toBeGreaterThan(0);
      expect(leaksIn(line.replace(tok, 'EXEMPT'))).toEqual([]);
    });
  });

  sources.forEach(({ file, text }) => {
    it(`${file} prints none of the eighteen graded answers`, () => {
      expect(leaksIn(file === THE_LAB ? withExemptions(text) : text)).toEqual([]);
    });

    it(`${file} names no capstone record and none of its crudes`, () => {
      expect([...new Set((text.match(NAME_RE) || []).map((x) => x.toLowerCase()))]).toEqual([]);
    });

    it(`${file} carries no em dash and no en dash`, () => {
      expect(text).not.toMatch(/[–—]/);
    });

    it(`${file} reaches the engine only through the lab, and reads no clock`, () => {
      if (file === THE_LAB) expect(text).toMatch(/@petrolord\/engines\/engines\/downstream/);
      else expect(text).not.toMatch(/@petrolord\/engines/);
      const code = text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
      expect(code).not.toMatch(/new Date\(|Date\.now|performance\.now|Math\.random/);
    });
  });
});
