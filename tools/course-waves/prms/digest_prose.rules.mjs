// EC11 Reserves & Resources under SPE-PRMS 2018: the wave's own claims, cleared
// phrases and engine pins for /root/dc-wavekit/digestprose.mjs.
//
//   node /root/dc-wavekit/digestprose.mjs /root/cat-wip-prms/digest.txt \
//        --rules /root/cat-wip-prms
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

const WAVE = process.env.EC11_WAVE_DIR || '/root/cat-wip-prms';
const DIGEST = path.join(WAVE, 'digest.txt');
const ENGINES = process.env.EC11_ENGINES || '/root/wt-ec11-nextgen/packages/engines';

const refuse = (msg) => {
  console.log(`REFUSED by digest_prose.rules.mjs (EC11): ${msg}`);
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
    id: 'ec11-published',
    heading: /The published checks the engine reproduces/i,
    body: (b) => !/CHECK ONE: THE FAQ 3\.3 EXAMPLE/.test(b) || !/CHECK TWO: THE 2011 GUIDELINES, TABLE 6\.2/.test(b) || !/CHECK THREE: THE NATIONAL GAS FIGURE/.test(b) || !/CHECK FOUR: THE SEC SUMMATION RULE/.test(b),
    why: 'the published checks section no longer runs all four printed checks',
  },
  {
    id: 'ec11-categories',
    heading: /Categories and the range of uncertainty/i,
    body: (b) => !/CONTINGENT RESOURCES BOTH WAYS\./.test(b) || !/ONE VALUE FOR THE RANGE/.test(b) || !/\| cat-contingent-cumulative \|/.test(b),
    why: 'the categories section no longer shows both forms and the single value',
  },
  {
    id: 'ec11-economic-limit',
    heading: /The economic limit of three technical forecasts/i,
    body: (b) => !/THE TRAILING TRIM AT ITS BOUNDARY/.test(b) || !/THE ECONOMIC TEST AT ITS BOUNDARY/.test(b) || !/\| econ-tail-one-below-cut \|/.test(b) || !/THE CANONICAL CASH FLOW UNDERNEATH/.test(b),
    why: 'the economic limit section no longer shows the two boundaries and the canonical cash flow',
  },
  {
    id: 'ec11-entitlement',
    heading: /Entitlement and the reporting basis/i,
    body: (b) => !/\| econ-ekene-production-tax \|/.test(b) || !/BARRELS OF OIL EQUIVALENT\./.test(b) || !/CASH AT THE WORKING INTEREST\./.test(b),
    why: 'the entitlement section no longer shows the four bases, BOE and the cash at the working interest',
  },
  {
    id: 'ec11-probabilistic',
    heading: /Probabilistic aggregation/i,
    body: (b) => !/SEED AND DRAWS\./.test(b) || !/THE MEAN OF A TOTAL IS THE SUM OF THE MEANS/.test(b) || !/\| agg-ekene-reserves-strong \|/.test(b),
    why: 'the probabilistic section no longer shows the correlations, the seed and the mean of a total',
  },
  {
    id: 'ec11-two-rules',
    heading: /Two economic-limit rules/i,
    body: (b) => !/RULE ONE, THE CANONICAL TRAILING TRIM/.test(b) || !/RULE TWO, THE PRMS CUMULATIVE PEAK/.test(b) || !/WHY THE ENGINE REFUSES\./.test(b),
    why: 'the two-rules section no longer shows both rules and why the engine refuses',
  },
  {
    id: 'ec11-readings',
    heading: /The readings the engine states/i,
    body: (b) => !['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'].every((n) => new RegExp(`READING ${n}:`).test(b)),
    why: 'the readings section no longer shows each of the nine readings',
  },
  {
    id: 'ec11-quirks',
    heading: /Reference texts and their quirks/i,
    body: (b) => !/A TABLE AND A FIGURE WITH TWO NUMBERS/.test(b) || !/A RELEASE THAT PRINTS ONE FIGURE SHORT/.test(b) || !/AN ERRATUM ON THE WORD ECONOMIC/.test(b),
    why: 'the quirks section no longer shows the two numbers, the short figure and the erratum',
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
  ['computeCashFlow of engines/economics/cashflow.ts with apply_economic_limit (JV regime at 100%, the stated royalty and tax), checked against PRMS 3.1.3.1', 'engines/economics/prms.js'],
  ['(undiscounted cumulative net cash flow above 0, ADR included), 3.1.2.8', 'engines/economics/prms.js'],
  ['the low case quantities remain within 2P; FAQ 3.4 keeps them out of 1C, since a project carries a single classification', 'engines/economics/prms.js'],
  ['opening + movements = closing, category by category; production comes out of every Reserves category alike', 'engines/economics/prms.js'],
  ['every movement other than production (additions, revisions and transfers)', 'engines/economics/prms.js'],
  ['the mean of the total is the sum of the means (no portfolio effect in means, PRMS 4.2.5.2)', 'engines/economics/prms.js'],
  ['a single value may describe the expected result (PRMS 2.2.1.3)', 'engines/economics/prms.js'],
  ['incremental: no terms are defined for Prospective Resources (PRMS 2.2.2.4)', 'engines/economics/prms.js'],
  ['lib/conventions/percentile.js (P90 = the 0.1 quantile of the totals, the low estimate)', 'engines/economics/prms.js'],
  ['Reserves: the best case is economic (PRMS 2.1.2.2, 3.1.2.1)', 'engines/economics/prms.js'],
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
