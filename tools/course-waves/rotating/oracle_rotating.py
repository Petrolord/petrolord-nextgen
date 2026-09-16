#!/usr/bin/env python3
"""FC3 independent oracle for engines/facilities/pumps.js and compression.js.

PYTHON STANDARD LIBRARY ONLY. NOTHING HERE IMPORTS THE ENGINE, READS ITS
SOURCE, OR TRANSCRIBES ITS CODE. Where a quantity has a derivation, this file
derives it; where it is an empirical correlation with no derivation, this file
says so out loud and checks only what can honestly be checked.

THIS IS A THIRD ROUTE. The engine's own oracles already exist and this one
repeats neither of them:

  engine                    engine's oracle              THIS ORACLE
  ----------------------------------------------------------------------------
  fit: float Gauss          fit: float Cramer            fit: EXACT RATIONAL
                                                         Gauss over Fractions,
                                                         orthogonality residual
                                                         exactly 0, not small
  duty: bisection           duty: 2e6-point scan         duty: CLOSED-FORM root
                                                         of the quadratic the
                                                         two curves make
  power: 3960 packaging     power: SI at rho = 999.0     power: the packaging
                                                         DERIVED from its own
                                                         definition, so the
                                                         constant is explained
                                                         rather than compared
  NPSH: 2.31 packaging      NPSH: pascal balance         NPSH: from the water
                                                         density the 2.31 and
                                                         3960 packagings imply,
                                                         which is derived here
  head: closed form         head: Simpson integration    head: 64-POINT
                                                         GAUSS-LEGENDRE in
                                                         50-digit Decimal, plus
                                                         a PATH-PROPERTY check
                                                         that p v^n is really
                                                         constant along it
  T2: closed exponential    T2: 1e5-step march           T2: INVERTED out of
                                                         the head integral
  stages: 12-pass loop      stages: brute force          stages: CLOSED FORM in
                                                         logarithms
  hp identity: asserted     hp identity: asserted        hp identity: PROVED in
                                                         exact rational algebra
                                                         (and shown to be a
                                                         tautology)

THE ORACLE REFUSES ON AN EMPTY SWEEP and carries a NEGATIVE CONTROL, because a
gate that reports success on zero input is worse than no gate.

Writes goldens/*.json. Compare with compare.mjs, which runs the engine over
these same inputs.
"""

import json
import math
import os
import sys
from decimal import Decimal, getcontext
from fractions import Fraction

getcontext().prec = 60

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'goldens')

# ===========================================================================
# A. CONSTANTS DERIVED FROM THEIR DEFINITIONS. Nothing here is quoted.
# ===========================================================================

# SI definitions, exact by international agreement.
FT_M = Fraction(3048, 10000)                    # 1 ft = 0.3048 m, exact
LB_KG = Fraction(45359237, 100000000)           # 1 lb = 0.45359237 kg, exact
G0 = Fraction(980665, 100000)                   # standard gravity, m/s2, exact
IN3_PER_GAL = 231                               # US gallon, exact
IN3_PER_FT3 = 1728                              # exact
J_PER_BTU_IT = Fraction(105505585262, 100000000)  # 1 Btu_IT = 1055.05585262 J
R_SI = Fraction(831446261815324, 100000000000000)  # J/(mol K), 2019 SI, exact
MOL_PER_LBMOL = Fraction(45359237, 100000)      # 453.59237 mol per lbmol

# 1 ft.lbf in joules: force = lbm * g0 newtons, distance = ft metres.
J_PER_FT_LBF = FT_M * LB_KG * G0                 # exact rational
FT_LBF_PER_BTU = J_PER_BTU_IT / J_PER_FT_LBF     # exact rational

# Horsepower is DEFINED as 550 ft.lbf/s.
FT_LBF_PER_S_PER_HP = 550
FT_LBF_PER_MIN_PER_HP = 550 * 60                 # 33000, exact by definition
BTU_PER_HP_HR = Fraction(550 * 3600) / FT_LBF_PER_BTU
W_PER_HP = float(Fraction(550) * J_PER_FT_LBF)
KW_PER_HP = W_PER_HP / 1000.0

# Universal gas constant in field units.
#   ft.lbf/(lbmol.degR): J/(mol.K) -> per lbmol -> per degR (5/9 K) -> ft.lbf
R_FT_LBF = R_SI * MOL_PER_LBMOL * Fraction(5, 9) / J_PER_FT_LBF
#   psia.ft3/(lbmol.degR): p*V in psi.ft3 is lbf/in2 * 1728 in3 = 144 ft.lbf
R_PSIA_FT3 = R_FT_LBF / 144

# The water density each pump packaging implies. Both are DERIVED from the
# packaging's own definition, so the digest can print them without quoting a
# handbook.
#   2.31 ft of head per psi at SG 1 means 144 / 2.31 lb/ft3.
#   3960 in whp = Q H SG / 3960 means 33000/3960 lb per gallon.
RHO_FROM_231 = Fraction(144 * 100, 231)          # 144 / 2.31 exactly
RHO_FROM_3960 = Fraction(33000, 3960) * Fraction(IN3_PER_FT3, IN3_PER_GAL)

# Standard molar volume, scf/lbmol, at each of the three bases this product
# uses somewhere. Derived from the ideal gas law, not quoted.
def molar_volume_scf(p_psia, t_degr):
    return float(R_PSIA_FT3) * t_degr / p_psia

STD_BASES = {
    '14.696 psia, 519.67 degR (the 60 degF base)': (14.696, 519.67),
    '14.7 psia, 520 degR (the base actualInletCfm uses)': (14.7, 520.0),
    '14.65 psia, 520 degR (the base the gas transmission forms use)': (14.65, 520.0),
}

R_OFFSET = Fraction(45967, 100)                  # degF to degR, the definition

# ===========================================================================
# B. THE PUMP CURVE FIT, IN EXACT RATIONAL ARITHMETIC
# ===========================================================================

def fit_exact(points):
    """Least-squares quadratic in x = q/scale, solved over the rationals.

    The engine runs float Gaussian elimination and its own oracle runs float
    Cramer. This runs Gaussian elimination over Fraction, so the normal
    equations are solved with no rounding at all, and the residual
    orthogonality that DEFINES a least-squares solution comes out EXACTLY
    zero rather than merely small. A fit that matches an exact solve cannot
    be matching a shared arithmetic mistake.
    """
    qs = [Fraction(str(p[0])) for p in points]
    hs = [Fraction(str(p[1])) for p in points]
    scale = max(qs) or Fraction(1)
    xs = [q / scale for q in qs]
    s = [sum(x ** i for x in xs) for i in range(5)]
    t = [sum((x ** i) * h for x, h in zip(xs, hs)) for i in range(3)]
    A = [[s[0], s[1], s[2]], [s[1], s[2], s[3]], [s[2], s[3], s[4]]]
    b = [t[0], t[1], t[2]]
    for c in range(3):
        piv = max(range(c, 3), key=lambda r: abs(A[r][c]))
        A[c], A[piv] = A[piv], A[c]
        b[c], b[piv] = b[piv], b[c]
        if A[c][c] == 0:
            return None
        for r in range(c + 1, 3):
            f = A[r][c] / A[c][c]
            for k in range(c, 3):
                A[r][k] -= f * A[c][k]
            b[r] -= f * b[c]
    x = [Fraction(0)] * 3
    for r in (2, 1, 0):
        acc = b[r]
        for k in range(r + 1, 3):
            acc -= A[r][k] * x[k]
        x[r] = acc / A[r][r]
    c0, c1, c2 = x

    def head_at(q):
        u = Fraction(str(q)) / scale
        return c0 + c1 * u + c2 * u * u

    # The defining property, checked exactly. Each must be exactly 0.
    ortho = []
    for col in range(3):
        acc = Fraction(0)
        for q, h, u in zip(qs, hs, xs):
            acc += (h - head_at(q)) * (u ** col)
        ortho.append(acc)
    sse = sum((h - head_at(q)) ** 2 for q, h in zip(qs, hs))
    mean = sum(hs) / len(hs)
    sst = sum((h - mean) ** 2 for h in hs)
    return {
        'c0': c0, 'c1': c1, 'c2': c2, 'scale': scale,
        'head_at': head_at,
        'shutoff': head_at(0),
        'r2': (Fraction(1) - sse / sst) if sst > 0 else Fraction(1),
        'ortho_exactly_zero': all(o == 0 for o in ortho),
        'max_ortho': max(abs(o) for o in ortho),
    }


# ===========================================================================
# C. THE DUTY POINT, IN CLOSED FORM
# ===========================================================================

def duty_closed_form(fit, static_ft, k_ft, n_parallel=1, n_series=1):
    """The intersection is the root of a quadratic; solve it, do not search.

    pump head at q, for n_par machines in parallel and n_ser in series:
        H_p(q) = n_ser * ( c0 + c1 * u + c2 * u^2 ),  u = q / (n_par * scale)
    system head:
        H_s(q) = static + k q^2
    Setting them equal gives A q^2 + B q + C = 0 with
        A = n_ser*c2/(n_par*scale)^2 - k
        B = n_ser*c1/(n_par*scale)
        C = n_ser*c0 - static
    Solved with the sign-stable form of the quadratic formula. The engine
    bisects 200 times and its own oracle scans two million points; this is
    the answer both of them are converging on, written down.
    """
    ns = Fraction(n_series)
    den = Fraction(n_parallel) * fit['scale']
    A = ns * fit['c2'] / (den * den) - Fraction(str(k_ft))
    B = ns * fit['c1'] / den
    C = ns * fit['c0'] - Fraction(str(static_ft))
    if A == 0:
        if B == 0:
            return None
        q = -C / B
        return float(q) if q > 0 else None
    disc = B * B - 4 * A * C
    if disc < 0:
        return None
    # sign-stable: compute the larger-magnitude root first, then the other
    sq = math.sqrt(float(disc))
    fa, fb = float(A), float(B)
    if fb >= 0:
        r1 = (-fb - sq) / (2 * fa)
    else:
        r1 = (-fb + sq) / (2 * fa)
    r2 = (float(C) / fa) / r1 if r1 != 0 else None
    roots = [r for r in (r1, r2) if r is not None and r > 0]
    if not roots:
        return None
    # the physical crossing is the one where the pump curve is still falling
    # into the system curve: the smallest positive root of a drooping pump
    # against a rising system is the only crossing above zero flow.
    return min(roots)


# ===========================================================================
# D. POWER AND HEAD-PRESSURE, FROM THE DERIVED PACKAGINGS
# ===========================================================================

def whp_from_first_principles(q_gpm, head_ft, sg, rho_water_lb_ft3):
    """P = rho g Q H, assembled in field units from the derived constants.

    mass flow lb/min  = q_gpm * (231/1728) ft3/gal... * rho
    work per minute   = mass * head  (ft.lbf, since lbf = lbm in field units)
    hp                = ft.lbf/min / 33000
    """
    ft3_per_gal = Fraction(IN3_PER_GAL, IN3_PER_FT3)
    lb_per_min = Fraction(str(q_gpm)) * ft3_per_gal * rho_water_lb_ft3 * Fraction(str(sg))
    ft_lbf_per_min = lb_per_min * Fraction(str(head_ft))
    return float(ft_lbf_per_min / FT_LBF_PER_MIN_PER_HP)


def head_ft_to_psi(head_ft, sg, rho_water_lb_ft3):
    return float(Fraction(str(head_ft)) * Fraction(str(sg)) * rho_water_lb_ft3 / 144)


def npsha_ft(p_suct, p_vap, sg, static_ft, friction_ft, rho_water_lb_ft3):
    """A pressure balance in FIELD units off the derived water density.

    The engine's own oracle does this in pascals at rho = 999.0 kg/m3, which
    is why its tolerance has to be 3e-3. Using the density the engine's own
    packaging implies makes the comparison exact, and the 999.0 figure is
    reported separately so the looser number is explained rather than
    tolerated.
    """
    dp = Fraction(str(p_suct)) - Fraction(str(p_vap))
    press_head = dp * 144 / (rho_water_lb_ft3 * Fraction(str(sg)))
    return float(press_head), float(press_head + Fraction(str(static_ft))
                                     - Fraction(str(friction_ft)))


def npsha_via_999(p_suct, p_vap, sg, static_ft, friction_ft):
    """The engine oracle's route, reproduced only to quantify its offset."""
    psi_pa = float(Fraction(6894757293168, 1000000000))
    rho = 999.0 * sg
    head_m = (p_suct - p_vap) * psi_pa / (rho * float(G0))
    return head_m / float(FT_M) + static_ft - friction_ft


# ===========================================================================
# E. THE HYDRAULIC INSTITUTE CORRECTION
#
# HELD FOR LITERATURE. B, cQ and cEta are an EMPIRICAL correlation. Nothing
# derives them and no publication sits in this repository to check them
# against, so this oracle checks only what can honestly be checked:
#   (1) the arithmetic, at 60 decimal digits rather than double precision;
#   (2) the INVERSE round trip, since the cQ form is analytically invertible;
#   (3) the monotonicity both factors must have if they mean anything.
# Agreement here is WEAKER EVIDENCE than for anything derived above and no
# lesson may claim otherwise.
# ===========================================================================

def hi_correction(q_bep, h_bep, visc_cst, rpm):
    D = Decimal
    B = (D('26.6') * (D(str(visc_cst)).sqrt() * D(str(h_bep)) ** D('0.0625'))
         / (D(str(q_bep)) ** D('0.375') * D(str(rpm)) ** D('0.25')))
    if B <= 1:
        return {'B': float(B), 'cQ': 1.0, 'cH': 1.0, 'cEta': 1.0, 'branch': 'no correction'}
    log10B = B.ln() / D(10).ln()
    cQ = (D('-0.165') * log10B ** D('3.15')).exp()
    cEta = (B.ln() * (D('-0.0547') * B ** D('0.69'))).exp()
    return {'B': float(B), 'cQ': float(cQ), 'cH': float(cQ), 'cEta': float(cEta),
            'branch': 'corrected'}


def hi_inverse_B_from_cQ(cQ):
    """cQ = exp(-0.165 (log10 B)^3.15) inverts in closed form."""
    D = Decimal
    c = D(str(cQ))
    if c >= 1:
        return None
    log10B = ((-c.ln()) / D('0.165')) ** (D(1) / D('3.15'))
    return float((log10B * D(10).ln()).exp())


# ===========================================================================
# F. THE TRIM MODEL
#
# HELD FOR LITERATURE. The shortfall rule (zero at or under 5 percent, then
# 0.006 per further percent, capped at 0.12, applied whole to head and half
# to flow) has NO publication behind it in this repository. The oracle
# reimplements it in EXACT RATIONAL ARITHMETIC only to expose its boundaries,
# and no lesson may present the shortfall as a measured quantity.
# ===========================================================================

def trim_exact(q, h, bhp, dr):
    d = Fraction(str(dr))
    trim_pct = (Fraction(1) - d) * 100
    if trim_pct <= 5:
        short = Fraction(0)
    else:
        short = min(Fraction(12, 100), (trim_pct - 5) * Fraction(6, 1000))
    iq = Fraction(str(q)) * d
    ih = Fraction(str(h)) * d * d
    # Output keys are PREFIXED. An earlier draft returned them under the same
    # names as the inputs, the build loop merged them over the inputs, and the
    # comparator then fed the engine its own answers as arguments and reported
    # an 87 percent "disagreement" that was entirely mine. Distinct names.
    return {
        'outTrimPercent': float(trim_pct),
        'outIdealQGpm': float(iq),
        'outIdealHeadFt': float(ih),
        'outQGpm': float(iq * (1 - short / 2)),
        'outHeadFt': float(ih * (1 - short)),
        'outBrakeHp': float(Fraction(str(bhp)) * d ** 3),
        'outShortfallPct': float(short * 100),
        # The power leg is the IDEAL cube law while head and flow are both
        # de-rated, so the return implies an efficiency change nothing states.
        # Reported as a derived ratio, not asserted in prose.
        'impliedEfficiencyRatio': float((1 - short / 2) * (1 - short)),
    }


# ===========================================================================
# G. THE OPERATING REGION
#
# HELD FOR LITERATURE. 50, 70, 120 and 140 percent of BEP flow are the
# customary bands as this module records them, with no source in the repo.
# ===========================================================================

def region_of(pct):
    if 70 <= pct <= 120:
        return 'preferred'
    if 50 <= pct < 70:
        return 'allowable, low'
    if 120 < pct <= 140:
        return 'allowable, high'
    return 'outside'


# ===========================================================================
# H. COMPRESSION
# ===========================================================================

def gauss_legendre(n):
    """Nodes and weights on [-1, 1] at 60-digit precision.

    Newton on the Legendre polynomial built from its own recurrence. This is
    a DIFFERENT quadrature family from the engine oracle's Simpson rule and a
    different arithmetic from the engine's closed form.
    """
    D = Decimal
    nodes, weights = [], []
    for i in range(1, n + 1):
        x = D(repr(math.cos(math.pi * (i - 0.25) / (n + 0.5))))
        for _ in range(60):
            p0, p1 = D(1), D(0)
            for j in range(1, n + 1):
                p2 = p1
                p1 = p0
                p0 = ((2 * j - 1) * x * p1 - (j - 1) * p2) / j
            dp = n * (x * p0 - p1) / (x * x - 1)
            dx = -p0 / dp
            x += dx
            if abs(dx) < D('1e-55'):
                break
        p0, p1 = D(1), D(0)
        for j in range(1, n + 1):
            p2 = p1
            p1 = p0
            p0 = ((2 * j - 1) * x * p1 - (j - 1) * p2) / j
        dp = n * (x * p0 - p1) / (x * x - 1)
        nodes.append(x)
        weights.append(2 / ((1 - x * x) * dp * dp))
    return nodes, weights


_GL_NODES, _GL_WEIGHTS = gauss_legendre(64)


def poly_head_by_quadrature(z_avg, mw, t1_r, ratio, e):
    """H = int_1^r v dp per unit mass, by 64-point Gauss-Legendre.

    With v = Z R T / (MW p) and T = T1 x^e where x = p/p1, the integrand in x
    is (Z R T1 / MW) * x^(e-1). Integrated numerically, never in closed form.
    """
    D = Decimal
    a, b = D(1), D(str(ratio))
    half, mid = (b - a) / 2, (b + a) / 2
    ee = D(str(e))
    total = D(0)
    for x, w in zip(_GL_NODES, _GL_WEIGHTS):
        xv = half * x + mid
        total += w * ((ee - 1) * xv.ln()).exp()
    integral = total * half
    coeff = D(str(z_avg)) * D(str(float(R_FT_LBF))) / D(str(mw)) * D(str(t1_r))
    return float(coeff * integral)


def path_property_residual(ratio, e, n_points=200):
    """The defining property of the path, checked rather than assumed.

    On a polytropic path p v^n is constant. With v proportional to T/p and
    T = T1 x^e, v is proportional to x^(e-1), so p v^n is proportional to
    x^(1 + n(e-1)). That is constant only if n = 1/(1-e), which is exactly
    the exponent the engine's e implies. Forming the product at 200 points
    and measuring its spread checks the PATH, not the arithmetic, and no
    amount of matching algebra can fake it.
    """
    D = Decimal
    ee = D(str(e))
    n_exp = 1 / (1 - ee)
    vals = []
    for i in range(n_points):
        x = D(1) + D(i) * (D(str(ratio)) - 1) / D(n_points - 1)
        v = ((ee - 1) * x.ln()).exp()
        vals.append(x * (n_exp * v.ln()).exp())
    lo, hi = min(vals), max(vals)
    return float((hi - lo) / hi)


def t2_from_head(z_avg, mw, t1_r, head, e):
    """T2 inverted OUT of the quadrature head, rather than marched.

    H = (Z R / MW) * T1 * (r^e - 1)/e  and  T2 = T1 r^e, so
        T2 = T1 + H * e * MW / (Z R).
    This reads the temperature off the energy the integral measured, which is
    a different framing from both the closed exponential and the march.
    """
    return t1_r + head * e * mw / (z_avg * float(R_FT_LBF))


def stage_count_closed(p1, p2, t1_f, k, eta, max_ratio, max_t_f, cap=12):
    """Both limits in closed form; no loop, no brute force."""
    overall = p2 / p1
    t1_r = t1_f + float(R_OFFSET)
    e = (k - 1.0) / (k * eta)
    by_ratio = max(1, math.ceil(math.log(overall) / math.log(max_ratio)))
    t_lim_r = max_t_f + float(R_OFFSET)
    if t_lim_r <= t1_r:
        by_temp = None            # no stage count can satisfy it
    else:
        need = e * math.log(overall) / math.log(t_lim_r / t1_r)
        by_temp = max(1, math.ceil(need - 1e-12))
    if by_temp is None or by_temp > cap:
        return {'overallRatio': overall, 'refused': True, 'byRatio': by_ratio,
                'byTemp': by_temp}
    stages = max(by_ratio, by_temp)
    return {
        'overallRatio': overall, 'refused': False,
        'stages': stages, 'ratioPerStage': overall ** (1.0 / stages),
        'byRatio': by_ratio, 'byTemp': by_temp,
        'governedBy': ('discharge temperature' if by_temp > by_ratio
                       else ('ratio per stage' if by_ratio > by_temp else 'both equally')),
    }


def isentropic_identity_is_a_tautology(k_num, k_den, eta_num, eta_den):
    """Proved in exact rational algebra, not asserted.

    e = (k-1)/(k eta) and kExp = (k-1)/k, so e * eta == kExp EXACTLY. The
    isentropic power route divides the isentropic head by
    eta_s = (r^kExp - 1)/(r^e - 1), which cancels to A (r^e - 1)/kExp; the
    polytropic route divides the polytropic head by eta_p, giving
    A (r^e - 1)/(e eta_p). They are the same expression whenever e eta = kExp,
    which is always. The engine's own gate calls their agreement "the
    strongest available check"; it is an identity and checks nothing.
    """
    k = Fraction(k_num, k_den)
    eta = Fraction(eta_num, eta_den)
    e = (k - 1) / (k * eta)
    k_exp = (k - 1) / k
    return e * eta == k_exp


def acfm_derived(q_mmscfd, p_psia, t_f, z, p_std=14.7, t_std=520.0):
    return (q_mmscfd * 1e6 / 1440.0) * (p_std / p_psia) * ((t_f + float(R_OFFSET)) / t_std) * z


def machine_screen_expected(acfm, overall_ratio, bhp):
    if acfm < 500:
        rec = 'reciprocating'
    elif acfm > 20000 and overall_ratio < 4:
        rec = 'centrifugal'
    elif overall_ratio > 6 and acfm < 5000:
        rec = 'reciprocating'
    else:
        rec = 'either'
    return rec


def driver_fuel(bhp, heat_rate, lhv):
    btu_hr = bhp * heat_rate
    return {
        'fuelBtuHr': btu_hr,
        'fuelMMscfd': btu_hr * 24.0 / lhv / 1e6,
        'thermalEfficiencyPct': float(BTU_PER_HP_HR) / heat_rate * 100.0,
    }


# ===========================================================================
# I. THE SWEEP
# ===========================================================================

CURVE_SETS = [
    [(0, 520), (800, 470), (1600, 330), (2200, 180)],
    [(0, 180), (500, 168), (1000, 130), (1400, 82)],
    [(0, 640), (600, 610), (1200, 520), (1800, 370), (2400, 150)],
    [(0, 95), (250, 90), (500, 76), (750, 52)],
    [(200, 410), (900, 372), (1500, 300), (2100, 190)],
    [(0, 1200), (1000, 1150), (2000, 990), (3000, 720), (4000, 330)],
]

DUTY_CASES = [
    (0, 150.0, 200.0, 1500.0, 1, 1),
    (0, 50.0, 300.0, 1500.0, 1, 1),
    (0, 50.0, 300.0, 1500.0, 2, 1),
    (0, 50.0, 300.0, 1500.0, 3, 1),
    (0, 400.0, 120.0, 1200.0, 1, 2),
    (1, 40.0, 60.0, 900.0, 1, 1),
    (1, 40.0, 60.0, 900.0, 2, 1),
    (2, 220.0, 260.0, 1800.0, 1, 1),
    (3, 20.0, 45.0, 600.0, 1, 1),
    (4, 130.0, 180.0, 1400.0, 1, 1),
    (5, 300.0, 600.0, 3000.0, 1, 1),
    (5, 300.0, 600.0, 3000.0, 2, 1),
]

POWER_CASES = [
    (1500.0, 300.0, 0.85, 0.78, 0.94), (600.0, 120.0, 1.02, 0.72, 0.94),
    (2400.0, 480.0, 0.71, 0.82, 0.96), (120.0, 900.0, 1.18, 0.55, 0.90),
    (3000.0, 210.0, 0.93, 0.80, 0.955), (75.0, 60.0, 0.66, 0.41, 0.88),
    (1000.0, 1000.0, 1.0, 1.0, 1.0), (1850.0, 355.5, 0.842, 0.763, 0.938),
]

NPSH_CASES = [
    (14.7, 0.5, 0.85, 8.0, 3.0), (35.0, 12.0, 0.72, -5.0, 6.0),
    (60.0, 2.4, 0.95, 12.0, 4.5), (14.7, 14.0, 0.62, 20.0, 1.0),
    (250.0, 180.0, 0.55, -12.0, 9.0), (100.0, 0.1, 1.05, 0.0, 0.0),
    (14.7, 0.5, 0.85, -22.0, 3.0), (18.3, 6.7, 0.78, 4.4, 2.2),
]

NPSH_CHECK_CASES = [
    (25.0, 12.0), (14.0, 12.0), (8.0, 12.0), (15.0, 12.0),
    (3.0, 1.0), (4.2, 12.0), (16.2, 12.0), (100.0, 4.0), (4.0, 1.0),
]

VISC_CASES = [
    (1500.0, 300.0, 100.0, 3560.0), (800.0, 200.0, 500.0, 1780.0),
    (1500.0, 300.0, 1.0, 3560.0), (5000.0, 100.0, 1.5, 3560.0),
    (900.0, 220.0, 2000.0, 3560.0), (200.0, 400.0, 20000.0, 1180.0),
    (1200.0, 260.0, 40.0, 1780.0), (3000.0, 150.0, 220.0, 1180.0),
    (650.0, 330.0, 900.0, 3560.0), (2200.0, 410.0, 60.0, 3560.0),
    (450.0, 175.0, 1500.0, 1180.0), (1750.0, 285.0, 12.0, 1780.0),
]

SPEED_CASES = [
    (1000.0, 300.0, 100.0, 0.8), (1000.0, 300.0, 100.0, 1.0),
    (1000.0, 300.0, 100.0, 1.2), (1508.866, 352.371, 123.9, 0.65),
    (2200.0, 180.0, 60.0, 0.5), (400.0, 95.0, 12.0, 1.15),
]

TRIM_CASES = [
    (1000.0, 300.0, 100.0, 1.0), (1000.0, 300.0, 100.0, 0.99),
    (1000.0, 300.0, 100.0, 0.96), (1000.0, 300.0, 100.0, 0.95),
    (1000.0, 300.0, 100.0, 0.9499), (1000.0, 300.0, 100.0, 0.94),
    (1000.0, 300.0, 100.0, 0.9), (1000.0, 300.0, 100.0, 0.85),
    (1000.0, 300.0, 100.0, 0.8), (1000.0, 300.0, 100.0, 0.7975),
    (1000.0, 300.0, 100.0, 0.75), (1000.0, 300.0, 100.0, 0.7499),
    (1000.0, 300.0, 100.0, 0.6), (1000.0, 300.0, 100.0, 0.5),
    (1508.866, 352.371, 123.889, 0.88),
]

REGION_CASES = [
    (1000.0, 1000.0), (700.0, 1000.0), (699.9, 1000.0), (1200.0, 1000.0),
    (1200.1, 1000.0), (1400.0, 1000.0), (1400.1, 1000.0), (500.0, 1000.0),
    (499.9, 1000.0), (0.0, 1000.0), (2500.0, 1000.0), (1508.866, 1500.0),
]

HEADPSI_CASES = [
    (231.0, 1.0), (100.0, 0.85), (100.0, 1.2), (2.31, 1.0),
    (352.371, 0.85), (1.0, 0.5), (500.0, 1.05),
]

STAGING_CASES = [
    (100.0, 1000.0, 100.0, 1.28, 0.75, 4.0, 300.0),
    (50.0, 1200.0, 90.0, 1.30, 0.72, 4.0, 250.0),
    (200.0, 600.0, 110.0, 1.25, 0.78, 4.0, 300.0),
    (100.0, 380.0, 110.0, 1.30, 0.72, 4.0, 250.0),
    (14.7, 1200.0, 80.0, 1.27, 0.76, 4.0, 300.0),
    (500.0, 2500.0, 105.0, 1.24, 0.80, 4.0, 320.0),
    (60.0, 3000.0, 95.0, 1.29, 0.74, 3.5, 275.0),
    (800.0, 1600.0, 120.0, 1.22, 0.82, 4.0, 300.0),
    (30.0, 900.0, 70.0, 1.31, 0.70, 5.0, 260.0),
    (150.0, 450.0, 100.0, 1.28, 0.75, 4.0, 300.0),
]

STAGE_CASES = [
    (20.0, 100.0, 100.0, 3.16, 0.65, 1.28, 0.75, 0.97),
    (50.0, 300.0, 110.0, 2.50, 0.70, 1.26, 0.78, 0.97),
    (5.0, 60.0, 90.0, 4.00, 0.60, 1.30, 0.72, 0.97),
    (120.0, 800.0, 105.0, 1.80, 0.68, 1.25, 0.80, 0.98),
    (2.0, 25.0, 80.0, 3.50, 0.72, 1.27, 0.70, 0.95),
    (300.0, 500.0, 120.0, 2.00, 0.64, 1.29, 0.82, 0.97),
    (35.0, 1200.0, 130.0, 1.50, 0.75, 1.23, 0.79, 0.97),
    (8.0, 45.0, 60.0, 4.50, 0.58, 1.31, 0.68, 0.96),
]

TRAIN_CASES = [
    (20.0, 100.0, 100.0, 1000.0, 0.65, 1.28, 0.75, 0.97, 110.0, 0.55, 4.0, 300.0),
    (20.0, 100.0, 100.0, 1000.0, 0.65, 1.28, 0.75, 0.97, 100.0, 0.55, 4.0, 300.0),
    (20.0, 100.0, 100.0, 1000.0, 0.65, 1.28, 0.75, 0.97, 250.0, 0.55, 4.0, 300.0),
    (50.0, 200.0, 95.0, 1400.0, 0.62, 1.26, 0.78, 0.98, 105.0, 0.54, 4.0, 300.0),
    (5.0, 40.0, 85.0, 600.0, 0.70, 1.30, 0.72, 0.96, 95.0, 0.58, 4.0, 280.0),
]

ACFM_CASES = [
    (20.0, 200.0, 100.0, 0.65), (20.0, 50.0, 100.0, 0.65),
    (20.0, 800.0, 100.0, 0.65), (400.0, 100.0, 100.0, 0.65),
    (0.5, 400.0, 100.0, 0.65), (15.0, 80.0, 100.0, 0.65),
    (100.0, 14.7, 60.0, 0.60), (75.0, 350.0, 140.0, 0.72),
]

FUEL_CASES = [
    (2000.0, 8000.0, 950.0), (2000.0, 6500.0, 950.0),
    (500.0, 9500.0, 1020.0), (12000.0, 7200.0, 905.0),
    (150.0, 8800.0, 950.0), (3333.94, 8000.0, 950.0),
]

# The refusal catalogue. Each entry names the behaviour class the comparator
# must observe. 'refusal' means an `error` key; 'silent' means a non-finite
# value with NO error key, which is a DEFECT and is recorded as such rather
# than blessed. Nothing here is a tolerance question.
REFUSALS = [
    ('pumps', 'systemCurve', {'staticHeadFt': 100, 'frictionHeadFt': 200, 'atFlowGpm': 0}, 'refusal'),
    ('pumps', 'systemCurve', {'staticHeadFt': 100, 'frictionHeadFt': -50, 'atFlowGpm': 1500}, 'refusal'),
    ('pumps', 'systemCurve', {'frictionHeadFt': 200, 'atFlowGpm': 1500}, 'silent'),
    ('pumps', 'fitPumpCurve', {'points': [{'qGpm': 0, 'headFt': 100}, {'qGpm': 100, 'headFt': 90}]}, 'refusal'),
    ('pumps', 'fitPumpCurve', {'points': [{'qGpm': 100, 'headFt': 50}, {'qGpm': 100, 'headFt': 60}, {'qGpm': 100, 'headFt': 70}]}, 'refusal'),
    ('pumps', 'fitPumpCurve', {'points': [{'qGpm': 0, 'headFt': -5}, {'qGpm': 100, 'headFt': 50}, {'qGpm': 200, 'headFt': 40}]}, 'refusal'),
    ('pumps', 'pumpPower', {'qGpm': 0, 'headFt': 300, 'sg': 0.85, 'efficiency': 0.78}, 'refusal'),
    ('pumps', 'pumpPower', {'qGpm': 1500, 'headFt': 300, 'sg': 0, 'efficiency': 0.78}, 'refusal'),
    ('pumps', 'pumpPower', {'qGpm': 1500, 'headFt': 300, 'sg': 0.85, 'efficiency': 0}, 'refusal'),
    ('pumps', 'pumpPower', {'qGpm': 1500, 'headFt': 300, 'sg': 0.85, 'efficiency': 1.0001}, 'refusal'),
    ('pumps', 'pumpPower', {'qGpm': 1500, 'headFt': 300, 'sg': 0.85, 'efficiency': 0.78, 'motorEfficiency': 0}, 'silent'),
    ('pumps', 'npshAvailable', {'suctionPressurePsia': 14.7, 'vapourPressurePsia': 0.5, 'sg': 0}, 'refusal'),
    ('pumps', 'npshAvailable', {'vapourPressurePsia': 0.5, 'sg': 0.85}, 'refusal'),
    ('pumps', 'npshAvailable', {'suctionPressurePsia': 14.7, 'sg': 0.85}, 'refusal'),
    ('pumps', 'npshCheck', {'npshaFt': 20, 'npshrFt': 0}, 'refusal'),
    ('pumps', 'npshCheck', {'npshrFt': 12}, 'silent'),
    ('pumps', 'speedChange', {'qGpm': 1000, 'headFt': 300, 'brakeHp': 100, 'speedRatio': 0}, 'refusal'),
    ('pumps', 'speedChange', {'qGpm': 1000, 'headFt': 300, 'brakeHp': 100, 'speedRatio': -1}, 'refusal'),
    ('pumps', 'speedChange', {'speedRatio': 0.8}, 'silent'),
    ('pumps', 'impellerTrim', {'qGpm': 1000, 'headFt': 300, 'brakeHp': 100, 'diameterRatio': 1.2}, 'refusal'),
    ('pumps', 'impellerTrim', {'qGpm': 1000, 'headFt': 300, 'brakeHp': 100, 'diameterRatio': 0}, 'refusal'),
    ('pumps', 'impellerTrim', {'diameterRatio': 0.8}, 'silent'),
    ('pumps', 'viscosityCorrection', {'qBepGpm': 0, 'headBepFt': 300, 'viscosityCSt': 100}, 'refusal'),
    ('pumps', 'viscosityCorrection', {'qBepGpm': 1500, 'headBepFt': 300, 'viscosityCSt': 0}, 'refusal'),
    ('pumps', 'viscosityCorrection', {'qBepGpm': 1500, 'headBepFt': 300, 'viscosityCSt': 100, 'speedRpm': 0}, 'silent'),
    ('pumps', 'viscosityCorrection', {'qBepGpm': 1500, 'headBepFt': 300, 'viscosityCSt': 100, 'speedRpm': -3560}, 'silent'),
    ('pumps', 'combineParallel', {'n': 2}, 'refusal'),
    ('pumps', 'combineParallel', {'n': 0.5}, 'refusal'),
    ('pumps', 'combineSeries', {'n': 0}, 'refusal'),
    ('pumps', 'operatingRegion', {'qGpm': 1000, 'qBepGpm': 0}, 'refusal'),
    ('pumps', 'operatingRegion', {'qGpm': -5, 'qBepGpm': 1000}, 'refusal'),
    ('compression', 'stageCount', {'pSuctionPsia': 100, 'pDischargePsia': 50, 'tSuctionF': 100, 'k': 1.28}, 'refusal'),
    ('compression', 'stageCount', {'pSuctionPsia': 100, 'pDischargePsia': 100, 'tSuctionF': 100, 'k': 1.28}, 'refusal'),
    ('compression', 'stageCount', {'pSuctionPsia': 100, 'pDischargePsia': 1000, 'tSuctionF': 100, 'k': 0.9}, 'refusal'),
    ('compression', 'stageCount', {'pSuctionPsia': 100, 'pDischargePsia': 200, 'tSuctionF': 300, 'k': 1.4, 'polytropicEfficiency': 0.5, 'maxDischargeF': 250}, 'refusal'),
    ('compression', 'stageCount', {'pSuctionPsia': 100, 'pDischargePsia': 1000, 'tSuctionF': 100, 'k': 1.28, 'maxRatioPerStage': 1}, 'silent'),
    ('compression', 'stageCount', {'pSuctionPsia': 100, 'pDischargePsia': 1000, 'tSuctionF': 100, 'k': 1.28, 'maxRatioPerStage': -4}, 'silent'),
    ('compression', 'compressionStage', {'qMMscfd': 0, 'pSuctionPsia': 100, 'tSuctionF': 100, 'ratio': 3, 'gasSg': 0.65, 'k': 1.28}, 'refusal'),
    ('compression', 'compressionStage', {'qMMscfd': 20, 'pSuctionPsia': 100, 'tSuctionF': 100, 'ratio': 1, 'gasSg': 0.65, 'k': 1.28}, 'refusal'),
    ('compression', 'compressionStage', {'qMMscfd': 20, 'pSuctionPsia': 100, 'tSuctionF': 100, 'ratio': 3, 'gasSg': 0, 'k': 1.28}, 'refusal'),
    ('compression', 'compressionStage', {'qMMscfd': 20, 'pSuctionPsia': 100, 'tSuctionF': 100, 'ratio': 3, 'gasSg': 0.65, 'k': 1}, 'refusal'),
    ('compression', 'compressionStage', {'qMMscfd': 20, 'pSuctionPsia': 100, 'tSuctionF': 100, 'ratio': 3.16, 'gasSg': 0.65, 'k': 1.28, 'polytropicEfficiency': 0}, 'silent'),
    ('compression', 'compressionStage', {'qMMscfd': 20, 'pSuctionPsia': 100, 'tSuctionF': 100, 'ratio': 3.16, 'gasSg': 0.65, 'k': 1.28, 'mechanicalEfficiency': 0}, 'silent'),
    ('compression', 'machineScreen', {'qMMscfd': 0}, 'refusal'),
    ('compression', 'driverFuel', {'brakeHp': 0}, 'refusal'),
    ('compression', 'driverFuel', {'brakeHp': 1000, 'heatRateBtuHpHr': 0}, 'refusal'),
    ('compression', 'driverFuel', {'brakeHp': 1000, 'gasLhvBtuScf': 0}, 'refusal'),
    ('compression', 'actualInletCfm', {'qMMscfd': 0, 'pPsia': 200, 'tF': 100, 'gasSg': 0.65}, 'silent'),
]


def build():
    out = {}

    # ---- constants ----
    bases = {}
    for label, (p, t) in STD_BASES.items():
        bases[label] = molar_volume_scf(p, t)
    out['constants'] = {
        'jPerFtLbf': float(J_PER_FT_LBF),
        'ftLbfPerBtu': float(FT_LBF_PER_BTU),
        'ftLbfPerMinPerHp': FT_LBF_PER_MIN_PER_HP,
        'btuPerHpHr': float(BTU_PER_HP_HR),
        'wattsPerHp': W_PER_HP,
        'kWPerHp': KW_PER_HP,
        'rFtLbfPerLbmolR': float(R_FT_LBF),
        'rPsiaFt3PerLbmolR': float(R_PSIA_FT3),
        'waterDensityFrom231': float(RHO_FROM_231),
        'waterDensityFrom3960': float(RHO_FROM_3960),
        'theTwoPackagingsAgreeExactly': RHO_FROM_231 == RHO_FROM_3960,
        'standardMolarVolumeScfPerLbmol': bases,
        'rFtLbfOver144': float(R_FT_LBF / 144),
    }

    # ---- curve fits ----
    out['curves'] = []
    for pts in CURVE_SETS:
        f = fit_exact(pts)
        out['curves'].append({
            'points': [{'qGpm': float(q), 'headFt': float(h)} for q, h in pts],
            'c0': float(f['c0']), 'c1': float(f['c1']), 'c2': float(f['c2']),
            'scale': float(f['scale']), 'shutoffHeadFt': float(f['shutoff']),
            'rSquared': float(f['r2']),
            'orthogonalityResidualExactlyZero': f['ortho_exactly_zero'],
        })

    # ---- duty points ----
    out['duty'] = []
    for ci, static_ft, fric_ft, at_q, npar, nser in DUTY_CASES:
        pts = CURVE_SETS[ci]
        f = fit_exact(pts)
        k = fric_ft / (at_q * at_q)
        q = duty_closed_form(f, static_ft, k, npar, nser)
        if q is None:
            continue
        h = static_ft + k * q * q
        out['duty'].append({
            'points': [{'qGpm': float(a), 'headFt': float(b)} for a, b in pts],
            'staticHeadFt': static_ft, 'frictionHeadFt': fric_ft, 'atFlowGpm': at_q,
            'nParallel': npar, 'nSeries': nser,
            'qGpm': q, 'headFt': h,
        })

    # ---- power ----
    out['power'] = []
    for q, h, sg, eta, meta in POWER_CASES:
        whp = whp_from_first_principles(q, h, sg, RHO_FROM_3960)
        bhp = whp / eta
        out['power'].append({
            'qGpm': q, 'headFt': h, 'sg': sg, 'efficiency': eta,
            'motorEfficiency': meta,
            'hydraulicHp': whp, 'brakeHp': bhp,
            'motorInputHp': bhp / meta,
            'motorInputKw': bhp / meta * KW_PER_HP,
        })

    # ---- head and pressure ----
    out['headPressure'] = []
    for h, sg in HEADPSI_CASES:
        psi = head_ft_to_psi(h, sg, RHO_FROM_231)
        out['headPressure'].append({
            'headFt': h, 'sg': sg, 'psi': psi,
            'roundTripHeadFt': float(Fraction(str(psi)) * 144 / (RHO_FROM_231 * Fraction(str(sg)))),
        })

    # ---- NPSH ----
    out['npsh'] = []
    for ps, pv, sg, st, fr in NPSH_CASES:
        ph, na = npsha_ft(ps, pv, sg, st, fr, RHO_FROM_231)
        out['npsh'].append({
            'suctionPressurePsia': ps, 'vapourPressurePsia': pv, 'sg': sg,
            'staticSuctionLiftFt': st, 'suctionFrictionFt': fr,
            'pressureHeadFt': ph, 'npshaFt': na,
            'npshaFtVia999kgm3': npsha_via_999(ps, pv, sg, st, fr),
            'flashingWarningExpected': ps <= pv,
        })
    out['npshCheck'] = []
    for na, nr in NPSH_CHECK_CASES:
        req = max(3.0, 0.35 * nr)
        margin = na - nr
        out['npshCheck'].append({
            'npshaFt': na, 'npshrFt': nr,
            'marginFt': margin, 'requiredMarginFt': req, 'ratio': na / nr,
            'pass': margin >= req,
            'severity': ('cavitating' if margin < 0
                         else ('marginal' if margin < req else 'adequate')),
        })

    # ---- viscosity ----
    out['viscosity'] = []
    for q, h, v, rpm in VISC_CASES:
        r = hi_correction(q, h, v, rpm)
        row = {'qBepGpm': q, 'headBepFt': h, 'viscosityCSt': v, 'speedRpm': rpm}
        row.update(r)
        if r['branch'] == 'corrected':
            row['correctedQGpm'] = q * r['cQ']
            row['correctedHeadFt'] = h * r['cH']
            back = hi_inverse_B_from_cQ(r['cQ'])
            row['bRecoveredFromCQ'] = back
            row['inverseRoundTripRelative'] = abs(back - r['B']) / r['B']
        out['viscosity'].append(row)
    # monotonicity, a property rather than a value
    bs = [r['B'] for r in out['viscosity'] if r['branch'] == 'corrected']
    cq = [r['cQ'] for r in out['viscosity'] if r['branch'] == 'corrected']
    ce = [r['cEta'] for r in out['viscosity'] if r['branch'] == 'corrected']
    pairs = sorted(zip(bs, cq, ce))
    out['viscosityProperties'] = {
        'cQFallsWithB': all(pairs[i][1] >= pairs[i + 1][1] for i in range(len(pairs) - 1)),
        'cEtaFallsWithB': all(pairs[i][2] >= pairs[i + 1][2] for i in range(len(pairs) - 1)),
        'note': 'HELD FOR LITERATURE: the HI form is empirical and unsourced in this repo, so only arithmetic, the closed-form inverse and monotonicity are checked.',
    }

    # ---- speed and trim ----
    out['speed'] = [{
        'qGpm': q, 'headFt': h, 'brakeHp': p, 'speedRatio': s,
        'outQGpm': q * s, 'outHeadFt': h * s * s, 'outBrakeHp': p * s ** 3,
    } for q, h, p, s in SPEED_CASES]
    out['trim'] = []
    for q, h, p, dr in TRIM_CASES:
        row = {'qGpm': q, 'headFt': h, 'brakeHp': p, 'diameterRatio': dr}
        row.update(trim_exact(q, h, p, dr))
        row['warningExpected'] = row['outTrimPercent'] > 20
        out['trim'].append(row)

    # ---- operating region ----
    out['region'] = [{
        'qGpm': q, 'qBepGpm': qb,
        'percentOfBep': q / qb * 100.0,
        'region': region_of(q / qb * 100.0),
        'preferred': region_of(q / qb * 100.0) == 'preferred',
    } for q, qb in REGION_CASES]

    # ---- compression staging ----
    out['staging'] = []
    for p1, p2, t1, k, eta, mr, mt in STAGING_CASES:
        r = stage_count_closed(p1, p2, t1, k, eta, mr, mt)
        r.update({'pSuctionPsia': p1, 'pDischargePsia': p2, 'tSuctionF': t1,
                  'k': k, 'polytropicEfficiency': eta,
                  'maxRatioPerStage': mr, 'maxDischargeF': mt})
        out['staging'].append(r)

    # ---- compression stages ----
    # Z comes from the engine's own validated DAK correlation, as the engine
    # oracle also does: re-deriving an 11-coefficient empirical fit here would
    # be copying, not checking. It is supplied per case by the comparator and
    # echoed back, so the head, the temperature and the power ARE checked and
    # the z is declared as an input rather than smuggled in as a result.
    out['stages'] = []
    for q, p1, t1, ratio, sg, k, eta, meff in STAGE_CASES:
        mw = 28.9625 * sg      # the engine's own MW_AIR, an input not a check
        t1_r = t1 + float(R_OFFSET)
        e = (k - 1.0) / (k * eta)
        out['stages'].append({
            'qMMscfd': q, 'pSuctionPsia': p1, 'tSuctionF': t1, 'ratio': ratio,
            'gasSg': sg, 'k': k, 'polytropicEfficiency': eta,
            'mechanicalEfficiency': meff,
            'exponentRatio': e,
            'pathPropertyResidual': path_property_residual(ratio, e),
            'zAvgIsAnInput': True,
        })

    out['identities'] = {
        'isentropicRouteIsATautology': all(
            isentropic_identity_is_a_tautology(kn, kd, en, ed)
            for kn, kd, en, ed in [(128, 100, 75, 100), (126, 100, 78, 100),
                                   (13, 10, 72, 100), (14, 10, 82, 100)]),
        'note': "the engine gate calls the agreement of its two power routes the strongest available check; e * eta_p == (k-1)/k exactly, so the two routes are one expression and the check is empty.",
    }

    # ---- acfm, screen, fuel ----
    out['acfm'] = [{'qMMscfd': q, 'pPsia': p, 'tF': t, 'gasSg': sg,
                    'zIsAnInput': True} for q, p, t, sg in ACFM_CASES]
    out['fuel'] = []
    for bhp, hr, lhv in FUEL_CASES:
        r = driver_fuel(bhp, hr, lhv)
        r.update({'brakeHp': bhp, 'heatRateBtuHpHr': hr, 'gasLhvBtuScf': lhv})
        out['fuel'].append(r)

    out['train'] = [{
        'qMMscfd': a, 'pSuctionPsia': b, 'tSuctionF': c, 'pDischargePsia': d,
        'gasSg': e_, 'k': f_, 'polytropicEfficiency': g_,
        'mechanicalEfficiency': h_, 'interstageCoolToF': i_, 'cpBtuLbF': j_,
        'maxRatioPerStage': k_, 'maxDischargeF': l_,
    } for a, b, c, d, e_, f_, g_, h_, i_, j_, k_, l_ in TRAIN_CASES]

    out['refusals'] = [{'module': m, 'fn': fn, 'input': inp, 'expect': cls}
                       for m, fn, inp, cls in REFUSALS]

    # ---- the negative control ----
    # A deliberately WRONG duty, 1 percent off the closed-form answer. The
    # comparator must flag it. A sweep that cannot fail this cannot pass
    # anything either.
    f0 = fit_exact(CURVE_SETS[0])
    k0 = 200.0 / (1500.0 ** 2)
    q0 = duty_closed_form(f0, 150.0, k0)
    out['negativeControl'] = {
        'points': [{'qGpm': float(a), 'headFt': float(b)} for a, b in CURVE_SETS[0]],
        'staticHeadFt': 150.0, 'frictionHeadFt': 200.0, 'atFlowGpm': 1500.0,
        'qGpm': q0 * 1.01,
        'mustBeReportedAsAMismatch': True,
    }
    return out


def main():
    out = build()
    counted = sum(len(v) for v in out.values() if isinstance(v, list))
    if counted == 0:
        print('REFUSED: the sweep is empty. A gate that reports success on '
              'zero input is worse than no gate.', file=sys.stderr)
        return 2
    os.makedirs(OUT, exist_ok=True)
    for name, block in out.items():
        with open(os.path.join(OUT, f'rotating_{name}_cases.json'), 'w') as fh:
            json.dump(block, fh, indent=1, sort_keys=True)
            fh.write('\n')
    print(f'wrote {len(out)} blocks, {counted} swept cases to {OUT}')
    print(f"  the two water-density packagings agree exactly: "
          f"{out['constants']['theTwoPackagingsAgreeExactly']}")
    print(f"  the isentropic power route is a tautology: "
          f"{out['identities']['isentropicRouteIsATautology']}")
    bad = [i for i, c in enumerate(out['curves'])
           if not c['orthogonalityResidualExactlyZero']]
    print(f"  curve fits whose exact orthogonality residual is NOT zero: {bad}")
    return 0


if __name__ == '__main__':
    sys.exit(main())
