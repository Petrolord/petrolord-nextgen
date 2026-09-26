// GATE: every NUMBER a writer brief states is QUOTED FROM THE DIGEST, and every
// claim a brief makes about the wave's own shape is checked against the file that
// settles it.
//
// WHY THIS GATE EXISTS. FC1's Expert brief carried two figures that came from the
// wave's RECON REPORT rather than from the digest, and both were wrong. In EC7 the
// audit, the engine's FINDINGS record, the oracle and its golden and the
// engine's source comments are PROVENANCE, and none of them is teaching
// truth. (Adapted from SC2's gate_claims.mjs, itself D5's, D4's, D3's, D2's,
// D1's, H1's and FC9's.)
//
// So every figure in BRIEF.md, LESSON_TASK.md, BANK_TASK.md, KEY_TRUTH_TASK.md and
// PANELS.md must appear in digest.txt at one of the precisions the digest prints,
// or be declared in ALLOWED below with the reason it is structural rather than a
// measurement. A DEAD declaration fails, so the ledger cannot go stale.
//
// AND IT CHECKS THE STRUCTURAL CLAIMS TOO: the lesson count, the module count,
// the word band, the field count, the digest's own line and section counts, and
// the six legislated words, each against the file that settles it.
//
//   node gate_claims.mjs
//   node gate_claims.mjs --plant-a-recon-figure   THE NEGATIVE CONTROL
//
// Exit 0 clean, 1 on a finding, 2 if it cannot run.
import fs from 'node:fs';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const HERE = process.env.EC7_WAVE_DIR || '/root/cat-wip-pia';
const ENG = process.env.EC7_ENGINES || '/root/wt-ec7-nextgen/packages/engines';
const BRIEFS = ['BRIEF.md', 'LESSON_TASK.md', 'BANK_TASK.md', 'KEY_TRUTH_TASK.md', 'PANELS.md'];
const PLANT = process.argv.includes('--plant-a-recon-figure');

const read = (f) => { try { return fs.readFileSync(`${HERE}/${f}`, 'utf8'); } catch { return null; } };
const DIGEST = read('digest.txt');
if (DIGEST === null) { console.log('REFUSED: no digest.txt, so nothing could be checked against it'); process.exit(2); }
const WAVE = JSON.parse(read('wave.json'));
const FIELDS = JSON.parse(read('fields.json'));
const RECON = (() => { try { return fs.readFileSync(`${HERE}/AUDIT-PIA-ENGINE.md`, 'utf8'); } catch { return null; } })();
const FINDINGS = (() => { try { return fs.readFileSync(`${ENG}/tools/validation/economics/FINDINGS-pia2021.md`, 'utf8'); } catch { return null; } })();
if (FINDINGS === null) { console.log('REFUSED: the vendored FINDINGS record could not be read, so a figure taken from it could not be named'); process.exit(2); }

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
// Figures a brief may state that are NOT digest figures. Every other structural
// number in the briefs (78, 26, 18 and the rest) happens to be printed somewhere
// in the digest, so it resolves there; a DEAD entry fails this gate.
const ALLOWED = {
  72: 'the path order of the course in the economics module, settled by wave.json pathOrder and the plan of record',
  78: 'the lesson count, settled by structure.py (checked below)',
  132: 'the questions a tier, 6 banks of 15 plus a 42 question exam, settled by the bank stubs\' expect_n',
  42: 'the exam size, settled by the exam stubs\' expect_n',
  420: 'the bottom of the word band, settled by structure.py',
  460: 'the middle minimum of the word band, settled by structure.py',
  500: 'the top minimum of the word band, settled by structure.py',
  560: 'the ceiling of the word band, settled by structure.py',
  0.45: 'the Jaccard threshold of the kit near-duplicate audit (dupaxes.py), named in KEY_TRUTH_TASK.md',
};

const findings = [];
const hit = new Set();
let briefsRead = 0;
let numbersSwept = 0;

BRIEFS.forEach((f) => {
  let text = read(f);
  if (text === null) {
    findings.push(`MISSING BRIEF: ${f}. A writer with no brief invents.`);
    return;
  }
  if (PLANT && f === 'BRIEF.md') {
    // THE NEGATIVE CONTROL. A figure taken from the recon report rather than the
    // digest, which is exactly the FC1 defect.
    text += '\n\nThe audit counted 66 rows.\n';
  }
  briefsRead += 1;
  // Strip fenced blocks and inline code, because a brief quoting a field KEY or a
  // command is not stating a measurement.
  const prose = text.replace(/```[\s\S]*?```/g, ' ').replace(/`[^`]*`/g, ' ');
  [...prose.matchAll(NUM)].forEach((m) => {
    const lit = m.group ? m.group(0) : m[0];
    numbersSwept += 1;
    // A DECLARED figure is checked FIRST: a word-band figure is settled by
    // wave.json even if the digest prints 69 for another reason. Digits printed alike are not the same
    // figure, and the declaration must not go dead by coincidence.
    if (Object.prototype.hasOwnProperty.call(ALLOWED, lit)) { hit.add(lit); return; }
    if (DIGEST_OK.has(lit)) return;
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
  WAVE.digest && WAVE.digest.lines === DIGEST.replace(/\n$/, '').split('\n').length, `${WAVE.digest && WAVE.digest.lines}`);
check('the digest section count wave.json claims is the digest\'s',
  WAVE.digest && WAVE.digest.sections === (DIGEST.match(/^# SECTION \d+:/gm) || []).length, `${WAVE.digest && WAVE.digest.sections}`);
const VOCAB = (DIGEST.split(/^# SECTION \d+: Vocabulary/m)[1] ?? '');
check('the legislated words are all in the vocabulary section',
  ['royalty', 'royalty by price', 'terrain', 'converted lease', 'new lease', 'a year under the Act alone', 'a year under the Nigeria Tax Act 2025',
    'open reading', 'stated reading', 'government take', 'at the share', 'concept-only'].every((w) => VOCAB.includes(`| ${w} |`)),
  'digest vocabulary section');
check('the BRIEF tier table matches the owners the digest prints',
  (() => {
    const heads = DIGEST.match(/^# SECTION (\d+):.*\(owned by ([^)]*)\)$/gm) || [];
    const own = { Associate: [], Professional: [], Expert: [] };
    heads.forEach((h) => { const n = Number(h.match(/SECTION (\d+)/)[1]); Object.keys(own).forEach((t) => { if (new RegExp(t).test(h.match(/\(owned by ([^)]*)\)/)[1])) own[t].push(n); }); });
    const ranges = (a) => { const out = []; let i = 0; while (i < a.length) { let j = i; while (j + 1 < a.length && a[j + 1] === a[j] + 1) j += 1; out.push(j > i + 1 ? `${a[i]} to ${a[j]}` : (j === i + 1 ? `${a[i]}, ${a[j]}` : `${a[i]}`)); i = j + 1; } return out; };
    const phrase = (a) => { const r = ranges(a); return r.length > 1 ? `${r.slice(0, -1).join(', ')} and ${r[r.length - 1]}` : r[0]; };
    const brief = (read('BRIEF.md') || '').replace(/\s+/g, ' ');
    return heads.length === 25 && Object.entries(own).every(([t, a]) => brief.includes(`| ${t} |`) && brief.includes(`| ${phrase(a)} |`));
  })(), 'section owner clauses against the BRIEF table');
check('the refusal count the BRIEF states is the digest\'s',
  (read('BRIEF.md') || '').replace(/\s+/g, ' ').includes(`tables ${(DIGEST.match(/^(\d+) refusals\. Four rules the table shows:$/m) || [])[1]} refusals`), 'BRIEF.md against the refusal section');
check('the provision counts the BRIEF states are the digest\'s',
  (() => { const m = DIGEST.match(/^(\d+) provisions: (\d+) computed, (\d+) concept-only\.$/m); return m && (read('BRIEF.md') || '').replace(/\s+/g, ' ').includes(`${m[1]} provisions, ${m[2]} computed and ${m[3]} concept-only`); })(),
  'BRIEF.md against the provision map');
check('the BRIEF names the three open readings wave.json records',
  Object.keys(WAVE.openReadings || {}).length === 3 && /royalty by price base year/.test(read('BRIEF.md') || '') && /new acreage, onshore or\s+in shallow water/.test(read('BRIEF.md') || '') && /deep offshore hydrocarbon tax under the Nigeria Tax Act 2025/.test(read('BRIEF.md') || ''),
  'BRIEF.md against wave.json openReadings');
check('every brief that exists says the practicals run in the course calculator panels, with no Suite app',
  ['BRIEF.md', 'LESSON_TASK.md', 'PANELS.md'].every((f) => /no Suite app/.test(read(f) || '')), 'BRIEF, LESSON_TASK, PANELS');
check('the BRIEF states the regulatory rule',
  /THE REGULATORY RULE/.test(read('BRIEF.md') || '') && /Licensed texts are never quoted/.test(read('BRIEF.md') || ''), 'BRIEF.md');
check('every brief that exists names digest.txt as its only source of numbers',
  BRIEFS.every((f) => { const t = read(f); return t === null || /digest\.txt/.test(t); }),
  BRIEFS.filter((f) => { const t = read(f); return t !== null && !/digest\.txt/.test(t); }).join(',') || 'all name it');
check('every brief that exists says the audit, the FINDINGS record and the source comments are PROVENANCE',
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
