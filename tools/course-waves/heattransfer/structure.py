# FC6 Heat Exchange & Cooling. Three tiers, six modules each, 26 lessons a tier.
#
# Panel ids: E the exchanger explorer (the balance, the two log-mean pairings
# against the arithmetic mean, the surface, and the tube count closing as a
# loop), C the coefficient explorer (the five resistances with their shares and
# the margin that decided the verdict, the thin-wall limit against the flat
# plate, and the film across its three regimes), R the rating explorer
# (effectiveness against NTU in three arrangements with the two ceilings drawn
# and counter-current drawn with none, the collapse at a capacity ratio of zero,
# and the hot day).
#
# Titles carry COUNTS only, never a measurement.
#
# FRAMED HISTORY IS CURRICULUM. Expert m05 l01 is titled so the frame is in the
# HEADING, which is where the prose gate and a reader both look for it. Its
# source is digest SECTION 21, the one section of the digest whose subject is
# what this engine was repaired for and which says so in its own title and first
# line. Unframed history is still a defect: a sentence about former behaviour
# that reads as current behaviour is the thing that actually goes wrong. No em
# dashes and no "X, not Y" contrastive anywhere a learner reads, headings
# included.
#
# Engine: engines/facilities/heatTransfer.js, which imports NOTHING. Vendored
# sha-identical with engines e4377b3, the FC6-0 repair.
#
# ---------------------------------------------------------------------------
# NOTHING IS HELD. The digest is built, all 21 sections print, and all 78
# lessons have their source. `HELD` below is empty and is the authority.
#
# SCOPE SEAMS, checked against the live catalogue. Heat exchange is free ground:
# the sweep measured ZERO files across the live courses for LMTD, the log mean as
# a driving force, TEMA, Dittus-Boelter, Sieder-Tate, Nusselt, air cooler,
# fouling as a resistance and effectiveness-NTU. Four seams still have to be
# respected rather than re-taught:
#  * FRICTION FACTOR AND REYNOLDS NUMBER are OWNED by linesizing (FC2).
#    Professional m05 uses the Reynolds number as the correlation's argument and
#    cites FC2 for what a Reynolds number is. It does not re-derive it.
#  * PUMPS AND COMPRESSION are OWNED by rotating (FC3). The fan on an air cooler
#    is a fan and its power is one line; Expert m03 does not teach machine work.
#  * RELIEF AND FLARE are OWNED by relief (FC5). A hot exchanger is not a relief
#    case here.
#  * SOUDERS-BROWN, the K value and settling are OWNED by separation (FC1). This
#    course never needs them, and "fouling" in FC1 is a mist extractor fouling
#    rather than a heat-transfer resistance. Associate m01 l04 names the
#    difference the first time the word is used.
# AND ONE WORD TO DISAMBIGUATE ON FIRST USE: "approach" already carries a
# separation and a compression meaning in this module family, and "U" is
# exported twice in the engines package under two different reference areas.
# Associate m01 l04 states the reference area before any coefficient is used.
# ---------------------------------------------------------------------------
E = 'fc-exchanger-explorer'
C = 'fc-coefficient-explorer'
R = 'fc-rating-explorer'

# The lesson length band, and the per-lesson MINIMUM keyed by the estimated
# minutes, so a longer lesson is also a fuller one. PROSE WORDS ONLY, counted
# the way lengths.py counts them: front matter, table rows, headings and
# {{panel:...}} lines are excluded. A raw `wc -w` is not this measure.
WORD_BAND = (420, 560)
MIN_WORDS = {12: 420, 13: 470, 14: 510}

TIERS = {
 'beginner': [
  ('m01-what-this-engine-rates', 'What This Engine Rates and Sizes', [
    ('l01-four-questions-about-one-exchanger', 'Four questions about one exchanger', 12, []),
    ('l02-every-door-answers-with-an-object', 'Every door answers with an object', 13, [E]),
    ('l03-what-it-refuses-to-guess', 'What it refuses to guess', 13, [E]),
    ('l04-the-units-and-the-reference-area', 'The units and the reference area', 12, [E]),
  ]),
  ('m02-the-stream-and-its-capacity-rate', 'The Stream and Its Capacity Rate', [
    ('l01-a-capacity-rate-is-the-whole-of-a-stream', 'A capacity rate is the whole of a stream', 12, [E]),
    ('l02-the-duty-a-stated-outlet-sets', 'The duty a stated outlet sets', 13, [E]),
    ('l03-the-same-duty-stated-three-ways', 'The same duty stated three ways', 13, [E]),
    ('l04-the-smaller-capacity-rate-governs', 'The smaller capacity rate governs', 13, [E]),
  ]),
  ('m03-the-refusals-that-protect-a-balance', 'The Refusals That Protect a Balance', [
    ('l01-an-outlet-that-moves-the-wrong-way', 'An outlet that moves the wrong way', 13, [E]),
    ('l02-a-duty-that-crosses-the-streams', 'A duty that crosses the streams', 14, [E]),
    ('l03-a-duty-parallel-flow-cannot-deliver', 'A duty parallel flow cannot deliver', 14, [E]),
    ('l04-an-arrangement-given-three-ways', 'An arrangement given three ways', 13, [E]),
  ]),
  ('m04-the-log-mean-driving-force', 'The Log Mean Driving Force', [
    ('l01-two-ends-and-which-two-they-are', 'Two ends, and which two they are', 13, [E]),
    ('l02-the-arithmetic-mean-it-sits-below', 'The arithmetic mean it sits below', 14, [E]),
    ('l03-equal-ends-and-what-the-engine-says', 'Equal ends, and what the engine says', 13, [E]),
    ('l04-the-shell-reading-and-its-note', 'The shell reading and its note', 13, [E]),
    ('l05-what-a-log-mean-cannot-be-asked', 'What a log mean cannot be asked', 12, [E]),
  ]),
  ('m05-the-surface-and-the-tubes', 'The Surface and the Tubes', [
    ('l01-a-surface-out-of-three-numbers', 'A surface out of three numbers', 13, [E]),
    ('l02-clean-surface-and-dirty-surface', 'Clean surface and dirty surface', 13, [E]),
    ('l03-the-surface-of-one-tube', 'The surface of one tube', 12, [E]),
    ('l04-rounding-up-twice', 'Rounding up twice', 14, [E]),
    ('l05-the-overshoot-is-always-positive', 'The overshoot is always positive', 13, [E]),
  ]),
  ('m06-the-associate-reading', 'The Associate Reading', [
    ('l01-the-studio-case-end-to-end', 'The studio case end to end', 14, [E]),
    ('l02-the-loop-and-its-trail', 'The loop, and its trail', 14, [E]),
    ('l03-the-capstone-worked', 'The capstone worked', 14, [E]),
    ('l04-what-the-next-tier-changes', 'What the next tier changes', 12, []),
  ]),
 ],
 'intermediate': [
  ('m01-p-r-and-the-correction-factor', 'P, R and the Correction Factor', [
    ('l01-two-groups-off-four-temperatures', 'Two groups off four temperatures', 13, [C]),
    ('l02-a-factor-computed-rather-than-typed', 'A factor computed rather than typed', 14, [C]),
    ('l03-the-warning-on-a-steep-curve', 'The warning on a steep curve', 13, [C]),
    ('l04-the-limit-as-p-tends-to-zero', 'The limit as P tends to zero', 14, [C]),
    ('l05-what-the-correction-cannot-be-asked', 'What the correction cannot be asked', 12, [C]),
  ]),
  ('m02-shells-in-series', 'Shells in Series', [
    ('l01-the-equivalent-single-shell-p', 'The equivalent single-shell P', 14, [C]),
    ('l02-what-a-second-shell-buys', 'What a second shell buys', 13, [C]),
    ('l03-a-bound-this-module-declares', 'A bound this module declares', 14, [C]),
    ('l04-infeasible-and-inefficient-are-different', 'Infeasible and inefficient are different', 13, [C]),
  ]),
  ('m03-the-coefficient-from-its-parts', 'The Coefficient From Its Parts', [
    ('l01-five-resistances-in-series', 'Five resistances in series', 13, [C]),
    ('l02-which-area-a-coefficient-is-referred-to', 'Which area a coefficient is referred to', 14, [C]),
    ('l03-the-inside-terms-and-the-diameter-ratio', 'The inside terms and the diameter ratio', 14, [C]),
    ('l04-what-fouling-costs-and-the-identity-in-it', 'What fouling costs, and the identity in it', 14, [C]),
    ('l05-naming-the-controlling-resistance', 'Naming the controlling resistance', 13, [C]),
  ]),
  ('m04-the-wall-and-a-limit-that-fixes-a-factor', 'The Wall, and a Limit That Fixes a Factor', [
    ('l01-the-smallest-term-usually', 'The smallest term, usually', 13, [C]),
    ('l02-a-thin-wall-is-a-flat-plate', 'A thin wall is a flat plate', 14, [C]),
    ('l03-what-a-transcription-cannot-catch', 'What a transcription cannot catch', 14, [C]),
    ('l04-the-margin-that-decided-a-verdict', 'The margin that decided a verdict', 13, [C]),
  ]),
  ('m05-the-tube-side-film', 'The Tube Side Film', [
    ('l01-reynolds-prandtl-and-the-tube-count', 'Reynolds, Prandtl and the tube count', 14, [C]),
    ('l02-three-regimes-and-one-refusal', 'Three regimes and one refusal', 14, [C]),
    ('l03-a-laminar-film-does-not-move-with-flow', 'A laminar film does not move with flow', 13, [C]),
    ('l04-a-band-nobody-here-can-state', 'A band nobody here can state', 14, [C]),
    ('l05-the-exponent-this-module-declines', 'The exponent this module declines', 14, [C]),
  ]),
  ('m06-the-professional-reading', 'The Professional Reading', [
    ('l01-the-studio-case-coefficient-first', 'The studio case, coefficient first', 14, [C]),
    ('l02-the-capstone-worked', 'The capstone worked', 14, [C]),
    ('l03-what-the-next-tier-changes', 'What the next tier changes', 12, []),
  ]),
 ],
 'advanced': [
  ('m01-rating-and-the-other-question', 'Rating, and the Other Question', [
    ('l01-effectiveness-is-a-fraction-of-a-maximum', 'Effectiveness is a fraction of a maximum', 13, [R]),
    ('l02-ntu-is-a-surface-written-dimensionlessly', 'NTU is a surface written dimensionlessly', 13, [R]),
    ('l03-an-identity-that-proves-nothing', 'An identity that proves nothing', 14, [R]),
    ('l04-two-ceilings', 'Two ceilings', 14, [R]),
    ('l05-the-arrangement-with-no-ceiling', 'The arrangement with no ceiling', 14, [R]),
  ]),
  ('m02-limits-that-discriminate', 'Limits That Discriminate', [
    ('l01-a-capacity-ratio-of-zero', 'A capacity ratio of zero', 13, [R]),
    ('l02-three-closed-forms-and-one-answer', 'Three closed forms and one answer', 14, [R]),
    ('l03-what-one-published-case-cannot-find', 'What one published case cannot find', 14, [R]),
    ('l04-a-golden-file-declared-synthetic', 'A golden file declared synthetic', 14, [R]),
  ]),
  ('m03-the-air-cooler', 'The Air Cooler', [
    ('l01-a-bay-and-the-air-it-is-given', 'A bay, and the air it is given', 13, [R]),
    ('l02-the-draft-type-is-not-a-detail', 'The draft type is not a detail', 14, [R]),
    ('l03-the-barometer-is-an-input', 'The barometer is an input', 13, [R]),
    ('l04-the-correction-this-bay-declines', 'The correction this bay declines', 14, [R]),
    ('l05-six-states-a-bay-will-not-compute', 'Six states a bay will not compute', 13, [R]),
  ]),
  ('m04-the-hot-day', 'The Hot Day', [
    ('l01-what-a-machine-holds-on-a-hot-afternoon', 'What a machine holds on a hot afternoon', 14, [R]),
    ('l02-four-columns-that-do-not-move', 'Four columns that do not move', 14, [R]),
    ('l03-the-duty-and-the-outlet-go-together', 'The duty and the outlet go together', 14, [R]),
    ('l04-a-cold-day-is-a-capability', 'A cold day is a capability', 13, [R]),
    ('l05-the-second-method-and-what-it-buys', 'The second method, and what it buys', 14, [R]),
  ]),
  ('m05-what-the-method-does-not-know', 'What the Method Does Not Know', [
    ('l01-what-this-engine-was-repaired-for', 'What this engine was repaired for', 14, [R]),
    ('l02-a-pin-is-not-a-validation', 'A pin is not a validation', 14, [C]),
    ('l03-two-roundings-measured', 'Two roundings, measured', 14, [C]),
    ('l04-two-bundle-rows-that-are-identical', 'Two bundle rows that are identical', 13, [C]),
  ]),
  ('m06-the-expert-reading', 'The Expert Reading', [
    ('l01-the-whole-chain-on-one-machine', 'The whole chain on one machine', 14, [R]),
    ('l02-the-capstone-worked', 'The capstone worked', 14, [R]),
    ('l03-where-this-engine-hands-over', 'Where this engine hands over', 12, []),
  ]),
 ],
}

# Nothing is held. FC6-0 is merged and vendored, the digest is built, and every
# module has its source.
HELD = {}

if __name__ == '__main__':
    total = 0
    for tier, mods in TIERS.items():
        n = sum(len(m[2]) for m in mods)
        held = sum(len(m[2]) for m in mods if m[0] in HELD.get(tier, []))
        total += n
        print(f'{tier:<14} {len(mods)} modules  {n} lessons  ({held} held)')
        assert len(mods) == 6, f'{tier} has {len(mods)} modules'
        assert n == 26, f'{tier} has {n} lessons'
    print(f'{"total":<14} {total} lessons, all writable')
    keys = [l[0] for mods in TIERS.values() for m in mods for l in m[2]]
    titles = [l[1] for mods in TIERS.values() for m in mods for l in m[2]] \
        + [m[1] for mods in TIERS.values() for m in mods]
    bad = [t for t in titles if '—' in t or '–' in t or ', not ' in t]
    assert not bad, f'owner copy rule broken in: {bad}'
    print('titles: no em dashes, no en dashes, no "X, not Y" contrastives')
    for tier, mods in TIERS.items():
        for mkey, mtitle, lessons in mods:
            assert len(set(l[0] for l in lessons)) == len(lessons), mkey
    print('lesson keys unique inside every module')
    mins = {}
    for tier, mods in TIERS.items():
        for mkey, mtitle, lessons in mods:
            for lkey, ltitle, minutes, panels in lessons:
                assert minutes in MIN_WORDS, f'{tier}/{mkey}/{lkey} has no minimum for {minutes} minutes'
                mins.setdefault(MIN_WORDS[minutes], 0)
                mins[MIN_WORDS[minutes]] += 1
    print(f'word band {WORD_BAND[0]} to {WORD_BAND[1]} prose words; per-lesson minimums: '
          + ', '.join(f'{k} words x {v}' for k, v in sorted(mins.items())))
    panelled = [l for mods in TIERS.values() for m in mods for l in m[2] if l[3]]
    print(f'panels: {len(panelled)} of {total} lessons carry one; '
          f'ids {sorted(set(p for l in panelled for p in l[3]))}')
