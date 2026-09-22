// A PANEL, LESSON OR BRIEF MAY NOT PRINT A GRADED CAPSTONE ANSWER.
//
// W5b (FOLLOW-ON-PROGRAMME.md section 3, pick A) moved all three dca capstones
// off the teaching booking (the named windows, the 10 stb/d limit, the flood
// start, the E3 + E6 type curve, b 1.2 and the teaching triangle), which the
// panels open on and the lessons work, onto a case of its own that the brief
// states and the learner sets: docs/graded-field-audit/w5/dca.json. The gate
// is shared with every W5 re-case and is documented in ../w5CaseGuard.js.
import { describe, it, expect } from 'vitest';
import { defineCaseGuard, loadSpec } from '../w5CaseGuard.js';
import { compute } from '../../../../../docs/graded-field-audit/w5b/dca.keys.mjs';

const spec = loadSpec('dca');

defineCaseGuard({
  describe,
  it,
  expect,
  course: 'dca',
  spec,
  compute,
  panels: import.meta.glob('./*Explorer.jsx', { eager: true }),
  sources: spec.sources,
  capstoneLessons: spec.capstone_lessons,
});
