// digestprose. THE THREE SWEEPS THE DIGEST NEEDS, IN ONE GATE.
//
// This file grew twice, and each growth was paid for by a reader finding
// something a gate should have:
//
//   A. HEADINGS AGAINST THEIR OWN BLOCK. The two-figure sweep covered prose
//      and missed headings, and a section title survived it reading "the limit
//      it can break" over a table recording nothing broken. A heading is read
//      first and is the thing a writer builds a module on.
//
//   B. REPAIR HISTORY INSIDE A TEACHING SECTION. digest.txt is the ONE file
//      writers are told is teaching truth. RECON.md and FINDINGS.md both open
//      with a banner saying they are provenance; the digest has no such licence,
//      so a "used to" sentence sitting in it is worse there than anywhere else.
//      The Associate writer found one in Section 3 and refused it, which was
//      right. A sweep of all 809 lines then found three more.
//
//   C. THE OWNER COPY RULE. No em dash, no en dash, no double hyphen and no
//      "X, not Y" contrastive.
//
// VERBATIM ENGINE STRINGS ARE DEFERRED, NOT FAILED. Five lines of this digest
// break the copy rule inside text the engine itself returns, from
// pumps.js (the viscosity warning) and compression.js (the hot-stage warning).
// Changing one of those means changing the engine, its tests, this digest and
// any lesson quoting it, while Section 15 exists precisely to quote refusal
// messages EXACTLY. It is a programme-wide engines sweep after FC3's writers
// land. They must NOT be edited here: doing so desyncs the quote from the
// engine. This gate pins them by fragment, so if the engine text moves the
// gate says so instead of going quietly green.
//
// Usage: node digest_prose.mjs [digest.txt]   exit 1 on any hit that is ours.
import fs from 'fs';

const FILE = process.argv[2] || '/root/fc-wip-rotating/digest.txt';
const RAW = fs.readFileSync(FILE, 'utf8');
const D = RAW.replace(/\n$/, '').split('\n');

/* ---------- A. headings against the block beneath them ---------- */
const heads = [];
D.forEach((l, i) => {
  if (/^# SECTION /.test(l)) heads.push({ i, kind: 'section', text: l });
  else if (/^[A-Z][A-Z ,'`-]{12,}/.test(l)) heads.push({ i, kind: 'marker', text: l });
});
// A SECTION title owns everything down to the NEXT SECTION; a marker owns only
// down to the next heading of any kind. The first version of this gate gave a
// section title the same short block as a marker, so Section 13's block stopped
// before the table that refutes its title and the gate MISSED THE DEFECT IT WAS
// WRITTEN FOR. A gate that cannot catch its own founding case is the thing it
// was built to stop.
const sectionIdx = heads.filter((h) => h.kind === 'section').map((h) => h.i);
heads.forEach((h, k) => {
  h.end = k + 1 < heads.length ? heads[k + 1].i : D.length;
  if (h.kind === 'section') {
    const next = sectionIdx.find((i) => i > h.i);
    h.end = next === undefined ? D.length : next;
  }
});
const FORBIDDEN = [
  [/limit it can break|can break/i,
    (b) => /stages over the limit \| stages warned/.test(b) || / 0 \| 0 \|/.test(b),
    'a heading says a limit can be broken over a block that records none broken'],
  [/does not check|accept and should not/i,
    (b) => /is refused rather than classified|there is no verdict to give/.test(b),
    'a heading names a shortcoming over a block showing the engine refusing instead'],
  [/names none internally|every packaging is written inline at its point of use\./i,
    () => true, 'a claim about named internal constants that 4fa37e6 refutes'],
  [/USED TO|BEFORE IT FAILED/i,
    () => true, 'a heading framed on repair history, which is not teaching truth'],
];

/* ---------- B. repair history ---------- */
const HISTORY = /\bused to\b|\bwas the bug\b|before the repair|\bformerly\b|had been the|no longer returns|the old engine|709172f|used to be the answer|used to come back|used to disagree/i;
// Phrases that read as history but are not: present-tense "used to refuse", the
// pre-change duty point, "no longer affordable" about a live sweep, and the
// provenance of a golden file, which is a live property of that file rather
// than a claim about a past engine.
const NOT_HISTORY = /never used to refuse|the old duty point|was written through SI watts|was written by an oracle|no longer affordable/i;
// THE REGEX ABOVE IS A NET WITH A KNOWN HOLE, and it is named rather than
// papered over. It catches history that announces itself with "used to"; it
// does NOT catch history told in plain past tense, and the fourth hit of this
// wave's sweep was exactly that: "the object looked healthy, the coefficient
// was right, and the failure only appeared when the curve was called", which
// describes behaviour 4fa37e6 no longer has and contains no trigger word.
// So past-tense narrative in this file's own prose is WARNED rather than
// failed, and a human reads the short list instead of all 809 lines.
const PAST_NARRATIVE = /\b(looked|appeared|returned a|reported a|gave a|came back|recommended|printed|read ")\b/i;
const PAST_OK = /read back|read off|read at|read the|the note says|reads back/i;

/* ---------- C. owner copy rule ---------- */
const CONTRASTIVE = /,\s+not\s+\w/;
const EM = String.fromCharCode(0x2014);
const EN = String.fromCharCode(0x2013);
// The engine strings this digest quotes that break the copy rule, pinned by the
// fragment of each that carries no interpolation. Each is asserted to be
// present in its own module, so an engine edit turns this gate red rather than
// letting a stale quote pass.
const PINNED = [
  { frag: ', not a corrected centrifugal curve', src: 'engines/facilities/pumps.js' },
  { frag: 'become the limit, not the thermodynamics', src: 'engines/facilities/compression.js' },
];
const ENGROOT = process.env.FC3_ENGINES || '/root/wt-fc3-nextgen/packages/engines';
let pinBroken = 0;
for (const p of PINNED) {
  let src = '';
  try { src = fs.readFileSync(`${ENGROOT}/${p.src}`, 'utf8'); } catch { src = ''; }
  if (!src.includes(p.frag)) {
    console.log(`  FAIL pinned engine fragment is no longer in ${p.src}: "${p.frag}"`);
    console.log('        The engine message changed. Re-read the digest quote and this pin together.');
    pinBroken += 1;
  }
}
const isEngineQuote = (l) => PINNED.some((p) => l.includes(p.frag));

/* ---------- run ---------- */
let hits = pinBroken;
let deferred = 0;
const warns = [];
for (const h of heads) {
  const body = D.slice(h.i + 1, h.end).join('\n');
  for (const [re, test, why] of FORBIDDEN) {
    if (re.test(h.text) && test(body)) {
      console.log(`  FAIL line ${h.i + 1}: ${why}\n        ${h.text.slice(0, 120)}`);
      hits += 1;
    }
  }
}
D.forEach((l, i) => {
  const n = i + 1;
  if (HISTORY.test(l) && !NOT_HISTORY.test(l)) {
    console.log(`  FAIL line ${n}: repair history inside a teaching section, which digest.txt may not carry\n        ${l.slice(0, 120)}`);
    hits += 1;
  }
  // Past-tense narrative, warned for a human read. Table rows, bullet values
  // and engine quotes are skipped: those are returns, not our prose.
  if (!/^\| /.test(l) && !isEngineQuote(l) && /\b(was|were)\b/.test(l)
      && PAST_NARRATIVE.test(l) && !PAST_OK.test(l) && !HISTORY.test(l)) {
    warns.push(`  WARN line ${n}: past-tense narrative in this file's own prose, read it against what 4fa37e6 does today\n        ${l.slice(0, 120)}`);
  }
  if (CONTRASTIVE.test(l) || l.includes(EM) || l.includes(EN) || / -- /.test(l)) {
    if (isEngineQuote(l)) {
      console.log(`  deferred line ${n}: owner copy rule inside a VERBATIM ENGINE STRING. Do not edit here; engines-repo sweep.`);
      deferred += 1;
    } else {
      console.log(`  FAIL line ${n}: owner copy rule in this file's own prose\n        ${l.slice(0, 120)}`);
      hits += 1;
    }
  }
});
warns.forEach((x) => console.log(x));
console.log(`digestprose: ${D.length} lines examined; ${warns.length} warned for a human read; ${heads.filter((h) => h.kind === 'section').length} section titles and ${heads.filter((h) => h.kind === 'marker').length} in-body markers swept against their blocks; ${deferred} deferred as verbatim engine strings; ${hits} failing`);
process.exitCode = hits ? 1 : 0;
