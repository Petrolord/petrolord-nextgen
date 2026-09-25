# D5 Applied AI and Language Models. Three tiers, six modules each, 26
# lessons a tier. The fifth course of the academy's `data_ai` module
# (path_order 70), after D1 Oilfield Data Quality, D2 Machine Learning on Well
# Data, D3 Electrofacies and D4 Data-Driven Production Forecasting.
#
# Engine: engines/dataai/evaluate.js, vendored sha-identical with
# petrolord-engines 1906182 (engines PR #257, squash-merged). It imports
# lib/stats (mulberry32, quantile), lib/conventions/percentile.js
# (parameterPercentileLabel) and engines/dataai/ml.js (logLoss), all three
# already vendored byte-identical. The vendoring closure walked from the jest
# suite is TWENTY-THREE paths: six reached by the walk (the suite, evaluate.js,
# ml.js, lib/lp/simplex.js through ml.js, lib/stats/stats.js and
# lib/conventions/percentile.js) and seventeen NAMED with their reason (the
# golden, the library pins, the five ekene-docs fixtures and their README,
# three ekene-dynamic files the suite reads, the fixture writer, the stdlib
# oracle, the pin writer, the timing script, FINDINGS and the negative
# control). vendor_appliedai.sh re-walks it.
#
# THE DIGEST IS THE ONLY TEACHING TRUTH. digest.txt, built by d5_dump.mjs. The
# engine's FINDINGS record, the oracle, the library pins, the fixture README
# and the engine's source comments are PROVENANCE. Where FINDINGS quotes a
# figure (the headline retrieval, answer and calibration figures) the digest
# recomputes it through the engine and prints it; a writer quotes the digest
# line.
#
# THE COURSE IN ONE SENTENCE. A language-model copilot is only as good as the
# passages it retrieves and the claims it can support from them, and every
# part of that can be measured without a model, so the course teaches how
# retrieval ranks passages with TF-IDF and BM25 and how a ranking and a cited
# answer are scored at a cutoff (Associate), how to score retrieval with
# average precision and nDCG, short answers with SQuAD exact match and token
# F1, field extraction by outcome class, groundedness and its limits, and two
# systems against each other with a paired bootstrap (Professional), and how to
# measure agreement between annotators, calibrate a relevance probability,
# govern a judged set and read every rule the engine applies (Expert), and
# grades each tier on its own question with numbers the engine returns. No
# graded number depends on language-model output.
#
# TIER OWNERSHIP, drawn along the engine's own sections:
#
#   Associate    RETRIEVAL AND CITED ANSWERS, BY HAND. What a copilot and a
#                retrieval step do; the tokeniser (ASCII lowercase, split
#                outside [a-z0-9], no stemming, the stop list off); TF-IDF
#                (raw counts, the smoothed idf, unit vectors, cosine); BM25
#                (the Lucene idf, k1 saturation, b length normalisation, a
#                repeated query word counted once, term contributions); the
#                ranking and its 12-digit tie rule; precision, recall and hit
#                at k, reciprocal rank and MRR; prompts that ask for
#                citations; claims and unsupported claims.
#   Professional SCORING RETRIEVAL AND ANSWERS HONESTLY. Average precision and
#                MAP, the no-relevant-query rule and the relevance threshold;
#                DCG, the ideal ranking, linear and exponential gain, unjudged
#                passages; SQuAD normalisation, exact match and token F1;
#                extraction outcomes, tolerances, accuracy, precision, recall,
#                micro and macro; groundedness, cited and retrieved, the
#                reasons, grounded is not correct, how a deterministic check
#                reads text; two systems compared with a paired bootstrap.
#   Expert       AGREEMENT, CALIBRATION AND GOVERNANCE. Two annotators and
#                Cohen's kappa, unweighted and weighted, and when it is
#                undefined; calibration, the Brier score, the reliability
#                table, ECE and MCE; the Murphy decomposition with the
#                within-bin terms, the bin-edge rule against scikit-learn's,
#                log loss imported from the machine learning engine; judged
#                sets, pooling, unjudged passages and test questions leaking
#                into prompts; every boundary rule, the tie key, the bootstrap
#                levels and the caps; the conventions that are choices, when a
#                model helper is never graded, and the evaluation report.
#
# A higher tier may USE a lower tier's methods (a Professional MAP is computed
# on a BM25 ranking), and each capstone grades only its own question.
#
# SCOPE SEAMS, recorded so no lesson re-teaches another course's material:
#   * logistic regression, log loss as a training loss, splits and k-fold are
#     OWNED BY D2 mlcore; this course imports logLoss and names it with a
#     pointer, and the calibration set's probability is a given input;
#   * data quality (gaps, duplicates, near-duplicate identifiers) is OWNED BY
#     D1 dataqc; the exact duplicate passage here is taught for its tie only;
#   * the bootstrap as a general method and P labels for outcomes are OWNED BY
#     the uncertainty course and D4; the interval here is a percentile of a
#     statistic, labelled as a parameter percentile;
#   * forecasting is OWNED BY D4 appliedai; clustering by D3 facies.
#
# Panel ids: R the retrieval explorer (tokens, TF-IDF, BM25, the ranking,
# metrics at k, one answer's claims), S the scoring explorer (MAP and nDCG over
# a run, short answers, extraction, groundedness over answer sets, the paired
# bootstrap), T the trust explorer (kappa, calibration and the Murphy
# decomposition, the bootstrap of a mean, boundary probes). All three read ONE
# teaching lab, and every one takes a learner's own documents, queries,
# judgments, answers, ratings or probabilities, which is how a capstone is
# worked.
#
# Titles carry COUNTS only, never a MEASUREMENT, and counts are spelled in
# words: ANY DIGIT in a title fails the check below, except inside the three
# method names BM25, F1 and k1, which are names and are stripped by exact word. No em dashes and no
# "X, not Y" contrastive anywhere a learner reads, headings and module titles
# included. "AI" appears in the course name the lead set; no lesson or module
# title claims a method is AI (the check below).
#
# THIS COURSE TEACHES NO REPAIR HISTORY. The engine's review changes (the
# extraction F1 added beside accuracy, the near-tie golden) landed before its
# merge and before any lesson was written, so there is no history module and
# no framed history section.
#
# NAMING COLLISIONS, legislated in the digest's vocabulary section:
#   * "relevant" means a judged grade at or above the stated threshold
#     (grade 1 by default); "related" is grade 1 itself;
#   * "hallucination" means an unsupported claim, a claim the check could not
#     find in a cited, retrieved passage, and it names the reason;
#   * "grounded" means supported by a cited and retrieved passage, which is a
#     claim about the passage and never about the truth of the answer;
#   * "accuracy" names its denominator (cells, answers) and "precision" names
#     its cutoff or its filled cells;
#   * "score" names its method (BM25, TF-IDF cosine) and is never a
#     probability; "probability" is the calibration set's given input;
#   * "AI" and "language model" name the system being evaluated, never a
#     method this engine runs; the engine runs no model.
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


C = 'ae-retrieval-explorer'
J = 'ae-scoring-explorer'
K = 'ae-trust-explorer'
PANEL_IDS = [C, J, K]

TIERS = {
 'beginner': [
  ('m01-what-copilots-and-retrieval-do', 'What Copilots and Retrieval Do', [
    ('l01-a-question-a-search-and-an-answer', 'A question, a search and an answer', 12, [C]),
    ('l02-retrieval-before-the-answer', 'Retrieval before the answer is written', 13, [C]),
    ('l03-the-ekene-document-set', 'The Ekene document set', 13, [C]),
    ('l04-what-is-graded-and-what-never-is', 'What is graded and what never is', 14, [C]),
    ('l05-the-refusals-by-name', 'The refusals, each naming its field', 13, [C]),
  ]),
  ('m02-tokens', 'Tokens', [
    ('l01-lowercase-and-split', 'Lowercasing and splitting text', 12, [C]),
    ('l02-numbers-and-well-names-split', 'Numbers and well names split apart', 13, [C]),
    ('l03-the-stop-list-left-off', 'The stop list, and why it is left off', 14, [C]),
    ('l04-counting-terms', 'Counting terms in a passage', 13, [C]),
  ]),
  ('m03-tf-idf', 'TF-IDF', [
    ('l01-term-and-document-frequency', 'Term frequency and document frequency', 12, [C]),
    ('l02-the-smoothed-idf', 'The smoothed inverse document frequency', 13, [C]),
    ('l03-unit-length-vectors', 'Vectors scaled to unit length', 14, [C]),
    ('l04-cosine-ranking', 'Ranking by cosine', 13, [C]),
  ]),
  ('m04-bm25', 'BM25', [
    ('l01-the-bm25-idf', 'The BM25 inverse document frequency', 13, [C]),
    ('l02-saturation-and-k1', 'Term saturation and k1', 14, [C]),
    ('l03-length-normalisation-and-b', 'Length normalisation and b', 12, [C]),
    ('l04-a-repeated-query-word', 'A repeated query word counts once', 14, [C]),
    ('l05-bm25-term-by-term', 'A score read term by term', 12, [C]),
  ]),
  ('m05-ranking-and-metrics-at-k', 'Ranking and Metrics at a Cutoff', [
    ('l01-score-order-and-ties', 'Score order and the tie rule', 13, [C]),
    ('l02-precision-and-recall-at-k', 'Precision and recall at a cutoff', 14, [C]),
    ('l03-hit-and-reciprocal-rank', 'Hit and reciprocal rank', 14, [C]),
    ('l04-means-over-queries', 'Means over queries', 13, [C]),
  ]),
  ('m06-answers-that-cite-sources', 'Answers That Cite Their Sources', [
    ('l01-prompts-that-ask-for-citations', 'Prompts that ask for citations', 13, [C]),
    ('l02-claims-in-an-answer', 'Numbers, dates and quotes as claims', 14, [C]),
    ('l03-unsupported-claims', 'Unsupported claims', 13, [C]),
    ('l04-the-capstone-brief', 'The capstone brief', 12, [C]),
  ]),
 ],
 'intermediate': [
  ('m01-average-precision-and-map', 'Average Precision and MAP', [
    ('l01-precision-at-every-relevant-rank', 'Precision at every relevant rank', 12, [J]),
    ('l02-dividing-by-every-relevant-passage', 'Dividing by every relevant passage', 13, [J]),
    ('l03-mean-average-precision', 'Mean average precision', 13, [J]),
    ('l04-a-query-with-no-relevant-passage', 'A query with no relevant passage', 14, [J]),
    ('l05-the-relevance-threshold', 'The relevance threshold', 14, [J]),
  ]),
  ('m02-graded-relevance-and-ndcg', 'Graded Relevance and nDCG', [
    ('l01-discounted-cumulative-gain', 'Discounted cumulative gain', 12, [J]),
    ('l02-the-ideal-ranking', 'The ideal ranking', 14, [J]),
    ('l03-linear-and-exponential-gain', 'Linear and exponential gain', 13, [J]),
    ('l04-unjudged-passages', 'Unjudged passages in a ranking', 13, [J]),
  ]),
  ('m03-short-answers', 'Short Answers', [
    ('l01-normalising-an-answer', 'Normalising an answer', 12, [J]),
    ('l02-exact-match', 'Exact match', 13, [J]),
    ('l03-token-f1', 'Token F1', 14, [J]),
    ('l04-an-empty-answer', 'An empty answer and an abstention', 13, [J]),
  ]),
  ('m04-field-extraction', 'Field Extraction', [
    ('l01-fields-records-and-cells', 'Fields, records and cells', 12, [J]),
    ('l02-the-four-outcomes', 'The four outcomes of a cell', 13, [J]),
    ('l03-numbers-within-a-tolerance', 'Numbers within a tolerance', 14, [J]),
    ('l04-accuracy-precision-and-recall', 'Accuracy, precision and recall on cells', 14, [J]),
    ('l05-micro-and-macro', 'Micro and macro averages', 13, [J]),
  ]),
  ('m05-groundedness-and-its-limits', 'Groundedness and Its Limits', [
    ('l01-cited-and-retrieved', 'Cited and retrieved', 13, [J]),
    ('l02-the-reasons-a-claim-fails', 'The reasons a claim fails', 14, [J]),
    ('l03-grounded-and-correct', 'Grounded and correct are different questions', 13, [J]),
    ('l04-how-the-check-reads-text', 'How the check reads text', 14, [J]),
  ]),
  ('m06-comparing-two-systems', 'Comparing Two Systems', [
    ('l01-two-systems-on-the-same-queries', 'Two systems on the same queries', 13, [J]),
    ('l02-the-paired-bootstrap', 'The paired bootstrap', 14, [J]),
    ('l03-writing-up-a-comparison', 'Writing up a comparison', 13, [J]),
    ('l04-the-capstone-brief', 'The capstone brief', 12, [J]),
  ]),
 ],
 'advanced': [
  ('m01-annotator-agreement', 'Annotator Agreement', [
    ('l01-two-annotators-one-judged-set', 'Two annotators, one judged set', 12, [K]),
    ('l02-observed-and-expected-agreement', 'Observed and expected agreement', 13, [K]),
    ('l03-cohens-kappa', "Cohen's kappa", 13, [K]),
    ('l04-weighted-kappa', 'Linear and quadratic weights', 14, [K]),
    ('l05-when-kappa-is-undefined', 'When kappa has no value', 13, [K]),
  ]),
  ('m02-calibration', 'Calibration', [
    ('l01-a-probability-and-an-outcome', 'A probability and an outcome', 12, [K]),
    ('l02-the-brier-score', 'The Brier score', 13, [K]),
    ('l03-the-reliability-table', 'The reliability table', 14, [K]),
    ('l04-ece-and-mce', 'Expected and maximum calibration error', 13, [K]),
  ]),
  ('m03-decomposing-the-brier-score', 'Decomposing the Brier Score', [
    ('l01-reliability-resolution-uncertainty', 'Reliability, resolution and uncertainty', 14, [K]),
    ('l02-the-within-bin-terms', 'The within-bin terms that close the identity', 14, [K]),
    ('l03-the-bin-edge-rule', 'The bin-edge rule and the library rule', 13, [K]),
    ('l04-log-loss-from-the-ml-engine', 'Log loss from the machine learning engine', 12, [K]),
  ]),
  ('m04-judged-sets-and-leakage', 'Judged Sets, Pooling and Leakage', [
    ('l01-how-the-judged-set-was-pooled', 'How the judged set was pooled', 13, [K, J]),
    ('l02-unjudged-is-not-irrelevant', 'Unjudged and irrelevant are different', 13, [K, J]),
    ('l03-pooling-bias', 'Pooling bias', 14, [K]),
    ('l04-test-questions-in-a-prompt', 'Test questions in a prompt', 13, [K]),
    ('l05-a-second-annotator-as-a-check', 'A second annotator as a check', 12, [K]),
  ]),
  ('m05-boundaries-ties-and-caps', 'Boundaries, Ties and Caps', [
    ('l01-boundaries-rule-by-rule', 'Boundaries, rule by rule', 14, [K]),
    ('l02-the-twelve-digit-tie-key', 'The twelve-digit tie key', 13, [K, C]),
    ('l03-bootstrap-levels-and-labels', 'Bootstrap levels and their labels', 13, [K, J]),
    ('l04-row-and-size-caps', 'Row and size caps', 12, [K]),
  ]),
  ('m06-reading-the-engine-honestly', 'Reading the Engine Honestly', [
    ('l01-conventions-that-are-choices', 'Conventions that are choices', 14, [K]),
    ('l02-when-a-model-helper-is-never-graded', 'When a model helper is never graded', 13, [K]),
    ('l03-writing-the-evaluation-report', 'Writing the evaluation report', 13, [K, J]),
    ('l04-the-capstone-brief', 'The capstone brief', 12, [K]),
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
        if re.search(r',\s+not\s+\w', t):
            problems.append(f'{tier}: title carries a contrastive: {t}')
        # Method NAMES that carry a digit (BM25, F1, k1) are names and not
        # measurements; they are stripped, by exact word, before the digit check.
        if re.search(r'\d', re.sub(r'\b(?:BM25|F1|k1)\b', '', t)):
            problems.append(f'{tier}: title carries a digit, which is a measurement rather than a count: {t}')
        if re.search(r'\bAI\b|AI-powered|artificial intelligence|language model', t, re.I):
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
        print(f'D5 appliedai structure: {len(rows)} lessons, '
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
