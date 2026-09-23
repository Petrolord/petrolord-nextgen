#!/usr/bin/env python3
"""GATE: the words digest section 32 legislates, over everything a learner reads.

  * no P label (P10, P50, P90 and the like) anywhere: a quantile here is named
    by its probability and its rule (R6, R7 or R8), and the programme's P
    vocabulary belongs to distributions of outcomes, where the exceedance and
    non-exceedance conventions differ.
  * no claim of artificial intelligence: "AI", "AI-powered" or "artificial
    intelligence" never describes a method in this course, which is stated
    statistics (owner copy rule: no AI claim unless a model genuinely runs).
  * REPORTED FOR A HUMAN READ, never failed, because each is a judgement:
    "machine learning" (allowed when it names the D2 course), "u-chart" and
    "Poisson" (owned by the safety statistics course; a seam mention is
    allowed), and bare "sigma" (the rule is that its source is named nearby).

SWEPT: the digest (EXCEPT section 32, whose table has to name the words it
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

HERE = os.environ.get('D1_WAVE_DIR', os.path.dirname(os.path.abspath(__file__)))
REPO = os.environ.get('D1_REPO', '/root/wt-dai-d1-nextgen')
COURSE = os.environ.get('D1_COURSE', os.path.join(REPO, 'src/content/courses/dataqc'))
APP = [os.path.join(REPO, 'src/components/course/panels/dataqc', f) for f in
       ('ChecksExplorer.jsx', 'OutliersExplorer.jsx', 'MonitorExplorer.jsx', 'panelBits.jsx', 'dataqcLab.js')] + \
      [os.path.join(REPO, 'src/pages/apps/DataQcLearningPage.jsx')]

RULES = [
    ('a P label', re.compile(r'\bP(?:5|10|50|90|95)\b')),
    ('an AI claim', re.compile(r'\bAI\b|AI-powered|artificial intelligence', re.I)),
]
REPORT = [
    ('machine learning', re.compile(r'machine learning', re.I)),
    ('u-chart', re.compile(r'\bu-chart', re.I)),
    ('Poisson', re.compile(r'\bPoisson\b')),
    ('bare sigma', re.compile(r'\bsigma\b(?!\s*(?:=|units|from|,? the|MRbar|of phase|\())', re.I)),
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
        # Planted BEFORE the first section, because section 32 is the last
        # section and is exempt: a plant appended to the end would be swept by
        # nothing and the control could not fire.
        digest = 'The P90 of the gamma ray, from an AI-powered check.\n' + digest
    # Section 32 names the words it legislates; it is not swept.
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
