// Every value the D3 teaching lab exposes to a panel, a lesson or the page is
// pinned here against the teaching digest (tools/course-waves/facies/
// digest.txt), which is nothing but the clustering engine's return values on
// the Ekene facies wells and the vendored golden.
//
// THE GATES IN THIS FILE:
//   THE DATASET GATE   the lab's ekeneFacies.json is byte-identical to what the
//                      committed generator d3_fields.mjs writes, run in a child
//                      process against THIS repository's vendored lib/stats
//                      mulberry32, so the lab and the digest generator run the
//                      same data.
//   THE DIGEST GATE    EVERY numeric leaf every teaching reader returns is
//                      printed in the digest (six decimals, or whole numbers as
//                      written), and named figures are pinned to the digest row
//                      that prints them.
//   THE REBUILD GATE   the committed d3_dump.mjs, run in a child process
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
import * as CL from '@petrolord/engines/engines/dataai/cluster.js';
import * as ML from '@petrolord/engines/engines/dataai/ml.js';
import * as L from './faciesLab.js';
import { waveInput, mirrorDir } from '../../../../../tools/course-waves/waveInputs.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const WAVE = 'facies';
const DIGEST = fs.readFileSync(waveInput(WAVE, 'digest.txt'), 'utf8');
const FIELDS = JSON.parse(fs.readFileSync(waveInput(WAVE, 'fields.json'), 'utf8'));
const LAB_SOURCE = fs.readFileSync(path.join(HERE, 'faciesLab.js'), 'utf8');
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
  scalingReader: L.scalingReader,
  distanceReader: L.distanceReader,
  pcaReader: L.pcaReader,
  kmeansReader: L.kmeansReader,
  covarianceReader: L.covarianceReader,
  elbowReader: L.elbowReader,
  silhouetteReader: L.silhouetteReader,
  agglomerativeReader: L.agglomerativeReader,
  matchReader: L.matchReader,
  ariReader: L.ariReader,
  knnReader: L.knnReader,
  cartReader: L.cartReader,
  tieReader: L.tieReader,
  uncoredReader: L.uncoredReader,
};

describe('THE DATASET GATE: the lab runs the digest generator\'s own dataset', () => {
  it('ekeneFacies.json is byte-identical to what the committed d3_fields.mjs generates on this repository\'s mulberry32', () => {
    const out = execFileSync('node', [path.join(mirrorDir(WAVE), 'd3_fields.mjs'), '--json'], {
      encoding: 'utf8', maxBuffer: 1e8, env: { ...process.env, D3_ENGINES: ENGINES },
    });
    const generated = JSON.parse(out);
    expect(L.DATASET).toEqual(generated);
    expect(fs.readFileSync(path.join(HERE, 'ekeneFacies.json'), 'utf8')).toBe(out);
    expect(L.DATASET.rows).toHaveLength(240);
    expect(L.DATASET.wells).toHaveLength(8);
    expect(L.DATASET.rows.filter((r) => r.FACIES === null)).toHaveLength(60);
    console.log(`[facies lab] ${L.DATASET.wells.length} wells, ${L.DATASET.rows.length} rows, byte-identical to the committed generator's output`);
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
    console.log(`[facies lab] ${total} numeric leaves over ${Object.keys(READERS).length} readers, every one printed in the digest`);
  }, 60000);

  it('NEGATIVE CONTROL: a number the digest does not print is reported as unprinted', () => {
    const inertia = L.kmeansReader().teaching.inertia;
    expect(printed(0.1234567)).toBe(false);
    expect(printed(inertia + 1e-4)).toBe(false);
    expect(printed(inertia)).toBe(true);
  });

  it('pins named figures to the exact digest rows that print them', () => {
    const f6 = (x) => x.toFixed(6);
    L.scalingReader().forEach((s) => expect(DIGEST).toContain(`| ${s.log} | ${f6(s.centre)} | ${f6(s.scale)} | ${f6(s.sampleScale)} | ${f6(s.min)} | ${f6(s.max)} | ${f6(s.range)} |`));
    const d = L.distanceReader();
    expect(DIGEST).toContain(`| raw logs | ${d.raw.same} | ${d.raw.other} |`);
    expect(DIGEST).toContain(`| standardised logs | ${d.standard.same} | ${d.standard.other} |`);
    const p = L.pcaReader();
    p.eigenvalues.forEach((v, k) => expect(DIGEST).toContain(`| PC${k + 1} | ${f6(v)} | ${f6(p.ratio[k])} | ${f6(p.cumulative[k])} |`));
    const k = L.kmeansReader();
    k.trace.forEach((t) => expect(DIGEST).toContain(`| ${t.pass} | ${f6(t.inertia)} | ${t.changed} |`));
    k.bySeed.forEach((s) => expect(DIGEST).toContain(`| ${s.seed} | ${f6(s.one)} | ${f6(s.ten)} |`));
    k.teaching.centresOriginal.forEach((c, i) => expect(DIGEST).toContain(`| ${i} | ${k.teaching.sizes[i]} | ${c.map(f6).join(' | ')} |`));
    L.elbowReader().forEach((r) => expect(DIGEST).toContain(`| ${r.k} | ${f6(r.inertia)} |`));
    const s = L.silhouetteReader();
    s.clusters.perCluster.forEach((c) => expect(DIGEST).toContain(`| k-means clusters | cluster ${c.label} | ${c.size} | ${f6(c.mean)} |`));
    const m = L.matchReader();
    expect(DIGEST).toContain(`Accuracy ${f6(m.accuracy)} (derived check: ${m.matchedRows} / 180); macro F1 ${f6(m.macroF1)}.`);
    const a = L.ariReader();
    expect(DIGEST).toContain(`| k-means, seed 3 | ${f6(a.kmeans)} |`);
    expect(DIGEST).toContain(`| complete, cut at 4 | ${f6(a.complete)} |`);
    const kn = L.knnReader();
    kn.byK.forEach((r) => expect(DIGEST).toContain(`| ${r.k} | ${f6(r.accuracy)} | 0 |`));
    const c = L.cartReader();
    c.printed.split('\n').forEach((line) => expect(DIGEST).toContain(`    ${line}`));
    c.byDepth.forEach((r) => expect(DIGEST).toContain(`| ${r.maxDepth} | ${r.nodes} | ${r.leaves} | ${f6(r.trainingAccuracy)} | ${f6(r.heldOut)} |`));
    const t = L.tieReader();
    expect(t[0].feature).toBe('NPHI');
    expect(t[1].feature).toBe('PEF');
    expect(t[0].decrease).toBe(t[1].decrease);
    const u = L.uncoredReader();
    expect(DIGEST).toContain(`maps ${u.secondAbove} of the 30 EKENE-8 rows above 1 on GR, the highest to ${f6(u.secondHighest)}`);
    expect(DIGEST).toContain(`The two methods give the same facies on ${u.first.agree} of 30 rows of EKENE-7 and ${u.second.agree} of 30 rows of EKENE-8.`);
  });

  it('every refusal the lab samples is the engine\'s own message and the digest quotes it verbatim', () => {
    const rs = L.refusalSamples();
    expect(rs.length).toBe(5);
    // A constant log is refused naming the rows the scaler was fitted on:
    // the rows passed when clustering, the training rows for kNN.
    expect(rs[0].error).toMatch(/^X\.CALI has zero variance on the 30 rows passed \(every value is 8\.5\)/);
    expect(rs[1].fn).toBe('knnClassify');
    expect(rs[1].error).toMatch(/^X\.CALI has zero variance on the 30 training rows \(every value is 8\.5\)/);
    rs.forEach((r) => {
      expect(typeof r.error).toBe('string');
      expect(DIGEST, `${r.fn} ${r.what}`).toContain(r.error);
      expect(LAB_SOURCE.includes(r.error), `the lab writes the ${r.fn} message as a literal`).toBe(false);
    });
  });
});

describe('THE REBUILD GATE: the committed generator reproduces the committed digest', () => {
  const rebuild = (tz) => execFileSync('node', [path.join(mirrorDir(WAVE), 'd3_dump.mjs')], {
    encoding: 'utf8',
    maxBuffer: 1e8,
    env: {
      ...process.env,
      TZ: tz,
      LC_ALL: 'C',
      D3_WAVE_DIR: mirrorDir(WAVE),
      D3_ENGINES: ENGINES,
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
    console.log(`[facies lab] the committed d3_dump.mjs rebuilt ${a.split('\n').length} lines byte for byte in two time zones`);
  }, 180000);
});

describe('THE ENGINE GATE: the interactive routes are the engine, unchanged', () => {
  it('each route returns what the engine returns, refusals included', () => {
    const X = [[1, 2], [2, 1], [3, 5], [4, 3], [5, 6], [6, 4]];
    const y = ['a', 'a', 'b', 'b', 'c', 'c'];
    const km = CL.kmeans({ X, k: 2, seed: 1 });
    const pc = CL.pca({ X });
    const ag = CL.agglomerative({ X, k: 2 });
    const tr = CL.cartFit({ X, y });
    const cases = [
      [L.pcaOf, CL.pca, { X }],
      [L.pcaOf, CL.pca, { X: [[1, 2]] }],
      [L.pcaTransformOf, CL.pcaTransform, { model: pc, X }],
      [L.kmeansOf, CL.kmeans, { X, k: 2, seed: 1 }],
      [L.kmeansOf, CL.kmeans, { X, k: 2 }],
      [L.assignOf, CL.assignClusters, { model: km, X }],
      [L.silhouetteOf, CL.silhouette, { X, labels: km.labels }],
      [L.elbowOf, CL.elbow, { X, kMax: 3, seed: 1 }],
      [L.agglomerativeOf, CL.agglomerative, { X, linkage: 'complete', k: 3 }],
      [L.cutTreeOf, CL.cutTree, { linkageMatrix: ag.linkageMatrix, k: 3 }],
      [L.knnOf, CL.knnClassify, { X, y, Xnew: [[2, 2]], k: 3 }],
      [L.cartFitOf, CL.cartFit, { X, y, maxDepth: 1 }],
      [L.cartPredictOf, CL.cartPredict, { model: tr, X }],
      [L.ariOf, CL.adjustedRandIndex, { a: y, b: km.labels }],
      [L.matchOf, CL.matchClusters, { yTrue: y, clusters: km.labels }],
      [L.matchOf, CL.matchClusters, { yTrue: ['a', 'a'], clusters: [0, 1] }],
      [L.standardScalerOf, ML.fitStandardScaler, { X }],
      [L.minMaxScalerOf, ML.fitMinMaxScaler, { X: [[1], [1]] }],
      [L.reportOf, ML.classificationReport, { yTrue: y, yPred: ['a', 'b', 'b', 'b', 'c', 'a'] }],
    ];
    cases.forEach(([lab, eng, args]) => expect(lab(args)).toEqual(eng(args)));
    const mm = ML.fitMinMaxScaler({ X });
    expect(L.applyScalerOf({ scaler: mm, X })).toEqual(ML.applyScaler({ scaler: mm, X }));
  });
  it('a blank is a question, a zero is a statement, and a table parses or says why it does not', () => {
    expect(L.parseNumber('')).toBeUndefined();
    expect(L.parseNumber('0')).toBe(0);
    expect(Number.isNaN(L.parseNumber('x'))).toBe(true);
    expect(L.parseLabels('0, 1 1;2').values).toEqual([0, 1, 1, 2]);
    expect(L.parseLabels('shale, sandstone').values).toEqual(['shale', 'sandstone']);
    expect(L.parseLabels('').error).toBeTruthy();
    const t = L.parseTable('well, GR, FACIES\nEKENE-1, 40, shale\nEKENE-2, null, -');
    expect(t.columns).toEqual(['well', 'GR', 'FACIES']);
    expect(t.rows).toEqual([{ well: 'EKENE-1', GR: 40, FACIES: 'shale' }, { well: 'EKENE-2', GR: null, FACIES: null }]);
    expect(L.parseTable('well, GR\nEKENE-1, 40, 5').error).toContain('line 2');
    expect(L.parseTable('well, GR\nEKENE-1, x').error).toContain('x');
    expect(L.parseTable('').error).toBeTruthy();
    const back = L.parseTable(L.coredTableText());
    expect(back.rows).toHaveLength(180);
    const km = L.kmeansOf({ X: L.matrixOf(back.rows, L.TEACHING.logs), k: 4, seed: 3 });
    expect(km.inertia).toBe(L.kmeansReader().teaching.inertia);
    expect(L.parseTable(L.uncoredTableText()).rows).toHaveLength(30);
    expect(L.coreFaciesText().split(', ')).toHaveLength(180);
  });
  it('the composite helpers are engine calls in order: predict a held-out well, and check a new well against the range', () => {
    const rows = L.parseTable(L.coredTableText()).rows;
    const kn = L.predictHeldOut({ rows, features: L.TEACHING.logs, heldWells: ['EKENE-6'], k: 5 });
    expect(kn.report.accuracy).toBe(L.knnReader().accuracy);
    expect(kn.trainRows).toBe(150);
    const tr = L.predictHeldOut({ rows, features: ['GR', 'RHOB', 'NPHI', 'PEF', 'CALI'], heldWells: ['EKENE-6'], method: 'tree', maxDepth: 4 });
    expect(tr.report.accuracy).toBe(L.cartReader().byDepth[4].heldOut);
    const newRows = L.parseTable(L.uncoredTableText('EKENE-8')).rows;
    const rc = L.rangeCheck({ trainRows: rows, newRows, features: L.TEACHING.logs });
    expect(rc.features[0].above).toBe(L.uncoredReader().secondAbove);
    expect(rc.features[0].highest).toBe(L.uncoredReader().secondHighest);
    const un = L.predictHeldOut({ rows: [...rows, ...newRows], features: L.TEACHING.logs, heldWells: ['EKENE-8'] });
    expect(un.report).toBeNull();
    const bad = L.predictHeldOut({ rows: rows.map((r, i) => (i === 3 ? { ...r, FACIES: null } : r)), features: L.TEACHING.logs, heldWells: ['EKENE-6'] });
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
    expect(values.length).toBeGreaterThan(1500);
    expect(sweep(values)).toEqual([]);
    console.log(`[facies lab] ${values.length} lab and dataset numbers x 18 graded answers x 5 shiftings: 0 within ten tolerances`);
  }, 60000);
  it('NEGATIVE CONTROL: a planted graded answer is caught and named', () => {
    const planted = [...all(), ['planted', FIELDS[7][2] + FIELDS[7][3]]];
    const hits = sweep(planted);
    expect(hits.length).toBe(1);
    expect(hits[0]).toContain(FIELDS[7][1]);
  }, 60000);
  it('the lab holds no tolerance and names no capstone field', () => {
    expect(LAB_SOURCE).not.toMatch(/gradedTolerance|fields\.json/);
    expect(LAB_SOURCE).not.toMatch(/ihiala|nkwelle|ogbunike/i);
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
