// A PANEL MAY NOT REACH INTO THE CAPSTONE.
//
// The lab's leak gate in separationLab.test.js walks the TEACHING exports'
// return values. It says nothing about the PANELS, and the panels import the
// lab directly. The lab exports its whole capstone surface (EJULEBE_1,
// ODEAMA_FLARE, ADANGA_ITEMS, ejulebeRuns, ejulebeCapstoneFields and friends)
// beside its teaching surface, with nothing between them but a comment.
//
// A panel built on any of those would print graded answers to the learner
// sitting the assessment, and every other gate would stay green. So the guard
// is on the panel SOURCES, and on the course page, which imports the lab too.
// It is a grep, deliberately: a runtime check would only catch the modes
// somebody thought to render.
//
// The teaching equivalents exist and are what a panel must use:
//   EJULEBE_1                      ->  ABANA_1, gasAtConditions, verticalVessel
//   EJULEBE_2                      ->  ABANA_2, twoLengths, gasCapacity
//   EJULEBE_SLUG, EJULEBE_FINGERS  ->  ABANA_SLUG, ABANA_FINGERS, slugCatchers
//   EJULEBE_3                      ->  AGBAMI, threePhaseSplit, dropletsAndVerdicts
//   EJULEBE_4                      ->  ABANA_1_SWEEP, AGBAMI_SWEEP, vesselFamily
//   ODEAMA_FLARE, ODEAMA_POOL      ->  ERHA_FLARE, ERHA_POOL, distancesAndSetbacks
//   ADANGA_ITEMS, ADANGA_SOURCES   ->  ERHA_ITEMS, ERHA_GHOST_SOURCE, stationJudged
//   ejulebeRuns                    ->  the eighteen section readers
//   ejulebeCapstone*               ->  nothing; a panel never needs a graded answer
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as L from './separationLab.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FIELDS_JSON = '/root/fc-wip-separation/fields.json';
const LEARNING_PAGE = path.resolve(HERE, '../../../../pages/apps/SeparationLearningPage.jsx');

const panelSources = fs
  .readdirSync(HERE)
  .filter((f) => f.endsWith('.jsx') && !f.endsWith('.test.jsx'))
  .map((f) => ({ file: f, text: fs.readFileSync(path.join(HERE, f), 'utf8') }))
  .concat([{ file: 'SeparationLearningPage.jsx', text: fs.readFileSync(LEARNING_PAGE, 'utf8') }]);

const gradedStrings = () => JSON.parse(fs.readFileSync(FIELDS_JSON, 'utf8'))
  .map((f) => f[2])
  .filter((v) => typeof v === 'number' && Number.isFinite(v))
  .map((v) => v.toPrecision(9).replace(/\.?0+$/, ''))
  .filter((s) => !s.includes('e') && s.includes('.'));

describe('THE PANEL GUARD: no panel may read the capstone', () => {
  it('there are panels to check, so a rename cannot silently empty this gate', () => {
    expect(panelSources.map((s) => s.file).sort()).toEqual([
      'LayoutExplorer.jsx', 'SeparationLearningPage.jsx', 'SeparatorExplorer.jsx', 'SlugExplorer.jsx',
    ]);
    panelSources.forEach((s) => expect(s.text.length, s.file).toBeGreaterThan(2000));
  });

  it('the lab names every capstone export in CAPSTONE_ONLY_EXPORTS, so the grep list cannot go stale', () => {
    const named = Object.keys(L).filter((k) => /ejulebe|odeama|adanga/i.test(k));
    expect(named.length).toBeGreaterThanOrEqual(15);
    named.forEach((k) => expect(L.CAPSTONE_ONLY_EXPORTS, `${k} is not listed as capstone-only`).toContain(k));
    const exported = Object.keys(L);
    L.CAPSTONE_ONLY_EXPORTS.forEach((k) => expect(exported, `${k} is listed but not exported`).toContain(k));
    L.CAPSTONE_ONLY_EXPORTS.forEach((k) => {
      if (k === 'CAPSTONE_ONLY_EXPORTS') return;
      expect(k, `${k} does not carry a capstone name`).toMatch(/ejulebe|odeama|adanga/i);
    });
  });

  it('NEGATIVE CONTROL: the grep finds a capstone name and a graded answer when one is planted', () => {
    const graded = gradedStrings();
    expect(graded.length).toBeGreaterThan(5);
    const planted = `import { ejulebeCapstoneValues } from './separationLab';\nconst x = ${graded[0]};`;
    expect(L.CAPSTONE_ONLY_EXPORTS.filter((name) => new RegExp(`\\b${name}\\b`).test(planted))).toEqual(['ejulebeCapstoneValues']);
    expect(graded.filter((s) => planted.includes(s))).toHaveLength(1);
  });

  panelSources.forEach(({ file, text }) => {
    it(`${file} names no capstone-only export`, () => {
      const hits = L.CAPSTONE_ONLY_EXPORTS.filter((name) => new RegExp(`\\b${name}\\b`).test(text));
      expect(hits, `${file} reaches into the capstone: ${hits.join(', ')}`).toEqual([]);
    });

    it(`${file} names no capstone reader and never says a capstone field's name`, () => {
      const hits = [...text.matchAll(/(?:ejulebe|odeama|adanga)\w*/gi)].map((x) => x[0]);
      expect([...new Set(hits)], `${file} reaches into the capstone`).toEqual([]);
    });

    it(`${file} prints none of the eighteen graded answers`, () => {
      // Read from fields.json rather than from the lab, so a panel is checked
      // against what the GRADER holds. Only the fields with a decimal part are
      // searched as strings: a bare 18 or 350 sits inside a longer number and
      // means nothing. Those are covered by the lab's numeric leak gate, which
      // walks every value a panel can reach.
      expect(JSON.parse(fs.readFileSync(FIELDS_JSON, 'utf8'))).toHaveLength(18);
      const printed = gradedStrings().filter((s) => text.includes(s));
      expect(printed, `${file} prints a graded capstone answer`).toEqual([]);
    });

    it(`${file} carries no em dash and no en dash`, () => {
      expect(text).not.toMatch(/[–—]/);
    });
  });
});
