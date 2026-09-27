# SC3 Materials, Spares & Inventory Management. Three tiers, six modules
# each, 26 lessons a tier. The third course of the academy's `supply_chain`
# module (path_order 77), after SC2 procurement. An APP COURSE: the Suite app
# is the Materials & Spares Planner (Suite #740, merged ce912b35b, route
# /dashboard/apps/midstream-downstream/materials-spares-planner), and the
# course's own calculator panels carry every practical for a learner without a
# Suite seat, over the same vendored engine.
#
# Engine: engines/supplychain/inventory.js, vendored sha-identical with
# petrolord-engines 110f0a0 (engines PRs #281 and #283) at its canonical path;
# its runtime imports (lib/stats/stats.js for the canonical Monte Carlo,
# lib/conventions/percentile.js for the P90/P50/P10 labels,
# engines/hse/safetyStats.js for the regularised incomplete gamma behind Phi)
# were already vendored in NextGen at the same blobs, so nothing shared moved
# (vendor_materials.sh proves it, four proofs a path). The engine's own suite
# passes 216 of 216 on NextGen's copies.
#
# THE DIGEST IS THE ONLY TEACHING TRUTH. digest.txt, built by
# materials_dump.mjs. The oracle, the golden's expected figures, the fixture
# README, the engine's source comments and FINDINGS-inventory.md are
# PROVENANCE. Where they state a figure (a published check, a fixture
# situation, a boundary) the digest recomputes it through the engine and prints
# it; a writer quotes the digest line.
#
# THE COURSE IN ONE SENTENCE. A stock policy is a stated set of criteria,
# costs, demands, lead times, service targets and bands that can be written
# down and computed, so the course teaches the materials register, criticality
# classes, ABC by annual usage value, the economic order quantity with its
# stated rounding and slow-moving and obsolete stock at Associate; quantity
# discounts, demand over the lead time, the cycle service level, the fill rate,
# periodic review and Poisson demand for slow movers at Professional; and
# insurance spares, the Poisson anchor, lead-time risk by the canonical Monte
# Carlo, stockouts and the reorder point, the readings, ties and boundaries,
# and what the engine does not compute at Expert; and grades each tier on its
# own question with numbers the engine returns.
#
# TIER OWNERSHIP, drawn along the engine's own functions:
#
#   Associate    CRITICALITY, CLASSES AND THE ORDER QUANTITY. criticality,
#                abcClassification, eoq and slowMoving.
#   Professional SERVICE LEVELS, SAFETY STOCK AND DISCOUNTS. quantityDiscount,
#                safetyStock (cycle service, fill rate, periodic review) and
#                poissonStock.
#   Expert       SPARES, LEAD-TIME RISK AND THE LIMITS. insuranceSpares, the
#                MIL-HDBK-338B Poisson anchor, leadTimeRisk (seeded Monte
#                Carlo, never graded), stockouts and the reorder point for a
#                service level, the readings, ties and boundaries, the caps
#                and what the engine does not compute.
#
# A higher tier may USE a lower tier's methods, and each capstone grades only
# its own question.
#
# SCOPE SEAMS, recorded so no lesson re-teaches another course's material:
#   * tendering, bid evaluation and contract types are OWNED BY the procurement
#     course (SC2); this course takes a stated price schedule as an input;
#   * terminal and depot stock, product supply and tankage are OWNED BY the
#     supply course (Terminals, Depots & Fuel Supply);
#   * failure rates from field data and reliability modelling are OWNED BY the
#     rotating course and the reliability parts of the academy; this course
#     takes a failure rate as a stated input;
#   * distributions and Monte Carlo as a subject are OWNED BY the uncertainty
#     course; this course applies the canonical sampler to lead-time risk;
#   * discounting and NPV are OWNED BY the cashflow course; nothing here is
#     discounted.
#
# Panel ids: G the register calculator (criticality, abcClassification, eoq,
# slowMoving), S the stock calculator (quantityDiscount, safetyStock,
# poissonStock), P the spares calculator (insuranceSpares, leadTimeRisk,
# poissonStock for a spare, and the readings view). Every panel takes a
# learner's own inputs, which is how a capstone is worked; the Suite app
# carries the same functions for a learner with a Suite seat.
#
# Titles carry COUNTS only, never a MEASUREMENT, and counts are spelled in
# words: ANY DIGIT in a title fails the check below. No em dashes and no
# "X, not Y" contrastive (nor "rather than", ", never", "instead of", "and
# not", "and never") anywhere a learner reads, headings and module titles
# included.
#
# THIS COURSE TEACHES NO REPAIR HISTORY. The lead's decisions on the engine
# (the one-for-one insurance model stated as the engine's model, the two
# printed slips taught as slips, MIT OpenCourseWare cited by lecture and slide
# and never reproduced) landed before any lesson was written, so there is no
# history module and no framed history section.
#
# NAMING COLLISIONS, legislated in the digest's vocabulary section:
#   * "service level" always names its measure (cycle service level or fill
#     rate);
#   * "safety stock" is k times sigma over the protection period; the reorder
#     point and the order-up-to level are named as such;
#   * "EOQ" is the unrounded Q*; the quantity ordered is the rounded one;
#   * "criticality class" (V, E, D in the Ekene policy) is never the ABC class;
#   * "P90" of a sampled lead time or demand is the low figure;
#   * "obsolete", "slow" and "excess" are always of a stated band or limit;
#   * "insurance spare" is always of the stated one-for-one model.
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


G = 'materials-register-calculator'
S = 'materials-stock-calculator'
P = 'materials-spares-calculator'
PANEL_IDS = [G, S, P]

TIERS = {
 'beginner': [
  ('m01-materials-and-the-register', 'Materials and the Register', [
    ('l01-why-a-materials-register', 'Why a materials register', 12, [G]),
    ('l02-sources-and-the-dates-they-were-read', 'Sources and the dates they were read', 13, [G]),
    ('l03-the-ekene-register-and-its-items', 'The Ekene register and its items', 13, [G]),
    ('l04-a-stated-policy-for-every-figure', 'A stated policy for every figure', 13, [G]),
    ('l05-calculator-panels-the-planner-and-refusals', 'The calculator panels, the planner and the refusals', 14, [G]),
  ]),
  ('m02-criticality', 'Criticality', [
    ('l01-criteria-and-weights', 'Criteria and weights', 12, [G]),
    ('l02-the-weighted-score', 'The weighted score', 13, [G]),
    ('l03-classes-and-their-minimums', 'Classes and their minimums', 13, [G]),
    ('l04-the-safety-override', 'The safety override', 13, [G]),
  ]),
  ('m03-abc-by-annual-usage-value', 'ABC by Annual Usage Value', [
    ('l01-annual-usage-value', 'Annual usage value', 12, [G]),
    ('l02-ranking-and-the-cumulative-share', 'Ranking and the cumulative share', 13, [G]),
    ('l03-the-item-that-crosses-a-cut-off', 'The item that crosses a cut-off', 13, [G]),
    ('l04-criticality-and-abc-side-by-side', 'Criticality and ABC side by side', 13, [G]),
  ]),
  ('m04-the-economic-order-quantity', 'The Economic Order Quantity', [
    ('l01-ordering-cost-and-holding-cost', 'Ordering cost and holding cost', 12, [G]),
    ('l02-harris-and-the-lot-size', 'Harris and the lot size', 13, [G]),
    ('l03-the-square-root-formula', 'The square root formula', 13, [G]),
    ('l04-the-relevant-cost-at-the-optimum', 'The relevant cost at the optimum', 13, [G]),
    ('l05-three-lots-from-a-trade-magazine', 'Three lots from a trade magazine', 14, [G]),
  ]),
  ('m05-rounding-and-the-flat-bottom', 'Rounding and the Flat Bottom', [
    ('l01-a-stated-rounding-rule', 'A stated rounding rule', 12, [G]),
    ('l02-the-cost-of-rounding', 'The cost of rounding', 13, [G]),
    ('l03-halves-upward', 'Halves upward', 13, [G]),
    ('l04-holding-cost-as-a-rate-or-a-figure', 'Holding cost as a rate or a figure', 13, [G]),
  ]),
  ('m06-slow-moving-and-obsolete-stock', 'Slow-Moving and Obsolete Stock', [
    ('l01-months-since-the-last-issue', 'Months since the last issue', 12, [G]),
    ('l02-bands-and-write-downs', 'Bands and write-downs', 13, [G]),
    ('l03-cover-and-excess', 'Cover and excess', 13, [G]),
    ('l04-the-capstone-brief', 'The capstone brief', 13, [G]),
  ]),
 ],
 'intermediate': [
  ('m01-quantity-discounts', 'Quantity Discounts', [
    ('l01-a-price-schedule', 'A price schedule', 12, [G, S]),
    ('l02-all-units-discounts', 'All-units discounts', 13, [S]),
    ('l03-incremental-discounts', 'Incremental discounts', 14, [S]),
    ('l04-candidates-and-the-lowest-total-cost', 'Candidates and the lowest total cost', 13, [S]),
    ('l05-rounding-against-the-breaks', 'Rounding against the breaks', 12, [S]),
  ]),
  ('m02-demand-over-the-lead-time', 'Demand over the Lead Time', [
    ('l01-continuous-review-and-the-reorder-point', 'Continuous review and the reorder point', 12, [S]),
    ('l02-demand-and-lead-time-variation', 'Demand and lead-time variation', 13, [S]),
    ('l03-sigma-over-the-protection-period', 'Sigma over the protection period', 13, [S]),
    ('l04-the-choke-bean-set', 'The choke bean set', 13, [S]),
  ]),
  ('m03-the-cycle-service-level', 'The Cycle Service Level', [
    ('l01-the-probability-of-no-stockout', 'The probability of no stockout', 12, [S]),
    ('l02-the-safety-factor-from-the-inverse-normal', 'The safety factor from the inverse normal', 13, [S]),
    ('l03-a-safety-factor-read-from-a-table', 'A safety factor read from a table', 13, [S]),
    ('l04-the-published-safety-stocks', 'The published safety stocks', 14, [S]),
  ]),
  ('m04-the-fill-rate', 'The Fill Rate', [
    ('l01-units-short-per-cycle', 'Units short per cycle', 12, [S]),
    ('l02-the-unit-normal-loss', 'The unit normal loss', 13, [S]),
    ('l03-solving-for-the-safety-factor', 'Solving for the safety factor', 13, [S]),
    ('l04-a-printed-figure-that-is-a-slip', 'A printed figure that is a slip', 13, [S]),
  ]),
  ('m05-periodic-review', 'Periodic Review', [
    ('l01-the-review-period', 'The review period', 12, [S]),
    ('l02-the-order-up-to-level', 'The order-up-to level', 13, [S]),
    ('l03-a-floor-on-the-safety-factor', 'A floor on the safety factor', 13, [S]),
    ('l04-certain-demand', 'Certain demand', 12, [S]),
  ]),
  ('m06-poisson-demand-for-slow-movers', 'Poisson Demand for Slow Movers', [
    ('l01-when-the-normal-does-not-fit', 'When the normal does not fit', 12, [S]),
    ('l02-the-poisson-table', 'The Poisson table', 13, [S]),
    ('l03-cycle-service-on-a-poisson', 'Cycle service on a Poisson', 13, [S]),
    ('l04-fill-rate-and-the-loss-recursion', 'Fill rate and the loss recursion', 14, [S]),
    ('l05-the-capstone-brief', 'The capstone brief', 13, [S]),
  ]),
 ],
 'advanced': [
  ('m01-insurance-spares', 'Insurance Spares', [
    ('l01-a-spare-held-against-failure', 'A spare held against failure', 12, [P]),
    ('l02-orders-outstanding-one-for-one', 'Orders outstanding, one for one', 13, [P]),
    ('l03-holding-against-downtime', 'Holding against downtime', 13, [P]),
    ('l04-the-marginal-spare', 'The marginal spare', 13, [P]),
    ('l05-the-esp-motor', 'The ESP motor', 14, [P]),
  ]),
  ('m02-the-poisson-anchor', 'The Poisson Anchor', [
    ('l01-the-handbook-lamps', 'The handbook lamps', 12, [P]),
    ('l02-no-shortage-and-the-fill-rate', 'No shortage and the fill rate', 13, [P]),
    ('l03-expected-units-down', 'Expected units down', 13, [P]),
    ('l04-the-search-limit', 'The search limit', 13, [P]),
  ]),
  ('m03-lead-time-risk-by-monte-carlo', 'Lead-Time Risk by Monte Carlo', [
    ('l01-the-canonical-sampler', 'The canonical sampler', 12, [P]),
    ('l02-the-lead-time-drawn-first', 'The lead time drawn first', 13, [P]),
    ('l03-the-low-figure-and-the-high-figure', 'The low figure and the high figure', 13, [P]),
    ('l04-seed-draws-and-what-is-never-graded', 'Seed, draws and what is never graded', 13, [P]),
  ]),
  ('m04-stockouts-and-the-reorder-point', 'Stockouts and the Reorder Point', [
    ('l01-demand-equal-to-the-stock', 'Demand equal to the stock', 12, [P]),
    ('l02-a-reorder-point-for-a-service-level', 'A reorder point for a service level', 13, [P]),
    ('l03-the-mechanical-seal', 'The mechanical seal', 13, [P]),
    ('l04-constant-inputs', 'Constant inputs', 12, [P]),
  ]),
  ('m05-readings-ties-and-boundaries', 'Readings, Ties and Boundaries', [
    ('l01-twelve-significant-digits', 'Twelve significant digits', 12, [S, P]),
    ('l02-ties-and-the-smaller-choice', 'Ties and the smaller choice', 13, [S, P]),
    ('l03-boundaries-rule-by-rule', 'Boundaries, rule by rule', 14, [P]),
    ('l04-readings-and-source-quirks', 'Readings and source quirks', 13, [P]),
  ]),
  ('m06-what-the-engine-does-not-compute', 'What the Engine Does Not Compute', [
    ('l01-what-the-engine-leaves-out', 'What the engine leaves out', 13, [P]),
    ('l02-size-caps-and-refusals', 'Size caps and refusals', 12, [P]),
    ('l03-conventions-that-are-choices', 'Conventions that are choices', 13, [P]),
    ('l04-writing-the-stock-policy', 'Writing the stock policy', 13, [P]),
    ('l05-the-capstone-brief', 'The capstone brief', 13, [P]),
  ]),
 ],
}

TIER_NAMES = {'beginner': 'Associate', 'intermediate': 'Professional', 'advanced': 'Expert'}

# ---------------------------------------------------------------------------
# THE CHECKS THIS FILE RUNS ON ITSELF. `python3 structure.py` prints them;
# `python3 structure.py --modules` prints the module map materials_dump.mjs builds its
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
        if re.search(r',\s+not\s+\w|\brather than\b|,\s+never\b|\binstead of\b|\band not\b|\band never\b', t, re.I):
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
    own = {'beginner': G, 'intermediate': S, 'advanced': P}
    for tier, pid in own.items():
        n = sum(1 for r in rows if r[0] == tier and pid in r[8])
        if n < 13:
            problems.append(f'{tier}: its own panel {pid} is tagged on only {n} lessons')
    # NO FORWARD PANEL: a lower tier never tags a higher tier's panel.
    rank = {G: 0, S: 1, P: 2}
    trank = {'beginner': 0, 'intermediate': 1, 'advanced': 2}
    for r in rows:
        for pid in r[8]:
            if rank[pid] > trank[r[0]]:
                problems.append(f'{r[0]}/{r[5]} tags the higher tier panel {pid}')
    if not quiet:
        minutes = sorted({r[7] for r in rows})
        print(f'SC3 materials structure: {len(rows)} lessons, '
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
