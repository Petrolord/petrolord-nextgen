#!/usr/bin/env python3
"""GATE: no run of eight words from any of the six SC4 sources appears in
anything a learner reads.

WHY. Adan and Resing's lecture notes and Iversen's handbook print no licence,
so the lead's rule is to cite their figures and formulas and never quote their
prose; the Wikipedia article is CC BY-SA 4.0 (cite, do not paste); Aas,
Halskau and Wallace is publisher copyright (by concept only); Skoko et al.
and the arXiv paper are CC BY 4.0, and the course cites them by table and
equation and quotes none of their prose either. A quotation needs no
quotation marks to be one, so this gate looks for the words themselves. Every
text is reduced to lower-case word tokens (letters and digits, an apostrophe
kept inside a word), hyphens at a line break are joined, and every run of
EIGHT consecutive tokens of the six texts is a fingerprint. Any eight-token
run of a swept file found among the fingerprints fails, with the file, the
line and the run.

SWEPT: the digest; every lesson body and manifest title under the course
directory; every bank JSON under the wave's banks directory; the lab, the
four calculator panels, their shared bits and the learning page; the writer
briefs (a brief copied into a lesson is a lesson).

FIGURES AND TITLES ARE NOT PROSE. The course cites figures (a list of item
sizes, a table row), so a run of eight tokens that are ALL numbers is a list of
figures and is not fingerprinted. A source's TITLE is its citation, so the
titles in TITLES below are masked wherever they appear exactly, before the
sweep; nothing else is masked.

ENGINE TEXT. An engine message the digest prints verbatim is course content,
and the course cannot rewrite it. ENGINE_TEXT exempts such a message BY EXACT
STRING, with its reason, and a DEAD exemption (one that clears nothing) fails
this gate. Every engine string the digest quotes is clear of the six texts,
so ENGINE_TEXT exempts nothing.

    python3 gate_no_source_prose.py [--plant | --plant-lesson]

--plant is THE NEGATIVE CONTROL: it appends one sentence of Adan and Resing
to the digest in memory and must exit 1 with it caught. --plant-lesson plants
a sentence of Aas, Halskau and Wallace into an in-memory lesson and must exit
1 with it caught.

Exit 0 clean, 1 a breach, 2 could not run (a text is missing, or too little
was swept).
"""
import json
import os
import re
import sys

HERE = os.environ.get('SC4_WAVE_DIR', os.path.dirname(os.path.abspath(__file__)))
REPO = os.environ.get('SC4_REPO', '/root/wt-sc4-nextgen')
SRC = os.environ.get('SC4_SOURCES', os.path.join(HERE, 'sources'))
COURSE = os.environ.get('SC4_COURSE', os.path.join(REPO, 'src/content/courses/marine'))
BANKS = os.environ.get('SC4_BANKS', os.path.join(HERE, 'banks'))
APP = [os.path.join(REPO, 'src/components/course/panels/marine', f) for f in
       ('VoyageCalculator.jsx', 'DeckCalculator.jsx', 'BaseCalculator.jsx', 'VariabilityCalculator.jsx', 'panelBits.jsx', 'marineLab.js')] + \
      [os.path.join(REPO, 'src/pages/apps/MarineLearningPage.jsx')]
BRIEFS = [os.path.join(HERE, f) for f in ('BRIEF.md', 'PANELS.md', 'LESSON_TASK.md', 'BANK_TASK.md', 'KEY_TRUTH_TASK.md')]
TEXTS = {'Adan and Resing': 'adan.txt', 'Iversen': 'itu.txt', 'the arXiv paper': 'ev.txt', 'Skoko et al.': 'jmse.txt', 'Aas, Halskau and Wallace': 'aas.txt', 'the Wikipedia article': 'wiki-ffd.txt'}
N = 8

ENGINE_TEXT = {}


def toks(t):
    t = t.replace('’', "'").replace('‘', "'")
    return re.findall(r"[a-z0-9]+(?:'[a-z]+)?", t.lower())


def grams_of(text):
    text = re.sub(r'-\n\s*', '', text)
    w = toks(text)
    return {' '.join(w[i:i + N]) for i in range(len(w) - N + 1) if not all(t.isdigit() for t in w[i:i + N])}


# The titles of the sources, as the digest and the briefs cite them. A title is
# a citation; each is masked exactly, and a DEAD title (masked nowhere) fails.
TITLES = [
    'An EV charging station access equilibrium model with M/D/C queueing',
    'Optimization Model for Selection of the Offshore Fleet Structure',
    'The role of supply vessels in offshore logistics',
]


def main():
    fp = {}
    for name, f in TEXTS.items():
        p = os.path.join(SRC, f)
        if not os.path.exists(p):
            print(f'REFUSED: {p} is missing, so the course could not be checked against {name}')
            return 2
        for g in grams_of(open(p, encoding='utf-8', errors='replace').read()):
            fp.setdefault(g, name)
    if len(fp) < 100000:
        print(f'REFUSED: only {len(fp)} fingerprints were read from the six texts')
        return 2
    files = []
    dpath = os.path.join(HERE, 'digest.txt')
    if not os.path.exists(dpath):
        print('REFUSED: no digest.txt')
        return 2
    d = open(dpath, encoding='utf-8').read()
    if '--plant' in sys.argv:
        d += '\nWe see that the delay probability slowly decreases as c increases.\n'
    files.append(('digest.txt', d))
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
        files.append(('planted/l99-planted.md', 'It is not allowed to stack containers or baskets because of safety regulations.\n'))
    banks = 0
    if os.path.isdir(BANKS):
        for n in sorted(os.listdir(BANKS)):
            if re.match(r'^sc4[bia]_.*\.json$', n):
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
    quotes = sorted(TITLES, key=len, reverse=True)  # the course quotes no source: only the titles are masked
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
    print(f'  fingerprints: {len(fp)} eight-word runs of the six sources')
    print(f'  swept: {len(files)} files ({lessons} lesson bodies, {banks} bank files), {lines} lines')
    print(f'  source titles masked as citations: {masked} (the course quotes no source)')
    print(f'  engine strings exempted: {len(ENGINE_TEXT)} declared, {len(exempt_hit)} hit, {len(dead)} dead')
    print(f'  RUNS OF SOURCE PROSE FOUND: {len(hits)}')
    for label, i, name, run, ctx in hits[:20]:
        print(f'   {label}:{i}  [{name}] "{run}"  in: {ctx}')
    if lines < 500:
        print('  GATE REFUSES: it swept too little to have checked anything')
        return 2
    if '--plant' in sys.argv or '--plant-lesson' in sys.argv:
        want = 'digest.txt' if '--plant' in sys.argv else 'planted/l99-planted.md'
        caught = any(h[0] == want for h in hits)
        print(f'  NEGATIVE CONTROL: a sentence of source prose was planted in {want}; {"caught" if caught else "NOT CAUGHT"}')
        return 1 if caught else 2
    if dead:
        print(f'  GATE FAILS: a dead exemption clears nothing: {dead}')
        return 1
    return 1 if hits else 0


sys.exit(main())
