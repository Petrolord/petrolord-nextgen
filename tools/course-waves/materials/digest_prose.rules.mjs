// SC3 Materials, Spares & Inventory Management: the wave's own claims, cleared
// phrases and engine pins for /root/dc-wavekit/digestprose.mjs.
//
//   node /root/dc-wavekit/digestprose.mjs /root/cat-wip-materials/digest.txt \
//        --rules /root/cat-wip-materials
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

const WAVE = process.env.SC3_WAVE_DIR || '/root/cat-wip-materials';
const DIGEST = path.join(WAVE, 'digest.txt');
const ENGINES = process.env.SC3_ENGINES || '/root/wt-sc3-nextgen/packages/engines';

const refuse = (msg) => {
  console.log(`REFUSED by digest_prose.rules.mjs (SC3): ${msg}`);
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
    id: 'sc3-published',
    heading: /The published checks the engine reproduces/i,
    body: (b) => !['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT'].every((n) => new RegExp(`CHECK ${n}:`).test(b)),
    why: 'the published checks section no longer runs all eight printed checks',
  },
  {
    id: 'sc3-slips',
    heading: /Two printed figures that are slips/i,
    body: (b) => !/SLIP ONE: CAPLICE LECTURE 11 SLIDE 24/.test(b) || !/SLIP TWO: CAPLICE LECTURE 13 SLIDE 12/.test(b),
    why: 'the slips section no longer shows both printed slips',
  },
  {
    id: 'sc3-abc',
    heading: /ABC by annual usage value/i,
    body: (b) => !/THE TWO RULES DISAGREE ON TWO ITEMS/.test(b) || !/\| CEM-G \|/.test(b),
    why: 'the ABC section no longer shows the two boundary rules disagreeing on the item that crosses',
  },
  {
    id: 'sc3-rounding',
    heading: /Rounding and the flat bottom/i,
    body: (b) => !/THE FLAT BOTTOM\./.test(b) || !/HALVES UPWARD\./.test(b),
    why: 'the rounding section no longer shows the flat bottom and halves upward',
  },
  {
    id: 'sc3-insurance',
    heading: /Insurance spares: orders outstanding one for one/i,
    body: (b) => !/THE ENGINE'S MODEL, STATED PLAINLY\./.test(b) || !/THE MARGINAL SPARE\./.test(b),
    why: 'the insurance section no longer states the model and the marginal spare',
  },
  {
    id: 'sc3-montecarlo',
    heading: /Lead-time risk by the canonical Monte Carlo/i,
    body: (b) => !/THE DRAWS ARE THE CANONICAL ONES\./.test(b) || !/ANOTHER SEED, ANOTHER ESTIMATE\./.test(b) || !/NONE OF THEM IS GRADED/.test(b),
    why: 'the Monte Carlo section no longer shows the replayed draws, another seed and that nothing sampled is graded',
  },
  {
    id: 'sc3-readings',
    heading: /The readings the engine states/i,
    body: (b) => !['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN'].every((n) => new RegExp(`READING ${n}:`).test(b)),
    why: 'the readings section no longer shows each of the thirteen readings',
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
  ['orders outstanding X ~ Poisson(failuresPerYear x leadTimeDays / daysPerYear), one for one', 'engines/supplychain/inventory.js'],
  ['each unit waiting for a spare is one unit down, costed at downtimeCostPerDay; the holding charge falls on all n spares bought', 'engines/supplychain/inventory.js'],
  ['P-labels per lib/conventions/percentile.js: P90 means a 90% probability the actual quantity meets or exceeds the value, so for a lead time or a demand P90 is the LOW figure (10th percentile) and the stockout risk sits at the P10 end', 'engines/supplychain/inventory.js'],
  ['the rate holds for the whole lead time', 'engines/supplychain/inventory.js'],
  ['Phi^-1 by Wichura AS241; Phi through the regularised incomplete gamma (engines/hse/safetyStats.js); the fill-rate k by bisection to the last binary digit', 'engines/supplychain/inventory.js'],
  ['the course names VED (vital, essential, desirable) as one such scheme', 'engines/supplychain/inventory.js'],
  ['P90 means a 90% probability the actual quantity meets or exceeds this value, per SPE PRMS.', 'lib/conventions/percentile.js'],
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
