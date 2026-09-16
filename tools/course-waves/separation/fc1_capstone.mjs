// Computes the FC1 capstone answers from the EJULEBE, ODEAMA and ADANGA
// conditions. Writes fields.json (tier, key, value, tol) and prints a
// report. Nothing here is read by the lessons, the banks or the digest.
//
// NO GRADED FIELD DEPENDS ON A HELD-FOR-LITERATURE QUANTITY: every tier
// states its own vendor K (kOverride), so the pressure derating and the
// 0.12 floor are nowhere in this file, and the two layout fields are
// RADIATION shortfalls, so no spacing table figure is graded.
import fs from 'fs';
import {
  EJULEBE_1, EJULEBE_2, EJULEBE_SLUG, EJULEBE_FINGERS, ODEAMA_FLARE, ODEAMA_POOL,
  EJULEBE_3, EJULEBE_4, ADANGA_ITEMS, ADANGA_SOURCES,
} from '/root/fc-wip-separation/fc1_fields_capstone.mjs';

const ROOT = process.env.FC1_ENGINES || '/root/wt-fc1-nextgen/packages/engines';
const S = await import(`${ROOT}/engines/facilities/separatorSizing.js`);
const L = await import(`${ROOT}/engines/facilities/spacing.js`);

/** The chain the Separator Studio runs: conditions, K, settling, rate. */
export const conditions = (p) => {
  const pPsia = p.pPsig + 14.7;
  const gas = S.gasDensityLbFt3({ pPsia, tF: p.tF, gasSg: p.gasSg });
  const rhoOil = p.oilApi !== undefined ? S.oilDensityLbFt3(p.oilApi) : p.sgOil * 62.4;
  const rhoWater = (p.waterSg ?? p.sgWater) * 62.4;
  const qLiquid = p.qOilBpd + p.qWaterBpd;
  const rhoLiquid = (rhoOil * p.qOilBpd + rhoWater * p.qWaterBpd) / qLiquid;
  const k = S.kValue({ kOverride: p.kOverride });
  const vt = S.terminalVelocityFtS({ k: k.k, rhoLLbFt3: rhoLiquid, rhoGLbFt3: gas.rhoLbFt3 });
  return {
    pPsia, z: gas.z, ppr: gas.ppr, tpr: gas.tpr,
    rhoGas: gas.rhoLbFt3, rhoOil, rhoWater, rhoLiquid, qLiquid, k: k.k,
    vT: vt.vFtS,
    qGasActFt3S: S.gasActualFt3S({ qGasMMscfd: p.qGasMMscfd, pPsia, tF: p.tF, z: gas.z }),
  };
};

const c1 = conditions(EJULEBE_1);
const c1v = S.verticalTwoPhase({
  qGasActFt3S: c1.qGasActFt3S, vTerminalFtS: c1.vT, qLiquidBpd: c1.qLiquid,
  retentionMin: EJULEBE_1.retentionMin, allowanceFt: EJULEBE_1.allowanceFt,
  diameterOverride: EJULEBE_1.diameterFt,
});

const c2 = conditions(EJULEBE_2);
const c2h = S.horizontalTwoPhase({
  diameterFt: EJULEBE_2.diameterFt, qGasActFt3S: c2.qGasActFt3S, vTerminalFtS: c2.vT,
  qLiquidBpd: c2.qLiquid, retentionMin: EJULEBE_2.retentionMin,
  liquidLevelFrac: EJULEBE_2.liquidLevelFrac,
});
const c2slug = S.vesselSlugCatcher(EJULEBE_SLUG);
const c2fing = S.fingerSlugCatcher(EJULEBE_FINGERS);
const c2flare = L.flareSetbackM(ODEAMA_FLARE);
const c2pool = L.poolFireSetbackM(ODEAMA_POOL);

const c3 = conditions({ ...EJULEBE_3, waterSg: EJULEBE_3.sgWater });
const c33 = S.horizontalThreePhase({
  diameterFt: EJULEBE_3.diameterFt, qGasActFt3S: c3.qGasActFt3S, vTerminalFtS: c3.vT,
  liquidLevelFrac: EJULEBE_3.liquidLevelFrac, ...EJULEBE_3,
});
const c4 = conditions(EJULEBE_4);
const c4sweep = S.ldSweep({
  mode: 'vertical2', diametersFt: EJULEBE_4.diametersFt,
  ldMin: EJULEBE_4.ldMin, ldMax: EJULEBE_4.ldMax,
  qGasActFt3S: c4.qGasActFt3S, vTerminalFtS: c4.vT,
  qLiquidBpd: EJULEBE_4.qOilBpd + EJULEBE_4.qWaterBpd,
  retentionMin: EJULEBE_4.retentionMin, allowanceFt: EJULEBE_4.allowanceFt,
});
const c3lay = L.checkLayout({ items: ADANGA_ITEMS, radiationSources: ADANGA_SOURCES });

const RAW = [
  // Associate: the gas, the settling and the vertical vessel at EJULEBE-1.
  ['beginner', 'ejulebe1_gas_density_lbft3', c1.rhoGas, 1e-4, 6],
  ['beginner', 'ejulebe1_gas_actual_ft3s', c1.qGasActFt3S, 1e-4, 6],
  ['beginner', 'ejulebe1_terminal_velocity_fts', c1.vT, 1e-5, 6],
  ['beginner', 'ejulebe1_gas_diameter_ft', c1v.diameterGasFt, 1e-4, 6],
  ['beginner', 'ejulebe1_height_ft', c1v.heightFt, 1e-4, 6],
  ['beginner', 'ejulebe1_velocity_margin', c1v.velocityMargin, 1e-5, 6],
  // Professional: the horizontal vessel, the slug catcher, the setbacks.
  ['intermediate', 'ejulebe2_liquid_length_ft', c2h.lengthLiquidFt, 1e-4, 6],
  ['intermediate', 'ejulebe2_gas_velocity_fts', c2h.gasVelocityFtS, 1e-5, 6],
  ['intermediate', 'ejulebe_slug_vessel_diameter_ft', c2slug.diameterFt, 1e-4, 6],
  ['intermediate', 'ejulebe_finger_length_ft', c2fing.fingerLengthFt, 1e-3, 6],
  ['intermediate', 'odeama_flare_setback_m', c2flare.distanceM, 1e-3, 4],
  ['intermediate', 'odeama_pool_setback_edge_m', c2pool.setbackFromEdgeM, 1e-3, 4],
  // Expert: the interface, the two droplet times, the preferred vessel,
  // and the two layout rankings.
  ['advanced', 'ejulebe3_interface_height_ft', c33.interfaceHeightFt, 1e-5, 6],
  ['advanced', 'ejulebe3_water_drop_fall_s', c33.dropChecks.waterDropFallS, 1e-3, 4],
  ['advanced', 'ejulebe3_oil_drop_rise_s', c33.dropChecks.oilDropRiseS, 1e-3, 4],
  ['advanced', 'ejulebe4_preferred_height_ft', c4sweep.preferred.lengthFt, 1e-4, 6],
  ['advanced', 'adanga_worst_absolute_shortfall_m', c3lay.worstAbsolute.shortfallM, 1e-4, 4],
  ['advanced', 'adanga_worst_relative_fraction', c3lay.worstRelative.shortfallFraction, 1e-6, 6],
];

// ============================ THE GRADING FLOOR ============================
// A tolerance below half a unit in the last place the digest PRINTS a quantity
// grades a correctly-read figure WRONG. A learner who reads the right row and
// quotes it exactly as the course told them to then fails the field, which is
// the worst defect this programme can ship. The kit has now found that shape
// in FC2, FC3 and FC4, three fields each, and none of the six independent tier
// audits across those waves caught any of them: each looked at lessons, or
// banks, or the digest, and nobody looked across the seam.
//
// So every tolerance is DERIVED rather than typed:
//
//     tol = max(stated, halfUlp(decimals the digest prints that class to))
//
// MAX AND NEVER MIN. It only ever loosens, so nothing that graded correct
// before this can grade wrong after it.
const HALF_ULP = (decimals) => 0.5 * 10 ** -decimals;

// The table above says 6 or 4 per field. That is only true while the digest
// still declares those two precisions, so the header is read rather than
// trusted: if somebody re-words it, this refuses instead of grading against a
// precision the course no longer states.
const HEADER = fs.readFileSync('/root/fc-wip-separation/digest.txt', 'utf8')
  .split('\n').slice(0, 6).join(' ');
if (!/six decimals/i.test(HEADER) || !/four decimals/i.test(HEADER)) {
  console.error('REFUSED: the digest header no longer declares six and four decimals, '
    + 'so the per-field precision table in this file is stale. Nothing written.');
  process.exit(1);
}

const F = RAW.map(([tier, key, value, stated, dec]) => [tier, key, value,
  Math.max(stated, HALF_ULP(dec))]);

// THE LIVE CHECK. With the derivation above in place this can never fire,
// which is exactly the point: remove the Math.max and it does. That is the
// honest negative control for this file. Mutating the declared precision is
// the CIRCULAR one, because it moves the floor and the check together.
let below = 0;
RAW.forEach(([, key, , , dec], i) => {
  const floor = HALF_ULP(dec);
  if (F[i][3] < floor) {
    console.error(`FLOOR: ${key} emits a tolerance of ${F[i][3]} against a floor of ${floor} `
      + `(${dec} decimals). A correct reading can be ${(floor / F[i][3]).toFixed(0)} tolerances out.`);
    below += 1;
  }
});
if (below) {
  console.error(`REFUSED: ${below} graded field(s) are graded tighter than the precision this `
    + 'course tells a learner to quote. Nothing written.');
  process.exit(1);
}
console.log(`[floor] ${F.length} tolerances derived, all at or above their half-unit floor`);

fs.writeFileSync('/root/fc-wip-separation/fields.json', JSON.stringify(F, null, 1));
const f = (x, n = 8) => (x === null || x === undefined ? 'null' : Number(x).toFixed(n));
console.log('# FC1 capstone: EJULEBE, ODEAMA and the ADANGA manifold yard');
console.log(`EJULEBE-1 ppr ${f(c1.ppr, 6)} tpr ${f(c1.tpr, 6)} z ${f(c1.z, 6)}; rhoGas ${f(c1.rhoGas)} rhoLiquid ${f(c1.rhoLiquid)} vT ${f(c1.vT)} qAct ${f(c1.qGasActFt3S)}`);
console.log(`  vertical: dGas ${f(c1v.diameterGasFt)} at ${EJULEBE_1.diameterFt} ft: hLiquid ${f(c1v.hLiquidFt)} height ${f(c1v.heightFt)} L/D ${f(c1v.ldRatio)} margin ${f(c1v.velocityMargin)} gasOk ${c1v.gasCapacityOk}`);
console.log(`EJULEBE-2 z ${f(c2.z, 6)} rhoGas ${f(c2.rhoGas)} vT ${f(c2.vT)} qAct ${f(c2.qGasActFt3S)}`);
console.log(`  horizontal: areaGas ${f(c2h.areaGasFt2)} areaLiquid ${f(c2h.areaLiquidFt2)} vGas ${f(c2h.gasVelocityFtS)} lengthLiquid ${f(c2h.lengthLiquidFt)} lengthGas ${f(c2h.lengthGasFt)} controlling ${c2h.controlling} L/D ${f(c2h.ldRatio)}`);
console.log(`  slug vessel: working ${f(c2slug.workingBbl, 4)} bbl, D ${f(c2slug.diameterFt)} L ${f(c2slug.lengthFt)}; fingers ${f(c2fing.fingerLengthFt)} ft each, ${f(c2fing.totalPipeFt)} ft of pipe`);
console.log(`  ODEAMA flare ${f(c2flare.distanceM)} m (Q ${f(c2flare.qKw, 2)} kW); pool radius ${f(c2pool.radiusFromCentreM)} m, edge ${f(c2pool.setbackFromEdgeM)} m, ${c2pool.setbackStatus}`);
console.log(`EJULEBE-3 z ${f(c3.z, 6)} vT ${f(c3.vT)} qAct ${f(c3.qGasActFt3S)}`);
console.log(`  three-phase: share ${f(c33.waterShare)} interface ${f(c33.interfaceHeightFt)} oil layer ${f(c33.oilLayerFt)} retention length ${f(c33.liquidRetentionLengthFt)} controlling ${c33.controlling}`);
console.log(`  drops: water falls ${f(c33.dropChecks.waterDropFallS, 4)} s against ${f(c33.dropChecks.residenceOilS, 4)} s; oil rises ${f(c33.dropChecks.oilDropRiseS, 4)} s against ${f(c33.dropChecks.residenceWaterS, 4)} s; carryover ${c33.dropChecks.waterCarryover} carryunder ${c33.dropChecks.oilCarryunder}`);
console.log(`EJULEBE-4 scrubber: vT ${f(c4.vT)} qAct ${f(c4.qGasActFt3S)}`);
c4sweep.rows.forEach((r) => console.log(`  ${r.diameterFt} ft: L/D ${f(r.ldRatio, 6)} height ${f(r.lengthFt, 6)} ${r.feasible ? 'feasible' : 'infeasible'} [${r.reasons.join(', ') || 'eligible'}]`));
console.log(`  preferred ${c4sweep.preferred.diameterFt} ft, status ${c4sweep.preferredStatus}, height ${f(c4sweep.preferred.lengthFt)}`);
console.log(`ADANGA: checked ${c3lay.checked}, zero-requirement ${c3lay.zeroRequirementPairs}, violations ${c3lay.violations.length}, complete ${c3lay.complete}, pass ${c3lay.pass} (${c3lay.passStatus}), skipped ${JSON.stringify(c3lay.skipped)}, unknown pairs ${c3lay.unknownPairs.length}`);
c3lay.violations.forEach((v) => console.log(`  ${v.kind} ${v.aId} to ${v.bId}: actual ${f(v.actualM, 4)} required ${f(v.requiredM, 4)} short ${f(v.shortfallM)} (${f(v.shortfallFraction)})`));
console.log(`  worstAbsolute ${c3lay.worstAbsolute.kind} ${c3lay.worstAbsolute.aId}-${c3lay.worstAbsolute.bId} ${f(c3lay.worstAbsolute.shortfallM)}; worstRelative ${c3lay.worstRelative.kind} ${c3lay.worstRelative.aId}-${c3lay.worstRelative.bId} ${f(c3lay.worstRelative.shortfallFraction)}`);
console.log(`\n${F.length} fields written to fields.json`);
