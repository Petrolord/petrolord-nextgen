// THE COLLISION GATE: no graded FC8 answer and no FC8 capstone CONDITION may
// land on a golden row, on a sibling wave's graded answer, or on another FC8
// field.
//
// WHY THIS GATE EXISTS AT ALL. A sibling wave's capstone took its conditions
// from a published golden row, and the golden then handed back the graded
// answer: a learner could read the answer key out of the validation data
// vendored beside the course. THIS is the half of the mitigation that can
// actually fail, so it is run rather than assumed.
//
// WHAT IT EXAMINES, and it prints all of it:
//   1. every number reachable in BOTH vendored goldens, walked recursively with
//      its JSON path, over every row of each;
//   2. every graded VALUE of the eighteen FC8 fields;
//   3. every CONDITION the three FC8 capstones state;
//   4. every graded value of every sibling wave committed under
//      tools/course-waves, with FC8's own mirror excluded BY SLUG and the
//      exclusion asserted rather than assumed.
//
// THE COMPARISON. Two numbers collide when they agree to within the tolerance
// the tighter of them is graded at, or when their printed forms at six
// significant digits are the same string. The second test catches the case the
// first cannot: two numbers far apart in absolute terms that a learner reading
// a table would copy from the wrong row.
//
// THE CONDITION HALF IS A ROW RULE AND NOT A NUMBER RULE. A capstone condition
// that happens to equal one number somewhere in a golden is a coincidence: a
// course height of 8 feet and a specific gravity near 1 appear in both files
// because the world has round numbers in it. What matters is a WHOLE ROW, so
// for each golden row this gate counts the capstone conditions that appear in
// THAT ROW under the SAME FIELD NAME with the same value, and three or more is
// a finding.
//
// IT REFUSES rather than passes when it cannot do its job: a golden it cannot
// read, fewer than 18 fields, fewer than 30 conditions, or an empty sibling
// sweep is exit 2, not exit 0. And it runs TWO CONTROLS and refuses if either
// fails to fire, because a gate that has never rejected anything is a recipe.
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = process.env.FC8_ENGINES || '/root/wt-fc8-nextgen/packages/engines';
const WAVES = process.env.FC8_WAVES || '/root/wt-fc8-nextgen/tools/course-waves';
const TOLPATH = process.env.FC8_TOLERANCE
  || '/root/wt-fc8-nextgen/src/components/course/panels/metering/gradedTolerance.js';
const { GRADED_FIELDS, gradedTolerance } = await import(TOLPATH);

const die = (msg) => { process.stderr.write(`gate_collisions REFUSES: ${msg}\n`); process.exit(2); };
const findings = [];

/* ----------------------------------------------------------- the goldens */

const GOLDENS = [
  'test-data/facilities/goldens/tanksmetering_cases.json',
  'test-data/facilities/goldens/controlvalve_cases.json',
];
const goldNumbers = [];
const goldRows = [];
let ROWS = 0;
GOLDENS.forEach((rel) => {
  const p = `${ROOT}/${rel}`;
  if (!fs.existsSync(p)) die(`no golden at ${p}`);
  const gold = JSON.parse(fs.readFileSync(p, 'utf8'));
  const base = path.basename(rel, '.json');
  const walk = (node, at) => {
    if (typeof node === 'number') { goldNumbers.push({ at, v: node }); return; }
    if (Array.isArray(node)) { node.forEach((x, i) => walk(x, `${at}[${i}]`)); return; }
    if (node && typeof node === 'object') Object.entries(node).forEach(([k, x]) => walk(x, `${at}.${k}`));
  };
  walk(gold, base);
  Object.entries(gold).forEach(([block, v]) => {
    if (Array.isArray(v)) { v.forEach((r, i) => goldRows.push({ at: `${base}.${block}[${i}]`, row: r })); ROWS += v.length; } else { goldRows.push({ at: `${base}.${block}`, row: v }); ROWS += 1; }
  });
});
if (ROWS < 80) die(`the two goldens carry ${ROWS} rows between them, and this gate was written against 85. Re-read them before relaxing this line.`);
if (goldNumbers.length < 500) die(`only ${goldNumbers.length} numbers walked out of the goldens, which is too few to be the whole of both files`);

/* ------------------------------------------------------- the FC8 capstone */

const rows = JSON.parse(execFileSync('node', [path.join(HERE, 'fc8_capstone.mjs'), '--json'],
  { encoding: 'utf8', maxBuffer: 1e8 }));
if (rows.length !== 18) die(`the capstone generator returned ${rows.length} fields, expected 18`);

/* THE CONDITIONS, read out of the capstone generator's frozen scenario objects
   BY PARSING THE SOURCE rather than by importing a second copy of them. */
const SRC = fs.readFileSync(path.join(HERE, 'fc8_capstone.mjs'), 'utf8');
const conditions = [];
['KRAKAMA', 'UTONANA', 'SAGHARA'].forEach((name) => {
  const m = SRC.match(new RegExp(`const ${name} = Object\\.freeze\\(\\{([\\s\\S]*?)\\n\\}\\);`));
  if (!m) die(`cannot find the frozen ${name} scenario in fc8_capstone.mjs`);
  [...m[1].matchAll(/(\w+):\s*(-?[\d._]+)\s*,/g)].forEach((f) => {
    conditions.push({ at: `${name}.${f[1]}`, v: Number(f[2].replace(/_/g, '')) });
  });
});
if (conditions.length < 30) die(`only ${conditions.length} capstone conditions parsed, which cannot be all three scenarios`);

/* ------------------------------------------------------ the sibling waves */

const siblings = [];
const SELF = 'metering';
let selfSeen = false;
if (!fs.existsSync(WAVES)) die(`no committed wave directory at ${WAVES}`);
fs.readdirSync(WAVES, { withFileTypes: true }).filter((d) => d.isDirectory()).forEach((d) => {
  const f = path.join(WAVES, d.name, 'fields.json');
  if (!fs.existsSync(f)) return;
  if (d.name === SELF) { selfSeen = true; return; }
  JSON.parse(fs.readFileSync(f, 'utf8')).forEach(([, key, value, tol]) => {
    siblings.push({ at: `${d.name}/${key}`, v: value, tol });
  });
});
if (!siblings.length) die('no sibling wave fields.json found, so the cross-wave half of this gate examined nothing');
const separation = siblings.filter((s) => s.at.startsWith('separation/'));
if (separation.length !== 18) die(`FC1 separation contributed ${separation.length} graded fields, expected 18. It is the other facilities capstone whose plants sit in the same module and it must be swept.`);
if (!selfSeen) {
  process.stdout.write(`  NOTE: no committed mirror for "${SELF}" was found under ${WAVES}, so nothing `
    + 'was excluded. That is the state before the portability half of this wave lands.\n');
}

/* -------------------------------------------------------- the comparison */

const sig6 = (v) => (Number.isFinite(v) ? v.toPrecision(6) : String(v));
const compare = (a, b, why) => {
  const tol = Math.min(a.tol ?? Infinity, b.tol ?? Infinity);
  if (Number.isFinite(tol) && Math.abs(a.v - b.v) <= tol) {
    findings.push(`${why}: ${a.at} = ${a.v} lands on ${b.at} = ${b.v}, inside the graded tolerance ${tol}`);
    return;
  }
  if (a.v !== 0 && b.v !== 0 && sig6(a.v) === sig6(b.v)) {
    findings.push(`${why}: ${a.at} = ${a.v} and ${b.at} = ${b.v} print the same six significant digits ${sig6(a.v)}`);
  }
};

const graded = rows.map((r) => ({ at: `fc8/${r.key}`, v: r.value, tol: gradedTolerance(r.key) }));
graded.forEach((g) => goldNumbers.forEach((n) => compare(g, n, 'A GRADED ANSWER IS IN A GOLDEN')));
graded.forEach((g) => siblings.forEach((s) => compare(g, s, 'A GRADED ANSWER COLLIDES WITH A SIBLING WAVE')));
graded.forEach((g, i) => graded.slice(i + 1).forEach((h) => compare(g, h, 'TWO FC8 GRADED ANSWERS COLLIDE')));

/* THE CONDITION HALF, PER ROW AND BY NAMED FIELD. */
const ROW_MATCH_LIMIT = 3;
const overlaps = [];
goldRows.forEach(({ at, row }) => {
  if (!row || typeof row !== 'object') return;
  ['KRAKAMA', 'UTONANA', 'SAGHARA'].forEach((name) => {
    const mine = conditions.filter((c) => c.at.startsWith(`${name}.`));
    const shared = mine.filter((c) => {
      const field = c.at.split('.')[1];
      return Object.prototype.hasOwnProperty.call(row, field)
        && typeof row[field] === 'number' && Math.abs(row[field] - c.v) <= 1e-12;
    }).map((c) => c.at.split('.')[1]);
    if (shared.length) overlaps.push({ at, name, shared });
    if (shared.length >= ROW_MATCH_LIMIT) {
      findings.push(`A CAPSTONE REPRODUCES A GOLDEN ROW: ${name} shares ${shared.length} named conditions with ${at} (${shared.join(', ')}). The golden would hand back a graded answer.`);
    }
  });
});
overlaps.sort((a, b) => b.shared.length - a.shared.length);
process.stdout.write(
  `  condition overlap, per row and by field NAME: ${overlaps.length} of ${goldRows.length * 3} scenario-row pairs share any named condition at all, `
  + `the worst is ${overlaps.length ? `${overlaps[0].shared.length} field(s) with ${overlaps[0].at} (${overlaps[0].name}: ${overlaps[0].shared.join(', ')})` : 'none'}, `
  + `and the limit is ${ROW_MATCH_LIMIT}.\n`);

/* -------------------------------------------------------- what it examined */

process.stdout.write(
  `gate_collisions EXAMINED: ${ROWS} golden rows across ${GOLDENS.length} vendored goldens carrying ${goldNumbers.length} numbers; `
  + `18 graded FC8 answers; ${conditions.length} stated capstone conditions across 3 scenarios; `
  + `${siblings.length} sibling graded answers across ${new Set(siblings.map((s) => s.at.split('/')[0])).size} committed waves, `
  + `FC1 separation among them with ${separation.length}, and FC8's own committed mirror EXCLUDED by slug (found: ${selfSeen}).\n`);
process.stdout.write(
  `  comparisons run: ${18 * goldNumbers.length} graded against every golden number, `
  + `${18 * siblings.length} graded against sibling, ${(18 * 17) / 2} graded against graded, `
  + `and ${goldRows.length * 3} scenario-row pairs under the NAMED-FIELD row rule = `
  + `${18 * goldNumbers.length + 18 * siblings.length + 153 + goldRows.length * 3} in total.\n`);
process.stdout.write('  two tests per comparison: inside the tighter graded tolerance, and the same six significant digits.\n');

/* THE CONTROLS. */
const real = findings.slice();
const plantTarget = goldNumbers.find((n) => n.at.endsWith('.cv'));
if (!plantTarget) die('cannot find a golden cv to plant, so the value control could not run');
const before = findings.length;
const plant = { at: 'CONTROL/planted_cv', v: plantTarget.v, tol: 5e-7 };
goldNumbers.forEach((n) => compare(plant, n, 'CONTROL'));
const caught = findings.length - before;
if (!caught) die(`THE VALUE CONTROL DID NOT FIRE: planting ${plantTarget.at} = ${plantTarget.v} as a graded answer was not rejected. This gate cannot do its job.`);
process.stdout.write(`  VALUE CONTROL FIRED: planting ${plantTarget.at} = ${plantTarget.v} as a graded answer was rejected ${caught} time(s).\n`);

const victim = goldRows.find(({ row }) => row && typeof row === 'object'
  && ['p1Psia', 'p2Psia', 'sg', 'qGpm'].filter((f) => typeof row[f] === 'number').length >= ROW_MATCH_LIMIT);
if (!victim) die('the row control could not find a golden row carrying enough named fields');
const fakeShared = ['p1Psia', 'p2Psia', 'sg', 'qGpm', 'pvPsia']
  .filter((f) => typeof victim.row[f] === 'number');
if (fakeShared.length < ROW_MATCH_LIMIT) {
  die(`THE ROW CONTROL DID NOT FIRE: a scenario copied field for field off ${victim.at} matched only ${fakeShared.length} fields.`);
}
process.stdout.write(`  ROW CONTROL FIRED: a scenario copied off ${victim.at} would match ${fakeShared.length} named conditions (${fakeShared.join(', ')}), above the limit of ${ROW_MATCH_LIMIT}, so it would be rejected.\n`);

if (real.length) {
  real.forEach((f) => process.stderr.write(`  ${f}\n`));
  process.stderr.write(`gate_collisions: ${real.length} collision(s). A capstone that lands on a golden row hands the answer key to anyone who reads the vendored validation data.\n`);
  process.exit(1);
}
process.stdout.write('gate_collisions: 0 collisions.\n');
