// HD fluid (engines #235): regenerate the fluid capstone fields from the
// vendored engine after the labTune Bo fallback fix.
//
//   npx vite-node --config vitest.config.js docs/graded-field-audit/hd/fluid/keys.mjs [--write]
//
// The W5b re-case (docs/graded-field-audit/w5/fluid.json, its fields in
// w5b/fluid.fields.json, kept as the W5b state) stated the case; this file is
// the same fields in the same order with every value the engine gives now,
// computed by the same keys module the course panels share. Without --write
// any difference exits 1. panelCapstoneGuard.test.js makes the same
// comparison in CI, and hd_capstones.py builds 20261030d_hd_fluid.sql from it.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..', '..', '..');
const spec = JSON.parse(fs.readFileSync(path.join(HERE, '..', '..', 'w5', 'fluid.json'), 'utf8'));
const fieldsPath = path.join(HERE, 'fields.json');
const rows = JSON.parse(fs.readFileSync(fieldsPath, 'utf8'));
const { compute } = await import(path.join(REPO, spec.keys_module));
const got = compute(spec.tiers);
let bad = 0;
for (const f of rows) {
  const v = got[f.tier]?.[f.key];
  if (typeof v !== 'number' || !Number.isFinite(v)) { console.error(`NO VALUE ${f.tier}.${f.key}`); bad += 1; continue; }
  const same = f.expected === v;
  console.log(`${same ? 'same   ' : 'CHANGED'} ${f.tier}.${f.key} = ${v} (tol ${f.tol})`);
  if (!same) { bad += 1; f.expected = v; }
}
if (process.argv[2] === '--write') {
  fs.writeFileSync(fieldsPath, `${JSON.stringify(rows, null, 1)}\n`);
  console.log('wrote docs/graded-field-audit/hd/fluid/fields.json');
} else if (bad) {
  console.error(`${bad} key(s) differ from a regeneration`);
  process.exit(1);
}
