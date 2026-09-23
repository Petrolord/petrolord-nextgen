// THE D1 CAPSTONE GUARD over everything a learner sees in the app: the teaching
// lab, its dataset copy, the three panels, their shared bits and the learning
// page.
//
// No graded answer in any of the four shapes gradedAnswerGuard.js derives (the
// full double, twelve and nine significant digits, the six decimals the course
// prints), no capstone field name, no run of three consecutive capstone values
// and no distinctive capstone input. The answers are read from the committed
// fields.json and the inputs from the committed d1_capstone.mjs, run in a child
// process against this repository's vendored engine, so this suite needs
// neither a live wave directory nor a path under /root.
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

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const PAGE = path.resolve(HERE, '../../../../pages/apps/DataQcLearningPage.jsx');
const EXPECTED_SOURCES = [
  'ChecksExplorer.jsx', 'MonitorExplorer.jsx', 'OutliersExplorer.jsx', 'dataqcLab.js', 'ekeneDataset.json', 'panelBits.jsx',
];
const FIELDS = JSON.parse(fs.readFileSync(waveInput('dataqc', 'fields.json'), 'utf8'));
const INPUTS = JSON.parse(execFileSync('node', [path.join(mirrorDir('dataqc'), 'd1_capstone.mjs'), '--inputs'], {
  encoding: 'utf8', maxBuffer: 1e8, stdio: ['ignore', 'pipe', 'ignore'],
  env: { ...process.env, D1_ENGINES: path.join(ROOT, 'packages/engines'), D1_TOLERANCE: path.join(HERE, 'gradedTolerance.js') },
}));

/** Every numeric series in the three capstone datasets, pair columns included. */
const SERIES = [];
const SCALARS = [];
const walk = (o) => {
  if (Array.isArray(o)) {
    if (o.length && Array.isArray(o[0])) { o[0].forEach((_, c) => SERIES.push(o.map((r) => r[c]))); return; }
    if (o.some((x) => typeof x === 'number')) { SERIES.push(o); return; }
    o.forEach(walk);
    return;
  }
  if (o && typeof o === 'object') { Object.values(o).forEach(walk); return; }
  if (typeof o === 'number' && Number.isInteger(o) && Math.abs(o) >= 100) SCALARS.push(o);
};
walk(INPUTS);
const RUNS = SERIES.flatMap((v) => v.slice(0, -2).map((_, i) => v.slice(i, i + 3))
  .filter((w) => w.every((x) => x !== null))
  .flatMap((w) => [w.map((x) => x.toFixed(6)).join(', '), w.map(String).join(', '), w.map(String).join(',')]));
const NAMES = /\b(odudu|ikoro|amasiri)\b/i;

const sources = () => {
  const panelFiles = fs.readdirSync(HERE).filter((f) => /\.(jsx?|mjs|json)$/.test(f) && !/\.test\./.test(f)
    && !['gradedTolerance.js', 'gradedAnswerGuard.js'].includes(f)).sort();
  return { panelFiles, texts: [...panelFiles.map((f) => [f, fs.readFileSync(path.join(HERE, f), 'utf8')]), ['DataQcLearningPage.jsx', fs.readFileSync(PAGE, 'utf8')]] };
};
const scalarsIn = (text) => SCALARS.filter((h) => new RegExp(`(?<![\\d.])${h}(?![\\d])`).test(text));
const runsIn = (text) => RUNS.filter((s) => text.includes(s));

describe('THE D1 CAPSTONE GUARD', () => {
  it('reads eighteen answers and the three datasets, and derives enough to search for', () => {
    expect(FIELDS).toHaveLength(18);
    expect(FIELDS.map((f) => f[1])).toEqual(GRADED_FIELDS.map((f) => f[1]));
    FIELDS.forEach(([, key, , tol]) => expect(tol).toBe(gradedTolerance(key)));
    expect(Object.keys(INPUTS)).toEqual(['ODUDU', 'IKORO', 'AMASIRI']);
    expect(SERIES.length).toBeGreaterThanOrEqual(12);
    expect(RUNS.length).toBeGreaterThan(1500);
    expect(SCALARS.length).toBeGreaterThanOrEqual(4);
    const r = allRenderings(FIELDS);
    expect(r.length).toBeGreaterThanOrEqual(54);
    const skipped = FIELDS.flatMap(([, k, v]) => skippedShapesOf(k, v));
    console.log(`[dataqc guard] ${r.length} renderings of 18 answers searched, ${skipped.length} shapes skipped as too short or exponential, `
      + `${SERIES.length} capstone series giving ${RUNS.length} run renderings, ${SCALARS.length} distinctive scalars`);
  });

  it('the inventory of swept sources is the declared one', () => {
    expect(sources().panelFiles).toEqual(EXPECTED_SOURCES);
  });

  it('no swept source carries a graded answer, a capstone name, a capstone run or a capstone scalar', () => {
    const r = allRenderings(FIELDS);
    const found = [];
    sources().texts.forEach(([f, text]) => {
      leaksIn(text, r).forEach((l) => found.push(`${f}: ${l.key} as ${l.shape} ${l.text}`));
      const m = text.match(NAMES);
      if (m) found.push(`${f}: names ${m[0]}`);
      runsIn(text).forEach((s) => found.push(`${f}: a capstone run ${s}`));
      scalarsIn(text).forEach((h) => found.push(`${f}: a capstone scalar ${h}`));
    });
    expect(found).toEqual([]);
  });

  it('NEGATIVE CONTROL: every shape of an answer, a name, a run and a scalar is caught when planted', () => {
    const [, key, v] = FIELDS[9];
    const shapes = renderingsOf(key, v);
    expect(shapes.map((s) => s.shape)).toContain('full');
    expect(shapes.map((s) => s.shape)).toContain('printed');
    shapes.forEach((s) => {
      expect(leaksIn(`const x = ${s.text};`, allRenderings(FIELDS)).map((l) => l.text)).toContain(s.text);
    });
    expect('<p>Amasiri</p>').toMatch(NAMES);
    const core = INPUTS.IKORO.core;
    expect(runsIn(`values: [${core.slice(3, 6).join(', ')}]`).length).toBeGreaterThan(0);
    expect(scalarsIn(`checked: ${SCALARS[0]},`)).toEqual([SCALARS[0]]);
  });

  it('this suite names no path under /root', () => {
    const me = fs.readFileSync(fileURLToPath(import.meta.url), 'utf8');
    expect(me.split('\n').filter((l) => /['"`]\/root\//.test(l))).toEqual([]);
  });
});
