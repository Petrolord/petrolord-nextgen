# D3 Electrofacies. Three tiers, six modules each, 26 lessons a tier. The third
# course of the academy's `data_ai` module (path_order 68), after D1 Oilfield
# Data Quality and D2 Machine Learning on Well Data.
#
# Engine: engines/dataai/cluster.js, vendored sha-identical with
# petrolord-engines 4dfbb29 (engines PR #253). It imports lib/stats
# (mulberry32) and, from ml.js, the scalers and classificationReport, so ml.js
# travels with it (already vendored by D2 at the same bytes). The vendoring
# closure walked from the jest suite is FOURTEEN paths: six reached by the walk
# (the suite, cluster.js, ml.js, lib/stats/stats.js, lib/lp/simplex.js and the
# synthetic wells helper) and eight NAMED with their reason (the golden and the
# library pins the suite reads through a spread helper, Fisher's iris, the
# stdlib oracle, the pin writer, the timing script, FINDINGS and the negative
# control). vendor_facies.sh re-walks it.
#
# THE DIGEST IS THE ONLY TEACHING TRUTH. digest.txt, built by d3_dump.mjs. The
# engine's FINDINGS record, the oracle, the library pins and the engine's
# source comments are PROVENANCE. Where FINDINGS quotes a figure (the iris
# explained variance ratio scikit-learn publishes) the digest recomputes it
# through the engine and prints it; a writer quotes the digest line.
#
# THE COURSE IN ONE SENTENCE. An electrofacies is a group of depth samples
# whose logs look alike, and it is worth something only when it is checked
# against the rock, so the course teaches how to scale the logs, find their
# main directions and group them with k-means (Associate), how to choose the
# number of groups, build a tree of merges and score groups against core
# facies (Professional), and how to predict facies in uncored wells with
# neighbours and trees, where the engine breaks ties and draws its boundaries,
# and how to write a predicted facies back honestly (Expert).
#
# TIER OWNERSHIP, drawn along the engine's own sections:
#
#   Associate    GROUPING LOGS INTO ELECTROFACIES. Logs as features; distance
#                and why a raw distance is ruled by GR; standard and min-max
#                scaling (the population SD, a constant log refused); principal
#                components from the correlation matrix (eigenvalues, explained
#                variance, loadings, scores); k-means (seeded k-means++, Lloyd
#                passes, inertia, several starts); centres back in log units;
#                new rows assigned to the nearest centre. No choice of k, no
#                tree of merges, no score against core.
#   Professional JUDGING GROUPS AGAINST CORE. The elbow; the silhouette;
#                agglomerative Ward, complete and average linkage, the linkage
#                matrix and its cut; matching clusters to core facies one to
#                one and by majority, with the contingency table; the adjusted
#                Rand index. The precision, recall and F1 of a mapped facies
#                are D2's ratios, named with a pointer and never re-taught.
#   Expert       PREDICTING FACIES, AND THE ENGINE'S OWN RULES. k nearest
#                neighbours with the scaler fitted on the training rows and
#                its tie rules; the CART tree (Gini, midpoint thresholds, the
#                split tie-break, depth and leaf limits, importances); the
#                uncored wells predicted and written back; every boundary rule
#                by rule, the tie bands, the sign rule, the row caps; the
#                conventions that are choices and what is not built.
#
# A higher tier may USE a lower tier's methods (a Professional silhouette needs
# a k-means labelling), and each capstone grades only its own question.
#
# SCOPE SEAMS, recorded so no lesson re-teaches another course's material:
#   * splits by whole wells, cross-validation, regression metrics, precision,
#     recall, F1 and their averages are OWNED BY D2 mlcore; this course names
#     them with a pointer where a facies is scored;
#   * outlier statistics and log conditioning are OWNED BY D1 dataqc; this
#     course takes clean logs and refuses a missing value by name;
#   * petrophysical interpretation of a facies (porosity, saturation, net pay)
#     is OWNED BY the petrophysics course; a facies here is a label;
#   * forecasting a rate series is OWNED BY D4 forecastml.
#
# Panel ids: C the cluster explorer (scaling, distance, PCA, k-means, the
# nearest centre), J the judge explorer (elbow, silhouette, agglomerative,
# matching, ARI), K the classify explorer (kNN, CART, uncored wells, ties and
# boundaries). All three read ONE teaching lab, and every one takes a
# learner's own rows, which is how a capstone is worked.
#
# Titles carry COUNTS only, never a MEASUREMENT, and counts are spelled in
# words: ANY DIGIT in a title fails the check below. No em dashes and no
# "X, not Y" contrastive anywhere a learner reads, headings and module titles
# included.
#
# THIS COURSE TEACHES NO REPAIR HISTORY. The engine's review changes (the
# banded ties, the robust sign rule) landed before its merge and before any
# lesson was written, so there is no history module and no framed history
# section.
#
# NAMING COLLISIONS, legislated in the digest's vocabulary section:
#   * "cluster" is an unsupervised group the engine numbers from 0; "facies"
#     is a core description (or a label predicted from one); an
#     "electrofacies" is a cluster read as a rock type, and never a facies
#     until it is matched against core;
#   * "standard deviation" names its divisor: the clustering scaler uses the
#     population SD (n), the correlation PCA the sample SD (n - 1);
#   * "distance" is Euclidean on the scaled logs unless the text says raw;
#   * "accuracy" names its rows: training rows of a tree, or held-out rows;
#   * "tie" names its rule: a distance within the stated band, an exact Gini
#     equality on counts, or a tied vote;
#   * "machine learning" names the method; no lesson calls a model artificial
#     intelligence.
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


C = 'ef-cluster-explorer'
J = 'ef-judge-explorer'
K = 'ef-classify-explorer'
PANEL_IDS = [C, J, K]

TIERS = {
 'beginner': [
  ('m01-what-electrofacies-are', 'What Electrofacies Are', [
    ('l01-logs-as-a-signature-of-rock', 'Logs as a signature of rock', 12, [C]),
    ('l02-core-facies-and-electrofacies', 'Core facies and electrofacies', 13, [C]),
    ('l03-the-ekene-facies-wells', 'The Ekene facies wells and their logs', 13, [C]),
    ('l04-rows-features-and-distance', 'Rows, features and distance', 14, [C]),
    ('l05-the-refusals-by-name', 'The refusals, each naming its field', 13, [C]),
  ]),
  ('m02-scaling-before-distance', 'Scaling Before Distance', [
    ('l01-why-gr-rules-a-raw-distance', 'Why gamma ray rules a raw distance', 12, [C]),
    ('l02-the-population-standard-deviation', 'Standardising with the population standard deviation', 13, [C]),
    ('l03-min-max-scaling', 'Min-max scaling', 14, [C]),
    ('l04-a-constant-log', 'A constant log', 13, [C]),
  ]),
  ('m03-principal-components', 'Principal Components', [
    ('l01-the-correlation-matrix', 'The correlation matrix of the logs', 12, [C]),
    ('l02-eigenvalues-and-explained-variance', 'Eigenvalues and explained variance', 13, [C]),
    ('l03-loadings', 'Loadings and what a component means', 14, [C]),
    ('l04-scores-and-a-new-well', 'Scores, and a new well projected', 13, [C]),
  ]),
  ('m04-k-means', 'k-Means Clustering', [
    ('l01-centres-and-the-nearest-centre', 'Centres and the nearest centre', 13, [C]),
    ('l02-seeding-with-k-means-plus-plus', 'Seeding with k-means++', 14, [C]),
    ('l03-lloyd-passes', 'Lloyd passes until the labels stop changing', 12, [C]),
    ('l04-inertia', 'Inertia', 14, [C]),
    ('l05-several-starts', 'Several starts and the lowest inertia', 12, [C]),
  ]),
  ('m05-reading-clusters', 'Reading Clusters', [
    ('l01-centres-in-log-units', 'Centres back in log units', 13, [C]),
    ('l02-cluster-numbers-are-names', 'Cluster numbers are names', 14, [C]),
    ('l03-assigning-new-rows', 'Assigning new rows to the nearest centre', 14, [C]),
    ('l04-covariance-against-correlation', 'Covariance against correlation', 13, [C]),
  ]),
  ('m06-one-field-clustered', 'One Field Clustered, End to End', [
    ('l01-the-whole-workflow', 'The whole workflow in order', 13, [C]),
    ('l02-fisher-iris-as-a-check', 'Fisher\'s iris as a published check', 14, [C]),
    ('l03-writing-up-a-clustering', 'Writing up a clustering', 13, [C]),
    ('l04-the-capstone-brief', 'The capstone brief', 12, [C]),
  ]),
 ],
 'intermediate': [
  ('m01-the-elbow', 'Choosing k with the Elbow', [
    ('l01-inertia-against-k', 'Inertia against k', 12, [J]),
    ('l02-drops-and-drop-fractions', 'Drops and drop fractions', 13, [J]),
    ('l03-no-elbow-is-picked-for-you', 'No elbow is picked for you', 12, [J]),
    ('l04-an-inertia-that-rises', 'An inertia that rises with k', 14, [J]),
    ('l05-one-seed-per-k', 'One seed stream for each k', 14, [J]),
  ]),
  ('m02-the-silhouette', 'The Silhouette', [
    ('l01-a-and-b-for-one-row', 'The two distances behind one row', 12, [J]),
    ('l02-the-mean-and-each-cluster', 'The mean and each cluster', 13, [J]),
    ('l03-a-row-alone-in-its-cluster', 'A row alone in its cluster', 13, [J]),
    ('l04-when-silhouette-and-elbow-disagree', 'When the silhouette and the elbow disagree', 14, [J]),
  ]),
  ('m03-agglomerative-clustering', 'Agglomerative Clustering', [
    ('l01-merging-from-single-rows', 'Merging from single rows', 12, [J]),
    ('l02-ward-complete-and-average', 'Ward, complete and average linkage', 14, [J]),
    ('l03-the-linkage-matrix', 'The linkage matrix', 13, [J]),
    ('l04-cutting-the-tree', 'Cutting the tree at k clusters', 14, [J]),
    ('l05-re-cutting-a-tree', 'Re-cutting a tree without re-running it', 12, [J]),
  ]),
  ('m04-matching-clusters-to-core', 'Matching Clusters to Core Facies', [
    ('l01-the-contingency-table', 'The contingency table', 13, [J]),
    ('l02-one-to-one-matching', 'One-to-one matching', 14, [J]),
    ('l03-majority-matching', 'Majority matching and split facies', 13, [J]),
    ('l04-scoring-a-mapped-facies', 'Scoring a mapped facies', 12, [J]),
  ]),
  ('m05-the-adjusted-rand-index', 'The Adjusted Rand Index', [
    ('l01-pairs-of-rows', 'Agreement counted in pairs of rows', 13, [J]),
    ('l02-chance-agreement', 'Chance agreement and the adjustment', 14, [J]),
    ('l03-renamed-clusters', 'Renamed clusters score the same', 12, [J]),
    ('l04-two-methods-on-the-same-rows', 'Two methods on the same rows', 13, [J]),
  ]),
  ('m06-electrofacies-against-core', 'Electrofacies Against Core, End to End', [
    ('l01-the-whole-workflow', 'The judging workflow in order', 13, [J]),
    ('l02-a-facies-the-logs-cannot-see', 'A facies the logs barely separate', 14, [J]),
    ('l03-writing-up-a-comparison', 'Writing up a comparison with core', 13, [J]),
    ('l04-the-capstone-brief', 'The capstone brief', 12, [J]),
  ]),
 ],
 'advanced': [
  ('m01-k-nearest-neighbours', 'k Nearest Neighbours', [
    ('l01-the-nearest-training-rows', 'The nearest training rows', 13, [K]),
    ('l02-scaling-on-the-training-rows', 'A scaler fitted on the training rows', 14, [K]),
    ('l03-the-vote-and-a-tied-vote', 'The vote, and a tied vote', 13, [K]),
    ('l04-equidistant-neighbours', 'Equidistant neighbours', 12, [K]),
    ('l05-choosing-k-for-neighbours', 'Choosing k for neighbours', 13, [K]),
  ]),
  ('m02-classification-trees', 'Classification Trees', [
    ('l01-gini-impurity', 'Gini impurity', 13, [K]),
    ('l02-midpoint-thresholds', 'Midpoint thresholds', 13, [K]),
    ('l03-depth-leaves-and-minimum-rows', 'Depth, leaves and minimum rows', 14, [K]),
    ('l04-reading-a-printed-tree', 'Reading a printed tree', 12, [K]),
  ]),
  ('m03-ties-and-exact-comparisons', 'Ties and Exact Comparisons', [
    ('l01-the-root-tie', 'The root tie between two logs', 14, [K]),
    ('l02-a-split-needs-a-decrease', 'A split needs a decrease above zero', 13, [K]),
    ('l03-a-tied-leaf', 'A tied leaf and the class that sorts first', 12, [K]),
    ('l04-feature-importances', 'Feature importances', 13, [K]),
  ]),
  ('m04-predicting-uncored-wells', 'Predicting Uncored Wells', [
    ('l01-training-on-the-cored-wells', 'Training on the cored wells', 13, [K]),
    ('l02-an-uncalibrated-tool', 'An uncalibrated gamma ray tool', 14, [K]),
    ('l03-checking-against-withheld-core', 'Checking against the withheld core', 13, [K]),
    ('l04-neighbours-against-the-tree', 'Neighbours against the tree', 12, [K, J]),
    ('l05-writing-facies-back', 'Writing a predicted facies back honestly', 14, [K]),
  ]),
  ('m05-boundaries-and-caps', 'Boundaries, Bands and Caps', [
    ('l01-boundaries-rule-by-rule', 'Boundaries, rule by rule', 14, [K]),
    ('l02-the-tie-band', 'The tie band on distances and heights', 13, [K, C]),
    ('l03-the-sign-rule', 'The sign rule of a component', 13, [K, C]),
    ('l04-row-caps', 'Row caps and a seeded sample', 12, [K, J]),
  ]),
  ('m06-reading-the-engine-honestly', 'Reading the Engine Honestly', [
    ('l01-conventions-that-are-choices', 'Conventions that are choices', 14, [K]),
    ('l02-what-is-not-built', 'What is not built', 13, [K]),
    ('l03-writing-the-facies-note', 'Writing the facies note', 13, [K, J]),
    ('l04-the-capstone-brief', 'The capstone brief', 12, [K]),
  ]),
 ],
}

TIER_NAMES = {'beginner': 'Associate', 'intermediate': 'Professional', 'advanced': 'Expert'}

# ---------------------------------------------------------------------------
# THE CHECKS THIS FILE RUNS ON ITSELF. `python3 structure.py` prints them;
# `python3 structure.py --modules` prints the module map d3_dump.mjs builds its
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
        print(f'D3 facies structure: {len(rows)} lessons, '
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
