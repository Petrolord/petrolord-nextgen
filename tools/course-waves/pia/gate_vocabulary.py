#!/usr/bin/env python3
"""GATE: the words the digest's vocabulary section legislates, over everything a learner reads.

  * NO REPAIR HISTORY. This course describes the engine as it is. A sentence
    that frames engine behaviour as former behaviour ("used to", "no longer",
    "was fixed", "before the repair", "pre-audit", "legacy path") fails. The
    two engine refusals that end with a sentence naming the platform switch
    pia_legacy_pre_audit are exempt BY EXACT STRING in the digest only, where
    the refusal table prints them verbatim; a DEAD exemption fails the gate.
  * AN OPEN READING IS NEVER THE LAW. A sentence calling one reading of an open
    question "the correct" or "the right" base year, reading or rate fails, and
    so does a sentence stating the deep offshore rate under the Nigeria Tax Act
    2025 or the new-lease rate onshore or in shallow water as a plain fact.
  * GOVERNMENT TAKE IS NOT A TAX RATE. A sentence equating the take with a tax
    rate fails (fiscalConventions.js: neither take metric is a tax rate).
  * NO "AI" CLAIM. "AI-powered" and "artificial intelligence" fail.
  * REPORTED FOR A HUMAN READ, never failed, because each is a judgement:
    "marginal field" (a flag on onshore or shallow water, never a terrain),
    "PPT" and "petroleum profits tax" (the terms of leases that do not convert,
    concept-only), "fiscal price" (concept-only), "effective tax rate" (the
    minimum ETR is a labelled approximation), and "OML" and "OPL" (licence
    types before the Act).

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

Exit 0 clean, 1 a breach, 2 could not run.
"""
import json
import os
import re
import sys

HERE = os.environ.get('EC7_WAVE_DIR', os.path.dirname(os.path.abspath(__file__)))
REPO = os.environ.get('EC7_REPO', '/root/wt-ec7-nextgen')
COURSE = os.environ.get('EC7_COURSE', os.path.join(REPO, 'src/content/courses/pia'))
APP = [os.path.join(REPO, 'src/components/course/panels/pia', f) for f in
       ('RoyaltyCalculator.jsx', 'HctCalculator.jsx', 'LedgerCalculator.jsx', 'panelBits.jsx', 'piaLab.js')] + \
      [os.path.join(REPO, 'src/pages/apps/PiaLearningPage.jsx')]

RULES = [
    ('a repair-history framing', re.compile(
        r'\bused to\b|\bno longer\b|\bwas (?:fixed|repaired|corrected)\b|\bbefore the (?:repair|audit|fix)\b|\bpre-audit\b|\blegacy path\b|\bthe engine (?:once|previously|formerly)\b', re.I)),
    ('an open reading called the law', re.compile(
        r'\bthe (?:correct|right|true) (?:base year|reading|rate|interpretation)\b', re.I)),
    ('the deep offshore NTA rate stated as fact', re.compile(
        r'deep offshore[^.]{0,60}\b(?:pays|is taxed at|attracts)\s+(?:hydrocarbon tax\s+(?:at|of)\s+)?(?:0|20|30) percent[^.]{0,40}(?:Nigeria Tax Act|NTA)(?![^.]{0,60}\breading)', re.I)),
    ('the new-lease rate stated as fact', re.compile(
        r'\bnew(?:-acreage)? (?:petroleum mining )?leases?\b[^.]{0,40}\bpays?\s+(?:hydrocarbon tax\s+(?:at|of)\s+)?(?:15|30) percent(?![^.]{0,80}\b(?:stated|reading)\b)', re.I)),
    ('government take called a tax rate', re.compile(
        r'government take\s+(?:is|means|equals)\s+(?:a|an|the)?\s*(?:effective\s+)?tax rate', re.I)),
    ('an AI claim', re.compile(r'AI-powered|artificial intelligence', re.I)),
]
REPORT = [
    ('marginal field', re.compile(r'marginal[ _]field', re.I)),
    ('PPT', re.compile(r'\bPPT\b|petroleum profits tax', re.I)),
    ('fiscal price', re.compile(r'fiscal (?:oil )?price', re.I)),
    ('effective tax rate', re.compile(r'effective tax rate', re.I)),
    ('OML or OPL', re.compile(r'\bOM?L\b|\bOPL\b')),
]


# The two engine refusals that end with a sentence naming the platform switch;
# exempt BY EXACT STRING, in the digest only.
EXEMPT = [
    'Set pia_legacy_pre_audit to true to reproduce a pre-audit run.',
    'or set pia_legacy_pre_audit to true to reproduce a pre-audit run with a different recovery life.',
]


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
    lines = sum(t.count('\n') + 1 for _, t in texts)
    breaches, reports = [], {name: 0 for name, _ in REPORT}
    hit = set()
    for label, t in texts:
        u = unwrap(t)
        for e in EXEMPT:
            if label.startswith('digest') and e in u:
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
        print(f'  NEGATIVE CONTROL: expected a repair-history framing and an AI claim caught; got {got}')
        return 1 if got == ['a repair-history framing', 'an AI claim'] else 2
    return 1 if (breaches or dead) else 0


sys.exit(main())
