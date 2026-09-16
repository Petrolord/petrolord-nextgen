#!/usr/bin/env python3
"""No graded capstone answer may be reachable from a wave's TEACHING DIGEST.

briefleak.py guards the BRIEF and leakage.mjs guards the LESSONS. The DIGEST is
the file every lesson is told to quote from, and therefore the most dangerous
place for a graded answer to sit: a leak there is laundered into a lesson by a
writer who was following the rules.

WHAT THE PREVIOUS VERSION DID, AND WHY IT COULD REPORT NOTHING
--------------------------------------------------------------
Its first two statements were:

    if not os.path.exists(src):
        print(f'no digest at {src}, nothing to gate')
        return 0

A missing digest was an EXCUSE, and the excuse was spelled exit 0. Verified
empirically on 2026-09-16. That is not a corner case here: of the 28 live
courses that have a wave directory at all, 13 have no digest.txt, so for those
13 this gate has only ever printed a sentence and passed. It also passed on an
empty fields.json, on a digest whose lines were all commentary, and on a digest
with no numbers in it.

TWO THINGS IT GETS RIGHT, KEPT.

1. THE TOLERANCE SCALES WITH THE UNIT SHIFTING. academy_submit_capstone grades
   with abs(got - expected) <= tol, so tol is ABSOLUTE in the field's own
   units. Shifting the value alone turns the guard into a wildcard.
2. COMMENT LINES ARE SKIPPED, matching harvest_digest.py, because a digest
   marks its commentary with a leading hash.

TWO THINGS ADDED.

3. A SHIFTED MATCH MUST AGREE RELATIVELY. At x1000 a loose absolute tolerance
   still matches things it has no business matching; a genuine restatement in
   another unit rounds the value, so it must agree in relative terms too. This
   is the rule that removed 46 false flags from EC3 in the sibling gate.
4. THE ANSWER KEY CAN COME FROM THE DATABASE. Six live waves' fields.json
   disagree with the key production grades against, three of them in a VALUE.
   A leak sweep against a stale key is a sweep against the wrong answers.

REFUSALS. Exit 2, never 0, when the gate cannot do its job.

    python3 digestleak.py <wave_dir> [digest.txt]
    python3 digestleak.py <wave_dir> --db --course SLUG [--workdir DIR]
    python3 digestleak.py --selftest

Exit codes: 0 clean, 1 leaks, 2 REFUSED. Only 0 is a pass.
"""
import argparse
import json
import os
import re
import subprocess
import sys
import tempfile

# Digit-grouped numbers first, so "1,600,000" is one number and not three.
NUM = re.compile(r'-?\d{1,3}(?:,\d{3})+(?:\.\d+)?|[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?')
SHIFTS = ((1.0, 'as printed'), (1000.0, 'x1000'), (0.001, 'x0.001'))
GUARD_TOLERANCES = 10.0
REL_TOL = 1e-4


class Refused(Exception):
    """The gate cannot do its job. Never a pass."""


def load_fields_file(path):
    if not os.path.exists(path):
        raise Refused(f'no fields.json at {path}; there is no answer key to gate against')
    try:
        rows = json.load(open(path, encoding='utf-8'))
    except ValueError as exc:
        raise Refused(f'{path} is not readable JSON: {exc}')
    return validate_fields(rows, path)


def validate_fields(rows, where):
    if not isinstance(rows, list):
        raise Refused(f'{where} is not a list of graded fields')
    if not rows:
        raise Refused(f'{where} holds ZERO graded fields. A leak sweep against no answer '
                      f'key checks nothing, and reporting that as a pass is the defect '
                      f'this gate was repaired for.')
    out = []
    for r in rows:
        if not (isinstance(r, (list, tuple)) and len(r) == 4):
            raise Refused(f'{where} has a row that is not [tier, key, value, tol]: {r!r}')
        tier, key, val, tol = r
        if not isinstance(val, (int, float)) or not isinstance(tol, (int, float)):
            raise Refused(f'{where}: {tier}.{key} has a non-numeric value or tolerance')
        out.append((tier, key, float(val), float(tol)))
    return out


DB_QUERY = """
select coalesce(jsonb_agg(jsonb_build_object(
  'app_slug', app_slug, 'tier', tier, 'fields', fields) order by app_slug, tier), '[]'::jsonb) as dump
from public.academy_capstones where active;
"""


def load_fields_db(workdir, course):
    if not course:
        raise Refused('--db needs --course SLUG to know which answer key to load')
    with tempfile.NamedTemporaryFile('w', suffix='.sql', delete=False) as fh:
        fh.write(DB_QUERY)
        qpath = fh.name
    try:
        proc = subprocess.run(['supabase', 'db', 'query', '--linked', '-f', qpath, '-o', 'json'],
                              cwd=workdir, capture_output=True, text=True)
    finally:
        os.unlink(qpath)
    if proc.returncode != 0:
        raise Refused(f'supabase db query failed: {proc.stderr.strip()[:300]}')
    try:
        rows = json.loads(proc.stdout)['rows'][0]['dump']
    except Exception as exc:
        raise Refused(f'could not read the query result: {exc}')
    out = []
    for r in rows:
        if r['app_slug'] != course:
            continue
        for f in (r.get('fields') or []):
            if isinstance(f.get('expected'), (int, float)) and isinstance(f.get('tol'), (int, float)):
                out.append((r['tier'], f.get('key'), float(f['expected']), float(f['tol'])))
    if not out:
        raise Refused(f'the database holds no active graded fields for course "{course}"')
    return out


def read_digest(src):
    if not os.path.exists(src):
        raise Refused(
            f'there is no digest at {src}. A wave that never generated its teaching digest '
            f'has not been gated, and the previous version of this gate excused exactly that '
            f'and exited 0.')
    text = open(src, encoding='utf-8').read()
    if not text.strip():
        raise Refused(f'{src} is empty')
    nums, generated, commented = [], 0, 0
    for i, line in enumerate(text.splitlines(), 1):
        if line.lstrip().startswith('#'):
            commented += 1
            continue
        generated += 1
        for m in NUM.finditer(line):
            try:
                v = float(m.group(0).replace(',', ''))
            except ValueError:
                continue
            if v == 0.0:
                continue
            nums.append((v, i, line.rstrip()[:95]))
    if generated == 0:
        raise Refused(f'{src} has {commented} line(s) and EVERY ONE is a comment, so the gate '
                      f'examined no generated output at all.')
    if not nums:
        raise Refused(f'{src} carries not one non-zero numeric literal on a generated line. '
                      f'A leak sweep with no numbers to check is not a pass.')
    return nums, generated, commented


def sweep(nums, fields):
    hits = []
    for tier, key, val, tol in fields:
        if tol <= 0:
            # A zero-tolerance field is graded on an exact match; guard it on
            # the literal alone rather than skipping it.
            guardable = [(scale, lab) for scale, lab in SHIFTS if scale == 1.0]
        else:
            guardable = list(SHIFTS)
        for scale, lab in guardable:
            target = val * scale
            guard = max(tol, abs(val) * 1e-12) * GUARD_TOLERANCES * scale
            for v, ln, txt in nums:
                if abs(v - target) > guard:
                    continue
                # A UNIT RESTATEMENT IS EXACT; AN APPROXIMATION IS NOISE.
                if scale != 1.0:
                    rel = abs(v - target) / max(abs(target), 1e-30)
                    if rel > REL_TOL:
                        continue
                hits.append((tier, key, lab, ln, v, txt))
    return hits


# --------------------------------------------------------- negative control

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
    d = tempfile.mkdtemp()
    try:
        fields = validate_fields([['beginner', 'b_rate', 1234.5678, 0.001],
                                  ['intermediate', 'i_head', 98765.4321, 0.01],
                                  ['advanced', 'a_npv', 55555.5, 0.5]], 'test')

        clean = os.path.join(d, 'clean.txt')
        open(clean, 'w').write('# commentary about the run\n'
                               't1 duty = 310.25 bbl/d\n'
                               't2 gravity = 0.8612345\n')
        nums, gen, com = read_digest(clean)
        chk('a clean digest reports no leak', sweep(nums, fields) == [])
        chk('and it really did examine generated lines', gen == 2 and len(nums) >= 3)

        planted = os.path.join(d, 'planted.txt')
        open(planted, 'w').write('t1 duty = 310.25 bbl/d\nt2 head = 98765.4321 ft\n')
        hits = sweep(read_digest(planted)[0], fields)
        chk('a planted graded answer goes RED', any(h[1] == 'i_head' for h in hits))
        chk('removing it goes green again', sweep(read_digest(clean)[0], fields) == [])

        shifted = os.path.join(d, 'shifted.txt')
        open(shifted, 'w').write('t2 head = 98.7654321 kft\n')
        chk('a graded answer restated x1000 is still caught',
            any(h[1] == 'i_head' and h[2] == 'x0.001' for h in sweep(read_digest(shifted)[0], fields)))

        # the wildcard the relative rule removes: a bare 1.0 against a 1003.0053
        # rate shifted x0.001 with an unscaled guard used to match everything
        loose = validate_fields([['beginner', 'rate', 1003.0053214651645, 0.005]], 'loose')
        wide = os.path.join(d, 'wide.txt')
        open(wide, 'w').write('ratio = 1.0\nfraction = 1.004\n')
        chk('a loose approximation under a unit shifting is not called a leak',
            sweep(read_digest(wide)[0], loose) == [])

        grouped = os.path.join(d, 'grouped.txt')
        open(grouped, 'w').write('t2 head = 98,765.4321 ft\n')
        chk('a digit-grouped literal is one number and is caught',
            any(h[1] == 'i_head' for h in sweep(read_digest(grouped)[0], fields)))

        # REFUSALS
        refuses('a MISSING digest is REFUSED, not excused with exit 0',
                lambda: read_digest(os.path.join(d, 'nope.txt')))
        empty = os.path.join(d, 'empty.txt')
        open(empty, 'w').write('\n  \n')
        refuses('an empty digest is REFUSED', lambda: read_digest(empty))
        allcom = os.path.join(d, 'allcom.txt')
        open(allcom, 'w').write('# one\n# two\n')
        refuses('a digest that is entirely commentary is REFUSED', lambda: read_digest(allcom))
        nonum = os.path.join(d, 'nonum.txt')
        open(nonum, 'w').write('the separator ran well\n')
        refuses('a digest with no numbers at all is REFUSED', lambda: read_digest(nonum))
        refuses('an EMPTY fields.json is REFUSED, not passed', lambda: validate_fields([], 'empty'))
        refuses('a malformed graded row is REFUSED',
                lambda: validate_fields([['beginner', 'k', 1]], 'bad'))
        refuses('a missing fields.json is REFUSED',
                lambda: load_fields_file(os.path.join(d, 'nofields.json')))
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
    ap.add_argument('--db', action='store_true', help='read the live answer key')
    ap.add_argument('--course', help='app_slug for --db')
    ap.add_argument('--workdir', default='.')
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
        fields = (load_fields_db(args.workdir, args.course) if args.db
                  else load_fields_file(os.path.join(wave, 'fields.json')))
        nums, generated, commented = read_digest(src)
        hits = sweep(nums, fields)
    except Refused as exc:
        print(f'\nREFUSED: {exc}')
        print('This gate does not pass on an empty or unreadable sweep.')
        return 2
    print(f'{os.path.basename(src)}: {len(nums)} numeric literals on {generated} generated '
          f'line(s) ({commented} commentary), against {len(fields)} graded fields, '
          f'{len(SHIFTS)} unit shiftings')
    for tier, key, lab, ln, v, txt in hits:
        print(f'  LEAK {tier}/{key} ({lab}) line {ln}: {v}')
        print(f'        {txt}')
    print(f'  => {len(hits)} graded answer(s) reachable from this digest')
    return 1 if hits else 0


if __name__ == '__main__':
    sys.exit(main())
