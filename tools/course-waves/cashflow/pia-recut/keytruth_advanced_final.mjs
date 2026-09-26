// Key-truth checks for the cashflow Expert FINAL exam rows this re-cut changes.
// Every value is a return of the vendored engine, called through lib.mjs.
const Q = (o) => `advanced final ${o}`;
const r0 = (L, n) => L.golden(n).cashFlowData[0];
const ak = (L, patch = {}) => L.run(L.withCfg(L.AKPIA, patch));
const akRow = (L, y, patch) => L.row(ak(L, patch), y);
const deepCons = { pia_terrain: 'deep_offshore', pia_deep_offshore_hct_interpretation: 'conservative_zero' };
const deepAgg = { pia_terrain: 'deep_offshore', pia_deep_offshore_hct_interpretation: 'aggressive_pml_30' };
const newLease = (prior) => ({ pia_lease_status: 'new', pia_new_pml_hct_rate_pct: 30, pia_prior_cumulative_oil_bbl: prior });
const marginal = { pia_marginal_field_pre_2021: true };
export default [
  // ord 2: weighted deep offshore royalty
  { q: Q(2), where: 'prompt', printed: '0.054167', value: (L) => L.E.deriveOilRoyaltyRate('deep_offshore', 60000) },
  { q: Q(2), where: 'prompt', printed: '0.050000', value: (L) => L.E.deriveOilRoyaltyRate('deep_offshore', 50001) },
  { q: Q(2), where: 'key', printed: '0.054167', value: (L) => r0(L, 'pia_deep_offshore_full').royalty_rate_liquids },
  { q: Q(2), where: 'key', printed: 'weighted rate the year charges on every barrel', value: (L) => L.E.deriveOilRoyaltyRate('deep_offshore', 50000) === 0.05 && L.E.deriveOilRoyaltyRate('deep_offshore', 60000) > 0.05 && L.E.deriveOilRoyaltyRate('deep_offshore', 60000) < 0.075 },
  { q: Q(2), where: 'explanation', printed: '94900000.00', value: (L) => r0(L, 'pia_deep_offshore_full').production_royalty },
  { q: Q(2), where: 'explanation', printed: '1752000000.00', value: (L) => r0(L, 'pia_deep_offshore_full').gross_revenue },
  // ord 3: HCDT on prior-year opex, NDDC on opex plus capex
  { q: Q(3), where: 'prompt', printed: '7020000.00', value: (L) => akRow(L, 2029).nddc },
  { q: Q(3), where: 'prompt', printed: '2091600.00', value: (L) => akRow(L, 2030).nddc },
  { q: Q(3), where: 'prompt', printed: '763848.00', value: (L) => akRow(L, 2031).nddc },
  { q: Q(3), where: 'prompt', printed: '720000.00', value: (L) => akRow(L, 2030).hcdt },
  { q: Q(3), where: 'prompt', printed: '741600.00', value: (L) => akRow(L, 2031).hcdt },
  { q: Q(3), where: 'key', printed: 'of the year\'s opex plus capex', value: (L) => [2029, 2030, 2031].every((y) => { const q = akRow(L, y); return Math.abs(q.nddc - 0.03 * (q.opex + q.capex)) < 0.01; }) },
  { q: Q(3), where: 'key', printed: 'of the prior year\'s opex', value: (L) => Math.abs(akRow(L, 2030).hcdt - 0.03 * akRow(L, 2029).opex) < 0.01 && akRow(L, 2029).hcdt === 0 },
  { q: Q(3), where: 'explanation', printed: '600000.00', value: (L) => akRow(L, 2029, { pia_prior_year_opex_usd: 20000000 }).hcdt },
  { q: Q(3), where: 'explanation', printed: '59545347.19', value: (L) => ak(L, { pia_prior_year_opex_usd: 20000000 }).kpis.npv },
  { q: Q(3), where: 'explanation', printed: '59766796.57', value: (L) => ak(L).kpis.npv },
  // ord 4: TET 3, levy 4, same base
  { q: Q(4), where: 'prompt', printed: '31747249.45', value: (L) => r0(L, 'pia_worked_example').tet_tax },
  { q: Q(4), where: 'prompt', printed: '42329665.93', value: (L) => r0(L, 'nta_switch_force_nta').dev_levy_tax },
  { q: Q(4), where: 'key', printed: '1058241648.19', value: (L) => r0(L, 'nta_switch_force_nta').cit_assessable_profit },
  { q: Q(4), where: 'key', printed: 'only the rates differ', value: (L) => Math.abs(r0(L, 'pia_worked_example').tet_tax - 0.03 * r0(L, 'pia_worked_example').cit_assessable_profit) < 0.01 && Math.abs(r0(L, 'nta_switch_force_nta').dev_levy_tax - 0.04 * r0(L, 'nta_switch_force_nta').cit_assessable_profit) < 0.01 },
  { q: Q(4), where: 'option 2', printed: '998241648.19', value: (L) => r0(L, 'pia_worked_example').cit_chargeable_profit },
  { q: Q(4), where: 'explanation', printed: '10582416.48', value: (L) => r0(L, 'nta_switch_force_nta').dev_levy_tax - r0(L, 'pia_worked_example').tet_tax },
  { q: Q(4), where: 'explanation', printed: '617004738.36', value: (L) => r0(L, 'pia_worked_example').tax },
  { q: Q(4), where: 'explanation', printed: '627587154.84', value: (L) => r0(L, 'nta_switch_force_nta').tax },
  { q: Q(4), where: 'explanation', printed: '141236909.83', value: (L) => L.golden('pia_worked_example').kpis.npv },
  { q: Q(4), where: 'explanation', printed: '130654493.35', value: (L) => L.golden('nta_switch_force_nta').kpis.npv },
  // ord 7
  { q: Q(7), where: 'key', printed: 'null with a status', value: (L) => { const k = L.golden('elt_off_tail_kept').kpis; return k.irr === null && typeof k.irr_status === 'string'; } },
  // ord 9
  { q: Q(9), where: 'prompt', printed: '0.106250', value: (L) => L.E.deriveOilRoyaltyRate('onshore', 20000) },
  { q: Q(9), where: 'prompt', printed: '0.062500', value: (L) => L.E.deriveOilRoyaltyRate('onshore', 10000) },
  { q: Q(9), where: 'explanation', printed: '0.132500', value: (L) => L.E.deriveOilRoyaltyRate('onshore', 50000) },
  { q: Q(9), where: 'explanation', printed: '0.142708', value: (L) => L.E.deriveOilRoyaltyRate('onshore', 120000) },
  // ord 10
  { q: Q(10), where: 'key', printed: '8000000.00', value: (L) => r0(L, 'cpr_forfeiture').cpr_deferred_to_next },
  { q: Q(10), where: 'key', printed: 'The crude oil and condensate revenue', value: (L) => { const q = r0(L, 'cpr_forfeiture'); return Math.abs(q.cpr_cap - 0.65 * (q.oil_bbl + q.condensate_bbl) * q.applied_oil_price) < 0.01; } },
  { q: Q(10), where: 'option 3', printed: '13987213.60', value: (L) => r0(L, 'cpr_forfeiture').hct_assessable_profit },
  { q: Q(10), where: 'explanation', printed: '52000000.00', value: (L) => r0(L, 'cpr_forfeiture').cpr_cap },
  // ord 11: framework per year
  { q: Q(11), where: 'prompt', printed: '12098579.71', value: (L) => L.golden('pia_loss_relief').cashFlowData[1].dev_levy_tax },
  { q: Q(11), where: 'key', printed: 'a PIA year and then an NTA year', value: (L) => L.golden('pia_loss_relief').cashFlowData.map((q) => q.fiscal_framework).join(',') === 'pia_only,nta_2025' && L.golden('pia_loss_relief').cashFlowData[1].tet_tax === 0 },
  { q: Q(11), where: 'explanation', printed: 'shows the same split', value: (L) => L.golden('pia_cpr_carry_two_years').cashFlowData.map((q) => q.fiscal_framework).join(',') === 'pia_only,nta_2025,nta_2025' },
  // ord 12
  { q: Q(12), where: 'key', printed: 'a rate is named only where exactly one rate', value: (L) => { const k = L.run(L.withCfg(L.AKATA, { abandonment_cost_usd: 60000000 })).kpis; return k.irr === null && k.irr_status === 'multiple-roots'; } },
  { q: Q(12), where: 'explanation', printed: '-169598201.95', value: (L) => L.row(L.run(L.withCfg(L.AKATA, { abandonment_cost_usd: 200000000 })), 2035).net_cash_flow },
  // ord 13
  { q: Q(13), where: 'prompt', printed: '153901708.13', value: (L) => ak(L, { oil_price_usd_bbl: 120 }).kpis.npv },
  { q: Q(13), where: 'prompt', printed: '136554243.51', value: (L) => ak(L, deepCons).kpis.npv },
  { q: Q(13), where: 'key', printed: '76.8', value: (L) => (ak(L, deepCons).kpis.npv - ak(L).kpis.npv) / 1e6 },
  { q: Q(13), where: 'key', printed: '94.1', value: (L) => (ak(L, { oil_price_usd_bbl: 120 }).kpis.npv - ak(L).kpis.npv) / 1e6 },
  { q: Q(13), where: 'key', printed: 'comes close to the market', value: (L) => { const d = ak(L, deepCons).kpis.npv - ak(L).kpis.npv; const p = ak(L, { oil_price_usd_bbl: 120 }).kpis.npv - ak(L).kpis.npv; return d < p && d > 0.75 * p; } },
  { q: Q(13), where: 'explanation', printed: '0.050000', value: (L) => akRow(L, 2029, deepCons).royalty_rate_liquids },
  // ord 14
  { q: Q(14), where: 'explanation', printed: '-102455984.11', value: (L) => L.golden('pia_cit_allowance_restricted_carry').kpis.npv },
  { q: Q(14), where: 'explanation', printed: '-116276490.72', value: (L) => L.golden('pia_cit_allowance_no_carry').kpis.npv },
  // ord 16 (Regulations base, engine default)
  { q: Q(16), where: 'prompt', printed: '34908351.810791', value: (L) => r0(L, 'pia_worked_example').price_royalty },
  { q: Q(16), where: 'key', printed: '0.023910', value: (L) => L.E.derivePriceRoyaltyRate(80, 2025, 'shallow_water') },
  { q: Q(16), where: 'key', printed: '0.030000', value: (L) => L.E.derivePriceRoyaltyRate(80, 2021, 'shallow_water') },
  { q: Q(16), where: 'explanation', printed: '0.010632', value: (L) => L.E.derivePriceRoyaltyRate(80, 2035, 'shallow_water') },
  // ord 17
  { q: Q(17), where: 'explanation', printed: '6000000.00', value: (L) => L.E.computeProductionAllowance({ pia_lease_status: 'new', pia_terrain: 'shallow_water' }, 1000000, 80, 99500000, 'pia_only').allowance },
  { q: Q(17), where: 'explanation', printed: '500000.00', value: (L) => L.E.computeProductionAllowance({ pia_lease_status: 'new', pia_terrain: 'shallow_water' }, 1000000, 80, 99500000, 'pia_only').after_cap_bbl },
  // ord 20
  { q: Q(20), where: 'prompt', printed: '42414115.94', value: (L) => r0(L, 'nta_auto_by_base_year').dev_levy_tax },
  { q: Q(20), where: 'key', printed: '197047101.45', value: (L) => r0(L, 'nta_auto_by_base_year').royalty },
  { q: Q(20), where: 'explanation', printed: '32797101.449275', value: (L) => r0(L, 'nta_auto_by_base_year').price_royalty },
  { q: Q(20), where: 'explanation', printed: '286418369.57', value: (L) => r0(L, 'nta_auto_by_base_year').hct_tax },
  { q: Q(20), where: 'explanation', printed: '300105869.57', value: (L) => r0(L, 'nta_auto_by_base_year').cit_tax },
  { q: Q(20), where: 'explanation', printed: '131414543.48', value: (L) => L.golden('nta_auto_by_base_year').kpis.npv },
  // ord 22
  { q: Q(22), where: 'prompt', printed: '3606152.270399', value: (L) => akRow(L, 2029).price_royalty },
  { q: Q(22), where: 'option 0', printed: '10070350.00', value: (L) => akRow(L, 2029).production_royalty },
  { q: Q(22), where: 'key', printed: 'The oil revenue alone', value: (L) => { const q = akRow(L, 2029); return Math.abs(q.price_royalty - q.price_royalty_rate_oil * q.oil_bbl * q.applied_oil_price) < 0.01; } },
  { q: Q(22), where: 'explanation', printed: '4500000.00', value: (L) => r0(L, 'pia_gas_only_hct_zero').production_royalty },
  { q: Q(22), where: 'explanation', printed: '1421219.023426', value: (L) => akRow(L, 2035).price_royalty },
  // ord 23: gas out of the HCT base on the default path
  { q: Q(23), where: 'prompt', printed: '18318000.00', value: (L) => L.golden('pia_gas_only_legacy_hct').kpis.npv },
  { q: Q(23), where: 'key', printed: 'a field selling only gas has no base', value: (L) => { const a = r0(L, 'pia_gas_only_hct_zero'); const b = r0(L, 'pia_gas_only_legacy_hct'); return a.hct_assessable_profit === 0 && b.hct_assessable_profit === 0 && a.hct_tax === 0 && b.hct_tax === 0 && L.golden('pia_gas_only_hct_zero').kpis.npv === L.golden('pia_gas_only_legacy_hct').kpis.npv; } },
  { q: Q(23), where: 'option 3', printed: '15420000.00', value: (L) => r0(L, 'pia_gas_only_legacy_hct').cit_tax },
  { q: Q(23), where: 'explanation', printed: '51400000.00', value: (L) => r0(L, 'pia_gas_only_hct_zero').cit_chargeable_profit },
  { q: Q(23), where: 'explanation', printed: '136924208.42', value: (L) => akRow(L, 2029).hct_assessable_profit },
  { q: Q(23), where: 'explanation', printed: '141335497.73', value: (L) => akRow(L, 2029).cit_assessable_profit },
  // ord 25 (L7): the entered amount is the share under both modes
  { q: Q(25), where: 'key', printed: 'The share under both', value: (L) => L.golden('jv_abandonment_wi_60').kpis.total_abandonment_cost === L.CASE.jv_abandonment_wi_60.cfg.abandonment_cost_usd && L.golden('pia_sinking_fund_wi_50').kpis.total_abandonment_cost === L.CASE.pia_sinking_fund_wi_50.cfg.abandonment_cost_usd && L.CASE.pia_sinking_fund_wi_50.cfg.pia_working_interest_pct === 50 && L.CASE.jv_abandonment_wi_60.cfg.jv_working_interest_pct === 60 },
  { q: Q(25), where: 'explanation', printed: '43.333333', value: (L) => L.golden('jv_abandonment_wi_60').kpis.unit_technical_cost_usd_per_boe },
  { q: Q(25), where: 'explanation', printed: '59518454.92', value: (L) => L.golden('pia_sinking_fund_wi_50').kpis.npv },
  { q: Q(25), where: 'explanation', printed: '30000000.00', value: (L) => L.golden('pia_sinking_fund_wi_50').kpis.total_abandonment_cost },
  // ord 26
  { q: Q(26), where: 'key', printed: '59766796.57', value: (L) => ak(L).kpis.npv },
  { q: Q(26), where: 'key', printed: 'shallow water, converted PML', value: (L) => ak(L).kpis.fiscal_framework === 'nta_2025' && L.AKPIA.cfg.pia_terrain === 'shallow_water' && L.AKPIA.cfg.pia_lease_status === 'converted' && ak(L).kpis.pv_basis === 'real' },
  { q: Q(26), where: 'explanation', printed: '63590226.39', value: (L) => ak(L, { pia_under_nta_2025_override: 'force_pia' }).kpis.npv },
  // ord 27: contribution lowers both assessable profits
  { q: Q(27), where: 'prompt', printed: '276784994.46', value: (L) => r0(L, 'pia_sinking_fund').hct_tax },
  { q: Q(27), where: 'prompt', printed: '290472494.46', value: (L) => r0(L, 'pia_sinking_fund').cit_tax },
  { q: Q(27), where: 'prompt', printed: '30847249.45', value: (L) => r0(L, 'pia_sinking_fund').tet_tax },
  { q: Q(27), where: 'prompt', printed: '285784994.46', value: (L) => r0(L, 'pia_worked_example').hct_tax },
  { q: Q(27), where: 'prompt', printed: '299472494.46', value: (L) => r0(L, 'pia_worked_example').cit_tax },
  { q: Q(27), where: 'key', printed: 'all fall at their own rates', value: (L) => { const a = r0(L, 'pia_worked_example'); const b = r0(L, 'pia_sinking_fund'); return Math.abs(a.hct_assessable_profit - b.hct_assessable_profit - 3e7) < 0.01 && Math.abs(a.cit_assessable_profit - b.cit_assessable_profit - 3e7) < 0.01 && b.tet_tax < a.tet_tax; } },
  { q: Q(27), where: 'explanation', printed: '1028241648.19', value: (L) => r0(L, 'pia_sinking_fund').cit_assessable_profit },
  { q: Q(27), where: 'explanation', printed: '130136909.83', value: (L) => L.golden('pia_sinking_fund').kpis.npv },
  // ord 29
  { q: Q(29), where: 'prompt', printed: '453861842.57', value: (L) => L.golden('pia_deep_offshore_wi_50').kpis.npv },
  { q: Q(29), where: 'prompt', printed: '907723685.14', value: (L) => L.golden('pia_deep_offshore_full').kpis.npv },
  { q: Q(29), where: 'prompt', printed: '369073842.57', value: (L) => L.golden('pia_deep_offshore_naive_30k').kpis.npv },
  { q: Q(29), where: 'key', printed: '43800000.00', value: (L) => r0(L, 'pia_deep_offshore_naive_30k').production_royalty },
  { q: Q(29), where: 'key', printed: '47450000.00', value: (L) => r0(L, 'pia_deep_offshore_wi_50').production_royalty },
  { q: Q(29), where: 'explanation', printed: '45.4033', value: (L) => L.golden('pia_deep_offshore_naive_30k').kpis.government_take_pct },
  { q: Q(29), where: 'explanation', printed: '41.5126', value: (L) => L.golden('pia_deep_offshore_wi_50').kpis.government_take_pct },
  // ord 30
  { q: Q(30), where: 'prompt', printed: '4662404.53', value: (L) => r0(L, 'cpr_forfeiture').cit_chargeable_profit },
  { q: Q(30), where: 'prompt', printed: '1398721.36', value: (L) => r0(L, 'cpr_forfeiture').cit_tax },
  { q: Q(30), where: 'key', printed: '10675190.93', value: (L) => r0(L, 'cpr_forfeiture').cit_allowance_carryforward },
  // ord 31: the floor only in NTA years
  { q: Q(31), where: 'prompt', printed: '617004738.36', value: (L) => r0(L, 'min_etr_85').tax },
  { q: Q(31), where: 'prompt', printed: '85.5512', value: (L) => L.golden('min_etr_85').kpis.government_take_pct },
  { q: Q(31), where: 'key', printed: 'only to years under the NTA', value: (L) => { const q = r0(L, 'min_etr_85'); return q.fiscal_framework === 'pia_only' && q.tax === r0(L, 'pia_worked_example').tax && L.golden('min_etr_85').kpis.pia_notes.some((n) => n.includes('applied only to years under the NTA')); } },
  { q: Q(31), where: 'option 2', printed: '199158351.81', value: (L) => r0(L, 'pia_worked_example').royalty },
  { q: Q(31), where: 'option 0', printed: 'together clearing', value: (L) => { const q = r0(L, 'pia_worked_example'); return q.tax < 0.85 * q.cit_assessable_profit; } },
  // ord 34
  { q: Q(34), where: 'prompt', printed: '60060654.75', value: (L) => ak(L, deepAgg).kpis.npv },
  { q: Q(34), where: 'prompt', printed: '59503845.87', value: (L) => ak(L, deepCons).kpis.total_royalties },
  { q: Q(34), where: 'explanation', printed: '9301600.00', value: (L) => akRow(L, 2029, deepCons).production_royalty },
  { q: Q(34), where: 'explanation', printed: '27439344.48', value: (L) => akRow(L, 2029, deepAgg).hct_tax },
  // ord 36: marginal field flag moves HCT rate only
  { q: Q(36), where: 'prompt', printed: '13604359.74', value: (L) => akRow(L, 2029, marginal).hct_tax },
  { q: Q(36), where: 'prompt', printed: '97891150.04', value: (L) => ak(L, marginal).kpis.npv },
  { q: Q(36), where: 'prompt', printed: '10070350.00', value: (L) => akRow(L, 2029, marginal).production_royalty },
  { q: Q(36), where: 'key', printed: 'The hydrocarbon tax rate alone', value: (L) => { const a = ak(L); const b = ak(L, marginal); return b.cashFlowData.every((q, i) => q.hct_rate === 0.15 && q.production_royalty === a.cashFlowData[i].production_royalty && q.production_allowance === a.cashFlowData[i].production_allowance) && L.refusal(L.withCfg(L.AKPIA, { pia_terrain: 'marginal_field' })) !== null; } },
  { q: Q(36), where: 'explanation', printed: '24111699.56', value: (L) => r0(L, 'pia_marginal_field_blend').hct_tax },
  // ord 37
  { q: Q(37), where: 'prompt', printed: '64001892.15', value: (L) => akRow(L, 2029).cpr_costs_claimed },
  { q: Q(37), where: 'prompt', printed: '117260000.00', value: (L) => akRow(L, 2029).cpr_cap },
  { q: Q(37), where: 'prompt', printed: '73427625.35', value: (L) => akRow(L, 2030).cpr_costs_claimed },
  { q: Q(37), where: 'prompt', printed: '100577100.00', value: (L) => akRow(L, 2030).cpr_cap },
  { q: Q(37), where: 'key', printed: 'a fifth of both tranches beside its opex, at the crude share', value: (L) => { const q = akRow(L, 2030); const share = q.oil_bbl * q.applied_oil_price / q.gross_revenue; return Math.abs(q.cpr_costs_claimed - share * (q.opex + 0.2 * 210000000 + 0.2 * 45000000)) < 0.01; } },
  // ord 38
  { q: Q(38), where: 'key', printed: '72534830.66', value: (L) => L.run(L.AKATA).kpis.npv },
  // ord 39
  { q: Q(39), where: 'prompt', printed: '5653419.91', value: (L) => akRow(L, 2029).dev_levy_tax },
  { q: Q(39), where: 'prompt', printed: '4240064.93', value: (L) => akRow(L, 2029, { pia_under_nta_2025_override: 'force_pia' }).tet_tax },
  { q: Q(39), where: 'key', printed: 'framework are written beside it', value: (L) => ak(L).kpis.fiscal_framework === 'nta_2025' },
  // ord 41 (stated new-PML rate 30; allowance totals rate-independent)
  { q: Q(41), where: 'prompt', printed: '23578719.48', value: (L) => akRow(L, 2029, newLease(0)).hct_tax },
  { q: Q(41), where: 'prompt', printed: '17600000.00', value: (L) => akRow(L, 2029, newLease(96000000)).production_allowance },
  { q: Q(41), where: 'key', printed: '77440000.00', value: (L) => ak(L, newLease(0)).kpis.total_production_allowance },
  { q: Q(41), where: 'key', printed: '54720000.00', value: (L) => ak(L, { ...newLease(96000000), pia_new_pml_hct_rate_pct: 15 }).kpis.total_production_allowance },
  { q: Q(41), where: 'explanation', printed: '72785125.58', value: (L) => ak(L, newLease(0)).kpis.npv },
  { q: Q(41), where: 'explanation', printed: '67920886.30', value: (L) => ak(L, newLease(96000000)).kpis.npv },
  { q: Q(41), where: 'explanation', printed: '82498840.32', value: (L) => ak(L, newLease(96000000)).kpis.total_hct },
  // ord 42
  { q: Q(42), where: 'explanation', printed: '41.5126', value: (L) => L.golden('pia_deep_offshore_full').kpis.government_take_pct },
  { q: Q(42), where: 'explanation', printed: '0.054167', value: (L) => r0(L, 'pia_deep_offshore_wi_50').royalty_rate_liquids },
];
