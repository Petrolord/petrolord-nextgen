// Every value the FC4 lab exposes to a panel, a lesson or the grader is pinned
// here against the teaching digest (/root/fc-wip-gasprocessing/digest.txt),
// which is itself nothing but the Gas Processing engine's return values on the
// published goldens and on the teaching streams OBIAFU, UBIE and AGBADA.
//
// THE DIGEST IS REBUILT BYTE FOR BYTE. buildDigest() below is fc4_dump.mjs's
// writer with every engine call replaced by a lab return value: the prose is
// the dump's, the formatting is the dump's (water contents, pressures,
// temperatures, circulations, diameters and ratios to six decimals; pounds a
// day, gallons a day, Btu a gallon and lbmol a day to four; counts whole), and
// every number comes out of gasprocessingLab.js. The rebuilt text is compared
// with digest.txt section by section and then whole.
//
// THE EIGHTEEN GRADED FIELDS of the IKOT ABASI, OTUMARA and ESCRAVOS capstone
// are pinned separately and EXACTLY against
// /root/fc-wip-gasprocessing/fields.json, READ FROM THE FILE.
//
// Then the gates:
//   THE MIRROR GATE    the wave directory is truth and the in-repo copy under
//                      tools/course-waves/gasprocessing is gated against it
//                      byte for byte, in BOTH directions: every named file
//                      matches, and the mirror holds no file the list does not
//                      name. Reading the wave alone leaves the committed mirror
//                      unchecked; reading the mirror alone goes green on a
//                      stale copy.
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
//   THE TZ GATE        the whole rebuild runs a second time in a child process
//                      under TZ=America/Los_Angeles and must be byte-identical.
//   THE REFUSAL GATE   every refusal the panels display is the engine's own
//                      message, and no message is written as a literal in the
//                      lab or in a panel. The contract is pinned AS IT IS:
//                      kremserFractionRemoved returns an object like every
//                      other export, so the module has no bare-number export at
//                      all and the gate measures that rather than listing it.
//   THE HELD GATE      the six HELD quantities and the two named ABSENCES carry
//                      the wording that marks them unverified, the three panels
//                      show it, and no graded capstone field reads one.
//   THE JT GATE        the coefficient, its derivative, the march against its
//                      own 20000-step answer, and the three march coefficients
//                      with the inlet measured against the mean.
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
import * as LAB_NS from './gasprocessingLab.js';

const L = LAB_NS;
const LAB = Object.fromEntries(Object.entries(L));

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');

const WAVE = '/root/fc-wip-gasprocessing';
const MIRROR = path.join(ROOT, 'tools/course-waves/gasprocessing');
const DIGEST = path.join(WAVE, 'digest.txt');
const FIELDS_JSON = path.join(WAVE, 'fields.json');
const DUMP_MJS = path.join(WAVE, 'fc4_dump.mjs');
const FIELDS_MJS = path.join(WAVE, 'fc4_fields.mjs');
const CAPSTONE_MJS = path.join(WAVE, 'fc4_fields_capstone.mjs');
const ENGINES = path.join(ROOT, 'packages/engines');
const LAB_SOURCE = () => fs.readFileSync(path.join(HERE, 'gasprocessingLab.js'), 'utf8');
const PANEL_FILES = ['WaterExplorer.jsx', 'AbsorberExplorer.jsx', 'ColdEndExplorer.jsx'];

// ---------------------------------------------------------------------------
// The digest's formatting, verbatim from fc4_dump.mjs.
// ---------------------------------------------------------------------------

const num = (x, d) => (x === null || x === undefined || Number.isNaN(Number(x)) ? 'null' : Number(x).toFixed(d));
const e6 = (x) => num(x, 6);   // psia, degF, lb/MMscf, gpm, ft, ratios
const r4 = (x) => num(x, 4);   // lb/day, gal/day, Btu/gal, lbmol/day
const raw = (x) => String(x);
/** A refusal row as the dump prints one, from the lab's captured error string. */
const soft = (err) => (err ? `{ error: "${err}" }` : 'no error');
/** A warning or a catalogue miss, as the dump serialises one. */
const shape = (v) => JSON.stringify(v === undefined ? null : v);

// ---------------------------------------------------------------------------
// THE REBUILD. One block per digest section, in the dump's order, which puts
// the framed history section 20 after 17 and before 18.
// ---------------------------------------------------------------------------

const buildDigest = () => {
  const out = [];
  const w = (s = '') => out.push(s);

  const s1 = L.engineScope();
  const s2 = L.moduleConstants();
  const s3 = L.waterCarried();
  const s4 = L.honestBand();
  const s5 = L.waterToTakeOut();
  const s6 = L.circulationChoice();
  const s7 = L.reboilerPaysFor();
  const s8 = L.tegPublishedCases();
  const s9 = L.stagedDevice();
  const s10 = L.acidGasByMoles();
  const s11 = L.threeAmines();
  const s12 = L.vesselGasGoesUp();
  const s13 = L.stillOverhead();
  const s14 = L.coldEnd();
  const s15 = L.refusalContract();
  const s16 = L.methodDoesNotKnow();
  const s17 = L.publishedCaseReach();
  const s20 = L.repairHistory();
  const census = L.contractCensus();
  const hist = historyCounts();
  const s18 = L.associateReading();
  const s19 = L.professionalReading();

  // ---------------------------------------------------------------- header
  w('# FC4 Gas Processing. Teaching digest.');
  w('# Water contents, pressures, temperatures, circulations, diameters and ratios print to six decimals; pounds a day, gallons a day, Btu a gallon and lbmol a day to four; counts are whole numbers.');
  w('# Field units: MMscfd of gas, psia, degF, lb of water per MMscf of gas, gal of solvent per lb of water, gpm, mol percent, Btu and MMBtu an hour.');
  w('# Nothing here is read from a clock or a random number, so every line reproduces.');
  w('# Built against engines 82ec6d4, vendored sha-identical. Every figure below is that engine\'s own answer at the inputs named beside it.');
  w();

  // -------------------------------------------------------------- SECTION 1
  w('# SECTION 1: What this engine conditions, and what it refuses (owned by Associate m01)');
  w();
  w('# App surface: the Gas Processing Studio runs three units over one gas stream. Dehydration takes water out with glycol, sweetening takes acid gas out with amine, and the dew point unit cools the gas by letting it down.');
  w('- This engine conditions a GAS STREAM. It answers how much water a gas carries, how much solvent it takes to remove it, what the regenerator costs to run, how wide the vessel has to be, and how far a let-down cools the gas.');
  w('- The doctrine is stated in the module\'s own header: everything that is a DESIGN CHOICE or a chart value is an INPUT with its customary range named, and everything computable from first principles is computed. The circulation ratio, the BTEX absorbed fraction, the glycol properties, the water overhead and the contactor liquid are all inputs with defaults, and a reader can see each one on the page rather than having to find it in the source.');
  w(`- A state the method has no answer for comes back as an object with an \`error\` string, and this module throws nothing at all. The contract belongs to the ${census.doors.length} exports that are called with a NAMED-ARGUMENT OBJECT, which is every door the studio calls: each of them answers with an object, and each refusal puts a named string on an \`error\` key. The other ${census.helpers.length} callable exports take a single positional value and are scalar helpers. They answer with a bare number or with one row of a table, and they say they have no answer with a bare NaN or a null, which the door that consumes them turns into a named refusal. Section 15 reads every export of the module from both sides and names the ${census.helpers.length}.`);
  w('- What is NOT in this engine: no hydrate boundary, no compositional flash, no rate-based absorber model, no stage efficiency, no molecular sieve, no refrigeration and no NGL recovery. A hydrate margin is the Production module Flow Assurance engine, and the phase envelope of a reservoir fluid is the Fluid engine.');
  w();
  w('The three units, on the two teaching streams, end to end:');
  w(`- OBIAFU carries ${e6(s1.obiafuInletLbMMscf)} lb of water per MMscf at ${e6(L.OBIAFU_LINE.pPsia)} psia and ${e6(L.OBIAFU_LINE.tF)} degF, and at ${e6(L.OBIAFU.gasMMscfd)} MMscfd a spec of ${e6(L.OBIAFU.outletLbMMscf)} lb per MMscf means taking out ${r4(s1.obiafuWaterLbDay)} lb a day, which at ${e6(L.OBIAFU.circulationGalPerLb)} gal per lb is ${e6(s1.obiafuCircGpm)} gpm of glycol and ${e6(s1.obiafuReboilerMMBtuHr)} MMBtu an hour of reboiler.`);
  w(`- UBIE arrives at ${e6(L.UBIE.co2MolPct)} mol percent CO2 and ${e6(L.UBIE.h2sMolPct)} mol percent H2S, and meeting ${e6(L.UBIE.co2SpecMolPct)} and ${e6(L.UBIE.h2sSpecMolPct)} means picking up ${r4(s1.ubieAcidMolesDay)} lbmol of acid gas a day. Loaded from a LEAN LOADING of ${e6(L.UBIE.leanLoading)} to a RICH LOADING of ${e6(s1.ubieRichLoadingUsed)} mol of acid gas per mol of amine, which is a LOADING SWING of ${num(s1.ubieSwingDerived, 9)} (derived, the two loadings on this line subtracted), that is ${e6(s1.ubieCircGpm)} gpm of solution and ${e6(s1.ubieReboilerMMBtuHr)} MMBtu an hour of regenerator.`);
  w(`- The two contactors those streams go up are ${e6(s1.obiafuDiameterFt)} ft and ${e6(s1.ubieDiameterFt)} ft across.`);
  w();

  // -------------------------------------------------------------- SECTION 2
  w('# SECTION 2: The numbers this module stands on (owned by Associate m01 l04 and Expert m05)');
  w();
  w('Every constant this module uses is EXPORTED, so a reader can name it rather than infer it. They fall into three kinds, and the difference between the kinds is the most useful thing in this section.');
  w();
  w('KIND ONE: DERIVED, which means the module computes it from something else it exports and there is nothing to check.');
  w(`- the standard pressure and temperature of this module, once: ${num(s2.stdPressurePsia, 6)} psia and ${num(s2.stdTemperatureR, 6)} degR.`);
  w(`- the standard cubic feet in a pound mole: ${num(s2.lbmolScf, 12)}. It is the gas constant times the standard temperature over the standard pressure, and the digest can check that by multiplying the three figures this page already carries: ${num(s2.lbmolScfDerived, 12)} (derived).`);
  w(`- the US gallons in a cubic foot: ${num(s2.galPerFt3, 12)}, exact as 1728 cubic inches to the cubic foot over 231 to the gallon.`);
  w(`- the glycol density in lb per ft3: ${num(s2.tegLbPerFt3, 12)}, which is the lb per gallon below times the gallons per cubic foot above.`);
  w();
  w('KIND TWO: MEASURED OUT OF THE ENGINE. These are exported too, and the digest asks the engine a question whose answer is the constant and nothing else, then prints the ratio of the measurement to the export. A ratio of one says the exported name and the number in use are the same number.');
  w('| constant | exported | measured out of a return value | measured over exported |');
  w('| --- | --- | --- | --- |');
  s2.measuredRows.forEach(([label, exported, measured]) => {
    w(`| ${label} | ${num(exported, 12)} | ${num(measured, 12)} | ${num(measured / exported, 12)} |`);
  });
  w('Each row measured as follows, and none of the four numbers above was typed:');
  [
    ['the standard cubic feet', 'the BTEX mole balance at one MMscfd, a million ppmv, a unit absorbed fraction and a unit molecular weight, where the answer is a million over this number and nothing else'],
    ['the water overhead', 'a circulation ratio of one gallon per pound with no reflux, where the vaporization term is the overhead alone'],
    ['the contactor liquid density', 'the gas density and the allowed velocity the same call returns, since the velocity is the K value times the root of the density ratio'],
    ['the molecular weight of water', 'the saturation answer divided by the mole fraction the same call returns, over the standard cubic feet already measured'],
  ].forEach(([what, how]) => w(`- ${what}: ${how}.`));
  w();
  w('Three more groups can only be measured as groups, because the engine never uses their parts separately and nothing outside can pull them apart:');
  w(`- the minutes in a day: ${num(s2.measuredMinutes, 9)}, the gallons a day over the gallons a minute of one call.`);
  w(`- the days in a year over the pounds in a short ton: ${num(s2.measuredYearTon, 12)}, one BTEX answer over another from the same call.`);
  w(`- the hours in a day times the Btu in a MMBtu: ${num(s2.measuredReboilerGroup, 0)}, the gallons a day times the duty a gallon over the duty in MMBtu an hour.`);
  w();
  w('KIND THREE: DECLARED. These are customary or chart values with no publication anywhere in this repository to check them against. The module exports them in one place, under that name, and its own comment says that pinning them is all any gate can do:');
  w('| declared constant | value |');
  w('| --- | --- |');
  s2.declaredRows.forEach(([label, v]) => w(`| ${label} | ${num(v, 6)} |`));
  w('And the amine property set, five declared columns of it beside the name, on the same terms:');
  w('| amine | molecular weight | solution gravity | rich limit | duty, Btu/gal | typical strength, wt % |');
  w('| --- | --- | --- | --- | --- | --- |');
  s2.amineRows.forEach((a) => w(`| ${a.id} | ${e6(a.mw)} | ${e6(a.sgSolution)} | ${e6(a.maxLoading)} | ${e6(a.heatBtuPerGal)} | ${e6(a.wtPctTypical)} |`));
  w();
  w('THE DIFFERENCE BETWEEN THE KINDS IS THE LESSON. A derived constant cannot be wrong without the thing it is derived from being wrong. A measured one can be checked from outside. A declared one can only be pinned, and a gate that pins it is recording that a change would be a reviewed act rather than proving the value right. Section 17 is what follows from that.');
  w();
  w('Two figures from the package rather than this module, exported by the gas properties door:');
  w(`- the Rankine offset: ${num(s2.rankineOffsetR, 6)} degR, which is what the module converts every temperature with.`);
  w(`- the molecular weight of dry air and the gas constant: ${num(s2.airMw, 6)} and ${num(s2.rUniversal, 6)}.`);
  w();
  w(`One derived comparison worth making on this page, because a reader meets both numbers: a glycol density of ${num(s2.tegLbPerGal, 6)} lb a gallon is ${num(s2.tegLbPerFt3, 6)} lb a cubic foot, and the contactor sizes against exactly that figure. The dehydration balance and the vessel sizing use ONE density, and the ratio of the two the digest can form from the exports is ${num(s2.glycolDensityRatioDerived, 12)}.`);
  w();

  // -------------------------------------------------------------- SECTION 3
  w('# SECTION 3: How much water a gas carries (owned by Associate m02)');
  w();
  w('The method is ideal vapour-liquid equilibrium over liquid water: the mole fraction of water in the gas is the vapour pressure of water over the total pressure, and the mass follows from the pound mole.');
  w(`On OBIAFU at ${e6(L.OBIAFU_LINE.pPsia)} psia and ${e6(L.OBIAFU_LINE.tF)} degF the mole fraction is ${num(s3.yWater, 9)} and the content is ${e6(s3.lbPerMMscf)} lb per MMscf. The vapour pressure at that temperature alone is ${e6(s3.psatPsia)} psia, and the mole fraction is that over the total pressure: ${num(s3.yWaterDerived, 9)} (derived, the two figures on this line divided).`);
  w();
  w('The surface, in lb per MMscf. Rows are degF, columns are psia:');
  // The column heads print at the SAME precision as every pressure in this
  // digest, which its own header line promises. They used to print bare, so
  // `1500.000000` existed only in Section 14 and the tier sweep read an
  // Associate lesson quoting this table's own column as reaching forward.
  w(`| degF | ${L.SATURATION_P.map((p) => `${e6(p)} psia`).join(' | ')} |`);
  w(`| --- | ${L.SATURATION_P.map(() => '---').join(' | ')} |`);
  s3.surface.forEach((row) => {
    w(`| ${e6(row.tF)} | ${row.lbPerMMscf.map((v) => e6(v)).join(' | ')} |`);
  });
  w();
  w('The vapour pressure alone, which is the whole temperature dependence and carries no pressure at all:');
  w('| degF | vapour pressure, psia |');
  w('| --- | --- |');
  s3.vapourCurve.forEach((row) => w(`| ${e6(row.tF)} | ${e6(row.psatPsia)} |`));
  w();
  w('The published cases, engine against golden:');
  w('| psia | degF | engine, lb/MMscf | golden, lb/MMscf | engine over golden |');
  w('| --- | --- | --- | --- | --- |');
  s3.published.forEach((row) => {
    w(`| ${e6(row.pPsia)} | ${e6(row.tF)} | ${e6(row.engineLbPerMMscf)} | ${e6(row.goldenLbPerMMscf)} | ${num(row.ratioDerived, 9)} |`);
  });
  w('The golden comes from a DIFFERENT published vapour-pressure equation from the one the engine uses, which is why the last column is near one rather than one. That is the whole value of the check: two independent fits of the same physical curve, meeting inside their shared band.');
  w();

  // -------------------------------------------------------------- SECTION 4
  w('# SECTION 4: The band the answer is honest in (owned by Associate m02 l05 and Expert m05)');
  w();
  w('THREE separate limits sit on the water answer and they are not the same limit. One refuses, one warns that the fit is being extrapolated, and one warns that the METHOD is being extrapolated.');
  w();
  w('1. THE FIT LIMIT, which REFUSES. The vapour-pressure fit holds over a stated band of temperature and the engine will not answer outside it. Read from both sides of both edges:');
  w('| degF | degC | the engine |');
  w('| --- | --- | --- |');
  s4.fitLimit.forEach((row) => {
    w(`| ${num(row.tF, 6)} | ${num(row.tCDerived, 6)} | ${row.error ? `refuses: ${row.error}` : `answers ${e6(row.lbPerMMscf)} lb/MMscf`} |`);
  });
  w('Both edges are INCLUSIVE: the engine answers at exactly the edge and refuses a millionth of a degree outside it. A guard that refused its own stated limit would be as wrong as one that accepted anything.');
  w();
  w(`APP SURFACE, AND THIS IS A LIVE ONE. The gas temperature box in the Gas Processing Studio takes any number. A gas at ${e6(L.GAS_ABOVE_FIT_F)} degF is an ordinary thing to type, and the whole dehydration tab refuses it by name rather than answering: ${soft(s4.studioRefusal)}`);
  w('The refusal carries the band in both units and the temperature it was handed, converted, so a reader is told what to change and by how much rather than only that something is wrong.');
  w();
  w('2. THE PUBLICATION LIMIT, which WARNS. The fit\'s coefficients were published over a narrower band than the one the module guards, and inside the gap the fit is an extrapolation of itself. The engine answers and says so:');
  w('| degF | degC | note |');
  w('| --- | --- | --- |');
  s4.publicationLimit.forEach((row) => {
    w(`| ${num(row.tF, 6)} | ${num(row.tCDerived, 6)} | ${row.refused ? 'refuses' : shape(row.warning)} |`);
  });
  w();
  w('3. THE METHOD LIMIT, which also WARNS, and is about the physics rather than the fit. Ideal mixing understates the water a real gas carries, and the departure grows with pressure. Read from both sides of the threshold:');
  w('| psia | note |');
  w('| --- | --- |');
  s4.methodLimit.forEach((row) => w(`| ${num(row.pPsia, 6)} | ${shape(row.warning)} |`));
  w('The first two limits are about the CURVE the engine draws. The third is about whether that curve is the right curve at all, and no amount of arithmetic inside this module can answer it. That is why the answer above the threshold is a screening number and a chart reading is a design number.');
  w();
  w('The other refusals on the water answer, and what each protects:');
  s4.otherRefusals.forEach((r) => w(`- ${r.label}: ${soft(r.error)}`));
  w('The first two are one guard read from either side of its own limit. A gas at exactly its water vapour pressure is all water and nothing else, so refusing the equality is right rather than over-strict.');
  w();

  // -------------------------------------------------------------- SECTION 5
  w('# SECTION 5: The water a unit has to take out (owned by Associate m03)');
  w();
  w(`The spec sets the load. OBIAFU arrives at ${e6(s5.inletLbMMscf)} lb per MMscf and has to leave at ${e6(L.OBIAFU.outletLbMMscf)}, so ${e6(s5.removedLbMMscfDerived)} lb per MMscf comes out (derived, the two figures on this line subtracted), and at ${e6(L.OBIAFU.gasMMscfd)} MMscfd that is ${r4(s5.waterLbDay)} lb a day.`);
  w();
  w('The same stream against the spec, at a fixed rate and ratio:');
  w('| outlet spec, lb/MMscf | water out, lb/day | circulation, gpm | reboiler, MMBtu/hr |');
  w('| --- | --- | --- | --- |');
  s5.specSweep.forEach((row) => {
    w(`| ${e6(row.outletLbMMscf)} | ${r4(row.waterLbDay)} | ${e6(row.circGpm)} | ${e6(row.reboilerMMBtuHr)} |`);
  });
  w();
  w('The same spec against the rate, which is the difference between an intensive answer and an extensive one:');
  w('| rate, MMscfd | water out, lb/day | circulation, gpm | reboiler, MMBtu/hr | Btu per gallon |');
  w('| --- | --- | --- | --- | --- |');
  s5.rateSweep.forEach((row) => {
    w(`| ${e6(row.gasMMscfd)} | ${r4(row.waterLbDay)} | ${e6(row.circGpm)} | ${e6(row.reboilerMMBtuHr)} | ${r4(row.dutyBtuPerGal)} |`);
  });
  w('The last column does not move down that table. The duty per gallon is a property of the glycol loop, and the rate only decides how many gallons there are.');
  w();

  // -------------------------------------------------------------- SECTION 6
  w('# SECTION 6: The circulation ratio is a choice (owned by Associate m03 l03)');
  w();
  w('The gallons of glycol per pound of water removed is a DESIGN CHOICE the engine will not make. It is the one number that decides both how much glycol moves and how much heat each gallon needs.');
  w('| gal per lb | circulation, gpm | Btu per gal | sensible, Btu/gal | overhead, Btu/gal | reboiler, MMBtu/hr | warning |');
  w('| --- | --- | --- | --- | --- | --- | --- |');
  s6.ratioSweep.forEach((row) => {
    w(`| ${e6(row.circulationGalPerLb)} | ${e6(row.circGpm)} | ${r4(row.dutyBtuPerGal)} | ${r4(row.sensiblePerGal)} | ${r4(row.vaporPerGal)} | ${e6(row.reboilerMMBtuHr)} | ${row.warned ? 'yes' : 'no'} |`);
  });
  w('Three things move in that table and they do not move together. More glycol per pound means more gallons and therefore more sensible heat in total, but each gallon carries LESS water and so needs less heat to boil it out, which is why the Btu a gallon falls while the MMBtu an hour rises.');
  w();
  w('# What the lean strength buys, and what it does not');
  w();
  w('The lean glycol strength is a second design choice and it answers a DIFFERENT question from the circulation ratio. A gallon of lean solution is not pure glycol: at w weight percent it already carries water before it meets the gas, and the contactor then adds more. The engine reports both ends of that loop balance.');
  w('| lean, wt % | water already in a lean gallon, lb | rich glycol returns at, wt % | note |');
  w('| --- | --- | --- | --- |');
  s6.leanSweep.forEach((row) => {
    w(`| ${e6(row.leanTegWtPct)} | ${num(row.leanWaterLbPerGal, 9)} | ${num(row.richTegWtPct, 9)} | ${row.warned ? 'yes' : 'no'} |`);
  });
  w(`At OBIAFU's own ${e6(L.OBIAFU.leanTegWtPct)} weight percent the lean gallon carries ${num(s6.leanWaterLbPerGal, 9)} lb of water and comes back at ${num(s6.richTegWtPct, 9)} weight percent.`);
  w();
  w('WHAT IT DOES NOT DO IS SET THE OUTLET SPEC. The engine says so itself, on every dehydration answer, in as many words:');
  w(`- outletSpecBasis: "${s6.outletSpecBasis}"`);
  w('The outlet water content is a TYPED design input. The dew point a given lean strength can actually deliver is read off a chart, and no chart is in this module, so the module takes the spec and reports the loop balance rather than pretending to derive one from the other. A reader who wants the other direction needs the chart, and this course says where the seam is instead of hiding it.');
  w();
  w('The two choices interact at the rich end. A circulation ratio low enough that each gallon has to carry a lot of water brings the rich glycol back below the strength this module will accept as a LEAN one, and the engine flags it:');
  w('| gal per lb | water a gallon picks up, lb | rich returns at, wt % | note |');
  w('| --- | --- | --- | --- |');
  s6.floodedLoop.forEach((row) => {
    w(`| ${e6(row.circulationGalPerLb)} | ${num(row.waterPerGalDerived, 9)} | ${num(row.richTegWtPct, 9)} | ${row.warning ? shape(row.warning) : 'null'} |`);
  });
  w();
  w('The strength band, read from both sides of both edges:');
  w('| lean, wt % | the engine |');
  w('| --- | --- |');
  s6.strengthBand.forEach((row) => {
    w(`| ${num(row.leanTegWtPct, 9)} | ${row.error ? `refuses: ${row.error}` : `answers, rich returns at ${num(row.richTegWtPct, 6)} wt %`} |`);
  });
  w('Both edges are EXCLUSIVE here, and for different reasons: below 90 the loop is not a dehydration loop, and 100 is a purity no regenerator reaches.');
  w();
  w('The customary band, read from both sides of both edges:');
  w('| gal per lb | warning |');
  w('| --- | --- |');
  s6.customaryBand.forEach((row) => w(`| ${e6(row.circulationGalPerLb)} | ${shape(row.warning)} |`));
  w('Both edges are inclusive: the engine warns outside two to five and is silent at exactly two and exactly five. A guard that objected to its own customary limit would be as wrong as one that accepted anything.');
  w();

  // -------------------------------------------------------------- SECTION 7
  w('# SECTION 7: What the reboiler pays for (owned by Associate m04)');
  w();
  w('The duty is assembled from named parts instead of arriving as one number. Two parts, and they answer different questions.');
  w(`- SENSIBLE: heating the glycol itself from the absorber to the still. On OBIAFU that is ${e6(L.OBIAFU.reboilerTF)} degF less ${e6(L.OBIAFU.absorberTF)} degF of rise, on ${e6(s7.tegLbPerGal)} lb of glycol a gallon at ${e6(s7.cpTegBtuLbFMeasured)} Btu per lb per degF, which the engine returns as ${r4(s7.sensiblePerGal)} Btu a gallon.`);
  w(`- OVERHEAD: boiling the absorbed water back out, plus the reflux the still condenses and boils again. Each gallon carries ${num(s7.waterPerGalDerived, 9)} lb of water at this ratio (derived, one over the ratio), the overhead is ${e6(s7.overheadBtuPerLb)} Btu a lb measured in Section 2, and the reflux ratio of ${e6(L.OBIAFU.refluxRatio)} adds that fraction again. The engine returns ${r4(s7.vaporPerGal)} Btu a gallon.`);
  w(`- The two sum to ${r4(s7.dutyBtuPerGal)} Btu a gallon, and the sensible half is ${e6(s7.sensibleShareDerived)} of the total (derived, the sensible over the sum).`);
  w(`- At ${r4(s7.circGpd)} gallons a day that is ${e6(s7.reboilerMMBtuHr)} MMBtu an hour.`);
  w();
  w('The reflux ratio on its own, holding everything else:');
  w('| reflux ratio | overhead, Btu/gal | total, Btu/gal | reboiler, MMBtu/hr |');
  w('| --- | --- | --- | --- |');
  s7.refluxSweep.forEach((row) => {
    w(`| ${e6(row.refluxRatio)} | ${r4(row.vaporPerGal)} | ${r4(row.dutyBtuPerGal)} | ${e6(row.reboilerMMBtuHr)} |`);
  });
  w();
  w('The still temperature on its own, which moves only the sensible half:');
  w('| reboiler degF | sensible, Btu/gal | overhead, Btu/gal | total, Btu/gal |');
  w('| --- | --- | --- | --- |');
  s7.stillSweep.forEach((row) => {
    w(`| ${e6(row.reboilerTF)} | ${r4(row.sensiblePerGal)} | ${r4(row.vaporPerGal)} | ${r4(row.dutyBtuPerGal)} |`);
  });
  w();

  // -------------------------------------------------------------- SECTION 8
  w('# SECTION 8: The TEG published cases (owned by Associate m05)');
  w();
  w('| rate | inlet | outlet | gal/lb | water, lb/day | gpm | Btu/gal | MMBtu/hr | BTEX, lb/day |');
  w('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  s8.rows.forEach((row) => {
    w(`| ${e6(row.gasMMscfd)} | ${e6(row.inletLbMMscf)} | ${e6(row.outletLbMMscf)} | ${e6(row.circulationGalPerLb)} | ${r4(row.waterLbDay)} | ${e6(row.circGpm)} | ${r4(row.dutyBtuPerGal)} | ${e6(row.reboilerMMBtuHr)} | ${r4(row.btexLbDay)} |`);
  });
  w('Against the golden, engine over golden on every field the published case carries:');
  w('| case | water | gpm | Btu/gal | MMBtu/hr | BTEX |');
  w('| --- | --- | --- | --- | --- | --- |');
  s8.ratios.forEach((row) => {
    w(`| ${row.caseNumber} | ${num(row.waterRatioDerived, 12)} | ${num(row.circRatioDerived, 12)} | ${num(row.dutyRatioDerived, 12)} | ${num(row.reboilerRatioDerived, 12)} | ${num(row.btexRatioDerived, 12)} |`);
  });
  w('Look at the last column rather than the others. The mass balance columns sit at one, because the oracle re-expresses them through kilograms and cubic metres and comes back to the same pounds. THE BTEX COLUMN DOES NOT, and it is the only column in the table that is a MOLE balance. Section 17 is what that gap is.');
  w();

  // -------------------------------------------------------------- SECTION 9
  w('# SECTION 9: A contactor is a staged device (owned by Professional m01 and m02)');
  w();
  w('The Kremser relation ties three things: the absorption factor, the number of theoretical stages, and the fraction of the solute the column removes. Give it any two and it gives the third.');
  w();
  w('THE ABSORPTION FACTOR, WRITTEN OUT. It is the liquid rate over the gas rate times the equilibrium constant:');
  w('    A = L / (V K)');
  w('with L the solvent molar rate down the column, V the gas molar rate up it, and K the equilibrium ratio of the solute between the two phases at the column\'s conditions. It is dimensionless, it is the ONE number that carries the equilibrium, and THIS MODULE DOES NOT COMPUTE IT: none of L, V or K is an argument of any export here, and the factor arrives as a typed input taken from equilibrium data. That is the seam, and it is why every table in this section is indexed by A rather than by a rate.');
  w();
  w('THE RELATION ITSELF, in the two branches the module carries:');
  w('    f = (A^(N+1) - A) / (A^(N+1) - 1)      for A other than 1');
  w('    f = N / (N + 1)                        for A = 1');
  w('with f the fraction removed and N the number of theoretical stages. The second branch is not a special case bolted on: the first is indeterminate at A = 1, where numerator and denominator both vanish, and N over N plus one is its limit there. The table below reads across that limit from both sides to show the two agreeing.');
  w();
  w('AND INVERTED, which is the form a spec demands. Solving the first branch for N:');
  w('    A^(N+1) = (A - f) / (1 - f)');
  w('    N = log( (A - f) / (1 - f) ) / log(A) - 1');
  w('    N = f / (1 - f)                        for A = 1');
  w('Read the first of those three lines rather than the second and the ceiling falls straight out: the left side is positive for any real N, so the right side must be too, and with f below one that needs A above f. An absorption factor at or below the removal a spec asks for has no stage count at all, which is the refusal this section ends on.');
  w(`On the OBIAFU absorber at an absorption factor of ${e6(L.OBIAFU_ABSORPTION_FACTOR)} over ${e6(L.OBIAFU_STAGES)} stages the removal is ${num(s9.obiafuRemoval, 9)}.`);
  w();
  w('The surface. Rows are stages, columns are the absorption factor:');
  w(`| stages | ${L.KREMSER_FACTORS.map((a) => `A = ${a}`).join(' | ')} |`);
  w(`| --- | ${L.KREMSER_FACTORS.map(() => '---').join(' | ')} |`);
  s9.surface.forEach((row) => {
    w(`| ${row.stages} | ${row.removals.map((v) => num(v, 9)).join(' | ')} |`);
  });
  w();
  w('Read the columns rather than the rows. Above an absorption factor of one every column climbs towards total removal as the stages are added. AT AND BELOW ONE IT DOES NOT, and the last column below is the gap between what 200 stages reach and the absorption factor itself:');
  w('| A | removal at 12 stages | removal at 200 stages | A itself | 200 stages less A |');
  w('| --- | --- | --- | --- | --- |');
  s9.ceiling.forEach((row) => {
    w(`| ${num(row.absorptionFactor, 12)} | ${num(row.at12, 9)} | ${num(row.at200, 9)} | ${num(row.absorptionFactor, 9)} | ${num(row.gapDerived, 12)} |`);
  });
  w('Below unity the removal never passes the absorption factor however many stages are bought, and the last column says how close 200 stages get. It is exactly zero for the lower factors, because the factor raised to the stage count has fallen below anything double precision can hold and the relation collapses to the factor itself. Only near one does 200 stages fall measurably short. AT AND ABOVE UNITY THAT COLUMN MEANS NOTHING, because there is no ceiling there to measure against: it is the distance from a removal that cannot exceed one to a factor that can, and it goes more negative the larger the factor, which is arithmetic about the column rather than physics about the absorber.');
  w('At unity the closed form is indeterminate and the engine takes a separate branch, the stages over the stages plus one. Either side of unity by a billionth the answer is continuous with it, which is what says the branch is a limit rather than a patch.');
  w();
  w('Solving the other way round, for the stages a spec demands:');
  w('| A | removal wanted | stages | check: removal at those stages |');
  w('| --- | --- | --- | --- |');
  s9.solvedBack.forEach((row) => {
    w(`| ${e6(row.absorptionFactor)} | ${e6(row.fractionRemoved)} | ${row.error ? `refuses: ${row.error}` : num(row.stages, 9)} | ${row.checkRemoval === null ? 'n/a' : num(row.checkRemoval, 9)} |`);
  });
  w(`And a spec a starved absorber cannot reach at any stage count: at an absorption factor of ${e6(L.A_WELL_UNDER_UNITY)} a removal of ${e6(L.UNREACHABLE_SPEC)} comes back as ${soft(s9.starvedRefusal)}. The refusal names the remedy, which is more solvent rather than more trays.`);
  w();
  w('The published cases, engine against golden. The golden here is a BRUTE FORCE STAGE CASCADE solved as a linear system, which is a genuinely different road to the same number:');
  w('| A | stages | engine | golden | engine over golden |');
  w('| --- | --- | --- | --- | --- |');
  s9.published.forEach((row) => {
    w(`| ${e6(row.absorptionFactor)} | ${row.stages} | ${num(row.engine, 12)} | ${num(row.golden, 12)} | ${num(row.ratioDerived, 12)} |`);
  });
  w();

  // ------------------------------------------------------------- SECTION 10
  w('# SECTION 10: Acid gas is removed by moles (owned by Professional m03)');
  w();
  w('Sweetening is a mole balance from end to end. The gas carries a mole percent of CO2 and H2S, the spec says what may stay, and the difference is what the solution has to pick up. Nothing in that chain is a mass until the very last step.');
  w('THREE NAMES, AND THEY ARE THREE DIFFERENT NUMBERS. A reader who collapses them has lost the whole section, so they are separated here before any of them is used, and they are the engine\'s own words:');
  w(`- the LEAN LOADING: what a mole of amine is still carrying when it comes back from the regenerator and enters the contactor. An input. On UBIE, ${e6(L.UBIE.leanLoading)} mol of acid gas per mol of amine.`);
  w(`- the RICH LOADING: what a mole of amine is carrying when it leaves the contactor. An input. On UBIE, ${e6(s10.richLoadingUsed)}.`);
  w(`- the LOADING SWING: the DIFFERENCE between them, which is what each mole of amine actually carries round the loop and is therefore what sets the circulation. NOT an input, and the engine does not return it under any name. On UBIE it is ${num(s10.swingDerived, 9)}, derived from the two figures above.`);
  w('The rich loading is a CEILING that corrosion sets. The swing is a THROUGHPUT that the regenerator buys. Raising the rich loading raises the swing; lowering the lean loading also raises the swing, and costs regenerator duty rather than corrosion margin. That is why this section reads both ends separately.');
  // WHICH INPUTS THE ENGINE ECHOES, MEASURED FROM THE ANSWER. The bullet above
  // used to carry "the engine echoes back the one it used as `richLoadingUsed`",
  // which reads as though the rich loading is the echoed one. It is not: the
  // answer carries a `...Used` key for EVERY typed input in this chain. The set
  // is read off the answer's own keys.
  const amineEchoes = s10.echoedInputs;
  w(`The engine echoes back EVERY typed input this chain used, each under its own name ending in Used. There are ${amineEchoes.length} of them, measured by reading the keys of the answer itself: ${amineEchoes.map((x) => `\`${x.key}\` = ${e6(x.value)}`).join(', ')}. So an echoed name tells a reader the value was TYPED and which value was taken, and it never means the figure was computed. THE LOADING SWING IS NOT AMONG THEM, and that absence is the point of the bullet above: the engine returns every number it was given and does not return the one it derived from two of them.`);
  w(`The engine's own refusal uses all three words in one sentence when the swing vanishes: ${soft(s10.swingVanishesRefusal)}`);
  w();
  w(`On UBIE: ${e6(L.UBIE.co2MolPct)} less ${e6(L.UBIE.co2SpecMolPct)} mol percent of CO2 plus ${e6(L.UBIE.h2sMolPct)} less ${e6(L.UBIE.h2sSpecMolPct)} of H2S is ${num(s10.removedMolPctDerived, 9)} mol percent removed (derived, the four figures on this line), which at ${e6(L.UBIE.gasMMscfd)} MMscfd is ${r4(s10.acidMolesDay)} lbmol a day.`);
  w(`Each mole of amine carries the LOADING SWING round the loop: a rich loading of ${e6(s10.richLoadingUsed)} less a lean loading of ${e6(L.UBIE.leanLoading)} is a swing of ${num(s10.swingDerived, 9)} mol of acid gas per mol of amine (derived, the two loadings on this line subtracted). The circulation follows from the swing and not from either loading on its own: ${e6(s10.circGpm)} gpm.`);
  w(`The regenerator then costs the stated ${e6(L.UBIE.dutyBtuPerGal)} Btu a gallon on every one of those gallons, which is ${e6(s10.reboilerMMBtuHr)} MMBtu an hour.`);
  w();
  w('The swing is the whole lever. The rich end:');
  w('| rich loading | swing | circulation, gpm | regenerator, MMBtu/hr | warning |');
  w('| --- | --- | --- | --- | --- |');
  s10.richSweep.forEach((row) => {
    w(`| ${e6(row.richLoading)} | ${num(row.swingDerived, 9)} | ${e6(row.circGpm)} | ${e6(row.reboilerMMBtuHr)} | ${row.warned ? 'yes' : 'no'} |`);
  });
  w('And the lean end. READ THE LAST TWO COLUMNS TOGETHER BEFORE READING ANY SENTENCE ABOUT THEM, because this is where the model and the plant part company:');
  w('| lean loading | swing | circulation, gpm | regenerator, MMBtu/hr | MMBtu/hr per gpm |');
  w('| --- | --- | --- | --- | --- |');
  s10.leanSweep.forEach((row) => {
    w(`| ${e6(row.leanLoading)} | ${num(row.swingDerived, 9)} | ${e6(row.circGpm)} | ${e6(row.reboilerMMBtuHr)} | ${num(row.perGpmDerived, 9)} |`);
  });
  {
    const lo = s10.leanSweep[0];
    const hi = s10.leanSweep[s10.leanSweep.length - 1];
    w(`IN THIS MODEL A LEANER LEAN COSTS NOTHING. Going from a lean loading of ${e6(hi.leanLoading)} to ${e6(lo.leanLoading)} takes the circulation from ${e6(hi.circGpm)} to ${e6(lo.circGpm)} gpm AND the regenerator from ${e6(hi.reboilerMMBtuHr)} to ${e6(lo.reboilerMMBtuHr)} MMBtu an hour. Both fall. The last column says why: the duty per gallon is a STATED input, ${e6(L.UBIE.dutyBtuPerGal)} Btu on every gallon circulated, so the regenerator duty is nothing but the circulation in other units and the ratio does not move down the table.`);
    w('THAT IS THE MODEL AND NOT THE PLANT. Stripping a solution leaner is work, and on a real regenerator it is bought with reboiler duty per gallon, more stripping steam and a taller still. NONE OF THAT IS IN THIS ENGINE: the duty per gallon is a number the caller types and the engine never changes it, so nothing here can make a leaner lean cost anything. A reader who takes this table as the economics of a regenerator has been told the opposite of the truth by a model that is doing exactly what it says it does.');
    w('WHAT THE TABLE IS HONESTLY FOR: it says how much SOLUTION a given lean loading has to move. That is a real answer and it is the one the mole balance is entitled to give. What it costs to reach that lean loading is a question for a rate-based still model, and the seam is here rather than further down.');
  }
  w();
  w('The corrosion warning, read from both sides of MDEA\'s own customary limit:');
  w('| rich loading | warning |');
  w('| --- | --- |');
  s10.corrosionBand.forEach((row) => w(`| ${num(row.richLoading, 9)} | ${shape(row.warning)} |`));
  w();
  w('Three refusals that look alike and are not:');
  s10.lookalikeRefusals.forEach((r) => w(`- ${r.label}: ${soft(r.error)}`));
  w();
  w('The published cases, engine against golden:');
  w('| case | gpm engine | gpm golden | ratio | MMBtu/hr engine | MMBtu/hr golden | ratio |');
  w('| --- | --- | --- | --- | --- | --- | --- |');
  s10.published.forEach((row) => {
    w(`| ${row.amineId} | ${e6(row.circGpm)} | ${e6(row.circGpmGolden)} | ${num(row.circRatioDerived, 12)} | ${e6(row.reboilerMMBtuHr)} | ${e6(row.reboilerMMBtuHrGolden)} | ${num(row.reboilerRatioDerived, 12)} |`);
  });
  w('Every ratio in that table is the same number, and it is not one. The whole amine balance is a MOLE balance, so every figure in it carries the standard molar volume, and the oracle builds that volume from the SI gas constant where the engine builds it from the package figure in field units. Section 17 measures the gap once and names it.');
  w();

  // ------------------------------------------------------------- SECTION 11
  w('# SECTION 11: Three amines, and what separates them (owned by Professional m04)');
  w();
  w('The module carries a published property set for three amines, and every column of it is a design consequence rather than a piece of chemistry trivia.');
  w('| amine | molecular weight | typical strength, wt % | customary rich limit | customary duty, Btu/gal | solution gravity |');
  w('| --- | --- | --- | --- | --- | --- |');
  s11.propertyRows.forEach((a) => {
    w(`| ${a.id} | ${e6(a.mw)} | ${e6(a.wtPctTypical)} | ${e6(a.maxLoading)} | ${e6(a.heatBtuPerGal)} | ${e6(a.sgSolution)} |`);
  });
  w();
  w('The same duty put through all three, each at its OWN typical strength, rich limit and duty, which is what the table is for:');
  w('| amine | circulation, gpm | regenerator, MMBtu/hr | rich used | MMBtu/hr per gpm |');
  w('| --- | --- | --- | --- | --- |');
  s11.runs.forEach((row) => {
    w(`| ${row.id} | ${e6(row.circGpm)} | ${e6(row.reboilerMMBtuHr)} | ${e6(row.richLoadingUsed)} | ${num(row.perGpmDerived, 9)} |`);
  });
  w('The last column is derived, the two engine figures on each row divided. It is NOT a new fact. Divide each amine\'s customary duty in the table above by the minutes in a day measured in Section 2, times the minutes in an hour, and the same number comes back:');
  w('| amine | MMBtu/hr per gpm, from the two engine figures | the table duty times 60 over a million |');
  w('| --- | --- | --- |');
  s11.perGpmCheck.forEach((row) => {
    w(`| ${row.id} | ${num(row.fromTwoEngineFiguresDerived, 9)} | ${num(row.fromTheTableDerived, 9)} |`);
  });
  w('So the regenerator duty ranks the three amines in exactly the order the duty column of the property set already does, and the circulation ranks them in the same order again. All three orderings are the same ordering, and the interesting number is not which amine is cheapest but HOW FAR apart they are:');
  w('| pair | circulation ratio | duty ratio |');
  w('| --- | --- | --- |');
  s11.pairs.forEach((row) => {
    w(`| ${row.left} over ${row.right} | ${num(row.circRatioDerived, 9)} | ${num(row.dutyRatioDerived, 9)} |`);
  });
  w('The two ratio columns are NOT equal, and that is the whole point of the table: circulation is set by the rich limit and the strength, duty is set by the rich limit, the strength and the duty per gallon, so the same ordering is reached by two different routes and the gaps between the amines are different sizes on each.');
  w();
  w(`An amine the table does not carry: ${shape(s11.unknownAmine)}, and the package asked for it returns ${soft(s11.unknownAmineRefusal)}. This is the one catalogue lookup in the module and it says it does not know.`);
  w(`\`amineOf\` is one of the ${census.helpers.length} scalar helpers Section 15 names. It hands back a null where a door would hand back an object with an \`error\` key, and \`aminePackage\`, the door that consumes it, is what turns that null into the named refusal printed above. A caller of the LOOKUP therefore tests for a null; a caller of the PACKAGE reads one property, the way it does at every other door.`);
  w();

  // ------------------------------------------------------------- SECTION 12
  w('# SECTION 12: The vessel the gas goes up (owned by Professional m05)');
  w();
  w('THE EQUATION IS NOT NEW. Souders-Brown, the K value and the settling velocity are owned by the Separation & Slug Catching course, which teaches the six published K rows and the mist extractor that sets them. What is new here is the DUTY: a contactor is a mass transfer column rather than a knockout drum, and it is sized on the gas that has to rise through a descending liquid.');
  w();
  w(`On OBIAFU the gas weighs ${e6(s12.obiafu.rhoG)} lb per ft3 at ${e6(L.OBIAFU_LINE.pPsia)} psia and ${e6(L.OBIAFU_LINE.tF)} degF with a compressibility of ${num(s12.obiafu.z, 9)}, the allowed velocity at a K of ${e6(L.OBIAFU_CONTACTOR.ksFtS)} ft per s is ${e6(s12.obiafu.vAllowFtS)} ft per s, and the diameter is ${e6(s12.obiafu.diameterFt)} ft.`);
  w(`On UBIE the gas weighs ${e6(s12.ubie.rhoG)} lb per ft3 at ${e6(L.UBIE_CONTACTOR.pPsia)} psia and ${e6(L.UBIE_CONTACTOR.tF)} degF with a compressibility of ${num(s12.ubie.z, 9)}, the allowed velocity at a K of ${e6(L.UBIE_CONTACTOR.ksFtS)} ft per s is ${e6(s12.ubie.vAllowFtS)} ft per s, and the diameter is ${e6(s12.ubie.diameterFt)} ft.`);
  w();
  w('The compressibility is NOT an input here. The engine computes it from the same DAK correlation the rest of the platform uses, off Sutton pseudo-criticals built from the gas gravity alone:');
  w('| psia | degF | gravity | z the engine computes | gas density, lb/ft3 | allowed velocity, ft/s | diameter, ft |');
  w('| --- | --- | --- | --- | --- | --- | --- |');
  s12.zSurface.forEach((row) => {
    w(`| ${e6(row.pPsia)} | ${e6(row.tF)} | ${e6(row.gasSg)} | ${num(row.z, 9)} | ${e6(row.rhoG)} | ${e6(row.vAllowFtS)} | ${e6(row.diameterFt)} |`);
  });
  w();
  w('The K value, which is the one design choice in the whole sizing:');
  w('| K, ft/s | allowed velocity, ft/s | diameter, ft |');
  w('| --- | --- | --- |');
  s12.kSweep.forEach((row) => {
    w(`| ${e6(row.ksFtS)} | ${e6(row.vAllowFtS)} | ${e6(row.diameterFt)} |`);
  });
  w();
  w('The published cases come in two kinds, and the difference between them is the most useful thing about this golden.');
  w();
  w('THE FIRST THREE PASS A COMPRESSIBILITY IN, so they check the sizing arithmetic and never the correlation. Each also names the LIQUID it is sizing against, which is a glycol column for the first two and an amine solution for the third:');
  w('| rate | psia | degF | z given | liquid, lb/ft3 | diameter engine | diameter golden | ratio |');
  w('| --- | --- | --- | --- | --- | --- | --- | --- |');
  s12.givenZ.forEach((row) => {
    w(`| ${e6(row.gasMMscfd)} | ${e6(row.pPsia)} | ${e6(row.tF)} | ${e6(row.z)} | ${num(row.rhoLLbFt3, 6)} | ${e6(row.diameterFt)} | ${e6(row.diameterGoldenFt)} | ${num(row.ratioDerived, 12)} |`);
  });
  w('The third row is an AMINE column sized against an amine solution, and the liquid density it uses is built from the solution gravity the amine table already carried. A glycol density and an amine solution density are different numbers, and a column sized against the wrong one is confidently the wrong width.');
  w(`On the same duty the two liquids give: ${num(s12.thirdAgainstGlycolFt, 9)} ft against glycol and ${num(s12.thirdAgainstAmineFt, 9)} ft against MDEA solution, a factor of ${num(s12.thirdLiquidFactorDerived, 9)} (derived, the two figures on this line divided).`);
  w();
  w('THE LAST TWO LET THE ENGINE COMPUTE ITS OWN COMPRESSIBILITY, which is the branch the live studio always takes because it never passes one:');
  w('| rate | psia | degF | z the engine computes | z golden | diameter engine | diameter golden | ratio |');
  w('| --- | --- | --- | --- | --- | --- | --- | --- |');
  s12.ownZ.forEach((row) => {
    w(`| ${e6(row.gasMMscfd)} | ${e6(row.pPsia)} | ${e6(row.tF)} | ${num(row.z, 12)} | ${num(row.zGolden, 12)} | ${e6(row.diameterFt)} | ${e6(row.diameterGoldenFt)} | ${num(row.ratioDerived, 12)} |`);
  });
  w(`Those two also report where the compressibility came from: the engine returns zSource "${s12.zSourceFormed}" when it forms one and "${s12.zSourceGiven}" when it is handed one, so a reader is never guessing which branch produced the number in front of them.`);
  w();
  w(`The liquid the gas rises against is an INPUT, defaulting to the module's one glycol density of ${num(s12.tegLbPerFt3, 6)} lb per ft3. An amine column passes its own: the module builds one from each amine's solution gravity, and the three come out ${s12.amineLiquids.map((a) => `${a.id} ${num(a.lbPerFt3, 6)}`).join(', ')} lb per ft3.`);
  w();

  // ------------------------------------------------------------- SECTION 13
  w('# SECTION 13: The still overhead nobody sells (owned by Expert m04)');
  w();
  w('Aromatics dissolve in glycol in the contactor, ride round the loop and leave through the still overhead. The absorbed fraction is an OPERATING VALUE the engine takes as an input; the arithmetic from it is a mole balance and nothing else.');
  w(`On OBIAFU at ${e6(L.OBIAFU.btexInletPpmv)} ppmv and an absorbed fraction of ${e6(L.OBIAFU.btexAbsorbedFrac)}, the engine returns ${r4(s13.btexLbDay)} lb a day and ${e6(s13.btexTonsYear)} short tons a year.`);
  w();
  w('| ppmv in | absorbed fraction | lb/day | short tons/yr |');
  w('| --- | --- | --- | --- |');
  s13.rows.forEach((row) => {
    w(`| ${e6(row.btexInletPpmv)} | ${e6(row.btexAbsorbedFrac)} | ${r4(row.btexLbDay)} | ${e6(row.btexTonsYear)} |`);
  });
  w(`Both columns are linear in both inputs, and the table says so itself: tripling the ppmv from 60 to 180 at a fixed fraction multiplies the pounds a day by ${num(s13.ppmvTripledDerived, 12)}, and doubling the fraction from 0.1 to 0.2 at a fixed ppmv multiplies it by ${num(s13.fractionDoubledDerived, 12)} (both derived, rows of the table above divided). A mole balance with one operating multiplier and no chemistry is exactly what those two figures describe.`);
  w(`The molecular weight the balance uses is an input with a default of ${e6(s13.btexMwDefault)}, which is toluene. A real BTEX cut is four compounds, and the engine carries one number for all of them.`);
  w();

  // ------------------------------------------------------------- SECTION 14
  w('# SECTION 14: Cooling by expansion, and the cold separator (owned by Expert m01, m02 and m03)');
  w();
  w('THE COEFFICIENT ITSELF IS NOT THIS COURSE\'S TO TEACH. The Joule-Thomson coefficient and the product of it with a pressure drop belong to the Production module Flow Assurance course, which owns them over a whole module. What is this course\'s is the thing no other module in the package does: THIS IS THE ONLY ENGINE THAT COMPUTES ONE. The flowline thermal engine takes a coefficient as a TYPED INPUT from its caller and never forms one, so this section is where the number a caller types comes from.');
  w();
  w('The relation, which the module derives in its own header and which admits no alternative:');
  w('    mu = (1/Cp) [ T (dV/dT)_P - V ],  with V = z R T / P');
  w('    T (dV/dT)_P = (R/P)( T z + T^2 (dz/dT)_P ) = V + (R T^2 / P)(dz/dT)_P');
  w('    mu = (R T^2 / (Cp P)) (dz/dT)_P');
  w('Every term on the right is either the caller\'s or comes from the same validated compressibility correlation the contactor uses. Nothing about the gas beyond its gravity enters, which is the method\'s reach and its limit in one line.');
  w();
  w(`On AGBADA at ${e6(L.AGBADA.p1Psia)} psia and ${e6(L.AGBADA.tF)} degF, a gravity of ${e6(L.AGBADA.gasSg)} and a heat capacity of ${e6(L.AGBADA.cpBtuLbmolF)} Btu per lbmol per degF: the compressibility is ${num(s14.z, 9)} at a reduced pressure of ${num(s14.ppr, 6)} and a reduced temperature of ${num(s14.tpr, 6)}, its temperature derivative is ${num(s14.dzdT, 12)} per degR, and the coefficient is ${num(s14.muFPerPsi, 9)} degF per psi.`);
  w(`In the unit a field engineer quotes, that is ${num(s14.muPer100PsiDerived, 6)} degF per 100 psi (derived, the figure on the line above times a hundred).`);
  w();
  w('The derivative is where the whole answer lives. It is the only term that carries any real-gas behaviour at all, and it is what the module differentiates rather than assumes:');
  w('| psia | z | dz/dT, per degR | mu, degF/psi | mu, degF/100 psi |');
  w('| --- | --- | --- | --- | --- |');
  s14.pressureSweep.forEach((row) => {
    w(`| ${e6(row.pPsia)} | ${row.refused ? 'refuses' : num(row.z, 9)} | ${row.refused ? '' : num(row.dzdT, 12)} | ${row.refused ? '' : num(row.muFPerPsi, 9)} | ${row.refused ? '' : num(row.muPer100PsiDerived, 6)} |`);
  });
  w('Read the lowest row against the highest. The coefficient does NOT vanish as the pressure falls, because the derivative divided by the pressure tends to a finite limit even as the compressibility tends to one. A gas at near-atmospheric pressure still cools when it expands, and a method that treated the departure from ideality as the whole story would say it does not.');
  w();
  w('The heat capacity is an input and it divides the whole answer:');
  w('| Cp, Btu/lbmol.degF | mu, degF/100 psi | Cp times mu |');
  w('| --- | --- | --- |');
  s14.cpSweep.forEach((row) => {
    w(`| ${e6(row.cpBtuLbmolF)} | ${num(row.muPer100PsiDerived, 6)} | ${num(row.cpTimesMuDerived, 9)} |`);
  });
  w('The last column is derived, the two figures on each row multiplied. It does not move down the table, which is what says the heat capacity enters exactly once and as a divisor. Everything else about the gas is in the other factor.');
  w();
  w('# The march (owned by Expert m02)');
  w();
  w('A coefficient is a slope, so a finite pressure drop is an integration and not a multiplication. The module marches it in equal pressure steps, taking the half-step TEMPERATURE as well as the half-step PRESSURE, which is a midpoint Runge-Kutta step and second order in the step size.');
  w();
  w(`On AGBADA from ${e6(L.AGBADA.p1Psia)} psia to ${e6(L.AGBADA.p2Psia)} psia the gas arrives at ${num(s14.t2F, 9)} degF, having cooled ${num(s14.dropF, 9)} degF over ${s14.steps} steps.`);
  w(`The march reports three coefficients, and they are three different numbers: ${num(s14.muInletFPerPsi, 9)} at the inlet, ${num(s14.muLastStepFPerPsi, 9)} at the last half step, and ${num(s14.muMeanFPerPsi, 9)} as the mean the cooling actually delivered. The mean is the cooling over the pressure drop and is the one that belongs beside an arrival temperature.`);
  w(`The inlet coefficient is ${num(s14.inletOverMeanDerived, 9)} times the mean (derived, two figures from the line above divided), so quoting the inlet beside the arrival overstates the slope the answer was built from.`);
  w();
  w('How many steps are enough, measured against a march of the same routine at a step count nothing downstream would ever use:');
  w(`| steps | cooling, degF | arrival, degF | cooling over the ${L.AGBADA_STEP_REFERENCE}-step answer |`);
  w('| --- | --- | --- | --- |');
  s14.stepSweep.forEach((row) => {
    w(`| ${row.steps} | ${num(row.dropF, 9)} | ${num(row.t2F, 9)} | ${num(row.overReferenceDerived, 12)} |`);
  });
  w(`The reference march itself reports ${num(s14.referenceDropF, 9)} degF. The last column is derived, each row's cooling over that. Twenty steps is the module's default and the table says what that default is worth on this let-down.`);
  w();
  w('What the march refuses, and why each refusal is a different fault:');
  s14.stepRefusals.forEach((row) => {
    w(`- a march of ${raw(row.steps)} steps: ${soft(row.error)}`);
  });
  w(`- a let-down to a pressure above the inlet: ${soft(s14.backwardsRefusal)}`);
  w(`- a let-down with the two pressures equal: ${soft(s14.equalPressureRefusal)}`);
  w();
  w('Letting the same gas down further does NOT go on cooling it in proportion, because the coefficient falls with the pressure the march is walking down:');
  w('| outlet psia | arrival, degF | cooling, degF |');
  w('| --- | --- | --- |');
  s14.deeperLetDown.forEach((row) => {
    w(`| ${e6(row.p2Psia)} | ${row.error ? `refuses: ${row.error}` : num(row.t2F, 9)} | ${row.error ? '' : num(row.dropF, 9)} |`);
  });
  w();
  w('A march CAN die part way down, and what kills it is a cold INLET rather than a deep outlet: the gas cools past the reduced temperature its own compressibility correlation is valid at, and the coefficient it needs for the next step cannot be formed. The refusal names the step it died at and the state it died in, which is the difference between an answer that is missing and an answer nobody can tell is missing:');
  w(`- the same gas entering at ${e6(L.AGBADA_COLD_INLET_F)} degF and let down to ${e6(L.AGBADA_COLD_P2_PSIA)} psia: ${soft(s14.coldInletRefusal)}`);
  w(`- and it hands back where: step ${raw(s14.coldDiedAtStep)} of ${raw(s14.coldSteps)}, at ${num(s14.coldDiedAtPsia, 6)} psia and ${num(s14.coldDiedAtF, 6)} degF.`);
  w('Three fields beside a message, and between them they say the march was two thirds of the way down and the gas was already cold when the method ran out. A bare refusal would have said none of it.');
  w();
  w(`The gravity has a hard edge of its own. Sutton's pseudo-critical pressure correlation turns negative above a gravity of about ${e6(L.SG_SUTTON_BREAKS)}, and the compressibility that depends on it is refused rather than returned:`);
  w('| gravity | the engine |');
  w('| --- | --- |');
  s14.gravityEdge.forEach((row) => {
    w(`| ${e6(row.gasSg)} | ${row.error ? `refuses: ${row.error}` : `answers ${num(row.muFPerPsi, 9)} degF per psi`} |`);
  });
  w();
  w('# The cold separator (owned by Expert m03)');
  w();
  w(`The point of the cooling is the water it drops out. AGBADA carries ${num(s14.waterInLbMMscf, 9)} lb of water per MMscf at its inlet, and at ${num(s14.t2F, 9)} degF and ${e6(L.AGBADA.p2Psia)} psia the gas can hold ${num(s14.waterOutLbMMscf, 9)} lb per MMscf.`);
  w(`The difference is ${num(s14.dropOutLbMMscfDerived, 9)} lb per MMscf (derived, the two figures on the line above subtracted), and that is what appears as liquid in the separator boot.`);
  w(`As a ratio the cold gas holds ${num(s14.heldFractionDerived, 9)} of what the warm gas held (derived, the same two figures divided).`);
  w();
  w('Two things move that outlet number and they pull in opposite directions. The temperature fell, which dries the gas; the pressure also fell, which wets it. The engine can be asked each question separately:');
  w('| state | psia | degF | water the gas can hold, lb/MMscf |');
  w('| --- | --- | --- | --- |');
  s14.fourStates.forEach((row) => {
    w(`| ${row.label} | ${e6(row.pPsia)} | ${num(row.tF, 6)} | ${row.error ? `refuses: ${row.error}` : num(row.lbPerMMscf, 9)} |`);
  });
  w('The third row is the one that surprises a reader: letting the gas down WITHOUT cooling it would let it hold more water than it arrived with, because the mole fraction of water at a fixed vapour pressure rises as the total pressure falls. The expansion only dries the gas because of the cooling it causes.');
  w();
  w('And this is the seam. Dehydration and a cold separator are two answers to one question, and a third answer, injecting an inhibitor so the water that is there cannot form a hydrate, belongs to the Flow Assurance course along with the hydrate boundary itself. Nothing in this engine computes a hydrate boundary. What this section computes is where the cold spot is and how much free water arrives at it, which is the input that question takes.');
  w();

  // ------------------------------------------------------------- SECTION 15
  w('# SECTION 15: What a refusal is, and what one always carries with it (owned by Expert m05 l02 and l03)');
  w();
  w('The contract: a state the method has no answer for comes back as an object carrying an `error` string. Nothing in this module throws. Every refusal it makes:');
  s15.refusals.forEach((r) => w(`- ${r.label}: ${soft(r.error)}`));
  w();
  w(`THE CONTRACT, EXACTLY. This module exports ${census.names.length} names. ${census.values.length} of them are values, the constants and the amine property table, and ${census.callable.length} are callable. Every callable one is asked here a question it can answer and a question it cannot, and the shape below is read off what came back rather than stated:`);
  w('| export | called with | answering | with no answer | where a no-answer is named |');
  w('| --- | --- | --- | --- | --- |');
  census.rows.forEach((r) => {
    w(`| ${r.name} | ${r.door ? 'a named-argument object' : 'one positional value'} | ${r.answers} | ${r.refuses} | ${r.caughtBy ? `\`${r.caughtBy}\`, which returns ${r.caughtShape}` : 'the call itself'} |`);
  });
  w(`Read the table by its second column. THE ERROR CONTRACT IS THE DOORS: all ${census.doors.length} exports called with a named-argument object answer with an object, and every one of them that cannot answer puts a named string on an \`error\` key. That is every door the studio calls, so a caller of a door checks one property and never catches, and there is no door it has to check differently.`);
  w(`The other ${census.helpers.length} are SCALAR HELPERS, called with one positional value, and they are named here so nobody has to discover them at a call site: ${census.helpers.map((r) => `\`${r.name}\``).join(', ')}. A helper answers with a bare number or with one row of the property table, and says it has no answer with a bare NaN or a null. None of those reaches a studio tab as a blank, because each one is consumed by a door, and the last column above is that door being handed the helper's no-answer and refusing BY NAME. The engine's own header says so of the first of them: the saturation fit is a correlation with nowhere to put an error key, and its one caller turns the NaN into a named refusal.`);
  w('A helper read straight from a studio tab would be the real defect, because a bare NaN passes an `error` check and surfaces far downstream as an empty field, and an empty field looks exactly like a field nobody filled in. That is what the audit asks of a module: which exports are doors, which are helpers, and whether anything reads a helper where it should have read a door.');
  w();
  w('The contract read on ONE door, from five directions:');
  w('| call | absorption factor | stages | returns |');
  w('| --- | --- | --- | --- |');
  s15.kremserContract.forEach((row) => {
    w(`| kremserFractionRemoved | ${e6(row.absorptionFactor)} | ${e6(row.stages)} | ${row.error ? `{ error: "${row.error}" }` : `{ fractionRemoved: ${num(row.fractionRemoved, 9)} }`} |`);
  });
  w('Read the last row against the four above it. The same call shape returns a fraction or a refusal, and the caller tells them apart by asking for a property rather than by inspecting a type. That is what the contract buys: a guard downstream cannot be written wrongly, because there is only one way to write it.');
  w();
  w('A refusal also hands back the EVIDENCE it stands on, so a caller can say what to change rather than only that something failed:');
  s15.evidence.forEach((row) => {
    w(`- ${row.label}: besides the message it returns ${row.fieldCount} field${row.fieldCount === 1 ? '' : 's'}, ${row.fields.join(', ')}.`);
  });
  w();
  w('Every guard has a boundary, and the boundary is where the teaching is. Each one read from both sides:');
  w('| guard | value | the engine |');
  w('| --- | --- | --- |');
  s15.boundaries.forEach((row) => {
    w(`| ${row.guard} | ${num(row.value, 9)} | ${row.refused ? 'refuses' : 'answers'} |`);
  });
  w('A guard that refuses its own limit is as wrong as one that accepts nonsense, which is why both sides are read rather than one.');
  w();

  // ------------------------------------------------------------- SECTION 16
  w('# SECTION 16: What the method does not know (owned by Expert m06 l01)');
  w();
  w('Six things this course teaches as limits and never as answers:');
  w(`1. The real-gas departure of the saturated water content. HELD FOR LITERATURE. The engine warns above ${num(s16.chartWarningPsia, 6)} psia that the correction reaches tens of percent, and nothing in this package stands behind a figure for it. Every graded water content in this course sits below that threshold for exactly this reason.`);
  w(`2. The water overhead the reboiler pays for, ${num(s16.waterOverheadBtuPerLb, 6)} Btu a lb. DECLARED. It is an input with that default, and no publication in this repository fixes it.`);
  w(`3. The glycol density, ${num(s16.tegLbPerGal, 6)} lb a gallon. DECLARED. It is the module's one glycol density and both the loop balance and the vessel sizing read it, so at least a reader always knows which number they are holding.`);
  w(`4. The water density the amine gallons chain divides by, ${num(s16.waterLbPerGal, 6)} lb a gallon. DECLARED, and the module's own comment records that it sits above the measured density of water at the standard temperature, because it is the figure the amine circulation charts are drawn with.`);
  w('5. The three amines\' property set. DECLARED. The molecular weights are chemistry; the typical strengths, the rich limits, the duties and the solution gravities are customary practice with no source in this package.');
  w('6. The BTEX absorbed fraction and its single molecular weight. DECLARED. The fraction is a chart or operating value the engine takes as an input, and the molecular weight is one compound standing for four.');
  w();
  w('THE MODULE COLLECTS ALL OF THESE IN ONE PLACE. `DECLARED_CONSTANTS` is an export whose whole purpose is to say which numbers no check in this package can reach, and its own comment says that pinning them is the honest best available rather than a validation. A course that presented a pinned constant as a verified one would be making exactly the claim that export exists to refuse.');
  w();
  w('And two things that are not held but simply ABSENT. THERE IS NO HYDRATE BOUNDARY IN THIS ENGINE, and there is no stage efficiency. A hydrate margin is the Production module Flow Assurance engine, which owns subcooling, the depression correlations and the inhibitor dose, and which computes no hydrate boundary of its own either. Dehydration and a cold separator are the OTHER two answers to the same question, and the seam between the three is a course boundary rather than a gap.');
  w();
  w('One more absence worth naming, because a reader will look for it. Nothing here models a real absorber. A theoretical stage is not a tray, there is no stage efficiency, no rate-based mass transfer and no approach to equilibrium. Section 9 gives a stage count and Section 10 gives a circulation, and turning either into steel needs a vendor.');
  w();

  // ------------------------------------------------------------- SECTION 17
  w('# SECTION 17: What a published case can and cannot catch (owned by Expert m05 l05)');
  w();
  w('A check that restates the thing it is checking validates nothing. This module\'s published cases come from an oracle that says, route by route, which of its routes are independent of the engine and which are not, and that distinction is the whole of this section.');
  w();
  w('THE INDEPENDENT ROUTES, and the evidence that they are independent is that they DO NOT agree exactly:');
  w(`- WATER CONTENT. The oracle uses a DIFFERENT published vapour-pressure equation from the engine's. Across the ${s17.waterCaseCount} published cases the largest departure from one is ${num(s17.waterWorstDerived, 9)} (derived, the largest absolute departure in the Section 3 table). Two published fits of one physical curve meeting inside their shared band is a result; two copies of one fit agreeing exactly is not.`);
  w(`- KREMSER. The oracle solves the stage cascade as a LINEAR SYSTEM by elimination, which is different arithmetic reaching the same number. Largest departure from one across ${s17.kremserCaseCount} cases: ${num(s17.kremserWorstDerived, 12)} (derived, from the Section 9 table).`);
  w('- THE JOULE-THOMSON COEFFICIENT. The oracle forms the molar volume from a compressibility it solves ITSELF, by a different root-finder from the engine\'s, and differentiates it NUMERICALLY, so the identity the engine derives is never used on the checking side. Only the published correlation is shared.');
  w('- THE BALANCES. The oracle carries these through kilograms, cubic metres, joules and watts, and it builds the STANDARD MOLAR VOLUME from the SI gas constant where the engine builds it from the package figure in field units. That is a real second road and not a change of spelling, and the next block measures the difference it makes.');
  w();
  w('THAT LAST ONE LEAVES A MEASURABLE SIGNATURE, and it is the most useful number on this page. Every quantity that passes through the standard molar volume carries the gap between the two gas constants, and every quantity that does not carries none of it:');
  w('| published case | engine over golden | what the quantity is |');
  w('| --- | --- | --- |');
  s17.molarRows.forEach((row) => w(`| ${row.label} | ${num(row.ratioDerived, 15)} | ${row.kind} |`));
  w(`The molar rows all carry the SAME number to the last place double precision holds: the largest minus the smallest of them is ${s17.molarSpreadDerived.toExponential(3)} (derived, from the molar rows above), which is a few units in the last bit rather than a difference in the arithmetic. The mass rows carry none of it: their largest departure from one is ${s17.massWorstDerived.toExponential(3)}.`);
  w(`So the signature is ${num(s17.signatureDerived, 15)}, and it is the ratio of two gas constants rather than a defect in either side. A quantity that shows it went through a mole; a quantity that does not, did not. That is a check telling you something about the arithmetic it just did, which is the entire point of an independent oracle.`);
  w();
  w('THE SHARED VALUES, which the oracle declares rather than checks. The dehydration and sweetening balances both turn on customary densities and a customary overhead, and there is nothing in this repository to check any of them against. The oracle holds a second copy under a name that says so, so that CHANGING one of them breaks the published cases and makes the change a reviewed act. That is a tripwire and it is worth having. It is not a validation, and the oracle says as much in its own comment.');
  w();
  w('So the published cases divide into two kinds, and a reader has to know which kind is in front of them:');
  w('| what is checked | by what | what a disagreement would mean |');
  w('| --- | --- | --- |');
  [
    ['the water content', 'a second published vapour-pressure equation', 'one of the two fits is wrong, or the conversion between them is'],
    ['the stage relation', 'a brute-force cascade solved as a linear system', 'the closed form is wrong'],
    ['the coefficient and the march', 'an independently solved compressibility, differentiated numerically', 'the identity the engine derives is wrong'],
    ['the balances', 'the same arithmetic in different units, with the customary values declared as shared', 'a unit slip or a transcription error, and nothing about whether the customary values are right'],
  ].forEach(([a, b, c]) => w(`| ${a} | ${b} | ${c} |`));
  w();
  w('THE RULE A READER SHOULD LEAVE WITH. Agreement to twelve decimals between two things that share their arithmetic is a weaker result than agreement to six between two things that do not. The first says a transcription was faithful. The second says two roads met. When a published case agrees exactly, the question to ask is not how close it came but how far apart the two sides were to begin with.');
  w();

  // ------------------------------------------------------------- SECTION 18
  w('# SECTION 18: The Associate reading, one stream from the line to the still (owned by Associate m06)');
  w();
  w(`OBIAFU arrives at ${e6(L.OBIAFU_LINE.pPsia)} psia and ${e6(L.OBIAFU_LINE.tF)} degF carrying ${e6(s18.inletLbMMscf)} lb of water per MMscf, which is a mole fraction of ${num(s18.yWater, 9)} and nothing to do with the rate. A spec of ${e6(L.OBIAFU.outletLbMMscf)} lb per MMscf takes ${e6(s18.removedLbMMscfDerived)} of that out (derived, the two figures on this line subtracted), and only now does the rate matter: at ${e6(L.OBIAFU.gasMMscfd)} MMscfd it is ${r4(s18.waterLbDay)} lb a day.`);
  w(`The choice of ${e6(L.OBIAFU.circulationGalPerLb)} gallons of glycol per pound turns that into ${r4(s18.circGpd)} gallons a day, or ${e6(s18.circGpm)} gpm. Each of those gallons needs ${r4(s18.sensiblePerGal)} Btu to reach the still and ${r4(s18.vaporPerGal)} Btu to give its water up, ${r4(s18.dutyBtuPerGal)} Btu in all, and the reboiler that does it is ${e6(s18.reboilerMMBtuHr)} MMBtu an hour.`);
  w(`The vessel that gas rises through is ${e6(s18.diameterFt)} ft across, and the glycol loop carries ${e6(s18.btexTonsYear)} short tons of aromatics a year out of the still overhead on the way.`);
  w('Six answers about one stream. Two of them, the water content and the duty per gallon, do not know the rate exists. Three of them are nothing but the rate applied to the first two. And the last one is about a vessel, which is the only part of the chain that cares what pressure the gas is at rather than only how wet it is.');
  w();

  // ------------------------------------------------------------- SECTION 19
  w('# SECTION 19: The Professional reading, one sour stream through two columns (owned by Professional m06)');
  w();
  w(`UBIE arrives at ${e6(L.UBIE.co2MolPct)} mol percent CO2 and ${e6(L.UBIE.h2sMolPct)} mol percent H2S and has to leave at ${e6(L.UBIE.co2SpecMolPct)} and ${e6(L.UBIE.h2sSpecMolPct)}. As a mole balance that is ${r4(s19.acidMolesDay)} lbmol a day into the solution. Between a LEAN LOADING of ${e6(L.UBIE.leanLoading)} and a RICH LOADING of ${e6(s19.richLoadingUsed)} the LOADING SWING is ${num(s19.swingDerived, 9)} mol per mol (derived, the two loadings on this line subtracted), and on ${e6(L.UBIE.amineWtPct)} weight percent MDEA that is ${e6(s19.circGpm)} gpm and ${e6(s19.reboilerMMBtuHr)} MMBtu an hour.`);
  w(`As a staged device the same column is read differently. At an absorption factor of ${e6(L.OBIAFU_ABSORPTION_FACTOR)} the Kremser relation says ${e6(L.OBIAFU_STAGES)} theoretical stages remove ${num(s19.removalAtStages, 9)} of what is there, and a removal of ${e6(0.99)} would demand ${num(s19.stagesForNinetyNine, 9)}.`);
  w(`As a vessel it is ${e6(s19.diameterFt)} ft across, because the gas weighs ${e6(s19.rhoG)} lb per ft3 at ${e6(L.UBIE_CONTACTOR.pPsia)} psia and may not rise faster than ${e6(s19.vAllowFtS)} ft per s.`);
  w('Three answers about one column, and not one of them can be derived from the other two. The mole balance says how much solution has to move and says nothing about whether the column can reach the spec. The stage relation says whether the spec is reachable and says nothing about how many gallons a minute it takes. The vessel says how wide the steel has to be and knows neither.');
  w();

  // ------------------------------------------------------------- SECTION 20
  // FRAMED HISTORY, placed last in the dump's order so nothing above it can be
  // read as history by accident.
  w('# SECTION 20: What this engine was repaired for, and how to teach it (owned by Expert m05 l01)');
  w();
  w('THE EXPERT TIER READS THIS DIGEST OUT OF ORDER, so the mapping is stated here once rather than inferred from six section headers. It was resolved by SUBJECT:');
  w('| Expert lesson | where it reads from |');
  w('| --- | --- |');
  [['m05 l01, What was repaired, and what was not', 'Section 20'],
    ['m05 l02, What a refusal is', 'Section 15'],
    ['m05 l03, The contract read on one door', 'Section 15, the export census and the one-door table'],
    ['m05 l04, Constants measured out of the engine', 'Section 2'],
    ['m05 l05, What a published case can catch', 'Section 17'],
    ['m06 l01, What the method does not know', 'Section 16'],
    ['m06 l02, The capstone worked', 'its own capstone rather than this digest'],
    ['m06 l03, Where this engine hands over', 'Sections 14 and 16'],
  ].forEach(([a, b]) => w(`| ${a} | ${b} |`));
  w();
  w('EVERYTHING IN THIS SECTION IS HISTORY AND IS LABELLED AS HISTORY. Nothing above this line is. If you teach any of it, say plainly that it is what the engine used to do, the way this section does. A sentence about former behaviour that reads as current behaviour is the defect; the subject itself is not.');
  w();
  w('This module was repaired after a recon found 49 findings in it, its published cases and the studio that composes it. Four of those are worth teaching because each one is a general lesson that happens to have an example here.');
  w();
  w('1. A COEFFICIENT THAT WAS WRONG ON FOUR SCREENS AT THE APP\'S OWN DEFAULTS. The Joule-Thomson relation carries no compressibility in its denominator, and this module divided by one. The error was exactly a factor of one over z: nothing at all in the ideal-gas limit and growing with pressure, which is the shape that hides an error, because it is smallest exactly where a sanity check is easiest. The lesson is the shape rather than the factor.');
  w('| psia | z the engine reports | 1 over z, which is what the error was |');
  w('| --- | --- | --- |');
  s20.shapeRows.forEach((row) => {
    w(`| ${e6(row.pPsia)} | ${num(row.z, 9)} | ${num(row.oneOverZDerived, 9)} |`);
  });
  w('Those are the repaired engine\'s compressibilities, and the last column is one over each of them, printed so the shape of the former error can be read off numbers that are current.');
  w();
  w('2. THE CHECK THAT COULD NOT CATCH IT. The routine had no published case at all, and its only check was that the answer fell in a band of 5 to 9 degF per 100 psi. Both the wrong answer and the right one sit inside that band, so the check could not fail. A gate that restates the formula it is checking, or bounds an answer loosely enough to admit both candidates, is not a check. Section 17 is what a real one looks like, and the golden now carries published cases for this routine.');
  w();
  w('3. AN INPUT THAT WAS VALIDATED AND THEN IGNORED. The lean glycol strength was range checked, refused outside 90 to 100 weight percent, and read by nothing. A validated input that moves no output is worse than an absent one, because the validation asserts that it matters. It now drives the loop water balance, and Section 6 teaches what it does and, just as carefully, what it does not: it does not set the outlet spec, and the engine says so on every answer.');
  w();
  w('4. ONE FLUID WITH TWO DENSITIES, AND ONE MODULE WITH TWO STANDARD BASES. Two numbers for one glycol, and a standard cubic foot defined at one pressure and converted at another. Neither gap was large. Both are defects whatever their size, because nothing downstream can tell which of the two numbers it is holding. Section 2 now shows one of each, and shows the derived ones being derived.');
  w();
  w(`WHERE THE REST OF IT LIVES, AND HOW TO READ IT. The engine's own source comments record what changed, because a good repair records what it changed: there are ${hist.thisModule} such comment lines in packages/engines/engines/facilities/gasProcessing.js, counted here rather than quoted, by taking every COMMENT line in that one file carrying "used to", "no longer" or the repair's own name. Both the tree and the rule are stated because a count of this kind means nothing without them, and widening the rule to the nine keywords this file also sweeps with takes the same module to ${hist.thisModuleWide}. A COUNT ACROSS THE WHOLE VENDORED TREE IS DELIBERATELY NOT QUOTED HERE, and the reason is the lesson. It was quoted once. It then moved, not because anything in this engine changed, but because two other courses vendored three more engines of their own, and a figure that answers to work in another module is not a fact about this one. A number quoted without its tree and its rule is not checkable and should not be repeated; a number whose tree can change under it should not be quoted at all. THEY ARE PROVENANCE. A comment is not the digest, and a sentence lifted out of one into a lesson arrives with no frame around it. If you want to teach any of it, frame it the way this section does, and never present it as what the engine does now.`);
  w();


  return `${out.join('\n')}\n`;
};

/**
 * The two counts digest Section 20 states, BOTH TAKEN OVER THIS ONE MODULE.
 * The RULE is the lab's (`countHistoryComments` and its wider sibling).
 *
 * THE TREE-WIDE COUNT IS GONE, and its absence is deliberate. Section 20 used
 * to print a count over every vendored engine module, and that number moved the
 * day FC2 and FC3 vendored three engines of their own: 59 over 226 modules
 * became 81 over 229, the committed digest stopped reproducing, and one live
 * bank question and one lesson were quoting the stale pair. Nothing in this
 * engine had changed. A figure that answers to another module's work is not a
 * fact about this one, so the digest now declines to quote it and says why, and
 * this helper stops computing what nothing prints.
 */
const historyCounts = () => {
  const thisModuleSrc = fs.readFileSync(path.join(ENGINES, 'engines/facilities/gasProcessing.js'), 'utf8');
  return {
    thisModule: L.countHistoryComments(thisModuleSrc),
    thisModuleWide: L.countHistoryCommentsWide(thisModuleSrc),
  };
};

// ---------------------------------------------------------------------------

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

/** The dump's order, which puts the framed history section between 17 and 18. */
const SECTION_KEYS = ['preamble', ...Array.from({ length: 19 }, (_, i) => `S${i + 1}`), 'S20'];

/** Every reader, one per digest section. */
const READERS = [
  'engineScope', 'moduleConstants', 'waterCarried', 'honestBand', 'waterToTakeOut',
  'circulationChoice', 'reboilerPaysFor', 'tegPublishedCases', 'stagedDevice', 'acidGasByMoles',
  'threeAmines', 'vesselGasGoesUp', 'stillOverhead', 'coldEnd', 'refusalContract',
  'methodDoesNotKnow', 'publishedCaseReach', 'repairHistory', 'associateReading',
  'professionalReading',
];

// ---------------------------------------------------------------------------
// 0. The digest on disk is a real digest, the mirror matches it, and the lab
//    carries the dump's fields.
// ---------------------------------------------------------------------------

/** Every file the wave ships and the repo mirrors. The mirror may hold its own
 *  README and nothing else beyond this list.
 *
 */
const MIRRORED = [
  'BANK_TASK.md', 'FINDINGS.md', 'KEY_TRUTH_TASK.md', 'LESSON_TASK.md', 'PANELS.md', 'RECON.md',
  'build_digest.sh', 'digest.txt', 'digest_prose.rules.mjs', 'fc4_capstone.mjs', 'fc4_dump.mjs',
  'fc4_fields.mjs', 'fc4_fields_capstone.mjs', 'fields.json', 'gate_capstone_leak.py',
  'gate_claims.mjs', 'gate_copy_rule.py', 'gate_movement.mjs', 'gate_typed_literals.py', 'gate_wavejson.mjs',
  'harvest_truth.py', 'lengths.py', 'make_fields.mjs', 'scaffold.py', 'structure.py',
  'sweep_literals.py', 'truth-gasprocessing.json', 'wave.json',
];
const MIRROR_ONLY = ['README.md'];

describe('the digest on disk, the in-repo mirror and the teaching fields', () => {
  it('the digest carries a plausible number of literals, so it is not empty or mid-rebuild', () => {
    const literals = readDigest().match(/-?\d+(?:\.\d+)?/g) || [];
    expect(literals.length, 'digest.txt is empty or mid-rebuild').toBeGreaterThan(1000);
    expect(Object.keys(sections(readDigest()))).toEqual(SECTION_KEYS);
  });

  it('THE MIRROR GATE: every mirrored file is byte-identical to the wave directory', () => {
    // BOTH DIRECTIONS OR NEITHER. Reading the wave directory alone leaves the
    // committed mirror unchecked; reading the mirror alone goes green on a
    // stale copy. So the wave file is read as truth, the mirror is compared
    // with it, and the mirror's own listing is compared with this list so a
    // file cannot be added to the mirror without being named here.
    expect(MIRRORED).toHaveLength(28);
    MIRRORED.forEach((f) => {
      const a = fs.readFileSync(path.join(WAVE, f), 'utf8');
      const b = fs.readFileSync(path.join(MIRROR, f), 'utf8');
      expect(b, `tools/course-waves/gasprocessing/${f} has fallen behind the wave directory`).toBe(a);
    });
    const onDisk = fs.readdirSync(MIRROR, { withFileTypes: true })
      .filter((e) => e.isFile()).map((e) => e.name).sort();
    expect(onDisk, 'the mirror carries a file this gate does not name')
      .toEqual([...MIRRORED, ...MIRROR_ONLY].sort());
  });

  it('NEGATIVE CONTROL: the mirror gate sees a one-byte drift', () => {
    const a = fs.readFileSync(path.join(WAVE, 'fields.json'), 'utf8');
    expect(a.replace('[', '[ ')).not.toBe(a);
    expect(fs.readFileSync(path.join(MIRROR, 'fields.json'), 'utf8')).toBe(a);
  });

  it('the teaching fields are copied verbatim from fc4_fields.mjs, which fc4_dump.mjs imports', () => {
    const src = fs.readFileSync(FIELDS_MJS, 'utf8');
    const dump = fs.readFileSync(DUMP_MJS, 'utf8');
    const lab = LAB_SOURCE();
    const NAMES = ['OBIAFU_LINE', 'OBIAFU', 'OBIAFU_CONTACTOR', 'OBIAFU_LEAN_SWEEP',
      'LEAN_AT_LOWER_EDGE', 'LEAN_JUST_INSIDE_LOWER', 'LEAN_JUST_UNDER_UPPER', 'LEAN_AT_UPPER_EDGE',
      'RATIO_THAT_FLOODS_THE_LOOP', 'OBIAFU_RATIO_SWEEP', 'RATIO_AT_LOWER_CUSTOM',
      'RATIO_JUST_UNDER_LOWER', 'RATIO_AT_UPPER_CUSTOM', 'RATIO_JUST_OVER_UPPER',
      'OBIAFU_SPEC_SWEEP', 'OBIAFU_RATE_SWEEP', 'SATURATION_P', 'SATURATION_T',
      'WARN_AT_THRESHOLD', 'WARN_JUST_OVER', 'FIT_LOW_EDGE_F', 'FIT_BELOW_LOW_EDGE_F',
      'FIT_HIGH_EDGE_F', 'FIT_ABOVE_HIGH_EDGE_F', 'FIT_PUBLISHED_LOW_EDGE_F',
      'FIT_PUBLISHED_HIGH_EDGE_F', 'FIT_PUBLISHED_JUST_OVER_F', 'GAS_ABOVE_FIT_F',
      'WATER_FREEZING_F', 'UBIE', 'UBIE_CONTACTOR', 'UBIE_AMINE_IDS', 'UBIE_RICH_SWEEP',
      'RICH_AT_MDEA_LIMIT', 'RICH_JUST_OVER_MDEA_LIMIT', 'UBIE_LEAN_SWEEP',
      'UBIE_SPEC_ALREADY_MET', 'UBIE_SPEC_ABOVE_INLET', 'KREMSER_FACTORS', 'KREMSER_STAGES',
      'OBIAFU_ABSORPTION_FACTOR', 'OBIAFU_STAGES', 'A_AT_UNITY', 'A_JUST_UNDER_UNITY',
      'A_JUST_OVER_UNITY', 'A_WELL_UNDER_UNITY', 'UNREACHABLE_SPEC', 'AGBADA', 'AGBADA_P_SWEEP',
      'AGBADA_CP_SWEEP', 'AGBADA_STEP_SWEEP', 'AGBADA_STEP_REFERENCE', 'AGBADA_STEPS_REFUSED',
      'SG_SUTTON_BREAKS', 'SG_SUTTON_LAST_PHYSICAL', 'AGBADA_DEEP_P2_PSIA', 'AGBADA_COLD_INLET_F',
      'AGBADA_COLD_P2_PSIA', 'LBMOL_PROBE', 'OVERHEAD_PROBE', 'MINUTES_PROBE', 'TONS_PROBE',
      'RHO_L_PROBE', 'AMINE_DENSITY_PROBE', 'REBOILER_GROUP_PROBE'];
    NAMES.forEach((name) => {
      const a = src.match(new RegExp(`^export const ${name} = ([\\s\\S]*?);$`, 'm'));
      const b = lab.match(new RegExp(`^export const ${name} = ([\\s\\S]*?);$`, 'm'));
      expect(a, `${name} in fc4_fields.mjs`).not.toBeNull();
      expect(b, `${name} in the lab`).not.toBeNull();
      expect(b[1], name).toBe(a[1]);
      expect(dump, `${name} is imported by the dump`).toContain(name);
    });
    expect(NAMES).toHaveLength(65);
  });

  it('the published golden is whole, every block of it', () => {
    const c = L.goldenCounts();
    expect(c.water).toBe(4);
    expect(c.kremser).toBe(5);
    expect(c.teg).toBe(3);
    expect(c.amine).toBe(3);
    expect(c.contactor).toBe(5);
    expect(c.blocks).toBe(9);
  });
});

// ---------------------------------------------------------------------------
// The rebuilt digest, section by section and then whole.
// ---------------------------------------------------------------------------

describe('THE DIGEST, REBUILT FROM LAB RETURN VALUES, BYTE FOR BYTE', () => {
  const titles = {
    preamble: 'the title, the units line and the vintage',
    S1: 'what this engine conditions, and the two teaching streams end to end',
    S2: 'the derived, the measured and the declared constants',
    S3: 'the saturation surface, the vapour pressure alone, and the published cases',
    S4: 'one refusal, two warnings, and both sides of every edge',
    S5: 'the water a unit takes out, against the spec and against the rate',
    S6: 'the circulation ratio, the lean strength, and the two bands',
    S7: 'the duty in its two named parts, the reflux and the still',
    S8: 'the TEG published cases, and the one column that is a mole balance',
    S9: 'the Kremser surface, the ceiling below unity, and the solve back',
    S10: 'the mole balance, the swing at both ends, and the published cases',
    S11: 'three amines at their own values, and two orderings that differ',
    S12: 'the contactor, its compressibility, and the two kinds of published case',
    S13: 'the still overhead, linear in both of its inputs',
    S14: 'the coefficient, the derivative, the march and the four-state water table',
    S15: 'every refusal, the whole contract, the evidence and both sides of every guard',
    S16: 'six held quantities, two absences, and one collecting export',
    S17: 'the independent routes, the molar signature and what a case can catch',
    S18: 'the Associate reading, one stream from the line to the still',
    S19: 'the Professional reading, one sour stream through two columns',
    S20: 'framed history: the four repairs, and the comment lines counted rather than quoted',
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
    if (process.env.FC4_WRITE_BUILT) {
      // The timezone gate's child hands its rebuild back through this file,
      // with the zone it actually ran in so the parent can prove it moved.
      fs.writeFileSync(process.env.FC4_WRITE_BUILT, JSON.stringify({
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        offsetMinutes: new Date('2026-09-16T00:00:00Z').getTimezoneOffset(),
        text,
      }));
    }
    expect(text.split('\n').length).toBe(readDigest().split('\n').length);
    expect(text).toBe(readDigest());
  });

  it('NEGATIVE CONTROL: one engine value moved by a single unit in the last printed place is a failed section', () => {
    const jt = L.coldEnd();
    const good = `and the coefficient is ${num(jt.muFPerPsi, 9)} degF per psi.`;
    const nudged = `and the coefficient is ${num(jt.muFPerPsi + 1e-9, 9)} degF per psi.`;
    const text = buildDigest();
    expect(text, 'the control line is not in the digest any more').toContain(good);
    const moved = text.replace(good, nudged);
    expect(sections(moved).S14).not.toBe(onDisk.S14);
    expect(sections(moved).S13).toBe(onDisk.S13);
    expect(sections(moved).S15).toBe(onDisk.S15);
  });
});

// ---------------------------------------------------------------------------
// What the teaching fields show: the results the course is built on.
// ---------------------------------------------------------------------------

describe('what the teaching fields show', () => {
  it('THE JT GATE: the coefficient is the derivative chain, and the digest prints every term of it', () => {
    const jt = L.coldEnd();
    // The four terms the relation is built from, all present and all finite.
    [jt.z, jt.ppr, jt.tpr, jt.dzdT, jt.muFPerPsi].forEach((v) => expect(Number.isFinite(v)).toBe(true));
    // The derivative is the only term carrying real-gas behaviour, and it
    // GROWS with pressure while the compressibility falls. Read off the sweep
    // rather than asserted of the physics.
    const answered = jt.pressureSweep.filter((r) => !r.refused);
    expect(answered).toHaveLength(6);
    for (let i = 1; i < answered.length; i += 1) {
      expect(answered[i].z, `z at ${answered[i].pPsia} psia`).toBeLessThan(answered[i - 1].z);
      expect(answered[i].dzdT, `dz/dT at ${answered[i].pPsia} psia`).toBeGreaterThan(answered[i - 1].dzdT);
    }
    // And the coefficient does NOT vanish as the pressure falls, which is the
    // reading the section turns on.
    expect(answered[0].pPsia).toBe(50);
    expect(answered[0].muFPerPsi).toBeGreaterThan(0.05);
    // The heat capacity enters exactly once and as a divisor: the product is
    // one number down the whole sweep.
    const products = new Set(jt.cpSweep.map((r) => r.cpTimesMuDerived.toFixed(12)));
    expect(products.size, 'Cp times mu moves down the table').toBe(1);
  });

  it('THE JT GATE: the march is measured against its own 20000-step answer, and 20 steps is worth four nines', () => {
    const jt = L.coldEnd();
    expect(L.AGBADA_STEP_REFERENCE).toBe(20000);
    expect(jt.steps).toBe(20);
    const byStep = Object.fromEntries(jt.stepSweep.map((r) => [r.steps, r]));
    expect(Object.keys(byStep).map(Number)).toEqual([1, 2, 5, 10, 20, 50, 200]);
    // Monotone towards the reference, and the default lands inside 1e-5 of it.
    for (let i = 1; i < jt.stepSweep.length; i += 1) {
      expect(jt.stepSweep[i].overReferenceDerived)
        .toBeGreaterThan(jt.stepSweep[i - 1].overReferenceDerived);
      expect(jt.stepSweep[i].overReferenceDerived).toBeLessThan(1);
    }
    expect(Math.abs(1 - byStep[20].overReferenceDerived)).toBeLessThan(1e-5);
    expect(Math.abs(1 - byStep[1].overReferenceDerived)).toBeGreaterThan(1e-3);
    // The twenty-step march IS the march the digest headlines.
    expect(byStep[20].dropF).toBe(jt.dropF);
    expect(byStep[20].t2F).toBe(jt.t2F);
  });

  it('THE JT GATE: three march coefficients, and the inlet measured against the mean', () => {
    const jt = L.coldEnd();
    // Three different numbers, in the order the march produces them: the
    // coefficient rises as the gas is let down, so the inlet is the smallest.
    expect(jt.muInletFPerPsi).toBeLessThan(jt.muMeanFPerPsi);
    expect(jt.muMeanFPerPsi).toBeLessThan(jt.muLastStepFPerPsi);
    expect(new Set([jt.muInletFPerPsi, jt.muMeanFPerPsi, jt.muLastStepFPerPsi]).size).toBe(3);
    // The inlet coefficient is the screening coefficient, to the last bit.
    expect(jt.muInletFPerPsi).toBe(jt.muFPerPsi);
    // The mean is the cooling over the pressure drop, measured rather than
    // taken on trust.
    expect(jt.muMeanFPerPsi)
      .toBeCloseTo(jt.dropF / (L.AGBADA.p1Psia - L.AGBADA.p2Psia), 12);
    // THE FIGURE THE PANEL HEADLINES, verified against the digest rather than
    // taken from a report: the inlet is this fraction of the mean, so quoting
    // the inlet beside the arrival overstates the slope the answer was built
    // from. FC3's lab named a count after the wrong thing and the number
    // happened to agree, so this is checked against the digest text itself.
    expect(num(jt.inletOverMeanDerived, 9)).toBe('0.916066108');
    expect(readDigest()).toContain(`The inlet coefficient is ${num(jt.inletOverMeanDerived, 9)} times the mean`);
    expect(jt.inletOverMeanDerived).toBeLessThan(1);
  });

  it('THE WATER TABLE: letting the gas down without cooling it lets it hold MORE water', () => {
    const jt = L.coldEnd();
    const rows = jt.fourStates;
    expect(rows).toHaveLength(4);
    expect(rows.map((r) => r.label)).toEqual([
      'at the inlet',
      'cooled, but still at inlet pressure',
      'let down, but not yet cooled',
      'at the cold separator',
    ]);
    rows.forEach((r) => expect(r.error, r.label).toBeNull());
    const [inlet, cooled, letDown, cold] = rows;
    // THE THIRD ROW IS THE POINT. The let-down alone WETS the gas.
    expect(letDown.lbPerMMscf).toBeGreaterThan(inlet.lbPerMMscf);
    // The cooling alone dries it, and harder than the let-down wets it.
    expect(cooled.lbPerMMscf).toBeLessThan(inlet.lbPerMMscf);
    expect(cold.lbPerMMscf).toBeLessThan(inlet.lbPerMMscf);
    expect(cold.lbPerMMscf).toBeGreaterThan(cooled.lbPerMMscf);
    // The two states either side of the cold separator are the same states the
    // headline numbers came from.
    expect(inlet.lbPerMMscf).toBe(jt.waterInLbMMscf);
    expect(cold.lbPerMMscf).toBe(jt.waterOutLbMMscf);
    expect(jt.dropOutLbMMscfDerived).toBeGreaterThan(0);
    expect(jt.heldFractionDerived).toBeLessThan(1);
  });

  it('A FLAG NEEDS A CONTROL ON THE FLAG: the ceiling is A against the removal, not A against one', () => {
    const { ceilingCases } = L.flagControls();
    expect(ceilingCases).toHaveLength(3);
    const refused = ceilingCases.map((c) => c.refused);
    expect(refused).toEqual([false, false, true]);
    // The lookalike predicate does NOT separate them: it is true for the
    // accepted 0.95 case and for the refused 0.8 case alike.
    expect(ceilingCases.map((c) => c.belowUnityPredicate)).toEqual([false, true, true]);
    // The engine's own predicate does.
    expect(ceilingCases.map((c) => c.ceilingPredicate)).toEqual(refused);
    // And the refusal hands back the ceiling it capped at.
    expect(ceilingCases[2].ceiling).toBe(ceilingCases[2].absorptionFactor);
    expect(ceilingCases[0].ceiling).toBeNull();
  });

  it('A FLAG NEEDS A CONTROL ON THE FLAG: a cold inlet kills the march, a deep outlet does not', () => {
    const { marchCases } = L.flagControls();
    expect(marchCases).toHaveLength(3);
    const refused = marchCases.map((c) => c.refused);
    expect(refused).toEqual([false, false, true]);
    // The lookalike predicate is true for the deepest let-down, which ANSWERS,
    // and false for the cold inlet, which is the one that dies.
    expect(marchCases.map((c) => c.deepOutletPredicate)).toEqual([false, true, false]);
    // The refusal says where it died, part way down rather than at the end.
    expect(marchCases[2].diedAtStep).toBeGreaterThan(0);
    expect(marchCases[2].diedAtStep).toBeLessThan(L.coldEnd().coldSteps);
    expect(marchCases[0].diedAtStep).toBeNull();
  });

  it('the constants are MEASURED out of the engine, and every measurement is its own export', () => {
    const c = L.moduleConstants();
    c.measuredRows.forEach(([label, exported, measured]) => {
      expect(measured / exported, label).toBeCloseTo(1, 12);
    });
    expect(c.measuredMinutes).toBeCloseTo(1440, 9);
    expect(c.measuredReboilerGroup).toBeCloseTo(24e6, 0);
    expect(c.glycolDensityRatioDerived).toBeCloseTo(1, 12);
    // The derived standard cubic feet is the gas constant chain and nothing else.
    expect(c.lbmolScfDerived).toBe(c.lbmolScf);
  });

  it('the golden splits into the routes that discriminate and the routes that do not', () => {
    const r = L.publishedCaseReach();
    // The independent routes do NOT agree exactly, which is the evidence that
    // they are independent.
    expect(r.waterWorstDerived).toBeGreaterThan(0);
    expect(r.kremserWorstDerived).toBeGreaterThan(0);
    // The molar signature is one number across every molar row, and the mass
    // rows carry none of it.
    const molar = r.molarRows.filter((x) => x.molar);
    const mass = r.molarRows.filter((x) => !x.molar);
    expect(molar.length).toBeGreaterThanOrEqual(8);
    expect(mass.length).toBeGreaterThanOrEqual(3);
    expect(r.molarSpreadDerived).toBeLessThan(1e-14);
    expect(r.massWorstDerived).toBeLessThan(1e-14);
    expect(r.signatureDerived).not.toBe(1);
    expect(Math.abs(r.signatureDerived - 1)).toBeGreaterThan(1e-9);
  });

  it('no reader reads the clock or a random number: the lab source makes no Date and draws nothing', () => {
    const code = LAB_SOURCE().replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    expect(code).not.toContain('Math.random');
    expect(code).not.toContain('Date');
  });
});

describe('every reader is pure and deterministic', () => {
  it('there is one reader per digest section', () => {
    expect(READERS).toHaveLength(20);
    expect(SECTION_KEYS.filter((k) => k !== 'preamble')).toHaveLength(20);
    READERS.forEach((name) => expect(typeof LAB[name], name).toBe('function'));
  });

  it('two calls agree, and mutating a result changes neither the next call nor the fields', () => {
    READERS.forEach((name) => {
      const a = LAB[name]();
      const b = LAB[name]();
      expect(JSON.stringify(b), name).toBe(JSON.stringify(a));
      if (a && typeof a === 'object') {
        a.mutatedByTheGate = 'no reader may be a shared object';
        expect(LAB[name]().mutatedByTheGate, name).toBeUndefined();
      }
    });
    // And the field literals the readers run on are unchanged by all of that.
    expect(L.OBIAFU.gasMMscfd).toBe(62);
    expect(L.UBIE.gasMMscfd).toBe(88);
    expect(L.AGBADA.p1Psia).toBe(1180);
  });
});

// ---------------------------------------------------------------------------
// THE REFUSAL GATE. Every refusal a panel can show is the engine's own message,
// never written as a literal anywhere in the lab or in a panel.
// ---------------------------------------------------------------------------

describe('THE REFUSAL GATE: every refusal is the engine\'s own returned message', () => {
  const allSoft = () => {
    const s4 = L.honestBand();
    const s6 = L.circulationChoice();
    const s9 = L.stagedDevice();
    const s10 = L.acidGasByMoles();
    const s11 = L.threeAmines();
    const s14 = L.coldEnd();
    const s15 = L.refusalContract();
    return [
      ...s15.refusals,
      ...s4.otherRefusals,
      ...s4.fitLimit.map((r) => ({ label: `the water fit at ${r.tF} degF`, error: r.error })),
      { label: 'the studio temperature box', error: s4.studioRefusal },
      ...s6.strengthBand.map((r) => ({ label: `the lean strength at ${r.leanTegWtPct}`, error: r.error })),
      ...s9.solvedBack.map((r) => ({ label: `the stages for ${r.fractionRemoved} at A ${r.absorptionFactor}`, error: r.error })),
      { label: 'a starved absorber', error: s9.starvedRefusal },
      ...s10.lookalikeRefusals,
      { label: 'the swing vanishing', error: s10.swingVanishesRefusal },
      { label: 'an amine the table does not carry', error: s11.unknownAmineRefusal },
      ...s14.stepRefusals.map((r) => ({ label: `a march of ${r.steps} steps`, error: r.error })),
      { label: 'a let-down backwards', error: s14.backwardsRefusal },
      { label: 'a let-down of nothing', error: s14.equalPressureRefusal },
      ...s14.deeperLetDown.map((r) => ({ label: `a let-down to ${r.p2Psia} psia`, error: r.error })),
      { label: 'a cold inlet march', error: s14.coldInletRefusal },
      ...s14.gravityEdge.map((r) => ({ label: `a gravity of ${r.gasSg}`, error: r.error })),
      ...s14.fourStates.map((r) => ({ label: `the water ${r.label}`, error: r.error })),
      ...s15.kremserContract.map((r) => ({ label: `kremser at A ${r.absorptionFactor}`, error: r.error })),
    ].filter((r) => r.error !== null);
  };

  it('there are refusals to check, so a rename cannot silently empty this gate', () => {
    expect(L.REFUSAL_PROBES).toHaveLength(33);
    expect(L.BOUNDARY_PROBES).toHaveLength(14);
    expect(L.EVIDENCE_PROBES).toHaveLength(4);
    expect(L.KREMSER_CONTRACT_CALLS).toHaveLength(5);
    expect(L.CONTRACT_PROBES).toHaveLength(10);
    expect(allSoft().length).toBeGreaterThanOrEqual(45);
  });

  it('every refusal carries a message, and the count of DISTINCT MESSAGES is measured rather than quoted', () => {
    const rows = allSoft();
    rows.forEach((r) => {
      expect(typeof r.error, r.label).toBe('string');
      expect(r.error.length, `${r.label} carries no message`).toBeGreaterThan(10);
    });
    const distinct = new Set(rows.map((r) => r.error));
    // NAMED FOR WHAT IT COUNTS: this is the number of DISTINCT MESSAGE STRINGS
    // across the refusals the panels can reach, which is smaller than the
    // number of refusals because one guard reached from two sides returns two
    // messages that differ only in the value they quote, and several guards are
    // shared between exports.
    // eslint-disable-next-line no-console
    console.log(`refusal gate: ${rows.length} refusals carrying ${distinct.size} distinct engine messages`);
    expect(distinct.size).toBeGreaterThanOrEqual(30);
    expect(distinct.size).toBeLessThanOrEqual(rows.length);
  });

  it('NOTHING IN THIS MODULE THROWS: every probe returns rather than raising', () => {
    [...L.REFUSAL_PROBES, ...L.EVIDENCE_PROBES].forEach(([label, fn]) => {
      expect(() => fn(), `${label} threw instead of returning`).not.toThrow();
    });
    L.BOUNDARY_PROBES.forEach(([label, , fn]) => {
      expect(() => fn(), `${label} threw instead of returning`).not.toThrow();
    });
    L.CONTRACT_PROBES.forEach(([name, ok, bad]) => {
      expect(() => ok(), `${name} accepted`).not.toThrow();
      expect(() => bad(), `${name} refused`).not.toThrow();
    });
  });

  it('THE CONTRACT, MEASURED: every answering export returns an object on both sides, and the count of bare-number answers is zero', () => {
    // FC4-0 put kremserFractionRemoved inside the contract, so the contract is
    // whole and this gate pins it AS IT IS. The measurement is `typeof`, not a
    // list of which exports are objects, because a list goes stale silently.
    const bareNumberAnswers = L.CONTRACT_PROBES.filter(([, ok, bad]) => typeof ok() === 'number' || typeof bad() === 'number');
    expect(bareNumberAnswers.map(([n]) => n), 'an answering export returns a bare number').toEqual([]);
    L.CONTRACT_PROBES.forEach(([name, ok, bad]) => {
      expect(typeof ok(), `${name} accepted`).toBe('object');
      // amineOf is the one catalogue lookup and says it does not know by
      // returning null, which is an object type and no error key.
      const refused = bad();
      expect(typeof refused, `${name} refused`).toBe('object');
      if (refused !== null) {
        expect(typeof refused.error, `${name} refused with no message`).toBe('string');
      }
    });
    // kremserFractionRemoved, specifically, on both branches.
    const k = L.refusalContract().kremserContract;
    expect(k.filter((r) => r.error === null)).toHaveLength(1);
    expect(k.filter((r) => r.error !== null)).toHaveLength(4);
    expect(k.find((r) => r.error === null).fractionRemoved).toBeGreaterThan(0.9);
  });

  it('THE ONE BARE NUMBER is the vapour-pressure helper, and it is measured rather than assumed', () => {
    const v = L.vapourPressureHelper();
    expect(v.returnsBareNumber).toBe(true);
    expect(Number.isFinite(v.insideBandPsia)).toBe(true);
    expect(Number.isFinite(v.atLowerEdgePsia)).toBe(true);
    expect(Number.isFinite(v.atUpperEdgePsia)).toBe(true);
    // Outside its band it is NaN, which a panel guards with Number.isFinite
    // rather than with an error key. The saturation answer that wraps it does
    // carry the key, and the digest reads that one.
    expect(Number.isNaN(v.belowBand)).toBe(true);
    expect(Number.isNaN(v.aboveBand)).toBe(true);
    expect(L.honestBand().fitLimit.filter((r) => r.error !== null)).toHaveLength(2);
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
        const p = path.join(HERE, file);
        if (!fs.existsSync(p)) return;
        expect(fs.readFileSync(p, 'utf8').includes(r.error), `${file} retypes: ${r.label}`).toBe(false);
      });
    });
  });

  it('CONTROL: calling the engine directly gives the same message the reader reports', () => {
    const reported = L.refusalContract().refusals;
    L.REFUSAL_PROBES.forEach(([label, fn], i) => {
      const direct = fn();
      expect(direct && direct.error ? direct.error : null, label).toBe(reported[i].error);
      expect(reported[i].label, `probe ${i}`).toBe(label);
    });
  });

  it('CONTROL: a probe that is accepted reports no error, so the gate is not reading every call as a refusal', () => {
    const answered = L.honestBand().fitLimit.filter((r) => r.error === null);
    expect(answered).toHaveLength(2);
    answered.forEach((r) => expect(Number.isFinite(r.lbPerMMscf)).toBe(true));
    expect(L.refusalContract().refusals.every((r) => r.error !== null)).toBe(true);
    expect(L.refusalContract().boundaries.filter((b) => !b.refused).length).toBeGreaterThan(0);
  });

  it('a refusal carries EVIDENCE beside the message, and the field counts are measured', () => {
    const rows = L.refusalContract().evidence;
    expect(rows).toHaveLength(4);
    rows.forEach((row) => {
      expect(row.fieldCount, row.label).toBeGreaterThan(0);
      expect(row.fields, row.label).toHaveLength(row.fieldCount);
      expect(row.fields, row.label).not.toContain('error');
    });
    // The ceiling, the reduced state and the two densities are the evidence a
    // panel is entitled to show beside the message.
    expect(rows[0].fields).toContain('ceiling');
    expect(rows[2].fields).toEqual(expect.arrayContaining(['ppr', 'tpr', 'atPsia', 'atF']));
    expect(rows[3].fields).toEqual(expect.arrayContaining(['rhoG', 'rhoLLbFt3']));
  });
});

// ---------------------------------------------------------------------------
// THE HELD GATE. Six quantities held, two capabilities absent, and eight things
// in all taught as limits and never as answers.
// ---------------------------------------------------------------------------

describe('THE HELD GATE: the held quantities are marked, shown and never graded', () => {
  it('there are six held and two absent, counted and NAMED FOR WHAT THEY ARE', () => {
    // The digest says SIX things are taught as limits and then names TWO
    // ABSENCES. They are two different kinds of thing, so the lab keeps them
    // apart and the gate counts each rather than reporting one total under the
    // other's name.
    expect(L.HELD_ITEMS).toHaveLength(6);
    expect(L.ABSENT_CAPABILITIES).toHaveLength(2);
    expect(L.heldItems().heldCount).toBe(6);
    expect(L.heldItems().absenceCount).toBe(2);
    expect(L.heldItems().limitsTaughtNeverAnswered).toBe(8);
    expect(L.HELD_ITEMS.map((h) => h.id)).toEqual([
      'mcketta-real-gas-correction', 'water-overhead-btu-per-lb', 'glycol-density',
      'water-density-amine-gallons', 'amine-property-set', 'btex-fraction-and-mw',
    ]);
    L.HELD_ITEMS.forEach((h) => {
      expect(h.note, h.id).toContain(L.HELD_MARKER);
      expect(h.note, h.id).toMatch(/never as an answer/);
      expect(Number.isInteger(h.section), h.id).toBe(true);
    });
    L.ABSENT_CAPABILITIES.forEach((a) => {
      expect(a.note, a.id).not.toContain(L.HELD_MARKER);
      expect(Number.isInteger(a.section), a.id).toBe(true);
    });
  });

  it('the digest marks them the same way, and says how many of each', () => {
    const text = readDigest();
    expect(text).toContain('Six things this course teaches as limits and never as answers');
    expect(text).toContain('HELD FOR LITERATURE');
    expect(text).toContain('two things that are not held but simply ABSENT');
    expect((text.match(/DECLARED/g) || []).length).toBeGreaterThanOrEqual(5);
  });

  it('each panel shows the wording that marks a held quantity unverified', () => {
    PANEL_FILES.forEach((file) => {
      const p = path.join(HERE, file);
      if (!fs.existsSync(p)) return;
      const text = fs.readFileSync(p, 'utf8');
      expect(text, `${file} does not carry the held marker`).toContain(L.HELD_MARKER);
    });
  });

  it('NO graded capstone field reads a held quantity, and the neutralisations hold AT THIS ENGINE', () => {
    const capstoneSrc = fs.readFileSync(CAPSTONE_MJS, 'utf8');
    const r = L.capstoneRuns();
    // The McKetta correction is held, so every graded water content sits BELOW
    // the pressure the engine warns at. Asserted on the RETURNED WARNING rather
    // than on the pressure, because the threshold is the engine's to move.
    expect(r.ikSat.warning, 'the Associate inlet water content carries a chart warning').toBeNull();
    expect(r.esWaterIn.warning, 'the Expert inlet water content carries a chart warning').toBeNull();
    expect(r.esWaterOut.warning, 'the Expert cold water content carries a chart warning').toBeNull();
    // The water overhead is held, so NO Associate graded field is a reboiler
    // duty: the SENSIBLE half is what is graded.
    const keys = L.capstoneFields().filter(([t]) => t === 'beginner').map(([, k]) => k);
    expect(keys).toContain('sensiblePerGal');
    expect(keys).not.toContain('reboilerMMBtuHr');
    expect(keys).not.toContain('dutyBtuPerGal');
    expect(keys).not.toContain('vaporPerGal');
    // The contactor liquid is held and is the wrong fluid for an amine, so no
    // graded field anywhere is a contactor diameter, and the generator never
    // calls the export.
    expect(L.capstoneFields().map(([, k]) => k)).not.toContain('diameterFt');
    expect(capstoneSrc).not.toContain('contactorDiameter');
    expect(LAB_SOURCE().split('THE CAPSTONE. IKOT ABASI, OTUMARA AND ESCRAVOS ONLY')[1])
      .not.toContain('contactorDiameter');
    // The amine duty per gallon is customary, so the Professional stream states
    // its own rather than taking the table default.
    expect(L.OTUMARA.dutyBtuPerGal).toBe(920);
    // The BTEX fraction and molecular weight are operating values and are
    // stated on the capstone that grades a BTEX figure.
    expect(L.IKOT_ABASI.btexAbsorbedFrac).toBeDefined();
    expect(L.IKOT_ABASI.btexMw).toBeDefined();
    // Every graded field answered rather than refusing.
    L.capstoneFields().forEach(([tier, key, v]) => {
      expect(Number.isFinite(v), `${tier}/${key} is not a finite answer`).toBe(true);
    });
    [r.ikSat, r.ikPack, r.otFrac, r.otStages, r.otAmine, r.otRetuned, r.esMu, r.esDrop,
      r.esWaterIn, r.esWaterOut].forEach((x, i) => expect(x.error, `capstone call ${i}`).toBeUndefined());
  });
});

// ---------------------------------------------------------------------------
// THE CLOCK GATE.
// ---------------------------------------------------------------------------

describe('THE CLOCK GATE: no reader reads the system date', () => {
  afterEach(() => { vi.useRealTimers(); });

  const snapshot = () => JSON.stringify(READERS.map((name) => [name, LAB[name]()])
    .concat([['capstoneFields', L.capstoneFields()], ['flagControls', L.flagControls()]]));

  it('identical output under two faked system dates, one long before FC4 and one far after', () => {
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

  it('CONTROL: there is no dated or seeded surface to fake, and the stripper carries its own control', () => {
    // Comments are stripped first: the gate is about the CODE, and a comment
    // explaining that nothing falls back to today is not a clock surface. FC1
    // learned this the hard way, and a numeric sweep cannot see prose.
    const code = LAB_SOURCE().replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    expect(code.length).toBeGreaterThan(5000);
    ['asOf', 'today', 'seed', 'Math.random', 'Date'].forEach((needle) => {
      expect(code, `${needle} appears in the lab's code`).not.toContain(needle);
    });
    // CONTROL ON THE STRIPPER: it really does remove comment prose, and it
    // really does keep code. Without this the gate could be passing because the
    // stripper deleted the whole file.
    const sample = '// a comment mentioning Date and Math.random\n/* and a block one about today */\nconst x = 1;\n';
    const stripped = sample.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    expect(stripped).not.toContain('Math.random');
    expect(stripped).not.toContain('today');
    expect(stripped).toContain('const x = 1;');
    // And the lab's own comments DO mention a clock, which is why the stripper
    // is here at all.
    expect(LAB_SOURCE()).toContain('THE CLOCK.');
  });
});

// ---------------------------------------------------------------------------
// THE TIMEZONE GATE. The whole rebuild, a second time, west of Greenwich.
// ---------------------------------------------------------------------------

const TZ_CHILD_TZ = 'America/Los_Angeles';

describe('THE TIMEZONE GATE: the digest rebuilds byte for byte west of Greenwich', () => {
  it(`the whole rebuild under TZ=${TZ_CHILD_TZ} is the digest, byte for byte`, () => {
    if (process.env.FC4_TZ_CHILD) return; // the child does not re-spawn itself
    const sidecar = path.join(ROOT, 'node_modules', '.fc4-tz-rebuild.json');
    if (fs.existsSync(sidecar)) fs.unlinkSync(sidecar);
    execFileSync(path.join(ROOT, 'node_modules/.bin/vitest'), ['run', '--reporter=dot', '--config', 'vitest.config.js', 'src/components/course/panels/gasprocessing/gasprocessingLab.test.js'], {
      cwd: ROOT,
      env: {
        ...process.env, TZ: TZ_CHILD_TZ, FC4_TZ_CHILD: '1', FC4_WRITE_BUILT: sidecar,
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

describe('the IKOT ABASI, OTUMARA and ESCRAVOS capstone reproduces fields.json exactly', () => {
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
    expect(L.capstoneValues()).toEqual(
      Object.fromEntries(CAPSTONE_FIELDS.map(([, k, v]) => [k, v])),
    );
  });

  it('THE LAB HOLDS NO TOLERANCE: fields.json is the one place a grading band lives', () => {
    // A tolerance in three places that must agree is how a sibling wave shipped
    // a stale one. The lab's rows are triples, so there is nothing here to go
    // stale when the tolerance rule moves, and the published bands are checked
    // for SHAPE rather than restated.
    L.capstoneFields().forEach((row, i) => {
      expect(row, `field ${i} carries a tolerance`).toHaveLength(3);
    });
    expect(Object.keys(L).filter((k) => /tolerance/i.test(k)), 'the lab exports a tolerance')
      .toEqual([]);
    expect(LAB_SOURCE()).toContain('THIS LAB HOLDS NO GRADING TOLERANCE');
    CAPSTONE_FIELDS.forEach(([tier, key, , tol]) => {
      expect(Number.isFinite(tol), `${tier}/${key} tolerance`).toBe(true);
      expect(tol, `${tier}/${key} tolerance`).toBeGreaterThan(0);
    });
  });

  it('the capstone conditions are copied verbatim from fc4_fields_capstone.mjs', () => {
    const src = fs.readFileSync(CAPSTONE_MJS, 'utf8');
    const lab = LAB_SOURCE();
    const NAMES = ['IKOT_ABASI_LINE', 'OTUMARA_ABSORBER', 'OTUMARA_REQUIRED_REMOVAL',
      'OTUMARA_RETUNED_LEAN_LOADING', 'ESCRAVOS'];
    NAMES.forEach((name) => {
      const a = src.match(new RegExp(`^export const ${name} = ([\\s\\S]*?);$`, 'm'));
      const b = lab.match(new RegExp(`^export const ${name} = ([\\s\\S]*?);$`, 'm'));
      expect(a, `${name} in fc4_fields_capstone.mjs`).not.toBeNull();
      expect(b, `${name} in the lab`).not.toBeNull();
      expect(b[1], name).toBe(a[1]);
    });
    // IKOT_ABASI and OTUMARA carry explanatory comments inside the literal in
    // the wave file, so they are compared field by field rather than as text.
    [['IKOT_ABASI', L.IKOT_ABASI, 12], ['OTUMARA', L.OTUMARA, 10]].forEach(([name, obj, n]) => {
      const body = src.match(new RegExp(`^export const ${name} = \\{([\\s\\S]*?)\\n\\};$`, 'm'))[1];
      Object.entries(obj).forEach(([k, v]) => {
        expect(body, `${name}.${k}`).toMatch(new RegExp(`${k}: '?${String(v).replace('.', '\\.')}'?`));
      });
      expect(Object.keys(obj), name).toHaveLength(n);
    });
    // The declared stable set is the generator's, word for word.
    expect(src.includes('fc4_capstone')).toBe(false);
    const gen = fs.readFileSync(path.join(WAVE, 'fc4_capstone.mjs'), 'utf8');
    L.CAPSTONE_STABLE.forEach((row) => expect(gen, row).toContain(`'${row}'`));
    expect(L.CAPSTONE_STABLE).toHaveLength(4);
  });

  it('the capstone never touches the teaching digest, and the digest never names a capstone stream', () => {
    const digest = readDigest().toLowerCase();
    ['ikot', 'otumara', 'escravos'].forEach((name) => expect(digest).not.toContain(name));
    const dump = fs.readFileSync(DUMP_MJS, 'utf8');
    ['ikot', 'otumara', 'escravos'].forEach((name) => expect(dump.toLowerCase()).not.toContain(name));
    expect(dump).not.toMatch(/readFileSync\([^)]*fields\.json/);
    expect(dump).not.toContain('fc4_fields_capstone');
  });
});

// ---------------------------------------------------------------------------
// THE LEAK GATE: no teaching number may be a graded capstone answer.
// ---------------------------------------------------------------------------

/** Exports that TAKE AN ARGUMENT. */
const ARG_REQUIRED = ['leakGuardTargets', 'leakGuardHit', 'collectNumbers',
  'capstoneValues', 'countHistoryComments', 'countHistoryCommentsWide'];
const GATE_MACHINERY = ['LEAK_GUARD_MARGIN', 'LEAK_GUARD_SCALINGS', 'LEAK_GUARD_RELATIVE_CAP',
  'HISTORY_COMMENT_RE', 'HISTORY_COMMENT_RE_WIDE'];

/**
 * A surface smaller than this is not the lab: refuse to call it clean. The
 * floors are MEASURED from the real surface and set below it by less than any
 * one large reader, so losing a reader to a rename trips them.
 */
const MIN_SURFACE_ENTRIES = 60;
const MIN_SURFACE_NUMBERS = 1500;

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
    // Derived from the published bands rather than restated, so a tolerance
    // that moves in fields.json moves here with it.
    const published = Object.fromEntries(CAPSTONE_FIELDS.map(([, k, , tol]) => [k, tol]));
    targets.forEach((x) => {
      // Never narrower than the band the grader itself accepts.
      expect(x.band, `${x.key} ${x.tag}`).toBeGreaterThanOrEqual(x.gradingBand);
      // Never wider than the cushion, and never wider than one part in ten
      // thousand of the answer unless the grader's own band is wider.
      expect(x.band, `${x.key} ${x.tag}`).toBeLessThanOrEqual(L.LEAK_GUARD_MARGIN * x.gradingBand);
      const cap = L.LEAK_GUARD_RELATIVE_CAP * Math.abs(x.value);
      expect(x.band <= Math.max(cap, x.gradingBand) + 1e-18, `${x.key} ${x.tag} band ${x.band} against cap ${cap}`).toBe(true);
    });
    // A wide absolute band is left alone: the water load's cushion is the full
    // ten times its published tolerance.
    expect(t('waterLbDay', 'as graded').band).toBeCloseTo(10 * published.waterLbDay, 15);
    // A band that would have outgrown the answer is capped back to the
    // grader's own, which is what stops a coincidence of scale reading as a
    // leak.
    expect(t('dzdT', 'x1000').band).toBeCloseTo(t('dzdT', 'x1000').gradingBand, 15);
    expect(t('dzdT', 'x1000').band).toBeLessThan(10 * t('dzdT', 'x1000').gradingBand);
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

  it('the teaching surface names no capstone export and no capstone stream, and carries no em dash or en dash', () => {
    const text = JSON.stringify(teachingSurface());
    L.CAPSTONE_ONLY_EXPORTS.forEach((name) => {
      if (name === 'CAPSTONE_ONLY_EXPORTS') return;
      expect(text, `${name} appears in the teaching surface`).not.toContain(name);
    });
    ['ikot', 'otumara', 'escravos'].forEach((x) => expect(text.toLowerCase()).not.toContain(x));
    expect(text).not.toMatch(/[–—]/);
  });

  it('THE GUARD IS LIVE: every graded answer, planted, is caught in every shifting, however deep', () => {
    CAPSTONE_FIELDS.forEach(([, key, v]) => {
      // The drift is 0.9 of the target's OWN band rather than 0.9 of the
      // uncapped cushion, so a capped target is still planted inside its guard.
      const bandOf = (tag) => targets.find((x) => x.key === key && x.tag === tag).band;
      [[1, 'as graded'], [1000, 'x1000'], [0.001, 'x0.001']].forEach(([factor, tag]) => {
        const drift = 0.9 * bandOf(tag);
        [0, drift, -drift].forEach((d) => {
          expect(L.leakGuardHit(v * factor + d, targets), `${key} ${tag} ${d}`).not.toBeNull();
        });
      });
      const buried = L.collectNumbers({ a: [{ b: v }] })[0].value;
      expect(targets.filter((t) => Math.abs(buried - t.value) < t.band).map((t) => t.key), key).toContain(key);
    });
  });

  it('THE GUARD GOES RED ON A PLANTED LEAK in a real reader\'s output, and is clean again without it', () => {
    // A GATE THAT HAS NEVER FAILED IS NOT A GATE. This plants one graded answer
    // into the water content the Associate panel headlines, shows the sweep go
    // red naming the probe by its path, and shows the same surface clean once
    // the plant is removed. The plant lives here permanently so the gate stays
    // proven on every run rather than on the day somebody tried it once.
    const surface = teachingSurface();
    const graded = CAPSTONE_FIELDS.find((x) => x[1] === 'waterLbDay')[2];
    const planted = surface.map((s) => (s.name === 'waterToTakeOut'
      ? { ...s, value: { ...s.value, waterLbDay: graded + 0.004 } }
      : s));
    const hits = leakHits(planted, targets);
    expect(hits).toHaveLength(1);
    expect(hits[0]).toMatch(/^waterToTakeOut\.waterLbDay = .* of waterLbDay as graded/);
    expect(leakHits(surface, targets)).toEqual([]);
  });

  it('THE GUARD IS NOT TRIGGER HAPPY: the teaching headlines pass', () => {
    const w = L.waterToTakeOut();
    const a = L.acidGasByMoles();
    const c = L.coldEnd();
    expect(L.leakGuardHit(w.waterLbDay, targets)).toBeNull();
    expect(L.leakGuardHit(w.inletLbMMscf, targets)).toBeNull();
    expect(L.leakGuardHit(a.circGpm, targets)).toBeNull();
    expect(L.leakGuardHit(c.muFPerPsi, targets)).toBeNull();
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
    // A substring search over a page of six decimal figures is meaningless: the
    // digits 12 sit inside 1250.542488. So the digest's own literals are parsed
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
      const p = path.join(HERE, file);
      if (!fs.existsSync(p)) return;
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
    const flat = comments.replace(/\n\s*\*/g, ' ').replace(/\n\s*\/\//g, ' ').replace(/\s+/g, ' ');
    expect(comments.length).toBeGreaterThan(3000);
    // Owner copy rule, applied to the lab's own prose as well as to the panels.
    expect(comments, 'the lab carries an em dash or an en dash').not.toMatch(/[–—]/);
    // THE CLAIMS THE COMMENTS ACTUALLY MAKE, each checked against the code.
    // The held counts, which the comments state in words.
    expect(L.HELD_ITEMS).toHaveLength(6);
    expect(L.ABSENT_CAPABILITIES).toHaveLength(2);
    expect(flat).toContain('SIX of these and then names TWO ABSENCES');
    expect(flat).toContain('eight things in all');
    expect(flat).not.toMatch(/\beight held\b/);
    // The reader count, which the section header states.
    expect(flat).toContain('THE TWENTY READERS');
    expect(READERS).toHaveLength(20);
    // The contract, which FC4-0 made whole. No comment may still say one export
    // returns a bare number answer.
    expect(flat).toContain('returns an object like every other export');
    expect(flat).not.toMatch(/bare number, so a non-positive/);
    // The comments name the engines the lab actually imports.
    ['gasProcessing.js', 'gasProperties.js'].forEach((m) => expect(flat).toContain(m));
    // And the vintage they are vendored at, which is the one the wave states.
    expect(flat).toContain('82ec6d4');
    expect(fs.readFileSync(path.join(WAVE, 'wave.json'), 'utf8')).toContain('82ec6d4');
    // The three capstone streams, named in the capstone banner and nowhere else
    // in the teaching half.
    expect(flat).toContain('IKOT ABASI, OTUMARA AND ESCRAVOS ONLY');
    // No P label anywhere: nothing in this course is a distribution.
    expect(src).not.toMatch(/\bP10\b|\bP50\b|\bP90\b/);
  });

  it('the comment that frames the history reader is the only place the lab claims history', () => {
    const src = LAB_SOURCE();
    // Comment prose is wrapped, so it is unwrapped before any phrase is looked
    // for: a sweep that only sees single lines misses every claim that runs
    // over a line break, which is most of them.
    const flat = src.replace(/\n\s*\*/g, ' ').replace(/\n\s*\/\//g, ' ').replace(/\s+/g, ' ');
    // Section 20 is framed history and the lab's reader for it says so. Every
    // other reader describes what the engine does NOW, so a past-tense claim
    // about the engine outside the history reader is the defect this sweeps
    // for.
    expect(flat).toContain('FRAMED HISTORY, and the only reader in this lab whose subject is what the engine USED TO DO');
    expect(flat).toContain('Nothing else in this lab is history.');
    const beforeHistory = flat.split('THE RULE Section 20 counts')[0];
    ['used to divide', 'was range checked', 'the engine used to', 'it used to return']
      .forEach((phrase) => expect(beforeHistory, `an unframed history claim: ${phrase}`).not.toContain(phrase));
  });

  it('every panel source is swept the same way, and no panel imports an engine or reads a clock', () => {
    expect(PANEL_FILES.filter((f) => fs.existsSync(path.join(HERE, f))), 'the panels are missing')
      .toHaveLength(3);
    PANEL_FILES.forEach((file) => {
      const p = path.join(HERE, file);
      const text = fs.readFileSync(p, 'utf8');
      expect(text.length, file).toBeGreaterThan(2000);
      expect(text, `${file} carries an em dash or an en dash`).not.toMatch(/[–—]/);
      expect(text, `${file} carries a percentile label`).not.toMatch(/\bP10\b|\bP50\b|\bP90\b/);
      // NO PANEL IMPORTS AN ENGINE DIRECTLY: every number it shows comes
      // through the lab, which comes through the vendored engine.
      expect(text, `${file} imports an engine directly`).not.toMatch(/@petrolord\/engines/);
      // NO PANEL READS A CLOCK.
      expect(text, `${file} reads a clock`).not.toMatch(/new Date\(|Date\.now|Math\.random/);
      // And a panel renders its empty state before any engine value exists.
      expect(text, `${file} has no empty-state guard`).toMatch(/if \(!/);
    });
  });
});
