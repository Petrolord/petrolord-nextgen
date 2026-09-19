#!/usr/bin/env python3
"""THE SHAPE OF THE FC8 COURSE: three tiers, six modules a tier, twenty six
lessons a tier, seventy eight in the wave.

This file is the single source of the course shape. scaffold.py builds the
manifests and the lesson stubs from it, lengths.py takes the word band from it,
and gate_claims.mjs checks the briefs' structural claims against what this file
prints. Nothing else may state a lesson count.

    python3 structure.py            the report, and the self checks
    python3 structure.py --json     the same shape as JSON

Exit 0 when every self check passes, 1 otherwise.
"""
import json
import re
import sys

# The key shapes src/lib/courseContent.test.js holds every manifest to. A key is
# a learner-progress identifier once the deep seed is applied, so it is checked
# HERE, where it is written, rather than first by a suite CI does not run.
KEY_MODULE = re.compile(r'^m\d{2}-[a-z0-9]+(-[a-z0-9]+)*$')
KEY_LESSON = re.compile(r'^l\d{2}-[a-z0-9]+(-[a-z0-9]+)*$')

# The word band every lesson body must land in, measured the way lengths.py
# measures it. The floor RISES with the lesson's own est_minutes, because a
# fourteen minute lesson that is the same length as an eight minute one is
# mis-estimated rather than concise.
WORD_BAND = (420, 560)
BAND = WORD_BAND
MIN_WORDS = {6: 420, 8: 440, 10: 460, 12: 490, 14: 520}


def min_words(est):
    """The floor for a lesson of this many estimated minutes."""
    if est not in MIN_WORDS:
        raise KeyError(f'no word floor is declared for an estimate of {est} minutes')
    return MIN_WORDS[est]


# Panel ids this wave will carry. NONE OF THEM IS BUILT BY THE FOUNDATION.
# PANELS.md says what each must show and what it must never show, and the
# capstone guard in the repository refuses any panel that reaches into the
# capstone.
PANELS = {
    'fc-meterrun-explorer': 'the orifice run: bore, differential, coefficient, uncertainty budget',
    'fc-choking-explorer': 'the valve: the outlet pressure march across the choking boundary',
    'fc-venting-explorer': 'the tank: thermal and movement venting, and which direction governs',
    'fc-withheld-explorer': 'the two withheld answers, shown as the refusals the engine returns',
}

# tier -> [(module key, module title, [(lesson key, lesson title, est minutes, panels)])]
TIERS = {
    'beginner': [
        ('m01-one-orifice-run-end-to-end', 'One orifice run, end to end', [
            ('l01-what-a-meter-run-is-asked-to-do', 'What a meter run is being asked to do', 8, []),
            ('l02-reading-one-orifice-result', 'Reading one orifice result line by line', 10, ['fc-meterrun-explorer']),
            ('l03-the-inch-of-water', 'The inch of water, and where the conversion lives', 8, []),
            ('l04-flowing-volume-and-standard-volume', 'A volume at the flowing density is not a standard volume', 10, []),
        ]),
        ('m02-the-discharge-coefficient', 'The discharge coefficient is not a constant', [
            ('l01-why-the-coefficient-is-computed', 'Why the coefficient is computed rather than assumed', 10, []),
            ('l02-the-coefficient-across-beta-and-reynolds', 'The coefficient across beta and across Reynolds number', 12, ['fc-meterrun-explorer']),
            ('l03-the-small-bore-correction', 'The small bore correction, and where it turns on', 8, []),
            ('l04-the-published-beta-range', 'The published beta range, and what the engine says outside it', 10, []),
            ('l05-the-high-beta-trade', 'The high beta trade, in the engine own words', 8, []),
        ]),
        ('m03-compressibility-and-differentials', 'Compressibility, and the differentials that are not flows', [
            ('l01-the-expansibility-factor', 'The expansibility factor and what it is worth', 10, []),
            ('l02-the-specific-heat-ratio-swept', 'The specific heat ratio, swept', 8, []),
            ('l03-a-differential-at-the-static-pressure', 'A differential at or above the static pressure', 10, []),
            ('l04-sizing-the-plate', 'Sizing the plate, and both ends of the bracket', 12, []),
        ]),
        ('m04-permanent-loss-turbines-and-straight-run', 'Permanent loss, turbine meters and straight run', [
            ('l01-the-cost-of-a-differential', 'What a differential costs that is never given back', 10, []),
            ('l02-assuming-a-coefficient-of-0-61', 'What assuming a coefficient of 0.61 would cost', 10, []),
            ('l03-a-turbine-volume-is-gross', 'A turbine volume is gross and says so', 10, []),
            ('l04-meter-factor-and-proving-screen', 'The meter factor, and the proving screen', 8, []),
            ('l05-straight-run', 'Straight run: a table, a refusal and a ceiling', 12, ['fc-withheld-explorer']),
        ]),
        ('m05-the-transmitter-and-turndown', 'The transmitter, and what turndown means', [
            ('l01-accuracy-on-span-and-on-reading', 'Accuracy on span is not accuracy on reading', 10, []),
            ('l02-down-the-span', 'Down the span, reading by reading', 10, ['fc-meterrun-explorer']),
            ('l03-nine-to-one-is-three-to-one', 'Nine to one is three to one', 12, []),
            ('l04-where-the-warning-fires', 'Where the warning fires, and what it says', 8, []),
        ]),
        ('m06-the-uncertainty-budget', 'The uncertainty budget', [
            ('l01-six-terms-one-root-sum-of-squares', 'Six terms, six sensitivities, one root sum of squares', 12, ['fc-meterrun-explorer']),
            ('l02-the-differential-term', 'Where the differential term comes from', 10, []),
            ('l03-which-term-dominates', 'Which term dominates is a result', 12, []),
            ('l04-a-lead-with-no-margin', 'A lead with no margin is not a lead', 10, []),
        ]),
    ],
    'intermediate': [
        ('m01-the-choking-boundary', 'The choking boundary', [
            ('l01-why-a-valve-equation-stops-working', 'Why a valve equation stops working when the service gets hard', 8, []),
            ('l02-the-allowable-drop', 'The allowable drop, and where it comes from', 10, ['fc-choking-explorer']),
            ('l03-marching-the-outlet-pressure-down', 'Marching the outlet pressure down', 12, ['fc-choking-explorer']),
            ('l04-sizing-on-the-stated-drop', 'What sizing on the stated drop would cost', 12, []),
            ('l05-the-critical-pressure-ratio-factor', 'The critical pressure ratio factor', 10, []),
        ]),
        ('m02-cavitation-and-the-screen', 'Cavitation, and the screen an empty box switched off', [
            ('l01-damage-before-the-flow-chokes', 'Damage begins long before the flow chokes', 10, []),
            ('l02-sigma-on-the-drop-the-valve-uses', 'Sigma is computed on the drop the valve uses', 12, []),
            ('l03-the-regime-ladder', 'The regime ladder, rung by rung', 10, ['fc-choking-explorer']),
            ('l04-flashing-is-a-different-problem', 'Flashing is a different problem with a different fix', 10, []),
        ]),
        ('m03-gas-sizing-and-whose-table', 'Gas sizing, and whose table the factors are', [
            ('l01-the-pressure-drop-ratio', 'The pressure drop ratio and its terminal value', 10, []),
            ('l02-the-expansion-factor', 'The expansion factor and the two thirds floor', 12, ['fc-choking-explorer']),
            ('l03-the-specific-heat-ratio-factor', 'The specific heat ratio factor', 8, []),
            ('l04-the-style-table', 'The style table, and that it is this engine own', 10, []),
            ('l05-a-stated-vendor-figure', 'A stated vendor figure replaces a table', 10, []),
        ]),
        ('m04-authority-and-the-characteristic', 'Authority, and the characteristic it chooses', [
            ('l01-what-authority-decides', 'What authority decides', 10, []),
            ('l02-the-ladder-and-the-screen', 'The ladder, and the screen it is read against', 10, []),
            ('l03-why-equal-percentage-exists', 'Equal percentage exists to cancel something', 12, []),
            ('l04-one-vocabulary-two-functions', 'One vocabulary, two functions', 8, []),
        ]),
        ('m05-noise-as-an-indication', 'Noise, as an indication rather than a prediction', [
            ('l01-what-a-screening-band-can-tell-you', 'What a screening band can and cannot tell you', 10, []),
            ('l02-the-pressure-ratio-sets-the-band', 'The pressure ratio sets the band', 10, []),
            ('l03-the-stream-power-caps-and-floors', 'The stream power caps it and floors it', 12, []),
            ('l04-what-a-noise-prediction-would-need', 'What a real noise prediction would need', 8, []),
        ]),
        ('m06-travel-rangeability-and-the-verdict', 'Travel, rangeability and a verdict over checks that ran', [
            ('l01-a-valve-near-its-seat', 'A valve near its seat does not control', 10, []),
            ('l02-equal-percentage-and-linear-travel', 'Equal percentage travel against linear travel', 10, []),
            ('l03-beyond-the-valve-and-not-given', 'Beyond the valve is not the same as not given', 12, []),
            ('l04-a-verdict-over-checks-that-did-not-run', 'A verdict over checks that did not run is not a verdict', 10, []),
        ]),
    ],
    'advanced': [
        ('m01-the-tank-and-its-geometry', 'The tank, and the geometry three questions share', [
            ('l01-shell-venting-and-losses-in-one-module', 'Why the shell, the venting and the losses are one module', 8, []),
            ('l02-capacity-and-the-exact-barrel', 'Capacity, working capacity and the exact barrel', 10, ['fc-venting-explorer']),
            ('l03-nominal-against-working', 'Nominal against working, on one tank', 10, []),
            ('l04-a-fill-height-that-cannot-be-negative', 'A fill height that cannot be negative', 8, []),
        ]),
        ('m02-the-shell-and-what-governs', 'The shell, and which of three things governs', [
            ('l01-the-one-foot-method', 'The one-foot method, at two conditions', 10, []),
            ('l02-when-the-water-test-governs', 'A light product makes the water test govern', 12, []),
            ('l03-the-minimum-plate', 'The minimum plate is a stated input', 10, []),
            ('l04-course-by-course', 'Course by course, bottom to top', 12, []),
            ('l05-the-crossovers', 'The crossovers, found by bisecting a word', 12, []),
        ]),
        ('m03-normal-venting', 'Normal venting, and which direction governs', [
            ('l01-thermal-and-movement', 'Thermal and movement, in each direction', 10, ['fc-venting-explorer']),
            ('l02-one-predicate-computed-once', 'One predicate, computed once', 10, []),
            ('l03-vacuum-destroys-tanks', 'Vacuum is the case that destroys tanks', 12, []),
            ('l04-the-factors-the-engine-states', 'The factors the engine states and does not cite', 10, []),
        ]),
        ('m04-the-fire-case-and-the-withheld-vent', 'The fire case, and the vent that is withheld', [
            ('l01-the-wetted-area', 'The wetted area, and the height that counts', 10, ['fc-withheld-explorer']),
            ('l02-the-heat-input-bands', 'The heat input bands, edge by edge', 12, []),
            ('l03-why-the-vent-capacity-is-refused', 'Why the vent capacity is refused by name', 14, ['fc-withheld-explorer']),
            ('l04-a-factor-of-about-24', 'A factor of about 24, and what it would mean', 12, []),
            ('l05-what-to-do-instead', 'What to do instead, and what never to do', 10, []),
        ]),
        ('m05-losses-and-what-control-saves', 'Losses, and what control saves', [
            ('l01-money-and-emissions', 'The same arithmetic answers money and emissions', 10, []),
            ('l02-standing-and-working-loss', 'Standing loss and working loss', 10, []),
            ('l03-a-product-that-boils-at-ambient', 'A product that boils at ambient is refused', 10, []),
            ('l04-an-input-that-fed-nothing', 'An input that never fed anything', 8, []),
        ]),
        ('m06-the-register-and-the-refusals', 'The register, the refusals and the counts', [
            ('l01-fifteen-things-not-carried', 'Fifteen things these engines do not carry', 12, ['fc-withheld-explorer']),
            ('l02-every-refusal', 'Every refusal, and why a refusal is the useful answer', 12, []),
            ('l03-a-count-with-no-tree', 'A count with no tree and no rule is not checkable', 10, []),
            ('l04-what-you-may-quote', 'What you may quote, and what you may never quote', 10, []),
        ]),
    ],
}


def report():
    problems = []
    modules = 0
    lessons = 0
    panels_used = set()
    for tier, mods in TIERS.items():
        if len(mods) != 6:
            problems.append(f'{tier} has {len(mods)} modules and every tier has 6')
        modules += len(mods)
        n = 0
        keys = set()
        for mi, (mkey, mtitle, ls) in enumerate(mods, 1):
            if not KEY_MODULE.match(mkey) or not mkey.startswith(f'm{mi:02d}-'):
                problems.append(f'{tier} module {mi} has the key {mkey!r}, which is not m{mi:02d}-<slug>')
            for li, (lkey, ltitle, est, panels) in enumerate(ls, 1):
                n += 1
                full = f'{tier}/{mkey}/{lkey}'
                if not KEY_LESSON.match(lkey) or not lkey.startswith(f'l{li:02d}-'):
                    problems.append(f'{full} has a lesson key that is not l{li:02d}-<slug>')
                if full in keys:
                    problems.append(f'{full} appears twice')
                keys.add(full)
                if est not in MIN_WORDS:
                    problems.append(f'{full} has an estimate of {est} minutes with no declared word floor')
                for p in panels:
                    panels_used.add(p)
                    if p not in PANELS:
                        problems.append(f'{full} names the panel {p}, which is not declared in PANELS')
                if any(ch in ltitle for ch in '—–'):
                    problems.append(f'{full} title carries an em dash or an en dash')
                if ', not ' in ltitle:
                    problems.append(f'{full} title carries a contrastive')
        if n != 26:
            problems.append(f'{tier} has {n} lessons and every tier has 26')
        lessons += n
    dead = sorted(set(PANELS) - panels_used)
    if dead:
        problems.append(f'declared panels no lesson carries: {dead}')
    print(f'FC8 metering: {lessons} lessons, {modules} modules, 3 tiers, '
          f'{len(PANELS)} panel ids')
    for tier, mods in TIERS.items():
        counts = ', '.join(f'{k} {len(ls)}' for k, _t, ls in mods)
        print(f'  {tier:<13} {sum(len(ls) for _k, _t, ls in mods)} lessons  ({counts})')
    print(f'  word band: {WORD_BAND[0]} to {WORD_BAND[1]} prose words, '
          f'floors by estimate: {MIN_WORDS}')
    print(f'  panels: {", ".join(sorted(PANELS))}')
    print(f'PROBLEMS: {len(problems)}')
    for p in problems:
        print(f'   {p}')
    return 1 if problems else 0


if __name__ == '__main__':
    if '--json' in sys.argv:
        print(json.dumps({'tiers': TIERS, 'band': WORD_BAND, 'minWords': MIN_WORDS,
                          'panels': PANELS}, indent=1))
        sys.exit(0)
    sys.exit(report())
