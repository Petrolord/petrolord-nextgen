// A NODE 18 LOADER HOOK FOR THE ONE TYPESCRIPT FILE THIS COURSE RUNS, AND FOR
// THE NAMED WRONG-METHOD AND OPEN-READING VARIANTS OF prms.js THAT
// discriminate.mjs AND prms_capstone.mjs CALL.
//
// engines/economics/prms.js imports computeCashFlow and applyJV from
// engines/economics/cashflow.ts (no new economic limit, NPV or
// working-interest scaling: each is imported, never re-implemented). Jest and
// Vite compile .ts; plain node 18 does not, so every EC11 wave script that
// runs the engine registers this hook first (through prms_engine.mjs). It
// strips the types with the esbuild the NextGen repository already installs
// and changes no behaviour.
//
// A URL for prms.js carrying ?variant=<name> loads the SAME source with the
// named textual substitutions from VARIANTS below: a plausible wrong method a
// learner might use (the low estimate read at the high side, increments taken
// as cumulative, the economic limit or the licence ignored, the working
// interest or the royalty interest left out, production added in a
// reconciliation), taken from the engine's own negative control list
// (negcontrol_prms.sh) and a few more, or the other side of a reading the
// engine states (the five-year benchmark read exclusive, an undiscounted net
// cash flow of exactly 0 read as economic, the economic limit placed at the
// PRMS cumulative peak, the replacement ratio over additions alone, the life
// index on the low estimate, a reconciliation difference equal to the
// tolerance read as not closing). A variant is one [find, replace] pair or a
// list of them; each find must match EXACTLY ONCE, or the load throws naming
// the variant, so a variant can never silently run the true engine. The true
// engine is loaded with no query and is never patched. No digest line and no
// graded field is computed from a variant.
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

// esbuild comes from the NextGen repository the engine is vendored in, found
// from EC11_ENGINES (<repo>/packages/engines) so the committed
// mirror runs on a CI runner; EC11_REPO overrides it.
const ENG = process.env.EC11_ENGINES || '/root/wt-ec11-nextgen/packages/engines';
const REPO = process.env.EC11_REPO || path.resolve(ENG, '..', '..');
const esbuild = createRequire(`${REPO}/package.json`)('esbuild');

// [find, replace] or [[find, replace], ...]: every find is an exact string that must occur exactly once in prms.js.
export const VARIANTS = {
  // ---- wrong methods (discriminate.mjs), the engine's negative control list first ----
  // P90 read as high: a lognormal project's low and high estimates swapped.
  lognormal_low_high_swapped: [
    'cases = { low: Math.exp(mu - Z90 * s), best: Math.exp(mu), high: Math.exp(mu + Z90 * s) };',
    'cases = { low: Math.exp(mu + Z90 * s), best: Math.exp(mu), high: Math.exp(mu - Z90 * s) };',
  ],
  // P90 read as high: a normal project's low and high estimates swapped.
  normal_low_high_swapped: [
    'cases = { low: d.mean - Z90 * d.stdDev, best: d.mean, high: d.mean + Z90 * d.stdDev };',
    'cases = { low: d.mean + Z90 * d.stdDev, best: d.mean, high: d.mean - Z90 * d.stdDev };',
  ],
  // P90 read as high: a stated triangular's low estimate at the 0.9 point and its high at the 0.1 point.
  triangular_low_high_swapped: [
    'cases = { low: triInvCDF(0.1, d.min, d.mode, d.max), best: triInvCDF(0.5, d.min, d.mode, d.max), high: triInvCDF(0.9, d.min, d.mode, d.max) };',
    'cases = { low: triInvCDF(0.9, d.min, d.mode, d.max), best: triInvCDF(0.5, d.min, d.mode, d.max), high: triInvCDF(0.1, d.min, d.mode, d.max) };',
  ],
  // A stated triangular's estimates read off its min, mode and max.
  triangular_min_mode_max: [
    'cases = { low: triInvCDF(0.1, d.min, d.mode, d.max), best: triInvCDF(0.5, d.min, d.mode, d.max), high: triInvCDF(0.9, d.min, d.mode, d.max) };',
    'cases = { low: d.min, best: d.mode, high: d.max };',
  ],
  // Incremental taken as cumulative (categorize, the incremental method).
  categorize_increments_as_cumulative: [
    'cum = { low: est.first, best: est.first + est.second, high: est.first + est.second + est.third };',
    'cum = { low: est.first, best: est.second, high: est.third };',
  ],
  // Cumulative taken as incremental (categorize, the cumulative method): P2 and P3 read as 2P and 3P.
  categorize_cumulative_as_increments: [
    "second: a.method === 'incremental' ? est.second : cum.best - cum.low, third: a.method === 'incremental' ? est.third : cum.high - cum.best",
    "second: a.method === 'incremental' ? est.second : cum.best, third: a.method === 'incremental' ? est.third : cum.high",
  ],
  // Incremental and cumulative swapped in the economic limit: P2 and P3 reported as 2P and 3P.
  economic_increments_as_cumulative: [
    'incremental: { P1: low, P2: inc(best, low), P3: inc(high, best) },',
    'incremental: { P1: low, P2: best, P3: high },',
  ],
  // The economic limit ignored: the whole technical forecast inside the licence kept.
  economic_limit_ignored: [
    'const kept = rows.filter((r) => r.year <= limitYear);',
    'const kept = rows;',
  ],
  // The canonical economic limit switched off in the cash flow (the trailing years stay in the cash).
  economic_limit_off_in_cash: [
    '    apply_economic_limit: limit,',
    '    apply_economic_limit: false,',
  ],
  // 1P kept when the low case fails the economic test.
  low_kept_when_failing: [
    'const low = cases.low.economic ? perCase.low.reported : zero;',
    'const low = perCase.low.reported;',
  ],
  // The licence expiry ignored.
  licence_ignored: [
    'const licenceCut = lic.renewalExpected ? null : lic.expiryYear;',
    'const licenceCut = null;',
  ],
  // A production tax deducted from volumes as if it were a royalty interest.
  production_tax_as_royalty_interest: [
    "const volRoy = a.royalty.form === 'royalty-interest' ? roy : 0;",
    'const volRoy = roy;',
  ],
  // A royalty interest left in the net entitlement (no volume deducted).
  royalty_interest_not_deducted: [
    "const volRoy = a.royalty.form === 'royalty-interest' ? roy : 0;",
    'const volRoy = 0;',
  ],
  // The working interest not applied to the reported quantities.
  working_interest_not_applied: [
    'return qty(scale(q.oil, wi, r), scale(q.gas, wi, r));',
    'return qty(scale(q.oil, 100, r), scale(q.gas, 100, r));',
  ],
  // The working interest not applied to the cash flow shares.
  working_interest_not_applied_to_cash: [
    ['undiscountedNetCashFlowShare: scale(r.undiscountedNetCashFlow, wi, 0),', 'undiscountedNetCashFlowShare: r.undiscountedNetCashFlow,'],
    ['npvShare: scale(r.npv, wi, 0),', 'npvShare: r.npv,'],
  ],
  // The gas left out of barrels of oil equivalent.
  boe_without_gas: [
    'const boe = (q) => q.oil + q.gas / a.mscfPerBoe;',
    'const boe = (q) => q.oil;',
  ],
  // The gas converted at the stated factor the wrong way (Mscf times the factor).
  boe_factor_inverted: [
    'const boe = (q) => q.oil + q.gas / a.mscfPerBoe;',
    'const boe = (q) => q.oil + q.gas * a.mscfPerBoe;',
  ],
  // The chance of commerciality of a prospect read as the chance of geologic discovery alone.
  pc_read_as_pg: [
    'const pc = (a.chances.geologicDiscoveryPct * a.chances.developmentPct) / 100;',
    'const pc = a.chances.geologicDiscoveryPct;',
  ],
  // The chance of commerciality of a prospect read as the chance of development alone.
  pc_read_as_pd: [
    'const pc = (a.chances.geologicDiscoveryPct * a.chances.developmentPct) / 100;',
    'const pc = a.chances.developmentPct;',
  ],
  // The risked mean without the chance of commerciality.
  risked_mean_without_chance: [
    '(p.chance * p.meanExact) / 100, 0)',
    'p.meanExact, 0)',
  ],
  // The risked mean on each project's best estimate in place of its mean.
  risked_mean_on_best: [
    '(p.chance * p.meanExact) / 100, 0)',
    '(p.chance * p.cases.best) / 100, 0)',
  ],
  // Production added in a reconciliation.
  production_added: [
    'moves.push({ type: m.type, low: -m.quantity, best: -m.quantity, high: -m.quantity });',
    'moves.push({ type: m.type, low: m.quantity, best: m.quantity, high: m.quantity });',
  ],
  // Divestments added in a reconciliation.
  divestments_added: [
    'const s = spec.sign === -1 ? -1 : 1;',
    'const s = 1;',
  ],
  // Production taken out of the best estimate alone.
  production_from_best_only: [
    'moves.push({ type: m.type, low: -m.quantity, best: -m.quantity, high: -m.quantity });',
    'moves.push({ type: m.type, low: 0, best: -m.quantity, high: 0 });',
  ],
  // ---- the other side of each reading the engine states (never moves a graded field) ----
  // The five-year benchmark read exclusive: exactly five years is not met.
  reading_time_frame_exclusive: [
    'const tfMet = tf.startWithinYears <= T || tf.longerJustified;',
    'const tfMet = tf.startWithinYears < T || tf.longerJustified;',
  ],
  // An undiscounted net cash flow of exactly 0 read as economic.
  reading_economic_at_zero: [
    'const economic = undiscounted > 0;',
    'const economic = undiscounted >= 0;',
  ],
  // The economic limit placed at the PRMS 3.1.3.1 cumulative peak (where there is one) in place of the canonical trailing trim.
  reading_limit_at_prms_peak: [
    'const kept = rows.filter((r) => r.year <= limitYear);',
    'const kept = rows.filter((r) => r.year <= (peakYear === null ? limitYear : peakYear));',
  ],
  // The replacement ratio over the additions alone (revisions and transfers left out).
  reading_replacement_additions_only: [
    "const additions = moves.filter((m) => m.type !== 'production').reduce((s, m) => s + m.best, 0);",
    "const additions = moves.filter((m) => !['production', 'revisions', 'transfers'].includes(m.type)).reduce((s, m) => s + m.best, 0);",
  ],
  // The life index on the low estimate (1P) in place of the best (2P).
  reading_life_index_on_low: [
    'const lifeIndexYears = production > 0 ? a.closing.best / (production / a.periodYears) : null;',
    'const lifeIndexYears = production > 0 ? a.closing.low / (production / a.periodYears) : null;',
  ],
  // A reconciliation difference equal to the tolerance read as not closing.
  reading_tolerance_exclusive: [
    'const closes = CASE_KEYS.every((k) => Math.abs(difference[k]) <= a.tolerance);',
    'const closes = CASE_KEYS.every((k) => Math.abs(difference[k]) < a.tolerance);',
  ],
  // The Monte Carlo low estimate read at the 0.9 quantile of the totals (P90 read as high).
  reading_mc_low_at_high_quantile: [
    'const stat = { low: quantile(totals, 0.1), best: quantile(totals, 0.5), high: quantile(totals, 0.9),',
    'const stat = { low: quantile(totals, 0.9), best: quantile(totals, 0.5), high: quantile(totals, 0.1),',
  ],
};

const pairs = (v) => (Array.isArray(v[0]) ? v : [v]);

export async function load(url, context, nextLoad) {
  const u = new URL(url);
  if (u.protocol !== 'file:') return nextLoad(url, context);
  const variant = u.searchParams.get('variant');
  if (variant && u.pathname.endsWith('/prms.js')) {
    let src = fs.readFileSync(fileURLToPath(`file://${u.pathname}`), 'utf8');
    const v = VARIANTS[variant];
    if (!v) throw new Error(`ts_loader: no variant named ${variant}`);
    for (const [find, repl] of pairs(v)) {
      const n = src.split(find).length - 1;
      if (n !== 1) throw new Error(`ts_loader: variant ${variant} matched ${n} times; it must match exactly once: ${find.slice(0, 60)}`);
      src = src.replace(find, () => repl);
    }
    return { format: 'module', source: src, shortCircuit: true };
  }
  if (u.pathname.endsWith('.ts')) {
    const src = fs.readFileSync(fileURLToPath(`file://${u.pathname}`), 'utf8');
    const out = esbuild.transformSync(src, { loader: 'ts', format: 'esm', target: 'node18' });
    return { format: 'module', source: out.code, shortCircuit: true };
  }
  return nextLoad(url, context);
}
