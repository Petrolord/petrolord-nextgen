#!/usr/bin/env python3
"""GATE: no graded value collides with a number the digest prints, or with
another graded value.

This is the rule the go-live migration of every course in this programme
enforces in SQL (gen_golive.py): every token the digest prints that reads as a
number, taken by the regex -?\\d+\\.?\\d* and made absolute, is a published
figure, and a graded field within its own tolerance of one is a lookup rather
than a calculation. Every graded field here is a four-decimal figure graded at
5e-5, so a collision is a digest token within 5e-5 of a graded value.

It also refuses two graded fields within tolerance of each other, and prints
the nearest digest token to every graded field, so the margin is visible.

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
    published = set()
    for tok in NUM.findall(digest):
        try:
            published.add(abs(float(tok)))
        except ValueError:
            pass
    fields = json.load(open(os.path.join(W, 'fields.json')))
    if '--plant' in sys.argv:
        fields[3][2] = 17.2  # an API the digest prints (Asarama Heavy)
    bad, near = [], []
    pub = sorted(published)
    for tier, key, val, tol in fields:
        d = min(pub, key=lambda p: abs(abs(val) - p))
        near.append(f'  {tier:<13} {key:<34} {val:.4f}: nearest digest token {d:g}, {abs(abs(val) - d) / tol:.3g} tolerances away')
        if abs(abs(val) - d) <= tol:
            bad.append(f'{tier}.{key} = {val} is within {tol} of {d:g}, which the digest prints')
    pairs = []
    for i, (ta, ka, va, tola) in enumerate(fields):
        for tb, kb, vb, tolb in fields[i + 1:]:
            if abs(abs(va) - abs(vb)) <= max(tola, tolb):
                pairs.append(f'{ta}.{ka} = {va} and {tb}.{kb} = {vb}')
    print(f'  digest number tokens swept: {len(published)} distinct absolute values')
    print(f'  graded fields swept: {len(fields)}; pairs compared: {len(fields) * (len(fields) - 1) // 2}')
    for n in near:
        print(n)
    for b in bad:
        print(f'  COLLISION {b}')
    for p in pairs:
        print(f'  PAIR {p}')
    if len(published) < 50 or len(fields) != 18:
        print('  GATE REFUSES: it examined too little to have checked anything')
        return 2
    print(f'  collisions with the digest: {len(bad)}; graded pairs sharing a value: {len(pairs)}')
    return 1 if (bad or pairs) else 0


sys.exit(main())
