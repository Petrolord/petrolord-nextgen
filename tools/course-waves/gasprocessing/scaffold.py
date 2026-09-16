#!/usr/bin/env python3
"""Build the FC4 scaffold in the NextGen repo from structure.py.

Writes one manifest.json a tier and one empty module directory per module.
It writes NO lesson bodies: a lesson file is written by the lesson wave from
the digest, and a placeholder body is exactly the thing a later gate would
sweep as if it were content.

Idempotent. Refuses to overwrite a lesson body that already exists.
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from structure import TIERS, HELD

REPO = '/root/wt-fc4-nextgen'
SLUG = 'gasprocessing'
ROOT = os.path.join(REPO, 'src', 'content', 'courses', SLUG)

def main():
    made_dirs = made_manifests = existing_bodies = 0
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
            for lkey, *_ in lessons:
                if os.path.exists(os.path.join(d, f'{lkey}.md')):
                    existing_bodies += 1
        p = os.path.join(ROOT, tier, 'manifest.json')
        with open(p, 'w') as fh:
            json.dump(manifest, fh, indent=2)
            fh.write('\n')
        made_manifests += 1
    print(f'  module directories present: {made_dirs} created')
    print(f'  tier manifests written: {made_manifests}')
    print(f'  lesson bodies already on disk: {existing_bodies} of 78')
    held = sum(len(m[2]) for t, mods in TIERS.items() for m in mods if m[0] in HELD.get(t, []))
    print(f'  lessons HELD pending FC4-0: {held}')
    return 0

sys.exit(main())
