#!/usr/bin/env python3
"""THE D5 TRUTH HARVEST: the kit's harvest_digest.py, then COMMA-GROUPED FIGURES.

The kit harvester reads "12,139,208" as three literals (12, 139, 208), while
the kit numsweep reads a lesson's "12,139,208" as ONE literal, 12139208, with
the thousands commas removed. So a lesson quoting a comma-grouped figure the
digest prints (Q07's reference answer "12,139,208 stb", system A's "2,096")
read as UNRESOLVED. This runs the kit harvester unchanged and then appends to
each digest line's values the comma-grouped figures on that line, read the way
numsweep reads them (the kit's own NUM rule: 1 to 3 digits, then one or more
groups of exactly 3, an optional decimal part). Nothing the kit harvested is
removed; comment lines stay skipped, as in the kit.

    python3 harvest_appliedai.py <wave_dir> [digest.txt]
"""
import json, os, re, subprocess, sys

KIT = os.environ.get('D5_KIT', '/root/dc-wavekit')
GROUPED = re.compile(r'(?<![\d.,])-?\d{1,3}(?:,\d{3})+(?:\.\d+)?(?![\d,]*\d)')


def main():
    wave = sys.argv[1].rstrip('/')
    src = sys.argv[2] if len(sys.argv) > 2 else os.path.join(wave, 'digest.txt')
    subprocess.run(['python3', os.path.join(KIT, 'harvest_digest.py')] + sys.argv[1:], check=True, capture_output=True)
    slug = json.load(open(os.path.join(wave, 'wave.json')))['slug']
    dst = os.path.join(wave, 'truth-%s.json' % slug)
    out = json.load(open(dst))
    added = 0
    with open(src) as fh:
        for i, line in enumerate(fh, 1):
            if line.lstrip().startswith('#'):
                continue
            for m in GROUPED.finditer(line):
                v = float(m.group(0).replace(',', ''))
                if v == 0.0:
                    continue
                out.setdefault('digest:%d' % i, []).append(v)
                added += 1
    with open(dst, 'w') as fh:
        json.dump(out, fh, indent=1)
    print('%s: %d lines, %d comma-grouped figures added -> %s' % (src, len(out), added, dst))


if __name__ == '__main__':
    main()
