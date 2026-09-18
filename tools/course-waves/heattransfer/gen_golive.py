#!/usr/bin/env python3
"""Generate the FC6 go-live migration.

NOTHING HERE IS RETYPED. The eighteen graded values are read out of the
CAPSTONE ROWS THE LADDER ITSELF SEEDED, by key, inside the same transaction, so
the file verifies what it shipped rather than what a generator remembered. The
numbers a learner is handed are parsed out of the shipped prompts BY POSTGRES,
and the published figures a graded value may not collide with are every numeric
literal the teaching digest prints.

EIGHTEEN OF THE EIGHTEEN GRADED VALUES ARE REPRODUCED BY EXACT CLOSED FORM, and
that is a measurement rather than an ambition: this module solves nothing
iteratively on any graded path, so no graded field here is the root of an
equation a solver had to find. FC4 could only reach thirteen because its
compressibility came out of a Newton iteration on Dranchuk and Abou-Kassem, and
it asserted the other three by the equation they are a root of. The one place
that shape still applies here is the equivalent single-shell P at two shells,
which the engine reaches in closed form through an intermediate but which IS
defined as the root of the shell-series relation, so it is asserted THAT way and
not by restating the engine's own algebra.

AND SEVEN OF THE EIGHTEEN ARE ASSERTED TWICE, BY ROUTES WITH NOTHING IN COMMON.
A gate that restates the formula validates nothing, so wherever a second and
independent route exists it is taken: the duty is checked again from the COLD
side of the balance, the area again by multiplying it back out, the log mean
again against the mathematical fact that it lies strictly between the geometric
and the arithmetic mean of its two end differences, the fouling penalty again
from the two graded coefficients, and the whole hot-day block again by THE
SECOND METHOD, q = UA x LMTD at the hot-day terminals, which is the identity the
FC6-0 repair exists because the engine failed.

WHAT IT REFUSES TO WRITE.

1. A DIVISION WITH A BARE INTEGER DENOMINATOR. Postgres divides integer by
   integer as an integer. On a sibling wave `(7350+2480)*4/1440` truncated to 27
   and lost a third of a minute of retention, and the Python check that proved
   the same identity to 0.0 difference could not see it, because only SQL does
   this. Every denominator this file emits is a float and the guard below
   refuses any that is not. It matters more here than on any sibling: this
   ladder divides a tube count by a PASS COUNT of 2 and takes a ceiling of it.
2. A MALFORMED NUMERIC LITERAL. A sibling's first run emitted `2.0.0`, from a
   float already carrying its own point being given a second one by the
   template. Postgres would have refused it, but only at the dry run.
3. A REFUSAL THAT READS A GRADED VALUE AND DOES NOT NAME IT. A go-live that
   refuses without naming the field leaves the reader to work out which of
   eighteen moved, and the dry run's own negative control cannot tell a real
   refusal from any other.
4. A GRADED VALUE THAT COLLIDES, at its own SHIPPED tolerance, with a number the
   learner is handed in a prompt, with a number the digest publishes, or with a
   quantity held for the literature.
5. AN EM DASH OR AN EN DASH, which this programme's copy rule forbids.

Usage: python3 gen_golive.py
   FC6_WAVE        the wave directory (default /root/fc-wip-heattransfer)
   FC6_REPO        the nextgen clone   (default /root/wt-fc6-nextgen)
   FC6_COURSE_SQL  the course migration this ladder emits, for the prompt sweep
   FC6_GOLIVE_OUT  where to write
"""
import json
import math
import os
import re
import sys

W = os.environ.get('FC6_WAVE', '/root/fc-wip-heattransfer')
REPO = os.environ.get('FC6_REPO', '/root/wt-fc6-nextgen')
COURSE = os.environ.get(
    'FC6_COURSE_SQL', f'{REPO}/migrations/20260925_fc6_heattransfer_course.sql')
OUT = os.environ.get(
    'FC6_GOLIVE_OUT', f'{REPO}/migrations/20260925_fc6_heattransfer_go_live.sql')
SLUG = 'heattransfer'

fields = json.load(open(f'{W}/fields.json'))
assert len(fields) == 18, f'{len(fields)} graded fields'
F = {(t, k): (v, tol) for t, k, v, tol in fields}
# FC6's keys ARE globally unique, and that is asserted rather than assumed, so
# one SQL variable can never stand for two tiers' answers the way a sibling's
# `circGpm` would have.
assert len({k for _t, k, _v, _tol in fields}) == 18, 'two graded fields share a key'
V = {(t, k): f'v_g_{k}' for t, k, _v, _tol in fields}
assert len(set(V.values())) == 18, 'two graded fields would share one SQL variable'


def f17(x):
    """A float literal SQL will read back as this exact double."""
    return repr(float(x))


def g(t, k):
    return F[(t, k)][0]


# --------------------------------------------------------------- the inputs
# Every one of these is stated in a capstone prompt. They are written here once
# and every assertion below is built out of them, so a condition that moves
# moves the whole file rather than one line of it.
AM_MH, AM_CPH = 62000.0, 0.58
AM_MC, AM_CPC = 91000.0, 0.97
AM_THIN, AM_THOUT, AM_TCIN = 328.0, 214.0, 119.0
AM_U, AM_DO, AM_LEN, AM_PASSES = 126.0, 0.875, 18.0, 2.0

UB_THIN, UB_THOUT, UB_TCIN, UB_TCOUT = 405.0, 265.0, 135.0, 233.0
UB_HO, UB_HI, UB_DO, UB_DI, UB_KW = 265.0, 1120.0, 0.875, 0.729, 29.0
UB_FO, UB_FI = 0.0015, 0.0025
UB_SHELLS_IN_SERIES = 2.0

OK_Q, OK_PIN, OK_POUT = 26400000.0, 268.0, 172.0
OK_AMB, OK_RISE, OK_U = 93.0, 27.0, 4.85
OK_CHECK = 113.0

INCHES_PER_FOOT = 12.0

# THE QUANTITIES HELD FOR THE LITERATURE, with the label each one is refused
# under. No graded value may land within its own tolerance of any of them.
HELD = [
    (0.023, "the Dittus-Boelter coefficient"),
    (0.8, "the Dittus-Boelter Reynolds exponent"),
    (0.4, "the Dittus-Boelter Prandtl exponent, the heating form"),
    (0.14, "the Sieder-Tate viscosity ratio exponent"),
    (3.66, "the laminar constant-wall-temperature Nusselt number"),
    (2300.0, "the lower edge of the transition band"),
    (10000.0, "the upper edge of the transition band"),
    (6356.0, "the fan constant"),
    (26.0, "the default wall conductivity, which names no material"),
    (0.6, "the default fan static pressure, which names no machine"),
    (0.65, "the default fan efficiency"),
    (0.92, "the default motor efficiency"),
]
for layout, rows in (('30', ((0.319, 2.142), (0.249, 2.207), (0.175, 2.285), (0.0743, 2.499))),
                     ('45 and 90', ((0.215, 2.207), (0.156, 2.291), (0.158, 2.263), (0.0402, 2.617)))):
    for k, n1 in rows:
        HELD.append((k, f"a held bundle constant on the {layout} degree layout"))
        HELD.append((n1, f"a held bundle exponent on the {layout} degree layout"))
HELD = sorted({(v, lab) for v, lab in HELD})

# THE ENGINE RETURN EACH GRADED FIELD IS, so a field naming a quantity this
# module cannot produce is refused rather than graded.
PRODUCES = {
    'amenam_duty_btu_hr': 'energyBalance.qBtuHr',
    'amenam_cold_outlet_f': 'energyBalance.tcOut',
    'amenam_lmtd_f': 'lmtd.lmtdF',
    'amenam_area_ft2': 'areaRequired.areaFt2',
    'amenam_area_per_tube_ft2': 'tubeCount.areaPerTubeFt2',
    'amenam_area_margin_pct': 'tubeCount.areaMarginPct',
    'ubit_f_correction': 'lmtdCorrectionF.f',
    'ubit_p1_two_shells': 'lmtdCorrectionF.p1',
    'ubit_u_clean': 'overallUOutside.uCleanBtuHrFt2F',
    'ubit_u_dirty': 'overallUOutside.uDirtyBtuHrFt2F',
    'ubit_fouling_penalty_pct': 'overallUOutside.foulingPenaltyPct',
    'ubit_controlling_margin_pct': 'overallUOutside.controllingMarginPct',
    'okwori_design_lmtd_f': 'airCooler.lmtdF',
    'okwori_design_effectiveness': 'airCooler.hotDay.effectiveness',
    'okwori_capacity_ratio': 'airCooler.hotDay.cr',
    'okwori_ua_btu_hr_f': 'airCooler.hotDay.uaBtuHrF',
    'okwori_hotday_ntu': 'airCooler.hotDay.ntu',
    'okwori_hotday_process_out_f': 'airCooler.hotDay.processOutF',
}
assert set(PRODUCES) == {k for _t, k, _v, _tol in fields}, 'PRODUCES and fields.json disagree'

# THE KEY FRAGMENTS THAT NAME A HELD PATH. These are deliberately SPECIFIC.
# A sibling's guard matched nothing at all and reported all eighteen fields
# unnamed; the opposite failure is just as bad, and a bare 'shell' here would
# fire on `ubit_p1_two_shells`, which is a dimensionless P and carries no
# bundle constant whatever. The discrimination is proved below on a planted key.
FORBIDDEN_KEY_FRAGMENTS = [
    'bundle_diameter', 'shell_diameter', 'fan_bhp', 'fan_hp', 'motor_hp',
    'acfm', 'air_density', 'reynolds', 'prandtl', 'nusselt', 'film_coefficient',
    'cross_flow_f',
]
FORBIDDEN_LABEL_FRAGMENTS = [
    'bundle diameter', 'shell diameter', 'fan horsepower', 'motor horsepower',
    'cross-flow correction', 'reynolds number', 'prandtl number',
    'nusselt number', 'dittus', 'sieder', 'air density',
]

refused = []
for tier, key, val, tol in fields:
    for frag in FORBIDDEN_KEY_FRAGMENTS:
        if frag in key:
            refused.append(f'{tier}.{key} names a held path through "{frag}"')
    for h, label in HELD:
        if abs(abs(val) - h) <= tol:
            refused.append(f'{tier}.{key} = {val} is within {tol} of {h} ({label}), which is HELD')
# THE GUARD MUST DISCRIMINATE. A planted key has to be caught, or the sweep
# above is decoration. This is the negative control the sibling wave lacked.
planted = [frag for frag in FORBIDDEN_KEY_FRAGMENTS if frag in 'okwori_bundle_diameter_in']
if not planted:
    refused.append('the forbidden-key sweep does not catch a planted bundle_diameter key')
if any(frag in 'ubit_p1_two_shells' for frag in FORBIDDEN_KEY_FRAGMENTS):
    refused.append('the forbidden-key sweep fires on ubit_p1_two_shells, which carries no held constant')

# ---------------------------------------------------------------------------
# THE ARITHMETIC IS CHECKED HERE BEFORE IT IS EMITTED, so a go-live that cannot
# pass is never written in the first place.
# ---------------------------------------------------------------------------
checks = []


def same(what, a, b, eps):
    checks.append((what, abs(a - b), eps))
    if not abs(a - b) <= eps:
        refused.append(f'{what}: {a} against {b}, difference {abs(a - b)} exceeds {eps}')


# Associate, AMENAM.
c_hot = AM_MH * AM_CPH
c_cold = AM_MC * AM_CPC
duty = c_hot * (AM_THIN - AM_THOUT)
same('AMENAM duty', duty, g('beginner', 'amenam_duty_btu_hr'), 1e-06)
tc_out = AM_TCIN + duty / c_cold
same('AMENAM cold outlet', tc_out, g('beginner', 'amenam_cold_outlet_f'), 1e-11)
same('AMENAM duty from the COLD side', c_cold * (g('beginner', 'amenam_cold_outlet_f') - AM_TCIN),
     g('beginner', 'amenam_duty_btu_hr'), 1e-06)
dt1 = AM_THIN - tc_out
dt2 = AM_THOUT - AM_TCIN
lm = (dt1 - dt2) / math.log(dt1 / dt2)
same('AMENAM log mean', lm, g('beginner', 'amenam_lmtd_f'), 1e-11)
if not math.sqrt(dt1 * dt2) < lm < (dt1 + dt2) / 2.0:
    refused.append('the AMENAM log mean does not lie between the geometric and arithmetic means')
area = duty / (AM_U * lm)
same('AMENAM area', area, g('beginner', 'amenam_area_ft2'), 1e-11)
per_tube = math.pi * (AM_DO / INCHES_PER_FOOT) * AM_LEN
same('AMENAM area per tube', per_tube, g('beginner', 'amenam_area_per_tube_ft2'), 1e-12)
n_cover = math.ceil(area / per_tube)
n_tubes = math.ceil(n_cover / AM_PASSES) * AM_PASSES
margin = ((n_tubes * per_tube - area) / area) * 100.0
same('AMENAM area margin', margin, g('beginner', 'amenam_area_margin_pct'), 1e-12)
if n_tubes == n_cover:
    refused.append('the AMENAM pass rounding does not move the count, so the margin teaches nothing')

# Professional, UBIT.
p = (UB_TCOUT - UB_TCIN) / (UB_THIN - UB_TCIN)
r = (UB_THIN - UB_THOUT) / (UB_TCOUT - UB_TCIN)
root = math.sqrt(r * r + 1.0)
f_num = (root / (r - 1.0)) * math.log((1.0 - p) / (1.0 - p * r))
f_a = 2.0 / p - 1.0 - r + root
f_b = 2.0 / p - 1.0 - r - root
f_one = f_num / math.log(f_a / f_b)
same('UBIT F at one shell', f_one, g('intermediate', 'ubit_f_correction'), 1e-12)
p1 = g('intermediate', 'ubit_p1_two_shells')
# BY THE EQUATION IT IS A ROOT OF, and not by the engine's own algebra for it.
root_residual = ((1.0 - p1 * r) / (1.0 - p1)) ** UB_SHELLS_IN_SERIES - (1.0 - p * r) / (1.0 - p)
checks.append(('UBIT equivalent single-shell P, as a ROOT of the shell-series relation',
               abs(root_residual), 1e-12))
if not abs(root_residual) <= 1e-12:
    refused.append(f'the equivalent single-shell P leaves a residual of {root_residual}')
if not p1 < p:
    refused.append('the equivalent single-shell P is not below the whole-unit P')
ratio = UB_DO / UB_DI
r_out = 1.0 / UB_HO
r_wall = (UB_DO / INCHES_PER_FOOT) * math.log(ratio) / (2.0 * UB_KW)
r_in = ratio / UB_HI
r_foul_in = ratio * UB_FI
clean = r_out + r_wall + r_in
total = r_out + UB_FO + r_wall + r_in + r_foul_in
same('UBIT clean U', 1.0 / clean, g('intermediate', 'ubit_u_clean'), 1e-10)
same('UBIT dirty U', 1.0 / total, g('intermediate', 'ubit_u_dirty'), 1e-10)
same('UBIT fouling penalty', (1.0 - clean / total) * 100.0,
     g('intermediate', 'ubit_fouling_penalty_pct'), 1e-11)
same('UBIT fouling penalty from the two GRADED coefficients',
     (1.0 - g('intermediate', 'ubit_u_dirty') / g('intermediate', 'ubit_u_clean')) * 100.0,
     g('intermediate', 'ubit_fouling_penalty_pct'), 1e-11)
ranked = sorted([r_out, UB_FO, r_wall, r_in, r_foul_in], reverse=True)
same('UBIT controlling margin', ((ranked[0] - ranked[1]) / ranked[0]) * 100.0,
     g('intermediate', 'ubit_controlling_margin_pct'), 1e-11)
if ranked[0] == ranked[1]:
    refused.append('the UBIT stack has no single controlling resistance')

# Expert, OKWORI.
ok_d1 = OK_PIN - (OK_AMB + OK_RISE)
ok_d2 = OK_POUT - OK_AMB
ok_lm = (ok_d1 - ok_d2) / math.log(ok_d1 / ok_d2)
same('OKWORI design log mean', ok_lm, g('advanced', 'okwori_design_lmtd_f'), 1e-11)
c_process = OK_Q / (OK_PIN - OK_POUT)
c_air = OK_Q / OK_RISE
c_min = min(c_process, c_air)
c_max = max(c_process, c_air)
eff = OK_Q / (c_min * (OK_PIN - OK_AMB))
same('OKWORI design effectiveness', eff, g('advanced', 'okwori_design_effectiveness'), 1e-13)
same('OKWORI capacity ratio', c_min / c_max, g('advanced', 'okwori_capacity_ratio'), 1e-13)
ua = OK_Q / ok_lm
same('OKWORI UA', ua, g('advanced', 'okwori_ua_btu_hr_f'), 1e-06)
same('OKWORI hot-day NTU', ua / c_min, g('advanced', 'okwori_hotday_ntu'), 1e-13)
q2 = eff * c_min * (OK_PIN - OK_CHECK)
out_f = OK_PIN - q2 / c_process
same('OKWORI hot-day process outlet', out_f, g('advanced', 'okwori_hotday_process_out_f'), 1e-11)
# THE SECOND METHOD. q = UA x LMTD at the hot-day terminals, at the same fixed
# UA, and it must return the duty the effectiveness route produced.
rise2 = q2 / c_air
e1 = OK_PIN - (OK_CHECK + rise2)
e2 = out_f - OK_CHECK
lm2 = (e1 - e2) / math.log(e1 / e2)
same('OKWORI THE SECOND METHOD, q = UA x LMTD on the hot day', ua * lm2, q2, 1e-06)
if out_f <= OK_POUT:
    refused.append('OKWORI reaches its design outlet on the hot day, so the rating teaches nothing')

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
HEADER = """-- ============================================================================
-- FC6 GO-LIVE (HELD): Heat Exchange & Cooling flips to 'available'. The SIXTH
-- Facilities course, above FC5 at path_order 43, FC4 gasprocessing at 42, FC3
-- rotating at 41, FC2 linesizing at 40 and FC1 separation at 39.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/heattransfer. The 78 lessons, the teaching lab
-- (heattransferLab.js) and its three explorer panels (the exchanger, the
-- coefficient and the rating) ship in the ZIP and NOT in this database, so a
-- flip before the upload puts a live catalogue tile in front of a route that
-- does not exist. Every Facilities and Drilling wave on this programme has held
-- its go-live behind one verified upload, and this file is written, dry-run and
-- left unapplied on purpose.
--
-- EVERY DENOMINATOR BELOW IS A FLOAT, ON PURPOSE. Postgres divides integer by
-- integer as an integer. On FC1 `(7350+2480)*4/1440` truncated to 27 and lost a
-- third of a minute of retention; the Python check that proved the same
-- identity to 0.0 difference could not see it, because only SQL does this. It
-- matters more here than on any sibling, because this ladder divides a TUBE
-- COUNT by a PASS COUNT and takes a ceiling of the result, and an integer
-- division there would silently give the right answer on an even count and the
-- wrong one on an odd count, which is exactly the case the capstone is built
-- on. The generator that wrote this file refuses to emit a division with a bare
-- integer denominator, and refuses a malformed numeric literal.
--
-- ALL EIGHTEEN GRADED VALUES ARE REPRODUCED BY EXACT CLOSED FORM. That is a
-- measurement, not an ambition: nothing on a graded path in this module is
-- solved iteratively, so no graded field here is a root a solver had to find.
-- A sibling reached thirteen of eighteen and asserted three by the equation
-- they are a root of, because its compressibility came out of a Newton
-- iteration. The one field here that keeps that shape is the equivalent
-- single-shell P at two shells: the engine reaches it in closed form through an
-- intermediate, but it IS the root of the shell-series relation, so it is
-- asserted THAT way rather than by restating the engine's own algebra for it.
--
-- AND SEVEN OF THE EIGHTEEN ARE ASSERTED TWICE, BY ROUTES WITH NOTHING IN
-- COMMON, because a gate that restates the formula validates nothing:
--
--   * the duty, again from the COLD side of the balance rather than the hot;
--   * the cold outlet, which that cold-side check reads;
--   * the log mean, again against the mathematical fact that it lies strictly
--     between the geometric and the arithmetic mean of its two end
--     differences, which no rearrangement of its own formula can supply;
--   * the area, again by multiplying it back out through U and the log mean;
--   * the fouling penalty, again from the two GRADED coefficients rather than
--     from the resistance stack that produced them;
--   * and the UA, the effectiveness and the hot-day outlet, again by THE
--     SECOND METHOD, q = UA x LMTD at the hot-day terminals. That identity is
--     the reason the FC6-0 repair exists: before it the engine satisfied
--     NEITHER method, and the disagreement is what found the defect.
--
-- EVERY REFUSAL NAMES THE GRADED FIELD IT READ, condition included and not only
-- message. An assertion between two graded values reads both, and a refusal
-- naming only one leaves a reader looking at the trusting half of a disagreeing
-- pair, which is where the bug is not.
-- ============================================================================"""

body = []
A = body.append

A('do $$')
A('declare')
A('  v_structures int; v_questions int; v_capstones int; v_lessons int;')
A('  v_modules int; v_graded int; v_available int; v_soon int;')
A('  v_names text;')
A('  v_dt1 double precision; v_dt2 double precision;')
A('  v_ncover double precision; v_ntubes double precision;')
A('  v_p double precision; v_r double precision; v_root double precision;')
A('  v_rout double precision; v_rwall double precision; v_rin double precision;')
A('  v_rfoulin double precision; v_clean double precision; v_total double precision;')
A('  v_top double precision; v_next double precision;')
A('  v_cmin double precision; v_cmax double precision; v_cprocess double precision;')
A('  v_cair double precision; v_q2 double precision; v_rise2 double precision;')
A('  v_e1 double precision; v_e2 double precision; v_lm2 double precision;')
for (t, k) in V:
    A(f'  {V[(t, k)]} double precision;')
A('begin')

A('''
  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures
   where app_slug = '{SLUG}' and active;
  if v_structures <> 3 then
    raise exception 'FC6 go-live refused: {SLUG} has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions from public.academy_quiz_questions where app_slug = '{SLUG}';
  if v_questions <> 396 then
    raise exception 'FC6 go-live refused: {SLUG} has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_graded from (
    select tier from public.academy_quiz_questions where app_slug = '{SLUG}'
     group by tier having count(*) <> 132) t;
  if v_graded <> 0 then
    raise exception 'FC6 go-live refused: % tier(s) do not carry exactly 132 questions', v_graded;
  end if;

  select count(*) into v_graded from (
    select tier, module_key from public.academy_quiz_questions
     where app_slug = '{SLUG}' and scope = 'module'
     group by tier, module_key having count(*) <> 15) t;
  if v_graded <> 0 then
    raise exception 'FC6 go-live refused: % module bank(s) do not carry exactly 15 questions', v_graded;
  end if;

  select count(*) into v_graded from (
    select tier from public.academy_quiz_questions
     where app_slug = '{SLUG}' and scope = 'final'
     group by tier having count(*) <> 42) t;
  if v_graded <> 0 then
    raise exception 'FC6 go-live refused: % final exam(s) do not carry exactly 42 questions', v_graded;
  end if;

  -- A question whose key is outside its own options is unanswerable, and it is
  -- the one shape a count of rows can never see.
  select count(*) into v_graded from public.academy_quiz_questions
   where app_slug = '{SLUG}'
     and (jsonb_array_length(options) <> 4
          or answer_index < 0 or answer_index > 3);
  if v_graded <> 0 then
    raise exception 'FC6 go-live refused: % question(s) do not offer four options with a key inside them', v_graded;
  end if;

  select count(*) into v_capstones from public.academy_capstones where app_slug = '{SLUG}';
  if v_capstones <> 3 then
    raise exception 'FC6 go-live refused: {SLUG} has % capstones, expected 3', v_capstones;
  end if;

  select count(*) into v_lessons
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m,
         lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = '{SLUG}' and s.active;
  if v_lessons <> 78 then
    raise exception 'FC6 go-live refused: {SLUG} carries % lesson keys, expected 78', v_lessons;
  end if;

  select count(*) into v_modules
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = '{SLUG}' and s.active;
  if v_modules <> 18 then
    raise exception 'FC6 go-live refused: {SLUG} carries % modules, expected 18 (six per tier)', v_modules;
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
    raise exception 'FC6 go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_graded;
  end if;

  select count(*) into v_graded from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f where c.app_slug = '{SLUG}';
  if v_graded <> 18 then
    raise exception 'FC6 go-live refused: {SLUG} has % graded capstone fields, expected 18', v_graded;
  end if;

  select count(*) into v_graded from (
    select c.tier from public.academy_capstones c,
           lateral jsonb_array_elements(c.fields) f
     where c.app_slug = '{SLUG}' group by c.tier having count(*) <> 6) t;
  if v_graded <> 0 then
    raise exception 'FC6 go-live refused: % tier(s) do not grade exactly six fields', v_graded;
  end if;

  if not exists (select 1 from public.academy_apps
                  where slug = '{SLUG}' and module = 'facilities'
                    and path_order = 44 and prereq_slug is null) then
    raise exception 'FC6 go-live refused: the {SLUG} catalogue row is not facilities at path_order 44 with no prerequisite';
  end if;

  if exists (select 1 from public.academy_apps
              where path_order = 44 and slug <> '{SLUG}') then
    raise exception 'FC6 go-live refused: another course already holds path_order 44';
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
    raise exception 'FC6 go-live refused: % graded field(s) name a quantity held for the literature: %', v_graded, v_names;
  end if;

  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array[{FORBIDDEN_LABEL_SQL}]) frag
   where c.app_slug = '{SLUG}' and lower(f->>'label') like '%' || frag || '%';
  if v_graded <> 0 then
    raise exception 'FC6 go-live refused: % graded field label(s) name a quantity held for the literature: %', v_graded, v_names;
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
    raise exception 'FC6 go-live refused: % graded field(s) land on a quantity held for the literature: %', v_graded, v_names;
  end if;

  -- ---------------------------------------------------- the collision sweeps
  -- EVERY NUMBER THE TEACHING DIGEST PRINTS. A graded field within its own
  -- tolerance of one of them is a lookup rather than a calculation, and the
  -- tolerance used is the SHIPPED one, which for six of the eighteen is the
  -- widened 5e-7 and not the stated 1e-9. Sweeping at the stated tolerance
  -- would pass a collision the shipped grade would hit.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key'), ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array[{PUBLISHED_SQL}]) pub
   where c.app_slug = '{SLUG}'
     and abs(abs((f->>'expected')::double precision) - pub) <= (f->>'tol')::double precision;
  if v_graded <> 0 then
    raise exception 'FC6 go-live refused: % graded field(s) sit within their own tolerance of a value the digest publishes, which makes them a lookup rather than a calculation: %', v_graded, v_names;
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
    raise exception 'FC6 go-live refused: % graded field(s) land on a number the learner is handed in a prompt, which makes the field a transcription rather than a calculation: %', v_graded, v_names;
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
    raise exception 'FC6 go-live refused: % pair(s) of graded fields are within the looser of their two tolerances: %', v_graded, v_names;
  end if;

  -- A capstone prompt stating another tier's graded answer hands that tier away.
  select count(*), string_agg(distinct c.tier || ' states ' || gg.owner || '/' || gg.k, ', ')
    into v_graded, v_names from public.academy_capstones c,
         (select f->>'expected' as e, f->>'key' as k, c2.tier as owner
            from public.academy_capstones c2, lateral jsonb_array_elements(c2.fields) f
           where c2.app_slug = '{SLUG}') gg
   where c.app_slug = '{SLUG}' and c.tier <> gg.owner and c.prompt like '%' || gg.e || '%';
  if v_graded <> 0 then
    raise exception 'FC6 go-live refused: % capstone prompt(s) state a graded value belonging to another tier: %', v_graded, v_names;
  end if;
''')

# ------------------------------------------------ load the eighteen values
A('\n  -- --------------------------------------- the eighteen graded values')
for (t, k), var in V.items():
    A(f"""  select (f->>'expected')::double precision into {var}
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = '{SLUG}' and c.tier = '{t}' and f->>'key' = '{k}';""")
A('  if ' + '\n     or '.join(f'{v} is null' for v in V.values()) + ' then')
A("    raise exception 'FC6 go-live refused: one or more of the eighteen graded fields is missing';")
A('  end if;')


def VB(k):
    return V[('beginner', k)]


def VI(k):
    return V[('intermediate', k)]


def VE(k):
    return V[('advanced', k)]


A(f'''
  -- -------------------------------------------------- the Associate, AMENAM
  -- The duty is the HOT capacity rate on the specified hot outlet. The outlet
  -- is stated, so the duty is an answer and not a condition.
  if abs({VB('amenam_duty_btu_hr')} - {f17(AM_MH)} * {f17(AM_CPH)} * ({f17(AM_THIN)} - {f17(AM_THOUT)})) > 1e-06 then
    raise exception 'FC6 go-live refused: the duty of % Btu an hour is not the hot capacity rate of % lb an hour at % Btu per lb degF across the specified drop from % to % degF', {VB('amenam_duty_btu_hr')}, {f17(AM_MH)}, {f17(AM_CPH)}, {f17(AM_THIN)}, {f17(AM_THOUT)};
  end if;

  -- The cold outlet is that duty put into the cold stream.
  if abs({VB('amenam_cold_outlet_f')} - ({f17(AM_TCIN)} + {VB('amenam_duty_btu_hr')} / ({f17(AM_MC)} * {f17(AM_CPC)}))) > 1e-11 then
    raise exception 'FC6 go-live refused: the cold outlet of % degF is not the cold inlet of % degF plus the graded duty of % Btu an hour spread over the cold capacity rate', {VB('amenam_cold_outlet_f')}, {f17(AM_TCIN)}, {VB('amenam_duty_btu_hr')};
  end if;

  -- THE SECOND ROUTE TO THE DUTY. The same heat read from the COLD side. This
  -- shares no arithmetic with the hot-side statement above, and it is the
  -- balance the whole tier is built on.
  if abs({f17(AM_MC)} * {f17(AM_CPC)} * ({VB('amenam_cold_outlet_f')} - {f17(AM_TCIN)}) - {VB('amenam_duty_btu_hr')}) > 1e-06 then
    raise exception 'FC6 go-live refused: the cold stream carries % Btu an hour against the graded duty of %, so the two sides of the balance disagree', {f17(AM_MC)} * {f17(AM_CPC)} * ({VB('amenam_cold_outlet_f')} - {f17(AM_TCIN)}), {VB('amenam_duty_btu_hr')};
  end if;

  -- The counter-current log mean, off the two END differences.
  v_dt1 := {f17(AM_THIN)} - {VB('amenam_cold_outlet_f')};
  v_dt2 := {f17(AM_THOUT)} - {f17(AM_TCIN)};
  if abs({VB('amenam_lmtd_f')} - (v_dt1 - v_dt2) / ln(v_dt1 / v_dt2)) > 1e-11 then
    raise exception 'FC6 go-live refused: the log mean of % degF is not the counter-current mean of end differences % and % degF', {VB('amenam_lmtd_f')}, v_dt1, v_dt2;
  end if;

  -- AND A ROUTE ITS OWN FORMULA CANNOT SUPPLY. A log mean lies STRICTLY between
  -- the geometric and the arithmetic mean of its two end differences whenever
  -- those differ. No rearrangement of the log mean gives this; it is a fact
  -- about the three means, and it is what catches a log mean built on the wrong
  -- pairing of terminals.
  if not ({VB('amenam_lmtd_f')} > sqrt(v_dt1 * v_dt2)
          and {VB('amenam_lmtd_f')} < (v_dt1 + v_dt2) / 2.0) then
    raise exception 'FC6 go-live refused: the log mean of % degF does not lie between the geometric mean % and the arithmetic mean % of its own end differences, so it is not a log mean of this pairing', {VB('amenam_lmtd_f')}, sqrt(v_dt1 * v_dt2), (v_dt1 + v_dt2) / 2.0;
  end if;

  -- The surface, at the stated coefficient and an F of 1.
  if abs({VB('amenam_area_ft2')} - {VB('amenam_duty_btu_hr')} / ({f17(AM_U)} * {VB('amenam_lmtd_f')})) > 1e-11 then
    raise exception 'FC6 go-live refused: the surface of % ft2 is not the graded duty of % over the stated coefficient of % Btu per hr ft2 degF and the graded log mean of % degF', {VB('amenam_area_ft2')}, {VB('amenam_duty_btu_hr')}, {f17(AM_U)}, {VB('amenam_lmtd_f')};
  end if;

  -- AND BACK THE OTHER WAY, which is the design equation read as a product
  -- rather than as a quotient.
  if abs({f17(AM_U)} * {VB('amenam_area_ft2')} * {VB('amenam_lmtd_f')} - {VB('amenam_duty_btu_hr')}) > 1e-06 then
    raise exception 'FC6 go-live refused: U times the graded area of % ft2 times the graded log mean of % degF gives % Btu an hour against the graded duty of %', {VB('amenam_area_ft2')}, {VB('amenam_lmtd_f')}, {f17(AM_U)} * {VB('amenam_area_ft2')} * {VB('amenam_lmtd_f')}, {VB('amenam_duty_btu_hr')};
  end if;

  -- One tube's OUTSIDE surface. The diameter is in inches and the length in
  -- feet, and the twelve is a float because this file will not divide an
  -- integer by an integer anywhere.
  if abs({VB('amenam_area_per_tube_ft2')} - pi() * ({f17(AM_DO)} / {f17(INCHES_PER_FOOT)}) * {f17(AM_LEN)}) > 1e-12 then
    raise exception 'FC6 go-live refused: the surface of one tube, % ft2, is not pi times the % inch outside diameter in feet times the % ft length', {VB('amenam_area_per_tube_ft2')}, {f17(AM_DO)}, {f17(AM_LEN)};
  end if;

  -- THE TWO ROUNDINGS, which is what the tier is built on. The count is rounded
  -- UP to cover the surface, and then UP again to a whole multiple of the pass
  -- count, because a bundle divides its tubes equally between its passes.
  v_ncover := ceil({VB('amenam_area_ft2')} / {VB('amenam_area_per_tube_ft2')});
  v_ntubes := ceil(v_ncover / {f17(AM_PASSES)}) * {f17(AM_PASSES)};
  if abs({VB('amenam_area_margin_pct')} - ((v_ntubes * {VB('amenam_area_per_tube_ft2')} - {VB('amenam_area_ft2')}) / {VB('amenam_area_ft2')}) * 100.0) > 1e-12 then
    raise exception 'FC6 go-live refused: the surface margin of % percent is not the overshoot of % tubes at % ft2 each over the required % ft2', {VB('amenam_area_margin_pct')}, v_ntubes, {VB('amenam_area_per_tube_ft2')}, {VB('amenam_area_ft2')};
  end if;

  -- AND THE SECOND ROUNDING MUST BITE. If the covering count were already a
  -- whole multiple of the passes the margin would grade the first rounding
  -- only, and a candidate who skipped the second would score full marks.
  if v_ntubes = v_ncover then
    raise exception 'FC6 go-live refused: the covering count of % tubes is already a whole multiple of the pass count, so the graded surface margin of % percent does not discriminate the pass rounding at all', v_ncover, {VB('amenam_area_margin_pct')};
  end if;
  if {VB('amenam_area_margin_pct')} <= 0.0 then
    raise exception 'FC6 go-live refused: the surface margin of % percent is not positive, and a whole number of tubes cannot undershoot its own requirement', {VB('amenam_area_margin_pct')};
  end if;
''')

A(f'''
  -- ------------------------------------------------- the Professional, UBIT
  -- P and R off the four terminals, then Bowman's closed form at ONE shell
  -- pass, where the equivalent single-shell P is P itself.
  v_p := ({f17(UB_TCOUT)} - {f17(UB_TCIN)}) / ({f17(UB_THIN)} - {f17(UB_TCIN)});
  v_r := ({f17(UB_THIN)} - {f17(UB_THOUT)}) / ({f17(UB_TCOUT)} - {f17(UB_TCIN)});
  v_root := sqrt(v_r * v_r + 1.0);
  if abs({VI('ubit_f_correction')}
         - ((v_root / (v_r - 1.0)) * ln((1.0 - v_p) / (1.0 - v_p * v_r)))
           / ln((2.0 / v_p - 1.0 - v_r + v_root) / (2.0 / v_p - 1.0 - v_r - v_root))) > 1e-12 then
    raise exception 'FC6 go-live refused: the correction factor of % at one shell pass is not the closed form at P = % and R = %', {VI('ubit_f_correction')}, v_p, v_r;
  end if;

  -- A correction factor is a fraction of the counter-current driving force, so
  -- it cannot exceed one, and below 0.8 the curve is too steep for the engine
  -- to answer without a warning. This capstone is built above that.
  if {VI('ubit_f_correction')} > 1.0 or {VI('ubit_f_correction')} < 0.8 then
    raise exception 'FC6 go-live refused: the correction factor of % is not between 0.8 and 1, so the case is either impossible or in the steep band the engine warns about', {VI('ubit_f_correction')};
  end if;

  -- THE EQUIVALENT SINGLE-SHELL P, ASSERTED BY THE EQUATION IT IS A ROOT OF.
  -- The engine reaches it in closed form through an intermediate. Restating
  -- that algebra here would validate nothing, so what is checked instead is the
  -- DEFINING relation: N shells in series carry the whole-unit P if and only if
  -- the per-shell group raised to the shell count returns it.
  if abs(power((1.0 - {VI('ubit_p1_two_shells')} * v_r) / (1.0 - {VI('ubit_p1_two_shells')}), {f17(UB_SHELLS_IN_SERIES)})
         - (1.0 - v_p * v_r) / (1.0 - v_p)) > 1e-12 then
    raise exception 'FC6 go-live refused: the equivalent single-shell P of % is not a root of the shell-series relation at % shells, P = % and R = %', {VI('ubit_p1_two_shells')}, {f17(UB_SHELLS_IN_SERIES)}, v_p, v_r;
  end if;

  -- And it must sit BELOW the whole-unit P, which is the whole point of buying
  -- a second shell: each shell does less of the job.
  if not {VI('ubit_p1_two_shells')} < v_p then
    raise exception 'FC6 go-live refused: the equivalent single-shell P of % is not below the whole-unit P of %, so the second shell bought nothing', {VI('ubit_p1_two_shells')}, v_p;
  end if;

  -- THE FIVE NAMED RESISTANCES. Both films and the wall conductivity are STATED
  -- conditions of this study, so nothing here is looked up and no fitted
  -- correlation is read.
  v_rout := 1.0 / {f17(UB_HO)};
  v_rwall := ({f17(UB_DO)} / {f17(INCHES_PER_FOOT)}) * ln({f17(UB_DO)} / {f17(UB_DI)}) / (2.0 * {f17(UB_KW)});
  v_rin := ({f17(UB_DO)} / {f17(UB_DI)}) / {f17(UB_HI)};
  v_rfoulin := ({f17(UB_DO)} / {f17(UB_DI)}) * {f17(UB_FI)};
  v_clean := v_rout + v_rwall + v_rin;
  v_total := v_rout + {f17(UB_FO)} + v_rwall + v_rin + v_rfoulin;

  if abs({VI('ubit_u_clean')} - 1.0 / v_clean) > 1e-10 then
    raise exception 'FC6 go-live refused: the clean coefficient of % Btu per hr ft2 degF is not the reciprocal of the three clean resistances summing to %', {VI('ubit_u_clean')}, v_clean;
  end if;
  if abs({VI('ubit_u_dirty')} - 1.0 / v_total) > 1e-10 then
    raise exception 'FC6 go-live refused: the dirty coefficient of % Btu per hr ft2 degF is not the reciprocal of all five resistances summing to %', {VI('ubit_u_dirty')}, v_total;
  end if;

  -- THE FOULING PENALTY FROM THE TWO GRADED COEFFICIENTS, which is a route with
  -- nothing in common with the resistance stack that produced either of them.
  if abs({VI('ubit_fouling_penalty_pct')} - (1.0 - {VI('ubit_u_dirty')} / {VI('ubit_u_clean')}) * 100.0) > 1e-11 then
    raise exception 'FC6 go-live refused: the fouling penalty of % percent is not what the graded dirty coefficient of % costs against the graded clean coefficient of %', {VI('ubit_fouling_penalty_pct')}, {VI('ubit_u_dirty')}, {VI('ubit_u_clean')};
  end if;

  -- THE CONTROLLING MARGIN, off the ranked stack rather than off a hardcoded
  -- verdict. Which resistance leads is READ here, so a stack that reordered
  -- would be caught instead of being quietly graded against yesterday's winner.
  select r1, r2 into v_top, v_next from (
    select x as r1, lead(x) over (order by x desc) as r2
      from unnest(array[v_rout, {f17(UB_FO)}, v_rwall, v_rin, v_rfoulin]) x
     order by x desc limit 1) t;
  if abs({VI('ubit_controlling_margin_pct')} - ((v_top - v_next) / v_top) * 100.0) > 1e-11 then
    raise exception 'FC6 go-live refused: the controlling margin of % percent is not how far the largest resistance % leads the runner up %', {VI('ubit_controlling_margin_pct')}, v_top, v_next;
  end if;

  -- A margin under the ten percent this module calls clear is a coin toss, and
  -- UBIT is built on a stack where the lead is clear.
  if {VI('ubit_controlling_margin_pct')} < 10.0 then
    raise exception 'FC6 go-live refused: the controlling resistance leads by only % percent, under the 10 percent this module calls clear, so the verdict the tier teaches is a coin toss on this case', {VI('ubit_controlling_margin_pct')};
  end if;
''')

A(f'''
  -- ------------------------------------------------------ the Expert, OKWORI
  -- The design log mean of the bay, against air that enters at the design
  -- ambient and leaves it by the stated rise.
  v_dt1 := {f17(OK_PIN)} - ({f17(OK_AMB)} + {f17(OK_RISE)});
  v_dt2 := {f17(OK_POUT)} - {f17(OK_AMB)};
  if abs({VE('okwori_design_lmtd_f')} - (v_dt1 - v_dt2) / ln(v_dt1 / v_dt2)) > 1e-11 then
    raise exception 'FC6 go-live refused: the design log mean of % degF is not the mean of end differences % and % degF', {VE('okwori_design_lmtd_f')}, v_dt1, v_dt2;
  end if;

  -- The two capacity rates the bay is read through, each of them the stated
  -- duty over the stated span of its own stream.
  v_cprocess := {f17(OK_Q)} / ({f17(OK_PIN)} - {f17(OK_POUT)});
  v_cair := {f17(OK_Q)} / {f17(OK_RISE)};
  v_cmin := least(v_cprocess, v_cair);
  v_cmax := greatest(v_cprocess, v_cair);

  -- EFFECTIVENESS FROM ITS DEFINITION, which is the duty over the most the
  -- smaller capacity rate could ever carry against the air it is given. No
  -- arrangement and no correction factor is read, and that is the point: the
  -- cross-flow correction is the one quantity this bay declines to source.
  if abs({VE('okwori_design_effectiveness')} - {f17(OK_Q)} / (v_cmin * ({f17(OK_PIN)} - {f17(OK_AMB)}))) > 1e-13 then
    raise exception 'FC6 go-live refused: the design effectiveness of % is not the stated duty over the smaller capacity rate % across the design approach of % degF', {VE('okwori_design_effectiveness')}, v_cmin, {f17(OK_PIN)} - {f17(OK_AMB)};
  end if;
  if {VE('okwori_design_effectiveness')} <= 0.0 or {VE('okwori_design_effectiveness')} >= 1.0 then
    raise exception 'FC6 go-live refused: the design effectiveness of % is not a fraction between 0 and 1', {VE('okwori_design_effectiveness')};
  end if;

  if abs({VE('okwori_capacity_ratio')} - v_cmin / v_cmax) > 1e-13 then
    raise exception 'FC6 go-live refused: the capacity ratio of % is not the smaller capacity rate % over the larger %', {VE('okwori_capacity_ratio')}, v_cmin, v_cmax;
  end if;

  -- THE UA THE BAY HOLDS. Fixed, which is what makes the hot day a rating
  -- question rather than a design one.
  if abs({VE('okwori_ua_btu_hr_f')} - {f17(OK_Q)} / {VE('okwori_design_lmtd_f')}) > 1e-06 then
    raise exception 'FC6 go-live refused: the UA of % Btu per hr degF is not the stated duty over the graded design log mean of % degF', {VE('okwori_ua_btu_hr_f')}, {VE('okwori_design_lmtd_f')};
  end if;

  if abs({VE('okwori_hotday_ntu')} - {VE('okwori_ua_btu_hr_f')} / v_cmin) > 1e-13 then
    raise exception 'FC6 go-live refused: the NTU of % is not the graded UA of % Btu per hr degF over the smaller capacity rate %', {VE('okwori_hotday_ntu')}, {VE('okwori_ua_btu_hr_f')}, v_cmin;
  end if;

  -- THE HOT DAY. The same effectiveness and the same air mass against a hotter
  -- approach, and the outlet that leaves.
  v_q2 := {VE('okwori_design_effectiveness')} * v_cmin * ({f17(OK_PIN)} - {f17(OK_CHECK)});
  if abs({VE('okwori_hotday_process_out_f')} - ({f17(OK_PIN)} - v_q2 / v_cprocess)) > 1e-11 then
    raise exception 'FC6 go-live refused: the hot-day process outlet of % degF is not the inlet of % degF less the hot-day duty of % Btu an hour over the process capacity rate', {VE('okwori_hotday_process_out_f')}, {f17(OK_PIN)}, v_q2;
  end if;

  -- AND IT MUST MISS THE DESIGN OUTLET, or the hot day is not a hot day and the
  -- tier's whole question does not arise.
  if {VE('okwori_hotday_process_out_f')} <= {f17(OK_POUT)} then
    raise exception 'FC6 go-live refused: the bay still reaches its design outlet of % degF on the hot day, leaving at % degF, so the rating teaches nothing', {f17(OK_POUT)}, {VE('okwori_hotday_process_out_f')};
  end if;

  -- THE SECOND METHOD, AND IT IS THE REASON THE FC6-0 REPAIR EXISTS. The hot
  -- day has now been rated by effectiveness-NTU. Rate it AGAIN by the surface
  -- equation, q = UA x LMTD, at the same fixed UA and at the hot-day terminals,
  -- and the two must return the same duty. Before the repair the engine
  -- satisfied NEITHER, and it was this disagreement that found the defect. This
  -- single assertion reads the graded UA, the graded effectiveness and the
  -- graded hot-day outlet, and it shares no arithmetic with any of the three.
  v_rise2 := v_q2 / v_cair;
  v_e1 := {f17(OK_PIN)} - ({f17(OK_CHECK)} + v_rise2);
  v_e2 := {VE('okwori_hotday_process_out_f')} - {f17(OK_CHECK)};
  if not (v_e1 > 0.0 and v_e2 > 0.0) then
    raise exception 'FC6 go-live refused: the hot-day terminals cross, with end differences % and % degF, so the second method cannot be taken at all', v_e1, v_e2;
  end if;
  v_lm2 := (v_e1 - v_e2) / ln(v_e1 / v_e2);
  if abs({VE('okwori_ua_btu_hr_f')} * v_lm2 - v_q2) > 1e-06 then
    raise exception 'FC6 go-live refused: THE SECOND METHOD DISAGREES. The graded UA of % Btu per hr degF across the hot-day log mean of % degF gives % Btu an hour, against the % the graded effectiveness of % and the graded hot-day outlet of % degF produce', {VE('okwori_ua_btu_hr_f')}, v_lm2, {VE('okwori_ua_btu_hr_f')} * v_lm2, v_q2, {VE('okwori_design_effectiveness')}, {VE('okwori_hotday_process_out_f')};
  end if;
''')

A(f'''
  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = '{SLUG}';
  if not exists (select 1 from public.academy_apps
                  where slug = '{SLUG}' and status = 'available') then
    raise exception 'FC6 go-live refused: {SLUG} did not reach status available';
  end if;

  select count(*) filter (where status = 'available'),
         count(*) filter (where status = 'coming_soon')
    into v_available, v_soon
    from public.academy_apps;

  raise notice 'FC6 go-live: {SLUG} available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
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
print(f'AMENAM tube count: {int(n_cover)} to cover the surface, rounded to {int(n_tubes)} '
      f'for {int(AM_PASSES)} passes, so the second rounding MOVES it')
print(f'UBIT equivalent single-shell P residual on the shell-series relation: {root_residual!r}')
print(f'OKWORI second method: UA x LMTD = {ua * lm2!r} against the rated {q2!r}')
print('every identity this file asserts, checked here first:')
for what, diff, eps in checks:
    print(f'  {diff:.3e} <= {eps:.0e}  {what}')
