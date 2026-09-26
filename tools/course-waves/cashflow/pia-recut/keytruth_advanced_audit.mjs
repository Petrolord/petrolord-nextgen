// Key-truth auditor's checks (2026-09-26) on the rows the audit changed. Each CALLS the engine through lib.mjs.
const PSC30 = (L) => L.run(L.withCfg(L.AKATA, { fiscal_regime: 'PSC', psc_royalty_pct: 10, psc_cost_oil_cap_pct: 30, psc_contractor_profit_share_pct: 45, psc_tax_rate_pct: 50, psc_working_interest_pct: 100 }));
const NL = (L, prior) => L.run(L.withCfg(L.AKPIA, { pia_lease_status: 'new', pia_new_pml_hct_rate_pct: 30, pia_prior_cumulative_oil_bbl: prior }));
export default [
  // m01 15: the pool is reported on the row and by the KPI (the served key said neither).
  { q: 'advanced m01 15', where: 'key', printed: 'psc_cost_pool_after on the', value: (L) => { const r = PSC30(L); const last = r.cashFlowData.at(-1); return last.year === 2035 && last.psc_cost_pool_after.toFixed(2) === '207346412.26' && r.kpis.psc_unrecovered_cost_at_cessation === last.psc_cost_pool_after; } },
  { q: 'advanced m01 15', where: 'prompt', printed: '207346412.26', value: (L) => PSC30(L).cashFlowData.at(-1).psc_cost_pool_after },
  // m06 7 and m03 10: the 2029 lifetime column already parts; the allowance parts in 2030.
  { q: 'advanced m06 7', where: 'key', printed: '98200000.00', value: (L) => NL(L, 96000000).cashFlowData[0].cumulative_oil_bbl_lifetime },
  { q: 'advanced m06 7', where: 'key', printed: '2200000.00', value: (L) => NL(L, 0).cashFlowData[0].cumulative_oil_bbl_lifetime },
  { q: 'advanced m06 7', where: 'explanation', printed: '14600000.00', value: (L) => NL(L, 96000000).cashFlowData[1].production_allowance },
  { q: 'advanced m06 7', where: 'explanation', printed: '14800000.00', value: (L) => NL(L, 0).cashFlowData[1].production_allowance },
  { q: 'advanced m06 7', where: 'explanation', printed: '23578719.48', value: (L) => { const a = NL(L, 0).cashFlowData[0].hct_tax; const b = NL(L, 96000000).cashFlowData[0].hct_tax; return a === b ? a : NaN; } },
  { q: 'advanced m03 10', where: 'explanation', printed: '98200000.00', value: (L) => NL(L, 96000000).cashFlowData[0].cumulative_oil_bbl_lifetime },
  // m03 7: at 40 percent the deferral peaks in 2034 and is still above 101 million at cessation.
  { q: 'advanced m03 7', where: 'explanation', printed: 'grows every year to', value: (L) => { const d = L.run(L.withCfg(L.AKPIA, { pia_cpr_limit_pct: 40 })).cashFlowData.map((q) => q.cpr_deferred_to_next); return d.slice(1, 6).every((x, i) => x > d[i]) && d[6] < d[5] && d[6] > 101e6; } },
  // m02 9: 160 in 2025 sits under the escalated high benchmark.
  { q: 'advanced m02 9', where: 'explanation', printed: '0.097820', value: (L) => L.E.derivePriceRoyaltyRate(160, 2025, 'shallow_water') },
  { q: 'advanced m02 9', where: 'key', printed: '0.100000', value: (L) => L.E.derivePriceRoyaltyRate(200, 2035, 'shallow_water') },
  // m03 14: the carry.
  { q: 'advanced m03 14', where: 'key', printed: '10675190.93', value: (L) => L.golden('cpr_forfeiture').cashFlowData[0].cit_allowance_carryforward },
  // final 26: the Regulations base is the one that gives the headline.
  { q: 'advanced final 26', where: 'prompt', printed: '59766796.57', value: (L) => L.run(L.AKPIA).kpis.npv },
];
