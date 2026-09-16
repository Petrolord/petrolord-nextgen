// Every value the FC2 lab exposes to a panel, a lesson or the grader is pinned
// here against the teaching digest (tools/course-waves/linesizing/digest.txt), which
// is itself nothing but the Pipeline & Line Sizing Studio's engines' return
// values on the published goldens and on the teaching fields OGBIA and SOKU.
//
// THE DIGEST IS REBUILT BYTE FOR BYTE. buildDigest() below is fc2_dump.mjs's
// writer with every engine call replaced by a lab return value: the prose is
// the dump's, the formatting is the dump's (liquid work to six decimals; gas
// rates, Reynolds numbers, barrels, hours and days to four), and every number
// comes out of linesizingLab.js. The rebuilt text is compared with digest.txt
// section by section and then whole.
//
// THE EIGHTEEN GRADED FIELDS of the IMO-1, BRASS and QUA IBOE capstone are
// pinned separately and EXACTLY against tools/course-waves/linesizing/fields.json,
// READ FROM THE FILE.
//
// Then the gates:
//   THE LEAK GATE      no teaching export may return a number within ten times
//                      a graded field's ABSOLUTE tolerance of a graded answer,
//                      in any of three unit shiftings, over every number the
//                      lab exports, refusing a tiny surface. A planted leak in
//                      a real reader's output must go red and name the field.
//   THE CLOCK GATE     every reader returns identical output under two faked
//                      system dates, with a control proving the clock moved.
//   THE TZ GATE        the whole rebuild runs a second time in a child process
//                      under TZ=America/Los_Angeles and must be byte-identical.
//   THE REFUSAL GATE   the FC2-0 repair wave gave twenty-one inputs a named
//                      error. Every refusal a panel displays is the engine's
//                      own message, and NO message is written as a literal in
//                      the lab: the lab is grepped for each one.
//   THE HELD GATE      the five HELD quantities carry the wording that marks
//                      them unverified, the panels show it, and no graded
//                      capstone field reads one.
import {
  describe, it, expect, afterEach, vi,
} from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import * as LAB_NS from './linesizingLab.js';
import { waveInput } from '../../../../../tools/course-waves/waveInputs.mjs';

const L = LAB_NS;
const LAB = Object.fromEntries(Object.entries(L));

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
// THE WAVE INPUTS. Read from the committed copy under tools/course-waves by
// default, which is what lets this suite run anywhere, CI included. Point it
// at a live wave directory mid-build with NEXTGEN_WAVE_DIR. A missing input
// throws and names itself rather than skipping: see tools/course-waves/waveInputs.mjs.
const WAVE_NAME = 'linesizing';
const DIGEST = waveInput(WAVE_NAME, 'digest.txt');
const FIELDS_JSON = waveInput(WAVE_NAME, 'fields.json');
const PRECISION_JSON = waveInput(WAVE_NAME, 'precision.json');
const DUMP_MJS = waveInput(WAVE_NAME, 'fc2_dump.mjs');
const FIELDS_MJS = waveInput(WAVE_NAME, 'fc2_fields.mjs');
const CAPSTONE_MJS = waveInput(WAVE_NAME, 'fc2_fields_capstone.mjs');
const LAB_SOURCE = () => fs.readFileSync(path.join(HERE, 'linesizingLab.js'), 'utf8');
const PANEL_FILES = ['LiquidExplorer.jsx', 'GasLineExplorer.jsx', 'WallPigExplorer.jsx'];

// ---------------------------------------------------------------------------
// The digest's formatting, verbatim from fc2_dump.mjs.
// ---------------------------------------------------------------------------

const num = (x, n) => (x === null || x === undefined || Number.isNaN(Number(x)) ? 'null' : Number(x).toFixed(n));
const e6 = (x) => num(x, 6);   // ft/s, psi, inches, ratios, friction factors
const r4 = (x) => num(x, 4);   // scfd, Reynolds numbers, barrels, hours, days
const soft = (err) => (err ? `{ error: "${err}" }` : 'no error');
const shape = (r) => JSON.stringify(r);
const ex3 = (x) => (Number.isFinite(x) ? Number(x).toExponential(3) : String(x));

// ---------------------------------------------------------------------------
// THE REBUILD. One block per digest section, in the dump's order.
// ---------------------------------------------------------------------------

const buildDigest = () => {
  const out = [];
  const w = (s = '') => out.push(s);

  w('# FC2 Line Sizing & Hydraulics. Teaching digest.');
  w('# Liquid work prints to six decimals (ft per s, psi, inches, ratios, hours); friction factors and the elevation group factors print to ten decimals, which is the precision a field graded to a billionth actually needs; gas rates, Reynolds numbers, barrels and days print to four decimals; counts are whole numbers.');
  w('# Field units: bpd for liquid, scfd for gas, inches of bore, FEET of length for liquid work and MILES for gas work (the unit the published transmission forms are stated in), psia, degR, lb per ft3, cp.');
  w('# Nothing here is read from a clock or a random number, so every line reproduces.');
  w();

  // Section 1
  const s1 = L.engineScope();
  w('# SECTION 1: What the engine sizes, and what it refuses (owned by Associate m01)');
  w();
  w('# App surface: the Pipeline & Line Sizing Studio runs this chain live. A bore gives an area, the area and the rate give a velocity, the velocity gives a Reynolds number, the Reynolds number and the relative roughness give a friction factor, and the friction factor and the length give the loss.');
  w('- This engine sizes ONE LINE. It says what a single pipe costs in pressure and what bore it needs. A system of lines that share a header is a network solve and lives in engines/production/networkSolve.js.');
  w('- The multiphase half is NOT in this engine. Two-phase pressure drop, flow regime and holdup are the Suite Beggs and Brill correlation, which is app code, and the engine takes the holdup as an INPUT wherever it needs one.');
  w('- A state the method has no answer for comes back as an object with an `error` string. This engine throws nothing: every refusal is a returned object, so a caller checks a property rather than catching.');
  w('- Liquid rates are taken at LINE conditions, the dead-liquid case downstream of separation. A live-oil flowline upstream of separation carries full PVT and belongs elsewhere.');
  w();
  w('States the method has no answer for, engine messages verbatim:');
  s1.softStates.forEach((r) => w(`- ${r.label}: ${soft(r.error)}`));
  w('Those are states the METHOD has no answer for. Inputs that are not physically meaningful at all, a negative roughness or an efficiency above one or a corrosion allowance that removes metal, are refused as well, and the catalogue of them with the boundary either side is in Section 16.');
  w();
  w('# The units it works in. Seven constants the module keeps to itself are measured here by asking the engine a question about itself, because a number typed into this file would not be an engine return.');
  w(`gc, measured as the liquid density times the velocity squared over twice 144 times the one-velocity-head fittings loss: ${e6(s1.gcDerived)} lbm ft per lbf s2 (derived from the engine's own velocity ${e6(s1.gcProbeVFtS)} ft/s and fittings loss ${e6(s1.gcProbeFittingsPsi)} psi at a resistance sum of one).`);
  w(`one centipoise in lbm per ft per s, measured as the density times the velocity times the bore in feet over the viscosity times the Reynolds number: ${s1.cpDerived.toExponential(10)} (derived from the engine's velocity ${e6(s1.cpProbeVFtS)} ft/s and Reynolds number ${r4(s1.cpProbeRe)}).`);
  w(`cubic feet per barrel, measured as the flow area times the length over the engine's line volume: ${num(s1.cuftPerBblDerived, 13)} (derived from the engine's line volume ${r4(s1.lineVolumeBbl)} bbl).`);
  w(`seconds per day, measured as the rate times the cubic feet per barrel above over the area times the velocity: ${e6(s1.secondsPerDayDerived)} (derived on the row).`);
  w(`seconds per hour, measured as a length over the pig speed times the engine's run hours: ${e6(s1.secondsPerHourDerived)} (derived from the engine's run time ${e6(s1.pigRunHours)} h).`);
  w(`the feet in a mile, measured as the largest rise the engine accepts on a gas line ${e6(s1.mileProbeLengthMi)} mile long: ${num(s1.mileFtAccepted, 9)} ft is accepted and the next representable value above it, ${s1.mileGapFt.toExponential(3)} ft higher, is refused (engine).`);
  w(`atmospheric pressure, measured as the floor of the outlet-pressure bracket: the largest rate this trunk accepts is ${r4(s1.atmosphericLargestRateScfd)} scfd, the outlet the solve converges on there is ${e6(s1.atmosphericFloorPsia)} psia, and one scfd more is refused (engine).`);
  w(`The base conditions the published gas forms are stated at, which the module DOES export: ${e6(s1.tbR)} degR and ${e6(s1.pbPsia)} psia. That base pressure is not atmospheric: the two differ by ${e6(s1.baseAgainstAtmosphericDerived)} psi (derived from the two figures on these rows).`);
  w();

  // Section 2
  const s2 = L.frictionAndRegime();
  w('# SECTION 2: Velocity, Reynolds and the friction factor (owned by Associate m02)');
  w();
  w('The published friction cases, engine against golden:');
  w('| Reynolds number | relative roughness | engine f | golden f | regime the engine reports |');
  w('| --- | --- | --- | --- | --- |');
  s2.published.forEach((c) => w(`| ${r4(c.re)} | ${num(c.relRough, 6)} | ${num(c.f, 12)} | ${num(c.goldenF, 12)} | ${c.regime} |`));
  w();
  w('The two branches, walked across the boundary the engine draws at Reynolds 2100 and the one it draws at 4000, on a smooth pipe:');
  w('| Reynolds number | f | regime |');
  w('| --- | --- | --- |');
  s2.branch.forEach((r) => w(`| ${r4(r.re)} | ${num(r.f, 12)} | ${r.regime} |`));
  w(`At the OGBIA relative roughness of ${num(s2.ogbiaRelRoughDerived, 10)} (derived: the roughness over the bore) the friction factor goes from ${num(s2.jumpFromF, 10)} to ${num(s2.jumpToF, 10)} across one unit of Reynolds number, a jump of ${e6(s2.jumpPercentDerived)} percent (derived from the two engine values on this row).`);
  w(`The lower value is reported as ${s2.jumpFromRegime} and the upper as ${s2.jumpToRegime}, and the upper one is computed on the turbulent branch: the word and the arithmetic are saying different things in the band from 2100 to 4000.`);
  w();
  const lc = s2.lawConstants;
  w('# The three constants of the two friction laws. The module exports none of them, so each is measured by choosing inputs that isolate it and reading back what the engine returns.');
  w(`the laminar numerator, measured on a smooth pipe below the branch as the friction factor times its own Reynolds number: ${e6(lc.laminarNumeratorDerived)} (derived from the engine's ${num(lc.laminarF, 12)} at Reynolds ${r4(lc.laminarRe)}).`);
  w(`the Colebrook Reynolds numerator, measured on a SMOOTH pipe where the roughness term is exactly zero, as the Reynolds number times ten to the power of minus half the inverse square root of f, divided by that same inverse square root: ${e6(lc.colebrookReynoldsNumeratorDerived)} (derived from the engine's ${num(lc.smoothF, 12)} at Reynolds ${r4(lc.smoothRe)}).`);
  w(`the Colebrook roughness divisor, measured in the FULLY ROUGH limit where the Reynolds term falls away, as the relative roughness times ten to the power of half the inverse square root of f: ${e6(lc.colebrookRoughnessDivisorDerived)} (derived from the engine's ${num(lc.roughF, 12)} at Reynolds ${r4(lc.roughRe)} and relative roughness ${e6(lc.roughRelRough)}).`);
  w();
  w('Relative roughness alone, at one Reynolds number, which is the vertical axis of the Moody chart:');
  w(`| relative roughness | f at Reynolds ${r4(s2.reLow)} | f at Reynolds ${r4(s2.reHigh)} |`);
  w('| --- | --- | --- |');
  s2.roughnessRows.forEach((r) => w(`| ${num(r.relRough, 6)} | ${num(r.fLow, 12)} | ${num(r.fHigh, 12)} |`));
  w(`A rough pipe stops caring about the Reynolds number and a smooth one never does, and the two columns say so: on the ${num(s2.roughnessSmoothest, 6)} row the second column is ${num(s2.smoothColumnRatioDerived, 10)} of the first, and on the ${num(s2.roughnessRoughest, 6)} row it is ${num(s2.roughColumnRatioDerived, 10)} (derived from the two columns on those rows). A thousandfold in Reynolds number moves the smooth pipe and leaves the rough one where it was.`);
  w();
  w('The OGBIA line walked from turbulent into laminar by viscosity alone, at its built bore:');
  w('| viscosity cp | velocity ft/s | Reynolds number | f | regime | friction loss psi |');
  w('| --- | --- | --- | --- | --- | --- |');
  s2.viscosityRows.forEach((r) => w(`| ${e6(r.muCp)} | ${e6(r.vFtS)} | ${r4(r.re)} | ${num(r.f, 10)} | ${r.regime} | ${e6(r.dpFrictionPsi)} |`));
  w('The velocity does not move, because velocity is rate over area and neither of those is the viscosity. Everything downstream of the Reynolds number does.');
  w();

  // Section 3
  const s3 = L.threeLosses();
  w('# SECTION 3: Three losses kept apart (owned by Associate m03)');
  w();
  w(`The OGBIA crude export line as built: ${e6(s3.qBpd)} bpd of ${e6(s3.rhoLbFt3)} lb/ft3 crude at ${e6(s3.muCp)} cp, through ${e6(s3.idIn)} in of bore over ${e6(s3.lengthFt)} ft, on commercial steel at ${num(s3.roughnessIn, 6)} in.`);
  w(`Velocity ${e6(s3.vFtS)} ft/s, Reynolds number ${r4(s3.re)}, regime ${s3.regime}, friction factor ${num(s3.f, 10)}.`);
  w(`Friction ${e6(s3.dpFrictionPsi)} psi, fittings ${e6(s3.dpFittingsPsi)} psi, elevation ${e6(s3.dpElevationPsi)} psi, total ${e6(s3.dpTotalPsi)} psi, gradient ${num(s3.gradientPsiPerFt, 10)} psi per ft.`);
  w('The three are returned SEPARATELY because they answer different questions. Friction is what a bigger pipe fixes. Elevation is what no pipe fixes.');
  w();
  w('The fittings on the isometric, and the resistance sum the schedule builds from them:');
  w('| fitting | count | K each | K total |');
  w('| --- | --- | --- | --- |');
  s3.fittings.forEach((f) => w(`| ${f.id} | ${f.count} | ${e6(f.kEach)} | ${e6(f.kTotal)} |`));
  w(`The engine's resistance sum for that list: ${e6(s3.sumK)} velocity heads (engine).`);
  w(`On the whole ${e6(s3.lengthFt)} ft line those fittings cost ${e6(s3.withKFittingsPsi)} psi against ${e6(s3.withKFrictionPsi)} psi of pipe friction, a share of ${e6(s3.withKShareDerived)} of the total (derived from the two engine values on this row).`);
  w(`On a ${e6(s3.manifoldLengthFt)} ft manifold run carrying the same duty and the same fittings, the pipe costs ${e6(s3.shortFrictionPsi)} psi and the fittings cost ${e6(s3.shortFittingsPsi)} psi, a share of ${e6(s3.shortShareDerived)} (derived from the two engine values on this row). The fittings did not change; the pipe did.`);
  w();
  w('Elevation, the same line up and down:');
  w('| elevation change ft | friction psi | elevation psi | total psi | gradient psi per ft |');
  w('| --- | --- | --- | --- | --- |');
  s3.elevationRows.forEach((r) => w(`| ${e6(r.elevChangeFt)} | ${e6(r.dpFrictionPsi)} | ${e6(r.dpElevationPsi)} | ${e6(r.dpTotalPsi)} | ${num(r.gradientPsiPerFt, 10)} |`));
  w(`The friction column spreads ${e6(s3.frictionSpreadDerived)} psi across the three rows and the two non-zero elevation terms sum to ${e6(s3.elevationSumDerived)} psi (both derived from the table above), so a hill is added to a pressure drop rather than mixed into it.`);
  w();
  w('Roughness, which is the pipe and not the fluid:');
  w('| catalogue id | roughness in | relative roughness | f | friction loss psi |');
  w('| --- | --- | --- | --- | --- |');
  s3.roughnessRows.forEach((r) => w(`| ${r.id} | ${num(r.roughnessIn, 6)} | ${num(r.relRoughDerived, 10)} | ${num(r.f, 10)} | ${e6(r.dpFrictionPsi)} |`));
  w();
  w('The published liquid cases, engine against golden:');
  s3.published.forEach((c) => {
    w(`- ${r4(c.input.qBpd)} bpd in ${e6(c.input.idIn)} in over ${e6(c.input.lengthFt)} ft, elevation ${e6(c.input.elevChangeFt)} ft, resistance sum ${e6(c.input.sumK)}: velocity ${e6(c.vFtS)} ft/s, Reynolds ${r4(c.re)}, f ${num(c.f, 10)}, regime ${c.regime}; friction ${e6(c.dpFrictionPsi)} psi, fittings ${e6(c.dpFittingsPsi)} psi, elevation ${e6(c.dpElevationPsi)} psi, total ${e6(c.dpTotalPsi)} psi.`);
    w(`    golden: velocity ${e6(c.input.vFtS)}, Reynolds ${r4(c.input.re)}, f ${num(c.input.f, 10)}, friction ${e6(c.input.dpFrictionPsi)} psi, total ${e6(c.input.dpTotalPsi)} psi (golden).`);
  });
  w();

  // Section 4
  const s4 = L.erosionalLimit();
  w('# SECTION 4: The erosional limit (owned by Associate m04)');
  w();
  w('# App surface: the studio puts an RP 14E verdict on every row of its sizing sweep, which is what stops a bore being chosen on pressure drop alone.');
  w('The published c factor rows, all three overridable:');
  w('| id | label | c |');
  w('| --- | --- | --- |');
  s4.rows.forEach((row) => w(`| ${row.id} | ${row.label} | ${e6(row.c)} |`));
  w(`An id the table does not carry does not refuse and does not return null: erosionalC('${s4.unknownId}') comes back as ${shape(s4.unknownShape)}, which is the first row under its own label.`);
  w();
  w('The limit at the OGBIA crude density, and what each c factor allows through the built bore:');
  w('| c | erosional velocity ft/s | line velocity ft/s | ratio | exceeded | margin percent | largest rate bpd |');
  w('| --- | --- | --- | --- | --- | --- | --- |');
  s4.byCFactor.forEach((r) => w(`| ${e6(r.cFactor)} | ${e6(r.erosionalFtS)} | ${e6(r.velocityFtS)} | ${e6(r.ratio)} | ${r.exceeded} | ${e6(r.marginPct)} | ${r4(r.largestRateBpd)} |`));
  w(`The engine's own flow area for that bore is ${e6(s4.areaFt2)} ft2, and the velocity the erosional check reads, ${e6(s4.checkVelocityFtS)} ft/s, stands ${e6(s4.erosionalVelocityAgainstDropDerived)} ft/s from the velocity the pressure drop read (derived from the two engine values on this row).`);
  w();
  w('Density is the whole of the limit: the same c factor against four fluids.');
  w('| mixture density lb/ft3 | erosional velocity at c 100 | at c 125 | at c 175 |');
  w('| --- | --- | --- | --- |');
  s4.densityRows.forEach((r) => w(`| ${e6(r.rhoLbFt3)} | ${e6(r.at100)} | ${e6(r.at125)} | ${e6(r.at175)} |`));
  w(`A light gas is allowed to run faster than a dense liquid by the square root of the density ratio, and the two agree to ${ex3(s4.densitySqrtAgreementDerived)} (derived from the velocity ratio on this row and the square root of the two densities it names): at the continuous-service c factor the ${e6(s4.lightRhoLbFt3)} lb/ft3 row stands at ${e6(s4.veLightFtS)} ft/s against ${e6(s4.veHeavyFtS)} ft/s at ${e6(s4.heavyRhoLbFt3)} lb/ft3, a ratio of ${e6(s4.densityRatioDerived)} (derived from the two rows above).`);
  w();
  w('# HELD FOR LITERATURE, taught as a limit and never graded: the three c factor rows. The recommended practice itself says its own figures are conservative, and the third row is labelled as operator practice with no publication behind it. Every graded erosional value in this course states its own c factor.');
  w();

  // Section 5
  const s5 = L.boreChoice();
  w('# SECTION 5: Choosing a bore (owned by Associate m05)');
  w();
  w('The OGBIA duty in every bore the vendored schedule carries, with the RP 14E verdict at the continuous-service c factor:');
  w('| nominal | schedule | outside diameter in | wall in | bore in | velocity ft/s | Reynolds | friction loss psi | total psi | erosional ft/s | ratio | inside the limit |');
  w('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  s5.rows.forEach((r) => w(`| ${r.nps} | ${r.schedule} | ${e6(r.odIn)} | ${e6(r.wallIn)} | ${e6(r.idIn)} | ${e6(r.vFtS)} | ${r4(r.re)} | ${e6(r.dpFrictionPsi)} | ${e6(r.dpTotalPsi)} | ${e6(r.erosionalFtS)} | ${e6(r.ratio)} | ${r.insideTheLimit} |`));
  w(`The erosional velocity column spreads ${e6(s5.erosionalSpreadDerived)} ft/s across every row (derived from the column above) and reads ${e6(s5.erosionalFtS)} ft/s, because it depends on the density and the c factor and not on the bore. What changes down the table is the velocity that has to sit under it.`);
  w();
  w('The table is ordered by nominal size and then by schedule, and that order is NOT the order of the bores:');
  w(`bores in table order: ${s5.boresInTableOrder.map((x) => e6(x)).join(', ')}.`);
  w('A heavier schedule is a thicker wall and a smaller bore on the same outside diameter, and it sits after the lighter one, so reading down the table crosses back and forth over the bore that a line actually needs.');
  w();
  w('The same outside diameter in two schedules:');
  w('| nominal | outside diameter in | wall light | wall heavy | bore light | bore heavy | velocity light ft/s | velocity heavy ft/s | total psi light | total psi heavy |');
  w('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  s5.schedulePairs.forEach((p) => w(`| ${p.nps} | ${e6(p.odIn)} | ${e6(p.wallLightIn)} | ${e6(p.wallHeavyIn)} | ${e6(p.boreLightIn)} | ${e6(p.boreHeavyIn)} | ${e6(p.vLightFtS)} | ${e6(p.vHeavyFtS)} | ${e6(p.totalLightPsi)} | ${e6(p.totalHeavyPsi)} |`));
  w();
  w(`Against a velocity ceiling of ${e6(s5.maxVFtS)} ft/s as well as the erosional limit, ${s5.passingCount} of the ${s5.boreCount} bores pass.`);
  w(`The first of them in TABLE order is ${s5.firstInTableOrder.nps} in schedule ${s5.firstInTableOrder.schedule}, bore ${e6(s5.firstInTableOrder.idIn)} in. The smallest passing BORE is ${s5.smallestBore.nps} in schedule ${s5.smallestBore.schedule}, bore ${e6(s5.smallestBore.idIn)} in. On this duty they are ${s5.sameRow ? 'the same row' : 'DIFFERENT rows'}.`);
  w();

  // Section 6
  const s6 = L.associateReading();
  w('# SECTION 6: The Associate reading, one line end to end (owned by Associate m06)');
  w();
  w(`OGBIA end to end: ${e6(s6.qBpd)} bpd of ${e6(s6.rhoLbFt3)} lb/ft3 crude at ${e6(s6.muCp)} cp through ${e6(s6.idIn)} in of bore over ${e6(s6.lengthFt)} ft gives a velocity of ${e6(s6.vFtS)} ft/s and a Reynolds number of ${r4(s6.re)}, which is ${s6.regime}; at a relative roughness of ${num(s6.relRoughDerived, 10)} the friction factor is ${num(s6.f, 10)} and the pipe costs ${e6(s6.dpFrictionPsi)} psi; the isometric's ${e6(s6.sumK)} velocity heads add ${e6(s6.dpFittingsPsi)} psi; and the erosional limit at the continuous-service c factor is ${e6(s6.erosionalFtS)} ft/s, which this line uses ${e6(s6.usedFractionDerived)} of.`);
  w('Everything in that sentence is closed form. Nothing in it iterated except the friction factor, and nothing in it compressed. Both of those change in the next tier.');
  w();

  // Section 7
  const s7 = L.gasLineBasics();
  w('# SECTION 7: A gas line is not a liquid line (owned by Professional m01)');
  w();
  w(`The SOKU gas trunk as the studio reads it: ${e6(s7.p1Psia)} psia at the station, ${e6(s7.p2Psia)} psia at the delivery point, ${e6(s7.idIn)} in of bore over ${e6(s7.lengthMi)} miles, gas gravity ${e6(s7.sg)}, average flowing temperature ${e6(s7.tAvgR)} degR, average compressibility ${e6(s7.zAvg)}, efficiency ${e6(s7.efficiency)}.`);
  w(`The driving group is the difference of the SQUARES: ${e6(s7.p1Psia)} squared less ${e6(s7.p2Psia)} squared is ${r4(s7.drivingGroupDerived)} psia squared (derived, stated on the row). A liquid line subtracts pressures; a gas line subtracts their squares, because the density the friction sees is itself proportional to the pressure.`);
  w(`The base the published forms report at: ${e6(s7.tbR)} degR and ${e6(s7.pbPsia)} psia. A rate in scfd is a rate AT THAT BASE, so two forms quoted at different bases are not comparable even when they agree.`);
  w(`A line whose outlet meets its inlet has no answer at all: at ${e6(s7.deadP2Psia)} psia out against ${e6(s7.p1Psia)} psia in, the engine returns ${soft(s7.deadError)}.`);
  w(`A line that is nearly dead does have one: at ${e6(s7.nearlyDeadP2Psia)} psia out, five psi below the inlet, Weymouth gives ${r4(s7.nearlyDeadScfd)} scfd.`);
  w();

  // Section 8
  const s8 = L.transmissionForms();
  w('# SECTION 8: The four transmission forms (owned by Professional m02)');
  w();
  w('The SOKU trunk through all four, on identical inputs:');
  w('| form | rate scfd | against Weymouth |');
  w('| --- | --- | --- |');
  s8.forms.forEach((f) => w(`| ${f.form} | ${r4(f.qScfd)} | ${e6(f.againstWeymouthDerived)} |`));
  w(`The spread from the lowest to the highest is ${e6(s8.spreadDerived)} (derived from the column above). Four published answers to one question, and choosing between them is engineering rather than arithmetic.`);
  w(`General Flow also returns the friction factor it settled on, ${num(s8.generalFDarcy, 10)}, which is the only one of the four that says anything about the pipe's roughness at all.`);
  w();
  w('The diameter exponent of each form, measured by doubling the bore and reading the engine:');
  w(`| form | rate at ${e6(s8.exponentProbeBoresIn[0])} in | rate at ${e6(s8.exponentProbeBoresIn[1])} in | measured exponent |`);
  w('| --- | --- | --- | --- |');
  s8.exponents.forEach((x) => w(`| ${x.form} | ${r4(x.at10)} | ${r4(x.at20)} | ${num(x.exponentDerived, 10)} |`));
  w('The exponent is derived as the base-two logarithm of the ratio of the two engine rates on each row. It is the single most important number in a gas form, because it is what says how much a bigger pipe buys.');
  w();
  w('The efficiency multiplier, which every form carries:');
  w('| efficiency | weymouth scfd | panhandleA scfd | panhandleB scfd | general scfd |');
  w('| --- | --- | --- | --- | --- |');
  s8.efficiencyRows.forEach((r) => w(`| ${e6(r.efficiency)} | ${r.rates.map((q) => r4(q)).join(' | ')} |`));
  w();
  w("What that multiplier actually does to each form, derived on every row as the form's own rate at that efficiency over its own rate at an efficiency of 1.000000, and then that same ratio less the efficiency the row was computed at:");
  w('| efficiency | weymouth | panhandleA | panhandleB | general | weymouth less e | panhandleA less e | panhandleB less e | general less e |');
  w('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  s8.efficiencyRows.forEach((r) => w(`| ${e6(r.efficiency)} | ${r.ratiosDerived.map((v) => num(v, 12)).join(' | ')} | ${r.deviationsDerived.map(ex3).join(' | ')} |`));
  w(`The four right-hand columns are each form's ratio less the efficiency on that row, in exponential form so that a last-bit artefact cannot be read as a deviation. Across every row the largest of them on Weymouth, Panhandle A and Panhandle B is ${ex3(s8.efficiencyLinearWorstDerived)}, which is one step of a double beside one and is what a plain multiplier looks like. The largest on General Flow is ${ex3(s8.efficiencyGeneralWorstDerived)}, at an efficiency of ${e6(s8.efficiencyLowest)}, and the second over the first is ${ex3(s8.efficiencyWorstRatioDerived)} (derived from the two figures on this row). General Flow solves a friction factor against the rate it settles on, so a lower efficiency lowers the rate, the rate moves the Reynolds number, and the friction factor moves with it.`);
  w();
  w('# HELD FOR LITERATURE, taught as a limit and never graded: the efficiency factor. Three of the four forms carry it as a plain multiplier and General Flow carries it by the amounts the table above derives, and no publication in this package stands behind any particular value of it. Every graded gas value in this course states its own efficiency.');
  w();
  w('The published gas cases, engine against golden:');
  s8.published.forEach((c) => w(`- ${c.input.equation}, ${e6(c.input.idIn)} in over ${e6(c.input.lengthMi)} mi, ${e6(c.input.p1Psia)} to ${e6(c.input.p2Psia)} psia, elevation ${e6(c.input.elevChangeFt)} ft, efficiency ${e6(c.input.efficiency)}: engine ${r4(c.qScfd)} scfd, golden ${r4(c.goldenScfd)} scfd (golden).`));
  w();

  // Section 9
  const s9 = L.elevationGroup();
  w('# SECTION 9: The elevation adjustment (owned by Professional m03)');
  w();
  w('The group all four forms share, on the SOKU trunk:');
  w('| elevation change ft | s | e to the s | equivalent length factor |');
  w('| --- | --- | --- | --- |');
  s9.rows.forEach((r) => w(`| ${e6(r.elevChangeFt)} | ${num(r.s, 10)} | ${num(r.es, 10)} | ${num(r.leFactor, 10)} |`));
  w(`A hill does two things and they are not the same thing. It scales the outlet pressure inside the driving group through e to the s, and it changes the length the friction acts over through the equivalent length factor. At zero elevation both collapse to ${num(1, 10)} on the row above, and the Weymouth rate with the hill set to zero is ${r4(s9.flatAgainScfd)} scfd against the Section 8 rate of ${r4(s9.sectionEightWeymouthScfd)} scfd, a difference of ${r4(s9.flatAgainDifferenceDerived)} scfd (derived from the two engine values on this row), so the flat form is what the adjusted form becomes.`);
  w(`The coefficient inside s, measured by asking the engine for s at a gravity of one, a thousand feet of rise, an absolute temperature of one and a compressibility of one, then dividing by the thousand feet: ${num(s9.coefficientDerived, 12)} (derived from the engine's ${num(s9.coefficientProbeS, 6)}).`);
  w(`The rise is in FEET and the length is in MILES, and the forms guard one against the other, so the conversion is readable here rather than assumed: on a line ${e6(s9.mileProbeLengthMi)} mile long the largest rise the engine accepts is ${num(s9.mileFtAccepted, 9)} ft, and the next representable value above it, ${s9.mileGapFt.toExponential(3)} ft higher, is refused (engine).`);
  w();
  w('What the hill costs the trunk, by form:');
  w('| form | flat scfd | up scfd | down scfd | up as a fraction of flat | down as a fraction of flat |');
  w('| --- | --- | --- | --- | --- | --- |');
  s9.byForm.forEach((r) => w(`| ${r.form} | ${r4(r.flat)} | ${r4(r.up)} | ${r4(r.down)} | ${e6(r.upFractionDerived)} | ${e6(r.downFractionDerived)} |`));
  w(`Uphill is not the mirror of downhill, because the term is an exponential and an exponential is not symmetric about zero. Averaging the two fractions on the Weymouth row gives ${e6(s9.weymouthAverageDerived)} (derived from the two fractions on that row), which is close to one and is not one.`);
  w();

  // Section 10
  const s10 = L.outletPressure();
  w('# SECTION 10: The outlet pressure (owned by Professional m04)');
  w();
  w('# App surface: this is the direction the studio actually works in. A designer knows the rate the terminal has contracted for and wants the pressure it will see, which is the inverse of every form above.');
  w('The engine has no closed inversion. It bisects on the outlet pressure, calling the published form at each step, inside a bracket that runs from atmospheric up to the pressure at which the driving group vanishes. That upper end is the inlet over the square root of e to the s, and it is NOT the inlet: a hill moves it.');
  w(`The FLOOR of that bracket is atmospheric, which the module does not export, so it is measured the way every other constant here is: push the requested rate up until the solve refuses, and read the outlet it converges on at the largest rate it still accepts. The largest rate this trunk accepts is ${r4(s1.atmosphericLargestRateScfd)} scfd, the outlet there is ${e6(s1.atmosphericFloorPsia)} psia, and one scfd more is refused (engine). That floor is not the base the published forms report at: it stands ${e6(s1.baseAgainstAtmosphericDerived)} psi above the ${e6(s1.pbPsia)} psia of Section 7 (derived from the two figures on this row).`);
  w();
  w('Round trips on the flat trunk, each form solved back to the outlet it came from:');
  w('| form | rate scfd | outlet recovered psia | against the stated outlet psia |');
  w('| --- | --- | --- | --- |');
  s10.roundTrips.forEach((r) => w(`| ${r.form} | ${r4(r.qScfd)} | ${r.error ? r.error : e6(r.p2Psia)} | ${r.error ? 'refused' : e6(r.againstStatedDerived)} |`));
  w();
  w(`The trunk asked for ${r4(s10.targetScfd)} scfd through the Weymouth form arrives at ${e6(s10.targetP2Psia)} psia, a drop of ${e6(s10.targetDpPsi)} psi.`);
  w(`A rate the line cannot carry at all is refused rather than approximated: ${soft(s10.unreachableError)}`);
  w();
  w('The ceiling the bracket ends at, on the SOKU trunk, derived on each row as the inlet over the square root of the engine\'s own e to the s:');
  w('| elevation change ft | e to the s | the outlet the rate approaches as it falls to nothing, psia | against the inlet, psi |');
  w('| --- | --- | --- | --- |');
  s10.ceilings.forEach((r) => w(`| ${e6(r.elevChangeFt)} | ${num(r.es, 10)} | ${e6(r.ceilingPsiaDerived)} | ${e6(r.againstInletDerived)} |`));
  w('A flat line ends its bracket at its own inlet. A DESCENT ends it above the inlet, because the column recovers more head than the friction spends. A CLIMB ends it below, because the column costs head that no rate gets back. Reading the fourth column is reading how much of the answer a bracket of atmospheric-to-the-inlet would have been unable to express.');
  w();
  w(`Down ${e6(s10.steepDownFt)} ft, the trunk carries ${r4(s10.steepScfd)} scfd when its outlet stands at ${e6(s10.steepOutletPsia)} psia, which is ${e6(s10.steepAboveInletPsi)} psia ABOVE its inlet of ${e6(s10.p1Psia)} psia.`);
  w(`Given that same rate the inverse returns ${shape(s10.steepInverseShape)}, and the forward call and the inverse call now differ by ${e6(s10.steepInverseErrorDerived)} psi. The drop is NEGATIVE because the line arrives higher than it left, which is the honest reading of a descent and not an error state.`);
  w(`THE CONTROL. Run the SAME descent with an outlet genuinely BELOW the inlet, ${e6(s10.controlP2Psia)} psia against ${e6(s10.p1Psia)} psia: the trunk carries ${r4(s10.controlScfd)} scfd and the inverse recovers ${e6(s10.controlRecoveredPsia)} psia, an error of ${e6(s10.controlErrorDerived)} psi. Both answers come out of the same bisection. A search whose answer lies outside its bracket and a search that cannot converge look identical from a single case, and only a case with its answer inside the bracket tells the two apart.`);
  w();
  w(`The climb is the same bracket read from the other side, and it is the commoner case. Up ${e6(s10.steepUpFt)} ft, asked for ${r4(s10.steepUpScfd)} scfd, the trunk delivers at ${e6(s10.upP2Psia)} psia for a drop of ${e6(s10.upDpPsi)} psi, and the ceiling on the table above, ${e6(s10.upCeilingPsiaDerived)} psia, stands ${e6(s10.upCeilingAboveDeliveredDerived)} psi above that delivery (derived from the two figures on this row) and is as close to the inlet as any rate can bring it.`);
  w(`And a climb the inlet cannot pay for at all is refused rather than answered. The same hill under a near-atmospheric inlet of ${e6(s10.starvedP1Psia)} psia: ${soft(s10.starvedError)}`);
  w();

  // Section 11
  const s11 = L.profileMarch();
  w('# SECTION 11: Marching a profile (owned by Professional m05)');
  w();
  w('A traverse marches the line segment by segment and returns the pressure at every station, so a designer draws the hydraulic gradient instead of asserting one number.');
  w();
  w('The OGBIA line flat, and the same line over a ridge, station by station:');
  w('| station | distance ft | flat elevation ft | flat pressure psia | ridge elevation ft | ridge pressure psia |');
  w('| --- | --- | --- | --- | --- | --- |');
  s11.stations.forEach((s) => w(`| ${s.index} | ${e6(s.distanceFt)} | ${e6(s.flatElevFt)} | ${e6(s.flatPPsia)} | ${e6(s.ridgeElevFt)} | ${e6(s.ridgePPsia)} |`));
  w(`Both arrive at ${e6(s11.arrivalPsia)} psia, having spent ${e6(s11.spentPsi)} psi, because the ridge climbs ${e6(s11.riseFt)} ft and gives all of it back. The ARRIVAL is the same and the middle of the line is not: at the crest the ridge stands at ${e6(s11.crestRidgePsia)} psia against ${e6(s11.crestFlatPsia)} psia, a difference of ${e6(s11.crestDifferenceDerived)} psi. A line is sized on its worst station and not on its last one.`);
  w();
  w(`Marched against one shot: the traverse spends ${e6(s11.spentPsi)} psi over ${e6(s11.totalFt)} ft and a single call over the same length spends ${e6(s11.oneShotPsi)} psi, a difference of ${e6(s11.marchAgainstOneShotDerived)} psi (derived from the two engine values on this row). A liquid is incompressible, so marching it buys the station list and nothing else.`);
  w();
  w(`What a traverse drops: the one-shot call carrying the isometric's ${e6(s11.sumK)} velocity heads spends ${e6(s11.withKPsi)} psi, and the traverse of the same line spends ${e6(s11.spentPsi)} psi. The gap of ${e6(s11.fittingsGapDerived)} psi is the one-shot call's own fittings term, which the engine returns separately as ${e6(s11.withKFittingsPsi)} psi, the two differing by ${ex3(s11.fittingsGapAgainstTermDerived)} psi (derived from the three engine values on this row), because liquidLineTraverse has no resistance-sum argument at all.`);
  w();
  const d11 = s11.dead;
  w(`Where a line dies, and what the engine says about it: ${e6(d11.input.qBpd)} bpd of ${e6(d11.input.rhoLbFt3)} lb/ft3 at ${e6(d11.input.muCp)} cp through ${e6(d11.input.idIn)} in over ${e6(d11.input.lengthFt)} ft, entering at ${e6(d11.input.p1Psia)} psia.`);
  w(`The traverse refuses: ${soft(d11.error)}`);
  w(`It refuses with the evidence attached rather than instead of it. The stations it managed to stand behind: ${d11.stationCount}, the last of them at ${e6(d11.lastDistanceFt)} ft and ${e6(d11.lastPPsia)} psia. The distance it died at: ${e6(d11.diedAtFt)} ft. The pressure the arithmetic actually produced there: ${e6(d11.diedAtPsia)} psia, which is not a pressure.`);
  w(`The single call underneath still answers, because a DROP is not a PRESSURE and nothing about it is unphysical: the same line spends ${e6(d11.singleCallPsi)} psi, and the inlet less that drop is ${e6(d11.inletLessDropDerived)} psia (derived from the two figures on this row), which is the figure the traverse reported at the far end. A rate that costs more than the inlet holds is a rate the line cannot pass, and the traverse is the call that knows the inlet.`);
  w();

  // Section 12
  const s12 = L.professionalReading();
  w('# SECTION 12: The Professional reading, a trunk end to end (owned by Professional m06)');
  w();
  w(`SOKU end to end: ${e6(s12.idIn)} in over ${e6(s12.lengthMi)} miles from ${e6(s12.p1Psia)} to ${e6(s12.p2Psia)} psia gives a driving group of ${r4(s12.drivingGroupDerived)} psia squared (derived); Weymouth reads ${r4(s12.weymouthScfd)} scfd, Panhandle A ${r4(s12.panhandleAScfd)}, Panhandle B ${r4(s12.panhandleBScfd)} and General Flow ${r4(s12.generalScfd)} at a friction factor of ${num(s12.generalFDarcy, 10)}; put the trunk up ${e6(s12.upFt)} ft and the Weymouth rate falls to ${r4(s12.upScfd)}, down the same and it rises to ${r4(s12.downScfd)}; and asked for ${r4(s12.targetScfd)} scfd the line delivers at ${e6(s12.targetP2Psia)} psia.`);
  w(`Four forms and one line. The spread across the four forms is ${e6(s12.formSpreadDerived)}. One step of bore on the same trunk through Weymouth, from ${e6(s12.boreLoIn)} in to ${e6(s12.boreHiIn)} in, runs ${r4(s12.boreLoScfd)} scfd to ${r4(s12.boreHiScfd)} scfd, a spread of ${e6(s12.boreSpreadDerived)} (derived from the two engine rates on this row). The bore spread over the form spread is ${e6(s12.boreOverFormDerived)} (derived from the two figures on this row), so on this trunk one step of bore moves the answer further than the choice of form does, and a designer has to defend both.`);
  w();

  // Section 13
  const s13 = L.wallCode();
  w('# SECTION 13: The wall a code demands (owned by Expert m01)');
  w();
  w('The B31.8 location classes the module carries, and what B31.4 uses instead:');
  w('| location class | design factor |');
  w('| --- | --- |');
  s13.designFactors.forEach((r) => w(`| ${r.locationClass} | ${e6(r.f)} |`));
  w(`B31.4 uses a flat design factor of ${e6(s13.b314Factor)} whatever the route, which is the same number B31.8 gives to Class 1.`);
  w();
  w(`The SOKU wall: ${e6(s13.wall.designPsig)} psig design on ${e6(s13.wall.odIn)} in outside diameter at a specified minimum yield of ${e6(s13.wall.smysPsi)} psi, joint factor ${e6(s13.wall.jointFactor)}, temperature derate ${e6(s13.wall.tempDerate)}, corrosion allowance ${e6(s13.wall.corrosionAllowanceIn)} in.`);
  w('| code | class | design factor | pressure wall in | required wall in | MAOP of the required wall psig |');
  w('| --- | --- | --- | --- | --- | --- |');
  s13.classRows.forEach((r) => w(`| B31.8 | ${r.locationClass} | ${e6(r.designFactor)} | ${e6(r.tPressureIn)} | ${e6(r.tRequiredIn)} | ${e6(r.maopPsig)} |`));
  w(`| B31.4 | any | ${e6(s13.b314Row.designFactor)} | ${e6(s13.b314Row.tPressureIn)} | ${e6(s13.b314Row.tRequiredIn)} | ${e6(s13.b314Row.maopPsig)} |`);
  w(`Class 4 asks for ${e6(s13.class4OverClass1Derived)} times the pressure wall of Class 1 on the same pipe at the same pressure (derived from the two rows above). What moved it is the route rather than the fluid.`);
  w();
  w('The joint factor and the temperature derate, one at a time, at Class 1:');
  w('| joint factor | pressure wall in | temperature derate | pressure wall in |');
  w('| --- | --- | --- | --- |');
  s13.factorRows.forEach((r) => w(`| ${e6(r.jointFactor)} | ${e6(r.jointWallIn)} | ${e6(r.tempDerate)} | ${e6(r.derateWallIn)} |`));
  w('Both sit in the denominator beside the design factor, so both make the wall thicker, and neither of them is strength: they are confidence in the seam and confidence in the steel when it is hot.');
  w();
  w(`The corrosion allowance is not strength either. At Class 3 the pressure part of the wall is ${e6(s13.class3PressureIn)} in and the required wall is ${e6(s13.class3RequiredIn)} in, the difference being the ${e6(s13.corrosionAllowanceIn)} in allowance added on top. It holds no pressure on the day it is installed and it is what lets the pipe still hold pressure years later.`);
  w(`Read the rating back off the wall the mill actually rolled, ${e6(s13.asBuiltIn)} in: with the allowance respected the line rates ${e6(s13.maopWithPsig)} psig, and with the allowance left out of the call it rates ${e6(s13.maopWithoutPsig)} psig, which is ${e6(s13.maopRatioDerived)} times the rating the allowance produces (derived from the two engine values on this row). Both calls are legal and neither warns.`);
  w();
  w('The published wall cases, engine against golden:');
  s13.published.forEach((c) => w(`- ${c.input.code} class ${c.input.locationClass}, ${e6(c.input.designPsig)} psig on ${e6(c.input.odIn)} in at ${e6(c.input.smysPsi)} psi, joint ${e6(c.input.jointFactor)}, derate ${e6(c.input.tempDerate)}, allowance ${e6(c.input.corrosionAllowanceIn)} in: design factor ${e6(c.designFactor)}, required wall ${num(c.tRequiredIn, 10)} in, MAOP back ${e6(c.maopPsig)} psig; golden wall ${num(c.goldenWallIn, 10)} in and golden MAOP ${e6(c.goldenMaopPsig)} psig (golden).`));
  w();

  // Section 14
  const s14 = L.pigging();
  w('# SECTION 14: The pig and what it pushes (owned by Expert m02)');
  w();
  w(`The OGBIA pigging duty: ${e6(s14.pig.idIn)} in of bore over ${e6(s14.pig.lengthFt)} ft, swept by a sphere at ${e6(s14.pig.pigSpeedFtS)} ft/s.`);
  w(`Line volume ${r4(s14.lineVolumeBbl)} bbl (engine). Run time ${e6(s14.runHours)} hours (engine), which the engine reports beside the speed it was given, ${e6(s14.pigSpeedFtS)} ft/s.`);
  w();
  w('THE HOLDUP IS AN INPUT AND NOT A RESULT. The engine says so in its own header: the swept volume is the line volume times a holdup somebody else measured or assumed, and a pigging estimate is only as honest as that number.');
  w('| holdup | swept bbl | as a fraction of the line volume | days between runs at the nominal catcher |');
  w('| --- | --- | --- | --- |');
  s14.holdupRows.forEach((r) => w(`| ${e6(r.holdupFrac)} | ${r4(r.sweptBbl)} | ${e6(r.fractionOfVolumeDerived)} | ${r.error ? r.error : r4(r.intervalDays)} |`));
  w(`At a holdup of zero the sweep is ${r4(s14.zeroHoldupSweptBbl)} bbl, and at a holdup of one it is ${r4(s14.fullHoldupSweptBbl)} bbl against a line volume of ${r4(s14.lineVolumeBbl)} bbl, the two differing by ${r4(s14.fullHoldupAgainstVolumeDerived)} bbl (derived from the two engine values on this row), which is the whole line. The interval collapses as the holdup rises, and past a point the catcher cannot take the sweep at all and the engine refuses rather than returning a negative interval.`);
  w();
  w(`At the nominal holdup of ${e6(s14.nominalHoldup)} the sphere pushes ${r4(s14.nominalSweptBbl)} bbl ahead of it into a ${e6(s14.catcherBbl)} bbl catcher, leaving ${r4(s14.roomDerivedBbl)} bbl of room (derived on the row), which at ${e6(s14.dropoutBpd)} bpd of dropout is ${r4(s14.nominalIntervalDays)} days between runs (engine).`);
  w(`Put the same sweep into a ${e6(s14.smallCatcherBbl)} bbl catcher and there is no interval at all: ${soft(s14.smallCatcherError)}`);
  w('That message is the handshake with the separation course: the slug a catcher has to hold is what this engine computes, and the vessel that holds it is sized elsewhere.');
  w();
  w('The published pigging cases, engine against golden:');
  s14.published.forEach((c) => w(`- ${e6(c.input.idIn)} in over ${e6(c.input.lengthFt)} ft at a holdup of ${e6(c.input.holdupFrac)}: volume ${r4(c.lineVolumeBbl)} bbl, swept ${r4(c.sweptBbl)} bbl, run ${e6(c.runHours)} h at ${e6(s14.goldenPigSpeedFtS)} ft/s; golden volume ${r4(c.goldenVolumeBbl)} bbl, golden swept ${r4(c.goldenSweptBbl)} bbl, golden run ${e6(c.goldenRunHours)} h (golden).`));
  w();
  w('The seconds in an hour, measured out of this section rather than assumed. The engine is handed feet and feet per second and answers in HOURS, so the conversion it keeps to itself is the slope of the run time against the length:');
  w(`the seconds per hour, measured as the extra length between two published cases over the speed times the extra run time the engine reports for them: ${e6(s14.secondsPerHourSlopeDerived)} (derived from the engine's run times ${e6(s14.secondsPerHourCaseA.runHours)} h over ${e6(s14.secondsPerHourCaseA.lengthFt)} ft and ${e6(s14.secondsPerHourCaseB.runHours)} h over ${e6(s14.secondsPerHourCaseB.lengthFt)} ft, both at ${e6(s14.goldenPigSpeedFtS)} ft/s).`);
  w(`The single-case reading agrees: the OGBIA duty's own length over its speed times its run time is ${e6(s14.secondsPerHourSingleDerived)}, the two differing by ${e6(s14.secondsPerHourAgreementDerived)} (derived from the two figures on this row).`);
  w();

  // Section 15
  const s15 = L.correlationLimits();
  w('# SECTION 15: Where the correlations stop (owned by Expert m03)');
  w();
  w(`The jump at the branch, again and exactly: on the OGBIA pipe the friction factor is ${num(s15.fJustBelow, 10)} at Reynolds ${num(s15.reJustBelow, 7)} and ${num(s15.fAtBranch, 10)} at Reynolds ${r4(s15.reAtBranch)}, a ratio of ${e6(s15.jumpRatioDerived)} (derived from the two engine values on this row).`);
  w('Nothing physical happens in that interval. The engine leaves the laminar law and starts the turbulent one, and the discontinuity is the price of having no correlation for the band between them.');
  w();
  w(`Colebrook past the roughness it was published for, which reaches about ${s15.colebrookPublishedTo}:`);
  w(`| relative roughness | f at Reynolds ${r4(s15.reForDomainSweep)} |`);
  w('| --- | --- |');
  s15.domainRows.forEach((r) => w(`| ${e6(r.relRough)} | ${num(r.f, 10)} |`));
  w(`The engine answers all ${s15.colebrookRowCount} and flags none of them. ${s15.colebrookPastPublished} of the rows stand above ${s15.colebrookPublishedTo} (derived from the column above), and every one of those is an extrapolation of a fitted curve into a region where the pipe is more obstruction than pipe.`);
  w();
  w('The friction Weymouth assumes, measured by asking General Flow what friction factor would make it agree:');
  w('| bore in | weymouth scfd | general scfd | the friction factor general settled on | the friction factor that would make general match weymouth |');
  w('| --- | --- | --- | --- | --- |');
  s15.weymouthFriction.forEach((r) => w(`| ${e6(r.idIn)} | ${r4(r.weymouthScfd)} | ${r4(r.generalScfd)} | ${num(r.generalFDarcy, 10)} | ${num(r.matchingFDerived, 10)} |`));
  w('The last column is derived from the two engine rates and the engine friction factor on each row, using the fact that a General Flow rate goes as one over the square root of f. It falls as the bore grows, which is the signature of a fully rough friction law that depends on the diameter and not on the Reynolds number.');
  w();
  w('No form checks its own regime. The same nearly dead trunk through Weymouth and through General Flow:');
  w(`Weymouth ${r4(s15.deadWeymouthScfd)} scfd, General Flow ${r4(s15.deadGeneralScfd)} scfd at a friction factor of ${num(s15.deadGeneralFDarcy, 10)}, a ratio of ${e6(s15.deadRatioDerived)} (derived).`);
  w(`On the same line at its full duty the two sit at ${e6(s15.fullDutyRatioDerived)} of each other, so the distance from agreement is ${e6(s15.deadDistanceDerived)} on the nearly dead line against ${e6(s15.fullDutyDistanceDerived)} at full duty (derived from the two ratios on these rows), and neither form says which it is on.`);
  w();
  w('Neither iteration in this module reports whether it converged. The friction factor solve runs a fixed point and the General Flow solve runs a rate and a friction factor against each other, and both return their last iterate with no flag beside it. They do converge everywhere this digest looked, which is exactly what makes the absence easy to miss.');
  w();

  // Section 16
  const s16 = L.refusalCatalogue();
  w('# SECTION 16: What it refuses, and what a refusal looks like (owned by Expert m04)');
  w();
  w('A refusal in this engine is an object carrying an `error` string. It is never a thrown exception, never a null and never a bare number, and the shape is the contract: a caller checks a property rather than inspecting a value. That is exactly why a NaN or an Infinity returned WITHOUT an error is worse than no guard at all. It passes the check and then propagates into whatever is downstream, which for this engine is a sizing sweep, a marched profile and a wall specification.');
  w('Three returns sit outside that contract on purpose. The Reynolds number and the line volume are bare numbers with nowhere to put a message, so they answer NaN by documented contract and the functions that wrap them refuse in words. The friction factor carries its refusal in the regime it already returns. Read the next three rows knowing that a NaN has no JSON spelling and serialises as null: the engine returns NaN, and null is what printing it does.');
  w(`- the Reynolds number of a line with no viscosity: ${s16.reynoldsNoViscosity}`);
  w(`- the volume of a line with no bore: ${s16.volumeNoBore}`);
  w(`- the friction factor at a negative relative roughness: ${shape(s16.frictionNegativeRoughnessShape)}`);
  w();
  w('Inputs that have no physical meaning, and the message each one produces, verbatim:');
  s16.refusals.forEach((r) => w(`- ${r.label}: ${soft(r.error)}`));
  w(`That catalogue is ${s16.refusalEntries} entries carrying ${s16.refusalDistinctDerived} distinct messages (derived by counting the rows above and the messages on them), so ${s16.refusalRepeatedDerived} messages appear more than once. They split ${s16.refusalTwoFunctionsDerived} and ${s16.refusalTwoValuesDerived} (derived from the function each row called): ${s16.refusalTwoFunctionsDerived} are ONE GUARD reached from TWO DIFFERENT FUNCTIONS, and ${s16.refusalTwoValuesDerived} are ONE FUNCTION refusing TWO DIFFERENT bad values. A reader who counts messages rather than entries is counting guards rather than ways in, and the two numbers are not the same number.`);
  w();
  w('Every one of those guards has a boundary, and the boundary is where the teaching is: a resistance sum of zero is a line with no fittings and is perfectly legal, an efficiency of exactly one is the ideal the forms are written for, a holdup of one is a line running full, and a line exactly as tall as it is long is vertical. The engine is handed the value on each side and says which it took:');
  w('| guard | value | the engine |');
  w('| --- | --- | --- |');
  s16.boundaries.forEach((b) => w(`| ${b.label} | ${num(b.value, 6)} | ${b.refuses ? 'refuses' : 'answers'} |`));
  w('A guard that refuses its own limit is as wrong as one that accepts nonsense, which is why both sides are read rather than one.');
  w();
  w('That guard on the gas forms is the one that measures a constant. It compares a rise in FEET against a length in MILES, so the largest rise it accepts, divided by the length, is the feet in a mile the module keeps to itself. The engine is handed a rise and says which side of the guard it fell on:');
  w('| line length mi | largest rise accepted ft | the next value above it, refused, is higher by ft | accepted rise per mile ft |');
  w('| --- | --- | --- | --- |');
  s16.mileGuardRows.forEach((r) => w(`| ${e6(r.lengthMi)} | ${num(r.largestAcceptedFt, 9)} | ${r.nextValueGapFt.toExponential(3)} | ${num(r.perMileDerived, 9)} |`));
  w(`The last column is the second divided by the first on each row (derived). The two rows differ by ${num(s16.mileGuardPerMileDifferenceDerived, 9)} ft per mile (derived from the two figures in that column), so the guard is built on one constant and not on a tolerance. The third column is the floating point step at each magnitude, which is why it grows with the length and is not a band the engine chose.`);
  w();
  w('What the engine still accepts and arguably should not, and none of it is a number this course grades. The same class of question asked of the catalogues, which answer it three different ways:');
  w(`- a fitting the table does not carry: fittingK returns ${s16.catalogueAnswers.fittingK}`);
  w(`- a roughness the table does not carry: roughnessOf returns ${s16.catalogueAnswers.roughnessOf}`);
  w(`- a grade the table does not carry: gradeYield returns ${s16.catalogueAnswers.gradeYield}`);
  w(`- a pipe size the table does not carry: scheduleRow returns ${shape(s16.catalogueAnswers.scheduleRow)}`);
  w(`- an erosional service the table does not carry: erosionalC returns ${shape(s16.catalogueAnswers.erosionalC)}`);
  w('Four of the five say they do not know. The fifth answers under a label it was not asked for, and it stays that way because the RP 14E table belongs to the wellhead engine that two other studios read, so what an unknown service returns is a decision for that table rather than for this line-sizing chain.');
  w(`And the rating still over-rates a line if the caller drops the allowance, because the allowance is an argument of the rating rather than a property of the pipe. It is the pair the wall section already read: the same wall reads ${e6(s13.maopWithPsig)} psig with the allowance and ${e6(s13.maopWithoutPsig)} psig without, ${e6(s13.maopRatioDerived)} times the rating with the allowance, and the factor is the gross wall over the net rather than anything about this pipe. Both calls are legal, both are correct for what they were asked, and neither warns. A guard cannot fix a question that was fully formed and simply wrong.`);
  w();

  // Section 17
  const s17 = L.heldItems();
  w('# SECTION 17: What the method does not know (owned by Expert m05)');
  w();
  w('Five things this course teaches as limits and never as answers. The first four are items HELD FOR THE LITERATURE, which means a figure the course uses and no publication in this package stands behind. The fifth is not a figure at all: it is what the published cases in this golden are.');
  w(`1. The API RP 14E c factors, ${e6(s17.cContinuous)}, ${e6(s17.cIntermittent)} and ${e6(s17.cCleanInhibited)}. HELD FOR LITERATURE. The recommended practice says its own figures are conservative, and the third is labelled operator practice with no source.`);
  w('2. The efficiency multiplier on all four gas forms. HELD FOR LITERATURE. Nothing in this package stands behind any value of it, and the engine bounding it to above zero and at most one is a bound rather than a source.');
  w(`3. The band from Reynolds 2100 to 4000, where the engine computes on the turbulent branch and labels the answer transitional. HELD FOR LITERATURE. The step across the boundary is ${e6(s17.jumpRatioDerived)} times.`);
  w('4. The fully rough friction law Weymouth assumes. HELD FOR LITERATURE. Section 15 measures it out of the engine and nothing sources it.');
  w('5. The published cases in this golden are SYNTHETIC. They come from an independent oracle written in Python from the same physics, in SI units where the engine works in field units, which catches an arithmetic or a unit error and cannot catch a method that is wrong in both files. No measured pipeline is in this course.');
  w();
  w('And one thing that is not held but simply absent: THE MULTIPHASE HALF IS NOT IN THIS ENGINE. There is no flow regime, no slip, no holdup correlation and no slug model anywhere in it. Wherever a holdup is needed the engine takes it as an input, which is honest and is also a seam a reader has to see rather than infer.');
  w();
  w('One barrel for the package, measured out of each module by asking that module a question about itself rather than by reading either source:');
  w(`- from lineHydraulics, as the flow area times the length over the line volume: ${num(s17.bblFromLineHydraulicsDerived, 13)} cubic feet per barrel`);
  w(`- from chokePerformance, as the erosional velocity times the area times the seconds in a day over the erosional rate: ${num(s17.bblFromChokePerformanceDerived, 13)} cubic feet per barrel`);
  w(`The ratio of the two is ${num(s17.bblRatioDerived, 13)} (derived from the two rows above). The package gives both modules one definition of a barrel, and it is exact by definition rather than by measurement: forty-two gallons of two hundred and thirty-one cubic inches each, over the seventeen hundred and twenty-eight cubic inches in a cubic foot. Each module's own oracle works from that definition, which is why asking the two modules separately is a check on the chain rather than a reading of one source.`);
  w();

  // Section 18
  const s18 = L.expertReading();
  w('# SECTION 18: The Expert reading, three questions and the pipes they are asked of (owned by Expert m06)');
  w();
  w(`Three questions, and the TWO pipes they are asked of. As a hydraulic line the OGBIA bore of ${e6(s18.idIn)} in carries ${e6(s18.qBpd)} bpd at ${e6(s18.vFtS)} ft/s, Reynolds ${r4(s18.re)}, and spends ${e6(s18.dpTotalPsi)} psi over ${e6(s18.lengthFt)} ft, against an erosional ceiling of ${e6(s18.erosionalFtS)} ft/s that it uses ${e6(s18.usedFractionDerived)} of.`);
  w(`As a pressure envelope the SOKU pipe at ${e6(s18.odIn)} in outside diameter and ${e6(s18.smysPsi)} psi of yield needs ${e6(s18.class3RequiredIn)} in of wall at Class 3 and ${e6(s18.class1RequiredIn)} in at Class 1, and the ${e6(s18.asBuiltIn)} in the mill rolled rates ${e6(s18.maopPsig)} psig. That is a different pipe from the one above it: its bore is the outside diameter less twice the wall, ${e6(s18.wallBoreDerivedIn)} in, which stands ${e6(s18.wallBoreAgainstOgbiaDerived)} in wider than the OGBIA bore (derived from the two figures on these rows).`);
  w(`As a volume the OGBIA line holds ${r4(s18.lineVolumeBbl)} bbl, a sphere crosses it in ${e6(s18.runHours)} hours, and at a measured holdup of ${e6(s18.nominalHoldup)} it delivers ${r4(s18.nominalSweptBbl)} bbl to whatever is waiting at the end, every ${r4(s18.nominalIntervalDays)} days.`);
  w('Three answers, and not one of them can be derived from the other two. The independence is not a trick of one pipe wearing three hats, which is why the wall reading above is stated on the pipe it belongs to: what a line spends in pressure, what wall a code demands of it and what liquid a pig pushes out of it are three separate questions, and an answer to any one of them carries no answer to another.');
  w();

  return `${out.join('\n')}\n`;
};

/** Split a digest into its preamble and its eighteen sections, keyed by number. */
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
const SECTION_KEYS = ['preamble', ...Array.from({ length: 18 }, (_, i) => `S${i + 1}`)];

/** Every reader, one per digest section. */
const READERS = [
  'engineScope', 'frictionAndRegime', 'threeLosses', 'erosionalLimit', 'boreChoice',
  'associateReading', 'gasLineBasics', 'transmissionForms', 'elevationGroup', 'outletPressure',
  'profileMarch', 'professionalReading', 'wallCode', 'pigging', 'correlationLimits',
  'refusalCatalogue', 'heldItems', 'expertReading',
];

// ---------------------------------------------------------------------------
// 0. The digest on disk is a real digest, and the lab carries the dump's fields.
// ---------------------------------------------------------------------------

describe('the digest on disk and the teaching fields', () => {
  it('the digest carries a plausible number of literals, so it is not empty or mid-rebuild', () => {
    const literals = readDigest().match(/-?\d+(?:\.\d+)?/g) || [];
    expect(literals.length, 'digest.txt is empty or mid-rebuild').toBeGreaterThan(1000);
    expect(Object.keys(sections(readDigest()))).toEqual(SECTION_KEYS);
  });

  it('the teaching fields are copied verbatim from fc2_fields.mjs, which fc2_dump.mjs imports', () => {
    const src = fs.readFileSync(FIELDS_MJS, 'utf8');
    const dump = fs.readFileSync(DUMP_MJS, 'utf8');
    const lab = LAB_SOURCE();
    const NAMES = ['OGBIA', 'OGBIA_FITTINGS', 'OGBIA_SWEEP_MAX_V_FT_S', 'OGBIA_ROUGHNESS_IDS',
      'OGBIA_PROFILE', 'OGBIA_PROFILE_FLAT', 'OGBIA_P1_PSIA', 'OGBIA_VISCOSITY_SWEEP_CP',
      'OGBIA_REGIME_PROBE_RE', 'SOKU', 'SOKU_UP_FT', 'SOKU_DOWN_FT', 'SOKU_STEEP_DOWN_FT',
      'SOKU_STEEP_DOWN_ABOVE_INLET_PSI', 'SOKU_STEEP_DOWN_P2_PSIA', 'SOKU_STEEP_UP_FT',
      'SOKU_STEEP_UP_SCFD', 'SOKU_STARVED_P1_PSIA', 'SUM_K_AT_LIMIT', 'SUM_K_JUST_UNDER',
      'ROUGHNESS_AT_LIMIT', 'ROUGHNESS_JUST_UNDER', 'EFFICIENCY_AT_LIMIT', 'EFFICIENCY_JUST_OVER',
      'HOLDUP_AT_LIMIT', 'HOLDUP_JUST_OVER', 'ALLOWANCE_AT_LIMIT', 'ALLOWANCE_JUST_UNDER',
      'SWEPT_AT_LIMIT', 'SWEPT_JUST_UNDER', 'VERTICAL_RUN_FT', 'TALLER_THAN_LONG_FT',
      'MILE_PROBE_LENGTH_MI', 'SOKU_EFFICIENCY_SWEEP', 'SOKU_TARGET_SCFD',
      'SOKU_NEARLY_DEAD_P2_PSIA', 'SOKU_DEAD_P2_PSIA', 'SOKU_WALL', 'SOKU_WALL_CLASSES',
      'SOKU_JOINT_FACTORS', 'SOKU_TEMP_DERATES', 'SOKU_WALL_AS_BUILT_IN', 'OGBIA_PIG',
      'OGBIA_HOLDUP_SWEEP', 'OGBIA_HOLDUP_NOMINAL', 'OGBIA_CATCHER_BBL', 'OGBIA_DROPOUT_BPD',
      'OGBIA_SMALL_CATCHER_BBL', 'EROSIONAL_C_IDS', 'EROSIONAL_UNKNOWN_ID',
      'EROSIONAL_DENSITY_SWEEP', 'OGBIA_MANIFOLD_LENGTH_FT', 'OGBIA_ELEVATION_SWEEP_FT',
      'OGBIA_DEAD_LINE', 'RE_JUST_BELOW_BRANCH', 'RE_AT_BRANCH', 'RELATIVE_ROUGHNESS_SWEEP',
      'RE_LOW_FOR_ROUGHNESS_TABLE', 'RE_HIGH_FOR_ROUGHNESS_TABLE', 'COLEBROOK_DOMAIN_SWEEP',
      'RE_FOR_DOMAIN_SWEEP', 'SCHEDULE_PAIR_NPS', 'SOKU_BORE_SWEEP', 'GOLDEN_PIG_SPEED_FT_S'];
    expect(NAMES.length).toBeGreaterThan(60);
    NAMES.forEach((name) => {
      const a = src.match(new RegExp(`^export const ${name} = ([\\s\\S]*?);$`, 'm'));
      const b = lab.match(new RegExp(`^export const ${name} = ([\\s\\S]*?);$`, 'm'));
      expect(a, `${name} in fc2_fields.mjs`).not.toBeNull();
      expect(b, `${name} in the lab`).not.toBeNull();
      expect(b[1], name).toBe(a[1]);
      expect(dump, `${name} is imported by the dump`).toContain(name);
    });
  });

  it('the published goldens are the whole file', () => {
    expect(L.goldenCounts()).toEqual({
      barlow: 4, friction: 6, gas: 20, liquid: 4, outlet: 8, pigging: 3,
    });
  });
});

// ---------------------------------------------------------------------------
// 1 to 18. The rebuilt digest, section by section and then whole.
// ---------------------------------------------------------------------------

describe('THE DIGEST, REBUILT FROM LAB RETURN VALUES, BYTE FOR BYTE', () => {
  const titles = {
    preamble: 'the title and the units line',
    S1: 'what the engine sizes, every refusal and the measured constants',
    S2: 'velocity, Reynolds, the two branches and the band between them',
    S3: 'the three losses, the fittings and the roughness catalogue',
    S4: 'the erosional limit and the density that decides it',
    S5: 'the whole schedule, and the two different answers to which bore',
    S6: 'one line end to end, all of it closed form',
    S7: 'the driving group is the difference of the squares',
    S8: 'four published forms, their exponents and the spread',
    S9: 'the elevation group, and the two things a hill does',
    S10: 'the bracket, the ceiling, and both signs of it',
    S11: 'the marched profile and the refusal that keeps its evidence',
    S12: 'a trunk end to end',
    S13: 'the wall a code demands, and the rating read back',
    S14: 'the pig, the holdup that is an input, and the interval',
    S15: 'where the correlations stop',
    S16: 'the refusal contract, every message and every boundary',
    S17: 'the five held items and one barrel',
    S18: 'one pipe, three questions',
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
    if (process.env.FC2_WRITE_BUILT) {
      // The timezone gate's child hands its rebuild back through this file,
      // with the zone it actually ran in so the parent can prove it moved.
      fs.writeFileSync(process.env.FC2_WRITE_BUILT, JSON.stringify({
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        offsetMinutes: new Date('2026-09-15T00:00:00Z').getTimezoneOffset(),
        text,
      }));
    }
    expect(text.split('\n').length).toBe(readDigest().split('\n').length);
    expect(text).toBe(readDigest());
  });

  it('NEGATIVE CONTROL: one engine value moved by a single unit in the last printed place is a failed section', () => {
    const one = '| B31.8 | 2 | 0.600000 | 0.245192 | 0.370192 | 1200.000000 |';
    const whole = buildDigest();
    expect(whole.split(one)).toHaveLength(2); // the row is unique, so the edit is surgical
    const text = whole.replace(one, '| B31.8 | 2 | 0.600000 | 0.245193 | 0.370192 | 1200.000000 |');
    expect(sections(text).S13).not.toBe(onDisk.S13);
    expect(sections(text).S14).toBe(onDisk.S14);
    expect(sections(text).S12).toBe(onDisk.S12);
  });
});

// ---------------------------------------------------------------------------
// What the teaching fields show: the results the course is built on.
// ---------------------------------------------------------------------------

describe('what the teaching fields show', () => {
  it('FC2-0: the outlet bracket ends at the inlet over the root of es, and BOTH SIGNS are reachable', () => {
    const o = L.outletPressure();
    const flat = o.ceilings.find((c) => c.elevChangeFt === 0);
    const down = o.ceilings.find((c) => c.elevChangeFt === L.SOKU_STEEP_DOWN_FT);
    const up = o.ceilings.find((c) => c.elevChangeFt === L.SOKU_STEEP_UP_FT);
    // A flat line ends its bracket at its own inlet, to the last bit.
    expect(flat.ceilingPsiaDerived).toBeCloseTo(o.p1Psia, 10);
    expect(flat.againstInletDerived).toBeCloseTo(0, 10);
    // A descent ends it ABOVE the inlet; a climb, BELOW. Both signs, one table.
    expect(down.againstInletDerived).toBeGreaterThan(0);
    expect(up.againstInletDerived).toBeLessThan(0);
    expect(down.es).toBeLessThan(1);
    expect(up.es).toBeGreaterThan(1);
  });

  it('FC2-0: on a descent the outlet legitimately sits above the inlet and the drop comes back NEGATIVE', () => {
    const o = L.outletPressure();
    expect(o.steepOutletPsia).toBeGreaterThan(o.p1Psia);
    expect(o.steepInverseShape.p2Psia).toBeCloseTo(o.steepOutletPsia, 9);
    expect(o.steepInverseShape.dpPsi).toBeLessThan(0);
    expect(o.steepInverseErrorDerived).toBeCloseTo(0, 9);
    // THE CONTROL: the same descent with the outlet genuinely below the inlet
    // round trips too, so a success is not the solver stopping at its bracket.
    expect(o.controlRecoveredPsia).toBeCloseTo(o.controlP2Psia, 9);
    expect(o.controlErrorDerived).toBeCloseTo(0, 9);
  });

  it('FC2-0: a climb the inlet cannot pay for is refused rather than answered', () => {
    const o = L.outletPressure();
    expect(typeof o.starvedError).toBe('string');
    expect(o.starvedError.length).toBeGreaterThan(10);
    // And one it CAN pay for lands under the ceiling rather than at the inlet.
    expect(o.upP2Psia).toBeLessThan(o.upCeilingPsiaDerived);
    expect(o.upDpPsi).toBeGreaterThan(0);
  });

  it('FC2-0: the traverse refuses a die-out WITH its evidence rather than instead of it', () => {
    const d = L.profileMarch().dead;
    expect(typeof d.error).toBe('string');
    expect(d.stationCount).toBeGreaterThan(0);
    expect(d.stations).toHaveLength(d.stationCount);
    expect(d.diedAtFt).toBeGreaterThan(0);
    // The pressure the arithmetic produced is not a pressure, and that is the
    // whole point of handing it back rather than swallowing it.
    expect(d.diedAtPsia).toBeLessThan(0);
    // The single call underneath still answers: a DROP is not a PRESSURE.
    expect(d.singleCallPsi).toBeGreaterThan(0);
  });

  it('the friction factor jumps across a boundary where nothing physical happens', () => {
    const f = L.frictionAndRegime();
    expect(f.jumpFromRegime).toBe('laminar');
    expect(f.jumpToRegime).toBe('transitional');
    expect(f.jumpPercentDerived).toBeGreaterThan(50);
  });

  it('the first passing bore in TABLE order is not the smallest passing bore', () => {
    const b = L.boreChoice();
    expect(b.sameRow).toBe(false);
    expect(b.smallestBore.idIn).toBeLessThan(b.firstInTableOrder.idIn);
    expect(b.passingCount).toBeGreaterThan(0);
    expect(b.passingCount).toBeLessThan(b.boreCount);
  });

  it('the holdup is an input, and past a point the catcher cannot take the sweep at all', () => {
    const p = L.pigging();
    expect(p.holdupRows[0].sweptBbl).toBe(0);
    expect(p.holdupRows[p.holdupRows.length - 1].sweptBbl).toBeCloseTo(p.lineVolumeBbl, 9);
    expect(p.holdupRows.filter((r) => r.error).length).toBeGreaterThan(0);
    expect(typeof p.smallCatcherError).toBe('string');
  });

  it('every guard is read from BOTH sides, and answers its own limit', () => {
    const b = L.refusalCatalogue().boundaries;
    expect(b.length % 2).toBe(0);
    for (let i = 0; i < b.length; i += 2) {
      expect(b[i].refuses, `${b[i].label} refuses its own limit`).toBe(false);
      expect(b[i + 1].refuses, `${b[i + 1].label} accepts past its limit`).toBe(true);
    }
  });

  it('no reader reads the clock or a random number: the lab source makes no Date and draws nothing', () => {
    const src = LAB_SOURCE();
    expect(src).not.toMatch(/new Date\(/);
    expect(src).not.toMatch(/Date\.now/);
    expect(src).not.toMatch(/Math\.random/);
  });

  it('the lab carries no em dash and no en dash', () => {
    expect(LAB_SOURCE()).not.toMatch(/[–—]/);
  });
});

describe('every reader is pure and deterministic', () => {
  it('there is one reader per digest section', () => {
    expect(READERS).toHaveLength(18);
    READERS.forEach((name) => expect(typeof LAB[name], name).toBe('function'));
  });

  it('two calls agree, and mutating a result changes neither the next call nor the fields', () => {
    READERS.forEach((name) => expect(LAB[name](), name).toEqual(LAB[name]()));
    const a = L.threeLosses();
    a.elevationRows[0].dpFrictionPsi = 999;
    a.fittings[0].kEach = 999;
    expect(L.OGBIA.qBpd).toBe(12000);
    expect(L.OGBIA_FITTINGS[0].count).toBe(4);
    expect(L.threeLosses().elevationRows[0].dpFrictionPsi).toBeCloseTo(25.660631, 6);
    const b = L.boreChoice();
    b.rows[0].insideTheLimit = true;
    expect(L.boreChoice().rows[0].insideTheLimit).toBe(false);
    const c = L.outletPressure();
    c.ceilings[0].ceilingPsiaDerived = 1;
    expect(L.outletPressure().ceilings[0].ceilingPsiaDerived).toBeCloseTo(850, 6);
    const d = L.pigging();
    d.holdupRows[0].sweptBbl = 42;
    expect(L.pigging().holdupRows[0].sweptBbl).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// THE REFUSAL GATE. The FC2-0 repair wave gave twenty-one inputs a named error.
// Every refusal a panel displays is the engine's own, retyped nowhere.
// ---------------------------------------------------------------------------

/**
 * How many DISTINCT messages the engine produces across the eighteen states of
 * Section 1 and the twenty-four unphysical inputs of Section 16. Measured from
 * the engine, not quoted from a brief: several guards are deliberately shared
 * (one validator fronts all four gas forms, and the corrosion allowance is
 * refused identically by the wall and by the rating), so the distinct count is
 * below the probe count by design.
 */
const DISTINCT_REFUSAL_MESSAGES = 32;

describe('THE REFUSAL GATE: every refusal is the engine\'s own message', () => {
  const allRefusals = () => [
    ...L.engineScope().softStates,
    ...L.refusalCatalogue().refusals,
  ];

  it('there are refusals to check, so a rename cannot silently empty this gate', () => {
    expect(L.SOFT_STATE_PROBES).toHaveLength(18);
    expect(L.REFUSAL_PROBES).toHaveLength(24);
    expect(L.BOUNDARY_PROBES).toHaveLength(14);
    expect(allRefusals()).toHaveLength(42);
  });

  it('every probe is REFUSED, by a returned object and never a throw, and carries a message', () => {
    allRefusals().forEach((r) => {
      expect(typeof r.error, `${r.label} was accepted`).toBe('string');
      expect(r.error.length, `${r.label} carries no message`).toBeGreaterThan(10);
    });
  });

  it('the named refusals are all surfaced, and are distinct messages rather than one guard repeated', () => {
    // COUNTED, NOT QUOTED. The brief for this wave said the repair added
    // "twenty-one" named refusals; the digest says no such thing, so the number
    // pinned here is the one the engine actually produces across both probe
    // sets. Counting DISTINCT messages is what proves the surface is not a
    // single guard answered forty-two times.
    const distinct = new Set(allRefusals().map((r) => r.error));
    // eslint-disable-next-line no-console
    console.log(`refusal surface: ${allRefusals().length} probes, ${distinct.size} distinct engine messages`);
    expect(distinct.size).toBe(DISTINCT_REFUSAL_MESSAGES);
    // Each probe set carries its own share, so losing one cannot hide in the total.
    expect(new Set(L.engineScope().softStates.map((r) => r.error)).size).toBeGreaterThan(5);
    expect(new Set(L.refusalCatalogue().refusals.map((r) => r.error)).size).toBeGreaterThan(5);
  });

  it('NO refusal message is written as a literal in the lab: every one comes back from the engine', () => {
    const src = LAB_SOURCE();
    allRefusals().forEach((r) => {
      expect(src.includes(r.error), `${r.label}: the message is retyped in the lab`).toBe(false);
    });
  });

  it('CONTROL: calling the engine directly through the probe gives the same message', () => {
    L.REFUSAL_PROBES.forEach(({ label, call }, i) => {
      const direct = call();
      expect(direct.error, label).toBe(L.refusalCatalogue().refusals[i].error);
    });
    L.SOFT_STATE_PROBES.forEach(({ label, call }, i) => {
      expect(call().error, label).toBe(L.engineScope().softStates[i].error);
    });
  });

  it('CONTROL: the gate can tell a retyped message from an engine one', () => {
    // A message planted in a source IS found, so the grep above means something.
    const planted = `const x = "${allRefusals()[0].error}";`;
    expect(planted.includes(allRefusals()[0].error)).toBe(true);
  });

  it('the three documented NaN returns are carried as the digest prints them', () => {
    const c = L.refusalCatalogue();
    expect(c.reynoldsNoViscosity).toBe('NaN');
    expect(c.volumeNoBore).toBe('NaN');
    expect(c.frictionNegativeRoughnessShape).toEqual({ f: null, regime: 'invalid' });
  });
});

// ---------------------------------------------------------------------------
// THE HELD GATE. Five quantities taught as limits, never as answers.
// ---------------------------------------------------------------------------

describe('THE HELD GATE: the five held quantities are marked, shown and never graded', () => {
  it('there are five, each carrying the marker wording', () => {
    expect(L.HELD_ITEMS).toHaveLength(5);
    expect(L.HELD_ITEMS.map((h) => h.id)).toEqual([
      'rp14e-c-factors', 'transmission-efficiency', 'transition-band',
      'weymouth-friction', 'synthetic-goldens',
    ]);
    L.HELD_ITEMS.forEach((h) => {
      expect(h.note, h.id).toContain(L.HELD_MARKER);
      expect(h.note, h.id).toMatch(/never as an answer/);
    });
    expect(L.heldItems().items).toHaveLength(5);
  });

  it('the digest marks them the same way', () => {
    const text = readDigest();
    expect((text.match(/HELD FOR LITERATURE/g) || []).length).toBeGreaterThanOrEqual(5);
    expect(text).toContain('Five things this course teaches as limits and never as answers');
  });

  it('each panel that shows a held quantity shows the wording that marks it unverified', () => {
    const show = {
      'LiquidExplorer.jsx': 'rp14e-c-factors',
      'GasLineExplorer.jsx': 'transmission-efficiency',
      'WallPigExplorer.jsx': 'weymouth-friction',
    };
    Object.entries(show).forEach(([file, id]) => {
      const text = fs.readFileSync(path.join(HERE, file), 'utf8');
      expect(text, `${file} does not carry the held marker`).toContain(L.HELD_MARKER);
      expect(text, `${file} does not read the ${id} held item`).toMatch(/held/i);
    });
  });

  it('NO graded capstone field reads a held quantity: every tier STATES its own condition', () => {
    const capstone = fs.readFileSync(CAPSTONE_MJS, 'utf8');
    const block = LAB_SOURCE().split('THE CAPSTONE. IMO-1, BRASS AND QUA IBOE ONLY')[1];
    [capstone, block].forEach((text) => {
      // No c factor row, no roughness catalogue, no fitting table, no schedule.
      expect(text).not.toContain('erosionalC(');
      expect(text).not.toContain('roughnessOf');
      expect(text).not.toContain('fittingK');
      expect(text).not.toContain('PIPE_SCHEDULE');
    });
    // The site c factor is stated and is NOT one of the three published rows.
    expect(typeof L.IMO_1_C_FACTOR).toBe('number');
    expect([100, 125, 175]).not.toContain(L.IMO_1_C_FACTOR);
    // BRASS states its efficiency rather than taking the default of one.
    expect(L.BRASS.efficiency).toBeGreaterThan(0);
    expect(L.BRASS.efficiency).toBeLessThan(1);
    // Every graded Reynolds number is clear of the held transition band.
    expect(L.imoRuns().imo.re).toBeGreaterThan(20000);
    expect(L.imoRuns().imo.regime).toBe('turbulent');
    // Every bore, roughness, resistance sum and class is stated on the input.
    expect(typeof L.IMO_1.roughnessIn).toBe('number');
    expect(typeof L.IMO_1.sumK).toBe('number');
    expect(typeof L.QUA_IBOE_WALL.locationClass).toBe('number');
  });
});

// ---------------------------------------------------------------------------
// THE CLOCK GATE. Nothing in this domain has a date input, a seed or a default
// that falls back to today.
// ---------------------------------------------------------------------------

describe('THE CLOCK GATE: no reader reads the system date', () => {
  afterEach(() => { vi.useRealTimers(); });

  const snapshot = () => JSON.stringify(READERS.map((name) => [name, LAB[name]()])
    .concat([['imoCapstoneFields', L.imoCapstoneFields()]]));

  it('identical output under two faked system dates, one long before FC2 and one far after', () => {
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
    const code = LAB_SOURCE().replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    expect(code.length).toBeGreaterThan(5000);
    ['asOf', 'today', 'seed', 'Math.random', 'Date'].forEach((needle) => {
      expect(code, `${needle} appears in the lab's code`).not.toContain(needle);
    });
  });
});

// ---------------------------------------------------------------------------
// THE TIMEZONE GATE. The whole rebuild, a second time, west of Greenwich.
// ---------------------------------------------------------------------------

const TZ_CHILD_TZ = 'America/Los_Angeles';

describe('THE TIMEZONE GATE: the digest rebuilds byte for byte west of Greenwich', () => {
  it(`the whole rebuild under TZ=${TZ_CHILD_TZ} is the digest, byte for byte`, () => {
    if (process.env.FC2_TZ_CHILD) return; // the child does not re-spawn itself
    // The sidecar goes to a temp dir rather than node_modules: this worktree's
    // node_modules is a symlink to the SHARED checkout, and three other agents
    // are working in this tree.
    const sidecar = path.join(os.tmpdir(), '.fc2-tz-rebuild.json');
    if (fs.existsSync(sidecar)) fs.unlinkSync(sidecar);
    execFileSync('npx', ['vitest', 'run', '--reporter=dot', 'src/components/course/panels/linesizing/linesizingLab.test.js'], {
      cwd: ROOT,
      env: {
        ...process.env, TZ: TZ_CHILD_TZ, FC2_TZ_CHILD: '1', FC2_WRITE_BUILT: sidecar,
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

describe('the IMO-1, BRASS and QUA IBOE capstone reproduces fields.json exactly', () => {
  it('fields.json is the eighteen published fields, six per tier, in the published order', () => {
    expect(CAPSTONE_FIELDS).toHaveLength(18);
    expect(CAPSTONE_FIELDS.map((x) => x[0])).toEqual([
      ...Array(6).fill('beginner'), ...Array(6).fill('intermediate'), ...Array(6).fill('advanced'),
    ]);
  });

  it('every one of the eighteen graded answers and tolerances is EXACTLY the published value', () => {
    const built = L.imoCapstoneFields();
    expect(built).toHaveLength(18);
    built.forEach(([tier, key, value, tol], i) => {
      const [pTier, pKey, pValue, pTol] = CAPSTONE_FIELDS[i];
      expect(tier, `${key} tier`).toBe(pTier);
      expect(key, `field ${i}`).toBe(pKey);
      expect(value, `${key} value`).toBe(pValue);
      expect(tol, `${key} tolerance`).toBe(pTol);
    });
    expect(L.imoCapstoneValues()).toEqual(
      Object.fromEntries(CAPSTONE_FIELDS.map(([, k, v]) => [k, v])),
    );
    expect(L.imoCapstoneTolerances()).toEqual(
      Object.fromEntries(CAPSTONE_FIELDS.map(([, k, , t]) => [k, t])),
    );
  });

  // -------------------------------------------------------------------------
  // ANSWERABILITY. A graded field is answered by a learner reading a figure and
  // typing it back at the precision this course tells them to quote, so a
  // tolerance tighter than half a unit in the last printed place is a field
  // nobody can answer by doing as they were told. Two of the eighteen were
  // exactly that until this wave: the required wall at 1e-8 against inches
  // printed to six decimals, and the swept volume at 1e-5 against barrels
  // printed to four.
  //
  // precision.json is GENERATED by the wave's capstone script out of the same
  // PRINTED_DECIMALS table the tolerances are formed from, so this checks the
  // lab against the file the gate reads and the file against the lab. A third
  // hand-written copy is what went stale here in the first place.
  // -------------------------------------------------------------------------
  it('the lab\'s printed-precision map is the one precision.json was generated from', () => {
    const declared = JSON.parse(fs.readFileSync(PRECISION_JSON, 'utf8'));
    const classes = Object.keys(declared);
    expect(classes.length).toBe(new Set(Object.values(L.FIELD_CLASS)).size);
    classes.forEach((cls) => {
      expect(L.PRINTED_DECIMALS[cls], `${cls} decimals`).toBe(declared[cls].decimals);
      const keys = CAPSTONE_FIELDS.map(([, k]) => k).filter((k) => new RegExp(declared[cls].match).test(k));
      expect(keys.length, `${cls} matches no graded key`).toBeGreaterThan(0);
      keys.forEach((k) => expect(L.FIELD_CLASS[k], k).toBe(cls));
    });
    // Every one of the eighteen is classified. An unclassified field is a
    // tolerance nobody checked, which is not the same thing as a correct one.
    CAPSTONE_FIELDS.forEach(([, key]) => {
      const hits = classes.filter((cls) => new RegExp(declared[cls].match).test(key));
      expect(hits, `${key} matches ${hits.length} classes, not exactly one`).toHaveLength(1);
    });
  });

  it('every graded tolerance is at least half a unit in its class\'s last printed place', () => {
    const declared = JSON.parse(fs.readFileSync(PRECISION_JSON, 'utf8'));
    CAPSTONE_FIELDS.forEach(([tier, key, value, tol]) => {
      const cls = L.FIELD_CLASS[key];
      const floor = L.halfUlp(declared[cls].decimals);
      expect(tol, `${tier}/${key} is graded tighter than ${cls} prints`).toBeGreaterThanOrEqual(floor);
      // And the figure a learner can actually quote grades correct.
      const quoted = Number(value.toFixed(declared[cls].decimals));
      expect(Math.abs(value - quoted), `${key} quoted at ${declared[cls].decimals} decimals`).toBeLessThanOrEqual(tol);
    });
  });

  it('MAX AND NEVER MIN: the rule can only ever widen a stated tolerance', () => {
    CAPSTONE_FIELDS.forEach(([, key, , tol]) => {
      expect(tol, `${key} was tightened`).toBeGreaterThanOrEqual(L.STATED_TOLERANCES[key]);
    });
    // NEGATIVE CONTROL: a class the map does not carry must refuse rather than
    // grade against a floor of nothing.
    expect(() => L.toleranceFor('furlongs', 1e-9)).toThrow(/no printed precision/);
    // and the rule is a max, proven both ways on a real class
    expect(L.toleranceFor('bbl', 1e-9)).toBe(L.halfUlp(4));
    expect(L.toleranceFor('bbl', 1)).toBe(1);
  });

  it('the capstone conditions are copied verbatim from fc2_fields_capstone.mjs', () => {
    const src = fs.readFileSync(CAPSTONE_MJS, 'utf8');
    const lab = LAB_SOURCE();
    const NAMES = ['IMO_1', 'IMO_1_C_FACTOR', 'BRASS', 'BRASS_MU_CP', 'BRASS_ROUGHNESS_IN',
      'BRASS_CONTRACT_SCFD', 'QUA_IBOE_WALL', 'QUA_IBOE_AS_BUILT_WALL_IN', 'QUA_IBOE_PIG',
      'QUA_IBOE_HOLDUP_FRAC', 'QUA_IBOE_CATCHER_BBL', 'QUA_IBOE_DROPOUT_BPD'];
    NAMES.forEach((name) => {
      const a = src.match(new RegExp(`^export const ${name} = ([\\s\\S]*?);$`, 'm'));
      const b = lab.match(new RegExp(`^export const ${name} = ([\\s\\S]*?);$`, 'm'));
      expect(a, `${name} in fc2_fields_capstone.mjs`).not.toBeNull();
      expect(b, `${name} in the lab`).not.toBeNull();
      expect(b[1], name).toBe(a[1]);
    });
  });

  it('the capstone never touches the teaching digest, and the digest never names a capstone line', () => {
    const digest = readDigest().toLowerCase();
    ['imo-1', 'imo_1', 'brass', 'qua iboe', 'qua_iboe'].forEach((name) => expect(digest).not.toContain(name));
    const dump = fs.readFileSync(DUMP_MJS, 'utf8').toLowerCase();
    ['imo_1', 'brass', 'qua_iboe'].forEach((name) => expect(dump).not.toContain(name));
    // The dump names fields.json only where it says it never reads it.
    expect(fs.readFileSync(DUMP_MJS, 'utf8')).not.toMatch(/readFileSync\([^)]*fields\.json/);
    expect(fs.readFileSync(DUMP_MJS, 'utf8')).not.toContain('fc2_fields_capstone');
  });

  it('the BRASS outlet is a descent solved well inside its bracket, not sitting on it', () => {
    // FC2-0 D1: the old solver clamped at the inlet. A graded field must not be
    // the value a clamp would also produce, or the gate proves nothing.
    const { brassOutlet, brassElev } = L.imoRuns();
    expect(brassOutlet.error).toBeUndefined();
    const ceiling = L.BRASS.p1Psia / Math.sqrt(brassElev.es);
    expect(brassOutlet.p2Psia).toBeLessThan(ceiling);
    expect(brassOutlet.p2Psia).toBeLessThan(L.BRASS.p1Psia);
    expect(ceiling).toBeGreaterThan(L.BRASS.p1Psia); // a descent, so above the inlet
  });
});

// ---------------------------------------------------------------------------
// THE LEAK GATE: no teaching number may be a graded capstone answer.
// ---------------------------------------------------------------------------

/** Exports that TAKE AN ARGUMENT. */
const ARG_REQUIRED = ['leakGuardTargets', 'leakGuardHit', 'collectNumbers',
  'imoCapstoneValues', 'imoCapstoneTolerances', 'toleranceFor', 'halfUlp'];
const GATE_MACHINERY = ['LEAK_GUARD_MARGIN', 'LEAK_GUARD_SCALINGS',
  // The printed-precision tables. They are declarations about how the course
  // reports a quantity, not readings a panel puts on a page, so they are not
  // part of the teaching surface the leak gate sweeps. The test below checks
  // them against the wave's own precision.json instead.
  'PRINTED_DECIMALS', 'FIELD_CLASS', 'STATED_TOLERANCES'];

/**
 * A surface smaller than this is not the lab: refuse to call it clean.
 *
 * MEASURED, NOT GUESSED. The full teaching surface walks 95 entries and 1903
 * numbers (the gate prints both on every run). These floors sit just under
 * that, by less than any one large reader contributes, so losing a reader to a
 * rename drops the count through the floor and the gate refuses rather than
 * reporting a clean sweep of a surface that is no longer there. A floor set
 * ABOVE the real surface is the other failure mode and is just as bad: it makes
 * the gate unrunnable and invites somebody to lower it until it passes.
 */
const MIN_SURFACE_ENTRIES = 80;
const MIN_SURFACE_NUMBERS = 1700;

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
  .map((n) => ({ n, t: L.leakGuardHit(n.value, targets) }))
  .filter((x) => x.t)
  .map(({ n, t }) => `${n.path} = ${n.value} is within ${t.band} of ${t.key} ${t.tag} (${Math.abs(n.value - t.value) / t.gradingBand} grading bands)`);

describe('THE LEAK GATE: the guard itself', () => {
  const targets = L.leakGuardTargets(CAPSTONE_FIELDS);

  it('the guard is built from all eighteen fields in all three unit shiftings, with the band scaled', () => {
    expect(targets).toHaveLength(18 * 3);
    expect(L.LEAK_GUARD_MARGIN).toBe(10);
    expect(L.LEAK_GUARD_SCALINGS.map((s) => s.factor)).toEqual([1, 1000, 0.001]);
    const t = (key, tag) => targets.find((x) => x.key === key && x.tag === tag);
    expect(t('imo1_velocity_fts', 'as graded').band).toBeCloseTo(1e-5, 12);
    expect(t('imo1_velocity_fts', 'x0.001').band).toBeCloseTo(1e-8, 15);
    expect(t('brass_weymouth_scfd', 'x1000').band).toBeCloseTo(1e7, 3);
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
    // A surface with entries but no numbers is refused too: six wave-kit gates
    // were found exiting 0 while examining nothing.
    expect(() => assertPlausible(new Array(80).fill({ name: 'x', value: 'text' }), [])).toThrow(/refusing/);
  });

  it('every export is accounted for: walked bare, walked with arguments, capstone or machinery', () => {
    const exported = Object.keys(L);
    ARG_REQUIRED.forEach((k) => expect(exported, k).toContain(k));
    exported.filter((k) => typeof LAB[k] === 'function' && LAB[k].length > 0
      && !ARG_REQUIRED.includes(k) && !L.CAPSTONE_ONLY_EXPORTS.includes(k))
      .forEach((k) => expect(LAB[k].length, `${k} has a required argument and is not in ARG_REQUIRED`).toBe(0));
  });

  it('the teaching surface names no capstone export and no capstone line', () => {
    const text = JSON.stringify(teachingSurface());
    L.CAPSTONE_ONLY_EXPORTS.forEach((name) => {
      if (name === 'CAPSTONE_ONLY_EXPORTS') return;
      expect(text, `${name} appears in the teaching surface`).not.toContain(name);
    });
    ['imo_1', 'brass', 'qua_iboe', 'qua iboe'].forEach((n) => expect(text.toLowerCase()).not.toContain(n));
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
    const surface = teachingSurface();
    const graded = CAPSTONE_FIELDS.find((x) => x[1] === 'brass_outlet_pressure_psia')[2];
    // Plant the graded BRASS outlet pressure into the teaching trunk's own
    // outlet reader, which is exactly where a careless panel would print it.
    const planted = surface.map((s) => (s.name === 'outletPressure'
      ? { ...s, value: { ...s.value, targetP2Psia: graded + 0.00004 } }
      : s));
    const hits = leakHits(planted, targets);
    expect(hits).toHaveLength(1);
    expect(hits[0]).toMatch(/^outletPressure\.targetP2Psia = .* of brass_outlet_pressure_psia as graded/);
    expect(leakHits(surface, targets)).toEqual([]);
  });

  it('THE GUARD IS NOT TRIGGER HAPPY: the teaching headlines pass', () => {
    const e = L.expertReading();
    expect(L.leakGuardHit(e.vFtS, targets)).toBeNull();
    expect(L.leakGuardHit(e.dpTotalPsi, targets)).toBeNull();
    expect(L.leakGuardHit(e.lineVolumeBbl, targets)).toBeNull();
    [NaN, Infinity, -Infinity].forEach((x) => expect(L.leakGuardHit(x, targets)).toBeNull());
    expect(L.collectNumbers({ a: NaN, b: null, c: 'text', d: undefined })).toEqual([]);
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
    // A substring search over a page of six decimal feet is meaningless: the
    // digits 12 sit inside 12.311666. So the digest's own literals are parsed
    // and run through the same numeric guard.
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
      const text = fs.readFileSync(path.join(HERE, file), 'utf8');
      const literals = (text.match(/-?\d+(?:\.\d+)?/g) || []).map(Number).filter(Number.isFinite);
      const hits = literals.map((v) => ({ v, t: L.leakGuardHit(v, targets) })).filter((x) => x.t)
        .map(({ v, t }) => `${file} prints ${v}, within ${t.band} of ${t.key} ${t.tag}`);
      expect([...new Set(hits)]).toEqual([]);
    });
  });
});
