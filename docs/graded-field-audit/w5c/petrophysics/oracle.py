#!/usr/bin/env python3
"""Independent second opinion on the IKPO-3 keys that are closed forms: reads
the case LAS with lasio (float32 samples, as the engine's parser stores them)
and recomputes, from the textbook formulas written out here, the N-D and Wyllie
zone means, the Pickett least-squares fit in its window, Arps, the SP Rwe and
the water-leg mean Archie Sw. The gate itself (panels/petrophysics/
w5cRecase.test.js) regenerates every key through the engine.

  /path/to/venv/bin/python docs/graded-field-audit/w5c/petrophysics/oracle.py
"""
import json, math, os
import lasio
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
L = lasio.read(os.path.join(HERE, '..', '..', '..', '..', 'src', 'content', 'capstone-cases', 'petrophysics', 'ikpo3.las'))
F = {f['key']: f['expected'] for t in json.load(open(os.path.join(HERE, 'fields.json'))).values() for f in t}
d = L.index.astype(np.float32).astype(float)
c = {k: L[k].astype(np.float32).astype(float) for k in ('GR', 'RHOB', 'NPHI', 'DT', 'RT')}
rho_ma, rho_fl, dt_ma, dt_fl, a, m, n, rw = 2.65, 1.0, 182.0, 656.0, 1.0, 2.0, 2.0, 0.05
phid = (rho_ma - c['RHOB']) / (rho_ma - rho_fl)
phind = (phid + c['NPHI']) / 2
phiw = (c['DT'] - dt_ma) / (dt_fl - dt_ma)
def zmean(x, top, base):
    s = (d >= top) & (d <= base) & np.isfinite(x)
    return x[s].mean()
got = {'ikpo3_phind_avg_sand_a': zmean(phind, 1712, 1734), 'ikpo3_phiw_avg_sand_a': zmean(phiw, 1712, 1734)}
w = (d >= 1773) & (d <= 1779) & np.isfinite(phind) & np.isfinite(c['RT']) & (phind > 0)
x, y = np.log10(phind[w]), np.log10(c['RT'][w])
slope, icpt = np.polyfit(x, y, 1)
got['ikpo3_pickett_m'] = -slope
got['ikpo3_pickett_a_rw'] = 10 ** icpt
rwA = 0.1128 * (72 + 6.77) / (172 + 6.77)
got['ikpo3_rw_arps'] = rwA
K = 61 + 0.133 * 172
got['ikpo3_rwe_ssp'] = 0.6 * 10 ** (-90 / K)
wl = (d >= 1776) & (d <= 1779) & np.isfinite(phind) & np.isfinite(c['RT'])
got['ikpo3_sw_waterleg_mean'] = np.mean(((a * rwA) / (phind[wl] ** m * c['RT'][wl])) ** (1 / n))
bad = 0
for k, v in got.items():
    ok = abs(v - F[k]) <= 1e-9 * max(1, abs(F[k]))
    bad += not ok
    print(f"{'ok ' if ok else 'BAD'} {k}: oracle {v!r}  fields.json {F[k]!r}")
raise SystemExit(1 if bad else 0)
