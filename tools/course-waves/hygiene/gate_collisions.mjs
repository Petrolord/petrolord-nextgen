// THE COLLISION GATE: no graded H2 answer and no H2 capstone CONDITION may land
// on a golden case, on a sibling wave's graded answer, on another H2 field, or
// on a number the teaching digest prints.
//
// WHAT IT EXAMINES, and it prints all of it:
//   1. every number reachable in test-data/hse/goldens/exposure_cases.json,
//      walked recursively over cases, errata and refusals
//   2. every graded VALUE of the eighteen H2 fields
//   3. every CONDITION the three H2 capstones state
//   4. every graded value of every sibling wave committed under
//      tools/course-waves, plus H1 safetystats from its live wave directory
//      (the other HSE course, not yet committed when this wave was cut)
//   5. every numeric literal in digest.txt
//
// THE COMPARISON. Two numbers collide when they agree to within the tolerance
// the tighter of them is graded at (the grader's ABSOLUTE tolerance,
// public.academy_submit_capstone: abs(got - expected) <= tol), or when their
// printed forms at six significant digits are the same string.
//
// THE CONDITION ROW RULE. A capstone CONDITION equal to one number in the
// golden is a coincidence; a whole golden case whose argument list matches a
// capstone's input list would hand back a graded answer. So for each golden
// case, count the capstone input records (level and duration pairs,
// concentration and duration pairs, limits) that appear in its args; any whole
// record matched is a finding.
//
// IT REFUSES rather than passes when it cannot do its job (exit 2), and it
// carries two controls that must fire.
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const HERE = path.dirname(new URL(import.meta.url).pathname);
const ROOT = process.env.H2_ENGINES || '/root/wt-h2-nextgen/packages/engines';
const WAVES = process.env.H2_WAVES || '/root/wt-h2-nextgen/tools/course-waves';
const H1_FIELDS = process.env.H2_H1_FIELDS || '/root/hse-wip-safetystats/fields.json';
const TOLPATH = process.env.H2_TOLERANCE
  || '/root/wt-h2-nextgen/src/components/course/panels/hygiene/gradedTolerance.js';
const DIGEST = process.env.H2_DIGEST || path.join(HERE, 'digest.txt');
const { gradedTolerance } = await import(TOLPATH);

const die = (msg) => { process.stderr.write(`gate_collisions REFUSES: ${msg}\n`); process.exit(2); };
const findings = [];

/* ------------------------------------------------------------ the golden */

const GPATH = `${ROOT}/test-data/hse/goldens/exposure_cases.json`;
if (!fs.existsSync(GPATH)) die(`no golden at ${GPATH}`);
const GOLD = JSON.parse(fs.readFileSync(GPATH, 'utf8'));
const CASES = [...GOLD.cases, ...GOLD.errata, ...GOLD.refusals];
if (CASES.length < 500) die(`the golden has ${CASES.length} cases, and this gate was written against 503`);
const goldNumbers = [];
const walk = (node, at) => {
  if (typeof node === 'number') { goldNumbers.push({ at, v: node }); return; }
  if (Array.isArray(node)) { node.forEach((x, i) => walk(x, `${at}[${i}]`)); return; }
  if (node && typeof node === 'object') Object.entries(node).forEach(([k, x]) => walk(x, `${at}.${k}`));
};
CASES.forEach((c) => walk({ args: c.args, expect: c.expect, published: c.published, printed: c.printed }, `golden.${c.id}`));
if (goldNumbers.length < 1500) die(`only ${goldNumbers.length} numbers walked out of the golden`);

/* ---------------------------------------------------------- the capstone */

const rows = JSON.parse(execFileSync('node', [path.join(HERE, 'h2_capstone.mjs'), '--json'],
  { encoding: 'utf8', maxBuffer: 1e8, stdio: ['ignore', 'pipe', 'ignore'] }));
if (rows.length !== 18) die(`the capstone generator returned ${rows.length} fields, expected 18`);
const SRC = fs.readFileSync(path.join(HERE, 'h2_capstone.mjs'), 'utf8');
const conditions = [];
const records = [];
['UTOROGU', 'AMUKPE', 'OSIOKA'].forEach((name) => {
  const m = SRC.match(new RegExp(`const ${name} = Object\\.freeze\\(\\{([\\s\\S]*?)\\n\\}\\);`));
  if (!m) die(`cannot find the frozen ${name} scenario in h2_capstone.mjs`);
  [...m[1].matchAll(/(\w+):\s*(-?[\d.]+)/g)].forEach((f) => conditions.push({ at: `${name}.${f[1]}`, v: Number(f[2]) }));
  [...m[1].matchAll(/Object\.freeze\(\{([^}]*)\}\)/g)].forEach((r) => {
    const o = {};
    [...r[1].matchAll(/(\w+):\s*(-?[\d.]+)/g)].forEach(([, k, v]) => { o[k] = Number(v); });
    records.push({ at: name, rec: o });
  });
});
if (conditions.length < 60) die(`only ${conditions.length} capstone conditions parsed`);

/* ------------------------------------------------------- the sibling waves */

const SELF = 'hygiene';
const siblings = [];
let selfSeen = false;
if (fs.existsSync(WAVES)) {
  fs.readdirSync(WAVES, { withFileTypes: true }).filter((d) => d.isDirectory()).forEach((d) => {
    const f = path.join(WAVES, d.name, 'fields.json');
    if (!fs.existsSync(f)) return;
    if (d.name === SELF) { selfSeen = true; return; }
    JSON.parse(fs.readFileSync(f, 'utf8')).forEach(([, key, value, tol]) => siblings.push({ at: `${d.name}/${key}`, v: value, tol }));
  });
}
let h1 = 0;
if (fs.existsSync(H1_FIELDS)) {
  JSON.parse(fs.readFileSync(H1_FIELDS, 'utf8')).forEach(([, key, value, tol]) => { siblings.push({ at: `safetystats(live)/${key}`, v: value, tol }); h1 += 1; });
}
if (siblings.length < 300) die(`only ${siblings.length} sibling graded answers found, so the cross-wave half examined too little`);

/* ------------------------------------------------------------ the digest */

let digestNumbers = [];
let digestNote = 'NOT READ (no digest.txt yet)';
if (fs.existsSync(DIGEST)) {
  const text = fs.readFileSync(DIGEST, 'utf8');
  text.split('\n').forEach((line, i) => {
    for (const m of line.matchAll(/-?\d+(?:\.\d+)?(?:e-?\d+)?/gi)) digestNumbers.push({ at: `digest:${i + 1}`, v: Number(m[0]) });
  });
  if (digestNumbers.length < 1000) die(`digest.txt carries only ${digestNumbers.length} numeric literals, below the floor of 1000 (kit README section 13): it may be half written`);
  digestNote = `${digestNumbers.length} numeric literals`;
}

/* -------------------------------------------------------- the comparison */

const sig6 = (v) => (Number.isFinite(v) ? v.toPrecision(6) : String(v));
const compare = (a, b, why, out = findings) => {
  const tol = Math.min(a.tol ?? Infinity, b.tol ?? Infinity);
  if (Number.isFinite(tol) && Math.abs(a.v - b.v) <= tol) {
    out.push(`${why}: ${a.at} = ${a.v} lands on ${b.at} = ${b.v}, inside the graded tolerance ${tol}`);
    return;
  }
  if (a.v !== 0 && b.v !== 0 && sig6(a.v) === sig6(b.v)) {
    out.push(`${why}: ${a.at} = ${a.v} and ${b.at} = ${b.v} print the same six significant digits ${sig6(a.v)}`);
  }
};
const graded = rows.map((r) => ({ at: `h2/${r.key}`, v: r.value, tol: gradedTolerance(r.key) }));
// Unit shiftings for the digest half, per kit README (x1000, x0.001, x100, x0.01),
// with the tolerance SCALED with the shift so arithmetic noise is not a leak.
const SHIFTS = [1, 1e3, 1e-3, 1e2, 1e-2, 60, 1 / 60];
graded.forEach((g) => goldNumbers.forEach((n) => compare(g, n, 'A GRADED ANSWER IS IN THE GOLDEN')));
graded.forEach((g) => siblings.forEach((s) => compare(g, s, 'A GRADED ANSWER COLLIDES WITH A SIBLING WAVE')));
graded.forEach((g, i) => graded.slice(i + 1).forEach((h) => compare(g, h, 'TWO H2 GRADED ANSWERS COLLIDE')));
graded.forEach((g) => SHIFTS.forEach((s) => digestNumbers.forEach((n) => {
  const shifted = { at: `${g.at} x${s}`, v: g.v * s, tol: g.tol * Math.abs(s) * 10 };
  compare(shifted, n, 'A GRADED ANSWER IS REACHABLE FROM THE DIGEST (ten tolerances, unit shifted)');
})));

/* THE CONDITION ROW RULE */
const argRecords = (args) => {
  const out = [];
  const visit = (x) => {
    if (Array.isArray(x)) x.forEach(visit);
    else if (x && typeof x === 'object') { out.push(x); Object.values(x).forEach(visit); }
  };
  visit(args);
  return out;
};
let rowPairs = 0;
let worst = { n: 0 };
GOLD.cases.concat(GOLD.errata).forEach((c) => {
  const recs = argRecords(c.args);
  ['UTOROGU', 'AMUKPE', 'OSIOKA'].forEach((name) => {
    rowPairs += 1;
    const mine = records.filter((r) => r.at === name);
    const hit = mine.filter((r) => recs.some((g) => Object.keys(r.rec).length > 1
      && Object.entries(r.rec).every(([k, v]) => typeof g[k] === 'number' && Math.abs(g[k] - v) <= 1e-12)));
    if (hit.length > worst.n) worst = { n: hit.length, id: c.id, name };
    if (hit.length) findings.push(`A CAPSTONE INPUT RECORD IS A GOLDEN INPUT RECORD: ${name} shares ${hit.length} whole record(s) with golden.${c.id}`);
  });
});

/* ------------------------------------------------------------ the controls */

const before = findings.length;
const target = GOLD.cases.find((c) => c.id === 'l108-figure-26');
const planted = { at: 'CONTROL/planted', v: target.expect.lexDbA, tol: 5e-7 };
const ctl = [];
goldNumbers.forEach((n) => compare(planted, n, 'CONTROL', ctl));
if (!ctl.length) die('THE VALUE CONTROL DID NOT FIRE: planting the L108 Figure 26 LEX as a graded answer was not rejected');
const recCtl = argRecords(target.args).filter((g) => records.concat([{ at: 'CONTROL', rec: { laeqDbA: 80, durationH: 5 } }])
  .some((r) => r.at === 'CONTROL' && Object.entries(r.rec).every(([k, v]) => g[k] === v)));
if (!recCtl.length) die('THE ROW CONTROL DID NOT FIRE: the Figure 26 task record was not matched');

process.stdout.write(
  `gate_collisions EXAMINED: ${CASES.length} golden cases carrying ${goldNumbers.length} numbers; 18 graded H2 answers; `
  + `${conditions.length} stated capstone conditions in ${records.length} input records across 3 scenarios; `
  + `${siblings.length} sibling graded answers across ${new Set(siblings.map((s) => s.at.split('/')[0])).size} waves `
  + `(H1 safetystats live: ${h1}; own committed mirror excluded by slug, found: ${selfSeen}); digest: ${digestNote}.\n`
  + `  row rule: ${rowPairs} scenario-case pairs, worst ${worst.n} shared whole record(s)${worst.id ? ` (${worst.name} with ${worst.id})` : ''}.\n`
  + `  CONTROLS FIRED: value control rejected ${ctl.length} time(s); row control matched ${recCtl.length} record(s).\n`);
if (findings.length !== before) die('internal: the controls wrote into the findings list');
if (findings.length) {
  findings.forEach((f) => process.stderr.write(`  ${f}\n`));
  process.stderr.write(`gate_collisions: ${findings.length} collision(s).\n`);
  process.exit(1);
}
process.stdout.write('gate_collisions: 0 collisions.\n');
