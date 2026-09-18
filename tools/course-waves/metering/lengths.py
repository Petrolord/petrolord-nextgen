#!/usr/bin/env python3
"""FC8 lesson length gate. Prose words must sit between each lesson's own
minimum, derived from its est_minutes through structure.py's MIN_WORDS, and
structure.py's band ceiling.

SCOPED PER TIER, AND THAT IS NOT A CONVENIENCE. Several waves shipped without a
lengths.py of their own and each tier writer kept a private copy; the shared
ones summed all three tiers, so a writer reading their own tier's numbers got a
figure that moved whenever a neighbouring writer saved a file. Every band check,
every mean and every ranking check here is computed INSIDE ONE TIER and no count
is summed across tiers. `--tier <name>` narrows it to one.

WHAT IS EXCLUDED, READ OFF THE CODE BELOW RATHER THAN CLAIMED:
  * front matter, meaning everything between the leading triple dashes;
  * markdown TABLE ROWS, meaning any line whose first non-space character is a
    pipe;
  * PANEL MARKERS, meaning any line whose first non-space characters are
    {{panel.
EVERYTHING ELSE IS COUNTED, INCLUDING EVERY HEADING, including the H1 that is
the lesson title. Older waves' task files said headings were excluded and the
code never did that, so a writer who trusted the task file ran 20 to 40 words
LIGHT on every lesson. The code is the authority here because every already
written wave was measured by it.

    python3 lengths.py                     the committed course
    COURSE_DIR=<dir> python3 lengths.py    somewhere else
    python3 lengths.py --tier advanced     one tier only

Exit: 0 in band and in rank, 1 something out, 2 REFUSED (nothing measured).
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from structure import TIERS, WORD_BAND, MIN_WORDS  # noqa: E402

W = os.environ.get('COURSE_DIR', '/root/wt-fc8-nextgen/src/content/courses/metering')
PLACEHOLDER = 'FC8 SCAFFOLD PLACEHOLDER'


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
        if want not in TIERS:
            print(f'REFUSED: there is no tier named {want}.')
            return 2
    if not os.path.isdir(W):
        print(f'REFUSED: no course directory at {W}.')
        return 2
    bad = 0
    measured = 0
    placeholders = 0
    for tier, mods in TIERS.items():
        if want and tier != want:
            continue
        rows = []
        for mkey, _mtitle, lessons in mods:
            for lkey, _lt, mins, _panels in lessons:
                p = f'{W}/{tier}/{mkey}/{lkey}.md'
                name = f'{mkey}/{lkey}'
                lo, hi = MIN_WORDS[mins], WORD_BAND[1]
                if not os.path.exists(p):
                    rows.append((mins, None, name, lo, hi))
                    continue
                if PLACEHOLDER in open(p, encoding='utf-8').read():
                    placeholders += 1
                    rows.append((mins, None, name, lo, hi))
                    continue
                rows.append((mins, prose_words(p), name, lo, hi))
        done = [r for r in rows if r[1] is not None]
        measured += len(done)
        print(f'{tier}: {len(done)}/{len(rows)} written   (this tier only)')
        for mins, words, name, lo, hi in sorted(done):
            flag = '' if lo <= words <= hi else f'  OUT OF BAND ({lo}..{hi})'
            if flag:
                bad += 1
            print(f'  {mins:>2} {words:>4} {name}{flag}')
        by = {}
        for mins, words, _n, _lo, _hi in done:
            by.setdefault(mins, []).append(words)
        means = [(k, sum(v) / len(v)) for k, v in sorted(by.items())]
        if means:
            print('  mean by minutes (within this tier):',
                  ' '.join(f'{k}:{v:.0f}' for k, v in means))
        for (k1, v1), (k2, v2) in zip(means, means[1:]):
            if v2 <= v1:
                print(f'  RANKING BROKEN: {k2}-minute lessons mean {v2:.0f} '
                      f'words against {v1:.0f} for {k1}-minute ones')
                bad += 1
    print(f'  unwritten or still carrying the scaffold placeholder: {placeholders}')
    if measured == 0:
        print('REFUSED: no written lesson was measured. At the foundation stage every '
              'lesson is still a placeholder, which is the expected state and is still '
              'not a pass.')
        return 2
    print(f'lessons measured: {measured}   out of band or out of rank: {bad}')
    print('the measure: prose words, front matter, table rows and {{panel:...}} lines '
          'excluded, HEADINGS COUNTED, every check inside one tier')
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
