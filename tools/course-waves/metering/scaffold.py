#!/usr/bin/env python3
"""Scaffold the FC8 Metering, Control Valves & Storage course into NextGen.

Writes, for each of the three tiers, a manifest.json and one markdown file per
lesson, from structure.py and from nothing else. The markdown files are STUBS:
an H1 that is the lesson title exactly, the panel line where structure.py says
one goes, and a placeholder body that NAMES ITSELF AS A PLACEHOLDER. A writer
replaces the body and leaves the H1 and the panel line alone.

IT NEVER OVERWRITES A WRITTEN LESSON. A file whose body no longer carries the
placeholder marker is left exactly as it is and counted, because the one thing a
scaffold must never do is run twice and erase a tier.

    python3 scaffold.py [--dry-run]
"""
import io
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import structure as S  # noqa: E402

COURSE = os.environ.get('FC8_COURSE', '/root/wt-fc8-nextgen/src/content/courses/metering')
DRY = '--dry-run' in sys.argv
MARK = '<!-- FC8 SCAFFOLD PLACEHOLDER: replace this body. Do not change the H1 or the panel line. -->'


def body(tier, mkey, mtitle, ltitle, panels, minw):
    lines = [f'# {ltitle}', '']
    for p in panels:
        lines += [f'{{{{panel:{p}}}}}', '']
    lines += [
        MARK,
        '',
        f'This lesson is not written yet. It belongs to the {tier} tier, module '
        f'{mtitle} ({mkey}), and its body must carry between {minw} and '
        f'{S.WORD_BAND[1]} PROSE WORDS.',
        '',
        'PROSE WORDS ARE COUNTED THE WAY lengths.py COUNTS THEM, which is not what '
        'older waves said. Excluded: front matter between the leading triple dashes, '
        'markdown table rows whose first non-space character is a pipe, and '
        '{{panel:...}} lines. Everything else counts, INCLUDING EVERY HEADING and '
        'including this H1. A sibling wave told its writers headings were excluded '
        'and the code counted them, so every lesson written to that instruction ran '
        '20 to 40 words light.',
        '',
        'Every figure in this lesson must be quoted from digest.txt at the precision '
        'the digest prints it. No figure may come from RECON.md, FINDINGS.md, the '
        'engine source comments or the vendored FINDINGS-metering.md, all four of '
        'which are provenance rather than teaching truth.',
        '',
        'NO COMPARISON BETWEEN TWO FIGURES MAY BE WRITTEN THAT THE DIGEST DOES NOT '
        'PRINT. The digest carries lines beginning RELATION which give two values, '
        'their difference and their ratio. Quote one of those or say nothing about '
        'the relationship.',
        '',
        'NOTHING IN THIS COURSE GRADES THE REQUIRED EMERGENCY FIRE VENT CAPACITY OR '
        'THE STRAIGHT-RUN REQUIREMENT FOR TWO ELBOWS IN DIFFERENT PLANES. Both are '
        'refused by the engine by name and both are taught as limits. Digest '
        'SECTION 31 is the register of all fifteen held and withheld items.',
        '',
        '## Exercise',
        '',
        'Not written yet.',
        '',
    ]
    return '\n'.join(lines)


def main():
    written, kept, dirs = 0, 0, 0
    for tier, mods in S.TIERS.items():
        tdir = os.path.join(COURSE, tier)
        manifest = {'app_slug': 'metering', 'tier': tier, 'content_version': 1, 'modules': []}
        for mi, (mkey, mtitle, lessons) in enumerate(mods, 1):
            mdir = os.path.join(tdir, mkey)
            if not DRY:
                os.makedirs(mdir, exist_ok=True)
            dirs += 1
            mod = {'key': mkey, 'title': mtitle, 'order': mi, 'lessons': []}
            for li, (lkey, ltitle, est, panels) in enumerate(lessons, 1):
                mod['lessons'].append({
                    'key': lkey, 'title': ltitle, 'order': li, 'est_minutes': est,
                    'panels': list(panels), 'has_exercise': True,
                    'min_prose_words': S.min_words(est), 'max_prose_words': S.WORD_BAND[1],
                })
                p = os.path.join(mdir, f'{lkey}.md')
                text = body(tier, mkey, mtitle, ltitle, panels, S.min_words(est))
                if os.path.exists(p) and MARK not in io.open(p, encoding='utf-8').read():
                    kept += 1
                    continue
                if not DRY:
                    io.open(p, 'w', encoding='utf-8').write(text)
                written += 1
            manifest['modules'].append(mod)
        if not DRY:
            os.makedirs(tdir, exist_ok=True)
            io.open(os.path.join(tdir, 'manifest.json'), 'w', encoding='utf-8').write(
                json.dumps(manifest, indent=1, ensure_ascii=False) + '\n')
    print(f'  scaffolded into {COURSE}{" (dry run)" if DRY else ""}')
    print(f'  module directories: {dirs}')
    print(f'  lesson stubs written: {written}')
    print(f'  written lessons left alone: {kept}')
    print('  manifests: 3')
    if dirs != 18 or written + kept != 78:
        print('  REFUSES: the scaffold did not cover 18 modules and 78 lessons')
        return 2
    return 0


sys.exit(main())
