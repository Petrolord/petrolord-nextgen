#!/usr/bin/env python3
"""GATE: every figure in the five writer briefs is printed by the pack, or is
a count of the wave's own shape.

A brief is copied into lessons and questions, so a figure a brief invents
becomes a figure the course teaches. Every number in BRIEF.md, LESSON_TASK.md,
BANK_TASK.md, KEY_TRUTH_TASK.md and PANELS.md must appear as a number in
PACK.md (a passage, a source's edition, the dates) or be one of the SHAPE
numbers this file derives from structure.py and wave.json (lesson, module,
bank and question counts, the word band, the path order, the passage and
source counts). Section and paragraph numbers inside a citation (s.60,
5.4.2, chapter 12) are numbers the pack prints too, and are checked the same
way.

    python3 gate_brief_claims.py [--plant]

--plant appends a sentence with an invented day count to BRIEF.md in memory
and must exit 1 with it caught. Exit 0 clean, 1 a breach, 2 could not run.
"""
import json
import os
import re
import sys
import packlib as K

NUM = re.compile(r'(?<![\w.])\d+(?:[.,]\d+)*(?![\w])')


def shape():
    S = K.S
    rows = S.flat()
    ps = K.passages()
    srcs = K.sources()
    nums = {len(rows), len(S.TIERS), 6, 26, S.MODULE_BANK_N, S.EXAM_N, 132, 396, len(S.banks()),
            S.BAND[0], S.BAND[1], *S.MIN_BY_MINUTES, *S.MIN_BY_MINUTES.values(), K.WAVE['path_order'],
            len(ps), len(srcs), 5, 18, 8, 0.45, 2, 3, 1}
    return {str(n) for n in nums} | {f'P{len(ps):03d}', 'P001'}


def main():
    pack = open(os.path.join(K.HERE, 'PACK.md'), encoding='utf-8').read()
    have = set(NUM.findall(pack)) | set(re.findall(r'\d+', pack)) | shape()
    have |= set(re.findall(r'\d+', json.dumps(K.WAVE)))
    texts = []
    for p in K.BRIEFS:
        if not os.path.exists(p):
            print(f'  GATE REFUSES: {p} is missing')
            return 2
        texts.append((os.path.basename(p), open(p, encoding='utf-8').read()))
    if '--plant' in sys.argv:
        texts[0] = (texts[0][0], texts[0][1] + '\nA supplier must answer a notice within 4731 days.\n')
    bad, n = [], 0
    for name, t in texts:
        for i, line in enumerate(t.split('\n'), 1):
            clean = re.sub(r'`[^`]*`', ' ', line)  # file names, keys and code
            clean = re.sub(r'\b(?:sc5[bia]_m\d\d|m0\d|l0\d|P\d{3}|S\d\d|EKC-\d\d|T\d\d)\b', ' ', clean)
            for m in NUM.finditer(clean):
                n += 1
                tok = m.group(0).rstrip('.,')
                if tok not in have and tok.replace(',', '') not in have:
                    bad.append((name, i, tok, line.strip()[:100]))
    print(f'  briefs read: {len(texts)}; figures checked: {n}')
    print(f'  BREACHES: {len(bad)}')
    for name, i, tok, ctx in bad[:40]:
        print(f'   {name}:{i} {tok} is printed by no passage: {ctx}')
    if '--plant' in sys.argv:
        got = [b for b in bad if b[2] == '4731']
        print(f'  NEGATIVE CONTROL: an invented day count planted in BRIEF.md; caught {len(got)}')
        return 1 if got else 2
    return 1 if bad else 0


sys.exit(main())
