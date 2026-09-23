# D1 Oilfield Data Quality. Three tiers, six modules each, 26 lessons a tier.
# The first course of the academy's `data_ai` module (path_order 66).
#
# Engine: engines/dataai/quality.js, vendored sha-identical with
# petrolord-engines cc82bf3 (engines PR #248). It imports lib/stats (mean,
# median, the standard deviations), engines/petrophysics/conditioning.js
# (despikeHampel decides the Hampel flags), engines/hse/safetyStats.js
# (chiSquareQuantile, logGamma) and lib/linalg/solveDense.js. The vendoring
# closure walked from the jest suite is TWELVE paths: six reached by the walk
# and six NAMED with their reason (the golden and the library pins the suite
# reads through a spread helper, the stdlib oracle, the pin writer, FINDINGS
# and the negative control). vendor_dataqc.sh re-walks it.
#
# THE DIGEST IS THE ONLY TEACHING TRUTH. digest.txt, built by d1_dump.mjs. The
# engine's FINDINGS record, the oracle, the library pins and the engine's
# source comments are PROVENANCE. Where FINDINGS quotes a figure (the NIST
# worked examples and their errata) the digest recomputes it through the
# engine and prints it; a writer quotes the digest line.
#
# THE COURSE IN ONE SENTENCE. Data quality is a set of stated rules applied to
# a well log or a production series, every flag carrying the rule that fired
# and its reason, so the course teaches whether the data are there, valid,
# indexed, consistent and uniquely named (Associate), which values stand apart
# from the rest and by which measure (Professional), and whether the process
# that makes the data has changed, scored and written up as a policy (Expert).
#
# TIER OWNERSHIP, drawn along the engine's own dimensions (DIMENSIONS exports
# completeness, validity, consistency, uniqueness, plausibility):
#
#   Associate    IS THE DATA FIT TO USE. Completeness, gap runs and coverage;
#                definitional range limits, units never converted, rate
#                rules; the depth or time index; cumulatives, water cut on a
#                liquid basis, phase sums, frozen runs; identifiers after a
#                stated normalisation and the digit rule. Four of the five
#                dimensions. No outlier statistic.
#   Professional WHICH VALUES STAND APART. The plausibility dimension: the
#                z-score and its ceiling, the median and MAD with the modified
#                z-score, R6 R7 R8 quantiles and Tukey fences, the Hampel
#                window, Grubbs for one outlier, the Mahalanobis distance with
#                its chi-square cutoff.
#   Expert       HAS THE PROCESS CHANGED, AND WHAT IS THE POLICY. The
#                individuals and moving range chart, EWMA, the tabular CUSUM
#                (the NIST/SEMATECH worked examples), the scorecard, the
#                Petrolord defaults presented as choices, and the engine's
#                limits and the NIST printed-figure errata read honestly.
#
# A higher tier may USE a lower tier's checks (an Expert chart needs a
# complete series first), and each capstone grades only its own question.
#
# SCOPE SEAMS, recorded so no lesson re-teaches another course's material:
#   * the u-chart and the Poisson count model are OWNED BY H1 safetystats;
#     the charts here are for measured values (individuals, EWMA, CUSUM);
#   * regression fit quality is OWNED BY dca and the ML course (D2);
#   * Monte Carlo is OWNED BY the uncertainty course; nothing here samples;
#   * moving-average surveillance of rates is OWNED BY surveillance; EWMA here
#     is a control chart with limits from historical sigma, taught as NIST
#     6.3.2.4 states it.
#
# Panel ids: C the checks explorer (completeness, coverage, range, index,
# rates, consistency, identifiers), O the outliers explorer (z, modified z,
# fences, Hampel, Grubbs, Mahalanobis), M the monitor explorer (individuals,
# EWMA, CUSUM, scorecard). All three read ONE teaching lab, and every one
# takes a learner's own series, which is how a capstone is worked.
#
# Titles carry COUNTS only, never a MEASUREMENT, and counts are spelled in
# words: ANY DIGIT in a title fails the check below. No em dashes and no
# "X, not Y" contrastive anywhere a learner reads, headings and module titles
# included.
#
# THIS COURSE TEACHES NO REPAIR HISTORY. The engine's one repair after its first
# merge landed before any lesson was written, so there is no history module and no framed history
# section. The NIST printed-figure errata are errata in a PUBLISHED SOURCE,
# read against the engine, and are taught as such in Expert m06.
#
# NAMING COLLISIONS, legislated in the digest's vocabulary section:
#   * "outlier": a value a stated rule flags, never a value proven wrong; the
#     engine's own word is "potential outlier" for the modified z-score.
#   * "sigma": in this course a standard deviation estimate with its source
#     named (sample SD, MRbar / d2, 1.4826 x MAD, or historical); a bare sigma
#     in a lesson names which one.
#   * "control limit" is never a specification or a plausibility range.
#   * "missing" means null, undefined or NaN; a sentinel such as -999.25 is a
#     present value until someone converts it.
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


C = 'dq-checks-explorer'
O = 'dq-outliers-explorer'
M = 'dq-monitor-explorer'
PANEL_IDS = [C, O, M]

TIERS = {
 'beginner': [
  ('m01-what-data-quality-means', 'What Data Quality Means', [
    ('l01-a-rule-a-flag-and-a-reason', 'A rule, a flag and a reason', 12, [C]),
    ('l02-the-five-dimensions', 'The five dimensions the engine reports', 13, [C]),
    ('l03-what-missing-means', 'What missing means', 13, [C]),
    ('l04-the-sentinel-that-is-present', 'The sentinel that counts as present', 14, [C]),
    ('l05-the-refusals-by-name', 'The refusals, each naming its field', 13, [C]),
  ]),
  ('m02-is-it-there', 'Is It There', [
    ('l01-completeness-and-the-null-fraction', 'Completeness and the null fraction', 12, [C]),
    ('l02-gap-runs', 'Gap runs, one flag per run', 13, [C]),
    ('l03-coverage-of-an-interval', 'Coverage of an interval', 14, [C]),
    ('l04-a-step-too-long-is-a-hole', 'A step too long is a hole', 13, [C]),
  ]),
  ('m03-is-it-valid', 'Is It Valid', [
    ('l01-definitional-limits', 'Definitional limits and nothing more', 13, [C]),
    ('l02-plausibility-ranges-are-yours', 'Plausibility ranges are yours to supply', 13, [C]),
    ('l03-units-are-never-converted', 'Units are never converted', 12, [C]),
    ('l04-a-fraction-written-in-percent', 'A fraction written in percent', 13, [C]),
    ('l05-negative-rates-and-rates-while-shut-in', 'Negative rates and rates while shut in', 14, [C]),
  ]),
  ('m04-the-depth-and-time-index', 'The Depth and Time Index', [
    ('l01-a-duplicate-is-any-earlier-value', 'A duplicate is any earlier value', 12, [C]),
    ('l02-reversals', 'Reversals against the stated direction', 13, [C]),
    ('l03-the-expected-step', 'The expected step, inferred or stated', 14, [C]),
    ('l04-irregular-steps', 'Irregular steps and their tolerance', 13, [C]),
  ]),
  ('m05-does-it-agree-with-itself', 'Does It Agree with Itself', [
    ('l01-a-cumulative-never-falls', 'A cumulative never falls', 13, [C]),
    ('l02-water-cut-on-a-liquid-basis', 'Water cut on a liquid basis', 13, [C]),
    ('l03-parts-that-add-to-a-total', 'Parts that add to a total', 14, [C]),
    ('l04-frozen-values', 'Frozen values and a slow drift', 13, [C]),
  ]),
  ('m06-names-and-one-dataset', 'Names, and One Dataset End to End', [
    ('l01-normalising-an-identifier', 'Normalising an identifier', 13, [C]),
    ('l02-near-duplicates-and-the-digit-rule', 'Near duplicates and the digit rule', 14, [C]),
    ('l03-one-dataset-every-check', 'One dataset, every check', 13, [C]),
    ('l04-the-capstone-brief', 'The capstone brief', 12, [C]),
  ]),
 ],
 'intermediate': [
  ('m01-the-z-score-and-its-ceiling', 'The z-Score and Its Ceiling', [
    ('l01-a-distance-in-standard-deviations', 'A distance in standard deviations', 12, [O]),
    ('l02-sample-or-population', 'Sample or population standard deviation', 13, [O]),
    ('l03-the-largest-possible-z', 'The largest possible z', 14, [O]),
    ('l04-one-outlier-inflates-the-spread', 'One outlier inflates the spread', 13, [O]),
  ]),
  ('m02-the-median-and-the-mad', 'The Median and the MAD', [
    ('l01-a-centre-outliers-barely-move', 'A centre that outliers barely move', 12, [O]),
    ('l02-the-median-absolute-deviation', 'The median absolute deviation', 13, [O]),
    ('l03-the-modified-z-score', 'The modified z-score', 14, [O]),
    ('l04-the-printed-constant', 'The printed constant and its reciprocal', 13, [O]),
    ('l05-when-the-mad-is-zero', 'When the MAD is zero', 12, [O]),
  ]),
  ('m03-quartiles-and-fences', 'Quartiles and Tukey Fences', [
    ('l01-three-quantile-rules', 'Three quantile rules', 14, [O]),
    ('l02-the-inner-fences', 'The inner fences', 13, [O]),
    ('l03-far-out-values', 'Far out values and the outer fences', 12, [O]),
    ('l04-on-the-fence-is-inside', 'On the fence is inside', 12, [O]),
  ]),
  ('m04-a-moving-window', 'A Moving Window', [
    ('l01-local-against-global', 'Local against global', 13, [O]),
    ('l02-the-hampel-window', 'The Hampel window', 14, [O]),
    ('l03-edges-gaps-and-thin-windows', 'Edges, gaps and windows too thin to judge', 13, [O]),
    ('l04-flag-or-replace', 'Flag or replace', 13, [O]),
  ]),
  ('m05-formal-tests-and-many-variables', 'Formal Tests and Many Variables', [
    ('l01-grubbs-for-one-outlier', 'Grubbs for one outlier', 14, [O]),
    ('l02-the-critical-value', 'The critical value from the t distribution', 14, [O]),
    ('l03-masking', 'Masking', 13, [O]),
    ('l04-the-mahalanobis-distance', 'The Mahalanobis distance', 14, [O]),
    ('l05-the-chi-square-cutoff', 'The chi-square cutoff and its limits', 13, [O]),
  ]),
  ('m06-outliers-in-a-report', 'Outliers in a Report', [
    ('l01-the-nist-worked-examples', 'The NIST worked examples', 12, [O]),
    ('l02-which-method-for-which-question', 'Which method for which question', 13, [O]),
    ('l03-a-flag-is-a-question', 'A flag is a question', 13, [O]),
    ('l04-the-capstone-brief', 'The capstone brief', 12, [O]),
  ]),
 ],
 'advanced': [
  ('m01-the-individuals-chart', 'The Individuals Chart', [
    ('l01-a-process-that-makes-data', 'A process that makes data', 12, [M]),
    ('l02-the-moving-range', 'The moving range', 13, [M]),
    ('l03-limits-from-the-moving-range', 'Limits from the moving range', 14, [M]),
    ('l04-the-moving-range-chart', 'The moving range chart', 13, [M]),
    ('l05-a-standard-or-the-data', 'A standard or the data', 13, [M]),
  ]),
  ('m02-the-ewma-chart', 'The EWMA Chart', [
    ('l01-a-weighted-memory', 'A weighted memory', 13, [M]),
    ('l02-target-and-sigma-from-history', 'Target and sigma from history', 14, [M]),
    ('l03-asymptotic-and-exact-limits', 'Asymptotic and exact limits', 13, [M]),
    ('l04-choosing-lambda', 'Choosing lambda', 12, [M]),
  ]),
  ('m03-the-tabular-cusum', 'The Tabular CUSUM', [
    ('l01-accumulating-small-shifts', 'Accumulating small shifts', 13, [M]),
    ('l02-k-and-h-in-stated-units', 'The reference value and the decision interval', 14, [M]),
    ('l03-no-reset-after-a-signal', 'No reset after a signal', 12, [M]),
    ('l04-the-nist-table-and-its-design', 'The NIST table and its design', 13, [M]),
    ('l05-which-chart-sees-what', 'Which chart sees what', 14, [M, O]),
  ]),
  ('m04-the-scorecard', 'The Scorecard', [
    ('l01-a-score-per-dimension', 'A score per dimension', 12, [M, C]),
    ('l02-weights-and-their-normalisation', 'Weights and their normalisation', 13, [M]),
    ('l03-the-weakest-dimension', 'The weakest dimension', 13, [M]),
    ('l04-why-there-are-no-grade-bands', 'Why there are no grade bands', 12, [M]),
  ]),
  ('m05-designing-a-qc-policy', 'Designing a QC Policy', [
    ('l01-the-order-of-checks', 'The order of checks', 13, [C, M]),
    ('l02-defaults-are-choices', 'Defaults are choices', 14, [C]),
    ('l03-flag-fix-or-refuse', 'Flag, fix or refuse', 13, [C, O]),
    ('l04-writing-the-policy', 'Writing the policy', 13, [M]),
  ]),
  ('m06-reading-the-engine-honestly', 'Reading the Engine Honestly', [
    ('l01-printed-figures-and-their-errata', 'Printed figures and their errata', 14, [M]),
    ('l02-what-is-not-built', 'What is not built', 13, [O]),
    ('l03-writing-the-quality-note', 'Writing the quality note', 13, [M, C]),
    ('l04-the-capstone-brief', 'The capstone brief', 12, [M]),
  ]),
 ],
}

TIER_NAMES = {'beginner': 'Associate', 'intermediate': 'Professional', 'advanced': 'Expert'}

# ---------------------------------------------------------------------------
# THE CHECKS THIS FILE RUNS ON ITSELF. `python3 structure.py` prints them;
# `python3 structure.py --modules` prints the module map d1_dump.mjs builds its
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
        if re.search(r',\s+not\s+\w', t):
            problems.append(f'{tier}: title carries a contrastive: {t}')
        if re.search(r'\d', t):
            problems.append(f'{tier}: title carries a digit, which is a measurement rather than a count: {t}')
        if re.search(r'\bAI\b|AI-powered|artificial intelligence', t, re.I):
            problems.append(f'{tier}: title claims AI, and this course is statistics: {t}')
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
    own = {'beginner': C, 'intermediate': O, 'advanced': M}
    for tier, pid in own.items():
        n = sum(1 for r in rows if r[0] == tier and pid in r[8])
        if n < 13:
            problems.append(f'{tier}: its own panel {pid} is tagged on only {n} lessons')
    # NO FORWARD PANEL: a lower tier never tags a higher tier's panel.
    rank = {C: 0, O: 1, M: 2}
    trank = {'beginner': 0, 'intermediate': 1, 'advanced': 2}
    for r in rows:
        for pid in r[8]:
            if rank[pid] > trank[r[0]]:
                problems.append(f'{r[0]}/{r[5]} tags the higher tier panel {pid}')
    if not quiet:
        minutes = sorted({r[7] for r in rows})
        print(f'D1 dataqc structure: {len(rows)} lessons, '
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
