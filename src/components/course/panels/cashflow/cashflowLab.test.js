// Every value the EC1 lab exposes to a panel, a lesson or the grader is pinned
// here against the teaching digest (/root/ec-wip-cashflow/digest.txt), which
// is itself nothing but the vendored engine's return values on the published
// goldens and on the teaching field AKATA. The digest prints money to two
// decimals, rates and ratios to six and percentages to four, and the pins
// below hold each number to the precision the digest prints it at.
//
// THE EIGHTEEN GRADED FIELDS of the IKPOTO capstone are pinned separately and
// EXACTLY against /root/ec-wip-cashflow/fields.json, because a grader reading
// one derivation and a lesson reading another is exactly the failure this
// file exists to stop. Then the leak gate: no teaching export may return a
// number within ten times a graded field's absolute tolerance of a graded
// answer, in any of three unit shiftings.

import { describe, it, expect } from 'vitest';
import * as L from './cashflowLab.js';

/**
 * THE EIGHTEEN GRADED FIELDS, as [tier, key, value, tolerance], copied from
 * /root/ec-wip-cashflow/fields.json. THE TOLERANCE IS ABSOLUTE, in the
 * field's own units: academy_submit_capstone grades with
 * abs(v_got - v_exp) <= v_tol and divides by nothing.
 */
const CAPSTONE_FIELDS = [
  ['beginner', 'jv_2033_gross_revenue_usd', 83024596.47999997, 1],
  ['beginner', 'jv_2032_tax_usd', 19728417.6, 1],
  ['beginner', 'jv_2034_net_cash_flow_usd', 22086267.91657759, 1],
  ['beginner', 'jv_payback_years', 3.4998246420308123, 0.00001],
  ['beginner', 'jv_total_boe', 6788275.2, 1],
  ['beginner', 'jv_government_take_pct', 80.07659344822196, 0.0001],
  ['intermediate', 'jv_npv_real_usd', 20656337.21686185, 1],
  ['intermediate', 'jv_npv_mid_year_usd', 20030970.834339857, 1],
  ['intermediate', 'jv_irr_pct', 23.719272956750835, 0.0001],
  ['intermediate', 'jv_discounted_payback_years', 3.9696530221864026, 0.0001],
  ['intermediate', 'jv_dpi', 0.14002119133320534, 0.000001],
  ['intermediate', 'jv_breakeven_oil_price_usd_bbl', 66.10100889205933, 0.001],
  ['advanced', 'pia_2032_price_royalty_usd', 951123.1830656304, 1],
  ['advanced', 'pia_2032_prod_alw_eligible_bbl', 787500, 1],
  ['advanced', 'pia_2031_cpr_deferred_usd', 3942400, 1],
  ['advanced', 'pia_total_hct_usd', 51541932.563462615, 1],
  ['advanced', 'pia_2033_dev_levy_usd', 1331296.587088759, 1],
  ['advanced', 'pia_npv_real_usd', -46086957.32549152, 1],
];

// The digest's three precisions.
const money = (got, want) => expect(got).toBeCloseTo(want, 2);
const rate = (got, want) => expect(got).toBeCloseTo(want, 6);
const pct = (got, want) => expect(got).toBeCloseTo(want, 4);
const vol = (got, want) => expect(got).toBeCloseTo(want, 2);

const byYear = (rows, year) => rows.find((r) => r.year === year);

// ---------------------------------------------------------------------------
// 1. The engine and its refusals.
// ---------------------------------------------------------------------------

describe('the engine, its version and its eight refusals', () => {
  it('is the 3.9.0 engine the goldens were cut against', () => {
    expect(L.ENGINE_VERSION).toBe('3.9.0');
    expect(L.GOLDEN_ENGINE_VERSION).toBe(L.ENGINE_VERSION);
  });

  it('refuses all eight published uploads with the message the golden expects', () => {
    const r = L.refusals();
    expect(r.map((x) => x.name)).toEqual([
      'no_volume_columns', 'no_usable_date', 'capex_no_cost_column', 'opex_no_cost_column',
      'oil_price_unset', 'gas_price_unset', 'ambiguous_cost_aliases', 'no_production_rows',
    ]);
    r.forEach((x) => {
      expect(x.message).not.toBe('(no error thrown)');
      expect(x.message.length).toBeGreaterThan(20);
      if (x.expectedFragment) expect(x.message).toContain(x.expectedFragment);
    });
  });

  it('carries every published case, one line each', () => {
    const lines = L.publishedCaseLines();
    expect(lines.length).toBe(L.GOLDEN.cases.length);
    const jv = lines.find((l) => l.name === 'jv_analytic_decision_kpis');
    money(jv.npv, 21590909.09);
    pct(jv.irrPct, 200);
    expect(jv.rows).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// 2. The hand-derived JV case and the ingestion and price cases.
// ---------------------------------------------------------------------------

describe('the hand-derived JV case, row by row', () => {
  const c = L.jvAnalyticCase();
  it('reproduces the two rows', () => {
    money(c.rows[0].gross_revenue, 100000000);
    money(c.rows[0].royalty, 20000000);
    money(c.rows[0].depreciation, 5000000);
    money(c.rows[0].taxable_income, 65000000);
    money(c.rows[0].tax, 32500000);
    money(c.rows[0].net_cash_flow, -12500000);
    money(c.rows[1].net_cash_flow, 37500000);
    money(c.rows[1].discounted_cash_flow, 34090909.09);
    money(c.rows[1].cumulative_cash_flow, 25000000);
  });
  it('reproduces the KPIs', () => {
    const k = c.kpis;
    money(k.npv, 21590909.09);
    pct(k.irr, 200);
    rate(k.payback_years, 1.333333);
    rate(k.discounted_payback_years, 1.366667);
    rate(k.dpi, 0.431818);
    pct(k.government_take_pct, 80.7692);
    pct(k.government_take_pct_discounted, 82.2761);
    vol(k.total_boe, 2000000);
    rate(k.unit_technical_cost_usd_per_boe, 35);
    rate(k.opex_usd_per_boe, 10);
    money(k.pv_capex, 50000000);
  });
  it('each lever moved on its own gives the digest line', () => {
    const s = L.jvLeverSweep();
    expect(s).toHaveLength(9);
    const at = (key, value) => s.find((r) => r.key === key && r.value === value);
    money(at('jv_royalty_pct', 0).npv, 40681818.18); expect(at('jv_royalty_pct', 0).irrPct).toBeNull(); pct(at('jv_royalty_pct', 0).takePct, 65.3846);
    money(at('jv_royalty_pct', 10).npv, 31136363.64); pct(at('jv_royalty_pct', 10).irrPct, 466.6667);
    money(at('jv_royalty_pct', 30).npv, 12045454.55); pct(at('jv_royalty_pct', 30).irrPct, 85.7143); money(at('jv_royalty_pct', 30).year1Royalty, 30000000);
    money(at('jv_tax_rate_pct', 0).npv, 83636363.64); pct(at('jv_tax_rate_pct', 0).takePct, 30.7692);
    money(at('jv_tax_rate_pct', 30).npv, 46409090.91); money(at('jv_tax_rate_pct', 30).year1Net, 500000);
    money(at('jv_tax_rate_pct', 85).npv, -21840909.09); pct(at('jv_tax_rate_pct', 85).irrPct, -58.1560); pct(at('jv_tax_rate_pct', 85).takePct, 115.7692);
    money(at('jv_working_interest_pct', 60).npv, 12954545.45); pct(at('jv_working_interest_pct', 60).irrPct, 200); pct(at('jv_working_interest_pct', 60).takePct, 88.4615);
    money(at('jv_working_interest_pct', 25).npv, 5397727.27); money(at('jv_working_interest_pct', 25).year1Tax, 8125000); pct(at('jv_working_interest_pct', 25).takePct, 95.1923);
  });
});

describe('from rows to years', () => {
  const cases = L.ingestionCases();
  const at = (name) => cases.find((c) => c.name === name);
  it('per-well columns beat the rollup', () => {
    vol(at('per_well_beats_total_rollup').volumes[0].oil_bbl, 100000);
    money(at('per_well_beats_total_rollup').npv, 3375000);
  });
  it('month indexes land in two years', () => {
    const c = at('month_index_rows');
    expect(c.volumes.map((v) => v.year)).toEqual([2027, 2028]);
    vol(c.volumes[0].oil_bbl, 120000); vol(c.volumes[1].oil_bbl, 120000);
    expect(c.capex).toEqual([{ year: 2027, usd: 5000000 }]);
    expect(c.opex).toEqual([{ year: 2028, usd: 1000000 }]);
    money(c.npv, 2754545.45); pct(c.irrPct, 442.8571);
  });
  it('the usd fallback sums the parts and excludes total_', () => {
    const c = at('usd_fallback_parts');
    money(c.capex[0].usd, 25000000); money(c.opex[0].usd, 500000); money(c.npv, -20625000);
  });
  it('duplicate identical aliases count once', () => {
    money(at('duplicate_identical_aliases').capex[0].usd, 30000000);
    money(at('duplicate_identical_aliases').npv, -25125000);
  });
  it('headers are read case-insensitively and the CSV case adds up', () => {
    vol(at('case_insensitive_headers').volumes[0].water_bbl, 20000);
    money(at('case_insensitive_headers').npv, -25500000);
    const a = at('alaoma_csv_ingestion');
    vol(a.volumes[0].oil_bbl, 190000); vol(a.volumes[0].water_bbl, 45000);
    money(a.capex[0].usd, 40000000); money(a.opex[0].usd, 1490000); money(a.npv, -32332500);
  });
  it('knows which columns count as volumes', () => {
    const t = Object.fromEntries(L.volumeColumnTable().map((r) => [r.key, r.isVolume]));
    expect(t).toEqual({
      oil_bbl: true, w1_oil_bbl: true, total_oil_bbl: true, gas_mscf: true, w2_gas_mscf: true, condensate_bbl: true, water_bbl: true,
      OIL_BBL: true, oil: false, oil_price_usd_bbl: false, opex_usd: false, year: false, date: false, month_index: false, w1_oil_bbl_forecast: false,
    });
  });
});

describe('prices', () => {
  const p = L.priceCases();
  const prices = (name) => p.find((c) => c.name === name).byYear.map((q) => q.appliedOilPrice);
  it('reproduces the six deck and escalator cases', () => {
    expect(prices('flat_escalator').map((x) => +x.toFixed(6))).toEqual([100, 110]);
    expect(prices('escalator_defaults_to_inflation').map((x) => +x.toFixed(6))).toEqual([100, 105]);
    money(p.find((c) => c.name === 'escalator_defaults_to_inflation').byYear[1].opex, 10500000);
    expect(prices('deck_step_hold').map((x) => +x.toFixed(6))).toEqual([100, 100, 50, 55]);
    expect(prices('deck_differential').map((x) => +x.toFixed(6))).toEqual([95, 105]);
    expect(prices('deck_scale').map((x) => +x.toFixed(6))).toEqual([120]);
    expect(prices('deck_before_first_entry').map((x) => +x.toFixed(6))).toEqual([90, 90, 70]);
  });
  it('the resolver on its own', () => {
    const t = L.deckResolverTable();
    expect(t.parsedOilDeck).toEqual([{ year: 2030, value: 100 }, { year: 2032, value: 50 }]);
    expect(t.gasDeckEntries).toBe(0);
    const withDeck = t.lines[0].byYear.map((q) => q.price);
    expect(withDeck.map((x) => +x.toFixed(6))).toEqual([100, 100, 100, 100, 50, 55, 60.5, 66.55]);
    const noDeck = t.lines[1].byYear;
    rate(noDeck[0].price, 66.115702); rate(noDeck[1].price, 72.727273); rate(noDeck[7].price, 128.8408);
    t.lines[2].byYear.forEach((q) => rate(q.price, 80));
  });
  it('three streams, one fiscal price', () => {
    const m = L.mixedStreamsCase();
    money(m.rows[0].gross_revenue, 556000000);
    money(m.rows[0].royalty, 72140113.95);
    money(m.rows[0].hct_tax, 70557300.35);
    money(m.rows[0].tet_tax, 9093997.15);
    vol(m.totalBoe, 10300000);
  });
});

// ---------------------------------------------------------------------------
// 3. AKATA under joint venture terms: the ledger, the KPIs, the levers.
// ---------------------------------------------------------------------------

const AKATA_ROWS = [
  // year, oil, gas, oil price, gross, royalty, opex, capex, depr, taxable, tax, net, real, dcf, cumulative, gas price
  [2029, 2200000, 1760000, 82, 186032000.00, 27904800.00, 24000000.00, 210000000.00, 21000000.00, 113127200.00, 45250880.00, -121123680.00, -121123680.00, -121123680.00, -121123680.00, 3.2],
  [2030, 1850000, 1480000, 83.64, 159564720.00, 23934708.00, 24720000.00, 45000000.00, 25500000.00, 85410012.00, 34164004.80, 31746007.20, 30821366.21, 28860006.55, -90302313.79, 3.264],
  [2031, 1550000, 1240000, 85.3128, 136363147.20, 20454472.08, 25461600.00, 0, 25500000.00, 64947075.12, 25978830.05, 64468245.07, 60767504.07, 53279541.38, -29534809.71, 3.32928],
  [2032, 1300000, 1040000, 87.019056, 116656473.02, 17498470.95, 26225448.00, 0, 25500000.00, 47432554.07, 18973021.63, 53959532.44, 49380616.06, 40540595.37, 19845806.34, 3.395866],
  [2033, 1090000, 872000, 88.759437, 99768205.16, 14965230.77, 27012211.44, 0, 25500000.00, 32290762.95, 12916305.18, 44874457.77, 39870374.51, 30649858.46, 59716180.85, 3.463783],
  [2034, 920000, 736000, 90.534626, 85892186.90, 12883828.04, 27822577.78, 0, 25500000.00, 19685781.08, 7874312.43, 37311468.65, 32185200.62, 23167486.48, 91901381.47, 3.533059],
  [2035, 770000, 616000, 92.345318, 73325786.51, 10998867.98, 28657255.12, 0, 25500000.00, 8169663.42, 3267865.37, 30401798.05, 25461027.24, 17161022.43, 117362408.71, 3.60372],
];

describe('AKATA under joint venture terms', () => {
  const { rows, kpis } = L.akataLedger();

  it('is the field the digest defines, verbatim', () => {
    expect(L.AKATA.cfg.base_year).toBe(2029);
    expect(L.AKATA.cfg.fiscal_regime).toBe('JV');
    expect(L.AKATA.cfg.present_value_basis).toBe('real');
    expect(L.AKATA.prodRows).toHaveLength(7);
    expect(L.AKATA.capexRows).toEqual([{ year: 2029, amount_usd: 210000000 }, { year: 2030, amount_usd: 45000000 }]);
    L.AKATA.opexRows.forEach((r) => expect(r.total_opex_usd).toBe(24000000));
    expect(L.AKATA_YEARS).toEqual([2029, 2030, 2031, 2032, 2033, 2034, 2035]);
  });

  AKATA_ROWS.forEach(([year, oil, gas, px, gross, roy, opex, capex, depr, taxable, tax, net, real, dcf, cum, gasPx]) => {
    it(`the ${year} row is the digest's row`, () => {
      const q = byYear(rows, year);
      vol(q.oil_bbl, oil); vol(q.gas_mscf, gas);
      rate(q.applied_oil_price, px); rate(q.applied_gas_price, gasPx);
      money(q.gross_revenue, gross); money(q.royalty, roy); money(q.opex, opex); money(q.capex, capex);
      money(q.depreciation, depr); money(q.taxable_income, taxable); money(q.tax, tax);
      money(q.net_cash_flow, net); money(q.real_net_cash_flow, real);
      money(q.discounted_cash_flow, dcf); money(q.cumulative_cash_flow, cum);
      money(q.loss_offset_used, 0); money(q.loss_carryforward, 0);
    });
  });

  it('the KPIs are the digest KPIs', () => {
    money(kpis.npv, 72534830.66);
    pct(kpis.irr, 29.2361);
    expect(kpis.payback).toBe('3.46 years');
    rate(kpis.payback_years, 3.461632);
    rate(kpis.discounted_payback_years, 3.961607);
    rate(kpis.dpi, 0.289088);
    pct(kpis.government_take_pct, 66.1723);
    pct(kpis.government_take_pct_discounted, 76.1610);
    money(kpis.total_revenue, 857602518.80);
    money(kpis.total_capex, 255000000);
    money(kpis.total_opex, 183899092.34);
    money(kpis.total_tax, 148425219.46);
    money(kpis.total_net_cash_flow_nominal, 141637829.18);
    money(kpis.total_net_cash_flow_real, 117362408.71);
    money(kpis.total_net_cash_flow, 117362408.71);
    vol(kpis.total_oil_bbl, 9680000); vol(kpis.total_gas_mscf, 7744000); vol(kpis.total_boe, 10970666.67);
    rate(kpis.unit_technical_cost_usd_per_boe, 40.006602);
    rate(kpis.opex_usd_per_boe, 16.7628);
    money(kpis.pv_capex, 250909090.91);
    rate(kpis.discount_rate_applied_pct, 6.796117);
    expect(kpis.pv_basis).toBe('real');
    expect(kpis.discounting_convention).toBe('end_year');
  });

  it('the profile is the eight points the digest prints', () => {
    const p = kpis.npv_profile.map((q) => [q.rate_pct, +q.npv.toFixed(2)]);
    expect(p).toEqual([[0, 117362408.71], [5, 83023565.60], [6.8, 72513070.98], [8, 65968275.69], [10, 55805775.02], [12, 46487466.07], [15, 33900281.71], [20, 16026160.80]]);
  });

  it('the 2031 cascade reads as the digest sentence', () => {
    const c = L.akataYearCascade(2031);
    vol(c.oilBbl, 1550000); rate(c.oilPrice, 85.3128); vol(c.gasMscf, 1240000); rate(c.gasPrice, 3.32928);
    money(c.grossRevenue, 136363147.20); expect(c.royaltyPct).toBe(15); money(c.royalty, 20454472.08);
    money(c.opex, 25461600); money(c.depreciation, 25500000); money(c.taxableIncome, 64947075.12);
    expect(c.taxPct).toBe(40); money(c.tax, 25978830.05); money(c.capex, 0);
    money(c.netCashFlow, 64468245.07); money(c.realNetCashFlow, 60767504.07);
    money(c.discountedCashFlow, 53279541.38); money(c.cumulativeCashFlow, -29534809.71);
    expect(L.akataYearCascade(2040)).toBeNull();
  });

  it('working interest scales every money line and no volume', () => {
    const s = L.akataWorkingInterestSweep();
    expect(s.map((r) => r.wiPct)).toEqual([100, 75, 60, 40, 25]);
    const want = {
      100: [27904800.00, 45250880.00, -121123680.00, 72534830.66, 66.1723],
      75: [20928600.00, 33938160.00, -90842760.00, 54401123.00, 74.6292],
      60: [16742880.00, 27150528.00, -72674208.00, 43520898.40, 79.7034],
      40: [11161920.00, 18100352.00, -48449472.00, 29013932.27, 86.4689],
      25: [6976200.00, 11312720.00, -30280920.00, 18133707.67, 91.5431],
    };
    s.forEach((r) => {
      const [roy, tax, net, npvWant, take] = want[r.wiPct];
      money(r.year1GrossRevenue, 186032000);
      money(r.year1Royalty, roy); money(r.year1Tax, tax); money(r.year1Net, net);
      vol(r.totalOilBbl, 9680000);
      money(r.npv, npvWant); pct(r.irrPct, 29.2361); pct(r.takePct, take);
      rate(r.unitTechnicalCost, 40.006602);
      expect(r.reportedWiPct).toBe(r.wiPct);
    });
  });

  it('depreciation schedules move tax and NPV as the digest says', () => {
    const d = L.akataDepreciationCases();
    money(d[0].depreciationSum, 174000000); money(d[0].totalTax, 148425219.46); money(d[0].npv, 72534830.66);
    money(d[1].byYear[0].depreciation, 30000000); money(d[1].totalTax, 119700211.23); money(d[1].npv, 94550609.06);
    money(d[2].depreciationSum, 255000000); money(d[2].totalTax, 116025219.46); money(d[2].npv, 103411743.40);
    money(d[3].byYear[0].depreciation, 210000000); money(d[3].byYear[0].tax, 0); money(d[3].npv, 116986448.62);
    money(d[4].depreciationSum, 252450000); money(d[4].totalTax, 117045219.46); money(d[4].npv, 102726246.26);
  });
});

// ---------------------------------------------------------------------------
// 4. Time: basis, convention, inflation, valuation year, the profile, IRR.
// ---------------------------------------------------------------------------

describe('the four basis and convention combinations', () => {
  const m = L.akataBasisMatrix();
  const at = (b, c) => m.find((r) => r.basis === b && r.convention === c);
  it('nominal and real end-year give the same NPV at different applied rates', () => {
    rate(at('nominal', 'end_year').appliedRatePct, 10); money(at('nominal', 'end_year').npv, 72534830.66);
    rate(at('real', 'end_year').appliedRatePct, 6.796117); money(at('real', 'end_year').npv, 72534830.66);
    money(at('nominal', 'end_year').totalNetCashFlow, 141637829.18);
    money(at('real', 'end_year').totalNetCashFlow, 117362408.71);
    at('real', 'end_year').byYear.forEach((q, i) => money(q.discountedCashFlow, AKATA_ROWS[i][13]));
  });
  it('mid-year is the convention that moves NPV', () => {
    money(at('nominal', 'mid_year').npv, 69159247.46);
    money(at('nominal', 'mid_year').byYear[0].discountedCashFlow, -115486897.55);
    money(at('nominal', 'mid_year').byYear[6].discountedCashFlow, 16362392.88);
    money(at('real', 'mid_year').npv, 70188970.32);
    money(at('real', 'mid_year').byYear[0].discountedCashFlow, -117206400.04);
    money(at('real', 'mid_year').byYear[6].discountedCashFlow, 16606015.11);
    m.forEach((r) => { pct(r.irrPct, 29.2361); rate(r.discountedPaybackYears, 3.961607); });
  });
  it('the 2033 flow deflates and discounts to the same number both ways', () => {
    const d = L.akataDeflationExample();
    expect(d.year).toBe(2033);
    money(d.nominalFlow, 44874457.77); money(d.realFlow, 39870374.51);
    money(d.discountedOnRealBasis, 30649858.46); money(d.discountedOnNominalBasis, 30649858.46);
    money(d.zeroInflationRealNpv, 65055328.97); money(d.zeroInflationNominalNpv, 65055328.97);
    rate(d.zeroInflationRealRatePct, 10); rate(d.zeroInflationNominalRatePct, 10);
  });
  it('RESULT 1: NPV does not move with inflation while the real total does', () => {
    const s = L.akataInflationSweep();
    expect(s.map((r) => r.inflationPct)).toEqual([0, 1, 2, 3, 5, 8]);
    const rates = [10, 8.910891, 7.843137, 6.796117, 4.761905, 1.851852];
    const reals = [141637829.18, 133142489.88, 125059129.50, 117362408.71, 103036613.45, 83912631.29];
    s.forEach((r, i) => {
      money(r.npv, 72534830.66);
      rate(r.appliedRealRatePct, rates[i]);
      money(r.totalNetCashFlowNominal, 141637829.18);
      money(r.totalNetCashFlowReal, reals[i]);
    });
  });
});

describe('valuation year and sunk years', () => {
  it('the published discounting cases', () => {
    const c = L.publishedDiscountingCases();
    money(c[0].kpis.npv, 20586124.09); money(c[0].rows[0].discounted_cash_flow, -11918282.37); money(c[0].rows[1].discounted_cash_flow, 32504406.45);
    money(c[1].kpis.npv, 23750000); expect(c[1].valuationYear).toBe(2031); money(c[1].rows[0].discounted_cash_flow, -13750000);
    money(c[2].kpis.npv, 37500000); expect(c[2].kpis.irr).toBeNull(); money(c[2].sunkNetCashFlow, -12500000);
    money(c[2].kpis.total_capex, 0); expect(c[2].rowsFlaggedSunk).toBe(1);
  });
  it('RESULT 2: sunk is a decision, not a date', () => {
    const v = L.akataValuationYears();
    expect(v).toHaveLength(8);
    const at = (y, s) => v.find((r) => r.valuationYear === y && r.treatPriorAsSunk === s);
    money(at(2029, false).npv, 72534830.66); expect(at(2029, false).sunkNetCashFlow).toBeNull();
    money(at(2029, true).npv, 72534830.66); money(at(2029, true).sunkNetCashFlow, 0);
    money(at(2030, false).npv, 77464382.26); pct(at(2030, false).irrPct, 29.2361); expect(at(2030, false).rowsFlaggedSunk).toBe(0);
    money(at(2030, true).npv, 206819768.67); expect(at(2030, true).irrPct).toBeNull(); expect(at(2030, true).payback).toBe('Year 0');
    money(at(2030, true).sunkNetCashFlow, -121123680); money(at(2030, true).totalCapex, 45000000);
    money(at(2030, true).totalNetCashFlow, 238486088.71); expect(at(2030, true).rowsFlaggedSunk).toBe(1);
    money(at(2031, false).npv, 82728951.93);
    money(at(2031, true).npv, 187959458.93); money(at(2031, true).sunkNetCashFlow, -89377672.80); money(at(2031, true).totalCapex, 0); expect(at(2031, true).rowsFlaggedSunk).toBe(2);
    money(at(2032, false).npv, 88351307.89);
    money(at(2032, true).npv, 135836068.30); money(at(2032, true).sunkNetCashFlow, -24909427.73); expect(at(2032, true).rowsFlaggedSunk).toBe(3);
  });
});

describe('DEFECT (a): the profile point at the applied rate misses the headline', () => {
  it('on AKATA the labelled point is evaluated at 6.8 and misses by the digest gap', () => {
    const p = L.akataProfile();
    expect(p.label).toBe('AKATA');
    money(p.headlineNpv, 72534830.66);
    rate(p.appliedRatePct, 6.796117);
    expect(p.appliedRateLabelPct).toBe(6.8);
    money(p.labelledPointNpv, 72513070.98);
    money(p.exactAtAppliedRate, 72534830.66);
    money(p.gap, -21759.68);
    expect(p.exactIsComparable).toBe(true);
    expect(p.oracle).toBeNull();
  });
  it('the published cases carry the gaps the golden records', () => {
    const c = L.profileGapCases();
    const at = (name) => c.find((x) => x.label === name);
    expect(c[0].label).toBe('AKATA');
    money(at('multiyear_pia_real').headlineNpv, 203250580.21); money(at('multiyear_pia_real').labelledPointNpv, 203209583.79); money(at('multiyear_pia_real').gap, -40996.42);
    money(at('multiyear_pia_real').oracle.npv, 203250580.21); rate(at('multiyear_pia_real').oracle.ratePct, 6.796117); money(at('multiyear_pia_real').oracle.gap, -40996.42);
    money(at('multiyear_jv_real').headlineNpv, 88104639.00); money(at('multiyear_jv_real').gap, -18628.18);
    money(at('multiyear_pia_midyear_real').headlineNpv, 196677221.27); money(at('multiyear_pia_midyear_real').gap, -43245.68); expect(at('multiyear_pia_midyear_real').exactIsComparable).toBe(false);
    money(at('pia_loss_relief').headlineNpv, -5475212.04); money(at('pia_loss_relief').gap, -5130.33);
    money(at('allowance_cap_midyear').headlineNpv, 2406447.46); money(at('allowance_cap_midyear').gap, -453.74);
    expect(at('jv_analytic_decision_kpis').appliedRateLabelPct).toBe(10); money(at('jv_analytic_decision_kpis').gap, 0);
    expect(at('multiyear_pia_nominal').appliedRateLabelPct).toBe(10); money(at('multiyear_pia_nominal').headlineNpv, 203250580.21); money(at('multiyear_pia_nominal').gap, 0);
  });
});

describe('the internal rate of return: fifteen vectors', () => {
  const v = L.irrVectors();
  const at = (name) => v.find((x) => x.name === name);
  it('carries all fifteen with the engine root and the golden root', () => {
    expect(v).toHaveLength(15);
    const want = {
      jv_analytic: 200, no_real_root: null, two_roots_10_and_20: 10, all_positive: null, all_negative: null,
      conventional_five_year: 15.2382, late_payout: 20.1124, tiny_return: 0.1, loss_making: -6.9926, sign_change_late: null,
      two_roots_2_and_6: 6, two_roots_5_and_50: 5, two_roots_minus73_and_173: 173.6932, three_roots_0_7_33: 7.3509, three_roots_10_20_40: 10,
    };
    Object.entries(want).forEach(([name, irrPct]) => {
      const x = at(name);
      if (irrPct === null) expect(x.engineIrrPct).toBeNull(); else pct(x.engineIrrPct, irrPct);
    });
    expect(v.filter((x) => x.engineIrrPct === null).map((x) => x.name)).toEqual(['no_real_root', 'all_positive', 'all_negative', 'sign_change_late']);
    expect(v.filter((x) => x.multiRoot).map((x) => x.name).sort()).toEqual([...L.MULTI_ROOT_VECTORS].sort());
  });
  it('DEFECT (b): the two-root vector zeroes at 2 and at 6, the engine says 6, the oracle 2', () => {
    const x = at('two_roots_2_and_6');
    expect(x.flows).toEqual([-100, 208, -108.12]);
    pct(x.engineIrrPct, 6); pct(x.goldenIrrPct, 2); pct(x.oracleIrrPct, 2);
    expect(x.disagrees).toBe(true);
    rate(x.npvAtEngineIrr, 0); rate(x.npvAtOracleIrr, 0);
    money(x.npvAt0, -0.12); money(x.npvAt10, -0.26); money(x.npvAt20, -1.75);
    const curve = Object.fromEntries(x.curve.map((q) => [q.ratePct, q.npv]));
    rate(curve[2], 0); rate(curve[4], 0.036982); rate(curve[6], 0); rate(curve[10], -0.264463); rate(curve[-90], -8832);
  });
  it('the three-root vector zeroes at 0, the engine reports 7.3509', () => {
    const x = at('three_roots_0_7_33');
    pct(x.engineIrrPct, 7.3509); pct(x.oracleIrrPct, 0);
    const curve = Object.fromEntries(x.curve.map((q) => [q.ratePct, q.npv]));
    rate(curve[20], 0.185185); rate(curve[33], -0.012624); rate(curve[0], 0);
  });
  it('the ordinary vectors sit on the digest curve', () => {
    money(at('conventional_five_year').npvAt0, 500); money(at('conventional_five_year').npvAt10, 137.24); money(at('conventional_five_year').npvAt20, -102.82);
    money(at('late_payout').npvAt20, 4.69); money(at('loss_making').npvAt10, -214.88); money(at('two_roots_minus73_and_173').npvAt0, 16000000);
    money(at('jv_analytic').npvAt10, 21590909.09);
    expect(at('conventional_five_year').curve.map((q) => q.ratePct)).toEqual(L.IRR_CURVE_RATES_PCT);
  });
  it('RESULT 3: AKATA with a terminal negative, and with a bigger one', () => {
    const n = L.akataIrrNeighbours();
    const at2 = (label) => n.find((x) => x.label === label);
    pct(at2('as configured').irrPct, 29.2361); money(at2('as configured').npv, 72534830.66);
    money(at2('as configured').npvOfFlowsAt0, 141637829.18); money(at2('as configured').npvOfFlowsAt100, -77943008.48); money(at2('as configured').npvOfFlowsAt300, -108095645.04);
    pct(at2('oil price 60').irrPct, 4.7647); money(at2('oil price 60').npv, -21406234.12); expect(at2('oil price 60').payback).toBe('5.72 years');
    pct(at2('oil price 45').irrPct, -13.3384); money(at2('oil price 45').npv, -91075215.66); expect(at2('oil price 45').payback).toBe('Beyond project life');
    pct(at2('oil price 38').irrPct, -25.4041); money(at2('oil price 38').npv, -126222691.06);
    pct(at2('capex doubled (420000000 and 90000000)').irrPct, -4.7306); money(at2('capex doubled (420000000 and 90000000)').npv, -130907679.39);
    money(at2('capex doubled (420000000 and 90000000)').flows[0], -322723680);
    const a60 = at2('abandonment 60000000 in 2035');
    pct(a60.irrPct, 23.2570); money(a60.npv, 38666394.86); money(a60.flows[6], -29598201.95); expect(a60.terminalNegative).toBe(true);
    money(a60.npvOfFlowsAt0, 81637829.18);
    const a200 = at2('abandonment 200000000 in 2035');
    expect(a200.irrPct).toBeNull(); money(a200.npv, -40359955.35); money(a200.flows[6], -169598201.95);
    money(a200.npvOfFlowsAt0, -58362170.82); money(a200.npvOfFlowsAt100, -81068008.48); money(a200.npvOfFlowsAt300, -108144473.17);
    expect(a200.curve.every((q) => q.npv < 0)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 5. Payback, DPI, take; sweeps; breakeven.
// ---------------------------------------------------------------------------

describe('payback, discounted payback, DPI and take', () => {
  const t = L.addingUpTable();
  const at = (label) => t.find((x) => x.label === label);
  it('AKATA adds up to the digest', () => {
    const a = at('AKATA');
    expect(a.cumulativeByYear.map((q) => +q.cumulative.toFixed(2))).toEqual(AKATA_ROWS.map((r) => r[14]));
    expect(a.payback).toBe('3.46 years'); rate(a.paybackYears, 3.461632); rate(a.discountedPaybackYears, 3.961607);
    money(a.pvCapex, 250909090.91); money(a.npv, 72534830.66); rate(a.dpi, 0.289088);
    pct(a.takePct, 66.1723); pct(a.discountedTakePct, 76.1610);
    rate(a.unitTechnicalCost, 40.006602); rate(a.opexPerBoe, 16.7628);
  });
  it('the published cases add up to the digest', () => {
    const j = at('multiyear_jv_real');
    money(j.cumulativeByYear[0].cumulative, -61500000); money(j.cumulativeByYear[7].cumulative, 127186476.88);
    rate(j.paybackYears, 2.889357); rate(j.discountedPaybackYears, 3.165997); money(j.pvCapex, 147272727.27);
    money(j.npv, 88104639.00); rate(j.dpi, 0.598241); pct(j.takePct, 69.2573); pct(j.discountedTakePct, 75.4578);
    rate(j.unitTechnicalCost, 38.952763); rate(j.opexPerBoe, 18.334475);
    const p = at('multiyear_pia_real');
    rate(p.paybackYears, 2.892034); rate(p.discountedPaybackYears, 3.154942); money(p.pvCapex, 510181818.18);
    money(p.npv, 203250580.21); rate(p.dpi, 0.398389); pct(p.takePct, 71.1024); pct(p.discountedTakePct, 77.4499);
    rate(p.unitTechnicalCost, 32.823299); rate(p.opexPerBoe, 15.356751);
    const z = at('zero_rates_capex_only');
    expect(z.payback).toBe('Beyond project life'); expect(z.paybackYears).toBeNull(); expect(z.discountedPaybackYears).toBeNull();
    money(z.npv, -69090909.09); rate(z.dpi, -1.381818); expect(z.takePct).toBeNull(); expect(z.unitTechnicalCost).toBeNull();
    const s = at('single_year_positive');
    expect(s.payback).toBe('Year 0'); rate(s.paybackYears, 0); money(s.npv, 35000000); expect(s.dpi).toBeNull(); pct(s.takePct, 61.1111);
    const u = at('jv_loss_unused_at_cessation');
    money(u.npv, -50000000); rate(u.dpi, -1); expect(u.takePct).toBeNull();
  });
  it('take on AKATA decomposes as the digest states', () => {
    const d = L.akataTakeDecomposition();
    money(d.totalRevenue, 857602518.80); money(d.totalCapex, 255000000); money(d.totalOpex, 183899092.34);
    money(d.totalTax, 148425219.46); money(d.totalRealNetCashFlow, 117362408.71);
    pct(d.takePct, 66.1723); pct(d.discountedTakePct, 76.1610);
  });
});

describe('sweeps', () => {
  it('the four published sweeps', () => {
    const s = L.publishedSweeps();
    const at = (name) => s.find((x) => x.name === name);
    const d = at('decline_rate_multiyear_pia');
    expect(d.key).toBe('decline_pct');
    money(d.points[0].npv, 281783674.60); expect(d.points[0].economicLimitYear).toBe(2034); expect(d.points[0].yearsTrimmed).toBe(0); expect(d.points[0].rows).toBe(10);
    money(d.points[2].npv, -76483227.81); expect(d.points[2].rows).toBe(6); expect(d.points[2].economicLimitYear).toBe(2030); expect(d.points[2].yearsTrimmed).toBe(4);
    money(d.points[4].npv, -261416751.74); expect(d.points[4].rows).toBe(3); pct(d.points[4].takePct, 1199.4096);
    const r = at('discount_rate_multiyear_jv_real');
    expect(r.points.map((p) => p.value)).toEqual([0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]);
    money(r.points[0].npv, 148905488.72); money(r.points[5].npv, 88104639.00); money(r.points[10].npv, 50852201.45);
    r.points.forEach((p) => { pct(p.irrPct, 47.9020); pct(p.takePct, 69.2573); expect(p.totalRoyalties).toBeNull(); });
    const o = at('oil_price_multiyear_pia_real');
    money(o.points[0].npv, -145273028.51); money(o.points[4].npv, 203250580.21); money(o.points[8].npv, 423341704.82);
    money(o.points[0].totalHct, 56507066.42); money(o.points[8].totalProductionAllowance, 59028480);
    const w = at('oil_price_pia_worked_example');
    money(w.points[0].npv, -91256250); money(w.points[4].npv, 135185570.34); money(w.points[8].npv, 337823783.27);
    expect(w.points[0].irrPct).toBeNull(); expect(w.points[0].payback).toBe('Beyond project life'); expect(w.points[4].payback).toBe('Year 0');
  });
  it('the AKATA oil price sweep', () => {
    const s = L.akataPriceSweep();
    expect(s.map((r) => r.oilPrice)).toEqual([30, 35, 38, 40, 45, 50, 60, 70, 82, 90, 100, 120]);
    const want = {
      30: [-169873348.04, null, null], 35: [-141806886.33, -85.3065, null], 38: [-126222691.06, -25.4041, null], 40: [-115833227.55, -21.3703, null],
      45: [-91075215.66, -13.3384, 247.7770], 50: [-66917909.83, -6.6218, 135.2824], 60: [-21406234.12, 4.7647, 87.4083], 70: [22132715.69, 15.5313, 73.3000],
      82: [72534830.66, 29.2361, 66.1723], 90: [106034602.79, 39.5784, 63.3848], 100: [147909317.95, 54.5010, 60.9584], 120: [231658748.27, 95.2151, 57.9418],
    };
    s.forEach((r) => {
      const [n, i, t] = want[r.oilPrice];
      money(r.npv, n);
      if (i === null) expect(r.irrPct).toBeNull(); else pct(r.irrPct, i);
      if (t === null) expect(r.takePct).toBeNull(); else pct(r.takePct, t);
    });
    money(s[0].totalRevenue, 330221594.28); money(s[0].totalTax, 7156724.80); money(s[0].totalNetCashFlowReal, -166861282.12);
    expect(s[0].taxByYear.map((x) => +x.toFixed(2))).toEqual([6354880, 801844.80, 0, 0, 0, 0, 0]);
    money(s[11].totalRevenue, 1242996271.33); money(s[11].taxByYear[6], 14471379.58);
    expect(s[6].payback).toBe('5.72 years'); expect(s[11].payback).toBe('2.11 years');
  });
  it('the AKATA discount rate sweep on the real basis', () => {
    const s = L.akataDiscountSweep();
    const want = [
      [0, -2.912621, 141637829.18, 3.461632, 0.555442, 255000000.00, 66.1723],
      [2, -0.970874, 125059129.50, 3.551362, 0.492131, 254117647.06, 68.0483],
      [4, 0.970874, 110028835.96, 3.646118, 0.434434, 253269230.77, 69.9844],
      [6, 2.912621, 96365497.46, 3.746005, 0.381717, 252452830.19, 71.9813],
      [8, 4.854369, 83912631.29, 3.851132, 0.333428, 251666666.67, 74.0399],
      [10, 6.796117, 72534830.66, 3.961607, 0.289088, 250909090.91, 76.1610],
      [12, 8.737864, 62114544.47, 4.104424, 0.248281, 250178571.43, 78.3457],
      [15, 11.650485, 48059114.69, 4.362158, 0.192907, 249130434.78, 81.7443],
      [20, 16.504854, 28144510.75, 4.862835, 0.113715, 247500000.00, 87.7437],
      [25, 21.359223, 11736532.11, 5.691901, 0.047709, 246000000.00, 94.1819],
    ];
    expect(s).toHaveLength(want.length);
    want.forEach(([dr, applied, n, dp, dpi, pv, take], i) => {
      expect(s[i].nominalRatePct).toBe(dr);
      rate(s[i].appliedRealRatePct, applied); money(s[i].npv, n); rate(s[i].discountedPaybackYears, dp);
      rate(s[i].dpi, dpi); money(s[i].pvCapex, pv); pct(s[i].discountedTakePct, take);
    });
  });
  it('capex and opex scaled', () => {
    const s = L.akataCostScaleSweep();
    money(s[0].capexScaled.npv, 151769003.37); pct(s[0].capexScaled.irrPct, 120.1646); rate(s[0].capexScaled.unitTechnicalCost, 30.709081);
    money(s[0].opexScaled.npv, 105923762.24); pct(s[0].opexScaled.irrPct, 38.1255); rate(s[0].opexScaled.opexPerBoe, 10.05768);
    money(s[2].capexScaled.npv, 72534830.66); money(s[2].opexScaled.npv, 72534830.66);
    money(s[3].capexScaled.npv, 32917744.31); money(s[3].opexScaled.npv, 55840364.88);
    money(s[4].capexScaled.npv, -27542077.46); money(s[4].opexScaled.npv, 29408036.31);
    money(s[5].capexScaled.npv, -130907679.39); expect(s[5].capexScaled.payback).toBe('Beyond project life');
    money(s[5].opexScaled.npv, -17584307.07); rate(s[5].opexScaled.opexPerBoe, 33.5256);
  });
});

describe('the breakeven oil price', () => {
  it('the published cases, three numbers and three nulls', () => {
    const b = L.breakevenCases();
    const at = (name) => b.find((x) => x.name === name);
    rate(at('jv_analytic').engineBreakeven, 71.725872); rate(at('jv_analytic').goldenBreakeven, 71.72619); money(at('jv_analytic').npvAtBreakeven, -243.53);
    rate(at('pia_worked_example').engineBreakeven, 55.308589); money(at('pia_worked_example').npvAtBreakeven, 810.98);
    rate(at('multiyear_pia_real').engineBreakeven, 53.23928); money(at('multiyear_pia_real').npvAtBreakeven, 851.16);
    ['deck_present_null', 'never_breaks_even_null', 'positive_at_floor_null'].forEach((name) => {
      expect(at(name).engineBreakeven).toBeNull(); expect(at(name).goldenBreakeven).toBeNull(); expect(at(name).npvAtBreakeven).toBeNull();
    });
    expect(at('deck_present_null').deck).toEqual([{ oil: 100, year: 2030 }]);
  });
  it('AKATA breaks even at the digest price, and returns null with a deck', () => {
    const b = L.akataBreakeven();
    rate(b.breakeven, 64.916777);
    money(b.npvAtBreakeven, 897.16); pct(b.irrAtBreakevenPct, 10.0002); pct(b.takeAtBreakevenPct, 79.0146);
    const at = (label) => b.variants.find((v) => v.label === label).breakeven;
    rate(at('nominal basis'), 64.916777);
    rate(at('discount rate 15'), 69.518418);
    rate(at('royalty 20 and tax 50'), 74.945115);
    rate(at('WI 60'), 64.916777);
    expect(at('with a deck')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 6. The fiscal edges: PSC, royalties, the cascade, losses, end of life.
// ---------------------------------------------------------------------------

describe('production sharing: the pool the rows do not carry', () => {
  it('applyPSC on one year with the cap moving', () => {
    const t = L.applyPscTable();
    const want = [
      [0.2, 18000000, 36000000, 18000000, -44000000, 62000000],
      [0.4, 36000000, 27000000, 13500000, -30500000, 44000000],
      [0.6, 54000000, 18000000, 9000000, -17000000, 26000000],
      [0.8, 72000000, 9000000, 4500000, -3500000, 8000000],
      [1.0, 80000000, 5000000, 2500000, 2500000, 0],
    ];
    want.forEach(([cap, rec, po, tax, net, carry], i) => {
      expect(t.caps[i].cap).toBe(cap); money(t.caps[i].royalty, 10000000);
      money(t.caps[i].costRecovered, rec); money(t.caps[i].contractorProfitOil, po); money(t.caps[i].tax, tax);
      money(t.caps[i].net, net); money(t.caps[i].carriedForward, carry);
    });
    money(t.carryIn.contractorProfitOil, 27000000); money(t.carryIn.tax, 13500000); money(t.carryIn.net, -30500000); money(t.carryIn.carriedForward, 74000000);
    expect(t.trancheTable.map((r) => [r.cumulativeBbl, r.contractorShare])).toEqual([[0, 0.6], [999999, 0.6], [1000000, 0.4], [2500000, 0.4], [6000000, 0.4]]);
    money(t.itc.used, 4500000); money(t.itc.carried, 35500000); money(t.itc.taxBeforeCredit, 4500000);
  });
  it('the published PSC cases run', () => {
    const c = L.pscCases();
    expect(c.map((x) => x.name)).toEqual(L.PSC_CASES);
    expect(c.find((x) => x.name === 'psc_wi_50').reportedWiPct).toBe(50);
  });
  it('AKATA under production sharing at the 60 percent cap', () => {
    const p = L.akataUnderPsc();
    expect(p.capPct).toBe(60);
    money(p.rows[0].royalty, 18603200); money(p.rows[0].taxable_income, 30137184); money(p.rows[0].tax, 15068592); money(p.rows[0].net_cash_flow, -118474128);
    money(p.rows[1].net_cash_flow, 29369691.12); money(p.rows[6].net_cash_flow, 8400589.37); money(p.rows[6].cumulative_cash_flow, 59380371.21);
    rate(p.rows[0].psc_contractor_share_pct, 45);
    money(p.kpis.npv, 29960298.75); pct(p.kpis.irr, 19.8650); rate(p.kpis.payback_years, 3.646596); rate(p.kpis.discounted_payback_years, 4.339710);
    rate(p.kpis.dpi, 0.119407); pct(p.kpis.government_take_pct, 82.1085); pct(p.kpis.government_take_pct_discounted, 90.1534);
    expect(p.unrecoveredAtCessationReported).toBeNull();
    expect(p.rows.every((q) => q.cumulative_unrecovered_cost_after === undefined)).toBe(true);
  });
  it('the applyPSC march over the engine rows reads the pool at every cap', () => {
    const s = L.akataPscCapSweep();
    expect(s.map((x) => x.capPct)).toEqual([30, 45, 60, 80, 100]);
    const want = {
      30: [-104151944.05, -21.3161, 120.4874, [50228640.00, 43082474.40, 36818049.74, 31497247.72, 26937415.39, 23190890.46, 19797962.36], [183771360.00, 210408885.60, 199052435.86, 193780636.14, 193855432.19, 198487119.51, 207346412.26]],
      45: [-31510890.38, 0.9150, 99.0577, [75342960.00, 64623711.60, 55227074.62, 47245871.57, 40406123.09, 34786335.69, 29696943.54], [158657040.00, 163753328.40, 133987853.78, 112967430.21, 99573518.56, 92609760.65, 91570072.23]],
      60: [29960298.75, 19.8650, 82.1085, [100457280.00, 86164948.80, 73636099.49, 62994495.43, 53874830.79, 33114182.72, 28657255.12], [133542720.00, 117097771.20, 68923271.71, 32154224.28, 5291604.93, 0, 0]],
      80: [42273746.33, 32.2148, 82.1085, [133943040.00, 114886598.40, 80351961.60, 26225448.00, 27012211.44, 27822577.78, 28657255.12], [100056960.00, 54890361.60, 0, 0, 0, 0, 0]],
      100: [48148675.31, 48.4048, 82.1085, [167428800.00, 136291200.00, 25461600.00, 26225448.00, 27012211.44, 27822577.78, 28657255.12], [66571200.00, 0, 0, 0, 0, 0, 0]],
    };
    s.forEach((p) => {
      const [n, i, t, rec, pool] = want[p.capPct];
      money(p.kpis.npv, n); pct(p.kpis.irr, i); pct(p.kpis.government_take_pct, t);
      p.march.forEach((m, k) => { money(m.recovered, rec[k]); money(m.poolAfter, pool[k]); });
      money(p.poolAtCessation, pool[6]);
    });
    expect(s[0].march.map((m) => +m.tax.toFixed(2))).toEqual([26370036, 22618299.06, 19329476.12, 16536055.05, 14142143.08, 12175217.49, 10393930.24]);
    expect(s[4].march.map((m) => +m.tax.toFixed(2))).toEqual([0, 1646335.80, 21884677.31, 17722209.99, 14125313.97, 11133087.85, 8400589.37]);
    expect(s[0].kpis.payback).toBe('Beyond project life');
  });
});

describe('the PIA royalties', () => {
  const t = L.royaltyTables();
  it('the terrain table and the marginal blend', () => {
    const oil = Object.fromEntries(t.oilByTerrain.map((r) => [r.terrain, Object.fromEntries(r.byRate.map((q) => [q.bopd, q.rate]))]));
    L.ROYALTY_RATE_PROBES_BOPD.forEach((b) => { rate(oil.onshore[b], 0.15); rate(oil.shallow_water[b], 0.125); rate(oil.frontier[b], 0.075); });
    rate(oil.deep_offshore[50000], 0.05); rate(oil.deep_offshore[50001], 0.075); rate(oil.deep_offshore[120000], 0.075);
    rate(oil.marginal_field[1000], 0.05); rate(oil.marginal_field[6000], 0.054167); rate(oil.marginal_field[10000], 0.0625);
    rate(oil.marginal_field[20000], 0.10625); rate(oil.marginal_field[50000], 0.1325); rate(oil.marginal_field[120000], 0.142708);
    const gas = Object.fromEntries(t.gasByTerrain.map((r) => [r.terrain, r.rate]));
    expect(gas).toEqual({ onshore: 0.07, shallow_water: 0.07, deep_offshore: 0.05, frontier: 0.05, marginal_field: 0.07 });
  });
  it('the price royalty anchors escalate from 2021', () => {
    const px = Object.fromEntries(t.priceAnchors.map((r) => [r.year, Object.fromEntries(r.byPrice.map((q) => [q.price, q.rate]))]));
    rate(px[2021][50], 0); rate(px[2021][55], 0.005); rate(px[2021][100], 0.05); rate(px[2021][150], 0.1); rate(px[2021][200], 0.1);
    rate(px[2025][55], 0.000811); rate(px[2025][80], 0.023908); rate(px[2025][100], 0.042385); rate(px[2025][160], 0.097815);
    rate(px[2026][60], 0.004344); rate(px[2030][60], 0.000205); rate(px[2030][100], 0.033676); rate(px[2035][60], 0); rate(px[2035][100], 0.025788);
    rate(t.frontierAt200In2025, 0);
  });
  it('the HCT rate by terrain, licence and framework', () => {
    expect(t.hctRates.map((r) => +r.rate.toFixed(6))).toEqual([0.3, 0.15, 0.15, 0, 0, 0.3, 0.125, 0, 0.2]);
  });
  it('the published terrain cases run', () => {
    const c = L.terrainCases();
    expect(c.map((x) => x.name)).toEqual(L.TERRAIN_CASES);
    c.forEach((x) => expect(Number.isFinite(x.kpis.npv)).toBe(true));
  });
});

describe('the hydrocarbon tax cascade', () => {
  it('computeProductionAllowance on its own', () => {
    const a = L.allowanceCases();
    const want = [[2500000, 1000000, false], [2000000, 1000000, false], [2500000, 1000000, false], [8000000, 1000000, false], [8000000, 1000000, false], [4000000, 500000, true], [0, 0, true], [6000000, 1000000, false], [0, 0, false]];
    want.forEach(([al, el, cap], i) => { money(a[i].allowance, al); vol(a[i].eligibleBbl, el); expect(a[i].capApplied).toBe(cap); });
  });
  it('the CPR cap does not bind on the worked example, the recovery years do', () => {
    const s = L.cprCapSweep();
    money(s[0].cprCap, 438000000); money(s[5].cprCap, 1460000000);
    s.forEach((r) => { money(r.claimed, 242500000); money(r.deferred, 0); money(r.hct, 284810956.27); money(r.cit, 293998456.27); money(r.npv, 135185570.34); expect(r.cprForfeitedAtCessation).toBeNull(); });
    const y = L.recoveryYearsSweep();
    money(y[0].claimed, 482500000); money(y[0].npv, 279185570.34); money(y[1].claimed, 332500000); money(y[1].npv, 189185570.34);
    money(y[2].claimed, 242500000); money(y[2].npv, 135185570.34); money(y[3].claimed, 212500000); money(y[3].npv, 117185570.34);
  });
  it('the published cascade cases run, and the framework switch reads as published', () => {
    const c = L.hctCascadeCases();
    expect(c.map((x) => x.name)).toEqual(L.HCT_CASCADE_CASES);
    money(c.find((x) => x.name === 'multiyear_pia_real').kpis.npv, 203250580.21);
    expect(L.frameworkTable().map((r) => r.framework)).toEqual(['pia_only', 'nta_2025', 'nta_2025', 'pia_only', 'nta_2025']);
    expect(L.frameworkCases().map((x) => x.name)).toEqual(L.FRAMEWORK_CASES);
  });
});

describe('RESULT 4: AKATA under the PIA, five taxes on three bases', () => {
  const p = L.akataUnderPia();
  const PIA_ROWS = [
    // year, prod roy, price roy, royalty, hcdt, nddc, cpr cap, claimed, deferred, hct assessable, allowance, hct chargeable, hct, cit assessable, cit chargeable, cit, tet, dev levy, tax, net, real, dcf, cumulative
    [2029, 22944240.00, 3605512.36, 26549752.36, 0, 720000, 120920800.00, 66000000.00, 0, 130971072.31, 5500000, 84742595.49, 25422778.65, 134762247.64, 92762247.64, 27828674.29, 0, 5390489.91, 58641942.84, -133879695.21, -133879695.21, -133879695.21, -133879695.21],
    [2030, 19679900.40, 3092546.29, 22772446.69, 720000, 741600, 103717068.00, 75720000.00, 0, 107629883.47, 4625000, 53548875.90, 16064662.77, 110610673.31, 59610673.31, 17883201.99, 0, 4424426.93, 38372291.70, 27238381.62, 26445030.70, 24762165.11, -107434664.51],
    [2031, 16818336.50, 2642873.34, 19461209.84, 741600, 763848, 88636045.68, 76461600.00, 0, 87652696.81, 3875000, 34321689.24, 10296506.77, 89934889.36, 38934889.36, 11680466.81, 0, 3597395.57, 25574369.15, 64360520.20, 60665963.05, 53190512.57, -46768701.46],
    [2032, 14387815.62, 2260935.51, 16648751.13, 763848, 786763.44, 75826707.47, 75826707.47, 1398740.53, 70551028.39, 3250000, 19201415.38, 5760424.61, 72231662.45, 24077220.82, 7223166.25, 0, 2889266.50, 15872857.36, 56358805.10, 51576290.42, 42343204.43, 4807588.96],
    [2033, 12304902.62, 1933621.62, 14238524.24, 786763.44, 810366.34, 64849333.35, 64849333.35, 14561618.62, 54406918.31, 2725000, 16346685.65, 4904005.70, 55521599.17, 19083217.79, 5724965.34, 0, 2220863.97, 12849835.00, 44070504.70, 39156072.62, 30100747.70, 43963661.58],
    [2034, 10593505.15, 1664688.56, 12258193.71, 810366.34, 834677.33, 55829921.49, 51384196.40, 0, 29328810.32, 2300000, 18301279.57, 5490383.87, 29604753.11, 20604753.11, 6181425.93, 0, 1184190.12, 12855999.93, 31310371.80, 27008601.76, 19441277.49, 70972263.34],
    [2035, 9043629.29, 1421137.38, 10464766.67, 834677.33, 859717.65, 47661761.23, 28657255.12, 0, 32197437.85, 1925000, 30272437.85, 9081731.35, 32509369.74, 32509369.74, 9752810.92, 0, 1300374.79, 20134917.06, 12374452.67, 10363409.30, 6985055.93, 81335672.64],
  ];
  it('the configuration is the digest Section 20 configuration', () => {
    expect(p.cfg.fiscal_regime).toBe('PIA'); expect(p.cfg.pia_terrain).toBe('shallow_water'); expect(p.cfg.pia_lease_status).toBe('converted');
    expect(p.cfg.pia_cpr_limit_pct).toBe(65); expect(p.cfg.pia_capex_recovery_years).toBe(5); expect(p.cfg.base_year).toBe(2029);
    expect(p.kpis.fiscal_framework).toBe('nta_2025');
  });
  PIA_ROWS.forEach(([year, pr, px, roy, hcdt, nddc, cap, claimed, deferred, hctA, alw, hctC, hct, citA, citC, cit, tet, dev, tax, net, real, dcf, cum]) => {
    it(`the ${year} row is the digest's row`, () => {
      const q = byYear(p.rows, year);
      money(q.production_royalty, pr); money(q.price_royalty, px); money(q.royalty, roy); money(q.hcdt, hcdt); money(q.nddc, nddc);
      money(q.cpr_cap, cap); money(q.cpr_costs_claimed, claimed); money(q.cpr_deferred_to_next, deferred);
      money(q.hct_assessable_profit, hctA); money(q.production_allowance, alw); expect(q.prod_alw_cap_applied).toBe(false);
      money(q.hct_chargeable_profit, hctC); money(q.hct_tax, hct);
      money(q.cit_assessable_profit, citA); money(q.cit_chargeable_profit, citC); money(q.cit_tax, cit);
      money(q.tet_tax, tet); money(q.dev_levy_tax, dev); money(q.tax, tax);
      money(q.net_cash_flow, net); money(q.real_net_cash_flow, real); money(q.discounted_cash_flow, dcf); money(q.cumulative_cash_flow, cum);
      expect(q.fiscal_framework).toBe('nta_2025');
    });
  });
  it('the KPIs and the totals against the JV reading', () => {
    money(p.kpis.npv, 42943268.01); pct(p.kpis.irr, 21.3196); rate(p.kpis.payback_years, 3.750207); rate(p.kpis.discounted_payback_years, 4.451278);
    rate(p.kpis.dpi, 0.171151); pct(p.kpis.government_take_pct, 75.6789); pct(p.kpis.government_take_pct_discounted, 85.8864);
    money(p.totalRoyalties, 122393644.64); money(p.totalHct, 77020493.72); money(p.totalCit, 86274711.53); money(p.totalTet, 0);
    money(p.totalDevLevy, 21007007.79); money(p.totalHcdt, 4657255.12); money(p.totalNddc, 5516972.77);
    money(p.totalProductionAllowance, 24200000); money(p.totalTax, 184302213.04);
    money(p.jv.npv, 72534830.66); pct(p.jv.takePct, 66.1723); money(p.jv.totalTax, 148425219.46);
  });
  it('one year as a waterfall carries the five taxes on their bases', () => {
    const w = L.akataPiaYearWaterfall(2029);
    expect(w.taxes.map((t) => t.name)).toEqual(['royalty', 'hydrocarbon tax', 'companies income tax', 'tertiary education tax', 'development levy']);
    money(w.taxes[0].amount, 26549752.36); money(w.taxes[0].baseValue, 186032000);
    money(w.taxes[1].amount, 25422778.65); money(w.taxes[1].baseValue, 84742595.49);
    money(w.taxes[2].amount, 27828674.29); money(w.taxes[2].baseValue, 92762247.64);
    money(w.taxes[3].amount, 0); money(w.taxes[4].amount, 5390489.91);
    money(w.totalTax, 58641942.84); money(w.netCashFlow, -133879695.21);
    expect(L.akataPiaYearWaterfall(2040)).toBeNull();
  });
  it('the terrain, lease and framework variants', () => {
    const v = L.akataPiaVariants();
    const at = (label) => v.find((x) => x.label === label);
    money(at('as configured').npv, 42943268.01);
    money(at('force_pia').year1.tet, 3369056.19); money(at('force_pia').year1.devLevy, 0); money(at('force_pia').totalTax, 176424585.12); money(at('force_pia').npv, 49521778.87); pct(at('force_pia').irrPct, 23.1881); expect(at('force_pia').framework).toBe('pia_only');
    money(at('new lease, prior cumulative 0').year1.allowance, 17600000); money(at('new lease, prior cumulative 0').totalHct, 61048493.72); money(at('new lease, prior cumulative 0').totalProductionAllowance, 77440000); money(at('new lease, prior cumulative 0').npv, 55961597.02);
    money(at('new lease, prior cumulative 96000000').totalHct, 74680493.72); money(at('new lease, prior cumulative 96000000').totalProductionAllowance, 32000000); money(at('new lease, prior cumulative 96000000').npv, 46233118.46);
    money(at('onshore').year1.productionRoyalty, 27454240); money(at('onshore').npv, 36246417.05); pct(at('onshore').takePct, 77.6758);
    money(at('deep_offshore conservative').year1.productionRoyalty, 9301600); money(at('deep_offshore conservative').year1.hct, 0); money(at('deep_offshore conservative').totalHct, 0);
    money(at('deep_offshore conservative').npv, 141623594.88); pct(at('deep_offshore conservative').irrPct, 55.9040); pct(at('deep_offshore conservative').takePct, 47.2666);
    money(at('deep_offshore aggressive').totalHct, 95732374.60); money(at('deep_offshore aggressive').npv, 61725382.46);
    money(at('marginal field').npv, 61154067.34);
    money(at('CPR 40').totalHct, 107354738.83); money(at('CPR 40').npv, -1723561.25); pct(at('CPR 40').takePct, 89.9426);
    money(at('prior year opex 20000000').year1.hcdt, 600000); money(at('prior year opex 20000000').npv, 42721818.62);
    money(at('oil price 120').year1.priceRoyalty, 13838574.96); money(at('oil price 120').npv, 128984232.18);
    money(at('oil price 45').year1.priceRoyalty, 0); money(at('oil price 45').npv, -104877462.43); pct(at('oil price 45').takePct, 298.6071);
    money(at('WI 50').npv, 21471634.00); pct(at('WI 50').irrPct, 21.3196); pct(at('WI 50').takePct, 75.6789); money(at('WI 50').year1.cprClaimed, 33000000);
  });
});

describe('loss relief', () => {
  it('the published cases', () => {
    const c = L.lossReliefCases();
    const at = (name) => c.find((x) => x.name === name);
    money(at('jv_loss_carryforward').kpis.npv, -13636363.64); money(at('jv_loss_carryforward').rows[1].loss_offset_used, 5000000); money(at('jv_loss_carryforward').rows[1].tax, 30000000);
    money(at('jv_loss_carryforward_killswitch').kpis.npv, -15909090.91);
    money(at('jv_loss_unused_at_cessation').kpis.npv, -50000000); money(at('jv_loss_unused_at_cessation').taxLossesUnusedAtCessation, 5000000);
    money(at('pia_loss_relief').kpis.npv, -5475212.04); money(at('pia_loss_relief_killswitch').kpis.npv, -8763295.32);
    money(at('schedule_shift_1').kpis.npv, 17355371.90); expect(at('schedule_shift_1').scheduleShiftYears).toBe(1);
  });
  it('applyJV on one year with a loss pool', () => {
    const t = L.applyJvPoolTable();
    const want = [[0, 0, 5000000, 15000000, 0], [5000000, 5000000, 2500000, 17500000, 0], [15000000, 10000000, 0, 20000000, 5000000], [40000000, 10000000, 0, 20000000, 30000000]];
    want.forEach(([pool, off, tax, net, after], i) => {
      expect(t.rows[i].poolBroughtForward).toBe(pool); money(t.rows[i].taxable, 10000000); money(t.rows[i].offsetUsed, off);
      money(t.rows[i].tax, tax); money(t.rows[i].net, net); money(t.rows[i].poolAfter, after);
      money(t.rows[i].taxWithReliefOff, 5000000); money(t.rows[i].poolAfterWithReliefOff, 0);
    });
    money(t.lossYear.taxable, -15000000); money(t.lossYear.tax, 0); money(t.lossYear.poolAfter, 15000000); money(t.lossYear.net, -105000000);
  });
  it('AKATA delayed: the committed capex stays, first oil moves', () => {
    const d = L.akataDelaySweep();
    expect(d.map((r) => r.shiftYears)).toEqual([0, 1, 2, 3]);
    money(d[0].npv, 72534830.66); money(d[0].lossPoolAfterYearOne, 0); expect(d[0].rows).toBe(7);
    money(d[1].npv, 56565094.12); pct(d[1].irrPct, 18.8363); expect(d[1].payback).toBe('4.20 years'); money(d[1].lossPoolAfterYearOne, 21000000); expect(d[1].rows).toBe(8);
    money(d[1].byYear[0].net, -210000000); vol(d[1].byYear[0].oilBbl, 0); vol(d[1].byYear[1].oilBbl, 2200000); money(d[1].byYear[1].net, 55541846.40);
    money(d[2].npv, 40880824.32); pct(d[2].irrPct, 14.6753); expect(d[2].rows).toBe(9); money(d[2].byYear[2].net, 112232363.33);
    money(d[3].npv, 17894126.42); pct(d[3].irrPct, 15.1070); expect(d[3].payback).toBe('4.90 years'); expect(d[3].rows).toBe(9);
    expect(d[3].byYear.map((q) => q.year)).toEqual([2029, 2030, 2032, 2033, 2034, 2035, 2036, 2037, 2038]);
  });
});

describe('the economic limit', () => {
  it('the published cases', () => {
    const c = L.economicLimitCases();
    const at = (name) => c.find((x) => x.name === name);
    money(at('elt_off_tail_kept').kpis.npv, 13987603.31); expect(at('elt_off_tail_kept').economicLimitYear).toBeNull(); expect(at('elt_off_tail_kept').rows).toHaveLength(3);
    money(at('elt_tail_trimmed').kpis.npv, 21590909.09); expect(at('elt_tail_trimmed').economicLimitYear).toBe(2031); expect(at('elt_tail_trimmed').yearsTrimmed).toBe(1); expect(at('elt_tail_trimmed').rows).toHaveLength(2);
    money(at('elt_royalty_tail').kpis.npv, -12500000); expect(at('elt_royalty_tail').economicLimitYear).toBe(2030); expect(at('elt_royalty_tail').rows).toHaveLength(1);
    money(at('elt_pia_multiyear').kpis.npv, 203250580.21); expect(at('elt_pia_multiyear').economicLimitYear).toBe(2030); expect(at('elt_pia_multiyear').rows).toHaveLength(6);
  });
  it('the long-tail AKATA, limit off and on', () => {
    const t = L.akataTail();
    expect(t.tailRows.map((r) => r.year)).toEqual([2036, 2037, 2038, 2039, 2040, 2041]);
    expect(t.limitOff.rows).toBe(13); expect(t.limitOff.lastYear).toBe(2041); expect(t.limitOff.economicLimitYear).toBeNull();
    money(t.limitOff.npv, 87727489.23); money(t.limitOff.totalNetCashFlow, 139349966.67); pct(t.limitOff.irrPct, 31.1927);
    const y2039 = t.limitOff.byYear.find((q) => q.year === 2039);
    money(y2039.revenueLessRoyalty, 31541919.46); money(y2039.opex, 32253993.10);
    expect(t.limitOn.rows).toBe(10); expect(t.limitOn.lastYear).toBe(2038); expect(t.limitOn.economicLimitYear).toBe(2038); expect(t.limitOn.yearsTrimmed).toBe(3);
    money(t.limitOn.npv, 93890737.45); money(t.limitOn.totalNetCashFlow, 152527473.77); pct(t.limitOn.irrPct, 31.4916);
    expect(t.atPrice.map((r) => [r.oilPrice, r.economicLimitYear, r.yearsTrimmed, r.rows, +r.npv.toFixed(2)])).toEqual([
      [40, 2035, 6, 7, -115833227.55], [50, 2036, 5, 8, -65210641.50], [60, 2037, 4, 9, -15270664.32],
    ]);
  });
});

describe('abandonment: the lump sum and the sinking fund', () => {
  it('the published cases', () => {
    const c = L.abandonmentCases();
    const at = (name) => c.find((x) => x.name === name);
    money(at('abandonment_final_year').kpis.npv, 12500000); money(at('abandonment_final_year').totalAbandonmentCost, 10000000); expect(at('abandonment_final_year').abandonmentYear).toBe(2031); expect(at('abandonment_final_year').fundingMode).toBe('lump_sum');
    money(at('abandonment_appended_year').kpis.npv, 14077761.08); expect(at('abandonment_appended_year').abandonmentYear).toBe(2033);
    money(at('jv_abandonment_wi_60').kpis.npv, 3863636.36); money(at('jv_abandonment_wi_60').totalAbandonmentCost, 10000000); money(at('jv_abandonment_wi_60').finalRowAbandonmentCost, 10000000); money(at('jv_abandonment_wi_60').totalTax, 39000000); rate(at('jv_abandonment_wi_60').unitTechnicalCost, 40);
    money(at('jv_sinking_fund').kpis.npv, 16818181.82); money(at('jv_sinking_fund').totalFundContributions, 10000000); expect(at('jv_sinking_fund').fundingMode).toBe('sinking_fund');
    money(at('pia_sinking_fund').kpis.npv, 123185570.34); money(at('pia_sinking_fund').totalFundContributions, 30000000); money(at('pia_sinking_fund').totalAbandonmentCost, 30000000); rate(at('pia_sinking_fund').unitTechnicalCost, 28.082192);
    money(at('pia_sinking_fund_wi_50').kpis.npv, 61592785.17); money(at('pia_sinking_fund_wi_50').totalFundContributions, 15000000); money(at('pia_sinking_fund_wi_50').totalAbandonmentCost, 30000000); rate(at('pia_sinking_fund_wi_50').unitTechnicalCost, 29.726027); expect(at('pia_sinking_fund_wi_50').reportedWiPct).toBe(50);
  });
  it('AKATA abandoned six ways', () => {
    const a = L.akataAbandoned();
    const at = (label) => a.find((x) => x.label === label);
    const lump = at('lump sum 60000000 in the final year');
    money(lump.npv, 38666394.86); pct(lump.irrPct, 23.2570); money(lump.totalAbandonmentCost, 60000000); rate(lump.unitTechnicalCost, 45.475732); money(lump.byYear[6].abandonmentCost, 60000000); expect(lump.rows).toBe(7);
    const beyond = at('lump sum 60000000 in 2037 (beyond the data)');
    expect(beyond.rows).toBe(8); money(beyond.npv, 44544387.85); pct(beyond.irrPct, 24.6309); money(beyond.byYear[7].abandonmentCost, 60000000); money(beyond.byYear[7].tax, 0);
    const sf = at('sinking fund 60000000 from the first year');
    sf.byYear.forEach((q) => money(q.contribution, 8571428.57)); money(sf.byYear[0].tax, 41822308.57); money(sf.byYear[6].tax, 0);
    money(sf.totalTax, 124585925.52); money(sf.totalFundContributions, 60000000); money(sf.npv, 44902775.54); pct(sf.irrPct, 21.9086);
    const sf32 = at('sinking fund 60000000 from 2032');
    expect(sf32.byYear.map((q) => +q.contribution.toFixed(2))).toEqual([0, 0, 0, 15000000, 15000000, 15000000, 15000000]);
    money(sf32.totalTax, 127157354.09); money(sf32.npv, 47415100.31); pct(sf32.irrPct, 23.9820);
    const lump50 = at('lump sum 60000000 at WI 50');
    money(lump50.npv, 2398979.53); pct(lump50.irrPct, 12.7634); money(lump50.totalTax, 74212609.73); money(lump50.byYear[6].abandonmentCost, 60000000);
    const sf50 = at('sinking fund 60000000 at WI 50');
    money(sf50.npv, 22451387.77); pct(sf50.irrPct, 21.9086); money(sf50.totalTax, 62292962.76); money(sf50.totalFundContributions, 60000000); money(sf50.byYear[0].contribution, 8571428.57);
  });
});

describe('three numbers to distrust', () => {
  const d = L.distrustTable();
  it('DEFECT (a): the profile gap, on AKATA and on the eight published cases', () => {
    expect(d.profileGap[0].case).toBe('AKATA');
    money(d.profileGap[0].gap, -21759.68); money(d.profileGap[0].engineNpv, 72513070.98); expect(d.profileGap[0].engineRatePct).toBe(6.8); money(d.profileGap[0].oracleNpv, 72534830.66);
    const want = { allowance_cap_midyear: -453.74, elt_pia_multiyear: -40996.42, pia_loss_relief: -5130.33, pia_loss_relief_killswitch: -5010.77, multiyear_pia_real: -40996.42, multiyear_pia_midyear_real: -43245.68, multiyear_jv_real: -18628.18, pia_cpr_carry_two_years: -3935.48 };
    expect(d.profileGap.slice(1).map((g) => g.case)).toEqual(Object.keys(want));
    d.profileGap.slice(1).forEach((g) => { money(g.gap, want[g.case]); rate(g.engineRatePct, 6.8); rate(g.oracleRatePct, 6.796117); expect(g.gapUnit).toBe('USD'); });
  });
  it('DEFECT (b): the two-root and three-root vectors', () => {
    expect(d.twoRoots.map((r) => r.name)).toEqual(['two_roots_2_and_6', 'three_roots_0_7_33']);
    pct(d.twoRoots[0].engineIrrPct, 6); pct(d.twoRoots[0].oracleIrrPct, 2); pct(d.twoRoots[0].gap, 4); expect(d.twoRoots[0].gapUnit).toBe('percentage points');
    pct(d.twoRoots[1].engineIrrPct, 7.3509); pct(d.twoRoots[1].oracleIrrPct, 0); pct(d.twoRoots[1].gap, 7.3509);
    expect(d.twoRoots[0].methodStatement).toContain('Newton');
  });
  it('DEFECT (c): the sinking fund is working-interest scaled and the lump sum is not', () => {
    const [full, half, lump] = d.sinkingFund;
    expect(full.case).toBe('pia_sinking_fund'); money(full.totalContributions, 30000000); money(full.totalAbandonmentCost, 30000000); rate(full.unitTechnicalCost, 28.082192); vol(full.totalBoe, 18250000);
    expect(half.case).toBe('pia_sinking_fund_wi_50'); expect(half.wiPct).toBe(50); money(half.totalContributions, 15000000); money(half.totalAbandonmentCost, 30000000); rate(half.unitTechnicalCost, 29.726027); vol(half.totalBoe, 9125000);
    expect(lump.case).toBe('jv_abandonment_wi_60'); expect(lump.wiPct).toBe(60); money(lump.totalAbandonmentCost, 10000000); money(lump.finalRowAbandonmentCost, 10000000); rate(lump.unitTechnicalCost, 40);
  });
});

// ---------------------------------------------------------------------------
// 7. THE CAPSTONE: the eighteen graded fields, exactly.
// ---------------------------------------------------------------------------

describe('the IKPOTO capstone: the eighteen graded fields reproduce fields.json exactly', () => {
  const fields = L.ikpotoCapstoneFields();
  it('has eighteen fields in the published order, six per tier', () => {
    expect(fields).toHaveLength(18);
    expect(fields.map((f) => f[1])).toEqual(CAPSTONE_FIELDS.map((f) => f[1]));
    expect(fields.map((f) => f[0])).toEqual(CAPSTONE_FIELDS.map((f) => f[0]));
    expect(fields.map((f) => f[3])).toEqual(CAPSTONE_FIELDS.map((f) => f[3]));
    ['beginner', 'intermediate', 'advanced'].forEach((t) => expect(fields.filter((f) => f[0] === t)).toHaveLength(6));
  });
  CAPSTONE_FIELDS.forEach(([tier, key, value, tol]) => {
    it(`${key} (${tier}) is exactly ${value}, graded within ${tol}`, () => {
      expect(L.ikpotoCapstoneValues()[key]).toBe(value);
      expect(L.ikpotoCapstoneTolerances()[key]).toBe(tol);
    });
  });
  it('the capstone conditions are the derivation conditions, verbatim', () => {
    expect(L.IKPOTO_JV.base_year).toBe(2031); expect(L.IKPOTO_JV.jv_working_interest_pct).toBe(80);
    expect(L.IKPOTO_PIA.pia_lease_status).toBe('new'); expect(L.IKPOTO_PIA.pia_prior_cumulative_oil_bbl).toBe(97612500);
    expect(L.IKPOTO_PIA.pia_cpr_limit_pct).toBe(35); expect(L.IKPOTO_PIA.abandonment_cost_usd).toBe(40000000);
    expect(L.IKPOTO_PROD).toHaveLength(6); expect(L.IKPOTO_CAPEX).toHaveLength(2); expect(L.IKPOTO_OPEX).toHaveLength(6);
    const runs = L.ikpotoRuns();
    expect(runs.pia.kpis.fiscal_framework).toBe('nta_2025');
    expect(runs.pia.cashFlowData[1].prod_alw_cap_applied).toBe(true);
    expect(runs.pia.cashFlowData[runs.pia.cashFlowData.length - 1].net_cash_flow).toBeLessThan(0);
  });
});

// ---------------------------------------------------------------------------
// 8. THE LEAK GATE: no teaching number may be a graded capstone answer.
// ---------------------------------------------------------------------------

// Engine functions re-exported for the panels' benefit; they take arguments
// and return nothing on a bare call, so they are not teaching VALUES. Every
// other export is walked. The list is asserted, so a new reader that throws
// cannot hide in it.
const ENGINE_FUNCTIONS = [
  'computeCashFlow', 'computeBreakevenOilPrice', 'npv', 'irr', 'paybackYears', 'paybackPeriod',
  'extractAnnualVolumes', 'extractAnnualCapex', 'extractAnnualOpex', 'isVolumeColumn',
  'parsePriceDeck', 'resolveStreamPrice', 'applyJV', 'applyPSC', 'pscTrancheShare',
  'deriveOilRoyaltyRate', 'deriveGasRoyaltyRate', 'derivePriceRoyaltyRate', 'deriveHctRate',
  'computeProductionAllowance', 'determineFiscalFramework',
  'goldenCase', 'publishedCase', 'kpiSummary', 'leakGuardTargets', 'leakGuardHit', 'collectNumbers',
];

/** Every teaching export evaluated: constants as they are, readers called bare. */
const teachingSurface = () => {
  const out = [];
  Object.entries(L).forEach(([name, v]) => {
    if (L.CAPSTONE_ONLY_EXPORTS.includes(name) || ENGINE_FUNCTIONS.includes(name)) return;
    if (name === 'LEAK_GUARD_MARGIN' || name === 'LEAK_GUARD_SCALINGS') return;
    out.push({ name, value: typeof v === 'function' ? v() : v });
  });
  // The parametric readers at every argument a panel can hand them.
  L.AKATA_YEARS.forEach((y) => {
    out.push({ name: `akataYearCascade(${y})`, value: L.akataYearCascade(y) });
    out.push({ name: `akataPiaYearWaterfall(${y})`, value: L.akataPiaYearWaterfall(y) });
  });
  L.PSC_CAP_SWEEP_PCT.forEach((cap) => out.push({ name: `akataUnderPsc(${cap})`, value: L.akataUnderPsc(cap) }));
  L.AKATA_PIA_VARIANTS.forEach(([label, patch]) => out.push({ name: `akataUnderPia(${label})`, value: L.akataUnderPia(patch) }));
  L.BASIS_COMBINATIONS.forEach(([b, c]) => out.push({ name: `akataProfile(${b} ${c})`, value: L.akataProfile({ present_value_basis: b, discounting_convention: c }) }));
  return out;
};

describe('THE LEAK GATE: no teaching number may be a graded capstone answer', () => {
  // The threshold is the grader's own, and it is ABSOLUTE:
  // academy_submit_capstone accepts abs(v_got - v_exp) <= v_tol. Ten times
  // that band, so a lesson that rounds a number in prose still cannot land on
  // an answer, in three unit shiftings, so restating a USD answer in
  // thousands or a thousandth does not evade it. The gate is dimension blind
  // on purpose: a graded box takes any number and never asks what it measured.
  const targets = L.leakGuardTargets();

  it('the guard is built from all eighteen fields in all three unit shiftings', () => {
    expect(targets).toHaveLength(18 * 3);
    expect(L.LEAK_GUARD_MARGIN).toBe(10);
    const t = targets.find((x) => x.key === 'jv_npv_real_usd' && x.tag === 'as graded');
    expect(t.gradingBand).toBe(1); expect(t.band).toBe(10);
    const k = targets.find((x) => x.key === 'jv_npv_real_usd' && x.tag === 'x0.001');
    expect(k.gradingBand).toBe(0.001); expect(k.value).toBeCloseTo(20656.33721686185, 9);
    const m = targets.find((x) => x.key === 'jv_irr_pct' && x.tag === 'x1000');
    expect(m.gradingBand).toBeCloseTo(0.1, 12);
  });

  it('walks a large teaching surface and every reader answers a bare call', () => {
    const surface = teachingSurface();
    expect(surface.length).toBeGreaterThan(100);
    const numbers = surface.flatMap((s) => L.collectNumbers(s.value, s.name));
    expect(numbers.length).toBeGreaterThan(5000);
  });

  it('NO number returned by any teaching export is within ten grading bands of a graded answer, in any shifting', () => {
    const hits = [];
    teachingSurface().forEach((s) => {
      L.collectNumbers(s.value, s.name).forEach((n) => {
        const t = L.leakGuardHit(n.value, targets);
        if (t) hits.push(`${n.path} = ${n.value} is within ${t.band} of ${t.key} ${t.tag} (${t.value})`);
      });
    });
    expect(hits).toEqual([]);
  });

  it('the teaching surface never names the capstone field', () => {
    const text = JSON.stringify(teachingSurface());
    expect(text.toLowerCase()).not.toContain('ikpoto');
    expect(text).not.toMatch(/[–—]/);
  });

  it('THE GUARD IS LIVE: every graded answer, planted, is caught in every shifting', () => {
    const values = L.ikpotoCapstoneValues();
    const tol = L.ikpotoCapstoneTolerances();
    Object.entries(values).forEach(([key, v]) => {
      const drift = 0.9 * L.LEAK_GUARD_MARGIN * tol[key];
      [v, v + drift, v - drift].forEach((planted) => {
        expect(L.leakGuardHit(planted, targets), `${key} ${planted}`).not.toBeNull();
        expect(L.leakGuardHit(planted * 1000, targets), `${key} ${planted} x1000`).not.toBeNull();
        expect(L.leakGuardHit(planted / 1000, targets), `${key} ${planted} x0.001`).not.toBeNull();
      });
      expect(L.collectNumbers({ planted: [v] }).length).toBe(1);
    });
  });

  it('THE GUARD IS NOT TRIGGER HAPPY: the AKATA headline passes', () => {
    expect(L.leakGuardHit(L.akataKpis().npv, targets)).toBeNull();
    expect(L.leakGuardHit(L.akataKpis().irr, targets)).toBeNull();
    expect(L.leakGuardHit(L.akataBreakeven().breakeven, targets)).toBeNull();
  });
});
