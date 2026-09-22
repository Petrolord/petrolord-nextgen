// THE LEAKAGE GATE FOR A STRIPPED TIER (follow-on programme W5, section 3 pick B).
//
// Pick B keeps a tier's graded keys and removes the places that printed them
// before the learner worked: a walkthrough or recap lesson, a page intro, and a
// panel whose opening view sat on the capstone case. A course's
// capstoneLeak.test.jsx builds on this module to prove, for each stripped tier:
//
//   1. no lesson of the course prints a graded answer (any tier's lessons,
//      because module 1 of every tier is open to every enrolled learner);
//   2. no panel of the course, rendered exactly as the host renders it (no
//      props), prints a graded answer on first render;
//   3. whatever else the course names (a page intro) prints none either;
//   4. the tier's capstone lesson no longer carries the W1 open-book note.
//
// The graded answers are the lab's capstoneValues(), which run the vendored
// engine; the tolerances are the published ones. Nothing here restates a
// formula or types an answer.
//
// A printed number collides with a graded answer when it sits within the
// grader's own band of it, in any of the shiftings a unit change produces
// (Pa read as MPa, m read as mm or um, a fraction read as a percent), and with
// either sign, because a learner who reads 0.6069 types -0.6069 if the brief
// says the answer is negative. That is the leak the programme defines: a
// number the learner can copy and pass with.
//
// Plain JavaScript with no test runner import, so each course's gate and its
// negative controls share it.

/**
 * The unit shiftings a printed number can carry and still be the answer, by
 * the graded unit: Pa read as kPa or MPa, m read as mm or um, a fraction read
 * as a percent and back. A ratio published with unit '-' (a separation
 * factor) is read only as itself: no panel prints it in milli-units or as a
 * percent, and shifting it would only flag unrelated coordinates. A unitless
 * fraction ('') may be printed as a percent.
 */
export const SHIFTS_BY_UNIT = Object.freeze({
  Pa: [['as graded', 1], ['kPa', 1e-3], ['MPa', 1e-6]],
  m: [['as graded', 1], ['mm', 1e3], ['um', 1e6]],
  percent: [['as graded', 1], ['fraction', 0.01]],
  '': [['as graded', 1], ['percent', 100]],
});
export const shiftsFor = (unit) => SHIFTS_BY_UNIT[unit] || [['as graded', 1]];

/**
 * Graded targets from the engine's values and the published fields.
 * `values` is { key: number } from the lab's capstoneValues(); `fields` is the
 * published list ({ key, tol, unit }). Every published key must have a finite
 * engine value, so a renamed key cannot silently drop out of the sweep.
 */
export const gradedTargets = ({ tier, values, fields }) => fields.flatMap(({ key, tol, unit }) => {
  const value = values[key];
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`${tier}/${key}: the engine returns no finite value for a graded key`);
  }
  return shiftsFor(unit).map(([tag, factor]) => ({
    tier, key, tag, value: value * factor, band: Math.abs(Number(tol)) * factor,
  }));
});

const NUMBER = /[-−]?(?:\d{1,3}(?:,\d{3})+|\d+)?(?:\.\d+)?(?:[eE][-+]?\d+)?/g;

/** Every number a reader sees in a text, thousands separators and a Unicode minus included. */
export const readNumbers = (text) => (String(text).match(NUMBER) || [])
  .filter((s) => /\d/.test(s))
  .map((s) => ({ text: s, value: Number(s.replace(/,/g, '').replace('−', '-')) }))
  .filter((n) => Number.isFinite(n.value));

/** The visible text of rendered markup: tags become spaces so numbers never fuse. */
export const htmlText = (html) => String(html)
  .replace(/<[^>]*>/g, ' ')
  .replace(/&nbsp;/g, ' ')
  .replace(/&minus;|&#x2212;|&#8722;/g, '−')
  .replace(/&amp;/g, '&');

/** One line per printed number that a learner could copy and pass with. */
export const leakHits = (text, targets, where = 'text') => {
  const hits = [];
  readNumbers(text).forEach((n) => {
    targets.forEach((t) => {
      if (Math.abs(Math.abs(n.value) - Math.abs(t.value)) <= t.band) {
        hits.push(`${where}: "${n.text}" passes ${t.tier}/${t.key} (${t.tag})`);
      }
    });
  });
  return [...new Set(hits)];
};

/** The W1 open-book note (D4 C) as it heads a capstone lesson and a brief. */
export const OPEN_BOOK = /Open book/;
