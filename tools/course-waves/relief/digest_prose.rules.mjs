// FC5 Relief & Flare Systems: the wave's own claims, cleared phrases and
// engine pins for /root/dc-wavekit/digestprose.mjs.
//
//   node /root/dc-wavekit/digestprose.mjs /root/fc-wip-relief/digest.txt \
//        --rules /root/fc-wip-relief
//
// THIS WAVE'S HISTORY POSITION. Framed history is curriculum and unframed
// history is a defect. SECTION 29 of this digest is the one section whose
// SUBJECT is what the engine used to do (FC4's was Section 20), it says so in
// its own title and in its first line, it is the LAST section and nothing
// follows it. So the kit reports its sentences as framed and warns for a human
// read rather than failing. Nothing above Section 29 is history, and that is
// measured rather than asserted: at the time this file was written the kit
// found zero history-keyword matches in lines 1 to 992.
//
// The warnings that section raises are expected and are re-read by hand on
// every rebuild rather than cleared, because clearing them would make the one
// place in this digest that carries history the one place nobody checks.
//
// THIS FILE REFUSES RATHER THAN PASSING. Everything it declares about the
// digest is checked against digest.txt when the module loads, and a claim it
// cannot check makes it print REFUSED and exit 2. A rules file that silently
// describes a digest it no longer matches is the failure mode it exists to
// prevent.
//
// Copy rule: no em dashes and no "X, not Y" contrastives in anything a learner
// reads. The messages below obey it too, and where a `why` quotes an engine
// string that breaks it, the quote is the engine's own wording and is pinned.
import fs from 'node:fs';
import path from 'node:path';
import { GENERAL_HEADING_RULES } from '/root/dc-wavekit/digestprose.mjs';

// THE WAVE DIRECTORY. /root/fc-wip-relief by default, overridable with FC5_WAVE
// so this file can be checked against a read-only copy of the wave without
// either directory being touched. The path it read is printed by the kit run
// that loads it, and a digest it cannot read is a REFUSAL below.
const WAVE = process.env.FC5_WAVE || '/root/fc-wip-relief';
const DIGEST = path.join(WAVE, 'digest.txt');

const refuse = (msg) => {
  console.log(`REFUSED by digest_prose.rules.mjs (FC5): ${msg}`);
  console.log('   A rules file that cannot check its own declarations is a rules file that '
    + 'reports a clean sweep for a check that never ran.');
  process.exit(2);
};

let DIGEST_LINES = [];
try {
  DIGEST_LINES = fs.readFileSync(DIGEST, 'utf8').replace(/\n$/, '').split('\n');
} catch (e) {
  refuse(`${DIGEST} could not be read (${e.code}), so the SECTION 29 declaration below is unchecked`);
}

// --------------------------------------------------------------- SECTION 29
//
// THE ONE HISTORY SECTION, DECLARED AND CHECKED. These two lines are the
// frame: the section title and the paragraph under it. Both are verified
// verbatim, the section number is verified to be 29, and it is verified to be
// the LAST section in the file, because "nothing follows it" is a claim the
// digest makes in its own title.
export const HISTORY_SECTION = 29;

const HISTORY_TITLE = '# SECTION 29: WHAT THIS ENGINE USED TO DO. THIS SECTION IS REPAIR HISTORY, '
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

// THE ONE PLACE THIS FILE NARROWS A KIT RULE, AND WHY.
//
// The kit's general `repair-history` heading rule fails any heading carrying
// USED TO or NO LONGER, with no exemption for a section that declares itself
// as history. FC4 escaped it by wording: its Section 20 title reads "What this
// engine was repaired for". FC5's title says WHAT THIS ENGINE USED TO DO,
// which is the clearer frame for a reader and the exact phrase the rule hunts,
// so the rule fires on the frame itself and on the paragraph beneath it.
//
// The narrowing is by EXACT LINE. Only the two heading strings verified above
// are exempt. Any other heading in this digest carrying USED TO, NO LONGER,
// WAS WRONG or NOW FIXED still fails, and the negative control in
// `scratch/` plants that wording in a heading outside Section 29 and shows it
// still fails. The right long-term home for this is a kit that reads a wave's
// declared history section, and this file is scoped to one run of one wave
// until that exists.
const general = GENERAL_HEADING_RULES.find((r) => r.id === 'repair-history');
if (!general) {
  refuse('the kit no longer carries a general heading rule with the id "repair-history", so the '
    + 'narrowing below is stale. Re-read the kit rule and this block together');
}
if (!general.heading.test(HISTORY_TITLE)) {
  refuse('the kit\'s general repair-history rule no longer fires on the declared SECTION 29 '
    + 'title, so the narrowing below is dead code claiming to do work');
}
const generalBody = general.body;
general.body = (body, head) => {
  if (HISTORY_HEADINGS.includes(head)) return false;
  return generalBody(body, head);
};

// A CLEARED PHRASE THAT MATCHES NOTHING IS A ROW CLAIMING WORK IT NEVER DID.
// Each entry below is checked against the digest when this module loads, and a
// dead one refuses. FC4's doctrine on this is the reason: a rule that reports a
// clean sweep over nothing is worse than no rule.
export const CLEARED = [
  // Digest line 793. A live property of the two exported tables as they ship
  // today, not a claim about a past engine. The jest suite asserts it.
  /They now carry IDENTICAL wording/i,
];
for (const re of CLEARED) {
  if (!DIGEST_LINES.some((l) => re.test(l))) {
    refuse(`the cleared phrase ${re} matches no line of the digest, so it clears nothing and `
      + 'reports work it never did');
  }
}

// ----------------------------------------------------------- table helpers
const tableRows = (body) => body
  .split('\n')
  .filter((l) => /^\s*\|/.test(l) && !/^\s*\|\s*---/.test(l))
  .map((l) => l.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map((c) => c.trim()));

const distinct = (xs) => new Set(xs).size;

export default {
  enginesRoot: process.env.FC5_ENGINES || '/root/wt-fc5-nextgen/packages/engines',

  // Heading claims this digest makes that a block could contradict. Each is
  // written from a REAL title in this digest and from the specific way that
  // title goes stale, rather than from a generic shape.
  //
  // WHAT IS DELIBERATELY NOT HERE. A false COUNT and a backwards DIRECTION
  // both live on ordinary prose lines introducing a block, and the kit
  // surfaces section titles, hash headings and capitalised markers, so a rule
  // here would be a dead row reporting a clean sweep. Those two classes are
  // checked by discriminate.mjs and gate_movement.mjs, which read the digest
  // and the engine as data.
  headings: [
    {
      // Section 29's own title claims nothing follows it, and the whole
      // history position of this wave rests on that. If a rebuild appends a
      // section, the frame stops being the last thing in the file and
      // everything after it reads as current behaviour.
      id: 'fc5-nothing-follows',
      heading: /NOTHING FOLLOWS TH(?:IS|E) SECTION|nothing follows it/i,
      body: (b) => /^# SECTION \d+:/m.test(b),
      why: 'a heading says nothing follows this section over a block that still carries a later '
        + 'SECTION title. Section 29 is the one framed home for repair history in this digest and '
        + 'it is only a frame while it is last',
    },
    {
      // Digest line 701. The heading asserts the final temperature is fixed by
      // the pressure ratio and the exponent, and it names the sweep above it
      // as the evidence. The sweep prints its own distinct count, so the claim
      // and its evidence can be read against each other.
      id: 'fc5-cold-end-one-temperature',
      heading: /final temperature does not depend on the orifice/i,
      body: (b) => {
        const m = /Distinct final temperatures across the orifice sweep, counted: (\d+)/.exec(b);
        return !m || Number(m[1]) !== 1;
      },
      why: 'a heading says the final blowdown temperature does not depend on the orifice, over a '
        + 'block whose own counted evidence is absent or reports more than one distinct '
        + 'temperature. The claim is only teachable while the sweep it names still shows it',
    },
    {
      // Digest line 793. Two engines export the same published table and the
      // digest teaches that one learner cannot meet two sets of words for it.
      // The block prints both label columns and an equal column, so the
      // heading is checkable row by row.
      id: 'fc5-two-tables-same-numbers',
      heading: /TWO TABLES WITH THE SAME NUMBERS/i,
      body: (b) => {
        const rows = tableRows(b).filter((r) => r.length >= 4 && /^\d/.test(r[0]));
        if (rows.length < 4) return true;
        return rows.some((r) => r[1] !== r[2] || !/^yes$/i.test(r[3]));
      },
      why: 'a heading says two engines export the same published table over a block whose two '
        + 'label columns disagree, whose equal column is not yes on every row, or which no longer '
        + 'prints all four rows. The relief engine and the spacing engine wording is pinned below '
        + 'in both modules',
    },
    {
      // Digest line 323. The API 526 ladder ends at T, and the refusal past it
      // is the one place the digest teaches that a required area can exceed
      // every standard orifice.
      id: 'fc5-refuses-past-largest',
      heading: /Past the largest orifice the engine refuses/i,
      body: (b) => !b.includes('exceeds a T orifice (26 in2): use multiple valves')
        || tableRows(b).length < 3,
      why: 'a heading says the engine refuses past the largest orifice over a block that no longer '
        + 'carries the engine refusal text or that has lost its rows. The same string is pinned to '
        + 'the engine below, so a reworded refusal turns this gate red twice',
    },
    {
      // Digest line 790. The setback is owned by a live sibling course and is
      // handed back by name. A graded setback field name appearing in this
      // block would be both a broken frame and a capstone leak.
      id: 'fc5-setback-not-taught',
      heading: /THE SETBACK IS NOT TAUGHT HERE/i,
      body: (b) => /setback_distance_m|\bgbaran\b/i.test(b),
      why: 'a heading hands the setback question to the sibling course over a block that names a '
        + 'graded setback field or the capstone plant that carries it. The frame and the capstone '
        + 'leak gate would both be broken by the same line',
    },
    {
      // Digest line 156. The subcritical branch uses F2 and Kb has no place in
      // it, which is the whole teaching point of the block. The rows are the
      // evidence, so the heading is checked against them.
      id: 'fc5-kb-ignored-subcritical',
      heading: /Kb IS IGNORED IN SUBCRITICAL FLOW/i,
      body: (b) => {
        const rows = tableRows(b).filter((r) => /^subcritical$/i.test(r[0] || ''));
        if (rows.length < 2) return true;
        return distinct(rows.map((r) => r[3])) !== 1;
      },
      why: 'a heading says Kb is ignored in subcritical flow over a block whose subcritical rows '
        + 'print different required areas, or which has fewer than two of them to compare',
    },
    {
      // Digest line 906. The block carries two bullets and the first is the
      // one that must print identical figures: three Kb values giving one
      // area to twelve decimals. The second bullet is the contrast and moves
      // on purpose, so the rule reads the first bullet alone.
      id: 'fc5-changes-nothing',
      // The regex names the COUNT deliberately. The block at digest line 910
      // is a heading about the DEFECT CLASS and carries no figures of its own,
      // so a looser regex fired there and asked a methodological paragraph for
      // evidence it never claimed to hold.
      heading: /TWO INPUTS THAT CHANGE NOTHING/i,
      body: (b) => {
        const bullet = b.split('\n').find((l) => /Kb IN THE SUBCRITICAL BRANCH/i.test(l));
        if (!bullet) return true;
        const figs = [...bullet.matchAll(/(\d+\.\d{9,})/g)].map((m) => m[1]);
        return figs.length < 3 || distinct(figs) !== 1;
      },
      why: 'a heading says an input changes nothing over a block whose own figures for that input '
        + 'are not identical, or which has stopped printing them to enough decimals to tell. An '
        + 'input that never moves an answer is only teachable while the evidence holds',
    },
    {
      // A TRIPWIRE FOR A SECTION THIS WAVE DOES NOT YET HAVE. FC5 withholds
      // nothing today: every section prints. It is kept because a withheld
      // section is how this programme stages an engine repair, and the words
      // must go when the content arrives. FC4 carried it for exactly one wave
      // with real content behind it.
      id: 'fc5-withheld',
      heading: /WITHHELD/i,
      body: (b) => b.trim().length > 0 && !/prints NOTHING|prints none/i.test(b),
      why: 'a heading says WITHHELD over a block that prints content. The words must go when the '
        + 'content arrives',
    },
  ],

  // Phrases that match the keyword family and are NOT history. Each was read
  // by hand and is verified below to still match this digest, because a
  // cleared phrase that matches nothing is a row claiming work it never did.
  //
  // FC4 carried two. FC5's digest carries ONE, measured: the kit finds no
  // history-keyword match above Section 29, so this list exists for the
  // near-miss phrasing a future keyword family would reach.
  cleared: CLEARED,

  // Every engine message family this digest quotes verbatim, pinned to the
  // module it comes from. An upstream engine edit turns the gate RED instead
  // of letting a stale quote pass as current behaviour. Composed messages are
  // pinned by their TEMPLATE and by the call that names them, because the
  // joined sentence exists only at run time.
  //
  // The RADIATION_LEVELS labels are pinned in BOTH modules that export them,
  // because the digest teaches that the two tables carry identical wording. A
  // reword in either one turns this gate red, which is the point.
  pinned: [
    // refusals, one per route
    { frag: 'required area must be a finite positive number', src: 'engines/facilities/relief.js' },
    { frag: 'in2 exceeds a T orifice (26 in2): use multiple valves', src: 'engines/facilities/relief.js' },
    { frag: 'multipleOfT: Math.ceil(requiredAreaIn2 / 26)', src: 'engines/facilities/relief.js' },
    { frag: 'gas sizing needs positive flow, pressure, temperature, MW, z and k above 1', src: 'engines/facilities/relief.js' },
    { frag: 'back pressure must be a finite pressure, zero or more', src: 'engines/facilities/relief.js' },
    { frag: 'back pressure meets or exceeds relieving pressure: the valve cannot flow', src: 'engines/facilities/relief.js' },
    { frag: 'must be a number above 0 and no more than 1: a certified coefficient cannot add capacity', src: 'engines/facilities/relief.js' },
    { frag: "coefficientError([['Kd', kd], ['Kb', kb], ['Kc', kc]])", src: 'engines/facilities/relief.js' },
    { frag: "coefficientError([['Kd', kd], ['Kb', kb], ['Kc', kc], ['KSH', ksh]])", src: 'engines/facilities/relief.js' },
    { frag: "coefficientError([['environment factor F', envFactor]])", src: 'engines/facilities/relief.js' },
    { frag: "coefficientError([['the discharge coefficient', cd]])", src: 'engines/facilities/relief.js' },
    { frag: "['the radiated fraction', fractionRadiated], ['transmissivity', transmissivity]", src: 'engines/facilities/relief.js' },
    { frag: 'liquid sizing needs a positive rate and specific gravity', src: 'engines/facilities/relief.js' },
    { frag: 'viscosity must be a finite number, zero or more', src: 'engines/facilities/relief.js' },
    { frag: 'liquid sizing needs finite set and back pressures', src: 'engines/facilities/relief.js' },
    { frag: 'no differential across the valve: back pressure meets set pressure', src: 'engines/facilities/relief.js' },
    { frag: 'steam sizing needs a positive flow and pressure', src: 'engines/facilities/relief.js' },
    { frag: 'Napier correction is only published to 3200 psia', src: 'engines/facilities/relief.js' },
    { frag: 'vessel geometry must be positive', src: 'engines/facilities/relief.js' },
    { frag: 'liquid level must be a finite number, zero or more', src: 'engines/facilities/relief.js' },
    { frag: "orientation must be 'horizontal' or 'vertical'", src: 'engines/facilities/relief.js' },
    { frag: 'fire case needs a positive wetted area', src: 'engines/facilities/relief.js' },
    { frag: 'adequate drainage must be true or false, not a string', src: 'engines/facilities/relief.js' },
    { frag: 'relief load needs a positive duty and latent heat', src: 'engines/facilities/relief.js' },
    { frag: 'settling needs a positive droplet size, vapor viscosity, and a liquid denser than the vapor', src: 'engines/facilities/relief.js' },
    { frag: 'drum sizing needs positive vapor rate, dropout velocity and diameter', src: 'engines/facilities/relief.js' },
    { frag: 'liquid level fraction must be a number from 0 up to but not including 1', src: 'engines/facilities/relief.js' },
    { frag: 'radiation needs a positive heat release and distance', src: 'engines/facilities/relief.js' },
    { frag: 'distance solve needs a positive duty and allowable', src: 'engines/facilities/relief.js' },
    { frag: 'blowdown needs positive geometry, a start above the end pressure, and gas properties', src: 'engines/facilities/relief.js' },
    { frag: 'the time step must be a finite number above zero', src: 'engines/facilities/relief.js' },
    { frag: 'the time limit must be a finite number above zero', src: 'engines/facilities/relief.js' },
    { frag: 'did not reach the end pressure inside the time limit: check the orifice size', src: 'engines/facilities/relief.js' },
    { frag: 'blowdown march did not finish inside its step budget: raise the time step', src: 'engines/facilities/relief.js' },

    // warnings, which are successful calls that attach text
    { frag: 'subcritical flow uses F2, not Kb; the typed Kb was ignored', src: 'engines/facilities/relief.js' },
    { frag: 'back pressure exceeds 30 percent of relieving pressure: a balanced-bellows valve needs its chart Kb (API 520 Fig. 30), typed here', src: 'engines/facilities/relief.js' },
    { frag: 'viscosity correction below 0.5: this service is far off the certified test envelope; consider a different device', src: 'engines/facilities/relief.js' },
    { frag: 'the viscosity correction did not converge in 40 passes: treat the area as indicative', src: 'engines/facilities/relief.js' },
    { frag: 'latent heat below 50 Btu/lb: near-critical fluid, the latent-heat method is breaking down (API 521 c.4.4)', src: 'engines/facilities/relief.js' },
    { frag: 'the drag iteration did not converge in 200 passes: treat the velocity as indicative', src: 'engines/facilities/relief.js' },

    // the two COMPOSED warnings, pinned by template and by the call that
    // names them, because the joined sentence exists only at run time
    { frag: 'the Napier correction is below 1.0 between 1500 and ${NAPIER_UNITY_PSIA.toFixed(1)} psia', src: 'engines/facilities/relief.js' },
    { frag: 'it steps at 1500 psia and returns through 1.0 at ${NAPIER_UNITY_PSIA.toFixed(1)} psia', src: 'engines/facilities/relief.js' },
    { frag: 'p1Psia > 1500 && p1Psia < NAPIER_UNITY_PSIA', src: 'engines/facilities/relief.js' },
    { frag: 'the march assumes choked flow throughout, and it stops being choked below ${chokedToPsia.toFixed(1)} psia', src: 'engines/facilities/relief.js' },
    { frag: 'psia back pressure: the time below that is optimistic', src: 'engines/facilities/relief.js' },
    { frag: 'chokedToPsia !== null && pEndPsia < chokedToPsia', src: 'engines/facilities/relief.js' },

    // notes, which the digest teaches as decisions left to the caller
    { frag: 'wetted area counts only to 25 ft above grade (API 521); truncate the level before calling', src: 'engines/facilities/relief.js' },
    { frag: 'L/D above 6: go to a larger diameter', src: 'engines/facilities/relief.js' },
    { frag: 'L/D below 2: a smaller drum may do', src: 'engines/facilities/relief.js' },

    // the published allowable intensities, pinned in BOTH exporting modules
    { frag: 'Continuous exposure, no time limit (site boundary, control room)', src: 'engines/facilities/relief.js' },
    { frag: 'Emergency action of several minutes, with clothing', src: 'engines/facilities/relief.js' },
    { frag: 'Emergency action up to about a minute', src: 'engines/facilities/relief.js' },
    { frag: 'Seconds only: escape route', src: 'engines/facilities/relief.js' },
    { frag: 'Continuous exposure, no time limit (site boundary, control room)', src: 'engines/facilities/spacing.js' },
    { frag: 'Emergency action of several minutes, with clothing', src: 'engines/facilities/spacing.js' },
    { frag: 'Emergency action up to about a minute', src: 'engines/facilities/spacing.js' },
    { frag: 'Seconds only: escape route', src: 'engines/facilities/spacing.js' },

    // the constants this digest MEASURES rather than types. A digest row says
    // where each one came from, so the expression it was measured out of is
    // part of the quote.
    { frag: '520 * Math.sqrt(k * (2 / (k + 1)) ** ((k + 1) / (k - 1)))', src: 'engines/facilities/relief.js' },
    { frag: '735 * f2 * kd * kc', src: 'engines/facilities/relief.js' },
    { frag: '38 * kd * kw * kc * kv * Math.sqrt(dp)', src: 'engines/facilities/relief.js' },
    { frag: '51.5 * p1Psia * kd * kb * kc * kn * ksh', src: 'engines/facilities/relief.js' },
    { frag: '(0.1906 * p1Psia - 1000) / (0.2292 * p1Psia - 1061)', src: 'engines/facilities/relief.js' },
    { frag: 'NAPIER_UNITY_PSIA = (1061 - 1000) / (0.2292 - 0.1906)', src: 'engines/facilities/relief.js' },
    { frag: 'adequateDrainage ? 21000 : 34500', src: 'engines/facilities/relief.js' },
    { frag: 'wettedFt2 ** 0.82', src: 'engines/facilities/relief.js' },
    { frag: '(qGpm * 2800 * sg) / (muCp * Math.sqrt(areaIn2))', src: 'engines/facilities/relief.js' },
    { frag: '1545.349 / mw', src: 'engines/facilities/relief.js' },
    { frag: 're < 0.1 ? 240 : 24 / re + 3 / Math.sqrt(re) + 0.34', src: 'engines/facilities/relief.js' },
    { frag: 'dropletMicron * 3.2808398950131233e-6', src: 'engines/facilities/relief.js' },
    { frag: '6.7196897514e-4', src: 'engines/facilities/relief.js' },
    { frag: 'cap = 0.05 * mass', src: 'engines/facilities/relief.js' },
  ],
};
