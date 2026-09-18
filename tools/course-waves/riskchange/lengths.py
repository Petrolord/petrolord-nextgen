#!/usr/bin/env python3
"""FC6 lesson length gate. Prose words must sit between each lesson's own
minimum, derived from its est_minutes through structure.py's MIN_WORDS, and
structure.py's band ceiling. SCOPED PER TIER: every band check, every mean and
every ranking check is computed inside one tier and no count is summed across
tiers.

WHAT IS EXCLUDED, read off the code below rather than claimed: front matter,
markdown TABLE ROWS (first non-space character |) and PANEL markers (lines
starting with {{panel). HEADINGS ARE COUNTED, which is what every sibling
wave's lengths.py does and what the already-written tiers were measured
against.

    python3 lengths.py                     the committed course
    COURSE_DIR=<dir> python3 lengths.py    somewhere else
    python3 lengths.py --tier advanced     one tier

Exit: 0 in band and in rank, 1 something out, 2 REFUSED (nothing measured).
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from structure import TIERS, WORD_BAND, MIN_WORDS  # noqa: E402

W = os.environ.get(
    'COURSE_DIR', '/root/wt-as-riskchange-nextgen/src/content/courses/riskchange')


def prose_words(path):
    txt = open(path, encoding='utf-8').read()
    if txt.startswith('---'):
        txt = txt.split('---', 2)[2]
    body = [ln for ln in txt.splitlines()
            if not ln.lstrip().startswith('|')
            and not ln.lstrip().startswith('{{panel')]
    return len(' '.join(body).split())


def main(argv):
    want = None
    if '--tier' in argv:
        want = argv[argv.index('--tier') + 1]
    if not os.path.isdir(W):
        print(f'REFUSED: no course directory at {W}.')
        return 2
    bad = 0
    measured = 0
    for tier, mods in TIERS.items():
        if want and tier != want:
            continue
        rows = []
        for mkey, _mtitle, lessons in mods:
            for lkey, _lt, mins, _panels in lessons:
                p = f'{W}/{tier}/{mkey}/{lkey}.md'
                name = f'{mkey}/{lkey}'
                lo, hi = MIN_WORDS[mins], WORD_BAND[1]
                rows.append((mins, prose_words(p) if os.path.exists(p) else None,
                             name, lo, hi))
        done = [r for r in rows if r[1] is not None]
        measured += len(done)
        print(f'{tier}: {len(done)}/{len(rows)} written   (this tier only)')
        for mins, w, name, lo, hi in sorted(done):
            flag = '' if lo <= w <= hi else f'  OUT OF BAND ({lo}..{hi})'
            if flag:
                bad += 1
            print(f'  {mins:>2} {w:>4} {name}{flag}')
        by = {}
        for mins, w, _n, _lo, _hi in done:
            by.setdefault(mins, []).append(w)
        means = [(k, sum(v) / len(v)) for k, v in sorted(by.items())]
        print('  mean by minutes (within this tier):',
              ' '.join(f'{k}:{v:.0f}' for k, v in means))
        for (k1, v1), (k2, v2) in zip(means, means[1:]):
            if v2 <= v1:
                print(f'  RANKING BROKEN: {k2}-minute lessons mean {v2:.0f} '
                      f'words against {v1:.0f} for {k1}-minute ones')
                bad += 1
    if measured == 0:
        print('REFUSED: no written lesson was measured.')
        return 2
    print(f'lessons measured: {measured}   out of band or out of rank: {bad}')
    print('the measure: prose words, front matter, table rows and {{panel:...}} '
          'lines excluded, HEADINGS COUNTED, every check inside one tier')
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
