// digestprose, FC4. THE THREE SWEEPS THE DIGEST NEEDS, IN ONE GATE.
//
// Adapted from FC3's consolidated gate, which replaced two half-gates that
// both had to be run. The three sweeps:
//
//   A. HEADINGS AGAINST THEIR OWN BLOCK. A heading is read first and is the
//      thing a writer builds a module on, and a two-figure sweep of prose
//      does not see it. A section title claiming behaviour the table under
//      it does not show is the defect this catches.
//
//   B. REPAIR HISTORY INSIDE A TEACHING SECTION. digest.txt is the ONE file
//      writers are told is teaching truth. RECON.md and FINDINGS.md open
//      with a banner saying they are provenance; the digest has no such
//      licence, so a "used to" sentence is worse here than anywhere else.
//      FC3 shipped three of these into committed lesson text, and two of
//      the three were not the writers' fault: they took what the digest
//      said. A keyword net does not catch plain past tense, so past-tense
//      narrative is WARNED for a human read rather than failed.
//
//   C. THE OWNER COPY RULE. No em dash, no en dash, no double hyphen and no
//      "X, not Y" contrastive.
//
// VERBATIM ENGINE STRINGS ARE PINNED. Section 4, 10 and 15 quote the
// engine's own refusal and warning messages EXACTLY, because the message is
// the teaching object. Each quoted fragment is asserted to still be present
// in the engine module it comes from, so an upstream engine edit turns this
// gate RED instead of letting a stale quote pass as current behaviour. A
// pinned fragment that breaks the copy rule is DEFERRED rather than failed,
// because editing it here would desync the quote from the engine.
//
// Usage: node digest_prose.mjs [digest.txt]   exit 1 on any hit that is ours.
import fs from 'fs';

const FILE = process.argv[2] || '/root/fc-wip-gasprocessing/digest.txt';
const ENGROOT = process.env.FC4_ENGINES || '/root/wt-fc4-nextgen/packages/engines';
const RAW = fs.readFileSync(FILE, 'utf8');
const D = RAW.replace(/\n$/, '').split('\n');

/* ---------- A. headings against the block beneath them ---------- */
const heads = [];
D.forEach((l, i) => {
  if (/^# SECTION /.test(l)) heads.push({ i, kind: 'section', text: l });
  else if (/^# [A-Z]/.test(l)) heads.push({ i, kind: 'sub', text: l });
  else if (/^[A-Z][A-Z ,'`-]{12,}/.test(l)) heads.push({ i, kind: 'marker', text: l });
});
const sectionIdx = heads.filter((h) => h.kind === 'section').map((h) => h.i);
heads.forEach((h, k) => {
  h.end = k + 1 < heads.length ? heads[k + 1].i : D.length;
  if (h.kind === 'section') {
    const next = sectionIdx.find((i) => i > h.i);
    h.end = next === undefined ? D.length : next;
  }
});
// Each entry: a heading pattern, a test on the block that says the heading is
// NOT supported, and why. The test returns true when the heading is wrong.
const FORBIDDEN = [
  [/WITHHELD/i, (b) => b.trim().length > 0 && !/prints NOTHING|prints none/i.test(b),
    'a heading says WITHHELD over a block that prints content'],
  [/outside the contract/i, (b) => !/BARE NUMBER|bare number/i.test(b),
    'a heading claims an export sits outside the error contract, and the block under it shows none'],
  [/does not move|is rate independent/i, (b) => {
    const rows = b.split('\n').filter((l) => /^\| /.test(l) && !/^\| ---/.test(l));
    return rows.length > 2 && new Set(rows.map((r) => r.split('|').pop())).size > 1;
  }, 'a heading claims a column does not move over a table whose last column does'],
  [/no published case|NO published case/i, (b) => /golden mu|golden cooling/i.test(b),
    'a heading says a routine has no published case over a block printing its published cases'],
];

/* ---------- B. repair history ---------- */
const HISTORY = /\bused to\b|\bwas the bug\b|before the repair|\bformerly\b|had been the|no longer returns|no longer inert|the old engine|the old value|used to be the answer|used to come back|used to disagree|used to carry|used to quote|709172f|fa53f7f|since the repair|after the repair|prior to FC4|the pre-repair/i;
// Phrases that read as history but are not. The commit the digest was BUILT
// from is a live property of this file, not a claim about a past engine.
const NOT_HISTORY = /vendored sha-identical|Built against engines/i;
// A NET WITH A KNOWN HOLE, named rather than papered over. It catches history
// that announces itself. It does NOT catch history told in plain past tense,
// which was FC3's worst instance and carried no trigger word at all, so
// past-tense narrative is WARNED and a human reads the short list.
const PAST_NARRATIVE = /\b(looked|appeared|returned a|reported a|gave a|came back|recommended|printed|hid|stood|meant that|read as)\b/i;
const PAST_OK = /read back|read off|read at|read the|the note says|reads back|was written|was typed|was handed|was built from|was drawn with/i;

/* ---------- C. owner copy rule, and the engine strings it defers ---------- */
const CONTRASTIVE = /,\s+not\s+\w/;
const EM = String.fromCharCode(0x2014);
const EN = String.fromCharCode(0x2013);
// Every engine message family this digest quotes verbatim, pinned by a
// fragment that carries no interpolated value. If the engine's wording moves,
// the quote in the digest is stale and this gate says so.
const PINNED = [
  ['must be a finite number above zero', 'engines/facilities/gasProcessing.js'],
  ['must be a finite temperature above absolute zero', 'engines/facilities/gasProcessing.js'],
  ['the Magnus water-saturation fit holds from', 'engines/facilities/gasProcessing.js'],
  ['must exceed the water vapour pressure', 'engines/facilities/gasProcessing.js'],
  ['or the gas is not a gas', 'engines/facilities/gasProcessing.js'],
  ['the real-gas correction of the McKetta-Wehe chart grows to tens of percent', 'engines/facilities/gasProcessing.js'],
  ['the Magnus coefficients were published over', 'engines/facilities/gasProcessing.js'],
  ['leaves nothing for the contactor to do', 'engines/facilities/gasProcessing.js'],
  ['below 90 the loop is not a dehydration loop and 100 is unreachable', 'engines/facilities/gasProcessing.js'],
  ['the reboiler must be hotter than the absorber', 'engines/facilities/gasProcessing.js'],
  ['circulation ratio outside the customary 2 to 5 gal per lb', 'engines/facilities/gasProcessing.js'],
  ['the loop is carrying more water than a glycol loop is meant to', 'engines/facilities/gasProcessing.js'],
  ['the dew point lean glycol can deliver is a chart this module does not carry', 'engines/facilities/gasProcessing.js'],
  // Composed by the shared range helper, so the template and the name that
  // fills it are pinned separately; the joined sentence exists only at run time.
  ['must be between ${lo} and ${hi}', 'engines/facilities/gasProcessing.js'],
  ["needInRange(btexAbsorbedFrac, 0, 1, 'BTEX absorbed fraction')", 'engines/facilities/gasProcessing.js'],
  ['leaves no swing to circulate on', 'engines/facilities/gasProcessing.js'],
  ['no acid gas to remove at these specs', 'engines/facilities/gasProcessing.js'],
  ['a spec above the inlet is already met', 'engines/facilities/gasProcessing.js'],
  ['amine strength must be above 0 and at or below 100 weight percent', 'engines/facilities/gasProcessing.js'],
  ["needPositive(duty, 'regenerator duty', 'Btu per gallon circulated')", 'engines/facilities/gasProcessing.js'],
  ['corrosion territory', 'engines/facilities/gasProcessing.js'],
  ['this module carries', 'engines/facilities/gasProcessing.js'],
  ['the fraction removed must be between 0 and 1, exclusive', 'engines/facilities/gasProcessing.js'],
  ['however many stages are added', 'engines/facilities/gasProcessing.js'],
  ['raise circulation', 'engines/facilities/gasProcessing.js'],
  ['the liquid must be denser than the gas for Souders-Brown to mean anything', 'engines/facilities/gasProcessing.js'],
  ['the march needs a positive whole number of steps', 'engines/facilities/gasProcessing.js'],
  ['a Joule-Thomson let-down needs the inlet above the outlet', 'engines/facilities/gasProcessing.js'],
  ['the march died at step', 'engines/facilities/gasProcessing.js'],
  ['the Sutton pseudo-criticals are not physical at a gas gravity of', 'engines/facilities/gasProcessing.js'],
  ["Sutton's pressure correlation turns negative above a gravity of about", 'engines/facilities/gasProcessing.js'],
  ['is above the DAK validity limit of 30', 'engines/facilities/gasProcessing.js'],
  ['is below the DAK validity range of 1.0 to 3.0', 'engines/facilities/gasProcessing.js'],
];
let pinBroken = 0;
let pinsHit = 0;
const srcCache = new Map();
for (const [frag, src] of PINNED) {
  if (!srcCache.has(src)) {
    try { srcCache.set(src, fs.readFileSync(`${ENGROOT}/${src}`, 'utf8')); } catch { srcCache.set(src, ''); }
  }
  if (!srcCache.get(src).includes(frag)) {
    console.log(`  FAIL pinned engine fragment is no longer in ${src}: "${frag}"`);
    console.log('        The engine message changed. Re-read the digest quote and this pin together.');
    pinBroken += 1;
  }
  if (RAW.includes(frag)) pinsHit += 1;
}
const isEngineQuote = (l) => PINNED.some(([frag]) => l.includes(frag));

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
    console.log(`  FAIL line ${n}: repair history inside a teaching section, which digest.txt may not carry\n        ${l.slice(0, 140)}`);
    hits += 1;
  }
  if (!/^\| /.test(l) && !isEngineQuote(l) && /\b(was|were|had)\b/.test(l)
      && PAST_NARRATIVE.test(l) && !PAST_OK.test(l) && !HISTORY.test(l)) {
    warns.push(`  WARN line ${n}: past-tense narrative in this file's own prose, read it against what 82ec6d4 does today\n        ${l.slice(0, 140)}`);
  }
  if (CONTRASTIVE.test(l) || l.includes(EM) || l.includes(EN) || / -- /.test(l)) {
    if (isEngineQuote(l)) {
      console.log(`  deferred line ${n}: owner copy rule inside a VERBATIM ENGINE STRING. Do not edit here; it is an engines-repo change.`);
      deferred += 1;
    } else {
      console.log(`  FAIL line ${n}: owner copy rule in this file's own prose\n        ${l.slice(0, 140)}`);
      hits += 1;
    }
  }
});
warns.forEach((x) => console.log(x));
const sections = heads.filter((h) => h.kind === 'section').length;
const markers = heads.filter((h) => h.kind !== 'section').length;
if (D.length < 200 || sections < 10 || PINNED.length < 10) {
  console.log('  GATE REFUSES: it examined too little to have checked anything');
  process.exit(2);
}
console.log(`digestprose FC4: ${D.length} lines examined; ${warns.length} warned for a human read; ${sections} section titles and ${markers} in-body headings swept against their blocks; ${PINNED.length} engine fragments pinned, ${pinsHit} of them quoted by this digest, ${pinBroken} broken; ${deferred} deferred as verbatim engine strings; ${hits} failing`);
process.exit(hits ? 1 : 0);
