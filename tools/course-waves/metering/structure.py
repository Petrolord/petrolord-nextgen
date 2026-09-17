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
import sys

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
        ('m01', 'One orifice run, end to end', [
            ('l01', 'What a meter run is being asked to do', 8, []),
            ('l02', 'Reading one orifice result line by line', 10, ['fc-meterrun-explorer']),
            ('l03', 'The inch of water, and where the conversion lives', 8, []),
            ('l04', 'A volume at the flowing density is not a standard volume', 10, []),
        ]),
        ('m02', 'The discharge coefficient is not a constant', [
            ('l01', 'Why the coefficient is computed rather than assumed', 10, []),
            ('l02', 'The coefficient across beta and across Reynolds number', 12, ['fc-meterrun-explorer']),
            ('l03', 'The small bore correction, and where it turns on', 8, []),
            ('l04', 'The published beta range, and what the engine says outside it', 10, []),
            ('l05', 'The high beta trade, in the engine own words', 8, []),
        ]),
        ('m03', 'Compressibility, and the differentials that are not flows', [
            ('l01', 'The expansibility factor and what it is worth', 10, []),
            ('l02', 'The specific heat ratio, swept', 8, []),
            ('l03', 'A differential at or above the static pressure', 10, []),
            ('l04', 'Sizing the plate, and both ends of the bracket', 12, []),
        ]),
        ('m04', 'Permanent loss, turbine meters and straight run', [
            ('l01', 'What a differential costs that is never given back', 10, []),
            ('l02', 'What assuming a coefficient of 0.61 would cost', 10, []),
            ('l03', 'A turbine volume is gross and says so', 10, []),
            ('l04', 'The meter factor, and the proving screen', 8, []),
            ('l05', 'Straight run: a table, a refusal and a ceiling', 12, ['fc-withheld-explorer']),
        ]),
        ('m05', 'The transmitter, and what turndown means', [
            ('l01', 'Accuracy on span is not accuracy on reading', 10, []),
            ('l02', 'Down the span, reading by reading', 10, ['fc-meterrun-explorer']),
            ('l03', 'Nine to one is three to one', 12, []),
            ('l04', 'Where the warning fires, and what it says', 8, []),
        ]),
        ('m06', 'The uncertainty budget', [
            ('l01', 'Six terms, six sensitivities, one root sum of squares', 12, ['fc-meterrun-explorer']),
            ('l02', 'Where the differential term comes from', 10, []),
            ('l03', 'Which term dominates is a result', 12, []),
            ('l04', 'A lead with no margin is not a lead', 10, []),
        ]),
    ],
    'intermediate': [
        ('m01', 'The choking boundary', [
            ('l01', 'Why a valve equation stops working when the service gets hard', 8, []),
            ('l02', 'The allowable drop, and where it comes from', 10, ['fc-choking-explorer']),
            ('l03', 'Marching the outlet pressure down', 12, ['fc-choking-explorer']),
            ('l04', 'What sizing on the stated drop would cost', 12, []),
            ('l05', 'The critical pressure ratio factor', 10, []),
        ]),
        ('m02', 'Cavitation, and the screen an empty box switched off', [
            ('l01', 'Damage begins long before the flow chokes', 10, []),
            ('l02', 'Sigma is computed on the drop the valve uses', 12, []),
            ('l03', 'The regime ladder, rung by rung', 10, ['fc-choking-explorer']),
            ('l04', 'Flashing is a different problem with a different fix', 10, []),
        ]),
        ('m03', 'Gas sizing, and whose table the factors are', [
            ('l01', 'The pressure drop ratio and its terminal value', 10, []),
            ('l02', 'The expansion factor and the two thirds floor', 12, ['fc-choking-explorer']),
            ('l03', 'The specific heat ratio factor', 8, []),
            ('l04', 'The style table, and that it is this engine own', 10, []),
            ('l05', 'A stated vendor figure replaces a table', 10, []),
        ]),
        ('m04', 'Authority, and the characteristic it chooses', [
            ('l01', 'What authority decides', 10, []),
            ('l02', 'The ladder, and the screen it is read against', 10, []),
            ('l03', 'Equal percentage exists to cancel something', 12, []),
            ('l04', 'One vocabulary, two functions', 8, []),
        ]),
        ('m05', 'Noise, as an indication rather than a prediction', [
            ('l01', 'What a screening band can and cannot tell you', 10, []),
            ('l02', 'The pressure ratio sets the band', 10, []),
            ('l03', 'The stream power caps it and floors it', 12, []),
            ('l04', 'What a real noise prediction would need', 8, []),
        ]),
        ('m06', 'Travel, rangeability and a verdict over checks that ran', [
            ('l01', 'A valve near its seat does not control', 10, []),
            ('l02', 'Equal percentage travel against linear travel', 10, []),
            ('l03', 'Beyond the valve is not the same as not given', 12, []),
            ('l04', 'A verdict over checks that did not run is not a verdict', 10, []),
        ]),
    ],
    'advanced': [
        ('m01', 'The tank, and the geometry three questions share', [
            ('l01', 'Why the shell, the venting and the losses are one module', 8, []),
            ('l02', 'Capacity, working capacity and the exact barrel', 10, ['fc-venting-explorer']),
            ('l03', 'Nominal against working, on one tank', 10, []),
            ('l04', 'A fill height that cannot be negative', 8, []),
        ]),
        ('m02', 'The shell, and which of three things governs', [
            ('l01', 'The one-foot method, at two conditions', 10, []),
            ('l02', 'A light product makes the water test govern', 12, []),
            ('l03', 'The minimum plate is a stated input', 10, []),
            ('l04', 'Course by course, bottom to top', 12, []),
            ('l05', 'The crossovers, found by bisecting a word', 12, []),
        ]),
        ('m03', 'Normal venting, and which direction governs', [
            ('l01', 'Thermal and movement, in each direction', 10, ['fc-venting-explorer']),
            ('l02', 'One predicate, computed once', 10, []),
            ('l03', 'Vacuum is the case that destroys tanks', 12, []),
            ('l04', 'The factors the engine states and does not cite', 10, []),
        ]),
        ('m04', 'The fire case, and the vent that is withheld', [
            ('l01', 'The wetted area, and the height that counts', 10, ['fc-withheld-explorer']),
            ('l02', 'The heat input bands, edge by edge', 12, []),
            ('l03', 'Why the vent capacity is refused by name', 14, ['fc-withheld-explorer']),
            ('l04', 'A factor of about 24, and what it would mean', 12, []),
            ('l05', 'What to do instead, and what never to do', 10, []),
        ]),
        ('m05', 'Losses, and what control saves', [
            ('l01', 'The same arithmetic answers money and emissions', 10, []),
            ('l02', 'Standing loss and working loss', 10, []),
            ('l03', 'A product that boils at ambient is refused', 10, []),
            ('l04', 'An input that never fed anything', 8, []),
        ]),
        ('m06', 'The register, the refusals and the counts', [
            ('l01', 'Fifteen things these engines do not carry', 12, ['fc-withheld-explorer']),
            ('l02', 'Every refusal, and why a refusal is the useful answer', 12, []),
            ('l03', 'A count with no tree and no rule is not checkable', 10, []),
            ('l04', 'What you may quote, and what you may never quote', 10, []),
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
        for mkey, mtitle, ls in mods:
            for lkey, ltitle, est, panels in ls:
                n += 1
                full = f'{tier}/{mkey}/{lkey}'
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
