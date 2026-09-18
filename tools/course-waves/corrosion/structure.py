# FC9 Corrosion & Integrity. Three tiers, six modules each, 26 lessons a tier.
#
# Engine: engines/facilities/corrosion.js, vendored sha-identical with engines
# d4c19ad (the FC9-0 repair and the WITHDRAWAL). It imports nothing, so the
# vendoring closure walked from the jest suite is SIX paths: three reached by the
# walk and three NAMED with their reason. A LATER REPAIR WILL GROW THAT CLOSURE;
# re-walk it rather than copying this number.
#
# THE DIGEST IS THE ONLY TEACHING TRUTH. digest.txt, 25 sections, built by
# fc9_dump.mjs. RECON.md and FINDINGS.md in this directory are PROVENANCE, and so
# are the engine's source comments and the repair record vendored beside the
# oracle. Two figures in a sibling course's Expert brief came from its recon
# report and were wrong, and the writer correctly refused to invent them.
#
# Panel ids: C the chemistry explorer (partial pressure against fugacity, the
# cap, the H2S threshold comparison and the film-governing ratio from mole
# fractions), R the rate explorer (the two resistances in series, the film factor
# and its computed onset, the pH correction and its refusal, the wetting regime),
# I the inhibitor and integrity explorer (efficiency against availability, the
# effective protection surface, the shear coupling, the allowance and the
# remaining life). All three read ONE teaching lab.
#
# Titles carry COUNTS only, never a MEASUREMENT. "Four answers about which film
# governs" is a structural fact; "the film appears at sixty degrees" is a claim
# no writer can check and is also wrong, which is why it is not a title here.
# No em dashes and no "X, not Y" contrastive anywhere a learner reads, headings
# and module titles included.
#
# FRAMED HISTORY IS CURRICULUM. UNFRAMED HISTORY IS A DEFECT. Advanced m06 is the
# one module whose subject is what this engine used to do, and the frame sits in
# the MODULE DIRECTORY NAME and in the lesson HEADING, which is where the gate
# and the reader both look. Its single source is digest SECTION 25, which says so
# in its own title and its first line and which nothing follows.
#
# AND THIS WAVE HAS ONE THING THAT LOOKS LIKE HISTORY AND IS NOT. The WITHDRAWAL
# of the sour-service severity region is a CURRENT, PERMANENT, DECLARED absence:
# the engine returns regionProvided false and materialGuidanceProvided false
# today and will keep doing so. Its source is digest SECTION 2, whose own second
# line says it is not repair history. It is taught in BEGINNER m01 as the first
# thing to know about this app, and again in ADVANCED m06 as a general lesson
# about invented authority. Writing it as something the engine might get back is
# a defect.
#
# ---------------------------------------------------------------------------
# WHAT IS NEVER GRADED, AND IT IS MOST OF THE ENGINE.
#
# Eleven items are HELD and one is WITHDRAWN. Digest section 21 lists all twelve
# and section 3 pins every held constant against a literal in a third file. No
# lesson may present any of the following as a validated number, and no bank
# question may require one as an answer:
#
#   * any de Waard-Milliams constant, and any corrosion rate the correlation
#     produced. The course grades NO correlation rate at all.
#   * whether the protective scale factor multiplies the reaction term or the
#     combined rate, and anything downstream of that factor
#   * the published film onset temperature. The COMPUTED onset is teachable and
#     it MOVES with fugacity.
#   * the pH slope, the reference pH, and what the correlation does below it
#   * the 250 bar fugacity cap and anything above it
#   * the H2S threshold VALUE, the two sulphide ratios, the two shear thresholds,
#     the Blasius constants and the Reynolds 4000 switch
#   * the rate category bands, and therefore the category WORD
#   * an inspection interval, a minimum thickness, a retirement thickness, a
#     fitness-for-service assessment, an erosional velocity, a pitting criterion
#     and an SSC or HIC criterion, all of which are NOT PROVIDED
#   * the sour severity region and any material guidance, both WITHDRAWN
#
# Every published VALIDITY BAND of every correlation is held too. Only four
# range guards are enforced and teachable as enforced: nought to one on every
# fraction, nought to fourteen on pH, a temperature above absolute zero, and the
# partial-pressure sum against the total.
# ---------------------------------------------------------------------------
#
# SCOPE SEAMS, and every one of these is a lesson a writer would otherwise
# discover halfway through writing it. Digest section 23 is the authority.
#
#  * THE EROSIONAL VELOCITY CRITERION IS OWNED BY casingtubing (Expert M5,
#    LIVE), and cited again in nodal and gaswell. Beginner m01 and Intermediate
#    m03 CITE it and state that this engine has no erosional-velocity limit at
#    all and computes a wall shear for a different purpose: whether an inhibitor
#    film survives. The repair deliberately did NOT add one.
#  * WALL LOSS TAKEN TO A DERATED BURST PRESSURE IS OWNED BY torquedrag (Expert
#    M3 and M4, LIVE). Advanced m02 cites it. This module consumes an allowance
#    and never computes a pressure.
#  * THE BARLOW THIN-WALL RELATION WITH A DESIGN FACTOR IS OWNED BY network
#    (Associate M2, LIVE). Advanced m02 cites it as the calculation that would
#    say what the allowance is being taken off, which this module cannot.
#  * FUGACITY AND PARTIAL PRESSURE ARE OWNED BY fluid (Expert M1 L4, LIVE).
#    Beginner m02 cites it for the thermodynamics and then teaches what is
#    specific here: which quantity drives the rate, which drives the H2S
#    threshold and the film ratio, and that no fugacity correction is applied to
#    H2S at all.
#  * THE CORROSION ALLOWANCE AS A WALL THICKNESS COMPONENT IS OWNED TWICE, by
#    the Pipeline & Line Sizing studio and the Storage Tank studio, which both
#    ADD one. This studio CONSUMES one. Intermediate m05 and Advanced m05 state
#    the seam: three apps, one word, no link.
#  * corrosion, wall loss and remaining life ARE THE ONE PLACE THE LIVE
#    CATALOGUE POINTS AT THIS COURSE. integrity (Well Integrity and P&A, DRILLING
#    module, LIVE) explicitly REFUSES all three in its own scope statement.
#    Beginner m01 l01 enters there. A barrier envelope is not a corrosion
#    allowance and no lesson may write it as one.
#
# THREE NAMING COLLISIONS, LEGISLATED BEFORE A WORD IS WRITTEN. Digest section
# 22 is the binding statement and it carries the rule for each.
#  * Bare "inhibitor" already means a HYDRATE inhibitor across flowassurance:
#    methanol or MEG, dosed in mass fraction of the water phase. Always write
#    "corrosion inhibitor" on first use in every lesson and every bank question,
#    and never bare "inhibitor" in a prompt, an option or a heading.
#  * Bare "erosion" already means a GEOLOGICAL process in basin. Always write
#    "mechanical erosion" or "erosional wall loss", and every use must carry the
#    statement that this engine has no erosional-velocity criterion.
#  * FRICTION FACTOR and REYNOLDS NUMBER belong to linesizing (FC2), which
#    computes both with a different correlation and a different transition. The
#    two will not agree on the same pipe and the engine says so in its own
#    docstring. Always write "this module's friction factor" or "this module's
#    Reynolds number" and always state that the line sizing course has its own.
#  * And two MISREADINGS on the same footing: "integrity" here means one
#    arithmetic, an allowance divided by a rate; and the single "rate" is a
#    GENERAL UNIFORM rate and never a prediction for a weld, a bend, a
#    top-of-line film or a pit.
#
# ---------------------------------------------------------------------------
# PER-LESSON WORD COUNTS.
#
# THE BAND IS 420 TO 560 PROSE WORDS for every lesson in this wave, and the
# measure is PROSE WORDS ONLY, with front matter, markdown table rows and
# {{panel:...}} lines excluded and HEADINGS COUNTED. This comment used to say
# headings were excluded as well, and lengths.py, which is the code that actually
# counts, has never excluded them: a writer who believed the comment ran twenty
# to forty words light against the floor on every lesson. A raw `wc -w` over the
# whole file is a third measure again and runs materially higher, so a lesson can
# be inside the band and still fail a raw word count. Say which measure before
# quoting a number.
#
# The MINIMUM is per lesson and is DERIVED from the estimated minutes rather than
# typed, so the ranking by est_minutes and the ranking by length cannot disagree.
# A twelve-minute lesson must clear 420 words, a thirteen-minute one 460, a
# fourteen-minute one 500, and the ceiling is 560 for all of them. That leaves
# every lesson at least 60 words of room, which is what stops the minimum and the
# maximum meeting. An est_minutes with no declared minimum RAISES rather than
# defaulting, because a silent default is how a fifteen-minute lesson would get a
# twelve-minute floor.
# ---------------------------------------------------------------------------
BAND = (420, 560)
MIN_BY_MINUTES = {12: 420, 13: 460, 14: 500}


def min_words(est_minutes):
    """The minimum prose words a lesson of this length must carry."""
    if est_minutes not in MIN_BY_MINUTES:
        raise ValueError(
            f'no minimum word count is declared for {est_minutes} estimated minutes; '
            f'declared: {sorted(MIN_BY_MINUTES)}')
    return MIN_BY_MINUTES[est_minutes]


C = 'fc-chemistry-explorer'
R = 'fc-rate-explorer'
I = 'fc-inhibitor-integrity-explorer'
PANEL_IDS = [C, R, I]

# Lessons whose source section of the digest did not exist until FC9-0, the
# engine repair, had landed and the digest had been rebuilt against it. The
# repair is MERGED and VENDORED and the digest is built, so nothing is held now.
# The list is kept because it records which eleven lessons a writer must not be
# handed before a repair of this kind lands.
HELD = []

TIERS = {
 'beginner': [
  ('m01-what-this-screen-answers-and-what-it-withdrew', 'What This Screen Answers, and What It Withdrew', [
    ('l01-one-mechanism-one-rate', 'One mechanism, one rate', 12, []),
    ('l02-the-region-that-was-withdrawn', 'The region that was withdrawn', 13, [C]),
    ('l03-what-a-uniform-rate-is-not', 'What a uniform rate cannot tell you', 13, []),
    ('l04-the-numbers-with-no-source', 'The numbers with no source', 14, []),
    ('l05-the-units-this-engine-speaks', 'The units this engine speaks', 12, [C]),
  ]),
  ('m02-what-is-in-the-stream', 'What Is in the Stream', [
    ('l01-partial-pressure-from-a-mole-fraction', 'Partial pressure from a mole fraction', 12, [C]),
    ('l02-fugacity-and-the-cap-it-is-held-at', 'Fugacity, and the cap it is held at', 14, [C]),
    ('l03-which-quantity-drives-what', 'Which quantity drives what', 14, [C]),
    ('l04-h2s-has-no-fugacity-correction', 'H2S has no fugacity correction here', 13, [C]),
  ]),
  ('m03-two-resistances-in-series', 'Two Resistances in Series', [
    ('l01-a-reaction-rate-and-a-transport-rate', 'A reaction rate and a transport rate', 13, [R]),
    ('l02-why-the-combination-is-below-both', 'Why the combination is below both', 13, [R]),
    ('l03-velocity-and-line-size-enter-here', 'Velocity and line size enter here', 14, [R]),
    ('l04-which-one-is-holding-it-back', 'Which one is holding it back', 13, [R]),
    ('l05-an-absent-velocity-is-not-infinite-capacity', 'An absent velocity is not unlimited capacity', 13, [R]),
  ]),
  ('m04-the-protective-film', 'The Protective Film', [
    ('l01-hotter-is-not-always-faster', 'Hotter is not always faster', 13, [R]),
    ('l02-an-onset-that-moves', 'An onset that moves', 14, [R]),
    ('l03-the-factor-is-clamped-at-one', 'The factor is clamped at one', 12, [R]),
    ('l04-where-the-factor-belongs-is-unsettled', 'Where the factor belongs is unsettled', 14, [R]),
  ]),
  ('m05-ph-and-the-water', 'The pH and the Water', [
    ('l01-a-correction-relative-to-a-reference', 'A correction relative to a reference', 12, [R]),
    ('l02-one-decade-per-two-units', 'One decade per two units', 13, [R]),
    ('l03-below-the-reference-it-refuses', 'Below the reference it refuses', 14, [R]),
    ('l04-oil-wet-is-a-regime', 'Oil wet is a regime', 13, [R]),
  ]),
  ('m06-one-screen-end-to-end', 'One Screen, End to End', [
    ('l01-the-case-the-studio-ships-with', 'The case the studio ships with', 13, [C, R]),
    ('l02-reading-the-summary-rail', 'Reading the summary rail', 13, [I]),
    ('l03-what-the-binding-constraint-is-for', 'What the binding constraint is for', 13, [I]),
    ('l04-the-capstone-brief', 'The capstone brief', 12, [C, R, I]),
  ]),
 ],
 'intermediate': [
  ('m01-the-wetting-regime', 'The Wetting Regime', [
    ('l01-steel-corrodes-where-it-is-wet', 'Steel corrodes where it is wet', 12, [R]),
    ('l02-the-water-cut-is-read-in-one-regime', 'The water cut is read in one regime', 13, [R]),
    ('l03-a-zero-by-assumption', 'A zero by assumption', 14, [R]),
    ('l04-the-largest-lever-is-a-dropdown', 'A lever that is a dropdown', 13, [R]),
  ]),
  ('m02-efficiency-is-not-protection', 'Efficiency Is Not Protection', [
    ('l01-two-inputs-not-one', 'Two inputs where people expect one', 12, [I]),
    ('l02-the-time-average-eats-the-wall', 'The time average eats the wall', 13, [I]),
    ('l03-the-metal-loss-ratio', 'The metal loss ratio', 14, [I]),
    ('l04-a-hundred-percent-is-arithmetic', 'A hundred percent is arithmetic', 13, [I]),
    ('l05-every-clamp-is-named', 'Every clamp is named', 12, [I]),
  ]),
  ('m03-wall-shear', 'Wall Shear', [
    ('l01-what-the-shear-is-for', 'What the shear is for', 12, [I]),
    ('l02-this-modules-own-friction-factor', 'This module has its own friction factor', 14, [I]),
    ('l03-a-switch-that-jumps', 'A switch that jumps', 14, [I]),
    ('l04-the-thresholds-carry-no-source', 'The thresholds carry no source', 13, [I]),
  ]),
  ('m04-the-shear-acts-on-the-rate', 'The Shear Acts on the Rate', [
    ('l01-the-credit-is-removed', 'The credit is removed', 13, [I]),
    ('l02-the-credited-rate-beside-it', 'The credited rate beside it', 13, [I]),
    ('l03-the-ratio-is-pure-arithmetic', 'The ratio is pure arithmetic', 14, [I]),
    ('l04-shear-first-or-no-rate-at-all', 'Shear first, or no rate at all', 13, [I]),
  ]),
  ('m05-the-allowance', 'The Allowance', [
    ('l01-an-allowance-divided-by-a-rate', 'An allowance divided by a rate', 12, [I]),
    ('l02-what-has-already-gone', 'What has already gone', 13, [I]),
    ('l03-a-zero-rate-is-not-a-pass', 'A zero rate is not a pass', 14, [I]),
    ('l04-three-apps-one-word-no-link', 'Three apps, one word, no link', 13, [I]),
    ('l05-integrity-read-narrowly', 'Integrity, read narrowly', 13, [I]),
  ]),
  ('m06-which-film-governs', 'Which Film Governs', [
    ('l01-a-ratio-that-needs-no-pressure', 'A ratio that needs no pressure', 13, [C]),
    ('l02-four-answers-and-one-refusal', 'Four answers and one refusal', 14, [C]),
    ('l03-the-threshold-comparison-alone', 'The threshold comparison, alone', 13, [C]),
    ('l04-the-capstone-brief', 'The capstone brief', 12, [C, I]),
  ]),
 ],
 'advanced': [
  ('m01-what-this-module-holds-back', 'What This Module Holds Back', [
    ('l01-eleven-items-and-one-withdrawal', 'Eleven items and one withdrawal', 13, []),
    ('l02-a-constant-in-two-files', 'A constant that lives in two files', 14, []),
    ('l03-measuring-rather-than-reading', 'Measuring rather than reading an export', 14, []),
    ('l04-what-a-synthetic-case-can-prove', 'What a synthetic case can prove', 14, []),
    ('l05-what-no-case-can-discriminate', 'What no case here can discriminate', 13, []),
  ]),
  ('m02-what-the-module-does-not-have', 'What the Module Does Not Have', [
    ('l01-no-interval-no-thickness', 'No interval and no thickness', 13, []),
    ('l02-no-erosional-velocity', 'No erosional velocity', 13, []),
    ('l03-no-pitting-and-no-cracking', 'No pitting and no cracking criterion', 13, []),
    ('l04-what-the-allowance-is-taken-off', 'What the allowance is taken off', 14, [I]),
  ]),
  ('m03-the-label-and-the-band', 'The Label and the Band', [
    ('l01-four-words-three-boundaries', 'Four words and three boundaries', 12, [R]),
    ('l02-a-label-is-not-a-measurement', 'A label is not a measurement', 13, [R]),
    ('l03-optimistic-by-a-step-or-two', 'Optimistic by a step or two', 13, [R]),
    ('l04-the-default-case-reads-high', 'The default case reads high', 13, [R]),
  ]),
  ('m04-the-summary-that-was-missing', 'The Summary That Reconciles the Screen', [
    ('l01-seven-numbers-and-no-verdict', 'Seven numbers and no verdict', 13, [I]),
    ('l02-the-order-is-the-claim', 'The order is the claim', 14, [I]),
    ('l03-what-would-i-change-first', 'What would I change first', 13, [I]),
    ('l04-a-constraint-is-not-a-recommendation', 'A constraint is not a recommendation', 13, [I]),
  ]),
  ('m05-inversion-against-a-limit', 'Inversion Against a Limit', [
    ('l01-what-rate-can-i-tolerate', 'What rate can I tolerate', 13, [I]),
    ('l02-what-availability-do-i-need', 'What availability do I need', 14, [I]),
    ('l03-what-allowance-reinstates-the-life', 'What allowance reinstates the life', 14, [I]),
    ('l04-two-fields-two-questions', 'Two fields answering two questions', 13, [I]),
    ('l05-the-capstone-brief', 'The capstone brief', 12, [C, R, I]),
  ]),
  ('m06-what-this-engine-used-to-do', 'What This Engine Used To Do', [
    ('l01-an-invented-curve-wearing-authority', 'An invented curve wearing authority', 14, []),
    ('l02-an-input-that-moved-nothing', 'An input that moved nothing', 13, []),
    ('l03-the-least-limiting-default', 'The least limiting default', 13, []),
    ('l04-a-guard-switched-off-at-its-own-default', 'A guard switched off at its own default', 13, []),
  ]),
 ],
}

# ---------------------------------------------------------------------------
# THE CHECKS THIS FILE RUNS ON ITSELF. Run `python3 structure.py` to see them.
# A structure file that is wrong about its own shape is a structure file every
# later phase inherits, so it states its counts rather than being read for them.
# ---------------------------------------------------------------------------


def flat():
    """Every lesson in the wave as (tier, module_key, module_title, module_order,
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
        per_tier.setdefault(r[0], 0)
        per_tier[r[0]] += 1
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
        for mkey, _, lessons in mods:
            lkeys = [l[0] for l in lessons]
            if len(set(lkeys)) != len(lkeys):
                problems.append(f'{tier}/{mkey} repeats a lesson key')
    # THE OWNER COPY RULE, over every title a learner reads
    for tier, mods in TIERS.items():
        for mkey, mtitle, lessons in mods:
            for t in [mtitle] + [l[1] for l in lessons]:
                if re.search('[–—]', t):
                    problems.append(f'{tier}: title carries a dash: {t}')
                if re.search(r',\s+not\s+\w', t):
                    problems.append(f'{tier}: title carries a contrastive: {t}')
    # A TITLE CARRIES COUNTS ONLY, NEVER A MEASUREMENT. A count is a small whole
    # number of things the structure itself fixes; a measurement is a figure a
    # writer cannot check until the digest exists. Counts here are spelled in
    # words, so ANY DIGIT in a title is a measurement. There is no symbol
    # exemption in this wave because this engine's constants are all held and a
    # title naming one would be quoting an unsourced number.
    # A CHEMICAL FORMULA IS A NAME AND ITS SUBSCRIPT IS PART OF THE NAME. H2S and
    # CO2 are what the molecules are called, so their digits are not figures a
    # writer could have got wrong. The exemption is a CLASS and not a per-title
    # allowlist, which is what stops it rotting, and it is deliberately narrow:
    # this engine's own constants are all held, so a title naming one would be
    # quoting an unsourced number and there is no exemption for that.
    FORMULAE = re.compile(r'\b(?:H2S|CO2|H2O|FeCO3|FeS)\b')
    for tier, mods in TIERS.items():
        for mkey, mtitle, lessons in mods:
            for t in [mtitle] + [l[1] for l in lessons]:
                if re.search(r'\d', FORMULAE.sub(' ', t)):
                    problems.append(f'{tier}: title carries a digit, which is a measurement rather than a count: {t}')
    # AND THE EXEMPTION IS PROVED ALIVE: a formula really does appear in a title,
    # so the class above is doing work rather than sitting dead.
    if not any(FORMULAE.search(t) for tier, mods in TIERS.items()
               for mkey, mtitle, lessons in mods for t in [mtitle] + [l[1] for l in lessons]):
        problems.append('the chemical formula exemption matches no title, so it clears nothing')
    # THE HISTORY MODULE IS EXACTLY ONE, AND ITS KEY CARRIES THE FRAME. The gate
    # and the reader both look at the directory name, so the frame lives there.
    hist = [(tier, m[0]) for tier, mods in TIERS.items() for m in mods
            if re.search(r'used-to|was-repaired|repair-history', m[0])]
    if hist != [('advanced', 'm06-what-this-engine-used-to-do')]:
        problems.append(f'the history module is not exactly advanced m06: {hist}')
    # and no OTHER module or lesson title may carry history wording
    for tier, mods in TIERS.items():
        for mkey, mtitle, lessons in mods:
            if (tier, mkey) == ('advanced', 'm06-what-this-engine-used-to-do'):
                continue
            for t in [mtitle] + [l[1] for l in lessons] + [mkey] + [l[0] for l in lessons]:
                if re.search(r'used to|no longer|was wrong|now fixed|before the repair', t, re.I):
                    problems.append(f'{tier}: history wording outside the one history module: {t}')
    # THE WITHDRAWAL IS TAUGHT IN BEGINNER m01 AND AGAIN IN ADVANCED m06, and it
    # is NOT history: digest section 2 says so in its own second line. Both
    # lessons must exist, because the withdrawal is this wave's headline and a
    # course that mentioned it only in the history module would teach a learner
    # that the region is coming back.
    keys = {(r[0], r[1], r[5]) for r in rows}
    for needed in [('beginner', 'm01-what-this-screen-answers-and-what-it-withdrew', 'l02-the-region-that-was-withdrawn'),
                   ('advanced', 'm06-what-this-engine-used-to-do', 'l01-an-invented-curve-wearing-authority')]:
        if needed not in keys:
            problems.append(f'the withdrawal lesson is missing: {needed}')
    # THREE CAPSTONE BRIEF LESSONS, one a tier, and they are the last lesson of
    # the last module so nothing follows the brief in its own tier.
    briefs = [(r[0], r[1], r[5]) for r in rows if r[5].endswith('the-capstone-brief')]
    if len(briefs) != 3:
        problems.append(f'{len(briefs)} capstone brief lessons, expected one a tier')
    for tier in TIERS:
        last_mod = TIERS[tier][-1]
        if last_mod[2][-1][0] != 'l04-the-capstone-brief' and tier != 'advanced':
            problems.append(f'{tier}: the capstone brief is not the last lesson of the last module')
    for h in HELD:
        if h not in keys:
            problems.append(f'HELD names a lesson that does not exist: {h}')
    minutes = sorted({r[7] for r in rows})
    print(f'FC9 corrosion structure: {len(rows)} lessons, '
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
    print(f'  the one history module: advanced m06, frame in the directory name')
    print(f'  lessons HELD until the engine repair landed: {len(HELD)} (the repair is merged and vendored, so none is held)')
    print(f'  PROBLEMS: {len(problems)}')
    for p in problems:
        print(f'   {p}')
    return problems


if __name__ == '__main__':
    import sys
    sys.exit(1 if check() else 0)
