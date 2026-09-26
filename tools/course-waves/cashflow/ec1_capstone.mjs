// THE THREE EC1 CAPSTONES, RENDERED FROM THE INPUTS THE ENGINE RAN ON.
//
// Every figure a prompt states (volumes, prices, rates, the working interest,
// the stated new-PML reading, the prior cumulative production, the abandonment)
// is printed from the same JV / PIA / PROD / CAPEX / OPEX objects that
// ec1_fields.mjs hands to engines/economics/cashflow.ts, and every graded value
// is that file's engine return value. Nothing here computes an economic
// quantity. The prompts never print a graded value.
//
// The Associate and Professional capstones are served unchanged by the EC7
// recut: --check <served capstones json> proves their title, dataset, prompt
// and six fields byte-identical to the served rows (the Professional breakeven
// tolerance is the B5 0.005 already in the served row).
//
//   node ec1_capstone.mjs                    write capstones.json beside this file
//   node ec1_capstone.mjs --check <served>   also compare the two unchanged tiers
import fs from 'fs';
import { E, PROD, CAPEX, OPEX, JV, PIA, fields } from './ec1_fields.mjs';

const HERE = process.env.EC1_WAVE_DIR || new URL('.', import.meta.url).pathname.replace(/\/$/, '');
const n = (x) => x.toLocaleString('en-US', { maximumFractionDigits: 6 });
const col = (k) => PROD.map((r) => r[k]);
const oil = col('ikpoto_oil_bbl'); const gas = col('ikpoto_gas_mscf');
const years = PROD.map((r) => r.year);
const first = years[0];
const must = (claim, cond) => { if (!cond) throw new Error(`capstone input check failed: ${claim}`); };

// The prose states the decline, the gas-oil ratio and the flat opex; check the rows say the same.
const decline = 1 - oil[1] / oil[0];
must('oil declines twenty percent a year', oil.every((v, i) => i === 0 || Math.abs(v / oil[i - 1] - 0.8) < 1e-12));
must('gas at 900 scf per barrel', gas.every((g, i) => Math.abs(g / oil[i] - 0.9) < 1e-12));
must('opex flat in base-year money', OPEX.every((r) => r.total_opex_usd === OPEX[0].total_opex_usd));
must('capex in the first two years', CAPEX.length === 2 && CAPEX[0].year === first && CAPEX[1].year === first + 1);
must('decline is 0.2', Math.abs(decline - 0.2) < 1e-12);

const pct = (x) => `${n(x)} percent`;
const WI = JV.jv_working_interest_pct;
const gross = (1 / (WI / 100));

const associate = {
  tier: 'beginner', cert_tier: 'associate',
  title: 'Read the ledger',
  dataset: `IKPOTO, a six-year oil field with associated gas under joint venture terms at an ${WI} percent working interest, a field the lessons never use`,
  prompt: `Six values from the IKPOTO joint venture ledger supplied with this capstone. First oil ${first}, six years of production: ${n(oil[0])} bbl of oil in ${first} declining twenty percent a year (${oil.slice(1).map(n).join('; ')}), with gas at 900 scf per barrel (${n(gas[0])} Mscf in ${first}, then ${gas.slice(1).map(n).join('; ')}). Capex ${n(CAPEX[0].amount_usd)} USD in ${CAPEX[0].year} and ${n(CAPEX[1].amount_usd)} USD in ${CAPEX[1].year}; opex ${n(OPEX[0].total_opex_usd)} USD a year in ${first} money escalating at ${n(JV.opex_escalator_pct)} percent. Oil ${n(JV.oil_price_usd_bbl)} USD/bbl and gas ${JV.gas_price_usd_mscf.toFixed(1)} USD/Mscf in ${first}, both escalating at ${n(JV.oil_price_escalator_pct)} percent; inflation ${n(JV.inflation_rate_pct)} percent; base year ${JV.base_year}. Joint venture terms: working interest ${pct(WI)}, royalty ${pct(JV.jv_royalty_pct)}, tax ${pct(JV.jv_tax_rate_pct)}, depreciation on the engine's default straight line. Report: (1) the GROSS REVENUE in 2033; (2) the TAX in 2032; (3) the NET CASH FLOW in 2034; (4) the PAYBACK in years; (5) the TOTAL barrels of oil equivalent; and (6) the GOVERNMENT TAKE in percent. Traps. The joint venture ledger reports EVERY line at the ${WI} percent SHARE, the way the production sharing and PIA regimes already did: gross revenue, volumes, opex, capex and depreciation as well as royalty, taxable income, tax and net cash flow. So fields 1, 2, 3 and 5 are all the share, and a reader who takes the gross field ledger is wrong on each of them by a factor of ${n(gross)}. Gas counts at 6 Mscf per barrel of oil equivalent. Depreciation is a deduction in the tax line and NOT a cash flow in field 3. Payback is read off the CUMULATIVE nominal cash flow and interpolated inside the year it turns positive. Take is the engine's: the pre-take value at your share (revenue less capex less opex, undiscounted) minus the contractor's net cash flow, over the pre-take value, so it no longer moves when the working interest does; report the engine's number as the engine defines it.`,
};

const professional = {
  tier: 'intermediate', cert_tier: 'professional',
  title: 'Put a time value on the ledger',
  dataset: 'the IKPOTO joint venture ledger valued in time: two discounting conventions, a real basis, and the price at which the value is nought',
  prompt: `Six values for the same IKPOTO joint venture run as the Associate capstone (identical rows and terms), now valued at a ${n(JV.discount_rate_pct)} percent NOMINAL discount rate on the REAL basis with ${n(JV.inflation_rate_pct)} percent inflation, valuation year equal to the ${JV.base_year} base year, nothing sunk. Report: (1) the NPV under END-YEAR discounting; (2) the NPV under MID-YEAR discounting; (3) the INTERNAL RATE OF RETURN in percent; (4) the DISCOUNTED PAYBACK in years; (5) the DPI (NPV over the present value of capex); and (6) the BREAKEVEN flat oil price in USD/bbl at which the end-year NPV is nought. Traps. The applied rate is the Fisher REAL rate, (${(1 + JV.discount_rate_pct / 100).toFixed(2)} / ${(1 + JV.inflation_rate_pct / 100).toFixed(3)}) - 1, not ${n(JV.discount_rate_pct)} percent, and the flows it discounts are the DEFLATED flows; discounting the nominal flows at ${n(JV.discount_rate_pct)} percent gives the same NPV, which is the point, but discounting the deflated flows at ${n(JV.discount_rate_pct)} percent does not. Mid-year adds one half to every exponent including the first. IRR is solved on the NOMINAL flows and does not depend on the basis. DPI here is NPV over PV(capex), which is the profitability index MINUS ONE; report the engine's definition. The breakeven is the FLAT price with the ${n(JV.oil_price_escalator_pct)} percent escalator still applied from it, found by bisection to the cent.`,
};

// THE EXPERT CAPSTONE (EC7 recut, lead decisions L1, L2, L3). Every statement
// about the law is the default path of engines 3.12.0; the stated new-PML rate
// and the price-royalty base are said to be what they are.
must('Expert runs the PIA', PIA.fiscal_regime === 'PIA');
must('new shallow-water PML', PIA.pia_terrain === 'shallow_water' && PIA.pia_license_type === 'PML' && PIA.pia_lease_status === 'new');
must('no statutory override in the Expert config', ['pia_tet_rate_pct', 'pia_capex_recovery_years', 'pia_cpr_limit_pct', 'pia_nddc_levy_pct_of_opex',
  'pia_nddc_levy_base', 'pia_price_royalty_base', 'pia_production_allowance_per_bbl_new', 'pia_legacy_pre_audit'].every((k) => !(k in PIA)));
must('the new-PML rate is stated at 30', PIA.pia_new_pml_hct_rate_pct === 30);
const res = E.computeCashFlow({ cfg: PIA, prodRows: PROD, capexRows: CAPEX, opexRows: OPEX });
must('every Expert year is an NTA 2025 year', res.cashFlowData.every((r) => r.fiscal_framework === 'nta_2025'));
const crossing = res.cashFlowData.find((r) => r.prod_alw_below_cap_bbl > 0 && r.prod_alw_after_cap_bbl > 0);
must('the allowance cap is crossed in the second year', crossing && crossing.year === first + 1);
const firstDefer = res.cashFlowData.find((r) => r.cpr_deferred_to_next > 0);
must('the CPR cap first defers cost in the fourth year', firstDefer && firstDefer.year === first + 3);
const last = years[years.length - 1];

const expert = {
  tier: 'advanced', cert_tier: 'expert',
  title: 'Run the same rows through the cascade',
  dataset: 'the IKPOTO rows under the Petroleum Industry Act and the Nigeria Tax Act 2025: a new shallow-water lease crossing the allowance cap in its second year, a cost price ratio carry that grows, and a terminal abandonment',
  prompt: `Six values for IKPOTO run under the PIA with the SAME production, capex and opex rows and the same prices, escalators, inflation, base year and ${n(JV.discount_rate_pct)} percent nominal rate as the Professional capstone. Fiscal terms: shallow water at ${n(PIA.pia_water_depth_m)} m, PML, a NEW lease granted out of new acreage, not a pre-2021 marginal field, ${n(PIA.pia_working_interest_pct)} percent working interest, no HCT override, CIT ${n(PIA.pia_cit_rate_pct)} percent, no prior-year opex, framework override auto, prior cumulative production ${n(PIA.pia_prior_cumulative_oil_bbl)} bbl, and a ${n(PIA.abandonment_cost_usd)} USD post-tax abandonment lump sum in the final modeled year. Every other term is the engine's default, which follows the texts: NDDC at 3 percent of the total annual budget, the capital allowance over the five years the texts fix, the cost price ratio limit of 65 percent, the Sixth Schedule production allowance, and the tertiary education tax at its statutory rate. The texts do not say which hydrocarbon tax rate a PML granted out of new acreage onshore or in shallow water pays, so this capstone states ${n(PIA.pia_new_pml_hct_rate_pct)} percent as a stated reading; none of the six values depends on it. The royalty by price is read on the Petroleum Royalty Regulations 2022 base, benchmarks of 50, 100 and 150 USD/bbl at 2021 levels, which is the engine's default. Report: (1) the PRICE ROYALTY in ${first + 1}; (2) the PRODUCTION ALLOWANCE in ${first + 1}; (3) the NDDC levy in ${first}; (4) the TOTAL companies income tax; (5) the DEVELOPMENT LEVY in ${first + 2}; and (6) the cost the CPR cap carries out of ${last - 1} into ${last}. Traps. The framework is chosen for each year of assessment, and every year from ${first} to ${last} is 2026 or later, so each is an NTA 2025 year: the development levy at 4 percent applies and TET is nought in every year. The production royalty tranches, the price-royalty benchmarks and the allowance volume cap are read at FIELD level and applied before the ${n(PIA.pia_working_interest_pct)} percent share. The cap is 100 MMbbl for shallow water and the prior production counts against it; the barrels below the cap earn the new-lease allowance and the barrels after it still earn the lower after-cap allowance, each limited to 20 percent of the oil price. NDDC is charged on opex plus capex at your share and is deducted in the hydrocarbon tax base. The CPR cap is 65 percent of crude plus condensate revenue and limits only the costs claimed against the hydrocarbon tax; shared costs enter it at the crude-plus-condensate share, and what does not fit carries to the next year and is claimed there within that year's cap. Companies income tax deducts the full opex, royalties, HCDT, NDDC and its own capital allowance, and the CPR cap never touches it. The abandonment is post-tax and moves no tax line.`,
};

const LABEL = {
  jv_2033_gross_revenue_usd: ['USD', 'Gross revenue in 2033'], jv_2032_tax_usd: ['USD', 'Tax in 2032'],
  jv_2034_net_cash_flow_usd: ['USD', 'Net cash flow in 2034'], jv_payback_years: ['years', 'Payback'],
  jv_total_boe: ['boe', 'Total barrels of oil equivalent'], jv_government_take_pct: ['percent', 'Government take'],
  jv_npv_real_usd: ['USD', 'NPV, real basis, end year'], jv_npv_mid_year_usd: ['USD', 'NPV, real basis, mid year'],
  jv_irr_pct: ['percent', 'Internal rate of return'], jv_discounted_payback_years: ['years', 'Discounted payback'],
  jv_dpi: ['ratio', 'Discounted profitability index'], jv_breakeven_oil_price_usd_bbl: ['USD/bbl', 'Breakeven oil price'],
  pia_2032_price_royalty_usd: ['USD', 'Price royalty in 2032'],
  pia_2032_production_allowance_usd: ['USD', 'Production allowance in 2032'],
  pia_2031_nddc_usd: ['USD', 'NDDC levy in 2031'],
  pia_total_cit_usd: ['USD', 'Total companies income tax'],
  pia_2033_dev_levy_usd: ['USD', 'Development levy in 2033'],
  pia_2035_cpr_deferred_usd: ['USD', 'Cost the CPR cap carries out of 2035'],
};
// The B5 tolerance already served for the Professional breakeven (migration
// 20261022_b5_graded_tolerances): half a cent, because the prompt asks for the cent.
const SERVED_TOL = { jv_breakeven_oil_price_usd_bbl: 0.005 };

const caps = [associate, professional, expert].map((c) => ({
  app_slug: 'cashflow', ...c,
  fields: fields.filter(([t]) => t === c.tier).map(([, key, expected, tol]) => {
    must(`label for ${key}`, LABEL[key]);
    return { key, tol: SERVED_TOL[key] ?? tol, unit: LABEL[key][0], label: LABEL[key][1], expected };
  }),
}));
for (const c of caps) {
  must(`${c.tier} carries six fields`, c.fields.length === 6);
  for (const t of [c.prompt, c.dataset, c.title]) must(`${c.tier} carries no em or en dash`, !/[–—]/.test(t));
}
fs.writeFileSync(`${HERE}/capstones.json`, JSON.stringify(caps, null, 1) + '\n');

const i = process.argv.indexOf('--check');
if (i > 0) {
  const served = JSON.parse(fs.readFileSync(process.argv[i + 1], 'utf8'));
  let bad = 0;
  for (const tier of ['beginner', 'intermediate']) {
    const s = served.find((c) => c.tier === tier); const m = caps.find((c) => c.tier === tier);
    for (const k of ['cert_tier', 'title', 'dataset', 'prompt']) if (s[k] !== m[k]) { bad += 1; console.log(`DIFFERS ${tier}.${k}`); }
    if (JSON.stringify(s.fields) !== JSON.stringify(m.fields)) { bad += 1; console.log(`DIFFERS ${tier}.fields`); }
  }
  const s = served.find((c) => c.tier === 'advanced'); const m = caps.find((c) => c.tier === 'advanced');
  console.log(`Expert: prompt ${s.prompt === m.prompt ? 'unchanged' : 'rewritten'}; fields ${s.fields.map((f) => f.key).join(',')} -> ${m.fields.map((f) => f.key).join(',')}`);
  console.log(bad === 0 ? 'Associate and Professional capstones byte-identical to the served rows' : `${bad} difference(s) in the unchanged tiers`);
  process.exit(bad === 0 ? 0 : 1);
}
console.log('capstones.json written: three capstones, eighteen fields');
