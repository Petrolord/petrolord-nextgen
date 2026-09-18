// THE FC7 CAPSTONE GENERATOR. Runs the OGULAGHA, IZOMBE and TUNU streams
// through the vendored engine and writes the eighteen graded answers, six a
// tier. Nothing here is read by the digest, the lessons, the banks or the
// panels, and nothing here is arithmetic of its own: EVERY GRADED VALUE IS A
// RETURN VALUE OF THE ENGINE.
//
// It ASSERTS the held-item neutralisations rather than stating them in prose.
// The six held items and the construction that clears each one are listed at
// the head of fc7_fields_capstone.mjs; the `must` calls below are that list
// executed against the engine's own returns, and this file writes nothing at
// all if one of them fails.
//
// Usage:  node fc7_capstone.mjs            writes fields.json and precision.json
//         node fc7_capstone.mjs --json     the rows, for another tool
//         node fc7_capstone.mjs --bare-stated-tolerances   NEGATIVE CONTROL
import fs from 'fs';
import {
  m3PerSecond,
  OGULAGHA_WATER, OGULAGHA_OIL, OGULAGHA_BWPD, OGULAGHA_INLET,
  OGULAGHA_BASIN, OGULAGHA_PLATES,
  IZOMBE_WATER, IZOMBE_OIL, IZOMBE_BWPD, IZOMBE_LINERS, IZOMBE_FLOTATION, IZOMBE_FILTER,
  TUNU_WATER, TUNU_OIL, TUNU_BWPD, TUNU_INLET, TUNU_PLATES, TUNU_LINERS, TUNU_FILTER,
  TUNU_GRID, TUNU_COARSE_DROPLET_MICRON,
} from '/root/fc-wip-producedwater/fc7_fields_capstone.mjs';

// THE TOLERANCES ARE NOT DECLARED HERE. This generator and the shipped teaching
// lab import the ONE derivation, which lives in the repository, so the number
// written into fields.json is literally the number the lab ships.
const TOLPATH = process.env.FC7_TOLERANCE
  || '/root/wt-fc7-nextgen/src/components/course/panels/producedwater/gradedTolerance.js';
const {
  PRINTED_DECIMALS, GRADED_FIELDS, gradedClassOf, gradedTolerance, precisionDeclaration,
} = await import(TOLPATH);

const OUT = process.env.FC7_FIELDS_OUT || '/root/fc-wip-producedwater/fields.json';
const PRECISION_OUT = process.env.FC7_PRECISION_OUT || '/root/fc-wip-producedwater/precision.json';
const ROOT = process.env.FC7_ENGINES || '/root/wt-fc7-nextgen/packages/engines';
const P = await import(`${ROOT}/engines/facilities/producedWater.js`);
const BARE = process.argv.includes('--bare-stated-tolerances');
const notes = [];
/**
 * `must` is for the held-item and soundness statements, and its message is
 * phrased as WHAT HOLDS, so the report reads as a list of measured facts. The
 * message is recorded on success and printed as the failure on failure, which
 * is why it must never be phrased as a complaint: a passing assertion that
 * reads like a fault is a report nobody can use.
 */
const must = (cond, msg) => {
  if (!cond) { console.error(`CAPSTONE ASSERTION FAILED, and this is what did NOT hold: ${msg}`); process.exit(1); }
  notes.push(msg);
};
/** `check` is for the structural invariants. Nothing to report when they hold. */
const check = (cond, msg) => {
  if (!cond) { console.error(`CAPSTONE REFUSES: ${msg}`); process.exit(1); }
};
const ok = (r, what) => { check(!r.error, `${what} refused: ${r.error}`); return r; };

/* ============================================ Associate, OGULAGHA ======== */
const ogQ = m3PerSecond(OGULAGHA_BWPD);
const ogMu = ok(P.waterViscosityPaS(OGULAGHA_WATER), 'the OGULAGHA water viscosity');
const ogRhoW = ok(P.waterDensityKgM3(OGULAGHA_WATER), 'the OGULAGHA brine density');
const ogRhoO = ok(P.oilDensityKgM3(OGULAGHA_OIL), 'the OGULAGHA crude density');
const ogFluid = { rhoWater: ogRhoW.rhoKgM3, rhoOil: ogRhoO.rhoKgM3, muPaS: ogMu.muPaS };
must(ogFluid.rhoWater > ogFluid.rhoOil,
  `the OGULAGHA oil is lighter than its water: ${ogRhoO.rhoKgM3} against ${ogRhoW.rhoKgM3} kg/m3`);
const ogRise = ok(P.stokesRiseMS({ dMicron: OGULAGHA_INLET.d50Micron, ...ogFluid }),
  'the OGULAGHA median droplet rise');
must(ogRise.warning === null,
  `the OGULAGHA median droplet rises at Reynolds ${ogRise.reynolds}, inside the creeping flow band Stokes is stated for, so the graded rise velocity is not an extrapolation`);
const ogBasin = ok(P.apiSeparator({ flowM3S: ogQ, ...OGULAGHA_BASIN, ...ogFluid }),
  'the OGULAGHA API 421 basin');
// HELD ITEM 2, asserted. The basin sits under the fixed velocity limit, so the
// half of the API 421 rule this module does not carry cannot decide anything.
must(ogBasin.warning === null,
  `the OGULAGHA basin carries no warning of any kind: its horizontal velocity is ${ogBasin.horizontalVelocityMS} m/s against the ${ogBasin.horizontalVelocityLimitMS} m/s fixed limit, so the MISSING half of the API 421 velocity rule cannot change its verdict, and its cut droplet settles at Reynolds ${ogBasin.cutReynolds}`);
must(ogBasin.velocityRuleComplete === false,
  'the OGULAGHA basin still reports velocityRuleComplete false, which is the engine stating the rule is half implemented rather than the capstone hiding it');
const ogPlate = ok(P.plateInterceptor({ flowM3S: ogQ, ...OGULAGHA_PLATES, ...ogFluid }),
  'the OGULAGHA plate pack');
must(ogPlate.warning === null,
  `the OGULAGHA plate pack carries no warning: its cut droplet settles at Reynolds ${ogPlate.cutReynolds}`);
must(ogPlate.d50cMicron < ogBasin.d50cMicron,
  `the OGULAGHA plate pack cuts finer than the basin ahead of it, ${ogPlate.d50cMicron} against ${ogBasin.d50cMicron} micron, which is the point of buying a plate pack`);

/* ========================================= Professional, IZOMBE ========= */
const izQ = m3PerSecond(IZOMBE_BWPD);
const izMu = ok(P.waterViscosityPaS(IZOMBE_WATER), 'the IZOMBE water viscosity');
const izRhoW = ok(P.waterDensityKgM3(IZOMBE_WATER), 'the IZOMBE brine density');
const izRhoO = ok(P.oilDensityKgM3(IZOMBE_OIL), 'the IZOMBE crude density');
const izFluid = { rhoWater: izRhoW.rhoKgM3, rhoOil: izRhoO.rhoKgM3, muPaS: izMu.muPaS };
const izCyc = ok(P.hydrocyclone({ flowM3S: izQ, ...IZOMBE_LINERS, ...izFluid }),
  'the IZOMBE liner bank');
must(izCyc.turndownRatio > P.DECLARED_CONSTANTS.overloadTurndown
  && izCyc.turndownRatio < P.DECLARED_CONSTANTS.maxTurndown,
  `the IZOMBE bank runs at ${izCyc.turndownRatio} times design, above the ${P.DECLARED_CONSTANTS.overloadTurndown} envelope and below the ${P.DECLARED_CONSTANTS.maxTurndown} the module refuses past, so the graded field, the ceiling and the shear penalty are all on the branch this tier teaches`);
// The multiplication is written in the engine's own left-to-right order on
// purpose: 1000 * 1.3 * 1.3 is 1690 exactly and 1000 * 1.3 ** 2 is
// 1690.0000000000002, and an assertion that reassociates a float product is
// testing the assertion rather than the engine.
must(izCyc.gField === P.DECLARED_CONSTANTS.gFieldAtDesign
  * P.DECLARED_CONSTANTS.overloadTurndown * P.DECLARED_CONSTANTS.overloadTurndown,
  `the IZOMBE field is AT the ceiling, ${izCyc.gField} g, which is the rated field times the square of the ${P.DECLARED_CONSTANTS.overloadTurndown} envelope and not the square of the ${izCyc.turndownRatio} the bank is actually run at`);
must(izCyc.shearPenalty > 1 && izCyc.d50cMicron > izCyc.idealD50cMicron,
  `the IZOMBE cut carries the inlet shear penalty ${izCyc.shearPenalty}, so the overload DEGRADES it from ${izCyc.idealD50cMicron} to ${izCyc.d50cMicron} micron`);
must(izCyc.linersAtDesignFlow > IZOMBE_LINERS.nLiners,
  `the engine names the bank the flow wants, ${izCyc.linersAtDesignFlow} liners against the ${IZOMBE_LINERS.nLiners} installed`);
const izFlot = ok(P.flotation({ flowM3S: izQ, ...IZOMBE_FLOTATION, ...izFluid }),
  'the IZOMBE flotation cell');
must(izFlot.warning === null,
  `the IZOMBE cell carries no warning: ${izFlot.residenceS} s of residence and a gas holdup of ${izFlot.gasHoldup}, inside the ${P.DECLARED_CONSTANTS.gasHoldupWarn} the module warns past`);
// HELD ITEM 5, asserted BY MEASUREMENT. The calibration moves the cut and
// cannot move either graded flotation field.
const izFlotTenFold = ok(P.flotation({
  flowM3S: izQ, ...IZOMBE_FLOTATION, ...izFluid,
  attachmentEfficiency: IZOMBE_FLOTATION.attachmentEfficiency * 10,
}), 'the IZOMBE cell at ten times the attachment efficiency');
must(izFlotTenFold.d50cMicron !== izFlot.d50cMicron
  && izFlotTenFold.bubbleRiseMS === izFlot.bubbleRiseMS
  && izFlotTenFold.gasHoldup === izFlot.gasHoldup,
  `ten times the attachment efficiency moves the flotation CUT from ${izFlot.d50cMicron} to ${izFlotTenFold.d50cMicron} micron and leaves the bubble rise velocity and the gas holdup identical to the last bit, so neither graded flotation field touches the one number in this module that is a calibration`);
must(izFlot.bubbleReynolds > P.DECLARED_CONSTANTS.stokesReynoldsLimit,
  `the IZOMBE bubble rises at Reynolds ${izFlot.bubbleReynolds}, outside creeping flow, which is why the graded rise velocity is the full drag balance and not Stokes`);
const izFilter = ok(P.mediaFilter({ flowM3S: izQ, ...IZOMBE_FILTER }), 'the IZOMBE media filter');
// HELD ITEM 4, asserted. At the reference grain size the media factor is one.
must(IZOMBE_FILTER.mediaMicron === P.DECLARED_CONSTANTS.filterReferenceMediaMicron,
  `the IZOMBE bed is packed at the module's own reference grain size, ${IZOMBE_FILTER.mediaMicron} micron, so the HELD inverse-cube grain exponent multiplies by exactly one and cannot move the graded cut whatever its value is`);
must(izFilter.warning === null,
  `the IZOMBE bed loads at ${izFilter.loadingMHr} m/hr, inside the ${P.DECLARED_CONSTANTS.filterBreakthroughLoadingMHr} m/hr the module warns past`);
must(izFilter.removalFraction === undefined,
  'the media filter reports no removalFraction at all, which is the FC7-0 deletion of the second disagreeing opinion, and the graded cut is an inversion of the depth filtration rather than a rival to it');

/* ================================================== Expert, TUNU ======== */
const tuQ = m3PerSecond(TUNU_BWPD);
const tuMu = ok(P.waterViscosityPaS(TUNU_WATER), 'the TUNU water viscosity');
const tuRhoW = ok(P.waterDensityKgM3(TUNU_WATER), 'the TUNU brine density');
const tuRhoO = ok(P.oilDensityKgM3(TUNU_OIL), 'the TUNU crude density');
const tuFluid = { rhoWater: tuRhoW.rhoKgM3, rhoOil: tuRhoO.rhoKgM3, muPaS: tuMu.muPaS };
const tuPlate = ok(P.plateInterceptor({ flowM3S: tuQ, ...TUNU_PLATES, ...tuFluid }), 'the TUNU plate pack');
const tuCyc = ok(P.hydrocyclone({ flowM3S: tuQ, ...TUNU_LINERS, ...tuFluid }), 'the TUNU liner bank');
must(tuCyc.turndownRatio > P.DECLARED_CONSTANTS.starvedTurndown
  && tuCyc.turndownRatio <= P.DECLARED_CONSTANTS.overloadTurndown,
  `the TUNU bank runs at ${tuCyc.turndownRatio} times design, INSIDE the operating envelope, so its field is the square of its own turndown and its cut carries no shear penalty: the Expert train is the properly sized bank the Professional tier was not`);
must(tuCyc.shearPenalty === 1, `the TUNU cut carries no shear penalty (${tuCyc.shearPenalty})`);
const tuFilter = ok(P.mediaFilter({ flowM3S: tuQ, ...TUNU_FILTER }), 'the TUNU media filter');
must(TUNU_FILTER.mediaMicron === P.DECLARED_CONSTANTS.filterReferenceMediaMicron,
  `the TUNU bed is packed at the reference grain size, ${TUNU_FILTER.mediaMicron} micron, so the HELD grain exponent is neutral here too`);
must(tuFilter.warning === null, `the TUNU bed loads at ${tuFilter.loadingMHr} m/hr, inside the warning`);
const tuTrain = ok(P.treatmentTrain({
  inletOiwPpm: TUNU_INLET.oiwPpm,
  inletD50Micron: TUNU_INLET.d50Micron,
  sigma: TUNU_INLET.sigma,
  ...TUNU_GRID,
  devices: [
    { name: 'CPI plate pack', ...tuPlate },
    { name: 'Hydrocyclone bank', ...tuCyc },
    { name: 'Walnut shell filter', ...tuFilter },
  ],
}), 'the TUNU train');
// HELD ITEMS 1 AND 3, asserted.
must(tuTrain.complete === true && tuTrain.stagesRun === 3 && tuTrain.stagesSkipped === 0,
  `all ${tuTrain.stagesRun} of the TUNU stages ran, so the concentrations graded here are a whole train's and not the survivors of one`);
must(tuTrain.dissolvedOilFloorPpm === null && tuTrain.floorApplied === false,
  'the TUNU train is given no dissolved oil floor and applies none, so no graded concentration is a floored one: this module states no value for that floor and the capstone invents none');
must(tuTrain.meetsSpec === null && tuTrain.marginPpm === null
  && tuTrain.verdictWithheldReason === 'no discharge specification was given',
  'the TUNU train is given NO discharge specification, so the engine withholds meetsSpec and marginPpm and says why: this module states no limit, the figure is the operator\'s own permit, and no graded field is a verdict');
const tuStages = tuTrain.stages;
must(tuStages.every((s) => s.ran === true), 'every TUNU stage reports ran true');
must(tuStages[0].name === 'CPI plate pack' && tuStages[1].name === 'Hydrocyclone bank',
  'the graded TUNU stages are the first and second in the order the train was given them');
must(tuTrain.outletMedianMicron < tuTrain.inletMedianMicron,
  `the TUNU droplet median falls from ${tuTrain.inletMedianMicron} to ${tuTrain.outletMedianMicron} micron, both measured off the same bin set`);
must(Math.abs(tuTrain.inletMedianMicron - TUNU_INLET.d50Micron) / TUNU_INLET.d50Micron < 1e-6,
  `the untreated inlet bin median reproduces its own d50, ${tuTrain.inletMedianMicron} against a typed ${TUNU_INLET.d50Micron}, which is the identity the interpolated median has to satisfy`);
const tuCoarse = ok(P.stokesRiseMS({ dMicron: TUNU_COARSE_DROPLET_MICRON, ...tuFluid }),
  'the TUNU coarse droplet rise');
must(tuCoarse.reynolds > P.DECLARED_CONSTANTS.stokesReynoldsLimit && tuCoarse.warning !== null,
  `the TUNU ${TUNU_COARSE_DROPLET_MICRON} micron droplet sits at Reynolds ${tuCoarse.reynolds}, OUTSIDE the band Stokes is stated for, and the engine says so on the same return: the graded number is the Reynolds number, not a rise velocity the module has just disclaimed`);

/* ======================================================= the eighteen === */
const F = [
  // Associate, OGULAGHA: what the water and the oil are, then what gravity catches.
  ['beginner', 'ogulagha_water_viscosity_pas', ogMu.muPaS],
  ['beginner', 'ogulagha_water_density_kgm3', ogRhoW.rhoKgM3],
  ['beginner', 'ogulagha_oil_density_kgm3', ogRhoO.rhoKgM3],
  ['beginner', 'ogulagha_droplet_rise_ms', ogRise.vMS],
  ['beginner', 'ogulagha_basin_cut_micron', ogBasin.d50cMicron],
  ['beginner', 'ogulagha_plate_cut_micron', ogPlate.d50cMicron],
  // Professional, IZOMBE: a bank past its envelope, a bubble swarm, a bed.
  // The graded cyclone fields are the bank's OWN turndown and shear penalty and
  // its cut, not the 1690 g ceiling: the ceiling is a constant of the module and
  // the digest has to print it, so grading it would be grading a free number.
  ['intermediate', 'izombe_liner_turndown_ratio', izCyc.turndownRatio],
  ['intermediate', 'izombe_cyclone_shear_penalty', izCyc.shearPenalty],
  ['intermediate', 'izombe_cyclone_cut_micron', izCyc.d50cMicron],
  ['intermediate', 'izombe_bubble_rise_ms', izFlot.bubbleRiseMS],
  ['intermediate', 'izombe_gas_holdup_ratio', izFlot.gasHoldup],
  ['intermediate', 'izombe_filter_cut_micron', izFilter.d50cMicron],
  // Expert, TUNU: the coupling stage by stage, and the band.
  ['advanced', 'tunu_cyclone_stage_median_micron', tuStages[1].outletMedianMicron],
  ['advanced', 'tunu_plate_stage_removal_pct', tuStages[0].removalPct],
  ['advanced', 'tunu_cyclone_stage_removal_pct', tuStages[1].removalPct],
  ['advanced', 'tunu_train_outlet_ppm', tuTrain.outletOiwPpm],
  ['advanced', 'tunu_train_outlet_median_micron', tuTrain.outletMedianMicron],
  ['advanced', 'tunu_coarse_droplet_reynolds', tuCoarse.reynolds],
].map(([tier, key, value]) => [tier, key, value,
  BARE ? gradedClassOf(key).stated : gradedTolerance(key)]);

// THE EIGHTEEN ARE THE EIGHTEEN, in one order.
check(F.length === 18, `this generator emits ${F.length} fields and eighteen are wanted`);
check(F.length === GRADED_FIELDS.length,
  `this generator emits ${F.length} fields and gradedTolerance.js declares ${GRADED_FIELDS.length}`);
GRADED_FIELDS.forEach(([wantTier, key], i) => {
  check(F[i][1] === key, `field ${i} is ${F[i][1]} here and ${key} in gradedTolerance.js`);
  check(F[i][0] === wantTier, `${key} is generated as ${F[i][0]} and declared as ${wantTier}`);
});
check(new Set(F.map((r) => r[1])).size === 18, 'two graded fields share a key');
F.forEach(([tier, key, value]) => check(Number.isFinite(value),
  `${tier}/${key} is ${value}, which is not a number a learner can be graded against`));

// ASSERTED, not assumed: every graded answer survives being quoted at the
// precision the digest prints its class to.
//
// WHAT THIS CONTROL CAN AND CANNOT CATCH. Mutating PRINTED_DECIMALS moves the
// floor and this check together, so that mutation proves nothing. What it
// catches is a tolerance that never went through the max rule, which is what
// --bare-stated-tolerances restores: it must make this exit non-zero.
const unanswerable = [];
F.forEach(([tier, key, value, tol]) => {
  const { cls } = gradedClassOf(key);
  const dp = PRINTED_DECIMALS[cls];
  const asQuoted = Number(value.toFixed(dp));
  const outBy = Math.abs(asQuoted - value);
  if (outBy > tol) {
    unanswerable.push(`${tier}/${key}: graded at ${tol} but ${cls} prints to ${dp} decimals, so a learner quoting ${value.toFixed(dp)} is ${outBy} out and a CORRECT reading FAILS`);
  }
});

const PRECISION = precisionDeclaration();
const covered = F.filter(([, key]) => Object.values(PRECISION)
  .some((c) => new RegExp(c.match).test(key))).length;

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(F.map(([tier, key, value, tol]) => ({
    tier, key, value, tol, cls: gradedClassOf(key).cls,
  })), null, 1));
} else {
  console.log('FC7 capstone answers, from the vendored engine at');
  console.log(`  ${ROOT}\n`);
  let tier = '';
  F.forEach(([t, key, value, tol]) => {
    if (t !== tier) { tier = t; console.log(`# ${tier}`); }
    console.log(`  ${key.padEnd(34)} ${String(value).padEnd(24)} +/- ${String(tol).padEnd(8)} ${gradedClassOf(key).cls}`);
  });
  console.log(`\n  ${notes.length} held-item and soundness statement(s), each MEASURED against the engine's own return values:`);
  notes.forEach((n) => console.log(`   - ${n}`));
  console.log(`\n  precision.json covers ${covered} of ${F.length} graded fields`);
  const widened = F.filter(([, key, , tol]) => tol !== gradedClassOf(key).stated);
  console.log(`  tolerances WIDENED to the printed precision: ${widened.length} -> ${widened.map((r) => r[1]).join(', ') || 'none'}`);
  console.log(`  UNANSWERABLE AT THE DECLARED PRECISION: ${unanswerable.length}`);
  unanswerable.forEach((u) => console.log(`   ${u}`));
}

if (covered !== F.length) {
  console.error(`REFUSES: precision.json covers ${covered} of ${F.length} graded fields`);
  process.exit(2);
}
if (unanswerable.length) process.exit(1);
// WRITTEN ONLY ON SUCCESS, and only when not in control mode, so a control run
// can never leave a fields.json behind that looks like a real one.
if (!BARE) {
  fs.writeFileSync(OUT, `${JSON.stringify(F, null, 1)}\n`);
  fs.writeFileSync(PRECISION_OUT, `${JSON.stringify(PRECISION, null, 1)}\n`);
  if (!process.argv.includes('--json')) {
    console.log(`\n  wrote ${OUT}`);
    console.log(`  wrote ${PRECISION_OUT}`);
  }
}
