#!/usr/bin/env python3
"""GATE: the owner copy rule, over everything a learner reads.

No em dashes, no en dashes, and no "X, not Y" contrastive, in the digest or in
any lesson body or manifest title. Headings included.

The digest is swept because every lesson is written from it, so a contrastive
in the digest becomes a contrastive in a lesson. structure.py is swept for
TITLES ONLY, because its own gate line has to contain the characters it looks
for and is not learner-facing.

It prints how many files and how many lines it examined.
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
COURSE = '/root/wt-fc4-nextgen/src/content/courses/gasprocessing'
DASHES = re.compile('[—–]')
CONTRASTIVE = re.compile(r',\s+not\s+\w')

def sweep(label, text):
    out = []
    for i, line in enumerate(text.split('\n'), 1):
        if DASHES.search(line):
            out.append((label, i, 'dash', line.strip()[:110]))
        if CONTRASTIVE.search(line):
            out.append((label, i, 'contrastive', line.strip()[:110]))
    return out

def main():
    bad, files, lines = [], 0, 0
    d = open(os.path.join(HERE, 'digest.txt'), encoding='utf-8').read()
    bad += sweep('digest.txt', d); files += 1; lines += d.count('\n') + 1
    for root, _, names in os.walk(COURSE):
        for n in sorted(names):
            p = os.path.join(root, n)
            if n.endswith('.md'):
                t = open(p, encoding='utf-8').read()
                bad += sweep(os.path.relpath(p, COURSE), t); files += 1; lines += t.count('\n') + 1
            elif n == 'manifest.json':
                m = json.load(open(p))
                titles = [mm['title'] for mm in m['modules']] + \
                         [l['title'] for mm in m['modules'] for l in mm['lessons']]
                bad += sweep(os.path.relpath(p, COURSE), '\n'.join(titles))
                files += 1; lines += len(titles)
    print(f'  files examined: {files}')
    print(f'  lines and titles examined: {lines}')
    print(f'  VIOLATIONS: {len(bad)}')
    for f, i, kind, ctx in bad:
        print(f'   {kind.upper()} {f}:{i}  {ctx}')
    if files < 4 or lines < 100:
        print('  GATE REFUSES: it examined too little to have checked anything')
        return 2
    return 1 if bad else 0

sys.exit(main())
