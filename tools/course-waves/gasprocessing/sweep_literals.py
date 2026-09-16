#!/usr/bin/env python3
"""FULL literal sweep: EVERY numeric literal in a bank or lesson must appear
in digest.txt.

numsweep skips every literal whose significant figures fall below seven once
TRAILING ZEROS are stripped, which on a digest rendered to six decimals is
most of the round figures in it. On this wave's own probe run numsweep
checked 63 literals and SKIPPED 56, so a green numsweep is roughly half a
sweep. This one has no significant-figure floor at all and matches on FLOAT
VALUE, so 880 resolves against the digest's 880.000000.

Run BOTH. Report BOTH counts. A gate going green and a gate examining your
files are two separate claims.

Usage: sweep_literals.py <wave_dir> <filter>          sweeps banks/
       sweep_literals.py <wave_dir> <filter> --lessons <content_dir>
"""
import json, re, sys, io, os

NUM = re.compile(r'-?\d{1,3}(?:,\d{3})+(?:\.\d+)?|-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?')

def literals(text):
    out = []
    for m in NUM.finditer(text):
        raw = m.group(0)
        # a minus sign only counts as a sign when it is not a hyphen in prose
        s = m.start()
        if raw.startswith('-') and s > 0 and text[s-1] not in ' ([{=,:\n\t':
            raw = raw[1:]
        out.append((m.group(0), float(raw.replace(',', ''))))
    return out

def digest_values(path):
    txt = io.open(path, encoding='utf-8').read()
    vals = set()
    for raw, v in literals(txt):
        vals.add(round(v, 10))
        vals.add(round(abs(v), 10))
    return vals, txt

def lesson_files(root, filt):
    out = []
    for dirpath, _, names in os.walk(root):
        for n in sorted(names):
            if n.endswith('.md') and filt in os.path.join(dirpath, n):
                out.append(os.path.join(dirpath, n))
    return out


def sweep_lessons(wave, filt, content):
    dig, _ = digest_values(os.path.join(wave, 'digest.txt'))
    files = lesson_files(content, filt)
    total, bad = 0, []
    for f in files:
        txt = io.open(f, encoding='utf-8').read()
        n = 0
        for raw, v in literals(txt):
            n += 1
            total += 1
            if round(v, 10) in dig or round(abs(v), 10) in dig:
                continue
            bad.append((os.path.relpath(f, content), 0, raw, txt[:0]))
        print(f'  {os.path.relpath(f, content)}: {n} literals swept')
    print(f'\nLESSON FILES SWEPT: {len(files)}   TOTAL literals: {total}   UNRESOLVED: {len(bad)}')
    for b, _i, raw, _c in bad:
        print(f'   UNRESOLVED {b}: "{raw}"')
    if not files:
        print('   REFUSES: a sweep of zero files is not a pass')
        return 2
    return 1 if bad else 0


def main():
    wave = sys.argv[1]
    if '--lessons' in sys.argv:
        return sweep_lessons(wave, sys.argv[2], sys.argv[sys.argv.index('--lessons') + 1])
    dig, dtxt = digest_values(os.path.join(wave, 'digest.txt'))
    bankdir = os.path.join(wave, 'banks')
    if not os.path.isdir(bankdir) or not os.listdir(bankdir):
        print('   REFUSES: no banks to sweep, and a sweep of zero files is not a pass')
        return 2
    banks = sorted(f for f in os.listdir(bankdir)
                   if f.endswith('.json') and sys.argv[2] in f)
    total = 0
    bad = []
    for b in banks:
        rows = json.load(io.open(os.path.join(wave, 'banks', b), encoding='utf-8'))
        n = 0
        for i, q in enumerate(rows):
            for field in ['prompt', 'explanation'] + q['options']:
                for raw, v in literals(field):
                    n += 1
                    total += 1
                    if round(v, 10) in dig or round(abs(v), 10) in dig:
                        continue
                    bad.append((b, i + 1, raw, field[:80]))
        print(f'  {b}: {len(rows)} questions, {n} literals swept')
    print(f'\nTOTAL literals swept: {total}   UNRESOLVED: {len(bad)}')
    for b, i, raw, ctx in bad:
        print(f'   UNRESOLVED {b} Q{i}: "{raw}"  in: {ctx}')
    return 1 if bad else 0

sys.exit(main())
