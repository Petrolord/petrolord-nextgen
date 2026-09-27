#!/usr/bin/env python3
"""GATE: every quotation the EC10 digest prints is the public text, verbatim.

concepts.json carries each provision the course cites: its citation, the
course's paraphrase and an EXACT excerpt of the text. This gate proves three
things and prints every count:

  1. THE TEXTS ARE THE EDITIONS THE COURSE NAMES. The files read on
     2026-09-27 (the PIA 2021 gazette PDF and its text, the Assignment of
     Interests Regulations 2024 gazette PDF and its text, the nine HMRC Oil
     Taxation Manual pages as the GOV.UK content API returned them, the Penn
     State EME 801 page) hash to the sha256 prefixes PINNED below, and every
     prefix the vendored FINDINGS-farmout.md records (the two gazette PDFs,
     OT30021, OT18360, the Penn State page) is the pinned one; hmrc_ot.txt is
     re-derived from the pinned JSON by
     sources/make_hmrc_txt.py and must match the file on disk byte for byte.
  2. EVERY QUOTE IS IN ITS TEXT. Whitespace is collapsed on both sides and
     nothing else is normalised: a quote that differs by one character fails.
  3. EVERY QUOTE THE DIGEST PRINTS IS THE QUOTE, with each em or en dash the
     text prints shown as a colon (the copy rule) and nothing else changed.
     Penn State EME 801 is never quoted (CC BY-NC-SA 4.0): no concept names it.

    python3 quote_check.py            check
    python3 quote_check.py --plant    THE NEGATIVE CONTROL: alters one character
                                      of one quote in memory; must exit 1 naming it

The source texts live only in the wave directory (/root/cat-wip-farmout/sources),
never in the repository: this gate runs in the wave directory and REFUSES
(exit 2) anywhere the texts are absent. It never skips.

Exit 0 clean, 1 a mismatch, 2 could not run.
"""
import hashlib
import importlib.util
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.environ.get('EC10_SOURCES', os.path.join(HERE, 'sources'))
ENG = os.environ.get('EC10_ENGINES', '/root/wt-ec10-nextgen/packages/engines/ec10-farmout')
IN_FINDINGS = ['pia_nuprc.pdf', 'nuprc_assignment_regs_2023.pdf', 'hmrc_ot30021.json', 'hmrc_ot18360.json', 'psu_eme801_node578.html']
TEXTS = {'PIA': 'pia_nuprc.txt', 'AOI': 'nuprc_assignment_regs_2024.txt', 'HMRC': 'hmrc_ot.txt'}
# sha256 prefixes of the files as read on 2026-09-27
PINS = {
    'pia_nuprc.pdf': '5d158ca8a16f00b2',
    'pia_nuprc.txt': 'a9c302f46950c417',
    'nuprc_assignment_regs_2023.pdf': 'af705aca5707b7ad',
    'nuprc_assignment_regs_2024.txt': 'e8ba33ecdd07bed9',
    'hmrc_ot18320.json': 'c82d058843040e65',
    'hmrc_ot18360.json': '68a35945c48dd12f',
    'hmrc_ot30020.json': 'ba48100487b366f0',
    'hmrc_ot30021.json': '5a6712149a249bf2',
    'hmrc_ot30022.json': '649e6c014167c6aa',
    'hmrc_ot30023.json': 'baabaade08b8fe85',
    'hmrc_ot30048.json': 'ce9f01d34364bd02',
    'hmrc_ot30081.json': 'c8e9d5b5c14783a8',
    'hmrc_ot30131.json': 'd6b8caafd53d3da1',
    'psu_eme801_node578.html': '191c65725eb41d52',
}
PLANT = '--plant' in sys.argv


def norm(s):
    return re.sub(r'\s+', ' ', s).strip()


def dashfix(q):
    return re.sub(r'\s*[–—]\s*', ': ', q)


def main():
    need = list(PINS) + ['hmrc_ot.txt', 'make_hmrc_txt.py']
    for f in need:
        if not os.path.exists(os.path.join(SRC, f)):
            print(f'REFUSED: {os.path.join(SRC, f)} is missing; the quotations cannot be checked against the texts')
            return 2
    bad = []
    for f, pin in PINS.items():
        h = hashlib.sha256(open(os.path.join(SRC, f), 'rb').read()).hexdigest()
        ok = h.startswith(pin)
        print(f'  {f}: sha256 {h[:16]} {"is" if ok else "IS NOT"} the pinned prefix')
        if not ok:
            bad.append(f'{f} hash')
    findings = os.path.join(ENG, 'tools/validation/economics/FINDINGS-farmout.md')
    if not os.path.exists(findings):
        print(f'REFUSED: {findings} is missing')
        return 2
    fnd = open(findings, encoding='utf-8').read()
    for f in IN_FINDINGS:
        ok = PINS[f] in fnd
        print(f'  FINDINGS-farmout.md {"records" if ok else "DOES NOT RECORD"} the prefix of {f}')
        if not ok:
            bad.append(f'{f} not in FINDINGS')
    spec = importlib.util.spec_from_file_location('mk', os.path.join(SRC, 'make_hmrc_txt.py'))
    mk = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mk)
    same = mk.build() == open(os.path.join(SRC, 'hmrc_ot.txt'), encoding='utf-8').read()
    print(f'  hmrc_ot.txt {"is" if same else "IS NOT"} the text make_hmrc_txt.py derives from the pinned pages')
    if not same:
        bad.append('hmrc_ot.txt derivation')
    body = {k: norm(open(os.path.join(SRC, t), encoding='utf-8').read()) for k, t in TEXTS.items()}
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
        if re.search(r'penn state|eme 801', c['cite'] + c['quote'], re.I):
            bad.append(f'{c["id"]}: Penn State EME 801 is never quoted')
        if not (6 <= n <= 50):
            bad.append(f'{c["id"]}: the quote is {n} words (6 to 50)')
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
