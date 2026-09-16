#!/usr/bin/env python3
"""GATE: nothing the capstone grades, and no condition it is set on, reaches
the digest or the digest generator.

Two directions, both checked:
  1. every CONDITION in fc4_fields_capstone.mjs (rates, pressures,
     temperatures, gravities, specs, ratios, strengths, loadings, duties)
     must be absent from digest.txt and fc4_dump.mjs;
  2. every GRADED VALUE the generator produces must be absent from
     digest.txt, at the digest's own six-decimal and four-decimal renderings
     as well as raw.

Numbers that are legitimately shared because they are UNIVERSAL rather than a
condition of a stream are declared in SHARED below with the reason.

It prints how many conditions and how many graded values it swept, so a green
run that examined nothing is not possible.
"""
import json, re, subprocess, sys, os, io

HERE = os.path.dirname(os.path.abspath(__file__))
DIGEST = io.open(os.path.join(HERE, 'digest.txt'), encoding='utf-8').read()
DUMP = io.open(os.path.join(HERE, 'fc4_dump.mjs'), encoding='utf-8').read()
CAP_SRC = io.open(os.path.join(HERE, 'fc4_fields_capstone.mjs'), encoding='utf-8').read()

# Values shared on purpose because they are not a condition of any stream.
SHARED = {
 '92': 'the molecular weight the BTEX balance defaults to, which is the engine\'s own default and is stated on both sides rather than chosen for a stream',
 '0.55': 'the glycol heat capacity, the engine\'s own default, stated as a condition on the capstone rather than chosen for it',
 '9.3': 'the glycol pounds per gallon, the engine\'s own default, on the same terms',
 '0.0004': 'the four ppmv H2S pipeline custom, which is a published spec rather than a property of either stream',
}

def numbers(text):
    return [m.group(0) for m in re.finditer(r'(?<![\w.])\d+(?:\.\d+)?(?![\w.])', text)]

def strip_comments(t):
    t = re.sub(r'/\*.*?\*/', '', t, flags=re.S)
    return re.sub(r'^\s*//.*$', '', t, flags=re.M)

def main():
    raw = set(numbers(strip_comments(CAP_SRC)))
    # A BARE SINGLE DIGIT CANNOT IDENTIFY A STREAM. A stage count of five and
    # a circulation-band edge of five are the same characters and nothing
    # else, so one-digit integers are excluded BY SHAPE and counted, rather
    # than being listed one by one in a ledger that would then rot.
    singles = sorted(x for x in raw if re.fullmatch(r'\d', x))
    conds = sorted(raw - set(SHARED) - set(singles))
    bad = []
    for c in conds:
        for name, hay in (('digest.txt', DIGEST), ('fc4_dump.mjs', DUMP)):
            if re.search(r'(?<![\d.])' + re.escape(c) + r'(?![\d.])', hay):
                bad.append(('condition', c, name))
    graded = json.loads(subprocess.run(
        ['node', os.path.join(HERE, 'fc4_capstone.mjs'), '--json'],
        capture_output=True, text=True, check=True).stdout)
    for row in graded:
        v = row['value']
        if v is None or not isinstance(v, (int, float)):
            continue
        for rendering in (repr(v), f'{v:.6f}', f'{v:.4f}'):
            if rendering in DIGEST:
                bad.append(('graded', f"{row['tier']}/{row['key']}={rendering}", 'digest.txt'))
    print(f'  capstone conditions swept: {len(conds)}')
    print(f'  one-digit counts excluded by shape: {len(singles)} -> {singles}')
    print(f'  graded values swept: {len(graded)} (x3 renderings each)')
    deadshared = sorted(set(SHARED) - raw)
    print(f'  declared shared values: {len(SHARED)}, dead rows: {len(deadshared)} -> {deadshared}')
    if deadshared:
        print('  GATE FAILS: a shared entry the capstone does not carry is a dead row')
        return 1
    print(f'  LEAKS: {len(bad)}')
    for kind, what, where in bad:
        print(f'   LEAK {kind} {what} appears in {where}')
    if len(conds) < 10 or len(graded) != 18:
        print('  GATE REFUSES: it examined too little to have checked anything')
        return 2
    return 1 if bad else 0

sys.exit(main())
