// W5c welldata: writes the ODUMA capstone case and its graded keys (case.mjs).
//
//   npx vite-node -c vitest.config.js docs/graded-field-audit/w5c/welldata/gen_case.mjs [--check]
//
// --check regenerates in memory and fails if a committed LAS file or
// fields.json differs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, gradedKeys } from './case.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../..');
const CASE_DIR = path.join(REPO, 'src/content/capstone-cases/welldata');
const CHECK = process.argv.includes('--check');

function main() {
  const files = build();
  const keys = gradedKeys(files);
  const out = { ...Object.fromEntries(Object.entries(files).map(([k, v]) => [path.join(CASE_DIR, k), v])),
    [path.join(HERE, 'fields.json')]: JSON.stringify(keys, null, 1) + '\n' };
  let bad = 0;
  for (const [p, text] of Object.entries(out)) {
    if (CHECK) {
      if (!fs.existsSync(p) || fs.readFileSync(p, 'utf8') !== text) { console.log('DIFFERS', path.relative(REPO, p)); bad += 1; }
    } else {
      fs.writeFileSync(p, text);
      console.log('wrote', path.relative(REPO, p));
    }
  }
  for (const [tier, fs_] of Object.entries(keys)) console.log(tier, fs_.map((f) => `${f.key}=${f.expected}`).join('  '));
  if (bad) process.exit(1);
}

main();
