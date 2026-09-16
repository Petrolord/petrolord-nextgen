// Computes the FC3 capstone answers from the ESCRAVOS, BONGA and BONNY
// conditions. Writes fields.json (tier, key, value, tol) and prints a report.
// Nothing here is read by the lessons, the banks or the digest.
//
// It ASSERTS the held-item neutralisations rather than asserting them in
// prose: no held function is called, the compressor states are proved to sit
// inside the DAK validity window, and every stage is proved to respect the
// discharge-temperature limit the capstone states.
import fs from 'fs';
import {
  ESCRAVOS_POINTS, ESCRAVOS_SYSTEM, ESCRAVOS_SG, ESCRAVOS_EFFICIENCY,
  ESCRAVOS_MOTOR_EFFICIENCY, ESCRAVOS_Q_MAX_GPM,
  BONGA_POINTS, BONGA_SYSTEM, BONGA_SUCTION, BONGA_RAISED_SUCTION_PSIA,
  BONGA_SPEED_RATIO, BONGA_N_PARALLEL, BONGA_Q_MAX_GPM,
  BONNY, BONNY_HEAT_RATE_BTU_HP_HR, BONNY_LHV_BTU_SCF,
} from '/root/fc-wip-rotating/fc3_fields_capstone.mjs';

const ROOT = process.env.FC3_ENGINES || '/root/wt-fc3-nextgen/packages/engines';
const P = await import(`${ROOT}/engines/facilities/pumps.js`);
const C = await import(`${ROOT}/engines/facilities/compression.js`);
const G = await import(`${ROOT}/engines/production/gasProperties.js`);

const must = (cond, msg) => {
  if (!cond) { console.error(`CAPSTONE ASSERTION FAILED: ${msg}`); process.exit(1); }
};

/* ---------------- Associate, ESCRAVOS ---------------- */
const escCurve = P.fitPumpCurve({ points: ESCRAVOS_POINTS });
must(!escCurve.error, `ESCRAVOS curve: ${escCurve.error}`);
must(!escCurve.warning, `ESCRAVOS curve warns: ${escCurve.warning}`);
const escSystem = P.systemCurve(ESCRAVOS_SYSTEM);
must(!escSystem.error, `ESCRAVOS system: ${escSystem.error}`);
const escDuty = P.dutyPoint({ pump: escCurve, system: escSystem, qMaxGpm: ESCRAVOS_Q_MAX_GPM });
must(!escDuty.error, `ESCRAVOS duty: ${escDuty.error}`);
const escPower = P.pumpPower({
  qGpm: escDuty.qGpm, headFt: escDuty.headFt, sg: ESCRAVOS_SG,
  efficiency: ESCRAVOS_EFFICIENCY, motorEfficiency: ESCRAVOS_MOTOR_EFFICIENCY,
});
must(!escPower.error, `ESCRAVOS power: ${escPower.error}`);
const escDischargePsi = P.headFtToPsi({ headFt: escDuty.headFt, sg: ESCRAVOS_SG });

/* ---------------- Professional, BONGA ---------------- */
const bonCurve = P.fitPumpCurve({ points: BONGA_POINTS });
must(!bonCurve.error, `BONGA curve: ${bonCurve.error}`);
must(!bonCurve.warning, `BONGA curve warns: ${bonCurve.warning}`);
const bonSystem = P.systemCurve(BONGA_SYSTEM);
must(!bonSystem.error, `BONGA system: ${bonSystem.error}`);
const bonDuty = P.dutyPoint({ pump: bonCurve, system: bonSystem, qMaxGpm: BONGA_Q_MAX_GPM });
must(!bonDuty.error, `BONGA duty: ${bonDuty.error}`);
const bonNpsh = P.npshAvailable(BONGA_SUCTION);
must(!bonNpsh.error, `BONGA NPSH: ${bonNpsh.error}`);
must(!bonNpsh.warning, `BONGA suction is at or below vapour pressure: ${bonNpsh.warning}`);
const bonNpshRaised = P.npshAvailable({
  ...BONGA_SUCTION, suctionPressurePsia: BONGA_RAISED_SUCTION_PSIA,
});
must(!bonNpshRaised.error, `BONGA raised NPSH: ${bonNpshRaised.error}`);
// The speed change is applied to the machine's own solved duty, which is the
// only honest place to apply it. The affinity laws are EXACT here; the trim
// model, which is not, is deliberately absent from this capstone.
const bonSpeed = P.speedChange({
  qGpm: bonDuty.qGpm, headFt: bonDuty.headFt, brakeHp: 1, speedRatio: BONGA_SPEED_RATIO,
});
must(!bonSpeed.error, `BONGA speed: ${bonSpeed.error}`);
// Two machines in parallel are re-intersected with the SAME system, because
// the system curve does not move when a second pump is added.
const bonParallel = P.combineParallel({ pump: bonCurve, n: BONGA_N_PARALLEL });
must(!bonParallel.error, `BONGA parallel: ${bonParallel.error}`);
const bonParallelDuty = P.dutyPoint({
  pump: bonParallel, system: bonSystem, qMaxGpm: BONGA_Q_MAX_GPM,
});
must(!bonParallelDuty.error, `BONGA parallel duty: ${bonParallelDuty.error}`);
must(bonParallelDuty.qGpm < bonDuty.qGpm * 2,
  'the parallel duty should be BELOW twice the single duty; this capstone is built on that result');

/* ---------------- Expert, BONNY ---------------- */
const bonnyE = C.polytropicExponentRatio({
  k: BONNY.k, polytropicEfficiency: BONNY.polytropicEfficiency,
});
must(Number.isFinite(bonnyE), 'BONNY exponent is not finite');
const bonnyTrain = C.compressorTrain({ ...BONNY });
must(!bonnyTrain.error, `BONNY train: ${bonnyTrain.error}`);
const bonnyStage1 = C.compressionStage({
  qMMscfd: BONNY.qMMscfd, pSuctionPsia: BONNY.pSuctionPsia, tSuctionF: BONNY.tSuctionF,
  ratio: bonnyTrain.ratioPerStage, gasSg: BONNY.gasSg, k: BONNY.k,
  polytropicEfficiency: BONNY.polytropicEfficiency,
  mechanicalEfficiency: BONNY.mechanicalEfficiency,
});
must(!bonnyStage1.error, `BONNY stage 1: ${bonnyStage1.error}`);
const bonnyFuel = C.driverFuel({
  brakeHp: bonnyTrain.totalBrakeHp,
  heatRateBtuHpHr: BONNY_HEAT_RATE_BTU_HP_HR,
  gasLhvBtuScf: BONNY_LHV_BTU_SCF,
});
must(!bonnyFuel.error, `BONNY fuel: ${bonnyFuel.error}`);

// HELD-ITEM NEUTRALISATION, ASSERTED.
// 1. Every stage respects the discharge-temperature limit the capstone states.
//    compression.js does NOT check this (FINDINGS C5), so it is checked here.
bonnyTrain.stages.forEach((s) => {
  must(s.tDischargeF <= BONNY.maxDischargeF,
    `stage ${s.stage} discharges at ${s.tDischargeF} F, above the stated limit of ${BONNY.maxDischargeF} F`);
});
// 2. Every compressibility this train evaluates sits INSIDE the DAK validity
//    window (1.0 <= Tpr <= 3.0, Ppr <= 30). compression.js does NOT check this
//    either, while separatorSizing.js in the same package refuses outside it.
const { tpcR, ppcPsia } = G.suttonPseudoCriticals(BONNY.gasSg);
const windowRows = [];
bonnyTrain.stages.forEach((s) => {
  [[s.pSuctionPsia, s.tSuctionF], [s.pDischargePsia, s.tDischargeF]].forEach(([p, t]) => {
    const ppr = p / ppcPsia;
    const tpr = G.toRankine(t) / tpcR;
    windowRows.push({ stage: s.stage, pPsia: p, tF: t, ppr, tpr });
    must(tpr >= 1.0 && tpr <= 3.0, `Tpr ${tpr} outside the DAK window at stage ${s.stage}`);
    must(ppr <= 30, `Ppr ${ppr} above the DAK limit at stage ${s.stage}`);
  });
});
// 3. No held function was called anywhere above. Proved by absence: this file
//    never references viscosityCorrection, impellerTrim, operatingRegion,
//    npshCheck or machineScreen. Gated here so a later edit cannot slip one in.
const src = fs.readFileSync('/root/fc-wip-rotating/fc3_capstone.mjs', 'utf8');
['viscosityCorrection', 'impellerTrim', 'operatingRegion', 'npshCheck', 'machineScreen']
  .forEach((held) => {
    const calls = (src.match(new RegExp(`[PC]\\.${held}\\s*\\(`, 'g')) || []).length;
    must(calls === 0, `a held function is called: ${held}`);
  });

const F = [
  // Associate: one pump against one station, end to end.
  ['beginner', 'escravos_duty_flow_gpm', escDuty.qGpm, 1e-4],
  ['beginner', 'escravos_duty_head_ft', escDuty.headFt, 1e-5],
  ['beginner', 'escravos_hydraulic_hp', escPower.hydraulicHp, 1e-6],
  ['beginner', 'escravos_brake_hp', escPower.brakeHp, 1e-6],
  ['beginner', 'escravos_motor_input_kw', escPower.motorInputKw, 1e-6],
  ['beginner', 'escravos_discharge_psi', escDischargePsi, 1e-7],
  // Professional: the suction side, an exact affinity law, and a second machine.
  ['intermediate', 'bonga_pressure_head_ft', bonNpsh.pressureHeadFt, 1e-7],
  ['intermediate', 'bonga_npsha_ft', bonNpsh.npshaFt, 1e-7],
  ['intermediate', 'bonga_npsha_raised_ft', bonNpshRaised.npshaFt, 1e-7],
  ['intermediate', 'bonga_speed_flow_gpm', bonSpeed.qGpm, 1e-4],
  ['intermediate', 'bonga_speed_head_ft', bonSpeed.headFt, 1e-5],
  ['intermediate', 'bonga_parallel_flow_gpm', bonParallelDuty.qGpm, 1e-4],
  // Expert: the thermodynamic path and what the driver burns for it.
  ['advanced', 'bonny_exponent_ratio', bonnyE, 1e-12],
  ['advanced', 'bonny_ratio_per_stage', bonnyTrain.ratioPerStage, 1e-9],
  ['advanced', 'bonny_stage1_discharge_f', bonnyStage1.tDischargeF, 1e-5],
  ['advanced', 'bonny_stage1_poly_head', bonnyStage1.headPolyFtLbfLbm, 1e-2],
  ['advanced', 'bonny_stage1_gas_hp', bonnyStage1.gasHp, 1e-5],
  ['advanced', 'bonny_fuel_mmscfd', bonnyFuel.fuelMMscfd, 1e-9],
];

fs.writeFileSync('/root/fc-wip-rotating/fields.json', `${JSON.stringify(F, null, 1)}\n`);

console.log('FC3 capstone answers\n');
console.log('ASSOCIATE, the ESCRAVOS transfer pump');
console.log(`  shutoff head              ${escCurve.shutoffHeadFt.toFixed(6)} ft, R squared ${escCurve.rSquared.toFixed(8)}`);
console.log(`  duty                      ${escDuty.qGpm.toFixed(6)} gpm at ${escDuty.headFt.toFixed(6)} ft`);
console.log(`  hydraulic / brake / motor ${escPower.hydraulicHp.toFixed(6)} / ${escPower.brakeHp.toFixed(6)} hp, ${escPower.motorInputKw.toFixed(6)} kW`);
console.log(`  duty head as pressure     ${escDischargePsi.toFixed(6)} psi`);
console.log('\nPROFESSIONAL, the BONGA booster station');
console.log(`  single-machine duty       ${bonDuty.qGpm.toFixed(6)} gpm at ${bonDuty.headFt.toFixed(6)} ft  (not graded)`);
console.log(`  pressure head / NPSHa     ${bonNpsh.pressureHeadFt.toFixed(6)} / ${bonNpsh.npshaFt.toFixed(6)} ft`);
console.log(`  NPSHa at ${BONGA_RAISED_SUCTION_PSIA} psia         ${bonNpshRaised.npshaFt.toFixed(6)} ft`);
console.log(`  at ${BONGA_SPEED_RATIO} speed             ${bonSpeed.qGpm.toFixed(6)} gpm at ${bonSpeed.headFt.toFixed(6)} ft`);
console.log(`  ${BONGA_N_PARALLEL} in parallel            ${bonParallelDuty.qGpm.toFixed(6)} gpm, which is ${(bonParallelDuty.qGpm / bonDuty.qGpm).toFixed(6)} times one machine`);
console.log('\nEXPERT, the BONNY gas booster train');
console.log(`  exponent ratio            ${bonnyE.toFixed(12)}`);
console.log(`  stages / ratio per stage  ${bonnyTrain.stages.length} (${bonnyTrain.governedBy}) / ${bonnyTrain.ratioPerStage.toFixed(9)}`);
console.log(`  stage 1 discharge / head  ${bonnyStage1.tDischargeF.toFixed(6)} F / ${bonnyStage1.headPolyFtLbfLbm.toFixed(4)} ft lbf per lbm`);
console.log(`  stage 1 gas hp            ${bonnyStage1.gasHp.toFixed(6)}`);
console.log(`  train brake hp / fuel     ${bonnyTrain.totalBrakeHp.toFixed(4)} / ${bonnyFuel.fuelMMscfd.toFixed(9)} MMscfd`);
console.log(`  every stage under the stated ${BONNY.maxDischargeF} F limit: asserted`);
console.log('  DAK window at every evaluated state:');
windowRows.forEach((r) => console.log(`    stage ${r.stage} ${r.pPsia.toFixed(2)} psia ${r.tF.toFixed(2)} F -> Ppr ${r.ppr.toFixed(6)}, Tpr ${r.tpr.toFixed(6)}`));
console.log(`\nwrote ${F.length} graded fields to fields.json`);
