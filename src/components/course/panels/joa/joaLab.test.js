// Every value the EC9 teaching lab exposes to a panel, a lesson or the page is
// pinned here against the teaching digest (tools/course-waves/joa/digest.txt),
// which is nothing but the engine's return values on the Ekene joint venture,
// the golden inputs and the stated inputs the digest prints.
//
// THE GATES IN THIS FILE:
//   THE DATASET GATE   the lab reads the vendored fixture and the INPUTS of the
//                      vendored golden file (packages/engines/test-data/
//                      economics/goldens/jointventure_cases.json) and never its
//                      expected figures.
//   THE DIGEST GATE    EVERY numeric leaf every teaching reader returns is
//                      printed in the digest, and named figures are pinned to
//                      the digest rows that print them.
//   THE REBUILD GATE   the committed joa_dump.mjs, run in a child process
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
import * as J from '@petrolord/engines/engines/economics/jointVenture.js';
import * as L from './joaLab.js';
import { waveInput, mirrorDir } from '../../../../../tools/course-waves/waveInputs.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const WAVE = 'joa';
const DIGEST = fs.readFileSync(waveInput(WAVE, 'digest.txt'), 'utf8');
const FIELDS = JSON.parse(fs.readFileSync(waveInput(WAVE, 'fields.json'), 'utf8'));
const LAB_SOURCE = fs.readFileSync(path.join(HERE, 'joaLab.js'), 'utf8');
const ENGINES = path.join(ROOT, 'packages/engines');
const GOLDEN = path.join(ENGINES, 'test-data/economics/goldens/jointventure_cases.json');
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
  interestsReader: L.interestsReader,
  ledgerReader: L.ledgerReader,
  carryReader: L.carryReader,
  pscReader: L.pscReader,
  nonConsentReader: L.nonConsentReader,
  defaultReader: L.defaultReader,
};

describe('THE DATASET GATE: the lab reads the fixture and the golden INPUTS only', () => {
  it('every golden case is its inputs and nothing else', () => {
    const gold = JSON.parse(fs.readFileSync(GOLDEN, 'utf8'));
    expect(Object.keys(L.GOLDEN_ARGS)).toEqual(gold.cases.map((c) => c.id));
    gold.cases.forEach((c) => {
      expect(L.GOLDEN_ARGS[c.id]).toEqual({ fn: c.fn, args: c.args });
      expect(Object.keys(L.GOLDEN_ARGS[c.id])).not.toContain('expected');
    });
    console.log(`[joa lab] ${gold.cases.length} golden cases, inputs only, read from the vendored golden file`);
  });
  it('the fixture is the vendored file and says SYNTHETIC', () => {
    const disk = JSON.parse(fs.readFileSync(path.join(ENGINES, 'test-data/economics/ekene-jv/ekene-jv.json'), 'utf8'));
    expect(L.FIXTURE).toEqual(disk);
    expect(L.FIXTURE.synthetic.startsWith('SYNTHETIC')).toBe(true);
  });
  it('every golden case a panel starts from is one the digest names', () => {
    const used = Object.entries(L.GOLDEN_ARGS).filter(([, g]) => Object.values(L.STARTS).includes(g.args) || Object.values(L.READING_CASES).includes(g.args));
    expect(used.length).toBeGreaterThanOrEqual(20);
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
    console.log(`[joa lab] ${total} numeric leaves over ${Object.keys(READERS).length} readers, every one printed in the digest`);
  });

  it('NEGATIVE CONTROL: a number the digest does not print is reported as unprinted', () => {
    const t = L.defaultReader().interestTotal;
    expect(printed(0.1234567)).toBe(false);
    expect(printed(t + 1e-4)).toBe(false);
    expect(printed(t)).toBe(true);
  });

  it('pins named figures to the exact digest rows that print them', () => {
    L.carryReader().forEach((l) => expect(DIGEST).toContain(`| ${l.year} | `));
    const c = L.carryReader().find((l) => l.year === 2033);
    expect(DIGEST).toContain(`| 2033 | ${f6(c.opening)} | ${f6(c.uplift)} |`);
    L.interestsReader().forEach((p) => expect(DIGEST).toContain(`| int-ekene | ${p.id} | ${f6(p.beneficialPct)} | ${f6(p.payingPct)} |`));
    const d = L.defaultReader();
    expect(DIGEST).toContain(`default interest simple or compounded monthly`);
    expect(DIGEST).toContain(f6(d.interestTotal));
    L.ledgerReader().months.forEach((m) => expect(DIGEST).toContain(`| ${m.month} | ${f6(m.forecast)} | ${f6(m.actual)} |`));
  });

  it('every refusal a route returns is the engine\'s own message, the digest quotes it verbatim, and the lab never writes it', () => {
    const gold = JSON.parse(fs.readFileSync(GOLDEN, 'utf8'));
    const refusals = gold.cases.filter((c) => c.expected && c.expected.error === true);
    expect(refusals.length).toBe(78);
    const routes = {
      participatingInterests: L.interestsOf, cashCalls: L.cashCallsOf, budgetControl: L.budgetOf, overhead: L.overheadOf,
      defaultCover: L.defaultOf, carryRecovery: L.carryOf, backIn: L.backInOf, nonConsent: L.nonConsentOf, pscCostRecovery: L.pscOf,
    };
    let n = 0;
    refusals.forEach((c) => {
      const r = routes[c.fn](c.args);
      expect(r.error, c.id).toBe(c.expected.message);
      expect(DIGEST, c.id).toContain(r.error);
      expect(LAB_SOURCE.includes(r.error), `the lab writes the message of ${c.id} as a literal`).toBe(false);
      n += 1;
    });
    expect(n).toBe(78);
  });
});

describe('THE REBUILD GATE: the committed generator reproduces the committed digest', () => {
  const rebuild = (tz) => execFileSync('node', [path.join(mirrorDir(WAVE), 'joa_dump.mjs')], {
    encoding: 'utf8',
    maxBuffer: 1e8,
    env: {
      ...process.env, TZ: tz, LC_ALL: 'C', EC9_WAVE_DIR: mirrorDir(WAVE), EC9_ENGINES: ENGINES, EC9_REPO: ROOT,
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
    console.log(`[joa lab] the committed joa_dump.mjs rebuilt ${a.split('\n').length} lines byte for byte in two time zones`);
  }, 240000);
});

describe('THE ENGINE GATE: the interactive routes are the engine, unchanged', () => {
  it('each route returns what the engine returns, refusals included', () => {
    const cases = [
      [L.interestsOf, J.participatingInterests, L.STARTS.interests], [L.cashCallsOf, J.cashCalls, L.STARTS.cashCalls],
      [L.budgetOf, J.budgetControl, L.STARTS.budget], [L.overheadOf, J.overhead, L.STARTS.overhead],
      [L.defaultOf, J.defaultCover, L.STARTS.default], [L.carryOf, J.carryRecovery, L.STARTS.carry],
      [L.backInOf, J.backIn, L.STARTS.backIn], [L.nonConsentOf, J.nonConsent, L.STARTS.soleRisk],
      [L.nonConsentOf, J.nonConsent, L.STARTS.buyIn], [L.pscOf, J.pscCostRecovery, L.STARTS.psc],
      [L.cashCallsOf, J.cashCalls, { ...L.STARTS.cashCalls, negativeCall: 'net' }],
    ];
    cases.forEach(([lab, eng, a]) => expect(lab(a)).toEqual(eng(clone(a))));
  });
  it('a pasted case file is read at the key a view needs, and one call\'s inputs as they stand', () => {
    expect(L.pick({ carry: { a: 1 }, psc: 2 }, 'carry')).toEqual({ a: 1 });
    expect(L.pick({ parties: 1 }, 'carry')).toEqual({ parties: 1 });
    expect(L.parseJson('{"a": 1}').value).toEqual({ a: 1 });
    expect(L.parseJson('{a: 1}').error).toBeTruthy();
    expect(L.parseJson('').error).toBeTruthy();
  });
});

const CASE_FILES = ['idumu', 'okwelle', 'abiama'].map((n) => ({
  name: n, text: fs.readFileSync(path.join(ROOT, `src/content/capstone-cases/joa/${n}_case.json`), 'utf8'),
}));
const CASES = CASE_FILES.map((c) => JSON.parse(c.text));

describe('THE PASTE GATE: a whole case file pasted into any view runs that view\'s block', () => {
  const VIEWS = [
    ['interests', L.viewInterests, L.interestsOf], ['cashCalls', L.viewCashCalls, L.cashCallsOf], ['budget', L.viewBudget, L.budgetOf],
    ['overhead', L.viewOverhead, L.overheadOf], ['carry', L.viewCarry, L.carryOf], ['backIn', L.viewBackIn, L.backInOf],
    ['default', L.viewDefault, L.defaultOf], ['psc', L.viewPsc, L.pscOf], ['soleRisk', L.viewSoleRisk, L.nonConsentOf], ['buyIn', L.viewBuyIn, L.nonConsentOf],
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
    expect(n).toBe(14);
  });
  it('NEGATIVE CONTROL: the raw route without pick refuses the whole case by its first unknown key', () => {
    expect(L.carryOf(CASES[1]).error).toMatch(/^dataset is not an accepted key/);
    expect(L.pscOf(CASES[2]).error).toMatch(/^dataset is not an accepted key/);
  });
  it('a stated control writes into the right block of a whole case file, and "not stated" makes the engine refuse', () => {
    const okwelle = CASE_FILES[1].text;
    const w = L.setStated(okwelle, 'default', 'interest.interestMethod', 'simple');
    const v = JSON.parse(w.text);
    expect(v.default.interest.interestMethod).toBe('simple');
    expect(v.carry).toEqual(CASES[1].carry);
    expect(v.psc).toEqual(CASES[1].psc);
    const removed = JSON.parse(L.setStated(okwelle, 'default', 'interest.graceHours', undefined).text);
    expect(removed.default.interest.graceHours).toBeUndefined();
    expect(L.viewDefault(removed).field).toBe('interest.graceHours');
    const noBase = JSON.parse(L.setStated(okwelle, 'psc', 'costOilLimitBase', undefined).text);
    expect(L.viewPsc(noBase).field).toBe('costOilLimitBase');
    const noLag = JSON.parse(L.setStated(CASE_FILES[0].text, 'cashCalls', 'reconciliationLagMonths', undefined).text);
    expect(L.viewCashCalls(noLag).field).toBe('reconciliationLagMonths');
    // a single call's inputs are written as they stand
    const single = JSON.parse(L.setStated(L.pretty(L.STARTS.carry), 'carry', 'uplift.type', 'none').text);
    expect(single.uplift.type).toBe('none');
    expect(L.setStated('not json', 'carry', 'basis', 'contract').error).toBeTruthy();
  });
  it('every starting case states its required inputs', () => {
    expect(L.STARTS.default.interest.interestMethod).toBeDefined();
    expect(L.STARTS.default.interest.graceHours).toBeDefined();
    expect(L.STARTS.cashCalls.reconciliationLagMonths).toBeDefined();
    expect(L.STARTS.psc.costOilLimitBase).toBeDefined();
    Object.entries(L.STARTS).forEach(([k, a]) => {
      const fn = L.GOLDEN_ARGS[Object.keys(L.GOLDEN_ARGS).find((id) => L.GOLDEN_ARGS[id].args === a)].fn;
      const route = {
        participatingInterests: L.interestsOf, cashCalls: L.cashCallsOf, budgetControl: L.budgetOf, overhead: L.overheadOf,
        defaultCover: L.defaultOf, carryRecovery: L.carryOf, backIn: L.backInOf, nonConsent: L.nonConsentOf, pscCostRecovery: L.pscOf,
      }[fn];
      expect(route(a).error, k).toBeUndefined();
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
    console.log(`[joa lab] ${values.length} lab and dataset numbers x 18 graded answers x 5 shiftings: 0 within ten tolerances`);
  }, 120000);
  it('NEGATIVE CONTROL: a planted graded answer is caught and named', () => {
    const planted = [...all(), ['planted', FIELDS[7][2] + FIELDS[7][3]]];
    const hits = sweep(planted);
    expect(hits.length).toBe(1);
    expect(hits[0]).toContain(FIELDS[7][1]);
  }, 120000);
  it('the lab holds no tolerance and names no capstone', () => {
    expect(LAB_SOURCE).not.toMatch(/gradedTolerance|fields\.json/);
    expect(LAB_SOURCE).not.toMatch(/\b(?:idumu|okwelle|abiama)\b/i);
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
