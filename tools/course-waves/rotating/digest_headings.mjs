// digestheadings. THE SWEEP THAT WAS MISSING.
//
// The two-figure sweep this wave ran covered PROSE and missed HEADINGS, and a
// section title survived it reading "the limit it can break" over a table
// recording nothing broken. That is the commonest shape of the defect this
// programme keeps paying for: a correction applied to the body and not to the
// heading above it. FC2 learned the same thing twice, once where a writer
// fixed a paragraph and left the heading contradicting it, and once where
// fixing structure.py and regenerating a manifest did not propagate into the
// lesson text.
//
// So headings are swept mechanically from here on: every SECTION title and
// every in-body ALL-CAPS marker, each against the block beneath it. A SECTION
// title owns everything down to the next SECTION. The first version of this
// file gave a section title the same short block as a marker and therefore
// MISSED THE VERY DEFECT IT WAS WRITTEN FOR, which is recorded here because a
// gate that cannot catch its own founding case is the thing it was built to
// stop.
//
// Usage: node digest_headings.mjs [digest.txt]   exit 1 on any hit.
import fs from 'fs';
const FILE = process.argv[2] || '/root/fc-wip-rotating/digest.txt';
const D = fs.readFileSync(FILE, 'utf8').split('\n');
const heads = [];
D.forEach((l, i) => {
  if (/^# SECTION /.test(l)) heads.push({ i, kind: 'section', text: l });
  else if (/^[A-Z][A-Z ,'`-]{12,}/.test(l)) heads.push({ i, kind: 'marker', text: l });
});
// A SECTION title owns everything down to the NEXT SECTION; an in-body marker
// owns only down to the next heading of any kind. The first version of this
// gate gave a section title the same short block as a marker, which stopped it
// before the table that refutes the Section 13 title, so the gate missed the
// defect it was written for.
const sectionIdx = heads.filter((h) => h.kind === 'section').map((h) => h.i);
heads.forEach((h, k) => {
  h.end = k + 1 < heads.length ? heads[k + 1].i : D.length;
  if (h.kind === 'section') {
    const next = sectionIdx.find((i) => i > h.i);
    h.end = next === undefined ? D.length : next;
  }
});
// The claim under test: a heading that says a limit CAN be broken, over a block
// whose own numbers say nothing broke it.
const FORBIDDEN = [
  [/limit it can break|can break/i, (body) => /stages over the limit \| stages warned/.test(body) || / 0 \| 0 \|/.test(body),
   'a heading says a limit can be broken over a block that records none broken'],
  [/does not check|accept and should not/i, (body) => /is refused rather than classified|there is no verdict to give/.test(body),
   'a heading names a shortcoming over a block showing the engine refusing instead'],
  [/names none internally|every packaging is written inline at its point of use\./i, () => true,
   'a claim about named internal constants that 4fa37e6 refutes'],
  [/USED TO|BEFORE IT FAILED/i, () => true,
   'a heading framed on repair history, which is not teaching truth'],
];
let hits = 0;
for (const h of heads) {
  const body = D.slice(h.i + 1, h.end).join('\n');
  for (const [re, test, why] of FORBIDDEN) {
    if (re.test(h.text) && test(body)) { console.log(`  FAIL line ${h.i + 1}: ${why}\n        ${h.text.slice(0, 120)}`); hits += 1; }
  }
}
console.log(`digestheadings: ${heads.filter((h) => h.kind === 'section').length} section titles and ${heads.filter((h) => h.kind === 'marker').length} in-body markers swept, ${hits} failing`);
process.exitCode = hits ? 1 : 0;
