// THE FC4 CAPSTONE GENERATOR. Runs the three capstone streams through the
// engine and prints the eighteen graded fields, six a tier.
//
// Nothing here is read by fc4_dump.mjs and nothing here is quoted into a
// lesson: the digest and the capstone are two separate roads and the lab
// greps this file's names out of the digest to keep it that way.
//
// Usage: node fc4_capstone.mjs [--json]
//
// EVERY GRADED FIELD IS A RETURN VALUE OF THE ENGINE. None is arithmetic
// performed here, and none reads a held-for-literature item: see the
// neutralisation notes at the head of fc4_fields_capstone.mjs.
import {
  IKOT_ABASI_LINE, IKOT_ABASI,
  OTUMARA_ABSORBER, OTUMARA_REQUIRED_REMOVAL, OTUMARA, OTUMARA_RETUNED_LEAN_LOADING,
  ESCRAVOS,
} from '/root/fc-wip-gasprocessing/fc4_fields_capstone.mjs';

const ROOT = process.env.FC4_ENGINES || '/root/wt-fc4-nextgen/packages/engines';
const G = await import(`${ROOT}/engines/facilities/gasProcessing.js`);

const rows = [];
const add = (tier, key, label, unit, value) => rows.push({ tier, key, label, unit, value });

/* ------------------------------------------------------- Associate ----- */
const ikSat = G.saturatedWaterContent(IKOT_ABASI_LINE);
const ikPack = G.tegPackage({ ...IKOT_ABASI, inletLbMMscf: ikSat.lbPerMMscf });

add('beginner', 'inletLbMMscf', 'Saturated inlet water content', 'lb/MMscf', ikSat.lbPerMMscf);
add('beginner', 'waterLbDay', 'Water the unit takes out', 'lb/day', ikPack.waterLbDay);
add('beginner', 'circGpm', 'TEG circulation', 'gpm', ikPack.circGpm);
add('beginner', 'circGpd', 'TEG circulation', 'gal/day', ikPack.circGpd);
add('beginner', 'sensiblePerGal', 'Sensible heat per gallon circulated', 'Btu/gal', ikPack.sensiblePerGal);
add('beginner', 'btexTonsYear', 'BTEX carried to the still overhead', 'short tons/yr', ikPack.btexTonsYear);

/* ---------------------------------------------------- Professional ----- */
const otFrac = G.kremserFractionRemoved(OTUMARA_ABSORBER);
const otStages = G.kremserStagesFor({
  absorptionFactor: OTUMARA_ABSORBER.absorptionFactor,
  fractionRemoved: OTUMARA_REQUIRED_REMOVAL,
});
const otAmine = G.aminePackage(OTUMARA);
const otRetuned = G.aminePackage({ ...OTUMARA, leanLoading: OTUMARA_RETUNED_LEAN_LOADING });

add('intermediate', 'fractionRemoved', 'Removal at the stated stage count', 'fraction', otFrac);
add('intermediate', 'stagesNeeded', 'Theoretical stages the spec demands', 'stages', otStages.stages);
add('intermediate', 'acidMolesDay', 'Acid gas the solution picks up', 'lbmol/day', otAmine.acidMolesDay);
add('intermediate', 'circGpm', 'Amine circulation', 'gpm', otAmine.circGpm);
add('intermediate', 'reboilerMMBtuHr', 'Regenerator duty', 'MMBtu/hr', otAmine.reboilerMMBtuHr);
add('intermediate', 'circGpmRetuned', 'Amine circulation at the leaner lean', 'gpm', otRetuned.circGpm);

/* --------------------------------------------------------- Expert ----- */
// WITHHELD until FC4-0 is vendored: four of these six read the
// Joule-Thomson chain. The generator runs; the answer file is not cut.
const esMu = G.jouleThomsonFPerPsi({
  pPsia: ESCRAVOS.p1Psia, tF: ESCRAVOS.tF,
  gasSg: ESCRAVOS.gasSg, cpBtuLbmolF: ESCRAVOS.cpBtuLbmolF,
});
const esDrop = G.jtDrop(ESCRAVOS);
const esWaterIn = G.saturatedWaterContent({ pPsia: ESCRAVOS.p1Psia, tF: ESCRAVOS.tF });
const esWaterOut = G.saturatedWaterContent({ pPsia: ESCRAVOS.p2Psia, tF: esDrop.t2F });

add('advanced', 'dzdT', 'The z-factor temperature derivative at inlet', 'per degR', esMu.dzdT);
add('advanced', 'waterInLbMMscf', 'Water the warm gas carries at inlet', 'lb/MMscf', esWaterIn.lbPerMMscf);
add('advanced', 'muFPerPsi', 'Joule-Thomson coefficient at inlet [FC4-0]', 'degF/psi', esMu.muFPerPsi);
add('advanced', 'dropF', 'Cooling across the let-down [FC4-0]', 'degF', esDrop.dropF);
add('advanced', 't2F', 'Low temperature separator inlet [FC4-0]', 'degF', esDrop.t2F);
add('advanced', 'waterOutLbMMscf', 'Water the cold gas can still hold [FC4-0]', 'lb/MMscf', esWaterOut.lbPerMMscf);

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(rows, null, 1));
} else {
  let tier = '';
  rows.forEach((r) => {
    if (r.tier !== tier) { tier = r.tier; console.log(`\n# ${tier}`); }
    console.log(`  ${r.key.padEnd(20)} ${String(r.value).padEnd(24)} ${r.unit.padEnd(14)} ${r.label}`);
  });
  console.log('\n# [FC4-0] marks a field that reads the Joule-Thomson chain and will move when the repair is vendored. The Expert answer file is NOT cut until then.');
}
