// A PANEL, LESSON OR BRIEF MAY NOT PRINT A GRADED CAPSTONE ANSWER.
//
// W5b (FOLLOW-ON-PROGRAMME.md section 3, pick A) moved all three sim capstones
// off the committed Ekene deck (regional mean 1570.026311 m, contact 1560 m,
// the EK6-ST toe, the NG5 booking, the RC2 fluid), which the panels open on and
// the lessons work, onto a deck rebuilt at a setting of its own that the brief
// states and the learner types in: docs/graded-field-audit/w5/sim.json. The
// gate is shared with every W5 re-case and is documented in ../w5CaseGuard.js.
import { describe, it, expect } from 'vitest';
import { defineCaseGuard, loadSpec } from '../w5CaseGuard.js';
import { compute } from '../../../../../docs/graded-field-audit/w5b/sim.keys.mjs';

const spec = loadSpec('sim');

defineCaseGuard({
  describe,
  it,
  expect,
  course: 'sim',
  spec,
  compute,
  panels: import.meta.glob('./*Explorer.jsx', { eager: true }),
  sources: spec.sources,
  capstoneLessons: spec.capstone_lessons,
});
