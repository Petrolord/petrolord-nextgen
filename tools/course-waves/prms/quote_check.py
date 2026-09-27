#!/usr/bin/env python3
"""GATE: every quotation the EC11 digest prints is the public text, verbatim;
every figure it cites from a text is printed by that text; and every text is
the edition the course names.

concepts.json carries each provision the course quotes: its citation, the
course's paraphrase and an EXACT excerpt of the text. This gate proves four
things and prints every count:

  1. THE TEXTS ARE THE EDITIONS THE COURSE NAMES. Every file read on
     2026-09-27 hashes to the sha256 prefix PINNED below; the prefixes of the
     files the draft validation record lists (the PRMS page and bilingual PDF,
     the errata, the FAQ page, the 2011 Guidelines, the eCFR sections, the
     PIA gazette, S.I. No. 37, the Commercial Regulations, the NUPRC release)
     are the ones it gives.
  2. EVERY QUOTE IS IN ITS TEXT. Whitespace is collapsed on both sides and
     nothing else is normalised: a quote that differs by one character fails.
  3. EVERY QUOTE THE DIGEST PRINTS IS THE QUOTE, with each em or en dash the
     text prints shown as a colon (the copy rule) and nothing else changed.
  4. EVERY FIGURE CITED FROM A TEXT IS PRINTED BY IT. The licensed and
     reserved texts are never quoted, so their figures are checked here
     against the texts (the 2011 Guidelines' Table 6.2 and Fig. 6.5, the FAQ
     3.3 example, the errata item on the word economic, the NUPRC release's
     figures and date, the PRMS licence on the SPE page, the gazette details
     of the Act, S.I. No. 37 and the Commercial Regulations), and each is
     checked to appear in the digest where the digest cites it.

    python3 quote_check.py            check
    python3 quote_check.py --plant    THE NEGATIVE CONTROL: alters one character
                                      of one quote in memory; must exit 1 naming it

The source texts live only in the wave directory (/root/cat-wip-prms/sources),
never in the repository: this gate runs in the wave directory and REFUSES
(exit 2) anywhere the texts are absent. It never skips.

Exit 0 clean, 1 a mismatch, 2 could not run.
"""
import hashlib
import html
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.environ.get('EC11_SOURCES', os.path.join(HERE, 'sources'))
SI37 = 'n_Nigerian_Upstream_Significant_Crude_Oil_and_Gas_Recovery_Regulations_2023_d00669111fcd0e4ce060e86b'
COMM = 'n_Nigerian_Upstream_Petroleum_Commerciala_Regulations_2025_9da8195c295fc31059c7b907'
TEXTS = {'PIA': ['pia_nuprc.txt'], 'SI37': [f'{SI37}.txt'], 'SEC': ['ecfr_229.1202.txt', 'ecfr_229.1203.txt', 'ecfr_210_4-10.txt']}
# sha256 prefixes of the files as read on 2026-09-27
PINS = {
    'prms2018page.html': 'c6493ee7b7a7e163',
    'prms_2018_english-chinese_feb_2024.pdf': 'da67c0e0e0710d23',
    'prms_2018_english-chinese_feb_2024.txt': '2b21b5fc50401830',
    'prms_en.txt': '83abcf08223d6977',
    'errata_2019_-_202011_consolidated_202205_final.pdf': '185da097d801c033',
    'errata_2019_-_202011_consolidated_202205_final.txt': 'edb20d76f8af00df',
    'prms2018keychanges.pdf': '6f652658c4a6dfc8',
    'faqs.html': '71aa4d77e0e37d70',
    'faqs.txt': '0054e51c2becbb79',
    'PRMS_Guidelines_Nov2011.pdf': '3faa7e8d919ef3ba',
    'PRMS_Guidelines_Nov2011.txt': 'ccd53514471f51ba',
    'ecfr_229.1202.xml': 'ce10d8b9ae96b1ee',
    'ecfr_229.1202.txt': 'faeefde57502ef89',
    'ecfr_229.1203.xml': 'dc58823a8ed53382',
    'ecfr_229.1203.txt': 'b82242779dea31d9',
    'ecfr_210_4-10.xml': 'a87e712adbdb71fb',
    'ecfr_210_4-10.txt': 'da4145bce8462420',
    'pia_nuprc.pdf': '5d158ca8a16f00b2',
    'pia_nuprc.txt': 'a9c302f46950c417',
    f'{SI37}.pdf': '72f0b83400813bc5',
    f'{SI37}.txt': '998bf542a6262b7f',
    f'{COMM}.pdf': '3bdd50309a308f24',
    f'{COMM}.txt': '39a43d47f1a0fe26',
    'n_Acreage_Management_and_Petroleum_Drilling_Regulation_2024_0f9b5bfd8c31b64eb380c32a.pdf': '9da025bbbd4a1a15',
    'nuprc_reserves_2026.html': '95402c8204fffcaf',
}
# The prefixes the draft validation record (FINDINGS-prms.md, sources table) gives for the files it lists.
FINDINGS_PREFIXES = {
    'prms2018page.html': 'c6493ee7b7a7e163', 'prms_2018_english-chinese_feb_2024.pdf': 'da67c0e0e0710d23',
    'errata_2019_-_202011_consolidated_202205_final.pdf': '185da097d801c033', 'prms2018keychanges.pdf': '6f652658c4a6dfc8',
    'faqs.html': '71aa4d77e0e37d70', 'PRMS_Guidelines_Nov2011.pdf': '3faa7e8d919ef3ba', 'ecfr_229.1202.xml': 'ce10d8b9ae96b1ee',
    'ecfr_210_4-10.xml': 'a87e712adbdb71fb', 'pia_nuprc.pdf': '5d158ca8a16f00b2', f'{SI37}.pdf': '72f0b83400813bc5',
    'n_Acreage_Management_and_Petroleum_Drilling_Regulation_2024_0f9b5bfd8c31b64eb380c32a.pdf': '9da025bbbd4a1a15',
    f'{COMM}.pdf': '3bdd50309a308f24', 'nuprc_reserves_2026.html': '95402c8204fffcaf',
}
PLANT = '--plant' in sys.argv


def norm(s):
    return re.sub(r'\s+', ' ', s).strip()


def dashfix(q):
    return re.sub(r'\s*[–—]\s*', ': ', q)


def read(f):
    return open(os.path.join(SRC, f), encoding='utf-8', errors='replace').read()


def page_text(f):
    t = read(f)
    t = re.sub(r'<script.*?</script>|<style.*?</style>', ' ', t, flags=re.S)
    return norm(html.unescape(re.sub(r'<[^>]+>', ' ', t)))


def main():
    for f in PINS:
        if not os.path.exists(os.path.join(SRC, f)):
            print(f'REFUSED: {os.path.join(SRC, f)} is missing; the quotations and figures cannot be checked against the texts')
            return 2
    bad = []
    for f, pin in PINS.items():
        h = hashlib.sha256(open(os.path.join(SRC, f), 'rb').read()).hexdigest()
        ok = h.startswith(pin)
        print(f'  {f[:70]}: sha256 {h[:16]} {"is" if ok else "IS NOT"} the pinned prefix')
        if not ok:
            bad.append(f'{f} hash')
    for f, pre in FINDINGS_PREFIXES.items():
        if PINS[f] != pre:
            bad.append(f'{f}: the pin differs from the validation record\'s prefix {pre}')
    print(f'  validation-record prefixes agreeing with the pins: {sum(PINS[f] == p for f, p in FINDINGS_PREFIXES.items())} of {len(FINDINGS_PREFIXES)}')
    digest = open(os.path.join(HERE, 'digest.txt'), encoding='utf-8').read()
    ndig = norm(digest)

    # ---- 4. figures cited from the texts, each checked in its text and in the digest
    ag = norm(read('PRMS_Guidelines_Nov2011.txt'))
    faq = norm(read('faqs.txt'))
    err = norm(read('errata_2019_-_202011_consolidated_202205_final.txt'))
    nu = page_text('nuprc_reserves_2026.html')
    spe = page_text('prms2018page.html')
    pia = norm(read('pia_nuprc.txt'))
    si = norm(read(f'{SI37}.txt'))
    com = norm(read(f'{COMM}.txt'))
    prms = norm(read('prms_en.txt'))
    FIG = [
        ('AG 2011 Table 6.2 expectation', ag, 'Expectation of GIIP 10 m 53.4 35.6 89.0', 'an expectation of GIIP of 53.4 and 35.6'),
        ('AG 2011 Table 6.2 Proved', ag, 'Proved GIIP 10 m 43.3 28.5 71.8', 'a Proved GIIP of 43.3 and 28.5 and a total Proved of 71.8'),
        ('AG 2011 Fig. 6.5 arithmetic', ag, '72 mrd m3', 'Fig. 6.5 prints the arithmetic Proved as 72'),
        ('AG 2011 Fig. 6.5 probabilistic', ag, '77 mrd m3', 'the probabilistic Proved of independent blocks as 77'),
        ('AG 2011 6.3.3 heading', ag, '6.3.3 Probabilistic or Independent Summation', 'error propagation for symmetric distributions (section 6.3.3)'),
        ('FAQ 3.3 example', faq, 'the technical low scenario outcome is 5 and the best estimate outcome is 7 (5 + 2)', 'a technical low outcome of 5 and a best estimate of 7, the best being 5 + 2'),
        ('FAQ 3.3 question', faq, '3.3. Question : 1P = 0', 'FAQ 3.3'),
        ('FAQ 4.4 cites 3.3.3.2', faq, 'Contract renewals in Contingent Resources', 'PRMS 3.3.3.2, which the FAQ\'s answer 4.4 cites'),
        ('FAQ answers dated October 2022', faq, '[Oct. 2022]', 'answers dated October 2022'),
        ('errata item 5 on economic', err, 'Inconsistency between 3.1.2.1 and glossary for definition of Economic', 'errata (May 2022, item 5)'),
        ('PRMS 3.3.3.2 on the contract term', prms, 'Reserves cannot be claimed for those quantities that will be produced beyond the expiration date of the current agreement', 'PRMS 3.3.3.2'),
        ('the SPE licence', spe, 'Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License', 'CC BY-NC-ND 4.0'),
        ('NUPRC release date', nu, 'Published On April 1, 2026', '1 April 2026'),
        ('NUPRC associated gas', nu, 'Associated Gas (AG) and Non-Associated Gas (NAG) reserves stand at 100.21 Trillion Cubic Feet (TCF) and 114.98 TCF', '100.21'),
        ('NUPRC total gas', nu, 'total Gas reserves of 215.19 TCF', '215.19 trillion cubic feet'),
        ('NUPRC as at date', nu, 'as of January 1 st , 2026', 'as at 1 January 2026'),
        ('NUPRC crude figure as rendered', nu, 'Crude Oil and Condensate reserves stand at 09 Billion Barrels and 5.92 Billion Barrels, respectively, amounting to a total of 37.01 Billion Barrels', '09 billion barrels beside a condensate figure of 5.92 and a total of 37.01'),
        ('NUPRC all rights reserved', nu, 'All rights reserved', 'its page reads all rights reserved'),
        ('PIA gazette', pia, 'No. 142 Lagos', 'Official Gazette No. 142, Vol. 108, 27 August 2021'),
        ('PIA gazette date', pia, '27th August, 2021 Vol. 108', 'Official Gazette No. 142, Vol. 108, 27 August 2021'),
        ('S.I. 37 gazette', si, 'No. 111 Lagos - 20th June, 2023 Vol. 110', 'Official Gazette No. 111, Vol. 110, 20 June 2023'),
        ('S.I. 37 made', si, '[24th Day of May, 2023]', 'made 24 May 2023'),
        ('S.I. 37 title', si, 'Significant Crude Oil and Gas Discovery Regulations, 2023', 'Significant Crude Oil and Gas Discovery Regulations, 2023'),
        ('Commercial Regulations gazette', com, 'No. 84 Lagos - 5th May, 2025 Vol. 112', 'Official Gazette No. 84, Vol. 112, 5 May 2025'),
        ('Commercial Regulations S.I. 7', com, '7 Nigerian Upstream Petroleum (Commercial) Regulations, 2025', 'S.I. No. 7 of 2025'),
        ('Commercial Regulations reg. 6(c)', com, 'statement of reserves situation or reservoir studies', 'a statement of the reserves situation'),
    ]
    for label, text, want, cited in FIG:
        if want not in text:
            bad.append(f'{label}: the text does not print "{want[:60]}"')
        if norm(cited) not in ndig:
            bad.append(f'{label}: the digest does not cite it as "{cited[:60]}"')
    print(f'  figures and details cited from the texts, checked in the text and in the digest: {len(FIG)}')

    # ---- 2 and 3. the quotations
    body = {k: ' '.join(norm(read(f)) for f in fs) for k, fs in TEXTS.items()}
    concepts = json.load(open(os.path.join(HERE, 'concepts.json'), encoding='utf-8'))
    if len(concepts) < 30:
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
        if re.search(r'\bPRMS\b|\bFAQ|Application Guidelines|\bSPE\b|media release', c['cite'] + c['quote'], re.I):
            bad.append(f'{c["id"]}: a licensed or reserved text is never quoted')
        if not (6 <= n <= 50):
            bad.append(f'{c["id"]}: the quote is {n} words (6 to 50)')
        if q not in body[c['text']]:
            bad.append(f'{c["id"]}: the quote is NOT in {c["text"]}: "{q[:80]}"')
        per[c['text']] = per.get(c['text'], 0) + 1
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
