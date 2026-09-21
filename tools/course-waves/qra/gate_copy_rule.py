#!/usr/bin/env python3
"""GATE: the owner copy rule, over everything a learner reads.

No em dashes, no en dashes, and no "X, not Y" or "X and not Y" contrastive, in
the digest, in any lesson body or manifest title, in every bank prompt, option
and explanation, and in the three H5 panels, their shared bits
and the learning page (the text a learner reads in the app). Headings included.

The digest is swept because every lesson is written from it, so a contrastive
in the digest becomes a contrastive in a lesson. structure.py is NOT swept for
prose: its own gate lines have to contain the characters this gate looks for.

ENGINE TEXT. Three engine strings the digest quotes carry a ", not": the
branch-sum refusal, the fraction refusal and the F-N boundary basis. They are
exempted BY EXACT FRAGMENT below as the engine's own words. An exemption added there is BY EXACT
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
REPO = os.environ.get('H5_REPO', '/root/wt-h5-nextgen')
COURSE = os.environ.get('H5_COURSE', os.path.join(REPO, 'src/content/courses/qra'))
APP_TEXT = [os.path.join(REPO, 'src/components/course/panels/qra', f) for f in
            ('EventTreeExplorer.jsx', 'SocietalExplorer.jsx', 'AlarpExplorer.jsx', 'panelBits.jsx', 'qraLab.js')] + \
           [os.path.join(REPO, 'src/pages/apps/QraLearningPage.jsx')]
DASHES = re.compile('[—–]')
# ", not Y" and "X and not Y" are both the owner's contrastive.
CONTRASTIVE = re.compile(r',\s+not\s+\w|\band not\b', re.I)

ENGINE_TEXT = {
    # the engine's branch-sum refusal, whatever sum it prints
    'not 1 (tolerance 1e-9)': 'eventTree and flammableReleaseEventTree refusal message',
    # pbFatalityFractions refuses a period and a fraction together
    "or fractionIndoors, not both": 'pbFatalityFractions refusal message',
    # fnCriterionComparison basis.boundary
    '(AT_LINE / TOUCHES), not above it': 'fnCriterionComparison basis string',
}


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
        d += '\nThe individual risk, not the PLL \u2014 always.\n'
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
    bank_texts = 0
    bdir = os.path.join(HERE, 'banks')
    if os.path.isdir(bdir):
        for n in sorted(os.listdir(bdir)):
            if not n.endswith('.json'):
                continue
            qs = json.load(open(os.path.join(bdir, n)))
            for k, q in enumerate(qs if isinstance(qs, list) else qs.get('questions', [])):
                for t in [q.get('prompt'), q.get('explanation')] + list(q.get('options') or []):
                    if isinstance(t, str):
                        bank_texts += 1
                        findings += sweep(f'banks/{n}#{k}', t)
                        lines += 1
    exempt = [f for f in findings if f[4]]
    bad = [f for f in findings if not f[4]]
    hit = sorted({f[4] for f in exempt})
    dead = sorted(set(ENGINE_TEXT) - set(hit))
    print(f'  files examined: {files}  (app sources: {app_files}, lesson bodies: {lesson_files}, lesson files on disk: {on_disk}), bank texts: {bank_texts}')
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
