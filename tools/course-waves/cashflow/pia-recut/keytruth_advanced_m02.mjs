// Key-truth checks for the cashflow Expert m02 (the PIA royalties) rows this
// re-cut changes. Every value is an engine return (lib.mjs).
const ak = (L, patch = {}) => L.run(L.withCfg(L.AKPIA, patch));
const y = (L, res, yr) => L.row(res, yr);
const one = (L, name) => L.golden(name).cashFlowData[0];
export default [
  // ord 1: the tranche-weighted liquids rate is the keyed explanation
  { q: 'advanced m02 1', where: 'prompt', printed: '10070350.00', value: (L) => y(L, ak(L), 2029).production_royalty },
  { q: 'advanced m02 1', where: 'key', printed: '6027.40', value: (L) => y(L, ak(L), 2029).royalty_liquids_bopd },
  { q: 'advanced m02 1', where: 'key', printed: '0.054261', value: (L) => y(L, ak(L), 2029).royalty_rate_liquids },
  { q: 'advanced m02 1', where: 'key', printed: '0.050000', value: (L) => L.E.deriveGasRoyaltyRate('shallow_water') },
  { q: 'advanced m02 1', where: 'prompt', printed: 'lands far above that figure', value: (L) => L.E.deriveOilRoyaltyRate('shallow_water', 1e9) < 0.125 && y(L, ak(L), 2029).royalty_rate_liquids < 0.125 },
  { q: 'advanced m02 1', where: 'option 0', printed: '3606152.270399', value: (L) => y(L, ak(L), 2029).price_royalty },
  { q: 'advanced m02 1', where: 'explanation', printed: '281600.00', value: (L) => y(L, ak(L), 2029).gas_royalty },
  { q: 'advanced m02 1', where: 'explanation', printed: 'Onshore the same row also reads', value: (L) => Math.abs(y(L, ak(L, { pia_terrain: 'onshore' }), 2029).production_royalty - 10070350) < 0.005 },
  // ord 2: deep offshore weighted rate
  { q: 'advanced m02 2', where: 'prompt', printed: '94900000.00', value: (L) => one(L, 'pia_deep_offshore_full').production_royalty },
  { q: 'advanced m02 2', where: 'key', printed: '0.054167', value: (L) => one(L, 'pia_deep_offshore_full').royalty_rate_liquids },
  { q: 'advanced m02 2', where: 'explanation', printed: '43800000.00', value: (L) => one(L, 'pia_deep_offshore_naive_30k').production_royalty },
  { q: 'advanced m02 2', where: 'key', printed: 'the year pays one weighted rate', value: (L) => L.E.deriveOilRoyaltyRate('deep_offshore', 50000) === 0.05 },
  // ord 3
  { q: 'advanced m02 3', where: 'prompt', printed: '0.112500', value: (L) => one(L, 'pia_worked_example').royalty_rate_liquids },
  { q: 'advanced m02 3', where: 'prompt', printed: '0.054167', value: (L) => one(L, 'pia_deep_offshore_full').royalty_rate_liquids },
  // ord 4: onshore = shallow; aggressive reading is the royalty-only move
  { q: 'advanced m02 4', where: 'prompt', printed: '60324870.87', value: (L) => ak(L, { pia_terrain: 'onshore' }).kpis.total_royalties },
  { q: 'advanced m02 4', where: 'prompt', printed: '59503845.87', value: (L) => ak(L, { pia_terrain: 'deep_offshore', pia_deep_offshore_hct_interpretation: 'aggressive_pml_30' }).kpis.total_royalties },
  { q: 'advanced m02 4', where: 'prompt', printed: '59766796.57', value: (L) => ak(L, { pia_terrain: 'onshore' }).kpis.npv },
  { q: 'advanced m02 4', where: 'prompt', printed: '136554243.51', value: (L) => ak(L, { pia_terrain: 'deep_offshore', pia_deep_offshore_hct_interpretation: 'conservative_zero' }).kpis.npv },
  { q: 'advanced m02 4', where: 'prompt', printed: '60060654.75', value: (L) => ak(L, { pia_terrain: 'deep_offshore', pia_deep_offshore_hct_interpretation: 'aggressive_pml_30' }).kpis.npv },
  { q: 'advanced m02 4', where: 'key', printed: '821025.00', value: (L) => ak(L).kpis.total_royalties - ak(L, { pia_terrain: 'deep_offshore', pia_deep_offshore_hct_interpretation: 'aggressive_pml_30' }).kpis.total_royalties },
  { q: 'advanced m02 4', where: 'key', printed: 'only the royalty moves', value: (L) => ak(L, { pia_terrain: 'deep_offshore', pia_deep_offshore_hct_interpretation: 'aggressive_pml_30' }).cashFlowData.every((r) => r.hct_rate === 0.3) && ak(L).cashFlowData.every((r) => r.hct_rate === 0.3) },
  // ord 6: the marginal flag moves the HCT rate
  { q: 'advanced m02 6', where: 'prompt', printed: '13604359.74', value: (L) => y(L, ak(L, { pia_marginal_field_pre_2021: true }), 2029).hct_tax },
  { q: 'advanced m02 6', where: 'prompt', printed: '27208719.48', value: (L) => y(L, ak(L), 2029).hct_tax },
  { q: 'advanced m02 6', where: 'prompt', printed: '97891150.04', value: (L) => ak(L, { pia_marginal_field_pre_2021: true }).kpis.npv },
  { q: 'advanced m02 6', where: 'prompt', printed: 'keeps its', value: (L) => Math.abs(y(L, ak(L, { pia_marginal_field_pre_2021: true }), 2029).production_royalty - 10070350) < 0.005 },
  { q: 'advanced m02 6', where: 'key', printed: 'The hydrocarbon tax rate', value: (L) => y(L, ak(L, { pia_marginal_field_pre_2021: true }), 2029).hct_rate === 0.15 },
  { q: 'advanced m02 6', where: 'explanation', printed: '171815891.58', value: (L) => ak(L, { pia_marginal_field_pre_2021: true }).kpis.total_tax },
  { q: 'advanced m02 6', where: 'explanation', printed: '24111699.56', value: (L) => one(L, 'pia_marginal_field_blend').hct_tax },
  { q: 'advanced m02 6', where: 'explanation', printed: '160744663.71', value: (L) => one(L, 'pia_marginal_field_blend').hct_chargeable_profit },
  { q: 'advanced m02 6', where: 'option 1', printed: '3606152.27', value: (L) => y(L, ak(L), 2029).price_royalty },
  // ord 7, 8, 9: price royalty on the Regulations base
  { q: 'advanced m02 7', where: 'prompt', printed: '34908351.810791', value: (L) => one(L, 'pia_worked_example').price_royalty },
  { q: 'advanced m02 7', where: 'prompt', printed: '0.023910', value: (L) => L.E.derivePriceRoyaltyRate(80, 2025, 'shallow_water') },
  { q: 'advanced m02 7', where: 'option 1', printed: '164250000.00', value: (L) => one(L, 'pia_worked_example').production_royalty },
  { q: 'advanced m02 7', where: 'explanation', printed: '0.005432', value: (L) => L.E.derivePriceRoyaltyRate(60, 2025, 'shallow_water') },
  { q: 'advanced m02 7', where: 'explanation', printed: '0.000209', value: (L) => L.E.derivePriceRoyaltyRate(60, 2030, 'shallow_water') },
  { q: 'advanced m02 8', where: 'explanation', printed: '0.005432', value: (L) => L.E.derivePriceRoyaltyRate(60, 2025, 'shallow_water') },
  { q: 'advanced m02 8', where: 'explanation', printed: '0.000209', value: (L) => L.E.derivePriceRoyaltyRate(60, 2030, 'shallow_water') },
  { q: 'advanced m02 8', where: 'prompt', printed: 'already does', value: (L) => L.E.derivePriceRoyaltyRate(55, 2026, 'shallow_water') === 0 && L.E.derivePriceRoyaltyRate(60, 2035, 'shallow_water') === 0 },
  { q: 'advanced m02 9', where: 'explanation', printed: '202719327.420547', value: (L) => one(L, 'pia_high_price_royalty_tiers').price_royalty },
  { q: 'advanced m02 9', where: 'explanation', printed: '0.079342', value: (L) => one(L, 'pia_high_price_royalty_tiers').price_royalty_rate_oil },
  // ord 10, 11: gas 5 percent; onshore new lease at 10000 bopd
  { q: 'advanced m02 10', where: 'prompt', printed: '4500000.00', value: (L) => one(L, 'pia_gas_only_hct_zero').production_royalty },
  { q: 'advanced m02 10', where: 'explanation', printed: '0.023910', value: (L) => one(L, 'pia_gas_only_hct_zero').price_royalty_rate_oil },
  { q: 'advanced m02 11', where: 'explanation', printed: '18250000.00', value: (L) => one(L, 'pia_onshore_new_lease').production_royalty },
  { q: 'advanced m02 11', where: 'explanation', printed: '0.062500', value: (L) => one(L, 'pia_onshore_new_lease').royalty_rate_liquids },
  { q: 'advanced m02 11', where: 'explanation', printed: '6981670.362158', value: (L) => one(L, 'pia_onshore_new_lease').price_royalty },
  { q: 'advanced m02 11', where: 'key', printed: 'exempts the field from the price royalty outright', value: (L) => [1000, 60000, 120000].every((b) => L.E.deriveOilRoyaltyRate('frontier', b) === 0.075) && L.E.derivePriceRoyaltyRate(200, 2025, 'frontier') === 0 },
  // ord 12, 13: field-level tranche and the pre-scaled upload
  { q: 'advanced m02 12', where: 'prompt', printed: '47450000.00', value: (L) => one(L, 'pia_deep_offshore_wi_50').production_royalty },
  { q: 'advanced m02 12', where: 'key', printed: '0.054167', value: (L) => one(L, 'pia_deep_offshore_wi_50').royalty_rate_liquids },
  { q: 'advanced m02 12', where: 'option 0', printed: '20945011.086475', value: (L) => one(L, 'pia_deep_offshore_wi_50').price_royalty },
  { q: 'advanced m02 12', where: 'explanation', printed: 'royalty_liquids_bopd reads', value: (L) => one(L, 'pia_deep_offshore_wi_50').royalty_liquids_bopd === 60000 && one(L, 'pia_deep_offshore_naive_30k').royalty_liquids_bopd === 30000 },
  { q: 'advanced m02 13', where: 'prompt', printed: '369073842.57', value: (L) => L.golden('pia_deep_offshore_naive_30k').kpis.npv },
  { q: 'advanced m02 13', where: 'prompt', printed: '453861842.57', value: (L) => L.golden('pia_deep_offshore_wi_50').kpis.npv },
  { q: 'advanced m02 13', where: 'explanation', printed: '45.4033', value: (L) => L.golden('pia_deep_offshore_naive_30k').kpis.government_take_pct },
  { q: 'advanced m02 13', where: 'explanation', printed: '41.5126', value: (L) => L.golden('pia_deep_offshore_full').kpis.government_take_pct },
  // ord 14
  { q: 'advanced m02 14', where: 'prompt', printed: '29883398.29', value: (L) => ak(L, { pia_working_interest_pct: 50 }).kpis.npv },
  { q: 'advanced m02 14', where: 'prompt', printed: '70.6449', value: (L) => ak(L, { pia_working_interest_pct: 50 }).kpis.government_take_pct },
  { q: 'advanced m02 14', where: 'prompt', printed: '66.1723', value: (L) => L.run(L.withCfg(L.AKATA, { jv_working_interest_pct: 25 })).kpis.government_take_pct },
  { q: 'advanced m02 14', where: 'explanation', printed: '30162435.44', value: (L) => ak(L, { pia_working_interest_pct: 50 }).kpis.total_royalties },
];
