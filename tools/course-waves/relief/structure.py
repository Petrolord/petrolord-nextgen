# FC5 Relief & Flare Systems. Three tiers, six modules each, 26 lessons a tier.
#
# Engine: engines/facilities/relief.js, vendored sha-identical with engines
# 82ec6d4. It imports nothing, so the vendoring closure is FOUR paths, walked
# rather than assumed. A REPAIR WILL GROW THAT CLOSURE; re-walk it.
#
# Panel ids: S the sizing explorer (the four API 520 routes side by side, the
# critical ratio, F2 across the back pressure, Kv against Reynolds, KN across
# pressure and the API 526 ladder), F the fire and drum explorer (wetted area
# against level in both orientations, the duty, the load, settling against
# droplet size and the drum length against diameter), B the blowdown explorer
# (the march, the step study, both trajectories, time against orifice, and the
# point source asked both ways). All three read ONE teaching lab.
#
# Titles carry COUNTS only, never a MEASUREMENT. "The fourteen standard
# orifices" is a structural fact; "Napier above fifteen hundred psia" is a
# claim the writer cannot check until the digest exists, so it is not a title
# here. No em dashes and no "X, not Y" contrastive anywhere a learner reads,
# headings and module titles included.
#
# FRAMED HISTORY IS CURRICULUM. UNFRAMED HISTORY IS A DEFECT. Advanced m06 is
# the one module whose subject is what this engine used to do, and the frame
# sits in the MODULE DIRECTORY NAME and in the lesson HEADING, which is where
# the gate and the reader both look. Its single source is the digest's FINAL
# section, which says so in its own title and its first line and which nothing
# follows. Everywhere else in these 78 lessons, a sentence about former
# behaviour is a defect.
#
# ENGINE SOURCE COMMENTS ARE PROVENANCE, NOT TEACHING TRUTH. relief.js carries
# repair-history comment lines and a header that explains what it types and
# why. A sentence lifted out of a comment arrives with NO FRAME, and a writer
# cannot frame what they did not know was history. Every writer brief in this
# wave says so. RECON.md and FINDINGS.md are provenance too. The digest is the
# only teaching truth.
#
# ---------------------------------------------------------------------------
# WHAT IS HELD, AND WHY. See `HELD` below, which is the authority.
#
# Advanced m05 and m06 are the audit and the history, and both depend on
# FC5-0, the engine repair. The distinction that decides them is LIVE
# PROPERTY against HISTORY: "the drum's holdup fraction cannot move the
# length it prints" is a live property of the engine as it ships TODAY and is
# teachable unframed; the moment FC5-0 lands it becomes history and needs the
# frame. Writing those eleven lessons before the repair lands is what costs a
# recut of 78 lessons, 396 questions and three audits, which is why the
# recommendation is repair first.
# ---------------------------------------------------------------------------
#
# SCOPE SEAMS. Swept against origin/main of petrolord-nextgen and the three
# unmerged Facilities branches. EVERY ONE OF THESE IS A LESSON A WRITER WOULD
# OTHERWISE DISCOVER HALFWAY THROUGH WRITING IT.
#
#  * FLARE RADIATION SETBACK IS OWNED BY separation (FC1), which is merged on
#    main and whose tile is held behind the one Facilities upload.
#    separation/intermediate/m05-distances-on-a-site/l03-a-flare-setback-is-computed.md
#    computes it, l04 does the pool fire and the Thomas flame height, l05 does
#    the point-source limitation, and
#    separation/advanced/m05-what-the-method-does-not-know/l03-tables-and-labels-without-a-source.md
#    tables the four API 521 allowable intensities with their held-for-
#    literature caveat. FC1's Professional capstone GRADES the flare setback
#    and the pool setback. Advanced m04 here teaches the point source as the
#    relief engine's SECOND copy of that model and hands the setback back by
#    name. It does not compute a setback and it does not re-table the levels.
#  * CRITICAL AGAINST SUBCRITICAL FLOW THROUGH A PORT IS OWNED BY gaslift
#    (PD2, LIVE), gaslift/intermediate/m05-throughput/l02-critical-flow.md and
#    l03-thornhill-and-craver.md. Beginner m02 l03 cites it and pivots to what
#    API 520 does differently: C from k, the Kb correction, and an AREA rather
#    than a throughput.
#  * THE DROPLET TERMINAL VELOCITY BALANCE IS OWNED TWICE. gaswell (PD5, LIVE)
#    owns drag against weight and Turner and Coleman in
#    gaswell/beginner/m03-the-droplet-balance/. separation (FC1) owns
#    Souders-Brown, the K value and the settling velocity used as a vessel
#    allowable, and separation/advanced/m05/l02-the-settling-velocity-borrowed.md
#    owns the CRITIQUE of that borrowing. Intermediate m05 teaches the API 521
#    drag-coefficient method as the THIRD answer to the same question and
#    names the other two. It does not re-derive either.
#  * COOLDOWN AND NO-TOUCH TIME ARE OWNED BY flowassurance (PD6, LIVE).
#    flowassurance/intermediate/m03-cooldown/l03-the-no-touch-time.md names
#    "no depressurisation" as its own scope exclusion, which is the one place
#    the live catalogue points AT this course. Advanced m01 l01 enters there.
#  * gasprocessing (FC4, branch) already wrote the deferral to copy:
#    gasprocessing/intermediate/m05-the-vessel-the-gas-goes-up/l01-a-contactor-is-not-a-knockout-drum.md
#    defines a knockout drum and refuses to re-derive Souders-Brown, naming
#    the course that owns it. Intermediate m05 l01 uses the same construction.
#
# FOUR NAMING COLLISIONS, LEGISLATED BEFORE A WORD IS WRITTEN.
#  * Bare "relief" already means a relief WELL in wellcontrol (DR4) and in
#    DR1's go-live guard. Always write "pressure relief" or "relief valve".
#  * Bare "safety valve" already means the downhole SCSSV across about twenty
#    lessons of completion and integrity. Always write "pressure safety
#    valve (PSV)".
#  * Bare "back pressure" already means the MPD choke in hydraulics and
#    wellcontrol and the Rawlins and Schellhardt equation in nodal and
#    welltest. Always qualify it as back pressure on a relief valve outlet.
#    Beginner m01 l03 disambiguates all three senses before any is used.
#  * Bare "critical flow" collides with perfsand's critical FLOWING pressure.
# ---------------------------------------------------------------------------
S = 'fc-sizing-explorer'
F = 'fc-fire-drum-explorer'
B = 'fc-blowdown-explorer'
PANEL_IDS = [S, F, B]

# ---------------------------------------------------------------------------
# PER-LESSON WORD COUNTS.
#
# THE BAND IS 420 TO 560 PROSE WORDS for every lesson in this wave, and the
# measure is the one lengths.py uses: PROSE WORDS ONLY, with front matter,
# markdown table rows and {{panel:...}} lines all excluded and HEADINGS COUNTED.
# A raw `wc -w` over the whole file is NOT this measure and runs materially
# higher, so a lesson can be inside the band and still fail a raw word count.
# Say which measure before quoting a number at a writer.
#
# THIS COMMENT USED TO SAY HEADINGS WERE EXCLUDED, and so did BRIEF.md,
# LESSON_TASK.md, the scaffold placeholder and wave.json, while no lengths.py
# existed in this wave at all to settle it. Every sibling wave's lengths.py
# COUNTS headings. FC5's headings carry between 22 and 50 words each, a mean of
# 37, so a writer trusting the old wording aimed that far light on every lesson.
#
# The MINIMUM is per lesson and is derived from the estimated minutes rather
# than typed, so the ranking by est_minutes and the ranking by length cannot
# disagree. A twelve-minute lesson must clear 420 words, a thirteen-minute one
# 460, a fourteen-minute one 500, and the ceiling is 560 for all of them. That
# leaves every lesson at least 60 words of room, which is what stops the
# minimum and the maximum meeting.
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

# Lessons whose source section of the digest does not exist until FC5-0, the
# engine repair, has landed and the digest has been rebuilt against it. A
# writer handed one of these before then is being asked to invent.
HELD = [
    ('advanced', 'm05-what-the-method-does-not-know', 'l01-computed-typed-and-never-checked'),
    ('advanced', 'm05-what-the-method-does-not-know', 'l02-a-published-case-that-cannot-discriminate'),
    ('advanced', 'm05-what-the-method-does-not-know', 'l03-an-input-that-changes-nothing'),
    ('advanced', 'm05-what-the-method-does-not-know', 'l04-a-guard-that-refuses-the-wrong-thing'),
    ('advanced', 'm05-what-the-method-does-not-know', 'l05-the-oracle-that-agreed-with-itself'),
    ('advanced', 'm06-what-was-repaired-and-what-was-not', 'l01-what-was-repaired-and-what-was-not'),
    ('advanced', 'm06-what-was-repaired-and-what-was-not', 'l02-the-gate-that-could-not-fail'),
]

TIERS = {
 'beginner': [
  ('m01-what-a-relief-valve-is-sized-for', 'What a Relief Valve Is Sized For', [
    ('l01-four-questions-one-studio', 'Four questions, one studio', 12, []),
    ('l02-set-overpressure-and-relieving-pressure', 'Set, overpressure and relieving pressure', 13, [S]),
    ('l03-three-things-called-back-pressure', 'Three things called back pressure', 13, [S]),
    ('l04-the-units-this-engine-speaks', 'The units this engine speaks', 12, [S]),
  ]),
  ('m02-gas-and-vapour', 'Gas and Vapour', [
    ('l01-the-coefficient-c-and-where-it-comes-from', 'The coefficient C, and where it comes from', 13, [S]),
    ('l02-the-critical-pressure-ratio', 'The critical pressure ratio', 13, [S]),
    ('l03-choked-and-the-branch-that-is-not', 'Choked, and the branch that is not', 14, [S]),
    ('l04-what-f2-replaces', 'What F2 replaces', 14, [S]),
    ('l05-the-area-a-gas-case-demands', 'The area a gas case demands', 13, [S]),
  ]),
  ('m03-liquid', 'Liquid', [
    ('l01-the-certified-valve-equation', 'The certified valve equation', 12, [S]),
    ('l02-viscosity-arrives-as-a-correction', 'Viscosity arrives as a correction', 13, [S]),
    ('l03-a-reynolds-number-that-needs-the-answer', 'A Reynolds number that needs the answer', 14, [S]),
    ('l04-the-loop-that-closes-on-itself', 'The loop that closes on itself', 14, [S]),
    ('l05-where-the-correction-stops-helping', 'Where the correction stops helping', 13, [S]),
  ]),
  ('m04-steam', 'Steam', [
    ('l01-the-steam-equation-and-its-constant', 'The steam equation and its constant', 12, [S]),
    ('l02-napier-and-the-pressure-it-starts-at', 'Napier, and the pressure it starts at', 14, [S]),
    ('l03-the-superheat-factor-the-engine-types', 'The superheat factor the engine types', 13, [S]),
    ('l04-two-ends-of-a-published-range', 'Two ends of a published range', 13, [S]),
  ]),
  ('m05-from-an-area-to-a-letter', 'From an Area to a Letter', [
    ('l01-the-fourteen-standard-orifices', 'The fourteen standard orifices', 12, [S]),
    ('l02-the-smallest-one-that-will-do', 'The smallest one that will do', 13, [S]),
    ('l03-margin-and-what-it-is-worth', 'Margin, and what it is worth', 13, [S]),
    ('l04-past-the-largest-orifice', 'Past the largest orifice', 12, [S]),
  ]),
  ('m06-the-associate-reading', 'The Associate Reading', [
    ('l01-one-scenario-one-answer', 'One scenario, one answer', 13, [S]),
    ('l02-computed-factors-and-typed-ones', 'Computed factors, and typed ones', 14, [S]),
    ('l03-the-capstone-worked', 'The capstone worked', 14, [S]),
    ('l04-what-the-next-tier-changes', 'What the next tier changes', 12, []),
  ]),
 ],
 'intermediate': [
  ('m01-where-the-relief-load-comes-from', 'Where the Relief Load Comes From', [
    ('l01-four-scenarios-and-the-one-computed-here', 'Four scenarios, and the one computed here', 12, [F]),
    ('l02-blocked-in-and-thermally-expanding', 'Blocked in, and thermally expanding', 13, [F]),
    ('l03-actual-cubic-feet-and-the-base-they-came-from', 'Actual cubic feet, and the base they came from', 14, [F]),
    ('l04-what-the-engine-leaves-to-the-caller', 'What the engine leaves to the caller', 13, [F]),
  ]),
  ('m02-the-wetted-area', 'The Wetted Area', [
    ('l01-a-circular-segment-exactly', 'A circular segment, exactly', 13, [F]),
    ('l02-half-full-and-why-that-case-is-special', 'Half full, and why that case is special', 14, [F]),
    ('l03-standing-up-instead-of-lying-down', 'Standing up instead of lying down', 13, [F]),
    ('l04-the-height-the-wetted-area-stops-at', 'The height the wetted area stops at', 13, [F]),
    ('l05-the-level-the-caller-must-trim', 'The level the caller must trim', 13, [F]),
  ]),
  ('m03-the-pool-fire-duty', 'The Pool Fire Duty', [
    ('l01-two-constants-and-which-one-applies', 'Two constants, and which one applies', 13, [F]),
    ('l02-the-exponent-and-what-it-says-about-size', 'The exponent, and what it says about size', 14, [F]),
    ('l03-the-environment-factor-and-its-credits', 'The environment factor, and its credits', 13, [F]),
    ('l04-duty-into-pounds-an-hour', 'Duty into pounds an hour', 13, [F]),
  ]),
  ('m04-the-fire-case-end-to-end', 'The Fire Case End to End', [
    ('l01-geometry-to-duty-to-load-to-letter', 'Geometry to duty to load to letter', 14, [F]),
    ('l02-the-allowance-the-fire-case-gets', 'The allowance the fire case gets', 13, [F]),
    ('l03-a-latent-heat-that-is-collapsing', 'A latent heat that is collapsing', 13, [F]),
    ('l04-what-moves-the-letter', 'What moves the letter', 14, [F]),
  ]),
  ('m05-the-knockout-drum', 'The Knockout Drum', [
    ('l01-what-a-flare-knockout-drum-is-for', 'What a flare knockout drum is for', 12, [F]),
    ('l02-drag-against-weight-iterated', 'Drag against weight, iterated', 14, [F]),
    ('l03-three-regimes-in-one-fit', 'Three regimes in one fit', 14, [F]),
    ('l04-the-length-a-diameter-demands', 'The length a diameter demands', 13, [F]),
    ('l05-l-over-d-as-a-judgment', 'L over D, as a judgment', 13, [F]),
  ]),
  ('m06-the-professional-reading', 'The Professional Reading', [
    ('l01-a-load-a-drum-and-a-letter', 'A load, a drum and a letter', 13, [F]),
    ('l02-the-chain-the-capstone-walks', 'The chain the capstone walks', 14, [F]),
    ('l03-the-capstone-worked', 'The capstone worked', 14, [F]),
    ('l04-what-the-next-tier-changes', 'What the next tier changes', 12, []),
  ]),
 ],
 'advanced': [
  ('m01-a-vessel-emptying-itself', 'A Vessel Emptying Itself', [
    ('l01-where-depressuring-is-handed-over', 'Where depressuring is handed over', 12, [B]),
    ('l02-mass-out-through-a-choked-orifice', 'Mass out through a choked orifice', 14, [B]),
    ('l03-isentropic-inside-the-vessel', 'Isentropic, inside the vessel', 14, [B]),
    ('l04-the-discharge-coefficient-and-the-one-beside-it', 'The discharge coefficient, and the one beside it', 14, [B]),
    ('l05-the-trajectory-the-answer-is-read-off', 'The trajectory the answer is read off', 13, [B]),
  ]),
  ('m02-the-customary-depressuring-time', 'The Customary Depressuring Time', [
    ('l01-where-the-customary-time-comes-from', 'Where the customary time comes from', 12, [B]),
    ('l02-reading-a-time-off-a-curve', 'Reading a time off a curve', 13, [B]),
    ('l03-the-orifice-that-buys-the-time', 'The orifice that buys the time', 14, [B]),
    ('l04-the-cold-end-and-the-metal-question', 'The cold end, and the metal question', 13, [B]),
  ]),
  ('m03-a-step-size-is-an-answer', 'A Step Size Is an Answer', [
    ('l01-refining-the-step', 'Refining the step', 14, [B]),
    ('l02-a-time-quantised-to-one-step', 'A time quantised to one step', 14, [B]),
    ('l03-a-temperature-that-does-not-settle', 'A temperature that does not settle', 13, [B]),
    ('l04-what-a-march-owes-the-reader', 'What a march owes the reader', 13, [B]),
  ]),
  ('m04-the-point-source-twice', 'The Point Source, Twice', [
    ('l01-the-point-source-in-one-relation', 'The point source, in one relation', 13, [B]),
    ('l02-the-same-model-asked-as-a-distance', 'The same model, asked as a distance', 13, [B]),
    ('l03-where-the-setback-is-taught', 'Where the setback is taught', 12, [B]),
    ('l04-two-tables-with-the-same-numbers', 'Two tables with the same numbers', 13, [B]),
  ]),
  ('m05-what-the-method-does-not-know', 'What the Method Does Not Know', [
    ('l01-computed-typed-and-never-checked', 'Computed, typed, and never checked', 14, [B]),
    ('l02-a-published-case-that-cannot-discriminate', 'A published case that cannot discriminate', 14, [B]),
    ('l03-an-input-that-changes-nothing', 'An input that changes nothing', 14, [F]),
    ('l04-a-guard-that-refuses-the-wrong-thing', 'A guard that refuses the wrong thing', 13, [S]),
    ('l05-the-oracle-that-agreed-with-itself', 'The oracle that agreed with itself', 14, [B]),
  ]),
  ('m06-what-was-repaired-and-what-was-not', 'What Was Repaired, and What Was Not', [
    ('l01-what-was-repaired-and-what-was-not', 'What was repaired, and what was not', 14, [B]),
    ('l02-the-gate-that-could-not-fail', 'The gate that could not fail', 14, [B]),
    ('l03-the-capstone-worked', 'The capstone worked', 14, [B]),
    ('l04-onward', 'Onward', 12, []),
  ]),
 ],
}


# ---------------------------------------------------------------------------
# THE CHECKS THIS FILE RUNS ON ITSELF. Run `python3 structure.py` to see them.
# A structure file that is wrong about its own shape is a structure file every
# later phase inherits, so it states its counts rather than being read for them.
# ---------------------------------------------------------------------------

def flat():
    """Every lesson in the wave as (tier, module_key, module_title, order,
    lesson_key, lesson_title, est_minutes, panels, min_words)."""
    out = []
    for tier, mods in TIERS.items():
        for mi, (mkey, mtitle, lessons) in enumerate(mods, 1):
            for li, (lkey, ltitle, est, panels) in enumerate(lessons, 1):
                out.append((tier, mkey, mtitle, mi, li, lkey, ltitle, est, panels, min_words(est)))
    return out


def check():
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
    # every panel tag is one of the three declared ids
    for r in rows:
        for pid in r[8]:
            if pid not in PANEL_IDS:
                problems.append(f'{r[0]}/{r[5]} tags an unknown panel {pid}')
    # no duplicate keys within a tier, and no duplicate module keys
    for tier, mods in TIERS.items():
        mkeys = [m[0] for m in mods]
        if len(set(mkeys)) != len(mkeys):
            problems.append(f'{tier} repeats a module key')
        for mkey, _, lessons in mods:
            lkeys = [l[0] for l in lessons]
            if len(set(lkeys)) != len(lkeys):
                problems.append(f'{tier}/{mkey} repeats a lesson key')
    # THE OWNER COPY RULE, over every title a learner reads
    import re
    for tier, mods in TIERS.items():
        for mkey, mtitle, lessons in mods:
            titles = [mtitle] + [l[1] for l in lessons]
            for t in titles:
                if re.search('[\u2013\u2014]', t):
                    problems.append(f'{tier}: title carries a dash: {t}')
                if re.search(r',\s+not\s+\w', t):
                    problems.append(f'{tier}: title carries a contrastive: {t}')
    # A TITLE CARRIES COUNTS ONLY, NEVER A MEASUREMENT. A count is a small whole
    # number of things the structure itself fixes; a measurement is a figure a
    # writer cannot check until the digest exists.
    # A NAMED PUBLISHED SYMBOL IS NOT A MEASUREMENT. F2 is the name of the
    # subcritical flow factor and API 520, 521 and 526 are the names of
    # standards, so those tokens are removed before the digit check rather than
    # allowlisted title by title, which would rot.
    SYMBOLS = re.compile(r'\bF2\b|\bAPI\s+5\d\d\b|\bKSH\b')
    for tier, mods in TIERS.items():
        for mkey, mtitle, lessons in mods:
            for t in [mtitle] + [l[1] for l in lessons]:
                if re.search(r'\d', SYMBOLS.sub(' ', t)):
                    problems.append(f'{tier}: title carries a digit, which is a measurement rather than a count: {t}')
    # the HELD list must name lessons that exist
    keys = {(r[0], r[1], r[5]) for r in rows}
    for h in HELD:
        if h not in keys:
            problems.append(f'HELD names a lesson that does not exist: {h}')
    minutes = sorted({r[7] for r in rows})
    print(f'FC5 relief structure: {len(rows)} lessons, '
          f'{sum(len(m) for m in TIERS.values())} modules, 3 tiers')
    for tier in ('beginner', 'intermediate', 'advanced'):
        mods = TIERS[tier]
        print(f'  {tier:13s} {len(mods)} modules, {per_tier[tier]} lessons, '
              f'panel tags {sum(len(l[3]) for m in mods for l in m[2])}')
    print(f'  estimated minutes present: {minutes}, '
          f'minimum prose words: {[MIN_BY_MINUTES[m] for m in minutes]}, band ceiling {BAND[1]}')
    print(f'  panels declared: {PANEL_IDS}')
    print(f'  lessons HELD until the engine repair landed: {len(HELD)} (the repair is merged, so none is held now)')
    print(f'  PROBLEMS: {len(problems)}')
    for p in problems:
        print(f'   {p}')
    return problems


if __name__ == '__main__':
    import sys
    sys.exit(1 if check() else 0)
