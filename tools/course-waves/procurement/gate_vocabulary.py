"""GATE: the words digest section 25 legislates, over everything a learner reads.

  * P LABELS ARE COST LABELS HERE, READ BY EXCEEDANCE. The course prints P90,
    P50 and P10 of a COST beside the definition from
    lib/conventions/percentile.js, under which the P90 cost is the LOW figure.
    A sentence that makes P90 the high (or P10 the low) figure fails, and so
    does any other P label (P5, P95 and the rest), which this course never
    computes.
  * "LOWEST EVALUATED COST" NAMES THE EVALUATED COST. A sentence equating it
    with the lowest price, the cheapest bid or the lowest quote fails.
  * "MOST ADVANTAGEOUS" NAMES THE HIGHEST COMBINED SCORE. A sentence equating
    it with the cheapest or lowest bid fails.
  * "SHOULD-COST" IS THE COMPANY'S ESTIMATE. A sentence calling it a bid fails.
  * NO "AI" CLAIM. "AI-powered" and "artificial intelligence" fail (owner copy
    rule): every method here is named for what it is.
  * REPORTED FOR A HUMAN READ, never failed, because each is a judgement:
    "cheapest" and "lowest price" (the rule is that a price is named as a price
    and an evaluated cost as an evaluated cost), "local content" (the Act's
    term is Nigerian content), "responsive" (the rule is that it names a bid
    still in the evaluation at that stage), "highest" beside "omission" (the
    uncited option, taught only in Expert m05 in the engine's own words), and
    "confidence".

SWEPT: the digest (EXCEPT section 25, whose table has to name the words it
legislates), the lab, the three calculator panels, their shared bits and the
learning page, every lesson body and manifest title under the course
directory, and every bank JSON under the wave's banks directory. Markdown is
unwrapped before matching, so a word split across a hard wrap is still read.

REFUSALS. Exit 2 when the digest or an app source is missing, or when fewer
than 500 lines were read.

    python3 gate_vocabulary.py [--plant]

--plant is THE NEGATIVE CONTROL: it plants one reversed P label and one
"AI-powered" in the digest text in memory and must exit 1 with both caught.

Exit 0 clean, 1 a breach, 2 could not run.
"""
import json
import os
import re
import sys

HERE = os.environ.get('SC2_WAVE_DIR', os.path.dirname(os.path.abspath(__file__)))
REPO = os.environ.get('SC2_REPO', '/root/wt-sc2-nextgen')
COURSE = os.environ.get('SC2_COURSE', os.path.join(REPO, 'src/content/courses/procurement'))
APP = [os.path.join(REPO, 'src/components/course/panels/procurement', f) for f in
       ('EnvelopeCalculator.jsx', 'AwardCalculator.jsx', 'ContractCalculator.jsx', 'panelBits.jsx', 'tenderLab.js')] + \
      [os.path.join(REPO, 'src/pages/apps/ProcurementLearningPage.jsx')]

RULES = [
    ('a P label this course never computes', re.compile(r'(?<![-\w])P(?:1|5|25|75|95|99)\b')),
    ('a reversed cost P label', re.compile(
        r'\bP90\b[^.]{0,40}\b(?:is|means|as|names)\s+(?:the\s+)?(?:high|highest|upper|worst)\b'
        r'|\bP10\b[^.]{0,40}\b(?:is|means|as|names)\s+(?:the\s+)?(?:low|lowest|lower|best)\b', re.I)),
    ('an AI claim', re.compile(r'AI-powered|artificial intelligence', re.I)),
    ('lowest evaluated cost read as a price', re.compile(
        r'lowest evaluated cost\s+(?:is|means|is the same as)\s+(?:the\s+)?(?:lowest|cheapest)\s+(?:price|bid|quote|quoted)', re.I)),
    ('most advantageous read as cheapest', re.compile(
        r'most advantageous(?:\s+bid)?\s+(?:is|means)\s+(?:always\s+)?(?:the\s+)?(?:cheapest|lowest)', re.I)),
    ('should-cost called a bid', re.compile(r'should-cost\s+(?:is|means)\s+(?:a|the)\s+bid\b', re.I)),
]
REPORT = [
    ('cheapest', re.compile(r'\bcheapest', re.I)),
    ('lowest price', re.compile(r'lowest price', re.I)),
    ('local content', re.compile(r'local content', re.I)),
    ('responsive', re.compile(r'\bresponsive', re.I)),
    ('highest beside omission', re.compile(r'highest[^.]{0,60}omi|omi[^.]{0,60}highest', re.I)),
    ('confidence', re.compile(r'\bconfidence', re.I)),
]


# The course title and the module name carry no word this gate fails; the
# exemption list is empty by decision and checked as empty.
EXEMPT = []


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
        digest = 'The P90 cost is the high cost of an AI-powered estimate.\n' + digest
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
        print(f'  NEGATIVE CONTROL: expected a reversed cost P label and an AI claim caught; got {got}')
        return 1 if got == ['a reversed cost P label', 'an AI claim'] else 2
    return 1 if (breaches or dead) else 0


sys.exit(main())
