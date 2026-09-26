// Every value the EC8 teaching lab exposes to a panel, a lesson or the page is
// pinned here against the teaching digest (tools/course-waves/gsa/digest.txt),
// which is nothing but the engine's return values on the Ekene agreements, the
// golden inputs and the stated inputs the digest prints.
//
// THE GATES IN THIS FILE:
//   THE DATASET GATE   the lab reads the vendored fixtures and the INPUTS of
//                      the vendored golden file (packages/engines/test-data/
//                      economics/goldens/gascontract_cases.json) and never its
//                      expected figures.
//   THE DIGEST GATE    EVERY numeric leaf every teaching reader returns is
//                      printed in the digest, and named figures are pinned to
//                      the digest rows that print them.
//   THE REBUILD GATE   the committed gsa_dump.mjs, run in a child process
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
import * as G from '@petrolord/engines/engines/economics/gasContract.js';
import * as L from './gsaLab.js';
import { waveInput, mirrorDir } from '../../../../../tools/course-waves/waveInputs.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const WAVE = 'gsa';
const DIGEST = fs.readFileSync(waveInput(WAVE, 'digest.txt'), 'utf8');
const FIELDS = JSON.parse(fs.readFileSync(waveInput(WAVE, 'fields.json'), 'utf8'));
const LAB_SOURCE = fs.readFileSync(path.join(HERE, 'gsaLab.js'), 'utf8');
const ENGINES = path.join(ROOT, 'packages/engines');
const GOLDEN = path.join(ENGINES, 'test-data/economics/goldens/gascontract_cases.json');
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
  januaryReader: L.januaryReader,
  powerLedgerReader: L.powerLedgerReader,
  powerYearReader: L.powerYearReader,
  exportPriceReader: L.exportPriceReader,
  sCurveReader: L.sCurveReader,
  exportCashReader: L.exportCashReader,
};

describe('THE DATASET GATE: the lab reads the fixtures and the golden INPUTS only', () => {
  it('every golden case is its inputs and nothing else', () => {
    const gold = JSON.parse(fs.readFileSync(GOLDEN, 'utf8'));
    expect(Object.keys(L.GOLDEN_ARGS)).toEqual(gold.cases.map((c) => c.id));
    gold.cases.forEach((c) => {
      expect(L.GOLDEN_ARGS[c.id]).toEqual({ fn: c.fn, args: c.args });
      expect(Object.keys(L.GOLDEN_ARGS[c.id])).not.toContain('expected');
    });
    console.log(`[gsa lab] ${gold.cases.length} golden cases, inputs only, read from the vendored golden file`);
  });
  it('the two fixtures are the vendored files, byte for byte as JSON, and both say SYNTHETIC', () => {
    ['domestic-power', 'export-feed'].forEach((f, i) => {
      const disk = JSON.parse(fs.readFileSync(path.join(ENGINES, `test-data/economics/ekene-gsa/${f}.json`), 'utf8'));
      const lab = i === 0 ? L.FIXTURES.power : L.FIXTURES.export;
      expect(lab).toEqual(disk);
      expect(lab.synthetic.startsWith('SYNTHETIC')).toBe(true);
    });
  });
  it('every golden case a panel starts from is one the digest names', () => {
    Object.entries(L.GOLDEN_ARGS).filter(([, g]) => Object.values(L.STARTS).includes(g.args)).forEach(([id]) => expect(DIGEST).toContain(id));
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
    console.log(`[gsa lab] ${total} numeric leaves over ${Object.keys(READERS).length} readers, every one printed in the digest`);
  });

  it('NEGATIVE CONTROL: a number the digest does not print is reported as unprinted', () => {
    const t = L.exportCashReader().npvSellerRevenue;
    expect(printed(0.1234567)).toBe(false);
    expect(printed(t + 1e-4)).toBe(false);
    expect(printed(t)).toBe(true);
  });

  it('pins named figures to the exact digest rows that print them', () => {
    L.exportPriceReader().forEach((a) => expect(DIGEST).toContain(`| ${a.year} | 12 | ${f6(a.averagePrice)} | ${f6(a.lastMonthPrice)} |`));
    const j = L.januaryReader().annual;
    expect(DIGEST).toContain(`| buyer shortfall | ${f6(j.buyerShortfall)} |`);
    expect(DIGEST).toContain(`| seller shortfall | ${f6(j.sellerShortfall)} |`);
    const x = L.exportCashReader();
    expect(DIGEST).toContain(`NPV of the seller revenue ${grouped(f6(x.npvSellerRevenue))}`);
  });

  it('every refusal a route returns is the engine\'s own message, the digest quotes it verbatim, and the lab never writes it', () => {
    const gold = JSON.parse(fs.readFileSync(GOLDEN, 'utf8'));
    const refusals = gold.cases.filter((c) => c.expected && c.expected.error === true);
    expect(refusals.length).toBe(84);
    const routes = {
      toEnergy: L.energyOf, contractQuantities: L.quantitiesOf, dailyBalance: L.dailyOf, takeOrPay: L.takeOrPayOf, priceSeries: L.priceOf,
      energyParitySlope: L.parityOf, domesticPrice: L.domesticOf, domesticGasObligation: L.dgdoOf, gsaCashFlows: L.cashFlowsOf,
    };
    refusals.forEach((c) => {
      if (!c.args || typeof c.args !== 'object' || Array.isArray(c.args)) return;
      const r = routes[c.fn](c.args);
      expect(r.error, c.id).toBe(c.expected.message);
      expect(DIGEST, c.id).toContain(r.error);
      expect(LAB_SOURCE.includes(r.error), `the lab writes the message of ${c.id} as a literal`).toBe(false);
    });
  });
});

describe('THE REBUILD GATE: the committed generator reproduces the committed digest', () => {
  const rebuild = (tz) => execFileSync('node', [path.join(mirrorDir(WAVE), 'gsa_dump.mjs')], {
    encoding: 'utf8',
    maxBuffer: 1e8,
    env: {
      ...process.env, TZ: tz, LC_ALL: 'C', EC8_WAVE_DIR: mirrorDir(WAVE), EC8_ENGINES: ENGINES, EC8_REPO: ROOT,
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
    console.log(`[gsa lab] the committed gsa_dump.mjs rebuilt ${a.split('\n').length} lines byte for byte in two time zones`);
  }, 240000);
});

describe('THE ENGINE GATE: the interactive routes are the engine, unchanged', () => {
  it('each route returns what the engine returns, refusals included', () => {
    const cases = [
      [L.energyOf, G.toEnergy, L.STARTS.energy], [L.quantitiesOf, G.contractQuantities, L.STARTS.quantities],
      [L.dailyOf, G.dailyBalance, L.STARTS.daily], [L.takeOrPayOf, G.takeOrPay, L.STARTS.ledger],
      [L.priceOf, G.priceSeries, L.STARTS.price], [L.parityOf, G.energyParitySlope, L.STARTS.parity],
      [L.domesticOf, G.domesticPrice, L.STARTS.domestic], [L.dgdoOf, G.domesticGasObligation, L.STARTS.dgdo],
      [L.cashFlowsOf, G.gsaCashFlows, L.STARTS.cash],
      [L.takeOrPayOf, G.takeOrPay, { ...L.STARTS.ledger, makeUp: { periodYears: 3, order: 'lifo', endOfTerm: 'forfeit' } }],
    ];
    cases.forEach(([lab, eng, a]) => expect(lab(a)).toEqual(eng(clone(a))));
  });
  it('the priced ledger copies each year\'s prices from the engine\'s annual rows by the stated basis', () => {
    const ex = L.FIXTURES.export;
    const c = {
      price: { months: ex.index, formula: ex.price.formula, from: ex.price.from, to: ex.price.to, averagingMonths: ex.price.averagingMonths, lagMonths: ex.price.lagMonths, resetMonths: ex.price.resetMonths, rounding: ex.price.rounding },
      pricing: { contractPrice: 'annual-average', topPrice: 'last-month', makeUpPrice: 0.5 },
      contract: { years: ex.years, topPct: ex.topPct, makeUp: ex.makeUp, carryForward: ex.carryForward },
    };
    const p = L.pricedContract(c);
    const ps = G.priceSeries(clone(c.price));
    p.value.contract.years.forEach((y) => {
      const a = ps.annual.find((x) => x.year === y.year);
      expect(y.contractPrice).toBe(a.averagePrice);
      expect(y.topPrice).toBe(a.lastMonthPrice);
      expect(y.makeUpPrice).toBe(0.5);
    });
    expect(L.ledgerOf(c).years).toEqual(G.takeOrPay(clone(p.value.contract)).years);
    expect(L.pricedContract({ ...c, pricing: { ...c.pricing, topPrice: 'median' } }).error).toBeTruthy();
    expect(L.pricedContract({ ...c, contract: { ...c.contract, years: [{ ...ex.years[0], year: 2050 }] } }).error).toBeTruthy();
  });
  it('a pasted case file is read at the key a view needs, and one call\'s inputs as they stand', () => {
    expect(L.pick({ energy: { a: 1 }, year: 2 }, 'energy')).toEqual({ a: 1 });
    expect(L.pick({ dcq: 1 }, 'energy')).toEqual({ dcq: 1 });
    expect(L.parseJson('{"a": 1}').value).toEqual({ a: 1 });
    expect(L.parseJson('{a: 1}').error).toBeTruthy();
    expect(L.parseJson('').error).toBeTruthy();
  });
});

describe('THE PASTE GATE: a whole case file pasted into any view runs that view\'s block', () => {
  const CASES = ['ozubu', 'ifeyi', 'nwaka'].map((n) => JSON.parse(fs.readFileSync(path.join(ROOT, `src/content/capstone-cases/gsa/${n}_case.json`), 'utf8')));
  const VIEWS = [
    ['energy', L.viewEnergy, L.energyOf], ['quantities', L.viewQuantities, L.quantitiesOf], ['fortnight', L.viewDaily, L.dailyOf],
    ['year', L.viewYear, L.takeOrPayOf], ['price', L.viewPrice, L.priceOf], ['dgdo', L.viewDgdo, L.dgdoOf], ['price', L.viewCurve, L.priceOf],
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
    expect(n).toBe(9);
  });
  it('the ledger and the money views read a whole priced case by its named keys', () => {
    const [, ifeyi, nwaka] = CASES;
    const block = { price: ifeyi.price, pricing: ifeyi.pricing, contract: ifeyi.contract };
    expect(L.viewLedger(ifeyi).years).toEqual(L.viewLedger(block).years);
    expect(L.viewLedger(ifeyi).error).toBeUndefined();
    const nb = { price: nwaka.price, pricing: nwaka.pricing, contract: nwaka.contract, royalty: nwaka.royalty, discountRate: nwaka.discountRate, baseYear: nwaka.baseYear };
    expect(L.viewCash(nwaka)).toEqual(L.viewCash(nb));
    expect(L.viewCash(nwaka).error).toBeUndefined();
  });
  it('NEGATIVE CONTROL: the raw route without pick refuses the whole case by its first unknown key', () => {
    expect(L.priceOf(CASES[1]).error).toMatch(/^dataset is not an accepted key/);
    expect(L.dgdoOf(CASES[1]).error).toMatch(/^dataset is not an accepted key/);
  });
  it('the one-year view starts from one contract year, and the two power plant years alone are offered', () => {
    expect(L.STARTS.year.years).toHaveLength(1);
    expect(L.STARTS.power2027.years.map((y) => y.year)).toEqual([2027]);
    expect(L.STARTS.power2032.years.map((y) => y.year)).toEqual([2032]);
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
    ...leaves(L.FIXTURES).map(([at, x]) => [`FIXTURES${at}`, x]),
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
    console.log(`[gsa lab] ${values.length} lab and dataset numbers x 18 graded answers x 5 shiftings: 0 within ten tolerances`);
  }, 120000);
  it('NEGATIVE CONTROL: a planted graded answer is caught and named', () => {
    const planted = [...all(), ['planted', FIELDS[7][2] + FIELDS[7][3]]];
    const hits = sweep(planted);
    expect(hits.length).toBe(1);
    expect(hits[0]).toContain(FIELDS[7][1]);
  }, 120000);
  it('the lab holds no tolerance and names no capstone', () => {
    expect(LAB_SOURCE).not.toMatch(/gradedTolerance|fields\.json/);
    expect(LAB_SOURCE).not.toMatch(/\b(?:ozubu|ifeyi|nwaka)\b/i);
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
