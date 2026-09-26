# EC9 Joint Ventures, Operating Agreements & Cost Recovery. Three tiers, six
# modules each, 26 lessons a tier. The fourth course of the academy's upstream
# commercial line in the `economics` module (path_order 74), after EC8 gsa. An
# ENGINE COURSE: there is no Suite app, and every practical runs in the
# course's own calculator panels over the vendored engine.
#
# Engine: engines/economics/jointVenture.js, vendored sha-identical with
# petrolord-engines 3ae56e7 (engines PR #270). It imports applyPSC and npv from
# engines/economics/cashflow.ts (NextGen's blob is the 3ae56e7 blob) and
# calculatePartnerCosts from engines/economics/afe.js (NextGen keeps its older
# blob; calculatePartnerCosts is source-identical). vendor_joa.sh walks the
# closure from the jest suite (twelve paths, ten of them new) and the engine's
# own suite passes 187 of 187 against NextGen's copies.
#
# THE DIGEST IS THE ONLY TEACHING TRUTH. digest.txt, built by joa_dump.mjs. The
# engine's FINDINGS record, the oracle, the fixture README and the engine's
# source comments are PROVENANCE. Where FINDINGS quotes a figure (a published
# figure, a fixture situation, a boundary) the digest recomputes it through the
# engine and prints it; a writer quotes the digest line.
#
# THE COURSE IN ONE SENTENCE. A joint operating agreement is a set of interest,
# payment and remedy rules that can be written down and computed, so the course
# teaches participating, paying and beneficial interests, cash calls, budget
# control and operator overhead at Associate; the cash call reconciliation,
# carries with uplift and caps, the back-in of PIA 2021 s.85(4), default cover
# and interest, and PSC cost recovery through the canonical applyPSC with its
# three published checks at Professional; and sole risk and non-consent with
# the premium and reversion, buy-in, the engine's stated readings, the
# reference texts' quirks and what the engine does not compute at Expert; and
# grades each tier on its own question with numbers the engine returns.
#
# TIER OWNERSHIP, drawn along the engine's own functions:
#
#   Associate    INTERESTS AND THE JOINT ACCOUNT. What a JOA fixes; the sources
#                and the dates they were read; participating interests and the
#                afe split (participatingInterests); paying and beneficial
#                interest under a carry; monthly cash calls, actuals, the
#                no-call threshold and billing in arrears (cashCalls, one
#                month's adjustment); budget control against the item and
#                budget tolerances and the unbudgeted allowance
#                (budgetControl); operator overhead on a marginal scale with
#                exclusions (overhead).
#   Professional RECOVERY, DEFAULT AND COST RECOVERY. The cash call ledger over a
#                year (the reconciliation lag, a negative call refunded or
#                carried, the balance with the operator); a carry recovered
#                with a compound or multiple uplift and a cap (carryRecovery);
#                the back-in of PIA 2021 s.85(4) (backIn); a default with pro
#                rata cover, simple or monthly-compound interest, grace,
#                suspension and forfeiture (defaultCover); the PSC cost pool
#                through the canonical applyPSC and the three published checks
#                (pscCostRecovery).
#   Expert       SOLE RISK, THE READINGS AND READING THE ENGINE. Sole risk and
#                non-consent with the premium on the proportionate share,
#                recovery from production and reversion inside the period
#                (nonConsent); buy-in at a stated multiple; the three readings
#                the engine states; the reference texts and their quirks; what
#                the engine does not compute; the conventions that are choices
#                and the partner report.
#
# A higher tier may USE a lower tier's methods (a Professional ledger is built
# from Associate months), and each capstone grades only its own question.
#
# SCOPE SEAMS, recorded so no lesson re-teaches another course's material:
#   * the cash flow ledger, discounting and NPV as a subject are OWNED BY the
#     cashflow course; this course imports the canonical npv and applyPSC and
#     says so;
#   * fiscal regime design (royalty, profit share and tax as design levers) is
#     OWNED BY the fiscal course;
#   * the Nigerian fiscal system (royalty by terrain, hydrocarbon tax,
#     companies income tax) is OWNED BY the pia course; this course teaches
#     the Act's carried interest provision (s.85(4)) and quotes s.311 only;
#   * portfolio choice and the field development plan are OWNED BY the
#     portfolio and fdp courses.
#
# Panel ids: A the account calculator (interests, cash calls, budget control,
# overhead), R the recovery calculator (the cash call ledger, carries, back-in,
# default, PSC cost recovery), X the agreement calculator (non-consent and
# buy-in, the readings side by side, boundary probes, and every function). Every
# panel takes a learner's own agreement terms, which is how a capstone is
# worked, and the course pages say plainly that the practicals run in these
# panels.
#
# Titles carry COUNTS only, never a MEASUREMENT, and counts are spelled in
# words: ANY DIGIT in a title fails the check below. No em dashes and no
# "X, not Y" contrastive (nor "rather than", ", never" or "instead of")
# anywhere a learner reads, headings and module titles included.
#
# THIS COURSE TEACHES NO REPAIR HISTORY. The engine's lead decisions (the
# interest method and grace as required inputs, the PSC tax reading stated,
# the Norwegian agreement cited from its archived capture) landed before its
# merge and before any lesson was written, so there is no history module and
# no framed history section.
#
# NAMING COLLISIONS, legislated in the digest's vocabulary section:
#   * "interest" is always qualified: participating interest, paying
#     interest, beneficial interest, carried interest, or default interest
#     (money charged on a late payment);
#   * "carry" is the carried party's cost paid by its carriers; "carried
#     forward" is a cost oil pool, a credit or a balance moved to a later
#     period;
#   * "recovery" is always of something named: carry recovery, premium
#     recovery, cost recovery (PSC);
#   * "premium" is the stated multiple of a non-consenting party's
#     proportionate share of an operation's cost;
#   * "cash call" is a monthly advance request; an "adjustment" is the
#     difference of an earlier month applied to a later call.
#
# PER-LESSON WORD COUNTS. The band is 420 to 560 PROSE WORDS, measured by
# lengths.py (front matter, table rows and {{panel}} lines excluded, HEADINGS
# COUNTED). The minimum is DERIVED from est_minutes: 420 at 12, 460 at 13, 500
# at 14. An est_minutes with no declared minimum RAISES.
BAND = (420, 560)
MIN_BY_MINUTES = {12: 420, 13: 460, 14: 500}


def min_words(est_minutes):
    """The minimum prose words a lesson of this length must carry."""
    if est_minutes not in MIN_BY_MINUTES:
        raise ValueError(
            f'no minimum word count is declared for {est_minutes} estimated minutes; '
            f'declared: {sorted(MIN_BY_MINUTES)}')
    return MIN_BY_MINUTES[est_minutes]


A = 'joa-account-calculator'
R = 'joa-recovery-calculator'
X = 'joa-agreement-calculator'
PANEL_IDS = [A, R, X]

TIERS = {
 'beginner': [
  ('m01-what-a-joint-operating-agreement-fixes', 'What a Joint Operating Agreement Fixes', [
    ('l01-a-licence-shared-by-agreement', 'A licence shared by agreement', 12, [A]),
    ('l02-operator-non-operators-and-the-committee', 'The operator, the non-operators and the committee', 13, [A]),
    ('l03-the-ekene-joint-venture', 'The Ekene joint venture', 13, [A]),
    ('l04-sources-and-the-dates-they-were-read', 'Sources and the dates they were read', 13, [A]),
    ('l05-calculator-panels-and-refusals', 'The calculator panels and the refusals', 14, [A]),
  ]),
  ('m02-participating-interests', 'Participating Interests', [
    ('l01-the-participating-interest', 'The participating interest', 12, [A]),
    ('l02-interests-that-sum-to-the-whole', 'Interests that sum to the whole', 13, [A]),
    ('l03-cost-shares-and-production-shares', 'Cost shares and production shares', 13, [A]),
    ('l04-the-partner-split', 'The partner split of a joint account amount', 13, [A]),
  ]),
  ('m03-paying-and-beneficial-interests', 'Paying and Beneficial Interests', [
    ('l01-beneficial-interest-is-the-production-share', 'Beneficial interest is the production share', 12, [A]),
    ('l02-paying-interest-under-a-carry', 'Paying interest under a carry', 14, [A]),
    ('l03-carriers-pro-rata-and-in-stated-shares', 'Carriers pro rata and in stated shares', 13, [A]),
    ('l04-reading-the-interests-table', 'Reading the interests table', 13, [A]),
  ]),
  ('m04-cash-calls', 'Cash Calls', [
    ('l01-the-joint-account-and-monthly-advances', 'The joint account and monthly advances', 12, [A]),
    ('l02-the-forecast-share', 'The forecast share of a cash call', 13, [A]),
    ('l03-actuals-and-the-difference', 'Actuals and the difference', 13, [A]),
    ('l04-the-no-call-threshold-and-arrears', 'The no-call threshold and billing in arrears', 14, [A]),
    ('l05-a-zero-call-month', 'A month with a zero forecast', 12, [A]),
  ]),
  ('m05-budget-control', 'Budget Control', [
    ('l01-the-approved-budget-by-line', 'The approved budget by line', 12, [A]),
    ('l02-the-item-tolerance', 'The item tolerance', 13, [A]),
    ('l03-the-budget-tolerance', 'The budget tolerance, the lower of two', 13, [A]),
    ('l04-unbudgeted-items-and-the-allowance', 'Unbudgeted items and the allowance', 13, [A]),
  ]),
  ('m06-overhead-basics', 'Overhead Basics', [
    ('l01-operator-overhead-and-its-base', 'Operator overhead and its base', 12, [A]),
    ('l02-a-marginal-sliding-scale', 'A marginal sliding scale', 14, [A]),
    ('l03-exclusions-and-the-band-edge', 'Exclusions and the band edge', 13, [A]),
    ('l04-the-capstone-brief', 'The capstone brief', 13, [A]),
  ]),
 ],
 'intermediate': [
  ('m01-the-cash-call-ledger', 'The Cash Call Ledger', [
    ('l01-reconciliation-carried-to-a-later-call', 'Reconciliation carried to a later call', 12, [A, R]),
    ('l02-the-reconciliation-lag', 'The reconciliation lag', 13, [R]),
    ('l03-a-negative-call-refunded-or-carried', 'A negative call, refunded or carried', 14, [R]),
    ('l04-the-balance-with-the-operator', 'The balance with the operator', 13, [R]),
  ]),
  ('m02-carries-with-uplift-and-caps', 'Carries with Uplift and Caps', [
    ('l01-a-carry-and-its-recovery', 'A carry and its recovery', 12, [R]),
    ('l02-recovery-from-the-carried-share', 'Recovery from the carried party\'s share', 13, [R]),
    ('l03-compound-uplift-on-the-opening-balance', 'Compound uplift on the opening balance', 14, [R]),
    ('l04-a-multiple-uplift', 'A multiple uplift', 13, [R]),
    ('l05-a-cap-and-the-write-off', 'A cap and the write-off', 13, [R]),
  ]),
  ('m03-back-in-under-the-act', 'Back-In under the Act', [
    ('l01-the-carried-interest-provision', 'The carried interest provision of the Act', 13, [R]),
    ('l02-interests-after-a-back-in', 'Interests after a back-in', 13, [R]),
    ('l03-refundable-costs-and-exclusions', 'Refundable costs and the exclusions', 14, [R]),
    ('l04-the-refund-from-future-entitlement', 'The refund from future entitlement', 13, [R]),
  ]),
  ('m04-default-cover-and-interest', 'Default Cover and Interest', [
    ('l01-a-default-on-a-cash-call', 'A default on a cash call', 12, [R]),
    ('l02-pro-rata-cover', 'Pro rata cover by the non-defaulting parties', 13, [R]),
    ('l03-simple-default-interest', 'Simple default interest on a day basis', 13, [R]),
    ('l04-monthly-compounding-and-grace', 'Monthly compounding and the grace', 14, [R]),
    ('l05-suspension-and-forfeiture', 'Suspension and forfeiture triggers', 13, [R]),
  ]),
  ('m05-psc-cost-recovery', 'PSC Cost Recovery', [
    ('l01-cost-oil-profit-oil-and-the-order', 'Cost oil, profit oil and the order', 12, [R]),
    ('l02-the-cost-oil-limit-and-its-base', 'The cost oil limit and its base', 14, [R]),
    ('l03-the-pool-carried-forward', 'The cost pool carried forward', 13, [R]),
    ('l04-splitting-the-contractor-entitlement', 'Splitting the contractor entitlement between partners', 13, [R]),
  ]),
  ('m06-the-published-psc-checks', 'The Published PSC Checks', [
    ('l01-the-world-bank-two-barrel-example', 'The World Bank two-barrel example', 13, [R]),
    ('l02-the-imf-one-barrel-figure', 'The IMF one-barrel figure', 12, [R]),
    ('l03-the-imf-schedule-year-by-year', 'The IMF schedule, year by year', 14, [R]),
    ('l04-the-capstone-brief', 'The capstone brief', 13, [R]),
  ]),
 ],
 'advanced': [
  ('m01-sole-risk-and-non-consent', 'Sole Risk and Non-Consent', [
    ('l01-sole-risk-operations', 'Sole risk operations', 12, [X]),
    ('l02-the-premium-on-the-proportionate-share', 'The premium on the proportionate share', 13, [X]),
    ('l03-recovery-from-production', 'Recovery from the non-consenting party\'s production', 14, [X]),
    ('l04-reversion-inside-the-period', 'Reversion inside the period', 13, [X]),
    ('l05-net-value-and-deductions', 'Net value and deductions', 13, [X]),
  ]),
  ('m02-buy-in-and-entry', 'Buy-In and Entry', [
    ('l01-buy-in-at-a-stated-multiple', 'Buy-in at a stated multiple', 12, [X]),
    ('l02-the-norwegian-entry-payment', 'The Norwegian entry payment', 13, [X]),
    ('l03-apportioned-to-the-consenting-parties', 'Apportioned to the consenting parties', 13, [X]),
    ('l04-buy-in-and-recovery-compared', 'Buy-in and recovery from production compared', 14, [X]),
  ]),
  ('m03-the-stated-readings', 'The Stated Readings', [
    ('l01-the-psc-tax-reading', 'The PSC tax reading', 14, [R, X]),
    ('l02-the-grace-reading', 'The grace reading', 13, [R, X]),
    ('l03-the-cover-reading', 'The cover reading', 13, [X]),
    ('l04-the-limit-base-is-a-stated-input', 'The limit base is a stated input', 13, [R, X]),
    ('l05-no-hidden-contractual-defaults', 'No hidden contractual defaults', 12, [X]),
  ]),
  ('m04-reference-texts-and-their-quirks', 'Reference Texts and Their Quirks', [
    ('l01-model-agreements-and-licensed-forms', 'Model agreements and licensed forms', 13, [X]),
    ('l02-printed-figures-and-exact-figures', 'Printed figures and exact figures', 13, [R, X]),
    ('l03-the-worked-example-that-does-not-add-up', 'The worked example that does not add up', 12, [X]),
    ('l04-boundaries-rule-by-rule', 'Boundaries, rule by rule', 14, [X]),
  ]),
  ('m05-what-the-engine-does-not-compute', 'What the Engine Does Not Compute', [
    ('l01-compensation-cover-in-kind-and-cash-balances', 'Compensation, cover in kind and cash balances', 13, [X]),
    ('l02-expert-determination-and-the-haircut', 'Expert determination and the haircut', 13, [X]),
    ('l03-sliding-scales-computed-outside', 'Sliding scales computed outside', 13, [R, X]),
    ('l04-sole-risk-development-and-indexation', 'Sole risk development and indexation', 12, [X]),
  ]),
  ('m06-conventions-and-the-partner-report', 'Conventions and the Partner Report', [
    ('l01-conventions-that-are-choices', 'Conventions that are choices', 13, [X]),
    ('l02-caps-and-refusals', 'Caps and refusals', 12, [X]),
    ('l03-writing-the-partner-report', 'Writing the partner report', 13, [X]),
    ('l04-the-capstone-brief', 'The capstone brief', 13, [X]),
  ]),
 ],
}

TIER_NAMES = {'beginner': 'Associate', 'intermediate': 'Professional', 'advanced': 'Expert'}

# ---------------------------------------------------------------------------
# THE CHECKS THIS FILE RUNS ON ITSELF. `python3 structure.py` prints them;
# `python3 structure.py --modules` prints the module map d5_dump.mjs builds its
# section owner clauses from, and refuses to print if any check fails.
# `python3 structure.py --manifest-extras` prints the per-lesson word band the
# scaffold writes into each manifest.
# ---------------------------------------------------------------------------


def flat():
    """Every lesson as (tier, module_key, module_title, module_order,
    lesson_order, lesson_key, lesson_title, est_minutes, panels, min_words)."""
    out = []
    for tier, mods in TIERS.items():
        for mi, (mkey, mtitle, lessons) in enumerate(mods, 1):
            for li, (lkey, ltitle, est, panels) in enumerate(lessons, 1):
                out.append((tier, mkey, mtitle, mi, li, lkey, ltitle, est, panels, min_words(est)))
    return out


def check(quiet=False):
    import re
    rows = flat()
    problems = []
    per_tier = {}
    for r in rows:
        per_tier[r[0]] = per_tier.get(r[0], 0) + 1
    for tier, n in per_tier.items():
        if n != 26:
            problems.append(f'{tier} has {n} lessons, expected 26')
        if len(TIERS[tier]) != 6:
            problems.append(f'{tier} has {len(TIERS[tier])} modules, expected 6')
    if len(rows) != 78:
        problems.append(f'{len(rows)} lessons in the wave, expected 78')
    if len(TIERS) != 3:
        problems.append(f'{len(TIERS)} tiers, expected 3')
    for r in rows:
        for pid in r[8]:
            if pid not in PANEL_IDS:
                problems.append(f'{r[0]}/{r[5]} tags an unknown panel {pid}')
        if not (BAND[0] <= r[9] <= BAND[1] - 60):
            problems.append(f'{r[0]}/{r[5]} minimum {r[9]} leaves under sixty words of room in the band')
    for tier, mods in TIERS.items():
        mkeys = [m[0] for m in mods]
        if len(set(mkeys)) != len(mkeys):
            problems.append(f'{tier} repeats a module key')
        for i, mkey in enumerate(mkeys, 1):
            if not mkey.startswith(f'm{i:02d}-'):
                problems.append(f'{tier}: module {mkey} is not numbered m{i:02d}')
        for mkey, _, lessons in mods:
            lkeys = [l[0] for l in lessons]
            if len(set(lkeys)) != len(lkeys):
                problems.append(f'{tier}/{mkey} repeats a lesson key')
            for i, lkey in enumerate(lkeys, 1):
                if not lkey.startswith(f'l{i:02d}-'):
                    problems.append(f'{tier}/{mkey}: lesson {lkey} is not numbered l{i:02d}')
    titles = [(tier, t) for tier, mods in TIERS.items() for mkey, mtitle, lessons in mods
              for t in [mtitle] + [l[1] for l in lessons]]
    if len({t for _, t in titles}) != len(titles) - sum(1 for _, t in titles if t == 'The capstone brief') + 1:
        problems.append('a module or lesson title is repeated somewhere other than the three capstone briefs')
    for tier, t in titles:
        if re.search('[–—]', t):
            problems.append(f'{tier}: title carries a dash: {t}')
        if re.search(r',\s+not\s+\w|\brather than\b|,\s+never\b|\binstead of\b', t, re.I):
            problems.append(f'{tier}: title carries a contrastive: {t}')
        if re.search(r'\d', t):
            problems.append(f'{tier}: title carries a digit, which is a measurement rather than a count: {t}')
        if re.search(r'\bAI\b|AI-powered|artificial intelligence', t, re.I):
            problems.append(f'{tier}: title claims AI, and this course names its methods: {t}')
    # NO HISTORY: the course teaches none, so nothing may read like it.
    for tier, mods in TIERS.items():
        for mkey, mtitle, lessons in mods:
            for k, t in [(mkey, mtitle)] + [(l[0], l[1]) for l in lessons]:
                if re.search(r'used-to|was-repaired|repair-history|no-longer', k) or \
                   re.search(r'\bused to\b|\bno longer\b|\bwas repaired\b', t, re.I):
                    problems.append(f'{tier}/{k}: reads as repair history, and this course teaches none')
    # ONE CAPSTONE BRIEF A TIER, and it is the last lesson of the last module.
    for tier, mods in TIERS.items():
        briefs = [(m[0], l[0]) for m in mods for l in m[2] if l[0].endswith('the-capstone-brief')]
        if briefs != [(mods[-1][0], mods[-1][2][-1][0])]:
            problems.append(f'{tier}: the capstone brief is not exactly the last lesson of the last module: {briefs}')
    # EVERY PANEL IS USED, and the tier's own panel carries its tier.
    used = {p for r in rows for p in r[8]}
    for pid in PANEL_IDS:
        if pid not in used:
            problems.append(f'panel {pid} is declared and no lesson tags it')
    own = {'beginner': A, 'intermediate': R, 'advanced': X}
    for tier, pid in own.items():
        n = sum(1 for r in rows if r[0] == tier and pid in r[8])
        if n < 13:
            problems.append(f'{tier}: its own panel {pid} is tagged on only {n} lessons')
    # NO FORWARD PANEL: a lower tier never tags a higher tier's panel.
    rank = {A: 0, R: 1, X: 2}
    trank = {'beginner': 0, 'intermediate': 1, 'advanced': 2}
    for r in rows:
        for pid in r[8]:
            if rank[pid] > trank[r[0]]:
                problems.append(f'{r[0]}/{r[5]} tags the higher tier panel {pid}')
    if not quiet:
        minutes = sorted({r[7] for r in rows})
        print(f'EC9 joa structure: {len(rows)} lessons, '
              f'{sum(len(m) for m in TIERS.values())} modules, {len(TIERS)} tiers')
        for tier in ('beginner', 'intermediate', 'advanced'):
            mods = TIERS[tier]
            print(f'  {tier:13s} {len(mods)} modules, {per_tier[tier]} lessons, '
                  f'panel tags {sum(len(l[3]) for m in mods for l in m[2])}')
        print(f'  estimated minutes present: {minutes}, '
              f'minimum prose words: {[MIN_BY_MINUTES[m] for m in minutes]}, band ceiling {BAND[1]}')
        print(f'  total estimated minutes: {sum(r[7] for r in rows)}, '
              f'total minimum prose words: {sum(r[9] for r in rows)}')
        print(f'  panels declared: {PANEL_IDS}')
        print('  history modules: none (this course teaches no repair history)')
        print(f'  PROBLEMS: {len(problems)}')
        for p in problems:
            print(f'   {p}')
    return problems


if __name__ == '__main__':
    import json
    import sys
    if '--modules' in sys.argv:
        probs = check(quiet=True)
        if probs:
            print(json.dumps({'REFUSED': probs}))
            sys.exit(1)
        print(json.dumps({TIER_NAMES[t]: {m[0][:3]: {'key': m[0], 'title': m[1], 'lessons': [l[0][:3] for l in m[2]]}
                                          for m in mods} for t, mods in TIERS.items()}))
        sys.exit(0)
    sys.exit(1 if check() else 0)
