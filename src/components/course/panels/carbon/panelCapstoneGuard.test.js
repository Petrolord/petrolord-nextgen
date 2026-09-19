// A PANEL MAY NOT PRINT A GRADED CAPSTONE ANSWER, IN ANY RENDERING AT ALL.
//
// FC6's pattern. Every one of this course's eighteen graded answers is rendered
// the ways a panel author could print it: at the decimals precision.json
// declares for its class (the capstone's own precision, a whole number for the
// gigajoule saving), at two decimals, at nine significant digits and at full
// float precision. Every number literal in every swept source is read out as a
// WHOLE TOKEN and compared with those renderings, so a graded 51.59 is caught as
// `51.59` and `-51.59` and is not reported inside 151.594. Beside the
// renderings, a numeric half catches any literal of six or more significant
// digits that IS a graded answer rounded to that many digits, so a truncation
// nobody listed is caught too.
//
// IT ALSO REFUSES THE CAPSTONE'S NAMES: the three records (OWAZA, IGRITA,
// IKORODU) and the operators they name. The list is anchored: each name must
// appear in the capstone prompts, so the list cannot rot into names that were
// never there.
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
const WAVE_NAME = 'carbon';
const FIELDS = JSON.parse(fs.readFileSync(waveInput(WAVE_NAME, 'fields.json'), 'utf8'));
const PRECISION = JSON.parse(fs.readFileSync(waveInput(WAVE_NAME, 'precision.json'), 'utf8'));
const CAPSTONE = JSON.parse(fs.readFileSync(waveInput(WAVE_NAME, 'capstone.json'), 'utf8'));
const LEARNING_PAGE = path.resolve(HERE, '../../../../pages/apps/CarbonLearningPage.jsx');

const EXPECTED_FILES = [
  'carbonLab.js',
  'panelBits.jsx',
  'InventoryExplorer.jsx',
  'EfficiencyExplorer.jsx',
  'AbatementExplorer.jsx',
  'CarbonLearningPage.jsx',
];

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
  .concat([{ file: 'CarbonLearningPage.jsx', text: readPage() }]);

// ---------------------------------------------------------------------------
// THE DETECTOR.
// ---------------------------------------------------------------------------

/** A number token, whole: no word character, dot or digit either side. The sign is read off separately. */
const TOKEN = /(?<![\w.])\d+(?:\.\d+)?(?:[eE][-+]?\d+)?(?![\w.])/g;
const SIG_FLOOR = 6;

/** The decimals precision.json declares for a graded key, found through its class's match. */
const decimalsOf = (key) => {
  const hit = Object.entries(PRECISION).filter(([, c]) => new RegExp(c.match).test(key));
  if (hit.length !== 1) throw new Error(`precision.json gives ${key} ${hit.length} classes; it must give exactly one`);
  return hit[0][1].decimals;
};

/** Every rendering of every graded answer, unsigned; a signed print is the same token behind a minus. */
const renderingsOf = (key, value) => {
  const v = Math.abs(value);
  const d = decimalsOf(key);
  return [...new Set([v.toFixed(d), v.toFixed(2), String(v), v.toPrecision(9), v.toPrecision(9).replace(/\.?0+$/, '')])];
};
const RENDERINGS = FIELDS.flatMap(([tier, key, value]) => renderingsOf(key, value).map((s) => ({ key: `${tier}.${key}`, s })));

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

/** The capstone's records and the operators they name, each anchored to the capstone prompts below. */
const CAPSTONE_NAMES = ['OWAZA', 'IGRITA', 'IKORODU', 'Ukwa', 'Aluu', 'Lagoon Midstream'];
const NAME_RE = new RegExp(`\\b(?:${CAPSTONE_NAMES.join('|')})\\b`, 'gi');
const PROMPTS = Object.values(CAPSTONE.tiers).map((t) => `${t.record} ${t.prompt}`).join('\n');

/**
 * A PERMANENT PLANT, swept by the same detector on every run. It is built from
 * the answer key at run time, signed and at eleven decimals, a rendering on none
 * of the lists, so the numeric half is what must find it.
 */
const PERMANENT_PLANT = `a permanent plant: const x = -${Math.abs(FIELDS[13][2]).toFixed(11)};`;

const MIN_TOKENS = 400;

describe('THE PANEL GUARD: no panel, lab or page source prints a graded capstone answer', () => {
  it('the answer key is present: eighteen graded values, each with one declared precision', () => {
    expect(FIELDS).toHaveLength(18);
    FIELDS.forEach(([tier, key, value, tol]) => {
      expect(['beginner', 'intermediate', 'advanced']).toContain(tier);
      expect(typeof key).toBe('string');
      expect(Number.isFinite(value), key).toBe(true);
      expect(tol).toBeGreaterThan(0);
      expect(Number.isInteger(decimalsOf(key))).toBe(true);
    });
    expect(decimalsOf('igrita_tuning_saving_gj')).toBe(0);
    expect(RENDERINGS.length).toBeGreaterThanOrEqual(18 * 2);
  });

  it('every capstone name the guard refuses is in the capstone prompts', () => {
    CAPSTONE_NAMES.forEach((n) => expect(PROMPTS.toLowerCase(), n).toContain(n.toLowerCase()));
    expect(Object.values(CAPSTONE.tiers).map((t) => t.record).sort()).toEqual(['IGRITA', 'IKORODU', 'OWAZA']);
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

  it('NEGATIVE CONTROL: all eighteen, at their declared decimals and at two, signed and bare, are caught', () => {
    const missed = [];
    FIELDS.forEach(([, key, value]) => {
      const v = Math.abs(value);
      [v.toFixed(decimalsOf(key)), v.toFixed(2)].forEach((r) => {
        [`{${r}}`, `value={-${r}}`, `max: ${r},`, `'${r} tCO2e'`, `-${r}`].forEach((plant) => {
          if (!leaksIn(plant).length) missed.push(`${key} in ${plant}`);
        });
      });
      [String(value), value.toPrecision(9)].forEach((plant) => { if (!leaksIn(plant).length) missed.push(`${key} in ${plant}`); });
    });
    expect(missed).toEqual([]);
  });

  it('NEGATIVE CONTROL: the whole-number answer is caught as a whole token, and never inside a longer number', () => {
    const [, , v] = FIELDS.find(([, k]) => k === 'igrita_tuning_saving_gj');
    const whole = Math.abs(v).toFixed(0);
    expect(leaksIn(`const saved = ${whole};`).length).toBeGreaterThan(0);
    expect(leaksIn(`const saved = -${whole};`).length).toBeGreaterThan(0);
    expect(leaksIn(`const other = 1${whole}; const more = ${whole}1; const dec = ${whole}.5;`)).toEqual([]);
  });

  it('NEGATIVE CONTROL: each capstone name is caught, and a word that merely contains one is not', () => {
    CAPSTONE_NAMES.forEach((n) => expect(`the ${n} case`.match(NAME_RE), n).not.toBeNull());
    expect('the bigritalic ukwaz aluums'.match(NAME_RE)).toBeNull();
  });

  it('CONTROL: A NOT TRIGGER HAPPY GUARD. Longer numbers, classes and teaching figures are not reported', () => {
    const [, key0, v0] = FIELDS[0];
    const r0 = Math.abs(v0).toFixed(decimalsOf(key0));
    const clean = [
      `const long = 1${r0}; const more = ${r0}7;`,
      'className="h-56 mt-3 text-[11px]"',
      'const total = 42945.777; const eff = 86.4029; const saved = 6742.370; const cost = -167.4364;',
    ];
    clean.forEach((t) => expect(leaksIn(t), t).toEqual([]));
  });

  sources.forEach(({ file, text }) => {
    it(`${file} prints none of the eighteen graded answers`, () => {
      expect(leaksIn(text)).toEqual([]);
    });

    it(`${file} names no capstone record and none of its operators`, () => {
      expect([...new Set((text.match(NAME_RE) || []).map((x) => x.toLowerCase()))]).toEqual([]);
    });

    it(`${file} carries no em dash and no en dash`, () => {
      expect(text).not.toMatch(/[–—]/);
    });

    it(`${file} reaches the engine only through the lab, and reads no clock`, () => {
      if (file === 'carbonLab.js') expect(text).toMatch(/@petrolord\/engines\/engines\/downstream/);
      else expect(text).not.toMatch(/@petrolord\/engines/);
      const code = text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
      expect(code).not.toMatch(/new Date\(|Date\.now|performance\.now|Math\.random/);
    });
  });
});
