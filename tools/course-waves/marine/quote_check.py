#!/usr/bin/env python3
"""GATE: every figure the SC4 digest cites from a source is printed by that
source, and every source is the edition the course names.

The course quotes NO source prose (Adan and Resing and Iversen print no
licence; Wikipedia is CC BY-SA; Aas, Halskau and Wallace is taught by concept;
Skoko et al. and the arXiv paper are CC BY 4.0 and cited by table and
equation). What it does cite is FIGURES: the rows of Adan and Resing's Tables
5.1 and 5.2, Iversen's Example 12.3.1, Skoko et al.'s Tables 1, 4, 5 and 7, and
the Wikipedia article's packings. This gate proves three things and prints
every count:

  1. THE TEXTS ARE THE EDITIONS THE COURSE NAMES. Every file read on
     2026-09-27 hashes to the sha256 prefix PINNED below, and every prefix the
     vendored FINDINGS-marine.md (engines #283) records for a file it lists is
     the pinned one.
  2. EVERY FIGURE CITED FROM A TEXT IS PRINTED BY IT, as a run of tokens
     after whitespace is collapsed (a table row is a row of the text).
  3. EVERY FIGURE CHECKED HERE IS CITED IN THE DIGEST, exactly as the digest
     prints it, so a figure the digest dropped or changed fails.

    python3 quote_check.py            check
    python3 quote_check.py --plant    THE NEGATIVE CONTROL: alters one character
                                      of one cited figure in memory; must exit 1
                                      naming it

The source texts live only in the wave directory (/root/cat-wip-marine/sources),
never in the repository: this gate runs in the wave directory and REFUSES
(exit 2) anywhere the texts are absent. It never skips.

Exit 0 clean, 1 a mismatch, 2 could not run.
"""
import hashlib
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.environ.get('SC4_SOURCES', os.path.join(HERE, 'sources'))
ENG = os.environ.get('SC4_ENGINES', '/root/wt-sc4-nextgen/packages/engines')
# sha256 prefixes of the files as read on 2026-09-27
PINS = {
    'adan-resing-queueing.pdf': 'f1a6a2882c6cc19b', 'adan.txt': 'd556570123e8c8c4',
    'itu-teletraffic-2001.pdf': 'f205c11399f67587', 'itu.txt': '5f47c8c5235fee5d',
    'arxiv-2102.05851.pdf': 'fa41bfc9b70e2f5b', 'ev.txt': '8a3bfeddd6490604',
    'jmse-12-00263.pdf': 'e94a40e568ae1e52', 'jmse.txt': '146ab0bfc5db0e7b',
    'aas-halskau-wallace-2009.pdf': '1d72cae6328c2eee', 'aas.txt': 'ad2998b4dfb1ae0b',
    'wiki-ffd.txt': '262c1e6630071a13',
}
# The files FINDINGS-marine.md (sources table) lists with a sha256 prefix.
FINDINGS_PREFIXES = {
    'adan-resing-queueing.pdf': 'f1a6a2882c6cc19b', 'itu-teletraffic-2001.pdf': 'f205c11399f67587',
    'arxiv-2102.05851.pdf': 'fa41bfc9b70e2f5b', 'jmse-12-00263.pdf': 'e94a40e568ae1e52',
    'aas-halskau-wallace-2009.pdf': '1d72cae6328c2eee', 'wiki-ffd.txt': '262c1e6630071a13',
}
# (label, text file, the run of the text, the form the digest prints, or None when the digest prints it in pieces)
FIGURES = [
    ('Adan and Resing Table 5.1, c = 1', 'adan.txt', '1 0.90 9.00', '| 1 | 9 | 0.900000 | 0.900000 | 0.90 | 9.000000 | 9.00 | 9.00 |'),
    ('Adan and Resing Table 5.1, c = 2', 'adan.txt', '2 0.85 4.26', '| 0.85 | 4.263158 | 4.26 | 4.26 |'),
    ('Adan and Resing Table 5.1, c = 5', 'adan.txt', '5 0.76 1.53', '| 0.76 | 1.524986 | 1.52 | 1.53 |'),
    ('Adan and Resing Table 5.1, c = 10', 'adan.txt', '10 0.67 0.67', '| 0.67 | 0.668732 | 0.67 | 0.67 |'),
    ('Adan and Resing Table 5.1, c = 20', 'adan.txt', '20 0.55 0.28', '| 0.55 | 0.275385 | 0.28 | 0.28 |'),
    ('Adan and Resing Table 5.1, its title', 'adan.txt', 'Table 5.1: Performance characteristics for the M/M/c with µ = 1 and ρ = 0.9', 'CHECK ONE: ADAN AND RESING, TABLE 5.1'),
    ('Adan and Resing Table 5.2, c = 1', 'adan.txt', '1 0.90 9.00 9', '| 0.90 | 9.000000 | 9.00 | 9.000000 | 9 |'),
    ('Adan and Resing Table 5.2, c = 2', 'adan.txt', '2 0.95 9.26 19', '| 0.95 | 9.256410 | 9.26 | 19.487179 | 19 |'),
    ('Adan and Resing Table 5.2, c = 5', 'adan.txt', '5 0.98 9.50 51', '| 0.98 | 9.503169 | 9.50 | 51.465529 | 51 |'),
    ('Adan and Resing Table 5.2, c = 10', 'adan.txt', '10 0.99 9.64 105', '| 0.99 | 9.637384 | 9.64 | 105.310104 | 105 |'),
    ('Adan and Resing Table 5.2, c = 20', 'adan.txt', '20 0.995 9.74 214', '| 0.995 | 9.737327 | 9.74 | 213.672804 | 214 |'),
    ('Adan and Resing Table 5.2, the surplus capacity', 'adan.txt', 'a fixed surplus capacity of 0.1 server', 'the surplus capacity held at 0.1 of a server'),
    ('Iversen Example 12.3.1, the example', 'itu.txt', 'Example 12.3.1: Delay system', 'IVERSEN, EXAMPLE 12.3.1'),
    ('Iversen Example 12.3.1, system one', 'itu.txt', 'mean service time of 100 s and the offered traffic is 20 erlang', 'a mean service time of 100 s, 20 erlang and 32 channels'),
    ('Iversen Example 12.3.1, system two', 'itu.txt', 'mean service time equal to 10 s and the offered traffic is 2 erlang', 'the second with 10 s, 2 erlang and 5 channels'),
    ('Iversen Example 12.3.1, the channels', 'itu.txt', 'n1 = 32 channels and n2 = 5 channels', None),
    ('Iversen Example 12.3.1, W1', 'itu.txt', 'W1 = 0.075 s.', '| 0.074697 | 0.075 |'),
    ('Iversen Example 12.3.1, W2', 'itu.txt', 'W2 = 0.199 s.', '| 0.199005 | 0.199 |'),
    ('Iversen Example 12.3.1, the total', 'itu.txt', 'equal to 0.274 s.', 'the printed 0.274 at three decimals'),
    ('Skoko Table 1, the burns', 'jmse.txt', 'Fuel consumption t/h 0.03 0.5 0.03 0.03 0.03 0.5', 'a PSV burns 0.5 t an hour sailing and 0.03 t an hour in port'),
    ('Skoko Table 1, a day of fuel', 'jmse.txt', 'Daily fuel expenses USD 626.4 USD 10,440.00', 'a day of each costs USD 10,440.00 and USD 626.4'),
    ('Skoko, the fuel price', 'jmse.txt', 'Average fuel price (USD/t) 870', 'at USD 870 a tonne'),
    ('Skoko Table 4, the daily distance', 'jmse.txt', 'distance covered by a PSV is 240 NMs, and for an AHTS, it is 264 NMs', 'a PSV covers 240 NM a day and an AHTS 264 NM'),
    ('Skoko, the usable capacity', 'jmse.txt', 'Usable carrying capacity 85% of the average capacity of the vessel', 'use 85% of a vessel'),
    ('Skoko Table 5, the PSV row', 'jmse.txt', 'PSV 0.00 3.81 13.18 2.40 0.00 2.40 4.14', 'the optimal month of the PSV has 3.81 days in port, 13.18 days sailing, 2.40 days of standby at the facility, 2.40 days of standby in port and 4.14 days of offshore supply'),
    ('Skoko Table 5, the AHTS row', 'jmse.txt', 'AHTS 7.00 0.00 0.60 0.00 0.00 2.40 0.00', 'the optimal month of the AHTS has 7.00 days of maritime activities and 0.60 days of navigation'),
    ('Skoko Table 7, the PSV fuel', 'jmse.txt', 'PSV USD 186,274.10', 'USD 186,274.10'),
    ('Skoko Table 7, the AHTS fuel', 'jmse.txt', 'AHTS USD 80,847.36', 'USD 80,847.36'),
    ('Wikipedia, the list', 'wiki-ffd.txt', '44, 24, 24, 22, 21, 17, 8, 8, 6, 6.', None),
    ('Wikipedia, capacity 60', 'wiki-ffd.txt', 'With capacity 60, FFD packs 3 bins: * 44, 8, 8; * 24, 24, 6, 6; * 22, 21, 17.', 'give {44,8,8}, {24,24,6,6}, {22,21,17}'),
    ('Wikipedia, capacity 61', 'wiki-ffd.txt', 'But with capacity 61, FFD packs 4 bins: * 44, 17; * 24, 24, 8; * 22, 21, 8, 6; * 6.', 'give {44,17}, {24,24,8}, {22,21,8,6}, {6}'),
    ('Wikipedia, Huang and Lu at 75', 'wiki-ffd.txt', 'With capacity 75, FFD packs 4 bins: * 51, 12, 12 * 28, 28, 10 * 28, 27, 10, 10 * 25, 10, 10, 10, 10, 10', 'at capacity 75 the list packs into {51,12,12}, {28,28,10}, {28,27,10,10}, {25,10,10,10,10,10}'),
    ('Wikipedia, Dosa 8 against 6', 'wiki-ffd.txt', 'That is, 8 bins total, while the optimum has only 6 bins.', 'the optimum packs the items into 6 bins and first-fit decreasing uses 8'),
    ('Wikipedia, the tight bound', 'wiki-ffd.txt', 'FFD(S,C) = 11/9 \\mathrm{OPT}(S,C) +6/9', 'which is 11/9 of the optimum plus 6/9'),
    ('the arXiv paper, the Cosmetatos terms', 'ev.txt', '(1 − 𝜌)(𝐶 − 1)(√4 + 5𝐶 − 2)', None),
    ('the arXiv paper, Cosmetatos 1975', 'ev.txt', 'Cosmetatos, G. (1975).', 'Cosmetatos (1975)'),
    ('Aas et al., square metres', 'aas.txt', 'Deck capacity is given in square metres', None),
    ('Aas et al., no stacking of containers or baskets', 'aas.txt', 'It is not allowed to stack containers or baskets', None),
    ('Aas et al., the economical speed', 'aas.txt', 'economical speed of around 11–13 knots', None),
]
PLANT = '--plant' in sys.argv


def norm(s):
    return re.sub(r'\s+', ' ', s.replace(' ', ' ')).strip()


def main():
    for f in PINS:
        if not os.path.exists(os.path.join(SRC, f)):
            print(f'REFUSED: {os.path.join(SRC, f)} is missing; the cited figures cannot be checked against the texts')
            return 2
    findings_path = os.path.join(ENG, 'tools/validation/supplychain/FINDINGS-marine.md')
    if not os.path.exists(findings_path):
        print(f'REFUSED: {findings_path} is missing')
        return 2
    digest_path = os.path.join(HERE, 'digest.txt')
    if not os.path.exists(digest_path):
        print(f'REFUSED: {digest_path} is missing')
        return 2
    bad = []
    for f, pin in PINS.items():
        h = hashlib.sha256(open(os.path.join(SRC, f), 'rb').read()).hexdigest()
        ok = h.startswith(pin)
        print(f'  {f}: sha256 {h[:16]} {"is" if ok else "IS NOT"} the pinned prefix')
        if not ok:
            bad.append(f'{f} is not the edition read on 2026-09-27')
    findings = open(findings_path, encoding='utf-8').read()
    for f, pre in FINDINGS_PREFIXES.items():
        ok = pre in findings and PINS[f] == pre
        print(f'  FINDINGS-marine.md records {f} as {pre}: {"yes" if ok else "NO"}')
        if not ok:
            bad.append(f'FINDINGS-marine.md does not record {f} at the pinned prefix')
    texts = {f: norm(open(os.path.join(SRC, f), encoding='utf-8', errors='replace').read()) for f in set(x[1] for x in FIGURES)}
    digest = open(digest_path, encoding='utf-8').read()
    figs = [list(x) for x in FIGURES]
    if PLANT:
        figs[2][2] = figs[2][2].replace('1.53', '1.52')
    in_text = in_digest = 0
    for label, f, run, printed in figs:
        if norm(run) in texts[f]:
            in_text += 1
        else:
            bad.append(f'{label}: "{run}" is not in {f}')
            print(f'  NOT IN THE TEXT  {label}: {run}')
        if printed is not None:
            if printed in digest:
                in_digest += 1
            else:
                bad.append(f'{label}: the digest does not print "{printed}"')
                print(f'  NOT IN THE DIGEST  {label}: {printed}')
    cited = sum(1 for x in figs if x[3] is not None)
    print(f'quote_check: {len(PINS)} files at their pinned editions; {in_text} of {len(figs)} cited figures found in their texts; '
          f'{in_digest} of {cited} found in the digest as it prints them ({len(figs) - cited} checked in the text alone: '
          f'the digest cites them in words or by concept); no source prose is quoted')
    print(f'MISMATCHES: {len(bad)}')
    for b in bad:
        print(f'   {b}')
    if PLANT:
        caught = any('Table 5.1, c = 5' in b for b in bad)
        print(f'NEGATIVE CONTROL: one character of the Table 5.1 c = 5 row was altered in memory; {"caught" if caught else "NOT CAUGHT"}')
        return 1 if caught else 2
    return 1 if bad else 0


sys.exit(main())
