// Every value the SC3 teaching lab exposes to a panel, a lesson or the page is
// pinned here against the teaching digest (tools/course-waves/materials/
// digest.txt), which is nothing but the engine's return values on the Ekene
// register, the golden inputs and the stated inputs the digest prints.
//
// THE GATES IN THIS FILE:
//   THE DATASET GATE   the lab reads the vendored fixture and the INPUTS of the
//                      vendored golden file (packages/engines/test-data/
//                      supplychain/goldens/inventory_cases.json) and never its
//                      expected figures.
//   THE DIGEST GATE    EVERY numeric leaf every teaching reader returns is
//                      printed in the digest, and named figures are pinned to
//                      the digest rows that print them.
//   THE REBUILD GATE   the committed materials_dump.mjs, run in a child
//                      process against this repository's vendored engine and
//                      the committed wave inputs, reproduces the committed
//                      digest byte for byte, under two time zones.
//   THE ENGINE GATE    every interactive route returns exactly what the engine
//                      returns, refusals included, and no refusal message is
//                      written as a literal in the lab.
//   THE PASTE GATE     a whole capstone case file pasted into any view runs
//                      the block the view chose.
//   THE LEAK GATE      no number the lab exports sits within TEN ABSOLUTE
//                      tolerances of a graded answer in any of five unit
//                      shiftings. A leak is planted and caught.
//   THE CLOCK GATE     no clock and no random number in the lab.
// The capstone guard over the panels and the page is panelCapstoneGuard.test.js.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import * as E from '@petrolord/engines/engines/supplychain/inventory.js';
import * as L from './materialsLab.js';
import { waveInput, mirrorDir } from '../../../../../tools/course-waves/waveInputs.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const WAVE = 'materials';
const DIGEST = fs.readFileSync(waveInput(WAVE, 'digest.txt'), 'utf8');
const FIELDS = JSON.parse(fs.readFileSync(waveInput(WAVE, 'fields.json'), 'utf8'));
const LAB_SOURCE = fs.readFileSync(path.join(HERE, 'materialsLab.js'), 'utf8');
const ENGINES = path.join(ROOT, 'packages/engines');
const GOLDEN = path.join(ENGINES, 'test-data/supplychain/goldens/inventory_cases.json');
const clone = (o) => JSON.parse(JSON.stringify(o));

const leaves = (v, at = '') => {
  if (typeof v === 'number') return [[at, v]];
  if (Array.isArray(v)) return v.flatMap((x, i) => leaves(x, `${at}[${i}]`));
  if (v && typeof v === 'object') return Object.entries(v).flatMap(([k, x]) => leaves(x, `${at}.${k}`));
  return [];
};
// The digest prints a figure of sixteen or more significant digits comma-grouped.
const grouped = (t) => { const [i, d] = t.split('.'); return `${i.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${d === undefined ? '' : `.${d}`}`; };
const printed = (x) => {
  const cands = [x.toFixed(6), grouped(x.toFixed(6)), ...(Number.isInteger(x) ? [String(x)] : [])];
  return cands.some((c) => new RegExp(`(?<![\\d.,])${c.replace('.', '\\.')}(?![\\d])`).test(DIGEST));
};
const f6 = (x) => x.toFixed(6);

const READERS = {
  criticalityReader: L.criticalityReader,
  abcReader: L.abcReader,
  eoqReader: L.eoqReader,
  slowReader: L.slowReader,
  discountReader: L.discountReader,
  safetyReader: L.safetyReader,
  poissonReader: L.poissonReader,
  sparesReader: L.sparesReader,
  leadTimeReader: L.leadTimeReader,
};

describe('THE DATASET GATE: the lab reads the fixture and the golden INPUTS only', () => {
  it('every golden case is its inputs and nothing else', () => {
    const gold = JSON.parse(fs.readFileSync(GOLDEN, 'utf8'));
    expect(Object.keys(L.GOLDEN_ARGS)).toEqual(gold.cases.map((c) => c.id));
    gold.cases.forEach((c) => {
      expect(L.GOLDEN_ARGS[c.id]).toEqual({ fn: c.fn, args: c.args });
      expect(Object.keys(L.GOLDEN_ARGS[c.id])).not.toContain('expected');
    });
    console.log(`[materials lab] ${gold.cases.length} golden cases, inputs only, read from the vendored golden file`);
  });
  it('the fixture is the vendored register and says SYNTHETIC', () => {
    const disk = JSON.parse(fs.readFileSync(path.join(ENGINES, 'test-data/supplychain/ekene-materials/register.json'), 'utf8'));
    expect(L.FIXTURE).toEqual(disk);
    expect(L.FIXTURE.synthetic.startsWith('SYNTHETIC')).toBe(true);
  });
  it('every golden case a panel starts from is one the digest names', () => {
    const used = Object.entries(L.GOLDEN_ARGS).filter(([, g]) => Object.values(L.STARTS).includes(g.args));
    expect(used.length).toBeGreaterThanOrEqual(30);
    used.forEach(([id]) => expect(DIGEST, id).toContain(id));
  });
});

describe('THE DIGEST GATE: every number a teaching reader returns is printed in the digest', () => {
  it('walks every reader and finds every numeric leaf in the digest', () => {
    let total = 0;
    const missing = [];
    Object.entries(READERS).forEach(([name, fn]) => {
      const ls = leaves(fn()).filter(([, x]) => x !== 0);
      expect(ls.length, `${name} returned no numbers`).toBeGreaterThan(0);
      ls.forEach(([at, x]) => {
        total += 1;
        if (!printed(x)) missing.push(`${name}${at} = ${x}`);
      });
    });
    expect(missing, 'lab numbers the digest does not print').toEqual([]);
    expect(total).toBeGreaterThan(60);
    console.log(`[materials lab] ${total} numeric leaves over ${Object.keys(READERS).length} readers, every one printed in the digest`);
  });

  it('NEGATIVE CONTROL: a number the digest does not print is reported as unprinted', () => {
    const t = L.eoqReader().eoq;
    expect(printed(0.1234567)).toBe(false);
    expect(printed(t + 1e-4)).toBe(false);
    expect(printed(t)).toBe(true);
  });

  it('pins named figures to the exact digest rows that print them', () => {
    L.criticalityReader().forEach((c) => expect(DIGEST).toContain(`| ${c.id} | `));
    const a = L.abcReader();
    a.forEach((x) => expect(DIGEST).toContain(`| ${x.rank} | ${x.id} | ${f6(x.annualValue)} |`));
    const e = L.eoqReader();
    expect(DIGEST).toContain(`| EOQ | ${f6(e.eoq)} |`);
    expect(DIGEST).toContain(`| relevant cost a year | ${f6(e.relevantCost)} |`);
    const s = L.slowReader();
    expect(DIGEST).toContain(`Total stock value ${f6(s.totalStockValue)}; total write-down ${f6(s.totalWriteDown)}`);
    const sp = L.sparesReader();
    expect(DIGEST).toContain(`the cheapest stock is ${sp.spares} spares at ${f6(sp.totalCost)} a year`);
    const lt = L.leadTimeReader();
    expect(DIGEST).toContain(`reorder point for the service level ${f6(lt.reorderPointForService)} (seed ${lt.seed}, ${lt.iterations} draws)`);
  });

  it('every refusal a route returns is the engine\'s own message, the digest quotes it verbatim, and the lab never writes it', () => {
    const gold = JSON.parse(fs.readFileSync(GOLDEN, 'utf8'));
    const refusals = gold.cases.filter((c) => c.expected && c.expected.error === true);
    expect(refusals.length).toBe(89);
    refusals.forEach((c) => {
      const r = L.ROUTES[c.fn](c.args);
      expect(r.error, c.id).toBe(c.expected.message);
      expect(DIGEST, c.id).toContain(r.error);
      expect(LAB_SOURCE.includes(r.error), `the lab writes the message of ${c.id} as a literal`).toBe(false);
    });
  });
});

describe('THE REBUILD GATE: the committed generator reproduces the committed digest', () => {
  const rebuild = (tz) => execFileSync('node', [path.join(mirrorDir(WAVE), 'materials_dump.mjs')], {
    encoding: 'utf8',
    maxBuffer: 1e8,
    env: {
      ...process.env, TZ: tz, LC_ALL: 'C', SC3_WAVE_DIR: mirrorDir(WAVE), SC3_ENGINES: ENGINES,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  it('byte for byte under UTC and under America/Los_Angeles, against this repository\'s vendored engine', () => {
    const committed = fs.readFileSync(path.join(mirrorDir(WAVE), 'digest.txt'), 'utf8');
    const a = rebuild('UTC');
    const b = rebuild('America/Los_Angeles');
    expect(a.length).toBeGreaterThan(40000);
    expect(a).toBe(committed);
    expect(b).toBe(committed);
    console.log(`[materials lab] the committed materials_dump.mjs rebuilt ${a.split('\n').length} lines byte for byte in two time zones`);
  }, 240000);
});

describe('THE ENGINE GATE: the interactive routes are the engine, unchanged', () => {
  it('each route returns what the engine returns, refusals included', () => {
    const cases = [
      ['criticality', L.STARTS.critEkene], ['abcClassification', L.STARTS.abcEkeneCrossing], ['eoq', L.STARTS.eoqBaryte], ['slowMoving', L.STARTS.smEkene],
      ['quantityDiscount', L.STARTS.qdCasingIncremental], ['safetyStock', L.STARTS.ssChokeBeansFill], ['poissonStock', L.STARTS.psPsvKits],
      ['insuranceSpares', L.STARTS.insEspMotor], ['leadTimeRisk', L.STARTS.ltrMechSeal], ['eoq', L.BLANK], ['safetyStock', { ...L.STARTS.ssChokeBeans, rounding: undefined }],
    ];
    const ENGINE = {
      criticality: E.criticality, abcClassification: E.abcClassification, eoq: E.eoq, slowMoving: E.slowMoving, quantityDiscount: E.quantityDiscount,
      safetyStock: E.safetyStock, poissonStock: E.poissonStock, insuranceSpares: E.insuranceSpares, leadTimeRisk: E.leadTimeRisk,
    };
    cases.forEach(([fn, a]) => expect(L.ROUTES[fn](a)).toEqual(ENGINE[fn](clone(a))));
  });
  it('a case file is read at the block a view chose, and one call\'s inputs as they stand', () => {
    const c = { dataset: 'x', 'safetyStock:a': { demandMean: 1 }, 'safetyStock:b': { demandMean: 2 }, eoq: { annualDemand: 3 } };
    expect(L.blockKeysOf(c, 'safetyStock')).toEqual(['safetyStock:a', 'safetyStock:b']);
    expect(L.blockKeysOf(c, 'eoq')).toEqual(['eoq']);
    expect(L.blockKeysOf(L.STARTS.eoqBaryte, 'eoq')).toEqual([]);
    expect(L.pick(c, 'safetyStock:b')).toEqual({ demandMean: 2 });
    expect(L.pick(L.STARTS.eoqBaryte, 'eoq')).toBe(L.STARTS.eoqBaryte);
    expect(L.parseJson('{"a": 1}').value).toEqual({ a: 1 });
    expect(L.parseJson('{a: 1}').error).toBeTruthy();
    expect(L.parseJson('').error).toBeTruthy();
  });
  it('every starting case runs, and the blank case is refused', () => {
    const fnOf = (a) => {
      const id = Object.keys(L.GOLDEN_ARGS).find((g) => L.GOLDEN_ARGS[g].args === a);
      if (id) return L.GOLDEN_ARGS[id].fn;
      return a.criteria ? 'criticality' : a.cutoffs ? 'abcClassification' : a.bands ? 'slowMoving' : a.breaks ? 'quantityDiscount'
        : a.demandMean !== undefined ? 'safetyStock' : a.demandRate !== undefined ? 'poissonStock' : a.failuresPerYear !== undefined ? 'insuranceSpares'
          : a.demandPerDay !== undefined ? 'leadTimeRisk' : 'eoq';
    };
    Object.entries(L.STARTS).forEach(([k, a]) => {
      if (k === 'blank') { L.VIEWS.forEach((v) => expect(L.ROUTES[v](a).error, v).toBeTruthy()); return; }
      expect(L.ROUTES[fnOf(a)](a).error, k).toBeUndefined();
    });
  });
});

const CASE_FILES = ['igbariam', 'ogidi', 'umuchu'].map((n) => ({
  name: n, text: fs.readFileSync(path.join(ROOT, `src/content/capstone-cases/materials/${n}_case.json`), 'utf8'),
}));
const CASES = CASE_FILES.map((c) => JSON.parse(c.text));

describe('THE PASTE GATE: a whole case file pasted into a view runs the block it chose', () => {
  it('every block of every case gives the whole case the same result as the block alone', () => {
    let n = 0;
    CASES.forEach((c) => L.VIEWS.forEach((view) => L.blockKeysOf(c, view).forEach((k) => {
      const whole = L.viewRun(view, c, k);
      expect(whole.error, `${c.dataset} ${k}`).toBeUndefined();
      expect(whole).toEqual(L.ROUTES[view](c[k]));
      expect(L.viewRun(view, c[k], k)).toEqual(whole);
      n += 1;
    })));
    expect(n).toBe(12);
  });
  it('NEGATIVE CONTROL: the raw route without the block refuses the whole case by its first unknown key', () => {
    expect(L.eoqOf(CASES[0]).error).toMatch(/^dataset is not an accepted key/);
    expect(L.insuranceSparesOf(CASES[2]).error).toMatch(/^dataset is not an accepted key/);
  });
});

describe('THE LEAK GATE: no lab number is a graded answer', () => {
  const SCALES = [1, 1e3, 1e-3, 1e2, 1e-2];
  const sweep = (values) => {
    const hits = [];
    FIELDS.forEach(([, key, v, tol]) => SCALES.forEach((sc) => values.forEach(([at, x]) => {
      if (Math.abs(x - v * sc) <= 10 * tol * sc) hits.push(`${at} = ${x} is within ten tolerances of ${key} x${sc}`);
    })));
    return hits;
  };
  const all = () => [
    ...Object.entries(READERS).flatMap(([n, fn]) => leaves(fn()).map(([at, x]) => [`${n}${at}`, x])),
    ...leaves(L.STARTS).map(([at, x]) => [`STARTS${at}`, x]),
    ...leaves(L.FIXTURE).map(([at, x]) => [`FIXTURE${at}`, x]),
    ...leaves(Object.fromEntries(Object.entries(L.GOLDEN_ARGS).map(([k, g]) => [k, g.args]))).map(([at, x]) => [`GOLDEN_ARGS${at}`, x]),
  ];
  it('the answer key is eighteen fields with absolute tolerances', () => {
    expect(FIELDS).toHaveLength(18);
    FIELDS.forEach(([, , , tol]) => expect(tol).toBeGreaterThan(0));
  });
  it('sweeps every number the lab and its dataset export and finds none, over a surface large enough to mean something', () => {
    const values = all();
    expect(values.length).toBeGreaterThan(1000);
    expect(sweep(values)).toEqual([]);
    console.log(`[materials lab] ${values.length} lab and dataset numbers x 18 graded answers x 5 shiftings: 0 within ten tolerances`);
  }, 120000);
  it('NEGATIVE CONTROL: a planted graded answer is caught and named', () => {
    const planted = [...all(), ['planted', FIELDS[7][2] + FIELDS[7][3]]];
    const hits = sweep(planted);
    expect(hits.length).toBe(1);
    expect(hits[0]).toContain(FIELDS[7][1]);
  }, 120000);
  it('the lab holds no tolerance and names no capstone', () => {
    expect(LAB_SOURCE).not.toMatch(/gradedTolerance|fields\.json/);
    expect(LAB_SOURCE).not.toMatch(/\b(?:igbariam|ogidi|umuchu)\b/i);
  });
});

describe('THE CLOCK GATE', () => {
  it('no clock, no random number and no path under /root in the lab', () => {
    const code = LAB_SOURCE.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
    expect(code).not.toMatch(/Date\.now|new Date|Math\.random|performance\.now|setTimeout|setInterval/);
    expect(LAB_SOURCE).not.toMatch(/\/root\//);
  });
  it('this suite names no path under /root', () => {
    const me = fs.readFileSync(fileURLToPath(import.meta.url), 'utf8');
    expect(me.split('\n').filter((l) => /['"`]\/root\//.test(l))).toEqual([]);
  });
});
