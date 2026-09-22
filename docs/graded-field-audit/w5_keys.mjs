// W5 re-case keys: regenerate every graded value from the vendored engine.
//
//   npx vite-node --config vitest.config.js docs/graded-field-audit/w5_keys.mjs <course> [--write]
//
// Reads the course's W5 spec, docs/graded-field-audit/w5/<course>.json (the
// case each pick-A tier states, in `case`), and its `fields_file` (the new
// graded fields, in capstone order). The spec's `keys_module` computes every
// value by calling the same teaching functions the course panels call. Each
// field's `expected` must equal the engine's value exactly; with --write the
// engine's value is stored (never hand-typed), without it any difference
// exits 1. panelCapstoneGuard.test.js makes the same comparison inside CI,
// and w5_capstones.py builds the migration from the same fields file.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..');
const [course, flag] = process.argv.slice(2);
if (!course) { console.error('usage: w5_keys.mjs <course> [--write]'); process.exit(2); }
const spec = JSON.parse(fs.readFileSync(path.join(HERE, 'w5', `${course}.json`), 'utf8'));
if (!spec.keys_module) { console.error(`${course}: the spec names no keys_module`); process.exit(2); }
const fieldsPath = path.join(REPO, spec.fields_file);
const rows = JSON.parse(fs.readFileSync(fieldsPath, 'utf8'));
const { compute } = await import(path.join(REPO, spec.keys_module));
const got = compute(spec.tiers);
let bad = 0;
for (const f of rows) {
  if (spec.tiers[f.tier]?.pick !== 'A') continue;
  const v = got[f.tier]?.[f.key];
  if (typeof v !== 'number' || !Number.isFinite(v)) { console.error(`NO VALUE ${f.tier}.${f.key}`); bad += 1; continue; }
  const same = f.expected === v;
  console.log(`${same ? 'same   ' : 'CHANGED'} ${f.tier}.${f.key} = ${v} (tol ${f.tol})`);
  if (!same) { bad += 1; f.expected = v; }
}
if (flag === '--write') {
  fs.writeFileSync(fieldsPath, `${JSON.stringify(rows, null, 1)}\n`);
  console.log(`wrote ${spec.fields_file}`);
} else if (bad) {
  console.error(`${bad} key(s) differ from a regeneration`);
  process.exit(1);
}
