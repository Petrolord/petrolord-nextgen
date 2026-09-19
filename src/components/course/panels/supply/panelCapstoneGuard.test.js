// A PANEL MAY NOT PRINT A GRADED CAPSTONE ANSWER.
//
// The eighteen graded answers of this course are volumes, a probability, a wait,
// days of cover, costs a litre, dollars, a pump price, a government share, an
// exchange rate and one whole number of trucks. precision.json declares the
// decimals each is asked for, and this guard renders every one at exactly those
// decimals, BARE AND SIGNED, and refuses it anywhere in a panel, the lab, the
// shared bits or the learning page.
//
// THE COMPARISON IS BY WHOLE TOKEN, NEVER BY SUBSTRING, on FC6's pattern and
// gate_promptleak.py's token rule: a run of digits with an optional decimal part
// and an optional sign, with no word character, dot or hyphen before it and no
// word character or dot after it. So a graded value written into a label, a prop,
// a slider bound or a template string is caught, and a longer number that happens
// to contain its digits, a Tailwind class like h-64 or a record code is not.
//
// A SECOND, NUMERIC HALF catches the same answer printed at ANY OTHER precision (a
// value copied out of a console at full float precision, or one whose float
// carries fewer decimals than the class asks for). A token with at least
// SIG_FLOOR significant digits is a leak when it IS the graded value correctly
// rounded to the token's own precision.
//
// THE CAPSTONE RECORDS ARE REFUSED BY NAME too: OKOMU, OGWASHI and ORON, and the
// operators the prompts name. Nothing outside the capstone generator may say them.
//
// IT NEVER EMPTIES ITSELF. The file list it sweeps is asserted, a PERMANENT PLANT
// built from the answer key at run time is swept by the same detector on every
// run and must be found, and a tiny or empty surface is refused rather than called
// clean. Every wave input is read through tools/course-waves/waveInputs.mjs, which
// throws and names the file when one is missing.
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { waveInput } from '../../../../../tools/course-waves/waveInputs.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const WAVE_NAME = 'supply';
const FIELDS = JSON.parse(fs.readFileSync(waveInput(WAVE_NAME, 'fields.json'), 'utf8'));
const PRECISION = JSON.parse(fs.readFileSync(waveInput(WAVE_NAME, 'precision.json'), 'utf8'));
const CAPSTONE = JSON.parse(fs.readFileSync(waveInput(WAVE_NAME, 'capstone.json'), 'utf8'));
const LEARNING_PAGE = path.resolve(HERE, '../../../../pages/apps/SupplyLearningPage.jsx');

const EXPECTED_FILES = [
  'supplyLab.js',
  'panelBits.jsx',
  'TankExplorer.jsx',
  'DepotExplorer.jsx',
  'PriceExplorer.jsx',
  'SupplyLearningPage.jsx',
];
const THE_LAB = 'supplyLab.js';

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
  .concat([{ file: 'SupplyLearningPage.jsx', text: readPage() }]);

// ---------------------------------------------------------------------------
// THE DETECTOR.
// ---------------------------------------------------------------------------

/** gate_promptleak.py's number token, signed or bare, whole. */
const TOKEN = /(?<![\w.-])-?\d+(?:\.\d+)?(?![\w.])/g;
const SIG_FLOOR = 5;

/** The decimals precision.json declares for one graded key. */
const decimalsOf = (key) => {
  const hit = Object.entries(PRECISION).filter(([, c]) => new RegExp(c.match).test(key));
  if (hit.length !== 1) throw new Error(`${key} matches ${hit.length} precision classes, so its printed shape is not declared`);
  return hit[0][1].decimals;
};

/** Every graded answer at its declared decimals, bare and signed. */
const GRADED = FIELDS.map(([tier, key, value]) => {
  const d = decimalsOf(key);
  const bare = Math.abs(value).toFixed(d);
  return { tier, key, value, d, bare, shapes: [bare, `-${bare}`] };
});

const sig = (tok) => tok.replace('-', '').replace('.', '').replace(/^0+/, '').length;
const decs = (tok) => (tok.includes('.') ? tok.split('.')[1].length : 0);

const leaksIn = (text) => {
  const hits = [];
  (text.match(TOKEN) || []).forEach((tok) => {
    const abs = tok.replace(/^-/, '');
    GRADED.forEach((g) => {
      if (abs === g.bare) {
        hits.push(`${tok} is ${g.tier}.${g.key} at its declared ${g.d} decimals`);
      } else if (sig(tok) >= SIG_FLOOR && Number(abs) === Number(Math.abs(g.value).toFixed(decs(tok)))) {
        hits.push(`${tok} is ${g.tier}.${g.key} rounded to ${decs(tok)} decimals`);
      }
    });
  });
  return hits;
};

/** The capstone's own records and operators, by name, whole words only. */
const CAPSTONE_NAMES = /\b(?:okomu|ogwashi|oron|ologbo|anioma)\b/gi;

/**
 * A PERMANENT PLANT, swept by the same detector on every run. It is built from
 * the answer key at run time, signed, so it is no literal in this file, and if
 * the detector ever stops working it goes quiet and the test below fails.
 */
const PERMANENT_PLANT = `a permanent plant: const unaccounted = -${GRADED[4].bare};`;

const MIN_TOKENS = 400;

describe('THE PANEL GUARD: no panel, lab or page source prints a graded capstone answer', () => {
  it('the answer key is present: eighteen graded values, six a tier, each with a declared precision', () => {
    expect(FIELDS).toHaveLength(18);
    ['beginner', 'intermediate', 'advanced'].forEach((t) => expect(FIELDS.filter(([tier]) => tier === t)).toHaveLength(6));
    FIELDS.forEach(([, key, value, tol]) => {
      expect(Number.isFinite(value), key).toBe(true);
      expect(tol).toBeGreaterThan(0);
      expect(Number.isInteger(decimalsOf(key))).toBe(true);
    });
    // The capstone file and the answer key name the same eighteen keys.
    const keys = Object.values(CAPSTONE.tiers).flatMap((t) => t.fields.map((f) => f.key)).sort();
    expect(keys).toEqual(FIELDS.map(([, k]) => k).sort());
    Object.values(CAPSTONE.tiers).forEach((t) => t.fields.forEach((f) => expect(f.decimals, f.key).toBe(decimalsOf(f.key))));
  });

  it('the capstone records the name sweep refuses are the ones the prompts carry', () => {
    const records = Object.values(CAPSTONE.tiers).map((t) => t.record.toLowerCase()).sort();
    expect(records).toEqual(['ogwashi', 'okomu', 'oron']);
    Object.values(CAPSTONE.tiers).forEach((t) => expect(t.prompt.match(CAPSTONE_NAMES)).toBeTruthy());
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

  it('NEGATIVE CONTROL: all eighteen, bare and signed at their declared decimals, are caught as whole tokens', () => {
    const missed = [];
    GRADED.forEach((g) => {
      [`{${g.bare}}`, `value={-${g.bare}}`, `max: ${g.bare},`, `'${g.bare} m3'`, `\`${g.shapes[1]}\``].forEach((plant) => {
        if (!leaksIn(plant).length) missed.push(`${g.key} in ${plant}`);
      });
    });
    expect(missed).toEqual([]);
  });

  it('NEGATIVE CONTROL: every graded answer with a fractional part is caught at full float precision too', () => {
    const missed = [];
    GRADED.filter((g) => !Number.isInteger(g.value)).forEach((g) => {
      const plant = `const x = ${String(g.value)};`;
      if (!leaksIn(plant).length) missed.push(g.key);
    });
    expect(missed).toEqual([]);
  });

  it('CONTROL: A NOT TRIGGER HAPPY GUARD. Longer numbers, classes, codes and teaching figures are not reported', () => {
    const g = GRADED.find((x) => Number.isInteger(x.value));
    const clean = [
      `const long = ${g.bare}0${g.bare}; const dec = ${g.bare}.5;`,
      'className="h-64 mt-3 text-[11px] w-24"',
      "const code = 'IB-T3 (AGO)';",
      // The teaching figures the panels do print, from the digest.
      'const closing = 4499.452; const unaccounted = -8.648; const tolerance = 12.365;',
      'const wait = 47.2652; const p = 0.787753; const cover = 3.8345; const pump = 1074.8249;',
      'const cif = 24331931.09; const landed = 26513943.86; const breakeven = 1641.7105;',
    ];
    clean.forEach((t) => expect(leaksIn(t), t).toEqual([]));
  });

  it('NEGATIVE CONTROL: a capstone record named in a source is caught, and a word containing one is not', () => {
    expect('the OKOMU depot'.match(CAPSTONE_NAMES)).toHaveLength(1);
    expect('Ogwashi and Oron'.match(CAPSTONE_NAMES)).toHaveLength(2);
    expect('a coronary, a moron, orange'.match(CAPSTONE_NAMES)).toBeNull();
  });

  sources.forEach(({ file, text }) => {
    it(`${file} prints none of the eighteen graded answers`, () => {
      expect(leaksIn(text)).toEqual([]);
    });

    it(`${file} names no capstone record`, () => {
      expect([...new Set((text.match(CAPSTONE_NAMES) || []).map((x) => x.toLowerCase()))]).toEqual([]);
    });

    it(`${file} carries no em dash and no en dash`, () => {
      expect(text).not.toMatch(/[–—]/);
    });

    it(`${file} reaches the engine only through the lab, and reads no clock`, () => {
      if (file === THE_LAB) {
        expect(text).toMatch(/@petrolord\/engines\/engines\/downstream\/terminalDepot\.js/);
        expect(text).toMatch(/@petrolord\/engines\/engines\/downstream\/fuelPricing\.js/);
      } else {
        expect(text).not.toMatch(/@petrolord\/engines/);
      }
      const code = text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
      expect(code).not.toMatch(/new Date\(|Date\.now|performance\.now|Math\.random/);
    });
  });
});
