// W5c petrophysics: writes the IKPO-3 LAS and its graded keys (case.mjs).
//   npx vite-node -c vitest.config.js docs/graded-field-audit/w5c/petrophysics/gen_case.mjs [--check]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lasText, gradedKeys } from './case.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../..');
const text = lasText();
const keys = gradedKeys(text);
const { fit, ...tiers } = keys;
const out = {
  [path.join(REPO, 'src/content/capstone-cases/petrophysics/ikpo3.las')]: text,
  [path.join(HERE, 'fields.json')]: JSON.stringify(tiers, null, 1) + '\n',
};
let bad = 0;
for (const [p, t] of Object.entries(out)) {
  if (process.argv.includes('--check')) {
    if (!fs.existsSync(p) || fs.readFileSync(p, 'utf8') !== t) { console.log('DIFFERS', path.relative(REPO, p)); bad += 1; }
  } else { fs.writeFileSync(p, t); console.log('wrote', path.relative(REPO, p)); }
}
for (const [t, fs_] of Object.entries(tiers)) console.log(t, fs_.map((x) => `${x.key}=${x.expected}`).join('  '));
console.log('pickett', JSON.stringify(fit));
if (bad) process.exit(1);
