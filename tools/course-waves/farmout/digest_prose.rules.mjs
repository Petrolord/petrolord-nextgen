// EC10 Farm-ins, Farm-outs & Asset Valuation: the wave's own claims, cleared
// phrases and engine pins for /root/dc-wavekit/digestprose.mjs.
//
//   node /root/dc-wavekit/digestprose.mjs /root/cat-wip-farmout/digest.txt \
//        --rules /root/cat-wip-farmout
//
// THIS WAVE'S HISTORY POSITION. The course teaches no repair history: the
// lead's decisions on the engine landed before any lesson was written, and
// that is provenance.
//
// THIS FILE REFUSES RATHER THAN PASSING. Everything it declares about the
// digest is checked against digest.txt when the module loads, and a claim it
// cannot check makes it print REFUSED and exit 2.
import fs from 'node:fs';
import path from 'node:path';

const WAVE = process.env.EC10_WAVE_DIR || '/root/cat-wip-farmout';
const DIGEST = path.join(WAVE, 'digest.txt');
const ENGINES = process.env.EC10_ENGINES || '/root/wt-ec10-nextgen/packages/engines/ec10-farmout';

const refuse = (msg) => {
  console.log(`REFUSED by digest_prose.rules.mjs (EC10): ${msg}`);
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
    id: 'ec10-promote',
    heading: /The promote in points, the promote ratio and the carry inside a promote/i,
    body: (b) => !/HEADS UP\./.test(b) || !/A FULL CARRY\./.test(b) || !/\| earn-full-carry \|/.test(b),
    why: 'the promote section no longer shows a heads-up deal and a full carry',
  },
  {
    id: 'ec10-caps',
    heading: /Caps and overrun rules/i,
    body: (b) => !/THE TWO OVERRUN RULES ON THE SAME EXCESS/.test(b) || !/A CAP REACHED EXACTLY/.test(b) || !/\| earn-cap-carry-exactly \|/.test(b),
    why: 'the caps section no longer shows the two overrun rules and a cap reached exactly',
  },
  {
    id: 'ec10-deal-value',
    heading: /The value of the deal to each side by EMV/i,
    body: (b) => !/THE TRANSFER\./.test(b) || !/THE PENN STATE CHECK/.test(b) || !/\| drill yourself \|/.test(b),
    why: 'the deal value section no longer shows the transfer and the Penn State check',
  },
  {
    id: 'ec10-fee-days',
    heading: /Paying the fee on time/i,
    body: (b) => !/\| fee-day-210 \|/.test(b) || !/\| fee-day-211 \|/.test(b) || !/THE SURCHARGE IS STRAIGHT LINE/.test(b),
    why: 'the fee timing section no longer shows the day boundaries and the straight-line surcharge',
  },
  {
    id: 'ec10-readings',
    heading: /The readings the engine states/i,
    body: (b) => !/READING ONE/.test(b) || !/READING TWO/.test(b) || !/READING THREE/.test(b) || !/READING FOUR/.test(b),
    why: 'the readings section no longer shows each of the four readings',
  },
  {
    id: 'ec10-quirks',
    heading: /Reference texts and their quirks/i,
    body: (b) => !/A TABLE WITH TWO NUMBERS/.test(b) || !/THE REGULATIONS NUMBER THEIR LAST PROVISIONS TWICE/.test(b) || !/ONE VALUE DEFINED TWICE/.test(b),
    why: 'the quirks section no longer shows the two table numbers, the double numbering and the double definition',
  },
  {
    id: 'ec10-simple-uplift',
    heading: /Carries and back-ins after the farm-in/i,
    body: (b) => !/A SIMPLE-INTEREST UPLIFT/.test(b) || !/A DAY BASIS\./.test(b) || !/SIMPLE AND COMPOUND AT THE SAME RATE/.test(b),
    why: 'the after-the-farm-in section no longer teaches the simple uplift and its day basis',
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
  ['promote = the share of the gross cost the farminee pays minus the interest it holds after the event (points); promote ratio = share paid / interest held', 'engines/economics/farmout.js'],
  ['carry = what the farminee pays minus its own held interest of the gross cost', 'engines/economics/farmout.js'],
  ['the success-case value is at the valuation date; well costs, bonus, reimbursement and fees fall at the valuation date, undiscounted', 'engines/economics/farmout.js'],
  ['farmor alone = farmor after the farm-out + farminee + assignor fees: the deal moves value between the two sides and the fees leave both', 'engines/economics/farmout.js'],
  ['the engine does not decide which consideration of a farm-out counts', 'engines/economics/farmout.js'],
  ['then 0.01% of the fee a day straight line for up to 90 days, after which the consent is deemed withdrawn (reg. 19(7) to (9))', 'engines/economics/farmout.js'],
  ['transaction metrics are ratios of stated inputs (price, volumes, rates), reported only: no market value is asserted', 'engines/economics/farmout.js'],
  ['p90 is the low case and p10 the high case (probability of exceedance, lib/conventions/percentile.js)', 'engines/economics/farmout.js'],
  ['HMRC OT18360 describes the recovery as usually including an addition representing simple interest (uplift type "simple")', 'engines/economics/farmout.js'],
  ['accrued interest earns none; a recovery pays the accrued interest first, then the principal', 'engines/economics/jointVenture.js'],
].map(([frag, src]) => ({ frag, src }));
const SRCS = {};
for (const p of PINNED) {
  if (!SRCS[p.src]) SRCS[p.src] = fs.readFileSync(path.join(ENGINES, p.src), 'utf8');
  const printedForm = p.frag.replace(/\\'/g, "'");
  if (!DIGEST_LINES.some((l) => l.includes(printedForm))) refuse(`the pinned engine fragment "${printedForm}" is not quoted in the digest, so the pin guards nothing`);
  if (!SRCS[p.src].includes(p.frag)) refuse(`the pinned engine fragment "${p.frag}" is not in ${p.src}, so the quote is stale`);
}

export default {
  enginesRoot: ENGINES,
  pinned: PINNED.map((p) => ({ ...p, frag: p.frag.replace(/\\'/g, "'") })),
  cleared: CLEARED,
  headings: HEADINGS,
};
