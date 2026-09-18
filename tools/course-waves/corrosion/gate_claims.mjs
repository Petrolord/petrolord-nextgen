// GATE: every NUMBER a writer brief states is QUOTED FROM THE DIGEST, and every
// claim a brief makes about the wave's own shape is checked against the file that
// settles it.
//
// WHY THIS GATE EXISTS. FC1's Expert brief carried two figures that came from the
// wave's RECON REPORT rather than from the digest, and both were wrong. The
// writer correctly refused to invent them, which is the only reason it was caught:
// nothing in the wave checked a brief against anything. The recon and findings
// reports, the engine's source comments and the repair record vendored beside the
// oracle are all PROVENANCE, and none of the four is teaching truth.
//
// So every figure in BRIEF.md, LESSON_TASK.md, BANK_TASK.md, KEY_TRUTH_TASK.md and
// PANELS.md must appear in digest.txt at one of the precisions the digest prints,
// or be declared in ALLOWED below with the reason it is structural rather than a
// measurement. A DEAD declaration fails, so the ledger cannot go stale.
//
// AND IT CHECKS THE STRUCTURAL CLAIMS TOO: the lesson count, the module count,
// the word band, the field count, the digest's own line and section counts, and
// the three legislated naming collisions, each against the file that settles it.
//
//   node gate_claims.mjs
//   node gate_claims.mjs --plant-a-recon-figure   THE NEGATIVE CONTROL
//
// Exit 0 clean, 1 on a finding, 2 if it cannot run.
import fs from 'node:fs';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const HERE = '/root/fc-wip-corrosion';
const BRIEFS = ['BRIEF.md', 'LESSON_TASK.md', 'BANK_TASK.md', 'KEY_TRUTH_TASK.md', 'PANELS.md'];
const PLANT = process.argv.includes('--plant-a-recon-figure');

const read = (f) => { try { return fs.readFileSync(`${HERE}/${f}`, 'utf8'); } catch { return null; } };
const DIGEST = read('digest.txt');
if (DIGEST === null) { console.log('REFUSED: no digest.txt, so nothing could be checked against it'); process.exit(2); }
const WAVE = JSON.parse(read('wave.json'));
const FIELDS = JSON.parse(read('fields.json'));
const RECON = read('RECON.md');
const FINDINGS = read('FINDINGS.md');

/** Every rendering of every number the digest prints. */
/**
 * A NUMERIC LITERAL, AND THE ONE THING THIS REGEX HAD WRONG.
 *
 * The obvious form, `(?<![\w.])-?\d+(?:\.\d+)?(?![\w.])`, REJECTS EVERY NUMBER
 * AT THE END OF A SENTENCE. A trailing full stop satisfies the `[\w.]` lookahead,
 * so "a factor of 316.227766." matched nothing at all. This gate found that on its
 * own first real run, by reporting a figure as absent from the digest that the
 * digest plainly printed. A sentence-final number is the commonest shape a writer
 * produces, so the gap was not a corner case.
 *
 * The trailing guard is therefore TWO negatives: not a word character, and not a
 * period followed by a digit. That keeps "1.2.3" from matching "1.2" while letting
 * "316.227766." match the number and leave the stop behind.
 */
const NUM = /(?<![\w.])-?\d+(?:\.\d+)?(?!\w)(?!\.\d)/g;
const renderings = (s) => {
  const out = new Set([s]);
  const v = Number(s);
  if (!Number.isFinite(v)) return out;
  [0, 1, 2, 3, 4, 6, 12].forEach((dp) => {
    out.add(v.toFixed(dp));
    out.add(v.toFixed(dp).includes('.') ? v.toFixed(dp).replace(/0+$/, '').replace(/\.$/, '') : v.toFixed(dp));
  });
  [3, 4, 6, 9, 12].forEach((sig) => out.add(v.toPrecision(sig)));
  return out;
};
const DIGEST_OK = new Set();
[...DIGEST.matchAll(NUM)].forEach((m) => renderings(m[0]).forEach((r) => DIGEST_OK.add(r)));

/**
 * Numbers a brief may state that are NOT digest figures, each with the file that
 * settles it. A dead entry fails this gate.
 */
const ALLOWED = {
  78: 'the lesson count, settled by structure.py',
  396: 'the question count of this wave, 132 a tier, settled by the banks and counted by wave_check',
  792: 'the field texts of one tier\'s 132 questions at a prompt, an explanation and four options each, which is the corpus the Expert writer swept by hand when gate_capstone_leak.py had no --banks path',
  26: 'the lessons a tier, settled by structure.py',
  33: 'the tests in the two panel suites, settled by the vitest run itself',
  420: 'the bottom of the word band, settled by structure.py',
  460: 'the middle minimum of the word band, settled by structure.py',
  560: 'the ceiling of the word band, settled by structure.py',
  42: 'the exam questions, settled by wave.json',
};

const findings = [];
const hit = new Set();
let briefsRead = 0;
let numbersSwept = 0;

BRIEFS.forEach((f) => {
  let text = read(f);
  if (text === null) {
    findings.push(`MISSING BRIEF: ${f}. A writer with no brief invents, and this wave has eleven held `
      + 'items and one withdrawal for them to invent around.');
    return;
  }
  if (PLANT && f === 'BRIEF.md') {
    // THE NEGATIVE CONTROL. A figure taken from the recon report rather than the
    // digest, which is exactly the FC1 defect.
    text += '\n\nThe engine carries 55 findings and 35 of them are reachable by typing into a box.\n';
  }
  briefsRead += 1;
  // Strip fenced blocks and inline code, because a brief quoting a field KEY or a
  // command is not stating a measurement.
  const prose = text.replace(/```[\s\S]*?```/g, ' ').replace(/`[^`]*`/g, ' ');
  [...prose.matchAll(NUM)].forEach((m) => {
    const lit = m.group ? m.group(0) : m[0];
    numbersSwept += 1;
    if (DIGEST_OK.has(lit)) return;
    if (Object.prototype.hasOwnProperty.call(ALLOWED, lit)) { hit.add(lit); return; }
    const where = prose.slice(Math.max(0, m.index - 60), m.index + 40).replace(/\s+/g, ' ');
    const inRecon = (RECON && RECON.includes(lit)) || (FINDINGS && FINDINGS.includes(lit));
    findings.push(`${f}: the figure ${lit} is not in the digest and is not declared`
      + `${inRecon ? ' AND IT IS IN THE RECON OR FINDINGS REPORT, which is the FC1 defect exactly' : ''}`
      + `\n        ...${where}...`);
  });
});

/* ---------------------------------------- the structural claims, each checked */

const checks = [];
const check = (claim, cond, evidence) => checks.push({ claim, pass: !!cond, evidence: String(evidence) });
const structure = execFileSync('python3', [`${HERE}/structure.py`], { encoding: 'utf8' });
check('structure.py reports 78 lessons', structure.includes('78 lessons'), structure.split('\n')[0]);
check('structure.py reports 18 modules', structure.includes('18 modules'), structure.split('\n')[0]);
check('structure.py reports zero problems', /PROBLEMS: 0/.test(structure), 'structure.py');
check('fields.json carries eighteen fields, six a tier', FIELDS.length === 18
  && Object.values(FIELDS.reduce((a, f) => ({ ...a, [f[0]]: (a[f[0]] || 0) + 1 }), {})).every((n) => n === 6),
  `${FIELDS.length} fields`);
check('the digest line count wave.json claims is the digest\'s',
  WAVE.digest.lines === DIGEST.replace(/\n$/, '').split('\n').length, `${WAVE.digest.lines}`);
check('the three legislated naming collisions are all in digest section 22',
  ['inhibitor', 'erosion', 'friction factor'].every((w) => (DIGEST.split('# SECTION 22')[1] ?? '').split('# SECTION 23')[0].includes(w)),
  'digest section 22');
check('every brief that exists names digest.txt as its only source of numbers',
  BRIEFS.every((f) => { const t = read(f); return t === null || /digest\.txt/.test(t); }),
  BRIEFS.filter((f) => { const t = read(f); return t !== null && !/digest\.txt/.test(t); }).join(',') || 'all name it');
check('every brief that exists says the recon and findings reports are PROVENANCE and not teaching truth',
  BRIEFS.every((f) => { const t = read(f); return t === null || /provenance/i.test(t); }),
  BRIEFS.filter((f) => { const t = read(f); return t !== null && !/provenance/i.test(t); }).join(',') || 'all say it');

const dead = Object.keys(ALLOWED).filter((k) => !hit.has(k));
const stale = checks.filter((c) => !c.pass);

console.log(`gate_claims: ${briefsRead} of ${BRIEFS.length} briefs read, ${numbersSwept} numbers swept in their prose`);
console.log(`  digest renderings available to resolve against: ${DIGEST_OK.size}`);
console.log(`  structural claims checked against the file that settles each: ${checks.length}`);
checks.forEach((c) => console.log(`    ${c.pass ? 'ok  ' : 'STALE'} ${c.claim}  [${c.evidence.slice(0, 70)}]`));
console.log(`  declared non-digest figures: ${Object.keys(ALLOWED).length}, hit: ${hit.size}, DEAD: ${dead.length} -> ${dead}`);
console.log(`  FINDINGS: ${findings.length + stale.length}`);
findings.forEach((f) => console.log(`   ${f}`));
if (briefsRead === 0) {
  console.log('  GATE REFUSES: it read no briefs at all, so it examined nothing.');
  process.exit(2);
}
if (PLANT) {
  const caught = findings.filter((f) => f.includes('RECON OR FINDINGS REPORT')).length;
  console.log(`  NEGATIVE CONTROL: a figure from the recon report was planted in BRIEF.md. Expected it `
    + `caught and named as a recon figure, got ${caught}.`);
  process.exit(caught > 0 ? 1 : 2);
}
if (dead.length) {
  console.log('  GATE FAILS: a declared non-digest figure that no brief states is a dead row, not an amnesty');
  process.exit(1);
}
process.exit(findings.length + stale.length ? 1 : 0);
