// Every value the FC1 lab exposes to a panel, a lesson or the grader is pinned
// here against the teaching digest (tools/course-waves/separation/digest.txt), which
// is itself nothing but the Separator & Slug Catcher Designer's and the
// Facility Layout Mapper's return values on the published goldens and on the
// teaching fields ABANA, AGBAMI and the ERHA flow station.
//
// THE DIGEST IS REBUILT BYTE FOR BYTE. buildDigest() below is fc1_dump.mjs's
// writer with every engine call replaced by a lab return value: the prose is
// the dump's, the formatting is the dump's (vessel work to six decimals;
// metres, kilowatts and seconds to four; counts whole), and every number comes
// out of separationLab.js. The rebuilt text is compared with digest.txt section
// by section and then whole.
//
// THE EIGHTEEN GRADED FIELDS of the EJULEBE, ODEAMA and ADANGA capstone are
// pinned separately and EXACTLY against tools/course-waves/separation/fields.json,
// READ FROM THE FILE.
//
// Then the gates:
//   THE LEAK GATE      no teaching export may return a number within ten times
//                      a graded field's ABSOLUTE tolerance of a graded answer,
//                      in any of three unit shiftings, over every number the
//                      lab exports, refusing a tiny surface.
//   THE CLOCK GATE     every reader returns identical output under two faked
//                      system dates, with a control proving the clock moved.
//                      Nothing in this domain has a date input or a default
//                      that falls back to today, which makes the gate cheap
//                      and worth having anyway.
//   THE TZ GATE        the whole rebuild runs a second time in a child process
//                      under TZ=America/Los_Angeles and must be byte-identical.
//   THE REFUSAL GATE   every refusal the panels display carries the engine's
//                      own class name, its own named input and its own message,
//                      and no message is written as a literal in the lab.
//   THE HELD GATE      the four HELD quantities carry the wording that marks
//                      them unverified, the three panels show it, and no graded
//                      capstone field reads one.
import {
  describe, it, expect, afterEach, vi,
} from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import * as LAB_NS from './separationLab.js';
import { waveInput } from '../../../../../tools/course-waves/waveInputs.mjs';

const L = LAB_NS;
const LAB = Object.fromEntries(Object.entries(L));

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
// THE WAVE INPUTS. Read from the committed copy under tools/course-waves by
// default, which is what lets this suite run anywhere, CI included. Point it
// at a live wave directory mid-build with NEXTGEN_WAVE_DIR. A missing input
// throws and names itself rather than skipping: see tools/course-waves/waveInputs.mjs.
const WAVE_NAME = 'separation';
const DIGEST = waveInput(WAVE_NAME, 'digest.txt');
const FIELDS_JSON = waveInput(WAVE_NAME, 'fields.json');
const DUMP_MJS = waveInput(WAVE_NAME, 'fc1_dump.mjs');
const FIELDS_MJS = waveInput(WAVE_NAME, 'fc1_fields.mjs');
const CAPSTONE_MJS = waveInput(WAVE_NAME, 'fc1_fields_capstone.mjs');
const LAB_SOURCE = () => fs.readFileSync(path.join(HERE, 'separationLab.js'), 'utf8');
const PANEL_FILES = ['SeparatorExplorer.jsx', 'SlugExplorer.jsx', 'LayoutExplorer.jsx'];

// ---------------------------------------------------------------------------
// The digest's formatting, verbatim from fc1_dump.mjs.
// ---------------------------------------------------------------------------

const num = (x, n) => (x === null || x === undefined || Number.isNaN(Number(x)) ? 'null' : Number(x).toFixed(n));
const e6 = (x) => num(x, 6);   // engineering: ft, ft2, ft/s, lb/ft3, ratios
const m4 = (x) => num(x, 4);   // metres, kW, seconds
const J = (x) => JSON.stringify(x);

/** A refusal row as the dump prints one, from the lab's captured engine result. */
const refusal = (r) => {
  if (!r.ok) return `${r.errorName} on ${r.input}: "${r.message}"`;
  return r.softError ? `returned { error: "${r.softError}" }` : 'accepted';
};
const soft = (err) => (err ? `{ error: "${err}" }` : 'no error');

// ---------------------------------------------------------------------------
// THE REBUILD. One block per digest section, in the dump's order.
// ---------------------------------------------------------------------------

const buildDigest = () => {
  const out = [];
  const w = (s = '') => out.push(s);

  const sweepRows = (res) => {
    w('| diameter ft | length ft | L/D | in band | feasible | reasons |');
    w('| --- | --- | --- | --- | --- | --- |');
    res.rows.forEach((r) => w(`| ${e6(r.diameterFt)} | ${e6(r.lengthFt)} | ${e6(r.ldRatio)} | ${r.inRange} | ${r.feasible} | ${r.reasons.join(', ') || 'none'} |`));
    w(`preferred ${res.preferred ? `${e6(res.preferred.diameterFt)} ft` : 'null'}, preferredStatus ${res.preferredStatus}, band ${e6(res.ldMin)} to ${e6(res.ldMax)}.`);
  };

  w('# FC1 Separation & Slug Catching. Teaching digest.');
  w('# Vessel work prints to six decimals: every ft, ft2, lb per ft3 and ft per s figure, so each density, velocity, diameter, height, length, margin, fraction and actual gas rate carries six. Site work prints to four decimals: every metre, kilowatt and second, so each setback, shortfall and drop crossing time carries four. Counts are whole numbers.');
  w('# Field units: MMscfd, bpd, psig and psia, degF, ft, minutes. Site work is in metres.');
  w('# Nothing here is read from a clock or a random number, so every line reproduces.');
  w();

  // Section 1
  const s1 = L.engineScope();
  w('# SECTION 1: What the sizing engine does, and what it refuses (owned by Associate m01)');
  w();
  w('# App surface: the Separator & Slug Catcher Designer runs this chain live. Conditions give z and the densities, the mist extractor gives K, K and the densities give the settling velocity, and the vessel follows from the settling velocity and the retention time.');
  w('- This engine sizes a VESSEL. It says how big the drum must be for the stream to separate in it. What LEAVES each stage of a separation train at a given pressure and temperature is a flash calculation and lives in engines/fluid/separator.js.');
  w('- A named input that is missing, not a number, or outside its domain throws a SeparatorInputError whose `input` property names the input. No default, clamp or fallback stands in for it.');
  w('- A state the inputs are valid for but the method is not (a z factor outside the DAK range, a settling velocity that is not positive, an area outside the circle) comes back as an object with an `error` string, not a throw.');
  w('- The retired Suite app it replaced hardcoded z at 0.85, used one K at every pressure, sized only two-phase vessels, and took its gas velocity from the diameter of the PREVIOUS render.');
  w();
  w('Refusals, engine messages verbatim:');
  s1.refusals.forEach((r) => w(`- ${r.label}: ${refusal(r)}`));
  w();
  w('States the method has no answer for, returned rather than thrown:');
  s1.softStates.forEach((r) => w(`- ${r.label}: ${soft(r.error)}`));
  w();

  // Section 2
  const s2 = L.gasAtConditions();
  w('# SECTION 2: The gas at separator conditions (owned by Associate m02)');
  w();
  w('The three teaching streams, as the studio reads them:');
  w('| stream | gas MMscfd | gauge psig | absolute psia | degF | gas gravity |');
  w('| --- | --- | --- | --- | --- | --- |');
  s2.streams.forEach((s) => w(`| ${s.longLabel} | ${e6(s.qGasMMscfd)} | ${e6(s.pPsig)} | ${e6(s.pPsiaDerived)} | ${e6(s.tF)} | ${e6(s.gasSg)} |`));
  w('The absolute pressure is the gauge pressure plus 14.7 (derived, stated on the row).');
  w();
  w('Sutton pseudo-criticals and the DAK reduced pair:');
  w('| stream | Tpc degR | Ppc psia | Ppr | Tpr | z | gas density lb/ft3 | actual gas ft3/s |');
  w('| --- | --- | --- | --- | --- | --- | --- | --- |');
  s2.streams.forEach((s) => w(`| ${s.label} | ${e6(s.tpcR)} | ${e6(s.ppcPsia)} | ${e6(s.ppr)} | ${e6(s.tpr)} | ${e6(s.z)} | ${e6(s.rhoGas)} | ${e6(s.qGasActFt3S)} |`));
  w(`ABANA-1 and ABANA-2 share a stream, so they share Ppr, Tpr, z and gas density; only the gas RATE differs, ${e6(s2.abana1GasMMscfd)} against ${e6(s2.abana2GasMMscfd)} MMscfd.`);
  w(`Rankine at ABANA conditions: ${e6(s2.rankineAtAbana)} degR (engine).`);
  w();
  w('# App surface: the actual rate is the standard rate scaled by 14.7 over the absolute pressure, by the absolute temperature over 520 degR, and by z. That is the volume the vessel has to pass every second.');
  w(`ABANA-2 carries ${e6(s2.abana2GasMMscfd)} MMscfd at standard conditions, which is ${e6(s2.abana2StandardFt3SDerived)} standard ft3/s (derived: rate times a million over 86400), and ${e6(s2.abana2ActualFt3S)} ft3/s at ${e6(s2.abana2PPsia)} psia and ${e6(s2.abana2TF)} degF (engine).`);
  w();
  w('Standard against actual, for all three streams:');
  w('| stream | gas MMscfd | standard ft3/s | absolute psia | degF | degR | z | actual ft3/s | shrinkage |');
  w('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  s2.streams.forEach((s) => w(`| ${s.label} | ${e6(s.qGasMMscfd)} | ${e6(s.standardFt3SDerived)} | ${e6(s.pPsiaDerived)} | ${e6(s.tF)} | ${e6(s.rankineR)} | ${e6(s.z)} | ${e6(s.qGasActFt3S)} | ${e6(s.shrinkageDerived)} |`));
  w('The standard rate is the rate times a million over 86400 (derived on each row). The shrinkage is the standard rate over the actual rate (derived from the two columns on each row), and it is what the pressure, the temperature and z do to a volume between the sales meter and the vessel.');
  w();
  w('The DAK validity range this module enforces: Tpr from 1.0 to 3.0, Ppr up to 30. Below Ppr 0.2 the fit data stop and the answer is accepted with a note, because the surface runs to the ideal gas limit there and that is where an ordinary low-pressure separator sits.');
  w('Published gasDensity cases:');
  s2.published.forEach((c) => {
    const line = c.error
      ? `refused: "${c.error}"`
      : `Ppr ${e6(c.ppr)}, Tpr ${e6(c.tpr)}, z ${e6(c.z)}, density ${e6(c.rhoLbFt3)} lb/ft3${c.note ? `, note "${c.note}"` : ''}`;
    w(`- ${c.name} (${e6(c.input.pPsia)} psia, ${e6(c.input.tF)} degF, gravity ${e6(c.input.gasSg)}): ${line}`);
  });
  w(`The golden expectations carry a status word for each: ${s2.published.map((c) => `${c.name} ${c.goldenStatus}`).join('; ')} (golden).`);
  w();

  // Section 3
  const s3 = L.kValueTable();
  w('# SECTION 3: The K value (owned by Associate m03)');
  w();
  w('The published base table, six rows, all overridable:');
  w('| id | label | orientation | base K ft/s |');
  w('| --- | --- | --- | --- |');
  s3.base.forEach((k) => w(`| ${k.id} | ${k.label} | ${k.orientation} | ${e6(k.k)} |`));
  w(`The derating floor is ${e6(s3.floor)} (engine constant K_FLOOR).`);
  w();
  w('K at pressure, for the teaching streams and around them:');
  w('| mist extractor | psig | base K | derated K | K used | derated | floored | nearFloor |');
  w('| --- | --- | --- | --- | --- | --- | --- | --- |');
  s3.atPressure.forEach((k) => w(`| ${k.internalsId} | ${e6(k.pPsig)} | ${e6(k.kBase)} | ${e6(k.kDerated)} | ${e6(k.k)} | ${k.derated} | ${k.floored} | ${k.nearFloor} |`));
  w(`The floored warning, verbatim: "${s3.flooredWarning}"`);
  w(`An override wins outright and says so: ${J(s3.override)}`);
  w();
  w('Published kValue cases:');
  s3.published.forEach((c) => w(`- ${c.name}: K ${e6(c.k)}, the rule gives ${e6(c.kDerated)}, derated ${c.derated}, floored ${c.floored}, nearFloor ${c.nearFloor}.`));
  w();
  w(`How close a derated K can sit to the floor, and the flag that says so: ${s3.nearFloor.name} returns K ${e6(s3.nearFloor.k)} with derated ${s3.nearFloor.derated}, floored ${s3.nearFloor.floored} and nearFloor ${s3.nearFloor.nearFloor}, which is ${e6(s3.nearFloor.gapAboveFloorDerived)} above the floor of ${e6(s3.nearFloor.floor)} (derived: the two figures on this row). The rule takes 0.01 off K every 100 psi, so 50 psig more of operating pressure puts that vessel on the floor. nearFloor is true when one more 100 psi step of that same rule would floor the value, so it marks the approach to the cliff that floored marks the edge of, and the two are never true together.`);
  w();
  w('# HELD FOR LITERATURE, taught as a limit and never graded: the derating of 0.01 per 100 psi above 100 psig, and the 0.12 floor, are the customary rule of thumb as this module records it. The published form has not been checked against the source, so a vendor K is the only honest input where the derating bites.');
  w();

  // Section 4
  const s4 = L.settling();
  w('# SECTION 4: Settling (owned by Associate m04)');
  w();
  w('Liquid densities, and the mixture the gas load sees:');
  w('| stream | oil API | oil lb/ft3 | water SG | water lb/ft3 | oil bpd | water bpd | mixture lb/ft3 |');
  w('| --- | --- | --- | --- | --- | --- | --- | --- |');
  s4.densities.forEach((d) => w(`| ${d.label} | ${e6(d.oilApi)} | ${e6(d.rhoOil)} | ${e6(d.waterSg)} | ${e6(d.rhoWater)} | ${e6(d.qOilBpd)} | ${e6(d.qWaterBpd)} | ${e6(d.rhoLiquid)} |`));
  w('The mixture is the two densities weighted by their volume rates (derived from the columns on each row). It is not their average: on AGBAMI the average would be '
    + `${e6(s4.agbamiAverageDerived)} lb/ft3 against the weighted ${e6(s4.agbamiWeighted)}.`);
  w();
  w('Souders-Brown settling at the K each stream carries:');
  w('| stream | K | liquid lb/ft3 | gas lb/ft3 | terminal velocity ft/s |');
  w('| --- | --- | --- | --- | --- |');
  s4.soudersBrown.forEach((r) => w(`| ${r.label} | ${e6(r.k)} | ${e6(r.rhoLiquid)} | ${e6(r.rhoGas)} | ${e6(r.vT)} |`));
  w('Published soudersBrown cases:');
  s4.published.forEach((c) => w(`- ${c.name} (K ${e6(c.input.k)}, liquid ${e6(c.input.rhoLLbFt3)}, gas ${e6(c.input.rhoGLbFt3)}): ${e6(c.vFtS)} ft/s.`));
  w();

  // Section 5
  const s5 = L.verticalVessel();
  w('# SECTION 5: The vertical vessel (owned by Associate m05)');
  w();
  w(`ABANA-1 sized by its gas load: the gas needs an area of ${e6(s5.gasAreaDerived)} ft2 (derived: actual gas rate over the terminal velocity), which is a diameter of ${e6(s5.diameterGasFt)} ft (engine).`);
  w(`At that diameter the liquid stands ${e6(s5.hLiquidFt)} ft deep, the vessel is ${e6(s5.heightFt)} ft tall with the ${e6(s5.allowanceFt)} ft allowance, the slenderness is ${e6(s5.ldRatio)}, and the velocity margin is exactly ${e6(s5.velocityMargin)} because the diameter was chosen to make it so.`);
  w(`The retention volume is ${e6(s5.liquidVolFt3)} ft3: ${e6(s5.qLiquidBpd)} bpd of liquid held ${e6(s5.retentionMin)} minutes.`);
  w();
  w('The same stream in the diameters a vendor actually offers:');
  w('| diameter ft | liquid ft | height ft | L/D | gas velocity ft/s | margin | carries the gas |');
  w('| --- | --- | --- | --- | --- | --- | --- |');
  s5.rows.forEach((r) => w(`| ${e6(r.diameterFt)} | ${e6(r.hLiquidFt)} | ${e6(r.heightFt)} | ${e6(r.ldRatio)} | ${e6(r.gasVelocityFtS)} | ${e6(r.velocityMargin)} | ${r.gasCapacityOk} |`));
  w('The height falls and the margin rises with diameter, because the same liquid volume spreads over a larger floor and the same gas crosses a larger area.');
  w();
  w('Published vertical cases:');
  s5.published.forEach((c) => w(`- ${c.name} (${e6(c.input.qGasActFt3S)} ft3/s, ${e6(c.input.qLiquidBpd)} bpd, ${e6(c.input.retentionMin)} min, allowance ${e6(c.input.allowanceFt)} ft): diameter ${e6(c.diameterFt)} ft, liquid ${e6(c.hLiquidFt)} ft, height ${e6(c.heightFt)} ft, L/D ${e6(c.ldRatio)}, margin ${e6(c.velocityMargin)}.`));
  w();

  // Section 6
  const s6 = L.associateChain();
  w('# SECTION 6: The Associate reading, one chain end to end (owned by Associate m06)');
  w();
  w(`ABANA-1, step by step: ${e6(s6.pPsig)} psig becomes ${e6(s6.pPsiaDerived)} psia; the gravity ${e6(s6.gasSg)} gives Ppr ${e6(s6.ppr)} and Tpr ${e6(s6.tpr)}; DAK returns z ${e6(s6.z)}; the gas weighs ${e6(s6.rhoGas)} lb/ft3 and arrives at ${e6(s6.qGasActFt3S)} ft3/s; the liquid weighs ${e6(s6.rhoLiquid)} lb/ft3; the wire mesh pad gives K ${e6(s6.k)} after derating from ${e6(s6.kBase)}; settling is ${e6(s6.vT)} ft/s; the gas needs ${e6(s6.diameterGasFt)} ft of diameter; and at the ${s6.preferredDiameterFt} ft vessel the studio prefers, the height is ${e6(s6.heightAtPreferredFt)} ft.`);
  w('Every one of those numbers moves if the pressure, the temperature, the gravity, the rates or the mist extractor move. None of them moves if the day changes.');
  w();

  // Section 7
  const s7 = L.crossSection();
  w('# SECTION 7: The horizontal vessel, a circle cut by a level (owned by Professional m01)');
  w();
  w(`ABANA-2 is built at ${e6(s7.diameterFt)} ft. The cross-section at a range of levels:`);
  w('| level fraction | liquid depth ft | liquid area ft2 | gas area ft2 | gas height ft | gas-liquid chord ft | total area ft2 |');
  w('| --- | --- | --- | --- | --- | --- | --- |');
  s7.rows.forEach((r) => w(`| ${e6(r.liquidLevelFrac)} | ${e6(r.liquidLevelFt)} | ${e6(r.areaLiquidFt2)} | ${e6(r.areaGasFt2)} | ${e6(r.gasHeightFt)} | ${e6(r.gasLiquidChordFt)} | ${e6(r.areaTotalFt2)} |`));
  w('The chord is the WIDTH of the gas-liquid surface. It is not the oil-water interface, which three-phase sizing places itself, and it is not a length.');
  w(`Half full is a special case and not a law: at half full the two areas are equal, ${e6(s7.halfFullAreaFt2)} ft2 each, and the chord is the full diameter.`);
  w();
  w('Published segments cases:');
  s7.published.forEach((c) => w(`- ${c.name}: liquid area ${e6(c.areaLiquidFt2)} ft2.`));
  w();
  w('The area of a segment and the depth that produces it are exact inverses (the engine bisects 100 times, which resolves the depth to double precision):');
  s7.inverses.forEach((r) => w(`- a drum of ${e6(r.diameterFt)} ft at level ${e6(r.frac)}: depth ${e6(r.liquidLevelFt)} ft gives area ${e6(r.areaLiquidFt2)} ft2, and that area gives the depth back as ${e6(r.backHeightFt)} ft.`));
  w();

  // Section 8
  const s8 = L.twoLengths();
  w('# SECTION 8: Two lengths, one vessel (owned by Professional m02)');
  w();
  w(`ABANA-2 at ${e6(s8.diameterFt)} ft and level ${e6(s8.liquidLevelFrac)}: the liquid needs ${e6(s8.built.lengthLiquidFt)} ft and the gas needs ${e6(s8.built.lengthGasFt)} ft, so the vessel is ${e6(s8.built.lengthFt)} ft long, controlled by the ${s8.built.controlling}, at a slenderness of ${e6(s8.built.ldRatio)}.`);
  w(`The liquid requirement is the retention volume ${e6(s8.built.liquidVolFt3)} ft3 over the liquid area ${e6(s8.built.areaLiquidFt2)} ft2 (derived from the two engine values on this row).`);
  w(`Drop the level to ${e6(s8.lowLevelFrac)} and the same duty in the same drum needs ${e6(s8.low.lengthLiquidFt)} ft, because the liquid area falls to ${e6(s8.low.areaLiquidFt2)} ft2 while the gas gets ${e6(s8.low.areaGasFt2)} ft2 and slows to ${e6(s8.low.gasVelocityFtS)} ft/s.`);
  w(`The gas side of that same drum at level ${e6(s8.lowLevelFrac)}: gas height ${e6(s8.low.gasHeightFt)} ft, gas-liquid chord ${e6(s8.low.gasLiquidChordFt)} ft, margin ${e6(s8.low.gasVelocityMargin)}, gas length ${e6(s8.low.lengthGasFt)} ft, gasCapacityOk ${s8.low.gasCapacityOk}, controlling ${s8.low.controlling}, total length ${e6(s8.low.lengthFt)} ft, slenderness ${e6(s8.low.ldRatio)}.`);
  w(`Lowering the level lengthens the vessel and relieves the gas at the same time: the liquid requirement rises from ${e6(s8.built.lengthLiquidFt)} ft to ${e6(s8.low.lengthLiquidFt)} ft while the gas requirement falls from ${e6(s8.built.lengthGasFt)} ft to ${e6(s8.low.lengthGasFt)} ft (derived from the two figures in each pair).`);
  w();
  w('The two lengths across the family, at the level ABANA-2 runs:');
  w('| diameter ft | liquid area ft2 | gas area ft2 | liquid length ft | gas length ft | length ft | controlling | L/D |');
  w('| --- | --- | --- | --- | --- | --- | --- | --- |');
  s8.rows.forEach((r) => w(`| ${e6(r.diameterFt)} | ${e6(r.areaLiquidFt2)} | ${e6(r.areaGasFt2)} | ${e6(r.lengthLiquidFt)} | ${e6(r.lengthGasFt)} | ${e6(r.lengthFt)} | ${r.controlling} | ${e6(r.ldRatio)} |`));
  w();
  w('Gas height, liquid depth and the gas-liquid chord per bore, at the level ABANA-2 runs:');
  w('| diameter ft | liquid depth ft | gas height ft | gas-liquid chord ft | gas area ft2 | liquid area ft2 |');
  w('| --- | --- | --- | --- | --- | --- |');
  s8.bores.forEach((b) => w(`| ${e6(b.diameterFt)} | ${e6(b.liquidLevelFt)} | ${e6(b.gasHeightFt)} | ${e6(b.gasLiquidChordFt)} | ${e6(b.areaGasFt2)} | ${e6(b.areaLiquidFt2)} |`));
  w(`At a level of ${e6(s8.liquidLevelFrac)} the gas height is half the bore and the chord is the whole bore, which is why the gas length requirement at this level is the gas velocity ratio times half the diameter.`);
  w();
  w('Published horizontal cases:');
  s8.published.forEach((c) => w(`- ${c.name} (${e6(c.input.diameterFt)} ft, level ${e6(c.input.liquidLevelFrac)}, ${e6(c.input.qGasActFt3S)} ft3/s, ${e6(c.input.qLiquidBpd)} bpd, ${e6(c.input.retentionMin)} min): liquid ${e6(c.lengthLiquidFt)} ft, gas ${e6(c.lengthGasFt)} ft, length ${e6(c.lengthFt)} ft, controlling ${c.controlling}, L/D ${e6(c.ldRatio)}, gas velocity ${e6(c.gasVelocityFtS)} ft/s.`));
  w();

  // Section 9
  const s9 = L.gasCapacity();
  w('# SECTION 9: Gas capacity (owned by Professional m03)');
  w();
  w(`A horizontal vessel carries its gas when the velocity in the GAS SPACE stays under the Souders-Brown velocity. ABANA-2 at ${e6(s9.diameterFt)} ft runs ${e6(s9.gasVelocityFtS)} ft/s against ${e6(s9.vT)} ft/s, a margin of ${e6(s9.gasVelocityMargin)}, so gasCapacityOk is ${s9.gasCapacityOk}.`);
  w('The margin across the family:');
  w('| diameter ft | gas area ft2 | gas velocity ft/s | margin | carries the gas |');
  w('| --- | --- | --- | --- | --- |');
  s9.rows.forEach((r) => w(`| ${e6(r.diameterFt)} | ${e6(r.areaGasFt2)} | ${e6(r.gasVelocityFtS)} | ${e6(r.gasVelocityMargin)} | ${r.gasCapacityOk} |`));
  w();
  w('# HELD FOR LITERATURE, taught as a limit and never graded: a horizontal vessel uses the Souders-Brown velocity at the horizontal K as the droplet SETTLING velocity in the gas length requirement. That packaging has not been checked against API 12J or Arnold and Stewart.');
  w('A consequence the engine gate pins: the gas length is the gas velocity over the settling velocity, times the gas height. Under the capacity rule that ratio is at most 1, so the gas length is at most the gas HEIGHT, and gas can control only a vessel that is gas overloaded or shorter than its own diameter.');
  w('The published gas-overloaded three-phase case is the shape to look at:');
  w(`- ${s9.overloaded.name}: gas velocity ${e6(s9.overloaded.gasVelocityFtS)} ft/s against a settling velocity of ${e6(s9.overloaded.vTerminalFtS)} ft/s, margin ${e6(s9.overloaded.gasVelocityMargin)}, gasCapacityOk ${s9.overloaded.gasCapacityOk}, gas length ${e6(s9.overloaded.lengthGasFt)} ft against a gas height of ${e6(s9.overloaded.gasHeightFt)} ft, and the controlling requirement is ${s9.overloaded.controlling}.`);
  w();

  // Section 10
  const s10 = L.slugCatchers();
  w('# SECTION 10: Slug catchers (owned by Professional m04)');
  w();
  w('# App surface: the slug VOLUME is not computed here. It comes from the line, where the pigging tab of the line sizing studio works it out, and it is typed into this tab as a number somebody else stands behind.');
  w(`ABANA takes a ${e6(s10.slug.slugBbl)} bbl slug with ${e6(s10.slug.qLiquidBpd)} bpd still arriving and a ${e6(s10.slug.holdMin)} minute hold: the normal inflow adds ${e6(s10.vessel.normalBbl)} bbl, the working volume is ${e6(s10.vessel.workingBbl)} bbl, and at a fill fraction of ${e6(s10.slug.fillFraction)} the vessel is ${e6(s10.vessel.totalVolumeFt3)} ft3.`);
  w(`At a slenderness of ${e6(s10.vessel.ldRatio)} that is a drum ${e6(s10.vessel.diameterFt)} ft across and ${e6(s10.vessel.lengthFt)} ft long.`);
  w();
  w(`The same slug in a harp: ${e6(s10.fingersInput.nFingers)} fingers of ${e6(s10.fingersInput.fingerIdIn)} inch bore, filled to ${e6(s10.fingersInput.fillFraction)}, need ${e6(s10.fingers.totalVolumeFt3)} ft3, which is ${e6(s10.fingers.fingerLengthFt)} ft per finger over an area of ${e6(s10.fingers.areaPerFingerFt2)} ft2 each and ${e6(s10.fingers.totalPipeFt)} ft of pipe in total.`);
  w(`The harp ignores the normal inflow entirely: the finger volume comes from the slug alone, so ${e6(s10.vessel.workingBbl)} bbl of working volume in the vessel answers ${e6(s10.fingersInput.slugBbl)} bbl in the fingers.`);
  w(`Squeeze the same slug into ${e6(s10.fewInput.nFingers)} fingers of ${e6(s10.fewInput.fingerIdIn)} inch bore and each one is ${e6(s10.few.fingerLengthFt)} ft long, with the warning: "${s10.few.warning}"`);
  w();
  w('Published slug catcher cases:');
  s10.publishedVessel.forEach((c) => w(`- ${c.name} (${e6(c.input.slugBbl)} bbl, ${e6(c.input.qLiquidBpd)} bpd, ${e6(c.input.holdMin)} min, fill ${e6(c.input.fillFraction)}, L/D ${e6(c.input.ldRatio)}): normal ${e6(c.normalBbl)} bbl, volume ${e6(c.totalVolumeFt3)} ft3, diameter ${e6(c.diameterFt)} ft, length ${e6(c.lengthFt)} ft.`));
  s10.publishedFinger.forEach((c) => w(`- ${c.name} (${e6(c.input.slugBbl)} bbl, ${e6(c.input.nFingers)} x ${e6(c.input.fingerIdIn)} inch, fill ${e6(c.input.fillFraction)}): volume ${e6(c.totalVolumeFt3)} ft3, ${e6(c.fingerLengthFt)} ft per finger, ${e6(c.totalPipeFt)} ft of pipe.`));
  w();

  // Section 11
  const s11 = L.distancesAndSetbacks();
  w('# SECTION 11: Distances and computed setbacks on a site (owned by Professional m05)');
  w();
  w('# App surface: the Facility Layout Mapper has always advertised safety distances and never computed any. This engine is that missing half. It keeps two kinds of answer apart: a TABLE figure, which is a table, and a COMPUTED setback, which moves when the duty moves.');
  w('Table figures used by the ERHA station, in metres:');
  w('| pair | required m |');
  w('| --- | --- |');
  s11.table.forEach((r) => w(`| ${r.typeA} to ${r.typeB} | ${r.requiredM === null ? 'null, the table has no figure' : e6(r.requiredM)} |`));
  w('The lookup is symmetric, and a pair the table does not carry comes back as null rather than a guess.');
  w();
  w(`Distances on the ERHA site, from the datum at ${e6(s11.datum.lat)} north, ${e6(s11.datum.lon)} east (the engine measures on a sphere, because a site plan at a real latitude is not a flat grid):`);
  w(`The sphere it measures on, read out of the engine rather than typed: a quarter turn along the equator comes back as ${m4(s11.quarterTurnM)} m (engine), so the radius in use is ${m4(s11.earthRadiusDerivedM)} m (derived: that distance times two over pi).`);
  w('| from | to | distance m |');
  w('| --- | --- | --- |');
  s11.distances.forEach((d) => w(`| ${d.fromName} | ${d.toName} | ${m4(d.distanceM)} |`));
  w('Published distance cases, against an independent Vincenty solution and the three-dimensional chord:');
  s11.publishedDistances.forEach((c) => w(`- ${c.name}: haversine ${m4(c.haversineM)} m, Vincenty ${m4(c.vincentyM)} m (golden), chord ${m4(c.chordM)} m (golden).`));
  w();
  w(`The ERHA flare relieves ${e6(s11.flareInput.reliefRateKgS)} kg/s of gas at ${e6(s11.flareInput.lhvKjKg)} kJ/kg, which is ${m4(s11.flare.qKw)} kW of heat release (engine). With ${e6(s11.flareInput.fractionRadiated)} of it radiated and an allowable of ${e6(s11.flareInput.allowableKwM2)} kW/m2, the point source model puts the setback at ${m4(s11.flare.distanceM)} m.`);
  w('The published allowable levels this engine carries (API 521 customary):');
  s11.radiationLevels.forEach((r) => w(`- ${e6(r.kWm2)} kW/m2: ${r.label}`));
  w('Published flare cases:');
  s11.publishedFlare.forEach((c) => w(`- ${c.name} (${e6(c.input.reliefRateKgS)} kg/s, ${e6(c.input.lhvKjKg)} kJ/kg, allowable ${e6(c.input.allowableKwM2)}, radiated ${e6(c.input.fractionRadiated)}, transmissivity ${e6(c.input.transmissivity)}): ${m4(c.qKw)} kW, ${m4(c.distanceM)} m; the intensity back at that distance is ${m4(c.intensityAtDistance)} kW/m2 (golden).`));
  w();
  w(`The ERHA bund is ${e6(s11.poolInput.poolDiameterM)} m across, which is ${m4(s11.pool.areaM2)} m2 of pool burning at ${e6(s11.poolInput.burnRateKgM2S)} kg/m2/s, so ${m4(s11.pool.burnRateKgS)} kg/s and ${m4(s11.pool.qKw)} kW (engine). The flame stands ${m4(s11.pool.flameHeightM)} m tall by Thomas.`);
  w(`The radius at which the intensity falls to ${e6(s11.poolInput.allowableKwM2)} kW/m2 is ${m4(s11.pool.radiusFromCentreM)} m FROM THE POOL CENTRE, and the setback from the pool EDGE is ${m4(s11.pool.setbackFromEdgeM)} m, status ${s11.pool.setbackStatus}. The difference is half the pool diameter, ${m4(s11.halfPoolDiameterDerivedM)} m (derived).`);
  w('That difference is the S1 defect the Suite layer carried: the layout check measures centre to centre and the tank icon is the pool centre, so passing the setback from the EDGE made the check short by half the bund and failed open.');
  w('Published pool fire cases:');
  s11.publishedPool.forEach((c) => {
    w(`- ${c.name} (${e6(c.input.poolDiameterM)} m pool, burn ${e6(c.input.burnRateKgM2S)}, ${e6(c.input.lhvKjKg)} kJ/kg, allowable ${e6(c.input.allowableKwM2)}): ${m4(c.qKw)} kW, flame ${m4(c.flameHeightM)} m, radius ${m4(c.radiusFromCentreM)} m, edge setback ${m4(c.setbackFromEdgeM)} m, status ${c.setbackStatus}.`);
    if (c.note) w(`    note: "${c.note}"`);
  });
  w();
  w('# HELD FOR LITERATURE, taught as a limit and never graded: the spacing TABLE figures are the customary onshore production-facility values as this engine records them, with no source checked, and they are meant to be replaced by a site standard. The API 521 radiation LABELS are recorded the same way. A course may teach what a table is; it may not treat a table figure as a calculation.');
  w('The pool fire model is a POINT SOURCE. It computes no view factor and no solid-flame surface emissive power, and inside the flame height it under-predicts, which is why the engine flags that case rather than answering it flat.');
  w();

  // Section 12
  const s12 = L.stationJudged();
  w('# SECTION 12: The Professional reading, a station judged (owned by Professional m06)');
  w();
  w(`The ERHA station, checked against the table and against its own two computed setbacks: ${s12.checked} comparisons carried a positive requirement, ${s12.zeroRequirementPairs} pairs had none, ${s12.violationCount} comparisons failed, complete is ${s12.complete}, pass is ${s12.pass} (${s12.passStatus}).`);
  w('| kind | from | to | actual m | required m | shortfall m | shortfall fraction |');
  w('| --- | --- | --- | --- | --- | --- | --- |');
  s12.violations.forEach((v) => w(`| ${v.kind} | ${v.aName} | ${v.bName} | ${m4(v.actualM)} | ${m4(v.requiredM)} | ${m4(v.shortfallM)} | ${e6(v.shortfallFraction)} |`));
  w(`worstAbsolute is ${s12.worstAbsolute.aName} to ${s12.worstAbsolute.bName}, ${m4(s12.worstAbsolute.shortfallM)} m short. worstRelative is ${s12.worstRelative.aName} to ${s12.worstRelative.bName}, ${e6(s12.worstRelative.shortfallFraction)} of its requirement. They are different pairs.`);
  w(`Skipped: ${J(s12.skipped)}. Unknown type pairs: ${s12.unknownPairCount}.`);
  w();
  const re = s12.retiredEdge;
  w(`What the half-bund correction is worth on this plot. The retired Suite layer handed the check the setback from the pool EDGE, ${m4(re.edgeSetbackM)} m, where the check measures centre to centre and the requirement is ${m4(re.radiusFromCentreM)} m. The same plot judged both ways:`);
  w('| pair | actual m | required from the centre m | shortfall m | required as the retired edge figure m | residual shortfall under the retired figure m |');
  w('| --- | --- | --- | --- | --- | --- |');
  re.rows.forEach((r) => w(`| Crude tank to ${r.bName} | ${m4(r.actualM)} | ${m4(r.requiredM)} | ${m4(r.shortfallM)} | ${m4(r.retiredRequiredM)} | ${r.retiredShortfallM === null ? 'not flagged at all' : m4(r.retiredShortfallM)} |`));
  w(`Every row's two shortfalls differ by ${m4(re.halfBundDerivedM)} m, the half bund (derived from the two requirement columns). The heater treater is the row that shows what the defect cost: ${m4(re.heaterTreaterShortfallM)} m short of the real requirement, and only ${m4(re.heaterTreaterRetiredShortfallM)} m short of the retired one.`);
  w(`Judged the retired way the plot still fails, ${re.retiredViolationCount} breaches against ${s12.violationCount}, so the defect never showed as a pass: it showed as a smaller number, which is the harder kind to notice.`);
  w();
  w('What every item has around it, which is the other half of a layout review:');
  w('| item | nearest | distance m | table requirement m |');
  w('| --- | --- | --- | --- |');
  s12.neighbours.forEach((r) => w(`| ${r.name} | ${r.nearestName} | ${m4(r.distanceM)} | ${r.requiredM === null ? 'null' : e6(r.requiredM)} |`));
  w();

  // Section 13
  const s13 = L.threePhaseSplit();
  const p13 = s13.proportional;
  w('# SECTION 13: Three phases in one vessel (owned by Expert m01)');
  w();
  w(`AGBAMI at ${e6(s13.diameterFt)} ft, level ${e6(s13.liquidLevelFrac)}, with ${e6(s13.qOilBpd)} bpd of oil held ${e6(s13.oilRetentionMin)} minutes and ${e6(s13.qWaterBpd)} bpd of water held ${e6(s13.waterRetentionMin)} minutes.`);
  w(`The split is ${p13.interfaceSplit}: the water takes ${e6(p13.waterShare)} of the liquid cross-section, which is ${e6(p13.areaWaterFt2)} ft2 against ${e6(p13.areaOilFt2)} ft2 of oil in a liquid area of ${e6(p13.areaLiquidFt2)} ft2.`);
  w(`The interface sits at ${e6(p13.interfaceHeightFt)} ft, the exact depth whose circular segment has the water area. The water layer is ${e6(p13.waterLayerFt)} ft and the oil layer above it ${e6(p13.oilLayerFt)} ft, and the two add to the liquid level ${e6(p13.liquidLevelFt)} ft (derived).`);
  w(`The retired rule divided the water area by the GAS-LIQUID CHORD of ${e6(p13.gasLiquidChordFt)} ft, which gives ${e6(s13.retiredChordLayerDerivedFt)} ft (derived from two engine values on this row) and understates the water layer, so the D2 carryunder check was reading a layer that was not there.`);
  w(`One liquid retention requirement follows from the proportional split: ${e6(p13.liquidRetentionLengthFt)} ft, with phaseRetentionLengthsFt ${J(p13.phaseRetentionLengthsFt)} and retentionPhase ${p13.retentionPhase}.`);
  w();
  w(`Pin the interface instead, at a water share of ${e6(s13.explicitWaterFrac)}: the split is ${s13.pinned.interfaceSplit}, the interface drops to ${e6(s13.pinned.interfaceHeightFt)} ft, the oil layer grows to ${e6(s13.pinned.oilLayerFt)} ft, and the two phases now need DIFFERENT lengths, ${e6(s13.pinned.phaseRetentionLengthsFt.oilFt)} ft for the oil and ${e6(s13.pinned.phaseRetentionLengthsFt.waterFt)} ft for the water. The requirement is the larger, ${e6(s13.pinned.liquidRetentionLengthFt)} ft, and retentionPhase names the ${s13.pinned.retentionPhase}.`);
  w(`Two retention lengths are the same length within a relative gap of ${s13.retentionTieRel} (engine constant RETENTION_TIE_REL), and then retentionPhase is null rather than a coin toss.`);
  w();
  w('Published threePhase cases:');
  s13.published.forEach((c) => {
    w(`- ${c.name} (${e6(c.diameterFt)} ft, level ${e6(c.liquidLevelFrac)}${c.pinnedWaterFrac ? `, pinned at ${e6(c.pinnedWaterFrac)}` : ''}): share ${e6(c.waterShare)}, interface ${e6(c.interfaceHeightFt)} ft, water ${e6(c.waterLayerFt)} ft, oil ${e6(c.oilLayerFt)} ft, retention length ${e6(c.liquidRetentionLengthFt)} ft, length ${e6(c.lengthFt)} ft, controlling ${c.controlling}, retentionPhase ${c.retentionPhase}.`);
    w(`    the retired chord rule on the same case gave a water layer of ${e6(c.retiredChordWaterLayerFt)} ft and an oil layer of ${e6(c.retiredChordOilLayerFt)} ft (golden).`);
  });
  w();
  w('What three-phase sizing demands, refused by name and with no default:');
  s13.refusals.forEach((r) => w(`- ${r.label}: ${refusal(r)}`));
  w();

  // Section 14
  const s14 = L.dropletsAndVerdicts();
  w('# SECTION 14: Droplets, and the verdicts they carry (owned by Expert m02)');
  w();
  w('Stokes settling between two liquids, in the field form the standards use, beside the oracle that re-derives it in SI from g d2 dRho over 18 mu:');
  s14.publishedStokes.forEach((c) => w(`- ${c.name} (${e6(c.input.dropletMicron)} micron, heavy ${e6(c.input.sgHeavy)}, light ${e6(c.input.sgLight)}, ${e6(c.input.muCp)} cP): engine ${e6(c.engineVFtS)} ft/s, oracle ${e6(c.oracleVFtS)} ft/s (golden), a ratio of ${e6(c.ratioDerived)} (derived from the two figures on this row).`));
  w('The field constant 1.78e-6 is a rounded packaging of the SI group, so the engine sits about four parts in a thousand below the SI derivation on every case, in the same direction each time. That is the size of the disagreement a droplet verdict is decided on when a residence time is close.');
  w('The velocity goes as the SQUARE of the droplet size and inversely with viscosity, so halving the drop quarters the speed:');
  s14.ladder.forEach((r) => w(`- a ${e6(r.dropletMicron)} micron water drop in ${e6(r.muOilCp)} cP oil: ${e6(r.vFtS)} ft/s.`));
  w(`Read that as a straight line and a ${e6(s14.linearFoil.micronSmall)} micron drop would settle at half the ${e6(s14.linearFoil.micronLarge)} micron speed, ${e6(s14.linearFoil.halfOfLargeDerived)} ft/s (derived: ${e6(s14.linearFoil.vLarge)} halved). The engine gives ${e6(s14.linearFoil.vSmall)} ft/s, a quarter, because the law is in the square of the diameter. The two differ by ${e6(s14.linearFoil.gapDerived)} ft/s (derived from the two figures on this row), which is the whole of the error in reading the law as linear.`);
  w();
  w(`AGBAMI as sized: the vessel is ${e6(s14.lengthFt)} ft long, so the oil stays ${m4(s14.residenceOilS)} s and the water ${m4(s14.residenceWaterS)} s.`);
  w(`A ${e6(s14.waterDropletMicron)} micron water drop falls at ${e6(s14.waterDropVelocityFtS)} ft/s and needs ${m4(s14.waterDropFallS)} s to cross the ${e6(s14.oilLayerFt)} ft oil layer, so waterCarryover is ${s14.waterCarryover}.`);
  w(`A ${e6(s14.oilDropletMicron)} micron oil drop rises at ${e6(s14.oilDropVelocityFtS)} ft/s and needs ${m4(s14.oilDropRiseS)} s to cross the ${e6(s14.waterLayerFt)} ft water layer, so oilCarryunder is ${s14.oilCarryunder}.`);
  w('Under the proportional split the residence times are the retention times that were typed in, in seconds, because the split was made to give both phases the same length. Reading a residence back as a result there is reading an input.');
  w(`Tighten the water specification to ${e6(s14.tightMicron)} micron and nothing about the vessel changes except the verdict: the drop falls at ${e6(s14.tight.waterDropVelocityFtS)} ft/s, needs ${m4(s14.tight.waterDropFallS)} s against ${m4(s14.tight.residenceOilS)} s of residence, and waterCarryover is ${s14.tight.waterCarryover}.`);
  w(`The warning, verbatim: "${s14.tight.warning}"`);
  w(`On the pinned split the residence times separate: ${m4(s14.pinnedResidenceOilS)} s for the oil against ${m4(s14.pinnedResidenceWaterS)} s for the water, because the length is set by one phase and the areas by another.`);
  w('Before FC1-0 a missing oil gravity did not refuse: the two droplet checks read NaN and came back false, so a vessel that carried water over reported no carryover. A verdict for an input it could not read is a verdict that says nothing.');
  w();

  // Section 15
  const s15 = L.vesselFamily();
  w('# SECTION 15: The family of vessels (owned by Expert m03)');
  w();
  w('ABANA-1, the vertical family, band 2 to 4:');
  sweepRows(s15.abana1);
  w();
  w('ABANA-2, the horizontal family, band 3 to 5:');
  sweepRows(s15.abana2);
  w('The same family judged against a band widened to 3 to 7, which is an INPUT and not a property of the vessel:');
  sweepRows(s15.abana2Wide);
  w(`Widening the band admits a row the narrow band excluded, and the preferred vessel does not move: the ${e6(s15.wideAdmittedRow.diameterFt)} ft row is now inRange ${s15.wideAdmittedRow.inRange} and still infeasible for ${s15.wideAdmittedRow.reasons.join(', ')}, so the smallest FEASIBLE row in band is still ${e6(s15.wideAdmittedRow.preferredDiameterFt)} ft. A rule that took the first row in band would have moved.`);
  w();
  w(`AGBAMI, the three-phase family at the ${e6(s15.waterDropletMicron)} micron specification, band 3 to 5:`);
  sweepRows(s15.agbami);
  w(`The same family at the ${e6(s15.tightMicron)} micron specification:`);
  sweepRows(s15.agbamiTight);
  w('A droplet verdict gates feasibility, because a vessel that carries water into the oil outlet has not separated the stream, whatever its slenderness.');
  w(`The same family at the ${e6(s15.waterDropletMicron)} micron specification with the band narrowed to ${e6(s15.narrowBand.ldMin)} to ${e6(s15.narrowBand.ldMax)}:`);
  sweepRows(s15.agbamiNarrow);
  w('Three statuses, and they mean different things: selected is a vessel, none-in-band means feasible vessels exist and none of them is inside the slenderness the band asks for, and none-feasible means no vessel in the list works at all.');
  w();
  w('Published sweep cases, with the row the retired rule would have preferred:');
  s15.published.forEach((c) => {
    w(`- ${c.name} (${c.mode}, band ${e6(c.ldMin)} to ${e6(c.ldMax)}): preferred ${c.preferredDiameterFt === null ? 'null' : `${e6(c.preferredDiameterFt)} ft`}, status ${c.preferredStatus}; the retired rule preferred ${e6(c.retiredPreferredDiameterFt)} ft (golden).`);
    c.rows.forEach((row) => w(`    ${e6(row.diameterFt)} ft: L/D ${e6(row.ldRatio)}, length ${e6(row.lengthFt)} ft, inRange ${row.inRange}, feasible ${row.feasible}, reasons ${row.reasons.join(', ') || 'none'}.`));
  });
  w();

  // Section 16
  const s16 = L.layoutReading();
  w('# SECTION 16: Judging a layout (owned by Expert m04)');
  w();
  w('What counts as a check: a comparison between two PLACED items with a POSITIVE requirement. A table figure of zero is no requirement and is counted separately, an item without coordinates is skipped, and a radiation source whose item is not on the plan is skipped.');
  w(`On ERHA: checked ${s16.checked}, zeroRequirementPairs ${s16.zeroRequirementPairs}, skipped ${s16.skippedCount}, unknownPairs ${s16.unknownPairCount}, complete ${s16.complete}, pass ${s16.pass}, passStatus ${s16.passStatus}.`);
  w('Complete and pass answer different questions. Complete says the layout was fully judged; pass says the comparisons that were made all cleared. A layout can pass and be incomplete, and the retired rule reported pass true for a plan where NOTHING was checked.');
  w();
  w('Published layout cases:');
  s16.published.forEach((c) => {
    w(`- ${c.name}: checked ${c.checked}, zero-requirement ${c.zeroRequirementPairs}, violations ${c.violationCount}, skipped ${J(c.skipped)}, unknown ${J(c.unknownPairs)}, complete ${c.complete}, pass ${c.pass} (${c.passStatus}).`);
    w(`    the retired rule reported checked ${c.retiredChecked}, pass ${c.retiredPass}, worst ${J(c.retiredWorstPair)} (golden).`);
    if (c.worstAbsolute) {
      w(`    worstAbsolute ${c.worstAbsolute.kind} ${c.worstAbsolute.aId} to ${c.worstAbsolute.bId}, ${m4(c.worstAbsolute.shortfallM)} m of ${m4(c.worstAbsolute.requiredM)} m; worstRelative ${c.worstRelative.kind} ${c.worstRelative.aId} to ${c.worstRelative.bId}, ${e6(c.worstRelative.shortfallFraction)}.`);
    }
  });
  w('Two rankings are returned and neither is called the worst on its own. A pair 2.0011 m short of 3.0000 m is the worst RELATIVE breach; a control room 40.0561 m short of 90.0000 m is the worst ABSOLUTE one. The retired code returned one ranking, built on the relative shortfall, and called it worst.');
  w();

  // Section 17
  const s17 = L.heldItems();
  w('# SECTION 17: What the method does not know (owned by Expert m05)');
  w();
  w('Four things this course teaches as limits and never as answers:');
  w(`1. The K derating of 0.01 per 100 psi above 100 psig and the floor at ${e6(s17.kFloor)} are a rule of thumb recorded here, not a checked publication. At ${e6(s17.abanaPsig)} psig the vertical mesh K falls from ${e6(s17.kBase)} to ${e6(s17.kUsed)}, which moves every vessel dimension that follows it.`);
  w('2. A horizontal vessel borrows the Souders-Brown velocity at the horizontal K as its droplet settling velocity. If the published method sizes the gas length from a droplet diameter instead, the gas length and every conclusion drawn from it changes.');
  w('3. The spacing table and the radiation labels are recorded values with no source checked. A site standard replaces the table wholesale.');
  w('4. The published cases in these two goldens are SYNTHETIC. They come from an independent oracle written in Python from the same physics, in SI units where the engine works in field units, which catches an arithmetic or a unit error and cannot catch a method that is wrong in both files. No measured separator is in this course.');
  w();
  w('The DAK range is enforced rather than extrapolated, and the two directions are treated differently:');
  s17.dakProbes.forEach((p) => w(`- ${p.label}: ${p.error ? `refused, "${p.error}"` : `accepted, z ${e6(p.z)}, density ${e6(p.rhoLbFt3)} lb/ft3, note "${p.note}"`}`));
  w(`The DAK bounds as this module states them: Tpr ${e6(s17.dakBounds.tprMin)} to ${e6(s17.dakBounds.tprMax)}, Ppr up to ${e6(s17.dakBounds.pprMax)}, with the fit data starting at Ppr ${e6(s17.dakBounds.pprMinFit)}.`);
  w();

  // Section 18
  const s18 = L.expertChain();
  w('# SECTION 18: The Expert reading, a stream and a site together (owned by Expert m06)');
  w();
  w(`AGBAMI end to end: ${e6(s18.pPsig)} psig and ${e6(s18.tF)} degF give Ppr ${e6(s18.ppr)}, Tpr ${e6(s18.tpr)}, z ${e6(s18.z)} and a gas density of ${e6(s18.rhoGas)} lb/ft3; the vane pack gives K ${e6(s18.k)}; settling is ${e6(s18.vT)} ft/s; the gas arrives at ${e6(s18.qGasActFt3S)} ft3/s; at ${e6(s18.diameterFt)} ft the interface sits at ${e6(s18.interfaceHeightFt)} ft, the vessel needs ${e6(s18.lengthFt)} ft with the controlling requirement ${s18.controlling}, and both droplet verdicts pass at the ${e6(s18.waterDropletMicron)} micron specification and the water one fails at ${e6(s18.tightMicron)} micron.`);
  w(`ERHA end to end: the flare setback is ${m4(s18.flareSetbackM)} m from ${m4(s18.flareQKw)} kW, the bund radius is ${m4(s18.poolRadiusM)} m from the centre and ${m4(s18.poolEdgeM)} m from the edge, and checking the site against both plus the table leaves ${s18.violationCount} breaches, the largest of them ${m4(s18.worstAbsoluteShortfallM)} m and the sharpest ${e6(s18.worstRelativeFraction)} of its requirement, on a plan that is not complete because ${s18.skippedCount} things were skipped.`);
  w('A sized vessel and a judged site are the two halves of one answer: a drum that separates the stream and a plot that can hold the drum.');
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
  'engineScope', 'gasAtConditions', 'kValueTable', 'settling', 'verticalVessel', 'associateChain',
  'crossSection', 'twoLengths', 'gasCapacity', 'slugCatchers', 'distancesAndSetbacks', 'stationJudged',
  'threePhaseSplit', 'dropletsAndVerdicts', 'vesselFamily', 'layoutReading', 'heldItems', 'expertChain',
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

  it('the teaching fields are copied verbatim from fc1_fields.mjs, which fc1_dump.mjs imports', () => {
    const src = fs.readFileSync(FIELDS_MJS, 'utf8');
    const dump = fs.readFileSync(DUMP_MJS, 'utf8');
    const lab = LAB_SOURCE();
    const NAMES = ['ABANA_1', 'ABANA_1_SWEEP', 'ABANA_2', 'ABANA_2_SWEEP', 'ABANA_2_WIDE_BAND',
      'ABANA_2_LOW_LEVEL_FRAC', 'ABANA_SLUG', 'ABANA_FINGERS', 'ABANA_FINGERS_FEW',
      'AGBAMI', 'AGBAMI_EXPLICIT_WATER_FRAC', 'AGBAMI_TIGHT_WATER_DROPLET_MICRON',
      'AGBAMI_SWEEP', 'AGBAMI_NARROW_BAND', 'ERHA_DATUM', 'atM', 'ERHA_ITEMS',
      'ERHA_FLARE', 'ERHA_POOL', 'ERHA_UNPLACED', 'ERHA_GHOST_SOURCE'];
    // atM builds ERHA_ITEMS inside the fields file, so the dump imports the
    // items rather than the helper. Every other name is imported by name.
    const NOT_IMPORTED_BY_THE_DUMP = ['atM'];
    NAMES.forEach((name) => {
      const a = src.match(new RegExp(`^export const ${name} = ([\\s\\S]*?);$`, 'm'));
      const b = lab.match(new RegExp(`^export const ${name} = ([\\s\\S]*?);$`, 'm'));
      expect(a, `${name} in fc1_fields.mjs`).not.toBeNull();
      expect(b, `${name} in the lab`).not.toBeNull();
      expect(b[1], name).toBe(a[1]);
      if (!NOT_IMPORTED_BY_THE_DUMP.includes(name)) {
        expect(dump, `${name} is imported by the dump`).toContain(name);
      }
    });
  });

  it('the conditions chain the dump defines is the lab\'s, engine call for engine call', () => {
    const dump = fs.readFileSync(DUMP_MJS, 'utf8');
    const lab = LAB_SOURCE();
    [
      'const pPsia = p.pPsig + 14.7;',
      'const gas = S.gasDensityLbFt3({ pPsia, tF: p.tF, gasSg: p.gasSg });',
      'const rhoOil = p.oilApi !== undefined ? S.oilDensityLbFt3(p.oilApi) : p.sgOil * 62.4;',
      'const rhoWater = (p.waterSg ?? p.sgWater) * 62.4;',
      'const rhoLiquid = (rhoOil * p.qOilBpd + rhoWater * p.qWaterBpd) / qLiquid;',
      'const k = S.kValue({ internalsId: p.internalsId, pPsig: p.pPsig });',
      'const vt = S.terminalVelocityFtS({ k: k.k, rhoLLbFt3: rhoLiquid, rhoGLbFt3: gas.rhoLbFt3 });',
    ].forEach((line) => {
      expect(dump, `the dump's conditions chain: ${line}`).toContain(line);
      expect(lab, `the lab's conditions chain: ${line}`).toContain(line);
    });
  });

  it('the published goldens are both files, whole', () => {
    const c = L.goldenCounts();
    expect(c.separator).toBe(42);
    expect(c.spacing).toBe(16);
  });
});

// ---------------------------------------------------------------------------
// 1 to 18. The rebuilt digest, section by section and then whole.
// ---------------------------------------------------------------------------

describe('THE DIGEST, REBUILT FROM LAB RETURN VALUES, BYTE FOR BYTE', () => {
  const titles = {
    preamble: 'the title and the units line',
    S1: 'what the engine sizes, and every refusal',
    S2: 'the gas at conditions, and the DAK range',
    S3: 'the K table, the derating and the floor',
    S4: 'densities, the mixture and Souders-Brown',
    S5: 'the vertical vessel across its diameters',
    S6: 'one chain end to end',
    S7: 'the cross-section at a level, and the chord',
    S8: 'the two length requirements',
    S9: 'gas capacity, and what gas length cannot exceed',
    S10: 'slug catchers, vessel and harp',
    S11: 'the table, distances, flare and pool setbacks',
    S12: 'a station judged, and its nearest neighbours',
    S13: 'the three-phase split and the interface',
    S14: 'droplets, residence and the two verdicts',
    S15: 'the family, its reasons and its three statuses',
    S16: 'the layout reading and the two rankings',
    S17: 'the four held items and the DAK range',
    S18: 'a stream and a site together',
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
    if (process.env.FC1_WRITE_BUILT) {
      // The timezone gate's child hands its rebuild back through this file,
      // with the zone it actually ran in so the parent can prove it moved.
      fs.writeFileSync(process.env.FC1_WRITE_BUILT, JSON.stringify({
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        offsetMinutes: new Date('2026-09-15T00:00:00Z').getTimezoneOffset(),
        text,
      }));
    }
    expect(text.split('\n').length).toBe(readDigest().split('\n').length);
    expect(text).toBe(readDigest());
  });

  it('NEGATIVE CONTROL: one engine value moved by a single unit in the last printed place is a failed section', () => {
    const text = buildDigest().replace('| AGBAMI | 377.590000 | 663.336000 | 0.549797 |', '| AGBAMI | 377.590000 | 663.336000 | 0.549798 |');
    expect(sections(text).S2).not.toBe(onDisk.S2);
    expect(sections(text).S3).toBe(onDisk.S3);
  });
});

// ---------------------------------------------------------------------------
// What the teaching fields show: the results the course is built on.
// ---------------------------------------------------------------------------

describe('what the teaching fields show', () => {
  it('FC1-0: the interface is the exact segment depth and not the chord rule', () => {
    const s = L.threePhaseSplit();
    expect(s.proportional.interfaceHeightFt).toBeCloseTo(3.049149, 6);
    expect(s.retiredChordLayerDerivedFt).toBeCloseTo(2.026834, 6);
    expect(s.proportional.waterLayerFt + s.proportional.oilLayerFt).toBeCloseTo(s.proportional.liquidLevelFt, 10);
  });

  it('FC1-0: the preferred vessel is the smallest FEASIBLE row in band, so widening the band does not move it', () => {
    const f = L.vesselFamily();
    expect(f.abana2.preferred.diameterFt).toBe(7);
    expect(f.abana2Wide.preferred.diameterFt).toBe(7);
    expect(f.wideAdmittedRow.inRange).toBe(true);
    expect(f.wideAdmittedRow.reasons).toEqual(['gas-capacity']);
    expect(f.agbamiTight.preferredStatus).toBe('none-feasible');
    expect(f.agbamiNarrow.preferredStatus).toBe('none-in-band');
    expect(f.abana2.preferredStatus).toBe('selected');
  });

  it('FC1-0: a droplet specification gates feasibility, and the tighter one flips every row', () => {
    const d = L.dropletsAndVerdicts();
    expect(d.waterCarryover).toBe(false);
    expect(d.tight.waterCarryover).toBe(true);
    expect(L.vesselFamily().agbamiTight.rows.every((r) => r.reasons.includes('water-carryover'))).toBe(true);
  });

  it('FC1-0: complete and pass answer different questions, and nothing checked is not a pass', () => {
    const r = L.layoutReading();
    expect(r.complete).toBe(false);
    expect(r.pass).toBe(false);
    expect(r.passStatus).toBe('checked');
    const nothing = r.published.find((c) => c.name === 's3AllUnplacedNothingChecked');
    expect(nothing.pass).toBeNull();
    expect(nothing.passStatus).toBe('nothing-checked');
    expect(nothing.retiredPass).toBe(true);
    const passesIncomplete = r.published.find((c) => c.name === 's3SkippedItemPassesButIncomplete');
    expect(passesIncomplete.pass).toBe(true);
    expect(passesIncomplete.complete).toBe(false);
  });

  it('FC1-0: the two rankings name different pairs on the ERHA station', () => {
    const s = L.stationJudged();
    expect(s.worstAbsolute.bId).toBe(s.worstAbsolute.bId);
    expect([s.worstAbsolute.aId, s.worstAbsolute.bId]).not.toEqual([s.worstRelative.aId, s.worstRelative.bId]);
    expect(s.checked).toBe(69);
    expect(s.zeroRequirementPairs).toBe(21);
    expect(s.unknownPairCount).toBe(12);
    expect(s.skipped).toHaveLength(2);
  });

  it('a pool setback is reported from the pool EDGE with a status, and the difference is half the bund', () => {
    const s = L.distancesAndSetbacks();
    expect(s.pool.setbackStatus).toBe('beyond-pool-edge');
    expect(s.pool.radiusFromCentreM - s.pool.setbackFromEdgeM).toBeCloseTo(s.halfPoolDiameterDerivedM, 10);
    const within = s.publishedPool.find((c) => c.name === 'withinPoolEdgeEdgeCase');
    expect(within.setbackStatus).toBe('within-pool-edge');
    expect(within.setbackFromEdgeM).toBe(0);
  });

  it('the spacing table answers null for a pair it does not carry rather than guessing', () => {
    const s = L.distancesAndSetbacks();
    expect(s.table.find((r) => r.typeB === 'skid').requiredM).toBeNull();
    expect(s.table.find((r) => r.typeA === 'valve' && r.typeB === 'psv').requiredM).toBe(0);
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
    expect(READERS).toHaveLength(18);
    READERS.forEach((name) => expect(typeof LAB[name], name).toBe('function'));
  });

  it('two calls agree, and mutating a result changes neither the next call nor the fields', () => {
    READERS.forEach((name) => expect(LAB[name](), name).toEqual(LAB[name]()));
    const a = L.verticalVessel();
    a.rows[0].heightFt = 999;
    expect(L.ABANA_1.qGasMMscfd).toBe(18);
    expect(L.verticalVessel().rows[0].heightFt).toBeCloseTo(17.169859, 6);
    const f = L.vesselFamily();
    f.abana2.rows[0].feasible = true;
    expect(L.vesselFamily().abana2.rows[0].feasible).toBe(false);
    const s = L.stationJudged();
    s.violations[0].shortfallM = 1;
    expect(L.stationJudged().violations[0].shortfallM).toBeCloseTo(43.8223, 4);
  });
});

// ---------------------------------------------------------------------------
// THE REFUSAL GATE. Every refusal a panel displays is the engine's own.
// ---------------------------------------------------------------------------

describe('THE REFUSAL GATE: every refusal is the engine\'s own message and named input', () => {
  const allRefusals = () => [...L.engineScope().refusals, ...L.threePhaseSplit().refusals];

  it('there are refusals to check, so a rename cannot silently empty this gate', () => {
    expect(L.REFUSAL_PROBES).toHaveLength(17);
    expect(L.SOFT_STATE_PROBES).toHaveLength(12);
    expect(L.THREE_PHASE_REFUSAL_PROBES).toHaveLength(9);
    expect(allRefusals()).toHaveLength(26);
  });

  it('every one throws SeparatorInputError by name, names its input, and carries a message', () => {
    allRefusals().forEach((r) => {
      expect(r.ok, `${r.label} was accepted`).toBe(false);
      expect(r.errorName, r.label).toBe('SeparatorInputError');
      expect(typeof r.input, `${r.label} names no input`).toBe('string');
      expect(r.input.length, `${r.label} names no input`).toBeGreaterThan(0);
      expect(r.message.length, `${r.label} carries no message`).toBeGreaterThan(10);
    });
  });

  it('NO refusal message is written as a literal in the lab: every one comes back from the engine', () => {
    const src = LAB_SOURCE();
    allRefusals().forEach((r) => {
      expect(src.includes(r.message), `${r.label}: the message is retyped in the lab`).toBe(false);
    });
    L.engineScope().softStates.forEach((s) => {
      expect(src.includes(s.error), `${s.label}: the error is retyped in the lab`).toBe(false);
    });
  });

  it('CONTROL: calling the engine directly gives the same class, input and message', () => {
    L.REFUSAL_PROBES.forEach(({ label, call }, i) => {
      let caught = null;
      try { call(); } catch (e) { caught = e; }
      const reported = L.engineScope().refusals[i];
      expect(caught, label).not.toBeNull();
      expect(caught.name).toBe(reported.errorName);
      expect(caught.input).toBe(reported.input);
      expect(caught.message).toBe(reported.message);
    });
  });

  it('a state the method has no answer for comes back as an error string rather than a throw', () => {
    L.engineScope().softStates.forEach((s) => {
      expect(typeof s.error, s.label).toBe('string');
      expect(s.error.length).toBeGreaterThan(10);
    });
  });
});

// ---------------------------------------------------------------------------
// THE HELD GATE. Four quantities taught as limits, never as answers.
// ---------------------------------------------------------------------------

describe('THE HELD GATE: the four held quantities are marked, shown and never graded', () => {
  it('there are four, each carrying the marker wording', () => {
    expect(L.HELD_ITEMS).toHaveLength(4);
    expect(L.HELD_ITEMS.map((h) => h.id)).toEqual([
      'k-derating', 'horizontal-settling-velocity', 'radiation-labels', 'spacing-table',
    ]);
    L.HELD_ITEMS.forEach((h) => {
      expect(h.note, h.id).toContain(L.HELD_MARKER);
      expect(h.note, h.id).toMatch(/never as an answer/);
    });
    expect(L.heldItems().items).toHaveLength(4);
  });

  it('the digest marks all four the same way', () => {
    const text = readDigest();
    expect((text.match(/HELD FOR LITERATURE/g) || []).length).toBeGreaterThanOrEqual(3);
    expect(text).toContain('Four things this course teaches as limits and never as answers');
  });

  it('each panel that shows a held quantity shows the wording that marks it unverified', () => {
    const show = {
      'SeparatorExplorer.jsx': 'k-derating',
      'SlugExplorer.jsx': 'horizontal-settling-velocity',
      'LayoutExplorer.jsx': 'spacing-table',
    };
    Object.entries(show).forEach(([file, id]) => {
      const text = fs.readFileSync(path.join(HERE, file), 'utf8');
      expect(text, `${file} does not carry the held marker`).toContain(L.HELD_MARKER);
      expect(text, `${file} does not read the ${id} held item`).toMatch(/held/i);
    });
  });

  it('NO graded capstone field reads a held quantity: every capstone vessel states its own vendor K', () => {
    const capstone = fs.readFileSync(CAPSTONE_MJS, 'utf8');
    const block = LAB_SOURCE().split('THE CAPSTONE. EJULEBE, ODEAMA AND ADANGA ONLY')[1];
    [capstone, block].forEach((text) => {
      expect(text).not.toContain('internalsId');
      expect((text.match(/kOverride/g) || []).length).toBeGreaterThanOrEqual(5);
    });
    // Each of the four vessels states a K.
    [L.EJULEBE_1, L.EJULEBE_2, L.EJULEBE_3, L.EJULEBE_4].forEach((v) => {
      expect(typeof v.kOverride).toBe('number');
      expect(v.kOverride).toBeGreaterThan(0);
    });
    // The two graded layout fields are RADIATION shortfalls, so no graded
    // answer reads a spacing TABLE figure.
    const { c3lay } = L.ejulebeRuns();
    expect(c3lay.worstAbsolute.kind).toBe('radiation');
    expect(c3lay.worstRelative.kind).toBe('radiation');
  });
});

// ---------------------------------------------------------------------------
// THE CLOCK GATE. Nothing in this domain has a date input, a seed or a default
// that falls back to today.
// ---------------------------------------------------------------------------

describe('THE CLOCK GATE: no reader reads the system date', () => {
  afterEach(() => { vi.useRealTimers(); });

  const snapshot = () => JSON.stringify(READERS.map((name) => [name, LAB[name]()])
    .concat([['ejulebeCapstoneFields', L.ejulebeCapstoneFields()]]));

  it('identical output under two faked system dates, one long before FC1 and one far after', () => {
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
    if (process.env.FC1_TZ_CHILD) return; // the child does not re-spawn itself
    const sidecar = path.join(ROOT, 'node_modules', '.fc1-tz-rebuild.json');
    if (fs.existsSync(sidecar)) fs.unlinkSync(sidecar);
    execFileSync('npx', ['vitest', 'run', '--reporter=dot', 'src/components/course/panels/separation/separationLab.test.js'], {
      cwd: ROOT,
      env: {
        ...process.env, TZ: TZ_CHILD_TZ, FC1_TZ_CHILD: '1', FC1_WRITE_BUILT: sidecar,
      },
      stdio: 'pipe',
      timeout: 300000,
    });
    const child = JSON.parse(fs.readFileSync(sidecar, 'utf8'));
    fs.unlinkSync(sidecar);
    // CONTROL: the child really did run west of Greenwich.
    expect(child.timeZone).toBe(TZ_CHILD_TZ);
    expect(child.offsetMinutes, 'the child ran at a UTC offset of zero').not.toBe(0);
    expect(child.text).toBe(readDigest());
  }, 300000);
});

// ---------------------------------------------------------------------------
// THE CAPSTONE: the eighteen graded fields reproduce fields.json exactly.
// ---------------------------------------------------------------------------

const CAPSTONE_FIELDS = JSON.parse(fs.readFileSync(FIELDS_JSON, 'utf8'));

describe('the EJULEBE, ODEAMA and ADANGA capstone reproduces fields.json exactly', () => {
  it('fields.json is the eighteen published fields, six per tier, in the published order', () => {
    expect(CAPSTONE_FIELDS).toHaveLength(18);
    expect(CAPSTONE_FIELDS.map((x) => x[0])).toEqual([
      ...Array(6).fill('beginner'), ...Array(6).fill('intermediate'), ...Array(6).fill('advanced'),
    ]);
  });

  it('every one of the eighteen graded answers and tolerances is EXACTLY the published value', () => {
    const built = L.ejulebeCapstoneFields();
    expect(built).toHaveLength(18);
    built.forEach(([tier, key, value, tol], i) => {
      const [pTier, pKey, pValue, pTol] = CAPSTONE_FIELDS[i];
      expect(tier, `${key} tier`).toBe(pTier);
      expect(key, `field ${i}`).toBe(pKey);
      expect(value, `${key} value`).toBe(pValue);
      expect(tol, `${key} tolerance`).toBe(pTol);
    });
    expect(L.ejulebeCapstoneValues()).toEqual(
      Object.fromEntries(CAPSTONE_FIELDS.map(([, k, v]) => [k, v])),
    );
    expect(L.ejulebeCapstoneTolerances()).toEqual(
      Object.fromEntries(CAPSTONE_FIELDS.map(([, k, , t]) => [k, t])),
    );
  });

  it('the capstone conditions are copied verbatim from fc1_fields_capstone.mjs', () => {
    const src = fs.readFileSync(CAPSTONE_MJS, 'utf8');
    const lab = LAB_SOURCE();
    // ADANGA_ITEMS is the one exception: its offset helper is renamed because
    // the teaching block above owns that name in this one module, so it is
    // compared with the rename applied rather than skipped.
    const NAMES = ['EJULEBE_1', 'EJULEBE_2', 'EJULEBE_SLUG', 'EJULEBE_FINGERS',
      'ODEAMA_FLARE', 'ODEAMA_POOL', 'EJULEBE_3', 'EJULEBE_4', 'ADANGA_DATUM', 'ADANGA_SOURCES'];
    NAMES.forEach((name) => {
      const a = src.match(new RegExp(`^export const ${name} = ([\\s\\S]*?);$`, 'm'));
      const b = lab.match(new RegExp(`^export const ${name} = ([\\s\\S]*?);$`, 'm'));
      expect(a, `${name} in fc1_fields_capstone.mjs`).not.toBeNull();
      expect(b, `${name} in the lab`).not.toBeNull();
      expect(b[1], name).toBe(a[1]);
    });
    const itemsA = src.match(/^export const ADANGA_ITEMS = ([\s\S]*?);$/m)[1].replace(/\bat\(/g, 'adangaAt(');
    const itemsB = lab.match(/^export const ADANGA_ITEMS = ([\s\S]*?);$/m)[1];
    expect(itemsB).toBe(itemsA);
  });

  it('the capstone never touches the teaching digest, and the digest never names a capstone field', () => {
    const digest = readDigest().toLowerCase();
    ['ejulebe', 'odeama', 'adanga'].forEach((name) => expect(digest).not.toContain(name));
    const dump = fs.readFileSync(DUMP_MJS, 'utf8');
    ['ejulebe', 'odeama', 'adanga'].forEach((name) => expect(dump.toLowerCase()).not.toContain(name));
    // The dump names fields.json only where it says it never reads it.
    expect(dump).not.toMatch(/readFileSync\([^)]*fields\.json/);
    expect(dump).not.toContain('fc1_fields_capstone');
  });
});

// ---------------------------------------------------------------------------
// THE LEAK GATE: no teaching number may be a graded capstone answer.
// ---------------------------------------------------------------------------

/** Exports that TAKE AN ARGUMENT. */
const ARG_REQUIRED = ['atM', 'leakGuardTargets', 'leakGuardHit', 'collectNumbers',
  'ejulebeCapstoneValues', 'ejulebeCapstoneTolerances'];
const GATE_MACHINERY = ['LEAK_GUARD_MARGIN', 'LEAK_GUARD_SCALINGS'];

/**
 * A surface smaller than this is not the lab: refuse to call it clean. The full
 * lab walks well over thirty entries and several thousand numbers; the floor
 * sits below that by less than any one large reader, so losing a reader to a
 * rename trips it.
 */
const MIN_SURFACE_ENTRIES = 25;
const MIN_SURFACE_NUMBERS = 2000;

/** Every teaching export evaluated: constants as they are, readers called bare. */
const teachingSurface = () => {
  const out = [];
  Object.entries(L).forEach(([name, value]) => {
    if (L.CAPSTONE_ONLY_EXPORTS.includes(name) || ARG_REQUIRED.includes(name) || GATE_MACHINERY.includes(name)) return;
    out.push({ name, value: typeof value === 'function' ? value() : value });
  });
  // The offset helper, at every offset the teaching site actually uses.
  L.ERHA_ITEMS.forEach((i) => out.push({ name: `atM(${i.id})`, value: { lat: i.lat, lon: i.lon } }));
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
    expect(t('ejulebe_finger_length_ft', 'as graded').band).toBeCloseTo(0.01, 12);
    expect(t('ejulebe_finger_length_ft', 'x0.001').band).toBeCloseTo(0.00001, 12);
    expect(t('adanga_worst_relative_fraction', 'x1000').band).toBeCloseTo(0.01, 9);
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

  it('the teaching surface names no capstone export and no capstone field, and carries no em dash or en dash', () => {
    const text = JSON.stringify(teachingSurface());
    L.CAPSTONE_ONLY_EXPORTS.forEach((name) => {
      if (name === 'CAPSTONE_ONLY_EXPORTS') return;
      expect(text, `${name} appears in the teaching surface`).not.toContain(name);
    });
    ['ejulebe', 'odeama', 'adanga'].forEach((n) => expect(text.toLowerCase()).not.toContain(n));
    L.ADANGA_ITEMS.forEach((x) => expect(text).not.toContain(`"${x.name}"`));
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
    const graded = CAPSTONE_FIELDS.find((x) => x[1] === 'ejulebe3_interface_height_ft')[2];
    const planted = surface.map((s) => (s.name === 'threePhaseSplit'
      ? { ...s, value: { ...s.value, proportional: { ...s.value.proportional, interfaceHeightFt: graded + 0.00004 } } }
      : s));
    const hits = leakHits(planted, targets);
    expect(hits).toHaveLength(1);
    expect(hits[0]).toMatch(/^threePhaseSplit\.proportional\.interfaceHeightFt = .* of ejulebe3_interface_height_ft as graded/);
    expect(leakHits(surface, targets)).toEqual([]);
  });

  it('THE GUARD IS NOT TRIGGER HAPPY: the teaching headlines pass', () => {
    const e = L.expertChain();
    expect(L.leakGuardHit(e.interfaceHeightFt, targets)).toBeNull();
    expect(L.leakGuardHit(e.lengthFt, targets)).toBeNull();
    expect(L.leakGuardHit(e.flareSetbackM, targets)).toBeNull();
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
