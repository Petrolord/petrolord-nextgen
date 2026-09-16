// A PANEL MAY NOT REACH INTO THE CAPSTONE.
//
// The lab's leak gate in fiscalLab.test.js walks the TEACHING exports' return
// values. It says nothing about the PANELS, and the panels import the lab
// directly. The lab exports its whole capstone surface (URUAN, URUAN_CONCESSION,
// URUAN_PSC, uruanRuns, uruanCapstoneFields and friends) beside its teaching
// surface, with nothing between them but a comment.
//
// A panel built on any of those would print graded answers to the learner
// sitting the assessment, and every other gate would stay green, because no
// lesson and no bank would have changed. So the guard is on the panel SOURCES.
// It is a grep, deliberately: a runtime check would only catch the modes
// somebody thought to render.
//
// The teaching equivalents exist and are what a panel must use:
//   URUAN                 ->  ODIDI, DEFAULT_PROJECT, TEST_PROJECT
//   URUAN_CONCESSION      ->  the usa___gulf_of_mexico template
//   URUAN_PSC             ->  the nigeria___pia__2021 template
//   uruanRuns             ->  ledger / comparison / priceSweep / capexSweep
//   uruanCapstone*        ->  nothing; a panel never needs a graded answer
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as L from './fiscalLab.js';
import { waveInput } from '../../../../../tools/course-waves/waveInputs.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
// THE WAVE INPUTS. Read from the committed copy under tools/course-waves by
// default, which is what lets this suite run anywhere, CI included. Point it
// at a live wave directory mid-build with NEXTGEN_WAVE_DIR. A missing input
// throws and names itself rather than skipping: see tools/course-waves/waveInputs.mjs.
const WAVE_NAME = 'fiscal';
const FIELDS_JSON = waveInput(WAVE_NAME, 'fields.json');

// The learning page imports the lab directly too, so it is guarded with the
// panels: a graded answer printed in its prose would be as much a leak.
const LEARNING_PAGE = path.resolve(HERE, '../../../../pages/apps/FiscalLearningPage.jsx');

const panelSources = fs
  .readdirSync(HERE)
  .filter((f) => f.endsWith('.jsx'))
  .map((f) => ({ file: f, text: fs.readFileSync(path.join(HERE, f), 'utf8') }))
  .concat([{ file: 'FiscalLearningPage.jsx', text: fs.readFileSync(LEARNING_PAGE, 'utf8') }]);

describe('THE PANEL GUARD: no panel may read the capstone', () => {
  it('there are panels to check, so a rename cannot silently empty this gate', () => {
    expect(panelSources.length).toBeGreaterThanOrEqual(5);
    expect(panelSources.map((s) => s.file).sort()).toEqual([
      'ComparisonExplorer.jsx', 'FiscalDefinitions.jsx', 'FiscalLearningPage.jsx', 'InstrumentExplorer.jsx', 'RegimeExplorer.jsx',
    ]);
  });

  it('the lab names every capstone export in CAPSTONE_ONLY_EXPORTS, so the grep list cannot go stale', () => {
    const named = Object.keys(L).filter((k) => /uruan/i.test(k));
    expect(named.length).toBeGreaterThanOrEqual(8);
    named.forEach((k) => expect(L.CAPSTONE_ONLY_EXPORTS, `${k} is not listed as capstone-only`).toContain(k));
    const exported = Object.keys(L);
    L.CAPSTONE_ONLY_EXPORTS.forEach((k) => expect(exported, `${k} is listed but not exported`).toContain(k));
    // Every capstone-only name carries URUAN or uruan, so the grep below cannot
    // collide with an ordinary English word the way a bare "PSC" would.
    L.CAPSTONE_ONLY_EXPORTS.forEach((k) => {
      if (k === 'CAPSTONE_ONLY_EXPORTS') return;
      expect(k, `${k} does not carry the capstone name`).toMatch(/uruan/i);
    });
  });

  panelSources.forEach(({ file, text }) => {
    it(`${file} names no capstone-only export`, () => {
      const hits = L.CAPSTONE_ONLY_EXPORTS.filter((name) => new RegExp(`\\b${name}\\b`).test(text));
      expect(hits, `${file} reaches into the capstone: ${hits.join(', ')}`).toEqual([]);
    });

    it(`${file} names no uruan reader and never says the field's name`, () => {
      const hits = [...text.matchAll(/\buruan\w*/gi)].map((m) => m[0]);
      expect([...new Set(hits)], `${file} reaches into the capstone`).toEqual([]);
    });

    it(`${file} prints none of the eighteen graded answers`, () => {
      // Read from fields.json rather than from the lab, so a panel is checked
      // against what the GRADER holds and not against a derivation that could
      // itself have drifted.
      const graded = JSON.parse(fs.readFileSync(FIELDS_JSON, 'utf8'))
        .map((f) => f[2])
        .filter((v) => typeof v === 'number' && Number.isFinite(v));
      expect(graded).toHaveLength(18);
      // Six significant figures of a graded answer is a leak at any rounding a
      // panel would plausibly print.
      const printed = graded
        .map((v) => v.toPrecision(6).replace(/0+$/, ''))
        .filter((s) => !s.includes('e'))
        .filter((s) => text.includes(s));
      expect(printed, `${file} prints a graded capstone answer`).toEqual([]);
    });

    it(`${file} carries no em dash, no en dash and no dollar sign`, () => {
      expect(text).not.toMatch(/[–—]/);
      expect(text).not.toMatch(/\$(?!\{)/);
    });
  });
});
