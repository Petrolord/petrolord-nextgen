// THE EC3 CAPSTONE. This file computes the eighteen GRADED values and the aux
// block for the migration headers. It runs UMUNEDE, a field whose conditions
// appear NOWHERE in ec3_dump.mjs or digest.txt: its own quick inputs, its own
// start year, its own beliefs, its own seed and its own Monte Carlo settings.
// The teaching digest and the capstone are two files with opposite audiences
// and they never share a number (dc-wavekit README, "The teaching digest is
// NOT the capstone").
//
// Usage:  node /root/ec-wip-uncertainty/ec3_fields.mjs            prints the aux block
//         node /root/ec-wip-uncertainty/ec3_fields.mjs --report   nearest digest literal per field, in tolerances
//         node /root/ec-wip-uncertainty/ec3_fields.mjs --json     writes fields.json
//
// Tolerances are ABSOLUTE in each field's own units: the grader is
// abs(v_got - v_exp) <= v_tol (public.academy_submit_capstone).

import fs from 'fs';

const ROOT = process.env.EC3_ENGINES || '/root/wt-ec3-recut/packages/engines';
const S = await import(`${ROOT}/engines/economics/screening.js`);
const B = await import(`${ROOT}/engines/economics/breakeven.js`);
const ST = await import(`${ROOT}/lib/stats/stats.js`);

export const UMUNEDE = { initialRate: 3900, declineRate: 10, oilPrice: 64, capex: 150, fixedOpex: 2.1, opexPerBbl: 14.5, royaltyRate: 17.5, taxRate: 38, discountRate: 13, startYear: 2028 };
export const BELIEF = { capex: [125, 150, 185], opex: [14, 17.5, 23], eff: [84, 90, 95] };
export const SEED = 9031;
export const MC = { iterations: 1200, uncertainties: { price: 0.22, capex: 0.15, reserves: 0.2 } };
export const BREAKEVEN_ITERATIONS = 4000;
export const HURDLE_MUSD = 100;

const inp = S.expandQuickInputs(UMUNEDE);
const res = S.calculateEconomics(inp);
const sens = S.runSensitivityAnalysis(inp);
const mc = await S.runMonteCarlo(inp, { ...MC, seed: SEED });
const rows = inp.production.oil.map((q, i) => ({ year: UMUNEDE.startYear + i, oil_production_bbl: q }));
export const breakevenInputs = (seed = SEED) => ({
  iterations: BREAKEVEN_ITERATIONS, seed, discountRate: UMUNEDE.discountRate, royaltyRate: UMUNEDE.royaltyRate, taxRate: UMUNEDE.taxRate, targetNpv: 0,
  productionData: { data: rows },
  variables: [
    { id: 1, name: 'Total CAPEX ($MM)', p10: BELIEF.capex[0], p50: BELIEF.capex[1], p90: BELIEF.capex[2] },
    { id: 2, name: 'Annual OPEX ($MM/year)', p10: BELIEF.opex[0], p50: BELIEF.opex[1], p90: BELIEF.opex[2] },
    { id: 3, name: 'Production Efficiency (%)', p10: BELIEF.eff[0], p50: BELIEF.eff[1], p90: BELIEF.eff[2] },
  ],
});
const be = B.generateBreakevenData(breakevenInputs());
const beAlt = B.generateBreakevenData(breakevenInputs(SEED + 1));
const baseArgs = { rows, discountRate: UMUNEDE.discountRate, royaltyRate: UMUNEDE.royaltyRate, taxRate: UMUNEDE.taxRate, capexMM: BELIEF.capex[1], opexMM: BELIEF.opex[1], efficiency: BELIEF.eff[1] / 100 };
const paybackIdx = res.cashflow.findIndex((x) => x.cumulativeNCF >= 0);
const capexBar = be.tornadoData.y.indexOf('Total CAPEX');

const MONEY = 0.001;
const PRICE = 0.001;

export const FIELDS = [
  // Associate: one screening case read end to end.
  // Year 5, not year 3: year 3 sat 5 tolerances from a digest literal (scratch/pick_fields.mjs).
  ['beginner', 'um_y5_royalty_musd', res.cashflow[4].royalty, MONEY],
  ['beginner', 'um_y4_tax_musd', res.cashflow[3].tax, MONEY],
  // Year 11, not year 6: year 6 sat 10 tolerances from a digest literal.
  ['beginner', 'um_y11_ncf_musd', res.cashflow[10].ncf, MONEY],
  // NOT the payback years: a small number in a dense surface cannot be guarded.
  // The cumulative cash flow IN the year payback completes tests the same skill.
  ['beginner', 'um_payback_year_cum_ncf_musd', res.cashflow[paybackIdx].cumulativeNCF, MONEY],
  ['beginner', 'um_npv_musd', res.metrics.npv, MONEY],
  ['beginner', 'um_npv_price_up_30_musd', sens.find((s) => s.name === 'Oil Price').highParamNPV, MONEY],
  // Professional: the breakeven analyzer read properly.
  ['intermediate', 'um_capex_fit_max_musd', be.distributionFits.capex.max, MONEY],
  ['intermediate', 'um_opex_fit_mode_musd', be.distributionFits.opex.mode, MONEY],
  ['intermediate', 'um_base_breakeven_usd_bbl', be.baseBreakeven, PRICE],
  ['intermediate', 'um_breakeven_10th_percentile_usd_bbl', be.kpis.p10, PRICE],
  ['intermediate', 'um_breakeven_90th_percentile_usd_bbl', be.kpis.p90, PRICE],
  ['intermediate', 'um_tornado_capex_high_side_usd_bbl', be.tornadoData.high[capexBar], PRICE],
  // Expert: the convention, the two rules, the seed, the hurdle.
  ['advanced', 'um_mc_low_case_p90_npv_musd', mc.p10, MONEY],
  ['advanced', 'um_mc_high_case_p10_npv_musd', mc.p90, MONEY],
  ['advanced', 'um_mc_emv_musd', mc.emv, MONEY],
  ['advanced', 'um_mc_10th_percentile_floor_rule_musd', mc.allValues[Math.min(mc.allValues.length - 1, Math.floor(0.1 * mc.allValues.length))], MONEY],
  ['advanced', 'um_breakeven_median_next_seed_usd_bbl', beAlt.kpis.p50, PRICE],
  ['advanced', 'um_breakeven_at_hurdle_usd_bbl', B.solveBreakevenPrice(baseArgs, HURDLE_MUSD), PRICE],
];

const RUN_DIRECTLY = import.meta.url === `file://${process.argv[1]}`;

if (!RUN_DIRECTLY) {
  // Imported by a probe or a control script: compute, print nothing.
} else if (process.argv.includes('--json')) {
  fs.writeFileSync('/root/ec-wip-uncertainty/fields.json', `${JSON.stringify(FIELDS, null, 1)}\n`);
  console.error(`wrote fields.json, ${FIELDS.length} fields`);
} else if (process.argv.includes('--report')) {
  const digest = fs.readFileSync('/root/ec-wip-uncertainty/digest.txt', 'utf8');
  const lits = (digest.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
  if (lits.length < 1000) {
    throw new Error(`digest.txt has only ${lits.length} numeric literals: it is empty or mid-rebuild, refusing to report clearances`);
  }
  console.log('field, value, tol, nearest digest literal in tolerances under three shiftings (x1, x1000, x0.001)');
  for (const [t, k, v, tol] of FIELDS) {
    const d = (scale) => Math.min(...lits.map((x) => Math.abs(x * scale - v))) / tol;
    const worst = Math.min(d(1), d(1000), d(0.001));
    console.log(`${t.padEnd(13)} ${k.padEnd(40)} ${Number(v).toFixed(6).padStart(14)} tol ${tol} nearest ${worst.toFixed(1)}${worst < 10 ? '  LEAK RISK' : ''}`);
  }
  console.log(`checks: fits exact ${Object.values(be.distributionFits).every((x) => x.exact)}, excluded ${be.excludedIterations} and ${beAlt.excludedIterations}, irr ${res.metrics.irr.toFixed(4)} (clamped ${res.metrics.irr >= 999.999}), payback index ${paybackIdx}, mc seed ${mc.seed}, screening-rule 10th ${ST.quantile(mc.allValues, 0.1).toFixed(6)} vs floor-rule ${mc.allValues[Math.floor(0.1 * mc.allValues.length)].toFixed(6)}`);
} else {
  const f = (x, n) => Number(x).toFixed(n);
  console.log('EC3 CAPSTONE, UMUNEDE. Aux block for the migration headers.');
  console.log(`Quick inputs: ${JSON.stringify(UMUNEDE)}`);
  console.log(`Breakeven beliefs (10th / 50th / 90th percentile): capex ${BELIEF.capex.join(' / ')} $MM, opex ${BELIEF.opex.join(' / ')} $MM a year, efficiency ${BELIEF.eff.join(' / ')} percent; ${BREAKEVEN_ITERATIONS} iterations, seed ${SEED}; hurdle ${HURDLE_MUSD} $MM.`);
  console.log(`Scenario Builder Monte Carlo: ${JSON.stringify(MC)}, seed ${SEED}.`);
  console.log(`Deterministic: npv ${f(res.metrics.npv, 6)}, irr ${f(res.metrics.irr, 6)}, payback ${f(res.metrics.payback, 6)}, maxExposure ${f(res.metrics.maxExposure, 6)}.`);
  console.log(`Fits: ${JSON.stringify(be.distributionFits)}`);
  console.log('');
  console.log('The eighteen graded fields:');
  for (const [t, k, v, tol] of FIELDS) console.log(`  ${t.padEnd(13)} ${k.padEnd(40)} ${String(v).padEnd(24)} tol ${tol}`);
}
