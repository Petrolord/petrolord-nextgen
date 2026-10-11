#!/usr/bin/env python3
"""Write apply_qi.sh from apply_qi.tmpl.sh with the content pins of every QI
migration present in the COMMITTED tree at <ref>, in ladder order (the course
row, the deep seeds, the later capstones, then the go-live). Never pin by hand.

    python3 pin_qi.py <repo> <ref>     rewrites apply_qi.sh beside this file
"""
import hashlib
import json
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
repo, ref = sys.argv[1], sys.argv[2]


def show(p):
    r = subprocess.run(['git', '-C', repo, 'show', f'{ref}:{p}'], capture_output=True)
    return r.stdout if r.returncode == 0 else None


names = json.loads(show('tools/course-waves/qi/ship_names.json') or open(f'{HERE}/ship_names.json', 'rb').read())
order = ['course', 'beginner_deep', 'intermediate_deep', 'advanced_deep', 'intermediate_capstone', 'advanced_capstone']
seeds, cases = [], []
for k in order + ['go_live']:
    n = names.get(k)
    if not n:
        print(f'  not named yet: {k}')
        continue
    body = show(f'migrations/{n}.sql')
    if body is None:
        print(f'  absent at {ref}: {n}')
        if k in ('course', 'go_live'):
            sys.exit(f'REFUSED: {n}.sql is not committed at {ref}')
        continue
    h = hashlib.sha256(body).hexdigest()
    cases.append(f'    {n:<40}) echo {h} ;;')
    if k != 'go_live':
        seeds.append(n)
    print(f'  pinned {n} {h[:12]}')
t = open(f'{HERE}/apply_qi.tmpl.sh').read()
t = t.replace('@@SEEDS@@', '\n'.join(seeds)).replace('@@GOLIVE@@', names['go_live']).replace('@@COURSE@@', names['course'])
t = t.replace('@@CASES@@', '\n'.join(cases)).replace('@@PINS@@', f'pinned at {ref}')
open(f'{HERE}/apply_qi.sh', 'w').write(t)
os.chmod(f'{HERE}/apply_qi.sh', 0o755)
print(f'wrote {HERE}/apply_qi.sh: {len(seeds)} seed(s) and the go-live pinned at {ref}')
