// The engine, loaded the way the digest generator loads it (the esbuild bundle
// of the vendored cashflow.ts that build_digest.sh writes to ../scratch), plus
// the inputs the cashflow course teaches on. Key-truth checks import this and
// CALL the engine; nothing here restates a formula.
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const ROOT = process.env.EC1_ENGINES || path.resolve(KIT, '../../../packages/engines');
const BUNDLE = path.join(KIT, 'scratch', 'cashflow.mjs');
{
  // Always rebuild, so a check never runs on a stale bundle of an older engine.
  fs.mkdirSync(path.dirname(BUNDLE), { recursive: true });
  const esb = path.resolve(ROOT, '../../node_modules/.bin/esbuild');
  const r = spawnSync(esb, [path.join(ROOT, 'engines/economics/cashflow.ts'), '--bundle', '--format=esm', '--platform=node',
    `--outfile=${BUNDLE}`, '--log-level=warning'], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`esbuild failed: ${r.stderr}`);
}
export const E = await import(BUNDLE);
const G = JSON.parse(fs.readFileSync(`${ROOT}/test-data/economics/goldens/cashflow_cases.json`, 'utf8'));
export const GOLDEN = G;
export const CASE = Object.fromEntries(G.cases.map((c) => [c.name, c]));
const clone = (o) => JSON.parse(JSON.stringify(o));
export const withCfg = (c, patch) => ({ ...clone(c), cfg: { ...clone(c.cfg), ...patch } });
// The digest's default path: a published PIA config loses the legacy flag and
// the stale TET rate; everything else it states is kept (ec1_dump.mjs DP).
export const DP = (cfg) => { if (!cfg || cfg.fiscal_regime !== 'PIA') return cfg; const c = { ...cfg }; delete c.pia_legacy_pre_audit; delete c.pia_tet_rate_pct; return c; };
export const run = (c) => E.computeCashFlow({ cfg: DP(c.cfg), prodRows: c.prodRows, capexRows: c.capexRows, opexRows: c.opexRows });
export const runRaw = (c) => E.computeCashFlow({ cfg: c.cfg, prodRows: c.prodRows, capexRows: c.capexRows, opexRows: c.opexRows });
export const refusal = (c) => { try { run(c); return null; } catch (err) { return String(err.message); } };
// The digest's stated inputs for the three published cases the default path refuses.
export const STATED = {
  allowance_cap_midyear: { pia_new_pml_hct_rate_pct: 30 },
  pia_onshore_new_lease: { pia_new_pml_hct_rate_pct: 30 },
  pia_marginal_field_blend: { pia_terrain: 'onshore' },
};
export const casePIA = (name) => (STATED[name] ? withCfg(CASE[name], STATED[name]) : CASE[name]);
export const golden = (name) => run(casePIA(name));
export const row = (res, y) => res.cashFlowData.find((q) => q.year === y);

// The teaching field AKATA (ec1_dump.mjs, verbatim).
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
// AKATA under the PIA as the digest's Section 20 runs it.
export const AKPIA = withCfg(AKATA, {
  fiscal_regime: 'PIA', pia_terrain: 'shallow_water', pia_license_type: 'PML', pia_lease_status: 'converted',
  pia_water_depth_m: 60, pia_marginal_field_pre_2021: false, pia_hct_rate_override_pct: null,
  pia_cit_rate_pct: 30, pia_prior_year_opex_usd: 0, pia_cpr_limit_pct: 65,
  pia_under_nta_2025_override: 'auto', pia_prior_cumulative_oil_bbl: 0,
});
