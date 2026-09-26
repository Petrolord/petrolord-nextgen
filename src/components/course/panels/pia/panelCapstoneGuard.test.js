// THE EC7 CAPSTONE GUARD over everything a learner sees in the app: the
// teaching lab, the three calculator panels, their shared bits and the
// learning page.
//
// No graded answer in any of the four shapes gradedAnswerGuard.js derives (the
// full double, twelve and nine significant digits, the six decimals the course
// prints), no capstone name, no distinctive capstone string (a label written
// for the capstone), no run of three consecutive capstone production figures
// and no distinctive capstone scalar (an uneven volume or a fractional price).
// The answers are read from the committed fields.json and the inputs from the
// committed pia_capstone.mjs, run in a child process against this
// repository's vendored engine, so this suite needs neither a live wave
// directory nor a path under /root.
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
const PAGE = path.resolve(HERE, '../../../../pages/apps/PiaLearningPage.jsx');
const EXPECTED_SOURCES = [
  'HctCalculator.jsx', 'LedgerCalculator.jsx', 'RoyaltyCalculator.jsx', 'panelBits.jsx', 'piaLab.js',
];
const FIELDS = JSON.parse(fs.readFileSync(waveInput('pia', 'fields.json'), 'utf8'));
const INPUTS = JSON.parse(execFileSync('node', [path.join(mirrorDir('pia'), 'pia_capstone.mjs'), '--inputs'], {
  encoding: 'utf8', maxBuffer: 1e8, stdio: ['ignore', 'pipe', 'ignore'],
  env: {
    ...process.env,
    EC7_WAVE_DIR: mirrorDir('pia'),
    EC7_ENGINES: path.join(ROOT, 'packages/engines'),
    EC7_REPO: ROOT,
    EC7_TOLERANCE: path.join(HERE, 'gradedTolerance.js'),
  },
}));

const walkStrings = (n, f) => {
  if (typeof n === 'string') f(n);
  else if (Array.isArray(n)) n.forEach((x) => walkStrings(x, f));
  else if (n && typeof n === 'object') Object.values(n).forEach((x) => walkStrings(x, f));
};
const STRINGS = [];
const addString = (v) => {
  if (typeof v !== 'string' || v.trim().length < 12) return;
  if (!STRINGS.includes(v.toLowerCase())) STRINGS.push(v.toLowerCase());
};
const SCALARS = [];
const addScalar = (v) => {
  if (!(typeof v === 'number' && Number.isFinite(v) && Math.abs(v) >= 100)) return;
  if (Number.isInteger(v) && (Math.abs(v) < 10000 || v % 100 === 0)) return;
  if (!SCALARS.includes(v)) SCALARS.push(v);
};
const walkNums = (n) => {
  if (typeof n === 'number') addScalar(n);
  else if (Array.isArray(n)) n.forEach(walkNums);
  else if (n && typeof n === 'object') Object.values(n).forEach(walkNums);
};
const SERIES = [];
Object.values(INPUTS).forEach((o) => {
  addString(o.label);
  walkNums(o);
  ['oil_bbl', 'gas_mscf', 'condensate_bbl'].forEach((col) => {
    const v = o.prodRows.map((r) => r[col]);
    if (v.some((x) => x !== 0)) SERIES.push(v);
  });
});
const RUNS = SERIES.flatMap((v) => v.slice(0, -2).map((_, i) => v.slice(i, i + 3))
  .filter((w) => !w.every((x) => x === w[0]))
  .flatMap((w) => [w.map((x) => x.toFixed(6)).join(', '), w.map((x) => x.toFixed(2)).join(', '), w.map(String).join(', '), w.map(String).join(',')]));
const NAMES = /\b(odozi|nkemdi|alaku)\b/i;

const sources = () => {
  const panelFiles = fs.readdirSync(HERE).filter((f) => /\.(jsx?|mjs|json)$/.test(f) && !/\.test\./.test(f)
    && !['gradedTolerance.js', 'gradedAnswerGuard.js'].includes(f)).sort();
  return { panelFiles, texts: [...panelFiles.map((f) => [f, fs.readFileSync(path.join(HERE, f), 'utf8')]), ['PiaLearningPage.jsx', fs.readFileSync(PAGE, 'utf8')]] };
};
const scalarsIn = (text) => SCALARS.filter((h) => new RegExp(`(?<![\\d.])${String(h).replace('.', '\\.')}(?![\\d])(?!\\.\\d)`).test(text));
const runsIn = (text) => RUNS.filter((s) => text.includes(s));
const stringsIn = (text) => { const low = text.toLowerCase(); return STRINGS.filter((s) => low.includes(s)); };

describe('THE EC7 CAPSTONE GUARD', () => {
  it('reads eighteen answers and the three cases, and derives enough to search for', () => {
    expect(FIELDS).toHaveLength(18);
    expect(FIELDS.map((f) => f[1])).toEqual(GRADED_FIELDS.map((f) => f[1]));
    FIELDS.forEach(([, key, , tol]) => expect(tol).toBe(gradedTolerance(key)));
    expect(Object.keys(INPUTS)).toEqual(['ODOZI', 'NKEMDI', 'ALAKU']);
    expect(STRINGS.length).toBe(3);
    expect(RUNS.length).toBeGreaterThan(80);
    expect(SCALARS.length).toBeGreaterThanOrEqual(15);
    const r = allRenderings(FIELDS);
    expect(r.length).toBeGreaterThanOrEqual(54);
    const skipped = FIELDS.flatMap(([, k, v]) => skippedShapesOf(k, v));
    console.log(`[pia guard] ${r.length} renderings of 18 answers searched, ${skipped.length} shapes skipped as too short or exponential, `
      + `${STRINGS.length} capstone labels, ${RUNS.length} production run renderings, ${SCALARS.length} distinctive scalars`);
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
    const [, key, v] = FIELDS[7];
    const shapes = renderingsOf(key, v);
    expect(shapes.map((s) => s.shape)).toContain('full');
    expect(shapes.map((s) => s.shape)).toContain('printed');
    shapes.forEach((s) => {
      expect(leaksIn(`const x = ${s.text};`, allRenderings(FIELDS)).map((l) => l.text)).toContain(s.text);
    });
    expect('<p>Alaku</p>').toMatch(NAMES);
    expect(stringsIn(`const q = '${INPUTS.NKEMDI.label}';`).length).toBe(1);
    const oil = INPUTS.NKEMDI.prodRows.map((r) => r.oil_bbl);
    expect(runsIn(`values: [${oil.slice(1, 4).join(', ')}]`).length).toBeGreaterThan(0);
    expect(scalarsIn(`const v = ${SCALARS[0]};`)).toEqual([SCALARS[0]]);
  });

  it('this suite names no path under /root', () => {
    const me = fs.readFileSync(fileURLToPath(import.meta.url), 'utf8');
    expect(me.split('\n').filter((l) => /['"`]\/root\//.test(l))).toEqual([]);
  });
});
