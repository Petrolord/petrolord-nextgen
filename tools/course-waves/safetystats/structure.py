# H1 Safety Performance Statistics & KPIs. Three tiers, six modules each, 26
# lessons a tier. The first course of the academy's `hse` module (path_order 61).
#
# Engine: engines/hse/safetyStats.js, vendored sha-identical with
# petrolord-engines 980199e (engines PR #216, re-vendored after #222). It imports nothing, so the
# vendoring closure walked from the jest suite is SIX paths: three reached by the
# walk (the suite, the engine, the golden it reads) and three NAMED with their
# reason (the scipy/mpmath oracle, the FINDINGS record, the negative-control
# script). vendor_safetystats.sh re-walks it; a later engine change will grow it.
#
# THE DIGEST IS THE ONLY TEACHING TRUTH. digest.txt, built by h1_dump.mjs. The
# engine's FINDINGS record, the oracle and the engine's source comments are
# PROVENANCE. Where FINDINGS quotes a figure (the IOGP five-year FAR, the Garwood
# table) the digest recomputes it through the engine and prints it; a writer
# quotes the digest line and never the FINDINGS line.
#
# TIER OWNERSHIP, and why it is drawn here. Each tier owns one question about a
# safety statistic, and its capstone grades only that question, so no tier's
# lessons can hand out another tier's graded answer:
#
#   Associate    WHAT IS THE RATE. Counts over exposure hours on a NAMED base
#                (200,000 OSHA/BLS, 1,000,000 IOGP, 100,000,000 FAR), TRIR, DART,
#                LTIR, FAR, the severity rate, the API RP 754 PSE rate with the
#                tier as an input, sum then divide, and the rolling rate.
#   Professional HOW SURE ARE WE. The Poisson count model, the Garwood exact
#                interval, zero events, comparing two rates by the conditional
#                exact test, and the central p-value against the minlike one.
#   Expert       IS ANYTHING CHANGING, AND WHAT DO WE DO ABOUT IT. The u-chart
#                with varying exposure, signals and what they do and do not mean,
#                revising limits, before-and-after comparisons, benchmarking
#                against IOGP published figures, and the traps.
#
# A higher tier may USE a lower tier's arithmetic (an Expert comparison is a
# Professional test), and the capstone of each tier grades its own question.
#
# Panel ids: R the rates explorer (a rate on any named base, pooling, the rolling
# window), I the intervals explorer (Garwood limits, zero events, comparing two
# rates), U the u-chart monitor (centre, limits, signals, a revised chart, the
# before-and-after test). All three read ONE teaching lab, and every one takes
# a learner's own counts and hours, which is how a capstone is worked.
#
# Titles carry COUNTS only, never a MEASUREMENT, and counts are spelled in words:
# ANY DIGIT in a title fails the check below. No em dashes and no "X, not Y"
# contrastive anywhere a learner reads, headings and module titles included.
#
# THIS ENGINE HAS NO REPAIR HISTORY. It was written, oracle-gated and merged in
# one pull request, so there is no history module and no framed history section
# in the digest. A sentence about former behaviour anywhere in these 78 lessons
# is a defect, and the check below refuses any module or lesson key or title
# that reads like one.
#
# ---------------------------------------------------------------------------
# THE ENGINE'S DECLARED CHOICES, WHICH THE LESSONS MUST TEACH BY NAME
#
#   * The BASE IS REQUIRED on every rate except FAR, and a missing base is
#     refused by name. There is no default, because OSHA TRIR and IOGP TRIR share
#     three letters and differ by a factor of five.
#   * The SEVERITY RATE HAS NO SINGLE STANDARD. The engine takes days lost and a
#     base and adds no ANSI Z16.1 time charges. IOGP's LWDC severity is days per
#     case, a different quantity.
#   * The API RP 754 TIER IS AN INPUT. Classification needs threshold tables
#     that are licensed, so the engine does not classify, and the PSE rate takes
#     only the 200,000 or the 1,000,000 base.
#   * SUM THEN DIVIDE for every pooled and rolling rate, with the mean of the
#     period rates returned BESIDE it and labelled.
#   * The CENTRAL two-sided p-value (twice the smaller tail, capped at one), so
#     the p-value agrees with the engine's own rate-ratio interval. R's
#     poisson.test and scipy's binomtest use the minlike convention and can
#     disagree with it.
#   * A u-chart point SIGNALS ONLY STRICTLY OUTSIDE its limits; the lower limit
#     is floored at zero and flagged.
#
# AND THE REFUSALS, each by the field it names: count, exposureHours, base,
# confidence, daysLost, tier, counts, windowPeriods, the both-groups-empty
# comparison, a u-chart point with no hours and a chart with no events.
#
# NAMING COLLISIONS, legislated in digest SECTION 28 before a word is written:
#   * bare "Poisson" already means POISSON'S RATIO across geomech, rockphysics,
#     porepressure, casingtubing, stimulation and perfsand. Always "Poisson
#     distribution" or "Poisson count model".
#   * bare "severity" already means a consequence CATEGORY in riskchange and
#     compliance and an exception LEVEL in surveillance. Always "severity rate".
#   * "confidence interval" here is an interval on an ESTIMATED RATE. It is never
#     a P10/P90 range of outcomes, and no P label is ever used in this course.
#   * "FAR" will also be taught by H5 (QRA) as a PREDICTED rate; here it is an
#     OBSERVED one. Always "observed FAR" where the difference could matter.
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


R = 'ss-rates-explorer'
I = 'ss-intervals-explorer'
U = 'ss-uchart-explorer'
PANEL_IDS = [R, I, U]

TIERS = {
 'beginner': [
  ('m01-a-rate-is-a-count-over-exposure', 'A Rate Is a Count over Exposure', [
    ('l01-a-count-over-an-exposure', 'A count over an exposure', 12, [R]),
    ('l02-why-hours-and-never-headcount', 'Why hours and never headcount', 13, [R]),
    ('l03-the-base-is-required', 'The base is required, and there is no default', 13, [R]),
    ('l04-where-the-osha-base-comes-from', 'Where the OSHA base comes from', 12, []),
    ('l05-the-refusals-by-name', 'The refusals, each naming its field', 14, [R]),
  ]),
  ('m02-one-name-several-numbers', 'One Name, Several Numbers', [
    ('l01-trir-on-the-osha-base', 'TRIR on the OSHA base', 12, [R]),
    ('l02-dart-and-lost-time-cases', 'DART and lost time cases', 13, [R]),
    ('l03-the-iogp-million-hour-base', 'The IOGP million hour base', 13, [R]),
    ('l04-same-letters-a-factor-of-five', 'Same letters, a factor of five', 14, [R]),
  ]),
  ('m03-fatal-severity-and-process-safety', 'Three More Rates: FAR, Severity Rate, PSE Rate', [
    ('l01-the-fatal-accident-rate', 'The fatal accident rate', 12, [R]),
    ('l02-why-far-alone-has-a-fixed-base', 'Why FAR alone has a fixed base', 13, [R]),
    ('l03-the-severity-rate-has-no-single-standard', 'The severity rate has no single standard', 14, [R]),
    ('l04-days-per-hour-and-days-per-case', 'Days per hour and days per case', 13, [R]),
    ('l05-the-process-safety-event-rate', 'The process safety event rate', 14, [R]),
  ]),
  ('m04-sum-then-divide', 'Sum, Then Divide', [
    ('l01-pooling-sites', 'Pooling sites and workforces', 13, [R]),
    ('l02-the-mean-of-rates-is-another-number', 'The mean of rates is another number', 14, [R]),
    ('l03-a-period-with-no-hours', 'A period with no hours', 12, [R]),
    ('l04-events-with-no-hours-are-refused', 'Events with no hours are refused', 12, [R]),
  ]),
  ('m05-the-rolling-rate', 'The Rolling Rate', [
    ('l01-a-trailing-window', 'A trailing twelve month window', 13, [R]),
    ('l02-one-entry-per-complete-window', 'One entry per complete window', 12, [R]),
    ('l03-a-short-month-and-a-large-monthly-rate', 'A short month and a large monthly rate', 14, [R]),
    ('l04-the-iogp-five-year-rule', 'The IOGP five year rule', 13, [R]),
  ]),
  ('m06-one-report-end-to-end', 'One Report, End to End', [
    ('l01-the-bls-worked-example', 'The BLS worked example', 12, [R]),
    ('l02-the-iogp-published-figures', 'The IOGP published figures', 13, [R]),
    ('l03-what-the-basis-block-says', 'What the basis block tells you', 13, [R]),
    ('l04-the-capstone-brief', 'The capstone brief', 12, [R]),
  ]),
 ],
 'intermediate': [
  ('m01-a-count-is-a-draw', 'A Count Is a Draw', [
    ('l01-the-poisson-count-model', 'The Poisson count model', 13, [I]),
    ('l02-what-an-observed-rate-estimates', 'What an observed rate estimates', 12, [I]),
    ('l03-small-exposure-and-wide-swings', 'Small exposure and wide swings', 14, [I]),
    ('l04-a-rate-with-no-interval', 'A rate with no interval beside it', 12, [I]),
  ]),
  ('m02-the-exact-interval', 'The Garwood Exact Interval', [
    ('l01-limits-from-the-chi-square-distribution', 'Limits from the chi-square distribution', 14, [I]),
    ('l02-half-the-miss-in-each-tail', 'Half the miss in each tail', 13, [I]),
    ('l03-conservative-by-construction', 'Conservative by construction', 14, [I]),
    ('l04-confidence-is-a-required-fraction', 'Confidence is a required fraction', 12, [I]),
    ('l05-the-upper-tail-solved-directly', 'The upper tail, solved directly', 13, [I]),
  ]),
  ('m03-zero-events', 'Zero Events', [
    ('l01-zero-events-is-a-measurement', 'Zero events is still a measurement', 12, [I]),
    ('l02-the-upper-limit-at-zero', 'The upper limit at zero', 13, [I]),
    ('l03-the-rule-of-three-and-where-it-differs', 'The rule of three, and where it differs', 14, [I]),
    ('l04-how-much-exposure-it-takes', 'How much exposure it takes to say anything', 13, [I]),
  ]),
  ('m04-comparing-two-rates', 'Comparing Two Rates', [
    ('l01-conditioning-on-the-total-count', 'Conditioning on the total count', 13, [I]),
    ('l02-the-expected-proportion-from-the-hours', 'The expected proportion from the hours', 13, [I]),
    ('l03-the-rate-ratio-and-its-interval', 'The rate ratio and its interval', 14, [I]),
    ('l04-when-one-group-has-no-events', 'When one group has no events', 13, [I]),
    ('l05-both-groups-empty-is-refused', 'Both groups empty is refused', 12, [I]),
  ]),
  ('m05-the-p-value-and-its-convention', 'The p-Value and Its Convention', [
    ('l01-the-central-two-sided-p-value', 'The central two-sided p-value', 13, [I]),
    ('l02-the-minlike-convention', 'The minlike convention, and why it can disagree', 14, [I]),
    ('l03-the-p-value-and-the-interval-agree', 'The p-value and the interval agree', 13, [I]),
    ('l04-no-difference-found-is-a-weak-claim', 'No difference found is a weak claim', 13, [I]),
  ]),
  ('m06-intervals-in-a-report', 'Intervals in a Report', [
    ('l01-the-bls-case-with-its-interval', 'The BLS case with its interval', 12, [I]),
    ('l02-the-iogp-far-with-its-interval', 'The IOGP fatal accident rate with its interval', 13, [I]),
    ('l03-writing-a-rate-with-its-uncertainty', 'Writing a rate with its uncertainty', 13, [I]),
    ('l04-the-capstone-brief', 'The capstone brief', 12, [I]),
  ]),
 ],
 'advanced': [
  ('m01-the-u-chart', 'The u-Chart', [
    ('l01-exposure-units-on-the-chosen-base', 'Exposure units on the chosen base', 12, [U]),
    ('l02-the-centre-line-is-pooled', 'The centre line is pooled', 13, [U]),
    ('l03-limits-that-move-with-exposure', 'Limits that move with exposure', 14, [U]),
    ('l04-the-lower-limit-floored-at-zero', 'The lower limit floored at zero', 13, [U]),
    ('l05-two-charts-the-engine-will-not-draw', 'Two charts the engine will not draw', 12, [U]),
  ]),
  ('m02-signals', 'Signals', [
    ('l01-strictly-outside-its-limits', 'A signal lies strictly outside its limits', 12, [U]),
    ('l02-three-sigma-and-what-a-band-costs', 'Three sigma, and what a band costs', 14, [U]),
    ('l03-a-low-point-that-signals', 'A low point that signals', 13, [U]),
    ('l04-small-exposure-and-wide-limits', 'Small exposure and wide limits', 13, [U]),
  ]),
  ('m03-what-a-signal-means', 'What a Signal Means', [
    ('l01-a-signal-asks-a-question', 'A signal asks a question', 12, [U]),
    ('l02-revising-the-limits-after-a-found-cause', 'Revising the limits after a found cause', 14, [U]),
    ('l03-no-signal-is-a-weak-reassurance', 'No signal is a weak reassurance', 13, [U]),
    ('l04-before-and-after-an-intervention', 'Before and after an intervention', 14, [U, I]),
  ]),
  ('m04-benchmarking', 'Benchmarking', [
    ('l01-reading-the-iogp-published-rates', 'Reading the IOGP published rates', 13, [R]),
    ('l02-same-base-and-same-definition-first', 'Same base and same definition first', 13, [R]),
    ('l03-a-benchmark-is-a-population-figure', 'A benchmark is a population figure', 14, [I]),
    ('l04-the-five-year-view', 'The five year view', 12, [R]),
  ]),
  ('m05-the-traps', 'The Traps', [
    ('l01-denominators-that-move', 'Denominators that move', 13, [R]),
    ('l02-contractor-events-and-contractor-hours', 'Contractor events and contractor hours', 13, [R]),
    ('l03-reclassification', 'Reclassification lowers a rate and leaves the harm', 14, [R]),
    ('l04-rate-chasing', 'Rate chasing and the month after the worst', 14, [U, I]),
    ('l05-the-mean-of-rates-one-level-up', 'The mean of rates, one level up', 12, [R]),
  ]),
  ('m06-judgement-end-to-end', 'Judgement, End to End', [
    ('l01-a-year-on-one-chart', 'A year on one chart', 13, [U]),
    ('l02-what-the-engine-does-not-classify', 'What the engine does not classify', 13, []),
    ('l03-writing-the-monitoring-note', 'Writing the monitoring note', 13, [U, I]),
    ('l04-the-capstone-brief', 'The capstone brief', 12, [U, I]),
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
        if re.search(r'\bPoisson\b(?!\s+(count model|distribution))', t):
            problems.append(f'{tier}: bare Poisson in a title: {t}')
        if re.search(r'\bseverity\b(?!\s+rate)', t, re.I):
            problems.append(f'{tier}: bare severity in a title: {t}')
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
    own = {'beginner': R, 'intermediate': I, 'advanced': U}
    for tier, pid in own.items():
        n = sum(1 for r in rows if r[0] == tier and pid in r[8])
        if n < 13:
            problems.append(f'{tier}: its own panel {pid} is tagged on only {n} lessons')
    if not quiet:
        minutes = sorted({r[7] for r in rows})
        print(f'H1 safetystats structure: {len(rows)} lessons, '
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
