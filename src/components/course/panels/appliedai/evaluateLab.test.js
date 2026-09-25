// Every value the D5 teaching lab exposes to a panel, a lesson or the page is
// pinned here against the teaching digest (tools/course-waves/appliedai/
// digest.txt), which is nothing but the evaluation engine's return values on
// the Ekene document fixtures and the stated inputs the digest prints.
//
// THE GATES IN THIS FILE:
//   THE DATASET GATE   the lab reads the vendored fixture files themselves
//                      (packages/engines/test-data/dataai/ekene-docs), each
//                      deep-equal to the file on disk, and every stated hand
//                      passage the lab carries is printed in the digest.
//   THE DIGEST GATE    EVERY numeric leaf every teaching reader returns is
//                      printed in the digest (six decimals, or whole numbers as
//                      written), and named figures are pinned to the digest row
//                      that prints them.
//   THE REBUILD GATE   the committed d5_dump.mjs, run in a child process
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
import * as EV from '@petrolord/engines/engines/dataai/evaluate.js';
import * as L from './evaluateLab.js';
import { waveInput, mirrorDir } from '../../../../../tools/course-waves/waveInputs.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const WAVE = 'appliedai';
const DIGEST = fs.readFileSync(waveInput(WAVE, 'digest.txt'), 'utf8');
const FIELDS = JSON.parse(fs.readFileSync(waveInput(WAVE, 'fields.json'), 'utf8'));
const LAB_SOURCE = fs.readFileSync(path.join(HERE, 'evaluateLab.js'), 'utf8');
const ENGINES = path.join(ROOT, 'packages/engines');
const FIXDIR = path.join(ENGINES, 'test-data/dataai/ekene-docs');

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
const f6 = (x) => (x === null ? 'null' : x.toFixed(6));

const READERS = {
  tfidfReader: L.tfidfReader,
  bm25Reader: L.bm25Reader,
  atKReader: L.atKReader,
  claimsReader: L.claimsReader,
  rankingScoreReader: L.rankingScoreReader,
  answersReader: L.answersReader,
  extractionReader: L.extractionReader,
  compareReader: L.compareReader,
  kappaReader: L.kappaReader,
  calibrationReader: L.calibrationReader,
};

describe('THE DATASET GATE: the lab reads the vendored Ekene document fixtures', () => {
  it('each of the five fixture files the lab imports is the file on disk', () => {
    const files = { corpus: 'corpus.json', queries: 'queries.json', systems: 'systems.json', extraction: 'extraction.json', calibration: 'calibration.json' };
    Object.entries(files).forEach(([k, f]) => {
      expect(L.DATASET[k]).toEqual(JSON.parse(fs.readFileSync(path.join(FIXDIR, f), 'utf8')));
      expect(L.DATASET[k].synthetic).toMatch(/^SYNTHETIC/);
    });
    expect(L.DOCS).toHaveLength(60);
    expect(L.QUERY_LIST).toHaveLength(24);
    expect(L.DATASET.calibration.rows).toHaveLength(200);
    console.log(`[appliedai lab] ${L.DOCS.length} passages, ${L.QUERY_LIST.length} queries, ${L.SYSTEM_IDS.length} systems, ${L.DATASET.extraction.labels.length} labelled records, ${L.DATASET.calibration.rows.length} calibration rows, read from the vendored fixtures`);
  });
  it('the stated hand set, query and ranking the lab carries are the ones the digest prints', () => {
    L.TEACHING.hand.filter((d) => d.text).forEach((d) => expect(DIGEST).toContain(`${d.id} "${d.text}"`));
    expect(DIGEST).toContain(`RANKING "${L.TEACHING.hQuery}" BY COSINE`);
    expect(DIGEST).toContain(`the list ${L.TEACHING.ranking.join(', ')} against the judgments ${Object.entries(L.TEACHING.judgments).map(([k, v]) => `${k} ${v}`).join(', ')}`);
    expect(DIGEST).toContain(`seed ${L.TEACHING.seed}, ${L.TEACHING.nBoot} replicates`);
    expect(DIGEST).toContain(`At ${L.TEACHING.relTol}, `);
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
    expect(total).toBeGreaterThan(250);
    console.log(`[appliedai lab] ${total} numeric leaves over ${Object.keys(READERS).length} readers, every one printed in the digest`);
  }, 60000);

  it('NEGATIVE CONTROL: a number the digest does not print is reported as unprinted', () => {
    const f = L.bm25Reader().ranking[0].score;
    expect(printed(0.1234567)).toBe(false);
    expect(printed(f + 1e-4)).toBe(false);
    expect(printed(f)).toBe(true);
  });

  it('pins named figures to the exact digest rows that print them', () => {
    const tf = L.tfidfReader();
    tf.idf.forEach((r) => expect(DIGEST).toContain(`| ${r.term} | ${r.df} | ${f6(r.idf)} |`));
    tf.q04.forEach((r) => expect(DIGEST).toContain(`| ${r.id} | ${f6(r.score)} |`));
    const bm = L.bm25Reader();
    bm.terms.forEach((t) => expect(DIGEST).toContain(`| ${t.term} | ${t.df} | ${f6(t.idf)} |`));
    bm.ranking.forEach((r, i) => expect(DIGEST).toContain(`| ${i + 1} | ${r.id} | ${r.length} | ${f6(r.score)} | ${r.terms.map((t) => `${t.term}: ${t.tf}, ${f6(t.contribution)}`).join('; ')} |`));
    bm.q02.forEach((r, i) => expect(DIGEST).toContain(`| ${i + 1} | ${r.id} | ${r.length} | ${f6(r.score)} |`));
    const ak = L.atKReader();
    ak.perQuery.forEach((r) => expect(DIGEST).toMatch(new RegExp(`\\| ${r.query} \\| \\d+ \\| \\d+ \\| ${f6(r.precision)} \\| ${r.recall === null ? 'null' : f6(r.recall)} \\| [01] \\| (?:\\d+|null) \\| ${f6(r.reciprocalRank)} \\|`)));
    expect(DIGEST).toContain(`| MRR at ${L.TEACHING.k} | ${f6(ak.means.A.mrr)} | ${f6(ak.means.B.mrr)} |`);
    const rs = L.rankingScoreReader();
    expect(DIGEST).toContain(`MAP at ${L.TEACHING.k}: system A ${f6(rs[0].map1)}, system B ${f6(rs[1].map1)}`);
    expect(DIGEST).toContain(`| MAP | ${f6(rs[0].map1)} | ${f6(rs[0].map2)} | ${f6(rs[1].map1)} | ${f6(rs[1].map2)} |`);
    const ex = L.extractionReader();
    expect(DIGEST).toContain(`| micro accuracy | ${f6(ex[0].microAccuracy)} | ${f6(ex[1].microAccuracy)} |`);
    expect(DIGEST).toContain(`| macro F1 | ${f6(ex[0].macroF1)} | ${f6(ex[1].macroF1)} |`);
    const cmp = L.compareReader();
    expect(DIGEST).toContain(`| nDCG at ${L.TEACHING.k}, paired | ${f6(cmp.paired.difference)} | ${f6(cmp.paired.lower)} | ${f6(cmp.paired.upper)} |`);
    const kp = L.kappaReader();
    kp.rows.forEach((r) => expect(DIGEST).toContain(`| ${r.weights} | ${f6(r.observed)} | ${f6(r.expected)} |`));
    const cal = L.calibrationReader();
    cal.table.forEach((t) => expect(DIGEST).toContain(`| ${t.n} | ${f6(t.meanPredicted)} | ${f6(t.observedFrequency)} | ${f6(t.gap)} |`));
    expect(DIGEST).toContain(`Brier score ${f6(cal.brier)}; ECE ${f6(cal.ece)}; MCE ${f6(cal.mce)}.`);
    const cl = L.claimsReader();
    expect(DIGEST).toContain(`| claims | ${cl[0].claims} | ${cl[1].claims} |`);
    expect(DIGEST).toContain(`system B then has ${cl[2].supported} of ${cl[2].claims} claims supported, ${f6(cl[2].fraction)}`);
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
  const rebuild = (tz) => execFileSync('node', [path.join(mirrorDir(WAVE), 'd5_dump.mjs')], {
    encoding: 'utf8',
    maxBuffer: 1e8,
    env: {
      ...process.env,
      TZ: tz,
      LC_ALL: 'C',
      D5_WAVE_DIR: mirrorDir(WAVE),
      D5_ENGINES: ENGINES,
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
    console.log(`[appliedai lab] the committed d5_dump.mjs rebuilt ${a.split('\n').length} lines byte for byte in two time zones`);
  }, 180000);
});

describe('THE ENGINE GATE: the interactive routes are the engine, unchanged', () => {
  it('each route returns what the engine returns, refusals included', () => {
    const docs = [{ id: 'p1', text: 'oil rate 120 bopd' }, { id: 'p2', text: 'water cut 10 percent' }, { id: 'p3', text: 'oil and water' }];
    const cases = [
      [L.tokenizeOf, EV.tokenize, { text: 'Ekene-3 at 1.25' }],
      [L.vectorsOf, EV.tfidfVectors, { documents: docs }],
      [L.tfidfOf, EV.rankTfidf, { documents: docs, query: 'oil' }],
      [L.bm25Of, EV.rankBm25, { documents: docs, query: 'oil water', k: 2 }],
      [L.bm25Of, EV.rankBm25, { documents: docs, query: 'oil', k: 0 }],
      [L.retrieveOf, EV.retrieve, { documents: docs, queries: [{ id: 'q', text: 'oil' }], method: 'bm25' }],
      [L.metricsOf, EV.retrievalMetrics, { ranking: ['p1', 'p3'], judgments: { p1: 2, p3: 1 }, k: 2 }],
      [L.evaluateOf, EV.evaluateRetrieval, { runs: { q: ['p1'] }, judgments: { q: { p1: 1 } }, k: 1 }],
      [L.normalizeOf, EV.normalizeAnswer, { text: 'The 45.0 percent' }],
      [L.matchOf, EV.answerMatch, { prediction: '45 percent', truth: '45.0 percent' }],
      [L.extractionOf, EV.scoreExtraction, { labels: [{ id: 'r', fields: { q: 1 } }], predictions: [{ id: 'r', fields: { q: '1' } }], fields: [{ name: 'q', type: 'number' }] }],
      [L.groundOf, EV.checkGroundedness, { answer: 'rate 120', citations: ['p1'], documents: docs }],
      [L.answersCheckOf, EV.checkAnswers, { answers: [{ query: 'q', text: 'rate 120', citations: ['p1'] }], documents: docs }],
      [L.kappaOf, EV.cohenKappa, { a: [0, 1, 1], b: [0, 1, 0] }],
      [L.kappaOf, EV.cohenKappa, { a: [0, 1], b: [0, 1], weights: 'cubic' }],
      [L.calibrationOf, EV.calibration, { yTrue: [0, 1, 1], probabilities: [0.2, 0.7, 0.9], bins: 5 }],
      [L.bootstrapOf, EV.bootstrapMean, { values: [0.2, 0.7, 0.9], seed: 1, nBoot: 50 }],
      [L.bootstrapOf, EV.bootstrapMean, { values: [0.2, 0.7] }],
      [L.pairedOf, EV.pairedBootstrap, { a: [0.2, 0.7, 0.9], b: [0.1, 0.8, 0.9], seed: 1, nBoot: 50 }],
    ];
    cases.forEach(([lab, eng, args]) => expect(lab(args)).toEqual(eng(args)));
  });
  it('a blank is a question, a zero is a statement, and what a learner pastes parses or says why it does not', () => {
    expect(L.parseNumber('')).toBeUndefined();
    expect(L.parseNumber('0')).toBe(0);
    expect(Number.isNaN(L.parseNumber('x'))).toBe(true);
    expect(L.parseNumbers('0.1, 0.2 0.3;1\n0').values).toEqual([0.1, 0.2, 0.3, 1, 0]);
    expect(L.parseNumbers('0.1, x').error).toContain('x');
    expect(L.parseJson('{"a": 1}').value).toEqual({ a: 1 });
    expect(L.parseJson('{a: 1}').error).toBeTruthy();
    const back = L.parseDocuments(L.documentsText()).documents;
    expect(back).toEqual(L.DOCS);
    expect(L.parseDocuments(JSON.stringify(L.DOCS.slice(0, 2))).documents).toEqual(L.DOCS.slice(0, 2));
    expect(L.parseDocuments('no colon here').error).toBeTruthy();
    expect(L.parseNames('EKD-001, EKD-002 EKD-003')).toEqual(['EKD-001', 'EKD-002', 'EKD-003']);
  });
  it('the answer-list helper is answerMatch calls, and passes a refusal through', () => {
    const r = L.matchList(L.shortsOf('A'));
    expect(r.exact).toBe(L.answersReader()[0].exact);
    expect(r.rows[12].r).toEqual(EV.answerMatch({ prediction: r.rows[12].answer, truth: r.rows[12].reference }));
    const bad = L.matchList([{ query: 'q', answer: 5, reference: 'x' }]);
    expect(bad.refusal.field).toBe('prediction');
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
    ...leaves(L.TEACHING).map(([at, x]) => [`TEACHING${at}`, x]),
  ];
  it('the answer key is eighteen fields with absolute tolerances', () => {
    expect(FIELDS).toHaveLength(18);
    FIELDS.forEach(([, , , tol]) => expect(tol).toBeGreaterThan(0));
  });
  it('sweeps every number the lab and its dataset export and finds none, over a surface large enough to mean something', () => {
    const values = all();
    expect(values.length).toBeGreaterThan(500);
    expect(sweep(values)).toEqual([]);
    console.log(`[appliedai lab] ${values.length} lab and dataset numbers x 18 graded answers x 5 shiftings: 0 within ten tolerances`);
  }, 60000);
  it('NEGATIVE CONTROL: a planted graded answer is caught and named', () => {
    const planted = [...all(), ['planted', FIELDS[7][2] + FIELDS[7][3]]];
    const hits = sweep(planted);
    expect(hits.length).toBe(1);
    expect(hits[0]).toContain(FIELDS[7][1]);
  }, 60000);
  it('the lab holds no tolerance and names no capstone', () => {
    expect(LAB_SOURCE).not.toMatch(/gradedTolerance|fields\.json/);
    expect(LAB_SOURCE).not.toMatch(/\b(?:orlu|nnewi|awka)\b|\b(?:ORL|NNW|NX)-\d/i);
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
