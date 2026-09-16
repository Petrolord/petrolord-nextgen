#!/usr/bin/env python3
"""Lesson length gate: prose words must sit in 420..560 and rank with
est_minutes per tier.

WHAT IS EXCLUDED, MEASURED FROM THE CODE BELOW RATHER THAN CLAIMED: front
matter, markdown TABLE ROWS (lines starting with |) and PANEL markers
(lines starting with {{panel). HEADINGS ARE COUNTED.

THE DOCSTRING USED TO SAY HEADINGS WERE EXCLUDED AND THE CODE NEVER DID.
LESSON_TASK.md repeated the docstring. A writer who trusted either ran 20
to 40 words LIGHT against the band, on every lesson. Corrected to match the
code, because the counts of every wave already written were produced by the
code."""
import json, os, re, sys
W = '/root/wt-fc4-nextgen/src/content/courses/gasprocessing'
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
