#!/usr/bin/env python3
"""GATE: the owner copy rule, over everything a learner reads.

No em dashes, no en dashes, and no "X, not Y" contrastive, in the digest, in
any lesson body or manifest title, and in the three D3 panels, their shared bits and the lab
and the learning page (the text a learner reads in the app). Headings included.

The digest is swept because every lesson is written from it, so a contrastive
in the digest becomes a contrastive in a lesson. structure.py is NOT swept for
prose: its own gate lines have to contain the characters this gate looks for.

ENGINE TEXT. Every engine message the digest quotes meets the owner copy rule,
so ENGINE_TEXT below exempts nothing. An exemption added there is BY EXACT
STRING, and a DEAD exemption fails this gate: a row that clears nothing is a
claim about work never done. Every writer brief in this wave says: quote the
message in a blockquote as the engine's own words, and never write a
contrastive of your own.

--plant is THE NEGATIVE CONTROL: it plants a contrastive and an em dash in the
digest text in memory and must exit 1 with both caught.

REFUSALS. Exit 2 if the digest is missing, if fewer than 500 lines were read,
or if the course directory exists with lesson files in it and not one was
examined. A gate that reports success while examining nothing validates
nothing.
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.environ.get('D3_REPO', '/root/wt-dai-d3-nextgen')
COURSE = os.environ.get('D3_COURSE', os.path.join(REPO, 'src/content/courses/facies'))
APP_TEXT = [os.path.join(REPO, 'src/components/course/panels/facies', f) for f in
            ('ClusterExplorer.jsx', 'JudgeExplorer.jsx', 'ClassifyExplorer.jsx', 'panelBits.jsx', 'faciesLab.js')] + \
           [os.path.join(REPO, 'src/pages/apps/FaciesLearningPage.jsx')]
DASHES = re.compile('[—–]')
CONTRASTIVE = re.compile(r',\s+not\s+\w')

ENGINE_TEXT = {}


def sweep(label, text):
    out = []
    for i, line in enumerate(text.split('\n'), 1):
        if DASHES.search(line):
            out.append((label, i, 'dash', line.strip()[:110], None))
        for m in CONTRASTIVE.finditer(line):
            hit = next((k for k in ENGINE_TEXT if k in line), None)
            out.append((label, i, 'contrastive', line.strip()[:110], hit))
    return out


def main():
    digest_path = os.path.join(HERE, 'digest.txt')
    if not os.path.exists(digest_path):
        print('  GATE REFUSES: no digest.txt')
        return 2
    findings, files, lines, lesson_files = [], 0, 0, 0
    d = open(digest_path, encoding='utf-8').read()
    if '--plant' in sys.argv:
        # THE NEGATIVE CONTROL: one contrastive and one em dash, planted in memory.
        d += '\nThe median, not the mean \u2014 always.\n'
    findings += sweep('digest.txt', d)
    files += 1
    lines += d.count('\n') + 1
    app_files = 0
    for p in APP_TEXT:
        if not os.path.exists(p):
            print(f'  GATE REFUSES: the learner-facing source {p} is missing, so it could not be swept')
            return 2
        t = open(p, encoding='utf-8').read()
        findings += sweep(os.path.relpath(p, REPO), t)
        files += 1
        app_files += 1
        lines += t.count('\n') + 1
    on_disk = 0
    if os.path.isdir(COURSE):
        for root, _, names in os.walk(COURSE):
            for n in sorted(names):
                p = os.path.join(root, n)
                if n.endswith('.md'):
                    on_disk += 1
                    t = open(p, encoding='utf-8').read()
                    findings += sweep(os.path.relpath(p, COURSE), t)
                    files += 1
                    lesson_files += 1
                    lines += t.count('\n') + 1
                elif n == 'manifest.json':
                    m = json.load(open(p))
                    titles = [mm['title'] for mm in m.get('modules', [])] + \
                             [l['title'] for mm in m.get('modules', []) for l in mm.get('lessons', [])]
                    findings += sweep(os.path.relpath(p, COURSE), '\n'.join(titles))
                    files += 1
                    lines += len(titles)
    exempt = [f for f in findings if f[4]]
    bad = [f for f in findings if not f[4]]
    hit = sorted({f[4] for f in exempt})
    dead = sorted(set(ENGINE_TEXT) - set(hit))
    print(f'  files examined: {files}  (app sources: {app_files}, lesson bodies: {lesson_files}, lesson files on disk: {on_disk})')
    print(f'  lines and titles examined: {lines}')
    print(f'  exempt engine strings declared: {len(ENGINE_TEXT)}, hit: {len(hit)}, dead: {len(dead)} -> {dead}')
    print(f'  quotations of engine text found: {len(exempt)}')
    print(f'  VIOLATIONS: {len(bad)}')
    for f, i, kind, ctx, _ in bad:
        print(f'   {kind.upper()} {f}:{i}  {ctx}')
    if lines < 500 or (on_disk and lesson_files == 0):
        print('  GATE REFUSES: it examined too little to have checked anything')
        return 2
    if '--plant' in sys.argv:
        caught = len([f for f in bad if f[0] == 'digest.txt'])
        print(f'  NEGATIVE CONTROL: a contrastive and a dash were planted in the digest; expected 2 caught, got {caught}')
        return 1 if caught == 2 else 2
    if dead:
        print('  GATE FAILS: an exempt engine string nothing quotes is a dead row, not an amnesty')
        return 1
    return 1 if bad else 0


sys.exit(main())
