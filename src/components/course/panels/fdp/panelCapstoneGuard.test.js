// A PANEL MAY NOT REACH INTO THE CAPSTONE.
//
// The lab's leak gate in fdpLab.test.js walks the TEACHING exports' return
// values. It says nothing about the PANELS, and the panels import the lab
// directly. The lab exports its whole capstone surface (UKOT_RESERVOIRS,
// UKOT_CONCEPT, MEREN_TASKS, ukotRuns, ukotCapstoneFields and friends) beside
// its teaching surface, with nothing between them but a comment.
//
// A panel built on any of those would print graded answers to the learner
// sitting the assessment, and every other gate would stay green. So the guard
// is on the panel SOURCES, and on the course page, which imports the lab too.
// It is a grep, deliberately: a runtime check would only catch the modes
// somebody thought to render.
//
// The teaching equivalents exist and are what a panel must use:
//   UKOT_RESERVOIRS                      ->  EGINA_RESERVOIRS, reservesPerFluid
//   UKOT_CONCEPT, UKOT_ALTERNATIVE       ->  EGINA_CONCEPTS, conceptsAndCapex
//   UKOT_BASE, UKOT_STRESS               ->  EGINA_SCENARIOS, scenarioValues
//   UKOT_COSTS, UKOT_SCHEDULE            ->  EGINA_COSTS, EGINA_SCHEDULE
//   UKOT_WELLS, UKOT_RIG_RATE            ->  EGINA_WELLS, EGINA_RIG_RATE
//   UKOT_FACILITIES, UKOT_RISKS          ->  EGINA_FACILITIES, EGINA_RISKS
//   MEREN_TASKS, MEREN_AS_OF             ->  ODUDU_TASKS, ODUDU_AS_OF
//   ukotRuns                             ->  the sixteen section readers
//   ukotCapstone*                        ->  nothing; a panel never needs a graded answer
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as L from './fdpLab.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FIELDS_JSON = '/root/ec-wip-fdp/fields.json';
const LEARNING_PAGE = path.resolve(HERE, '../../../../pages/apps/FdpLearningPage.jsx');

const panelSources = fs
  .readdirSync(HERE)
  .filter((f) => f.endsWith('.jsx') && !f.endsWith('.test.jsx'))
  .map((f) => ({ file: f, text: fs.readFileSync(path.join(HERE, f), 'utf8') }))
  .concat([{ file: 'FdpLearningPage.jsx', text: fs.readFileSync(LEARNING_PAGE, 'utf8') }]);

const gradedStrings = () => JSON.parse(fs.readFileSync(FIELDS_JSON, 'utf8'))
  .map((f) => f[2])
  .filter((v) => typeof v === 'number' && Number.isFinite(v))
  .map((v) => v.toPrecision(9).replace(/\.?0+$/, ''))
  .filter((s) => !s.includes('e') && s.includes('.'));

describe('THE PANEL GUARD: no panel may read the capstone', () => {
  it('there are panels to check, so a rename cannot silently empty this gate', () => {
    expect(panelSources.map((s) => s.file).sort()).toEqual([
      'FdpLearningPage.jsx', 'PlanExplorer.jsx', 'ScheduleExplorer.jsx', 'ValueExplorer.jsx',
    ]);
    panelSources.forEach((s) => expect(s.text.length, s.file).toBeGreaterThan(2000));
  });

  it('the lab names every capstone export in CAPSTONE_ONLY_EXPORTS, so the grep list cannot go stale', () => {
    const named = Object.keys(L).filter((k) => /ukot|meren/i.test(k));
    expect(named.length).toBeGreaterThanOrEqual(17);
    named.forEach((k) => expect(L.CAPSTONE_ONLY_EXPORTS, `${k} is not listed as capstone-only`).toContain(k));
    const exported = Object.keys(L);
    L.CAPSTONE_ONLY_EXPORTS.forEach((k) => expect(exported, `${k} is listed but not exported`).toContain(k));
    L.CAPSTONE_ONLY_EXPORTS.forEach((k) => {
      if (k === 'CAPSTONE_ONLY_EXPORTS') return;
      expect(k, `${k} does not carry a capstone name`).toMatch(/ukot|meren/i);
    });
  });

  it('NEGATIVE CONTROL: the grep finds a capstone name and a graded answer when one is planted', () => {
    const graded = gradedStrings();
    expect(graded.length).toBeGreaterThan(5);
    const planted = `import { ukotCapstoneValues } from './fdpLab';\nconst x = ${graded[0]};`;
    expect(L.CAPSTONE_ONLY_EXPORTS.filter((name) => new RegExp(`\\b${name}\\b`).test(planted))).toEqual(['ukotCapstoneValues']);
    expect(graded.filter((s) => planted.includes(s))).toHaveLength(1);
  });

  panelSources.forEach(({ file, text }) => {
    it(`${file} names no capstone-only export`, () => {
      const hits = L.CAPSTONE_ONLY_EXPORTS.filter((name) => new RegExp(`\\b${name}\\b`).test(text));
      expect(hits, `${file} reaches into the capstone: ${hits.join(', ')}`).toEqual([]);
    });

    it(`${file} names no capstone reader and never says a capstone field's name`, () => {
      const hits = [...text.matchAll(/(?:ukot|meren)\w*/gi)].map((x) => x[0]);
      expect([...new Set(hits)], `${file} reaches into the capstone`).toEqual([]);
    });

    it(`${file} prints none of the eighteen graded answers`, () => {
      // Read from fields.json rather than from the lab, so a panel is checked
      // against what the GRADER holds. Only the fields with a decimal part are
      // searched as strings: a bare 74 or 671 sits inside a longer number and
      // means nothing. The whole numbers are covered by the lab's numeric leak
      // gate, which walks every value a panel can reach.
      expect(JSON.parse(fs.readFileSync(FIELDS_JSON, 'utf8'))).toHaveLength(18);
      const printed = gradedStrings().filter((s) => text.includes(s));
      expect(printed, `${file} prints a graded capstone answer`).toEqual([]);
    });

    it(`${file} carries no em dash, no en dash and no dollar sign`, () => {
      expect(text).not.toMatch(/[–—]/);
      expect(text).not.toMatch(/\$(?!\{)/);
    });
  });
});
