#!/usr/bin/env python3
"""GATE: the words the pack's vocabulary section legislates, over everything a
learner reads.

  * NO REPAIR HISTORY. "used to", "no longer", "was fixed", "before the
    repair", "legacy path" fail: the course has no history to tell.
  * A READING IS NEVER CALLED THE LAW. "the correct reading", "the right
    interpretation" and the like fail: where a text can be read two ways the
    course says so and names both.
  * A LICENSED TEXT IS NEVER QUOTED. A line that frames a quoted span as the
    words of an AIPN or LOGIC model contract, FIDIC conditions, ISO 44001, CIPS
    material or Kraljic's article fails (they are taught by concept). The
    words themselves are swept by gate_licensed_prose.py.
  * A PRACTICE COURSE COMPUTES NOTHING. A line telling a learner to open a
    calculator panel, run the engine or submit a capstone fails.
  * NO "AI" CLAIM. "AI-powered" and "artificial intelligence" fail.
  * REPORTED FOR A HUMAN READ, never failed, because each is a judgement:
    "the Act" with no Act named nearby; "must" within a few words of a
    percentage or a day count (a legal figure the reader should see cited).

SWEPT: the pack (EXCEPT its vocabulary section, which has to name the words it
legislates), every lesson body and manifest title, every bank string, and the
practice course pages and components. Markdown is unwrapped before matching.
The exact text of every QUOTED passage (a public source's own words, checked
by gate_quotes.py) is masked wherever it appears; nothing else is masked.

--plant is THE NEGATIVE CONTROL: it plants a repair-history framing and an
"AI-powered" in the pack in memory and must exit 1 with both caught.
--plant-licensed plants a quoted LOGIC clause framed as the model contract's
words in a lesson line and must exit 1 with it caught.

Exit 0 clean, 1 a breach, 2 could not run.
"""
import os
import re
import sys
import packlib as K

RULES = [
    ('a repair-history framing', re.compile(
        r'\bused to\b|\bno longer\b|\bwas (?:fixed|repaired|corrected)\b|\bbefore the (?:repair|audit|fix)\b|\bpre-audit\b|\blegacy path\b', re.I)),
    ('a reading called the law', re.compile(
        r'\bthe (?:correct|right|true) (?:reading|rule|formula|interpretation)\b', re.I)),
    ('a licensed text quoted', re.compile(
        r'\b(?:AIPN|LOGIC|FIDIC|ISO 44001|CIPS|Kraljic|the model (?:contract|JOA|form))\b[^\n"]{0,50}\b(?:says|said|states|stated|reads|provides|defines|writes|puts it|in its (?:own )?words)\b[^\n"]{0,20}"', re.I)),
    ('a computation claimed', re.compile(
        r'\b(?:open|use|run|work in) (?:the |a |its )?(?:calculator|panel|engine)\b|\bsubmit (?:the |your )?capstone\b|\bcapstone (?:fields?|values?)\b', re.I)),
    ('an AI claim', re.compile(r'AI-powered|artificial intelligence', re.I)),
]
REPORT = [
    ('"the Act" with no Act named nearby', re.compile(r'(?<![A-Za-z] )\bthe Act\b(?![^.\n]{0,40}\b(?:20\d\d|Content|Procurement|Arbitration)\b)')),
    ('"must" near a figure', re.compile(r'\bmust\b[^.\n]{0,40}\b\d+\s*(?:percent|per cent|%|days?)\b', re.I)),
]


def main():
    pack_path = os.path.join(K.HERE, 'PACK.md')
    if not os.path.exists(pack_path):
        print('  GATE REFUSES: no PACK.md')
        return 2
    pack = open(pack_path, encoding='utf-8').read()
    if '--plant' in sys.argv:
        pack = 'The review process used to run in an AI-powered tool.\n' + pack
    parts = re.split(r'(?m)^(?=# SECTION \d+:)', pack)
    kept = [p for p in parts if not re.match(r'# SECTION \d+: Vocabulary', p)]
    if len(kept) != len(parts) - 1:
        print('  GATE REFUSES: the vocabulary section could not be found to exempt it')
        return 2
    texts = [('PACK.md (vocabulary section excepted)', ''.join(kept))]
    nl = 0
    for tier, mkey, lkey, _title, _t, _p, text in K.lessons():
        if text is not None:
            nl += 1
            texts.append((f'{tier}/{mkey}/{lkey}.md', text))
    texts += K.manifest_titles()
    for p in K.APP_TEXT:
        if not os.path.exists(p):
            print(f'  GATE REFUSES: the learner-facing source {p} is missing')
            return 2
        texts.append((os.path.relpath(p, K.REPO), open(p, encoding='utf-8').read()))
    bank = K.bank_strings()
    texts += bank
    if '--plant-licensed' in sys.argv:
        texts.append(('planted lesson line', 'LOGIC clause 10 states "the contractor shall perform the work with due diligence".'))
    lines = sum(t.count('\n') + 1 for _, t in texts)
    breaches, reports = [], {n: 0 for n, _ in REPORT}
    # A QUOTED passage is a source's own words (gate_quotes.py proves each one),
    # and its words are masked wherever they appear exactly; nothing else is.
    masks = [p['text'] for p in K.passages() if p['mode'] == 'quote']
    for label, t in texts:
        for m in masks:
            t = t.replace(m, ' ' * len(m))
        u = K.unwrap(t)
        for name, rx in RULES:
            for m in rx.finditer(u):
                breaches.append((name, label, u[max(0, m.start() - 50):m.end() + 40].replace('\n', ' ')))
        if not label.startswith('src/'):
            for name, rx in REPORT:
                reports[name] += len(rx.findall(u))
    print(f'  sources swept: {len(texts)} (lesson files {nl}, bank strings {len(bank)}, app sources {len(K.APP_TEXT)}); lines {lines}')
    print(f'  reported for a human read, never failed: {reports}')
    print(f'  BREACHES: {len(breaches)}')
    for name, label, ctx in breaches[:40]:
        print(f'   {name}: {label}: ...{ctx}...')
    if lines < 300:
        print('  GATE REFUSES: it examined too little to have checked anything')
        return 2
    if '--plant-licensed' in sys.argv:
        got = [b for b in breaches if b[1] == 'planted lesson line']
        print(f'  NEGATIVE CONTROL: a quoted LOGIC clause was planted in a lesson line; caught {len(got)}')
        return 1 if len(got) == 1 else 2
    if '--plant' in sys.argv:
        got = sorted({b[0] for b in breaches if b[1].startswith('PACK')})
        print(f'  NEGATIVE CONTROL: expected a repair-history framing and an AI claim caught; got {got}')
        return 1 if got == ['a repair-history framing', 'an AI claim'] else 2
    return 1 if breaches else 0


sys.exit(main())
