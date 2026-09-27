// KEY TRUTH BY ENGINE CALL, for every portfolio question row this re-cut changes.
//
// Each tier's writer lists checks in keytruth_<tier>[_<part>].mjs:
//   { q: 'beginner final 2' | 'beginner m03 12',      the question (tier, final or mNN, ord)
//     where: 'key' | 'prompt' | 'explanation' | 'option 2',
//     printed: '291.0000',                            text that must occur in that field of the NEW row
//     value: (L) => number | string | boolean }      computed by CALLING the engines through lib.mjs
// A number must equal `printed` at the decimals `printed` carries (toFixed); a
// string must equal `printed`; a boolean must be true (a stated claim, e.g. a
// funded set, an ordering or a refusal, checked on the engine's own return).
//
// It REFUSES (exit 2) when a check names a row that is not changed, and when
// one of the 85 rows whose keyed answer the phase 1 audit found wrong, refused
// or no longer unique has no check on its key.
//
// Two negative controls:
//   --plant         perturbs the last digit of every numeric `printed`; every
//                   numeric check must go red.
//   --plant-engine  NO SELF-COMPARISONS. Runs every check against copies of
//                   the engines with defects planted (risked EMV, seed, spread
//                   divisor, cross terms, fallback grid, exact-solve report,
//                   refusal wording, mixture moments, simulated outcome,
//                   forecast rule and flag, earned value, CPI, time progress
//                   and its no-dates branch, partner split and operator
//                   residual, S-curve points) and requires
//                   EVERY check's value to move under at least one plant. A
//                   value that no engine defect can move was not computed by
//                   the engine (a typed constant, or the input read back), and
//                   fails by name.
import fs from 'fs';
import os from 'os';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../..');
const ENG = path.join(REPO, 'packages/engines');
const args = process.argv.slice(2);
const plant = args.includes('--plant');
const plantEngine = args.includes('--plant-engine');
const dumpValues = args.includes('--dump-values');
const ONLY = process.env.KEYTRUTH_ONLY || '';

// The 85 rows whose keyed answer the phase 1 audit found wrong or refused, whose
// premise is false, or where a distractor became true (portfolio_defects.jsonl, severity graded).
const GRADED = JSON.parse(fs.readFileSync(path.join(HERE, 'graded_rows.json'), 'utf8'));

const loadChecks = async () => {
  const checks = [];
  for (const t of ['beginner', 'intermediate', 'advanced']) {
    const parts = fs.readdirSync(HERE).filter((n) => (n === `keytruth_${t}.mjs` || n.startsWith(`keytruth_${t}_`)) && n.endsWith('.mjs')).sort();
    if (!parts.length && !ONLY) { console.error(`REFUSED: no keytruth_${t}*.mjs`); process.exit(2); }
    for (const n of parts) {
      if (ONLY && !n.includes(ONLY)) continue;
      const mod = await import(path.join(HERE, n));
      checks.push(...mod.default.map((c) => ({ ...c, file: n })));
    }
  }
  return checks;
};

const evalAll = async (checks) => {
  const L = await import(path.join(HERE, 'lib.mjs'));
  const out = [];
  for (const c of checks) {
    let v;
    try { v = await c.value(L); } catch (e) { v = { thrown: String(e && e.message) }; }
    out.push(v);
  }
  return out;
};

const checks = await loadChecks();

if (dumpValues) {
  // child mode: EC5_ENGINES points at a planted copy
  const vals = await evalAll(checks);
  process.stdout.write(JSON.stringify(vals.map((v) => (typeof v === 'number' && !Number.isFinite(v) ? String(v) : v))));
  process.exit(0);
}

if (plantEngine) {
  const PLANTS = [
    ['risked EMV', 'engines/economics/portfolio.js', '- (1 - pos) * failCost;\n};', '- (1 - pos) * failCost * 1.5 - 0.125 * pos;\n};'],
    ['risk seed', 'engines/economics/portfolio.js', 'export const DEFAULT_RISK_SEED = 20260829;', 'export const DEFAULT_RISK_SEED = 20260830;'],
    ['spread divisor', 'engines/economics/portfolio.js', 'return (p10 - p90) / 2.5631;', 'return (p10 - p90) / 2.4;'],
    ['correlation cross terms', 'engines/economics/portfolio.js', 'const variance = varianceSum + rho * crossTerms;', 'const variance = varianceSum + 0.5 * rho * crossTerms;'],
    ['fallback grid', 'engines/economics/portfolio.js', 'export const FALLBACK_GRID_CELLS = 2000;', 'export const FALLBACK_GRID_CELLS = 1000;'],
    ['exact-solve report', 'engines/economics/portfolio.js', "solveMethod = 'exact';\n    optimalityGap = 0;", "solveMethod = 'exact-planted';\n    optimalityGap = 1;"],
    ['pos and capex wording', 'engines/economics/portfolio.js', [["'pos must be a number from 0 to 1'", "'pos must be a number in 0..1'"], ["'capex must be 0 or more'", "'capex must be at least 0'"], ['has a blank pos', 'has an empty pos'], ['has no capex', 'has a missing capex']]],
    ['forecast rule', 'engines/economics/afe.js', 'forecast: Math.max(budget, committed),', 'forecast: Math.max(budget, committed) + 1000,'],
    ['forecast flag', 'engines/economics/afe.js', 'forecastBelowCommittedBy: below ? committed - entered : 0,', 'forecastBelowCommittedBy: below ? committed - entered + 7 : 0,'],
    ['earned value', 'engines/economics/afe.js', 'return sum + (weight * progress);', 'return sum + (weight * progress * 0.99);'],
    ['CPI', 'engines/economics/afe.js', 'const cpi = totalActuals > 0 ? earnedValue / totalActuals : null;', 'const cpi = totalActuals > 0 ? earnedValue / totalActuals * 1.01 : 0;'],
    ['time progress', 'engines/economics/afe.js', 'return totalDuration > 0 ? elapsed / totalDuration : 1.0;', 'return totalDuration > 0 ? elapsed / (totalDuration + 3) : 0.5;'],
    ['partner split', 'engines/economics/afe.js', 'shareAmount: totalCost * (Number(p.working_interest) || 0) / 100,', 'shareAmount: totalCost * (Number(p.working_interest) || 0) / 99,'],
    ['S-curve points', 'engines/economics/afe.js', [['Planned: Math.round(cumPlanned),', 'Planned: Math.round(cumPlanned) + 11,'], ['Forecast: Math.round(cumForecast),', 'Forecast: Math.round(cumForecast) + 13,'], ['Planned: Math.round(totalBudget),', 'Planned: Math.round(totalBudget) + 17,']]],
    ['mixture moments', 'engines/economics/portfolio.js', 'const secondMoment = pos * (sdS * sdS + muS * muS) + (1 - pos) * failCost * failCost;', 'const secondMoment = 1.05 * (pos * (sdS * sdS + muS * muS) + (1 - pos) * failCost * failCost);'],
    ['simulated outcome', 'engines/economics/portfolio.js', 'total += normalCDF(z1) < q.pos ? q.muS + q.sdS * z2 : -q.failCost;', 'total += normalCDF(z1) < q.pos * 0.99 ? q.muS + q.sdS * z2 : -q.failCost * 1.01;'],
    ['operator residual', 'engines/economics/afe.js', 'const operatorShare = 100 - partnerTotal;', 'const operatorShare = 100.5 - partnerTotal;'],
    ['no-dates time progress', 'engines/economics/afe.js', "if (!afe?.start_date || !afe?.end_date) return 1.0;", "if (!afe?.start_date || !afe?.end_date) return 0.75;"],
    ['AFE wording', 'engines/economics/afe.js', [['Progress runs from 0 to 100 percent.', 'Progress runs 0 to 100.'], ["'asOf is not a valid date'", "'asOf is not a date'"]]],
  ];
  const base = await evalAll(checks);
  const moved = checks.map(() => []);
  for (const [name, file, from, to] of PLANTS) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ec5plant.'));
    for (const rel of ['engines/economics/portfolio.js', 'engines/economics/afe.js', 'test-data/economics/goldens/portfolio_cases.json', 'test-data/economics/goldens/afe_cases.json']) {
      fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
      fs.copyFileSync(path.join(ENG, rel), path.join(dir, rel));
    }
    fs.cpSync(path.join(ENG, 'lib'), path.join(dir, 'lib'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'package.json'), '{"type":"module"}\n');
    let src = fs.readFileSync(path.join(dir, file), 'utf8');
    const subs = Array.isArray(from) ? from : [[from, to]];
    for (const [a, b] of subs) {
      if (!src.includes(a)) { console.error(`REFUSED: plant "${name}" anchor not found in ${file}: ${a}`); process.exit(2); }
      src = src.split(a).join(b);
    }
    fs.writeFileSync(path.join(dir, file), src);
    const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url), '--dump-values'], { env: { ...process.env, EC5_ENGINES: dir }, encoding: 'utf8', maxBuffer: 1 << 28 });
    fs.rmSync(dir, { recursive: true, force: true });
    if (r.status !== 0) { console.error(`REFUSED: plant "${name}" run failed: ${r.stderr.slice(0, 400)}`); process.exit(2); }
    const vals = JSON.parse(r.stdout);
    let n = 0;
    vals.forEach((v, i) => { if (JSON.stringify(v) !== JSON.stringify(base[i])) { moved[i].push(name); n += 1; } });
    console.log(`plant ${name.padEnd(24)} moved ${n} of ${checks.length} checks`);
  }
  const still = checks.filter((c, i) => moved[i].length === 0);
  still.forEach((c) => console.log(`SELF-COMPARISON ${c.file} ${c.q} ${c.where} "${c.printed}": no planted engine defect moves this value`));
  console.log(`keytruth --plant-engine: ${checks.length - still.length} of ${checks.length} checks move under a planted engine defect; ${still.length} do not`);
  process.exit(still.length ? 1 : 0);
}

const edits = JSON.parse(fs.readFileSync(path.join(REPO, 'docs/ec45-recut/portfolio_edits.json'), 'utf8'));
const byId = new Map();
for (const e of edits.questions) byId.set(`${e.tier} ${e.scope === 'final' ? 'final' : e.module_key.split('-')[0]} ${e.ord}`, e);
const bump = (s) => s.replace(/(\d)(?!.*\d)/, (d) => String((Number(d) + 1) % 10));
const values = await evalAll(checks);
let fail = 0; let numeric = 0; let caught = 0;
const keyed = new Set();
checks.forEach((c, i) => {
  const e = byId.get(c.q);
  if (!e) { console.error(`REFUSED: ${c.file} checks "${c.q}", which this re-cut does not change`); process.exit(2); }
  const n = e.new;
  let field;
  if (c.where === 'key') field = n.options[n.answer_index];
  else if (c.where.startsWith('option ')) field = n.options[Number(c.where.slice(7))];
  else field = n[c.where];
  if (field === undefined) { console.error(`REFUSED: ${c.q} has no field ${c.where}`); process.exit(2); }
  if (c.where === 'key') keyed.add(c.q);
  const v = values[i];
  // --plant perturbs only a figure the engine returned as a number; a string or
  // boolean claim keeps its printed text (a set label or a message may hold digits).
  const printed = plant && typeof v === 'number' && typeof c.printed === 'string' && /\d/.test(c.printed) ? bump(c.printed) : c.printed;
  let ok; let got;
  if (typeof v === 'number') {
    numeric += 1;
    const dp = (printed.split('.')[1] || '').replace(/[^0-9].*$/, '').length;
    got = v.toFixed(dp);
    ok = Number(got) === Number(printed.replace(/,/g, ''));
  } else if (typeof v === 'string') { got = v; ok = v === printed; } else { got = JSON.stringify(v); ok = v === true; }
  const present = field.includes(printed);
  if (!(ok && present)) {
    if (plant && typeof v === 'number') caught += 1;
    else { fail += 1; console.log(`FAIL ${c.q} ${c.where}: printed "${printed}" engine "${got}"${present ? '' : ' (not found in the field)'}`); }
  } else if (plant && typeof v === 'number') {
    console.log(`PLANT MISSED ${c.q} ${c.where} "${printed}"`); fail += 1;
  }
});
if (plant) {
  console.log(`keytruth --plant: ${caught} of ${numeric} perturbed numeric checks went red`);
  process.exit(caught === numeric && numeric > 0 && fail === 0 ? 0 : 1);
}
const missing = GRADED.filter((g) => !keyed.has(g));
if (missing.length && !ONLY) { console.error(`REFUSED: no key check for ${missing.length}: ${missing.join('; ')}`); process.exit(2); }
console.log(`keytruth: ${checks.length} checks on ${new Set(checks.map((c) => c.q)).size} changed rows (${numeric} numeric), `
  + `${keyed.size} keys checked, all ${GRADED.length} audited keys covered; failures ${fail}`);
process.exit(fail ? 1 : 0);
