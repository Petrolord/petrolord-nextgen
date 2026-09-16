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

/* ==========================================================================
 * PRINTED DECIMALS, BY QUANTITY CLASS, AND WHERE EACH NUMBER COMES FROM.
 *
 * A graded capstone field is answered by a learner reading a figure and
 * typing it back at the precision this course tells them to quote. So a
 * tolerance tighter than half a unit in the last place the course PRINTS that
 * class of quantity is a field nobody can answer by doing as they were told.
 * Two of the eighteen were exactly that, and both are widened below.
 *
 * Every number here is read off the digest, not off a field name. The digest
 * header states the conventions and fc2_dump.mjs applies them, so each class
 * is confirmed twice, by the sentence a learner reads and by the formatter
 * that produced the page:
 *
 *   6   ft per s      e6 in the dump. "2.244621 ft/s" on the OGBIA row.
 *   6   psi           e6. Covers psi, psia and psig: "25.660631 psi",
 *                     "874.339369 psia", "1019.607843 psig".
 *   6   inches        e6, including the wall table itself: the SOKU required
 *                     wall prints "0.419231 in" and "0.329327 in". The four
 *                     PUBLISHED wall cases print ten decimals, but those rows
 *                     exist to stand a golden beside an engine value, and the
 *                     figure a reader is asked to report is the six-decimal
 *                     one. Sixty-one inch figures in the digest print at six
 *                     and eight at ten, all eight of them golden comparisons.
 *   6   hours         e6 at every call site: "2.444444 hours", "1.666667 h".
 *  10   friction      the header says ten and the prose prints ten:
 *       factors       "0.0218149625", "0.0112132010". The branch tables print
 *                     twelve, so ten is the coarser of the two and therefore
 *                     the safer floor.
 *  10   elevation     "0.9234878318", "1.0828513009" in the hill table.
 *       group factors
 *   4   gas rates     r4. "66104956.1404 scfd".
 *   4   Reynolds      r4. "48431.2523".
 *   4   barrels       r4. "1633.5349 bbl", "98.0121 bbl". The six-decimal
 *                     barrel figures in the digest are catcher sizes handed
 *                     in as inputs, not volumes the engine returned.
 *   4   days          r4. "3.7997 days".
 *
 * HOURS ARE LIQUID WORK AND THEY PRINT TO SIX. Every place this course states
 * the convention says so: the digest header, the e6 comment in fc2_dump.mjs
 * that produced the page, the Expert capstone lesson and the Expert m06 bank
 * question on the conventions. Barrels and days are four-decimal quantities
 * and hours are a six-decimal one, which is why quaiboe_pig_run_hours is
 * graded at the half-unit of six places.
 * ========================================================================== */
export const PRINTED_DECIMALS = {
  ftPerS: 6,
  psi: 6,
  in: 6,
  hours: 6,
  frictionFactor: 10,
  elevationFactor: 10,
  scfd: 4,
  reynolds: 4,
  bbl: 4,
  days: 4,
};

/** The class each graded field's quantity belongs to. Read off what the
 *  digest prints for that quantity, never off the shape of the key. */
export const FIELD_CLASS = {
  imo1_velocity_fts: 'ftPerS',
  imo1_reynolds: 'reynolds',
  imo1_friction_factor: 'frictionFactor',
  imo1_friction_drop_psi: 'psi',
  imo1_total_drop_psi: 'psi',
  imo1_erosional_velocity_fts: 'ftPerS',
  brass_elevation_factor: 'elevationFactor',
  brass_weymouth_scfd: 'scfd',
  brass_panhandleb_scfd: 'scfd',
  brass_general_scfd: 'scfd',
  brass_general_friction_factor: 'frictionFactor',
  brass_outlet_pressure_psia: 'psi',
  quaiboe_required_wall_in: 'in',
  quaiboe_maop_as_built_psig: 'psi',
  quaiboe_line_volume_bbl: 'bbl',
  quaiboe_swept_volume_bbl: 'bbl',
  quaiboe_pig_run_hours: 'hours',
  quaiboe_pigging_interval_days: 'days',
};

/**
 * The tolerance a field is graded at: the STATED one, or half a unit in the
 * last place this course prints that class, WHICHEVER IS LOOSER.
 *
 * MAX AND NEVER MIN. This can only widen a tolerance, so every answer that
 * graded correct before still grades correct, and nothing starts grading
 * right for any reason except that it can now be answered from the material.
 */
// Half a unit in the last printed place, formed as 5 over a power of ten so
// it is the SAME DOUBLE the decimal literal 5e-N is, rather than the
// 0.000049999999999999996 that 0.5 * 10 ** -4 produces. A tolerance that
// prints as a long tail of nines in the seed SQL is a tolerance nobody can
// read back against this file.
export const halfUlp = (decimals) => 5 / 10 ** (decimals + 1);
export const toleranceFor = (cls, stated) => {
  const d = PRINTED_DECIMALS[cls];
  if (d === undefined) throw new Error(`no printed precision declared for the class "${cls}"`);
  return Math.max(stated, halfUlp(d));
};

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

// THE STATED TOLERANCE of each field: what the quantity MEANS, chosen before
// anything about how many digits happen to print. The tolerance actually
// graded is this or the half-unit of the field's printed class, whichever is
// looser, so this table can only ever be tightened by intent and never by
// accident.
const STATED = {
  imo1_velocity_fts: 1e-6,
  imo1_reynolds: 1e-2,
  imo1_friction_factor: 1e-9,
  imo1_friction_drop_psi: 1e-5,
  imo1_total_drop_psi: 1e-5,
  imo1_erosional_velocity_fts: 1e-6,
  brass_elevation_factor: 1e-9,
  brass_weymouth_scfd: 1e3,
  brass_panhandleb_scfd: 1e3,
  brass_general_scfd: 1e3,
  brass_general_friction_factor: 1e-9,
  brass_outlet_pressure_psia: 1e-5,
  quaiboe_required_wall_in: 1e-8,
  quaiboe_maop_as_built_psig: 1e-5,
  quaiboe_line_volume_bbl: 1e-4,
  quaiboe_swept_volume_bbl: 1e-5,
  quaiboe_pig_run_hours: 1e-7,
  quaiboe_pigging_interval_days: 1e-7,
};

// `--bare-stated-tolerances` writes nothing and grades against STATED alone.
// It is the NEGATIVE CONTROL on the widening: it must report the fields that
// cannot be answered and exit 1. It deliberately does not touch
// PRINTED_DECIMALS, because moving the floor and the check together is a
// control that cannot fail.
const BARE = process.argv.includes('--bare-stated-tolerances');

const VALUES = [
  // Associate: the liquid line end to end, and the limit that is not a drop.
  ['beginner', 'imo1_velocity_fts', imo.vFtS],
  ['beginner', 'imo1_reynolds', imo.re],
  ['beginner', 'imo1_friction_factor', imo.f],
  ['beginner', 'imo1_friction_drop_psi', imo.dpFrictionPsi],
  ['beginner', 'imo1_total_drop_psi', imo.dpTotalPsi],
  ['beginner', 'imo1_erosional_velocity_fts', imoErosionalFtS],
  // Professional: the elevation group, three forms and the inverse solve.
  ['intermediate', 'brass_elevation_factor', brassElev.es],
  ['intermediate', 'brass_weymouth_scfd', brassWey.qScfd],
  ['intermediate', 'brass_panhandleb_scfd', brassPhB.qScfd],
  ['intermediate', 'brass_general_scfd', brassGen.qScfd],
  ['intermediate', 'brass_general_friction_factor', brassGen.fDarcy],
  ['intermediate', 'brass_outlet_pressure_psia', brassOutlet.p2Psia],
  // Expert: the wall a code demands, and the pigging chain.
  ['advanced', 'quaiboe_required_wall_in', quaWall.tRequiredIn],
  ['advanced', 'quaiboe_maop_as_built_psig', quaMaop.maopPsig],
  ['advanced', 'quaiboe_line_volume_bbl', quaVol],
  ['advanced', 'quaiboe_swept_volume_bbl', quaSwept.sweptBbl],
  ['advanced', 'quaiboe_pig_run_hours', quaRun.runHours],
  ['advanced', 'quaiboe_pigging_interval_days', quaInterval.intervalDays],
];

const unanswerable = [];
const widened = [];
const F = VALUES.map(([tier, key, value]) => {
  const stated = STATED[key];
  if (stated === undefined) throw new Error(`no stated tolerance for ${tier}/${key}`);
  const cls = FIELD_CLASS[key];
  if (cls === undefined) throw new Error(`no printed class for ${tier}/${key}`);
  const tol = BARE ? stated : toleranceFor(cls, stated);
  const floor = halfUlp(PRINTED_DECIMALS[cls]);
  if (tol < floor) {
    unanswerable.push(
      `${tier}/${key}: graded at ${tol} but ${cls} prints to ${PRINTED_DECIMALS[cls]} decimals, `
      + `so the finest answer a learner can give is ${value.toFixed(PRINTED_DECIMALS[cls])} and `
      + `quoting it carries up to ${floor}, which is ${(floor / tol).toPrecision(3)} times the tolerance`);
  }
  if (tol !== stated) widened.push(`${tier}/${key} ${stated} -> ${tol}`);
  return [tier, key, value, tol];
});

/* --------------------------------------------------------------------------
 * precision.json, GENERATED FROM THE SAME TABLE AS THE TOLERANCES.
 *
 * gradeprecision.py classifies a graded field by matching its KEY against the
 * digest header's words, and on this wave that reached 7 of 18: the header
 * names quantities in English and eleven keys carry none of those words, so
 * eleven tolerances went UNCHECKED and the gate reported green. A precision
 * check covering a third of the answer key is not a pass.
 *
 * The repair is not a second hand-written table. PRINTED_DECIMALS above is
 * this wave's one statement of what prints at what precision and toleranceFor
 * already grades against it, so this writes the same map out in the shape the
 * gate reads, keyed by the exact field keys that carry each class. The gate
 * and the grader cannot disagree, because there is only one of them.
 * -------------------------------------------------------------------------- */
const byClass = new Map();
F.forEach(([, key]) => {
  const cls = FIELD_CLASS[key];
  if (!byClass.has(cls)) byClass.set(cls, new Set());
  byClass.get(cls).add(key);
});
const precision = {};
[...byClass.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1)).forEach(([cls, keys]) => {
  precision[cls] = {
    decimals: PRINTED_DECIMALS[cls],
    match: `^(?:${[...keys].sort().join('|')})$`,
  };
});
const covered = new Set(F.filter(([, key]) => new RegExp(precision[FIELD_CLASS[key]].match, 'i').test(key)).map(([t, k]) => `${t}/${k}`));

if (BARE) {
  console.log('--bare-stated-tolerances: NEGATIVE CONTROL, nothing written.');
  console.log(`  UNANSWERABLE AT THE PRINTED PRECISION: ${unanswerable.length}`);
  unanswerable.forEach((u) => console.log(`   ${u}`));
  process.exit(unanswerable.length ? 1 : 2);
}

fs.writeFileSync('/root/fc-wip-linesizing/fields.json', JSON.stringify(F, null, 1));
fs.writeFileSync('/root/fc-wip-linesizing/precision.json', `${JSON.stringify(precision, null, 1)}\n`);
console.log(`precision.json: ${Object.keys(precision).length} class(es) from PRINTED_DECIMALS, covering ${covered.size} of ${F.length} graded fields`);
if (covered.size !== F.length) { console.log('REFUSED: precision.json does not cover every graded field'); process.exit(2); }
console.log(`tolerances widened to the printed precision: ${widened.length}${widened.length ? ` -> ${widened.join(', ')}` : ''}`);
console.log(`UNANSWERABLE AT THE PRINTED PRECISION: ${unanswerable.length}`);
unanswerable.forEach((u) => console.log(`   ${u}`));

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
