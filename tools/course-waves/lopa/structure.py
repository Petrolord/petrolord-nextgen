# H3 Process Safety: LOPA & SIL Determination. Three tiers, six modules each,
# 26 lessons a tier. The third course of the academy's `hse` module
# (path_order 63).
#
# Engine: engines/hse/lopa.js, vendored sha-identical with petrolord-engines
# 6703c00 (engines PR #218; the six paths are unchanged through b43f1d9). It
# imports nothing, so the vendoring closure walked from the jest suite is SIX
# paths: three reached by the walk (the suite, the engine, the golden it reads)
# and three NAMED with their reason (the stdlib oracle, the FINDINGS record, the
# negative-control script). vendor_lopa.sh re-walks it.
#
# THE DIGEST IS THE ONLY TEACHING TRUTH. digest.txt, built by h3_dump.mjs. The
# engine's FINDINGS record, the oracle and the engine's source comments are
# PROVENANCE. Where FINDINGS quotes a figure (the published worked SIF, the
# route B departures, the inferred lifetime) the digest recomputes it through the
# engine or reads it from the vendored golden and prints it; a writer quotes the
# digest line and never the FINDINGS line.
#
# TIER OWNERSHIP, and why it is drawn here. Each tier owns one question and its
# capstone grades only that question, so no tier's lessons can hand out another
# tier's graded answer:
#
#   Associate    HOW MUCH RISK REDUCTION IS MISSING. The LOPA arithmetic: the
#                scenario, the initiating event frequency, enabling conditions,
#                conditional modifiers, IPL credit and independence, the TMEL,
#                the required RRF and PFDavg, the outcome states and the exact
#                decade convention. No PFDavg equation.
#   Professional WHAT DOES THE SIF ACHIEVE. PFDavg by the IEC 61508-6 Annex B
#                forms, from the simplified TR84 forms to the full form with
#                detected failures, MTTR, MRT, proof test coverage, the beta
#                factor, every architecture, and the SIF as a series sum.
#   Expert       HOW LONG MAY THE PROOF TEST INTERVAL RUN, AND WHAT DOES THE
#                ENGINE NOT KNOW. Sensitivity, the longest interval and its
#                states, the coverage floor, how conservative Annex B is, the
#                published example's inferred inputs, what the engine does not
#                do (no hardware fault tolerance check, no high demand mode),
#                and judgement.
#
# A higher tier may USE a lower tier's arithmetic (a Professional capstone
# closes the loop to a TMEL), and the capstone of each tier grades its own
# question.
#
# Panel ids: W the LOPA worksheet (a scenario, its credit, the TMEL, the outcome
# and the loop), B the SIF PFDavg builder (one subsystem in any architecture,
# the sum of three), P the proof-test explorer (the sensitivity table, the
# longest interval and its states, the coverage floor). All three read ONE
# teaching lab, and every one takes a learner's own inputs, which is how a
# capstone is worked.
#
# Titles carry COUNTS only, never a MEASUREMENT, and counts are spelled in words:
# ANY DIGIT in a title fails the check below, which is why the architectures
# are spelled "one out of two" in titles. No em dashes and no "X, not Y"
# contrastive anywhere a learner reads, headings and module titles included.
#
# THIS ENGINE HAS NO REPAIR HISTORY. It was written, oracle-gated and merged in
# one pull request, so there is no history module and no framed history section
# in the digest. The published example's INFERRED inputs and its printing slip
# are facts about a published SOURCE, taught in Expert m04; they are not engine
# history. The check below refuses any module or lesson key or title that reads
# like repair history.
#
# ---------------------------------------------------------------------------
# THE ENGINE'S DECLARED CHOICES, WHICH THE LESSONS MUST TEACH BY NAME
#
#   * NOTHING IS INVENTED. The IEF, every probability, every IPL PFD, every
#     failure rate and the TMEL are inputs. The failure rates in this course are
#     illustrative, and licensed IEC and ISA tables are never reproduced.
#   * IPL CREDIT IS A FLAG APPLIED, NEVER ASSUMED: credited only when
#     `independent` is exactly true and `auditable` is not false; two IPLs with
#     one name are refused, one credit per IPL. These rules are SPECIFICATION;
#     no independent route validates them (FINDINGS doubt 3, taught in Expert
#     m05 l04).
#   * THE BAND CONVENTION: SIL n holds 10^-(n+1) <= PFDavg < 10^-n, so an EXACT
#     DECADE belongs to the LOWER SIL. A value within 1e-9 relative of a decade
#     IS the decade (DECADE_SNAP), because 0.1 x 0.1 x 0.1 / 1e-5 is not exactly
#     100 in IEEE double.
#   * OUTCOME STATES, NEVER A CLIPPED NUMBER: NO_SIF_REQUIRED,
#     RISK_REDUCTION_BELOW_SIL1, SIL1 to SIL3, BEYOND_SIL3_REDESIGN with the
#     required PFDavg intact. The required PFDavg is the BINDING target; the
#     band alone does not guarantee it.
#   * THE FULL ANNEX B FORM, with the simplified TR84 forms as its special case
#     at no detected failures and no MRT. 2oo2 carries NO beta factor term.
#   * THE SIF IS THE SERIES SUM of its subsystems.
#   * THE LONGEST INTERVAL has explicit states: FOUND, UNACHIEVABLE,
#     INTERVAL_INDEPENDENT, CAPPED_AT_LIFETIME.
#   * NOT HERE: no hardware fault tolerance (architectural constraint) check, no
#     high demand or continuous mode (PFH), no failure-rate data.
#
# NAMING COLLISIONS, legislated in the digest's vocabulary section before a word
# is written:
#   * bare "beta" already means a vapour fraction (fluid), an orifice diameter
#     ratio (metering) and more. Always "beta factor" here.
#   * bare "PFD" is always "PFDavg" for a SIF or a subsystem; an IPL's credited
#     figure is written "IPL PFD".
#   * bare "severity" already means a risk-matrix category (riskchange,
#     compliance) and more. LOPA is frequency based; the consequence is
#     described, never scored.
#   * "likelihood" already means a matrix likelihood score (riskchange) and a
#     Bayesian likelihood (decision). Here it appears only inside "tolerable
#     mitigated event likelihood", the TMEL, which is a frequency per year.
#   * "RRF" is the risk reduction factor, 1 over PFDavg, never a "risk
#     reduction ratio".
# ---------------------------------------------------------------------------
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


W = 'lp-worksheet'
B = 'lp-sif-builder'
P = 'lp-proof-test'
PANEL_IDS = [W, B, P]

TIERS = {
 'beginner': [
  ('m01-a-scenario-and-its-frequency', 'A Scenario and Its Frequency', [
    ('l01-what-lopa-answers', 'What a layer of protection analysis answers', 12, [W]),
    ('l02-one-cause-one-consequence', 'One cause, one consequence', 13, [W]),
    ('l03-the-initiating-event-frequency', 'The initiating event frequency', 13, [W]),
    ('l04-frequencies-per-year-and-probabilities', 'Frequencies per year and probabilities', 12, [W]),
    ('l05-the-refusals-by-name', 'The refusals, each naming its field', 14, [W]),
  ]),
  ('m02-enabling-conditions-and-modifiers', 'Enabling Conditions and Conditional Modifiers', [
    ('l01-an-enabling-condition', 'An enabling condition', 13, [W]),
    ('l02-conditional-modifiers', 'Conditional modifiers', 13, [W]),
    ('l03-the-unmitigated-frequency', 'The unmitigated frequency', 12, [W]),
    ('l04-forgetting-a-factor', 'Forgetting a factor, and what it costs', 14, [W]),
  ]),
  ('m03-independent-protection-layers', 'Independent Protection Layers', [
    ('l01-what-makes-a-layer-an-ipl', 'What makes a layer an IPL', 13, [W]),
    ('l02-credit-only-when-independent', 'Credit only when independent', 14, [W]),
    ('l03-one-credit-per-ipl', 'One credit per IPL', 12, [W]),
    ('l04-the-auditable-flag', 'The auditable flag', 12, [W]),
    ('l05-the-mitigated-frequency', 'The mitigated frequency without a SIF', 13, [W]),
  ]),
  ('m04-the-tolerable-frequency-and-the-gap', 'The Tolerable Frequency and the Gap', [
    ('l01-the-tmel', 'The tolerable mitigated event likelihood', 13, [W]),
    ('l02-the-required-risk-reduction-factor', 'The required risk reduction factor', 13, [W]),
    ('l03-the-required-pfdavg-is-the-binding-target', 'The required PFDavg is the binding target', 14, [W]),
    ('l04-closing-the-loop-with-a-sif', 'Closing the loop with a proposed SIF', 13, [W]),
  ]),
  ('m05-outcome-states-and-the-decade', 'Outcome States and the Exact Decade', [
    ('l01-six-outcome-states', 'Six outcome states', 13, [W]),
    ('l02-the-low-demand-bands', 'The low demand SIL bands', 12, [W]),
    ('l03-an-exact-decade-belongs-below', 'An exact decade belongs to the lower SIL', 14, [W]),
    ('l04-the-decade-snap', 'The decade snap, and why the engine needs it', 14, [W]),
  ]),
  ('m06-one-worksheet-end-to-end', 'One Worksheet, End to End', [
    ('l01-a-worksheet-row-by-row', 'A worksheet, row by row', 13, [W]),
    ('l02-beyond-sil-three', 'Beyond SIL three, a redesign', 13, [W]),
    ('l03-what-lopa-does-not-do', 'What LOPA does not do', 12, []),
    ('l04-the-capstone-brief', 'The capstone brief', 12, [W]),
  ]),
 ],
 'intermediate': [
  ('m01-pfdavg-and-the-simplified-forms', 'PFDavg and the Simplified Forms', [
    ('l01-what-pfdavg-averages', 'What PFDavg averages', 12, [B]),
    ('l02-dangerous-undetected-failures', 'Dangerous undetected failures', 13, [B]),
    ('l03-one-out-of-one-and-the-half', 'One out of one, and the half', 13, [B]),
    ('l04-the-redundant-simplified-forms', 'The redundant simplified forms', 14, [B]),
    ('l05-where-the-simplified-forms-stop', 'Where the simplified forms stop', 13, [B]),
  ]),
  ('m02-the-full-annex-b-form', 'The Full Annex B Form', [
    ('l01-detected-failures-and-the-mttr', 'Detected failures and the MTTR', 13, [B]),
    ('l02-the-channel-equivalent-down-time', 'The channel equivalent down time', 14, [B]),
    ('l03-the-group-equivalent-down-time', 'The group equivalent down time', 14, [B]),
    ('l04-mean-repair-time-after-a-test', 'Mean repair time after a proof test', 13, [B]),
    ('l05-imperfect-proof-test-coverage', 'Imperfect proof test coverage', 14, [B]),
  ]),
  ('m03-common-cause-and-the-beta-factor', 'Common Cause and the Beta Factor', [
    ('l01-one-cause-several-channels', 'One cause, several channels', 12, [B]),
    ('l02-the-beta-factor-on-both-failure-kinds', 'The beta factor on undetected and detected failures', 14, [B]),
    ('l03-when-common-cause-dominates', 'When common cause dominates', 14, [B]),
    ('l04-no-beta-factor-term-in-two-out-of-two', 'No beta factor term in two out of two', 13, [B]),
  ]),
  ('m04-the-architectures', 'The Architectures', [
    ('l01-one-out-of-two', 'One out of two', 13, [B]),
    ('l02-two-out-of-three-and-its-six', 'Two out of three and its six', 14, [B]),
    ('l03-one-out-of-three', 'One out of three', 13, [B]),
    ('l04-voting-for-availability', 'Voting for availability, and its price', 13, [B]),
  ]),
  ('m05-the-sif-is-a-sum', 'The SIF Is a Sum', [
    ('l01-sensor-logic-solver-final-element', 'Sensor, logic solver, final element', 12, [B]),
    ('l02-the-series-sum', 'The series sum', 13, [B]),
    ('l03-achieved-rrf-and-achieved-sil', 'Achieved RRF and achieved SIL', 13, [B, W]),
    ('l04-back-to-the-tmel', 'Back to the TMEL', 14, [B, W]),
  ]),
  ('m06-a-published-sif-reproduced', 'A Published SIF, Reproduced', [
    ('l01-the-worked-sif-subsystem-by-subsystem', 'The worked SIF, subsystem by subsystem', 13, [B]),
    ('l02-the-total-and-its-rrf', 'The total and its RRF', 13, [B]),
    ('l03-the-refusals-and-the-warnings', 'The refusals and the warnings', 13, [B]),
    ('l04-the-capstone-brief', 'The capstone brief', 12, [B]),
  ]),
 ],
 'advanced': [
  ('m01-the-proof-test-interval', 'The Proof Test Interval', [
    ('l01-pfdavg-grows-with-the-interval', 'PFDavg grows with the interval', 12, [P]),
    ('l02-the-sensitivity-table', 'The sensitivity table', 13, [P]),
    ('l03-linear-and-quadratic-growth', 'Linear and quadratic growth', 14, [P]),
    ('l04-the-longest-interval', 'The longest interval for a target', 13, [P]),
    ('l05-states-with-no-finite-answer', 'States with no finite answer', 13, [P]),
  ]),
  ('m02-imperfect-proof-testing', 'Imperfect Proof Testing', [
    ('l01-coverage-and-the-lifetime', 'Coverage and the lifetime', 13, [P]),
    ('l02-the-floor-no-interval-reaches', 'The floor no interval reaches', 14, [P]),
    ('l03-capped-at-the-lifetime', 'Capped at the lifetime', 12, [P]),
    ('l04-what-a-partial-test-buys', 'What a partial test buys', 13, [P]),
  ]),
  ('m03-how-conservative-annex-b-is', 'How Conservative Annex B Is', [
    ('l01-the-time-dependent-route', 'The time dependent route', 13, [P]),
    ('l02-where-the-forms-depart', 'Where the forms depart', 14, [P]),
    ('l03-the-rare-event-warning', 'The rare event warning and the refusal', 13, [P]),
    ('l04-two-out-of-two-and-common-cause', 'Two out of two and common cause', 12, [P, B]),
  ]),
  ('m04-the-published-example-and-its-inferences', 'The Published Example and Its Inferences', [
    ('l01-reproducing-a-printed-table', 'Reproducing a printed table', 13, [B]),
    ('l02-mrt-equal-to-the-mttr', 'MRT equal to the MTTR, inferred', 13, [B]),
    ('l03-the-lifetime-inferred', 'The lifetime, inferred from four rows', 14, [P]),
    ('l04-a-printing-slip-in-the-beta-factor', 'A printing slip in the beta factor', 13, [P]),
  ]),
  ('m05-what-the-engine-does-not-do', 'What the Engine Does Not Do', [
    ('l01-no-hardware-fault-tolerance-check', 'No hardware fault tolerance check', 13, []),
    ('l02-no-high-demand-mode', 'No high demand mode', 12, []),
    ('l03-no-failure-rate-data', 'No failure rate data, and no licensed tables', 13, []),
    ('l04-what-the-credit-rules-rest-on', 'What the credit rules rest on', 13, [W]),
  ]),
  ('m06-judgement-end-to-end', 'Judgement, End to End', [
    ('l01-allocating-a-budget', 'Allocating a PFDavg budget', 13, [P, B]),
    ('l02-stretching-an-interval', 'Stretching an interval', 14, [P, B]),
    ('l03-when-to-redesign', 'When to redesign', 13, [W, B]),
    ('l04-writing-the-verification-note', 'Writing the verification note', 13, [P, B]),
    ('l05-the-capstone-brief', 'The capstone brief', 12, [P, B]),
  ]),
 ],
}

TIER_NAMES = {'beginner': 'Associate', 'intermediate': 'Professional', 'advanced': 'Expert'}

# ---------------------------------------------------------------------------
# THE CHECKS THIS FILE RUNS ON ITSELF. `python3 structure.py` prints them;
# `python3 structure.py --modules` prints the module map h1_dump.mjs builds its
# section owner clauses from, and refuses to print if any check fails.
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
    for tier, t in titles:
        if re.search('[–—]', t):
            problems.append(f'{tier}: title carries a dash: {t}')
        if re.search(r',\s+not\s+\w', t):
            problems.append(f'{tier}: title carries a contrastive: {t}')
        if re.search(r'\d', t):
            problems.append(f'{tier}: title carries a digit, which is a measurement rather than a count: {t}')
        # the vocabulary rules, on titles
        if re.search(r'\bbeta\b(?!\s+factor)', t, re.I):
            problems.append(f'{tier}: bare beta in a title: {t}')
        if re.search(r'(?<!IPL )\bPFDs?\b', t):
            problems.append(f'{tier}: bare PFD in a title (PFDavg, or IPL PFD): {t}')
        if re.search(r'\bseverity\b', t, re.I):
            problems.append(f'{tier}: severity in a title (LOPA is frequency based): {t}')
        if re.search(r'\blikelihood\b', t, re.I) and not re.search(r'tolerable mitigated event likelihood', t, re.I):
            problems.append(f'{tier}: likelihood outside the TMEL in a title: {t}')
    # NO HISTORY: this engine has none, so nothing may read like it.
    for tier, mods in TIERS.items():
        for mkey, mtitle, lessons in mods:
            for k, t in [(mkey, mtitle)] + [(l[0], l[1]) for l in lessons]:
                if re.search(r'used-to|was-repaired|repair-history|no-longer', k) or \
                   re.search(r'\bused to\b|\bno longer\b|\bwas repaired\b', t, re.I):
                    problems.append(f'{tier}/{k}: reads as repair history, and this engine has none')
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
    own = {'beginner': W, 'intermediate': B, 'advanced': P}
    for tier, pid in own.items():
        n = sum(1 for r in rows if r[0] == tier and pid in r[8])
        if n < 13:
            problems.append(f'{tier}: its own panel {pid} is tagged on only {n} lessons')
    if not quiet:
        minutes = sorted({r[7] for r in rows})
        print(f'H3 lopa structure: {len(rows)} lessons, '
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
        print('  history modules: none (this engine has no repair history)')
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
