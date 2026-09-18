#!/usr/bin/env python3
"""Generate the FC5 go-live migration.

Built on the FC6 go-live generator (tools/course-waves/heattransfer/
gen_golive.py): the same shape gates, held-for-literature gates, collision
sweeps, field-naming appender and emission guards, with the eighteen relief
assertions written for this engine.

NOTHING HERE IS RETYPED. The eighteen graded values are read out of the
CAPSTONE ROWS THE LADDER ITSELF SEEDED, by key, inside the same transaction, so
the file verifies what it shipped rather than what a generator remembered. The
numbers a learner is handed are parsed out of the shipped prompts BY POSTGRES,
and the published figures a graded value may not collide with are every numeric
literal the teaching digest prints.

SEVENTEEN OF THE EIGHTEEN ARE REPRODUCED BY EXACT CLOSED FORM from the
conditions the prompts state. The eighteenth is the blowdown time, which the
engine reaches by MARCHING. It is asserted against the exact integral of the
same balance (z held, flow choked, dm/dt proportional to m^((k+1)/2)) at an
epsilon of 5e-5 s, because the march at its stated 0.1 s step sits 3.98e-5 s
from that integral. That is the one field here asserted more loosely than a
one-part-in-1e7 move, and it is said here rather than hidden: the field's
shipped tolerance is 1e-4 for exactly this reason, so a learner who integrates
grades correct.

AND TEN ARE ASSERTED A SECOND TIME, BY ROUTES WITH NOTHING IN COMMON, because a
gate that restates the formula validates nothing:

  * the critical ratio by its DEFINING property, the argmax of the nozzle flux,
    where the derivative of the flux function is zero;
  * C again from the GRADED critical ratio, which links the two fields;
  * the three API 520 areas again as products rather than quotients;
  * the horizontal wetted area again through atan2 of the half chord, which
    shares no arithmetic with the arc cosine;
  * the liquid area fraction again by the r^2 arccos segment formula;
  * the wider drum against the first one by the exact ratio D1/D2, which holds
    because the level fraction is the same;
  * the final temperature against the graded inventory through the gas law and
    the isentropic mass relation together;
  * the intensity and the setback against each other by the inverse square.

WHAT IT REFUSES TO WRITE: a division with a bare integer denominator, a
malformed numeric literal, a refusal that reads a graded value and does not name
it, a graded value that collides at its own shipped tolerance with a handed, a
published or a held number, and an em or en dash.

Usage: python3 gen_golive.py
   FC5_WAVE        the wave directory (default /root/fc-wip-relief)
   FC5_REPO        the nextgen clone   (default /root/wt-fc5-nextgen)
   FC5_COURSE_SQL  the course migration this ladder emits, for the prompt sweep
   FC5_GOLIVE_OUT  where to write
"""
import json
import math
import os
import re
import sys

W = os.environ.get('FC5_WAVE', '/root/fc-wip-relief')
REPO = os.environ.get('FC5_REPO', '/root/wt-fc5-nextgen')
COURSE = os.environ.get(
    'FC5_COURSE_SQL', f'{REPO}/migrations/20260925_fc5_relief_course.sql')
OUT = os.environ.get(
    'FC5_GOLIVE_OUT', f'{REPO}/migrations/20260925_fc5_relief_go_live.sql')
SLUG = 'relief'

fields = json.load(open(f'{W}/fields.json'))
assert len(fields) == 18, f'{len(fields)} graded fields'
F = {(t, k): (v, tol) for t, k, v, tol in fields}
assert len({k for _t, k, _v, _tol in fields}) == 18, 'two graded fields share a key'
V = {(t, k): f'v_g_{k}' for t, k, _v, _tol in fields}
assert len(set(V.values())) == 18, 'two graded fields would share one SQL variable'


def f17(x):
    """A float literal SQL will read back as this exact double."""
    return repr(float(x))


def g(t, k):
    return F[(t, k)][0]


# --------------------------------------------------------------- the inputs
# Every one of these is stated in a capstone prompt, once, here.
ATM = 14.7
RANKINE = 459.67
OVER = 1.1                      # 10 percent overpressure on the set pressure

KC_W, KC_SET, KC_BACK, KC_BACK_SUB = 37500.0, 385.0, 55.0, 330.0
KC_TF, KC_MW, KC_Z, KC_K = 165.0, 23.5, 0.89, 1.31
KC_KD, KC_KB, KC_KC = 0.975, 1.0, 1.0
KL_Q, KL_SET, KL_BACK, KL_SG = 640.0, 295.0, 65.0, 0.79
KL_KD, KL_KW, KL_KC = 0.65, 1.0, 1.0
KS_W, KS_SET = 78000.0, 585.0
KS_KD, KS_KB, KS_KC, KS_KSH = 0.975, 1.0, 1.0, 1.0

OG_D, OG_L, OG_H = 9.5, 37.0, 3.4
OT_D, OT_L, OT_H = 7.2, 32.0, 14.5
DR_Q, DR_UD, DR_D, DR_F = 168.0, 2.05, 8.5, 0.35
DR_D2 = 10.5
WETTED_LIMIT_FT = 25.0

GB_V, GB_P0, GB_T0, GB_PE = 640.0, 1185.0, 555.0, 165.0
GB_MW, GB_K, GB_Z = 21.5, 1.26, 0.87
GB_R = 1545.349
GB_D, GB_CD, GB_PB = 1.375, 0.84, 16.5
FL_Q, FL_R, FL_F, FL_TAU, FL_ALLOW = 742000.0, 118.0, 0.27, 0.91, 5.25

# THE ENGINE'S OWN USC CONSTANTS, each a published route constant the course
# teaches and the oracle derives. Written once.
C_USC, SUB_USC, LIQ_USC, STEAM_USC = 520.0, 735.0, 38.0, 51.5
BLOWDOWN_EPS = 5e-05

# THE QUANTITIES THIS MODULE DOES NOT DERIVE, with the label each is refused
# under: held for literature, typed from a published table, or a stated limit.
HELD = [
    (0.9935, 'the Kv fit leading coefficient, held for literature'),
    (2.878, 'the Kv fit second coefficient, held for literature'),
    (342.75, 'the Kv fit third coefficient, held for literature'),
    (1.5, 'the Kv fit exponent, held for literature'),
    (24.0, 'the sphere-drag 24/Re term, held for literature'),
    (3.0, 'the sphere-drag 3/sqrt(Re) term, held for literature'),
    (0.34, 'the sphere-drag constant, held for literature'),
    (240.0, 'the sphere-drag low-Reynolds cap, held for literature'),
    (1500.0, 'the Napier threshold, held for literature'),
    (3200.0, 'the top of the published Napier range, held for literature'),
    (21000.0, 'the pool fire constant with drainage, held for literature'),
    (34500.0, 'the pool fire constant without drainage, held for literature'),
    (0.82, 'the pool fire exponent, held for literature'),
    (1.58, 'a customary allowable intensity, held for literature'),
    (4.73, 'a customary allowable intensity, held for literature'),
    (6.31, 'a customary allowable intensity, held for literature'),
    (9.46, 'a customary allowable intensity, held for literature'),
    (1.15, 'the printed settling coefficient, held for literature'),
    (math.sqrt(4.0 / 3.0), 'the exact settling coefficient, held for literature'),
    (25.0, 'the wetted-height limit, a stated limit the caller applies'),
]
for area in (0.11, 0.196, 0.307, 0.503, 0.785, 1.287, 1.838, 2.853, 3.6, 4.34, 6.38, 11.05, 16.0, 26.0):
    HELD.append((area, 'an API 526 orifice area, a typed published table'))
HELD = sorted({(v, lab) for v, lab in HELD})

# THE ENGINE RETURN EACH GRADED FIELD IS.
PRODUCES = {
    'kolocreek_critical_pressure_ratio': 'criticalPressureRatio',
    'kolocreek_gas_coefficient_c': 'gasConstantC',
    'kolocreek_gas_critical_area_in2': 'gasVaporArea.areaIn2 (critical)',
    'kolocreek_gas_subcritical_area_in2': 'gasVaporArea.areaIn2 (subcritical)',
    'kolocreek_liquid_area_in2': 'liquidArea.areaIn2',
    'kolocreek_steam_area_in2': 'steamArea.areaIn2',
    'ogbainbiri_wetted_area_ft2': 'wettedAreaFt2.areaFt2 (horizontal)',
    'ogbainbiri_tower_wetted_area_ft2': 'wettedAreaFt2.areaFt2 (vertical)',
    'ogbainbiri_liquid_area_fraction': 'segmentAreaFraction',
    'ogbainbiri_vapor_velocity_fts': 'koDrumHorizontal.vVaporFtS',
    'ogbainbiri_drum_length_ft': 'koDrumHorizontal.requiredLengthFt',
    'ogbainbiri_drum_length_wider_ft': 'koDrumHorizontal.requiredLengthFt (wider)',
    'gbaran_initial_mass_lb': 'blowdown.initialMassLb',
    'gbaran_blowdown_time_s': 'blowdown.timeS',
    'gbaran_final_temperature_degr': 'blowdown.finalTR',
    'gbaran_choked_floor_psia': 'blowdown.chokedToPsia',
    'gbaran_radiant_intensity_kwm2': 'radiationIntensity.kWm2',
    'gbaran_setback_distance_m': 'distanceForIntensity.distanceM',
}
assert set(PRODUCES) == {k for _t, k, _v, _tol in fields}, 'PRODUCES and fields.json disagree'

# THE KEY FRAGMENTS THAT NAME A PATH THIS MODULE DOES NOT DERIVE. Specific on
# purpose: a bare 'area' would fire on every required area, and 'fraction'
# would fire on the liquid area fraction, which is pure geometry.
FORBIDDEN_KEY_FRAGMENTS = [
    'orifice', 'letter', 'margin', 'duty', 'btu', 'heat_input', 'relief_load',
    'kv_', 'reynolds', 'dropout', 'drag', 'napier', 'kn_', 'ksh', 'kb_', 'kw_',
    'allowable_level', 'customary',
]
FORBIDDEN_LABEL_FRAGMENTS = [
    'orifice letter', 'fire duty', 'heat input', 'relief load', 'viscosity correction',
    'reynolds number', 'dropout velocity', 'drag coefficient', 'napier',
    'superheat factor', 'bellows', 'customary',
]

refused = []
for tier, key, val, tol in fields:
    for frag in FORBIDDEN_KEY_FRAGMENTS:
        if frag in key:
            refused.append(f'{tier}.{key} names an underived path through "{frag}"')
    for h, label in HELD:
        if abs(abs(val) - h) <= tol:
            refused.append(f'{tier}.{key} = {val} is within {tol} of {h} ({label})')
# THE GUARD MUST DISCRIMINATE, both ways.
if not [f for f in FORBIDDEN_KEY_FRAGMENTS if f in 'ogbainbiri_fire_duty_btu_hr']:
    refused.append('the forbidden-key sweep does not catch a planted fire duty key')
if any(f in 'ogbainbiri_liquid_area_fraction' for f in FORBIDDEN_KEY_FRAGMENTS):
    refused.append('the forbidden-key sweep fires on ogbainbiri_liquid_area_fraction, which is pure geometry')

# ---------------------------------------------------------------------------
# THE ARITHMETIC IS CHECKED HERE BEFORE IT IS EMITTED.
# ---------------------------------------------------------------------------
checks = []


def same(what, a, b, eps):
    checks.append((what, abs(a - b), eps))
    if not abs(a - b) <= eps:
        refused.append(f'{what}: {a} against {b}, difference {abs(a - b)} exceeds {eps}')


# Associate, KOLO CREEK.
k = KC_K
ratio = (2.0 / (k + 1.0)) ** (k / (k - 1.0))
same('KOLO CREEK critical ratio', ratio, g('beginner', 'kolocreek_critical_pressure_ratio'), 1e-14)
r_g = g('beginner', 'kolocreek_critical_pressure_ratio')
flux_slope = (2.0 / k) * r_g ** (2.0 / k - 1.0) - ((k + 1.0) / k) * r_g ** (1.0 / k)
checks.append(('KOLO CREEK critical ratio as the ARGMAX of the nozzle flux', abs(flux_slope), 1e-12))
if not abs(flux_slope) <= 1e-12:
    refused.append(f'the critical ratio leaves a flux slope of {flux_slope}')
c = C_USC * math.sqrt(k * (2.0 / (k + 1.0)) ** ((k + 1.0) / (k - 1.0)))
same('KOLO CREEK C', c, g('beginner', 'kolocreek_gas_coefficient_c'), 1e-11)
same('KOLO CREEK C from the GRADED ratio', C_USC * math.sqrt(k * r_g ** ((k + 1.0) / k)),
     g('beginner', 'kolocreek_gas_coefficient_c'), 1e-10)
p1 = KC_SET * OVER + ATM
t_r = KC_TF + RANKINE
if not KC_BACK / p1 <= ratio:
    refused.append('the KOLO CREEK flare header case is not critical')
if not KC_BACK / p1 < 0.3:
    refused.append('the KOLO CREEK flare header case is above the ratio at which a bellows chart is needed')
if not KC_BACK_SUB / p1 > ratio:
    refused.append('the KOLO CREEK pressured header case is not subcritical')
a_crit = KC_W * math.sqrt(t_r * KC_Z / KC_MW) / (c * KC_KD * p1 * KC_KB * KC_KC)
same('KOLO CREEK critical area', a_crit, g('beginner', 'kolocreek_gas_critical_area_in2'), 1e-13)
rr = KC_BACK_SUB / p1
f2 = math.sqrt((k / (k - 1.0)) * rr ** (2.0 / k) * ((1.0 - rr ** ((k - 1.0) / k)) / (1.0 - rr)))
a_sub = (KC_W / (SUB_USC * f2 * KC_KD * KC_KC)) * math.sqrt((t_r * KC_Z) / (KC_MW * p1 * (p1 - KC_BACK_SUB)))
same('KOLO CREEK subcritical area', a_sub, g('beginner', 'kolocreek_gas_subcritical_area_in2'), 1e-13)
dp = KL_SET * OVER - KL_BACK
a_liq = KL_Q * math.sqrt(KL_SG) / (LIQ_USC * KL_KD * KL_KW * KL_KC * 1.0 * math.sqrt(dp))
same('KOLO CREEK liquid area', a_liq, g('beginner', 'kolocreek_liquid_area_in2'), 1e-13)
p1s = KS_SET * OVER + ATM
if not p1s <= 1500.0:
    refused.append('the KOLO CREEK steam case reaches the Napier threshold')
a_st = KS_W / (STEAM_USC * p1s * KS_KD * KS_KB * KS_KC * 1.0 * KS_KSH)
same('KOLO CREEK steam area', a_st, g('beginner', 'kolocreek_steam_area_in2'), 1e-13)

# Professional, OGBAINBIRI.
r = OG_D / 2.0
theta = 2.0 * math.acos((r - OG_H) / r)
same('OGBAINBIRI horizontal wetted area', r * theta * OG_L, g('intermediate', 'ogbainbiri_wetted_area_ft2'), 1e-10)
same('OGBAINBIRI horizontal wetted area through atan2 of the half chord',
     2.0 * r * OG_L * math.atan2(math.sqrt(OG_H * (2.0 * r - OG_H)), r - OG_H),
     g('intermediate', 'ogbainbiri_wetted_area_ft2'), 1e-10)
same('OGBAINBIRI tower wetted area', math.pi * OT_D * min(OT_H, OT_L),
     g('intermediate', 'ogbainbiri_tower_wetted_area_ft2'), 1e-10)
if not (OT_H < WETTED_LIMIT_FT and OG_D < WETTED_LIMIT_FT):
    refused.append('a wetted height reaches the 25 ft limit')
th = 2.0 * math.acos(1.0 - 2.0 * DR_F)
frac = (th - math.sin(th)) / (2.0 * math.pi)
same('OGBAINBIRI liquid area fraction', frac, g('intermediate', 'ogbainbiri_liquid_area_fraction'), 1e-14)
u = 1.0 - 2.0 * DR_F
same('OGBAINBIRI liquid area fraction by the arccos segment formula',
     (math.acos(u) - u * math.sqrt(1.0 - u * u)) / math.pi,
     g('intermediate', 'ogbainbiri_liquid_area_fraction'), 1e-14)
fr_g = g('intermediate', 'ogbainbiri_liquid_area_fraction')
v = DR_Q / ((math.pi * DR_D * DR_D / 4.0) * (1.0 - fr_g))
same('OGBAINBIRI vapour velocity', v, g('intermediate', 'ogbainbiri_vapor_velocity_fts'), 1e-13)
length = g('intermediate', 'ogbainbiri_vapor_velocity_fts') * (DR_D * (1.0 - DR_F)) / DR_UD
same('OGBAINBIRI drum length', length, g('intermediate', 'ogbainbiri_drum_length_ft'), 1e-12)
v2 = DR_Q / ((math.pi * DR_D2 * DR_D2 / 4.0) * (1.0 - fr_g))
same('OGBAINBIRI wider drum length', v2 * (DR_D2 * (1.0 - DR_F)) / DR_UD,
     g('intermediate', 'ogbainbiri_drum_length_wider_ft'), 1e-12)
same('OGBAINBIRI wider drum against the first by the exact ratio D1/D2',
     g('intermediate', 'ogbainbiri_drum_length_wider_ft') / g('intermediate', 'ogbainbiri_drum_length_ft'),
     DR_D / DR_D2, 1e-14)

# Expert, GBARAN.
rgas = GB_R / GB_MW
m0 = GB_P0 * 144.0 * GB_V / (GB_Z * rgas * GB_T0)
same('GBARAN inventory', m0, g('advanced', 'gbaran_initial_mass_lb'), 1e-10)
same('GBARAN inventory back through the gas law to the start pressure',
     g('advanced', 'gbaran_initial_mass_lb') * GB_Z * rgas * GB_T0 / (144.0 * GB_V), GB_P0, 1e-10)
kk = GB_K
c_gb = C_USC * math.sqrt(kk * (2.0 / (kk + 1.0)) ** ((kk + 1.0) / (kk - 1.0)))
a_or = GB_CD * (math.pi / 4.0) * (GB_D / 12.0) ** 2 * 144.0
coef = (c_gb * a_or * math.sqrt(GB_MW / GB_Z) / 3600.0) * (GB_Z * rgas / (144.0 * GB_V)) \
    * math.sqrt(GB_T0) * m0 ** (-(kk - 1.0) / 2.0)
n = (kk + 1.0) / 2.0
m_end = m0 * (GB_PE / GB_P0) ** (1.0 / kk)
t_exact = (m_end ** (1.0 - n) - m0 ** (1.0 - n)) / (coef * (n - 1.0))
same('GBARAN blowdown time against the exact integral of the same balance',
     t_exact, g('advanced', 'gbaran_blowdown_time_s'), BLOWDOWN_EPS)
t_end = GB_T0 * (GB_PE / GB_P0) ** ((kk - 1.0) / kk)
same('GBARAN final temperature', t_end, g('advanced', 'gbaran_final_temperature_degr'), 1e-9)
m_end_gas = GB_PE * 144.0 * GB_V / (GB_Z * rgas * g('advanced', 'gbaran_final_temperature_degr'))
same('GBARAN final temperature by the gas law and the isentropic mass relation',
     m_end_gas / g('advanced', 'gbaran_initial_mass_lb'),
     (g('advanced', 'gbaran_final_temperature_degr') / GB_T0) ** (1.0 / (kk - 1.0)), 1e-12)
gb_ratio = (2.0 / (kk + 1.0)) ** (kk / (kk - 1.0))
same('GBARAN choked floor', GB_PB / gb_ratio, g('advanced', 'gbaran_choked_floor_psia'), 1e-11)
if not GB_PE > 3.0 * g('advanced', 'gbaran_choked_floor_psia'):
    refused.append('the GBARAN end pressure is not three times the choked floor')
kint = FL_TAU * FL_F * FL_Q / (4.0 * math.pi * FL_R ** 2)
same('GBARAN radiant intensity', kint, g('advanced', 'gbaran_radiant_intensity_kwm2'), 1e-13)
same('GBARAN setback', math.sqrt(FL_TAU * FL_F * FL_Q / (4.0 * math.pi * FL_ALLOW)),
     g('advanced', 'gbaran_setback_distance_m'), 1e-11)
same('GBARAN intensity and setback against each other by the inverse square',
     g('advanced', 'gbaran_radiant_intensity_kwm2') * FL_R ** 2,
     FL_ALLOW * g('advanced', 'gbaran_setback_distance_m') ** 2, 1e-8)
if FL_ALLOW in (1.58, 4.73, 6.31, 9.46):
    refused.append('the GBARAN project allowable is one of the four customary values')

FC5_HEADER = """-- ============================================================================
-- FC5 GO-LIVE (HELD): Relief & Flare Systems flips to 'available'. The FIFTH
-- Facilities course, at path_order 43, above FC4 gasprocessing at 42, FC3
-- rotating at 41, FC2 linesizing at 40 and FC1 separation at 39, and below FC6
-- heattransfer at 44.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/relief. The 78 lessons, the teaching lab (reliefLab.js)
-- and its three explorer panels (the sizing, the fire and drum, and the
-- blowdown) ship in the ZIP and NOT in this database, so a flip before the
-- upload puts a live catalogue tile in front of a route that does not exist.
-- Every Facilities wave on this programme holds its go-live behind one verified
-- upload, and this file is written, dry-run and left unapplied on purpose.
--
-- EVERY DENOMINATOR BELOW IS A FLOAT, ON PURPOSE. Postgres divides integer by
-- integer as an integer, and the generator that wrote this file refuses to emit
-- a division with a bare integer denominator or a malformed numeric literal.
--
-- SEVENTEEN OF THE EIGHTEEN GRADED VALUES ARE REPRODUCED BY EXACT CLOSED FORM
-- from the conditions the prompts state. The eighteenth is the blowdown time,
-- which the engine MARCHES at a 0.1 s step. It is asserted against the exact
-- integral of the same balance at 5e-5 s, because the march sits 3.98e-5 s from
-- it. That is the one assertion here looser than a one-part-in-1e7 move, and
-- the field's shipped tolerance of 1e-4 is set so that both routes grade
-- correct.
--
-- AND TEN ARE ASSERTED A SECOND TIME, BY ROUTES WITH NOTHING IN COMMON: the
-- critical ratio as the argmax of the nozzle flux; C from the graded ratio; the
-- three API 520 areas as products; the horizontal wetted area through the half
-- chord; the liquid area fraction by the arccos segment formula; the wider drum
-- against the first by the exact diameter ratio; the end temperature against
-- the graded inventory through the gas law; and the intensity against the
-- setback by the inverse square.
--
-- EVERY REFUSAL NAMES THE GRADED FIELD IT READ, condition included and not only
-- message, so a reader of a refusal sees both halves of a disagreeing pair.
-- ============================================================================"""

# EVERY NUMBER THE DIGEST PRINTS, emitted into the SQL so the DATABASE runs the
# sweep rather than a generator promising it did.
NUM = re.compile(r'-?\d+\.?\d*')
published = set()
for tok in NUM.findall(open(f'{W}/digest.txt', encoding='utf-8').read()):
    try:
        published.add(abs(float(tok)))
    except ValueError:
        pass
for tier, key, val, tol in fields:
    for d in published:
        if abs(abs(val) - d) <= tol:
            refused.append(f'{tier}.{key} = {val} is within {tol} of {d}, which the digest prints')
# And every number a learner is handed, read out of the COURSE MIGRATION this
# ladder emits rather than out of a copy of the prompts.
# THE COMMENT HALF IS DROPPED FIRST. A header comment carrying an apostrophe,
# and this ladder's headers carry several, throws the quote pairing off for the
# whole rest of the file, and the sweep then reads nothing at all while
# reporting no collisions. That is the shape of a gate that passes because it is
# blind, so the count of what was parsed is asserted below rather than assumed.
course_sql = '\n'.join(
    l for l in open(COURSE, encoding='utf-8').read().splitlines()
    if not l.lstrip().startswith('--'))
handed = set()
for m in re.finditer(r"'((?:[^']|'')*)'", course_sql):
    if 'Report six values' in m.group(1):
        for tok in NUM.findall(m.group(1)):
            try:
                handed.add(abs(float(tok)))
            except ValueError:
                pass
if len(handed) < 20:
    refused.append(f'only {len(handed)} numbers were parsed out of the shipped prompts, '
                   'so the handed-value sweep is reading the wrong thing')
for tier, key, val, tol in fields:
    for h in handed:
        if abs(abs(val) - h) <= tol:
            refused.append(f'{tier}.{key} = {val} is within {tol} of {h}, handed in a prompt')


# ---------------------------------------------------------------------------
# THE SQL
# ---------------------------------------------------------------------------
HEADER = FC5_HEADER

body = []
A = body.append

A('do $$')
A('declare')
A('  v_structures int; v_questions int; v_capstones int; v_lessons int;')
A('  v_modules int; v_graded int; v_available int; v_soon int;')
A('  v_names text;')
A('  v_k double precision; v_x double precision; v_u double precision; v_n double precision;')
A('  v_p1 double precision; v_t double precision; v_r double precision; v_f2 double precision;')
A('  v_dp double precision; v_rgas double precision; v_c double precision; v_a double precision;')
for (t, k) in V:
    A(f'  {V[(t, k)]} double precision;')
A('begin')

A('''
  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures
   where app_slug = '{SLUG}' and active;
  if v_structures <> 3 then
    raise exception 'FC5 go-live refused: {SLUG} has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions from public.academy_quiz_questions where app_slug = '{SLUG}';
  if v_questions <> 396 then
    raise exception 'FC5 go-live refused: {SLUG} has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_graded from (
    select tier from public.academy_quiz_questions where app_slug = '{SLUG}'
     group by tier having count(*) <> 132) t;
  if v_graded <> 0 then
    raise exception 'FC5 go-live refused: % tier(s) do not carry exactly 132 questions', v_graded;
  end if;

  select count(*) into v_graded from (
    select tier, module_key from public.academy_quiz_questions
     where app_slug = '{SLUG}' and scope = 'module'
     group by tier, module_key having count(*) <> 15) t;
  if v_graded <> 0 then
    raise exception 'FC5 go-live refused: % module bank(s) do not carry exactly 15 questions', v_graded;
  end if;

  select count(*) into v_graded from (
    select tier from public.academy_quiz_questions
     where app_slug = '{SLUG}' and scope = 'final'
     group by tier having count(*) <> 42) t;
  if v_graded <> 0 then
    raise exception 'FC5 go-live refused: % final exam(s) do not carry exactly 42 questions', v_graded;
  end if;

  -- A question whose key is outside its own options is unanswerable, and it is
  -- the one shape a count of rows can never see.
  select count(*) into v_graded from public.academy_quiz_questions
   where app_slug = '{SLUG}'
     and (jsonb_array_length(options) <> 4
          or answer_index < 0 or answer_index > 3);
  if v_graded <> 0 then
    raise exception 'FC5 go-live refused: % question(s) do not offer four options with a key inside them', v_graded;
  end if;

  select count(*) into v_capstones from public.academy_capstones where app_slug = '{SLUG}';
  if v_capstones <> 3 then
    raise exception 'FC5 go-live refused: {SLUG} has % capstones, expected 3', v_capstones;
  end if;

  select count(*) into v_lessons
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m,
         lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = '{SLUG}' and s.active;
  if v_lessons <> 78 then
    raise exception 'FC5 go-live refused: {SLUG} carries % lesson keys, expected 78', v_lessons;
  end if;

  select count(*) into v_modules
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = '{SLUG}' and s.active;
  if v_modules <> 18 then
    raise exception 'FC5 go-live refused: {SLUG} carries % modules, expected 18 (six per tier)', v_modules;
  end if;

  -- A module bank keyed to a module the structure does not declare is a bank
  -- no learner will ever be served.
  select count(*) into v_graded from (
    select distinct qq.tier, qq.module_key from public.academy_quiz_questions qq
     where qq.app_slug = '{SLUG}' and qq.scope = 'module'
       and not exists (
         select 1 from public.academy_course_structures s,
              lateral jsonb_array_elements(s.structure->'modules') m
          where s.app_slug = qq.app_slug and s.tier = qq.tier and s.active
            and m->>'key' = qq.module_key)) t;
  if v_graded <> 0 then
    raise exception 'FC5 go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_graded;
  end if;

  select count(*) into v_graded from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f where c.app_slug = '{SLUG}';
  if v_graded <> 18 then
    raise exception 'FC5 go-live refused: {SLUG} has % graded capstone fields, expected 18', v_graded;
  end if;

  select count(*) into v_graded from (
    select c.tier from public.academy_capstones c,
           lateral jsonb_array_elements(c.fields) f
     where c.app_slug = '{SLUG}' group by c.tier having count(*) <> 6) t;
  if v_graded <> 0 then
    raise exception 'FC5 go-live refused: % tier(s) do not grade exactly six fields', v_graded;
  end if;

  if not exists (select 1 from public.academy_apps
                  where slug = '{SLUG}' and module = 'facilities'
                    and path_order = 43 and prereq_slug is null) then
    raise exception 'FC5 go-live refused: the {SLUG} catalogue row is not facilities at path_order 43 with no prerequisite';
  end if;

  if exists (select 1 from public.academy_apps
              where path_order = 43 and slug <> '{SLUG}') then
    raise exception 'FC5 go-live refused: another course already holds path_order 43';
  end if;
'''.replace('{SLUG}', SLUG))

HELD_VALUES = ', '.join(f17(v) for v, _l in HELD)
HELD_LABELS = ', '.join("'" + lab.replace("'", "''") + "'" for _v, lab in HELD)
FORBIDDEN_SQL = ', '.join("'" + f + "'" for f in FORBIDDEN_KEY_FRAGMENTS)
FORBIDDEN_LABEL_SQL = ', '.join("'" + f + "'" for f in FORBIDDEN_LABEL_FRAGMENTS)
PUBLISHED_SQL = ', '.join(f17(v) for v in sorted(published))

A(f'''
  -- ------------------------------------------- the held-for-literature gates
  -- ON THE NAME. A graded field that NAMES a quantity this module holds for the
  -- literature is refused before anything is computed from it.
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array[{FORBIDDEN_SQL}]) frag
   where c.app_slug = '{SLUG}' and (f->>'key') like '%' || frag || '%';
  if v_graded <> 0 then
    raise exception 'FC5 go-live refused: % graded field(s) name a quantity held for the literature: %', v_graded, v_names;
  end if;

  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array[{FORBIDDEN_LABEL_SQL}]) frag
   where c.app_slug = '{SLUG}' and lower(f->>'label') like '%' || frag || '%';
  if v_graded <> 0 then
    raise exception 'FC5 go-live refused: % graded field label(s) name a quantity held for the literature: %', v_graded, v_names;
  end if;

  -- ON THE VALUE. A graded answer landing on a held number, within its own
  -- shipped tolerance, is a lookup of a quantity this module refuses to source.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key') || ' on ' || h.lab, ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array[{HELD_VALUES}], array[{HELD_LABELS}]) as h(val, lab)
   where c.app_slug = '{SLUG}'
     and abs(abs((f->>'expected')::double precision) - h.val) <= (f->>'tol')::double precision;
  if v_graded <> 0 then
    raise exception 'FC5 go-live refused: % graded field(s) land on a quantity held for the literature: %', v_graded, v_names;
  end if;

  -- ---------------------------------------------------- the collision sweeps
  -- EVERY NUMBER THE TEACHING DIGEST PRINTS. A graded field within its own
  -- tolerance of one of them is a lookup rather than a calculation, and the
  -- tolerance used is the SHIPPED one, which for five of the eighteen is raised
  -- to half a unit of the printed class and for the blowdown time is 1e-4.
  -- Sweeping at the stated tolerance would pass a collision the shipped grade
  -- would hit.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key'), ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array[{PUBLISHED_SQL}]) pub
   where c.app_slug = '{SLUG}'
     and abs(abs((f->>'expected')::double precision) - pub) <= (f->>'tol')::double precision;
  if v_graded <> 0 then
    raise exception 'FC5 go-live refused: % graded field(s) sit within their own tolerance of a value the digest publishes, which makes them a lookup rather than a calculation: %', v_graded, v_names;
  end if;

  -- EVERY NUMBER A LEARNER IS HANDED, read by POSTGRES out of the shipped
  -- prompt rather than out of a generator's copy of it.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key'), ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         public.academy_capstones p,
         lateral regexp_matches(p.prompt, '[0-9]+\\.?[0-9]*', 'g') as m
   where c.app_slug = '{SLUG}' and p.app_slug = '{SLUG}'
     and abs(abs((f->>'expected')::double precision) - (m[1])::double precision)
         <= (f->>'tol')::double precision;
  if v_graded <> 0 then
    raise exception 'FC5 go-live refused: % graded field(s) land on a number the learner is handed in a prompt, which makes the field a transcription rather than a calculation: %', v_graded, v_names;
  end if;

  -- AND PAIRWISE. Two graded answers within the looser of their two tolerances
  -- cannot be told apart by a grader, so one of them grades nothing.
  select count(*), string_agg(a.tier || '/' || a.k || ' and ' || b.tier || '/' || b.k, ', ')
    into v_graded, v_names
    from (select c.tier, f->>'key' k, (f->>'expected')::double precision e,
                 (f->>'tol')::double precision t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = '{SLUG}') a,
         (select c.tier, f->>'key' k, (f->>'expected')::double precision e,
                 (f->>'tol')::double precision t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = '{SLUG}') b
   where (a.tier, a.k) < (b.tier, b.k)
     and abs(abs(a.e) - abs(b.e)) <= greatest(a.t, b.t);
  if v_graded <> 0 then
    raise exception 'FC5 go-live refused: % pair(s) of graded fields are within the looser of their two tolerances: %', v_graded, v_names;
  end if;

  -- A capstone prompt stating another tier's graded answer hands that tier away.
  select count(*), string_agg(distinct c.tier || ' states ' || gg.owner || '/' || gg.k, ', ')
    into v_graded, v_names from public.academy_capstones c,
         (select f->>'expected' as e, f->>'key' as k, c2.tier as owner
            from public.academy_capstones c2, lateral jsonb_array_elements(c2.fields) f
           where c2.app_slug = '{SLUG}') gg
   where c.app_slug = '{SLUG}' and c.tier <> gg.owner and c.prompt like '%' || gg.e || '%';
  if v_graded <> 0 then
    raise exception 'FC5 go-live refused: % capstone prompt(s) state a graded value belonging to another tier: %', v_graded, v_names;
  end if;
''')

# ------------------------------------------------ load the eighteen values
A('\n  -- --------------------------------------- the eighteen graded values')
for (t, k), var in V.items():
    A(f"""  select (f->>'expected')::double precision into {var}
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = '{SLUG}' and c.tier = '{t}' and f->>'key' = '{k}';""")
A('  if ' + '\n     or '.join(f'{v} is null' for v in V.values()) + ' then')
A("    raise exception 'FC5 go-live refused: one or more of the eighteen graded fields is missing';")
A('  end if;')


def VB(k):
    return V[('beginner', k)]


def VI(k):
    return V[('intermediate', k)]


def VE(k):
    return V[('advanced', k)]



A(f'''
  -- -------------------------------------------- the Associate, KOLO CREEK
  -- The critical ratio off k alone.
  v_k := {f17(KC_K)};
  if abs({VB('kolocreek_critical_pressure_ratio')} - power(2.0 / (v_k + 1.0), v_k / (v_k - 1.0))) > 1e-14 then
    raise exception 'FC5 go-live refused: the critical ratio of % is not (2/(k+1))^(k/(k-1)) at k = %', {VB('kolocreek_critical_pressure_ratio')}, v_k;
  end if;

  -- AND BY ITS DEFINING PROPERTY. The critical ratio is where the nozzle mass
  -- flux peaks, so the slope of r^(2/k) - r^((k+1)/k) is zero there. This is a
  -- fact about the flux, and no rearrangement of the closed form supplies it.
  v_x := (2.0 / v_k) * power({VB('kolocreek_critical_pressure_ratio')}, 2.0 / v_k - 1.0)
         - ((v_k + 1.0) / v_k) * power({VB('kolocreek_critical_pressure_ratio')}, 1.0 / v_k);
  if abs(v_x) > 1e-12 then
    raise exception 'FC5 go-live refused: the critical ratio of % leaves a nozzle flux slope of %, so it is not where the flux peaks', {VB('kolocreek_critical_pressure_ratio')}, v_x;
  end if;

  if abs({VB('kolocreek_gas_coefficient_c')} - {f17(C_USC)} * sqrt(v_k * power(2.0 / (v_k + 1.0), (v_k + 1.0) / (v_k - 1.0)))) > 1e-11 then
    raise exception 'FC5 go-live refused: C of % is not the USC coefficient at k = %', {VB('kolocreek_gas_coefficient_c')}, v_k;
  end if;

  -- C AGAIN FROM THE GRADED RATIO, which ties the two fields together: the
  -- exponent (k+1)/(k-1) on 2/(k+1) is the ratio raised to (k+1)/k.
  if abs({VB('kolocreek_gas_coefficient_c')} - {f17(C_USC)} * sqrt(v_k * power({VB('kolocreek_critical_pressure_ratio')}, (v_k + 1.0) / v_k))) > 1e-10 then
    raise exception 'FC5 go-live refused: C of % does not follow from the graded critical ratio of %', {VB('kolocreek_gas_coefficient_c')}, {VB('kolocreek_critical_pressure_ratio')};
  end if;

  -- The relieving pressure is the set pressure with its overpressure, made
  -- absolute. The flare header case is CRITICAL and under the 0.3 ratio, so Kb
  -- is 1 by the standard; the pressured header case is SUBCRITICAL, so F2
  -- carries it and Kb is not read.
  v_p1 := {f17(KC_SET)} * {f17(OVER)} + {f17(ATM)};
  v_t := {f17(KC_TF)} + {f17(RANKINE)};
  if not ({f17(KC_BACK)} / v_p1 <= {VB('kolocreek_critical_pressure_ratio')} and {f17(KC_BACK)} / v_p1 < 0.3) then
    raise exception 'FC5 go-live refused: the flare header case at % psia against % psia is not critical under the 0.3 ratio, so the graded critical ratio % would be read on the wrong branch', {f17(KC_BACK)}, v_p1, {VB('kolocreek_critical_pressure_ratio')};
  end if;
  if not ({f17(KC_BACK_SUB)} / v_p1 > {VB('kolocreek_critical_pressure_ratio')}) then
    raise exception 'FC5 go-live refused: the pressured header case at % psia is not subcritical against the graded ratio %', {f17(KC_BACK_SUB)}, {VB('kolocreek_critical_pressure_ratio')};
  end if;

  if abs({VB('kolocreek_gas_critical_area_in2')} - {f17(KC_W)} * sqrt(v_t * {f17(KC_Z)} / {f17(KC_MW)})
         / ({VB('kolocreek_gas_coefficient_c')} * {f17(KC_KD)} * v_p1 * {f17(KC_KB)} * {f17(KC_KC)})) > 1e-13 then
    raise exception 'FC5 go-live refused: the critical gas area of % in2 is not the API 520 critical area on the graded C of %', {VB('kolocreek_gas_critical_area_in2')}, {VB('kolocreek_gas_coefficient_c')};
  end if;
  -- AND AS A PRODUCT, the sizing equation read forwards.
  if abs({VB('kolocreek_gas_critical_area_in2')} * {VB('kolocreek_gas_coefficient_c')} * {f17(KC_KD)} * v_p1 * {f17(KC_KB)} * {f17(KC_KC)}
         - {f17(KC_W)} * sqrt(v_t * {f17(KC_Z)} / {f17(KC_MW)})) > 1e-9 then
    raise exception 'FC5 go-live refused: the graded area % in2 times C % does not pass the stated % lb an hour', {VB('kolocreek_gas_critical_area_in2')}, {VB('kolocreek_gas_coefficient_c')}, {f17(KC_W)};
  end if;

  v_r := {f17(KC_BACK_SUB)} / v_p1;
  v_f2 := sqrt((v_k / (v_k - 1.0)) * power(v_r, 2.0 / v_k) * ((1.0 - power(v_r, (v_k - 1.0) / v_k)) / (1.0 - v_r)));
  if abs({VB('kolocreek_gas_subcritical_area_in2')} - ({f17(KC_W)} / ({f17(SUB_USC)} * v_f2 * {f17(KC_KD)} * {f17(KC_KC)}))
         * sqrt((v_t * {f17(KC_Z)}) / ({f17(KC_MW)} * v_p1 * (v_p1 - {f17(KC_BACK_SUB)})))) > 1e-13 then
    raise exception 'FC5 go-live refused: the subcritical gas area of % in2 is not the API 520 subcritical area at F2 = %', {VB('kolocreek_gas_subcritical_area_in2')}, v_f2;
  end if;
  -- A PRESSURED HEADER NEEDS THE BIGGER VALVE, or the branch teaches nothing.
  if not {VB('kolocreek_gas_subcritical_area_in2')} > {VB('kolocreek_gas_critical_area_in2')} then
    raise exception 'FC5 go-live refused: the subcritical area % in2 is not larger than the critical area % in2', {VB('kolocreek_gas_subcritical_area_in2')}, {VB('kolocreek_gas_critical_area_in2')};
  end if;

  -- The liquid route on the DIFFERENCE of two gauge pressures, inviscid, so Kv
  -- is exactly 1 and no Kv fit constant enters.
  v_dp := {f17(KL_SET)} * {f17(OVER)} - {f17(KL_BACK)};
  if abs({VB('kolocreek_liquid_area_in2')} - {f17(KL_Q)} * sqrt({f17(KL_SG)})
         / ({f17(LIQ_USC)} * {f17(KL_KD)} * {f17(KL_KW)} * {f17(KL_KC)} * sqrt(v_dp))) > 1e-13 then
    raise exception 'FC5 go-live refused: the liquid area of % in2 is not the API 520 liquid area across % psi', {VB('kolocreek_liquid_area_in2')}, v_dp;
  end if;
  if abs({VB('kolocreek_liquid_area_in2')} * {f17(LIQ_USC)} * {f17(KL_KD)} * {f17(KL_KW)} * {f17(KL_KC)} * sqrt(v_dp)
         - {f17(KL_Q)} * sqrt({f17(KL_SG)})) > 1e-10 then
    raise exception 'FC5 go-live refused: the graded liquid area % in2 does not pass the stated % gpm', {VB('kolocreek_liquid_area_in2')}, {f17(KL_Q)};
  end if;

  -- Steam far below the Napier threshold, so KN is exactly 1.
  v_p1 := {f17(KS_SET)} * {f17(OVER)} + {f17(ATM)};
  if v_p1 > 1500.0 then
    raise exception 'FC5 go-live refused: the steam case relieves at % psia, at or past the Napier threshold', v_p1;
  end if;
  if abs({VB('kolocreek_steam_area_in2')} - {f17(KS_W)} / ({f17(STEAM_USC)} * v_p1 * {f17(KS_KD)} * {f17(KS_KB)} * {f17(KS_KC)} * {f17(KS_KSH)})) > 1e-13 then
    raise exception 'FC5 go-live refused: the steam area of % in2 is not the API 520 steam area at % psia', {VB('kolocreek_steam_area_in2')}, v_p1;
  end if;
  if abs({VB('kolocreek_steam_area_in2')} * {f17(STEAM_USC)} * v_p1 * {f17(KS_KD)} * {f17(KS_KB)} * {f17(KS_KC)} * {f17(KS_KSH)} - {f17(KS_W)}) > 1e-8 then
    raise exception 'FC5 go-live refused: the graded steam area % in2 does not pass the stated % lb an hour', {VB('kolocreek_steam_area_in2')}, {f17(KS_W)};
  end if;
''')

A(f'''
  -- ------------------------------------------ the Professional, OGBAINBIRI
  -- The horizontal vessel as an exact circular segment, heads ignored.
  v_r := {f17(OG_D)} / 2.0;
  if abs({VI('ogbainbiri_wetted_area_ft2')} - v_r * (2.0 * acos((v_r - {f17(OG_H)}) / v_r)) * {f17(OG_L)}) > 1e-10 then
    raise exception 'FC5 go-live refused: the horizontal wetted area of % ft2 is not the wetted arc times the length', {VI('ogbainbiri_wetted_area_ft2')};
  end if;
  -- AGAIN THROUGH THE HALF CHORD. atan2 of the half chord over the depth below
  -- the centre shares no arithmetic with the arc cosine above.
  if abs({VI('ogbainbiri_wetted_area_ft2')} - 2.0 * v_r * {f17(OG_L)}
         * atan2(sqrt({f17(OG_H)} * (2.0 * v_r - {f17(OG_H)})), v_r - {f17(OG_H)})) > 1e-10 then
    raise exception 'FC5 go-live refused: the horizontal wetted area of % ft2 disagrees with the half-chord route', {VI('ogbainbiri_wetted_area_ft2')};
  end if;

  if abs({VI('ogbainbiri_tower_wetted_area_ft2')} - pi() * {f17(OT_D)} * least({f17(OT_H)}, {f17(OT_L)})) > 1e-10 then
    raise exception 'FC5 go-live refused: the tower wetted area of % ft2 is not the circumference times the wetted height', {VI('ogbainbiri_tower_wetted_area_ft2')};
  end if;
  if not ({f17(OT_H)} < {f17(WETTED_LIMIT_FT)} and {f17(OG_D)} < {f17(WETTED_LIMIT_FT)}) then
    raise exception 'FC5 go-live refused: a wetted height reaches the 25 ft limit, which is the caller''s truncation and not graded here';
  end if;

  -- The drum. The fraction of the cross-section below the level.
  v_x := 2.0 * acos(1.0 - 2.0 * {f17(DR_F)});
  if abs({VI('ogbainbiri_liquid_area_fraction')} - (v_x - sin(v_x)) / (2.0 * pi())) > 1e-14 then
    raise exception 'FC5 go-live refused: the liquid area fraction of % is not the circular segment at a level of % of the diameter', {VI('ogbainbiri_liquid_area_fraction')}, {f17(DR_F)};
  end if;
  -- AGAIN BY THE ARCCOS SEGMENT FORMULA on a unit diameter, a different route.
  v_u := 1.0 - 2.0 * {f17(DR_F)};
  if abs({VI('ogbainbiri_liquid_area_fraction')} - (acos(v_u) - v_u * sqrt(1.0 - v_u * v_u)) / pi()) > 1e-14 then
    raise exception 'FC5 go-live refused: the liquid area fraction of % disagrees with the arccos segment formula', {VI('ogbainbiri_liquid_area_fraction')};
  end if;

  if abs({VI('ogbainbiri_vapor_velocity_fts')} - {f17(DR_Q)} / ((pi() * {f17(DR_D)} * {f17(DR_D)} / 4.0) * (1.0 - {VI('ogbainbiri_liquid_area_fraction')}))) > 1e-13 then
    raise exception 'FC5 go-live refused: the vapour velocity of % ft/s is not the stated rate over the vapour area above the graded fraction %', {VI('ogbainbiri_vapor_velocity_fts')}, {VI('ogbainbiri_liquid_area_fraction')};
  end if;

  -- The length the vapour must travel while a droplet falls the VAPOUR DEPTH.
  if abs({VI('ogbainbiri_drum_length_ft')} - {VI('ogbainbiri_vapor_velocity_fts')} * ({f17(DR_D)} * (1.0 - {f17(DR_F)})) / {f17(DR_UD)}) > 1e-12 then
    raise exception 'FC5 go-live refused: the drum length of % ft is not the graded velocity % times the fall time', {VI('ogbainbiri_drum_length_ft')}, {VI('ogbainbiri_vapor_velocity_fts')};
  end if;

  if abs({VI('ogbainbiri_drum_length_wider_ft')}
         - ({f17(DR_Q)} / ((pi() * {f17(DR_D2)} * {f17(DR_D2)} / 4.0) * (1.0 - {VI('ogbainbiri_liquid_area_fraction')})))
           * ({f17(DR_D2)} * (1.0 - {f17(DR_F)})) / {f17(DR_UD)}) > 1e-12 then
    raise exception 'FC5 go-live refused: the wider drum length of % ft is not the same balance at % ft', {VI('ogbainbiri_drum_length_wider_ft')}, {f17(DR_D2)};
  end if;
  -- THE EXACT RATIO. At one level fraction the vapour area goes as D squared
  -- and the fall as D, so the length goes as 1/D. Two graded lengths, one
  -- identity, and nothing in common with the balance above.
  if abs({VI('ogbainbiri_drum_length_wider_ft')} / {VI('ogbainbiri_drum_length_ft')} - {f17(DR_D)} / {f17(DR_D2)}) > 1e-14 then
    raise exception 'FC5 go-live refused: the wider length % over the first % is not the diameter ratio %', {VI('ogbainbiri_drum_length_wider_ft')}, {VI('ogbainbiri_drum_length_ft')}, {f17(DR_D)} / {f17(DR_D2)};
  end if;
''')

A(f'''
  -- ------------------------------------------------------ the Expert, GBARAN
  v_rgas := {f17(GB_R)} / {f17(GB_MW)};
  if abs({VE('gbaran_initial_mass_lb')} - {f17(GB_P0)} * 144.0 * {f17(GB_V)} / ({f17(GB_Z)} * v_rgas * {f17(GB_T0)})) > 1e-10 then
    raise exception 'FC5 go-live refused: the inventory of % lb is not the gas law at the stated start state', {VE('gbaran_initial_mass_lb')};
  end if;
  if abs({VE('gbaran_initial_mass_lb')} * {f17(GB_Z)} * v_rgas * {f17(GB_T0)} / (144.0 * {f17(GB_V)}) - {f17(GB_P0)}) > 1e-10 then
    raise exception 'FC5 go-live refused: the graded inventory of % lb does not return the stated start pressure', {VE('gbaran_initial_mass_lb')};
  end if;

  -- THE TIME, AGAINST THE EXACT INTEGRAL OF THE SAME BALANCE. With z held and
  -- the flow choked, the mass leaves at a rate proportional to m^((k+1)/2), so
  -- the time between two masses is closed form. The engine MARCHES this at a
  -- 0.1 s step and sits 3.98e-5 s from the integral, so the epsilon is 5e-5 s,
  -- the one assertion in this file looser than a one-part-in-1e7 move. The
  -- field's shipped tolerance is 1e-4 so that both routes grade correct.
  v_k := {f17(GB_K)};
  v_c := {f17(C_USC)} * sqrt(v_k * power(2.0 / (v_k + 1.0), (v_k + 1.0) / (v_k - 1.0)));
  v_a := ({f17(GB_CD)} * (pi() / 4.0) * power({f17(GB_D)} / 12.0, 2.0) * 144.0);
  v_x := (v_c * v_a * sqrt({f17(GB_MW)} / {f17(GB_Z)}) / 3600.0) * ({f17(GB_Z)} * v_rgas / (144.0 * {f17(GB_V)}))
         * sqrt({f17(GB_T0)}) * power({VE('gbaran_initial_mass_lb')}, -(v_k - 1.0) / 2.0);
  v_n := (v_k + 1.0) / 2.0;
  v_u := {VE('gbaran_initial_mass_lb')} * power({f17(GB_PE)} / {f17(GB_P0)}, 1.0 / v_k);
  v_t := (power(v_u, 1.0 - v_n) - power({VE('gbaran_initial_mass_lb')}, 1.0 - v_n)) / (v_x * (v_n - 1.0));
  if abs({VE('gbaran_blowdown_time_s')} - v_t) > {f17(BLOWDOWN_EPS)} then
    raise exception 'FC5 go-live refused: the blowdown time of % s is % s from the exact integral of the same balance, % s, past the march''s own step error', {VE('gbaran_blowdown_time_s')}, abs({VE('gbaran_blowdown_time_s')} - v_t), v_t;
  end if;

  -- The end temperature is fixed by the pressure ratio alone.
  if abs({VE('gbaran_final_temperature_degr')} - {f17(GB_T0)} * power({f17(GB_PE)} / {f17(GB_P0)}, (v_k - 1.0) / v_k)) > 1e-9 then
    raise exception 'FC5 go-live refused: the end temperature of % degR is not the isentropic temperature at the stated pressure ratio', {VE('gbaran_final_temperature_degr')};
  end if;
  -- AGAIN THROUGH THE GAS LAW, against the graded inventory: the end mass the
  -- gas law gives at the graded temperature must be the start mass times the
  -- temperature ratio to the 1/(k-1).
  v_x := {f17(GB_PE)} * 144.0 * {f17(GB_V)} / ({f17(GB_Z)} * v_rgas * {VE('gbaran_final_temperature_degr')});
  if abs(v_x / {VE('gbaran_initial_mass_lb')} - power({VE('gbaran_final_temperature_degr')} / {f17(GB_T0)}, 1.0 / (v_k - 1.0))) > 1e-12 then
    raise exception 'FC5 go-live refused: the graded end temperature % degR and the graded inventory % lb do not satisfy the gas law and the isentropic mass relation together', {VE('gbaran_final_temperature_degr')}, {VE('gbaran_initial_mass_lb')};
  end if;

  if abs({VE('gbaran_choked_floor_psia')} - {f17(GB_PB)} / power(2.0 / (v_k + 1.0), v_k / (v_k - 1.0))) > 1e-11 then
    raise exception 'FC5 go-live refused: the choked floor of % psia is not the back pressure over the critical ratio', {VE('gbaran_choked_floor_psia')};
  end if;
  if not {f17(GB_PE)} > 3.0 * {VE('gbaran_choked_floor_psia')} then
    raise exception 'FC5 go-live refused: the end pressure is not three times the choked floor of % psia, so the graded time carries a model caveat', {VE('gbaran_choked_floor_psia')};
  end if;

  if abs({VE('gbaran_radiant_intensity_kwm2')} - {f17(FL_TAU)} * {f17(FL_F)} * {f17(FL_Q)} / (4.0 * pi() * power({f17(FL_R)}, 2.0))) > 1e-13 then
    raise exception 'FC5 go-live refused: the intensity of % kW/m2 is not the point source at the stated distance', {VE('gbaran_radiant_intensity_kwm2')};
  end if;
  if abs({VE('gbaran_setback_distance_m')} - sqrt({f17(FL_TAU)} * {f17(FL_F)} * {f17(FL_Q)} / (4.0 * pi() * {f17(FL_ALLOW)}))) > 1e-11 then
    raise exception 'FC5 go-live refused: the setback of % m is not the point source solved for the project allowable', {VE('gbaran_setback_distance_m')};
  end if;
  -- THE INVERSE SQUARE, between the two graded values and nothing else.
  if abs({VE('gbaran_radiant_intensity_kwm2')} * power({f17(FL_R)}, 2.0) - {f17(FL_ALLOW)} * power({VE('gbaran_setback_distance_m')}, 2.0)) > 1e-8 then
    raise exception 'FC5 go-live refused: the graded intensity % at % m and the graded setback % m do not keep the inverse square', {VE('gbaran_radiant_intensity_kwm2')}, {f17(FL_R)}, {VE('gbaran_setback_distance_m')};
  end if;
  if {f17(FL_ALLOW)} in (1.58, 4.73, 6.31, 9.46) then
    raise exception 'FC5 go-live refused: the project allowable is one of the four customary values, which are held for literature';
  end if;
''')

A(f'''
  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = '{SLUG}';
  if not exists (select 1 from public.academy_apps
                  where slug = '{SLUG}' and status = 'available') then
    raise exception 'FC5 go-live refused: {SLUG} did not reach status available';
  end if;

  select count(*) filter (where status = 'available'),
         count(*) filter (where status = 'coming_soon')
    into v_available, v_soon
    from public.academy_apps;

  raise notice 'FC5 go-live: {SLUG} available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
    v_lessons, v_questions, v_capstones, 18, v_available, v_soon;
end $$;''')

sql = HEADER + '\n\n' + '\n'.join(body) + '\n'

# ------------------------------- EVERY REFUSAL NAMES THE FIELD IT IS ABOUT
BY_VAR = {v: f'{t}.{k}' for (t, k), v in V.items()}
RAISE = re.compile(r"raise exception '((?:[^']|'')*)'((?:[^;']|'(?:[^']|'')*')*);", re.S)


def name_the_field(m):
    """Append every graded field THE WHOLE GUARD READS, condition included.

    THE CONDITION AND NOT ONLY THE MESSAGE, and a sibling's dry run is what
    taught this. An identity between two graded values reads both, and an
    appender that scanned only the `raise` statement named the field the
    identity was ABOUT rather than the field that had moved. A reader of that
    message cannot tell which of the two is wrong, which is the same defect as
    a gate that names nothing: the trusting half of a disagreeing pair is
    exactly where a reader will not look.
    """
    start = m.start()
    head = sql_draft.rfind('\n  if ', 0, start)
    for opener in ('\n  elsif ', '\n  if not ', '\n  v_'):
        alt = sql_draft.rfind(opener, 0, start)
        head = max(head, alt)
    scope = sql_draft[head:m.end()] if head >= 0 else m.group(0)
    msg, args = m.group(1), m.group(2)
    keys = []
    for tok in re.findall(r'\bv_[A-Za-z0-9_]+\b', scope):
        if tok in BY_VAR and BY_VAR[tok] not in keys:
            keys.append(BY_VAR[tok])
    if not keys:
        return m.group(0)
    return f"raise exception '{msg} [graded field: {', '.join(keys)}]'{args};"


sql_draft = sql
sql = RAISE.sub(name_the_field, sql)

named = set()
for m in RAISE.finditer(sql):
    gm = re.search(r'\[graded field: ([^\]]*)\]', m.group(1))
    if gm:
        named.update(x.strip() for x in gm.group(1).split(','))
unnamed = [f'{t}.{k} is graded and no refusal in this file names it'
           for (t, k) in V if f'{t}.{k}' not in named]
for m in RAISE.finditer(sql):
    head = max(sql.rfind('\n  if ', 0, m.start()), sql.rfind('\n  elsif ', 0, m.start()),
               sql.rfind('\n  if not ', 0, m.start()))
    scope = sql[head:m.end()] if head >= 0 else m.group(0)
    reads = [t for t in re.findall(r'\bv_[A-Za-z0-9_]+\b', scope) if t in BY_VAR]
    if reads and 'graded field:' not in m.group(1):
        unnamed.append(f'a refusal reads {reads} and names no graded field: {m.group(1)[:80]}')
    named_here = re.search(r'\[graded field: ([^\]]*)\]', m.group(1))
    if reads and named_here:
        want = {BY_VAR[t] for t in reads}
        got = {x.strip() for x in named_here.group(1).split(',')}
        if want - got:
            unnamed.append('a refusal reads ' + ', '.join(sorted(want - got))
                           + f' and does not name it: {m.group(1)[:80]}')

# --------------------------------------------- THE INTEGER-DIVISION GUARD
intdiv = []
for n, line in enumerate(sql.splitlines(), 1):
    code = '' if line.lstrip().startswith('--') else line.split('--', 1)[0]
    for m in re.finditer(r'/\s*(\d+)(?![\d.eE])', code):
        intdiv.append(f'line {n}: "/ {m.group(1)}" has a bare integer denominator -> {line.strip()[:90]}')

malformed = []
for n, line in enumerate(sql.splitlines(), 1):
    code = '' if line.lstrip().startswith('--') else line.split('--', 1)[0]
    for m in re.finditer(r'\d+\.\d+\.\d', code):
        malformed.append(f'line {n}: malformed numeric literal "{m.group(0)}" -> {line.strip()[:90]}')

# A VALUES SEPARATOR EMITTED INSIDE A COMMENT is what a sibling's dry run caught
# hundreds of lines in, so the odd-quote check runs on the code half of every
# line here too rather than on the file as a whole.
odd = [n for n, l in enumerate(sql.splitlines(), 1)
       if not l.lstrip().startswith('--') and l.split('--', 1)[0].count("'") % 2]

dashes = len(re.findall('[–—]', sql))
if refused or intdiv or malformed or unnamed or dashes or odd:
    print('REFUSED, nothing written:')
    for b in refused + intdiv + malformed + unnamed:
        print('  ', b)
    if dashes:
        print('   en/em dashes:', dashes)
    if odd:
        print('   odd-quote code lines:', odd)
    sys.exit(1)

open(OUT, 'w').write(sql)
print(f'wrote {OUT}: {len(sql.splitlines())} lines')
print(f'integer-division guard: 0 bare integer denominators in {sql.count("/")} divisions')
print(f'malformed-literal guard: 0 in {len(sql.splitlines())} lines')
print(f'odd-quote guard: 0 code lines with an unbalanced quote')
print(f'digest literals swept: {len(published)} | handed-in-prompt values: {len(handed)} '
      f'| held quantities: {len(HELD)}')
print('graded fields colliding with any of those three lists, at their SHIPPED tolerance: 0')
print(f'refusals that read a graded value: '
      f'{sum(1 for m in RAISE.finditer(sql) if "[graded field:" in m.group(1))}, '
      'every one of them naming the field by key')
print(f'graded fields named by at least one refusal: {len(named)} of 18')
_gt = g('advanced', 'gbaran_blowdown_time_s')
print(f'GBARAN blowdown: march {_gt!r} s against the exact integral {t_exact!r} s, a gap of {abs(_gt - t_exact):.3e} s')
print('every identity this file asserts, checked here first:')
for what, diff, eps in checks:
    print(f'  {diff:.3e} <= {eps:.0e}  {what}')
