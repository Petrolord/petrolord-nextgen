// Key-truth checks for the cashflow Expert m05 and m06 rows this re-cut changes
// (see keytruth.mjs). Every value is a return of the engine, called through lib.mjs.
const W = (L) => L.golden('pia_worked_example');
const SF = (L) => L.golden('pia_sinking_fund');
const SF50 = (L) => L.golden('pia_sinking_fund_wi_50');
const AK = (L, p = {}) => L.run(L.withCfg(L.AKATA, p));
const AP = (L, p = {}) => L.run(L.withCfg(L.AKPIA, p));
const r29 = (res) => res.cashFlowData[0];
const DEEP = { pia_terrain: 'deep_offshore', pia_water_depth_m: 1200 };
const NEW30 = { pia_lease_status: 'new', pia_new_pml_hct_rate_pct: 30 };
const m5 = (o) => `advanced m05 ${o}`; const m6 = (o) => `advanced m06 ${o}`;
export default [
  // m05 8: TET on the sinking fund
  { q: m5(8), where: 'prompt', printed: '285784994.46', value: (L) => W(L).kpis.total_hct },
  { q: m5(8), where: 'prompt', printed: '276784994.46', value: (L) => SF(L).kpis.total_hct },
  { q: m5(8), where: 'prompt', printed: '299472494.46', value: (L) => W(L).kpis.total_cit },
  { q: m5(8), where: 'prompt', printed: '290472494.46', value: (L) => SF(L).kpis.total_cit },
  { q: m5(8), where: 'prompt', printed: '31747249.45', value: (L) => W(L).kpis.total_tet },
  { q: m5(8), where: 'key', printed: '30847249.45', value: (L) => SF(L).kpis.total_tet },
  { q: m5(8), where: 'key', printed: 'It falls by', value: (L) => (W(L).kpis.total_tet - SF(L).kpis.total_tet) / 30000000 === 0.03 || Math.abs((W(L).kpis.total_tet - SF(L).kpis.total_tet) / 30000000 - 0.03) < 1e-12 },
  { q: m5(8), where: 'option 0', printed: 'since the tax sits on the assessable profit', value: (L) => Math.abs((W(L).kpis.total_tet - SF(L).kpis.total_tet) / 30000000 - 0.025) > 1e-6 },
  { q: m5(8), where: 'explanation', printed: '1058241648.19', value: (L) => r29(W(L)).cit_assessable_profit },
  { q: m5(8), where: 'explanation', printed: '1028241648.19', value: (L) => r29(SF(L)).cit_assessable_profit },
  { q: m5(8), where: 'explanation', printed: '141236909.83', value: (L) => W(L).kpis.npv },
  { q: m5(8), where: 'explanation', printed: '130136909.83', value: (L) => SF(L).kpis.npv },
  { q: m5(8), where: 'explanation', printed: '28.082192', value: (L) => SF(L).kpis.unit_technical_cost_usd_per_boe },
  // m05 10: the fund collects the share entered
  { q: m5(10), where: 'prompt', printed: '59518454.92', value: (L) => SF50(L).kpis.npv },
  { q: m5(10), where: 'key', printed: 'exactly the amount that was entered', value: (L) => SF50(L).kpis.total_decom_fund_contributions === 30000000 && SF50(L).kpis.total_abandonment_cost === 30000000 },
  { q: m5(10), where: 'explanation', printed: '7713047.81', value: (L) => AK(L, { abandonment_cost_usd: 60000000, abandonment_funding_mode: 'sinking_fund', jv_working_interest_pct: 50 }).kpis.npv },
  { q: m5(10), where: 'explanation', printed: '14.1861', value: (L) => AK(L, { abandonment_cost_usd: 60000000, abandonment_funding_mode: 'sinking_fund', jv_working_interest_pct: 50 }).kpis.irr },
  // m05 15
  { q: m5(15), where: 'explanation', printed: '-29598201.95', value: (L) => { const r = AK(L, { abandonment_cost_usd: 60000000 }); return r.cashFlowData[r.cashFlowData.length - 1].net_cash_flow; } },
  { q: m5(15), where: 'explanation', printed: 'returns null', value: (L) => AK(L, { abandonment_cost_usd: 60000000 }).kpis.irr === null },
  // m06 1: the levy's base
  { q: m6(1), where: 'prompt', printed: '5653419.91', value: (L) => r29(AP(L)).dev_levy_tax },
  { q: m6(1), where: 'key', printed: '141335497.73', value: (L) => r29(AP(L)).cit_assessable_profit },
  { q: m6(1), where: 'key', printed: 'CIT assessable profit', value: (L) => Math.abs(r29(AP(L)).dev_levy_tax - 0.04 * r29(AP(L)).cit_assessable_profit) < 1e-6 },
  { q: m6(1), where: 'option 1', printed: '99335497.73', value: (L) => r29(AP(L)).cit_chargeable_profit },
  { q: m6(1), where: 'option 2', printed: '90695731.60', value: (L) => r29(AP(L)).hct_chargeable_profit },
  { q: m6(1), where: 'explanation', printed: 'TET is', value: (L) => r29(AP(L)).fiscal_framework === 'nta_2025' && r29(AP(L)).tet_tax === 0 },
  // m06 2: the pool is printed per row
  { q: m6(2), where: 'key', printed: 'psc_cost_pool_after', value: (L) => { const r = AK(L, { fiscal_regime: 'PSC', psc_royalty_pct: 10, psc_cost_oil_cap_pct: 60, psc_contractor_profit_share_pct: 45, psc_tax_rate_pct: 50, psc_working_interest_pct: 100 }); return r.cashFlowData[0].psc_cost_pool_after === 133542720 && r.cashFlowData[5].psc_cost_pool_after === 0; } },
  { q: m6(2), where: 'prompt', printed: '29960298.75', value: (L) => AK(L, { fiscal_regime: 'PSC', psc_royalty_pct: 10, psc_cost_oil_cap_pct: 60, psc_contractor_profit_share_pct: 45, psc_tax_rate_pct: 50, psc_working_interest_pct: 100 }).kpis.npv },
  { q: m6(2), where: 'explanation', printed: '207346412.26', value: (L) => AK(L, { fiscal_regime: 'PSC', psc_royalty_pct: 10, psc_cost_oil_cap_pct: 30, psc_contractor_profit_share_pct: 45, psc_tax_rate_pct: 50, psc_working_interest_pct: 100 }).kpis.psc_unrecovered_cost_at_cessation },
  // m06 3: royalty rates by terrain
  { q: m6(3), where: 'key', printed: '0.054167', value: (L) => L.E.deriveOilRoyaltyRate('deep_offshore', 60000) },
  { q: m6(3), where: 'prompt', printed: '0.050000', value: (L) => L.E.deriveOilRoyaltyRate('deep_offshore', 50000) },
  { q: m6(3), where: 'explanation', printed: '0.062500', value: (L) => L.E.deriveOilRoyaltyRate('shallow_water', 10000) },
  { q: m6(3), where: 'explanation', printed: '0.112500', value: (L) => L.E.deriveOilRoyaltyRate('shallow_water', 50000) },
  { q: m6(3), where: 'explanation', printed: '0.075000', value: (L) => L.E.deriveOilRoyaltyRate('frontier', 1000) },
  { q: m6(3), where: 'option 0', printed: 'marginal field', value: (L) => { try { L.E.deriveOilRoyaltyRate('marginal_field', 1000); return false; } catch { return true; } } },
  // m06 4: price royalty on the Regulations base
  { q: m6(4), where: 'key', printed: '0.023910', value: (L) => L.E.derivePriceRoyaltyRate(80, 2025, 'shallow_water') },
  { q: m6(4), where: 'key', printed: '0.010632', value: (L) => L.E.derivePriceRoyaltyRate(80, 2035, 'shallow_water') },
  { q: m6(4), where: 'option 0', printed: '0.030000', value: (L) => L.E.derivePriceRoyaltyRate(80, 2021, 'shallow_water') },
  { q: m6(4), where: 'explanation', printed: 'the royalty is gone by', value: (L) => L.E.derivePriceRoyaltyRate(60, 2031, 'shallow_water') === 0 && L.E.derivePriceRoyaltyRate(60, 2030, 'shallow_water') > 0 && (L.E.priceRoyaltyBenchmarks(2031).low > 60) },
  { q: m6(4), where: 'explanation', printed: '0.100000', value: (L) => L.E.derivePriceRoyaltyRate(200, 2035, 'shallow_water') },
  { q: m6(4), where: 'key', printed: 'falls every year', value: (L) => { for (const b of ['regulations_2021', 'act_2020']) for (let y = 2022; y <= 2035; y += 1) if (!(L.E.derivePriceRoyaltyRate(80, y, 'shallow_water', b) < L.E.derivePriceRoyaltyRate(80, y - 1, 'shallow_water', b))) return false; return true; } },
  // m06 5: terrain moves the liquids rate and the HCT rate
  { q: m6(5), where: 'prompt', printed: '59766796.57', value: (L) => AP(L).kpis.npv },
  { q: m6(5), where: 'prompt', printed: '136554243.51', value: (L) => AP(L, { ...DEEP, pia_deep_offshore_hct_interpretation: 'conservative_zero' }).kpis.npv },
  { q: m6(5), where: 'key', printed: '0.054261', value: (L) => r29(AP(L)).royalty_rate_liquids },
  { q: m6(5), where: 'key', printed: '0.050000', value: (L) => r29(AP(L, { ...DEEP, pia_deep_offshore_hct_interpretation: 'conservative_zero' })).royalty_rate_liquids },
  { q: m6(5), where: 'key', printed: '0.300000', value: (L) => r29(AP(L)).hct_rate },
  { q: m6(5), where: 'explanation', printed: '60060654.75', value: (L) => AP(L, { ...DEEP, pia_deep_offshore_hct_interpretation: 'aggressive_pml_30' }).kpis.npv },
  { q: m6(5), where: 'explanation', printed: '59503845.87', value: (L) => AP(L, { ...DEEP, pia_deep_offshore_hct_interpretation: 'aggressive_pml_30' }).kpis.total_royalties },
  // m06 6: two stated readings, neither keyed
  { q: m6(6), where: 'prompt', printed: '60060654.75', value: (L) => AP(L, { ...DEEP, pia_deep_offshore_hct_interpretation: 'aggressive_pml_30' }).kpis.npv },
  { q: m6(6), where: 'prompt', printed: '136554243.51', value: (L) => AP(L, { ...DEEP, pia_deep_offshore_hct_interpretation: 'conservative_zero' }).kpis.npv },
  { q: m6(6), where: 'key', printed: 'stated reading of the deep offshore HCT', value: (L) => { const a = AP(L, { ...DEEP, pia_deep_offshore_hct_interpretation: 'aggressive_pml_30' }); const c = AP(L, { ...DEEP, pia_deep_offshore_hct_interpretation: 'conservative_zero' }); return a.kpis.total_royalties === c.kpis.total_royalties && r29(a).hct_rate === 0.3 && r29(c).hct_rate === 0; } },
  { q: m6(6), where: 'explanation', printed: 'refuses a deep offshore NTA year', value: (L) => { try { AP(L, DEEP); return false; } catch { return true; } } },
  // m06 7: the allowance after the cap
  { q: m6(7), where: 'prompt', printed: '17600000.00', value: (L) => r29(AP(L, { ...NEW30, pia_prior_cumulative_oil_bbl: 96000000 })).production_allowance },
  { q: m6(7), where: 'key', printed: '77440000.00', value: (L) => AP(L, NEW30).kpis.total_production_allowance },
  { q: m6(7), where: 'key', printed: '54720000.00', value: (L) => AP(L, { ...NEW30, pia_prior_cumulative_oil_bbl: 96000000 }).kpis.total_production_allowance },
  { q: m6(7), where: 'explanation', printed: 'does not depend on the stated rate', value: (L) => AP(L, { ...NEW30, pia_prior_cumulative_oil_bbl: 96000000, pia_new_pml_hct_rate_pct: 15 }).kpis.total_production_allowance === AP(L, { ...NEW30, pia_prior_cumulative_oil_bbl: 96000000 }).kpis.total_production_allowance },
  { q: m6(7), where: 'explanation', printed: '24200000.00', value: (L) => AP(L).kpis.total_production_allowance },
  // m06 8: the capital allowance
  { q: m6(8), where: 'prompt', printed: '141335497.73', value: (L) => r29(AP(L)).cit_assessable_profit },
  { q: m6(8), where: 'prompt', printed: '99335497.73', value: (L) => r29(AP(L)).cit_chargeable_profit },
  { q: m6(8), where: 'key', printed: 'The capital allowance', value: (L) => r29(AP(L)).cit_allowance_claimed === 210000000 / 5 },
  { q: m6(8), where: 'option 2', printed: '27208719.48', value: (L) => r29(AP(L)).hct_tax },
  { q: m6(8), where: 'option 2', printed: '7020000.00', value: (L) => r29(AP(L)).nddc },
  { q: m6(8), where: 'explanation', printed: '29800649.32', value: (L) => r29(AP(L)).cit_tax },
  { q: m6(8), where: 'explanation', printed: 'has none', value: (L) => r29(AP(L)).cit_allowance_restricted === false && r29(AP(L)).fiscal_framework === 'nta_2025' },
  // m06 9
  { q: m6(9), where: 'prompt', printed: '14120774.92', value: (L) => L.row(AP(L), 2033).cpr_deferred_to_next },
  { q: m6(9), where: 'option 1', printed: '14120774.92', value: (L) => L.row(AP(L), 2033).cpr_deferred_to_next },
  // m06 11: no default reading
  { q: m6(11), where: 'prompt', printed: '136554243.51', value: (L) => AP(L, { ...DEEP, pia_deep_offshore_hct_interpretation: 'conservative_zero' }).kpis.npv },
  { q: m6(11), where: 'key', printed: 'refuses the run until a reading is stated', value: (L) => { try { AP(L, DEEP); return false; } catch (e) { return /pia_deep_offshore_hct_interpretation/.test(e.message); } } },
  // m06 12
  { q: m6(12), where: 'explanation', printed: '153901708.13', value: (L) => AP(L, { oil_price_usd_bbl: 120 }).kpis.npv },
  // m06 14
  { q: m6(14), where: 'prompt', printed: '72534830.66', value: (L) => AK(L).kpis.npv },
  { q: m6(14), where: 'option 3', printed: '70.6449', value: (L) => AP(L, { pia_working_interest_pct: 50 }).kpis.government_take_pct },
  // m06 15: the CPR limit at 40
  { q: m6(15), where: 'key', printed: '37056190.44', value: (L) => AP(L, { pia_cpr_limit_pct: 40 }).kpis.npv },
  { q: m6(15), where: 'key', printed: 'moves NPV further', value: (L) => { const b = AP(L).kpis.npv; return AP(L, { oil_price_usd_bbl: 120 }).kpis.npv - b > b - AP(L, { pia_cpr_limit_pct: 40 }).kpis.npv; } },
  { q: m6(15), where: 'option 0', printed: '29883398.29', value: (L) => AP(L, { pia_working_interest_pct: 50 }).kpis.npv },
  { q: m6(15), where: 'option 3', printed: '97891150.04', value: (L) => AP(L, { pia_marginal_field_pre_2021: true }).kpis.npv },
  { q: m6(15), where: 'explanation', printed: '121989085.43', value: (L) => AP(L, { pia_cpr_limit_pct: 40 }).kpis.total_hct },
  { q: m6(15), where: 'explanation', printed: '91654840.32', value: (L) => AP(L).kpis.total_hct },
  { q: m6(15), where: 'explanation', printed: '102166298.31', value: (L) => AP(L, { pia_cpr_limit_pct: 40 }).kpis.total_cit },
  { q: m6(15), where: 'explanation', printed: 'while CIT stays', value: (L) => AP(L, { pia_cpr_limit_pct: 40 }).kpis.total_cit === AP(L).kpis.total_cit },
];
