#!/usr/bin/env python3
"""A digest must be COMPLETE, not merely self-consistent.

WHY THIS EXISTS. PD6's generator stopped emitting after Section 18. Twelve of
thirty sections were missing, including the entire inhibitor half its Expert
tier stands on and the Joule-Thomson block its own Section 14 promised in
prose. digestself.mjs passed the whole time, because it checks that the digest
AGREES WITH ITSELF and a truncated file agrees with itself perfectly. numsweep
passed too, because lessons can only quote what is there.

WHAT THE PREVIOUS VERSION DID, AND WHY IT COULD REPORT NOTHING
--------------------------------------------------------------
A gate written because a generator died silently died silently itself:

    if not os.path.exists(src):
        print(f'no digest at {src}')
        return 0

A generator that never ran at all produced no file, and no file was a pass.
Verified empirically on 2026-09-16. Of the 28 live courses with a wave
directory, 13 have no digest.txt, and for every one of them this gate printed
one line and exited 0.

It examined less than it appeared to in one further way: check 3 below is
skipped in silence when there is no BRIEF.md, so a wave with no brief quietly
ran two checks out of three and reported the same "0 completeness problems".
The skip is now printed, and a run in which NO check could be applied is a
refusal rather than a pass.

THREE CHECKS:
  1. FORWARD PROMISES. The digest's own prose says "set against this row
     later", "printed below", "see Section 12". Each promise must land.
  2. SECTION SEQUENCE. Sections must be numbered 1..N with no gap, and the
     file must not end immediately after its highest-numbered section header
     with no content under it.
  3. MODULE COVERAGE. Every module the BRIEF assigns ("Expert m04 owns it")
     should be named by at least one section or comment.

REFUSALS. Exit 2, never 0, when the gate cannot do its job.

    python3 digestpromise.py <wave_dir> [digest.txt]
    python3 digestpromise.py --selftest

Exit codes: 0 clean, 1 completeness problems, 2 REFUSED. Only 0 is a pass.
"""
import argparse
import os
import re
import sys

SECTION = re.compile(r'^#\s*SECTION\s+(\d+)\s*:', re.I)
PROMISE = re.compile(
    r'(set against this row later|printed below|shown below|listed below'
    r'|later in this file|further down|see section\s+(\d+)|in section\s+(\d+)'
    r'|sections?\s+(\d+)\s*(?:to|through|-)\s*(\d+))', re.I)
OWNER = re.compile(r'\b(Associate|Professional|Expert)\s+(m\d{2})\b')


class Refused(Exception):
    """The gate cannot do its job. Never a pass."""


def read_lines(src):
    if not os.path.exists(src):
        raise Refused(
            f'there is no digest at {src}. This gate exists because a generator that dies '
            f'partway fails silently; a generator that never ran at all is the same failure, '
            f'and the previous version excused it with exit 0.')
    text = open(src, encoding='utf-8').read()
    if not text.strip():
        raise Refused(f'{src} is empty')
    return text.splitlines()


def check(lines, brief_path=None):
    """Return (problems, applied, notes). Raises Refused if nothing was checkable."""
    problems, notes = [], []
    applied = []

    secs, last_hdr = {}, None
    for i, ln in enumerate(lines, 1):
        m = SECTION.match(ln.strip())
        if m:
            secs[int(m.group(1))] = i
            last_hdr = (int(m.group(1)), i)
    nums = sorted(secs)

    if nums:
        applied.append('section sequence')
        gaps = [n for n in range(1, max(nums) + 1) if n not in secs]
        if gaps:
            problems.append(f'section numbers missing entirely: {gaps}')
        body = len(lines) - last_hdr[1]
        if body < 3:
            problems.append(
                f'file ends {body} line(s) after the Section {last_hdr[0]} header, '
                f'which is what a generator that died partway looks like')
    else:
        notes.append('no "# SECTION n:" headers at all, so the section-sequence check '
                     'could not be applied')

    promises = 0
    for i, ln in enumerate(lines, 1):
        for m in PROMISE.finditer(ln):
            promises += 1
            tgt = next((g for g in m.groups()[1:] if g), None)
            if tgt is not None:
                if int(tgt) not in secs:
                    problems.append(
                        f'line {i} promises Section {tgt}, which does not exist: {ln.strip()[:80]}')
            else:
                problems.append(
                    f'line {i} makes an UNNUMBERED forward promise, check it lands by hand: '
                    f'{ln.strip()[:80]}')
    if promises:
        applied.append('forward promises')
    else:
        notes.append('the digest makes no forward promises, so that check found nothing to do')

    if brief_path and os.path.exists(brief_path):
        owed = {f'{t} {m}' for t, m in OWNER.findall(open(brief_path, encoding='utf-8').read())}
        if owed:
            applied.append('module coverage')
            named = {f'{t} {m}' for t, m in OWNER.findall('\n'.join(lines))}
            orphan = sorted(owed - named)
            if orphan:
                problems.append('module(s) the BRIEF assigns that no digest section names: '
                                + ', '.join(orphan))
        else:
            notes.append(f'{os.path.basename(brief_path)} assigns no "<Tier> mNN" module, '
                         f'so the coverage check could not be applied')
    else:
        notes.append('no BRIEF.md, so the module-coverage check was SKIPPED (the previous '
                     'version skipped it in silence)')

    if not applied:
        raise Refused(
            'not one of the three completeness checks could be applied to this digest: '
            'no section headers, no forward promises and no brief to check coverage against. '
            'The gate examined nothing, which is not a pass.')
    return problems, applied, notes


# --------------------------------------------------------- negative control

GOOD = """# SECTION 1: the setup
rate = 310.25
more text here
# SECTION 2: the sweep, compared in section 3
value = 12.5
another line
# SECTION 3: the comparison
final = 99.5
closing commentary
and one more line
""".splitlines()


def selftest():
    ok = True

    def chk(name, cond):
        nonlocal ok
        print(f'  {"PASS" if cond else "FAIL"}  {name}')
        ok = ok and cond

    def refuses(name, fn):
        try:
            fn()
        except Refused:
            chk(name, True)
            return
        chk(name, False)

    print('negative control')
    import shutil
    import tempfile
    d = tempfile.mkdtemp()
    try:
        probs, applied, notes = check(GOOD)
        chk('a complete digest reports no problem', probs == [])
        chk('and it really did apply the section-sequence check', 'section sequence' in applied)
        chk('and the missing-BRIEF skip is stated out loud',
            any('BRIEF' in n for n in notes))

        gap = [l for l in GOOD if not l.startswith('# SECTION 2')]
        chk('a missing section number goes RED',
            any('missing entirely' in p for p in check(gap)[0]))

        truncated = GOOD[:GOOD.index('# SECTION 3: the comparison') + 1]
        chk('a digest that ends at its last header goes RED',
            any('died partway' in p for p in check(truncated)[0]))

        broken = [l.replace('in section 3', 'in section 9') for l in GOOD]
        chk('a promise to a section that does not exist goes RED',
            any('promises Section 9' in p for p in check(broken)[0]))

        chk('removing the planted defects goes green again', check(GOOD)[0] == [])

        brief = os.path.join(d, 'BRIEF.md')
        open(brief, 'w').write('Expert m04 owns the inhibitor block.\nProfessional m03 owns the rest.\n')
        probs, applied, _ = check(GOOD, brief)
        chk('a module the BRIEF assigns that no section names goes RED',
            any('no digest section names' in p for p in probs))
        chk('and the coverage check is recorded as applied', 'module coverage' in applied)
        covered = GOOD + ['# Expert m04 and Professional m03 are covered here']
        chk('naming those modules goes green again', check(covered, brief)[0] == [])

        # REFUSALS
        refuses('a MISSING digest is REFUSED, not excused with exit 0',
                lambda: read_lines(os.path.join(d, 'nope.txt')))
        empty = os.path.join(d, 'empty.txt')
        open(empty, 'w').write('\n \n')
        refuses('an empty digest is REFUSED', lambda: read_lines(empty))
        refuses('a digest with no sections, no promises and no brief is REFUSED',
                lambda: check(['just some prose', 'with numbers 12.5']))
    finally:
        shutil.rmtree(d, ignore_errors=True)

    print('\nnegative control: ' + ('ALL PASS' if ok else 'FAILURES ABOVE'))
    return 0 if ok else 1


# --------------------------------------------------------------------- main

def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('wave_dir', nargs='?')
    ap.add_argument('digest', nargs='?')
    ap.add_argument('--selftest', action='store_true')
    args = ap.parse_args()

    if args.selftest:
        return selftest()
    if not args.wave_dir:
        ap.print_help()
        return 2
    wave = args.wave_dir.rstrip('/')
    src = args.digest or os.path.join(wave, 'digest.txt')
    try:
        lines = read_lines(src)
        problems, applied, notes = check(lines, os.path.join(wave, 'BRIEF.md'))
    except Refused as exc:
        print(f'\nREFUSED: {exc}')
        print('This gate does not pass on an empty or unreadable sweep.')
        return 2
    secs = sum(1 for ln in lines if SECTION.match(ln.strip()))
    print(f'{os.path.basename(src)}: {len(lines)} lines, {secs} sections; '
          f'checks applied: {", ".join(applied)}')
    for n in notes:
        print(f'  note  {n}')
    for p in problems:
        print('  PROBLEM  ' + p)
    print(f'  => {len(problems)} completeness problem(s)')
    return 1 if problems else 0


if __name__ == '__main__':
    sys.exit(main())
