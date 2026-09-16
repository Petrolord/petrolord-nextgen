#!/usr/bin/env python3
"""FC2 independent oracle for the facilities line-hydraulics engine.

Python standard library only. This file imports NOTHING from the engine and
transcribes none of its code. It is a THIRD route, deliberately different
from both the engine and the engine's own oracle:

  engine (lineHydraulics.js)     field-unit published constants; Colebrook by
                                 FIXED-POINT iteration on 1/sqrt(f); the
                                 outlet pressure by BISECTION on p2.
  engine oracle (oracle_line-    SI Menon constants; Colebrook by BISECTION
  hydraulics.py)                 on f.
  THIS FILE                      Colebrook by its EXACT LAMBERT-W CLOSED FORM
                                 (no iteration on the Colebrook equation at
                                 all); the General Flow constant DERIVED from
                                 first principles rather than quoted; the
                                 three empirical constants checked by
                                 DIMENSIONAL CONVERSION against their SI
                                 twins; the outlet pressure solved in CLOSED
                                 FORM where the equation admits one.

A closed form and an iteration agreeing is evidence about the equation. Two
iterations agreeing can be two transcriptions of one mistake.

Usage:
    python3 oracle_linesizing.py --emit <dir>     write the golden files
    python3 oracle_linesizing.py --compare        sweep oracle against engine
                                                  (needs node and the engine)
"""

import json
import math
import os
import subprocess
import sys
import tempfile

# ----------------------------------------------------------------- units
# Exact by definition unless noted.
FT = 0.3048
IN = 0.0254
MILE = 1609.344
PSI = 6894.757293168          # lbf/in2 in Pa (exact from lbf and in)
LBM = 0.45359237              # kg, exact
LBFT3 = LBM / FT ** 3         # lbm/ft3 in kg/m3
CP = 1e-3                     # Pa.s
GAL = 231 * IN ** 3           # US gallon, exact: 231 in3
BBL = 42 * GAL                # oil barrel, exact
DAY = 86400.0
R_UNIVERSAL = 8.314462618     # J/(mol.K)
M_AIR = 28.9647e-3            # kg/mol, dry air
G_STANDARD = 9.80665          # m/s2

# The published base of the field-unit gas forms.
TB_R = 520.0
PB_PSIA = 14.65
TB_K = TB_R / 1.8
PB_PA = PB_PSIA * PSI


# ------------------------------------------------------------- Lambert W
def lambert_w_of_exp(z, tol=1e-15, max_iter=200):
    """W(e^z): solve t + ln t = z for t > 0, by Newton on the log scale.

    Working with z = ln(argument) rather than the argument keeps the huge
    exponentials of the Colebrook transform representable. Newton on
    g(t) = t + ln t - z has g'(t) = 1 + 1/t, which is positive everywhere on
    t > 0, so the iteration is monotone from either side of the root.
    """
    if z > 1.0:
        t = z - math.log(z)          # asymptotic start
    else:
        t = math.exp(z)              # small-z start
    t = max(t, 1e-300)
    for _ in range(max_iter):
        g = t + math.log(t) - z
        dg = 1.0 + 1.0 / t
        step = g / dg
        nxt = t - step
        if nxt <= 0:
            nxt = t / 2.0
        if abs(nxt - t) <= tol * max(1.0, abs(nxt)):
            return nxt
        t = nxt
    return t


def darcy_f(re, rel_rough):
    """Darcy friction factor. Laminar below Re 2100; above it, the EXACT
    solution of Colebrook-White, not an iteration of it.

    Colebrook:  x = -2 log10(a + b x),  x = 1/sqrt(f), a = eps/(3.7 D),
    b = 2.51/Re. Substituting u = a + b x gives u - a = -c ln u with
    c = 2 b / ln 10, and hence u = c W(exp(a/c)/c). Solving for the Lambert W
    on the log scale, u = c * W(e^Z) with Z = a/c - ln c.
    """
    if not (re > 0):
        return float('nan')
    if re < 2100.0:
        return 64.0 / re
    a = rel_rough / 3.7
    b = 2.51 / re
    c = 2.0 * b / math.log(10.0)
    z = a / c - math.log(c)
    u = c * lambert_w_of_exp(z)
    x = (u - a) / b
    return 1.0 / (x * x)


# ------------------------------------------------------------ liquid line
def liquid_line(q_bpd, id_in, length_ft, elev_ft, rho_lbft3, mu_cp,
                rough_in, sum_k):
    """Darcy-Weisbach in SI, assembled from the MASS FLUX rather than from
    the velocity, so the Reynolds number and the velocity head come from
    different groupings of the same inputs.

    The elevation term follows the engine's field convention rho*h/144 psi,
    which is g == gc exactly. That is standard field practice and NOT the
    9.80665 m/s2 hydrostatic head; the two differ by 9.80665/9.80665 = 1 in
    SI only because lbf is DEFINED by standard gravity, so the conventions
    coincide here and the check is real rather than circular.
    """
    d = id_in * IN
    area = math.pi * d * d / 4.0
    rho = rho_lbft3 * LBFT3
    mu = mu_cp * CP
    q = q_bpd * BBL / DAY                     # m3/s
    mdot = rho * q                            # kg/s
    flux = mdot / area                        # kg/(m2 s), = rho v
    v = flux / rho
    re = flux * d / mu                        # G D / mu
    f = darcy_f(re, rough_in / id_in)
    vel_head = flux * flux / (2.0 * rho)      # Pa, = rho v^2 / 2
    dp_fric = f * (length_ft * FT / d) * vel_head
    dp_fit = sum_k * vel_head
    dp_elev = rho * G_STANDARD * (elev_ft * FT)
    return {
        "qBpd": q_bpd, "idIn": id_in, "lengthFt": length_ft,
        "elevChangeFt": elev_ft, "rhoLbFt3": rho_lbft3, "muCp": mu_cp,
        "roughnessIn": rough_in, "sumK": sum_k,
        "vFtS": v / FT,
        "re": re,
        "f": f,
        "regime": "laminar" if re < 2100 else ("transitional" if re < 4000 else "turbulent"),
        "dpFrictionPsi": dp_fric / PSI,
        "dpFittingsPsi": dp_fit / PSI,
        "dpElevationPsi": dp_elev / PSI,
        "dpTotalPsi": (dp_fric + dp_fit + dp_elev) / PSI,
    }


def liquid_traverse(p1_psia, q_bpd, id_in, rho_lbft3, mu_cp, rough_in, profile):
    """March the profile. Each segment is a fresh liquid_line with no
    fittings, which is the engine's own contract for a traverse."""
    stations = [{"distanceFt": 0.0, "elevFt": 0.0, "pPsia": p1_psia}]
    p, x, z = p1_psia, 0.0, 0.0
    for seg in profile:
        r = liquid_line(q_bpd, id_in, seg["lengthFt"], seg.get("elevChangeFt", 0.0),
                        rho_lbft3, mu_cp, rough_in, 0.0)
        p -= r["dpTotalPsi"]
        x += seg["lengthFt"]
        z += seg.get("elevChangeFt", 0.0)
        stations.append({"distanceFt": x, "elevFt": z, "pPsia": p})
    return {"stations": stations, "p2Psia": p, "dpTotalPsi": p1_psia - p}


# -------------------------------------------------------------- gas lines
def elevation_terms(sg, dz_ft, t_r, z_avg):
    """The elevation group, derived rather than quoted.

    A static gas column of pseudo-specific-gravity G at average T and Z has
    p(h) = p0 exp(G M_air g h / (Z R T)). The exponent's field-unit
    coefficient is therefore M_air * g / R, converted to psia/degR/ft, and
    that number is the published 0.0375 to the precision the constant is
    quoted at. This function computes it from first principles and returns
    BOTH so the difference is visible instead of assumed.
    """
    dz_m = dz_ft * FT
    t_k = t_r / 1.8
    # exponent = M g h / (Z R T), dimensionless, doubled for the p^2 form
    s_si = 2.0 * M_AIR * sg * G_STANDARD * dz_m / (z_avg * R_UNIVERSAL * t_k)
    coeff_field = s_si / (sg * dz_ft / (t_r * z_avg)) if dz_ft != 0 else float('nan')
    if abs(s_si) < 1e-12:
        return {"s": 0.0, "es": 1.0, "leFactor": 1.0, "coefficient": coeff_field}
    es = math.exp(s_si)
    return {"s": s_si, "es": es, "leFactor": (es - 1.0) / s_si,
            "coefficient": coeff_field}


def general_flow_constant():
    """DERIVE the General Flow leading constant from physics.

    Steady isothermal compressible flow in a horizontal pipe, with the mass
    flux G constant and rho = p M / (Z R T):

        -dp/dx = f rho v^2 / (2 D) = f G^2 / (2 D rho)
        -p dp  = f G^2 Z R T / (2 D M) dx
        p1^2 - p2^2 = f L G^2 Z R T / (D M)
        G = sqrt( M D (p1^2 - p2^2) / (f L Z R T) )

    mdot = G pi D^2 / 4, and the base-condition volume is mdot / rho_b with
    rho_b = p_b M / (R T_b). Collecting, in field units with p psia, D inch,
    L mile, T degR, Q scfd:

        Q = K (T_b/p_b) sqrt( (p1^2 - p2^2) / (G_sg T L Z f) ) D^2.5

    and this function returns K. The engine states 77.54.
    """
    # Evaluate the full SI expression on a unit case and divide out the
    # field-unit grouping, which isolates K exactly.
    sg, d_in, l_mi, t_r, z, f = 0.65, 12.0, 50.0, 530.0, 0.88, 0.0112
    p1, p2 = 900.0, 500.0
    m = M_AIR * sg
    d = d_in * IN
    length = l_mi * MILE
    t_k = t_r / 1.8
    dp2 = (p1 * PSI) ** 2 - (p2 * PSI) ** 2
    flux = math.sqrt(m * d * dp2 / (f * length * z * R_UNIVERSAL * t_k))
    mdot = flux * math.pi * d * d / 4.0
    rho_b = PB_PA * m / (R_UNIVERSAL * TB_K)
    q_si = mdot / rho_b                       # m3/s at base conditions
    q_scfd = q_si * DAY / (FT ** 3)
    group = ((TB_R / PB_PSIA)
             * math.sqrt((p1 * p1 - p2 * p2) / (sg * t_r * l_mi * z * f))
             * d_in ** 2.5)
    return q_scfd / group


GENERAL_K = general_flow_constant()

# WEYMOUTH IS DERIVABLE, AND THIS FILE DERIVES IT. Weymouth is the General
# Flow equation closed with its own fully-rough friction assumption,
# f = 0.032 / d^(1/3) (d in inches). Substituting into the derived General
# Flow form gives
#     Q = (K_gen / sqrt(0.032)) (Tb/Pb) sqrt(driving/(G T L Z)) d^(2.5 + 1/6)
# and 2.5 + 1/6 is exactly 8/3, the published Weymouth diameter exponent.
# So both the Weymouth constant AND its exponent fall out of first
# principles plus one stated friction assumption, with nothing quoted.
WEYMOUTH_F_COEFF = 0.032


def weymouth_constant_derived():
    return GENERAL_K / math.sqrt(WEYMOUTH_F_COEFF)


def weymouth_exponent_derived():
    return 2.5 + 1.0 / 6.0


# Panhandle A and B are PURELY EMPIRICAL: their leading constants and
# exponents come from fitting field data and no derivation exists. The only
# independent check available is their published SI twin, evaluated
# numerically on the same physical line. That is the same route the engine's
# own oracle takes, so agreement here is WEAKER evidence than for Weymouth
# and General Flow, and FINDINGS says so.
SI_CONSTANTS = {
    "weymouth": 3.7435e-3,
    "panhandleA": 4.5965e-3,
    "panhandleB": 1.002e-2,
    "general": 1.1494e-3,
}


def si_gas_q(form, p1, p2, d_in, l_mi, sg, t_r, z, eff=1.0, dz_ft=0.0):
    """The published SI forms, evaluated on the same physical line, then
    converted to scfd. Q comes out in m3/day at (TB_K, PB kPa); the base
    conditions are identical to the field form's, so the last step is a pure
    volume conversion and carries no pressure or temperature scaling."""
    p1k = p1 * PSI / 1000.0
    p2k = p2 * PSI / 1000.0
    d_mm = d_in * 25.4
    l_km = l_mi * MILE / 1000.0
    t_k = t_r / 1.8
    tb_over_pb = TB_K / (PB_PA / 1000.0)
    ea = elevation_terms(sg, dz_ft, t_r, z)
    driving = p1k * p1k - ea["es"] * p2k * p2k
    if driving <= 0:
        return None
    le = l_km * ea["leFactor"]
    c = SI_CONSTANTS[form]
    if form == "weymouth":
        q = c * eff * tb_over_pb * math.sqrt(driving / (sg * t_k * le * z)) * d_mm ** 2.667
    elif form == "panhandleA":
        q = (c * eff * tb_over_pb ** 1.0788
             * (driving / (sg ** 0.8539 * t_k * le * z)) ** 0.5394 * d_mm ** 2.6182)
    elif form == "panhandleB":
        q = (c * eff * tb_over_pb ** 1.02
             * (driving / (sg ** 0.961 * t_k * le * z)) ** 0.51 * d_mm ** 2.53)
    else:
        return None
    return q / (FT ** 3)          # m3/day -> ft3/day at the same base


def gas_q(form, p1, p2, d_in, l_mi, sg, t_r, z, eff=1.0, dz_ft=0.0,
          mu_cp=0.011, rough_in=0.0007):
    """The four forms, in field units, each from its own published statement.
    `general` uses the DERIVED constant, not a quoted one."""
    ea = elevation_terms(sg, dz_ft, t_r, z)
    driving = p1 * p1 - ea["es"] * p2 * p2
    if driving <= 0:
        return None
    le = l_mi * ea["leFactor"]
    if form == "weymouth":
        q = 433.5 * eff * (TB_R / PB_PSIA) * math.sqrt(
            driving / (sg * t_r * le * z)) * d_in ** (8.0 / 3.0)
    elif form == "panhandleA":
        q = 435.87 * eff * (TB_R / PB_PSIA) ** 1.0788 * (
            driving / (sg ** 0.8539 * t_r * le * z)) ** 0.5394 * d_in ** 2.6182
    elif form == "panhandleB":
        q = 737.0 * eff * (TB_R / PB_PSIA) ** 1.02 * (
            driving / (sg ** 0.961 * t_r * le * z)) ** 0.51 * d_in ** 2.53
    elif form == "general":
        # Iterate only the FRICTION FACTOR (the rate depends on f and f on
        # the rate); the Colebrook solve inside is closed form.
        f = 0.015
        q = 0.0
        for _ in range(200):
            q = GENERAL_K * eff * (TB_R / PB_PSIA) * math.sqrt(
                driving / (sg * t_r * le * z * f)) * d_in ** 2.5
            # Reynolds from first principles: Re = 4 mdot / (pi D mu)
            rho_b = PB_PA * (M_AIR * sg) / (R_UNIVERSAL * TB_K)
            mdot = rho_b * (q * FT ** 3 / DAY)
            re = 4.0 * mdot / (math.pi * (d_in * IN) * (mu_cp * CP))
            nxt = darcy_f(re, rough_in / d_in)
            if abs(nxt - f) < 1e-15:
                f = nxt
                break
            f = nxt
        return {"qScfd": q, "fDarcy": f}
    else:
        raise ValueError(form)
    return {"qScfd": q}


def gas_outlet_closed_form(form, q_target, p1, d_in, l_mi, sg, t_r, z,
                           eff=1.0, dz_ft=0.0):
    """Invert the three CLOSED-FORM gas equations for p2 exactly.

    Each is q = A * driving^b, so driving = (q/A)^(1/b) and
    p2 = sqrt((p1^2 - driving) / es). No bracket, no bisection, and in
    particular NO assumption that p2 lies below p1: on a descending line es
    is less than one and the true outlet pressure can exceed the inlet.
    """
    ea = elevation_terms(sg, dz_ft, t_r, z)
    le = l_mi * ea["leFactor"]
    if form == "weymouth":
        a = 433.5 * eff * (TB_R / PB_PSIA) * d_in ** (8.0 / 3.0) / math.sqrt(
            sg * t_r * le * z)
        b = 0.5
    elif form == "panhandleA":
        a = (435.87 * eff * (TB_R / PB_PSIA) ** 1.0788 * d_in ** 2.6182
             / (sg ** 0.8539 * t_r * le * z) ** 0.5394)
        b = 0.5394
    elif form == "panhandleB":
        a = (737.0 * eff * (TB_R / PB_PSIA) ** 1.02 * d_in ** 2.53
             / (sg ** 0.961 * t_r * le * z) ** 0.51)
        b = 0.51
    else:
        return None
    driving = (q_target / a) ** (1.0 / b)
    inner = (p1 * p1 - driving) / ea["es"]
    if inner < 0:
        return None
    return {"p2Psia": math.sqrt(inner), "dpPsi": p1 - math.sqrt(inner)}


# -------------------------------------------------------- wall and pigging
DESIGN_FACTORS = {"B31.4": {None: 0.72}, "B31.8": {1: 0.72, 2: 0.60, 3: 0.50, 4: 0.40}}


def required_wall(design_psig, od_in, smys_psi, code="B31.4", loc=1,
                  joint=1.0, temp=1.0, ca_in=0.0):
    """Barlow in SI, then back to inches."""
    f = 0.72 if code == "B31.4" else DESIGN_FACTORS["B31.8"][loc]
    t_m = (design_psig * PSI) * (od_in * IN) / (2.0 * (smys_psi * PSI) * f * joint * temp)
    return {"designFactor": f, "tPressureIn": t_m / IN,
            "tRequiredIn": t_m / IN + ca_in}


def maop(wall_in, od_in, smys_psi, code="B31.4", loc=1, joint=1.0, temp=1.0,
         ca_in=0.0):
    net = wall_in - ca_in
    if net <= 0:
        return None
    f = 0.72 if code == "B31.4" else DESIGN_FACTORS["B31.8"][loc]
    p_pa = 2.0 * (smys_psi * PSI) * f * joint * temp * (net * IN) / (od_in * IN)
    return {"maopPsig": p_pa / PSI, "designFactor": f}


def line_volume_bbl(id_in, length_ft):
    d = id_in * IN
    return (math.pi * d * d / 4.0) * (length_ft * FT) / BBL


def pigging(id_in, length_ft, holdup, speed_ft_s):
    vol = line_volume_bbl(id_in, length_ft)
    return {"idIn": id_in, "lengthFt": length_ft, "holdupFrac": holdup,
            "lineVolumeBbl": vol, "sweptBbl": vol * holdup,
            "pigSpeedFtS": speed_ft_s,
            "runHours": (length_ft * FT) / (speed_ft_s * FT) / 3600.0}


def pigging_interval(max_slug_bbl, dropout_bpd, swept_bbl):
    room = max_slug_bbl - swept_bbl
    if room <= 0:
        return None
    return {"intervalDays": room / dropout_bpd}


# ------------------------------------------------------------- erosional
def erosional(rho_lbft3, c_factor, id_in):
    """API RP 14E, Ve = C / sqrt(rho).

    C is not dimensionless: for Ve in ft/s and rho in lb/ft3 it carries
    lb^0.5 ft^-0.5 s^-1. Computed here in SI and converted back, which is the
    check that the engine is not quietly mixing a metric C into a field
    velocity.
    """
    rho = rho_lbft3 * LBFT3
    # C in SI: C_si = C_field * sqrt(LBFT3) * FT  ->  Ve_si = C_si/sqrt(rho)
    c_si = c_factor * math.sqrt(LBFT3) * FT
    ve_si = c_si / math.sqrt(rho)
    d = id_in * IN
    area = math.pi * d * d / 4.0
    q_si = ve_si * area                      # m3/s
    return {"rhoLbFt3": rho_lbft3, "cFactor": c_factor, "idIn": id_in,
            "erosionalFtS": ve_si / FT,
            "areaFt2": area / FT ** 2,
            "maxRateBpd": q_si * DAY / BBL}


# ------------------------------------------------------------ golden sets
FRICTION_CASES = [
    # the published six, re-derived by the closed form
    (1500.0, 0.0), (5.0e3, 1.0e-4), (5.0e4, 3.0e-4),
    (1.0e6, 1.0e-3), (1.0e7, 5.0e-5), (3000.0, 2.0e-3),
    # FC2 additions: the branch boundary, both sides, and the smooth and
    # fully rough asymptotes the two branches run to
    (2099.0, 0.0), (2100.0, 0.0), (2100.0, 1.0e-3), (4000.0, 1.0e-3),
    (1.0e8, 1.0e-3), (1.0e5, 0.0), (1.0e5, 0.05),
]

LIQUID_CASES = [
    # the published four
    (5000, 6.065, 15000, 0, 53.0, 3.0, 0.0018, 0.0),
    (20000, 10.02, 52800, 250, 56.0, 8.0, 0.0018, 4.5),
    (800, 2.067, 3000, -60, 62.4, 1.0, 0.0018, 2.0),
    (150, 2.067, 5000, 0, 58.0, 400.0, 0.0018, 0.0),
    # FC2 additions: the teaching line at three bores, a fittings-dominated
    # short line, and a line whose elevation gain exceeds its friction
    (12000, 7.981, 26400, 0, 54.5, 2.5, 0.0018, 0.0),
    (12000, 10.02, 26400, 0, 54.5, 2.5, 0.0018, 0.0),
    (12000, 11.938, 26400, 0, 54.5, 2.5, 0.0018, 0.0),
    (12000, 7.981, 300, 0, 54.5, 2.5, 0.0018, 14.45),
    (12000, 7.981, 26400, 420, 54.5, 2.5, 0.0018, 0.0),
    (12000, 7.981, 26400, -420, 54.5, 2.5, 0.0018, 0.0),
    (12000, 7.981, 26400, 0, 54.5, 2.5, 0.006, 0.0),
]

GAS_CASES = [
    (900, 500, 12.0, 50.0, 0.65, 530.0, 0.88, 1.0, 0.0),
    (1200, 900, 6.065, 10.0, 0.70, 545.0, 0.85, 0.95, 0.0),
    (700, 650, 16.0, 80.0, 0.60, 520.0, 0.90, 0.92, 0.0),
    (1000, 600, 8.0, 25.0, 0.65, 540.0, 0.87, 1.0, 800.0),
    (1000, 600, 8.0, 25.0, 0.65, 540.0, 0.87, 1.0, -800.0),
    # FC2 additions: the teaching trunk flat, up and down, and a near-dead line
    (850, 620, 11.938, 32.0, 0.67, 535.0, 0.885, 1.0, 0.0),
    (850, 620, 11.938, 32.0, 0.67, 535.0, 0.885, 1.0, 1500.0),
    (850, 620, 11.938, 32.0, 0.67, 535.0, 0.885, 1.0, -1500.0),
    (850, 840, 11.938, 32.0, 0.67, 535.0, 0.885, 1.0, 0.0),
]

BARLOW_CASES = [
    (1440, 12.75, 52000, "B31.4", 1, 1.0, 1.0, 0.0),
    (1000, 8.625, 42000, "B31.8", 1, 1.0, 1.0, 0.0625),
    (1000, 8.625, 42000, "B31.8", 3, 1.0, 1.0, 0.0),
    (720, 6.625, 35000, "B31.8", 4, 1.0, 0.967, 0.05),
    # FC2 additions: one pipe through all four classes, and the joint factor
    (1200, 12.75, 52000, "B31.8", 1, 1.0, 1.0, 0.125),
    (1200, 12.75, 52000, "B31.8", 2, 1.0, 1.0, 0.125),
    (1200, 12.75, 52000, "B31.8", 3, 1.0, 1.0, 0.125),
    (1200, 12.75, 52000, "B31.8", 4, 1.0, 1.0, 0.125),
    (1200, 12.75, 52000, "B31.4", 1, 0.8, 1.0, 0.125),
]

PIGGING_CASES = [
    (6.065, 30000.0, 0.12, 5.0),
    (10.02, 52800.0, 0.05, 5.0),
    (2.067, 8000.0, 0.35, 5.0),
    # FC2 additions: the teaching line across a holdup sweep at 3 ft/s
    (7.981, 26400.0, 0.02, 3.0),
    (7.981, 26400.0, 0.06, 3.0),
    (7.981, 26400.0, 0.10, 3.0),
    (7.981, 26400.0, 0.20, 3.0),
    (7.981, 26400.0, 0.00, 3.0),
    (7.981, 26400.0, 1.00, 3.0),
]

EROSIONAL_CASES = [
    (rho, c, d)
    for rho in (5.0, 20.0, 45.0, 62.4, 54.5)
    for c in (100.0, 125.0, 175.0)
    for d in (7.981,)
]

TRAVERSE_CASES = [
    {"name": "teachingLineFlat", "p1Psia": 900.0, "qBpd": 12000, "idIn": 7.981,
     "rhoLbFt3": 54.5, "muCp": 2.5, "roughnessIn": 0.0018,
     "profile": [{"lengthFt": 8800, "elevChangeFt": 0},
                 {"lengthFt": 8800, "elevChangeFt": 0},
                 {"lengthFt": 8800, "elevChangeFt": 0}]},
    {"name": "teachingLineOverARidge", "p1Psia": 900.0, "qBpd": 12000,
     "idIn": 7.981, "rhoLbFt3": 54.5, "muCp": 2.5, "roughnessIn": 0.0018,
     "profile": [{"lengthFt": 8800, "elevChangeFt": 420},
                 {"lengthFt": 8800, "elevChangeFt": 0},
                 {"lengthFt": 8800, "elevChangeFt": -420}]},
    {"name": "traverseIntoVacuum", "p1Psia": 100.0, "qBpd": 20000,
     "idIn": 2.067, "rhoLbFt3": 56.0, "muCp": 8.0, "roughnessIn": 0.0018,
     "profile": [{"lengthFt": 20000, "elevChangeFt": 0}]},
]

OUTLET_CASES = [
    ("weymouth", 1000.0, 8.0, 25.0, 0.65, 540.0, 0.87, 1.0, 0.0, 700.0),
    ("panhandleA", 1000.0, 8.0, 25.0, 0.65, 540.0, 0.87, 1.0, 0.0, 700.0),
    ("panhandleB", 1000.0, 8.0, 25.0, 0.65, 540.0, 0.87, 1.0, 0.0, 700.0),
    ("weymouth", 1000.0, 8.0, 25.0, 0.65, 540.0, 0.87, 1.0, 800.0, 700.0),
    ("weymouth", 1000.0, 8.0, 25.0, 0.65, 540.0, 0.87, 1.0, -800.0, 700.0),
    # the descending line whose true outlet pressure is ABOVE its inlet
    ("weymouth", 1000.0, 8.0, 25.0, 0.65, 540.0, 0.87, 1.0, -3000.0, 1010.0),
    ("panhandleB", 1000.0, 8.0, 25.0, 0.65, 540.0, 0.87, 1.0, -3000.0, 1010.0),
]

# Inputs that must be REFUSED or must come back with an `error`. The oracle
# states what an honest engine owes each one; the comparison reports which
# the engine actually refuses.
REFUSAL_CASES = [
    ("liquidLineDrop", "a negative rate", {"qBpd": -5, "idIn": 6, "lengthFt": 100, "rhoLbFt3": 55, "muCp": 1}, "refuse"),
    ("liquidLineDrop", "no viscosity", {"qBpd": 5000, "idIn": 6, "lengthFt": 100, "rhoLbFt3": 55, "muCp": 0}, "refuse"),
    ("liquidLineDrop", "a negative fitting sum", {"qBpd": 5000, "idIn": 6.065, "lengthFt": 15000, "rhoLbFt3": 53, "muCp": 3, "sumK": -5}, "refuse"),
    ("liquidLineDrop", "a negative roughness", {"qBpd": 5000, "idIn": 6.065, "lengthFt": 15000, "rhoLbFt3": 53, "muCp": 3, "roughnessIn": -0.01}, "refuse"),
    ("liquidLineDrop", "an elevation change longer than the line", {"qBpd": 5000, "idIn": 6.065, "lengthFt": 100, "elevChangeFt": 9000, "rhoLbFt3": 53, "muCp": 3}, "refuse"),
    ("liquidLineTraverse", "an empty profile", {"p1Psia": 100, "profile": []}, "refuse"),
    ("weymouthQ", "a dead line", {"p1Psia": 500, "p2Psia": 600, "idIn": 8, "lengthMi": 10, "sg": 0.65, "tAvgR": 540, "zAvg": 0.9}, "refuse"),
    ("weymouthQ", "a line of no length", {"p1Psia": 900, "p2Psia": 500, "idIn": 12, "lengthMi": 0, "sg": 0.65, "tAvgR": 530, "zAvg": 0.88}, "refuse"),
    ("weymouthQ", "a negative length", {"p1Psia": 900, "p2Psia": 500, "idIn": 12, "lengthMi": -50, "sg": 0.65, "tAvgR": 530, "zAvg": 0.88}, "refuse"),
    ("weymouthQ", "a negative bore", {"p1Psia": 900, "p2Psia": 500, "idIn": -12, "lengthMi": 50, "sg": 0.65, "tAvgR": 530, "zAvg": 0.88}, "refuse"),
    ("weymouthQ", "a z factor of zero", {"p1Psia": 900, "p2Psia": 500, "idIn": 12, "lengthMi": 50, "sg": 0.65, "tAvgR": 530, "zAvg": 0}, "refuse"),
    ("weymouthQ", "an absolute temperature of zero", {"p1Psia": 900, "p2Psia": 500, "idIn": 12, "lengthMi": 50, "sg": 0.65, "tAvgR": 0, "zAvg": 0.9}, "refuse"),
    ("weymouthQ", "an efficiency above one", {"p1Psia": 900, "p2Psia": 500, "idIn": 12, "lengthMi": 50, "sg": 0.65, "tAvgR": 530, "zAvg": 0.88, "efficiency": 3}, "refuse"),
    ("weymouthQ", "a negative efficiency", {"p1Psia": 900, "p2Psia": 500, "idIn": 12, "lengthMi": 50, "sg": 0.65, "tAvgR": 530, "zAvg": 0.88, "efficiency": -1}, "refuse"),
    ("panhandleAQ", "a gas of no gravity", {"p1Psia": 900, "p2Psia": 500, "idIn": 12, "lengthMi": 50, "sg": 0, "tAvgR": 530, "zAvg": 0.88}, "refuse"),
    ("generalFlowQ", "a gas of no viscosity", {"p1Psia": 900, "p2Psia": 500, "idIn": 12, "lengthMi": 50, "sg": 0.65, "tAvgR": 530, "zAvg": 0.88, "muCp": 0}, "refuse"),
    ("gasOutletPressure", "an unknown equation", {"equation": "nonsense", "qScfd": 1}, "refuse"),
    ("gasOutletPressure", "a rate the line cannot carry", {"equation": "weymouth", "qScfd": 1e12, "p1Psia": 1000, "idIn": 8, "lengthMi": 25, "sg": 0.65, "tAvgR": 540, "zAvg": 0.87}, "refuse"),
    ("gasOutletPressure", "a rate of zero", {"equation": "weymouth", "qScfd": 0, "p1Psia": 1000, "idIn": 8, "lengthMi": 25, "sg": 0.65, "tAvgR": 540, "zAvg": 0.87}, "refuse"),
    ("requiredWallIn", "no design pressure", {"odIn": 8.625, "smysPsi": 42000}, "refuse"),
    ("requiredWallIn", "an unknown design code", {"designPsig": 1000, "odIn": 8.625, "smysPsi": 42000, "code": "B99"}, "refuse"),
    ("requiredWallIn", "a location class that does not exist", {"designPsig": 1000, "odIn": 8.625, "smysPsi": 42000, "code": "B31.8", "locationClass": 9}, "refuse"),
    ("requiredWallIn", "a temperature derate of zero", {"designPsig": 1000, "odIn": 8.625, "smysPsi": 42000, "tempDerate": 0}, "refuse"),
    ("requiredWallIn", "a joint factor of zero", {"designPsig": 1000, "odIn": 8.625, "smysPsi": 42000, "jointFactor": 0}, "refuse"),
    ("requiredWallIn", "a negative corrosion allowance", {"designPsig": 1000, "odIn": 8.625, "smysPsi": 42000, "corrosionAllowanceIn": -0.5}, "refuse"),
    ("maopPsig", "no wall left after the allowance", {"wallIn": 0.04, "odIn": 8.625, "smysPsi": 42000, "corrosionAllowanceIn": 0.0625}, "refuse"),
    ("sweptLiquidBbl", "a holdup above one", {"idIn": 6, "lengthFt": 100, "holdupFrac": 1.4}, "refuse"),
    ("sweptLiquidBbl", "no bore", {"idIn": 0, "lengthFt": 1000, "holdupFrac": 0.1}, "refuse"),
    ("sweptLiquidBbl", "a negative length", {"idIn": 6, "lengthFt": -100, "holdupFrac": 0.1}, "refuse"),
    ("pigRun", "a pig that does not move", {"lengthFt": 100, "pigSpeedFtS": 0}, "refuse"),
    ("piggingInterval", "a sweep larger than the catcher", {"maxSlugBbl": 10, "dropoutBpd": 25, "sweptBbl": 50}, "refuse"),
    ("piggingInterval", "a negative sweep", {"maxSlugBbl": 100, "dropoutBpd": 25, "sweptBbl": -500}, "refuse"),
    ("piggingInterval", "no dropout", {"maxSlugBbl": 100, "dropoutBpd": 0, "sweptBbl": 10}, "refuse"),
]


def build():
    out = {}
    out["constants"] = {
        "generalFlowConstantDerived": GENERAL_K,
        "generalFlowConstantPublished": 77.54,
        "generalFlowConstantRatio": GENERAL_K / 77.54,
        "weymouthConstantDerived": weymouth_constant_derived(),
        "weymouthConstantPublished": 433.5,
        "weymouthConstantRatio": weymouth_constant_derived() / 433.5,
        "weymouthExponentDerived": weymouth_exponent_derived(),
        "weymouthExponentPublished": 8.0 / 3.0,
        "elevationCoefficientDerived": elevation_terms(0.65, 1000.0, 540.0, 0.9)["coefficient"],
        "elevationCoefficientPublished": 0.0375,
    }
    # Same physical line, field form against published SI form.
    out["siTwin"] = []
    for form in ("weymouth", "panhandleA", "panhandleB"):
        for c in GAS_CASES:
            p1, p2, d, l, sg, t, z, e, dz = c
            fieldq = gas_q(form, p1, p2, d, l, sg, t, z, e, dz)
            siq = si_gas_q(form, p1, p2, d, l, sg, t, z, e, dz)
            if fieldq is None or siq is None:
                continue
            out["siTwin"].append({"form": form, "idIn": d, "elevChangeFt": dz,
                                  "fieldForm": fieldq["qScfd"], "siForm": siq,
                                  "ratio": fieldq["qScfd"] / siq})
    out["friction"] = [{"re": re, "relRough": rr, "f": darcy_f(re, rr),
                        "regime": "laminar" if re < 2100 else ("transitional" if re < 4000 else "turbulent")}
                       for re, rr in FRICTION_CASES]
    out["liquid"] = [liquid_line(*c) for c in LIQUID_CASES]
    out["gas"] = []
    for form in ("weymouth", "panhandleA", "panhandleB", "general"):
        for c in GAS_CASES:
            p1, p2, d, l, sg, t, z, e, dz = c
            r = gas_q(form, p1, p2, d, l, sg, t, z, e, dz)
            if r is None:
                out["gas"].append({"equation": form, "p1Psia": p1, "p2Psia": p2,
                                   "idIn": d, "lengthMi": l, "sg": sg,
                                   "tAvgR": t, "zAvg": z, "efficiency": e,
                                   "elevChangeFt": dz, "qScfd": None,
                                   "refused": "no flow"})
            else:
                row = {"equation": form, "p1Psia": p1, "p2Psia": p2, "idIn": d,
                       "lengthMi": l, "sg": sg, "tAvgR": t, "zAvg": z,
                       "efficiency": e, "elevChangeFt": dz}
                row.update(r)
                out["gas"].append(row)
    out["elevation"] = [
        dict({"sg": sg, "elevChangeFt": dz, "tAvgR": t, "zAvg": z},
             **elevation_terms(sg, dz, t, z))
        for sg, dz, t, z in [(0.65, 0.0, 540.0, 0.87), (0.65, 800.0, 540.0, 0.87),
                             (0.65, -800.0, 540.0, 0.87), (0.67, 1500.0, 535.0, 0.885),
                             (0.67, -1500.0, 535.0, 0.885), (0.67, -3000.0, 535.0, 0.885)]]
    out["barlow"] = []
    for design, od, smys, code, loc, joint, temp, ca in BARLOW_CASES:
        r = required_wall(design, od, smys, code, loc, joint, temp, ca)
        back = maop(r["tRequiredIn"], od, smys, code, loc, joint, temp, ca)
        out["barlow"].append({
            "designPsig": design, "odIn": od, "smysPsi": smys, "code": code,
            "locationClass": loc, "jointFactor": joint, "tempDerate": temp,
            "corrosionAllowanceIn": ca, "designFactor": r["designFactor"],
            "tPressureIn": r["tPressureIn"], "tRequiredIn": r["tRequiredIn"],
            "maopOfRequiredPsig": back["maopPsig"],
            "maopIgnoringAllowancePsig": maop(r["tRequiredIn"], od, smys, code,
                                              loc, joint, temp, 0.0)["maopPsig"],
            "thinWallRatio": r["tRequiredIn"] / od,
        })
    out["pigging"] = [pigging(*c) for c in PIGGING_CASES]
    out["interval"] = []
    for max_slug, dropout, swept in [(250.0, 25.0, 128.63938889943674),
                                     (400.0, 40.0, 257.4833951489605),
                                     (100.0, 25.0, 50.0), (50.0, 25.0, 60.0)]:
        r = pigging_interval(max_slug, dropout, swept)
        out["interval"].append({"maxSlugBbl": max_slug, "dropoutBpd": dropout,
                                "sweptBbl": swept,
                                "intervalDays": None if r is None else r["intervalDays"],
                                "refused": r is None})
    out["erosional"] = [erosional(*c) for c in EROSIONAL_CASES]
    out["traverse"] = []
    for c in TRAVERSE_CASES:
        r = liquid_traverse(c["p1Psia"], c["qBpd"], c["idIn"], c["rhoLbFt3"],
                            c["muCp"], c["roughnessIn"], c["profile"])
        out["traverse"].append(dict(c, **r))
    out["outlet"] = []
    for form, p1, d, l, sg, t, z, e, dz, p2 in OUTLET_CASES:
        q = gas_q(form, p1, p2, d, l, sg, t, z, e, dz)
        if q is None:
            continue
        inv = gas_outlet_closed_form(form, q["qScfd"], p1, d, l, sg, t, z, e, dz)
        out["outlet"].append({
            "equation": form, "p1Psia": p1, "idIn": d, "lengthMi": l, "sg": sg,
            "tAvgR": t, "zAvg": z, "efficiency": e, "elevChangeFt": dz,
            "p2Set": p2, "qScfd": q["qScfd"],
            "p2Recovered": None if inv is None else inv["p2Psia"],
            "p2AboveInlet": p2 > p1,
        })
    out["refusals"] = [{"fn": fn, "label": lab, "input": inp, "oracleExpects": exp}
                       for fn, lab, inp, exp in REFUSAL_CASES]
    return out


# ---------------------------------------------------------------- compare
COMPARE_JS = r'''
import fs from 'fs';
const R = process.env.FC2_ENGINES;
const H = await import(`${R}/engines/facilities/lineHydraulics.js`);
const C = await import(`${R}/engines/production/chokePerformance.js`);
const O = JSON.parse(fs.readFileSync(process.env.FC2_ORACLE, 'utf8'));
const res = { friction: [], liquid: [], gas: [], elevation: [], barlow: [],
              pigging: [], interval: [], erosional: [], traverse: [],
              outlet: [], refusals: [] };
const call = (fn, arg) => { try { return { ok: true, v: fn(arg) }; }
  catch (e) { return { ok: false, err: `${e.name}: ${e.message}` }; } };

O.friction.forEach((c) => { const r = H.frictionFactor({ re: c.re, relRough: c.relRough });
  res.friction.push({ re: c.re, relRough: c.relRough, oracle: c.f, engine: r.f,
                      oracleRegime: c.regime, engineRegime: r.regime }); });
O.liquid.forEach((c) => { const r = H.liquidLineDrop(c);
  res.liquid.push({ idIn: c.idIn, qBpd: c.qBpd, lengthFt: c.lengthFt, elevChangeFt: c.elevChangeFt, sumK: c.sumK,
    keys: ['vFtS','re','f','dpFrictionPsi','dpFittingsPsi','dpElevationPsi','dpTotalPsi']
      .map((k) => ({ k, oracle: c[k], engine: r[k] })),
    oracleRegime: c.regime, engineRegime: r.regime }); });
O.gas.forEach((c) => {
  const fn = { weymouth: H.weymouthQ, panhandleA: H.panhandleAQ, panhandleB: H.panhandleBQ, general: H.generalFlowQ }[c.equation];
  const r = fn({ p1Psia: c.p1Psia, p2Psia: c.p2Psia, idIn: c.idIn, lengthMi: c.lengthMi,
                 sg: c.sg, tAvgR: c.tAvgR, zAvg: c.zAvg, efficiency: c.efficiency, elevChangeFt: c.elevChangeFt });
  res.gas.push({ equation: c.equation, idIn: c.idIn, elevChangeFt: c.elevChangeFt, p1Psia: c.p1Psia, p2Psia: c.p2Psia,
                 oracle: c.qScfd, engine: r.error ? null : r.qScfd, engineError: r.error || null,
                 oracleF: c.fDarcy ?? null, engineF: r.fDarcy ?? null }); });
O.elevation.forEach((c) => { const r = H.elevationAdjustment({ sg: c.sg, elevChangeFt: c.elevChangeFt, tAvgR: c.tAvgR, zAvg: c.zAvg });
  res.elevation.push({ sg: c.sg, dz: c.elevChangeFt, oracleS: c.s, engineS: r.s, oracleEs: c.es, engineEs: r.es,
                       oracleLe: c.leFactor, engineLe: r.leFactor }); });
O.barlow.forEach((c) => { const r = H.requiredWallIn(c); const m = H.maopPsig({ ...c, wallIn: r.tRequiredIn });
  res.barlow.push({ code: c.code, locationClass: c.locationClass, oracleF: c.designFactor, engineF: r.designFactor,
                    oracleT: c.tRequiredIn, engineT: r.tRequiredIn,
                    oracleMaop: c.maopOfRequiredPsig, engineMaop: m.maopPsig }); });
O.pigging.forEach((c) => { const v = H.lineVolumeBbl(c); const s = H.sweptLiquidBbl(c); const p = H.pigRun({ lengthFt: c.lengthFt, pigSpeedFtS: c.pigSpeedFtS });
  res.pigging.push({ idIn: c.idIn, holdupFrac: c.holdupFrac, oracleVol: c.lineVolumeBbl, engineVol: v,
                     oracleSwept: c.sweptBbl, engineSwept: s.error ? null : s.sweptBbl, engineSweptError: s.error || null,
                     oracleHours: c.runHours, engineHours: p.error ? null : p.runHours }); });
O.interval.forEach((c) => { const r = H.piggingInterval(c);
  res.interval.push({ maxSlugBbl: c.maxSlugBbl, sweptBbl: c.sweptBbl, oracle: c.intervalDays,
                      engine: r.error ? null : r.intervalDays, engineError: r.error || null,
                      oracleRefused: c.refused }); });
O.erosional.forEach((c) => { const v = C.erosionalVelocityFtS({ mixtureDensityLbFt3: c.rhoLbFt3, cFactor: c.cFactor });
  const q = C.erosionalRateBpd({ idIn: c.idIn, mixtureDensityLbFt3: c.rhoLbFt3, cFactor: c.cFactor });
  const a = C.pipeAreaFt2(c.idIn);
  res.erosional.push({ rhoLbFt3: c.rhoLbFt3, cFactor: c.cFactor, oracleVe: c.erosionalFtS, engineVe: v,
                       oracleArea: c.areaFt2, engineArea: a, oracleRate: c.maxRateBpd, engineRate: q }); });
O.traverse.forEach((c) => { const r = H.liquidLineTraverse({ p1Psia: c.p1Psia, qBpd: c.qBpd, idIn: c.idIn,
    rhoLbFt3: c.rhoLbFt3, muCp: c.muCp, roughnessIn: c.roughnessIn, profile: c.profile });
  res.traverse.push({ name: c.name, oracleP2: c.p2Psia, engineP2: r.error ? null : r.p2Psia,
                      oracleDp: c.dpTotalPsi, engineDp: r.error ? null : r.dpTotalPsi,
                      stations: r.error ? null : r.stations.map((s, i) => ({ oracle: c.stations[i].pPsia, engine: s.pPsia })) }); });
O.outlet.forEach((c) => { const r = H.gasOutletPressure({ equation: c.equation, qScfd: c.qScfd, p1Psia: c.p1Psia,
    idIn: c.idIn, lengthMi: c.lengthMi, sg: c.sg, tAvgR: c.tAvgR, zAvg: c.zAvg, efficiency: c.efficiency, elevChangeFt: c.elevChangeFt });
  res.outlet.push({ equation: c.equation, elevChangeFt: c.elevChangeFt, p2Set: c.p2Set, p2AboveInlet: c.p2AboveInlet,
                    oracle: c.p2Recovered, engine: r.error ? null : r.p2Psia, engineError: r.error || null }); });
O.refusals.forEach((c) => {
  const fns = { liquidLineDrop: H.liquidLineDrop, liquidLineTraverse: H.liquidLineTraverse,
                weymouthQ: H.weymouthQ, panhandleAQ: H.panhandleAQ, generalFlowQ: H.generalFlowQ,
                gasOutletPressure: H.gasOutletPressure, requiredWallIn: H.requiredWallIn,
                maopPsig: H.maopPsig, sweptLiquidBbl: H.sweptLiquidBbl, pigRun: H.pigRun,
                piggingInterval: H.piggingInterval };
  const a = call(fns[c.fn], c.input);
  let verdict, detail;
  if (!a.ok) { verdict = 'threw'; detail = a.err; }
  else if (a.v && a.v.error) { verdict = 'error'; detail = a.v.error; }
  else {
    const nums = JSON.stringify(a.v);
    const bad = /null|Infinity|NaN/.test(nums) || nums.includes('null');
    const vals = a.v && typeof a.v === 'object' ? Object.values(a.v) : [a.v];
    const nonFinite = vals.some((x) => typeof x === 'number' && !Number.isFinite(x));
    verdict = nonFinite ? 'not-a-number' : 'accepted';
    detail = nums.length > 180 ? `${nums.slice(0, 180)}...` : nums;
  }
  res.refusals.push({ fn: c.fn, label: c.label, expects: c.oracleExpects, verdict, detail }); });
console.log(JSON.stringify(res));
'''


def finite(obj):
    """JSON has no NaN and no Infinity. Python's json module writes them
    anyway and every JavaScript consumer then dies on the parse, so every
    non-finite float becomes null on the way out. This is not cosmetic: a
    non-finite value in an ORACLE is a case the oracle could not answer, and
    null says that where NaN pretends to be a number."""
    if isinstance(obj, float):
        return obj if math.isfinite(obj) else None
    if isinstance(obj, dict):
        return {k: finite(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [finite(v) for v in obj]
    return obj


def compare(engines_root):
    data = finite(build())
    with tempfile.TemporaryDirectory() as td:
        op = os.path.join(td, "oracle.json")
        jp = os.path.join(td, "cmp.mjs")
        with open(op, "w") as fh:
            json.dump(data, fh)
        with open(jp, "w") as fh:
            fh.write(COMPARE_JS)
        env = dict(os.environ, FC2_ENGINES=engines_root, FC2_ORACLE=op)
        raw = subprocess.run(["node", jp], env=env, capture_output=True, text=True)
        if raw.returncode != 0:
            print(raw.stderr)
            sys.exit(1)
        r = json.loads(raw.stdout)

    def rel(a, b):
        if a is None or b is None:
            return None
        if a == b:
            return 0.0
        return abs(a - b) / max(abs(b), 1e-300)

    worst = []
    print("\n=== CONSTANTS DERIVED RATHER THAN QUOTED ===")
    c = data["constants"]
    print(f"  General Flow leading constant: derived {c['generalFlowConstantDerived']:.6f} "
          f"against the engine's published {c['generalFlowConstantPublished']}, "
          f"ratio {c['generalFlowConstantRatio']:.9f}")
    print(f"  Weymouth leading constant:     derived {c['weymouthConstantDerived']:.6f} "
          f"against the engine's published {c['weymouthConstantPublished']}, "
          f"ratio {c['weymouthConstantRatio']:.9f}")
    print(f"  Weymouth diameter exponent:    derived {c['weymouthExponentDerived']:.12f} "
          f"against the published {c['weymouthExponentPublished']:.12f}")
    print(f"  Elevation coefficient: derived {c['elevationCoefficientDerived']:.9f} "
          f"against the published {c['elevationCoefficientPublished']}, "
          f"ratio {c['elevationCoefficientDerived'] / c['elevationCoefficientPublished']:.9f}")
    print("\n=== FIELD FORM AGAINST PUBLISHED SI TWIN, SAME PHYSICAL LINE ===")
    for t in data["siTwin"]:
        flag = "  <<<" if abs(t["ratio"] - 1.0) > 3e-3 else ""
        print(f"  {t['form']:11s} d {t['idIn']:<8g} dz {t['elevChangeFt']:<8g} "
              f"field {t['fieldForm']:.6e} SI {t['siForm']:.6e} ratio {t['ratio']:.9f}{flag}")
        if abs(t["ratio"] - 1.0) > 3e-3:
            worst.append(("siTwin", f"{t['form']} d {t['idIn']} dz {t['elevChangeFt']}",
                          abs(t["ratio"] - 1.0)))

    print("\n=== FRICTION (closed form against the engine's fixed point) ===")
    for x in r["friction"]:
        d = rel(x["oracle"], x["engine"])
        flag = "  <<<" if d and d > 1e-9 else ""
        reg = "" if x["oracleRegime"] == x["engineRegime"] else f"  REGIME {x['oracleRegime']}/{x['engineRegime']}"
        print(f"  Re {x['re']:<12g} rr {x['relRough']:<8g} oracle {x['oracle']:.12f} engine {x['engine']:.12f} rel {d:.3e}{flag}{reg}")
        if d and d > 1e-9:
            worst.append(("friction", f"Re {x['re']} rr {x['relRough']}", d))

    print("\n=== LIQUID LINES ===")
    for x in r["liquid"]:
        bits = []
        for kk in x["keys"]:
            d = rel(kk["oracle"], kk["engine"])
            if d is not None and d > 1e-6:
                bits.append(f"{kk['k']} rel {d:.3e} ({kk['oracle']:.8g} vs {kk['engine']:.8g})")
                worst.append(("liquid", f"{x['idIn']} in, {x['k'] if 'k' in x else kk['k']}", d))
        tag = "  <<< " + "; ".join(bits) if bits else "  agree to 1e-6"
        print(f"  {x['qBpd']} bpd in {x['idIn']} in over {x['lengthFt']} ft, dz {x['elevChangeFt']}, sumK {x['sumK']}:{tag}")

    print("\n=== GAS FORMS ===")
    for x in r["gas"]:
        if x["oracle"] is None or x["engine"] is None:
            print(f"  {x['equation']:11s} d {x['idIn']:<7g} dz {x['elevChangeFt']:<7g} "
                  f"oracle {x['oracle']} engine {x['engine']} engineError {x['engineError']}")
            continue
        d = rel(x["oracle"], x["engine"])
        flag = "  <<<" if d > 3e-3 else ""
        print(f"  {x['equation']:11s} d {x['idIn']:<7g} dz {x['elevChangeFt']:<7g} "
              f"oracle {x['oracle']:.6e} engine {x['engine']:.6e} rel {d:.3e}{flag}")
        if d > 3e-3:
            worst.append(("gas", f"{x['equation']} d {x['idIn']} dz {x['elevChangeFt']}", d))

    print("\n=== ELEVATION GROUP ===")
    for x in r["elevation"]:
        d = rel(x["oracleS"], x["engineS"])
        print(f"  sg {x['sg']} dz {x['dz']:<8g} oracle s {x['oracleS']:.9f} engine s {x['engineS']:.9f} rel {d if d is None else f'{d:.3e}'}")

    print("\n=== BARLOW AND MAOP ===")
    for x in r["barlow"]:
        dt = rel(x["oracleT"], x["engineT"])
        dm = rel(x["oracleMaop"], x["engineMaop"])
        ff = "" if x["oracleF"] == x["engineF"] else f"  FACTOR {x['oracleF']}/{x['engineF']}"
        print(f"  {x['code']} class {x['locationClass']}: t rel {dt:.3e}, maop rel {dm:.3e}{ff}")
        if dt > 1e-9:
            worst.append(("barlow", f"{x['code']} class {x['locationClass']}", dt))

    print("\n=== PIGGING ===")
    for x in r["pigging"]:
        dv = rel(x["oracleVol"], x["engineVol"])
        ds = rel(x["oracleSwept"], x["engineSwept"])
        print(f"  {x['idIn']} in, holdup {x['holdupFrac']}: volume rel {dv:.3e}, "
              f"swept rel {ds if ds is None else f'{ds:.3e}'}, engineSweptError {x['engineSweptError']}")

    print("\n=== PIGGING INTERVAL ===")
    for x in r["interval"]:
        o = "refuses" if x["oracleRefused"] else "%.6f d" % x["oracle"]
        en = x["engineError"] if x["engineError"] else "%.6f d" % x["engine"]
        print("  catcher %s bbl, swept %s: oracle %s, engine %s"
              % (x["maxSlugBbl"], x["sweptBbl"], o, en))

    print("\n=== EROSIONAL (RP 14E) ===")
    for x in r["erosional"]:
        dv = rel(x["oracleVe"], x["engineVe"])
        dq = rel(x["oracleRate"], x["engineRate"])
        flag = "  <<<" if dq > 1e-6 else ""
        print(f"  rho {x['rhoLbFt3']:<6g} C {x['cFactor']:<6g} Ve rel {dv:.3e} rate rel {dq:.3e}{flag}")
        if dq > 1e-6:
            worst.append(("erosional", f"rho {x['rhoLbFt3']} C {x['cFactor']}", dq))

    print("\n=== TRAVERSE ===")
    for x in r["traverse"]:
        d = rel(x["oracleP2"], x["engineP2"])
        print(f"  {x['name']}: oracle p2 {x['oracleP2']:.6f} engine p2 {x['engineP2']:.6f} rel {d:.3e}")
        if d > 1e-6:
            worst.append(("traverse", x["name"], d))

    print("\n=== OUTLET PRESSURE (closed form against the engine's bisection) ===")
    for x in r["outlet"]:
        d = rel(x["oracle"], x["engine"])
        flag = "  <<< DISAGREE" if (d is None or d > 1e-6) else ""
        print(f"  {x['equation']:11s} dz {x['elevChangeFt']:<8g} set p2 {x['p2Set']:<8g} "
              f"(above inlet: {x['p2AboveInlet']}) oracle {x['oracle']} engine {x['engine']} "
              f"err {x['engineError']}{flag}")
        if d is None or d > 1e-6:
            worst.append(("outlet", f"{x['equation']} dz {x['elevChangeFt']} p2 {x['p2Set']}", d if d else float('inf')))

    print("\n=== REFUSAL BRANCHES ===")
    fails_open = []
    for x in r["refusals"]:
        honest = x["verdict"] in ("threw", "error")
        mark = "ok      " if honest else ("NUMBERLESS" if x["verdict"] == "not-a-number" else "FAILS OPEN")
        print(f"  {mark} {x['fn']}, {x['label']}: {x['verdict']} {x['detail']}")
        if not honest:
            fails_open.append((x["fn"], x["label"], x["verdict"]))

    print(f"\n=== SUMMARY ===")
    print(f"  numeric disagreements past tolerance: {len(worst)}")
    for w in worst:
        print(f"    {w[0]}: {w[1]} rel {w[2]:.3e}")
    print(f"  inputs the oracle says must be refused and the engine does not: {len(fails_open)}")
    for f in fails_open:
        print(f"    {f[0]}, {f[1]} -> {f[2]}")
    return r


def main():
    if "--emit" in sys.argv:
        dest = sys.argv[sys.argv.index("--emit") + 1]
        os.makedirs(dest, exist_ok=True)
        data = finite(build())
        for key, rows in data.items():
            p = os.path.join(dest, f"linesizing_{key}_cases.json")
            with open(p, "w") as fh:
                json.dump(rows, fh, indent=1, sort_keys=True)
            n = len(rows) if isinstance(rows, list) else 1
            print(f"wrote {p} ({n} rows)")
        return
    if "--compare" in sys.argv:
        root = os.environ.get("FC2_ENGINES",
                              "/root/wt-fc2-nextgen/packages/engines")
        compare(root)
        return
    print(__doc__.strip())


if __name__ == "__main__":
    main()
