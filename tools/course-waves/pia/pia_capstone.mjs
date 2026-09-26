// THE THREE EC7 CAPSTONES AND THEIR EIGHTEEN GRADED FIELDS.
//
// Every graded value is a return value of the vendored engine
// (engines/economics/cashflow.ts, the default path of ENGINE_VERSION 3.12.0)
// on the terms and rows typed below. Nothing here computes an economic
// quantity: it calls computeCashFlow and reads the row or KPI the key names.
//
// THE CAPSTONE IS NOT THE DIGEST. This file never reads digest.txt or
// pia_dump.mjs, and the digest never reads this. The three cases (ODOZI,
// NKEMDI and ALAKU) are Ekene synthetic leases, labelled synthetic in every
// case file and prompt; their names, terms, rows and values must never enter
// a lesson, a bank, a panel default or a brief (gate_capstone_leak.mjs).
//
// EVERY FIELD IS FREE OF EVERY OPEN READING. The texts leave three questions
// open (the royalty by price base year, the new-acreage lease hydrocarbon tax
// rate onshore or in shallow water, and the deep offshore hydrocarbon tax
// under the Nigeria Tax Act 2025). Each capstone states the engine's default
// or a stated reading for the one it needs, and this file ASSERTS that every
// field it grades comes out bit-identical under every other reading.
// discriminate.mjs repeats the proof beside the wrong methods.
//
//   node pia_capstone.mjs            a table of the eighteen values
//   node pia_capstone.mjs --json     the rows, for make_fields.mjs and gen_course.py
//   node pia_capstone.mjs --inputs   the three cases, for gen_course.py, discriminate.mjs and oracle_check.py
import process from 'node:process';

const HERE = process.env.EC7_WAVE_DIR || '/root/cat-wip-pia';
const TOLPATH = process.env.EC7_TOLERANCE
  || '/root/wt-ec7-nextgen/src/components/course/panels/pia/gradedTolerance.js';
const { E } = await import(`${HERE}/pia_engine.mjs`);
const { GRADED_FIELDS, gradedTolerance, PRINTED_DECIMALS } = await import(TOLPATH);

const ASSERTS = [];
const NOTES = [];
const must = (claim, cond, detail) => { ASSERTS.push({ claim, pass: !!cond, detail: String(detail) }); return !!cond; };
const clone = (o) => JSON.parse(JSON.stringify(o));
const flatOpex = (y0, n, amt) => Array.from({ length: n }, (_, i) => ({ year: y0 + i, total_opex_usd: amt }));

const COMMON = {
  fiscal_regime: 'PIA', discount_rate_pct: 10, inflation_rate_pct: 0, present_value_basis: 'nominal',
  oil_price_escalator_pct: 0, gas_price_escalator_pct: 0, condensate_price_escalator_pct: 0, capex_escalator_pct: 0,
};

/* ================================================================ ODOZI, Associate
   An onshore petroleum mining lease converted from an OML, about 8,600 bopd
   falling ten percent a year, associated gas at 0.6 Mscf per barrel with 40
   percent of it used in-country, a 60 percent working interest, 2027 to 2032,
   every year under the Nigeria Tax Act 2025. Oil at 54 USD/bbl flat, below the
   low royalty by price benchmark of every year on either base. */
const ODOZI = {
  name: 'ODOZI',
  label: 'ODOZI, an Ekene synthetic onshore lease converted from an oil mining lease',
  cfg: {
    ...COMMON, base_year: 2027, oil_price_usd_bbl: 54, gas_price_usd_mscf: 2.8, opex_escalator_pct: 2,
    pia_terrain: 'onshore', pia_license_type: 'PML', pia_lease_status: 'converted', pia_marginal_field_pre_2021: false,
    pia_water_depth_m: 0, pia_working_interest_pct: 60, pia_prior_year_opex_usd: 19000000, pia_prior_cumulative_oil_bbl: 0,
    pia_gas_in_country_share_pct: 40, pia_under_nta_2025_override: 'auto',
  },
  prodRows: [
    { year: 2027, oil_bbl: 3150000, gas_mscf: 1890000, condensate_bbl: 0 },
    { year: 2028, oil_bbl: 2835000, gas_mscf: 1701000, condensate_bbl: 0 },
    { year: 2029, oil_bbl: 2551500, gas_mscf: 1530900, condensate_bbl: 0 },
    { year: 2030, oil_bbl: 2296350, gas_mscf: 1377810, condensate_bbl: 0 },
    { year: 2031, oil_bbl: 2066715, gas_mscf: 1240029, condensate_bbl: 0 },
    { year: 2032, oil_bbl: 1860044, gas_mscf: 1116026, condensate_bbl: 0 },
  ],
  capexRows: [{ year: 2027, amount_usd: 48000000 }, { year: 2028, amount_usd: 22000000 }],
  opexRows: flatOpex(2027, 6, 21000000),
};

/* ================================================================ NKEMDI, Professional
   A shallow water petroleum mining lease (85 m) granted out of new acreage,
   64.5 MMbbl produced before 2027, about 47,000 bopd falling sixteen percent a
   year with condensate at five percent of the oil and gas at 0.9 Mscf per
   barrel (a quarter used in-country), a 45 percent working interest, 2027 to
   2033, every year under the Nigeria Tax Act 2025. Oil 54, condensate 51
   USD/bbl flat, below every low benchmark. The new-lease hydrocarbon tax rate
   is stated at 30 as a reading; no field depends on it. */
const NKEMDI = {
  name: 'NKEMDI',
  label: 'NKEMDI, an Ekene synthetic shallow water lease granted out of new acreage',
  cfg: {
    ...COMMON, base_year: 2027, oil_price_usd_bbl: 54, condensate_price_usd_bbl: 51, gas_price_usd_mscf: 3.1, opex_escalator_pct: 0,
    pia_terrain: 'shallow_water', pia_license_type: 'PML', pia_lease_status: 'new', pia_new_pml_hct_rate_pct: 30,
    pia_marginal_field_pre_2021: false, pia_water_depth_m: 85, pia_working_interest_pct: 45,
    pia_prior_year_opex_usd: 160000000, pia_prior_cumulative_oil_bbl: 64500000, pia_gas_in_country_share_pct: 25,
    pia_under_nta_2025_override: 'auto',
  },
  prodRows: [
    { year: 2027, oil_bbl: 16400000, gas_mscf: 14760000, condensate_bbl: 820000 },
    { year: 2028, oil_bbl: 13776000, gas_mscf: 12398400, condensate_bbl: 688800 },
    { year: 2029, oil_bbl: 11571840, gas_mscf: 10414656, condensate_bbl: 578592 },
    { year: 2030, oil_bbl: 9720346, gas_mscf: 8748311, condensate_bbl: 486017 },
    { year: 2031, oil_bbl: 8165090, gas_mscf: 7348581, condensate_bbl: 408255 },
    { year: 2032, oil_bbl: 6858676, gas_mscf: 6172808, condensate_bbl: 342934 },
    { year: 2033, oil_bbl: 5761288, gas_mscf: 5185159, condensate_bbl: 288064 },
  ],
  capexRows: [{ year: 2027, amount_usd: 620000000 }, { year: 2028, amount_usd: 410000000 }, { year: 2030, amount_usd: 180000000 }],
  opexRows: flatOpex(2027, 7, 185000000),
};

/* ================================================================ ALAKU, Expert
   A deep offshore petroleum mining lease (1,350 m) granted out of new acreage,
   62,000 bopd in 2025 falling twelve percent a year, gas at 1.1 Mscf per
   barrel with 60 percent used in-country, a 20 percent working interest, 2025
   to 2029: 2025 under the Act alone, 2026 onward under the Nigeria Tax Act
   2025. Oil at 180 USD/bbl flat, above the top royalty by price benchmark of
   every year on either base. A decommissioning sinking fund of 90 million USD
   at the share, whose NTA s.86 escrow condition is NOT met. The deep offshore
   reading is stated "conservative_zero"; no field depends on it. */
const ALAKU = {
  name: 'ALAKU',
  label: 'ALAKU, an Ekene synthetic deep offshore lease granted out of new acreage',
  cfg: {
    ...COMMON, base_year: 2025, oil_price_usd_bbl: 180, gas_price_usd_mscf: 3.4, opex_escalator_pct: 0,
    pia_terrain: 'deep_offshore', pia_license_type: 'PML', pia_lease_status: 'new', pia_marginal_field_pre_2021: false,
    pia_deep_offshore_hct_interpretation: 'conservative_zero', pia_water_depth_m: 1350, pia_working_interest_pct: 20,
    pia_prior_year_opex_usd: 0, pia_prior_cumulative_oil_bbl: 0, pia_gas_in_country_share_pct: 60,
    abandonment_cost_usd: 90000000, abandonment_funding_mode: 'sinking_fund', pia_decom_escrow_condition_met: false,
    pia_under_nta_2025_override: 'auto',
  },
  prodRows: [
    { year: 2025, oil_bbl: 22630000, gas_mscf: 24893000, condensate_bbl: 0 },
    { year: 2026, oil_bbl: 19914400, gas_mscf: 21905840, condensate_bbl: 0 },
    { year: 2027, oil_bbl: 17524672, gas_mscf: 19277139, condensate_bbl: 0 },
    { year: 2028, oil_bbl: 15421711, gas_mscf: 16963882, condensate_bbl: 0 },
    { year: 2029, oil_bbl: 13571106, gas_mscf: 14928217, condensate_bbl: 0 },
  ],
  capexRows: [{ year: 2025, amount_usd: 2400000000 }, { year: 2026, amount_usd: 350000000 }],
  opexRows: flatOpex(2025, 5, 420000000),
};

export const CASES = { ODOZI, NKEMDI, ALAKU };

const runCase = (c, patch = {}) => E.computeCashFlow({ cfg: { ...clone(c.cfg), ...patch }, prodRows: clone(c.prodRows), capexRows: clone(c.capexRows), opexRows: clone(c.opexRows) });
const row = (r, y) => r.cashFlowData.find((d) => d.year === y);

// THE FIELD READERS: one per key, the only place a field is read from a run.
export const READ = {
  odozi_2028_liquids_royalty_rate: ['ODOZI', (r) => row(r, 2028).royalty_rate_liquids],
  odozi_2029_production_royalty_usd: ['ODOZI', (r) => row(r, 2029).production_royalty],
  odozi_2030_hct_usd: ['ODOZI', (r) => row(r, 2030).hct_tax],
  odozi_2031_dev_levy_usd: ['ODOZI', (r) => row(r, 2031).dev_levy_tax],
  odozi_total_cit_usd: ['ODOZI', (r) => r.kpis.total_cit],
  odozi_government_take_pct: ['ODOZI', (r) => r.kpis.government_take_pct],
  nkemdi_2028_liquids_royalty_usd: ['NKEMDI', (r) => row(r, 2028).liquids_production_royalty],
  nkemdi_2029_production_allowance_usd: ['NKEMDI', (r) => row(r, 2029).production_allowance],
  nkemdi_2029_hct_chargeable_profit_usd: ['NKEMDI', (r) => row(r, 2029).hct_chargeable_profit],
  nkemdi_2031_cpr_deferred_usd: ['NKEMDI', (r) => row(r, 2031).cpr_deferred_to_next],
  nkemdi_cpr_forfeited_usd: ['NKEMDI', (r) => r.kpis.cpr_forfeited_at_cessation ?? 0],
  nkemdi_total_cit_usd: ['NKEMDI', (r) => r.kpis.total_cit],
  alaku_2026_total_royalty_usd: ['ALAKU', (r) => row(r, 2026).royalty],
  alaku_2026_hct_chargeable_profit_usd: ['ALAKU', (r) => row(r, 2026).hct_chargeable_profit],
  alaku_2025_tet_usd: ['ALAKU', (r) => row(r, 2025).tet_tax],
  alaku_2027_dev_levy_usd: ['ALAKU', (r) => row(r, 2027).dev_levy_tax],
  alaku_2028_cit_usd: ['ALAKU', (r) => row(r, 2028).cit_tax],
  alaku_total_cit_usd: ['ALAKU', (r) => r.kpis.total_cit],
};

// THE OPEN READINGS each case is proved free of (each patch is a reading the
// texts permit that the capstone does not state).
export const OPEN_READINGS = {
  ODOZI: { act_2020_base: { pia_price_royalty_base: 'act_2020' } },
  NKEMDI: { act_2020_base: { pia_price_royalty_base: 'act_2020' }, new_lease_rate_15: { pia_new_pml_hct_rate_pct: 15 } },
  ALAKU: {
    act_2020_base: { pia_price_royalty_base: 'act_2020' },
    deep_aggressive_pml_30: { pia_deep_offshore_hct_interpretation: 'aggressive_pml_30' },
    deep_custom_20: { pia_deep_offshore_hct_interpretation: 'custom', pia_deep_offshore_hct_custom_rate_pct: 20 },
  },
};

const RUN = {};
for (const [n, c] of Object.entries(CASES)) {
  try { RUN[n] = runCase(c); must(`${n}: the engine returns a ledger`, RUN[n].cashFlowData.length > 0, n); } catch (e) { must(`${n}: the engine returns a ledger`, false, e.message); }
}

/* ------------------------------------------------ the scenario each prompt describes */
if (RUN.ODOZI && RUN.NKEMDI && RUN.ALAKU) {
  const od = RUN.ODOZI; const nk = RUN.NKEMDI; const al = RUN.ALAKU;
  must('ODOZI: every year is a Nigeria Tax Act 2025 year', od.cashFlowData.every((d) => d.fiscal_framework === 'nta_2025'), od.kpis.fiscal_framework);
  must('ODOZI: every year sits inside the onshore small-field tranches (5,000 to 10,000 bopd)', od.cashFlowData.every((d) => d.royalty_liquids_bopd > 5000 && d.royalty_liquids_bopd < 10000), od.cashFlowData.map((d) => d.royalty_liquids_bopd));
  must('ODOZI: 2028 is a leap year of 366 days', E.calendarDays(2028) === 366, E.calendarDays(2028));
  must('ODOZI: no royalty by price in any year (54 USD below every low benchmark)', od.cashFlowData.every((d) => d.price_royalty === 0), 'price');
  must('ODOZI: the converted-lease hydrocarbon tax rate is 30 percent', od.cashFlowData.every((d) => d.hct_rate === 0.3), 'hct');
  must('ODOZI: the gas royalty rate is 4 percent (40 percent at 2.5, 60 percent at 5)', od.cashFlowData.every((d) => Math.abs(d.royalty_rate_gas - 0.04) < 1e-15), od.cashFlowData[0].royalty_rate_gas);
  must('ODOZI: the cost price ratio never defers cost', od.cashFlowData.every((d) => d.cpr_deferred_to_next === 0), 'cpr');
  must('ODOZI: the government take is defined', Number.isFinite(od.kpis.government_take_pct), od.kpis.government_take_pct);

  must('NKEMDI: every year is a Nigeria Tax Act 2025 year', nk.cashFlowData.every((d) => d.fiscal_framework === 'nta_2025'), nk.kpis.fiscal_framework);
  must('NKEMDI: 2028 is a leap year', E.calendarDays(2028) === 366, 'leap');
  must('NKEMDI: the 100 MMbbl shallow water cap is crossed in 2029, split inside the year', row(nk, 2029).prod_alw_below_cap_bbl > 0 && row(nk, 2029).prod_alw_after_cap_bbl > 0, `${row(nk, 2029).prod_alw_below_cap_bbl} ${row(nk, 2029).prod_alw_after_cap_bbl}`);
  must('NKEMDI: every year before 2029 is below the cap and every year after it above', nk.cashFlowData.every((d) => (d.year < 2029 ? d.prod_alw_after_cap_bbl === 0 : d.year > 2029 ? d.prod_alw_below_cap_bbl === 0 : true)), 'cap');
  must('NKEMDI: the cost price ratio first defers cost in 2030 and carries it every later year', row(nk, 2029).cpr_deferred_to_next === 0 && [2030, 2031, 2032, 2033].every((y) => row(nk, y).cpr_deferred_to_next > 0), 'cpr');
  must('NKEMDI: cost is forfeited at cessation', nk.kpis.cpr_forfeited_at_cessation > 0, nk.kpis.cpr_forfeited_at_cessation);
  must('NKEMDI: no royalty by price (54 and 51 USD below every low benchmark)', nk.cashFlowData.every((d) => d.price_royalty === 0), 'price');
  must('NKEMDI: the stated new-lease rate is what the hydrocarbon tax used', nk.cashFlowData.every((d) => d.hct_rate === 0.3), 'rate');

  must('ALAKU: 2025 is a PIA year and 2026 onward NTA years', row(al, 2025).fiscal_framework === 'pia_only' && al.cashFlowData.filter((d) => d.year >= 2026).every((d) => d.fiscal_framework === 'nta_2025') && al.kpis.nta_first_year === 2026, al.kpis.fiscal_framework);
  must('ALAKU: 2025 and 2026 straddle the 50,000 bopd deep offshore tier, 2027 onward below it', row(al, 2025).royalty_liquids_bopd > 50000 && row(al, 2026).royalty_liquids_bopd > 50000 && [2027, 2028, 2029].every((y) => row(al, y).royalty_liquids_bopd < 50000), al.cashFlowData.map((d) => d.royalty_liquids_bopd));
  must('ALAKU: royalty by price at 10 percent in every year', al.cashFlowData.every((d) => d.price_royalty_rate_oil === 0.1), 'price');
  must('ALAKU: no hydrocarbon tax in the PIA year (s.260(3))', row(al, 2025).hct_rate === 0 && row(al, 2025).hct_tax === 0, 'hct');
  must('ALAKU: a production allowance in 2025 and none in the NTA years', row(al, 2025).production_allowance > 0 && al.cashFlowData.filter((d) => d.year >= 2026).every((d) => d.production_allowance === 0), 'alw');
  must('ALAKU: the tertiary education tax in 2025 and the development levy from 2026', row(al, 2025).tet_tax > 0 && row(al, 2025).dev_levy_tax === 0 && al.cashFlowData.filter((d) => d.year >= 2026).every((d) => d.tet_tax === 0 && d.dev_levy_tax > 0), 'tet');
  must('ALAKU: the fund contribution is deducted in 2025 and not in the NTA years', row(al, 2025).decom_fund_deduction > 0 && al.cashFlowData.filter((d) => d.year >= 2026).every((d) => d.decom_fund_deduction === 0), 'decom');
}

/* ---------------------------------------------------------------- the rows */
const ROWS = GRADED_FIELDS.map(([tier, key, cls]) => {
  const [cn, get] = READ[key];
  return { tier, key, cls, value: RUN[cn] ? get(RUN[cn]) : NaN };
});
must('the eighteen rows are the eighteen declared fields', ROWS.length === 18 && ROWS.every((r) => READ[r.key]), ROWS.length);
must('every field is read from its own tier\'s case', ROWS.every((r) => ({ beginner: 'ODOZI', intermediate: 'NKEMDI', advanced: 'ALAKU' })[r.tier] === READ[r.key][0]), 'tiers');
ROWS.forEach((r) => must(`${r.key} is a finite number away from zero`, Number.isFinite(r.value) && Math.abs(r.value) > 1e-3, r.value));
// NEVER GRADE A WHOLE NUMBER: a whole number sits inside every guard band.
ROWS.forEach((r) => must(`${r.key} is not a whole number`, Math.abs(r.value - Math.round(r.value)) > 1e-3 || r.cls === 'ratio', r.value));
ROWS.forEach((r) => must(`${r.key}: one tolerance spans at least two units in the last place of the double it grades`, gradedTolerance(r.key) >= 2 * Number.EPSILON * Math.abs(r.value), r.value));

/* --------------------------------------------- independence of every open reading */
for (const [cn, readings] of Object.entries(OPEN_READINGS)) {
  for (const [rn, patch] of Object.entries(readings)) {
    let alt;
    try { alt = runCase(CASES[cn], patch); } catch (e) { must(`${cn} under ${rn} runs`, false, e.message); continue; }
    ROWS.filter((r) => READ[r.key][0] === cn).forEach((r) => {
      const v = READ[r.key][1](alt);
      must(`OPEN READING: ${r.key} is identical under ${rn}`, v === r.value, `${v} vs ${r.value}`);
    });
    NOTES.push(`OPEN READING ${cn} ${rn}: every field of the case bit-identical`);
  }
}

/* -------------------------------------------------------------- reporting */
const failed = ASSERTS.filter((a) => !a.pass);
if (failed.length) {
  failed.forEach((a) => process.stderr.write(`  FAILED  ${a.claim}\n          ${a.detail}\n`));
  process.stderr.write(`pia_capstone: ${ASSERTS.length} assertions, ${failed.length} FAILED. NOTHING WRITTEN.\n`);
  process.exit(1);
}
const quiet = process.argv.includes('--json') || process.argv.includes('--inputs');
if (!quiet) NOTES.forEach((n) => process.stderr.write(`  ${n}\n`));
process.stderr.write(`pia_capstone: ${ASSERTS.length} scenario, field and open-reading assertions run, 0 failed\n`);

const MAIN = import.meta.url === `file://${process.argv[1]}`;
if (MAIN && process.argv.includes('--json')) {
  process.stdout.write(`${JSON.stringify(ROWS)}\n`);
} else if (MAIN && process.argv.includes('--inputs')) {
  process.stdout.write(`${JSON.stringify(CASES)}\n`);
} else if (MAIN) {
  const pad = (s, n2) => String(s).padEnd(n2);
  process.stdout.write(`${pad('TIER', 14)}${pad('KEY', 40)}${pad('CLASS', 9)}${pad('VALUE', 24)}TOLERANCE\n`);
  ROWS.forEach((r) => process.stdout.write(
    `${pad(r.tier, 14)}${pad(r.key, 40)}${pad(r.cls, 9)}${pad(r.value.toFixed(PRINTED_DECIMALS[r.cls]), 24)}${gradedTolerance(r.key)}\n`));
}
