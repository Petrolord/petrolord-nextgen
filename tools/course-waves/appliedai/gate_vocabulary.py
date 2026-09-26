#!/usr/bin/env python3
"""GATE: the words digest section 24 legislates, over everything a learner reads.

  * NO P LABEL. This course has no distribution of outcomes: its only
    intervals are bootstrap percentiles of a STATISTIC, which the engine labels
    as parameter percentiles ("2.5th percentile of the bootstrap mean"). The
    platform keeps P10, P50 and P90 for outcomes, so any P label fails.
  * NO CLAIM THAT A MODEL OR "AI" DOES THE SCORING. "AI" and "language model"
    may name the system being evaluated, which is this course's subject; they
    never name a method this engine runs, because it runs none. "AI-powered",
    "artificial intelligence" and a sentence in which AI, a language model, an
    LLM or "the model" scores, grades, judges, ranks, checks or computes, fail
    (owner copy rule).
  * GROUNDED IS NEVER TRUE. A sentence that equates grounded or supported with
    true or correct fails: the digest teaches that a supported claim is found
    in a cited passage and says nothing of its truth.
  * A SCORE IS NEVER A PROBABILITY. A sentence calling a BM25 score or a
    TF-IDF cosine a probability fails.
  * REPORTED FOR A HUMAN READ, never failed, because each is a judgement:
    "hallucination" (the rule is that it names an unsupported claim and its
    reason), "accuracy" (the rule is that its denominator is named),
    "confidence interval" and "p-value" (the course's interval is a bootstrap
    percentile and its share at or below 0 is not a p-value), "semantic" and
    "embedding" (no dense retrieval is built), and "LLM".

SWEPT: the digest (EXCEPT section 24, whose table has to name the words it
legislates), the lab, the three panels, their shared bits and the learning
page, every lesson body and manifest title under the course directory, and
every bank JSON under the wave's banks directory. Markdown is unwrapped before
matching, so a word split across a hard wrap is still read.

REFUSALS. Exit 2 when the digest or an app source is missing, or when fewer
than 500 lines were read.

    python3 gate_vocabulary.py [--plant]

--plant is THE NEGATIVE CONTROL: it plants one P label on a bootstrap bound and
one "AI-powered" in the digest text in memory and must exit 1 with both caught.

Exit 0 clean, 1 a breach, 2 could not run.
"""
import json
import os
import re
import sys

HERE = os.environ.get('D5_WAVE_DIR', os.path.dirname(os.path.abspath(__file__)))
REPO = os.environ.get('D5_REPO', '/root/wt-dai-d5-nextgen')
COURSE = os.environ.get('D5_COURSE', os.path.join(REPO, 'src/content/courses/appliedai'))
APP = [os.path.join(REPO, 'src/components/course/panels/appliedai', f) for f in
       ('RetrievalExplorer.jsx', 'ScoringExplorer.jsx', 'TrustExplorer.jsx', 'panelBits.jsx', 'evaluateLab.js')] + \
      [os.path.join(REPO, 'src/pages/apps/AppliedaiLearningPage.jsx')]

RULES = [
    ('a P label', re.compile(r'(?<![-\w])P(?:1|5|10|25|50|75|90|95|99)\b')),
    ('an AI or model claim about a method', re.compile(
        r'AI-powered|artificial intelligence'
        r'|\b(?:AI|a language model|the language model|an LLM|the LLM|the model)\s+(?:scores|grades|judges|ranks|checks|computes)\b', re.I)),
    ('grounded read as true', re.compile(
        r'\b(?:grounded|supported)\s+(?:means|is the same as|implies|proves)\s+(?:it is\s+)?(?:true|correct|right)\b', re.I)),
    ('a score called a probability', re.compile(
        r'\b(?:BM25|TF-IDF)\s+(?:score|cosine)s?\s+(?:is|are)\s+(?:a\s+)?probabilit', re.I)),
]
REPORT = [
    ('hallucination', re.compile(r'hallucinat', re.I)),
    ('accuracy', re.compile(r'\baccuracy', re.I)),
    ('confidence interval', re.compile(r'confidence interval', re.I)),
    ('p-value', re.compile(r'p-value', re.I)),
    ('semantic', re.compile(r'\bsemantic', re.I)),
    ('embedding', re.compile(r'\bembedd', re.I)),
    ('LLM', re.compile(r'\bLLMs?\b')),
]


# The academy MODULE is named "Data & AI" (src/lib/academyModules.js) and the
# course is named "Applied AI and Language Models" (the lead's title). Those
# are names, not claims about a method, and each is blanked by exact string. A
# DEAD exemption fails the gate.
EXEMPT = ['Applied AI and Language Models']


def unwrap(text):
    return re.sub(r'(?<!\n)\n(?!\n|#|\||\s*[-*]|\s*\d+\.)', ' ', text)


def main():
    dpath = os.path.join(HERE, 'digest.txt')
    if not os.path.exists(dpath):
        print('  GATE REFUSES: no digest.txt')
        return 2
    digest = open(dpath, encoding='utf-8').read()
    if '--plant' in sys.argv:
        # Planted BEFORE the first section, because section 24 is the last
        # section and is exempt: a plant appended to the end would be swept by
        # nothing and the control could not fire.
        digest = 'The P90 of the bootstrap mean comes from an AI-powered check.\n' + digest
    # Section 24 names the words it legislates; it is not swept.
    parts = re.split(r'(?m)^(?=# SECTION \d+:)', digest)
    kept = [p for p in parts if not re.match(r'# SECTION \d+: Vocabulary', p)]
    if len(kept) != len(parts) - 1:
        print('  GATE REFUSES: the vocabulary section could not be found to exempt it')
        return 2
    texts = [('digest.txt (section 24 excepted)', ''.join(kept))]
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
        return 1 if got == ['a P label', 'an AI or model claim about a method'] else 2
    return 1 if (breaches or dead) else 0


sys.exit(main())
