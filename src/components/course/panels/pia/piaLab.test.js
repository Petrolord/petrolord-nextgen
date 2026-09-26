// Every value the EC7 teaching lab exposes to a panel, a lesson or the page is
// pinned here against the teaching digest (tools/course-waves/pia/digest.txt),
// which is nothing but the engine's return values on the Ekene teaching cases
// and the stated inputs the digest prints.
//
// THE GATES IN THIS FILE:
//   THE DATASET GATE   the lab reads the INPUTS of the vendored golden file
//                      (packages/engines/test-data/economics/goldens/
//                      pia2021_cases.json) and never its expected figures.
//   THE DIGEST GATE    EVERY numeric leaf every teaching reader returns is
//                      printed in the digest (six decimals, or whole numbers as
//                      written), and named figures are pinned to the digest row
//                      that prints them.
//   THE REBUILD GATE   the committed pia_dump.mjs, run in a child process
//                      against this repository's vendored engine and the
//                      committed wave inputs, reproduces the committed digest
//                      byte for byte, under two time zones.
//   THE ENGINE GATE    every interactive route returns exactly what the engine
//                      returns, refusals included (as the engine's own message),
//                      and no refusal message is written as a literal in the lab.
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
import * as E from '@petrolord/engines/engines/economics/cashflow.ts';
import * as L from './piaLab.js';
import { waveInput, mirrorDir } from '../../../../../tools/course-waves/waveInputs.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const WAVE = 'pia';
const DIGEST = fs.readFileSync(waveInput(WAVE, 'digest.txt'), 'utf8');
const FIELDS = JSON.parse(fs.readFileSync(waveInput(WAVE, 'fields.json'), 'utf8'));
const LAB_SOURCE = fs.readFileSync(path.join(HERE, 'piaLab.js'), 'utf8');
const ENGINES = path.join(ROOT, 'packages/engines');
const GOLDEN = path.join(ENGINES, 'test-data/economics/goldens/pia2021_cases.json');

const leaves = (v, at = '') => {
  if (typeof v === 'number') return [[at, v]];
  if (Array.isArray(v)) return v.flatMap((x, i) => leaves(x, `${at}[${i}]`));
  if (v && typeof v === 'object') return Object.entries(v).flatMap(([k, x]) => leaves(x, `${at}.${k}`));
  return [];
};
const printed = (x) => {
  const cands = [x.toFixed(6), ...(Number.isInteger(x) ? [String(x)] : [])];
  return cands.some((c) => new RegExp(`(?<![\\d.])${c.replace('.', '\\.')}(?![\\d])`).test(DIGEST));
};
const f6 = (x) => (x === null ? 'null' : x.toFixed(6));

const READERS = {
  tranchesReader: L.tranchesReader,
  benchmarksReader: L.benchmarksReader,
  alphaReader: L.alphaReader,
  workedExampleReader: L.workedExampleReader,
  cprReader: L.cprReader,
  capCrossingReader: L.capCrossingReader,
  acrossReader: L.acrossReader,
  deepReader: L.deepReader,
  escrowReader: L.escrowReader,
};

describe('THE DATASET GATE: the lab reads the golden INPUTS only', () => {
  it('every case is the golden case\'s cfg and rows, and nothing else', () => {
    const gold = JSON.parse(fs.readFileSync(GOLDEN, 'utf8'));
    expect(L.CASE_NAMES).toEqual(gold.cases.map((c) => c.name));
    gold.cases.forEach((c) => {
      expect(L.DATASET[c.name]).toEqual({ cfg: c.cfg, prodRows: c.prodRows, capexRows: c.capexRows, opexRows: c.opexRows });
      expect(Object.keys(L.DATASET[c.name])).not.toContain('expected');
    });
    console.log(`[pia lab] ${L.CASE_NAMES.length} Ekene teaching cases, inputs only, read from the vendored golden file`);
  });
  it('every case the lab offers is one the digest describes', () => {
    L.CASE_NAMES.forEach((n) => expect(DIGEST).toContain(`| ${n} |`));
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
    expect(total).toBeGreaterThan(150);
    console.log(`[pia lab] ${total} numeric leaves over ${Object.keys(READERS).length} readers, every one printed in the digest`);
  }, 60000);

  it('NEGATIVE CONTROL: a number the digest does not print is reported as unprinted', () => {
    const t = L.alphaReader().take;
    expect(printed(0.1234567)).toBe(false);
    expect(printed(t + 1e-4)).toBe(false);
    expect(printed(t)).toBe(true);
  });

  it('pins named figures to the exact digest rows that print them', () => {
    L.tranchesReader().forEach((r) => expect(DIGEST).toContain(`| ${r.bopd} | ${E.PIA_TERRAINS.map((t) => f6(r.rates[t])).join(' | ')} |`));
    L.benchmarksReader().forEach((b) => expect(DIGEST).toContain(`| ${b.year} | ${f6(b.regulations.low)} | ${f6(b.regulations.mid)} | ${f6(b.regulations.high)} | ${f6(b.act.low)} | ${f6(b.act.mid)} | ${f6(b.act.high)} |`));
    const a = L.alphaReader();
    expect(DIGEST).toContain(`| government take percent (engine) | ${f6(a.take)} | ${f6(a.takeAtHalf)} |`);
    const w = L.workedExampleReader();
    expect(DIGEST).toContain(`| total tax | ${f6(w.totalTax)} |`);
    const c = L.cprReader();
    expect(DIGEST).toContain(`the cost still carried at the end, ${f6(c.forfeited)}, is reported as cpr_forfeited_at_cessation`);
    const x = L.acrossReader();
    expect(DIGEST).toContain(`kpis.fiscal_framework is "${x.framework}" and kpis.nta_first_year is ${x.ntaFirstYear}.`);
    L.deepReader().forEach((d) => expect(DIGEST).toContain(`| ${d.year} | ${d.framework} |`));
  });

  it('every refusal the lab samples is the engine\'s own message and the digest quotes it verbatim', () => {
    const rs = L.refusalSamples();
    expect(rs.length).toBe(5);
    rs.forEach((r) => {
      expect(typeof r.error).toBe('string');
      expect(DIGEST, r.what).toContain(r.error);
      expect(LAB_SOURCE.includes(r.error), `the lab writes the message for ${r.what} as a literal`).toBe(false);
    });
  });
});

describe('THE REBUILD GATE: the committed generator reproduces the committed digest', () => {
  const rebuild = (tz) => execFileSync('node', [path.join(mirrorDir(WAVE), 'pia_dump.mjs')], {
    encoding: 'utf8',
    maxBuffer: 1e8,
    env: {
      ...process.env,
      TZ: tz,
      LC_ALL: 'C',
      EC7_WAVE_DIR: mirrorDir(WAVE),
      EC7_ENGINES: ENGINES,
      EC7_REPO: ROOT,
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
    console.log(`[pia lab] the committed pia_dump.mjs rebuilt ${a.split('\n').length} lines byte for byte in two time zones`);
  }, 240000);
});

describe('THE ENGINE GATE: the interactive routes are the engine, unchanged', () => {
  const same = (lab, eng) => {
    let want;
    try { want = { value: eng() }; } catch (e) { want = { error: e.message }; }
    expect(lab).toEqual(want);
  };
  it('each route returns what the engine returns, refusals included', () => {
    const alpha = L.DATASET.ekene_alpha_shallow_converted_nta;
    same(L.ledgerOf(alpha), () => E.computeCashFlow(JSON.parse(JSON.stringify(alpha))));
    same(L.ledgerOf({ ...alpha, cfg: { ...alpha.cfg, pia_terrain: 'marginal_field' } }), () => E.computeCashFlow({ ...JSON.parse(JSON.stringify(alpha)), cfg: { ...alpha.cfg, pia_terrain: 'marginal_field' } }));
    same(L.oilRateOf('onshore', 7500), () => E.deriveOilRoyaltyRate('onshore', 7500));
    same(L.oilRateOf('onshore', -1), () => E.deriveOilRoyaltyRate('onshore', -1));
    same(L.gasRateOf('onshore', 40), () => E.deriveGasRoyaltyRate('onshore', 40));
    same(L.benchmarksOf(2026, 'act_2020'), () => E.priceRoyaltyBenchmarks(2026, 'act_2020'));
    same(L.priceRateOf(90, 2026, 'shallow_water', 'regulations_2021'), () => E.derivePriceRoyaltyRate(90, 2026, 'shallow_water', 'regulations_2021'));
    same(L.hctRateOf({ terrain: 'onshore', licenseType: 'PML', leaseStatus: 'new', framework: 'nta_2025' }), () => E.deriveHctRate('onshore', 'PML', false, null, 'nta_2025', null, null, 'new', null));
    same(L.allowanceOf({ leaseStatus: 'new', terrain: 'onshore', barrels: 1000000, price: 75, prior: 49500000, framework: 'nta_2025' }),
      () => E.computeProductionAllowance({ pia_lease_status: 'new', pia_terrain: 'onshore' }, 1000000, 75, 49500000, 'nta_2025'));
    expect(L.capitalFractionOf(4, 'pia_only')).toBe(E.capitalAllowanceFraction(4, 'pia_only'));
    expect(L.tetRateOf(2023)).toBe(E.statutoryTetRatePct(2023));
    same(L.frameworkOf('auto', 2026), () => E.fiscalFrameworkForYear({ pia_under_nta_2025_override: 'auto' }, 2026));
  });
  it('a change of terms is compared on the engine\'s own totals', () => {
    const alpha = L.DATASET.ekene_alpha_shallow_converted_nta;
    const r = L.compareOf(alpha, { pia_license_type: 'PPL' });
    const base = E.computeCashFlow(JSON.parse(JSON.stringify(alpha))).kpis;
    expect(r.value.lines.map((l) => l.base)).toEqual(L.TOTAL_KEYS.map((k) => base[k] ?? 0));
    expect(r.value.baseTake).toBe(base.government_take_pct);
    expect(L.compareOf(alpha, { pia_license_type: 'OML' }).error).toBeTruthy();
  });
  it('a blank is a question, a zero is a statement, and what a learner pastes parses or says why it does not', () => {
    expect(L.parseNumber('')).toBeUndefined();
    expect(L.parseNumber('0')).toBe(0);
    expect(Number.isNaN(L.parseNumber('x'))).toBe(true);
    expect(L.parseJson('{"a": 1}').value).toEqual({ a: 1 });
    expect(L.parseJson('{a: 1}').error).toBeTruthy();
    expect(L.parseJson('').error).toBeTruthy();
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
    console.log(`[pia lab] ${values.length} lab and dataset numbers x 18 graded answers x 5 shiftings: 0 within ten tolerances`);
  }, 60000);
  it('NEGATIVE CONTROL: a planted graded answer is caught and named', () => {
    const planted = [...all(), ['planted', FIELDS[7][2] + FIELDS[7][3]]];
    const hits = sweep(planted);
    expect(hits.length).toBe(1);
    expect(hits[0]).toContain(FIELDS[7][1]);
  }, 60000);
  it('the lab holds no tolerance and names no capstone', () => {
    expect(LAB_SOURCE).not.toMatch(/gradedTolerance|fields\.json/);
    expect(LAB_SOURCE).not.toMatch(/\b(?:odozi|nkemdi|alaku)\b/i);
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
