// D2 Machine Learning on Well Data: the wave's own claims, cleared phrases and engine
// pins for /root/dc-wavekit/digestprose.mjs.
//
//   node /root/dc-wavekit/digestprose.mjs /root/dai-wip-mlcore/digest.txt \
//        --rules /root/dai-wip-mlcore
//
// THIS WAVE'S HISTORY POSITION. The course teaches no repair history: the
// engine's lead-review changes before its merge are provenance.
//
// THIS FILE REFUSES RATHER THAN PASSING. Everything it declares about the
// digest is checked against digest.txt when the module loads, and a claim it
// cannot check makes it print REFUSED and exit 2.
import fs from 'node:fs';
import path from 'node:path';

const WAVE = process.env.D2_WAVE_DIR || '/root/dai-wip-mlcore';
const DIGEST = path.join(WAVE, 'digest.txt');

const refuse = (msg) => {
  console.log(`REFUSED by digest_prose.rules.mjs (D2): ${msg}`);
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
// Every heading claim below must match a real heading, or it clears nothing.
// Each `body` returns TRUE WHEN THE HEADING IS FALSE over its block.
const HEADINGS = [
  {
    id: 'd2-a-random-split-flatters-nothing',
    heading: /Leakage, and when a random split flatters nothing/i,
    body: (b) => {
      const rows = tableRows(b).filter((r) => /^\d+$/.test(r[0]) && r.length === 7);
      if (rows.length !== 12) return true;
      return !(rows.some((r) => Number(r[3]) < 0) && rows.every((r) => Number(r[6]) > 0));
    },
    why: 'the leakage section no longer shows a negative logs-only optimism beside positive attribute optimism on every seed',
  },
  {
    id: 'd2-bias-variance',
    heading: /Ridge and the bias-variance trade/i,
    body: (b) => {
      const rows = tableRows(b).filter((r) => r.length === 5 && /^[\d.]+$/.test(r[0]));
      const rmse = rows.map((r) => Number(r[3]));
      const i = rmse.indexOf(Math.min(...rmse));
      return rows.length < 4 || i === 0 || i === rmse.length - 1;
    },
    why: 'the ridge section no longer shows the test RMSE at its lowest at an interior lambda',
  },
  {
    id: 'd2-every-well-tested-once',
    heading: /Cross-validation by wells: every well tested once/i,
    body: (b) => {
      const rows = tableRows(b).filter((r) => /^\d$/.test(r[0]) && r.length === 4);
      const wells = rows.flatMap((r) => r[1].split(', '));
      return rows.length !== 3 || wells.length !== 9 || new Set(wells).size !== 9;
    },
    why: 'the k-fold section no longer tests each of the nine wells exactly once',
  },
  {
    id: 'd2-filip-refused',
    heading: /The NIST reference problems, and what a digit means/i,
    body: (b) => !/^> X is too ill-conditioned for a float64 least squares fit/m.test(b) || !/FILIP, REFUSED AT THE DEFAULT/.test(b),
    why: 'the NIST section no longer quotes the refusal of Filip at the default',
  },
  {
    id: 'd2-separation-before-iteration',
    heading: /Separation, and the exact test before any iteration/i,
    body: (b) => !/^> y is completely separated/m.test(b) || !/^> y is quasi-completely separated/m.test(b),
    why: 'the separation section no longer quotes both separation refusals',
  },
  {
    id: 'd2-learning-curve-in-wells',
    heading: /The learning curve, counted in wells/i,
    body: (b) => tableRows(b).filter((r) => r.length === 5 && /^\d$/.test(r[0])).map((r) => r[0]).join() !== '1,2,3,4,5,6',
    why: 'the learning curve section no longer counts its points in wells one to six',
  },
  {
    id: 'd2-writing-it-back',
    heading: /Missing-log prediction end to end, and writing it back/i,
    body: (b) => !/DT_PRED/.test(b) || !/A RANGE CHECK SEES ONLY THE ROWS THAT LEAVE THE RANGE/.test(b),
    why: 'the missing-log section no longer writes the prediction back as a new channel or no longer says what the range check misses',
  },
];
for (const h of HEADINGS) {
  if (!DIGEST_LINES.some((l) => /^# SECTION \d+:/.test(l) && h.heading.test(l))) {
    refuse(`the heading rule ${h.id} matches no section heading, so it checks nothing`);
  }
}

// A CLEARED PHRASE THAT MATCHES NOTHING IS A ROW CLAIMING WORK IT NEVER DID.
// The kit reads "regression" as possible history; in this course it is the
// name of a method (least squares, ridge and logistic regression), always.
export const CLEARED = [
  /binary logistic regression/,
  /Logistic regression (on the stated pay rule|models the probability|has no closed form)/,
  /Logistic regression with l2 = /,
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
  'must be a finite number: fill or drop missing values first',
  'has zero variance on the',
  'standardising would divide by zero, so drop the feature or fit on rows where it varies',
  'must hold at least 2 distinct groups to hold one out',
  'must be the same type as groups[0]: all strings or all numbers',
  'must have more rows than coefficients',
  'is too ill-conditioned for a float64',
  'so some coefficients could carry no reliable digits; drop or combine collinear features, centre or rescale them, or raise maxCondition knowingly',
  'separated by a linear combination of the features',
  'every row lies strictly on its own class side of a hyperplane',
  'every row lies on or on its own class side of a hyperplane, some exactly on it',
  'so the maximum likelihood coefficients are infinite: add an L2 penalty (l2 > 0) or remove the separating feature',
  'must contain both classes, 0 and 1',
  'is singular to working precision',
  'did not converge in',
  'the last full Newton step had a largest component of',
  'leakage demonstration only: rows of one well can fall on both sides (sharedGroups); use groupSplit or groupKFold to score a model',
  'population standard deviation (n), as scikit-learn StandardScaler',
  'the first nTest groups of the shuffled order are the test set; every row of a group goes with it',
  'ceil(testFraction x count), a product within 1e-9 of a whole number taken as that number',
  'none: a new row outside the training range maps outside [0, 1]',
  'trapezoid rule over the curve points (equals the Mann-Whitney probability with ties counted one half)',
  'class 1 when the probability is above 0.5, class 0 at exactly 0.5',
  'equal scores are one threshold: their rows move together, a diagonal step when the classes are mixed',
  'on the sum of squares: equals scikit-learn Ridge(alpha = lambda, fit_intercept = True) on the same standardised features',
  'in coefficient units: set tol to the scale of the coefficients when features are in very small or very large units',
  "matrix[i][j] counts rows whose TRUE label is labels[i] and PREDICTED label is labels[j] (scikit-learn layout)",
].map((frag) => ({ frag, src: 'engines/dataai/ml.js' }));
for (const p of PINNED) {
  if (!DIGEST_LINES.some((l) => l.includes(p.frag))) refuse(`the pinned engine fragment "${p.frag}" is not quoted in the digest, so the pin guards nothing`);
}

export default {
  enginesRoot: process.env.D2_ENGINES || '/root/wt-dai-d2-nextgen/packages/engines',
  pinned: PINNED,
  cleared: CLEARED,
  headings: HEADINGS,
};
