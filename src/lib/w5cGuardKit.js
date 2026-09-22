// TEST KIT for the W5 (part c) capstone re-case and strip gates. Imported only
// by *.test.js files; nothing in the app imports it.
//
// FOLLOW-ON-PROGRAMME.md section 3: a capstone whose answers a lesson or a
// panel's opening view printed is either re-cased (pick A: a new case no panel
// preloads, keys regenerated from the vendored engine) or stripped (pick B:
// the lessons and panels stop printing them, same keys). Each course's gate
// proves, with this kit:
//
//   1. the migration's graded fields are exactly the spec's (for A, the keys
//      the course's case module regenerates through the engine);
//   2. no swept source (the course's panels, its learning page, every lesson
//      of the tiers) carries a graded value in any of the string shapes a
//      value reaches a learner as (the relief guard's lesson: a full float
//      goes past a nine-digit matcher);
//   3. every graded integer of three or more digits is absent as a whole
//      number from the lessons;
//   4. the W1 open-book label and lesson note are gone from the tiers W5 treats;
//   5. each check goes red on a planted leak (negative controls live in each
//      course's test, which plants into copies of its own sources).
import fs from 'node:fs';
import path from 'node:path';

export const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
export const MIN_CHARS = 6;
export const TIERS = ['beginner', 'intermediate', 'advanced'];

const trim = (s) => (s.includes('.') ? s.replace(/0+$/, '').replace(/\.$/, '') : s);

/** Every searchable string shape of one graded value. */
export function renderingsOf(key, value, dps = [2, 3, 4, 5, 6, 7, 8]) {
  if (!Number.isFinite(value)) return [];
  const shapes = [['full', String(value)], ['twelve', trim(value.toPrecision(12))], ['nine', trim(value.toPrecision(9))],
    ['seven', trim(value.toPrecision(7))], ['six', trim(value.toPrecision(6))],
    ...dps.map((d) => [`fixed${d}`, value.toFixed(d)])];
  const out = [];
  const seen = new Set();
  for (const [shape, s] of shapes) {
    if (/e/i.test(s) || !s.includes('.') || s.replace('-', '').length < MIN_CHARS || seen.has(s)) continue;
    seen.add(s);
    out.push({ key, shape, text: s });
  }
  return out;
}

/**
 * The hits of every rendering in a text, matched as a whole number: no digit
 * before it, and after it only trailing zeros (an untrimmed toPrecision or
 * toFixed print of the same value is the same leak).
 */
export function leaksIn(text, renderings) {
  const hits = [];
  for (const r of renderings) {
    const esc = r.text.replace(/[.+-]/g, '\\$&');
    const re = new RegExp(`(?<![0-9.])${esc}0*(?![0-9])`);
    if (re.test(text)) hits.push(r);
  }
  return hits;
}

/** Whole-number hits of the graded integers of three or more digits. */
export function integerLeaksIn(text, fields) {
  const hits = [];
  for (const f of fields) {
    const v = Number(f.expected);
    if (!Number.isInteger(v) || Math.abs(v) < 100) continue;
    if (new RegExp(`(?<![0-9.,])${v}(?![0-9]|\\.[0-9])`).test(text)) hits.push({ key: f.key, text: String(v) });
  }
  return hits;
}

/**
 * Every decimal number printed in a text that lands within a graded
 * non-integer field's tolerance: a nearby worked value (a neighbouring rate
 * on a ladder, a rounded print) passes the grader as surely as the value
 * itself, so a strip must clear these too. Only PRECISE graded fields are
 * swept (tolerance within `maxRel` of the value, 1 percent by default) and
 * only printed numbers carrying at least `minDp` decimals: a loose field (a
 * net pay to 0.75 m, a saturation to 0.02) sits near half the numbers any
 * lesson prints, and a coincidence there says nothing. `allow` lists printed
 * numbers that are not the answer (a stated input, a different quantity),
 * each with its reason in the calling test.
 */
export function nearValuesIn(text, fields, allow = {}, { maxRel = 0.01, minDp = 3 } = {}) {
  const hits = [];
  const nums = [...text.matchAll(/(?<![0-9.])-?\d+\.(\d+)(?![0-9])/g)].filter((m) => m[1].length >= minDp).map((m) => m[0]);
  for (const f of fields) {
    const v = Number(f.expected);
    const tol = Number(f.tol);
    if (Number.isInteger(v) && tol === 0) continue;
    if (!(tol <= maxRel * Math.abs(v))) continue;
    for (const t of nums) {
      if (Math.abs(Number(t) - v) <= tol && !(allow[f.key] || []).includes(t)) hits.push({ key: f.key, text: t });
    }
  }
  return hits;
}

/** Every lesson file of a course's tiers, with its text. */
export function lessonsOf(course, tiers = TIERS) {
  const out = [];
  for (const tier of tiers) {
    const dir = path.join(REPO, 'src/content/courses', course, tier);
    for (const mod of fs.readdirSync(dir).filter((d) => /^m\d/.test(d)).sort()) {
      for (const f of fs.readdirSync(path.join(dir, mod)).filter((x) => x.endsWith('.md')).sort()) {
        const p = path.join(dir, mod, f);
        out.push({ file: path.relative(REPO, p), tier, text: fs.readFileSync(p, 'utf8') });
      }
    }
  }
  if (!out.length) throw new Error(`[w5c] no lessons found for ${course}: a gate that sweeps nothing is not a gate`);
  return out;
}

/** Source files (non-test .js/.jsx) of a directory, plus named extra files, with their text. */
export function sourcesOf(dir, extra = []) {
  const abs = path.join(REPO, dir);
  const files = fs.readdirSync(abs)
    .filter((f) => /\.(js|jsx)$/.test(f) && !f.includes('.test.'))
    .sort()
    .map((f) => path.join(dir, f));
  return [...files, ...extra].map((f) => {
    const p = path.join(REPO, f);
    if (!fs.existsSync(p)) throw new Error(`[w5c] swept source ${f} is missing: a moved file must be re-declared, never skipped`);
    return { file: f, text: fs.readFileSync(p, 'utf8') };
  });
}

/**
 * The graded fields a migration writes for one tier, parsed from its update
 * statement, so the gate binds the committed SQL (what the owner applies) to
 * the engine rather than to a copy of it.
 */
export function migrationFields(file, course, tier) {
  const sql = fs.readFileSync(path.join(REPO, 'migrations', file), 'utf8');
  const re = new RegExp(`update public\\.academy_capstones\\s+set prompt = '((?:[^']|'')*)',\\s+dataset = (?:'((?:[^']|'')*)'|null),\\s+fields = '((?:[^']|'')*)'::jsonb\\s+where app_slug = '${course}' and tier = '${tier}' and active`);
  const m = sql.match(re);
  if (!m) throw new Error(`[w5c] ${file} writes no ${course}/${tier} row`);
  return { prompt: m[1].replace(/''/g, "'"), dataset: m[2] == null ? null : m[2].replace(/''/g, "'"),
    fields: JSON.parse(m[3].replace(/''/g, "'")) };
}

export const W1_LABEL = /^Open book/;
export const W1_LESSON_NOTE = /^> \*\*Open book[.,]/m;
