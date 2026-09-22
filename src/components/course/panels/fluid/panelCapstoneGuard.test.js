// A PANEL, LESSON OR BRIEF MAY NOT PRINT A GRADED CAPSTONE ANSWER.
//
// W5b (FOLLOW-ON-PROGRAMME.md section 3, pick A) moved all three fluid capstones
// off the teaching cases (the Ekene fluid, Good Oil read on its 100 psig
// optimum test at 220 F with its reported C7+), which the
// panels open on and the lessons work, onto a case of its own that the brief
// states and the learner sets: docs/graded-field-audit/w5/fluid.json. The gate
// is shared with every W5 re-case and is documented in ../w5CaseGuard.js.
import { describe, it, expect } from 'vitest';
import { defineCaseGuard, loadSpec } from '../w5CaseGuard.js';
import { compute } from '../../../../../docs/graded-field-audit/w5b/fluid.keys.mjs';

const spec = loadSpec('fluid');

defineCaseGuard({
  describe,
  it,
  expect,
  course: 'fluid',
  spec,
  compute,
  panels: import.meta.glob('./*Explorer.jsx', { eager: true }),
  sources: spec.sources,
  capstoneLessons: spec.capstone_lessons,
});
