// A NODE 18 LOADER HOOK FOR THE ONE TYPESCRIPT FILE THIS COURSE RUNS, AND FOR
// THE NAMED WRONG-METHOD AND OPEN-READING VARIANTS OF farmout.js THAT
// discriminate.mjs AND farmout_capstone.mjs CALL.
//
// engines/economics/farmout.js imports applyJV and npv from
// engines/economics/cashflow.ts (no new NPV and no new working-interest
// scaling: both are imported, never re-implemented). Jest and Vite compile
// .ts; plain node 18 does not, so every EC10 wave script that runs the engine
// registers this hook first (through farmout_engine.mjs). It strips the types
// with the esbuild the NextGen repository already installs and changes no
// behaviour.
//
// A URL for farmout.js carrying ?variant=<name> loads the SAME source with the
// named textual substitutions from VARIANTS below: a plausible wrong method a
// learner might use (the promote on the event's own interest, the carry cap
// ignored, the dry-hole cost left out), taken from the engine's own negative
// control list (negcontrol_farmout.sh) and a few more, or the other side of a
// reading the engine states (the consent fee's day count, the ninetieth
// surcharge day, the cost timing of a valuation). A variant is one
// [find, replace] pair or a list of them; each find must match EXACTLY ONCE,
// or the load throws naming the variant, so a variant can never silently run
// the true engine. The true engine is loaded with no query and is never
// patched. No digest line and no graded field is computed from a variant.
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

// esbuild comes from the NextGen repository the engine is vendored in, found
// from EC10_ENGINES (<repo>/packages/engines/ec10-farmout) so the committed
// mirror runs on a CI runner; EC10_REPO overrides it.
const ENG = process.env.EC10_ENGINES || '/root/wt-ec10-nextgen/packages/engines/ec10-farmout';
const REPO = process.env.EC10_REPO || path.resolve(ENG, '..', '..', '..');
const esbuild = createRequire(`${REPO}/package.json`)('esbuild');

// [find, replace] or [[find, replace], ...]: every find is an exact string that must occur exactly once in farmout.js.
export const VARIANTS = {
  // ---- wrong methods (discriminate.mjs), the engine's negative control list first ----
  // The promote counted against the event's own earned interest (the interest held before it forgotten).
  promote_on_event_interest: [
    'promotePoints: ev.farmineePaysPct - Y, promoteRatio: ev.farmineePaysPct / Y,',
    'promotePoints: ev.farmineePaysPct - ev.earnedPct, promoteRatio: ev.farmineePaysPct / ev.earnedPct,',
  ],
  // The promote ratio taken over the farmor's retained interest.
  promote_ratio_over_retained: [
    'promotePoints: ev.farmineePaysPct - Y, promoteRatio: ev.farmineePaysPct / Y,',
    'promotePoints: ev.farmineePaysPct - Y, promoteRatio: ev.farmineePaysPct / (F - Y),',
  ],
  // A carry-amount cap ignored.
  carry_cap_ignored: [
    'const carry = Math.min(carryUncapped, cap.amount);',
    'const carry = carryUncapped;',
  ],
  // A gross-cost cap ignored: the promote on the whole gross cost.
  gross_cap_ignored: [
    'base = Math.min(C, cap.amount);',
    'base = C;',
  ],
  // The overrun rules swapped.
  overrun_rules_swapped: [
    "const post = cap.overrunRule === 'post-deal-interests';",
    "const post = cap.overrunRule === 'farmor-side';",
  ],
  // A cap reached exactly counted as exceeded.
  cap_exactly_as_exceeded: [
    "capState = C < cap.amount ? 'below' : C === cap.amount ? 'exactly' : 'exceeded';",
    "capState = C < cap.amount ? 'below' : 'exceeded';",
  ],
  // All-events vesting read as vesting event by event.
  all_events_vest_per_event: [
    "const vested = vesting === 'per-event' ? sum(done.map((r) => r.earnedPct)) : allDone ? Y : 0;",
    'const vested = sum(done.map((r) => r.earnedPct));',
  ],
  // The cash bonus counted twice in the consideration.
  consideration_bonus_twice: [
    'consideration: carry + cashBonus + reimbursement,',
    'consideration: carry + 2 * cashBonus + reimbursement,',
  ],
  // The whole past costs reimbursed (the reimbursed share ignored), in the earning obligation.
  reimbursement_whole_past_costs: [
    'const reimbursement = (pastCosts.amount * pastCosts.reimbursedPct) / 100;',
    'const reimbursement = pastCosts.amount;',
  ],
  // The equivalent working interest on the well payments alone (bonus and reimbursement left out).
  equivalent_without_cash: [
    'const outlay = paid + cashBonus + reimbursement;',
    'const outlay = paid;',
  ],
  // The farminee's positions with the cash bonus counted twice.
  bonus_double_counted: [
    'farminee: { success: partyValue(pr, Y) - ws.farmineePays - cash, dry: -wd.farmineePays - cash },',
    'farminee: { success: partyValue(pr, Y) - ws.farmineePays - cash - deal.cashBonus, dry: -wd.farmineePays - cash - deal.cashBonus },',
  ],
  // The deal's reimbursement taken as the whole past costs.
  deal_reimbursement_whole: [
    'const reimb = (deal.pastCosts.amount * deal.pastCosts.reimbursedPct) / 100;',
    'const reimb = deal.pastCosts.amount;',
  ],
  // The farminee's EMV without its share of the dry-hole cost.
  farminee_no_dry_hole_cost: [
    'dry: -wd.farmineePays - cash },',
    'dry: -cash },',
  ],
  // The farmor alone without the dry-hole cost.
  farmor_alone_no_dry_hole_cost: [
    'dry: -(F * project.wellCost.dry) / 100 },',
    'dry: 0 },',
  ],
  // The 100% position without the dry-hole cost.
  position100_no_dry_hole: [
    'const dry100 = -project.wellCost.dry;',
    'const dry100 = 0;',
  ],
  // The break-even promote solved on the farmor's EMV.
  breakeven_on_farmor_emv: [
    'const q = payoffs(pr, project, deal, F, x).farminee;',
    'const q = payoffs(pr, project, deal, F, x).farmorFarmOut;',
  ],
  // The break-even chance read off the wrong side of the line.
  breakeven_chance_wrong_side: [
    "return { status: 'solved', chanceOfSuccessPct: (-b * 100) / (a - b) };",
    "return { status: 'solved', chanceOfSuccessPct: (a * 100) / (a - b) };",
  ],
  // The farmor keeps its whole interest after the farm-out.
  farmor_keeps_whole_interest: [
    'farmorFarmOut: { success: partyValue(pr, F - Y)',
    'farmorFarmOut: { success: partyValue(pr, F)',
  ],
  // The assignor fees never paid.
  assignor_fees_not_paid: [
    '- ws.farmorPays + cash - deal.assignorFees, dry: -wd.farmorPays + cash - deal.assignorFees }',
    '- ws.farmorPays + cash, dry: -wd.farmorPays + cash }',
  ],
  // An interest priced on the unrisked (success-case) value whatever the basis.
  price_on_unrisked_value: [
    "const baseValue = valueBasis === 'risked' ? risked100 : success100;",
    'const baseValue = success100;',
  ],
  // The risked value per percent taken off the success case.
  risked_per_pct_unrisked: [
    'const perPct = { risked: risked100 / 100,',
    'const perPct = { risked: success100 / 100,',
  ],
  // The working-interest scaling applied twice to a stated success value.
  wi_scaled_twice_npv: [
    '  : scaleWI(pr.S, wiPct));',
    '  : scaleWI(scaleWI(pr.S, wiPct), wiPct));',
  ],
  // The working-interest scaling applied twice to each year's flow.
  wi_scaled_twice_flows: [
    'scaleWI(y.net, wiPct)), pr.flows.discountRate',
    'scaleWI(scaleWI(y.net, wiPct), wiPct)), pr.flows.discountRate',
  ],
  // The working-interest scaling applied twice to the priced interest.
  wi_scaled_twice_priced: [
    'const interestValue = scaleWI(baseValue, interestPct);',
    'const interestValue = scaleWI(scaleWI(baseValue, interestPct), interestPct);',
  ],
  // The signal likelihoods read the wrong way round.
  voi_likelihoods_swapped: [
    'likelihoods: [s.likelihoodsPct[0] / 100, s.likelihoodsPct[1] / 100]',
    'likelihoods: [s.likelihoodsPct[1] / 100, s.likelihoodsPct[0] / 100]',
  ],
  // An intra group transfer charged the premium as well.
  intra_group_pays_premium: [
    'prem = intraGroup ? 0 : NIGERIA_ASSIGNMENT.premiumPct;',
    'prem = NIGERIA_ASSIGNMENT.premiumPct;',
  ],
  // The premium alone taken as the fee (the processing fee left out).
  fee_premium_alone: [
    'const fee = processing + premium;',
    'const fee = premium;',
  ],
  // Day 90 counted late.
  day_90_late: [
    "if (days <= N.payWithinDays) status = 'on-time';",
    "if (days < N.payWithinDays) status = 'on-time';",
  ],
  // A surcharge of 0.1% a day.
  surcharge_tenth_percent: [
    'surchargePctPerDay: 0.01,',
    'surchargePctPerDay: 0.1,',
  ],
  // The surcharge days counted from the notification (the 90 and 30 days not taken off).
  surcharge_from_notification: [
    'const late = days - (N.payWithinDays + N.graceDays);',
    'const late = days;',
  ],

  // ---- the other side of each reading the engine states (capstone reading-freedom) ----
  // Reg. 19(7): the days counted with the day of the notification included.
  reading_days_count_notification_day: [
    'const days = dayNo(payment.paidOn) - dayNo(payment.notifiedOn);',
    'const days = dayNo(payment.paidOn) - dayNo(payment.notifiedOn) + 1;',
  ],
  // Reg. 19(9): the consent deemed withdrawn on the ninetieth surcharge day itself.
  reading_withdrawn_on_the_ninetieth_surcharge_day: [
    'else if (late <= N.surchargeDays)',
    'else if (late < N.surchargeDays)',
  ],
  // The valuation timing: the well costs, the cash bonus, the reimbursement and the
  // assignor fees fall one year after the valuation date, discounted at the
  // success-case rate (where cash flows state one).
  reading_costs_discounted_one_year: [
    [
      'const payoffs = (pr, project, deal, F, X) => {\n  const Y = deal.earnedPct;',
      'const payoffs = (pr, project, deal, F, X) => {\n  const DF = pr.flows ? 1 / (1 + pr.flows.discountRate) : 1;\n  const Y = deal.earnedPct;',
    ],
    [
      'const ws = splitEvent(project.wellCost.success, X, Y, F, deal.cap);\n  const wd = splitEvent(project.wellCost.dry, X, Y, F, deal.cap);',
      'const ws0 = splitEvent(project.wellCost.success, X, Y, F, deal.cap);\n  const wd0 = splitEvent(project.wellCost.dry, X, Y, F, deal.cap);\n  const ws = { ...ws0, farmineePays: ws0.farmineePays * DF, farmorPays: ws0.farmorPays * DF };\n  const wd = { ...wd0, farmineePays: wd0.farmineePays * DF, farmorPays: wd0.farmorPays * DF };',
    ],
    ['const cash = deal.cashBonus + reimb;', 'const cash = (deal.cashBonus + reimb) * DF;'],
    [
      'farmorAlone: { success: partyValue(pr, F) - (F * project.wellCost.success) / 100, dry: -(F * project.wellCost.dry) / 100 },',
      'farmorAlone: { success: partyValue(pr, F) - ((F * project.wellCost.success) / 100) * DF, dry: (-(F * project.wellCost.dry) / 100) * DF },',
    ],
    [
      '- ws.farmorPays + cash - deal.assignorFees, dry: -wd.farmorPays + cash - deal.assignorFees }',
      '- ws.farmorPays + cash - deal.assignorFees * DF, dry: -wd.farmorPays + cash - deal.assignorFees * DF }',
    ],
    [
      'const success100 = pr.S - project.wellCost.success;\n  const dry100 = -project.wellCost.dry;',
      'const DF = pr.flows ? 1 / (1 + pr.flows.discountRate) : 1;\n  const success100 = pr.S - project.wellCost.success * DF;\n  const dry100 = -project.wellCost.dry * DF;',
    ],
  ],
};

const pairs = (v) => (Array.isArray(v[0]) ? v : [v]);

export async function load(url, context, nextLoad) {
  const u = new URL(url);
  if (u.protocol !== 'file:') return nextLoad(url, context);
  const variant = u.searchParams.get('variant');
  if (variant && u.pathname.endsWith('/farmout.js')) {
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
