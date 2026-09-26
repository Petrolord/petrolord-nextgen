// Every value the SC2 teaching lab exposes to a panel, a lesson or the page is
// pinned here against the teaching digest (tools/course-waves/procurement/
// digest.txt), which is nothing but the tender engine's return values on the
// Ekene tender fixtures and the stated inputs the digest prints.
//
// THE GATES IN THIS FILE:
//   THE DATASET GATE   the lab reads the vendored fixture files themselves
//                      (packages/engines/test-data/supplychain/ekene-tender),
//                      each deep-equal to the file on disk and labelled
//                      synthetic.
//   THE DIGEST GATE    EVERY numeric leaf every teaching reader returns is
//                      printed in the digest (six decimals, or whole numbers as
//                      written), and named figures are pinned to the digest row
//                      that prints them.
//   THE REBUILD GATE   the committed sc2_dump.mjs, run in a child process
//                      against this repository's vendored engine and the
//                      committed wave inputs, reproduces the committed digest
//                      byte for byte, under two time zones.
//   THE ENGINE GATE    every interactive route returns exactly what the engine
//                      returns, refusals included, and no refusal message is
//                      written as a literal in the lab.
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
import * as T from '@petrolord/engines/engines/supplychain/tender.js';
import * as L from './tenderLab.js';
import { waveInput, mirrorDir } from '../../../../../tools/course-waves/waveInputs.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const WAVE = 'procurement';
const DIGEST = fs.readFileSync(waveInput(WAVE, 'digest.txt'), 'utf8');
const FIELDS = JSON.parse(fs.readFileSync(waveInput(WAVE, 'fields.json'), 'utf8'));
const LAB_SOURCE = fs.readFileSync(path.join(HERE, 'tenderLab.js'), 'utf8');
const ENGINES = path.join(ROOT, 'packages/engines');
const FIXDIR = path.join(ENGINES, 'test-data/supplychain/ekene-tender');

/** Every numeric leaf of a value, with its path. Booleans and strings are not numbers. */
const leaves = (v, at = '') => {
  if (typeof v === 'number') return [[at, v]];
  if (Array.isArray(v)) return v.flatMap((x, i) => leaves(x, `${at}[${i}]`));
  if (v && typeof v === 'object') return Object.entries(v).flatMap(([k, x]) => leaves(x, `${at}.${k}`));
  return [];
};
/** Is this number printed in the digest, at the precision the digest declares? */
const printed = (x) => {
  const cands = [x.toFixed(6), ...(Number.isInteger(x) ? [String(x)] : [])];
  return cands.some((c) => new RegExp(`(?<![\\d.])${c.replace('.', '\\.')}(?![\\d])`).test(DIGEST));
};
const f6 = (x) => (x === null ? 'null' : x.toFixed(6));

const READERS = {
  wellServicesReader: L.wellServicesReader,
  materialsReader: L.materialsReader,
  contractsReader: L.contractsReader,
  shouldCostReader: L.shouldCostReader,
};

describe('THE DATASET GATE: the lab reads the vendored Ekene tender fixtures', () => {
  it('each fixture file the lab imports is the file on disk, and says it is synthetic', () => {
    const files = { wellServices: 'well-services.json', materials: 'materials.json' };
    Object.entries(files).forEach(([k, f]) => {
      expect(L.DATASET[k]).toEqual(JSON.parse(fs.readFileSync(path.join(FIXDIR, f), 'utf8')));
      expect(L.DATASET[k].synthetic).toMatch(/^SYNTHETIC/);
      L.DATASET[k].bids.forEach((b) => expect(b.name).toMatch(/\(synthetic\)$/));
    });
    expect(L.WS_BIDS).toHaveLength(6);
    expect(L.MS_BIDS).toHaveLength(5);
    console.log(`[procurement lab] ${L.WS_BIDS.length} well services bids and ${L.MS_BIDS.length} materials bids, read from the vendored fixtures`);
  });
  it('the fixture settings the panels start from are the ones the digest prints', () => {
    const s = L.WELL_SERVICES_SETTINGS;
    expect(DIGEST).toContain(`Stated in the fixture: pass mark ${s.passMark}; completion schedule minWeeks ${s.schedule.minWeeks}, maxWeeks ${s.schedule.maxWeeks}, ratePerWeek ${s.schedule.ratePerWeek};`);
    const m = L.MATERIALS_SETTINGS;
    expect(DIGEST).toContain(`Stated in the fixture: pass mark ${m.passMark}; delivery schedule minWeeks ${m.schedule.minWeeks}, maxWeeks ${m.schedule.maxWeeks}, ratePerWeek ${m.schedule.ratePerWeek}; life cycle ${m.lifeCycle.years} years at a discountRate of ${m.lifeCycle.discountRate};`);
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
    expect(total).toBeGreaterThan(80);
    console.log(`[procurement lab] ${total} numeric leaves over ${Object.keys(READERS).length} readers, every one printed in the digest`);
  }, 60000);

  it('NEGATIVE CONTROL: a number the digest does not print is reported as unprinted', () => {
    const f = L.wellServicesReader().ranking[0].combinedScore;
    expect(printed(0.1234567)).toBe(false);
    expect(printed(f + 1e-4)).toBe(false);
    expect(printed(f)).toBe(true);
  });

  it('pins named figures to the exact digest rows that print them', () => {
    const w = L.wellServicesReader();
    w.ranking.forEach((r, i) => expect(DIGEST).toContain(`| ${i + 1} | ${r.id} | `));
    w.ranking.forEach((r) => expect(DIGEST).toContain(`| ${f6(r.technicalScore)} | ${f6(r.commercialScore)} | ${f6(r.combinedScore)} |`));
    w.commercial.forEach((b) => expect(DIGEST).toContain(`| ${f6(b.scheduleAdjustment)} | ${f6(b.evaluatedCost)} |`));
    expect(DIGEST).toContain(`Award (engine): ${w.award}.`);
    expect(DIGEST).toContain(`Lowest evaluated cost (engine): ${w.lowestEvaluatedCost}.`);
    const m = L.materialsReader();
    m.commercial.forEach((b) => expect(DIGEST).toContain(`| ${f6(b.lifeCycleCost)} | ${f6(b.evaluatedCost)} |`));
    expect(DIGEST).toContain(`| lead (engine) | ${f6(m.points.lead)} percentage points | ${f6(m.relative.lead)} percent of the runner-up |`);
    expect(DIGEST).toContain(`| selected (engine) | ${m.points.award} | ${m.relative.award} |`);
    const c = L.contractsReader();
    expect(DIGEST).toContain(`| day rate | ${f6(c.dayRate.plannedPayment)} | ${f6(c.dayRate.mean)} | ${f6(c.dayRate.p90)} | ${f6(c.dayRate.p50)} | ${f6(c.dayRate.p10)} |`);
    expect(DIGEST).toContain(`THE DEFINITION, from lib/conventions/percentile.js, verbatim: ${c.definition}`);
    const s = L.shouldCostReader();
    expect(DIGEST).toContain(`| estimate | ${f6(s.estimate)} |`);
    s.ratios.forEach((r) => expect(DIGEST).toContain(`| ${r.id} | `));
  });

  it('every refusal the lab samples is the engine\'s own message and the digest quotes it verbatim', () => {
    const rs = L.refusalSamples();
    expect(rs.length).toBe(5);
    rs.forEach((r) => {
      expect(typeof r.error).toBe('string');
      expect(DIGEST, `${r.fn} ${r.what}`).toContain(r.error);
      expect(LAB_SOURCE.includes(r.error), `the lab writes the ${r.fn} message as a literal`).toBe(false);
    });
  });
});

describe('THE REBUILD GATE: the committed generator reproduces the committed digest', () => {
  const rebuild = (tz) => execFileSync('node', [path.join(mirrorDir(WAVE), 'sc2_dump.mjs')], {
    encoding: 'utf8',
    maxBuffer: 1e8,
    env: {
      ...process.env,
      TZ: tz,
      LC_ALL: 'C',
      SC2_WAVE_DIR: mirrorDir(WAVE),
      SC2_ENGINES: ENGINES,
      SC2_REPO: ROOT,
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
    console.log(`[procurement lab] the committed sc2_dump.mjs rebuilt ${a.split('\n').length} lines byte for byte in two time zones`);
  }, 240000);
});

describe('THE ENGINE GATE: the interactive routes are the engine, unchanged', () => {
  it('each route returns what the engine returns, refusals included', () => {
    const lines = [{ id: 'a', quantity: 2, unitRate: 10, quotedAmount: 25 }];
    const crit = [{ id: 'c', weight: 100, maxScore: 4 }];
    const bids = [{ id: 'X', technicalPercent: 80, evaluatedCost: 1000, receivedAt: '2027-01-01T00:00:00Z' }, { id: 'Y', technicalPercent: 60, evaluatedCost: 900, receivedAt: '2027-01-01T00:00:00Z' }];
    const cases = [
      [L.bandOf, T.weightingBand, { risk: 'high', estimatedCostUsd: 5e6, technicalWeight: 0.7 }],
      [L.bandOf, T.weightingBand, { risk: 'medium', estimatedCostUsd: 5e6 }],
      [L.arithmeticOf, T.correctArithmetic, { lines }],
      [L.technicalOf, T.technicalEvaluation, { criteria: crit, bids: [{ id: 'X', scores: { c: 3 } }], passMark: 70 }],
      [L.technicalOf, T.technicalEvaluation, { criteria: crit, bids: [{ id: 'X', scores: { c: 3 } }] }],
      [L.evaluatedOf, T.evaluatedCosts, { bids: [{ id: 'X', receivedAt: '2027-01-01T00:00:00Z', lines }] }],
      [L.rankOf, T.rankTender, { bids, technicalWeight: 0.5, priceMethod: 'linear', technicalMethod: 'relative' }],
      [L.rankOf, T.rankTender, { bids, technicalWeight: 0.5, priceMethod: 'mean-deviation', technicalMethod: 'relative' }],
      [L.contentOf, T.nigerianContent, { items: [{ id: 'v', scheduleLine: 'valves' }], bids: [{ id: 'X', items: { v: { measure: 'number', nigerian: 6, total: 10 } } }] }],
      [L.preferenceOf, T.contentPreference, { ncLeadBasis: 'points', bids: [{ id: 'X', evaluatedCost: 1000, ncPct: 60, receivedAt: '2027-01-01T00:00:00Z' }, { id: 'Y', evaluatedCost: 1005, ncPct: 70, receivedAt: '2027-01-01T00:00:00Z' }] }],
      [L.contractsOf, T.contractTypes, { duration: { min: 8, mode: 10, max: 15 }, dailyCost: 40000, lumpSum: { price: 500000 }, dayRate: { rate: 45000, mobilisationFee: 0 }, reimbursable: { feeFraction: 0.1 }, iterations: 100, seed: 5 }],
      [L.shouldCostOf, T.shouldCost, { program: [{ id: 'f', kind: 'flat', durationHr: 48 }], items: [{ id: 's', basis: 'per-day', rate: 1000, category: 'intangible' }], band: { low: 0.8, high: 1.25 }, bids: [{ id: 'X', evaluatedCost: 2100 }] }],
      [L.albOf, T.abnormallyLow, { estimate: 1000, bids: [{ id: 'X', evaluatedCost: 790 }] }],
      [L.tenderOf, T.evaluateTender, { ...JSON.parse(JSON.stringify(L.WS_TENDER)) }],
    ];
    cases.forEach(([lab, eng, args]) => expect(lab(JSON.parse(JSON.stringify(args)))).toEqual(eng(JSON.parse(JSON.stringify(args)))));
  });
  it('a blank is a question, a zero is a statement, and what a learner pastes parses or says why it does not', () => {
    expect(L.parseNumber('')).toBeUndefined();
    expect(L.parseNumber('0')).toBe(0);
    expect(Number.isNaN(L.parseNumber('x'))).toBe(true);
    expect(L.parseJson('{"a": 1}').value).toEqual({ a: 1 });
    expect(L.parseJson('{a: 1}').error).toBeTruthy();
    expect(L.parseJson('').error).toBeTruthy();
    expect(JSON.parse(L.pretty(L.WS_TENDER))).toEqual(JSON.parse(JSON.stringify(L.WS_TENDER)));
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
    ...leaves(L.DATASET).map(([at, x]) => [`DATASET${at}`, x]),
  ];
  it('the answer key is eighteen fields with absolute tolerances', () => {
    expect(FIELDS).toHaveLength(18);
    FIELDS.forEach(([, , , tol]) => expect(tol).toBeGreaterThan(0));
  });
  it('sweeps every number the lab and its dataset export and finds none, over a surface large enough to mean something', () => {
    const values = all();
    expect(values.length).toBeGreaterThan(300);
    expect(sweep(values)).toEqual([]);
    console.log(`[procurement lab] ${values.length} lab and dataset numbers x 18 graded answers x 5 shiftings: 0 within ten tolerances`);
  }, 60000);
  it('NEGATIVE CONTROL: a planted graded answer is caught and named', () => {
    const planted = [...all(), ['planted', FIELDS[7][2] + FIELDS[7][3]]];
    const hits = sweep(planted);
    expect(hits.length).toBe(1);
    expect(hits[0]).toContain(FIELDS[7][1]);
  }, 60000);
  it('the lab holds no tolerance and names no capstone', () => {
    expect(LAB_SOURCE).not.toMatch(/gradedTolerance|fields\.json/);
    expect(LAB_SOURCE).not.toMatch(/\b(?:onitsha|umuahia|okigwe)\b|\b(?:ON|UM|OK)[1-6]\b/i);
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
