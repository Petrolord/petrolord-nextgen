#!/usr/bin/env python3
"""Flag sentences that pair figures from DIFFERENT ROWS of the SAME digest table.

WHY THIS EXISTS. A PD7 lesson said: "Take AGBADA-9 off that system and the
survivors gain 469.025752507 lb/d between them, against the 3992.446687538 lb/d
it was reported to be making." Both figures are real digest values, so numsweep
passed. But 3992.446687538 is t3's reported rate and 469.025752507 is t2's
survivor gain: one well's number paired with another well's, in the paragraph
whose whole point is that the two must not be confused.

No numeric gate can see this. numsweep checks that every literal EXISTS in the
digest; it cannot check that the literals in one claim came from the SAME row.

THIS IS A REPORT, NOT A FAILURE. Crossing rows is often legitimate, for example
a sweep quoted as "at 0.20 it gives X and at 1.00 it gives Y". So a run that
finds candidates still exits 0 and a human reads them. What must NOT exit 0 is
a run that examined nothing, and that is what this gate used to do.

WHAT THE PREVIOUS VERSION DID, AND WHY IT COULD REPORT NOTHING
--------------------------------------------------------------
It returned 0 unconditionally, and its first act was to excuse a missing
digest:

    if not os.path.exists(digest):
        print('no digest'); return 0

Verified empirically on 2026-09-16. Of the 28 live courses with a wave
directory, 13 have no digest.txt, so this gate has only ever printed "no
digest" for them. A missing digest, a missing content directory, a digest with
no table rows in it and a lesson set with no multi-figure sentence were all
indistinguishable from a clean report.

TWO WAYS IT EXAMINED LESS THAN IT APPEARED TO.

  * ITS SENTENCE SPLITTER WAS GUARDED AGAINST THE WRONG THING. It split on
    `(?<!\\d)[.!?](?:\\s+|$)`, refusing to split after a digit so that a decimal
    point could not cut a figure in half. But the `(?:\\s+|$)` already
    guarantees that: a decimal point inside 3.14 is followed by a digit, never
    by whitespace. All the lookbehind did was refuse to end a sentence that
    ends in a number, which in a course of engineering prose is most of them.
    Measured over the 3433 lesson files production serves, it merged 6975
    sentence boundaries across 2229 files. Merging two sentences into one is
    not a safe direction here: this gate's whole question is "are these two
    figures in the SAME sentence", and the guard silently answered yes for
    pairs that were in different ones. The lookbehind is removed.
  * ITS NUMBER PATTERN ONLY SEES FIVE OR MORE DECIMAL PLACES. Across the 17
    digests on disk that is 20248 of 40302 decimal literals: HALF of every
    digest is invisible to the pairing check. That is a deliberate
    signal-to-noise choice, so it stays the default, but the run now prints
    what it could not see and --min-decimals lowers it.

REFUSALS. Exit 2, never 0, when the gate cannot do its job.

    python3 crosspair.py <wave_dir> [--content DIR] [--min-decimals N]
    python3 crosspair.py --selftest

Exit codes: 0 examined and reported, 2 REFUSED. Only 0 is a pass, and a
candidate list under exit 0 still has to be read.
"""
import argparse
import json
import os
import re
import sys
from collections import defaultdict

TIERS = ('beginner', 'intermediate', 'advanced')
DEFAULT_REPO = '/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen'
# A decimal point is never followed by whitespace, so `(?:\s+|$)` is the whole
# guard a sentence splitter needs. See the header.
SENT_SPLIT = re.compile(r'[.!?](?:\s+|$)')


class Refused(Exception):
    """The gate cannot do its job. Never a pass."""


def num_re(min_decimals):
    return re.compile(r'\d+\.\d{%d,}|\d+\.\d+e[-+]?\d+' % min_decimals, re.I)


def load_digest(digest, min_decimals):
    if not os.path.exists(digest):
        raise Refused(f'there is no digest at {digest}, so there are no table rows to pair '
                      f'figures against. The previous version printed "no digest" and exited 0.')
    NUM = num_re(min_decimals)
    ANY = re.compile(r'\d+\.\d+')
    where, sig = defaultdict(set), {}
    seen_any = 0
    for i, line in enumerate(open(digest, encoding='utf-8'), 1):
        if line.lstrip().startswith('#'):
            continue
        seen_any += len(ANY.findall(line))
        vals = NUM.findall(line)
        if not vals:
            continue
        # normalise EVERY digit, not only the long literals: the row label
        # itself carries digits ("t2", "t3"), and leaving those in gives two
        # rows of one table different signatures.
        sig[i] = re.sub(r'\d', '#', line).strip()
        for v in vals:
            where[v].add(i)
    if not where:
        raise Refused(
            f'{digest} carries not one literal of {min_decimals}+ decimal places, so no table '
            f'row could be identified ({seen_any} shorter decimal literal(s) are present; '
            f'try --min-decimals). Examining nothing is not a pass.')
    bysig = defaultdict(set)
    for ln, s in sig.items():
        bysig[s].add(ln)
    groups = {s: lns for s, lns in bysig.items() if len(lns) > 1}
    if not groups:
        raise Refused(
            f'{digest} has {len(sig)} numbered line(s) but NO two of them share a signature, '
            f'so it contains no table this gate can cross rows of. That is not a pass: it '
            f'means the digest is not shaped the way this check assumes.')
    invisible = seen_any - sum(len(v) for v in where.values())
    return where, sig, groups, invisible, seen_any


def lesson_files(content):
    if not os.path.isdir(content):
        raise Refused(f'the course content directory does not exist: {content}')
    out = []
    for tier in TIERS:
        for root, _, files in os.walk(os.path.join(content, tier)):
            for fn in sorted(files):
                if fn.endswith('.md'):
                    out.append(os.path.join(root, fn))
    if not out:
        raise Refused(f'no lesson .md files under {content}. A sweep of zero lessons is not a pass.')
    return out


def sweep(where, sig, files, content, min_decimals):
    NUM = num_re(min_decimals)
    hits, checked = [], 0
    for path in files:
        body = open(path, encoding='utf-8').read()
        # Drop markdown table rows: a table quoting a whole sweep is exactly
        # what the contiguity rule REQUIRES, so every table is a legitimate row
        # crossing and including them buries the real hits.
        body = '\n'.join(ln for ln in body.splitlines() if not ln.lstrip().startswith('|'))
        for sent in SENT_SPLIT.split(body):
            vals = [v for v in NUM.findall(sent) if v in where]
            if len(vals) < 2:
                continue
            checked += 1
            found = False
            for a in range(len(vals)):
                if found:
                    break
                for b in range(a + 1, len(vals)):
                    la, lb = where[vals[a]], where[vals[b]]
                    if la & lb:
                        continue  # some line carries both: fine
                    pairs = {(x, y) for x in la for y in lb
                             if x != y and sig.get(x) and sig[x] == sig.get(y)}
                    if pairs:
                        x, y = sorted(pairs)[0]
                        hits.append((os.path.relpath(path, content), vals[a], x, vals[b], y,
                                     sent.strip()[:150]))
                        found = True
                        break
    if checked == 0:
        raise Refused(
            f'{len(files)} lesson file(s) held NOT ONE sentence quoting two digest figures, so '
            f'the pairing check was never applied to anything. That is not a pass.')
    return hits, checked


# --------------------------------------------------------- negative control

DIGEST = """# commentary
t1 rate = 3992.446687538 gain = 111.111111111
t2 rate = 1234.567890123 gain = 469.025752507
t3 rate = 5555.555555555 gain = 222.222222222
"""


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
        dig = os.path.join(d, 'digest.txt')
        open(dig, 'w').write(DIGEST)
        where, sig, groups, invisible, seen = load_digest(dig, 5)
        chk('the digest rows are recognised as one table', len(groups) == 1)

        content = os.path.join(d, 'courses', 'zz')

        def lessons(*bodies):
            """Rewrite the whole course so each case starts from a known state."""
            import shutil as _sh
            _sh.rmtree(content, ignore_errors=True)
            for t in TIERS:
                os.makedirs(os.path.join(content, t, 'm01'), exist_ok=True)
            for i, body in enumerate(bodies):
                open(os.path.join(content, 'beginner', 'm01', f'l{i + 1:02d}.md'), 'w').write(body)
            return lesson_files(content)

        SAME_ROW = 'The t1 system makes 3992.446687538 lb/d and gains 111.111111111 lb/d.\n'
        hits, checked = sweep(where, sig, lessons(SAME_ROW), content, 5)
        chk('two figures from the SAME row are not flagged', hits == [] and checked == 1)

        cross = 'The survivors gain 469.025752507 lb/d against the 3992.446687538 lb/d reported.\n'
        hits, checked = sweep(where, sig, lessons(cross), content, 5)
        chk('a planted cross-row pairing goes RED', len(hits) == 1)
        chk('and it names both digest lines', hits and hits[0][2] != hits[0][4])

        chk('removing the planted pairing goes green again',
            sweep(where, sig, lessons(SAME_ROW), content, 5)[0] == [])

        # THE SENTENCE-SPLIT DEFECT. Two figures from different rows, in two
        # DIFFERENT sentences, the first ending in a number. The old `(?<!\d)`
        # lookbehind refused to split there, merged them into one sentence and
        # reported a pairing that does not exist. The second file gives the run
        # a genuine multi-figure sentence so the refusal is not what is being
        # measured here.
        two_sentences = 'The survivors gain 469.025752507. The reported rate was 3992.446687538.\n'
        hits, checked = sweep(where, sig, lessons(two_sentences, SAME_ROW), content, 5)
        chk('two figures in two sentences are NOT reported as one pairing',
            hits == [] and checked == 1)
        OLD = re.compile(r'(?<!\d)[.!?](?:\s+|$)')
        merged = len(OLD.split('The survivors gain 469.025752507. The rate was 3992.446687538.'))
        chk('and the old splitter demonstrably merged them', merged < 3)

        # the blind spot is declared
        short = os.path.join(d, 'short.txt')
        open(short, 'w').write('t1 a = 1.2345 b = 9.8765\nt2 a = 2.3456 b = 8.7654\n')
        refuses('a digest with no literal long enough to index is REFUSED',
                lambda: load_digest(short, 5))
        w2, s2, g2, inv2, seen2 = load_digest(short, 4)
        chk('lowering --min-decimals makes those rows visible', len(g2) == 1)

        # REFUSALS
        refuses('a MISSING digest is REFUSED, not excused with exit 0',
                lambda: load_digest(os.path.join(d, 'nope.txt'), 5))
        flat = os.path.join(d, 'flat.txt')
        open(flat, 'w').write('only one row = 1.234567890\n')
        refuses('a digest with no two rows sharing a signature is REFUSED',
                lambda: load_digest(flat, 5))
        refuses('a missing content directory is REFUSED',
                lambda: lesson_files(os.path.join(d, 'no-such-course')))
        empty = os.path.join(d, 'empty', 'zz')
        for t in TIERS:
            os.makedirs(os.path.join(empty, t), exist_ok=True)
        refuses('a content directory with no lessons is REFUSED', lambda: lesson_files(empty))
        none_files = lessons('No figures here at all.\n')
        refuses('lessons with no multi-figure sentence are REFUSED',
                lambda: sweep(where, sig, none_files, content, 5))
    finally:
        shutil.rmtree(d, ignore_errors=True)

    print('\nnegative control: ' + ('ALL PASS' if ok else 'FAILURES ABOVE'))
    return 0 if ok else 1


# --------------------------------------------------------------------- main

def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('wave_dir', nargs='?')
    ap.add_argument('--content', help='course content directory (defaults to the repo)')
    ap.add_argument('--min-decimals', type=int, default=5)
    ap.add_argument('--selftest', action='store_true')
    args = ap.parse_args()

    if args.selftest:
        return selftest()
    if not args.wave_dir:
        ap.print_help()
        return 2
    wave = args.wave_dir.rstrip('/')
    try:
        cfg_path = os.path.join(wave, 'wave.json')
        if not os.path.exists(cfg_path):
            raise Refused(f'no wave.json in {wave}')
        cfg = json.load(open(cfg_path, encoding='utf-8'))
        content = args.content or os.path.join(cfg.get('repo', DEFAULT_REPO),
                                               'src/content/courses', cfg['slug'])
        where, sig, groups, invisible, seen = load_digest(
            os.path.join(wave, 'digest.txt'), args.min_decimals)
        files = lesson_files(content)
        hits, checked = sweep(where, sig, files, content, args.min_decimals)
    except Refused as exc:
        print(f'\nREFUSED: {exc}')
        print('This gate does not pass on an empty or unreadable sweep.')
        return 2
    for rel, va, x, vb, y, sent in hits:
        print(f'  ROW CROSSING  {rel}')
        print(f'     {va} is on digest line {x}')
        print(f'     {vb} is on digest line {y}, a different row of the same table')
        print(f'     "{sent}"')
    print(f'  => {cfg["slug"]}: {checked} multi-figure sentence(s) across {len(files)} lesson '
          f'file(s), {len(hits)} pairing across rows of one table; '
          f'{len(groups)} table(s) indexed, {invisible} shorter decimal literal(s) NOT indexed')
    print('  These are CANDIDATES, not failures. A sweep quoted at two settings is legitimate.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
