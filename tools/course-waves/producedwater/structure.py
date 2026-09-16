# FC7 Produced Water Treatment. Three tiers, six modules each, 26 lessons a tier.
#
# Lesson tuple: (key, title, est_minutes, min_prose_words, panels).
#
# MIN_PROSE_WORDS IS PROSE WORDS, the way lengths.py counts them: front matter,
# markdown table rows, headings and {{panel:...}} lines are all excluded. A raw
# `wc -w` is a different and larger measure, so a lesson can sit inside the band
# and fail a raw count. The band for this wave is 420 to 560.
#
# Panel ids: W the water explorer (viscosity, density, the droplet distribution
# and the two gravity cuts), D the device explorer (the liner sweep with its
# envelope and ceiling, the flotation chain, the bed), T the train explorer (the
# coupling stage by stage, both medians, and the three ways this engine declines
# to answer).
#
# Titles carry COUNTS only, never a measurement. No em dashes, no en dashes and
# no contrastive of the forbidden shape anywhere a learner reads, headings
# included, and the self-check at the foot of this file asserts it.
#
# FRAMED HISTORY IS CURRICULUM. Expert m05 l01 is titled so the frame is in the
# HEADING, which is where the gate looks for it and where a reader meets it
# first. Its source is digest SECTION 22, the one section whose subject is what
# this engine used to do and which says so in its own title and first line.
# Unframed history is still a defect.
#
# Engine: engines/facilities/producedWater.js, which imports nothing, vendored
# sha-identical with engines 8b8fb6a, the FC7-0 repair.
#
# NOTHING IS HELD. FC7-0 is merged and vendored, every digest section is built,
# and all 78 lessons have their source. HELD below is empty and is the authority.
#
# SCOPE SEAMS, checked against the live catalogue. FC1 separation already owns
# Stokes settling between two liquids, oil rising out of a water layer, and the
# fail-open droplet verdict. This course does NOT re-derive them: Associate m04
# teaches the rise as this module reports it, with its Reynolds number and its
# stated band, and cites separation for the settling law itself. Hydrocyclone,
# flotation, API 421, oil in water and cut size are at ZERO hits across the live
# catalogue, so the whole of Professional and the whole of Expert are FC7's own.

W, D, T = 'pw-water-explorer', 'pw-device-explorer', 'pw-train-explorer'

TIERS = {
    'beginner': [
        ('m01-what-this-engine-answers', 'What this engine answers', [
            ('l01-produced-water-and-what-it-carries', 'Produced water, and what it carries', 8, 420, [W]),
            ('l02-why-a-concentration-is-not-enough', 'Why a concentration is not enough', 9, 440, [W]),
            ('l03-the-four-kinds-of-number-here', 'The four kinds of number in this module', 10, 460, []),
            ('l04-what-this-engine-refuses-to-guess', 'What this engine refuses to guess', 9, 440, []),
        ]),
        ('m02-the-water-and-the-oil', 'The water and the oil', [
            ('l01-viscosity-from-temperature', 'Viscosity from temperature', 8, 420, [W]),
            ('l02-salinity-and-a-stated-limit', 'Salinity, and a correction stated to a limit', 9, 440, [W]),
            ('l03-brine-density', 'Brine density', 8, 420, [W]),
            ('l04-crude-density-from-api-gravity', 'Crude density from API gravity', 9, 440, [W]),
            ('l05-the-density-difference', 'The density difference, which drives everything', 10, 460, [W]),
        ]),
        ('m03-the-droplets', 'The droplets', [
            ('l01-a-distribution-in-droplet-volume', 'A distribution in droplet volume', 9, 440, [W]),
            ('l02-the-bins-and-the-grid', 'The bins, and the grid the answer is measured on', 10, 460, [W]),
            ('l03-sigma-the-input-nobody-measured', 'Sigma, the input nobody measured', 10, 460, [W]),
            ('l04-the-median-a-bin-set-reproduces', 'The median a bin set has to reproduce', 9, 440, [W]),
        ]),
        ('m04-a-droplets-rise', 'A droplet rising', [
            ('l01-buoyancy-against-drag', 'Buoyancy against drag', 8, 420, [W]),
            ('l02-stokes-and-its-reynolds-number', 'Stokes, and the Reynolds number it is stated to', 10, 460, [W]),
            ('l03-what-an-out-of-band-cut-is-worth', 'What an out of band cut size is worth', 10, 460, [W]),
            ('l04-reading-a-rise-velocity', 'Reading a rise velocity in the studio', 8, 420, [W]),
        ]),
        ('m05-the-gravity-devices', 'The gravity devices', [
            ('l01-an-api-421-basin', 'An API 421 basin', 9, 440, [W]),
            ('l02-the-surface-loading', 'The surface loading, and the depth that stays out of it', 10, 460, [W]),
            ('l03-the-horizontal-velocity-and-half-a-rule', 'The horizontal velocity, and half a rule', 10, 460, [W]),
            ('l04-the-short-circuit-allowance', 'The short circuit allowance', 9, 440, [W]),
            ('l05-a-plate-pack', 'A plate pack, and what the plates buy', 9, 440, [W]),
        ]),
        ('m06-the-associate-reading', 'The Associate reading', [
            ('l01-one-stream-from-the-rate', 'One stream, from the rate to the cut size', 11, 480, [W]),
            ('l02-what-the-basin-removes', 'What the basin removes from this water', 10, 460, [W, T]),
            ('l03-two-devices-in-series', 'Two devices in series', 11, 480, [T]),
            ('l04-the-verdict-that-was-withheld', 'The verdict the engine would not give', 10, 460, [T]),
        ]),
    ],
    'intermediate': [
        ('m01-grade-efficiency', 'Grade efficiency', [
            ('l01-what-a-device-does-to-a-distribution', 'What a device does to a distribution', 9, 440, [W]),
            ('l02-the-reduced-efficiency-curve', 'The reduced efficiency curve', 10, 460, [W]),
            ('l03-a-sharpness-derived-and-a-sharpness-declared', 'A sharpness derived and a sharpness declared', 11, 480, [W]),
            ('l04-removal-as-an-integral', 'Removal as an integral over the distribution', 10, 460, [T]),
        ]),
        ('m02-the-hydrocyclone', 'The hydrocyclone', [
            ('l01-a-field-in-place-of-gravity', 'A field in place of gravity', 9, 440, [D]),
            ('l02-the-liner-geometry', 'The liner geometry, and the travel a droplet makes', 10, 460, [D]),
            ('l03-the-residence-time-in-one-liner', 'The residence time in one liner', 9, 440, [D]),
            ('l04-the-cut-the-march-gives', 'The cut size the march gives', 11, 480, [D]),
            ('l05-what-the-ideal-capture-leaves-out', 'What the ideal capture leaves out', 10, 460, [D]),
        ]),
        ('m03-the-operating-envelope', 'The operating envelope', [
            ('l01-turndown-and-what-a-bank-is-sized-in', 'Turndown, and what a bank is sized in', 9, 440, [D]),
            ('l02-the-ceiling-on-the-field', 'The ceiling on the field', 11, 480, [D]),
            ('l03-a-sweep-that-turns-over', 'A sweep that turns over', 12, 500, [D]),
            ('l04-the-refusal-and-the-count-it-names', 'The refusal, and the liner count it names', 10, 460, [D]),
        ]),
        ('m04-flotation', 'Flotation', [
            ('l01-carrying-oil-out', 'Carrying oil out rather than settling it', 9, 440, [D]),
            ('l02-the-gas-and-the-plan-area', 'The gas, the plan area and the flux', 10, 460, [D]),
            ('l03-a-bubble-at-reynolds-twenty', 'A bubble at Reynolds twenty', 11, 480, [D]),
            ('l04-holdup-and-a-swarm', 'Holdup, and when a swarm stops being one', 10, 460, [D]),
            ('l05-interception-and-the-cut', 'Interception, and the cut the kinetics gives', 11, 480, [D]),
        ]),
        ('m05-the-bed', 'The bed', [
            ('l01-depth-filtration', 'Depth filtration', 9, 440, [D]),
            ('l02-the-cut-as-an-inversion', 'The cut size as an inversion of the same law', 11, 480, [D]),
            ('l03-the-grain-size-and-a-held-exponent', 'The grain size, and an exponent that is held', 10, 460, [D]),
            ('l04-loading-rate-and-breakthrough', 'Loading rate, and breakthrough', 9, 440, [D]),
        ]),
        ('m06-the-professional-reading', 'The Professional reading', [
            ('l01-two-kinds-of-cell-on-two-boxes', 'Two kinds of cell on two boxes', 11, 480, [D]),
            ('l02-an-invariance-and-what-cells-buy', 'An invariance, and what the cell count buys', 11, 480, [D]),
            ('l03-three-unlike-devices-in-one-train', 'Three unlike devices in one train', 12, 500, [T]),
            ('l04-which-argument-produced-which-number', 'Which argument produced which number', 11, 480, [T]),
        ]),
    ],
    'advanced': [
        ('m01-the-coupling', 'The coupling', [
            ('l01-why-the-next-device-sees-finer-water', 'Why the next device sees finer water', 10, 460, [T]),
            ('l02-three-good-devices', 'Three good devices and one great one', 11, 480, [T]),
            ('l03-the-order-identity', 'The order identity, and what it does not answer', 12, 500, [T]),
            ('l04-reading-a-stage-removal', 'Reading a stage removal', 10, 460, [T]),
            ('l05-what-more-equipment-cannot-buy', 'What more equipment cannot buy', 11, 480, [T]),
        ]),
        ('m02-the-medians-and-the-grid', 'The medians and the grid', [
            ('l01-two-medians-on-one-basis', 'Two medians on one basis', 10, 460, [T]),
            ('l02-a-median-that-tracks-the-cut', 'A median that tracks the cut', 11, 480, [T]),
            ('l03-the-bin-count-and-the-span', 'The bin count and the span, reported back', 10, 460, [W]),
            ('l04-the-truncated-tail', 'The truncated tail, and a check that needs no source', 11, 480, [W]),
        ]),
        ('m03-not-answering', 'Not answering', [
            ('l01-a-refusal-and-the-input-it-names', 'A refusal, and the input it names', 10, 460, [T]),
            ('l02-a-withheld-verdict', 'A withheld verdict, and its three reasons', 12, 500, [T]),
            ('l03-a-warning-withholds-nothing', 'A warning, which withholds nothing', 10, 460, [T]),
            ('l04-three-leaves-and-a-bare-nan', 'Three leaves, and a bare NaN', 11, 480, []),
            ('l05-what-the-studio-does-with-each', 'What the studio does with each of the three', 11, 480, [T]),
        ]),
        ('m04-the-band-and-the-balance', 'The band and the balance', [
            ('l01-creeping-flow-and-where-it-ends', 'Creeping flow, and where it ends', 10, 460, [W]),
            ('l02-the-full-drag-balance', 'The full drag balance as a second method', 11, 480, [D]),
            ('l03-a-gap-that-has-to-be-real', 'A gap that has to be real', 12, 500, [D]),
            ('l04-a-case-on-both-sides-of-a-limit', 'A published case on both sides of a limit', 11, 480, []),
        ]),
        ('m05-what-a-gate-can-catch', 'What a gate can catch', [
            ('l01-what-was-repaired-history', 'What was repaired in this engine, and what was not', 12, 500, []),
            ('l02-what-an-independent-oracle-is', 'What an independent oracle is', 12, 500, []),
            ('l03-identities-need-no-source', 'Identities, which need no source at all', 11, 480, [W]),
            ('l04-a-pin-is-not-a-validation', 'A pin and a validation are different claims', 11, 480, []),
            ('l05-what-a-green-suite-means', 'The planting battery, and what a green suite means', 12, 500, []),
        ]),
        ('m06-where-the-method-stops', 'Where the method stops', [
            ('l01-six-things-held-for-literature', 'Six things held for literature', 12, 500, []),
            ('l02-the-one-calibration', 'The one calibration in this module', 11, 480, [D]),
            ('l03-what-this-engine-does-not-know', 'What this engine does not know about produced water', 12, 500, []),
        ]),
    ],
}

# Nothing is held. FC7-0 is merged and vendored, every digest section is built,
# and all 78 lessons have their source.
HELD = {}

PANELS = {W, D, T}

if __name__ == '__main__':
    total = 0
    for tier, mods in TIERS.items():
        n = sum(len(m[2]) for m in mods)
        total += n
        print(f'{tier:<14} {len(mods)} modules  {n} lessons')
        assert len(mods) == 6, f'{tier} has {len(mods)} modules'
        assert n == 26, f'{tier} has {n} lessons'
    assert total == 78, total
    print(f'{"total":<14} {total} lessons, all writable')
    lessons = [(t, m[0], l) for t, mods in TIERS.items() for m in mods for l in m[2]]
    titles = [l[1] for _, _, l in lessons]
    bad = [t for t in titles if '—' in t or '–' in t or ', not ' in t]
    assert not bad, f'owner copy rule broken in: {bad}'
    print('titles: no em dashes, no en dashes, no contrastive of the forbidden shape')
    for tier, mods in TIERS.items():
        for mkey, mtitle, ls in mods:
            assert len(set(l[0] for l in ls)) == len(ls), mkey
    print('lesson keys unique inside every module')
    words = [l[3] for _, _, l in lessons]
    assert all(420 <= w <= 560 for w in words), [w for w in words if not 420 <= w <= 560]
    print(f'prose word minimums all inside the 420 to 560 band: {min(words)} to {max(words)}')
    ids = {p for _, _, l in lessons for p in l[4]}
    assert ids <= PANELS, ids - PANELS
    withpanel = sum(1 for _, _, l in lessons if l[4])
    print(f'panel ids used: {sorted(ids)}; lessons carrying a panel: {withpanel} of {total}')
    mins = [l[2] for _, _, l in lessons]
    print(f'est_minutes span {min(mins)} to {max(mins)}, total {sum(mins)} minutes of reading')
    hist = [l for _, _, l in lessons if 'repaired' in l[1]]
    assert len(hist) == 1, hist
    print(f'the one history lesson, framed in its own title: {hist[0][1]}')
