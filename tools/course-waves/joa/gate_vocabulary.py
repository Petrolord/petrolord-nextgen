"""GATE: the words the digest's vocabulary section legislates, over everything a learner reads.

  * NO REPAIR HISTORY. This course describes the engine as it is. A sentence
    that frames engine behaviour as former behaviour ("used to", "no longer",
    "was fixed", "before the repair", "legacy path") fails.
  * A STATED READING IS NEVER THE LAW. A sentence calling one of the engine's
    three stated readings "the correct" or "the right" reading, rule or
    formula fails.
  * NO HIDDEN DEFAULT. A sentence saying the engine or a panel supplies a
    contract term "by default", "defaults to" a figure or holds a "default
    value" fails: every contractual term is a stated input (the word
    "default" for a party's failure to pay is the course's own and is left
    alone).
  * A LICENSED TEXT IS NEVER QUOTED. A line naming the AIPN model JOA, COPAS
    or an AAPL form with a double-quoted span within sixty characters fails.
  * NO "AI" CLAIM. "AI-powered" and "artificial intelligence" fail.
  * REPORTED FOR A HUMAN READ, never failed, because each is a judgement: a
    bare "interest" not qualified as participating, paying, beneficial,
    carried, default or penal; "AIPN" and "COPAS" (licensed, taught by concept
    only); "recovery" with no named object.

SWEPT: the digest (EXCEPT its vocabulary section, whose table has to name the
words it legislates), the lab, the three calculator panels, their shared bits
and the learning page, every lesson body and manifest title under the course
directory, and every bank JSON under the wave's banks directory. Markdown is
unwrapped before matching, so a word split across a hard wrap is still read.

REFUSALS. Exit 2 when the digest or an app source is missing, or when fewer
than 500 lines were read.

    python3 gate_vocabulary.py [--plant]

--plant is THE NEGATIVE CONTROL: it plants one repair-history framing and one
"AI-powered" in the digest text in memory and must exit 1 with both caught.
--plant-licensed plants a quoted AIPN clause in a lesson line and must exit 1
with it caught.

Exit 0 clean, 1 a breach, 2 could not run.
"""
import json
import os
import re
import sys

HERE = os.environ.get('EC9_WAVE_DIR', os.path.dirname(os.path.abspath(__file__)))
REPO = os.environ.get('EC9_REPO', '/root/wt-ec9-nextgen')
COURSE = os.environ.get('EC9_COURSE', os.path.join(REPO, 'src/content/courses/joa'))
APP = [os.path.join(REPO, 'src/components/course/panels/joa', f) for f in
       ('AccountCalculator.jsx', 'RecoveryCalculator.jsx', 'AgreementCalculator.jsx', 'panelBits.jsx', 'joaLab.js')] + \
      [os.path.join(REPO, 'src/pages/apps/JoaLearningPage.jsx')]

RULES = [
    ('a repair-history framing', re.compile(
        r'\bused to\b|\bno longer\b|\bwas (?:fixed|repaired|corrected)\b|\bbefore the (?:repair|audit|fix)\b|\bpre-audit\b|\blegacy path\b|\bthe engine (?:once|previously|formerly)\b', re.I)),
    ('a stated reading called the law', re.compile(
        r'\bthe (?:correct|right|true) (?:reading|rule|formula|interpretation)\b', re.I)),
    ('a hidden default claimed', re.compile(r'\bdefaults? to\b|\bby default\b|\bdefault value\b', re.I)),
    ('a licensed text quoted', re.compile(r'\b(?:AIPN|COPAS|AAPL)\b[^\n]{0,60}"|"[^"\n]{1,200}"[^\n]{0,60}\b(?:AIPN|COPAS|AAPL)\b')),
    ('an AI claim', re.compile(r'AI-powered|artificial intelligence', re.I)),
]
REPORT = [
    ('bare interest', re.compile(r'(?<!participating )(?<!paying )(?<!beneficial )(?<!carried )(?<!default )(?<!penal )(?<!late payment )\binterests?\b', re.I)),
    ('AIPN or COPAS', re.compile(r'\b(?:AIPN|COPAS)\b')),
    ('recovery unnamed', re.compile(r'(?<!carry )(?<!premium )(?<!cost )(?<!refund )\brecovery\b', re.I)),
]

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
        # Planted BEFORE the first section, because the vocabulary section is the
        # last section and is exempt: a plant appended to the end would be swept
        # by nothing and the control could not fire.
        digest = 'The engine used to charge a flat royalty in an AI-powered model.\n' + digest
    # The vocabulary section names the words it legislates; it is not swept.
    parts = re.split(r'(?m)^(?=# SECTION \d+:)', digest)
    kept = [p for p in parts if not re.match(r'# SECTION \d+: Vocabulary', p)]
    if len(kept) != len(parts) - 1:
        print('  GATE REFUSES: the vocabulary section could not be found to exempt it')
        return 2
    texts = [('digest.txt (vocabulary section excepted)', ''.join(kept))]
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
    if '--plant-licensed' in sys.argv:
        texts.append(('planted lesson line', 'The AIPN model JOA says "the non-consenting party shall pay".'))
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
    if '--plant-licensed' in sys.argv:
        got = [b for b in breaches if b[1] == 'planted lesson line']
        print(f'  NEGATIVE CONTROL: a quoted AIPN clause was planted in a lesson line; caught {len(got)}')
        return 1 if len(got) == 1 else 2
    if '--plant' in sys.argv:
        got = sorted({b[0] for b in breaches if b[1].startswith('digest')})
        print(f'  NEGATIVE CONTROL: expected a repair-history framing and an AI claim caught; got {got}')
        return 1 if got == ['a repair-history framing', 'an AI claim'] else 2
    return 1 if (breaches or dead) else 0


sys.exit(main())
