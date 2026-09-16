// fields.json: the eighteen graded fields with the tolerance each is graded
// at. Regenerated from the engine, never hand-edited.
//
// The tolerance is chosen from what the quantity MEANS, not from how many
// digits happen to print: a temperature to a hundredth of a degree, a
// circulation to a thousandth of a gallon a minute, a dimensionless fraction
// and a derivative to their own relative precision.
import fs from 'fs';
import { execFileSync } from 'child_process';
const rows = JSON.parse(execFileSync('node', ['/root/fc-wip-gasprocessing/fc4_capstone.mjs', '--json'], { encoding: 'utf8', maxBuffer: 1e8 }));
const TOL = {
  inletLbMMscf: 1e-4, waterLbDay: 1e-2, circGpm: 1e-5, circGpd: 1e-2,
  sensiblePerGal: 1e-4, btexTonsYear: 1e-5,
  fractionRemoved: 1e-9, stagesNeeded: 1e-6, acidMolesDay: 1e-2,
  reboilerMMBtuHr: 1e-5, circGpmRetuned: 1e-5,
  dzdT: 1e-12, muFPerPsi: 1e-9, dropF: 1e-4, t2F: 1e-4,
  waterInLbMMscf: 1e-4, waterOutLbMMscf: 1e-4,
};
const out = rows.map((r) => {
  const tol = TOL[r.key];
  if (tol === undefined) throw new Error(`no tolerance declared for ${r.tier}/${r.key}`);
  return [r.tier, r.key, r.value, tol];
});
fs.writeFileSync('/root/fc-wip-gasprocessing/fields.json', `${JSON.stringify(out, null, 1)}\n`);
console.log(`  wrote fields.json: ${out.length} graded fields`);
const perTier = out.reduce((a, r) => ({ ...a, [r[0]]: (a[r[0]] || 0) + 1 }), {});
console.log(`  per tier: ${JSON.stringify(perTier)}`);
if (out.length !== 18) { console.log('  REFUSES: not eighteen fields'); process.exit(2); }
