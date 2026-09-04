// A PANEL MAY NOT REACH INTO THE CAPSTONE.
//
// The lab's leak gate in nodalLab.test.js checks digestText(), the file lesson
// writers read. It says nothing about the PANELS, and the panels import the lab
// directly. The lab exports its whole capstone surface (CAP, capstoneValues,
// every nembe* reader) beside its teaching surface, with nothing between them.
//
// Two of the capstone-only readers are the ones a panel author reaches for
// first, because they are the only functions that do the thing the brief asks
// for: columnTruncationTable() is the side-by-side gravity against friction
// truncation, and liftGasVsAverageTz() is the second-opinion comparison. Both
// run the CAPSTONE's columns. A panel built on either would print graded
// answers to the learner sitting the assessment, and every existing gate would
// stay green, because no lesson and no bank would have changed.
//
// So the guard is on the panel SOURCES. It is a grep, deliberately: a runtime
// check would only catch the modes somebody thought to render.
//
// The teaching equivalents exist and are what a panel must use:
//   columnTruncationTable  ->  teachingColumnTruncationTable
//   nembe* readers         ->  the well* readers over TEACHING_WELLS
//   searchDeadWellhead     ->  wellPwhSweep / wellPwhSweepDetail
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));

// Every export of nodalLab.js that is built on the NEMBE-14 capstone's own
// conditions. Anything here is for the grader, the lab's own tests and the
// migration headers, and for nothing that a learner can see.
const CAPSTONE_ONLY = [
  'CAP',
  'NEMBE_LABEL',
  'NEMBE_FORWARD_PRESSURES',
  'NEMBE_INVERSE_RATES',
  'NEMBE_MIXTURE_DENSITY_LB_FT3',
  'CAPSTONE_TIERS',
  'CAPSTONE_TOLERANCES',
  'capstoneValues',
  'capstoneDigest',
  'capstoneDigestText',
  'columnTruncationTable',
  'liftGasVsAverageTz',
  'searchDeadWellhead',
];

const panelSources = fs
  .readdirSync(HERE)
  .filter((f) => f.endsWith('.jsx'))
  .map((f) => ({ file: f, text: fs.readFileSync(path.join(HERE, f), 'utf8') }));

describe('THE PANEL GUARD: no panel may read the capstone', () => {
  it('there are panels to check, so a rename cannot silently empty this gate', () => {
    expect(panelSources.length).toBeGreaterThanOrEqual(3);
  });

  panelSources.forEach(({ file, text }) => {
    it(`${file} names no capstone-only export`, () => {
      const hits = CAPSTONE_ONLY.filter((name) =>
        new RegExp(`\\b${name}\\b`).test(text));
      expect(hits, `${file} reaches into the capstone: ${hits.join(', ')}`).toEqual([]);
    });

    it(`${file} names no nembe reader`, () => {
      const hits = [...text.matchAll(/\bnembe[A-Z]\w*/g)].map((m) => m[0]);
      expect([...new Set(hits)], `${file} reaches into the capstone`).toEqual([]);
    });

    it(`${file} prints none of the eighteen graded answers`, async () => {
      const L = await import('./nodalLab.js');
      const graded = Object.values(L.capstoneValues())
        .filter((v) => typeof v === 'number' && Number.isFinite(v));
      // Six significant figures of a graded answer is a leak at any rounding a
      // panel would plausibly print.
      const printed = graded
        .map((v) => v.toPrecision(6).replace(/0+$/, ''))
        .filter((s) => !s.includes('e'))
        .filter((s) => text.includes(s));
      expect(printed, `${file} prints a graded capstone answer`).toEqual([]);
    });
  });
});
