// SC4 Offshore & Marine Logistics: the wave's own claims, cleared
// phrases and engine pins for /root/dc-wavekit/digestprose.mjs.
//
//   node /root/dc-wavekit/digestprose.mjs /root/cat-wip-marine/digest.txt \
//        --rules /root/cat-wip-marine
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

const WAVE = process.env.SC4_WAVE_DIR || '/root/cat-wip-marine';
const DIGEST = path.join(WAVE, 'digest.txt');
const ENGINES = process.env.SC4_ENGINES || '/root/wt-sc4-nextgen/packages/engines';

const refuse = (msg) => {
  console.log(`REFUSED by digest_prose.rules.mjs (SC4): ${msg}`);
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
    id: 'sc4-published',
    heading: /The published checks the engine reproduces/i,
    body: (b) => !['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'].every((n) => new RegExp(`CHECK ${n}[:,]`).test(b)) || !/A PRINTED SLIP AT FIVE BERTHS/.test(b),
    why: 'the published checks section no longer runs all nine printed checks and the slip',
  },
  {
    id: 'sc4-weather',
    heading: /Weather: one stated factor and the activities it slows/i,
    body: (b) => !/\| ekene-voyage-calm \|/.test(b) || !/\| ekene-voyage-weather-on-all-activities \|/.test(b),
    why: 'the weather section no longer shows the calm, the stated and the all-activities rows',
  },
  {
    id: 'sc4-binding',
    heading: /Utilisation, the binding constraint and its tie rule/i,
    body: (b) => !/THE TIE\./.test(b) || !/AN OVERLOADED VOYAGE\./.test(b) || !/\| voyage-at-capacity-feasible \|/.test(b),
    why: 'the binding section no longer shows the tie, the overload and the load at capacity',
  },
  {
    id: 'sc4-vessels',
    heading: /Vessels required/i,
    body: (b) => !/\| fleet-vessels-nearest-short \|/.test(b) || !/THE SHORTFALL IS A RESULT WITH A REASON/.test(b),
    why: 'the vessels section no longer shows the three rounding rules and the shortfall',
  },
  {
    id: 'sc4-ffd',
    heading: /First-fit decreasing: sorting by area/i,
    body: (b) => !/TIES GO TO THE HEAVIER UNIT/.test(b) || !/\| ekene-deck-one-voyage-first-fit \|/.test(b) || !/A FIT IS INCLUSIVE/.test(b),
    why: 'the first-fit decreasing section no longer shows both rules, the tie and the inclusive fit',
  },
  {
    id: 'sc4-mdc',
    heading: /Constant service and M\/D\/c/i,
    body: (b) => !/ONE BERTH, EXACT\./.test(b) || !/SEVERAL BERTHS, APPROXIMATE\./.test(b) || !/HOW MANY BERTHS MEET A TARGET/.test(b),
    why: 'the M/D/c section no longer shows the exact one-berth case, the approximation and the target',
  },
  {
    id: 'sc4-variability',
    heading: /Weather and demand variability/i,
    body: (b) => !/ANOTHER SEED, ANOTHER ESTIMATE/.test(b) || !/THE PLAN AT THE MODES/.test(b) || !/none is graded/.test(b),
    why: 'the variability section no longer shows the second seed, the plan at the modes and that nothing is graded',
  },
  {
    id: 'sc4-readings',
    heading: /The readings the engine states/i,
    body: (b) => !['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN'].every((n) => new RegExp(`READING ${n}:`).test(b)),
    why: 'the readings section no longer shows each of the ten readings',
  },
  {
    id: 'sc4-quirks',
    heading: /Reference texts and their quirks/i,
    body: (b) => !/A PRINTED FIGURE THAT MISSES ITS ROUNDING/.test(b) || !/A TOTAL THE ROUNDED DAYS DO NOT REPRODUCE/.test(b),
    why: 'the quirks section no longer shows the printed slip and the total that does not reproduce',
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
  ['deck area capacity = deck area x the usable fraction', 'engines/supplychain/marineLogistics.js'],
  ['the binding constraint has the highest utilisation (ties to the first in the order deck area, deck load, deadweight, tanks)', 'engines/supplychain/marineLogistics.js'],
  ['counts compare at 12 significant digits', 'engines/supplychain/marineLogistics.js'],
  ['a unit goes to the first voyage whose area and deck load still hold it', 'engines/supplychain/marineLogistics.js'],
  ['an area bound with no stacking and no check of shapes', 'engines/supplychain/marineLogistics.js'],
  ['M/D/c (Poisson arrivals, constant service) by an approximation; probabilityWait is not given for M/D/c', 'engines/supplychain/marineLogistics.js'],
  ['exact at c = 1 where it is the Pollaczek-Khinchin mean value formula', 'engines/supplychain/marineLogistics.js'],
  ['for a requirement P90 is the LOW figure (10th percentile) and P10 the HIGH figure (90th percentile)', 'engines/supplychain/marineLogistics.js'],
  ['rounded down at the sixth decimal so that it is accepted', 'engines/supplychain/marineLogistics.js'],
  ['there is no default, so every run can be reproduced', 'engines/supplychain/marineLogistics.js'],
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
