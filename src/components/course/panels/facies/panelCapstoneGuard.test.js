// THE D3 CAPSTONE GUARD over everything a learner sees in the app: the teaching
// lab, its dataset copy, the three panels, their shared bits and the learning
// page.
//
// No graded answer in any of the four shapes gradedAnswerGuard.js derives (the
// full double, twelve and nine significant digits, the six decimals the course
// prints), no capstone field name, no run of three consecutive capstone values
// and no distinctive capstone input. The answers are read from the committed
// fields.json and the inputs from the committed d3_capstone.mjs, run in a child
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
const PAGE = path.resolve(HERE, '../../../../pages/apps/FaciesLearningPage.jsx');
const EXPECTED_SOURCES = [
  'ClassifyExplorer.jsx', 'ClusterExplorer.jsx', 'JudgeExplorer.jsx', 'ekeneFacies.json', 'faciesLab.js', 'panelBits.jsx',
];
const FIELDS = JSON.parse(fs.readFileSync(waveInput('facies', 'fields.json'), 'utf8'));
const INPUTS = JSON.parse(execFileSync('node', [path.join(mirrorDir('facies'), 'd3_capstone.mjs'), '--inputs'], {
  encoding: 'utf8', maxBuffer: 1e8, stdio: ['ignore', 'pipe', 'ignore'],
  env: { ...process.env, D3_ENGINES: path.join(ROOT, 'packages/engines'), D3_TOLERANCE: path.join(HERE, 'gradedTolerance.js') },
}));

/**
 * Every numeric series in the three capstone fields: one per well and log
 * channel in depth order, and the well tops across the wells. The FACIES names
 * are left out, because a run of three facies names matches any example list a
 * panel shows.
 */
const SERIES = [];
const SCALARS = [];
const CHANNELS = ['GR', 'RHOB', 'NPHI', 'PEF', 'CALI', 'depth'];
Object.values(INPUTS).forEach(({ field, stated }) => {
  field.wells.forEach((w) => {
    const rows = field.rows.filter((r) => r.well === w.id);
    CHANNELS.forEach((c) => SERIES.push(rows.map((r) => r[c])));
  });
  SERIES.push(field.wells.map((w) => w.top));
  Object.values(stated).forEach((v) => { if (typeof v === 'number' && Number.isInteger(v) && Math.abs(v) >= 100) SCALARS.push(v); });
});
const RUNS = SERIES.flatMap((v) => v.slice(0, -2).map((_, i) => v.slice(i, i + 3))
  .filter((w) => w.every((x) => x !== null))
  .flatMap((w) => [w.map((x) => x.toFixed(6)).join(', '), w.map(String).join(', '), w.map(String).join(',')]));
const NAMES = /\b(ihiala|nkwelle|ogbunike)\b/i;

const sources = () => {
  const panelFiles = fs.readdirSync(HERE).filter((f) => /\.(jsx?|mjs|json)$/.test(f) && !/\.test\./.test(f)
    && !['gradedTolerance.js', 'gradedAnswerGuard.js'].includes(f)).sort();
  return { panelFiles, texts: [...panelFiles.map((f) => [f, fs.readFileSync(path.join(HERE, f), 'utf8')]), ['FaciesLearningPage.jsx', fs.readFileSync(PAGE, 'utf8')]] };
};
const scalarsIn = (text) => SCALARS.filter((h) => new RegExp(`(?<![\\d.])${h}(?![\\d])`).test(text));
const runsIn = (text) => RUNS.filter((s) => text.includes(s));

describe('THE D3 CAPSTONE GUARD', () => {
  it('reads eighteen answers and the three datasets, and derives enough to search for', () => {
    expect(FIELDS).toHaveLength(18);
    expect(FIELDS.map((f) => f[1])).toEqual(GRADED_FIELDS.map((f) => f[1]));
    FIELDS.forEach(([, key, , tol]) => expect(tol).toBe(gradedTolerance(key)));
    expect(Object.keys(INPUTS)).toEqual(['IHIALA', 'NKWELLE', 'OGBUNIKE']);
    expect(SERIES.length).toBeGreaterThanOrEqual(100);
    expect(RUNS.length).toBeGreaterThan(5000);
    expect(SCALARS.length).toBe(0);
    const r = allRenderings(FIELDS);
    expect(r.length).toBeGreaterThanOrEqual(54);
    const skipped = FIELDS.flatMap(([, k, v]) => skippedShapesOf(k, v));
    console.log(`[facies guard] ${r.length} renderings of 18 answers searched, ${skipped.length} shapes skipped as too short or exponential, `
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
    expect('<p>Ogbunike</p>').toMatch(NAMES);
    const rhob = INPUTS.NKWELLE.field.rows.filter((r) => r.well === 'NKWELLE-2').map((r) => r.RHOB);
    expect(runsIn(`values: [${rhob.slice(3, 6).join(', ')}]`).length).toBeGreaterThan(0);
    expect(runsIn(`values: [${rhob.slice(3, 6).map((v) => v.toFixed(6)).join(', ')}]`).length).toBeGreaterThan(0);
  });

  it('this suite names no path under /root', () => {
    const me = fs.readFileSync(fileURLToPath(import.meta.url), 'utf8');
    expect(me.split('\n').filter((l) => /['"`]\/root\//.test(l))).toEqual([]);
  });
});
