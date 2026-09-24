// THE D4 CAPSTONE GUARD over everything a learner sees in the app: the teaching
// lab, its dataset copy, the three panels, their shared bits and the learning
// page.
//
// No graded answer in any of the four shapes gradedAnswerGuard.js derives (the
// full double, twelve and nine significant digits, the six decimals the course
// prints), no capstone field name, no run of three consecutive capstone values
// and no distinctive capstone input. The answers are read from the committed
// fields.json and the inputs from the committed d4_capstone.mjs, run in a child
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
import { DEFAULTS } from '@petrolord/engines/engines/dataai/forecast.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const PAGE = path.resolve(HERE, '../../../../pages/apps/ForecastmlLearningPage.jsx');
const EXPECTED_SOURCES = [
  'BacktestExplorer.jsx', 'SmoothingExplorer.jsx', 'UncertaintyExplorer.jsx', 'ekeneProduction.json', 'forecastLab.js', 'panelBits.jsx',
];
const FIELDS = JSON.parse(fs.readFileSync(waveInput('forecastml', 'fields.json'), 'utf8'));
const INPUTS = JSON.parse(execFileSync('node', [path.join(mirrorDir('forecastml'), 'd4_capstone.mjs'), '--inputs'], {
  encoding: 'utf8', maxBuffer: 1e8, stdio: ['ignore', 'pipe', 'ignore'],
  env: { ...process.env, D4_ENGINES: path.join(ROOT, 'packages/engines'), D4_TOLERANCE: path.join(HERE, 'gradedTolerance.js') },
}));

/**
 * Every numeric series in the three capstone fields: one monthly rate series
 * per well. The distinctive scalars are every whole number of 100 or more: the
 * field seeds and each well's stated qi. The stated alpha, beta, h, seeds and
 * origins are small numbers any example uses and are left out, and so is a
 * stated value equal to an engine default (nSims 1000), which every example
 * that leaves nSims out uses.
 */
const SERIES = [];
const SCALARS = [];
const ENGINE_DEFAULTS = new Set(Object.values(DEFAULTS).filter((v) => typeof v === 'number'));
const big = (v) => typeof v === 'number' && Number.isInteger(v) && Math.abs(v) >= 100 && !ENGINE_DEFAULTS.has(v);
Object.values(INPUTS).forEach(({ field, stated }) => {
  if (big(field.seed)) SCALARS.push(field.seed);
  field.wells.forEach((w) => {
    SERIES.push(w.rate);
    Object.values(w.spec).forEach((v) => { if (big(v)) SCALARS.push(v); });
  });
  Object.values(stated).forEach((v) => { if (big(v)) SCALARS.push(v); });
});
const RUNS = SERIES.flatMap((v) => v.slice(0, -2).map((_, i) => v.slice(i, i + 3))
  .filter((w) => w.every((x) => x !== null) && !w.every((x) => x === w[0]))
  .flatMap((w) => [w.map((x) => x.toFixed(6)).join(', '), w.map(String).join(', '), w.map(String).join(',')]));
const NAMES = /\b(agulu|nanka|umunze)\b/i;

const sources = () => {
  const panelFiles = fs.readdirSync(HERE).filter((f) => /\.(jsx?|mjs|json)$/.test(f) && !/\.test\./.test(f)
    && !['gradedTolerance.js', 'gradedAnswerGuard.js'].includes(f)).sort();
  return { panelFiles, texts: [...panelFiles.map((f) => [f, fs.readFileSync(path.join(HERE, f), 'utf8')]), ['ForecastmlLearningPage.jsx', fs.readFileSync(PAGE, 'utf8')]] };
};
const scalarsIn = (text) => SCALARS.filter((h) => new RegExp(`(?<![\\d.])${h}(?![\\d])(?!\\.\\d)`).test(text));
const runsIn = (text) => RUNS.filter((s) => text.includes(s));

describe('THE D4 CAPSTONE GUARD', () => {
  it('reads eighteen answers and the three datasets, and derives enough to search for', () => {
    expect(FIELDS).toHaveLength(18);
    expect(FIELDS.map((f) => f[1])).toEqual(GRADED_FIELDS.map((f) => f[1]));
    FIELDS.forEach(([, key, , tol]) => expect(tol).toBe(gradedTolerance(key)));
    expect(Object.keys(INPUTS)).toEqual(['AGULU', 'NANKA', 'UMUNZE']);
    expect(SERIES.length).toBe(6);
    expect(RUNS.length).toBeGreaterThan(500);
    expect(SCALARS.length).toBe(9);
    const r = allRenderings(FIELDS);
    expect(r.length).toBeGreaterThanOrEqual(54);
    const skipped = FIELDS.flatMap(([, k, v]) => skippedShapesOf(k, v));
    console.log(`[forecastml guard] ${r.length} renderings of 18 answers searched, ${skipped.length} shapes skipped as too short or exponential, `
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
    expect('<p>Umunze</p>').toMatch(NAMES);
    const rate = INPUTS.NANKA.field.wells.find((w) => w.well === 'NANKA-2').rate;
    expect(runsIn(`values: [${rate.slice(3, 6).join(', ')}]`).length).toBeGreaterThan(0);
    expect(runsIn(`values: [${rate.slice(3, 6).map((v) => v.toFixed(6)).join(', ')}]`).length).toBeGreaterThan(0);
    expect(scalarsIn(`const seed = ${INPUTS.NANKA.field.seed};`)).toEqual([INPUTS.NANKA.field.seed]);
  });

  it('this suite names no path under /root', () => {
    const me = fs.readFileSync(fileURLToPath(import.meta.url), 'utf8');
    expect(me.split('\n').filter((l) => /['"`]\/root\//.test(l))).toEqual([]);
  });
});
