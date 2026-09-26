// KEY TRUTH BY ENGINE CALL, for every cashflow question row this re-cut changes.
//
// Each tier's writer lists checks in keytruth_<tier>.mjs:
//   { q: 'beginner final 2' | 'beginner m03 12',      the question (tier, final or mNN, ord)
//     where: 'key' | 'prompt' | 'explanation' | 'option 2',
//     printed: '10070350.00',                          text that must occur in that field of the NEW row
//     value: (L) => number | string | boolean }      computed by CALLING the engine through lib.mjs
// A number must equal `printed` at the decimals `printed` carries (toFixed); a
// string must equal `printed`; a boolean must be true (a stated claim, e.g. a
// ranking or an ordering, checked on the engine's own return).
//
// It REFUSES (exit 2) when a check names a row that is not changed, and when
// one of the 26 rows whose keyed answer the audit found wrong or refused has
// no check on its key. --plant is the negative control: it perturbs the last
// digit of every numeric `printed` and must see every numeric check fail.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as L from './lib.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../..');
const edits = JSON.parse(fs.readFileSync(path.join(REPO, 'docs/pia-recut/cashflow_edits.json'), 'utf8'));
const byId = new Map();
for (const e of edits.questions) {
  const id = `${e.tier} ${e.scope === 'final' ? 'final' : e.module_key.split('-')[0]} ${e.ord}`;
  byId.set(id, e);
}
// The 26 rows whose keyed answer the phase 1 audit found wrong or refused (a
// distractor now true for advanced m04 4; a stated reading keyed for advanced m06 6).
const GRADED = [
  'advanced m02 1', 'advanced m02 2', 'advanced m02 4', 'advanced m02 6',
  'advanced m03 4', 'advanced m03 13', 'advanced m03 15',
  'advanced m04 4', 'advanced m04 5', 'advanced m04 10', 'advanced m04 13', 'advanced m04 15',
  'advanced m05 8', 'advanced m06 3', 'advanced m06 6', 'advanced m06 15',
  'advanced final 2', 'advanced final 3', 'advanced final 11', 'advanced final 13', 'advanced final 23',
  'advanced final 25', 'advanced final 27', 'advanced final 31', 'advanced final 36',
  'intermediate final 40',
];
const plant = process.argv.includes('--plant');
const bump = (s) => s.replace(/(\d)(?!.*\d)/, (d) => String((Number(d) + 1) % 10));

const checks = [];
for (const t of ['beginner', 'intermediate', 'advanced']) {
  const f = path.join(HERE, `keytruth_${t}.mjs`);
  if (!fs.existsSync(f)) { console.error(`REFUSED: ${f} is missing`); process.exit(2); }
  // one file per writer: keytruth_<tier>.mjs plus any keytruth_<tier>_<part>.mjs
  const parts = [f, ...fs.readdirSync(HERE).filter((n) => n.startsWith(`keytruth_${t}_`) && n.endsWith('.mjs')).sort().map((n) => path.join(HERE, n))];
  for (const p of parts) {
    const mod = await import(p);
    checks.push(...mod.default.map((c) => ({ ...c, file: path.basename(p) })));
  }
}
let fail = 0; let numeric = 0; let caught = 0;
const keyed = new Set();
for (const c of checks) {
  const e = byId.get(c.q);
  if (!e) { console.error(`REFUSED: ${c.file} checks "${c.q}", which this re-cut does not change`); process.exit(2); }
  const n = e.new;
  let field;
  if (c.where === 'key') field = n.options[n.answer_index];
  else if (c.where.startsWith('option ')) field = n.options[Number(c.where.slice(7))];
  else field = n[c.where];
  if (field === undefined) { console.error(`REFUSED: ${c.q} has no field ${c.where}`); process.exit(2); }
  if (c.where === 'key') keyed.add(c.q);
  const printed = plant && typeof c.printed === 'string' && /\d/.test(c.printed) ? bump(c.printed) : c.printed;
  let v = await c.value(L);
  let ok; let got;
  if (typeof v === 'number') {
    numeric += 1;
    const dp = (printed.split('.')[1] || '').replace(/[^0-9].*$/, '').length;
    got = v.toFixed(dp);
    ok = Number(got) === Number(printed.replace(/,/g, ''));
  } else if (typeof v === 'string') { got = v; ok = v === printed; } else { got = String(v); ok = v === true; }
  const present = field.includes(printed);
  if (!(ok && present)) {
    if (plant && typeof v === 'number') caught += 1;
    else { fail += 1; console.log(`FAIL ${c.q} ${c.where}: printed "${printed}" engine "${got}"${present ? '' : ' (not found in the field)'}`); }
  } else if (plant && typeof v === 'number') {
    console.log(`PLANT MISSED ${c.q} ${c.where} "${printed}"`); fail += 1;
  }
}
const missing = GRADED.filter((g) => !keyed.has(g));
if (plant) {
  console.log(`keytruth --plant: ${caught} of ${numeric} perturbed numeric checks went red`);
  process.exit(caught === numeric && numeric > 0 && fail === 0 ? 0 : 1);
}
if (missing.length) { console.error(`REFUSED: no key check for ${missing.join('; ')}`); process.exit(2); }
console.log(`keytruth: ${checks.length} checks on ${new Set(checks.map((c) => c.q)).size} changed rows (${numeric} numeric), `
  + `${keyed.size} keys checked, all 26 audited keys covered; failures ${fail}`);
process.exit(fail ? 1 : 0);
