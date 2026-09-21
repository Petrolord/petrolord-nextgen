# H4 Consequence Modelling. Three tiers, six modules each, 26 lessons a tier.
# The fourth course of the academy's `hse` module (path_order 64).
#
# Engine: engines/hse/consequence.js, vendored sha-identical with
# petrolord-engines 16fd6c9 (engines PR #223, with the own-property preset
# lookups of engines PR #231; no golden or numeric output moved). It imports
# three helpers it does not restate: criticalPressureRatio from
# engines/facilities/relief.js, thomasFlameHeightM from
# engines/facilities/spacing.js and normalCDF from lib/stats/stats.js.
#
# THE DIGEST IS THE ONLY TEACHING TRUTH. digest.txt, built by h4_dump.mjs. The
# engine's FINDINGS record, the oracle and the engine's source comments are
# PROVENANCE. Where FINDINGS quotes a figure (a Yellow Book worked example, a
# Purple Book table, an OSD/30 row, an erratum) the digest recomputes it through
# the engine or reads it from the vendored golden and prints it.
#
# TIER OWNERSHIP, and why it is drawn here and not source / dispersion / effects.
# The engine has five sections: source terms, dispersion, fires, explosions and
# probits. The fire section is the largest (burning rate, two flame lengths,
# tilt, three surface emissive powers, the view factor, the transmissivity, the
# composite and a distance search) and is one chain from pool to heat flux, so
# it is one tier's question. Dispersion takes its release rate from a source
# term, so the two are one question: how much gets out and where does it go.
# Blast and probits both end at harm to a person, and the probits read the
# outputs of every other section, so they close the course with what the engine
# does not do:
#
#   Associate    HOW MUCH GETS OUT AND WHERE DOES IT GO. Liquid and gas
#                outflow through a hole, choked and subsonic, pools, the
#                single-route evaporation, the Briggs sigmas, the reflected
#                Gaussian plume, ppm and mg/m3, and the distance to a
#                concentration.
#   Professional WHAT DOES THE FIRE RADIATE. The solid flame chain: burning
#                flux, flame length with and without wind, tilt, surface
#                emissive power, the view factor, transmissivity and the heat
#                flux, with the published Yellow Book pool fire reproduced.
#   Expert       WHO IS HURT, AND WHAT DOES THE ENGINE NOT KNOW. TNT
#                equivalence, Kinney and Graham forward and inverse, probits
#                (thermal, toxic, overpressure), the dropped scope, the
#                single-route quantities, and judgement.
#
# Panel ids: R the release explorer (a hole, a pool, a plume, a distance to a
# concentration), F the fire explorer (the solid flame chain step by step), H
# the harm explorer (blast forward and inverse, and the probits). All three read
# ONE teaching lab, and every one takes a learner's own inputs.
#
# Titles carry COUNTS only, never a MEASUREMENT, and counts are spelled in words:
# ANY DIGIT in a title fails the check below. No em dashes and no "X, not Y"
# contrastive anywhere a learner reads.
#
# THIS ENGINE HAS NO REPAIR HISTORY. Written, oracle-gated and merged in one
# pull request. The errata the course teaches are facts about PUBLISHED SOURCES
# (the Yellow Book, OSD/30, a conference paper), never engine history.
#
# NAMING COLLISIONS, legislated in the digest's vocabulary section:
#   * bare "flux" is always qualified: "heat flux" (W/m2), "burning flux"
#     (kg/(m2 s)), "evaporation flux" or "mass flux".
#   * bare "beta" appears only inside "k beta", the Babrauskas product.
#   * "severity" and "likelihood" are never used: this course computes effects,
#     and matrices and frequencies belong to other courses.
#   * "dose" is always qualified: "thermal dose", "toxic load" or "toxic dose".
#   * "individual risk", "PLL", "F-N" and "ALARP" belong to the H5 course and
#     appear only in the seam section.
#
BAND = (420, 560)
MIN_BY_MINUTES = {12: 420, 13: 460, 14: 500}


def min_words(est_minutes):
    """The minimum prose words a lesson of this length must carry."""
    if est_minutes not in MIN_BY_MINUTES:
        raise ValueError(
            f'no minimum word count is declared for {est_minutes} estimated minutes; '
            f'declared: {sorted(MIN_BY_MINUTES)}')
    return MIN_BY_MINUTES[est_minutes]


R = 'cq-release'
F = 'cq-fire'
H = 'cq-harm'
PANEL_IDS = [R, F, H]

TIERS = {
 'beginner': [
  ('m01-what-a-consequence-model-computes', 'What a Consequence Model Computes', [
    ('l01-effects-before-frequencies', 'Effects before frequencies', 12, [R]),
    ('l02-every-input-carries-its-unit', 'Every input carries its unit', 13, [R]),
    ('l03-a-result-or-a-refusal', 'A result or a refusal', 12, [R]),
    ('l04-the-sources-and-what-each-fixes', 'The sources and what each fixes', 13, [R]),
    ('l05-the-refusals-by-name', 'The refusals, each naming its field', 14, [R]),
  ]),
  ('m02-liquid-through-a-hole', 'Liquid Through a Hole', [
    ('l01-bernoulli-through-a-hole', 'Bernoulli through a hole', 13, [R]),
    ('l02-static-head-and-ullage-pressure', 'Static head and ullage pressure', 14, [R]),
    ('l03-the-discharge-coefficient-and-the-hole', 'The discharge coefficient and the hole', 12, [R]),
    ('l04-when-nothing-flows-out', 'When nothing flows out', 13, [R]),
  ]),
  ('m03-gas-through-a-hole', 'Gas Through a Hole', [
    ('l01-choked-and-subsonic', 'Choked and subsonic', 13, [R]),
    ('l02-the-critical-pressure-ratio', 'The critical pressure ratio', 14, [R]),
    ('l03-the-choked-mass-rate', 'The choked mass rate', 13, [R]),
    ('l04-the-subsonic-outflow-coefficient', 'The subsonic outflow coefficient', 14, [R]),
    ('l05-exactly-at-the-critical-ratio', 'Exactly at the critical ratio', 12, [R]),
  ]),
  ('m04-pools-and-evaporation', 'Pools and Evaporation', [
    ('l01-a-pool-on-the-bund-floor', 'A pool on the bund floor', 13, [R]),
    ('l02-a-pool-of-stated-thickness', 'A pool of stated thickness', 13, [R]),
    ('l03-a-bund-that-overtops', 'A bund that overtops', 12, [R]),
    ('l04-evaporation-by-mackay-and-matsugu', 'Evaporation by Mackay and Matsugu', 14, [R]),
  ]),
  ('m05-the-gaussian-plume', 'The Gaussian Plume', [
    ('l01-a-continuous-point-release', 'A continuous point release', 13, [R]),
    ('l02-stability-classes-and-the-briggs-sigmas', 'Stability classes and the Briggs sigmas', 14, [R]),
    ('l03-reflection-at-the-ground', 'Reflection at the ground', 13, [R]),
    ('l04-ppm-and-milligrams-per-cubic-metre', 'Parts per million and milligrams per cubic metre', 13, [R]),
  ]),
  ('m06-how-far-the-plume-reaches', 'How Far the Plume Reaches', [
    ('l01-off-the-centreline-and-above-the-ground', 'Off the centreline and above the ground', 13, [R]),
    ('l02-the-distance-to-a-concentration', 'The distance to a concentration', 14, [R]),
    ('l03-a-near-root-a-far-root-and-three-states', 'A near root, a far root and three states', 13, [R]),
    ('l04-the-capstone-brief', 'The capstone brief', 12, [R]),
  ]),
 ],
 'intermediate': [
  ('m01-how-fast-a-pool-burns', 'How Fast a Pool Burns', [
    ('l01-the-solid-flame-model', 'The solid flame model', 12, [F]),
    ('l02-the-babrauskas-burning-flux', 'The Babrauskas burning flux', 13, [F]),
    ('l03-when-the-diameter-stops-mattering', 'When the diameter stops mattering', 13, [F]),
    ('l04-the-burgess-form', 'The Burgess form', 13, [F]),
  ]),
  ('m02-the-flame-length', 'The Flame Length', [
    ('l01-thomas-in-still-air', 'Thomas in still air', 13, [F]),
    ('l02-thomas-with-wind', 'Thomas with wind', 14, [F]),
    ('l03-the-characteristic-wind-speed', 'The characteristic wind speed', 13, [F]),
    ('l04-the-scaled-wind-speed-held-at-one', 'The scaled wind speed held at one', 12, [F]),
    ('l05-flame-length-against-the-wind', 'Flame length against the wind', 13, [F]),
  ]),
  ('m03-tilt-and-surface-emissive-power', 'Tilt and Surface Emissive Power', [
    ('l01-the-flame-tilt', 'The flame tilt', 13, [F]),
    ('l02-the-froude-and-reynolds-numbers', 'The Froude and Reynolds numbers', 14, [F]),
    ('l03-surface-emissive-power-from-the-diameter', 'Surface emissive power from the diameter', 13, [F]),
    ('l04-radiative-fraction-and-soot', 'Radiative fraction and soot', 14, [F]),
  ]),
  ('m04-the-view-factor', 'The View Factor', [
    ('l01-a-target-and-a-cylinder', 'A target and a cylinder', 12, [F]),
    ('l02-vertical-and-horizontal-view-factors', 'Vertical and horizontal view factors', 14, [F]),
    ('l03-the-maximum-view-factor', 'The maximum view factor', 13, [F]),
    ('l04-a-flame-leaning-toward-the-target', 'A flame leaning toward the target', 14, [F]),
    ('l05-a-flame-over-the-target-is-refused', 'A flame over the target is refused', 13, [F]),
  ]),
  ('m05-transmissivity-and-the-heat-flux', 'Transmissivity and the Heat Flux', [
    ('l01-the-bagster-transmissivity', 'The Bagster transmissivity and its range', 13, [F]),
    ('l02-the-heat-flux-as-a-product', 'The heat flux as a product', 13, [F]),
    ('l03-the-distance-to-a-heat-flux', 'The distance to a heat flux', 14, [F]),
    ('l04-the-point-source-belongs-elsewhere', 'The point source belongs to another course', 12, []),
  ]),
  ('m06-a-published-pool-fire-reproduced', 'A Published Pool Fire, Reproduced', [
    ('l01-the-worked-pool-fire-step-by-step', 'The worked pool fire, step by step', 14, [F]),
    ('l02-the-errata-in-the-worked-example', 'The errata in the worked example', 13, [F]),
    ('l03-the-refusals-of-the-fire-half', 'The refusals of the fire half', 13, [F]),
    ('l04-the-capstone-brief', 'The capstone brief', 12, [F]),
  ]),
 ],
 'advanced': [
  ('m01-tnt-and-the-scaled-distance', 'TNT and the Scaled Distance', [
    ('l01-the-tnt-equivalent-mass', 'The TNT equivalent mass', 13, [H]),
    ('l02-cube-root-scaling', 'Cube root scaling', 13, [H]),
    ('l03-the-kinney-and-graham-overpressure', 'The Kinney and Graham overpressure', 14, [H]),
    ('l04-the-range-the-fit-is-used-over', 'The range the fit is used over', 12, [H]),
  ]),
  ('m02-the-blast-field', 'The Blast Field', [
    ('l01-overpressure-against-distance', 'Overpressure against distance', 13, [H]),
    ('l02-the-distance-for-an-overpressure', 'The distance for an overpressure', 14, [H]),
    ('l03-printed-constants-and-a-computed-column', 'Printed constants and a computed column', 13, [H]),
    ('l04-what-a-free-air-burst-leaves-out', 'What a free air burst leaves out', 12, [H]),
  ]),
  ('m03-probits', 'Probits', [
    ('l01-a-probit-and-a-probability', 'A probit and a probability', 13, [H]),
    ('l02-the-printed-probit-table', 'The printed probit table', 12, [H]),
    ('l03-thermal-probits-and-the-four-thirds', 'Thermal probits and the four thirds', 14, [H]),
    ('l04-four-thermal-presets-that-disagree', 'Four thermal presets that disagree', 13, [H]),
    ('l05-the-overpressure-probit', 'The overpressure probit', 13, [H]),
  ]),
  ('m04-toxic-probits', 'Toxic Probits', [
    ('l01-the-toxic-load', 'The toxic load', 13, [H]),
    ('l02-two-sources-for-one-substance', 'Two sources for one substance', 14, [H]),
    ('l03-a-preset-in-the-other-unit', 'A preset in the other unit', 13, [H, R]),
    ('l04-a-concentration-that-changes', 'A concentration that changes', 13, [H]),
  ]),
  ('m05-what-the-engine-does-not-do', 'What the Engine Does Not Do', [
    ('l01-releases-it-does-not-model', 'Releases and plumes it does not model', 13, []),
    ('l02-fires-and-blasts-it-does-not-model', 'Fires and blasts it does not model', 13, []),
    ('l03-harm-it-does-not-model', 'Harm it does not model', 12, [H]),
    ('l04-the-single-route-quantities', 'The single route quantities', 14, [F, R]),
    ('l05-the-inverse-probit-is-approximate', 'The inverse probit is approximate', 13, [H]),
  ]),
  ('m06-judgement-end-to-end', 'Judgement, End to End', [
    ('l01-from-release-to-harm', 'From release to harm', 14, [R, F, H]),
    ('l02-what-belongs-to-other-courses', 'What belongs to other courses', 12, []),
    ('l03-writing-the-consequence-note', 'Writing the consequence note', 13, [H]),
    ('l04-the-capstone-brief', 'The capstone brief', 12, [H]),
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
        if re.search(r'(?<!k )\bbeta\b', t, re.I):
            problems.append(f'{tier}: bare beta in a title: {t}')
        if re.search(r'(?<!heat )(?<!burning )(?<!mass )(?<!evaporation )\bflux\b', t, re.I):
            problems.append(f'{tier}: unqualified flux in a title: {t}')
        if re.search(r'\bseverity\b|\blikelihood\b', t, re.I):
            problems.append(f'{tier}: severity or likelihood in a title: {t}')
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
    own = {'beginner': R, 'intermediate': F, 'advanced': H}
    for tier, pid in own.items():
        n = sum(1 for r in rows if r[0] == tier and pid in r[8])
        if n < 13:
            problems.append(f'{tier}: its own panel {pid} is tagged on only {n} lessons')
    if not quiet:
        minutes = sorted({r[7] for r in rows})
        print(f'H4 consequence structure: {len(rows)} lessons, '
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
        print('  history modules: none (this engine has no repair history)')
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
