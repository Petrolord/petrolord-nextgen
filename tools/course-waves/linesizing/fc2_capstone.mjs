// Computes the FC2 capstone answers from the IMO-1, BRASS and QUA IBOE
// conditions. Writes fields.json (tier, key, value, tol) and prints a
// report. Nothing here is read by the lessons, the banks or the digest.
//
// NO GRADED FIELD DEPENDS ON A HELD-FOR-LITERATURE QUANTITY:
//   * IMO-1 states its own site erosional c factor, so the three published
//     RP 14E rows are nowhere in this file;
//   * BRASS states its efficiency, so the unsourced E multiplier is an input
//     rather than a lookup;
//   * every Reynolds number here is above 20000, so the held transition band
//     cannot touch a graded friction factor;
//   * every bore, roughness, resistance sum and location class is stated, so
//     no graded value reads the pipe schedule, the roughness table, the
//     fitting K table or the B31.8 class table as a lookup.
//
// It also avoids the engine's own worst defect by construction: FINDINGS D1
// shows gasOutletPressure clamping at its inlet when a descent puts the true
// outlet above it. The BRASS outlet is solved at a contracted rate that lands
// well inside the bracket, and the report asserts that below.
import fs from 'fs';
import {
  IMO_1, IMO_1_C_FACTOR,
  BRASS, BRASS_MU_CP, BRASS_ROUGHNESS_IN, BRASS_CONTRACT_SCFD,
  QUA_IBOE_WALL, QUA_IBOE_AS_BUILT_WALL_IN, QUA_IBOE_PIG,
  QUA_IBOE_HOLDUP_FRAC, QUA_IBOE_CATCHER_BBL, QUA_IBOE_DROPOUT_BPD,
} from '/root/fc-wip-linesizing/fc2_fields_capstone.mjs';

const ROOT = process.env.FC2_ENGINES || '/root/wt-fc2-nextgen/packages/engines';
const H = await import(`${ROOT}/engines/facilities/lineHydraulics.js`);
const C = await import(`${ROOT}/engines/production/chokePerformance.js`);

/* ---------------- Associate, IMO-1 ---------------- */
const imo = H.liquidLineDrop(IMO_1);
const imoErosionalFtS = C.erosionalVelocityFtS({
  mixtureDensityLbFt3: IMO_1.rhoLbFt3, cFactor: IMO_1_C_FACTOR,
});

/* ---------------- Professional, BRASS ---------------- */
const brassElev = H.elevationAdjustment({
  sg: BRASS.sg, elevChangeFt: BRASS.elevChangeFt, tAvgR: BRASS.tAvgR, zAvg: BRASS.zAvg,
});
const brassWey = H.weymouthQ(BRASS);
const brassPhB = H.panhandleBQ(BRASS);
const brassGen = H.generalFlowQ({ ...BRASS, muCp: BRASS_MU_CP, roughnessIn: BRASS_ROUGHNESS_IN });
const brassOutlet = H.gasOutletPressure({
  equation: 'weymouth', qScfd: BRASS_CONTRACT_SCFD,
  p1Psia: BRASS.p1Psia, idIn: BRASS.idIn, lengthMi: BRASS.lengthMi,
  sg: BRASS.sg, tAvgR: BRASS.tAvgR, zAvg: BRASS.zAvg,
  efficiency: BRASS.efficiency, elevChangeFt: BRASS.elevChangeFt,
});

/* ---------------- Expert, QUA IBOE ---------------- */
const quaWall = H.requiredWallIn(QUA_IBOE_WALL);
const quaMaop = H.maopPsig({ ...QUA_IBOE_WALL, wallIn: QUA_IBOE_AS_BUILT_WALL_IN });
const quaVol = H.lineVolumeBbl(QUA_IBOE_PIG);
const quaSwept = H.sweptLiquidBbl({ ...QUA_IBOE_PIG, holdupFrac: QUA_IBOE_HOLDUP_FRAC });
const quaRun = H.pigRun(QUA_IBOE_PIG);
const quaInterval = H.piggingInterval({
  maxSlugBbl: QUA_IBOE_CATCHER_BBL, dropoutBpd: QUA_IBOE_DROPOUT_BPD,
  sweptBbl: quaSwept.sweptBbl,
});

const F = [
  // Associate: the liquid line end to end, and the limit that is not a drop.
  ['beginner', 'imo1_velocity_fts', imo.vFtS, 1e-6],
  ['beginner', 'imo1_reynolds', imo.re, 1e-2],
  ['beginner', 'imo1_friction_factor', imo.f, 1e-9],
  ['beginner', 'imo1_friction_drop_psi', imo.dpFrictionPsi, 1e-5],
  ['beginner', 'imo1_total_drop_psi', imo.dpTotalPsi, 1e-5],
  ['beginner', 'imo1_erosional_velocity_fts', imoErosionalFtS, 1e-6],
  // Professional: the elevation group, three forms and the inverse solve.
  ['intermediate', 'brass_elevation_factor', brassElev.es, 1e-9],
  ['intermediate', 'brass_weymouth_scfd', brassWey.qScfd, 1e3],
  ['intermediate', 'brass_panhandleb_scfd', brassPhB.qScfd, 1e3],
  ['intermediate', 'brass_general_scfd', brassGen.qScfd, 1e3],
  ['intermediate', 'brass_general_friction_factor', brassGen.fDarcy, 1e-9],
  ['intermediate', 'brass_outlet_pressure_psia', brassOutlet.p2Psia, 1e-5],
  // Expert: the wall a code demands, and the pigging chain.
  ['advanced', 'quaiboe_required_wall_in', quaWall.tRequiredIn, 1e-8],
  ['advanced', 'quaiboe_maop_as_built_psig', quaMaop.maopPsig, 1e-5],
  ['advanced', 'quaiboe_line_volume_bbl', quaVol, 1e-4],
  ['advanced', 'quaiboe_swept_volume_bbl', quaSwept.sweptBbl, 1e-5],
  // LOOSENED 2026-09-16 FROM 1e-7, WHICH NOTHING THIS COURSE PRINTS COULD
  // SATISFY. Run hours print to six decimals and days to four, so at 1e-7 a
  // learner reading correctly off the studio was graded on their luck at
  // guessing unprinted digits: 21.266667 is 3.3e-7 out and 9.0239 is 1.1e-5
  // out. A FIELD THAT CANNOT BE ANSWERED FROM THE MATERIAL IS NOT A HARD
  // FIELD, IT IS A BROKEN ONE. Each is now half a unit in the last place the
  // course actually prints that quantity, which is still 2.4e-8 and 5.5e-6
  // relative, so neither is trivially wide.
  ['advanced', 'quaiboe_pig_run_hours', quaRun.runHours, 5e-7],
  ['advanced', 'quaiboe_pigging_interval_days', quaInterval.intervalDays, 5e-5],
];

fs.writeFileSync('/root/fc-wip-linesizing/fields.json', JSON.stringify(F, null, 1));

const f = (x, n = 8) => (x === null || x === undefined ? 'null' : Number(x).toFixed(n));
console.log('# FC2 capstone: the IMO-1 transfer line, the BRASS trunk and the QUA IBOE export line');
console.log(`IMO-1: v ${f(imo.vFtS)} ft/s, Re ${f(imo.re, 4)} (${imo.regime}), f ${f(imo.f, 10)}`);
console.log(`  friction ${f(imo.dpFrictionPsi)} psi, fittings ${f(imo.dpFittingsPsi)} psi, elevation ${f(imo.dpElevationPsi)} psi, total ${f(imo.dpTotalPsi)} psi`);
console.log(`  erosional velocity at the site c factor ${IMO_1_C_FACTOR}: ${f(imoErosionalFtS)} ft/s; the line runs at ${f(imo.vFtS / imoErosionalFtS)} of it`);
console.log(`BRASS: s ${f(brassElev.s, 10)}, es ${f(brassElev.es, 10)}, leFactor ${f(brassElev.leFactor, 10)}`);
console.log(`  weymouth ${f(brassWey.qScfd, 4)}, panhandleA ${f(H.panhandleAQ(BRASS).qScfd, 4)}, panhandleB ${f(brassPhB.qScfd, 4)}, general ${f(brassGen.qScfd, 4)} scfd, fDarcy ${f(brassGen.fDarcy, 10)}`);
console.log(`  outlet at the contracted ${BRASS_CONTRACT_SCFD} scfd: ${f(brassOutlet.p2Psia)} psia, a drop of ${f(brassOutlet.dpPsi)} psi`);
console.log(`QUA IBOE: required wall ${f(quaWall.tRequiredIn)} in (pressure part ${f(quaWall.tPressureIn)} in, design factor ${f(quaWall.designFactor, 2)})`);
console.log(`  as built ${QUA_IBOE_AS_BUILT_WALL_IN} in rates ${f(quaMaop.maopPsig)} psig`);
console.log(`  volume ${f(quaVol, 6)} bbl, swept ${f(quaSwept.sweptBbl, 6)} bbl at holdup ${QUA_IBOE_HOLDUP_FRAC}, run ${f(quaRun.runHours)} h, interval ${f(quaInterval.intervalDays)} d`);

// ------------------------------------------------- self checks on the cut
const problems = [];
if (!(imo.re > 20000)) problems.push('IMO-1 is not comfortably turbulent, so the HELD transition band could touch a graded friction factor');
if (imo.regime !== 'turbulent') problems.push(`IMO-1 regime is ${imo.regime}, not turbulent`);
if (brassOutlet.error) problems.push(`the BRASS outlet solve refused: ${brassOutlet.error}`);
if (brassOutlet.p2Psia >= BRASS.p1Psia - 1e-9) problems.push('the BRASS outlet solve is sitting on its bracket, which is FINDINGS D1');
if (quaSwept.error) problems.push(`the QUA IBOE sweep refused: ${quaSwept.error}`);
if (quaInterval.error) problems.push(`the QUA IBOE interval refused: ${quaInterval.error}`);
if (!(QUA_IBOE_AS_BUILT_WALL_IN > quaWall.tRequiredIn)) problems.push('the QUA IBOE as-built wall is thinner than the code requires, so the MAOP field grades an illegal pipe');
for (const [, , v] of F) if (!Number.isFinite(v)) problems.push('a graded value is not a finite number');
console.log(problems.length ? `\nPROBLEMS:\n  ${problems.join('\n  ')}` : '\nself checks: turbulent, no refusals, the outlet is inside its bracket, the as-built wall clears the code');
console.log(`\n${F.length} fields written to fields.json`);
