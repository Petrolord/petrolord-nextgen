#!/usr/bin/env python3
"""Generate the FC3 go-live migration.

NOTHING HERE IS RETYPED. The eighteen graded values are read out of
fields.json, the numbers a learner is handed are parsed out of the capstone
prompts in the COURSE MIGRATION this ladder already emits, and the published
figures a graded value may not collide with are every numeric literal the
teaching digest prints. The fit coefficients the two duty solves are roots
against are computed here in exact rational arithmetic and emitted as the
normal-equation determinants they come from, so the SQL solves the same least
squares problem the engine solved rather than being handed its answer.

WHAT IT REFUSES TO WRITE.

1. A DIVISION WITH A BARE INTEGER DENOMINATOR. Postgres divides integer by
   integer as an integer. On FC1 `(7350+2480)*4/1440` truncated to 27 and lost
   a third of a minute of retention, and the Python check that proved the same
   identity to 0.0 difference could not see it, because only SQL does this.
   Every denominator this file emits is a float and the guard below refuses
   any that is not.
2. A GRADED VALUE THAT COLLIDES, at its own tolerance, with a number the
   learner is handed in a prompt, with a number the digest publishes, or with
   a quantity held for the literature.
3. AN EM DASH OR AN EN DASH, which this programme's copy rule forbids.

Usage: python3 /root/fc-wip-rotating/gen_golive.py
"""
import json
import math
import os
import re
import sys
from fractions import Fraction as Fr

W = os.environ.get('FC3_WAVE', '/root/fc-wip-rotating')
REPO = os.environ.get('FC3_REPO', '/root/wt-fc3-nextgen')
COURSE = os.environ.get(
    'FC3_COURSE_SQL', f'{REPO}/migrations/20260923_fc3_rotating_course.sql')
OUT = os.environ.get(
    'FC3_GOLIVE_OUT', f'{REPO}/migrations/20260923_fc3_rotating_go_live.sql')
SLUG = 'rotating'

fields = json.load(open(f'{W}/fields.json'))
assert len(fields) == 18, f'{len(fields)} graded fields'
F = {k: (v, t) for _t, k, v, t in fields}
V = {k: 'v_' + k.split('_', 1)[1] for k in F}

# --------------------------------------------------------------- the inputs
# Every one of these is stated in a capstone prompt. They are written here
# once and every assertion below is built out of them, so a condition that
# moves moves the whole file rather than one line of it.
ESC_POINTS = [(0, 486), (700, 452), (1400, 358), (2000, 214)]
ESC_STATIC, ESC_FRICTION, ESC_AT = 168, 214, 1250
ESC_SG, ESC_EFF, ESC_MOTOR_EFF = 0.823, 0.761, 0.938
BON_POINTS = [(0, 212), (450, 198), (900, 160), (1300, 96)]
BON_STATIC, BON_FRICTION, BON_AT = 44, 88, 800
BON_SG = 0.79
BON_PSUCT, BON_PVAP, BON_LIFT, BON_FRIC_FT = 19.4, 3.7, 11.5, 4.3
BON_RAISED = 46.0
BON_SPEED, BON_N = 0.87, 2
BONNY_Q, BONNY_PS, BONNY_TS, BONNY_PD = 34.0, 138.0, 96.0, 1240.0
BONNY_SG, BONNY_K, BONNY_ETAP, BONNY_ETAM = 0.673, 1.272, 0.767, 0.972
BONNY_RMAX, BONNY_TMAX = 3.8, 285.0
BONNY_HEAT_RATE, BONNY_LHV = 7650, 968

# Constants, each one written the way the engines DERIVE it rather than the
# way anybody quotes it. 0.7457 and 2544.43 are roundings, and the FC3-0
# repair replaced both because a rounding with no provenance is a second
# opinion about a constant that is exact by definition.
FT, LB, G0 = 0.3048, 0.45359237, 9.80665       # all three exact by agreement
W_PER_HP = 550 * FT * LB * G0                   # mechanical hp is 550 ft lbf/s
J_PER_BTU = 1055.05585262                       # international table, exact
BTU_PER_HP_HR = W_PER_HP * (3600 / J_PER_BTU)
R_UNIVERSAL, AIR_MW, R_OFFSET = 10.7316, 28.9625, 459.67
LBMOL_SCF = (R_UNIVERSAL * 519.67) / 14.696
MW = AIR_MW * BONNY_SG
R_FT_LBF = R_UNIVERSAL * 144


def fit(points):
    """The engine's least-squares quadratic, solved EXACTLY in rationals.

    pumps.js scales the flow by the largest and solves the normal equations
    by Gaussian elimination with partial pivoting in double precision. The
    same system solved exactly is the thing to compare an answer against:
    it is the problem the engine set, without the engine's own rounding in
    it. Cramer on a 3x3 is a closed form, so the SQL below can carry the
    determinants rather than an elimination.
    """
    scale = max(q for q, _ in points)
    s = [Fr(0)] * 5
    t = [Fr(0)] * 3
    for q, y in points:
        x = Fr(q, scale)
        for i in range(5):
            s[i] += x ** i
        for i in range(3):
            t[i] += (x ** i) * Fr(y)
    A = [[s[0], s[1], s[2]], [s[1], s[2], s[3]], [s[2], s[3], s[4]]]

    def det(M):
        return (M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1])
                - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0])
                + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]))

    d = det(A)
    out = []
    for j in range(3):
        M = [row[:] for row in A]
        for i in range(3):
            M[i][j] = t[i]
        out.append(det(M) / d)
    return out, scale


ESC_C, ESC_SCALE = fit(ESC_POINTS)
BON_C, BON_SCALE = fit(BON_POINTS)


def f17(x):
    """A float literal SQL will read back as this exact double."""
    return repr(float(x))


# ------------------------------------------------------ the collision sweeps
# THE NUMBERS A LEARNER IS HANDED, parsed out of the capstone prompts in the
# course migration rather than from a copy of them.
course_sql = open(COURSE, encoding='utf-8').read()
PROMPT = re.compile(r"'((?:[^']|'')*)',\n\s*jsonb_build_array", re.S)
prompts = [m.group(1).replace("''", "'") for m in PROMPT.finditer(course_sql)]
assert len(prompts) == 3, f'{len(prompts)} prompts parsed out of {COURSE}'
NUM = re.compile(r'-?\d+(?:\.\d+)?')
handed = sorted({abs(float(t)) for p in prompts for t in NUM.findall(p)})

# EVERY NUMBER THE TEACHING DIGEST PRINTS. FC2 listed forty-five headline
# figures by hand. This takes all of them, because a hand-picked list is a
# list of the collisions somebody thought of.
digest = open(f'{W}/digest.txt', encoding='utf-8').read()
published = sorted({abs(float(t)) for t in NUM.findall(digest)})

# THE HELD-FOR-LITERATURE QUANTITIES, all eight of them, as VALUES. Section 17
# of the digest lists the eight and what each one costs; these are the numbers
# they are made of, and no graded field may land on one.
HELD = [
    (50, 'operating region band'), (70, 'operating region band'),
    (120, 'operating region band'), (140, 'operating region band'),
    (3, 'the NPSH margin floor in ft'), (0.35, 'the NPSH margin fraction'),
    (500, 'machine screening acfm'), (5000, 'machine screening acfm'),
    (20000, 'machine screening acfm'), (4, 'machine screening ratio'),
    (6, 'machine screening ratio'), (200, 'machine screening brake hp'),
    (10000, 'machine screening brake hp'),
    (300, 'the DEFAULT discharge temperature limit'),
    (0.5, 'the affinity speed band'), (1.5, 'the affinity speed band'),
    (62.33766233766234, 'the implied water density'),
]

refused = []
for tier, key, val, tol in fields:
    for h in handed:
        if abs(abs(val) - h) <= tol:
            refused.append(f'{key} = {val} is within {tol} of {h}, handed in a prompt')
    for p in published:
        if abs(abs(val) - p) <= tol:
            refused.append(f'{key} = {val} is within {tol} of {p}, which the digest prints')
    for h, label in HELD:
        if abs(abs(val) - h) <= tol:
            refused.append(f'{key} = {val} is within {tol} of {h} ({label}), which is HELD')

# THE ARITHMETIC IS CHECKED HERE BEFORE IT IS EMITTED, so a go-live that
# cannot be satisfied is never written. Every identity below is the one the
# SQL asserts, computed in Python at the same tolerances.
e = (BONNY_K - 1) / (BONNY_K * BONNY_ETAP)
overall = BONNY_PD / BONNY_PS
by_ratio = max(1, math.ceil(math.log(overall) / math.log(BONNY_RMAX)))
t1r = BONNY_TS + R_OFFSET
tout = {n: t1r * (overall ** (1.0 / n)) ** e - R_OFFSET for n in (1, 2, 3, 4)}
by_temp = min(n for n in (1, 2, 3, 4) if tout[n] <= BONNY_TMAX)
stages = max(by_ratio, by_temp)
mass_lb_hr = (BONNY_Q * 1e6 / LBMOL_SCF / 24.0) * MW

checks = []


def near(a, b, eps, what):
    checks.append((what, abs(a - b), eps))
    if not abs(a - b) <= eps:
        refused.append(f'{what}: {a} against {b}, difference {abs(a - b)} exceeds {eps}')


def curve_head(c, scale, q):
    x = Fr(q).limit_denominator(10 ** 18) / Fr(scale)
    return float(c[0] + c[1] * x + c[2] * x * x)


def system_head(static, friction, at, q):
    return static + (friction / float(at) ** 2) * q * q


qe = F['escravos_duty_flow_gpm'][0]
he = F['escravos_duty_head_ft'][0]
near(curve_head(ESC_C, ESC_SCALE, qe), system_head(ESC_STATIC, ESC_FRICTION, ESC_AT, qe),
     1e-8, 'the ESCRAVOS duty flow is a root of pump head less system head')
near(he, system_head(ESC_STATIC, ESC_FRICTION, ESC_AT, qe), 1e-9,
     'the ESCRAVOS duty head is the station curve at the duty flow')
near(F['escravos_hydraulic_hp'][0], qe * he * ESC_SG / 3960.0, 1e-9, 'hydraulic hp')
near(F['escravos_brake_hp'][0], qe * he * ESC_SG / 3960.0 / ESC_EFF, 1e-9, 'brake hp')
near(F['escravos_motor_input_kw'][0],
     qe * he * ESC_SG / 3960.0 / ESC_EFF / ESC_MOTOR_EFF * W_PER_HP / 1000.0, 1e-9, 'motor input kW')
near(F['escravos_discharge_psi'][0], he * ESC_SG / 2.31, 1e-9, 'discharge psi')

ph = (BON_PSUCT - BON_PVAP) * 2.31 / BON_SG
near(F['bonga_pressure_head_ft'][0], ph, 1e-9, 'BONGA pressure head')
near(F['bonga_npsha_ft'][0], ph + BON_LIFT - BON_FRIC_FT, 1e-9, 'BONGA NPSH available')
near(F['bonga_npsha_raised_ft'][0],
     (BON_RAISED - BON_PVAP) * 2.31 / BON_SG + BON_LIFT - BON_FRIC_FT, 1e-9, 'BONGA NPSHa padded')
qb = F['bonga_speed_flow_gpm'][0] / BON_SPEED
near(curve_head(BON_C, BON_SCALE, qb), system_head(BON_STATIC, BON_FRICTION, BON_AT, qb),
     1e-8, 'the BONGA duty behind the speed change is a root of pump head less system head')
near(F['bonga_speed_head_ft'][0],
     BON_SPEED ** 2 * system_head(BON_STATIC, BON_FRICTION, BON_AT, qb), 1e-9,
     'the BONGA head at the proposed speed is the square law on the solved duty head')
qp = F['bonga_parallel_flow_gpm'][0]
near(curve_head(BON_C, BON_SCALE, qp / BON_N), system_head(BON_STATIC, BON_FRICTION, BON_AT, qp),
     1e-8, 'the BONGA parallel flow is a root of one machine at half the flow less the system')

near(F['bonny_exponent_ratio'][0], e, 1e-15, 'the polytropic exponent ratio')
rg = F['bonny_ratio_per_stage'][0]
near(rg ** stages, overall, 1e-9, 'the ratio per stage raised to the stage count is the overall ratio')
near(F['bonny_stage1_discharge_f'][0], t1r * rg ** e - R_OFFSET, 1e-9, 'the first stage discharge')
hd = F['bonny_stage1_poly_head'][0]
hp = F['bonny_stage1_gas_hp'][0]
near(hp, mass_lb_hr * hd / (33000.0 * 60.0) / BONNY_ETAP, 1e-9,
     'the first stage gas horsepower is its own polytropic head through the mass flow')
t2r = F['bonny_stage1_discharge_f'][0] + R_OFFSET
z_implied = hd * e / ((R_FT_LBF / MW) * (t2r - t1r))
if not 0.5 < z_implied < 1.0:
    refused.append(f'the implied stage average z is {z_implied}, which is not a compressed real gas')
bhp_implied = F['bonny_fuel_mmscfd'][0] * 1e6 * BONNY_LHV / 24.0 / BONNY_HEAT_RATE
ratio_to_stage1 = bhp_implied / (hp / BONNY_ETAM)
if not 2.85 < ratio_to_stage1 < float(stages):
    refused.append(f'the fuel implies {ratio_to_stage1} times the first stage, not a {stages} stage train')

# ------------------------------------------------------------------ the SQL
def vals(rows, per_line=6):
    out = []
    for i in range(0, len(rows), per_line):
        out.append('                 ' + ', '.join(f'({f17(v)})' for v in rows[i:i + per_line]))
    return ',\n'.join(out)


HEADER = f"""-- ============================================================================
-- FC3 GO-LIVE (HELD): Rotating Equipment flips to 'available'. The THIRD
-- Facilities course, above FC2 linesizing at path_order 40 and FC1 separation
-- at 39.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/rotating. The 78 lessons, the teaching lab
-- (rotatingLab.js) and its three explorer panels (the pump, the suction side
-- and the compressor) ship in the zip and NOT in this database, so a flip
-- before the upload puts a live catalogue tile in front of a route that does
-- not exist. Every Facilities and Drilling wave on this programme has held its
-- go-live behind one verified upload.
--
-- EVERY DENOMINATOR BELOW IS A FLOAT, ON PURPOSE. Postgres divides integer by
-- integer as an integer. On FC1 `(7350+2480)*4/1440` truncated to 27 and lost
-- a third of a minute of retention; the Python check that proved the same
-- identity to 0.0 difference could not see it, because only SQL does this.
-- The generator that wrote this file refuses to emit a division with a bare
-- integer denominator.
--
-- THIRTEEN OF THE EIGHTEEN GRADED VALUES ARE REPRODUCED BY EXACT CLOSED FORM.
-- A head is a static column plus a friction term that goes as the square of
-- flow; a hydraulic power is a flow, a head and a gravity over 3960; a brake
-- power is that through an efficiency; a kilowatt is a horsepower through a
-- conversion that is exact by definition; a pressure head is a pressure
-- difference over a gravity; an affinity law is a square and a cube; a
-- polytropic exponent ratio is k and an efficiency; and a discharge
-- temperature is an inlet temperature times a ratio to that exponent. A
-- capstone quietly recut to another curve, station, gravity, efficiency,
-- suction, speed, ratio or gas fails them outright.
--
-- THE FIVE THAT ARE NOT CLOSED FORM ARE ASSERTED THE ONLY HONEST WAY THERE IS,
-- BY THE EQUATION THEY ARE A ROOT OF.
--
--   * THE THREE DUTY FLOWS come out of a bisection on the difference between
--     a fitted pump curve and a station curve, so each is asserted by that
--     difference being zero AT THE GRADED FLOW. The fitted curve is not
--     handed to this file either: the three coefficients are recomputed here
--     from the four catalogue points by Cramer's rule on the same normal
--     equations pumps.js builds, so the SQL solves the least-squares problem
--     rather than trusting its answer. The parallel flow is the same root
--     with ONE MACHINE TAKING HALF THE FLOW, which is the whole point of the
--     Professional tier: two pumps in parallel deliver far less than twice
--     one pump, and this file asserts that too.
--   * THE POLYTROPIC HEAD carries the stage average compressibility, which is
--     an iterated correlation with no closed form. It is asserted through the
--     one relation that does not need z: the gas horsepower is that head
--     through the mass flow and the polytropic efficiency, EXACTLY, so the
--     two graded values pin each other. The z the head implies is then read
--     back out and required to be a compressed real gas rather than a number.
--   * THE DRIVER FUEL is asserted BY INVERSION, and it is THE ONE VALUE HERE
--     THAT IS NOT PINNED TIGHTLY, which is said rather than left to be
--     discovered. A fuel rate, a heating value and a heat rate give back the
--     brake power the train actually drew, and that power has to be the
--     three-stage machine the staging demands. But the second and third stages
--     hold a compressibility no closed form reaches, so what is asserted is a
--     BAND and not an identity. The dry run measured what the band catches: a
--     move of 3 percent on the fuel is refused and a move of 2.5 percent is
--     not, against one part in 1e7 on every other graded value in this file.
--     Restating the correlation in SQL would be a transcription pretending to
--     be a check, and a gate that restates a formula validates nothing.
--
-- THE STAGE COUNT IS ASSERTED AS THE LARGER OF TWO LIMITS, AND WHICH ONE WON.
-- The ratio limit of {BONNY_RMAX} demands {by_ratio} stages and the temperature limit of
-- {BONNY_TMAX:.0f} degF demands {by_temp}, so the temperature limit governs. Two stages
-- would reach {tout[2]:.4f} degF and three reach {tout[3]:.4f} degF, and this file
-- asserts both, so a recut that made the ratio limit govern instead would be
-- grading a different lesson under the same label.
--
-- NOTHING GRADED DEPENDS ON A HELD-FOR-LITERATURE ITEM, and that is asserted
-- rather than asserted-by-comment. Eight things are taught here as limits and
-- held: the Hydraulic Institute viscosity correction, the trim shortfall
-- model, the operating-region bands, the NPSH margin rule, the machine
-- screening thresholds, the 300 degF DEFAULT discharge limit, the implied
-- water density away from real water, and the published goldens with the
-- affinity speed band they carry. The capstone calls none of those functions:
-- it grades a SPEED change and never a trim, an NPSH AVAILABLE and never a
-- margin or a verdict, and it states its own {BONNY_TMAX:.0f} degF limit rather than
-- taking the default. Both halves are asserted below, on the labels and again
-- on the values.
-- ============================================================================"""

body = []
A = body.append
A('do $$')
A('declare')
A('  v_structures integer;')
A('  v_capstones  integer;')
A('  v_questions  integer;')
A('  v_graded     integer;')
A('  v_lessons    integer;')
A('  v_modules    integer;')
A('  v_available  integer;')
A('  v_soon       integer;')
for _t, k, _v, _tt in fields:
    A(f'  {V[k]} numeric;')
A('  -- the working the assertions are built from')
A('  v_pump numeric; v_syst numeric; v_base numeric; v_z numeric;')
A('  v_mass numeric; v_bhp numeric; v_e numeric; v_t1r numeric;')
A('begin')

A(f"""  -- ---------------------------------------------------------------- shape --
  select count(*) into v_structures
    from public.academy_course_structures where app_slug = '{SLUG}' and active;
  if v_structures <> 3 then
    raise exception 'FC3 go-live refused: {SLUG} has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions
    from public.academy_quiz_questions where app_slug = '{SLUG}';
  if v_questions <> 396 then
    raise exception 'FC3 go-live refused: {SLUG} has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_graded
    from (select tier, count(*) n from public.academy_quiz_questions
           where app_slug = '{SLUG}' group by tier) t
   where t.n <> 132;
  if v_graded <> 0 then
    raise exception 'FC3 go-live refused: % tier(s) do not carry exactly 132 questions', v_graded;
  end if;

  select count(*) into v_graded
    from (select tier, module_key, count(*) n from public.academy_quiz_questions
           where app_slug = '{SLUG}' and scope = 'module'
           group by tier, module_key) t
   where t.n <> 15;
  if v_graded <> 0 then
    raise exception 'FC3 go-live refused: % module bank(s) do not carry exactly 15 questions', v_graded;
  end if;

  select count(*) into v_graded
    from (select tier, count(*) n from public.academy_quiz_questions
           where app_slug = '{SLUG}' and scope = 'final' group by tier) t
   where t.n <> 42;
  if v_graded <> 0 then
    raise exception 'FC3 go-live refused: % final exam(s) do not carry exactly 42 questions', v_graded;
  end if;

  -- Every question offers four options and keys one of them. A bank that lost
  -- an option to an escaping accident still counts as a row.
  select count(*) into v_graded
    from public.academy_quiz_questions
   where app_slug = '{SLUG}'
     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);
  if v_graded <> 0 then
    raise exception 'FC3 go-live refused: % question(s) do not offer four options with a key inside them', v_graded;
  end if;

  select count(*) into v_capstones
    from public.academy_capstones where app_slug = '{SLUG}';
  if v_capstones <> 3 then
    raise exception 'FC3 go-live refused: {SLUG} has % capstones, expected 3', v_capstones;
  end if;

  -- 78 lessons across three tiers, 26 each, in six modules each. The lab and
  -- the panels ship in the zip; the lesson KEYS are what this database holds,
  -- so this is the count that has to match the upload.
  select count(*) into v_lessons
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m,
         lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = '{SLUG}' and s.active;
  if v_lessons <> 78 then
    raise exception 'FC3 go-live refused: {SLUG} carries % lesson keys, expected 78', v_lessons;
  end if;

  select count(*) into v_modules
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = '{SLUG}' and s.active;
  if v_modules <> 18 then
    raise exception 'FC3 go-live refused: {SLUG} carries % modules, expected 18 (six per tier)', v_modules;
  end if;

  -- Every module a question is keyed to is a module the structure declares.
  -- A bank seeded against a module key the manifest renamed would be served
  -- to nobody and would still count 132.
  select count(*) into v_graded
    from (select distinct q.tier, q.module_key
            from public.academy_quiz_questions q
           where q.app_slug = '{SLUG}' and q.scope = 'module') qm
   where not exists (
     select 1 from public.academy_course_structures s,
            lateral jsonb_array_elements(s.structure->'modules') m
      where s.app_slug = '{SLUG}' and s.tier = qm.tier and m->>'key' = qm.module_key);
  if v_graded <> 0 then
    raise exception 'FC3 go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_graded;
  end if;

  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = '{SLUG}';
  if v_graded <> 18 then
    raise exception 'FC3 go-live refused: {SLUG} has % graded capstone fields, expected 18', v_graded;
  end if;

  select count(*) into v_graded
    from (select c.tier, count(*) n
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = '{SLUG}' group by c.tier) t
   where t.n <> 6;
  if v_graded <> 0 then
    raise exception 'FC3 go-live refused: % tier(s) do not grade exactly six fields', v_graded;
  end if;

  -- The catalogue row itself: the module, the slot and the absence of a
  -- prerequisite are decisions, so they are asserted rather than assumed. FC3
  -- takes 41, directly above FC2 linesizing at 40.
  if not exists (select 1 from public.academy_apps
                  where slug = '{SLUG}' and module = 'facilities'
                    and path_order = 41 and prereq_slug is null) then
    raise exception 'FC3 go-live refused: the {SLUG} catalogue row is not facilities at path_order 41 with no prerequisite';
  end if;
  if exists (select 1 from public.academy_apps a, public.academy_apps b
              where a.slug = '{SLUG}' and b.slug <> '{SLUG}'
                and b.path_order = a.path_order) then
    raise exception 'FC3 go-live refused: another course already holds path_order 41';
  end if;

  -- ------------------------------------------------- the scope assertion --
  -- This course sizes ROTATING MACHINES. It does not book a reserve, estimate
  -- an ultimate recovery, value a barrel, model a reservoir pressure or size a
  -- pipe. Flows, heads, powers, suction margins, pressure ratios, stage
  -- temperatures, polytropic heads and fuel rates are its subject.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = '{SLUG}'
     and (f->>'label' ilike '%reserve%'    or f->>'label' ilike '%eur%'
       or f->>'label' ilike '%npv%'        or f->>'label' ilike '%irr%'
       or f->>'label' ilike '%permeab%'    or f->>'label' ilike '%porosit%'
       or f->>'label' ilike '%decline%'    or f->>'label' ilike '%skin%'
       or f->>'label' ilike '%wall thick%' or f->>'label' ilike '%maop%'
       or f->>'unit'  ilike '%usd%'        or f->>'unit'  ilike '%md%');
  if v_graded <> 0 then
    raise exception 'FC3 go-live refused: % capstone field(s) grade a quantity these rotating-equipment engines cannot produce', v_graded;
  end if;

  -- ------------------------------- the HELD-FOR-LITERATURE assertion --
  -- Eight things are taught here as limits and held for the literature, and
  -- none may be graded. The hold is neutralised by CONSTRUCTION rather than by
  -- hope: the capstone never calls viscosityCorrection, impellerTrim,
  -- operatingRegion, npshCheck or machineScreen, and it states its own
  -- discharge-temperature limit rather than taking the default.
  --
  -- FC2's dry run caught the crude version of this gate refusing the very
  -- field that PROVES its hold, so this one looks for the name of a LOOKUP and
  -- not for the name of a quantity. 'NPSH available on the suction side as
  -- surveyed' is the field that proves the margin rule is not graded.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = '{SLUG}'
     and (f->>'label' ilike '%viscosity correct%'  or f->>'label' ilike '%corrected flow%'
       or f->>'label' ilike '%corrected head%'     or f->>'label' ilike '%trim%'
       or f->>'label' ilike '%operating region%'   or f->>'label' ilike '%best efficiency%'
       or f->>'label' ilike '%preferred%'          or f->>'label' ilike '%required margin%'
       or f->>'label' ilike '%npsh required%'      or f->>'label' ilike '%severity%'
       or f->>'label' ilike '%recommend%'          or f->>'label' ilike '%screening%'
       or f->>'label' ilike '%from the table%'     or f->>'label' ilike '%water density%');
  if v_graded <> 0 then
    raise exception 'FC3 go-live refused: % graded field(s) name a lookup into a quantity held for the literature', v_graded;
  end if;

  -- And the same hold read off the VALUES, which is the half a label cannot be
  -- trusted for: no graded value is one of the region bands, either half of
  -- the margin rule, one of the screening thresholds, the DEFAULT discharge
  -- limit, either end of the affinity speed band, or the implied water
  -- density.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         (values
{vals([h for h, _ in HELD])}
         ) as held(v)
   where c.app_slug = '{SLUG}'
     and abs(abs((f->>'expected')::numeric) - held.v) <= (f->>'tol')::numeric;
  if v_graded <> 0 then
    raise exception 'FC3 go-live refused: % graded field(s) land on a quantity held for the literature', v_graded;
  end if;

  -- --------------------------------------- the published-golden assertion --
  -- EVERY numeric literal the teaching digest prints, all {len(published)} distinct
  -- magnitudes of them, swept out of digest.txt rather than hand picked. A
  -- graded field within its OWN tolerance of one of these is a lookup and not
  -- a calculation. The lessons work the OKONO pump and the SOKU compressor;
  -- the capstone runs ESCRAVOS, BONGA and BONNY and shares no curve point,
  -- station, gravity, efficiency, suction, speed, rate, pressure, temperature,
  -- ratio or heat rate with them.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         (values
{vals(published, 8)}
         ) as g(v)
   where c.app_slug = '{SLUG}'
     and abs(abs((f->>'expected')::numeric) - g.v) <= (f->>'tol')::numeric;
  if v_graded <> 0 then
    raise exception 'FC3 go-live refused: % graded field(s) sit within their own tolerance of a value the digest publishes, which makes them a lookup rather than a calculation', v_graded;
  end if;

  -- ------------------------------------ the handed-in-the-prompt assertion --
  -- Every number stated in any of the three capstone prompts, swept out of the
  -- prompts themselves. A graded field landing on one of them would be a
  -- transcription rather than a calculation.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         (values
{vals(handed, 8)}
         ) as h(v)
   where c.app_slug = '{SLUG}'
     and abs(abs((f->>'expected')::numeric) - h.v) <= (f->>'tol')::numeric;
  if v_graded <> 0 then
    raise exception 'FC3 go-live refused: % graded field(s) land on a number the learner is handed in a prompt, which makes the field a transcription rather than a calculation', v_graded;
  end if;

  -- ------------------------------------- the cross-tier prompt-leak gate --
  -- FC3's tiers do not chain: the Associate solves ESCRAVOS against its own
  -- station, the Professional works the BONGA suction side and its second
  -- machine, and the Expert takes the BONNY gas booster train. Asserted
  -- anyway, because a later recut that reused a machine across tiers would
  -- silently hand an answer over.
  select count(*) into v_graded
    from public.academy_capstones c,
         public.academy_capstones c2,
         lateral jsonb_array_elements(c2.fields) f
   where c.app_slug = '{SLUG}' and c2.app_slug = '{SLUG}' and c.tier <> c2.tier
     and replace(c.prompt, ',', '') like '%' || (f->>'expected') || '%';
  if v_graded <> 0 then
    raise exception 'FC3 go-live refused: % capstone prompt(s) state a graded value belonging to another tier', v_graded;
  end if;

  -- ------------------------------------------------------- load the values --""")

for _t, k, _v, _tt in fields:
    A(f"  select (f->>'expected')::numeric into {V[k]} from public.academy_capstones c, "
      f"lateral jsonb_array_elements(c.fields) f where c.app_slug = '{SLUG}' and f->>'key' = '{k}';")
A('')
A('  if ' + '\n     or '.join(f'{V[k]} is null' for _t, k, _v, _tt in fields) + ' then')
A("    raise exception 'FC3 go-live refused: one or more of the eighteen graded fields is missing';")
A('  end if;')

# -------------------------------------------------- the Associate assertions
A(f"""
  -- ============ ASSOCIATE: the ESCRAVOS transfer pump, P-1401 ============
  -- Four catalogue points, a station stated as {ESC_FRICTION} ft of friction at {ESC_AT} gpm
  -- over {ESC_STATIC} ft of static lift, crude at a gravity of {ESC_SG}, a pump
  -- efficiency of {ESC_EFF} and a motor at {ESC_MOTOR_EFF}.
  --
  -- THE DUTY FLOW IS A ROOT AND IS ASSERTED AS ONE. pumps.js fits a quadratic
  -- to the catalogue points by least squares and bisects the difference
  -- between that curve and the station curve. The three coefficients below are
  -- the SAME least-squares problem solved exactly by Cramer's rule on the
  -- normal equations, in the engine's own scaled variable q over {ESC_SCALE}, so
  -- nothing here is handed the engine's answer to check the engine's answer.
  v_pump := {f17(ESC_C[0])} + {f17(ESC_C[1])} * ({V['escravos_duty_flow_gpm']} / {f17(ESC_SCALE)})
            + {f17(ESC_C[2])} * power({V['escravos_duty_flow_gpm']} / {f17(ESC_SCALE)}, 2);
  v_syst := {f17(ESC_STATIC)} + ({f17(ESC_FRICTION)} / power({f17(ESC_AT)}, 2)) * power({V['escravos_duty_flow_gpm']}, 2);
  if abs(v_pump - v_syst) > 1e-8 then
    raise exception 'FC3 go-live refused: at the graded duty flow % gpm the fitted pump curve reads % ft and the station curve reads % ft, so that flow is not where they cross', {V['escravos_duty_flow_gpm']}, v_pump, v_syst;
  end if;

  -- THE DUTY HEAD IS WHAT BOTH CURVES AGREE ON THERE, and the station curve is
  -- the closed-form half of that agreement.
  if abs({V['escravos_duty_head_ft']} - v_syst) > 1e-9 then
    raise exception 'FC3 go-live refused: the duty head % ft is not the station curve at the duty flow', {V['escravos_duty_head_ft']};
  end if;

  -- A pump has no operating point until it is connected to something, and this
  -- one landed BELOW its shutoff head and ABOVE its static lift. A recut that
  -- lost either would stop teaching what the tier exists to teach.
  if not ({V['escravos_duty_head_ft']} < {f17(curve_head(ESC_C, ESC_SCALE, 0))}
          and {V['escravos_duty_head_ft']} > {f17(ESC_STATIC)}) then
    raise exception 'FC3 go-live refused: the duty head % ft is not between the station static lift and the pump shutoff head', {V['escravos_duty_head_ft']};
  end if;

  -- THE TWO FIELD PACKAGINGS ARE ONE CONSTANT, which is the engine fact this
  -- tier owns. Hydraulic power is flow, head and gravity over 3960.
  if abs({V['escravos_hydraulic_hp']}
         - {V['escravos_duty_flow_gpm']} * {V['escravos_duty_head_ft']} * {f17(ESC_SG)} / 3960.0) > 1e-9 then
    raise exception 'FC3 go-live refused: the hydraulic power % hp is not the duty through the field packaging', {V['escravos_hydraulic_hp']};
  end if;
  if abs({V['escravos_brake_hp']} - {V['escravos_hydraulic_hp']} / {f17(ESC_EFF)}) > 1e-9 then
    raise exception 'FC3 go-live refused: the brake power % hp is not the hydraulic power through the pump efficiency', {V['escravos_brake_hp']};
  end if;
  -- The kilowatt is EXACT BY DEFINITION and is written as the definition:
  -- 550 ft lbf per second, the foot at 0.3048 m, the pound at 0.45359237 kg
  -- and standard gravity at 9.80665 m per s2. 0.7457 is a rounding of this and
  -- the FC3-0 repair removed it.
  if abs({V['escravos_motor_input_kw']}
         - {V['escravos_brake_hp']} / {f17(ESC_MOTOR_EFF)} * (550 * 0.3048 * 0.45359237 * 9.80665) / 1000.0) > 1e-9 then
    raise exception 'FC3 go-live refused: the motor input % kW is not the brake power through the motor efficiency and the defined horsepower', {V['escravos_motor_input_kw']};
  end if;
  -- A head becomes a pressure through 2.31 ft per psi at gravity one, which is
  -- the same water density the 3960 above implies.
  if abs({V['escravos_discharge_psi']} - {V['escravos_duty_head_ft']} * {f17(ESC_SG)} / 2.31) > 1e-9 then
    raise exception 'FC3 go-live refused: the discharge pressure % psi is not the duty head on this crude', {V['escravos_discharge_psi']};
  end if;

  -- ========== PROFESSIONAL: the BONGA booster station, P-2203 ============
  -- THE SUCTION SIDE, BUILT FROM WHAT WAS SURVEYED. A pressure head over the
  -- vapour pressure, a static height and a suction friction, at gravity {BON_SG}.
  if abs({V['bonga_pressure_head_ft']} - ({f17(BON_PSUCT)} - {f17(BON_PVAP)}) * 2.31 / {f17(BON_SG)}) > 1e-9 then
    raise exception 'FC3 go-live refused: the pressure head % ft is not the suction pressure over the vapour pressure as a head of this liquid', {V['bonga_pressure_head_ft']};
  end if;
  if abs({V['bonga_npsha_ft']} - ({V['bonga_pressure_head_ft']} + {f17(BON_LIFT)} - {f17(BON_FRIC_FT)})) > 1e-9 then
    raise exception 'FC3 go-live refused: the NPSH available % ft is not the pressure head plus the static height less the suction friction', {V['bonga_npsha_ft']};
  end if;
  -- PADDING THE DRUM MOVES ONLY THE PRESSURE TERM. The static height and the
  -- suction friction are untouched, so the whole rise is the pressure head's.
  if abs({V['bonga_npsha_raised_ft']}
         - (({f17(BON_RAISED)} - {f17(BON_PVAP)}) * 2.31 / {f17(BON_SG)} + {f17(BON_LIFT)} - {f17(BON_FRIC_FT)})) > 1e-9 then
    raise exception 'FC3 go-live refused: the padded NPSH available % ft is not the same suction side at the proposed drum pressure', {V['bonga_npsha_raised_ft']};
  end if;
  if abs(({V['bonga_npsha_raised_ft']} - {V['bonga_npsha_ft']})
         - ({f17(BON_RAISED)} - {f17(BON_PSUCT)}) * 2.31 / {f17(BON_SG)}) > 1e-9 then
    raise exception 'FC3 go-live refused: the rise in NPSH available is % ft and the rise in the pressure term is % ft, so a second term moved with it', {V['bonga_npsha_raised_ft']} - {V['bonga_npsha_ft']}, ({f17(BON_RAISED)} - {f17(BON_PSUCT)}) * 2.31 / {f17(BON_SG)};
  end if;

  -- AN AFFINITY LAW APPLIED TO A DUTY POINT IS NOT A NEW DUTY POINT, and the
  -- graded flow is the scaled one, so it is asserted through the duty it was
  -- scaled from: divide it back by the speed ratio and that flow must be the
  -- root of the BONGA pump curve against the BONGA station.
  v_base := {V['bonga_speed_flow_gpm']} / {f17(BON_SPEED)};
  v_pump := {f17(BON_C[0])} + {f17(BON_C[1])} * (v_base / {f17(BON_SCALE)})
            + {f17(BON_C[2])} * power(v_base / {f17(BON_SCALE)}, 2);
  v_syst := {f17(BON_STATIC)} + ({f17(BON_FRICTION)} / power({f17(BON_AT)}, 2)) * power(v_base, 2);
  if abs(v_pump - v_syst) > 1e-8 then
    raise exception 'FC3 go-live refused: the graded flow % gpm divided by the speed ratio is % gpm, which is not the solved duty: the pump reads % ft there and the station reads % ft', {V['bonga_speed_flow_gpm']}, v_base, v_pump, v_syst;
  end if;
  -- The head leg is the SQUARE of the speed ratio on that same duty head,
  -- which is the station curve at the base flow. Exact for a geometrically
  -- similar machine, which is why this tier grades a speed change and never a
  -- trim: the trim shortfall model is HELD.
  if abs({V['bonga_speed_head_ft']} - power({f17(BON_SPEED)}, 2) * v_syst) > 1e-9 then
    raise exception 'FC3 go-live refused: the head at the proposed speed % ft is not the square law on the solved duty head', {V['bonga_speed_head_ft']};
  end if;

  -- TWO PUMPS IN PARALLEL DELIVER FAR LESS THAN TWICE ONE PUMP, and that is
  -- the result the engine exists to make visible. The combined curve is ONE
  -- machine at HALF the flow, and the graded flow is the root of that against
  -- the same station.
  v_pump := {f17(BON_C[0])} + {f17(BON_C[1])} * ({V['bonga_parallel_flow_gpm']} / {f17(BON_N)} / {f17(BON_SCALE)})
            + {f17(BON_C[2])} * power({V['bonga_parallel_flow_gpm']} / {f17(BON_N)} / {f17(BON_SCALE)}, 2);
  v_syst := {f17(BON_STATIC)} + ({f17(BON_FRICTION)} / power({f17(BON_AT)}, 2)) * power({V['bonga_parallel_flow_gpm']}, 2);
  if abs(v_pump - v_syst) > 1e-8 then
    raise exception 'FC3 go-live refused: the parallel flow % gpm is not where two of these machines cross this station: one machine at half the flow reads % ft and the station reads % ft', {V['bonga_parallel_flow_gpm']}, v_pump, v_syst;
  end if;
  if not ({V['bonga_parallel_flow_gpm']} < 1.6 * v_base
          and {V['bonga_parallel_flow_gpm']} > 1.02 * v_base) then
    raise exception 'FC3 go-live refused: two machines deliver % times one, which is not the shortfall the tier is built to show', {V['bonga_parallel_flow_gpm']} / v_base;
  end if;

  -- ============ EXPERT: the BONNY gas booster train, K-3101 ==============
  -- {BONNY_Q} MMscfd of a {BONNY_SG} gravity gas from {BONNY_PS} psia and {BONNY_TS} degF to {BONNY_PD} psia,
  -- k = {BONNY_K}, polytropic efficiency {BONNY_ETAP}, mechanical efficiency {BONNY_ETAM}, a
  -- per-stage ratio limit of {BONNY_RMAX}, a stated discharge limit of {BONNY_TMAX:.0f} degF and
  -- intercooling back to the suction temperature.
  --
  -- THE POLYTROPIC EXPONENT IS NOT THE ISENTROPIC ONE. Using k where n belongs
  -- under-predicts the discharge temperature and over-predicts how much ratio
  -- a stage can take, which is the Expert tier's first fact.
  v_e := ({f17(BONNY_K)} - 1) / ({f17(BONNY_K)} * {f17(BONNY_ETAP)});
  if abs({V['bonny_exponent_ratio']} - v_e) > 1e-15 then
    raise exception 'FC3 go-live refused: the exponent ratio % is not (k-1) over k times the polytropic efficiency', {V['bonny_exponent_ratio']};
  end if;

  -- THE STAGE COUNT IS THE LARGER OF TWO LIMITS, AND THE ENGINE NAMES WHICH.
  -- The ratio limit of {BONNY_RMAX} demands {by_ratio} stages here. The temperature limit
  -- demands {by_temp}, because two equal stages reach {tout[2]:.4f} degF against a stated
  -- limit of {BONNY_TMAX:.0f}. So the TEMPERATURE limit governs, and the graded ratio is
  -- the {stages}-stage one: asserted by raising it to the stage count, which must
  -- return the overall ratio exactly.
  if abs(power({V['bonny_ratio_per_stage']}, {stages}) - {f17(BONNY_PD)} / {f17(BONNY_PS)}) > 1e-9 then
    raise exception 'FC3 go-live refused: the ratio per stage % raised to {stages} is not the overall ratio of this duty', {V['bonny_ratio_per_stage']};
  end if;
  if not ({V['bonny_ratio_per_stage']} < {f17(BONNY_RMAX)}) then
    raise exception 'FC3 go-live refused: the ratio per stage % breaks the stated per-stage limit of {BONNY_RMAX}', {V['bonny_ratio_per_stage']};
  end if;
  v_t1r := {f17(BONNY_TS)} + {f17(R_OFFSET)};
  -- BOTH SIDES OF THE LIMIT THAT GOVERNED. One fewer stage must break it and
  -- the chosen count must meet it, or the count is not the one the engine
  -- chose and the tier is grading a different lesson under the same label.
  if not (v_t1r * power(power({f17(BONNY_PD)} / {f17(BONNY_PS)}, 1 / {stages - 1}.0), v_e) - {f17(R_OFFSET)} > {f17(BONNY_TMAX)}) then
    raise exception 'FC3 go-live refused: {stages - 1} stages would meet the stated {BONNY_TMAX:.0f} degF limit, so the temperature limit is not what chose {stages}';
  end if;
  if not ({V['bonny_stage1_discharge_f']} <= {f17(BONNY_TMAX)}) then
    raise exception 'FC3 go-live refused: the first stage discharges at % degF, above the stated limit of {BONNY_TMAX:.0f}', {V['bonny_stage1_discharge_f']};
  end if;

  -- THE DISCHARGE TEMPERATURE IS THE INLET ON THE POLYTROPIC PATH, closed form
  -- once the exponent and the ratio are known. Stage 1 starts from the suction
  -- temperature, and every later stage is cooled back to it, which is why this
  -- capstone's intercooler approach was stated AT the suction temperature: it
  -- makes the staging assumption exact.
  if abs({V['bonny_stage1_discharge_f']}
         - (v_t1r * power({V['bonny_ratio_per_stage']}, {V['bonny_exponent_ratio']}) - {f17(R_OFFSET)})) > 1e-9 then
    raise exception 'FC3 go-live refused: the first stage discharge % degF is not its own inlet raised on the polytropic path', {V['bonny_stage1_discharge_f']};
  end if;

  -- THE POLYTROPIC HEAD CARRIES THE STAGE AVERAGE COMPRESSIBILITY, which is an
  -- iterated correlation with no closed form, so the head is NOT restated as a
  -- formula. It is asserted through the one relation z cancels out of: the gas
  -- horsepower is this head through the mass flow and the polytropic
  -- efficiency, exactly. The mass flow is closed form: MMscfd to lbmol through
  -- the package's own standard base, lbmol to pounds through the molecular
  -- weight of air times the gravity.
  v_mass := ({f17(BONNY_Q)} * 1000000.0 / (({f17(R_UNIVERSAL)} * 519.67) / 14.696) / 24.0)
            * ({f17(AIR_MW)} * {f17(BONNY_SG)});
  if abs({V['bonny_stage1_gas_hp']}
         - v_mass * {V['bonny_stage1_poly_head']} / (33000.0 * 60.0) / {f17(BONNY_ETAP)}) > 1e-9 then
    raise exception 'FC3 go-live refused: the gas horsepower % and the polytropic head % do not agree through the mass flow of % lb per hr', {V['bonny_stage1_gas_hp']}, {V['bonny_stage1_poly_head']}, v_mass;
  end if;

  -- AND THE z THAT HEAD IMPLIES IS READ BACK OUT AND JUDGED. The head is
  -- z times the gas constant over the molecular weight, times the temperature
  -- RISE over the exponent, so the graded discharge temperature and the graded
  -- head between them say what z the engine used. It has to be a compressed
  -- real gas rather than a number that made the arithmetic work.
  v_z := {V['bonny_stage1_poly_head']} * {V['bonny_exponent_ratio']}
         / (({f17(R_FT_LBF)} / ({f17(AIR_MW)} * {f17(BONNY_SG)}))
            * ({V['bonny_stage1_discharge_f']} - {f17(BONNY_TS)}));
  if not (v_z > 0.5 and v_z < 1.0) then
    raise exception 'FC3 go-live refused: the polytropic head % implies a stage average z of %, which is not a compressed real gas', {V['bonny_stage1_poly_head']}, v_z;
  end if;

  -- THE FUEL IS ASSERTED BY INVERSION. A fuel rate at a stated heating value
  -- and a stated heat rate gives back the brake power the train drew, and
  -- nothing else it could have drawn. 24.0 and not 24: integer division would
  -- turn this assertion into a different one that still passed.
  v_bhp := {V['bonny_fuel_mmscfd']} * 1000000.0 * {f17(BONNY_LHV)} / 24.0 / {f17(BONNY_HEAT_RATE)};
  -- THE LIMIT OF WHAT THIS ONE CAN BE ASSERTED TO, SAID PLAINLY. Every other
  -- graded value here is pinned to 1e-9 or to the root of an equation, and a
  -- move of one part in 1e7 is refused. THIS ONE IS NOT. The fuel carries the
  -- WHOLE train, and stages two and three hold a stage average compressibility
  -- that only an iterated correlation reaches, so there is no identity to pin
  -- it with and a reimplementation of that correlation in SQL would be a
  -- transcription pretending to be a check. What is asserted instead is a band,
  -- and the dry run MEASURED what the band catches: a move of 3 percent on the
  -- fuel is refused and a move of 2.5 percent is not.
  --
  -- The band is two statements. The first is physics and cannot wrongly fail:
  -- the three stages share a mass flow, an inlet temperature and a ratio, so
  -- the train's gas power is the first stage's times the sum of the three z's
  -- over the first, and every later stage runs at a higher pressure where z is
  -- lower. So the power is strictly under {stages} first stages. The second is
  -- CALIBRATED at these conditions rather than derived: more than 2.85 first
  -- stages is what a {stages}-stage train of this gas gives, and it is here to catch
  -- a recut to another stage count, rate, gas or efficiency.
  if not (v_bhp > 2.85 * ({V['bonny_stage1_gas_hp']} / {f17(BONNY_ETAM)})
          and v_bhp < {stages}.0 * ({V['bonny_stage1_gas_hp']} / {f17(BONNY_ETAM)})) then
    raise exception 'FC3 go-live refused: the fuel of % MMscfd implies a train brake power of % hp, which is % first stages and not the {stages}-stage machine this duty demands', {V['bonny_fuel_mmscfd']}, v_bhp, v_bhp / ({V['bonny_stage1_gas_hp']} / {f17(BONNY_ETAM)});
  end if;
  -- And the driver is on the right side of the first law. A heat rate below
  -- the {BTU_PER_HP_HR:.4f} Btu that one horsepower-hour IS would be a driver more than
  -- a hundred percent thermally efficient, and driverFuel refuses it by name.
  if not ({f17(BONNY_HEAT_RATE)} > 550 * 0.3048 * 0.45359237 * 9.80665 * (3600.0 / 1055.05585262)) then
    raise exception 'FC3 go-live refused: the stated heat rate is below the Btu that one horsepower-hour is';
  end if;

  -- ------------------------------------------------------------ the flip --
  update public.academy_apps
     set status = 'available'
   where slug = '{SLUG}' and status = 'coming_soon';

  if not exists (select 1 from public.academy_apps where slug = '{SLUG}' and status = 'available') then
    raise exception 'FC3 go-live refused: {SLUG} did not reach status available';
  end if;

  select count(*) filter (where status = 'available'),
         count(*) filter (where status = 'coming_soon')
    into v_available, v_soon
    from public.academy_apps;

  raise notice 'FC3 go-live: {SLUG} available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
    v_lessons, v_questions, v_capstones, 18, v_available, v_soon;
end $$;""")

sql = HEADER + '\n\n' + '\n'.join(body) + '\n'

# ------------------------------- EVERY REFUSAL NAMES THE FIELD IT IS ABOUT
# A go-live that refuses without naming the graded field leaves the reader to
# work out which of eighteen moved, and the dry run's own negative control
# could not tell a real refusal from any other. So every `raise` that reads a
# graded value has that value's KEY appended to its message, generated from the
# variable map rather than typed, and the guard below refuses to write a file in
# which a value assertion names no field at all.
BY_VAR = {v: k for k, v in V.items()}
RAISE = re.compile(r"raise exception '((?:[^']|'')*)'((?:[^;']|'(?:[^']|'')*')*);", re.S)


def name_the_field(m):
    msg, args = m.group(1), m.group(2)
    keys = []
    for tok in re.findall(r'\bv_[a-z0-9_]+\b', m.group(0)):
        if tok in BY_VAR and BY_VAR[tok] not in keys:
            keys.append(BY_VAR[tok])
    if not keys:
        return m.group(0)
    return f"raise exception '{msg} [graded field: {', '.join(keys)}]'{args};"


sql = RAISE.sub(name_the_field, sql)

# THE GUARD, and it is about the half that matters: every assertion that reads
# a graded value must refuse with that value's name in the sentence.
named = set()
for m in RAISE.finditer(sql):
    g = re.search(r'\[graded field: ([^\]]*)\]', m.group(1))
    if g:
        named.update(x.strip() for x in g.group(1).split(','))
unnamed = [f'{k} is graded and no refusal in this file names it' for k in F if k not in named]

for m in RAISE.finditer(sql):
    reads = [t for t in re.findall(r'\bv_[a-z0-9_]+\b', m.group(0)) if t in BY_VAR]
    if reads and 'graded field:' not in m.group(1):
        unnamed.append(f'a refusal reads {reads} and names no graded field: {m.group(1)[:80]}')


# --------------------------------------------- THE INTEGER-DIVISION GUARD
# Any `/ <integer>` not followed by a decimal point or an exponent is a
# truncating division in Postgres the moment its numerator is an integer too.
# Comment lines are exempt: they talk about the trap.
intdiv = []
for n, line in enumerate(sql.splitlines(), 1):
    code = '' if line.lstrip().startswith('--') else line.split('--', 1)[0]
    for m in re.finditer(r'/\s*(\d+)(?![\d.eE])', code):
        intdiv.append(f'line {n}: "/ {m.group(1)}" has a bare integer denominator -> {line.strip()[:90]}')

# A MALFORMED NUMERIC LITERAL. This guard exists because the first run of this
# generator emitted `2.0.0`, from a float already carrying its own point being
# given a second one by the template. Postgres would have refused it, but only
# at the dry run, and only on the branch that reached it: a literal wrong in a
# way SQL happens to accept would never have been found at all.
malformed = []
for n, line in enumerate(sql.splitlines(), 1):
    code = '' if line.lstrip().startswith('--') else line.split('--', 1)[0]
    for m in re.finditer(r'\d+\.\d+\.\d', code):
        malformed.append(f'line {n}: malformed numeric literal "{m.group(0)}" -> {line.strip()[:90]}')


dashes = len(re.findall('[–—]', sql))
if refused or intdiv or malformed or unnamed or dashes:
    print('REFUSED, nothing written:')
    for b in refused + intdiv + malformed + unnamed:
        print('  ', b)
    if dashes:
        print('   en/em dashes:', dashes)
    sys.exit(1)

open(OUT, 'w').write(sql)
print(f'wrote {OUT}: {len(sql.splitlines())} lines')
print(f'integer-division guard: 0 bare integer denominators in {sql.count("/")} divisions')
print(f'digest literals swept: {len(published)} | handed-in-prompt values: {len(handed)} | held quantities: {len(HELD)}')
print('graded fields colliding with any of those three lists, at their own tolerance: 0')
print(f'refusals that read a graded value: {sum(1 for m in RAISE.finditer(sql) if chr(91) + chr(103) + "raded field:" in m.group(1))}, every one of them naming the field by key')
print(f'stage count: byRatio {by_ratio}, byTemp {by_temp}, so {stages} stages governed by '
      f'{"discharge temperature" if by_temp > by_ratio else "ratio per stage"}; '
      f'{stages - 1} stages would reach {tout[stages - 1]:.4f} degF against the stated {BONNY_TMAX:.0f}')
print(f'implied stage average z {z_implied:.9f} | fuel implies {ratio_to_stage1:.6f} first stages')
print('every identity this file asserts, checked here first:')
for what, diff, eps in checks:
    print(f'  {diff:.3e} <= {eps:.0e}  {what}')
