#!/usr/bin/env python3
"""GATE: no run of eight words from the MIT OpenCourseWare lectures of ESD.260J
(lectures 7, 8, 11, 12 and 13) appears in anything a learner reads.

WHY. The lectures are licensed CC BY-NC-SA 4.0 (non-commercial) and this
course is sold. The lead's rule: CITE FIGURES BY LECTURE AND SLIDE, NEVER
REPRODUCE A SLIDE OR ITS TEXT. A quotation needs no quotation marks to be one,
so this gate looks for the words themselves. Every text is reduced to
lower-case word tokens (letters and digits, an apostrophe kept inside a word),
hyphens at a line break are joined, and every run of EIGHT consecutive tokens
of the five lecture texts is a fingerprint. Any eight-token run of a swept file
found among the fingerprints fails, with the file, the line and the run.

SWEPT: the digest; the paraphrases in concepts.json; every lesson body and
manifest title under the course directory; every bank JSON under the wave's
banks directory; the lab, the three calculator panels, their shared bits and
the learning page; the writer briefs (a brief copied into a lesson is a
lesson).

A PUBLIC QUOTATION IS NOT LICENSED PROSE. Every quotation in concepts.json
(Harris 1913 and MIL-HDBK-338B, public domain, verified by quote_check.py) is
masked wherever it appears exactly, before the sweep; nothing else is masked.

ENGINE TEXT. An engine message the digest prints verbatim is course content,
and the course cannot rewrite it. ENGINE_TEXT exempts such a message BY EXACT
STRING, with its reason, and a DEAD exemption (one that clears nothing) fails
this gate. It exempts nothing today.

    python3 gate_no_ocw_prose.py [--plant | --plant-lesson]

--plant is THE NEGATIVE CONTROL: it appends one line of lecture 11 slide text
to the digest in memory and must exit 1 with it caught. --plant-lesson plants
a line of lecture 13 slide text into an in-memory lesson and must exit 1 with
it caught.

Exit 0 clean, 1 a breach, 2 could not run (a text is missing, or too little
was swept).
"""
import json
import os
import re
import sys

HERE = os.environ.get('SC3_WAVE_DIR', os.path.dirname(os.path.abspath(__file__)))
REPO = os.environ.get('SC3_REPO', '/root/wt-sc3-nextgen')
SRC = os.environ.get('SC3_SOURCES', os.path.join(HERE, 'sources'))
COURSE = os.environ.get('SC3_COURSE', os.path.join(REPO, 'src/content/courses/materials'))
BANKS = os.environ.get('SC3_BANKS', os.path.join(HERE, 'banks'))
APP = [os.path.join(REPO, 'src/components/course/panels/materials', f) for f in
       ('RegisterCalculator.jsx', 'StockCalculator.jsx', 'SparesCalculator.jsx', 'materialsViews.jsx', 'panelBits.jsx', 'materialsLab.js')] + \
      [os.path.join(REPO, 'src/pages/apps/MaterialsLearningPage.jsx')]
BRIEFS = [os.path.join(HERE, f) for f in ('BRIEF.md', 'PANELS.md', 'LESSON_TASK.md', 'BANK_TASK.md', 'KEY_TRUTH_TASK.md')]
TEXTS = {'ESD.260J lecture 7': 'esd260-lect7.txt', 'ESD.260J lecture 8': 'esd260-lect8.txt', 'ESD.260J lecture 11': 'esd260-lect11.txt',
         'ESD.260J lecture 12': 'esd260-lect12.txt', 'ESD.260J lecture 13': 'esd260-lect13.txt'}
N = 8

ENGINE_TEXT = {}


def toks(t):
    t = t.replace('’', "'").replace('‘', "'")
    return re.findall(r"[a-z0-9]+(?:'[a-z]+)?", t.lower())


def grams_of(text):
    text = re.sub(r'-\n\s*', '', text)
    w = toks(text)
    return {' '.join(w[i:i + N]) for i in range(len(w) - N + 1)}


def main():
    fp = {}
    for name, f in TEXTS.items():
        p = os.path.join(SRC, f)
        if not os.path.exists(p):
            print(f'REFUSED: {p} is missing, so the course could not be checked against {name}')
            return 2
        for g in grams_of(open(p, encoding='utf-8', errors='replace').read()):
            fp.setdefault(g, name)
    if len(fp) < 5000:
        print(f'REFUSED: only {len(fp)} fingerprints were read from the five lecture texts')
        return 2
    files = []
    dpath = os.path.join(HERE, 'digest.txt')
    if not os.path.exists(dpath):
        print('REFUSED: no digest.txt')
        return 2
    d = open(dpath, encoding='utf-8').read()
    if '--plant' in sys.argv:
        d += '\nForecast of demand is 13,000 units a year ~ iid Normal, and the lead time is fixed.\n'
    files.append(('digest.txt', d))
    concepts = json.load(open(os.path.join(HERE, 'concepts.json'), encoding='utf-8'))
    files.append(('concepts.json paraphrases', '\n'.join(c['paraphrase'] for c in concepts)))
    for p in APP + BRIEFS:
        if os.path.exists(p):
            files.append((os.path.relpath(p, REPO if p.startswith(REPO) else HERE), open(p, encoding='utf-8').read()))
        elif p in APP:
            print(f'REFUSED: the learner-facing source {p} is missing')
            return 2
    lessons = 0
    if os.path.isdir(COURSE):
        for root, _, names in os.walk(COURSE):
            for n in sorted(names):
                p = os.path.join(root, n)
                if n.endswith('.md') or n == 'manifest.json':
                    files.append((os.path.relpath(p, COURSE), open(p, encoding='utf-8').read()))
                    lessons += n.endswith('.md')
    if '--plant-lesson' in sys.argv:
        files.append(('planted/l99-planted.md', 'We find the loss function, L(Xi), for each value of X given the cumulative probability.\n'))
    banks = 0
    if os.path.isdir(BANKS):
        for n in sorted(os.listdir(BANKS)):
            if re.match(r'^sc3[bia]_.*\.json$', n):
                strs = []

                def walk(v):
                    if isinstance(v, str):
                        strs.append(v)
                    elif isinstance(v, list):
                        for x in v:
                            walk(x)
                    elif isinstance(v, dict):
                        for x in v.values():
                            walk(x)
                walk(json.load(open(os.path.join(BANKS, n), encoding='utf-8')))
                files.append((n, '\n'.join(strs)))
                banks += 1
    quotes = sorted({re.sub(r'\s*[–—]\s*', ': ', re.sub(r'\s+', ' ', c['quote']).strip()) for c in concepts}, key=len, reverse=True)
    masked = 0
    hits, exempt_hit, lines = [], set(), 0
    for label, text in files:
        for q in quotes:
            if q in text:
                masked += text.count(q)
                text = text.replace(q, ' (a verified public quotation) ')
        for i, line in enumerate(text.split('\n'), 1):
            lines += 1
            g = grams_of(line)
            found = sorted(x for x in g if x in fp)
            if not found:
                continue
            ex = next((k for k in ENGINE_TEXT if k in line), None)
            if ex:
                exempt_hit.add(ex)
                continue
            hits.append((label, i, fp[found[0]], found[0], line.strip()[:120]))
    dead = [k for k in ENGINE_TEXT if k not in exempt_hit]
    print(f'  fingerprints: {len(fp)} eight-word runs of the five ESD.260J lectures')
    print(f'  swept: {len(files)} files ({lessons} lesson bodies, {banks} bank files), {lines} lines')
    print(f'  verified public quotations masked: {masked}')
    print(f'  engine strings exempted: {len(ENGINE_TEXT)} declared, {len(exempt_hit)} hit, {len(dead)} dead')
    print(f'  RUNS OF LICENSED PROSE FOUND: {len(hits)}')
    for label, i, name, run, ctx in hits[:20]:
        print(f'   {label}:{i}  [{name}] "{run}"  in: {ctx}')
    if lines < 500:
        print('  GATE REFUSES: it swept too little to have checked anything')
        return 2
    if '--plant' in sys.argv or '--plant-lesson' in sys.argv:
        want = 'digest.txt' if '--plant' in sys.argv else 'planted/l99-planted.md'
        caught = any(h[0] == want for h in hits)
        print(f'  NEGATIVE CONTROL: a sentence of licensed prose was planted in {want}; {"caught" if caught else "NOT CAUGHT"}')
        return 1 if caught else 2
    if dead:
        print(f'  GATE FAILS: a dead exemption clears nothing: {dead}')
        return 1
    return 1 if hits else 0


sys.exit(main())
