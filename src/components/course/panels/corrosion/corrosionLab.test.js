// Every value the FC9 lab exposes to a panel, a lesson or the grader is pinned
// here against the teaching digest (tools/course-waves/corrosion/digest.txt),
// which is itself nothing but the Corrosion & Integrity engine's return values
// on the published golden and on the teaching streams ETELEBOU, KANBI, TUNU,
// OPUKUSHI, DIEBU and ANGIAMA, plus the live studio's own shipped defaults.
//
// THE DIGEST IS REBUILT BYTE FOR BYTE. buildDigest() below is fc9_dump.mjs's
// writer with every engine call replaced by a lab return value: the prose is
// the dump's, the formatting is the dump's (partial pressures, allowances,
// rates, lives, percentages and ratios to six decimals; Reynolds numbers to
// four; measured constants and ratios of them to twelve; counts whole), and
// every number comes out of corrosionLab.js. The rebuilt text is compared with
// digest.txt section by section and then whole.
//
// THE EIGHTEEN GRADED FIELDS of the three capstone lines are pinned separately
// and EXACTLY against tools/course-waves/corrosion/fields.json, READ FROM THE
// FILE. The lab holds no tolerance of its own: gradedTolerance.js is the one
// place a grading band is made, and this suite asserts the lab exports none.
//
// Then the gates:
//   THE MIRROR GATE    waveMirror.test.js owns the byte comparison between the
//                      wave directory and the committed copy. This suite reads
//                      the committed copy through waveInputs.mjs, which is what
//                      makes it runnable on a CI runner, and asserts of itself
//                      that it names no path under /root.
//   THE LEAK GATE      no teaching export may return a number within ten times
//                      a graded field's ABSOLUTE tolerance of a graded answer,
//                      in any of three unit shiftings, over every number the
//                      lab exports, refusing a tiny surface. A leak is planted,
//                      shown red naming the probe, and shown clean again.
//   THE CLOCK GATE     every reader returns identical output under two faked
//                      system dates, with a control proving the clock moved and
//                      a second proving there is no dated or seeded surface to
//                      fake. Comments are stripped before the grep, and the
//                      stripper carries its own control.
//   THE TZ GATE        the whole rebuild runs a second time in a CHILD PROCESS
//                      under TZ=America/Los_Angeles and must be byte-identical.
//   THE REFUSAL GATE   every refusal the panels display is the engine's own
//                      message, and no message is written as a literal in the
//                      lab or in a panel.
//   THE HELD GATE      the eleven HELD items, the eight NOT PROVIDED items and
//                      the one WITHDRAWAL carry the wording that marks them
//                      unverified, the three panels show it, and NO graded
//                      capstone field reads one. This is the gate this course
//                      exists for: it grades no corrosion rate at all.
//   THE VOCABULARY GATE  the three legislated collisions, over the lab, the
//                      three panels and the learning page: never bare
//                      "inhibitor", never bare "erosion", and every friction
//                      factor and Reynolds number labelled as this module's.
//   THE PROSE SWEEP    the lab's and the panels' own comments, swept for claims
//                      the code no longer makes, plus no engine import and no
//                      clock in any panel.
import {
  describe, it, expect, afterEach, vi,
} from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import * as LAB_NS from './corrosionLab.js';
import { waveInput, waveDir, readingMirror } from '../../../../../tools/course-waves/waveInputs.mjs';

const L = LAB_NS;

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');

// THE WAVE INPUTS. Read from the committed copy under tools/course-waves by
// DEFAULT, which is what lets this suite run on a CI runner at all; a wave
// author points it at a live wave directory mid-build with NEXTGEN_WAVE_DIR or
// NEXTGEN_WAVE_DIR_CORROSION. A missing input throws and names itself rather
// than skipping: see tools/course-waves/waveInputs.mjs. No path into anybody's
// scratch directory appears in this file, and the last test asserts that.
const WAVE_NAME = 'corrosion';
const DIGEST = waveInput(WAVE_NAME, 'digest.txt');
const FIELDS_JSON = waveInput(WAVE_NAME, 'fields.json');
const FIELDS_MJS = waveInput(WAVE_NAME, 'fc9_fields.mjs');
const CAPSTONE_MJS = waveInput(WAVE_NAME, 'fc9_capstone.mjs');
const DUMP_MJS = waveInput(WAVE_NAME, 'fc9_dump.mjs');
const ENGINE_SRC_PATH = path.join(ROOT, 'packages/engines/engines/facilities/corrosion.js');
const ENGINE_SRC = fs.readFileSync(ENGINE_SRC_PATH, 'utf8');

const readDigest = () => fs.readFileSync(DIGEST, 'utf8');
const LAB_SOURCE = () => fs.readFileSync(path.join(HERE, 'corrosionLab.js'), 'utf8');

/** A panel source, or a FAILURE NAMING IT. A guarded read with a bare return
 *  inside a forEach deletes the assertion after it and leaves the test green,
 *  so a renamed panel fails here rather than emptying the gates that read it. */
const panelSource = (file) => {
  const p = path.join(HERE, file);
  if (!fs.existsSync(p)) {
    throw new Error(`panel source missing: ${file} is named in PANEL_FILES and is not in ${HERE}. `
      + 'A renamed or deleted panel fails here rather than emptying the gates that read it.');
  }
  return fs.readFileSync(p, 'utf8');
};
const PANEL_FILES = ['ChemistryExplorer.jsx', 'RateExplorer.jsx', 'InhibitorIntegrityExplorer.jsx'];
const LEARNING_PAGE = path.resolve(HERE, '../../../../pages/apps/CorrosionLearningPage.jsx');

// ---------------------------------------------------------------------------
// The digest's formatting, verbatim from fc9_dump.mjs.
// ---------------------------------------------------------------------------

const n = (x, d) => (x === null || x === undefined || !Number.isFinite(Number(x)) ? String(x) : Number(x).toFixed(d));
const e6 = (x) => n(x, 6);   // partial pressures, allowances, rates, lives, percentages, ratios
const r4 = (x) => n(x, 4);   // Reynolds numbers
const e12 = (x) => n(x, 12); // measured constants and ratios of them
const S = (x) => String(x);
const expo = (x) => (x === 0 ? '0' : Number(x).toExponential(3));
/**
 * The ONE COLUMN that widens past the six decimals the digest header declares:
 * the golden category table's rate. Its smallest positive row is a billionth of
 * a millimetre a year, and at six decimals it printed 0.000000, which is the
 * same string as the zero row above it while carrying a different word. The row
 * was always right and the RENDERING was wrong. The printed form is the
 * shortest fixed-decimal rendering that reads back as the number it came from.
 */
const eWide = (x) => {
  for (let d = 6; d <= 20; d += 1) {
    const s = n(x, d);
    if (Number(s) === Number(x)) return s;
  }
  return String(x);
};

// ---------------------------------------------------------------------------
// THE DIGEST, REBUILT FROM LAB RETURN VALUES.
// ---------------------------------------------------------------------------

const buildSections = () => {
  const out = [];
  let cur = [];
  const w = (s = '') => cur.push(s);
  const start = () => { cur = []; out.push(cur); };

  const GOLD = L.GOLD;
  const counts = L.goldenCounts();
  const srcLines = ENGINE_SRC.split('\n').length;

  /* -------------------------------------------------------------- PREAMBLE */
  start();
  w('# FC9 TEACHING DIGEST: Corrosion & Integrity');
  w();
  w('# THIS FILE IS THE ONLY TEACHING TRUTH FOR THIS COURSE. Every number in every lesson, bank question, key truth and panel comes from a line below, and every brief in this wave quotes this file by name. The wave recon and findings reports, the engine source comments and the repair record vendored beside the oracle are PROVENANCE and not teaching truth: two figures in a sibling course brief came from a recon report and were wrong.');
  w();
  w('# PRECISION. Partial pressures in bar and in psia, wall thicknesses and allowances in mm, corrosion rates in mm/yr, lives in years, percentages, percentage points and every dimensionless ratio print to SIX decimals; Reynolds numbers print to FOUR, because a number in the hundreds of thousands carries no information in its millionths; measured constants and ratios of them print to TWELVE; counts are whole numbers.');
  w();
  w(`# ENGINE. engines/facilities/corrosion.js, vendored sha-identical with petrolord-engines 5cbdca5, ${srcLines} lines, importing nothing. The vendoring closure walked from the jest suite is SIX paths. The vendored golden test-data/facilities/goldens/corrosion_cases.json carries ${counts.rows} rows in ${counts.blocks} blocks.`);
  w();
  w(`# THE GOLDEN IS SYNTHETIC AND IT SAYS SO. golden provenance.published is ${S(GOLD.provenance.published)}. The golden's own words: "${GOLD.provenance.why}"`);
  w();
  w('# WHAT IS NEVER GRADED IN THIS COURSE. No corrosion rate the correlation produced, no rate category, no sour severity region, no material choice, no inspection interval and no retirement thickness. Section 21 lists every held item and section 3 pins every held constant. The eighteen graded capstone fields are the stream bookkeeping, the flow definition, the corrosion inhibitor arithmetic and the allowance arithmetic, and the capstone states any rate it needs from an inspection survey.');
  w();

  /* ------------------------------------------------------------- SECTION 1 */
  const s1 = L.engineScope();
  start();
  w('# SECTION 1: What this engine computes, and what it refuses to compute (owned by Associate m01 and Expert m01, because WHAT IS NOT HERE is that module\'s subject)');
  w();
  w('The engine is a CO2 corrosion rate screen with a remaining-life calculation on the end of it. It answers one question about one mechanism, and the list of what it does not answer is longer than the list of what it does.');
  w();
  w('| door | what it returns | what it needs |');
  w('| --- | --- | --- |');
  s1.doors.forEach(([d, r, i]) => w(`| \`${d}\` | ${r} | ${i} |`));
  w();
  w(`The engine states its own absences in two exported lists. \`NOT_PROVIDED\` carries ${s1.notProvidedCount} items and \`HELD_FOR_LITERATURE\` carries ${s1.heldCount}, and \`screen\` returns both, so a caller shows them rather than discovering them.`);
  w();
  w('NOT_PROVIDED, verbatim from the engine:');
  s1.notProvided.forEach((s) => w(`- ${s}`));
  w();
  w('THE ONE RATE THIS ENGINE RETURNS IS A GENERAL UNIFORM RATE. It is not a pitting rate. It is not a weld rate and it is not a top-of-line rate, and the engine says so in the list above. A learner who reads a uniform rate as a wall-loss prediction for the worst spot on the line has read it wrong, and the engine cannot warn them because it has no localised model to compare against.');
  w();

  /* ------------------------------------------------------------- SECTION 2 */
  const s2 = L.theWithdrawal();
  start();
  w('# SECTION 2: THE WITHDRAWAL. A curve carrying a standard\'s name told engineers what steel to buy, and it was invented here (owned by Associate m01 l02 and Expert m06 l01, and the headline lesson of this whole course)');
  w();
  w('This section is about behaviour the engine SHIPS TODAY, which is a refusal to answer. It is not repair history: the absence is current, declared and permanent, and section 25 is where the history lives.');
  w();
  w('An earlier version of this file computed a sour-service severity region from an expression of its own invention, labelled it with the names of two standards, and served three named material recommendations off it. The repair did not retune the expression. It WITHDREW the claim, because a curve that carries a standard\'s name and tells an engineer what steel to buy is not a tolerance question.');
  w();
  w('WHAT THE ENGINE NOW RETURNS IN ITS PLACE, measured at the shipped app defaults:');
  w();
  w('| field | value | what it means |');
  w('| --- | --- | --- |');
  w(`| \`ph2sBar\` | ${e6(s2.ph2sBar)} | the H2S partial pressure, the total pressure times the H2S mole fraction |`);
  w(`| \`ph2sPsia\` | ${e6(s2.ph2sPsia)} | the same, converted by the engine's bar to psia factor |`);
  w(`| \`thresholdBar\` | ${e6(s2.thresholdBar)} | the screening threshold, whose VALUE is held |`);
  w(`| \`thresholdPsia\` | ${e12(s2.thresholdPsia)} | the same threshold, derived rather than rounded |`);
  w(`| \`thresholdHeld\` | ${S(s2.thresholdHeld)} | the engine declares that the number is not sourced in the repository |`);
  w(`| \`sour\` | ${S(s2.sour)} | above the threshold or below it, and nothing more |`);
  w(`| \`decadesAboveThreshold\` | ${e6(s2.decadesAboveThreshold)} | how far above, in powers of ten |`);
  w(`| \`regionProvided\` | ${S(s2.regionProvided)} | THE ABSENCE IS A FIELD, so a caller cannot read it as a missing value |`);
  w(`| \`materialGuidanceProvided\` | ${S(s2.materialGuidanceProvided)} | the same for the material recommendation |`);
  w(`| \`label\` | ${s2.label} | the whole verdict, in words |`);
  w();
  w(`THE ABSENCE IS PROVED THREE WAYS, and each is a separate check this file ran: the function \`sourServiceRegion\` is not exported, so \`typeof\` it is ${s2.regionFunctionKind}; none of the three material guidance strings and neither standard name appears anywhere in the ${srcLines} lines of the engine source; and no returned string anywhere in three whole screenings names either standard.`);
  w();
  w('THE GENERAL LESSON, which is why this is the course\'s headline and not a footnote. A fit that is wrong by a factor of two in a number is a tolerance problem and you fix it by measuring. A fit that is invented and then labelled with somebody else\'s authority is a different kind of thing: the number was never the claim. The claim was "this is what the standard says", and no amount of retuning makes that true. The only repair available is to stop claiming it, and the only honest replacement is the sentence that the thing is not provided.');
  w();
  w('THE THRESHOLD VALUE ITSELF STAYED WHERE IT WAS. Changing a live number without a source would have repeated the same mistake with the sign flipped, so the engine keeps its threshold, declares it held, and prints it in both units so nobody has to guess which.');
  w();

  /* ------------------------------------------------------------- SECTION 3 */
  const s3 = L.heldConstantsTable();
  start();
  w('# SECTION 3: The numbers this module stands on, MEASURED out of the engine rather than typed, and pinned against a third copy (owned by Associate m01 and Expert m01)');
  w();
  w('NONE of these is sourced in this repository WITH ONE NAMED EXEMPTION, AND IT IS THE ROW CALLED \'the bar to psia factor\'. That factor is a unit conversion rather than a held correlation constant: section 24 rebuilds it from the definitions of the bar and of the pound-force and measures how far the engine\'s value sits from them, section 21 grades a conversion through it, and the engine\'s own eleven-item held list does not name it. Every OTHER constant here is HELD FOR LITERATURE, every one is measured below by asking the engine a question whose answer is that constant and nothing else, and every measured value is compared against a literal typed in this generator, which is a THIRD location. A constant that lives in the engine and in the oracle cannot be validated by comparing the engine with the oracle, and a paired battery proved that: fifteen of seventeen constants moved in both files at once left the suite green.');
  w();
  w('MEASURING RATHER THAN READING THE EXPORT IS DELIBERATE. An export tells you what the module declares. A measurement tells you what it actually uses. Both are below, and the two columns disagreeing would be a finding.');
  w();
  w('| constant | measured out of the engine | literal in this gate | relative difference | how it was measured |');
  w('| --- | --- | --- | --- | --- |');
  s3.pins.forEach((p) => w(`| ${p.label} | ${e12(p.measuredValue)} | ${e12(p.literal)} | ${expo(p.rel)} | ${p.how} |`));
  w();
  w(`${s3.pins.length} constants pinned, every one against a literal in a third file, and the whole table is re-measured on every rebuild of this digest.`);
  w();
  w(`THE ENGINE EXPORTS ${s3.exportRows.length} CONSTANTS BY NAME. ${s3.exportsThatArePins} of them are constants pinned in the table above, and the other is \`${s3.exportsNotPins[0]}\`, the sour threshold again in psia, so ${s3.pinsWithNoExport} of the ${s3.pins.length} pinned constants have no export at all and are reached by measurement alone. An export agreeing with a measurement checks the export; a measurement on its own checks the behaviour. Both columns are here so a disagreement between them would be visible.`);
  w();
  w('| export | declared value | measured from behaviour | relative difference |');
  w('| --- | --- | --- | --- |');
  s3.exportRows.forEach((r) => w(`| \`${r.name}\` | ${e12(r.exported)} | ${e12(r.measuredValue)} | ${expo(r.rel)} |`));
  w();
  w(`THE SOUR THRESHOLD IS NOT 0.05 PSIA. Measured out of the engine it is ${e12(s3.sourPsia)} psia, and 0.05 psia would be ${e12(s3.claimedSourPsiaAsBar)} bar. The gap between the two, as a fraction of the smaller, is ${e6(s3.gapPctOfSmaller)} percent. The engine prints both numbers and the vendored gate asserts the psia value is not 0.05. Section 25 is where the comment that claimed otherwise belongs.`);
  w();
  w('THE GOLDEN CARRIES ITS OWN COPY of these constants in a `heldConstants` block, which is the FOURTH location, and the vendored jest suite cross-pins that against its own literals. Moving a constant in the engine and in the oracle together now fails the pin before any measurement runs. The golden block, read from the file:');
  w();
  w('| golden key | golden value | measured out of the engine | relative difference |');
  w('| --- | --- | --- | --- |');
  s3.goldRows.forEach((r) => w(`| \`${r.goldKey}\` | ${e12(r.goldValue)} | ${e12(r.measuredValue)} | ${expo(r.rel)} |`));
  w();
  w(`${s3.goldRows.length} of the golden's ${s3.goldenHeldKeys} held constants are re-measured here against the engine's behaviour, so the golden, the engine and this generator are three independent copies and any two of them agreeing is no longer enough.`);
  w();

  /* ------------------------------------------------------------- SECTION 4 */
  const s4 = L.fugacityAndPartialPressure();
  start();
  w('# SECTION 4: CO2 partial pressure, CO2 fugacity, and the difference between them that the screen prints (owned by Associate m02)');
  w();
  w('TWO QUANTITIES, ONE MOLECULE, AND THEY ARE NOT THE SAME NUMBER. The partial pressure is the total pressure times the mole fraction. The fugacity is the partial pressure times a coefficient below one at high pressure, and it is the fugacity that drives the RATE. The H2S threshold and the film-governing ratio use PARTIAL PRESSURES, and no fugacity correction is applied to H2S at all, which the engine declares in a field.');
  w();
  w(`At the shipped app defaults: partial pressure ${e6(s4.appPco2Bar)} bar, coefficient ${e6(s4.appCoefficient)}, fugacity ${e6(s4.appFco2Bar)} bar. \`ph2sFugacityApplied\` is ${S(s4.ph2sFugacityApplied)}.`);
  w();
  w('| total pressure bar | coefficient | CO2 partial pressure bar | CO2 fugacity bar | cap applied | note |');
  w('| --- | --- | --- | --- | --- | --- |');
  s4.sweep.forEach((f) => {
    w(`| ${e6(f.pTotalBar)} | ${e6(f.fugacityCoefficient)} | ${e6(f.pco2Bar)} | ${e6(f.fco2Bar)} | ${S(f.pressureCapApplied)} | ${f.hasNote ? 'the engine says the coefficient is held at its cap value' : 'none'} |`);
  });
  w();
  w(`THE CAP IS A REPORTED LIMIT, NOT A SILENT ONE. At ${e6(s4.belowCapBar)} bar the coefficient is ${e6(s4.belowCapCoefficient)} and \`pressureCapApplied\` is ${S(s4.belowCapApplied)}. At ${e6(s4.aboveCapBar)} bar the coefficient is ${e6(s4.aboveCapCoefficient)}, identical to its value at the cap, \`pressureCapApplied\` is ${S(s4.aboveCapApplied)}, and the engine returns this note verbatim:`);
  w();
  w(`> ${s4.capNote}`);
  w();
  w('WHAT THE CORRELATION DOES ABOVE THE CAP IS HELD. The engine holds the coefficient flat and says it is doing so. That is a stated convention and not a prediction, and no graded field in this course sits above the cap.');
  w();
  w('THE REFUSALS THIS DOOR OWNS, each one a call this file made and labelled:');
  w('| what was asked | the engine\'s own message |');
  w('| --- | --- |');
  s4.refusals.forEach((r) => w(`| ${r.label} | ${r.error} |`));
  w();
  w(`The bare coefficient door returns NaN rather than a finite number below absolute zero: \`co2FugacityCoefficient\` at -300 C returns ${S(s4.coefficientBelowAbsoluteZero)}. A finite number there would be read as an answer by anything that only tests for an error key.`);
  w();

  /* ------------------------------------------------------------- SECTION 5 */
  const s5 = L.twoResistances();
  start();
  w('# SECTION 5: Two resistances in series, and which one is holding the rate back (owned by Associate m03)');
  w();
  w('The rate is not the reaction rate and it is not the transport rate. It is the two in series: the reciprocal of the sum of the reciprocals. That has a consequence a learner should be able to state before they see a number, and the table below is the proof of it: the combined rate is always BELOW BOTH TERMS, and it sits close to whichever term is smaller.');
  w();
  w('| stream | reaction mm/yr | mass transfer mm/yr | combined mm/yr | combined over the smaller term | controlling | margin |');
  w('| --- | --- | --- | --- | --- | --- | --- |');
  s5.rows.forEach((r) => {
    w(`| ${r.name} | ${e6(r.reactionMmYr)} | ${e6(r.massTransferMmYr)} | ${e6(r.combinedMmYr)} | ${e6(r.combinedOverSmaller)} | ${r.controlling} | ${e6(r.controllingMargin)} |`);
  });
  w();
  w('THE SERIES IDENTITY IS CHECKED ON EVERY ROW ABOVE and it holds to twelve figures: the reciprocal of the combined rate minus the reciprocal of each term is zero. That is what makes the combination a claim you can argue with rather than a black box.');
  w();
  w(`THE CONTROLLING WORD HAS A REPORTING MARGIN. Within ${e6(s5.controllingMarginPct)} percent the engine answers "comparable" rather than naming one term, because a bare comparison of two nearly equal numbers flips on floating-point noise. The margin is a REPORTING threshold and the engine says so: it is not a claim about where mass transfer stops mattering.`);
  w();
  w('THE MASS-TRANSFER TERM IS A POWER LAW, AND THE POWERS ARE MEASURABLE PROPERTIES. Doubling the velocity multiplies the term by a fixed factor whatever the other inputs are, and the same for halving the diameter. The two ratio columns below are scale free, which is what makes them a test of the FORM rather than of the constants.');
  w();
  w('| diameter m | mass transfer at 1 m/s | at 2 m/s | ratio | at 4 m/s | ratio |');
  w('| --- | --- | --- | --- | --- | --- |');
  s5.powerLaw.forEach((p) => {
    w(`| ${e6(p.diameterM)} | ${e6(p.at1)} | ${e6(p.at2)} | ${e12(p.ratioOne)} | ${e6(p.at4)} | ${e12(p.ratioTwo)} |`);
  });
  w();
  w(`Both ratio columns are constant down the table and equal to each other, which is what a power law in velocity means. The measured exponent is ${e12(s5.velocityExponent)} and the diameter exponent is ${e12(s5.diameterExponent)}, both pinned in section 3.`);
  w();
  w('AN ABSENT VELOCITY IS NOT AN UNLIMITED TRANSPORT CAPACITY. The mass-transfer door returns NaN when the velocity or the diameter is missing, and the gate asserts it is NaN and not infinity, because an infinite transport rate makes the series combination equal the reaction rate exactly and the engine would then name the reaction as controlling from an input nobody supplied.');
  w();
  w('| what was asked | the bare term returns |');
  w('| --- | --- |');
  s5.missing.forEach((m) => w(`| ${m.label} | ${S(m.value)} |`));
  w();

  /* ------------------------------------------------------------- SECTION 6 */
  const s6 = L.protectiveFilm();
  start();
  w('# SECTION 6: The protective film, and an onset temperature that MOVES (owned by Associate m04)');
  w();
  w('Once iron carbonate plates out on the steel the rate FALLS with further heating, which a naive extrapolation of the low-temperature equation gets exactly backwards. The engine handles that with a multiplier clamped at one, and the temperature at which the multiplier leaves one is COMPUTED rather than quoted, because it moves with the CO2 fugacity.');
  w();
  w('| CO2 fugacity bar | computed onset C | factor at 60 C | factor at the onset | factor 20 C above the onset |');
  w('| --- | --- | --- | --- | --- |');
  s6.onsets.forEach((o) => {
    w(`| ${e6(o.fco2Bar)} | ${e6(o.onsetC)} | ${e6(o.at60)} | ${e12(o.atOnset)} | ${e6(o.above)} |`);
  });
  w();
  w(`THE ONSET IS NOT A FIXED TEMPERATURE. Across the fugacities above it moves by ${e6(s6.onsetSpreadC)} degrees Celsius. At the shipped app defaults, where the fugacity is ${e6(s6.appFco2Bar)} bar, the engine computes the onset at ${e6(s6.appOnsetC)} C and the factor at the app's own ${e6(s6.appTC)} C is ${e12(s6.appScaleFactor)}, exactly one. A help guide that says the film appears at a round temperature is wrong at every fugacity except one.`);
  w();
  w('| temperature C | factor at the Kanbi fugacity | rate mm/yr | is the film credited |');
  w('| --- | --- | --- | --- |');
  s6.temperatureRows.forEach((r) => {
    w(`| ${e6(r.tC)} | ${e12(r.scaleFactor)} | ${e6(r.rateMmYr)} | ${r.credited ? 'yes' : 'no'} |`);
  });
  w();
  w(`The Kanbi stream runs at ${e6(s6.kanbiTC)} C with a fugacity of ${e6(s6.kanbiFco2Bar)} bar, so its computed onset is ${e6(s6.kanbiOnsetC)} C and its factor is ${e6(s6.kanbiScaleFactor)}. The Etelebou stream runs at ${e6(s6.etelebouTC)} C with a fugacity of ${e6(s6.etelebouFco2Bar)} bar, so its onset is ${e6(s6.etelebouOnsetC)} C and its factor is ${e12(s6.etelebouScaleFactor)}. One number, two streams, two different answers about whether a film exists.`);
  w();
  w('WHAT TEMPERATURE THE PUBLISHED CORRELATION TURNS AT IS HELD, and so is a much larger question. The engine forms the series combination FIRST and then multiplies by this factor, so it applies a protective-film correction to a rate that mass transfer may be controlling. Multiplying the reaction term instead is a DIFFERENT physical claim and gives a materially different answer whenever mass transfer controls, which it does at the app\'s own defaults. Which of the two the published correlation intends is not established here, the engine says so in its own held list, and NOTHING DOWNSTREAM OF THIS FACTOR IS GRADED IN THIS COURSE.');
  w();
  w(`WHERE THE FACTOR IS EXACTLY ONE THE QUESTION CANNOT BITE, because multiplying by one in either place gives the same number to the last bit. Of the six streams, ${s6.scaleOneStreams.length} have a factor of exactly one: ${s6.scaleOneStreams.join(', ')}. Every capstone scenario in this course is deliberately below its own computed onset for that reason, and the capstone generator asserts it.`);
  w();

  /* ------------------------------------------------------------- SECTION 7 */
  const s7 = L.phAndItsReference();
  start();
  w('# SECTION 7: pH, the reference it is taken against, and why below it the engine refuses (owned by Associate m05)');
  w();
  w(`The correction is a multiplier relative to the pH the correlation was fitted at. The reference is ${e6(s7.phReference)}, measured by bisecting the pH at which the engine stops returning a factor, and at the reference the factor is exactly one by definition rather than by a clamp.`);
  w();
  w('| pH | factor | factor relative to the reference | rate at the Etelebou stream mm/yr |');
  w('| --- | --- | --- | --- |');
  s7.rows.forEach((r) => {
    w(`| ${e6(r.ph)} | ${e6(r.factor)} | ${e6(r.relativeToReference)} | ${e6(r.rateMmYr)} |`);
  });
  w();
  w(`THE RATE FALLS STRICTLY WITH pH across the whole band above the reference: from ${e6(s7.firstRateMmYr)} mm/yr at pH ${e6(s7.firstPh)} to ${e6(s7.lastRateMmYr)} mm/yr at pH ${e6(s7.lastPh)}, a factor of ${e6(s7.spanFactor)}. Every step down the column is smaller than the one above it, and this generator asserts that on every rebuild.`);
  w();
  w(`EXACTLY ONE DECADE PER TWO pH UNITS is a PROPERTY of the correction and it is scale free, so it tests the form rather than the slope. Measured across the swept band: ${s7.decade.map((d) => e12(d.ratio)).join(', ')}. Every one is the same number.`);
  w();
  w('BELOW THE REFERENCE THE ENGINE REFUSES. It does not return a factor of one, and that distinction is the whole of this lesson: a more acid water is not a less corrosive one, so a factor of one is the LEAST LIMITING possible answer to a question the module cannot answer. What the published correction does below its reference is held.');
  w();
  w('| pH | what the engine returns |');
  w('| --- | --- |');
  s7.refusals.forEach((r) => {
    w(`| ${e6(r.ph)} | a refusal, and it carries \`phReference\` ${e6(r.phReference)} so a caller can print the boundary |`);
  });
  w(`| ${e6(s7.phReference)} | a factor of exactly ${e12(s7.referenceFactor)}, which is the boundary and is reached by definition |`);
  w();
  w('THE BOUNDARY IS SHARP AND IT IS SUPPOSED TO BE. The engine\'s own message, verbatim, for one pH below it:');
  w();
  w(`> ${s7.boundaryMessage}`);
  w();
  w('THE RANGE GUARD IS SEPARATE FROM THE REFERENCE GUARD, and they say different things:');
  w('| pH | the engine\'s own message |');
  w('| --- | --- |');
  s7.rangeRefusals.forEach((r) => w(`| ${e6(r.ph)} | ${r.error} |`));
  w(`| a blank box | ${s7.blankMessage} |`);
  w();

  /* ------------------------------------------------------------- SECTION 8 */
  const s8 = L.waterWetting();
  start();
  w('# SECTION 8: Water wetting, and a single dropdown that can take the rate to zero (owned by Professional m01)');
  w();
  w('Steel does not corrode where it is oil wet. The engine treats that as a REGIME and not as a multiplier applied always, which matters because the multiplier for the oil-wet regime is zero and a zero rate is the strongest reassurance a screen can give.');
  w();
  w('| regime | wetting factor | rate mm/yr | category | life | what the engine says |');
  w('| --- | --- | --- | --- | --- | --- |');
  s8.regimes.forEach((r) => {
    w(`| ${r.regime} | ${e6(r.waterWettingFactor)} | ${e6(r.rateMmYr)} | ${r.category === null ? 'WITHHELD' : r.category} | ${r.remainingYears === null ? 'WITHHELD' : `${e6(r.remainingYears)} yr`} | ${r.why} |`);
  });
  w();
  w('THE OIL-WET CASE WITHHOLDS ITS CATEGORY AND ITS LIFE, and it says why. The engine\'s own words:');
  w();
  w(`> ${s8.oilWetWhy}`);
  w();
  w(`AND THE INHIBITION FIGURE IS \`null\` RATHER THAN ZERO: ${S(s8.oilWetEffectiveInhibitionPct)}. A reported zero percent inhibition on a line that has a corrosion inhibitor programme is a statement, and it would be a false one. There is nothing to be effective against when the rate is zero by assumption.`);
  w();
  w('THE REGIME NAME IS MATCHED CASE AND PUNCTUATION INSENSITIVELY, and an unrecognised string refuses rather than falling through to the least limiting regime:');
  w('| what was typed | what the engine did |');
  w('| --- | --- |');
  s8.accepted.forEach((a) => w(`| \`${a.typed}\` | resolved to \`${a.resolved}\` |`));
  s8.rejected.forEach((r) => w(`| ${JSON.stringify(r.typed)} | refused: ${r.error} |`));
  w();
  w('THE WATER CUT IS ONLY READ IN THE INTERMITTENT REGIME, and it is range checked there:');
  w('| regime | water cut | wetting factor | rate mm/yr |');
  w('| --- | --- | --- | --- |');
  s8.cuts.forEach((c) => {
    w(`| ${c.regime} | ${e6(c.waterCutFrac)} | ${e6(c.waterWettingFactor)} | ${e6(c.rateMmYr)} |`);
  });
  s8.cutRefusals.forEach((c) => w(`| ${c.regime} | ${S(c.waterCutFrac)} | refused | ${c.error} |`));
  w();
  w('ONE ABSENT INPUT STILL REACHES A DEFAULT, AND IT IS WORTH KNOWING WHICH. `waterCutFrac` carries a DEFAULT PARAMETER of one in the engine signature, so an argument that is genuinely missing, rather than not-a-number, becomes a water cut of one hundred percent in the intermittent regime. A water cut typed as not-a-number refuses, which is what the studio layer produces from a blank box, so the live app is not exposed. A direct caller that omits the key is.');
  w(`Measured: with the key omitted the wetting factor is ${e6(s8.omittedWettingFactor)} and the rate is ${e6(s8.omittedRateMmYr)} mm/yr, the same as the water-wet answer. The direction is CONSERVATIVE, because a wetting factor of one is the most limiting value the regime can take, which is why it is recorded here rather than treated as a defect. The H2S mole fraction in section 17 has the same shape and the opposite direction.`);
  w();

  /* ------------------------------------------------------------- SECTION 9 */
  const s9 = L.inhibitorArithmetic();
  start();
  w('# SECTION 9: The corrosion inhibitor, and the arithmetic that surprises people (owned by Professional m02, and the one lesson this module exists to teach)');
  w();
  w('A 95 percent corrosion inhibitor running 80 percent of the time is not a 95 percent solution. The uninhibited rate applies for the fraction of the time the corrosion inhibitor is off, and it is that time average that eats the wall. The engine takes EFFICIENCY and AVAILABILITY as separate inputs and returns the effective protection, the shortfall in percentage points, and a warning that names the metal-loss ratio.');
  w();
  w('| efficiency percent | availability percent | effective protection percent | shortfall pp | rate mm/yr | metal loss against the datasheet number |');
  w('| --- | --- | --- | --- | --- | --- |');
  s9.rows.forEach((r) => {
    w(`| ${e6(r.efficiencyPct)} | ${e6(r.availabilityPct)} | ${e6(r.effectiveInhibitionPct)} | ${e6(r.inhibitorShortfallPp)} | ${e6(r.rateMmYr)} | ${e6(r.metalLossRatio)} |`);
  });
  w();
  w(`READ THE 80 PERCENT ROW TWICE. A 95 percent corrosion inhibitor at 80 percent availability delivers ${e6(s9.eightyEffectivePct)} percent effective protection, which is ${e6(s9.eightyShortfallPp)} percentage points short of the datasheet figure, and the metal loss is ${e6(s9.eightyMetalLossRatio)} times what the datasheet number would give. AVAILABILITY IS WHAT LIMITS IT. Efficiency does not. The engine's own warning on that case, verbatim:`);
  w();
  w(`> ${s9.eightyWarning}`);
  w();
  w(`THE WARNING FIRES ON THE EFFECTIVE SHORTFALL AT ANY EFFICIENCY. The trigger, measured by bisecting the availability at which it appears, is ${e6(s9.shortfallTriggerPp)} percentage points of shortfall. At the shipped app defaults of a 90 percent inhibitor at 95 percent availability the effective protection is ${e6(s9.appEffectivePct)} percent, the shortfall is ${e6(s9.appShortfallPp)} percentage points, and the warning is present.`);
  w();
  w('| clamped input | what the engine did | the clamp it named |');
  w('| --- | --- | --- |');
  s9.clamps.forEach((c) => {
    w(`| efficiency ${e6(c.efficiencyPct)}, availability ${e6(c.availabilityPct)} | effective protection ${e6(c.effectiveInhibitionPct)} percent | ${c.clamps.join('; ')} |`);
  });
  w();
  w(`A TYPED 100 PERCENT EFFICIENCY GIVES EXACTLY THE AVAILABILITY. At 100 percent efficiency and 95 percent availability the effective protection is ${e6(s9.hundredEffectivePct)} percent, with no clamp and no hidden ceiling, and the engine adds a note saying what that arithmetic is and is not:`);
  w();
  w(`> ${s9.hundredNote}`);
  w();
  w('EVERY NUMBER IN THIS SECTION IS ARITHMETIC OVER TWO TYPED PERCENTAGES, with no correlation constant anywhere in the chain. That is why the inhibitor arithmetic is the one part of this engine a capstone can grade without leaning on a number nobody can source, and section 21 says which of the eighteen graded fields rest on it.');
  w();

  /* ------------------------------------------------------------ SECTION 10 */
  const s10 = L.wallShear();
  start();
  w('# SECTION 10: Wall shear, the friction branch, and a discontinuity that is reported rather than smoothed (owned by Professional m03)');
  w();
  w('The wall shear is what decides whether an inhibitor film survives, so it is the number the rate now depends on. It is built from a friction factor, and the friction factor has TWO BRANCHES with a hard switch between them.');
  w();
  w('| stream | Reynolds | branch | friction factor | wall shear Pa | film risk |');
  w('| --- | --- | --- | --- | --- | --- |');
  s10.streamRows.forEach((r) => {
    w(`| ${r.name} | ${r4(r.reynolds)} | ${r.branch} | ${e6(r.fanningFriction)} | ${e6(r.tauPa)} | ${r.filmRisk} |`);
  });
  w();
  w('| velocity m/s | Reynolds | branch | wall shear Pa | film risk | is the credit removed |');
  w('| --- | --- | --- | --- | --- | --- |');
  s10.velocityRows.forEach((r) => {
    w(`| ${e6(r.velocityMS)} | ${r4(r.reynolds)} | ${r.branch} | ${e6(r.tauPa)} | ${r.filmRisk} | ${S(r.creditRemoved)} |`);
  });
  w();
  w(`THE STRIPPING VELOCITY IS A NUMBER, NOT A REGION. For the Tunu stream it is ${e6(s10.strippingVelocityMS)} m/s, found by bisecting the velocity at which \`filmStripped\` turns true, and the shear there is ${e6(s10.strippingTauPa)} Pa against the measured threshold of ${e6(s10.filmStripPa)} Pa. The threshold value itself is HELD: it drives a coloured word, a warning paragraph and now the rate, and it is not sourced.`);
  w();
  w(`THE BRANCH SWITCH IS A GENUINE DISCONTINUITY. At the measured switch of Reynolds ${e6(s10.switchRe)} the wall shear jumps by a factor of ${e6(s10.switchJump)} across two ten-thousandths of the Reynolds number, which is a fraction of a percent of velocity. The engine does NOT smooth it, because smoothing it would be a third invented correlation. It reports it:`);
  w();
  w('| Reynolds | branch | friction factor | wall shear Pa | nearSwitch |');
  w('| --- | --- | --- | --- | --- |');
  s10.branchRows.forEach((r) => {
    w(`| ${r4(r.reynolds)} | ${r.branch} | ${e6(r.fanningFriction)} | ${e6(r.tauPa)} | ${S(r.nearSwitch)} |`);
  });
  w();
  w('Inside ten percent of the switch the engine sets `nearSwitch` and returns this note verbatim:');
  w();
  w(`> ${s10.nearSwitchNote}`);
  w();
  w('THE ANGIAMA STREAM IS THE LAMINAR CASE, and it is there so a lesson has one. It is viscous, small and slow, and the friction factor it gets comes from the other branch entirely.');
  w(`Angiama: Reynolds ${r4(s10.angiama.reynolds)}, branch ${s10.angiama.branch}, friction factor ${e6(s10.angiama.fanningFriction)}, wall shear ${e6(s10.angiama.tauPa)} Pa, film risk ${s10.angiama.filmRisk}.`);
  w();
  w('THIS MODULE OWNS A SECOND FRICTION FACTOR AND A SECOND REYNOLDS NUMBER. The line hydraulics module has its own, with a different correlation and a different transition, and the two will not agree. The engine says so in its own docstring. Section 23 is where that seam is written down, because a course that teaches two friction factors without naming the seam teaches a contradiction.');
  w();
  w('| what was asked | the engine\'s own message |');
  w('| --- | --- |');
  s10.refusals.forEach((r) => w(`| ${r.label} | ${r.error} |`));
  w();

  /* ------------------------------------------------------------ SECTION 11 */
  const s11 = L.theCoupling();
  start();
  w('# SECTION 11: THE COUPLING. The shear verdict now acts on the rate, so the number and the sentence beside it agree (owned by Professional m04)');
  w();
  w('This is the design decision at the centre of the engine as it ships. When the wall shear says the inhibitor film is gone, the rate is computed WITH THE CREDIT REMOVED, and the credited rate is reported beside it so the cost of that verdict is visible rather than implied. No new correlation was invented to do it: the credit is simply not taken.');
  w();
  w('| stream | film stripped | rate mm/yr | rate with the credit kept mm/yr | ratio | life yr | life with the credit kept yr |');
  w('| --- | --- | --- | --- | --- | --- | --- |');
  s11.rows.forEach((r) => {
    w(`| ${r.name} | ${S(r.filmStripped)} | ${e6(r.rateMmYr)} | ${e6(r.rateWithCreditMmYr)} | ${e6(r.ratio)} | ${r.lifeYr === null ? 'WITHHELD' : e6(r.lifeYr)} | ${r.lifeWithCreditYr === null ? 'WITHHELD' : e6(r.lifeWithCreditYr)} |`);
  });
  w();
  w(`THE RATIO IS PURE INHIBITOR ARITHMETIC. For the Tunu stream the stripped rate is ${e6(s11.tunuRatio)} times the credited rate, and that factor is exactly the reciprocal of the retained fraction the inhibitor programme leaves. Nothing in the correlation is in it: the two rates share the whole chain and it divides out. That property is asserted here to twelve figures, and it is why one of the eighteen graded capstone fields can be a ratio of two lives without leaning on a held constant.`);
  w();
  w('THE ENGINE\'S OWN WARNING when the credit is removed, verbatim:');
  w();
  w(`> ${s11.tunuWarning}`);
  w();
  w('AND THE BINDING CONSTRAINT NAMES THE SHEAR, so the summary and the rate do not disagree:');
  w();
  w(`> ${s11.tunuBindingWhy}`);
  w();
  w('`screen` COMPUTES THE SHEAR FIRST, and that order is the point. The rate depends on the shear verdict, so a shear that cannot be computed means the screening is incomplete and NO RATE IS ISSUED. A missing density is not a missing row on a summary, it is a refusal:');
  w();
  w('| what was left blank | what `screen` did |');
  w('| --- | --- |');
  s11.blanks.forEach((b) => w(`| ${b.label} | ${b.error} |`));
  w();

  /* ------------------------------------------------------------ SECTION 12 */
  const s12 = L.h2sThreshold();
  start();
  w('# SECTION 12: H2S, a threshold comparison, and nothing more (owned by Professional m06 l03)');
  w();
  w('This door compares one partial pressure against one threshold and reports the comparison in two units. It does not classify severity and it does not choose a material. Section 2 is why.');
  w();
  w('| H2S partial pressure bar | psia | above the threshold | decades above | label |');
  w('| --- | --- | --- | --- | --- |');
  s12.rows.forEach((r) => {
    w(`| ${e12(r.ph2sBar)} | ${e12(r.ph2sPsia)} | ${S(r.sour)} | ${e6(r.decadesAboveThreshold)} | ${r.label} |`);
  });
  w();
  w(`AT ZERO H2S the decade count is ${S(s12.zeroDecades)} rather than minus infinity, and \`sour\` is ${S(s12.zeroSour)}. The logarithm of zero is not a screening result.`);
  w();
  w(`THE THRESHOLD IS HELD AND THE ENGINE SAYS SO IN A FIELD: \`thresholdHeld\` is ${S(s12.thresholdHeld)}. Its value, measured by bisecting the sour flag, is ${e12(s12.thresholdBar)} bar, which is ${e12(s12.thresholdPsia)} psia. The engine prints both in its note so nobody has to convert, and section 3 shows why the second number matters.`);
  w();
  w('THE ENGINE\'S OWN NOTE above the threshold, verbatim:');
  w();
  w(`> ${s12.aboveNote}`);
  w();
  w('| what was asked | the engine\'s own message |');
  w('| --- | --- |');
  s12.refusals.forEach((r) => w(`| ${r.label} | ${r.error} |`));
  w();
  w('WHAT THIS DOOR DOES NOT DO, stated because a learner will look for it: no severity region, no material selection, no hardness limit, no weldment qualification, no sulphide stress cracking criterion and no hydrogen induced cracking criterion. All of that needs the standard, and the standard is not in this repository.');
  w();

  /* ------------------------------------------------------------ SECTION 13 */
  const s13 = L.whichFilmGoverns();
  start();
  w('# SECTION 13: Which film governs, from a ratio that needs no pressure at all (owned by Professional m06)');
  w();
  w('Above a certain H2S to CO2 ratio iron sulphide starts to compete with iron carbonate, and above a higher one a CO2-only rate model has stopped describing the surface. The engine answers in four words and it says whether its own rate model applies.');
  w();
  w('THE RATIO IS PRESSURE FREE, and that is the single most useful thing about it. Both arguments are PARTIAL PRESSURES, both are the total pressure times a mole fraction, so the total pressure divides out and the ratio equals the ratio of the mole fractions at any pressure whatsoever. Reaching it through mole fractions is what catches an H2S partial pressure built from the total pressure with the mole fraction dropped, and an H2S partial pressure fed a CO2 FUGACITY where the partial pressure belongs.');
  w();
  w('| total pressure bar | CO2 mol fraction | H2S mol fraction | ratio from partial pressures | ratio from mole fractions | difference |');
  w('| --- | --- | --- | --- | --- | --- |');
  s13.pressureFree.forEach((p) => {
    w(`| ${e6(p.pTotalBar)} | ${e6(p.co2MolFrac)} | ${e6(p.h2sMolFrac)} | ${e12(p.ratioFromPartials)} | ${e12(p.ratioFromMoles)} | ${p.ratioFromPartials === p.ratioFromMoles ? '0' : expo(p.difference)} |`);
  });
  w();
  w('The last column is zero at every pressure, which is the whole claim. A ratio that moved with pressure would be built from the wrong quantity.');
  w();
  w('| CO2 mol fraction | H2S mol fraction | ratio | regime | does the CO2 rate model apply | is the rate an upper bound |');
  w('| --- | --- | --- | --- | --- | --- |');
  s13.regimeRows.forEach((r) => {
    w(`| ${e6(r.co2MolFrac)} | ${e6(r.h2sMolFrac)} | ${r.ratio === null ? 'none' : e12(r.ratio)} | ${r.regime} | ${S(r.rateApplies)} | ${S(r.rateIsUpperBound)} |`);
  });
  w();
  w(`FOUR ANSWERS, ALL REACHED ABOVE: ${s13.regimeWords.join(', ')}. The boundaries, measured by bisecting the regime word, are ${e12(s13.carbonateBoundary)} and ${e12(s13.mixedBoundary)}, and BOTH ARE HELD.`);
  w();
  w('BOTH UNKNOWN BRANCHES CARRY A NOTE, so a panel that prints the note unconditionally always has a sentence to print:');
  w('| what was asked | regime | the engine\'s own note |');
  w('| --- | --- | --- |');
  s13.unknowns.forEach((u) => w(`| ${u.label} | ${u.regime} | ${u.note} |`));
  w();
  w('THE SULPHIDE REGIME WITHHOLDS THE CATEGORY AND THE LIFE AND KEEPS THE RATE AS A STATED UPPER BOUND. That is a design decision and it is worth stating as one: the engine could have refused the rate entirely, and it could have graded it as if nothing had changed. It does neither. The Diebu stream is the case:');
  w();
  w(`Diebu: ratio ${e12(s13.diebuRatio)}, regime ${s13.diebuRegime}, category ${S(s13.diebuCategory)}, life ${S(s13.diebuLife)}, and the withheld block names the rate as an upper bound of ${e6(s13.diebuUpperBoundMmYr)} mm/yr.`);
  w();
  w(`> ${s13.diebuWhy}`);
  w();
  w('THE MIXED REGIME STAYS GRADED AND IS MARKED. It sets `rateIsUpperBound` and carries its own note, because a mixed film is not a reason to withhold a screening number, only a reason to read it as a ceiling:');
  w();
  w(`> ${s13.mixedNote}`);
  w();

  /* ------------------------------------------------------------ SECTION 14 */
  const s14 = L.allowanceAndLife();
  start();
  w('# SECTION 14: The allowance, the remaining life, and a zero rate that is not a pass (owned by Professional m05 and Expert m02 l04 and m05 l03 and l04)');
  w();
  w('This door divides a remaining allowance by a rate and stops. That is its whole scope, and what it does NOT do is the subject of section 21.');
  w();
  w('| stream | rate mm/yr | allowance mm | consumed mm | remaining mm | remaining yr | allowance the design life demands mm | shortfall mm | meets the design life |');
  w('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  s14.rows.forEach((r) => {
    if (r.withheld) {
      w(`| ${r.name} | ${e6(r.rateMmYr)} | ${e6(s14.allowanceMm)} | ${e6(s14.consumedMm)} | WITHHELD | WITHHELD | WITHHELD | WITHHELD | WITHHELD |`);
      return;
    }
    w(`| ${r.name} | ${e6(r.rateMmYr)} | ${e6(s14.allowanceMm)} | ${e6(s14.consumedMm)} | ${e6(r.remainingMm)} | ${e6(r.remainingYears)} | ${e6(r.requiredAllowanceMm)} | ${e6(r.shortfallMm)} | ${S(r.meetsDesignLife)} |`);
  });
  w();
  w('THE REQUIRED ALLOWANCE IGNORES WHAT HAS ALREADY GONE, and that is a subtlety worth an Expert lesson rather than a footnote. `requiredAllowanceMm` is the rate times the design life. It is the allowance a NEW line would need. The shortfall compares it against what is LEFT, so the two fields answer two different questions and only one of them is the allowance a reinstatement would have to specify.');
  w();
  w(`Worked at a stated rate of 0.250000 mm/yr, a 4 mm allowance with 1.2 mm gone and a 20 year design life: \`requiredAllowanceMm\` is ${e6(s14.workedRequiredAllowanceMm)} mm, the remaining allowance is ${e6(s14.workedRemainingMm)} mm, the shortfall is ${e6(s14.workedShortfallMm)} mm, and the allowance that actually reinstates the design life, found by bisecting the allowance until \`meetsDesignLife\` turns true, is ${e6(s14.reinstatingAllowanceMm)} mm. The gap between the last two numbers is exactly the consumed depth, and this generator asserts that.`);
  w();
  w('A ZERO RATE DOES NOT RETURN AN UNBOUNDED LIFE WITH A PASSING VERDICT. It returns no life, no verdict, and a note telling the reader to find out why the rate is zero first, because the strongest reassurance on the screen would otherwise arrive from the weakest input.');
  w();
  w(`At a zero rate: \`remainingYears\` is ${S(s14.zeroRemainingYears)}, \`meetsDesignLife\` is ${S(s14.zeroMeetsDesignLife)}, \`unbounded\` is ${S(s14.zeroUnbounded)}, and the note reads:`);
  w();
  w(`> ${s14.zeroNote}`);
  w();
  w(`FOUR SEPARATE PATHS REACH A ZERO RATE, and a learner should be able to list them: an oil-wet wetting regime, a stream with no CO2 in it, a 100 percent inhibitor at 100 percent availability, and a typed zero CO2 mole fraction. The golden's own zero-rate row records the same shape: remainingYears ${S(s14.goldenZeroRemainingYears)}, unbounded ${S(s14.goldenZeroUnbounded)}, meetsDesignLife ${S(s14.goldenZeroMeetsDesignLife)}.`);
  w();
  w('| what was asked | the engine\'s own message |');
  w('| --- | --- |');
  s14.refusals.forEach((r) => w(`| ${r.label} | ${r.error} |`));
  w();
  w('THE FULLY CONSUMED CASE IS THE ONE TO READ TWICE. The engine does not return a negative life or a zero one. It says the question has changed, in its own words above: a line whose allowance is gone is an inspection and fitness-for-service question, and this module has neither.');
  w();
  w('A DESIGN LIFE IS OPTIONAL AND ITS ABSENCE IS NOT A ZERO:');
  w(`With the design life left out: remaining years ${e6(s14.noDesignLifeRemainingYears)}, \`meetsDesignLife\` ${S(s14.noDesignLifeMeets)}, \`requiredAllowanceMm\` ${S(s14.noDesignLifeRequiredAllowanceMm)}, shortfall ${e6(s14.noDesignLifeShortfallMm)}.`);
  w();

  /* ------------------------------------------------------------ SECTION 15 */
  const s15 = L.rateCategoryLabel();
  start();
  w('# SECTION 15: The rate category is a LABEL, and the label is held (owned by Expert m03)');
  w();
  w('Four BAND words separated by three boundaries, and a fifth word that is not a band at all. The four bands are low, moderate, high and severe. The fifth word is negligible, and it is what the door returns at exactly zero and below rather than a band it reaches by being small. Counting zero itself there are four boundaries, and no source for any of them. The engine says in its own held list that the bands are looser than those commonly cited for carbon steel in production service, so a label here may be optimistic by one or two steps.');
  w();
  w('| rate mm/yr | category |');
  w('| --- | --- |');
  s15.probes.forEach((p) => w(`| ${e6(p.rateMmYr)} | ${S(p.category)} |`));
  w();
  w('| what was asked | what the label door returns |');
  w('| --- | --- |');
  s15.edgeCases.forEach((c) => w(`| ${c.label} | ${S(c.category)} |`));
  w();
  w(`THE BOUNDARIES, MEASURED BY BISECTING THE WORD: ${e12(s15.lowBand)}, ${e12(s15.moderateBand)} and ${e12(s15.highBand)} mm/yr. All three are HELD and NONE of them is graded anywhere in this course. The engine's own sentence about them, from its held list, verbatim:`);
  w();
  w(`> ${s15.heldSentence}`);
  w();
  w(`THE GOLDEN CARRIES ${s15.goldenRowCount} CATEGORY ROWS, both sides of all three bands. Read from the file and re-run through the engine:`);
  w();
  w('| golden rate mm/yr | golden category | engine category | agree |');
  w('| --- | --- | --- | --- |');
  s15.goldenRows.forEach((r) => {
    w(`| ${eWide(r.rateMmYr)} | ${r.goldenCategory} | ${S(r.engineCategory)} | ${r.engineCategory === r.goldenCategory ? 'yes' : 'NO'} |`);
  });
  w();
  w(`THE FOURTH BOUNDARY IS ZERO ITSELF, AND THE GOLDEN IS WHERE IT IS PINNED. The first two rows above are the two sides of it. At exactly ${eWide(s15.zeroRateMmYr)} mm/yr the word is ${s15.zeroCategory}, and at ${eWide(s15.tinyRateMmYr)} mm/yr, which is the smallest positive rate the golden carries, the word is already ${s15.tinyCategory}. The test the engine applies is whether the rate is greater than zero, so there is no small-but-positive rate that comes back ${s15.zeroCategory}: a rate is ${s15.zeroCategory} when it is zero or below and ${s15.tinyCategory} the instant it is not. The second row is the only row in this table printed past six decimals, because at six decimals it would read ${e6(s15.tinyRateMmYr)} and a reader would see the row above it twice.`);
  w();
  w(`READ THE APP'S OWN DEFAULT ROW. At the shipped defaults the rate is ${e6(s15.appRateMmYr)} mm/yr and the label is "${s15.appCategory}". A band set one step tighter would call the same number something worse, and nothing in this repository says which band set is right. That is what "held" means in practice: the word on the screen is not a measurement.`);
  w();

  /* ------------------------------------------------------------ SECTION 16 */
  const s16 = L.bindingConstraint();
  start();
  w('# SECTION 16: The binding constraint, the summary that reconciles the screen (owned by Expert m04)');
  w();
  w('A screen that returns seven independent numbers and reconciles none of them is a screen the reader has to summarise themselves, and they will summarise it by reading the largest number. The engine names WHICH OF ITS OWN LIMITS governs the answer, in descending order of what would change first, and every one of them is derived from what is already computed.');
  w();
  w('| stream | binding constraint | the value it turns on | why, in the engine\'s own words |');
  w('| --- | --- | --- | --- |');
  s16.rows.forEach((r) => {
    w(`| ${r.name} | ${r.what} | ${r.valueLabel === null ? 'none, the model does not apply' : r.valueLabel} | ${r.why} |`);
  });
  w();
  w(`${s16.distinct.length} DIFFERENT CONSTRAINTS ACROSS SIX STREAMS: ${s16.distinct.join('; ')}. A summary that always said the same thing would be a heading and not a summary.`);
  w();
  w('THE ORDER IS THE CLAIM. The engine checks, in this sequence: does the model apply at all; is the film being stripped; does the allowance fail the design life; are the two resistances comparable; is transport controlling; otherwise kinetics. Each step answers "what would I change first", and a lower step is only reached because every step above it is satisfied.');
  w();
  w('| case | binding | what the reader should do about it |');
  w('| --- | --- | --- |');
  s16.cases.forEach((c) => {
    w(`| ${c.label} | ${c.what} | ${c.valueLabel === null ? 'read the withheld block, because no rate verdict is being offered' : c.valueLabel} |`);
  });
  w();
  w('A BINDING CONSTRAINT IS NOT A RECOMMENDATION. It names the limit that governs the number, and it is silent about what to buy, when to inspect and what thickness to retire at, because the module has none of those.');
  w();

  /* ------------------------------------------------------------ SECTION 17 */
  const s17 = L.wholeScreening();
  start();
  w('# SECTION 17: The whole screening in one call, and the order that makes it honest (owned by Expert m04 and m05)');
  w();
  w(`\`screen\` returns ${s17.fieldCount} top-level fields. The order in which it computes them is the design decision: the wall shear FIRST, because the rate depends on whether the film survives it, then the rate, then the credited rate beside it, then the sour comparison, then the regime, then the withholding, then the category, then the life, then the binding constraint.`);
  w();
  w(`Top-level fields: ${s17.topLevelFields.join(', ')}.`);
  w();
  w('| field | at the shipped app defaults | what it is |');
  w('| --- | --- | --- |');
  [['rate.rateMmYr', e6(s17.rateMmYr), 'the rate the whole screen is about'],
    ['rate.uninhibitedMmYr', e6(s17.uninhibitedMmYr), 'the same case with no inhibitor credit at all'],
    ['rateWithFilmCreditMmYr', e6(s17.rateWithFilmCreditMmYr), 'the rate the datasheet efficiency would give, reported beside the rate whether or not the credit was taken'],
    ['filmStripped', S(s17.filmStripped), 'whether the shear verdict removed the credit'],
    ['shear.tauPa', e6(s17.tauPa), 'the wall shear the verdict is taken on'],
    ['shear.filmRisk', s17.filmRisk, 'the risk word, from two HELD thresholds'],
    ['sour.sour', S(s17.sour), 'above the H2S screening threshold or below it'],
    ['regime.regime', s17.regime, 'which corrosion product governs'],
    ['category', S(s17.category), 'the band label, HELD'],
    ['categoryHeld', S(s17.categoryHeld), 'the engine declaring that the band is not sourced'],
    ['life.remainingYears', e6(s17.remainingYears), 'the allowance divided by the rate'],
    ['life.meetsDesignLife', S(s17.meetsDesignLife), 'against the stated design life'],
    ['ph2sBar', e6(s17.ph2sBar), 'the H2S partial pressure, the total pressure times the mole fraction'],
    ['ph2sFugacityApplied', S(s17.ph2sFugacityApplied), 'declared false, because no fugacity correction is applied to H2S'],
    ['withheld', S(s17.withheld), 'null here, an object naming what is withheld and why when the model does not apply'],
    ['binding.what', s17.bindingWhat, 'the limit that governs'],
    ['screeningComplete', S(s17.screeningComplete), 'present only when every part of the screening ran'],
    ['clamps', s17.clamps.length === 0 ? 'none' : s17.clamps.join('; '), 'every input the engine moved, named'],
    ['notProvided', `${s17.notProvidedCount} items`, 'what the module will not pretend to answer'],
    ['limits', `${s17.limitsCount} items`, 'every number in the module with no source in the repository'],
  ].forEach(([f, v, m]) => w(`| \`${f}\` | ${v} | ${m} |`));
  w();
  w('THE INPUT GUARDS `screen` OWNS THAT NOTHING BELOW IT OWNS:');
  w('| what was asked | the engine\'s own message |');
  w('| --- | --- |');
  s17.guards.forEach((g) => w(`| ${g.label} | ${g.error} |`));
  w();
  w('AND ONE DEFAULT PARAMETER THAT POINTS THE OTHER WAY, which a reader should know about because it is the shape section 25 item three is about. `h2sMolFrac` carries a DEFAULT PARAMETER of zero in the screen signature. An H2S mole fraction that is NOT A NUMBER refuses, which is what the studio layer produces from a blank box, so the live app is not exposed. But a direct caller that OMITS the key entirely gets a positive assertion of zero H2S: not sour, the carbonate regime, and a graded category and life.');
  w(`Measured: with the key omitted the H2S partial pressure is ${e6(s17.h2sOmittedPh2sBar)} bar, \`sour\` is ${S(s17.h2sOmittedSour)}, the regime is ${s17.h2sOmittedRegime}, and the category is issued as "${S(s17.h2sOmittedCategory)}". Compare the shipped defaults, which carry 0.1 mol percent H2S: \`sour\` is ${S(s17.appSour)} and the regime is ${s17.appRegime}. The direction here is the LEAST limiting one, and the reason the live studio is safe from it is the layer above. This default is not what protects it.`);
  w();
  w('AND TWO THINGS `screen` STILL SWALLOWS, WHICH THIS DIGEST RECORDS BECAUSE THE SECTION ABOVE TEACHES THE OPPOSITE. The order argument is that an unavailable wall shear makes the screening incomplete, so `screen` refuses rather than putting the error in a field and returning normally. That is true of the shear. It is NOT true of the remaining life, and the two cases below are the same shape one field along.');
  w();
  w('| what was asked | top-level error | `life` | `withheld` | `screeningComplete` | what a caller checking `if (result.error)` sees |');
  w('| --- | --- | --- | --- | --- | --- |');
  s17.swallowed.forEach((r) => {
    w(`| ${r.label} | ${S(r.topLevelError)} | ${r.lifeIsNull ? 'null' : (r.lifeError ? `an ERROR OBJECT: ${r.lifeError}` : 'a life')} | ${S(r.withheld)} | ${S(r.screeningComplete)} | nothing |`);
  });
  w();
  w(`READ THE FIRST TWO ROWS AGAINST THE BINDING CONSTRAINT THEY CAME WITH. The blank-allowance case returns \`${s17.swallowed[0].bindingWhat}\` as its binding constraint and a complete screening, so a summary rail simply has no remaining-life row and nothing on the screen says why. The last two rows put the life door's own refusal INSIDE the \`life\` field, so a caller's \`if (result.error)\` passes, \`result.life.remainingYears\` is undefined, and the refusal message never reaches anyone.`);
  w();
  w('WHAT TO DO WITH THIS AS A LEARNER, AND IT IS THE GENERAL LESSON OF THIS WHOLE COURSE. A repair that names a defect and fixes one instance of it has not removed the CLASS. The shear case and the life case are one shape: a function that puts a failure into a field and returns a success. The way to find the next one is to read what the function returns rather than what its comment says it returns, and to ask of every field whether its absence is DECLARED or merely missing. This module declares the withdrawn region\'s absence in two fields and does not declare this one.');
  w();
  w('THE SAME SHAPE ONCE MORE, IN A DEFAULT PARAMETER RATHER THAN A SWALLOWED ERROR, and pointing the least-limiting way:');
  w(`With the H2S key OMITTED the partial pressure is ${e6(s17.h2sOmittedPh2sBar)} bar, \`sour\` is ${S(s17.h2sOmittedSour)}, the regime is ${s17.h2sOmittedRegime} and the category is issued as "${S(s17.h2sOmittedCategory)}". An H2S mole fraction that is NOT A NUMBER refuses, and the studio layer produces not-a-number from a blank box, so the live screen is protected by the layer above rather than by this default.`);
  w();
  w('THE SUM GUARD IS THE ONE PEOPLE MISS. Two mole fractions each inside nought to one can still add to more than one, and their partial pressures would then exceed the total pressure. The engine checks the SUM against the total and not just each fraction against its own range.');
  w();
  w(`A sum of exactly one is accepted: CO2 0.600000 and H2S 0.400000 give a partial pressure sum of ${e6(s17.sumAcceptedPartialsBar)} bar against a total of ${e6(s17.sumAcceptedTotalBar)} bar, and the screening runs.`);
  w();

  /* ------------------------------------------------------------ SECTION 18 */
  const s18 = L.everyRefusal();
  start();
  w('# SECTION 18: Every refusal this module can produce, in one table (owned by Expert m05)');
  w();
  w('A refusal is the module telling you it cannot answer, and the difference between a refusal and a least-limiting default is the difference between a screening tool and a liability. Every row below is a call this generator made, labelled a refusal, and asserted to have returned an error key and no non-finite number alongside it.');
  w();
  w('| door | what was asked | the engine\'s own message |');
  w('| --- | --- | --- |');
  s18.rows.forEach((r) => w(`| \`${r.door}\` | ${r.label} | ${r.error} |`));
  w();
  w(`${s18.count} REFUSALS, every one of them a call this file made and asserted. The golden carries ${s18.goldenRefusalCount} refusal rows of its own and the vendored jest suite asserts every one refuses with a message that names the input, and REFUSES ITSELF rather than passing when the module answers.`);
  w();
  w('A TYPED ZERO IS NOT A BLANK, and the difference is the whole of this table. A typed zero CO2 mole fraction is a positive assertion that there is no CO2, so the engine takes its no-CO2 branch, withholds the category and the life, and says what a rate of zero means there. A BLANK CO2 box is a question the engine cannot answer, so it refuses.');
  w();
  w(`A typed zero: rate ${e6(s18.typedZeroRateMmYr)} mm/yr, \`rateApplies\` ${S(s18.typedZeroApplies)}, category ${S(s18.typedZeroCategory)}, life ${S(s18.typedZeroLife)}, and the note reads:`);
  w();
  w(`> ${s18.typedZeroNote}`);
  w();
  w(`A blank box, on the same screen: ${s18.blankCo2Error}`);
  w();

  /* ------------------------------------------------------------ SECTION 19 */
  const s19 = L.studioDefaults();
  const byKey = Object.fromEntries(s19.inputs.map((i) => [i.key, i]));
  start();
  w('# SECTION 19: The live studio\'s own defaults, end to end, and every number a user has been shown (owned by Associate m06 and Professional m05 and m06)');
  w();
  w('The Corrosion & Integrity Studio ships with a case already filled in, so the first thing any user sees is this. Every figure below is this generator running the engine on the studio\'s own default inputs, converted with the studio\'s own factors, which are stated in section 24.');
  w();
  w('| studio input | as typed | in the engine\'s units |');
  w('| --- | --- | --- |');
  [['temperature', byKey.tC.typed, `${e6(byKey.tC.value)} C`],
    ['pressure', byKey.pTotalBar.typed, `${e6(byKey.pTotalBar.value)} bar`],
    ['CO2', byKey.co2MolFrac.typed, `${e6(byKey.co2MolFrac.value)} mole fraction`],
    ['H2S', byKey.h2sMolFrac.typed, `${e6(byKey.h2sMolFrac.value)} mole fraction`],
    ['in-situ pH', byKey.ph.typed, `${e6(byKey.ph.value)}`],
    ['velocity', byKey.velocityMS.typed, `${e6(byKey.velocityMS.value)} m/s`],
    ['line inside diameter', byKey.diameterM.typed, `${e6(byKey.diameterM.value)} m`],
    ['density', byKey.densityKgM3.typed, `${e6(byKey.densityKgM3.value)} kg/m3`],
    ['viscosity', byKey.viscosityPaS.typed, `${e6(s19.viscosityMPaS)} mPa s`],
    ['wetting regime', byKey.flowRegime.typed, byKey.flowRegime.value],
    ['water cut', byKey.waterCutFrac.typed, `${e6(byKey.waterCutFrac.value)}`],
    ['inhibitor efficiency', byKey.inhibitorEfficiencyPct.typed, `${e6(byKey.inhibitorEfficiencyPct.value)}`],
    ['inhibitor availability', byKey.inhibitorAvailabilityPct.typed, `${e6(byKey.inhibitorAvailabilityPct.value)}`],
    ['corrosion allowance', byKey.corrosionAllowanceMm.typed, `${e6(byKey.corrosionAllowanceMm.value)} mm`],
    ['consumed', byKey.consumedMm.typed, `${e6(byKey.consumedMm.value)} mm`],
    ['design life', byKey.designLifeYears.typed, `${e6(byKey.designLifeYears.value)} yr`],
  ].forEach(([a, b, c]) => w(`| ${a} | ${b} | ${c} |`));
  w();
  w('| what the screen shows | value |');
  w('| --- | --- |');
  [['CO2 partial pressure', `${e6(s19.pco2Bar)} bar`], ['fugacity coefficient', e6(s19.fugacityCoefficient)],
    ['CO2 fugacity', `${e6(s19.fco2Bar)} bar`], ['reaction term', `${e6(s19.reactionMmYr)} mm/yr`],
    ['mass-transfer term', `${e6(s19.massTransferMmYr)} mm/yr`], ['combined', `${e6(s19.combinedMmYr)} mm/yr`],
    ['controlling', s19.controlling], ['controlling margin', e6(s19.controllingMargin)],
    ['scale factor', e12(s19.scaleFactor)], ['computed film onset', `${e6(s19.scaleOnsetTC)} C`],
    ['pH factor', e6(s19.phFactor)], ['pH reference', e6(s19.phReference)],
    ['water wetting factor', e6(s19.waterWettingFactor)],
    ['uninhibited rate', `${e6(s19.uninhibitedMmYr)} mm/yr, which is ${e6(L.mpy(s19.uninhibitedMmYr))} mpy`],
    ['effective inhibition', `${e6(s19.effectiveInhibitionPct)} percent`],
    ['inhibitor shortfall', `${e6(s19.inhibitorShortfallPp)} percentage points`],
    ['RATE', `${e6(s19.rateMmYr)} mm/yr, which is ${e6(L.mpy(s19.rateMmYr))} mpy`],
    ['rate with the film credit kept', `${e6(s19.rateWithFilmCreditMmYr)} mm/yr`],
    ['category', `${s19.category}, and \`categoryHeld\` is ${S(s19.categoryHeld)}`],
    ['Reynolds', r4(s19.reynolds)], ['friction branch', s19.branch],
    ['wall shear', `${e6(s19.tauPa)} Pa`], ['film risk', s19.filmRisk],
    ['film stripped', S(s19.filmStripped)],
    ['H2S partial pressure', `${e6(s19.ph2sBar)} bar, which is ${e6(s19.ph2sPsia)} psia`],
    ['above the sour threshold', S(s19.sour)], ['decades above it', e6(s19.decadesAboveThreshold)],
    ['severity region', 'NOT PROVIDED'], ['material guidance', 'NOT PROVIDED'],
    ['H2S to CO2 ratio', e12(s19.h2sToCo2Ratio)], ['regime', s19.regime],
    ['the rate is an upper bound', S(s19.rateIsUpperBound)],
    ['remaining allowance', `${e6(s19.remainingMm)} mm`],
    ['remaining life', `${e6(s19.remainingYears)} yr`],
    ['allowance the design life demands', `${e6(s19.requiredAllowanceMm)} mm`],
    ['shortfall', `${e6(s19.shortfallMm)} mm`], ['meets the design life', S(s19.meetsDesignLife)],
    ['BINDING CONSTRAINT', s19.bindingWhat], ['and the value it turns on', s19.bindingValueLabel],
  ].forEach(([a, b]) => w(`| ${a} | ${b} |`));
  w();
  w('THE WARNING ON THAT SCREEN, verbatim:');
  w();
  w(`> ${s19.warning}`);
  w();
  w('AND THE BINDING CONSTRAINT, verbatim:');
  w();
  w(`> ${s19.bindingWhy}`);
  w();
  w('FIVE CHANGES TO THAT ONE CASE, each of which reaches a different part of the module:');
  w();
  w('| change | rate mm/yr | category | remaining life yr | what else moved |');
  w('| --- | --- | --- | --- | --- |');
  s19.changes.forEach((c) => {
    w(`| ${c.label} | ${e6(c.rateMmYr)} | ${c.category === null ? 'WITHHELD' : c.category} | ${c.remainingYears === null ? 'WITHHELD' : e6(c.remainingYears)} | ${c.bindingWhat} |`);
  });
  w();
  w(`AT 60 FT PER SECOND the wall shear is ${e6(s19.fastTauPa)} Pa against the measured stripping threshold of ${e6(s19.filmStripPa)} Pa, the film risk is ${s19.fastFilmRisk}, the credit is removed, and the rate is ${e6(s19.fastRateMmYr)} mm/yr against a credited ${e6(s19.fastCreditedMmYr)} mm/yr. The ratio between those two is ${e6(s19.fastRatio)}, and the remaining life falls from ${e6(s19.remainingYears)} yr to ${e6(s19.fastRemainingYears)} yr.`);
  w();
  w(`AT 1 MOL PERCENT H2S the ratio is ${e12(s19.sourRatio)}, the regime is ${s19.sourRegime}, and the rate is unchanged at ${e6(s19.sourRateMmYr)} mm/yr. That last fact is the lesson: the CO2 rate does not move with H2S at all, because H2S is not in the correlation. What changes is that the category and the life are now WITHHELD and the rate is kept only as a stated upper bound of ${e6(s19.sourUpperBoundMmYr)} mm/yr.`);
  w();
  w(`AT pH 4.0, which is the reference and the boundary, the rate is ${e6(s19.ph4RateMmYr)} mm/yr against ${e6(s19.rateMmYr)} mm/yr at the shipped 4.5. Below 4.0 the engine refuses. A learner should be able to say why those two facts belong together.`);
  w();
  w('EVERY RATE ON THAT SCREEN NOW CARRIES MPY BESIDE MM/YR, because every input on it is in field units. The conversion is a division by 25.4 and a multiplication by a thousand, and it is stated rather than assumed:');
  w();
  w('| quantity | mm/yr | mpy |');
  w('| --- | --- | --- |');
  s19.mpyRows.forEach((r) => w(`| ${r.label} | ${e6(r.mmYr)} | ${e6(r.mpy)} |`));
  w();
  w(`AND THE SAME CASE WITH A CONSUMED DEPTH TYPED IN, because the shipped case consumes ${e6(byKey.consumedMm.value)} mm and at that depth two of these four fields cannot be told apart by reading them. Type ${e6(s19.consumedProbeMm)} mm of consumed depth into the box, which is 0.05 in against the studio's own 0.125 in allowance, and change nothing else:`);
  w();
  w('| field | at the shipped defaults | with 0.05 in consumed | did it move |');
  w('| --- | --- | --- | --- |');
  s19.consumedRows.forEach((r) => w(`| ${r.label} | ${e6(r.base)} | ${e6(r.withConsumed)} | ${r.moved ? 'yes' : 'no'} |`));
  w();
  w(`THE FIELD THAT DID NOT MOVE IS THE ONE THAT IGNORES WHAT HAS ALREADY GONE. The allowance the design life demands is the rate times the design life and nothing else, so it is the allowance a NEW line would need and it stays at ${e6(s19.consumedRequiredAllowanceMm)} mm at both depths. The remaining allowance and the remaining life fall with the consumed depth, and the shortfall rises by ${e6(s19.consumedShortfallRiseMm)} mm, which is EXACTLY the consumed depth typed in. This generator asserts both of those on every rebuild. The rate is unchanged at ${e6(s19.consumedRateMmYr)} mm/yr, because the consumed depth reaches none of the rate chain. The binding constraint is still ${s19.consumedBindingWhat}, and the engine's own sentence for it now reads:`);
  w();
  w(`> ${s19.consumedBindingWhy}`);
  w();

  /* ------------------------------------------------------------ SECTION 20 */
  const s20 = L.goldenDiscrimination();
  start();
  w('# SECTION 20: What the vendored cases can and cannot discriminate (owned by Expert m01 l05 and m05 l02)');
  w();
  w(`The vendored golden carries ${s20.rows} rows in ${s20.blocks} blocks and NOT ONE OF THEM IS PUBLISHED. \`provenance.published\` is ${S(s20.published)}, and the file says why in its own words, quoted in this digest's header. There is no published de Waard-Milliams case, no clause of either sour-service standard and no corrosion rate-band table anywhere in this repository, so a number recalled from memory would be the only alternative and that is not a published datum.`);
  w();
  w('| block | rows | what it covers |');
  w('| --- | --- | --- |');
  s20.blockRows.forEach((b) => w(`| \`${b.block}\` | ${b.rows} | ${b.note} |`));
  w();
  w('THE GOLDEN IS THE ORACLE\'S ANSWER AND THE ENGINE IS A SECOND DERIVATION, so agreement is a RESULT WITH A SIZE and this digest prints the size. Below, every one of the seventeen whole cases, engine against golden, with the relative difference in its own column:');
  w();
  w('| case | golden rate mm/yr | engine rate mm/yr | relative difference, tolerance 1e-3 | golden combined | engine combined | relative difference, tolerance 1e-9 |');
  w('| --- | --- | --- | --- | --- | --- | --- |');
  s20.cases.forEach((c) => {
    w(`| ${c.index} | ${e6(c.goldenRateMmYr)} | ${e6(c.engineRateMmYr)} | ${expo(c.rateRel)} | ${e6(c.goldenCombinedMmYr)} | ${e6(c.engineCombinedMmYr)} | ${expo(c.combinedRel)} |`);
  });
  w();
  w('WHAT THE ROUTES BEHIND THOSE NUMBERS ACTUALLY PROVE, and what they cannot. The oracle\'s work is split three ways and the file says which is which. Section 25 item five is the reason that split exists.');
  w();
  w('| route | independent because | cannot check |');
  w('| --- | --- | --- |');
  s20.routes.forEach(([a, b, c]) => w(`| ${a} | ${b} | ${c} |`));
  w();
  w('THE MOLE-FRACTION ROUTE IS THE ONE THAT EARNS ITS KEEP, and section 13 is the proof. It catches an H2S partial pressure built from the total pressure with the mole fraction dropped, and an H2S partial pressure fed a fugacity where the partial pressure belongs. Neither could ever be caught by writing the engine\'s own ratio out again.');
  w();
  w('WHAT NO CASE IN THIS FILE CAN DISCRIMINATE, named here rather than left to be discovered: every held constant in section 3. A case generated by an oracle that shares a constant with the engine cannot test that constant, whatever tolerance it is checked at. The PINS are what carry those, and a pin is a comparison against a third copy rather than a validation against a source.');
  w();

  /* ------------------------------------------------------------ SECTION 21 */
  const s21 = L.heldItems();
  start();
  w('# SECTION 21: What is HELD, what is NOT PROVIDED, and what this course therefore never grades (owned by Expert m01, and read by every writer before the first lesson)');
  w();
  w(`The engine exports its own list. \`HELD_FOR_LITERATURE\` carries ${s21.heldCount} items, \`screen\` returns them in \`limits\`, and the studio prints them behind a disclosure. Verbatim, in the engine's order:`);
  w();
  s21.held.forEach((s, i) => w(`${i + 1}. ${s}`));
  w();
  w('AND THE ONE WITHDRAWAL, which is not on that list because it is not held pending a source. It is gone: the sour-service severity region and the material guidance that went with it. Section 2 is the whole of it.');
  w();
  w('WHAT THAT MEANS FOR THE EIGHTEEN GRADED CAPSTONE FIELDS. Not one of them is a corrosion rate the correlation produced. None is a band label; none is a threshold verdict; and none is a region or a material. The three capstones grade four things:');
  w();
  w('| what is graded | why it is clear of every held item |');
  w('| --- | --- |');
  s21.gradedGroups.forEach(([a, b]) => w(`| ${a} | ${b} |`));
  w();
  w('AND THE SCALE-FACTOR QUESTION IS CLEARED BY AN IDENTITY. Every capstone scenario is below its own computed film onset, so its scale factor is exactly one, so whether that factor belongs on the reaction term or on the combined rate cannot move any number in any of the three capstones. Multiplying by one in either place gives the same double.');
  w();
  w('FOUR THINGS THIS MODULE IS ASKED FOR AND DOES NOT HAVE. It is called a Corrosion & Integrity studio, and a learner will look for all four: an inspection interval, a minimum thickness, a retirement thickness and a fitness-for-service assessment. Producing any of them means adopting a standard this module does not carry. They are in `NOT_PROVIDED`, the studio lists them, and this course teaches the word integrity narrowly: the integrity arithmetic here is an allowance divided by a rate, and that is all it is.');
  w();
  w('| what a reader will look for | what the engine has | what it does not have |');
  w('| --- | --- | --- |');
  s21.absences.forEach(([a, b, c]) => w(`| ${a} | ${b} | ${c} |`));
  w();
  w('THREE SUITE APPS TAKE A CORROSION ALLOWANCE AND DO NOT KNOW ABOUT EACH OTHER. This studio CONSUMES an allowance to give a life. The pipeline and line sizing studio ADDS one to a pressure-containing wall. The storage tank studio ADDS one to a shell course. The wall this studio is eating is not the wall either of those sized, there is no link between them and no minimum thickness anywhere. That is recorded, it is stated in the studio\'s help, and it is deliberately not wired up: a link between three apps is a design decision.');
  w();

  /* ------------------------------------------------------------ SECTION 22 */
  const s22 = L.vocabularyCollisions();
  start();
  w('# SECTION 22: THREE VOCABULARY COLLISIONS, LEGISLATED HERE BEFORE ANY LESSON IS WRITTEN (binding on every writer in this wave, and on every reviewer)');
  w();
  w('A sibling course shipped one word carrying three different quantities and it had to be gated out afterwards. These three collisions are named now, with the rule for each, so no writer meets one without knowing it is a collision. The rule is BINDING: a lesson, a bank question, a key truth or a panel string that breaks one of these is a defect and the copy gate catches it.');
  w();
  w('| the word | what it already means elsewhere in the Academy | what it means HERE | THE RULE |');
  w('| --- | --- | --- | --- |');
  s22.collisions.forEach(([a, b, c, d]) => {
    const here = c === null
      ? `this module's own Fanning friction factor, on a two-branch Blasius form switching at Reynolds ${e6(s22.switchRe)}, used only to reach a wall shear`
      : c;
    w(`| ${a} | ${b} | ${here} | ${d} |`);
  });
  w();
  w(`THE THIRD COLLISION IS NOT A NAMING PROBLEM, IT IS A REAL DISAGREEMENT. Two modules on one platform compute a friction factor for the same pipe with different correlations. The engine says so in its own docstring. Removing the duplicate is a cross-module decision and it was deliberately left alone by the repair, so this course's job is to name the seam rather than to hide it. The measured constants of THIS module's friction factor are the Blasius pair ${e12(s22.blasiusC)} and ${e12(s22.blasiusN)}, the laminar constant ${e12(s22.laminarC)} and the switch at Reynolds ${e6(s22.switchRe)}, all four HELD and all four pinned in section 3.`);
  w();
  w('AND TWO MORE WORDS THAT ARE NOT COLLISIONS BUT ARE MISREADINGS:');
  w('| the word | the misreading | the rule |');
  w('| --- | --- | --- |');
  s22.misreadings.forEach(([a, b, c]) => w(`| ${a} | ${b} | ${c} |`));
  w();

  /* ------------------------------------------------------------ SECTION 23 */
  const s23 = L.scopeSeams();
  start();
  w('# SECTION 23: The scope seams. What to CITE rather than teach, and the one course that points at this one (binding on every writer)');
  w();
  w('Five quantities in this course\'s neighbourhood are already owned by a live course. A lesson that re-derives an owned quantity teaches a second answer to a settled question. CITE THE OWNER, state what this module does differently, and stop.');
  w();
  w('| quantity | owned by | what to say here |');
  w('| --- | --- | --- |');
  s23.seams.forEach(([a, b, c]) => w(`| ${a} | ${b} | ${c} |`));
  w();
  w('AND ONE COURSE POINTS AT THIS ONE. The Well Integrity and P&A course in the Drilling module is about barrier envelopes and abandonment, and it EXPLICITLY REFUSES corrosion: it states in its own scope that it carries no corrosion model, no wall loss and no remaining life. FC9 fills exactly that refusal. A lesson here may name it as the course that owns barrier logic, and must not borrow its vocabulary: a barrier envelope is not a corrosion allowance.');
  w();
  w('WHAT HAS NEVER BEEN TAUGHT ANYWHERE IN THE ACADEMY, and is therefore this course\'s own ground: the de Waard-Milliams correlation, iron carbonate and its protective film, sour-service screening, sulphide stress cracking and hydrogen induced cracking as NAMED ABSENCES, pitting as a named absence, in-line inspection, non-destructive testing, and fitness-for-service as a named absence. None of those words appears in any live course.');
  w();

  /* ------------------------------------------------------------ SECTION 24 */
  const s24 = L.unitsAndTruncation();
  start();
  w('# SECTION 24: Units. The studio\'s field units, the engine\'s correlation units, and one factor that is truncated (owned by Associate m01 l05)');
  w();
  w('The engine works in the units the correlations are published in: temperature in degrees Celsius, pressures in bar, rates in millimetres a year, velocity in metres a second, diameter in metres, density in kilograms a cubic metre and viscosity in pascal seconds. The studio takes Fahrenheit, psig, mol percent, feet a second, inches, pounds a cubic foot and centipoise, and converts. The conversions are the studio\'s own and they are listed here because a learner reading a number off the app needs to know which layer produced it.');
  w();
  w('| studio field | the studio\'s conversion | the engine\'s unit |');
  w('| --- | --- | --- |');
  s24.conversions.forEach(([a, b, c]) => w(`| ${a} | ${b} | ${c} |`));
  w();
  w(`ONE OF THOSE FACTORS IS TRUNCATED, AND THE ENGINE'S OWN IS CLOSE TO EXACT WITHOUT BEING EXACT. The studio divides a psig pressure by 14.5038 to reach bar. The engine exports ${e12(s24.barPsiaEngine)}, measured here out of the psia the engine reports for a 1 bar partial pressure. Rebuilt from the definitions of the pound (0.45359237 kg), standard gravity (9.80665 m/s2), the inch (0.0254 m) and the bar (100000 Pa), the factor is ${e12(s24.barPsiaByDefinition)}, so the engine's value sits above the definitions by ${expo(s24.engineOverDefinition)} as a fraction. The engine's own comment calls its factor exact by definition, and it is not; the gap is far below anything this course grades at. The studio's divisor is larger than the engine's factor by ${expo(s24.divisorFraction)} as a fraction, so a pressure converted through the studio and a pressure converted through the engine's own factor differ in the sixth significant figure.`);
  w();
  w(`WHAT THAT IS WORTH, measured rather than argued. The shipped defaults through the studio's divisor give a total pressure of ${e12(s24.studioPTotalBar)} bar and a rate of ${e12(s24.studioRateMmYr)} mm/yr. Through the engine's factor they give ${e12(s24.enginePTotalBar)} bar and ${e12(s24.engineRateMmYr)} mm/yr. The two rates differ by ${expo(s24.rateFraction)} as a fraction, which is far below anything a screening decision turns on and far above zero.`);
  w();
  w('THIS IS WHY NO GRADED FIELD IN THIS COURSE IS CONVERTED THROUGH THE STUDIO. The three capstones state their conditions in the ENGINE\'S units, and they say so on the page. Grading a learner on which rounding the app happened to use would grade them on the app rather than on corrosion, and the difference is large enough to fail a tolerance while being far too small to matter to an engineer. A capstone that did that would be measuring the wrong thing on purpose.');
  w();
  w(`AND THE SAME ROUNDING HABIT MEETS A THRESHOLD. A sour threshold of 0.05 psia is a figure people carry around, and the one this engine uses is ${e12(s24.sourPsia)} psia; a threshold of exactly 0.05 psia would be ${e12(s24.claimedSourPsiaAsBar)} bar, which is ${e6(s24.belowThresholdPct)} percent below the threshold the engine actually uses. The engine derives and prints both numbers, and the vendored gate asserts the psia value is not 0.05.`);
  w();

  /* ------------------------------------------------------------ SECTION 25 */
  const s25 = L.repairHistory();
  const census = L.standardNameCensus(ENGINE_SRC);
  const historyMarkers = L.countHistoryMarkers(ENGINE_SRC);
  const historyLines = L.countHistoryComments(ENGINE_SRC);
  start();
  w('# SECTION 25: WHAT THIS ENGINE USED TO DO. THIS SECTION IS REPAIR HISTORY, and nothing follows it (owned by Expert m06)');
  w();
  w('# THIS SECTION, AND ONLY THIS SECTION, DESCRIBES BEHAVIOUR THIS ENGINE NO LONGER HAS. Every sentence above this line is about the engine as it ships today. Every sentence below is about what it did before the repair that preceded this course, and each item is a GENERAL LESSON that happens to have an example here. A sentence about former behaviour that reads as current behaviour is a defect, and the frame for this material is this heading and this paragraph.');
  w();
  w(`- THE ENGINE SOURCE CARRIES THIS HISTORY IN ITS COMMENTS, and a sentence lifted out of a comment arrives with no frame around it. Counted by reading engines/facilities/corrosion.js: ${historyMarkers} comment lines carry the repair marker, and ${historyLines} comment lines are written in a past tense about former behaviour. The rule that counted them: a line that begins with a comment marker and contains one of "used to", "previous version", "earlier version", "before", "no longer", "silently" or "would have".`);
  w(`- The module is ${census.lines} lines long, so roughly one line in ${Math.round(census.lines / Math.max(historyLines, 1))} of it is a sentence about what it used to do. Engine source comments are PROVENANCE. So are the wave recon and findings reports, and so is the repair's own findings record vendored beside the oracle. None of the four is teaching truth.`);
  w();
  w('# ITEM ONE. THE HEADLINE. AN INVENTED CURVE WEARING SOMEBODY ELSE\'S AUTHORITY.');
  w('- The general lesson, and it is the largest one in this course: a calculation can be wrong in a way that no amount of measurement repairs, because the number was never the claim. If a curve is labelled with a standard\'s name, the claim is "this is what the standard says". Retuning the curve does not make that true. The only honest repair is to withdraw the claim and say the thing is not provided.');
  w('- Before the repair this engine computed a sour-service severity region from an expression of its own, labelled it with two standards, and served three named material recommendations off it: what steel to buy, when to control hardness, and when to qualify weldments. Three measurements show what the expression was worth. Moving its pH pivot by a whole unit left the validation suite entirely green. Widening one of its region boundaries by a factor of two left the suite green. A missing pH made the expression not-a-number, both of its comparisons failed, and it fell through to the HARDEST material recommendation in the file from an input nobody had supplied.');
  w(`- Today the function is gone, nothing replaces it, and section 2 is the current statement of that absence. The absence is a FIELD rather than a missing value: \`regionProvided\` is ${S(s25.regionProvided)} and \`materialGuidanceProvided\` is ${S(s25.materialGuidanceProvided)}, so a caller cannot read the gap as an unset property. The threshold value the screen still uses stayed exactly where it was, because changing a live number without a source is the same mistake with the sign flipped.`);
  w();
  w('# ITEM TWO. AN INPUT THAT MOVED NOTHING, BESIDE A SCREEN THAT SAID IT MATTERED.');
  w('- The general lesson: when one input reaches the answer by two routes and the route that decides the headline ignores it, the box on the screen is decoration. The test is arithmetic and it takes one sweep: walk the input across its range and print the spread of the answer.');
  w('- Before the repair the pH correction returned one for any pH at or below its reference, so pH 2.0, 3.0, 3.5 and 4.0 all produced the identical rate to sixteen figures. Two decades of hydrogen-ion activity moved the headline number by exactly nothing, while a second calculation on the same screen moved its answer four times across the same span. A more acid water is not a less corrosive one, so a factor of one was the least limiting possible answer to a question the module could not answer.');
  w(`- Today the rate is strictly monotonic in pH across the whole band above the reference, which section 7 measures: from ${e6(s25.firstRateMmYr)} mm/yr at pH ${e6(s25.firstPh)} down to ${e6(s25.lastRateMmYr)} mm/yr at pH ${e6(s25.lastPh)}. Below the reference the engine refuses, and the refusal names the reference so a caller can print the boundary.`);
  w();
  w('# ITEM THREE. AN ABSENT INPUT GIVEN ITS LEAST LIMITING VALUE.');
  w('- The general lesson: every absent input has a value that makes the answer look best, and a calculation that supplies that value has answered a question nobody asked. The shape to look for is a function that returns infinity, zero or one where it should return nothing.');
  w('- Before the repair a blank velocity or a blank line diameter made the mass-transfer term INFINITE. An infinite transport capacity makes the series combination exactly equal the reaction term, so the engine then named reaction kinetics as the controlling mechanism from an input that had never been supplied, and the rate came out several times the correct one. A blank temperature made the fugacity not-a-number, which failed a greater-than test, which sent the engine down its NO-CO2 branch: a rate of zero, a negligible label in green, an unbounded life and a passing verdict, printed under a CO2 box that still read three percent.');
  w('- Today the transport term returns not-a-number rather than infinity and the vendored gate asserts it is not infinity; the whole-screen door refuses when any of six boxes is blank, and the message names the box; and a TYPED zero is treated differently from a blank, which section 18 sets out. A typed zero is a positive assertion of no CO2, so the module withholds its category and its life and says what a rate of zero means there.');
  w();
  w('# ITEM FOUR. A WARNING THAT COULD NOT FIRE AT THE APP\'S OWN DEFAULTS.');
  w('- The general lesson: a guard written with a strict comparison against a round number is switched off at exactly that number, and a shipped default sitting on the boundary is the likeliest value in the whole input space. Test a guard at the default before testing it anywhere else.');
  w('- Before the repair the inhibitor warning fired only when the efficiency was strictly greater than ninety percent. The studio shipped with an efficiency of exactly ninety. So the one lesson this module exists to teach was silent on the first screen every user saw: the studio computed the effective protection, printed it in green because the colour was chosen from the presence of a warning, and said nothing. The same guard was equally silent at ninety percent efficiency and fifty percent availability.');
  w(`- Today the warning fires on the EFFECTIVE SHORTFALL at any efficiency, with a trigger measured in section 3 at ${e6(s25.shortfallTriggerPp)} percentage points, and it states the effective figure and the metal-loss ratio in its own words. At the shipped defaults it is present, and section 19 quotes it verbatim.`);
  w();
  w('# ITEM FIVE. A VALIDATION SUITE THAT COULD NOT FAIL.');
  w('- The general lesson, in two halves. A validation case is worth what it can TELL APART, and it can be worth nothing in two different ways: it can be missing, so a route has no case at all; or it can be present and unable to discriminate, because the thing it is supposed to check is shared with whatever produced the expected answer. The second is the harder one to see, and the arithmetic of it is simple: A CONSTANT THAT LIVES IN TWO FILES CANNOT BE VALIDATED BY COMPARING THOSE TWO FILES.');
  w('- Before the repair, thirteen defects planted one at a time in this engine left its suite entirely green, including a sour threshold moved by a factor of ten and a mass-transfer coefficient moved by a sixth. Worse, fifteen of seventeen constants moved in the engine AND in the oracle together also left it green, and the oracle caught none of the seventeen, because five of its routes were the engine\'s own expressions written out again and one was the engine\'s own line rearranged algebraically. Its docstring called that an independent re-derivation.');
  w(`- Today the work is split three ways and the file says which is which: genuinely independent routes, constant-free invariants, and PINS. Section 20 lists the routes with what each one cannot check. Section 3 is the pins: ${s25.pinCount} held constants, each MEASURED out of the engine's behaviour and compared against a literal in a third file, with the golden's own copy as a fourth. Sections 5, 6, 7 and 13 are the constant-free invariants: the series residual, the factor being exactly one at its own computed onset, one decade per two pH units, and a ratio that is provably free of pressure.`);
  w();
  w('# NOTHING FOLLOWS THIS SECTION.');

  return out;
};

const buildDigest = () => `${buildSections().map((s) => s.join('\n')).join('\n')}\n`;

/** The digest on disk, split the same way the builder assembles it. */
const digestSections = () => {
  const lines = readDigest().replace(/\n$/, '').split('\n');
  const out = [];
  let cur = [];
  lines.forEach((line) => {
    if (/^# SECTION \d+:/.test(line)) { out.push(cur); cur = []; }
    cur.push(line);
  });
  out.push(cur);
  return out;
};

// ---------------------------------------------------------------------------

describe('the digest on disk and the teaching fields', () => {
  it('says which copy of the wave it read, and the digest is not empty or mid-rebuild', () => {
    const text = readDigest();
    const literals = text.match(/\d+\.\d{6}/g) || [];
    expect(literals.length, 'the digest carries too few six-decimal literals to be a whole digest').toBeGreaterThan(800);
    expect(text.split('\n').length).toBeGreaterThan(900);
    console.log(`[corrosion lab] read the wave from ${readingMirror(WAVE_NAME) ? 'the committed copy' : 'a live wave directory'}: ${waveDir(WAVE_NAME)}`);
  });

  it('the teaching streams are copied verbatim from fc9_fields.mjs, which fc9_dump.mjs imports', () => {
    const src = fs.readFileSync(FIELDS_MJS, 'utf8');
    const lab = LAB_SOURCE();
    const NAMES = ['ETELEBOU', 'KANBI', 'TUNU', 'OPUKUSHI', 'DIEBU', 'ANGIAMA', 'INTEGRITY',
      'VELOCITY_SWEEP', 'TEMPERATURE_SWEEP', 'PH_SWEEP', 'PH_REFUSALS', 'AVAILABILITY_SWEEP',
      'PRESSURE_SWEEP', 'DIAMETER_SWEEP', 'FCO2_SWEEP', 'REGIME_PAIRS', 'CATEGORY_PROBES', 'CLAMP_PROBES'];
    NAMES.forEach((name) => {
      const a = src.match(new RegExp(`^export const ${name} = ([\\s\\S]*?);$`, 'm'));
      const b = lab.match(new RegExp(`^export const ${name} = ([\\s\\S]*?);$`, 'm'));
      expect(a, `${name} in fc9_fields.mjs`).not.toBeNull();
      expect(b, `${name} in the lab`).not.toBeNull();
      expect(b[1], name).toBe(a[1]);
    });
    expect(NAMES).toHaveLength(18);
  });

  it('the shipped studio defaults are the dump\'s, field for field', () => {
    const dump = fs.readFileSync(DUMP_MJS, 'utf8');
    const block = dump.match(/const APP = Object\.freeze\(\{([\s\S]*?)\n\}\);/);
    expect(block, 'the dump no longer declares APP').not.toBeNull();
    const lab = LAB_SOURCE().match(/export const APP = Object\.freeze\(\{([\s\S]*?)\n\}\);/);
    expect(lab).not.toBeNull();
    expect(lab[1].replace(/\s+/g, ' ').trim()).toBe(block[1].replace(/\s+/g, ' ').trim());
  });

  it('the published golden is whole, every block of it', () => {
    const c = L.goldenCounts();
    expect(c.blocks).toBe(17);
    expect(c.rows).toBe(110);
    expect(c.cases).toBe(17);
    expect(L.GOLD.provenance.published).toBe(false);
    expect(Object.keys(L.GOLD.heldConstants).length).toBeGreaterThanOrEqual(28);
  });
});

describe('THE DIGEST, REBUILT FROM LAB RETURN VALUES, BYTE FOR BYTE', () => {
  const built = buildSections();
  const onDisk = digestSections();

  it('the section count matches, and the headings are the same', () => {
    expect(built.length, 'the lab rebuilds a different number of sections than the digest carries').toBe(onDisk.length);
    built.slice(1).forEach((s, i) => expect(s[0], `section ${i + 1} heading`).toBe(onDisk[i + 1][0]));
  });

  built.forEach((section, i) => {
    const title = i === 0 ? 'Preamble' : (section[0] || '').slice(0, 70);
    it(`${i === 0 ? 'Preamble' : `Section ${i}`}: ${title}`, () => {
      expect(section.join('\n')).toBe((onDisk[i] || []).join('\n'));
    });
  });

  it('the whole digest, every line, is the lab', () => {
    expect(buildDigest()).toBe(readDigest());
  });

  it('NEGATIVE CONTROL: one engine value moved by a single unit in the last printed place is a failed section', () => {
    // Section 20 prints seventeen golden cases, and its first data row carries
    // four engine numbers. Moving one digit in the last printed place of one of
    // them must make the section differ, which is what proves the comparison is
    // reading the numbers rather than the prose around them.
    const good = buildSections()[20].join('\n');
    const row = good.split('\n').find((l) => /^\| 1 \| \d/.test(l));
    expect(row, 'the golden case table lost its first row').toBeTruthy();
    const bumped = good.replace(row, row.replace(/(\d)( \|)/, (m, d, tail) => `${(Number(d) + 1) % 10}${tail}`));
    expect(bumped, 'the perturbation changed nothing, so this control proves nothing').not.toBe(good);
    expect(bumped).not.toBe((onDisk[20] || []).join('\n'));
    expect(good).toBe((onDisk[20] || []).join('\n'));
  });
});

// ---------------------------------------------------------------------------
// What the teaching readers show.
// ---------------------------------------------------------------------------

describe('what the teaching readers show', () => {
  it('there is one reader per digest section, and each returns a fresh object', () => {
    const READERS = ['engineScope', 'theWithdrawal', 'heldConstantsTable', 'fugacityAndPartialPressure',
      'twoResistances', 'protectiveFilm', 'phAndItsReference', 'waterWetting', 'inhibitorArithmetic',
      'wallShear', 'theCoupling', 'h2sThreshold', 'whichFilmGoverns', 'allowanceAndLife',
      'rateCategoryLabel', 'bindingConstraint', 'wholeScreening', 'everyRefusal', 'studioDefaults',
      'goldenDiscrimination', 'heldItems', 'vocabularyCollisions', 'scopeSeams', 'unitsAndTruncation',
      'repairHistory'];
    expect(READERS).toHaveLength(25);
    READERS.forEach((name) => {
      expect(typeof L[name], name).toBe('function');
      const a = L[name]();
      const b = L[name]();
      expect(JSON.stringify(a), name).toBe(JSON.stringify(b));
      expect(a, name).not.toBe(b);
    });
  });

  it('THE SIX STREAMS REACH SIX DIFFERENT SHAPES, measured rather than asserted in prose', () => {
    const b = L.streamBranches();
    expect(b.etelebouScaleFactor).toBe(1);
    expect(b.kanbiScaleFactor).toBeLessThan(1);
    expect(b.tunuFilmStripped).toBe(true);
    expect(b.opukushiWettingFactor).toBe(L.OPUKUSHI.waterCutFrac);
    expect(b.diebuRegime).toBe('sulphide');
    expect(b.angiamaBranch).toBe('laminar');
    expect(b.diebuCategory).toBeNull();
    expect(b.diebuLife).toBeNull();
    expect(b.distinctBindings.length).toBeGreaterThanOrEqual(3);
  });

  it('EVERY HELD CONSTANT IS MEASURED, and every measurement meets its pin', () => {
    const t = L.heldConstantsTable();
    expect(t.pins).toHaveLength(30);
    t.pins.forEach((p) => {
      const tol = L.PIN_LITERALS.find((x) => x[0] === p.label)[3];
      expect(Number.isFinite(p.measuredValue), p.label).toBe(true);
      expect(p.rel, p.label).toBeLessThan(tol);
      expect(typeof p.how, `${p.label} has no stated method`).toBe('string');
    });
    t.exportRows.forEach((r) => expect(r.rel, r.name).toBeLessThan(1e-6));
    t.goldRows.forEach((r) => {
      expect(r.present, r.goldKey).toBe(true);
      expect(r.rel, r.goldKey).toBeLessThan(1e-6);
    });
  });

  it('THE SOUR THRESHOLD IS NOT 0.05 PSIA, and the two relationships it carries are DIFFERENT NUMBERS', () => {
    const t = L.heldConstantsTable();
    const u = L.unitsAndTruncation();
    expect(t.claimedIsNotThreshold).toBe(true);
    // Section 3 takes the gap as a fraction of the SMALLER of the pair. Section
    // 24 takes it as a fraction of the threshold the engine actually uses. A
    // brief that welded one figure to the other's wording was caught by three
    // lesson writers, so the two are asserted apart here.
    expect(t.gapPctOfSmaller).not.toBe(u.belowThresholdPct);
    expect(t.gapPctOfSmaller).toBeGreaterThan(u.belowThresholdPct);
    expect(t.claimedSourPsiaAsBar).toBe(u.claimedSourPsiaAsBar);
    console.log(`[corrosion lab] the sour threshold pair: section 3 reads ${t.gapPctOfSmaller.toFixed(6)} percent `
      + `of the smaller, section 24 reads ${u.belowThresholdPct.toFixed(6)} percent below the threshold in use.`);
  });

  it('THE ONSET MOVES, and a fixed onset temperature would be wrong at every fugacity except one', () => {
    const f = L.protectiveFilm();
    expect(f.onsetSpreadC).toBeGreaterThan(90);
    f.onsets.forEach((o) => {
      expect(Math.abs(o.atOnset - 1), `the factor at the onset for fCO2 ${o.fco2Bar}`).toBeLessThan(1e-12);
      expect(o.above, `the factor above the onset for fCO2 ${o.fco2Bar}`).toBeLessThan(1);
    });
    expect(f.appScaleFactor).toBe(1);
  });

  it('THE SERIES IDENTITY HOLDS ON EVERY STREAM, which is a constant-free invariant', () => {
    L.twoResistances().rows.forEach((r) => {
      expect(r.belowBoth, r.name).toBe(true);
      expect(Math.abs(r.seriesResidual), r.name).toBeLessThan(1e-12 / r.combinedMmYr);
    });
  });

  it('ONE DECADE PER TWO pH UNITS, and the rate is strictly monotonic above the reference', () => {
    const p = L.phAndItsReference();
    expect(p.monotonic).toBe(true);
    p.decade.forEach((d) => expect(Math.abs(d.ratio - 0.1), `pH ${d.ph}`).toBeLessThan(1e-14));
    p.refusals.forEach((r) => expect(r.namesReference, `pH ${r.ph}`).toBe(true));
  });

  it('THE RATIO IS PRESSURE FREE, which is what catches a partial pressure built the wrong way', () => {
    L.whichFilmGoverns().pressureFree.forEach((p) => {
      expect(p.difference, `${p.pTotalBar} bar`).toBeLessThan(1e-15);
    });
    expect(L.whichFilmGoverns().regimeWords).toHaveLength(4);
  });

  it('THE STRIPPED RATIO IS THE RECIPROCAL OF THE RETAINED FRACTION, exactly', () => {
    const c = L.theCoupling();
    expect(Math.abs(c.tunuRatio - c.reciprocalOfRetained)).toBeLessThan(1e-12);
  });

  it('THE REINSTATING ALLOWANCE EXCEEDS the required allowance by exactly the consumed depth', () => {
    expect(L.allowanceAndLife().reinstateGapIsConsumed).toBe(true);
  });

  it('a mass-transfer term with no velocity is NaN and NOT infinity', () => {
    L.twoResistances().missing.forEach((m) => expect(m.isNaN, m.label).toBe(true));
  });

  it('no reader reads the clock or a random number: the lab source makes no Date and draws nothing', () => {
    expect(LAB_SOURCE()).not.toMatch(/new Date\(|Date\.now|Math\.random|performance\.now/);
  });
});

// ---------------------------------------------------------------------------
// THE REFUSAL GATE.
// ---------------------------------------------------------------------------

const allRefusals = () => [
  ...L.fugacityAndPartialPressure().refusals,
  ...L.wallShear().refusals,
  ...L.theCoupling().blanks,
  ...L.h2sThreshold().refusals,
  ...L.allowanceAndLife().refusals,
  ...L.wholeScreening().guards,
  ...L.everyRefusal().rows,
];

describe('THE REFUSAL GATE: every refusal is the engine\'s own returned message', () => {
  it('there are refusals to check, so a rename cannot silently empty this gate', () => {
    expect(allRefusals().length).toBeGreaterThanOrEqual(50);
  });

  it('every refusal carries a message, and the count of DISTINCT MESSAGES is measured rather than quoted', () => {
    const msgs = allRefusals().map((r) => r.error);
    msgs.forEach((m) => expect(typeof m).toBe('string'));
    const distinct = new Set(msgs);
    expect(distinct.size).toBeGreaterThanOrEqual(15);
    console.log(`[corrosion lab] ${msgs.length} refusals over the readers, ${distinct.size} distinct engine messages`);
  });

  it('NOTHING IN THIS MODULE THROWS: every probe returns rather than raising', () => {
    expect(() => allRefusals()).not.toThrow();
  });

  it('NO refusal message is written as a literal in the lab', () => {
    const src = LAB_SOURCE();
    allRefusals().forEach((r) => {
      if (r.error && r.error.length > 25) expect(src, r.error.slice(0, 40)).not.toContain(r.error.slice(0, 40));
    });
  });

  it('NO refusal message is written as a literal in a panel either', () => {
    const msgs = allRefusals().map((r) => r.error).filter((m) => m && m.length > 25);
    PANEL_FILES.forEach((f) => {
      const text = panelSource(f);
      msgs.forEach((m) => expect(text, `${f} writes an engine message as a literal`).not.toContain(m.slice(0, 40)));
    });
  });

  it('CONTROL: a probe that is accepted reports no error, so the gate is not reading every call as a refusal', () => {
    expect(L.h2sThreshold().rows.every((r) => typeof r.label === 'string')).toBe(true);
    expect(L.studioDefaults().rateMmYr).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// THE HELD GATE. The one this course exists for.
// ---------------------------------------------------------------------------

const CAPSTONE_FIELDS = JSON.parse(fs.readFileSync(FIELDS_JSON, 'utf8'));

describe('THE HELD GATE: eleven held, eight not provided, one withdrawn, and none of them graded', () => {
  it('the counts are the engine\'s own and are NAMED FOR WHAT THEY ARE', () => {
    const h = L.heldItems();
    expect(h.heldCount).toBe(11);
    expect(h.notProvidedCount).toBe(8);
    expect(h.withdrawn).toHaveLength(2);
    h.held.forEach((s) => expect(typeof s).toBe('string'));
    expect(h.notProvided.filter((s) => s.includes('withdrawn'))).toHaveLength(2);
  });

  it('THE WITHDRAWAL IS DECLARED IN TWO FIELDS, today, and the function is gone', () => {
    const w = L.theWithdrawal();
    expect(w.regionProvided).toBe(false);
    expect(w.materialGuidanceProvided).toBe(false);
    expect(w.regionFunctionKind).toBe('undefined');
    expect(w.thresholdHeld).toBe(true);
  });

  it('THE WITHDRAWAL IS COMPLETE IN THE SOURCE, and the standard names survive only in a comment', () => {
    const c = L.standardNameCensus(ENGINE_SRC);
    expect(c.withdrawnPresent, 'a withdrawn guidance string is back in the engine').toEqual([]);
    expect(c.inCode, 'a standard name reached a line of code').toEqual([]);
    expect(c.commentLines, 'the record of the withdrawal was itself erased').toBeGreaterThan(0);
    expect(L.screenTextForStandardSweep()).not.toContain('MR0175');
    expect(L.screenTextForStandardSweep()).not.toContain('15156');
  });

  it('NO GRADED CAPSTONE FIELD IS A CORROSION RATE THE CORRELATION PRODUCED', () => {
    // The three scale factors are exactly one, so the unresolved question about
    // where the protective-scale factor belongs cannot move a graded number, and
    // the two tiers that need a rate STATE it from a survey.
    const r = L.capstoneRuns();
    expect(r.aScaleFactor).toBe(1);
    expect(r.bScaleFactor).toBe(1);
    expect(r.cScaleFactor).toBe(1);
    expect(r.bMeetsDesignLife).toBe(false);
    expect(r.cMeetsDesignLife).toBe(false);
    // and the two stated survey rates are inputs rather than engine answers
    expect(L.CAPSTONE_B.surveyedUninhibitedMmYr).toBeGreaterThan(0);
    expect(L.CAPSTONE_C.surveyedUninhibitedMmYr).toBeGreaterThan(0);
  });

  it('NO GRADED ANSWER IS A HELD CONSTANT, a band edge, a threshold or a boundary', () => {
    const held = [
      L.MEASURED.fugA, L.MEASURED.fugB, L.MEASURED.fugCap, L.MEASURED.dwmA, L.MEASURED.dwmB,
      L.MEASURED.dwmN, L.MEASURED.vmC, L.MEASURED.scaleA, L.MEASURED.scaleC, L.MEASURED.scaleN,
      L.MEASURED.phSlope, L.MEASURED.phRef, L.MEASURED.blasiusC, L.MEASURED.blasiusN,
      L.MEASURED.laminarC, L.MEASURED.switchRe, L.MEASURED.filmStrip, L.MEASURED.filmModerate,
      L.MEASURED.sourBar, L.MEASURED.regCarb, L.MEASURED.regMixed, L.MEASURED.catLow,
      L.MEASURED.catMod, L.MEASURED.catHigh, L.MEASURED.ctrlMargin, L.MEASURED.shortfallTrigger,
    ];
    CAPSTONE_FIELDS.forEach(([, key, value, tol]) => {
      held.forEach((h) => {
        expect(Math.abs(value - h) > tol * 10, `${key} sits on a held constant`).toBe(true);
      });
    });
  });

  it('each panel shows the wording that marks a held quantity unverified, and none presents one as an answer', () => {
    PANEL_FILES.forEach((f) => {
      const text = panelSource(f);
      expect(text, `${f} never says HELD`).toMatch(/HELD/);
      expect(text, `${f} never says what is NOT PROVIDED`).toMatch(/NOT PROVIDED/);
    });
  });

  it('NO PANEL PRESENTS A SEVERITY REGION, A MATERIAL, AN INTERVAL OR A RETIREMENT THICKNESS', () => {
    const FORBIDDEN = [
      /severity region is/i, /recommended material/i, /select(ed)? material/i,
      /inspection interval of/i, /retirement thickness of/i, /minimum thickness of/i,
      /fit for service/i, /MR0175/, /15156/,
    ];
    [...PANEL_FILES.map((f) => [f, panelSource(f)]), ['CorrosionLearningPage.jsx', fs.readFileSync(LEARNING_PAGE, 'utf8')]]
      .forEach(([f, text]) => {
        FORBIDDEN.forEach((re) => expect(text, `${f} matches ${re}`).not.toMatch(re));
      });
  });
});

// ---------------------------------------------------------------------------
// THE VOCABULARY GATE.
// ---------------------------------------------------------------------------

describe('THE VOCABULARY GATE: three legislated collisions, over every surface a learner reads', () => {
  // THE SURFACES A LEARNER READS are the three panels and the course page. The
  // lab is swept separately and by a DIFFERENT RULE, at the end of this block,
  // because it carries the digest's own prose verbatim inside string literals
  // and the digest is the file that legislates these rules. A gate that made
  // the lab paraphrase the digest would break the byte-for-byte rebuild.
  const surfaces = () => [
    ...PANEL_FILES.map((f) => [f, panelSource(f)]),
    ['CorrosionLearningPage.jsx', fs.readFileSync(LEARNING_PAGE, 'utf8')],
  ];

  it('there are surfaces to sweep, so a rename cannot empty this gate', () => {
    expect(surfaces()).toHaveLength(4);
    surfaces().forEach(([f, t]) => expect(t.length, f).toBeGreaterThan(500));
  });

  it('NEVER BARE "inhibitor": every use is "corrosion inhibitor" or an engine field name', () => {
    surfaces().forEach(([file, text]) => {
      const bare = text.split('\n')
        .map((line, i) => [i + 1, line])
        // an engine field or argument name is code and not copy
        .filter(([, line]) => /inhibitor/i.test(line))
        .filter(([, line]) => {
          const stripped = line
            .replace(/corrosion inhibitor/gi, ' ')
            .replace(/inhibitorEfficiencyPct|inhibitorAvailabilityPct|inhibitorFilmIntact|inhibitorShortfallPp|inhibitorArithmetic|InhibitorIntegrityExplorer|fc-inhibitor-integrity-explorer|INHIBITOR_SHORTFALL_PP/g, ' ');
          return /inhibitor/i.test(stripped);
        });
      expect(bare.map(([n2, l]) => `${file}:${n2} ${l.trim().slice(0, 90)}`), `${file} writes bare "inhibitor"`).toEqual([]);
    });
  });

  it('NEVER BARE "erosion": every use is "mechanical erosion" or "erosional wall loss", and carries the absence', () => {
    surfaces().forEach(([file, text]) => {
      const bare = text.split('\n')
        .filter((line) => /erosi/i.test(line))
        .map((line) => line
          .replace(/mechanical erosion/gi, ' ')
          .replace(/erosional wall loss/gi, ' ')
          .replace(/erosional-velocity|erosional velocity/gi, ' '))
        .filter((line) => /erosi/i.test(line));
      expect(bare, `${file} writes bare "erosion"`).toEqual([]);
      if (/erosi/i.test(text)) {
        expect(text, `${file} names erosion without the absence`).toMatch(/no erosional[- ]velocity criterion/i);
      }
    });
  });

  it('EVERY friction factor and Reynolds number is labelled as THIS MODULE\'S, and names the other owner', () => {
    [...PANEL_FILES.map((f) => [f, panelSource(f)])].forEach(([file, text]) => {
      if (/friction factor|Reynolds number/i.test(text)) {
        expect(text, `${file} does not label the friction factor as this module's`).toMatch(/this module's (friction factor|Reynolds number)/i);
        expect(text, `${file} does not name the line sizing course`).toMatch(/Line Sizing/i);
      }
    });
  });

  it('THE LAB\'S OWN BARE USES ARE THE DIGEST\'S WORDS, every one of them', () => {
    // The rule for the lab is not an exemption. Every line of it that carries a
    // bare "inhibitor" or a bare "erosi" must carry that word inside a string
    // literal the DIGEST ITSELF contains, so the lab can quote the teaching
    // truth and can invent nothing. A line that fails is named.
    const src = LAB_SOURCE();
    const digest = readDigest();
    const bareInhibitor = (line) => /inhibitor/i.test(line
      .replace(/corrosion inhibitor/gi, ' ')
      // GOLDEN_BLOCK_NOTE is keyed by the GOLDEN'S OWN block names, so the
      // bare `inhibitor:` at the head of that row is the name of a block in a
      // vendored file. It is code, the same class the backticked row already is.
      .replace(/^\s*inhibitor:/, ' ')
      .replace(/inhibitorEfficiencyPct|inhibitorAvailabilityPct|inhibitorFilmIntact|inhibitorShortfallPp|inhibitorArithmetic|inhibitorClamps|INHIBITOR_SHORTFALL_PP/g, ' '));
    const bareErosion = (line) => /erosi/i.test(line
      .replace(/mechanical erosion/gi, ' ')
      .replace(/erosional wall loss/gi, ' '));
    const offenders = src.split('\n')
      .map((line, i) => [i + 1, line])
      .filter(([, line]) => bareInhibitor(line) || bareErosion(line));
    expect(offenders.length, 'the lab quotes no digest line carrying either word, so this check is vacuous')
      .toBeGreaterThan(0);
    const unquoted = offenders.filter(([, line]) => {
      const literals = [...line.matchAll(/'((?:[^'\\]|\\.)*)'/g)].map((m) => m[1].replace(/\\'/g, "'"));
      return !literals.some((s) => (bareInhibitor(s) || bareErosion(s)) && digest.includes(s));
    });
    expect(unquoted.map(([n2, l]) => `corrosionLab.js:${n2} ${l.trim().slice(0, 90)}`),
      'a bare vocabulary use in the lab that the digest does not carry verbatim').toEqual([]);
    console.log(`[corrosion lab] ${offenders.length} lab lines carry a bare legislated word, and every one of them is `
      + 'a string the teaching digest carries verbatim.');
  });

  it('the legislated rules are the digest\'s own, read through the lab', () => {
    const v = L.vocabularyCollisions();
    expect(v.collisions).toHaveLength(3);
    expect(v.collisions[0][3]).toMatch(/ALWAYS write "corrosion inhibitor"/);
    expect(v.collisions[1][3]).toMatch(/ALWAYS write "mechanical erosion"/);
    expect(v.misreadings).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
// THE CLOCK GATE.
// ---------------------------------------------------------------------------

const READER_NAMES = ['engineScope', 'theWithdrawal', 'heldConstantsTable', 'fugacityAndPartialPressure',
  'twoResistances', 'protectiveFilm', 'phAndItsReference', 'waterWetting', 'inhibitorArithmetic',
  'wallShear', 'theCoupling', 'h2sThreshold', 'whichFilmGoverns', 'allowanceAndLife',
  'rateCategoryLabel', 'bindingConstraint', 'wholeScreening', 'everyRefusal', 'studioDefaults',
  'goldenDiscrimination', 'heldItems', 'vocabularyCollisions', 'scopeSeams', 'unitsAndTruncation',
  'repairHistory'];

describe('THE CLOCK GATE: no reader reads the system date', () => {
  afterEach(() => { vi.useRealTimers(); });

  const snapshot = () => JSON.stringify(READER_NAMES.map((n2) => [n2, L[n2]()]));

  it('identical output under two faked system dates, one long before FC9 and one far after', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('1994-03-01T00:00:00Z'));
    const early = snapshot();
    vi.setSystemTime(new Date('2099-12-31T23:59:59Z'));
    const late = snapshot();
    expect(late).toBe(early);
    expect(early.length).toBeGreaterThan(10000);
  });

  it('CONTROL: the fake clock did move', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('1994-03-01T00:00:00Z'));
    const a = Date.now();
    vi.setSystemTime(new Date('2099-12-31T23:59:59Z'));
    expect(Date.now()).toBeGreaterThan(a);
  });

  it('CONTROL: there is no dated or seeded surface to fake, and the stripper carries its own control', () => {
    const strip = (t) => t.replace(/\/\*[\s\S]*?\*\//g, ' ').split('\n').map((l) => l.replace(/\/\/.*$/, '')).join('\n');
    // the stripper's own control: a comment carrying the word is removed, and a
    // line of code carrying it is not.
    expect(strip('// new Date() in a comment\nconst x = 1;')).not.toMatch(/new Date/);
    expect(strip('const d = new Date();')).toMatch(/new Date/);
    const code = strip(LAB_SOURCE());
    expect(code).not.toMatch(/new Date\(|Date\.now|Math\.random|process\.env/);
    PANEL_FILES.forEach((f) => {
      expect(strip(panelSource(f)), f).not.toMatch(/new Date\(|Date\.now|Math\.random/);
    });
  });
});

// ---------------------------------------------------------------------------
// THE TIMEZONE GATE.
// ---------------------------------------------------------------------------

const TZ_CHILD_TZ = 'America/Los_Angeles';

describe('THE TIMEZONE GATE: the digest rebuilds byte for byte west of Greenwich', () => {
  it(`the whole rebuild under TZ=${TZ_CHILD_TZ} is the digest, byte for byte`, () => {
    const child = execFileSync(
      process.execPath,
      ['--experimental-vm-modules', path.join(ROOT, 'node_modules/vitest/vitest.mjs'), 'run',
        'src/components/course/panels/corrosion/corrosionLab.test.js',
        '-t', 'the whole digest, every line, is the lab'],
      {
        cwd: ROOT,
        encoding: 'utf8',
        env: { ...process.env, TZ: TZ_CHILD_TZ, LC_ALL: 'C', FC9_TZ_CHILD: '1' },
        timeout: 300000,
      },
    );
    expect(child, 'the rebuild is not byte-identical west of Greenwich').toMatch(/1 passed/);
  }, 300000);
});

// ---------------------------------------------------------------------------
// The capstone.
// ---------------------------------------------------------------------------

describe('the three capstone lines reproduce fields.json exactly', () => {
  it('fields.json is the eighteen published fields, six per tier, in the published order', () => {
    expect(CAPSTONE_FIELDS).toHaveLength(18);
    expect(CAPSTONE_FIELDS.map((x) => x[0])).toEqual([
      ...Array(6).fill('beginner'), ...Array(6).fill('intermediate'), ...Array(6).fill('advanced'),
    ]);
  });

  it('every one of the eighteen graded answers is EXACTLY the published value', () => {
    const built = L.capstoneFields();
    expect(built).toHaveLength(18);
    built.forEach(([tier, key, value], i) => {
      const [pTier, pKey, pValue] = CAPSTONE_FIELDS[i];
      expect(tier, `${key} tier`).toBe(pTier);
      expect(key, `field ${i}`).toBe(pKey);
      expect(value, `${key} value`).toBe(pValue);
    });
    expect(L.capstoneValues()).toEqual(Object.fromEntries(CAPSTONE_FIELDS.map(([, k, v]) => [k, v])));
  });

  it('THE LAB HOLDS NO GRADING TOLERANCE: gradedTolerance.js is the one place a band is made', () => {
    // A tolerance in three places that must agree is how two sibling waves
    // shipped a stale one. The lab's rows are TRIPLES, so there is nothing here
    // to go stale, and the lab exports nothing with "tolerance" in its name.
    L.capstoneFields().forEach((row, i) => expect(row, `field ${i} carries a tolerance`).toHaveLength(3));
    expect(Object.keys(L).filter((k) => /tolerance|tol$/i.test(k)), 'the lab exports a tolerance').toEqual([]);
    expect(LAB_SOURCE()).toContain('THIS LAB HOLDS NO GRADING TOLERANCE');
    // and no literal in the lab is one of the published bands
    const bands = [...new Set(CAPSTONE_FIELDS.map((f) => f[3]))];
    expect(bands.length).toBeGreaterThan(1);
    const src = LAB_SOURCE();
    bands.forEach((b) => {
      expect(src, `the lab spells the grading band ${b}`).not.toContain(`${b}`);
    });
    CAPSTONE_FIELDS.forEach(([tier, key, , tol]) => {
      expect(Number.isFinite(tol), `${tier}/${key} tolerance`).toBe(true);
      expect(tol, `${tier}/${key} tolerance`).toBeGreaterThan(0);
    });
  });

  it('the capstone conditions are the wave generator\'s, field for field', () => {
    const src = fs.readFileSync(CAPSTONE_MJS, 'utf8');
    const bodies = [...src.matchAll(/const (OBIGBO|NEMBE|SOKU) = Object\.freeze\(\{([\s\S]*?)\n\}\);/g)]
      .map((m) => m[2]);
    expect(bodies, 'the capstone generator no longer declares three frozen plants').toHaveLength(3);
    [L.CAPSTONE_A, L.CAPSTONE_B, L.CAPSTONE_C].forEach((obj, i) => {
      Object.entries(obj).forEach(([k, v]) => {
        expect(bodies[i], `capstone ${i} ${k}`).toMatch(new RegExp(`${k}: '?${String(v).replace('.', '\\.')}'?`));
      });
    });
    expect(Object.keys(L.CAPSTONE_A)).toHaveLength(13);
    expect(Object.keys(L.CAPSTONE_B)).toHaveLength(12);
    expect(Object.keys(L.CAPSTONE_C)).toHaveLength(13);
  });

  it('the capstone never touches the teaching digest, and the digest never names a capstone line', () => {
    const digest = readDigest().toLowerCase();
    ['obigbo', 'nembe', 'soku'].forEach((name) => expect(digest).not.toContain(name));
    const dump = fs.readFileSync(DUMP_MJS, 'utf8').toLowerCase();
    ['obigbo', 'nembe', 'soku'].forEach((name) => expect(dump).not.toContain(name));
    // and the teaching streams are absent from the capstone generator
    const cap = fs.readFileSync(CAPSTONE_MJS, 'utf8').toLowerCase();
    ['etelebou', 'kanbi', 'tunu', 'opukushi', 'diebu', 'angiama'].forEach((nm) => expect(cap).not.toContain(nm));
  });
});

// ---------------------------------------------------------------------------
// THE LEAK GATE.
// ---------------------------------------------------------------------------

const ARG_REQUIRED = ['leakGuardTargets', 'leakGuardHit', 'collectNumbers', 'probeRefusal',
  'bisect', 'relDiff', 'mpy', 'countHistoryComments', 'countHistoryMarkers', 'standardNameCensus'];
const GATE_MACHINERY = ['LEAK_GUARD_MARGIN', 'LEAK_GUARD_SCALINGS', 'LEAK_GUARD_RELATIVE_CAP',
  'HISTORY_COMMENT_RE', 'COMMENT_LINE_RE', 'HISTORY_MARKER', 'PIN_LITERALS', 'PIN_METHOD',
  'WITHDRAWN_STRINGS', 'STANDARD_NAMES', 'screenTextForStandardSweep',
  'STUDIO_PSIA_DIVISOR', 'CLAIMED_SOUR_PSIA'];

/** A surface smaller than this is not the lab: refuse to call it clean. */
const MIN_SURFACE_ENTRIES = 40;
const MIN_SURFACE_NUMBERS = 1200;

const teachingSurface = () => {
  const out = [];
  Object.entries(L).forEach(([name, value]) => {
    if (L.CAPSTONE_ONLY_EXPORTS.includes(name) || ARG_REQUIRED.includes(name) || GATE_MACHINERY.includes(name)) return;
    out.push({ name, value: typeof value === 'function' ? value() : value });
  });
  return out;
};

const surfaceNumbers = (surface) => surface.flatMap((s) => L.collectNumbers(s.value, s.name));

const leakHits = (surface, targets) => surfaceNumbers(surface)
  .map((x) => ({ x, t: L.leakGuardHit(x.value, targets) }))
  .filter((h) => h.t)
  .map(({ x, t }) => `${x.path} = ${x.value} is within ${t.band} of ${t.key} ${t.tag}`);

describe('THE LEAK GATE: no teaching number may be a graded capstone answer', () => {
  const targets = L.leakGuardTargets(CAPSTONE_FIELDS);

  it('the guard is built from all eighteen fields in all three unit shiftings, with the band scaled', () => {
    expect(targets).toHaveLength(18 * 3);
    expect(L.LEAK_GUARD_MARGIN).toBe(10);
    expect(L.LEAK_GUARD_SCALINGS.map((s) => s.factor)).toEqual([1, 1000, 0.001]);
    // the bands are DERIVED from the published tolerances rather than restated
    targets.forEach((t) => {
      expect(t.gradingBand, t.key).toBeGreaterThan(0);
      expect(t.band, t.key).toBeGreaterThan(0);
    });
  });

  it('every export is accounted for: walked bare, walked with arguments, capstone or machinery', () => {
    const named = new Set([...L.CAPSTONE_ONLY_EXPORTS, ...ARG_REQUIRED, ...GATE_MACHINERY,
      ...teachingSurface().map((s) => s.name)]);
    const unaccounted = Object.keys(L).filter((k) => !named.has(k));
    expect(unaccounted, 'an export reaches neither the teaching walk nor a declared list').toEqual([]);
  });

  it('THE GUARD REFUSES AN EMPTY OR TINY SURFACE rather than calling it clean', () => {
    const surface = teachingSurface();
    const numbers = surfaceNumbers(surface);
    expect(surface.length).toBeGreaterThanOrEqual(MIN_SURFACE_ENTRIES);
    expect(numbers.length).toBeGreaterThanOrEqual(MIN_SURFACE_NUMBERS);
    console.log(`[corrosion lab] the teaching surface is ${surface.length} exports and ${numbers.length} numbers`);
  });

  it('THE GUARD IS LIVE: every graded answer, planted, is caught in every shifting', () => {
    CAPSTONE_FIELDS.forEach(([, key, value]) => {
      L.LEAK_GUARD_SCALINGS.forEach(({ factor, tag }) => {
        const planted = { deep: { rows: [{ v: value * factor }] } };
        const hits = leakHits([{ name: 'planted', value: planted }], targets);
        expect(hits.length, `${key} ${tag} was not caught`).toBeGreaterThan(0);
      });
    });
  });

  it('THE GUARD GOES RED ON A PLANTED LEAK in a real reader\'s output, and is clean again without it', () => {
    const real = L.studioDefaults();
    expect(leakHits([{ name: 'studioDefaults', value: real }], targets)).toEqual([]);
    const poisoned = { ...real, rateMmYr: CAPSTONE_FIELDS[8][2] };
    const hits = leakHits([{ name: 'studioDefaults', value: poisoned }], targets);
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0]).toContain(CAPSTONE_FIELDS[8][1]);
  });

  it('NO number returned by any teaching export is within ten grading bands of a graded answer', () => {
    const surface = teachingSurface();
    expect(leakHits(surface, targets)).toEqual([]);
  });

  it('every number PRINTED IN THE DIGEST stands clear of a graded answer too', () => {
    const numbers = (readDigest().match(/-?\d+\.\d+/g) || []).map(Number).filter(Number.isFinite);
    expect(numbers.length).toBeGreaterThan(1000);
    const hits = numbers.map((v) => L.leakGuardHit(v, targets)).filter(Boolean);
    expect(hits.map((h) => `${h.key} ${h.tag}`), 'the digest prints a graded capstone answer').toEqual([]);
  });

  it('every number PRINTED IN A PANEL SOURCE stands clear of a graded answer', () => {
    PANEL_FILES.forEach((f) => {
      const numbers = (panelSource(f).match(/-?\d+\.\d+/g) || []).map(Number).filter(Number.isFinite);
      const hits = numbers.map((v) => L.leakGuardHit(v, targets)).filter(Boolean);
      expect(hits.map((h) => `${h.key} ${h.tag}`), `${f} prints a graded capstone answer`).toEqual([]);
    });
  });
});

// ---------------------------------------------------------------------------
// THE PROSE SWEEP.
// ---------------------------------------------------------------------------

describe('THE PROSE SWEEP: the lab\'s own comments are swept for claims the code no longer makes', () => {
  it('no comment claims a count, a name or a behaviour the code contradicts', () => {
    const src = LAB_SOURCE();
    const held = L.heldItems();
    expect(src).toContain('THIS COURSE GRADES NO CORROSION RATE');
    expect(held.heldCount, 'the lab comment says eleven held items').toBe(11);
    expect(src).toMatch(/Eleven items in this engine have no\n\/\/ source/);
    expect(L.ENGINE_DOORS).toHaveLength(14);
    L.doorCensus().forEach((d) => expect(d.kind, `${d.name} is not a function on the engine`).toBe('function'));
    expect(L.PIN_LITERALS).toHaveLength(30);
    expect(L.GOLDEN_PINS).toHaveLength(28);
    expect(L.EXPORT_PINS).toHaveLength(15);
    // fifteen exports, fourteen of them pinned rows and one the psia twin, so
    // sixteen pinned constants have no export, and section 3 prints all three
    const s3 = L.heldConstantsTable();
    expect(s3.exportsThatArePins).toBe(14);
    expect(s3.exportsNotPins).toEqual(['SOUR_THRESHOLD_PSIA']);
    expect(s3.pinsWithNoExport).toBe(16);
    expect(readDigest()).toContain('THE ENGINE EXPORTS 15 CONSTANTS BY NAME. 14 of them');
    expect(readDigest()).toContain('so 16 of the 30 pinned constants have no export at all');
  });

  it('no panel imports an engine directly, and every one reads the lab', () => {
    PANEL_FILES.forEach((f) => {
      const text = panelSource(f);
      expect(text, `${f} imports an engine directly`).not.toMatch(/@petrolord\/engines/);
      expect(text, `${f} does not read the lab`).toMatch(/from '\.\/corrosionLab'/);
    });
  });

  it('no panel and no page reaches into the capstone half of the lab', () => {
    [...PANEL_FILES.map((f) => [f, panelSource(f)]), ['CorrosionLearningPage.jsx', fs.readFileSync(LEARNING_PAGE, 'utf8')]]
      .forEach(([f, text]) => {
        L.CAPSTONE_ONLY_EXPORTS.forEach((name) => {
          expect(text, `${f} imports ${name}`).not.toMatch(new RegExp(`\\b${name}\\b`));
        });
      });
  });

  it('NO P LABEL anywhere: nothing in this course is a distribution', () => {
    [['corrosionLab.js', LAB_SOURCE()], ...PANEL_FILES.map((f) => [f, panelSource(f)])]
      .forEach(([f, text]) => {
        expect(text, `${f} carries a percentile label`).not.toMatch(/\bP(10|50|90)\b/);
        expect(text, `${f} carries a percentile label`).not.toMatch(/percentile/i);
      });
  });

  it('THIS TEST FILE ITSELF names no path under /root', () => {
    const me = fs.readFileSync(fileURLToPath(import.meta.url), 'utf8');
    expect(me).not.toMatch(/\/root\//);
    expect(LAB_SOURCE()).not.toMatch(/\/root\//);
  });
});
