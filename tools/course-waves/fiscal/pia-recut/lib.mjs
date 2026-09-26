// The engine, loaded the way the digest generator loads it, plus the inputs
// the fiscal course teaches on. Key-truth checks import this and CALL the
// engine; nothing here restates a formula.
import fs from 'fs';
import { register } from 'node:module';
register('../ts_loader.mjs', import.meta.url);

export const ROOT = process.env.EC2_ENGINES || '/root/wt-ec7-recut/packages/engines';
export const E = await import(`${ROOT}/engines/economics/fiscalRegime.js`);
const { fiscalTemplates } = await import(`${ROOT}/engines/economics/fiscalTemplates.js`);
const G = JSON.parse(fs.readFileSync(`${ROOT}/test-data/economics/goldens/fiscal_cases.json`, 'utf8'));
const clone = (o) => JSON.parse(JSON.stringify(o));
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/^_+|_+$/g, '');

export const CASE = Object.fromEntries(G.cashflow.map((c) => [c.id, c]));
export const CMP = Object.fromEntries(G.comparisons.map((c) => [c.id, c]));
export const DEFAULT_PROJECT = clone(CASE.template_nigeria___pia__2021_default_project.project);
export const TEST_PROJECT = clone(CASE.template_nigeria___pia__2021_test_project.project);
export const REGIME = Object.fromEntries(
  fiscalTemplates.map((t) => [slug(t.name), { id: slug(t.name), name: t.name, ...clone(t.regime) }]));
export const PIA = REGIME.nigeria___pia__2021;
export const GHANA = REGIME.ghana___deepwater;
export const BRAZIL = REGIME.brazil___concession;
export const GOM = REGIME.usa___gulf_of_mexico;
export const ANGOLA = REGIME.angola___deepwater_psc;
export const GENERIC = REGIME.generic_royalty_tax;
export const SIX = [PIA, GHANA, BRAZIL, GOM, ANGOLA, GENERIC];
// The course's tiered teaching regime (ec2_dump.mjs TIERED, identical values).
export const TIERED = {
  id: 'tiered_teaching', name: 'Tiered teaching regime',
  royalty: { type: 'sliding_price', tiers: [{ threshold: 0, rate: 7.5 }, { threshold: 50, rate: 10 }] },
  tax: { cit: 30, rrt: 0, minTax: 0 },
  costRecoveryLimit: 80,
  profitSplit: { type: 'tiered_r_factor', tiers: [{ threshold: 1.0, split: 60 }, { threshold: 1.6, split: 40 }, { threshold: 2.5, split: 30 }] },
};
// The Designer's two default regimes, as the golden publishes them.
export const DESIGNER = clone(CMP.cmp_designer_defaults.regimes);
export const ODIDI = {
  production: { oil: { initial: 8000, decline: 14 }, gas: { initial: 40, decline: 9 }, ngl: { initial: 900, decline: 15 } },
  prices: [{ year: 1, oil: 45, gas: 3.0, ngl: 25 }, { year: 6, oil: 65, gas: 3.8, ngl: 32 }, { year: 12, oil: 85, gas: 4.2, ngl: 38 }],
  costs: { capex: { drilling: 260, facilities: 120, subsea: 40 }, opex: { fixed: 12, variable: 4 } },
  discountRate: 12,
};
export const cf = (regime, project, cx = 1, px = 1) => E.calculateCashFlowForRegime(regime, project, cx, px);
const sum = (rows, k) => rows.reduce((s, r) => s + r[k], 0);
export const totals = (regime, project, cx = 1, px = 1) => {
  const rows = cf(regime, project, cx, px);
  const payback = rows.find((r) => r.cumulativeNCF > 0);
  const payout = rows.find((r) => r.rFactor > 1.0);
  const irr = E.calculateIRRResult(rows);
  return {
    rows,
    contractorNCF: sum(rows, 'contractorNCF'), governmentTake: sum(rows, 'governmentTake'),
    revenue: sum(rows, 'grossRevenue'), royalty: sum(rows, 'royalty'), tax: sum(rows, 'tax'),
    costRecovered: sum(rows, 'costRecovered'), profitOil: sum(rows, 'profitOil'),
    closingPool: rows[rows.length - 1].unrecoveredCostPool,
    payback: payback ? payback.year : null, payout: payout ? payout.year : null,
    npv: E.calculateNPV(rows, project.discountRate), irr: irr.irr, irrStatus: irr.irrStatus, irrRoots: irr.irrRoots,
  };
};
export const compare = (project, regimes) => E.runFiscalComparison({ projectInputs: project, regimes });
