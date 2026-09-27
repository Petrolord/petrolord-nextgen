// Every value the SC4 teaching lab exposes to a panel, a lesson or the page is
// pinned here against the teaching digest (tools/course-waves/marine/digest.txt),
// which is nothing but the engine's return values on the Ekene cluster, the
// golden inputs and the stated inputs the digest prints.
//
// THE GATES IN THIS FILE:
//   THE DATASET GATE   the lab reads the vendored fixture and the INPUTS of the
//                      vendored golden file (packages/engines/test-data/
//                      supplychain/goldens/marine_cases.json) and never its
//                      expected figures.
//   THE DIGEST GATE    EVERY numeric leaf every teaching reader returns is
//                      printed in the digest, and named figures are pinned to
//                      the digest rows that print them.
//   THE REBUILD GATE   the committed marine_dump.mjs, run in a child process
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
import * as E from '@petrolord/engines/engines/supplychain/marineLogistics.js';
import * as L from './marineLab.js';
import { waveInput, mirrorDir } from '../../../../../tools/course-waves/waveInputs.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const WAVE = 'marine';
const DIGEST = fs.readFileSync(waveInput(WAVE, 'digest.txt'), 'utf8');
const FIELDS = JSON.parse(fs.readFileSync(waveInput(WAVE, 'fields.json'), 'utf8'));
const LAB_SOURCE = fs.readFileSync(path.join(HERE, 'marineLab.js'), 'utf8');
const ENGINES = path.join(ROOT, 'packages/engines');
const GOLDEN = path.join(ENGINES, 'test-data/supplychain/goldens/marine_cases.json');
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
  voyageReader: L.voyageReader,
  fleetReader: L.fleetReader,
  deckReader: L.deckReader,
  baseReader: L.baseReader,
  variabilityReader: L.variabilityReader,
};
const ROUTES = {
  voyagePlan: L.voyagePlanOf, fleetSize: L.fleetSizeOf, fleetVariability: L.fleetVariabilityOf, deckPlan: L.deckPlanOf, shoreBase: L.shoreBaseOf,
};

describe('THE DATASET GATE: the lab reads the fixture and the golden INPUTS only', () => {
  it('every golden case is its inputs and nothing else', () => {
    const gold = JSON.parse(fs.readFileSync(GOLDEN, 'utf8'));
    expect(Object.keys(L.GOLDEN_ARGS)).toEqual(gold.cases.map((c) => c.id));
    gold.cases.forEach((c) => {
      expect(L.GOLDEN_ARGS[c.id]).toEqual({ fn: c.fn, args: c.args });
      expect(Object.keys(L.GOLDEN_ARGS[c.id])).not.toContain('expected');
    });
    console.log(`[marine lab] ${gold.cases.length} golden cases, inputs only, read from the vendored golden file`);
  });
  it('the fixture is the vendored file and says SYNTHETIC', () => {
    const disk = JSON.parse(fs.readFileSync(path.join(ENGINES, 'test-data/supplychain/ekene-marine/marine.json'), 'utf8'));
    expect(L.FIXTURE).toEqual(disk);
    expect(L.FIXTURE.synthetic.startsWith('SYNTHETIC')).toBe(true);
  });
  it('every golden case a panel starts from is one the digest names', () => {
    const used = Object.entries(L.GOLDEN_ARGS).filter(([, g]) => Object.values(L.STARTS).includes(g.args));
    expect(used.length).toBeGreaterThanOrEqual(60);
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
    console.log(`[marine lab] ${total} numeric leaves over ${Object.keys(READERS).length} readers, every one printed in the digest`);
  });

  it('NEGATIVE CONTROL: a number the digest does not print is reported as unprinted', () => {
    const t = L.baseReader().mmcWait;
    expect(printed(0.1234567)).toBe(false);
    expect(printed(t + 1e-4)).toBe(false);
    expect(printed(t)).toBe(true);
  });

  it('pins named figures to the exact digest rows that print them', () => {
    const v = L.voyageReader();
    expect(DIGEST).toContain(`| ekene-voyage-milk-run-psv | ${f6(11.236364)} |`.replace(f6(11.236364), f6(L.voyagePlanOf(L.STARTS.voyEkenePsv).voyages[0].fuelT.sailing)));
    expect(DIGEST).toContain(`| milk-run | EKA, EKJ, EKB, EKF | 206.000000 |`);
    expect(DIGEST).toContain(f6(v.hours));
    const f = L.fleetReader();
    expect(DIGEST).toContain(`| ekene-fleet-psv-milk-run | milk-run 4 (deck area) | ${f6(f.vesselDays)} | ${f6(f.vesselsExact)} | 2 | ${f6(f.spare)} |`);
    const d = L.deckReader();
    expect(DIGEST).toContain(`${f6(d.ffdArea)} m2 carried of 600.000000 usable; ${d.ffdOverflow} units overflow`);
    const b = L.baseReader();
    expect(DIGEST).toContain(`| ekene-base-mmc | 2 | 3.2 | 24 | true | 5.000000 | 6.000000 | ${f6(b.service)} |`);
    const m = L.variabilityReader();
    expect(DIGEST).toContain(`| P90 (low) | ${f6(m.p90)} |`);
    expect(DIGEST).toContain(`seed ${m.seed}, ${m.iterations} draws`);
  });

  it('every refusal a route returns is the engine\'s own message, the digest quotes it verbatim, and the lab never writes it', () => {
    const gold = JSON.parse(fs.readFileSync(GOLDEN, 'utf8'));
    const refusals = gold.cases.filter((c) => c.expected && c.expected.error === true);
    expect(refusals.length).toBe(79);
    let n = 0;
    refusals.forEach((c) => {
      const r = ROUTES[c.fn](c.args);
      expect(r.error, c.id).toBe(c.expected.message);
      expect(DIGEST, c.id).toContain(r.error);
      expect(LAB_SOURCE.includes(r.error), `the lab writes the message of ${c.id} as a literal`).toBe(false);
      n += 1;
    });
    expect(n).toBe(79);
  });
});

describe('THE REBUILD GATE: the committed generator reproduces the committed digest', () => {
  const rebuild = (tz) => execFileSync('node', [path.join(mirrorDir(WAVE), 'marine_dump.mjs')], {
    encoding: 'utf8',
    maxBuffer: 1e8,
    env: {
      ...process.env, TZ: tz, LC_ALL: 'C', SC4_WAVE_DIR: mirrorDir(WAVE), SC4_ENGINES: ENGINES, SC4_REPO: ROOT,
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
    console.log(`[marine lab] the committed marine_dump.mjs rebuilt ${a.split('\n').length} lines byte for byte in two time zones`);
  }, 240000);
});

describe('THE ENGINE GATE: the interactive routes are the engine, unchanged', () => {
  it('each route returns what the engine returns, refusals included', () => {
    const cases = [
      [L.voyagePlanOf, E.voyagePlan, L.STARTS.voyEkenePsv], [L.voyagePlanOf, E.voyagePlan, L.STARTS.voyEkeneAhts],
      [L.fleetSizeOf, E.fleetSize, L.STARTS.fleetEkenePsv], [L.fleetSizeOf, E.fleetSize, L.STARTS.fleetNearestShort],
      [L.fleetVariabilityOf, E.fleetVariability, L.STARTS.varEkenePsv], [L.deckPlanOf, E.deckPlan, L.STARTS.deckEkeneFfd],
      [L.shoreBaseOf, E.shoreBase, L.STARTS.baseEkeneMdc], [L.shoreBaseOf, E.shoreBase, L.STARTS.baseOneBerth],
    ];
    cases.forEach(([lab, eng, a]) => expect(lab(a)).toEqual(eng(clone(a))));
  });
  it('a case file is read at the block a view chose, and one call\'s inputs as they stand', () => {
    const c = { dataset: 'x', 'voyagePlan:a': { portHours: 1 }, 'voyagePlan:b': { portHours: 2 }, deckPlan: { voyages: 1 } };
    expect(L.blockKeysOf(c, 'voyagePlan')).toEqual(['voyagePlan:a', 'voyagePlan:b']);
    expect(L.blockKeysOf(c, 'deckPlan')).toEqual(['deckPlan']);
    expect(L.blockKeysOf(L.STARTS.voyEkenePsv, 'voyagePlan')).toEqual([]);
    expect(L.pick(c, 'voyagePlan:b')).toEqual({ portHours: 2 });
    expect(L.pick(L.STARTS.voyEkenePsv, 'voyagePlan')).toBe(L.STARTS.voyEkenePsv);
    expect(L.parseJson('{"a": 1}').value).toEqual({ a: 1 });
    expect(L.parseJson('{a: 1}').error).toBeTruthy();
    expect(L.parseJson('').error).toBeTruthy();
  });
  it('the rewrites keep the terms of their own form only, and the engine refuses what the new form still needs', () => {
    expect(L.factorFor('triangular', 1.2)).toEqual({});
    expect(L.factorFor('triangular', { min: 1, mode: 1.2, max: 1.6 })).toEqual({ min: 1, mode: 1.2, max: 1.6 });
    expect(L.factorFor('fixed', { min: 1, mode: 1.2, max: 1.6 })).toBeUndefined();
    expect(L.factorFor('fixed', 1.2)).toBe(1.2);
    expect(L.factorFor(undefined, 1.2)).toBeUndefined();
    const toDed = JSON.parse(L.setRouteMode(L.pretty(L.STARTS.voyEkenePsv), 'voyagePlan', 'dedicated').text);
    expect(toDed.route).toEqual({ mode: 'dedicated' });
    expect(L.voyagePlanOf(toDed).field).toBe('installations[0].distanceFromBaseNm');
    const toMilk = JSON.parse(L.setRouteMode(L.pretty(L.STARTS.voyDedicatedPsv), 'voyagePlan', 'milk-run').text);
    expect(toMilk.route.stops).toEqual(L.STARTS.voyDedicatedPsv.installations.map((x) => x.id));
    expect(toMilk.installations.every((x) => x.distanceFromBaseNm === undefined)).toBe(true);
    expect(L.voyagePlanOf(toMilk).field).toBe('route.legsNm');
  });
  it('the berth sweep is the engine at more berths', () => {
    const s = L.berthSweep(L.STARTS.baseEkeneMmc);
    expect(s.map(([c]) => c)).toEqual([3, 4, 5, 6]);
    s.forEach(([c, r]) => expect(r).toEqual(E.shoreBase({ ...clone(L.STARTS.baseEkeneMmc), berths: c })));
    expect(L.berthSweep({ berths: 'two' })).toEqual([]);
  });
});

const CASE_FILES = ['nkerefi', 'akokwa', 'mgbidi'].map((n) => ({
  name: n, text: fs.readFileSync(path.join(ROOT, `src/content/capstone-cases/marine/${n}_case.json`), 'utf8'),
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
    expect(n).toBe(7);
  });
  it('NEGATIVE CONTROL: the raw route without the block refuses the whole case by its first unknown key', () => {
    expect(L.voyagePlanOf(CASES[0]).error).toMatch(/^dataset is not an accepted key/);
    expect(L.shoreBaseOf(CASES[2]).error).toMatch(/^dataset is not an accepted key/);
  });
  it('a stated control writes into the right block of a whole case file, and "not stated" makes the engine refuse', () => {
    const nk = CASE_FILES[0].text;
    const noApplies = JSON.parse(L.setStated(nk, 'voyagePlan:dedicated', 'weather.appliesTo', undefined).text);
    expect(noApplies['voyagePlan:milk-run']).toEqual(CASES[0]['voyagePlan:milk-run']);
    expect(L.viewRun('voyagePlan', noApplies, 'voyagePlan:dedicated').field).toBe('weather.appliesTo');
    const noRounding = JSON.parse(L.setStated(CASE_FILES[1].text, 'fleetSize', 'vesselRounding', undefined).text);
    expect(L.viewRun('fleetSize', noRounding, 'fleetSize').field).toBe('vesselRounding');
    const noRule = JSON.parse(L.setStated(CASE_FILES[1].text, 'deckPlan', 'rule', undefined).text);
    expect(L.viewRun('deckPlan', noRule, 'deckPlan').field).toBe('rule');
    const noModel = JSON.parse(L.setStated(CASE_FILES[2].text, 'shoreBase:mdc', 'model', undefined).text);
    expect(L.viewRun('shoreBase', noModel, 'shoreBase:mdc').field).toBe('model');
    expect(noModel['shoreBase:mmc']).toEqual(CASES[2]['shoreBase:mmc']);
    const noSeed = JSON.parse(L.setStated(CASE_FILES[2].text, 'fleetVariability', 'seed', undefined).text);
    expect(L.viewRun('fleetVariability', noSeed, 'fleetVariability').field).toBe('seed');
    expect(L.setStated('not json', 'deckPlan', 'rule', 'first-fit').error).toBeTruthy();
  });
  it('every starting case runs, except the ones the engine refuses by design', () => {
    Object.entries(L.STARTS).forEach(([k, a]) => {
      const id = Object.keys(L.GOLDEN_ARGS).find((g) => L.GOLDEN_ARGS[g].args === a);
      const r = ROUTES[L.GOLDEN_ARGS[id].fn](a);
      if (L.REFUSED_STARTS.includes(k)) expect(r.field, k).toBe('arrivalsPerDay');
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
    console.log(`[marine lab] ${values.length} lab and dataset numbers x 18 graded answers x 5 shiftings: 0 within ten tolerances`);
  }, 120000);
  it('NEGATIVE CONTROL: a planted graded answer is caught and named', () => {
    const planted = [...all(), ['planted', FIELDS[7][2] + FIELDS[7][3]]];
    const hits = sweep(planted);
    expect(hits.length).toBe(1);
    expect(hits[0]).toContain(FIELDS[7][1]);
  }, 120000);
  it('the lab holds no tolerance and names no capstone', () => {
    expect(LAB_SOURCE).not.toMatch(/gradedTolerance|fields\.json/);
    expect(LAB_SOURCE).not.toMatch(/\b(?:nkerefi|akokwa|mgbidi)\b/i);
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
