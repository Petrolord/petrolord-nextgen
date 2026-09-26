// EC8 Gas Commercialisation & Gas Sales Agreements: the wave's own claims,
// cleared phrases and engine pins for /root/dc-wavekit/digestprose.mjs.
//
//   node /root/dc-wavekit/digestprose.mjs /root/cat-wip-gsa/digest.txt \
//        --rules /root/cat-wip-gsa
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

const WAVE = process.env.EC8_WAVE_DIR || '/root/cat-wip-gsa';
const DIGEST = path.join(WAVE, 'digest.txt');
const ENGINES = process.env.EC8_ENGINES || '/root/wt-ec8-nextgen/packages/engines';

const refuse = (msg) => {
  console.log(`REFUSED by digest_prose.rules.mjs (EC8): ${msg}`);
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
    id: 'ec8-daily-identity',
    heading: /The daily balance: properly nominated quantity, seller shortfall/i,
    body: (b) => !/the two are equal \(checked exactly\)/.test(b) || !/\| daily-available-not-taken \|/.test(b),
    why: 'the daily balance section no longer shows the reconciliation identity and the made-available day',
  },
  {
    id: 'ec8-ledger-orders',
    heading: /The take-or-pay ledger: make-up, the recovery order/i,
    body: (b) => !/\| top-order-after-adjusted-acq \| after-adjusted-acq \|/.test(b) || !/\| top-order-first \| first \|/.test(b) || !/\| top-order-after-top-quantity \| after-top-quantity \|/.test(b),
    why: 'the ledger section no longer shows the three recovery orders side by side',
  },
  {
    id: 'ec8-four-readings',
    heading: /The four readings the engine states/i,
    body: (b) => !/READING ONE ACTS/.test(b) || !/READING TWO ACTS/.test(b) || !/READING THREE ACTS/.test(b) || !/READING FOUR ACTS/.test(b),
    why: 'the readings section no longer shows where each of the four readings acts',
  },
  {
    id: 'ec8-reported-only',
    heading: /What the engine does not compute, and figures quoted only as reported/i,
    body: (b) => !/FIGURES QUOTED ONLY AS REPORTED/.test(b) || !/regulator's circular was not read/.test(b),
    why: 'the not-computed section no longer says the domestic base price is quoted only as reported',
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
  'seller shortfall measured against the quantity the seller made available',
  'make-up right equals the deficiency actually paid after any carry-forward credit',
  "a last-contract-year deficiency creates no make-up right (forfeit/refund applies to earlier years' make-up only)",
  'royalty is charged on delivered gas value and not on deficiency payments',
  "is the reference text's order",
  'reported only; the engine does not model the outcome of a price review',
  'circular was not read',
  'the delivery period ends with this year, so no make-up right arises',
  'the make-up period is 0 years, so no make-up right arises',
  'expired unrecovered at the end of',
  'force majeure and maintenance cover the whole DCQ; no quantity is owed either way for the day',
  'was not made available for a cause on the buyer',
  'the lessee may not supply new midstream gas export operations (s.110(14)(a))',
  'the 90-day investigation rule of r.6(3) and the compensation to customer-clients of s.110(13) are not computed',
  'the engine holds no default',
].map((frag) => ({ frag, src: 'engines/economics/gasContract.js' }));
const SRC = fs.readFileSync(path.join(ENGINES, 'engines/economics/gasContract.js'), 'utf8');
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
