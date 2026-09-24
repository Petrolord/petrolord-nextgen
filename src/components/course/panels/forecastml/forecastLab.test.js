// Every value the D4 teaching lab exposes to a panel, a lesson or the page is
// pinned here against the teaching digest (tools/course-waves/forecastml/
// digest.txt), which is nothing but the forecasting engine's return values on
// the Ekene production wells and the vendored golden.
//
// THE GATES IN THIS FILE:
//   THE DATASET GATE   the lab's ekeneProduction.json is byte-identical to what
//                      the committed generator d4_fields.mjs writes, run in a
//                      child process against THIS repository's vendored
//                      lib/stats mulberry32 and engines/dca/arps.js, so the lab
//                      and the digest generator run the same data.
//   THE DIGEST GATE    EVERY numeric leaf every teaching reader returns is
//                      printed in the digest (six decimals, or whole numbers as
//                      written), and named figures are pinned to the digest row
//                      that prints them.
//   THE REBUILD GATE   the committed d4_dump.mjs, run in a child process
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
import * as FC from '@petrolord/engines/engines/dataai/forecast.js';
import * as L from './forecastLab.js';
import { waveInput, mirrorDir } from '../../../../../tools/course-waves/waveInputs.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const WAVE = 'forecastml';
const DIGEST = fs.readFileSync(waveInput(WAVE, 'digest.txt'), 'utf8');
const FIELDS = JSON.parse(fs.readFileSync(waveInput(WAVE, 'fields.json'), 'utf8'));
const LAB_SOURCE = fs.readFileSync(path.join(HERE, 'forecastLab.js'), 'utf8');
const ENGINES = path.join(ROOT, 'packages/engines');

/** Every numeric leaf of a value, with its path. Booleans and strings are not numbers. */
const leaves = (v, at = '') => {
  if (typeof v === 'number') return [[at, v]];
  if (Array.isArray(v)) return v.flatMap((x, i) => leaves(x, `${at}[${i}]`));
  if (v && typeof v === 'object') return Object.entries(v).flatMap(([k, x]) => leaves(x, `${at}.${k}`));
  return [];
};
/** Is this number printed in the digest, at the precision the digest declares? */
const printed = (x) => {
  const cands = Number.isInteger(x) ? [String(x)] : [x.toFixed(6)];
  return cands.some((c) => new RegExp(`(?<![\\d.])${c.replace('.', '\\.')}(?![\\d])`).test(DIGEST));
};

const READERS = {
  seriesReader: L.seriesReader,
  sesReader: L.sesReader,
  holtReader: L.holtReader,
  dampedReader: L.dampedReader,
  fitReader: L.fitReader,
  holdOutReader: L.holdOutReader,
  backtestReader: L.backtestReader,
  compareReader: L.compareReader,
  intervalsReader: L.intervalsReader,
  arpsReader: L.arpsReader,
};

describe('THE DATASET GATE: the lab runs the digest generator\'s own dataset', () => {
  it('ekeneProduction.json is byte-identical to what the committed d4_fields.mjs generates on this repository\'s mulberry32', () => {
    const out = execFileSync('node', [path.join(mirrorDir(WAVE), 'd4_fields.mjs'), '--json'], {
      encoding: 'utf8', maxBuffer: 1e8, env: { ...process.env, D4_ENGINES: ENGINES },
    });
    const generated = JSON.parse(out);
    expect(L.DATASET).toEqual(generated);
    expect(fs.readFileSync(path.join(HERE, 'ekeneProduction.json'), 'utf8')).toBe(out);
    expect(L.DATASET.wells).toHaveLength(6);
    expect(L.DATASET.wells.filter((w) => w.rate.length === 48)).toHaveLength(5);
    expect(L.DATASET.wells.find((w) => w.well === 'EKENE-P2').rate.filter((v) => v === 0)).toHaveLength(3);
    console.log(`[forecastml lab] ${L.DATASET.wells.length} wells, ${L.DATASET.wells.reduce((n, w) => n + w.rate.length, 0)} monthly rates, byte-identical to the committed generator's output`);
  }, 60000);
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
    expect(total).toBeGreaterThan(250);
    console.log(`[forecastml lab] ${total} numeric leaves over ${Object.keys(READERS).length} readers, every one printed in the digest`);
  }, 60000);

  it('NEGATIVE CONTROL: a number the digest does not print is reported as unprinted', () => {
    const f = L.seriesReader().forecast;
    expect(printed(0.1234567)).toBe(false);
    expect(printed(f + 1e-4)).toBe(false);
    expect(printed(f)).toBe(true);
  });

  it('pins named figures to the exact digest rows that print them', () => {
    const f6 = (x) => (x === null ? 'null' : x.toFixed(6));
    const s = L.seriesReader();
    s.rows.forEach((r) => expect(DIGEST).toContain(`| ${r.t} | ${f6(r.rate)} | ${f6(r.fitted)} | ${f6(r.residual)} | ${f6(r.level)} |`));
    L.sesReader().byAlpha.forEach((r) => expect(DIGEST).toContain(`| ${r.alpha} | ${f6(r.sse)} | ${f6(r.mse)} | ${f6(r.forecast)} |`));
    L.sesReader().fitted.forEach((r) => expect(DIGEST).toContain(`| ${r.well} | ${f6(r.alpha)} |`));
    const h = L.holtReader();
    h.rows.forEach((r) => expect(DIGEST).toContain(`| ${f6(r.fitted)} | ${f6(r.residual)} | ${f6(r.level)} | ${f6(r.trend)} |`));
    expect(DIGEST).toContain(`step ${h.lowTail.lastStepAbove} is ${f6(h.lowTail.before)} and step ${h.lowTail.lastStepAbove + 1} is ${f6(h.lowTail.after)}`);
    const d = L.dampedReader();
    d.steps.forEach((r) => expect(DIGEST).toContain(`| ${r.step} | ${f6(r.forecast)} |`));
    d.fitted.forEach((r) => expect(DIGEST).toContain(`| ${r.well} | ${f6(r.alpha)} | ${f6(r.beta)} | ${f6(r.phi)} |`));
    L.fitReader().forEach((r) => expect(DIGEST).toContain(`| ${f6(r.sse)} | ${r.moves} | ${r.halvings} | ${r.evaluations} | true |`));
    L.holdOutReader().forEach((r) => expect(DIGEST).toContain(`| ${r.method} | ${f6(r.me)} | ${f6(r.mae)} | ${f6(r.rmse)} |`));
    const b = L.backtestReader();
    b.byHorizon.forEach((r) => expect(DIGEST).toContain(`| ${r.step} | 4 | ${f6(r.me)} | ${f6(r.mae)} | ${f6(r.rmse)} | ${f6(r.mase)} |`));
    b.perOrigin.forEach((r) => expect(DIGEST).toContain(`| ${r.origin} | 0 to ${r.origin - 1} | ${f6(r.alpha)} | ${f6(r.beta)} | ${r.errors.map(f6).join(' | ')} | ${f6(r.scale)} |`));
    expect(DIGEST).toContain(`| false | ${f6(b.held.me)} | ${f6(b.held.mae)} | ${f6(b.held.rmse)} | ${f6(b.held.mase)} |`);
    const c = L.compareReader();
    expect(c.pre.ranking[0]).toBe('arps');
    expect(c.post.ranking[0]).not.toBe('arps');
    c.post.rows.forEach((r) => expect(DIGEST).toContain(`| ${r.method} | ${f6(r.mae)} | ${f6(r.rmse)} | ${f6(r.mape)} | ${f6(r.smape)} | ${f6(r.mase)} |`));
    const iv = L.intervalsReader();
    iv.steps.forEach((r) => expect(DIGEST).toContain(`| ${r.step} | ${f6(r.forecast)} | ${f6(r.P90)} | ${f6(r.P50)} | ${f6(r.P10)} |`));
    L.arpsReader().forEach((r) => expect(DIGEST).toContain(`| ${r.well} | ${r.model} | ${f6(r.qi)} | ${f6(r.Di)} | ${f6(r.b)} | ${f6(r.R2)} | ${f6(r.RMSE)} | ${r.used} | ${r.dropped} | ${f6(r.atStepH)} |`));
  });

  it('every refusal the lab samples is the engine\'s own message and the digest quotes it verbatim', () => {
    const rs = L.refusalSamples();
    expect(rs.length).toBe(5);
    expect(rs[0].field).toBe('y[5]');
    rs.forEach((r) => {
      expect(typeof r.error).toBe('string');
      expect(DIGEST, `${r.fn} ${r.what}`).toContain(r.error);
      expect(LAB_SOURCE.includes(r.error), `the lab writes the ${r.fn} message as a literal`).toBe(false);
    });
  });
});

describe('THE REBUILD GATE: the committed generator reproduces the committed digest', () => {
  const rebuild = (tz) => execFileSync('node', [path.join(mirrorDir(WAVE), 'd4_dump.mjs')], {
    encoding: 'utf8',
    maxBuffer: 1e8,
    env: {
      ...process.env,
      TZ: tz,
      LC_ALL: 'C',
      D4_WAVE_DIR: mirrorDir(WAVE),
      D4_ENGINES: ENGINES,
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
    console.log(`[forecastml lab] the committed d4_dump.mjs rebuilt ${a.split('\n').length} lines byte for byte in two time zones`);
  }, 180000);
});

describe('THE ENGINE GATE: the interactive routes are the engine, unchanged', () => {
  it('each route returns what the engine returns, refusals included', () => {
    const y = [100, 96, 91, 88, 84, 81, 77, 75, 72, 70, 67, 66];
    const cases = [
      [L.fitOf, FC.fitSmoothing, { y, method: 'holt', h: 3 }],
      [L.fitOf, FC.fitSmoothing, { y, method: 'damped', phi: 0 }],
      [L.accuracyOf, FC.accuracy, { actual: [5, 4], forecast: [4, 4], insample: y }],
      [L.accuracyOf, FC.accuracy, { actual: [0, 4], forecast: [1, 4] }],
      [L.intervalsOf, FC.forecastIntervals, { y, method: 'ses', h: 3, seed: 1, nSims: 50 }],
      [L.intervalsOf, FC.forecastIntervals, { y, method: 'ses', h: 3 }],
      [L.backtestOf, FC.backtest, { y, method: 'ses', firstOrigin: 6, horizon: 2, step: 2 }],
      [L.backtestOf, FC.backtest, { y, method: 'holt', firstOrigin: 2, horizon: 2 }],
      [L.arpsOf, FC.arpsForecast, { y, h: 3 }],
      [L.arpsOf, FC.arpsForecast, { y: [1, 2, 3, 4] }],
      [L.compareOf, FC.compareWithArps, { y, firstOrigin: 6, horizon: 2, step: 2 }],
      [L.compareOf, FC.compareWithArps, { y, firstOrigin: 6, horizon: 2, rankBy: 'r2' }],
    ];
    cases.forEach(([lab, eng, args]) => expect(lab(args)).toEqual(eng(args)));
  });
  it('a blank is a question, a zero is a statement, and a series parses or says why it does not', () => {
    expect(L.parseNumber('')).toBeUndefined();
    expect(L.parseNumber('0')).toBe(0);
    expect(Number.isNaN(L.parseNumber('x'))).toBe(true);
    expect(L.parseSeries('10, 9 8;7\n6').values).toEqual([10, 9, 8, 7, 6]);
    expect(L.parseSeries('10, null, -').values).toEqual([10, null, null]);
    expect(L.parseSeries('10, x').error).toContain('x');
    expect(L.parseSeries('').error).toBeTruthy();
    const back = L.parseSeries(L.seriesText('EKENE-P1')).values;
    expect(back).toHaveLength(48);
    expect(L.fitOf({ y: back, method: 'ses', alpha: L.TEACHING.alpha, h: 1 }).forecast[0]).toBe(L.seriesReader().forecast);
    expect(L.parseNames('ses, holt damped')).toEqual(['ses', 'holt', 'damped']);
  });
  it('the hold-out helper is engine calls in order, and passes a refusal through', () => {
    const y = L.parseSeries(L.seriesText('EKENE-P1')).values;
    const h = L.holdOut({ y, method: 'holt', train: L.TEACHING.train, h: L.TEACHING.h });
    expect(h.accuracy.mase).toBe(L.holdOutReader().find((r) => r.method === 'holt').mase);
    const bad = L.holdOut({ y: y.map((v, i) => (i === 3 ? null : v)), method: 'holt', train: L.TEACHING.train, h: L.TEACHING.h });
    expect(bad.refusal.field).toBe('y[3]');
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
    expect(values.length).toBeGreaterThan(500);
    expect(sweep(values)).toEqual([]);
    console.log(`[forecastml lab] ${values.length} lab and dataset numbers x 18 graded answers x 5 shiftings: 0 within ten tolerances`);
  }, 60000);
  it('NEGATIVE CONTROL: a planted graded answer is caught and named', () => {
    const planted = [...all(), ['planted', FIELDS[7][2] + FIELDS[7][3]]];
    const hits = sweep(planted);
    expect(hits.length).toBe(1);
    expect(hits[0]).toContain(FIELDS[7][1]);
  }, 60000);
  it('the lab holds no tolerance and names no capstone field', () => {
    expect(LAB_SOURCE).not.toMatch(/gradedTolerance|fields\.json/);
    expect(LAB_SOURCE).not.toMatch(/agulu|nanka|umunze/i);
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
