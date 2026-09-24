// D3 Electrofacies: the wave's own claims, cleared phrases and engine pins for
// /root/dc-wavekit/digestprose.mjs.
//
//   node /root/dc-wavekit/digestprose.mjs /root/dai-wip-facies/digest.txt \
//        --rules /root/dai-wip-facies
//
// THIS WAVE'S HISTORY POSITION. The course teaches no repair history: the
// engine's review changes before its merge are provenance.
//
// THIS FILE REFUSES RATHER THAN PASSING. Everything it declares about the
// digest is checked against digest.txt when the module loads, and a claim it
// cannot check makes it print REFUSED and exit 2.
import fs from 'node:fs';
import path from 'node:path';

const WAVE = process.env.D3_WAVE_DIR || '/root/dai-wip-facies';
const DIGEST = path.join(WAVE, 'digest.txt');

const refuse = (msg) => {
  console.log(`REFUSED by digest_prose.rules.mjs (D3): ${msg}`);
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
    id: 'd3-covariance-against-correlation',
    heading: /Covariance against correlation, and clustering the raw logs/i,
    body: (b) => {
      const rows = tableRows(b).filter((r) => /^PC\d$/.test(r[0]) && r.length === 7);
      return rows.length !== 4 || !(Number(rows[0][2]) > 0.99);
    },
    why: 'the covariance section no longer shows the first covariance component carrying almost all the variance',
  },
  {
    id: 'd3-several-starts',
    heading: /Several starts and the lowest inertia/i,
    body: (b) => {
      const rows = tableRows(b).filter((r) => /^\d+$/.test(r[0]) && r.length === 3);
      const one = rows.map((r) => Number(r[1])); const ten = rows.map((r) => Number(r[2]));
      return rows.length < 5 || !one.some((v, i) => v > ten[i]);
    },
    why: 'the starts section no longer shows one start stopping above ten starts on some seed',
  },
  {
    id: 'd3-elbow-picks-nothing',
    heading: /The elbow: inertia against k/i,
    body: (b) => !/NO ELBOW IS PICKED FOR YOU/.test(b) || !/^> inertia rises at k = /m.test(b),
    why: 'the elbow section no longer says no elbow is picked, or no longer quotes the rising-inertia warning',
  },
  {
    id: 'd3-a-row-alone',
    heading: /^# SECTION \d+: The silhouette \(/i,
    body: (b) => !/A ROW ALONE IN ITS CLUSTER scores 0/.test(b) || !/its silhouette is 0\.000000/.test(b),
    why: 'the silhouette section no longer shows a singleton scoring 0',
  },
  {
    id: 'd3-tree-nests',
    heading: /The linkage matrix, the cut and a re-cut/i,
    body: (b) => tableRows(b).filter((r) => r.length === 3 && /^\d$/.test(r[0])).length < 4,
    why: 'the re-cut section no longer tables the cuts it says nest',
  },
  {
    id: 'd3-root-tie',
    heading: /Ties and exact comparisons in the tree/i,
    body: (b) => {
      const rows = tableRows(b).filter((r) => r.length === 4 && /<=/.test(r[1]));
      return rows.length !== 2 || rows[0][2] !== rows[1][2] || !/^NPHI/.test(rows[0][1]) || !/^PEF/.test(rows[1][1]);
    },
    why: 'the ties section no longer shows NPHI and PEF tying at the root with the same decrease',
  },
  {
    id: 'd3-writing-facies-back',
    heading: /Predicting the uncored wells, and writing the facies back/i,
    body: (b) => !/FACIES_PRED/.test(b) || !/A RANGE CHECK SEES ONLY THE ROWS THAT LEAVE THE RANGE/.test(b),
    why: 'the uncored-wells section no longer writes the facies back as a new channel or no longer says what the range check misses',
  },
];
for (const h of HEADINGS) {
  if (!DIGEST_LINES.some((l) => /^# SECTION \d+:/.test(l) && h.heading.test(l))) {
    refuse(`the heading rule ${h.id} matches no section heading, so it checks nothing`);
  }
}

// A CLEARED PHRASE THAT MATCHES NOTHING IS A ROW CLAIMING WORK IT NEVER DID.
// The Suite's older facies code is named once, in "what is not built", as the
// reason no self-organising map is taught; it describes code that is not this
// engine, in the present tense of what that code does.
export const CLEARED = [
  /the Suite's older facies code had one that drew from an unseeded generator/,
];
for (const re of CLEARED) {
  if (!DIGEST_LINES.some((l) => re.test(l))) {
    refuse(`the cleared phrase ${re} matches no line of the digest, so it clears nothing`);
  }
}

// EVERY ENGINE STRING THIS DIGEST QUOTES, pinned by exact fragment to the
// engine source that writes it. If the engine's wording changes, the pin breaks
// and the quote is re-read rather than silently kept. Each pin is also checked
// to be QUOTED in the digest, so a pin that guards nothing refuses.
const CLUSTER = [
  'must be a finite number: fill or drop missing values first',
  'must be an array of at least',
  "must be 'correlation' or 'covariance'",
  'has zero total variance (every column is constant), so there are no principal components',
  'must be the result of pca',
  'k-means++ cannot place',
  'must be 1 (or left out) when init gives the starting centres',
  "must be 'standard', 'minmax' or 'none'",
  'the silhouette compares each row with the next nearest cluster',
  'the silhouette computes in full (every pair of rows): give sampleSize and seed to score a seeded sample',
  "must be 'ward', 'complete' or 'average'",
  'agglomerative clustering accepts (it holds every pairwise distance, n(n - 1)/2 of them): cluster a sample or use kmeans',
  'must be the non-empty linkageMatrix of agglomerative',
  'kNN computes: classify fewer rows at a time or thin the training rows',
  'must be a whole number, 0 or more (0 is a single leaf)',
  'one-to-one matching would leave clusters unmatched; use mode \'majority\' or fewer clusters',
  'those runs stopped in a local minimum; raise nInit',
  'so the directions of those components are not unique: the loadings shown are one valid choice',
  'correlation matrix: features standardised with the SAMPLE SD (n - 1), so each score variance equals its eigenvalue and the eigenvalues sum to the number of features',
  'in each component the first loading whose absolute value is within 1e-9 (relative) of the largest is made positive (scikit-learn: the largest absolute loading positive)',
  'nearest centre by Euclidean distance on the scaled features; squared distances within 1e-12 (relative) of the smallest are tied and go to the lower centre index',
  'lowest inertia over the runs; a run within 1e-12 (relative) of the best so far does not replace it',
  'a row alone in its cluster scores 0, and a = b = 0 scores 0 (scikit-learn)',
  'merges whose heights are within 1e-12 (relative) of the smallest are tied; the tied pair with the lowest cluster ids wins (the smaller id first, then the other)',
  'majority of the k labels; a tied vote goes to the tied label whose nearest member comes first in the neighbour order (scikit-learn takes the label that sorts first)',
  'equal decreases (compared exactly on the integer counts) go to the lower feature index, then the lower threshold (scikit-learn breaks feature ties at random)',
  'the majority class of the leaf; a tie goes to the class that sorts first',
  'when the denominator is zero (both labelings one cluster, or both all singletons) the index is 1 (scikit-learn)',
].map((frag) => ({ frag, src: 'engines/dataai/cluster.js' }));
const ML = [
  'standardising would divide by zero, so drop the feature or fit on rows where it varies',
  'min-max scaling would divide by zero, so drop the feature or fit on rows where it varies',
  'must be 0 or 1',
].map((frag) => ({ frag, src: 'engines/dataai/ml.js' }));
const PINNED = [...CLUSTER, ...ML];
for (const p of PINNED) {
  if (!DIGEST_LINES.some((l) => l.includes(p.frag))) refuse(`the pinned engine fragment "${p.frag}" is not quoted in the digest, so the pin guards nothing`);
}

export default {
  enginesRoot: process.env.D3_ENGINES || '/root/wt-dai-d3-nextgen/packages/engines',
  pinned: PINNED,
  cleared: CLEARED,
  headings: HEADINGS,
};
