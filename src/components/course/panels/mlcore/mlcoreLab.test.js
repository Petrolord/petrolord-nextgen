// Every value the D2 teaching lab exposes to a panel, a lesson or the page is
// pinned here against the teaching digest (tools/course-waves/mlcore/
// digest.txt), which is nothing but the machine learning engine's return
// values on the Ekene teaching wells and the vendored golden.
//
// THE GATES IN THIS FILE:
//   THE DATASET GATE   the lab's ekeneWells.json is deep-equal to what the
//                      committed generator d2_fields.mjs writes, run in a child
//                      process against THIS repository's vendored lib/stats
//                      mulberry32, so the lab and the digest generator run the
//                      same data.
//   THE DIGEST GATE    EVERY numeric leaf every teaching reader returns is
//                      printed in the digest (six decimals, or whole numbers as
//                      written), and named figures are pinned to the digest row
//                      that prints them.
//   THE REBUILD GATE   the committed d2_dump.mjs, run in a child process
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
import * as ML from '@petrolord/engines/engines/dataai/ml.js';
import * as L from './mlcoreLab.js';
import { waveInput, mirrorDir } from '../../../../../tools/course-waves/waveInputs.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const WAVE = 'mlcore';
const DIGEST = fs.readFileSync(waveInput(WAVE, 'digest.txt'), 'utf8');
const FIELDS = JSON.parse(fs.readFileSync(waveInput(WAVE, 'fields.json'), 'utf8'));
const LAB_SOURCE = fs.readFileSync(path.join(HERE, 'mlcoreLab.js'), 'utf8');
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
  splitsReader: L.splitsReader,
  scalingReader: L.scalingReader,
  olsReader: L.olsReader,
  residualsReader: L.residualsReader,
  ridgeReader: L.ridgeReader,
  kfoldReader: L.kfoldReader,
  leakageReader: L.leakageReader,
  payReader: L.payReader,
  diagnoseReader: L.diagnoseReader,
  scalingLeakReader: L.scalingLeakReader,
};

describe('THE DATASET GATE: the lab runs the digest generator\'s own dataset', () => {
  it('ekeneWells.json is deep-equal to what the committed d2_fields.mjs generates on this repository\'s mulberry32', () => {
    const out = execFileSync('node', [path.join(mirrorDir(WAVE), 'd2_fields.mjs'), '--json'], {
      encoding: 'utf8', maxBuffer: 1e8, env: { ...process.env, D2_ENGINES: ENGINES },
    });
    const generated = JSON.parse(out);
    expect(Object.keys(generated).sort()).toEqual(Object.keys(L.DATASET).sort());
    expect(L.DATASET).toEqual(generated);
    expect(fs.readFileSync(path.join(HERE, 'ekeneWells.json'), 'utf8')).toBe(out);
    expect(L.DATASET.rows).toHaveLength(300);
    expect(L.DATASET.wells).toHaveLength(10);
    console.log(`[mlcore lab] ${L.DATASET.wells.length} wells, ${L.DATASET.rows.length} rows, byte-identical to the committed generator's output`);
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
    console.log(`[mlcore lab] ${total} numeric leaves over ${Object.keys(READERS).length} readers, every one printed in the digest`);
  });

  it('NEGATIVE CONTROL: a number the digest does not print is reported as unprinted', () => {
    const rmse = L.olsReader().test.rmse;
    expect(printed(0.1234567)).toBe(false);
    expect(printed(rmse + 1e-4)).toBe(false);
    expect(printed(rmse)).toBe(true);
  });

  it('pins named figures to the exact digest rows that print them', () => {
    const o = L.olsReader();
    o.names.forEach((nm, j) => expect(DIGEST).toContain(`| ${nm} | ${o.coefficients[j].toFixed(6)} |`));
    expect(DIGEST).toContain(`| test wells, about the test mean (default) | 90 | ${o.test.rmse.toFixed(6)} | ${o.test.mae.toFixed(6)} | ${o.test.r2.toFixed(6)} |`);
    const s = L.splitsReader();
    expect(DIGEST).toContain(`| \`randomRowSplit\` | ${s.randomRow.test} | ${s.randomRow.train} | 9 | ${s.randomRow.shared} |`);
    expect(DIGEST).toContain(`The shuffled order is ${s.group.order.join(', ')}, which is the \`order\` the engine returns.`);
    const sc = L.scalingReader();
    const gr = sc.features[0];
    expect(DIGEST).toContain(`| GR | ${gr.centreTrain.toFixed(6)} | ${gr.centreAll.toFixed(6)} | ${gr.scaleTrain.toFixed(6)} |`);
    expect(gr.noSonicAbove1).toBeGreaterThan(0);
    const rd = L.ridgeReader();
    rd.forEach((p) => expect(DIGEST).toContain(`| ${p.lambda} | ${p.edf.toFixed(6)} | ${p.trainR2.toFixed(6)} | ${p.testRmse.toFixed(6)} |`));
    const lk = L.leakageReader();
    expect(lk.filter((x) => x.attributes.optimism > 0)).toHaveLength(12);
    expect(lk.find((x) => x.seed === 5).logs.optimism).toBeLessThan(0);
    lk.forEach((x) => expect(DIGEST).toContain(`| ${x.seed} | ${x.logs.randomRow.toFixed(6)} | ${x.logs.group.toFixed(6)} | ${x.logs.optimism.toFixed(6)} |`));
    const p = L.payReader();
    expect(DIGEST).toContain(`| AUC, trapezoid rule over the points | ${p.auc.toFixed(6)} |`);
    expect(DIGEST).toContain(`| log loss, natural log | ${p.logLoss.toFixed(6)} |`);
    const d = L.diagnoseReader();
    expect(d.importance[d.importance.length - 1].feature).toBe('CALI');
    expect(DIGEST).toContain(`| all | 30 | ${d.missingLog.rmse.toFixed(6)} | ${d.missingLog.mae.toFixed(6)} |`);
    expect(DIGEST).toContain(`reads a scaled condition number of ${d.rehearsal.attributeScaledCondition.toFixed(6)}`);
    expect(DIGEST).toContain(`returns the NPHI coefficient ${d.rehearsal.nphiAfterThreeUpdates.toFixed(6)} log odds per v/v`);
    expect(DIGEST).toContain(`is predicted at ${d.rehearsal.firstRowPrediction.toFixed(6)} us/ft`);
    const sl = L.scalingLeakReader();
    expect(DIGEST).toContain(`| the training wells only | ${sl.clean.rtCentre.toFixed(6)} | ${sl.clean.rtScale.toFixed(6)} | ${sl.clean.rtCoefficient.toFixed(6)} | ${sl.clean.logLoss.toFixed(6)} |`);
    expect(DIGEST).toContain(`| all ten wells | ${sl.leaked.rtCentre.toFixed(6)} | ${sl.leaked.rtScale.toFixed(6)} | ${sl.leaked.rtCoefficient.toFixed(6)} | ${sl.leaked.logLoss.toFixed(6)} |`);
  });

  it('every refusal the lab samples is the engine\'s own message and the digest quotes it verbatim', () => {
    const rs = L.refusalSamples();
    expect(rs.length).toBe(4);
    rs.forEach((r) => {
      expect(typeof r.error).toBe('string');
      expect(DIGEST, `${r.fn} ${r.what}`).toContain(r.error);
      expect(LAB_SOURCE.includes(r.error), `the lab writes the ${r.fn} message as a literal`).toBe(false);
    });
  });
});

describe('THE REBUILD GATE: the committed generator reproduces the committed digest', () => {
  const rebuild = (tz) => execFileSync('node', [path.join(mirrorDir(WAVE), 'd2_dump.mjs')], {
    encoding: 'utf8',
    maxBuffer: 1e8,
    env: {
      ...process.env,
      TZ: tz,
      LC_ALL: 'C',
      D2_WAVE_DIR: mirrorDir(WAVE),
      D2_ENGINES: ENGINES,
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
    console.log(`[mlcore lab] the committed d2_dump.mjs rebuilt ${a.split('\n').length} lines byte for byte in two time zones`);
  }, 180000);
});

describe('THE ENGINE GATE: the interactive routes are the engine, unchanged', () => {
  it('each route returns what the engine returns, refusals included', () => {
    const X = [[1, 2], [2, 1], [3, 5], [4, 3], [5, 6], [6, 4]];
    const y = [3, 4, 8, 8, 11, 11];
    const g = ['A', 'A', 'B', 'B', 'C', 'C'];
    const cases = [
      [L.standardScalerOf, ML.fitStandardScaler, { X, trainIndices: [0, 1, 2, 3] }],
      [L.standardScalerOf, ML.fitStandardScaler, { X: [[1], [1]] }],
      [L.minMaxScalerOf, ML.fitMinMaxScaler, { X }],
      [L.groupSplitOf, ML.groupSplit, { groups: g, testFraction: 0.3, seed: 2 }],
      [L.groupSplitOf, ML.groupSplit, { groups: ['A', 'A'], testFraction: 0.3, seed: 2 }],
      [L.groupKFoldOf, ML.groupKFold, { groups: g, k: 3, seed: 1 }],
      [L.randomRowSplitOf, ML.randomRowSplit, { groups: g, testFraction: 0.5, seed: 3 }],
      [L.olsOf, ML.ols, { X, y }],
      [L.olsOf, ML.ols, { X: [[1], [2]], y: [1, 2] }],
      [L.ridgeOf, ML.ridge, { X, y, lambda: 1 }],
      [L.logisticOf, ML.logistic, { X: [[1], [2], [3], [4]], y: [0, 1, 0, 1] }],
      [L.logisticOf, ML.logistic, { X: [[1], [2], [3], [4]], y: [0, 0, 1, 1] }],
      [L.regressionMetricsOf, ML.regressionMetrics, { yTrue: [1, 2, 3], yPred: [1, 2, 4] }],
      [L.confusionOf, ML.confusionMatrix, { yTrue: [0, 1, 1], yPred: [0, 1, 0] }],
      [L.reportOf, ML.classificationReport, { yTrue: [0, 1, 1], yPred: [0, 0, 0] }],
      [L.rocOf, ML.rocCurve, { yTrue: [0, 1, 0, 1], scores: [0.1, 0.4, 0.4, 0.8] }],
      [L.logLossOf, ML.logLoss, { yTrue: [0, 1], probabilities: [0.2, 0.9] }],
      [L.leakageOf, ML.leakageDemo, { X, y, groups: g, model: { kind: 'ols' }, testFraction: 0.3, seed: 1 }],
    ];
    cases.forEach(([lab, eng, args]) => expect(lab(args)).toEqual(eng(args)));
    const m = ML.ols({ X, y });
    expect(L.predictOf({ model: m, X })).toEqual(ML.predict({ model: m, X }));
    expect(L.importanceOf({ model: m, X, y, seed: 4 })).toEqual(ML.permutationImportance({ model: m, X, y, seed: 4 }));
  });
  it('a blank is a question, a zero is a statement, and a table parses or says why it does not', () => {
    expect(L.parseNumber('')).toBeUndefined();
    expect(L.parseNumber('0')).toBe(0);
    expect(Number.isNaN(L.parseNumber('x'))).toBe(true);
    expect(L.parseSeries('1, 2 3;4').values).toEqual([1, 2, 3, 4]);
    expect(L.parseSeries('1, null, -, 5').values).toEqual([1, null, null, 5]);
    expect(L.parseSeries('').error).toBeTruthy();
    const t = L.parseTable('well, GR, DT\nEKENE-1, 40, 90\nEKENE-2, 60, null');
    expect(t.columns).toEqual(['well', 'GR', 'DT']);
    expect(t.rows).toEqual([{ well: 'EKENE-1', GR: 40, DT: 90 }, { well: 'EKENE-2', GR: 60, DT: null }]);
    expect(L.parseTable('well, GR\nEKENE-1, 40, 5').error).toContain('line 2');
    expect(L.parseTable('well, GR\nEKENE-1, x').error).toContain('x');
    expect(L.parseTable('').error).toBeTruthy();
    const back = L.parseTable(L.sonicTableText());
    expect(back.rows).toHaveLength(270);
    const tr = L.parseTable(L.sonicTrainTableText());
    expect(tr.rows).toHaveLength(180);
    expect(new Set(tr.rows.map((r) => r.well)).has('EKENE-4')).toBe(false);
    const cond = L.olsOf({ X: L.matrixOf(tr.rows, ['GR', 'RHOB', 'NPHI']), y: tr.rows.map((r) => r.DT) });
    expect(DIGEST).toContain(`| the three logs | ${cond.conditionNumber.toFixed(6)} | ${cond.scaledConditionNumber.toFixed(6)} |`);
    const pt = L.parseTable(L.payTrainTableText());
    expect(pt.rows).toHaveLength(210);
    const lg = L.logisticOf({ X: L.matrixOf(pt.rows, ['RHOB', 'NPHI', 'RT']), y: pt.rows.map((r) => r.PAY), names: ['RHOB', 'NPHI', 'RT'] });
    expect(lg.iterations).toBe(L.diagnoseReader().convergence.iterations);
    expect(lg.coefficients[3]).toBe(L.diagnoseReader().convergence.rtConverged);
    const sc = L.scalingLeakCase({ rows: L.parseTable(L.payTableText()).rows, features: ['RHOB', 'NPHI', 'RT'], target: 'PAY', l2: 1, testFraction: 0.3, seed: 5 });
    expect(sc.clean.logLoss).toBe(L.scalingLeakReader().clean.logLoss);
    expect(sc.leaked.logLoss).toBe(L.scalingLeakReader().leaked.logLoss);
  });
  it('the composite helpers are engine calls in order: fit and score, cross-validate, predict a new well', () => {
    const t = L.parseTable(L.sonicTableText());
    const fs1 = L.fitAndScore({ rows: t.rows, features: ['GR', 'RHOB', 'NPHI'], target: 'DT', testFraction: 0.3, seed: 5 });
    expect(fs1.test.rmse).toBe(L.olsReader().test.rmse);
    const cv = L.crossValidate({ rows: t.rows, features: ['GR', 'RHOB', 'NPHI'], target: 'DT', k: 3, seed: 5, kind: 'ridge', lambda: 10 });
    const row = L.kfoldReader().rows.find((r) => r.features === 'logs' && r.lambda === 10);
    expect(cv.folds.map((f) => f.score)).toEqual(row.folds);
    expect(cv.mean).toBe(row.mean);
    const n = L.parseTable(L.noSonicTableText());
    const pw = L.predictNewWell({ trainRows: t.rows, newRows: n.rows, features: ['GR', 'RHOB', 'NPHI'], target: 'DT', lambda: 10 });
    expect(Math.min(...pw.values)).toBe(L.diagnoseReader().missingLog.lowest);
    expect(pw.outside[0].above).toBe(L.scalingReader().features[0].noSonicAbove1);
    const bad = L.fitAndScore({ rows: L.parseTable(L.noSonicTableText().replace('well, GR, RHOB, NPHI', 'well, GR, RHOB, DT')).rows, features: ['GR', 'RHOB'], target: 'DT', nTestGroups: 1, seed: 1 });
    expect(bad.refusal.field).toBe('groups');
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
    expect(values.length).toBeGreaterThan(2500);
    expect(sweep(values)).toEqual([]);
    console.log(`[mlcore lab] ${values.length} lab and dataset numbers x 18 graded answers x 5 shiftings: 0 within ten tolerances`);
  });
  it('NEGATIVE CONTROL: a planted graded answer is caught and named', () => {
    const planted = [...all(), ['planted', FIELDS[7][2] + FIELDS[7][3]]];
    const hits = sweep(planted);
    expect(hits.length).toBe(1);
    expect(hits[0]).toContain(FIELDS[7][1]);
  });
  it('the lab holds no tolerance and names no capstone field', () => {
    expect(LAB_SOURCE).not.toMatch(/gradedTolerance|fields\.json/);
    expect(LAB_SOURCE).not.toMatch(/akpara|oboria|isuama/i);
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
