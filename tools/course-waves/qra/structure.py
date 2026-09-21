# H5 Quantitative Risk Assessment. Three tiers, six modules each, 26 lessons a
# tier. The fifth and last course of the academy's `hse` module (path_order 65).
#
# Engine: engines/hse/qra.js, vendored sha-identical with petrolord-engines
# 16fd6c9 (engines PR #230, merged as abb41c3; unchanged by #231). It imports
# the H4 consequence engine (probits, the plume, the solid flame), the H1
# safety statistics FAR base, the H3 hours in a year and the canonical year-end
# npv of engines/economics/cashflow.ts. vendor_qra.sh walks the closure from the
# jest suite and copies the six qra paths; the rest is already vendored.
#
# THE DIGEST IS THE ONLY TEACHING TRUTH. digest.txt, built by h5_dump.mjs. The
# engine's FINDINGS record, the oracle and the engine's source comments are
# PROVENANCE. Where FINDINGS quotes a figure (the Purple Book Appendix 6.B
# chain, the CBA checklist example, the R2P2 box) the digest recomputes it
# through the engine or reads it from the vendored golden and prints it; a
# writer quotes the digest line and never the FINDINGS line.
#
# TIER OWNERSHIP, and why it is drawn here. Each tier owns one question and its
# capstone grades only that question, so no tier's lessons can hand out another
# tier's graded answer:
#
#   Associate    HOW OFTEN, AND WHAT IS ONE PERSON'S RISK. Event trees, the
#                flammable release tree and its conditional branches, the direct
#                ignition table, location-specific individual risk (LSIR) and
#                individual risk per annum (IRPA). No PLL, no F-N curve, no
#                ALARP band, no cost-benefit.
#   Professional HOW MANY AT ONCE. Potential loss of life, the fatal accident
#                rate, the F-N curve ("N or more"), the published criterion
#                line and point, and the fractions of deaths indoors and
#                outdoors.
#   Expert       IS A FURTHER MEASURE REASONABLY PRACTICABLE, AND WHAT DOES THE
#                ENGINE NOT KNOW. The ALARP regions and the boundary convention,
#                the benefit of a measure, discounting and the implied cost of
#                averting a fatality, the gross disproportion test, and what the
#                engine does not know.
#
# A higher tier may USE a lower tier's arithmetic (an Expert capstone states a
# PLL reduction), and the capstone of each tier grades its own question.
#
# THE SEAMS, which the vocabulary gate enforces on every learner text:
#   * H4 CONSEQUENCE owns source terms, dispersion, radiation, overpressure and
#     every probit dose calculation. This course takes a probability of death
#     and a scenario frequency as INPUTS, and names where they come from.
#   * THE RISK MATRIX belongs to the risk and change course; this course never
#     scores a matrix cell.
#   * NPV MECHANICS belong to the economics courses; this course uses the
#     canonical year-end present value only inside the gross disproportion test
#     and the discounted ICAF.
#   * LOPA AND SIL belong to H3; API 521 point-source radiation belongs to FC1
#     and FC5.
#
# Panel ids: T the event tree and individual risk builder, S the societal risk
# explorer (PLL, FAR, the F-N curve against a criterion), A the ALARP and
# cost-benefit explorer. All three read ONE teaching lab, and every one takes a
# learner's own inputs, which is how a capstone is worked.
#
# Titles carry COUNTS only, never a MEASUREMENT, and counts are spelled in words:
# ANY DIGIT in a title fails the check below. No em dashes and no "X, not Y"
# contrastive anywhere a learner reads, headings and module titles included.
#
# THIS ENGINE HAS ONE PIECE OF REPAIR HISTORY, AND THE COURSE DOES NOT TEACH IT.
# FINDINGS-qra.md section 9 records six fail-opens found and closed before the
# engine merged (a preset name that walked the prototype chain). It is
# provenance about the engine's own development, and the course teaches what
# the engine does today: a preset name it does not know is REFUSED, and the
# digest shows the refusal. No module, lesson or digest section describes
# former engine behaviour, and the check below refuses any key or title that
# reads like it.
#
# ---------------------------------------------------------------------------
# THE ENGINE'S DECLARED CHOICES, WHICH THE LESSONS MUST TEACH BY NAME
#
#   * NOTHING IS INVENTED. Every scenario frequency, every branch probability,
#     every probability of death, every occupancy, VPF, DF and rate is an input.
#     The HSE values of preventing a fatality are exported for ILLUSTRATION
#     only, and VPF has no default.
#   * A THRESHOLD VALUE BELONGS TO THE LOWER BAND (the owner's decision): an
#     individual risk exactly at 1e-3 is TOLERABLE, exactly at 1e-6 is BROADLY
#     ACCEPTABLE, a cost exactly DF times the benefit is NOT grossly
#     disproportionate, a curve exactly on the line TOUCHES it. A value within
#     1e-9 relative of a threshold IS the threshold (BOUNDARY_SNAP).
#   * F(N) IS "N OR MORE", as the Purple Book's equation and section 6.3 say,
#     where its introduction says "more than N".
#   * F-N HAS NO PUBLISHED WORKED EXAMPLE. The curve is checked by
#     self-consistency (a grid route and the area identity) and never presented
#     as a published reproduction.
#   * THE EXPOSURE CAPS ARE APPLIED, NOT REFUSED (20 s for a fire, 30 minutes
#     for a toxic cloud), and the result states the time used.
#   * DISCOUNTING IS THE CANONICAL YEAR-END npv; every rate defaults to zero.
#     The ICAF counts fatalities prevented UNDISCOUNTED.
#   * NOT HERE: no aversion-weighted risk integral, no slope for the R2P2
#     point, no grid or wind rose bookkeeping, no successor to the repealed
#     Bevi values.
#
# NAMING COLLISIONS, legislated in the digest's vocabulary section before a word
# is written:
#   * bare "risk" is always qualified: individual risk, LSIR, IRPA, societal
#     risk.
#   * "severity" and "likelihood" belong to the risk matrix course (and
#     "likelihood" to the Bayesian decision course). Never used here.
#   * "FAR" is always per 100,000,000 exposed hours, as in H1.
#   * "PLL" is expected fatalities per year, never a probability.
#   * "ICAF" is the implied cost of averting a fatality, the engine's cost per
#     fatality prevented.
#   * "NPV" and "IRR" are never used: the course says "present value".
# ---------------------------------------------------------------------------
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


T = 'qr-event-tree'
S = 'qr-societal'
A = 'qr-alarp'
PANEL_IDS = [T, S, A]

TIERS = {
 'beginner': [
  ('m01-what-a-qra-answers', 'What a Quantitative Risk Assessment Answers', [
    ('l01-what-a-qra-answers', 'What a quantitative risk assessment answers', 12, [T]),
    ('l02-frequencies-per-year-and-probabilities', 'Frequencies per year and probabilities', 12, [T]),
    ('l03-where-the-probability-of-death-comes-from', 'Where the probability of death comes from', 13, [T]),
    ('l04-the-refusals-by-name', 'The refusals, each naming its field', 14, [T]),
  ]),
  ('m02-event-trees', 'Event Trees', [
    ('l01-a-tree-of-branches', 'A tree of branches', 13, [T]),
    ('l02-every-branch-set-sums-to-one', 'Every branch set sums to one', 13, [T]),
    ('l03-the-leaf-frequency', 'The leaf frequency', 12, [T]),
    ('l04-pooling-leaves-into-outcomes', 'Pooling leaves into outcomes', 13, [T]),
    ('l05-a-tree-that-does-not-close', 'A tree that does not close', 13, [T]),
  ]),
  ('m03-a-flammable-release', 'A Flammable Release', [
    ('l01-immediate-and-delayed-ignition', 'Immediate and delayed ignition', 13, [T]),
    ('l02-delayed-ignition-is-conditional', 'Delayed ignition is conditional', 14, [T]),
    ('l03-flash-fire-and-explosion', 'Flash fire and explosion', 12, [T]),
    ('l04-the-direct-ignition-table', 'The direct ignition table', 13, [T]),
    ('l05-forgetting-a-branch', 'Forgetting a branch, and what it costs', 14, [T]),
  ]),
  ('m04-location-specific-individual-risk', 'Location-Specific Individual Risk', [
    ('l01-risk-at-a-place', 'Individual risk at a place', 13, [T]),
    ('l02-summing-the-contributions', 'Summing the contributions', 13, [T]),
    ('l03-outdoors-unprotected-all-the-time', 'Outdoors, unprotected, all the time', 12, [T]),
    ('l04-a-published-contribution-reproduced', 'A published contribution, reproduced', 14, [T]),
  ]),
  ('m05-individual-risk-per-annum', 'Individual Risk per Annum', [
    ('l01-one-person-many-places', 'One person, many places', 13, [T]),
    ('l02-hours-and-fractions-of-the-year', 'Hours and fractions of the year', 13, [T]),
    ('l03-one-place-at-a-time', 'One place at a time', 12, [T]),
    ('l04-the-vulnerability-factor', 'The vulnerability factor', 12, [T]),
  ]),
  ('m06-one-person-end-to-end', 'One Person, End to End', [
    ('l01-risk-along-a-transect', 'Individual risk along a transect', 13, [T]),
    ('l02-contours-on-a-plot-plan', 'Contours on a plot plan', 13, [T]),
    ('l03-what-individual-risk-does-not-say', 'What individual risk does not say', 12, []),
    ('l04-the-capstone-brief', 'The capstone brief', 12, [T]),
  ]),
 ],
 'intermediate': [
  ('m01-potential-loss-of-life', 'Potential Loss of Life', [
    ('l01-from-one-person-to-many', 'From one person to many', 12, [S]),
    ('l02-pll-as-a-sum', 'PLL as a sum', 13, [S]),
    ('l03-expected-deaths-need-not-be-whole', 'Expected deaths need not be whole', 13, [S]),
    ('l04-scenarios-with-no-fatality', 'Scenarios with no fatality', 12, [S]),
  ]),
  ('m02-the-fatal-accident-rate', 'The Fatal Accident Rate', [
    ('l01-far-from-pll', 'FAR from PLL', 13, [S]),
    ('l02-exposed-hours', 'Exposed hours', 13, [S]),
    ('l03-far-and-the-safety-statistics-course', 'FAR and the safety statistics course', 13, [S]),
    ('l04-far-against-individual-risk', 'FAR against individual risk', 14, [S, T]),
  ]),
  ('m03-the-f-n-curve', 'The F-N Curve', [
    ('l01-n-or-more', 'N or more', 13, [S]),
    ('l02-a-step-function', 'A step function', 14, [S]),
    ('l03-the-area-under-the-curve', 'The area under the curve', 13, [S]),
    ('l04-reading-it-wrongly', 'Reading it wrongly', 14, [S]),
    ('l05-no-published-worked-example', 'No published worked example', 13, [S]),
  ]),
  ('m04-criterion-lines', 'Criterion Lines', [
    ('l01-a-line-through-the-plane', 'A line through the plane', 13, [S]),
    ('l02-the-dutch-line-and-its-points', 'The Dutch line and its points', 14, [S]),
    ('l03-corners-decide-everything', 'Corners decide everything', 14, [S]),
    ('l04-where-a-curve-exceeds', 'Where a curve exceeds', 14, [S]),
    ('l05-the-worst-ratio', 'The worst ratio', 13, [S]),
  ]),
  ('m05-one-published-point-and-the-boundary', 'One Published Point and the Boundary', [
    ('l01-one-point-and-no-slope', 'One point and no slope', 13, [S]),
    ('l02-a-caller-line', 'A line the analyst supplies', 13, [S]),
    ('l03-touching-the-line', 'Touching the line', 13, [S]),
    ('l04-state-words', 'The state words', 12, [S]),
  ]),
  ('m06-societal-risk-end-to-end', 'Societal Risk, End to End', [
    ('l01-fractions-indoors-and-outdoors', 'Fractions indoors and outdoors', 14, [S]),
    ('l02-what-the-fractions-rest-on', 'What the fractions rest on', 13, [S]),
    ('l03-the-societal-picture', 'The societal picture', 13, [S, T]),
    ('l04-the-capstone-brief', 'The capstone brief', 12, [S]),
  ]),
 ],
 'advanced': [
  ('m01-the-alarp-regions', 'The ALARP Regions', [
    ('l01-three-regions', 'Three regions', 12, [A]),
    ('l02-workers-and-the-public', 'Workers and the public', 13, [A]),
    ('l03-a-threshold-belongs-to-the-lower-band', 'A threshold belongs to the lower band', 14, [A]),
    ('l04-the-boundary-snap', 'The boundary snap', 13, [A]),
    ('l05-published-rates-banded', 'Published rates, banded', 13, [A]),
  ]),
  ('m02-the-benefit-of-a-measure', 'The Benefit of a Measure', [
    ('l01-a-fatality-prevented-and-its-value', 'A fatality prevented, and its value', 13, [A]),
    ('l02-injuries-beside-fatalities', 'Injuries beside fatalities', 13, [A]),
    ('l03-the-published-worked-example', 'The published worked example', 14, [A]),
    ('l04-a-rounded-print-and-its-verdict', 'A rounded print and its verdict', 13, [A]),
  ]),
  ('m03-discounting-and-the-icaf', 'Discounting and the ICAF', [
    ('l01-year-end-present-values', 'Year-end present values', 13, [A]),
    ('l02-two-hse-conventions', 'Two HSE conventions', 14, [A]),
    ('l03-the-implied-cost-of-averting-a-fatality', 'The implied cost of averting a fatality', 13, [A]),
    ('l04-counting-fatalities-undiscounted', 'Counting fatalities undiscounted', 13, [A]),
  ]),
  ('m04-gross-disproportion', 'Gross Disproportion', [
    ('l01-the-disproportion-factor', 'The disproportion factor', 13, [A]),
    ('l02-strictly-greater', 'Strictly greater', 13, [A]),
    ('l03-the-largest-reasonable-cost', 'The largest reasonably practicable cost', 13, [A]),
    ('l04-sweeping-the-factor', 'Sweeping the factor', 13, [A]),
  ]),
  ('m05-what-the-engine-does-not-know', 'What the Engine Does Not Know', [
    ('l01-no-aversion-and-no-slope', 'No aversion weighting and no slope', 13, [S]),
    ('l02-repealed-and-dated-values', 'Repealed and dated values', 13, [A, S]),
    ('l03-transcription-only-factors', 'Factors resting on one reading', 13, [S, T]),
    ('l04-the-consequence-seam', 'The consequence seam', 13, []),
  ]),
  ('m06-judgement-end-to-end', 'Judgement, End to End', [
    ('l01-ordering-measures', 'Ordering measures', 13, [A]),
    ('l02-an-alarp-case', 'An ALARP case', 13, [A, T]),
    ('l03-writing-the-demonstration', 'Writing the demonstration', 13, [A]),
    ('l04-when-the-numbers-are-not-enough', 'When the numbers are not enough', 12, [A]),
    ('l05-the-capstone-brief', 'The capstone brief', 12, [A]),
  ]),
 ],
}

TIER_NAMES = {'beginner': 'Associate', 'intermediate': 'Professional', 'advanced': 'Expert'}

# ---------------------------------------------------------------------------
# THE CHECKS THIS FILE RUNS ON ITSELF. `python3 structure.py` prints them;
# `python3 structure.py --modules` prints the module map h1_dump.mjs builds its
# section owner clauses from, and refuses to print if any check fails.
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
    for tier, t in titles:
        if re.search('[–—]', t):
            problems.append(f'{tier}: title carries a dash: {t}')
        if re.search(r',\s+not\s+\w', t):
            problems.append(f'{tier}: title carries a contrastive: {t}')
        if re.search(r'\d', t):
            problems.append(f'{tier}: title carries a digit, which is a measurement rather than a count: {t}')
        # the vocabulary rules, on titles
        if re.search(r'\bseverity\b', t, re.I):
            problems.append(f'{tier}: severity in a title (a risk matrix word): {t}')
        if re.search(r'\blikelihood\b', t, re.I):
            problems.append(f'{tier}: likelihood in a title (a risk matrix and Bayesian word): {t}')
        if re.search(r'\b(NPV|IRR)\b', t):
            problems.append(f'{tier}: NPV or IRR in a title (the course says present value): {t}')
        if re.search(r'\brisk\b', t, re.I) and not re.search(r'(individual|societal) risk|risk assessment|risk per annum', t, re.I):
            problems.append(f'{tier}: an unqualified risk in a title: {t}')
        if re.search(r'\b(probit|dose|dispersion|source term|SIL|PFDavg|LOPA|API)\b', t):
            problems.append(f'{tier}: a word another course owns in a title: {t}')
    # NO HISTORY: this engine has none, so nothing may read like it.
    for tier, mods in TIERS.items():
        for mkey, mtitle, lessons in mods:
            for k, t in [(mkey, mtitle)] + [(l[0], l[1]) for l in lessons]:
                if re.search(r'used-to|was-repaired|repair-history|no-longer', k) or \
                   re.search(r'\bused to\b|\bno longer\b|\bwas repaired\b', t, re.I):
                    problems.append(f'{tier}/{k}: reads as repair history, and this engine has none')
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
    own = {'beginner': T, 'intermediate': S, 'advanced': A}
    for tier, pid in own.items():
        n = sum(1 for r in rows if r[0] == tier and pid in r[8])
        if n < 13:
            problems.append(f'{tier}: its own panel {pid} is tagged on only {n} lessons')
    if not quiet:
        minutes = sorted({r[7] for r in rows})
        print(f'H5 qra structure: {len(rows)} lessons, '
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
        print('  history modules: none (the engine\'s one piece of repair history is provenance, never taught)')
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
