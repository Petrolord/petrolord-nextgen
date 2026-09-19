#!/usr/bin/env python3
"""GATE: no graded value collides with a number the digest prints, or with
another graded value.

This is the rule the go-live migration of every course in this programme
enforces in SQL (gen_golive.py, FC6): every token the digest prints that reads
as a number, taken by the regex -?\\d+\\.?\\d* and made absolute, is a published
figure, and a graded field within its own tolerance of one is a lookup rather
than a calculation. Dates count: 2027-03-01 prints the tokens 2027, 03 and 01.
The graded fields here are dollars, barrels, dollars a barrel, a percent and
the screening engine's millions, each at its own absolute tolerance (the
grader's rule, abs(got - expected) <= tol).

It also refuses two graded fields within the looser of their tolerances of each
other, and prints the closest approach of any digest token to any graded
value, in that field's tolerances, so a near miss is visible.

Negative control: --plant sets one graded value to a number the digest prints
and the gate must go red on it.
"""
import json
import os
import re
import sys

W = os.path.dirname(os.path.abspath(__file__))
NUM = re.compile(r'-?\d+\.?\d*')


def main():
    digest = open(os.path.join(W, 'digest.txt'), encoding='utf-8').read()
    published = sorted({abs(float(t)) for t in NUM.findall(digest)})
    fields = json.load(open(os.path.join(W, 'fields.json')))
    if '--plant' in sys.argv:
        fields[8][2] = 7077935.48  # ABUA's margin, which the digest prints
    bad, near = [], []
    for tier, key, val, tol in fields:
        best = min(published, key=lambda d: abs(abs(val) - d))
        gap = abs(abs(val) - best) / tol
        near.append((gap, key, val, best))
        if gap <= 1:
            bad.append(f'{tier}.{key} = {val} is within {tol} of {best:g}, which the digest prints')
    pairs = []
    for i, (ta, ka, va, tola) in enumerate(fields):
        for tb, kb, vb, tolb in fields[i + 1:]:
            if abs(abs(va) - abs(vb)) <= max(tola, tolb):
                pairs.append(f'{ta}.{ka} = {va} and {tb}.{kb} = {vb}')
    print(f'  digest number tokens swept: {len(published)} distinct absolute values')
    print(f'  graded fields swept: {len(fields)}; pairs compared: {len(fields) * (len(fields) - 1) // 2}')
    g, k, v, b = min(near)
    print(f'  closest approach: {k} = {v} against the digest token {b:g}, {g:.1f} tolerances away')
    for x in bad:
        print(f'  COLLISION {x}')
    for p in pairs:
        print(f'  PAIR {p}')
    if len(published) < 50 or len(fields) != 18:
        print('  GATE REFUSES: it examined too little to have checked anything')
        return 2
    print(f'  collisions with the digest: {len(bad)}; graded pairs sharing a value: {len(pairs)}')
    return 1 if (bad or pairs) else 0


sys.exit(main())
