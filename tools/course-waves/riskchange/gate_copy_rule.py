#!/usr/bin/env python3
"""GATE: the owner copy rule, over everything a learner reads and everything a
writer is briefed with.

No em dashes, no en dashes, and no "X, not Y" contrastive, in the digest, in any
lesson body, in any manifest title, or in the five task files this wave hands to
its writers. Headings included.

The digest is swept because every lesson is written from it, so a contrastive in
the digest becomes a contrastive in a lesson. The BRIEFS are swept because a rule
a brief breaks is a rule the writer will break. `structure.py` is swept for TITLES
ONLY, because its own gate line has to contain the characters it looks for.

TWO CLASSES ARE EXEMPT BY SHAPE, not by a list that can rot:
  * a line that STATES the rule has to contain the pattern to state it, and is
    recognised by carrying the pattern inside quotation marks;
  * a VERBATIM ENGINE STRING in the digest, which is an engines-repo sweep and
    not this wave's to edit. Recognised by the refusal prefix the generator
    prints, and counted and printed separately so it can never grow unnoticed.

It prints how many files and how many lines it examined and refuses if that is
too little to have checked anything.
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = '/root/wt-as-riskchange-nextgen'
COURSE = os.path.join(REPO, 'src/content/courses/riskchange')
BRIEFS = ['BRIEF.md', 'LESSON_TASK.md', 'BANK_TASK.md', 'KEY_TRUTH_TASK.md', 'PANELS.md']
DASHES = re.compile('[—–]')
CONTRASTIVE = re.compile(r',\s+not\s+\w')
STATES_THE_RULE = re.compile(r'["“]X, not Y["”]')
ENGINE_VERBATIM = re.compile(r'^- (?:REFUSED|FRAMED)')

def in_quoted_span(line, at):
    """True when position `at` sits inside a double-quoted span on this line.
    A digest row quotes engine notes verbatim, and an engine's own wording is an
    engines-repo sweep rather than this wave's to edit. Restricted to the digest
    by the caller, so a lesson cannot hide a contrastive inside quotation marks."""
    spans, start = [], None
    for i, ch in enumerate(line):
        if ch == '"':
            if start is None:
                start = i
            else:
                spans.append((start, i)); start = None
    return any(a < at < b for a, b in spans)

def sweep(label, text, quotes_the_engine=False):
    out, engine, stated = [], 0, 0
    for i, line in enumerate(text.split('\n'), 1):
        m = CONTRASTIVE.search(line)
        hit = bool(DASHES.search(line)) or bool(m)
        if not hit:
            continue
        if STATES_THE_RULE.search(line):
            stated += 1
            continue
        if ENGINE_VERBATIM.match(line):
            engine += 1
            continue
        if quotes_the_engine and m and in_quoted_span(line, m.start()):
            engine += 1
            continue
        kind = 'dash' if DASHES.search(line) else 'contrastive'
        out.append((label, i, kind, line.strip()[:110]))
    return out, engine, stated

def main():
    bad, files, lines, engine, stated = [], 0, 0, 0, 0
    for name in ['digest.txt'] + BRIEFS:
        p = os.path.join(HERE, name)
        if not os.path.isfile(p):
            print(f'  GATE REFUSES: {name} is missing, and this gate sweeps it')
            return 2
        t = open(p, encoding='utf-8').read()
        b, e, st = sweep(name, t, quotes_the_engine=(name == 'digest.txt'))
        bad += b; engine += e; stated += st
        files += 1; lines += t.count('\n') + 1
    lessons = 0
    for root, _, names in os.walk(COURSE):
        for n in sorted(names):
            p = os.path.join(root, n)
            if n.endswith('.md'):
                t = open(p, encoding='utf-8').read()
                b, e, st = sweep(os.path.relpath(p, COURSE), t)
                bad += b; engine += e; stated += st
                files += 1; lessons += 1; lines += t.count('\n') + 1
            elif n == 'manifest.json':
                m = json.load(open(p))
                titles = [mm['title'] for mm in m['modules']] + \
                         [l['title'] for mm in m['modules'] for l in m['modules'][0]['lessons'][:0]] + \
                         [l['title'] for mm in m['modules'] for l in mm['lessons']]
                b, e, st = sweep(os.path.relpath(p, COURSE), '\n'.join(titles))
                bad += b; engine += e; stated += st
                files += 1; lines += len(titles)
    print(f'  files examined: {files} ({lessons} lesson body/bodies on disk)')
    print(f'  lines and titles examined: {lines}')
    print(f'  exempt because the line STATES the rule: {stated}')
    print(f'  exempt as a VERBATIM ENGINE STRING in the digest: {engine} (an engines-repo sweep, not this wave\'s)')
    print(f'  VIOLATIONS: {len(bad)}')
    for f, i, kind, ctx in bad:
        print(f'   {kind.upper()} {f}:{i}  {ctx}')
    if files < 6 or lines < 500:
        print('  GATE REFUSES: it examined too little to have checked anything')
        return 2
    return 1 if bad else 0

if '--selftest' in sys.argv:
    ok = True
    probe = ('a plain line\n'
             'an em dash \u2014 here\n'
             'this is A, not B\n'
             'no em dashes and no "X, not Y" here\n'
             '- REFUSED, x: it was A, not B\n'
             '- the note reads "this is the log mean, not the corrected driving force"\n')
    b, e, st = sweep('digest.txt', probe, quotes_the_engine=True)
    ok = ok and len(b) == 2 and st == 1 and e == 2
    print(f'  control 1, in the digest: {len(b)} caught (a dash and a bare contrastive), '
          f'{st} exempt as the rule stating itself, {e} exempt as verbatim engine strings')
    b2, e2, st2 = sweep('lesson.md', probe, quotes_the_engine=False)
    ok = ok and len(b2) == 3 and e2 == 1
    print(f'  control 2, in a lesson: {len(b2)} caught, so a contrastive hidden inside quotation marks '
          f'is NOT exempt outside the digest')
    print(f'[gate_copy_rule] selftest {"OK" if ok else "FAILED"}')
    sys.exit(0 if ok else 1)
sys.exit(main())
