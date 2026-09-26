// The EC1 capstone (Cash Flow & NPV), and the eighteen graded fields derived
// from it by running the engine. Nothing here is typed from a lesson, a chart
// or a table: every graded number below is a return value of
// engines/economics/cashflow.ts.
//
// Every condition below differs from the ones cashflow_cases.json publishes
// and from the teaching field AKATA in ec1_dump.mjs, which is the DR2 rule:
// design the capstone's conditions BEFORE writing the lessons, so the tiers
// can teach on the published cases and grade on this one.
//
// UNITS. USD, bbl, Mscf, percent as the engine reports them (irr and take are
// percent, dpi is a ratio, payback in years).
//
// ---------------------------------------------------------------------------
// THE FIELD: IKPOTO, and why it is uncomfortable
//
// A six-year oil field with associated gas, first oil 2031, declining twenty
// percent a year, at an 80 percent working interest. Three things were tuned
// into it:
//
//   1. THE ASSOCIATE AND PROFESSIONAL TIERS READ IT UNDER JOINT VENTURE TERMS
//      on a real basis with 2.5 percent inflation and a 9 percent nominal
//      discount rate, so the Fisher real rate is not a round number and the
//      NPV profile's applied point misses the headline (Section 21.1 of the
//      digest teaches the mechanism on AKATA; the capstone grades the
//      headline, never the profile point).
//
//   2. THE WORKING INTEREST IS 80 PERCENT, so every monetary line scales
//      inside the JV regime while the field-level volumes do not, and a
//      learner who reads the gross field ledger instead of the share ledger
//      is wrong on every money field by a factor of 1.25.
//
//   3. THE EXPERT TIER READS THE SAME ROWS UNDER THE PIA as a NEW shallow-
//      water lease whose prior cumulative production sits 2.3875 MMbbl short of
//      the 100 MMbbl production-allowance cap, so the cap crosses in the
//      SECOND year; a CPR limit of 35 percent that defers cost in the first
//      year; a 2031 base year so the date trigger selects the NTA framework
//      and the development levy replaces TET; and a 40 MUSD post-tax
//      abandonment lump sum in the final year, which gives the nominal net
//      cash flow a terminal negative and therefore a second IRR root (the
//      tier grades NPV and the fiscal lines, never the IRR).
// ---------------------------------------------------------------------------
import fs from 'fs';
import { fileURLToPath } from 'url';
const MAIN = process.argv[1] === fileURLToPath(import.meta.url);
const HERE = process.env.EC1_WAVE_DIR || new URL('.', import.meta.url).pathname.replace(/\/$/, '');
const E = await import(`${HERE}/scratch/cashflow.mjs`);

const PROD = [
  { year: 2031, ikpoto_oil_bbl: 1600000, ikpoto_gas_mscf: 1440000 },
  { year: 2032, ikpoto_oil_bbl: 1280000, ikpoto_gas_mscf: 1152000 },
  { year: 2033, ikpoto_oil_bbl: 1024000, ikpoto_gas_mscf: 921600 },
  { year: 2034, ikpoto_oil_bbl: 819200, ikpoto_gas_mscf: 737280 },
  { year: 2035, ikpoto_oil_bbl: 655360, ikpoto_gas_mscf: 589824 },
  { year: 2036, ikpoto_oil_bbl: 524288, ikpoto_gas_mscf: 471859.2 },
];
const CAPEX = [{ year: 2031, amount_usd: 120000000 }, { year: 2032, amount_usd: 30000000 }];
const OPEX = [2031, 2032, 2033, 2034, 2035, 2036].map((y) => ({ year: y, total_opex_usd: 19000000 }));

const JV = {
  base_year: 2031, fiscal_regime: 'JV', present_value_basis: 'real',
  discount_rate_pct: 9, inflation_rate_pct: 2.5,
  oil_price_usd_bbl: 76, gas_price_usd_mscf: 3.0, condensate_price_usd_bbl: 0,
  oil_price_escalator_pct: 1.5, gas_price_escalator_pct: 1.5, condensate_price_escalator_pct: 0,
  opex_escalator_pct: 3.5, capex_escalator_pct: 0,
  jv_working_interest_pct: 80, jv_royalty_pct: 12.5, jv_tax_rate_pct: 45,
};
// THE EXPERT TIER ON THE DEFAULT PATH (engines 3.12.0, EC7 recut 2026-09-26,
// PROPOSED, pending the lead's decision). The live IKPOTO config is refused by
// the corrected engine twice over: pia_capex_recovery_years 4 (the texts fix
// five years) and a new-acreage PML with no pia_new_pml_hct_rate_pct (the texts
// do not say 15 or 30). Every non-statutory override is removed (TET, recovery
// years, the NDDC opex base, the 35 percent CPR limit), and the new-PML rate is
// STATED at 30. Because that rate is a reading the texts leave open, the six
// Expert fields are chosen so that NONE depends on it: the generator runs the
// field at 15 and at 30 and refuses unless every field agrees exactly.
const PIA = {
  ...JV, fiscal_regime: 'PIA',
  pia_terrain: 'shallow_water', pia_license_type: 'PML', pia_lease_status: 'new', pia_water_depth_m: 45,
  pia_marginal_field_pre_2021: false, pia_hct_rate_override_pct: null, pia_new_pml_hct_rate_pct: 30,
  pia_cit_rate_pct: 30, pia_nddc_levy_fixed_usd: null, pia_prior_year_opex_usd: 0,
  pia_under_nta_2025_override: 'auto', pia_prior_cumulative_oil_bbl: 97612500,
  pia_working_interest_pct: 80,
  abandonment_cost_usd: 40000000,
};
// The live Expert config as published (engines 3.10.0), kept only so the recut
// report can show that the default path refuses it.
export const PIA_LIVE = {
  ...JV, fiscal_regime: 'PIA',
  pia_terrain: 'shallow_water', pia_license_type: 'PML', pia_lease_status: 'new', pia_water_depth_m: 45,
  pia_marginal_field_pre_2021: false, pia_hct_rate_override_pct: null,
  pia_cit_rate_pct: 30, pia_tet_rate_pct: 2.5, pia_nddc_levy_pct_of_opex: 3, pia_nddc_levy_fixed_usd: null,
  pia_prior_year_opex_usd: 0, pia_capex_recovery_years: 4, pia_cpr_limit_pct: 35,
  pia_production_allowance_per_bbl_converted: 2.5, pia_production_allowance_per_bbl_new: 8, pia_production_allowance_pct_of_price: 20,
  pia_under_nta_2025_override: 'auto', pia_prior_cumulative_oil_bbl: 97612500,
  pia_working_interest_pct: 80,
  abandonment_cost_usd: 40000000,
};

const jv = E.computeCashFlow({ cfg: JV, prodRows: PROD, capexRows: CAPEX, opexRows: OPEX });
const jvMid = E.computeCashFlow({ cfg: { ...JV, discounting_convention: 'mid_year' }, prodRows: PROD, capexRows: CAPEX, opexRows: OPEX });
const pia = E.computeCashFlow({ cfg: PIA, prodRows: PROD, capexRows: CAPEX, opexRows: OPEX });
const pia15 = E.computeCashFlow({ cfg: { ...PIA, pia_new_pml_hct_rate_pct: 15 }, prodRows: PROD, capexRows: CAPEX, opexRows: OPEX });
const be = E.computeBreakevenOilPrice({ cfg: JV, prodRows: PROD, capexRows: CAPEX, opexRows: OPEX });
const row = (res, y) => res.cashFlowData.find((q) => q.year === y);

const fields = [
  ['beginner', 'jv_2033_gross_revenue_usd', row(jv, 2033).gross_revenue, 1],
  ['beginner', 'jv_2032_tax_usd', row(jv, 2032).tax, 1],
  ['beginner', 'jv_2034_net_cash_flow_usd', row(jv, 2034).net_cash_flow, 1],
  ['beginner', 'jv_payback_years', jv.kpis.payback_years, 0.00001],
  ['beginner', 'jv_total_boe', jv.kpis.total_boe, 1],
  ['beginner', 'jv_government_take_pct', jv.kpis.government_take_pct, 0.0001],
  ['intermediate', 'jv_npv_real_usd', jv.kpis.npv, 1],
  ['intermediate', 'jv_npv_mid_year_usd', jvMid.kpis.npv, 1],
  ['intermediate', 'jv_irr_pct', jv.kpis.irr, 0.0001],
  ['intermediate', 'jv_discounted_payback_years', jv.kpis.discounted_payback_years, 0.0001],
  ['intermediate', 'jv_dpi', jv.kpis.dpi, 0.000001],
  ['intermediate', 'jv_breakeven_oil_price_usd_bbl', be, 0.001],
  ['advanced', 'pia_2032_price_royalty_usd', row(pia, 2032).price_royalty, 1],
  ['advanced', 'pia_2032_production_allowance_usd', row(pia, 2032).production_allowance, 1],
  ['advanced', 'pia_2031_nddc_usd', row(pia, 2031).nddc, 1],
  ['advanced', 'pia_total_cit_usd', pia.kpis.total_cit, 1],
  ['advanced', 'pia_2033_dev_levy_usd', row(pia, 2033).dev_levy_tax, 1],
  ['advanced', 'pia_2034_cpr_deferred_usd', row(pia, 2034).cpr_deferred_to_next, 1],
];
for (const [, k, x] of fields) if (!Number.isFinite(x)) throw new Error(`field ${k} is not finite: ${x}`);
// The stated new-PML reading must not reach any graded field.
{
  const at15 = {
    pia_2032_price_royalty_usd: row(pia15, 2032).price_royalty, pia_2032_production_allowance_usd: row(pia15, 2032).production_allowance,
    pia_2031_nddc_usd: row(pia15, 2031).nddc, pia_total_cit_usd: pia15.kpis.total_cit, pia_2033_dev_levy_usd: row(pia15, 2033).dev_levy_tax,
    pia_2034_cpr_deferred_usd: row(pia15, 2034).cpr_deferred_to_next,
  };
  for (const [t, k, x] of fields) if (t === 'advanced' && at15[k] !== x) throw new Error(`field ${k} depends on the stated new-PML HCT reading: ${x} at 30, ${at15[k]} at 15`);
}
if (MAIN) fs.writeFileSync(`${HERE}/fields.json`, JSON.stringify(fields, null, 1) + '\n');

// The auxiliary record: every graded value with the row it came from, for the
// migration headers and the go-live. NOT for lessons.
const a = [];
a.push('IKPOTO capstone, engine ' + E.ENGINE_VERSION);
a.push('JV cfg: ' + JSON.stringify(JV));
a.push('PIA cfg: ' + JSON.stringify(PIA));
a.push('prod: ' + JSON.stringify(PROD)); a.push('capex: ' + JSON.stringify(CAPEX)); a.push('opex: ' + JSON.stringify(OPEX));
for (const [label, res] of [['JV real end-year', jv], ['JV real mid-year', jvMid], ['PIA', pia]]) {
  a.push(`--- ${label} rows`);
  for (const q of res.cashFlowData) a.push(JSON.stringify(q));
  a.push(`--- ${label} kpis`); a.push(JSON.stringify(res.kpis));
}
a.push('breakeven (JV real): ' + be);
a.push('--- fields'); for (const f of fields) a.push(JSON.stringify(f));
if (MAIN) fs.writeFileSync(`${HERE}/capstone_aux.txt`, a.join('\n') + '\n');
if (MAIN) console.log(JSON.stringify(fields, null, 0));
if (MAIN) console.log('PIA framework', pia.kpis.fiscal_framework, 'cap applied by year', pia.cashFlowData.map((q) => q.prod_alw_cap_applied), 'cpr deferred', pia.cashFlowData.map((q) => q.cpr_deferred_to_next), 'nominal flows', pia.cashFlowData.map((q) => Math.round(q.net_cash_flow)), 'irr', pia.kpis.irr);

export { E, PROD, CAPEX, OPEX, JV, PIA, fields };
