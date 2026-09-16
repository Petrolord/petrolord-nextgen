// A PANEL MAY NOT REACH INTO THE CAPSTONE.
//
// The lab's leak gate in linesizingLab.test.js walks the TEACHING exports'
// return values. It says nothing about the PANELS, and the panels import the
// lab directly. The lab exports its whole capstone surface (IMO_1, BRASS,
// QUA_IBOE_WALL, imoRuns, imoCapstoneFields and friends) beside its teaching
// surface, with nothing between them but a comment.
//
// A panel built on any of those would print graded answers to the learner
// sitting the assessment, and every other gate would stay green. So the guard
// is on the panel SOURCES, and on the course page, which imports the lab too.
// It is a grep, deliberately: a runtime check would only catch the modes
// somebody thought to render.
//
// The teaching equivalents exist and are what a panel must use:
//   IMO_1                          ->  OGBIA, threeLosses, frictionAndRegime
//   IMO_1_C_FACTOR                 ->  EROSIONAL_C_IDS, erosionalLimit
//   BRASS                          ->  SOKU, transmissionForms, elevationGroup
//   BRASS_CONTRACT_SCFD            ->  SOKU_TARGET_SCFD, outletPressure
//   QUA_IBOE_WALL                  ->  SOKU_WALL, wallCode
//   QUA_IBOE_PIG                   ->  OGBIA_PIG, pigging
//   imoRuns                        ->  the eighteen section readers
//   imoCapstone*                   ->  nothing; a panel never needs a graded answer
//
// THE CAPSTONE NAMES ARE MATCHED CASE-SENSITIVELY AND ON WORD BOUNDARIES. A
// blanket /qua/i would fire on the word "square", which this course says
// constantly (the driving group is a difference of squares, and the bracket
// ceiling is an inlet over a square ROOT). A guard that cries wolf on ordinary
// prose gets disabled, so it is written to match the capstone and nothing else.
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as L from './linesizingLab.js';
import { waveInput } from '../../../../../tools/course-waves/waveInputs.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
// THE WAVE INPUTS. Read from the committed copy under tools/course-waves by
// default, which is what lets this suite run anywhere, CI included. Point it
// at a live wave directory mid-build with NEXTGEN_WAVE_DIR. A missing input
// throws and names itself rather than skipping: see tools/course-waves/waveInputs.mjs.
const WAVE_NAME = 'linesizing';
const FIELDS_JSON = waveInput(WAVE_NAME, 'fields.json');
const LEARNING_PAGE = path.resolve(HERE, '../../../../pages/apps/LineSizingLearningPage.jsx');

const panelSources = fs
  .readdirSync(HERE)
  .filter((f) => f.endsWith('.jsx') && !f.endsWith('.test.jsx'))
  .map((f) => ({ file: f, text: fs.readFileSync(path.join(HERE, f), 'utf8') }))
  .concat([{ file: 'LineSizingLearningPage.jsx', text: fs.readFileSync(LEARNING_PAGE, 'utf8') }]);

const gradedStrings = () => JSON.parse(fs.readFileSync(FIELDS_JSON, 'utf8'))
  .map((f) => f[2])
  .filter((v) => typeof v === 'number' && Number.isFinite(v))
  .map((v) => v.toPrecision(9).replace(/\.?0+$/, ''))
  .filter((s) => !s.includes('e') && s.includes('.'));

/** The capstone lines by name, matched tightly enough not to fire on prose. */
const CAPSTONE_NAME = /\b(?:IMO[-_ ]?1|BRASS|QUA[-_ ]?IBOE)\b/g;

describe('THE PANEL GUARD: no panel may read the capstone', () => {
  it('there are panels to check, so a rename cannot silently empty this gate', () => {
    expect(panelSources.map((s) => s.file).sort()).toEqual([
      'GasLineExplorer.jsx', 'LineSizingLearningPage.jsx', 'LiquidExplorer.jsx', 'WallPigExplorer.jsx',
    ]);
    panelSources.forEach((s) => expect(s.text.length, s.file).toBeGreaterThan(2000));
  });

  it('the lab names every capstone export in CAPSTONE_ONLY_EXPORTS, so the grep list cannot go stale', () => {
    const named = Object.keys(L).filter((k) => /^(?:IMO_|BRASS|QUA_IBOE)/.test(k) || /^imo(?:Runs|Capstone)/.test(k));
    expect(named.length).toBeGreaterThanOrEqual(15);
    named.forEach((k) => expect(L.CAPSTONE_ONLY_EXPORTS, `${k} is not listed as capstone-only`).toContain(k));
    const exported = Object.keys(L);
    L.CAPSTONE_ONLY_EXPORTS.forEach((k) => expect(exported, `${k} is listed but not exported`).toContain(k));
    L.CAPSTONE_ONLY_EXPORTS.forEach((k) => {
      if (k === 'CAPSTONE_ONLY_EXPORTS') return;
      expect(k, `${k} does not carry a capstone name`).toMatch(/^(?:IMO_|BRASS|QUA_IBOE|imoRuns|imoCapstone)/);
    });
  });

  it('NEGATIVE CONTROL: the grep finds a capstone name and a graded answer when one is planted', () => {
    const graded = gradedStrings();
    expect(graded.length).toBeGreaterThan(5);
    const planted = `import { imoCapstoneValues } from './linesizingLab';\nconst x = ${graded[0]};`;
    expect(L.CAPSTONE_ONLY_EXPORTS.filter((name) => new RegExp(`\\b${name}\\b`).test(planted))).toEqual(['imoCapstoneValues']);
    expect(graded.filter((s) => planted.includes(s))).toHaveLength(1);
    // And the name grep fires on each capstone line, while ordinary prose the
    // course actually writes does not trip it.
    expect('the BRASS trunk'.match(CAPSTONE_NAME)).toEqual(['BRASS']);
    expect('the QUA IBOE export line'.match(CAPSTONE_NAME)).toEqual(['QUA IBOE']);
    expect('the IMO-1 transfer line'.match(CAPSTONE_NAME)).toEqual(['IMO-1']);
    expect('the inlet over the square root of the difference of squares'.match(CAPSTONE_NAME)).toBeNull();
  });

  panelSources.forEach(({ file, text }) => {
    it(`${file} names no capstone-only export`, () => {
      const hits = L.CAPSTONE_ONLY_EXPORTS.filter((name) => new RegExp(`\\b${name}\\b`).test(text));
      expect(hits, `${file} reaches into the capstone: ${hits.join(', ')}`).toEqual([]);
    });

    it(`${file} never says a capstone line's name`, () => {
      const hits = text.match(CAPSTONE_NAME) || [];
      expect([...new Set(hits)], `${file} reaches into the capstone`).toEqual([]);
    });

    it(`${file} prints none of the eighteen graded answers`, () => {
      // Read from fields.json rather than from the lab, so a panel is checked
      // against what the GRADER holds. Only the fields with a decimal part are
      // searched as strings: a bare 100 or 250 sits inside a longer number and
      // means nothing. Those are covered by the lab's numeric leak gate, which
      // walks every number a panel can reach.
      expect(JSON.parse(fs.readFileSync(FIELDS_JSON, 'utf8'))).toHaveLength(18);
      const printed = gradedStrings().filter((s) => text.includes(s));
      expect(printed, `${file} prints a graded capstone answer`).toEqual([]);
    });

    it(`${file} carries no em dash and no en dash`, () => {
      expect(text).not.toMatch(/[–—]/);
    });
  });
});
