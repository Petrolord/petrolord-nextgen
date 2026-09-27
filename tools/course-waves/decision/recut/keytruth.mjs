// KEY TRUTH BY ENGINE CALL, for every decision question row this re-cut changes.
// (The EC4 twin of tools/course-waves/portfolio/recut/keytruth.mjs.)
//
// Each tier lists checks in keytruth_<tier>.mjs:
//   { q: 'beginner final 7' | 'beginner m02 2',       the question (tier, final or mNN, ord)
//     where: 'key' | 'prompt' | 'explanation' | 'option 2',
//     printed: '59.9999',                             text that must occur in that field of the NEW row
//     value: (L) => number | string | boolean }       computed by CALLING the engines through lib.mjs
// A number must equal `printed` at the decimals `printed` carries (toFixed); a
// string must equal `printed`; a boolean must be true (a stated claim, e.g. a
// reported tie, a refusal or an acceptance, checked on the engine's own return).
//
// It REFUSES (exit 2) when a check names a row this re-cut does not change, and
// when one of the 31 rows whose keyed answer the phase 1 audit found wrong,
// refused or no longer unique (graded_rows.json) has no check on its key.
//
// Two negative controls:
//   --plant         perturbs the last digit of every numeric `printed`; every
//                   numeric check must go red.
//   --plant-engine  NO SELF-COMPARISONS. Runs every check against copies of the
//                   engines with defects planted (tie band, tie flags, the mark,
//                   the card tie set, the probability allowance, the half percent
//                   allowance, money read the old way, chance weighting, lottery
//                   weighting, the rounded net VOI, verdict and insight wording)
//                   and requires EVERY check's value to move under at least one
//                   plant. A value no engine defect can move was not computed by
//                   the engine, and fails by name.
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

const GRADED = JSON.parse(fs.readFileSync(path.join(HERE, 'graded_rows.json'), 'utf8'));

const loadChecks = async () => {
  const checks = [];
  for (const t of ['beginner', 'intermediate', 'advanced']) {
    const n = `keytruth_${t}.mjs`;
    if (!fs.existsSync(path.join(HERE, n))) { console.error(`REFUSED: no ${n}`); process.exit(2); }
    const mod = await import(path.join(HERE, n));
    checks.push(...mod.default.map((c) => ({ ...c, file: n })));
  }
  return checks;
};

const evalAll = async (checks) => {
  const L = await import(path.join(HERE, 'lib.mjs'));
  return checks.map((c) => { try { return c.value(L); } catch (e) { return { thrown: String(e && e.message) }; } });
};

const checks = await loadChecks();

if (dumpValues) {
  const vals = await evalAll(checks);
  process.stdout.write(JSON.stringify(vals.map((v) => (typeof v === 'number' && !Number.isFinite(v) ? String(v) : v))));
  process.exit(0);
}

if (plantEngine) {
  const DT = 'engines/economics/decisionTree.js';
  const VO = 'engines/economics/voi.js';
  const PLANTS = [
    ['tie band exact only', DT, 'if (Math.abs(best - v) <= band) tiedIndices.push(i);', 'if (v === best) tiedIndices.push(i);'],
    ['no tie flag', DT, 'indifferent: tiedIndices.length > 1,', 'indifferent: false,'],
    ['mark the last tied', DT, 'index: tiedIndices[0],', 'index: tiedIndices[tiedIndices.length - 1],'],
    ['card tie set exact', DT, [['if (cardValue(v) === bestCard) tiedIndicesAtCardPrecision.push(i);', 'if (v === best) tiedIndicesAtCardPrecision.push(i);'], ['indifferentAtCardPrecision: tiedIndicesAtCardPrecision.length > 1,', 'indifferentAtCardPrecision: false,']]],
    ['no probability allowance', DT, 'const offOne = (sum) => Math.abs(sum - 1) > PROB_TOL + REPRESENTATION_ALLOWANCE;', 'const offOne = (sum) => Math.abs(sum - 1) > PROB_TOL;'],
    ['half percent strict', DT, 'Math.abs(d) <= 0.005 + 1e-12', 'Math.abs(d) <= 0.005'],
    ['money read the old way', DT, [
      ["if (raw === undefined) return { kind: 'omitted', value: 0 };", "if (raw === undefined) return { kind: 'blank' };"],
      ["if (raw === null || (typeof raw === 'string' && raw.trim() === '')) return { kind: 'blank' };", "if (raw === null || (typeof raw === 'string' && raw.trim() === '')) return { kind: 'number', value: 0 };"],
      ["return Number.isFinite(v) ? { kind: 'number', value: v } : { kind: 'notNumber' };", "return Number.isFinite(v) ? { kind: 'number', value: v } : { kind: 'number', value: 0 };"],
      ['if (r.value < 0) {', 'if (r.value < -1e12) {'],
    ]],
    ['refusal wording', DT, [['has a blank cost; a cost must be', 'has an empty cost; a cost must be'], ['has a negative cost (', 'has a cost below zero ('], ['enter a receipt as a payoff', 'type a receipt as a payoff'], ["'Distribution payoff has no finite mean'", "'Distribution payoff lacks a finite mean'"]]],
    ['cost charged one and a half times', DT, 'const branchValue = child.emv - costValue(', 'const branchValue = child.emv - 1.5 * costValue('],
    ['probability tolerance wide', DT, 'const PROB_TOL = 1e-6;', 'const PROB_TOL = 1e-5;'],
    ['half percent wide', DT, 'Math.abs(d) <= 0.005 + 1e-12', 'Math.abs(d) <= 0.01'],
    ['implied priors weighting', DT, 'indicators.reduce((s, ind) => s + Number(ind.probability) * Number(ind.posteriors?.[i] ?? 0), 0));', 'indicators.reduce((s, ind) => s + Number(ind.probability) * Number(ind.posteriors?.[i] ?? 0) * 1.001, 0));'],
    ['perfect information weighting', DT, 'return s + p * bestHere;', 'return s + p * bestHere * 1.0001;'],
    ['chance weighting', DT, 'const emv = annBranches.reduce((s, b) => s + Number(b.probability) * b.branchValue, 0);', 'const emv = annBranches.reduce((s, b) => s + Number(b.probability) * b.branchValue * 1.0001, 0);'],
    ['lottery weighting', DT, 'probs.reduce((s, p, i) => s + p * actionPayoff(a, outcomes, i), 0) - actionCost(a);', 'probs.reduce((s, p, i) => s + p * actionPayoff(a, outcomes, i) * 1.0001, 0) - actionCost(a);'],
    ['net VOI unrounded', VO, 'const netVoiCard = toCard(netVoi);', 'const netVoiCard = netVoi;'],
    ['no withholding', VO, 'if (!consistency.consistent) {', 'if (false) {'],
    ['percent sums unchecked', VO, 'const PCT_TOL = 1e-4;', 'const PCT_TOL = 1e9;'],
    ['verdict and insight wording', VO, [['Since this rounds to zero, the information costs what it is worth', 'Since this is zero, the information exactly pays for itself'], ['both come to that figure', 'reach that figure together']]],
  ];
  const base = await evalAll(checks);
  const moved = checks.map(() => []);
  for (const [name, file, from, to] of PLANTS) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ec4plant.'));
    for (const rel of [DT, VO, 'test-data/economics/goldens/decision_cases.json']) {
      fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
      fs.copyFileSync(path.join(ENG, rel), path.join(dir, rel));
    }
    fs.writeFileSync(path.join(dir, 'package.json'), '{"type":"module"}\n');
    let src = fs.readFileSync(path.join(dir, file), 'utf8');
    const subs = Array.isArray(from) ? from : [[from, to]];
    for (const [a, b] of subs) {
      if (!src.includes(a)) { console.error(`REFUSED: plant "${name}" anchor not found in ${file}: ${a}`); process.exit(2); }
      src = src.split(a).join(b);
    }
    fs.writeFileSync(path.join(dir, file), src);
    const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url), '--dump-values'], { env: { ...process.env, EC4_ENGINES: dir }, encoding: 'utf8', maxBuffer: 1 << 28 });
    fs.rmSync(dir, { recursive: true, force: true });
    if (r.status !== 0) { console.error(`REFUSED: plant "${name}" run failed: ${r.stderr.slice(0, 400)}`); process.exit(2); }
    const vals = JSON.parse(r.stdout);
    let n = 0;
    vals.forEach((v, i) => { if (JSON.stringify(v) !== JSON.stringify(base[i])) { moved[i].push(name); n += 1; } });
    console.log(`plant ${name.padEnd(28)} moved ${n} of ${checks.length} checks`);
  }
  const still = checks.filter((c, i) => moved[i].length === 0);
  still.forEach((c) => console.log(`SELF-COMPARISON ${c.file} ${c.q} ${c.where} "${c.printed}": no planted engine defect moves this value`));
  console.log(`keytruth --plant-engine: ${checks.length - still.length} of ${checks.length} checks move under a planted engine defect; ${still.length} do not`);
  process.exit(still.length ? 1 : 0);
}

const edits = JSON.parse(fs.readFileSync(path.join(REPO, 'docs/ec45-recut/decision_edits.json'), 'utf8'));
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
  // Only a NUMERIC check's printed figure is perturbed: a claim or a string is not a figure.
  const printed = plant && typeof v === 'number' ? bump(c.printed) : c.printed;
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
if (missing.length) { console.error(`REFUSED: no key check for ${missing.length}: ${missing.join('; ')}`); process.exit(2); }
console.log(`keytruth: ${checks.length} checks on ${new Set(checks.map((c) => c.q)).size} changed rows (${numeric} numeric), `
  + `${keyed.size} keys checked, all ${GRADED.length} audited keys covered; failures ${fail}`);
process.exit(fail ? 1 : 0);
