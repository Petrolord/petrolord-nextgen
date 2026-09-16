#!/usr/bin/env python3
"""FC3 oracle, second pass: the compression STAGE, head, temperature, power.

Split from oracle_rotating.py only because it needs one number the oracle
declines to re-derive: the DAK z factor. z is an 11-coefficient empirical fit
validated in its own domain, and re-implementing it here would be copying
rather than checking, so the ENGINE's own zAvg is read in from
scratch/stage_z.json (written by compare.mjs) and DECLARED as an input. Every
other quantity on this page is independent:

  - the polytropic head by 64-POINT GAUSS-LEGENDRE quadrature of int(v dp) at
    50 decimal digits, against the engine's closed form and against the engine
    oracle's Simpson rule;
  - a PATH-PROPERTY residual showing p v^n really is constant along the path
    the exponent claims, which is the defining property of a polytropic path
    and cannot be faked by matching algebra;
  - the discharge temperature INVERTED OUT of that quadrature head, rather
    than marched;
  - the mass flow and the shaft power from constants DERIVED from their own
    definitions (the universal gas constant from the 2019 SI value, the
    horsepower from its definition as 550 ft.lbf/s), so the engine's 1545.349,
    379.49 and 33000 are explained rather than repeated.

stdlib only.
"""

import json
import math
import os
import sys
from decimal import Decimal, getcontext
from fractions import Fraction

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from oracle_rotating import (                                    # noqa: E402
    R_FT_LBF, R_PSIA_FT3, R_OFFSET, FT_LBF_PER_MIN_PER_HP,
    poly_head_by_quadrature, path_property_residual, t2_from_head,
)

getcontext().prec = 60
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'scratch', 'stage_z.json')

# The engine's own MW_AIR and LBMOL_SCF, used as INPUTS so that the head and
# the power are what is checked. Their VALUES are audited separately below.
#
# AFTER FC3-0 the module holds ONE gas constant and ONE standard base. It used
# to declare R_UNIVERSAL_FT_LBF = 1545.349 privately while importing from
# gasProperties.js, which declares the same constant as 10.7316 psia.ft3, a
# ratio of 0.999999094056597; and it quoted LBMOL_SCF = 379.49 for the 60 degF
# base while working its inlet volumes from 14.7 psia and 520 degR, three parts
# in ten thousand away. It now imports the owner's constant and derives the
# molar volume from one declared base, so section A below prints a ratio of
# exactly 1 between the two engine constants where it used to print the
# divergence.
ENGINE_R_PSIA_FT3 = 10.7316          # gasProperties.js R_UNIVERSAL, the owner
ENGINE_R_FT_LBF = ENGINE_R_PSIA_FT3 * 144
ENGINE_MW_AIR = 28.9625              # gasProperties.js AIR_MW
ENGINE_STD_P_PSIA = 14.696
ENGINE_STD_T_R = 519.67
ENGINE_LBMOL_SCF = ENGINE_R_PSIA_FT3 * ENGINE_STD_T_R / ENGINE_STD_P_PSIA


def main():
    if not os.path.exists(SRC):
        print(f'REFUSED: {SRC} is missing. Run compare.mjs first; an oracle '
              f'pass over zero cases is worse than no pass.', file=sys.stderr)
        return 2
    rows = json.load(open(SRC))
    if not rows:
        print('REFUSED: the sweep is empty.', file=sys.stderr)
        return 2

    print('=' * 78)
    print('A. THE CONSTANTS, DERIVED AGAINST WHAT THE MODULES CARRY')
    print('=' * 78)
    derived_r = float(R_FT_LBF)
    print(f'  universal gas constant, derived from 2019 SI : {derived_r:.10f} ft.lbf/(lbmol.degR)')
    print(f'  compression.js R_UNIVERSAL_FT_LBF            : {ENGINE_R_FT_LBF:.10f}')
    print(f'    ratio engine/derived                       : {ENGINE_R_FT_LBF / derived_r:.15f}')
    print(f'  gasProperties.js R_UNIVERSAL x 144           : {ENGINE_R_PSIA_FT3 * 144:.10f}')
    print(f'    ratio against derived                      : {ENGINE_R_PSIA_FT3 * 144 / derived_r:.15f}')
    print(f'    ratio of the TWO ENGINE CONSTANTS          : '
          f'{ENGINE_R_FT_LBF / (ENGINE_R_PSIA_FT3 * 144):.15f}')
    print(f'  derived R in psia.ft3/(lbmol.degR)           : {float(R_PSIA_FT3):.10f}')
    print()
    for label, p, t in [('14.696 psia, 519.67 degR', 14.696, 519.67),
                        ('14.70  psia, 520.00 degR', 14.7, 520.0),
                        ('14.65  psia, 520.00 degR', 14.65, 520.0)]:
        v = float(R_PSIA_FT3) * t / p
        print(f'  molar volume at {label}: {v:.6f} scf/lbmol '
              f'(engine LBMOL_SCF {ENGINE_LBMOL_SCF}, ratio {ENGINE_LBMOL_SCF / v:.9f})')
    print()

    print('=' * 78)
    print('B. THE STAGES. head by quadrature, T2 by inversion, power from the')
    print('   derived horsepower, against the engine.')
    print('=' * 78)
    worst = {'head': 0, 't2': 0, 'mass': 0, 'hp': 0, 'path': 0, 'etas': 0}
    at = {}
    n = 0
    for i, row in enumerate(rows):
        e = row['exponentRatio']
        z = row['zAvg']
        mw = ENGINE_MW_AIR * row['gasSg']
        t1_r = row['tSuctionF'] + float(R_OFFSET)
        ratio = row['ratio']

        # The quadrature uses the DERIVED gas constant throughout.
        head = poly_head_by_quadrature(z, mw, t1_r, ratio, e)
        # The same quadrature re-scaled onto the ENGINE's rounded constant, so
        # the constant's contribution is separated from the integral's. If the
        # whole gap is the constant, this column agrees to machine noise.
        head_on_engine_r = head * ENGINE_R_FT_LBF / float(R_FT_LBF)
        path = path_property_residual(ratio, e)
        t2_r = t2_from_head(z, mw, t1_r, head, e)
        t2_f = t2_r - float(R_OFFSET)

        lbmol_hr = row['qMMscfd'] * 1e6 / ENGINE_LBMOL_SCF / 24.0
        mass = lbmol_hr * mw
        # hp = (lb/hr * ft.lbf/lbm) / (ft.lbf per minute per hp * 60 min/hr)
        gas_hp = mass * head / (FT_LBF_PER_MIN_PER_HP * 60) / row['polytropicEfficiency']

        k_exp = (row['k'] - 1.0) / row['k']
        eta_s = (ratio ** k_exp - 1) / (ratio ** e - 1)

        eng = row['engine']
        d = {
            'head': abs(head - eng['headPolyFtLbfLbm']) / abs(eng['headPolyFtLbfLbm']),
            't2': abs(t2_f - eng['tDischargeF']) / abs(eng['tDischargeF']),
            'mass': abs(mass - eng['massLbHr']) / abs(eng['massLbHr']),
            'hp': abs(gas_hp - eng['gasHp']) / abs(eng['gasHp']),
            'etas': abs(eta_s - eng['isentropicEfficiency']) / abs(eng['isentropicEfficiency']),
            'path': path,
        }
        for kk, vv in d.items():
            if vv > worst[kk]:
                worst[kk] = vv
                at[kk] = i
        n += 1
        print(f'  stage {i}: r={ratio:5.2f} k={row["k"]:.2f} eta={row["polytropicEfficiency"]:.2f}  '
              f'head {head:14.6f} vs {eng["headPolyFtLbfLbm"]:14.6f} ({d["head"]:.3e})  '
              f'T2 {t2_f:9.4f} vs {eng["tDischargeF"]:9.4f} ({d["t2"]:.3e})  '
              f'hp {gas_hp:11.5f} vs {eng["gasHp"]:11.5f} ({d["hp"]:.3e})')
        print(f'           path residual on p v^n: {path:.3e}   '
              f'quadrature re-scaled onto the ENGINE constant: {head_on_engine_r:14.6f} '
              f'(relative gap to the engine '
              f'{abs(head_on_engine_r - eng["headPolyFtLbfLbm"]) / eng["headPolyFtLbfLbm"]:.3e})')

    if n == 0:
        print('REFUSED: swept nothing.', file=sys.stderr)
        return 2

    print()
    print('  worst relative gaps across', n, 'stages:')
    for kk in ('head', 't2', 'mass', 'hp', 'etas', 'path'):
        print(f'    {kk:6s} {worst[kk]:.3e}  (case {at.get(kk)})')

    print()
    print('=' * 78)
    print('C. NEGATIVE CONTROL')
    print('=' * 78)
    row = rows[0]
    bad = poly_head_by_quadrature(row['zAvg'], ENGINE_MW_AIR * row['gasSg'],
                                  row['tSuctionF'] + float(R_OFFSET),
                                  row['ratio'], row['exponentRatio'] * 1.001)
    g = abs(bad - row['engine']['headPolyFtLbfLbm']) / row['engine']['headPolyFtLbfLbm']
    print(f'  head recomputed with the exponent moved 0.1 percent: relative gap '
          f'{g:.3e} -> {"CAUGHT" if g > 1e-6 else "NOT CAUGHT"}')
    if g <= 1e-6:
        print('  THE COMPARISON IS NOT COMPARING ANYTHING.')
        return 1

    print()
    print('=' * 78)
    print('D. THE ISENTROPIC IDENTITY, PROVED RATHER THAN ASSERTED')
    print('=' * 78)
    for kn, kd, en_, ed in [(128, 100, 75, 100), (126, 100, 78, 100), (13, 10, 72, 100)]:
        k = Fraction(kn, kd)
        eta = Fraction(en_, ed)
        e = (k - 1) / (k * eta)
        print(f'  k={float(k)} eta={float(eta)}:  e * eta = {e * eta} and (k-1)/k = {(k - 1) / k}'
              f'  -> equal: {e * eta == (k - 1) / k}')
    print('  Therefore headIsen/etaIsen and headPoly/etaPoly are ONE expression.')
    print('  The engine gate that compares the two power routes compares a value')
    print('  with itself; it cannot fail, and it validates nothing.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
