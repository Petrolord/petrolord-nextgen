# EC8 Gas Commercialisation & Gas Sales Agreements. Three tiers, six modules
# each, 26 lessons a tier. The third course of the academy's upstream
# commercial line in the `economics` module (path_order 73), after EC7 pia. An
# ENGINE COURSE: there is no Suite app, and every practical runs in the
# course's own calculator panels over the vendored engine.
#
# Engine: engines/economics/gasContract.js, vendored sha-identical with
# petrolord-engines d745b88 (engines PR #267). It imports npv,
# deriveGasRoyaltyRate and calendarDays from engines/economics/cashflow.ts,
# which stays at NextGen's blob (the same blob as d745b88; the four
# declarations it reads are source-identical). vendor_gsa.sh walks the closure
# from the jest suite (thirteen paths, eleven of them new) and the engine's own
# suite passes 219 of 219 against NextGen's copies.
#
# THE DIGEST IS THE ONLY TEACHING TRUTH. digest.txt, built by gsa_dump.mjs. The
# engine's FINDINGS record, the oracle, the fixture README and the engine's
# source comments are PROVENANCE. Where FINDINGS quotes a figure (a published
# figure, a fixture situation, a boundary) the digest recomputes it through the
# engine and prints it; a writer quotes the digest line.
#
# THE COURSE IN ONE SENTENCE. A gas sales agreement is a set of quantity,
# price and remedy rules that can be written down and computed, so the course
# teaches the contract quantities, volume to energy, the daily balance and the
# take-or-pay year by hand at Associate; the multi-year take-or-pay ledger with
# make-up, carry-forward and seller shortfall damages, contract price formulas
# with averaging and lag, and the Nigerian domestic gas prices and delivery
# obligation of the Petroleum Industry Act 2021 at Professional; and the
# S-curve and energy parity, whole-contract cash flows and NPV, the engine's
# stated readings, the reference texts' quirks and what the engine does not
# compute at Expert; and grades each tier on its own question with numbers the
# engine returns.
#
# TIER OWNERSHIP, drawn along the engine's own functions:
#
#   Associate    QUANTITIES AND ONE CONTRACT YEAR. What a GSA fixes; the
#                sources and the dates they were read; volume to energy
#                (toEnergy); DCQ, ACQ, day counts, MaxDCQ, swing and effective
#                swing (contractQuantities); the daily balance of nominations,
#                availability and takes with the seller and buyer shortfall
#                (dailyBalance); the Adjusted ACQ, the take-or-pay quantity and
#                the deficiency payment of one year (takeOrPay on one year).
#   Professional THE LEDGER, THE PRICE AND THE NIGERIAN RULES. Take-or-pay over
#                consecutive years with make-up in a stated recovery order,
#                first in first out, expiry and the end of the term;
#                carry-forward with its cap, base and expiry; seller shortfall
#                damages (takeOrPay); fixed, escalated, oil-indexed, hub-indexed
#                and basket prices with averaging, lag, reset, floor, ceiling
#                and the four-decimal rule (priceSeries); the domestic prices of
#                PIA s.167 and s.168 with the domestic base price as a required
#                input (domesticPrice); the Domestic Gas Delivery Obligation of
#                s.110 and the 2022 Regulations (domesticGasObligation).
#   Expert       PARITY, THE WHOLE CONTRACT AND READING THE ENGINE. Energy
#                parity (energyParitySlope) and the S-curve; the whole contract
#                in money with the imported gas royalty and the canonical NPV
#                (gsaCashFlows); the four readings the engine states; the
#                model agreement's alternatives, the recovery orders of the
#                texts, printed figures against exact ones, the Btu and the
#                cubic foot, every boundary rule; what the engine does not
#                compute; the conventions that are choices and the contract
#                report.
#
# A higher tier may USE a lower tier's methods (a Professional ledger is built
# from Associate years), and each capstone grades only its own question.
#
# SCOPE SEAMS, recorded so no lesson re-teaches another course's material:
#   * flare to value, LPG and CNG as uses of gas are OWNED BY the gasvalue
#     course; this course refers to it;
#   * the cash flow ledger, discounting and NPV as a subject are OWNED BY the
#     cashflow course; this course imports the canonical npv and says so;
#   * the Nigerian fiscal system (royalty by terrain, hydrocarbon tax,
#     companies income tax) is OWNED BY the pia course; this course imports the
#     gas royalty rate and teaches the Act's gas pricing and delivery
#     obligation provisions only.
#
# Panel ids: Q the quantity calculator (volume to energy, contract quantities,
# the daily balance, one take-or-pay year), L the ledger calculator (the
# take-or-pay ledger, price formulas, domestic prices, the delivery
# obligation), X the contract calculator (parity and the S-curve, whole-contract
# cash flows and NPV, the readings side by side, boundary probes). Every panel
# takes a learner's own contract terms, which is how a capstone is worked, and
# the course pages say plainly that the practicals run in these panels.
#
# Titles carry COUNTS only, never a MEASUREMENT, and counts are spelled in
# words: ANY DIGIT in a title fails the check below. No em dashes and no
# "X, not Y" contrastive (nor "rather than", ", never" or "instead of")
# anywhere a learner reads, headings and module titles included.
#
# THIS COURSE TEACHES NO REPAIR HISTORY. The engine's lead decisions (the
# domestic base price as a required input, the recovery order as a required
# input, the four stated readings) landed before its merge and before any
# lesson was written, so there is no history module and no framed history
# section.
#
# NAMING COLLISIONS, legislated in the digest's vocabulary section:
#   * "shortfall" is always qualified: seller shortfall (gas the seller did not
#     make available) or buyer shortfall (gas the buyer did not take);
#   * "deficiency" is the quantity below the take-or-pay quantity; the money
#     is the "deficiency payment";
#   * "make-up" is gas paid for in a deficiency year and taken later;
#     "carry-forward" is excess takes credited against a later deficiency;
#   * "Adjusted ACQ" is the ACQ less the stated reductions, and "take-or-pay
#     quantity" is the stated percentage of the Adjusted ACQ;
#   * "domestic base price" is a required input, quoted only as reported.
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


Q = 'gsa-quantity-calculator'
L = 'gsa-ledger-calculator'
X = 'gsa-contract-calculator'
PANEL_IDS = [Q, L, X]

TIERS = {
 'beginner': [
  ('m01-what-a-gas-sales-agreement-fixes', 'What a Gas Sales Agreement Fixes', [
    ('l01-gas-sold-by-contract', 'Gas sold by contract', 12, [Q]),
    ('l02-seller-buyer-and-delivery-point', 'The seller, the buyer and the delivery point', 13, [Q]),
    ('l03-the-ekene-agreements', 'The Ekene agreements', 13, [Q]),
    ('l04-sources-and-the-dates-they-were-read', 'Sources and the dates they were read', 13, [Q]),
    ('l05-calculator-panels-and-refusals', 'The calculator panels and the refusals', 14, [Q]),
  ]),
  ('m02-volume-to-energy', 'Volume to Energy', [
    ('l01-why-gas-is-sold-by-energy', 'Why gas is sold by its energy', 12, [Q]),
    ('l02-gross-and-net-heating-value', 'Gross and net heating value', 13, [Q]),
    ('l03-imperial-and-metric-routes', 'Imperial and metric routes to MMBtu', 13, [Q]),
    ('l04-reference-conditions-and-mixed-units', 'Reference conditions and mixed units', 13, [Q]),
  ]),
  ('m03-contract-quantities', 'Contract Quantities', [
    ('l01-the-daily-contract-quantity', 'The daily contract quantity and the contract year', 12, [Q]),
    ('l02-day-counts-and-leap-years', 'Day counts and leap years', 13, [Q]),
    ('l03-maximum-daily-quantity-and-swing', 'The maximum daily quantity and swing', 13, [Q]),
    ('l04-effective-swing', 'Effective swing against the take-or-pay level', 13, [Q]),
    ('l05-nominations', 'Nominations against the daily quantities', 12, [Q]),
  ]),
  ('m04-the-daily-balance', 'The Daily Balance', [
    ('l01-the-properly-nominated-quantity', 'The properly nominated quantity', 12, [Q]),
    ('l02-seller-shortfall-day-by-day', 'Seller shortfall, day by day', 14, [Q]),
    ('l03-force-majeure-maintenance-and-the-buyer', 'Force majeure, maintenance and a buyer-caused day', 13, [Q]),
    ('l04-buyer-shortfall-and-the-identity', 'Buyer shortfall and the reconciliation identity', 13, [Q]),
  ]),
  ('m05-take-or-pay-basics', 'Take-or-Pay Basics', [
    ('l01-the-adjusted-acq', 'The Adjusted ACQ', 13, [Q]),
    ('l02-the-take-or-pay-quantity', 'The take-or-pay quantity', 12, [Q]),
    ('l03-deficiency-and-its-payment', 'Deficiency and the deficiency payment', 13, [Q]),
    ('l04-exactly-met', 'When the take-or-pay quantity is exactly met', 12, [Q]),
  ]),
  ('m06-reading-one-contract-year', 'Reading One Contract Year', [
    ('l01-the-year-in-money', 'The contract year in money', 13, [Q]),
    ('l02-seller-shortfall-damages', 'Seller shortfall damages', 12, [Q]),
    ('l03-the-reasons-the-engine-prints', 'The reasons the engine prints', 13, [Q]),
    ('l04-the-capstone-brief', 'The capstone brief', 13, [Q]),
  ]),
 ],
 'intermediate': [
  ('m01-the-take-or-pay-ledger', 'The Take-or-Pay Ledger', [
    ('l01-contract-years-in-sequence', 'Contract years in sequence', 12, [Q, L]),
    ('l02-make-up-as-prepaid-gas', 'Make-up as prepaid gas', 13, [L]),
    ('l03-the-recovery-order-is-a-stated-term', 'The recovery order is a stated term', 14, [L]),
    ('l04-first-in-first-out', 'Make-up drawn first in first out', 13, [L]),
  ]),
  ('m02-make-up-expiry-and-the-end-of-the-term', 'Make-Up Expiry and the End of the Term', [
    ('l01-the-make-up-period', 'The make-up period and its last year', 13, [L]),
    ('l02-make-up-expiring', 'Make-up expiring at the end of its last year', 13, [L]),
    ('l03-forfeit-or-refund', 'Forfeit or refund at the end of the term', 13, [L]),
    ('l04-the-power-plant-ledger-end-to-end', 'The power plant ledger end to end', 14, [L]),
  ]),
  ('m03-carry-forward-and-seller-shortfall', 'Carry-Forward and Seller Shortfall', [
    ('l01-carry-forward-of-excess-takes', 'Carry-forward of excess takes', 13, [L]),
    ('l02-the-carry-forward-cap-and-base', 'The carry-forward cap and its base', 13, [L]),
    ('l03-carry-forward-expiry', 'Carry-forward expiry', 12, [L]),
    ('l04-seller-shortfall-liquidated-damages', 'Seller shortfall liquidated damages', 13, [Q, L]),
    ('l05-the-export-feed-ledger', 'The export feed ledger', 14, [L]),
  ]),
  ('m04-price-formulas', 'Price Formulas', [
    ('l01-fixed-and-escalated', 'Fixed and escalated prices', 12, [L]),
    ('l02-oil-indexed-slope-and-constant', 'Oil-indexed slope and constant', 13, [L]),
    ('l03-averaging-windows-and-lags', 'Averaging windows and lags', 14, [L]),
    ('l04-resets-floors-ceilings-rounding', 'Resets, floors, ceilings and rounding', 13, [L]),
    ('l05-hub-indexed-and-basket', 'Hub-indexed and basket formulas', 13, [L]),
  ]),
  ('m05-domestic-gas-prices', 'Domestic Gas Prices', [
    ('l01-the-domestic-base-price', 'The domestic base price, a stated input', 13, [L]),
    ('l02-power-commercial-and-distributors', 'Power, commercial and gas distributors', 13, [L]),
    ('l03-gas-based-industries', 'Gas based industries and the Fourth Schedule', 14, [L]),
    ('l04-transport-and-the-delivery-point', 'Transport and the delivery point', 12, [L]),
  ]),
  ('m06-the-domestic-gas-delivery-obligation', 'The Domestic Gas Delivery Obligation', [
    ('l01-the-obligation-and-deemed-fulfilment', 'The obligation and deemed fulfilment', 13, [L]),
    ('l02-the-excuses-in-their-order', 'The excuses, in their order', 13, [L]),
    ('l03-the-penalty-and-a-signed-agreement', 'The penalty and a signed agreement', 13, [L]),
    ('l04-the-capstone-brief', 'The capstone brief', 13, [L]),
  ]),
 ],
 'advanced': [
  ('m01-energy-parity-and-the-s-curve', 'Energy Parity and the S-Curve', [
    ('l01-heat-equivalence', 'Heat equivalence between oil and gas', 13, [X]),
    ('l02-slopes-below-parity', 'Slopes below parity', 12, [X]),
    ('l03-the-s-curve-and-its-kinks', 'The S-curve and its kinks', 14, [L, X]),
    ('l04-continuity-at-the-kinks', 'Continuity at the kinks', 13, [X]),
    ('l05-the-published-s-curve', 'The published S-curve, figure by figure', 13, [L, X]),
  ]),
  ('m02-whole-contract-cash-flows', 'Whole-Contract Cash Flows', [
    ('l01-the-revenue-lines', 'The revenue lines of a contract year', 13, [X]),
    ('l02-royalty-on-delivered-value', 'Royalty on the value of gas delivered', 13, [X]),
    ('l03-npv-through-the-canonical-npv', 'Present value through the canonical NPV', 13, [X]),
    ('l04-the-export-contract-in-money', 'The export contract in money', 14, [L, X]),
  ]),
  ('m03-the-stated-readings', 'The Stated Readings', [
    ('l01-the-seller-shortfall-reading', 'The seller shortfall reading', 13, [Q, X]),
    ('l02-the-make-up-right-reading', 'The make-up right reading', 13, [X]),
    ('l03-the-last-contract-year-reading', 'The last contract year reading', 13, [X]),
    ('l04-the-royalty-reading', 'The royalty reading', 12, [X]),
  ]),
  ('m04-reference-texts-and-their-quirks', 'Reference Texts and Their Quirks', [
    ('l01-the-model-agreement-and-its-alternatives', 'The model agreement and its alternatives', 13, [X]),
    ('l02-recovery-orders-in-the-texts', 'Recovery orders in the texts', 13, [L, X]),
    ('l03-printed-figures-and-exact-figures', 'Printed figures and exact figures', 13, [Q, X]),
    ('l04-the-btu-and-the-cubic-foot', 'The Btu and the cubic foot', 12, [Q, X]),
    ('l05-boundaries-rule-by-rule', 'Boundaries, rule by rule', 14, [X]),
  ]),
  ('m05-what-the-engine-does-not-compute', 'What the Engine Does Not Compute', [
    ('l01-excess-off-specification-and-pre-start-gas', 'Excess, off-specification and pre-start gas', 12, [X]),
    ('l02-price-reopeners-reported-by-month', 'Price reopeners reported by month', 12, [L, X]),
    ('l03-flaring-compensation-and-supply-tiers', 'Flaring, compensation and the supply tiers', 13, [X]),
    ('l04-figures-quoted-only-as-reported', 'Figures quoted only as reported', 13, [L, X]),
  ]),
  ('m06-conventions-and-the-contract-report', 'Conventions and the Contract Report', [
    ('l01-conventions-that-are-choices', 'Conventions that are choices', 13, [X]),
    ('l02-caps-and-refusals', 'Caps and refusals', 12, [X]),
    ('l03-writing-the-contract-report', 'Writing the contract report', 13, [X]),
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
    own = {'beginner': Q, 'intermediate': L, 'advanced': X}
    for tier, pid in own.items():
        n = sum(1 for r in rows if r[0] == tier and pid in r[8])
        if n < 13:
            problems.append(f'{tier}: its own panel {pid} is tagged on only {n} lessons')
    # NO FORWARD PANEL: a lower tier never tags a higher tier's panel.
    rank = {Q: 0, L: 1, X: 2}
    trank = {'beginner': 0, 'intermediate': 1, 'advanced': 2}
    for r in rows:
        for pid in r[8]:
            if rank[pid] > trank[r[0]]:
                problems.append(f'{r[0]}/{r[5]} tags the higher tier panel {pid}')
    if not quiet:
        minutes = sorted({r[7] for r in rows})
        print(f'EC8 gsa structure: {len(rows)} lessons, '
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
