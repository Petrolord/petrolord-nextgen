#!/usr/bin/env python3
"""CUT THE QI TEACHING PACK FROM THE EKENE DEMONSTRATION KIT v3.

The pack is the course's teaching dataset: what the four explorer panels load
as "the Ekene teaching pack" and what qi_dump.mjs builds the digest from. It is
cut from release ekene-demo-v3 of petrolord-suite (the kit the QI videos were
recorded on, kept as it is because the videos link to it), unpacked at
KIT below, plus the kit generator's own petrophysical interpretation curves at
the wells (sources/kit_truth_rows.json, written by kit_truth_rows.mjs from
tools/demo-dataset buildKit() at the Suite commit recorded in the pack).

What it holds, and why each piece:
  wells       Ekene-1 to Ekene-4 (DT, DTS, RHOB and GR over the Ekene Sand and
              the shale above it), with the kit's PHIT, VSH and SW at the same
              depths; Ekene-9 (no density log) over the same window. Associate
              shear trend, elastic set, substitution, wet trend, AVO; the
              Professional tie; the Expert property transform.
  headers     every logged well's curve list, header and checkshot count (the
              Associate data inventory).
  checkshots  Ekene-1 to Ekene-4.
  qcSpread    full-stack traces spread over the survey, ten inlines by
              twelve crosslines (Associate spectra, two time windows).
  qcNeighbours 21 neighbouring full-stack traces along the inline through
              Ekene-1 (Associate signal to noise).
  slice       the RMS amplitude of the full stack over a window round the
              Ekene Sand on every trace of the survey (Associate footprint).
  wellTraces  the full, near, mid and far stack traces at Ekene-1 to Ekene-4
              (Professional wavelets and AVO at the wells; Expert inversion).
  gathers     twelve NMO-corrected CDP gathers next to Ekene-1, every offset
              (Professional prestack).
  rmsVelocity the published RMS velocity table for the gathers.

Depths are carried in metres exactly as the kit writes them; the digest and
the panels print depth in feet (metres / 0.3048). Velocities in m/s, density
in kg/m3, times in ms.

    python3 -I cut_pack.py <out.json>      writes the pack, prints its sha256
"""
import hashlib
import json
import math
import os
import struct
import sys

KIT = '/root/wt-petro/dist-demo/ekene-demo-v3'
HERE = os.path.dirname(os.path.abspath(__file__))
KIT_ZIP_MD5 = '0d97d90057ef1fb0b06d557aa304d2b2'  # ekene-demo-v3-kit.zip on the GitHub release, checked 2026-10-11
SUITE_COMMIT = '5df9d94102dbfa09cc1ac29995cb536042fbe716'  # buildKit() run for kit_truth_rows.json
LOG_WELLS = ['Ekene-1', 'Ekene-2', 'Ekene-3', 'Ekene-4']
WINDOW_ABOVE_M = 45.0
WINDOW_BELOW_M = 45.0
FT = 0.3048


def sha256(p):
    return hashlib.sha256(open(p, 'rb').read()).hexdigest()


def r(x, nd):
    if x is None or not math.isfinite(x):
        return None
    v = round(x, nd)
    return 0.0 if v == 0 else v


def read_las(path):
    hdr, curves, data, sect = {}, [], [], None
    for line in open(path):
        s = line.rstrip('\n')
        if s.startswith('~'):
            sect = s[1].upper()
            continue
        if not s.strip() or s.startswith('#'):
            continue
        if sect in ('W', 'P'):
            key = s.split('.', 1)[0].strip()
            rest = s.split('.', 1)[1]
            unit, val = rest.split(None, 1) if not rest.startswith(' ') else ('', rest)
            hdr[key] = val.split(':', 1)[0].strip()
        elif sect == 'C':
            mn = s.split('.', 1)[0].strip()
            unit = s.split('.', 1)[1].split()[0] if s.split('.', 1)[1].strip() and not s.split('.', 1)[1].startswith(' ') else ''
            desc = s.split(':', 1)[1].strip() if ':' in s else ''
            curves.append((mn, unit, desc))
        elif sect == 'A':
            data.append([float(v) for v in s.split()])
    return hdr, curves, data


def ibm2float(b):
    (i,) = struct.unpack('>I', b)
    if i == 0:
        return 0.0
    sign = -1.0 if i >> 31 else 1.0
    expo = (i >> 24) & 0x7F
    mant = (i & 0x00FFFFFF) / float(1 << 24)
    return sign * mant * 16.0 ** (expo - 64)


class Segy:
    def __init__(self, path):
        self.path = path
        self.f = open(path, 'rb')
        b = self.f.read(3600)
        self.dt_us = struct.unpack('>H', b[3216:3218])[0]
        self.ns = struct.unpack('>H', b[3220:3222])[0]
        self.fmt = struct.unpack('>H', b[3224:3226])[0]
        assert self.fmt in (1, 5), self.fmt
        self.tl = 240 + 4 * self.ns
        self.ntr = (os.path.getsize(path) - 3600) // self.tl
        self.index = {}
        for k in range(self.ntr):
            self.f.seek(3600 + k * self.tl)
            h = self.f.read(240)
            il, xl = struct.unpack('>ii', h[188:196])
            off = struct.unpack('>i', h[36:40])[0]
            cx, cy = struct.unpack('>ii', h[180:188])
            sc = struct.unpack('>h', h[70:72])[0]
            s = (1 / -sc) if sc < 0 else (sc or 1)
            self.index[(il, xl, off)] = (k, cx * s, cy * s)

    def trace(self, il, xl, off=0):
        k = self.index[(il, xl, off)][0]
        self.f.seek(3600 + k * self.tl + 240)
        raw = self.f.read(4 * self.ns)
        if self.fmt == 5:
            return list(struct.unpack('>%df' % self.ns, raw))
        return [ibm2float(raw[4 * i:4 * i + 4]) for i in range(self.ns)]

    def nearest(self, x, y, off=0):
        best = None
        for (il, xl, o), (_, cx, cy) in self.index.items():
            if o != off:
                continue
            d = (cx - x) ** 2 + (cy - y) ** 2
            if best is None or d < best[0]:
                best = (d, il, xl, cx, cy)
        return best


def window(trace, dt_ms, t0, t1):
    i0, i1 = int(round(t0 / dt_ms)), int(round(t1 / dt_ms))
    return [r(v, 7) for v in trace[i0:i1 + 1]]


def main():
    out = sys.argv[1]
    truth = json.load(open(os.path.join(HERE, 'sources/kit_truth_rows.json')))
    heads = {}
    for line in list(open(os.path.join(KIT, '01-wells/well-headers.csv')))[1:]:
        c = line.rstrip('\n').split(',')
        heads[c[0]] = {'x': float(c[2]), 'y': float(c[3]), 'kb_m': float(c[5]), 'wd_m': float(c[6]), 'td_md_m': float(c[7]),
                       'kind': c[11]}
    tops = {}
    for w in heads:
        p = os.path.join(KIT, f'01-wells/tops/{w}-tops.csv')
        if os.path.exists(p):
            tops[w] = {c.split(',')[0]: float(c.split(',')[1]) for c in list(open(p))[1:]}
    pack = {
        'name': 'The Ekene QI teaching pack',
        'synthetic': True,
        'source': {
            'release': 'petrolord-suite release ekene-demo-v3',
            'kitZipMd5': KIT_ZIP_MD5,
            'interpretationCurves': f'tools/demo-dataset buildKit() at petrolord-suite {SUITE_COMMIT[:9]} (PHIT, VSH, SW at the log depths)',
            'cutBy': 'cut_pack.py',
        },
        'units': {'depth': 'm (kit); printed in ft', 'velocity': 'm/s', 'density': 'kg/m3', 'time': 'ms', 'gr': 'API'},
        'contacts_m': {'ekeneOwc': truth['owc_m'], 'oboroGwc': truth['gwc_m']},
        'conditions': {
            'ekene': {k: truth['fluids']['EKENE']['cond'][k] for k in ('tF', 'pPsia', 'salinity', 'api', 'gorScfStb', 'gasSg')},
        },
        'headers': {}, 'wells': {}, 'checkshots': {},
    }
    files = {}
    for w in sorted(heads, key=lambda s: int(s.split('-')[1])):
        p = os.path.join(KIT, f'01-wells/{w}.las')
        if not os.path.exists(p):
            pack['headers'][w] = {'logs': False, 'kind': heads[w]['kind']}
            continue
        hdr, curves, data = read_las(p)
        files[f'01-wells/{w}.las'] = sha256(p)
        cs = os.path.join(KIT, f'01-wells/checkshots/{w}-checkshots.csv')
        ncs = len(list(open(cs))) - 1 if os.path.exists(cs) else 0
        pack['headers'][w] = {
            'logs': True, 'kind': heads[w]['kind'], 'curves': [c[0] for c in curves if c[0] != 'DEPT'],
            'units': {c[0]: c[1] for c in curves}, 'start_m': float(hdr['STRT']), 'stop_m': float(hdr['STOP']),
            'step_m': float(hdr['STEP']), 'checkshots': ncs, 'kb_m': heads[w]['kb_m'],
            'surveyStations': (len(list(open(os.path.join(KIT, f'01-wells/surveys/{w}-survey.csv')))) - 1)
            if os.path.exists(os.path.join(KIT, f'01-wells/surveys/{w}-survey.csv')) else 0,
            'ekeneTop_m': tops.get(w, {}).get('Ekene Sand'), 'ekeneBase_m': tops.get(w, {}).get('Ekene Sand Base'),
        }
        if w in LOG_WELLS:
            t = tops[w]
            lo, hi = t['Ekene Sand'] - WINDOW_ABOVE_M, t['Ekene Sand Base'] + WINDOW_BELOW_M
            names = [c[0] for c in curves]
            ix = {n: names.index(n) for n in ('DEPT', 'DT', 'DTS', 'RHOB', 'GR')}
            trows = {round(row[0], 3): row for row in truth['wells'][w]}
            rows = []
            for d in data:
                md = d[ix['DEPT']]
                if md < lo - 1e-6 or md > hi + 1e-6:
                    continue
                tr = trows.get(round(md, 3))
                if tr is None:
                    sys.exit(f'REFUSES: no interpretation row at {w} {md}')
                dt, dts, rhob = d[ix['DT']], d[ix['DTS']], d[ix['RHOB']]
                vp = 304800.0 / dt if dt > 0 else None
                vs = 304800.0 / dts if dts > 0 else None
                rows.append([r(md, 4), r(vp, 3), r(vs, 3), r(rhob * 1000.0, 2) if rhob > 0 else None, r(d[ix['GR']], 3),
                             r(tr[2], 4), r(tr[3], 4), r(tr[4], 4)])
            pack['wells'][w] = {
                'x': heads[w]['x'], 'y': heads[w]['y'], 'kb_m': heads[w]['kb_m'],
                'tops_m': {'ogbiaShale': t['Ogbia Shale'], 'ekeneTop': t['Ekene Sand'], 'ekeneBase': t['Ekene Sand Base']},
                'columns': ['md_m', 'vp', 'vs', 'rho', 'gr', 'phit', 'vsh', 'sw'],
                'vpFrom': 'DT (us/ft): 304800 / DT', 'vsFrom': 'DTS (us/ft): 304800 / DTS', 'rhoFrom': 'RHOB (g/cc) x 1000',
                'rows': rows,
            }
            csl = []
            for line in list(open(cs))[1:]:
                c = line.split(',')
                csl.append([float(c[0]), float(c[1])])
            pack['checkshots'][w] = {'columns': ['md_m', 'owt_ms'], 'rows': csl}
    # Ekene-9: no density; the same window for the inventory lesson
    hdr, curves, data = read_las(os.path.join(KIT, '01-wells/Ekene-9.las'))
    pack['headers']['Ekene-9']['note'] = 'no density log'

    seis = os.path.join(KIT, '04-seismic')
    full = Segy(os.path.join(seis, 'EKENE3D-full.sgy'))
    files['04-seismic/EKENE3D-full.sgy'] = sha256(full.path)
    dt = full.dt_us / 1000.0
    e1 = heads['Ekene-1']
    _, il0, xl0, cx, cy = full.nearest(e1['x'], e1['y'])
    # Spectra: traces spread over the survey (ten inlines by twelve crosslines,
    # evenly spaced, the way QI Studio's QC samples a volume), 800 to 2400 ms.
    ils_all = sorted({k[0] for k in full.index}); xls_all = sorted({k[1] for k in full.index})
    even = lambda xs, k: [xs[round((i + 0.5) * len(xs) / k - 0.5)] for i in range(k)]
    T0, T1 = 800, 2400
    sil, sxl = even(ils_all, 10), even(xls_all, 12)
    pack['qcSpread'] = {'stack': 'full', 'inlines': sil, 'crosslines': sxl, 'dt_ms': dt, 't0_ms': T0, 't1_ms': T1,
                        'traces': [[window(full.trace(il, xl), dt, T0, T1) for xl in sxl] for il in sil]}
    # Signal to noise: 21 neighbouring traces along the inline through Ekene-1.
    pack['qcNeighbours'] = {'stack': 'full', 'centre': {'well': 'Ekene-1', 'inline': il0, 'crossline': xl0},
                            'inline': il0, 'crosslines': [xl0 - 10, xl0 + 10], 'dt_ms': dt, 't0_ms': T0, 't1_ms': T1,
                            'traces': [window(full.trace(il0, xl0 + dj), dt, T0, T1) for dj in range(-10, 11)]}
    # RMS amplitude slice, every trace, over a window round the Ekene Sand
    S0, S1 = 1250, 1350
    ils = sorted({k[0] for k in full.index}); xls = sorted({k[1] for k in full.index})
    sl = []
    for il in ils:
        row = []
        for xl in xls:
            tr = full.trace(il, xl)[int(S0 / dt):int(S1 / dt) + 1]
            row.append(r(math.sqrt(sum(v * v for v in tr) / len(tr)), 7))
        sl.append(row)
    pack['slice'] = {'stack': 'full', 'measure': 'RMS amplitude', 't0_ms': S0, 't1_ms': S1, 'inlines': [ils[0], ils[-1]],
                     'crosslines': [xls[0], xls[-1]], 'values': sl}
    # traces at the wells, four stacks
    stacks = {}
    for name in ('full', 'near', 'mid', 'far'):
        s = full if name == 'full' else Segy(os.path.join(seis, f'EKENE3D-{name}.sgy'))
        files[f'04-seismic/EKENE3D-{name}.sgy'] = sha256(s.path)
        stacks[name] = s
    W0, W1 = 900, 1700
    wt = {}
    for w in LOG_WELLS:
        _, il, xl, cx, cy = full.nearest(heads[w]['x'], heads[w]['y'])
        wt[w] = {'inline': il, 'crossline': xl, 'distance_m': r(math.hypot(cx - heads[w]['x'], cy - heads[w]['y']), 3),
                 **{name: window(stacks[name].trace(il, xl), dt, W0, W1) for name in stacks}}
    pack['wellTraces'] = {'dt_ms': dt, 't0_ms': W0, 't1_ms': W1, 'angleRanges_deg': {'full': [0, 30], 'near': [5, 15], 'mid': [15, 25], 'far': [25, 35]}, 'wells': wt}
    # gathers next to Ekene-1
    g = Segy(os.path.join(seis, 'gathers/EKENE3D-gathers-nmo.sgy'))
    files['04-seismic/gathers/EKENE3D-gathers-nmo.sgy'] = sha256(g.path)
    offs = sorted({k[2] for k in g.index})
    _, gil, gxl, gx, gy = g.nearest(e1['x'], e1['y'], offs[0])
    G0, G1 = 1000, 1700
    cdps = []
    for di in range(0, 3):
        for dj in range(0, 4):
            il, xl = gil + di - 1, gxl + dj - 1
            cdps.append({'inline': il, 'crossline': xl, 'traces': [window(g.trace(il, xl, o), g.dt_us / 1000.0, G0, G1) for o in offs]})
    pack['gathers'] = {'nmoCorrected': True, 'dt_ms': g.dt_us / 1000.0, 't0_ms': G0, 't1_ms': G1, 'offsets_m': offs,
                       'binWidth_m': offs[1] - offs[0], 'muteAngle_deg': 40, 'nearestToEkene1': {'inline': gil, 'crossline': gxl}, 'cdps': cdps}
    vt = [l.strip().split(',') for l in list(open(os.path.join(seis, 'gathers/ekene-rms-velocity.csv')))[1:] if l.strip()]
    pack['rmsVelocity'] = {'columns': ['t_ms', 'vrms_m_s'], 'rows': [[float(a), float(b)] for a, b in vt]}
    pack['source']['files'] = files
    s = json.dumps(pack, separators=(',', ':'), sort_keys=True)
    open(out, 'w').write(s + '\n')
    print('wrote', out, len(s), 'bytes, sha256', hashlib.sha256((s + '\n').encode()).hexdigest())


if __name__ == '__main__':
    main()
