#!/usr/bin/env python3
"""Lay out the SC5 contracts content tree from structure.py: the three tier
manifests and the 78 lesson stubs.

Adapted from the EC11 prms scaffold. A PRACTICE COURSE HAS NO PANEL: every
manifest lesson carries `panels: []`, `has_exercise: true` and
`exercise: 'written-scenario'` (each lesson closes with written scenario work
on the synthetic Ekene contracts the pack registers), plus min_prose_words
and max_prose_words from structure.py's band. A stub is the lesson title as
its H1 and NOTHING else: no prose, no figure, no panel line.

An EXISTING lesson file is never overwritten: a stub is written only where no
file exists, so re-running the scaffold after lessons are written changes the
manifests alone, and the run prints how many stubs it wrote and how many files
it left alone.

    python3 scaffold.py [--repo /root/wt-sc5-nextgen] [--check]

--check writes nothing and exits 1 if any manifest or stub on disk differs
from what the scaffold would write (a lesson file counts as differing only if
it is missing, its H1 is not the scaffold's, or it carries a panel line).
"""
import importlib.util
import io
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
args = sys.argv[1:]
repo = args[args.index('--repo') + 1] if '--repo' in args else json.load(open(os.path.join(HERE, 'wave.json')))['repo']
CHECK = '--check' in args
spec = importlib.util.spec_from_file_location('structure', os.path.join(HERE, 'structure.py'))
S = importlib.util.module_from_spec(spec)
spec.loader.exec_module(S)
probs = S.check(quiet=True)
if probs:
    sys.exit(f'REFUSES: structure.py reports {len(probs)} problem(s): {probs[:3]}')
content = os.path.join(repo, 'src/content/courses/contracts')

wrote = kept = manifests = drift = 0
for tier, modules in S.TIERS.items():
    manifest = {'app_slug': 'contracts', 'tier': tier, 'content_version': 1, 'modules': []}
    for mi, (mkey, mtitle, lessons) in enumerate(modules, 1):
        mdir = os.path.join(content, tier, mkey)
        if not CHECK:
            os.makedirs(mdir, exist_ok=True)
        manifest['modules'].append({
            'key': mkey, 'title': mtitle, 'order': mi,
            'lessons': [
                {'key': lkey, 'title': ltitle, 'order': li, 'est_minutes': mins, 'panels': [],
                 'has_exercise': True, 'exercise': S.EXERCISE,
                 'min_prose_words': S.min_words(mins), 'max_prose_words': S.BAND[1]}
                for li, (lkey, ltitle, mins, _topics) in enumerate(lessons, 1)
            ],
        })
        for lkey, ltitle, mins, _topics in lessons:
            p = os.path.join(mdir, f'{lkey}.md')
            stub = f'# {ltitle}\n'
            if os.path.exists(p):
                kept += 1
                text = open(p, encoding='utf-8').read()
                if text.split('\n')[0] != f'# {ltitle}' or '{{panel:' in text:
                    drift += 1
                    print(f'  DRIFT {tier}/{mkey}/{lkey}.md: its H1 is not the scaffold\'s, or it carries a panel line')
            elif CHECK:
                drift += 1
                print(f'  MISSING {tier}/{mkey}/{lkey}.md')
            else:
                io.open(p, 'w', encoding='utf-8').write(stub)
                wrote += 1
    mp = os.path.join(content, tier, 'manifest.json')
    text = json.dumps(manifest, indent=1) + '\n'
    if CHECK:
        if not os.path.exists(mp) or open(mp, encoding='utf-8').read() != text:
            drift += 1
            print(f'  DRIFT {tier}/manifest.json')
    else:
        io.open(mp, 'w', encoding='utf-8').write(text)
    manifests += 1
    print(f'{tier}: {len(modules)} modules, {sum(len(m[2]) for m in modules)} lessons')
print(f'scaffold: {manifests} manifests, {wrote} stubs written, {kept} existing lesson files left alone, {drift} drift')
sys.exit(1 if (CHECK and drift) else 0)
