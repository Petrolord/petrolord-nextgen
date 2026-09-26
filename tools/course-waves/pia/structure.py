#!/usr/bin/env python3
# EC7 Petroleum Industry Act 2021 & Nigerian Fiscal Terms (slug `pia`). Three
# tiers, six modules each, 26 lessons a tier, in the academy's `economics`
# module (path_order 72). An ENGINE COURSE: there is no Suite app, and every
# practical runs in the course's own calculator panels over the vendored engine.
#
# Engine: engines/economics/cashflow.ts at ENGINE_VERSION 3.12.0, vendored
# sha-identical with petrolord-engines 3778451 (engines PR #262, the PIA 2021 /
# NTA 2025 compliance repair), already on NextGen origin/main through the
# cashflow and fiscal re-cut (NextGen #266, VENDOR.json group ec7-pia-recut).
# This course adds no vendored file. fiscalConventions.js supplies the take
# wording, so it cannot drift from the fiscal course.
#
# THE DIGEST IS THE ONLY TEACHING TRUTH. digest.txt, built by pia_dump.mjs.
# The audit, FINDINGS-pia2021.md, the oracle and the engine's source comments
# are PROVENANCE. The gazetted texts are quoted only where the digest prints
# the quotation with its citation.
#
# THE COURSE IN ONE SENTENCE. The Petroleum Industry Act 2021 is a system that
# decides which instrument applies, to whom, on what base and since when, so
# the course teaches the map (institutions, licences, terrains, royalty by
# terrain, volume and price, and the instruments stacked on one year) at
# Associate; the hydrocarbon tax as a system (the tranches, what the tax
# charges, deductions and the cost price ratio, the allowances and companies
# income tax beside it) at Professional; and the transitions (conversion, the
# Nigeria Tax Act 2025 moved and changed, gas and incentives) with the reading
# of a fiscal outcome by provision at Expert; and grades each tier on its own
# question with numbers the engine returns.
#
# SCOPE SEAMS, recorded so no lesson re-teaches another course's material:
#   * the ledger arithmetic (discounting, NPV, IRR, payback, the order of the
#     ledger rows, loss-pool arithmetic, working-interest scaling) is OWNED BY
#     the cash flow course (`cashflow`); this course names the provision behind
#     a line and refers there for the arithmetic;
#   * fiscal regime design (the four instruments in the abstract, sliding
#     scales, R-factors, templates and progressivity) is OWNED BY the fiscal
#     course (`fiscal`); the take wording comes from fiscalConventions.js;
#   * procurement and the 2010 content Act are OWNED BY the procurement course.
#
# Panel ids: R the royalty calculator (terrain, volume, price and gas royalty,
# and the instruments on one ledger), H the hydrocarbon tax calculator (the
# tranches, the tax rate, the cost price ratio, the allowances and CIT on a
# ledger), L the ledger calculator (the framework year by year, the stated
# readings side by side, the decomposition by provision). Every panel takes a
# learner's own terms and rows, which is how a capstone is worked, and the
# course pages say plainly that the practicals run in these panels.
#
# Titles carry COUNTS only, never a MEASUREMENT, and counts are spelled in
# words: ANY DIGIT in a title fails the check below. No em dashes and no
# "X, not Y" contrastive anywhere a learner reads.
#
# THIS COURSE TEACHES NO REPAIR HISTORY. The engine was brought into line with
# the gazetted texts before any lesson was written; the course describes the
# engine as it is.
#
# OPEN READINGS, taught as open questions and never graded: the royalty by
# price base year (the Act's 2020 against the Regulations' 2021), the
# hydrocarbon tax rate of a new-acreage petroleum mining lease onshore or in
# shallow water (15 or 30), and the deep offshore hydrocarbon tax under the
# Nigeria Tax Act 2025 (three readings). Every graded figure is the same under
# every reading, and discriminate.mjs proves it.
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


R = 'pia-royalty-calculator'
H = 'pia-hct-calculator'
L = 'pia-ledger-calculator'
PANEL_IDS = [R, H, L]

TIERS = {
 'beginner': [
  ('m01-who-decides-what', 'Who Decides What', [
    ('l01-the-act-as-a-system', 'The Act as a system', 12, [R]),
    ('l02-the-commission-the-authority-and-the-service', 'The Commission, the Authority and the Service', 13, [R]),
    ('l03-who-assesses-and-collects-what', 'Who assesses and collects what', 13, [R]),
    ('l04-where-the-money-lands', 'Where the money lands', 12, [R]),
    ('l05-sources-editions-and-the-panels', 'Sources, editions and the calculator panels', 14, [R]),
  ]),
  ('m02-licences-leases-and-terrains', 'Licences, Leases and Terrains', [
    ('l01-exploration-prospecting-and-mining', 'Exploration, prospecting and mining licences', 13, [R]),
    ('l02-four-terrains', 'Four terrains', 13, [R]),
    ('l03-the-water-depth-line', 'The water depth line and the terrain string', 12, [R]),
    ('l04-converted-and-new-leases', 'Converted and new leases', 13, [R]),
    ('l05-the-ekene-cases', 'The Ekene cases and what the engine asks for', 14, [R]),
  ]),
  ('m03-royalty-by-terrain', 'Royalty by Terrain', [
    ('l01-terrain-rates-and-the-small-field-tranches', 'Terrain rates and the small field tranches', 14, [R]),
    ('l02-condensate-gas-and-liquids', 'Condensate, gas and natural gas liquids', 12, [R]),
    ('l03-gas-royalty-and-in-country-use', 'The gas royalty and in-country use', 13, [R]),
    ('l04-the-daily-rate-the-tranches-read', 'The daily rate the tranches read', 13, [R]),
  ]),
  ('m04-royalty-by-price', 'Royalty by Price', [
    ('l01-the-shape-of-the-royalty-by-price', 'The shape of the royalty by price', 13, [R]),
    ('l02-benchmarks-that-escalate', 'Benchmarks that escalate every year', 13, [R]),
    ('l03-two-readings-of-the-base-year', 'Two readings of the base year', 14, [R]),
    ('l04-frontier-acreage-and-who-receives-it', 'Frontier acreage and who receives it', 12, [R]),
  ]),
  ('m05-the-instruments-stacked', 'The Instruments Stacked', [
    ('l01-royalty-tax-levy-and-funds-in-order', 'Royalty, tax, levy and funds in order', 13, [R]),
    ('l02-which-base-each-instrument-reads', 'Which base each instrument reads', 14, [R]),
    ('l03-host-communities-and-the-nddc-levy', 'Host communities and the NDDC levy', 13, [R]),
    ('l04-income-tax-and-the-development-levy', 'Income tax and the development levy', 13, [R]),
    ('l05-government-cash-flow-and-take', 'Government cash flow and take', 13, [R]),
  ]),
  ('m06-the-associate-reading', 'The Associate Reading', [
    ('l01-the-map-so-far', 'The map so far', 12, [R]),
    ('l02-reading-one-ledger-end-to-end', 'Reading one ledger end to end', 14, [R]),
    ('l03-the-capstone-brief', 'The capstone brief', 13, [R]),
  ]),
 ],
 'intermediate': [
  ('m01-the-small-field-tranches', 'The Small Field Tranches', [
    ('l01-onshore-and-shallow-water-tranches', 'Onshore and shallow water tranches', 13, [H]),
    ('l02-the-deep-offshore-tier', 'The deep offshore tier', 13, [H]),
    ('l03-crude-plus-condensate-over-calendar-days', 'Crude plus condensate over calendar days', 13, [H]),
    ('l04-weighted-rates-at-the-tranche-edges', 'Weighted rates at the tranche edges', 14, [R, H]),
    ('l05-fields-that-straddle-terrains', 'Fields that straddle terrains', 12, [H]),
  ]),
  ('m02-what-the-hydrocarbon-tax-charges', 'What the Hydrocarbon Tax Charges', [
    ('l01-crude-condensate-and-liquid-gas', 'Crude, condensate and liquid gas', 13, [H]),
    ('l02-gas-outside-the-tax', 'Gas outside the tax', 12, [H]),
    ('l03-deep-offshore-and-frontier-under-the-act', 'Deep offshore and frontier under the Act', 13, [H]),
    ('l04-the-two-classes-of-rate', 'The two classes of rate', 13, [H]),
    ('l05-an-open-question-for-new-leases', 'An open question for new leases', 14, [H]),
  ]),
  ('m03-deductions-and-the-cost-price-ratio', 'Deductions and the Cost Price Ratio', [
    ('l01-deductible-and-non-deductible-items', 'Deductible and non-deductible items', 13, [H]),
    ('l02-royalties-and-levies-in-the-base', 'Royalties and levies in the base', 13, [H]),
    ('l03-the-cost-price-ratio-cap', 'The cost price ratio cap', 14, [H]),
    ('l04-carrying-cost-forward', 'Carrying cost forward', 13, [H]),
    ('l05-cost-lost-at-cessation', 'Cost lost at cessation', 12, [H]),
  ]),
  ('m04-allowances', 'Allowances', [
    ('l01-capital-allowances-over-five-years', 'Capital allowances over five years', 13, [H]),
    ('l02-the-allowance-for-converted-leases', 'The production allowance for converted leases', 13, [H]),
    ('l03-new-leases-and-the-volume-cap', 'New leases and the volume cap', 14, [H]),
    ('l04-barrels-after-the-cap', 'Barrels after the cap', 13, [H]),
  ]),
  ('m05-income-tax-alongside', 'Companies Income Tax Alongside', [
    ('l01-income-tax-on-oil-and-gas', 'Companies income tax on oil and gas', 13, [H]),
    ('l02-what-the-income-tax-base-deducts', 'What the income tax base deducts', 13, [H]),
    ('l03-the-two-thirds-restriction', 'The two thirds restriction in Act years', 13, [H]),
    ('l04-losses-carried-by-class', 'Losses carried by class', 12, [H]),
  ]),
  ('m06-the-professional-reading', 'The Professional Reading', [
    ('l01-the-tax-so-far', 'The tax so far', 12, [H]),
    ('l02-reading-a-hydrocarbon-tax-year', 'Reading a hydrocarbon tax year', 14, [H]),
    ('l03-the-capstone-brief', 'The capstone brief', 13, [H]),
  ]),
 ],
 'advanced': [
  ('m01-conversion-and-the-legacy-terms', 'Conversion and the Legacy Terms', [
    ('l01-voluntary-conversion', 'Voluntary conversion and its deadline', 13, [L]),
    ('l02-relinquishment-and-the-split', 'Relinquishment and the prospecting and mining split', 13, [L]),
    ('l03-marginal-fields', 'Marginal fields', 13, [L]),
    ('l04-leases-that-do-not-convert', 'Leases that do not convert', 13, [L]),
    ('l05-production-sharing-contracts-under-the-act', 'Production sharing contracts under the Act', 12, [L]),
  ]),
  ('m02-what-the-tax-act-moved', 'What the Nigeria Tax Act Moved', [
    ('l01-deleted-and-re-enacted', 'Deleted and re-enacted', 13, [L]),
    ('l02-the-levy-replaces-the-education-tax', 'The development levy replaces the education tax', 13, [L]),
    ('l03-the-framework-year-by-year', 'The framework read year by year', 14, [L]),
    ('l04-allowances-and-the-restriction-by-year', 'Capital allowance and the restriction by year', 13, [H, L]),
    ('l05-the-gazette-version', 'The gazette version and its date', 12, [L]),
  ]),
  ('m03-what-the-tax-act-changed', 'What the Nigeria Tax Act Changed at the Edges', [
    ('l01-deep-offshore-three-readings', 'Deep offshore under the Tax Act, three readings', 14, [L]),
    ('l02-the-deleted-deep-offshore-allowance', 'The deleted deep offshore allowance', 13, [L]),
    ('l03-the-decommissioning-escrow-condition', 'The decommissioning escrow condition', 13, [L]),
    ('l04-the-minimum-effective-tax-rate', 'The minimum effective tax rate', 13, [L]),
    ('l05-what-did-not-change', 'What did not change', 12, [L]),
  ]),
  ('m04-gas-and-incentives', 'Gas and Incentives', [
    ('l01-gas-royalty-at-the-ledger-level', 'Gas royalty at the ledger level', 13, [R, L]),
    ('l02-associated-and-non-associated-gas', 'Associated and non-associated gas', 13, [L]),
    ('l03-the-greenfield-gas-credit', 'The greenfield gas credit', 12, [L]),
    ('l04-pipeline-and-utilisation-incentives', 'Pipeline and utilisation incentives', 12, [L]),
  ]),
  ('m05-reading-a-fiscal-outcome', 'Reading a Fiscal Outcome', [
    ('l01-government-cash-flow-by-provision', 'Government cash flow by provision', 13, [L]),
    ('l02-which-provision-moved', 'Which provision moved', 14, [L]),
    ('l03-price-year-and-terrain-side-by-side', 'Price, year and terrain side by side', 13, [L]),
    ('l04-stated-readings-and-approximations', 'Stated readings and engine approximations', 13, [L]),
  ]),
  ('m06-the-expert-reading', 'The Expert Reading', [
    ('l01-the-transitions-so-far', 'The transitions so far', 12, [L]),
    ('l02-reading-a-ledger-across-the-switch', 'Reading a ledger across the switch', 14, [L]),
    ('l03-the-capstone-brief', 'The capstone brief', 13, [L]),
  ]),
 ],
}

TIER_NAMES = {'beginner': 'Associate', 'intermediate': 'Professional', 'advanced': 'Expert'}

# ---------------------------------------------------------------------------
# THE CHECKS THIS FILE RUNS ON ITSELF. `python3 structure.py` prints them;
# `python3 structure.py --modules` prints the module map pia_dump.mjs builds its
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
    own = {'beginner': R, 'intermediate': H, 'advanced': L}
    for tier, pid in own.items():
        n = sum(1 for r in rows if r[0] == tier and pid in r[8])
        if n < 13:
            problems.append(f'{tier}: its own panel {pid} is tagged on only {n} lessons')
    # NO FORWARD PANEL: a lower tier never tags a higher tier's panel.
    rank = {R: 0, H: 1, L: 2}
    trank = {'beginner': 0, 'intermediate': 1, 'advanced': 2}
    for r in rows:
        for pid in r[8]:
            if rank[pid] > trank[r[0]]:
                problems.append(f'{r[0]}/{r[5]} tags the higher tier panel {pid}')
    if not quiet:
        minutes = sorted({r[7] for r in rows})
        print(f'EC7 pia structure: {len(rows)} lessons, '
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
