// Every value the H1 teaching lab exposes to a panel, a lesson or the page is
// pinned here against the teaching digest (tools/course-waves/safetystats/
// digest.txt), which is nothing but the safety statistics engine's return
// values on the teaching streams and the vendored golden.
//
// THE GATES IN THIS FILE:
//   THE STREAM GATE    the lab's teaching streams are deep-equal to the wave's
//                      h1_fields.mjs, read from the committed copy, so the lab
//                      and the digest generator run the same inputs.
//   THE DIGEST GATE    EVERY numeric leaf every teaching reader returns is
//                      printed in the digest at the precision the digest
//                      declares (six decimals, twelve for chi-square counts,
//                      whole numbers as written), and a set of named figures is
//                      pinned to the exact digest row that prints it.
//   THE REBUILD GATE   the committed h1_dump.mjs, run in a child process
//                      against THIS repository's vendored engine and the
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
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as S from '@petrolord/engines/engines/hse/safetyStats.js';
import * as L from './safetystatsLab.js';
import { waveInput, mirrorDir } from '../../../../../tools/course-waves/waveInputs.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const WAVE = 'safetystats';
const DIGEST = fs.readFileSync(waveInput(WAVE, 'digest.txt'), 'utf8');
const FIELDS = JSON.parse(fs.readFileSync(waveInput(WAVE, 'fields.json'), 'utf8'));
const LAB_SOURCE = fs.readFileSync(path.join(HERE, 'safetystatsLab.js'), 'utf8');

/** Every numeric leaf of a value, with its path. Booleans and strings are not numbers. */
const leaves = (v, at = '') => {
  if (typeof v === 'number') return [[at, v]];
  if (Array.isArray(v)) return v.flatMap((x, i) => leaves(x, `${at}[${i}]`));
  if (v && typeof v === 'object') return Object.entries(v).flatMap(([k, x]) => leaves(x, `${at}.${k}`));
  return [];
};
/** Is this number printed in the digest, at a precision the digest declares? */
const printed = (x) => {
  const cands = Number.isInteger(x) ? [String(x)] : [x.toFixed(6), x.toFixed(12)];
  return cands.some((c) => new RegExp(`(?<![\\d.])${c.replace('.', '\\.')}(?![\\d])`).test(DIGEST));
};

const READERS = {
  ratesAndBases: L.ratesAndBases,
  pooling: L.pooling,
  rollingWindows: L.rollingWindows,
  intervalLadder: L.intervalLadder,
  zeroEvents: L.zeroEvents,
  twoRates: L.twoRates,
  egbemaChart: L.egbemaChart,
};

describe('THE STREAM GATE: the lab runs the digest generator\'s own teaching streams', () => {
  it('every stream the lab carries is deep-equal to h1_fields.mjs in the committed wave inputs', async () => {
    const T = await import(pathToFileURL(waveInput(WAVE, 'h1_fields.mjs')).href);
    const names = Object.keys(L.STREAMS);
    expect(names.length).toBeGreaterThanOrEqual(12);
    names.forEach((n) => {
      expect(T[n], `${n} is in the lab and not in h1_fields.mjs`).toBeDefined();
      expect(JSON.parse(JSON.stringify(L.STREAMS[n])), n).toEqual(JSON.parse(JSON.stringify(T[n])));
    });
    console.log(`[safetystats lab] ${names.length} teaching streams deep-equal to the committed h1_fields.mjs`);
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
    console.log(`[safetystats lab] ${total} numeric leaves over ${Object.keys(READERS).length} readers, every one printed in the digest`);
  });

  it('NEGATIVE CONTROL: a number the digest does not print is reported as unprinted', () => {
    expect(printed(0.1234567)).toBe(false);
    expect(printed(L.ratesAndBases().onBases[0].rate + 1e-4)).toBe(false);
    expect(printed(L.ratesAndBases().onBases[0].rate)).toBe(true);
  });

  it('pins named figures to the exact digest rows that print them', () => {
    const r = L.ratesAndBases();
    expect(DIGEST).toContain(`| 200000 | ${r.onBases[0].rate.toFixed(6)} | per 200,000 hours (OSHA/BLS: 100 full-time workers, 40 h x 50 weeks) |`);
    expect(DIGEST).toContain(`| 1000000 | ${r.onBases[1].rate.toFixed(6)} | per 1,000,000 hours (IOGP) |`);
    expect(r.onBases[0].rate.toFixed(6)).toBe('0.776317');
    expect(DIGEST).toContain(`| day crew | 80000 | 1 | ${r.crews[0].rate.toFixed(6)} |`);
    expect(DIGEST).toContain(`| rotation crew | 116480 | 1 | ${r.crews[1].rate.toFixed(6)} |`);
    const p = L.pooling();
    expect(DIGEST).toContain(`| pooled rate, \`rate\` | ${p.rate.toFixed(6)} |`);
    expect(DIGEST).toContain(`| mean of the site rates, \`meanOfPeriodRates\` | ${p.meanOfPeriodRates.toFixed(6)} |`);
    expect(p.eventsWithoutHours.field).toBe('exposureHours[3]');
    expect(DIGEST).toContain(`> ${p.eventsWithoutHours.error}`);
    const w = L.rollingWindows();
    expect(w.windows).toHaveLength(4);
    expect(DIGEST).toContain(`| 1 | 1 to 12 | 13 | 2152250 | ${w.windows[0].rate.toFixed(6)} | ${w.windows[0].meanOfPeriodRates.toFixed(6)} | 1 |`);
    const z = L.zeroEvents();
    expect(DIGEST).toContain(`| 0.950000 | ${z.limits[2].countUpper.toFixed(12)} | ${z.limits[2].upper.toFixed(6)} | 0.000000 |`);
    expect(DIGEST).toContain(`the rule of three gives, derived, ${z.ruleOfThree.toFixed(6)} per 200,000 hours`);
    const t = L.twoRates();
    expect(DIGEST).toContain(`| engine pValue, central: twice the smaller tail, capped at 1 | ${t.utorogu.pValue.toFixed(6)} |`);
    expect(DIGEST).toContain(`| ${t.utorogu.minlikeDerived.toFixed(6)} |`);
    expect(t.utorogu.pValue).toBeGreaterThan(0.05);
    expect(t.utorogu.minlikeDerived).toBeLessThan(0.05);
    expect(DIGEST).toContain(`| pValue, central two-sided | ${t.erha.pValue.toFixed(6)} |`);
    const g = L.egbemaChart();
    expect(g.flagged).toEqual([8]);
    expect(DIGEST).toContain(`| centre line, sum of counts over sum of units | ${g.centre.toFixed(6)} |`);
    expect(DIGEST).toContain(`| revised, month 8 set aside | 11 | ${g.revisedCentre.toFixed(6)} | [] |`);
    expect(DIGEST).toContain(`| all months | 35, 2389010 | 28, 1965920 | ${g.beforeAfterAll.rateRatio.toFixed(6)} |`);
    g.points.forEach((pt) => {
      expect(DIGEST).toContain(`| ${pt.month} | ${pt.count} | ${pt.exposureHours} | ${pt.exposureUnits.toFixed(6)} | ${pt.u.toFixed(6)} | ${pt.lcl.toFixed(6)} | ${pt.ucl.toFixed(6)} | ${pt.lclFloored} | ${pt.signal === null ? 'null' : pt.signal} |`);
    });
    L.intervalLadder().forEach((x) => {
      expect(DIGEST).toContain(`| ${x.count} | ${x.hours} | ${x.rate.toFixed(6)} | ${x.lower.toFixed(6)} | ${x.upper.toFixed(6)} |`);
    });
  });

  it('every refusal the lab samples is the engine\'s own message and the digest quotes it verbatim', () => {
    const rs = L.refusalSamples();
    expect(rs.length).toBe(6);
    rs.forEach((r) => {
      expect(typeof r.error).toBe('string');
      expect(DIGEST, `${r.fn} ${r.what}`).toContain(`| \`${r.field}\` | ${r.error} |`);
      expect(LAB_SOURCE.includes(r.error), `the lab writes the ${r.fn} message as a literal`).toBe(false);
    });
  });
});

describe('THE REBUILD GATE: the committed generator reproduces the committed digest', () => {
  const rebuild = (tz) => execFileSync('node', [path.join(mirrorDir(WAVE), 'h1_dump.mjs')], {
    encoding: 'utf8',
    maxBuffer: 1e8,
    env: {
      ...process.env,
      TZ: tz,
      LC_ALL: 'C',
      H1_WAVE_DIR: mirrorDir(WAVE),
      H1_ENGINES: path.join(ROOT, 'packages/engines'),
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
    console.log(`[safetystats lab] the committed h1_dump.mjs rebuilt ${a.split('\n').length} lines byte for byte in two time zones`);
  }, 60000);
});

describe('THE ENGINE GATE: the interactive routes are the engine, unchanged', () => {
  it('each route returns what the engine returns, refusals included', () => {
    const cases = [
      [L.rateOn, S.incidenceRate, { count: 3, exposureHours: 51234, base: 200000 }],
      [L.rateOn, S.incidenceRate, { count: 3, exposureHours: 51234 }],
      [L.farOf, S.fatalAccidentRate, { fatalities: 2, exposureHours: 7654321 }],
      [L.severityOn, S.severityRate, { daysLost: 17, exposureHours: 51234, base: 1000000 }],
      [L.pseOn, S.pseRate, { tier: 3, pseCount: 1, exposureHours: 51234, base: 200000 }],
      [L.pooled, S.pooledRate, { counts: [1, 2], exposureHours: [5000, 7000], base: 200000 }],
      [L.rolling, S.rollingRate, { counts: [1, 2, 0], exposureHours: [5000, 7000, 6000], base: 200000, windowPeriods: 2 }],
      [L.interval, S.rateConfidenceInterval, { count: 4, exposureHours: 51234, base: 200000, confidence: 0.9 }],
      [L.interval, S.rateConfidenceInterval, { count: 4, exposureHours: 51234, base: 200000, confidence: 90 }],
      [L.compare, S.compareRates, { count1: 4, exposureHours1: 51234, count2: 9, exposureHours2: 81234, confidence: 0.95 }],
      [L.chart, S.uChart, { counts: [1, 4, 2], exposureHours: [5000, 7000, 6000], base: 200000 }],
    ];
    cases.forEach(([lab, eng, args]) => expect(lab(args)).toEqual(eng(args)));
  });
  it('revisedChart and beforeAfter are the engine on the months kept', () => {
    const counts = [3, 1, 9, 2];
    const hours = [60000, 50000, 55000, 65000];
    const rv = L.revisedChart({ counts, exposureHours: hours, base: 200000, setAside: [3] });
    expect(rv.kept).toEqual([1, 2, 4]);
    expect(rv.chart).toEqual(S.uChart({ counts: [3, 1, 2], exposureHours: [60000, 50000, 65000], base: 200000 }));
    const ba = L.beforeAfter({ counts, exposureHours: hours, splitMonth: 3, setAside: [3], confidence: 0.95 });
    expect(ba.before).toEqual({ count: 4, hours: 110000, months: [1, 2] });
    expect(ba.after).toEqual({ count: 2, hours: 65000, months: [4] });
    expect(ba.result).toEqual(S.compareRates({ count1: 2, exposureHours1: 65000, count2: 4, exposureHours2: 110000, confidence: 0.95 }));
  });
  it('a blank is a question and a zero is a statement', () => {
    expect(L.parseNumber('')).toBeUndefined();
    expect(L.parseNumber('0')).toBe(0);
    expect(Number.isNaN(L.parseNumber('x'))).toBe(true);
    expect(L.parseSeries('1, 2 3;4').values).toEqual([1, 2, 3, 4]);
    expect(L.parseSeries('').error).toBeTruthy();
    expect(L.parseSeries('1, x').error).toContain('x');
    expect(L.rateOn({ count: L.parseNumber(''), exposureHours: 1000, base: 200000 }).field).toBe('count');
  });
  it('the derived minlike p-value agrees with scipy\'s binomtest on the digest pair, and is null where the engine refuses', () => {
    // scipy.stats.binomtest(7, 13, 355200/1404100).pvalue, printed in the digest as the derived minlike figure
    const t = L.twoRates();
    expect(t.utorogu.minlikeDerived.toFixed(6)).toBe('0.025879');
    expect(L.minlikePValue({ count1: 0, exposureHours1: 1, count2: 0, exposureHours2: 1 })).toBeNull();
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
  const all = () => Object.entries(READERS).flatMap(([n, fn]) => leaves(fn()).map(([at, x]) => [`${n}${at}`, x]));
  it('the answer key is eighteen fields with absolute tolerances', () => {
    expect(FIELDS).toHaveLength(18);
    FIELDS.forEach(([, , , tol]) => expect(tol).toBeGreaterThan(0));
  });
  it('sweeps every number the lab exports and finds none, over a surface large enough to mean something', () => {
    const values = all();
    expect(values.length).toBeGreaterThan(150);
    expect(sweep(values)).toEqual([]);
    console.log(`[safetystats lab] ${values.length} lab numbers x 18 graded answers x 5 shiftings: 0 within ten tolerances`);
  });
  it('NEGATIVE CONTROL: a planted graded answer is caught and named', () => {
    const planted = [...all(), ['planted', FIELDS[7][2] + FIELDS[7][3]]];
    const hits = sweep(planted);
    expect(hits.length).toBe(1);
    expect(hits[0]).toContain(FIELDS[7][1]);
  });
  it('the lab holds no tolerance and names no capstone workplace', () => {
    expect(LAB_SOURCE).not.toMatch(/gradedTolerance|fields\.json/);
    expect(LAB_SOURCE).not.toMatch(/okrika|bonny|forcados/i);
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
