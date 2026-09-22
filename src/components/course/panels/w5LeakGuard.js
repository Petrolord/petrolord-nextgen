// THE W5 LEAK GATE, shared by every course W5 re-cased (FOLLOW-ON-PROGRAMME.md
// section 3, pick A). Each course's panelCapstoneGuard.test.jsx builds one of
// these from its engine-generated fields.json and sweeps what a learner sees
// before working: every lesson, the panel sources, the learning page, the
// panels' rendered opening text and the teaching functions' opening scalars.
//
// THE THRESHOLD IS THE GRADER'S OWN AND IT IS ABSOLUTE. academy_submit_capstone
// passes a field when abs(answer - expected) <= tol, so tol is a band in the
// field's own units. The forbidden band is LEAK_GUARD_MARGIN (ten) times that.
//
// UNIT RESTATEMENTS. A number restated in another unit is the same answer, so a
// course names, per graded unit, the factors a learner would plausibly restate
// it by (GPa as MPa, a fraction as a percent, ...). The band travels with the
// value. A unit with no entry is checked as graded only.
//
// INTEGER FIELDS (tol 0) are exact counts. Small integers are everywhere in
// prose and in SVG layout, so they are swept only in lessons and rendered text,
// where an exact match is a real statement; each course adds its own check of
// what would leak the count (the input that produces it).
//
// This module is test support: nothing a learner loads imports it.
import * as fs from 'node:fs';
import * as path from 'node:path';

export const LEAK_GUARD_MARGIN = 10;
export const NUMBER = /-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g;

export function makeLeakGuard(fields, restate = {}) {
  const targets = fields.flatMap((f) => (restate[f.unit] || [1]).map((factor) => ({
    tier: f.tier,
    key: f.key,
    factor,
    integer: f.tol === 0,
    value: f.expected * factor,
    band: LEAK_GUARD_MARGIN * f.tol * Math.abs(factor),
  })));
  /** The target a number collides with, or null. `integers` includes the exact-count fields. */
  const hit = (x, { integers = true } = {}) => {
    if (!Number.isFinite(x)) return null;
    return targets.find((t) => (integers || !t.integer) && Math.abs(x - t.value) <= t.band) || null;
  };
  const describe = (t) => `${t.tier}/${t.key}${t.factor === 1 ? '' : ` (x${t.factor})`}`;

  /** Every number token in these files that lands in a band. */
  const scanFiles = (files, root, { integers = true } = {}) => {
    const hits = [];
    files.forEach((file) => {
      fs.readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
        (line.match(NUMBER) || []).forEach((tok) => {
          const t = hit(Number(tok), { integers });
          if (t) hits.push(`${path.relative(root, file)}:${i + 1} prints ${tok}, inside ${describe(t)}`);
        });
      });
    });
    return hits;
  };

  /** Every {where, value} that lands in a band. */
  const scanValues = (values, { integers = false } = {}) => values
    .map((v) => ({ v, t: hit(v.value, { integers }) }))
    .filter((x) => x.t)
    .map((x) => `${x.v.where} = ${x.v.value} is inside ${describe(x.t)}`);

  /** Every number in a rendered component's TEXT (tags stripped: SVG path data is drawing, not print). */
  const scanRendered = (name, markup) => {
    const text = markup.replace(/<[^>]*>/g, ' ');
    const nums = text.match(NUMBER) || [];
    const hits = [];
    nums.forEach((tok) => {
      const t = hit(Number(tok));
      if (t) hits.push(`${name} prints ${tok} as it opens, inside ${describe(t)}`);
    });
    return { count: nums.length, hits };
  };

  return { targets, hit, scanFiles, scanValues, scanRendered };
}

/**
 * Every scalar an engine result carries, as held and under the given divisors
 * (a panel printing Pa as GPa divides by 1e9). Arrays are plotted, not printed,
 * unless `arrays` is set, and are then walked too.
 */
export function leaves(obj, { divisors = [], arrays = false } = {}, out = [], where = '') {
  if (typeof obj === 'number') {
    out.push({ where, value: obj });
    divisors.forEach((d) => out.push({ where: `${where} / ${d}`, value: obj / d }));
  } else if (Array.isArray(obj)) {
    if (arrays) obj.forEach((v, i) => leaves(v, { divisors, arrays }, out, `${where}[${i}]`));
  } else if (obj && typeof obj === 'object') {
    Object.entries(obj).forEach(([k, v]) => {
      if (typeof v !== 'function') leaves(v, { divisors, arrays }, out, where ? `${where}.${k}` : k);
    });
  }
  return out;
}

/** Every lesson markdown file under a course directory. */
export function lessonFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return lessonFiles(p);
    return e.name.endsWith('.md') ? [p] : [];
  });
}

/** The panel sources in a directory (tests excluded). */
export function panelSources(dir) {
  return fs.readdirSync(dir).filter((f) => f.endsWith('.jsx') && !f.includes('.test.')).map((f) => path.join(dir, f));
}
