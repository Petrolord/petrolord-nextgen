// THE FC6 CAPSTONE GENERATOR. Runs the three capstone cases through the engine
// and writes the eighteen graded fields, six a tier, with their tolerances.
//
// Nothing here is read by fc6_dump.mjs and nothing here is quoted into a
// lesson: the digest and the capstone are two separate roads, and
// gate_capstone_leak.py sweeps both directions to keep it that way.
//
// Usage: node fc6_capstone.mjs [--json] [--bare-stated-tolerances]
//
// EVERY GRADED FIELD IS A RETURN VALUE OF THE ENGINE. None is arithmetic
// performed here. The held-item neutralisations at the head of
// fc6_fields_capstone.mjs are ASSERTED below rather than asserted in prose:
// the generator proves it never called the film, proves no graded key is one
// of the bundle or fan keys, and proves the hot-day block reports the basis
// that says it assumed no arrangement.
//
// THE TOLERANCES ARE NOT DECLARED HERE. This generator and the shipped
// teaching lab both import the ONE derivation, in the repository, so the
// number this file writes into fields.json is literally the number the lab
// ships. FC2 and FC3 each carried a third copy in the lab and each shipped it
// stale.
import fs from 'fs';
import {
  AMENAM_HOT, AMENAM_COLD, AMENAM_TERMINALS, AMENAM_ARRANGEMENT,
  AMENAM_U_BTU_HR_FT2_F, AMENAM_TUBE, AMENAM_LAYOUT_DEG, AMENAM_BUNDLE_CLEARANCE_IN,
  UBIT_TERMINALS, UBIT_SHELLS, UBIT_SHELLS_IN_SERIES, UBIT_STACK,
  OKWORI,
} from '/root/fc-wip-heattransfer/fc6_fields_capstone.mjs';

const TOLPATH = process.env.FC6_TOLERANCE
  || '/root/wt-fc6-nextgen/src/components/course/panels/heattransfer/gradedTolerance.js';
const {
  PRINTED_DECIMALS, GRADED_FIELDS, gradedClassOf, gradedTolerance, precisionDeclaration,
} = await import(TOLPATH);

const OUT = process.env.FC6_FIELDS_OUT || '/root/fc-wip-heattransfer/fields.json';
const PRECISION_OUT = process.env.FC6_PRECISION_OUT || '/root/fc-wip-heattransfer/precision.json';
const ROOT = process.env.FC6_ENGINES || '/root/wt-fc6-nextgen/packages/engines';
const H = await import(`${ROOT}/engines/facilities/heatTransfer.js`);
const BARE = process.argv.includes('--bare-stated-tolerances');

const must = (cond, msg) => {
  if (!cond) { console.error(`CAPSTONE ASSERTION FAILED: ${msg}`); process.exit(1); }
};

/* ---------------- Associate, AMENAM ---------------- */
const amHot = H.capacityRate(AMENAM_HOT);
const amCold = H.capacityRate(AMENAM_COLD);
must(!amHot.error, `AMENAM hot capacity rate: ${amHot.error}`);
must(!amCold.error, `AMENAM cold capacity rate: ${amCold.error}`);
const amBal = H.energyBalance({
  cHot: amHot.cBtuHrF, cCold: amCold.cBtuHrF, ...AMENAM_TERMINALS,
  arrangement: AMENAM_ARRANGEMENT,
});
must(!amBal.error, `AMENAM balance: ${amBal.error}`);
must(amBal.basis === 'hot outlet', `AMENAM balance basis is ${amBal.basis}, so the cold outlet is not the engine's answer`);
const amLmtd = H.lmtd({
  thIn: AMENAM_TERMINALS.thIn, thOut: amBal.thOut, tcIn: AMENAM_TERMINALS.tcIn, tcOut: amBal.tcOut,
  arrangement: AMENAM_ARRANGEMENT,
});
must(!amLmtd.error, `AMENAM log mean: ${amLmtd.error}`);
must(amLmtd.equalEnds === false, 'AMENAM has equal end differences, so its log mean is the arithmetic mean and discriminates nothing');
const amArea = H.areaRequired({
  qBtuHr: amBal.qBtuHr, uBtuHrFt2F: AMENAM_U_BTU_HR_FT2_F, lmtdF: amLmtd.lmtdF, f: 1,
});
must(!amArea.error, `AMENAM area: ${amArea.error}`);
const amTubes = H.tubeCount({
  areaFt2: amArea.areaFt2, ...AMENAM_TUBE,
  layoutDeg: AMENAM_LAYOUT_DEG, bundleClearanceIn: AMENAM_BUNDLE_CLEARANCE_IN,
});
must(!amTubes.error, `AMENAM tube count: ${amTubes.error}`);
must(amTubes.nTubes % AMENAM_TUBE.passes === 0,
  `AMENAM's ${amTubes.nTubes} tubes do not divide equally into ${AMENAM_TUBE.passes} passes`);
must(amTubes.areaMarginPct > 0, 'AMENAM lands exactly on its required area, so the rounding teaches nothing');

/* ---------------- Professional, UBIT ---------------- */
const ubGroups = H.lmtdGroups(UBIT_TERMINALS);
must(!ubGroups.error, `UBIT P and R: ${ubGroups.error}`);
const ubF1 = H.lmtdCorrectionF({ p: ubGroups.p, r: ubGroups.r, shellPasses: UBIT_SHELLS });
must(!ubF1.error, `UBIT F at one shell: ${ubF1.error}`);
must(ubF1.warning === null, `UBIT F at one shell warns: ${ubF1.warning}`);
must(ubF1.p1 === ubGroups.p, 'UBIT at one shell should use P itself as the equivalent single-shell P');
const ubF2 = H.lmtdCorrectionF({ p: ubGroups.p, r: ubGroups.r, shellPasses: UBIT_SHELLS_IN_SERIES });
must(!ubF2.error, `UBIT F at two shells: ${ubF2.error}`);
must(ubF2.p1 < ubGroups.p, 'the equivalent single-shell P at two shells must be below the whole-unit P');
must(ubF2.f > ubF1.f, 'the second shell must raise F or there is nothing to teach');
const ubU = H.overallUOutside(UBIT_STACK);
must(!ubU.error, `UBIT coefficient: ${ubU.error}`);
must(ubU.referenceArea.includes('outside'), 'UBIT U must be referred to the outside tube surface');
must(ubU.controllingClear === true,
  `UBIT's controlling resistance is not clear (${ubU.controllingMarginPct} percent), so the margin is a coin toss`);
const stackSum = Object.values(ubU.resistances).reduce((a, b) => a + b, 0);
must(Math.abs(stackSum - ubU.totalResistance) < 1e-15,
  'UBIT resistances do not add to the total the engine reports');

/* ---------------- Expert, OKWORI ---------------- */
const okAir = H.airCooler(OKWORI);
must(!okAir.error, `OKWORI bay: ${okAir.error}`);
must(okAir.fCorrection === null, 'OKWORI must report fCorrection as null, which is the held cross-flow correction being declined');
must(okAir.draftType === 'forced' && okAir.fanInletF === OKWORI.ambientF,
  'OKWORI is a forced-draft bay, so the fan inlet is the ambient air');
const okHot = okAir.hotDay;
must(okHot && !okHot.error, `OKWORI hot day: ${okHot && okHot.error}`);
must(okHot.basis.includes('no arrangement'),
  `OKWORI hot day does not report an arrangement-free basis: ${okHot.basis}`);
must(okHot.regime === 'hotter than design', `OKWORI hot day regime is ${okHot.regime}`);
must(okHot.designOutletReached === false,
  'OKWORI reaches its design outlet on the hot day, so the rating teaches nothing');
// The rated duty, the new outlet and the new air rise must agree with each
// other. This is the self-consistency the pre-repair block could not satisfy.
const cProcess = OKWORI.qBtuHr / (OKWORI.processInF - OKWORI.processOutF);
const cAir = OKWORI.qBtuHr / OKWORI.airRiseF;
must(Math.abs((OKWORI.processInF - okHot.processOutF) * cProcess - okHot.qBtuHr) < 1e-6,
  'the hot-day duty and the hot-day process outlet disagree');
must(Math.abs(okHot.airRiseF * cAir - okHot.qBtuHr) < 1e-6,
  'the hot-day duty and the hot-day air rise disagree');
// THE SECOND METHOD, run here as well as in the oracle: q = UA x LMTD at the
// fixed UA and the hot-day log mean must return the same duty.
must(Math.abs(okHot.uaBtuHrF * okHot.lmtdF - okHot.qBtuHr) / okHot.qBtuHr < 2e-6,
  `q = UA x LMTD gives ${okHot.uaBtuHrF * okHot.lmtdF} against the rated ${okHot.qBtuHr}`);

/* ------------------------------------------------------------------ *
 * THE HELD-ITEM PROOF, by construction and by assertion.
 * ------------------------------------------------------------------ */
const src = fs.readFileSync('/root/fc-wip-heattransfer/fc6_capstone.mjs', 'utf8');
must(!/H\.tubeSideFilm\s*\(/.test(src),
  'this generator calls tubeSideFilm, which carries all five fitted constants');
must(!/H\.bundleConstants\s*\(/.test(src), 'this generator reads the held bundle table');
const FORBIDDEN_KEYS = [
  'bundleDiameterIn', 'shellDiameterIn', 'fanBhp', 'motorHp', 'acfm',
  'airDensityLbFt3', 'airLbHr', 'hBtuHrFt2F', 're', 'pr',
];

/* ------------------------------------------------------------------ *
 * The eighteen rows, in the order gradedTolerance.js publishes them.
 * ------------------------------------------------------------------ */
const VALUES = {
  amenam_duty_btu_hr: amBal.qBtuHr,
  amenam_cold_outlet_f: amBal.tcOut,
  amenam_lmtd_f: amLmtd.lmtdF,
  amenam_area_ft2: amArea.areaFt2,
  amenam_area_per_tube_ft2: amTubes.areaPerTubeFt2,
  amenam_area_margin_pct: amTubes.areaMarginPct,
  ubit_f_correction: ubF1.f,
  ubit_p1_two_shells: ubF2.p1,
  ubit_u_clean: ubU.uCleanBtuHrFt2F,
  ubit_u_dirty: ubU.uDirtyBtuHrFt2F,
  ubit_fouling_penalty_pct: ubU.foulingPenaltyPct,
  ubit_controlling_margin_pct: ubU.controllingMarginPct,
  okwori_design_lmtd_f: okAir.lmtdF,
  okwori_design_effectiveness: okHot.effectiveness,
  okwori_capacity_ratio: okHot.cr,
  okwori_ua_btu_hr_f: okHot.uaBtuHrF,
  okwori_hotday_ntu: okHot.ntu,
  okwori_hotday_process_out_f: okHot.processOutF,
};
const LABELS = {
  amenam_duty_btu_hr: 'The duty the specified hot outlet sets',
  amenam_cold_outlet_f: 'The cold outlet that duty implies',
  amenam_lmtd_f: 'The counter-current log mean driving force',
  amenam_area_ft2: 'The outside surface the duty needs',
  amenam_area_per_tube_ft2: 'The outside surface one tube carries',
  amenam_area_margin_pct: 'The surface the rounding overshoots by',
  ubit_f_correction: 'The correction factor at one shell pass',
  ubit_p1_two_shells: 'The equivalent single-shell P at two shells in series',
  ubit_u_clean: 'The clean overall coefficient, outside referred',
  ubit_u_dirty: 'The dirty overall coefficient, outside referred',
  ubit_fouling_penalty_pct: 'What the two fouling allowances cost',
  ubit_controlling_margin_pct: 'How far the controlling resistance leads the next one',
  okwori_design_lmtd_f: 'The design log mean of the bay',
  okwori_design_effectiveness: 'Effectiveness at the design point, from its definition',
  okwori_capacity_ratio: 'The capacity ratio of the bay',
  okwori_ua_btu_hr_f: 'The surface the bay holds on the hot day',
  okwori_hotday_ntu: 'NTU at that fixed UA',
  okwori_hotday_process_out_f: 'Where the process actually leaves on the hot day',
};

const rows = GRADED_FIELDS.map(([tier, key, cls]) => {
  must(Object.prototype.hasOwnProperty.call(VALUES, key), `no value computed for the graded field ${key}`);
  must(!FORBIDDEN_KEYS.some((f) => key.endsWith(f)),
    `${key} names a value on a held path (${FORBIDDEN_KEYS.join(', ')})`);
  const v = VALUES[key];
  must(typeof v === 'number' && Number.isFinite(v), `${tier}/${key} is not a finite number: ${v}`);
  must(LABELS[key], `${key} has no label`);
  return {
    tier, key, cls, unit: cls, value: v, label: LABELS[key],
    stated: gradedClassOf(key).stated,
    tol: BARE ? gradedClassOf(key).stated : gradedTolerance(key),
  };
});
must(rows.length === 18, `${rows.length} graded fields, and every wave grades 18`);
must(Object.keys(VALUES).length === 18, 'the value table and the field table disagree in length');

/* THE ANSWERABILITY CHECK. A tolerance tighter than half a unit in the last
 * printed place is a field a learner cannot answer by reading the figure and
 * typing it back. `--bare-stated-tolerances` skips the widening and is the
 * NEGATIVE CONTROL: it must make this exit 1. It deliberately does NOT touch
 * PRINTED_DECIMALS, because moving the floor and the tolerance together is a
 * control that cannot fail. */
const unanswerable = [];
rows.forEach((r) => {
  const d = PRINTED_DECIMALS[r.cls];
  const floor = Number(`5e-${d + 1}`);
  if (r.tol < floor) {
    unanswerable.push(
      `${r.tier}/${r.key}: graded at ${r.tol} but the ${r.cls} class prints to ${d} decimals, `
      + `so the finest answer a learner can give is ${r.value.toFixed(d)} and the error that quoting `
      + `it carries is up to ${floor}, which is ${(floor / r.tol).toPrecision(3)} times the tolerance`);
  }
});

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(rows, null, 1));
  process.exit(unanswerable.length ? 1 : 0);
}

// THE NEGATIVE CONTROL NEVER WRITES. A control run that overwrote fields.json
// with the tolerances it is proving unanswerable would leave the wave holding
// an unanswerable answer key, which is the defect rather than the control. The
// generator FC4 copied this shape from wrote first and exited 1 second.
if (!BARE) {
  fs.writeFileSync(OUT, `${JSON.stringify(rows.map((r) => [r.tier, r.key, r.value, r.tol]), null, 1)}\n`);
  fs.writeFileSync(PRECISION_OUT, `${JSON.stringify(precisionDeclaration(), null, 1)}\n`);
} else {
  console.log('  NEGATIVE CONTROL: --bare-stated-tolerances wrote nothing and must exit 1');
}

let tier = '';
rows.forEach((r) => {
  if (r.tier !== tier) { tier = r.tier; console.log(`\n# ${tier}`); }
  console.log(`  ${r.key.padEnd(30)} ${String(r.value).padEnd(22)} ${r.cls.padEnd(12)} tol ${String(r.tol).padEnd(8)} ${r.label}`);
});
const widened = rows.filter((r) => r.tol !== r.stated);
console.log(`\n  wrote ${OUT}: ${rows.length} graded fields, 6 a tier`);
console.log(`  wrote ${PRECISION_OUT}: ${Object.keys(precisionDeclaration()).length} class(es), covering ${rows.filter((r) => new RegExp(precisionDeclaration()[r.cls].match).test(r.key)).length} of ${rows.length} graded fields`);
console.log(`  tolerances widened to the printed precision: ${widened.length} -> ${widened.map((r) => `${r.tier}/${r.key} ${r.stated} to ${r.tol}`).join(', ') || 'none'}`);
console.log(`  UNANSWERABLE AT THE DECLARED PRECISION: ${unanswerable.length}`);
unanswerable.forEach((u) => console.log(`   ${u}`));
console.log('  held-item proof: the film was never called, no graded key is a bundle, fan or film key,');
console.log(`  the bay reports fCorrection ${okAir.fCorrection}, and the hot day reports its basis as "${okHot.basis}"`);
console.log(`  the second method agrees: UA x LMTD = ${okHot.uaBtuHrF * okHot.lmtdF} against the rated ${okHot.qBtuHr}`);
if (unanswerable.length) process.exit(1);
