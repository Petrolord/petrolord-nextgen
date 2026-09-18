#!/usr/bin/env python3
"""GATE: no graded value collides with a number the digest prints, or with
another graded value.

This is the rule the go-live migration of every course in this programme
enforces in SQL (gen_golive.py, FC6): every token the digest prints that reads
as a number, taken by the regex -?\\d+\\.?\\d* and made absolute, is a published
figure, and a graded field within its own tolerance of one is a lookup rather
than a calculation. Dates count: 2026-11-30 prints the tokens 2026, 11 and 30,
so no graded integer may be a day of the month, a month or a year the digest
names. Graded fields here are integers at tolerance 0, so a collision is
equality of absolute values.

It also refuses two graded fields with the same absolute value, because the
kit's pairwise collisions.py skips a tolerance of 0 and would examine nothing.

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
        fields[0][2] = 46  # a day count the digest prints
    bad = []
    for tier, key, val, tol in fields:
        for d in published:
            if abs(abs(val) - d) <= tol:
                bad.append(f'{tier}.{key} = {val} is within {tol} of {d:g}, which the digest prints')
    pairs = []
    for i, (ta, ka, va, tola) in enumerate(fields):
        for tb, kb, vb, tolb in fields[i + 1:]:
            if abs(abs(va) - abs(vb)) <= max(tola, tolb):
                pairs.append(f'{ta}.{ka} = {va} and {tb}.{kb} = {vb}')
    print(f'  digest number tokens swept: {len(published)} distinct absolute values')
    print(f'  graded fields swept: {len(fields)}; pairs compared: {len(fields) * (len(fields) - 1) // 2}')
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
