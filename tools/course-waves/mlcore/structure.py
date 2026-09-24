# D2 Machine Learning on Well Data. Three tiers, six modules each, 26 lessons
# a tier. The second course of the academy's `data_ai` module (path_order 67).
#
# Engine: engines/dataai/ml.js, vendored sha-identical with petrolord-engines
# 966bb9e (engines PR #252). It imports lib/stats (mulberry32, mean) and
# lib/lp/simplex.js (the separation linear programmes). The vendoring closure
# walked from the jest suite is TWENTY-THREE paths: five reached by the walk
# (the suite, ml.js, lib/stats/stats.js, lib/lp/simplex.js and the synthetic
# wells helper) and eighteen NAMED with their reason (the golden and the
# library pins the suite reads through a spread helper, the eleven NIST StRD
# source files the oracle parses, the stdlib oracle, the pin writer, the timing
# script, FINDINGS and the negative control). vendor_mlcore.sh re-walks it.
#
# THE DIGEST IS THE ONLY TEACHING TRUTH. digest.txt, built by d2_dump.mjs. The
# engine's FINDINGS record, the oracle, the library pins and the engine's
# source comments are PROVENANCE. Where FINDINGS quotes a figure (the NIST
# certified values and the digits reached) the digest recomputes it through
# the engine and prints it; a writer quotes the digest line.
#
# THE COURSE IN ONE SENTENCE. A model is a rule fitted to some wells and judged
# on wells it has never seen, so the course teaches how to split by whole
# wells, scale on the training rows, fit least squares and read what it
# returns (Associate), how to penalise, cross-validate by wells, catch leakage
# and score a classifier (Professional), and when the engine refuses, stops or
# extrapolates, and how to write a prediction back honestly (Expert).
#
# TIER OWNERSHIP, drawn along the engine's own sections:
#
#   Associate    A MODEL AND ITS TEST. Features and a target; why test data
#                must be unseen; random-row and whole-well splits, the seed
#                and the shuffle; scaling fitted on the training rows; OLS
#                with its coefficients, standard errors and fit metrics;
#                residuals by well. No penalty, no classifier, no k-fold.
#   Professional VALIDATING A MODEL. Ridge and the bias-variance trade;
#                k-fold by wells; leakage, and that a random split does not
#                always flatter; logistic regression on a stated pay rule;
#                the confusion matrix, precision, recall and F1; ROC, AUC
#                and log loss.
#   Expert       WHEN THE ENGINE REFUSES, STOPS OR EXTRAPOLATES. Conditioning
#                and the NIST reference problems (Filip refused, what digits
#                mean); separation and its exact test; convergence and its
#                stated rule; permutation importance and learning curves;
#                missing-log prediction end to end and writing it back.
#
# A higher tier may USE a lower tier's methods (an Expert importance needs a
# fitted OLS), and each capstone grades only its own question.
#
# SCOPE SEAMS, recorded so no lesson re-teaches another course's material:
#   * regression FIT QUALITY of a decline or a well test (type-curve match,
#     Arps parameter uncertainty) is OWNED BY dca and welltest; the metrics
#     here score predictions on held-out wells;
#   * Monte Carlo and uncertainty propagation are OWNED BY the uncertainty
#     course; nothing here samples an input distribution (the only random
#     draws are the seeded shuffles);
#   * outlier statistics (z, modified z, fences, Hampel, Grubbs, Mahalanobis)
#     are OWNED BY D1 dataqc; this course takes clean data as its input and
#     names D1 where a cleaning step belongs;
#   * clustering and electrofacies are OWNED BY D3 facies; forecasting a rate
#     series is OWNED BY D4 forecastml.
#
# Panel ids: F the fit explorer (splits, the shuffle, scaling, OLS, metrics,
# residuals), V the validate explorer (ridge, k-fold, leakage, logistic, the
# confusion matrix, ROC and log loss), D the diagnose explorer (conditioning,
# separation, convergence, importance, learning curve, the missing log). All
# three read ONE teaching lab, and every one takes a learner's own rows, which
# is how a capstone is worked.
#
# Titles carry COUNTS only, never a MEASUREMENT, and counts are spelled in
# words: ANY DIGIT in a title fails the check below. No em dashes and no
# "X, not Y" contrastive anywhere a learner reads, headings and module titles
# included.
#
# THIS COURSE TEACHES NO REPAIR HISTORY. The engine's lead-review changes
# (the dual separation LPs, solveSPD, the spread-free min and max) landed
# before its merge and before any lesson was written, so there is no history
# module and no framed history section.
#
# NAMING COLLISIONS, legislated in the digest's vocabulary section:
#   * "test" means rows the model was NOT fitted on, and in this course a
#     whole well held out unless the text names a random-row split;
#   * "standard deviation" names its divisor: the scaler uses the population
#     SD (n) where D1's z-score uses the sample SD (n - 1);
#   * "R-squared" names its reference mean: the training fit's own mean, or
#     the test rows' mean (the engine's default for a test score);
#   * "separation" is the logistic property; a group split is a split;
#   * "machine learning" names the fitted statistical model; no lesson calls
#     a model artificial intelligence.
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


F = 'ml-fit-explorer'
V = 'ml-validate-explorer'
D = 'ml-diagnose-explorer'
PANEL_IDS = [F, V, D]

TIERS = {
 'beginner': [
  ('m01-what-a-model-is', 'What a Model Is', [
    ('l01-a-rule-fitted-to-data', 'A rule fitted to data', 12, [F]),
    ('l02-features-and-a-target', 'Features and a target', 13, [F]),
    ('l03-the-ekene-wells', 'The Ekene wells and their logs', 13, [F]),
    ('l04-what-a-prediction-is', 'What a prediction is', 14, [F]),
    ('l05-the-refusals-by-name', 'The refusals, each naming its field', 13, [F]),
  ]),
  ('m02-data-the-model-has-not-seen', 'Data the Model Has Not Seen', [
    ('l01-why-test-data-must-be-unseen', 'Why test data must be unseen', 12, [F]),
    ('l02-a-split-by-rows', 'A split by rows', 13, [F]),
    ('l03-a-split-by-whole-wells', 'A split by whole wells', 14, [F]),
    ('l04-the-seed-and-the-shuffle', 'The seed and the shuffle', 13, [F]),
  ]),
  ('m03-scaling-on-the-training-rows', 'Scaling on the Training Rows', [
    ('l01-why-features-are-scaled', 'Why features are scaled', 12, [F]),
    ('l02-the-population-standard-deviation', 'Standardising with the population standard deviation', 13, [F]),
    ('l03-fit-on-training-rows-only', 'Fit on the training rows only', 14, [F]),
    ('l04-min-max-and-rows-outside-the-range', 'Min-max scaling and rows outside the range', 13, [F]),
  ]),
  ('m04-ordinary-least-squares', 'Ordinary Least Squares', [
    ('l01-least-squares-on-several-features', 'Least squares on several features', 13, [F]),
    ('l02-reading-a-coefficient', 'Reading a coefficient and its unit', 14, [F]),
    ('l03-the-intercept', 'The intercept', 12, [F]),
    ('l04-standard-errors', 'Standard errors and residual degrees of freedom', 14, [F]),
    ('l05-more-rows-than-coefficients', 'More rows than coefficients', 12, [F]),
  ]),
  ('m05-fit-metrics-and-residuals', 'Fit Metrics and Residuals', [
    ('l01-rmse-and-mae', 'RMSE and MAE', 13, [F]),
    ('l02-r-squared-on-a-test-set', 'R-squared on a test set', 14, [F]),
    ('l03-residuals-by-well', 'Residuals, well by well', 14, [F]),
    ('l04-training-score-and-test-score', 'Training score and test score', 13, [F]),
  ]),
  ('m06-one-well-held-out', 'One Well Held Out, End to End', [
    ('l01-the-whole-workflow', 'The whole workflow in order', 13, [F]),
    ('l02-a-well-the-model-never-saw', 'A well the model never saw', 14, [F]),
    ('l03-writing-up-a-fit', 'Writing up a fit', 13, [F]),
    ('l04-the-capstone-brief', 'The capstone brief', 12, [F]),
  ]),
 ],
 'intermediate': [
  ('m01-ridge-and-the-bias-variance-trade', 'Ridge and the Bias-Variance Trade', [
    ('l01-a-penalty-on-the-coefficients', 'A penalty on the coefficients', 12, [V]),
    ('l02-standardised-and-original-units', 'Standardised and original units', 13, [V]),
    ('l03-an-unpenalised-intercept', 'An unpenalised intercept', 12, [V]),
    ('l04-effective-degrees-of-freedom', 'Effective degrees of freedom', 14, [V]),
    ('l05-bias-and-variance', 'Bias and variance as lambda grows', 14, [V]),
  ]),
  ('m02-k-fold-by-wells', 'Cross-Validation by Wells', [
    ('l01-every-well-tested-once', 'Every well tested once', 12, [V]),
    ('l02-round-robin-folds', 'Round robin folds and their sizes', 13, [V]),
    ('l03-leave-one-well-out', 'Leave one well out', 13, [V]),
    ('l04-choosing-lambda-by-wells', 'Choosing lambda by wells', 14, [V]),
  ]),
  ('m03-leakage', 'Leakage', [
    ('l01-what-leakage-is', 'What leakage is', 12, [V]),
    ('l02-features-that-name-a-well', 'Features that name a well', 14, [V]),
    ('l03-the-optimism-of-a-random-split', 'The optimism of a random split', 13, [V]),
    ('l04-when-a-random-split-flatters-nothing', 'When a random split flatters nothing', 14, [V]),
    ('l05-scaling-can-leak-too', 'Scaling can leak too', 12, [V]),
  ]),
  ('m04-logistic-regression', 'Logistic Regression', [
    ('l01-a-label-from-a-stated-rule', 'A label from a stated rule', 13, [V]),
    ('l02-probabilities-and-log-odds', 'Probabilities and log odds', 14, [V]),
    ('l03-reading-the-fitted-coefficients', 'Reading the fitted coefficients', 13, [V]),
    ('l04-the-threshold-at-one-half', 'The threshold at one half', 12, [V]),
  ]),
  ('m05-the-confusion-matrix', 'The Confusion Matrix and Its Ratios', [
    ('l01-rows-true-columns-predicted', 'Rows true, columns predicted', 12, [V]),
    ('l02-precision-and-recall', 'Precision and recall', 13, [V]),
    ('l03-the-harmonic-mean-and-its-averages', 'The harmonic mean, macro and weighted', 14, [V]),
    ('l04-a-zero-denominator', 'A zero denominator', 13, [V]),
  ]),
  ('m06-roc-auc-and-log-loss', 'ROC, AUC and Log Loss', [
    ('l01-the-roc-curve-and-tied-scores', 'The ROC curve and tied scores', 14, [V]),
    ('l02-auc-as-a-probability', 'AUC as a probability', 13, [V]),
    ('l03-log-loss-and-its-clip', 'Log loss and its clip', 13, [V]),
    ('l04-the-capstone-brief', 'The capstone brief', 12, [V]),
  ]),
 ],
 'advanced': [
  ('m01-conditioning-and-nist', 'Conditioning and the NIST Reference Problems', [
    ('l01-the-condition-number', 'The condition number, raw and scaled', 13, [D]),
    ('l02-the-refusal-limit', 'The refusal limit and why it sits there', 14, [D]),
    ('l03-longley-and-the-certified-values', 'Longley and the certified values', 13, [D]),
    ('l04-filip-refused', 'Filip, refused at the default', 14, [D]),
    ('l05-what-digits-mean', 'What a digit of agreement means', 12, [D]),
  ]),
  ('m02-separation', 'Separation', [
    ('l01-complete-separation', 'Complete separation', 13, [D]),
    ('l02-quasi-complete-separation', 'Quasi-complete separation', 13, [D]),
    ('l03-the-exact-test', 'The exact test before any iteration', 14, [D]),
    ('l04-a-penalty-that-fits', 'A penalty that makes the fit finite', 13, [D, V]),
  ]),
  ('m03-convergence', 'Convergence and Its Stated Rule', [
    ('l01-newton-steps-from-zero', 'Newton steps from zero', 13, [D]),
    ('l02-the-stopping-rule', 'The stopping rule in coefficient units', 14, [D]),
    ('l03-step-halving', 'Step halving', 12, [D]),
    ('l04-when-a-fit-does-not-converge', 'When a fit does not converge', 13, [D]),
  ]),
  ('m04-importance-and-learning-curves', 'Importance and Learning Curves', [
    ('l01-permutation-importance', 'Permutation importance', 13, [D]),
    ('l02-a-feature-that-carries-nothing', 'A feature that carries nothing', 13, [D]),
    ('l03-repeats-and-their-spread', 'Repeats and their spread', 12, [D]),
    ('l04-the-learning-curve-in-wells', 'The learning curve counted in wells', 14, [D]),
    ('l05-reading-a-learning-curve', 'Reading a learning curve', 13, [D, F]),
  ]),
  ('m05-missing-log-prediction', 'Missing-Log Prediction End to End', [
    ('l01-the-well-with-no-sonic', 'The well with no sonic', 13, [D]),
    ('l02-choosing-features-by-wells', 'Choosing features by whole-well scores', 14, [D, V]),
    ('l03-a-well-outside-the-training-range', 'A well outside the training range', 14, [D, F]),
    ('l04-writing-a-prediction-back', 'Writing a prediction back honestly', 13, [D]),
  ]),
  ('m06-reading-the-engine-honestly', 'Reading the Engine Honestly', [
    ('l01-conventions-that-are-choices', 'Conventions that are choices', 14, [D]),
    ('l02-what-is-not-built', 'What is not built', 13, [D]),
    ('l03-writing-the-model-note', 'Writing the model note', 13, [D, V]),
    ('l04-the-capstone-brief', 'The capstone brief', 12, [D]),
  ]),
 ],
}

TIER_NAMES = {'beginner': 'Associate', 'intermediate': 'Professional', 'advanced': 'Expert'}

# ---------------------------------------------------------------------------
# THE CHECKS THIS FILE RUNS ON ITSELF. `python3 structure.py` prints them;
# `python3 structure.py --modules` prints the module map d2_dump.mjs builds its
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
    own = {'beginner': F, 'intermediate': V, 'advanced': D}
    for tier, pid in own.items():
        n = sum(1 for r in rows if r[0] == tier and pid in r[8])
        if n < 13:
            problems.append(f'{tier}: its own panel {pid} is tagged on only {n} lessons')
    # NO FORWARD PANEL: a lower tier never tags a higher tier's panel.
    rank = {F: 0, V: 1, D: 2}
    trank = {'beginner': 0, 'intermediate': 1, 'advanced': 2}
    for r in rows:
        for pid in r[8]:
            if rank[pid] > trank[r[0]]:
                problems.append(f'{r[0]}/{r[5]} tags the higher tier panel {pid}')
    if not quiet:
        minutes = sorted({r[7] for r in rows})
        print(f'D2 mlcore structure: {len(rows)} lessons, '
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
