// THE H1 CAPSTONE GUARD over everything a learner sees in the app: the teaching
// lab, the three panels, their shared bits and the learning page.
//
// No graded answer in any of the four shapes gradedAnswerGuard.js derives (the
// full double, twelve and nine significant digits, the six decimals the course
// prints), no capstone workplace name, and no capstone hours figure or count
// series. The answers are read from the committed fields.json and the inputs
// from the committed h1_capstone.mjs SOURCE, so this suite needs neither a live
// wave directory nor a path under /root.
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
const PAGE = path.resolve(HERE, '../../../../pages/apps/SafetyStatsLearningPage.jsx');
const EXPECTED_SOURCES = [
  'IntervalsExplorer.jsx', 'RatesExplorer.jsx', 'UChartExplorer.jsx', 'panelBits.jsx', 'safetystatsLab.js',
];
const FIELDS = JSON.parse(fs.readFileSync(waveInput('safetystats', 'fields.json'), 'utf8'));
const CAPSTONE_SRC = fs.readFileSync(waveInput('safetystats', 'h1_capstone.mjs'), 'utf8');

/** The three frozen scenarios, read out of the capstone generator's SOURCE. */
const scenarios = () => {
  const out = {};
  ['OKRIKA', 'BONNY', 'FORCADOS'].forEach((name) => {
    const m = CAPSTONE_SRC.match(new RegExp(`const ${name} = Object\\.freeze\\(\\{([\\s\\S]*?)\\n\\}\\);`));
    if (!m) throw new Error(`cannot read the ${name} scenario out of h1_capstone.mjs`);
    out[name] = m[1];
  });
  return out;
};
const SCEN = scenarios();
const HOURS = Object.values(SCEN).flatMap((body) => [...body.matchAll(/\b(\d{4,})\b/g)].map((m) => Number(m[1])));
const SERIES = Object.values(SCEN).flatMap((body) => [...body.matchAll(/\[([\d, ]+)\]/g)].map((m) => m[1].trim()));
const NAMES = /\b(okrika|bonny|forcados)\b/i;

const sources = () => {
  const panelFiles = fs.readdirSync(HERE).filter((f) => /\.(jsx?|mjs)$/.test(f) && !/\.test\./.test(f)
    && !['gradedTolerance.js', 'gradedAnswerGuard.js'].includes(f)).sort();
  return { panelFiles, texts: [...panelFiles.map((f) => [f, fs.readFileSync(path.join(HERE, f), 'utf8')]), ['SafetyStatsLearningPage.jsx', fs.readFileSync(PAGE, 'utf8')]] };
};
const hoursIn = (text) => HOURS.filter((h) => new RegExp(`(?<![\\d.])${h}(?![\\d])`).test(text));
const seriesIn = (text) => SERIES.filter((s) => text.includes(s));

describe('THE H1 CAPSTONE GUARD', () => {
  it('reads eighteen answers and the three scenarios, and derives enough to search for', () => {
    expect(FIELDS).toHaveLength(18);
    expect(FIELDS.map((f) => f[1])).toEqual(GRADED_FIELDS.map((f) => f[1]));
    FIELDS.forEach(([, key, , tol]) => expect(tol).toBe(gradedTolerance(key)));
    expect(HOURS.length).toBeGreaterThanOrEqual(25);
    expect(SERIES.length).toBe(4);
    const r = allRenderings(FIELDS);
    expect(r.length).toBeGreaterThanOrEqual(54);
    const skipped = FIELDS.flatMap(([, k, v]) => skippedShapesOf(k, v));
    console.log(`[safetystats guard] ${r.length} renderings of 18 answers searched, ${skipped.length} shapes skipped as too short or exponential, `
      + `${HOURS.length} capstone hours figures and ${SERIES.length} count series`);
  });

  it('the inventory of swept sources is the declared one', () => {
    expect(sources().panelFiles).toEqual(EXPECTED_SOURCES);
  });

  it('no swept source carries a graded answer, a capstone name, an hours figure or a series', () => {
    const r = allRenderings(FIELDS);
    const found = [];
    sources().texts.forEach(([f, text]) => {
      leaksIn(text, r).forEach((l) => found.push(`${f}: ${l.key} as ${l.shape} ${l.text}`));
      const m = text.match(NAMES);
      if (m) found.push(`${f}: names ${m[0]}`);
      hoursIn(text).forEach((h) => found.push(`${f}: capstone hours ${h}`));
      seriesIn(text).forEach((s) => found.push(`${f}: capstone series ${s}`));
    });
    expect(found).toEqual([]);
  });

  it('NEGATIVE CONTROL: every shape of an answer, a name, an hours figure and a series is caught when planted', () => {
    const [, key, v] = FIELDS[9];
    const shapes = renderingsOf(key, v);
    expect(shapes.map((s) => s.shape)).toContain('full');
    expect(shapes.map((s) => s.shape)).toContain('printed');
    shapes.forEach((s) => {
      expect(leaksIn(`const x = ${s.text};`, allRenderings(FIELDS)).map((l) => l.text)).toContain(s.text);
    });
    expect(`<p>Forcados</p>`).toMatch(NAMES);
    expect(hoursIn(`hours: ${HOURS[3]},`)).toEqual([HOURS[3]]);
    expect(seriesIn(`counts: [${SERIES[0]}]`)).toEqual([SERIES[0]]);
  });

  it('this suite names no path under /root', () => {
    const me = fs.readFileSync(fileURLToPath(import.meta.url), 'utf8');
    expect(me.split('\n').filter((l) => /['"`]\/root\//.test(l))).toEqual([]);
  });
});
