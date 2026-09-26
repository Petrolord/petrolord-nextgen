// THIS SCRIPT RUNS THE PUBLISHED GOLDEN CASES of cashflow_cases.json (plus
// sweeps around those published inputs, and the TEACHING FIELD this wave
// designed for itself, AKATA). THE EC1 CAPSTONE RUNS DIFFERENT CONDITIONS
// ENTIRELY: nothing here imports, reads or reproduces ec1_fields.mjs,
// fields.json, or any capstone field name, volume, price, cost, rate or year.
// The teaching digest and the capstone are two files with opposite audiences
// and they never share a number.
//
// Usage:  sh /root/ec-wip-cashflow/build_digest.sh > /root/ec-wip-cashflow/digest.txt
//
// Engine:  packages/engines/engines/economics/cashflow.ts (bundled to
//          scratch/cashflow.mjs by build_digest.sh; TypeScript because it is
//          deployed as a Supabase edge function)
// Golden:  packages/engines/test-data/economics/goldens/cashflow_cases.json
//
// EVERY NUMBER PRINTED HERE IS A RETURN VALUE OF THE ENGINE, except where a
// line says "oracle", in which case it is copied from the golden's
// disagreement record, and the two are printed side by side. Nothing is
// computed in this file beyond calling the engine and formatting.

import fs from 'fs';

const ROOT = process.env.EC1_ENGINES || '/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen/packages/engines';
const HERE = process.env.EC1_WAVE_DIR || new URL('.', import.meta.url).pathname.replace(/\/$/, '');
const E = await import(`${HERE}/scratch/cashflow.mjs`);
const G = JSON.parse(fs.readFileSync(`${ROOT}/test-data/economics/goldens/cashflow_cases.json`, 'utf8'));
const CASE = Object.fromEntries(G.cases.map((c) => [c.name, c]));

const out = [];
const w = (s = '') => out.push(s);
const f = (x, n = 2) => (x === null || x === undefined || Number.isNaN(Number(x)) || typeof x === 'string' && x !== '' && Number.isNaN(Number(x)))
  ? (typeof x === 'string' ? x : 'null') : Number(x).toFixed(n);
const m = (x) => f(x, 2);          // USD
const r = (x) => f(x, 6);          // rates, ratios, fractions
const p = (x) => f(x, 4);          // percent
const v = (x) => f(x, 2);          // volumes
const yn = (b) => (b === true ? 'true' : b === false ? 'false' : 'null');
// THE DEFAULT PATH (engines 3.12.0). Every PIA run in this digest is the engine
// as the gazetted texts write it: pia_legacy_pre_audit is removed from every
// published config, and so is pia_tet_rate_pct, so the tertiary education tax
// is the statutory rate for the row's year (3 percent from 2023). Every other
// published input is kept as stated. A config the engine refuses prints the
// refusal verbatim.
const DP = (cfg) => { if (!cfg || cfg.fiscal_regime !== 'PIA') return cfg; const c = { ...cfg }; delete c.pia_legacy_pre_audit; delete c.pia_tet_rate_pct; return c; };
const run = (c) => E.computeCashFlow({ cfg: DP(c.cfg), prodRows: c.prodRows, capexRows: c.capexRows, opexRows: c.opexRows });
const tryRun = (c) => { try { return run(c); } catch (err) { return { refused: String(err.message) }; } };
const refusal = (c) => { try { run(c); return null; } catch (err) { return String(err.message); } };
// Published cases the default path refuses, and the stated inputs this digest
// runs them with instead. A NEW-acreage PML onshore or in shallow water has no
// hydrocarbon tax rate in the text (PIA s.267, NTA s.72 do not say 15 or 30):
// the reading is stated, both are printed, and neither is ever graded.
const STATED = {
  allowance_cap_midyear: { pia_new_pml_hct_rate_pct: 30 },
  pia_onshore_new_lease: { pia_new_pml_hct_rate_pct: 30 },
  pia_marginal_field_blend: { pia_terrain: 'onshore' },
};
// The published notes of the PIA cases describe the inputs; these are the
// digest's own descriptions of the same inputs, stating nothing the tables
// below do not show.
const NOTES = {
  pia_worked_example: 'The published PIA 2021 worked example inputs: one year, 2025, a converted shallow-water PML at 50,000 bopd, NDDC stated as a fixed 15,000,000 and prior-year opex 170,000,000.',
  nta_switch_force_pia: 'The worked example with pia_under_nta_2025_override force_pia.',
  nta_switch_force_nta: 'The worked example with pia_under_nta_2025_override force_nta.',
  nta_auto_by_base_year: 'The worked example\'s volumes in 2026 with the override on auto.',
  allowance_cap_midyear: 'A new shallow-water PML with 99,000,000 bbl produced before the year, so the year crosses the 100,000,000 bbl new-lease allowance cap. Run with the stated new-PML hydrocarbon tax rate 30 (a stated reading; Section 23).',
  cpr_forfeiture: 'One year built to test the cost price ratio cap and what happens to cost the cap defers when there is no later year.',
  elt_pia_multiyear: 'The economic limit on a multi-year PIA field.',
  pia_loss_relief: 'A PIA loss year followed by a profitable year, on the HCT and CIT bases.',
  pia_loss_relief_killswitch: 'The same case with apply_loss_carryforward false.',
  pia_gas_only_hct_zero: 'A gas-only PIA field.',
  pia_gas_only_legacy_hct: 'The gas-only field with pia_hct_include_gas_revenue true, the whole-revenue HCT base option.',
  pia_mixed_streams_hct_apportioned: 'Oil, gas and condensate together in one PIA year.',
  pia_deep_offshore_full: 'Deep offshore at 60,000 bopd in 2025, a year under the PIA.',
  pia_deep_offshore_wi_50: 'The same deep offshore field at a 50 percent working interest.',
  pia_deep_offshore_naive_30k: 'Half the volumes, 30,000 bopd, at a 100 percent working interest.',
  pia_deep_offshore_nta_aggressive: 'Deep offshore under force_nta with the stated reading aggressive_pml_30 (Section 23).',
  pia_deep_offshore_nta_custom: 'Deep offshore under force_nta with the stated reading custom at 12.5 percent (Section 23).',
  pia_marginal_field_blend: 'A producing marginal field converted under PIA s.94(1) at 8,000 bopd. The published config enters the terrain as marginal_field, which the engine refuses; the digest runs it onshore with pia_marginal_field_pre_2021 true.',
  pia_frontier_exempt: 'Frontier acreage held under a PPL.',
  pia_onshore_new_lease: 'An onshore new-acreage PML. Run with the stated new-PML hydrocarbon tax rate 30 (a stated reading; Section 23).',
  pia_high_price_royalty_tiers: 'An oil price between the middle and the high royalty-by-price benchmark.',
  pia_price_royalty_ceiling: 'An oil price above the high royalty-by-price benchmark.',
  min_etr_85: 'The worked example with pia_apply_minimum_etr true and the minimum stated at 85 percent.',
  min_etr_not_binding: 'The worked example with pia_apply_minimum_etr true at 15 percent.',
  pia_sinking_fund: 'A sinking fund for abandonment on the worked example.',
  pia_sinking_fund_wi_50: 'The sinking fund case at a 50 percent working interest.',
  pia_prior_year_opex_zero: 'The worked example with no prior-year opex.',
  pia_hct_override: 'The worked example with pia_hct_rate_override_pct 20.',
  pia_ppl_license: 'The worked example held under a PPL.',
  pia_cpr_carry_two_years: 'A multi-year case with the cost price ratio limit stated at 30 percent.',
  pia_cit_allowance_restricted_carry: 'A 2025 to 2026 case for the companies income tax capital allowance restriction to two thirds of assessable profit, and its carryforward.',
  pia_cit_allowance_no_carry: 'The same case with cit_restricted_allowance_carryforward false.',
};
const noteOf = (c) => NOTES[c.name] ?? c.note;
const casePIA = (name) => { const c = CASE[name]; return STATED[name] ? withCfgRaw(c, STATED[name]) : c; };
function withCfgRaw(c, patch) { const o = JSON.parse(JSON.stringify(c)); o.cfg = { ...o.cfg, ...patch }; return o; }
const notesLine = (k) => (k.pia_notes && k.pia_notes.length ? ` Engine statements (kpis.pia_notes): ${k.pia_notes.map((n) => `[${NOTE_INDEX(n)}]`).join(' ')}.` : '');
const NOTE_SEEN = [];
const NOTE_INDEX = (n) => { let i = NOTE_SEEN.indexOf(n); if (i < 0) { NOTE_SEEN.push(n); i = NOTE_SEEN.length - 1; } return `N${i + 1}`; };
const clone = (o) => JSON.parse(JSON.stringify(o));
const withCfg = (c, patch) => ({ ...clone(c), cfg: { ...clone(c.cfg), ...patch } });

const kpiLine = (k) => `NPV ${m(k.npv)} USD, IRR ${k.irr === null ? 'null' : p(k.irr) + ' percent'}, payback ${k.payback} (${k.payback_years === null ? 'null' : r(k.payback_years)} years), discounted payback ${k.discounted_payback_years === null ? 'null' : r(k.discounted_payback_years)} years, DPI ${k.dpi === null || k.dpi === undefined ? 'null' : r(k.dpi)}, take ${k.government_take_pct === null || k.government_take_pct === undefined ? 'null' : p(k.government_take_pct) + ' percent'}, discounted take ${k.government_take_pct_discounted === null || k.government_take_pct_discounted === undefined ? 'null' : p(k.government_take_pct_discounted) + ' percent'}`;

const JV_COLS = ['year', 'oil_bbl', 'gas_mscf', 'condensate_bbl', 'applied_oil_price', 'gross_revenue', 'royalty', 'opex', 'capex', 'depreciation', 'taxable_income', 'loss_offset_used', 'loss_carryforward', 'tax', 'net_cash_flow', 'real_net_cash_flow', 'discounted_cash_flow', 'cumulative_cash_flow'];
const PSC_COLS = ['year', 'gross_revenue', 'royalty', 'opex', 'capex', 'taxable_income', 'tax', 'net_cash_flow', 'psc_cost_pool_after', 'psc_contractor_share_pct', 'psc_itc_used', 'psc_itc_carryforward', 'discounted_cash_flow', 'cumulative_cash_flow'];
const PIA_COLS = ['year', 'oil_bbl', 'condensate_bbl', 'gas_mscf', 'applied_oil_price', 'gross_revenue', 'production_royalty', 'price_royalty', 'royalty', 'hcdt', 'nddc', 'opex', 'capex', 'cpr_cap', 'cpr_costs_claimed', 'cpr_deferred_to_next', 'hct_assessable_profit', 'production_allowance', 'prod_alw_eligible_bbl', 'prod_alw_cap_applied', 'hct_chargeable_profit', 'hct_loss_offset_used', 'hct_loss_carryforward', 'hct_tax', 'cit_assessable_profit', 'cit_chargeable_profit', 'cit_loss_offset_used', 'cit_loss_carryforward', 'cit_tax', 'tet_tax', 'dev_levy_tax', 'tax', 'net_cash_flow', 'real_net_cash_flow', 'discounted_cash_flow', 'cumulative_cash_flow', 'fiscal_framework', 'cumulative_oil_bbl_lifetime'];
const fmtCell = (k, x) => {
  if (x === null || x === undefined) return 'null';
  if (typeof x === 'boolean') return yn(x);
  if (typeof x === 'string') return x;
  if (k === 'year') return String(x);
  if (/price|share_pct/.test(k)) return r(x);
  if (/bbl|mscf|boe/.test(k)) return v(x);
  return m(x);
};
const table = (rows, cols) => {
  const present = cols.filter((c) => rows.some((row) => row[c] !== undefined));
  w(`| ${present.join(' | ')} |`);
  w(`| ${present.map(() => '---').join(' | ')} |`);
  for (const row of rows) w(`| ${present.map((c) => fmtCell(c, row[c])).join(' | ')} |`);
};
const cfgLine = (cfg) => Object.entries(cfg).filter(([, x]) => x !== null && x !== undefined).map(([k, x]) => `${k}=${typeof x === 'object' ? JSON.stringify(x) : typeof x === 'number' ? String(x) : x}`).join(', ');
const rowsLine = (rows) => rows.map((row) => Object.entries(row).map(([k, x]) => `${k}=${x}`).join(' ')).join('; ');

// ---------------------------------------------------------------- Section 1
w('# EC1 Cash Flow & NPV. The teaching digest.');
w();
w('# SECTION 1: The engine, its version and what it refuses (owned by Associate m01)');
w();
w(`Engine version ${E.ENGINE_VERSION}. Every table below is a return value of computeCashFlow, computeBreakevenOilPrice, npv, irr, paybackYears, the PIA rate derivations or the price resolver. Money is USD, volumes are bbl and Mscf, boe uses 6 Mscf per barrel, rates are percent unless a column says otherwise.`);
w();
w(`Every PIA run below is the engine on its default path, which follows the texts as gazetted: ${E.PIA_TEXTS.pia}; ${E.PIA_TEXTS.nta}; ${E.PIA_TEXTS.regs}; ${E.PIA_TEXTS.fa2023}. The texts were read on ${E.PIA_TEXTS.read_on}. The tertiary education tax is left at the statutory rate for each year, and every other input a case states is printed with it. Section 22 lists the engine's own statements about what it approximates, and Section 23 the three figures the texts leave to a stated reading, which this course never grades.`);
w();
w('The engine refuses a run rather than emitting a zero-USD answer when the upload cannot be read. The eight refusals the golden publishes, with the message each one throws:');
w();
for (const e of G.errors) {
  let msg = '(no error thrown)';
  try { run(e); } catch (err) { msg = String(err.message); }
  w(`- ${e.name}: ${msg}`);
}
w();

// ---------------------------------------------------------------- Section 2
w('# SECTION 2: Every published case, one line each (owned by Associate m01)');
w();
w('Name, the golden\'s note, and the headline KPIs the engine returns today.');
w();
const RESULT = {};
for (const c0 of G.cases) {
  const why = refusal(c0);
  const c = why ? casePIA(c0.name) : c0;
  const res = run(c); RESULT[c0.name] = res;
  w(`- ${c0.name}: ${noteOf(c0)}`);
  if (why) w(`  The published config is REFUSED on the default path: ${why} Run with ${cfgLine(STATED[c0.name])}.`);
  w(`  ${kpiLine(res.kpis)}; total revenue ${m(res.kpis.total_revenue)}, total capex ${m(res.kpis.total_capex)}, total opex ${m(res.kpis.total_opex)}, total tax ${m(res.kpis.total_tax)}, total net cash flow ${m(res.kpis.total_net_cash_flow)} (${res.kpis.pv_basis} basis, ${res.kpis.discounting_convention}, applied rate ${r(res.kpis.discount_rate_applied_pct)} percent, framework ${res.kpis.fiscal_framework}), ${res.cashFlowData.length} rows.${notesLine(res.kpis)}`);
}
w();

// ---------------------------------------------------------------- Section 3
w('# SECTION 3: The hand-derived JV case, row by row (owned by Associate m04, Associate m05)');
w();
{
  const c = CASE.jv_analytic_decision_kpis; const res = RESULT[c.name];
  w(`Inputs: ${cfgLine(DP(c.cfg))}. Production ${rowsLine(c.prodRows)}. Capex ${rowsLine(c.capexRows)}. Opex ${rowsLine(c.opexRows)}.`);
  w();
  table(res.cashFlowData, JV_COLS);
  w();
  w(`KPIs: ${kpiLine(res.kpis)}. Total boe ${v(res.kpis.total_boe)}, unit technical cost ${r(res.kpis.unit_technical_cost_usd_per_boe)} USD/boe, opex per boe ${r(res.kpis.opex_usd_per_boe)} USD/boe, PV of capex ${m(res.kpis.pv_capex)}.`);
  w(`NPV profile: ${res.kpis.npv_profile.map((q) => `${q.rate_pct} percent gives ${m(q.npv)}`).join('; ')}.`);
  w();
  w('The same two years with the tax rate, royalty and working interest each moved on its own (everything else as above):');
  w();
  const variants = [['jv_royalty_pct', 0], ['jv_royalty_pct', 10], ['jv_royalty_pct', 30], ['jv_tax_rate_pct', 0], ['jv_tax_rate_pct', 30], ['jv_tax_rate_pct', 85], ['jv_working_interest_pct', 60], ['jv_working_interest_pct', 25]];
  for (const [k, x] of variants) {
    const res2 = run(withCfg(c, { [k]: x }));
    w(`- ${k} ${x}: year 1 royalty ${m(res2.cashFlowData[0].royalty)}, year 1 tax ${m(res2.cashFlowData[0].tax)}, year 1 net ${m(res2.cashFlowData[0].net_cash_flow)}, year 2 net ${m(res2.cashFlowData[1].net_cash_flow)}, NPV ${m(res2.kpis.npv)}, IRR ${res2.kpis.irr === null ? 'null' : p(res2.kpis.irr)} percent, take ${p(res2.kpis.government_take_pct)} percent.`);
  }
}
w();

// ---------------------------------------------------------------- Section 4
w('# SECTION 4: From rows to years (owned by Associate m02)');
w();
for (const name of ['per_well_beats_total_rollup', 'month_index_rows', 'usd_fallback_parts', 'duplicate_identical_aliases', 'case_insensitive_headers', 'alaoma_csv_ingestion']) {
  const c = STATED[name] ? casePIA(name) : CASE[name]; const res = RESULT[name];
  w(`### ${name}`);
  w();
  w(`${noteOf(c)}`);
  w();
  w(`Production rows as uploaded: ${rowsLine(c.prodRows)}.`);
  w(`Capex rows: ${c.capexRows.length ? rowsLine(c.capexRows) : '(none)'}. Opex rows: ${c.opexRows.length ? rowsLine(c.opexRows) : '(none)'}.`);
  const vols = E.extractAnnualVolumes(c.prodRows, c.cfg.base_year);
  const cap = E.extractAnnualCapex(c.capexRows, c.cfg.base_year);
  const op = E.extractAnnualOpex(c.opexRows, c.cfg.base_year);
  w(`Annual volumes the engine reads: ${vols.map((q) => `${q.year}: oil ${v(q.oil_bbl)} bbl, gas ${v(q.gas_mscf)} Mscf, condensate ${v(q.condensate_bbl)} bbl, water ${v(q.water_bbl)} bbl`).join('; ')}.`);
  w(`Annual capex: ${[...cap.entries()].map(([y, x]) => `${y}: ${m(x)}`).join('; ') || '(none)'}. Annual opex: ${[...op.entries()].map(([y, x]) => `${y}: ${m(x)}`).join('; ') || '(none)'}.`);
  w(`Result: ${kpiLine(res.kpis)}; total revenue ${m(res.kpis.total_revenue)}, total capex ${m(res.kpis.total_capex)}, total opex ${m(res.kpis.total_opex)}.`);
  w();
}
w('### Which columns count as volumes');
w();
for (const k of ['oil_bbl', 'w1_oil_bbl', 'total_oil_bbl', 'gas_mscf', 'w2_gas_mscf', 'condensate_bbl', 'water_bbl', 'OIL_BBL', 'oil', 'oil_price_usd_bbl', 'opex_usd', 'year', 'date', 'month_index', 'w1_oil_bbl_forecast']) {
  w(`- isVolumeColumn("${k}") = ${yn(E.isVolumeColumn(k))}`);
}
w();

// ---------------------------------------------------------------- Section 5
w('# SECTION 5: Prices (owned by Associate m03)');
w();
for (const name of ['flat_escalator', 'escalator_defaults_to_inflation', 'deck_step_hold', 'deck_differential', 'deck_scale', 'deck_before_first_entry']) {
  const c = STATED[name] ? casePIA(name) : CASE[name]; const res = RESULT[name];
  w(`### ${name}`);
  w();
  w(`${noteOf(c)}`);
  w(`Config: ${cfgLine(DP(c.cfg))}.`);
  w(`Applied oil price by year: ${res.cashFlowData.map((q) => `${q.year}: ${r(q.applied_oil_price)}`).join('; ')}. Gross revenue by year: ${res.cashFlowData.map((q) => `${q.year}: ${m(q.gross_revenue)}`).join('; ')}.`);
  if (name === 'escalator_defaults_to_inflation') {
    w(`Opex by year (escalated at the inflation default): ${res.cashFlowData.map((q) => `${q.year}: ${m(q.opex)}`).join('; ')}. Capex by year (escalator default 0): ${res.cashFlowData.map((q) => `${q.year}: ${m(q.capex)}`).join('; ')}.`);
  }
  w();
}
w('### The deck resolver on its own');
w();
{
  const cfg = CASE.deck_step_hold.cfg;
  const deck = E.parsePriceDeck(cfg);
  w(`Parsed oil deck of deck_step_hold: ${deck.oil.map((q) => `${q.year} at ${q.value}`).join(', ')}. Gas deck entries: ${deck.gas.length}. Condensate deck entries: ${deck.condensate.length}.`);
  const years = [2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035];
  w(`resolveStreamPrice with flat base 80 and escalator 10 percent from base year 2030: ${years.map((y) => `${y}: ${r(E.resolveStreamPrice(deck.oil, 80, 0.10, 2030, y))}`).join('; ')}.`);
  w(`resolveStreamPrice with NO deck, flat 80, escalator 10 percent, base 2030: ${years.map((y) => `${y}: ${r(E.resolveStreamPrice([], 80, 0.10, 2030, y))}`).join('; ')}.`);
  w(`resolveStreamPrice with NO deck, flat 80, escalator 0: ${years.map((y) => `${y}: ${r(E.resolveStreamPrice([], 80, 0, 2030, y))}`).join('; ')}.`);
}
w();
w('### Three streams, one fiscal price');
w();
{
  const c = CASE.pia_mixed_streams_hct_apportioned; const res = RESULT[c.name];
  w(`${noteOf(c)}`);
  w(`Config: ${cfgLine(DP(c.cfg))}. Production ${rowsLine(c.prodRows)}.`);
  table(res.cashFlowData, PIA_COLS);
  w(`Total boe ${v(res.kpis.total_boe)} from oil ${v(res.kpis.total_oil_bbl)}, condensate ${v(res.kpis.total_condensate_bbl)} and gas ${v(res.kpis.total_gas_mscf)} Mscf.`);
}
w();
// ---------------------------------------------------------------- Section 6
// THE TEACHING FIELD. Designed for this wave: it is not a golden case and it
// is not the capstone. Seven years of a declining oil field with associated
// gas under joint venture terms, on a real basis with inflation, so the same
// rows can be read by all three tiers.
const AKATA = {
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
const AK = run(AKATA);
w('# SECTION 6: The teaching field, AKATA, under joint venture terms (owned by Associate m04, Associate m05, Associate m06)');
w();
w('AKATA is a teaching field designed for this course. It is not a golden case and it is not graded anywhere. Seven years, oil with associated gas at 800 scf per barrel, capex in the first two years, flat opex in money of the day that the escalator inflates, real basis.');
w();
w(`Config: ${cfgLine(AKATA.cfg)}.`);
w(`Production: ${rowsLine(AKATA.prodRows)}.`);
w(`Capex: ${rowsLine(AKATA.capexRows)}. Opex: ${rowsLine(AKATA.opexRows)}.`);
w();
table(AK.cashFlowData, [...JV_COLS, 'applied_gas_price', 'cumulative_nominal', 'cumulative_real']);
w();
w(`KPIs: ${kpiLine(AK.kpis)}.`);
w(`Totals: revenue ${m(AK.kpis.total_revenue)}, capex ${m(AK.kpis.total_capex)}, opex ${m(AK.kpis.total_opex)}, tax ${m(AK.kpis.total_tax)}, net cash flow nominal ${m(AK.kpis.total_net_cash_flow_nominal)}, net cash flow real ${m(AK.kpis.total_net_cash_flow_real)}, oil ${v(AK.kpis.total_oil_bbl)} bbl, gas ${v(AK.kpis.total_gas_mscf)} Mscf, boe ${v(AK.kpis.total_boe)}, unit technical cost ${r(AK.kpis.unit_technical_cost_usd_per_boe)} USD/boe, opex per boe ${r(AK.kpis.opex_usd_per_boe)} USD/boe, PV of capex ${m(AK.kpis.pv_capex)}, applied real rate ${r(AK.kpis.discount_rate_applied_pct)} percent.`);
w(`NPV profile: ${AK.kpis.npv_profile.map((q) => `${q.rate_pct} percent gives ${m(q.npv)}`).join('; ')}.`);
w();
w('### The cascade in one year, 2031');
w();
{
  const q = AK.cashFlowData.find((x) => x.year === 2031);
  w(`Oil ${v(q.oil_bbl)} bbl at ${r(q.applied_oil_price)} USD/bbl and gas ${v(q.gas_mscf)} Mscf at ${r(q.applied_gas_price)} USD/Mscf give gross revenue ${m(q.gross_revenue)}. Royalty at 15 percent ${m(q.royalty)}. Opex ${m(q.opex)} (24000000 escalated). Depreciation ${m(q.depreciation)}. Taxable income ${m(q.taxable_income)}. Tax at 40 percent ${m(q.tax)}. Capex ${m(q.capex)}. Net cash flow ${m(q.net_cash_flow)}, real ${m(q.real_net_cash_flow)}, discounted ${m(q.discounted_cash_flow)}, cumulative ${m(q.cumulative_cash_flow)}.`);
}
w();
w('### Working interest');
w();
for (const wi of [100, 75, 60, 40, 25]) {
  const res = run(withCfg(AKATA, { jv_working_interest_pct: wi }));
  w(`- WI ${wi} percent: 2029 gross revenue ${m(res.cashFlowData[0].gross_revenue)}, royalty ${m(res.cashFlowData[0].royalty)}, tax ${m(res.cashFlowData[0].tax)}, net ${m(res.cashFlowData[0].net_cash_flow)}; total oil ${v(res.kpis.total_oil_bbl)} bbl; NPV ${m(res.kpis.npv)}; IRR ${p(res.kpis.irr)} percent; take ${p(res.kpis.government_take_pct)} percent; unit technical cost ${r(res.kpis.unit_technical_cost_usd_per_boe)} USD/boe; reported working_interest_pct ${res.kpis.working_interest_pct}.`);
}
w();
w('### Depreciation');
w();
for (const [label, patch] of [['default (jv_psc_depr_years unset, 10 years)', {}], ['jv_psc_depr_years 7', { jv_psc_depr_years: 7 }], ['jv_psc_depr_years 5', { jv_psc_depr_years: 5 }], ['jv_psc_depr_years 1', { jv_psc_depr_years: 1 }], ['depreciation_method nigeria_ppt', { depreciation_method: 'nigeria_ppt' }]]) {
  const res = run(withCfg(AKATA, patch));
  w(`- ${label}: depreciation by year ${res.cashFlowData.map((q) => `${q.year}: ${m(q.depreciation)}`).join('; ')}; sum ${m(res.cashFlowData.reduce((s, q) => s + q.depreciation, 0))} of capex ${m(res.kpis.total_capex)}; tax by year ${res.cashFlowData.map((q) => `${q.year}: ${m(q.tax)}`).join('; ')}; total tax ${m(res.kpis.total_tax)}; NPV ${m(res.kpis.npv)}.`);
}
w();

// ---------------------------------------------------------------- Section 7
w('# SECTION 7: Discounting: convention, basis, valuation year, sunk years (owned by Professional m01, Professional m02)');
w();
w('### AKATA under the four combinations of basis and convention');
w();
for (const basis of ['nominal', 'real']) for (const conv of ['end_year', 'mid_year']) {
  const res = run(withCfg(AKATA, { present_value_basis: basis, discounting_convention: conv }));
  w(`- ${basis} basis, ${conv}: applied rate ${r(res.kpis.discount_rate_applied_pct)} percent, NPV ${m(res.kpis.npv)}, discounted cash flow by year ${res.cashFlowData.map((q) => `${q.year}: ${m(q.discounted_cash_flow)}`).join('; ')}; IRR ${p(res.kpis.irr)} percent; discounted payback ${r(res.kpis.discounted_payback_years)} years; total net cash flow ${m(res.kpis.total_net_cash_flow)}.`);
}
w();
{
  const nom = run(withCfg(AKATA, { present_value_basis: 'nominal' }));
  const re = run(withCfg(AKATA, { present_value_basis: 'real' }));
  w(`On the real basis the 2033 nominal net cash flow ${m(nom.cashFlowData[4].net_cash_flow)} deflates to ${m(re.cashFlowData[4].real_net_cash_flow)} (four years of 3 percent) and discounts at the real rate to ${m(re.cashFlowData[4].discounted_cash_flow)}; on the nominal basis the same flow discounts at 10 percent to ${m(nom.cashFlowData[4].discounted_cash_flow)}.`);
  const zero = run(withCfg(AKATA, { present_value_basis: 'real', inflation_rate_pct: 0, opex_escalator_pct: 0, oil_price_escalator_pct: 0, gas_price_escalator_pct: 0 }));
  const zeroN = run(withCfg(AKATA, { present_value_basis: 'nominal', inflation_rate_pct: 0, opex_escalator_pct: 0, oil_price_escalator_pct: 0, gas_price_escalator_pct: 0 }));
  w(`With inflation and every escalator set to zero the real NPV is ${m(zero.kpis.npv)} and the nominal NPV is ${m(zeroN.kpis.npv)}, applied rates ${r(zero.kpis.discount_rate_applied_pct)} and ${r(zeroN.kpis.discount_rate_applied_pct)} percent.`);
}
w();
w('### Inflation sweep on AKATA, real basis, escalators as configured');
w();
for (const inf of [0, 1, 2, 3, 5, 8]) {
  const res = run(withCfg(AKATA, { inflation_rate_pct: inf }));
  w(`- inflation ${inf} percent: applied real rate ${r(res.kpis.discount_rate_applied_pct)} percent, NPV ${m(res.kpis.npv)}, total net cash flow nominal ${m(res.kpis.total_net_cash_flow_nominal)}, real ${m(res.kpis.total_net_cash_flow_real)}.`);
}
w();
w('### Published discounting cases');
w();
for (const name of ['mid_year_discounting', 'valuation_year_forward', 'valuation_year_sunk']) {
  const c = STATED[name] ? casePIA(name) : CASE[name]; const res = RESULT[name];
  w(`### ${name}`);
  w(`${noteOf(c)}`);
  w(`Config: ${cfgLine(DP(c.cfg))}. Production ${rowsLine(c.prodRows)}. Capex ${rowsLine(c.capexRows)}. Opex ${rowsLine(c.opexRows)}.`);
  table(res.cashFlowData, [...JV_COLS, 'sunk']);
  w(`KPIs: ${kpiLine(res.kpis)}; valuation_year ${res.kpis.valuation_year ?? 'not reported'}; sunk_net_cash_flow ${res.kpis.sunk_net_cash_flow === undefined ? 'not reported' : m(res.kpis.sunk_net_cash_flow)}; total net cash flow ${m(res.kpis.total_net_cash_flow)}; total capex ${m(res.kpis.total_capex)}.`);
  w();
}
w('### AKATA valued from later years');
w();
for (const vy of [2029, 2030, 2031, 2032]) {
  for (const sunk of [false, true]) {
    const res = run(withCfg(AKATA, { valuation_year: vy, treat_prior_as_sunk: sunk }));
    w(`- valuation_year ${vy}, treat_prior_as_sunk ${sunk}: NPV ${m(res.kpis.npv)}, IRR ${res.kpis.irr === null ? 'null' : p(res.kpis.irr) + ' percent'}, payback ${res.kpis.payback}, sunk_net_cash_flow ${res.kpis.sunk_net_cash_flow === undefined ? 'not reported' : m(res.kpis.sunk_net_cash_flow)}, total capex ${m(res.kpis.total_capex)}, total net cash flow ${m(res.kpis.total_net_cash_flow)}, rows flagged sunk ${res.cashFlowData.filter((q) => q.sunk === true).length}.`);
  }
}
w();

// ---------------------------------------------------------------- Section 8
w('# SECTION 8: The NPV profile, and the point that misses (owned by Professional m03, Expert m05)');
w();
w('The engine reports NPV at 0, 5, 8, 10, 12, 15 and 20 percent plus the applied rate. The header says the applied point always passes through the headline NPV. The engine LABELS that point with the applied rate rounded to two decimals and EVALUATES it at the exact applied rate, so it passes through the headline NPV on a real basis whose Fisher rate is not a round number too; every gap below is 0.00. Below, the profile as the engine returns it, then the headline NPV, then NPV recomputed by the engine\'s own npv() at the exact applied rate on the same discounted flows, then the oracle\'s number from the golden.');
w();
const DIS = Object.fromEntries(G.disagreements.map((d) => [d.case, d]));
for (const [label, res, c] of [['AKATA', AK, AKATA], ...['multiyear_pia_real', 'multiyear_jv_real', 'multiyear_pia_midyear_real', 'pia_loss_relief', 'allowance_cap_midyear', 'jv_analytic_decision_kpis', 'multiyear_pia_nominal'].map((n) => [n, RESULT[n], CASE[n]])]) {
  const k = res.kpis;
  const applied = k.npv_profile.find((q) => !([0, 5, 8, 10, 12, 15, 20].includes(q.rate_pct))) || k.npv_profile.find((q) => q.rate_pct === k.discount_rate_applied_pct);
  const flows = res.cashFlowData.filter((q) => q.sunk !== true).map((q) => (k.pv_basis === 'real' ? q.real_net_cash_flow : q.net_cash_flow));
  const first = res.cashFlowData.filter((q) => q.sunk !== true)[0].year;
  const exact = E.npv(flows, k.discount_rate_applied_pct / 100, k.valuation_year ?? c.cfg.base_year, first);
  const d = DIS[label];
  w(`- ${label}: profile ${k.npv_profile.map((q) => `${q.rate_pct}: ${m(q.npv)}`).join('; ')}. Headline NPV ${m(k.npv)} at the applied rate ${r(k.discount_rate_applied_pct)} percent. Profile point labelled ${applied ? applied.rate_pct : 'none'} percent reads ${applied ? m(applied.npv) : 'null'}. Engine npv() at the exact applied rate on the ${k.pv_basis} flows (${k.discounting_convention === 'mid_year' ? 'mid-year exponents, so this recomputation uses the end-year rule and is only comparable where the convention is end_year' : 'end-year'}): ${m(exact)}. Gap profile point minus headline ${m((applied ? applied.npv : NaN) - k.npv)}.${d ? ` Oracle: ${m(d.oracle.npv)} at ${r(d.oracle.rate_pct)} percent, recorded gap ${m(d.gap)} ${d.gap_unit}.` : ''}`);
}
w();

// ---------------------------------------------------------------- Section 9
w('# SECTION 9: The internal rate of return (owned by Professional m04)');
w();
w('Fifteen published cash flow vectors through irr(). Where the golden records a disagreement, the oracle\'s root is printed beside the engine\'s. NPV at each candidate rate is the engine\'s own npv() with base year and first year equal, so exponent i is the position in the vector.');
w();
for (const c of G.irr) {
  const eng = E.irr(c.flows);
  const engPct = eng === null ? null : eng * 100;
  const cand = [];
  if (engPct !== null) cand.push(engPct);
  if (c.disagreement) cand.push(c.disagreement.oracle_irr_pct);
  const at = (pct) => E.npv(c.flows, pct / 100, 0, 0);
  w(`- ${c.name}: flows [${c.flows.join(', ')}]. Engine IRR ${engPct === null ? 'null' : p(engPct) + ' percent'}; golden IRR ${c.irr_pct === null || c.irr_pct === undefined ? 'null' : p(c.irr_pct) + ' percent'}.${c.disagreement ? ` Oracle IRR ${p(c.disagreement.oracle_irr_pct)} percent (engine ${p(c.disagreement.engine_irr_pct)}).` : ''} NPV at 0 percent ${m(at(0))}, at 10 percent ${m(at(10))}, at 20 percent ${m(at(20))}${cand.map((x) => `, at ${p(x)} percent ${r(at(x))}`).join('')}.${c.note ? ' ' + c.note : ''}`);
}
w();
w('### The NPV curve of the two-root and three-root vectors, sampled');
w();
for (const name of ['two_roots_2_and_6', 'two_roots_10_and_20', 'two_roots_minus73_and_173', 'three_roots_0_7_33', 'no_real_root', 'loss_making', 'late_payout']) {
  const c = G.irr.find((x) => x.name === name);
  const rates = [-90, -75, -50, -25, -10, 0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20, 25, 30, 33, 40, 50, 75, 100, 150, 175, 200];
  w(`- ${name}: ${rates.map((x) => `${x}: ${r(E.npv(c.flows, x / 100, 0, 0))}`).join('; ')}.`);
}
w();
w('### IRR on AKATA and its neighbours');
w();
for (const [label, patch] of [['as configured', {}], ['oil price 60', { oil_price_usd_bbl: 60 }], ['oil price 45', { oil_price_usd_bbl: 45 }], ['oil price 38', { oil_price_usd_bbl: 38 }], ['capex doubled (420000000 and 90000000)', null], ['abandonment 60000000 in 2035', { abandonment_cost_usd: 60000000 }], ['abandonment 200000000 in 2035', { abandonment_cost_usd: 200000000 }]]) {
  const c = patch === null ? { ...clone(AKATA), capexRows: [{ year: 2029, amount_usd: 420000000 }, { year: 2030, amount_usd: 90000000 }] } : withCfg(AKATA, patch);
  const res = run(c);
  const flows = res.cashFlowData.map((q) => q.net_cash_flow);
  w(`- ${label}: nominal net cash flows [${flows.map((x) => m(x)).join(', ')}]; IRR ${res.kpis.irr === null ? 'null' : p(res.kpis.irr) + ' percent'}; NPV ${m(res.kpis.npv)}; NPV of the nominal flows at 0 percent ${m(E.npv(flows, 0, 2029, 2029))}, at 100 percent ${m(E.npv(flows, 1, 2029, 2029))}, at 300 percent ${m(E.npv(flows, 3, 2029, 2029))}; payback ${res.kpis.payback}.`);
}
w();

// ---------------------------------------------------------------- Section 10
w('# SECTION 10: Payback, discounted payback, DPI and take (owned by Professional m03, Associate m05)');
w();
for (const [label, res] of [['AKATA', AK], ...['jv_analytic_decision_kpis', 'multiyear_jv_real', 'multiyear_pia_real', 'zero_rates_capex_only', 'single_year_positive', 'jv_loss_unused_at_cessation'].map((n) => [n, RESULT[n]])]) {
  const k = res.kpis;
  w(`- ${label}: cumulative cash flow by year ${res.cashFlowData.map((q) => `${q.year}: ${m(q.cumulative_cash_flow)}`).join('; ')}. Payback "${k.payback}", payback_years ${k.payback_years === null ? 'null' : r(k.payback_years)}, discounted payback ${k.discounted_payback_years === null || k.discounted_payback_years === undefined ? 'null' : r(k.discounted_payback_years)}. PV of capex ${k.pv_capex === undefined ? 'not reported' : m(k.pv_capex)}, NPV ${m(k.npv)}, DPI ${k.dpi === null || k.dpi === undefined ? 'null' : r(k.dpi)}. Take ${k.government_take_pct === null || k.government_take_pct === undefined ? 'null' : p(k.government_take_pct) + ' percent'}, discounted take ${k.government_take_pct_discounted === null || k.government_take_pct_discounted === undefined ? 'null' : p(k.government_take_pct_discounted) + ' percent'}. Unit technical cost ${k.unit_technical_cost_usd_per_boe === null || k.unit_technical_cost_usd_per_boe === undefined ? 'null' : r(k.unit_technical_cost_usd_per_boe)} USD/boe, opex per boe ${k.opex_usd_per_boe === null || k.opex_usd_per_boe === undefined ? 'null' : r(k.opex_usd_per_boe)}.`);
}
w();
{
  const k = AK.kpis;
  w(`On AKATA the pre-take value is revenue ${m(k.total_revenue)} less capex ${m(k.total_capex)} less opex ${m(k.total_opex)}, all NOMINAL; the take is one minus the contractor's total NOMINAL net cash flow ${m(k.total_net_cash_flow_nominal)} over that pre-take value, ${p(k.government_take_pct)} percent, and it does NOT use the real total ${m(k.total_net_cash_flow_real)} even on a real-basis run. Discounted take ${p(k.government_take_pct_discounted)} percent is the same ratio on present values.`);
  w(`Payback is interpolated on the NOMINAL cumulative cash flow: AKATA's payback_years ${r(k.payback_years)} comes from cumulative_nominal ${m(AK.cashFlowData[2].cumulative_nominal)} at the end of 2031 against the 2032 nominal net cash flow ${m(AK.cashFlowData[3].net_cash_flow)}, while the displayed cumulative_cash_flow column on a real-basis run is the REAL running sum (${m(AK.cashFlowData[2].cumulative_cash_flow)} at the end of 2031), which does not reproduce it.`);
}
w();

// ---------------------------------------------------------------- Section 11
w('# SECTION 11: Sweeps (owned by Professional m05)');
w();
for (const [name, sw] of Object.entries(G.sweeps)) {
  w(`### ${name}`);
  w(`${sw.note}`);
  w();
  const key = Object.keys(sw.points[0]).find((k) => !['inputs', 'kpis'].includes(k));
  for (const pt of sw.points) {
    const res = run(pt.inputs);
    const k = res.kpis;
    w(`- ${key} ${pt[key]}: NPV ${m(k.npv)}, IRR ${k.irr === null ? 'null' : p(k.irr) + ' percent'}, payback ${k.payback}, take ${k.government_take_pct === null || k.government_take_pct === undefined ? 'null' : p(k.government_take_pct) + ' percent'}, total revenue ${m(k.total_revenue)}, total tax ${m(k.total_tax)}, total royalties ${k.total_royalties === undefined ? 'n/a' : m(k.total_royalties)}, unit technical cost ${k.unit_technical_cost_usd_per_boe === null || k.unit_technical_cost_usd_per_boe === undefined ? 'null' : r(k.unit_technical_cost_usd_per_boe)}, rows ${res.cashFlowData.length}${k.economic_limit_year !== undefined ? `, economic limit year ${k.economic_limit_year}, years trimmed ${k.years_trimmed_by_economic_limit}` : ''}${k.total_hct !== undefined ? `, HCT ${m(k.total_hct)}, CIT ${m(k.total_cit)}, production allowance ${m(k.total_production_allowance)}` : ''}.`);
  }
  w();
}
w('### AKATA oil price sweep');
w();
for (const px of [30, 35, 38, 40, 45, 50, 60, 70, 82, 90, 100, 120]) {
  const res = run(withCfg(AKATA, { oil_price_usd_bbl: px })); const k = res.kpis;
  w(`- oil price ${px}: NPV ${m(k.npv)}, IRR ${k.irr === null ? 'null' : p(k.irr) + ' percent'}, payback ${k.payback}, take ${p(k.government_take_pct)} percent, total revenue ${m(k.total_revenue)}, total tax ${m(k.total_tax)}, net cash flow real ${m(k.total_net_cash_flow_real)}, tax by year ${res.cashFlowData.map((q) => m(q.tax)).join(', ')}.`);
}
w();
w('### AKATA discount rate sweep, real basis');
w();
for (const dr of [0, 2, 4, 6, 8, 10, 12, 15, 20, 25]) {
  const res = run(withCfg(AKATA, { discount_rate_pct: dr })); const k = res.kpis;
  w(`- nominal discount rate ${dr} percent: applied real rate ${r(k.discount_rate_applied_pct)} percent, NPV ${m(k.npv)}, discounted payback ${k.discounted_payback_years === null ? 'null' : r(k.discounted_payback_years)} years, DPI ${r(k.dpi)}, PV of capex ${m(k.pv_capex)}, discounted take ${p(k.government_take_pct_discounted)} percent.`);
}
w();
w('### AKATA capex and opex scaled');
w();
for (const s of [0.6, 0.8, 1.0, 1.2, 1.5, 2.0]) {
  const c = clone(AKATA); c.capexRows = c.capexRows.map((q) => ({ ...q, amount_usd: q.amount_usd * s }));
  const res = run(c); const k = res.kpis;
  const c2 = clone(AKATA); c2.opexRows = c2.opexRows.map((q) => ({ ...q, total_opex_usd: q.total_opex_usd * s }));
  const res2 = run(c2); const k2 = res2.kpis;
  w(`- scale ${s}: capex scaled gives NPV ${m(k.npv)}, IRR ${p(k.irr)} percent, payback ${k.payback}, unit technical cost ${r(k.unit_technical_cost_usd_per_boe)}; opex scaled gives NPV ${m(k2.npv)}, IRR ${p(k2.irr)} percent, payback ${k2.payback}, opex per boe ${r(k2.opex_usd_per_boe)}.`);
}
w();

// ---------------------------------------------------------------- Section 12
w('# SECTION 12: The breakeven oil price (owned by Professional m05)');
w();
for (const c of G.breakeven) {
  const be = E.computeBreakevenOilPrice({ cfg: DP(c.cfg), prodRows: c.prodRows, capexRows: c.capexRows, opexRows: c.opexRows });
  const isPIA = c.cfg.fiscal_regime === 'PIA';
  let atBe = 'null';
  if (be !== null) atBe = m(run(withCfg(c, { oil_price_usd_bbl: be })).kpis.npv);
  w(`- ${c.name}: engine breakeven ${be === null ? 'null' : r(be) + ' USD/bbl'}; ${isPIA ? '' : `golden ${c.breakeven_usd_bbl === null ? 'null' : r(c.breakeven_usd_bbl)}; `}NPV rerun at the breakeven ${atBe}${isPIA ? '' : `; golden NPV at breakeven ${c.npv_at_breakeven === null || c.npv_at_breakeven === undefined ? 'null' : r(c.npv_at_breakeven)}`}.${c.note && !isPIA ? ' ' + c.note : ''} Config oil price ${c.cfg.oil_price_usd_bbl}, deck ${c.cfg.price_deck ? JSON.stringify(c.cfg.price_deck) : 'none'}.`);
}
{
  const be = E.computeBreakevenOilPrice(AKATA);
  const at = run(withCfg(AKATA, { oil_price_usd_bbl: be })).kpis;
  w(`- AKATA: breakeven ${r(be)} USD/bbl; NPV rerun at that price ${m(at.npv)}, IRR there ${p(at.irr)} percent, take there ${p(at.government_take_pct)} percent.`);
  for (const [label, patch] of [['nominal basis', { present_value_basis: 'nominal' }], ['discount rate 15', { discount_rate_pct: 15 }], ['royalty 20 and tax 50', { jv_royalty_pct: 20, jv_tax_rate_pct: 50 }], ['WI 60', { jv_working_interest_pct: 60 }], ['with a deck', { price_deck: [{ year: 2029, oil: 82 }] }]]) {
    const be2 = E.computeBreakevenOilPrice(withCfg(AKATA, patch));
    w(`  - ${label}: breakeven ${be2 === null ? 'null' : r(be2) + ' USD/bbl'}.`);
  }
}
w();
// ---------------------------------------------------------------- Section 13
w('# SECTION 13: Production sharing: cost recovery, tranches, the credit (owned by Expert m01)');
w();
for (const name of ['psc_carryforward', 'psc_tranches', 'psc_tranches_prior_cumulative', 'psc_itc', 'psc_wi_50', 'psc_sinking_fund', 'psc_abandonment_wi_50']) {
  const c = STATED[name] ? casePIA(name) : CASE[name]; const res = RESULT[name];
  w(`### ${name}`);
  w(`${noteOf(c)}`);
  w(`Config: ${cfgLine(DP(c.cfg))}. Production ${rowsLine(c.prodRows)}. Capex ${rowsLine(c.capexRows)}. Opex ${rowsLine(c.opexRows)}.`);
  table(res.cashFlowData, [...PSC_COLS, 'oil_bbl', 'decom_fund_contribution', 'abandonment_cost', 'abandonment_cost_funded']);
  w(`KPIs: ${kpiLine(res.kpis)}; total oil ${v(res.kpis.total_oil_bbl)} bbl; working_interest_pct ${res.kpis.working_interest_pct ?? 'not reported'}; unrecovered cost at cessation ${res.kpis.psc_unrecovered_cost_at_cessation === undefined ? 'not reported' : m(res.kpis.psc_unrecovered_cost_at_cessation)}.`);
  w();
}
w('### applyPSC on one year, the cap moving');
w();
{
  const base = { gross_revenue: 100000000, capex: 60000000, opex: 20000000, depreciation: 0, cumulative_unrecovered_cost: 0 };
  for (const cap of [0.2, 0.4, 0.6, 0.8, 1.0]) {
    const o = E.applyPSC(base, 0.10, cap, 0.5, 0.5, 0);
    w(`- cost oil cap ${r(cap)} of revenue after royalty: royalty ${m(o.royalty)}, cost recovered ${m(o.net_cash_flow + base.capex + base.opex + o.tax - o.taxable_income)}, contractor profit oil ${m(o.taxable_income)}, tax ${m(o.tax)}, net ${m(o.net_cash_flow)}, carried forward ${m(o.cumulative_unrecovered_cost_after)}.`);
  }
  w('With 30000000 brought forward from an earlier year at an 0.4 cap:');
  const o2 = E.applyPSC({ ...base, cumulative_unrecovered_cost: 30000000 }, 0.10, 0.4, 0.5, 0.5, 0);
  w(`- contractor profit oil ${m(o2.taxable_income)}, tax ${m(o2.tax)}, net ${m(o2.net_cash_flow)}, carried forward ${m(o2.cumulative_unrecovered_cost_after)}.`);
  w('The tranche table of psc_tranches read at cumulative liquids of 0, 999999, 1000000, 2500000 and 6000000 bbl:');
  const tr = CASE.psc_tranches.cfg.psc_profit_tranches;
  w(`- tranches ${JSON.stringify(tr)}: ${[0, 999999, 1000000, 2500000, 6000000].map((x) => `${x} bbl gives ${r(E.pscTrancheShare(tr, x))}`).join('; ')}.`);
  w(`- an ITC of 40000000 against the same one-year case at the 0.8 cap: used ${m(E.applyPSC(base, 0.10, 0.8, 0.5, 0.5, 40000000).itc_used)}, carried ${m(E.applyPSC(base, 0.10, 0.8, 0.5, 0.5, 40000000).itc_carryforward_after)} (tax before credit ${m(E.applyPSC(base, 0.10, 0.8, 0.5, 0.5, 0).tax)}).`);
}
w();
w('### AKATA under production sharing terms');
w();
{
  const PSC = withCfg(AKATA, { fiscal_regime: 'PSC', psc_royalty_pct: 10, psc_cost_oil_cap_pct: 60, psc_contractor_profit_share_pct: 45, psc_tax_rate_pct: 50, psc_working_interest_pct: 100 });
  const res = run(PSC);
  w(`Config additions: psc_royalty_pct 10, psc_cost_oil_cap_pct 60, psc_contractor_profit_share_pct 45, psc_tax_rate_pct 50. Everything else as AKATA.`);
  table(res.cashFlowData, [...PSC_COLS, 'oil_bbl']);
  w(`KPIs: ${kpiLine(res.kpis)}; unrecovered cost at cessation ${res.kpis.psc_unrecovered_cost_at_cessation === undefined ? 'not reported' : m(res.kpis.psc_unrecovered_cost_at_cessation)}.`);
  w();
  w('THE ROWS CARRY THE POOL BUT NOT THE RECOVERY. A PSC row reports royalty, taxable income (the contractor profit oil), tax, net cash flow and psc_cost_pool_after, the cost still carried at the year end, and kpis.psc_unrecovered_cost_at_cessation reports the pool left when the field stops; no column prints how much cost was recovered in a year. The recovery below is read by marching the engine\'s own applyPSC over the rows the engine produced, year by year, with the carried amount handed forward exactly as computeCashFlow does internally; the marched pool equals psc_cost_pool_after on every row.');
  w();
  for (const cap of [30, 45, 60, 80, 100]) {
    const res2 = run(withCfg(PSC, { psc_cost_oil_cap_pct: cap })); const k = res2.kpis;
    let carry = 0; const pool = []; const recovered = [];
    for (const q of res2.cashFlowData) {
      const o = E.applyPSC({ gross_revenue: q.gross_revenue, capex: q.capex, opex: q.opex, depreciation: 0, cumulative_unrecovered_cost: carry }, 0.10, cap / 100, 0.45, 0.5, 0);
      recovered.push(o.net_cash_flow + q.capex + q.opex + o.tax - o.taxable_income);
      carry = o.cumulative_unrecovered_cost_after; pool.push(carry);
    }
    w(`- cost oil cap ${cap} percent: NPV ${m(k.npv)}, IRR ${p(k.irr)} percent, payback ${k.payback}, take ${p(k.government_take_pct)} percent, tax by year ${res2.cashFlowData.map((q) => m(q.tax)).join(', ')}; cost recovered by year (applyPSC march) ${recovered.map((x) => m(x)).join(', ')}; pool carried at each year end ${pool.map((x) => m(x)).join(', ')}.`);
  }
}
w();

// ---------------------------------------------------------------- Section 14
w('# SECTION 14: The PIA royalties (owned by Expert m02)');
w();
w('### deriveOilRoyaltyRate: the production royalty on crude oil and condensate, by terrain and daily rate');
w();
w('The daily rate is the year\'s crude oil plus condensate over the calendar days of the year. Onshore and shallow water: the first 5,000 bopd at 5 percent, the next 5,000 at 7.5 percent, everything above 10,000 bopd at the terrain rate (15 percent onshore, 12.5 percent shallow water), as ONE weighted average rate on the whole volume. Deep offshore: 5 percent up to and including 50,000 bopd, 7.5 percent on the share above, as one weighted average. Frontier: 7.5 percent at every rate. Below, the rate the engine returns, as a fraction:');
w();
const BOPD = [1, 1000, 4999, 5000, 5001, 6000, 7500, 8000, 9999, 10000, 10001, 12000, 20000, 40000, 49999, 50000, 50001, 60000, 100000, 120000];
for (const terrain of ['onshore', 'shallow_water', 'deep_offshore', 'frontier']) {
  w(`- ${terrain}: ${BOPD.map((q) => `${q} bopd gives ${r(E.deriveOilRoyaltyRate(terrain, q))}`).join('; ')}.`);
}
{
  let msg = '(no error thrown)'; try { E.deriveOilRoyaltyRate('marginal_field', 8000); } catch (err) { msg = String(err.message); }
  w(`- marginal_field is not a terrain: ${msg}`);
}
w();
w('### deriveGasRoyaltyRate: natural gas and NGL, every terrain alike, with the in-country share');
w();
for (const share of [0, 25, 50, 100]) w(`- in-country share ${share} percent: ${['onshore', 'shallow_water', 'deep_offshore', 'frontier'].map((t) => `${t} ${r(E.deriveGasRoyaltyRate(t, share))}`).join('; ')}.`);
w();
w('### priceRoyaltyBenchmarks and derivePriceRoyaltyRate: the royalty by price');
w();
w('The rate is 0 at or below the low benchmark, 5 percent at the middle one, 10 percent at or above the high one, and linear between; frontier acreage pays none. The benchmarks move every 1 January by 2 percent of the previous year\'s benchmark, rounded to whole cents. The Regulations start the escalation from 2021 levels (the engine\'s default, regulations_2021); the Act reads the same levels as 2020 levels (act_2020). Section 23 treats the difference as a stated reading.');
w();
w('| year | regulations_2021 low | mid | high | act_2020 low | mid | high |');
w('| --- | --- | --- | --- | --- | --- | --- |');
for (let y = 2020; y <= 2036; y++) {
  const a = E.priceRoyaltyBenchmarks(y, 'regulations_2021'); const b = E.priceRoyaltyBenchmarks(y, 'act_2020');
  w(`| ${y} | ${m(a.low)} | ${m(a.mid)} | ${m(a.high)} | ${m(b.low)} | ${m(b.mid)} | ${m(b.high)} |`);
}
w();
for (const year of [2021, 2025, 2026, 2030, 2032, 2035]) {
  w(`- ${year}, shallow_water, regulations_2021: ${[40, 50, 55, 60, 75, 80, 100, 110, 125, 150, 160, 200].map((px) => `${px} gives ${r(E.derivePriceRoyaltyRate(px, year, 'shallow_water'))}`).join('; ')}.`);
}
w(`- The Act's own example (Seventh Schedule para 11), 75 USD/bbl in 2020 on the act_2020 base: ${r(E.derivePriceRoyaltyRate(75, 2020, 'shallow_water', 'act_2020'))}.`);
w(`- frontier at 200 USD/bbl in 2025: ${r(E.derivePriceRoyaltyRate(200, 2025, 'frontier'))}.`);
w();
w('### deriveHctRate: the hydrocarbon tax rate');
w();
w('Arguments: terrain, licence, marginal field converted under s.94(1), override, framework, deep offshore reading, custom rate, lease status, new-PML rate. A rate the texts do not settle is refused until the user states it.');
w();
for (const [label, args] of [
  ['shallow_water PML converted, PIA year', ['shallow_water', 'PML', false, null, 'pia_only', null, null, 'converted', null]],
  ['onshore PML converted, NTA year', ['onshore', 'PML', false, null, 'nta_2025', null, null, 'converted', null]],
  ['shallow_water PPL, PIA year', ['shallow_water', 'PPL', false, null, 'pia_only', null, null, 'converted', null]],
  ['onshore PML, marginal field converted under s.94(1)', ['onshore', 'PML', true, null, 'pia_only', null, null, 'converted', null]],
  ['shallow_water new-acreage PML, no rate stated', ['shallow_water', 'PML', false, null, 'pia_only', null, null, 'new', null]],
  ['shallow_water new-acreage PML, stated 30', ['shallow_water', 'PML', false, null, 'pia_only', null, null, 'new', 30]],
  ['shallow_water new-acreage PML, stated 15', ['shallow_water', 'PML', false, null, 'pia_only', null, null, 'new', 15]],
  ['deep_offshore PML, PIA year', ['deep_offshore', 'PML', false, null, 'pia_only', null, null, 'converted', null]],
  ['deep_offshore PML, NTA year, no reading stated', ['deep_offshore', 'PML', false, null, 'nta_2025', null, null, 'converted', null]],
  ['deep_offshore PML, NTA year, conservative_zero', ['deep_offshore', 'PML', false, null, 'nta_2025', 'conservative_zero', null, 'converted', null]],
  ['deep_offshore PML, NTA year, aggressive_pml_30', ['deep_offshore', 'PML', false, null, 'nta_2025', 'aggressive_pml_30', null, 'converted', null]],
  ['deep_offshore PML, NTA year, custom 12.5', ['deep_offshore', 'PML', false, null, 'nta_2025', 'custom', 12.5, 'converted', null]],
  ['frontier, either framework', ['frontier', 'PML', false, null, 'pia_only', null, null, 'converted', null]],
  ['override 20 anywhere', ['onshore', 'PML', false, 20, 'pia_only', null, null, 'converted', null]],
]) {
  let out; try { out = r(E.deriveHctRate(...args)); } catch (err) { out = `REFUSED: ${err.message}`; }
  w(`- ${label}: ${out}`);
}
w();
w('### Published terrain cases');
w();
for (const name of ['pia_deep_offshore_full', 'pia_deep_offshore_wi_50', 'pia_deep_offshore_naive_30k', 'pia_deep_offshore_nta_aggressive', 'pia_deep_offshore_nta_custom', 'pia_marginal_field_blend', 'pia_frontier_exempt', 'pia_onshore_new_lease', 'pia_high_price_royalty_tiers', 'pia_price_royalty_ceiling', 'pia_hct_override', 'pia_ppl_license']) {
  const c = STATED[name] ? casePIA(name) : CASE[name]; const res = RESULT[name];
  w(`### ${name}`);
  w(`${noteOf(c)}`);
  w(`Config: ${cfgLine(DP(c.cfg))}. Production ${rowsLine(c.prodRows)}. Capex ${rowsLine(c.capexRows)}. Opex ${rowsLine(c.opexRows)}.`);
  table(res.cashFlowData, [...PIA_COLS, 'royalty_liquids_bopd', 'royalty_rate_liquids', 'royalty_rate_gas', 'price_royalty_rate_oil', 'hct_rate', 'tet_rate_pct']);
  w(`KPIs: ${kpiLine(res.kpis)}; total royalties ${m(res.kpis.total_royalties)}, HCT ${m(res.kpis.total_hct)}, CIT ${m(res.kpis.total_cit)}, TET ${m(res.kpis.total_tet)}, dev levy ${m(res.kpis.total_dev_levy)}, HCDT ${m(res.kpis.total_hcdt)}, NDDC ${m(res.kpis.total_nddc)}, production allowance ${m(res.kpis.total_production_allowance)}; working_interest_pct ${res.kpis.working_interest_pct ?? 'not reported'}; total oil ${v(res.kpis.total_oil_bbl)} bbl.${notesLine(res.kpis)}`);
  if (name === 'pia_onshore_new_lease' || name === 'pia_marginal_field_blend') {
    const alt = name === 'pia_onshore_new_lease' ? [['stated new-PML rate 15', { pia_new_pml_hct_rate_pct: 15 }]] : [['shallow_water instead of onshore', { pia_terrain: 'shallow_water' }]];
    for (const [label, patch] of alt) {
      const r2 = run(withCfgRaw(c, patch)); const k = r2.kpis;
      w(`- ${label}: HCT rate ${r(r2.cashFlowData[0].hct_rate)}, royalty rate on liquids ${r(r2.cashFlowData[0].royalty_rate_liquids)}, total royalties ${m(k.total_royalties)}, HCT ${m(k.total_hct)}, CIT ${m(k.total_cit)}, total tax ${m(k.total_tax)}, NPV ${m(k.npv)}.`);
    }
  }
  w();
}

// ---------------------------------------------------------------- Section 15
w('# SECTION 15: The hydrocarbon tax cascade (owned by Expert m03)');
w();
w('Order the engine applies in a year: royalties (production, price, gas); HCDT (3 percent of the previous year\'s opex); NDDC (3 percent of the total annual budget, opex plus capex, unless a case states a fixed amount or the opex base); the cost price ratio cap on the costs claimed against the hydrocarbon tax only (65 percent of crude plus condensate revenue by default), with any excess deferred; the production allowance; the hydrocarbon tax on the chargeable profit; companies income tax on its own base, which deducts full opex, royalties, HCDT, NDDC and its own capital allowance and does not deduct the hydrocarbon tax; then TET (PIA years) or the development levy (NTA years). Deductions shared between streams enter the hydrocarbon tax at the crude-plus-condensate share of gross revenue.');
w();
for (const name of ['pia_worked_example', 'allowance_cap_midyear', 'cpr_forfeiture', 'pia_cpr_carry_two_years', 'pia_gas_only_hct_zero', 'pia_gas_only_legacy_hct', 'pia_prior_year_opex_zero', 'pia_cit_allowance_restricted_carry', 'pia_cit_allowance_no_carry', 'multiyear_pia_real', 'multiyear_pia_nominal', 'multiyear_pia_midyear_real']) {
  const c = STATED[name] ? casePIA(name) : CASE[name]; const res = RESULT[name];
  w(`### ${name}`);
  w(`${noteOf(c)}`);
  w(`Config: ${cfgLine(DP(c.cfg))}. Production ${c.prodRows.length > 6 ? `${c.prodRows.length} rows, first ${rowsLine(c.prodRows.slice(0, 2))}` : rowsLine(c.prodRows)}. Capex ${rowsLine(c.capexRows)}. Opex ${c.opexRows.length > 6 ? `${c.opexRows.length} rows, first ${rowsLine(c.opexRows.slice(0, 2))}` : rowsLine(c.opexRows)}.`);
  table(res.cashFlowData, [...PIA_COLS, 'prod_alw_below_cap_bbl', 'prod_alw_after_cap_bbl', 'cit_allowance_claimed', 'cit_allowance_carryforward', 'tet_rate_pct']);
  w(`KPIs: ${kpiLine(res.kpis)}; total revenue ${m(res.kpis.total_revenue)}, royalties ${m(res.kpis.total_royalties)}, HCT ${m(res.kpis.total_hct)}, CIT ${m(res.kpis.total_cit)}, TET ${m(res.kpis.total_tet)}, dev levy ${m(res.kpis.total_dev_levy)}, HCDT ${m(res.kpis.total_hcdt)}, NDDC ${m(res.kpis.total_nddc)}, allowance ${m(res.kpis.total_production_allowance)}, total tax ${m(res.kpis.total_tax)}; CPR forfeited at cessation ${res.kpis.cpr_forfeited_at_cessation === undefined ? 'not reported' : m(res.kpis.cpr_forfeited_at_cessation)}; unit technical cost ${r(res.kpis.unit_technical_cost_usd_per_boe)}; total boe ${v(res.kpis.total_boe)}.${notesLine(res.kpis)}`);
  w();
}
w('### computeProductionAllowance on its own');
w();
w('Converted lease: the lower of 2.50 USD/bbl and 20 percent of the price on every barrel. New lease: the lower of 8.00 USD/bbl and 20 percent up to the cumulative cap (onshore 50, shallow water 100, deep offshore and frontier 500 million bbl), then the lower of 4.00 USD/bbl and 20 percent on every later barrel; a year that crosses the cap is split at the cap. A new lease in deep offshore or frontier has none in an NTA year. eligible_bbl is every barrel the allowance is computed on; below_cap_bbl and after_cap_bbl split it.');
w();
{
  const cfgC = DP(CASE.pia_worked_example.cfg);
  const cfgN = DP(casePIA('allowance_cap_midyear').cfg);
  const cfgD = { ...cfgN, pia_terrain: 'deep_offshore' };
  const cfgO = { ...cfgN, pia_terrain: 'onshore' };
  for (const [label, cfg, bbl, px, prior, fw] of [
    ['converted lease, 1000000 bbl at 80', cfgC, 1000000, 80, 0, 'pia_only'],
    ['converted lease, 1000000 bbl at 10 (the 20 percent limit binds)', cfgC, 1000000, 10, 0, 'pia_only'],
    ['converted lease, 1000000 bbl at 12.5', cfgC, 1000000, 12.5, 0, 'pia_only'],
    ['new shallow lease, 1000000 bbl at 80, prior 0', cfgN, 1000000, 80, 0, 'pia_only'],
    ['new shallow lease, 1000000 bbl at 80, prior 99000000', cfgN, 1000000, 80, 99000000, 'pia_only'],
    ['new shallow lease, 1000000 bbl at 80, prior 99500000', cfgN, 1000000, 80, 99500000, 'pia_only'],
    ['new shallow lease, 1000000 bbl at 80, prior 100000000', cfgN, 1000000, 80, 100000000, 'pia_only'],
    ['new shallow lease, 1000000 bbl at 30, prior 0', cfgN, 1000000, 30, 0, 'pia_only'],
    ['new shallow lease, 1000000 bbl at 15, prior 100000000', cfgN, 1000000, 15, 100000000, 'pia_only'],
    ['new onshore lease, 1000000 bbl at 80, prior 49600000', cfgO, 1000000, 80, 49600000, 'pia_only'],
    ['new deep offshore lease, 1000000 bbl at 80, prior 0, PIA year', cfgD, 1000000, 80, 0, 'pia_only'],
    ['new deep offshore lease, 1000000 bbl at 80, prior 0, NTA year', cfgD, 1000000, 80, 0, 'nta_2025'],
    ['new shallow lease, 1000000 bbl at 80, prior 0, NTA year', cfgN, 1000000, 80, 0, 'nta_2025'],
    ['zero barrels', cfgN, 0, 80, 0, 'pia_only'],
  ]) {
    const o = E.computeProductionAllowance(cfg, bbl, px, prior, fw);
    w(`- ${label}: allowance ${m(o.allowance)}, eligible ${v(o.eligible_bbl)} bbl, below cap ${v(o.below_cap_bbl)} bbl, after cap ${v(o.after_cap_bbl)} bbl, cap applied ${yn(o.cap_applied)}.`);
  }
}
w();
w('### The CPR limit on the worked example, swept');
w();
for (const cpr of [30, 40, 50, 65, 80, 100]) {
  const res = run(withCfg(CASE.pia_worked_example, { pia_cpr_limit_pct: cpr })); const q = res.cashFlowData[0];
  w(`- pia_cpr_limit_pct ${cpr}: cpr cap ${m(q.cpr_cap)}, claimed ${m(q.cpr_costs_claimed)}, deferred ${m(q.cpr_deferred_to_next)}, HCT assessable ${m(q.hct_assessable_profit)}, HCT chargeable ${m(q.hct_chargeable_profit)}, HCT ${m(q.hct_tax)}, CIT chargeable ${m(q.cit_chargeable_profit)}, CIT ${m(q.cit_tax)}, net ${m(q.net_cash_flow)}, NPV ${m(res.kpis.npv)}, CPR forfeited ${res.kpis.cpr_forfeited_at_cessation === undefined ? 'not reported' : m(res.kpis.cpr_forfeited_at_cessation)}.`);
}
w();
w('### Capital allowance: five years, fixed by the texts');
w();
w(`capitalAllowanceFraction by year of life (0 to 5): PIA years ${[0, 1, 2, 3, 4, 5].map((i) => r(E.capitalAllowanceFraction(i, 'pia_only'))).join(', ')}; NTA years ${[0, 1, 2, 3, 4, 5].map((i) => r(E.capitalAllowanceFraction(i, 'nta_2025'))).join(', ')}.`);
for (const yrs of [1, 2, 5, 10]) {
  let out; try { const res = run(withCfg(CASE.pia_worked_example, { pia_capex_recovery_years: yrs })); out = `NPV ${m(res.kpis.npv)}`; } catch (err) { out = `REFUSED: ${err.message}`; }
  w(`- pia_capex_recovery_years ${yrs}: ${out}`);
}
w();

// ---------------------------------------------------------------- Section 16
w('# SECTION 16: TET or the development levy: the framework by year (owned by Expert m04)');
w();
w(`The framework is chosen for EACH year of assessment: with the override on auto, a year before ${E.NTA_FIRST_YEAR} is a PIA year (tertiary education tax on the CIT assessable profit, no development levy) and a year from ${E.NTA_FIRST_YEAR} is an NTA year (the development levy, no TET). A ledger that starts in 2025 and runs into 2026 therefore carries both. force_pia and force_nta apply one framework to every year.`);
w();
w(`statutoryTetRatePct by year: ${[2020, 2021, 2022, 2023, 2024, 2025].map((y) => `${y}: ${E.statutoryTetRatePct(y)}`).join('; ')}.`);
w(`fiscalFrameworkForYear with auto: ${[2024, 2025, 2026, 2027].map((y) => `${y}: ${E.fiscalFrameworkForYear({ pia_under_nta_2025_override: 'auto' }, y)}`).join('; ')}; with force_pia 2030: ${E.fiscalFrameworkForYear({ pia_under_nta_2025_override: 'force_pia' }, 2030)}; with force_nta 2025: ${E.fiscalFrameworkForYear({ pia_under_nta_2025_override: 'force_nta' }, 2025)}.`);
w();
for (const name of ['nta_switch_force_pia', 'nta_switch_force_nta', 'nta_auto_by_base_year', 'min_etr_85', 'min_etr_not_binding']) {
  const c = CASE[name]; const res = RESULT[name];
  w(`### ${name}`);
  w(`${noteOf(c)}`);
  w(`Config: ${cfgLine(DP(c.cfg))}.`);
  table(res.cashFlowData, [...PIA_COLS, 'min_etr_topup', 'tet_rate_pct']);
  w(`KPIs: ${kpiLine(res.kpis)}; framework ${res.kpis.fiscal_framework}${res.kpis.nta_first_year !== undefined ? `, first NTA year ${res.kpis.nta_first_year}` : ''}; TET ${m(res.kpis.total_tet)}, dev levy ${m(res.kpis.total_dev_levy)}, total tax ${m(res.kpis.total_tax)}; min ETR top-up ${res.kpis.total_min_etr_topup === undefined ? 'not reported' : m(res.kpis.total_min_etr_topup)}.${notesLine(res.kpis)}`);
  w();
}
w('### One ledger across 2025 and 2026');
w();
{
  const c = withCfg(CASE.pia_worked_example, {});
  c.prodRows = [...c.prodRows, ...c.prodRows.map((q) => ({ ...q, year: 2026 }))];
  c.opexRows = [...c.opexRows, ...c.opexRows.map((q) => ({ ...q, year: 2026 }))];
  const res = run(c);
  w(`The worked example's one year repeated in 2026 (production and opex rows copied, no new capex): framework ${res.kpis.fiscal_framework}${res.kpis.nta_first_year !== undefined ? `, first NTA year ${res.kpis.nta_first_year}` : ''}.`);
  table(res.cashFlowData, ['year', 'fiscal_framework', 'tet_rate_pct', 'tet_tax', 'dev_levy_tax', 'hct_tax', 'cit_tax', 'cit_allowance_restricted', 'net_cash_flow']);
  w(`TET ${m(res.kpis.total_tet)}, dev levy ${m(res.kpis.total_dev_levy)}, NPV ${m(res.kpis.npv)}.${notesLine(res.kpis)}`);
}
w();
// ---------------------------------------------------------------- Section 17
w('# SECTION 17: Loss relief (owned by Expert m04)');
w();
for (const name of ['jv_loss_carryforward', 'jv_loss_carryforward_killswitch', 'jv_loss_unused_at_cessation', 'pia_loss_relief', 'pia_loss_relief_killswitch', 'schedule_shift_1']) {
  const c = STATED[name] ? casePIA(name) : CASE[name]; const res = RESULT[name];
  w(`### ${name}`);
  w(`${noteOf(c)}`);
  w(`Config: ${cfgLine(DP(c.cfg))}. Production ${rowsLine(c.prodRows)}. Capex ${rowsLine(c.capexRows)}. Opex ${rowsLine(c.opexRows)}.`);
  table(res.cashFlowData, c.cfg.fiscal_regime === 'PIA' ? PIA_COLS : JV_COLS);
  w(`KPIs: ${kpiLine(res.kpis)}; tax losses unused at cessation ${res.kpis.tax_losses_unused_at_cessation === undefined ? 'not reported' : m(res.kpis.tax_losses_unused_at_cessation)}; schedule_shift_years ${res.kpis.schedule_shift_years ?? 'not reported'}.`);
  w();
}
w('### applyJV on one year with a loss pool');
w();
{
  const inp = { gross_revenue: 50000000, capex: 0, opex: 20000000, depreciation: 10000000, cumulative_unrecovered_cost: 0 };
  for (const pool of [0, 5000000, 15000000, 40000000]) {
    const o = E.applyJV(inp, 1, 0.2, 0.5, pool, true);
    const off = E.applyJV(inp, 1, 0.2, 0.5, pool, false);
    w(`- pool brought forward ${m(pool)}: taxable ${m(o.taxable_income)}, offset used ${m(o.loss_offset_used)}, tax ${m(o.tax)}, net ${m(o.net_cash_flow)}, pool after ${m(o.loss_carryforward_after)}; with relief off tax ${m(off.tax)} and pool after ${m(off.loss_carryforward_after)}.`);
  }
  const lossYear = E.applyJV({ gross_revenue: 0, capex: 100000000, opex: 5000000, depreciation: 10000000, cumulative_unrecovered_cost: 0 }, 1, 0.2, 0.5, 0, true);
  w(`- a year with no revenue, opex 5000000 and depreciation 10000000: taxable ${m(lossYear.taxable_income)}, tax ${m(lossYear.tax)}, pool after ${m(lossYear.loss_carryforward_after)}, net ${m(lossYear.net_cash_flow)}.`);
}
w();
w('### AKATA delayed');
w();
for (const shift of [0, 1, 2, 3]) {
  const res = run(withCfg(AKATA, { schedule_shift_years: shift })); const k = res.kpis;
  w(`- schedule_shift_years ${shift}: rows ${res.cashFlowData.map((q) => `${q.year}: oil ${v(q.oil_bbl)}, capex ${m(q.capex)}, opex ${m(q.opex)}, net ${m(q.net_cash_flow)}`).join('; ')}; NPV ${m(k.npv)}, IRR ${p(k.irr)} percent, payback ${k.payback}, loss pool after year one ${m(res.cashFlowData[0].loss_carryforward)}.`);
}
w();

// ---------------------------------------------------------------- Section 18
w('# SECTION 18: The economic limit (owned by Expert m05)');
w();
for (const name of ['elt_off_tail_kept', 'elt_tail_trimmed', 'elt_royalty_tail', 'elt_pia_multiyear']) {
  const c = STATED[name] ? casePIA(name) : CASE[name]; const res = RESULT[name];
  w(`### ${name}`);
  w(`${noteOf(c)}`);
  w(`Config: ${cfgLine(DP(c.cfg))}. Production ${rowsLine(c.prodRows)}. Opex ${rowsLine(c.opexRows)}.`);
  table(res.cashFlowData, c.cfg.fiscal_regime === 'PIA' ? PIA_COLS : JV_COLS);
  w(`KPIs: ${kpiLine(res.kpis)}; economic_limit_year ${res.kpis.economic_limit_year ?? 'not reported'}, years trimmed ${res.kpis.years_trimmed_by_economic_limit ?? 'not reported'}; rows ${res.cashFlowData.length}.`);
  w();
}
w('### AKATA with a long tail');
w();
{
  const TAIL = clone(AKATA);
  for (const [y, o, g] of [[2036, 640000, 512000], [2037, 530000, 424000], [2038, 440000, 352000], [2039, 360000, 288000], [2040, 300000, 240000], [2041, 250000, 200000]]) {
    TAIL.prodRows.push({ year: y, akata_oil_bbl: o, akata_gas_mscf: g });
    TAIL.opexRows.push({ year: y, total_opex_usd: 24000000 });
  }
  w(`Tail rows added to AKATA: ${rowsLine(TAIL.prodRows.slice(7))}, opex 24000000 a year escalated as before.`);
  for (const on of [false, true]) {
    const res = run(withCfg(TAIL, { apply_economic_limit: on })); const k = res.kpis;
    w(`- apply_economic_limit ${on}: rows ${res.cashFlowData.length}, last year ${res.cashFlowData[res.cashFlowData.length - 1].year}, economic_limit_year ${k.economic_limit_year ?? 'not reported'}, years trimmed ${k.years_trimmed_by_economic_limit ?? 'not reported'}; revenue less royalty against opex by year ${res.cashFlowData.map((q) => `${q.year}: ${m(q.gross_revenue - q.royalty)} vs ${m(q.opex)}`).join('; ')}; NPV ${m(k.npv)}, total net cash flow ${m(k.total_net_cash_flow)}, IRR ${p(k.irr)} percent.`);
  }
  for (const px of [40, 50, 60]) {
    const res = run(withCfg(TAIL, { apply_economic_limit: true, oil_price_usd_bbl: px })); const k = res.kpis;
    w(`- limit on at oil price ${px}: economic_limit_year ${k.economic_limit_year ?? 'not reported'}, years trimmed ${k.years_trimmed_by_economic_limit ?? 'not reported'}, rows ${res.cashFlowData.length}, NPV ${m(k.npv)}.`);
  }
}
w();

// ---------------------------------------------------------------- Section 19
w('# SECTION 19: Abandonment: the lump sum and the sinking fund (owned by Expert m05)');
w();
for (const name of ['abandonment_final_year', 'abandonment_appended_year', 'jv_abandonment_wi_60', 'jv_sinking_fund', 'pia_sinking_fund', 'pia_sinking_fund_wi_50']) {
  const c = STATED[name] ? casePIA(name) : CASE[name]; const res = RESULT[name];
  w(`### ${name}`);
  w(`${noteOf(c)}`);
  w(`Config: ${cfgLine(DP(c.cfg))}. Production ${rowsLine(c.prodRows)}. Capex ${rowsLine(c.capexRows)}. Opex ${rowsLine(c.opexRows)}.`);
  table(res.cashFlowData, [...(c.cfg.fiscal_regime === 'PIA' ? PIA_COLS : JV_COLS), 'abandonment_cost', 'decom_fund_contribution', 'abandonment_cost_funded']);
  w(`KPIs: ${kpiLine(res.kpis)}; total_abandonment_cost ${res.kpis.total_abandonment_cost === undefined ? 'not reported' : m(res.kpis.total_abandonment_cost)}, abandonment_year ${res.kpis.abandonment_year ?? 'not reported'}, funding mode ${res.kpis.abandonment_funding_mode ?? 'lump sum (not reported)'}, total fund contributions ${res.kpis.total_decom_fund_contributions === undefined ? 'not reported' : m(res.kpis.total_decom_fund_contributions)}; total tax ${m(res.kpis.total_tax)}; unit technical cost ${r(res.kpis.unit_technical_cost_usd_per_boe)}; working_interest_pct ${res.kpis.working_interest_pct ?? 'not reported'}.`);
  w();
}
w('### AKATA abandoned');
w();
for (const [label, patch] of [['lump sum 60000000 in the final year', { abandonment_cost_usd: 60000000 }], ['lump sum 60000000 in 2037 (beyond the data)', { abandonment_cost_usd: 60000000, abandonment_year: 2037 }], ['sinking fund 60000000 from the first year', { abandonment_cost_usd: 60000000, abandonment_funding_mode: 'sinking_fund' }], ['sinking fund 60000000 from 2032', { abandonment_cost_usd: 60000000, abandonment_funding_mode: 'sinking_fund', abandonment_fund_start_year: 2032 }], ['lump sum 60000000 at WI 50', { abandonment_cost_usd: 60000000, jv_working_interest_pct: 50 }], ['sinking fund 60000000 at WI 50', { abandonment_cost_usd: 60000000, abandonment_funding_mode: 'sinking_fund', jv_working_interest_pct: 50 }]]) {
  const res = run(withCfg(AKATA, patch)); const k = res.kpis;
  w(`- ${label}: rows ${res.cashFlowData.length}; contributions by year ${res.cashFlowData.map((q) => m(q.decom_fund_contribution ?? 0)).join(', ')}; abandonment cost by year ${res.cashFlowData.map((q) => m(q.abandonment_cost ?? 0)).join(', ')}; tax by year ${res.cashFlowData.map((q) => m(q.tax)).join(', ')}; total tax ${m(k.total_tax)}; total contributions ${k.total_decom_fund_contributions === undefined ? 'not reported' : m(k.total_decom_fund_contributions)}; total_abandonment_cost ${k.total_abandonment_cost === undefined ? 'not reported' : m(k.total_abandonment_cost)}; NPV ${m(k.npv)}, IRR ${p(k.irr)} percent, unit technical cost ${r(k.unit_technical_cost_usd_per_boe)}.`);
}
w();

// ---------------------------------------------------------------- Section 20
w('# SECTION 20: AKATA under the PIA (owned by Expert m02, Expert m03, Expert m06)');
w();
const AKPIA = withCfg(AKATA, {
  fiscal_regime: 'PIA', pia_terrain: 'shallow_water', pia_license_type: 'PML', pia_lease_status: 'converted',
  pia_water_depth_m: 60, pia_marginal_field_pre_2021: false, pia_hct_rate_override_pct: null,
  pia_cit_rate_pct: 30, pia_prior_year_opex_usd: 0, pia_cpr_limit_pct: 65,
  pia_under_nta_2025_override: 'auto', pia_prior_cumulative_oil_bbl: 0,
});
{
  const res = run(AKPIA);
  w(`Config additions to AKATA: ${cfgLine({ pia_terrain: 'shallow_water', pia_license_type: 'PML', pia_lease_status: 'converted', pia_water_depth_m: 60, pia_cit_rate_pct: 30, pia_prior_year_opex_usd: 0, pia_cpr_limit_pct: 65, pia_under_nta_2025_override: 'auto' })}. Everything else at the engine's defaults: NDDC 3 percent of the total annual budget, capital allowance over five years, production allowance per the Sixth Schedule. Base year 2029, so every year is an NTA year.`);
  table(res.cashFlowData, [...PIA_COLS, 'royalty_liquids_bopd', 'royalty_rate_liquids', 'price_royalty_rate_oil', 'hct_rate']);
  w(`KPIs: ${kpiLine(res.kpis)}; framework ${res.kpis.fiscal_framework}; royalties ${m(res.kpis.total_royalties)}, HCT ${m(res.kpis.total_hct)}, CIT ${m(res.kpis.total_cit)}, TET ${m(res.kpis.total_tet)}, dev levy ${m(res.kpis.total_dev_levy)}, HCDT ${m(res.kpis.total_hcdt)}, NDDC ${m(res.kpis.total_nddc)}, allowance ${m(res.kpis.total_production_allowance)}, total tax ${m(res.kpis.total_tax)}; against AKATA under JV: NPV ${m(AK.kpis.npv)}, take ${p(AK.kpis.government_take_pct)} percent, total tax ${m(AK.kpis.total_tax)}.${notesLine(res.kpis)}`);
  w();
  for (const [label, patch] of [
    ['force_pia', { pia_under_nta_2025_override: 'force_pia' }],
    ['new lease, prior cumulative 0, no new-PML rate stated', { pia_lease_status: 'new' }],
    ['new lease, prior cumulative 0, stated new-PML rate 30', { pia_lease_status: 'new', pia_new_pml_hct_rate_pct: 30 }],
    ['new lease, prior cumulative 0, stated new-PML rate 15', { pia_lease_status: 'new', pia_new_pml_hct_rate_pct: 15 }],
    ['new lease, prior cumulative 96000000, stated new-PML rate 30', { pia_lease_status: 'new', pia_prior_cumulative_oil_bbl: 96000000, pia_new_pml_hct_rate_pct: 30 }],
    ['onshore', { pia_terrain: 'onshore' }],
    ['deep_offshore, no reading stated', { pia_terrain: 'deep_offshore', pia_water_depth_m: 1200 }],
    ['deep_offshore, conservative_zero', { pia_terrain: 'deep_offshore', pia_water_depth_m: 1200, pia_deep_offshore_hct_interpretation: 'conservative_zero' }],
    ['deep_offshore, aggressive_pml_30', { pia_terrain: 'deep_offshore', pia_water_depth_m: 1200, pia_deep_offshore_hct_interpretation: 'aggressive_pml_30' }],
    ['deep_offshore, custom 12.5', { pia_terrain: 'deep_offshore', pia_water_depth_m: 1200, pia_deep_offshore_hct_interpretation: 'custom', pia_deep_offshore_hct_custom_rate_pct: 12.5 }],
    ['marginal_field terrain', { pia_terrain: 'marginal_field' }],
    ['marginal field converted under s.94(1), shallow water', { pia_marginal_field_pre_2021: true }],
    ['CPR 40', { pia_cpr_limit_pct: 40 }],
    ['prior year opex 20000000', { pia_prior_year_opex_usd: 20000000 }],
    ['NDDC on the opex base', { pia_nddc_levy_base: 'opex' }],
    ['gas 50 percent used in-country', { pia_gas_in_country_share_pct: 50 }],
    ['price royalty on the act_2020 base', { pia_price_royalty_base: 'act_2020' }],
    ['oil price 120', { oil_price_usd_bbl: 120 }],
    ['oil price 45', { oil_price_usd_bbl: 45 }],
    ['WI 50', { pia_working_interest_pct: 50 }],
  ]) {
    let r2; try { r2 = run(withCfg(AKPIA, patch)); } catch (err) { w(`- ${label}: REFUSED: ${err.message}`); continue; }
    const k = r2.kpis; const q = r2.cashFlowData[0];
    w(`- ${label}: 2029 production royalty ${m(q.production_royalty)} (liquids rate ${r(q.royalty_rate_liquids)}), price royalty ${m(q.price_royalty)}, gas royalty ${m(q.gas_royalty)}, HCDT ${m(q.hcdt)}, NDDC ${m(q.nddc)}, CPR claimed ${m(q.cpr_costs_claimed)}, deferred ${m(q.cpr_deferred_to_next)}, allowance ${m(q.production_allowance)} on ${v(q.prod_alw_below_cap_bbl)} bbl below the cap and ${v(q.prod_alw_after_cap_bbl)} after (cap applied ${yn(q.prod_alw_cap_applied)}), HCT rate ${r(q.hct_rate)}, HCT ${m(q.hct_tax)}, CIT ${m(q.cit_tax)}, TET ${m(q.tet_tax)}, dev levy ${m(q.dev_levy_tax)}, net ${m(q.net_cash_flow)}; totals royalties ${m(k.total_royalties)}, HCT ${m(k.total_hct)}, CIT ${m(k.total_cit)}, allowance ${m(k.total_production_allowance)}, tax ${m(k.total_tax)}; NPV ${m(k.npv)}, IRR ${k.irr === null ? 'null' : p(k.irr) + ' percent'}, take ${p(k.government_take_pct)} percent, framework ${k.fiscal_framework}.`);
  }
}
w();
// ---------------------------------------------------------------- Section 21
w('# SECTION 21: Three numbers to distrust (owned by Expert m05, Professional m03, Professional m04)');
w();
w('### 21.1 The profile point at the applied rate (Section 8 has every case)');
w();
for (const d of G.disagreements.filter((x) => x.quantity && /npv_profile/.test(x.quantity))) {
  w(`- ${d.case}: engine ${m(d.engine.npv)} at ${r(d.engine.rate_pct)} percent; oracle ${m(d.oracle.npv)} at ${r(d.oracle.rate_pct)} percent; gap ${m(d.gap)} ${d.gap_unit}.`);
}
w();
w('### 21.2 The IRR of a profile with two roots (Section 9 has the curves)');
w();
for (const d of G.disagreements.filter((x) => /^irr:/.test(x.case))) {
  w(`- ${d.case}: ${JSON.stringify(d).slice(0, 600)}`);
}
w();
w('### 21.3 The sinking fund and working interest (Section 19 has the rows)');
w();
{
  const a = RESULT.pia_sinking_fund_wi_50.kpis; const b = RESULT.pia_sinking_fund.kpis;
  w(`- pia_sinking_fund at WI 100: total contributions ${m(b.total_decom_fund_contributions)}, total_abandonment_cost ${m(b.total_abandonment_cost)}, unit technical cost ${r(b.unit_technical_cost_usd_per_boe)}, total boe ${v(b.total_boe)}.`);
  w(`- pia_sinking_fund_wi_50 at WI 50: total contributions ${m(a.total_decom_fund_contributions)}, total_abandonment_cost ${m(a.total_abandonment_cost)}, unit technical cost ${r(a.unit_technical_cost_usd_per_boe)}, total boe ${v(a.total_boe)}, working_interest_pct ${a.working_interest_pct}.`);
  const c = RESULT.jv_abandonment_wi_60.kpis;
  w(`- jv_abandonment_wi_60 lump sum at WI 60: total_abandonment_cost ${m(c.total_abandonment_cost)}, abandonment cost on the final row ${m(RESULT.jv_abandonment_wi_60.cashFlowData[RESULT.jv_abandonment_wi_60.cashFlowData.length - 1].abandonment_cost)}, unit technical cost ${r(c.unit_technical_cost_usd_per_boe)}.`);
}
w();
// ---------------------------------------------------------------- Section 22
w('# SECTION 22: The texts, the engine\'s own statements, and the engine\'s published PIA cases (owned by Expert m02 to Expert m06)');
w();
w('### The texts the engine follows, with the date they were read');
w();
for (const [k, t] of Object.entries(E.PIA_TEXTS)) w(`- ${k}: ${t}`);
w();
w('### The engine\'s statements (kpis.pia_notes), numbered as the tables above cite them');
w();
for (const n of Object.values(E.PIA_NOTES)) NOTE_INDEX(n);
NOTE_SEEN.forEach((n, i) => w(`- N${i + 1}: ${n}`));
w();
w('### The engine\'s published default-path cases (pia2021_cases.json, Ekene synthetic fields, ours)');
w();
{
  const P = JSON.parse(fs.readFileSync(`${ROOT}/test-data/economics/goldens/pia2021_cases.json`, 'utf8'));
  for (const c of P.cases) {
    const res = run(c); const k = res.kpis;
    w(`- ${c.name}: ${c.note}`);
    w(`  Config: ${cfgLine(c.cfg)}.`);
    w(`  ${kpiLine(k)}; framework ${k.fiscal_framework}${k.nta_first_year !== undefined ? `, first NTA year ${k.nta_first_year}` : ''}; royalties ${m(k.total_royalties)}, HCT ${m(k.total_hct)}, CIT ${m(k.total_cit)}, TET ${m(k.total_tet)}, dev levy ${m(k.total_dev_levy)}, HCDT ${m(k.total_hcdt)}, NDDC ${m(k.total_nddc)}, allowance ${m(k.total_production_allowance)}, total tax ${m(k.total_tax)}; ${res.cashFlowData.length} rows.${notesLine(k)}`);
  }
}
w();
// ---------------------------------------------------------------- Section 23
w('# SECTION 23: Three figures the texts leave to a stated reading (never graded)');
w();
w('Each is an input the engine refuses to default, or a default it names in its statements. A lesson may show every reading side by side; no capstone field and no keyed question depends on which reading is chosen.');
w();
{
  const wx = CASE.pia_worked_example;
  const regs = run(wx).kpis; const act = run(withCfg(wx, { pia_price_royalty_base: 'act_2020' })).kpis;
  w(`1. The royalty-by-price base year. The Regulations Schedule starts the benchmarks at 2021 levels; the Act (Seventh Schedule para 11(1)) at 2020 levels. The engine defaults to the Regulations and names the Act's reading. Worked example: royalties ${m(regs.total_royalties)} on the Regulations base and ${m(act.total_royalties)} on the Act's; NPV ${m(regs.npv)} and ${m(act.npv)}.`);
  const dx = CASE.pia_deep_offshore_nta_aggressive;
  const rd = ['conservative_zero', 'aggressive_pml_30', ['custom', 12.5]].map((x) => {
    const patch = Array.isArray(x) ? { pia_deep_offshore_hct_interpretation: x[0], pia_deep_offshore_hct_custom_rate_pct: x[1] } : { pia_deep_offshore_hct_interpretation: x };
    const k = run(withCfg(dx, patch)).kpis; return `${Array.isArray(x) ? `custom ${x[1]}` : x}: HCT ${m(k.total_hct)}, NPV ${m(k.npv)}`;
  });
  w(`2. Deep offshore hydrocarbon tax in an NTA year. NTA s.65(1) brings deep offshore into the tax and s.72 prints rates only for onshore and shallow water, so the engine refuses to run an NTA deep offshore year until a reading is stated. The same 60,000 bopd field under force_nta: ${rd.join('; ')}.`);
  const nx = CASE.allowance_cap_midyear;
  const nr = [30, 15].map((x) => { const k = run(withCfg(nx, { pia_new_pml_hct_rate_pct: x })).kpis; return `${x}: HCT ${m(k.total_hct)}, NPV ${m(k.npv)}`; });
  w(`3. The hydrocarbon tax rate of a new-acreage PML onshore or in shallow water. PIA s.267 (NTA s.72) gives 30 percent to leases selected on conversion and 15 percent to onshore and shallow water and to petroleum prospecting licences, and does not say which applies to a lease granted after the Act out of new acreage. The engine refuses the run until 15 or 30 is stated. allowance_cap_midyear at each: ${nr.join('; ')}.`);
}
w();
w('End of digest.');
process.stdout.write(out.join('\n') + '\n');
