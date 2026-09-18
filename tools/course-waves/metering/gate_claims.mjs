// GATE: every NUMBER a writer brief states is QUOTED FROM THE DIGEST, and every
// claim a brief makes about the wave's own shape is checked against the file
// that settles it.
//
// WHY THIS GATE EXISTS. A sibling wave's brief carried sixteen figures that came
// from the wave's RECON REPORT rather than from the digest, and every one was
// wrong. The writer refused to invent them, which is the only reason it was
// caught: nothing in that wave checked a brief against anything. The recon and
// findings reports, the engine source comments and the repair record vendored
// beside the oracle are all PROVENANCE, and none of the four is teaching truth.
//
// So every figure in BRIEF.md, LESSON_TASK.md, BANK_TASK.md, KEY_TRUTH_TASK.md
// and PANELS.md must appear in digest.txt at one of the precisions the digest
// prints, or be declared in ALLOWED below with the reason it is structural
// rather than a measurement. A DEAD declaration fails, so the ledger cannot go
// stale.
//
// AND IT CHECKS THE STRUCTURAL CLAIMS TOO, each against the file that settles
// it: the lesson and module counts, the graded field count, the digest's own
// line and section counts, the tolerance rule, and that every brief names
// digest.txt as its only source of numbers and says the recon and findings are
// provenance.
//
//   node gate_claims.mjs
//   node gate_claims.mjs --plant-a-recon-figure   THE NEGATIVE CONTROL
//
// Exit 0 clean, 1 on a finding, 2 if it cannot run.
import fs from 'node:fs';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const HERE = process.env.FC8_WAVE_DIR || '/root/fc-wip-metering';
const BRIEFS = ['BRIEF.md', 'LESSON_TASK.md', 'BANK_TASK.md', 'KEY_TRUTH_TASK.md', 'PANELS.md'];
const PLANT = process.argv.includes('--plant-a-recon-figure');

const read = (f) => { try { return fs.readFileSync(`${HERE}/${f}`, 'utf8'); } catch { return null; } };
const DIGEST = read('digest.txt');
if (DIGEST === null) { console.log('REFUSED: no digest.txt, so nothing could be checked against it'); process.exit(2); }
const WAVE = JSON.parse(read('wave.json'));
const FIELDS = JSON.parse(read('fields.json'));
const RECON = read('RECON.md');
const FINDINGS = read('FINDINGS.md');

/**
 * A NUMERIC LITERAL, AND THE ONE THING THE OBVIOUS REGEX HAS WRONG. The obvious
 * form rejects every number at the END OF A SENTENCE, because a trailing full
 * stop satisfies a `[\w.]` lookahead, and a sentence-final number is the
 * commonest shape a writer produces. The trailing guard here is TWO negatives:
 * not a word character, and not a period followed by a digit.
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

/** Numbers a brief may state that are NOT digest figures, each with the file
 *  that settles it. A dead entry fails this gate. */
// IT IS DELIBERATELY EMPTY. Every structural count in these five briefs is
// written in words rather than in digits, and every standard is named without
// its number, so there is nothing to declare. An empty ledger is the strongest
// state this can be in: the alternative is a row that has to be justified, and
// a row nothing hits fails below as a dead row.
const ALLOWED = {};

/* The probe for the negative control: a figure the provenance reports carry that
   the digest cannot vouch for at any rendering. Searched for rather than typed. */
const PROVENANCE = `${RECON || ''}\n${FINDINGS || ''}`;
const PROBE = [...new Set([...PROVENANCE.matchAll(NUM)].map((m) => m[0]))]
  .find((x) => !DIGEST_OK.has(x) && Number(x) > 10 && Number.isInteger(Number(x)));

const findings = [];
const hit = new Set();
let briefsRead = 0;
let numbersSwept = 0;

BRIEFS.forEach((f) => {
  let text = read(f);
  if (text === null) {
    findings.push(`MISSING BRIEF: ${f}. A writer with no brief invents, and this wave has fifteen `
      + 'held items and two outright refusals for them to invent around.');
    return;
  }
  if (PLANT && f === 'BRIEF.md') {
    // THE NEGATIVE CONTROL. A figure taken from the recon or findings report
    // rather than from the digest, which is the sibling defect exactly.
    //
    // THE PLANT IS SEARCHED FOR RATHER THAN TYPED. A hard-coded probe can be a
    // figure the digest happens to vouch for at some rounding, and then the
    // control passes while proving nothing. This one takes the first figure
    // that IS in the provenance reports and is NOT resolvable against the
    // digest at any of the renderings above, and the gate refuses if no such
    // figure exists.
    if (!PROBE) {
      console.log('  GATE REFUSES: no figure exists that the provenance reports carry and the '
        + 'digest cannot vouch for, so the negative control would be vacuous on this wave');
      process.exit(2);
    }
    text += `\n\nThe repair record says the packaged constant was ${PROBE}.\n`;
  }
  briefsRead += 1;
  // Fenced blocks and inline code are stripped, because a brief quoting a field
  // key or a command is not stating a measurement.
  const prose = text.replace(/```[\s\S]*?```/g, ' ').replace(/`[^`]*`/g, ' ');
  [...prose.matchAll(NUM)].forEach((m) => {
    const lit = m[0];
    numbersSwept += 1;
    if (DIGEST_OK.has(lit)) return;
    if (Object.prototype.hasOwnProperty.call(ALLOWED, lit)) { hit.add(lit); return; }
    const where = prose.slice(Math.max(0, m.index - 60), m.index + 40).replace(/\s+/g, ' ');
    const inRecon = (RECON && RECON.includes(lit)) || (FINDINGS && FINDINGS.includes(lit));
    findings.push(`${f}: the figure ${lit} is not in the digest and is not declared`
      + `${inRecon ? ' AND IT IS IN THE RECON OR FINDINGS REPORT, which is the sibling defect exactly' : ''}`
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
check("the digest line count wave.json claims is the digest's",
  WAVE.digest.lines === DIGEST.replace(/\n$/, '').split('\n').length, `${WAVE.digest.lines}`);
check("the digest section count wave.json claims is the digest's",
  WAVE.digest.sections === DIGEST.split('\n').filter((l) => l.startsWith('# SECTION')).length,
  `${WAVE.digest.sections}`);
check('every brief names digest.txt as its only source of numbers',
  BRIEFS.every((f) => { const t = read(f); return t === null || /digest\.txt/.test(t); }),
  BRIEFS.filter((f) => { const t = read(f); return t !== null && !/digest\.txt/.test(t); }).join(',') || 'all name it');
check('every brief says the recon and findings reports are PROVENANCE and not teaching truth',
  BRIEFS.every((f) => { const t = read(f); return t === null || /provenance/i.test(t); }),
  BRIEFS.filter((f) => { const t = read(f); return t !== null && !/provenance/i.test(t); }).join(',') || 'all say it');
check('every brief tells its reader to verify the brief rather than trusting it',
  BRIEFS.every((f) => { const t = read(f); return t === null || /VERIFY THIS/i.test(t); }),
  BRIEFS.filter((f) => { const t = read(f); return t !== null && !/VERIFY THIS/i.test(t); }).join(',') || 'all say it');
check('the lesson task file says HEADINGS ARE COUNTED, which is what lengths.py does',
  /EVERYTHING ELSE IS COUNTED. THAT INCLUDES EVERY HEADING/.test(read('LESSON_TASK.md') || ''),
  'LESSON_TASK.md');
check('no brief repeats the old claim that headings are excluded',
  !BRIEFS.some((f) => /headings? (are|is) excluded/i.test(read(f) || '')),
  'no brief says it');
check('the tolerance rule is stated as a maximum in wave.json',
  /max\(stated/.test(WAVE.fields.toleranceRule) && /MAX and never MIN/.test(WAVE.fields.toleranceRule),
  WAVE.fields.toleranceRule.slice(0, 60));
check('the withheld fire vent is named in the brief and said to be graded nowhere',
  /fire vent/i.test(read('BRIEF.md')) && /graded nowhere/i.test(read('BRIEF.md')), 'BRIEF.md');

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
  console.log('  NEGATIVE CONTROL: a figure from the recon report was planted in BRIEF.md. Expected it '
    + `caught and named as a recon figure, got ${caught}.`);
  process.exit(caught > 0 ? 1 : 2);
}
if (dead.length) {
  console.log('  GATE FAILS: a declared non-digest figure that no brief states is a dead row, not an amnesty');
  process.exit(1);
}
process.exit(findings.length + stale.length ? 1 : 0);
