// A NODE 18 LOADER HOOK FOR THE ONE TYPESCRIPT FILE THIS COURSE RUNS, AND FOR
// THE NAMED WRONG-METHOD AND OPEN-READING VARIANTS OF jointVenture.js THAT
// discriminate.mjs AND joa_capstone.mjs CALL.
//
// engines/economics/jointVenture.js imports applyPSC and npv from
// engines/economics/cashflow.ts (FINDINGS-jointVenture.md: no new NPV and no
// new cost pool; both are imported, never re-implemented). Jest and Vite
// compile .ts; plain node 18 does not, so every EC9 wave script that runs the
// engine registers this hook first (through joa_engine.mjs). It strips the
// types with the esbuild the NextGen repository already installs and changes
// no behaviour.
//
// A URL for jointVenture.js carrying ?variant=<name> loads the SAME source with
// the named textual substitutions from VARIANTS below: a plausible wrong method
// a learner might use (cash calls on the beneficial interest, a carry recovered
// without its uplift), or the other side of a reading the engine states (the
// PSC income tax on the contractor's revenue less all the year's costs). A
// variant is one [find, replace] pair or a list of them; each find must match
// EXACTLY ONCE, or the load throws naming the variant, so a variant can never
// silently run the true engine. The true engine is loaded with no query and is
// never patched. No digest line and no graded field is computed from a variant.
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

// esbuild comes from the NextGen repository the engine is vendored in, found
// from EC9_ENGINES (<repo>/packages/engines) so the committed mirror runs on a
// CI runner; EC9_REPO overrides it.
const ENG = process.env.EC9_ENGINES || '/root/wt-ec9-nextgen/packages/engines';
const REPO = process.env.EC9_REPO || path.resolve(ENG, '..', '..');
const esbuild = createRequire(`${REPO}/package.json`)('esbuild');

// [find, replace] or [[find, replace], ...]: every find is an exact string that must occur exactly once in jointVenture.js.
export const VARIANTS = {
  // ---- wrong methods (discriminate.mjs) ----
  // Paying and beneficial interest swapped: every cost share taken on the participating interest, the carry ignored.
  paying_is_beneficial: [
    'rows.forEach((r) => { r.payingPct += extra[r.id]; });',
    'rows.forEach((r) => { r.payingPct = r.beneficialPct; });',
  ],
  // The entitlement of a carry split by the paying interest.
  entitlement_on_paying: [
    "const entSplit = splitBy(y.entitlement, irows, 'beneficialPct');",
    "const entSplit = splitBy(y.entitlement, irows, 'payingPct');",
  ],
  // A carry spread pro rata over every party, the carried party included.
  carry_pro_rata_over_every_party: [
    'const payers = parties.filter((p) => !carriedIds.has(p.id));',
    'const payers = parties;',
  ],
  // The difference of a month never adjusts a later call (the under- or over-call not carried).
  adjustment_not_carried: [
    'const due = t - lag >= 0 ? diffs[t - lag] : null;',
    'const due = null;',
  ],
  // The actual of a month without a call never billed in arrears.
  arrears_not_billed: [
    'const arrearsBilling = arrears ? arrears[id] : 0;',
    'const arrearsBilling = 0;',
  ],
  // The budget tolerance taken as the HIGHER of the percentage and the amount.
  budget_tolerance_higher: [
    'const allowed = budgetTolerance.amount === undefined ? byPct : Math.min(byPct, budgetTolerance.amount);',
    'const allowed = budgetTolerance.amount === undefined ? byPct : Math.max(byPct, budgetTolerance.amount);',
  ],
  // Overhead on the cost before the stated exclusions.
  overhead_exclusions_ignored: [
    'const ex = excluded[k] ?? 0;',
    'const ex = 0;',
  ],
  // Overhead at each band's rate on the whole base (the scale read as cumulative rates).
  overhead_whole_base_at_each_band_rate: [
    'const amount = Math.max(0, Math.min(base, b.upTo) - lo);',
    'const amount = base > lo ? base : 0;',
  ],
  // The compound uplift charged on the year's new carried cost as well as on the opening balance.
  uplift_on_new_cost: [
    "const upliftAmt = uplift.type === 'compound' ? (opening * uplift.ratePctPerYear) / 100",
    "const upliftAmt = uplift.type === 'compound' ? ((opening + added[i]) * uplift.ratePctPerYear) / 100",
  ],
  // The recovery taken from the whole share, the stated recovery percentage ignored.
  recovery_share_ignored: [
    'const available = (share * recoverFromPct) / 100;',
    'const available = share;',
  ],
  // The carried cost taken on the carried party's paying interest.
  carried_cost_on_paying: [
    'const added = years.map((y) => (y.cost * cRow.beneficialPct * c.carriedPct) / 10000);',
    'const added = years.map((y) => (y.cost * cRow.payingPct * c.carriedPct) / 10000);',
  ],
  // The s.85(4) refund with exploration costs included.
  pia_refund_includes_exploration: [
    "refundableKinds: Object.freeze(['development', 'production']), // s.85(4)(c)",
    "refundableKinds: Object.freeze(['development', 'production', 'exploration']), // s.85(4)(c)",
  ],
  // The back-in refund on the target interest in place of the interest acquired.
  refund_on_target_interest: [
    'const refund = (step * refundable) / 100;',
    'const refund = (targetPct * refundable) / 100;',
  ],
  // The default covered in equal shares.
  cover_in_equal_shares: [
    'coverRows.forEach((c) => { c.cover = (unpaidTotal * c.payingPct) / coverPayTotal;',
    'coverRows.forEach((c) => { c.cover = unpaidTotal / coverRows.length;',
  ],
  // The defaulter left in the base of the pro rata cover.
  defaulter_left_in_cover_base: [
    'const coverPayTotal = sum(coverers.map((r) => r.payingPct));',
    'const coverPayTotal = sum(rows.map((r) => r.payingPct));',
  ],
  // Monthly compounding at the annual rate in place of rate / 12.
  monthly_rate_as_annual: [
    '(1 + interest.annualRatePct / 1200) ** wholeMonths',
    '(1 + interest.annualRatePct / 100) ** wholeMonths',
  ],
  // The days after the whole months dropped.
  remaining_days_dropped: [
    ' * (1 + (interest.annualRatePct * remainingDays) / (100 * interest.dayBasis));',
    ' * 1;',
  ],
  // The value date counted as a day of interest.
  value_date_counted: [
    ['const days = dayNo(end) - dayNo(dueDate);', 'const days = dayNo(end) - dayNo(dueDate) + 1;'],
    ['remainingDays = dayNo(end) - dayNo(addMonths(dueDate, wholeMonths));', 'remainingDays = dayNo(end) - dayNo(addMonths(dueDate, wholeMonths)) + 1;'],
  ],
  // The forfeited interest apportioned over every party (the defaulter's share left in the base).
  forfeiture_over_every_party: [
    'const keepTotal = sum(keep.map((p) => p.participatingPct));',
    'const keepTotal = 100;',
  ],
  // The premium multiple applied to the whole cost of the operation.
  premium_on_whole_cost: [
    'premium: (operation.cost * p.participatingPct * premiumMultiplePct) / 10000',
    'premium: (operation.cost * premiumMultiplePct) / 100',
  ],
  // The premium multiple applied to the consenting parties' share of the cost.
  premium_on_consenting_cost: [
    'premium: (operation.cost * p.participatingPct * premiumMultiplePct) / 10000',
    'premium: (operation.cost * (100 - p.participatingPct) * premiumMultiplePct) / 10000',
  ],
  // Reversion one period late: the whole of the payout year's share kept by the recovering parties.
  reversion_one_period_late: [
    'return { year: y.year, opening, uplift: upliftAmt, added: added[i], due, share, available, recovered, closing, writtenOff, debtorReceives: share - recovered, reasons };',
    'return { year: y.year, opening, uplift: upliftAmt, added: added[i], due, share, available, recovered, closing, writtenOff, debtorReceives: due > 0 ? 0 : share - recovered, reasons };',
  ],
  // The premium recovered from gross value, the deductions not taken off.
  deductions_not_taken_off: [
    'entitlement: Math.max(0, y.grossValue - y.deductions)',
    'entitlement: y.grossValue',
  ],
  // The buy-in apportioned on each consenting party's participating interest over 100.
  buy_in_apportioned_over_100: [
    'amount: (r.premium * s.participatingPct) / consTotal',
    'amount: (r.premium * s.participatingPct) / 100',
  ],
  // The carry NPV discounted one year early.
  npv_one_year_early: [
    'const npvs = discountRate === undefined ? null : pid.map((id) => ({ id, npv: npv(flows[id], discountRate, baseYear, years[0].year) }));',
    'const npvs = discountRate === undefined ? null : pid.map((id) => ({ id, npv: npv(flows[id], discountRate, baseYear + 1, years[0].year) }));',
  ],
  // A cost oil limit stated on gross revenue applied to revenue after royalty.
  psc_gross_limit_on_after_royalty: [
    "const capFraction = costOilLimitBase === 'gross' ? costOilLimitPct / (100 - royaltyPct) : costOilLimitPct / 100;",
    'const capFraction = costOilLimitPct / 100;',
  ],
  // A year's own contractor share ignored (the sliding scale computed outside left out).
  psc_year_share_ignored: [
    'const share = y.contractorProfitSharePct ?? contractorProfitSharePct;',
    'const share = contractorProfitSharePct;',
  ],
  // ---- the other side of each reading the engine states (joa_capstone.mjs proves no field moves) ----
  // PSC income tax on the contractor's revenue (cost oil + its profit oil) less ALL the year's costs, the
  // regime the World Bank note describes as having "no limits on deductible expenses", in place of the
  // contractor's profit oil (the FARI and World Bank assumption the engine states).
  reading_psc_tax_all_costs: [
    'const revenueAfterRoyalty = y.grossRevenue - o.royalty;',
    'const revenueAfterRoyalty = y.grossRevenue - o.royalty; { const cr0 = poolIn + y.capex + y.opex - o.cumulative_unrecovered_cost_after; const t0 = (Math.max(0, o.taxable_income + cr0 - (y.capex + y.opex)) * taxRatePct) / 100; o.net_cash_flow += o.tax - t0; o.tax = t0; }',
  ],
  // Interest from the END of a stated grace (the grace also delays the start of interest), in place of
  // the Kenya clause as printed (a payment not received within the grace accrues interest from the due date).
  reading_grace_delays_interest: [
    ['const days = dayNo(end) - dayNo(dueDate);', 'const days = dayNo(end) - dayNo(dueDate); const graceDays = interest.graceHours / 24; const start = dayName(dayNo(dueDate) + Math.round(graceDays));'],
    ['amount = withinGrace ? 0 : (unpaid * interest.annualRatePct * days) / (100 * interest.dayBasis);', 'amount = withinGrace ? 0 : (unpaid * interest.annualRatePct * (days - graceDays)) / (100 * interest.dayBasis);'],
    ['while (addMonths(dueDate, wholeMonths + 1) <= end) wholeMonths += 1;', 'while (addMonths(start, wholeMonths + 1) <= end) wholeMonths += 1;'],
    ['remainingDays = dayNo(end) - dayNo(addMonths(dueDate, wholeMonths));', 'remainingDays = dayNo(end) - dayNo(addMonths(start, wholeMonths));'],
  ],
  // Default cover in proportion to the PARTICIPATING interests of the non-defaulting parties (the
  // Norwegian text's words), a carried party included, in place of their paying interests.
  reading_cover_by_participating: [
    'const coverers = rows.filter((r) => !seen.has(r.id) && r.payingPct > 0);',
    'const coverers = rows.filter((r) => !seen.has(r.id)).map((r) => ({ ...r, payingPct: r.beneficialPct }));',
  ],
};

const pairs = (v) => (Array.isArray(v[0]) ? v : [v]);

export async function load(url, context, nextLoad) {
  const u = new URL(url);
  if (u.protocol !== 'file:') return nextLoad(url, context);
  const variant = u.searchParams.get('variant');
  if (variant && u.pathname.endsWith('/jointVenture.js')) {
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
