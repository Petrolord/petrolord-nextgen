// D4 Data-Driven Production Forecasting: the wave's own claims, cleared phrases and engine pins for
// /root/dc-wavekit/digestprose.mjs.
//
//   node /root/dc-wavekit/digestprose.mjs /root/dai-wip-forecastml/digest.txt \
//        --rules /root/dai-wip-forecastml
//
// THIS WAVE'S HISTORY POSITION. The course teaches no repair history: the
// engine's review changes before its merge are provenance.
//
// THIS FILE REFUSES RATHER THAN PASSING. Everything it declares about the
// digest is checked against digest.txt when the module loads, and a claim it
// cannot check makes it print REFUSED and exit 2.
import fs from 'node:fs';
import path from 'node:path';

const WAVE = process.env.D4_WAVE_DIR || '/root/dai-wip-forecastml';
const DIGEST = path.join(WAVE, 'digest.txt');

const refuse = (msg) => {
  console.log(`REFUSED by digest_prose.rules.mjs (D4): ${msg}`);
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
    id: 'd4-damped-flattens',
    heading: /The damped trend: phi, the flattening and its limit/i,
    body: (b) => {
      const rows = tableRows(b).filter((r) => /^\d+$/.test(r[0]) && r.length === 4 && /^\d\.\d{6}$/.test(r[3]));
      return rows.length < 4 || !rows.every((r) => r[3] === rows[0][3]) || !/THE LIMIT/.test(b);
    },
    why: 'the damped section no longer shows every step change shrinking by the same phi, or no longer states the limit',
  },
  {
    id: 'd4-workover-winner',
    heading: /a workover that changes the winner/i,
    body: (b) => !/Before the shut-in the ranking by MASE is arps,/.test(b) || !/After the workover it is (?!arps)/.test(b),
    why: 'the comparison section no longer shows arps first before the shut-in and a smoothing method first after the workover',
  },
  {
    id: 'd4-median-away',
    heading: /The residual bootstrap: paths, one seeded stream/i,
    body: (b) => !/A MEDIAN AWAY FROM THE POINT FORECAST/.test(b) || !/lies above even the P10 \(high\)/.test(b),
    why: 'the bootstrap section no longer shows a point forecast outside its own interval',
  },
  {
    id: 'd4-leakage',
    heading: /Leakage: scoring months the fit has already seen/i,
    body: (b) => tableRows(b).filter((r) => r.length === 3 && /^\d+\.\d{6}$/.test(r[1])).length !== 3 || !/checked exactly/.test(b),
    why: 'the leakage section no longer tables the honest route and the two leaky routes, or no longer says the leaky two are the same numbers',
  },
  {
    id: 'd4-one-origin',
    heading: /Pooling backtest errors/i,
    body: (b) => !/ONE ORIGIN CAN LEAVE A METRIC UNDEFINED/.test(b) || !/leaves the overall MASE and every by-horizon MASE null/.test(b),
    why: 'the pooling section no longer shows one null origin scale voiding the pooled MASE',
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
const FORECAST = [
  'must be a finite number: fill or drop missing values first',
  "must be 'ses', 'holt' or 'damped'",
  "applies to 'holt' and 'damped' only: 'ses' has no trend",
  "applies to 'damped' only: 'ses' has no trend to damp",
  "applies to 'damped' only: 'holt' is the damped method with phi = 1",
  'must be a number above 0 and at most 1 when given (when fitted it is searched from 0.8 to 0.98)',
  'must be a number from 0 to 1 (inclusive)',
  'must be a whole number from 0 to 4294967295',
  'the bootstrap resamples at least 2',
  'a backtest with horizon',
  'a backtest accepts: raise step or firstOrigin',
  'fitArpsModel needs at least 3 (it drops zero and negative rates)',
  'with finite qi > 0 and Di > 0 on the',
  'and MAPE divides by each actual',
  'MASE needs insample (the training series) to scale by its in-sample naive error',
  'naive forecast has no in-sample error (it needs more than',
  'is 0), so the scale is 0',
  'mean e (bias; positive means the forecast is low)',
  '100 x mean |e / actual| (percent); null when any actual is 0',
  '100 x mean 2|e| / (|actual| + |forecast|), percent on 0 to 200; a term with actual = forecast = 0 scores 0',
  'mean |e| / Q, Q = mean |y_t - y_{t-m}| over the in-sample (training) series (Hyndman and Koehler 2006); null when Q = 0',
  'free parameters re-estimated at every origin',
  'free parameters estimated on the first window and held at every later origin',
  'a negative percentile is reported as 0 (clippedToZero counts them)',
  'fitArpsModel drops zero and negative values (shut-in months) before fitting',
  'values within 1e-12 (relative) keep the listed order (methods as given, arps last)',
  'all parameters given: no estimation',
].map((frag) => ({ frag, src: 'engines/dataai/forecast.js' }));
const PERCENTILE = [
  'P90 means a 90% probability the actual quantity meets or exceeds this value, per SPE PRMS.',
].map((frag) => ({ frag, src: 'lib/conventions/percentile.js' }));
const PINNED = [...FORECAST, ...PERCENTILE];
for (const p of PINNED) {
  if (!DIGEST_LINES.some((l) => l.includes(p.frag))) refuse(`the pinned engine fragment "${p.frag}" is not quoted in the digest, so the pin guards nothing`);
}

export default {
  enginesRoot: process.env.D4_ENGINES || '/root/wt-dai-d4-nextgen/packages/engines',
  pinned: PINNED,
  cleared: CLEARED,
  headings: HEADINGS,
};
