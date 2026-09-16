// THE EC2 CAPSTONE. This file computes the eighteen GRADED values and the
// aux block for the migration headers. It runs URUAN, a field whose
// conditions appear NOWHERE in ec2_dump.mjs or digest.txt: different rates,
// different declines, a different deck, different costs, a different
// discount rate and two regimes of its own. The teaching digest and the
// capstone are two files with opposite audiences and they never share a
// number (dc-wavekit README, "The teaching digest is NOT the capstone").
//
// Usage:  node /root/ec-wip-fiscal/ec2_fields.mjs           prints the aux block
//         node /root/ec-wip-fiscal/ec2_fields.mjs --json    writes fields.json

import fs from 'fs';

const ROOT = process.env.EC2_ENGINES || '/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen/packages/engines';
const E = await import(`${ROOT}/engines/economics/fiscalRegime.js`);

export const URUAN = {
  production: {
    oil: { initial: 5200, decline: 11 },
    gas: { initial: 65, decline: 7 },
    ngl: { initial: 480, decline: 13 },
  },
  prices: [
    { year: 1, oil: 58, gas: 3.2, ngl: 27 },
    { year: 8, oil: 72, gas: 4.1, ngl: 34 },
  ],
  costs: {
    capex: { drilling: 185, facilities: 95, subsea: 35 },
    opex: { fixed: 9, variable: 6.5 },
  },
  discountRate: 11,
};

// The two regimes the capstone puts side by side.
export const CONCESSION = {
  id: 'uruan_concession',
  name: 'URUAN concession',
  royalty: { type: 'flat', rate: 14 },
  costRecoveryLimit: 100,
  profitSplit: { type: 'flat', split: 100 },
  tax: { cit: 28, rrt: 0, minTax: 0 },
};

export const PSC = {
  id: 'uruan_psc',
  name: 'URUAN production sharing contract',
  royalty: { type: 'sliding_price', tiers: [{ threshold: 0, rate: 6 }, { threshold: 60, rate: 9.5 }] },
  costRecoveryLimit: 65,
  // Tranche thresholds chosen so ALL THREE engage on URUAN and the fall-back
  // the course teaches is graded. The R factor here crosses 1.0 in year 5,
  // 1.4 in year 9 and 1.65 in year 14, peaks at 1.699873 in year 18, and then
  // FALLS back through 1.65 in year 25, stepping the contractor's split back
  // UP from 32 to 45. An earlier cut used 1.8 and 2.6, which this field never
  // reaches: the split read 65 percent in all 25 years, the tranche structure
  // was decorative, and a learner who ignored the R factor entirely scored
  // full marks on every PSC field (scratch/discriminate.mjs is the negative
  // control that found it).
  profitSplit: { type: 'tiered_r_factor', tiers: [{ threshold: 1.0, split: 65 }, { threshold: 1.4, split: 45 }, { threshold: 1.65, split: 32 }] },
  tax: { cit: 32, rrt: 0, minTax: 0 },
};

const cf = (g, cx = 1, px = 1) => E.calculateCashFlowForRegime(g, URUAN, cx, px);
const sum = (rows, k) => rows.reduce((s, x) => s + x[k], 0);

const con = cf(CONCESSION);
const psc = cf(PSC);
const cmp = await E.runFiscalComparison({ projectInputs: URUAN, regimes: [CONCESSION, PSC] });
const sPsc = cmp.summary.find((s) => s.id === PSC.id);
const sCon = cmp.summary.find((s) => s.id === CONCESSION.id);
const priceSweep = (id) => cmp.sensitivityData.price.data.find((d) => d.regimeId === id).values;
const capexSweep = (id) => cmp.sensitivityData.capex.data.find((d) => d.regimeId === id).values;
const at60 = cmp.sensitivityData.price.labels.indexOf(60);
const pscCapex = capexSweep(PSC.id);
const pscAt15 = E.calculateNPV(cf(PSC, 1.5, 1), URUAN.discountRate);

const MONEY = 0.001, PCT = 0.0001, RATIO = 0.000001;

export const FIELDS = [
  // Associate: the ledger of one regime, the URUAN concession. The YEAR each
  // reading is taken from was chosen so the value sits clear of every literal
  // in the teaching digest under all three unit shiftings: year 1 opex and
  // year 6 net cash flow were 3.1 and 1.8 tolerances from a digest number and
  // were moved to year 4 and year 5, at 156 and 279 (scratch/pick.mjs).
  ['beginner', 'con_y1_gross_revenue_musd', con[0].grossRevenue, MONEY],
  ['beginner', 'con_y4_royalty_musd', con[3].royalty, MONEY],
  ['beginner', 'con_y4_opex_musd', con[3].opex, MONEY],
  ['beginner', 'con_y5_contractor_ncf_musd', con[4].contractorNCF, MONEY],
  // NOT the payback YEAR itself. A small integer graded at a quarter-year
  // tolerance cannot be guarded: digestleak reported 364 hits against a value
  // of 6, every one of them clear air (dc-wavekit README, "A guard that fires
  // on clear air is as much a defect as one that misses"). Grading the
  // cumulative cash flow IN the payback year tests the same skill, since the
  // learner must find the year before they can read the row, and the value is
  // a real number nobody can reach by guessing.
  ['beginner', 'con_payback_year_cum_ncf_musd', con.find((x) => x.cumulativeNCF > 0).cumulativeNCF, MONEY],
  ['beginner', 'con_total_government_take_musd', sum(con, 'governmentTake'), MONEY],
  // Professional: the instruments, on the URUAN production sharing contract.
  ['intermediate', 'psc_y1_cost_recovered_musd', psc[0].costRecovered, MONEY],
  ['intermediate', 'psc_y3_unrecovered_pool_musd', psc[2].unrecoveredCostPool, MONEY],
  ['intermediate', 'psc_y5_r_factor', psc[4].rFactor, RATIO],
  // YEAR 8, not year 9. Year 8 is the FIRST year on the far side of the deck
  // step, so it is the only year that discriminates the step year: a reader
  // who put the step at year 9 reads year 8 at the old price and is wrong.
  // Year 9 is past every candidate step year, so it scored the same whether
  // the reader placed the step at 7, 8 or 9 (scratch/discriminate.mjs).
  // Tolerance 0.0003 rather than the usual 0.001. At 0.001 the guard band of
  // ten tolerances caught three unrelated digest literals (5.9561, 5.9578,
  // 5.9682, at 5.2, 3.5 and 6.9 tolerances, none of them scoring). Year 8 is
  // kept for its discrimination and the band is narrowed instead: 0.0003 on a
  // value of 5.9613 is one part in twenty thousand, so a learner reading four
  // decimals is inside it by a factor of four hundred, and the nearest digest
  // literal is now 11.7 tolerances clear.
  ['intermediate', 'psc_y8_royalty_musd', psc[7].royalty, 0.0003],
  ['intermediate', 'psc_total_tax_musd', sum(psc, 'tax'), MONEY],
  ['intermediate', 'psc_npv_musd', E.calculateNPV(psc, URUAN.discountRate), MONEY],
  // Expert: the comparison, and the numbers the course teaches you to distrust.
  ['advanced', 'cmp_top_npv_musd', cmp.summary[0].npv, MONEY],
  ['advanced', 'cmp_psc_effective_tax_rate_pct', sPsc.effectiveTaxRate, PCT],
  ['advanced', 'cmp_psc_price_sweep_at_60_pct', priceSweep(PSC.id)[at60], PCT],
  ['advanced', 'cmp_psc_capex_loss_seven_point_musd', pscCapex[0] - pscCapex[pscCapex.length - 1], MONEY],
  ['advanced', 'cmp_psc_capex_loss_eight_point_musd', pscCapex[0] - pscAt15, MONEY],
  ['advanced', 'cmp_con_price_climb_pct_points', (() => { const v = priceSweep(CONCESSION.id); return v[v.length - 1] - v[0]; })(), PCT],
];

if (process.argv.includes('--json')) {
  fs.writeFileSync('/root/ec-wip-fiscal/fields.json', JSON.stringify(FIELDS, null, 1) + '\n');
  console.error(`wrote fields.json, ${FIELDS.length} fields`);
} else {
  const f = (x, n) => Number(x).toFixed(n);
  console.log('EC2 CAPSTONE, URUAN. Aux block for the migration headers.');
  console.log('');
  console.log(`Field: oil ${URUAN.production.oil.initial} bbl/d declining ${URUAN.production.oil.decline} percent, gas ${URUAN.production.gas.initial} Mscf/d declining ${URUAN.production.gas.decline} percent, NGL ${URUAN.production.ngl.initial} bbl/d declining ${URUAN.production.ngl.decline} percent.`);
  console.log(`Deck: ${URUAN.prices.map((q) => `year ${q.year} oil ${q.oil}, gas ${q.gas}, NGL ${q.ngl}`).join('; ')}.`);
  console.log(`Costs: capex drilling ${URUAN.costs.capex.drilling}, facilities ${URUAN.costs.capex.facilities}, subsea ${URUAN.costs.capex.subsea} $MM; opex fixed ${URUAN.costs.opex.fixed} $MM a year, variable ${URUAN.costs.opex.variable} USD per boe. Discount rate ${URUAN.discountRate} percent.`);
  console.log('');
  console.log(`Concession: ${JSON.stringify(CONCESSION)}`);
  console.log(`PSC:        ${JSON.stringify(PSC)}`);
  console.log('');
  console.log('Summary the comparison returns:');
  for (const s of cmp.summary) console.log(`  ${s.name}: npv ${f(s.npv, 6)}, irr ${f(s.irr, 6)}, payback ${s.paybackPeriod}, payout ${s.rFactorPayoutYear}, govTake ${f(s.govTake, 6)}, effectiveTaxRate ${f(s.effectiveTaxRate, 6)}`);
  console.log('');
  console.log(`PSC price sweep at ${cmp.sensitivityData.price.labels.join(', ')}: ${priceSweep(PSC.id).map((v) => f(v, 6)).join(', ')}`);
  console.log(`PSC capex sweep at ${cmp.sensitivityData.capex.labels.join(', ')}: ${pscCapex.map((v) => f(v, 6)).join(', ')}`);
  console.log(`PSC NPV at a capex multiplier of 1.5, called directly: ${f(pscAt15, 6)}`);
  console.log('');
  console.log('The eighteen graded fields:');
  for (const [t, k, v, tol] of FIELDS) console.log(`  ${t.padEnd(13)} ${k.padEnd(38)} ${String(v).padEnd(24)} tol ${tol}`);
}
