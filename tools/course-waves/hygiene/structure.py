# H2 Occupational Hygiene: Noise, Chemical & Heat Exposure. Three tiers, six
# modules each, 26 lessons a tier. The second course of the academy's `hse`
# module, path_order 62.
#
# Engine: engines/hse/exposure.js, vendored sha-identical with petrolord-engines
# b43f1d9 (PR #217, re-vendored after #220). It imports nothing, so the vendoring closure walked from
# the jest suite is SIX paths: three reached by the walk (the suite, the engine,
# the golden) and three NAMED with their reason (the oracle, FINDINGS, the
# negative-control script). A LATER ENGINE CHANGE WILL GROW THAT CLOSURE; re-walk
# it rather than copying this number.
#
# THE DIGEST IS THE ONLY TEACHING TRUTH. digest.txt, built by h2_dump.mjs.
# FINDINGS-exposure.md vendored beside the oracle and the engine's own source
# comments are PROVENANCE.
#
# Panel ids: N the noise dosimeter (a record read under three criteria, dose,
# TWA, reference durations, LEX,8h and the week, the extended shift), P the
# protection and chemicals explorer (four protector methods, the 8-hour TWA,
# the STEL window, the mixture index, Brief and Scala), H the heat stress
# explorer (WBGT indoor and outdoor, the one-hour averages, the NIOSH RAL and
# REL equations with their evidence status printed beside them). All three read
# ONE teaching lab.
#
# EACH TIER OWNS A DISTINCT SLICE.
#   Associate     NOISE DOSE AND ITS CRITERIA. The dosimeter day under the OSHA
#                 PEL, the OSHA action level and the NIOSH REL: reference
#                 duration, exchange rate, threshold, dose, TWA, the printed
#                 coefficients, the warnings and the refusals.
#   Professional  PROTECTION AND CHEMICALS. LEX,8h and exposure points, the
#                 weekly LEX, hearing protector estimates by method, the 8-hour
#                 chemical TWA, the STEL, the mixture index.
#   Expert        HEAT, THE SHIFT THAT IS NOT EIGHT HOURS, AND READING THE
#                 EVIDENCE. WBGT and the one-hour averages, the NIOSH RAL and
#                 REL as published equations, the evidence status of every
#                 formula, the published errata as a lesson in reading
#                 standards, the extended-shift action level, Brief and Scala,
#                 and combining exposures into a sampling decision.
#
# Titles carry COUNTS only, never a MEASUREMENT: any digit in a title fails.
# No em dashes and no "X, not Y" contrastive anywhere a learner reads,
# headings and module titles included.
#
# THIS ENGINE HAS NO REPAIR HISTORY. It was written for this course and merged
# once, so there is no history module and no title may carry history wording.
# The ERRATA module (Expert m04) is about the SOURCES, which print values their
# own formulas refute. That is current and permanent, and it is taught as a
# lesson in reading a standard.
#
# ---------------------------------------------------------------------------
# WHAT IS NEVER GRADED. Digest section 23 is the authority.
#
#   * the NIOSH 2016 RAL and REL, any margin against them and any exceedance
#     verdict: the equations are checked for TRANSCRIPTION ONLY and NIOSH's
#     own worked example disagrees with its own equation. TAUGHT as "the NIOSH
#     2016-106 section 8.1 equation", with that status beside every figure.
#   * any WBGT built from globe, wet bulb and dry bulb temperatures: the
#     weights are transcription only. TAUGHT with the same label.
#   * the NIOSH protector derating by type, the OSHA dual-protection 5 dB and
#     the Brief and Scala WEEKLY formula: oracle only, no printed value.
#   * a verdict word (exceeds, passes) anywhere: the graded fields are numbers.
#   * any ACGIH TLV: licensed, never quoted. A limit is always an INPUT.
# ---------------------------------------------------------------------------
#
# THE VOCABULARY COLLISIONS, legislated before a word is written (digest
# section 24 is binding):
#   * "dose" means an inhibitor or methanol dose in flowassurance and
#     gasprocessing. Here always "noise dose" on first use in every lesson and
#     every bank question, and never bare "dose" in a prompt or an option.
#   * "exposure" means a financial or cost exposure in fdp, uncertainty and
#     wellcost. Here always "noise exposure", "chemical exposure" or "heat
#     exposure", qualified.
#   * "noise" means scatter in data in dca, welltest and seismolord. Here it is
#     sound, and every lesson says "sound level" or "noise exposure".
#   * "exchange rate" means currency in the economics courses. Here always "the
#     decibel exchange rate" or "an exchange rate of 5 dB".
#   * "heat" is a heat duty in heattransfer and flare radiation in separation
#     and relief. Here always "heat stress".
#
# SCOPE SEAMS, cite and do not teach (digest section 25): flare and pool-fire
# radiation (separation, relief), BTEX as an emission (gasprocessing), incident
# rates (safetystats, H1), risk matrices (riskchange).
BAND = (420, 560)
MIN_BY_MINUTES = {12: 420, 13: 460, 14: 500}


def min_words(est_minutes):
    """The minimum prose words a lesson of this length must carry."""
    if est_minutes not in MIN_BY_MINUTES:
        raise ValueError(
            f'no minimum word count is declared for {est_minutes} estimated minutes; '
            f'declared: {sorted(MIN_BY_MINUTES)}')
    return MIN_BY_MINUTES[est_minutes]


N = 'hy-noise-dosimeter'
P = 'hy-protection-chemicals'
H = 'hy-heat-stress'
PANEL_IDS = [N, P, H]

TIERS = {
 'beginner': [
  ('m01-what-a-dosimeter-day-is', 'What a Dosimeter Day Is', [
    ('l01-a-noise-dose-is-a-fraction-of-an-allowance', 'A noise dose is a fraction of an allowance', 12, []),
    ('l02-the-reference-duration', 'The reference duration', 13, [N]),
    ('l03-the-decibel-exchange-rate', 'The decibel exchange rate', 13, [N]),
    ('l04-the-threshold-decides-what-counts', 'The threshold decides what counts', 14, [N]),
    ('l05-what-the-engine-refuses', 'What the engine refuses', 13, []),
  ]),
  ('m02-from-noise-dose-to-twa', 'From Noise Dose to TWA', [
    ('l01-the-twa-restates-the-dose', 'The TWA restates the noise dose', 12, [N]),
    ('l02-two-printed-coefficients', 'Two printed coefficients', 14, [N]),
    ('l03-two-published-tables', 'Two published tables', 13, [N]),
    ('l04-a-dose-with-no-twa', 'A noise dose with no TWA', 13, [N]),
  ]),
  ('m03-three-criteria-one-record', 'Three Criteria, One Record', [
    ('l01-the-osha-pel-setup', 'The OSHA PEL setup', 12, [N]),
    ('l02-the-action-level-is-half-a-dose', 'The action level is half a noise dose', 13, [N]),
    ('l03-the-niosh-rel', 'The NIOSH noise REL', 13, [N]),
    ('l04-one-day-three-answers', 'One day and three answers', 14, [N]),
    ('l05-ceilings-and-table-tops', 'Ceilings and the tops of the tables', 13, [N]),
  ]),
  ('m04-reading-a-dosimeter-record', 'Reading a Dosimeter Record', [
    ('l01-periods-and-contributions', 'Periods and their contributions', 12, [N]),
    ('l02-the-loudest-period-is-one-term', 'The loudest period is one term', 13, [N]),
    ('l03-time-left-at-a-level', 'Time left at a level', 14, [N]),
    ('l04-a-record-longer-than-a-day', 'A record longer than a day', 13, [N]),
  ]),
  ('m05-inverse-questions', 'Inverse Questions', [
    ('l01-the-level-for-a-reference-duration', 'The level for a reference duration', 13, [N]),
    ('l02-the-noise-dose-from-a-twa', 'The noise dose from a TWA', 13, [N]),
    ('l03-what-one-decibel-is-worth', 'What one decibel is worth', 14, [N]),
    ('l04-where-the-tables-stop', 'Where the tables stop', 12, [N]),
  ]),
  ('m06-the-associate-capstone', 'The Associate Capstone', [
    ('l01-one-record-end-to-end', 'One record, end to end', 13, [N]),
    ('l02-the-words-a-report-uses', 'The words a report uses', 13, []),
    ('l03-what-this-tier-leaves-out', 'What this tier leaves out', 12, []),
    ('l04-the-capstone-brief', 'The capstone brief', 12, [N]),
  ]),
 ],
 'intermediate': [
  ('m01-lex-eight-hour', 'The Daily Noise Exposure Level', [
    ('l01-an-energy-average', 'An energy average', 12, [N]),
    ('l02-the-eight-hour-normaliser', 'The eight-hour normaliser', 13, [N]),
    ('l03-exposure-points', 'Exposure points', 13, [N]),
    ('l04-action-values-and-the-limit', 'Action values and the limit', 13, [N]),
    ('l05-no-threshold-in-this-metric', 'No threshold in this metric', 14, [N]),
  ]),
  ('m02-the-week', 'The Week', [
    ('l01-the-weekly-level', 'The weekly level', 12, [N]),
    ('l02-the-divisor-of-five', 'The divisor of five', 13, [N]),
    ('l03-one-loud-day-dominates', 'One loud day dominates', 13, [N]),
    ('l04-the-time-to-reach-a-target', 'The time to reach a target', 14, [N]),
  ]),
  ('m03-hearing-protector-estimates', 'Hearing Protector Estimates', [
    ('l01-the-label-on-the-box', 'The label on the box', 12, [P]),
    ('l02-appendix-b-and-the-seven', 'Appendix B and the seven', 13, [P]),
    ('l03-the-field-derating', 'The field derating for engineering controls', 14, [P]),
    ('l04-derating-by-protector-type', 'Derating by protector type', 13, [P]),
    ('l05-dual-protection-and-the-floor', 'Dual protection and the floor at zero', 13, [P]),
  ]),
  ('m04-chemical-averages', 'Chemical Averages', [
    ('l01-the-eight-hour-twa', 'The eight-hour chemical TWA', 12, [P]),
    ('l02-unsampled-time-counts-as-zero', 'Unsampled time counts as zero', 13, [P]),
    ('l03-the-short-term-window', 'The short-term window', 13, [P]),
    ('l04-a-window-over-fifteen-minutes', 'A window over fifteen minutes is refused', 14, [P]),
  ]),
  ('m05-mixtures', 'Mixtures', [
    ('l01-the-additive-index', 'The additive index', 12, [P]),
    ('l02-the-published-example', 'The published example', 13, [P]),
    ('l03-unity-passes', 'Unity passes', 13, [P]),
    ('l04-when-additivity-is-the-wrong-model', 'When additivity is the wrong model', 14, []),
  ]),
  ('m06-the-professional-capstone', 'The Professional Capstone', [
    ('l01-noise-and-chemicals-together', 'Noise and chemicals together', 13, [N, P]),
    ('l02-what-a-protector-estimate-is-for', 'What a protector estimate is for', 13, [P]),
    ('l03-what-this-tier-leaves-out', 'What this tier leaves out', 12, []),
    ('l04-the-capstone-brief', 'The capstone brief', 12, [N, P]),
  ]),
 ],
 'advanced': [
  ('m01-wbgt', 'The Wet Bulb Globe Temperature', [
    ('l01-three-thermometers', 'Three thermometers', 12, [H]),
    ('l02-indoor-and-outdoor-weights', 'Indoor and outdoor weights', 13, [H]),
    ('l03-the-one-hour-average', 'The one-hour average', 13, [H]),
    ('l04-what-the-weights-rest-on', 'What the weights rest on', 14, [H]),
  ]),
  ('m02-metabolic-rate-and-the-niosh-limits', 'Metabolic Rate and the NIOSH Limits', [
    ('l01-the-one-hour-metabolic-average', 'The one-hour metabolic average', 12, [H]),
    ('l02-the-alert-limit-and-the-exposure-limit', 'The alert limit and the exposure limit', 13, [H]),
    ('l03-acclimatisation-is-an-input', 'Acclimatisation is an input', 13, [H]),
    ('l04-the-figure-range', 'The figure range and extrapolation', 13, [H]),
    ('l05-the-sixty-minute-rule', 'The sixty-minute rule and its refusals', 14, [H]),
  ]),
  ('m03-how-strong-is-each-equation', 'How Strong Is Each Equation', [
    ('l01-published-reproduced-transcribed', 'Published, reproduced, transcribed', 14, []),
    ('l02-the-worked-example-that-disagrees', 'The worked example that disagrees', 14, [H]),
    ('l03-why-no-heat-limit-is-graded', 'Why no heat stress limit is graded', 13, []),
    ('l04-band-summaries-are-not-the-equation', 'Band summaries are not the equation', 13, [H]),
  ]),
  ('m04-errata-in-the-standards', 'Errata in the Standards', [
    ('l01-a-digit-slip-in-a-table', 'A digit slip in a table', 13, []),
    ('l02-a-row-its-neighbours-contradict', 'A row its neighbours contradict', 13, []),
    ('l03-truncation-and-rounding', 'Truncation and rounding', 13, []),
    ('l04-what-an-erratum-does-to-a-gate', 'What an erratum does to a gate', 14, []),
  ]),
  ('m05-the-shift-that-is-not-eight-hours', 'The Shift That Is Not Eight Hours', [
    ('l01-the-extended-shift-action-level', 'The extended-shift action level', 13, [N]),
    ('l02-the-noise-dose-over-a-long-shift', 'The noise dose over a long shift', 13, [N]),
    ('l03-brief-and-scala-daily', 'Brief and Scala, daily', 13, [P]),
    ('l04-the-weekly-factor-and-which-governs', 'The weekly factor and which governs', 14, [P]),
    ('l05-the-factor-only-lowers-a-limit', 'The factor only lowers a limit', 12, [P]),
  ]),
  ('m06-from-exposures-to-a-sampling-decision', 'From Noise, Chemical and Heat Exposures to a Sampling Decision', [
    ('l01-three-hazards-one-crew', 'Three hazards and one crew', 13, [N, P, H]),
    ('l02-adjusted-limits-in-a-mixture', 'Adjusted limits in a mixture', 13, [P]),
    ('l03-what-to-measure-next', 'What to measure next', 13, []),
    ('l04-the-capstone-brief', 'The capstone brief', 12, [N, P, H]),
  ]),
 ],
}

# ---------------------------------------------------------------------------
# THE CHECKS THIS FILE RUNS ON ITSELF. Run `python3 structure.py`.
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


def check():
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
    for pid in PANEL_IDS:
        if not any(pid in r[8] for r in rows):
            problems.append(f'panel {pid} is declared and never tagged')
    for tier, mods in TIERS.items():
        mkeys = [m[0] for m in mods]
        if len(set(mkeys)) != len(mkeys):
            problems.append(f'{tier} repeats a module key')
        for mkey, _, lessons in mods:
            lkeys = [l[0] for l in lessons]
            if len(set(lkeys)) != len(lkeys):
                problems.append(f'{tier}/{mkey} repeats a lesson key')
    titles = [(tier, t) for tier, mods in TIERS.items() for mkey, mtitle, lessons in mods
              for t in [mtitle] + [l[1] for l in lessons]]
    for tier, t in titles:
        # THE OWNER COPY RULE
        if re.search('[–—]', t):
            problems.append(f'{tier}: title carries a dash: {t}')
        if re.search(r',\s+not\s+\w', t):
            problems.append(f'{tier}: title carries a contrastive: {t}')
        # A TITLE CARRIES COUNTS ONLY, NEVER A MEASUREMENT
        if re.search(r'\d', t):
            problems.append(f'{tier}: title carries a digit, which is a measurement rather than a count: {t}')
        # NO HISTORY WORDING: this engine has no repair history
        if re.search(r'used to|no longer|was wrong|now fixed|before the repair', t, re.I):
            problems.append(f'{tier}: history wording in a title of an engine with no history: {t}')
        # THE VOCABULARY RULE: a bare "dose" in a title is the flowassurance word
        if re.search(r'(?<!noise )\bdose\b', t, re.I):
            problems.append(f'{tier}: bare "dose" in a title (write "noise dose"): {t}')
        if re.search(r'\bexchange rate\b', t, re.I) and not re.search(r'decibel exchange rate', t, re.I):
            problems.append(f'{tier}: bare "exchange rate" in a title (write "decibel exchange rate"): {t}')
    # THREE CAPSTONE BRIEF LESSONS, the last lesson of the last module of each tier
    briefs = [(r[0], r[1], r[5]) for r in rows if r[5].endswith('the-capstone-brief')]
    if len(briefs) != 3:
        problems.append(f'{len(briefs)} capstone brief lessons, expected one a tier')
    for tier in TIERS:
        if TIERS[tier][-1][2][-1][0] != 'l04-the-capstone-brief':
            problems.append(f'{tier}: the capstone brief is not the last lesson of the last module')
    # THE HEAT DECISION HAS A LESSON, and the errata module exists
    keys = {(r[0], r[1], r[5]) for r in rows}
    for needed in [('advanced', 'm03-how-strong-is-each-equation', 'l03-why-no-heat-limit-is-graded'),
                   ('advanced', 'm03-how-strong-is-each-equation', 'l02-the-worked-example-that-disagrees'),
                   ('advanced', 'm04-errata-in-the-standards', 'l01-a-digit-slip-in-a-table')]:
        if needed not in keys:
            problems.append(f'a lesson the heat decision depends on is missing: {needed}')
    minutes = sorted({r[7] for r in rows})
    print(f'H2 hygiene structure: {len(rows)} lessons, '
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
    print('  history module: none (the engine has no repair history)')
    print(f'  PROBLEMS: {len(problems)}')
    for p in problems:
        print(f'   {p}')
    return problems


if __name__ == '__main__':
    import sys
    sys.exit(1 if check() else 0)
