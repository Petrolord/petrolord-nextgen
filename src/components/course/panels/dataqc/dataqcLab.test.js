// Every value the D1 teaching lab exposes to a panel, a lesson or the page is
// pinned here against the teaching digest (tools/course-waves/dataqc/
// digest.txt), which is nothing but the data quality engine's return values on
// the Ekene teaching dataset and the vendored golden.
//
// THE GATES IN THIS FILE:
//   THE DATASET GATE   the lab's ekeneDataset.json is deep-equal to what the
//                      committed generator d1_fields.mjs writes, run in a child
//                      process against THIS repository's vendored lib/stats
//                      mulberry32, so the lab and the digest generator run the
//                      same data.
//   THE DIGEST GATE    EVERY numeric leaf every teaching reader returns is
//                      printed in the digest (six decimals, or whole numbers as
//                      written), and named figures are pinned to the digest row
//                      that prints them.
//   THE REBUILD GATE   the committed d1_dump.mjs, run in a child process
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
import * as Q from '@petrolord/engines/engines/dataai/quality.js';
import * as L from './dataqcLab.js';
import { waveInput, mirrorDir } from '../../../../../tools/course-waves/waveInputs.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const WAVE = 'dataqc';
const DIGEST = fs.readFileSync(waveInput(WAVE, 'digest.txt'), 'utf8');
const FIELDS = JSON.parse(fs.readFileSync(waveInput(WAVE, 'fields.json'), 'utf8'));
const LAB_SOURCE = fs.readFileSync(path.join(HERE, 'dataqcLab.js'), 'utf8');
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
  logChecks: L.logChecks,
  productionChecks: L.productionChecks,
  wellNames: L.wellNames,
  outliersOnSmallSets: L.outliersOnSmallSets,
  gammaRayOutliers: L.gammaRayOutliers,
  densityNeutron: L.densityNeutron,
  pressureCharts: L.pressureCharts,
  ekeneScorecard: L.ekeneScorecard,
};

describe('THE DATASET GATE: the lab runs the digest generator\'s own dataset', () => {
  it('ekeneDataset.json is deep-equal to what the committed d1_fields.mjs generates on this repository\'s mulberry32', () => {
    const out = execFileSync('node', [path.join(mirrorDir(WAVE), 'd1_fields.mjs'), '--json'], {
      encoding: 'utf8', maxBuffer: 1e8, env: { ...process.env, D1_ENGINES: ENGINES },
    });
    const generated = JSON.parse(out);
    expect(Object.keys(generated).sort()).toEqual(Object.keys(L.DATASET).sort());
    expect(L.DATASET).toEqual(generated);
    expect(fs.readFileSync(path.join(HERE, 'ekeneDataset.json'), 'utf8')).toBe(out);
    console.log(`[dataqc lab] ${Object.keys(generated).length} dataset streams, byte-identical to the committed generator's output`);
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
    expect(total).toBeGreaterThan(120);
    console.log(`[dataqc lab] ${total} numeric leaves over ${Object.keys(READERS).length} readers, every one printed in the digest`);
  });

  it('NEGATIVE CONTROL: a number the digest does not print is reported as unprinted', () => {
    expect(printed(0.1234567)).toBe(false);
    expect(printed(L.logChecks().grCoverage.coverage + 1e-4)).toBe(false);
    expect(printed(L.logChecks().grCoverage.coverage)).toBe(true);
  });

  it('pins named figures to the exact digest rows that print them', () => {
    const lg = L.logChecks();
    const rh = lg.channels.find((c) => c.name === 'RHOB');
    expect(DIGEST).toContain(`| RHOB | 240 | ${rh.missing} | 228 | 0.050000 | ${rh.completeness.toFixed(6)} | 80, 12 | 12 |`);
    expect(lg.grCoverage.coverage.toFixed(6)).toBe('0.991304');
    expect(DIGEST).toContain(`| GR | 0.500000 | ${lg.grCoverage.coverage.toFixed(6)} | ${lg.grCoverage.coveredLength.toFixed(6)} | 8474.500000 to 8475.500000 |`);
    expect(DIGEST).toContain(`| EKENE-7 DT, us/ft, entries | 1 | ${lg.frozenSonic[0].start} | ${lg.frozenSonic[0].end} | ${lg.frozenSonic[0].length} | ${lg.frozenSonic[0].value.toFixed(6)} |`);
    const pr = L.productionChecks();
    expect(pr.cumulative).toHaveLength(1);
    expect(DIGEST).toContain(`| ${pr.cumulative[0].day} | ${pr.cumulative[0].comparedWithDay} | ${pr.cumulative[0].drop.toFixed(6)} |`);
    expect(DIGEST).toContain(`| 1e-6, the default | ${pr.waterCut.failedAtDefault} |`);
    expect(DIGEST).toContain(`| 1e-4, one unit in the fourth decimal | ${pr.waterCut.failedAtReporting} |`);
    const o = L.outliersOnSmallSets();
    expect(DIGEST).toContain(`At n = 10 the engine reports \`maxPossibleAbsZ\` ${o.gauge.maxPossibleAbsZ.toFixed(6)}`);
    expect(DIGEST).toContain(`| EKENE-3 gauge | ${o.gauge.median.toFixed(6)} | ${o.gauge.mad.toFixed(6)} | ${o.gauge.modifiedZ.toFixed(6)} | 7 |`);
    expect(o.grubbs[0].reject).toBe(true);
    expect(o.grubbs[1].reject).toBe(false);
    const d = L.densityNeutron();
    expect(d.flagged).toEqual([60]);
    expect(DIGEST).toContain(`| cutoff, chi-square 0.975 on 2 degrees of freedom | ${d.cutoff.toFixed(6)} |`);
    const c = L.pressureCharts();
    expect(DIGEST).toContain(`| centre, psig | ${c.phaseOne.centre.toFixed(6)} |`);
    expect(DIGEST).toContain(`The first upper signal is day ${c.cusum.firstHighDay} and the first lower signal is day ${c.cusum.firstLowDay}.`);
    const s = L.ekeneScorecard();
    expect(DIGEST).toContain(`| equal weights | ${s.equalTotal.toFixed(6)} | ${s.weakest} |`);
    expect(DIGEST).toContain(`| stated weights 3, 2, 2, 1, 1 | ${s.weightedTotal.toFixed(6)} | ${s.weakest} |`);
    const names = L.wellNames();
    expect([names.exact, names.normalisedDuplicates, names.near]).toEqual([1, 8, 1]);
  });

  it('every refusal the lab samples is the engine\'s own message and the digest quotes it verbatim', () => {
    const rs = L.refusalSamples();
    expect(rs.length).toBe(7);
    rs.forEach((r) => {
      expect(typeof r.error).toBe('string');
      expect(DIGEST, `${r.fn} ${r.what}`).toContain(r.error);
      expect(LAB_SOURCE.includes(r.error), `the lab writes the ${r.fn} message as a literal`).toBe(false);
    });
  });
});

describe('THE REBUILD GATE: the committed generator reproduces the committed digest', () => {
  const rebuild = (tz) => execFileSync('node', [path.join(mirrorDir(WAVE), 'd1_dump.mjs')], {
    encoding: 'utf8',
    maxBuffer: 1e8,
    env: {
      ...process.env,
      TZ: tz,
      LC_ALL: 'C',
      D1_WAVE_DIR: mirrorDir(WAVE),
      D1_ENGINES: ENGINES,
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
    console.log(`[dataqc lab] the committed d1_dump.mjs rebuilt ${a.split('\n').length} lines byte for byte in two time zones`);
  }, 120000);
});

describe('THE ENGINE GATE: the interactive routes are the engine, unchanged', () => {
  it('each route returns what the engine returns, refusals included', () => {
    const cases = [
      [L.completenessOf, Q.completeness, { values: [1, null, 3, null, null] }],
      [L.completenessOf, Q.completeness, { values: [1, Infinity] }],
      [L.coverageOf, Q.coverage, { index: [0, 0.5, 1, 2], values: [1, 2, null, 4], start: 0, end: 2, maxStep: 0.5 }],
      [L.rangeOf, Q.rangeCheck, { values: [0.2, 1.4], channel: 'fraction', unit: 'v/v' }],
      [L.rangeOf, Q.rangeCheck, { values: [1], channel: 'sonic', unit: 'us/s' }],
      [L.indexOf, Q.indexCheck, { index: [1, 2, 2, 4, 3] }],
      [L.ratesOf, Q.rateCheck, { rates: [10, -1, 5], hoursOn: [24, 24, 0] }],
      [L.cumulativeOf, Q.cumulativeCheck, { cumulative: [10, 20, null, 15] }],
      [L.waterCutOf, Q.waterCutCheck, { oil: [80, 90], water: [20, 10] }],
      [L.phaseSumOf, Q.phaseSumCheck, { parts: { oil: [80], water: [20] }, total: [103] }],
      [L.frozenOf, Q.frozenRuns, { values: [1, 1, 1, 1, 1, 2] }],
      [L.namesOf, Q.duplicateIdentifiers, { ids: ['W-1', 'W 1', 'WL-1'] }],
      [L.zOf, Q.zScores, { values: [1, 2, 3, 4, 50] }],
      [L.modifiedZOf, Q.modifiedZScores, { values: [1, 2, 3, 4, 50] }],
      [L.fencesOf, Q.iqrFences, { values: [1, 2, 3, 4, 50], method: 'R6' }],
      [L.hampelOf, Q.hampel, { values: [1, 2, 30, 4, 5], halfWindow: 2 }],
      [L.grubbsOf, Q.grubbsTest, { values: [1, 2, 3, 4, 50] }],
      [L.mahalanobisOf, Q.mahalanobis, { rows: [[1, 2], [2, 3], [3, 5], [4, 4], [5, 7]] }],
      [L.individualsOf, Q.individualsChart, { values: [5, 6, 5, 7, 6] }],
      [L.ewmaOf, Q.ewmaChart, { values: [5, 6, 5, 7, 6], lambda: 0.2, target: 5.5, sigma: 1 }],
      [L.cusumOf, Q.cusumChart, { values: [5, 6, 5, 7, 6], target: 5.5, k: 0.5, h: 4, units: 'sigma', sigma: 1 }],
      [L.cusumOf, Q.cusumChart, { values: [5, 6], target: 5.5, k: 0.5, h: 4 }],
      [L.scorecardOf, Q.scorecard, { dimensions: [{ name: 'a', checked: 10, failed: 1 }, { name: 'b', score: 0.5 }] }],
    ];
    cases.forEach(([lab, eng, args]) => expect(lab(args)).toEqual(eng(args)));
    expect(L.quantileOf([1, 2, 3, 4], 0.25, 'R8')).toEqual(Q.sampleQuantile([1, 2, 3, 4], 0.25, 'R8'));
  });
  it('a blank is a question, a zero is a statement, and null or a dash is a missing value', () => {
    expect(L.parseNumber('')).toBeUndefined();
    expect(L.parseNumber('0')).toBe(0);
    expect(Number.isNaN(L.parseNumber('x'))).toBe(true);
    expect(L.parseSeries('1, 2 3;4').values).toEqual([1, 2, 3, 4]);
    expect(L.parseSeries('1, null, -, NaN, 5').values).toEqual([1, null, null, null, 5]);
    expect(L.parseSeries('').error).toBeTruthy();
    expect(L.parseSeries('1, x').error).toContain('x');
    expect(L.parseNames('EKENE-1\nEKENE 1, EKNE-1')).toEqual(['EKENE-1', 'EKENE 1', 'EKNE-1']);
    expect(L.pairRows([1, 2], [3]).error).toBeTruthy();
    expect(L.pairRows([1, 2], [3, 4]).rows).toEqual([[1, 3], [2, 4]]);
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
    expect(values.length).toBeGreaterThan(1500);
    expect(sweep(values)).toEqual([]);
    console.log(`[dataqc lab] ${values.length} lab and dataset numbers x 18 graded answers x 5 shiftings: 0 within ten tolerances`);
  });
  it('NEGATIVE CONTROL: a planted graded answer is caught and named', () => {
    const planted = [...all(), ['planted', FIELDS[7][2] + FIELDS[7][3]]];
    const hits = sweep(planted);
    expect(hits.length).toBe(1);
    expect(hits[0]).toContain(FIELDS[7][1]);
  });
  it('the lab holds no tolerance and names no capstone field', () => {
    expect(LAB_SOURCE).not.toMatch(/gradedTolerance|fields\.json/);
    expect(LAB_SOURCE).not.toMatch(/odudu|ikoro|amasiri/i);
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
