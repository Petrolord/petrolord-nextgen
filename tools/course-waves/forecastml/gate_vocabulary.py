#!/usr/bin/env python3
"""GATE: the words digest section 25 legislates, over everything a learner reads.

  * P LABELS ONLY IN THE EXCEEDANCE MEANING. This course has a distribution
    of outcomes (the bootstrap paths), and the platform convention is binding:
    P90 is the LOW case (the 10th percentile of the paths) and P10 the HIGH
    case. A sentence that equates P90 with the 90th percentile or the high
    case, or P10 with the 10th percentile or the low case, fails; so does any
    P label the engine does not print (P5, P95 and the like).
  * no claim of artificial intelligence: "AI", "AI-powered" or "artificial
    intelligence" never describes a method in this course, which is named by
    what it is: exponential smoothing, a residual bootstrap, a least-squares
    Arps fit (owner copy rule).
  * REPORTED FOR A HUMAN READ, never failed, because each is a judgement:
    "Monte Carlo" (owned by the uncertainty course), "regression" (owned by
    D2, and the Arps fit's linearised least squares), "confidence interval"
    and "prediction interval" (the course's intervals are bootstrap
    percentiles, named as such), "EUR" (owned by dca), "accuracy" (the rule is
    that its metric and months are named) and "trend" (the rule is that it is
    the smoothed state b).

SWEPT: the digest (EXCEPT section 25, whose table has to name the words it
legislates), the lab, the three panels, their shared bits and the learning
page, every lesson body and manifest title under the course directory, and
every bank JSON under the wave's banks directory. Markdown is unwrapped before
matching, so a word split across a hard wrap is still read.

REFUSALS. Exit 2 when the digest or an app source is missing, or when fewer
than 500 lines were read.

    python3 gate_vocabulary.py [--plant]

--plant is THE NEGATIVE CONTROL: it plants one "P90 is the 90th percentile" and
one "AI-powered" in the digest text in memory and must exit 1 with both caught.

Exit 0 clean, 1 a breach, 2 could not run.
"""
import json
import os
import re
import sys

HERE = os.environ.get('D4_WAVE_DIR', os.path.dirname(os.path.abspath(__file__)))
REPO = os.environ.get('D4_REPO', '/root/wt-dai-d4-nextgen')
COURSE = os.environ.get('D4_COURSE', os.path.join(REPO, 'src/content/courses/forecastml'))
APP = [os.path.join(REPO, 'src/components/course/panels/forecastml', f) for f in
       ('SmoothingExplorer.jsx', 'BacktestExplorer.jsx', 'UncertaintyExplorer.jsx', 'panelBits.jsx', 'forecastLab.js')] + \
      [os.path.join(REPO, 'src/pages/apps/ForecastmlLearningPage.jsx')]

RULES = [
    ('a P label in the wrong meaning', re.compile(
        r'\bP90\s+(?:is|=|means|equals)\s+(?:the\s+)?(?:90th|high)'
        r'|\bP10\s+(?:is|=|means|equals)\s+(?:the\s+)?(?:10th|low)'
        r'|\bP90\s*\(\s*high|\bP10\s*\(\s*low'
        r'|90th percentile\s*\(\s*P90|10th percentile\s*\(\s*P10', re.I)),
    ('a P label the engine does not print', re.compile(r'\bP(?:1|5|25|75|95|99)\b')),
    ('an AI claim', re.compile(r'\bAI\b|AI-powered|artificial intelligence', re.I)),
]
REPORT = [
    ('Monte Carlo', re.compile(r'Monte Carlo', re.I)),
    ('regression', re.compile(r'\bregress', re.I)),
    ('confidence interval', re.compile(r'confidence interval', re.I)),
    ('prediction interval', re.compile(r'prediction interval', re.I)),
    ('EUR', re.compile(r'\bEUR\b')),
    ('accuracy', re.compile(r'\baccuracy', re.I)),
    ('trend', re.compile(r'\btrend', re.I)),
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
        # Planted BEFORE the first section, because section 25 is the last
        # section and is exempt: a plant appended to the end would be swept by
        # nothing and the control could not fire.
        digest = 'The P90 is the 90th percentile, from an AI-powered check.\n' + digest
    # Section 25 names the words it legislates; it is not swept.
    parts = re.split(r'(?m)^(?=# SECTION \d+:)', digest)
    kept = [p for p in parts if not re.match(r'# SECTION \d+: Vocabulary', p)]
    if len(kept) != len(parts) - 1:
        print('  GATE REFUSES: the vocabulary section could not be found to exempt it')
        return 2
    texts = [('digest.txt (section 25 excepted)', ''.join(kept))]
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
        print(f'  NEGATIVE CONTROL: expected a wrong-meaning P label and an AI claim caught; got {got}')
        return 1 if got == ['a P label in the wrong meaning', 'an AI claim'] else 2
    return 1 if (breaches or dead) else 0


sys.exit(main())
