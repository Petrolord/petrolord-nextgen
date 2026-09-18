#!/usr/bin/env python3
"""GATE: nothing the FC5 capstone grades, and no condition it is set on,
reaches the digest, the digest generator, a published golden case, or a
sibling course's graded answer key.

FOUR DIRECTIONS, all checked:
  1. every CONDITION in fc5_fields_capstone.mjs (loads, pressures,
     temperatures, gravities, viscosities, levels, diameters, lengths,
     fractions, orifices, coefficients, distances, allowables) must be absent
     from digest.txt and from fc5_dump.mjs;
  2. every GRADED VALUE must be absent from digest.txt, at the digest's own
     six-decimal and four-decimal renderings as well as raw;
  3. NO CAPSTONE CONDITION MAY ALSO BE A PUBLISHED GOLDEN ROW. A sibling
     repair wave took a capstone's exact conditions for a published case and
     the golden then handed back a graded answer. The same reach is available
     here, because the realistic relief conditions are the ones this wave
     already uses, so every capstone call is compared against all fifty-one
     rows of relief_cases.json by INPUT SET rather than by value;
  4. NO GRADED VALUE MAY LAND INSIDE THE TOLERANCE OF A GRADED FIELD IN A
     SIBLING COURSE THAT SHARES A MODEL. FC1 separation is merged and grades a
     flare setback and a pool setback off the same API 521 point source this
     engine carries a second copy of.

Numbers that are legitimately shared because they are UNIVERSAL rather than a
condition of a plant are declared in SHARED below with the reason.

It prints how many conditions, golden rows, graded values and sibling fields
it swept, so a green run that examined nothing is not possible.
"""
import json, re, subprocess, sys, os, io

HERE = os.path.dirname(os.path.abspath(__file__))
DIGEST = io.open(os.path.join(HERE, 'digest.txt'), encoding='utf-8').read()
DUMP = io.open(os.path.join(HERE, 'fc5_dump.mjs'), encoding='utf-8').read()
CAP_SRC = io.open(os.path.join(HERE, 'fc5_fields_capstone.mjs'), encoding='utf-8').read()
GOLDEN = os.environ.get('FC5_GOLDEN',
    '/root/wt-fc5-nextgen/packages/engines/test-data/facilities/goldens/relief_cases.json')
SIBLING = os.environ.get('FC1_FIELDS', '/root/fc-wip-separation/fields.json')

# Values shared on purpose because they are not a condition of any plant.
SHARED = {
 '0.975': "the engine's own default certified discharge coefficient for gas and steam, stated on the capstone rather than chosen for it, and printed in the digest because five published gas rows carry it",
 '0.65': "the engine's own default certified discharge coefficient for liquid, on the same terms",
 '0.1': "the engine's own default blowdown time step, stated on the capstone rather than chosen for it, and walked as a sweep in digest section 23",
 '1.0': 'unity: a conventional valve back-pressure factor, a saturated superheat factor and a rupture-disc combination factor are all 1.0 by the standard',
 '10': "the overpressure percentage the standard allows a process case, which the digest walks as a sweep and every plant states",
}

def numbers(text):
    return [m.group(0) for m in re.finditer(r'(?<![\w.])\d+(?:\.\d+)?(?![\w.])', text)]

def strip_comments(t):
    t = re.sub(r'/\*.*?\*/', '', t, flags=re.S)
    return re.sub(r'^\s*//.*$', '', t, flags=re.M)

def condition_source(text):
    """The exported CONDITION objects only. HELD_CLEARANCE is prose that quotes
    held constants on purpose (0.82, 26, 51.5, 520, 735), and sweeping it would
    make the gate fail on its own explanation rather than on a leak. Recognised
    structurally: an `export const NAME = { ... }` whose name is not
    HELD_CLEARANCE, with the body taken by brace depth so a one-line object and
    a multi-line one are both read whole."""
    t = strip_comments(text)
    out = {}
    for m in re.finditer(r'export const (\w+)\s*=\s*\{', t):
        name = m.group(1)
        if name == 'HELD_CLEARANCE':
            continue
        i = m.end()
        depth = 1
        while i < len(t) and depth:
            if t[i] == '{':
                depth += 1
            elif t[i] == '}':
                depth -= 1
            i += 1
        out[name] = t[m.end():i - 1]
    return out


def dereference(text):
    # A CROSS-REFERENCE IS NOT A QUANTITY. "section 27" is an address in this
    # digest, not a figure, and a capstone length of 27 ft colliding with it
    # would be a coincidence of characters. Section references, the repair
    # wave's name and module and lesson keys are removed by SHAPE before the
    # sweep, so the gate keeps failing on real collisions and stops failing on
    # addresses.
    t = re.sub(r'#?\s*SECTIONS?\s+\d+(?:\s*(?:,|and)\s*\d+)*', ' SECTIONREF ', text, flags=re.I)
    t = re.sub(r'\bFC\d-\d\b', ' WAVEREF ', t)
    t = re.sub(r'\b[ml]\d{2}\b', ' KEYREF ', t)
    return t


def main():
    cond_bodies = condition_source(CAP_SRC)
    if len(cond_bodies) < 8:
        print(f'  GATE REFUSES: only {len(cond_bodies)} condition objects found in the capstone file')
        return 2
    raw = set(numbers('\n'.join(cond_bodies.values())))
    # A BARE SINGLE DIGIT CANNOT IDENTIFY A STREAM. A stage count of five and
    # a circulation-band edge of five are the same characters and nothing
    # else, so one-digit integers are excluded BY SHAPE and counted, rather
    # than being listed one by one in a ledger that would then rot.
    singles = sorted(x for x in raw if re.fullmatch(r'\d', x))
    conds = sorted(raw - set(SHARED) - set(singles))
    bad = []
    for c in conds:
        for name, hay in (('digest.txt', dereference(DIGEST)), ('fc5_dump.mjs', dereference(DUMP))):
            if re.search(r'(?<![\d.])' + re.escape(c) + r'(?![\d.])', hay):
                bad.append(('condition', c, name))
    graded = json.loads(subprocess.run(
        ['node', os.path.join(HERE, 'fc5_capstone.mjs'), '--json'],
        capture_output=True, text=True, check=True).stdout)
    for row in graded:
        v = row['value']
        if v is None or not isinstance(v, (int, float)):
            continue
        for rendering in (repr(v), f'{v:.6f}', f'{v:.4f}'):
            if rendering in DIGEST:
                bad.append(('graded', f"{row['tier']}/{row['key']}={rendering}", 'digest.txt'))
    # ---- direction 3: no capstone CALL may be a published golden row ----
    # Compared CALL BY CALL, using the arguments the generator actually handed
    # the engine rather than text scraped out of the source, because a call is
    # what a golden row is. A row is a HIT when every distinguishing input the
    # golden carries is matched by the call: that is the shape the sibling
    # wave's defect had, a capstone's exact conditions taken for a published
    # case, and it is not caught by comparing single digits.
    gold = json.load(io.open(GOLDEN, encoding='utf-8'))
    gold_rows = [(block, i, row) for block, rows in gold.items() for i, row in enumerate(rows)]
    calls = json.loads(subprocess.run(
        ['node', os.path.join(HERE, 'fc5_capstone.mjs'), '--calls'],
        capture_output=True, text=True, check=True).stdout)
    for call in calls:
        args = {k: v for k, v in call['args'].items() if isinstance(v, (int, float))}
        for block, i, row in gold_rows:
            ins = {k: v for k, v in row.items() if isinstance(v, (int, float))}
            common = set(args) & set(ins)
            if len(common) < 3:
                continue
            if all(abs(args[k] - ins[k]) < 1e-12 for k in common):
                bad.append(('golden-overlap',
                            f"{call['route']} matches {block}[{i}] on all {len(common)} shared inputs {sorted(common)}",
                            'relief_cases.json'))
    # ---- direction 4: no graded value may collide with a sibling course ----
    sib = []
    if os.path.exists(SIBLING):
        sib = [r for r in json.load(io.open(SIBLING, encoding='utf-8'))]
    for row in graded:
        for st, sk, sv, stol in sib:
            if abs(row['value'] - sv) <= max(row['tol'], stol):
                bad.append(('sibling-collision',
                            f"{row['tier']}/{row['key']}={row['value']} is inside the tolerance of separation {st}/{sk}={sv}",
                            'fc-wip-separation/fields.json'))
    print(f'  capstone conditions swept: {len(conds)}')
    print(f'  engine CALLS compared against golden rows: {len(calls)} x {len(gold_rows)} rows')
    print(f'  sibling graded fields compared against: {len(sib)} (FC1 separation)')
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
    if len(conds) < 10 or len(graded) != 18 or len(gold_rows) < 40 or len(sib) != 18 or len(calls) < 10:
        print('  GATE REFUSES: it examined too little to have checked anything')
        return 2
    return 1 if bad else 0

sys.exit(main())
