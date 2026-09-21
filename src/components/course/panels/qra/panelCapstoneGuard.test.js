// THE H5 CAPSTONE GUARD over everything a learner sees in the app: the teaching
// lab, the three panels, their shared bits and the learning page.
//
// No graded answer in any of the four shapes gradedAnswerGuard.js derives (the
// full double, twelve and nine significant digits, the decimals the course
// prints the class to), no capstone facility name, and no DISTINCTIVE capstone
// input. The answers are read from the committed fields.json and the inputs
// from the committed h5_capstone.mjs SOURCE, so this suite needs neither a live
// wave directory nor a path under /root.
//
// A DISTINCTIVE INPUT is the same thing the wave's gate_capstone_leak.mjs calls
// one: a number with two or more significant figures, or a whole number of
// 1000 or more, that is not a published value every QRA uses (one year in
// hours, the two HSE VPFs, the checklist and R2P2 rates, the checklist injury
// values). A probability like 0.5 is in every tree and fingerprints nothing.
//
// THE INVENTORY IS DECLARED. A renamed or added source fails the listing test
// instead of quietly dropping out of the sweep. Every shape is PLANTED and
// caught, so a guard that matched nothing could not pass.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { waveInput } from '../../../../../tools/course-waves/waveInputs.mjs';
import { allRenderings, leaksIn, renderingsOf, skippedShapesOf } from './gradedAnswerGuard.js';
import { GRADED_FIELDS, gradedTolerance } from './gradedTolerance.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PAGE = path.resolve(HERE, '../../../../pages/apps/QraLearningPage.jsx');
const EXPECTED_SOURCES = [
  'AlarpExplorer.jsx', 'EventTreeExplorer.jsx', 'SocietalExplorer.jsx', 'panelBits.jsx', 'qraLab.js',
];
const FIELDS = JSON.parse(fs.readFileSync(waveInput('qra', 'fields.json'), 'utf8'));
const CAPSTONE_SRC = fs.readFileSync(waveInput('qra', 'h5_capstone.mjs'), 'utf8');

/** The three frozen facilities, read out of the capstone generator's SOURCE. */
const scenarios = () => {
  const out = {};
  ['UKPOKITI', 'OGINI', 'EBUGHU'].forEach((name) => {
    const m = CAPSTONE_SRC.match(new RegExp(`const ${name} = Object\\.freeze\\(\\{([\\s\\S]*?)\\n\\}\\);`));
    if (!m) throw new Error(`cannot read the ${name} facility out of h5_capstone.mjs`);
    out[name] = m[1];
  });
  return out;
};
const SCEN = scenarios();
const GENERIC = new Set([8760, 1336800, 1000000, 0.015, 0.035, 0.06, 0.04, 20500, 300]);
const sigFigs = (v) => Math.abs(v).toExponential().split('e')[0].replace('.', '').replace(/^0+/, '').replace(/0+$/, '').length;
const INPUTS = [...new Set(Object.values(SCEN).flatMap((body) => [...body.matchAll(/:\s*(-?\d+(?:\.\d+)?(?:e-?\d+)?)\b/g)]
  .map((m) => Number(m[1]))))]
  .filter((v) => Number.isFinite(v) && v !== 0 && !GENERIC.has(v) && (Number.isInteger(v) ? v >= 1000 : sigFigs(v) >= 2));
const spellings = (v) => [...new Set([String(v), v.toExponential()])];
const NAMES = /\b(ukpokiti|ogini|ebughu)\b/i;

const sources = () => {
  const panelFiles = fs.readdirSync(HERE).filter((f) => /\.(jsx?|mjs)$/.test(f) && !/\.test\./.test(f)
    && !['gradedTolerance.js', 'gradedAnswerGuard.js'].includes(f)).sort();
  return { panelFiles, texts: [...panelFiles.map((f) => [f, fs.readFileSync(path.join(HERE, f), 'utf8')]), ['QraLearningPage.jsx', fs.readFileSync(PAGE, 'utf8')]] };
};
const inputsIn = (text) => INPUTS.filter((v) => spellings(v)
  .some((s) => new RegExp(`(?<![\\d.])${s.replace(/[.+]/g, (c) => `\\${c}`)}(?![\\d])`, 'i').test(text)));

describe('THE H5 CAPSTONE GUARD', () => {
  it('reads eighteen answers and the three facilities, and derives enough to search for', () => {
    expect(FIELDS).toHaveLength(18);
    expect(FIELDS.map((f) => f[1])).toEqual(GRADED_FIELDS.map((f) => f[1]));
    FIELDS.forEach(([, key, , tol]) => expect(tol).toBe(gradedTolerance(key)));
    expect(INPUTS.length).toBeGreaterThanOrEqual(30);
    const r = allRenderings(FIELDS);
    expect(r.length).toBeGreaterThanOrEqual(36);
    const skipped = FIELDS.flatMap(([, k, v]) => skippedShapesOf(k, v));
    console.log(`[qra guard] ${r.length} renderings of 18 answers searched, ${skipped.length} shapes skipped as too short or exponential, `
      + `${INPUTS.length} distinctive capstone inputs`);
  });

  it('the inventory of swept sources is the declared one', () => {
    expect(sources().panelFiles).toEqual(EXPECTED_SOURCES);
  });

  it('no swept source carries a graded answer, a capstone name or a distinctive capstone input', () => {
    const r = allRenderings(FIELDS);
    const found = [];
    sources().texts.forEach(([f, text]) => {
      leaksIn(text, r).forEach((l) => found.push(`${f}: ${l.key} as ${l.shape} ${l.text}`));
      const m = text.match(NAMES);
      if (m) found.push(`${f}: names ${m[0]}`);
      inputsIn(text).forEach((v) => found.push(`${f}: capstone input ${v}`));
    });
    expect(found).toEqual([]);
  });

  it('NEGATIVE CONTROL: every shape of an answer, a name and an input is caught when planted', () => {
    const [, key, v] = FIELDS[9];
    const shapes = renderingsOf(key, v);
    expect(shapes.map((s) => s.shape)).toContain('full');
    expect(shapes.map((s) => s.shape)).toContain('printed');
    shapes.forEach((s) => {
      expect(leaksIn(`const x = ${s.text};`, allRenderings(FIELDS)).map((l) => l.text)).toContain(s.text);
    });
    expect('<p>Ebughu</p>').toMatch(NAMES);
    const freq = INPUTS.find((x) => x < 1e-3);
    expect(freq).toBeDefined();
    expect(inputsIn(`frequencyPerYr: ${freq},`)).toEqual([freq]);
    expect(inputsIn(`a release at ${freq.toExponential()} per year`)).toEqual([freq]);
  });

  it('this suite names no path under /root', () => {
    const me = fs.readFileSync(fileURLToPath(import.meta.url), 'utf8');
    expect(me.split('\n').filter((l) => /['"`]\/root\//.test(l))).toEqual([]);
  });
});
