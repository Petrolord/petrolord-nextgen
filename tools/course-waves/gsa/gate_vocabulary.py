#!/usr/bin/env python3
"""GATE: the words the digest's vocabulary section legislates, over everything a learner reads.

  * NO REPAIR HISTORY. This course describes the engine as it is. A sentence
    that frames engine behaviour as former behaviour ("used to", "no longer",
    "was fixed", "before the repair", "legacy path") fails.
  * A STATED READING IS NEVER THE LAW. A sentence calling one of the engine's
    four stated readings "the correct" or "the right" reading, rule or
    formula fails.
  * THE DOMESTIC BASE PRICE IS QUOTED ONLY AS REPORTED. A line of a lesson, a
    bank string or the app carrying one of the reported figures (2.18, 2.68,
    2.13, 2.63) with none of "reported", "planning assumption", "stated" or
    "fixture" on it fails. The digest is exempt from this one rule: it prints
    the fixture's held price in golden-input tables and explains it in its
    sources and dataset sections.
  * A DEFICIENCY PAYMENT IS NO PENALTY. A sentence calling the take-or-pay
    deficiency payment a penalty or a fine fails (the model agreement makes it
    a payment for gas paid for and not taken; the DGDO penalty is the Act's).
  * NO FLARE RATE. A sentence setting a figure against flaring fails: the
    flaring Regulations copy read is unnumbered and undated, so the course
    prints no rate.
  * NO "AI" CLAIM. "AI-powered" and "artificial intelligence" fail.
  * REPORTED FOR A HUMAN READ, never failed, because each is a judgement: an
    unqualified "shortfall" (the vocabulary wants seller or buyer), "AIPN" (a
    licensed text, taught by concept only), "take or pay" written without its
    hyphens outside a quotation.

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
--plant-price plants a reported price with no attribution in a lesson line and
must exit 1 with it caught.

Exit 0 clean, 1 a breach, 2 could not run.
"""
import json
import os
import re
import sys

HERE = os.environ.get('EC8_WAVE_DIR', os.path.dirname(os.path.abspath(__file__)))
REPO = os.environ.get('EC8_REPO', '/root/wt-ec8-nextgen')
COURSE = os.environ.get('EC8_COURSE', os.path.join(REPO, 'src/content/courses/gsa'))
APP = [os.path.join(REPO, 'src/components/course/panels/gsa', f) for f in
       ('QuantityCalculator.jsx', 'LedgerCalculator.jsx', 'ContractCalculator.jsx', 'panelBits.jsx', 'gsaLab.js')] + \
      [os.path.join(REPO, 'src/pages/apps/GsaLearningPage.jsx')]

RULES = [
    ('a repair-history framing', re.compile(
        r'\bused to\b|\bno longer\b|\bwas (?:fixed|repaired|corrected)\b|\bbefore the (?:repair|audit|fix)\b|\bpre-audit\b|\blegacy path\b|\bthe engine (?:once|previously|formerly)\b', re.I)),
    ('a stated reading called the law', re.compile(
        r'\bthe (?:correct|right|true) (?:reading|rule|formula|interpretation)\b', re.I)),
    ('a deficiency payment called a penalty', re.compile(
        r'deficiency payments?\s+(?:is|are|as)\s+(?:a\s+)?(?:penalty|penalties|fine)', re.I)),
    ('a flare rate', re.compile(r'\bflar\w*[^.\n]{0,60}(?:US\$|USD)\s?\d|\bflar\w*[^.\n]{0,60}\d+(?:\.\d+)? per (?:1,000|thousand|Mscf|scf)', re.I)),
    ('an AI claim', re.compile(r'AI-powered|artificial intelligence', re.I)),
]
REPORT = [
    ('unqualified shortfall', re.compile(r'(?<!seller )(?<!buyer )(?<!Seller )(?<!Buyer )\bshortfall\b(?! quantity| damages| price| payment)', re.I)),
    ('AIPN', re.compile(r'\bAIPN\b')),
    ('take or pay unhyphenated', re.compile(r'\btake or pay\b', re.I)),
]

EXEMPT = [
    # The Act's own words (PIA s.167(3)(b)), quoted verbatim and checked by quote_check.py.
    'and at such time the provisions of subsections (4), (5), (6) and (7) and section 168 shall no longer be applicable',
    # The engine's reason and basis, which quote or paraphrase that subsection.
    'because s.167(4) to (7) and s.168 no longer apply once the free-market criteria are met (s.167(3)(b))',
]

# A reported domestic price figure on a LINE (a paragraph, a table row, a
# bullet) that nowhere says "reported" is a breach.
REPORTED_FIG = re.compile(r'(?<![\d.])2\.(?:18|68|13|63)0*(?!\d)')


def reported_breaches(u):
    out = []
    for line in u.split('\n'):
        if REPORTED_FIG.search(line) and not re.search(r'\breported\b|planning assumption|\bstated\b|\bfixture\b', line, re.I):
            out.append(line.strip()[:120])
    return out


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
    if '--plant-price' in sys.argv:
        texts.append(('planted lesson line', 'The power sector price is 2.18 per MMBtu.'))
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
        # The digest prints the fixture's held price in its golden-input tables and
        # explains it in its sources and dataset sections; the rule binds the
        # prose a writer produces (lessons, banks) and the app.
        for ctx in ([] if label.startswith('digest') else reported_breaches(u)):
            breaches.append(('a reported domestic price stated as fact', label, ctx))
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
    if '--plant-price' in sys.argv:
        got = [b for b in breaches if b[1] == 'planted lesson line']
        print(f'  NEGATIVE CONTROL: a reported price with no attribution was planted in a lesson line; caught {len(got)}')
        return 1 if len(got) == 1 else 2
    if '--plant' in sys.argv:
        got = sorted({b[0] for b in breaches if b[1].startswith('digest')})
        print(f'  NEGATIVE CONTROL: expected a repair-history framing and an AI claim caught; got {got}')
        return 1 if got == ['a repair-history framing', 'an AI claim'] else 2
    return 1 if (breaches or dead) else 0


sys.exit(main())
