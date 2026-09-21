#!/usr/bin/env python3
"""GATE: the owner copy rule, over every string of every committed hygiene bank.

gate_copy_rule.py sweeps the digest, the briefs, the lessons and the manifests.
It never read a bank, and the three key-truth audits each swept their own tier
with a scratch script that was never committed. This gate sweeps all 21 banks
in one run: every prompt, every option and every explanation.

No em dash, no en dash, and no "X, not Y" contrastive. Two contrastive
patterns are applied, the one gate_copy_rule.py uses and the one the audits
used, so a string either one would flag is flagged here.

    python3 gate_bank_copy.py            sweep the committed banks
    python3 gate_bank_copy.py --plant    negative control: a planted dash and a
                                         planted contrastive must both be
                                         caught, so this run must exit 1

REFUSALS. Exit 2 when no bank file is found or no string is read. A sweep of
nothing is not a pass.
"""
import glob, json, os, re, sys

BANKS = os.environ.get('H2_BANKS', '/root/wt-h2-nextgen/tools/course-banks/hygiene')
DASHES = re.compile('[—–]')
CONTRASTIVE = [re.compile(r',\s+not\s+\w'),
               re.compile(r"\b\w+, not (a |an |the )?\w+", re.I)]


def strings(q):
    yield 'prompt', q['prompt']
    for i, o in enumerate(q['options']):
        yield f'option{i}', o
    yield 'explanation', q['explanation']


def sweep(banks):
    n, bad = 0, []
    for name, qs in banks:
        for qi, q in enumerate(qs, 1):
            for where, t in strings(q):
                n += 1
                if DASHES.search(t):
                    bad.append((name, qi, where, 'dash', t[:120]))
                if any(p.search(t) for p in CONTRASTIVE):
                    bad.append((name, qi, where, 'contrastive', t[:120]))
    return n, bad


def main():
    files = sorted(glob.glob(os.path.join(BANKS, '*', 'h2*.json')))
    if not files:
        print(f'  GATE REFUSES: no h2 bank JSON under {BANKS}')
        return 2
    banks = [(os.path.basename(f), json.load(open(f, encoding='utf-8'))) for f in files]
    if '--plant' in sys.argv:
        planted = dict(banks[0][1][0])
        planted['prompt'] = 'A planted prompt — with a dash.'
        planted['explanation'] = 'It is a noise dose, not a level.'
        banks = [('PLANTED.json', [planted])] + banks
    n, bad = sweep(banks)
    if n == 0:
        print('  GATE REFUSES: no bank string was read')
        return 2
    for b in bad:
        print(f'  VIOLATION {b[0]} Q{b[1]} {b[2]} ({b[3]}): {b[4]}')
    print(f'gate_bank_copy: {len(files)} bank file(s), {n} string(s) swept, {len(bad)} violation(s)')
    if '--plant' in sys.argv:
        kinds = {b[3] for b in bad if b[0] == 'PLANTED.json'}
        if kinds == {'dash', 'contrastive'}:
            print('CONTROL FIRED: the planted dash and the planted contrastive were both caught.')
            return 1
        print(f'CONTROL FAILED: caught only {sorted(kinds)}')
        return 3
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
