# EC11 Reserves & Resources under SPE-PRMS 2018. Three tiers, six modules
# each, 26 lessons a tier. The sixth course of the academy's upstream
# commercial line in the `economics` module (path_order 76), after EC10
# farmout. An ENGINE COURSE: there is no Suite app, and every practical runs in
# the course's own calculator panels over the vendored engine.
#
# Engine: engines/economics/prms.js, vendored sha-identical with
# petrolord-engines bb8ef5f (engines PR #278) at its canonical path; its
# runtime imports (engines/economics/cashflow.ts for computeCashFlow and
# applyJV, engines/economics/irrContract.js under it, lib/stats/stats.js for
# the canonical Monte Carlo, lib/conventions/percentile.js for the P90/P50/P10
# labels) were already vendored in NextGen at the same blobs, so nothing
# shared moved (vendor_prms.sh proves it, four proofs a path). The engine's
# own suite passes 171 of 171 on NextGen's copies.
#
# THE DIGEST IS THE ONLY TEACHING TRUTH. digest.txt, built by prms_dump.mjs.
# The oracle, the golden's expected figures, the fixture README, the engine's
# source comments and the draft validation record are PROVENANCE. Where they
# state a figure (a published check, a fixture situation, a boundary) the
# digest recomputes it through the engine and prints it; a writer quotes the
# digest line.
#
# THE COURSE IN ONE SENTENCE. A resources estimate is a stated set of facts,
# forecasts and distributions that can be written down and computed, so the
# course teaches the resources classes, the categories and the low estimate as
# the P90, the resources framework and the Nigerian terms in words at
# Associate; the project maturity sub-classes, the seven commerciality
# criteria, incremental and cumulative categories, the economic limit with 1P
# set to 0 when the low case fails, entitlement and licence expiry at
# Professional; and arithmetic and probabilistic aggregation (the 2011
# Application Guidelines' two blocks, correlation, the SEC summation rule),
# risked quantities, reconciliation, the two economic-limit rules and why the
# engine refuses where they disagree, and what the engine does not compute at
# Expert; and grades each tier on its own question with numbers the engine
# returns.
#
# TIER OWNERSHIP, drawn along the engine's own functions:
#
#   Associate    CLASSES, CATEGORIES AND THE LOW ESTIMATE. The resources
#                framework and the project as the unit; the sources, their
#                editions and licences and the date each was read;
#                discovered and undiscovered, Prospective Resources with the
#                chance of geologic discovery, the chance of development and
#                their product, the unrecoverable quantities (classify); what
#                makes a project commercial in words, Contingent Resources and
#                Reserves with the reserves status; the low, best and high
#                estimates and their categories 1P/2P/3P, 1C/2C/3C, 1U/2U/3U
#                (categorize); exceedance probability and the P90 as the low
#                estimate (lib/conventions/percentile.js); the Nigerian terms
#                in words (PIA 2021 s.78(8), (9), (13), (15), s.79(1), s.318
#                and s.7(i); S.I. No. 37 of 2023 regs 3, 4, 6(3) and 7).
#   Professional MATURITY, COMMERCIALITY AND THE ECONOMIC LIMIT. The project
#                maturity sub-classes and the facts that set them; the seven
#                commerciality criteria and the firm intention, the five-year
#                benchmark; incremental and cumulative categories; the
#                economic limit of three technical forecasts through the
#                canonical cashflow.ts, the economic test and 1P = 0 when
#                the low case fails (economicLimit); entitlement on the
#                gross, working-interest and net-entitlement bases, a royalty
#                interest against a production tax, BOE; licence expiry and
#                renewal.
#   Expert       AGGREGATION, RECONCILIATION AND THE LIMITS. Arithmetic
#                summation by category and the SEC rule (17 CFR
#                229.1202(a)(3)); probabilistic aggregation through the
#                canonical seeded Monte Carlo (aggregate), the 2011
#                Application Guidelines' Table 6.2 reproduced with normal
#                marginals as the Guidelines' own reading, correlation, the
#                mean of a total; risked quantities and classes kept apart;
#                the reconciliation of a category set with its closing check
#                (reconcile); the two economic-limit rules and why the engine
#                refuses where they disagree; the boundaries; what the engine
#                does not compute and the reserves report.
#
# A higher tier may USE a lower tier's methods (a Professional economic limit
# is categorised as an Associate category table), and each capstone grades
# only its own question.
#
# SCOPE SEAMS, recorded so no lesson re-teaches another course's material:
#   * decline curves and type curves are OWNED BY the dca course; this course
#     takes a technical forecast as a stated input and refers there;
#   * material balance and in-place volumes by it are OWNED BY the mbal course;
#   * volumetric in-place and recoverable estimates are OWNED BY the
#     reservoircalc course (Reservoir Volumetrics);
#   * the cash flow ledger, discounting and NPV as a subject are OWNED BY the
#     cashflow course; this course imports computeCashFlow and applyJV;
#   * the Nigerian fiscal system (royalty rates, taxes) is OWNED BY the pia
#     course; this course states a royalty and a tax rate as inputs;
#   * Monte Carlo methods, distributions and correlation as a subject are
#     OWNED BY the uncertainty course; this course applies the canonical
#     sampler to aggregation.
#
# Panel ids: A the classification calculator (classify and categorize), R the
# reserves calculator (sub-classes and criteria, incremental categories, the
# economic limit and entitlement), X the aggregation calculator (aggregate,
# reconcile, and the economic limit again for the two rules). Every panel takes
# a learner's own inputs, which is how a capstone is worked, and the course
# pages say plainly that the practicals run in these panels.
#
# Titles carry COUNTS only, never a MEASUREMENT, and counts are spelled in
# words: ANY DIGIT in a title fails the check below (so 1P, P90 and the like
# never appear in a title). No em dashes and no "X, not Y" contrastive (nor
# "rather than", ", never" or "instead of") anywhere a learner reads, headings
# and module titles included.
#
# THIS COURSE TEACHES NO REPAIR HISTORY. The lead's decisions on the engine
# (the refusal where the two economic-limit rules disagree, the Guidelines'
# table read with normal marginals, P90 as the low estimate, no PRMS prose
# quoted) landed before its merge and before any lesson was written, so there
# is no history module and no framed history section.
#
# NAMING COLLISIONS, legislated in the digest's vocabulary section:
#   * "reserves" is always the PRMS class (commercial, discovered, remaining);
#     a national or company figure is "reported reserves" with its date;
#   * "resources" alone means all quantities; each class is named in full
#     (Contingent Resources, Prospective Resources);
#   * "P90" is always the low estimate (at least 90 percent probability of
#     being met or exceeded), never a percentile of the high side;
#   * "proved" and "1P" are cumulative, "Proved (P1)" the increment; the same
#     for probable and possible;
#   * "economic limit" is always of a named rule (the canonical trailing trim,
#     or the PRMS cumulative peak) and of a named case;
#   * "risked" always names the chance it is risked by;
#   * "entitlement" is always of a named basis (gross, working interest, net
#     entitlement).
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


A = 'prms-classification-calculator'
R = 'prms-reserves-calculator'
X = 'prms-aggregation-calculator'
PANEL_IDS = [A, R, X]

TIERS = {
 'beginner': [
  ('m01-the-resources-framework', 'The Resources Framework', [
    ('l01-why-a-common-classification', 'Why a common classification', 12, [A]),
    ('l02-sources-and-the-dates-they-were-read', 'Sources and the dates they were read', 13, [A]),
    ('l03-the-ekene-field-and-its-projects', 'The Ekene field and its projects', 13, [A]),
    ('l04-the-project-as-the-unit', 'The project as the unit of classification', 13, [A]),
    ('l05-calculator-panels-and-refusals', 'The calculator panels and the refusals', 14, [A]),
  ]),
  ('m02-discovered-and-undiscovered', 'Discovered and Undiscovered', [
    ('l01-a-known-accumulation', 'A known accumulation', 12, [A]),
    ('l02-prospective-resources', 'Prospective Resources and their sub-classes', 13, [A]),
    ('l03-quantities-no-project-can-recover', 'Quantities no project can recover', 13, [A]),
    ('l04-the-chance-of-commerciality', 'The chance of commerciality', 14, [A]),
  ]),
  ('m03-reserves-and-contingent-resources', 'Reserves and Contingent Resources', [
    ('l01-what-makes-a-project-commercial', 'What makes a project commercial', 12, [A]),
    ('l02-contingent-resources-and-what-holds-them', 'Contingent Resources and what holds them back', 13, [A]),
    ('l03-developed-and-undeveloped-reserves', 'Developed and undeveloped reserves', 13, [A]),
    ('l04-classifying-the-ekene-projects', 'Classifying the Ekene projects', 13, [A]),
  ]),
  ('m04-categories-and-the-range', 'Categories and the Range of Uncertainty', [
    ('l01-low-best-and-high', 'Low, best and high estimates', 12, [A]),
    ('l02-proved-probable-and-possible', 'Proved, probable and possible', 13, [A]),
    ('l03-categories-of-the-other-classes', 'Categories of the other classes', 13, [A]),
    ('l04-when-one-value-describes-the-range', 'When one value describes the range', 12, [A]),
  ]),
  ('m05-the-low-estimate-and-probability', 'The Low Estimate and Probability', [
    ('l01-exceedance-probability', 'Exceedance probability', 12, [A]),
    ('l02-the-low-estimate-carries-the-highest-probability', 'The low estimate carries the highest probability', 13, [A]),
    ('l03-deterministic-and-probabilistic', 'Deterministic and probabilistic methods', 13, [A]),
    ('l04-incremental-and-cumulative-in-words', 'Incremental and cumulative, in words', 13, [A]),
    ('l05-reading-a-category-table', 'Reading a category table', 14, [A]),
  ]),
  ('m06-nigerian-terms-in-words', 'Nigerian Terms in Words', [
    ('l01-declarations-after-an-appraisal', 'Declarations after an appraisal', 12, [A]),
    ('l02-a-significant-discovery-and-its-retention', 'A significant discovery and its retention', 14, [A]),
    ('l03-national-reserves-and-the-commission', 'National reserves and the Commission', 13, [A]),
    ('l04-the-capstone-brief', 'The capstone brief', 13, [A]),
  ]),
 ],
 'intermediate': [
  ('m01-project-maturity-sub-classes', 'Project Maturity Sub-Classes', [
    ('l01-on-production-approved-and-justified', 'On production, approved and justified', 12, [A, R]),
    ('l02-the-investment-decision', 'The investment decision and the sub-class', 13, [R]),
    ('l03-pending-on-hold-unclarified-and-not-viable', 'Pending, on hold, unclarified and not viable', 14, [R]),
    ('l04-prospect-lead-and-play', 'Prospect, lead and play', 12, [R]),
    ('l05-a-sub-class-the-facts-contradict', 'A sub-class the facts contradict', 13, [R]),
  ]),
  ('m02-the-seven-commerciality-criteria', 'The Seven Commerciality Criteria', [
    ('l01-a-plan-money-and-a-time-frame', 'A plan, money and a time-frame', 12, [R]),
    ('l02-economics-market-facilities-and-approvals', 'Economics, a market, facilities and approvals', 13, [R]),
    ('l03-the-five-year-benchmark', 'The five-year benchmark', 13, [R]),
    ('l04-the-firm-intention-to-proceed', 'The firm intention to proceed', 13, [R]),
  ]),
  ('m03-incremental-and-cumulative-categories', 'Incremental and Cumulative Categories', [
    ('l01-increments-of-reserves', 'Increments of reserves', 12, [R]),
    ('l02-building-the-cumulative-from-increments', 'Building the cumulative from increments', 13, [R]),
    ('l03-increments-from-three-forecasts', 'Increments from three forecasts', 13, [R]),
    ('l04-a-zero-increment', 'A zero increment', 13, [R]),
  ]),
  ('m04-the-economic-limit', 'The Economic Limit', [
    ('l01-three-technical-forecasts', 'Three technical forecasts', 12, [R]),
    ('l02-the-canonical-cash-flow-underneath', 'The canonical cash flow underneath', 14, [R]),
    ('l03-trailing-years-cut-at-the-limit', 'Trailing years cut at the limit', 13, [R]),
    ('l04-the-economic-test', 'The economic test', 13, [R]),
    ('l05-the-low-case-that-fails', 'The low case that fails', 13, [R]),
  ]),
  ('m05-entitlement-and-the-reporting-basis', 'Entitlement and the Reporting Basis', [
    ('l01-gross-working-interest-and-net-entitlement', 'Gross, working interest and net entitlement', 12, [R]),
    ('l02-a-royalty-interest-and-a-production-tax', 'A royalty interest and a production tax', 13, [R]),
    ('l03-barrels-of-oil-equivalent', 'Barrels of oil equivalent', 13, [R]),
    ('l04-cash-flows-at-the-working-interest', 'Cash flows at the working interest', 13, [R]),
  ]),
  ('m06-licence-expiry-and-time', 'Licence Expiry and Time', [
    ('l01-production-beyond-the-licence', 'Production beyond the licence', 12, [R]),
    ('l02-when-renewal-is-expected', 'When renewal is expected', 13, [R]),
    ('l03-capital-after-the-expiry', 'Capital after the expiry', 13, [R]),
    ('l04-the-capstone-brief', 'The capstone brief', 13, [R]),
  ]),
 ],
 'advanced': [
  ('m01-arithmetic-aggregation', 'Arithmetic Aggregation', [
    ('l01-summing-by-category', 'Summing by category', 12, [X]),
    ('l02-above-the-field-level', 'Above the field level', 13, [X]),
    ('l03-the-sec-summation-rule', 'The SEC summation rule', 13, [X]),
    ('l04-a-sum-of-low-estimates', 'A sum of low estimates', 13, [X]),
  ]),
  ('m02-probabilistic-aggregation', 'Probabilistic Aggregation', [
    ('l01-the-monte-carlo-underneath', 'The Monte Carlo underneath', 12, [X]),
    ('l02-two-blocks-from-the-application-guidelines', 'Two blocks from the Application Guidelines', 14, [X]),
    ('l03-correlation-between-projects', 'Correlation between projects', 13, [X]),
    ('l04-seed-draws-and-what-is-never-graded', 'Seed, draws and what is never graded', 13, [X]),
    ('l05-the-mean-of-a-total', 'The mean of a total', 12, [X]),
  ]),
  ('m03-risked-quantities-and-classes', 'Risked Quantities and Classes', [
    ('l01-classes-kept-apart', 'Classes kept apart', 12, [X]),
    ('l02-the-risked-mean', 'The risked mean', 13, [X]),
    ('l03-distributions-stated-or-fitted', 'Distributions stated or fitted', 14, [X]),
    ('l04-a-national-total', 'A national total', 13, [X]),
  ]),
  ('m04-reconciliation', 'Reconciliation', [
    ('l01-opening-movements-and-closing', 'Opening, movements and closing', 12, [X]),
    ('l02-production-out-of-every-category', 'Production out of every category', 13, [X]),
    ('l03-revisions-transfers-and-divestments', 'Revisions, transfers and divestments', 13, [X]),
    ('l04-a-reconciliation-that-does-not-close', 'A reconciliation that does not close', 13, [X]),
    ('l05-the-replacement-ratio-and-the-life-index', 'The replacement ratio and the life index', 13, [X]),
  ]),
  ('m05-two-economic-limit-rules', 'Two Economic-Limit Rules', [
    ('l01-the-trailing-trim', 'The trailing trim', 12, [R, X]),
    ('l02-the-cumulative-peak', 'The cumulative peak', 13, [R, X]),
    ('l03-why-the-engine-refuses', 'Why the engine refuses', 14, [X]),
    ('l04-boundaries-rule-by-rule', 'Boundaries, rule by rule', 14, [X]),
  ]),
  ('m06-what-the-engine-does-not-compute', 'What the Engine Does Not Compute', [
    ('l01-what-the-engine-leaves-out', 'What the engine leaves out', 13, [X]),
    ('l02-readings-and-source-quirks', 'Readings and source quirks', 13, [X]),
    ('l03-writing-the-reserves-report', 'Writing the reserves report', 13, [X]),
    ('l04-the-capstone-brief', 'The capstone brief', 13, [X]),
  ]),
 ],
}

TIER_NAMES = {'beginner': 'Associate', 'intermediate': 'Professional', 'advanced': 'Expert'}

# ---------------------------------------------------------------------------
# THE CHECKS THIS FILE RUNS ON ITSELF. `python3 structure.py` prints them;
# `python3 structure.py --modules` prints the module map prms_dump.mjs builds its
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
        print(f'EC11 prms structure: {len(rows)} lessons, '
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
