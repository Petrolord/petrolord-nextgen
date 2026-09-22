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

// HD 2026-09-22 (engines #235, the labTune Bo fallback fix) moved the advanced
// tier's tuned values: the live fields are docs/graded-field-audit/hd/fluid/
// fields.json (20261030d_hd_fluid.sql); the W5b file stays the W5b state.
const spec = loadSpec('fluid', 'docs/graded-field-audit/hd/fluid/fields.json');

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
