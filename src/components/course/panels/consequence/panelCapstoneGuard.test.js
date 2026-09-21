// THE H4 CAPSTONE GUARD over everything a learner sees in the app: the teaching
// lab, the three panels, their shared bits and the learning page.
//
// No graded answer in any of the four shapes gradedAnswerGuard.js derives (the
// full double, twelve and nine significant digits, the decimals the course
// prints the class to), no capstone facility name, and no DISTINCTIVE capstone
// input. The answers are read from the committed fields.json and the inputs
// from the committed h4_capstone.mjs SOURCE, so this suite needs neither a live
// wave directory nor a path under /root.
//
// A DISTINCTIVE INPUT is the same thing the wave's gate_capstone_leak.mjs calls
// one: a number with two or more significant figures, or a whole number of
// 1000 or more, that is not a value every consequence study uses (the Yellow
// Book sharp orifice coefficient, one atmosphere, the density of air, 15 C and
// 25 C, the viscosity of air, and the molar masses of hydrogen sulphide and
// ammonia). Those fingerprint nothing.
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
const PAGE = path.resolve(HERE, '../../../../pages/apps/ConsequenceLearningPage.jsx');
const EXPECTED_SOURCES = [
  'FireExplorer.jsx', 'HarmExplorer.jsx', 'ReleaseExplorer.jsx', 'consequenceLab.js', 'panelBits.jsx',
];
const FIELDS = JSON.parse(fs.readFileSync(waveInput('consequence', 'fields.json'), 'utf8'));
const CAPSTONE_SRC = fs.readFileSync(waveInput('consequence', 'h4_capstone.mjs'), 'utf8');

/** The three frozen scenarios, read out of the capstone generator's SOURCE. */
const scenarios = () => {
  const out = {};
  ['OKAN', 'YOKRI', 'PENNINGTON'].forEach((name) => {
    const m = CAPSTONE_SRC.match(new RegExp(`const ${name} = Object\\.freeze\\(\\{([\\s\\S]*?)\\n\\}\\);`));
    if (!m) throw new Error(`cannot read the ${name} scenario out of h4_capstone.mjs`);
    out[name] = m[1];
  });
  return out;
};
const SCEN = scenarios();
const GENERIC = new Set([0.62, 101325, 1.2, 298.15, 288.15, 1.48e-5, 34.08, 17.031]);
const sigFigs = (v) => Math.abs(v).toExponential().split('e')[0].replace('.', '').replace(/^0+/, '').replace(/0+$/, '').length;
const INPUTS = [...new Set(Object.values(SCEN).flatMap((body) => [...body.matchAll(/:\s*(-?\d+(?:\.\d+)?(?:e-?\d+)?)\b/g)]
  .map((m) => Number(m[1]))))]
  .filter((v) => Number.isFinite(v) && v !== 0 && !GENERIC.has(v) && (Number.isInteger(v) ? v >= 1000 : sigFigs(v) >= 2));
const spellings = (v) => [...new Set([String(v), v.toExponential()])];
const NAMES = /\b(okan|yokri|pennington)\b/i;

const sources = () => {
  const panelFiles = fs.readdirSync(HERE).filter((f) => /\.(jsx?|mjs)$/.test(f) && !/\.test\./.test(f)
    && !['gradedTolerance.js', 'gradedAnswerGuard.js'].includes(f)).sort();
  return { panelFiles, texts: [...panelFiles.map((f) => [f, fs.readFileSync(path.join(HERE, f), 'utf8')]), ['ConsequenceLearningPage.jsx', fs.readFileSync(PAGE, 'utf8')]] };
};
const inputsIn = (text) => INPUTS.filter((v) => spellings(v)
  .some((s) => new RegExp(`(?<![\\d.])${s.replace(/[.+]/g, (c) => `\\${c}`)}(?![\\d])`, 'i').test(text)));

describe('THE H4 CAPSTONE GUARD', () => {
  it('reads eighteen answers and the three scenarios, and derives enough to search for', () => {
    expect(FIELDS).toHaveLength(18);
    expect(FIELDS.map((f) => f[1])).toEqual(GRADED_FIELDS.map((f) => f[1]));
    FIELDS.forEach(([, key, , tol]) => expect(tol).toBe(gradedTolerance(key)));
    expect(INPUTS.length).toBeGreaterThanOrEqual(20);
    const r = allRenderings(FIELDS);
    expect(r.length).toBeGreaterThanOrEqual(36);
    const skipped = FIELDS.flatMap(([, k, v]) => skippedShapesOf(k, v));
    console.log(`[consequence guard] ${r.length} renderings of 18 answers searched, ${skipped.length} shapes skipped as too short or exponential, `
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
    expect('<p>Yokri</p>').toMatch(NAMES);
    const head = INPUTS.find((x) => x > 4 && x < 5);
    expect(head).toBeDefined();
    expect(inputsIn(`liquidHeadM: ${head},`)).toEqual([head]);
    expect(inputsIn(`a head of ${head.toExponential()} m`)).toEqual([head]);
  });

  it('this suite names no path under /root', () => {
    const me = fs.readFileSync(fileURLToPath(import.meta.url), 'utf8');
    expect(me.split('\n').filter((l) => /['"`]\/root\//.test(l))).toEqual([]);
  });
});
