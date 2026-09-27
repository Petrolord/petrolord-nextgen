// Every value the EC10 teaching lab exposes to a panel, a lesson or the page is
// pinned here against the teaching digest (tools/course-waves/farmout/digest.txt),
// which is nothing but the engine's return values on the Ekene Deep farm-out,
// the golden inputs and the stated inputs the digest prints.
//
// THE GATES IN THIS FILE:
//   THE DATASET GATE   the lab reads the vendored fixture and the INPUTS of the
//                      vendored golden file (packages/engines/ec10-farmout/
//                      test-data/economics/goldens/farmout_cases.json) and never
//                      its expected figures.
//   THE DIGEST GATE    EVERY numeric leaf every teaching reader returns is
//                      printed in the digest, and named figures are pinned to
//                      the digest rows that print them.
//   THE REBUILD GATE   the committed farmout_dump.mjs, run in a child process
//                      against this repository's vendored engine and the
//                      committed wave inputs, reproduces the committed digest
//                      byte for byte, under two time zones.
//   THE ENGINE GATE    every interactive route returns exactly what the engine
//                      returns, refusals included, and no refusal message is
//                      written as a literal in the lab.
//   THE PASTE GATE     a whole capstone case file pasted into any view runs
//                      that view's block; a stated control writes into the
//                      right block and "not stated" makes the engine refuse.
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
import * as E from '@petrolord/engines/ec10-farmout/engines/economics/farmout.js';
import * as L from './farmoutLab.js';
import { waveInput, mirrorDir } from '../../../../../tools/course-waves/waveInputs.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const WAVE = 'farmout';
const DIGEST = fs.readFileSync(waveInput(WAVE, 'digest.txt'), 'utf8');
const FIELDS = JSON.parse(fs.readFileSync(waveInput(WAVE, 'fields.json'), 'utf8'));
const LAB_SOURCE = fs.readFileSync(path.join(HERE, 'farmoutLab.js'), 'utf8');
const ENGINES = path.join(ROOT, 'packages/engines/ec10-farmout');
const GOLDEN = path.join(ENGINES, 'test-data/economics/goldens/farmout_cases.json');
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
  earningReader: L.earningReader,
  dealReader: L.dealReader,
  carryReader: L.carryReader,
  feeReader: L.feeReader,
  informationReader: L.informationReader,
  priceReader: L.priceReader,
};
const ROUTES = {
  earningObligation: L.earningOf, dealValue: L.dealOf, informationValue: L.informationOf, interestValue: L.priceOf,
  riskSharing: L.riskOf, consentFee: L.feeOf, developmentCarry: L.devCarryOf, backInRight: L.backInOf,
};

describe('THE DATASET GATE: the lab reads the fixture and the golden INPUTS only', () => {
  it('every golden case is its inputs and nothing else', () => {
    const gold = JSON.parse(fs.readFileSync(GOLDEN, 'utf8'));
    expect(Object.keys(L.GOLDEN_ARGS)).toEqual(gold.cases.map((c) => c.id));
    gold.cases.forEach((c) => {
      expect(L.GOLDEN_ARGS[c.id]).toEqual({ fn: c.fn, args: c.args });
      expect(Object.keys(L.GOLDEN_ARGS[c.id])).not.toContain('expected');
    });
    console.log(`[farmout lab] ${gold.cases.length} golden cases, inputs only, read from the vendored golden file`);
  });
  it('the fixture is the vendored file and says SYNTHETIC', () => {
    const disk = JSON.parse(fs.readFileSync(path.join(ENGINES, 'test-data/economics/ekene-farmout/ekene-farmout.json'), 'utf8'));
    expect(L.FIXTURE).toEqual(disk);
    expect(L.FIXTURE.synthetic.startsWith('SYNTHETIC')).toBe(true);
  });
  it('every golden case a panel starts from is one the digest names', () => {
    const used = Object.entries(L.GOLDEN_ARGS).filter(([, g]) => Object.values(L.STARTS).includes(g.args) || Object.values(L.READING_CASES).includes(g.args));
    expect(used.length).toBeGreaterThanOrEqual(40);
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
    expect(total).toBeGreaterThan(40);
    console.log(`[farmout lab] ${total} numeric leaves over ${Object.keys(READERS).length} readers, every one printed in the digest`);
  });

  it('NEGATIVE CONTROL: a number the digest does not print is reported as unprinted', () => {
    const t = L.dealReader().farmineeEmv;
    expect(printed(0.1234567)).toBe(false);
    expect(printed(t + 1e-4)).toBe(false);
    expect(printed(t)).toBe(true);
  });

  it('pins named figures to the exact digest rows that print them', () => {
    L.carryReader().forEach((l) => expect(DIGEST).toContain(`| ${l.year} | ${f6(l.opening)} | ${f6(l.uplift)} |`));
    const e = L.earningReader();
    expect(DIGEST).toContain(`| earn-ekene-single | ${L.STARTS.earning.events[0].name} | ${f6(e.grossCost)} |`);
    const d = L.dealReader();
    expect(DIGEST).toContain(`| ${L.FIXTURE.farminee.id} farms in | `);
    expect(DIGEST).toContain(f6(d.farmineeEmv));
    expect(DIGEST).toContain(f6(d.breakEvenSharePct));
  });

  it('every refusal a route returns is the engine\'s own message, the digest quotes it verbatim, and the lab never writes it', () => {
    const gold = JSON.parse(fs.readFileSync(GOLDEN, 'utf8'));
    const refusals = gold.cases.filter((c) => c.expected && c.expected.error === true);
    expect(refusals.length).toBe(61);
    let n = 0;
    refusals.forEach((c) => {
      const r = ROUTES[c.fn](c.args);
      expect(r.error, c.id).toBe(c.expected.message);
      // a table cell prints a pipe as a slash
      expect(DIGEST, c.id).toContain(r.error.replace(/\|/g, '/'));
      expect(LAB_SOURCE.includes(r.error), `the lab writes the message of ${c.id} as a literal`).toBe(false);
      n += 1;
    });
    expect(n).toBe(61);
  });
});

describe('THE REBUILD GATE: the committed generator reproduces the committed digest', () => {
  const rebuild = (tz) => execFileSync('node', [path.join(mirrorDir(WAVE), 'farmout_dump.mjs')], {
    encoding: 'utf8',
    maxBuffer: 1e8,
    env: {
      ...process.env, TZ: tz, LC_ALL: 'C', EC10_WAVE_DIR: mirrorDir(WAVE), EC10_ENGINES: ENGINES, EC10_REPO: ROOT,
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
    console.log(`[farmout lab] the committed farmout_dump.mjs rebuilt ${a.split('\n').length} lines byte for byte in two time zones`);
  }, 240000);
});

describe('THE ENGINE GATE: the interactive routes are the engine, unchanged', () => {
  it('each route returns what the engine returns, refusals included', () => {
    const cases = [
      [L.earningOf, E.earningObligation, L.STARTS.earning], [L.earningOf, E.earningObligation, L.STARTS.dte],
      [L.dealOf, E.dealValue, L.STARTS.deal], [L.informationOf, E.informationValue, L.STARTS.information],
      [L.priceOf, E.interestValue, L.STARTS.price], [L.riskOf, E.riskSharing, L.STARTS.riskPsu],
      [L.feeOf, E.consentFee, L.STARTS.fee], [L.devCarryOf, E.developmentCarry, L.STARTS.devCarry],
      [L.devCarryOf, E.developmentCarry, L.STARTS.devCarrySimple], [L.backInOf, E.backInRight, L.STARTS.backIn],
      [L.feeOf, E.consentFee, { ...L.STARTS.fee, basis: 'market' }],
    ];
    cases.forEach(([lab, eng, a]) => expect(lab(a)).toEqual(eng(clone(a))));
  });
  it('a pasted case file is read at the key a view needs, and one call\'s inputs as they stand', () => {
    expect(L.pick({ dataset: 'x', deal: { a: 1 } }, 'deal')).toEqual({ a: 1 });
    expect(L.pick(L.STARTS.deal, 'deal')).toBe(L.STARTS.deal);
    expect(L.pick(L.STARTS.information, 'information')).toBe(L.STARTS.information);
    expect(L.pick(L.STARTS.backIn, 'backIn')).toBe(L.STARTS.backIn);
    expect(L.pick({ parties: 1 }, 'earning')).toEqual({ parties: 1 });
    expect(L.parseJson('{"a": 1}').value).toEqual({ a: 1 });
    expect(L.parseJson('{a: 1}').error).toBeTruthy();
    expect(L.parseJson('').error).toBeTruthy();
  });
  it('the uplift rewrite keeps the terms of its own type only, simple included', () => {
    const s = L.STARTS.devCarrySimple.uplift;
    expect(L.upliftFor('simple', s)).toEqual(s);
    expect(L.upliftFor('compound', s)).toEqual({ type: 'compound' });
    expect(L.upliftFor('simple', L.STARTS.devCarry.uplift)).toEqual({ type: 'simple' });
    expect(L.devCarryOf({ ...L.STARTS.devCarry, uplift: { type: 'simple', ratePctPerYear: 8 } }).field).toBe('uplift.dayBasis');
    expect(L.upliftFor(undefined, s)).toBeUndefined();
  });
});

const CASE_FILES = ['ogbaku', 'umunze', 'akpugo'].map((n) => ({
  name: n, text: fs.readFileSync(path.join(ROOT, `src/content/capstone-cases/farmout/${n}_case.json`), 'utf8'),
}));
const CASES = CASE_FILES.map((c) => JSON.parse(c.text));

describe('THE PASTE GATE: a whole case file pasted into any view runs that view\'s block', () => {
  const VIEWS = [
    ['earning', L.viewEarning, L.earningOf], ['deal', L.viewDeal, L.dealOf], ['fee', L.viewFee, L.feeOf],
    ['information', L.viewInformation, L.informationOf], ['risk', L.viewRisk, L.riskOf], ['price', L.viewPrice, L.priceOf],
    ['devCarry', L.viewDevCarry, L.devCarryOf], ['backIn', L.viewBackIn, L.backInOf],
  ];
  it('every view gives the whole case the same result as its block alone, and a block alone runs as it stands', () => {
    let n = 0;
    CASES.forEach((c) => VIEWS.forEach(([key, view, route]) => {
      if (!Object.prototype.hasOwnProperty.call(c, key)) return;
      const whole = view(c);
      expect(whole.error, `${c.dataset} ${key}`).toBeUndefined();
      expect(whole).toEqual(route(c[key]));
      expect(view(c[key])).toEqual(whole);
      n += 1;
    }));
    expect(n).toBe(8);
  });
  it('NEGATIVE CONTROL: the raw route without pick refuses the whole case by its first unknown key', () => {
    expect(L.dealOf(CASES[1]).error).toMatch(/^dataset is not an accepted key/);
    expect(L.devCarryOf(CASES[2]).error).toMatch(/^dataset is not an accepted key/);
  });
  it('a stated control writes into the right block of a whole case file, and "not stated" makes the engine refuse', () => {
    const umunze = CASE_FILES[1].text;
    const noBasis = JSON.parse(L.setStated(umunze, 'fee', 'basis', undefined).text);
    expect(noBasis.deal).toEqual(CASES[1].deal);
    expect(L.viewFee(noBasis).field).toBe('basis');
    const noLicence = JSON.parse(L.setStated(umunze, 'fee', 'licence', undefined).text);
    expect(L.viewFee(noLicence).field).toBe('licence');
    const noBonus = JSON.parse(L.setStated(umunze, 'deal', 'deal.cashBonus', undefined).text);
    expect(L.viewDeal(noBonus).field).toBe('deal.cashBonus');
    const noVesting = JSON.parse(L.setStated(CASE_FILES[0].text, 'earning', 'vesting', undefined).text);
    expect(L.viewEarning(noVesting).field).toBe('vesting');
    const noSide = JSON.parse(L.setStated(CASE_FILES[2].text, 'information', 'side', undefined).text);
    expect(L.viewInformation(noSide).field).toBe('side');
    const single = JSON.parse(L.setStated(L.pretty(L.STARTS.deal), 'deal', 'deal.cashBonus', 0).text);
    expect(single.deal.cashBonus).toBe(0);
    expect(L.setStated('not json', 'deal', 'deal.cashBonus', 1).error).toBeTruthy();
  });
  it('every starting case runs', () => {
    Object.entries(L.STARTS).forEach(([k, a]) => {
      const fn = L.GOLDEN_ARGS[Object.keys(L.GOLDEN_ARGS).find((id) => L.GOLDEN_ARGS[id].args === a)].fn;
      expect(ROUTES[fn](a).error, k).toBeUndefined();
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
    console.log(`[farmout lab] ${values.length} lab and dataset numbers x 18 graded answers x 5 shiftings: 0 within ten tolerances`);
  }, 120000);
  it('NEGATIVE CONTROL: a planted graded answer is caught and named', () => {
    const planted = [...all(), ['planted', FIELDS[7][2] + FIELDS[7][3]]];
    const hits = sweep(planted);
    expect(hits.length).toBe(1);
    expect(hits[0]).toContain(FIELDS[7][1]);
  }, 120000);
  it('the lab holds no tolerance and names no capstone', () => {
    expect(LAB_SOURCE).not.toMatch(/gradedTolerance|fields\.json/);
    expect(LAB_SOURCE).not.toMatch(/\b(?:ogbaku|umunze|akpugo)\b/i);
  });
});

describe('THE CLOCK GATE', () => {
  it('no clock, no random number and no path under /root in the lab', () => {
    const code = LAB_SOURCE.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
    expect(code).not.toMatch(/Date\.now|new Date|Math\.random|performance\.now/);
    expect(LAB_SOURCE).not.toMatch(/\/root\//);
  });
  it('this suite names no path under /root', () => {
    const me = fs.readFileSync(fileURLToPath(import.meta.url), 'utf8');
    expect(me.split('\n').filter((l) => /['"`]\/root\//.test(l))).toEqual([]);
  });
});
