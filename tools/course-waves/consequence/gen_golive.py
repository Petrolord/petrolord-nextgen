#!/usr/bin/env python3
"""Generate the H4 go-live migration.

NOTHING HERE IS RETYPED. The eighteen graded values are read out of the
CAPSTONE ROWS THE LADDER ITSELF SEEDED, by key, inside the same transaction.
They are then checked three ways, and none of the three is a restatement of the
generator that wrote them:

1. AGAINST THE ENGINE LEDGER. gen_course.py runs `node h4_capstone.mjs --json`
   through the vendored engines/hse/consequence.js when this file is generated,
   and refuses unless fields.json carries exactly what that run returned. The
   values the go-live compares the seeded rows to are THAT RUN'S, emitted to the
   last bit, so a capstone row an earlier seed left behind (the course migration
   inserts with `on conflict do nothing`) is refused here by name, and so is a
   move of one part in 1e7.

2. BY A SECOND ROUTE IN SQL, over the inputs the learner is handed. Every
   closed-form graded value is recomputed by Postgres from the published
   equations with no engine code at all: Bernoulli through a hole, the Yellow
   Book gas outflow with the choked test and the subsonic outflow coefficient,
   the stated-thickness pool, the Briggs rural sigmas and the reflected plume
   with the ppm conversion at 25 C, the Babrauskas burning flux, Thomas with
   wind, the flame tilt, both surface emissive powers, the Mudan tilted
   cylinder view factor term by term, the solid flame heat flux, Kinney and
   Graham, and the four probits through the same Abramowitz and Stegun erf the
   engine's normal CDF uses. The two graded ROOTS (the plume's far distance and
   the blast distance) are asserted BY THE EQUATION THEY ARE A ROOT OF: the
   forward model at the seeded distance lands on its target, and the plume is
   falling there, so it is the far root.

   AND THE INPUTS IT READS ARE THE INPUTS THE LEARNER READS. Each shipped prompt
   must be the prompt gen_course.py rendered from the engine's own inputs, byte
   for byte (md5), and every rendered fragment must be in it.

3. BY THE TRAPS THE COURSE IS BUILT ON, which must BITE on the seeded values.
   Every wrong method discriminate.mjs sweeps (105 over 18 fields: the static
   head forgotten, a choked release worked subsonic, the two dropped from
   Bernoulli, the ground reflection dropped, the receptor taken at ground level,
   the still air flame length, the tilt ignored, the paper's printed constants,
   Phi of the probit itself, the other source's coefficients, the conversion
   upside down, and the rest) is emitted as the value the sweep computed and
   must miss the SEEDED value by more than the field's own tolerance.

WHAT IT REFUSES TO WRITE: a refusal that reads a graded value and does not name
it; a graded field no refusal names; a division with a bare integer
denominator; an unclosed literal; an em or en dash; a go-live whose engine run
and fields.json disagree (gen_course.py refuses that first); a second route
that does not first agree with the engine in the Python mirror below.

Usage: python3 gen_golive.py
   H4_WAVE        the wave directory (default /root/hse-wip-consequence)
   H4_REPO        the nextgen clone   (default /root/wt-h4-nextgen)
   H4_ENGINES     packages/engines to run the capstone through
   H4_TOLERANCE   gradedTolerance.js
   H4_COURSE_SQL  the course migration this ladder emits, for the prompt checks
   H4_GOLIVE_OUT  where to write
"""
import hashlib
import json
import math
import os
import re
import subprocess
import sys

W = os.environ.get('H4_WAVE', '/root/hse-wip-consequence')
REPO = os.environ.get('H4_REPO', '/root/wt-h4-nextgen')
COURSE = os.environ.get('H4_COURSE_SQL', f'{REPO}/migrations/20261006_h4_consequence_course.sql')
OUT = os.environ.get('H4_GOLIVE_OUT', f'{REPO}/migrations/20261006_h4_consequence_go_live.sql')

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ['H4_WAVE'] = W
import gen_course as GC  # noqa: E402  (runs the engine; writes nothing on import)

SLUG, MODULE, PATH_ORDER = GC.SLUG, GC.MODULE, GC.PATH_ORDER
fields = GC.fields
KEYS, TIER_OF, F, TOL, DP = GC.KEYS, GC.TIER_OF, GC.F, GC.TOL, GC.DP
ENGINE = {k: GC.ENGINE[(TIER_OF[k], k)] for k in KEYS}
OK, YK, PE = GC.OK, GC.YK, GC.PE
refused = list(GC.bad)

course_sql = open(COURSE, encoding='utf-8').read()
if course_sql != GC.SQL:
    refused.append(f'the course migration at {COURSE} is not the one gen_course.py renders now')

TOL_OF_DP = {12: 5e-13, 6: 5e-7}
for k in KEYS:
    if DP.get(k) not in TOL_OF_DP or TOL[k] != TOL_OF_DP[DP[k]]:
        refused.append(f'{k} is graded at {TOL[k]} for {DP.get(k)} decimals; this go-live grades '
                       f'twelve decimals at 5e-13 and six at 5e-7')


def f17(x):
    """A float literal SQL will read back as this exact double."""
    return repr(float(x)) + '::double precision'


def lit(s):
    return "'" + s.replace("'", "''") + "'"


V = {k: f'v_g_{k}' for k in KEYS}


def name(*keys):
    """The graded fields a refusal reads, spelled tier/key."""
    for k in keys:
        assert k in V, k
    return ' [graded field: ' + ', '.join(f'{TIER_OF[k]}/{k}' for k in keys) + ']'


# ---------------------------------------------------------------------------
# ONE EXPRESSION, TWO LANGUAGES. E carries a Python double and the SQL text of
# the same arithmetic, fully parenthesised, so Postgres performs the same IEEE
# operations in the same order as the Python mirror. A symbolic E (a PL/pgSQL
# variable) carries no Python value.
# ---------------------------------------------------------------------------
class E:
    __slots__ = ('v', 's')

    def __init__(self, v, s):
        self.v, self.s = v, s

    @staticmethod
    def of(x):
        return x if isinstance(x, E) else E(float(x), f17(x))

    def _op(self, o, sym, fn, rev=False):
        o = E.of(o)
        a, b = (o, self) if rev else (self, o)
        v = None if a.v is None or b.v is None else fn(a.v, b.v)
        return E(v, f'({a.s} {sym} {b.s})')

    def __add__(self, o): return self._op(o, '+', lambda a, b: a + b)
    def __radd__(self, o): return self._op(o, '+', lambda a, b: a + b, True)
    def __sub__(self, o): return self._op(o, '-', lambda a, b: a - b)
    def __rsub__(self, o): return self._op(o, '-', lambda a, b: a - b, True)
    def __mul__(self, o): return self._op(o, '*', lambda a, b: a * b)
    def __rmul__(self, o): return self._op(o, '*', lambda a, b: a * b, True)
    def __truediv__(self, o): return self._op(o, '/', lambda a, b: a / b if b != 0 else math.nan)
    def __rtruediv__(self, o): return self._op(o, '/', lambda a, b: a / b if b != 0 else math.nan, True)


def L(x):
    return E.of(x)


def sym(var):
    return E(None, var)


def sq(x):
    return x * x




def fn(name, *args):
    """A SQL function applied to E arguments, mirrored in Python."""
    PY = {'sqrt': math.sqrt, 'exp': math.exp, 'ln': math.log, 'atan': math.atan, 'asin': math.asin,
          'cbrt': lambda x: x ** (1.0 / 3.0) if x >= 0 else -((-x) ** (1.0 / 3.0)), 'abs': abs,
          'power': lambda a, b: a ** b, 'greatest': max}
    es = [E.of(a) for a in args]
    v = None if any(e.v is None for e in es) else PY[name](*[e.v for e in es])
    return E(v, f"{name}({', '.join(e.s for e in es)})")


PI = E(math.pi, 'pi()')
G = L(9.80665)
RGAS = L(8.314462618)
ATM = L(101325.0)
PSI = L(6894.757293168361)


def erf(x):
    """Abramowitz and Stegun 7.1.26, as lib/stats/stats.js writes it."""
    ax = fn('abs', x)
    t = L(1.0) / (L(1.0) + L(0.3275911) * ax)
    y = L(1.0) - (((((L(1.061405429) * t - L(1.453152027)) * t) + L(1.421413741)) * t - L(0.284496736)) * t
                  + L(0.254829592)) * t * fn('exp', L(0.0) - ax * ax)
    sgn_v = None if x.v is None else (-1.0 if x.v < 0 else 1.0)
    sgn = E(sgn_v, f"(case when {x.s} < 0.0::double precision then -1.0::double precision else 1.0::double precision end)")
    return sgn * y


def phi(x):
    return L(0.5) * (L(1.0) + erf(x / fn('sqrt', L(2.0))))


def area(d):
    return PI / L(4.0) * L(d) * L(d)


# ---------------------------------------------------------------- source terms
def liquid(s):
    dp = L(s['liquidDensityKgM3']) * G * L(s['liquidHeadM']) + L(s['pressureAboveLiquidPa']) - ATM
    return L(s['dischargeCoefficient']) * area(s['holeDiameterM']) * fn('sqrt', L(2.0) * dp * L(s['liquidDensityKgM3']))


def gas(s, subsonic):
    g = L(s['heatCapacityRatio'])
    r = ATM / L(s['upstreamPressurePa'])
    rho0 = L(s['upstreamPressurePa']) * L(s['molarMassKgMol']) / (RGAS * L(s['upstreamTemperatureK']))
    core = fn('sqrt', rho0 * L(s['upstreamPressurePa']) * g * fn('power', L(2.0) / (g + L(1.0)), (g + L(1.0)) / (g - L(1.0))))
    if not subsonic:
        return L(s['dischargeCoefficient']) * area(s['holeDiameterM']) * core
    psi2 = (L(2.0) / (g - L(1.0))) * fn('power', (g + L(1.0)) / L(2.0), (g + L(1.0)) / (g - L(1.0))) \
        * fn('power', r, L(2.0) / g) * (L(1.0) - fn('power', r, (g - L(1.0)) / g))
    return L(s['dischargeCoefficient']) * area(s['holeDiameterM']) * fn('sqrt', psi2) * core


def crit(s):
    g = L(s['heatCapacityRatio'])
    return fn('power', L(2.0) / (g + L(1.0)), g / (g - L(1.0)))


BRIGGS = {'D': (0.08, 0.0001, 0.06, 0.0015, -0.5), 'E': (0.06, 0.0001, 0.03, 0.0003, -1.0)}


def conc_mg(q, u, cls, x, y, z, h):
    sy1, sy2, sz1, sz2, sz3 = BRIGGS[cls]
    sy = L(sy1) * x / fn('sqrt', L(1.0) + L(sy2) * x)
    sz = L(sz1) * x * fn('power', L(1.0) + L(sz2) * x, L(sz3))
    k = L(q) / (L(2.0) * PI * sy * sz * L(u)) * fn('exp', L(0.0) - L(y) * L(y) / (L(2.0) * sy * sy)) \
        * (fn('exp', L(0.0) - (L(z) - L(h)) * (L(z) - L(h)) / (L(2.0) * sz * sz))
           + fn('exp', L(0.0) - (L(z) + L(h)) * (L(z) + L(h)) / (L(2.0) * sz * sz)))
    return k * L(1e6)


def vm_l(t):
    return RGAS * L(t) / ATM * L(1000.0)


# ----------------------------------------------------------------- the fire
Y_ = YK
D_ = L(Y_['poolDiameterM'])
MB = L(0.039) * (L(1.0) - fn('exp', L(0.0) - L(3.5) * D_))   # Babrauskas kerosene, YB Table 6.5
RHO = L(Y_['airDensityKgM3'])
U10 = L(Y_['windSpeed10mMS'])
UC = fn('power', G * MB * D_ / RHO, L(1.0) / L(3.0))
USTAR = fn('greatest', L(1.0), U10 / UC)
LEN = D_ * L(55.0) * fn('power', MB / (RHO * fn('sqrt', G * D_)), L(0.67)) * fn('power', USTAR, L(-0.21))
FR = U10 * U10 / (G * D_)
RE = U10 * D_ / L(Y_['airKinematicViscosityM2S'])
CT = L(0.666) * fn('power', FR, L(0.333)) * fn('power', RE, L(0.117))
TILT_RAD = fn('asin', (fn('sqrt', L(4.0) * CT * CT + L(1.0)) - L(1.0)) / (L(2.0) * CT))
TILT = TILT_RAD * L(180.0) / PI
EXPD = fn('exp', L(-0.12) * D_)
SEP_M = L(140e3) * EXPD + L(20e3) * (L(1.0) - EXPD)
SEP_MAX = L(Y_['radiativeFraction']) * MB * L(Y_['heatOfCombustionJKg']) / (L(1.0) + L(4.0) * LEN / D_)
SEP_A = SEP_MAX * (L(1.0) - L(Y_['sootFraction'])) + L(20000.0) * L(Y_['sootFraction'])
A_ = LEN / (D_ / L(2.0))
B_ = L(Y_['targetDistanceFromCentreM']) / (D_ / L(2.0))
SN = E(None if TILT_RAD.v is None else math.sin(TILT_RAD.v), f'sin({TILT_RAD.s})')
CO = E(None if TILT_RAD.v is None else math.cos(TILT_RAD.v), f'cos({TILT_RAD.s})')
AA = fn('sqrt', A_ * A_ + (B_ + L(1.0)) * (B_ + L(1.0)) - L(2.0) * A_ * (B_ + L(1.0)) * SN)
BB = fn('sqrt', A_ * A_ + (B_ - L(1.0)) * (B_ - L(1.0)) - L(2.0) * A_ * (B_ - L(1.0)) * SN)
CC = fn('sqrt', L(1.0) + (B_ * B_ - L(1.0)) * CO * CO)
DD = fn('sqrt', (B_ - L(1.0)) / (B_ + L(1.0)))
EE = A_ * CO / (B_ - A_ * SN)
FF = fn('sqrt', B_ * B_ - L(1.0))
ARCS = fn('atan', (A_ * B_ - FF * FF * SN) / (FF * CC)) + fn('atan', FF * SN / CC)
AADB = fn('atan', AA * DD / BB)
FV = (L(0.0) - EE * fn('atan', DD) + EE * ((A_ * A_ + (B_ + L(1.0)) * (B_ + L(1.0)) - L(2.0) * B_ * (L(1.0) + A_ * SN)) / (AA * BB)) * AADB
      + (CO / CC) * ARCS) / PI
FH = (fn('atan', L(1.0) / DD) + (SN / CC) * ARCS
      - ((A_ * A_ + (B_ + L(1.0)) * (B_ + L(1.0)) - L(2.0) * (B_ + L(1.0) + A_ * B_ * SN)) / (AA * BB)) * AADB) / PI
FMAX = fn('sqrt', FV * FV + FH * FH)
HEAT = SEP_A * FMAX * L(Y_['transmissivity'])


# ------------------------------------------------------------------ the harm
def kg_ratio(z):
    return L(808.0) * (L(1.0) + (z / L(4.5)) * (z / L(4.5))) / (
        fn('sqrt', L(1.0) + (z / L(0.048)) * (z / L(0.048))) * fn('sqrt', L(1.0) + (z / L(0.32)) * (z / L(0.32)))
        * fn('sqrt', L(1.0) + (z / L(1.35)) * (z / L(1.35))))


W_ = L(PE['tntMassKg'])
BLAST = kg_ratio(L(PE['distanceM']) / fn('cbrt', W_)) * ATM
P_OVER = phi(L(1.47) + L(1.37) * fn('ln', L(PE['buildingOverpressurePa']) / PSI) - L(5.0))
TH_, TX_, NH_ = PE['thermal'], PE['toxic'], PE['ammonia']
P_TH = phi(L(-14.9) + L(2.56) * fn('ln', L(TH_['exposureTimeS']) * fn('power', L(TH_['heatFluxWM2']) / L(1000.0), L(4.0) / L(3.0))) - L(5.0))
P_TX = phi(L(-8.29) + L(0.92) * fn('ln', L(TX_['concentrationPpm']) * L(TX_['concentrationPpm']) * L(TX_['exposureMinutes'])) - L(5.0))
PPM_NH3 = L(NH_['concentrationMgM3']) * vm_l(NH_['temperatureK']) / L(NH_['molarMassGMol'])
P_NH3 = phi(L(-35.9) + L(1.85) * fn('ln', PPM_NH3 * PPM_NH3 * L(NH_['exposureMinutes'])) - L(5.0))

C_, R_, V_, S_, P_, Q_ = OK['condensate'], OK['riser'], OK['vent'], OK['spill'], OK['plume'], OK['reach']
PLUME_PPM = conc_mg(P_['massRateKgS'], P_['windSpeedMS'], P_['stabilityClass'], L(P_['downwindDistanceM']),
                    P_['crosswindDistanceM'], P_['receptorHeightM'], P_['releaseHeightM']) \
    * vm_l(298.15) / L(P_['molarMassGMol'])

ROUTE = {
    'okan_condensate_leak_mass_rate_kg_s': liquid(C_),
    'okan_gas_riser_choked_mass_rate_kg_s': gas(R_, False),
    'okan_vent_subsonic_mass_rate_kg_s': gas(V_, True),
    'okan_deck_spill_equivalent_diameter_m': fn('sqrt', L(4.0) * (L(S_['spillVolumeM3']) / L(S_['poolThicknessM'])) / PI),
    'okan_plume_receptor_concentration_ppm': PLUME_PPM,
    'yokri_flame_length_with_wind_m': LEN,
    'yokri_flame_tilt_deg': TILT,
    'yokri_surface_emissive_power_mudan_w_m2': SEP_M,
    'yokri_surface_emissive_power_actual_w_m2': SEP_A,
    'yokri_view_factor_max': FMAX,
    'yokri_solid_flame_heat_flux_w_m2': HEAT,
    'pennington_blast_overpressure_pa': BLAST,
    'pennington_overpressure_fatality_probability': P_OVER,
    'pennington_thermal_lethality_probability': P_TH,
    'pennington_toxic_lethality_probability': P_TX,
    'pennington_ammonia_lethality_probability': P_NH3,
}
WHAT = {
    'okan_condensate_leak_mass_rate_kg_s': 'Bernoulli through the condensate hole',
    'okan_gas_riser_choked_mass_rate_kg_s': 'the choked Yellow Book outflow through the riser hole',
    'okan_vent_subsonic_mass_rate_kg_s': 'the subsonic Yellow Book outflow through the vent hole',
    'okan_deck_spill_equivalent_diameter_m': 'the stated thickness pool diameter',
    'okan_plume_receptor_concentration_ppm': 'the reflected plume with the Briggs rural D sigmas, in ppm at 25 C',
    'yokri_flame_length_with_wind_m': 'Thomas with wind on the Babrauskas kerosene burning flux',
    'yokri_flame_tilt_deg': 'the Yellow Book tilt from the Froude and Reynolds numbers',
    'yokri_surface_emissive_power_mudan_w_m2': 'the Mudan diameter correlation',
    'yokri_surface_emissive_power_actual_w_m2': 'the radiative fraction with soot',
    'yokri_view_factor_max': 'the Mudan tilted cylinder view factor, term by term',
    'yokri_solid_flame_heat_flux_w_m2': 'the product of the surface emissive power, Fmax and the stated transmissivity',
    'pennington_blast_overpressure_pa': 'Kinney and Graham at the scaled control room distance',
    'pennington_overpressure_fatality_probability': 'the HSC probit in psig through the erf',
    'pennington_thermal_lethality_probability': 'the Eisenberg probit through the erf',
    'pennington_toxic_lethality_probability': 'the Lees chlorine probit through the erf',
    'pennington_ammonia_lethality_probability': 'the Lees ammonia probit on the converted ppm through the erf',
}

checks = []


def same(what, a, b, eps_rel):
    d = abs(a - b) / abs(b)
    checks.append((what, d, eps_rel))
    if not d <= eps_rel:
        refused.append(f'{what}: {a!r} against {b!r}, relative difference {d} exceeds {eps_rel}')


EPS = 1e-11       # a second-route value against the seeded one, relative
EPS_ROOT = 1e-9   # the forward model at a seeded root against its target, relative

for k, e in ROUTE.items():
    same(f'{k}: {WHAT[k]} against the engine', e.v, ENGINE[k], EPS)
if set(ROUTE) | {'okan_plume_far_distance_m', 'pennington_blast_distance_for_overpressure_m'} != set(KEYS):
    refused.append('the second route and the roots do not cover the eighteen fields')
if not (ATM.v / R_['upstreamPressurePa'] <= crit(R_).v and ATM.v / V_['upstreamPressurePa'] > crit(V_).v):
    refused.append('the riser is not choked and the vent subsonic, as the capstone is built')


def reach_at(x):
    return conc_mg(Q_['massRateKgS'], Q_['windSpeedMS'], Q_['stabilityClass'], x, 0.0, Q_['receptorHeightM'], Q_['releaseHeightM'])


def sv(var):
    return E(None, var)


xs = ENGINE['okan_plume_far_distance_m']
same('the plume at the seeded far distance against its stated target', reach_at(L(xs)).v, Q_['targetConcentrationMgM3'], EPS_ROOT)
if not reach_at(L(xs * 1.001)).v < Q_['targetConcentrationMgM3']:
    refused.append('the plume is not falling at the seeded far distance, so it is not the far root')
xb = ENGINE['pennington_blast_distance_for_overpressure_m']
same('Kinney and Graham at the seeded blast distance against the stated overpressure',
     (kg_ratio(L(xb) / fn('cbrt', W_)) * ATM).v, PE['targetOverpressurePa'], EPS_ROOT)

# THE TRAPS: every wrong value discriminate.mjs swept through the engine.
DISC = os.path.join(W, 'discriminate.mjs')
TRAPVAL = {}
if os.path.exists(DISC):
    r = subprocess.run(['node', DISC, '--values'], capture_output=True, text=True,
                       env=dict(os.environ, H4_WAVE_DIR=W, H4_ENGINES=GC.ENGINES))
    for m in re.finditer(r'^\s*wrong (\S+) (\S+) = (\S+)$', r.stdout, re.M):
        TRAPVAL[(m.group(1), m.group(2).replace('_', ' '))] = float(m.group(3))
else:
    refused.append(f'no discriminate.mjs at {DISC}, so the traps cannot be read from the engine sweep')
NTRAPS = len(TRAPVAL)
if NTRAPS < 54:
    refused.append(f'only {NTRAPS} wrong methods were read out of discriminate.mjs')
for k in KEYS:
    mine = [v for (kk, _w), v in TRAPVAL.items() if kk == k]
    if len(mine) < 3:
        refused.append(f'{k} has {len(mine)} traps; three is the floor discriminate.mjs holds every route to')
for (k, why), v in TRAPVAL.items():
    if not math.isnan(v) and abs(v - F[k]) <= TOL[k]:
        refused.append(f'{k}: {why} gives {v}, within the tolerance of the graded {F[k]}, so the trap does not bite')

# ---------------------------------------------------------------------------
# THE SQL
# ---------------------------------------------------------------------------
HEADER = f"""-- ============================================================================
-- H4 GO-LIVE (HELD): Consequence Modelling flips to 'available', the FOURTH
-- course of the HSE module, at path_order {PATH_ORDER}.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/consequence. The 78 lessons, the teaching lab
-- (consequenceLab.js) and its three explorer panels (release, fire and harm)
-- ship in the ZIP and NOT in this database, so a flip before the upload puts a
-- live catalogue tile in front of a route that does not exist. This file is
-- written, dry-run and left unapplied on purpose.
--
-- EVERY GRADED VALUE IS CHECKED THREE WAYS, and none restates the generator:
--
--   1. against the ENGINE LEDGER: the values h4_capstone.mjs returned through
--      the vendored engines/hse/consequence.js when this file was generated, to
--      the last bit, so a capstone row an earlier seed left behind, or a move of
--      one part in 1e7, is refused by name;
--   2. by a SECOND ROUTE IN SQL over the inputs the learner is handed: the
--      go-live first proves each shipped prompt is the rendered one byte for
--      byte and carries every input fragment, then recomputes every closed-form
--      field from the published equations (outflow, the pool, the reflected
--      plume, the solid flame chain term by term, Kinney and Graham, and the
--      four probits through the Abramowitz and Stegun erf the engine uses), and
--      asserts the two roots BY THE EQUATION THEY ARE A ROOT OF;
--   3. by the TRAPS the course is built on, {NTRAPS} wrong methods the
--      discriminate sweep computed through the engine, each of which must miss
--      the seeded value by more than the field's tolerance.
--
-- THE GRADER IS NUMERIC. academy_submit_capstone casts expected, tol and the
-- answer to numeric and passes abs(answer - expected) <= tol. The view factor is
-- graded at twelve decimals (tolerance 5e-13), every other field at six (5e-7).
-- Every field must carry a positive, non-whole expected value at its class's
-- tolerance with a label and a unit, the answer the prompt asks for must pass,
-- and one unit either side of it in the last asked decimal must fail.
--
-- EVERY DENOMINATOR BELOW IS A FLOAT, ON PURPOSE. Postgres divides integer by
-- integer as an integer, and the generator refuses to emit a bare integer
-- denominator.
--
-- EVERY REFUSAL THAT READS A GRADED VALUE NAMES IT as tier/key.
-- ============================================================================"""

K12 = [k for k in KEYS if DP[k] == 12]
K6 = [k for k in KEYS if DP[k] == 6]


def inlist(keys):
    return '(' + ', '.join(lit(k) for k in keys) + ')'


BODY = []
A = BODY.append
A('do $$')
A('declare')
A('  v_structures int; v_questions int; v_capstones int; v_lessons int;')
A('  v_modules int; v_graded int; v_available int; v_soon int; v_n int; v_k int;')
A('  v_names text; v_prompt text; v_x double precision; v_wrong double precision;')
for k in KEYS:
    A(f'  {V[k]} double precision;')
A('begin')

A(f'''
  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures
   where app_slug = '{SLUG}' and active;
  if v_structures <> 3 then
    raise exception 'H4 go-live refused: {SLUG} has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions from public.academy_quiz_questions where app_slug = '{SLUG}';
  if v_questions <> 396 then
    raise exception 'H4 go-live refused: {SLUG} has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_n from (
    select tier from public.academy_quiz_questions where app_slug = '{SLUG}'
     group by tier having count(*) <> 132) t;
  if v_n <> 0 then
    raise exception 'H4 go-live refused: % tier(s) do not carry exactly 132 questions', v_n;
  end if;

  select count(*) into v_n from (
    select tier, module_key from public.academy_quiz_questions
     where app_slug = '{SLUG}' and scope = 'module'
     group by tier, module_key having count(*) <> 15) t;
  if v_n <> 0 then
    raise exception 'H4 go-live refused: % module bank(s) do not carry exactly 15 questions', v_n;
  end if;

  select count(*) into v_n from (
    select tier from public.academy_quiz_questions
     where app_slug = '{SLUG}' and scope = 'final'
     group by tier having count(*) <> 42) t;
  if v_n <> 0 then
    raise exception 'H4 go-live refused: % final exam(s) do not carry exactly 42 questions', v_n;
  end if;

  -- A key outside its own options is unanswerable, and a count of rows cannot
  -- see it.
  select count(*) into v_n from public.academy_quiz_questions
   where app_slug = '{SLUG}'
     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);
  if v_n <> 0 then
    raise exception 'H4 go-live refused: % question(s) do not offer four options with a key inside them', v_n;
  end if;

  select count(*) into v_lessons
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m,
         lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = '{SLUG}' and s.active;
  if v_lessons <> 78 then
    raise exception 'H4 go-live refused: {SLUG} carries % lesson keys, expected 78', v_lessons;
  end if;

  select count(*) into v_modules
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = '{SLUG}' and s.active;
  if v_modules <> 18 then
    raise exception 'H4 go-live refused: {SLUG} carries % modules, expected 18 (six per tier)', v_modules;
  end if;

  select count(*) into v_n from (
    select distinct qq.tier, qq.module_key from public.academy_quiz_questions qq
     where qq.app_slug = '{SLUG}' and qq.scope = 'module'
       and not exists (
         select 1 from public.academy_course_structures s,
              lateral jsonb_array_elements(s.structure->'modules') m
          where s.app_slug = qq.app_slug and s.tier = qq.tier and s.active
            and m->>'key' = qq.module_key)) t;
  if v_n <> 0 then
    raise exception 'H4 go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_n;
  end if;

  select count(*) into v_capstones from public.academy_capstones where app_slug = '{SLUG}';
  if v_capstones <> 3 then
    raise exception 'H4 go-live refused: {SLUG} has % capstones, expected 3', v_capstones;
  end if;

  select count(*) into v_graded from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f where c.app_slug = '{SLUG}';
  if v_graded <> 18 then
    raise exception 'H4 go-live refused: {SLUG} has % graded capstone fields, expected 18', v_graded;
  end if;

  select count(*) into v_n from (
    select c.tier from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug = '{SLUG}' group by c.tier having count(*) <> 6) t;
  if v_n <> 0 then
    raise exception 'H4 go-live refused: % tier(s) do not grade exactly six fields', v_n;
  end if;

  if not exists (select 1 from public.academy_apps
                  where slug = '{SLUG}' and module = '{MODULE}'
                    and path_order = {PATH_ORDER} and prereq_slug is null) then
    raise exception 'H4 go-live refused: the {SLUG} catalogue row is not {MODULE} at path_order {PATH_ORDER} with no prerequisite';
  end if;

  if exists (select 1 from public.academy_apps where path_order = {PATH_ORDER} and slug <> '{SLUG}') then
    raise exception 'H4 go-live refused: another course already holds path_order {PATH_ORDER}';
  end if;

  -- ------------------------------------------------- the grader is numeric
  -- Every field a positive, non-whole number at its class's tolerance (twelve
  -- decimals at 5e-13, six at 5e-7), with a label and a unit.
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = '{SLUG}'
     and (jsonb_typeof(f->'expected') <> 'number' or jsonb_typeof(f->'tol') <> 'number'
          or (f->>'expected')::numeric <= 0
          or (f->>'expected')::numeric = round((f->>'expected')::numeric)
          or (f->>'tol')::numeric <> case when f->>'key' in {inlist(K6)} then 0.0000005 else 0.0000000000005 end
          or (f->>'key') not in {inlist(KEYS)}
          or coalesce(f->>'label', '') = '' or coalesce(f->>'unit', '') = '');
  if v_n <> 0 then
    raise exception 'H4 go-live refused: % graded field(s) are not a positive non-whole number at their class tolerance with a label and a unit: %', v_n, v_names;
  end if;

  -- THE GRADER, SIMULATED ON THE SEEDED ROW. The answer the prompt asks for,
  -- the expected value to its class's decimals, must pass
  -- abs(answer - expected) <= tol in numeric exactly as academy_submit_capstone
  -- computes it, and one unit in the last decimal either side of it must fail.
  select count(*), string_agg(t.tier || '/' || t.k, ', ')
    into v_n, v_names
    from (select c.tier, f->>'key' k, (f->>'expected')::numeric e, (f->>'tol')::numeric tl,
                 case when f->>'key' in {inlist(K6)} then 6 else 12 end dp
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = '{SLUG}') t
   where abs(round(t.e, t.dp) - t.e) > t.tl
      or abs(round(t.e, t.dp) + power(10::numeric, -t.dp) - t.e) <= t.tl
      or abs(round(t.e, t.dp) - power(10::numeric, -t.dp) - t.e) <= t.tl;
  if v_n <> 0 then
    raise exception 'H4 go-live refused: % graded field(s) either fail the answer the prompt asks for or pass one a unit off in its last decimal: %', v_n, v_names;
  end if;
''')

# ------------------------------------------------------------ the prompts
PROMPT_BLOCKS = []
for tier in GC.TIERS:
    md5 = hashlib.md5(GC.PROMPTS[tier].encode('utf-8')).hexdigest()
    frs = GC.FRAG[tier]
    for fr in frs:
        if fr not in GC.PROMPTS[tier]:
            refused.append(f'{tier}: a fragment is not in the rendered prompt')
    arr = ', '.join(lit(x) for x in frs)
    PROMPT_BLOCKS.append(f'''
  -- {tier}: the rendered prompt, byte for byte, and the dataset and title.
  select prompt into v_prompt from public.academy_capstones where app_slug = '{SLUG}' and tier = '{tier}';
  if md5(v_prompt) <> '{md5}' then
    raise exception 'H4 go-live refused: the {tier} prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = '{SLUG}' and tier = '{tier}'
                    and cert_tier = {lit(GC.TIER[tier][0])} and dataset = {lit(GC.TIER[tier][1])} and title = {lit(GC.TIER[tier][2])}) then
    raise exception 'H4 go-live refused: the {tier} capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  -- Every input fragment the second route reads is stated, matched as a
  -- literal substring with strpos (an underscore or a percent sign in a LIKE
  -- pattern is a wildcard).
  select count(*) into v_n from unnest(array[{arr}]) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'H4 go-live refused: % {tier} input fragment(s) the second route reads are not stated in the shipped prompt', v_n;
  end if;''')
A('\n  -- ---------------------------------------- the prompts the learner reads')
for b in PROMPT_BLOCKS:
    A(b)

# ------------------------------------------------ load the eighteen values
A('\n  -- --------------------------------------- the eighteen graded values')
for k in KEYS:
    A(f"""  select (f->>'expected')::double precision into {V[k]}
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = '{SLUG}' and c.tier = '{TIER_OF[k]}' and f->>'key' = '{k}';""")
A('  if ' + '\n     or '.join(f'{V[k]} is null' for k in KEYS) + ' then')
A(f"    raise exception 'H4 go-live refused: one or more of the eighteen graded fields is missing{name(*KEYS)}';")
A('  end if;')

DIGEST_NUMS = GC.DIGEST_NUMS
PROMPT_NUMS = sum(len(GC.NUM.findall(GC.PROMPTS[t].replace(',', ''))) for t in GC.TIERS)
NUMRE = '([0-9]+(\\.[0-9]+)?(e-[0-9]+)?)'
A(f'''
  -- ---------------------------------------------------- the collision sweeps
  -- PROMPTLEAK, IN SQL. No number in any prompt, dataset, title or label of
  -- this course, exponent spellings read as the numbers they are, lands within
  -- a graded field's tolerance of a graded value of ANY tier. A different tier
  -- is a leak and the same tier a transcription; both are refused.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key') || ' in the ' || p.tier || ' capstone text', ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         public.academy_capstones p,
         lateral regexp_matches(
           replace(p.prompt || ' ' || p.dataset || ' ' || p.title || ' '
                   || (select string_agg((pf->>'label') || ' ' || (pf->>'unit'), ' ') from jsonb_array_elements(p.fields) pf),
                   ',', ''),
           '{NUMRE}', 'g') as m
   where c.app_slug = '{SLUG}' and p.app_slug = '{SLUG}'
     and abs((f->>'expected')::double precision - (m[1])::double precision) <= (f->>'tol')::double precision;
  if v_n <> 0 then
    raise exception 'H4 go-live refused: % graded field(s) are stated in capstone text a learner reads: %', v_n, v_names;
  end if;

  -- The sweep must have read something: the three prompts hand a learner
  -- {PROMPT_NUMS} numbers between them.
  select count(*) into v_n
    from public.academy_capstones p, lateral regexp_matches(replace(p.prompt, ',', ''), '{NUMRE}', 'g') m
   where p.app_slug = '{SLUG}';
  if v_n < {PROMPT_NUMS} then
    raise exception 'H4 go-live refused: the prompt sweep read only % numbers, so it is reading the wrong thing', v_n;
  end if;

  -- PAIRWISE. Two graded answers within the looser of their two tolerances
  -- cannot be told apart by a grader, so one of them grades nothing.
  select count(*), string_agg(a.tier || '/' || a.k || ' and ' || b.tier || '/' || b.k, ', ')
    into v_n, v_names
    from (select c.tier, f->>'key' k, (f->>'expected')::double precision e, (f->>'tol')::double precision t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = '{SLUG}') a,
         (select c.tier, f->>'key' k, (f->>'expected')::double precision e, (f->>'tol')::double precision t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = '{SLUG}') b
   where (a.tier, a.k) < (b.tier, b.k)
     and abs(a.e - b.e) <= greatest(a.t, b.t);
  if v_n <> 0 then
    raise exception 'H4 go-live refused: % pair(s) of graded fields are within the looser of their two tolerances: %', v_n, v_names;
  end if;

  -- EVERY NUMBER THE TEACHING DIGEST PRINTS ({len(DIGEST_NUMS)} of them), at each
  -- field's SHIPPED tolerance. A graded value on one of them is a lookup.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array[{', '.join(repr(float(d)) for d in DIGEST_NUMS)}]::double precision[]) pub
   where c.app_slug = '{SLUG}'
     and abs((f->>'expected')::double precision - pub) <= (f->>'tol')::double precision;
  if v_n <> 0 then
    raise exception 'H4 go-live refused: % graded field(s) sit within their own tolerance of a value the digest publishes: %', v_n, v_names;
  end if;
''')

# ------------------------------------------------------- 1. the engine ledger
A('\n  -- ------------------------------------------ 1. against the engine ledger')
A('  -- The values h4_capstone.mjs returned through the vendored engine, to the')
A('  -- last bit. A seeded value that is not the engine\'s is refused by name.')
for k in KEYS:
    A(f'''  if {V[k]} <> {f17(ENGINE[k])} then
    raise exception 'H4 go-live refused: the seeded value % is not the {ENGINE[k]!r} the engine returned{name(k)}', {V[k]};
  end if;''')


# ------------------------------------------------ 2. the second route in SQL
ROUTE_SQL = []
for k in KEYS:
    if k in ROUTE:
        ROUTE_SQL.append(f"""  v_x := {ROUTE[k].s};
  if abs(v_x - {V[k]}) > {EPS!r} * abs({V[k]}) then
    raise exception 'H4 go-live refused: {WHAT[k].replace("'", "''")} gives % in SQL, against the seeded %{name(k)}', v_x, {V[k]};
  end if;""")
k_far = 'okan_plume_far_distance_m'
k_bd = 'pennington_blast_distance_for_overpressure_m'
ROUTE_SQL.append(f"""  -- THE TWO ROOTS, by the equation each is a root of.
  v_x := {reach_at(sv(V[k_far])).s};
  if abs(v_x - {f17(Q_['targetConcentrationMgM3'])}) > {EPS_ROOT!r} * {f17(Q_['targetConcentrationMgM3'])} then
    raise exception 'H4 go-live refused: the night plume at the seeded far distance % m gives % mg/m3, off its stated target{name(k_far)}', {V[k_far]}, v_x;
  end if;
  v_x := {reach_at(sv(V[k_far] + ' * 1.001::double precision')).s};
  if not (v_x < {f17(Q_['targetConcentrationMgM3'])}) then
    raise exception 'H4 go-live refused: the plume is not falling at the seeded distance %, so it is not the far root{name(k_far)}', {V[k_far]};
  end if;
  v_x := {(kg_ratio(sv(V[k_bd]) / fn('cbrt', W_)) * ATM).s};
  if abs(v_x - {f17(PE['targetOverpressurePa'])}) > {EPS_ROOT!r} * {f17(PE['targetOverpressurePa'])} then
    raise exception 'H4 go-live refused: Kinney and Graham at the seeded distance % m gives % Pa, off the stated overpressure{name(k_bd)}', {V[k_bd]}, v_x;
  end if;
  -- The tier's points, on these inputs: the riser is choked and the vent is
  -- subsonic through the same hole.
  if not ({(ATM / L(R_['upstreamPressurePa'])).s} <= {crit(R_).s} and {(ATM / L(V_['upstreamPressurePa'])).s} > {crit(V_).s}) then
    raise exception 'H4 go-live refused: the riser is not choked and the vent subsonic{name('okan_gas_riser_choked_mass_rate_kg_s', 'okan_vent_subsonic_mass_rate_kg_s')}';
  end if;""")
A('\n  -- ----------------------------------------------- 2. the second route in SQL')
for b in ROUTE_SQL:
    A(b)

# ------------------------------------------------------ 3. the traps bite
A('\n  -- ------------------------------------------------- 3. the traps bite')
A('  -- Each wrong reading the discriminate sweep computed through the engine must')
A('  -- MISS the seeded graded value by more than its tolerance, or the field does')
A('  -- not discriminate the trap it is for.')
for (k, why), v in sorted(TRAPVAL.items()):
    wv = "'NaN'::double precision" if math.isnan(v) else f17(v)
    A(f"""  v_wrong := {wv};
  if v_wrong <> 'NaN'::double precision and abs(v_wrong - {V[k]}) <= {TOL[k]!r} then
    raise exception 'H4 go-live refused: the {why} gives %, within the tolerance of the seeded %, so the field does not discriminate the trap{name(k)}', v_wrong, {V[k]};
  end if;""")
A(f'''
  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = '{SLUG}';
  if not exists (select 1 from public.academy_apps where slug = '{SLUG}' and status = 'available') then
    raise exception 'H4 go-live refused: {SLUG} did not reach status available';
  end if;

  select count(*) filter (where status = 'available'), count(*) filter (where status = 'coming_soon')
    into v_available, v_soon
    from public.academy_apps;

  raise notice 'H4 go-live: {SLUG} available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
    v_lessons, v_questions, v_capstones, v_graded, v_available, v_soon;
end $$;''')

SQL = HEADER + '\n\n' + '\n'.join(BODY) + '\n'

# ----------------------------------------------------------- self checks
named = set()
for m in re.finditer(r'\[graded field: ([^\]]*)\]', SQL):
    named.update(x.strip() for x in m.group(1).split(','))
unnamed = [f'{TIER_OF[k]}/{k} is graded and no refusal names it' for k in KEYS
           if f'{TIER_OF[k]}/{k}' not in named]
# Every refusal whose GUARD or MESSAGE reads a graded variable must name it.
prev = SQL.find('\nbegin\n')
for m in re.finditer(r"raise exception '((?:[^']|'')*)'([^;]*);", SQL):
    scope = SQL[prev:m.end()]
    prev = m.end()
    reads = set(re.findall(r'\bv_g_(\w+)\b', scope))
    for r in reads:
        if f'/{r}' not in m.group(1):
            unnamed.append(f'a refusal reads {r} and does not name it: {m.group(1)[:70]}')
code = '\n'.join(l.split('--', 1)[0] if not l.lstrip().startswith('--') else '' for l in SQL.splitlines())
intdiv = [l.strip()[:120] for l in code.splitlines() if re.search(r'/\s*\d+(?![\d.eE])', l)]
unclosed = code.replace("''", '').count("'") % 2
dashes = len(re.findall('[–—]', SQL))

if __name__ == '__main__':
    if refused or unnamed or intdiv or unclosed or dashes:
        print('REFUSED, nothing written:')
        for b in refused + unnamed + intdiv:
            print('  ', b)
        print('unclosed literal:', bool(unclosed), '| en/em dashes:', dashes)
        sys.exit(1)
    open(OUT, 'w').write(SQL)
    print(f'wrote {OUT}: {len(SQL.splitlines())} lines')
    print('engine ledger: 18 of 18 graded values emitted as the engine returned them, to the last bit')
    print(f'second route in SQL: 16 closed-form fields and 2 roots | traps that must bite: {NTRAPS} over 18 fields')
    print(f'digest sweep: {len(DIGEST_NUMS)} numbers | graded fields named by a refusal: '
          f'{len(named & {f"{TIER_OF[k]}/{k}" for k in KEYS})} of 18')
    print('integer-division guard: 0 | unclosed literals: 0 | en/em dashes: 0')
    print('every identity the second route asserts, checked here first in Python:')
    for what, diff, eps in checks:
        print(f'  {diff:.3e} <= {eps:.0e}  {what}')
