// H3 Process Safety: LOPA & SIL Determination: the wave's own claims, cleared
// phrases and engine pins for /root/dc-wavekit/digestprose.mjs.
//
//   node /root/dc-wavekit/digestprose.mjs /root/hse-wip-lopa/digest.txt \
//        --rules /root/hse-wip-lopa
//
// THIS WAVE'S HISTORY POSITION. The engine has no repair history: it was
// written, oracle-gated and merged in one pull request. So there is no framed
// history section, and every line of the digest describes current behaviour.
// Section 29 is about a PUBLISHED SOURCE's inferred inputs and a printing slip
// in that source; it describes the source, never the engine.
//
// THIS FILE REFUSES RATHER THAN PASSING. Everything it declares about the
// digest is checked against digest.txt when the module loads, and a claim it
// cannot check makes it print REFUSED and exit 2.
//
// Copy rule: no em dashes and no "X, not Y" contrastives in anything a learner
// reads. The messages below obey it too.
import fs from 'node:fs';
import path from 'node:path';

const WAVE = process.env.H3_WAVE_DIR || '/root/hse-wip-lopa';
const DIGEST = path.join(WAVE, 'digest.txt');

const refuse = (msg) => {
  console.log(`REFUSED by digest_prose.rules.mjs (H3): ${msg}`);
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
const historyish = DIGEST_LINES.filter((l) => /^# SECTION \d+:/.test(l) && /USED TO|NO LONGER|REPAIR HISTORY/i.test(l));
if (historyish.length) refuse(`a section heading frames repair history in a wave that has none: ${historyish[0]}`);

/* ---------------------------------------------------------- table helpers */

const tableRows = (body) => body
  .split('\n')
  .filter((l) => /^\s*\|/.test(l) && !/^\s*\|\s*---/.test(l))
  .map((l) => l.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map((c) => c.trim()));

// Every heading claim below must match a real heading, or it clears nothing.
// Each body() returns TRUE WHEN THE CLAIM FAILS.
const HEADINGS = [
  {
    // Section 7: the TMEL ladder must reach all six outcome states.
    id: 'h3-tmel-ladder-six-states',
    heading: /The TMEL, the required RRF and the required PFDavg/i,
    body: (b) => {
      const states = new Set(tableRows(b).map((r) => r[2]).filter((x) => /^(NO_SIF|RISK_|SIL\d|BEYOND)/.test(x || '')));
      return states.size !== 6;
    },
    why: 'the TMEL section no longer shows all six outcome states on its ladder',
  },
  {
    // Section 8: a SIF inside the required band must still miss the TMEL.
    id: 'h3-band-is-a-label',
    heading: /Closing the loop with a proposed SIF/i,
    body: (b) => !tableRows(b).some((r) => r[1] === '2' && r[3] === 'false'),
    why: 'the loop section no longer shows a SIF in the required SIL 2 band that misses the TMEL',
  },
  {
    // Section 10: an exact decade belongs to the lower SIL.
    id: 'h3-exact-decade-lower-sil',
    heading: /where an exact decade falls/i,
    body: (b) => {
      const rows = tableRows(b);
      const at = (p) => rows.find((r) => r[0] === p);
      return !(at('0.01') && at('0.01')[1] === '1' && at('0.001') && at('0.001')[1] === '2');
    },
    why: 'the band section no longer prints 0.01 as SIL 1 and 0.001 as SIL 2',
  },
  {
    // Section 11: the snap section must show a double strictly above 100
    // banded SIL 1 by the snap and SIL 2 by a plain comparison.
    id: 'h3-snap-needed',
    heading: /The decade snap: why an exact decade needs one/i,
    body: (b) => !tableRows(b).some((r) => r[2] === '100.00000000000001' && r[4] === 'SIL1' && r[5] === 'SIL2'),
    why: 'the snap section no longer shows a double above 100 that only the snap bands correctly',
  },
  {
    // Section 20: the 2oo2 with a typed beta factor must be identical to the
    // one without it, and warned.
    id: 'h3-two-of-two-no-beta',
    heading: /Two out of two carries no beta factor term/i,
    body: (b) => {
      const rows = tableRows(b).filter((r) => /^2oo2/.test(r[0]));
      return rows.length !== 2 || rows[0][1] !== rows[1][1] || !/was ignored/.test(rows[1][3]);
    },
    why: 'the 2oo2 section no longer shows the typed beta factor changing nothing and being warned about',
  },
  {
    // Section 28: Annex B is never below route B.
    id: 'h3-annex-b-conservative',
    heading: /How conservative the Annex B forms are/i,
    body: (b) => {
      const rows = tableRows(b).filter((r) => r.length === 4 && /e[-+]\d+$/.test(r[3]));
      return rows.length < 20 || rows.some((r) => Number(r[3]) < 0);
    },
    why: 'the conservatism section prints a negative departure or too few rows',
  },
  {
    // Section 29: only the raised beta factor reproduces the printed row.
    id: 'h3-printing-slip',
    heading: /inferred inputs, and a printing slip/i,
    body: (b) => {
      const rows = tableRows(b).filter((r) => /^0\.1(5)?, /.test(r[0]));
      return rows.length !== 2 || rows[0][2] === rows[0][3] || rows[1][2] !== rows[1][3];
    },
    why: 'the inference section no longer shows the printed beta factor failing and the raised one reproducing',
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
  'the tolerable mitigated event likelihood must be a frequency above 0 per year',
  'which is not a LOPA scenario',
  'every IPL needs a name',
  'appears twice: one credit per IPL',
  'a PFD of 0 is a perfect layer, which none is',
  'must be a PFDavg above 0 and no more than 1',
  'there is no dangerous failure to average',
  'detected failures are down for the restoration time',
  'beta = 0 is a claim of no common cause and has to be typed',
  'the uncovered failures stay until the item is restored as new',
  'use an exact (Markov) model',
  'the summed PFDavg reaches 1: not a probability',
  'not flagged independent (independent must be true to take credit)',
  'flagged not auditable',
  'an IPL is credited once, and only when flagged independent === true and not flagged auditable === false',
  'the SIF must achieve requiredSifPfdAvg itself; the SIL band alone does not guarantee it',
  'redesign the process or add non-SIS layers rather than rely on a SIL 4 SIF',
  'no SIF can supply it, redesign',
  'PFDavg below 1e-5 is off the table: no claim beyond SIL 4 exists',
  'an exact decade belongs to the higher-PFD band',
  'Annex B carries no beta term for 2oo2',
  'lDU/lD (T1/2 + MRT) + lDD/lD MTTR',
  'does not apply to',
  'the linearised (rare-event) equations overstate PFDavg noticeably here',
  'bisection on T1 of the Annex B PFDavg, which is non-decreasing in T1',
  'series sum of subsystem PFDavg',
  'reduces to the ISA-TR84.00.02 simplified forms when lambdaDD = 0 and MRT = 0',
  'frequencies per year; probabilities and PFDs dimensionless',
].map((frag) => ({ frag, src: 'engines/hse/lopa.js' }));
for (const p of PINNED) {
  if (!DIGEST_LINES.some((l) => l.includes(p.frag))) refuse(`the pinned engine fragment "${p.frag}" is not quoted in the digest, so the pin guards nothing`);
}

export default {
  enginesRoot: process.env.H3_ENGINES || '/root/wt-h3-nextgen/packages/engines',
  pinned: PINNED,
  cleared: CLEARED,
  headings: HEADINGS,
};
