// FC5 relief: THE CAPSTONE ANSWER GENERATOR.
//
// Computes the eighteen graded fields from KOLO CREEK, OGBAINBIRI and GBARAN
// by CALLING THE VENDORED ENGINE. Every graded value is a RETURN VALUE of the
// engine: not arithmetic performed here, not a figure typed by hand, and not a
// value that reads a held-for-literature item.
//
// It imports fc5_fields_capstone.mjs and the ONE tolerance derivation in the
// repository, and nothing else from this wave. Nothing in fc5_dump.mjs imports
// either of them, which is what keeps the teaching road and the graded road
// apart.
//
//   node fc5_capstone.mjs           the human report, with the assertion block
//   node fc5_capstone.mjs --json    [{tier, key, cls, value, tol}] for make_fields
//   node fc5_capstone.mjs --calls   [{route, args}] every engine call it made,
//                                   so the leak gate can compare the CALLS
//                                   against the published golden rows instead
//                                   of guessing at the source text
//
// Exit 1 if any held-item clearance assertion fails. A capstone whose
// clearances are claimed rather than asserted is the defect this file exists
// to prevent.
import {
  KOLO_CREEK_GAS, KOLO_CREEK_GAS_SUBCRITICAL, KOLO_CREEK_LIQUID, KOLO_CREEK_STEAM,
  OGBAINBIRI_VESSEL, OGBAINBIRI_TOWER, OGBAINBIRI_DRUM, OGBAINBIRI_DRUM_WIDER,
  GBARAN_BLOWDOWN, GBARAN_FLARE, HELD_CLEARANCE,
} from '/root/fc-wip-relief/fc5_fields_capstone.mjs';

// The tolerance, the quantity class and the printed precision come from the
// ONE derivation that the teaching lab and fields.json also read. Three copies
// of a tolerance is three chances to disagree, and this programme has shipped
// a stale third copy twice.
const TOLPATH = process.env.FC5_TOLERANCE
  || '/root/wt-fc5-nextgen/src/components/course/panels/relief/gradedTolerance.js';
const {
  GRADED_FIELDS, gradedClassOf, gradedTolerance, PRINTED_DECIMALS,
} = await import(TOLPATH);

const ROOT = process.env.FC5_ENGINES || '/root/wt-fc5-nextgen/packages/engines';
const R = await import(`${ROOT}/engines/facilities/relief.js`);

const ATM = 14.7;          // the engine's own default outlet pressure
const RANKINE = 459.67;    // degF to degR
const JSON_MODE = process.argv.includes('--json');
const CALLS_MODE = process.argv.includes('--calls');
// Every engine call this file makes is recorded, so direction three of the
// leak gate can compare a real call against a real golden row.
const CALLS = [];
const called = (route, args) => { CALLS.push({ route, args }); return args; };

/* --------------------------------------------------- the assertion machinery */

const asserts = [];
const ok = (name, cond, detail) => { asserts.push({ name, pass: !!cond, detail }); };

/* ------------------------------------------------------------- KOLO CREEK */

const kcGasP1 = KOLO_CREEK_GAS.setPsig * (1 + KOLO_CREEK_GAS.overpressurePct / 100) + ATM;
const kcGasCall = {
  wLbHr: KOLO_CREEK_GAS.wLbHr, p1Psia: kcGasP1, p2Psia: KOLO_CREEK_GAS.backPsia,
  tR: KOLO_CREEK_GAS.tF + RANKINE, mw: KOLO_CREEK_GAS.mw, z: KOLO_CREEK_GAS.z,
  k: KOLO_CREEK_GAS.k, kd: KOLO_CREEK_GAS.kd, kb: KOLO_CREEK_GAS.kb, kc: KOLO_CREEK_GAS.kc,
};
const kcGas = R.gasVaporArea(called('gasVaporArea/kolocreek critical', kcGasCall));
const kcSubCall = { ...kcGasCall, p2Psia: KOLO_CREEK_GAS_SUBCRITICAL.backPsia };
const kcSub = R.gasVaporArea(called('gasVaporArea/kolocreek subcritical', kcSubCall));
const kcRatio = R.criticalPressureRatio(KOLO_CREEK_GAS.k);
const kcC = R.gasConstantC(KOLO_CREEK_GAS.k);

const kcLiqP1 = KOLO_CREEK_LIQUID.setPsig * (1 + KOLO_CREEK_LIQUID.overpressurePct / 100);
const kcLiq = R.liquidArea(called('liquidArea/kolocreek', {
  qGpm: KOLO_CREEK_LIQUID.qGpm, p1Psig: kcLiqP1, p2Psig: KOLO_CREEK_LIQUID.backPsig,
  sg: KOLO_CREEK_LIQUID.sg, muCp: KOLO_CREEK_LIQUID.muCp,
  kd: KOLO_CREEK_LIQUID.kd, kw: KOLO_CREEK_LIQUID.kw, kc: KOLO_CREEK_LIQUID.kc,
}));

const kcSteamP1 = KOLO_CREEK_STEAM.setPsig * (1 + KOLO_CREEK_STEAM.overpressurePct / 100) + ATM;
const kcSteam = R.steamArea(called('steamArea/kolocreek', {
  wLbHr: KOLO_CREEK_STEAM.wLbHr, p1Psia: kcSteamP1, kd: KOLO_CREEK_STEAM.kd,
  kb: KOLO_CREEK_STEAM.kb, kc: KOLO_CREEK_STEAM.kc, ksh: KOLO_CREEK_STEAM.ksh,
}));

// H4, the balanced-bellows chart. The critical case is a CONVENTIONAL valve
// whose back pressure is far below the ratio at which the standard's chart Kb
// is needed, and the engine says so by returning no warning at Kb = 1.0.
ok('kolocreek gas critical: the engine took the CRITICAL branch',
  kcGas.critical === true, `critical=${kcGas.critical}`);
ok('kolocreek gas critical: no back-pressure warning, so no bellows chart is implied (H4)',
  kcGas.warning === null, `warning=${kcGas.warning}`);
ok('kolocreek gas critical: the back-pressure ratio is under 0.3 (H4)',
  KOLO_CREEK_GAS.backPsia / kcGasP1 < 0.3, `ratio=${KOLO_CREEK_GAS.backPsia / kcGasP1}`);
// H4 again, the other way: above the critical ratio the engine IGNORES Kb, and
// it is the engine's own warning that proves Kb never entered the answer.
ok('kolocreek subcritical: the engine took the SUBCRITICAL branch',
  kcSub.critical === false, `critical=${kcSub.critical}`);
ok('kolocreek subcritical: the same call with a DIFFERENT Kb returns the same area, so Kb is not in it (H4)',
  R.gasVaporArea({ ...kcSubCall, kb: 0.62 }).areaIn2 === kcSub.areaIn2,
  `areaIn2 at kb 1.0 = ${kcSub.areaIn2}, at kb 0.62 = ${R.gasVaporArea({ ...kcSubCall, kb: 0.62 }).areaIn2}`);
// H1, the Kv fit. With no viscosity the loop never runs.
ok('kolocreek liquid: Kv is exactly 1.0, so not one Kv fit constant is in the answer (H1)',
  kcLiq.kv === 1.0, `kv=${kcLiq.kv}`);
ok('kolocreek liquid: the Reynolds number is null, so the Kv loop never ran (H1)',
  kcLiq.reynolds === null, `reynolds=${kcLiq.reynolds}`);
ok('kolocreek liquid: the same call at a DIFFERENT viscosity returns a DIFFERENT area, so the inviscid clearance is real and not a dead branch',
  R.liquidArea({
    qGpm: KOLO_CREEK_LIQUID.qGpm, p1Psig: kcLiqP1, p2Psig: KOLO_CREEK_LIQUID.backPsig,
    sg: KOLO_CREEK_LIQUID.sg, muCp: 250, kd: KOLO_CREEK_LIQUID.kd,
    kw: KOLO_CREEK_LIQUID.kw, kc: KOLO_CREEK_LIQUID.kc,
  }).areaIn2 !== kcLiq.areaIn2, 'a viscous call moves the area');
// H7, the Napier boundaries. KN is exactly 1.0 and no Napier coefficient is in
// the arithmetic.
ok('kolocreek steam: KN is exactly 1.0, so no Napier coefficient is in the answer (H7)',
  kcSteam.kn === 1.0, `kn=${kcSteam.kn}`);
ok('kolocreek steam: no Napier warning',
  kcSteam.warning === null, `warning=${kcSteam.warning}`);
ok('kolocreek steam: the relieving pressure is below HALF the published Napier threshold, so the graded value survives any plausible move in it (H7)',
  kcSteamP1 < 750, `p1=${kcSteamP1} psia`);
// H3, the orifice table. No graded field in this wave is a letter or a margin.
ok('no graded key names an orifice letter or a margin (H3)',
  !GRADED_FIELDS.some(([, k]) => /orifice|letter|margin/i.test(k)), 'checked all eighteen keys');

/* ------------------------------------------------------------ OGBAINBIRI */

const ogVessel = R.wettedAreaFt2(called('wettedAreaFt2/ogbainbiri vessel', OGBAINBIRI_VESSEL));
const ogTower = R.wettedAreaFt2(called('wettedAreaFt2/ogbainbiri tower', OGBAINBIRI_TOWER));
const ogFraction = R.segmentAreaFraction(OGBAINBIRI_DRUM.liquidFraction);
const ogDrum = R.koDrumHorizontal(called('koDrumHorizontal/ogbainbiri', OGBAINBIRI_DRUM));
const ogDrumWide = R.koDrumHorizontal(called('koDrumHorizontal/ogbainbiri wider', OGBAINBIRI_DRUM_WIDER));

// H9, the 25 ft wetted-height truncation. A horizontal vessel's wetted height
// cannot exceed its diameter, and the tower's level is stated.
ok('ogbainbiri vessel: the wetted height cannot exceed the 9.5 ft diameter, under the 25 ft limit (H9)',
  OGBAINBIRI_VESSEL.diameterFt < 25, `diameter=${OGBAINBIRI_VESSEL.diameterFt} ft`);
ok('ogbainbiri tower: the wetted height is the stated level, under the 25 ft limit (H9)',
  OGBAINBIRI_TOWER.liquidLevelFt < 25 && OGBAINBIRI_TOWER.liquidLevelFt <= OGBAINBIRI_TOWER.lengthFt,
  `level=${OGBAINBIRI_TOWER.liquidLevelFt} ft`);
// H6, the pool-fire constants. No graded field reads a duty or a load.
ok('no graded key reads a fire duty or a fire relief load (H6)',
  !GRADED_FIELDS.some(([, k]) => /duty|btu|heat_input|relief_load|load_lbhr/i.test(k)),
  'checked all eighteen keys');
// H2, the sphere-drag correlation. The drum states its dropout velocity, so
// dropoutVelocityFtS is never called on this road. Proved by the fact that the
// answer moves with the STATED velocity and there is no droplet anywhere in
// the condition set.
ok('ogbainbiri drum: the dropout velocity is STATED, so the drag correlation never runs (H2)',
  typeof OGBAINBIRI_DRUM.udFtS === 'number' && !('dropletMicron' in OGBAINBIRI_DRUM)
  && !('muVCp' in OGBAINBIRI_DRUM) && !('rhoLLbFt3' in OGBAINBIRI_DRUM),
  `udFtS=${OGBAINBIRI_DRUM.udFtS} stated, no droplet, no viscosity, no density in the condition set`);
ok('ogbainbiri drum: the vapour rate is STATED in actual ft3/s, so no standard base enters it',
  typeof OGBAINBIRI_DRUM.qVaporAcfs === 'number', `qVaporAcfs=${OGBAINBIRI_DRUM.qVaporAcfs}`);
ok('ogbainbiri drum: the holdup fraction MOVES the required length, so the graded pair is not the cancelled one',
  Math.abs(R.koDrumHorizontal({ ...OGBAINBIRI_DRUM, liquidFraction: 0.1 }).requiredLengthFt
    - ogDrum.requiredLengthFt) > 1e-6,
  `at f 0.10 the length is ${R.koDrumHorizontal({ ...OGBAINBIRI_DRUM, liquidFraction: 0.1 }).requiredLengthFt}, at f 0.35 it is ${ogDrum.requiredLengthFt}`);
ok('ogbainbiri drum: going wider SHORTENS the drum, so the two length fields are not the same answer twice',
  ogDrumWide.requiredLengthFt < ogDrum.requiredLengthFt,
  `${ogDrum.requiredLengthFt} ft at 8.5 ft, ${ogDrumWide.requiredLengthFt} ft at 10.5 ft`);

/* ----------------------------------------------------------------- GBARAN */

const gbBlow = R.blowdown(called('blowdown/gbaran', GBARAN_BLOWDOWN));
const gbRad = R.radiationIntensity(called('radiationIntensity/gbaran', {
  qKw: GBARAN_FLARE.qKw, distanceM: GBARAN_FLARE.distanceM,
  fractionRadiated: GBARAN_FLARE.fractionRadiated, transmissivity: GBARAN_FLARE.transmissivity,
}));
const gbSetback = R.distanceForIntensity(called('distanceForIntensity/gbaran', {
  qKw: GBARAN_FLARE.qKw, allowableKwM2: GBARAN_FLARE.projectAllowableKwM2,
  fractionRadiated: GBARAN_FLARE.fractionRadiated, transmissivity: GBARAN_FLARE.transmissivity,
}));

// H8, the choked-flow assumption. The engine names the pressure below which it
// stops holding, and the end pressure is far above it.
ok('gbaran blowdown: no error',
  !gbBlow.error, `error=${gbBlow.error}`);
ok('gbaran blowdown: the choked-flow warning is null, so the graded time carries no model caveat (H8)',
  gbBlow.warning === null, `warning=${gbBlow.warning}`);
ok('gbaran blowdown: the end pressure is more than three times the choked floor (H8)',
  GBARAN_BLOWDOWN.pEndPsia > 3 * gbBlow.chokedToPsia,
  `pEnd=${GBARAN_BLOWDOWN.pEndPsia} psia against a choked floor of ${gbBlow.chokedToPsia} psia`);
ok('gbaran blowdown: the march actually marched, so the time is not the zero-time false pass',
  gbBlow.timeS > 0 && gbBlow.steps > 1 && gbBlow.stations.length > 2,
  `timeS=${gbBlow.timeS}, steps=${gbBlow.steps}, stations=${gbBlow.stations.length}`);
ok('gbaran blowdown: the march landed ON the end pressure',
  Math.abs(gbBlow.finalPPsia - GBARAN_BLOWDOWN.pEndPsia) < 1e-6,
  `finalPPsia=${gbBlow.finalPPsia} against pEndPsia=${GBARAN_BLOWDOWN.pEndPsia}`);
ok('gbaran blowdown: refining the step by ten moves the time by less than a thousandth of a second, so the graded time is not an artefact of dtS',
  Math.abs(R.blowdown({ ...GBARAN_BLOWDOWN, dtS: 0.01 }).timeS - gbBlow.timeS) < 1e-3,
  `dtS 0.1 gives ${gbBlow.timeS} s, dtS 0.01 gives ${R.blowdown({ ...GBARAN_BLOWDOWN, dtS: 0.01 }).timeS} s`);
// H5, the RADIATION_LEVELS table. The allowable is a stated project basis and
// is not any of the four customary values.
ok('gbaran flare: the project allowable is NOT one of the four customary RADIATION_LEVELS values (H5)',
  !R.RADIATION_LEVELS.some((r) => r.kWm2 === GBARAN_FLARE.projectAllowableKwM2),
  `allowable=${GBARAN_FLARE.projectAllowableKwM2} against [${R.RADIATION_LEVELS.map((r) => r.kWm2).join(', ')}]`);
ok('gbaran flare: the heat release is stated in kW, so no lower heating value enters the graded radiation',
  typeof GBARAN_FLARE.qKw === 'number' && !('lhvBtuLb' in GBARAN_FLARE) && !('reliefWLbHr' in GBARAN_FLARE),
  `qKw=${GBARAN_FLARE.qKw} stated`);
ok('gbaran flare: no error on either direction of the point source',
  !gbRad.error && !gbSetback.error, `${gbRad.error || 'ok'} / ${gbSetback.error || 'ok'}`);

/* ------------------------------------------------- the eighteen, in order */

const VALUES = {
  kolocreek_critical_pressure_ratio: kcRatio,
  kolocreek_gas_coefficient_c: kcC,
  kolocreek_gas_critical_area_in2: kcGas.areaIn2,
  kolocreek_gas_subcritical_area_in2: kcSub.areaIn2,
  kolocreek_liquid_area_in2: kcLiq.areaIn2,
  kolocreek_steam_area_in2: kcSteam.areaIn2,
  ogbainbiri_wetted_area_ft2: ogVessel.areaFt2,
  ogbainbiri_tower_wetted_area_ft2: ogTower.areaFt2,
  ogbainbiri_liquid_area_fraction: ogFraction,
  ogbainbiri_vapor_velocity_fts: ogDrum.vVaporFtS,
  ogbainbiri_drum_length_ft: ogDrum.requiredLengthFt,
  ogbainbiri_drum_length_wider_ft: ogDrumWide.requiredLengthFt,
  gbaran_initial_mass_lb: gbBlow.initialMassLb,
  gbaran_blowdown_time_s: gbBlow.timeS,
  gbaran_final_temperature_degr: gbBlow.finalTR,
  gbaran_choked_floor_psia: gbBlow.chokedToPsia,
  gbaran_radiant_intensity_kwm2: gbRad.kWm2,
  gbaran_setback_distance_m: gbSetback.distanceM,
};

const rows = GRADED_FIELDS.map(([tier, key, cls]) => {
  const value = VALUES[key];
  if (!Number.isFinite(value)) throw new Error(`${tier}/${key} is not a finite engine return: ${value}`);
  if (!HELD_CLEARANCE[key]) throw new Error(`${tier}/${key} has no held-item clearance statement`);
  return { tier, key, cls, value, tol: gradedTolerance(key) };
});
if (rows.length !== 18) throw new Error(`${rows.length} graded fields, expected 18`);
const extra = Object.keys(VALUES).filter((k) => !GRADED_FIELDS.some(([, kk]) => kk === k));
if (extra.length) throw new Error(`values computed for keys that are not graded: ${extra.join(', ')}`);

if (CALLS_MODE) {
  if (CALLS.length < 10) { process.stderr.write(`REFUSED: only ${CALLS.length} engine calls were recorded\n`); process.exit(2); }
  process.stdout.write(`${JSON.stringify(CALLS, null, 1)}\n`);
} else if (JSON_MODE) {
  process.stdout.write(`${JSON.stringify(rows, null, 1)}\n`);
} else {
  const f = (x, d) => Number(x).toFixed(d);
  console.log('# FC5 capstone: KOLO CREEK, OGBAINBIRI and GBARAN');
  console.log(`# engine ${ROOT}/engines/facilities/relief.js, tolerances from ${TOLPATH}`);
  console.log();
  let tier = '';
  rows.forEach((r) => {
    if (r.tier !== tier) { tier = r.tier; console.log(`## ${tier}`); }
    console.log(`  ${r.key.padEnd(38)} ${f(r.value, PRINTED_DECIMALS[r.cls]).padStart(20)}  ${r.cls.padEnd(12)} tol ${r.tol}`);
  });
  console.log();
  console.log('## HELD-ITEM CLEARANCE ASSERTIONS');
  asserts.forEach((a) => console.log(`  ${a.pass ? 'PASS' : 'FAIL'}  ${a.name}\n        ${a.detail}`));
  const failed = asserts.filter((a) => !a.pass);
  console.log();
  console.log(`  assertions run: ${asserts.length}  failed: ${failed.length}`);
  if (asserts.length < 20) {
    console.log('  REFUSES: fewer than twenty clearance assertions were run, which is not a clearance check');
    process.exit(2);
  }
  if (failed.length) process.exit(1);
}
