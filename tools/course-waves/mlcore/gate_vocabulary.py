#!/usr/bin/env python3
"""GATE: the words digest section 26 legislates, over everything a learner reads.

  * no P label (P10, P50, P90 and the like) anywhere: a probability here is
    the logistic probability of PAY = 1 for a row, and the programme's P
    vocabulary belongs to distributions of outcomes.
  * no claim of artificial intelligence: "AI", "AI-powered" or "artificial
    intelligence" never describes a model in this course, which is named by
    its method: least squares, ridge or logistic regression (owner copy rule).
  * REPORTED FOR A HUMAN READ, never failed, because each is a judgement:
    "Monte Carlo" (owned by the uncertainty course), "outlier" (owned by D1),
    "cluster" (owned by D3), "standard deviation" (the rule is that its divisor
    is named nearby) and "R-squared" (the rule is that its reference is
    named).

SWEPT: the digest (EXCEPT section 26, whose table has to name the words it
legislates), the lab, the three panels, their shared bits and the learning
page, every lesson body and manifest title under the course directory, and
every bank JSON under the wave's banks directory. Markdown is unwrapped before
matching, so a word split across a hard wrap is still read.

REFUSALS. Exit 2 when the digest or an app source is missing, or when fewer
than 500 lines were read.

    python3 gate_vocabulary.py [--plant]

--plant is THE NEGATIVE CONTROL: it plants one "P90" and one "AI-powered" in
the digest text in memory and must exit 1 with both caught.

Exit 0 clean, 1 a breach, 2 could not run.
"""
import json
import os
import re
import sys

HERE = os.environ.get('D2_WAVE_DIR', os.path.dirname(os.path.abspath(__file__)))
REPO = os.environ.get('D2_REPO', '/root/wt-dai-d2-nextgen')
COURSE = os.environ.get('D2_COURSE', os.path.join(REPO, 'src/content/courses/mlcore'))
APP = [os.path.join(REPO, 'src/components/course/panels/mlcore', f) for f in
       ('FitExplorer.jsx', 'ValidateExplorer.jsx', 'DiagnoseExplorer.jsx', 'panelBits.jsx', 'mlcoreLab.js')] + \
      [os.path.join(REPO, 'src/pages/apps/MlCoreLearningPage.jsx')]

RULES = [
    ('a P label', re.compile(r'\bP(?:5|10|50|90|95)\b')),
    ('an AI claim', re.compile(r'\bAI\b|AI-powered|artificial intelligence', re.I)),
]
REPORT = [
    ('Monte Carlo', re.compile(r'Monte Carlo', re.I)),
    ('outlier', re.compile(r'\boutlier', re.I)),
    ('cluster', re.compile(r'\bcluster', re.I)),
    ('standard deviation', re.compile(r'standard deviation', re.I)),
    ('R-squared', re.compile(r'R-squared', re.I)),
]


# The academy MODULE is named "Data & AI" (src/lib/academyModules.js). That is
# a name, not a claim about a method, and it is blanked by exact string. A DEAD
# exemption fails the gate.
EXEMPT = ['Data & AI']


def unwrap(text):
    return re.sub(r'(?<!\n)\n(?!\n|#|\||\s*[-*]|\s*\d+\.)', ' ', text)


def main():
    dpath = os.path.join(HERE, 'digest.txt')
    if not os.path.exists(dpath):
        print('  GATE REFUSES: no digest.txt')
        return 2
    digest = open(dpath, encoding='utf-8').read()
    if '--plant' in sys.argv:
        # Planted BEFORE the first section, because section 26 is the last
        # section and is exempt: a plant appended to the end would be swept by
        # nothing and the control could not fire.
        digest = 'The P90 of the gamma ray, from an AI-powered check.\n' + digest
    # Section 26 names the words it legislates; it is not swept.
    parts = re.split(r'(?m)^(?=# SECTION \d+:)', digest)
    kept = [p for p in parts if not re.match(r'# SECTION \d+: Vocabulary', p)]
    if len(kept) != len(parts) - 1:
        print('  GATE REFUSES: the vocabulary section could not be found to exempt it')
        return 2
    texts = [('digest.txt (section 32 excepted)', ''.join(kept))]
    for p in APP:
        if not os.path.exists(p):
            print(f'  GATE REFUSES: the learner-facing source {p} is missing')
            return 2
        texts.append((os.path.relpath(p, REPO), open(p, encoding='utf-8').read()))
    lessons = 0
    if os.path.isdir(COURSE):
        for root, _, names in os.walk(COURSE):
            for n in sorted(names):
                p = os.path.join(root, n)
                if n.endswith('.md'):
                    lessons += 1
                    texts.append((os.path.relpath(p, COURSE), open(p, encoding='utf-8').read()))
                elif n == 'manifest.json':
                    m = json.load(open(p))
                    texts.append((os.path.relpath(p, COURSE), '\n'.join(
                        [mm['title'] for mm in m['modules']] + [l['title'] for mm in m['modules'] for l in mm['lessons']])))
    banks = os.path.join(HERE, 'banks')
    nb = 0
    if os.path.isdir(banks):
        for n in sorted(os.listdir(banks)):
            if n.endswith('.json'):
                qs = json.load(open(os.path.join(banks, n)))
                for q in (qs if isinstance(qs, list) else qs.get('questions', [])):
                    nb += 1
                    texts.append((f'banks/{n}', '\n'.join([q.get('prompt', ''), q.get('explanation', '')] + q.get('options', []))))
    lines = sum(t.count('\n') + 1 for _, t in texts)
    breaches, reports = [], {name: 0 for name, _ in REPORT}
    hit = set()
    for label, t in texts:
        u = unwrap(t)
        for e in EXEMPT:
            if e in u:
                hit.add(e)
                u = u.replace(e, ' ' * len(e))
        for name, rx in RULES:
            for m in rx.finditer(u):
                breaches.append((name, label, u[max(0, m.start() - 50):m.end() + 40].replace('\n', ' ')))
        for name, rx in REPORT:
            reports[name] += len(rx.findall(u))
    print(f'  sources swept: {len(texts)} (app sources {len(APP)}, lesson files {lessons}, bank questions {nb}); lines {lines}')
    print(f'  reported for a human read, never failed: {reports}')
    print(f'  BREACHES: {len(breaches)}')
    for name, label, ctx in breaches[:40]:
        print(f'   {name}: {label}: ...{ctx}...')
    dead = sorted(set(EXEMPT) - hit)
    print(f'  exemptions declared: {len(EXEMPT)}, dead: {dead}')
    if lines < 500:
        print('  GATE REFUSES: it examined too little to have checked anything')
        return 2
    if '--plant' in sys.argv:
        got = sorted({b[0] for b in breaches if b[1].startswith('digest')})
        print(f'  NEGATIVE CONTROL: expected a P label and an AI claim caught; got {got}')
        return 1 if got == ['a P label', 'an AI claim'] else 2
    return 1 if (breaches or dead) else 0


sys.exit(main())
