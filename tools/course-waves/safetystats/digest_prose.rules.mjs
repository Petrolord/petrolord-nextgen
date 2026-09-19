// H1 Safety Performance Statistics & KPIs: the wave's own claims, cleared
// phrases and engine pins for /root/dc-wavekit/digestprose.mjs.
//
//   node /root/dc-wavekit/digestprose.mjs /root/hse-wip-safetystats/digest.txt \
//        --rules /root/hse-wip-safetystats
//
// THIS WAVE'S HISTORY POSITION. The engine has no repair history: it was
// written, oracle-gated and merged in one pull request. So there is no framed
// history section, and every line of the digest describes current behaviour.
//
// THIS FILE REFUSES RATHER THAN PASSING. Everything it declares about the
// digest is checked against digest.txt when the module loads, and a claim it
// cannot check makes it print REFUSED and exit 2.
//
// Copy rule: no em dashes and no "X, not Y" contrastives in anything a learner
// reads. The messages below obey it too.
import fs from 'node:fs';
import path from 'node:path';

const WAVE = process.env.H1_WAVE_DIR || '/root/hse-wip-safetystats';
const DIGEST = path.join(WAVE, 'digest.txt');

const refuse = (msg) => {
  console.log(`REFUSED by digest_prose.rules.mjs (H1): ${msg}`);
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

// NO SECTION MAY FRAME ITSELF AS HISTORY, because there is none. Checked here
// rather than left to the general rule, which fires on headings only.
const historyish = DIGEST_LINES.filter((l) => /^# SECTION \d+:/.test(l) && /USED TO|NO LONGER|REPAIR HISTORY/i.test(l));
if (historyish.length) refuse(`a section heading frames repair history in a wave that has none: ${historyish[0]}`);

/* ---------------------------------------------------------- table helpers */

const tableRows = (body) => body
  .split('\n')
  .filter((l) => /^\s*\|/.test(l) && !/^\s*\|\s*---/.test(l))
  .map((l) => l.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map((c) => c.trim()));

// Every heading claim below must match a real heading, or it clears nothing.
const HEADINGS = [
  {
    // Section 2: the base-only table must show the three bases and the ratios
    // the sentence under it states.
    id: 'h1-caller-names-the-base',
    heading: /the caller names the base/i,
    body: (b) => {
      const rows = tableRows(b).filter((r) => /^\d+$/.test(r[0]));
      if (rows.length !== 3) return true;
      return !/5\.000000/.test(b) || !/500\.000000/.test(b);
    },
    why: 'the section that says only the base moved no longer prints three bases or the ratios 5 and 500',
  },
  {
    // Section 10: sum then divide must print BOTH the pooled rate and the mean
    // of the site rates, and they must differ.
    id: 'h1-sum-then-divide',
    heading: /Sum, then divide: pooling sites/i,
    body: (b) => {
      const pooled = /pooled rate, `rate` \| ([\d.]+)/.exec(b);
      const mean = /mean of the site rates, `meanOfPeriodRates` \| ([\d.]+)/.exec(b);
      return !pooled || !mean || pooled[1] === mean[1];
    },
    why: 'the sum-then-divide section no longer prints the pooled rate beside a different mean of rates',
  },
  {
    // Section 15: conservative by construction must show every coverage at or
    // above 0.95.
    id: 'h1-conservative',
    heading: /Conservative by construction/i,
    body: (b) => {
      const rows = tableRows(b).filter((r) => r.length === 3 && /^\d+\.\d{6}$/.test(r[0]));
      if (rows.length < 5) return true;
      return rows.some((r) => Number(r[1]) < 0.95);
    },
    why: 'the heading says the interval is conservative over a coverage table with a row below 0.95 or too few rows',
  },
  {
    // Section 19: the convention section's headline is that central and minlike
    // straddle 0.05 on UTOROGU.
    id: 'h1-central-and-minlike-straddle',
    heading: /The central p-value, the minlike p-value/i,
    body: (b) => {
      const c = /engine pValue, central[^|]*\| ([\d.]+)/.exec(b);
      const m = /minlike p-value, derived[^|]*\| ([\d.]+)/.exec(b);
      return !c || !m || !(Number(c[1]) > 0.05 && Number(m[1]) < 0.05);
    },
    why: 'the convention section no longer shows the central p-value above 0.05 with the minlike one below it',
  },
  {
    // Section 22: strictly outside must print points exactly on their limits
    // that do not signal.
    id: 'h1-strictly-outside',
    heading: /Signals: strictly outside/i,
    body: (b) => !/\| 1 \| 18 \| 2\.000000 \| 0\.000000 \| 2\.000000 \| null \|/.test(b),
    why: 'the strictly-outside section no longer prints a point sitting exactly on its limit with no signal',
  },
];
for (const h of HEADINGS) {
  if (!DIGEST_LINES.some((l) => /^# SECTION \d+:/.test(l) && h.heading.test(l))) {
    refuse(`the heading rule ${h.id} matches no section heading, so it checks nothing`);
  }
}

// A CLEARED PHRASE THAT MATCHES NOTHING IS A ROW CLAIMING WORK IT NEVER DID.
export const CLEARED = [
  // Section 8 names the ANSI Z16.1 convention in the past tense because the
  // standard itself is historical; the sentence describes a standard, not the
  // engine, and the engine sentence beside it is present tense.
  /the ANSI Z16\.1 convention used 1,000,000 with scheduled time charges/,
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
  'there is no default',
  'an event count is not a fraction',
  'a rate over no exposure is undefined',
  'classify the events against API RP 754 before rating them',
  'must be 200,000 or 1,000,000 for an API RP 754 PSE rate',
  'an event needs someone at work',
  'no complete window exists',
  'must be a fraction strictly between 0 and 1, for example 0.95',
  'the conditional test has no events to condition on',
  'the rate ratio and its upper limit are unbounded',
  'a u-chart point needs exposure; drop periods with no hours before charting',
  'the centre line is zero and every limit has zero width',
  'no ANSI Z16.1 time charges are added; days are as counted by the caller',
  'it is NOT the pooled rate',
  'a period with no hours has no rate and is left out of that mean',
  'no hours in this window: the rate is undefined',
  'per 200,000 hours (OSHA/BLS: 100 full-time workers, 40 h x 50 weeks)',
].map((frag) => ({ frag, src: 'engines/hse/safetyStats.js' }));
for (const p of PINNED) {
  if (!DIGEST_LINES.some((l) => l.includes(p.frag))) refuse(`the pinned engine fragment "${p.frag}" is not quoted in the digest, so the pin guards nothing`);
}

export default {
  enginesRoot: process.env.H1_ENGINES || '/root/wt-h1-nextgen/packages/engines',
  pinned: PINNED,
  cleared: CLEARED,
  headings: HEADINGS,
};
