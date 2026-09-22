// A PANEL, LESSON OR BRIEF MAY NOT PRINT A GRADED CAPSTONE ANSWER.
//
// W5b (FOLLOW-ON-PROGRAMME.md section 3, pick A) moved all three reservoircalc
// capstones off the Ekene teaching case (the 1560 m contact, the 1800 m fault,
// the six teaching porosities), which the panels open on and the lessons work,
// onto a case of its own that the brief states and the learner types in:
// docs/graded-field-audit/w5/reservoircalc.json. The gate is shared with every
// W5b re-case and is documented in ../w5CaseGuard.js.
import { describe, it, expect } from 'vitest';
import { defineCaseGuard, loadSpec } from '../w5CaseGuard.js';
import { compute } from '../../../../../docs/graded-field-audit/w5b/reservoircalc.keys.mjs';

const spec = loadSpec('reservoircalc');

defineCaseGuard({
  describe,
  it,
  expect,
  course: 'reservoircalc',
  spec,
  compute,
  panels: import.meta.glob('./*Explorer.jsx', { eager: true }),
  sources: spec.sources,
  capstoneLessons: spec.capstone_lessons,
});
