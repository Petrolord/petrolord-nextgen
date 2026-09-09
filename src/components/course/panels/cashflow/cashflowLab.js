// Teaching lab for EC1, Cash Flow and NPV. The three panels, the lessons and
// the vitest file all read this one module, so a number shown to a learner and
// a number a test pins cannot drift apart.
//
// EVERYTHING HERE IS THE VENDORED ENGINE'S OWN OUTPUT. Every ledger row, every
// KPI, every sweep point, every IRR and every fiscal line below is a return
// value from a call into engines/economics/cashflow.ts (the Petroleum
// Economics Studio engine, v3.9.0, extracted in the EC0 wave). Nothing in this
// file re-implements the engine. The one place that looks like arithmetic, the
// cost recovery pool in akataUnderPsc, is the engine's own applyPSC marched
// over the engine's own rows, because the rows do not carry the pool and no
// KPI reports it; the march is the digest's Section 13 and this lab agrees
// with it because both call the engine on the same inputs.
//
// UNITS. USD for money, bbl and Mscf for volumes, boe at 6 Mscf per barrel,
// percent for rates where the engine reports percent (irr, take, applied
// discount rate), fractions where the engine reports fractions (royalty and
// HCT rates from the derive* functions, DPI). Years are calendar years.
//
// PURITY. Every function here is pure and deterministic. There is no random
// number anywhere in this module and nothing is memoised, so two calls with
// the same arguments return the same numbers in the same order.

import cases from '@petrolord/engines/test-data/economics/goldens/cashflow_cases.json';
import {
  ENGINE_VERSION,
  computeCashFlow, computeBreakevenOilPrice,
  npv, irr, paybackYears, paybackPeriod,
  extractAnnualVolumes, extractAnnualCapex, extractAnnualOpex, isVolumeColumn,
  parsePriceDeck, resolveStreamPrice,
  applyJV, applyPSC, pscTrancheShare,
  deriveOilRoyaltyRate, deriveGasRoyaltyRate, derivePriceRoyaltyRate, deriveHctRate,
  computeProductionAllowance, determineFiscalFramework,
} from '@petrolord/engines/engines/economics/cashflow.ts';

export {
  ENGINE_VERSION,
  computeCashFlow, computeBreakevenOilPrice,
  npv, irr, paybackYears, paybackPeriod,
  extractAnnualVolumes, extractAnnualCapex, extractAnnualOpex, isVolumeColumn,
  parsePriceDeck, resolveStreamPrice,
  applyJV, applyPSC, pscTrancheShare,
  deriveOilRoyaltyRate, deriveGasRoyaltyRate, derivePriceRoyaltyRate, deriveHctRate,
  computeProductionAllowance, determineFiscalFramework,
};

// ---------------------------------------------------------------------------
// The published goldens.
// ---------------------------------------------------------------------------

export const GOLDEN = cases;
export const GOLDEN_ENGINE_VERSION = cases.engine_version;

const CASE = Object.fromEntries(cases.cases.map((c) => [c.name, c]));
const DISAGREEMENT = Object.fromEntries(cases.disagreements.map((d) => [d.case, d]));

export const goldenCase = (name) => {
  const c = CASE[name];
  if (!c) throw new Error(`no published case named ${name}`);
  return c;
};

export const goldenCaseNames = () => cases.cases.map((c) => c.name);

// ---------------------------------------------------------------------------
// Helpers. Pure, and none of them computes an economic quantity.
// ---------------------------------------------------------------------------

const clone = (o) => JSON.parse(JSON.stringify(o));
const withCfg = (c, patch) => ({ ...clone(c), cfg: { ...clone(c.cfg), ...patch } });
const run = (c) => computeCashFlow({ cfg: c.cfg, prodRows: c.prodRows, capexRows: c.capexRows, opexRows: c.opexRows });
const mapToRows = (m) => [...m.entries()].map(([year, usd]) => ({ year, usd }));

/** The headline KPI subset every panel prints in the same order. */
export const kpiSummary = (k) => ({
  npv: k.npv,
  irrPct: k.irr ?? null,
  payback: k.payback,
  paybackYears: k.payback_years ?? null,
  discountedPaybackYears: k.discounted_payback_years ?? null,
  dpi: k.dpi ?? null,
  takePct: k.government_take_pct ?? null,
  discountedTakePct: k.government_take_pct_discounted ?? null,
  totalRevenue: k.total_revenue,
  totalCapex: k.total_capex,
  totalOpex: k.total_opex,
  totalTax: k.total_tax,
  totalNetCashFlow: k.total_net_cash_flow,
  pvBasis: k.pv_basis,
  convention: k.discounting_convention,
  appliedRatePct: k.discount_rate_applied_pct,
  framework: k.fiscal_framework,
});

// ---------------------------------------------------------------------------
// THE TEACHING FIELD, AKATA.
//
// Designed for this course. It is not a golden case and it is not graded
// anywhere. Seven years of a declining oil field with associated gas at 800
// scf per barrel, capex in the first two years, flat opex in money of the day
// that the escalator inflates, joint venture terms on a real basis, so the
// same rows can be read by all three tiers. Copied verbatim from the digest
// builder so the digest and this lab agree.
// ---------------------------------------------------------------------------

export const AKATA = {
  cfg: {
    base_year: 2029, fiscal_regime: 'JV', present_value_basis: 'real',
    discount_rate_pct: 10, inflation_rate_pct: 3,
    oil_price_usd_bbl: 82, gas_price_usd_mscf: 3.2, condensate_price_usd_bbl: 0,
    oil_price_escalator_pct: 2, gas_price_escalator_pct: 2, condensate_price_escalator_pct: 0,
    opex_escalator_pct: 3, capex_escalator_pct: 0,
    jv_working_interest_pct: 100, jv_royalty_pct: 15, jv_tax_rate_pct: 40,
  },
  prodRows: [
    { year: 2029, akata_oil_bbl: 2200000, akata_gas_mscf: 1760000 },
    { year: 2030, akata_oil_bbl: 1850000, akata_gas_mscf: 1480000 },
    { year: 2031, akata_oil_bbl: 1550000, akata_gas_mscf: 1240000 },
    { year: 2032, akata_oil_bbl: 1300000, akata_gas_mscf: 1040000 },
    { year: 2033, akata_oil_bbl: 1090000, akata_gas_mscf: 872000 },
    { year: 2034, akata_oil_bbl: 920000, akata_gas_mscf: 736000 },
    { year: 2035, akata_oil_bbl: 770000, akata_gas_mscf: 616000 },
  ],
  capexRows: [{ year: 2029, amount_usd: 210000000 }, { year: 2030, amount_usd: 45000000 }],
  opexRows: [2029, 2030, 2031, 2032, 2033, 2034, 2035].map((y) => ({ year: y, total_opex_usd: 24000000 })),
};

export const AKATA_LABEL = 'AKATA';
export const AKATA_YEARS = AKATA.prodRows.map((r) => r.year);

/** AKATA under production sharing terms, as the digest's Section 13 sets it. */
export const AKATA_PSC_PATCH = {
  fiscal_regime: 'PSC', psc_royalty_pct: 10, psc_cost_oil_cap_pct: 60,
  psc_contractor_profit_share_pct: 45, psc_tax_rate_pct: 50, psc_working_interest_pct: 100,
};

/** AKATA under the PIA, as the digest's Section 20 sets it. */
export const AKATA_PIA_PATCH = {
  fiscal_regime: 'PIA', pia_terrain: 'shallow_water', pia_license_type: 'PML', pia_lease_status: 'converted',
  pia_water_depth_m: 60, pia_marginal_field_pre_2021: false, pia_hct_rate_override_pct: null,
  pia_cit_rate_pct: 30, pia_tet_rate_pct: 2.5, pia_nddc_levy_pct_of_opex: 3, pia_nddc_levy_fixed_usd: null,
  pia_prior_year_opex_usd: 0, pia_capex_recovery_years: 5, pia_cpr_limit_pct: 65,
  pia_production_allowance_per_bbl_converted: 2.5, pia_production_allowance_per_bbl_new: 8, pia_production_allowance_pct_of_price: 20,
  pia_under_nta_2025_override: 'auto', pia_prior_cumulative_oil_bbl: 0,
};

/** The six tail years the digest's Section 18 appends for the economic limit. */
export const AKATA_TAIL_ROWS = [
  [2036, 640000, 512000], [2037, 530000, 424000], [2038, 440000, 352000],
  [2039, 360000, 288000], [2040, 300000, 240000], [2041, 250000, 200000],
];

export const akataWithTail = () => {
  const c = clone(AKATA);
  for (const [y, o, g] of AKATA_TAIL_ROWS) {
    c.prodRows.push({ year: y, akata_oil_bbl: o, akata_gas_mscf: g });
    c.opexRows.push({ year: y, total_opex_usd: 24000000 });
  }
  return c;
};

// ---------------------------------------------------------------------------
// SECTION 1 and 2. The engine, its refusals, and every published case.
// ---------------------------------------------------------------------------

/** The eight uploads the engine refuses, with the message each one throws. */
export const refusals = () => cases.errors.map((e) => {
  let message = '(no error thrown)';
  try { run(e); } catch (err) { message = String(err.message); }
  return { name: e.name, message, expectedFragment: e.error_contains ?? null };
});

/** Every published case, one line each: name, note and the headline KPIs. */
export const publishedCaseLines = () => cases.cases.map((c) => {
  const res = run(c);
  return { name: c.name, note: c.note, rows: res.cashFlowData.length, ...kpiSummary(res.kpis) };
});

/** Run one published case and hand back its rows and KPIs untouched. */
export const publishedCase = (name) => {
  const c = goldenCase(name);
  const res = run(c);
  return { name, note: c.note, cfg: c.cfg, prodRows: c.prodRows, capexRows: c.capexRows, opexRows: c.opexRows, rows: res.cashFlowData, kpis: res.kpis };
};

// ---------------------------------------------------------------------------
// SECTION 3. The hand-derived JV case, and each lever moved on its own.
// ---------------------------------------------------------------------------

export const JV_ANALYTIC_CASE = 'jv_analytic_decision_kpis';

export const jvAnalyticCase = () => publishedCase(JV_ANALYTIC_CASE);

export const JV_LEVERS = [
  ['jv_royalty_pct', 0], ['jv_royalty_pct', 10], ['jv_royalty_pct', 30],
  ['jv_tax_rate_pct', 0], ['jv_tax_rate_pct', 30], ['jv_tax_rate_pct', 85],
  ['jv_working_interest_pct', 60], ['jv_working_interest_pct', 25],
];

/** Royalty, tax rate and working interest each moved alone on the two-year JV case. */
export const jvLeverSweep = () => {
  const c = goldenCase(JV_ANALYTIC_CASE);
  const base = run(c);
  const row = (res, key, value) => ({
    key, value,
    year1Royalty: res.cashFlowData[0].royalty,
    year1Tax: res.cashFlowData[0].tax,
    year1Net: res.cashFlowData[0].net_cash_flow,
    year2Net: res.cashFlowData[1].net_cash_flow,
    npv: res.kpis.npv,
    irrPct: res.kpis.irr ?? null,
    takePct: res.kpis.government_take_pct ?? null,
  });
  return [
    row(base, 'as published', null),
    ...JV_LEVERS.map(([k, x]) => row(run(withCfg(c, { [k]: x })), k, x)),
  ];
};

// ---------------------------------------------------------------------------
// SECTION 4. From rows to years.
// ---------------------------------------------------------------------------

export const INGESTION_CASES = [
  'per_well_beats_total_rollup', 'month_index_rows', 'usd_fallback_parts',
  'duplicate_identical_aliases', 'case_insensitive_headers', 'alaoma_csv_ingestion',
];

/** Each ingestion case as uploaded, as the engine reads it, and as it results. */
export const ingestionCases = () => INGESTION_CASES.map((name) => {
  const c = goldenCase(name);
  const res = run(c);
  return {
    name, note: c.note,
    prodRows: c.prodRows, capexRows: c.capexRows, opexRows: c.opexRows,
    volumes: extractAnnualVolumes(c.prodRows, c.cfg.base_year),
    capex: mapToRows(extractAnnualCapex(c.capexRows, c.cfg.base_year)),
    opex: mapToRows(extractAnnualOpex(c.opexRows, c.cfg.base_year)),
    ...kpiSummary(res.kpis),
  };
});

export const VOLUME_COLUMN_PROBES = [
  'oil_bbl', 'w1_oil_bbl', 'total_oil_bbl', 'gas_mscf', 'w2_gas_mscf', 'condensate_bbl', 'water_bbl',
  'OIL_BBL', 'oil', 'oil_price_usd_bbl', 'opex_usd', 'year', 'date', 'month_index', 'w1_oil_bbl_forecast',
];

export const volumeColumnTable = () => VOLUME_COLUMN_PROBES.map((key) => ({ key, isVolume: isVolumeColumn(key) }));

// ---------------------------------------------------------------------------
// SECTION 5. Prices.
// ---------------------------------------------------------------------------

export const PRICE_CASES = [
  'flat_escalator', 'escalator_defaults_to_inflation', 'deck_step_hold',
  'deck_differential', 'deck_scale', 'deck_before_first_entry',
];

export const priceCases = () => PRICE_CASES.map((name) => {
  const c = goldenCase(name);
  const res = run(c);
  return {
    name, note: c.note, cfg: c.cfg,
    byYear: res.cashFlowData.map((q) => ({
      year: q.year, appliedOilPrice: q.applied_oil_price, grossRevenue: q.gross_revenue, opex: q.opex, capex: q.capex,
    })),
  };
});

export const DECK_RESOLVER_YEARS = [2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035];

/** resolveStreamPrice on its own: with the deck_step_hold deck, without a deck escalated, without a deck flat. */
export const deckResolverTable = () => {
  const deck = parsePriceDeck(goldenCase('deck_step_hold').cfg);
  const line = (label, d, flat, esc) => ({
    label, byYear: DECK_RESOLVER_YEARS.map((y) => ({ year: y, price: resolveStreamPrice(d, flat, esc, 2030, y) })),
  });
  return {
    parsedOilDeck: deck.oil,
    gasDeckEntries: deck.gas.length,
    condensateDeckEntries: deck.condensate.length,
    lines: [
      line('deck_step_hold deck, flat 80, escalator 10 percent, base 2030', deck.oil, 80, 0.10),
      line('no deck, flat 80, escalator 10 percent, base 2030', [], 80, 0.10),
      line('no deck, flat 80, escalator 0', [], 80, 0),
    ],
  };
};

export const mixedStreamsCase = () => {
  const p = publishedCase('pia_mixed_streams_hct_apportioned');
  return {
    ...p,
    totalBoe: p.kpis.total_boe, totalOil: p.kpis.total_oil_bbl,
    totalCondensate: p.kpis.total_condensate_bbl, totalGas: p.kpis.total_gas_mscf,
  };
};

// ---------------------------------------------------------------------------
// SECTION 6. AKATA under joint venture terms.
// ---------------------------------------------------------------------------

/** AKATA's ledger with any config patch applied; the rows are the engine's own. */
export const akataLedger = (patch = {}) => {
  const c = withCfg(AKATA, patch);
  const res = run(c);
  return { cfg: c.cfg, rows: res.cashFlowData, kpis: res.kpis };
};

export const akataKpis = (patch = {}) => akataLedger(patch).kpis;

/** One AKATA year's cascade, in cascade order, ready to be read as a sentence. */
export const akataYearCascade = (year, patch = {}) => {
  const { rows, cfg } = akataLedger(patch);
  const q = rows.find((r) => r.year === year);
  if (!q) return null;
  return {
    year,
    oilBbl: q.oil_bbl, oilPrice: q.applied_oil_price,
    gasMscf: q.gas_mscf, gasPrice: q.applied_gas_price,
    grossRevenue: q.gross_revenue,
    royaltyPct: cfg.jv_royalty_pct, royalty: q.royalty,
    opex: q.opex, capex: q.capex, depreciation: q.depreciation,
    taxableIncome: q.taxable_income,
    taxPct: cfg.jv_tax_rate_pct, tax: q.tax,
    netCashFlow: q.net_cash_flow, realNetCashFlow: q.real_net_cash_flow,
    discountedCashFlow: q.discounted_cash_flow, cumulativeCashFlow: q.cumulative_cash_flow,
  };
};

export const WI_SWEEP_PCT = [100, 75, 60, 40, 25];

export const akataWorkingInterestSweep = () => WI_SWEEP_PCT.map((wi) => {
  const res = run(withCfg(AKATA, { jv_working_interest_pct: wi }));
  const q = res.cashFlowData[0];
  return {
    wiPct: wi,
    year1GrossRevenue: q.gross_revenue, year1Royalty: q.royalty, year1Tax: q.tax, year1Net: q.net_cash_flow,
    totalOilBbl: res.kpis.total_oil_bbl, totalBoe: res.kpis.total_boe,
    npv: res.kpis.npv, irrPct: res.kpis.irr, takePct: res.kpis.government_take_pct,
    unitTechnicalCost: res.kpis.unit_technical_cost_usd_per_boe,
    reportedWiPct: res.kpis.working_interest_pct,
  };
});

export const DEPRECIATION_CASES = [
  ['default, jv_psc_depr_years unset (10 years)', {}],
  ['jv_psc_depr_years 7', { jv_psc_depr_years: 7 }],
  ['jv_psc_depr_years 5', { jv_psc_depr_years: 5 }],
  ['jv_psc_depr_years 1', { jv_psc_depr_years: 1 }],
  ['depreciation_method nigeria_ppt', { depreciation_method: 'nigeria_ppt' }],
];

export const akataDepreciationCases = () => DEPRECIATION_CASES.map(([label, patch]) => {
  const res = run(withCfg(AKATA, patch));
  return {
    label,
    byYear: res.cashFlowData.map((q) => ({ year: q.year, depreciation: q.depreciation, tax: q.tax })),
    depreciationSum: res.cashFlowData.reduce((s, q) => s + q.depreciation, 0),
    totalCapex: res.kpis.total_capex, totalTax: res.kpis.total_tax, npv: res.kpis.npv,
  };
});

// ---------------------------------------------------------------------------
// SECTION 7. Discounting: basis, convention, valuation year, sunk years.
// ---------------------------------------------------------------------------

export const BASIS_COMBINATIONS = [
  ['nominal', 'end_year'], ['nominal', 'mid_year'], ['real', 'end_year'], ['real', 'mid_year'],
];

/** The four basis and convention combinations on AKATA. */
export const akataBasisMatrix = () => BASIS_COMBINATIONS.map(([basis, convention]) => {
  const res = run(withCfg(AKATA, { present_value_basis: basis, discounting_convention: convention }));
  return {
    basis, convention,
    appliedRatePct: res.kpis.discount_rate_applied_pct,
    npv: res.kpis.npv,
    byYear: res.cashFlowData.map((q) => ({
      year: q.year, netCashFlow: q.net_cash_flow, realNetCashFlow: q.real_net_cash_flow, discountedCashFlow: q.discounted_cash_flow,
    })),
    irrPct: res.kpis.irr,
    discountedPaybackYears: res.kpis.discounted_payback_years,
    totalNetCashFlow: res.kpis.total_net_cash_flow,
  };
});

/** The 2033 flow deflated and discounted both ways, and the zero-inflation check. */
export const akataDeflationExample = () => {
  const nom = run(withCfg(AKATA, { present_value_basis: 'nominal' }));
  const re = run(withCfg(AKATA, { present_value_basis: 'real' }));
  const zeroPatch = { inflation_rate_pct: 0, opex_escalator_pct: 0, oil_price_escalator_pct: 0, gas_price_escalator_pct: 0 };
  const zero = run(withCfg(AKATA, { present_value_basis: 'real', ...zeroPatch }));
  const zeroN = run(withCfg(AKATA, { present_value_basis: 'nominal', ...zeroPatch }));
  return {
    year: nom.cashFlowData[4].year,
    nominalFlow: nom.cashFlowData[4].net_cash_flow,
    realFlow: re.cashFlowData[4].real_net_cash_flow,
    discountedOnRealBasis: re.cashFlowData[4].discounted_cash_flow,
    discountedOnNominalBasis: nom.cashFlowData[4].discounted_cash_flow,
    zeroInflationRealNpv: zero.kpis.npv,
    zeroInflationNominalNpv: zeroN.kpis.npv,
    zeroInflationRealRatePct: zero.kpis.discount_rate_applied_pct,
    zeroInflationNominalRatePct: zeroN.kpis.discount_rate_applied_pct,
  };
};

export const INFLATION_SWEEP_PCT = [0, 1, 2, 3, 5, 8];

export const akataInflationSweep = () => INFLATION_SWEEP_PCT.map((inflationPct) => {
  const res = run(withCfg(AKATA, { inflation_rate_pct: inflationPct }));
  return {
    inflationPct,
    appliedRealRatePct: res.kpis.discount_rate_applied_pct,
    npv: res.kpis.npv,
    totalNetCashFlowNominal: res.kpis.total_net_cash_flow_nominal,
    totalNetCashFlowReal: res.kpis.total_net_cash_flow_real,
  };
});

export const DISCOUNTING_CASES = ['mid_year_discounting', 'valuation_year_forward', 'valuation_year_sunk'];

export const publishedDiscountingCases = () => DISCOUNTING_CASES.map((name) => {
  const p = publishedCase(name);
  return {
    ...p,
    valuationYear: p.kpis.valuation_year ?? null,
    sunkNetCashFlow: p.kpis.sunk_net_cash_flow ?? null,
    rowsFlaggedSunk: p.rows.filter((q) => q.sunk === true).length,
  };
});

export const VALUATION_YEARS = [2029, 2030, 2031, 2032];

/** AKATA valued from later years, prior years kept and prior years sunk. */
export const akataValuationYears = () => VALUATION_YEARS.flatMap((valuationYear) => [false, true].map((sunk) => {
  const res = run(withCfg(AKATA, { valuation_year: valuationYear, treat_prior_as_sunk: sunk }));
  return {
    valuationYear, treatPriorAsSunk: sunk,
    npv: res.kpis.npv, irrPct: res.kpis.irr ?? null, payback: res.kpis.payback,
    sunkNetCashFlow: res.kpis.sunk_net_cash_flow ?? null,
    totalCapex: res.kpis.total_capex, totalNetCashFlow: res.kpis.total_net_cash_flow,
    rowsFlaggedSunk: res.cashFlowData.filter((q) => q.sunk === true).length,
  };
}));

// ---------------------------------------------------------------------------
// SECTION 8. The NPV profile, and the point that misses.
// ---------------------------------------------------------------------------

export const STANDARD_PROFILE_RATES_PCT = [0, 5, 8, 10, 12, 15, 20];

const profileOf = (label, res, baseYear) => {
  const k = res.kpis;
  const labelled = k.npv_profile.find((q) => !STANDARD_PROFILE_RATES_PCT.includes(q.rate_pct))
    || k.npv_profile.find((q) => q.rate_pct === k.discount_rate_applied_pct)
    || null;
  const live = res.cashFlowData.filter((q) => q.sunk !== true);
  const flows = live.map((q) => (k.pv_basis === 'real' ? q.real_net_cash_flow : q.net_cash_flow));
  const exactAtAppliedRate = npv(flows, k.discount_rate_applied_pct / 100, k.valuation_year ?? baseYear, live[0].year);
  const d = DISAGREEMENT[label] || null;
  return {
    label,
    profile: k.npv_profile.map((q) => ({ ratePct: q.rate_pct, npv: q.npv })),
    headlineNpv: k.npv,
    appliedRatePct: k.discount_rate_applied_pct,
    appliedRateLabelPct: labelled ? labelled.rate_pct : null,
    labelledPointNpv: labelled ? labelled.npv : null,
    gap: labelled ? labelled.npv - k.npv : null,
    exactAtAppliedRate,
    exactIsComparable: k.discounting_convention !== 'mid_year',
    basis: k.pv_basis,
    convention: k.discounting_convention,
    oracle: d ? { npv: d.oracle.npv, ratePct: d.oracle.rate_pct, gap: d.gap } : null,
  };
};

/** AKATA's profile: the engine's seven standard points plus the applied point, and the gap. */
export const akataProfile = (patch = {}) => {
  const c = withCfg(AKATA, patch);
  return profileOf(AKATA_LABEL, run(c), c.cfg.base_year);
};

export const PROFILE_GAP_CASES = [
  'multiyear_pia_real', 'multiyear_jv_real', 'multiyear_pia_midyear_real', 'pia_loss_relief',
  'allowance_cap_midyear', 'jv_analytic_decision_kpis', 'multiyear_pia_nominal',
];

export const profileGapCases = () => [
  akataProfile(),
  ...PROFILE_GAP_CASES.map((name) => profileOf(name, run(goldenCase(name)), goldenCase(name).cfg.base_year)),
];

// ---------------------------------------------------------------------------
// SECTION 9. The internal rate of return.
// ---------------------------------------------------------------------------

export const IRR_CURVE_RATES_PCT = [-90, -75, -50, -25, -10, 0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20, 25, 30, 33, 40, 50, 75, 100, 150, 175, 200];

export const MULTI_ROOT_VECTORS = ['two_roots_2_and_6', 'two_roots_10_and_20', 'two_roots_5_and_50', 'two_roots_minus73_and_173', 'three_roots_0_7_33', 'three_roots_10_20_40'];

/** The golden's fifteen vectors through irr(), each with its sampled NPV curve. */
export const irrVectors = () => cases.irr.map((c) => {
  const eng = irr(c.flows);
  const engineIrrPct = eng === null ? null : eng * 100;
  const oracleIrrPct = c.disagreement ? c.disagreement.oracle_irr_pct : null;
  const at = (pct) => npv(c.flows, pct / 100, 0, 0);
  return {
    name: c.name,
    flows: c.flows,
    note: c.note ?? null,
    engineIrrPct,
    goldenIrrPct: c.irr_pct ?? null,
    oracleIrrPct,
    disagrees: oracleIrrPct !== null,
    multiRoot: MULTI_ROOT_VECTORS.includes(c.name),
    npvAt0: at(0), npvAt10: at(10), npvAt20: at(20),
    npvAtEngineIrr: engineIrrPct === null ? null : at(engineIrrPct),
    npvAtOracleIrr: oracleIrrPct === null ? null : at(oracleIrrPct),
    curve: IRR_CURVE_RATES_PCT.map((ratePct) => ({ ratePct, npv: at(ratePct) })),
  };
});

export const IRR_NEIGHBOURS = [
  ['as configured', {}],
  ['oil price 60', { oil_price_usd_bbl: 60 }],
  ['oil price 45', { oil_price_usd_bbl: 45 }],
  ['oil price 38', { oil_price_usd_bbl: 38 }],
  ['capex doubled (420000000 and 90000000)', null],
  ['abandonment 60000000 in 2035', { abandonment_cost_usd: 60000000 }],
  ['abandonment 200000000 in 2035', { abandonment_cost_usd: 200000000 }],
];

/** AKATA and its neighbours: the nominal flows, the IRR the engine reports, and the NPV of the flows at three rates. */
export const akataIrrNeighbours = () => IRR_NEIGHBOURS.map(([label, patch]) => {
  const c = patch === null
    ? { ...clone(AKATA), capexRows: [{ year: 2029, amount_usd: 420000000 }, { year: 2030, amount_usd: 90000000 }] }
    : withCfg(AKATA, patch);
  const res = run(c);
  const flows = res.cashFlowData.map((q) => q.net_cash_flow);
  const first = res.cashFlowData[0].year;
  return {
    label, flows,
    irrPct: res.kpis.irr ?? null,
    npv: res.kpis.npv,
    npvOfFlowsAt0: npv(flows, 0, first, first),
    npvOfFlowsAt100: npv(flows, 1, first, first),
    npvOfFlowsAt300: npv(flows, 3, first, first),
    payback: res.kpis.payback,
    terminalNegative: flows[flows.length - 1] < 0,
    curve: IRR_CURVE_RATES_PCT.map((ratePct) => ({ ratePct, npv: npv(flows, ratePct / 100, first, first) })),
  };
});

// ---------------------------------------------------------------------------
// SECTION 10. Payback, discounted payback, DPI and take.
// ---------------------------------------------------------------------------

export const PAYBACK_CASES = ['jv_analytic_decision_kpis', 'multiyear_jv_real', 'multiyear_pia_real', 'zero_rates_capex_only', 'single_year_positive', 'jv_loss_unused_at_cessation'];

const addingUpOf = (label, res) => {
  const k = res.kpis;
  return {
    label,
    cumulativeByYear: res.cashFlowData.map((q) => ({ year: q.year, netCashFlow: q.net_cash_flow, cumulative: q.cumulative_cash_flow })),
    payback: k.payback,
    paybackYears: k.payback_years ?? null,
    discountedPaybackYears: k.discounted_payback_years ?? null,
    pvCapex: k.pv_capex ?? null,
    npv: k.npv,
    dpi: k.dpi ?? null,
    takePct: k.government_take_pct ?? null,
    discountedTakePct: k.government_take_pct_discounted ?? null,
    unitTechnicalCost: k.unit_technical_cost_usd_per_boe ?? null,
    opexPerBoe: k.opex_usd_per_boe ?? null,
    totalRevenue: k.total_revenue, totalCapex: k.total_capex, totalOpex: k.total_opex, totalTax: k.total_tax,
    totalNetCashFlow: k.total_net_cash_flow,
    totalOilBbl: k.total_oil_bbl ?? null, totalGasMscf: k.total_gas_mscf ?? null, totalBoe: k.total_boe ?? null,
  };
};

export const addingUpTable = () => [
  addingUpOf(AKATA_LABEL, run(AKATA)),
  ...PAYBACK_CASES.map((name) => addingUpOf(name, run(goldenCase(name)))),
];

/** Take on AKATA, decomposed the way the digest states it. */
export const akataTakeDecomposition = () => {
  const k = run(AKATA).kpis;
  return {
    totalRevenue: k.total_revenue, totalCapex: k.total_capex, totalOpex: k.total_opex,
    totalTax: k.total_tax, totalRealNetCashFlow: k.total_net_cash_flow,
    takePct: k.government_take_pct, discountedTakePct: k.government_take_pct_discounted,
  };
};

// ---------------------------------------------------------------------------
// SECTION 11. Sweeps.
// ---------------------------------------------------------------------------

/** The four published sweeps, every point rerun through the engine. */
export const publishedSweeps = () => Object.entries(cases.sweeps).map(([name, sw]) => {
  const key = Object.keys(sw.points[0]).find((k) => !['inputs', 'kpis'].includes(k));
  return {
    name, note: sw.note, key,
    points: sw.points.map((pt) => {
      const res = run(pt.inputs);
      const k = res.kpis;
      return {
        value: pt[key],
        npv: k.npv, irrPct: k.irr ?? null, payback: k.payback, takePct: k.government_take_pct ?? null,
        totalRevenue: k.total_revenue, totalTax: k.total_tax, totalRoyalties: k.total_royalties ?? null,
        unitTechnicalCost: k.unit_technical_cost_usd_per_boe ?? null,
        rows: res.cashFlowData.length,
        economicLimitYear: k.economic_limit_year ?? null,
        yearsTrimmed: k.years_trimmed_by_economic_limit ?? null,
        totalHct: k.total_hct ?? null, totalCit: k.total_cit ?? null, totalProductionAllowance: k.total_production_allowance ?? null,
      };
    }),
  };
});

export const PRICE_SWEEP_USD = [30, 35, 38, 40, 45, 50, 60, 70, 82, 90, 100, 120];

export const akataPriceSweep = () => PRICE_SWEEP_USD.map((oilPrice) => {
  const res = run(withCfg(AKATA, { oil_price_usd_bbl: oilPrice }));
  const k = res.kpis;
  return {
    oilPrice, npv: k.npv, irrPct: k.irr ?? null, payback: k.payback, takePct: k.government_take_pct ?? null,
    totalRevenue: k.total_revenue, totalTax: k.total_tax, totalNetCashFlowReal: k.total_net_cash_flow_real,
    taxByYear: res.cashFlowData.map((q) => q.tax),
  };
});

export const DISCOUNT_SWEEP_PCT = [0, 2, 4, 6, 8, 10, 12, 15, 20, 25];

export const akataDiscountSweep = () => DISCOUNT_SWEEP_PCT.map((nominalRatePct) => {
  const k = run(withCfg(AKATA, { discount_rate_pct: nominalRatePct })).kpis;
  return {
    nominalRatePct, appliedRealRatePct: k.discount_rate_applied_pct, npv: k.npv,
    discountedPaybackYears: k.discounted_payback_years ?? null, dpi: k.dpi, pvCapex: k.pv_capex,
    discountedTakePct: k.government_take_pct_discounted,
  };
});

export const COST_SCALES = [0.6, 0.8, 1.0, 1.2, 1.5, 2.0];

export const akataCostScaleSweep = () => COST_SCALES.map((scale) => {
  const c = clone(AKATA); c.capexRows = c.capexRows.map((q) => ({ ...q, amount_usd: q.amount_usd * scale }));
  const c2 = clone(AKATA); c2.opexRows = c2.opexRows.map((q) => ({ ...q, total_opex_usd: q.total_opex_usd * scale }));
  const k = run(c).kpis; const k2 = run(c2).kpis;
  return {
    scale,
    capexScaled: { npv: k.npv, irrPct: k.irr, payback: k.payback, unitTechnicalCost: k.unit_technical_cost_usd_per_boe },
    opexScaled: { npv: k2.npv, irrPct: k2.irr, payback: k2.payback, opexPerBoe: k2.opex_usd_per_boe },
  };
});

// ---------------------------------------------------------------------------
// SECTION 12. The breakeven oil price.
// ---------------------------------------------------------------------------

export const breakevenCases = () => cases.breakeven.map((c) => {
  const be = computeBreakevenOilPrice({ cfg: c.cfg, prodRows: c.prodRows, capexRows: c.capexRows, opexRows: c.opexRows });
  const npvAtBreakeven = be === null ? null : run(withCfg(c, { oil_price_usd_bbl: be })).kpis.npv;
  return {
    name: c.name, note: c.note ?? null,
    engineBreakeven: be, goldenBreakeven: c.breakeven_usd_bbl ?? null,
    npvAtBreakeven, goldenNpvAtBreakeven: c.npv_at_breakeven ?? null,
    configOilPrice: c.cfg.oil_price_usd_bbl, deck: c.cfg.price_deck ?? null,
  };
});

export const BREAKEVEN_VARIANTS = [
  ['nominal basis', { present_value_basis: 'nominal' }],
  ['discount rate 15', { discount_rate_pct: 15 }],
  ['royalty 20 and tax 50', { jv_royalty_pct: 20, jv_tax_rate_pct: 50 }],
  ['WI 60', { jv_working_interest_pct: 60 }],
  ['with a deck', { price_deck: [{ year: 2029, oil: 82 }] }],
];

export const akataBreakeven = () => {
  const be = computeBreakevenOilPrice(AKATA);
  const at = run(withCfg(AKATA, { oil_price_usd_bbl: be })).kpis;
  return {
    breakeven: be,
    npvAtBreakeven: at.npv, irrAtBreakevenPct: at.irr, takeAtBreakevenPct: at.government_take_pct,
    variants: BREAKEVEN_VARIANTS.map(([label, patch]) => ({ label, breakeven: computeBreakevenOilPrice(withCfg(AKATA, patch)) })),
  };
};

// ---------------------------------------------------------------------------
// SECTION 13. Production sharing: cost recovery, tranches, the credit.
// ---------------------------------------------------------------------------

export const PSC_CASES = ['psc_carryforward', 'psc_tranches', 'psc_tranches_prior_cumulative', 'psc_itc', 'psc_wi_50', 'psc_sinking_fund', 'psc_abandonment_wi_50'];

export const pscCases = () => PSC_CASES.map((name) => {
  const p = publishedCase(name);
  return { ...p, unrecoveredAtCessation: p.kpis.unrecovered_cost_at_cessation ?? null, reportedWiPct: p.kpis.working_interest_pct ?? null };
});

export const APPLY_PSC_BASE = { gross_revenue: 100000000, capex: 60000000, opex: 20000000, depreciation: 0, cumulative_unrecovered_cost: 0 };
export const APPLY_PSC_CAPS = [0.2, 0.4, 0.6, 0.8, 1.0];

/** applyPSC on one year with the cap moving, the carry-in, the tranche table and the credit. */
export const applyPscTable = () => {
  const base = APPLY_PSC_BASE;
  const line = (cap, inputs) => {
    const o = applyPSC(inputs, 0.10, cap, 0.5, 0.5, 0);
    return {
      cap, royalty: o.royalty,
      costRecovered: o.net_cash_flow + inputs.capex + inputs.opex + o.tax - o.taxable_income,
      contractorProfitOil: o.taxable_income, tax: o.tax, net: o.net_cash_flow, carriedForward: o.cumulative_unrecovered_cost_after,
    };
  };
  const tr = goldenCase('psc_tranches').cfg.psc_profit_tranches;
  const withItc = applyPSC(base, 0.10, 0.8, 0.5, 0.5, 40000000);
  return {
    base,
    caps: APPLY_PSC_CAPS.map((cap) => line(cap, base)),
    carryIn: { broughtForward: 30000000, cap: 0.4, ...line(0.4, { ...base, cumulative_unrecovered_cost: 30000000 }) },
    tranches: tr,
    trancheTable: [0, 999999, 1000000, 2500000, 6000000].map((bbl) => ({ cumulativeBbl: bbl, contractorShare: pscTrancheShare(tr, bbl) })),
    itc: { available: 40000000, used: withItc.itc_used, carried: withItc.itc_carryforward_after, taxBeforeCredit: applyPSC(base, 0.10, 0.8, 0.5, 0.5, 0).tax },
  };
};

export const PSC_CAP_SWEEP_PCT = [30, 45, 60, 80, 100];

/**
 * AKATA under production sharing at one cost oil cap, with the pool.
 *
 * THE ROWS DO NOT CARRY THE POOL. A PSC row reports royalty, taxable income
 * (the contractor profit oil), tax and net cash flow, and nothing about how
 * much cost was recovered or how much is still carried; no KPI reports the
 * pool at cessation either. The pool here is read by marching the engine's
 * own applyPSC over the rows the engine produced, year by year, with the
 * carried amount handed forward exactly as computeCashFlow does internally.
 */
export const akataUnderPsc = (capPct = AKATA_PSC_PATCH.psc_cost_oil_cap_pct) => {
  const c = withCfg(AKATA, { ...AKATA_PSC_PATCH, psc_cost_oil_cap_pct: capPct });
  const res = run(c);
  const royalty = c.cfg.psc_royalty_pct / 100;
  const share = c.cfg.psc_contractor_profit_share_pct / 100;
  const taxRate = c.cfg.psc_tax_rate_pct / 100;
  let carry = 0;
  const march = res.cashFlowData.map((q) => {
    const o = applyPSC({ gross_revenue: q.gross_revenue, capex: q.capex, opex: q.opex, depreciation: 0, cumulative_unrecovered_cost: carry }, royalty, capPct / 100, share, taxRate, 0);
    const recovered = o.net_cash_flow + q.capex + q.opex + o.tax - o.taxable_income;
    const poolBefore = carry;
    carry = o.cumulative_unrecovered_cost_after;
    return { year: q.year, poolBefore, costIn: q.capex + q.opex, recovered, poolAfter: carry, tax: q.tax, contractorProfitOil: q.taxable_income, net: q.net_cash_flow };
  });
  return {
    capPct, cfg: c.cfg, rows: res.cashFlowData, kpis: res.kpis, march,
    poolAtCessation: carry,
    unrecoveredAtCessationReported: res.kpis.unrecovered_cost_at_cessation ?? null,
  };
};

export const akataPscCapSweep = () => PSC_CAP_SWEEP_PCT.map((cap) => akataUnderPsc(cap));

// ---------------------------------------------------------------------------
// SECTION 14. The PIA royalties.
// ---------------------------------------------------------------------------

export const TERRAINS = ['onshore', 'shallow_water', 'deep_offshore', 'frontier', 'marginal_field'];
export const ROYALTY_RATE_PROBES_BOPD = [1000, 5000, 6000, 8000, 10000, 12000, 20000, 50000, 50001, 60000, 120000];
export const PRICE_ROYALTY_YEARS = [2021, 2025, 2026, 2030, 2035];
export const PRICE_ROYALTY_PROBES = [40, 50, 55, 60, 75, 80, 100, 110, 125, 150, 160, 200];

export const HCT_RATE_CASES = [
  ['shallow_water PML converted, PIA', ['shallow_water', 'PML', false, null, 'pia_only']],
  ['shallow_water PPL, PIA', ['shallow_water', 'PPL', false, null, 'pia_only']],
  ['onshore PML marginal pre-2021, PIA', ['onshore', 'PML', true, null, 'pia_only']],
  ['deep_offshore PML, PIA', ['deep_offshore', 'PML', false, null, 'pia_only']],
  ['deep_offshore PML, NTA conservative', ['deep_offshore', 'PML', false, null, 'nta_2025', 'conservative_zero']],
  ['deep_offshore PML, NTA aggressive', ['deep_offshore', 'PML', false, null, 'nta_2025', 'aggressive_pml_30']],
  ['deep_offshore PML, NTA custom 12.5', ['deep_offshore', 'PML', false, null, 'nta_2025', 'custom', 12.5]],
  ['frontier, either', ['frontier', 'PML', false, null, 'pia_only']],
  ['override 20 anywhere', ['onshore', 'PML', false, 20, 'pia_only']],
];

export const royaltyTables = () => ({
  oilByTerrain: TERRAINS.map((terrain) => ({
    terrain, byRate: ROYALTY_RATE_PROBES_BOPD.map((bopd) => ({ bopd, rate: deriveOilRoyaltyRate(terrain, bopd) })),
  })),
  gasByTerrain: TERRAINS.map((terrain) => ({ terrain, rate: deriveGasRoyaltyRate(terrain) })),
  priceAnchors: PRICE_ROYALTY_YEARS.map((year) => ({
    year, terrain: 'shallow_water',
    byPrice: PRICE_ROYALTY_PROBES.map((price) => ({ price, rate: derivePriceRoyaltyRate(price, year, 'shallow_water') })),
  })),
  frontierAt200In2025: derivePriceRoyaltyRate(200, 2025, 'frontier'),
  hctRates: HCT_RATE_CASES.map(([label, args]) => ({ label, rate: deriveHctRate(...args) })),
});

export const TERRAIN_CASES = [
  'pia_deep_offshore_full', 'pia_deep_offshore_wi_50', 'pia_deep_offshore_naive_30k', 'pia_deep_offshore_nta_aggressive',
  'pia_deep_offshore_nta_custom', 'pia_marginal_field_blend', 'pia_frontier_exempt', 'pia_onshore_new_lease',
  'pia_high_price_royalty_tiers', 'pia_price_royalty_ceiling', 'pia_hct_override', 'pia_ppl_license',
];

const piaTotalsOf = (k) => ({
  totalRoyalties: k.total_royalties ?? null, totalHct: k.total_hct ?? null, totalCit: k.total_cit ?? null,
  totalTet: k.total_tet ?? null, totalDevLevy: k.total_dev_levy ?? null, totalHcdt: k.total_hcdt ?? null,
  totalNddc: k.total_nddc ?? null, totalProductionAllowance: k.total_production_allowance ?? null,
  totalTax: k.total_tax, reportedWiPct: k.working_interest_pct ?? null, totalOilBbl: k.total_oil_bbl ?? null,
  framework: k.fiscal_framework ?? null,
});

export const terrainCases = () => TERRAIN_CASES.map((name) => {
  const p = publishedCase(name);
  return { ...p, ...piaTotalsOf(p.kpis) };
});

// ---------------------------------------------------------------------------
// SECTION 15. The hydrocarbon tax cascade.
// ---------------------------------------------------------------------------

export const HCT_CASCADE_CASES = [
  'pia_worked_example', 'allowance_cap_midyear', 'cpr_forfeiture', 'pia_cpr_carry_two_years', 'pia_gas_only_hct_zero',
  'pia_gas_only_legacy_hct', 'pia_prior_year_opex_zero', 'multiyear_pia_real', 'multiyear_pia_nominal', 'multiyear_pia_midyear_real',
];

export const hctCascadeCases = () => HCT_CASCADE_CASES.map((name) => {
  const p = publishedCase(name);
  return { ...p, ...piaTotalsOf(p.kpis), cprForfeitedAtCessation: p.kpis.cpr_forfeited_at_cessation ?? null, totalBoe: p.kpis.total_boe ?? null };
});

export const ALLOWANCE_CASES = [
  ['converted lease, 1000000 bbl at 80', 'pia_worked_example', 1000000, 80, 0],
  ['converted lease, 1000000 bbl at 10 (pct-of-price cap binds)', 'pia_worked_example', 1000000, 10, 0],
  ['converted lease, 1000000 bbl at 12.5', 'pia_worked_example', 1000000, 12.5, 0],
  ['new shallow lease, 1000000 bbl at 80, prior 0', 'allowance_cap_midyear', 1000000, 80, 0],
  ['new shallow lease, 1000000 bbl at 80, prior 99000000', 'allowance_cap_midyear', 1000000, 80, 99000000],
  ['new shallow lease, 1000000 bbl at 80, prior 99500000', 'allowance_cap_midyear', 1000000, 80, 99500000],
  ['new shallow lease, 1000000 bbl at 80, prior 100000000', 'allowance_cap_midyear', 1000000, 80, 100000000],
  ['new shallow lease, 1000000 bbl at 30, prior 0', 'allowance_cap_midyear', 1000000, 30, 0],
  ['zero barrels', 'allowance_cap_midyear', 0, 80, 0],
];

export const allowanceCases = () => ALLOWANCE_CASES.map(([label, caseName, bbl, price, prior]) => {
  const o = computeProductionAllowance({ ...goldenCase(caseName).cfg }, bbl, price, prior);
  return { label, bbl, price, prior, allowance: o.allowance, eligibleBbl: o.eligible_bbl, capApplied: o.cap_applied };
});

export const CPR_CAP_SWEEP_PCT = [30, 40, 50, 65, 80, 100];

export const cprCapSweep = () => CPR_CAP_SWEEP_PCT.map((cprPct) => {
  const res = run(withCfg(goldenCase('pia_worked_example'), { pia_cpr_limit_pct: cprPct }));
  const q = res.cashFlowData[0];
  return {
    cprPct, cprCap: q.cpr_cap, claimed: q.cpr_costs_claimed, deferred: q.cpr_deferred_to_next,
    hctAssessable: q.hct_assessable_profit, hctChargeable: q.hct_chargeable_profit, hct: q.hct_tax,
    citChargeable: q.cit_chargeable_profit, cit: q.cit_tax, net: q.net_cash_flow, npv: res.kpis.npv,
    cprForfeitedAtCessation: res.kpis.cpr_forfeited_at_cessation ?? null,
  };
});

export const RECOVERY_YEARS = [1, 2, 5, 10];

export const recoveryYearsSweep = () => RECOVERY_YEARS.map((years) => {
  const res = run(withCfg(goldenCase('pia_worked_example'), { pia_capex_recovery_years: years }));
  const q = res.cashFlowData[0];
  return {
    years, claimed: q.cpr_costs_claimed, deferred: q.cpr_deferred_to_next,
    hctChargeable: q.hct_chargeable_profit, hct: q.hct_tax, citChargeable: q.cit_chargeable_profit, cit: q.cit_tax, npv: res.kpis.npv,
  };
});

// ---------------------------------------------------------------------------
// SECTION 16. TET or the development levy: the framework switch.
// ---------------------------------------------------------------------------

export const FRAMEWORK_CASES = ['nta_switch_force_pia', 'nta_switch_force_nta', 'nta_auto_by_base_year', 'min_etr_85', 'min_etr_not_binding'];

export const frameworkCases = () => FRAMEWORK_CASES.map((name) => {
  const p = publishedCase(name);
  return { ...p, ...piaTotalsOf(p.kpis), totalMinEtrTopup: p.kpis.total_min_etr_topup ?? null };
});

export const FRAMEWORK_PROBES = [
  ['base 2025, auto', { base_year: 2025, pia_under_nta_2025_override: 'auto' }],
  ['base 2026, auto', { base_year: 2026, pia_under_nta_2025_override: 'auto' }],
  ['base 2025, force_nta', { base_year: 2025, pia_under_nta_2025_override: 'force_nta' }],
  ['base 2030, force_pia', { base_year: 2030, pia_under_nta_2025_override: 'force_pia' }],
  ['base 2027, override unset', { base_year: 2027 }],
];

export const frameworkTable = () => FRAMEWORK_PROBES.map(([label, cfg]) => ({ label, framework: determineFiscalFramework(cfg) }));

// ---------------------------------------------------------------------------
// SECTION 17. Loss relief.
// ---------------------------------------------------------------------------

export const LOSS_RELIEF_CASES = ['jv_loss_carryforward', 'jv_loss_carryforward_killswitch', 'jv_loss_unused_at_cessation', 'pia_loss_relief', 'pia_loss_relief_killswitch', 'schedule_shift_1'];

export const lossReliefCases = () => LOSS_RELIEF_CASES.map((name) => {
  const p = publishedCase(name);
  return {
    ...p,
    regime: p.cfg.fiscal_regime,
    taxLossesUnusedAtCessation: p.kpis.tax_losses_unused_at_cessation ?? null,
    scheduleShiftYears: p.kpis.schedule_shift_years ?? null,
  };
});

export const APPLY_JV_INPUTS = { gross_revenue: 50000000, capex: 0, opex: 20000000, depreciation: 10000000, cumulative_unrecovered_cost: 0 };
export const APPLY_JV_POOLS = [0, 5000000, 15000000, 40000000];

/** applyJV on one year with a loss pool brought forward, relief on and relief off. */
export const applyJvPoolTable = () => {
  const rows = APPLY_JV_POOLS.map((pool) => {
    const o = applyJV(APPLY_JV_INPUTS, 1, 0.2, 0.5, pool, true);
    const off = applyJV(APPLY_JV_INPUTS, 1, 0.2, 0.5, pool, false);
    return {
      poolBroughtForward: pool, taxable: o.taxable_income, offsetUsed: o.loss_offset_used, tax: o.tax, net: o.net_cash_flow,
      poolAfter: o.loss_carryforward_after, taxWithReliefOff: off.tax, poolAfterWithReliefOff: off.loss_carryforward_after,
    };
  });
  const lossYear = applyJV({ gross_revenue: 0, capex: 100000000, opex: 5000000, depreciation: 10000000, cumulative_unrecovered_cost: 0 }, 1, 0.2, 0.5, 0, true);
  return {
    inputs: APPLY_JV_INPUTS, rows,
    lossYear: { taxable: lossYear.taxable_income, tax: lossYear.tax, poolAfter: lossYear.loss_carryforward_after, net: lossYear.net_cash_flow },
  };
};

export const DELAY_SHIFTS = [0, 1, 2, 3];

/** AKATA delayed: first oil moves, the committed capex does not. */
export const akataDelaySweep = () => DELAY_SHIFTS.map((shiftYears) => {
  const res = run(withCfg(AKATA, { schedule_shift_years: shiftYears }));
  const k = res.kpis;
  return {
    shiftYears,
    byYear: res.cashFlowData.map((q) => ({ year: q.year, oilBbl: q.oil_bbl, capex: q.capex, opex: q.opex, net: q.net_cash_flow })),
    npv: k.npv, irrPct: k.irr, payback: k.payback, lossPoolAfterYearOne: res.cashFlowData[0].loss_carryforward,
    rows: res.cashFlowData.length,
  };
});

// ---------------------------------------------------------------------------
// SECTION 18. The economic limit.
// ---------------------------------------------------------------------------

export const ECONOMIC_LIMIT_CASES = ['elt_off_tail_kept', 'elt_tail_trimmed', 'elt_royalty_tail', 'elt_pia_multiyear'];

export const economicLimitCases = () => ECONOMIC_LIMIT_CASES.map((name) => {
  const p = publishedCase(name);
  return {
    ...p,
    regime: p.cfg.fiscal_regime,
    economicLimitYear: p.kpis.economic_limit_year ?? null,
    yearsTrimmed: p.kpis.years_trimmed_by_economic_limit ?? null,
    limitOn: p.cfg.apply_economic_limit === true,
  };
});

export const TAIL_PRICE_PROBES = [40, 50, 60];

/** The long-tail AKATA with the limit off and on, and the limit on at three lower prices. */
export const akataTail = () => {
  const TAIL = akataWithTail();
  const both = [false, true].map((on) => {
    const res = run(withCfg(TAIL, { apply_economic_limit: on }));
    const k = res.kpis;
    return {
      limitOn: on, rows: res.cashFlowData.length, lastYear: res.cashFlowData[res.cashFlowData.length - 1].year,
      economicLimitYear: k.economic_limit_year ?? null, yearsTrimmed: k.years_trimmed_by_economic_limit ?? null,
      byYear: res.cashFlowData.map((q) => ({ year: q.year, revenueLessRoyalty: q.gross_revenue - q.royalty, opex: q.opex, net: q.net_cash_flow, cumulative: q.cumulative_cash_flow })),
      npv: k.npv, totalNetCashFlow: k.total_net_cash_flow, irrPct: k.irr,
    };
  });
  const atPrice = TAIL_PRICE_PROBES.map((oilPrice) => {
    const res = run(withCfg(TAIL, { apply_economic_limit: true, oil_price_usd_bbl: oilPrice }));
    const k = res.kpis;
    return { oilPrice, economicLimitYear: k.economic_limit_year ?? null, yearsTrimmed: k.years_trimmed_by_economic_limit ?? null, rows: res.cashFlowData.length, npv: k.npv };
  });
  return { tailRows: TAIL.prodRows.slice(AKATA.prodRows.length), limitOff: both[0], limitOn: both[1], atPrice };
};

// ---------------------------------------------------------------------------
// SECTION 19. Abandonment: the lump sum and the sinking fund.
// ---------------------------------------------------------------------------

export const ABANDONMENT_CASES = ['abandonment_final_year', 'abandonment_appended_year', 'jv_abandonment_wi_60', 'jv_sinking_fund', 'pia_sinking_fund', 'pia_sinking_fund_wi_50'];

const abandonmentKpisOf = (k) => ({
  totalAbandonmentCost: k.total_abandonment_cost ?? null,
  abandonmentYear: k.abandonment_year ?? null,
  fundingMode: k.abandonment_funding_mode ?? 'lump_sum',
  totalFundContributions: k.total_decom_fund_contributions ?? null,
  totalTax: k.total_tax,
  unitTechnicalCost: k.unit_technical_cost_usd_per_boe ?? null,
  reportedWiPct: k.working_interest_pct ?? null,
  totalBoe: k.total_boe ?? null,
});

export const abandonmentCases = () => ABANDONMENT_CASES.map((name) => {
  const p = publishedCase(name);
  return {
    ...p, regime: p.cfg.fiscal_regime, ...abandonmentKpisOf(p.kpis),
    byYear: p.rows.map((q) => ({ year: q.year, contribution: q.decom_fund_contribution ?? 0, abandonmentCost: q.abandonment_cost ?? 0, tax: q.tax, net: q.net_cash_flow })),
    finalRowAbandonmentCost: p.rows[p.rows.length - 1].abandonment_cost ?? 0,
  };
});

export const AKATA_ABANDONMENT_VARIANTS = [
  ['lump sum 60000000 in the final year', { abandonment_cost_usd: 60000000 }],
  ['lump sum 60000000 in 2037 (beyond the data)', { abandonment_cost_usd: 60000000, abandonment_year: 2037 }],
  ['sinking fund 60000000 from the first year', { abandonment_cost_usd: 60000000, abandonment_funding_mode: 'sinking_fund' }],
  ['sinking fund 60000000 from 2032', { abandonment_cost_usd: 60000000, abandonment_funding_mode: 'sinking_fund', abandonment_fund_start_year: 2032 }],
  ['lump sum 60000000 at WI 50', { abandonment_cost_usd: 60000000, jv_working_interest_pct: 50 }],
  ['sinking fund 60000000 at WI 50', { abandonment_cost_usd: 60000000, abandonment_funding_mode: 'sinking_fund', jv_working_interest_pct: 50 }],
];

export const akataAbandoned = () => AKATA_ABANDONMENT_VARIANTS.map(([label, patch]) => {
  const res = run(withCfg(AKATA, patch));
  const k = res.kpis;
  return {
    label, patch, rows: res.cashFlowData.length,
    byYear: res.cashFlowData.map((q) => ({ year: q.year, contribution: q.decom_fund_contribution ?? 0, abandonmentCost: q.abandonment_cost ?? 0, tax: q.tax, net: q.net_cash_flow })),
    ...abandonmentKpisOf(k),
    npv: k.npv, irrPct: k.irr ?? null,
  };
});

// ---------------------------------------------------------------------------
// SECTION 20. AKATA under the PIA.
// ---------------------------------------------------------------------------

/** AKATA under the PIA with any patch on top of the Section 20 configuration. */
export const akataUnderPia = (patch = {}) => {
  const c = withCfg(AKATA, { ...AKATA_PIA_PATCH, ...patch });
  const res = run(c);
  return { cfg: c.cfg, rows: res.cashFlowData, kpis: res.kpis, ...piaTotalsOf(res.kpis), jv: kpiSummary(run(AKATA).kpis) };
};

/** One AKATA year under the PIA as a waterfall: five taxes, each with the base it is charged on. */
export const akataPiaYearWaterfall = (year, patch = {}) => {
  const { rows, kpis } = akataUnderPia(patch);
  const q = rows.find((r) => r.year === year);
  if (!q) return null;
  return {
    year, framework: q.fiscal_framework ?? kpis.fiscal_framework,
    grossRevenue: q.gross_revenue,
    taxes: [
      { name: 'royalty', base: 'gross revenue', baseValue: q.gross_revenue, amount: q.royalty, parts: { production: q.production_royalty, price: q.price_royalty } },
      { name: 'hydrocarbon tax', base: 'HCT chargeable profit', baseValue: q.hct_chargeable_profit, amount: q.hct_tax, parts: { assessable: q.hct_assessable_profit, allowance: q.production_allowance } },
      { name: 'companies income tax', base: 'CIT chargeable profit', baseValue: q.cit_chargeable_profit, amount: q.cit_tax, parts: { assessable: q.cit_assessable_profit } },
      { name: 'tertiary education tax', base: 'CIT assessable profit', baseValue: q.cit_assessable_profit, amount: q.tet_tax, parts: {} },
      { name: 'development levy', base: 'CIT assessable profit', baseValue: q.cit_assessable_profit, amount: q.dev_levy_tax, parts: {} },
    ],
    levies: { hcdt: q.hcdt, nddc: q.nddc },
    costRecovery: { cap: q.cpr_cap, claimed: q.cpr_costs_claimed, deferred: q.cpr_deferred_to_next },
    allowance: { amount: q.production_allowance, eligibleBbl: q.prod_alw_eligible_bbl, capApplied: q.prod_alw_cap_applied },
    totalTax: q.tax, netCashFlow: q.net_cash_flow, realNetCashFlow: q.real_net_cash_flow, discountedCashFlow: q.discounted_cash_flow,
  };
};

export const AKATA_PIA_VARIANTS = [
  ['as configured', {}],
  ['force_pia', { pia_under_nta_2025_override: 'force_pia' }],
  ['new lease, prior cumulative 0', { pia_lease_status: 'new' }],
  ['new lease, prior cumulative 96000000', { pia_lease_status: 'new', pia_prior_cumulative_oil_bbl: 96000000 }],
  ['onshore', { pia_terrain: 'onshore' }],
  ['deep_offshore conservative', { pia_terrain: 'deep_offshore', pia_water_depth_m: 1200 }],
  ['deep_offshore aggressive', { pia_terrain: 'deep_offshore', pia_water_depth_m: 1200, pia_deep_offshore_hct_interpretation: 'aggressive_pml_30' }],
  ['marginal field', { pia_terrain: 'marginal_field' }],
  ['CPR 40', { pia_cpr_limit_pct: 40 }],
  ['prior year opex 20000000', { pia_prior_year_opex_usd: 20000000 }],
  ['oil price 120', { oil_price_usd_bbl: 120 }],
  ['oil price 45', { oil_price_usd_bbl: 45 }],
  ['WI 50', { pia_working_interest_pct: 50 }],
];

export const akataPiaVariants = () => AKATA_PIA_VARIANTS.map(([label, patch]) => {
  const r = akataUnderPia(patch);
  const q = r.rows[0];
  return {
    label, patch,
    year1: {
      productionRoyalty: q.production_royalty, priceRoyalty: q.price_royalty, hcdt: q.hcdt,
      cprClaimed: q.cpr_costs_claimed, cprDeferred: q.cpr_deferred_to_next,
      allowance: q.production_allowance, eligibleBbl: q.prod_alw_eligible_bbl, capApplied: q.prod_alw_cap_applied,
      hct: q.hct_tax, cit: q.cit_tax, tet: q.tet_tax, devLevy: q.dev_levy_tax, net: q.net_cash_flow,
    },
    totalRoyalties: r.totalRoyalties, totalHct: r.totalHct, totalCit: r.totalCit, totalTet: r.totalTet, totalDevLevy: r.totalDevLevy,
    totalProductionAllowance: r.totalProductionAllowance, totalTax: r.totalTax,
    npv: r.kpis.npv, irrPct: r.kpis.irr ?? null, takePct: r.kpis.government_take_pct, framework: r.kpis.fiscal_framework,
  };
});

// ---------------------------------------------------------------------------
// SECTION 21. Three numbers to distrust.
// ---------------------------------------------------------------------------

export const distrustTable = () => {
  const profileGap = cases.disagreements
    .filter((d) => d.quantity && /npv_profile/.test(d.quantity))
    .map((d) => ({ case: d.case, engineNpv: d.engine.npv, engineRatePct: d.engine.rate_pct, oracleNpv: d.oracle.npv, oracleRatePct: d.oracle.rate_pct, gap: d.gap, gapUnit: d.gap_unit }));
  const akata = akataProfile();
  const twoRoots = cases.disagreements
    .filter((d) => /^irr:/.test(d.case))
    .map((d) => {
      const name = d.case.replace(/^irr:/, '');
      const v = cases.irr.find((x) => x.name === name);
      return { case: d.case, name, flows: v.flows, engineIrrPct: d.engine.irr_pct, oracleIrrPct: d.oracle.irr_pct, gap: d.gap, gapUnit: d.gap_unit, methodStatement: d.method_statement };
    });
  const a = run(goldenCase('pia_sinking_fund_wi_50')).kpis;
  const b = run(goldenCase('pia_sinking_fund')).kpis;
  const cRes = run(goldenCase('jv_abandonment_wi_60'));
  const cK = cRes.kpis;
  return {
    profileGap: [
      { case: AKATA_LABEL, engineNpv: akata.labelledPointNpv, engineRatePct: akata.appliedRateLabelPct, oracleNpv: akata.headlineNpv, oracleRatePct: akata.appliedRatePct, gap: akata.gap, gapUnit: 'USD' },
      ...profileGap,
    ],
    twoRoots,
    sinkingFund: [
      { case: 'pia_sinking_fund', wiPct: 100, totalContributions: b.total_decom_fund_contributions, totalAbandonmentCost: b.total_abandonment_cost, unitTechnicalCost: b.unit_technical_cost_usd_per_boe, totalBoe: b.total_boe, mode: 'sinking_fund' },
      { case: 'pia_sinking_fund_wi_50', wiPct: a.working_interest_pct, totalContributions: a.total_decom_fund_contributions, totalAbandonmentCost: a.total_abandonment_cost, unitTechnicalCost: a.unit_technical_cost_usd_per_boe, totalBoe: a.total_boe, mode: 'sinking_fund' },
      { case: 'jv_abandonment_wi_60', wiPct: 60, totalContributions: null, totalAbandonmentCost: cK.total_abandonment_cost, finalRowAbandonmentCost: cRes.cashFlowData[cRes.cashFlowData.length - 1].abandonment_cost, unitTechnicalCost: cK.unit_technical_cost_usd_per_boe, totalBoe: cK.total_boe, mode: 'lump_sum' },
    ],
  };
};

// ===========================================================================
// THE CAPSTONE. IKPOTO ONLY. NOT FOR LESSONS, NOT FOR PANELS.
//
// EVERYTHING BELOW THIS LINE IS CAPSTONE MATERIAL. Copied verbatim from the
// capstone derivation so the grader, the lab's own tests and the migration
// headers all read one derivation. The names all carry IKPOTO or ikpoto, and
// panelCapstoneGuard.test.js greps the three panel sources for every one of
// them. The leak gate in cashflowLab.test.js checks every TEACHING export's
// return values against the eighteen graded answers below.
// ===========================================================================

export const IKPOTO_LABEL = 'IKPOTO';

export const IKPOTO_PROD = [
  { year: 2031, ikpoto_oil_bbl: 1600000, ikpoto_gas_mscf: 1440000 },
  { year: 2032, ikpoto_oil_bbl: 1280000, ikpoto_gas_mscf: 1152000 },
  { year: 2033, ikpoto_oil_bbl: 1024000, ikpoto_gas_mscf: 921600 },
  { year: 2034, ikpoto_oil_bbl: 819200, ikpoto_gas_mscf: 737280 },
  { year: 2035, ikpoto_oil_bbl: 655360, ikpoto_gas_mscf: 589824 },
  { year: 2036, ikpoto_oil_bbl: 524288, ikpoto_gas_mscf: 471859.2 },
];
export const IKPOTO_CAPEX = [{ year: 2031, amount_usd: 120000000 }, { year: 2032, amount_usd: 30000000 }];
export const IKPOTO_OPEX = [2031, 2032, 2033, 2034, 2035, 2036].map((y) => ({ year: y, total_opex_usd: 19000000 }));

export const IKPOTO_JV = {
  base_year: 2031, fiscal_regime: 'JV', present_value_basis: 'real',
  discount_rate_pct: 9, inflation_rate_pct: 2.5,
  oil_price_usd_bbl: 76, gas_price_usd_mscf: 3.0, condensate_price_usd_bbl: 0,
  oil_price_escalator_pct: 1.5, gas_price_escalator_pct: 1.5, condensate_price_escalator_pct: 0,
  opex_escalator_pct: 3.5, capex_escalator_pct: 0,
  jv_working_interest_pct: 80, jv_royalty_pct: 12.5, jv_tax_rate_pct: 45,
};
export const IKPOTO_PIA = {
  ...IKPOTO_JV, fiscal_regime: 'PIA',
  pia_terrain: 'shallow_water', pia_license_type: 'PML', pia_lease_status: 'new', pia_water_depth_m: 45,
  pia_marginal_field_pre_2021: false, pia_hct_rate_override_pct: null,
  pia_cit_rate_pct: 30, pia_tet_rate_pct: 2.5, pia_nddc_levy_pct_of_opex: 3, pia_nddc_levy_fixed_usd: null,
  pia_prior_year_opex_usd: 0, pia_capex_recovery_years: 4, pia_cpr_limit_pct: 35,
  pia_production_allowance_per_bbl_converted: 2.5, pia_production_allowance_per_bbl_new: 8, pia_production_allowance_pct_of_price: 20,
  pia_under_nta_2025_override: 'auto', pia_prior_cumulative_oil_bbl: 97612500,
  pia_working_interest_pct: 80,
  abandonment_cost_usd: 40000000,
};

/** The three capstone runs, exactly as the derivation makes them. */
export const ikpotoRuns = () => ({
  jv: computeCashFlow({ cfg: IKPOTO_JV, prodRows: IKPOTO_PROD, capexRows: IKPOTO_CAPEX, opexRows: IKPOTO_OPEX }),
  jvMid: computeCashFlow({ cfg: { ...IKPOTO_JV, discounting_convention: 'mid_year' }, prodRows: IKPOTO_PROD, capexRows: IKPOTO_CAPEX, opexRows: IKPOTO_OPEX }),
  pia: computeCashFlow({ cfg: IKPOTO_PIA, prodRows: IKPOTO_PROD, capexRows: IKPOTO_CAPEX, opexRows: IKPOTO_OPEX }),
  breakeven: computeBreakevenOilPrice({ cfg: IKPOTO_JV, prodRows: IKPOTO_PROD, capexRows: IKPOTO_CAPEX, opexRows: IKPOTO_OPEX }),
});

/**
 * The eighteen graded fields as [tier, key, value, tolerance], in the order
 * and with the tolerances the capstone publishes. The tolerance is ABSOLUTE,
 * in the field's own units: academy_submit_capstone grades with
 * abs(v_got - v_exp) <= v_tol and divides by nothing.
 */
export const ikpotoCapstoneFields = () => {
  const { jv, jvMid, pia, breakeven } = ikpotoRuns();
  const row = (res, y) => res.cashFlowData.find((q) => q.year === y);
  return [
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
    ['intermediate', 'jv_breakeven_oil_price_usd_bbl', breakeven, 0.001],
    ['advanced', 'pia_2032_price_royalty_usd', row(pia, 2032).price_royalty, 1],
    ['advanced', 'pia_2032_prod_alw_eligible_bbl', row(pia, 2032).prod_alw_eligible_bbl, 1],
    ['advanced', 'pia_2031_cpr_deferred_usd', row(pia, 2031).cpr_deferred_to_next, 1],
    ['advanced', 'pia_total_hct_usd', pia.kpis.total_hct, 1],
    ['advanced', 'pia_2033_dev_levy_usd', row(pia, 2033).dev_levy_tax, 1],
    ['advanced', 'pia_npv_real_usd', pia.kpis.npv, 1],
  ];
};

/** The graded answers keyed by field. */
export const ikpotoCapstoneValues = () => Object.fromEntries(ikpotoCapstoneFields().map(([, key, value]) => [key, value]));

/** The grading tolerance of each field, absolute, in the field's own units. */
export const ikpotoCapstoneTolerances = () => Object.fromEntries(ikpotoCapstoneFields().map(([, key, , tol]) => [key, tol]));

/**
 * Every export of this module that is built on the capstone. The panel guard
 * greps the panel sources for each name; the leak gate skips each one when it
 * walks the teaching surface.
 */
export const CAPSTONE_ONLY_EXPORTS = [
  'IKPOTO_LABEL', 'IKPOTO_PROD', 'IKPOTO_CAPEX', 'IKPOTO_OPEX', 'IKPOTO_JV', 'IKPOTO_PIA',
  'ikpotoRuns', 'ikpotoCapstoneFields', 'ikpotoCapstoneValues', 'ikpotoCapstoneTolerances',
  'CAPSTONE_ONLY_EXPORTS',
];

/** How much wider than the grader's own band a teaching number has to stand clear. */
export const LEAK_GUARD_MARGIN = 10;

/** The unit shifts a number can be restated under and still be the same answer. */
export const LEAK_GUARD_SCALINGS = [
  { factor: 1, tag: 'as graded' },
  { factor: 1000, tag: 'x1000' },
  { factor: 0.001, tag: 'x0.001' },
];

/** Every forbidden neighbourhood: eighteen answers, three shiftings, ten times the band. */
export const leakGuardTargets = () => {
  const out = [];
  ikpotoCapstoneFields().forEach(([tier, key, value, tol]) => {
    LEAK_GUARD_SCALINGS.forEach(({ factor, tag }) => {
      const gradingBand = tol * Math.abs(factor);
      out.push({ tier, key, tag, value: value * factor, gradingBand, band: LEAK_GUARD_MARGIN * gradingBand });
    });
  });
  return out;
};

/** The target a number collides with, or null. Dimension blind: a box takes any number. */
export const leakGuardHit = (value, targets = leakGuardTargets()) => {
  if (!Number.isFinite(value)) return null;
  for (const t of targets) {
    if (Math.abs(value - t.value) < t.band) return t;
  }
  return null;
};

/** Every finite number reachable inside a value, with the path it sits at. */
export const collectNumbers = (value, path = '', out = [], depth = 0) => {
  if (depth > 12) return out;
  if (typeof value === 'number') {
    if (Number.isFinite(value)) out.push({ path, value });
    return out;
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => collectNumbers(v, `${path}[${i}]`, out, depth + 1));
    return out;
  }
  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([k, v]) => collectNumbers(v, path ? `${path}.${k}` : k, out, depth + 1));
  }
  return out;
};
