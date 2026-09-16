#!/usr/bin/env python3
"""Harvest the digest into truth-gasprocessing.json, the resolver numsweep reads.

numsweep builds its resolver from every truth-*.json in the wave directory,
plus the goldens wave.json names, plus wave.json's declared constants. FC3
shipped no truth file and its sweep reported 396 of 412 literals unresolved,
which measured the resolver rather than the lessons.

The digest is the wave's teaching truth by definition, so harvesting it is
not a widening of what a lesson may say: it is the same set, made
machine-readable. Keyed BY DIGEST LINE so an unresolved literal can be
traced to the line that would have carried it.

Numbers inside a VERBATIM ENGINE STRING are harvested too: a lesson quoting
a refusal message quotes its numbers with it.
"""
import io, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
NUM = re.compile(r'-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?')

def main():
    lines = io.open(os.path.join(HERE, 'digest.txt'), encoding='utf-8').read().split('\n')
    out, total = {}, 0
    for i, line in enumerate(lines, 1):
        vals = []
        for m in NUM.finditer(line):
            raw = m.group(0)
            # A leading minus is a sign only when it is not a hyphen in prose.
            if raw.startswith('-') and m.start() > 0 and line[m.start() - 1] not in ' ([{=,:|\t':
                raw = raw[1:]
            try:
                vals.append(float(raw))
            except ValueError:
                continue
        if vals:
            out[f'digest:{i}'] = vals
            total += len(vals)
    dest = os.path.join(HERE, 'truth-gasprocessing.json')
    with io.open(dest, 'w', encoding='utf-8') as fh:
        json.dump(out, fh, indent=1, sort_keys=True)
        fh.write('\n')
    print(f'  digest lines read: {len(lines)}')
    print(f'  lines carrying a number: {len(out)}')
    print(f'  numbers harvested: {total}')
    print(f'  distinct values: {len({round(v, 10) for vs in out.values() for v in vs})}')
    print(f'  wrote {os.path.basename(dest)}')
    if total < 500:
        print('  REFUSES: a resolver this thin would measure itself rather than the lessons')
        return 2
    return 0

sys.exit(main())
