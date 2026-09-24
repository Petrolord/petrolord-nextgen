# D4 Data-Driven Production Forecasting. Three tiers, six modules each, 26
# lessons a tier. The fourth course of the academy's `data_ai` module
# (path_order 69), after D1 Oilfield Data Quality, D2 Machine Learning on Well
# Data and D3 Electrofacies.
#
# Engine: engines/dataai/forecast.js, vendored sha-identical with
# petrolord-engines ec89b6b (engines PR #255). It imports lib/stats
# (mulberry32, quantile), lib/conventions/percentile.js (the P90 / P10
# labels) and engines/dca/arps.js (fitArpsModel, calculateArpsHyperbolic), all
# three already vendored byte-identical. The vendoring closure walked from the
# jest suite is THIRTEEN paths: six reached by the walk (the suite,
# forecast.js, arps.js, lib/stats/stats.js, lib/conventions/percentile.js and
# the synthetic wells helper) and seven NAMED with their reason (the golden and
# the library pins the suite reads through a spread helper, the stdlib oracle,
# the pin writer, the timing script, FINDINGS and the negative control).
# vendor_forecastml.sh re-walks it.
#
# THE DIGEST IS THE ONLY TEACHING TRUTH. digest.txt, built by d4_dump.mjs. The
# engine's FINDINGS record, the oracle, the library pins and the engine's
# source comments are PROVENANCE. Where FINDINGS quotes a figure (the NIST
# e-Handbook's published smoothing examples) the digest recomputes it through
# the engine and prints it; a writer quotes the digest line.
#
# THE COURSE IN ONE SENTENCE. A data-driven forecast extends a rate series
# from its own history, and it is worth something only when it is tested on
# months it never saw, so the course teaches how simple, Holt and damped
# exponential smoothing turn a well's monthly rates into a forecast and how
# their parameters are fitted (Associate), how to score a forecast honestly
# with errors, percentage errors, the scaled error and rolling-origin
# backtests (Professional), and how to put intervals around a forecast with a
# seeded residual bootstrap, test it against the Arps decline baseline, and
# read every rule the engine applies (Expert).
#
# TIER OWNERSHIP, drawn along the engine's own sections:
#
#   Associate    SMOOTHING A RATE SERIES INTO A FORECAST. A monthly rate
#                series; one-step and h-step forecasts; simple exponential
#                smoothing (the level, alpha, the flat forecast, alpha at 1 as
#                the naive forecast); Holt's linear trend (the trend, beta, the
#                second month spent on the start, scoredFrom); the damped
#                trend (phi, the flattening, the limit, phi fitted and given);
#                the parameter fit by SSE (grid, compass search, atBounds,
#                converged). No backtest, no interval, no Arps.
#   Professional TESTING A FORECAST HONESTLY. Errors as actual minus
#                forecast; ME, MAE, RMSE; MAPE and its undefined zero actual;
#                sMAPE on 0 to 200; MASE and its in-sample naive scale, the
#                lag m, a flat training window; rolling-origin backtests with
#                an expanding window, refit against held parameters, leakage;
#                pooled and by-horizon metrics; methods compared.
#   Expert       UNCERTAINTY, THE ARPS BASELINE AND THE ENGINE'S RULES. The
#                residual bootstrap (paths, one seeded stream, the state
#                update, the pool); the quantile rule and the exceedance
#                labels, P90 the low case; negatives reported as zero; the
#                Arps baseline imported from the decline curve engine (a
#                month passed as a day, zeros dropped, no fit); compareWithArps
#                ranking, ties and unranked rows; every boundary rule by rule
#                and the caps; the conventions that are choices and what is
#                not built.
#
# A higher tier may USE a lower tier's methods (a Professional backtest fits a
# smoothing method), and each capstone grades only its own question.
#
# SCOPE SEAMS, recorded so no lesson re-teaches another course's material:
#   * Arps decline curves (qi, Di, b, the exponential, harmonic and hyperbolic
#     forms, EUR) are OWNED BY the decline curve analysis course (dca); this
#     course imports the fit as a baseline and names it with a pointer;
#   * regression, train and test splits by whole wells and k-fold are OWNED BY
#     D2 mlcore; a rolling origin is the time-series form taught here;
#   * data quality (gaps, outliers, frozen values, rate while shut in) is OWNED
#     BY D1 dataqc; this course takes a clean series and refuses a missing
#     value by name;
#   * Monte Carlo and P labels in general are OWNED BY the uncertainty and dca
#     courses; the bootstrap here is the residual bootstrap of one method, and
#     its labels follow the platform's percentile convention;
#   * clustering and classification are OWNED BY D3 facies.
#
# Panel ids: S the smoothing explorer (ses, holt, damped, the fit, h-step
# forecasts), B the backtest explorer (errors, percentage errors, MASE,
# rolling origins, pooling), U the uncertainty explorer (bootstrap intervals,
# percentiles, Arps, the comparison and its ranking, boundaries). All three
# read ONE teaching lab, and every one takes a learner's own series, which is
# how a capstone is worked.
#
# Titles carry COUNTS only, never a MEASUREMENT, and counts are spelled in
# words: ANY DIGIT in a title fails the check below (so a title never says P90
# or P10). No em dashes and no "X, not Y" contrastive anywhere a learner reads,
# headings and module titles included.
#
# THIS COURSE TEACHES NO REPAIR HISTORY. The engine's review changes (the
# exact refusal wordings, the stated quantile rule) landed before its merge and
# before any lesson was written, so there is no history module and no framed
# history section.
#
# NAMING COLLISIONS, legislated in the digest's vocabulary section:
#   * "forecast" is a point forecast from one fitted method unless the text
#     names a percentile; the one-step forecast is the fitted value;
#   * "error" is actual minus forecast, so a positive error means the
#     forecast was low; "residual" is an in-sample one-step error;
#   * "P90" is the low case (the 10th percentile of the simulated paths) and
#     "P10" the high case, by the platform's exceedance convention;
#   * "accuracy" names its metric and its rows (in-sample, or out-of-sample
#     at named origins); MAPE and sMAPE are percent, MASE has no unit;
#   * "trend" is the smoothed trend state b, never a regression slope;
#   * "machine learning" names the method: exponential smoothing, a residual
#     bootstrap, a least-squares Arps fit; no lesson calls a method
#     artificial intelligence.
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


C = 'pf-smoothing-explorer'
J = 'pf-backtest-explorer'
K = 'pf-uncertainty-explorer'
PANEL_IDS = [C, J, K]

TIERS = {
 'beginner': [
  ('m01-what-a-data-driven-forecast-is', 'What a Data-Driven Forecast Is', [
    ('l01-a-rate-series-month-by-month', 'A rate series, month by month', 12, [C]),
    ('l02-forecasting-from-the-series-alone', 'Forecasting from the series alone', 13, [C]),
    ('l03-the-ekene-production-wells', 'The Ekene production wells', 13, [C]),
    ('l04-one-step-and-h-step-forecasts', 'One-step and h-step forecasts', 14, [C]),
    ('l05-the-refusals-by-name', 'The refusals, each naming its field', 13, [C]),
  ]),
  ('m02-simple-exponential-smoothing', 'Simple Exponential Smoothing', [
    ('l01-the-level-and-alpha', 'The level and the smoothing weight alpha', 12, [C]),
    ('l02-starting-at-the-first-month', 'Starting at the first month', 13, [C]),
    ('l03-a-flat-forecast', 'A flat forecast at every step', 14, [C]),
    ('l04-alpha-at-one-is-the-naive-forecast', 'Alpha at one is the naive forecast', 13, [C]),
  ]),
  ('m03-holts-linear-trend', "Holt's Linear Trend", [
    ('l01-a-level-and-a-trend', 'A level and a trend', 12, [C]),
    ('l02-the-second-month-is-spent', 'The second month is spent on the start', 13, [C]),
    ('l03-where-scoring-starts', 'Where scoring starts, and the mean squared error', 14, [C]),
    ('l04-a-trend-that-runs-below-zero', 'A trend that runs below zero', 13, [C]),
  ]),
  ('m04-the-damped-trend', 'The Damped Trend', [
    ('l01-damping-the-trend-with-phi', 'Damping the trend with phi', 13, [C]),
    ('l02-the-damped-forecast-flattens', 'The damped forecast flattens', 14, [C]),
    ('l03-the-limit-of-a-damped-forecast', 'The limit of a damped forecast', 12, [C]),
    ('l04-phi-fitted-and-phi-given', 'Phi fitted and phi given', 14, [C]),
    ('l05-damped-with-phi-at-one-is-holt', 'Damped with phi at one is Holt', 12, [C]),
  ]),
  ('m05-fitting-the-parameters', 'Fitting the Parameters', [
    ('l01-the-sum-of-squared-errors', 'The sum of squared one-step errors', 13, [C]),
    ('l02-the-grid-then-the-compass-search', 'The grid, then the compass search', 14, [C]),
    ('l03-parameters-on-their-bounds', 'Parameters on their bounds', 14, [C]),
    ('l04-convergence-and-the-stop-rule', 'Convergence and the stop rule', 13, [C]),
  ]),
  ('m06-one-well-forecast', 'One Well Forecast, End to End', [
    ('l01-the-whole-workflow', 'The whole workflow in order', 13, [C]),
    ('l02-the-nist-handbook-as-a-check', 'The NIST handbook as a published check', 14, [C]),
    ('l03-writing-up-a-forecast', 'Writing up a forecast', 13, [C]),
    ('l04-the-capstone-brief', 'The capstone brief', 12, [C]),
  ]),
 ],
 'intermediate': [
  ('m01-forecast-errors', 'Forecast Errors', [
    ('l01-actual-minus-forecast', 'Actual minus forecast', 12, [J]),
    ('l02-bias-and-the-mean-error', 'Bias and the mean error', 13, [J]),
    ('l03-mae-and-rmse', 'The mean absolute error and the root mean squared error', 13, [J]),
    ('l04-scoring-against-actuals', 'Scoring a forecast against actuals', 14, [J]),
    ('l05-in-sample-and-out-of-sample', 'In-sample and out-of-sample errors', 14, [J]),
  ]),
  ('m02-percentage-errors', 'Percentage Errors', [
    ('l01-the-mean-absolute-percentage-error', 'The mean absolute percentage error', 12, [J]),
    ('l02-a-shut-in-month-in-the-actuals', 'A shut-in month in the actuals', 13, [J]),
    ('l03-the-symmetric-percentage-error', 'The symmetric percentage error', 13, [J]),
    ('l04-a-low-rate-tail', 'A low rate tail', 14, [J]),
  ]),
  ('m03-the-scaled-error', 'The Scaled Error', [
    ('l01-the-naive-forecast-as-a-yardstick', 'The naive forecast as a yardstick', 12, [J]),
    ('l02-mase-and-its-scale', 'The mean absolute scaled error and its scale', 14, [J]),
    ('l03-the-lag-of-the-naive-forecast', 'The lag of the naive forecast', 13, [J]),
    ('l04-a-flat-training-window', 'A flat training window', 13, [J]),
  ]),
  ('m04-rolling-origin-backtests', 'Rolling-Origin Backtests', [
    ('l01-origins-and-the-expanding-window', 'Origins and the expanding window', 13, [J]),
    ('l02-horizon-and-step', 'Horizon and step', 12, [J]),
    ('l03-refitting-at-every-origin', 'Refitting at every origin', 14, [J]),
    ('l04-parameters-held-from-the-first-window', 'Parameters held from the first window', 13, [J]),
    ('l05-leakage-from-the-future', 'Leakage from the future', 14, [J]),
  ]),
  ('m05-pooling-backtest-errors', 'Pooling Backtest Errors', [
    ('l01-pooled-over-origins-and-steps', 'Pooled over origins and steps', 13, [J]),
    ('l02-errors-by-horizon', 'Errors by horizon', 14, [J]),
    ('l03-each-origin-its-own-scale', 'Each origin scaled by its own training window', 13, [J]),
    ('l04-one-origin-can-leave-a-metric-undefined', 'One origin can leave a metric undefined', 12, [J]),
  ]),
  ('m06-methods-compared', 'Methods Compared, End to End', [
    ('l01-the-whole-workflow', 'The testing workflow in order', 13, [J]),
    ('l02-a-workover-changes-the-winner', 'A workover changes the winner', 14, [J]),
    ('l03-writing-up-a-backtest', 'Writing up a backtest', 13, [J]),
    ('l04-the-capstone-brief', 'The capstone brief', 12, [J]),
  ]),
 ],
 'advanced': [
  ('m01-the-residual-bootstrap', 'The Residual Bootstrap', [
    ('l01-simulated-future-paths', 'Simulated future paths', 13, [K]),
    ('l02-drawing-residuals-with-a-seed', 'Drawing residuals with a seed', 14, [K]),
    ('l03-the-simulated-value-updates-the-state', 'The simulated value updates the state', 13, [K]),
    ('l04-the-residual-pool', 'The residual pool', 12, [K]),
    ('l05-a-median-away-from-the-point-forecast', 'A median away from the point forecast', 13, [K]),
  ]),
  ('m02-percentiles-and-their-labels', 'Percentiles and Their Labels', [
    ('l01-the-quantile-rule', 'The quantile rule on sorted paths', 13, [K]),
    ('l02-the-exceedance-labels', 'The exceedance labels, low case and high case', 13, [K]),
    ('l03-negative-rates-reported-as-zero', 'Negative rates reported as zero', 14, [K]),
    ('l04-intervals-that-widen', 'Intervals that widen with every step', 12, [K]),
  ]),
  ('m03-the-arps-baseline', 'The Arps Baseline', [
    ('l01-arps-from-the-decline-curve-engine', 'Arps from the decline curve engine', 14, [K]),
    ('l02-a-month-passed-as-a-day', 'A month passed as a day', 13, [K]),
    ('l03-shut-in-months-dropped', 'Shut-in months dropped before the fit', 13, [K]),
    ('l04-when-arps-finds-no-fit', 'When Arps finds no fit', 12, [K]),
  ]),
  ('m04-ranking-methods-against-arps', 'Ranking Methods Against Arps', [
    ('l01-the-same-origins-for-every-method', 'The same origins for every method', 13, [K, J]),
    ('l02-ranking-by-the-chosen-metric', 'Ranking by the chosen metric', 12, [K]),
    ('l03-ties-and-the-listed-order', 'Ties and the listed order', 14, [K]),
    ('l04-unranked-methods', 'Unranked methods', 13, [K]),
    ('l05-a-baseline-that-wins', 'A baseline that wins', 14, [K]),
  ]),
  ('m05-boundaries-bounds-and-caps', 'Boundaries, Bounds and Caps', [
    ('l01-boundaries-rule-by-rule', 'Boundaries, rule by rule', 14, [K]),
    ('l02-the-parameter-box', 'The parameter box and the grid tie', 13, [K, C]),
    ('l03-length-rules', 'Length rules for every function', 13, [K]),
    ('l04-row-origin-and-path-caps', 'Row, origin and path caps', 12, [K, J]),
  ]),
  ('m06-reading-the-engine-honestly', 'Reading the Engine Honestly', [
    ('l01-conventions-that-are-choices', 'Conventions that are choices', 14, [K]),
    ('l02-what-is-not-built', 'What is not built', 13, [K]),
    ('l03-writing-the-forecast-note', 'Writing the forecast note', 13, [K, J]),
    ('l04-the-capstone-brief', 'The capstone brief', 12, [K]),
  ]),
 ],
}

TIER_NAMES = {'beginner': 'Associate', 'intermediate': 'Professional', 'advanced': 'Expert'}

# ---------------------------------------------------------------------------
# THE CHECKS THIS FILE RUNS ON ITSELF. `python3 structure.py` prints them;
# `python3 structure.py --modules` prints the module map d4_dump.mjs builds its
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
    own = {'beginner': C, 'intermediate': J, 'advanced': K}
    for tier, pid in own.items():
        n = sum(1 for r in rows if r[0] == tier and pid in r[8])
        if n < 13:
            problems.append(f'{tier}: its own panel {pid} is tagged on only {n} lessons')
    # NO FORWARD PANEL: a lower tier never tags a higher tier's panel.
    rank = {C: 0, J: 1, K: 2}
    trank = {'beginner': 0, 'intermediate': 1, 'advanced': 2}
    for r in rows:
        for pid in r[8]:
            if rank[pid] > trank[r[0]]:
                problems.append(f'{r[0]}/{r[5]} tags the higher tier panel {pid}')
    if not quiet:
        minutes = sorted({r[7] for r in rows})
        print(f'D4 forecastml structure: {len(rows)} lessons, '
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
