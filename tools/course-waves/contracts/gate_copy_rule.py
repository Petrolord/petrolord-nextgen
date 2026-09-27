#!/usr/bin/env python3
"""GATE: the owner copy rule, over everything a learner reads.

No em dashes, no en dashes, and no "X, not Y" contrastive, nor its cousins
"rather than", ", never", "instead of", "and not" and "and never", in the
pack (PACK.md, every line of it a writer copies from), in any lesson body or
manifest title, in the practice course pages and components, and in every
prompt, option and explanation of the 21 banks. Headings included.

QUOTED LAW. A passage the pack QUOTES is an Act's or a guidance's own words,
and the course cannot rewrite them. Every quoted passage's exact text is
masked wherever it appears (in the pack, a lesson or a bank) before the
sweep; nothing else is masked, and nothing is exempted by pattern.

--plant is THE NEGATIVE CONTROL: it plants a "not" contrastive, an em dash,
an "instead of" and an "and not" in the pack text in memory and must exit 1
with all four caught. --plant-bank plants the same four in one bank string.

REFUSALS. Exit 2 if the pack is missing, if fewer than 300 lines were read, or
if lesson files exist and not one was examined.
"""
import os
import re
import sys
import packlib as K

DASHES = re.compile('[—–]')
CONTRASTIVE = re.compile(r',\s+not\s+\w|\brather than\b|,\s+never\b|\binstead of\b|\band (?:not|never)\b', re.I)
PLANT = '\nThe notice, not the claim — always. Use the register instead of memory, and not the diary.\n'


def sweep(label, text, masks):
    for m in masks:
        if m in text:
            text = text.replace(m, ' ' * len(m))
    out = []
    for i, line in enumerate(text.split('\n'), 1):
        if DASHES.search(line):
            out.append((label, i, 'dash', line.strip()[:110]))
        for _ in CONTRASTIVE.finditer(line):
            out.append((label, i, 'contrastive', line.strip()[:110]))
    return out


def main():
    pack_path = os.path.join(K.HERE, 'PACK.md')
    if not os.path.exists(pack_path):
        print('  GATE REFUSES: no PACK.md')
        return 2
    masks = [p['text'] for p in K.passages() if p['mode'] == 'quote']
    findings, lines, files = [], 0, 0
    pack = open(pack_path, encoding='utf-8').read()
    if '--plant' in sys.argv:
        pack += PLANT
    findings += sweep('PACK.md', pack, masks)
    lines += pack.count('\n') + 1
    files += 1
    lesson_files = on_disk = 0
    for tier, mkey, lkey, title, _t, path, text in K.lessons():
        if text is None:
            continue
        on_disk += 1
        findings += sweep(f'{tier}/{mkey}/{lkey}.md', text, masks)
        lesson_files += 1
        files += 1
        lines += text.count('\n') + 1
    for label, t in K.manifest_titles():
        findings += sweep(label, t, masks)
        files += 1
        lines += t.count('\n') + 1
    for p in K.APP_TEXT:
        if not os.path.exists(p):
            print(f'  GATE REFUSES: the learner-facing source {p} is missing')
            return 2
        t = open(p, encoding='utf-8').read()
        findings += sweep(os.path.relpath(p, K.REPO), t, masks)
        files += 1
        lines += t.count('\n') + 1
    bank = K.bank_strings()
    if '--plant-bank' in sys.argv:
        bank.append(('banks/planted.json Q1', 'A planted bank string.' + PLANT))
    for label, t in bank:
        findings += sweep(label, t, masks)
    print(f'  files examined: {files} (lesson bodies {lesson_files} of {on_disk} on disk, app sources {len(K.APP_TEXT)}); '
          f'lines {lines}; bank strings {len(bank)}; quoted passages masked {len(masks)}')
    print(f'  VIOLATIONS: {len(findings)}')
    for f, i, kind, ctx in findings[:60]:
        print(f'   {kind.upper()} {f}:{i}  {ctx}')
    if lines < 300 or (on_disk and lesson_files == 0):
        print('  GATE REFUSES: it examined too little to have checked anything')
        return 2
    if '--plant-bank' in sys.argv:
        caught = [f for f in findings if f[0] == 'banks/planted.json Q1']
        print(f'  NEGATIVE CONTROL: a not-contrastive, a dash, an instead-of and an and-not were planted in a bank string; caught {len(caught)} of 4')
        return 1 if len(caught) == 4 else 2
    if '--plant' in sys.argv:
        caught = [f for f in findings if f[0] == 'PACK.md' and ('always' in f[3] or 'diary' in f[3])]
        print(f'  NEGATIVE CONTROL: a not-contrastive, a dash, an instead-of and an and-not were planted in the pack; caught {len(caught)} of 4')
        return 1 if len(caught) == 4 else 2
    return 1 if findings else 0


sys.exit(main())
