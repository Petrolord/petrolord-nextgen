// THE SC3 CAPSTONE GUARD over everything a learner sees in the app: the
// teaching lab, the nine views, the three calculator panels, their shared bits
// and the learning page.
//
// No graded answer in any of the four shapes gradedAnswerGuard.js derives (the
// full double, twelve and nine significant digits, the six decimals the course
// prints), no capstone name, no distinctive capstone string (a label or an
// item name written for the capstone), no capstone item id, and no distinctive
// capstone scalar (an uneven cost, rate or demand). The answers are read from
// the committed fields.json and the inputs from the committed
// materials_capstone.mjs, run in a child process against this repository's
// vendored engine, so this suite needs neither a live wave directory nor a
// path under /root.
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
const PAGE = path.resolve(HERE, '../../../../pages/apps/MaterialsLearningPage.jsx');
const EXPECTED_SOURCES = [
  'RegisterCalculator.jsx', 'SparesCalculator.jsx', 'StockCalculator.jsx', 'materialsLab.js', 'materialsViews.jsx', 'panelBits.jsx',
];
const FIELDS = JSON.parse(fs.readFileSync(waveInput('materials', 'fields.json'), 'utf8'));
const INPUTS = JSON.parse(execFileSync('node', [path.join(mirrorDir('materials'), 'materials_capstone.mjs'), '--inputs'], {
  encoding: 'utf8', maxBuffer: 1e8, stdio: ['ignore', 'pipe', 'ignore'],
  env: {
    ...process.env,
    SC3_WAVE_DIR: mirrorDir('materials'),
    SC3_ENGINES: path.join(ROOT, 'packages/engines'),
    SC3_TOLERANCE: path.join(HERE, 'gradedTolerance.js'),
  },
}));

const STRINGS = [];
const addString = (v) => {
  if (typeof v !== 'string' || v.trim().length < 12) return;
  if (!STRINGS.includes(v.toLowerCase())) STRINGS.push(v.toLowerCase());
};
const IDS = [];
const SCALARS = [];
const addScalar = (v) => {
  if (!(typeof v === 'number' && Number.isFinite(v))) return;
  // A whole number or a short round figure sits inside ordinary text everywhere;
  // an uneven figure is distinctive.
  const s = String(v);
  if (Number.isInteger(v) && (Math.abs(v) < 1000 || v % 50 === 0)) return;
  if (!Number.isInteger(v) && s.replace(/^-?0?\./, '').replace('.', '').length < 4) return;
  if (!SCALARS.includes(v)) SCALARS.push(v);
};
const walk = (n, key = '') => {
  if (typeof n === 'number') addScalar(n);
  else if (typeof n === 'string') {
    if (['name', 'label'].includes(key)) addString(n);
    if (key === 'id' && /\d/.test(n) && n.length >= 5 && !IDS.includes(n)) IDS.push(n);
  } else if (Array.isArray(n)) n.forEach((x) => walk(x, key));
  else if (n && typeof n === 'object') Object.entries(n).forEach(([k, x]) => walk(x, k));
};
Object.values(INPUTS).forEach((o) => walk(o));
const NAMES = /\b(igbariam|ogidi|umuchu)\b/i;

const sources = () => {
  const panelFiles = fs.readdirSync(HERE).filter((f) => /\.(jsx?|mjs|json)$/.test(f) && !/\.test\./.test(f)
    && !['gradedTolerance.js', 'gradedAnswerGuard.js'].includes(f)).sort();
  return { panelFiles, texts: [...panelFiles.map((f) => [f, fs.readFileSync(path.join(HERE, f), 'utf8')]), ['MaterialsLearningPage.jsx', fs.readFileSync(PAGE, 'utf8')]] };
};
const scalarsIn = (text) => SCALARS.filter((h) => new RegExp(`(?<![\\d.])${String(h).replace('.', '\\.')}(?![\\d])(?!\\.\\d)`).test(text));
const stringsIn = (text) => { const low = text.toLowerCase(); return STRINGS.filter((s) => low.includes(s)); };
const idsIn = (text) => IDS.filter((s) => text.includes(s));

describe('THE SC3 CAPSTONE GUARD', () => {
  it('reads eighteen answers and the three cases, and derives enough to search for', () => {
    expect(FIELDS).toHaveLength(18);
    expect(FIELDS.map((f) => f[1])).toEqual(GRADED_FIELDS.map((f) => f[1]));
    FIELDS.forEach(([, key, , tol]) => expect(tol).toBe(gradedTolerance(key)));
    expect(Object.keys(INPUTS)).toEqual(['IGBARIAM', 'OGIDI', 'UMUCHU']);
    expect(STRINGS.length).toBeGreaterThanOrEqual(10);
    expect(IDS.length).toBeGreaterThanOrEqual(8);
    expect(SCALARS.length).toBeGreaterThanOrEqual(8);
    const r = allRenderings(FIELDS);
    FIELDS.forEach(([, k]) => expect(r.filter((x) => x.key === k).length, k).toBeGreaterThanOrEqual(1));
    expect(r.length).toBeGreaterThanOrEqual(36);
    const skipped = FIELDS.flatMap(([, k, v]) => skippedShapesOf(k, v));
    console.log(`[materials guard] ${r.length} renderings of 18 answers searched, ${skipped.length} shapes skipped as too short or exponential, `
      + `${STRINGS.length} capstone labels and names, ${IDS.length} item ids, ${SCALARS.length} distinctive scalars`);
  });

  it('the inventory of swept sources is the declared one', () => {
    expect(sources().panelFiles).toEqual(EXPECTED_SOURCES);
  });

  it('no swept source carries a graded answer, a capstone name, string, item id or scalar', () => {
    const r = allRenderings(FIELDS);
    const found = [];
    sources().texts.forEach(([f, text]) => {
      leaksIn(text, r).forEach((l) => found.push(`${f}: ${l.key} as ${l.shape} ${l.text}`));
      const m = text.match(NAMES);
      if (m) found.push(`${f}: names ${m[0]}`);
      stringsIn(text).forEach((s) => found.push(`${f}: a capstone string "${s}"`));
      idsIn(text).forEach((s) => found.push(`${f}: a capstone item id ${s}`));
      scalarsIn(text).forEach((h) => found.push(`${f}: a capstone scalar ${h}`));
    });
    expect(found).toEqual([]);
  });

  it('NEGATIVE CONTROL: every shape of an answer, a name, a string, an id and a scalar is caught when planted', () => {
    const [, key, v] = FIELDS.find(([, k, x]) => renderingsOf(k, x).some((r) => r.shape === 'printed') && renderingsOf(k, x).some((r) => r.shape === 'full'));
    const shapes = renderingsOf(key, v);
    expect(shapes.map((s) => s.shape)).toContain('full');
    expect(shapes.map((s) => s.shape)).toContain('printed');
    shapes.forEach((s) => {
      expect(leaksIn(`const x = ${s.text};`, allRenderings(FIELDS)).map((l) => l.text)).toContain(s.text);
    });
    expect('<p>Umuchu</p>').toMatch(NAMES);
    expect(stringsIn(`const q = '${INPUTS.OGIDI.label}';`).length).toBe(1);
    expect(idsIn(`the item ${IDS[0]} here`)).toEqual([IDS[0]]);
    expect(scalarsIn(`const v = ${SCALARS[0]};`)).toEqual([SCALARS[0]]);
  });

  it('this suite names no path under /root', () => {
    const me = fs.readFileSync(fileURLToPath(import.meta.url), 'utf8');
    expect(me.split('\n').filter((l) => /['"`]\/root\//.test(l))).toEqual([]);
  });
});
