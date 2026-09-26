// THE EXPERT CAPSTONE MUST HAVE EXACTLY ONE RIGHT ANSWER (EC7 recut, 2026-09-26).
// Each plausible wrong method (a pre-audit engine reading, the other readings the
// texts leave open, a base or a scale forgotten) is run through the engine, and
// every field must land more than ten tolerances from the right value, unless the
// method is one the field is DESIGNED not to depend on (the stated new-PML rate),
// where it must land exactly on it.
//   node discriminate_expert.mjs     exit 1 on any weak field
import { E, PROD, CAPEX, OPEX, PIA, fields } from './ec1_fields.mjs';
const run = (cfg) => E.computeCashFlow({ cfg, prodRows: PROD, capexRows: CAPEX, opexRows: OPEX });
const row = (res, y) => res.cashFlowData.find((q) => q.year === y);
const read = (res) => ({
  pia_2032_price_royalty_usd: row(res, 2032).price_royalty, pia_2032_production_allowance_usd: row(res, 2032).production_allowance,
  pia_2031_nddc_usd: row(res, 2031).nddc, pia_total_cit_usd: res.kpis.total_cit, pia_2033_dev_levy_usd: row(res, 2033).dev_levy_tax,
  pia_2035_cpr_deferred_usd: row(res, 2035).cpr_deferred_to_next,
});
const RIGHT = Object.fromEntries(fields.filter(([t]) => t === 'advanced').map(([, k, x, tol]) => [k, [x, tol]]));
// L1/L2/L3: no field may depend on the stated new-PML rate; the L3 field must
// also not depend on the royalty-by-price base year.
const SAME = [['stated new-PML rate 15 (the field must not depend on it)', { pia_new_pml_hct_rate_pct: 15 }]];
const L3 = 'pia_2035_cpr_deferred_usd';
const L3_SAME = [['royalty by price on the act_2020 base', { pia_price_royalty_base: 'act_2020' }]];
const WRONG = [
  ['pre-audit engine (pia_legacy_pre_audit)', { pia_legacy_pre_audit: true, pia_new_pml_hct_rate_pct: undefined }],
  ['royalty by price on the act_2020 base', { pia_price_royalty_base: 'act_2020' }],
  ['NDDC on the opex base', { pia_nddc_levy_base: 'opex' }],
  ['converted lease instead of new', { pia_lease_status: 'converted' }],
  ['working interest ignored (100)', { pia_working_interest_pct: 100 }],
  ['onshore terrain', { pia_terrain: 'onshore' }],
  ['no prior cumulative production (cap never reached)', { pia_prior_cumulative_oil_bbl: 0 }],
  ['whole-revenue HCT base (gas in)', { pia_hct_include_gas_revenue: true }],
  ['every year under the PIA (force_pia)', { pia_under_nta_2025_override: 'force_pia' }],
  ['gas utilised in-country at 50 percent', { pia_gas_in_country_share_pct: 50 }],
];
let weak = 0; let checked = 0;
for (const [label, patch, same] of [...SAME.map((x) => [...x, true]), ...WRONG.map((x) => [...x, false])]) {
  const cfg = { ...PIA, ...patch }; for (const k of Object.keys(cfg)) if (cfg[k] === undefined) delete cfg[k];
  let got; try { got = read(run(cfg)); } catch (err) { console.log(`  ${label}: refused (${String(err.message).slice(0, 80)}...)`); continue; }
  for (const [k, [x, tol]] of Object.entries(RIGHT)) {
    const d = Math.abs(got[k] - x); checked += 1;
    if (same && d !== 0) { weak += 1; console.log(`DEPENDS ${k} on ${label}: ${got[k]} vs ${x}`); }
  }
}
// A field no wrong method moves is not discriminating at all.
for (const k of Object.keys(RIGHT)) {
  const moved = WRONG.some(([, patch]) => { const cfg = { ...PIA, ...patch }; for (const q of Object.keys(cfg)) if (cfg[q] === undefined) delete cfg[q]; try { return Math.abs(read(run(cfg))[k] - RIGHT[k][0]) > 10 * RIGHT[k][1]; } catch { return false; } });
  const by = WRONG.filter(([, patch]) => { const cfg = { ...PIA, ...patch }; for (const q of Object.keys(cfg)) if (cfg[q] === undefined) delete cfg[q]; try { return Math.abs(read(run(cfg))[k] - RIGHT[k][0]) > 10 * RIGHT[k][1]; } catch { return false; } }).map(([l]) => l);
  console.log(`${k} = ${RIGHT[k][0]}: moved beyond ten tolerances by ${by.length ? by.join('; ') : 'NOTHING'}`);
  if (!moved) { weak += 1; console.log(`WEAK ${k}: no wrong method moves it beyond ten tolerances`); }
}
// L3: the swapped field is moved by at least two wrong methods and by neither
// the stated rate nor the benchmark base year.
{
  const clean = (patch) => { const cfg = { ...PIA, ...patch }; for (const q of Object.keys(cfg)) if (cfg[q] === undefined) delete cfg[q]; return cfg; };
  for (const [label, patch] of L3_SAME) {
    const got = read(run(clean(patch)))[L3]; checked += 1;
    if (got !== RIGHT[L3][0]) { weak += 1; console.log(`DEPENDS ${L3} on ${label}: ${got} vs ${RIGHT[L3][0]}`); }
  }
  const by = WRONG.filter(([l, patch]) => !L3_SAME.some(([m]) => m === l)).filter(([, patch]) => { try { return Math.abs(read(run(clean(patch)))[L3] - RIGHT[L3][0]) > 10 * RIGHT[L3][1]; } catch { return false; } }).map(([l]) => l);
  console.log(`L3 ${L3}: moved by ${by.length} wrong method(s) other than the base year (${by.join('; ')}); unmoved by the stated rate and the base year`);
  if (by.length < 2) { weak += 1; console.log(`WEAK ${L3}: L3 needs at least two wrong methods`); }
}
console.log(`${checked} field readings checked; ${weak === 0 ? 'every Expert field is independent of the stated reading and moved by at least one wrong method' : `${weak} problem(s)`}`);
process.exit(weak === 0 ? 0 : 1);
