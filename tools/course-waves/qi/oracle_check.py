#!/usr/bin/env python3
"""THE SIX GRADED QI ASSOCIATE ANSWERS, RECOMPUTED INDEPENDENTLY IN PYTHON.

fields.json is written from the JavaScript engines through the teaching lab.
This replays the TAMBERLO case file with the Python standard library alone and
reads no JavaScript at run time: every step is written here from the published
method, following the engines' stated conventions (read from their source and
restated below) but never their code.

  spectrum   each trace tapered by a Tukey window whose flat part is cut at
             floor(alpha (n - 1) / 2) samples each end, zero padded to twice
             the next power of two, transformed by a DIRECT discrete Fourier
             transform (the engine uses a radix-2 FFT), amplitudes power
             averaged over the traces; the peak refined by a parabola through
             the three highest bins; -6 dB edges interpolated linearly; the
             centroid the power-weighted mean frequency over every bin
  shear      ordinary least squares of Vs on Vp in km/s by the closed-form
             slope sum((x - xbar)(y - ybar)) / sum((x - xbar)^2) (the engine
             inverts the normal equations by Gauss-Jordan)
  fluids     Batzle and Wang (1992) brine (eqs 27, 28, 29) and live oil (eqs 22
             to 24 with the dead-oil velocity of eq 20a at the pseudo density),
             mixed by Wood; quartz and clay by Voigt-Reuss-Hill; Gassmann
             through the dry rock
  distance   Shuey's two terms; the wet logs blocked, an interface at every
             block boundary, the fluid line through the origin as the
             principal axis (total least squares, by the eigenvector of the
             2 x 2 scatter matrix, where the engine uses the half-angle
             formula), and the signed perpendicular distance

TWO AGREEMENTS FOR EVERY FIELD: 1e-6 relative or better AND within its own
grading tolerance absolute; the worst disagreement is printed relative and in
grading tolerances.

    python3 oracle_check.py [--plant]

--plant is THE NEGATIVE CONTROL: it perturbs one graded value by ten
tolerances before comparing, and must exit 1 naming it.

Exit 0 clean, 1 a disagreement, 2 could not run.
"""
import cmath
import json
import math
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.environ.get('QI_REPO', '/root/wt-qi-nextgen')
CASE = os.path.join(REPO, 'src/content/capstone-cases/qi/tamberlo_case.json')
REL = 1e-6


def die(m):
    print('oracle_check REFUSES:', m)
    sys.exit(2)


# ---------------------------------------------------------------- spectrum
def tukey(n, alpha):
    w = [1.0] * n
    edge = int(math.floor(alpha * (n - 1) / 2))
    for i in range(edge):
        v = 0.5 * (1 - math.cos(math.pi * i / edge))
        w[i] = v
        w[n - 1 - i] = v
    return w


def next_pow2(n):
    p = 1
    while p < n:
        p *= 2
    return p


def amp_spectrum(trace, dt_ms, taper):
    n = len(trace)
    w = tukey(n, min(1.0, max(0.0, taper)))
    N = 2 * next_pow2(n)
    x = [trace[i] * w[i] for i in range(n)]
    half = N // 2 + 1
    tw = [cmath.exp(-2j * math.pi * k / N) for k in range(N)]
    amps = []
    for k in range(half):
        s = 0j
        for i in range(n):
            s += x[i] * tw[(k * i) % N]
        amps.append(abs(s))
    df = 1000.0 / (N * dt_ms)
    return [k * df for k in range(half)], amps


def spectrum_stats(freq, amp):
    kmax = 1
    for k in range(1, len(amp)):
        if amp[k] > amp[kmax]:
            kmax = k
    peak_hz, peak_amp = freq[kmax], amp[kmax]
    if 0 < kmax < len(amp) - 1:
        a, b, c = amp[kmax - 1], amp[kmax], amp[kmax + 1]
        den = a - 2 * b + c
        if den < 0:
            p = 0.5 * (a - c) / den
            peak_hz = freq[kmax] + p * (freq[1] - freq[0])
            peak_amp = b - 0.25 * (a - c) * p
    pw = [v * v for v in amp]
    centroid = math.fsum(p * f for p, f in zip(pw, freq)) / math.fsum(pw)
    thr = peak_amp * 10 ** (-6 / 20)
    lo = freq[0]
    for k in range(kmax, 0, -1):
        if amp[k - 1] < thr:
            lo = freq[k - 1] + (thr - amp[k - 1]) / (amp[k] - amp[k - 1]) * (freq[k] - freq[k - 1])
            break
    return lo, centroid


# ---------------------------------------------------------------- fluids
def water_density(t, p):
    x = (-80 * t - 3.3 * t * t + 0.00175 * t ** 3 + 489 * p - 2 * t * p + 0.016 * t * t * p
         - 1.3e-5 * t ** 3 * p - 0.333 * p * p - 0.002 * t * p * p)
    return 1 + 1e-6 * x


WV = [[1402.85, 1.524, 3.437e-3, -1.197e-5], [4.871, -1.11e-2, 1.739e-4, -1.628e-6],
      [-4.783e-2, 2.747e-4, -2.135e-6, 1.237e-8], [1.487e-4, -6.503e-7, -1.455e-8, 1.327e-10],
      [-2.197e-7, 7.987e-10, 5.23e-11, -4.614e-13]]


def water_velocity(t, p):
    return sum(WV[i][j] * t ** i * p ** j for i in range(5) for j in range(4))


def brine(t, p, s):
    rho = (water_density(t, p) + s * (0.668 + 0.44 * s + 1e-6 * (300 * p - 2400 * p * s + t * (80 + 3 * t - 3300 * s - 13 * p + 47 * p * s)))) * 1000
    vp = (water_velocity(t, p) + s * (1170 - 9.6 * t + 0.055 * t * t - 8.5e-5 * t ** 3 + 2.6 * p - 0.0029 * t * p - 0.0476 * p * p)
          + s ** 1.5 * (780 - 10 * p + 0.16 * p * p) - 820 * s * s)
    return rho, rho * vp * vp


def live_oil(t, p, rho0, gor, g):
    b0 = 0.972 + 0.00038 * (2.4 * gor * math.sqrt(g / rho0) + t + 17.8) ** 1.175
    rho = (rho0 + 0.0012 * g * gor) / b0 * 1000
    rp = rho0 / b0 / (1 + 0.001 * gor)
    vp = 2096 * math.sqrt(rp / (2.6 - rp)) - 3.7 * t + 4.64 * p + 0.0115 * (4.12 * math.sqrt(1.08 / rp - 1) - 1) * t * p
    return rho, rho * vp * vp


def wood(phases):
    return 1 / sum(s / k for k, _, s in phases if s > 0), sum(s * r for _, r, s in phases)


def vrh(fq, kq, fc, kc):
    v = fq * kq + fc * kc
    r = 1 / ((fq / kq if fq else 0) + (fc / kc if fc else 0))
    return 0.5 * (v + r)


def substitute(vp, vs, rho, kmin, phi, kA, rA, kB, rB):
    mu = rho * vs * vs
    ks = rho * vp * vp - 4 * mu / 3
    kd = (ks * (phi * kmin / kA + 1 - phi) - kmin) / (phi * kmin / kA + ks / kmin - 1 - phi)
    kb = kd + (1 - kd / kmin) ** 2 / (phi / kB + (1 - phi) / kmin - kd / kmin ** 2)
    rhob = rho + phi * (rB - rA)
    return math.sqrt((kb + 4 * mu / 3) / rhob), math.sqrt(mu / rhob), rhob


def shuey_ab(u, l):
    vp, vs, rho = (u[0] + l[0]) / 2, (u[1] + l[1]) / 2, (u[2] + l[2]) / 2
    dvp, dvs, drho = l[0] - u[0], l[1] - u[1], l[2] - u[2]
    a = 0.5 * (dvp / vp + drho / rho)
    b = 0.5 * (dvp / vp) - 2 * (vs / vp) ** 2 * (drho / rho + 2 * dvs / vs)
    return a, b


def main():
    if not os.path.exists(CASE):
        die('no case file ' + CASE)
    c = json.load(open(CASE))
    fields = {r[1]: r for r in json.load(open(os.path.join(HERE, 'fields.json'))) if r[0] == 'beginner'}
    if len(fields) != 6:
        die('fields.json does not carry six Associate fields')
    st = c['stated']
    T = c['traces']
    traces = T['traces']
    if len(traces) < 2:
        die('the case carries fewer than two traces')
    acc = None
    for tr in traces:
        f, a = amp_spectrum(tr, T['dt_ms'], st['taper'])
        acc = [x * x for x in a] if acc is None else [p + x * x for p, x in zip(acc, a)]
    amp = [math.sqrt(p / len(traces)) for p in acc]
    low6, cen = spectrum_stats(f, amp)

    W = c['well']
    ix = {k: i for i, k in enumerate(W['columns'])}
    rows = [{k: r[ix[k]] for k in ix} for r in W['rows']]
    ok = [r for r in rows if r['vp'] > 0 and r['vs'] > 0 and r['rho'] > 0]
    top, base, owc, cut = W['topFt'], W['baseFt'], W['owcFt'], st['netSandVshCut']
    inres = lambda r: top <= r['md_ft'] <= base
    water = [r for r in ok if inres(r) and r['vsh'] <= cut and r['md_ft'] >= owc and r['vs'] < r['vp']]
    xs = [r['vp'] / 1000 for r in water]
    ys = [r['vs'] for r in water]
    xb, yb = sum(xs) / len(xs), sum(ys) / len(ys)
    slope = math.fsum((x - xb) * (y - yb) for x, y in zip(xs, ys)) / math.fsum((x - xb) ** 2 for x in xs)

    cond = c['conditions']
    t = (cond['tF'] - 32) / 1.8
    p = cond['pPsia'] / 145.03773773020923
    gor = cond['gorScfStb'] * 0.028316846592 / 0.158987294928
    rho0 = 141.5 / (cond['api'] + 131.5)
    rb, kb = brine(t, p, cond['salinity'])
    ro, ko = live_oil(t, p, rho0, gor, cond['gasSg'])

    def to_brine(r):
        kA, rA = wood([(kb, rb, r['sw']), (ko, ro, 1 - r['sw'])])
        kB, rB = wood([(kb, rb, 1.0), (ko, ro, 0.0)])
        kmin = vrh(1 - r['vsh'], 36.6e9, r['vsh'], 20.9e9)
        return substitute(r['vp'], r['vs'], r['rho'], kmin, r['phit'], kA, rA, kB, rB)

    smp = [r for r in rows if abs(r['md_ft'] - st['substitutionSampleFt']) < 0.25][0]
    vp2, vs2, rho2 = to_brine(smp)
    ai, vpvs = vp2 * rho2, vp2 / vs2

    shale = [r for r in ok if top - st['shaleAboveFt'] <= r['md_ft'] < top]
    oil = [r for r in ok if inres(r) and r['vsh'] <= cut and r['md_ft'] < owc]
    mean = lambda rs, k: sum(r[k] for r in rs) / len(rs)
    a0, b0 = shuey_ab([mean(shale, k) for k in ('vp', 'vs', 'rho')], [mean(oil, k) for k in ('vp', 'vs', 'rho')])
    wet = []
    for r in ok:
        wet.append(to_brine(r) if r['sw'] < 1 else (r['vp'], r['vs'], r['rho']))
    steps = sorted(ok[i + 1]['md_ft'] - ok[i]['md_ft'] for i in range(len(ok) - 1))
    size = max(1, round(st['trendBlockFt'] / steps[(len(steps) - 1) // 2]))
    blocks, cur = [], []
    for v in wet:
        if not (v[0] > 0 and v[1] > 0 and v[2] > 0 and v[1] < v[0]):
            continue
        cur.append(v)
        if len(cur) >= size:
            blocks.append([sum(x[i] for x in cur) / len(cur) for i in range(3)])
            cur = []
    if cur and len(cur) >= math.ceil(size / 2):
        blocks.append([sum(x[i] for x in cur) / len(cur) for i in range(3)])
    pts = [shuey_ab(blocks[k - 1], blocks[k]) for k in range(1, len(blocks)) if blocks[k - 1] != blocks[k]]
    saa = sum(a * a for a, _ in pts)
    sbb = sum(b * b for _, b in pts)
    sab = sum(a * b for a, b in pts)
    # the principal eigenvector of [[saa, sab], [sab, sbb]]
    lam = 0.5 * (saa + sbb) + math.sqrt(0.25 * (saa - sbb) ** 2 + sab * sab)
    m = (lam - saa) / sab
    dist = (b0 - m * a0) / math.sqrt(1 + m * m)

    mine = {
        'tamberlo_low6_hz': low6, 'tamberlo_centroid_hz': cen, 'tamberlo_shear_slope': slope,
        'tamberlo_ai_brine': ai, 'tamberlo_vpvs_brine': vpvs, 'tamberlo_wet_distance': dist,
    }
    if '--plant' in sys.argv:
        k = 'tamberlo_shear_slope'
        mine[k] = fields[k][2] + 10 * fields[k][3]
    bad = []
    worst = (0, None)
    for k, (_, _, v, tol) in fields.items():
        o = mine[k]
        rel = abs(o - v) / max(abs(v), 1e-300)
        print(f'  {k:24s} engine {v!r:24s} oracle {o!r:24s} relative {rel:.2e}  tolerances {abs(o - v) / tol:.3e}')
        worst = max(worst, (rel, k))
        if rel > REL or abs(o - v) > tol:
            bad.append(k)
    print(f'oracle_check: 6 Associate fields replayed in standard-library Python; worst relative disagreement {worst[0]:.2e} ({worst[1]}); over {REL}: {len(bad)}')
    if '--plant' in sys.argv:
        print(f'NEGATIVE CONTROL: tamberlo_shear_slope moved by ten tolerances; {"caught" if bad == ["tamberlo_shear_slope"] else "NOT CAUGHT"}')
        sys.exit(1 if bad == ['tamberlo_shear_slope'] else 2)
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
