// THE PETROPHYSICS ASSOCIATE CAPSTONE MUST GRADE WHAT THE LEARNER TYPED.
//
// B5 finding 4: the beginner submit sent capstoneAnswers(workflow), six
// figures computed from the pre-filled parameters, so one click on "Submit
// for grading" passed the Associate capstone without a figure being read.
// Every tier now sends buildCapstoneAnswers(capstone.fields, answers).
//
// The page cannot be mounted here (the test run has no DOM), so the proof
// reads the submit handler itself. The control runs the same check on the
// handler as it shipped before the fix and must fail, so the check can fail.
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = fs.readFileSync(path.join(HERE, 'PetrophysicsLearningPage.jsx'), 'utf8');

// The body of `const submit = async () => { ... };` up to the call that
// sends it to the grader.
const submitBody = (src) => {
  const start = src.indexOf('const submit = async () => {');
  expect(start, 'submit handler not found').toBeGreaterThan(-1);
  const end = src.indexOf('submitCapstone(', start);
  expect(end, 'submitCapstone call not found').toBeGreaterThan(start);
  return src.slice(start, end);
};

// What a typed-answers handler must look like.
const submitsTypedAnswers = (src) => {
  const body = submitBody(src);
  return /buildCapstoneAnswers\(capstone\?\.fields, answers\)/.test(body)
    && !/workflow|capstoneAnswers|params/.test(body)
    && !/tier === 'beginner'/.test(body);
};

// The handler as it shipped before this fix (main b9e3683b9).
const BEFORE = `
  const submit = async () => {
    if (!workflow) return;
    setSubmitting(true);
    try {
      const payload = tier === 'beginner'
        ? capstoneAnswers(workflow)
        : Object.fromEntries((capstone?.fields || []).map((f) => [
            f.key, answers[f.key] === '' || answers[f.key] === undefined ? null : Number(answers[f.key]),
          ]));
      const res = await submitCapstone(APP, tier, payload);
`;

describe('the petrophysics capstone submit', () => {
  it('sends the typed answers on every tier, beginner included', () => {
    expect(submitsTypedAnswers(SRC)).toBe(true);
  });

  it('control: the pre-fix handler, which sent computed answers, fails the same check', () => {
    expect(submitsTypedAnswers(BEFORE)).toBe(false);
  });

  it('no longer imports a helper that maps the workflow onto the capstone fields', () => {
    expect(SRC).not.toMatch(/import[^;]*\bcapstoneAnswers\b[^;]*from/);
  });

  it('renders the answer boxes in the beginner capstone card, beside its Submit button', () => {
    const beginner = SRC.slice(SRC.indexOf("{tier === 'beginner' && ("));
    const card = beginner.slice(beginner.indexOf('{capstoneOpen && ('));
    const button = card.indexOf('<Button onClick={submit}');
    expect(button).toBeGreaterThan(-1);
    expect(card.slice(0, button)).toMatch(/\{answerBoxes\}/);
    // The boxes are typed, never pre-filled from the workflow.
    const boxes = SRC.slice(SRC.indexOf('const answerBoxes = ('), SRC.indexOf('const submit = async'));
    expect(boxes).toMatch(/value=\{answers\[f\.key\] \?\? ''\}/);
    expect(boxes).not.toMatch(/workflow/);
  });
});
