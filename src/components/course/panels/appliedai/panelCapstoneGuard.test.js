// THE D5 CAPSTONE GUARD over everything a learner sees in the app: the teaching
// lab, the three panels, their shared bits and the learning page.
//
// No graded answer in any of the four shapes gradedAnswerGuard.js derives (the
// full double, twelve and nine significant digits, the six decimals the course
// prints), no capstone name or capstone id, no distinctive capstone string (a
// capstone query, or an answer written for the capstone), no run of three
// consecutive capstone probabilities and no distinctive capstone scalar (the
// seeds). The answers are read from the committed fields.json and the inputs
// from the committed d5_capstone.mjs, run in a child process against this
// repository's vendored engine, so this suite needs neither a live wave
// directory nor a path under /root.
//
// A capstone string that is VERBATIM FIXTURE TEXT (a passage, a fixture
// answer, a fixture short answer or reference) is teaching material the lab
// imports, so it is left out and counted.
//
// THE INVENTORY IS DECLARED. A renamed or added source fails the listing test
// instead of quietly dropping out of the sweep. Every shape is PLANTED and
// caught, so a guard that matched nothing could not pass.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { waveInput, mirrorDir } from '../../../../../tools/course-waves/waveInputs.mjs';
import { allRenderings, leaksIn, renderingsOf, skippedShapesOf } from './gradedAnswerGuard.js';
import { GRADED_FIELDS, gradedTolerance } from './gradedTolerance.js';
import { DEFAULTS } from '@petrolord/engines/engines/dataai/evaluate.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const PAGE = path.resolve(HERE, '../../../../pages/apps/AppliedaiLearningPage.jsx');
const FIXDIR = path.join(ROOT, 'packages/engines/test-data/dataai/ekene-docs');
const EXPECTED_SOURCES = [
  'RetrievalExplorer.jsx', 'ScoringExplorer.jsx', 'TrustExplorer.jsx', 'evaluateLab.js', 'panelBits.jsx',
];
const FIELDS = JSON.parse(fs.readFileSync(waveInput('appliedai', 'fields.json'), 'utf8'));
const CAPSTONE_SRC = fs.readFileSync(path.join(mirrorDir('appliedai'), 'd5_capstone.mjs'), 'utf8');
const INPUTS = JSON.parse(execFileSync('node', [path.join(mirrorDir('appliedai'), 'd5_capstone.mjs'), '--inputs'], {
  encoding: 'utf8', maxBuffer: 1e8, stdio: ['ignore', 'pipe', 'ignore'],
  env: { ...process.env, D5_ENGINES: path.join(ROOT, 'packages/engines'), D5_TOLERANCE: path.join(HERE, 'gradedTolerance.js') },
}));

const FIXTEXT = new Set();
const fx = (f) => JSON.parse(fs.readFileSync(path.join(FIXDIR, f), 'utf8'));
fx('corpus.json').passages.forEach((p) => FIXTEXT.add(p.text));
fx('queries.json').queries.forEach((q) => { FIXTEXT.add(q.text); FIXTEXT.add(q.reference); });
fx('systems.json').systems.forEach((s) => s.answers.forEach((a) => { FIXTEXT.add(a.text); FIXTEXT.add(a.short); }));

const STRINGS = [];
let fixtureLeftOut = 0;
const addString = (v) => {
  if (typeof v !== 'string' || v.trim().length < 12) return;
  if (FIXTEXT.has(v)) { fixtureLeftOut += 1; return; }
  STRINGS.push(v.toLowerCase());
};
const SERIES = [];
const SCALARS = [];
const ENGINE_DEFAULTS = new Set(Object.values(DEFAULTS).filter((v) => typeof v === 'number'));
const big = (v) => typeof v === 'number' && Number.isInteger(v) && Math.abs(v) >= 100 && !ENGINE_DEFAULTS.has(v);
Object.values(INPUTS).forEach((o) => {
  if (big(o.seed)) SCALARS.push(o.seed);
  (o.queries || []).forEach((q) => addString(q.text));
  (o.answers || []).forEach((a) => addString(a.text));
  (o.documents || []).forEach((d) => addString(d.text));
  (o.shorts || []).forEach((x) => { addString(x.answer); addString(x.reference); });
  Object.values(o.stated || {}).forEach((v) => { if (big(v)) SCALARS.push(v); });
  if (o.calibration) SERIES.push(o.calibration.probabilities);
});
[...CAPSTONE_SRC.matchAll(/mulberry32\((\d{3,})\)/g)].forEach((m) => { const v = Number(m[1]); if (big(v) && !SCALARS.includes(v)) SCALARS.push(v); });
const RUNS = SERIES.flatMap((v) => v.slice(0, -2).map((_, i) => v.slice(i, i + 3))
  .filter((w) => !w.every((x) => x === w[0]))
  .flatMap((w) => [w.map((x) => x.toFixed(6)).join(', '), w.map((x) => x.toFixed(2)).join(', '), w.map(String).join(', '), w.map(String).join(',')]));
const NAMES = /\b(orlu|nnewi|awka)\b|\b(?:ORL|NNW|NX)-\d/i;

const sources = () => {
  const panelFiles = fs.readdirSync(HERE).filter((f) => /\.(jsx?|mjs|json)$/.test(f) && !/\.test\./.test(f)
    && !['gradedTolerance.js', 'gradedAnswerGuard.js'].includes(f)).sort();
  return { panelFiles, texts: [...panelFiles.map((f) => [f, fs.readFileSync(path.join(HERE, f), 'utf8')]), ['AppliedaiLearningPage.jsx', fs.readFileSync(PAGE, 'utf8')]] };
};
const scalarsIn = (text) => SCALARS.filter((h) => new RegExp(`(?<![\\d.])${h}(?![\\d])(?!\\.\\d)`).test(text));
const runsIn = (text) => RUNS.filter((s) => text.includes(s));
const stringsIn = (text) => { const low = text.toLowerCase(); return STRINGS.filter((s) => low.includes(s)); };

describe('THE D5 CAPSTONE GUARD', () => {
  it('reads eighteen answers and the three datasets, and derives enough to search for', () => {
    expect(FIELDS).toHaveLength(18);
    expect(FIELDS.map((f) => f[1])).toEqual(GRADED_FIELDS.map((f) => f[1]));
    FIELDS.forEach(([, key, , tol]) => expect(tol).toBe(gradedTolerance(key)));
    expect(Object.keys(INPUTS)).toEqual(['ORLU', 'NNEWI', 'AWKA']);
    expect(STRINGS.length).toBeGreaterThanOrEqual(12);
    expect(RUNS.length).toBeGreaterThan(300);
    expect(SCALARS.length).toBeGreaterThanOrEqual(4);
    const r = allRenderings(FIELDS);
    expect(r.length).toBeGreaterThanOrEqual(54);
    const skipped = FIELDS.flatMap(([, k, v]) => skippedShapesOf(k, v));
    console.log(`[appliedai guard] ${r.length} renderings of 18 answers searched, ${skipped.length} shapes skipped as too short or exponential, `
      + `${STRINGS.length} distinctive capstone strings (${fixtureLeftOut} verbatim fixture strings left out), ${RUNS.length} probability run renderings, ${SCALARS.length} distinctive scalars`);
  });

  it('the inventory of swept sources is the declared one', () => {
    expect(sources().panelFiles).toEqual(EXPECTED_SOURCES);
  });

  it('no swept source carries a graded answer, a capstone name, string, run or scalar', () => {
    const r = allRenderings(FIELDS);
    const found = [];
    sources().texts.forEach(([f, text]) => {
      leaksIn(text, r).forEach((l) => found.push(`${f}: ${l.key} as ${l.shape} ${l.text}`));
      const m = text.match(NAMES);
      if (m) found.push(`${f}: names ${m[0]}`);
      stringsIn(text).forEach((s) => found.push(`${f}: a capstone string "${s}"`));
      runsIn(text).forEach((s) => found.push(`${f}: a capstone run ${s}`));
      scalarsIn(text).forEach((h) => found.push(`${f}: a capstone scalar ${h}`));
    });
    expect(found).toEqual([]);
  });

  it('NEGATIVE CONTROL: every shape of an answer, a name, a string, a run and a scalar is caught when planted', () => {
    const [, key, v] = FIELDS[9];
    const shapes = renderingsOf(key, v);
    expect(shapes.map((s) => s.shape)).toContain('full');
    expect(shapes.map((s) => s.shape)).toContain('printed');
    shapes.forEach((s) => {
      expect(leaksIn(`const x = ${s.text};`, allRenderings(FIELDS)).map((l) => l.text)).toContain(s.text);
    });
    expect('<p>Awka</p>').toMatch(NAMES);
    expect('ranked NNW-07 first').toMatch(NAMES);
    expect(stringsIn(`const q = '${INPUTS.NNEWI.queries[2].text}';`).length).toBe(1);
    const p = INPUTS.AWKA.calibration.probabilities;
    expect(runsIn(`values: [${p.slice(3, 6).join(', ')}]`).length).toBeGreaterThan(0);
    expect(scalarsIn(`const seed = ${INPUTS.NNEWI.seed};`)).toEqual([INPUTS.NNEWI.seed]);
  });

  it('this suite names no path under /root', () => {
    const me = fs.readFileSync(fileURLToPath(import.meta.url), 'utf8');
    expect(me.split('\n').filter((l) => /['"`]\/root\//.test(l))).toEqual([]);
  });
});
