# EC10 Farm-ins, Farm-outs & Asset Valuation. Three tiers, six modules each,
# 26 lessons a tier. The fifth course of the academy's upstream commercial line
# in the `economics` module (path_order 75), after EC9 joa. An ENGINE COURSE:
# there is no Suite app, and every practical runs in the course's own
# calculator panels over the vendored engine.
#
# Engine: engines/economics/farmout.js, vendored sha-identical with
# petrolord-engines b7d305b (engines PRs #272, #273 FINDINGS and #274 the
# simple uplift) under its own root
# packages/engines/ec10-farmout, with its whole runtime closure (cashflow.ts
# for applyJV and npv, decisionTree.js for rollback, evpi and evii,
# portfolio.js for portfolioRiskMetrics, afe.js for calculatePartnerCosts,
# jointVenture.js for carryRecovery and backIn). The closure has its own root
# because the canonical NextGen decisionTree.js and portfolio.js are held at
# older blobs for the EC4 and EC5 courses (vendor_farmout.sh says why).
# vendor_farmout.sh walks the closure from the jest suite (nineteen paths with
# FINDINGS) and the engine's own suite passes 153 of 153 from that root.
#
# THE DIGEST IS THE ONLY TEACHING TRUTH. digest.txt, built by farmout_dump.mjs.
# The oracle, the golden's expected figures, the fixture README and the
# engine's source comments are PROVENANCE. Where they state a figure (a
# published figure, a fixture situation, a boundary) the digest recomputes it
# through the engine and prints it; a writer quotes the digest line.
#
# THE COURSE IN ONE SENTENCE. A farm-out is a set of stated deal terms that
# can be written down and computed, so the course teaches what a farm-out is,
# the earning obligation, the promote and its ratio, the cash bonus and the
# past-cost reimbursement, and the consent process in words at Associate; caps
# and overrun rules, drill-to-earn vesting, the value of the deal to each side
# by EMV, the break-even promote and chance, and the consent fee of the 2024
# Regulations with its day rules at Professional; and the value of information
# to each side, risk sharing, the price of an interest and transaction ratios,
# a development carry and a back-in through the joint venture engine, the
# readings and source quirks, and what the engine does not compute at Expert;
# and grades each tier on its own question with numbers the engine returns.
#
# TIER OWNERSHIP, drawn along the engine's own functions:
#
#   Associate    THE DEAL AND WHAT IT COSTS. What a farm-out is and who the
#                parties are; the sources and the dates they were read; the
#                earning obligation of one event (earningObligation): the
#                share paid, the interest earned, the other parties' shares
#                through the canonical partner split; the promote in points
#                and its ratio, the carry inside it; the cash bonus, the
#                past-cost reimbursement, the consideration and the equivalent
#                working interest; the consent process in words (PIA 2021
#                s.95, the 2024 Regulations regs 3, 4 and 16 to 18); the
#                interests after the deal.
#   Professional CAPS, VESTING, VALUE AND THE FEE. Gross-cost and carry-amount
#                caps with the two overrun rules; drill-to-earn events and the
#                two vesting rules; the value of the deal to each side by EMV
#                through the canonical decision tree (dealValue); the
#                break-even promote and the break-even chance of success; the
#                consent fee of reg. 19 (consentFee) with the value of the
#                transaction as a stated input and the day rules of reg.
#                19(7) to (9).
#   Expert       INFORMATION, RISK, PRICE AND AFTER THE FARM-IN. The value of
#                information to each side (informationValue, the canonical
#                evpi and evii); risk sharing through the canonical portfolio
#                Monte Carlo (riskSharing, taught and never graded); value per
#                percent of an interest and transaction ratios (interestValue);
#                a development carry and a back-in through the joint venture
#                engine (developmentCarry, backInRight); the readings the
#                engine states, the texts' quirks and the boundaries; what the
#                engine does not compute and the farm-out report.
#
# A higher tier may USE a lower tier's methods (a Professional deal value is
# built on an Associate earning obligation), and each capstone grades only its
# own question.
#
# SCOPE SEAMS, recorded so no lesson re-teaches another course's material:
#   * carries, back-ins and the mechanics of the joint operating agreement are
#     OWNED BY the joa course; this course runs carryRecovery and backIn on the
#     interests after a farm-in and refers to joa for the rest;
#   * decision trees, EMV and the value of information as methods are OWNED BY
#     the decision course; this course applies the canonical rollback, evpi and
#     evii to the two sides of a deal;
#   * portfolio choice and its risk measures are OWNED BY the portfolio course;
#   * the cash flow ledger, discounting and NPV as a subject are OWNED BY the
#     cashflow course; this course imports the canonical npv and applyJV;
#   * the Nigerian fiscal system is OWNED BY the pia course; this course quotes
#     PIA 2021 s.94, s.95, s.233(10), s.264(f) and s.302(12)(c) only.
#
# Panel ids: A the earning calculator (the earning obligation, the promote,
# the bonus and reimbursement, the interests after the deal), R the deal
# calculator (caps, drill-to-earn, the deal value to each side, the
# break-evens, the consent fee), X the valuation calculator (information
# value, risk sharing, the price of an interest, the development carry and the
# back-in, and every function). Every panel takes a learner's own deal terms,
# which is how a capstone is worked, and the course pages say plainly that the
# practicals run in these panels.
#
# Titles carry COUNTS only, never a MEASUREMENT, and counts are spelled in
# words: ANY DIGIT in a title fails the check below. No em dashes and no
# "X, not Y" contrastive (nor "rather than", ", never" or "instead of")
# anywhere a learner reads, headings and module titles included.
#
# THIS COURSE TEACHES NO REPAIR HISTORY. The engine's lead decisions (every
# deal term a required input, the transaction value stated, the gazetted fee
# rates read from reg. 19) landed before its merge and before any lesson was
# written, so there is no history module and no framed history section.
#
# NAMING COLLISIONS, legislated in the digest's vocabulary section:
#   * "interest" is always qualified: participating interest, working
#     interest, carried interest, vested interest; "simple interest" or an
#     "uplift" for money added to a carry;
#   * "promote" is the share of the gross cost paid less the interest held
#     after the event, in points; the "promote ratio" is the share paid over
#     the interest held;
#   * "carry" is the part of the farmor's cost share the farminee pays;
#   * "consideration" is what the farmor receives: carry, cash bonus and
#     reimbursement; the "value of the transaction" is reg. 19(3)'s amount;
#   * "EMV" is always of a named position; "break-even" always of a named
#     term (the promote or the chance of success).
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


A = 'farmout-earning-calculator'
R = 'farmout-deal-calculator'
X = 'farmout-valuation-calculator'
PANEL_IDS = [A, R, X]

TIERS = {
 'beginner': [
  ('m01-what-a-farm-out-is', 'What a Farm-Out Is', [
    ('l01-an-interest-for-work', 'An interest for work', 12, [A]),
    ('l02-the-farmor-and-the-farminee', 'The farmor and the farminee', 13, [A]),
    ('l03-the-ekene-deep-prospect', 'The Ekene Deep prospect', 13, [A]),
    ('l04-sources-and-the-dates-they-were-read', 'Sources and the dates they were read', 13, [A]),
    ('l05-calculator-panels-and-refusals', 'The calculator panels and the refusals', 14, [A]),
  ]),
  ('m02-the-earning-obligation', 'The Earning Obligation', [
    ('l01-a-work-programme-as-the-price', 'A work programme as the price', 12, [A]),
    ('l02-the-share-paid-and-the-interest-earned', 'The share paid and the interest earned', 13, [A]),
    ('l03-the-other-parties-pay-their-own', 'The other parties pay their own shares', 13, [A]),
    ('l04-reading-the-earning-table', 'Reading the earning table', 13, [A]),
  ]),
  ('m03-the-promote-and-its-ratio', 'The Promote and Its Ratio', [
    ('l01-the-promote-in-points', 'The promote in points', 12, [A]),
    ('l02-the-promote-ratio', 'The promote ratio', 13, [A]),
    ('l03-the-carry-inside-a-promote', 'The carry inside a promote', 14, [A]),
    ('l04-heads-up-and-a-full-carry', 'Heads up and a full carry', 13, [A]),
  ]),
  ('m04-cash-bonus-and-reimbursement', 'Cash Bonus and Reimbursement', [
    ('l01-a-cash-bonus', 'A cash bonus', 12, [A]),
    ('l02-past-cost-reimbursement', 'Past-cost reimbursement', 13, [A]),
    ('l03-the-consideration-to-the-farmor', 'The consideration to the farmor', 13, [A]),
    ('l04-the-equivalent-working-interest', 'The equivalent working interest', 14, [A]),
  ]),
  ('m05-the-consent-process-in-words', 'The Consent Process in Words', [
    ('l01-an-assignment-needs-consent', 'An assignment needs consent', 12, [A]),
    ('l02-the-minister-and-the-commission', 'The Minister and the Commission', 13, [A]),
    ('l03-a-change-of-control', 'A change of control', 13, [A]),
    ('l04-the-notification-and-the-application', 'The notification and the application', 13, [A]),
    ('l05-fees-that-are-not-deductible', 'Fees that are not deductible', 12, [A]),
  ]),
  ('m06-interests-after-the-deal', 'Interests after the Deal', [
    ('l01-the-interests-after-the-farm-in', 'The interests after the farm-in', 12, [A]),
    ('l02-an-event-completed-and-vested', 'An event completed and vested', 13, [A]),
    ('l03-a-checklist-for-reading-a-farm-out', 'A checklist for reading a farm-out', 13, [A]),
    ('l04-the-capstone-brief', 'The capstone brief', 13, [A]),
  ]),
 ],
 'intermediate': [
  ('m01-caps-and-overrun-rules', 'Caps and Overrun Rules', [
    ('l01-a-cap-on-the-gross-cost', 'A cap on the gross cost', 12, [A, R]),
    ('l02-the-overrun-paid-by-the-post-deal-interests', 'The overrun paid by the post-deal interests', 13, [R]),
    ('l03-the-overrun-paid-by-the-farmor-side', 'The overrun paid by the farmor side', 13, [R]),
    ('l04-a-cap-on-the-carry-amount', 'A cap on the carry amount', 14, [R]),
    ('l05-a-cap-reached-exactly', 'A cap reached exactly', 12, [R]),
  ]),
  ('m02-drill-to-earn-vesting', 'Drill-to-Earn Vesting', [
    ('l01-earning-events', 'Earning events', 12, [R]),
    ('l02-vesting-event-by-event', 'Vesting event by event', 13, [R]),
    ('l03-vesting-when-every-event-is-complete', 'Vesting when every event is complete', 13, [R]),
    ('l04-the-obligation-and-the-payments-made', 'The obligation and the payments made', 13, [R]),
  ]),
  ('m03-deal-value-to-each-side', 'Deal Value to Each Side', [
    ('l01-a-risked-prospect-in-stated-terms', 'A risked prospect in stated terms', 12, [R]),
    ('l02-the-farmors-three-actions', 'The farmor\'s three actions', 13, [R]),
    ('l03-the-farminees-choice', 'The farminee\'s choice', 13, [R]),
    ('l04-value-moves-between-the-sides', 'Value moves between the sides', 14, [R]),
    ('l05-the-success-case-value-from-cash-flows', 'The success-case value from cash flows', 13, [R]),
  ]),
  ('m04-break-even-promote-and-chance', 'Break-Even Promote and Chance', [
    ('l01-the-break-even-promote', 'The break-even promote', 13, [R]),
    ('l02-breakpoints-under-a-carry-cap', 'Breakpoints under a carry cap', 14, [R]),
    ('l03-the-break-even-chance-of-success', 'The break-even chance of success', 13, [R]),
    ('l04-when-no-break-even-exists', 'When no break-even exists', 12, [R]),
  ]),
  ('m05-the-consent-fee', 'The Consent Fee', [
    ('l01-seven-per-cent-of-the-value', 'Seven per cent of the value of the transaction', 12, [R]),
    ('l02-the-value-of-the-transaction', 'The value of the transaction, as the regulations define it', 14, [R]),
    ('l03-an-intra-group-transfer-and-a-pel', 'An intra group transfer and a PEL', 13, [R]),
    ('l04-the-fee-in-the-farmors-position', 'The fee in the farmor\'s position', 13, [R]),
  ]),
  ('m06-paying-the-fee-on-time', 'Paying the Fee on Time', [
    ('l01-ninety-days-and-thirty-more', 'Ninety days and thirty more', 12, [R]),
    ('l02-the-surcharge-a-day', 'The surcharge a day', 13, [R]),
    ('l03-the-consent-deemed-withdrawn', 'The consent deemed withdrawn', 13, [R]),
    ('l04-the-capstone-brief', 'The capstone brief', 13, [R]),
  ]),
 ],
 'advanced': [
  ('m01-information-value-to-each-side', 'Information Value to Each Side', [
    ('l01-the-value-of-perfect-information', 'The value of perfect information', 12, [X]),
    ('l02-a-signal-and-its-likelihoods', 'A signal and its likelihoods', 13, [X]),
    ('l03-the-signal-that-turns-the-decision', 'The signal that turns the decision', 14, [X]),
    ('l04-information-worth-its-cost', 'Information worth its cost', 13, [X]),
    ('l05-the-same-survey-to-each-side', 'The same survey to each side', 13, [X]),
  ]),
  ('m02-risk-sharing', 'Risk Sharing', [
    ('l01-positions-as-holdings', 'Positions as holdings', 12, [X]),
    ('l02-spread-and-the-chance-of-a-loss', 'Spread and the chance of a loss', 13, [X]),
    ('l03-the-low-case-and-the-high-case', 'The low case and the high case', 13, [X]),
    ('l04-seed-draws-and-correlation', 'Seed, draws and correlation', 13, [X]),
  ]),
  ('m03-pricing-an-interest', 'Pricing an Interest', [
    ('l01-value-per-percent-of-working-interest', 'Value per percent of working interest', 12, [X]),
    ('l02-risked-and-success-case-bases', 'Risked and success-case bases', 13, [X]),
    ('l03-transaction-ratios-of-stated-inputs', 'Transaction ratios of stated inputs', 14, [X]),
    ('l04-ratios-that-are-only-reported', 'Ratios that are only reported', 13, [X]),
  ]),
  ('m04-carries-and-back-ins-after-the-farm-in', 'Carries and Back-Ins after the Farm-In', [
    ('l01-a-development-carry', 'A development carry', 12, [X]),
    ('l02-uplift-and-recovery-from-the-farmors-share', 'Uplift and recovery from the farmor\'s share', 14, [X]),
    ('l03-a-back-in-after-the-farm-in', 'A back-in after the farm-in', 13, [X]),
    ('l04-refundable-costs-and-the-refund', 'Refundable costs and the refund', 13, [X]),
    ('l05-the-joint-venture-engine-underneath', 'The joint venture engine underneath', 12, [X]),
  ]),
  ('m05-readings-and-source-quirks', 'Readings and Source Quirks', [
    ('l01-the-readings-the-engine-states', 'The readings the engine states', 14, [R, X]),
    ('l02-a-table-with-two-numbers', 'A table with two numbers', 13, [X]),
    ('l03-the-regulations-as-printed', 'The regulations as printed', 13, [R, X]),
    ('l04-boundaries-rule-by-rule', 'Boundaries, rule by rule', 14, [X]),
  ]),
  ('m06-what-the-engine-does-not-compute', 'What the Engine Does Not Compute', [
    ('l01-what-the-engine-leaves-out', 'What the engine leaves out', 13, [X]),
    ('l02-conventions-caps-and-refusals', 'Conventions, caps and refusals', 12, [X]),
    ('l03-writing-the-farm-out-report', 'Writing the farm-out report', 13, [X]),
    ('l04-the-capstone-brief', 'The capstone brief', 13, [X]),
  ]),
 ],
}

TIER_NAMES = {'beginner': 'Associate', 'intermediate': 'Professional', 'advanced': 'Expert'}

# ---------------------------------------------------------------------------
# THE CHECKS THIS FILE RUNS ON ITSELF. `python3 structure.py` prints them;
# `python3 structure.py --modules` prints the module map farmout_dump.mjs builds its
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
        print(f'EC10 farmout structure: {len(rows)} lessons, '
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
