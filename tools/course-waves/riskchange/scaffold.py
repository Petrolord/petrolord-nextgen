#!/usr/bin/env python3
"""Build the riskchange scaffold in the NextGen worktree from structure.py.

Writes one manifest.json a tier, exactly the shape FC6's scaffold.py writes, one
directory per module, and one PLACEHOLDER file per lesson carrying only its H1
title and a marker line, so the writers fill a file that already has its key,
its place and its title. A placeholder has no prose: lengths.py counts it as
zero words and the lesson wave's length gate fails it until it is written.

Idempotent. It never overwrites a lesson file whose body is more than the
placeholder, so re-running it after writers start cannot erase their work.
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from structure import TIERS, HELD

REPO = '/root/wt-as-riskchange-nextgen'
SLUG = 'riskchange'
ROOT = os.path.join(REPO, 'src', 'content', 'courses', SLUG)
MARK = '<!-- PLACEHOLDER: this lesson is not written yet. The lesson wave writes it from digest.txt. -->'


def placeholder(title):
    return f'# {title}\n\n{MARK}\n'


def main():
    made_dirs = made_manifests = placed = kept = 0
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
                if os.path.exists(p) and open(p).read() != placeholder(ltitle):
                    kept += 1
                    continue
                with open(p, 'w') as fh:
                    fh.write(placeholder(ltitle))
                placed += 1
        p = os.path.join(ROOT, tier, 'manifest.json')
        with open(p, 'w') as fh:
            json.dump(manifest, fh, indent=2)
            fh.write('\n')
        made_manifests += 1
    print(f'  module directories created: {made_dirs}')
    print(f'  tier manifests written: {made_manifests}')
    print(f'  lesson placeholders written: {placed}; written lessons kept untouched: {kept}')
    held = sum(len(m[2]) for t, mods in TIERS.items() for m in mods if m[0] in HELD.get(t, []))
    print(f'  lessons HELD: {held}')
    return 0


sys.exit(main())
