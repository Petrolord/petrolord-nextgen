// A PANEL MAY NOT PRINT A GRADED CAPSTONE ANSWER.
//
// The eighteen graded answers of this course are a heating value, a liquids
// content and a C3+ mass, three flare tonnages, a capital cost, a year of CNG, a
// value per Mscf, two abatements and a breakeven credit price, a usable LPG
// stock, a vaporizer duty, a carousel wait, a bank mass, the gas left in a
// cascade and a payback. precision.json declares the decimals each is asked for,
// and this guard renders every one at exactly those decimals AND TO TWO, BARE AND
// SIGNED, and refuses it anywhere in a panel, the lab, the shared bits or the
// learning page.
//
// THE COMPARISON IS BY WHOLE TOKEN, NEVER BY SUBSTRING, on FC6's pattern and
// gate_promptleak.py's token rule: a run of digits with an optional decimal part
// and an optional sign, with no word character, dot or hyphen before it and no
// word character or dot after it. So a graded value written into a label, a prop,
// a slider bound or a template string is caught, and a longer number that happens
// to contain its digits, a Tailwind class like h-64 or a record code is not.
//
// A SECOND, NUMERIC HALF catches the same answer printed at ANY OTHER precision (a
// value copied out of a console at full float precision). A token with at least
// SIG_FLOOR significant digits is a leak when it IS the graded value correctly
// rounded to the token's own precision.
//
// THE CAPSTONE RECORDS ARE REFUSED BY NAME ANYWHERE IN THE PANEL TREE. The names
// are read from capstone.json at run time, so this file carries none of them and
// is swept with the rest of the directory, tests included.
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
const WAVE_NAME = 'gasvalue';
const FIELDS = JSON.parse(fs.readFileSync(waveInput(WAVE_NAME, 'fields.json'), 'utf8'));
const PRECISION = JSON.parse(fs.readFileSync(waveInput(WAVE_NAME, 'precision.json'), 'utf8'));
const CAPSTONE = JSON.parse(fs.readFileSync(waveInput(WAVE_NAME, 'capstone.json'), 'utf8'));
const PAGE_FILE = 'GasvalueLearningPage.jsx';
const LEARNING_PAGE = path.resolve(HERE, '../../../../pages/apps', PAGE_FILE);

const EXPECTED_SOURCES = [
  'gasvalueLab.js',
  'panelBits.jsx',
  'FlareExplorer.jsx',
  'RouteExplorer.jsx',
  'RolloutExplorer.jsx',
  PAGE_FILE,
];
const EXPECTED_TESTS = ['gasvalueLab.test.js', 'panelCapstoneGuard.test.js'];
const THE_LAB = 'gasvalueLab.js';

const readPage = () => {
  if (!fs.existsSync(LEARNING_PAGE)) {
    throw new Error(`the course learning page is missing: ${LEARNING_PAGE}. It is swept as a panel is, and a rename fails here.`);
  }
  return fs.readFileSync(LEARNING_PAGE, 'utf8');
};

const everyFile = fs.readdirSync(HERE).filter((f) => f.endsWith('.js') || f.endsWith('.jsx'));
const sources = everyFile
  .filter((f) => !f.includes('.test.'))
  .map((f) => ({ file: f, text: fs.readFileSync(path.join(HERE, f), 'utf8') }))
  .concat([{ file: PAGE_FILE, text: readPage() }]);
/** The whole panel tree, tests included, for the name sweep. */
const tree = everyFile
  .filter((f) => f.includes('.test.'))
  .map((f) => ({ file: f, text: fs.readFileSync(path.join(HERE, f), 'utf8') }))
  .concat(sources);

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

/** Every graded answer at its declared decimals and to two, bare and signed. */
const GRADED = FIELDS.map(([tier, key, value]) => {
  const d = decimalsOf(key);
  const bare = Math.abs(value).toFixed(d);
  const two = Math.abs(value).toFixed(2);
  const shapes = [...new Set([bare, two])];
  return {
    tier, key, value, d, bare, two, shapes, signed: shapes.map((s) => `-${s}`),
  };
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
      } else if (abs === g.two) {
        hits.push(`${tok} is ${g.tier}.${g.key} to two decimals`);
      } else if (sig(tok) >= SIG_FLOOR && Number(abs) === Number(Math.abs(g.value).toFixed(decs(tok)))) {
        hits.push(`${tok} is ${g.tier}.${g.key} rounded to ${decs(tok)} decimals`);
      }
    });
  });
  return hits;
};

/** The capstone's own records, read from capstone.json, whole words only. */
const RECORDS = Object.values(CAPSTONE.tiers).map((t) => t.record);
const CAPSTONE_NAMES = new RegExp(`\\b(?:${RECORDS.map((r) => r.toLowerCase()).join('|')})\\b`, 'gi');

/**
 * A PERMANENT PLANT, swept by the same detector on every run. It is built from
 * the answer key at run time, signed, so it is no literal in this file, and if
 * the detector ever stops working it goes quiet and the test below fails.
 */
const PERMANENT_PLANT = `a permanent plant: const tonnes = -${GRADED[5].bare}; const two = ${GRADED[13].two};`;

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
    const keys = Object.values(CAPSTONE.tiers).flatMap((t) => t.fields.map((f) => f.key)).sort();
    expect(keys).toEqual(FIELDS.map(([, k]) => k).sort());
  });

  it('the capstone records the name sweep refuses are the three the prompts carry, one a tier', () => {
    expect(RECORDS).toHaveLength(3);
    Object.values(CAPSTONE.tiers).forEach((t) => {
      expect(t.prompt.match(CAPSTONE_NAMES), t.record).toBeTruthy();
      // Each record's key prefix is its name, so the answer key and the sweep agree.
      t.fields.forEach((f) => expect(f.key.startsWith(`${t.record.toLowerCase()}_`), f.key).toBe(true));
    });
  });

  it('the sources to sweep are the ones this course ships, so a rename cannot empty the gate', () => {
    expect(sources.map((s) => s.file).sort()).toEqual([...EXPECTED_SOURCES].sort());
    expect(tree.map((s) => s.file).sort()).toEqual([...EXPECTED_SOURCES, ...EXPECTED_TESTS].sort());
    sources.forEach((s) => expect(s.text.length, s.file).toBeGreaterThan(2000));
    const tokens = sources.flatMap((s) => s.text.match(TOKEN) || []);
    expect(tokens.length, 'the swept sources carry almost no numbers, so this sweep is vacuous').toBeGreaterThanOrEqual(MIN_TOKENS);
    // CONTROL: a tiny surface fails the same floor.
    expect(('const a = 1;'.match(TOKEN) || []).length >= MIN_TOKENS).toBe(false);
  });

  it('THE PERMANENT PLANT is caught, both shapes, so the detector cannot have stopped working', () => {
    expect(leaksIn(PERMANENT_PLANT).length).toBeGreaterThanOrEqual(2);
  });

  it('NEGATIVE CONTROL: all eighteen, bare and signed, at their declared decimals and to two, are caught as whole tokens', () => {
    const missed = [];
    GRADED.forEach((g) => {
      [...g.shapes, ...g.signed].forEach((shape) => {
        [`{${shape}}`, `value={${shape}}`, `max: ${shape},`, `'${shape} t'`, `\`${shape}\``].forEach((plant) => {
          if (!leaksIn(plant).length) missed.push(`${g.key} in ${plant}`);
        });
      });
    });
    expect(missed).toEqual([]);
  });

  it('NEGATIVE CONTROL: every graded answer is caught at full float precision too', () => {
    const missed = GRADED.filter((g) => !leaksIn(`const x = ${String(g.value)};`).length).map((g) => g.key);
    expect(missed).toEqual([]);
  });

  it('CONTROL: A NOT TRIGGER HAPPY GUARD. Longer numbers, classes, codes and teaching figures are not reported', () => {
    const g = GRADED[0];
    const clean = [
      `const long = ${g.bare}0${g.bare};`,
      'className="h-64 mt-3 text-[11px] w-24"',
      "const code = 'IC4'; const route = 'mini_lng';",
      // The teaching figures the panels do print, from the digest.
      'const ghv = 1248.4110; const gpm = 3.2205; const c3 = 6.6647;',
      'const co2 = 182079.024; const ch4 = 1136.490; const co2e = 215946.438;',
      'const capital = 29337983.06; const value = 7.8904; const breakeven = 16.0152;',
      'const usable = 71.0685; const duty = 98.6948; const wait = 0.0912; const left = 665.879; const payback = 0.3137;',
    ];
    clean.forEach((t) => expect(leaksIn(t), t).toEqual([]));
  });

  it('NEGATIVE CONTROL: a capstone record named in a source is caught, and a word containing one is not', () => {
    const [a, b, c] = RECORDS;
    expect(`the ${a} flow station`.match(CAPSTONE_NAMES)).toHaveLength(1);
    expect(`${b.toLowerCase()} and ${c}`.match(CAPSTONE_NAMES)).toHaveLength(2);
    expect(`x${a.toLowerCase()}y ${c}s`.match(CAPSTONE_NAMES)).toBeNull();
  });

  sources.forEach(({ file, text }) => {
    it(`${file} prints none of the eighteen graded answers`, () => {
      expect(leaksIn(text)).toEqual([]);
    });

    it(`${file} carries no em dash and no en dash`, () => {
      expect(text).not.toMatch(/[–—]/);
    });

    it(`${file} reaches the engine only through the lab, and reads no clock`, () => {
      if (file === THE_LAB) {
        expect(text).toMatch(/@petrolord\/engines\/engines\/downstream\/flareToValue\.js/);
        expect(text).toMatch(/@petrolord\/engines\/engines\/downstream\/lpgCng\.js/);
      } else {
        expect(text).not.toMatch(/@petrolord\/engines/);
      }
      const code = text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
      expect(code).not.toMatch(/new Date\(|Date\.now|performance\.now|Math\.random/);
    });
  });

  tree.forEach(({ file, text }) => {
    it(`${file} names no capstone record`, () => {
      expect([...new Set((text.match(CAPSTONE_NAMES) || []).map((x) => x.toLowerCase()))]).toEqual([]);
    });
  });
});
