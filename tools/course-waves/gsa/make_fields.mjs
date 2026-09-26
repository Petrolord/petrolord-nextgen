// fields.json and precision.json: the eighteen graded EC8 fields with the
// tolerance each is graded at. REGENERATED from the generator, never
// hand-edited.
//
// THE TOLERANCE IS NOT MADE HERE. It is made in exactly one place,
// src/components/course/panels/gsa/gradedTolerance.js in the NextGen
// repository, which gsa_capstone.mjs imports. This
// script only writes that derivation out in the two shapes the rest of the
// programme reads, and REFUSES if any field would be graded tighter than its
// own class prints.
//
//   node make_fields.mjs                            write both files
//   node make_fields.mjs --bare-stated-tolerances   THE NEGATIVE CONTROL
//
// The control skips the printed-precision widening and leaves PRINTED_DECIMALS
// alone, because mutating the declared precision would move the floor and the
// tolerance together and could not fail. It must exit 1 naming every field a
// learner could not answer.
import fs from 'node:fs';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const HERE = process.env.EC8_WAVE_DIR || '/root/cat-wip-gsa';
const TOLPATH = process.env.EC8_TOLERANCE
  || '/root/wt-ec8-nextgen/src/components/course/panels/gsa/gradedTolerance.js';
const {
  PRINTED_DECIMALS, GRADED_FIELDS, printedFloor, gradedTolerance, precisionDeclaration,
} = await import(TOLPATH);

const BARE = process.argv.includes('--bare-stated-tolerances');
const rows = JSON.parse(execFileSync('node', [`${HERE}/gsa_capstone.mjs`, '--json'],
  { encoding: 'utf8', maxBuffer: 1e8 }));
if (rows.length !== 18) { console.log(`REFUSES: the generator returned ${rows.length} fields, expected 18`); process.exit(2); }

const unanswerable = [];
const widened = [];
const out = rows.map((r) => {
  const stated = GRADED_FIELDS.find(([, k]) => k === r.key)[3];
  const cls = r.cls;
  const tol = BARE ? stated : gradedTolerance(r.key);
  const floor = printedFloor(cls);
  if (tol < floor) {
    unanswerable.push(
      `${r.tier}/${r.key}: graded at ${tol} but the ${cls} class prints to ${PRINTED_DECIMALS[cls]} decimals, `
      + `so a learner quoting the printed figure can be out by up to ${floor}, which is ${(floor / tol).toPrecision(3)} times the tolerance `
      + '(the value itself is not printed here, because wave.json records this line)');
  }
  if (tol !== stated) widened.push(`${r.tier}/${r.key} ${stated} -> ${tol}`);
  return [r.tier, r.key, r.value, tol];
});

if (!BARE) {
  fs.writeFileSync(`${HERE}/fields.json`, `${JSON.stringify(out, null, 1)}\n`);
  const precision = precisionDeclaration();
  fs.writeFileSync(`${HERE}/precision.json`, `${JSON.stringify(precision, null, 1)}\n`);
  const covered = rows.filter((r) => new RegExp(precision[r.cls].match).test(r.key));
  console.log(`  wrote precision.json: ${Object.keys(precision).length} quantity classes from PRINTED_DECIMALS, covering ${covered.length} of ${rows.length} graded fields`);
  if (covered.length !== rows.length) { console.log('  REFUSES: precision.json does not classify every graded field'); process.exit(2); }
  console.log(`  wrote fields.json: ${out.length} graded fields`);
}
const perTier = out.reduce((a, r) => ({ ...a, [r[0]]: (a[r[0]] || 0) + 1 }), {});
console.log(`  per tier: ${JSON.stringify(perTier)}`);
console.log(`  tolerances RAISED to the printed precision: ${widened.length}${widened.length ? ` -> ${widened.join('; ')}` : ''}`);
console.log(`  UNANSWERABLE AT THE DECLARED PRECISION: ${unanswerable.length}`);
unanswerable.forEach((u) => console.log(`   ${u}`));
console.log(`  make_fields: ${unanswerable.length} field(s) unanswerable at the declared precision`);
if (Object.values(perTier).some((n) => n !== 6) || Object.keys(perTier).length !== 3) {
  console.log('  REFUSES: not six graded fields in each of three tiers'); process.exit(2);
}
if (unanswerable.length) process.exit(1);
