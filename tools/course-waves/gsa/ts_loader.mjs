// A NODE 18 LOADER HOOK FOR THE ONE TYPESCRIPT FILE THIS COURSE RUNS, AND FOR
// THE NAMED WRONG-METHOD AND OPEN-READING VARIANTS OF gasContract.js THAT
// discriminate.mjs AND gsa_capstone.mjs CALL.
//
// engines/economics/gasContract.js imports npv, deriveGasRoyaltyRate and
// calendarDays from engines/economics/cashflow.ts (FINDINGS-gasContract.md:
// no new NPV; the gas royalty is imported, never re-implemented). Jest and
// Vite compile .ts; plain node 18 does not, so every EC8 wave script that runs
// the engine registers this hook first (through gsa_engine.mjs). It strips the
// types with the esbuild the NextGen repository already installs and changes no
// behaviour.
//
// A URL for gasContract.js carrying ?variant=<name> loads the SAME source with
// ONE named textual substitution from VARIANTS below: a plausible wrong method
// a learner might use (take-or-pay on the unadjusted ACQ), or the other side of
// an open reading the engine states (the model formula's seller shortfall
// against the quantity taken). Each substitution must match EXACTLY ONCE, or
// the load throws naming the variant, so a variant can never silently run the
// true engine. The true engine is loaded with no query and is never patched.
// No digest line and no graded field is computed from a variant.
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

// esbuild comes from the NextGen repository the engine is vendored in, found
// from EC8_ENGINES (<repo>/packages/engines) so the committed mirror runs on a
// CI runner; EC8_REPO overrides it.
const ENG = process.env.EC8_ENGINES || '/root/wt-ec8-nextgen/packages/engines';
const REPO = process.env.EC8_REPO || path.resolve(ENG, '..', '..');
const esbuild = createRequire(`${REPO}/package.json`)('esbuild');

// [find, replace]: find is an exact string that must occur exactly once in gasContract.js.
export const VARIANTS = {
  // ---- wrong methods (discriminate.mjs) ----
  // Take-or-pay quantity on the ACQ before any adjustment.
  top_on_unadjusted_acq: [
    'const topQuantity = (topPct * adjustedAcq) / 100;',
    'const topQuantity = (topPct * y.acq) / 100;',
  ],
  // Force majeure left in the Adjusted ACQ.
  fm_not_netted: [
    'const adjustedAcq = y.acq - maint - fm - sfq - perm;',
    'const adjustedAcq = y.acq - maint - sfq - perm;',
  ],
  // Scheduled maintenance left in the Adjusted ACQ.
  maintenance_not_netted: [
    'const adjustedAcq = y.acq - maint - fm - sfq - perm;',
    'const adjustedAcq = y.acq - fm - sfq - perm;',
  ],
  // Seller shortfall left in the Adjusted ACQ.
  seller_shortfall_not_netted: [
    'const adjustedAcq = y.acq - maint - fm - sfq - perm;',
    'const adjustedAcq = y.acq - maint - fm - perm;',
  ],
  // Make-up recoverable for one contract year more than stated.
  expiry_one_year_late: [
    'mu.push({ fromYear: y.year, lastYear: y.year + makeUp.periodYears, left: deficiencyPaid });',
    'mu.push({ fromYear: y.year, lastYear: y.year + makeUp.periodYears + 1, left: deficiencyPaid });',
  ],
  // Make-up recoverable for one contract year fewer than stated.
  expiry_one_year_early: [
    'mu.push({ fromYear: y.year, lastYear: y.year + makeUp.periodYears, left: deficiencyPaid });',
    'mu.push({ fromYear: y.year, lastYear: y.year + makeUp.periodYears - 1, left: deficiencyPaid });',
  ],
  // Make-up drawn newest first.
  makeup_lifo: [
    'const makeUpDrawn = want > 0 ? drawFifo(mu, want) : [];',
    'const makeUpDrawn = want > 0 ? drawFifo([...mu].reverse(), want) : [];',
  ],
  // The deficiency paid at the contract price instead of the take-or-pay price.
  deficiency_at_contract_price: [
    'const deficiencyPayment = deficiencyPaid * y.topPrice;',
    'const deficiencyPayment = deficiencyPaid * y.contractPrice;',
  ],
  // Make-up gas invoiced at the contract price.
  makeup_at_contract_price: [
    'const makeUpRevenue = makeUpTaken * y.makeUpPrice;',
    'const makeUpRevenue = makeUpTaken * y.contractPrice;',
  ],
  // The carry-forward cap ignored.
  carry_forward_cap_ignored: [
    'cfApplied = Math.min(cfAvail, (carryForward.capPct * deficiency) / 100);',
    'cfApplied = Math.min(cfAvail, deficiency);',
  ],
  // The carry-forward credit never expires.
  carry_forward_never_expires: [
    'for (const c of cf) if (c.lastYear === y.year && c.left > 0) {',
    'for (const c of cf) if (false && c.lastYear === y.year && c.left > 0) {',
  ],
  // Liquidated damages for a seller shortfall added to the seller's revenue.
  shortfall_damages_to_seller: [
    'netToSeller: regularRevenue + makeUpRevenue + deficiencyPayment - shortfallPayment - refund,',
    'netToSeller: regularRevenue + makeUpRevenue + deficiencyPayment + shortfallPayment - refund,',
  ],
  // The end-of-term refund at the contract price.
  refund_at_contract_price: [
    "if (makeUp.endOfTerm === 'refund') refund = q * y.topPrice;",
    "if (makeUp.endOfTerm === 'refund') refund = q * y.contractPrice;",
  ],
  // The nomination above MaxDCQ counted in full.
  nomination_not_capped: [
    'const pnq = maxDcq !== null && d.nominated > maxDcq ? maxDcq : d.nominated;',
    'const pnq = d.nominated;',
  ],
  // The delivery tolerance ignored.
  tolerance_ignored: [
    'const gap = pnq - deliveryTolerance - d.available;',
    'const gap = pnq - d.available;',
  ],
  // Force majeure and maintenance do not excuse the seller's gap.
  fm_does_not_excuse_gap: [
    'const excused = Math.min(gap, fm + sm);',
    'const excused = 0;',
  ],
  // A buyer-caused gap counted against the seller.
  buyer_caused_counted: [
    'if (d.buyerCaused === true) {',
    'if (false) {',
  ],
  // The averaging window ends at the delivery month (the lag dropped).
  lag_dropped: [
    'const wEnd = blockStart - lagMonths;',
    'const wEnd = blockStart;',
  ],
  // The averaging divides by one month too many.
  average_over_one_more: [
    'averages[nm] = s / averagingMonths;',
    'averages[nm] = s / (averagingMonths + 1);',
  ],
  // The price priced every month, the reset ignored.
  reset_ignored: [
    'const blockStart = t0 + Math.floor((t - t0) / resetMonths) * resetMonths;',
    'const blockStart = t;',
  ],
  // S-curve: the low segment keeps the mid slope.
  scurve_low_keeps_mid_slope: [
    "if (x < s.lowKink) return { raw: f.constant + f.slope * s.lowKink + s.lowSlope * (x - s.lowKink), segment: 'low' };",
    "if (x < s.lowKink) return { raw: f.constant + f.slope * x, segment: 'low' };",
  ],
  // S-curve: the high segment drawn through the origin constant, not anchored at the kink.
  scurve_high_not_anchored: [
    "if (x > s.highKink) return { raw: f.constant + f.slope * s.highKink + s.highSlope * (x - s.highKink), segment: 'high' };",
    "if (x > s.highKink) return { raw: f.constant + s.highSlope * x, segment: 'high' };",
  ],
  // S-curve: the low segment's own slope applied from zero.
  scurve_low_not_anchored: [
    "if (x < s.lowKink) return { raw: f.constant + f.slope * s.lowKink + s.lowSlope * (x - s.lowKink), segment: 'low' };",
    "if (x < s.lowKink) return { raw: f.constant + s.lowSlope * x, segment: 'low' };",
  ],
  // The Btu at 59 F to 60 F (about 1054.80 J) in place of the International Table Btu.
  btu_59f: [
    'BTU_IT_J: 1055.05585262,',
    'BTU_IT_J: 1054.804,',
  ],
  // The cubic foot rounded to 0.0283 cubic metre.
  cubic_foot_rounded: [
    'M3_PER_FT3: 0.028316846592,',
    'M3_PER_FT3: 0.0283,',
  ],
  // Every contract year of 365 days.
  every_year_365: [
    "return { n, rule: `calendar year ${year}: ${n} days (${n === 366 ? 'a leap year' : 'not a leap year'})` };",
    "return { n: 365, rule: `calendar year ${year}: ${n} days (${n === 366 ? 'a leap year' : 'not a leap year'})` };",
  ],
  // The period end date counted as a contract day.
  end_date_counted: [
    "const n = Math.round((Date.parse(`${period.end}T00:00:00Z`) - Date.parse(`${period.start}T00:00:00Z`)) / 86400000);",
    "const n = Math.round((Date.parse(`${period.end}T00:00:00Z`) - Date.parse(`${period.start}T00:00:00Z`)) / 86400000) + 1;",
  ],
  // The effective swing inverted (take-or-pay fraction over swing factor).
  effective_swing_inverted: [
    'if (topPct !== undefined && maxDcqPct !== undefined) out.effectiveSwing = maxDcqPct / topPct;',
    'if (topPct !== undefined && maxDcqPct !== undefined) out.effectiveSwing = topPct / maxDcqPct;',
  ],
  // The DGDO penalty at US$3 per MMBtu.
  dgdo_rate_three: [
    'dgdoPenaltyUsdPerMmbtu: 3.5, // s.110(8); DGDO Regulations 2022 r.6(1)',
    'dgdoPenaltyUsdPerMmbtu: 3, // s.110(8); DGDO Regulations 2022 r.6(1)',
  ],
  // A signed agreement's rate below US$3.50 accepted as stated.
  dgdo_agreement_below_minimum: [
    'rate = Math.max(agreementPenaltyRate, PIA_GAS.dgdoPenaltyUsdPerMmbtu);',
    'rate = agreementPenaltyRate;',
  ],
  // The s.110(10) excuses not capped at the undelivered quantity (each applied in full).
  dgdo_excuses_uncapped: [
    'const used = Math.min(q, left);',
    'const used = q;',
  ],
  // The gas royalty with the in-country share ignored (5% on all gas).
  royalty_share_ignored: [
    'const rate = deriveGasRoyaltyRate(royalty.terrain, share);',
    'const rate = deriveGasRoyaltyRate(royalty.terrain, 0);',
  ],
  // The NPV discounted one year early.
  npv_one_year_early: [
    'npvSellerRevenue: npv(gross, discountRate, baseYear, firstYear),',
    'npvSellerRevenue: npv(gross, discountRate, baseYear + 1, firstYear),',
  ],
  // ---- the other side of each open reading the engine states (gsa_capstone.mjs proves no field moves) ----
  // The model formula as printed: SFQ = (PNQ - DTQ) - DAQ, the seller shortfall against the quantity TAKEN.
  reading_sfq_against_taken: [
    'const gap = pnq - deliveryTolerance - d.available;',
    'const gap = pnq - deliveryTolerance - d.taken;',
  ],
  // The model's MUA summing BADQ: the make-up right is the whole deficiency, before any carry-forward credit.
  reading_makeup_is_whole_deficiency: [
    'if (deficiencyPaid > 0 && makeUp.periodYears > 0 && y.year !== last) mu.push({ fromYear: y.year, lastYear: y.year + makeUp.periodYears, left: deficiencyPaid });',
    'if (deficiency > 0 && makeUp.periodYears > 0 && y.year !== last) mu.push({ fromYear: y.year, lastYear: y.year + makeUp.periodYears, left: deficiency });',
  ],
  // A last-contract-year deficiency opening a make-up entry that the end-of-term rule then forfeits or refunds.
  reading_last_year_opens_makeup: [
    'if (deficiencyPaid > 0 && makeUp.periodYears > 0 && y.year !== last) mu.push({ fromYear: y.year, lastYear: y.year + makeUp.periodYears, left: deficiencyPaid });',
    'if (deficiencyPaid > 0 && makeUp.periodYears > 0) mu.push({ fromYear: y.year, lastYear: y.year + makeUp.periodYears, left: deficiencyPaid });',
  ],
  // Royalty charged on the deficiency payment as well as on the value of gas delivered.
  reading_royalty_on_deficiency: [
    'const deliveredValue = r.taken * contract.years[i].contractPrice;',
    'const deliveredValue = r.taken * contract.years[i].contractPrice + r.deficiencyPayment;',
  ],
};

export async function load(url, context, nextLoad) {
  const u = new URL(url);
  if (u.protocol !== 'file:') return nextLoad(url, context);
  const variant = u.searchParams.get('variant');
  if (variant && u.pathname.endsWith('/gasContract.js')) {
    let src = fs.readFileSync(fileURLToPath(`file://${u.pathname}`), 'utf8');
    const v = VARIANTS[variant];
    if (!v) throw new Error(`ts_loader: no variant named ${variant}`);
    const n = src.split(v[0]).length - 1;
    if (n !== 1) throw new Error(`ts_loader: variant ${variant} matched ${n} times; it must match exactly once`);
    src = src.replace(v[0], () => v[1]);
    return { format: 'module', source: src, shortCircuit: true };
  }
  if (u.pathname.endsWith('.ts')) {
    const src = fs.readFileSync(fileURLToPath(`file://${u.pathname}`), 'utf8');
    const out = esbuild.transformSync(src, { loader: 'ts', format: 'esm', target: 'node18' });
    return { format: 'module', source: out.code, shortCircuit: true };
  }
  return nextLoad(url, context);
}
