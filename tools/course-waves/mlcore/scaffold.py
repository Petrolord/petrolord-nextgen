#!/usr/bin/env python3
"""Lay out the D2 mlcore content tree from structure.py: the three tier
manifests and the 78 lesson stubs.

Adapted from /root/dc-wavekit/scaffold.py, which writes directories and
manifests only. This wave also writes each STUB, because LESSON_TASK.md tells
the writer to keep the H1 the scaffold writes and the panel line where
structure.py puts one, and a stub that carries both makes that instruction
checkable. A stub is the lesson title as its H1 and one {{panel:...}} line per
panel tag, and NOTHING else: no prose, no number.

Every manifest lesson carries min_prose_words and max_prose_words from
structure.py's band, as H1's manifests do.

An EXISTING lesson file is never overwritten: a stub is written only where no
file exists, so re-running the scaffold after lessons are written changes the
manifests alone, and the run prints how many stubs it wrote and how many files
it left alone.

    python3 scaffold.py [--repo /root/wt-dai-d2-nextgen] [--check]

--check writes nothing and exits 1 if any manifest or stub on disk differs
from what the scaffold would write (a stub counts as differing only if the
file is missing or its H1 or panel lines are not the scaffold's).
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
content = os.path.join(repo, 'src/content/courses/mlcore')

wrote = kept = manifests = drift = 0
for tier, modules in S.TIERS.items():
    manifest = {'app_slug': 'mlcore', 'tier': tier, 'content_version': 1, 'modules': []}
    for mi, (mkey, mtitle, lessons) in enumerate(modules, 1):
        mdir = os.path.join(content, tier, mkey)
        if not CHECK:
            os.makedirs(mdir, exist_ok=True)
        manifest['modules'].append({
            'key': mkey, 'title': mtitle, 'order': mi,
            'lessons': [
                {'key': lkey, 'title': ltitle, 'order': li, 'est_minutes': mins, 'panels': panels,
                 'has_exercise': True, 'min_prose_words': S.min_words(mins), 'max_prose_words': S.BAND[1]}
                for li, (lkey, ltitle, mins, panels) in enumerate(lessons, 1)
            ],
        })
        for lkey, ltitle, mins, panels in lessons:
            p = os.path.join(mdir, f'{lkey}.md')
            stub = f'# {ltitle}\n' + ''.join(f'\n{{{{panel:{pid}}}}}\n' for pid in panels)
            if os.path.exists(p):
                kept += 1
                text = open(p, encoding='utf-8').read()
                lines = text.split('\n')
                if lines[0] != f'# {ltitle}' or any(f'{{{{panel:{pid}}}}}' not in text for pid in panels):
                    drift += 1
                    print(f'  DRIFT {tier}/{mkey}/{lkey}.md: its H1 or a panel line is not the scaffold\'s')
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
