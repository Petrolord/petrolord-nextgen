// THIS SCRIPT RUNS THE PUBLISHED GOLDEN CASES of linehydraulics_cases.json
// (plus sweeps around those published inputs) and the TEACHING FIELDS this
// wave designed for itself: the OGBIA crude export line, the SOKU gas trunk
// and the OGBIA pigging duty. THE FC2 CAPSTONE RUNS DIFFERENT LINES
// ENTIRELY: nothing here imports, reads or reproduces the capstone
// generator, the graded answer file, or any capstone line, bore, rate,
// length, pressure, wall, holdup or speed. The lab greps this source for the
// capstone names and for the graded answer file's name, so none of them is
// spelled out here.
//
// Usage:  sh /root/fc-wip-linesizing/build_digest.sh > digest.tmp \
//           && mv digest.tmp /root/fc-wip-linesizing/digest.txt
//
// Engines, vendored at engines main 709172f:
// engines/facilities/lineHydraulics.js, over
// engines/production/chokePerformance.js for the API RP 14E erosional limit
// and engines/production/pipeSchedule.js for the bores, the roughness
// catalogue and the fitting resistances.
//
// EVERY NUMBER PRINTED HERE IS A RETURN VALUE OF THE ENGINE, except where a
// line says "golden" (read from a published case's expected block) or
// "derived" (arithmetic on engine values printed on the same row or in the
// same block, with the arithmetic stated). Where the engine keeps a constant
// to itself, the constant is MEASURED by asking the engine a question about
// itself rather than typed. Nothing here reads a clock, a random number or a
// network.

import fs from 'fs';
import {
  OGBIA, OGBIA_FITTINGS, OGBIA_SWEEP_MAX_V_FT_S, OGBIA_ROUGHNESS_IDS,
  OGBIA_PROFILE, OGBIA_PROFILE_FLAT, OGBIA_P1_PSIA,
  OGBIA_VISCOSITY_SWEEP_CP, OGBIA_REGIME_PROBE_RE,
  SOKU, SOKU_UP_FT, SOKU_DOWN_FT, SOKU_STEEP_DOWN_FT, SOKU_STEEP_DOWN_P2_PSIA,
  SOKU_STEEP_DOWN_ABOVE_INLET_PSI,
  SOKU_EFFICIENCY_SWEEP, SOKU_TARGET_SCFD,
  SOKU_NEARLY_DEAD_P2_PSIA, SOKU_DEAD_P2_PSIA,
  SOKU_WALL, SOKU_WALL_CLASSES, SOKU_JOINT_FACTORS, SOKU_TEMP_DERATES,
  SOKU_WALL_AS_BUILT_IN,
  OGBIA_PIG, OGBIA_HOLDUP_SWEEP, OGBIA_HOLDUP_NOMINAL,
  OGBIA_CATCHER_BBL, OGBIA_DROPOUT_BPD, OGBIA_SMALL_CATCHER_BBL,
  EROSIONAL_C_IDS, EROSIONAL_UNKNOWN_ID, EROSIONAL_DENSITY_SWEEP,
  OGBIA_MANIFOLD_LENGTH_FT, OGBIA_ELEVATION_SWEEP_FT, OGBIA_DEAD_LINE,
  RE_JUST_BELOW_BRANCH, RE_AT_BRANCH,
  RELATIVE_ROUGHNESS_SWEEP, RE_LOW_FOR_ROUGHNESS_TABLE, RE_HIGH_FOR_ROUGHNESS_TABLE,
  COLEBROOK_DOMAIN_SWEEP, RE_FOR_DOMAIN_SWEEP,
  SCHEDULE_PAIR_NPS, SOKU_BORE_SWEEP, GOLDEN_PIG_SPEED_FT_S,
} from '/root/fc-wip-linesizing/fc2_fields.mjs';

const ROOT = process.env.FC2_ENGINES || '/root/wt-fc2-nextgen/packages/engines';
const H = await import(`${ROOT}/engines/facilities/lineHydraulics.js`);
const C = await import(`${ROOT}/engines/production/chokePerformance.js`);
const P = await import(`${ROOT}/engines/production/pipeSchedule.js`);
const G = JSON.parse(fs.readFileSync(`${ROOT}/test-data/facilities/goldens/linehydraulics_cases.json`, 'utf8'));

const out = [];
const w = (s = '') => out.push(s);
const num = (x, n) => (x === null || x === undefined || Number.isNaN(Number(x)) ? 'null' : Number(x).toFixed(n));
const e6 = (x) => num(x, 6);    // ft/s, psi, inches, ratios, friction factors
const r4 = (x) => num(x, 4);    // scfd, Reynolds numbers, barrels, hours, days
const raw = (x) => (Number.isFinite(x) ? String(x) : String(x));
const soft = (r) => (r && r.error ? `{ error: "${r.error}" }` : 'no error');
/** What a caller actually gets back when the engine neither refuses nor
 *  answers: the whole return, so the SHAPE is on the page and not only the
 *  number. */
const shape = (r) => JSON.stringify(r);

/* ------------------------------------------------------------------ *
 * The chain the Pipeline & Line Sizing Studio runs on a liquid line:
 * bore to area to velocity, velocity to Reynolds, Reynolds and relative
 * roughness to a friction factor, and then the three losses.
 * ------------------------------------------------------------------ */
const liquidAt = (p, over = {}) => H.liquidLineDrop({ ...p, ...over });

/** The resistance sum, built from the schedule's own K table so the digest
 *  never types one. */
const OGBIA_K = P.equivalentLengthFt({
  fittings: OGBIA_FITTINGS, idIn: OGBIA.idIn, frictionFactor: 0.018,
});
const OG = liquidAt(OGBIA);
const OG_K = liquidAt(OGBIA, { sumK: OGBIA_K.sumK });

const gasForms = [
  ['weymouth', H.weymouthQ], ['panhandleA', H.panhandleAQ],
  ['panhandleB', H.panhandleBQ], ['general', H.generalFlowQ],
];
const SOKU_Q = Object.fromEntries(gasForms.map(([k, fn]) => [k, fn(SOKU)]));

// ------------------------------------------------------------------ header
w('# FC2 Line Sizing & Hydraulics. Teaching digest.');
w('# Liquid work prints to six decimals (ft per s, psi, inches, ratios, friction factors); gas rates, Reynolds numbers, barrels, hours and days to four; counts are whole numbers.');
w('# Field units: bpd for liquid, scfd for gas, inches of bore, FEET of length for liquid work and MILES for gas work (the unit the published transmission forms are stated in), psia, degR, lb per ft3, cp.');
w('# Nothing here is read from a clock or a random number, so every line reproduces.');
w();

// ---------------------------------------------------------------- SECTION 1
w('# SECTION 1: What the engine sizes, and what it refuses (owned by Associate m01)');
w();
w('# App surface: the Pipeline & Line Sizing Studio runs this chain live. A bore gives an area, the area and the rate give a velocity, the velocity gives a Reynolds number, the Reynolds number and the relative roughness give a friction factor, and the friction factor and the length give the loss.');
w('- This engine sizes ONE LINE. It says what a single pipe costs in pressure and what bore it needs. A system of lines that share a header is a network solve and lives in engines/production/networkSolve.js.');
w('- The multiphase half is NOT in this engine. Two-phase pressure drop, flow regime and holdup are the Suite Beggs and Brill correlation, which is app code, and the engine takes the holdup as an INPUT wherever it needs one.');
w('- A state the method has no answer for comes back as an object with an `error` string. This engine throws nothing: every refusal is a returned object, so a caller checks a property rather than catching.');
w('- Liquid rates are taken at LINE conditions, the dead-liquid case downstream of separation. A live-oil flowline upstream of separation carries full PVT and belongs elsewhere.');
w();
w('States the method has no answer for, engine messages verbatim:');
[
  ['a liquid line with no rate', () => H.liquidLineDrop({ qBpd: 0, idIn: 6, lengthFt: 100, rhoLbFt3: 55, muCp: 1 })],
  ['a liquid line with a negative rate', () => H.liquidLineDrop({ qBpd: -5, idIn: 6, lengthFt: 100, rhoLbFt3: 55, muCp: 1 })],
  ['a liquid line with no bore', () => H.liquidLineDrop({ qBpd: 5000, idIn: 0, lengthFt: 100, rhoLbFt3: 55, muCp: 1 })],
  ['a liquid line with no length', () => H.liquidLineDrop({ qBpd: 5000, idIn: 6, lengthFt: 0, rhoLbFt3: 55, muCp: 1 })],
  ['a liquid line with no viscosity', () => H.liquidLineDrop({ qBpd: 5000, idIn: 6, lengthFt: 100, rhoLbFt3: 55, muCp: 0 })],
  ['a traverse with no profile', () => H.liquidLineTraverse({ p1Psia: 100, profile: [] })],
  ['a gas line whose outlet meets its inlet', () => H.weymouthQ({ p1Psia: 500, p2Psia: 600, idIn: 8, lengthMi: 10, sg: 0.65, tAvgR: 540, zAvg: 0.9 })],
  ['an outlet-pressure solve on an unknown equation', () => H.gasOutletPressure({ equation: 'cylindrical', qScfd: 1 })],
  ['an outlet-pressure solve with no rate', () => H.gasOutletPressure({ equation: 'weymouth', qScfd: 0, p1Psia: 1000, idIn: 8, lengthMi: 25, sg: 0.65, tAvgR: 540, zAvg: 0.87 })],
  ['an outlet-pressure solve the line cannot deliver', () => H.gasOutletPressure({ equation: 'weymouth', qScfd: 1e12, p1Psia: 1000, idIn: 8, lengthMi: 25, sg: 0.65, tAvgR: 540, zAvg: 0.87 })],
  ['a wall with no design pressure', () => H.requiredWallIn({ odIn: 8.625, smysPsi: 42000 })],
  ['a wall to a code that does not exist', () => H.requiredWallIn({ designPsig: 1000, odIn: 8.625, smysPsi: 42000, code: 'B99' })],
  ['a wall to a B31.8 location class that does not exist', () => H.requiredWallIn({ designPsig: 1000, odIn: 8.625, smysPsi: 42000, code: 'B31.8', locationClass: 9 })],
  ['a rating with no wall left after the allowance', () => H.maopPsig({ wallIn: 0.04, odIn: 8.625, smysPsi: 42000, corrosionAllowanceIn: 0.0625 })],
  ['a sweep with a holdup above one', () => H.sweptLiquidBbl({ idIn: 6, lengthFt: 100, holdupFrac: 1.4 })],
  ['a pig that does not move', () => H.pigRun({ lengthFt: 100, pigSpeedFtS: 0 })],
  ['an interval with no dropout', () => H.piggingInterval({ maxSlugBbl: 100, dropoutBpd: 0, sweptBbl: 10 })],
  ['an interval whose sweep already overfills the catcher', () => H.piggingInterval({ maxSlugBbl: 10, dropoutBpd: 25, sweptBbl: 50 })],
].forEach(([label, fn]) => w(`- ${label}: ${soft(fn())}`));
w();
w('# The units it works in. Four constants the module keeps to itself are measured here by asking the engine a question about itself, because a number typed into this file would not be an engine return.');
const mGc = liquidAt(OGBIA, { sumK: 1 });
w(`gc, measured as the liquid density times the velocity squared over twice 144 times the one-velocity-head fittings loss: ${e6((OGBIA.rhoLbFt3 * mGc.vFtS * mGc.vFtS) / (2 * 144 * mGc.dpFittingsPsi))} lbm ft per lbf s2 (derived from the engine's own velocity ${e6(mGc.vFtS)} ft/s and fittings loss ${e6(mGc.dpFittingsPsi)} psi at a resistance sum of one).`);
w(`one centipoise in lbm per ft per s, measured as the density times the velocity times the bore in feet over the viscosity times the Reynolds number: ${(((OGBIA.rhoLbFt3 * OG.vFtS * (OGBIA.idIn / 12)) / (OGBIA.muCp * OG.re))).toExponential(10)} (derived from the engine's velocity ${e6(OG.vFtS)} ft/s and Reynolds number ${r4(OG.re)}).`);
const mVol = H.lineVolumeBbl({ idIn: OGBIA.idIn, lengthFt: OGBIA.lengthFt });
const mArea = (Math.PI * OGBIA.idIn * OGBIA.idIn) / (4 * 144);
w(`cubic feet per barrel, measured as the flow area times the length over the engine's line volume: ${num((mArea * OGBIA.lengthFt) / mVol, 13)} (derived from the engine's line volume ${r4(mVol)} bbl).`);
w(`seconds per day, measured as the rate times the cubic feet per barrel above over the area times the velocity: ${e6((OGBIA.qBpd * ((mArea * OGBIA.lengthFt) / mVol)) / (mArea * OG.vFtS))} (derived on the row).`);
w(`seconds per hour, measured as a length over the pig speed times the engine's run hours: ${e6(OGBIA_PIG.lengthFt / (OGBIA_PIG.pigSpeedFtS * H.pigRun(OGBIA_PIG).runHours))} (derived from the engine's run time ${e6(H.pigRun(OGBIA_PIG).runHours)} h).`);
w('A fifth, the feet in a mile, cannot be measured this way: the module declares it and then never uses it, so no engine call depends on it and nothing can be asked about it.');
w(`The base conditions the published gas forms are stated at, which the module DOES export: ${e6(H.BASE_CONDITIONS.tbR)} degR and ${e6(H.BASE_CONDITIONS.pbPsia)} psia. That base pressure is not atmospheric, and the two are a quarter of a psi apart.`);
w();

// ---------------------------------------------------------------- SECTION 2
w('# SECTION 2: Velocity, Reynolds and the friction factor (owned by Associate m02)');
w();
w('The published friction cases, engine against golden:');
w('| Reynolds number | relative roughness | engine f | golden f | regime the engine reports |');
w('| --- | --- | --- | --- | --- |');
G.friction.forEach((c) => {
  const r = H.frictionFactor({ re: c.re, relRough: c.relRough });
  w(`| ${r4(c.re)} | ${num(c.relRough, 6)} | ${num(r.f, 12)} | ${num(c.f, 12)} | ${r.regime} |`);
});
w();
w('The two branches, walked across the boundary the engine draws at Reynolds 2100 and the one it draws at 4000, on a smooth pipe:');
w('| Reynolds number | f | regime |');
w('| --- | --- | --- |');
OGBIA_REGIME_PROBE_RE.forEach((re) => {
  const r = H.frictionFactor({ re, relRough: 0 });
  w(`| ${r4(re)} | ${num(r.f, 12)} | ${r.regime} |`);
});
const jLo = H.frictionFactor({ re: RE_JUST_BELOW_BRANCH, relRough: OGBIA.roughnessIn / OGBIA.idIn });
const jHi = H.frictionFactor({ re: RE_AT_BRANCH, relRough: OGBIA.roughnessIn / OGBIA.idIn });
w(`At the OGBIA relative roughness of ${num(OGBIA.roughnessIn / OGBIA.idIn, 10)} (derived: the roughness over the bore) the friction factor goes from ${num(jLo.f, 10)} to ${num(jHi.f, 10)} across one unit of Reynolds number, a jump of ${e6((jHi.f / jLo.f - 1) * 100)} percent (derived from the two engine values on this row).`);
w(`The lower value is reported as ${jLo.regime} and the upper as ${jHi.regime}, and the upper one is computed on the turbulent branch: the word and the arithmetic are saying different things in the band from 2100 to 4000.`);
w();
w('Relative roughness alone, at one Reynolds number, which is the vertical axis of the Moody chart:');
w(`| relative roughness | f at Reynolds ${r4(RE_LOW_FOR_ROUGHNESS_TABLE)} | f at Reynolds ${r4(RE_HIGH_FOR_ROUGHNESS_TABLE)} |`);
w('| --- | --- | --- |');
RELATIVE_ROUGHNESS_SWEEP.forEach((rr) => {
  w(`| ${num(rr, 6)} | ${num(H.frictionFactor({ re: RE_LOW_FOR_ROUGHNESS_TABLE, relRough: rr }).f, 12)} | ${num(H.frictionFactor({ re: RE_HIGH_FOR_ROUGHNESS_TABLE, relRough: rr }).f, 12)} |`);
});
w('A rough pipe stops caring about the Reynolds number and a smooth one never does: read the two columns against each other down the table.');
w();
w('The OGBIA line walked from turbulent into laminar by viscosity alone, at its built bore:');
w('| viscosity cp | velocity ft/s | Reynolds number | f | regime | friction loss psi |');
w('| --- | --- | --- | --- | --- | --- |');
OGBIA_VISCOSITY_SWEEP_CP.forEach((muCp) => {
  const r = liquidAt(OGBIA, { muCp });
  w(`| ${e6(muCp)} | ${e6(r.vFtS)} | ${r4(r.re)} | ${num(r.f, 10)} | ${r.regime} | ${e6(r.dpFrictionPsi)} |`);
});
w('The velocity does not move, because velocity is rate over area and neither of those is the viscosity. Everything downstream of the Reynolds number does.');
w();

// ---------------------------------------------------------------- SECTION 3
w('# SECTION 3: Three losses kept apart (owned by Associate m03)');
w();
w(`The OGBIA crude export line as built: ${e6(OGBIA.qBpd)} bpd of ${e6(OGBIA.rhoLbFt3)} lb/ft3 crude at ${e6(OGBIA.muCp)} cp, through ${e6(OGBIA.idIn)} in of bore over ${e6(OGBIA.lengthFt)} ft, on commercial steel at ${num(OGBIA.roughnessIn, 6)} in.`);
w(`Velocity ${e6(OG.vFtS)} ft/s, Reynolds number ${r4(OG.re)}, regime ${OG.regime}, friction factor ${num(OG.f, 10)}.`);
w(`Friction ${e6(OG.dpFrictionPsi)} psi, fittings ${e6(OG.dpFittingsPsi)} psi, elevation ${e6(OG.dpElevationPsi)} psi, total ${e6(OG.dpTotalPsi)} psi, gradient ${num(OG.gradientPsiPerFt, 10)} psi per ft.`);
w('The three are returned SEPARATELY because they answer different questions. Friction is what a bigger pipe fixes. Elevation is what no pipe fixes.');
w();
w('The fittings on the isometric, and the resistance sum the schedule builds from them:');
w('| fitting | count | K each | K total |');
w('| --- | --- | --- | --- |');
OGBIA_FITTINGS.forEach((f) => {
  const k = P.fittingK(f.id);
  w(`| ${f.id} | ${f.count} | ${e6(k)} | ${e6(k * f.count)} |`);
});
w(`The engine's resistance sum for that list: ${e6(OGBIA_K.sumK)} velocity heads (engine).`);
const OG_SHORT = liquidAt(OGBIA, { sumK: OGBIA_K.sumK, lengthFt: OGBIA_MANIFOLD_LENGTH_FT });
w(`On the whole ${e6(OGBIA.lengthFt)} ft line those fittings cost ${e6(OG_K.dpFittingsPsi)} psi against ${e6(OG_K.dpFrictionPsi)} psi of pipe friction, a share of ${e6(OG_K.dpFittingsPsi / OG_K.dpTotalPsi)} of the total (derived from the two engine values on this row).`);
w(`On a ${e6(OGBIA_MANIFOLD_LENGTH_FT)} ft manifold run carrying the same duty and the same fittings, the pipe costs ${e6(OG_SHORT.dpFrictionPsi)} psi and the fittings cost ${e6(OG_SHORT.dpFittingsPsi)} psi, a share of ${e6(OG_SHORT.dpFittingsPsi / OG_SHORT.dpTotalPsi)}. The fittings did not change; the pipe did.`);
w();
w('Elevation, the same line up and down:');
w('| elevation change ft | friction psi | elevation psi | total psi | gradient psi per ft |');
w('| --- | --- | --- | --- | --- |');
OGBIA_ELEVATION_SWEEP_FT.forEach((dz) => {
  const r = liquidAt(OGBIA, { elevChangeFt: dz });
  w(`| ${e6(dz)} | ${e6(r.dpFrictionPsi)} | ${e6(r.dpElevationPsi)} | ${e6(r.dpTotalPsi)} | ${num(r.gradientPsiPerFt, 10)} |`);
});
w('The friction term is identical in all three rows and the elevation term is symmetric about zero, so a hill is added to a pressure drop rather than mixed into it.');
w();
w('Roughness, which is the pipe and not the fluid:');
w('| catalogue id | roughness in | relative roughness | f | friction loss psi |');
w('| --- | --- | --- | --- | --- |');
OGBIA_ROUGHNESS_IDS.forEach((id) => {
  const rough = P.roughnessOf(id);
  const r = liquidAt(OGBIA, { roughnessIn: rough });
  w(`| ${id} | ${num(rough, 6)} | ${num(rough / OGBIA.idIn, 10)} | ${num(r.f, 10)} | ${e6(r.dpFrictionPsi)} |`);
});
w();
w('The published liquid cases, engine against golden:');
G.liquid.forEach((c) => {
  const r = H.liquidLineDrop(c);
  w(`- ${r4(c.qBpd)} bpd in ${e6(c.idIn)} in over ${e6(c.lengthFt)} ft, elevation ${e6(c.elevChangeFt)} ft, resistance sum ${e6(c.sumK)}: velocity ${e6(r.vFtS)} ft/s, Reynolds ${r4(r.re)}, f ${num(r.f, 10)}, regime ${r.regime}; friction ${e6(r.dpFrictionPsi)} psi, fittings ${e6(r.dpFittingsPsi)} psi, elevation ${e6(r.dpElevationPsi)} psi, total ${e6(r.dpTotalPsi)} psi.`);
  w(`    golden: velocity ${e6(c.vFtS)}, Reynolds ${r4(c.re)}, f ${num(c.f, 10)}, friction ${e6(c.dpFrictionPsi)} psi, total ${e6(c.dpTotalPsi)} psi (golden).`);
});
w();

// ---------------------------------------------------------------- SECTION 4
w('# SECTION 4: The erosional limit (owned by Associate m04)');
w();
w('# App surface: the studio puts an RP 14E verdict on every row of its sizing sweep, which is what stops a bore being chosen on pressure drop alone.');
w('The published c factor rows, all three overridable:');
w('| id | label | c |');
w('| --- | --- | --- |');
C.EROSIONAL_C.forEach((row) => w(`| ${row.id} | ${row.label} | ${e6(row.c)} |`));
w(`An id the table does not carry does not refuse and does not return null: erosionalC('${EROSIONAL_UNKNOWN_ID}') comes back as ${shape(C.erosionalC(EROSIONAL_UNKNOWN_ID))}, which is the first row under its own label.`);
w();
w('The limit at the OGBIA crude density, and what each c factor allows through the built bore:');
w('| c | erosional velocity ft/s | line velocity ft/s | ratio | exceeded | margin percent | largest rate bpd |');
w('| --- | --- | --- | --- | --- | --- | --- |');
EROSIONAL_C_IDS.forEach((id) => {
  const cF = C.erosionalC(id).c;
  const chk = C.erosionalCheck({ inSituBpd: OGBIA.qBpd, idIn: OGBIA.idIn, mixtureDensityLbFt3: OGBIA.rhoLbFt3, cFactor: cF });
  const q = C.erosionalRateBpd({ idIn: OGBIA.idIn, mixtureDensityLbFt3: OGBIA.rhoLbFt3, cFactor: cF });
  w(`| ${e6(cF)} | ${e6(chk.erosionalFtS)} | ${e6(chk.velocityFtS)} | ${e6(chk.ratio)} | ${chk.exceeded} | ${e6(chk.marginPct)} | ${r4(q)} |`);
});
w(`The engine's own flow area for that bore is ${e6(C.pipeAreaFt2(OGBIA.idIn))} ft2, and the velocity the erosional check reads, ${e6(C.mixtureVelocityFtS({ inSituBpd: OGBIA.qBpd, idIn: OGBIA.idIn }))} ft/s, is the same velocity the pressure drop read.`);
w();
w('Density is the whole of the limit: the same c factor against four fluids.');
w('| mixture density lb/ft3 | erosional velocity at c 100 | at c 125 | at c 175 |');
w('| --- | --- | --- | --- |');
EROSIONAL_DENSITY_SWEEP.forEach((rho) => {
  w(`| ${e6(rho)} | ${e6(C.erosionalVelocityFtS({ mixtureDensityLbFt3: rho, cFactor: 100 }))} | ${e6(C.erosionalVelocityFtS({ mixtureDensityLbFt3: rho, cFactor: 125 }))} | ${e6(C.erosionalVelocityFtS({ mixtureDensityLbFt3: rho, cFactor: 175 }))} |`);
});
w('A light gas is allowed to run several times faster than a dense liquid, which is why the limit bites hardest on wet gas and hardly at all on crude.');
w();
w('# HELD FOR LITERATURE, taught as a limit and never graded: the three c factor rows. The recommended practice itself says its own figures are conservative, and the third row is labelled as operator practice with no publication behind it. Every graded erosional value in this course states its own c factor.');
w();

// ---------------------------------------------------------------- SECTION 5
w('# SECTION 5: Choosing a bore (owned by Associate m05)');
w();
w('The OGBIA duty in every bore the vendored schedule carries, with the RP 14E verdict at the continuous-service c factor:');
w('| nominal | schedule | outside diameter in | wall in | bore in | velocity ft/s | Reynolds | friction loss psi | total psi | erosional ft/s | ratio | inside the limit |');
w('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
const C_CONT = C.erosionalC('continuous').c;
const sweepRows = P.PIPE_SCHEDULE.map((row) => {
  const r = liquidAt(OGBIA, { idIn: row.id });
  const chk = C.erosionalCheck({ inSituBpd: OGBIA.qBpd, idIn: row.id, mixtureDensityLbFt3: OGBIA.rhoLbFt3, cFactor: C_CONT });
  return { row, r, chk };
});
sweepRows.forEach(({ row, r, chk }) => {
  w(`| ${row.nps} | ${row.schedule} | ${e6(row.od)} | ${e6(row.wall)} | ${e6(row.id)} | ${e6(r.vFtS)} | ${r4(r.re)} | ${e6(r.dpFrictionPsi)} | ${e6(r.dpTotalPsi)} | ${e6(chk.erosionalFtS)} | ${e6(chk.ratio)} | ${!chk.exceeded} |`);
});
w(`The erosional velocity is the same on every row, ${e6(sweepRows[0].chk.erosionalFtS)} ft/s, because it depends on the density and the c factor and not on the bore. What changes down the table is the velocity that has to sit under it.`);
w();
w('The table is ordered by nominal size and then by schedule, and that order is NOT the order of the bores:');
w(`bores in table order: ${P.PIPE_SCHEDULE.map((r) => e6(r.id)).join(', ')}.`);
w('A heavier schedule is a thicker wall and a smaller bore on the same outside diameter, and it sits after the lighter one, so reading down the table crosses back and forth over the bore that a line actually needs.');
w();
w('The same outside diameter in two schedules:');
w('| nominal | outside diameter in | wall light | wall heavy | bore light | bore heavy | velocity light ft/s | velocity heavy ft/s | total psi light | total psi heavy |');
w('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
SCHEDULE_PAIR_NPS.forEach((nps) => {
  const a = P.scheduleRow(nps, '40'); const b = P.scheduleRow(nps, '80');
  const ra = liquidAt(OGBIA, { idIn: a.id }); const rb = liquidAt(OGBIA, { idIn: b.id });
  w(`| ${nps} | ${e6(a.od)} | ${e6(a.wall)} | ${e6(b.wall)} | ${e6(a.id)} | ${e6(b.id)} | ${e6(ra.vFtS)} | ${e6(rb.vFtS)} | ${e6(ra.dpTotalPsi)} | ${e6(rb.dpTotalPsi)} |`);
});
w();
const passing = sweepRows.filter(({ r, chk }) => !chk.exceeded && r.vFtS <= OGBIA_SWEEP_MAX_V_FT_S);
const firstInTableOrder = passing[0];
const smallestBore = passing.reduce((a, b) => (a.row.id < b.row.id ? a : b), passing[0]);
w(`Against a velocity ceiling of ${e6(OGBIA_SWEEP_MAX_V_FT_S)} ft/s as well as the erosional limit, ${passing.length} of the ${P.PIPE_SCHEDULE.length} bores pass.`);
w(`The first of them in TABLE order is ${firstInTableOrder.row.nps} in schedule ${firstInTableOrder.row.schedule}, bore ${e6(firstInTableOrder.row.id)} in. The smallest passing BORE is ${smallestBore.row.nps} in schedule ${smallestBore.row.schedule}, bore ${e6(smallestBore.row.id)} in. On this duty they are ${firstInTableOrder.row.id === smallestBore.row.id ? 'the same row' : 'DIFFERENT rows'}.`);
w();

// ---------------------------------------------------------------- SECTION 6
w('# SECTION 6: The Associate reading, one line end to end (owned by Associate m06)');
w();
w(`OGBIA end to end: ${e6(OGBIA.qBpd)} bpd of ${e6(OGBIA.rhoLbFt3)} lb/ft3 crude at ${e6(OGBIA.muCp)} cp through ${e6(OGBIA.idIn)} in of bore over ${e6(OGBIA.lengthFt)} ft gives a velocity of ${e6(OG.vFtS)} ft/s and a Reynolds number of ${r4(OG.re)}, which is ${OG.regime}; at a relative roughness of ${num(OGBIA.roughnessIn / OGBIA.idIn, 10)} the friction factor is ${num(OG.f, 10)} and the pipe costs ${e6(OG.dpFrictionPsi)} psi; the isometric's ${e6(OGBIA_K.sumK)} velocity heads add ${e6(OG_K.dpFittingsPsi)} psi; and the erosional limit at the continuous-service c factor is ${e6(sweepRows[0].chk.erosionalFtS)} ft/s, which this line uses ${e6(OG.vFtS / sweepRows[0].chk.erosionalFtS)} of.`);
w('Everything in that sentence is closed form. Nothing in it iterated except the friction factor, and nothing in it compressed. Both of those change in the next tier.');
w();

// ---------------------------------------------------------------- SECTION 7
w('# SECTION 7: A gas line is not a liquid line (owned by Professional m01)');
w();
w(`The SOKU gas trunk as the studio reads it: ${e6(SOKU.p1Psia)} psia at the station, ${e6(SOKU.p2Psia)} psia at the delivery point, ${e6(SOKU.idIn)} in of bore over ${e6(SOKU.lengthMi)} miles, gas gravity ${e6(SOKU.sg)}, average flowing temperature ${e6(SOKU.tAvgR)} degR, average compressibility ${e6(SOKU.zAvg)}, efficiency ${e6(SOKU.efficiency)}.`);
w(`The driving group is the difference of the SQUARES: ${e6(SOKU.p1Psia)} squared less ${e6(SOKU.p2Psia)} squared is ${r4(SOKU.p1Psia * SOKU.p1Psia - SOKU.p2Psia * SOKU.p2Psia)} psia squared (derived, stated on the row). A liquid line subtracts pressures; a gas line subtracts their squares, because the density the friction sees is itself proportional to the pressure.`);
w(`The base the published forms report at: ${e6(H.BASE_CONDITIONS.tbR)} degR and ${e6(H.BASE_CONDITIONS.pbPsia)} psia. A rate in scfd is a rate AT THAT BASE, so two forms quoted at different bases are not comparable even when they agree.`);
w(`A line whose outlet meets its inlet has no answer at all: at ${e6(SOKU_DEAD_P2_PSIA)} psia out against ${e6(SOKU.p1Psia)} psia in, the engine returns ${soft(H.weymouthQ({ ...SOKU, p2Psia: SOKU_DEAD_P2_PSIA }))}.`);
const nearlyDead = H.weymouthQ({ ...SOKU, p2Psia: SOKU_NEARLY_DEAD_P2_PSIA });
w(`A line that is nearly dead does have one: at ${e6(SOKU_NEARLY_DEAD_P2_PSIA)} psia out, five psi below the inlet, Weymouth gives ${r4(nearlyDead.qScfd)} scfd.`);
w();

// ---------------------------------------------------------------- SECTION 8
w('# SECTION 8: The four transmission forms (owned by Professional m02)');
w();
w('The SOKU trunk through all four, on identical inputs:');
w('| form | rate scfd | against Weymouth |');
w('| --- | --- | --- |');
gasForms.forEach(([k]) => {
  w(`| ${k} | ${r4(SOKU_Q[k].qScfd)} | ${e6(SOKU_Q[k].qScfd / SOKU_Q.weymouth.qScfd)} |`);
});
w(`The spread from the lowest to the highest is ${e6(Math.max(...gasForms.map(([k]) => SOKU_Q[k].qScfd)) / Math.min(...gasForms.map(([k]) => SOKU_Q[k].qScfd)))} (derived from the column above). Four published answers to one question, and choosing between them is engineering rather than arithmetic.`);
w(`General Flow also returns the friction factor it settled on, ${num(SOKU_Q.general.fDarcy, 10)}, which is the only one of the four that says anything about the pipe's roughness at all.`);
w();
w('The diameter exponent of each form, measured by doubling the bore and reading the engine:');
w('| form | rate at 10 in | rate at 20 in | measured exponent |');
w('| --- | --- | --- | --- |');
gasForms.forEach(([k, fn]) => {
  const a = fn({ ...SOKU, idIn: 10 }).qScfd; const b = fn({ ...SOKU, idIn: 20 }).qScfd;
  w(`| ${k} | ${r4(a)} | ${r4(b)} | ${num(Math.log2(b / a), 10)} |`);
});
w('The exponent is derived as the base-two logarithm of the ratio of the two engine rates on each row. It is the single most important number in a gas form, because it is what says how much a bigger pipe buys.');
w();
w('The efficiency multiplier, which every form carries:');
w('| efficiency | weymouth scfd | panhandleA scfd | panhandleB scfd | general scfd |');
w('| --- | --- | --- | --- | --- |');
SOKU_EFFICIENCY_SWEEP.forEach((efficiency) => {
  w(`| ${e6(efficiency)} | ${gasForms.map(([, fn]) => r4(fn({ ...SOKU, efficiency }).qScfd)).join(' | ')} |`);
});
w('# HELD FOR LITERATURE, taught as a limit and never graded: the efficiency factor. It multiplies every form linearly and no publication in this package stands behind any particular value of it. Every graded gas value in this course states its own efficiency.');
w();
w('The published gas cases, engine against golden:');
G.gas.forEach((c) => {
  const fn = Object.fromEntries(gasForms)[c.equation];
  const r = fn(c);
  w(`- ${c.equation}, ${e6(c.idIn)} in over ${e6(c.lengthMi)} mi, ${e6(c.p1Psia)} to ${e6(c.p2Psia)} psia, elevation ${e6(c.elevChangeFt)} ft, efficiency ${e6(c.efficiency)}: engine ${r4(r.qScfd)} scfd, golden ${r4(c.qScfd)} scfd (golden).`);
});
w();

// ---------------------------------------------------------------- SECTION 9
w('# SECTION 9: The elevation adjustment (owned by Professional m03)');
w();
w('The group all four forms share, on the SOKU trunk:');
w('| elevation change ft | s | e to the s | equivalent length factor |');
w('| --- | --- | --- | --- |');
[0, SOKU_UP_FT, SOKU_DOWN_FT, SOKU_STEEP_DOWN_FT].forEach((dz) => {
  const ea = H.elevationAdjustment({ sg: SOKU.sg, elevChangeFt: dz, tAvgR: SOKU.tAvgR, zAvg: SOKU.zAvg });
  w(`| ${e6(dz)} | ${num(ea.s, 10)} | ${num(ea.es, 10)} | ${num(ea.leFactor, 10)} |`);
});
w('A hill does two things and they are not the same thing. It scales the outlet pressure inside the driving group through e to the s, and it changes the length the friction acts over through the equivalent length factor. At zero elevation both collapse to one and the flat form comes back exactly.');
const elevCoeff = H.elevationAdjustment({ sg: 1, elevChangeFt: 1000, tAvgR: 1, zAvg: 1 });
w(`The coefficient inside s, measured by asking the engine for s at a gravity of one, a thousand feet of rise, an absolute temperature of one and a compressibility of one, then dividing by the thousand feet: ${num(elevCoeff.s / 1000, 12)} (derived from the engine's ${num(elevCoeff.s, 6)}).`);
w();
w('What the hill costs the trunk, by form:');
w('| form | flat scfd | up scfd | down scfd | up as a fraction of flat | down as a fraction of flat |');
w('| --- | --- | --- | --- | --- | --- |');
gasForms.forEach(([k, fn]) => {
  const flat = fn(SOKU).qScfd;
  const up = fn({ ...SOKU, elevChangeFt: SOKU_UP_FT }).qScfd;
  const dn = fn({ ...SOKU, elevChangeFt: SOKU_DOWN_FT }).qScfd;
  w(`| ${k} | ${r4(flat)} | ${r4(up)} | ${r4(dn)} | ${e6(up / flat)} | ${e6(dn / flat)} |`);
});
w('Uphill is not the mirror of downhill. The two fractions on each row do not average to one, because the term is an exponential and an exponential is not symmetric about zero.');
w();

// --------------------------------------------------------------- SECTION 10
w('# SECTION 10: The outlet pressure (owned by Professional m04)');
w();
w('# App surface: this is the direction the studio actually works in. A designer knows the rate the terminal has contracted for and wants the pressure it will see, which is the inverse of every form above.');
w('The engine has no closed inversion. It bisects on the outlet pressure inside a bracket that runs from atmospheric to the inlet pressure, calling the published form at each step.');
w();
w('Round trips on the flat trunk, each form solved back to the outlet it came from:');
w('| form | rate scfd | outlet recovered psia | against the stated outlet psia |');
w('| --- | --- | --- | --- |');
gasForms.forEach(([k]) => {
  const q = SOKU_Q[k].qScfd;
  const inv = H.gasOutletPressure({ equation: k, qScfd: q, ...SOKU });
  w(`| ${k} | ${r4(q)} | ${inv.error ? inv.error : e6(inv.p2Psia)} | ${inv.error ? 'refused' : e6(inv.p2Psia - SOKU.p2Psia)} |`);
});
w();
const tgt = H.gasOutletPressure({ equation: 'weymouth', qScfd: SOKU_TARGET_SCFD, ...SOKU });
w(`The trunk asked for ${r4(SOKU_TARGET_SCFD)} scfd through the Weymouth form arrives at ${e6(tgt.p2Psia)} psia, a drop of ${e6(tgt.dpPsi)} psi.`);
w(`A rate the line cannot carry at all is refused rather than approximated: ${soft(H.gasOutletPressure({ equation: 'weymouth', qScfd: 1e12, ...SOKU }))}`);
w();
w('The bracket, and the case it cannot reach. On a steep DESCENT the column recovers more head than the friction spends, so the outlet pressure can legitimately be ABOVE the inlet, and that answer is outside the bracket the search runs in.');
const steepOutletPsia = SOKU.p1Psia + SOKU_STEEP_DOWN_ABOVE_INLET_PSI;
const steepQ = H.weymouthQ({ ...SOKU, elevChangeFt: SOKU_STEEP_DOWN_FT, p2Psia: steepOutletPsia });
const steepInv = H.gasOutletPressure({ equation: 'weymouth', qScfd: steepQ.qScfd, ...SOKU, elevChangeFt: SOKU_STEEP_DOWN_FT });
w(`Down ${e6(SOKU_STEEP_DOWN_FT)} ft, the trunk carries ${r4(steepQ.qScfd)} scfd when its outlet stands at ${e6(steepOutletPsia)} psia, which is ${e6(SOKU_STEEP_DOWN_ABOVE_INLET_PSI)} psia ABOVE its inlet of ${e6(SOKU.p1Psia)} psia.`);
w(`Given that same rate, the engine returns ${shape(steepInv)}: the inlet pressure, and a drop of zero.`);
w(`The forward call and the inverse call disagree by ${e6(steepOutletPsia - steepInv.p2Psia)} psi on one line, and the inverse reports no error.`);
const steepQ2 = H.weymouthQ({ ...SOKU, elevChangeFt: SOKU_STEEP_DOWN_FT, p2Psia: SOKU_STEEP_DOWN_P2_PSIA });
const steepInv2 = H.gasOutletPressure({ equation: 'weymouth', qScfd: steepQ2.qScfd, ...SOKU, elevChangeFt: SOKU_STEEP_DOWN_FT });
w(`THE CONTROL, and it is the line that proves the bracket is the fault rather than the descent. Run the SAME descent with an outlet genuinely BELOW the inlet, ${e6(SOKU_STEEP_DOWN_P2_PSIA)} psia against ${e6(SOKU.p1Psia)} psia: the trunk carries ${r4(steepQ2.qScfd)} scfd and the inverse recovers ${e6(steepInv2.p2Psia)} psia, an error of ${e6(steepInv2.p2Psia - SOKU_STEEP_DOWN_P2_PSIA)} psi.`);
w('So the bisection is exact when its answer lies inside the bracket and silently wrong when it does not. A reading that only ever tested outlets below the inlet would have found nothing.');
w();

// --------------------------------------------------------------- SECTION 11
w('# SECTION 11: Marching a profile (owned by Professional m05)');
w();
w('A traverse marches the line segment by segment and returns the pressure at every station, so a designer draws the hydraulic gradient instead of asserting one number.');
const trFlat = H.liquidLineTraverse({ p1Psia: OGBIA_P1_PSIA, qBpd: OGBIA.qBpd, idIn: OGBIA.idIn, rhoLbFt3: OGBIA.rhoLbFt3, muCp: OGBIA.muCp, roughnessIn: OGBIA.roughnessIn, profile: OGBIA_PROFILE_FLAT });
const trRidge = H.liquidLineTraverse({ p1Psia: OGBIA_P1_PSIA, qBpd: OGBIA.qBpd, idIn: OGBIA.idIn, rhoLbFt3: OGBIA.rhoLbFt3, muCp: OGBIA.muCp, roughnessIn: OGBIA.roughnessIn, profile: OGBIA_PROFILE });
w();
w('The OGBIA line flat, and the same line over a ridge, station by station:');
w('| station | distance ft | flat elevation ft | flat pressure psia | ridge elevation ft | ridge pressure psia |');
w('| --- | --- | --- | --- | --- | --- |');
trFlat.stations.forEach((s, i) => {
  const rr = trRidge.stations[i];
  w(`| ${i} | ${e6(s.distanceFt)} | ${e6(s.elevFt)} | ${e6(s.pPsia)} | ${e6(rr.elevFt)} | ${e6(rr.pPsia)} |`);
});
w(`Both arrive at ${e6(trFlat.p2Psia)} psia, having spent ${e6(trFlat.dpTotalPsi)} psi, because the ridge climbs ${e6(OGBIA_PROFILE[0].elevChangeFt)} ft and gives all of it back. The ARRIVAL is the same and the middle of the line is not: at the crest the ridge stands at ${e6(trRidge.stations[1].pPsia)} psia against ${e6(trFlat.stations[1].pPsia)} psia, a difference of ${e6(trFlat.stations[1].pPsia - trRidge.stations[1].pPsia)} psi. A line is sized on its worst station and not on its last one.`);
w();
const oneShot = liquidAt(OGBIA, { lengthFt: OGBIA_PROFILE_FLAT.reduce((a, s) => a + s.lengthFt, 0) });
w(`Marched against one shot: the traverse spends ${e6(trFlat.dpTotalPsi)} psi over ${e6(OGBIA_PROFILE_FLAT.reduce((a, s) => a + s.lengthFt, 0))} ft and a single call over the same length spends ${e6(oneShot.dpTotalPsi)} psi, a difference of ${e6(trFlat.dpTotalPsi - oneShot.dpTotalPsi)} psi (derived from the two engine values on this row). A liquid is incompressible, so marching it buys the station list and nothing else.`);
w();
const trWithK = liquidAt(OGBIA, { sumK: OGBIA_K.sumK, lengthFt: OGBIA_PROFILE_FLAT.reduce((a, s) => a + s.lengthFt, 0) });
w(`What a traverse drops: the one-shot call carrying the isometric's ${e6(OGBIA_K.sumK)} velocity heads spends ${e6(trWithK.dpTotalPsi)} psi, and the traverse of the same line spends ${e6(trFlat.dpTotalPsi)} psi. The gap of ${e6(trWithK.dpTotalPsi - trFlat.dpTotalPsi)} psi is exactly the fittings, because liquidLineTraverse has no resistance-sum argument at all.`);
w();
const DL = OGBIA_DEAD_LINE;
const trVac = H.liquidLineTraverse({
  p1Psia: DL.p1Psia, qBpd: DL.qBpd, idIn: DL.idIn, rhoLbFt3: DL.rhoLbFt3,
  muCp: DL.muCp, profile: [{ lengthFt: DL.lengthFt }],
});
w(`Where a line dies, and what the engine says about it: ${e6(DL.qBpd)} bpd of ${e6(DL.rhoLbFt3)} lb/ft3 at ${e6(DL.muCp)} cp through ${e6(DL.idIn)} in over ${e6(DL.lengthFt)} ft, entering at ${e6(DL.p1Psia)} psia, arrives at ${e6(trVac.p2Psia)} psia having spent ${e6(trVac.dpTotalPsi)} psi.`);
w('That arrival is far below zero absolute. The traverse reports it as a station like any other, with no error, because nothing in the march checks that a pressure stayed physical.');
w();

// --------------------------------------------------------------- SECTION 12
w('# SECTION 12: The Professional reading, a trunk end to end (owned by Professional m06)');
w();
w(`SOKU end to end: ${e6(SOKU.idIn)} in over ${e6(SOKU.lengthMi)} miles from ${e6(SOKU.p1Psia)} to ${e6(SOKU.p2Psia)} psia gives a driving group of ${r4(SOKU.p1Psia * SOKU.p1Psia - SOKU.p2Psia * SOKU.p2Psia)} psia squared (derived); Weymouth reads ${r4(SOKU_Q.weymouth.qScfd)} scfd, Panhandle A ${r4(SOKU_Q.panhandleA.qScfd)}, Panhandle B ${r4(SOKU_Q.panhandleB.qScfd)} and General Flow ${r4(SOKU_Q.general.qScfd)} at a friction factor of ${num(SOKU_Q.general.fDarcy, 10)}; put the trunk up ${e6(SOKU_UP_FT)} ft and the Weymouth rate falls to ${r4(H.weymouthQ({ ...SOKU, elevChangeFt: SOKU_UP_FT }).qScfd)}, down the same and it rises to ${r4(H.weymouthQ({ ...SOKU, elevChangeFt: SOKU_DOWN_FT }).qScfd)}; and asked for ${r4(SOKU_TARGET_SCFD)} scfd the line delivers at ${e6(tgt.p2Psia)} psia.`);
w('Four forms, one line, and a spread wide enough that the form is a bigger decision than the bore.');
w();

// --------------------------------------------------------------- SECTION 13
w('# SECTION 13: The wall a code demands (owned by Expert m01)');
w();
w('The B31.8 location classes the module carries, and what B31.4 uses instead:');
w('| location class | design factor |');
w('| --- | --- |');
H.B318_DESIGN_FACTORS.forEach((r) => w(`| ${r.locationClass} | ${e6(r.f)} |`));
const b314 = H.requiredWallIn({ ...SOKU_WALL, code: 'B31.4' });
w(`B31.4 uses a flat design factor of ${e6(b314.designFactor)} whatever the route, which is the same number B31.8 gives to Class 1.`);
w();
w(`The SOKU wall: ${e6(SOKU_WALL.designPsig)} psig design on ${e6(SOKU_WALL.odIn)} in outside diameter at a specified minimum yield of ${e6(SOKU_WALL.smysPsi)} psi, joint factor ${e6(SOKU_WALL.jointFactor)}, temperature derate ${e6(SOKU_WALL.tempDerate)}, corrosion allowance ${e6(SOKU_WALL.corrosionAllowanceIn)} in.`);
w('| code | class | design factor | pressure wall in | required wall in | MAOP of the required wall psig |');
w('| --- | --- | --- | --- | --- | --- |');
SOKU_WALL_CLASSES.forEach((locationClass) => {
  const r = H.requiredWallIn({ ...SOKU_WALL, code: 'B31.8', locationClass });
  const m = H.maopPsig({ ...SOKU_WALL, code: 'B31.8', locationClass, wallIn: r.tRequiredIn });
  w(`| B31.8 | ${locationClass} | ${e6(r.designFactor)} | ${e6(r.tPressureIn)} | ${e6(r.tRequiredIn)} | ${e6(m.maopPsig)} |`);
});
w(`| B31.4 | any | ${e6(b314.designFactor)} | ${e6(b314.tPressureIn)} | ${e6(b314.tRequiredIn)} | ${e6(H.maopPsig({ ...SOKU_WALL, code: 'B31.4', wallIn: b314.tRequiredIn }).maopPsig)} |`);
const c1w = H.requiredWallIn({ ...SOKU_WALL, code: 'B31.8', locationClass: 1 });
const c4w = H.requiredWallIn({ ...SOKU_WALL, code: 'B31.8', locationClass: 4 });
w(`Class 4 asks for ${e6(c4w.tPressureIn / c1w.tPressureIn)} times the pressure wall of Class 1 on the same pipe at the same pressure (derived from the two rows above). The route, not the fluid, is what moved it.`);
w();
w('The joint factor and the temperature derate, one at a time, at Class 1:');
w('| joint factor | pressure wall in | temperature derate | pressure wall in |');
w('| --- | --- | --- | --- |');
SOKU_JOINT_FACTORS.forEach((jointFactor, i) => {
  const tempDerate = SOKU_TEMP_DERATES[i];
  const a = H.requiredWallIn({ ...SOKU_WALL, code: 'B31.8', locationClass: 1, jointFactor });
  const b = H.requiredWallIn({ ...SOKU_WALL, code: 'B31.8', locationClass: 1, tempDerate });
  w(`| ${e6(jointFactor)} | ${e6(a.tPressureIn)} | ${e6(tempDerate)} | ${e6(b.tPressureIn)} |`);
});
w('Both sit in the denominator beside the design factor, so both make the wall thicker, and neither of them is strength: they are confidence in the seam and confidence in the steel when it is hot.');
w();
const withCa = H.requiredWallIn({ ...SOKU_WALL, code: 'B31.8', locationClass: 3 });
w(`The corrosion allowance is not strength either. At Class 3 the pressure part of the wall is ${e6(withCa.tPressureIn)} in and the required wall is ${e6(withCa.tRequiredIn)} in, the difference being the ${e6(SOKU_WALL.corrosionAllowanceIn)} in allowance added on top. It holds no pressure on the day it is installed and it is what lets the pipe still hold pressure years later.`);
const maopWith = H.maopPsig({ ...SOKU_WALL, code: 'B31.8', locationClass: 3, wallIn: SOKU_WALL_AS_BUILT_IN });
const maopWithout = H.maopPsig({ odIn: SOKU_WALL.odIn, smysPsi: SOKU_WALL.smysPsi, code: 'B31.8', locationClass: 3, jointFactor: SOKU_WALL.jointFactor, tempDerate: SOKU_WALL.tempDerate, wallIn: SOKU_WALL_AS_BUILT_IN });
w(`Read the rating back off the wall the mill actually rolled, ${e6(SOKU_WALL_AS_BUILT_IN)} in: with the allowance respected the line rates ${e6(maopWith.maopPsig)} psig, and with the allowance left out of the call it rates ${e6(maopWithout.maopPsig)} psig, which is ${e6(maopWithout.maopPsig / maopWith.maopPsig)} times higher (derived from the two engine values on this row). Both calls are legal and neither warns.`);
w();
w('The published wall cases, engine against golden:');
G.barlow.forEach((c) => {
  const r = H.requiredWallIn(c);
  const m = H.maopPsig({ ...c, wallIn: r.tRequiredIn });
  w(`- ${c.code} class ${c.locationClass}, ${e6(c.designPsig)} psig on ${e6(c.odIn)} in at ${e6(c.smysPsi)} psi, joint ${e6(c.jointFactor)}, derate ${e6(c.tempDerate)}, allowance ${e6(c.corrosionAllowanceIn)} in: design factor ${e6(r.designFactor)}, required wall ${num(r.tRequiredIn, 10)} in, MAOP back ${e6(m.maopPsig)} psig; golden wall ${num(c.tRequiredIn, 10)} in and golden MAOP ${e6(c.maopOfRequiredPsig)} psig (golden).`);
});
w();

// --------------------------------------------------------------- SECTION 14
w('# SECTION 14: The pig and what it pushes (owned by Expert m02)');
w();
w(`The OGBIA pigging duty: ${e6(OGBIA_PIG.idIn)} in of bore over ${e6(OGBIA_PIG.lengthFt)} ft, swept by a sphere at ${e6(OGBIA_PIG.pigSpeedFtS)} ft/s.`);
w(`Line volume ${r4(H.lineVolumeBbl(OGBIA_PIG))} bbl (engine). Run time ${e6(H.pigRun(OGBIA_PIG).runHours)} hours (engine), which the engine reports beside the speed it was given, ${e6(H.pigRun(OGBIA_PIG).pigSpeedFtS)} ft/s.`);
w();
w('THE HOLDUP IS AN INPUT AND NOT A RESULT. The engine says so in its own header: the swept volume is the line volume times a holdup somebody else measured or assumed, and a pigging estimate is only as honest as that number.');
w('| holdup | swept bbl | as a fraction of the line volume | days between runs at the nominal catcher |');
w('| --- | --- | --- | --- |');
OGBIA_HOLDUP_SWEEP.forEach((holdupFrac) => {
  const s = H.sweptLiquidBbl({ ...OGBIA_PIG, holdupFrac });
  const iv = H.piggingInterval({ maxSlugBbl: OGBIA_CATCHER_BBL, dropoutBpd: OGBIA_DROPOUT_BPD, sweptBbl: s.sweptBbl });
  w(`| ${e6(holdupFrac)} | ${r4(s.sweptBbl)} | ${e6(s.sweptBbl / H.lineVolumeBbl(OGBIA_PIG))} | ${iv.error ? iv.error : r4(iv.intervalDays)} |`);
});
w(`At a holdup of zero the sweep is ${r4(H.sweptLiquidBbl({ ...OGBIA_PIG, holdupFrac: 0 }).sweptBbl)} bbl and at a holdup of one it is the whole line. The interval collapses as the holdup rises, and past a point the catcher cannot take the sweep at all and the engine refuses rather than returning a negative interval.`);
w();
const nomSwept = H.sweptLiquidBbl({ ...OGBIA_PIG, holdupFrac: OGBIA_HOLDUP_NOMINAL });
const nomIv = H.piggingInterval({ maxSlugBbl: OGBIA_CATCHER_BBL, dropoutBpd: OGBIA_DROPOUT_BPD, sweptBbl: nomSwept.sweptBbl });
w(`At the nominal holdup of ${e6(OGBIA_HOLDUP_NOMINAL)} the sphere pushes ${r4(nomSwept.sweptBbl)} bbl ahead of it into a ${e6(OGBIA_CATCHER_BBL)} bbl catcher, leaving ${r4(OGBIA_CATCHER_BBL - nomSwept.sweptBbl)} bbl of room (derived on the row), which at ${e6(OGBIA_DROPOUT_BPD)} bpd of dropout is ${r4(nomIv.intervalDays)} days between runs (engine).`);
w(`Put the same sweep into a ${e6(OGBIA_SMALL_CATCHER_BBL)} bbl catcher and there is no interval at all: ${soft(H.piggingInterval({ maxSlugBbl: OGBIA_SMALL_CATCHER_BBL, dropoutBpd: OGBIA_DROPOUT_BPD, sweptBbl: nomSwept.sweptBbl }))}`);
w('That message is the handshake with the separation course: the slug a catcher has to hold is what this engine computes, and the vessel that holds it is sized elsewhere.');
w();
w('The published pigging cases, engine against golden:');
G.pigging.forEach((c) => {
  const v = H.lineVolumeBbl(c);
  const s = H.sweptLiquidBbl(c);
  const p = H.pigRun({ lengthFt: c.lengthFt, pigSpeedFtS: GOLDEN_PIG_SPEED_FT_S });
  w(`- ${e6(c.idIn)} in over ${e6(c.lengthFt)} ft at a holdup of ${e6(c.holdupFrac)}: volume ${r4(v)} bbl, swept ${r4(s.sweptBbl)} bbl, run ${e6(p.runHours)} h at ${e6(GOLDEN_PIG_SPEED_FT_S)} ft/s; golden volume ${r4(c.lineVolumeBbl)} bbl, golden swept ${r4(c.sweptBbl)} bbl, golden run ${e6(c.runHoursAt5FtS)} h (golden).`);
});
w();

// --------------------------------------------------------------- SECTION 15
w('# SECTION 15: Where the correlations stop (owned by Expert m03)');
w();
w(`The jump at the branch, again and exactly: on the OGBIA pipe the friction factor is ${num(jLo.f, 10)} at Reynolds ${num(RE_JUST_BELOW_BRANCH, 7)} and ${num(jHi.f, 10)} at Reynolds ${r4(RE_AT_BRANCH)}, a ratio of ${e6(jHi.f / jLo.f)} (derived from the two engine values on this row).`);
w('Nothing physical happens in that interval. The engine leaves the laminar law and starts the turbulent one, and the discontinuity is the price of having no correlation for the band between them.');
w();
w('Colebrook past the roughness it was published for, which reaches about 0.05:');
w(`| relative roughness | f at Reynolds ${r4(RE_FOR_DOMAIN_SWEEP)} |`);
w('| --- | --- |');
COLEBROOK_DOMAIN_SWEEP.forEach((rr) => w(`| ${e6(rr)} | ${num(H.frictionFactor({ re: RE_FOR_DOMAIN_SWEEP, relRough: rr }).f, 10)} |`));
w('The engine answers all five and flags none of them. The last two are extrapolations of a fitted curve into a region where the pipe is more obstruction than pipe.');
w();
w('The friction Weymouth assumes, measured by asking General Flow what friction factor would make it agree:');
w('| bore in | weymouth scfd | general scfd | the friction factor general settled on | the friction factor that would make general match weymouth |');
w('| --- | --- | --- | --- | --- |');
SOKU_BORE_SWEEP.forEach((idIn) => {
  const wq = H.weymouthQ({ ...SOKU, idIn }).qScfd;
  const gq = H.generalFlowQ({ ...SOKU, idIn });
  const fEq = gq.fDarcy * (gq.qScfd / wq) * (gq.qScfd / wq);
  w(`| ${e6(idIn)} | ${r4(wq)} | ${r4(gq.qScfd)} | ${num(gq.fDarcy, 10)} | ${num(fEq, 10)} |`);
});
w('The last column is derived from the two engine rates and the engine friction factor on each row, using the fact that a General Flow rate goes as one over the square root of f. It falls as the bore grows, which is the signature of a fully rough friction law that depends on the diameter and not on the Reynolds number.');
w();
w('No form checks its own regime. The same nearly dead trunk through Weymouth and through General Flow:');
const deadW = H.weymouthQ({ ...SOKU, p2Psia: SOKU_NEARLY_DEAD_P2_PSIA });
const deadG = H.generalFlowQ({ ...SOKU, p2Psia: SOKU_NEARLY_DEAD_P2_PSIA });
w(`Weymouth ${r4(deadW.qScfd)} scfd, General Flow ${r4(deadG.qScfd)} scfd at a friction factor of ${num(deadG.fDarcy, 10)}, a ratio of ${e6(deadW.qScfd / deadG.qScfd)} (derived).`);
w(`On the same line at its full duty the two sit at ${e6(SOKU_Q.weymouth.qScfd / SOKU_Q.general.qScfd)} of each other. The forms agree better when the line is working than when it is barely flowing, and neither of them says so.`);
w();
w('Neither iteration in this module reports whether it converged. The friction factor solve runs a fixed point and the General Flow solve runs a rate and a friction factor against each other, and both return their last iterate with no flag beside it. They do converge everywhere this digest looked, which is exactly what makes the absence easy to miss.');
w();

// --------------------------------------------------------------- SECTION 16
w('# SECTION 16: What it accepts and should not (owned by Expert m04)');
w();
w('A refusal is an object with an `error`. These are not refusals. Each row is a real engine return on an input that has no physical meaning.');
w();
w('Inputs accepted with a plausible number attached:');
const fo = [
  ['a negative resistance sum', () => liquidAt(OGBIA, { sumK: -5 }), (r) => `fittings loss ${e6(r.dpFittingsPsi)} psi, total ${e6(r.dpTotalPsi)} psi against ${e6(OG.dpTotalPsi)} psi with no fittings at all`],
  ['a negative roughness', () => liquidAt(OGBIA, { roughnessIn: -0.01 }), (r) => `friction factor ${num(r.f, 10)} against the correct ${num(OG.f, 10)}, and friction ${e6(r.dpFrictionPsi)} psi against ${e6(OG.dpFrictionPsi)} psi`],
  ['an elevation change longer than the line', () => H.liquidLineDrop({ ...OGBIA, lengthFt: 100, elevChangeFt: 9000 }), (r) => `elevation ${e6(r.dpElevationPsi)} psi and a gradient of ${e6(r.gradientPsiPerFt)} psi per ft`],
  ['an efficiency above one', () => H.weymouthQ({ ...SOKU, efficiency: 3 }), (r) => `${r4(r.qScfd)} scfd against ${r4(SOKU_Q.weymouth.qScfd)} scfd at an efficiency of one`],
  ['a negative efficiency', () => H.weymouthQ({ ...SOKU, efficiency: -1 }), (r) => `${r4(r.qScfd)} scfd, a gas flowing backwards`],
  ['a gas with no viscosity', () => H.generalFlowQ({ ...SOKU, muCp: 0 }), (r) => `${r4(r.qScfd)} scfd at a friction factor of ${num(r.fDarcy, 10)}, against ${r4(SOKU_Q.general.qScfd)} scfd at ${num(SOKU_Q.general.fDarcy, 10)}`],
  ['a negative corrosion allowance', () => H.requiredWallIn({ ...SOKU_WALL, code: 'B31.8', locationClass: 1, corrosionAllowanceIn: -0.5 }), (r) => `a required wall of ${e6(r.tRequiredIn)} in beside a pressure wall of ${e6(r.tPressureIn)} in`],
  ['a negative swept volume', () => H.piggingInterval({ maxSlugBbl: OGBIA_CATCHER_BBL, dropoutBpd: OGBIA_DROPOUT_BPD, sweptBbl: -500 }), (r) => `${r4(r.intervalDays)} days, against ${r4(nomIv.intervalDays)} days at the real sweep`],
];
fo.forEach(([label, fn, fmt]) => w(`- ${label}: ${fmt(fn())}`));
w();
w('Inputs accepted with something that is not a number, and still no error. The whole return is printed, because the SHAPE is the point:');
[
  ['a gas line of no length', () => H.weymouthQ({ ...SOKU, lengthMi: 0 })],
  ['a gas line of negative length', () => H.weymouthQ({ ...SOKU, lengthMi: -50 })],
  ['a gas line of negative bore', () => H.weymouthQ({ ...SOKU, idIn: -12 })],
  ['a gas at a compressibility of zero', () => H.weymouthQ({ ...SOKU, zAvg: 0 })],
  ['a gas at an absolute temperature of zero', () => H.weymouthQ({ ...SOKU, tAvgR: 0 })],
  ['a gas of no gravity', () => H.panhandleAQ({ ...SOKU, sg: 0 })],
  ['a wall at a temperature derate of zero', () => H.requiredWallIn({ ...SOKU_WALL, tempDerate: 0 })],
  ['a wall at a joint factor of zero', () => H.requiredWallIn({ ...SOKU_WALL, jointFactor: 0 })],
  ['a sweep with no bore', () => H.sweptLiquidBbl({ idIn: 0, lengthFt: OGBIA_PIG.lengthFt, holdupFrac: OGBIA_HOLDUP_NOMINAL })],
  ['a sweep of negative length', () => H.sweptLiquidBbl({ idIn: OGBIA_PIG.idIn, lengthFt: -100, holdupFrac: OGBIA_HOLDUP_NOMINAL })],
].forEach(([label, fn]) => w(`- ${label}: ${shape(fn())}`));
w();
w('The sweep is the sharpest of these, because it DOES guard one of its three inputs. It refuses a holdup above one with a proper message and then hands the bore and the length straight to the line volume, which returns a non-number by contract. One guard existing is what makes the other two look checked.');
w();
w('The same class of question asked of the three catalogues, which answer it three different ways:');
w(`- a fitting the table does not carry: fittingK returns ${raw(P.fittingK('reducer'))}`);
w(`- a roughness the table does not carry: roughnessOf returns ${raw(P.roughnessOf('glass'))}`);
w(`- a grade the table does not carry: gradeYield returns ${raw(P.gradeYield('x55'))}`);
w(`- a pipe size the table does not carry: scheduleRow returns ${shape(P.scheduleRow(5, '40'))}`);
w(`- an erosional service the table does not carry: erosionalC returns ${shape(C.erosionalC(EROSIONAL_UNKNOWN_ID))}`);
w('Four of the five say they do not know. The fifth answers under a label that is not the one it was asked for.');
w();

// --------------------------------------------------------------- SECTION 17
w('# SECTION 17: What the method does not know (owned by Expert m05)');
w();
w('Five things this course teaches as limits and never as answers:');
w(`1. The API RP 14E c factors, ${e6(C.erosionalC('continuous').c)}, ${e6(C.erosionalC('intermittent').c)} and ${e6(C.erosionalC('cleanInhibited').c)}. HELD FOR LITERATURE. The recommended practice says its own figures are conservative, and the third is labelled operator practice with no source.`);
w('2. The efficiency multiplier on all four gas forms. HELD FOR LITERATURE. Nothing in this package stands behind any value of it, and it is unguarded in both directions.');
w(`3. The band from Reynolds 2100 to 4000, where the engine computes on the turbulent branch and labels the answer transitional. HELD FOR LITERATURE. The step across the boundary is ${e6(jHi.f / jLo.f)} times.`);
w('4. The fully rough friction law Weymouth assumes. HELD FOR LITERATURE. Section 15 measures it out of the engine and nothing sources it.');
w('5. The published cases in this golden are SYNTHETIC. They come from an independent oracle written in Python from the same physics, in SI units where the engine works in field units, which catches an arithmetic or a unit error and cannot catch a method that is wrong in both files. No measured pipeline is in this course.');
w();
w('And one thing that is not held but simply absent: THE MULTIPHASE HALF IS NOT IN THIS ENGINE. There is no flow regime, no slip, no holdup correlation and no slug model anywhere in it. Wherever a holdup is needed the engine takes it as an input, which is honest and is also a seam a reader has to see rather than infer.');
w();
w('Two values of one constant, one import apart. The barrel, measured out of each module by asking it a question about itself:');
const bblLine = (mArea * OGBIA.lengthFt) / mVol;
const veP = C.erosionalVelocityFtS({ mixtureDensityLbFt3: OGBIA.rhoLbFt3, cFactor: C_CONT });
const rateP = C.erosionalRateBpd({ idIn: OGBIA.idIn, mixtureDensityLbFt3: OGBIA.rhoLbFt3, cFactor: C_CONT });
const bblChoke = (veP * C.pipeAreaFt2(OGBIA.idIn) * 86400) / rateP;
w(`- from lineHydraulics, as the flow area times the length over the line volume: ${num(bblLine, 13)} cubic feet per barrel`);
w(`- from chokePerformance, as the erosional velocity times the area times the seconds in a day over the erosional rate: ${num(bblChoke, 13)} cubic feet per barrel`);
w(`The two differ by a ratio of ${num(bblLine / bblChoke, 13)} (derived from the two rows above). It is small and it is two numbers for one quantity inside the single chain this studio composes.`);
w();

// --------------------------------------------------------------- SECTION 18
w('# SECTION 18: The Expert reading, a line from bore to wall to pig (owned by Expert m06)');
w();
w(`One pipe, three questions. As a hydraulic line the OGBIA bore of ${e6(OGBIA.idIn)} in carries ${e6(OGBIA.qBpd)} bpd at ${e6(OG.vFtS)} ft/s, Reynolds ${r4(OG.re)}, and spends ${e6(OG.dpTotalPsi)} psi over ${e6(OGBIA.lengthFt)} ft, against an erosional ceiling of ${e6(sweepRows[0].chk.erosionalFtS)} ft/s that it uses ${e6(OG.vFtS / sweepRows[0].chk.erosionalFtS)} of.`);
w(`As a pressure envelope the SOKU pipe at ${e6(SOKU_WALL.odIn)} in outside diameter and ${e6(SOKU_WALL.smysPsi)} psi of yield needs ${e6(withCa.tRequiredIn)} in of wall at Class 3 and ${e6(c1w.tRequiredIn)} in at Class 1, and the ${e6(SOKU_WALL_AS_BUILT_IN)} in the mill rolled rates ${e6(maopWith.maopPsig)} psig.`);
w(`As a volume it holds ${r4(H.lineVolumeBbl(OGBIA_PIG))} bbl, a sphere crosses it in ${e6(H.pigRun(OGBIA_PIG).runHours)} hours, and at a measured holdup of ${e6(OGBIA_HOLDUP_NOMINAL)} it delivers ${r4(nomSwept.sweptBbl)} bbl to whatever is waiting at the end, every ${r4(nomIv.intervalDays)} days.`);
w('Three answers about one pipe, and not one of them can be derived from the other two.');
w();

console.log(out.join('\n'));
