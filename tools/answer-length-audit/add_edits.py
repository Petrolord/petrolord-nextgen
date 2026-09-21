#!/usr/bin/env python3
"""Append edits to tools/answer-length-audit/edits/<course>.json.

stdin lines:  tier|scope|module_key|ord|option|new text     (module_key empty for a final)
`old` is filled from the served row, so the edits file always carries both
texts side by side for review. A line re-editing an option replaces the earlier
edit for that option.
"""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import recut  # noqa: E402

course = sys.argv[1]
container = sys.argv[2] if len(sys.argv) > 2 else 'b4-scratch'
rows = {recut.key(r): r for r in recut.served(container, course)}
path = os.path.join(HERE, 'edits', f'{course}.json')
edits = json.load(open(path)) if os.path.exists(path) else []
byk = {(recut.key(e), e['option']): i for i, e in enumerate(edits)}
n = 0
for line in sys.stdin:
    line = line.rstrip('\n')
    if not line.strip() or line.startswith('#'):
        continue
    tier, scope, mk, ordv, opt, text = line.split('|', 5)
    e = {'tier': tier, 'scope': scope, 'module_key': mk or None, 'ord': int(ordv), 'option': int(opt)}
    r = rows[recut.key(e)]
    e['old'] = r['options'][e['option']]
    e['new'] = text.strip()
    k = (recut.key(e), e['option'])
    if k in byk:
        edits[byk[k]] = e
    else:
        byk[k] = len(edits); edits.append(e)
    n += 1
edits.sort(key=lambda e: (recut.key(e), e['option']))
json.dump(edits, open(path, 'w'), indent=1, ensure_ascii=False)
open(path, 'a').write('\n')
print(f'{course}: {n} lines read, {len(edits)} edits on file')
