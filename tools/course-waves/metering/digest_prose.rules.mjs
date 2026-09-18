// FC8 Metering, Control Valves & Storage: the wave's own cleared phrases and
// engine pins for /root/dc-wavekit/digestprose.mjs.
//
//   node /root/dc-wavekit/digestprose.mjs /root/fc-wip-metering/digest.txt \
//        --rules /root/fc-wip-metering
//
// THIS WAVE'S HISTORY POSITION. Framed history is curriculum and unframed
// history is a defect, and THIS DIGEST HAS NO HISTORY SECTION AT ALL. That is
// deliberate. FC8 has two WITHHOLDINGS rather than a repair to narrate, and a
// withholding is CURRENT, PERMANENT AND DECLARED behaviour: the engines return
// `withheld: true` and `ventWithheld: true` today and will keep doing so. So
// the digest teaches them in the present tense, in SECTIONS 16, 28 and 31, and
// the only sentences in the whole file that describe behaviour an engine no
// longer has are INSIDE VERBATIM ENGINE MESSAGES, where the engine itself
// explains why it is refusing. Those are cleared below by exact phrase, and the
// first draft of this digest carried five more in its own prose which were
// recast into the present tense rather than cleared.
//
// THIS FILE REFUSES RATHER THAN PASSING. Everything it declares about the
// digest is checked against digest.txt when the module loads, and a claim it
// cannot check makes it print REFUSED and exit 2.
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const WAVE = process.env.FC8_WAVE || '/root/fc-wip-metering';
const DIGEST = path.join(WAVE, 'digest.txt');
export const enginesRoot = process.env.FC8_ENGINES || '/root/wt-fc8-nextgen/packages/engines';

const refuse = (msg) => {
  console.log(`REFUSED by digest_prose.rules.mjs (FC8): ${msg}`);
  console.log('   A rules file that cannot check its own declarations is a rules file that '
    + 'reports a clean sweep for a check that never ran.');
  process.exit(2);
};

let TEXT = '';
try {
  TEXT = fs.readFileSync(DIGEST, 'utf8');
} catch (e) {
  refuse(`${DIGEST} could not be read (${e.code}), so every declaration below is unchecked`);
}
const LINES = TEXT.replace(/\n$/, '').split('\n');

/* ------------------------------------------------- NO HISTORY SECTION, SAID */

const sectionTitles = LINES.filter((l) => /^# SECTION \d+:/.test(l));
if (sectionTitles.length < 10) refuse(`${DIGEST} carries ${sectionTitles.length} section titles, which cannot be a whole digest`);
const historyTitled = sectionTitles.filter((t) => /USED TO|NO LONGER|REPAIR HISTORY|WAS WRONG/i.test(t));
if (historyTitled.length) {
  refuse('a section of this digest is titled on repair history, and this wave declares that it has '
    + `no history section at all: ${historyTitled.join(' | ')}`);
}

/* --------------------------------------- THE WITHHOLDINGS ARE CURRENT, SAID */

// The wave's whole position rests on the two withholdings being CURRENT
// behaviour rather than something the engines are recovering from. Both are
// declared here by the line the digest prints, and a digest that stopped saying
// so refuses here rather than passing.
const CURRENT_CLAIMS = [
  'straightRunDiameters returns withheld true for two elbows in different planes',
  'fireVenting returns ventWithheld true and a null vent capacity at every wetted area',
];
CURRENT_CLAIMS.forEach((c) => {
  if (!TEXT.includes(c)) {
    refuse(`the digest no longer states, in the present tense, that "${c}". Without that line the `
      + 'withholdings read as something the engines might get back.');
  }
});

/* ------------------------------------------------------ CLEARED PHRASES */

// A CLEARED PHRASE THAT MATCHES NOTHING IS A ROW CLAIMING WORK IT NEVER DID.
// Each entry is checked against the digest when this module loads, and a dead
// one refuses.
export const CLEARED = [
  // SECTION 16. The engine's own withholding message for the two-elbows column
  // explains WHY it refuses, which requires saying what the figures there did.
  // The sentence is the engine's, quoted verbatim, and it is the reason the
  // refusal is credible rather than arbitrary.
  /column that used to be here fell by \d+ diameters/i,
  // SECTION 24. travelCheck's refusal on an unrecognised characteristic. The
  // message names the old silent behaviour because that is what tells the
  // reader why the refusal exists at all.
  /unrecognised characteristic used to be treated silently as equal percentage/i,
  // SECTION 28. The fire vent withholding. The engine explains the shape of the
  // relation it will not use, which is the whole substance of the refusal.
  /relation that used to be here divided by the square root of an absolute temperature/i,
];
CLEARED.forEach((re) => {
  if (!re.test(TEXT)) {
    refuse(`the cleared phrase ${re} matches nothing in the digest. A cleared phrase that clears `
      + 'nothing is a dead row.');
  }
});

/* -------------------------------------------------------- ENGINE PINS */

// Four engine messages the digest quotes carry an "X, not Y" contrastive. The
// digest quotes them VERBATIM, because a digest that paraphrases a message
// teaches a sentence the learner will never see on the screen. They are DEFERRED
// rather than failed, and each is PINNED to the module it came from, so an
// upstream engine edit turns this gate red rather than leaving a stale quote in
// place. EACH IS ALSO A FINDING AGAINST THE ENGINE: the message breaches the
// owner copy rule and should be recast upstream, in the engines repository,
// where the digest quote will follow it.
export const pinned = [
  { frag: 'these are table values, not a calculation', src: 'engines/facilities/metering.js' },
  { frag: 'stated screen, not a value read from a', src: 'engines/facilities/controlValve.js' },
  { frag: 'whether to ask the question, not to', src: 'engines/facilities/controlValve.js' },
  { frag: 'the water test governs this course, not the product', src: 'engines/facilities/storageTank.js' },
];
pinned.forEach((p) => {
  if (!TEXT.includes(p.frag)) {
    refuse(`the pinned engine fragment "${p.frag}" is not quoted anywhere in the digest, so pinning `
      + 'it defers a line that does not exist');
  }
  let src = '';
  try { src = fs.readFileSync(path.join(enginesRoot, p.src), 'utf8'); } catch { src = ''; }
  if (!src.includes(p.frag)) {
    refuse(`the pinned fragment "${p.frag}" is not in ${p.src} under ${enginesRoot}, so the digest `
      + 'is quoting a message the engine no longer carries');
  }
});

/* ------------------------------------------------------- HEADING RULES */

// This wave narrows nothing in the kit's general heading rules, because it has
// no history section for them to fire on. The list is exported empty on purpose
// rather than omitted, so a later reader can see the decision was made.
export const headings = [];

export default { headings, cleared: CLEARED, pinned, enginesRoot };
