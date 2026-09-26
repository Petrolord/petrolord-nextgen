#!/usr/bin/env python3
"""Lesson length gate: prose words (tables, headings, front matter, panel
lines excluded) must sit in 420..560 and rank with est_minutes per tier."""
import json, os, re, sys
W = '/root/wt-ec7-recut/src/content/courses/cashflow'
bad = 0
for tier in ['beginner', 'intermediate', 'advanced']:
    man = json.load(open(f'{W}/{tier}/manifest.json'))
    rows = []
    for m in man['modules']:
        for l in m['lessons']:
            p = f"{W}/{tier}/{m['key']}/{l['key']}.md"
            if not os.path.exists(p):
                rows.append((l['est_minutes'], None, f"{m['key']}/{l['key']}")); continue
            txt = open(p).read()
            if txt.startswith('---'):
                txt = txt.split('---', 2)[2]
            body = [ln for ln in txt.splitlines() if not ln.startswith('|') and not ln.startswith('{{panel')]
            words = len(' '.join(body).split())
            rows.append((l['est_minutes'], words, f"{m['key']}/{l['key']}"))
    done = [r for r in rows if r[1] is not None]
    print(f"{tier}: {len(done)}/{len(rows)} written")
    for mins, w, name in sorted(done):
        flag = '' if 420 <= w <= 560 else '  OUT OF BAND'
        if flag: bad += 1
        print(f"  {mins:>2} {w:>4} {name}{flag}")
    # rank: mean words per minute bucket should rise
    by = {}
    for mins, w, _ in done: by.setdefault(mins, []).append(w)
    means = [(k, sum(v)/len(v)) for k, v in sorted(by.items())]
    print('  mean by minutes:', ' '.join(f"{k}:{v:.0f}" for k, v in means))
print('out of band:', bad)
