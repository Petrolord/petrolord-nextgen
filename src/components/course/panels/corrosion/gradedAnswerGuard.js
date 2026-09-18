// EVERY STRING SHAPE A GRADED FC9 CAPSTONE ANSWER CAN REACH A LEARNER AS.
//
// WHY THIS FILE EXISTS. The capstone guard a sibling wave shipped string-matched
// its graded answers at NINE SIGNIFICANT DIGITS and at nothing else. That was
// proved insufficient by planting the same answer twice: `2.88817656` was caught
// by the guard, and `2.8881765597102644`, the SAME NUMBER at full double
// precision, went straight past it and was caught only by the lab's separate
// numeric sweep. A panel is far more likely to print the full float, because
// that is what a template literal does to a number with no formatter on it.
//
// So the guard holds every shape, in one place, and the shapes are DERIVED from
// the number rather than listed:
//
//   full      String(v)            what `${value}` prints, the likeliest leak
//   twelve    v.toPrecision(12)    trimmed, a long rounded render
//   nine      v.toPrecision(9)     trimmed, the shape the sibling guard held
//   printed   v.toFixed(dp)        the precision the COURSE prints that class at,
//                                  which is what a learner would be told to quote
//
// A shape is only searched for when it is long enough to mean something. A bare
// integer or a two-figure decimal sits inside longer numbers everywhere, so
// anything under MIN_CHARS or without a decimal point is left to the lab's
// numeric sweep, which walks values rather than text. That boundary is printed by
// the gate rather than assumed, so nobody has to guess what was skipped.
//
// AND TWO THINGS ABOUT THIS WAVE'S ANSWER KEY THAT THE GUARD REPORTS RATHER THAN
// HIDES. Six of the eighteen FC9 values already fit inside nine significant
// digits, so their `nine` shape is the same STRING as a longer one and the
// deduplication below drops the duplicate: the string is still searched, once
// instead of twice. And seven of the eighteen have a nine-digit shape that is a
// PREFIX of their own full double, so a nine-only matcher would catch those by
// accident. Neither fact weakens the guard; both are why the wave's
// gate_capstone_leak.py SEARCHES for a probe field that can distinguish a
// nine-only matcher from this one rather than taking the first field.
import { PRINTED_DECIMALS, gradedClassOf } from './gradedTolerance.js';

/** Below this many characters a decimal string is not distinctive enough to search for. */
export const MIN_CHARS = 6;

const trim = (s) => (s.includes('.') ? s.replace(/0+$/, '').replace(/\.$/, '') : s);

/**
 * Every searchable rendering of one graded value, tagged with the shape that
 * produced it, so a finding says WHICH shape leaked.
 */
export const renderingsOf = (key, value) => {
  if (!Number.isFinite(value)) return [];
  const dp = PRINTED_DECIMALS[gradedClassOf(key).cls];
  const shapes = [
    ['full', String(value)],
    ['twelve', trim(value.toPrecision(12))],
    ['nine', trim(value.toPrecision(9))],
    ['printed', value.toFixed(dp)],
  ];
  const out = [];
  const seen = new Set();
  shapes.forEach(([shape, s]) => {
    if (s.includes('e') || s.includes('E')) return;
    if (!s.includes('.')) return;
    if (s.length < MIN_CHARS) return;
    if (seen.has(s)) return;
    seen.add(s);
    out.push({ key, shape, text: s });
  });
  return out;
};

/** Every searchable rendering of every graded field, from the answer file itself. */
export const allRenderings = (fields) => {
  if (!Array.isArray(fields) || fields.length !== 18) {
    throw new Error(`[corrosion guard] expected eighteen graded fields, got ${Array.isArray(fields) ? fields.length : typeof fields}`);
  }
  return fields.flatMap(([, key, value]) => renderingsOf(key, value));
};

/** Which renderings appear in a piece of text. Empty is the only pass. */
export const leaksIn = (text, renderings) => renderings.filter((r) => text.includes(r.text));

/**
 * The shapes a value produced that this guard deliberately does NOT search for,
 * with the reason, so the boundary is reported rather than silent.
 */
export const skippedShapesOf = (key, value) => {
  const dp = PRINTED_DECIMALS[gradedClassOf(key).cls];
  return [
    ['full', String(value)], ['twelve', trim(value.toPrecision(12))],
    ['nine', trim(value.toPrecision(9))], ['printed', value.toFixed(dp)],
  ].filter(([, s]) => s.includes('e') || !s.includes('.') || s.length < MIN_CHARS)
    .map(([shape, s]) => ({ key, shape, text: s, why: s.includes('e') ? 'exponential' : (!s.includes('.') ? 'no decimal part' : `shorter than ${MIN_CHARS} characters`) }));
};
