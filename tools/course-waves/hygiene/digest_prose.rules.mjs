// H2 Occupational Hygiene: the wave's own heading claims, cleared phrases and
// engine pins for /root/dc-wavekit/digestprose.mjs.
//
//   node /root/dc-wavekit/digestprose.mjs /root/hse-wip-hygiene/digest.txt \
//        --rules /root/hse-wip-hygiene
//
// THIS WAVE'S HISTORY POSITION. The engine has NO repair history: it was written
// for this course and merged once. So there is no history section and this
// file declares none, and the gate's general history sweep applies to every
// section with no frame to excuse a hit. Section 19 (errata) is about the
// SOURCES and is current.
//
// THIS FILE REFUSES RATHER THAN PASSING. Everything it declares about the
// digest is checked against digest.txt when the module loads, and a claim it
// cannot check makes it print REFUSED and exit 2.
//
// Copy rule: no em dashes and no "X, not Y" contrastives in anything a learner
// reads. The messages below obey it too.
import fs from 'node:fs';
import path from 'node:path';

const WAVE = process.env.H2_WAVE || '/root/hse-wip-hygiene';
const DIGEST = path.join(WAVE, 'digest.txt');

const refuse = (msg) => {
  console.log(`REFUSED by digest_prose.rules.mjs (H2): ${msg}`);
  process.exit(2);
};

let DIGEST_LINES = [];
try {
  DIGEST_LINES = fs.readFileSync(DIGEST, 'utf8').replace(/\n$/, '').split('\n');
} catch (e) {
  refuse(`${DIGEST} could not be read (${e.code}), so every declaration below is unchecked`);
}

// Every heading this file writes a rule for must exist, or the rule is dead.
const DECLARED_HEADINGS = [
  /^# SECTION 3: The constants this engine stands on, MEASURED out of the engine/,
  /^THE THRESHOLD IS INCLUSIVE \(judgement J2\)/,
  /^# SECTION 17: Metabolic rate, and the NIOSH 2016 RAL and REL equations/,
  /^THE HEAT DECISION\./,
  /^THE DOSE IS NOT RESCALED TO EIGHT HOURS\./,
];
DECLARED_HEADINGS.forEach((re) => {
  if (!DIGEST_LINES.some((l) => re.test(l))) refuse(`the heading ${re} that a rule below is written for is not in the digest`);
});
if (DIGEST_LINES.some((l) => /REPAIR HISTORY|USED TO DO/i.test(l) && /^# SECTION/.test(l))) {
  refuse('a SECTION title reads as a history section, and this wave declares that its engine has no history');
}

/* ------------------------------------------------------ CLEARED PHRASES */

export const CLEARED = [];

const tableRows = (body) => body
  .split('\n')
  .filter((l) => /^\s*\|/.test(l) && !/^\s*\|\s*---/.test(l))
  .map((l) => l.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map((c) => c.trim()));

export default {
  enginesRoot: process.env.H2_ENGINES || '/root/wt-h2-nextgen/packages/engines',

  // No engine string this digest quotes breaches the owner copy rule, so no
  // exemption is pinned. An entry added here is pinned by exact fragment to the
  // engine source, so a dead exemption fails.
  pinned: [],

  cleared: CLEARED,

  headings: [
    {
      // Section 3 claims every constant is measured and compared against a
      // literal typed in the generator. A row with no relative difference, or
      // fewer than thirty rows, is no longer that claim.
      id: 'h2-pins-carry-a-difference',
      heading: /MEASURED out of the engine and pinned against a literal typed in the generator/i,
      body: (b) => {
        const rows = tableRows(b).filter((r) => r.length === 5 && !/^constant$/i.test(r[0]));
        if (rows.length < 30) return true;
        return rows.some((r) => !/^(0|\d\.\d{3}e[-+]\d+)$/.test(r[3]));
      },
      why: 'the pin table claims every constant is measured and compared against a third copy, over a '
        + 'block with fewer than thirty rows or a row whose relative difference is not a number',
    },
    {
      // The ORONI table has to SHOW the inclusive threshold: the 80 row
      // integrated by the action level and the 79.9 row integrated by nobody.
      id: 'h2-threshold-inclusive-is-shown',
      heading: /THE THRESHOLD IS INCLUSIVE/,
      body: (b) => {
        const rows = tableRows(b).filter((r) => r.length === 5 && /^\d+\.\d{6}$/.test(r[0]));
        const at80 = rows.find((r) => r[0] === '80.000000');
        const at799 = rows.find((r) => r[0] === '79.900000');
        if (!at80 || !at799) return true;
        return at80[3] === 'not integrated' || at799.slice(2).some((c) => c !== 'not integrated');
      },
      why: 'a heading says the threshold is inclusive over a table that does not show a period at 80 '
        + 'integrated by the action level and a period at 79.9 integrated by no criterion',
    },
    {
      // Section 17 says no figure in it is graded and every figure is the
      // equation. The block must carry the transcription status in its first
      // paragraph so a writer who quotes a row quotes it with its status.
      id: 'h2-heat-equations-carry-their-status',
      heading: /^# SECTION 17:/,
      body: (b) => !/CHECKED FOR TRANSCRIPTION ONLY/.test(b) || !/no figure below is graded/.test(b),
      why: 'the heat-equation section no longer states in its own block that the equations are checked '
        + 'for transcription only and that no figure in it is graded',
    },
    {
      // The heat decision must name both reasons: transcription only, and the
      // worked example that disagrees.
      id: 'h2-heat-decision-names-both-reasons',
      heading: /^THE HEAT DECISION\b/,
      body: (b) => !/transcription only/.test(b) || !/worked example disagrees/.test(b),
      why: 'the heat decision no longer names both of its reasons',
    },
    {
      // The long-shift block claims the noise dose is not rescaled, and prints
      // the rescaled figure beside the true one. It must print both.
      id: 'h2-dose-not-rescaled-prints-both',
      heading: /THE DOSE IS NOT RESCALED TO EIGHT HOURS/,
      body: (b) => !/would give \d+\.\d{6} percent \(derived\)/.test(b),
      why: 'a heading says the noise dose is not rescaled over a block that no longer prints the rescaled '
        + 'figure it is warning against',
    },
  ],
};
