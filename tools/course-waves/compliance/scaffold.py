#!/usr/bin/env python3
"""Build the compliance scaffold in the NextGen worktree from structure.py.

Writes one manifest.json a tier, exactly as FC6's scaffold.py shapes it, and
one PLACEHOLDER lesson file per lesson holding only its title as an H1. FC6
wrote no lesson files at the foundation; this wave writes title-only
placeholders because the brief asks for them and because the repository's own
content lint (src/lib/courseContent.test.js) fails a manifest lesson with no
file. A placeholder carries no prose and no number, so no gate can sweep it as
content: gate_scaffold.py asserts every placeholder is exactly its title line.

Idempotent. Refuses to overwrite a lesson body that is more than its title.
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from structure import TIERS, HELD

REPO = '/root/wt-as-compliance-nextgen'
SLUG = 'compliance'
ROOT = os.path.join(REPO, 'src', 'content', 'courses', SLUG)


def main():
    made_dirs = made_manifests = placeholders = kept = 0
    for tier, mods in TIERS.items():
        manifest = {'app_slug': SLUG, 'tier': tier, 'content_version': 1, 'modules': []}
        for mi, (mkey, mtitle, lessons) in enumerate(mods, 1):
            d = os.path.join(ROOT, tier, mkey)
            if not os.path.isdir(d):
                os.makedirs(d)
                made_dirs += 1
            manifest['modules'].append({
                'key': mkey, 'title': mtitle, 'order': mi,
                'lessons': [{
                    'key': lkey, 'title': ltitle, 'order': li,
                    'est_minutes': mins, 'panels': list(panels),
                    'has_exercise': True,
                } for li, (lkey, ltitle, mins, panels) in enumerate(lessons, 1)],
            })
            for lkey, ltitle, *_ in lessons:
                p = os.path.join(d, f'{lkey}.md')
                body = f'# {ltitle}\n'
                if os.path.exists(p):
                    if open(p, encoding='utf-8').read() != body:
                        kept += 1
                        continue
                with open(p, 'w', encoding='utf-8') as fh:
                    fh.write(body)
                placeholders += 1
        p = os.path.join(ROOT, tier, 'manifest.json')
        with open(p, 'w') as fh:
            json.dump(manifest, fh, indent=2)
            fh.write('\n')
        made_manifests += 1
    print(f'  module directories created: {made_dirs}')
    print(f'  tier manifests written: {made_manifests}')
    print(f'  title-only placeholders written: {placeholders}; lesson bodies kept: {kept}; of 78')
    held = sum(len(m[2]) for t, mods in TIERS.items() for m in mods if m[0] in HELD.get(t, []))
    print(f'  lessons held: {held}')
    return 0


sys.exit(main())
