// D5 Applied AI and Language Models: the wave's own claims, cleared phrases and engine pins for
// /root/dc-wavekit/digestprose.mjs.
//
//   node /root/dc-wavekit/digestprose.mjs /root/dai-wip-appliedai/digest.txt \
//        --rules /root/dai-wip-appliedai
//
// THIS WAVE'S HISTORY POSITION. The course teaches no repair history: the
// engine's review changes before its merge are provenance.
//
// THIS FILE REFUSES RATHER THAN PASSING. Everything it declares about the
// digest is checked against digest.txt when the module loads, and a claim it
// cannot check makes it print REFUSED and exit 2.
import fs from 'node:fs';
import path from 'node:path';

const WAVE = process.env.D5_WAVE_DIR || '/root/dai-wip-appliedai';
const DIGEST = path.join(WAVE, 'digest.txt');

const refuse = (msg) => {
  console.log(`REFUSED by digest_prose.rules.mjs (D5): ${msg}`);
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

const tableRows = (body) => body
  .split('\n')
  .filter((l) => /^\s*\|/.test(l) && !/^\s*\|\s*---/.test(l))
  .map((l) => l.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map((c) => c.trim()));

// Every heading claim below must match a real heading, or it clears nothing.
// Each `body` returns TRUE WHEN THE HEADING IS FALSE over its block.
const HEADINGS = [
  {
    id: 'd5-threshold-reverses',
    heading: /Average precision, MAP, the no-relevant rule and the relevance threshold/i,
    body: (b) => !/At grade 1 system A has the higher MAP; at grade 2 system B does/.test(b) || !/nDCG is identical in both columns \(checked\)/.test(b),
    why: 'the MAP section no longer shows the threshold reversing the order of the two systems, or no longer says nDCG ignores the threshold',
  },
  {
    id: 'd5-tie-at-cutoff',
    heading: /The ranking: score order, the twelve-digit tie rule and a tie at the cutoff/i,
    body: (b) => !/A TIE AT THE CUTOFF/.test(b) || !/they are not equal, and the engine does not tie them/.test(b),
    why: 'the ranking section no longer shows a tie at the cutoff, or no longer shows two scores printing alike that do not tie',
  },
  {
    id: 'd5-grounded-not-correct',
    heading: /Groundedness and its limits/i,
    body: (b) => !/GROUNDED IS NOT CORRECT/.test(b) || !/is fully supported/.test(b) || !/scores exact match 0/.test(b),
    why: 'the groundedness section no longer shows a supported answer that is wrong',
  },
  {
    id: 'd5-paired-straddles',
    heading: /Comparing two systems: per-query scores and the paired bootstrap/i,
    body: (b) => !/across 0/.test(b) || !/is wider \(width/.test(b),
    why: 'the comparison section no longer shows the paired interval across 0 and the unpaired interval wider',
  },
  {
    id: 'd5-murphy-closes',
    heading: /Decomposing the Brier score/i,
    body: (b) => !/The identity closes: the closure is/.test(b) || !/which is not the Brier score/.test(b),
    why: 'the decomposition section no longer shows the identity closing with the within-bin terms and failing without them',
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
const EVALUATE = [
  'must be a non-empty array of { id, text }',
  "must be 'bm25' or 'tfidf'",
  "applies to 'bm25' only",
  "applies to 'tfidf' only",
  'must be a finite number, 0 or more (0 scores each matched term at its idf)',
  'must be a number from 0 to 1 (0 removes length normalisation)',
  'every judged query needs one; an empty array is a ranking that retrieved nothing',
  'has no judgments: every ranked query needs judgments',
  "must be 'exclude' or 'zero'",
  "must be 'linear' or 'exponential'",
  'is not a plain number (digits with optional comma thousands groups and a decimal part)',
  'the label has a value and the prediction is empty',
  'the label is empty and the prediction has a value',
  'on string ratings (the weights use the label positions)',
  ', which is not one of labels',
  'cited but not retrieved',
  'which the answer does not cite',
  'neither cited nor retrieved',
  '; it appears in no passage of the corpus',
  'was not retrieved for this query',
  'is not a passage of the corpus',
  'so the ideal DCG is 0',
  'nDCG is undefined: the query has no judged documents, so the ideal DCG is 0',
  'judged documents all have',
  'the 1 judged document has',
  'so the expected disagreement is 0',
  'one replicate: the standard error is undefined',
  ': the bootstrap resamples at least 2',
  'must be 0.8, 0.9, 0.95 or 0.99',
  'must be a whole number from 0 to 4294967295',
  'must be a number from 0 (inclusive) to 1 (exclusive)',
  'scores that agree to 12 significant digits tie, and ties go to the document id ascending',
  'a repeated query word counts once',
  '(Lucene), N = ',
  '(scikit-learn smooth_idf)',
  'Brier = REL - RES + UNC + WBV - WBC (Stephenson, Coelho and Jolliffe 2008, eq. 7)',
  '(the fifth term of their eq. 7, so twice the pooled within-bin covariance)',
  'a percentile interval of a statistic, labelled as parameter percentiles, never P-labels',
  'the share of replicates with a difference at or below 0 (a does not beat b in that replicate)',
  'so both systems see the same queries',
  'the answer has no checkable claim (no quote, date or number), so the supported fraction is undefined',
].map((frag) => ({ frag, src: 'engines/dataai/evaluate.js' }));
const ML = [
  'must be a number above 0 and below 0.5',
].map((frag) => ({ frag, src: 'engines/dataai/ml.js' }));
const PINNED = [...EVALUATE, ...ML];
for (const p of PINNED) {
  if (!DIGEST_LINES.some((l) => l.includes(p.frag))) refuse(`the pinned engine fragment "${p.frag}" is not quoted in the digest, so the pin guards nothing`);
}

export default {
  enginesRoot: process.env.D5_ENGINES || '/root/wt-dai-d5-nextgen/packages/engines',
  pinned: PINNED,
  cleared: CLEARED,
  headings: HEADINGS,
};
