#!/usr/bin/env python3
"""Generate the FC8 go-live migration.

Modelled on tools/course-waves/heattransfer/gen_golive.py (FC6), which is where
every guard in this file was learned.

NOTHING HERE IS RETYPED. The eighteen graded values are read out of the
CAPSTONE ROWS THE LADDER ITSELF SEEDED, by key, inside the same transaction, so
the file verifies what it shipped rather than what a generator remembered. The
numbers a learner is handed are parsed out of the shipped prompts BY POSTGRES,
and the published figures a graded value may not collide with are every numeric
literal the teaching digest prints.

EIGHTEEN OF THE EIGHTEEN GRADED VALUES ARE ASSERTED BY EXACT CLOSED FORM from
the conditions the prompts state. Two of them are BISECTED by the capstone
generator on a word the engine returns (the gravity at which the water test
takes the bottom course, and the draw rate at which vacuum takes the venting
case), and each of those two is ALSO asserted as the root it is: the design and
test thicknesses equal at the graded gravity, and the two venting totals equal
at the graded draw rate.

AND ELEVEN ARE ASSERTED A SECOND TIME, BY A ROUTE WITH NOTHING IN COMMON with
the first, because a gate that restates the formula validates nothing: the
transmitter pair against each other, the budget against the bounds of its own
contributions, the gross volume multiplied back out to the pulse count, the
coefficient squared back out to the flow, the sigma multiplied back out to the
pressure it divides, the travel inverted back through the characteristic to the
required coefficient, the two roots, the working capacity as a fraction of the
nominal, and the capstone's own premises (the valve IS choked, the tank IS
below its proportional limit, the draw IS on the pressure side).

WHAT IT REFUSES TO WRITE, all five carried from FC6: a division with a bare
integer denominator, a malformed numeric literal, a refusal that reads a graded
value and does not name it, a graded value colliding at its SHIPPED tolerance
with a handed number, a published number or a held quantity, and an em or en
dash.

Usage: python3 gen_golive.py
   FC8_WAVE        the wave directory (default /root/fc-wip-metering)
   FC8_REPO        the nextgen clone   (default /root/wt-fc8-nextgen)
   FC8_COURSE_SQL  the course migration this ladder emits, for the prompt sweep
   FC8_GOLIVE_OUT  where to write
"""
import json
import math
import os
import re
import sys

W = os.environ.get('FC8_WAVE', '/root/fc-wip-metering')
REPO = os.environ.get('FC8_REPO', '/root/wt-fc8-nextgen')
COURSE = os.environ.get('FC8_COURSE_SQL', f'{REPO}/migrations/20260925_fc8_metering_course.sql')
OUT = os.environ.get('FC8_GOLIVE_OUT', f'{REPO}/migrations/20260925_fc8_metering_go_live.sql')
SLUG = 'metering'
PATH_ORDER = 46

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
# Every one of these is stated in a capstone prompt, and gen_course.py refuses
# a prompt that omits one.
KR_PIPE, KR_ORIF, KR_DP, KR_SPAN, KR_ACC = 7.981, 3.8747, 87.43, 425.0, 0.072
KR_UCD, KR_UEPS, KR_UBORE, KR_UPIPE, KR_URHO = 0.47, 0.18, 0.043, 0.11, 0.28
KR_P1 = 614.7
KR_PULSES, KR_KF, KR_MF = 4187233.0, 912.47, 1.0034
# THE ONE ENGINE CONSTANT A GRADED FIELD PASSES THROUGH. It is module private,
# and the digest MEASURES it (Section 3) rather than typing it; the same figure
# is printed there to the seven significant figures the engine holds.
INH2O_TO_PSI = 0.0361273

UT_Q, UT_P1, UT_P2, UT_SG = 742.6, 428.3, 72.4, 0.7134
UT_PV, UT_PC, UT_FL = 41.62, 566.8, 0.93
UT_DPSYS, UT_CVRATED, UT_R, UT_CVNORMAL = 452.8, 88.0, 42.5, 34.62

SA_D, SA_H, SA_LL, SA_SG = 78.4, 44.0, 42.6, 0.8312
SA_SD, SA_ST, SA_CA, SA_MIN = 25300.0, 27000.0, 0.0625, 0.25
SA_SCFH, SA_LAT, SA_LOWOUT, SA_LIMIT = 1.12, 1.08, 0.58, 41500.0
SA_FILL, SA_DRAW = 4820.0, 1150.0
SA_UNC, SA_EFF = 214860.0, 93.4
FT3_PER_BBL = (42.0 * 231.0) / 1728.0

# THE QUANTITIES THE THREE ENGINES CALL THEIR OWN STATED DATA, OR HOLD, with the
# label each is refused under. No graded value may land within its own
# tolerance of any of them.
HELD = [
    (2.0, 'the cavitating sigma threshold, a stated screen'),
    (3.0, 'the incipient sigma threshold, a stated screen'),
    (0.5, 'the good authority boundary, a stated screen'),
    (0.25, 'the poor authority boundary, a stated screen'),
    (4.0, 'the high noise pressure ratio band'),
    (10.0, 'the severe noise pressure ratio band'),
    (1.0, 'the quiet stream power band, 1 kW'),
    (1000.0, 'the loud stream power band, 1000 kW'),
    (9.0, 'the differential turndown limit the engine holds'),
    (0.075, 'the default transmitter accuracy'),
    (0.2, 'the default expansibility uncertainty'),
    (0.05, 'the default bore uncertainty'),
    (0.1, 'the default pipe uncertainty, and the lower published beta edge'),
    (0.3, 'the default density uncertainty'),
    (0.6, 'the high beta trade threshold, and the default low-volatility factor'),
    (0.75, 'the upper published beta edge'),
    (2.8, 'the small bore threshold'),
    (0.1875, 'the default minimum plate thickness'),
    (23200.0, 'the default design allowable stress'),
    (24900.0, 'the default test allowable stress'),
    (20000.0, 'the default proportional limit, and a fire band constant'),
    (24.0, 'the factor between the two withheld vent relations'),
    (30.0, 'the wetted height cap'),
    (200.0, 'a fire heat input band edge'),
    (2800.0, 'a fire heat input band edge'),
    (199300.0, 'a fire heat input band constant'),
    (963400.0, 'a fire heat input band constant'),
    (21000.0, 'a fire heat input band constant'),
    (0.566, 'a fire heat input band exponent'),
    (0.338, 'a fire heat input band exponent'),
    (0.82, 'a fire heat input band exponent'),
]
for fl, xt in ((0.9, 0.72), (0.8, 0.55), (0.9, 0.75), (0.97, 0.9), (0.68, 0.38),
               (0.55, 0.2), (0.66, 0.3), (0.55, 0.15)):
    HELD.append((fl, 'a valve style table FL, stated table data'))
    HELD.append((xt, 'a valve style table xT, stated table data'))
for d in (10, 14, 18, 26, 36, 44, 16, 22, 42, 5, 8, 12, 13, 19):
    HELD.append((float(d), 'a straight-run table value, stated table data'))
for pct in (60.0, 90.0, 98.0):
    HELD.append((pct, 'a customary control efficiency, typed rather than computed'))
HELD = sorted({(v, lab) for v, lab in HELD})

# THE KEY FRAGMENTS THAT NAME A HELD OR WITHHELD PATH, deliberately specific.
FORBIDDEN_KEY_FRAGMENTS = [
    'regime', 'noise', 'band', 'vent_scfh', 'fire', 'emergency', 'straight_run',
    'net_standard', 'ctl', 'cpl', 'reynolds_factor', 'verdict', 'characteristic',
    'style', 'turnover', 'standing_loss', 'working_loss',
]
FORBIDDEN_LABEL_FRAGMENTS = [
    'regime', 'noise band', 'vent capacity', 'straight run', 'straight-run',
    'net standard', 'verdict', 'turnover', 'emergency', 'style table',
]

refused = []
for tier, key, val, tol in fields:
    for frag in FORBIDDEN_KEY_FRAGMENTS:
        if frag in key:
            refused.append(f'{tier}.{key} names a held path through "{frag}"')
    for h, label in HELD:
        if abs(abs(val) - h) <= tol:
            refused.append(f'{tier}.{key} = {val} is within {tol} of {h} ({label}), which is HELD')
# THE GUARD MUST DISCRIMINATE, both ways.
if not [frag for frag in FORBIDDEN_KEY_FRAGMENTS if frag in 'saghara_fire_vent_scfh']:
    refused.append('the forbidden-key sweep does not catch a planted fire_vent_scfh key')
if any(frag in 'utonana_valve_authority' for frag in FORBIDDEN_KEY_FRAGMENTS):
    refused.append('the forbidden-key sweep fires on utonana_valve_authority, a ratio of two drops')
if any(frag in 'saghara_vacuum_governing_draw_bblhr' for frag in FORBIDDEN_KEY_FRAGMENTS):
    refused.append('the forbidden-key sweep fires on the vacuum crossover draw rate')

# ---------------------------------------------------------------------------
# THE ARITHMETIC IS CHECKED HERE BEFORE IT IS EMITTED.
# ---------------------------------------------------------------------------
checks = []


def same(what, a, b, eps):
    checks.append((what, abs(a - b), eps))
    if not abs(a - b) <= eps:
        refused.append(f'{what}: {a} against {b}, difference {abs(a - b)} exceeds {eps}')


# Associate, KRAKAMA.
beta = KR_ORIF / KR_PIPE
same('KRAKAMA beta', beta, g('beginner', 'krakama_beta_ratio'), 1e-15)
same('KRAKAMA differential in psi', KR_DP * INH2O_TO_PSI, g('beginner', 'krakama_differential_psi'), 1e-12)
pct = KR_ACC * KR_SPAN / KR_DP
same('KRAKAMA transmitter percent of reading', pct,
     g('beginner', 'krakama_transmitter_uncertainty_pct'), 1e-13)
td = math.sqrt(KR_SPAN / KR_DP)
same('KRAKAMA flow turndown', td, g('beginner', 'krakama_flow_turndown_ratio'), 1e-13)
same('KRAKAMA the transmitter pair against EACH OTHER, pct = accuracy x turndown^2',
     KR_ACC * g('beginner', 'krakama_flow_turndown_ratio') ** 2,
     g('beginner', 'krakama_transmitter_uncertainty_pct'), 1e-12)
if not td < 3.0:
    refused.append('KRAKAMA is past the flow turndown limit, so its warning fires and the pair is a warning number')
b4 = beta ** 4
contribs = [KR_UCD, KR_UEPS, (2.0 + 2.0 * b4 / (1.0 - b4)) * KR_UBORE,
            (2.0 * b4 / (1.0 - b4)) * KR_UPIPE, 0.5 * pct, 0.5 * KR_URHO]
total = math.sqrt(sum(c * c for c in contribs))
same('KRAKAMA total uncertainty', total, g('beginner', 'krakama_total_uncertainty_pct'), 1e-13)
if not (max(contribs) <= g('beginner', 'krakama_total_uncertainty_pct') <= sum(contribs)):
    refused.append('KRAKAMA total lies outside the bounds of its own contributions')
gross = KR_PULSES / KR_KF * KR_MF
same('KRAKAMA gross volume', gross, g('beginner', 'krakama_turbine_gross_bbl'), 1e-9)
same('KRAKAMA gross volume MULTIPLIED BACK OUT to the pulse count',
     g('beginner', 'krakama_turbine_gross_bbl') / KR_MF * KR_KF, KR_PULSES, 1e-6)

# Professional, UTONANA.
ff = 0.96 - 0.28 * math.sqrt(UT_PV / UT_PC)
same('UTONANA FF', ff, g('intermediate', 'utonana_ff_critical_ratio'), 1e-15)
allow = UT_FL * UT_FL * (UT_P1 - ff * UT_PV)
same('UTONANA allowable drop', allow, g('intermediate', 'utonana_allowable_drop_psi'), 1e-11)
if not allow < UT_P1 - UT_P2:
    refused.append('UTONANA is not choked, so the Professional capstone teaches nothing')
cv = UT_Q * math.sqrt(UT_SG / allow)
same('UTONANA Cv on the drop used', cv, g('intermediate', 'utonana_liquid_cv'), 1e-12)
same('UTONANA Cv SQUARED BACK OUT to the flow',
     g('intermediate', 'utonana_liquid_cv') ** 2 * g('intermediate', 'utonana_allowable_drop_psi') / UT_SG,
     UT_Q * UT_Q, 1e-6)
sigma = (UT_P1 - UT_PV) / allow
same('UTONANA sigma', sigma, g('intermediate', 'utonana_cavitation_sigma'), 1e-13)
same('UTONANA sigma MULTIPLIED BACK OUT to the inlet less the vapour pressure',
     g('intermediate', 'utonana_cavitation_sigma') * g('intermediate', 'utonana_allowable_drop_psi'),
     UT_P1 - UT_PV, 1e-10)
auth = (UT_P1 - UT_P2) / UT_DPSYS
same('UTONANA authority', auth, g('intermediate', 'utonana_valve_authority'), 1e-15)
travel = 100.0 * (1.0 + math.log(UT_CVNORMAL / UT_CVRATED) / math.log(UT_R))
same('UTONANA normal travel', travel, g('intermediate', 'utonana_normal_travel_pct'), 1e-11)
same('UTONANA travel INVERTED through the characteristic to the required coefficient',
     UT_CVRATED * UT_R ** (g('intermediate', 'utonana_normal_travel_pct') / 100.0 - 1.0),
     UT_CVNORMAL, 1e-10)

# Expert, SAGHARA.
lever = 2.6 * SA_D * (SA_LL - 1.0)
t_design = lever * SA_SG / SA_SD + SA_CA
t_test = lever / SA_ST
same('SAGHARA bottom course required', max(t_design, t_test, SA_MIN),
     g('advanced', 'saghara_bottom_course_required_in'), 1e-15)
if not t_design > max(t_test, SA_MIN):
    refused.append('SAGHARA bottom course is not governed by the product at the design gravity')
sg_star = SA_SD / SA_ST - SA_CA * SA_SD / lever
same('SAGHARA crossover gravity, closed form', sg_star, g('advanced', 'saghara_sg_at_which_test_governs'), 1e-12)
same('SAGHARA crossover gravity AS A ROOT: the two thicknesses meet there',
     lever * g('advanced', 'saghara_sg_at_which_test_governs') / SA_SD + SA_CA, t_test, 1e-12)
nominal = math.pi * SA_D * SA_D / 4.0 * SA_H / FT3_PER_BBL
if not nominal < SA_LIMIT:
    refused.append('SAGHARA is above its stated proportional limit, so its inbreathing is an extrapolation')
thermal_in = nominal * SA_SCFH * SA_LAT
inbreathing = thermal_in + SA_DRAW * FT3_PER_BBL
same('SAGHARA inbreathing', inbreathing, g('advanced', 'saghara_inbreathing_scfh'), 1e-7)
outbreathing = SA_LOWOUT * thermal_in + SA_FILL * FT3_PER_BBL
if not inbreathing < outbreathing:
    refused.append('SAGHARA is already on vacuum at the stated draw')
d_star = (outbreathing - thermal_in) / FT3_PER_BBL
same('SAGHARA vacuum crossover draw, closed form', d_star,
     g('advanced', 'saghara_vacuum_governing_draw_bblhr'), 1e-7)
same('SAGHARA crossover draw AS A ROOT: inbreathing meets outbreathing there',
     thermal_in + g('advanced', 'saghara_vacuum_governing_draw_bblhr') * FT3_PER_BBL, outbreathing, 1e-6)
working = math.pi * SA_D * SA_D / 4.0 * SA_LL / FT3_PER_BBL
same('SAGHARA working capacity', working, g('advanced', 'saghara_working_capacity_bbl'), 1e-8)
same('SAGHARA working capacity as a FRACTION OF THE NOMINAL is the level over the shell',
     g('advanced', 'saghara_working_capacity_bbl') / nominal, SA_LL / SA_H, 1e-14)
same('SAGHARA saving', SA_UNC * SA_EFF / 100.0, g('advanced', 'saghara_recovery_saved_lb_yr'), 1e-8)

# EVERY NUMBER THE DIGEST PRINTS.
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
# EVERY NUMBER A LEARNER IS HANDED, read out of the COURSE MIGRATION this ladder
# emits. The comment half is dropped first, because an apostrophe in a header
# throws the quote pairing off and the sweep would then read nothing at all.
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
if len(handed) < 30:
    refused.append(f'only {len(handed)} numbers were parsed out of the shipped prompts, '
                   'so the handed-value sweep is reading the wrong thing')
for tier, key, val, tol in fields:
    for h in handed:
        if abs(abs(val) - h) <= tol:
            refused.append(f'{tier}.{key} = {val} is within {tol} of {h}, handed in a prompt')

# ---------------------------------------------------------------------------
# THE SQL
# ---------------------------------------------------------------------------
HEADER = f"""-- ============================================================================
-- FC8 GO-LIVE (HELD): Metering, Control Valves & Storage flips to 'available',
-- a Facilities course at path_order {PATH_ORDER}.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/metering. The 78 lessons, the teaching lab
-- (meteringLab.js) and its four explorer panels (the meter run, the choking,
-- the venting and the withheld) ship in the ZIP and NOT in this database, so a
-- flip before the upload puts a live catalogue tile in front of a route that
-- does not exist. Every Facilities and Drilling wave on this programme has held
-- its go-live behind one verified upload, and this file is written, dry-run and
-- left unapplied on purpose.
--
-- EVERY DENOMINATOR BELOW IS A FLOAT, ON PURPOSE. Postgres divides integer by
-- integer as an integer, and a Python check proving the same identity cannot
-- see it. The generator that wrote this file refuses to emit a division with a
-- bare integer denominator, and refuses a malformed numeric literal.
--
-- ALL EIGHTEEN GRADED VALUES ARE ASSERTED BY EXACT CLOSED FORM from the
-- conditions the prompts state. The two the capstone generator BISECTS on a
-- word the engine returns, the gravity at which the water test takes the
-- bottom course and the draw rate at which vacuum takes the venting case, are
-- ALSO asserted as the roots they are: the two thicknesses meet at the graded
-- gravity, and the two venting totals meet at the graded draw rate.
--
-- AND ELEVEN ARE ASSERTED A SECOND TIME, by a route with nothing in common
-- with the first, because a gate that restates the formula validates nothing:
--
--   * the transmitter percent of reading against the graded flow turndown,
--     which is the same rule written in two quantities;
--   * the total uncertainty against the bounds of its own six contributions;
--   * the gross turbine volume multiplied back out to the pulse count;
--   * the valve coefficient squared back out to the stated flow;
--   * sigma multiplied back out to the inlet less the vapour pressure;
--   * the normal travel inverted through the characteristic to the required
--     coefficient;
--   * the two roots above; and the working capacity as a fraction of the
--     nominal, which is the level over the shell and nothing else;
--   * and the capstones' own premises: the valve IS choked, the meter run IS
--     inside its turndown limit and its proving screen, the tank IS below its
--     stated proportional limit and on the pressure side at its stated draw.
--
-- EVERY REFUSAL NAMES THE GRADED FIELD IT READ, condition included and not only
-- message, so a reader is never left looking at the trusting half of a
-- disagreeing pair.
-- ============================================================================"""

body = []
A = body.append

A('do $$')
A('declare')
A('  v_structures int; v_questions int; v_capstones int; v_lessons int;')
A('  v_modules int; v_graded int; v_available int; v_soon int;')
A('  v_names text;')
A('  v_b4 double precision; v_total double precision; v_lever double precision;')
A('  v_tdesign double precision; v_ttest double precision;')
A('  v_nominal double precision; v_thermal double precision;')
A('  v_in double precision; v_out double precision;')
for (t, k) in V:
    A(f'  {V[(t, k)]} double precision;')
A('begin')

A(f'''
  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures
   where app_slug = '{SLUG}' and active;
  if v_structures <> 3 then
    raise exception 'FC8 go-live refused: {SLUG} has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions from public.academy_quiz_questions where app_slug = '{SLUG}';
  if v_questions <> 396 then
    raise exception 'FC8 go-live refused: {SLUG} has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_graded from (
    select tier from public.academy_quiz_questions where app_slug = '{SLUG}'
     group by tier having count(*) <> 132) t;
  if v_graded <> 0 then
    raise exception 'FC8 go-live refused: % tier(s) do not carry exactly 132 questions', v_graded;
  end if;

  select count(*) into v_graded from (
    select tier, module_key from public.academy_quiz_questions
     where app_slug = '{SLUG}' and scope = 'module'
     group by tier, module_key having count(*) <> 15) t;
  if v_graded <> 0 then
    raise exception 'FC8 go-live refused: % module bank(s) do not carry exactly 15 questions', v_graded;
  end if;

  select count(*) into v_graded from (
    select tier from public.academy_quiz_questions
     where app_slug = '{SLUG}' and scope = 'final'
     group by tier having count(*) <> 42) t;
  if v_graded <> 0 then
    raise exception 'FC8 go-live refused: % final exam(s) do not carry exactly 42 questions', v_graded;
  end if;

  -- A question whose key is outside its own options is unanswerable, and it is
  -- the one shape a count of rows can never see.
  select count(*) into v_graded from public.academy_quiz_questions
   where app_slug = '{SLUG}'
     and (jsonb_array_length(options) <> 4
          or answer_index < 0 or answer_index > 3);
  if v_graded <> 0 then
    raise exception 'FC8 go-live refused: % question(s) do not offer four options with a key inside them', v_graded;
  end if;

  select count(*) into v_capstones from public.academy_capstones where app_slug = '{SLUG}';
  if v_capstones <> 3 then
    raise exception 'FC8 go-live refused: {SLUG} has % capstones, expected 3', v_capstones;
  end if;

  select count(*) into v_lessons
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m,
         lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = '{SLUG}' and s.active;
  if v_lessons <> 78 then
    raise exception 'FC8 go-live refused: {SLUG} carries % lesson keys, expected 78', v_lessons;
  end if;

  select count(*) into v_modules
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = '{SLUG}' and s.active;
  if v_modules <> 18 then
    raise exception 'FC8 go-live refused: {SLUG} carries % modules, expected 18 (six per tier)', v_modules;
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
    raise exception 'FC8 go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_graded;
  end if;

  select count(*) into v_graded from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f where c.app_slug = '{SLUG}';
  if v_graded <> 18 then
    raise exception 'FC8 go-live refused: {SLUG} has % graded capstone fields, expected 18', v_graded;
  end if;

  select count(*) into v_graded from (
    select c.tier from public.academy_capstones c,
           lateral jsonb_array_elements(c.fields) f
     where c.app_slug = '{SLUG}' group by c.tier having count(*) <> 6) t;
  if v_graded <> 0 then
    raise exception 'FC8 go-live refused: % tier(s) do not grade exactly six fields', v_graded;
  end if;

  if not exists (select 1 from public.academy_apps
                  where slug = '{SLUG}' and module = 'facilities'
                    and path_order = {PATH_ORDER} and prereq_slug is null) then
    raise exception 'FC8 go-live refused: the {SLUG} catalogue row is not facilities at path_order {PATH_ORDER} with no prerequisite';
  end if;

  if exists (select 1 from public.academy_apps
              where path_order = {PATH_ORDER} and slug <> '{SLUG}') then
    raise exception 'FC8 go-live refused: another course already holds path_order {PATH_ORDER}';
  end if;


  -- ------------------------------------------- the held and withheld gates
  -- ON THE NAME. A graded field that NAMES a held, uncited or withheld path is
  -- refused before anything is computed from it.
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array[{', '.join("'" + x + "'" for x in FORBIDDEN_KEY_FRAGMENTS)}]) frag
   where c.app_slug = '{SLUG}' and (f->>'key') like '%' || frag || '%';
  if v_graded <> 0 then
    raise exception 'FC8 go-live refused: % graded field(s) name a held or withheld path: %', v_graded, v_names;
  end if;

  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array[{', '.join("'" + x + "'" for x in FORBIDDEN_LABEL_FRAGMENTS)}]) frag
   where c.app_slug = '{SLUG}' and lower(f->>'label') like '%' || frag || '%';
  if v_graded <> 0 then
    raise exception 'FC8 go-live refused: % graded field label(s) name a held or withheld path: %', v_graded, v_names;
  end if;

  -- ON THE VALUE. A graded answer landing on a number an engine calls its own
  -- stated data, within its own shipped tolerance, is a lookup of that data.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key') || ' on ' || h.lab, ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array[{', '.join(f17(v) for v, _l in HELD)}], array[{', '.join("'" + l.replace("'", "''") + "'" for _v, l in HELD)}]) as h(val, lab)
   where c.app_slug = '{SLUG}'
     and abs(abs((f->>'expected')::double precision) - h.val) <= (f->>'tol')::double precision;
  if v_graded <> 0 then
    raise exception 'FC8 go-live refused: % graded field(s) land on a quantity an engine holds or calls its own stated data: %', v_graded, v_names;
  end if;

  -- ---------------------------------------------------- the collision sweeps
  -- EVERY NUMBER THE TEACHING DIGEST PRINTS, at each field's SHIPPED tolerance.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key'), ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array[{', '.join(f17(x) for x in sorted(published))}]) pub
   where c.app_slug = '{SLUG}'
     and abs(abs((f->>'expected')::double precision) - pub) <= (f->>'tol')::double precision;
  if v_graded <> 0 then
    raise exception 'FC8 go-live refused: % graded field(s) sit within their own tolerance of a value the digest publishes, which makes them a lookup rather than a calculation: %', v_graded, v_names;
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
    raise exception 'FC8 go-live refused: % graded field(s) land on a number the learner is handed in a prompt, which makes the field a transcription rather than a calculation: %', v_graded, v_names;
  end if;

  -- AND PAIRWISE.
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
    raise exception 'FC8 go-live refused: % pair(s) of graded fields are within the looser of their two tolerances: %', v_graded, v_names;
  end if;

  -- A capstone prompt stating another tier's graded answer hands that tier away.
  select count(*), string_agg(distinct c.tier || ' states ' || gg.owner || '/' || gg.k, ', ')
    into v_graded, v_names from public.academy_capstones c,
         (select f->>'expected' as e, f->>'key' as k, c2.tier as owner
            from public.academy_capstones c2, lateral jsonb_array_elements(c2.fields) f
           where c2.app_slug = '{SLUG}') gg
   where c.app_slug = '{SLUG}' and c.tier <> gg.owner and c.prompt like '%' || gg.e || '%';
  if v_graded <> 0 then
    raise exception 'FC8 go-live refused: % capstone prompt(s) state a graded value belonging to another tier: %', v_graded, v_names;
  end if;

''')

# ------------------------------------------------ load the eighteen values
A('  -- --------------------------------------- the eighteen graded values')
for (t, k), var in V.items():
    A(f"  select (f->>'expected')::double precision into {var}")
    A('    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f')
    A(f"   where c.app_slug = '{SLUG}' and c.tier = '{t}' and f->>'key' = '{k}';")
A('  if ' + ' or '.join(f'{v} is null' for v in V.values()) + ' then')
A("    raise exception 'FC8 go-live refused: one or more of the eighteen graded fields is missing';")
A('  end if;')
A('')


def VB(k):
    return V[('beginner', k)]


def VI(k):
    return V[('intermediate', k)]


def VE(k):
    return V[('advanced', k)]


A(f'''  -- ------------------------------------------------- the Associate, KRAKAMA
  if abs({VB('krakama_beta_ratio')} - {f17(KR_ORIF)} / {f17(KR_PIPE)}) > 1e-15 then
    raise exception 'FC8 go-live refused: the beta of % is not the stated bore of % in over the stated pipe of % in', {VB('krakama_beta_ratio')}, {f17(KR_ORIF)}, {f17(KR_PIPE)};
  end if;
  if not ({VB('krakama_beta_ratio')} > 0.1 and {VB('krakama_beta_ratio')} < 0.75) then
    raise exception 'FC8 go-live refused: the beta of % is outside the published range the digest measures, so the graded coefficient chain is an extrapolation', {VB('krakama_beta_ratio')};
  end if;

  -- The differential passes through the ONE engine constant the digest measures.
  if abs({VB('krakama_differential_psi')} - {f17(KR_DP)} * {f17(INH2O_TO_PSI)}) > 1e-12 then
    raise exception 'FC8 go-live refused: the differential of % psi is not the stated % in H2O at the measured % psi per in H2O', {VB('krakama_differential_psi')}, {f17(KR_DP)}, {f17(INH2O_TO_PSI)};
  end if;
  if not ({VB('krakama_differential_psi')} < {f17(KR_P1)}) then
    raise exception 'FC8 go-live refused: the differential of % psi is at or above the static pressure, which the engine refuses', {VB('krakama_differential_psi')};
  end if;

  if abs({VB('krakama_transmitter_uncertainty_pct')} - {f17(KR_ACC)} * {f17(KR_SPAN)} / {f17(KR_DP)}) > 1e-13 then
    raise exception 'FC8 go-live refused: the transmitter uncertainty of % percent is not % percent of a % in H2O span read at % in H2O', {VB('krakama_transmitter_uncertainty_pct')}, {f17(KR_ACC)}, {f17(KR_SPAN)}, {f17(KR_DP)};
  end if;
  if abs({VB('krakama_flow_turndown_ratio')} - sqrt({f17(KR_SPAN)} / {f17(KR_DP)})) > 1e-13 then
    raise exception 'FC8 go-live refused: the flow turndown of % is not the square root of the span over the reading', {VB('krakama_flow_turndown_ratio')};
  end if;
  -- THE PAIR AGAINST EACH OTHER. Percent of reading is the accuracy times the
  -- DIFFERENTIAL turndown, which is the flow turndown squared.
  if abs({f17(KR_ACC)} * {VB('krakama_flow_turndown_ratio')} ^ 2.0 - {VB('krakama_transmitter_uncertainty_pct')}) > 1e-12 then
    raise exception 'FC8 go-live refused: % percent at a flow turndown of % is not the accuracy times the turndown squared', {VB('krakama_transmitter_uncertainty_pct')}, {VB('krakama_flow_turndown_ratio')};
  end if;
  if not ({VB('krakama_flow_turndown_ratio')} < 3.0) then
    raise exception 'FC8 go-live refused: the flow turndown of % is past the limit, so the graded pair is a warning number', {VB('krakama_flow_turndown_ratio')};
  end if;

  -- THE BUDGET, from the graded beta and the graded transmitter figure.
  v_b4 := {VB('krakama_beta_ratio')} ^ 4.0;
  v_total := sqrt({f17(KR_UCD)} ^ 2.0 + {f17(KR_UEPS)} ^ 2.0
               + ((2.0 + 2.0 * v_b4 / (1.0 - v_b4)) * {f17(KR_UBORE)}) ^ 2.0
               + ((2.0 * v_b4 / (1.0 - v_b4)) * {f17(KR_UPIPE)}) ^ 2.0
               + (0.5 * {VB('krakama_transmitter_uncertainty_pct')}) ^ 2.0
               + (0.5 * {f17(KR_URHO)}) ^ 2.0);
  if abs({VB('krakama_total_uncertainty_pct')} - v_total) > 1e-13 then
    raise exception 'FC8 go-live refused: the total uncertainty of % percent is not the root sum of squares % of the six stated terms', {VB('krakama_total_uncertainty_pct')}, v_total;
  end if;
  if not ({VB('krakama_total_uncertainty_pct')} >= {f17(KR_UCD)}
          and {VB('krakama_total_uncertainty_pct')} <= {f17(KR_UCD)} + {f17(KR_UEPS)} + (2.0 + 2.0 * v_b4 / (1.0 - v_b4)) * {f17(KR_UBORE)}
             + (2.0 * v_b4 / (1.0 - v_b4)) * {f17(KR_UPIPE)} + 0.5 * {VB('krakama_transmitter_uncertainty_pct')} + 0.5 * {f17(KR_URHO)}) then
    raise exception 'FC8 go-live refused: the total uncertainty of % percent lies outside the bounds of its own contributions', {VB('krakama_total_uncertainty_pct')};
  end if;

  if abs({VB('krakama_turbine_gross_bbl')} - {f17(KR_PULSES)} / {f17(KR_KF)} * {f17(KR_MF)}) > 1e-9 then
    raise exception 'FC8 go-live refused: the gross volume of % bbl is not % pulses over % pulses per bbl times a meter factor of %', {VB('krakama_turbine_gross_bbl')}, {f17(KR_PULSES)}, {f17(KR_KF)}, {f17(KR_MF)};
  end if;
  if abs({VB('krakama_turbine_gross_bbl')} / {f17(KR_MF)} * {f17(KR_KF)} - {f17(KR_PULSES)}) > 1e-6 then
    raise exception 'FC8 go-live refused: the gross volume of % bbl does not multiply back out to the % pulses counted', {VB('krakama_turbine_gross_bbl')}, {f17(KR_PULSES)};
  end if;
  if abs({f17(KR_MF)} - 1.0) > 0.01 then
    raise exception 'FC8 go-live refused: the stated meter factor is outside the proving screen, so the graded volume carries a warning';
  end if;

  -- ---------------------------------------------- the Professional, UTONANA
  if abs({VI('utonana_ff_critical_ratio')} - (0.96 - 0.28 * sqrt({f17(UT_PV)} / {f17(UT_PC)}))) > 1e-15 then
    raise exception 'FC8 go-live refused: FF of % is not the critical pressure ratio factor at a vapour pressure of % and a critical pressure of % psia', {VI('utonana_ff_critical_ratio')}, {f17(UT_PV)}, {f17(UT_PC)};
  end if;
  if abs({VI('utonana_allowable_drop_psi')} - {f17(UT_FL)} ^ 2.0 * ({f17(UT_P1)} - {VI('utonana_ff_critical_ratio')} * {f17(UT_PV)})) > 1e-11 then
    raise exception 'FC8 go-live refused: the allowable drop of % psi is not the stated FL squared times the inlet less the graded FF of % times the vapour pressure', {VI('utonana_allowable_drop_psi')}, {VI('utonana_ff_critical_ratio')};
  end if;
  -- THE PREMISE. The Professional capstone is a CHOKED valve on purpose.
  if not ({VI('utonana_allowable_drop_psi')} < {f17(UT_P1)} - {f17(UT_P2)}) then
    raise exception 'FC8 go-live refused: the allowable drop of % psi is not below the stated drop, so the valve is not choked and the tier teaches nothing', {VI('utonana_allowable_drop_psi')};
  end if;
  if abs({VI('utonana_liquid_cv')} - {f17(UT_Q)} * sqrt({f17(UT_SG)} / {VI('utonana_allowable_drop_psi')})) > 1e-12 then
    raise exception 'FC8 go-live refused: the coefficient of % is not the stated flow sized on the graded allowable drop of % psi', {VI('utonana_liquid_cv')}, {VI('utonana_allowable_drop_psi')};
  end if;
  if abs({VI('utonana_liquid_cv')} ^ 2.0 * {VI('utonana_allowable_drop_psi')} / {f17(UT_SG)} - {f17(UT_Q)} ^ 2.0) > 1e-6 then
    raise exception 'FC8 go-live refused: the coefficient of % on the drop of % psi does not square back out to the stated flow', {VI('utonana_liquid_cv')}, {VI('utonana_allowable_drop_psi')};
  end if;
  if abs({VI('utonana_cavitation_sigma')} - ({f17(UT_P1)} - {f17(UT_PV)}) / {VI('utonana_allowable_drop_psi')}) > 1e-13 then
    raise exception 'FC8 go-live refused: sigma of % is not the inlet less the vapour pressure over the graded drop used of % psi', {VI('utonana_cavitation_sigma')}, {VI('utonana_allowable_drop_psi')};
  end if;
  if abs({VI('utonana_cavitation_sigma')} * {VI('utonana_allowable_drop_psi')} - ({f17(UT_P1)} - {f17(UT_PV)})) > 1e-10 then
    raise exception 'FC8 go-live refused: sigma of % times the drop of % psi does not give back the inlet less the vapour pressure', {VI('utonana_cavitation_sigma')}, {VI('utonana_allowable_drop_psi')};
  end if;
  if abs({VI('utonana_valve_authority')} - ({f17(UT_P1)} - {f17(UT_P2)}) / {f17(UT_DPSYS)}) > 1e-15 then
    raise exception 'FC8 go-live refused: the authority of % is not the valve drop over the stated system drop of % psi', {VI('utonana_valve_authority')}, {f17(UT_DPSYS)};
  end if;
  if abs({VI('utonana_normal_travel_pct')} - 100.0 * (1.0 + ln({f17(UT_CVNORMAL)} / {f17(UT_CVRATED)}) / ln({f17(UT_R)}))) > 1e-11 then
    raise exception 'FC8 go-live refused: the normal travel of % percent is not the equal percentage travel of a required % on a rated % at a rangeability of %', {VI('utonana_normal_travel_pct')}, {f17(UT_CVNORMAL)}, {f17(UT_CVRATED)}, {f17(UT_R)};
  end if;
  if abs({f17(UT_CVRATED)} * {f17(UT_R)} ^ ({VI('utonana_normal_travel_pct')} / 100.0 - 1.0) - {f17(UT_CVNORMAL)}) > 1e-10 then
    raise exception 'FC8 go-live refused: the travel of % percent does not invert through the characteristic to the required coefficient of %', {VI('utonana_normal_travel_pct')}, {f17(UT_CVNORMAL)};
  end if;

  -- ----------------------------------------------------- the Expert, SAGHARA
  v_lever := 2.6 * {f17(SA_D)} * ({f17(SA_LL)} - 1.0);
  v_tdesign := v_lever * {f17(SA_SG)} / {f17(SA_SD)} + {f17(SA_CA)};
  v_ttest := v_lever / {f17(SA_ST)};
  if abs({VE('saghara_bottom_course_required_in')} - greatest(v_tdesign, v_ttest, {f17(SA_MIN)})) > 1e-15 then
    raise exception 'FC8 go-live refused: the bottom course of % in is not the largest of the design %, the test % and the stated minimum', {VE('saghara_bottom_course_required_in')}, v_tdesign, v_ttest;
  end if;
  if not (v_tdesign > greatest(v_ttest, {f17(SA_MIN)})) then
    raise exception 'FC8 go-live refused: the product does not govern the bottom course at the stated gravity, so the crossover is not the inversion the tier asks for';
  end if;
  if abs({VE('saghara_sg_at_which_test_governs')} - ({f17(SA_SD)} / {f17(SA_ST)} - {f17(SA_CA)} * {f17(SA_SD)} / v_lever)) > 1e-12 then
    raise exception 'FC8 go-live refused: the crossover gravity of % is not the closed form of the two thicknesses meeting', {VE('saghara_sg_at_which_test_governs')};
  end if;
  if abs(v_lever * {VE('saghara_sg_at_which_test_governs')} / {f17(SA_SD)} + {f17(SA_CA)} - v_ttest) > 1e-12 then
    raise exception 'FC8 go-live refused: at the graded crossover gravity of % the design thickness does not meet the test thickness of % in', {VE('saghara_sg_at_which_test_governs')}, v_ttest;
  end if;

  v_nominal := pi() * {f17(SA_D)} ^ 2.0 / 4.0 * {f17(SA_H)} / {f17(FT3_PER_BBL)};
  if not (v_nominal < {f17(SA_LIMIT)}) then
    raise exception 'FC8 go-live refused: the nominal capacity of % bbl is above the stated proportional limit, so the graded inbreathing is an extrapolation', v_nominal;
  end if;
  v_thermal := v_nominal * {f17(SA_SCFH)} * {f17(SA_LAT)};
  v_in := v_thermal + {f17(SA_DRAW)} * {f17(FT3_PER_BBL)};
  v_out := {f17(SA_LOWOUT)} * v_thermal + {f17(SA_FILL)} * {f17(FT3_PER_BBL)};
  if abs({VE('saghara_inbreathing_scfh')} - v_in) > 1e-7 then
    raise exception 'FC8 go-live refused: the inbreathing of % scfh is not the stated thermal rate on the nominal capacity plus the draw displacement, %', {VE('saghara_inbreathing_scfh')}, v_in;
  end if;
  if not (v_in < v_out) then
    raise exception 'FC8 go-live refused: the tank is already on vacuum at the stated draw, so the crossover is not the inversion the tier asks for';
  end if;
  if abs({VE('saghara_vacuum_governing_draw_bblhr')} - (v_out - v_thermal) / {f17(FT3_PER_BBL)}) > 1e-7 then
    raise exception 'FC8 go-live refused: the crossover draw of % bbl/hr is not the closed form of the two totals meeting', {VE('saghara_vacuum_governing_draw_bblhr')};
  end if;
  if abs(v_thermal + {VE('saghara_vacuum_governing_draw_bblhr')} * {f17(FT3_PER_BBL)} - v_out) > 1e-6 then
    raise exception 'FC8 go-live refused: at the graded crossover draw of % bbl/hr the inbreathing does not meet the outbreathing of % scfh', {VE('saghara_vacuum_governing_draw_bblhr')}, v_out;
  end if;
  if abs({VE('saghara_working_capacity_bbl')} - pi() * {f17(SA_D)} ^ 2.0 / 4.0 * {f17(SA_LL)} / {f17(FT3_PER_BBL)}) > 1e-8 then
    raise exception 'FC8 go-live refused: the working capacity of % bbl is not the cross section to the design liquid level in exact barrels', {VE('saghara_working_capacity_bbl')};
  end if;
  if abs({VE('saghara_working_capacity_bbl')} / v_nominal - {f17(SA_LL)} / {f17(SA_H)}) > 1e-14 then
    raise exception 'FC8 go-live refused: the working capacity of % bbl is not the level over the shell as a fraction of the nominal % bbl', {VE('saghara_working_capacity_bbl')}, v_nominal;
  end if;
  if abs({VE('saghara_recovery_saved_lb_yr')} - {f17(SA_UNC)} * {f17(SA_EFF)} / 100.0) > 1e-8 then
    raise exception 'FC8 go-live refused: the saving of % lb/yr is not the stated measured loss of % at the quoted % percent', {VE('saghara_recovery_saved_lb_yr')}, {f17(SA_UNC)}, {f17(SA_EFF)};
  end if;


  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = '{SLUG}';
  if not exists (select 1 from public.academy_apps
                  where slug = '{SLUG}' and status = 'available') then
    raise exception 'FC8 go-live refused: {SLUG} did not reach status available';
  end if;

  select count(*) filter (where status = 'available'),
         count(*) filter (where status = 'coming_soon')
    into v_available, v_soon
    from public.academy_apps;

  raise notice 'FC8 go-live: {SLUG} available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
    v_lessons, v_questions, v_capstones, 18, v_available, v_soon;
end $$;''')

sql = HEADER + '\n\n' + '\n'.join(body) + '\n'

# ------------------------------- EVERY REFUSAL NAMES THE FIELD IT IS ABOUT
BY_VAR = {v: f'{t}.{k}' for (t, k), v in V.items()}
RAISE = re.compile(r"raise exception '((?:[^']|'')*)'((?:[^;']|'(?:[^']|'')*')*);", re.S)


def name_the_field(m):
    """Append every graded field THE WHOLE GUARD READS, condition included."""
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
print('odd-quote guard: 0 code lines with an unbalanced quote')
print(f'digest literals swept: {len(published)} | handed-in-prompt values: {len(handed)} '
      f'| held quantities: {len(HELD)}')
print('graded fields colliding with any of those three lists, at their SHIPPED tolerance: 0')
print(f'refusals that read a graded value: '
      f'{sum(1 for m in RAISE.finditer(sql) if "[graded field:" in m.group(1))}, '
      'every one of them naming the field by key')
print(f'graded fields named by at least one refusal: {len(named)} of 18')
print('every identity this file asserts, checked here first:')
for what, diff, eps in checks:
    print(f'  {diff:.3e} <= {eps:.0e}  {what}')
