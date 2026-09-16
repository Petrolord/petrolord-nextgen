// THE EC5 CAPSTONE. This file computes the eighteen GRADED values and the aux
// block for the migration headers. It runs IDOHO, a field whose conditions
// appear NOWHERE in ec5_dump.mjs or digest.txt: its own seven-project
// inventory, its own AFE, its own as-of date and its own partners.
//
// Usage:  node /root/ec-wip-portfolio/ec5_fields.mjs            prints the aux block
//         node /root/ec-wip-portfolio/ec5_fields.mjs --report   nearest digest literal per field, in tolerances
//         node /root/ec-wip-portfolio/ec5_fields.mjs --json     writes fields.json
//
// Tolerances are ABSOLUTE in each field's own units: the grader is
// abs(v_got - v_exp) <= v_tol (public.academy_submit_capstone).

import fs from 'fs';

const ROOT = process.env.EC5_ENGINES || '/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen-ec5/packages/engines';
const P = await import(`${ROOT}/engines/economics/portfolio.js`);
const A = await import(`${ROOT}/engines/economics/afe.js`);

// ---------------------------------------------------------------- Associate
export const INVENTORY = [
  { id: 'ID-1', name: 'Infill wells', capex: 145, npv_p50: 118.4, npv_p10: 176.2, npv_p90: 71.5, pos: 0.92, fail_cost: 14.6 },
  { id: 'ID-2', name: 'Compression upgrade', capex: 215, npv_p50: 163.7, npv_p10: 241.9, npv_p90: 102.3, pos: 0.86, fail_cost: 23.8 },
  { id: 'ID-3', name: 'Near-field exploration', capex: 105, npv_p50: 388.5, npv_p10: 655.4, npv_p90: 198.7, pos: 0.3, fail_cost: 72.4 },
  { id: 'ID-4', name: 'Water injection', capex: 265, npv_p50: 231.9, npv_p10: 338.6, npv_p90: 141.2, pos: 0.78, fail_cost: 46.3 },
  { id: 'ID-5', name: 'Well interventions', capex: 75, npv_p50: 47.3, npv_p10: 63.8, npv_p90: 31.6, pos: 0.97, fail_cost: 5.1 },
  { id: 'ID-6', name: 'Subsea tie-back', capex: 340, npv_p50: 402.6, npv_p10: 611.3, npv_p90: 224.8, pos: 0.5, fail_cost: 131.5 },
  { id: 'ID-7', name: 'Flare recovery', capex: 190, npv_p50: 121.2, npv_p10: 170.4, npv_p90: 79.9, pos: 0.88, fail_cost: 18.7 },
];
export const LIMITS = { first: 520, second: 640, third: 900 };
export const EXCLUDED = 'ID-3';
export const RHO = 0.45;

// ------------------------------------------------------------- Professional
export const AFE = { afe_number: 'IDOHO-2', start_date: '2028-03-06', end_date: '2029-01-19', currency: 'USD' };
export const ITEMS = [
  { code: 'RIG-01', description: 'Rig and drilling services', budget: 11384650, commitment: 1937400, actual: 8215730, progress: 67.5 },
  { code: 'TUB-02', description: 'Casing and tubulars', budget: 2963180, commitment: 0, actual: 3148920, progress: 100 },
  { code: 'CEM-03', description: 'Cementing', budget: 1476325, commitment: 412600, actual: 688140, forecast: 1591870, progress: 48 },
  { code: 'EVL-04', description: 'Evaluation and testing', budget: 3208470, commitment: 1265300, actual: 1418260, progress: 37.5 },
  { code: 'CPL-05', description: 'Completion', budget: 4719850, commitment: 873900, actual: 0, progress: 0 },
];
export const AS_OF = '2028-10-03';
export const PARTNERS = [
  { name: 'Asabo Oil', working_interest: 37.25 },
  { name: 'Okwori Energy', working_interest: 18.6 },
  { name: 'Ebok Resources', working_interest: 9.15 },
];

// ---------------------------------------------------------------- computing
const o1 = P.optimizePortfolio({ projects: INVENTORY, capexLimit: LIMITS.first });
const o2 = P.optimizePortfolio({ projects: INVENTORY, capexLimit: LIMITS.second });
const o3 = P.optimizePortfolio({ projects: INVENTORY, capexLimit: LIMITS.third });
const oExcl = P.optimizePortfolio({ projects: INVENTORY.filter((p) => p.id !== EXCLUDED), capexLimit: LIMITS.first });
const risk0 = P.portfolioRiskMetrics(o2.optimalProjects, 0);
const riskRho = P.portfolioRiskMetrics(o2.optimalProjects, RHO);
const mt = A.calculateMetrics(AFE, ITEMS, [], AS_OF);
const split = A.calculatePartnerCosts(mt.totalActuals, PARTNERS);

const MONEY = 0.001;   // million USD
const USD = 0.5;       // whole AFE currency units
const RATIO = 0.00001;
const PROB = 0.00005;

export const FIELDS = [
  // Associate: choosing what to fund.
  ['beginner', 'id_emv_at_first_limit_musd', o1.totalEmv, MONEY],
  ['beginner', 'id_emv_at_second_limit_musd', o2.totalEmv, MONEY],
  ['beginner', 'id_emv_at_third_limit_musd', o3.totalEmv, MONEY],
  ['beginner', 'id_success_npv_at_first_limit_musd', o1.totalNpvSuccess, MONEY],
  ['beginner', 'id_value_of_excluded_project_musd', o1.totalEmv - oExcl.totalEmv, MONEY],
  ['beginner', 'id_risked_emv_tie_back_musd', P.projectEmv(INVENTORY[5]), MONEY],
  // Professional: spending against the AFE.
  ['intermediate', 'id_eac_usd', mt.totalForecast, USD],
  ['intermediate', 'id_variance_at_completion_usd', mt.variance, USD],
  ['intermediate', 'id_earned_value_usd', mt.earnedValue, USD],
  ['intermediate', 'id_planned_value_usd', mt.plannedValue, USD],
  ['intermediate', 'id_cpi', mt.cpi, RATIO],
  ['intermediate', 'id_spi', mt.spi, RATIO],
  // Expert: risk, correlation and shares.
  ['advanced', 'id_p90_npv_second_limit_independent_musd', risk0.p90, MONEY],
  ['advanced', 'id_stddev_second_limit_correlated_musd', riskRho.stdDev, MONEY],
  ['advanced', 'id_prob_loss_second_limit_correlated', riskRho.probLoss, PROB],
  ['advanced', 'id_p90_npv_second_limit_correlated_musd', riskRho.p90, MONEY],
  ['advanced', 'id_second_partner_billed_usd', split.partnerAllocations[1].shareAmount, USD],
  ['advanced', 'id_operator_billed_usd', split.operatorAmount, USD],
];

const RUN_DIRECTLY = import.meta.url === `file://${process.argv[1]}`;
if (!RUN_DIRECTLY) {
  // Imported by a probe or a control script: compute, print nothing.
} else if (process.argv.includes('--json')) {
  fs.writeFileSync('/root/ec-wip-portfolio/fields.json', `${JSON.stringify(FIELDS, null, 1)}\n`);
  console.error(`wrote fields.json, ${FIELDS.length} fields`);
} else if (process.argv.includes('--report')) {
  const digest = fs.readFileSync('/root/ec-wip-portfolio/digest.txt', 'utf8');
  const lits = (digest.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
  if (lits.length < 1000) throw new Error(`digest.txt has only ${lits.length} numeric literals: it is empty or mid-rebuild`);
  console.log('field, value, tol, nearest digest literal in tolerances under three shiftings (x1, x1000, x0.001)');
  for (const [t, k, v, tol] of FIELDS) {
    const d = (scale) => Math.min(...lits.map((x) => Math.abs(x * scale - v))) / tol;
    const worst = Math.min(d(1), d(1000), d(0.001));
    console.log(`${t.padEnd(13)} ${k.padEnd(44)} ${Number(v).toFixed(6).padStart(18)} tol ${tol} nearest ${worst.toFixed(1)}${worst < 10 ? '  LEAK RISK' : ''}`);
  }
  console.log(`checks: sets ${o1.optimalProjects.map((p) => p.id).join('+')} / ${o2.optimalProjects.map((p) => p.id).join('+')} / ${o3.optimalProjects.map((p) => p.id).join('+')}; without ${EXCLUDED} at ${LIMITS.first}: ${oExcl.optimalProjects.map((p) => p.id).join('+')}; overLimit ${o1.overLimit} ${o2.overLimit} ${o3.overLimit}; SPI ${mt.spi}; split valid ${split.valid}`);
} else {
  console.log('EC5 CAPSTONE, IDOHO. Aux block for the migration headers.');
  console.log(`Inventory: ${JSON.stringify(INVENTORY)}; limits ${JSON.stringify(LIMITS)}; excluded ${EXCLUDED}; rho ${RHO}`);
  console.log(`AFE: ${JSON.stringify(AFE)}; items ${JSON.stringify(ITEMS)}; asOf ${AS_OF}; partners ${JSON.stringify(PARTNERS)}`);
  for (const [t, k, v, tol] of FIELDS) console.log(`  ${t.padEnd(13)} ${k.padEnd(44)} ${String(v).padEnd(24)} tol ${tol}`);
}
