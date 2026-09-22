// W5c welltest: writes the OBODO-4 buildup file and its graded keys (case.mjs).
//   npx vite-node -c vitest.config.js docs/graded-field-audit/w5c/welltest/gen_case.mjs [--check]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, gradedKeys } from './case.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../..');
const { text, pwfShutIn } = build();
const { n, ...keys } = gradedKeys(text, pwfShutIn);
const out = {
  [path.join(REPO, 'src/content/capstone-cases/welltest/obodo4_buildup.csv')]: text,
  [path.join(HERE, 'fields.json')]: JSON.stringify(keys, null, 1) + '\n',
};
let bad = 0;
for (const [p, t] of Object.entries(out)) {
  if (process.argv.includes('--check')) {
    if (!fs.existsSync(p) || fs.readFileSync(p, 'utf8') !== t) { console.log('DIFFERS', path.relative(REPO, p)); bad += 1; }
  } else { fs.writeFileSync(p, t); console.log('wrote', path.relative(REPO, p)); }
}
console.log('pwf at shut-in', pwfShutIn, 'points in fit', n);
for (const f of keys.beginner) console.log(f.key, f.expected);
if (bad) process.exit(1);
