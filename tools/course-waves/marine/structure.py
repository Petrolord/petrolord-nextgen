# SC4 Offshore & Marine Logistics. Three tiers, six modules each, 26 lessons a
# tier. The fourth course of the academy's supply chain line in the
# `supply_chain` module (path_order 78), after SC3 materials. An APP COURSE:
# the Suite app is the Marine Logistics Planner (Suite #741,
# /dashboard/apps/midstream-downstream/marine-logistics-planner), which runs
# the same engine; the course names it and bridges to it, and every practical
# still runs in the course's own four calculator panels, so a learner without
# a Suite seat can work every exercise.
#
# Engine: engines/supplychain/marineLogistics.js, vendored sha-identical with
# petrolord-engines 110f0a0 (engines PRs #282 and #283) at its canonical path;
# its runtime imports (lib/stats/stats.js for the canonical Monte Carlo:
# mulberry32, triInvCDF, basicStats; lib/conventions/percentile.js for the
# exceedance sentence) were already vendored in NextGen at the same blobs, so
# nothing shared moved (vendor_marine.sh proves it, four proofs a path). The
# engine's own suite passes 212 of 212 on NextGen's copies.
#
# THE DIGEST IS THE ONLY TEACHING TRUTH. digest.txt, built by marine_dump.mjs.
# The oracle, the golden's expected figures, the fixture README, the engine's
# source comments and FINDINGS-marine.md are PROVENANCE. Where they state a
# figure (a published check, a fixture situation, a boundary) the digest
# recomputes it through the engine and prints it; a writer quotes the digest
# line.
#
# THE COURSE IN ONE SENTENCE. Offshore supply is a set of stated routes,
# vessels, cargoes, rates and rules that can be written down and computed, so
# the course teaches voyage time, weather, fuel, the capacity constraints and
# the binding one at Associate; fleet sizing over a period with its rounding
# rules and deck planning by first-fit decreasing at Professional; and shore
# base berth queues (M/M/c by Erlang C, M/D/c by the Cosmetatos
# approximation), the fleet under weather and demand variability through the
# canonical seeded Monte Carlo, the engine's readings and boundaries and what
# it does not compute at Expert; and grades each tier on its own question with
# numbers the engine returns.
#
# TIER OWNERSHIP, drawn along the engine's own functions:
#
#   Associate    VOYAGES, CAPACITY AND THE BINDING CONSTRAINT (voyagePlan).
#                Offshore supply as a system, the sources with their editions,
#                licences and read dates, the Ekene cluster, the units;
#                milk runs and dedicated voyages, legs and sailing hours, port
#                and field time; the stated weather factor and the activities
#                it slows; fuel by activity and the fuel bill; deck area and
#                its usable fraction, deck load, deadweight from the stated
#                densities, a tank per product; utilisation per constraint,
#                the binding constraint and its tie rule, an overloaded voyage.
#   Professional FLEET SIZING AND DECK PLANNING (fleetSize, deckPlan). Demand
#                over a period, demand over capacity per constraint, minimum
#                visits and what drives the voyage count; voyages rounded up
#                or not, voyage days and vessel-days; available days, vessels
#                rounded up, to the nearest or not, spare and short
#                vessel-days, fleet utilisation; deck cargo footprints, the
#                area bound, the lower bound; first-fit decreasing with its tie
#                rule, first fit in the booked order, overflow and its
#                reasons; the published packing examples.
#   Expert       SHORE BASE QUEUES, VARIABILITY AND THE LIMITS (shoreBase,
#                fleetVariability). The working-hour clock, service time,
#                offered load and berth utilisation; Erlang C and M/M/c
#                (Adan and Resing Tables 5.1 and 5.2, Iversen Example 12.3.1,
#                the printed slip at c = 5); M/D/c by the Cosmetatos
#                approximation and the Pollaczek-Khinchin formula at one
#                berth; the berth target; the canonical seeded Monte Carlo of
#                weather and demand, never graded; the twelve-digit tie rule,
#                the boundaries, the printed bound, the published figures that
#                do not reproduce; what the engine does not compute.
#
# A higher tier may USE a lower tier's methods (a Professional fleet is sized
# from Associate voyage days), and each capstone grades only its own question.
#
# SCOPE SEAMS, recorded so no lesson re-teaches another course's material:
#   * the Monte Carlo method, distributions and percentiles as a subject are
#     OWNED BY the uncertainty course; this course applies the canonical
#     sampler to the fleet;
#   * contracting a vessel (day rates, lump sum, reimbursable) is OWNED BY the
#     procurement course; this course states a fuel price and no hire rate;
#   * spares, stock and reorder points are OWNED BY the materials course; this
#     course moves stated cargo;
#   * supplier performance and contract management are OWNED BY the contracts
#     course;
#   * the cash flow ledger, discounting and NPV are OWNED BY the cashflow
#     course; this course discounts nothing.
#
# Panel ids: V the voyage and fleet calculator (voyagePlan and fleetSize), D
# the deck calculator (deckPlan), B the shore base calculator (shoreBase), MC
# the variability calculator (fleetVariability, labelled ungraded with its
# seed and draws). Every panel takes a learner's own inputs, which is how a
# capstone is worked.
#
# Titles carry COUNTS only, never a MEASUREMENT, and counts are spelled in
# words: ANY DIGIT in a title fails the check below. No em dashes and no "X,
# not Y" contrastive (nor "rather than", ", never", "instead of", "and not" or
# "and never") anywhere a learner reads, headings and module titles included.
#
# THIS COURSE TEACHES NO REPAIR HISTORY. The lead's decisions on the engine
# (the seven FINDINGS defaults accepted, the printed slip in Adan and Resing
# Table 5.1 taught as a slip, the Skoko PSV total left out because the rounded
# days do not reproduce it) landed before any lesson was written; that is
# provenance, so there is no history module and no framed history section.
#
# NAMING COLLISIONS, legislated in the digest's vocabulary section:
#   * "voyage" is one sailing from the base and back (a milk run is one voyage
#     through every stop; a dedicated voyage serves one installation);
#   * "capacity" is always of a named constraint (deck area x the usable
#     fraction, deck load, deadweight, a tank);
#   * "binding" is the constraint with the highest utilisation, by the stated
#     tie rule;
#   * "vessel-days" is voyages x voyage days, never vessels x days;
#   * "utilisation" is always of a named thing (a constraint, a deck, the
#     fleet, a berth);
#   * "wait" is the mean wait in the queue on the working-hour clock; the time
#     at the base adds the service;
#   * "P90" of a requirement or a cost is the LOW figure.
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


V = 'marine-voyage-calculator'
D = 'marine-deck-calculator'
B = 'marine-base-calculator'
MC = 'marine-variability-calculator'
PANEL_IDS = [V, D, B, MC]

TIERS = {
 'beginner': [
  ('m01-offshore-supply-as-a-system', 'Offshore Supply as a System', [
    ('l01-why-offshore-supply-is-planned', 'Why offshore supply is planned', 12, [V]),
    ('l02-sources-and-the-dates-they-were-read', 'Sources and the dates they were read', 13, [V]),
    ('l03-the-ekene-cluster-and-its-supply-base', 'The Ekene cluster and its supply base', 13, [V]),
    ('l04-nautical-miles-knots-hours-and-tonnes', 'Nautical miles, knots, hours and tonnes', 13, [V]),
    ('l05-calculator-panels-and-refusals', 'The calculator panels and the refusals', 14, [V]),
  ]),
  ('m02-routes-and-voyage-time', 'Routes and Voyage Time', [
    ('l01-milk-runs-and-dedicated-voyages', 'Milk runs and dedicated voyages', 12, [V]),
    ('l02-legs-and-sailing-hours', 'Legs and sailing hours', 13, [V]),
    ('l03-port-and-field-time', 'Port and field time', 13, [V]),
    ('l04-the-voyage-in-days', 'The voyage in days', 13, [V]),
  ]),
  ('m03-weather-and-fuel', 'Weather and Fuel', [
    ('l01-a-stated-weather-factor', 'A stated weather factor', 12, [V]),
    ('l02-which-activities-the-weather-slows', 'Which activities the weather slows', 13, [V]),
    ('l03-fuel-burn-by-activity', 'Fuel burn by activity', 13, [V]),
    ('l04-the-fuel-bill', 'The fuel bill', 13, [V]),
  ]),
  ('m04-deck-and-bulk-capacity', 'Deck and Bulk Capacity', [
    ('l01-deck-area-in-square-metres', 'Deck area in square metres', 12, [V]),
    ('l02-the-usable-fraction-of-the-deck', 'The usable fraction of the deck', 13, [V]),
    ('l03-deck-load-and-deadweight', 'Deck load and deadweight', 13, [V]),
    ('l04-bulk-tanks-by-product', 'Bulk tanks by product', 13, [V]),
  ]),
  ('m05-the-binding-constraint', 'The Binding Constraint', [
    ('l01-utilisation-per-constraint', 'Utilisation per constraint', 12, [V]),
    ('l02-the-binding-constraint-and-its-ties', 'The binding constraint and its ties', 13, [V]),
    ('l03-an-overloaded-voyage', 'An overloaded voyage', 13, [V]),
    ('l04-a-tank-the-vessel-does-not-have', 'A tank the vessel does not have', 13, [V]),
    ('l05-reading-a-voyage-plan', 'Reading a voyage plan', 14, [V]),
  ]),
  ('m06-planning-a-voyage-end-to-end', 'Planning a Voyage End to End', [
    ('l01-a-psv-and-an-ahts-on-one-route', 'A PSV and an AHTS on one route', 12, [V]),
    ('l02-calm-and-rainy-season', 'Calm weather and the rainy season', 13, [V]),
    ('l03-checking-a-plan-before-it-sails', 'Checking a plan before it sails', 13, [V]),
    ('l04-the-capstone-brief', 'The capstone brief', 13, [V]),
  ]),
 ],
 'intermediate': [
  ('m01-demand-over-a-period', 'Demand over a Period', [
    ('l01-weekly-demand-per-installation', 'Weekly demand per installation', 12, [V]),
    ('l02-demand-over-capacity-per-constraint', 'Demand over capacity per constraint', 13, [V]),
    ('l03-minimum-visits', 'Minimum visits', 13, [V]),
    ('l04-what-drives-the-voyage-count', 'What drives the voyage count', 13, [V]),
  ]),
  ('m02-voyages-and-vessel-days', 'Voyages and Vessel-Days', [
    ('l01-rounding-voyages-up-or-not-at-all', 'Rounding voyages up or not at all', 12, [V]),
    ('l02-voyage-days-and-vessel-days', 'Voyage days and vessel-days', 13, [V]),
    ('l03-dedicated-voyages-sized-one-by-one', 'Dedicated voyages sized one by one', 13, [V]),
    ('l04-a-voyage-longer-than-the-days-available', 'A voyage longer than the days available', 13, [V]),
  ]),
  ('m03-vessels-required', 'Vessels Required', [
    ('l01-available-days-and-the-period', 'Available days and the period', 12, [V]),
    ('l02-rounding-vessels', 'Rounding vessels up, to the nearest or not at all', 13, [V]),
    ('l03-spare-and-short-vessel-days', 'Spare and short vessel-days', 13, [V]),
    ('l04-fleet-utilisation-and-fuel-for-the-period', 'Fleet utilisation and fuel for the period', 13, [V]),
    ('l05-a-psv-or-an-ahts-for-the-same-demand', 'A PSV or an AHTS for the same demand', 14, [V]),
  ]),
  ('m04-deck-cargo-and-footprints', 'Deck Cargo and Footprints', [
    ('l01-items-footprints-and-units', 'Items, footprints and units', 12, [D]),
    ('l02-the-area-bound-with-no-stacking', 'The area bound with no stacking', 13, [D]),
    ('l03-the-lower-bound-on-voyages', 'The lower bound on voyages', 13, [D]),
    ('l04-what-the-area-bound-leaves-out', 'What the area bound leaves out', 13, [D]),
  ]),
  ('m05-first-fit-decreasing', 'First-Fit Decreasing', [
    ('l01-sorting-by-area', 'Sorting by area', 12, [D]),
    ('l02-the-first-voyage-that-holds-a-unit', 'The first voyage that holds a unit', 13, [D]),
    ('l03-ties-go-to-the-heavier-unit', 'Ties go to the heavier unit', 13, [D]),
    ('l04-first-fit-in-the-booked-order', 'First fit in the booked order', 13, [D]),
    ('l05-overflow-and-its-reasons', 'Overflow and its reasons', 14, [D]),
  ]),
  ('m06-published-packing-examples', 'Published Packing Examples', [
    ('l01-two-capacities-one-list', 'Two capacities, one list', 12, [D]),
    ('l02-when-a-larger-deck-needs-more-voyages', 'When a larger deck needs more voyages', 13, [D]),
    ('l03-a-tight-worst-case', 'A tight worst case', 13, [D]),
    ('l04-the-capstone-brief', 'The capstone brief', 13, [V, D]),
  ]),
 ],
 'advanced': [
  ('m01-the-shore-base-as-a-queue', 'The Shore Base as a Queue', [
    ('l01-berths-arrivals-and-service', 'Berths, arrivals and service', 12, [B]),
    ('l02-the-working-hour-clock', 'The working-hour clock', 13, [B]),
    ('l03-fixed-hours-lifts-and-bulk', 'Fixed hours, lifts and bulk', 13, [B]),
    ('l04-offered-load-and-berth-utilisation', 'Offered load and berth utilisation', 13, [B]),
  ]),
  ('m02-erlang-c-and-mmc', 'Erlang C and M/M/c', [
    ('l01-the-probability-of-waiting', 'The probability of waiting', 12, [B]),
    ('l02-mean-wait-and-mean-queue', 'Mean wait and mean queue', 13, [B]),
    ('l03-littles-law-at-the-base', "Little's law at the base", 13, [B]),
    ('l04-the-published-tables', 'The published tables', 14, [B]),
    ('l05-a-printed-figure-that-misses-its-rounding', 'A printed figure that misses its rounding', 13, [B]),
  ]),
  ('m03-constant-service-and-mdc', 'Constant Service and M/D/c', [
    ('l01-a-constant-service-time', 'A constant service time', 12, [B]),
    ('l02-an-approximation-for-several-berths', 'An approximation for several berths', 13, [B]),
    ('l03-one-berth-and-the-exact-formula', 'One berth and the exact formula', 13, [B]),
    ('l04-how-many-berths-meet-a-target', 'How many berths meet a target', 13, [B]),
  ]),
  ('m04-weather-and-demand-variability', 'Weather and Demand Variability', [
    ('l01-the-monte-carlo-underneath', 'The Monte Carlo underneath', 12, [MC]),
    ('l02-two-factors-drawn-in-order', 'Two factors drawn in order', 13, [MC]),
    ('l03-vessels-required-as-a-distribution', 'Vessels required as a distribution', 13, [MC]),
    ('l04-the-chance-of-being-short', 'The chance of being short', 13, [MC]),
    ('l05-seed-draws-and-what-is-never-graded', 'Seed, draws and what is never graded', 13, [MC]),
  ]),
  ('m05-readings-and-boundaries', 'Readings and Boundaries', [
    ('l01-the-twelve-digit-tie-rule', 'The twelve-digit tie rule', 12, [B, MC]),
    ('l02-boundaries-rule-by-rule', 'Boundaries, rule by rule', 14, [B, MC]),
    ('l03-a-printed-bound-on-the-accepted-side', 'A printed bound on the accepted side', 13, [B]),
    ('l04-published-figures-that-do-not-reproduce', 'Published figures that do not reproduce', 13, [B]),
  ]),
  ('m06-what-the-engine-does-not-compute', 'What the Engine Does Not Compute', [
    ('l01-what-the-engine-leaves-out', 'What the engine leaves out', 13, [B, MC]),
    ('l02-size-caps-and-refusals-at-scale', 'Size caps and refusals at scale', 13, [B, MC]),
    ('l03-writing-the-logistics-plan', 'Writing the logistics plan', 13, [B, MC]),
    ('l04-the-capstone-brief', 'The capstone brief', 13, [B]),
  ]),
 ],
}

TIER_NAMES = {'beginner': 'Associate', 'intermediate': 'Professional', 'advanced': 'Expert'}

# ---------------------------------------------------------------------------
# THE CHECKS THIS FILE RUNS ON ITSELF. `python3 structure.py` prints them;
# `python3 structure.py --modules` prints the module map marine_dump.mjs builds its
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
            problems.append(f'{tier}: title carries a digit, which is a measurement and no count: {t}')
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
    own = {'beginner': [V], 'intermediate': [V, D], 'advanced': [B, MC]}
    for tier, pids in own.items():
        n = sum(1 for r in rows if r[0] == tier and any(p in r[8] for p in pids))
        if n < 13:
            problems.append(f'{tier}: its own panels {pids} are tagged on only {n} lessons')
    # NO FORWARD PANEL: a lower tier never tags a higher tier's panel.
    rank = {V: 0, D: 1, B: 2, MC: 2}
    trank = {'beginner': 0, 'intermediate': 1, 'advanced': 2}
    for r in rows:
        for pid in r[8]:
            if rank[pid] > trank[r[0]]:
                problems.append(f'{r[0]}/{r[5]} tags the higher tier panel {pid}')
    if not quiet:
        minutes = sorted({r[7] for r in rows})
        print(f'SC4 marine structure: {len(rows)} lessons, '
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
