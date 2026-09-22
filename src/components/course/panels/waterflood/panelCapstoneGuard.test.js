// A PANEL, LESSON OR BRIEF MAY NOT PRINT A GRADED CAPSTONE ANSWER.
//
// W5b (FOLLOW-ON-PROGRAMME.md section 3, pick A) moved all three waterflood capstones
// off the teaching case (the frozen factor set, the fixture allocation, the
// full surveillance record, the planted layers and the design forecast), which the
// panels open on and the lessons work, onto a case of its own that the brief
// states and the learner sets: docs/graded-field-audit/w5/waterflood.json. The gate
// is shared with every W5 re-case and is documented in ../w5CaseGuard.js.
import { describe, it, expect } from 'vitest';
import { defineCaseGuard, loadSpec } from '../w5CaseGuard.js';
import { compute } from '../../../../../docs/graded-field-audit/w5b/waterflood.keys.mjs';

const spec = loadSpec('waterflood');

defineCaseGuard({
  describe,
  it,
  expect,
  course: 'waterflood',
  spec,
  compute,
  panels: import.meta.glob('./*Explorer.jsx', { eager: true }),
  sources: spec.sources,
  capstoneLessons: spec.capstone_lessons,
});
