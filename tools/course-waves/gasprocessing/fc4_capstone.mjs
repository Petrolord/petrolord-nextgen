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

/**
 * PRINTED DECIMALS, BY QUANTITY CLASS.
 *
 * A graded field is answered by a learner reading a figure and typing it
 * back, so a tolerance tighter than the precision the course prints at is a
 * field NOBODY CAN ANSWER. Three of these were: a dimensionless fraction at
 * 1e-9, a compressibility derivative at 1e-12 and a coefficient at 1e-9,
 * against a digest whose own header declares six decimals for every one of
 * those classes. A learner reading the right figure off the right row and
 * quoting it to the precision the course tells them to would have FAILED.
 *
 * The classes below are the digest header's own words, which is the only
 * declaration a learner has:
 *   "Water contents, pressures, temperatures, circulations, diameters and
 *    ratios print to six decimals; pounds a day, gallons a day, Btu a gallon
 *    and lbmol a day to four; counts are whole numbers."
 *
 * A dimensionless fraction, a coefficient in degF per psi and a derivative
 * per degR are all RATIOS in that sentence, so all three are six.
 */
export const PRINTED_DECIMALS = {
  'lb/MMscf': 6,          // a water content
  'lb/day': 4,            // an extensive daily mass
  gpm: 6,                 // a circulation
  'gal/day': 4,           // an extensive daily volume
  'Btu/gal': 4,           // an intensive duty
  'short tons/yr': 6,     // printed with the ratios
  fraction: 6,            // dimensionless
  stages: 6,              // dimensionless
  'lbmol/day': 4,         // an extensive daily mole count
  'MMBtu/hr': 6,          // printed with the circulations it tracks
  'per degR': 6,          // a derivative, a ratio in the header's sentence
  'degF/psi': 6,          // a coefficient, likewise
  degF: 6,                // a temperature
};

/**
 * The tolerance a field is graded at: the STATED one, or half a unit in the
 * last printed place, WHICHEVER IS LOOSER.
 *
 * MAX AND NEVER MIN. This only ever widens a tolerance, so a value that
 * graded correct before still grades correct, and nothing that graded wrong
 * before starts grading right for any reason but being answerable.
 */
export const toleranceFor = (unit, stated) => {
  const d = PRINTED_DECIMALS[unit];
  if (d === undefined) throw new Error(`no printed precision declared for the unit "${unit}"`);
  return Math.max(stated, 0.5 * 10 ** -d);
};

/** The graded fields MEASURED to be bit-identical across the FC4-0
 *  vendoring. Verified by gate_movement.mjs, never asserted from reasoning
 *  about which quantities a repair touches. */
export const STABLE = [
  'beginner/sensiblePerGal',
  'intermediate/fractionRemoved',
  'intermediate/stagesNeeded',
  'advanced/dzdT',
];

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
// W1 (B5 follow-on, 2026-09-21): the sixth Associate field was the BTEX to the
// still overhead, a ppmv mole balance the Associate tier never teaches. It is
// now the reboiler duty, step six of the worked lesson, on the capstone's own
// stated reflux ratio and the water overhead the prompt now STATES.
add('beginner', 'tegReboilerMMBtuHr', 'Reboiler duty', 'MMBtu/hr', ikPack.reboilerMMBtuHr);

/* ---------------------------------------------------- Professional ----- */
// FC4-0 put this export inside the module's error contract: it returns
// { fractionRemoved } or { error } where it used to return a bare number.
const otFrac = G.kremserFractionRemoved(OTUMARA_ABSORBER);
const otStages = G.kremserStagesFor({
  absorptionFactor: OTUMARA_ABSORBER.absorptionFactor,
  fractionRemoved: OTUMARA_REQUIRED_REMOVAL,
});
const otAmine = G.aminePackage(OTUMARA);
const otRetuned = G.aminePackage({ ...OTUMARA, leanLoading: OTUMARA_RETUNED_LEAN_LOADING });

add('intermediate', 'fractionRemoved', 'Removal at the stated stage count', 'fraction', otFrac.fractionRemoved);
add('intermediate', 'stagesNeeded', 'Theoretical stages the spec demands', 'stages', otStages.stages);
add('intermediate', 'acidMolesDay', 'Acid gas the solution picks up', 'lbmol/day', otAmine.acidMolesDay);
add('intermediate', 'circGpm', 'Amine circulation', 'gpm', otAmine.circGpm);
add('intermediate', 'reboilerMMBtuHr', 'Regenerator duty', 'MMBtu/hr', otAmine.reboilerMMBtuHr);
add('intermediate', 'circGpmRetuned', 'Amine circulation at the leaner lean', 'gpm', otRetuned.circGpm);

/* --------------------------------------------------------- Expert ----- */
// The Joule-Thomson chain. Ordered so the one field MEASURED to be stable
// across the FC4-0 vendoring leads, and the five that move follow it in the
// order their causes compound: the coefficient, then the cooling the march
// builds from it, then the arrival temperature that is the cooling
// subtracted from a typed inlet, then the two water reads.
//
// STABLE IS A MEASURED CLAIM HERE, NOT A REASONED ONE. An earlier ordering
// led with dzdT AND the inlet water content on the reasoning that neither
// touched the Joule-Thomson chain. The inlet water content moves: it is a
// molar quantity and the module's standard base was one of the repairs.
// `gate_movement.mjs` re-measures the whole set against the pre-vendoring
// engine and fails if the STABLE list below is not exactly what holds.
const esMu = G.jouleThomsonFPerPsi({
  pPsia: ESCRAVOS.p1Psia, tF: ESCRAVOS.tF,
  gasSg: ESCRAVOS.gasSg, cpBtuLbmolF: ESCRAVOS.cpBtuLbmolF,
});
const esDrop = G.jtDrop(ESCRAVOS);
const esWaterIn = G.saturatedWaterContent({ pPsia: ESCRAVOS.p1Psia, tF: ESCRAVOS.tF });
const esWaterOut = G.saturatedWaterContent({ pPsia: ESCRAVOS.p2Psia, tF: esDrop.t2F });

add('advanced', 'dzdT', 'The z-factor temperature derivative at inlet', 'per degR', esMu.dzdT);
add('advanced', 'muFPerPsi', 'Joule-Thomson coefficient at inlet', 'degF/psi', esMu.muFPerPsi);
add('advanced', 'dropF', 'Cooling across the let-down', 'degF', esDrop.dropF);
add('advanced', 't2F', 'Low temperature separator inlet', 'degF', esDrop.t2F);
add('advanced', 'waterInLbMMscf', 'Water the warm gas carries at inlet', 'lb/MMscf', esWaterIn.lbPerMMscf);
add('advanced', 'waterOutLbMMscf', 'Water the cold gas can still hold', 'lb/MMscf', esWaterOut.lbPerMMscf);

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(rows, null, 1));
} else {
  let tier = '';
  rows.forEach((r) => {
    if (r.tier !== tier) { tier = r.tier; console.log(`\n# ${tier}`); }
    console.log(`  ${r.key.padEnd(20)} ${String(r.value).padEnd(24)} ${r.unit.padEnd(14)} ${r.label}`);
  });
  console.log(`\n# ${STABLE.length} of ${rows.length} fields are MEASURED to hold bit-identical across the FC4-0 vendoring: ${STABLE.join(', ')}.`);
  console.log('# Every other field moved, and gate_movement.mjs names the cause of each.');
}
