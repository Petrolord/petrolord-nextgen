// KEY TRUTH BY ENGINE CALL for every row and the capstone field the EC1 mid-year
// recut changes (engines 3.12.3, owner decision 2026-10-14).
//
// Each check names a changed row ('intermediate final 2', 'intermediate m01 9'),
// a field of the NEW row ('prompt', 'explanation', 'key', 'option 2'), the text
// that must occur in it, and a value computed by CALLING the vendored engine
// through ../pia-recut/lib.mjs (an esbuild bundle of packages/engines cashflow.ts,
// rebuilt on every run). A number must equal the printed text at the decimals the
// text carries; a boolean is a stated claim checked on the engine's own returns
// (for example that the mid-year NPV is larger, or that the ratio of the two NPVs
// is the square root of one plus the applied rate).
//
// REFUSES (exit 2) when a check names a row the recut does not change, or when a
// changed row has no check at all. Two negative controls:
//   --plant       perturbs the last digit of every printed figure: every check
//                 that prints a figure must fail;
//   --old-engine  run with EC1_ENGINES pointing at the engines BEFORE this recut
//                 (3.12.0, mid-year adds 0.5): every check whose text is new in
//                 its row (a moved figure or a new claim) must FAIL, and every
//                 check whose text the served row already carried must pass.
//                 run_gates.py sets this up from git.
//     node keytruth.mjs [--plant | --old-engine]
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..');
process.env.EC1_WAVE_DIR = KIT;
const L = await import('../pia-recut/lib.mjs');
const F = await import('../ec1_fields.mjs');
const edits = JSON.parse(fs.readFileSync(path.join(HERE, 'edits.json'), 'utf8'));

const { E, AKATA, CASE, withCfg, run, golden } = L;
const ak = (basis, conv) => run(withCfg(AKATA, { present_value_basis: basis, discounting_convention: conv }));
const NE = ak('nominal', 'end_year'); const NM = ak('nominal', 'mid_year');
const RE = ak('real', 'end_year'); const RM = ak('real', 'mid_year');
const AKMID = run(withCfg(AKATA, { discounting_convention: 'mid_year' })); // AKATA as configured, one change
const MYD = run(CASE.mid_year_discounting); const JVD = run(CASE.jv_analytic_decision_kpis);
const PMR = golden('multiyear_pia_midyear_real'); const PR = golden('multiyear_pia_real');
const prof = (k, rate) => k.npv_profile.find((p) => p.rate_pct === rate).npv;
const dcf = (res, i) => res.cashFlowData[i].discounted_cash_flow;
const close = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b));
const sqrtFactor = (mid, end) => close(mid.kpis.npv / end.kpis.npv, Math.sqrt(1 + end.kpis.discount_rate_applied_pct / 100));
// A reader who moves only the revenue years: the end-year 2029 row with the
// engine's mid-year rows after it.
const readerNominal = dcf(NE, 0) + NM.cashFlowData.slice(1).reduce((s, r) => s + r.discounted_cash_flow, 0);

const checks = [
  { q: 'intermediate final 2', where: 'prompt', printed: '-127035587.31', value: () => dcf(NM, 0) },
  { q: 'intermediate final 2', where: 'prompt', printed: '-121123680.00', value: () => dcf(NE, 0) },
  { q: 'intermediate final 2', where: 'key', printed: 'multiplied by the square root of 1.1', value: () => close(dcf(NM, 0) / dcf(NE, 0), Math.sqrt(1.1)) },
  { q: 'intermediate final 2', where: 'explanation', printed: '76075172.20', value: () => NM.kpis.npv },
  { q: 'intermediate final 2', where: 'explanation', printed: 'sits closer to 72534830.66', value: () => Math.abs(NM.kpis.npv - NE.kpis.npv) < Math.abs(readerNominal - NE.kpis.npv) },
  { q: 'intermediate final 3', where: 'prompt', printed: '22644736.49', value: () => MYD.kpis.npv },
  { q: 'intermediate final 3', where: 'prompt', printed: '21590909.09', value: () => JVD.kpis.npv },
  { q: 'intermediate final 3', where: 'key', printed: 'scaled by the same factor does not', value: () => MYD.kpis.dpi.toFixed(6) === JVD.kpis.dpi.toFixed(6) && MYD.kpis.government_take_pct_discounted.toFixed(4) === JVD.kpis.government_take_pct_discounted.toFixed(4) },
  { q: 'intermediate final 4', where: 'prompt', printed: '226483105.72', value: () => PMR.kpis.npv },
  { q: 'intermediate final 4', where: 'prompt', printed: '219158380.04', value: () => PR.kpis.npv },
  { q: 'intermediate final 4', where: 'explanation', printed: '245468274.80', value: () => prof(PMR.kpis, 5) },
  { q: 'intermediate final 4', where: 'explanation', printed: '239552507.28', value: () => prof(PR.kpis, 5) },
  { q: 'intermediate final 4', where: 'option 0', printed: 'second project is worth more', value: () => PMR.kpis.npv > PR.kpis.npv },
  { q: 'intermediate final 4', where: 'option 2', printed: 'first project carries the higher discount rate', value: () => PR.kpis.npv < PMR.kpis.npv },
  { q: 'intermediate final 37', where: 'prompt', printed: '74959094.51', value: () => RM.kpis.npv },
  { q: 'intermediate final 37', where: 'option 0', printed: '76075172.20', value: () => NM.kpis.npv },
  { q: 'intermediate final 37', where: 'option 3', printed: '76075172.20', value: () => NM.kpis.npv },
  { q: 'intermediate final 37', where: 'explanation', printed: '74959094.51', value: () => RM.kpis.npv },
  { q: 'intermediate final 38', where: 'key', printed: '226483105.72', value: () => PMR.kpis.npv },
  { q: 'intermediate final 42', where: 'prompt', printed: '76075172.20', value: () => NM.kpis.npv },
  { q: 'intermediate final 42', where: 'prompt', printed: '74959094.51', value: () => RM.kpis.npv },
  { q: 'intermediate m01 4', where: 'option 2', printed: '22644736.49', value: () => MYD.kpis.npv },
  { q: 'intermediate m01 4', where: 'option 2', printed: 'multiplied by the square root of 1.1', value: () => sqrtFactor(MYD, JVD) },
  { q: 'intermediate m01 9', where: 'prompt', printed: 'minus 13110110.60', value: () => `minus ${(-dcf(MYD, 0)).toFixed(2)}` },
  { q: 'intermediate m01 9', where: 'prompt', printed: '35754847.10', value: () => dcf(MYD, 1) },
  { q: 'intermediate m01 9', where: 'prompt', printed: '22644736.49', value: () => MYD.kpis.npv },
  { q: 'intermediate m01 9', where: 'key', printed: 'multiplied by the square root of 1.1', value: () => sqrtFactor(MYD, JVD) },
  { q: 'intermediate m01 9', where: 'option 1', printed: 'which is why it is higher', value: () => MYD.kpis.npv > JVD.kpis.npv },
  { q: 'intermediate m01 10', where: 'prompt', printed: '76075172.20', value: () => NM.kpis.npv },
  { q: 'intermediate m01 10', where: 'prompt', printed: '74959094.51', value: () => RM.kpis.npv },
  { q: 'intermediate m01 10', where: 'key', printed: 'smaller factor', value: () => RM.kpis.npv / RE.kpis.npv < NM.kpis.npv / NE.kpis.npv },
  { q: 'intermediate m01 10', where: 'explanation', printed: '76075172.20', value: () => NM.kpis.npv },
  { q: 'intermediate m01 12', where: 'key', printed: 'minus 127035587.31', value: () => `minus ${(-dcf(NM, 0)).toFixed(2)}` },
  { q: 'intermediate m01 12', where: 'explanation', printed: 'true gap is smaller than the reader computes', value: () => Math.abs(NM.kpis.npv - NE.kpis.npv) < Math.abs(readerNominal - NE.kpis.npv) },
  { q: 'intermediate m01 12', where: 'option 1', printed: '74959094.51', value: () => RM.kpis.npv },
  { q: 'intermediate m01 12', where: 'option 3', printed: '76075172.20', value: () => NM.kpis.npv },
  { q: 'intermediate m01 13', where: 'prompt', printed: '76075172.20', value: () => NM.kpis.npv },
  { q: 'intermediate m01 13', where: 'option 1', printed: 'its higher figure', value: () => NM.kpis.npv > NE.kpis.npv },
  { q: 'intermediate m01 15', where: 'option 2', printed: 'lower NPV of 72534830.66', value: () => RE.kpis.npv < RM.kpis.npv && RE.kpis.npv.toFixed(2) === '72534830.66' },
  { q: 'intermediate m02 9', where: 'prompt', printed: '76075172.20', value: () => NM.kpis.npv },
  { q: 'intermediate m02 9', where: 'prompt', printed: '74959094.51', value: () => RM.kpis.npv },
  { q: 'intermediate m02 9', where: 'key', printed: 'multiplies by the square root of one plus the applied rate', value: () => sqrtFactor(NM, NE) && sqrtFactor(RM, RE) },
  { q: 'intermediate m03 9', where: 'option 2', printed: 'minus 125171883.54', value: () => `minus ${(-dcf(AKMID, 0)).toFixed(2)}` },
  { q: 'intermediate m03 9', where: 'key', printed: '3.961607', value: () => AKMID.kpis.discounted_payback_years },
  { q: 'intermediate m04 1', where: 'prompt', printed: '74959094.51', value: () => RM.kpis.npv },
  { q: 'intermediate m04 1', where: 'prompt', printed: '76075172.20', value: () => NM.kpis.npv },
  { q: 'intermediate m04 1', where: 'key', printed: '29.2361', value: () => (new Set([NE, NM, RE, RM].map((x) => x.kpis.irr.toFixed(4))).size === 1 ? RM.kpis.irr : NaN) },
  { q: 'intermediate m06 3', where: 'prompt', printed: '74959094.51', value: () => RM.kpis.npv },
  { q: 'intermediate m06 3', where: 'option 1', printed: 'the higher of the two', value: () => RM.kpis.npv > RE.kpis.npv },
  { q: 'intermediate m06 3', where: 'explanation', printed: '76075172.20', value: () => NM.kpis.npv },
  { q: 'intermediate m06 7', where: 'key', printed: '74959094.51', value: () => AKMID.kpis.npv },
  { q: 'intermediate m06 7', where: 'prompt', printed: '74959094.51', value: () => AKMID.kpis.npv },
  { q: 'intermediate m06 8', where: 'option 1', printed: '74959094.51', value: () => AKMID.kpis.npv },
  { q: 'intermediate m06 10', where: 'option 1', printed: 'moves the valuation year row by half a year', value: () => close(dcf(AKMID, 0) / dcf(RE, 0), Math.sqrt(1 + RE.kpis.discount_rate_applied_pct / 100)) },
  { q: 'intermediate m06 12', where: 'explanation', printed: '74959094.51', value: () => AKMID.kpis.npv },
  { q: 'intermediate m06 15', where: 'option 2', printed: '74959094.51', value: () => AKMID.kpis.npv },
];

// The capstone: the graded mid-year field, by the engine on the capstone's own inputs.
const capMid = E.computeCashFlow({ cfg: { ...F.JV, discounting_convention: 'mid_year' }, prodRows: F.PROD, capexRows: F.CAPEX, opexRows: F.OPEX }).kpis.npv;
const capEnd = E.computeCashFlow({ cfg: F.JV, prodRows: F.PROD, capexRows: F.CAPEX, opexRows: F.OPEX }).kpis;

const mode = process.argv.includes('--plant') ? 'plant' : process.argv.includes('--old-engine') ? 'oldengine' : 'check';
const bump = (s) => s.replace(/(\d)(?!.*\d)/, (d) => String((Number(d) + 1) % 10));
const byId = new Map(edits.questions.map((e) => [`${e.tier} ${e.scope === 'final' ? 'final' : e.module_key.split('-')[0]} ${e.ord}`, e]));
const covered = new Set();
let fail = 0; let numeric = 0; let numericFailed = 0; let movedN = 0; let movedFailed = 0; let keptN = 0; let keptFailed = 0;
for (const c of checks) {
  const e = byId.get(c.q);
  if (!e) { console.error(`REFUSED: "${c.q}" is not a row this recut changes`); process.exit(2); }
  covered.add(c.q);
  const r = e.new;
  const field = c.where === 'key' ? r.options[r.answer_index] : c.where.startsWith('option ') ? r.options[Number(c.where.slice(7))] : r[c.where];
  if (typeof field !== 'string') { console.error(`REFUSED: ${c.q} has no field ${c.where}`); process.exit(2); }
  const isNum = /^(minus )?-?[\d.]+$/.test(c.printed);
  const printed = mode === 'plant' && isNum ? bump(c.printed) : c.printed;
  const of = c.where === 'key' ? e.old.options[e.old.answer_index] : c.where.startsWith('option ') ? e.old.options[Number(c.where.slice(7))] : e.old[c.where];
  const moved = !of.includes(c.printed);
  const v = c.value();
  let ok;
  if (typeof v === 'number') {
    const dp = (printed.split('.')[1] || '').length;
    ok = Number(v.toFixed(dp)) === Number(printed);
  } else if (typeof v === 'string') ok = v === printed;
  else ok = v === true;
  ok = ok && field.includes(printed);
  if (isNum) { numeric += 1; if (!ok) numericFailed += 1; }
  if (moved) { movedN += 1; if (!ok) movedFailed += 1; } else { keptN += 1; if (!ok) keptFailed += 1; }
  if (!ok) { fail += 1; if (mode === 'check') console.log(`FAIL ${c.q} ${c.where}: printed "${printed}", engine ${typeof v === 'number' ? v : v}`); }
}
const uncovered = [...byId.keys()].filter((k) => !covered.has(k));
if (uncovered.length) { console.error(`REFUSED: changed row(s) with no check: ${uncovered.join(', ')}`); process.exit(2); }

const cap = edits.capstones.find((c) => c.tier === 'intermediate');
const capField = cap && cap.new.fields.find((f) => f.key === 'jv_npv_mid_year_usd');
const capOk = !!capField && capField.expected === capMid && capMid > capEnd.npv
  && Math.abs(cap.old.fields.find((f) => f.key === 'jv_npv_mid_year_usd').expected - capMid) > 1000 * capField.tol
  && /takes one half from every exponent/.test(cap.new.prompt) && !/adds one half/.test(cap.new.prompt);

if (mode === 'check') {
  console.log(`capstone jv_npv_mid_year_usd: engine ${capMid}, end-year ${capEnd.npv}; served row ${capOk ? 'carries it' : 'DOES NOT carry it'}`);
  console.log(`${checks.length} checks on ${covered.size} changed rows (${numeric} numeric), ${fail} failed`);
  process.exit(fail === 0 && capOk ? 0 : 1);
}
if (mode === 'plant') {
  console.log(`negative control --plant: ${numericFailed} of ${numeric} figure checks failed`);
  process.exit(numeric > 0 && numericFailed === numeric ? 0 : 1);
}
console.log(`negative control --old-engine (engine ${E.ENGINE_VERSION}): ${movedFailed} of ${movedN} checks on new text failed, ${keptFailed} of ${keptN} checks on unchanged text failed; capstone field ${capOk ? 'still matches' : 'no longer matches'}`);
process.exit(movedN > 0 && movedFailed === movedN && keptFailed === 0 && !capOk ? 0 : 1);
