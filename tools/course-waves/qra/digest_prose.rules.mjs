// H5 Quantitative Risk Assessment: the wave's own claims, cleared phrases and
// engine pins for /root/dc-wavekit/digestprose.mjs.
//
//   node /root/dc-wavekit/digestprose.mjs /root/hse-wip-qra/digest.txt \
//        --rules /root/hse-wip-qra
//
// THIS WAVE'S HISTORY POSITION. The engine's FINDINGS record carries one piece
// of development history (six fail-opens closed before its pull request
// merged). The course does not teach it: every line of the digest describes
// current behaviour, and the refusal table shows what the engine does today
// with a preset name every object inherits. Section 11 and section 32 are
// about a PUBLISHED SOURCE's rounding; they describe the source, never the
// engine.
//
// THIS FILE REFUSES RATHER THAN PASSING. Everything it declares about the
// digest is checked against digest.txt when the module loads, and a claim it
// cannot check makes it print REFUSED and exit 2.
//
// Copy rule: no em dashes and no "X, not Y" contrastives in anything a learner
// reads. The messages below obey it too.
import fs from 'node:fs';
import path from 'node:path';

const WAVE = process.env.H5_WAVE_DIR || '/root/hse-wip-qra';
const DIGEST = path.join(WAVE, 'digest.txt');

const refuse = (msg) => {
  console.log(`REFUSED by digest_prose.rules.mjs (H5): ${msg}`);
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
if (DIGEST_LINES.length < 400) refuse(`${DIGEST} has ${DIGEST_LINES.length} lines, which is too few to be the whole digest`);

// NO SECTION MAY FRAME ITSELF AS HISTORY, because there is none.
const historyish = DIGEST_LINES.filter((l) => /^# SECTION \d+:/.test(l) && /USED TO|NO LONGER|REPAIR HISTORY|FAIL-OPEN/i.test(l));
if (historyish.length) refuse(`a section heading frames repair history, which this course does not teach: ${historyish[0]}`);

/* ---------------------------------------------------------- table helpers */

const tableRows = (body) => body
  .split('\n')
  .filter((l) => /^\s*\|/.test(l) && !/^\s*\|\s*---/.test(l))
  .map((l) => l.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map((c) => c.trim()));

// Every heading claim below must match a real heading, or it clears nothing.
// Each body() returns TRUE WHEN THE CLAIM FAILS.
const HEADINGS = [
  {
    // Section 5: two leaves pool into one outcome.
    id: 'h5-pooled-outcome',
    heading: /An event tree: branches, leaves and the leaf frequency/i,
    body: (b) => tableRows(b).filter((r) => r[1] === 'pool fire').length !== 2,
    why: 'the event tree section no longer shows two pool fire leaves pooling into one outcome',
  },
  {
    // Section 6: a float sum a hair below one is accepted, a typing error refused.
    id: 'h5-branch-sum-tolerance',
    heading: /Every branch set sums to one, within a tolerance/i,
    body: (b) => {
      const rows = tableRows(b);
      const flt = rows.find((r) => r[0] === '0.7, 0.2, 0.1');
      const near = rows.find((r) => r[0] === '0.4000001, 0.6');
      return !(flt && flt[1] === '0.9999999999999999' && flt[2] === 'accepted' && near && /^refused/.test(near[2]));
    },
    why: 'the branch sum section no longer shows 0.7, 0.2, 0.1 accepted and 0.4000001, 0.6 refused',
  },
  {
    // Section 8: every wrong build moves the explosion frequency.
    id: 'h5-forgotten-branch-moves',
    heading: /Forgetting a branch: the explosion frequency built wrongly/i,
    body: (b) => {
      const rows = tableRows(b).filter((r) => /^\d+\.\d{6}$/.test(r[2] || ''));
      return rows.length !== 4 || rows[0][2] !== '1.000000' || rows.slice(1).some((r) => r[2] === '1.000000');
    },
    why: 'the forgotten branch section no longer shows three wrong builds that each move the explosion frequency',
  },
  {
    // Section 9: exactly 10 kg/s falls in the middle band.
    id: 'h5-closed-middle-band',
    heading: /The direct ignition table, and what it rests on/i,
    body: (b) => {
      const r = tableRows(b).find((x) => x[0] === 'continuous 10 kg/s');
      return !(r && r.slice(1).every((c) => /\(medium\)$/.test(c)));
    },
    why: 'the ignition table no longer shows exactly 10 kg/s in the closed middle band',
  },
  {
    // Section 18: "more than N" is below "N or more" at every corner.
    id: 'h5-n-or-more',
    heading: /Reading the curve wrongly/i,
    body: (b) => {
      const rows = tableRows(b).filter((r) => /^\d+\.\d{6}$/.test(r[0]));
      return rows.length < 3 || rows.some((r) => !(Number(r[2]) < Number(r[1])));
    },
    why: 'the reading-wrongly section no longer shows "more than N" below "N or more" at every corner',
  },
  {
    // Section 23: a curve on the line TOUCHES it.
    id: 'h5-touches',
    heading: /Touching the line, and the state words/i,
    body: (b) => !tableRows(b).some((r) => r[4] === 'AT_LINE' && r[3] === '1.000000'),
    why: 'the touching section no longer shows a corner AT_LINE with a ratio of 1.000000',
  },
  {
    // Section 26: a product a hair above a threshold stays in the lower band.
    id: 'h5-lower-band',
    heading: /A threshold belongs to the lower band, and the boundary snap/i,
    body: (b) => {
      const r = tableRows(b).find((x) => x[0] === '0.1 x 0.1 x 0.1');
      return !(r && r[1] === '0.0010000000000000002' && r[4] === 'TOLERABLE' && r[5] === 'unacceptable');
    },
    why: 'the boundary section no longer shows 0.1 x 0.1 x 0.1 landing above 1e-3 and staying TOLERABLE',
  },
  {
    // Section 28: the printed checklist total against the engine's.
    id: 'h5-checklist-reproduced',
    heading: /The published CBA checklist example, and a rounded print/i,
    body: (b) => !tableRows(b).some((r) => r[0] === 'total benefit' && r[1] === '9283' && r[2] === '9283.50'),
    why: 'the checklist section no longer prints the published total 9283 beside the engine 9283.50',
  },
];
for (const h of HEADINGS) {
  if (!DIGEST_LINES.some((l) => /^# SECTION \d+:/.test(l) && h.heading.test(l))) {
    refuse(`the heading rule ${h.id} matches no section heading, so it checks nothing`);
  }
}

// A CLEARED PHRASE THAT MATCHES NOTHING IS A ROW CLAIMING WORK IT NEVER DID.
export const CLEARED = [];
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
  'must be a frequency above 0 per year',
  'every branch needs a name',
  'appears twice in one branch set',
  'every branch set must be exhaustive and exclusive',
  'must be the probability of delayed ignition GIVEN no immediate ignition, in [0, 1]',
  'PB Table 4.7 classifies reactivity',
  'give exactly one of occupancyFraction and hoursPerYr',
  'one person cannot spend more than the whole year across locations',
  'an expected number need not be whole',
  'a rate over no exposure is undefined',
  'HSE figures are illustrative only (HSE_ILLUSTRATIVE_VALUES)',
  'DFs that may be considered gross vary from upwards of 1',
  'must be a whole number of years, 1 or more (flows are year-end)',
  'there is no benefit to weigh the cost against',
  "give a period ('day' or 'night') or fractionIndoors, not both",
  'table lookup; the middle band is closed at both ends',
  'LSIR = sum f_i x Pd_i, a person present at the location all the time, outdoors and unprotected',
  'IRPA = sum LSIR_j x occupancy_j x v_j (v as supplied, default 1)',
  'FAR = PLL x 100,000,000 / exposed hours per year',
  'F(N) = sum of f_i with N_i >= N, at each distinct N_i > 0 (left-continuous step function)',
  'UNACCEPTABLE if IR > upper; BROADLY_ACCEPTABLE if IR <= lower; TOLERABLE (reduce ALARP) between',
  'grossly disproportionate when cost / benefit > DF',
  'contour crossings interpolated in log10(IR) between bracketing points',
  'event tree: leaf frequency = f0 x product of the branch probabilities on its path; each branch set sums to 1',
].map((frag) => ({ frag, src: 'engines/hse/qra.js' }));
for (const p of PINNED) {
  if (!DIGEST_LINES.some((l) => l.includes(p.frag))) refuse(`the pinned engine fragment "${p.frag}" is not quoted in the digest, so the pin guards nothing`);
}

export default {
  enginesRoot: process.env.H5_ENGINES || '/root/wt-h5-nextgen/packages/engines',
  pinned: PINNED,
  cleared: CLEARED,
  headings: HEADINGS,
};
