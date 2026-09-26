// SC2 Procurement, Tendering & Contracting: the wave's own claims, cleared
// phrases and engine pins for /root/dc-wavekit/digestprose.mjs.
//
//   node /root/dc-wavekit/digestprose.mjs /root/cat-wip-procurement/digest.txt \
//        --rules /root/cat-wip-procurement
//
// THIS WAVE'S HISTORY POSITION. The course teaches no repair history: the
// engine's lead decisions before its merge are provenance.
//
// THIS FILE REFUSES RATHER THAN PASSING. Everything it declares about the
// digest is checked against digest.txt when the module loads, and a claim it
// cannot check makes it print REFUSED and exit 2.
import fs from 'node:fs';
import path from 'node:path';

const WAVE = process.env.SC2_WAVE_DIR || '/root/cat-wip-procurement';
const DIGEST = path.join(WAVE, 'digest.txt');
const ENGINES = process.env.SC2_ENGINES || '/root/wt-sc2-nextgen/packages/engines';

const refuse = (msg) => {
  console.log(`REFUSED by digest_prose.rules.mjs (SC2): ${msg}`);
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

const historyish = DIGEST_LINES.filter((l) => /^# SECTION \d+:/.test(l) && /USED TO|NO LONGER|REPAIR HISTORY/i.test(l));
if (historyish.length) refuse(`a section heading frames repair history in a wave that teaches none: ${historyish[0]}`);

// Every heading claim below must match a real heading, or it clears nothing.
// Each `body` returns TRUE WHEN THE HEADING IS FALSE over its block.
const HEADINGS = [
  {
    id: 'sc2-two-readings-decide',
    heading: /Section 14: bids within one percent, the closest competitor, and two readings of at least five percent higher/i,
    body: (b) => !/\| selected \(engine\) \| MS4 \| MS2 \|/.test(b) || !/\| s\.14 applied \(engine\) \| false \| true \|/.test(b),
    why: 'the s.14 section no longer shows the two readings deciding the materials award differently',
  },
  {
    id: 'sc2-low-cost-p90',
    heading: /Cost percentiles and their labels: the exceedance definition and the low-cost P90/i,
    body: (b) => !/for a cost P90 is the LOW cost/.test(b) || /\| false \|$/m.test(b) || !/P90 at or below P50 at or below P10/.test(b),
    why: 'the percentile section no longer shows every cost P90 at or below its P10 with the engine\'s own statement of the reversal',
  },
  {
    id: 'sc2-erratum',
    heading: /Reading the engine honestly: cited readings, the uncited option, an erratum and printed figures/i,
    body: (b) => !/\| B \| 12, 11, 54 \| 82 \| 77\.000000 \| fail-pass-mark \|/.test(b) || !/not from the cited texts/.test(b),
    why: 'the honest-reading section no longer shows the Annex 2 erratum or the uncited option in the engine\'s words',
  },
  {
    id: 'sc2-award-two-bases',
    heading: /Reading an award: the most advantageous bid, the tie-break and every exclusion/i,
    body: (b) => !/Award \(engine\): WS3\./.test(b) || !/award \(engine\) WS5;/.test(b),
    why: 'the award section no longer shows the combined award and the lowest-cost award picking different bids',
  },
  {
    id: 'sc2-seeded',
    heading: /Contract types on one job: lump sum, day rate and reimbursable under a seeded duration and daily cost/i,
    body: (b) => !/one mulberry32\(20270211\) stream/.test(b) || !/Each row adds to the expected overrun/.test(b),
    why: 'the contract-types section no longer states its seeded stream or shows the overrun split adding up',
  },
];
for (const h of HEADINGS) {
  if (!DIGEST_LINES.some((l) => /^# SECTION \d+:/.test(l) && h.heading.test(l))) {
    refuse(`the heading rule ${h.id} matches no section heading, so it checks nothing`);
  }
}

// A CLEARED PHRASE THAT MATCHES NOTHING IS A ROW CLAIMING WORK IT NEVER DID.
// This wave clears no phrase: the digest describes the engine in the present
// tense throughout. The list is empty by decision and checked as empty.
export const CLEARED = [];
for (const re of CLEARED) {
  if (!DIGEST_LINES.some((l) => re.test(l))) {
    refuse(`the cleared phrase ${re} matches no line of the digest, so it clears nothing`);
  }
}

// EVERY ENGINE STRING THIS DIGEST QUOTES, pinned by exact fragment to the
// engine source that writes it. If the engine's wording changes, the pin breaks
// and the quote is re-read rather than silently kept. Each pin is also checked
// to be QUOTED in the digest, so a pin that guards nothing refuses.
const TENDER = [
  'there is no default',
  "must be 'lowest-ratio' or 'linear'; there is no default",
  'the commercial envelope is not opened',
  'the bid is not scored and its commercial envelope is not opened',
  'so the unit rate prevails and the amount is corrected to',
  'the decimal point in the unit rate is obviously misplaced, so the quoted amount governs and the unit rate is corrected to',
  '; the subtotals prevail',
  'no adjustment and no credit for earlier completion',
  "(the 'highest' option, not from the cited texts)",
  "(the 'highest' option, not from the cited texts; the cited rule is the average of World Bank SPD ITB 34.1)",
  'an option not from the cited texts',
  's.14 does not say which, so there is no default',
  ' (readings of s.14: ',
  'is read as within 1% of the lowest evaluated cost',
  'is read as the bid with the next-highest Nigerian content in that group',
  '(the Act does not say points or relative)',
  'it is not disqualified solely because it is not the lowest (s.16)',
  'state Nigerian content as a rated criterion with its weight instead',
  'a potential abnormally low bid: clarify the price with the bidder before any decision; it is never rejected automatically',
  'so for a cost P90 is the LOW cost (10th percentile) and P10 the HIGH cost (90th percentile)',
  'companyPays + contractorAbsorbs = expectedOverrun',
  'is refused by engines/drilling/wellCost.js: ',
  'misapplication of the matrix may lead to misprocurement (Annex X para 3.4)',
  'the unit the minimum is measured in',
  'a user-stated target is never a hidden default',
  'no bid passed the technical envelope; no commercial envelope is opened',
  'every opened bid was rejected at the commercial stage',
  'the bid is nonresponsive',
  'examine it as a possibly abnormally low bid',
  '(later Board targets are not included)',
  'so Thigh is 0 and the \'relative\' technical score is undefined',
  'has no bid left to score: every bid is rejected',
  'weights must sum to 100; they sum to',
  'is required: bid ',
  'the items are measured in different units, so the overall content is the weighted mean of the item contents with stated weights',
].map((frag) => ({ frag, src: 'engines/supplychain/tender.js' }));
const PERCENTILE = [
  'P90 means a 90% probability the actual quantity meets or exceeds this value, per SPE PRMS.',
].map((frag) => ({ frag, src: 'lib/conventions/percentile.js' }));
const WELLCOST = [
  'durationHr must be >= 0',
].map((frag) => ({ frag, src: 'engines/drilling/wellCost.js' }));
const PINNED = [...TENDER, ...PERCENTILE, ...WELLCOST];
for (const p of PINNED) {
  if (!DIGEST_LINES.some((l) => l.includes(p.frag))) refuse(`the pinned engine fragment "${p.frag}" is not quoted in the digest, so the pin guards nothing`);
  if (!fs.readFileSync(path.join(ENGINES, p.src), 'utf8').includes(p.frag)) refuse(`the pinned engine fragment "${p.frag}" is not in ${p.src}, so the quote is stale`);
}

export default {
  enginesRoot: ENGINES,
  pinned: PINNED,
  cleared: CLEARED,
  headings: HEADINGS,
};
