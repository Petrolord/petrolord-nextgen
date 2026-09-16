// fields.json: the eighteen graded fields with the tolerance each is graded
// at. Regenerated from the engine, never hand-edited.
//
// The tolerance is chosen from what the quantity MEANS, not from how many
// digits happen to print: a temperature to a hundredth of a degree, a
// circulation to a thousandth of a gallon a minute, a dimensionless fraction
// and a derivative to their own relative precision.
import fs from 'fs';
import { execFileSync } from 'child_process';
import { toleranceFor, PRINTED_DECIMALS } from '/root/fc-wip-gasprocessing/fc4_capstone.mjs';
const rows = JSON.parse(execFileSync('node', ['/root/fc-wip-gasprocessing/fc4_capstone.mjs', '--json'], { encoding: 'utf8', maxBuffer: 1e8 }));
const BARE = process.argv.includes('--bare-stated-tolerances');
const TOL = {
  inletLbMMscf: 1e-4, waterLbDay: 1e-2, circGpm: 1e-5, circGpd: 1e-2,
  sensiblePerGal: 1e-4, btexTonsYear: 1e-5,
  fractionRemoved: 1e-9, stagesNeeded: 1e-6, acidMolesDay: 1e-2,
  reboilerMMBtuHr: 1e-5, circGpmRetuned: 1e-5,
  dzdT: 1e-12, muFPerPsi: 1e-9, dropF: 1e-4, t2F: 1e-4,
  waterInLbMMscf: 1e-4, waterOutLbMMscf: 1e-4,
};
// THE ANSWERABILITY CHECK. A tolerance tighter than half a unit in the last
// printed place is a field a learner cannot answer by reading the figure and
// typing it back. `--bare-stated-tolerances` skips the widening and is the
// NEGATIVE CONTROL: it must make this exit 1. It deliberately does NOT touch
// PRINTED_DECIMALS, because moving the floor and the tolerance together is a
// control that cannot fail.
const unanswerable = [];
const out = rows.map((r) => {
  const stated = TOL[r.key];
  if (stated === undefined) throw new Error(`no tolerance declared for ${r.tier}/${r.key}`);
  const tol = BARE ? stated : toleranceFor(r.unit, stated);
  const d = PRINTED_DECIMALS[r.unit];
  const floor = 0.5 * 10 ** -d;
  if (tol < floor) {
    unanswerable.push(
      `${r.tier}/${r.key}: graded at ${tol} but ${r.unit} prints to ${d} decimals, `
      + `so the finest answer a learner can give is ${r.value.toFixed(d)} and the `
      + `error that quoting it carries is up to ${floor}, which is ${(floor / tol).toPrecision(3)} times the tolerance`);
  }
  return [r.tier, r.key, r.value, tol];
});
fs.writeFileSync('/root/fc-wip-gasprocessing/fields.json', `${JSON.stringify(out, null, 1)}\n`);
const widened = out.filter((row, i) => row[3] !== TOL[rows[i].key]);
console.log(`  wrote fields.json: ${out.length} graded fields`);
console.log(`  tolerances widened to the printed precision: ${widened.length} -> ${widened.map((r) => `${r[0]}/${r[1]}`).join(', ') || 'none'}`);
console.log(`  UNANSWERABLE AT THE DECLARED PRECISION: ${unanswerable.length}`);
unanswerable.forEach((u) => console.log(`   ${u}`));
const perTier = out.reduce((a, r) => ({ ...a, [r[0]]: (a[r[0]] || 0) + 1 }), {});
console.log(`  per tier: ${JSON.stringify(perTier)}`);
if (out.length !== 18) { console.log('  REFUSES: not eighteen fields'); process.exit(2); }
if (unanswerable.length) process.exit(1);
