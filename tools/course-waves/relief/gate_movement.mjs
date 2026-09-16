// GATE: every one of the eighteen graded fields is RE-MEASURED against the
// PRE-REPAIR engine, and the declared stable set must be exactly what held.
//
// WHY. A sibling wave ordered its capstone on the REASONING that two fields
// could not have moved when the repair was vendored, and one of them had. A
// stability claim is measured here, never reasoned about.
//
// It also requires a NAMED CAUSE for every field that moved, checks that the
// cause is one of the repair's own changes, and reports an unexplained
// movement rather than passing it.
//
//   node gate_movement.mjs
//   node gate_movement.mjs --claim-everything-stable   THE NEGATIVE CONTROL
//
// The control declares all eighteen stable and must exit 1 naming every field
// that actually moved. Exit 0 clean, 1 on a finding, 2 if it cannot run.
import fs from 'fs';
import {
  KOLO_CREEK_GAS, KOLO_CREEK_GAS_SUBCRITICAL, KOLO_CREEK_LIQUID, KOLO_CREEK_STEAM,
  OGBAINBIRI_VESSEL, OGBAINBIRI_TOWER, OGBAINBIRI_DRUM, OGBAINBIRI_DRUM_WIDER,
  GBARAN_BLOWDOWN, GBARAN_FLARE,
} from '/root/fc-wip-relief/fc5_fields_capstone.mjs';

const NOW_ROOT = process.env.FC5_ENGINES || '/root/wt-fc5-nextgen/packages/engines';
const PRE = process.env.FC5_PREREPAIR || '/root/fc-wip-relief/scratch/prerepair/relief.js';
if (!fs.existsSync(PRE)) { console.log(`REFUSED: no pre-repair engine at ${PRE}`); process.exit(2); }
const NOW = await import(`${NOW_ROOT}/engines/facilities/relief.js`);
const OLD = await import(PRE);

const ATM = 14.7;
const RK = 459.67;
const gasP1 = (o) => o.setPsig * (1 + o.overpressurePct / 100) + ATM;
const gasCall = (o) => ({
  wLbHr: o.wLbHr, p1Psia: gasP1(o), p2Psia: o.backPsia, tR: o.tF + RK,
  mw: o.mw, z: o.z, k: o.k, kd: o.kd, kb: o.kb, kc: o.kc,
});
const liqCall = () => ({
  qGpm: KOLO_CREEK_LIQUID.qGpm,
  p1Psig: KOLO_CREEK_LIQUID.setPsig * (1 + KOLO_CREEK_LIQUID.overpressurePct / 100),
  p2Psig: KOLO_CREEK_LIQUID.backPsig, sg: KOLO_CREEK_LIQUID.sg, muCp: KOLO_CREEK_LIQUID.muCp,
  kd: KOLO_CREEK_LIQUID.kd, kw: KOLO_CREEK_LIQUID.kw, kc: KOLO_CREEK_LIQUID.kc,
});
const steamCall = () => ({
  wLbHr: KOLO_CREEK_STEAM.wLbHr,
  p1Psia: KOLO_CREEK_STEAM.setPsig * (1 + KOLO_CREEK_STEAM.overpressurePct / 100) + ATM,
  kd: KOLO_CREEK_STEAM.kd, kb: KOLO_CREEK_STEAM.kb, kc: KOLO_CREEK_STEAM.kc, ksh: KOLO_CREEK_STEAM.ksh,
});
const radCall = () => ({
  qKw: GBARAN_FLARE.qKw, distanceM: GBARAN_FLARE.distanceM,
  fractionRadiated: GBARAN_FLARE.fractionRadiated, transmissivity: GBARAN_FLARE.transmissivity,
});
const setCall = () => ({
  qKw: GBARAN_FLARE.qKw, allowableKwM2: GBARAN_FLARE.projectAllowableKwM2,
  fractionRadiated: GBARAN_FLARE.fractionRadiated, transmissivity: GBARAN_FLARE.transmissivity,
});

// The reads, expressed once and evaluated against BOTH engines. A read that
// touches an export the pre-repair engine does not have returns the sentinel
// NEW, which is itself a result: the field is new ground rather than moved.
const NEW = Symbol('export did not exist before the repair');
const READS = {
  kolocreek_critical_pressure_ratio: (E) => E.criticalPressureRatio(KOLO_CREEK_GAS.k),
  kolocreek_gas_coefficient_c: (E) => E.gasConstantC(KOLO_CREEK_GAS.k),
  kolocreek_gas_critical_area_in2: (E) => E.gasVaporArea(gasCall(KOLO_CREEK_GAS)).areaIn2,
  kolocreek_gas_subcritical_area_in2: (E) => E.gasVaporArea(gasCall(KOLO_CREEK_GAS_SUBCRITICAL)).areaIn2,
  kolocreek_liquid_area_in2: (E) => E.liquidArea(liqCall()).areaIn2,
  kolocreek_steam_area_in2: (E) => E.steamArea(steamCall()).areaIn2,
  ogbainbiri_wetted_area_ft2: (E) => E.wettedAreaFt2(OGBAINBIRI_VESSEL).areaFt2,
  ogbainbiri_tower_wetted_area_ft2: (E) => E.wettedAreaFt2(OGBAINBIRI_TOWER).areaFt2,
  ogbainbiri_liquid_area_fraction: (E) => (E.segmentAreaFraction ? E.segmentAreaFraction(OGBAINBIRI_DRUM.liquidFraction) : NEW),
  ogbainbiri_vapor_velocity_fts: (E) => E.koDrumHorizontal(OGBAINBIRI_DRUM).vVaporFtS,
  ogbainbiri_drum_length_ft: (E) => E.koDrumHorizontal(OGBAINBIRI_DRUM).requiredLengthFt,
  ogbainbiri_drum_length_wider_ft: (E) => E.koDrumHorizontal(OGBAINBIRI_DRUM_WIDER).requiredLengthFt,
  gbaran_initial_mass_lb: (E) => { const r = E.blowdown(GBARAN_BLOWDOWN); return r.initialMassLb === undefined ? NEW : r.initialMassLb; },
  gbaran_blowdown_time_s: (E) => E.blowdown(GBARAN_BLOWDOWN).timeS,
  gbaran_final_temperature_degr: (E) => E.blowdown(GBARAN_BLOWDOWN).finalTR,
  gbaran_choked_floor_psia: (E) => { const r = E.blowdown(GBARAN_BLOWDOWN); return r.chokedToPsia === undefined ? NEW : r.chokedToPsia; },
  gbaran_radiant_intensity_kwm2: (E) => E.radiationIntensity(radCall()).kWm2,
  gbaran_setback_distance_m: (E) => E.distanceForIntensity(setCall()).distanceM,
};

// DECLARED STABLE: measured, then written down. The gate fails if this set is
// not EXACTLY what held. The declaration is checked, not trusted.
const STABLE = new Set([
  'kolocreek_critical_pressure_ratio',
  'kolocreek_gas_coefficient_c',
  'kolocreek_gas_critical_area_in2',
  'kolocreek_gas_subcritical_area_in2',
  'kolocreek_liquid_area_in2',
  'kolocreek_steam_area_in2',
  'ogbainbiri_wetted_area_ft2',
  'ogbainbiri_tower_wetted_area_ft2',
  'gbaran_radiant_intensity_kwm2',
  'gbaran_setback_distance_m',
]);

// A NAMED CAUSE for every field that moved. Each has to be one of the repair's
// own changes, listed here so an unexplained movement cannot pass.
const CAUSES = {
  ogbainbiri_liquid_area_fraction: 'segmentAreaFraction is a NEW export: the exact circular segment did not exist before the repair',
  ogbainbiri_vapor_velocity_fts: 'the drum now takes the holdup as a LIQUID LEVEL and computes the vapour cross-section as the exact circular segment above it; it used to treat the same figure as an area fraction',
  ogbainbiri_drum_length_ft: 'the same change, plus the fall distance and the vapour area no longer carry the same cancelling factor',
  ogbainbiri_drum_length_wider_ft: 'the same change at the wider diameter',
  gbaran_initial_mass_lb: 'initialMassLb is a NEW return: the march used to report only a time, a trajectory and a final temperature',
  gbaran_blowdown_time_s: 'the hidden second discharge coefficient was removed, the march is midpoint rather than Euler, and the final step lands ON the end pressure instead of overshooting by up to a whole time step',
  gbaran_final_temperature_degr: 'the same three changes, through the mass the march ends at',
  gbaran_choked_floor_psia: 'chokedToPsia is a NEW return: the march did not name the pressure below which its own choked assumption stops holding',
};

const CLAIM_ALL = process.argv.includes('--claim-everything-stable');
const declared = CLAIM_ALL ? new Set(Object.keys(READS)) : STABLE;

const rows = [];
Object.entries(READS).forEach(([key, read]) => {
  let now; let old;
  try { now = read(NOW); } catch (e) { now = `threw: ${e.message}`; }
  try { old = read(OLD); } catch (e) { old = `threw: ${e.message}`; }
  const isNew = old === NEW;
  const held = !isNew && typeof now === 'number' && typeof old === 'number' && now === old;
  rows.push({ key, now, old, isNew, held });
});
if (rows.length !== 18) { console.log(`REFUSED: ${rows.length} fields measured, expected 18`); process.exit(2); }

const held = rows.filter((r) => r.held).map((r) => r.key);
const moved = rows.filter((r) => !r.held).map((r) => r.key);
const wronglyDeclaredStable = moved.filter((k) => declared.has(k));
const heldButNotDeclared = held.filter((k) => !declared.has(k));
const noCause = moved.filter((k) => !CAUSES[k]);
const deadCause = Object.keys(CAUSES).filter((k) => !moved.includes(k));

console.log('field                                 pre-repair              repaired               verdict');
rows.forEach((r) => {
  const f = (v) => (typeof v === 'number' ? v.toPrecision(12) : (v === NEW ? 'did not exist' : String(v)));
  console.log(`${r.key.padEnd(37)} ${f(r.old).padEnd(23)} ${f(r.now).padEnd(22)} ${r.isNew ? 'NEW GROUND' : (r.held ? 'held, bit for bit' : 'MOVED')}`);
});
console.log();
console.log(`  fields measured against both engines: ${rows.length}`);
console.log(`  held bit for bit: ${held.length} -> ${held.join(', ')}`);
console.log(`  moved or new: ${moved.length} -> ${moved.join(', ')}`);
console.log(`  declared stable: ${declared.size}`);
console.log(`  DECLARED STABLE BUT MOVED: ${wronglyDeclaredStable.length} -> ${wronglyDeclaredStable.join(', ')}`);
console.log(`  HELD BUT NOT DECLARED: ${heldButNotDeclared.length} -> ${heldButNotDeclared.join(', ')}`);
console.log(`  MOVED WITH NO NAMED CAUSE: ${noCause.length} -> ${noCause.join(', ')}`);
console.log(`  DEAD CAUSE ROWS: ${deadCause.length} -> ${deadCause.join(', ')}`);
if (CLAIM_ALL) {
  console.log(`NEGATIVE CONTROL: all eighteen declared stable. Expected ${moved.length} findings, got ${wronglyDeclaredStable.length}.`);
  process.exit(wronglyDeclaredStable.length === moved.length && moved.length > 0 ? 1 : 2);
}
const bad = wronglyDeclaredStable.length + heldButNotDeclared.length + noCause.length + deadCause.length;
process.exit(bad ? 1 : 0);
