// FC9 Corrosion & Integrity: the wave's own claims, cleared phrases and engine
// pins for /root/dc-wavekit/digestprose.mjs.
//
//   node /root/dc-wavekit/digestprose.mjs /root/fc-wip-corrosion/digest.txt \
//        --rules /root/fc-wip-corrosion
//
// THIS WAVE'S HISTORY POSITION. Framed history is curriculum and unframed
// history is a defect. SECTION 25 of this digest is the one section whose
// SUBJECT is what the engine used to do, it says so in its own title and in its
// first line, it is the LAST section and nothing follows it.
//
// AND THIS WAVE HAS A SECOND THING THAT LOOKS LIKE HISTORY AND IS NOT. SECTION
// 2 is the WITHDRAWAL: a function this engine once had and no longer has. That
// is not repair history, because THE ABSENCE IS CURRENT, PERMANENT AND
// DECLARED: the engine returns regionProvided false and materialGuidanceProvided
// false today, and will keep doing so. So section 2's own second line says in
// as many words that it is about behaviour the engine SHIPS, which is a refusal
// to answer, and this file declares and checks that line. A digest that let
// section 2 read as history would teach a learner that the region is coming
// back.
//
// THIS FILE REFUSES RATHER THAN PASSING. Everything it declares about the
// digest is checked against digest.txt when the module loads, and a claim it
// cannot check makes it print REFUSED and exit 2.
//
// Copy rule: no em dashes and no "X, not Y" contrastives in anything a learner
// reads. The messages below obey it too.
import fs from 'node:fs';
import path from 'node:path';
import { GENERAL_HEADING_RULES } from '/root/dc-wavekit/digestprose.mjs';

const WAVE = process.env.FC9_WAVE || '/root/fc-wip-corrosion';
const DIGEST = path.join(WAVE, 'digest.txt');

const refuse = (msg) => {
  console.log(`REFUSED by digest_prose.rules.mjs (FC9): ${msg}`);
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

/* ---------------------------------------------------------- SECTION 25 */

export const HISTORY_SECTION = 25;

const HISTORY_TITLE = '# SECTION 25: WHAT THIS ENGINE USED TO DO. THIS SECTION IS REPAIR HISTORY, '
  + 'and nothing follows it (owned by Expert m06)';
const HISTORY_FRAME = '# THIS SECTION, AND ONLY THIS SECTION, DESCRIBES BEHAVIOUR THIS ENGINE NO '
  + 'LONGER HAS.';

const sectionLines = DIGEST_LINES
  .map((l, i) => ({ n: i + 1, l }))
  .filter((r) => /^# SECTION \d+:/.test(r.l));
if (sectionLines.length === 0) refuse(`${DIGEST} carries no section titles at all`);

const last = sectionLines[sectionLines.length - 1];
const lastNumber = Number(/^# SECTION (\d+):/.exec(last.l)[1]);
if (lastNumber !== HISTORY_SECTION) {
  refuse(`the LAST section of the digest is SECTION ${lastNumber} and this file declares SECTION `
    + `${HISTORY_SECTION} as the one history section. One of the two moved`);
}
if (last.l !== HISTORY_TITLE) {
  refuse(`the SECTION ${HISTORY_SECTION} title is not the one this file declares.\n   digest: `
    + `${last.l}\n   declared: ${HISTORY_TITLE}`);
}
const frameLine = DIGEST_LINES.findIndex((l) => l.startsWith(HISTORY_FRAME));
if (frameLine < 0 || frameLine + 1 <= last.n) {
  refuse(`the framing paragraph of SECTION ${HISTORY_SECTION} is missing or sits above its own `
    + 'section title, so the section no longer frames itself');
}
const HISTORY_HEADINGS = [last.l, DIGEST_LINES[frameLine]];

/* ------ SECTION 2, the withdrawal, DECLARED AS CURRENT AND NOT AS HISTORY */

const WITHDRAWAL_TITLE_RE = /^# SECTION 2: THE WITHDRAWAL\./;
const WITHDRAWAL_FRAME = 'This section is about behaviour the engine SHIPS TODAY, which is a '
  + 'refusal to answer. It is not repair history';
const wTitle = sectionLines.find((r) => WITHDRAWAL_TITLE_RE.test(r.l));
if (!wTitle) {
  refuse('SECTION 2 is not the withdrawal section any more. This wave\'s whole history position '
    + 'rests on the withdrawal being framed as a CURRENT absence and not as repair history, and '
    + 'that frame is checked by line below');
}
const wFrameIdx = DIGEST_LINES.findIndex((l) => l.startsWith(WITHDRAWAL_FRAME));
if (wFrameIdx < 0 || wFrameIdx + 1 <= wTitle.n) {
  refuse('the line declaring SECTION 2 as current behaviour and not repair history is missing or '
    + 'sits above its own section title. Without it the withdrawal reads as something the engine '
    + 'might get back');
}
// And the section must state the absence as two returned FIELDS rather than as a
// missing value, because that is the difference between a declared refusal and a
// gap. Both field names are asserted present inside section 2's own span.
const nextAfterW = sectionLines.find((r) => r.n > wTitle.n);
const wBody = DIGEST_LINES.slice(wTitle.n - 1, nextAfterW ? nextAfterW.n - 1 : DIGEST_LINES.length).join('\n');
['regionProvided', 'materialGuidanceProvided'].forEach((f) => {
  if (!wBody.includes(f)) {
    refuse(`SECTION 2 no longer names the returned field \`${f}\`. The withdrawal is only a `
      + 'declared absence while the engine returns a field saying so, and the section has to show it');
  }
});

/* --------- THE ONE PLACE THIS FILE NARROWS A KIT RULE, AND WHY ---------- */

// The kit's general `repair-history` heading rule fails any heading carrying
// USED TO or NO LONGER, with no exemption for a section that declares itself as
// history. This digest's section 25 title says WHAT THIS ENGINE USED TO DO,
// which is the clearest frame for a reader and the exact phrase the rule hunts.
// The narrowing is BY EXACT LINE: only the two heading strings verified above
// are exempt, and any other heading in this digest carrying that wording still
// fails. scratch/ carries the negative control that proves it.
const general = GENERAL_HEADING_RULES.find((r) => r.id === 'repair-history');
if (!general) {
  refuse('the kit no longer carries a general heading rule with the id "repair-history", so the '
    + 'narrowing below is stale. Re-read the kit rule and this block together');
}
if (!general.heading.test(HISTORY_TITLE)) {
  refuse('the kit\'s general repair-history rule no longer fires on the declared SECTION 25 '
    + 'title, so the narrowing below is dead code claiming to do work');
}
const generalBody = general.body;
general.body = (body, head) => {
  if (HISTORY_HEADINGS.includes(head)) return false;
  return generalBody(body, head);
};

/* ------------------------------------------------------ CLEARED PHRASES */

// A CLEARED PHRASE THAT MATCHES NOTHING IS A ROW CLAIMING WORK IT NEVER DID.
// Each entry is checked against the digest when this module loads, and a dead
// one refuses.
export const CLEARED = [
  // Section 2. "An earlier version of this file computed" is past tense about a
  // withdrawn function, inside the section whose declared subject is the
  // CURRENT absence of that function. It is the one sentence in section 2 that
  // has to be past tense, because the absence needs something to be an absence
  // of, and the frame checked above is what makes it safe.
  /An earlier version of this file computed a sour-service severity region/,
];
for (const re of CLEARED) {
  if (!DIGEST_LINES.some((l) => re.test(l))) {
    refuse(`the cleared phrase ${re} matches no line of the digest, so it clears nothing and `
      + 'reports work it never did');
  }
}

/* ---------------------------------------------------------- table helpers */

const tableRows = (body) => body
  .split('\n')
  .filter((l) => /^\s*\|/.test(l) && !/^\s*\|\s*---/.test(l))
  .map((l) => l.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map((c) => c.trim()));

export default {
  enginesRoot: process.env.FC9_ENGINES || '/root/wt-fc9-nextgen/packages/engines',

  // FIVE VERBATIM ENGINE STRINGS BREACH THE OWNER COPY RULE, and the digest
  // quotes all five because a digest that paraphrases an error message teaches a
  // message the learner will never see. Each is PINNED BY EXACT FRAGMENT to the
  // engine source, so a DEAD exemption fails this gate: if the engine's wording
  // changes, the pin breaks and the quote is re-read rather than silently kept.
  //
  // FINDING against the repaired engine, recorded here and in wave.json: all
  // five should be recast upstream. Every writer brief in this wave says to
  // quote the message inside a blockquote as the engine's own words and never to
  // write a contrastive of their own.
  pinned: [
    { frag: 'availability, not efficiency, is what limits it', src: 'engines/facilities/corrosion.js' },
    { frag: 'the arithmetic of the number typed in, not a prediction', src: 'engines/facilities/corrosion.js' },
    { frag: 'Read this number as a bracket, not a value.', src: 'engines/facilities/corrosion.js' },
    { frag: 'this is an inspection and fitness-for-service question, not a design one', src: 'engines/facilities/corrosion.js' },
    { frag: 'the model does not apply, not that the line is not corroding', src: 'engines/facilities/corrosion.js' },
  ],

  // Heading claims this digest makes that a block below could contradict. Each
  // is written from a REAL title or marker in this digest and from the specific
  // way that title goes stale.
  headings: [
    {
      // Section 25's own title claims nothing follows it, and this wave's whole
      // history position rests on it. If a rebuild appends a section, the frame
      // stops being the last thing in the file.
      id: 'fc9-nothing-follows',
      heading: /NOTHING FOLLOWS TH(?:IS|E) SECTION|nothing follows it/i,
      body: (b) => /^# SECTION \d+:/m.test(b),
      why: 'a heading says nothing follows this section over a block that still carries a later '
        + 'SECTION title. Section 25 is the one framed home for repair history in this digest and '
        + 'it is only a frame while it is last',
    },
    {
      // Section 3. The whole pin argument is that every held constant is
      // compared against a literal in a THIRD file, so every row of that table
      // must carry a relative difference and none of them may be empty or NaN.
      id: 'fc9-pins-carry-a-difference',
      heading: /MEASURED out of the engine rather than typed, and pinned against a third copy/i,
      body: (b) => {
        const rows = tableRows(b).filter((r) => r.length >= 4 && !/^constant$/i.test(r[0]));
        if (rows.length < 25) return true;
        return rows.some((r) => r[3] === '' || /nan|undefined|infinity/i.test(r[3]));
      },
      why: 'the pin table claims every held constant is measured out of the engine and compared '
        + 'against a literal in a third file, over a block with fewer than twenty five rows or a '
        + 'row whose relative difference is empty or not a number. A pin with no difference is not '
        + 'a comparison',
    },
    {
      // Section 13. The ratio being pressure free is the reason one graded field
      // can exist at all, and the block proves it with a difference column that
      // must be zero on every row.
      id: 'fc9-ratio-is-pressure-free',
      heading: /THE RATIO IS PRESSURE FREE/i,
      body: (b) => {
        // IDENTIFY THE RIGHT TABLE. The block runs on past this table into the
        // regime table below, which also has six columns and also opens with a
        // number, and whose last column is a boolean word. Matching on shape
        // alone read the wrong rows, which the gate caught on the first run. A
        // row of THIS table carries a twelve-decimal ratio in column four.
        const rows = tableRows(b).filter((r) => r.length === 6
          && /^\d+\.\d{6}$/.test(r[0]) && /^\d+\.\d{12}$/.test(r[3]));
        if (rows.length < 4) return true;
        return rows.some((r) => r[5] !== '0');
      },
      why: 'a heading says the H2S to CO2 ratio needs no pressure at all, over a block whose own '
        + 'difference column is not zero on every row or which no longer prints one. That claim is '
        + 'what makes the mole-fraction oracle route independent, so it has to be visible',
    },
    {
      // Section 6. The onset moving is what replaced a quoted round number, and
      // the block's own table has to show it moving.
      id: 'fc9-onset-moves',
      heading: /THE ONSET IS NOT A FIXED TEMPERATURE/i,
      body: (b) => {
        const m = /it moves by ([\d.]+) degrees Celsius/.exec(b);
        return !m || Number(m[1]) < 10;
      },
      why: 'a heading says the film onset is not a fixed temperature, over a block that does not '
        + 'print how far it moves or that reports less than ten degrees. The whole repair of this '
        + 'claim was replacing a quoted round number with a computed one that moves',
    },
    {
      // Section 21. Eighteen graded fields and the claim that none is a rate the
      // correlation produced. The block lists the four things that ARE graded,
      // so a fifth row, or a row naming a rate, is a contradiction.
      id: 'fc9-nothing-graded-is-a-correlation-rate',
      heading: /WHAT THAT MEANS FOR THE EIGHTEEN GRADED CAPSTONE FIELDS/i,
      body: (b) => {
        const rows = tableRows(b).filter((r) => r.length >= 2 && !/^what is graded$/i.test(r[0]));
        if (rows.length !== 4) return true;
        return rows.some((r) => /de Waard|correlation produced a rate|the corrosion rate itself/i.test(r[0]));
      },
      why: 'the block declaring what the eighteen graded fields are no longer lists exactly four '
        + 'kinds, or one of them names a rate the correlation produced. Grading a de Waard-Milliams '
        + 'rate is the one thing this course has decided it will not do',
    },
  ],
};
