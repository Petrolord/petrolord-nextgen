// THE PANEL GUARD POLICY FOR TYPED "YOUR CASE" MODES (owner decision D2, 2026-09-21).
//
// THE OLD RULE was "no panel can reach the capstone case". Every panel was a
// select-only teaching view, so the numeric leak gates could walk every value a
// panel could ever show, and a panel that could be set to the capstone case at
// all was a failure.
//
// THE RULE NOW is "no panel DEFAULT state lands on a graded answer". Route (b)
// of the follow-on programme gives a tier's panel a typed mode, so a learner
// who types the capstone's own inputs reads the capstone's own answers. That is
// the work the capstone asks for, and it is allowed. What stays forbidden is
// the answer arriving WITHOUT that work:
//
//   1. THE DEFAULT STATE. Everything a typed mode shows before the learner
//      types (its default inputs run through the same function the panel
//      calls) is swept against every graded answer at ten grading bands, in the
//      same shiftings the course's own leak gate uses. One hit fails.
//
//   2. PRELOAD DETECTION. A mode's default inputs, and every preset bundle a
//      panel offers one click away, may share NO capstone-distinguishing input
//      with the capstone case. The distinguishing inputs are the ones where the
//      capstone differs from every published teaching case, which each lab's
//      own test already proves. A preset that quietly carried the capstone
//      mud, or the capstone depth interval, fails here even when its outputs
//      happen not to collide with a graded answer yet.
//
//   3. THE NAMING RULE is unchanged: no panel source names a capstone reader
//      (CAPSTONE*, capstone*, the capstone well's name) and no panel source
//      prints a graded answer as a literal. A panel computes the learner's case
//      through the teaching surface; it never imports the grader's own case.
//
// A single-input option (a 0.55 axial fraction among 0.2, 0.4, 0.55) is typing,
// not a preload: the learner still has to assemble the rest of the case. A
// bundle that sets the whole case at once is a preset and is held to rule 2.
//
// This module is plain JavaScript with no test runner import, so a course's
// panelCapstoneGuard.test.js imports it and so does its own negative control.
// typedCaseGuard.test.js proves every rule red and green.

/** How much wider than the grader's own band a default number must stand clear. */
export const LEAK_GUARD_MARGIN = 10;

/** psia from psig and back: an additive identity, so the band does not move. */
export const PSI_ATM = 14.696;

/**
 * The shiftings a number can be restated under and still be the same answer.
 * Multiplicative shifts carry the absolute band with them; the psi identity is
 * additive, so its band is unchanged.
 */
export const DEFAULT_SHIFTS = Object.freeze([
  Object.freeze({ tag: 'as graded', apply: (v) => v, bandFactor: 1 }),
  Object.freeze({ tag: 'x1000', apply: (v) => v * 1000, bandFactor: 1000 }),
  Object.freeze({ tag: 'x0.001', apply: (v) => v * 0.001, bandFactor: 0.001 }),
  Object.freeze({ tag: 'psia from psig', apply: (v) => v + PSI_ATM, bandFactor: 1 }),
  Object.freeze({ tag: 'psig from psia', apply: (v) => v - PSI_ATM, bandFactor: 1 }),
]);

/**
 * Normalise a graded field list. Accepts [tier, key, value, tol] rows (the
 * fields.json shape) or { tier, key, value, tol } objects. Non-numeric values
 * (a string answer) are not numeric leak targets and are dropped here; the
 * naming rule covers them.
 */
export const normaliseFields = (fields) => fields
  .map((f) => (Array.isArray(f) ? { tier: f[0], key: f[1], value: f[2], tol: f[3] } : f))
  .filter((f) => typeof f.value === 'number' && Number.isFinite(f.value));

/**
 * Every forbidden neighbourhood: each graded answer in each shifting, with a
 * band `margin` times the grader's own ABSOLUTE tolerance (the grader tests
 * abs(got - expected) <= tol and divides by nothing). A zero tolerance still
 * forbids the exact value.
 */
export const leakTargets = (fields, { margin = LEAK_GUARD_MARGIN, shifts = DEFAULT_SHIFTS } = {}) => (
  normaliseFields(fields).flatMap(({ tier, key, value, tol }) => shifts.map((s) => ({
    tier,
    key,
    tag: s.tag,
    value: s.apply(value),
    gradingBand: Math.abs(tol || 0) * Math.abs(s.bandFactor),
    band: margin * Math.abs(tol || 0) * Math.abs(s.bandFactor),
  })))
);

/** The target a number collides with, or null. Non-finite numbers never hit. */
export const leakGuardHit = (targets, value) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  for (const t of targets) {
    if (Math.abs(value - t.value) <= t.band) return t;
  }
  return null;
};

/**
 * Every finite number reachable inside a value, with a dotted label. Walks
 * arrays and plain objects; skips functions. This is how a mode's WHOLE default
 * output is swept, not only the fields somebody thought to print.
 */
export const numbersIn = (value, label = 'value', out = [], seen = new Set()) => {
  if (typeof value === 'number') {
    if (Number.isFinite(value)) out.push({ label, value });
    return out;
  }
  if (value === null || typeof value !== 'object') return out;
  if (seen.has(value)) return out;
  seen.add(value);
  if (Array.isArray(value)) {
    value.forEach((v, i) => numbersIn(v, `${label}[${i}]`, out, seen));
  } else {
    Object.entries(value).forEach(([k, v]) => numbersIn(v, `${label}.${k}`, out, seen));
  }
  return out;
};

/**
 * RULE 1. Run each typed mode at its default inputs and sweep everything it
 * returns. `modes` is [{ name, defaults, run }], where `run(defaults)` is the
 * very function the panel calls. Returns one line per collision; [] is green.
 */
export const defaultStateHits = ({ targets, modes }) => {
  const hits = [];
  modes.forEach(({ name, defaults, run }) => {
    const out = run(defaults);
    numbersIn(out, `${name}.default`).forEach(({ label, value }) => {
      const t = leakGuardHit(targets, value);
      if (t) hits.push(`${label} = ${value} is within ${t.band} of ${t.tier}/${t.key} (${t.tag})`);
    });
  });
  return hits;
};

const sameInput = (a, b) => {
  if (typeof a === 'number' && typeof b === 'number') {
    if (a === b) return true;
    const scale = Math.max(Math.abs(a), Math.abs(b));
    return scale > 0 && Math.abs(a - b) <= 1e-12 * scale;
  }
  return JSON.stringify(a) === JSON.stringify(b);
};

/** Read a dotted path ('mud.densityKgM3') out of an input bundle. */
export const readPath = (obj, pathStr) => pathStr.split('.')
  .reduce((o, k) => (o === null || o === undefined ? undefined : o[k]), obj);

/**
 * RULE 2. The capstone-distinguishing inputs a bundle shares with the capstone
 * case. `keys` are dotted paths; `capstone` and `bundle` are input objects (the
 * bundle may name a key differently through `map`, { capstonePath: bundlePath }).
 * Returns the shared keys; [] is green.
 */
export const preloadedInputs = ({ capstone, bundle, keys, map = {} }) => keys.filter((k) => {
  const c = readPath(capstone, k);
  const b = readPath(bundle, map[k] || k);
  return c !== undefined && b !== undefined && sameInput(c, b);
});

/**
 * RULE 2 over a panel's defaults and presets together. `bundles` is
 * [{ name, inputs }]. Returns one line per preloaded input; [] is green.
 */
export const preloadHits = ({ capstone, bundles, keys, map = {} }) => bundles.flatMap(({ name, inputs }) => (
  preloadedInputs({ capstone, bundle: inputs, keys, map })
    .map((k) => `${name} preloads the capstone's ${k} = ${JSON.stringify(readPath(capstone, k))}`)
));

/**
 * Before a distinguishing key list is trusted it must actually distinguish:
 * every key must be present on the capstone and differ from every published
 * teaching case. A key that a teaching case shares is not evidence of a
 * preload, and a key the capstone does not carry guards nothing.
 */
export const distinguishingKeyProblems = ({ capstone, teachingCases, keys, map = {} }) => keys.flatMap((k) => {
  const c = readPath(capstone, k);
  if (c === undefined) return [`${k} is not an input of the capstone case`];
  return teachingCases
    .filter(({ inputs }) => sameInput(c, readPath(inputs, map[k] || k)))
    .map(({ name }) => `${k} = ${JSON.stringify(c)} is shared by the teaching case ${name}`);
});

/** RULE 3, the naming half. The default pattern is the one every drilling lab uses. */
export const CAPSTONE_NAME_PATTERN = /\b(CAPSTONE\w*|capstone\w*|CAP)\b/g;

export const capstoneNamesIn = (text, pattern = CAPSTONE_NAME_PATTERN) => [...new Set(
  [...text.matchAll(new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`))]
    .map((m) => m[0]),
)];

const DECIMAL_LITERAL = /\d+\.\d+(?:[eE][-+]?\d+)?/g;
export const SIG_FLOOR = 6;

const significantDigits = (lit) => {
  const mantissa = lit.split(/[eE]/)[0].replace('.', '').replace(/^0+/, '');
  return mantissa.replace(/0+$/, '').length || 1;
};

/**
 * RULE 3, the literal half. A decimal literal in a panel source counts as a
 * printed graded answer when it is that answer correctly rounded to the
 * literal's own precision, at six significant digits or more. Rendering
 * agnostic: nine digits, seventeen digits and every truncation in between.
 */
export const gradedLiteralsIn = (text, fields) => {
  const literals = text.match(DECIMAL_LITERAL) || [];
  const hits = [];
  normaliseFields(fields).forEach(({ tier, key, value }) => {
    literals.forEach((lit) => {
      const sig = significantDigits(lit);
      if (sig < SIG_FLOOR || sig > 21) return;
      if (Number(lit) === Number(Math.abs(value).toPrecision(sig))) {
        hits.push(`${lit} is ${tier}/${key} to ${sig} significant digits`);
      }
    });
  });
  return [...new Set(hits)];
};

/**
 * The positive half, which the old rule forbade and the new one requires where
 * a tier is on route (b): typing the capstone's own inputs into the mode reads
 * the graded answer at the precision the panel prints. `read(out)` pulls the
 * printed number out of the run; `dp` is the panel's print precision.
 * Returns null when the route works, or a line saying why it does not.
 */
export const typedRouteMiss = ({ run, typed, read, dp, expected, tol, key }) => {
  const got = read(run(typed));
  if (typeof got !== 'number' || !Number.isFinite(got)) return `${key}: the typed case prints no number`;
  const printed = Number(got.toFixed(dp));
  const miss = Math.abs(printed - expected);
  return miss <= tol ? null : `${key}: typed case prints ${printed} at ${dp} dp, ${miss} from ${expected} (tol ${tol})`;
};
