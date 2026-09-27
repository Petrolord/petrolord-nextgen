// EC9 Joint Ventures, Operating Agreements & Cost Recovery: the wave's own claims,
// cleared phrases and engine pins for /root/dc-wavekit/digestprose.mjs.
//
//   node /root/dc-wavekit/digestprose.mjs /root/cat-wip-joa/digest.txt \
//        --rules /root/cat-wip-joa
//
// THIS WAVE'S HISTORY POSITION. The course teaches no repair history: the
// lead's decisions on the engine landed before its merge and before any lesson
// was written, and that is provenance.
//
// THIS FILE REFUSES RATHER THAN PASSING. Everything it declares about the
// digest is checked against digest.txt when the module loads, and a claim it
// cannot check makes it print REFUSED and exit 2.
import fs from 'node:fs';
import path from 'node:path';

const WAVE = process.env.EC9_WAVE_DIR || '/root/cat-wip-joa';
const DIGEST = path.join(WAVE, 'digest.txt');
const ENGINES = process.env.EC9_ENGINES || '/root/wt-ec9-nextgen/packages/engines';

const refuse = (msg) => {
  console.log(`REFUSED by digest_prose.rules.mjs (EC9): ${msg}`);
  console.log('   A rules file that cannot check its own declarations is a rules file that '
    + 'reports a clean sweep for a check that never ran.');
  process.exit(2);
};

let DIGEST_LINES = [];
try {
  DIGEST_LINES = fs.readFileSync(DIGEST, 'utf8').replace(/\n$/, '').split('\n');
} catch (e) {
  refuse(`${DIGEST} could not be read (${e.code}), so every declaration below is unchecked`);
}
if (DIGEST_LINES.length < 600) refuse(`${DIGEST} has ${DIGEST_LINES.length} lines, which is too few to be the whole digest`);

const historyish = DIGEST_LINES.filter((l) => /^# SECTION \d+:/.test(l) && /USED TO|NO LONGER|REPAIR HISTORY|LEGACY/i.test(l));
if (historyish.length) refuse(`a section heading frames repair history in a wave that teaches none: ${historyish[0]}`);

// Every heading claim below must match a real heading, or it clears nothing.
// Each `body` returns TRUE WHEN THE HEADING IS FALSE over its block.
const HEADINGS = [
  {
    id: 'ec9-interests',
    heading: /Participating, paying and beneficial interests, carries and the partner split/i,
    body: (b) => !/A carry moves cost and never moves production/.test(b) || !/\| int-two-carries \|/.test(b),
    why: 'the interests section no longer shows paying against beneficial interest and the two carries',
  },
  {
    id: 'ec9-reconciliation-identity',
    heading: /The cash call ledger: the reconciliation lag/i,
    body: (b) => !/THE IDENTITY ON THE CLOSING ROWS/.test(b) || !/\| cc-ekene-2027-refund \|/.test(b),
    why: 'the cash call ledger section no longer shows the closing identity and the refund ledger',
  },
  {
    id: 'ec9-published-checks',
    heading: /The published PSC checks/i,
    body: (b) => !/WORLD BANK BRIEFING NOTE 8/.test(b) || !/IMF FARI FIGURE 5/.test(b) || !/IMF FARI TABLES 12 AND 13/.test(b) || !/NO DEFECT/.test(b),
    why: 'the published section no longer runs all three published PSC examples',
  },
  {
    id: 'ec9-three-readings',
    heading: /The three readings the engine states/i,
    body: (b) => !/READING ONE ACTS/.test(b) || !/READING TWO ACTS/.test(b) || !/READING THREE ACTS/.test(b) || !/THE LIMIT BASE IS A STATED INPUT/.test(b),
    why: 'the readings section no longer shows where each of the three readings acts, and the limit base as a stated input',
  },
  {
    id: 'ec9-openoil',
    heading: /Reference texts and their quirks/i,
    body: (b) => !/A WORKED EXAMPLE THAT DOES NOT ADD UP/.test(b) || !/LICENSED FORMS/.test(b),
    why: 'the quirks section no longer shows the OpenOil arithmetic error and the licensed-forms rule',
  },
];
for (const h of HEADINGS) {
  if (!DIGEST_LINES.some((l) => /^# SECTION \d+:/.test(l) && h.heading.test(l))) {
    refuse(`the heading rule ${h.id} matches no section heading, so it checks nothing`);
  }
}

// A CLEARED PHRASE THAT MATCHES NOTHING IS A ROW CLAIMING WORK IT NEVER DID.
// This wave clears no phrase. The list is empty by decision and checked as empty.
export const CLEARED = [];
for (const re of CLEARED) {
  if (!DIGEST_LINES.some((l) => re.test(l))) {
    refuse(`the cleared phrase ${re} matches no line of the digest, so it clears nothing`);
  }
}

// EVERY ENGINE STRING THIS DIGEST LEANS ON, pinned by exact fragment to the
// engine source that writes it. If the engine's wording changes, the pin breaks
// and the quote is re-read rather than silently kept. Each pin is also checked
// to be QUOTED in the digest, so a pin that guards nothing refuses.
const PINNED = [
  "as FARI TNM/16/01 and World Bank Note 8 assume (applyPSC in engines/economics/cashflow.ts)",
  "one cured later carries interest from the due date, as the Kenya Model PSC 2015 Participation Agreement Art. 6.7 prints (72 hours)",
  "the non-defaulting parties advance the unpaid amounts in proportion to their paying interests among themselves (the parties that pay cost; a carried party pays none)",
  "beneficial interest = participating interest (the share of production)",
  "an adjustment above the forecast share makes the call 0 and the rest is carried to the next call",
  "an overrun of exactly the tolerance is inside (\"may exceed ... by up to\")",
  "overhead charged under the scale is never part of its own base",
  "a year's new cost earns none in its own year",
  "development and production costs only; bonuses, penalties, interest, premium and markups excluded (PIA s.85(4)(c)); exploration is not development or production",
  "the expert determination of the unrecovered costs (s.85(4)(e)); the unrecovered cost figures are stated inputs",
  "share of max(0, grossValue - deductions); in the year the premium is recovered the rest of that year",
  "applyPSC imported from engines/economics/cashflow.ts, called once a year with the unrecovered pool threaded; nothing here re-computes the cost pool",
  "the engine holds no default",
].map((frag) => ({ frag, src: 'engines/economics/jointVenture.js' }));
const SRC = fs.readFileSync(path.join(ENGINES, 'engines/economics/jointVenture.js'), 'utf8');
for (const p of PINNED) {
  const printedForm = p.frag.replace(/\\'/g, "'");
  if (!DIGEST_LINES.some((l) => l.includes(printedForm))) refuse(`the pinned engine fragment "${printedForm}" is not quoted in the digest, so the pin guards nothing`);
  if (!SRC.includes(p.frag)) refuse(`the pinned engine fragment "${p.frag}" is not in ${p.src}, so the quote is stale`);
}

export default {
  enginesRoot: ENGINES,
  pinned: PINNED.map((p) => ({ ...p, frag: p.frag.replace(/\\'/g, "'") })),
  cleared: CLEARED,
  headings: HEADINGS,
};
