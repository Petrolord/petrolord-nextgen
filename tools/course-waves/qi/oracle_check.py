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
    if '--json' in sys.argv:
        print(json.dumps({k: {'value': mine[k], 'oracle': 'oracle_check.py: standard-library Python replay (direct DFT, Batzle-Wang, Wood, VRH, Gassmann, OLS, Shuey, eigenvector line)'} for k in fields}))
        sys.exit(0)
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


# ------------------------------------------------ Professional: QUARVIN
# Independent replay of the six QUARVIN fields, written from the published
# methods and the engines' stated conventions:
#   Dix        Vint^2 = (V2^2 t2 - V1^2 t1) / (t2 - t1), times in seconds, the
#              first row's interval velocity its own RMS velocity
#   on a time  Vrms linear in time between rows, flat outside; Vint the Dix
#              velocity of the row segment the time falls in
#   Walden     sin(theta) = (Vint / Vrms) x / sqrt(x^2 + (Vrms t0)^2)
#   stretch    sqrt(t0^2 + x^2 / v^2) / t0 - 1 with v = Vrms
#   far stack  every trace's sample at the target time binned by its Walden
#              angle (bin k holds [edge k, edge k + 1)), the partial stack the
#              mean of every sample in the stated bins (fold-weighted)
#   Shuey      two-term least squares of amplitude on sin^2(theta) at the
#              stated bin angles, by the closed-form simple regression
#   one scale  sum(observed x modelled) / sum(modelled^2) over A and B
QCASE = os.path.join(os.path.dirname(CASE), 'quarvin_case.json')


def professional(plant):
    fields = {r[1]: r for r in json.load(open(os.path.join(HERE, 'fields.json'))) if r[0] == 'intermediate'}
    if len(fields) != 6:
        return None
    c = json.load(open(QCASE))
    st = c['stated']
    tms = [r[0] for r in c['velocity']['rows']]
    vr = [r[1] for r in c['velocity']['rows']]
    ts = [max(t, 1e-6) / 1000 for t in tms]
    seg = [vr[0]] + [math.sqrt((vr[i] ** 2 * ts[i] - vr[i - 1] ** 2 * ts[i - 1]) / (ts[i] - ts[i - 1])) for i in range(1, len(vr))]

    def vel_at(t):
        if t <= tms[0]:
            return vr[0], seg[0]
        if t >= tms[-1]:
            return vr[-1], seg[-1]
        j = max(k for k in range(len(tms) - 1) if tms[k] < t)
        f = (t - tms[j]) / (tms[j + 1] - tms[j])
        return vr[j] + f * (vr[j + 1] - vr[j]), seg[j + 1]

    def walden(x, t_ms, vrms, vint):
        sn = (vint / vrms) * x / math.sqrt(x * x + (vrms * t_ms / 1000) ** 2)
        return 90.0 if sn >= 1 else math.degrees(math.asin(sn))

    li = tms.index(st['dixLayer']['toMs'])
    dix = seg[li]
    vrms, vint = vel_at(st['timeMs'])
    wal = walden(st['offsetM'], st['timeMs'], vrms, vint)
    t0 = st['timeMs'] / 1000
    stretch = math.sqrt(t0 * t0 + st['offsetM'] ** 2 / vrms ** 2) / t0 - 1
    g = c['gather']
    i = round((st['targetMs'] - g['t0_ms']) / g['dt_ms'])
    t_i = g['t0_ms'] + i * g['dt_ms']
    vr_i, vi_i = vel_at(t_i)
    edges = st['angleEdges']
    sums = [0.0] * (len(edges) - 1)
    fold = [0] * (len(edges) - 1)
    for x, tr in zip(g['offsets_m'], g['traces']):
        v = tr[i]
        if v is None or not math.isfinite(v) or abs(v) >= 1e29:
            continue
        a = walden(x, t_i, vr_i, vi_i)
        for k in range(len(edges) - 1):
            if edges[k] <= a < edges[k + 1]:
                sums[k] += v
                fold[k] += 1
                break
    lo, hi = st['farBins']
    far = sum(sums[lo:hi]) / sum(fold[lo:hi])
    xs = [math.sin(math.radians(a)) ** 2 for a in st['stackAngles']]
    ys = [sums[k] / fold[k] for k in range(len(sums))]
    xb, yb = sum(xs) / len(xs), sum(ys) / len(ys)
    b = sum((x - xb) * (y - yb) for x, y in zip(xs, ys)) / sum((x - xb) ** 2 for x in xs)
    a_int = yb - b * xb
    so = sum(w['observed'][k] * w['modelled'][k] for w in c['wells'] for k in ('A', 'B'))
    sm = sum(w['modelled'][k] ** 2 for w in c['wells'] for k in ('A', 'B'))
    mine = {'quarvin_dix_vint': dix, 'quarvin_walden_deg': wal, 'quarvin_nmo_stretch': stretch,
            'quarvin_far_stack_amp': far, 'quarvin_shuey_a': a_int, 'quarvin_one_scale': so / sm}
    if plant:
        mine['quarvin_shuey_a'] = fields['quarvin_shuey_a'][2] + 10 * fields['quarvin_shuey_a'][3]
    bad, worst = [], (-1.0, '')
    for k, (_, _, v, tol) in fields.items():
        o = mine[k]
        rel = abs(o - v) / max(abs(v), 1e-300)
        print(f'  {k:24s} engine {v!r:24s} oracle {o!r:24s} relative {rel:.2e}  tolerances {abs(o - v) / tol:.3e}')
        worst = max(worst, (rel, k))
        if rel > REL or abs(o - v) > tol:
            bad.append(k)
    print(f'oracle_check: 6 Professional fields replayed in standard-library Python; worst relative disagreement {worst[0]:.2e} ({worst[1]}); over {REL}: {len(bad)}')
    return bad



# ---------------------------------------------------------------- Expert
# THE SIX DELSHOLM FIELDS, replayed with the standard library alone from the
# case file, written from the published methods and the engines' stated
# conventions (never their code):
#   LFM        the wells' supplied low-passed ln(AI), each sample of the second
#              position mapped to a well time by its proportional position
#              between the two horizons (offset kept above the first and below
#              the last), sampled linearly, weighted by inverse distance to the
#              stated power; samples no well covers hold the nearest covered
#              value
#   model-based  the regularised least-squares problem SOLVED EXACTLY by its
#              normal equations, (A'A + eps^2 I) m = A'd + eps^2 m0, A = C D
#              (centred difference, centred convolution), by Gaussian
#              elimination; the engine iterates CGLS from m0, so the two agree
#              when the engine has converged. The vendored goldens record the
#              engine within 1e-6 in ln(AI) of pylops' solution.
#   simultaneous  the same for the three-parameter Fatti operator (one
#              wavelet per angle, each parameter pulled to its own LFM by its
#              own weight); goldens: within 2e-4 in each ln parameter
#   porosity   ordinary least squares and the Student t interval of a new
#              observation, t from the regularised incomplete beta function
#              by bisection
#   facies     one Gaussian per facies (mean, variance on n - 1), priors the
#              sample proportions, Bayes' rule
#   column     a priority flood from the highest mapped node (four
#              neighbours), the running minimum when the flood first pops a
#              node on the edge of the mapped area
DCASE = os.path.join(os.path.dirname(CASE), 'delsholm_case.json')


def solve(M, v):
    n = len(v)
    a = [row[:] + [v[i]] for i, row in enumerate(M)]
    for c in range(n):
        p = max(range(c, n), key=lambda r: abs(a[r][c]))
        a[c], a[p] = a[p], a[c]
        piv = a[c][c]
        for r in range(n):
            if r != c and a[r][c] != 0.0:
                f = a[r][c] / piv
                ar, ac = a[r], a[c]
                for k in range(c, n + 1):
                    ar[k] -= f * ac[k]
    return [a[i][n] / a[i][i] for i in range(n)]


def op_cd(n, h):
    """The matrix of C D: centred convolution with h after the centred difference."""
    c = len(h) // 2
    D = [[0.0] * n for _ in range(n)]
    for i in range(1, n - 1):
        D[i][i + 1] = 0.5
        D[i][i - 1] = -0.5
    C = [[0.0] * n for _ in range(n)]
    for i in range(n):
        for k in range(len(h)):
            j = i - k + c
            if 0 <= j < n:
                C[i][j] += h[k]
    return [[sum(C[i][t] * D[t][j] for t in range(n) if C[i][t]) for j in range(n)] for i in range(n)]


def ls_reg(blocks, d, eps, m0):
    """min ||A x - d||^2 + sum eps_p^2 ||x_p - m0_p||^2 with A given as rows of blocks [A_p]."""
    P = len(m0)
    n = len(m0[0])
    N = P * n
    rows = []
    for blk in blocks:  # one entry per data trace: [A_p matrices], data
        mats, dat = blk
        for i in range(len(dat)):
            rows.append(([x for p in range(P) for x in mats[p][i]], dat[i]))
    M = [[0.0] * N for _ in range(N)]
    v = [0.0] * N
    for r, y in rows:
        nz = [(j, x) for j, x in enumerate(r) if x]
        for j, x in nz:
            v[j] += x * y
            Mj = M[j]
            for k, z in nz:
                Mj[k] += x * z
    for p in range(P):
        for i in range(n):
            M[p * n + i][p * n + i] += eps[p] ** 2
            v[p * n + i] += eps[p] ** 2 * m0[p][i]
    x = solve(M, v)
    return [x[p * n:(p + 1) * n] for p in range(P)]


def betainc(a, b, x):
    if x <= 0:
        return 0.0
    if x >= 1:
        return 1.0
    lbt = math.lgamma(a + b) - math.lgamma(a) - math.lgamma(b) + a * math.log(x) + b * math.log(1 - x)
    def cf(a, b, x):
        qab, qap, qam = a + b, a + 1, a - 1
        c, d = 1.0, 1 - qab * x / qap
        d = 1 / d
        h = d
        for m in range(1, 300):
            m2 = 2 * m
            aa = m * (b - m) * x / ((qam + m2) * (a + m2))
            d = 1 / (1 + aa * d); c = 1 + aa / c; h *= d * c
            aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2))
            d = 1 / (1 + aa * d); c = 1 + aa / c; de = d * c; h *= de
            if abs(de - 1) < 1e-15:
                break
        return h
    if x < (a + 1) / (a + b + 2):
        return math.exp(lbt) * cf(a, b, x) / a
    return 1 - math.exp(lbt) * cf(b, a, 1 - x) / b


def t_upper(p, dof):
    """t with P(T > t) = p, by bisection on the Student t tail."""
    tail = lambda t: 0.5 * betainc(dof / 2, 0.5, dof / (dof + t * t))
    lo, hi = 0.0, 100.0
    for _ in range(200):
        mid = (lo + hi) / 2
        if tail(mid) > p:
            lo = mid
        else:
            hi = mid
    return (lo + hi) / 2


def expert(plant):
    fields = {r[1]: r for r in json.load(open(os.path.join(HERE, 'fields.json'))) if r[0] == 'advanced'}
    if len(fields) != 6:
        return None
    c = json.load(open(DCASE))
    st = c['stated']
    t0, dt, ns = c['clock']['t0_ms'], c['clock']['dt_ms'], c['clock']['samples']
    # LFM at the second position
    B = c['positionB']

    def map_t(t, H, h):
        if t <= H[0]:
            return h[0] + (t - H[0])
        if t >= H[-1]:
            return h[-1] + (t - H[-1])
        for i in range(len(H) - 1):
            if t <= H[i + 1]:
                span = H[i + 1] - H[i]
                p = (t - H[i]) / span if span > 0 else 0
                return h[i] + p * (h[i + 1] - h[i])
        return t

    def samp(vals, t):
        x = (t - t0) / dt
        if not (x >= 0) or x > len(vals) - 1:
            return float('nan')
        i = math.floor(x); f = x - i
        if f < 1e-12:
            return vals[i]
        return vals[i] + f * (vals[i + 1] - vals[i])

    pw = st['lfm']['power']
    lfm = []
    for k in range(ns):
        t = t0 + k * dt
        s_ = w_ = 0.0
        for w in c['wells']:
            d = math.hypot(w['x'] - B['x'], w['y'] - B['y'])
            v = samp(w['lnAiLowPassed'], map_t(t, B['horizonsMs'], w['horizonsMs']))
            if math.isfinite(v):
                wt = 1 / d ** pw
                s_ += wt * v; w_ += wt
        lfm.append(s_ / w_ if w_ > 0 else float('nan'))
    first = next(k for k in range(ns) if math.isfinite(lfm[k]))
    for k in range(first):
        lfm[k] = lfm[first]
    for k in range(first + 1, ns):
        if not math.isfinite(lfm[k]):
            lfm[k] = lfm[k - 1]
    o_lfm = lfm[st['lfm']['sampleB']]
    # model-based, exactly
    A = c['traceA']
    m0 = A['lowFrequencyModels']
    CD = op_cd(ns, A['fullWavelet'])
    (m_ai,) = ls_reg([([CD], A['full'])], A['full'], [st['modelBased']['eps']], [m0['lnAi']])
    o_mb = math.exp(m_ai[st['modelBased']['sampleA']])
    # simultaneous, exactly
    K2 = A['backgroundVsVp'] ** 2
    blocks = []
    for th, h, tr in zip(A['angles_deg'], A['angleWavelets'], A['angleTraces']):
        t = math.radians(th); s2 = math.sin(t) ** 2; tn2 = math.tan(t) ** 2
        g = [0.5 * (1 + tn2), -4 * K2 * s2, 0.5 * (4 * K2 * s2 - tn2)]
        cdk = op_cd(ns, h)
        blocks.append(([[[g[p] * x for x in row] for row in cdk] for p in range(3)], tr))
    la, ls_, lr = ls_reg(blocks, None, st['simultaneous']['eps'], [m0['lnAi'], m0['lnSi'], m0['lnRho']])
    k = st['simultaneous']['sampleA']
    o_sim = math.exp(la[k] - ls_[k])
    # porosity interval
    xs = [r[0] for r in c['calibration']['porosity']['rows']]
    ys = [r[1] for r in c['calibration']['porosity']['rows']]
    n = len(xs); xb = sum(xs) / n; yb = sum(ys) / n
    sxx = sum((x - xb) ** 2 for x in xs)
    b = sum((x - xb) * (y - yb) for x, y in zip(xs, ys)) / sxx
    a = yb - b * xb
    s_e = math.sqrt(sum((y - a - b * x) ** 2 for x, y in zip(xs, ys)) / (n - 2))
    x0 = st['porosity']['atAi']; lvl = st['porosity']['level']
    tq = t_upper((1 - lvl) / 2, n - 2)
    o_phi = a + b * x0 + tq * s_e * math.sqrt(1 + 1 / n + (x0 - xb) ** 2 / sxx)
    # facies posterior
    groups = {}
    for name, ai in c['calibration']['facies']['rows']:
        groups.setdefault(name, []).append(ai)
    tot = sum(len(v) for v in groups.values())
    xq = st['facies']['atAi']
    lp = {}
    for name, v in groups.items():
        mu = sum(v) / len(v); var = sum((x - mu) ** 2 for x in v) / (len(v) - 1)
        lp[name] = math.log(len(v) / tot) - 0.5 * (xq - mu) ** 2 / var - 0.5 * math.log(2 * math.pi * var)
    mx = max(lp.values()); den = sum(math.exp(v - mx) for v in lp.values())
    o_p = math.exp(lp[st['facies']['class']] - mx) / den
    # column by a priority flood
    import heapq
    g_ = c['grid']; nx, ny = g_['spec']['nx'], g_['spec']['ny']
    z = [v if v is not None else 1e30 for v in g_['z']]
    live = lambda i: abs(z[i]) < 1e29
    def nb(i):
        r, cc = divmod(i, nx)
        out = []
        if cc > 0: out.append(i - 1)
        if cc < nx - 1: out.append(i + 1)
        if r > 0: out.append(i - nx)
        if r < ny - 1: out.append(i + nx)
        return out
    def boundary(i):
        r, cc = divmod(i, nx)
        if r in (0, ny - 1) or cc in (0, nx - 1):
            return True
        return any(not live(j) for j in nb(i))
    crest = max((i for i in range(nx * ny) if live(i)), key=lambda i: z[i])
    heap = [(-z[crest], crest)]; seen = {crest}; run = float('inf')
    while heap:
        nz_, i = heapq.heappop(heap)
        run = min(run, z[i])
        if boundary(i):
            break
        for j in nb(i):
            if j not in seen and live(j):
                seen.add(j); heapq.heappush(heap, (-z[j], j))
    o_col = z[crest] - run
    mine = {'delsholm_lfm_lnai_b': o_lfm, 'delsholm_mb_ai': o_mb, 'delsholm_sim_vpvs': o_sim,
            'delsholm_phi_q90': o_phi, 'delsholm_p_oil': o_p, 'delsholm_column_ft': o_col}
    if plant:
        mine['delsholm_p_oil'] = fields['delsholm_p_oil'][2] + 10 * fields['delsholm_p_oil'][3]
    solver = {'delsholm_mb_ai', 'delsholm_sim_vpvs'}
    bad, worst = [], (-1.0, '')
    for key, (_, _, v, tol) in fields.items():
        o = mine[key]
        rel = abs(o - v) / max(abs(v), 1e-300)
        tag = ' (solver: exact normal equations against the converged engine)' if key in solver else ''
        print(f'  {key:24s} engine {v!r:24s} oracle {o!r:24s} relative {rel:.2e}  tolerances {abs(o - v) / tol:.3e}{tag}')
        worst = max(worst, (rel, key))
        if abs(o - v) > tol or (key not in solver and rel > REL):
            bad.append(key)
    print(f'oracle_check: 6 Expert fields replayed in standard-library Python; worst relative disagreement {worst[0]:.2e} ({worst[1]}); failing: {len(bad)}')
    return bad

if __name__ == '__main__':
    plant = '--plant' in sys.argv
    bad_p = professional(plant)
    bad_e = expert(plant)
    try:
        main()
        code = 0
    except SystemExit as e:
        code = e.code or 0
    if bad_p is not None:
        if plant:
            print(f'NEGATIVE CONTROL: quarvin_shuey_a moved by ten tolerances; {"caught" if bad_p == ["quarvin_shuey_a"] else "NOT CAUGHT"}')
            if bad_p != ['quarvin_shuey_a']:
                code = 2
        elif bad_p:
            code = max(code, 1)
    if bad_e is not None:
        if plant:
            print(f'NEGATIVE CONTROL: delsholm_p_oil moved by ten tolerances; {"caught" if bad_e == ["delsholm_p_oil"] else "NOT CAUGHT"}')
            if bad_e != ['delsholm_p_oil']:
                code = 2
        elif bad_e:
            code = max(code, 1)
    sys.exit(code)
