// W5c scal: writes fields.json for the OKORO case (case.mjs).
//   npx vite-node -c vitest.config.js docs/graded-field-audit/w5c/scal/gen_case.mjs [--check]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gradedKeys } from './case.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const p = path.join(HERE, 'fields.json');
const text = JSON.stringify(gradedKeys(), null, 1) + '\n';
if (process.argv.includes('--check')) {
  if (!fs.existsSync(p) || fs.readFileSync(p, 'utf8') !== text) { console.log('DIFFERS fields.json'); process.exit(1); }
} else {
  fs.writeFileSync(p, text);
  console.log('wrote', path.relative(process.cwd(), p));
}
for (const [t, fs_] of Object.entries(gradedKeys())) console.log(t, fs_.map((f) => `${f.key}=${f.expected}`).join('  '));
