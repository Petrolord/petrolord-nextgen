// W5c mbal: writes fields.json for the ISAN tank (case.mjs) and prints the brief's table.
//   npx vite-node -c vitest.config.js docs/graded-field-audit/w5c/mbal/gen_case.mjs [--check]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gradedKeys, ISAN } from './case.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const p = path.join(HERE, 'fields.json');
const keys = gradedKeys();
const text = JSON.stringify(keys, null, 1) + '\n';
if (process.argv.includes('--check')) {
  if (!fs.existsSync(p) || fs.readFileSync(p, 'utf8') !== text) { console.log('DIFFERS fields.json'); process.exit(1); }
} else { fs.writeFileSync(p, text); console.log('wrote fields.json'); }
console.log(JSON.stringify(ISAN));
for (const f of keys.beginner) console.log(f.key, f.expected);
