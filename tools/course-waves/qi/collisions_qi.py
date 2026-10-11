#!/usr/bin/env python3
"""THE KIT'S collisions.py, RUN ON THE QI FIELDS THAT EXIST.

The kit gate asserts exactly eighteen fields before it checks anything. QI
grades six fields a tier, and a tier's six enter fields.json only once its
grader's engines pass the extraction gate, so at the foundation fields.json
holds the Associate six. This wrapper calls the kit's own check() unchanged on
whatever fields.json holds, after asserting six fields for each tier present,
and says how many tiers it compared. With one tier present no cross-tier
collision is possible, and the summary says so in words: a zero from a sweep
that could not have found anything is printed as that.

    python3 collisions_qi.py [--plant]

--plant is THE NEGATIVE CONTROL: it adds a planted Professional field equal to
the first Associate value (an earlier tier satisfied by a later one), and must
exit 1 with the collision caught.
"""
import importlib.util
import io
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('kit_collisions', '/root/dc-wavekit/collisions.py')
K = importlib.util.module_from_spec(spec)
spec.loader.exec_module(K)
fields = [tuple(f) for f in json.load(io.open(os.path.join(HERE, 'fields.json'), encoding='utf-8'))]
tiers = {}
for f in fields:
    tiers[f[0]] = tiers.get(f[0], 0) + 1
if not fields or any(n != 6 for n in tiers.values()):
    print(f'collisions_qi REFUSES: fields.json does not hold six fields for each tier it carries: {tiers}')
    sys.exit(2)
if '--plant' in sys.argv:
    a = fields[0]
    fields.append(('intermediate', 'planted_copy', a[2] + 0.5 * a[3], a[3]))
print(f'[collisions_qi] tiers present: {sorted(tiers)}; {len(fields)} fields compared by the kit check()')
if len(tiers) == 1 and '--plant' not in sys.argv:
    print('  one tier present: no cross-tier collision is possible yet, so this zero says only that the tier collides with nothing of its own')
fatal = K.check(fields)
if '--plant' in sys.argv:
    print(f'  NEGATIVE CONTROL: a later-tier copy of an Associate value was planted; {"caught" if fatal else "NOT CAUGHT"}')
    sys.exit(1 if fatal else 2)
sys.exit(1 if fatal else 0)
