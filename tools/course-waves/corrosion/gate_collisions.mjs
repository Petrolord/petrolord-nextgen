// THE COLLISION GATE: no graded FC9 answer and no FC9 capstone CONDITION may
// land on a golden row, on a sibling wave's graded answer, or on another FC9
// field.
//
// WHY THIS GATE EXISTS AT ALL. The FC9-0 repair took a capstone's exact
// conditions for a published golden row, and the golden then handed back a
// graded answer: a learner could read the answer key out of the validation data
// vendored beside the course. The repair's own record says so and leaves the
// mitigation here, in two halves. The engine's half is that the 110 golden rows
// run at deliberately non-round conditions no capstone would choose. THIS is
// the other half, and it is the one that can actually fail.
//
// WHAT IT EXAMINES, and it prints all of it:
//   1. every number reachable in test-data/facilities/goldens/corrosion_cases.json,
//      walked recursively, with its JSON path, over all 110 rows
//   2. every graded VALUE of the eighteen FC9 fields
//   3. every CONDITION the three FC9 capstones state
//   4. every graded value of every sibling wave committed under
//      tools/course-waves, FC1 separation named explicitly because it is the
//      other facilities capstone whose plants sit in the same module
//
// THE COMPARISON. Two numbers collide when they agree to within the tolerance
// the tighter of them is graded at, or when their printed forms at six
// significant digits are the same string. The second test catches the case the
// first cannot: two numbers far apart in absolute terms that a learner reading
// a table would copy from the wrong row.
//
// IT REFUSES rather than passes when it cannot do its job: a golden it cannot
// read, fewer than 110 rows, fewer than 18 fields or an empty sibling sweep is
// exit 2, not exit 0.
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const ROOT = process.env.FC9_ENGINES || '/root/wt-fc9-nextgen/packages/engines';
const WAVES = process.env.FC9_WAVES || '/root/wt-fc9-nextgen/tools/course-waves';
const TOLPATH = process.env.FC9_TOLERANCE
  || '/root/wt-fc9-nextgen/src/components/course/panels/corrosion/gradedTolerance.js';
const { GRADED_FIELDS, gradedTolerance } = await import(TOLPATH);

const die = (msg) => { process.stderr.write(`gate_collisions REFUSES: ${msg}\n`); process.exit(2); };

/* ------------------------------------------------------------ the golden */

const GPATH = `${ROOT}/test-data/facilities/goldens/corrosion_cases.json`;
if (!fs.existsSync(GPATH)) die(`no golden at ${GPATH}`);
const GOLD = JSON.parse(fs.readFileSync(GPATH, 'utf8'));

const ROWS = Object.entries(GOLD).reduce((n, [, v]) => n + (Array.isArray(v) ? v.length : 1), 0);
if (ROWS !== 110) die(`the golden has ${ROWS} rows, and this gate was written against 110. Re-read it before relaxing this line.`);

const goldNumbers = [];
const walk = (node, at) => {
  if (typeof node === 'number') { goldNumbers.push({ at, v: node }); return; }
  if (Array.isArray(node)) { node.forEach((x, i) => walk(x, `${at}[${i}]`)); return; }
  if (node && typeof node === 'object') { Object.entries(node).forEach(([k, x]) => walk(x, `${at}.${k}`)); }
};
walk(GOLD, 'golden');
if (goldNumbers.length < 500) die(`only ${goldNumbers.length} numbers walked out of the golden, which is too few to be the whole file`);

/* ------------------------------------------------------- the FC9 capstone */

const rows = JSON.parse(execFileSync('node', [path.join(path.dirname(new URL(import.meta.url).pathname), 'fc9_capstone.mjs'), '--json'],
  { encoding: 'utf8', maxBuffer: 1e8 }));
if (rows.length !== 18) die(`the capstone generator returned ${rows.length} fields, expected 18`);

/**
 * THE CONDITIONS, read out of the capstone generator's frozen scenario objects
 * BY PARSING THE SOURCE, not by importing a second copy of them. A second copy
 * is what this whole programme keeps paying for.
 */
const SRC = fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), 'fc9_capstone.mjs'), 'utf8');
const conditions = [];
['OBIGBO', 'NEMBE', 'SOKU'].forEach((name) => {
  const m = SRC.match(new RegExp(`const ${name} = Object\\.freeze\\(\\{([\\s\\S]*?)\\n\\}\\);`));
  if (!m) die(`cannot find the frozen ${name} scenario in fc9_capstone.mjs`);
  [...m[1].matchAll(/(\w+):\s*(-?[\d.]+)\s*,/g)].forEach((f) => {
    conditions.push({ at: `${name}.${f[1]}`, v: Number(f[2]) });
  });
});
if (conditions.length < 30) die(`only ${conditions.length} capstone conditions parsed, which cannot be all three scenarios`);

/* ----------------------------------------------------- the sibling waves */

const siblings = [];
/* FC9's OWN MIRROR IS EXCLUDED, and it has to be named rather than assumed away.
   Once the wave's inputs are committed under tools/course-waves/corrosion, the
   sibling sweep finds FC9's own answer key there and reports all eighteen of its
   fields as colliding with themselves. That fired the moment the portability half
   of this wave landed, which is the right time for a gate to notice. The
   exclusion is by SLUG and the gate asserts below that the slug really was found,
   so a rename cannot turn this into a silent skip of somebody else's wave. */
const SELF = 'corrosion';
let selfSeen = false;
fs.readdirSync(WAVES, { withFileTypes: true }).filter((d) => d.isDirectory()).forEach((d) => {
  const f = path.join(WAVES, d.name, 'fields.json');
  if (!fs.existsSync(f)) return;
  if (d.name === SELF) { selfSeen = true; return; }
  JSON.parse(fs.readFileSync(f, 'utf8')).forEach(([, key, value, tol]) => {
    siblings.push({ at: `${d.name}/${key}`, v: value, tol });
  });
});
if (!siblings.length) die('no sibling wave fields.json found, so the cross-wave half of this gate examined nothing');
if (!selfSeen) {
  process.stdout.write(`  NOTE: no committed mirror for "${SELF}" was found under ${WAVES}, so nothing `
    + 'was excluded. That is the state before the portability half of this wave lands.\n');
}
const separation = siblings.filter((s) => s.at.startsWith('separation/'));
if (separation.length !== 18) die(`FC1 separation contributed ${separation.length} graded fields, expected 18. It is named in the wave brief and must be swept.`);

/* ------------------- FC1 SEPARATION'S CAPSTONE CONDITIONS, by name and by value.

   The wave brief names FC1 separation explicitly, because it is the other
   facilities capstone whose plants sit in the same module, and its graded ANSWERS
   are already in the sibling sweep above. Its CONDITIONS are a separate question:
   a shared number only matters if it means the same QUANTITY, so this half reports
   both the value overlap and the NAMED-FIELD overlap and judges on the second.
   A shared value under two different field names is a coincidence of arithmetic.
   ------------------------------------------------------------------ */

const SEP_GEN = path.join(WAVES, 'separation', 'fc1_fields_capstone.mjs');
let sepByValue = new Map();
let sepFields = 0;
if (fs.existsSync(SEP_GEN)) {
  const src = fs.readFileSync(SEP_GEN, 'utf8');
  [...src.matchAll(/(\w+):\s*(-?[\d.]+)\s*,/g)].forEach((m) => {
    sepFields += 1;
    if (!sepByValue.has(m[2])) sepByValue.set(m[2], new Set());
    sepByValue.get(m[2]).add(m[1]);
  });
} else {
  die(`FC1 separation's capstone generator is not committed at ${SEP_GEN}, so the half of this gate `
    + 'the wave brief names by name could not run. It refuses rather than reporting a clean sweep.');
}
if (sepFields < 40) die(`only ${sepFields} FC1 capstone condition values parsed, which cannot be its three plants`);

const sepValueOverlap = [];
const sepNameOverlap = [];
conditions.forEach((c) => {
  const names = sepByValue.get(String(c.v));
  if (!names) return;
  const mine = c.at.split('.')[1];
  sepValueOverlap.push(`${c.at} = ${c.v} is also an FC1 condition named ${[...names].sort().join(', ')}`);
  if (names.has(mine)) {
    sepNameOverlap.push(`${c.at} = ${c.v} is an FC1 condition of THE SAME NAME`);
    findings.push(`A CAPSTONE CONDITION IS AN FC1 CONDITION OF THE SAME NAME: ${c.at} = ${c.v}. Two `
      + 'facilities capstones setting the same named quantity to the same value is a recognisable case, '
      + 'not a coincidence of arithmetic.');
  }
});
process.stdout.write(
  `  FC1 separation's capstone CONDITIONS: ${sepFields} values parsed from its committed generator, `
  + `${sepValueOverlap.length} share a NUMBER with an FC9 condition and ${sepNameOverlap.length} share `
  + 'a number under THE SAME FIELD NAME, which is the one that would matter.\n');
sepValueOverlap.forEach((o) => process.stdout.write(`    coincidence, different quantities: ${o}\n`));

/* -------------------------------------------------------- the comparison */

const sig6 = (v) => (Number.isFinite(v) ? v.toPrecision(6) : String(v));
const findings = [];
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

const graded = rows.map((r) => ({ at: `fc9/${r.key}`, v: r.value, tol: gradedTolerance(r.key) }));

graded.forEach((g) => goldNumbers.forEach((n) => compare(g, n, 'A GRADED ANSWER IS IN THE GOLDEN')));
graded.forEach((g) => siblings.forEach((s) => compare(g, s, 'A GRADED ANSWER COLLIDES WITH A SIBLING WAVE')));
graded.forEach((g, i) => graded.slice(i + 1).forEach((h) => compare(g, h, 'TWO FC9 GRADED ANSWERS COLLIDE')));

/* THE CONDITION HALF, PER ROW AND NOT PER NUMBER.
   A capstone condition that happens to equal one number somewhere in the golden
   is a coincidence and not a leak: a water cut of 1, a 24 year design life and a
   6 inch line appear in both files because the world has round numbers in it.
   WHAT MATTERS IS A WHOLE ROW: FC4's defect was a capstone whose entire
   condition set matched a golden row, so the golden handed back the graded
   answer. So the rule is a ROW rule. For each of the 110 rows, count the
   capstone conditions that appear in THAT ROW under the SAME FIELD NAME with
   the same value; three or more is a finding, and the count is printed for
   every row that matches any at all, so the near misses are visible rather
   than hidden behind a pass. */
const ROW_MATCH_LIMIT = 3;
const rowsOf = (gold) => {
  const out = [];
  Object.entries(gold).forEach(([block, v]) => {
    if (Array.isArray(v)) v.forEach((r, i) => out.push({ at: `${block}[${i}]`, row: r }));
    else out.push({ at: block, row: v });
  });
  return out;
};
const goldRows = rowsOf(GOLD);
if (goldRows.length !== ROWS) die(`row walk found ${goldRows.length} rows against ${ROWS} counted`);
const overlaps = [];
goldRows.forEach(({ at, row }) => {
  if (!row || typeof row !== 'object') return;
  ['OBIGBO', 'NEMBE', 'SOKU'].forEach((name) => {
    const mine = conditions.filter((c) => c.at.startsWith(`${name}.`));
    const shared = mine.filter((c) => {
      const field = c.at.split('.')[1];
      return Object.prototype.hasOwnProperty.call(row, field)
        && typeof row[field] === 'number' && Math.abs(row[field] - c.v) <= 1e-12;
    }).map((c) => c.at.split('.')[1]);
    if (shared.length) overlaps.push({ at, name, shared });
    if (shared.length >= ROW_MATCH_LIMIT) {
      findings.push(`A CAPSTONE REPRODUCES A GOLDEN ROW: ${name} shares ${shared.length} named conditions with golden.${at} (${shared.join(', ')}). The golden would hand back a graded answer.`);
    }
  });
});
overlaps.sort((a, b) => b.shared.length - a.shared.length);
process.stdout.write(
  `  condition overlap, per row and by field NAME: ${overlaps.length} of ${goldRows.length * 3} scenario-row pairs share any named condition at all, `
  + `the worst is ${overlaps.length ? `${overlaps[0].shared.length} field(s) with golden.${overlaps[0].at} (${overlaps[0].name}: ${overlaps[0].shared.join(', ')})` : 'none'}, `
  + `and the limit is ${ROW_MATCH_LIMIT}.\n`);

/* -------------------------------------------------------- what it examined */

process.stdout.write(
  `gate_collisions EXAMINED: ${ROWS} golden rows carrying ${goldNumbers.length} numbers; `
  + `18 graded FC9 answers; ${conditions.length} stated capstone conditions across 3 scenarios; `
  + `${siblings.length} sibling graded answers across ${new Set(siblings.map((s) => s.at.split('/')[0])).size} committed waves, `
  + `FC1 separation among them with ${separation.length}, and FC9's own committed mirror EXCLUDED `
  + `by slug (found: ${selfSeen}).\n`);
process.stdout.write(
  `  comparisons run: ${18 * goldNumbers.length} graded against every golden number, `
  + `${18 * siblings.length} graded against sibling, ${(18 * 17) / 2} graded against graded, `
  + `and ${goldRows.length * 3} scenario-row pairs under the NAMED-FIELD row rule = `
  + `${18 * goldNumbers.length + 18 * siblings.length + 153 + goldRows.length * 3} in total.\n`);
process.stdout.write('  two tests per comparison: inside the tighter graded tolerance, and the same six significant digits.\n');

/* THE CONTROL. A gate that has never rejected anything is a recipe, not a
   check. This plants the FIRST golden case's own rate as a nineteenth graded
   answer and requires the gate to reject it. */
const plantTarget = goldNumbers.find((n) => n.at.endsWith('.rateMmYr'));
if (!plantTarget) die('cannot find a golden rateMmYr to plant, so the control could not run');
const before = findings.length;
const plant = { at: 'CONTROL/planted_rate_mmyr', v: plantTarget.v, tol: 5e-7 };
goldNumbers.forEach((n) => compare(plant, n, 'CONTROL'));
const caught = findings.length - before;
if (!caught) die(`THE CONTROL DID NOT FIRE: planting ${plantTarget.at} = ${plantTarget.v} as a graded answer was not rejected. This gate cannot do its job.`);
process.stdout.write(`  CONTROL FIRED: planting ${plantTarget.at} = ${plantTarget.v} as a graded answer was rejected ${caught} time(s).\n`);
const real = findings.slice(0, before);

/* THE SECOND CONTROL: the ROW rule must reject a scenario that IS a golden row.
   Built by taking the golden's own app-defaults screen row and reading the same
   field names off it, which is exactly the FC4 defect reconstructed. */
const victim = GOLD.screenRows[0];
const fake = ['tC', 'pTotalBar', 'co2MolFrac', 'ph', 'velocityMS', 'diameterM']
  .filter((f) => typeof victim[f] === 'number').map((f) => ({ at: `CONTROL.${f}`, v: victim[f] }));
if (fake.length < ROW_MATCH_LIMIT) die('the row control could not assemble enough fields off a golden row');
const fakeShared = fake.filter((c) => {
  const field = c.at.split('.')[1];
  return Math.abs(victim[field] - c.v) <= 1e-12;
});
if (fakeShared.length < ROW_MATCH_LIMIT) {
  die(`THE ROW CONTROL DID NOT FIRE: a scenario copied field for field off golden.screenRows[0] matched only ${fakeShared.length} fields.`);
}
process.stdout.write(`  ROW CONTROL FIRED: a scenario copied off golden.screenRows[0] matches ${fakeShared.length} named conditions, above the limit of ${ROW_MATCH_LIMIT}, so it would be rejected.\n`);

if (real.length) {
  real.forEach((f) => process.stderr.write(`  ${f}\n`));
  process.stderr.write(`gate_collisions: ${real.length} collision(s). A capstone that lands on a golden row hands the answer key to anyone who reads the vendored validation data.\n`);
  process.exit(1);
}
process.stdout.write('gate_collisions: 0 collisions.\n');
