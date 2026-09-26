// Key-truth checks for the cashflow Expert m03 (hydrocarbon tax) rows this
// re-cut changes. Every value is a return of the engine through lib.mjs.
const g = (L, n) => L.golden(n);
const r0 = (L, n) => L.golden(n).cashFlowData[0];
const ak = (L, patch = {}) => L.run(L.withCfg(L.AKPIA, patch));
const aky = (L, y, patch = {}) => L.row(ak(L, patch), y);
const newLease = (L, prior) => ak(L, { pia_lease_status: 'new', pia_new_pml_hct_rate_pct: 30, pia_prior_cumulative_oil_bbl: prior });
const alw = (L, lease, bbl, price, prior, fw = 'pia_only') => L.E.computeProductionAllowance(
  { ...L.casePIA('pia_worked_example').cfg, pia_lease_status: lease, pia_terrain: 'shallow_water' }, bbl, price, prior, fw).allowance;
const refused = (L, patch) => L.refusal(L.withCfg(L.casePIA('pia_worked_example'), patch));
export default [
  // ord 2
  { q: 'advanced m03 2', where: 'prompt', printed: '2400000.00', value: (L) => r0(L, 'pia_onshore_new_lease').nddc },
  { q: 'advanced m03 2', where: 'prompt', printed: '50000000.00', value: (L) => r0(L, 'pia_onshore_new_lease').capex },
  { q: 'advanced m03 2', where: 'explanation', printed: '7020000.00', value: (L) => aky(L, 2029).nddc },
  { q: 'advanced m03 2', where: 'explanation', printed: '2091600.00', value: (L) => aky(L, 2030).nddc },
  { q: 'advanced m03 2', where: 'explanation', printed: '763848.00', value: (L) => aky(L, 2031).nddc },
  { q: 'advanced m03 2', where: 'key', printed: '15000000', value: (L) => r0(L, 'pia_worked_example').nddc },
  // ord 3
  { q: 'advanced m03 3', where: 'prompt', printed: '285784994.46', value: (L) => r0(L, 'pia_worked_example').hct_tax },
  { q: 'advanced m03 3', where: 'prompt', printed: '287314994.46', value: (L) => r0(L, 'pia_prior_year_opex_zero').hct_tax },
  { q: 'advanced m03 3', where: 'prompt', printed: '141236909.83', value: (L) => g(L, 'pia_worked_example').kpis.npv },
  { q: 'advanced m03 3', where: 'prompt', printed: '143123909.83', value: (L) => g(L, 'pia_prior_year_opex_zero').kpis.npv },
  { q: 'advanced m03 3', where: 'explanation', printed: '1063341648.19', value: (L) => r0(L, 'pia_prior_year_opex_zero').cit_assessable_profit },
  { q: 'advanced m03 3', where: 'key', printed: 'deductible from both bases', value: (L) => {
    const a = r0(L, 'pia_worked_example'); const b = r0(L, 'pia_prior_year_opex_zero');
    return Math.abs((b.hct_assessable_profit - a.hct_assessable_profit) - 5100000) < 1e-6 && Math.abs((b.cit_assessable_profit - a.cit_assessable_profit) - 5100000) < 1e-6
      && b.tet_tax > a.tet_tax && b.cit_tax > a.cit_tax; } },
  // ord 4 (keyed answer re-derived)
  { q: 'advanced m03 4', where: 'prompt', printed: '1058241648.19', value: (L) => r0(L, 'pia_worked_example').hct_assessable_profit },
  { q: 'advanced m03 4', where: 'key', printed: 'the two assessable profits agree', value: (L) => { const r = r0(L, 'pia_worked_example'); return r.hct_assessable_profit === r.cit_assessable_profit && r.nddc === 15000000; } },
  { q: 'advanced m03 4', where: 'explanation', printed: '952616648.19', value: (L) => r0(L, 'pia_worked_example').hct_chargeable_profit },
  { q: 'advanced m03 4', where: 'explanation', printed: '998241648.19', value: (L) => r0(L, 'pia_worked_example').cit_chargeable_profit },
  { q: 'advanced m03 4', where: 'option 1', printed: '31747249.45', value: (L) => r0(L, 'pia_worked_example').tet_tax },
  // ord 5
  { q: 'advanced m03 5', where: 'key', printed: '438000000.00', value: (L) => r0(L, 'pia_worked_example').gross_revenue * 0.30 },
  { q: 'advanced m03 5', where: 'prompt', printed: '141236909.83', value: (L) => L.run(L.withCfg(L.casePIA('pia_worked_example'), { pia_cpr_limit_pct: 30 })).kpis.npv },
  { q: 'advanced m03 5', where: 'explanation', printed: '73531102.32', value: (L) => aky(L, 2032).cpr_cap },
  { q: 'advanced m03 5', where: 'explanation', printed: '1356394.56', value: (L) => aky(L, 2032).cpr_deferred_to_next },
  // ord 6
  { q: 'advanced m03 6', where: 'prompt', printed: '512786.40', value: (L) => r0(L, 'cpr_forfeiture').hct_loss_carryforward },
  { q: 'advanced m03 6', where: 'key', printed: '8000000.00', value: (L) => g(L, 'cpr_forfeiture').kpis.cpr_forfeited_at_cessation },
  { q: 'advanced m03 6', where: 'explanation', printed: '66000000.00', value: (L) => g(L, 'pia_cpr_carry_two_years').kpis.cpr_forfeited_at_cessation },
  // ord 7
  { q: 'advanced m03 7', where: 'prompt', printed: '14120774.92', value: (L) => aky(L, 2033).cpr_deferred_to_next },
  { q: 'advanced m03 7', where: 'prompt', printed: '121989085.43', value: (L) => ak(L, { pia_cpr_limit_pct: 40 }).kpis.total_hct },
  { q: 'advanced m03 7', where: 'prompt', printed: '91654840.32', value: (L) => ak(L).kpis.total_hct },
  { q: 'advanced m03 7', where: 'prompt', printed: '37056190.44', value: (L) => ak(L, { pia_cpr_limit_pct: 40 }).kpis.npv },
  { q: 'advanced m03 7', where: 'explanation', printed: '54139706.27', value: (L) => aky(L, 2034).cpr_cap },
  { q: 'advanced m03 7', where: 'explanation', printed: '49828572.67', value: (L) => aky(L, 2034).cpr_costs_claimed },
  { q: 'advanced m03 7', where: 'explanation', printed: '102166298.31', value: (L) => ak(L, { pia_cpr_limit_pct: 40 }).kpis.total_cit },
  { q: 'advanced m03 7', where: 'explanation', printed: 'still deferred when the field stops', value: (L) => ak(L, { pia_cpr_limit_pct: 40 }).kpis.cpr_forfeited_at_cessation > 101e6 },
  // ord 9
  { q: 'advanced m03 9', where: 'prompt', printed: '6000000.00', value: (L) => alw(L, 'new', 1000000, 80, 99500000) },
  { q: 'advanced m03 9', where: 'prompt', printed: '4000000.00', value: (L) => alw(L, 'new', 1000000, 80, 100000000) },
  { q: 'advanced m03 9', where: 'explanation', printed: '12000000.00', value: (L) => r0(L, 'allowance_cap_midyear').production_allowance },
  { q: 'advanced m03 9', where: 'explanation', printed: '101000000.00', value: (L) => r0(L, 'allowance_cap_midyear').cumulative_oil_bbl_lifetime },
  // ord 10
  { q: 'advanced m03 10', where: 'prompt', printed: '54720000.00', value: (L) => newLease(L, 96000000).kpis.total_production_allowance },
  { q: 'advanced m03 10', where: 'prompt', printed: '77440000.00', value: (L) => newLease(L, 0).kpis.total_production_allowance },
  { q: 'advanced m03 10', where: 'explanation', printed: '75682840.32', value: (L) => newLease(L, 0).kpis.total_hct },
  { q: 'advanced m03 10', where: 'explanation', printed: '82498840.32', value: (L) => newLease(L, 96000000).kpis.total_hct },
  { q: 'advanced m03 10', where: 'key', printed: 'after-cap rate', value: (L) => { const r = newLease(L, 96000000); return L.row(r, 2029).prod_alw_after_cap_bbl === 0 && L.row(r, 2031).prod_alw_after_cap_bbl > 0 && L.row(r, 2031).production_allowance > 0; } },
  // ord 11
  { q: 'advanced m03 11', where: 'prompt', printed: '15420000.00', value: (L) => r0(L, 'pia_gas_only_hct_zero').cit_tax },
  { q: 'advanced m03 11', where: 'prompt', printed: '51400000.00', value: (L) => r0(L, 'pia_gas_only_hct_zero').cit_chargeable_profit },
  { q: 'advanced m03 11', where: 'explanation', printed: '18318000.00', value: (L) => g(L, 'pia_gas_only_legacy_hct').kpis.npv },
  { q: 'advanced m03 11', where: 'key', printed: 'crude oil and condensate only', value: (L) => r0(L, 'pia_gas_only_legacy_hct').hct_tax === 0 && r0(L, 'pia_gas_only_hct_zero').cit_tax > 0 },
  // ord 12
  { q: 'advanced m03 12', where: 'prompt', printed: '142892497.23', value: (L) => r0(L, 'pia_ppl_license').hct_tax },
  { q: 'advanced m03 12', where: 'prompt', printed: '284129407.06', value: (L) => g(L, 'pia_ppl_license').kpis.npv },
  { q: 'advanced m03 12', where: 'explanation', printed: '70.9331', value: (L) => g(L, 'pia_ppl_license').kpis.government_take_pct },
  { q: 'advanced m03 12', where: 'explanation', printed: '85.5512', value: (L) => g(L, 'pia_worked_example').kpis.government_take_pct },
  { q: 'advanced m03 12', where: 'explanation', printed: 'in every year under force_pia and on auto', value: (L) => ak(L, { pia_under_nta_2025_override: 'force_pia' }).cashFlowData.every((q) => q.hct_rate === 0.3) && ak(L).cashFlowData.every((q) => q.hct_rate === 0.3) },
  // ord 13 (keyed answer re-derived)
  { q: 'advanced m03 13', where: 'prompt', printed: '907723685.14', value: (L) => g(L, 'pia_deep_offshore_full').kpis.npv },
  { q: 'advanced m03 13', where: 'prompt', printed: '426107993.35', value: (L) => r0(L, 'pia_deep_offshore_nta_aggressive').hct_tax },
  { q: 'advanced m03 13', where: 'prompt', printed: '466664592.02', value: (L) => g(L, 'pia_deep_offshore_nta_aggressive').kpis.npv },
  { q: 'advanced m03 13', where: 'prompt', printed: '177544997.23', value: (L) => r0(L, 'pia_deep_offshore_nta_custom').hct_tax },
  { q: 'advanced m03 13', where: 'prompt', printed: '715227588.14', value: (L) => g(L, 'pia_deep_offshore_nta_custom').kpis.npv },
  { q: 'advanced m03 13', where: 'key', printed: 'refuses the year until a reading is stated', value: (L) => {
    const full = r0(L, 'pia_deep_offshore_full');
    const msg = L.refusal(L.withCfg(L.casePIA('pia_deep_offshore_full'), { pia_under_nta_2025_override: 'force_nta', pia_deep_offshore_hct_interpretation: null }));
    return full.fiscal_framework === 'pia_only' && full.hct_tax === 0 && typeof msg === 'string' && msg.includes('needs pia_deep_offshore_hct_interpretation'); } },
  { q: 'advanced m03 13', where: 'explanation', printed: '136554243.51', value: (L) => ak(L, { pia_terrain: 'deep_offshore', pia_deep_offshore_hct_interpretation: 'conservative_zero' }).kpis.npv },
  { q: 'advanced m03 13', where: 'explanation', printed: '60060654.75', value: (L) => ak(L, { pia_terrain: 'deep_offshore', pia_deep_offshore_hct_interpretation: 'aggressive_pml_30' }).kpis.npv },
  { q: 'advanced m03 13', where: 'explanation', printed: '153901708.13', value: (L) => ak(L, { oil_price_usd_bbl: 120 }).kpis.npv },
  // ord 14
  { q: 'advanced m03 14', where: 'prompt', printed: '13987213.60', value: (L) => r0(L, 'cpr_forfeiture').cit_assessable_profit },
  { q: 'advanced m03 14', where: 'prompt', printed: '4662404.53', value: (L) => r0(L, 'cpr_forfeiture').cit_chargeable_profit },
  { q: 'advanced m03 14', where: 'prompt', printed: '1398721.36', value: (L) => r0(L, 'cpr_forfeiture').cit_tax },
  { q: 'advanced m03 14', where: 'key', printed: '10675190.93', value: (L) => r0(L, 'cpr_forfeiture').cit_allowance_carryforward },
  { q: 'advanced m03 14', where: 'explanation', printed: '-102455984.11', value: (L) => g(L, 'pia_cit_allowance_restricted_carry').kpis.npv },
  { q: 'advanced m03 14', where: 'explanation', printed: '-116276490.72', value: (L) => g(L, 'pia_cit_allowance_no_carry').kpis.npv },
  // ord 15 (keyed answer re-derived)
  { q: 'advanced m03 15', where: 'prompt', printed: '141236909.83', value: (L) => L.run(L.withCfg(L.casePIA('pia_worked_example'), { pia_capex_recovery_years: 5 })).kpis.npv },
  { q: 'advanced m03 15', where: 'key', printed: 'fix the capital allowance at five years', value: (L) => [1, 10].every((y) => (refused(L, { pia_capex_recovery_years: y }) || '').includes('fix the capital allowance at five years')) },
  { q: 'advanced m03 15', where: 'explanation', printed: '242500000.00', value: (L) => r0(L, 'pia_worked_example').cpr_costs_claimed },
];
