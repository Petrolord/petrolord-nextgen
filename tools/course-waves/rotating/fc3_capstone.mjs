// Computes the FC3 capstone answers from the ESCRAVOS, BONGA and BONNY
// conditions. Writes fields.json (tier, key, value, tol) and prints a report.
// Nothing here is read by the lessons, the banks or the digest.
//
// It ASSERTS the held-item neutralisations rather than asserting them in
// prose: no held function is called, the compressor states are proved to sit
// inside the DAK validity window, and every stage is proved to respect the
// discharge-temperature limit the capstone states.
import fs from 'fs';
import { createHash } from 'crypto';
import {
  ESCRAVOS_POINTS, ESCRAVOS_SYSTEM, ESCRAVOS_SG, ESCRAVOS_EFFICIENCY,
  ESCRAVOS_MOTOR_EFFICIENCY, ESCRAVOS_Q_MAX_GPM,
  BONGA_POINTS, BONGA_SYSTEM, BONGA_SUCTION, BONGA_RAISED_SUCTION_PSIA,
  BONGA_SPEED_RATIO, BONGA_N_PARALLEL, BONGA_Q_MAX_GPM,
  BONNY, BONNY_HEAT_RATE_BTU_HP_HR, BONNY_LHV_BTU_SCF,
} from '/root/fc-wip-rotating/fc3_fields_capstone.mjs';
// THE TOLERANCES ARE NOT DECLARED HERE EITHER. This generator and the shipped
// teaching lab both import the ONE derivation, in the repository, so the
// number this file writes into fields.json is literally the number the lab
// ships. It used to hold its own PRINTED_DECIMALS, its own tol() and its own
// class list, with rotatingLab.js holding a hand-kept mirror of the answers:
// three copies, and FC2 repaired only two of them.
const TOLPATH = process.env.FC3_TOLERANCE
  || '/root/wt-fc3-nextgen/src/components/course/panels/rotating/gradedTolerance.js';
const {
  PRINTED_DECIMALS, GRADED_FIELDS, gradedClassOf, gradedTolerance, precisionDeclaration,
} = await import(TOLPATH);

const OUT = process.env.FC3_FIELDS_OUT || '/root/fc-wip-rotating/fields.json';
const PRECISION_OUT = process.env.FC3_PRECISION_OUT || '/root/fc-wip-rotating/precision.json';
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
// The solve reports itself at 4fa37e6, so the capstone reads the report
// instead of trusting the number: a duty flow off an unconverged bisection
// is not an answer to grade against.
must(escCurve.droops === true, 'the ESCRAVOS curve does not droop, so its crossing is not a duty point');
must(escDuty.converged === true, `ESCRAVOS duty did not converge: bracket ${escDuty.bracketGpm} gpm, residual ${escDuty.residualFt} ft`);
must(Number.isFinite(escCurve.rSquared), 'the ESCRAVOS fit reports no R squared, which means its points carry no variance to explain');
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
must(bonCurve.droops === true, 'the BONGA curve does not droop, so its crossing is not a duty point');
must(bonDuty.converged === true, `BONGA duty did not converge: bracket ${bonDuty.bracketGpm} gpm, residual ${bonDuty.residualFt} ft`);
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
// The speed ratio must sit inside the band the engine reports without comment,
// because a graded answer must not be an extrapolation the engine warned about.
must(bonSpeed.warning === null, `BONGA speed change carries a warning: ${bonSpeed.warning}`);
// Two machines in parallel are re-intersected with the SAME system, because
// the system curve does not move when a second pump is added.
const bonParallel = P.combineParallel({ pump: bonCurve, n: BONGA_N_PARALLEL });
must(!bonParallel.error, `BONGA parallel: ${bonParallel.error}`);
const bonParallelDuty = P.dutyPoint({
  pump: bonParallel, system: bonSystem, qMaxGpm: BONGA_Q_MAX_GPM,
});
must(!bonParallelDuty.error, `BONGA parallel duty: ${bonParallelDuty.error}`);
must(bonParallelDuty.converged === true, `BONGA parallel duty did not converge: bracket ${bonParallelDuty.bracketGpm} gpm, residual ${bonParallelDuty.residualFt} ft`);
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
//    At engines 4fa37e6 the engine chooses the stage count against the inlet
//    each stage really has and warns on the caller's own limit, so it would
//    now catch this itself. The assertion stays anyway: a capstone answer is
//    graded for years and this file is the last thing between a graded number
//    and a limit nobody rechecked.
bonnyTrain.stages.forEach((s) => {
  must(s.tDischargeF <= BONNY.maxDischargeF,
    `stage ${s.stage} discharges at ${s.tDischargeF} F, above the stated limit of ${BONNY.maxDischargeF} F`);
});
// 2. Every compressibility this train evaluates sits INSIDE the DAK validity
//    window (1.0 <= Tpr <= 3.0, Ppr <= 30). At 4fa37e6 compression.js imports
//    that window from separatorSizing.js and refuses outside it, so this is a
//    second opinion rather than the only one; it is kept because the window
//    is a property of the CASE this capstone states, not of the engine, and a
//    case edited later must still land inside it.
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

/**
 * GRADING TOLERANCE IS DERIVED FROM THE DIGEST'S OWN PRINTED PRECISION, and
 * it is never tighter than half a unit in the last place the digest prints
 * that quantity at.
 *
 * THE DEFECT THIS ENDS: `bonny_stage1_discharge_f` was graded at 1e-5 while
 * the digest prints gas degF to FOUR decimals, so a learner who quoted
 * 221.7762 exactly as the digest instructs was 3.98e-5 out and FAILED. Five
 * of the eighteen fields were in that state. A wrong answer for a learner who
 * followed the course exactly is the worst thing this programme can ship, and
 * it cannot be fixed by telling learners to type more digits than the course
 * shows them.
 *
 * The coarsest precision the digest uses for a quantity is what a learner may
 * legitimately quote, so that is what sets the floor. Gas horsepower is the
 * one that is not obvious: the digest's own precision line puts horsepower in
 * the six-decimal class, and Section 11 prints gas hp with the four-decimal
 * gas formatter, so FOUR is the number a reader can actually take off the
 * page and four is what is used here.
 *
 * `Math.max` with the stated tolerance, never `min`: this only ever LOOSENS,
 * so no answer that graded correct before grades wrong now.
 */
const F = [
  // Associate: one pump against one station, end to end.
  ['beginner', 'escravos_duty_flow_gpm', escDuty.qGpm, gradedTolerance('escravos_duty_flow_gpm')],
  ['beginner', 'escravos_duty_head_ft', escDuty.headFt, gradedTolerance('escravos_duty_head_ft')],
  ['beginner', 'escravos_hydraulic_hp', escPower.hydraulicHp, gradedTolerance('escravos_hydraulic_hp')],
  ['beginner', 'escravos_brake_hp', escPower.brakeHp, gradedTolerance('escravos_brake_hp')],
  ['beginner', 'escravos_motor_input_kw', escPower.motorInputKw, gradedTolerance('escravos_motor_input_kw')],
  ['beginner', 'escravos_discharge_psi', escDischargePsi, gradedTolerance('escravos_discharge_psi')],
  // Professional: the suction side, an exact affinity law, and a second machine.
  ['intermediate', 'bonga_pressure_head_ft', bonNpsh.pressureHeadFt, gradedTolerance('bonga_pressure_head_ft')],
  ['intermediate', 'bonga_npsha_ft', bonNpsh.npshaFt, gradedTolerance('bonga_npsha_ft')],
  ['intermediate', 'bonga_npsha_raised_ft', bonNpshRaised.npshaFt, gradedTolerance('bonga_npsha_raised_ft')],
  ['intermediate', 'bonga_speed_flow_gpm', bonSpeed.qGpm, gradedTolerance('bonga_speed_flow_gpm')],
  ['intermediate', 'bonga_speed_head_ft', bonSpeed.headFt, gradedTolerance('bonga_speed_head_ft')],
  ['intermediate', 'bonga_parallel_flow_gpm', bonParallelDuty.qGpm, gradedTolerance('bonga_parallel_flow_gpm')],
  // Expert: the thermodynamic path and what the driver burns for it.
  ['advanced', 'bonny_exponent_ratio', bonnyE, gradedTolerance('bonny_exponent_ratio')],
  ['advanced', 'bonny_ratio_per_stage', bonnyTrain.ratioPerStage, gradedTolerance('bonny_ratio_per_stage')],
  ['advanced', 'bonny_stage1_discharge_f', bonnyStage1.tDischargeF, gradedTolerance('bonny_stage1_discharge_f')],
  ['advanced', 'bonny_stage1_poly_head', bonnyStage1.headPolyFtLbfLbm, gradedTolerance('bonny_stage1_poly_head')],
  ['advanced', 'bonny_stage1_gas_hp', bonnyStage1.gasHp, gradedTolerance('bonny_stage1_gas_hp')],
  ['advanced', 'bonny_fuel_mmscfd', bonnyFuel.fuelMMscfd, gradedTolerance('bonny_fuel_mmscfd')],
];

// WRITTEN ONLY ON SUCCESS, which is a trap and is named here because this
// wave has already been caught by it: a run that throws leaves the OLD file
// in place, so a control run against a different engine tree that fails to
// import looks byte identical for a run that never happened. Delete the
// target before the run and check the exit status, and read the stamp below.
const PAYLOAD = `${JSON.stringify(F, null, 1)}\n`;
// ASSERTED, not assumed: every graded answer must survive being quoted at the
// precision the digest prints it at.
//
// WHAT THIS CAN AND CANNOT CATCH, because the first control written for it was
// CIRCULAR. Mutating PRINTED_DECIMALS moves the floor and this check together,
// so that mutation can never fail it and proves nothing. What it DOES catch is
// a field whose tolerance never went through `tol()`: restoring the bare 1e-5
// on the discharge temperature makes it fire and write nothing, which is the
// control that was actually run.
F.forEach(([tier, key, value, t]) => {
  const { tier: wantTier, cls } = gradedClassOf(key);
  must(tier === wantTier, `${key} is generated as ${tier} and declared as ${wantTier}`);
  const dp = PRINTED_DECIMALS[cls];
  const asQuoted = Number(value.toFixed(dp));
  must(Math.abs(asQuoted - value) <= t,
    `${key} grades at ${t} but the digest prints it to ${dp} decimals, so a learner quoting ${asQuoted} is ${Math.abs(asQuoted - value)} out and would FAIL a correct answer`);
});
// THE EIGHTEEN ARE THE EIGHTEEN. A field added to one side and not the other
// is a refusal, not a short file.
must(F.length === GRADED_FIELDS.length,
  `this generator emits ${F.length} fields and gradedTolerance.js declares ${GRADED_FIELDS.length}`);
GRADED_FIELDS.forEach(([, key], i) => must(F[i][1] === key,
  `field ${i} is ${F[i][1]} here and ${key} in gradedTolerance.js`));
// THE PRECISION DECLARATION, derived here and never hand kept.
//
// `gradeprecision` reads a wave's stated precision off the digest header, and
// this header states three of its four clauses with the word "decimals"
// elided: "gas work to four (...); exponents, small factors and MMscfd to
// nine". A word matcher sees only the six-decimal clause, reads the finest
// precision this course prints as six, and reports the three nine-decimal
// fields as graded finer than anything the course prints. They are not: the
// digest prints exponent ratios, per-stage ratios and MMscfd to NINE, and
// Expert m06/l02 tells a candidate so in those words.
//
// Word matching cannot settle it either way, because the word "ratio" is in
// BOTH clauses: a pump speed ratio prints to six and a compression stage ratio
// prints to nine. Only a per-field declaration can say which is which, so this
// file writes one, out of the same PRINTED_DECIMALS and CLS the assertion
// above uses. It cannot drift from the tolerances because it is the same
// source, and a field added without a class fails the must() above first.
const PRECISION = precisionDeclaration();
const PRECISION_PAYLOAD = `${JSON.stringify(PRECISION, null, 1)}\n`;

fs.writeFileSync(OUT, PAYLOAD);
fs.writeFileSync(PRECISION_OUT, PRECISION_PAYLOAD);

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
console.log(`\nwrote ${F.length} graded fields to ${OUT}`);
console.log(`engines root ${ROOT}`);
console.log(`payload sha256 ${createHash('sha256').update(PAYLOAD).digest('hex')}`);
console.log(`wrote ${Object.keys(PRECISION).length} precision classes to ${PRECISION_OUT}`);
console.log(`precision sha256 ${createHash('sha256').update(PRECISION_PAYLOAD).digest('hex')}`);
