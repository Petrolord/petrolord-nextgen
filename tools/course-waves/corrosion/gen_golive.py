#!/usr/bin/env python3
"""Generate the FC9 go-live migration.

NOTHING HERE IS RETYPED. The eighteen graded values are read out of the
CAPSTONE ROWS THE LADDER ITSELF SEEDED, by key, inside the same transaction, so
the file verifies what it shipped rather than what a generator remembered. The
conditions are parsed out of fc9_capstone.mjs, the generator that ran the
engine. The numbers a learner is handed are parsed out of the shipped prompts BY
POSTGRES, and the published figures a graded value may not collide with are
every numeric literal the teaching digest prints.

EIGHTEEN OF THE EIGHTEEN GRADED VALUES ARE REPRODUCED BY EXACT CLOSED FORM, and
that is a property of what FC9 chose to grade rather than an ambition: not one
graded field is a corrosion rate the correlation produced, so every one of them
is bookkeeping, a definition, or arithmetic over typed percentages, stated
allowances and a SURVEYED rate. Four Expert fields are found in the engine by
BISECTING its own verdict, and those four are asserted here by the relation
they are a root of rather than by restating any algebra the engine uses.

AND ELEVEN OF THE EIGHTEEN ARE ASSERTED TWICE, BY ROUTES WITH NOTHING IN COMMON.
A gate that restates the formula validates nothing, so wherever a second route
exists it is taken: the H2S partial pressure in psia again from the DEFINITIONS
of the pound-force and the bar rather than from the exported factor; the mole ratio again
from two OTHER graded fields; the metal-loss ratio again from the graded
effective inhibition; the Professional shortfall again from the graded retained
fraction; the inhibited rate and the required allowance and the lost life
again through each other; and on the Expert tier the design-life identity, the
target identity, and the reinstating allowance and the stripped life again
through the graded credit ratio and the graded tolerable rate.

WHAT IT REFUSES TO WRITE. A division with a bare integer denominator (Postgres
divides integer by integer as an integer); a malformed numeric literal; a
refusal that reads a graded value and does not name it; a graded value that
collides, at its own SHIPPED tolerance, with a number the learner is handed,
with a number the digest publishes, or with a quantity held for the literature;
and an em dash or an en dash, which this programme's copy rule forbids.

Usage: python3 gen_golive.py
   FC9_WAVE        the wave directory (default /root/fc-wip-corrosion)
   FC9_REPO        the nextgen clone   (default /root/wt-fc9-nextgen)
   FC9_COURSE_SQL  the course migration this ladder emits, for the prompt sweep
   FC9_GOLIVE_OUT  where to write
"""
import json
import os
import re
import sys

W = os.environ.get('FC9_WAVE', '/root/fc-wip-corrosion')
REPO = os.environ.get('FC9_REPO', '/root/wt-fc9-nextgen')
COURSE = os.environ.get(
    'FC9_COURSE_SQL', f'{REPO}/migrations/20260925_fc9_corrosion_course.sql')
OUT = os.environ.get(
    'FC9_GOLIVE_OUT', f'{REPO}/migrations/20260925_fc9_corrosion_go_live.sql')
SLUG = 'corrosion'

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
# Parsed out of the three frozen objects in fc9_capstone.mjs, the file that ran
# the engine. A condition that moves there moves the whole of this file.
CAP = open(f'{W}/fc9_capstone.mjs', encoding='utf-8').read()


def frozen(name):
    m = re.search(r'const ' + name + r' = Object\.freeze\(\{(.*?)\}\);', CAP, re.S)
    if not m:
        sys.exit(f'REFUSED: {name} is not a frozen object in fc9_capstone.mjs')
    out = {}
    for k, v in re.findall(r'(\w+):\s*([^,\n]+)', re.sub(r'//[^\n]*', '', m.group(1))):
        v = v.strip()
        out[k] = v.strip("'") if v.startswith("'") else float(v)
    return out


O, N, S = frozen('OBIGBO'), frozen('NEMBE'), frozen('SOKU')

# THE POUND-FORCE AND THE BAR, BY DEFINITION. The engine EXPORTS a bar to psia
# factor; the second route below does not use it. It rebuilds the factor from the
# definitions of the avoirdupois pound (0.45359237 kg), standard gravity
# (9.80665 m/s2), the inch (0.0254 m) and the bar (100000 Pa), so the psia field
# is checked by a route that shares no constant with the engine.
LB_KG, G_N, INCH_M, BAR_PA = 0.45359237, 9.80665, 0.0254, 100000.0
PSI_PA = LB_KG * G_N / (INCH_M * INCH_M)
BAR_TO_PSIA = BAR_PA / PSI_PA
# AND THE FACTOR THE ENGINE EXPORTS, the value digest section 3 pins by
# measurement. This go-live found that the two DISAGREE: the engine's comment
# calls its factor exact by definition, and it sits 1.9e-9 above the factor the
# definitions give (digest section 24 now measures and prints that). The graded
# psia field is the engine's, so it is asserted tightly on the engine's factor
# and AGAIN, by the definitions, at a tolerance that admits the measured gap and
# is still fifty times inside the field's own shipped grade.
ENGINE_BAR_TO_PSIA = 14.503773800721815
DEF_EPS_PSIA = 1e-8

# THE QUANTITIES HELD FOR THE LITERATURE, digest sections 3 and 21, with the
# label each is refused under. No graded value may land within its own shipped
# tolerance of any of them.
HELD = [
    (0.0031, 'the fugacity coefficient constant A'),
    (1.4, 'the fugacity coefficient constant B'),
    (250.0, 'the fugacity pressure cap in bar'),
    (4.93, 'the de Waard-Milliams reaction constant A'),
    (1119.0, 'the de Waard-Milliams reaction constant B'),
    (0.58, 'the reaction fugacity exponent'),
    (2.45, 'the mass-transfer coefficient'),
    (0.8, 'the mass-transfer velocity exponent'),
    (0.2, 'the mass-transfer diameter exponent and the Blasius exponent'),
    (2400.0, 'the scale constant A'),
    (0.6, 'the scale fugacity exponent'),
    (6.7, 'the scale constant C'),
    (0.5, 'the pH slope and the moderate category band'),
    (4.0, 'the pH reference'),
    (0.0035, 'the H2S screening threshold in bar'),
    (0.002, 'the carbonate boundary ratio'),
    (0.05, 'the mixed boundary ratio'),
    (100.0, 'the film-stripping threshold in Pa'),
    (50.0, 'the moderate film-risk band in Pa'),
    (0.1, 'the low category band, the controlling margin and the shortfall trigger'),
    (1.0, 'the high category band'),
    (0.046, 'the Blasius coefficient'),
    (4000.0, 'the friction branch switch Reynolds number'),
    (16.0, 'the laminar friction constant'),
]
HELD = sorted({(v, lab) for v, lab in HELD})

# THE ENGINE RETURN, OR THE CLOSED FORM, EACH GRADED FIELD IS.
PRODUCES = {
    'obigbo_co2_partial_pressure_bar': 'co2Fugacity.pco2Bar',
    'obigbo_h2s_partial_pressure_psia': 'sourServiceScreen.ph2sPsia',
    'obigbo_h2s_to_co2_mole_ratio': 'corrosionRegime.ratio',
    'obigbo_reynolds_number': 'wallShearStressPa.reynolds',
    'obigbo_effective_inhibition_pct': 'corrosionRate.effectiveInhibitionPct',
    'obigbo_metal_loss_ratio_vs_datasheet': 'corrosionRate.rateMmYr / the same at full availability',
    'nembe_retained_metal_loss_fraction': 'corrosionRate.rateMmYr / corrosionRate.uninhibitedMmYr',
    'nembe_inhibitor_shortfall_pp': 'corrosionRate.inhibitorShortfallPp',
    'nembe_inhibited_rate_mmyr': 'the surveyed rate times the retained fraction',
    'nembe_remaining_life_yr': 'remainingLife.remainingYears',
    'nembe_required_allowance_mm': 'remainingLife.requiredAllowanceMm',
    'nembe_life_lost_to_availability_yr': 'two remainingLife calls, differenced',
    'soku_tolerable_rate_mmyr': 'a bisection on remainingLife.meetsDesignLife',
    'soku_required_availability_pct': 'a bisection on corrosionRate.effectiveInhibitionPct',
    'soku_availability_for_design_life_pct': 'a bisection through both doors on meetsDesignLife',
    'soku_allowance_to_reinstate_mm': 'a bisection on the total allowance, on meetsDesignLife',
    'soku_stripped_film_life_yr': 'remainingLife.remainingYears at the uninhibited rate',
    'soku_film_credit_life_ratio': 'two remainingLife lives, divided',
}
assert set(PRODUCES) == {k for _t, k, _v, _tol in fields}, 'PRODUCES and fields.json disagree'

# THE KEY FRAGMENTS THAT NAME A HELD PATH, deliberately SPECIFIC. `film` is NOT
# one of them: soku_stripped_film_life_yr is a surveyed rate against an
# allowance and carries no held constant, and a guard that fired on it would be
# argued with and stop being read. The discrimination is proved below.
FORBIDDEN_KEY_FRAGMENTS = [
    'category', 'regime', 'region', 'material', 'fugacity', 'scale', 'onset',
    'friction', 'shear', 'dwm', 'reaction', 'mass_transfer', 'threshold',
    'decades', 'interval', 'retirement', 'correlation_rate',
]
FORBIDDEN_LABEL_FRAGMENTS = [
    'category', 'band', 'regime', 'severity', 'region', 'material', 'fugacity',
    'friction factor', 'wall shear', 'onset', 'de waard', 'threshold', 'scale factor',
]

refused = []
for tier, key, val, tol in fields:
    for frag in FORBIDDEN_KEY_FRAGMENTS:
        if frag in key:
            refused.append(f'{tier}.{key} names a held path through "{frag}"')
    for h, label in HELD:
        if abs(abs(val) - h) <= tol:
            refused.append(f'{tier}.{key} = {val} is within {tol} of {h} ({label}), which is HELD')
if not [frag for frag in FORBIDDEN_KEY_FRAGMENTS if frag in 'obigbo_wall_shear_pa']:
    refused.append('the forbidden-key sweep does not catch a planted wall_shear key')
if any(frag in 'soku_stripped_film_life_yr' for frag in FORBIDDEN_KEY_FRAGMENTS):
    refused.append('the forbidden-key sweep fires on soku_stripped_film_life_yr, which carries no held constant')

# ---------------------------------------------------------------------------
# THE ARITHMETIC IS CHECKED HERE BEFORE IT IS EMITTED, so a go-live that cannot
# pass is never written in the first place.
# ---------------------------------------------------------------------------
checks = []


def same(what, a, b, eps):
    checks.append((what, abs(a - b), eps))
    if not abs(a - b) <= eps:
        refused.append(f'{what}: {a} against {b}, difference {abs(a - b)} exceeds {eps}')


B, I, E = 'beginner', 'intermediate', 'advanced'
# Associate, OBIGBO.
same('OBIGBO CO2 partial pressure', O['pTotalBar'] * O['co2MolFrac'], g(B, 'obigbo_co2_partial_pressure_bar'), 1e-12)
same('OBIGBO H2S partial pressure in psia, on the engine factor',
     O['pTotalBar'] * O['h2sMolFrac'] * ENGINE_BAR_TO_PSIA, g(B, 'obigbo_h2s_partial_pressure_psia'), 1e-12)
same('OBIGBO H2S partial pressure in psia, from the definition of the pound-force',
     O['pTotalBar'] * O['h2sMolFrac'] * BAR_TO_PSIA, g(B, 'obigbo_h2s_partial_pressure_psia'), DEF_EPS_PSIA)
if not DEF_EPS_PSIA * 50.0 <= F[(B, 'obigbo_h2s_partial_pressure_psia')][1]:
    refused.append('the definitions route on the psia field is not fifty times inside its shipped tolerance')
same('OBIGBO mole ratio', O['h2sMolFrac'] / O['co2MolFrac'], g(B, 'obigbo_h2s_to_co2_mole_ratio'), 1e-14)
same('OBIGBO mole ratio from the two graded partial pressures',
     (g(B, 'obigbo_h2s_partial_pressure_psia') / ENGINE_BAR_TO_PSIA) / g(B, 'obigbo_co2_partial_pressure_bar'),
     g(B, 'obigbo_h2s_to_co2_mole_ratio'), 1e-14)
same('OBIGBO Reynolds number', O['densityKgM3'] * O['velocityMS'] * O['diameterM'] / O['viscosityPaS'],
     g(B, 'obigbo_reynolds_number'), 1e-8)
same('OBIGBO effective inhibition', O['inhibitorEfficiencyPct'] * O['inhibitorAvailabilityPct'] / 100.0,
     g(B, 'obigbo_effective_inhibition_pct'), 1e-11)
same('OBIGBO metal-loss ratio',
     (100.0 - O['inhibitorEfficiencyPct'] * O['inhibitorAvailabilityPct'] / 100.0) / (100.0 - O['inhibitorEfficiencyPct']),
     g(B, 'obigbo_metal_loss_ratio_vs_datasheet'), 1e-12)
same('OBIGBO metal-loss ratio from the GRADED effective inhibition',
     (100.0 - g(B, 'obigbo_effective_inhibition_pct')) / (100.0 - O['inhibitorEfficiencyPct']),
     g(B, 'obigbo_metal_loss_ratio_vs_datasheet'), 1e-12)

# Professional, NEMBE CREEK.
n_ret = 1.0 - N['inhibitorEfficiencyPct'] * N['inhibitorAvailabilityPct'] / 10000.0
n_left = N['corrosionAllowanceMm'] - N['consumedMm']
same('NEMBE retained fraction', n_ret, g(I, 'nembe_retained_metal_loss_fraction'), 1e-13)
same('NEMBE shortfall', N['inhibitorEfficiencyPct'] - N['inhibitorEfficiencyPct'] * N['inhibitorAvailabilityPct'] / 100.0,
     g(I, 'nembe_inhibitor_shortfall_pp'), 1e-11)
same('NEMBE shortfall from the GRADED retained fraction',
     100.0 * g(I, 'nembe_retained_metal_loss_fraction') - (100.0 - N['inhibitorEfficiencyPct']),
     g(I, 'nembe_inhibitor_shortfall_pp'), 1e-10)
same('NEMBE inhibited rate from the GRADED retained fraction',
     N['surveyedUninhibitedMmYr'] * g(I, 'nembe_retained_metal_loss_fraction'), g(I, 'nembe_inhibited_rate_mmyr'), 1e-13)
same('NEMBE remaining life', n_left / g(I, 'nembe_inhibited_rate_mmyr'), g(I, 'nembe_remaining_life_yr'), 1e-11)
same('NEMBE required allowance', g(I, 'nembe_inhibited_rate_mmyr') * N['designLifeYears'],
     g(I, 'nembe_required_allowance_mm'), 1e-12)
same('NEMBE required allowance through the GRADED life, the same allowance by the other door',
     n_left * N['designLifeYears'] / g(I, 'nembe_remaining_life_yr'), g(I, 'nembe_required_allowance_mm'), 1e-10)
same('NEMBE life lost to availability',
     n_left / (N['surveyedUninhibitedMmYr'] * (1.0 - N['inhibitorEfficiencyPct'] / 100.0)) - g(I, 'nembe_remaining_life_yr'),
     g(I, 'nembe_life_lost_to_availability_yr'), 1e-10)

# Expert, SOKU.
s_left = S['corrosionAllowanceMm'] - S['consumedMm']
s_ret = 1.0 - S['inhibitorEfficiencyPct'] * S['inhibitorAvailabilityPct'] / 10000.0
same('SOKU tolerable rate', s_left / S['designLifeYears'], g(E, 'soku_tolerable_rate_mmyr'), 1e-12)
same('SOKU the design-life identity on the GRADED tolerable rate',
     g(E, 'soku_tolerable_rate_mmyr') * S['designLifeYears'], s_left, 1e-11)
same('SOKU required availability', 100.0 * S['targetEffectiveProtectionPct'] / S['inhibitorEfficiencyPct'],
     g(E, 'soku_required_availability_pct'), 1e-10)
same('SOKU the target identity on the GRADED availability',
     g(E, 'soku_required_availability_pct') * S['inhibitorEfficiencyPct'] / 100.0, S['targetEffectiveProtectionPct'], 1e-10)
same('SOKU availability for the design life, AS A ROOT of the design-life relation',
     S['surveyedUninhibitedMmYr'] * (1.0 - S['inhibitorEfficiencyPct'] * g(E, 'soku_availability_for_design_life_pct') / 10000.0) * S['designLifeYears'],
     s_left, 1e-10)
same('SOKU allowance to reinstate', S['consumedMm'] + S['surveyedUninhibitedMmYr'] * s_ret * S['designLifeYears'],
     g(E, 'soku_allowance_to_reinstate_mm'), 1e-10)
same('SOKU stripped life', s_left / S['surveyedUninhibitedMmYr'], g(E, 'soku_stripped_film_life_yr'), 1e-12)
same('SOKU stripped life through the GRADED tolerable rate',
     g(E, 'soku_tolerable_rate_mmyr') * S['designLifeYears'] / S['surveyedUninhibitedMmYr'],
     g(E, 'soku_stripped_film_life_yr'), 1e-11)
same('SOKU credit ratio', 1.0 / s_ret, g(E, 'soku_film_credit_life_ratio'), 1e-11)
same('SOKU the reinstating allowance through the GRADED credit ratio',
     (g(E, 'soku_allowance_to_reinstate_mm') - S['consumedMm']) * g(E, 'soku_film_credit_life_ratio'),
     S['surveyedUninhibitedMmYr'] * S['designLifeYears'], 1e-9)
for what, cond in (
        ('SOKU the programme misses the design life, so every inversion has a target',
         s_left / (S['surveyedUninhibitedMmYr'] * s_ret) < S['designLifeYears']),
        ('SOKU the design-life availability sits above the one the programme runs at and below 100',
         S['inhibitorAvailabilityPct'] < g(E, 'soku_availability_for_design_life_pct') < 100.0),
        ('SOKU the reinstating allowance exceeds the allowance the line has',
         g(E, 'soku_allowance_to_reinstate_mm') > S['corrosionAllowanceMm']),
        ('NEMBE the programme misses its design life, so the shortfall is real',
         g(I, 'nembe_remaining_life_yr') < N['designLifeYears'])):
    checks.append((what, 0.0 if cond else 1.0, 0.0))
    if not cond:
        refused.append(what)

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
# ladder emits. THE COMMENT HALF IS DROPPED FIRST, because a header apostrophe
# throws the quote pairing off and the sweep then reads nothing while reporting
# no collisions; the count parsed is asserted below.
course_sql = '\n'.join(
    ln for ln in open(COURSE, encoding='utf-8').read().splitlines()
    if not ln.lstrip().startswith('--'))
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
-- FC9 GO-LIVE (HELD): Corrosion & Integrity flips to 'available'. The NINTH
-- Facilities course, at path_order 47 above FC8 at 46, FC7 at 45, FC6
-- heattransfer at 44, FC5 at 43, FC4 gasprocessing at 42, FC3 rotating at 41,
-- FC2 linesizing at 40 and FC1 separation at 39.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/corrosion. The 78 lessons, the teaching lab
-- (corrosionLab.js) and its three explorer panels (the chemistry, the rate and
-- the corrosion inhibitor and integrity explorers) ship in the ZIP and NOT in
-- this database, so a flip before the upload puts a live catalogue tile in
-- front of a route that does not exist. This file is written, dry-run and left
-- unapplied on purpose.
--
-- EVERY DENOMINATOR BELOW IS A FLOAT, ON PURPOSE. Postgres divides integer by
-- integer as an integer. The generator that wrote this file refuses to emit a
-- division with a bare integer denominator, and refuses a malformed literal.
--
-- ALL EIGHTEEN GRADED VALUES ARE REPRODUCED BY EXACT CLOSED FORM, because not
-- one of them is a corrosion rate the correlation produced: they are partial
-- pressures, a mole ratio, a Reynolds number by definition, and arithmetic
-- over typed percentages, stated allowances and a SURVEYED rate. The four
-- Expert fields the engine finds by BISECTION are asserted by the relation they
-- are a root of, never by restating the engine's own algebra.
--
-- AND ELEVEN ARE ASSERTED TWICE, BY ROUTES WITH NOTHING IN COMMON: the psia
-- field again from the DEFINITIONS of the pound-force and the bar, which found
-- that the engine's factor, which its own comment calls exact, sits 1.9e-9
-- above them (digest section 24 now prints it); the mole ratio again from the two graded partial
-- pressures; the metal-loss ratio again from the graded inhibition; the
-- shortfall again from the graded retained fraction; the inhibited rate, the
-- required allowance and the lost life again through each other; and the
-- Expert design-life identity, target identity, stripped life and reinstating
-- allowance again through the graded tolerable rate and the graded credit
-- ratio.
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
A('  v_psia double precision; v_psia_def double precision; v_left double precision; v_ret double precision;')
for (t, k) in V:
    A(f'  {V[(t, k)]} double precision;')
A('begin')

A('''
  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures
   where app_slug = '{SLUG}' and active;
  if v_structures <> 3 then
    raise exception 'FC9 go-live refused: {SLUG} has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions from public.academy_quiz_questions where app_slug = '{SLUG}';
  if v_questions <> 396 then
    raise exception 'FC9 go-live refused: {SLUG} has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_graded from (
    select tier from public.academy_quiz_questions where app_slug = '{SLUG}'
     group by tier having count(*) <> 132) t;
  if v_graded <> 0 then
    raise exception 'FC9 go-live refused: % tier(s) do not carry exactly 132 questions', v_graded;
  end if;

  select count(*) into v_graded from (
    select tier, module_key from public.academy_quiz_questions
     where app_slug = '{SLUG}' and scope = 'module'
     group by tier, module_key having count(*) <> 15) t;
  if v_graded <> 0 then
    raise exception 'FC9 go-live refused: % module bank(s) do not carry exactly 15 questions', v_graded;
  end if;

  select count(*) into v_graded from (
    select tier from public.academy_quiz_questions
     where app_slug = '{SLUG}' and scope = 'final'
     group by tier having count(*) <> 42) t;
  if v_graded <> 0 then
    raise exception 'FC9 go-live refused: % final exam(s) do not carry exactly 42 questions', v_graded;
  end if;

  -- A question whose key is outside its own options is unanswerable, and it is
  -- the one shape a count of rows can never see.
  select count(*) into v_graded from public.academy_quiz_questions
   where app_slug = '{SLUG}'
     and (jsonb_array_length(options) <> 4
          or answer_index < 0 or answer_index > 3);
  if v_graded <> 0 then
    raise exception 'FC9 go-live refused: % question(s) do not offer four options with a key inside them', v_graded;
  end if;

  select count(*) into v_capstones from public.academy_capstones where app_slug = '{SLUG}';
  if v_capstones <> 3 then
    raise exception 'FC9 go-live refused: {SLUG} has % capstones, expected 3', v_capstones;
  end if;

  select count(*) into v_lessons
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m,
         lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = '{SLUG}' and s.active;
  if v_lessons <> 78 then
    raise exception 'FC9 go-live refused: {SLUG} carries % lesson keys, expected 78', v_lessons;
  end if;

  select count(*) into v_modules
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = '{SLUG}' and s.active;
  if v_modules <> 18 then
    raise exception 'FC9 go-live refused: {SLUG} carries % modules, expected 18 (six per tier)', v_modules;
  end if;

  -- THE ONE HISTORY MODULE. The Expert tier's m06 is the only module whose
  -- subject is what this engine used to do, and its frame lives in its KEY.
  if not exists (select 1 from public.academy_course_structures s,
                        lateral jsonb_array_elements(s.structure->'modules') m
                  where s.app_slug = '{SLUG}' and s.tier = 'advanced' and s.active
                    and m->>'key' = 'm06-what-this-engine-used-to-do') then
    raise exception 'FC9 go-live refused: the Expert history module is not keyed m06-what-this-engine-used-to-do, so its frame is lost';
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
    raise exception 'FC9 go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_graded;
  end if;

  select count(*) into v_graded from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f where c.app_slug = '{SLUG}';
  if v_graded <> 18 then
    raise exception 'FC9 go-live refused: {SLUG} has % graded capstone fields, expected 18', v_graded;
  end if;

  select count(*) into v_graded from (
    select c.tier from public.academy_capstones c,
           lateral jsonb_array_elements(c.fields) f
     where c.app_slug = '{SLUG}' group by c.tier having count(*) <> 6) t;
  if v_graded <> 0 then
    raise exception 'FC9 go-live refused: % tier(s) do not grade exactly six fields', v_graded;
  end if;

  if not exists (select 1 from public.academy_apps
                  where slug = '{SLUG}' and module = 'facilities'
                    and path_order = 47 and prereq_slug is null) then
    raise exception 'FC9 go-live refused: the {SLUG} catalogue row is not facilities at path_order 47 with no prerequisite';
  end if;

  if exists (select 1 from public.academy_apps
              where path_order = 47 and slug <> '{SLUG}') then
    raise exception 'FC9 go-live refused: another course already holds path_order 47';
  end if;

  -- THE VOCABULARY RULE, ON WHAT A LEARNER IS SERVED. A bare "inhibitor" reads
  -- as the hydrate inhibitor of the Flow Assurance course. Every shipped prompt
  -- and every graded label is swept.
  select count(*) into v_graded from public.academy_capstones c
   where c.app_slug = '{SLUG}'
     and regexp_replace(c.prompt, 'corrosion inhibitor', '', 'g') ~ 'inhibitor';
  if v_graded <> 0 then
    raise exception 'FC9 go-live refused: % capstone prompt(s) carry a bare inhibitor', v_graded;
  end if;
'''.replace('{SLUG}', SLUG))

HELD_VALUES = ', '.join(f17(v) for v, _l in HELD)
HELD_LABELS = ', '.join("'" + lab.replace("'", "''") + "'" for _v, lab in HELD)
FORBIDDEN_SQL = ', '.join("'" + f + "'" for f in FORBIDDEN_KEY_FRAGMENTS)
FORBIDDEN_LABEL_SQL = ', '.join("'" + f + "'" for f in FORBIDDEN_LABEL_FRAGMENTS)
PUBLISHED_SQL = ', '.join(f17(v) for v in sorted(published))

A(f'''
  -- ------------------------------------------- the held-for-literature gates
  -- A FRAGMENT IS MATCHED AS A LITERAL SUBSTRING WITH strpos, NEVER WITH LIKE.
  -- In LIKE an underscore is a one-character wildcard, so the fragment mass_transfer
  -- would also match a key with any other character in that place. The
  -- generator's own Python guard tests a literal substring, and strpos is
  -- the same test. FC5's dry run caught the LIKE form refusing a field that
  -- names no held quantity (its kw_ against a kwm).
  -- ON THE NAME. A graded field that NAMES a quantity this module holds for the
  -- literature is refused before anything is computed from it.
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array[{FORBIDDEN_SQL}]) frag
   where c.app_slug = '{SLUG}' and strpos(f->>'key', frag) > 0;
  if v_graded <> 0 then
    raise exception 'FC9 go-live refused: % graded field(s) name a quantity held for the literature: %', v_graded, v_names;
  end if;

  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array[{FORBIDDEN_LABEL_SQL}]) frag
   where c.app_slug = '{SLUG}' and strpos(lower(f->>'label'), frag) > 0;
  if v_graded <> 0 then
    raise exception 'FC9 go-live refused: % graded field label(s) name a quantity held for the literature: %', v_graded, v_names;
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
    raise exception 'FC9 go-live refused: % graded field(s) land on a quantity held for the literature: %', v_graded, v_names;
  end if;

  -- ---------------------------------------------------- the collision sweeps
  -- EVERY NUMBER THE TEACHING DIGEST PRINTS, at each field's SHIPPED tolerance.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key'), ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array[{PUBLISHED_SQL}]) pub
   where c.app_slug = '{SLUG}'
     and abs(abs((f->>'expected')::double precision) - pub) <= (f->>'tol')::double precision;
  if v_graded <> 0 then
    raise exception 'FC9 go-live refused: % graded field(s) sit within their own tolerance of a value the digest publishes, which makes them a lookup rather than a calculation: %', v_graded, v_names;
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
    raise exception 'FC9 go-live refused: % graded field(s) land on a number the learner is handed in a prompt, which makes the field a transcription rather than a calculation: %', v_graded, v_names;
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
    raise exception 'FC9 go-live refused: % pair(s) of graded fields are within the looser of their two tolerances: %', v_graded, v_names;
  end if;

  -- A capstone prompt stating another tier's graded answer hands that tier away.
  select count(*), string_agg(distinct c.tier || ' states ' || gg.owner || '/' || gg.k, ', ')
    into v_graded, v_names from public.academy_capstones c,
         (select f->>'expected' as e, f->>'key' as k, c2.tier as owner
            from public.academy_capstones c2, lateral jsonb_array_elements(c2.fields) f
           where c2.app_slug = '{SLUG}') gg
   where c.app_slug = '{SLUG}' and c.tier <> gg.owner and c.prompt like '%' || gg.e || '%';
  if v_graded <> 0 then
    raise exception 'FC9 go-live refused: % capstone prompt(s) state a graded value belonging to another tier: %', v_graded, v_names;
  end if;
''')

# ------------------------------------------------ load the eighteen values
A('\n  -- --------------------------------------- the eighteen graded values')
for (t, k), var in V.items():
    A(f"""  select (f->>'expected')::double precision into {var}
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = '{SLUG}' and c.tier = '{t}' and f->>'key' = '{k}';""")
A('  if ' + '\n     or '.join(f'{v} is null' for v in V.values()) + ' then')
A("    raise exception 'FC9 go-live refused: one or more of the eighteen graded fields is missing';")
A('  end if;')


def VB(k):
    return V[('beginner', k)]


def VI(k):
    return V[('intermediate', k)]


def VE(k):
    return V[('advanced', k)]


A(f'''
  -- ------------------------------------------------- the Associate, OBIGBO
  -- The CO2 partial pressure is the total pressure times the mole fraction.
  -- No fugacity coefficient, which is the whole distinction the tier teaches.
  if abs({VB('obigbo_co2_partial_pressure_bar')} - {f17(O['pTotalBar'])} * {f17(O['co2MolFrac'])}) > 1e-12 then
    raise exception 'FC9 go-live refused: the CO2 partial pressure of % bar is not the total pressure of % bar times the mole fraction %', {VB('obigbo_co2_partial_pressure_bar')}, {f17(O['pTotalBar'])}, {f17(O['co2MolFrac'])};
  end if;

  -- THE PSIA FIELD, ON THE FACTOR THE ENGINE EXPORTS (pinned by measurement in
  -- digest section 3). Tight, so a move far smaller than the grade is refused.
  v_psia := {f17(ENGINE_BAR_TO_PSIA)};
  if abs({VB('obigbo_h2s_partial_pressure_psia')} - {f17(O['pTotalBar'])} * {f17(O['h2sMolFrac'])} * v_psia) > 1e-12 then
    raise exception 'FC9 go-live refused: the H2S partial pressure of % psia is not % bar times the mole fraction % converted by the engine factor %', {VB('obigbo_h2s_partial_pressure_psia')}, {f17(O['pTotalBar'])}, {f17(O['h2sMolFrac'])}, v_psia;
  end if;

  -- AND AGAIN FROM THE DEFINITIONS, which share no constant with the engine: the
  -- pound is 0.45359237 kg, standard gravity 9.80665 m/s2, the inch 0.0254 m and
  -- the bar 100000 Pa. The engine's factor sits 1.9e-9 above this one (its own
  -- comment calls it exact, and it is not), so this route admits 1e-8, which is
  -- still fifty times inside the field's shipped grade. The studio's truncated
  -- 14.5038 would miss by more than the grade itself.
  v_psia_def := {f17(BAR_PA)} / ({f17(LB_KG)} * {f17(G_N)} / ({f17(INCH_M)} * {f17(INCH_M)}));
  if abs({VB('obigbo_h2s_partial_pressure_psia')} - {f17(O['pTotalBar'])} * {f17(O['h2sMolFrac'])} * v_psia_def) > {f17(DEF_EPS_PSIA)} then
    raise exception 'FC9 go-live refused: the H2S partial pressure of % psia is not what the definitions of the bar and the pound-force give, % psia', {VB('obigbo_h2s_partial_pressure_psia')}, {f17(O['pTotalBar'])} * {f17(O['h2sMolFrac'])} * v_psia_def;
  end if;

  -- The mole ratio, PRESSURE FREE: the ratio of the two mole fractions.
  if abs({VB('obigbo_h2s_to_co2_mole_ratio')} - {f17(O['h2sMolFrac'])} / {f17(O['co2MolFrac'])}) > 1e-14 then
    raise exception 'FC9 go-live refused: the H2S to CO2 mole ratio of % is not the ratio of the mole fractions % and %', {VB('obigbo_h2s_to_co2_mole_ratio')}, {f17(O['h2sMolFrac'])}, {f17(O['co2MolFrac'])};
  end if;

  -- AND AGAIN FROM TWO OTHER GRADED FIELDS. The graded psia back in bar over
  -- the graded CO2 partial pressure is the same ratio by a route through the
  -- pressure rather than around it.
  if abs({VB('obigbo_h2s_to_co2_mole_ratio')} - ({VB('obigbo_h2s_partial_pressure_psia')} / v_psia) / {VB('obigbo_co2_partial_pressure_bar')}) > 1e-14 then
    raise exception 'FC9 go-live refused: the graded mole ratio of % disagrees with the graded H2S partial pressure of % psia over the graded CO2 partial pressure of % bar', {VB('obigbo_h2s_to_co2_mole_ratio')}, {VB('obigbo_h2s_partial_pressure_psia')}, {VB('obigbo_co2_partial_pressure_bar')};
  end if;

  -- This module's Reynolds number is a DEFINITION. The held Blasius pair and
  -- the branch switch act downstream of it and no graded field reads them.
  if abs({VB('obigbo_reynolds_number')} - {f17(O['densityKgM3'])} * {f17(O['velocityMS'])} * {f17(O['diameterM'])} / {f17(O['viscosityPaS'])}) > 1e-8 then
    raise exception 'FC9 go-live refused: the Reynolds number of % is not density % times velocity % times diameter % over viscosity %', {VB('obigbo_reynolds_number')}, {f17(O['densityKgM3'])}, {f17(O['velocityMS'])}, {f17(O['diameterM'])}, {f17(O['viscosityPaS'])};
  end if;

  -- The effective corrosion inhibition is the efficiency times the
  -- availability, and nothing else.
  if abs({VB('obigbo_effective_inhibition_pct')} - {f17(O['inhibitorEfficiencyPct'])} * {f17(O['inhibitorAvailabilityPct'])} / 100.0) > 1e-11 then
    raise exception 'FC9 go-live refused: the effective inhibition of % percent is not % percent efficiency times % percent availability', {VB('obigbo_effective_inhibition_pct')}, {f17(O['inhibitorEfficiencyPct'])}, {f17(O['inhibitorAvailabilityPct'])};
  end if;

  -- The metal-loss ratio against the datasheet number, off the two typed
  -- percentages. The correlation divides out of it entirely.
  if abs({VB('obigbo_metal_loss_ratio_vs_datasheet')} - (100.0 - {f17(O['inhibitorEfficiencyPct'])} * {f17(O['inhibitorAvailabilityPct'])} / 100.0) / (100.0 - {f17(O['inhibitorEfficiencyPct'])})) > 1e-12 then
    raise exception 'FC9 go-live refused: the metal-loss ratio of % is not what % percent efficiency at % percent availability leaves against the datasheet', {VB('obigbo_metal_loss_ratio_vs_datasheet')}, {f17(O['inhibitorEfficiencyPct'])}, {f17(O['inhibitorAvailabilityPct'])};
  end if;

  -- AND FROM THE GRADED INHIBITION, which reaches the same ratio through the
  -- field a learner reports rather than through the two inputs.
  if abs({VB('obigbo_metal_loss_ratio_vs_datasheet')} - (100.0 - {VB('obigbo_effective_inhibition_pct')}) / (100.0 - {f17(O['inhibitorEfficiencyPct'])})) > 1e-12 then
    raise exception 'FC9 go-live refused: the graded metal-loss ratio of % disagrees with the graded effective inhibition of % percent', {VB('obigbo_metal_loss_ratio_vs_datasheet')}, {VB('obigbo_effective_inhibition_pct')};
  end if;
''')

A(f'''
  -- ------------------------------------------ the Professional, NEMBE CREEK
  -- The retained fraction is what the programme leaves of the metal loss.
  if abs({VI('nembe_retained_metal_loss_fraction')} - (1.0 - {f17(N['inhibitorEfficiencyPct'])} * {f17(N['inhibitorAvailabilityPct'])} / 10000.0)) > 1e-13 then
    raise exception 'FC9 go-live refused: the retained fraction of % is not one less % percent times % percent', {VI('nembe_retained_metal_loss_fraction')}, {f17(N['inhibitorEfficiencyPct'])}, {f17(N['inhibitorAvailabilityPct'])};
  end if;

  if abs({VI('nembe_inhibitor_shortfall_pp')} - ({f17(N['inhibitorEfficiencyPct'])} - {f17(N['inhibitorEfficiencyPct'])} * {f17(N['inhibitorAvailabilityPct'])} / 100.0)) > 1e-11 then
    raise exception 'FC9 go-live refused: the shortfall of % percentage points is not the datasheet % less the effective protection', {VI('nembe_inhibitor_shortfall_pp')}, {f17(N['inhibitorEfficiencyPct'])};
  end if;

  -- THE SHORTFALL AGAIN, FROM THE GRADED RETAINED FRACTION.
  if abs({VI('nembe_inhibitor_shortfall_pp')} - (100.0 * {VI('nembe_retained_metal_loss_fraction')} - (100.0 - {f17(N['inhibitorEfficiencyPct'])}))) > 1e-10 then
    raise exception 'FC9 go-live refused: the graded shortfall of % disagrees with the graded retained fraction of %', {VI('nembe_inhibitor_shortfall_pp')}, {VI('nembe_retained_metal_loss_fraction')};
  end if;

  -- The inhibited rate is the SURVEYED rate times the retained fraction. No
  -- correlation rate is in it.
  if abs({VI('nembe_inhibited_rate_mmyr')} - {f17(N['surveyedUninhibitedMmYr'])} * {VI('nembe_retained_metal_loss_fraction')}) > 1e-13 then
    raise exception 'FC9 go-live refused: the inhibited rate of % mm/yr is not the surveyed % mm/yr times the graded retained fraction %', {VI('nembe_inhibited_rate_mmyr')}, {f17(N['surveyedUninhibitedMmYr'])}, {VI('nembe_retained_metal_loss_fraction')};
  end if;

  v_left := {f17(N['corrosionAllowanceMm'])} - {f17(N['consumedMm'])};
  if abs({VI('nembe_remaining_life_yr')} - v_left / {VI('nembe_inhibited_rate_mmyr')}) > 1e-11 then
    raise exception 'FC9 go-live refused: the remaining life of % yr is not the remaining allowance % mm over the graded inhibited rate % mm/yr', {VI('nembe_remaining_life_yr')}, v_left, {VI('nembe_inhibited_rate_mmyr')};
  end if;

  -- The required allowance IGNORES what has gone. It is the rate times the
  -- design life, and nothing else.
  if abs({VI('nembe_required_allowance_mm')} - {VI('nembe_inhibited_rate_mmyr')} * {f17(N['designLifeYears'])}) > 1e-12 then
    raise exception 'FC9 go-live refused: the required allowance of % mm is not the graded rate % mm/yr times the % year design life', {VI('nembe_required_allowance_mm')}, {VI('nembe_inhibited_rate_mmyr')}, {f17(N['designLifeYears'])};
  end if;

  -- AND BY THE OTHER DOOR: the remaining allowance times the design life over
  -- the graded life is the same allowance, reached through the years.
  if abs({VI('nembe_required_allowance_mm')} - v_left * {f17(N['designLifeYears'])} / {VI('nembe_remaining_life_yr')}) > 1e-10 then
    raise exception 'FC9 go-live refused: the graded required allowance of % mm disagrees with the graded life of % yr', {VI('nembe_required_allowance_mm')}, {VI('nembe_remaining_life_yr')};
  end if;

  if not ({VI('nembe_remaining_life_yr')} < {f17(N['designLifeYears'])}) then
    raise exception 'FC9 go-live refused: the programme life of % yr meets the design life, so the tier has no shortfall to teach', {VI('nembe_remaining_life_yr')};
  end if;

  -- The life the availability costs, against the same corrosion inhibitor at
  -- full availability.
  if abs({VI('nembe_life_lost_to_availability_yr')} - (v_left / ({f17(N['surveyedUninhibitedMmYr'])} * (1.0 - {f17(N['inhibitorEfficiencyPct'])} / 100.0)) - {VI('nembe_remaining_life_yr')})) > 1e-10 then
    raise exception 'FC9 go-live refused: the life lost to availability of % yr is not the full-availability life less the graded life of % yr', {VI('nembe_life_lost_to_availability_yr')}, {VI('nembe_remaining_life_yr')};
  end if;
''')

A(f'''
  -- ------------------------------------------------------- the Expert, SOKU
  -- Four of these six were found by BISECTING the engine's own verdict, so
  -- each is asserted by the relation it is a root of.
  v_left := {f17(S['corrosionAllowanceMm'])} - {f17(S['consumedMm'])};
  v_ret := 1.0 - {f17(S['inhibitorEfficiencyPct'])} * {f17(S['inhibitorAvailabilityPct'])} / 10000.0;

  if abs({VE('soku_tolerable_rate_mmyr')} - v_left / {f17(S['designLifeYears'])}) > 1e-12 then
    raise exception 'FC9 go-live refused: the tolerable rate of % mm/yr is not the remaining allowance % mm over the % year design life', {VE('soku_tolerable_rate_mmyr')}, v_left, {f17(S['designLifeYears'])};
  end if;
  if abs({VE('soku_tolerable_rate_mmyr')} * {f17(S['designLifeYears'])} - v_left) > 1e-11 then
    raise exception 'FC9 go-live refused: the graded tolerable rate of % mm/yr does not spend exactly the remaining allowance % mm over the design life', {VE('soku_tolerable_rate_mmyr')}, v_left;
  end if;

  if abs({VE('soku_required_availability_pct')} - 100.0 * {f17(S['targetEffectiveProtectionPct'])} / {f17(S['inhibitorEfficiencyPct'])}) > 1e-10 then
    raise exception 'FC9 go-live refused: the required availability of % percent is not the target % over the efficiency %', {VE('soku_required_availability_pct')}, {f17(S['targetEffectiveProtectionPct'])}, {f17(S['inhibitorEfficiencyPct'])};
  end if;
  if abs({VE('soku_required_availability_pct')} * {f17(S['inhibitorEfficiencyPct'])} / 100.0 - {f17(S['targetEffectiveProtectionPct'])}) > 1e-10 then
    raise exception 'FC9 go-live refused: the graded availability of % percent does not deliver the target effective protection', {VE('soku_required_availability_pct')};
  end if;

  -- AS A ROOT: at the graded availability the surveyed rate, with the credit
  -- kept, spends exactly the remaining allowance over the design life.
  if abs({f17(S['surveyedUninhibitedMmYr'])} * (1.0 - {f17(S['inhibitorEfficiencyPct'])} * {VE('soku_availability_for_design_life_pct')} / 10000.0) * {f17(S['designLifeYears'])} - v_left) > 1e-10 then
    raise exception 'FC9 go-live refused: the availability of % percent is not a root of the design-life relation on the surveyed rate', {VE('soku_availability_for_design_life_pct')};
  end if;
  if not ({f17(S['inhibitorAvailabilityPct'])} < {VE('soku_availability_for_design_life_pct')} and {VE('soku_availability_for_design_life_pct')} < 100.0) then
    raise exception 'FC9 go-live refused: the design-life availability of % percent is not between the programme availability and 100', {VE('soku_availability_for_design_life_pct')};
  end if;

  -- THE REINSTATING ALLOWANCE is the consumed depth plus the allowance a new
  -- line would need, which is the gap the tier is built on.
  if abs({VE('soku_allowance_to_reinstate_mm')} - ({f17(S['consumedMm'])} + {f17(S['surveyedUninhibitedMmYr'])} * v_ret * {f17(S['designLifeYears'])})) > 1e-10 then
    raise exception 'FC9 go-live refused: the reinstating allowance of % mm is not the consumed % mm plus the credited rate times the design life', {VE('soku_allowance_to_reinstate_mm')}, {f17(S['consumedMm'])};
  end if;
  if not ({VE('soku_allowance_to_reinstate_mm')} > {f17(S['corrosionAllowanceMm'])}) then
    raise exception 'FC9 go-live refused: the reinstating allowance of % mm does not exceed the allowance the line has, so nothing needs reinstating', {VE('soku_allowance_to_reinstate_mm')};
  end if;

  if abs({VE('soku_stripped_film_life_yr')} - v_left / {f17(S['surveyedUninhibitedMmYr'])}) > 1e-12 then
    raise exception 'FC9 go-live refused: the stripped life of % yr is not the remaining allowance % mm over the surveyed rate', {VE('soku_stripped_film_life_yr')}, v_left;
  end if;
  -- AND THROUGH THE GRADED TOLERABLE RATE, which spends the same allowance.
  if abs({VE('soku_stripped_film_life_yr')} - {VE('soku_tolerable_rate_mmyr')} * {f17(S['designLifeYears'])} / {f17(S['surveyedUninhibitedMmYr'])}) > 1e-11 then
    raise exception 'FC9 go-live refused: the graded stripped life of % yr disagrees with the graded tolerable rate of % mm/yr', {VE('soku_stripped_film_life_yr')}, {VE('soku_tolerable_rate_mmyr')};
  end if;

  if abs({VE('soku_film_credit_life_ratio')} - 1.0 / v_ret) > 1e-11 then
    raise exception 'FC9 go-live refused: the credit ratio of % is not the reciprocal of the retained fraction %', {VE('soku_film_credit_life_ratio')}, v_ret;
  end if;
  -- AND THE REINSTATING ALLOWANCE THROUGH THE GRADED CREDIT RATIO: the credited
  -- rate times the ratio is the surveyed rate, so the allowance a new line
  -- would need, times the ratio, is the surveyed rate over the design life.
  if abs(({VE('soku_allowance_to_reinstate_mm')} - {f17(S['consumedMm'])}) * {VE('soku_film_credit_life_ratio')} - {f17(S['surveyedUninhibitedMmYr'])} * {f17(S['designLifeYears'])}) > 1e-9 then
    raise exception 'FC9 go-live refused: the graded reinstating allowance of % mm and the graded credit ratio of % disagree about the surveyed rate', {VE('soku_allowance_to_reinstate_mm')}, {VE('soku_film_credit_life_ratio')};
  end if;
''')

A(f'''
  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = '{SLUG}';
  if not exists (select 1 from public.academy_apps
                  where slug = '{SLUG}' and status = 'available') then
    raise exception 'FC9 go-live refused: {SLUG} did not reach status available';
  end if;

  select count(*) filter (where status = 'available'),
         count(*) filter (where status = 'coming_soon')
    into v_available, v_soon
    from public.academy_apps;

  raise notice 'FC9 go-live: {SLUG} available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
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
        head = max(head, sql_draft.rfind(opener, 0, start))
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
for ln, line in enumerate(sql.splitlines(), 1):
    code = '' if line.lstrip().startswith('--') else line.split('--', 1)[0]
    for m in re.finditer(r'/\s*(\d+)(?![\d.eE])', code):
        intdiv.append(f'line {ln}: "/ {m.group(1)}" has a bare integer denominator -> {line.strip()[:90]}')

malformed = []
for ln, line in enumerate(sql.splitlines(), 1):
    code = '' if line.lstrip().startswith('--') else line.split('--', 1)[0]
    for m in re.finditer(r'\d+\.\d+\.\d', code):
        malformed.append(f'line {ln}: malformed numeric literal "{m.group(0)}" -> {line.strip()[:90]}')

odd = [ln for ln, l in enumerate(sql.splitlines(), 1)
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
print(f'bar to psia factor rebuilt from the definitions: {BAR_TO_PSIA!r} against the engine {ENGINE_BAR_TO_PSIA!r}, '
      f'relative {(ENGINE_BAR_TO_PSIA - BAR_TO_PSIA) / BAR_TO_PSIA:.3e}')
print('every identity this file asserts, checked here first:')
for what, diff, eps in checks:
    print(f'  {diff:.3e} <= {eps:.0e}  {what}')
