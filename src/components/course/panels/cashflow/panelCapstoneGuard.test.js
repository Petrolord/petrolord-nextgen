// A PANEL MAY NOT REACH INTO THE CAPSTONE.
//
// The lab's leak gate in cashflowLab.test.js walks the TEACHING exports'
// return values. It says nothing about the PANELS, and the panels import the
// lab directly. The lab exports its whole capstone surface (IKPOTO_*,
// ikpotoRuns, ikpotoCapstoneFields and friends) beside its teaching surface,
// with nothing between them but a comment.
//
// A panel built on any of those would print graded answers to the learner
// sitting the assessment, and every other gate would stay green, because no
// lesson and no bank would have changed. So the guard is on the panel
// SOURCES. It is a grep, deliberately: a runtime check would only catch the
// modes somebody thought to render.
//
// The teaching equivalents exist and are what a panel must use:
//   IKPOTO_*            ->  AKATA, AKATA_PSC_PATCH, AKATA_PIA_PATCH
//   ikpotoRuns          ->  akataLedger / akataUnderPsc / akataUnderPia
//   ikpotoCapstone*     ->  nothing; a panel never needs a graded answer
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as L from './cashflowLab.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));

// The learning page imports the lab directly too, so it is guarded with the
// panels: a graded answer printed in its prose would be as much a leak.
const LEARNING_PAGE = path.resolve(HERE, '../../../../pages/apps/CashflowLearningPage.jsx');

const panelSources = fs
  .readdirSync(HERE)
  .filter((f) => f.endsWith('.jsx'))
  .map((f) => ({ file: f, text: fs.readFileSync(path.join(HERE, f), 'utf8') }))
  .concat([{ file: 'CashflowLearningPage.jsx', text: fs.readFileSync(LEARNING_PAGE, 'utf8') }]);

describe('THE PANEL GUARD: no panel may read the capstone', () => {
  it('there are panels to check, so a rename cannot silently empty this gate', () => {
    expect(panelSources.length).toBeGreaterThanOrEqual(3);
  });

  it('the lab names every capstone export in CAPSTONE_ONLY_EXPORTS, so the grep list cannot go stale', () => {
    const named = Object.keys(L).filter((k) => /ikpoto/i.test(k));
    expect(named.length).toBeGreaterThanOrEqual(10);
    named.forEach((k) => expect(L.CAPSTONE_ONLY_EXPORTS, `${k} is not listed as capstone-only`).toContain(k));
    const exported = Object.keys(L);
    L.CAPSTONE_ONLY_EXPORTS.forEach((k) => expect(exported, `${k} is listed but not exported`).toContain(k));
  });

  panelSources.forEach(({ file, text }) => {
    it(`${file} names no capstone-only export`, () => {
      const hits = L.CAPSTONE_ONLY_EXPORTS.filter((name) => new RegExp(`\\b${name}\\b`).test(text));
      expect(hits, `${file} reaches into the capstone: ${hits.join(', ')}`).toEqual([]);
    });

    it(`${file} names no ikpoto reader and never says the field's name`, () => {
      const hits = [...text.matchAll(/\bikpoto\w*/gi)].map((m) => m[0]);
      expect([...new Set(hits)], `${file} reaches into the capstone`).toEqual([]);
    });

    it(`${file} prints none of the eighteen graded answers`, () => {
      const graded = Object.values(L.ikpotoCapstoneValues())
        .filter((v) => typeof v === 'number' && Number.isFinite(v));
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
