#!/usr/bin/env python3
"""GATE: every quotation the SC3 digest prints is the public-domain text,
verbatim; every figure it cites from a text is printed by that text; and every
text is the edition the course names.

concepts.json carries each sentence the course quotes (Harris 1913, the 1913
words; MIL-HDBK-338B): its citation, the course's paraphrase and an EXACT
excerpt of the text. This gate proves four things and prints every count:

  1. THE TEXTS ARE THE EDITIONS THE COURSE NAMES. Every file read on
     2026-09-27 hashes to the sha256 prefix PINNED below, and every prefix the
     vendored FINDINGS-inventory.md records for a file it lists (Harris 1913,
     the five MIT ESD.260J lectures and their index page, MIL-HDBK-338B p. 5-27)
     is the pinned one. The index page carries the lectures' licence,
     CC BY-NC-SA 4.0.
  2. EVERY QUOTE IS IN ITS TEXT. Whitespace is collapsed on both sides and
     nothing else is normalised: a quote that differs by one character fails.
  3. EVERY QUOTE THE DIGEST PRINTS IS THE QUOTE, character for character.
  4. EVERY FIGURE CITED FROM A TEXT IS PRINTED BY IT. The MIT OpenCourseWare
     lectures are licensed CC BY-NC-SA 4.0 and are never quoted, so their
     figures (lecture 8 slides 9, 12 and 15; lecture 11 slides 18 and 24;
     lecture 12 slide 6; lecture 13 slides 11 and 12), Harris's printed lots
     and MIL-HDBK-338B's 0.986 are checked here against the texts, and each is
     checked to appear in the digest where the digest cites it.

    python3 quote_check.py            check
    python3 quote_check.py --plant    THE NEGATIVE CONTROL: alters one character
                                      of one quote in memory; must exit 1 naming it

The source texts live only in the wave directory (/root/cat-wip-materials/sources),
never in the repository: this gate runs in the wave directory and REFUSES
(exit 2) anywhere the texts are absent. It never skips.

Exit 0 clean, 1 a mismatch, 2 could not run.
"""
import hashlib
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.environ.get('SC3_SOURCES', os.path.join(HERE, 'sources'))
ENG = os.environ.get('SC3_ENGINES', '/root/wt-sc3-nextgen/packages/engines')
TEXTS = {'HARRIS': ['harris1913.txt'], 'MIL': ['mil338_pp109.txt']}
# sha256 prefixes of the files as read on 2026-09-27
PINS = {
    'harris1913.pdf': 'e35603eced0ed4d1',
    'harris1913.txt': 'b4a113f0d721ffbd',
    'esd260-lect7.pdf': '993304c0da666374',
    'esd260-lect7.txt': '9a145a5eb26ad94f',
    'esd260-lect8.pdf': 'c94b17784aa94fde',
    'esd260-lect8.txt': '4d398cfe6226b001',
    'esd260-lect11.pdf': '33ddb6947f1ec82e',
    'esd260-lect11.txt': '7567fad5a4b3163a',
    'esd260-lect12.pdf': 'ffe9d2584425a995',
    'esd260-lect12.txt': 'e05483c1a5d345d8',
    'esd260-lect13.pdf': 'cfe0f8613b794689',
    'esd260-lect13.txt': '8977ac963152c74c',
    'esd260-lectures.html': 'cbdf8cf7c06008ae',
    'mil338_pp109.pdf': '9de2ee2e13bea72c',
    'mil338_pp109.txt': 'df67144378262daa',
}
# The files the vendored validation record (FINDINGS-inventory.md, sources table) lists with a sha256 prefix.
FINDINGS_PREFIXES = {
    'harris1913.pdf': 'e35603eced0ed4d1', 'esd260-lect8.pdf': 'c94b17784aa94fde', 'esd260-lect7.pdf': '993304c0da666374',
    'esd260-lect11.pdf': '33ddb6947f1ec82e', 'esd260-lect12.pdf': 'ffe9d2584425a995', 'esd260-lect13.pdf': 'cfe0f8613b794689',
    'esd260-lectures.html': 'cbdf8cf7c06008ae', 'mil338_pp109.pdf': '9de2ee2e13bea72c',
}
# (text file, the figure exactly as the text prints it, what it is). Each must
# be in the text, and in the digest where the digest cites it.
FIGURES = [
    ('harris1913.txt', '2,190', 'Harris: the first lot'),
    ('harris1913.txt', '6,850', 'Harris: the Figure II lot'),
    ('harris1913.txt', '48.5', 'Harris: the Figure III lot'),
    ('harris1913.txt', 'or, say, 49', 'Harris: the stud rounded'),
    ('esd260-lect8.txt', '400', 'lecture 8 slide 9: order size'),
    ('esd260-lect8.txt', '2,500', 'lecture 8 slide 9: order and holding cost; slide 15: F1'),
    ('esd260-lect8.txt', '5,000', 'lecture 8 slide 9: total'),
    ('esd260-lect8.txt', '7,500', 'lecture 8 slide 15: F2'),
    ('esd260-lect8.txt', '1,033', 'lecture 8 slide 15: EOQ band 1'),
    ('esd260-lect8.txt', '1,789', 'lecture 8 slide 15: EOQ band 2'),
    ('esd260-lect8.txt', '44.19', 'lecture 8 slide 15: effective price'),
    ('esd260-lect8.txt', '88,384', 'lecture 8 slide 15: purchase'),
    ('esd260-lect8.txt', '559', 'lecture 8 slide 15: ordering'),
    ('esd260-lect8.txt', '9,882', 'lecture 8 slide 15: holding'),
    ('esd260-lect8.txt', '98,825', 'lecture 8 slide 15: total'),
    ('esd260-lect8.txt', '105,000', 'lecture 8 slide 15: band 0 total'),
    ('esd260-lect8.txt', 'Discount of 2% off if Q', 'lecture 8 slide 12: the all-units discount stated'),
    ('esd260-lect11.txt', '13,000', 'lecture 11 slide 18: demand'),
    ('esd260-lect11.txt', '1,316', 'lecture 11 slide 18: RMSE'),
    ('esd260-lect11.txt', 'EOQ = 228', 'lecture 11 slide 18: EOQ'),
    ('esd260-lect11.txt', '99%      601   513', 'lecture 11 slide 24: 99 percent row'),
    ('esd260-lect11.txt', '95%      423   348', 'lecture 11 slide 24: 95 percent row'),
    ('esd260-lect11.txt', '90%      330   252', 'lecture 11 slide 24: 90 percent row'),
    ('esd260-lect11.txt', '80%      217   148', 'lecture 11 slide 24: 80 percent row'),
    ('esd260-lect12.txt', '= 577 units', 'lecture 12 slide 6: sigma'),
    ('esd260-lect12.txt', '0.1733', 'lecture 12 slide 6: the loss target'),
    ('esd260-lect12.txt', 'k=0.58', 'lecture 12 slide 6: k'),
    ('esd260-lect12.txt', '2835 units', 'lecture 12 slide 6: S'),
    ('esd260-lect13.txt', '0   44.9%   44.9%         0.80', 'lecture 13 slide 12: level 0'),
    ('esd260-lect13.txt', '1   35.9%   80.9%         0.25', 'lecture 13 slide 12: level 1'),
    ('esd260-lect13.txt', '2   14.4%   95.3%         0.06', 'lecture 13 slide 12: level 2'),
    ('esd260-lect13.txt', '3   3.8%    99.1%         0.01', 'lecture 13 slide 12: level 3'),
    ('esd260-lect13.txt', '4   0.8%    99.9%        0.009', 'lecture 13 slide 12: level 4, the slip'),
    ('esd260-lect13.txt', '(1-.90)(.8) = 0.08', 'lecture 13 slide 11: E[US]'),
    ('esd260-lect13.txt', 'set S=2', 'lecture 13 slide 12: the level'),
    ('mil338_pp109.txt', '= 0.986', 'MIL-HDBK-338B example 5.3.8.1'),
    ('esd260-lectures.html', 'creativecommons.org/licenses/by-nc-sa/4.0', 'the lectures licence'),
]
# Each cited figure, as the digest prints it, that must appear in the digest.
DIGEST_FIGURES = ['2,190', '6,850', '48.5', '"or, say, 49"', 'an order size of 400', 'an order cost of 2,500', 'a total of 5,000',
                  '| 7,500 |', '| 1,033 |', '| 1,789 |', '44.19, 88,384, 559, 9,882, 98,825 and 105,000', '13,000 units a year',
                  '(RMSE) of 1,316', 'an EOQ of 228', '| 601 |', '| 423 |', '| 330 |', '| 217 |', '| 513 |', '| 348 |', '| 252 |', '| 148 |',
                  'a sigma of 577', 'a loss target of 0.1733', 'a safety factor of 0.58', 'order-up-to level of 2835', '| 44.9% |', '| 35.9% |',
                  '| 14.4% |', '| 80.9% |', '| 95.3% |', '| 99.1% |', '| 99.9% |', '| 0.80 |', '| 0.25 |', '| 0.06 |', '| 0.01 |', '| 0.009 |',
                  'at most 0.08', 'handbook prints 0.986']
PLANT = '--plant' in sys.argv


def norm(s):
    return re.sub(r'\s+', ' ', s).strip()


def read(f):
    return open(os.path.join(SRC, f), encoding='utf-8', errors='replace').read()


def main():
    for f in PINS:
        if not os.path.exists(os.path.join(SRC, f)):
            print(f'REFUSED: {os.path.join(SRC, f)} is missing; the quotations and figures cannot be checked against the texts')
            return 2
    bad = []
    for f, pin in PINS.items():
        h = hashlib.sha256(open(os.path.join(SRC, f), 'rb').read()).hexdigest()
        ok = h.startswith(pin)
        print(f'  {f}: sha256 {h[:16]} {"is" if ok else "IS NOT"} the pinned prefix')
        if not ok:
            bad.append(f'{f}: sha256 {h[:16]} is not the pinned {pin}')
    findings = open(os.path.join(ENG, 'tools/validation/supplychain/FINDINGS-inventory.md'), encoding='utf-8').read()
    for f, pin in FINDINGS_PREFIXES.items():
        if pin not in findings:
            bad.append(f'FINDINGS-inventory.md does not record the prefix {pin} of {f}')
        if PINS.get(f) != pin:
            bad.append(f'{f}: the FINDINGS prefix {pin} is not the pinned one')
    print(f'  FINDINGS-inventory.md prefixes cross-checked: {len(FINDINGS_PREFIXES)}')

    concepts = json.load(open(os.path.join(HERE, 'concepts.json'), encoding='utf-8'))
    digest = open(os.path.join(HERE, 'digest.txt'), encoding='utf-8').read()
    bodies = {k: norm(' '.join(read(f) for f in v)) for k, v in TEXTS.items()}
    if PLANT:
        c0 = concepts[0]
        c0['quote'] = c0['quote'][:-2] + ('X' if c0['quote'][-2] != 'X' else 'Y') + c0['quote'][-1]
    for c in concepts:
        q = norm(c['quote'])
        if q not in bodies[c['text']]:
            bad.append(f'{c["id"]}: NOT IN THE TEXT {c["text"]}')
        if f'"{q}" ({c["cite"]})' not in digest:
            bad.append(f'{c["id"]}: the digest does not print the quote exactly with its citation')
        if re.search(r'Caplice|ESD\.260|OpenCourseWare|\bMIT\b', c['cite'] + c['quote']):
            bad.append(f'{c["id"]}: a lecture is quoted; the lectures are CC BY-NC-SA 4.0 and are never quoted')
    print(f'  quotations checked against their texts and the digest: {len(concepts)}')

    for f, fig, what in FIGURES:
        if fig not in read(f):
            bad.append(f'{what}: {fig!r} is not printed by {f}')
    print(f'  figures cited from the texts, each found in its text: {len(FIGURES)}')
    for fig in DIGEST_FIGURES:
        if fig not in digest:
            bad.append(f'the digest does not cite {fig!r} where it says it does')
    print(f'  cited figures found in the digest: {len(DIGEST_FIGURES)}')

    print(f'MISMATCHES: {len(bad)}')
    for b in bad:
        print(f'  {b}')
    if PLANT:
        caught = any(concepts[0]['id'] in b for b in bad)
        print(f'NEGATIVE CONTROL: one character of {concepts[0]["id"]} was altered in memory; {"caught" if caught else "NOT CAUGHT"}')
        return 1 if caught else 2
    return 1 if bad else 0


sys.exit(main())
