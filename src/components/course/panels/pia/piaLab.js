// THE EC7 TEACHING LAB: Petroleum Industry Act 2021 & Nigerian Fiscal Terms.
//
// Every number this lab returns is a return value of the vendored engine
// (packages/engines/engines/economics/cashflow.ts, the default path of
// ENGINE_VERSION 3.12.0, sha-identical with petrolord-engines 3778451) on the
// INPUTS of the Ekene synthetic cases in the vendored golden file
// packages/engines/test-data/economics/goldens/pia2021_cases.json, or on the
// terms and rows a learner types into a calculator panel. The golden file's
// expected figures are oracle output and this lab never reads them: DATASET
// carries the inputs only. piaLab.test.js asserts that every number a teaching
// reader returns is printed in the teaching digest.
//
// THIS IS AN ENGINE COURSE. There is no Suite app: the course's practicals run
// in the three calculator panels this lab feeds.
//
// THE LAB NEVER READS THE CAPSTONE. It holds no graded answer, no tolerance and
// no capstone case, and panelCapstoneGuard.test.js greps this file, the three
// panels and the learning page for every rendering of all eighteen answers and
// every capstone name, label and distinctive input.
//
// NO REFUSAL MESSAGE IS WRITTEN HERE. The engine refuses by throwing; every
// route catches the throw and returns { error } holding the engine's own
// message, so the lesson that quotes it and the panel agree.
//
// Nothing here reads a clock, a random number or a locale.
import GOLD from '@petrolord/engines/test-data/economics/goldens/pia2021_cases.json';
import {
  ENGINE_VERSION, computeCashFlow,
  deriveOilRoyaltyRate, deriveGasRoyaltyRate, derivePriceRoyaltyRate, priceRoyaltyBenchmarks,
  deriveHctRate, computeProductionAllowance, capitalAllowanceFraction, statutoryTetRatePct,
  fiscalFrameworkForYear, calendarDays,
  PIA_TEXTS, PIA_TERRAINS, PIA_NOTES, NTA_FIRST_YEAR,
} from '@petrolord/engines/engines/economics/cashflow.ts';
import { FISCAL_METRICS, GOVERNMENT_CASH_FLOW } from '@petrolord/engines/engines/economics/fiscalConventions.js';

export {
  ENGINE_VERSION, PIA_TEXTS, PIA_TERRAINS, PIA_NOTES, NTA_FIRST_YEAR, FISCAL_METRICS, GOVERNMENT_CASH_FLOW,
};

const clone = (o) => JSON.parse(JSON.stringify(o));

/** The Ekene teaching cases: the golden file's INPUTS only, never its expected figures. */
export const DATASET = Object.freeze(Object.fromEntries(GOLD.cases.map((c) => [c.name, Object.freeze({
  cfg: c.cfg, prodRows: c.prodRows, capexRows: c.capexRows, opexRows: c.opexRows,
})])));
export const CASE_NAMES = Object.keys(DATASET);

/* ------------------------------------------------ what a learner can type */

/** A single number from a text box; a blank box is undefined, never zero. */
export const parseNumber = (text) => {
  if (text === '' || text === null || text === undefined) return undefined;
  const v = Number(text);
  return Number.isFinite(v) ? v : NaN;
};

/** JSON a learner pastes (a case: cfg, prodRows, capexRows, opexRows). Returns { value } or { error }. */
export const parseJson = (text) => {
  if (typeof text !== 'string' || text.trim() === '') return { error: 'the box is empty' };
  try {
    return { value: JSON.parse(text) };
  } catch (e) {
    return { error: `the box does not hold valid JSON (${e.message})` };
  }
};

/** Pretty JSON for a text box a learner edits. */
export const pretty = (v) => JSON.stringify(v, null, 1);

/** Run an engine function; a refusal comes back as { error } with the engine's own message. */
const guard = (fn) => {
  try {
    return { value: fn() };
  } catch (e) {
    return { error: String(e && e.message ? e.message : e) };
  }
};

// The interactive routes are the engine's own functions, unchanged.
export const ledgerOf = (c) => guard(() => computeCashFlow({
  cfg: clone(c.cfg || {}), prodRows: clone(c.prodRows || []), capexRows: clone(c.capexRows || []), opexRows: clone(c.opexRows || []),
}));
export const oilRateOf = (terrain, bopd) => guard(() => deriveOilRoyaltyRate(terrain, bopd));
export const gasRateOf = (terrain, share) => guard(() => deriveGasRoyaltyRate(terrain, share));
export const benchmarksOf = (year, base) => guard(() => priceRoyaltyBenchmarks(year, base));
export const priceRateOf = (price, year, terrain, base) => guard(() => derivePriceRoyaltyRate(price, year, terrain, base));
export const hctRateOf = (a) => guard(() => deriveHctRate(a.terrain, a.licenseType, a.marginal === true, a.override ?? null,
  a.framework, a.interpretation ?? null, a.customRatePct ?? null, a.leaseStatus, a.newPmlRatePct ?? null));
export const allowanceOf = (a) => guard(() => computeProductionAllowance(
  { pia_lease_status: a.leaseStatus, pia_terrain: a.terrain }, a.barrels, a.price, a.prior, a.framework));
export const capitalFractionOf = (i, framework) => capitalAllowanceFraction(i, framework);
export const tetRateOf = (year) => statutoryTetRatePct(year);
export const frameworkOf = (override, year) => guard(() => fiscalFrameworkForYear({ pia_under_nta_2025_override: override }, year));
export const daysOf = (year) => calendarDays(year);

/** A case with one change of terms: the base run, the changed run, and their totals by provision. */
export const TOTAL_KEYS = ['total_royalties', 'total_hct', 'total_cit', 'total_tet', 'total_dev_levy', 'total_hcdt', 'total_nddc'];
export const compareOf = (c, patch) => {
  const a = ledgerOf(c);
  const b = ledgerOf({ ...c, cfg: { ...clone(c.cfg || {}), ...clone(patch || {}) } });
  if (a.error || b.error) return { error: a.error || b.error };
  const lines = TOTAL_KEYS.map((k) => ({ key: k, base: a.value.kpis[k] ?? 0, changed: b.value.kpis[k] ?? 0 }));
  return { value: { lines, baseTake: a.value.kpis.government_take_pct, changedTake: b.value.kpis.government_take_pct } };
};

/* ------------------------------------------------- the teaching readers */

const run = (name, patch = {}) => computeCashFlow({
  cfg: { ...clone(DATASET[name].cfg), ...patch }, prodRows: clone(DATASET[name].prodRows),
  capexRows: clone(DATASET[name].capexRows), opexRows: clone(DATASET[name].opexRows),
});
const row = (r, y) => r.cashFlowData.find((d) => d.year === y);

export const TRANCHE_EDGES = [1, 4999, 5000, 5001, 7500, 9999, 10000, 10001, 20000, 49999, 50000, 50001, 60000, 120000];

/** Associate: the tranche boundary table, every terrain at every edge. */
export const tranchesReader = () => TRANCHE_EDGES.map((bopd) => ({
  bopd, rates: Object.fromEntries(PIA_TERRAINS.map((t) => [t, deriveOilRoyaltyRate(t, bopd)])),
}));

/** Associate: the benchmarks on both bases, 2019 to 2032. */
export const benchmarksReader = () => Array.from({ length: 14 }, (_, i) => 2019 + i).map((year) => ({
  year, regulations: priceRoyaltyBenchmarks(year, 'regulations_2021'), act: priceRoyaltyBenchmarks(year, 'act_2020'),
}));

/** Associate: Ekene Alpha's royalty lines and its take, at 100 and at 50 percent. */
export const alphaReader = () => {
  const r = run('ekene_alpha_shallow_converted_nta');
  const h = run('ekene_alpha_wi_50');
  return {
    rows: r.cashFlowData.map((d) => ({
      year: d.year, bopd: d.royalty_liquids_bopd, liquidsRate: d.royalty_rate_liquids, liquidsRoyalty: d.liquids_production_royalty,
      gasRoyalty: d.gas_royalty, priceRoyalty: d.price_royalty, totalRoyalty: d.royalty,
    })),
    take: r.kpis.government_take_pct,
    takeAtHalf: h.kpis.government_take_pct,
  };
};

/** Associate: the worked example inputs in 2025, the instruments stacked. */
export const workedExampleReader = () => {
  const d = row(run('worked_example_inputs_default'), 2025);
  return {
    grossRevenue: d.gross_revenue, liquidsRate: d.royalty_rate_liquids, liquidsRoyalty: d.liquids_production_royalty,
    priceRoyalty: d.price_royalty, totalRoyalty: d.royalty, hcdt: d.hcdt, hctChargeableProfit: d.hct_chargeable_profit,
    hct: d.hct_tax, citAssessableProfit: d.cit_assessable_profit, cit: d.cit_tax, tet: d.tet_tax, totalTax: d.tax, netCashFlow: d.net_cash_flow,
  };
};

/** Professional: the case where the cost price ratio binds, carries and is forfeited. */
export const cprReader = () => {
  const r = run('ekene_cpr_binding_forfeiture');
  return {
    rows: r.cashFlowData.map((d) => ({ year: d.year, cap: d.cpr_cap, claimed: d.cpr_costs_claimed, carried: d.cpr_deferred_to_next })),
    forfeited: r.kpis.cpr_forfeited_at_cessation,
  };
};

/** Professional: the new onshore lease crossing the allowance cap. */
export const capCrossingReader = () => run('ekene_onshore_new_cap_crossing').cashFlowData.map((d) => ({
  year: d.year, below: d.prod_alw_below_cap_bbl, after: d.prod_alw_after_cap_bbl, allowance: d.production_allowance,
}));

/** Expert: one onshore ledger across 1 January 2026. */
export const acrossReader = () => {
  const r = run('ekene_onshore_across_2026');
  return {
    framework: r.kpis.fiscal_framework,
    ntaFirstYear: r.kpis.nta_first_year,
    rows: r.cashFlowData.map((d) => ({ year: d.year, framework: d.fiscal_framework, tetRatePct: d.tet_rate_pct, tet: d.tet_tax, levy: d.dev_levy_tax })),
  };
};

/** Expert: the deep offshore lease under the three readings. */
export const deepReader = () => {
  const c = run('ekene_deep_new_60k_conservative');
  const a = run('ekene_deep_new_60k_aggressive');
  return c.cashFlowData.map((d, i) => ({
    year: d.year, framework: d.fiscal_framework, allowance: d.production_allowance, chargeable: d.hct_chargeable_profit,
    hctConservative: d.hct_tax, hctAggressive: a.cashFlowData[i].hct_tax, cit: d.cit_tax,
  }));
};

/** Expert: the decommissioning fund with and without the escrow condition. */
export const escrowReader = () => {
  const m = run('ekene_sinking_fund_nta_escrow_met');
  const n = run('ekene_sinking_fund_nta_escrow_not_met');
  return m.cashFlowData.map((d, i) => ({
    year: d.year, contribution: d.decom_fund_contribution, deductionMet: d.decom_fund_deduction, citMet: d.cit_tax,
    deductionNotMet: n.cashFlowData[i].decom_fund_deduction, citNotMet: n.cashFlowData[i].cit_tax,
  }));
};

/** A handful of the engine's refusals, for a panel that shows what a refusal looks like. */
export const refusalSamples = () => {
  const alpha = DATASET.ekene_alpha_shallow_converted_nta;
  const deep = DATASET.ekene_deep_new_60k_conservative;
  const noInterp = clone(deep.cfg); delete noInterp.pia_deep_offshore_hct_interpretation;
  const newLease = DATASET.ekene_onshore_new_cap_crossing;
  const noRate = clone(newLease.cfg); delete noRate.pia_new_pml_hct_rate_pct;
  return [
    { what: 'pia_license_type "OML"', ...ledgerOf({ ...alpha, cfg: { ...clone(alpha.cfg), pia_license_type: 'OML' } }) },
    { what: 'pia_terrain "offshore"', ...ledgerOf({ ...alpha, cfg: { ...clone(alpha.cfg), pia_terrain: 'offshore' } }) },
    { what: 'a new-acreage onshore lease with no pia_new_pml_hct_rate_pct', ...ledgerOf({ ...newLease, cfg: noRate }) },
    { what: 'a deep offshore NTA year with no pia_deep_offshore_hct_interpretation', ...ledgerOf({ ...deep, cfg: noInterp }) },
    { what: 'pia_gas_in_country_share_pct 120', ...ledgerOf({ ...alpha, cfg: { ...clone(alpha.cfg), pia_gas_in_country_share_pct: 120 } }) },
  ].map(({ what, error }) => ({ what, error }));
};
