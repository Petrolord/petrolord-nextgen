#!/usr/bin/env python3
"""Lesson length gate for FC5 Relief & Flare Systems: prose words must sit
between each lesson's own minimum, derived from its estimated minutes, and the
band ceiling, and the ranking by minutes and the ranking by length must agree.

WHAT IS EXCLUDED, MEASURED FROM THE CODE BELOW RATHER THAN CLAIMED: front
matter, markdown TABLE ROWS (lines whose first non-space character is |) and
PANEL markers (lines starting with {{panel). HEADINGS ARE COUNTED.

THIS WAVE SHIPPED WITHOUT THIS FILE AND FIVE PLACES DESCRIBED A MEASURE NOTHING
IMPLEMENTED. LESSON_TASK.md, BRIEF.md, structure.py's header, the scaffold
placeholder body and wave.json's `measure` all said HEADINGS WERE EXCLUDED from
the prose-word count. Every sibling wave's lengths.py COUNTS them, and every
sibling's docstring already records that exact trap as having run its writers 20
to 40 words LIGHT against the band on every lesson. All three FC5 tier writers
had to count both ways to find out which the band meant. The five statements now
say what this file does, and this file does what its siblings do, because the
counts every already-written wave was measured against were produced by the code
and not by the prose.

THE MINIMUM IS PER LESSON, NOT FLAT. structure.py derives it from est_minutes
(12 minutes clears 420 words, 13 clears 460, 14 clears 500) and the manifest
carries both ends as min_prose_words and max_prose_words. This gate reads the
MANIFEST, so a lesson whose manifest entry disagrees with structure.py is caught
by structure.py and a lesson whose BODY disagrees with its manifest entry is
caught here. A flat 420 floor would pass a fourteen-minute lesson 80 words short.

    python3 lengths.py                     the committed course
    COURSE_DIR=<dir> python3 lengths.py    somewhere else

Exit codes: 0 every lesson in band and the ranking holds, 1 something is out,
2 REFUSED (nothing to measure, which is never a pass).
"""
import json
import os
import sys

W = os.environ.get(
    'COURSE_DIR', '/root/wt-fc5-nextgen/src/content/courses/relief')
TIERS = ['beginner', 'intermediate', 'advanced']


def prose_words(path):
    """The measure, and the ONLY place in this wave that defines it."""
    txt = open(path, encoding='utf-8').read()
    if txt.startswith('---'):
        txt = txt.split('---', 2)[2]
    body = [ln for ln in txt.splitlines()
            if not ln.lstrip().startswith('|')
            and not ln.lstrip().startswith('{{panel')]
    return len(' '.join(body).split())


def main():
    if not os.path.isdir(W):
        print(f'REFUSED: no course directory at {W}, so nothing was measured. '
              'A length gate that read no lessons is not a pass.')
        return 2
    bad = 0
    measured = 0
    for tier in TIERS:
        man_path = f'{W}/{tier}/manifest.json'
        if not os.path.exists(man_path):
            print(f'REFUSED: no manifest at {man_path}')
            return 2
        man = json.load(open(man_path, encoding='utf-8'))
        rows = []
        for m in man['modules']:
            for l in m['lessons']:
                p = f"{W}/{tier}/{m['key']}/{l['key']}.md"
                name = f"{m['key']}/{l['key']}"
                lo = l.get('min_prose_words')
                hi = l.get('max_prose_words')
                if lo is None or hi is None:
                    print(f'  {name}: manifest carries no word band')
                    bad += 1
                    continue
                if not os.path.exists(p):
                    rows.append((l['est_minutes'], None, name, lo, hi))
                    continue
                rows.append((l['est_minutes'], prose_words(p), name, lo, hi))
        done = [r for r in rows if r[1] is not None]
        measured += len(done)
        print(f'{tier}: {len(done)}/{len(rows)} written')
        for mins, w, name, lo, hi in sorted(done):
            flag = '' if lo <= w <= hi else f'  OUT OF BAND ({lo}..{hi})'
            if flag:
                bad += 1
            print(f'  {mins:>2} {w:>4} {name}{flag}')
        # THE RANKING. A longer lesson must not be estimated shorter: the mean
        # prose words per est_minutes bucket has to rise with the minutes.
        by = {}
        for mins, w, _n, _lo, _hi in done:
            by.setdefault(mins, []).append(w)
        means = [(k, sum(v) / len(v)) for k, v in sorted(by.items())]
        print('  mean by minutes:', ' '.join(f'{k}:{v:.0f}' for k, v in means))
        for (k1, v1), (k2, v2) in zip(means, means[1:]):
            if v2 <= v1:
                print(f'  RANKING BROKEN: {k2}-minute lessons mean {v2:.0f} words '
                      f'against {v1:.0f} for {k1}-minute ones')
                bad += 1
    if measured == 0:
        print('REFUSED: no written lesson was measured, and a sweep of zero '
              'files is not a pass.')
        return 2
    print(f'lessons measured: {measured}   out of band or out of rank: {bad}')
    print('the measure: prose words, with front matter, markdown table rows and '
          '{{panel:...}} lines excluded and HEADINGS COUNTED')
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
