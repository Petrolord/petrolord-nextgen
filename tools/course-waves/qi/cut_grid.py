#!/usr/bin/env python3
"""CUT THE EKENE SAND TOP GRID FOR THE QI EXPERT TIER.

Reads 02-surfaces/EkeneSand-top-6wells.zmap from release ekene-demo-v3 of the
Ekene demonstration kit (the grid gridded from the six development wells'
tops, elevation in metres, negative below sea level) and writes it as a
row-major grid on the gridmath convention (z[r*nx + c], row 0 = south,
x = x0 + c dx, y = y0 + r dy, nulls as null) to ekeneQiGrid.json. The Expert
lab converts it to feet before the closure engine runs.

    python3 -I cut_grid.py <out.json>
"""
import hashlib
import json
import sys

SRC = '/root/wt-petro/dist-demo/ekene-demo-v3/02-surfaces/EkeneSand-top-6wells.zmap'


def main():
    lines = open(SRC).read().split('\n')
    hdr = [l for l in lines if l and not l.startswith('!')]
    i = 0
    assert hdr[i].startswith('@')
    a = [s.strip() for s in hdr[1].split(',')]
    null = float(a[1])
    b = [s.strip() for s in hdr[2].split(',')]
    nrow, ncol = int(b[0]), int(b[1])
    xmin, xmax, ymin, ymax = map(float, b[2:6])
    k = hdr.index('@', 1) + 1
    vals = []
    for l in hdr[k:]:
        vals += [float(v) for v in l.split()]
    assert len(vals) == nrow * ncol, (len(vals), nrow, ncol)
    dx = (xmax - xmin) / (ncol - 1)
    dy = (ymax - ymin) / (nrow - 1)
    z = [None] * (nrow * ncol)
    # ZMAP: column by column, each from north (ymax) to south
    for c in range(ncol):
        for j in range(nrow):
            v = vals[c * nrow + j]
            r = nrow - 1 - j
            z[r * ncol + c] = None if abs(v) >= 1e29 or v == null else round(v, 4)
    out = {
        'name': 'Ekene Sand top, gridded from the six development wells',
        'synthetic': True,
        'source': {'release': 'petrolord-suite release ekene-demo-v3', 'file': '02-surfaces/EkeneSand-top-6wells.zmap',
                   'sha256': hashlib.sha256(open(SRC, 'rb').read()).hexdigest()},
        'units': {'xy': 'm (EPSG:32632)', 'z': 'm elevation, negative below sea level'},
        'spec': {'nx': ncol, 'ny': nrow, 'x0': xmin, 'y0': ymin, 'dx': dx, 'dy': dy},
        'z': z,
    }
    s = json.dumps(out, separators=(',', ':'), sort_keys=True) + '\n'
    open(sys.argv[1], 'w').write(s)
    print('wrote', sys.argv[1], len(s), 'bytes; live nodes', sum(v is not None for v in z), 'of', len(z))


if __name__ == '__main__':
    main()
