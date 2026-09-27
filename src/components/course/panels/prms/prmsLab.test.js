// Every value the EC11 teaching lab exposes to a panel, a lesson or the page is
// pinned here against the teaching digest (tools/course-waves/prms/digest.txt),
// which is nothing but the engine's return values on the Ekene field, the
// golden inputs and the stated inputs the digest prints.
//
// THE GATES IN THIS FILE:
//   THE DATASET GATE   the lab reads the vendored fixture and the INPUTS of the
//                      vendored golden file (packages/engines/test-data/
//                      economics/goldens/prms_cases.json) and never its
//                      expected figures.
//   THE DIGEST GATE    EVERY numeric leaf every teaching reader returns is
//                      printed in the digest, and named figures are pinned to
//                      the digest rows that print them.
//   THE REBUILD GATE   the committed prms_dump.mjs, run in a child process
//                      against this repository's vendored engine and the
//                      committed wave inputs, reproduces the committed digest
//                      byte for byte, under two time zones.
//   THE ENGINE GATE    every interactive route returns exactly what the engine
//                      returns, refusals included, and no refusal message is
//                      written as a literal in the lab.
//   THE PASTE GATE     a whole capstone case file pasted into any view runs
//                      the block the view chose; a stated control writes into
//                      the right block and "not stated" makes the engine refuse.
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
import * as E from '@petrolord/engines/engines/economics/prms.js';
import * as L from './prmsLab.js';
import { waveInput, mirrorDir } from '../../../../../tools/course-waves/waveInputs.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const WAVE = 'prms';
const DIGEST = fs.readFileSync(waveInput(WAVE, 'digest.txt'), 'utf8');
const FIELDS = JSON.parse(fs.readFileSync(waveInput(WAVE, 'fields.json'), 'utf8'));
const LAB_SOURCE = fs.readFileSync(path.join(HERE, 'prmsLab.js'), 'utf8');
const ENGINES = path.join(ROOT, 'packages/engines');
const GOLDEN = path.join(ENGINES, 'test-data/economics/goldens/prms_cases.json');
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
  classReader: L.classReader,
  categoryReader: L.categoryReader,
  economicReader: L.economicReader,
  aggregationReader: L.aggregationReader,
  riskedReader: L.riskedReader,
  reconcileReader: L.reconcileReader,
};
const ROUTES = {
  classify: L.classifyOf, categorize: L.categorizeOf, economicLimit: L.economicLimitOf, aggregate: L.aggregateOf, reconcile: L.reconcileOf,
};

describe('THE DATASET GATE: the lab reads the fixture and the golden INPUTS only', () => {
  it('every golden case is its inputs and nothing else', () => {
    const gold = JSON.parse(fs.readFileSync(GOLDEN, 'utf8'));
    expect(Object.keys(L.GOLDEN_ARGS)).toEqual(gold.cases.map((c) => c.id));
    gold.cases.forEach((c) => {
      expect(L.GOLDEN_ARGS[c.id]).toEqual({ fn: c.fn, args: c.args });
      expect(Object.keys(L.GOLDEN_ARGS[c.id])).not.toContain('expected');
    });
    console.log(`[prms lab] ${gold.cases.length} golden cases, inputs only, read from the vendored golden file`);
  });
  it('the fixture is the vendored file and says SYNTHETIC', () => {
    const disk = JSON.parse(fs.readFileSync(path.join(ENGINES, 'test-data/economics/ekene-prms/ekene-prms.json'), 'utf8'));
    expect(L.FIXTURE).toEqual(disk);
    expect(L.FIXTURE.synthetic.startsWith('SYNTHETIC')).toBe(true);
  });
  it('every golden case a panel starts from is one the digest names', () => {
    const used = Object.entries(L.GOLDEN_ARGS).filter(([, g]) => Object.values(L.STARTS).includes(g.args) || Object.values(L.READING_CASES).includes(g.args));
    expect(used.length).toBeGreaterThanOrEqual(35);
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
    expect(total).toBeGreaterThan(30);
    console.log(`[prms lab] ${total} numeric leaves over ${Object.keys(READERS).length} readers, every one printed in the digest`);
  });

  it('NEGATIVE CONTROL: a number the digest does not print is reported as unprinted', () => {
    const t = L.riskedReader().riskedMean;
    expect(printed(0.1234567)).toBe(false);
    expect(printed(t + 1e-4)).toBe(false);
    expect(printed(t)).toBe(true);
  });

  it('pins named figures to the exact digest rows that print them', () => {
    L.classReader().forEach((c) => expect(DIGEST).toContain(`| ${c.id} | `));
    const cat = L.categoryReader();
    expect(DIGEST).toContain(`| Probable (P2) | ${f6(cat.incremental[1])} |`);
    const e = L.economicReader();
    expect(DIGEST).toContain(`| 2P | ${f6(L.economicLimitOf(L.STARTS.econEkene).reserves.cumulative['2P'].oil)} |`);
    expect(DIGEST).toContain(f6(e.reservesBoe[1]));
    const a = L.aggregationReader();
    expect(DIGEST).toContain(`| 1P | ${f6(a.arithmetic[0])} |`);
    expect(DIGEST).toContain(`${f6(a.statistical[0])} (seed ${a.seed}, ${a.iterations} draws)`);
    const r = L.reconcileReader();
    expect(DIGEST).toContain(`| computed closing |  | ${f6(r.computedClosing[0])} | ${f6(r.computedClosing[1])} | ${f6(r.computedClosing[2])} |`);
  });

  it('every refusal a route returns is the engine\'s own message, the digest quotes it verbatim, and the lab never writes it', () => {
    const gold = JSON.parse(fs.readFileSync(GOLDEN, 'utf8'));
    const refusals = gold.cases.filter((c) => c.expected && c.expected.error === true);
    expect(refusals.length).toBe(80);
    let n = 0;
    refusals.forEach((c) => {
      const r = ROUTES[c.fn](c.args);
      expect(r.error, c.id).toBe(c.expected.message);
      expect(DIGEST, c.id).toContain(r.error);
      expect(LAB_SOURCE.includes(r.error), `the lab writes the message of ${c.id} as a literal`).toBe(false);
      n += 1;
    });
    expect(n).toBe(80);
  });
});

describe('THE REBUILD GATE: the committed generator reproduces the committed digest', () => {
  const rebuild = (tz) => execFileSync('node', [path.join(mirrorDir(WAVE), 'prms_dump.mjs')], {
    encoding: 'utf8',
    maxBuffer: 1e8,
    env: {
      ...process.env, TZ: tz, LC_ALL: 'C', EC11_WAVE_DIR: mirrorDir(WAVE), EC11_ENGINES: ENGINES, EC11_REPO: ROOT,
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
    console.log(`[prms lab] the committed prms_dump.mjs rebuilt ${a.split('\n').length} lines byte for byte in two time zones`);
  }, 240000);
});

describe('THE ENGINE GATE: the interactive routes are the engine, unchanged', () => {
  it('each route returns what the engine returns, refusals included', () => {
    const cases = [
      [L.classifyOf, E.classify, L.STARTS.classEkn1], [L.classifyOf, E.classify, L.STARTS.classEkn6],
      [L.categorizeOf, E.categorize, L.STARTS.catReservesCumulative], [L.economicLimitOf, E.economicLimit, L.STARTS.econEkene],
      [L.economicLimitOf, E.economicLimit, L.STARTS.econLimitsDisagree], [L.aggregateOf, E.aggregate, L.STARTS.aggContingent],
      [L.reconcileOf, E.reconcile, L.STARTS.recEkene], [L.categorizeOf, E.categorize, { ...L.STARTS.catProspective, method: 'incremental' }],
    ];
    cases.forEach(([lab, eng, a]) => expect(lab(a)).toEqual(eng(clone(a))));
  });
  it('a case file is read at the block a view chose, and one call\'s inputs as they stand', () => {
    const c = { dataset: 'x', 'classify:a': { discovery: 'discovered' }, 'classify:b': { discovery: 'undiscovered' }, reconcile: { unit: 'u' } };
    expect(L.blockKeysOf(c, 'classify')).toEqual(['classify:a', 'classify:b']);
    expect(L.blockKeysOf(c, 'reconcile')).toEqual(['reconcile']);
    expect(L.blockKeysOf(L.STARTS.classEkn1, 'classify')).toEqual([]);
    expect(L.pick(c, 'classify:b')).toEqual({ discovery: 'undiscovered' });
    expect(L.pick(L.STARTS.classEkn1, 'classify')).toBe(L.STARTS.classEkn1);
    expect(L.parseJson('{"a": 1}').value).toEqual({ a: 1 });
    expect(L.parseJson('{a: 1}').error).toBeTruthy();
    expect(L.parseJson('').error).toBeTruthy();
  });
  it('the rewrites keep the terms of their own form only', () => {
    expect(L.estimatesFor('incremental', { low: 1, best: 2, high: 3 })).toEqual({});
    expect(L.estimatesFor('cumulative', { low: 1, best: 2, high: 3 })).toEqual({ low: 1, best: 2, high: 3 });
    expect(L.distributionFor('normal', { type: 'lognormal', mean: 4, stdDev: 1 })).toEqual({ type: 'normal', mean: 4, stdDev: 1 });
    expect(L.distributionFor('triangular', { type: 'normal', mean: 4, stdDev: 1 })).toEqual({ type: 'triangular' });
    expect(L.distributionFor('triangular-fit', { type: 'normal', mean: 4 })).toEqual({ type: 'triangular-fit' });
    expect(L.correlationFor('uniform', { type: 'pairs', pairs: [] })).toEqual({ type: 'uniform' });
    expect(L.correlationFor('pairs', { type: 'uniform', rho: 0.3 })).toEqual({ type: 'pairs', pairs: [] });
    expect(L.movementFor('production', { type: 'revisions', low: 1, best: 2, high: 3, note: 'n' })).toEqual({ type: 'production', note: 'n' });
    expect(L.movementFor('divestments', { type: 'revisions', low: 1, best: 2, high: 3 })).toEqual({ type: 'divestments', low: 1, best: 2, high: 3 });
    expect(L.estimatesFor(undefined, {})).toBeUndefined();
    expect(L.aggregateOf({ ...L.STARTS.aggContingent, correlation: L.correlationFor('uniform', L.STARTS.aggReserves.correlation) }).field).toBe('correlation.rho');
  });
});

const CASE_FILES = ['abagana', 'awkuzu', 'isuofia'].map((n) => ({
  name: n, text: fs.readFileSync(path.join(ROOT, `src/content/capstone-cases/prms/${n}_case.json`), 'utf8'),
}));
const CASES = CASE_FILES.map((c) => JSON.parse(c.text));

describe('THE PASTE GATE: a whole case file pasted into a view runs the block it chose', () => {
  it('every block of every case gives the whole case the same result as the block alone, and a block alone runs as it stands', () => {
    let n = 0;
    CASES.forEach((c) => L.VIEWS.forEach((view) => L.blockKeysOf(c, view).forEach((k) => {
      const whole = L.viewRun(view, c, k);
      expect(whole.error, `${c.dataset} ${k}`).toBeUndefined();
      expect(whole).toEqual(ROUTES[view](c[k]));
      expect(L.viewRun(view, c[k], k)).toEqual(whole);
      n += 1;
    })));
    expect(n).toBe(8);
  });
  it('NEGATIVE CONTROL: the raw route without the block refuses the whole case by its first unknown key', () => {
    expect(L.classifyOf(CASES[0]).error).toMatch(/^dataset is not an accepted key/);
    expect(L.economicLimitOf(CASES[1]).error).toMatch(/^dataset is not an accepted key/);
  });
  it('a stated control writes into the right block of a whole case file, and "not stated" makes the engine refuse', () => {
    const ab = CASE_FILES[0].text;
    const noPd = JSON.parse(L.setStated(ab, 'classify:lead', 'chances.developmentPct', undefined).text);
    expect(noPd['classify:prospect']).toEqual(CASES[0]['classify:prospect']);
    expect(L.viewRun('classify', noPd, 'classify:lead').field).toBe('chances.developmentPct');
    const noMethod = JSON.parse(L.setStated(ab, 'categorize:reserves', 'method', undefined).text);
    expect(L.viewRun('categorize', noMethod, 'categorize:reserves').field).toBe('method');
    const noBasis = JSON.parse(L.setStated(CASE_FILES[1].text, 'economicLimit', 'reportingBasis', undefined).text);
    expect(L.viewRun('economicLimit', noBasis, 'economicLimit').field).toBe('reportingBasis');
    const noSeed = JSON.parse(L.setStated(CASE_FILES[2].text, 'aggregate:contingent', 'seed', undefined).text);
    expect(L.viewRun('aggregate', noSeed, 'aggregate:contingent').field).toBe('seed');
    expect(noSeed['aggregate:reserves']).toEqual(CASES[2]['aggregate:reserves']);
    const noTol = JSON.parse(L.setStated(CASE_FILES[2].text, 'reconcile', 'tolerance', undefined).text);
    expect(L.viewRun('reconcile', noTol, 'reconcile').field).toBe('tolerance');
    expect(L.setStated('not json', 'reconcile', 'tolerance', 1).error).toBeTruthy();
  });
  it('clearing both optional Nigerian inputs removes the group whole, and the engine classifies without it', () => {
    const t = L.pretty(L.STARTS.classEkn3);
    const one = JSON.parse(L.setStated(t, 'classify', 'nigeria.declaration', undefined).text);
    expect(one.nigeria).toBeTruthy();
    expect(L.classifyOf(one).field).toBe('nigeria.declaration');
    const both = JSON.parse(L.setStated(L.pretty(one), 'classify', 'nigeria.yearsSinceDeclaration', undefined).text);
    expect(Object.prototype.hasOwnProperty.call(both, 'nigeria')).toBe(false);
    const r = L.classifyOf(both);
    expect(r.error).toBeUndefined();
    expect(r.nigeria).toBeNull();
    expect(r.class).toBe(L.classifyOf(L.STARTS.classEkn3).class);
  });
  it('every starting case runs, except the two-rules case the engine refuses by design', () => {
    Object.entries(L.STARTS).forEach(([k, a]) => {
      const id = Object.keys(L.GOLDEN_ARGS).find((g) => L.GOLDEN_ARGS[g].args === a);
      const fn = id ? L.GOLDEN_ARGS[id].fn : (a.discovery ? 'classify' : a.forecasts ? 'economicLimit' : a.projects ? 'aggregate' : 'reconcile');
      const r = ROUTES[fn](a);
      if (k === 'econLimitsDisagree') expect(r.field, k).toBe('forecasts.low');
      else expect(r.error, k).toBeUndefined();
    });
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
    console.log(`[prms lab] ${values.length} lab and dataset numbers x 18 graded answers x 5 shiftings: 0 within ten tolerances`);
  }, 120000);
  it('NEGATIVE CONTROL: a planted graded answer is caught and named', () => {
    const planted = [...all(), ['planted', FIELDS[7][2] + FIELDS[7][3]]];
    const hits = sweep(planted);
    expect(hits.length).toBe(1);
    expect(hits[0]).toContain(FIELDS[7][1]);
  }, 120000);
  it('the lab holds no tolerance and names no capstone', () => {
    expect(LAB_SOURCE).not.toMatch(/gradedTolerance|fields\.json/);
    expect(LAB_SOURCE).not.toMatch(/\b(?:abagana|awkuzu|isuofia)\b/i);
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
