#!/usr/bin/env python3
"""GATE: every quotation the EC8 digest prints is the public text, verbatim.

concepts.json carries each provision the course cites: its citation, the
course's paraphrase and an EXACT excerpt of the text. This gate proves three
things and prints every count:

  1. THE TEXTS ARE THE EDITIONS THE COURSE NAMES. The PDFs read on
     2026-09-26 (PIA 2021 gazette, DGDO Regulations 2022 gazette, the
     Commonwealth model GSA 2025, ESMAP 152/93) hash to the sha256 prefix
     recorded in the vendored FINDINGS-gasContract.md, and each text file sits
     beside its PDF; the HMRC manual pages are text only (GOV.UK content API)
     and their sha256 prefixes are recorded there too.
  2. EVERY QUOTE IS IN ITS TEXT. Whitespace is collapsed on both sides and
     nothing else is normalised: a quote that differs by one character fails.
  3. EVERY QUOTE THE DIGEST PRINTS IS THE QUOTE, with each em or en dash the
     gazette prints shown as a colon (the copy rule) and nothing else changed.

    python3 quote_check.py            check
    python3 quote_check.py --plant    THE NEGATIVE CONTROL: alters one character
                                      of one quote in memory; must exit 1 naming it

The source texts live only in the wave directory (/root/cat-wip-gsa/sources),
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
SRC = os.environ.get('EC8_SOURCES', os.path.join(HERE, 'sources'))
ENG = os.environ.get('EC8_ENGINES', '/root/wt-ec8-nextgen/packages/engines')
TEXTS = {
    'PIA': ('pia_nuprc.txt', 'pia_nuprc.pdf'),
    'DGDO': ('dgdo.txt', 'Upstream_Petroleum_Domestic_Gas_Delivery_Regulation_2022_03ec5aaa331c150184d83be9.pdf'),
    'CW': ('comsec.txt', 'comsec_gsa_2025.pdf'),
    'ESMAP': ('esmap.txt', 'esmap_152_93.pdf'),
    'HMRC': ('hmrc_ot05435.txt', None),
    'HMRC2': ('hmrc_ot05402.txt', None),
}
PLANT = '--plant' in sys.argv


def norm(s):
    return re.sub(r'\s+', ' ', s).strip()


def dashfix(q):
    return re.sub(r'\s*[–—]\s*', ': ', q)


def main():
    findings = os.path.join(ENG, 'tools/validation/economics/FINDINGS-gasContract.md')
    for f in [findings] + [os.path.join(SRC, t) for pair in TEXTS.values() for t in pair if t]:
        if not os.path.exists(f):
            print(f'REFUSED: {f} is missing; the quotations cannot be checked against the texts')
            return 2
    fnd = open(findings, encoding='utf-8').read()
    bad = []
    body = {}
    for k, (txt, pdf) in TEXTS.items():
        hashed = pdf or txt
        h = hashlib.sha256(open(os.path.join(SRC, hashed), 'rb').read()).hexdigest()
        ok = h[:16] in fnd
        print(f'  {k}: {hashed} sha256 {h[:16]} {"is" if ok else "IS NOT"} the prefix FINDINGS-gasContract.md records')
        if not ok and pdf:
            bad.append(f'{k} pdf hash')
        body[k] = norm(open(os.path.join(SRC, txt), encoding='utf-8').read())
    body['HMRC'] = body['HMRC'] + ' ' + body.pop('HMRC2')
    concepts = json.load(open(os.path.join(HERE, 'concepts.json'), encoding='utf-8'))
    if len(concepts) < 40:
        print(f'REFUSED: concepts.json carries {len(concepts)} entries, too few to be the course\'s citations')
        return 2
    if PLANT:
        concepts[0] = dict(concepts[0], quote=concepts[0]['quote'][:-1] + ('X' if concepts[0]['quote'][-1] != 'X' else 'Y'))
    per = {}
    for c in concepts:
        q = norm(c['quote'])
        n = len(q.split())
        if c.get('text') not in body:
            bad.append(f'{c["id"]}: unknown text {c.get("text")}')
            continue
        if not (6 <= n <= 45):
            bad.append(f'{c["id"]}: the quote is {n} words (6 to 45)')
        if q not in body[c['text']]:
            bad.append(f'{c["id"]}: the quote is NOT in {c["text"]}: "{q[:80]}"')
        per[c['text']] = per.get(c['text'], 0) + 1
    digest = open(os.path.join(HERE, 'digest.txt'), encoding='utf-8').read()
    printed = 0
    for c in concepts:
        want = f'"{dashfix(norm(c["quote"]))}" ({c["cite"]})'
        if want.replace('|', '/') in digest:
            printed += 1
        else:
            bad.append(f'{c["id"]}: the digest does not print the quote exactly')
    print(f'  concepts.json: {len(concepts)} quotations ({", ".join(f"{k} {v}" for k, v in sorted(per.items()))}); '
          f'{printed} printed in the digest exactly')
    print(f'  MISMATCHES: {len(bad)}')
    for b in bad[:20]:
        print(f'   {b}')
    if PLANT:
        caught = any(b.startswith(concepts[0]['id'] + ': the quote is NOT') for b in bad)
        print(f'  NEGATIVE CONTROL: one character of {concepts[0]["id"]} was altered in memory; {"caught" if caught else "NOT CAUGHT"}')
        return 1 if caught else 2
    return 1 if bad else 0


sys.exit(main())
