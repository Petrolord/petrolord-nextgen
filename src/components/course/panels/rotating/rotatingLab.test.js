// Every value the FC3 lab exposes to a panel, a lesson or the grader is pinned
// here against the teaching digest (tools/course-waves/rotating/digest.txt), which is
// itself nothing but the Pump Station Designer's and the Compressor Station
// Designer's return values on the published goldens and on the teaching fields
// OKONO P-1201 and SOKU K-2101.
//
// THE DIGEST IS REBUILT BYTE FOR BYTE. buildDigest() below is fc3_dump.mjs's
// writer with every engine call replaced by a lab return value: the prose is
// the dump's, the formatting is the dump's (pump work to six decimals; gas work
// to four; exponents, small factors and MMscfd to nine; counts whole), and
// every number comes out of rotatingLab.js. The rebuilt text is compared with
// digest.txt section by section and then whole.
//
// THE EIGHTEEN GRADED FIELDS of the ESCRAVOS, BONGA and BONNY capstone are
// pinned separately and EXACTLY against tools/course-waves/rotating/fields.json,
// READ FROM THE FILE.
//
// Then the gates:
//   THE LEAK GATE      no teaching export may return a number within ten times
//                      a graded field's ABSOLUTE tolerance of a graded answer,
//                      in any of three unit shiftings, over every number the
//                      lab exports, refusing a tiny surface.
//   THE CLOCK GATE     every reader returns identical output under two faked
//                      system dates, with a control proving the clock moved,
//                      and a second control proving there is no dated or seeded
//                      surface to fake. Comments are stripped before the grep,
//                      so prose about clocks cannot trip it.
//   THE TZ GATE        the whole rebuild runs a second time in a child process
//                      under TZ=America/Los_Angeles and must be byte-identical.
//   THE REFUSAL GATE   every refusal the panels display is the engine's own
//                      message, and no message is written as a literal in the
//                      lab or in a panel.
//   THE HELD GATE      the eight HELD quantities carry the wording that marks
//                      them unverified, the three panels show it, and no graded
//                      capstone field reads one.
//   THE CONVERGED GATE the duty solve's own report, with the case that makes
//                      `converged` false, because a flag made only of the
//                      bracket could never be false at all.
//   THE NAN GATE       the five bare-number exports hold their documented
//                      contract: NaN when the inputs cannot be read, never an
//                      Infinity and never a plausible number, with two readable
//                      controls that make the refusals mean something.
//   THE MIRROR GATE    the in-repo copy of the wave under tools/course-waves is
//                      byte-identical to the wave directory this file reads.
import {
  describe, it, expect, afterEach, vi,
} from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import * as LAB_NS from './rotatingLab.js';
import { waveDir, waveInput, mirrorDir, liveWaveDir } from '../../../../../tools/course-waves/waveInputs.mjs';

const L = LAB_NS;
const LAB = Object.fromEntries(Object.entries(L));

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
// THE WAVE INPUTS. Read from the committed copy under tools/course-waves by
// default, which is what lets this suite run anywhere, CI included. Point it
// at a live wave directory mid-build with NEXTGEN_WAVE_DIR. A missing input
// throws and names itself rather than skipping: see tools/course-waves/waveInputs.mjs.
const WAVE_NAME = 'rotating';
const WAVE = waveDir(WAVE_NAME);
const MIRROR = mirrorDir(WAVE_NAME);
// The live wave directory, when this runs on a machine that has one. It is what
// the MIRROR GATE below compares the committed copy against, and it is null on
// a CI runner.
const LIVE_WAVE = liveWaveDir(WAVE_NAME);
const DIGEST = waveInput(WAVE_NAME, 'digest.txt');
const FIELDS_JSON = waveInput(WAVE_NAME, 'fields.json');
const DUMP_MJS = waveInput(WAVE_NAME, 'fc3_dump.mjs');
const FIELDS_MJS = waveInput(WAVE_NAME, 'fc3_fields.mjs');
const CAPSTONE_MJS = waveInput(WAVE_NAME, 'fc3_fields_capstone.mjs');
const LAB_SOURCE = () => fs.readFileSync(path.join(HERE, 'rotatingLab.js'), 'utf8');
const PANEL_FILES = ['PumpExplorer.jsx', 'SuctionExplorer.jsx', 'CompressorExplorer.jsx'];

/**
 * A panel source, PROVEN to be there before anything is asserted about it.
 *
 * The gates below walk PANEL_FILES. They used to open each one with
 * `if (!fs.existsSync(p)) return;`, so a renamed or deleted panel made the
 * assertion inside the loop vanish and the test pass. A gate that empties
 * itself when its subject goes missing is the defect these gates exist to
 * catch, so a name in PANEL_FILES that is not on disk is a failure here.
 */
const panelFile = (file) => {
  const p = path.join(HERE, file);
  expect(fs.existsSync(p), `PANEL_FILES names ${file}, which is not in ${HERE}: `
    + 'either the panel moved and the list is stale, or the panel is gone. '
    + 'Until the list is corrected every gate over PANEL_FILES checks nothing.').toBe(true);
  return p;
};

// ---------------------------------------------------------------------------
// The digest's formatting, verbatim from fc3_dump.mjs.
// ---------------------------------------------------------------------------

const n = (x, d) => (x === null || x === undefined || !Number.isFinite(Number(x)) ? String(x) : Number(x).toFixed(d));
const e6 = (x) => n(x, 6);   // gpm, ft, psi, hp, kW, ratios, percentages
const r4 = (x) => n(x, 4);   // ft lbf per lbm, Btu per hr, acfm, degF
const f9 = (x) => n(x, 9);   // exponents, small factors, MMscfd

/** A refusal row as the dump prints one, from the lab's captured error string. */
const soft = (err) => (err ? `{ error: "${err}" }` : 'no error');
/** A warning or note, quoted the way the dump quotes one. */
const q = (s) => (s === null || s === undefined ? 'null' : `"${s}"`);

/**
 * The dump's hand-rolled serialiser, fed from the lab's shape triples.
 * Hand-rolled there and here because JSON.stringify has no spelling for NaN or
 * Infinity and prints both as null, which is exactly the trap this course
 * teaches.
 */
const shape = (sh) => {
  if (sh.scalar) return String(sh.value);
  const parts = sh.entries.map(([k, kind, v]) => {
    if (kind === 'function') return `${k}: <function>`;
    if (kind === 'string') return `${k}: "${v}"`;
    if (kind === 'array') return `${k}: [${v.join(' | ')}]`;
    if (kind === 'null') return `${k}: null`;
    if (kind === 'undefined') return `${k}: undefined`;
    if (kind === 'object') return `${k}: {object}`;
    return `${k}: ${String(v)}`;
  });
  return `{ ${parts.join(', ')} }`;
};

// ---------------------------------------------------------------------------
// THE REBUILD. One block per digest section, in the dump's order.
// ---------------------------------------------------------------------------

const buildDigest = () => {
  const out = [];
  const w = (s = '') => out.push(s);

  const s1 = L.engineScope();
  const s2 = L.twoCurves();
  const s3 = L.dutyPointSolved();
  const s4 = L.powerHeadPressure();
  const s5 = L.whereTheDutyLanded();
  const s6 = L.suctionSide();
  const s7 = L.marginAndRule();
  const s8 = L.speedAndTrim();
  const s9 = L.crossingAndMap();
  const s10 = L.twoPumpsAndWater();
  const s11 = L.stageIsNotAPump();
  const s12 = L.stageCountAndLimit();
  const s13 = L.trainAndCooling();
  const s14 = L.machineDriverFuel();
  const s15 = L.refusalContract();
  const s16 = L.publishedGoldens();

  w('# FC3 Rotating Equipment. Teaching digest.');
  w('# Pump work prints to six decimals (gpm, ft, psi, hp, kW, ratios, percentages); gas work to four (ft lbf per lbm, Btu per hr, acfm, degF); exponents, small factors and MMscfd to nine; counts are whole numbers.');
  w('# Field units: gpm and feet of head for pumps, MMscfd and psia and degF for gas, horsepower for both.');
  w(`# Two engines: engines/facilities/pumps.js (${s1.pumpExports} exports) and engines/facilities/compression.js (${s1.compressionExports} exports), over engines/production/gasProperties.js. The export counts are read off the modules themselves.`);
  w('# The engines are vendored at engines main 4fa37e6, which is the FC3-0 repair wave. compression.js reads its gas constant, its molecular weight of air and its Rankine offset from engines/production/gasProperties.js, its compressibility validity window from engines/facilities/separatorSizing.js, and its two power packagings from lib/units/fieldUnits.js, which pumps.js also reads.');
  w('# Nothing here is read from a clock or a random number, so every line reproduces.');
  w();

  // Section 1
  w('# SECTION 1: What these engines size, and what they refuse (owned by Associate m01)');
  w();
  w('# App surface: the Pump Station Designer and the Compressor Station Designer run these chains live. For a pump, catalogue points give a curve, a friction head at a stated flow gives a system curve, the two cross at exactly one flow, and the power, the suction margin and the operating region are all asked THERE. For a compressor, a pressure ratio and a gas give a stage, two limits give a stage count, and the stages chain into a train.');
  w('- A pump has NO operating point until it is connected to something. The pump curve and the system curve are separate objects and the duty is SOLVED as their intersection, which is why every follow-on answer moves when the system does.');
  w('- These two modules size MACHINES. What the piping upstream and downstream costs in pressure is a line-sizing question and lives in engines/facilities/lineHydraulics.js.');
  w('- THE SCOPE SEAM, and it is large. There is NO compressor surge line, no surge control, no recycle valve and no anti-surge calculation anywhere in the engines package. There is no mechanical seal and no bearing calculation: seals and bearings appear only inside returned prose. There is no machine curve, no wheel selection, no valve dynamics and no rod loading. A vendor performance run on a specific frame answers those, and this course does not.');
  w('- Every refusal in both modules is a RETURNED OBJECT carrying an `error` string. Neither module throws. A caller checks a property rather than catching.');
  w(`- ${s1.bareNumberNames.length} of these exports return a BARE NUMBER rather than an object, so they have nowhere to put an error at all: ${s1.bareNumberNames.join(', ')}. They hold a DOCUMENTED NaN CONTRACT instead: NaN when the inputs cannot be read, never an Infinity and never a plausible number, and Section 15 shows each of them keeping it.`);
  w();
  w('States the pump module has no answer for, engine messages verbatim:');
  s1.pumpSoftStates.forEach((r) => w(`- ${r.label}: ${soft(r.error)}`));
  w();
  w('States the compression module has no answer for, engine messages verbatim:');
  s1.compressionSoftStates.forEach((r) => w(`- ${r.label}: ${soft(r.error)}`));
  w();
  w('# HELD FOR LITERATURE, taught as a limit and never graded: the viscosity correlation, the trim shortfall model, the operating-region bands, the NPSH margin rule, the machine-screening threshold set, the 300 degF DEFAULT discharge limit, what the implied water density is away from real water, and every published golden case, which carries the affinity speed band with it. Section 17 lists those eight again with what each one costs.');
  w();

  // Section 2
  w('# SECTION 2: Two curves, and why neither has an operating point (owned by Associate m02)');
  w();
  w('The OKONO P-1201 produced-water injection pump, as its catalogue reads:');
  w('| flow gpm | head ft |');
  w('| --- | --- |');
  s2.points.forEach((p) => w(`| ${e6(p.qGpm)} | ${e6(p.headFt)} |`));
  w();
  w(`The least-squares quadratic through them, in the normalised variable q over the scale: c0 = ${e6(s2.coefficients.c0)}, c1 = ${e6(s2.coefficients.c1)}, c2 = ${e6(s2.coefficients.c2)}, scale = ${e6(s2.coefficients.scale)} (engine).`);
  w(`Shutoff head, which is the fitted head at zero flow: ${e6(s2.shutoffHeadFt)} ft (engine). R squared: ${n(s2.rSquared, 9)} (engine). Droops: ${s2.droops} (engine). Warning: ${q(s2.warning)}.`);
  w(`THE SOLVE IS REPORTED AS WELL AS THE FIT. R squared measures how well the fitted curve describes the four points; it says nothing about whether the linear system behind it was solvable, and those are two different questions. The 1-norm condition number of the normal-equation matrix is ${n(s2.conditionNumber, 6)} (engine), and the conditioning note is ${q(s2.conditioningNote)}.`);
  w('The condition number across a spread of the point sets this digest fits, so the figure above has a range to sit in rather than standing alone:');
  w('| point set | condition number | R squared | droops |');
  w('| --- | --- | --- | --- |');
  s2.conditionSets.forEach((r) => w(`| ${r.label} | ${n(r.conditionNumber, 6)} | ${n(r.rSquared, 9)} | ${r.droops} |`));
  w(`Normal equations square the condition number of the design matrix, which is the price of solving a least-squares problem this way, and the engine pays it in the normalised variable rather than in raw gpm. Across every point set this file fits successfully, ${s2.conditionCount} of them, the reported figure runs from ${n(s2.conditionMin, 6)} to ${n(s2.conditionMax, 6)} (derived as the smallest and largest of those ${s2.conditionCount}). Double precision carries about sixteen decimal digits, so a figure of this size costs the coefficients two or three of them.`);
  w(`The scale is the largest flow in the point set, and the fitted shutoff is NOT the catalogue's own first point: the catalogue reads ${e6(s2.catalogueShutoffFt)} ft at zero flow against the fit's ${e6(s2.shutoffHeadFt)} ft, a difference of ${e6(s2.shutoffMissDerivedFt)} ft (derived from the two figures on this line). A quadratic through four points misses all four.`);
  w();
  w('The fitted curve read back at each catalogue flow, with the residual:');
  w('| flow gpm | catalogue head ft | fitted head ft | residual ft |');
  w('| --- | --- | --- | --- |');
  s2.readback.forEach((r) => w(`| ${e6(r.qGpm)} | ${e6(r.catalogueHeadFt)} | ${e6(r.fittedHeadFt)} | ${e6(r.residualDerivedFt)} |`));
  w('The residual column is derived on each row as the fitted head less the catalogue head.');
  w();
  w('The system curve, stated as a friction head at a flow rather than as a coefficient:');
  w(`- static head ${e6(s2.system.staticHeadFt)} ft, friction head ${e6(s2.system.frictionHeadFt)} ft at ${e6(s2.system.atFlowGpm)} gpm`);
  w(`- the coefficient that implies: k = ${n(s2.system.kFt, 12)} ft per gpm squared (engine)`);
  w(`- static head read back by the engine: ${e6(s2.system.staticReadBackFt)} ft`);
  w();
  w('The two curves read at the same flows, so the crossing can be seen before it is solved:');
  w('| flow gpm | pump head ft | system head ft | pump less system ft |');
  w('| --- | --- | --- | --- |');
  s2.crossing.forEach((r) => w(`| ${e6(r.qGpm)} | ${e6(r.pumpHeadFt)} | ${e6(r.systemHeadFt)} | ${e6(r.differenceDerivedFt)} |`));
  w('The last column is derived on each row. It starts positive and ends negative, and the flow where it is zero is the duty point Section 3 solves.');
  w();
  w('A point set that is not a centrifugal head curve, because it RISES with flow:');
  w(`- points: ${s2.rising.points.map((p) => `${e6(p.qGpm)} gpm at ${e6(p.headFt)} ft`).join(', ')}`);
  w(`- fitted c2 = ${e6(s2.rising.c2)} (engine), R squared ${n(s2.rising.rSquared, 9)}, droops ${s2.rising.droops}`);
  w(`- warning: "${s2.rising.warning}"`);
  w('A drooping curve has a negative c2. This one is positive, the engine says so in prose, and it also says so in a field: `droops` is the machine-readable half of that same warning, and Section 3 is where it is read.');
  w();
  w('A point set of three identical heads:');
  w(`- fitted c2 = ${e6(s2.flat.c2)}, R squared ${n(s2.flat.rSquared, 9)}, droops ${s2.flat.droops} (engine)`);
  w(`- warning: "${s2.flat.warning}"`);
  w('R squared is the share of the variance the fit explains. Three identical heads have no variance to explain, the total sum of squares is zero and the quantity is undefined, so the engine returns null rather than a number. A horizontal line explains nothing, and null is what "there is nothing to explain" looks like in a return.');
  w();

  // Section 3
  w('# SECTION 3: The duty point, solved (owned by Associate m03)');
  w();
  w(`OKONO against its stated system: the curves cross at ${e6(s3.qGpm)} gpm and ${e6(s3.headFt)} ft (engine).`);
  w(`At that flow the pump makes ${e6(s3.pumpHeadAtDutyFt)} ft and the system demands ${e6(s3.systemHeadFt)} ft (both engine, the second read back off the return). The difference is ${s3.solvedDifferenceDerivedFt} ft (derived from the two figures on this line), which is what "solved" means here.`);
  w('THE SOLVE REPORTS ITSELF. Bisection on the head difference, and the return carries the evidence it finished on:');
  w(`- halvings taken: ${s3.iterations} (engine), out of a cap of 200`);
  w(`- the bracket it stopped on: ${s3.bracketGpm} gpm (engine)`);
  w(`- the head difference at the flow it returned: ${s3.residualFt} ft (engine)`);
  w(`- converged: ${s3.converged} (engine); warning ${q(s3.warning)}`);
  w('The flag is made of the residual as well as the bracket, and it has to be. On a bracketed sign change bisection always collapses, so a flag made only of the bracket width could never come back false and would be a check that validates nothing.');
  w('THE CASE IT DOES CATCH, run here as a negative control rather than described. A curve that returns a non-finite head over part of the range sends the comparison false at every step there and marches the search quietly to the bottom of it:');
  w(`- the flow it returns: ${e6(s3.poisoned.qGpm)} gpm, against the ${e6(s3.qGpm)} gpm the same curves really cross at, which is ${e6(s3.poisoned.awayFromTrueDerivedGpm)} gpm away (derived from the two figures on this line)`);
  w(`- the bracket it finished on: ${s3.poisoned.bracketGpm} gpm, after ${s3.poisoned.iterations} halvings`);
  w(`- the head difference at that flow: ${s3.poisoned.residualFt} ft`);
  w(`- converged: ${s3.poisoned.converged} (engine)`);
  w(`A flag made only of that bracket would have called this solve converged: the bracket is ${s3.poisoned.bracketGpm} gpm, which is at the resolution of the numbers themselves. The residual half is the half that can be false, and here it is ${s3.poisoned.residualFt} ft.`);
  w('That is what a check which CAN fail looks like beside one that cannot, and the same question is worth asking of every flag in this course: what input makes it false?');
  w(`It stops when the midpoint stops moving rather than after a fixed count. A fixed 200 halvings with no stopping test gives ${e6(s3.blindGpm)} gpm on this same pair of curves against the engine's ${e6(s3.qGpm)} gpm, a difference of ${s3.blindDifferenceDerivedGpm} gpm (derived from the two figures on this line), so nothing moved when the report was added: the loop breaks exactly where the blind one was already standing still.`);
  w();
  w('The same pump against a friction-dominated system, which is the case Section 10 needs:');
  w(`- static head ${e6(s3.friction.staticHeadFt)} ft, friction head ${e6(s3.friction.frictionHeadFt)} ft at ${e6(s3.friction.atFlowGpm)} gpm, k = ${n(s3.friction.kFt, 12)} ft per gpm squared (engine)`);
  w(`- duty: ${e6(s3.friction.qGpm)} gpm at ${e6(s3.friction.headFt)} ft (engine)`);
  w(`- of that head, ${e6(s3.friction.staticHeadFt)} ft is static and ${e6(s3.friction.frictionShareDerivedFt)} ft is friction (derived: the duty head less the stated static head)`);
  w();
  w('Moving the system moves the duty, which is the point of solving it rather than typing it:');
  w('| static head ft | duty flow gpm | duty head ft |');
  w('| --- | --- | --- |');
  s3.staticSweep.forEach((r) => w(`| ${e6(r.staticHeadFt)} | ${r.refused ? 'refused' : e6(r.qGpm)} | ${r.refused ? 'refused' : e6(r.headFt)} |`));
  w();
  w('A curve that RISES with flow is not a centrifugal head curve, so where it crosses a system curve is not a duty point:');
  w(`- ${soft(s3.risingRefusal)}`);
  w('That is the `droops` flag of Section 2 being read. The fit and the duty are two halves of one module asked about the same curve, and the flag is how the half that judges the shape tells the half that solves on it. Two halves of one module that answer differently about one curve are a module contradicting itself, and the half that trusts is the one to doubt.');
  w();
  w('The two refusals that are real answers rather than hidden errors:');
  w(`- a system the pump cannot start: ${soft(s3.tooHigh.error)}`);
  w(`  it hands back the evidence: shutoff head ${e6(s3.tooHigh.shutoffHeadFt)} ft against a system static head of ${e6(s3.tooHigh.systemStaticHeadFt)} ft (engine). The gap is ${e6(s3.tooHigh.gapDerivedFt)} ft (derived from the two figures on this line).`);
  w(`- a search limit set below the crossing: ${soft(s3.searchLimitRefusal)}`);
  w('  That one is a question about the search rather than about the machine, and the message says which.');
  w();

  // Section 4
  w('# SECTION 4: Power, head and pressure, and the constants measured out of the engine (owned by Associate m04)');
  w();
  w('# App surface: the Duty Point tab prints these four figures under the duty. They are all asked AT the solved duty, so they all move when the system does.');
  w(`At the OKONO duty of ${e6(s4.qGpm)} gpm and ${e6(s4.headFt)} ft, on a fluid of gravity ${e6(s4.sg)} at an efficiency of ${e6(s4.efficiency)} through a motor of ${e6(s4.motorEfficiency)}:`);
  w(`- hydraulic power ${e6(s4.hydraulicHp)} hp (engine)`);
  w(`- brake power ${e6(s4.brakeHp)} hp (engine)`);
  w(`- motor input ${e6(s4.motorInputHp)} hp, ${e6(s4.motorInputKw)} kW (engine)`);
  w(`- the pump loses ${e6(s4.pumpLossDerivedHp)} hp and the motor a further ${e6(s4.motorLossDerivedHp)} hp (derived from the three figures above)`);
  w();
  w(`The duty head as a discharge pressure: ${e6(s4.dischargePsi)} psi (engine), and converting it back gives ${e6(s4.roundTripFt)} ft (engine).`);
  w('The same head on a lighter and a heavier fluid, because head is a property of the machine and pressure is a property of the fluid in it:');
  w('| gravity | head ft | discharge psi |');
  w('| --- | --- | --- |');
  s4.gravities.forEach((r) => w(`| ${e6(r.sg)} | ${e6(r.headFt)} | ${e6(r.dischargePsi)} |`));
  w();
  w('THE CONSTANTS. pumps.js exports no constants; the three it names internally are a percentage slack and the two ends of the speed band, all three measured out of the engine in Section 8, and every packaging it computes with is written inline at its point of use or imported. Each one below is MEASURED by asking the engine a question about itself.');
  w(`- feet of head per psi at gravity 1, from psiToHeadFt at one psi: ${n(s4.measured.ftPerPsi, 9)}`);
  w(`- the horsepower packaging, from one over the hydraulic power at unit flow, head, gravity and efficiency: ${n(s4.measured.horsepowerPackaging, 6)}`);
  w(`- kilowatts per horsepower, from the motor input in kW over the motor input in hp at an efficiency of one: ${n(s4.measured.kwPerHp, 12)}`);
  w(`- the DEFAULT motor efficiency, from the brake power over the motor input when the argument is omitted: ${n(s4.measured.defaultMotorEfficiency, 12)}`);
  w();
  w('Both pump packagings carry a water density inside them, and they can be compared:');
  w(`- the ft-per-psi packaging implies ${n(s4.densityFromPressurePackagingDerived, 12)} lb per ft3 (derived: 144 square inches per square foot divided by the measured ${n(s4.measured.ftPerPsi, 9)})`);
  w(`- the horsepower packaging implies ${n(s4.densityFromPowerPackagingDerived, 12)} lb per ft3 (derived: 33000 ft lbf per minute per horsepower divided by the measured ${n(s4.measured.horsepowerPackaging, 6)}, times 1728 cubic inches per cubic foot over 231 cubic inches per gallon)`);
  w(`- the difference between them: ${s4.densityDifferenceDerived} lb per ft3 (derived from the two rows above)`);
  w(`- their quotient, which is what ties the two packagings together and is measurable directly: ${n(s4.packagingQuotientDerived, 12)} (derived from the two measured constants)`);
  w('# HELD FOR LITERATURE, taught as a limit and never graded: what that implied density is away from real water. The packagings are the engine\'s own definitions and are measurable; the handbook figure they approximate is not in this repository.');
  w();

  // Section 5
  w('# SECTION 5: Where the duty landed (owned by Associate m05)');
  w();
  w(`The OKONO duty of ${e6(s5.qGpm)} gpm against a stated best efficiency flow of ${e6(s5.qBepGpm)} gpm: ${e6(s5.percentOfBep)} percent, region "${s5.region}", preferred ${s5.preferred} (engine).`);
  w(`Note: ${q(s5.note)}`);
  w();
  w('The four bands, with the value either side of every boundary, because a band that misclassifies its own edge is a defect:');
  w('| flow gpm | percent of BEP | region | preferred | note present |');
  w('| --- | --- | --- | --- | --- |');
  s5.bands.forEach((r) => w(`| ${e6(r.qGpm)} | ${e6(r.percentOfBep)} | ${r.region} | ${r.preferred} | ${r.notePresent} |`));
  w();
  w('The notes themselves, which are the part of this return that says what a region costs:');
  s5.notes.forEach((r) => w(`- at ${e6(r.percentOfBep)} percent, "${r.region}": ${r.note}`));
  w();
  w('# HELD FOR LITERATURE, taught as a limit and never graded: the bands themselves, at 50, 70, 120 and 140 percent of best efficiency flow. They are customary and this repository holds no publication for them, so no graded value in this course is a region, a percentage of best efficiency flow or a preferred flag.');
  w('Read the note above 120 percent carefully, because it is the one that names its own limit. The required NPSH climbs steeply with flow there, and this module carries NPSHr as a SINGLE NUMBER rather than as a curve: it is a scalar input to the check in Section 7, and there is no required-NPSH-against-flow curve anywhere in the module. The note says so, which is the difference between a warning a reader can act on and one they cannot: the vendor curve has to be read at THIS flow before the suction margin means anything.');
  w();

  // Section 6
  w('# SECTION 6: NPSH available, from the real suction side (owned by Professional m01)');
  w();
  w('# App surface: the Suction and Changes tab builds this from the suction survey rather than from a number typed into a box, which is what makes the second and third rows below movable.');
  w(`The OKONO suction: ${e6(s6.suction.suctionPressurePsia)} psia over a liquid whose vapour pressure is ${e6(s6.suction.vapourPressurePsia)} psia, gravity ${e6(s6.suction.sg)}, the source ${e6(s6.suction.staticSuctionLiftFt)} ft above the pump, ${e6(s6.suction.suctionFrictionFt)} ft of suction friction.`);
  w(`- the pressure head: ${e6(s6.pressureHeadFt)} ft (engine)`);
  w(`- NPSH available: ${e6(s6.npshaFt)} ft (engine)`);
  w(`- warning: ${q(s6.warning)}`);
  w(`- the three parts sum on the row: ${e6(s6.pressureHeadFt)} plus ${e6(s6.suction.staticSuctionLiftFt)} less ${e6(s6.suction.suctionFrictionFt)} gives ${e6(s6.threePartSumDerivedFt)} ft (derived), which is the engine's answer.`);
  w();
  w('Padding the suction drum, everything else held:');
  w('| suction psia | pressure head ft | NPSH available ft |');
  w('| --- | --- | --- |');
  s6.padding.forEach((r) => w(`| ${e6(r.suctionPressurePsia)} | ${e6(r.pressureHeadFt)} | ${e6(r.npshaFt)} |`));
  w();
  w('A suction already AT the vapour pressure, and one already below it:');
  w(`- at it (${e6(s6.atVapour.suctionPressurePsia)} psia against ${e6(s6.atVapour.vapourPressurePsia)} psia): pressure head ${e6(s6.atVapour.pressureHeadFt)} ft, NPSH available ${e6(s6.atVapour.npshaFt)} ft, warning "${s6.atVapour.warning}"`);
  w(`- below it (${e6(s6.belowVapour.suctionPressurePsia)} psia against ${e6(s6.belowVapour.vapourPressurePsia)} psia): pressure head ${e6(s6.belowVapour.pressureHeadFt)} ft, NPSH available ${e6(s6.belowVapour.npshaFt)} ft, warning "${s6.belowVapour.warning}"`);
  w('The second row is the one worth reading twice: the pressure head is negative and the static column still leaves the available head positive, so a caller reading only the number sees an ordinary answer. The warning is the only thing that says the liquid is already flashing.');
  w();

  // Section 7
  w('# SECTION 7: The margin, and the rule it is judged against (owned by Professional m02)');
  w();
  w(`Against the vendor's stated required NPSH of ${e6(s7.npshrFt)} ft, across the same suction sweep:`);
  w('| suction psia | NPSH available ft | margin ft | required margin ft | ratio | pass | severity |');
  w('| --- | --- | --- | --- | --- | --- | --- |');
  s7.sweep.forEach((r) => w(`| ${e6(r.suctionPressurePsia)} | ${e6(r.npshaFt)} | ${e6(r.marginFt)} | ${e6(r.requiredMarginFt)} | ${e6(r.ratio)} | ${r.pass} | ${r.severity} |`));
  w();
  w('The three severities, each with the message the engine attaches:');
  s7.severities.forEach((r) => {
    w(`- ${r.label}: margin ${e6(r.marginFt)} ft against a required ${e6(r.requiredMarginFt)} ft, "${r.severity}", pass ${r.pass}`);
    w(`  note: ${q(r.note)}`);
  });
  w();
  w('What the check returns when it is handed an available head it cannot read:');
  s7.unreadable.forEach((r) => w(`- ${r.label}: ${shape(r.shape)}`));
  w('A verdict needs an input. The available head is the whole of what this function judges, so an unreadable one is refused rather than classified: there is no severity to report and no pass flag to set, and the refusal says which of the two inputs it could not read.');
  w();
  w('THE RULE IS A MARGIN RULE, and both halves of its maximum are MEASURED out of the engine rather than typed, and so is the required NPSH where they change places:');
  w(`- the floor, from the required margin at a required NPSH small enough that the percentage cannot reach it: ${n(s7.floorFt, 9)} ft`);
  w(`- the fraction, from the required margin at a required NPSH large enough that the floor cannot reach it, divided by that required NPSH: ${n(s7.fraction, 9)}`);
  w(`- the required NPSH where the two are equal, found by halving until the engine's own answer leaves the floor: ${n(s7.crossoverFt, 9)} ft (engine, by bisection on its own return)`);
  w(`- and the quotient of the first two, which is the same figure by a different route: ${n(s7.crossoverByQuotientDerivedFt, 9)} ft (derived from the two rows above)`);
  w('| required NPSH ft | required margin the engine applies ft | the half that bound | the available head that exactly satisfies it ft | the ratio there |');
  w('| --- | --- | --- | --- | --- |');
  s7.rule.forEach((r) => w(`| ${e6(r.npshrFt)} | ${e6(r.requiredMarginFt)} | ${r.boundHalf} | ${e6(r.exactlySatisfiedFt)} | ${n(r.ratioThere, 9)} |`));
  w('A MARGIN RULE AND A RATIO RULE ARE NOT THE SAME RULE, and the last column is where the difference shows. On the rows where the fraction binds, the ratio at the boundary is the same number on each of them, so a reader could mistake the margin rule for a rule on that ratio and never notice. On the row where the floor binds it is a different number, and the next line measures how different.');
  w(`Read the two governed rows against each other: at a required NPSH of ${e6(s7.npshrFt)} ft the boundary ratio is ${n(s7.governedRatioAtVendorNpshr, 9)} and at ${e6(4)} ft it is ${n(s7.governedRatioAtFour, 9)}, a difference of ${s7.governedRatioDifferenceDerived} (derived from the two figures on this line).`);
  w(`# HELD FOR LITERATURE, taught as a limit and never graded: the margin rule itself, the larger of the ${n(s7.floorFt, 9)} ft floor and the ${n(s7.fraction, 9)} fraction measured above. It is customary and this repository holds no publication for it, so no graded value in this course is a required margin, a pass flag or a severity.`);
  w();

  // Section 8
  w('# SECTION 8: A speed change and a trim are not the same thing (owned by Professional m03)');
  w();
  w(`Both are asked at the OKONO duty of ${e6(s8.baseQGpm)} gpm, ${e6(s8.baseHeadFt)} ft and ${e6(s8.baseBrakeHp)} brake hp.`);
  w();
  w('A speed change, which follows the affinity laws exactly for a geometrically similar machine:');
  w('| speed ratio | flow gpm | head ft | brake hp | head over the base head | less the ratio squared | power over the base power | less the ratio cubed | warned |');
  w('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  s8.speed.forEach((r) => w(`| ${e6(r.speedRatio)} | ${e6(r.qGpm)} | ${e6(r.headFt)} | ${e6(r.brakeHp)} | ${n(r.headQuotientDerived, 9)} | ${r.headLessSquareDerived} | ${n(r.powerQuotientDerived, 9)} | ${r.powerLessCubeDerived} | ${r.warned} |`));
  w('The four quotient and difference columns are derived on each row. The two difference columns are what "exactly" means here: the head quotient against the speed ratio squared and the power quotient against it cubed, subtracted rather than described.');
  w();
  w('THE LAWS ARE EXACT AND THE MACHINE IS NOT, so the engine carries a band it will report a ratio without comment over. Its two ends are measured by walking the ratio until the warning changes state:');
  w(`- the lower end, walked up from a ratio of ${e6(s8.bandLowFrom)}: ${n(s8.bandLow, 12)}`);
  w(`- the upper end, walked down from a ratio of ${e6(s8.bandHighFrom)}: ${n(s8.bandHigh, 12)}`);
  w(`- at a ratio of ${e6(s8.farRatio)} the laws still apply, and the engine still applies them: ${e6(s8.far.qGpm)} gpm, ${e6(s8.far.headFt)} ft, ${e6(s8.far.brakeHp)} brake hp, with "${s8.far.warning}"`);
  w('That band is a SANITY BOUND rather than a published correlation limit. No publication in this repository says where the affinity laws stop describing a real machine, so the two ends above are a judgement about when a reader should be told to think rather than a measurement of where the physics fails. It is warned on and never used to refuse, and nothing computed from it decides a value.');
  w();
  w('An impeller trim, which does not:');
  w('| trim ratio | trim percent | ideal flow gpm | real flow gpm | ideal head ft | real head ft | shortfall percent | brake hp | implied efficiency ratio | warning |');
  w('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  s8.trim.forEach((r) => w(`| ${e6(r.diameterRatio)} | ${e6(r.trimPercent)} | ${e6(r.idealQGpm)} | ${e6(r.qGpm)} | ${e6(r.idealHeadFt)} | ${e6(r.headFt)} | ${e6(r.shortfallPct)} | ${e6(r.brakeHp)} | ${n(r.impliedEfficiencyRatio, 9)} | ${r.warned ? 'set' : 'null'} |`));
  w();
  w('The warning, in full, at the trim where it first fires and at a deep one:');
  s8.warnings.forEach((r) => w(`- at a trim ratio of ${e6(r.diameterRatio)}: "${r.warning}"`));
  w(`- at a trim ratio of ${e6(s8.atWarning.diameterRatio)}, trim percent ${e6(s8.atWarning.trimPercent)}: warning ${s8.atWarning.warned ? 'set' : 'null'}. The threshold is exclusive, so the vendor limit itself does not warn.`);
  w();
  w('The two boundaries the trim rule turns on, with the value either side:');
  s8.boundaries.forEach((r) => w(`- ${r.label}, trim ratio ${e6(r.diameterRatio)}: trim percent ${r.trimPercent}, shortfall percent ${r.shortfallPct}`));
  w(`Read the first of those four twice, because it is where binary floating point meets a rule written in decimal. A trim ratio of ${e6(s8.boundaries[0].diameterRatio)} is meant to be exactly five percent and the rule says five percent carries no shortfall; the subtraction puts the trim percent at ${s8.slack.atStartTrimPercent}, which is above five by ${s8.slack.aboveFiveDerived} (derived from the two figures on this line). The shortfall percent on that row is nevertheless ${s8.slack.atStartShortfallPct}, so the comparison is carrying a slack.`);
  w(`The slack is MEASURED by halving the trim ratio until the shortfall leaves zero: the last ratio with no shortfall gives a trim percent of ${s8.slack.lastWithoutTrimPercent} and the first with one gives ${s8.slack.firstWithTrimPercent}, so the boundary the engine really applies sits ${s8.slack.boundaryAboveFiveDerived} above five percent (derived from those two figures). The rule is written in whole percent and the value it is compared against is not one, and that gap is what the slack spans.`);
  w(`The warning boundary carries the same slack: at a trim ratio of ${e6(s8.atWarning.diameterRatio)} the trim percent is ${s8.slack.warningTrimPercent} and the warning is ${s8.slack.warningWarned ? 'set' : 'null'}.`);
  w();
  w(`The power leg of a trim is the IDEAL CUBE while the head and flow legs are both de-rated, so the return implies an efficiency change. At a trim ratio of ${e6(s8.cap.diameterRatio)} the flow is ${n(s8.cap.flowShareDerived, 9)} of ideal and the head is ${n(s8.cap.headShareDerived, 9)} of ideal (both derived on this line from the columns above), so the product of the two is ${n(s8.cap.productDerived, 9)} while the brake power is ${n(s8.cap.powerShareOfIdealCubeDerived, 9)} of the ideal cube.`);
  w(`That implied ratio is RETURNED rather than left to be discovered by division: the engine reports impliedEfficiencyRatio = ${n(s8.cap.impliedEfficiencyRatio, 9)} on that row, against the ${n(s8.cap.productDerived, 9)} derived above, a difference of ${s8.cap.impliedLessDerivedDifference} (derived from the two figures on this line).`);
  w('The power leg is LEFT as the ideal cube on purpose. The shortfall model has no publication in this repository, so de-rating the power here would be inventing a second unsourced model on top of the first. What the engine owes the reader is the arithmetic it actually did, and that is what the field carries.');
  w();
  w('# HELD FOR LITERATURE, taught as a limit and never graded: the trim shortfall model, zero at or under five percent and then 0.006 per further percent, capped at 0.12, applied whole to head and half to flow. The engine\'s own comment calls it "the published shortfall" and names no publication, so no graded value in this course is a trimmed flow, head or shortfall. The speed law above is NOT held: it is the affinity law and it is exact.');
  w();

  // Section 9
  w('# SECTION 9: An affinity law applied to a duty point is not a new duty point (owned by Professional m04)');
  w();
  w('# App surface. The Pump Station Designer draws its chart and its duty headline from a scaled CURVE re-intersected with the system, and it also shows where the old duty point lands on that new curve, in a card headed "What a change would buy". Those are two different questions and the studio labels them as two: the crossing is the operating point, and the affinity map is where the machine you had ends up on the machine you now have.');
  w('The rows below reproduce that composition over the vendored engine. The scaling factors are READ OUT OF THE ENGINE at a unit duty rather than restated here, which is the same thing the studio does and is what keeps the curve and the point from drifting apart when the engine moves.');
  w();
  w('The factors themselves, at a unit duty, so the scaling above is on the page rather than behind it:');
  w('| speed ratio | trim ratio | flow factor | head factor |');
  w('| --- | --- | --- | --- |');
  s9.factors.forEach((r) => w(`| ${e6(r.speedRatio)} | ${e6(r.diameterRatio)} | ${n(r.qScale, 9)} | ${n(r.hScale, 9)} |`));
  w();
  w('A trim, both ways:');
  w('| trim ratio | re-solved flow gpm | re-solved head ft | one-point flow gpm | one-point head ft | flow quotient | head quotient |');
  w('| --- | --- | --- | --- | --- | --- | --- |');
  s9.trims.forEach((r) => w(`| ${e6(r.diameterRatio)} | ${e6(r.reSolvedQGpm)} | ${e6(r.reSolvedHeadFt)} | ${e6(r.onePointQGpm)} | ${e6(r.onePointHeadFt)} | ${n(r.flowQuotientDerived, 9)} | ${n(r.headQuotientDerived, 9)} |`));
  w('The last two columns are derived on each row as the one-point answer over the re-solved answer.');
  w();
  w('A speed change, both ways:');
  w('| speed ratio | re-solved flow gpm | re-solved head ft | one-point flow gpm | one-point head ft | flow quotient | head quotient |');
  w('| --- | --- | --- | --- | --- | --- | --- |');
  s9.speeds.forEach((r) => w(`| ${e6(r.speedRatio)} | ${e6(r.reSolvedQGpm)} | ${e6(r.reSolvedHeadFt)} | ${e6(r.onePointQGpm)} | ${e6(r.onePointHeadFt)} | ${n(r.flowQuotientDerived, 9)} | ${n(r.headQuotientDerived, 9)} |`));
  w();
  w(`Read the trim ratio of 0.950000 row, where the shortfall model contributes nothing (its shortfall percent is ${s9.at95.shortfallPct}). The two answers are still ${e6(s9.at95.reSolvedQGpm)} gpm and ${e6(s9.at95.onePointQGpm)} gpm, a quotient of ${n(s9.at95.quotientDerived, 9)}. The gap there is not the shortfall model. It is that the system curve did not move when the machine changed, so the machine meets it somewhere else, and an affinity law applied to the old duty point does not know that.`);
  w(`And the affinity map does lie ON the new curve, which is the other half of the same statement: at the trim ratio of 0.950000 the one-point answer is ${e6(s9.at95.onePointQGpm)} gpm at ${e6(s9.at95.onePointHeadFt)} ft, and the scaled curve read at that flow gives ${e6(s9.at95.scaledCurveAtOnePointFt)} ft, a difference of ${s9.at95.onCurveDifferenceDerivedFt} ft (derived from the two figures on this line). It is a point on the machine you now have; it is simply not where that machine will run.`);
  w();

  // Section 10
  w('# SECTION 10: Two pumps, and a catalogue curve that is a water curve (owned by Professional m05)');
  w();
  w(`Identical machines in parallel on the friction-dominated system of Section 3 (static ${e6(s10.staticHeadFt)} ft, friction ${e6(s10.frictionHeadFt)} ft at ${e6(s10.atFlowGpm)} gpm):`);
  w('| machines | duty flow gpm | duty head ft | flow over one machine | flow per machine gpm |');
  w('| --- | --- | --- | --- | --- |');
  s10.parallel.forEach((r) => w(`| ${r.machines} | ${e6(r.qGpm)} | ${e6(r.headFt)} | ${n(r.overOneMachineDerived, 9)} | ${e6(r.perMachineDerivedGpm)} |`));
  w('The fourth column is derived on each row. Two machines do not give two, and the fifth column says why: each machine is running further left on its own curve and the system is demanding more head for the extra flow.');
  w();
  w('The same machines in series, which add head at equal flow instead:');
  w('| machines | duty flow gpm | duty head ft | head over one machine |');
  w('| --- | --- | --- | --- |');
  s10.series.forEach((r) => w(`| ${r.machines} | ${e6(r.qGpm)} | ${e6(r.headFt)} | ${n(r.overOneMachineDerived, 9)} |`));
  w(`A series stack reads back exactly: at ${e6(s10.readBack.qGpm)} gpm one machine makes ${e6(s10.readBack.oneHeadFt)} ft and three in series make ${e6(s10.readBack.threeHeadFt)} ft (engine), a quotient of ${n(s10.readBack.quotientDerived, 9)} (derived from the two figures on this line).`);
  w(`A COUNT IS A NUMBER OF MACHINES, so it is guarded as a whole number and not merely as one or more: ${soft(s10.halfInParallel)}, and in series ${soft(s10.halfInSeries)}. Two and a half pumps is a question with no answer, and a curve returned for it would be an answer to it.`);
  w(`Both combinations also carry the droop of the curve they were built from, so a stack of machines refuses a duty point for the same reason one machine does: ${soft(s10.stackDroopRefusal)}`);
  w();
  w('A CATALOGUE CURVE IS A WATER CURVE. The Hydraulic Institute correction on the OKONO best efficiency point:');
  w(`- best efficiency flow ${e6(s10.qBepGpm)} gpm, best efficiency head ${e6(s10.headBepFt)} ft, ${e6(s10.speedRpm)} rpm`);
  w('| viscosity cSt | B | flow factor | head factor | efficiency factor | corrected flow gpm | corrected head ft | note or warning |');
  w('| --- | --- | --- | --- | --- | --- | --- | --- |');
  s10.viscosity.forEach((r) => {
    const msg = r.warned ? 'warning set' : (r.note ? `note: ${r.note}` : 'null');
    w(`| ${e6(r.viscosityCSt)} | ${n(r.B, 9)} | ${n(r.cQ, 9)} | ${n(r.cH, 9)} | ${n(r.cEta, 9)} | ${r.correctedPresent ? e6(r.correctedQGpm) : 'absent'} | ${r.correctedHeadPresent ? e6(r.correctedHeadFt) : 'absent'} | ${msg} |`);
  });
  w();
  w('The two warnings, in full:');
  s10.viscosityWarnings.forEach((r) => w(`- at ${e6(r.viscosityCSt)} cSt: "${r.warning}"`));
  w();
  w(`Two rows worth reading against each other. At ${e6(1)} cSt the engine reports B = ${n(s10.waterB, 9)}; at ${n(1.000001, 6)} cSt, a millionth higher, it reports B = ${n(s10.justOverB, 9)}, a difference of ${s10.bDifferenceDerived} (derived from the two figures on this line). The correlating parameter is a real positive number at water viscosity and the engine reports it there, on the branch where it then applies no correction at all. B is what says how far from water the fluid is; the decision not to correct is a separate statement, and it is carried by the note.`);
  w(`THE RETURN SHAPE IS THE SAME ON EVERY BRANCH, and the table above shows it. The corrected flow and head are ${s10.waterCorrectedPresent ? 'present' : 'absent'} on the water row, ${s10.justOverCorrectedPresent ? 'present' : 'absent'} on the row a millionth above it, and ${s10.correctedRowPresent ? 'present' : 'absent'} on a corrected row. On the two no-correction branches they are the catalogue values themselves: at ${e6(1)} cSt the corrected flow is ${e6(s10.waterCorrectedQGpm)} gpm against a stated best efficiency flow of ${e6(s10.qBepGpm)} gpm, a difference of ${s10.waterCorrectedLessBepDerived} gpm (derived from the two figures on this line). "The catalogue values, unchanged" is an answer, and it is returned as one.`);
  w();
  w('# HELD FOR LITERATURE, taught as a limit and never graded: the whole Hydraulic Institute correction. B, the flow factor, the head factor and the efficiency factor are an empirical correlation with no publication in this repository, and the head factor is taken equal to the flow factor at best efficiency, which is a further simplification of the standard. This wave\'s oracle checks the arithmetic at sixty digits, the closed-form inverse of the flow factor and the monotonicity both factors must have, and that is arithmetic evidence only. No graded value in this course is a corrected flow, head or efficiency.');
  w();

  // Section 11
  w('# SECTION 11: A stage is not a pump (owned by Expert m01)');
  w();
  w('# App surface: the Staging and Power tab prints both heads and both efficiencies side by side so neither gets quoted as the other.');
  w(`The SOKU K-2101 stage: ${e6(s11.stage.qMMscfd)} MMscfd of a ${e6(s11.stage.gasSg)} gravity gas at ${e6(s11.stage.pSuctionPsia)} psia and ${r4(s11.stage.tSuctionF)} degF, compressed through a ratio of ${e6(s11.stage.ratio)} with k = ${e6(s11.stage.k)} at a polytropic efficiency of ${e6(s11.stage.polytropicEfficiency)}.`);
  w();
  w(`- the polytropic exponent ratio: ${f9(s11.exponentRatio)} (engine)`);
  w(`- the same function at an efficiency of one, which is the isentropic exponent ratio: ${f9(s11.isentropicExponentRatio)} (engine)`);
  w(`- their quotient: ${f9(s11.exponentQuotientDerived)} (derived from the two rows above), which is one over the polytropic efficiency`);
  w(`- discharge pressure ${r4(s11.pDischargePsia)} psia, discharge temperature ${r4(s11.tDischargeF)} degF (engine)`);
  w(`- the discharge temperature the ISENTROPIC exponent would have predicted: ${r4(s11.isentropicDischargeF)} degF (engine, through the same function at an efficiency of one, brought to Fahrenheit by the Rankine offset gasProperties.js exports), which is ${r4(s11.isentropicBelowDerivedF)} degF below the real one (derived from the two figures on this line)`);
  w(`- compressibility at suction ${n(s11.z1, 9)}, at discharge ${n(s11.z2, 9)}, averaged ${n(s11.zAvg, 9)} (engine). The two ends differ by ${n(s11.zSpreadDerived, 9)} (derived), which is why the average is taken rather than the suction value carried through.`);
  w(`- mass flow ${r4(s11.massLbHr)} lb per hr (engine)`);
  w(`- polytropic head ${r4(s11.headPolyFtLbfLbm)} ft lbf per lbm, isentropic head ${r4(s11.headIsenFtLbfLbm)} ft lbf per lbm (engine); their quotient ${f9(s11.headQuotientDerived)} (derived)`);
  w(`- polytropic efficiency ${n(s11.polytropicEfficiency, 9)}, isentropic efficiency ${n(s11.isentropicEfficiency, 9)} (engine); the isentropic one is lower by ${n(s11.efficiencyGapDerived, 9)} (derived)`);
  w(`- gas horsepower by the polytropic route ${r4(s11.gasHp)}, by the isentropic route ${r4(s11.gasHpIsentropicRoute)} (engine); difference ${s11.gasHpDifferenceDerived} hp (derived)`);
  w(`- brake horsepower ${r4(s11.brakeHp)} at a mechanical efficiency of ${e6(s11.mechanicalEfficiency)} (engine)`);
  w(`- compressibility note: ${q(s11.zNote)}`);
  w(`- warning: ${q(s11.warning)}`);
  w();
  w('THE HOT-STAGE WARNING FIRES ON THE LIMIT THE CALLER STATED, rather than on a threshold written into the module. The same stage against four different stated limits, everything else held:');
  w('| stated limit degF | discharge degF | warned | the warning |');
  w('| --- | --- | --- | --- |');
  s11.statedLimits.forEach((r) => w(`| ${r4(r.statedLimitF)} | ${r4(r.tDischargeF)} | ${r.warned} | ${q(r.warning)} |`));
  w(`The discharge on all four rows is the same ${r4(s11.tDischargeF)} degF, because the limit is a limit and not an input to the thermodynamics.`);
  w(`THE DEFAULT IS MEASURED RATHER THAN TYPED. With no limit stated the warning turns on between a ratio of ${s11.defaultBracket.lowRatio} and ${s11.defaultBracket.highRatio}, and the discharge temperatures either side of that crossing are ${s11.defaultBracket.lowDischargeF} and ${s11.defaultBracket.highDischargeF} degF (engine), which brackets the default the engine applies when the caller states none. That default is a customary figure with no publication behind it in this repository.`);
  w();
  w('THE TWO POWER ROUTES AGREE BECAUSE THEY ARE THE SAME EXPRESSION, which is worth showing rather than admiring. The exponent ratio times the polytropic efficiency is the isentropic exponent ratio, exactly, for every pair:');
  w('| k | polytropic efficiency | exponent ratio | times the efficiency | the isentropic exponent ratio | difference |');
  w('| --- | --- | --- | --- | --- | --- |');
  s11.identity.forEach((r) => w(`| ${e6(r.k)} | ${e6(r.polytropicEfficiency)} | ${f9(r.exponentRatio)} | ${r.timesEfficiencyDerived} | ${r.isentropicExponentRatio} | ${r.differenceDerived} |`));
  w('The last column is derived on each row. Because that identity holds, dividing the isentropic head by the isentropic efficiency and dividing the polytropic head by the polytropic efficiency are one expression, so the two horsepower figures above cannot disagree for any input at all.');
  w('A COMPARISON THAT CANNOT COME OUT FALSE IS NOT A CHECK. Two routes through one expression agree for every input, including an input that is transcribed wrong, so their agreement is a shape property and not evidence about either head. The engine gate asserts it and labels it as that, and the check that CAN fail beside it is a numerical quadrature of the integral of v dp along the polytropic path, with a negative control that moves the exponent and must break the comparison.');
  w('The same rule applies to every gate a reader will meet: ask what input would make it fail, and if there is none, it is a restatement of the formula and not a test of it.');
  w();
  w('The exponent, the discharge and the head against the polytropic efficiency, everything else held:');
  w('| polytropic efficiency | exponent ratio | discharge degF | polytropic head ft lbf per lbm | gas hp |');
  w('| --- | --- | --- | --- | --- |');
  s11.etaSweep.forEach((r) => w(`| ${e6(r.polytropicEfficiency)} | ${f9(r.exponentRatio)} | ${r4(r.tDischargeF)} | ${r4(r.headPolyFtLbfLbm)} | ${r4(r.gasHp)} |`));
  w();
  w('And against k, which is what a richer gas changes:');
  w('| k | exponent ratio | discharge degF | polytropic head ft lbf per lbm | gas hp |');
  w('| --- | --- | --- | --- | --- |');
  s11.kSweep.forEach((r) => w(`| ${e6(r.k)} | ${f9(r.exponentRatio)} | ${r4(r.tDischargeF)} | ${r4(r.headPolyFtLbfLbm)} | ${r4(r.gasHp)} |`));
  w();
  w('And against the ratio the stage is asked to take:');
  w('| ratio | discharge psia | discharge degF | polytropic head ft lbf per lbm | gas hp | warning |');
  w('| --- | --- | --- | --- | --- | --- |');
  s11.ratioSweep.forEach((r) => w(`| ${e6(r.ratio)} | ${r4(r.pDischargePsia)} | ${r4(r.tDischargeF)} | ${r4(r.headPolyFtLbfLbm)} | ${r4(r.gasHp)} | ${r.warned ? 'set' : 'null'} |`));
  w();

  // Section 12
  w('# SECTION 12: The stage count, and the limit that governs (owned by Expert m02)');
  w();
  w(`SOKU as a whole duty: ${e6(s12.duty.qMMscfd)} MMscfd from ${e6(s12.duty.pSuctionPsia)} psia to ${e6(s12.duty.pDischargePsia)} psia at ${r4(s12.duty.tSuctionF)} degF, with a per-stage ratio limit of ${e6(s12.duty.maxRatioPerStage)} and a discharge limit of ${r4(s12.duty.maxDischargeF)} degF.`);
  w(`The count is chosen against the temperature the stages will ACTUALLY see. A single stage starts from the suction and is never cooled; every stage after the first starts from the interstage approach, so the inlet a trial count must be tested at is the suction for one stage and the hotter of the suction and the cooled temperature for more than one. This duty cools back to ${r4(s12.duty.interstageCoolToF)} degF against a suction of ${r4(s12.duty.tSuctionF)} degF.`);
  w(`- overall ratio ${f9(s12.overallRatio)} (engine)`);
  w(`- stages the ratio rule demands: ${s12.byRatio} (engine)`);
  w(`- stages the temperature limit demands: ${s12.byTemp} (engine)`);
  w(`- stages: ${s12.stages}, governed by ${s12.governedBy} (engine)`);
  w(`- ratio per stage: ${f9(s12.ratioPerStage)} (engine)`);
  w();
  w('Across a range of discharge pressures, which is the sweep the studio\'s third tab draws:');
  w('| discharge psia | overall ratio | by ratio | by temperature | stages | governed by | ratio per stage | brake hp | hottest stage degF | the stated limit less the hottest degF | cooling MMBtu per hr | fuel MMscfd |');
  w('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  s12.sweep.forEach((r) => {
    if (r.refused) { w(`| ${e6(r.pDischargePsia)} | refused: ${r.error} | | | | | | | | | | |`); return; }
    w(`| ${e6(r.pDischargePsia)} | ${f9(r.overallRatio)} | ${r.byRatio} | ${r.byTemp} | ${r.stages} | ${r.governedBy} | ${f9(r.ratioPerStage)} | ${r4(r.totalBrakeHp)} | ${r4(r.hottestF)} | ${r4(r.roomDerivedF)} | ${r4(r.totalCoolingMMBtuHr)} | ${f9(r.fuelMMscfd)} |`);
  });
  w('Power climbs smoothly along that table and the stage count climbs in steps, and each step is a machine, a cooler and a foundation.');
  w(`The tenth column is derived on each row as the stated limit of ${r4(s12.duty.maxDischargeF)} degF less the hottest stage, so a NEGATIVE entry there is a train running over the limit it was staged against. ${s12.sweepOverLimit} of the ${s12.sweepRows} rows do that, on a duty whose intercooler approach of ${r4(s12.duty.interstageCoolToF)} degF sits ABOVE its suction of ${r4(s12.duty.tSuctionF)} degF, which is the condition under which the count and the train could disagree at all. Section 13 walks that approach across the suction and keeps the column non-negative the whole way.`);
  w();
  w(`The search for the temperature-driven count runs from one stage to twelve and refuses past it. That refusal is hard to reach, because every cheaper explanation is caught at the door first: it needs a discharge limit above the suction temperature (${r4(s12.capDuty.maxDischargeF)} degF against ${r4(s12.capDuty.tSuctionF)} degF here), a readable efficiency and a workable ratio limit, and an overall ratio large enough that twelve equal stages are still too hot. ${soft(s12.cap.error)}`);
  w('A REFUSAL CARRIES ITS EVIDENCE, because the diagnosis has to survive it. That return also holds six numeric fields, and a caller that prints the error string and discards the object has thrown all six away:');
  w(`- the stage counts tried: ${s12.cap.triedStages} (engine)`);
  w(`- the coolest discharge those twelve equal stages could reach: ${r4(s12.cap.coolestReachedF)} degF (engine)`);
  w(`- the limit it was measured against: ${r4(s12.cap.maxDischargeF)} degF (engine)`);
  w(`- the inlet it was measured from: ${r4(s12.cap.hottestInletF)} degF, and the interstage cooling temperature that inlet was taken from: ${r4(s12.cap.interstageCoolToF)} degF (engine)`);
  w(`- the overall ratio it was working on: ${f9(s12.cap.overallRatio)} (engine)`);
  w(`The gap between the coolest reachable discharge and the stated limit is ${r4(s12.cap.gapDerivedF)} degF (derived from the two rows above), which is what tells a reader whether it is the approach or the limit that is impossible rather than sending them off to intercool harder.`);
  w('Section 15 puts four other faults that reach this same function beside the refusal that names each of them, so a refusal here means the twelve-stage cap and not one of those four.');
  w();

  // Section 13
  w('# SECTION 13: The train, its cooling, and the limit that buys the stages (owned by Expert m03)');
  w();
  w(`SOKU as a train, cooled back to ${r4(s13.interstageCoolToF)} degF between stages against a suction of ${r4(s13.tSuctionF)} degF:`);
  w('| stage | suction psia | discharge psia | in degF | out degF | ratio | z average | polytropic head ft lbf per lbm | gas hp | brake hp | cooling Btu per hr | cooled to degF | warning |');
  w('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  s13.stages.forEach((s) => {
    w(`| ${s.stage} | ${r4(s.pSuctionPsia)} | ${r4(s.pDischargePsia)} | ${r4(s.tSuctionF)} | ${r4(s.tDischargeF)} | ${f9(s.ratio)} | ${n(s.zAvg, 9)} | ${r4(s.headPolyFtLbfLbm)} | ${r4(s.gasHp)} | ${r4(s.brakeHp)} | ${r4(s.coolingBtuHr)} | ${s.cooledToF === null ? 'null' : r4(s.cooledToF)} | ${s.warned ? 'set' : 'null'} |`);
  });
  w(`Totals: gas ${r4(s13.totalGasHp)} hp, brake ${r4(s13.totalBrakeHp)} hp, cooling ${r4(s13.totalCoolingBtuHr)} Btu per hr which is ${r4(s13.totalCoolingMMBtuHr)} MMBtu per hr, final discharge ${r4(s13.finalDischargeF)} degF (engine).`);
  w(`The stated discharge limit is ${r4(s13.maxDischargeF)} degF and the hottest stage on that table is ${r4(s13.hottestDerivedF)} degF (derived as the maximum of the out column), which leaves ${r4(s13.roomDerivedF)} degF of room (derived from the two figures on this line).`);
  w();
  w('NOW MOVE THE INTERCOOLER APPROACH ACROSS THE SUCTION TEMPERATURE. A warmer approach makes every stage after the first start hotter, so at a fixed count it finishes hotter, and the count the temperature limit demands rises once that is no longer affordable. The count and the train are asked the same question about the same inlets, and the table shows both halves of that:');
  w('| cooled to degF | inlet the count was tested at degF | stages | governed by | stage discharges degF | hottest degF | the stated limit less the hottest degF | stages over the limit | stages warned |');
  w('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  s13.coolSweep.forEach((r) => {
    if (r.refused) { w(`| ${r4(r.cooledToF)} | refused: ${r.error} | | | | | | | |`); return; }
    w(`| ${r4(r.cooledToF)} | ${r4(r.inletTestedAtF)} | ${r.stages} | ${r.governedBy} | ${r.dischargesF.map((x) => r4(x)).join(', ')} | ${r4(r.hottestF)} | ${r4(r.roomDerivedF)} | ${r.stagesOverLimit} | ${r.stagesWarned} |`);
  });
  w(`The suction temperature on that table is ${r4(s13.tSuctionF)} degF and the stated limit is ${r4(s13.maxDischargeF)} degF. The seventh column is derived on each row as the stated limit less the hottest stage, so a NEGATIVE entry there is a train running over its own limit; ${s13.coolSweepOver} stages across the whole table do that. The second column is the inlet the count was chosen at, and on every row it is the inlet the stages after the first actually run from.`);
  w('The whole of that is one comparison. A count chosen at the suction while the stages run from the cooler is a count chosen for a machine that is not the one being built, and the second column is the only thing on the table that says which machine the count was bought for.');
  w();
  w(`A case cut to press on it: the same gas from ${e6(s13.hotCase.duty.pSuctionPsia)} psia to ${e6(s13.hotCase.duty.pDischargePsia)} psia at ${r4(s13.hotCase.duty.tSuctionF)} degF, a stated discharge limit of ${r4(s13.hotCase.duty.maxDischargeF)} degF and an intercooler approach of ${r4(s13.hotCase.duty.interstageCoolToF)} degF, which is ${r4(s13.hotCase.approachAboveSuctionDerivedF)} degF ABOVE the suction (derived from the two figures on this line).`);
  w(`- stages: ${s13.hotCase.stages}, governed by ${s13.hotCase.governedBy} (engine)`);
  w(`- stage discharges: ${s13.hotCase.dischargesF.map((x) => r4(x)).join(', ')} degF (engine)`);
  w(`- the stated limit is ${r4(s13.hotCase.duty.maxDischargeF)} degF and the hottest stage is ${r4(s13.hotCase.hottestF)} degF, which leaves ${r4(s13.hotCase.roomDerivedF)} degF of room (derived from the two figures on this line)`);
  w(`- stages over the stated limit: ${s13.hotCase.stagesOverLimit} of ${s13.hotCase.stages}; stages carrying a warning: ${s13.hotCase.stagesWarned} of ${s13.hotCase.stages}`);
  w(`- the first stage runs from the suction and reaches ${r4(s13.hotCase.firstDischargeF)} degF; every later stage runs from the ${r4(s13.hotCase.duty.interstageCoolToF)} degF approach and reaches ${r4(s13.hotCase.lastDischargeF)} degF, a difference of ${r4(s13.hotCase.firstToLastDerivedF)} degF (derived from the two figures on this line) at the same ratio`);
  w('The return says the discharge temperature governed the stage count, and the discharge temperature is under the limit it was governed by. That is what a staging that agrees with its own train looks like: the count was bought at the inlet the stages have, and the cost of the hotter approach is paid in machines rather than in temperature.');
  w('The Compressor Station Designer ships with an approach of 110 degF against a suction of 100 degF, so a studio opened and not touched is already on the warm side of that comparison. What it buys there is a stage count, which is a cooler and a foundation and a machine, and the table above is the price list.');
  w();
  w('The interstage cooling duty is a real exchanger, and it moves with the approach. The stage count is in the table because it moves too, and the trade below only reads cleanly where it does not:');
  w('| cooled to degF | stages | total cooling MMBtu per hr | total gas hp |');
  w('| --- | --- | --- | --- |');
  s13.coolSweep.filter((r) => !r.refused).forEach((r) => w(`| ${r4(r.cooledToF)} | ${r.stages} | ${r4(r.totalCoolingMMBtuHr)} | ${r4(r.totalGasHp)} |`));
  w('Colder suction to the next stage means less work for the same ratio, and more heat to take out. The table says where that holds and where it stops, and the answer is read off it rather than asserted:');
  w(`- across the ${s13.trade.fixedCountRows} rows that share a stage count of ${s13.trade.fixedCountStages}, the cooling falls and the gas power rises on every step: ${s13.trade.holds}`);
  w(`- over those rows the cooling goes from ${r4(s13.trade.coolingFromMMBtuHr)} to ${r4(s13.trade.coolingToMMBtuHr)} MMBtu per hr and the gas power from ${r4(s13.trade.gasHpFrom)} to ${r4(s13.trade.gasHpTo)} hp (engine, read off the table)`);
  w(`- ${s13.trade.crossings} rows add a stage, and on the first of them the cooling goes back UP from ${r4(s13.trade.beforeCrossingCoolingMMBtuHr)} to ${r4(s13.trade.atCrossingCoolingMMBtuHr)} MMBtu per hr while the gas power goes DOWN from ${r4(s13.trade.beforeCrossingGasHp)} to ${r4(s13.trade.atCrossingGasHp)} hp, because the extra machine changed the ratio each stage takes`);
  w('So the trade is a statement about a FIXED number of stages. Across a stage-count change it reverses, and a reader who quotes the trade without the count attached has quoted it wrong. That extra machine is also the reason multi-stage compression is worth its machinery at all.');
  w();

  // Section 14
  w('# SECTION 14: The machine, the driver and the fuel (owned by Expert m04)');
  w();
  w('The actual inlet volume is what the machine screen turns on, and it falls with pressure:');
  w('| suction psia | actual inlet acfm |');
  w('| --- | --- |');
  s14.acfmSweep.forEach((r) => w(`| ${e6(r.pPsia)} | ${r4(r.acfm)} |`));
  w(`At the SOKU suction of ${e6(s14.atSuctionPsia)} psia the inlet volume is ${r4(s14.atSuctionAcfm)} acfm (engine).`);
  w();
  w(`The screen, on ${s14.screenCount} duties chosen to land in all four of its branches, with the branch each one reached printed beside it rather than promised. A BRANCH IS A REASON, and two branches can end on the same recommendation:`);
  s14.screen.forEach((d) => {
    w(`- ${d.label}: ${r4(d.acfm)} acfm at an overall ratio of ${e6(d.overallRatio)} and ${r4(d.totalBrakeHp)} brake hp gives "${d.recommendation}"`);
    d.reasons.forEach((r) => w(`    ${r}`));
  });
  w(`TWO COUNTS, AND THEY ARE DIFFERENT QUESTIONS, both derived by collecting them across those ${s14.screenCount} duties: ${s14.distinctFirstReasonsDerived} distinct FIRST REASONS, which is one per branch of the screen, and ${s14.distinctRecommendationsDerived} distinct RECOMMENDATION words, which is ${s14.distinctRecommendationsDerived < s14.distinctFirstReasonsDerived ? `${s14.distinctFirstReasonsDerived - s14.distinctRecommendationsDerived} fewer` : 'the same'} because the branch is decided on the inlet VOLUME first and on the ratio second, so more than one branch can end on the same machine. The reason line is the only thing that says which road a duty took.`);
  w();
  w('The screen asks for the compressibility BEFORE it asks for the volume, so a suction state outside the correlation is refused by name rather than as a missing volume:');
  s14.screenDomain.forEach((r) => w(`- ${r.label}: ${soft(r.error)}`));
  w('A volume is positive, and the guard says so. Finiteness alone is not enough here, because a NEGATIVE number is finite: a suction below absolute zero puts a negative absolute temperature into the volume, and a screen that only asked whether the answer was finite would take that negative volume, find it "below about 500 acfm" and recommend a reciprocating machine on it.');
  w();
  w('# HELD FOR LITERATURE, taught as a limit and never graded: the screening thresholds, 500 and 5000 and 20000 acfm, ratios of 4 and 6, and 200 and 10000 brake hp. They are customary and unsourced here, so no graded value in this course is a recommendation.');
  w();
  w(`The driver on the SOKU train, at a heat rate of ${e6(s14.heatRateBtuHpHr)} Btu per hp hr burning gas of ${e6(s14.lhvBtuScf)} Btu per scf:`);
  w(`- fuel ${r4(s14.fuelBtuHr)} Btu per hr, which is ${f9(s14.fuelMMscfd)} MMscfd (engine)`);
  w(`- driver thermal efficiency ${e6(s14.thermalEfficiencyPct)} percent (engine)`);
  w(`- the fuel as a share of the stream being compressed: ${e6(s14.fuelSharePctDerived)} percent (derived: the fuel over the ${e6(s14.throughputMMscfd)} MMscfd throughput, times 100)`);
  w();
  w('A better driver burns less of the stream:');
  w('| heat rate Btu per hp hr | fuel MMscfd | thermal efficiency percent | share of throughput percent |');
  w('| --- | --- | --- | --- |');
  s14.heatRates.forEach((r) => w(`| ${e6(r.heatRateBtuHpHr)} | ${f9(r.fuelMMscfd)} | ${e6(r.thermalEfficiencyPct)} | ${e6(r.sharePctDerived)} |`));
  w('The last column is derived on each row.');
  w();
  w('THE COMPRESSION CONSTANTS, measured out of the engine the same way:');
  w(`- standard cubic feet per lbmol, from the mass flow of one MMscfd of a gravity-one gas: ${n(s14.measured.scfPerLbmol, 6)}`);
  w(`- the molecular weight of air, from the same return once the first is known: ${n(s14.measured.airMw, 6)}`);
  w(`- the universal gas constant in ft lbf per lbmol degR, from the polytropic head over its own z, temperature, exponent and ratio group: ${n(s14.measured.gasConstantFtLbfLbmolR, 6)}`);
  w(`- the same constant as gasProperties.js carries it, times 144 square inches per square foot: ${n(s14.measured.exportedGasConstantTimes144Derived, 6)} (engine export, derived on this line)`);
  w(`- the quotient of those two: ${n(s14.measured.gasConstantQuotientDerived, 15)} (derived from the two rows above), and their difference is ${s14.measured.gasConstantDifferenceDerived} ft lbf per lbmol degR (derived the same way). ONE VALUE OF ONE CONSTANT, in two modules where one imports from the other. A package that holds two opinions about a constant cannot say which of them any answer carries, however small the gap.`);
  w(`- ft lbf per minute per horsepower, from the mass, head, power and efficiency of one stage: ${n(s14.measured.ftLbfPerMinutePerHp, 6)}`);
  w(`- Btu per horsepower hour, from the thermal efficiency at a heat rate of ${e6(s14.measured.heatRateProbe)}: ${n(s14.measured.btuPerHpHr, 12)}`);
  w(`- the same constant again, from the heat rate the engine refuses below, found by halving: ${n(s14.measured.btuPerHpHrFromRefusal, 12)}. A driver that burns less than a horsepower-hour to make one would be more than 100 percent efficient, so the refusal boundary IS the constant, and the two routes differ by ${s14.measured.btuPerHpHrDifferenceDerived} (derived from the two rows above).`);
  w(`- the ratio of the standard pressure to the standard temperature that the inlet-volume function uses: ${n(s14.measured.baseQuotientPsiaPerR, 12)} psia per degR (derived from one acfm return, its own z, its pressure and its temperature). That quotient is all the volume route reveals about its base; the two figures cannot be separated from outside it.`);
  w(`- ONE STANDARD BASE FOR THE MODULE. The mass-flow route above gives ${n(s14.measured.scfPerLbmol, 12)} standard cubic feet per lbmol, and the gas constant measured on this page turns that back into the same pressure-over-temperature quotient the volume route uses: ${n(s14.measured.baseQuotientFromMassRouteDerived, 12)} psia per degR (derived from two rows above). The difference between the two routes is ${s14.measured.baseQuotientDifferenceDerived} psia per degR (derived from the two figures on this line). The same MMscfd is now one molar quantity whether it becomes a mass flow or an inlet volume.`);
  w(`- the Rankine offset, exported: ${n(s14.measured.rankineOffset, 6)}. The molecular weight of air, exported: ${n(s14.measured.airMwExported, 6)}. compression.js reads both from gasProperties.js and keeps no copy of either.`);
  w();

  // Section 15
  w('# SECTION 15: What a refusal is, and where each guard turns over (owned by Expert m05)');
  w();
  w('EVERY REFUSAL IS A RETURNED OBJECT CARRYING AN `error` STRING, and it names the input that is actually wrong. Neither module throws. A caller checks a property rather than catching, and the property it checks is the only check most callers make, which is why a non-finite value slipped past it is worse than no guard at all.');
  w('Note on reading these: a NaN and an Infinity have no spelling in JSON and both come out as null through JSON.stringify. The lines below are printed by a hand-rolled serialiser for that reason, so they say NaN and Infinity where the engine returned them.');
  w();
  w('The pump module, on the inputs where handing back a number rather than a refusal would be the dangerous answer:');
  s15.pumpProbes.forEach((r) => w(`- ${r.label}: ${shape(r.shape)}`));
  w(`- a system curve with no static head: ${shape(s15.systemNoStatic)}`);
  w('  That one is the sharpest of the set: a curve object can look healthy and carry a correct coefficient while the function hanging off it is unusable, so this guard catches at construction what would otherwise surface only at the call. A static head may be NEGATIVE, because the destination can sit below the pump, so the guard is finiteness and not positivity, and the message says so.');
  w();
  w('The compression module, the same way:');
  s15.compressionProbes.forEach((r) => w(`- ${r.label}: ${shape(r.shape)}`));
  w();
  w(`THE ${s15.bareNumberNames.length} BARE-NUMBER FUNCTIONS of Section 1 have nowhere to put an error key, so they hold a documented contract instead: NaN when the inputs cannot be read, never an Infinity and never a plausible number. They are ${s15.bareNumberNames.join(', ')}, and each appears below with at least one input it must refuse.`);
  w('| function | input | returns |');
  w('| --- | --- | --- |');
  s15.nanContract.forEach((r) => w(`| ${r.fn} | ${r.label} | ${String(r.returns)} |`));
  w('Read the two control rows against the rest. A contract that says NaN is only worth anything if the same function returns a real number when it can, and those two rows are what makes the others mean something.');
  w();
  w('FOUR FAULTS, FOUR REFUSALS, and each names the input that is actually wrong rather than the one a reader would check first:');
  s15.fourFaults.forEach((r) => w(`- ${r.label}: ${soft(r.error)}`));
  w('Two of those messages carry the value that was typed, because two typed values reach one guard from opposite directions: a 0 and a 1.5 are not the same mistake, and a reader told only the rule has to work out which of them they made. A refusal that names the wrong cause sends a reader to fix an input that was correct, and that is worse than a bare refusal.');
  w();
  w('AND THE SAME FAULT ASKED THROUGH BOTH FUNCTIONS, SO THE MESSAGE CANNOT DRIFT BETWEEN THEM:');
  w(`- a per-stage ratio limit of one, through stageCount: ${shape(s15.ratioOneShape)}`);
  w(`- the same through compressorTrain: ${soft(s15.ratioOneThroughTrain)}`);
  w('The rate, the suction pressure, the gas gravity and k in that call are all good. The fault is the ratio limit, and the message is about the ratio limit.');
  w();
  w('THE COMPRESSIBILITY WINDOW. engines/facilities/separatorSizing.js in this same package exports its DAK validity bounds and refuses outside them by name. This module now IMPORTS those same bounds rather than restating them, which is the same one-owner rule the gas constant of Section 14 is settled by.');
  w('| probe | suction psia | suction degF | Ppr | Tpr | z at suction | solver says converged | error key | gas hp |');
  w('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  s15.window.forEach((r) => {
    w(`| ${r.label} | ${e6(r.pSuctionPsia)} | ${r4(r.tSuctionF)} | ${n(r.ppr, 6)} | ${n(r.tpr, 6)} | ${r.refused ? 'refused' : n(r.z1, 9)} | ${r.solverConverged} | ${r.refused ? 'present' : 'absent'} | ${r.refused ? 'refused' : r4(r.gasHp)} |`);
  });
  w('The published window is a reduced temperature from 1.0 to 3.0 and a reduced pressure up to 30. Two of those three rows sit outside it and are refused; the convergence column is why reading that flag would never have caught either, because the solver is perfectly happy at both and reports so.');
  w('The refusal carries the reduced coordinates and the state they were taken at, and it says which end of the train died:');
  s15.windowRefusals.forEach((r) => w(`- ${r.label}: Ppr ${n(r.ppr, 6)}, Tpr ${n(r.tpr, 6)}, at ${e6(r.atPsia)} psia and ${r4(r.atF)} degF, state "${r.state}"`));
  w(`A suction BELOW the reduced pressure the fit data start at is accepted rather than refused, exactly as separatorSizing accepts it, and it is noted instead: ${s15.lowPressureNote === null ? 'no note' : `"${s15.lowPressureNote}"`}`);
  w('The surface runs to the ideal-gas limit as the reduced pressure goes to zero, so a low-pressure suction is an ordinary machine and not an extrapolation. A window has two kinds of edge and they are not the same kind.');
  w();

  // Section 16
  w('# SECTION 16: The published golden cases, and the engine beside them (shared by Associate m06, Professional m06 and Expert m06)');
  w();
  w(`The pump goldens carry ${s16.pumpCases} cases in five blocks and the compression goldens ${s16.compressionCases} cases in two, which is ${s16.totalCases} published cases for the ${s16.exportedFunctions} exported functions of the two modules (both counts read off the files themselves).`);
  w();
  w('Published curve fits:');
  s16.curves.forEach((r) => {
    w(`- curve ${r.index}: c0 ${e6(r.c0)} against golden ${e6(r.goldenC0)}, c1 ${e6(r.c1)} against golden ${e6(r.goldenC1)}, c2 ${e6(r.c2)} against golden ${e6(r.goldenC2)}, shutoff ${e6(r.shutoffHeadFt)} against golden ${e6(r.goldenShutoffHeadFt)}`);
    w(`  the golden also records the maximum orthogonality residual of the least-squares solve, ${r.goldenMaxOrthogonalityResidual} (golden), which is the property that makes it a least-squares fit at all; the engine reports the conditioning of that solve as ${n(r.conditionNumber, 6)} and its R squared as ${n(r.rSquared, 9)}`);
  });
  w();
  w('Published duty points:');
  s16.duty.forEach((r) => w(`- duty ${r.index} (static ${e6(r.staticHeadFt)} ft, friction ${e6(r.frictionHeadFt)} ft at ${e6(r.atFlowGpm)} gpm): ${e6(r.qGpm)} gpm against golden ${e6(r.goldenQGpm)}, ${e6(r.headFt)} ft against golden ${e6(r.goldenHeadFt)}`));
  w();
  w(`Published power cases. The golden was written through SI watts at a water density its own oracle states, which is not the density the horsepower packaging of Section 4 carries, so the two do NOT agree to machine precision and the engine gate is written with a tolerance. The worst quotient across the ${s16.powerCount} power cases below is ${n(s16.worstPowerQuotient, 9)} and across the ${s16.npshCount} NPSH cases after them ${n(s16.worstNpshQuotient, 9)}, so the disagreement is ${s16.worstDisagreementDerived} at its largest (all derived from the quotient columns below). The quotient column on each row is the size of it:`);
  s16.power.forEach((r) => w(`- power ${r.index} (${e6(r.qGpm)} gpm, ${e6(r.headFt)} ft, gravity ${e6(r.sg)}, efficiency ${e6(r.efficiency)}): brake ${e6(r.brakeHp)} hp against golden ${e6(r.goldenBrakeHp)} hp, quotient ${n(r.quotientDerived, 9)} (derived)`));
  w();
  w('Published NPSH cases, written the same way:');
  s16.npsh.forEach((r) => w(`- npsh ${r.index} (${e6(r.suctionPressurePsia)} psia over ${e6(r.vapourPressurePsia)} psia, gravity ${e6(r.sg)}): ${e6(r.npshaFt)} ft against golden ${e6(r.goldenNpshaFt)} ft, quotient ${n(r.quotientDerived, 9)} (derived)`));
  w();
  w('Published viscosity cases:');
  s16.viscosity.forEach((r) => w(`- viscosity ${r.index} (${e6(r.viscosityCSt)} cSt at ${e6(r.speedRpm)} rpm): B ${n(r.B, 9)} against golden ${n(r.goldenB, 9)}, flow factor ${n(r.cQ, 9)} against golden ${n(r.goldenCQ, 9)}, efficiency factor ${n(r.cEta, 9)} against golden ${n(r.goldenCEta, 9)}`));
  w();
  w('Published staging cases:');
  s16.staging.forEach((r) => w(`- staging ${r.index} (${e6(r.pSuctionPsia)} to ${e6(r.pDischargePsia)} psia at ${r4(r.tSuctionF)} degF, k ${e6(r.k)}): ${r.stages} ${r.stages === 1 ? 'stage' : 'stages'} against golden ${r.goldenStages}, governed by ${r.governedBy}, ratio per stage ${f9(r.ratioPerStage)}`));
  w();
  w('Published stage cases:');
  s16.stages.forEach((r) => w(`- stage ${r.index} (${e6(r.qMMscfd)} MMscfd, ratio ${e6(r.ratio)}, k ${e6(r.k)}, efficiency ${e6(r.polytropicEfficiency)}): head ${r4(r.headPolyFtLbfLbm)} against golden ${r4(r.goldenHeadPolyFtLbfLbm)}, discharge ${r4(r.tDischargeF)} degF against golden ${r4(r.goldenTDischargeF)}, gas hp ${r4(r.gasHp)} against golden ${r4(r.goldenGasHp)}, z average ${n(r.zAvg, 9)} against golden ${n(r.goldenZAvg, 9)}`));
  w();
  w();
  w('EVERY PUBLISHED FIELD, CHECKED RATHER THAN SAMPLED. The four stage fields quoted above are the readable ones; the file carries more, and each of them is compared here against the engine on every case, with the fields the file states as inputs left out because they are what the case IS:');
  w('| published stage field | cases | bit for bit | worst relative gap |');
  w('| --- | --- | --- | --- |');
  s16.fieldTable.forEach((r) => w(`| ${r.key} | ${r.cases} | ${r.bitForBit} | ${r.worst} |`));
  w(`${s16.stageFieldCount} published stage fields across ${s16.stageCaseCount} cases. ${s16.bitForBitCount} of them come back BIT FOR BIT (${s16.bitForBitKeys.join(', ')}) and ${s16.notBitForBitCount} do not, and neither answer is a failure: the file is written by a Python oracle carrying fifty digits and the engine is double precision, so on a field where the two routes take different arithmetic they land a little apart. The worst gap on the table is ${s16.stageWorst} on ${s16.stageWorstKey}.`);
  w('A gate against a golden therefore has to carry a tolerance, and the tolerance has to be chosen from the size of the disagreement the two routes really have rather than from what looks tidy. Demanding equality on this table would fail on arithmetic rather than on error. The other end of that choice is the one worth thinking about: a tolerance loose enough to swallow a mis-transcribed constant catches nothing at all, so the useful question about any tolerance is what error it is still small enough to see.');
  w();
  w('# HELD FOR LITERATURE, taught as a limit and never graded: all of them. Every one of those published cases was written by an oracle. There is no measured pump test, no vendor performance run and no field compressor datasheet anywhere in this course.');
  w();

  // Section 17
  w('# SECTION 17: What this course teaches as limits and never as answers (shared by Associate m06, Professional m06 and Expert m06)');
  w();
  w('# The tier readings, Associate m06, Professional m06 and Expert m06, assemble the sections above; they introduce no number of their own. The list below is the eight held items, and it is the only count on this page.');
  w();
  w('Eight things are HELD FOR LITERATURE. Each is used, each is printed, and none of them decides a graded answer anywhere in this course.');
  w();
  w('1. The Hydraulic Institute viscosity correction of Section 10. Empirical, unsourced in this repository, and the head factor is taken equal to the flow factor at best efficiency.');
  w('2. The impeller trim shortfall model of Section 8. The engine calls it "the published shortfall" and names no publication. Its power leg is left as the ideal cube for that same reason, and the efficiency the return implies is computed and reported rather than modelled.');
  w('3. The operating-region bands of Section 5, at 50, 70, 120 and 140 percent of best efficiency flow.');
  w('4. The NPSH margin rule of Section 7, the larger of 3 ft and 35 percent of required. Both halves of it are measurable out of the engine, and Section 7 measures them; the rule itself is customary.');
  w('5. The machine-screening thresholds of Section 14.');
  w('6. The 300 degF DEFAULT discharge limit of Sections 11, 12 and 13. It is the figure the engine uses when the caller states none, and the warning is measured against whatever the caller does state.');
  w('7. What the implied water density of Section 4 is away from real water. The packagings are measurable; the handbook figure is not here.');
  w('8. Every one of the published golden cases of Section 16. The affinity speed band of Section 8 is held on the same footing: it is a sanity bound and no publication here says where the laws stop describing a real machine.');
  w();
  w('And four things are not in these engines at all, so the course names the seam rather than papering over it:');
  w('- there is no compressor surge line, no surge margin, no recycle valve and no anti-surge control anywhere in the package;');
  w('- there is no seal and no bearing calculation. Section 5 quotes the engine saying that bearing and seal life shorten below 70 percent of best efficiency flow, and that sentence is the whole of what this package knows about it;');
  w('- there is no machine curve, no wheel selection, no valve dynamics and no rod loading;');
  w('- there is no required-NPSH-against-flow curve, which is why Section 5\'s own note says to read the vendor curve at the duty flow before the suction margin means anything.');
  w();
  w('What this course DOES answer is the duty a vendor should be quoting against, the power and the stage count to expect, the suction margin the selection has to survive, and the reasons behind all four.');

  return `${out.join('\n')}\n`;
};

/** Split a digest into its preamble and its seventeen sections, keyed by number. */
const sections = (text) => {
  const out = {};
  let key = 'preamble';
  text.split('\n').forEach((line) => {
    const hit = line.match(/^# SECTION (\d+):/);
    if (hit) key = `S${hit[1]}`;
    (out[key] ||= []).push(line);
  });
  return Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.join('\n')]));
};

const readDigest = () => fs.readFileSync(DIGEST, 'utf8');
const SECTION_KEYS = ['preamble', ...Array.from({ length: 17 }, (_, i) => `S${i + 1}`)];

/** Every reader, one per digest section. */
const READERS = [
  'engineScope', 'twoCurves', 'dutyPointSolved', 'powerHeadPressure', 'whereTheDutyLanded',
  'suctionSide', 'marginAndRule', 'speedAndTrim', 'crossingAndMap', 'twoPumpsAndWater',
  'stageIsNotAPump', 'stageCountAndLimit', 'trainAndCooling', 'machineDriverFuel',
  'refusalContract', 'publishedGoldens', 'heldItems',
];

// ---------------------------------------------------------------------------
// 0. The digest on disk is a real digest, the mirror matches it, and the lab
//    carries the dump's fields.
// ---------------------------------------------------------------------------

describe('the digest on disk, the in-repo mirror and the teaching fields', () => {
  it('the digest carries a plausible number of literals, so it is not empty or mid-rebuild', () => {
    const literals = readDigest().match(/-?\d+(?:\.\d+)?/g) || [];
    expect(literals.length, 'digest.txt is empty or mid-rebuild').toBeGreaterThan(1000);
    expect(Object.keys(sections(readDigest()))).toEqual(SECTION_KEYS);
  });

  it('THE MIRROR GATE: tools/course-waves/rotating is byte-identical to the wave directory', () => {
    // FC1 and FC2 both read /root only, so a mirror that fell behind would not
    // have been noticed by anything. This gate is the one that notices.
    // The whole tooling, not only the numbers: the five-migration ladder is
    // generated by gen_course.py, gen_golive.py and gen_seeds.sh and verified
    // by verify_sql.py, so a generator repaired in the wave directory and not
    // mirrored would leave the repo holding a generator that produces
    // something else. The three tier headers are here for the same reason.
    const files = ['digest.txt', 'fields.json', 'precision.json', 'fc3_dump.mjs', 'fc3_fields.mjs', 'fc3_fields_capstone.mjs', 'fc3_capstone.mjs', 'wave.json', 'structure.py',
      'gen_course.py', 'gen_golive.py', 'gen_seeds.sh', 'dryrun_fc3.sh', 'apply_fc3_rotating.sh', 'verify_sql.py',
      'hdr_beginner.txt', 'hdr_intermediate.txt', 'hdr_advanced.txt'];
    // FIRST, every file is committed and carries something. A byte comparison
    // says nothing about a file that is absent from both sides, and a list that
    // has quietly shrunk compares fewer files each time, so the count is pinned.
    expect(files).toHaveLength(18);
    files.forEach((f) => {
      const q = path.join(MIRROR, f);
      expect(fs.existsSync(q), `tools/course-waves/rotating/${f} is not committed`).toBe(true);
      expect(fs.statSync(q).size, `tools/course-waves/rotating/${f} is empty`).toBeGreaterThan(0);
    });
    // THEN the comparison, against the live wave directory when this machine has
    // one. A CI runner has none, and there the gate states the other true thing:
    // that the files every gate above read ARE the committed ones, so all of them
    // are statements about what ships.
    if (LIVE_WAVE) {
      files.forEach((f) => {
        const a = fs.readFileSync(path.join(LIVE_WAVE, f), 'utf8');
        const b = fs.readFileSync(path.join(MIRROR, f), 'utf8');
        expect(b, `tools/course-waves/rotating/${f} has fallen behind ${LIVE_WAVE}`).toBe(a);
      });
      process.stdout.write(`mirror gate: ${files.length} file(s) compared byte for byte against ${LIVE_WAVE}\n`);
    } else {
      expect(path.resolve(WAVE), 'this suite did not read the committed copy').toBe(path.resolve(MIRROR));
      process.stdout.write(`mirror gate: no live wave directory on this machine, so the `
        + `${files.length} committed file(s) were confirmed present and are the ones this suite read\n`);
    }
  });

  it('the teaching fields are copied verbatim from fc3_fields.mjs, which fc3_dump.mjs imports', () => {
    const src = fs.readFileSync(FIELDS_MJS, 'utf8');
    const dump = fs.readFileSync(DUMP_MJS, 'utf8');
    const lab = LAB_SOURCE();
    const NAMES = ['OKONO_POINTS', 'OKONO_SYSTEM', 'OKONO_SG', 'OKONO_EFFICIENCY',
      'OKONO_MOTOR_EFFICIENCY', 'OKONO_Q_MAX_GPM', 'OKONO_BEP_GPM', 'OKONO_FRICTION_SYSTEM',
      'OKONO_TOO_HIGH_SYSTEM', 'NOT_A_PUMP_CURVE', 'FLAT_CURVE', 'OKONO_SUCTION', 'OKONO_NPSHR_FT',
      'OKONO_SUCTION_SWEEP_PSIA', 'FLASHING_SUCTION', 'FLASHING_SUCTION_BELOW', 'OKONO_SPEED_SWEEP',
      'OKONO_TRIM_SWEEP', 'TRIM_AT_SHORTFALL_START', 'TRIM_JUST_INSIDE_SHORTFALL', 'TRIM_AT_WARNING',
      'TRIM_JUST_PAST_WARNING', 'TRIM_AT_CAP', 'TRIM_PAST_CAP', 'OKONO_PARALLEL_COUNTS',
      'OKONO_SERIES_COUNTS', 'REGION_FRACTIONS', 'OKONO_VISC_SWEEP_CST', 'OKONO_BEP_HEAD_FT',
      'OKONO_SPEED_RPM', 'VISC_B_WARNING', 'VISC_CETA_WARNING', 'SOKU', 'SOKU_HEAT_RATE_BTU_HP_HR',
      'SOKU_LHV_BTU_SCF', 'SOKU_DISCHARGE_SWEEP_PSIA', 'SOKU_COOL_TO_SWEEP_F', 'SOKU_HOT',
      'SOKU_STAGE', 'SOKU_ETA_SWEEP', 'SOKU_K_SWEEP', 'SOKU_RATIO_SWEEP', 'SCREEN_DUTIES',
      'STAGE_CAP_DUTY', 'ACFM_PRESSURE_SWEEP_PSIA', 'DRIVER_HEAT_RATE_SWEEP', 'DAK_COLD_PROBE',
      'DAK_HIGH_P_PROBE', 'DAK_IN_WINDOW_PROBE', 'UNGUARDED_PUMP_PROBES', 'UNGUARDED_NPSH_PROBES',
      'UNGUARDED_COMPRESSION_PROBES', 'IDENTITY_PAIRS'];
    // The two warning thresholds are stated in the fields file for the oracle
    // and are not imported by the dump; every other name is imported by name.
    const NOT_IMPORTED_BY_THE_DUMP = ['VISC_B_WARNING', 'VISC_CETA_WARNING'];
    NAMES.forEach((name) => {
      const a = src.match(new RegExp(`^export const ${name} = ([\\s\\S]*?);$`, 'm'));
      const b = lab.match(new RegExp(`^export const ${name} = ([\\s\\S]*?);$`, 'm'));
      expect(a, `${name} in fc3_fields.mjs`).not.toBeNull();
      expect(b, `${name} in the lab`).not.toBeNull();
      expect(b[1], name).toBe(a[1]);
      if (!NOT_IMPORTED_BY_THE_DUMP.includes(name)) {
        expect(dump, `${name} is imported by the dump`).toContain(name);
      }
    });
    expect(NAMES).toHaveLength(53);
  });

  it('the published goldens are both files, whole', () => {
    const c = L.goldenCounts();
    expect(c.pumps).toBe(10);
    expect(c.compression).toBe(6);
    expect(c.pumpBlocks).toBe(5);
    expect(c.compressionBlocks).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// 1 to 17. The rebuilt digest, section by section and then whole.
// ---------------------------------------------------------------------------

describe('THE DIGEST, REBUILT FROM LAB RETURN VALUES, BYTE FOR BYTE', () => {
  const titles = {
    preamble: 'the title, the units line and the export counts',
    S1: 'what these engines size, every refusal, and the five bare numbers',
    S2: 'two curves, the conditioning, and an R squared that can be null',
    S3: 'the duty solved, the report it leaves behind, and the flag that can be false',
    S4: 'power, pressure and the two packagings measured out of the engine',
    S5: 'the four bands and both sides of every boundary',
    S6: 'NPSH available from its three parts, and the flashing warning',
    S7: 'the margin rule measured, its three severities, and a verdict with no input',
    S8: 'a speed change against a trim, and the slack under two boundaries',
    S9: 'the crossing and the affinity map, side by side',
    S10: 'parallel, series, and the Hydraulic Institute correction',
    S11: 'a stage, both heads, and an identity that is not a check',
    S12: 'the stage count, the limit that governed, and a refusal with its evidence',
    S13: 'the train, its cooling, and the trade that reverses',
    S14: 'the inlet volume, the screen, the fuel and the measured constants',
    S15: 'what a refusal is, the NaN contract, and the window one module declares',
    S16: 'the published goldens, and every published field checked rather than sampled',
    S17: 'the eight held items and the four scope seams',
  };
  const built = sections(buildDigest());
  const onDisk = sections(readDigest());

  SECTION_KEYS.forEach((k) => {
    it(`${k === 'preamble' ? 'Preamble' : `Section ${k.slice(1)}`}: ${titles[k]}`, () => {
      expect(built[k], `${k} rebuilt`).toBeDefined();
      expect(built[k]).toBe(onDisk[k]);
    });
  });

  it('the whole digest, every line, is the lab', () => {
    const text = buildDigest();
    if (process.env.FC3_WRITE_BUILT) {
      // The timezone gate's child hands its rebuild back through this file,
      // with the zone it actually ran in so the parent can prove it moved.
      fs.writeFileSync(process.env.FC3_WRITE_BUILT, JSON.stringify({
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        offsetMinutes: new Date('2026-09-16T00:00:00Z').getTimezoneOffset(),
        text,
      }));
    }
    expect(text.split('\n').length).toBe(readDigest().split('\n').length);
    expect(text).toBe(readDigest());
  });

  it('NEGATIVE CONTROL: one engine value moved by a single unit in the last printed place is a failed section', () => {
    const duty = L.dutyPointSolved();
    const good = `OKONO against its stated system: the curves cross at ${e6(duty.qGpm)} gpm`;
    const nudged = `OKONO against its stated system: the curves cross at ${e6(duty.qGpm + 1e-6)} gpm`;
    const text = buildDigest();
    expect(text, 'the control line is not in the digest any more').toContain(good);
    const moved = text.replace(good, nudged);
    expect(sections(moved).S3).not.toBe(onDisk.S3);
    expect(sections(moved).S4).toBe(onDisk.S4);
    expect(sections(moved).S2).toBe(onDisk.S2);
  });
});

// ---------------------------------------------------------------------------
// What the teaching fields show: the results the course is built on.
// ---------------------------------------------------------------------------

describe('what the teaching fields show', () => {
  it('THE CONVERGED GATE: the flag is made of the residual as well as the bracket, and one case makes it false', () => {
    const d = L.dutyPointSolved();
    // The healthy solve: converged, on a collapsed bracket and a residual at
    // the resolution of the numbers.
    expect(d.converged).toBe(true);
    expect(d.bracketGpm).toBeLessThan(1e-9);
    expect(Math.abs(d.residualFt)).toBeLessThan(1e-6);
    // The case that makes it FALSE. A curve that goes non-finite inside the
    // bracket marches the search to the bottom of that stretch: the bracket
    // collapses anyway, so a flag made only of the bracket COULD NEVER BE
    // FALSE and would validate nothing.
    expect(d.poisoned.converged).toBe(false);
    expect(d.poisoned.qGpm).toBeCloseTo(900, 9);
    expect(d.poisoned.awayFromTrueDerivedGpm).toBeCloseTo(334.452969, 6);
    expect(d.poisoned.bracketGpm).toBeLessThan(1e-12);
    expect(d.poisoned.bracketGpm).toBeGreaterThan(0);
    expect(d.poisoned.residualFt).toBeCloseTo(154.781645, 6);
    expect(d.poisoned.bracketGpm).toBeCloseTo(1.14e-13, 15);
    // NEGATIVE CONTROL on the flag itself: the bracket half alone cannot tell
    // the two solves apart, and the residual half can.
    const bracketOnly = (x) => x.bracketGpm < 1e-9;
    expect(bracketOnly(d)).toBe(true);
    expect(bracketOnly(d.poisoned), 'a bracket-only flag calls the poisoned solve converged').toBe(true);
    expect(Math.abs(d.residualFt) < 1e-6).toBe(true);
    expect(Math.abs(d.poisoned.residualFt) < 1e-6).toBe(false);
  });

  it('FC3-0: the duty solve reports the bracket, the residual, the halvings and the flag', () => {
    const d = L.dutyPointSolved();
    ['bracketGpm', 'residualFt', 'iterations', 'converged', 'systemHeadFt'].forEach((k) => {
      expect(d[k], `the solve does not report ${k}`).not.toBeUndefined();
    });
    expect(Number.isInteger(d.iterations)).toBe(true);
    expect(d.iterations).toBeGreaterThan(0);
    expect(d.iterations).toBeLessThanOrEqual(200);
    // The report changed nothing: a blind 200 halvings lands in the same place.
    expect(Math.abs(d.blindDifferenceDerivedGpm)).toBeLessThan(1e-9);
  });

  it('FC3-0: a curve that does not droop is refused a duty point, and the refusal is the engine\'s', () => {
    const d = L.dutyPointSolved();
    expect(d.risingRefusal).toMatch(/does not fall with flow/);
    expect(L.twoCurves().rising.droops).toBe(false);
    expect(L.twoCurves().droops).toBe(true);
    // And a stack of that curve refuses for the same reason.
    expect(L.twoPumpsAndWater().stackDroopRefusal).toBe(d.risingRefusal);
  });

  it('FC3-0: the fit reports its own conditioning, and an R squared that can be null', () => {
    const c = L.twoCurves();
    expect(c.conditionNumber).toBeGreaterThan(300);
    expect(c.conditionNumber).toBeLessThan(400);
    expect(c.conditionCount).toBe(7);
    expect(c.conditionMin).toBeCloseTo(304.750000, 6);
    expect(c.conditionMax).toBeCloseTo(366.680892, 6);
    // Three identical heads have no variance to explain, so R squared is null
    // rather than a number. The rising set still fits and still reports one.
    expect(c.flat.rSquared).toBeNull();
    expect(Number.isFinite(c.rising.rSquared)).toBe(true);
    expect(Number.isFinite(c.rSquared)).toBe(true);
  });

  it('FC3-0: the twelve-stage refusal carries its evidence', () => {
    const s = L.stageCountAndLimit();
    expect(s.cap.error).toMatch(/12 equal stages/);
    expect(s.cap.triedStages).toBe(12);
    expect(Number.isFinite(s.cap.coolestReachedF)).toBe(true);
    expect(s.cap.maxDischargeF).toBe(L.STAGE_CAP_DUTY.maxDischargeF);
    expect(s.cap.hottestInletF).toBeCloseTo(L.STAGE_CAP_DUTY.tSuctionF, 9);
    expect(Number.isFinite(s.cap.overallRatio)).toBe(true);
    expect(s.cap.gapDerivedF).toBeGreaterThan(0);
  });

  it('FC3-0: the DAK refusals carry ppr, tpr, atPsia, atF and state', () => {
    const r = L.refusalContract();
    expect(r.windowRefusals).toHaveLength(2);
    r.windowRefusals.forEach((x) => {
      ['ppr', 'tpr', 'atPsia', 'atF', 'state'].forEach((k) => {
        expect(x[k], `${x.label} carries no ${k}`).not.toBeUndefined();
      });
      expect(typeof x.state).toBe('string');
      expect(Number.isFinite(x.ppr)).toBe(true);
      expect(Number.isFinite(x.tpr)).toBe(true);
    });
    // The z solver is perfectly happy at both, which is why reading its own
    // convergence flag would never have caught either.
    expect(r.window.filter((x) => x.refused)).toHaveLength(2);
    expect(r.window.every((x) => x.solverConverged === true)).toBe(true);
    expect(r.window.find((x) => !x.refused).label).toMatch(/inside the window/);
  });

  it('THE NAN GATE: the five bare-number exports keep their documented contract', () => {
    const r = L.refusalContract();
    expect(r.bareNumberNames).toEqual([
      'pumps.headFtToPsi', 'pumps.psiToHeadFt', 'compression.polytropicExponentRatio',
      'compression.dischargeTempR', 'compression.actualInletCfm',
    ]);
    expect(L.engineScope().bareNumberNames).toEqual(r.bareNumberNames);
    const controls = r.nanContract.filter((x) => x.label.includes('as a control'));
    const refusals = r.nanContract.filter((x) => !x.label.includes('as a control'));
    expect(controls).toHaveLength(2);
    expect(refusals).toHaveLength(6);
    refusals.forEach((x) => {
      expect(typeof x.returns, `${x.fn} on ${x.label} did not return a number`).toBe('number');
      expect(Number.isNaN(x.returns), `${x.fn} on ${x.label} returned ${x.returns} rather than NaN`).toBe(true);
      // never an Infinity and never a plausible number: both are covered by
      // the NaN assertion, and both are asserted again here by name so a
      // future change to the contract has to argue with this line.
      expect(x.returns === Infinity || x.returns === -Infinity).toBe(false);
      expect(Number.isFinite(x.returns)).toBe(false);
    });
    controls.forEach((x) => {
      expect(Number.isFinite(x.returns), `${x.fn} refuses a readable case`).toBe(true);
    });
    // Each of the five appears with at least one input it must refuse.
    r.bareNumberNames.forEach((name) => {
      expect(refusals.some((x) => x.fn === name), `${name} has no refusing input`).toBe(true);
    });
  });

  it('the margin rule and the affinity band are both measured out of the engine, not typed', () => {
    const m = L.marginAndRule();
    expect(m.floorFt).toBeCloseTo(3, 9);
    expect(m.fraction).toBeCloseTo(0.35, 9);
    expect(m.crossoverFt).toBeCloseTo(8.571428571, 9);
    expect(m.crossoverByQuotientDerivedFt).toBeCloseTo(m.crossoverFt, 6);
    expect(m.rule.map((r) => r.boundHalf)).toEqual(['the floor', 'the fraction', 'the fraction', 'the fraction']);
    const s = L.speedAndTrim();
    expect(s.bandLow).toBeCloseTo(0.5, 9);
    expect(s.bandHigh).toBeCloseTo(1.5, 9);
    // The laws are exact: the head quotient IS the ratio squared and the power
    // quotient IS the ratio cubed, subtracted rather than described.
    s.speed.forEach((r) => {
      expect(Math.abs(r.headLessSquareDerived), `speed ${r.speedRatio}`).toBeLessThan(1e-12);
      expect(Math.abs(r.powerLessCubeDerived), `speed ${r.speedRatio}`).toBeLessThan(1e-12);
    });
  });

  it('a crossing and an affinity map are two different answers, and the digest prints both', () => {
    const c = L.crossingAndMap();
    expect(c.at95.shortfallPct).toBe(0);
    expect(c.at95.quotientDerived).not.toBeCloseTo(1, 4);
    // The map DOES lie on the new curve; it is simply not where the machine runs.
    expect(Math.abs(c.at95.onCurveDifferenceDerivedFt)).toBeLessThan(1e-9);
  });

  it('two machines in parallel buy far less than twice one machine', () => {
    const p = L.twoPumpsAndWater();
    const two = p.parallel.find((r) => r.machines === 2);
    expect(two.overOneMachineDerived).toBeGreaterThan(1);
    expect(two.overOneMachineDerived).toBeLessThan(1.5);
    expect(p.halfInParallel).toMatch(/whole number/);
    expect(p.halfInSeries).toMatch(/whole number/);
    // A series stack reads back exactly three times one machine.
    expect(p.readBack.quotientDerived).toBeCloseTo(3, 12);
  });

  it('the trade between cooling and power is a statement about a FIXED stage count', () => {
    const t = L.trainAndCooling();
    expect(t.trade.holds).toBe(true);
    expect(t.trade.crossings).toBeGreaterThan(0);
    // Across the stage-count change it reverses: cooling up, power down.
    expect(t.trade.atCrossingCoolingMMBtuHr).toBeGreaterThan(t.trade.beforeCrossingCoolingMMBtuHr);
    expect(t.trade.atCrossingGasHp).toBeLessThan(t.trade.beforeCrossingGasHp);
    // And the hot case pays its warmer approach in MACHINES rather than in
    // temperature: nothing runs over the limit it was staged against.
    expect(t.hotCase.stagesOverLimit).toBe(0);
    expect(t.hotCase.roomDerivedF).toBeGreaterThanOrEqual(0);
    expect(t.coolSweepOver).toBe(0);
    expect(L.stageCountAndLimit().sweepOverLimit).toBe(0);
  });

  it('the screen reaches four distinct branches, and each is reported rather than promised', () => {
    const m = L.machineDriverFuel();
    expect(m.screenCount).toBe(4);
    expect(m.distinctFirstReasonsDerived).toBe(4);
    m.screen.forEach((d) => {
      expect(typeof d.recommendation).toBe('string');
      expect(d.reasons.length).toBeGreaterThan(0);
    });
    // ONE value of one gas constant across two modules.
    expect(Math.abs(m.measured.gasConstantDifferenceDerived)).toBeLessThan(1e-9);
    expect(m.measured.gasConstantQuotientDerived).toBeCloseTo(1, 12);
    // And one standard base, whichever route reaches it.
    expect(m.measured.baseQuotientDifferenceDerived).toBe(0);
  });

  it('no reader reads the clock or a random number: the lab source makes no Date and draws nothing', () => {
    const src = LAB_SOURCE();
    expect(src).not.toMatch(/new Date\(/);
    expect(src).not.toMatch(/Date\.now/);
    expect(src).not.toMatch(/Math\.random/);
  });
});

describe('every reader is pure and deterministic', () => {
  it('there is one reader per digest section', () => {
    expect(READERS).toHaveLength(17);
    READERS.forEach((name) => expect(typeof LAB[name], name).toBe('function'));
  });

  it('two calls agree, and mutating a result changes neither the next call nor the fields', () => {
    READERS.forEach((name) => expect(LAB[name](), name).toEqual(LAB[name]()));
    const a = L.twoCurves();
    a.readback[0].fittedHeadFt = 999;
    expect(L.OKONO_POINTS[0].headFt).toBe(540);
    expect(L.twoCurves().readback[0].fittedHeadFt).not.toBe(999);
    const t = L.trainAndCooling();
    t.stages[0].gasHp = 1;
    expect(L.trainAndCooling().stages[0].gasHp).not.toBe(1);
    const h = L.heldItems();
    h.items[0].note = 'moved';
    expect(L.heldItems().items[0].note).not.toBe('moved');
  });
});

// ---------------------------------------------------------------------------
// THE REFUSAL GATE. Neither module throws: every refusal is a RETURNED OBJECT
// carrying the engine's own message, and not one of those messages is written
// as a literal anywhere in the lab or in a panel.
// ---------------------------------------------------------------------------

describe('THE REFUSAL GATE: every refusal is the engine\'s own returned message', () => {
  const allSoft = () => {
    const s1 = L.engineScope();
    const s15 = L.refusalContract();
    return [
      ...s1.pumpSoftStates,
      ...s1.compressionSoftStates,
      ...L.dutyPointSolved().staticSweep.filter((r) => r.refused).map((r) => ({ label: `static ${r.staticHeadFt}`, error: null })),
      { label: 'a duty on a curve that rises with flow', error: L.dutyPointSolved().risingRefusal },
      { label: 'a system the pump cannot start', error: L.dutyPointSolved().tooHigh.error },
      { label: 'a search limit below the crossing', error: L.dutyPointSolved().searchLimitRefusal },
      { label: 'half a pump in parallel', error: L.twoPumpsAndWater().halfInParallel },
      { label: 'half a pump in series', error: L.twoPumpsAndWater().halfInSeries },
      { label: 'a stack that does not droop', error: L.twoPumpsAndWater().stackDroopRefusal },
      ...L.machineDriverFuel().screenDomain,
      ...s15.fourFaults,
      { label: 'a ratio limit of one through the train', error: s15.ratioOneThroughTrain },
    ].filter((r) => r.error !== null);
  };

  it('there are refusals to check, so a rename cannot silently empty this gate', () => {
    expect(L.PUMP_SOFT_PROBES).toHaveLength(32);
    expect(L.COMPRESSION_SOFT_PROBES).toHaveLength(21);
    expect(L.UNGUARDED_PUMP_PROBES).toHaveLength(10);
    expect(L.UNGUARDED_COMPRESSION_PROBES).toHaveLength(13);
    expect(L.UNGUARDED_NPSH_PROBES).toHaveLength(5);
    expect(L.NAN_CONTRACT_PROBES).toHaveLength(8);
    expect(L.FOUR_FAULT_PROBES).toHaveLength(4);
    expect(L.BARE_NUMBER_PROBES).toHaveLength(5);
    expect(allSoft().length).toBeGreaterThanOrEqual(60);
  });

  it('every refusal carries a message, and the count of DISTINCT messages is measured rather than quoted', () => {
    const msgs = allSoft().map((r) => r.error);
    msgs.forEach((m, i) => {
      expect(typeof m, `${allSoft()[i].label}`).toBe('string');
      expect(m.length, `${allSoft()[i].label} carries no message`).toBeGreaterThan(10);
    });
    const distinct = new Set(msgs);
    // eslint-disable-next-line no-console
    console.log(`refusal gate: ${msgs.length} refusals carrying ${distinct.size} distinct engine messages`);
    expect(distinct.size).toBeGreaterThanOrEqual(30);
  });

  it('NEITHER MODULE THROWS: every probe returns rather than raising', () => {
    [...L.PUMP_SOFT_PROBES, ...L.COMPRESSION_SOFT_PROBES].forEach(([label, fn]) => {
      expect(() => fn(), `${label} threw instead of returning`).not.toThrow();
    });
  });

  it('NO refusal message is written as a literal in the lab: every one comes back from the engine', () => {
    const src = LAB_SOURCE();
    allSoft().forEach((r) => {
      expect(src.includes(r.error), `${r.label}: the message is retyped in the lab`).toBe(false);
    });
  });

  it('NO refusal message is written as a literal in a panel either', () => {
    allSoft().forEach((r) => {
      PANEL_FILES.forEach((file) => {
        const p = panelFile(file);
        expect(fs.readFileSync(p, 'utf8').includes(r.error), `${file} retypes: ${r.label}`).toBe(false);
      });
    });
  });

  it('CONTROL: calling the engine directly gives the same message the reader reports', () => {
    const reported = L.engineScope();
    L.PUMP_SOFT_PROBES.forEach(([label, fn], i) => {
      const direct = fn();
      expect(direct && direct.error ? direct.error : null, label).toBe(reported.pumpSoftStates[i].error);
    });
    L.COMPRESSION_SOFT_PROBES.forEach(([label, fn], i) => {
      const direct = fn();
      expect(direct && direct.error ? direct.error : null, label).toBe(reported.compressionSoftStates[i].error);
    });
  });

  it('CONTROL: a probe that is accepted reports no error, so the gate is not simply reading every call as a refusal', () => {
    const ok = L.refusalContract().window.find((x) => !x.refused);
    expect(ok).toBeDefined();
    expect(Number.isFinite(ok.gasHp)).toBe(true);
    expect(L.engineScope().pumpSoftStates.every((r) => r.error !== null)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// THE HELD GATE. Eight quantities taught as limits, never as answers.
// ---------------------------------------------------------------------------

describe('THE HELD GATE: the eight held quantities are marked, shown and never graded', () => {
  it('there are eight, each carrying the marker wording', () => {
    expect(L.HELD_ITEMS).toHaveLength(8);
    expect(L.HELD_ITEMS.map((h) => h.id)).toEqual([
      'viscosity-correction', 'trim-shortfall', 'operating-region-bands', 'npsh-margin-rule',
      'machine-screen-thresholds', 'default-discharge-limit', 'implied-water-density', 'published-goldens',
    ]);
    L.HELD_ITEMS.forEach((h) => {
      expect(h.note, h.id).toContain(L.HELD_MARKER);
      expect(h.note, h.id).toMatch(/never as an answer/);
      expect(Number.isInteger(h.section), h.id).toBe(true);
    });
    expect(L.heldItems().items).toHaveLength(8);
    expect(L.heldItems().seams).toHaveLength(4);
  });

  it('the digest marks them the same way, and says there are eight', () => {
    const text = readDigest();
    expect((text.match(/HELD FOR LITERATURE/g) || []).length).toBeGreaterThanOrEqual(8);
    expect(text).toContain('Eight things are HELD FOR LITERATURE');
    expect(text).toContain('What this course teaches as limits and never as answers');
  });

  it('each panel shows the wording that marks a held quantity unverified', () => {
    PANEL_FILES.forEach((file) => {
      const p = panelFile(file);
      const text = fs.readFileSync(p, 'utf8');
      expect(text, `${file} does not carry the held marker`).toContain(L.HELD_MARKER);
    });
  });

  it('NO graded capstone field reads a held quantity: the held FUNCTIONS are never called in the capstone block', () => {
    const capstoneSrc = fs.readFileSync(CAPSTONE_MJS, 'utf8');
    const block = LAB_SOURCE().split('THE CAPSTONE. ESCRAVOS, BONGA AND BONNY ONLY')[1];
    expect(block, 'the capstone block marker moved').toBeDefined();
    ['viscosityCorrection', 'impellerTrim', 'operatingRegion', 'npshCheck', 'machineScreen'].forEach((held) => {
      expect((block.match(new RegExp(`[PC]\\.${held}\\s*\\(`, 'g')) || []).length, `${held} is called in the lab's capstone block`).toBe(0);
      expect((capstoneSrc.match(new RegExp(`[PC]\\.${held}\\s*\\(`, 'g')) || []).length, `${held} is called in fc3_fields_capstone.mjs`).toBe(0);
    });
    // And the neutralisations the capstone was built on hold at this engine.
    const r = L.capstoneRuns();
    expect(r.escCurve.droops).toBe(true);
    expect(r.escDuty.converged).toBe(true);
    expect(Number.isFinite(r.escCurve.rSquared)).toBe(true);
    expect(r.bonCurve.droops).toBe(true);
    expect(r.bonDuty.converged).toBe(true);
    expect(r.bonParallelDuty.converged).toBe(true);
    expect(r.bonSpeed.warning, 'the graded speed change carries an extrapolation warning').toBeNull();
    expect(r.bonNpsh.warning).toBeNull();
    // Every stage under the stated limit, and every evaluated state inside the
    // DAK window, asserted on the CASE rather than assumed of the engine.
    r.bonnyTrain.dischargesF.forEach((t) => expect(t).toBeLessThanOrEqual(L.BONNY.maxDischargeF));
    r.windowRows.forEach((x) => {
      expect(x.tpr, `Tpr at stage ${x.stage}`).toBeGreaterThanOrEqual(1.0);
      expect(x.tpr, `Tpr at stage ${x.stage}`).toBeLessThanOrEqual(3.0);
      expect(x.ppr, `Ppr at stage ${x.stage}`).toBeLessThanOrEqual(30);
    });
    // The parallel duty is BELOW twice one machine, which is the result the
    // Professional capstone is built on.
    expect(r.bonParallelDuty.qGpm).toBeLessThan(r.bonDuty.qGpm * 2);
  });
});

// ---------------------------------------------------------------------------
// THE CLOCK GATE.
// ---------------------------------------------------------------------------

describe('THE CLOCK GATE: no reader reads the system date', () => {
  afterEach(() => { vi.useRealTimers(); });

  const snapshot = () => JSON.stringify(READERS.map((name) => [name, LAB[name]()])
    .concat([['capstoneFields', L.capstoneFields()]]));

  it('identical output under two faked system dates, one long before FC3 and one far after', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2019-03-03T12:00:00Z'));
    const early = snapshot();
    vi.setSystemTime(new Date('2094-11-21T12:00:00Z'));
    const late = snapshot();
    expect(late.length).toBeGreaterThan(10000);
    expect(late).toBe(early);
  });

  it('CONTROL: the fake clock did move', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2019-03-03T12:00:00Z'));
    const t1 = Date.now();
    vi.setSystemTime(new Date('2094-11-21T12:00:00Z'));
    const t2 = Date.now();
    expect(new Date(t1).getUTCFullYear()).toBe(2019);
    expect(new Date(t2).getUTCFullYear()).toBe(2094);
    expect(t2).toBeGreaterThan(t1);
  });

  it('CONTROL: there is no dated or seeded surface to fake. No engine this course calls takes one', () => {
    // Comments are stripped first: the gate is about the CODE, and a comment
    // explaining that nothing falls back to today is not a clock surface.
    // FC1 learned this the hard way, and a numeric sweep cannot see prose.
    const code = LAB_SOURCE().replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    expect(code.length).toBeGreaterThan(5000);
    ['asOf', 'today', 'seed', 'Math.random', 'Date'].forEach((needle) => {
      expect(code, `${needle} appears in the lab's code`).not.toContain(needle);
    });
    // CONTROL on the stripper itself: it really does remove comment prose, and
    // it really does keep code.
    const sample = '// a comment mentioning Date and Math.random\nconst x = 1;\n';
    const stripped = sample.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    expect(stripped).not.toContain('Math.random');
    expect(stripped).toContain('const x = 1;');
  });
});

// ---------------------------------------------------------------------------
// THE TIMEZONE GATE. The whole rebuild, a second time, west of Greenwich.
// ---------------------------------------------------------------------------

const TZ_CHILD_TZ = 'America/Los_Angeles';

describe('THE TIMEZONE GATE: the digest rebuilds byte for byte west of Greenwich', () => {
  it(`the whole rebuild under TZ=${TZ_CHILD_TZ} is the digest, byte for byte`, () => {
    if (process.env.FC3_TZ_CHILD) return; // the child does not re-spawn itself
    const sidecar = path.join(ROOT, 'node_modules', '.fc3-tz-rebuild.json');
    if (fs.existsSync(sidecar)) fs.unlinkSync(sidecar);
    execFileSync(path.join(ROOT, 'node_modules/.bin/vitest'), ['run', '--reporter=dot', '--config', 'vitest.config.js', 'src/components/course/panels/rotating/rotatingLab.test.js'], {
      cwd: ROOT,
      env: {
        ...process.env, TZ: TZ_CHILD_TZ, FC3_TZ_CHILD: '1', FC3_WRITE_BUILT: sidecar,
      },
      stdio: 'pipe',
      timeout: 600000,
    });
    const child = JSON.parse(fs.readFileSync(sidecar, 'utf8'));
    fs.unlinkSync(sidecar);
    // CONTROL: the child really did run west of Greenwich.
    expect(child.timeZone).toBe(TZ_CHILD_TZ);
    expect(child.offsetMinutes, 'the child ran at a UTC offset of zero').not.toBe(0);
    expect(child.text).toBe(readDigest());
  }, 600000);
});

// ---------------------------------------------------------------------------
// THE CAPSTONE: the eighteen graded fields reproduce fields.json exactly.
// ---------------------------------------------------------------------------

const CAPSTONE_FIELDS = JSON.parse(fs.readFileSync(FIELDS_JSON, 'utf8'));

describe('the ESCRAVOS, BONGA and BONNY capstone reproduces fields.json exactly', () => {
  it('fields.json is the eighteen published fields, six per tier, in the published order', () => {
    expect(CAPSTONE_FIELDS).toHaveLength(18);
    expect(CAPSTONE_FIELDS.map((x) => x[0])).toEqual([
      ...Array(6).fill('beginner'), ...Array(6).fill('intermediate'), ...Array(6).fill('advanced'),
    ]);
  });

  it('every one of the eighteen graded answers and tolerances is EXACTLY the published value', () => {
    const built = L.capstoneFields();
    expect(built).toHaveLength(18);
    built.forEach(([tier, key, value, tol], i) => {
      const [pTier, pKey, pValue, pTol] = CAPSTONE_FIELDS[i];
      expect(tier, `${key} tier`).toBe(pTier);
      expect(key, `field ${i}`).toBe(pKey);
      expect(value, `${key} value`).toBe(pValue);
      expect(tol, `${key} tolerance`).toBe(pTol);
    });
    expect(L.capstoneValues()).toEqual(
      Object.fromEntries(CAPSTONE_FIELDS.map(([, k, v]) => [k, v])),
    );
    expect(L.capstoneTolerances()).toEqual(
      Object.fromEntries(CAPSTONE_FIELDS.map(([, k, , t]) => [k, t])),
    );
  });

  // A GRADED FIELD A LEARNER CANNOT ANSWER FROM THE MATERIAL IS NOT A HARD
  // FIELD, IT IS A BROKEN ONE. The tolerance lives in three places: the
  // generator that derives it, the fields.json it writes, and the list above.
  // The first two are checked by the mirror gate and the test above. What none
  // of them check is whether the tolerance is answerable AT ALL, which is a
  // different question and the one this gate asks: a figure quoted at the
  // precision this course prints it to must grade CORRECT.
  //
  // precision.json is written by fc3_capstone.mjs out of the same
  // PRINTED_DECIMALS the generator floors the tolerances with, so this is not
  // circular in the way it looks: the generator floors, and this reads the
  // SHIPPED fields.json back and asks whether the shipped number survives
  // being quoted. Tighten any tolerance below its class floor by hand and this
  // fails, which is the control that was run on all eighteen.
  it('THE ANSWERABILITY GATE: every graded field survives being quoted at the precision the course prints', () => {
    const declared = JSON.parse(fs.readFileSync(waveInput(WAVE_NAME, 'precision.json'), 'utf8'));
    const classes = Object.entries(declared);
    expect(classes.length, 'precision.json declares no classes').toBeGreaterThan(0);
    const seen = new Set();
    CAPSTONE_FIELDS.forEach(([, key, value, tol]) => {
      const hit = classes.filter(([, spec]) => new RegExp(spec.match).test(key));
      expect(hit.length, `${key} is matched by ${hit.length} precision classes, not exactly one`).toBe(1);
      const [cls, spec] = hit[0];
      seen.add(cls);
      // Half a unit in the last place the course prints this class, read from
      // a literal rather than multiplied: 0.5 * 10 ** -4 is 4.9999...e-5 in
      // binary and a tolerance is a number a human reads off a file.
      const floor = Number(`5e-${spec.decimals + 1}`);
      expect(tol, `${key} is graded at ${tol} but ${cls} prints to ${spec.decimals} decimals, whose half-unit is ${floor}: a correctly read figure would FAIL`).toBeGreaterThanOrEqual(floor);
      const asQuoted = Number(value.toFixed(spec.decimals));
      expect(Math.abs(asQuoted - value), `${key} quoted as ${asQuoted} is outside its own tolerance`).toBeLessThanOrEqual(tol);
    });
    expect(seen.size, 'precision.json declares a class no graded field uses').toBe(classes.length);
  });

  it('the capstone conditions are copied verbatim from fc3_fields_capstone.mjs', () => {
    const src = fs.readFileSync(CAPSTONE_MJS, 'utf8');
    const lab = LAB_SOURCE();
    const NAMES = ['ESCRAVOS_POINTS', 'ESCRAVOS_SYSTEM', 'ESCRAVOS_SG', 'ESCRAVOS_EFFICIENCY',
      'ESCRAVOS_MOTOR_EFFICIENCY', 'BONGA_POINTS', 'BONGA_SYSTEM', 'BONGA_SG', 'BONGA_SUCTION',
      'BONGA_RAISED_SUCTION_PSIA', 'BONGA_SPEED_RATIO', 'BONGA_N_PARALLEL', 'BONGA_Q_MAX_GPM',
      'ESCRAVOS_Q_MAX_GPM', 'BONNY_HEAT_RATE_BTU_HP_HR', 'BONNY_LHV_BTU_SCF'];
    NAMES.forEach((name) => {
      const a = src.match(new RegExp(`^export const ${name} = ([\\s\\S]*?);$`, 'm'));
      const b = lab.match(new RegExp(`^export const ${name} = ([\\s\\S]*?);$`, 'm'));
      expect(a, `${name} in fc3_fields_capstone.mjs`).not.toBeNull();
      expect(b, `${name} in the lab`).not.toBeNull();
      expect(b[1], name).toBe(a[1]);
    });
    // BONNY carries a long explanatory comment inside the literal in the wave
    // file, so it is compared field by field rather than as raw text.
    const bonny = src.match(/^export const BONNY = \{([\s\S]*?)\n\};$/m)[1];
    Object.entries(L.BONNY).forEach(([k, v]) => {
      expect(bonny, `BONNY.${k}`).toMatch(new RegExp(`${k}:\\s*${String(v).replace('.', '\\.')}`));
    });
    expect(Object.keys(L.BONNY)).toHaveLength(12);
  });

  it('the capstone never touches the teaching digest, and the digest never names a capstone machine', () => {
    const digest = readDigest().toLowerCase();
    ['escravos', 'bonga', 'bonny'].forEach((name) => expect(digest).not.toContain(name));
    const dump = fs.readFileSync(DUMP_MJS, 'utf8');
    ['escravos', 'bonga', 'bonny'].forEach((name) => expect(dump.toLowerCase()).not.toContain(name));
    expect(dump).not.toMatch(/readFileSync\([^)]*fields\.json/);
    expect(dump).not.toContain('fc3_fields_capstone');
  });
});

// ---------------------------------------------------------------------------
// THE LEAK GATE: no teaching number may be a graded capstone answer.
// ---------------------------------------------------------------------------

/** Exports that TAKE AN ARGUMENT. */
const ARG_REQUIRED = ['leakGuardTargets', 'leakGuardHit', 'collectNumbers',
  'capstoneValues', 'capstoneTolerances'];
const GATE_MACHINERY = ['LEAK_GUARD_MARGIN', 'LEAK_GUARD_SCALINGS'];

/**
 * A surface smaller than this is not the lab: refuse to call it clean. The
 * floors are MEASURED from the real surface and set below it by less than any
 * one large reader, so losing a reader to a rename trips them.
 */
const MIN_SURFACE_ENTRIES = 70;
const MIN_SURFACE_NUMBERS = 1800;

/** Every teaching export evaluated: constants as they are, readers called bare. */
const teachingSurface = () => {
  const out = [];
  Object.entries(L).forEach(([name, value]) => {
    if (L.CAPSTONE_ONLY_EXPORTS.includes(name) || ARG_REQUIRED.includes(name) || GATE_MACHINERY.includes(name)) return;
    out.push({ name, value: typeof value === 'function' ? value() : value });
  });
  return out;
};

const surfaceNumbers = (surface) => surface.flatMap((s) => L.collectNumbers(s.value, s.name));

const assertPlausible = (surface, numbers) => {
  if (surface.length < MIN_SURFACE_ENTRIES || numbers.length < MIN_SURFACE_NUMBERS) {
    throw new Error(`the teaching surface has only ${surface.length} entries and ${numbers.length} numbers: refusing to call it clean`);
  }
};

const leakHits = (surface, targets) => surfaceNumbers(surface)
  .map((x) => ({ x, t: L.leakGuardHit(x.value, targets) }))
  .filter((h) => h.t)
  .map(({ x, t }) => `${x.path} = ${x.value} is within ${t.band} of ${t.key} ${t.tag} (${Math.abs(x.value - t.value) / t.gradingBand} grading bands)`);

describe('THE LEAK GATE: the guard itself', () => {
  const targets = L.leakGuardTargets(CAPSTONE_FIELDS);

  it('the guard is built from all eighteen fields in all three unit shiftings, with the band scaled', () => {
    expect(targets).toHaveLength(18 * 3);
    expect(L.LEAK_GUARD_MARGIN).toBe(10);
    expect(L.LEAK_GUARD_SCALINGS.map((s) => s.factor)).toEqual([1, 1000, 0.001]);
    const t = (key, tag) => targets.find((x) => x.key === key && x.tag === tag);
    expect(t('escravos_duty_flow_gpm', 'as graded').band).toBeCloseTo(0.001, 12);
    expect(t('escravos_duty_flow_gpm', 'x0.001').band).toBeCloseTo(0.000001, 15);
    // 10 x 5e-10 x 1000. The exponent ratio's tolerance was loosened from 1e-12
    // to half a unit in the ninth decimal, which is the place the digest prints
    // it at; the guard band moves with it, which is why this pin is stated in
    // the tolerance rather than left as a bare constant.
    expect(t('bonny_exponent_ratio', 'x1000').band).toBeCloseTo(10 * 5e-10 * 1000, 15);
  });

  it('every reader answers, and the surface is large enough to mean something', () => {
    const surface = teachingSurface();
    surface.forEach((s) => expect(s.value, `${s.name} returned nothing`).not.toBeUndefined());
    const numbers = surfaceNumbers(surface);
    // eslint-disable-next-line no-console
    console.log(`teaching surface: ${surface.length} entries, ${numbers.length} numbers`);
    expect(() => assertPlausible(surface, numbers)).not.toThrow();
  });

  it('THE GUARD REFUSES AN EMPTY OR TINY SURFACE rather than calling it clean', () => {
    const surface = teachingSurface();
    expect(() => assertPlausible([], [])).toThrow(/refusing/);
    expect(() => assertPlausible(surface.slice(0, 3), surfaceNumbers(surface.slice(0, 3)))).toThrow(/refusing/);
  });

  it('every export is accounted for: walked bare, walked with arguments, capstone or machinery', () => {
    const exported = Object.keys(L);
    ARG_REQUIRED.forEach((k) => expect(exported, k).toContain(k));
    exported.filter((k) => typeof LAB[k] === 'function' && LAB[k].length > 0
      && !ARG_REQUIRED.includes(k) && !L.CAPSTONE_ONLY_EXPORTS.includes(k))
      .forEach((k) => expect(LAB[k].length, `${k} has a required argument and is not in ARG_REQUIRED`).toBe(0));
  });

  it('the teaching surface names no capstone export and no capstone machine, and carries no em dash or en dash', () => {
    const text = JSON.stringify(teachingSurface());
    L.CAPSTONE_ONLY_EXPORTS.forEach((name) => {
      if (name === 'CAPSTONE_ONLY_EXPORTS') return;
      expect(text, `${name} appears in the teaching surface`).not.toContain(name);
    });
    ['escravos', 'bonga', 'bonny'].forEach((x) => expect(text.toLowerCase()).not.toContain(x));
    expect(text).not.toMatch(/[–—]/);
  });

  it('THE GUARD IS LIVE: every graded answer, planted, is caught in every shifting, however deep', () => {
    CAPSTONE_FIELDS.forEach(([, key, v, tol]) => {
      const drift = 0.9 * L.LEAK_GUARD_MARGIN * tol;
      [v, v + drift, v - drift].forEach((planted) => {
        expect(L.leakGuardHit(planted, targets), `${key} ${planted}`).not.toBeNull();
        expect(L.leakGuardHit(planted * 1000, targets), `${key} x1000`).not.toBeNull();
        expect(L.leakGuardHit(planted / 1000, targets), `${key} x0.001`).not.toBeNull();
      });
      const buried = L.collectNumbers({ a: [{ b: v }] })[0].value;
      expect(targets.filter((t) => Math.abs(buried - t.value) < t.band).map((t) => t.key), key).toContain(key);
    });
  });

  it('THE GUARD GOES RED ON A PLANTED LEAK in a real reader\'s output, and is clean again without it', () => {
    // A gate that has never failed is not a gate. This plants one graded
    // answer into the flow the Associate panel headlines, shows the sweep go
    // red naming the probe, and shows the same surface clean once removed.
    const surface = teachingSurface();
    const graded = CAPSTONE_FIELDS.find((x) => x[1] === 'escravos_duty_flow_gpm')[2];
    const planted = surface.map((s) => (s.name === 'dutyPointSolved'
      ? { ...s, value: { ...s.value, qGpm: graded + 0.0004 } }
      : s));
    const hits = leakHits(planted, targets);
    expect(hits).toHaveLength(1);
    expect(hits[0]).toMatch(/^dutyPointSolved\.qGpm = .* of escravos_duty_flow_gpm as graded/);
    expect(leakHits(surface, targets)).toEqual([]);
  });

  it('THE GUARD IS NOT TRIGGER HAPPY: the teaching headlines pass', () => {
    const d = L.dutyPointSolved();
    const p = L.powerHeadPressure();
    const t = L.trainAndCooling();
    expect(L.leakGuardHit(d.qGpm, targets)).toBeNull();
    expect(L.leakGuardHit(d.headFt, targets)).toBeNull();
    expect(L.leakGuardHit(p.brakeHp, targets)).toBeNull();
    expect(L.leakGuardHit(t.totalBrakeHp, targets)).toBeNull();
    [NaN, Infinity, -Infinity].forEach((x) => expect(L.leakGuardHit(x, targets)).toBeNull());
    expect(L.collectNumbers({
      a: NaN, b: null, c: 'text', d: undefined,
    })).toEqual([]);
  });
});

describe('THE LEAK GATE: no teaching number may be a graded capstone answer', () => {
  it('NO number returned by any teaching export is within ten grading bands of a graded answer, in any shifting', () => {
    const targets = L.leakGuardTargets(CAPSTONE_FIELDS);
    const surface = teachingSurface();
    assertPlausible(surface, surfaceNumbers(surface));
    expect(leakHits(surface, targets)).toEqual([]);
  });

  it('every number PRINTED IN THE DIGEST stands clear of a graded answer too', () => {
    // A substring search over a page of six decimal gpm is meaningless: the
    // digits 12 sit inside 1250.542488. So the digest's own literals are
    // parsed and run through the same numeric guard.
    const targets = L.leakGuardTargets(CAPSTONE_FIELDS);
    const literals = (readDigest().match(/-?\d+(?:\.\d+)?/g) || []).map(Number).filter(Number.isFinite);
    expect(literals.length).toBeGreaterThan(1000);
    const hits = literals.map((v) => ({ v, t: L.leakGuardHit(v, targets) })).filter((x) => x.t)
      .map(({ v, t }) => `the digest prints ${v}, within ${t.band} of ${t.key} ${t.tag}`);
    expect([...new Set(hits)]).toEqual([]);
  });

  it('every number PRINTED IN A PANEL SOURCE stands clear of a graded answer', () => {
    const targets = L.leakGuardTargets(CAPSTONE_FIELDS);
    PANEL_FILES.forEach((file) => {
      const p = panelFile(file);
      const text = fs.readFileSync(p, 'utf8');
      const literals = (text.match(/-?\d+(?:\.\d+)?/g) || []).map(Number).filter(Number.isFinite);
      const hits = literals.map((v) => ({ v, t: L.leakGuardHit(v, targets) })).filter((x) => x.t)
        .map(({ v, t }) => `${file} prints ${v}, within ${t.band} of ${t.key} ${t.tag}`);
      expect([...new Set(hits)]).toEqual([]);
    });
  });
});

// ---------------------------------------------------------------------------
// THE PROSE SWEEP. A numeric sweep cannot see prose, including prose inside a
// code comment. FC1 shipped a stale comment in separationLab.js that survived
// every numeric gate and was caught only by a phrase sweep, so this course
// sweeps its own comments.
// ---------------------------------------------------------------------------

describe('THE PROSE SWEEP: the lab\'s own comments are swept for claims the code no longer makes', () => {
  it('no comment claims a count, a name or a behaviour the code contradicts', () => {
    const src = LAB_SOURCE();
    const comments = [
      ...(src.match(/\/\*[\s\S]*?\*\//g) || []),
      ...(src.match(/^\s*\/\/.*$/gm) || []),
    ].join('\n');
    expect(comments.length).toBeGreaterThan(3000);
    // Owner copy rule, applied to the lab's own prose as well as to the panels.
    expect(comments, 'the lab carries an em dash or an en dash').not.toMatch(/[–—]/);
    // The claims the comments actually make, each checked against the code.
    expect(L.BARE_NUMBER_PROBES).toHaveLength(5);
    expect(comments).toContain('five');
    expect(comments).not.toMatch(/\bthree bare-number\b/);
    expect(comments).not.toMatch(/\btwo bare-number\b/);
    // The comments name the engines the lab actually imports.
    ['pumps.js', 'compression.js', 'gasProperties.js'].forEach((m) => expect(comments).toContain(m));
    // And the vintage they are vendored at, which is the one the wave states.
    expect(comments).toContain('4fa37e6');
    expect(fs.readFileSync(waveInput(WAVE_NAME, 'wave.json'), 'utf8')).toContain('4fa37e6');
    // No P label anywhere: nothing in this course is a distribution.
    expect(src).not.toMatch(/\bP10\b|\bP50\b|\bP90\b/);
  });

  it('every panel source is swept the same way', () => {
    PANEL_FILES.forEach((file) => {
      const p = panelFile(file);
      const text = fs.readFileSync(p, 'utf8');
      expect(text, `${file} carries an em dash or an en dash`).not.toMatch(/[–—]/);
      expect(text, `${file} carries a percentile label`).not.toMatch(/\bP10\b|\bP50\b|\bP90\b/);
      // No panel may compute a rotating-equipment quantity: every number it
      // shows comes through the lab.
      expect(text, `${file} imports an engine directly`).not.toMatch(/@petrolord\/engines/);
    });
  });
});
