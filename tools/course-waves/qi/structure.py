# QI Quantitative Interpretation. Three tiers, six modules each, 26 lessons a
# tier. The last course of the Geoscience module (path_order 80), after Basin
# & Charge. An APP COURSE: the Suite app is QI Studio (Suite tile qi-studio,
# Geoscience), which runs the same engines; the course names it and bridges to
# it, and every practical still runs in the course's own four explorer panels,
# so a learner without a Suite seat can work every exercise.
#
# Plan of record: Suite docs/scope/NextGen-QI-Course-PLAN.md, approved by the
# owner 2026-10-11 with every decision as recommended (D1 prerequisite welldata
# only; D2 teach on Ekene kit v3, capstones on held-out synthetic cases; D3 the
# {{video}} marker and registry, members videos dormant until a host exists;
# D4 the app-side QI maths moves into the engines; D5 qi, Geoscience, 80).
#
# Engines: engines/qi/*, engines/rockphysics/*, lib/gridding/closure.js,
# vendored sha-identical from petrolord-engines at their canonical paths
# (vendor_qi.sh proves it, four proofs a path).
#
# THE DIGEST IS THE ONLY TEACHING TRUTH. digest.txt, built by qi_dump.mjs from
# the teaching pack (the Ekene kit v3 cut, src/components/course/panels/qi/
# ekeneQiPack.json). The kit's 10-qi truth file, the oracles, the goldens, the
# engine source comments and the videos are PROVENANCE. A video speaks numbers
# measured in QI Studio on the full survey; a lesson may quote one only where
# the digest prints it with its provenance, and none is ever graded.
#
# THE COURSE IN ONE SENTENCE. A quantitative interpretation asks two questions,
# is the data good enough and can the seismic see the fluid, and answers them
# with stated engines on stated data: feasibility at Associate (inventory,
# seismic QC, elastic logs, substitution, the wet trend and modelled AVO),
# from the tie to AVO on the seismic at Professional (wavelets, the tie, the
# gathers, angles from velocity, AVO volumes and AVO at the wells), and
# inversion, properties and the decision at Expert (the forward model, post
# stack and simultaneous inversion, properties from impedance, prospects and
# the report); each tier is graded on its own question with numbers the
# engines return on a held-out synthetic case.
#
# TIER OWNERSHIP:
#   Associate    FEASIBILITY. The two questions, the Ekene field and the
#                teaching pack, units and polarity, the panels and their
#                refusals; the data inventory and the usability matrix; seismic
#                QC (the amplitude spectrum, band edges and the centroid,
#                signal to noise from coherency, footprint); measured shear,
#                Greenberg-Castagna and the local shear trend with its
#                prediction interval, the elastic set; fluids, oil-to-brine
#                substitution, the wet trend and the distance from it;
#                modelled AVO at the zone top and the feasibility verdict.
#   Professional FROM THE TIE TO AVO ON THE SEISMIC. Statistical and well
#                wavelets, phase and correlation; the bulk shift, anchors and
#                the time-depth record, one field wavelet; offset gathers, NMO
#                stretch and its mute, residual moveout, fold; Dix, Walden's
#                angle, angle gathers, partial stacks and the usable angle; the
#                Shuey fit, intercept and gradient, the background trend, the
#                fluid factor and chi; AVO at the wells.
#   Expert       INVERSION, PROPERTIES AND THE DECISION. The convolutional
#                model and its adjoint, the low-frequency model, the wavelet
#                scale; model-based, sparse-spike and coloured inversion,
#                blind wells, quantiles across realisations; Fatti's
#                simultaneous inversion; property transforms with intervals,
#                left-out wells, Bayesian facies and the confusion matrix;
#                closure, anomaly conformance, evidence and the assessment;
#                the report and what QI never sets.
#
# A higher tier may USE a lower tier's methods, and each capstone grades only
# its own question.
#
# SCOPE SEAMS, recorded so no lesson re-teaches another course's material:
#   * Batzle-Wang fluids, Gassmann, Greenberg-Castagna, Shuey, the
#     Rutherford-Williams classes, exact Zoeppritz and wedge tuning are OWNED
#     BY the Rock Physics course; this course recaps each in one lesson and
#     applies it;
#   * the synthetic seismogram, the bulk shift and tuning on a single well are
#     OWNED BY the Seismic Interpretation course;
#   * Bayesian classification as a subject is OWNED BY the Facies course;
#   * Q10, Q50 and Q90 and Monte Carlo as a subject are OWNED BY the
#     uncertainty course;
#   * gridding and closure mapping are OWNED BY the Mapping course; this
#     course reads a stated grid.
#
# Panel ids: F the feasibility explorer (Associate), P the prestack explorer
# (Professional), I the inversion explorer (Expert), R the prospect explorer
# (Expert). Every panel takes a learner's own inputs, which is how a capstone
# is worked.
#
# VIDEOS: VIDEO maps a lesson to the {{video:<id>}} marker the scaffold writes
# under its panel line. Videos are optional enrichment and never gate
# completion; the registry is src/content/videos/registry.js.
#
# Titles carry COUNTS only, never a MEASUREMENT, and counts are spelled in
# words: ANY DIGIT in a title fails the check below. No em dashes and no "X,
# not Y" contrastive (nor "rather than", ", never", "instead of", "and not" or
# "and never") anywhere a learner reads, headings and module titles included.
# "AI" never appears in a title: in this course it means acoustic impedance,
# and a title spells "impedance".
#
# THIS COURSE TEACHES NO REPAIR HISTORY.
#
# PER-LESSON WORD COUNTS. The band is 420 to 560 PROSE WORDS, measured by
# lengths.py (front matter, table rows, {{panel}} and {{video}} lines excluded,
# HEADINGS COUNTED). The minimum is DERIVED from est_minutes: 420 at 12, 460 at
# 13, 500 at 14. An est_minutes with no declared minimum RAISES.
BAND = (420, 560)
MIN_BY_MINUTES = {12: 420, 13: 460, 14: 500}


def min_words(est_minutes):
    """The minimum prose words a lesson of this length must carry."""
    if est_minutes not in MIN_BY_MINUTES:
        raise ValueError(
            f'no minimum word count is declared for {est_minutes} estimated minutes; '
            f'declared: {sorted(MIN_BY_MINUTES)}')
    return MIN_BY_MINUTES[est_minutes]


F = 'qi-feasibility-explorer'
P = 'qi-prestack-explorer'
I = 'qi-inversion-explorer'
R = 'qi-prospect-explorer'
PANEL_IDS = [F, P, I, R]

TIERS = {
 'beginner': [
  ('m01-what-a-qi-study-asks', 'What a QI Study Asks', [
    ('l01-why-a-qi-study', 'Why a QI study', 12, [F]),
    ('l02-the-ekene-field-and-the-teaching-pack', 'The Ekene field and the teaching pack', 12, [F]),
    ('l03-the-two-questions', 'The two questions', 12, [F]),
    ('l04-times-polarity-and-impedance-units', 'Times, polarity and impedance units', 13, [F]),
    ('l05-the-panels-and-their-refusals', 'The panels and their refusals', 13, [F]),
  ]),
  ('m02-the-data-inventory', 'The Data Inventory', [
    ('l01-what-a-qi-study-needs-from-each-well', 'What a QI study needs from each well', 12, [F]),
    ('l02-the-usability-matrix', 'The usability matrix', 13, [F]),
    ('l03-limited-and-missing-curves', 'Limited and missing curves', 13, [F]),
    ('l04-the-issue-register', 'The issue register', 12, [F]),
  ]),
  ('m03-seismic-qc', 'Seismic QC', [
    ('l01-the-amplitude-spectrum', 'The amplitude spectrum', 13, [F]),
    ('l02-band-edges-and-the-centroid', 'Band edges and the centroid', 14, [F]),
    ('l03-signal-to-noise-from-trace-coherency', 'Signal to noise from trace coherency', 14, [F]),
    ('l04-acquisition-footprint', 'Acquisition footprint and where to measure it', 13, [F]),
  ]),
  ('m04-elastic-logs-at-the-wells', 'Elastic Logs at the Wells', [
    ('l01-what-rock-physics-hands-to-qi', 'What Rock Physics hands to QI', 12, [F]),
    ('l02-measured-shear-against-greenberg-castagna', 'Measured shear against Greenberg-Castagna', 13, [F]),
    ('l03-the-local-shear-trend-and-its-interval', 'The local shear trend and its prediction interval', 14, [F]),
    ('l04-the-elastic-set', 'The elastic set', 13, [F]),
  ]),
  ('m05-will-the-fluid-show', 'Will the Fluid Show?', [
    ('l01-the-fluids-at-ekene-conditions', 'The fluids at Ekene conditions', 12, [F]),
    ('l02-oil-to-brine-substitution-on-a-log', 'Oil-to-brine substitution on a log', 14, [F]),
    ('l03-how-far-impedance-and-vpvs-move', 'How far impedance and Vp/Vs move', 13, [F]),
    ('l04-the-wet-trend-on-a-crossplot', 'The wet trend on a crossplot', 13, [F]),
    ('l05-distance-from-the-wet-trend', 'Distance from the wet trend', 13, [F]),
  ]),
  ('m06-the-feasibility-verdict', 'The Feasibility Verdict', [
    ('l01-modelled-avo-at-the-zone-top', 'Modelled AVO at the zone top', 13, [F]),
    ('l02-in-situ-against-brine', 'In situ against brine', 13, [F]),
    ('l03-writing-the-verdict', 'Writing the verdict', 12, [F]),
    ('l04-the-capstone-brief', 'The capstone brief', 12, [F]),
  ]),
 ],
 'intermediate': [
  ('m01-from-feasibility-to-the-tie', 'From Feasibility to the Tie', [
    ('l01-what-the-professional-tier-adds', 'What the Professional tier adds', 12, [P]),
    ('l02-the-synthetic-in-one-lesson', 'The synthetic in one lesson', 13, [P]),
    ('l03-statistical-and-well-wavelets', 'Statistical and well wavelets', 14, [P]),
    ('l04-phase-and-correlation', 'Phase and correlation', 13, [P]),
  ]),
  ('m02-the-tie-and-the-field-wavelet', 'The Tie and the Field Wavelet', [
    ('l01-bulk-shift-and-anchors', 'Bulk shift and anchors', 13, [P]),
    ('l02-the-time-depth-record', 'The time-depth record every app reads', 12, [P]),
    ('l03-comparing-wavelets-across-wells', 'Comparing wavelets across wells', 13, [P]),
    ('l04-aligning-and-averaging-one-field-wavelet', 'Aligning and averaging into one field wavelet', 14, [P]),
    ('l05-when-one-well-disagrees', 'When one well disagrees', 12, [P]),
  ]),
  ('m03-gathers-and-their-qc', 'Gathers and Their QC', [
    ('l01-offset-gathers-and-bin-width', 'Offset gathers and bin width', 13, [P]),
    ('l02-nmo-stretch-and-the-stretch-mute', 'NMO stretch and the stretch mute', 14, [P]),
    ('l03-residual-moveout', 'Residual moveout', 13, [P]),
    ('l04-fold-and-what-it-limits', 'Fold and what it limits', 12, [P]),
  ]),
  ('m04-angles-from-velocity', 'Angles from Velocity', [
    ('l01-rms-to-interval-velocity', 'RMS to interval velocity', 14, [P]),
    ('l02-waldens-straight-ray-angle', 'Walden\'s straight-ray angle', 13, [P]),
    ('l03-angle-gathers-and-ranges', 'Angle gathers and ranges', 13, [P]),
    ('l04-partial-stacks-and-the-usable-angle', 'Partial stacks and the usable angle', 14, [P]),
  ]),
  ('m05-avo-volumes', 'AVO Volumes', [
    ('l01-the-shuey-fit-from-near-mid-and-far', 'The Shuey fit from near, mid and far', 14, [P]),
    ('l02-intercept-and-gradient-volumes', 'Intercept and gradient volumes', 13, [P]),
    ('l03-the-background-trend-and-off-trend-distance', 'The background trend and the off-trend distance', 13, [P]),
    ('l04-the-fluid-factor-and-the-chi-projection', 'The fluid factor and the chi projection', 13, [P]),
    ('l05-conditioning-before-avo', 'Conditioning before AVO', 12, [P]),
  ]),
  ('m06-avo-at-the-wells', 'AVO at the Wells', [
    ('l01-one-scale-over-every-well', 'One scale over every well', 13, [P]),
    ('l02-class-agreement-and-misfit', 'Class agreement and misfit', 13, [P]),
    ('l03-what-a-disagreement-means', 'What a disagreement means', 12, [P]),
    ('l04-the-capstone-brief', 'The capstone brief', 12, [P]),
  ]),
 ],
 'advanced': [
  ('m01-the-forward-model', 'The Forward Model', [
    ('l01-what-the-expert-tier-adds', 'What the Expert tier adds', 12, [I]),
    ('l02-the-convolutional-model-and-its-adjoint', 'The convolutional model and its adjoint', 14, [I]),
    ('l03-the-low-frequency-model', 'The low-frequency model from wells and horizons', 14, [I]),
    ('l04-the-wavelet-scale', 'The wavelet scale', 13, [I]),
  ]),
  ('m02-post-stack-inversion', 'Post-Stack Inversion', [
    ('l01-model-based-least-squares', 'Model-based least squares', 14, [I]),
    ('l02-blocky-and-sparse-spike', 'Blocky and sparse-spike inversion', 13, [I]),
    ('l03-coloured-inversion', 'Coloured inversion', 13, [I]),
    ('l04-blind-wells', 'Blind wells', 13, [I]),
    ('l05-sensitivity-across-realisations', 'Sensitivity across realisations', 13, [I]),
  ]),
  ('m03-simultaneous-inversion', 'Simultaneous Inversion', [
    ('l01-fattis-three-parameters', 'Fatti\'s three parameters', 14, [I]),
    ('l02-angle-dependent-wavelets', 'Angle-dependent wavelets', 13, [I]),
    ('l03-why-density-needs-the-far-angles', 'Why density needs the far angles', 13, [I]),
    ('l04-blind-wells-per-parameter', 'Blind wells per parameter', 12, [I]),
  ]),
  ('m04-properties-from-impedance', 'Properties from Impedance', [
    ('l01-a-linear-transform-and-its-interval', 'A linear transform and its interval', 13, [R]),
    ('l02-left-out-wells-and-the-widened-band', 'Left-out wells and the widened band', 14, [R]),
    ('l03-bayesian-facies-on-impedance', 'Bayesian facies on impedance', 14, [R]),
    ('l04-two-attributes', 'Two attributes, impedance and Vp/Vs', 13, [R]),
    ('l05-the-confusion-matrix-and-a-fluid-hypothesis', 'The confusion matrix and a fluid hypothesis', 13, [R]),
  ]),
  ('m05-prospects', 'Prospects', [
    ('l01-crest-spill-and-closure', 'Crest, spill and closure', 14, [R]),
    ('l02-anomaly-conformance-and-the-implied-contact', 'Anomaly conformance and the implied contact', 14, [R]),
    ('l03-independent-evidence-and-competing-explanations', 'Independent evidence and competing explanations', 13, [R]),
    ('l04-the-qi-assessment', 'The QI assessment', 13, [R]),
  ]),
  ('m06-the-report-and-the-limits', 'The Report and the Limits', [
    ('l01-the-qi-report-and-the-handover-files', 'The QI report and the handover files', 12, [R]),
    ('l02-what-qi-never-sets', 'What QI never sets', 12, [R]),
    ('l03-what-the-engines-do-not-compute', 'What the engines do not compute', 12, [R]),
    ('l04-the-capstone-brief', 'The capstone brief', 12, [R]),
  ]),
 ],
}

# The {{video:<id>}} marker each lesson carries (plan section 2). Ids are keys
# of VIDEOS in src/content/videos/registry.js.
VIDEO = {
    ('beginner', 'm01-what-a-qi-study-asks', 'l01-why-a-qi-study'): 'qi-a1',
    ('beginner', 'm02-the-data-inventory', 'l02-the-usability-matrix'): 'qi-a2',
    ('beginner', 'm03-seismic-qc', 'l01-the-amplitude-spectrum'): 'qi-a3',
    ('beginner', 'm04-elastic-logs-at-the-wells', 'l03-the-local-shear-trend-and-its-interval'): 'qi-b4',
    ('beginner', 'm05-will-the-fluid-show', 'l02-oil-to-brine-substitution-on-a-log'): 'qi-b5',
    ('beginner', 'm05-will-the-fluid-show', 'l04-the-wet-trend-on-a-crossplot'): 'qi-b6',
    ('beginner', 'm06-the-feasibility-verdict', 'l01-modelled-avo-at-the-zone-top'): 'qi-b7',
    ('intermediate', 'm01-from-feasibility-to-the-tie', 'l03-statistical-and-well-wavelets'): 'qi-c8',
    ('intermediate', 'm02-the-tie-and-the-field-wavelet', 'l01-bulk-shift-and-anchors'): 'qi-c9',
    ('intermediate', 'm02-the-tie-and-the-field-wavelet', 'l04-aligning-and-averaging-one-field-wavelet'): 'qi-c10',
    ('intermediate', 'm03-gathers-and-their-qc', 'l01-offset-gathers-and-bin-width'): 'qi-d11',
    ('intermediate', 'm04-angles-from-velocity', 'l02-waldens-straight-ray-angle'): 'qi-d12',
    ('intermediate', 'm05-avo-volumes', 'l02-intercept-and-gradient-volumes'): 'qi-e13',
    ('intermediate', 'm06-avo-at-the-wells', 'l01-one-scale-over-every-well'): 'qi-e14',
    ('advanced', 'm02-post-stack-inversion', 'l01-model-based-least-squares'): 'qi-f15',
    ('advanced', 'm03-simultaneous-inversion', 'l01-fattis-three-parameters'): 'qi-f16',
    ('advanced', 'm04-properties-from-impedance', 'l02-left-out-wells-and-the-widened-band'): 'qi-f17',
    ('advanced', 'm05-prospects', 'l04-the-qi-assessment'): 'qi-f18',
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
    own = {'beginner': [F], 'intermediate': [P], 'advanced': [I, R]}
    for tier, pids in own.items():
        n = sum(1 for r in rows if r[0] == tier and any(p in r[8] for p in pids))
        if n < 13:
            problems.append(f'{tier}: its own panels {pids} are tagged on only {n} lessons')
    # NO FORWARD PANEL: a lower tier never tags a higher tier's panel.
    rank = {F: 0, P: 1, I: 2, R: 2}
    trank = {'beginner': 0, 'intermediate': 1, 'advanced': 2}
    for r in rows:
        for pid in r[8]:
            if rank[pid] > trank[r[0]]:
                problems.append(f'{r[0]}/{r[5]} tags the higher tier panel {pid}')
    # EVERY VIDEO MARKER NAMES A REAL LESSON, eighteen in all, one per video.
    keys = {(r[0], r[1], r[5]) for r in rows}
    for k, vid in VIDEO.items():
        if k not in keys:
            problems.append(f'video {vid} is placed on a lesson that does not exist: {k}')
    if len(VIDEO) != 18 or len(set(VIDEO.values())) != 18:
        problems.append(f'expected eighteen distinct video placements, found {len(VIDEO)} ({len(set(VIDEO.values()))} distinct)')
    if not quiet:
        minutes = sorted({r[7] for r in rows})
        print(f'QI structure: {len(rows)} lessons, '
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
