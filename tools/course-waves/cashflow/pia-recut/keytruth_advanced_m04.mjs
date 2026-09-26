// Key truth for the cashflow Expert m04 (levies and losses) rows this re-cut
// changes. Every value is an engine return through lib.mjs.
const we = (L, patch = {}) => L.run(L.withCfg(L.CASE.pia_worked_example, patch));
const y0 = (res) => res.cashFlowData[0];
const nta = { pia_under_nta_2025_override: 'force_nta' };
const etr = (pct) => ({ ...nta, pia_apply_minimum_etr: true, pia_minimum_etr_pct: pct });
const lr = (L) => L.golden('pia_loss_relief');
const lk = (L) => L.golden('pia_loss_relief_killswitch');
const r26 = (res) => res.cashFlowData.find((q) => q.year === 2026);
const akAuto = (L) => L.run(L.AKPIA);
const akPia = (L) => L.run(L.withCfg(L.AKPIA, { pia_under_nta_2025_override: 'force_pia' }));

export default [
  // ord 1
  { q: 'advanced m04 1', where: 'prompt', printed: '31747249.45', value: (L) => y0(we(L)).tet_tax },
  { q: 'advanced m04 1', where: 'prompt', printed: '42329665.93', value: (L) => y0(we(L, nta)).dev_levy_tax },
  { q: 'advanced m04 1', where: 'key', printed: '1058241648.19', value: (L) => y0(we(L)).cit_assessable_profit },
  { q: 'advanced m04 1', where: 'key', printed: 'only the rates differ', value: (L) => { const a = y0(we(L)); const b = y0(we(L, nta)); return a.tet_rate_pct === 3 && Math.abs(b.dev_levy_tax / a.cit_assessable_profit - 0.04) < 1e-12 && Math.abs(a.tet_tax / a.cit_assessable_profit - 0.03) < 1e-12; } },
  { q: 'advanced m04 1', where: 'option 2', printed: '998241648.19', value: (L) => y0(we(L)).cit_chargeable_profit },
  { q: 'advanced m04 1', where: 'explanation', printed: '199158351.81', value: (L) => y0(we(L, nta)).royalty },
  { q: 'advanced m04 1', where: 'explanation', printed: '285784994.46', value: (L) => y0(we(L, nta)).hct_tax },
  { q: 'advanced m04 1', where: 'explanation', printed: '299472494.46', value: (L) => y0(we(L, nta)).cit_tax },
  { q: 'advanced m04 1', where: 'explanation', printed: '617004738.36', value: (L) => we(L).kpis.total_tax },
  { q: 'advanced m04 1', where: 'explanation', printed: '627587154.84', value: (L) => we(L, nta).kpis.total_tax },
  // ord 2
  { q: 'advanced m04 2', where: 'explanation', printed: '5653419.91', value: (L) => akAuto(L).cashFlowData[0].dev_levy_tax },
  { q: 'advanced m04 2', where: 'explanation', printed: '23822173.11', value: (L) => akAuto(L).kpis.total_dev_levy },
  { q: 'advanced m04 2', where: 'explanation', printed: '4240064.93', value: (L) => akPia(L).cashFlowData[0].tet_tax },
  { q: 'advanced m04 2', where: 'option 1', printed: '4240064.93', value: (L) => akPia(L).cashFlowData[0].tet_tax },
  { q: 'advanced m04 2', where: 'key', printed: 'one of tet_tax and dev_levy_tax is', value: (L) => [akAuto(L), akPia(L), we(L), we(L, nta), lr(L)].every((r) => r.cashFlowData.every((q) => q.tet_tax === 0 || q.dev_levy_tax === 0)) },
  // ord 3
  { q: 'advanced m04 3', where: 'prompt', printed: '12098579.71', value: (L) => r26(lr(L)).dev_levy_tax },
  { q: 'advanced m04 3', where: 'prompt', printed: '43056393.20', value: (L) => lr(L).cashFlowData[0].cit_loss_carryforward },
  { q: 'advanced m04 3', where: 'key', printed: 'the levy sits on the assessable profit', value: (L) => r26(lr(L)).dev_levy_tax === r26(lk(L)).dev_levy_tax && Math.abs(r26(lr(L)).dev_levy_tax - 0.04 * r26(lr(L)).cit_assessable_profit) < 1e-6 },
  { q: 'advanced m04 3', where: 'explanation', printed: '65822429.87', value: (L) => r26(lr(L)).cit_tax },
  { q: 'advanced m04 3', where: 'explanation', printed: '78739347.83', value: (L) => r26(lk(L)).cit_tax },
  { q: 'advanced m04 3', where: 'explanation', printed: '61697429.87', value: (L) => r26(lr(L)).hct_tax },
  { q: 'advanced m04 3', where: 'explanation', printed: '64789347.83', value: (L) => r26(lk(L)).hct_tax },
  { q: 'advanced m04 3', where: 'option 0', printed: 'spent against the', value: (L) => lr(L).cashFlowData[0].hct_tax === 0 },
  // ord 4: rows 2027-2030 with the override unset are nta_2025 throughout
  { q: 'advanced m04 4', where: 'key', printed: 'on every row, because an unset override behaves as auto', value: (L) => { const c = { ...L.CASE.pia_worked_example.cfg, base_year: 2027 }; delete c.pia_under_nta_2025_override; return [2027, 2028, 2029, 2030].every((y) => L.E.fiscalFrameworkForYear(c, y) === 'nta_2025'); } },
  { q: 'advanced m04 4', where: 'option 3', printed: 'alone and pia_only from', value: (L) => { const c = { ...L.CASE.pia_worked_example.cfg, base_year: 2027 }; delete c.pia_under_nta_2025_override; return L.E.fiscalFrameworkForYear(c, 2028) !== 'pia_only'; } },
  { q: 'advanced m04 4', where: 'explanation', printed: 'force_pia and force_nta apply one framework to every year', value: (L) => { const c = { pia_under_nta_2025_override: 'auto' }; return L.E.fiscalFrameworkForYear(c, 2024) === 'pia_only' && L.E.fiscalFrameworkForYear(c, 2025) === 'pia_only' && L.E.fiscalFrameworkForYear(c, 2026) === 'nta_2025' && L.E.fiscalFrameworkForYear({}, 2027) === 'nta_2025'; } },
  // ord 5
  { q: 'advanced m04 5', where: 'key', printed: 'chosen for each year of assessment', value: (L) => { const r = lr(L).cashFlowData; return r[0].fiscal_framework === 'pia_only' && r[1].fiscal_framework === 'nta_2025' && r[1].tet_tax === 0 && r[0].dev_levy_tax === 0; } },
  { q: 'advanced m04 5', where: 'prompt', printed: '12098579.71', value: (L) => r26(lr(L)).dev_levy_tax },
  { q: 'advanced m04 5', where: 'explanation', printed: 'is named pia_only_then_nta_', value: (L) => { const g = L.golden('pia_cpr_carry_two_years').cashFlowData.map((q) => q.fiscal_framework).join(); const e = L.golden('elt_pia_multiyear').cashFlowData.slice(1).every((q) => q.fiscal_framework === 'nta_2025'); return g === 'pia_only,nta_2025,nta_2025' && e && lr(L).kpis.fiscal_framework === 'pia_only_then_nta_2025'; } },
  // ord 6
  { q: 'advanced m04 6', where: 'prompt', printed: '130654493.35', value: (L) => we(L, nta).kpis.npv },
  { q: 'advanced m04 6', where: 'prompt', printed: '42414115.94', value: (L) => L.golden('nta_auto_by_base_year').cashFlowData[0].dev_levy_tax },
  { q: 'advanced m04 6', where: 'prompt', printed: '131414543.48', value: (L) => L.golden('nta_auto_by_base_year').kpis.npv },
  { q: 'advanced m04 6', where: 'key', printed: '34908351.810791', value: (L) => y0(we(L, nta)).price_royalty },
  { q: 'advanced m04 6', where: 'key', printed: '32797101.449275', value: (L) => L.golden('nta_auto_by_base_year').cashFlowData[0].price_royalty },
  { q: 'advanced m04 6', where: 'key', printed: '1060352898.55', value: (L) => L.golden('nta_auto_by_base_year').cashFlowData[0].cit_assessable_profit },
  { q: 'advanced m04 6', where: 'explanation', printed: '197047101.45', value: (L) => L.golden('nta_auto_by_base_year').cashFlowData[0].royalty },
  { q: 'advanced m04 6', where: 'explanation', printed: '286418369.57', value: (L) => L.golden('nta_auto_by_base_year').cashFlowData[0].hct_tax },
  { q: 'advanced m04 6', where: 'explanation', printed: '300105869.57', value: (L) => L.golden('nta_auto_by_base_year').cashFlowData[0].cit_tax },
  // ord 10
  { q: 'advanced m04 10', where: 'prompt', printed: '61697429.87', value: (L) => r26(lr(L)).hct_tax },
  { q: 'advanced m04 10', where: 'prompt', printed: '64789347.83', value: (L) => r26(lk(L)).hct_tax },
  { q: 'advanced m04 10', where: 'key', printed: '10306393.20', value: (L) => lr(L).cashFlowData[0].hct_loss_carryforward },
  { q: 'advanced m04 10', where: 'key', printed: '43056393.20', value: (L) => r26(lr(L)).cit_loss_offset_used },
  { q: 'advanced m04 10', where: 'option 3', printed: 'both taxes fall by exactly the same amount', value: (L) => Math.abs((r26(lk(L)).hct_tax - r26(lr(L)).hct_tax) - (r26(lk(L)).cit_tax - r26(lr(L)).cit_tax)) > 1 },
  { q: 'advanced m04 10', where: 'explanation', printed: '-9568013.75', value: (L) => lk(L).kpis.npv },
  { q: 'advanced m04 10', where: 'explanation', printed: '4985473.45', value: (L) => lr(L).kpis.npv },
  // ord 12 (keyed answer was false: PSC reports its unrecovered pool at cessation)
  { q: 'advanced m04 12', where: 'key', printed: 'psc_unrecovered_cost_at_cessation', value: (L) => { const r = L.run(L.withCfg(L.AKATA, { fiscal_regime: 'PSC', psc_royalty_pct: 10, psc_cost_oil_cap_pct: 30, psc_contractor_profit_share_pct: 45, psc_tax_rate_pct: 50, psc_working_interest_pct: 100 })); return r.kpis.psc_unrecovered_cost_at_cessation > 0; } },
  { q: 'advanced m04 12', where: 'explanation', printed: '207346412.26', value: (L) => L.run(L.withCfg(L.AKATA, { fiscal_regime: 'PSC', psc_royalty_pct: 10, psc_cost_oil_cap_pct: 30, psc_contractor_profit_share_pct: 45, psc_tax_rate_pct: 50, psc_working_interest_pct: 100 })).kpis.psc_unrecovered_cost_at_cessation },
  { q: 'advanced m04 12', where: 'explanation', printed: '8000000.00', value: (L) => L.golden('cpr_forfeiture').kpis.cpr_forfeited_at_cessation },
  // ord 13: the floor in an NTA year counts HCT, CIT and the development levy
  { q: 'advanced m04 13', where: 'key', printed: 'HCT, CIT and the development levy', value: (L) => { const b = y0(we(L, etr(85))); return Math.abs(b.min_etr_topup - (0.85 * b.cit_assessable_profit - (b.hct_tax + b.cit_tax + b.dev_levy_tax))) < 1e-4 && b.tet_tax === 0; } },
  { q: 'advanced m04 13', where: 'prompt', printed: '1058241648.19', value: (L) => we(L, etr(85)).kpis.total_tax / 0.85 },
  { q: 'advanced m04 13', where: 'explanation', printed: '627587154.84', value: (L) => we(L, etr(15)).kpis.total_tax },
  { q: 'advanced m04 13', where: 'explanation', printed: '42329665.93', value: (L) => y0(we(L, etr(85))).dev_levy_tax },
  { q: 'advanced m04 13', where: 'explanation', printed: 'year the floor is never tested', value: (L) => L.golden('min_etr_85').cashFlowData[0].min_etr_topup === undefined && L.golden('min_etr_85').kpis.total_tax === we(L).kpis.total_tax },
  // ord 14
  { q: 'advanced m04 14', where: 'key', printed: 'the column exists only where the floor was charged', value: (L) => !('min_etr_topup' in y0(we(L, etr(15)))) && we(L, etr(15)).kpis.total_min_etr_topup === undefined },
  { q: 'advanced m04 14', where: 'option 2', printed: '627587154.84', value: (L) => we(L, etr(15)).kpis.total_tax },
  // ord 15
  { q: 'advanced m04 15', where: 'prompt', printed: '86.6338', value: (L) => we(L, etr(15)).kpis.government_take_pct },
  { q: 'advanced m04 15', where: 'key', printed: 'exceed the cash the year generates', value: (L) => { const r = we(L, etr(85)); return y0(r).min_etr_topup > 0 && r.kpis.government_take_pct > 100 && y0(r).net_cash_flow < 0; } },
  { q: 'advanced m04 15', where: 'explanation', printed: '0.435515', value: (L) => we(L, etr(15)).kpis.dpi },
  { q: 'advanced m04 15', where: 'explanation', printed: '-0.470879', value: (L) => we(L, etr(85)).kpis.dpi },
  { q: 'advanced m04 15', where: 'explanation', printed: 'beyond project life', value: (L) => we(L, etr(85)).kpis.payback === 'Beyond project life' },
];
