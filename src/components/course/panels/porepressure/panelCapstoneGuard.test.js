// A PANEL, LESSON OR BRIEF MAY NOT PRINT A GRADED CAPSTONE ANSWER.
//
// W5b (FOLLOW-ON-PROGRAMME.md section 3, pick A) moved all three porepressure
// capstones off the golden well's header setting, which the panels open on
// and the lessons work, onto a setting of its own (water depth, pore fluid,
// exponent, Poisson's ratio, threshold, fit matrix, Bowers inputs) that the
// brief states and the learner types in: docs/graded-field-audit/w5/porepressure.json.
// The gate is shared with every W5 re-case and is documented in ../w5CaseGuard.js.
import { describe, it, expect } from 'vitest';
import { defineCaseGuard, loadSpec } from '../w5CaseGuard.js';
import { compute } from '../../../../../docs/graded-field-audit/w5b/porepressure.keys.mjs';

const spec = loadSpec('porepressure');

defineCaseGuard({
  describe,
  it,
  expect,
  course: 'porepressure',
  spec,
  compute,
  panels: import.meta.glob('./*Explorer.jsx', { eager: true }),
  sources: spec.sources,
  capstoneLessons: spec.capstone_lessons,
});
