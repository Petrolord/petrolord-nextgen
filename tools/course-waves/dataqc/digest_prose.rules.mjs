// D1 Oilfield Data Quality: the wave's own claims, cleared phrases and engine
// pins for /root/dc-wavekit/digestprose.mjs.
//
//   node /root/dc-wavekit/digestprose.mjs /root/dai-wip-dataqc/digest.txt \
//        --rules /root/dai-wip-dataqc
//
// THIS WAVE'S HISTORY POSITION. The course teaches no repair history: the
// engine's one repair after its first merge is provenance. The NIST errata in the
// digest are about a published page, and they are written in the present tense.
//
// THIS FILE REFUSES RATHER THAN PASSING. Everything it declares about the
// digest is checked against digest.txt when the module loads, and a claim it
// cannot check makes it print REFUSED and exit 2.
import fs from 'node:fs';
import path from 'node:path';

const WAVE = process.env.D1_WAVE_DIR || '/root/dai-wip-dataqc';
const DIGEST = path.join(WAVE, 'digest.txt');

const refuse = (msg) => {
  console.log(`REFUSED by digest_prose.rules.mjs (D1): ${msg}`);
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
    id: 'd1-sentinel-counts-as-present',
    heading: /the sentinel that counts as present/i,
    body: (b) => !/\| as delivered, -999\.25 in place \| 1\.000000 \| 0 \| 4 \|/.test(b),
    why: 'the section that says the sentinel counts as present no longer shows completeness 1 with four range failures',
  },
  {
    id: 'd1-a-step-too-long',
    heading: /Coverage of an interval, and a step too long/i,
    body: (b) => !/\| GR \| 0\.500000 \| [\d.]+ \| [\d.]+ \| 8474\.500000 to 8475\.500000 \|/.test(b),
    why: 'the coverage section no longer shows the gamma ray hole at the index skip',
  },
  {
    id: 'd1-a-cumulative-never-falls',
    heading: /A cumulative never falls/i,
    body: (b) => tableRows(b).filter((r) => r[0] === '70' && r[1] === '68').length !== 1,
    why: 'the cumulative section no longer flags day 70 against day 68',
  },
  {
    id: 'd1-slow-drift-is-not-frozen',
    heading: /a slow drift that is not one/i,
    body: (b) => !/the engine finds 0 runs/.test(b),
    why: 'the frozen section no longer shows the slow drift finding no run',
  },
  {
    id: 'd1-z-ceiling',
    heading: /The z-score, sample or population, and its ceiling/i,
    body: (b) => !/`thresholdReachable` false: no value in ten can pass/.test(b),
    why: 'the z ceiling section no longer shows the threshold unreachable at ten values',
  },
  {
    id: 'd1-local-against-global',
    heading: /The Hampel window: local against global/i,
    body: (b) => !/the z-score flags 0/.test(b) || !/\| 70 \| 95\.420000 \|/.test(b),
    why: 'the Hampel section no longer shows the spike flagged locally and missed globally',
  },
  {
    id: 'd1-masking',
    heading: /Grubbs for one outlier, its critical value, and masking/i,
    body: (b) => !/\| two high plugs \| 14 \| [\d.]+ \| [\d.]+ \| [\d.]+ \| [\d.]+ \| [\d.]+ \| false \|/.test(b),
    why: 'the Grubbs section no longer shows the two-plug copy failing to reject',
  },
  {
    id: 'd1-which-chart',
    heading: /Which chart sees what/i,
    body: (b) => {
      const rows = tableRows(b).filter((r) => ['individuals', 'EWMA', 'CUSUM'].includes(r[0]));
      if (rows.length !== 3) return true;
      const [i, e, c] = rows.map((r) => Number(r[1]));
      return !(i < e && i < c);
    },
    why: 'the which-chart section no longer shows the individuals chart seeing fewer shifted days',
  },
];
for (const h of HEADINGS) {
  if (!DIGEST_LINES.some((l) => /^# SECTION \d+:/.test(l) && h.heading.test(l))) {
    refuse(`the heading rule ${h.id} matches no section heading, so it checks nothing`);
  }
}

// A CLEARED PHRASE THAT MATCHES NOTHING IS A ROW CLAIMING WORK IT NEVER DID.
export const CLEARED = [
  // Section 31 describes a published NIST page's printed figures and its
  // design line; the sentences are about a source document, in the present
  // tense, and describe no former engine behaviour.
  /the page's own design formula gives neither/,
];
for (const re of CLEARED) {
  if (!DIGEST_LINES.some((l) => re.test(l))) {
    refuse(`the cleared phrase ${re} matches no line of the digest, so it clears nothing`);
  }
}

// EVERY ENGINE STRING THIS DIGEST QUOTES, pinned by exact fragment to the
// engine source. If the engine's wording changes, the pin breaks and the quote
// is re-read rather than silently kept. Each pin is also checked to be QUOTED
// in the digest, so a pin that guards nothing refuses.
const PINNED = [
  'must be a finite number or missing (null)',
  'must be strictly increasing: sort and de-duplicate the index first (indexCheck finds the offenders)',
  'units are never converted here',
  'must be an array of at least two numbers',
  'or both oil and water rates are required',
  'must be an object of named arrays, for example { oil: [...], water: [...] }',
  'must be a whole number, 2 or more',
  'have zero spread: every present value is the same, so a z-score is undefined',
  'have MAD = 0: more than half the present values equal the median, so the modified z-score is undefined',
  'must be a significance level strictly between 0 and 1',
  'have a singular covariance matrix: a variable is constant or one is a linear combination of others',
  'is missing: a control chart needs a complete series, so fill or drop the gap first',
  'is required: EWMA_0, the historical in-control mean or target',
  "is required: 'sigma' (k and h in multiples of sigma, rule of thumb k = 0.5, h = 4 or 5) or 'data' (k and h in the data's own units)",
  'is missing: give every listed dimension a weight, or none for equal weights',
  'has no step in the',
  'the minimum itself is not allowed',
  'caller weights, normalised by their sum',
  'the weakest is the lowest score; a tie goes to the dimension listed first',
  'sample covariance (n - 1), classical (not robust)',
  'median of the steps in the stated direction',
  'limits supplied by the caller',
].map((frag) => ({ frag, src: 'engines/dataai/quality.js' }));
for (const p of PINNED) {
  if (!DIGEST_LINES.some((l) => l.includes(p.frag))) refuse(`the pinned engine fragment "${p.frag}" is not quoted in the digest, so the pin guards nothing`);
}

export default {
  enginesRoot: process.env.D1_ENGINES || '/root/wt-dai-d1-nextgen/packages/engines',
  pinned: PINNED,
  cleared: CLEARED,
  headings: HEADINGS,
};
