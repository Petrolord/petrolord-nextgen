# SC2 Procurement, Tendering & Contracting. Three tiers, six modules each, 26
# lessons a tier. The second course of the academy's `supply_chain` module
# (path_order 71). An ENGINE COURSE: there is no Suite app, and every practical
# runs in the course's own calculator panels over the vendored engine.
#
# Engine: engines/supplychain/tender.js, vendored sha-identical with
# petrolord-engines 006ed85 (engines PRs #261, #264 and #266). It imports lib/stats
# (mulberry32, triInvCDF, basicStats, mean, standardDeviation),
# lib/conventions/percentile.js (EXCEEDANCE_DEFINITION),
# engines/economics/cashflow.ts (the canonical npv), engines/drilling/wellCost.js
# (evaluateProgram, afeCosts) and engines/economics/afe.js
# (calculatePartnerCosts). vendor_procurement.sh walks the closure from the
# jest suite (sixteen paths vendored sha-identical, eleven of them new) and
# leaves cashflow.ts and afe.js at the blobs their owner courses grade: the two
# functions tender.js calls are source-identical in both, and the engine's own
# suite passes 214 of 214 against NextGen's copies.
#
# THE DIGEST IS THE ONLY TEACHING TRUTH. digest.txt, built by sc2_dump.mjs. The
# engine's FINDINGS record, the oracle, the fixture README and the engine's
# source comments are PROVENANCE. Where FINDINGS quotes a figure (a published
# worked example, a fixture situation) the digest recomputes it through the
# engine and prints it; a writer quotes the digest line.
#
# THE COURSE IN ONE SENTENCE. A tender is decided by rules that can be written
# down and computed, so the course teaches the two-envelope evaluation by hand
# (technical scoring against a pass mark, arithmetic correction, the evaluated
# cost and the combined score) at Associate; the lowest evaluated cost with a
# life-cycle cost, the Rated Criteria weighting band, abnormally low bids and
# the Nigerian content measures of the 2010 Act with its sections 14 and 16 at
# Professional; and contract types under uncertainty with the cost P-label
# reversal, should-cost, the whole tender in one call and a reading of the
# engine's own sources, readings and errata at Expert; and grades each tier on
# its own question with numbers the engine returns.
#
# TIER OWNERSHIP, drawn along the engine's own functions:
#
#   Associate    TWO ENVELOPES, BY HAND. What a tender evaluation decides; the
#                sources and the dates they were read; mandatory requirements,
#                weights and maximum scores, the technical percentage and the
#                pass mark (technicalEvaluation); arithmetic correction, the
#                unit rate prevailing and the misplaced decimal
#                (correctArithmetic); the evaluated cost with its discount,
#                deviations, omissions at the average and the completion-time
#                adjustment (evaluatedCosts); the combined score with the
#                lowest-ratio commercial score and the relative technical score
#                (rankTender); the ranking, its tie-break and the exclusions.
#   Professional LOWEST EVALUATED COST AND THE CONTENT ACT. The award without
#                Rated Criteria and the life-cycle cost through the canonical
#                npv; the para 5.50 weighting band (weightingBand), linear price
#                scoring and the ranking paradox; abnormally low bids by the
#                absolute and the relative test (abnormallyLow); Nigerian
#                content by item and overall in the Schedule's measured units
#                (nigerianContent); section 14 with both readings of "at least
#                5% higher" side by side, and section 16 (contentPreference).
#   Expert       CONTRACTS, SHOULD-COST AND READING THE ENGINE. The same scope
#                as lump sum, day rate and reimbursable under a seeded duration
#                and daily cost (contractTypes), who carries the overrun, and
#                the cost P-label reversal; should-cost through wellCost and the
#                AFE partner split (shouldCost); the whole tender in one call
#                (evaluateTender); the cited readings, the uncited 'highest'
#                omission option, the Guidance's own erratum, printed figures
#                against exact ones, every boundary rule, the caps, the
#                conventions that are choices and the evaluation report.
#
# A higher tier may USE a lower tier's methods (a Professional evaluated cost
# is built from an Associate correction), and each capstone grades only its own
# question.
#
# SCOPE SEAMS, recorded so no lesson re-teaches another course's material:
#   * NPV and discounting as a subject are OWNED BY the economics courses; this
#     course imports the canonical npv for the life-cycle cost and says so;
#   * Monte Carlo as a method and P labels for reserves are OWNED BY the
#     uncertainty course; this course uses the lib/stats sampler on a stated
#     seed and teaches the cost reading of the labels only;
#   * well time and cost estimating is OWNED BY the drilling courses; this
#     course imports wellCost for the programme days and the should-cost;
#   * the Petroleum Industry Act 2021 and the fiscal terms are OWNED BY the
#     pia course; this course cites the 2010 content Act only.
#
# Panel ids: E the envelope calculator (technical scoring, arithmetic
# correction, evaluated cost, the combined score), W the award calculator
# (life-cycle cost, the weighting band, abnormally low bids, Nigerian content,
# sections 14 and 16), X the contract calculator (contract types, should-cost,
# the whole tender, boundary probes). Every panel takes a learner's own bids,
# criteria and settings, which is how a capstone is worked, and the course
# pages say plainly that the practicals run in these panels.
#
# Titles carry COUNTS only, never a MEASUREMENT, and counts are spelled in
# words: ANY DIGIT in a title fails the check below, except inside the names
# "Section 14" and "Section 16" of the Act and the name NPV, which are stripped
# by exact phrase. No em dashes and no "X, not Y" contrastive anywhere a learner
# reads, headings and module titles included.
#
# THIS COURSE TEACHES NO REPAIR HISTORY. The engine's review changes (the
# omission default, the dropped mean-deviation method, the stated s.14 readings,
# the cost P-label basis) landed before its merge and before any lesson was
# written, so there is no history module and no framed history section.
#
# NAMING COLLISIONS, legislated in the digest's vocabulary section:
#   * "responsive" means a bid still in the evaluation at that stage (passed
#     the technical envelope and not rejected at the commercial stage);
#   * "lowest evaluated cost" names the evaluated cost, never the quoted price;
#   * "most advantageous" names the highest combined score;
#   * "content" is Nigerian content, a percentage in a stated measured unit;
#   * "P90" of a cost is the LOW cost (the exceedance definition), and every
#     cost percentile is printed beside that definition;
#   * "should-cost" is the company's independent estimate, never a bid.
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


E = 'pr-envelope-calculator'
W = 'pr-award-calculator'
X = 'pr-contract-calculator'
PANEL_IDS = [E, W, X]

TIERS = {
 'beginner': [
  ('m01-what-a-tender-evaluation-decides', 'What a Tender Evaluation Decides', [
    ('l01-a-scope-a-tender-and-a-contract', 'A scope, a tender and a contract', 12, [E]),
    ('l02-one-envelope-then-the-other', 'One envelope, then the other', 13, [E]),
    ('l03-the-ekene-tenders', 'The Ekene tenders', 13, [E]),
    ('l04-sources-and-the-dates-they-were-read', 'Sources and the dates they were read', 13, [E]),
    ('l05-calculator-panels-and-refusals', 'The calculator panels and the refusals', 14, [E]),
  ]),
  ('m02-the-technical-envelope', 'The Technical Envelope', [
    ('l01-mandatory-requirements-first', 'Mandatory requirements first', 12, [E]),
    ('l02-weights-and-maximum-scores', 'Weights and maximum scores', 13, [E]),
    ('l03-the-technical-percentage', 'The technical percentage and weighted points', 13, [E]),
    ('l04-the-pass-mark-and-the-bid-on-it', 'The pass mark and the bid that sits on it', 13, [E]),
    ('l05-a-price-never-opened', 'A price envelope that is never opened', 12, [E]),
  ]),
  ('m03-arithmetic-correction', 'Arithmetic Correction', [
    ('l01-quantity-times-unit-rate', 'Quantity times unit rate', 12, [E]),
    ('l02-the-unit-rate-prevails', 'The unit rate prevails', 13, [E]),
    ('l03-a-misplaced-decimal-point', 'A misplaced decimal point', 13, [E]),
    ('l04-the-tolerance-and-the-quoted-total', 'The tolerance and the quoted total', 13, [E]),
  ]),
  ('m04-evaluated-cost', 'Evaluated Cost', [
    ('l01-corrected-price-less-discount', 'Corrected price less the discount', 12, [E]),
    ('l02-priced-deviations', 'Priced deviations', 12, [E]),
    ('l03-an-omitted-item-at-the-average', 'An omitted item priced at the average', 14, [E]),
    ('l04-completion-time-adjustment', 'Completion time and its adjustment', 13, [E]),
  ]),
  ('m05-the-combined-score', 'The Combined Score', [
    ('l01-the-commercial-score', 'The commercial score of the lowest ratio', 13, [E]),
    ('l02-the-relative-technical-score', 'The relative technical score', 12, [E]),
    ('l03-weighting-the-two-scores', 'Weighting the two scores', 13, [E]),
    ('l04-the-guidance-worked-example', 'The Guidance worked example, figure by figure', 14, [E]),
  ]),
  ('m06-reading-an-award', 'Reading an Award', [
    ('l01-the-ranking-and-its-tie-break', 'The ranking and its tie-break', 13, [E]),
    ('l02-the-most-advantageous-bid', 'The most advantageous bid', 13, [E]),
    ('l03-exclusions-and-their-reasons', 'Exclusions and their reasons', 12, [E]),
    ('l04-the-capstone-brief', 'The capstone brief', 13, [E]),
  ]),
 ],
 'intermediate': [
  ('m01-lowest-evaluated-cost-over-the-life', 'Lowest Evaluated Cost Over the Life of the Asset', [
    ('l01-an-award-without-rated-criteria', 'An award without rated criteria', 12, [W]),
    ('l02-life-cycle-cost-as-net-present-cost', 'Life-cycle cost as a net present cost', 13, [W]),
    ('l03-discounting-through-the-canonical-npv', 'Discounting through the canonical NPV', 13, [W]),
    ('l04-residual-value-in-the-last-year', 'Residual value in the last year', 12, [W]),
    ('l05-the-materials-tender-ranked', 'The materials tender ranked', 14, [E, W]),
  ]),
  ('m02-rated-criteria-and-price-scoring', 'Rated Criteria and Price Scoring', [
    ('l01-risk-value-and-the-weighting-matrix', 'Risk, value and the weighting matrix', 13, [W]),
    ('l02-the-high-value-line', 'The high-value line and its boundary', 12, [W]),
    ('l03-linear-price-scoring', 'Linear price scoring', 13, [E, W]),
    ('l04-the-ranking-paradox', 'The ranking paradox of relative price scores', 13, [E, W]),
  ]),
  ('m03-abnormally-low-bids', 'Abnormally Low Bids', [
    ('l01-fewer-than-five-bids', 'Fewer than five bids: the absolute test', 13, [W]),
    ('l02-five-or-more-bids', 'Five or more bids: the relative test', 13, [W]),
    ('l03-the-population-standard-deviation', 'The population standard deviation', 12, [W]),
    ('l04-clarify-before-deciding', 'Clarify before any decision', 12, [W]),
  ]),
  ('m04-measuring-nigerian-content', 'Measuring Nigerian Content', [
    ('l01-the-act-and-its-schedule', 'The Act and its Schedule', 13, [W]),
    ('l02-measured-units', 'Man-hours, tonnage, number and spend', 13, [W]),
    ('l03-an-item-against-its-minimum', 'An item against its minimum', 12, [W]),
    ('l04-overall-content-across-mixed-units', 'Overall content across mixed units', 14, [W]),
    ('l05-a-target-the-schedule-does-not-list', 'A target the Schedule does not list', 12, [W]),
  ]),
  ('m05-section-14', 'Section 14 of the Act', [
    ('l01-bids-within-one-percent', 'Bids within one percent', 12, [W]),
    ('l02-the-closest-competitor', 'The closest competitor', 12, [W]),
    ('l03-two-readings-of-five-percent-higher', 'Two readings of five percent higher', 14, [W]),
    ('l04-a-shared-highest-content', 'A shared highest content', 12, [W]),
  ]),
  ('m06-section-16-and-the-award', 'Section 16 and the Award', [
    ('l01-protection-within-ten-percent', 'Protection within ten percent', 13, [W]),
    ('l02-content-in-a-combined-award', 'Content in a combined award', 12, [W]),
    ('l03-the-materials-award-end-to-end', 'The materials award end to end', 14, [W]),
    ('l04-the-capstone-brief', 'The capstone brief', 13, [W]),
  ]),
 ],
 'advanced': [
  ('m01-contract-types-on-one-job', 'Contract Types on One Job', [
    ('l01-lump-sum-day-rate-reimbursable', 'Lump sum, day rate and reimbursable', 13, [X]),
    ('l02-duration-from-the-activity-programme', 'Duration from the activity programme', 13, [X]),
    ('l03-seeded-sampling', 'Seeded sampling of days and daily cost', 13, [X]),
    ('l04-who-carries-the-overrun', 'Who carries the overrun', 14, [X]),
    ('l05-the-chance-of-a-loss', 'The contractor margin and the chance of a loss', 12, [X]),
  ]),
  ('m02-cost-percentiles', 'Cost Percentiles and Their Labels', [
    ('l01-the-exceedance-definition', 'The exceedance definition', 12, [X]),
    ('l02-the-low-cost-label', 'Why the high-probability label is the low cost', 13, [X]),
    ('l03-reading-a-cost-range', 'Reading a cost range', 13, [X]),
    ('l04-plan-mean-and-overrun', 'The plan, the mean and the overrun', 12, [X]),
  ]),
  ('m03-should-cost', 'Should-Cost', [
    ('l01-an-independent-estimate', 'An independent estimate from the programme', 13, [X]),
    ('l02-contingency-and-the-partner-split', 'Contingency and the partner split', 13, [X]),
    ('l03-the-screening-band', 'The screening band', 12, [X]),
    ('l04-should-cost-beside-the-abnormally-low-test', 'Should-cost beside the abnormally low test', 13, [W, X]),
  ]),
  ('m04-whole-tender-evaluation', 'Whole-Tender Evaluation', [
    ('l01-stages-chained', 'Stages chained in one call', 13, [X]),
    ('l02-the-well-services-tender-end-to-end', 'The well services tender end to end', 14, [E, X]),
    ('l03-when-nobody-passes', 'When nobody passes', 12, [X]),
    ('l04-the-award-basis-decides', 'The award basis decides', 13, [W, X]),
  ]),
  ('m05-reading-the-engine-honestly', 'Reading the Engine Honestly', [
    ('l01-cited-readings', 'Cited readings and their dates', 13, [X]),
    ('l02-the-uncited-omission-option', 'The uncited omission option', 13, [E, X]),
    ('l03-an-erratum-in-the-guidance', 'An erratum in the Guidance', 13, [E, X]),
    ('l04-printed-figures-and-exact-figures', 'Printed figures and exact figures', 13, [E, X]),
    ('l05-boundaries-rule-by-rule', 'Boundaries, rule by rule', 14, [X]),
  ]),
  ('m06-conventions-and-the-report', 'Conventions and the Evaluation Report', [
    ('l01-conventions-that-are-choices', 'Conventions that are choices', 13, [X]),
    ('l02-what-is-not-built', 'What the engine does not build', 12, [X]),
    ('l03-writing-the-evaluation-report', 'Writing the evaluation report', 13, [X]),
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
        if re.search(r',\s+not\s+\w', t):
            problems.append(f'{tier}: title carries a contrastive: {t}')
        # The Act's section NAMES (Section 14, Section 16) and NPV are names and not
        # measurements; they are stripped, by exact phrase, before the digit check.
        if re.search(r'\d', re.sub(r'\bSection 1[46]\b|\bNPV\b', '', t)):
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
    own = {'beginner': E, 'intermediate': W, 'advanced': X}
    for tier, pid in own.items():
        n = sum(1 for r in rows if r[0] == tier and pid in r[8])
        if n < 13:
            problems.append(f'{tier}: its own panel {pid} is tagged on only {n} lessons')
    # NO FORWARD PANEL: a lower tier never tags a higher tier's panel.
    rank = {E: 0, W: 1, X: 2}
    trank = {'beginner': 0, 'intermediate': 1, 'advanced': 2}
    for r in rows:
        for pid in r[8]:
            if rank[pid] > trank[r[0]]:
                problems.append(f'{r[0]}/{r[5]} tags the higher tier panel {pid}')
    if not quiet:
        minutes = sorted({r[7] for r in rows})
        print(f'SC2 procurement structure: {len(rows)} lessons, '
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
