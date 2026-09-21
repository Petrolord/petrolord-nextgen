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
  SOKU_STEEP_UP_FT, SOKU_STEEP_UP_SCFD, SOKU_STARVED_P1_PSIA,
  SUM_K_AT_LIMIT, SUM_K_JUST_UNDER, ROUGHNESS_AT_LIMIT, ROUGHNESS_JUST_UNDER,
  EFFICIENCY_AT_LIMIT, EFFICIENCY_JUST_OVER, HOLDUP_AT_LIMIT, HOLDUP_JUST_OVER,
  ALLOWANCE_AT_LIMIT, ALLOWANCE_JUST_UNDER, SWEPT_AT_LIMIT, SWEPT_JUST_UNDER,
  VERTICAL_RUN_FT, TALLER_THAN_LONG_FT, MILE_PROBE_LENGTH_MI,
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
  EXPONENT_PROBE_BORES_IN,
} from '/root/fc-wip-linesizing/fc2_fields.mjs';

const ROOT = process.env.FC2_ENGINES || '/root/wt-fc2-nextgen/packages/engines';
const H = await import(`${ROOT}/engines/facilities/lineHydraulics.js`);
const C = await import(`${ROOT}/engines/production/chokePerformance.js`);
const P = await import(`${ROOT}/engines/production/pipeSchedule.js`);
const G = JSON.parse(fs.readFileSync(`${ROOT}/test-data/facilities/goldens/linehydraulics_cases.json`, 'utf8'));

const out = [];
const w = (s = '') => out.push(s);
const num = (x, n) => (x === null || x === undefined || Number.isNaN(Number(x)) ? 'null' : Number(x).toFixed(n));
const e6 = (x) => num(x, 6);    // ft/s, psi, inches, ratios, hours, design factors
const r4 = (x) => num(x, 4);    // scfd, Reynolds numbers, barrels, days
const raw = (x) => (Number.isFinite(x) ? String(x) : String(x));
const soft = (r) => (r && r.error ? `{ error: "${r.error}" }` : 'no error');
/** What a caller actually gets back when the engine neither refuses nor
 *  answers: the whole return, so the SHAPE is on the page and not only the
 *  number. */
const shape = (r) => JSON.stringify(r);
/** A DIFFERENCE that may be nothing but floating point noise. Printed in
 *  exponential form, because a fixed-decimal rendering turns a last-bit
 *  artefact into "0.000000" or, worse, into "-0.000000", and a digest sentence
 *  that then calls the two figures equal has drifted from its own evidence. */
const ex3 = (x) => (Number.isFinite(x) ? Number(x).toExponential(3) : String(x));

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

/** Atmospheric, the FLOOR of the outlet-pressure bracket. The module does not
 *  export it, so it is measured the way the mile is: push the requested rate
 *  up until the solve refuses, and the outlet it converges on at the largest
 *  rate it still accepts is the floor itself. */
const bracketFloorPsia = (() => {
  const at = (q) => H.gasOutletPressure({ equation: 'weymouth', qScfd: q, ...SOKU });
  let lo = 1e6; let hi = 1e12;
  for (let i = 0; i < 200; i += 1) {
    const mid = (lo + hi) / 2;
    if (at(mid).error) hi = mid; else lo = mid;
  }
  return { floor: at(lo).p2Psia, largestRate: lo };
})();

// ------------------------------------------------------------------ header
w('# FC2 Line Sizing & Hydraulics. Teaching digest.');
w('# Liquid work prints to six decimals (ft per s, psi, inches, ratios, hours); friction factors and the elevation group factors print to ten decimals, which is the precision a field graded to a billionth actually needs; gas rates, Reynolds numbers, barrels and days print to four decimals; counts are whole numbers.');
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
w('Those are states the METHOD has no answer for. Inputs that are not physically meaningful at all, a negative roughness or an efficiency above one or a corrosion allowance that removes metal, are refused as well, and the catalogue of them with the boundary either side is in Section 16.');
w();
w('# The units it works in. Seven constants the module keeps to itself are measured here by asking the engine a question about itself, because a number typed into this file would not be an engine return.');
const mGc = liquidAt(OGBIA, { sumK: 1 });
w(`gc, measured as the liquid density times the velocity squared over twice 144 times the one-velocity-head fittings loss: ${e6((OGBIA.rhoLbFt3 * mGc.vFtS * mGc.vFtS) / (2 * 144 * mGc.dpFittingsPsi))} lbm ft per lbf s2 (derived from the engine's own velocity ${e6(mGc.vFtS)} ft/s and fittings loss ${e6(mGc.dpFittingsPsi)} psi at a resistance sum of one).`);
w(`one centipoise in lbm per ft per s, measured as the density times the velocity times the bore in feet over the viscosity times the Reynolds number: ${(((OGBIA.rhoLbFt3 * OG.vFtS * (OGBIA.idIn / 12)) / (OGBIA.muCp * OG.re))).toExponential(10)} (derived from the engine's velocity ${e6(OG.vFtS)} ft/s and Reynolds number ${r4(OG.re)}).`);
const mVol = H.lineVolumeBbl({ idIn: OGBIA.idIn, lengthFt: OGBIA.lengthFt });
const mArea = (Math.PI * OGBIA.idIn * OGBIA.idIn) / (4 * 144);
w(`cubic feet per barrel, measured as the flow area times the length over the engine's line volume: ${num((mArea * OGBIA.lengthFt) / mVol, 13)} (derived from the engine's line volume ${r4(mVol)} bbl).`);
w(`seconds per day, measured as the rate times the cubic feet per barrel above over the area times the velocity: ${e6((OGBIA.qBpd * ((mArea * OGBIA.lengthFt) / mVol)) / (mArea * OG.vFtS))} (derived on the row).`);
w(`seconds per hour, measured as a length over the pig speed times the engine's run hours: ${e6(OGBIA_PIG.lengthFt / (OGBIA_PIG.pigSpeedFtS * H.pigRun(OGBIA_PIG).runHours))} (derived from the engine's run time ${e6(H.pigRun(OGBIA_PIG).runHours)} h).`);
// The feet in a mile is recoverable because the gas forms compare an
// elevation change against the line's OWN LENGTH, so the constant is consumed
// by a guard and the guard can be asked where it begins: halve between a rise
// the engine accepts and a rise it refuses, on a line one mile long.
const mileAccepts = (dz) => H.weymouthQ({ ...SOKU, lengthMi: MILE_PROBE_LENGTH_MI, elevChangeFt: dz }).error
  !== 'elevation change cannot exceed line length';
let mLo = 0; let mHi = 1e6;
for (let i = 0; i < 200; i += 1) {
  const mid = (mLo + mHi) / 2;
  if (mid === mLo || mid === mHi) break;
  if (mileAccepts(mid)) mLo = mid; else mHi = mid;
}
w(`the feet in a mile, measured as the largest rise the engine accepts on a gas line ${e6(MILE_PROBE_LENGTH_MI)} mile long: ${num(mLo, 9)} ft is accepted and the next representable value above it, ${(mHi - mLo).toExponential(3)} ft higher, is refused (engine).`);
w(`atmospheric pressure, measured as the floor of the outlet-pressure bracket: the largest rate this trunk accepts is ${r4(bracketFloorPsia.largestRate)} scfd, the outlet the solve converges on there is ${e6(bracketFloorPsia.floor)} psia, and one scfd more is refused (engine).`);
w(`The base conditions the published gas forms are stated at, which the module DOES export: ${e6(H.BASE_CONDITIONS.tbR)} degR and ${e6(H.BASE_CONDITIONS.pbPsia)} psia. That base pressure is not atmospheric: the two differ by ${e6(bracketFloorPsia.floor - H.BASE_CONDITIONS.pbPsia)} psi (derived from the two figures on these rows).`);
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
const LAM_RE = 1000;
const lamF = H.frictionFactor({ re: LAM_RE, relRough: 0 }).f;
const SMOOTH_RE = 1e5;
const xSmooth = 1 / Math.sqrt(H.frictionFactor({ re: SMOOTH_RE, relRough: 0 }).f);
const ROUGH_RR = 0.01;
const ROUGH_RE = 1e14;
const xRough = 1 / Math.sqrt(H.frictionFactor({ re: ROUGH_RE, relRough: ROUGH_RR }).f);
w('# The three constants of the two friction laws. The module exports none of them, so each is measured by choosing inputs that isolate it and reading back what the engine returns.');
w(`the laminar numerator, measured on a smooth pipe below the branch as the friction factor times its own Reynolds number: ${e6(lamF * LAM_RE)} (derived from the engine's ${num(lamF, 12)} at Reynolds ${r4(LAM_RE)}).`);
w(`the Colebrook Reynolds numerator, measured on a SMOOTH pipe where the roughness term is exactly zero, as the Reynolds number times ten to the power of minus half the inverse square root of f, divided by that same inverse square root: ${e6(SMOOTH_RE * Math.pow(10, -xSmooth / 2) / xSmooth)} (derived from the engine's ${num(H.frictionFactor({ re: SMOOTH_RE, relRough: 0 }).f, 12)} at Reynolds ${r4(SMOOTH_RE)}).`);
w(`the Colebrook roughness divisor, measured in the FULLY ROUGH limit where the Reynolds term falls away, as the relative roughness times ten to the power of half the inverse square root of f: ${e6(ROUGH_RR * Math.pow(10, xRough / 2))} (derived from the engine's ${num(H.frictionFactor({ re: ROUGH_RE, relRough: ROUGH_RR }).f, 12)} at Reynolds ${r4(ROUGH_RE)} and relative roughness ${e6(ROUGH_RR)}).`);
w();
w('Relative roughness alone, at one Reynolds number, which is the vertical axis of the Moody chart:');
w(`| relative roughness | f at Reynolds ${r4(RE_LOW_FOR_ROUGHNESS_TABLE)} | f at Reynolds ${r4(RE_HIGH_FOR_ROUGHNESS_TABLE)} |`);
w('| --- | --- | --- |');
RELATIVE_ROUGHNESS_SWEEP.forEach((rr) => {
  w(`| ${num(rr, 6)} | ${num(H.frictionFactor({ re: RE_LOW_FOR_ROUGHNESS_TABLE, relRough: rr }).f, 12)} | ${num(H.frictionFactor({ re: RE_HIGH_FOR_ROUGHNESS_TABLE, relRough: rr }).f, 12)} |`);
});
const rrSmooth = RELATIVE_ROUGHNESS_SWEEP[0];
const rrRoughest = RELATIVE_ROUGHNESS_SWEEP[RELATIVE_ROUGHNESS_SWEEP.length - 1];
const fAt = (rr, re) => H.frictionFactor({ re, relRough: rr }).f;
w(`A rough pipe stops caring about the Reynolds number and a smooth one never does, and the two columns say so: on the ${num(rrSmooth, 6)} row the second column is ${num(fAt(rrSmooth, RE_HIGH_FOR_ROUGHNESS_TABLE) / fAt(rrSmooth, RE_LOW_FOR_ROUGHNESS_TABLE), 10)} of the first, and on the ${num(rrRoughest, 6)} row it is ${num(fAt(rrRoughest, RE_HIGH_FOR_ROUGHNESS_TABLE) / fAt(rrRoughest, RE_LOW_FOR_ROUGHNESS_TABLE), 10)} (derived from the two columns on those rows). A thousandfold in Reynolds number moves the smooth pipe and leaves the rough one where it was.`);
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
w(`On a ${e6(OGBIA_MANIFOLD_LENGTH_FT)} ft manifold run carrying the same duty and the same fittings, the pipe costs ${e6(OG_SHORT.dpFrictionPsi)} psi and the fittings cost ${e6(OG_SHORT.dpFittingsPsi)} psi, a share of ${e6(OG_SHORT.dpFittingsPsi / OG_SHORT.dpTotalPsi)} (derived from the two engine values on this row). The fittings did not change; the pipe did.`);
w();
w('Elevation, the same line up and down:');
w('| elevation change ft | friction psi | elevation psi | total psi | gradient psi per ft |');
w('| --- | --- | --- | --- | --- |');
OGBIA_ELEVATION_SWEEP_FT.forEach((dz) => {
  const r = liquidAt(OGBIA, { elevChangeFt: dz });
  w(`| ${e6(dz)} | ${e6(r.dpFrictionPsi)} | ${e6(r.dpElevationPsi)} | ${e6(r.dpTotalPsi)} | ${num(r.gradientPsiPerFt, 10)} |`);
});
const elevRows = OGBIA_ELEVATION_SWEEP_FT.map((dz) => liquidAt(OGBIA, { elevChangeFt: dz }));
w(`The friction column spreads ${e6(Math.max(...elevRows.map((r) => r.dpFrictionPsi)) - Math.min(...elevRows.map((r) => r.dpFrictionPsi)))} psi across the three rows and the two non-zero elevation terms sum to ${e6(elevRows[1].dpElevationPsi + elevRows[2].dpElevationPsi)} psi (both derived from the table above), so a hill is added to a pressure drop rather than mixed into it.`);
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
w(`The engine's own flow area for that bore is ${e6(C.pipeAreaFt2(OGBIA.idIn))} ft2, and the velocity the erosional check reads, ${e6(C.mixtureVelocityFtS({ inSituBpd: OGBIA.qBpd, idIn: OGBIA.idIn }))} ft/s, stands ${e6(C.mixtureVelocityFtS({ inSituBpd: OGBIA.qBpd, idIn: OGBIA.idIn }) - OG.vFtS)} ft/s from the velocity the pressure drop read (derived from the two engine values on this row).`);
w();
w('Density is the whole of the limit: the same c factor against four fluids.');
w('| mixture density lb/ft3 | erosional velocity at c 100 | at c 125 | at c 175 |');
w('| --- | --- | --- | --- |');
EROSIONAL_DENSITY_SWEEP.forEach((rho) => {
  w(`| ${e6(rho)} | ${e6(C.erosionalVelocityFtS({ mixtureDensityLbFt3: rho, cFactor: 100 }))} | ${e6(C.erosionalVelocityFtS({ mixtureDensityLbFt3: rho, cFactor: 125 }))} | ${e6(C.erosionalVelocityFtS({ mixtureDensityLbFt3: rho, cFactor: 175 }))} |`);
});
const cCont = C.erosionalC('continuous').c;
const veLight = C.erosionalVelocityFtS({ mixtureDensityLbFt3: EROSIONAL_DENSITY_SWEEP[0], cFactor: cCont });
const veHeavy = C.erosionalVelocityFtS({ mixtureDensityLbFt3: EROSIONAL_DENSITY_SWEEP[3], cFactor: cCont });
w(`A light gas is allowed to run faster than a dense liquid by the square root of the density ratio, and the two agree to ${(veLight / veHeavy - Math.sqrt(EROSIONAL_DENSITY_SWEEP[3] / EROSIONAL_DENSITY_SWEEP[0])).toExponential(3)} (derived from the velocity ratio on this row and the square root of the two densities it names): at the continuous-service c factor the ${e6(EROSIONAL_DENSITY_SWEEP[0])} lb/ft3 row stands at ${e6(veLight)} ft/s against ${e6(veHeavy)} ft/s at ${e6(EROSIONAL_DENSITY_SWEEP[3])} lb/ft3, a ratio of ${e6(veLight / veHeavy)} (derived from the two rows above).`);
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
w(`The erosional velocity column spreads ${e6(Math.max(...sweepRows.map((r) => r.chk.erosionalFtS)) - Math.min(...sweepRows.map((r) => r.chk.erosionalFtS)))} ft/s across every row (derived from the column above) and reads ${e6(sweepRows[0].chk.erosionalFtS)} ft/s, because it depends on the density and the c factor and not on the bore. What changes down the table is the velocity that has to sit under it.`);
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
w(`| form | rate at ${e6(EXPONENT_PROBE_BORES_IN[0])} in | rate at ${e6(EXPONENT_PROBE_BORES_IN[1])} in | measured exponent |`);
w('| --- | --- | --- | --- |');
gasForms.forEach(([k, fn]) => {
  const a = fn({ ...SOKU, idIn: EXPONENT_PROBE_BORES_IN[0] }).qScfd;
  const b = fn({ ...SOKU, idIn: EXPONENT_PROBE_BORES_IN[1] }).qScfd;
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
w();
w("What that multiplier actually does to each form, derived on every row as the form's own rate at that efficiency over its own rate at an efficiency of 1.000000, and then that same ratio less the efficiency the row was computed at:");
w('| efficiency | weymouth | panhandleA | panhandleB | general | weymouth less e | panhandleA less e | panhandleB less e | general less e |');
w('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
const effDeviation = {};
SOKU_EFFICIENCY_SWEEP.forEach((efficiency) => {
  const ratios = gasForms.map(([k, fn]) => fn({ ...SOKU, efficiency }).qScfd / SOKU_Q[k].qScfd);
  effDeviation[efficiency] = ratios.map((v) => v - efficiency);
  w(`| ${e6(efficiency)} | ${ratios.map((v) => num(v, 12)).join(' | ')} | ${effDeviation[efficiency].map(ex3).join(' | ')} |`);
});
const EFF_LOW = SOKU_EFFICIENCY_SWEEP[0];
const effLinearWorst = Math.max(...SOKU_EFFICIENCY_SWEEP.flatMap((eff) => effDeviation[eff].slice(0, 3).map((v) => Math.abs(v))));
const effGeneralWorst = Math.max(...SOKU_EFFICIENCY_SWEEP.map((eff) => Math.abs(effDeviation[eff][3])));
w(`The four right-hand columns are each form's ratio less the efficiency on that row, in exponential form so that a last-bit artefact cannot be read as a deviation. Across every row the largest of them on Weymouth, Panhandle A and Panhandle B is ${ex3(effLinearWorst)}, which is one step of a double beside one and is what a plain multiplier looks like. The largest on General Flow is ${ex3(effGeneralWorst)}, at an efficiency of ${e6(EFF_LOW)}, and the second over the first is ${ex3(effGeneralWorst / effLinearWorst)} (derived from the two figures on this row). General Flow solves a friction factor against the rate it settles on, so a lower efficiency lowers the rate, the rate moves the Reynolds number, and the friction factor moves with it.`);
w();
w(`# HELD FOR LITERATURE, taught as a limit and never graded: the efficiency factor. Three of the four forms carry it as a plain multiplier and General Flow carries it by the amounts the table above derives, and no publication in this package stands behind any particular value of it. Every graded gas value in this course states its own efficiency.`);
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
const flatAgainQ = H.weymouthQ({ ...SOKU, elevChangeFt: 0 }).qScfd;
w(`A hill does two things and they are not the same thing. It scales the outlet pressure inside the driving group through e to the s, and it changes the length the friction acts over through the equivalent length factor. At zero elevation both collapse to ${num(1, 10)} on the row above, and the Weymouth rate with the hill set to zero is ${r4(flatAgainQ)} scfd against the Section 8 rate of ${r4(SOKU_Q.weymouth.qScfd)} scfd, a difference of ${r4(flatAgainQ - SOKU_Q.weymouth.qScfd)} scfd (derived from the two engine values on this row), so the flat form is what the adjusted form becomes.`);
const elevCoeff = H.elevationAdjustment({ sg: 1, elevChangeFt: 1000, tAvgR: 1, zAvg: 1 });
w(`The coefficient inside s, measured by asking the engine for s at a gravity of one, a thousand feet of rise, an absolute temperature of one and a compressibility of one, then dividing by the thousand feet: ${num(elevCoeff.s / 1000, 12)} (derived from the engine's ${num(elevCoeff.s, 6)}).`);
// THE UNIT SEAM OF THIS SECTION. The rise is in FEET and the length is in
// MILES, and the four forms guard one against the other, so the feet in a mile
// are readable here without being typed: halve between a rise the engine
// accepts and a rise it refuses, on a line of a stated length.
const proMileProbe = (() => {
  const guardMessage = H.weymouthQ({ ...SOKU, lengthMi: MILE_PROBE_LENGTH_MI, elevChangeFt: 1e9 }).error;
  const accepts = (dz) => H.weymouthQ({ ...SOKU, lengthMi: MILE_PROBE_LENGTH_MI, elevChangeFt: dz }).error !== guardMessage;
  let lo = 0; let hi = 1e7;
  for (let i = 0; i < 400; i += 1) {
    const mid = (lo + hi) / 2;
    if (mid === lo || mid === hi) break;
    if (accepts(mid)) lo = mid; else hi = mid;
  }
  return { lo, gap: hi - lo };
})();
w(`The rise is in FEET and the length is in MILES, and the forms guard one against the other, so the conversion is readable here rather than assumed: on a line ${e6(MILE_PROBE_LENGTH_MI)} mile long the largest rise the engine accepts is ${num(proMileProbe.lo, 9)} ft, and the next representable value above it, ${proMileProbe.gap.toExponential(3)} ft higher, is refused (engine).`);
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
w(`Uphill is not the mirror of downhill, because the term is an exponential and an exponential is not symmetric about zero. Averaging the two fractions on the Weymouth row gives ${e6((H.weymouthQ({ ...SOKU, elevChangeFt: SOKU_UP_FT }).qScfd / SOKU_Q.weymouth.qScfd + H.weymouthQ({ ...SOKU, elevChangeFt: SOKU_DOWN_FT }).qScfd / SOKU_Q.weymouth.qScfd) / 2)} (derived from the two fractions on that row), which is close to one and is not one.`);
w();

// --------------------------------------------------------------- SECTION 10
w('# SECTION 10: The outlet pressure (owned by Professional m04)');
w();
w('# App surface: this is the direction the studio actually works in. A designer knows the rate the terminal has contracted for and wants the pressure it will see, which is the inverse of every form above.');
w('The engine has no closed inversion. It bisects on the outlet pressure, calling the published form at each step, inside a bracket that runs from atmospheric up to the pressure at which the driving group vanishes. That upper end is the inlet over the square root of e to the s, and it is NOT the inlet: a hill moves it.');
w(`The FLOOR of that bracket is atmospheric, which the module does not export, so it is measured the way every other constant here is: push the requested rate up until the solve refuses, and read the outlet it converges on at the largest rate it still accepts. The largest rate this trunk accepts is ${r4(bracketFloorPsia.largestRate)} scfd, the outlet there is ${e6(bracketFloorPsia.floor)} psia, and one scfd more is refused (engine). That floor is not the base the published forms report at: it stands ${e6(bracketFloorPsia.floor - H.BASE_CONDITIONS.pbPsia)} psi above the ${e6(H.BASE_CONDITIONS.pbPsia)} psia of Section 7 (derived from the two figures on this row).`);
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
w('The ceiling the bracket ends at, on the SOKU trunk, derived on each row as the inlet over the square root of the engine\'s own e to the s:');
w('| elevation change ft | e to the s | the outlet the rate approaches as it falls to nothing, psia | against the inlet, psi |');
w('| --- | --- | --- | --- |');
[0, SOKU_UP_FT, SOKU_DOWN_FT, SOKU_STEEP_UP_FT, SOKU_STEEP_DOWN_FT].forEach((dz) => {
  const ea = H.elevationAdjustment({ sg: SOKU.sg, elevChangeFt: dz, tAvgR: SOKU.tAvgR, zAvg: SOKU.zAvg });
  const ceiling = SOKU.p1Psia / Math.sqrt(ea.es);
  w(`| ${e6(dz)} | ${num(ea.es, 10)} | ${e6(ceiling)} | ${e6(ceiling - SOKU.p1Psia)} |`);
});
w('A flat line ends its bracket at its own inlet. A DESCENT ends it above the inlet, because the column recovers more head than the friction spends. A CLIMB ends it below, because the column costs head that no rate gets back. Reading the fourth column is reading how much of the answer a bracket of atmospheric-to-the-inlet would have been unable to express.');
w();
const steepOutletPsia = SOKU.p1Psia + SOKU_STEEP_DOWN_ABOVE_INLET_PSI;
const steepQ = H.weymouthQ({ ...SOKU, elevChangeFt: SOKU_STEEP_DOWN_FT, p2Psia: steepOutletPsia });
const steepInv = H.gasOutletPressure({ equation: 'weymouth', qScfd: steepQ.qScfd, ...SOKU, elevChangeFt: SOKU_STEEP_DOWN_FT });
w(`Down ${e6(SOKU_STEEP_DOWN_FT)} ft, the trunk carries ${r4(steepQ.qScfd)} scfd when its outlet stands at ${e6(steepOutletPsia)} psia, which is ${e6(SOKU_STEEP_DOWN_ABOVE_INLET_PSI)} psia ABOVE its inlet of ${e6(SOKU.p1Psia)} psia.`);
w(`Given that same rate the inverse returns ${shape(steepInv)}, and the forward call and the inverse call now differ by ${e6(steepOutletPsia - steepInv.p2Psia)} psi. The drop is NEGATIVE because the line arrives higher than it left, which is the honest reading of a descent and not an error state.`);
// The same return in the digest's six-decimal format, so a lesson or bank that
// quotes the drop as the course prints it resolves against a printed figure.
w(`The inverse returns an outlet of ${e6(steepInv.p2Psia)} psia and a drop of ${e6(steepInv.dpPsi)} psi.`);
const steepQ2 = H.weymouthQ({ ...SOKU, elevChangeFt: SOKU_STEEP_DOWN_FT, p2Psia: SOKU_STEEP_DOWN_P2_PSIA });
const steepInv2 = H.gasOutletPressure({ equation: 'weymouth', qScfd: steepQ2.qScfd, ...SOKU, elevChangeFt: SOKU_STEEP_DOWN_FT });
w(`THE CONTROL. Run the SAME descent with an outlet genuinely BELOW the inlet, ${e6(SOKU_STEEP_DOWN_P2_PSIA)} psia against ${e6(SOKU.p1Psia)} psia: the trunk carries ${r4(steepQ2.qScfd)} scfd and the inverse recovers ${e6(steepInv2.p2Psia)} psia, an error of ${e6(steepInv2.p2Psia - SOKU_STEEP_DOWN_P2_PSIA)} psi. Both answers come out of the same bisection. A search whose answer lies outside its bracket and a search that cannot converge look identical from a single case, and only a case with its answer inside the bracket tells the two apart.`);
w();
const upInv = H.gasOutletPressure({ equation: 'weymouth', qScfd: SOKU_STEEP_UP_SCFD, ...SOKU, elevChangeFt: SOKU_STEEP_UP_FT });
const upEa = H.elevationAdjustment({ sg: SOKU.sg, elevChangeFt: SOKU_STEEP_UP_FT, tAvgR: SOKU.tAvgR, zAvg: SOKU.zAvg });
const upCeilingPsia = SOKU.p1Psia / Math.sqrt(upEa.es);
w(`The climb is the same bracket read from the other side, and it is the commoner case. Up ${e6(SOKU_STEEP_UP_FT)} ft, asked for ${r4(SOKU_STEEP_UP_SCFD)} scfd, the trunk delivers at ${e6(upInv.p2Psia)} psia for a drop of ${e6(upInv.dpPsi)} psi, and the ceiling on the table above, ${e6(upCeilingPsia)} psia, stands ${e6(upCeilingPsia - upInv.p2Psia)} psi above that delivery (derived from the two figures on this row) and is as close to the inlet as any rate can bring it.`);
w(`And a climb the inlet cannot pay for at all is refused rather than answered. The same hill under a near-atmospheric inlet of ${e6(SOKU_STARVED_P1_PSIA)} psia: ${soft(H.gasOutletPressure({ equation: 'weymouth', qScfd: SOKU_STEEP_UP_SCFD, ...SOKU, p1Psia: SOKU_STARVED_P1_PSIA, elevChangeFt: SOKU_STEEP_UP_FT }))}`);
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
w(`What a traverse drops: the one-shot call carrying the isometric's ${e6(OGBIA_K.sumK)} velocity heads spends ${e6(trWithK.dpTotalPsi)} psi, and the traverse of the same line spends ${e6(trFlat.dpTotalPsi)} psi. The gap of ${e6(trWithK.dpTotalPsi - trFlat.dpTotalPsi)} psi is the one-shot call's own fittings term, which the engine returns separately as ${e6(trWithK.dpFittingsPsi)} psi, the two differing by ${ex3((trWithK.dpTotalPsi - trFlat.dpTotalPsi) - trWithK.dpFittingsPsi)} psi (derived from the three engine values on this row), because liquidLineTraverse has no resistance-sum argument at all.`);
w();
const DL = OGBIA_DEAD_LINE;
const trVac = H.liquidLineTraverse({
  p1Psia: DL.p1Psia, qBpd: DL.qBpd, idIn: DL.idIn, rhoLbFt3: DL.rhoLbFt3,
  muCp: DL.muCp, profile: [{ lengthFt: DL.lengthFt }],
});
const trVacDrop = H.liquidLineDrop({
  qBpd: DL.qBpd, idIn: DL.idIn, lengthFt: DL.lengthFt, rhoLbFt3: DL.rhoLbFt3, muCp: DL.muCp,
});
w(`Where a line dies, and what the engine says about it: ${e6(DL.qBpd)} bpd of ${e6(DL.rhoLbFt3)} lb/ft3 at ${e6(DL.muCp)} cp through ${e6(DL.idIn)} in over ${e6(DL.lengthFt)} ft, entering at ${e6(DL.p1Psia)} psia.`);
w(`The traverse refuses: ${soft(trVac)}`);
w(`It refuses with the evidence attached rather than instead of it. The stations it managed to stand behind: ${trVac.stations.length}, the last of them at ${e6(trVac.stations[trVac.stations.length - 1].distanceFt)} ft and ${e6(trVac.stations[trVac.stations.length - 1].pPsia)} psia. The distance it died at: ${e6(trVac.diedAtFt)} ft. The pressure the arithmetic actually produced there: ${e6(trVac.diedAtPsia)} psia, which is not a pressure.`);
w(`The single call underneath still answers, because a DROP is not a PRESSURE and nothing about it is unphysical: the same line spends ${e6(trVacDrop.dpTotalPsi)} psi, and the inlet less that drop is ${e6(DL.p1Psia - trVacDrop.dpTotalPsi)} psia (derived from the two figures on this row), which is the figure the traverse reported at the far end. A rate that costs more than the inlet holds is a rate the line cannot pass, and the traverse is the call that knows the inlet.`);
w();

// --------------------------------------------------------------- SECTION 12
w('# SECTION 12: The Professional reading, a trunk end to end (owned by Professional m06)');
w();
w(`SOKU end to end: ${e6(SOKU.idIn)} in over ${e6(SOKU.lengthMi)} miles from ${e6(SOKU.p1Psia)} to ${e6(SOKU.p2Psia)} psia gives a driving group of ${r4(SOKU.p1Psia * SOKU.p1Psia - SOKU.p2Psia * SOKU.p2Psia)} psia squared (derived); Weymouth reads ${r4(SOKU_Q.weymouth.qScfd)} scfd, Panhandle A ${r4(SOKU_Q.panhandleA.qScfd)}, Panhandle B ${r4(SOKU_Q.panhandleB.qScfd)} and General Flow ${r4(SOKU_Q.general.qScfd)} at a friction factor of ${num(SOKU_Q.general.fDarcy, 10)}; put the trunk up ${e6(SOKU_UP_FT)} ft and the Weymouth rate falls to ${r4(H.weymouthQ({ ...SOKU, elevChangeFt: SOKU_UP_FT }).qScfd)}, down the same and it rises to ${r4(H.weymouthQ({ ...SOKU, elevChangeFt: SOKU_DOWN_FT }).qScfd)}; and asked for ${r4(SOKU_TARGET_SCFD)} scfd the line delivers at ${e6(tgt.p2Psia)} psia.`);
const formSpread = Math.max(...gasForms.map(([k]) => SOKU_Q[k].qScfd)) / Math.min(...gasForms.map(([k]) => SOKU_Q[k].qScfd));
const boreLoIn = SOKU_BORE_SWEEP[SOKU_BORE_SWEEP.length - 2];
const boreHiIn = SOKU_BORE_SWEEP[SOKU_BORE_SWEEP.length - 1];
const qBoreLo = H.weymouthQ({ ...SOKU, idIn: boreLoIn }).qScfd;
const qBoreHi = H.weymouthQ({ ...SOKU, idIn: boreHiIn }).qScfd;
w(`Four forms and one line. The spread across the four forms is ${e6(formSpread)}. One step of bore on the same trunk through Weymouth, from ${e6(boreLoIn)} in to ${e6(boreHiIn)} in, runs ${r4(qBoreLo)} scfd to ${r4(qBoreHi)} scfd, a spread of ${e6(qBoreHi / qBoreLo)} (derived from the two engine rates on this row). The bore spread over the form spread is ${e6((qBoreHi / qBoreLo) / formSpread)} (derived from the two figures on this row), so on this trunk one step of bore moves the answer further than the choice of form does, and a designer has to defend both.`);
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
w(`Class 4 asks for ${e6(c4w.tPressureIn / c1w.tPressureIn)} times the pressure wall of Class 1 on the same pipe at the same pressure (derived from the two rows above). What moved it is the route rather than the fluid.`);
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
w(`Read the rating back off the wall the mill actually rolled, ${e6(SOKU_WALL_AS_BUILT_IN)} in: with the allowance respected the line rates ${e6(maopWith.maopPsig)} psig, and with the allowance left out of the call it rates ${e6(maopWithout.maopPsig)} psig, which is ${e6(maopWithout.maopPsig / maopWith.maopPsig)} times the rating the allowance produces (derived from the two engine values on this row). Both calls are legal and neither warns.`);
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
w(`At a holdup of zero the sweep is ${r4(H.sweptLiquidBbl({ ...OGBIA_PIG, holdupFrac: 0 }).sweptBbl)} bbl, and at a holdup of one it is ${r4(H.sweptLiquidBbl({ ...OGBIA_PIG, holdupFrac: HOLDUP_AT_LIMIT }).sweptBbl)} bbl against a line volume of ${r4(H.lineVolumeBbl(OGBIA_PIG))} bbl, the two differing by ${r4(H.sweptLiquidBbl({ ...OGBIA_PIG, holdupFrac: HOLDUP_AT_LIMIT }).sweptBbl - H.lineVolumeBbl(OGBIA_PIG))} bbl (derived from the two engine values on this row), which is the whole line. The interval collapses as the holdup rises, and past a point the catcher cannot take the sweep at all and the engine refuses rather than returning a negative interval.`);
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
// The run time is a length over a speed, and the engine reports it in HOURS
// while it is handed feet and feet per second. The seconds in that hour are
// therefore measurable here without typing one, by asking the engine for the
// run time of two of the published cases and reading the SLOPE between them:
// the extra length over the speed times the extra run time. Section 1 measures
// the same constant from the OGBIA duty; this is the pigging section measuring
// it out of the pigging goldens, so an Expert reader never has to leave the
// tier to see where the number came from.
const pigSlopeA = G.pigging[0];
const pigSlopeB = G.pigging[1];
const pigHoursA = H.pigRun({ lengthFt: pigSlopeA.lengthFt, pigSpeedFtS: GOLDEN_PIG_SPEED_FT_S }).runHours;
const pigHoursB = H.pigRun({ lengthFt: pigSlopeB.lengthFt, pigSpeedFtS: GOLDEN_PIG_SPEED_FT_S }).runHours;
w('The seconds in an hour, measured out of this section rather than assumed. The engine is handed feet and feet per second and answers in HOURS, so the conversion it keeps to itself is the slope of the run time against the length:');
w(`the seconds per hour, measured as the extra length between two published cases over the speed times the extra run time the engine reports for them: ${e6((pigSlopeB.lengthFt - pigSlopeA.lengthFt) / (GOLDEN_PIG_SPEED_FT_S * (pigHoursB - pigHoursA)))} (derived from the engine's run times ${e6(pigHoursA)} h over ${e6(pigSlopeA.lengthFt)} ft and ${e6(pigHoursB)} h over ${e6(pigSlopeB.lengthFt)} ft, both at ${e6(GOLDEN_PIG_SPEED_FT_S)} ft/s).`);
w(`The single-case reading agrees: the OGBIA duty's own length over its speed times its run time is ${e6(OGBIA_PIG.lengthFt / (OGBIA_PIG.pigSpeedFtS * H.pigRun(OGBIA_PIG).runHours))}, the two differing by ${e6((pigSlopeB.lengthFt - pigSlopeA.lengthFt) / (GOLDEN_PIG_SPEED_FT_S * (pigHoursB - pigHoursA)) - OGBIA_PIG.lengthFt / (OGBIA_PIG.pigSpeedFtS * H.pigRun(OGBIA_PIG).runHours))} (derived from the two figures on this row).`);
w();

// --------------------------------------------------------------- SECTION 15
w('# SECTION 15: Where the correlations stop (owned by Expert m03)');
w();
w(`The jump at the branch, again and exactly: on the OGBIA pipe the friction factor is ${num(jLo.f, 10)} at Reynolds ${num(RE_JUST_BELOW_BRANCH, 7)} and ${num(jHi.f, 10)} at Reynolds ${r4(RE_AT_BRANCH)}, a ratio of ${e6(jHi.f / jLo.f)} (derived from the two engine values on this row).`);
w('Nothing physical happens in that interval. The engine leaves the laminar law and starts the turbulent one, and the discontinuity is the price of having no correlation for the band between them.');
w();
const COLEBROOK_PUBLISHED_TO = 0.05;
const pastPublished = COLEBROOK_DOMAIN_SWEEP.filter((rr) => rr > COLEBROOK_PUBLISHED_TO);
// PRINTED AS PUBLISHED, not to six decimals: "about 0.05" is the figure the
// literature states and the figure every lesson and bank quotes.
w(`Colebrook past the roughness it was published for, which reaches about ${COLEBROOK_PUBLISHED_TO}:`);
w(`| relative roughness | f at Reynolds ${r4(RE_FOR_DOMAIN_SWEEP)} |`);
w('| --- | --- |');
COLEBROOK_DOMAIN_SWEEP.forEach((rr) => w(`| ${e6(rr)} | ${num(H.frictionFactor({ re: RE_FOR_DOMAIN_SWEEP, relRough: rr }).f, 10)} |`));
w(`The engine answers all ${COLEBROOK_DOMAIN_SWEEP.length} and flags none of them. ${pastPublished.length} of the rows stand above ${COLEBROOK_PUBLISHED_TO} (derived from the column above), and every one of those is an extrapolation of a fitted curve into a region where the pipe is more obstruction than pipe.`);
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
w(`On the same line at its full duty the two sit at ${e6(SOKU_Q.weymouth.qScfd / SOKU_Q.general.qScfd)} of each other, so the distance from agreement is ${e6(Math.abs(1 - deadW.qScfd / deadG.qScfd))} on the nearly dead line against ${e6(Math.abs(1 - SOKU_Q.weymouth.qScfd / SOKU_Q.general.qScfd))} at full duty (derived from the two ratios on these rows), and neither form says which it is on.`);
w();
w('Neither iteration in this module reports whether it converged. The friction factor solve runs a fixed point and the General Flow solve runs a rate and a friction factor against each other, and both return their last iterate with no flag beside it. They do converge everywhere this digest looked, which is exactly what makes the absence easy to miss.');
w();

// --------------------------------------------------------------- SECTION 16
w('# SECTION 16: What it refuses, and what a refusal looks like (owned by Expert m04)');
w();
w('A refusal in this engine is an object carrying an `error` string. It is never a thrown exception, never a null and never a bare number, and the shape is the contract: a caller checks a property rather than inspecting a value. That is exactly why a NaN or an Infinity returned WITHOUT an error is worse than no guard at all. It passes the check and then propagates into whatever is downstream, which for this engine is a sizing sweep, a marched profile and a wall specification.');
w('Three returns sit outside that contract on purpose. The Reynolds number and the line volume are bare numbers with nowhere to put a message, so they answer NaN by documented contract and the functions that wrap them refuse in words. The friction factor carries its refusal in the regime it already returns. Read the next three rows knowing that a NaN has no JSON spelling and serialises as null: the engine returns NaN, and null is what printing it does.');
w(`- the Reynolds number of a line with no viscosity: ${raw(H.reynoldsNumber({ rhoLbFt3: OGBIA.rhoLbFt3, vFtS: OG.vFtS, idIn: OGBIA.idIn, muCp: 0 }))}`);
w(`- the volume of a line with no bore: ${raw(H.lineVolumeBbl({ idIn: 0, lengthFt: OGBIA.lengthFt }))}`);
w(`- the friction factor at a negative relative roughness: ${shape(H.frictionFactor({ re: OG.re, relRough: ROUGHNESS_JUST_UNDER / OGBIA.idIn }))}`);
w();
w('Inputs that have no physical meaning, and the message each one produces, verbatim:');
const REFUSAL_PROBES = [
  ['a negative resistance sum', () => liquidAt(OGBIA, { sumK: SUM_K_JUST_UNDER }), 'liquidLineDrop'],
  ['a negative roughness', () => liquidAt(OGBIA, { roughnessIn: ROUGHNESS_JUST_UNDER }), 'liquidLineDrop'],
  ['a liquid line that rises further than its own length', () => H.liquidLineDrop({ ...OGBIA, lengthFt: VERTICAL_RUN_FT, elevChangeFt: TALLER_THAN_LONG_FT }), 'liquidLineDrop'],
  ['a traverse with no inlet pressure', () => H.liquidLineTraverse({ qBpd: OGBIA.qBpd, idIn: OGBIA.idIn, rhoLbFt3: OGBIA.rhoLbFt3, muCp: OGBIA.muCp, roughnessIn: OGBIA.roughnessIn, profile: OGBIA_PROFILE_FLAT }), 'liquidLineTraverse'],
  ['a gas line at an efficiency above one', () => H.weymouthQ({ ...SOKU, efficiency: EFFICIENCY_JUST_OVER }), 'weymouthQ'],
  ['a gas line at a negative efficiency', () => H.weymouthQ({ ...SOKU, efficiency: -EFFICIENCY_AT_LIMIT }), 'weymouthQ'],
  ['a gas line of no length', () => H.weymouthQ({ ...SOKU, lengthMi: 0 }), 'weymouthQ'],
  ['a gas line of negative length', () => H.weymouthQ({ ...SOKU, lengthMi: -SOKU.lengthMi }), 'weymouthQ'],
  ['a gas line of negative bore', () => H.weymouthQ({ ...SOKU, idIn: -SOKU.idIn }), 'weymouthQ'],
  ['a gas at a compressibility of zero', () => H.weymouthQ({ ...SOKU, zAvg: 0 }), 'weymouthQ'],
  ['a gas at an absolute temperature of zero', () => H.weymouthQ({ ...SOKU, tAvgR: 0 }), 'weymouthQ'],
  ['a gas of no gravity', () => H.panhandleAQ({ ...SOKU, sg: 0 }), 'panhandleAQ'],
  ['a gas line that rises further than its own length', () => H.weymouthQ({ ...SOKU, lengthMi: MILE_PROBE_LENGTH_MI, elevChangeFt: SOKU_STEEP_UP_FT * 10 }), 'weymouthQ'],
  ['General Flow with no gas viscosity', () => H.generalFlowQ({ ...SOKU, muCp: 0 }), 'generalFlowQ'],
  ['General Flow at a negative roughness', () => H.generalFlowQ({ ...SOKU, roughnessIn: ROUGHNESS_JUST_UNDER }), 'generalFlowQ'],
  ['an elevation group at a compressibility of zero', () => H.elevationAdjustment({ sg: SOKU.sg, elevChangeFt: SOKU_UP_FT, tAvgR: SOKU.tAvgR, zAvg: 0 }), 'elevationAdjustment'],
  ['a wall at a joint factor of zero', () => H.requiredWallIn({ ...SOKU_WALL, jointFactor: 0 }), 'requiredWallIn'],
  ['a wall at a temperature derate of zero', () => H.requiredWallIn({ ...SOKU_WALL, tempDerate: 0 }), 'requiredWallIn'],
  ['a wall with a negative corrosion allowance', () => H.requiredWallIn({ ...SOKU_WALL, corrosionAllowanceIn: ALLOWANCE_JUST_UNDER }), 'requiredWallIn'],
  ['a rating with a negative corrosion allowance', () => H.maopPsig({ ...SOKU_WALL, wallIn: SOKU_WALL_AS_BUILT_IN, corrosionAllowanceIn: ALLOWANCE_JUST_UNDER }), 'maopPsig'],
  ['a sweep with no bore', () => H.sweptLiquidBbl({ idIn: 0, lengthFt: OGBIA_PIG.lengthFt, holdupFrac: OGBIA_HOLDUP_NOMINAL }), 'sweptLiquidBbl'],
  ['a sweep of negative length', () => H.sweptLiquidBbl({ idIn: OGBIA_PIG.idIn, lengthFt: -OGBIA_PIG.lengthFt, holdupFrac: OGBIA_HOLDUP_NOMINAL }), 'sweptLiquidBbl'],
  ['an interval on a negative sweep', () => H.piggingInterval({ maxSlugBbl: OGBIA_CATCHER_BBL, dropoutBpd: OGBIA_DROPOUT_BPD, sweptBbl: SWEPT_JUST_UNDER }), 'piggingInterval'],
  ['an outlet solve on a climb the inlet cannot pay for', () => H.gasOutletPressure({ equation: 'weymouth', qScfd: SOKU_STEEP_UP_SCFD, ...SOKU, p1Psia: SOKU_STARVED_P1_PSIA, elevChangeFt: SOKU_STEEP_UP_FT }), 'gasOutletPressure'],
];
REFUSAL_PROBES.forEach(([label, fn]) => w(`- ${label}: ${soft(fn())}`));
// THE COUNTS A READER OF THIS CATALOGUE ACTUALLY NEEDS, derived by counting
// the rows rather than by anybody counting them by hand. A message that
// repeats is a guard with more than one way in, and the two kinds of way in
// are worth separating: ONE GUARD REACHED FROM TWO FUNCTIONS, and ONE
// FUNCTION REFUSING TWO DIFFERENT BAD VALUES.
const refusalMsgs = REFUSAL_PROBES.map(([, fn, fname]) => [(fn().error || ''), fname]);
const msgCount = {};
const msgFns = {};
refusalMsgs.forEach(([m, fname]) => {
  msgCount[m] = (msgCount[m] || 0) + 1;
  (msgFns[m] = msgFns[m] || []).push(fname);
});
const distinctMsgs = Object.keys(msgCount).length;
const repeated = Object.keys(msgCount).filter((m) => msgCount[m] > 1);
const twoFunctions = repeated.filter((m) => new Set(msgFns[m]).size > 1);
const twoValues = repeated.filter((m) => new Set(msgFns[m]).size === 1);
w(`That catalogue is ${REFUSAL_PROBES.length} entries carrying ${distinctMsgs} distinct messages (derived by counting the rows above and the messages on them), so ${repeated.length} messages appear more than once. They split ${twoFunctions.length} and ${twoValues.length} (derived from the function each row called): ${twoFunctions.length} are ONE GUARD reached from TWO DIFFERENT FUNCTIONS, and ${twoValues.length} are ONE FUNCTION refusing TWO DIFFERENT bad values. A reader who counts messages rather than entries is counting guards rather than ways in, and the two numbers are not the same number.`);
w();
w('Every one of those guards has a boundary, and the boundary is where the teaching is: a resistance sum of zero is a line with no fittings and is perfectly legal, an efficiency of exactly one is the ideal the forms are written for, a holdup of one is a line running full, and a line exactly as tall as it is long is vertical. The engine is handed the value on each side and says which it took:');
w('| guard | value | the engine |');
w('| --- | --- | --- |');
[
  ['the resistance sum', SUM_K_AT_LIMIT, () => liquidAt(OGBIA, { sumK: SUM_K_AT_LIMIT })],
  ['the resistance sum', SUM_K_JUST_UNDER, () => liquidAt(OGBIA, { sumK: SUM_K_JUST_UNDER })],
  ['the absolute roughness', ROUGHNESS_AT_LIMIT, () => liquidAt(OGBIA, { roughnessIn: ROUGHNESS_AT_LIMIT })],
  ['the absolute roughness', ROUGHNESS_JUST_UNDER, () => liquidAt(OGBIA, { roughnessIn: ROUGHNESS_JUST_UNDER })],
  ['the rise of a liquid line against its length', VERTICAL_RUN_FT, () => H.liquidLineDrop({ ...OGBIA, lengthFt: VERTICAL_RUN_FT, elevChangeFt: VERTICAL_RUN_FT })],
  ['the rise of a liquid line against its length', TALLER_THAN_LONG_FT, () => H.liquidLineDrop({ ...OGBIA, lengthFt: VERTICAL_RUN_FT, elevChangeFt: TALLER_THAN_LONG_FT })],
  ['the transmission efficiency', EFFICIENCY_AT_LIMIT, () => H.weymouthQ({ ...SOKU, efficiency: EFFICIENCY_AT_LIMIT })],
  ['the transmission efficiency', EFFICIENCY_JUST_OVER, () => H.weymouthQ({ ...SOKU, efficiency: EFFICIENCY_JUST_OVER })],
  ['the liquid holdup', HOLDUP_AT_LIMIT, () => H.sweptLiquidBbl({ ...OGBIA_PIG, holdupFrac: HOLDUP_AT_LIMIT })],
  ['the liquid holdup', HOLDUP_JUST_OVER, () => H.sweptLiquidBbl({ ...OGBIA_PIG, holdupFrac: HOLDUP_JUST_OVER })],
  ['the corrosion allowance', ALLOWANCE_AT_LIMIT, () => H.requiredWallIn({ ...SOKU_WALL, corrosionAllowanceIn: ALLOWANCE_AT_LIMIT })],
  ['the corrosion allowance', ALLOWANCE_JUST_UNDER, () => H.requiredWallIn({ ...SOKU_WALL, corrosionAllowanceIn: ALLOWANCE_JUST_UNDER })],
  ['the swept volume', SWEPT_AT_LIMIT, () => H.piggingInterval({ maxSlugBbl: OGBIA_CATCHER_BBL, dropoutBpd: OGBIA_DROPOUT_BPD, sweptBbl: SWEPT_AT_LIMIT })],
  ['the swept volume', SWEPT_JUST_UNDER, () => H.piggingInterval({ maxSlugBbl: OGBIA_CATCHER_BBL, dropoutBpd: OGBIA_DROPOUT_BPD, sweptBbl: SWEPT_JUST_UNDER })],
].forEach(([guard, value, fn]) => w(`| ${guard} | ${num(value, 6)} | ${fn().error ? 'refuses' : 'answers'} |`));
w('A guard that refuses its own limit is as wrong as one that accepts nonsense, which is why both sides are read rather than one.');
w();
// The gas elevation guard compares a rise in FEET against a length in MILES,
// so reading its boundary measures the feet in a mile the guard is built on.
// The engine is asked, never told: bisect between a rise it accepts and a rise
// it refuses, on two lengths, and divide. Section 1 reads the same guard once
// on a one mile line; this is Section 16 reading it as a guard, on both sides,
// which is what every other row of this section does.
const guardMileProbe = (lengthMi) => {
  // The guard's own message, ASKED OF THE ENGINE with a rise no line could
  // have, so no refusal string is typed into this probe.
  const guardMessage = H.weymouthQ({ ...SOKU, lengthMi, elevChangeFt: 1e9 }).error;
  const accepts = (dz) => H.weymouthQ({ ...SOKU, lengthMi, elevChangeFt: dz }).error !== guardMessage;
  let lo = 0; let hi = 1e7;
  for (let i = 0; i < 400; i += 1) {
    const mid = (lo + hi) / 2;
    if (mid === lo || mid === hi) break;
    if (accepts(mid)) lo = mid; else hi = mid;
  }
  return { lo, gap: hi - lo, perMile: lo / lengthMi };
};
const guardMileRows = [MILE_PROBE_LENGTH_MI, SOKU.lengthMi].map((mi) => ({ mi, ...guardMileProbe(mi) }));
w('That guard on the gas forms is the one that measures a constant. It compares a rise in FEET against a length in MILES, so the largest rise it accepts, divided by the length, is the feet in a mile the module keeps to itself. The engine is handed a rise and says which side of the guard it fell on:');
w('| line length mi | largest rise accepted ft | the next value above it, refused, is higher by ft | accepted rise per mile ft |');
w('| --- | --- | --- | --- |');
guardMileRows.forEach((r) => {
  w(`| ${e6(r.mi)} | ${num(r.lo, 9)} | ${r.gap.toExponential(3)} | ${num(r.perMile, 9)} |`);
});
w(`The last column is the second divided by the first on each row (derived). The two rows differ by ${num(guardMileRows[1].perMile - guardMileRows[0].perMile, 9)} ft per mile (derived from the two figures in that column), so the guard is built on one constant and not on a tolerance. The third column is the floating point step at each magnitude, which is why it grows with the length and is not a band the engine chose.`);
w();
w('What the engine still accepts and arguably should not, and none of it is a number this course grades. The same class of question asked of the catalogues, which answer it three different ways:');
w(`- a fitting the table does not carry: fittingK returns ${raw(P.fittingK('reducer'))}`);
w(`- a roughness the table does not carry: roughnessOf returns ${raw(P.roughnessOf('glass'))}`);
w(`- a grade the table does not carry: gradeYield returns ${raw(P.gradeYield('x55'))}`);
w(`- a pipe size the table does not carry: scheduleRow returns ${shape(P.scheduleRow(5, '40'))}`);
w(`- an erosional service the table does not carry: erosionalC returns ${shape(C.erosionalC(EROSIONAL_UNKNOWN_ID))}`);
w('Four of the five say they do not know. The fifth answers under a label it was not asked for, and it stays that way because the RP 14E table belongs to the wellhead engine that two other studios read, so what an unknown service returns is a decision for that table rather than for this line-sizing chain.');
w(`And the rating still over-rates a line if the caller drops the allowance, because the allowance is an argument of the rating rather than a property of the pipe. It is the pair the wall section already read: the same wall reads ${e6(maopWith.maopPsig)} psig with the allowance and ${e6(maopWithout.maopPsig)} psig without, ${e6(maopWithout.maopPsig / maopWith.maopPsig)} times the rating with the allowance, and the factor is the gross wall over the net rather than anything about this pipe. Both calls are legal, both are correct for what they were asked, and neither warns. A guard cannot fix a question that was fully formed and simply wrong.`);
w();

// --------------------------------------------------------------- SECTION 17
w('# SECTION 17: What the method does not know (owned by Expert m05)');
w();
w('Five things this course teaches as limits and never as answers. The first four are items HELD FOR THE LITERATURE, which means a figure the course uses and no publication in this package stands behind. The fifth is not a figure at all: it is what the published cases in this golden are.');
w(`1. The API RP 14E c factors, ${e6(C.erosionalC('continuous').c)}, ${e6(C.erosionalC('intermittent').c)} and ${e6(C.erosionalC('cleanInhibited').c)}. HELD FOR LITERATURE. The recommended practice says its own figures are conservative, and the third is labelled operator practice with no source.`);
w('2. The efficiency multiplier on all four gas forms. HELD FOR LITERATURE. Nothing in this package stands behind any value of it, and the engine bounding it to above zero and at most one is a bound rather than a source.');
w(`3. The band from Reynolds 2100 to 4000, where the engine computes on the turbulent branch and labels the answer transitional. HELD FOR LITERATURE. The step across the boundary is ${e6(jHi.f / jLo.f)} times.`);
w('4. The fully rough friction law Weymouth assumes. HELD FOR LITERATURE. Section 15 measures it out of the engine and nothing sources it.');
w('5. The published cases in this golden are SYNTHETIC. They come from an independent oracle written in Python from the same physics, in SI units where the engine works in field units, which catches an arithmetic or a unit error and cannot catch a method that is wrong in both files. No measured pipeline is in this course.');
w();
w('And one thing that is not held but simply absent: THE MULTIPHASE HALF IS NOT IN THIS ENGINE. There is no flow regime, no slip, no holdup correlation and no slug model anywhere in it. Wherever a holdup is needed the engine takes it as an input, which is honest and is also a seam a reader has to see rather than infer.');
w();
w('One barrel for the package, measured out of each module by asking that module a question about itself rather than by reading either source:');
const bblLine = (mArea * OGBIA.lengthFt) / mVol;
const veP = C.erosionalVelocityFtS({ mixtureDensityLbFt3: OGBIA.rhoLbFt3, cFactor: C_CONT });
const rateP = C.erosionalRateBpd({ idIn: OGBIA.idIn, mixtureDensityLbFt3: OGBIA.rhoLbFt3, cFactor: C_CONT });
const bblChoke = (veP * C.pipeAreaFt2(OGBIA.idIn) * 86400) / rateP;
w(`- from lineHydraulics, as the flow area times the length over the line volume: ${num(bblLine, 13)} cubic feet per barrel`);
w(`- from chokePerformance, as the erosional velocity times the area times the seconds in a day over the erosional rate: ${num(bblChoke, 13)} cubic feet per barrel`);
w(`The ratio of the two is ${num(bblLine / bblChoke, 13)} (derived from the two rows above). The package gives both modules one definition of a barrel, and it is exact by definition rather than by measurement: forty-two gallons of two hundred and thirty-one cubic inches each, over the seventeen hundred and twenty-eight cubic inches in a cubic foot. Each module's own oracle works from that definition, which is why asking the two modules separately is a check on the chain rather than a reading of one source.`);
w();

// --------------------------------------------------------------- SECTION 18
w('# SECTION 18: The Expert reading, three questions and the pipes they are asked of (owned by Expert m06)');
w();
w(`Three questions, and the TWO pipes they are asked of. As a hydraulic line the OGBIA bore of ${e6(OGBIA.idIn)} in carries ${e6(OGBIA.qBpd)} bpd at ${e6(OG.vFtS)} ft/s, Reynolds ${r4(OG.re)}, and spends ${e6(OG.dpTotalPsi)} psi over ${e6(OGBIA.lengthFt)} ft, against an erosional ceiling of ${e6(sweepRows[0].chk.erosionalFtS)} ft/s that it uses ${e6(OG.vFtS / sweepRows[0].chk.erosionalFtS)} of.`);
w(`As a pressure envelope the SOKU pipe at ${e6(SOKU_WALL.odIn)} in outside diameter and ${e6(SOKU_WALL.smysPsi)} psi of yield needs ${e6(withCa.tRequiredIn)} in of wall at Class 3 and ${e6(c1w.tRequiredIn)} in at Class 1, and the ${e6(SOKU_WALL_AS_BUILT_IN)} in the mill rolled rates ${e6(maopWith.maopPsig)} psig. That is a different pipe from the one above it: its bore is the outside diameter less twice the wall, ${e6(SOKU_WALL.odIn - 2 * SOKU_WALL_AS_BUILT_IN)} in, which stands ${e6(SOKU_WALL.odIn - 2 * SOKU_WALL_AS_BUILT_IN - OGBIA.idIn)} in wider than the OGBIA bore (derived from the two figures on these rows).`);
w(`As a volume the OGBIA line holds ${r4(H.lineVolumeBbl(OGBIA_PIG))} bbl, a sphere crosses it in ${e6(H.pigRun(OGBIA_PIG).runHours)} hours, and at a measured holdup of ${e6(OGBIA_HOLDUP_NOMINAL)} it delivers ${r4(nomSwept.sweptBbl)} bbl to whatever is waiting at the end, every ${r4(nomIv.intervalDays)} days.`);
w('Three answers, and not one of them can be derived from the other two. The independence is not a trick of one pipe wearing three hats, which is why the wall reading above is stated on the pipe it belongs to: what a line spends in pressure, what wall a code demands of it and what liquid a pig pushes out of it are three separate questions, and an answer to any one of them carries no answer to another.');
w();

console.log(out.join('\n'));
