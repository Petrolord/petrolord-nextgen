#!/usr/bin/env python3
"""Generate the FC4 go-live migration.

NOTHING HERE IS RETYPED. The eighteen graded values are read out of
fields.json, the numbers a learner is handed are parsed out of the capstone
prompts in the COURSE MIGRATION this ladder already emits, and the published
figures a graded value may not collide with are every numeric literal the
teaching digest prints. The two compressibilities the temperature derivative is
a difference of are SOLVED HERE, independently, by Newton on the Dranchuk and
Abou-Kassem equation, and emitted as the reduced densities they are roots of, so
the SQL verifies the root rather than being handed a z.

WHAT IT REFUSES TO WRITE.

1. A DIVISION WITH A BARE INTEGER DENOMINATOR. Postgres divides integer by
   integer as an integer. On a sibling wave `(7350+2480)*4/1440` truncated to 27
   and lost a third of a minute of retention, and the Python check that proved
   the same identity to 0.0 difference could not see it, because only SQL does
   this. Every denominator this file emits is a float and the guard below
   refuses any that is not.
2. A MALFORMED NUMERIC LITERAL. FC3's first run emitted `2.0.0`, from a float
   already carrying its own point being given a second one by the template.
   Postgres would have refused it, but only at the dry run and only on the
   branch that reached it.
3. A REFUSAL THAT READS A GRADED VALUE AND DOES NOT NAME IT. A go-live that
   refuses without naming the field leaves the reader to work out which of
   eighteen moved, and the dry run's own negative control cannot tell a real
   refusal from any other.
4. A GRADED VALUE THAT COLLIDES, at its own tolerance, with a number the learner
   is handed in a prompt, with a number the digest publishes, or with a quantity
   held for the literature.
5. AN EM DASH OR AN EN DASH, which this programme's copy rule forbids.

Usage: python3 gen_golive.py
   FC4_WAVE        the wave directory (default /root/fc-wip-gasprocessing)
   FC4_REPO        the nextgen clone   (default /root/wt-fc4-nextgen)
   FC4_COURSE_SQL  the course migration to parse the prompts out of
   FC4_GOLIVE_OUT  where to write
"""
import json
import math
import os
import re
import sys

W = os.environ.get('FC4_WAVE', '/root/fc-wip-gasprocessing')
REPO = os.environ.get('FC4_REPO', '/root/wt-fc4-nextgen')
COURSE = os.environ.get(
    'FC4_COURSE_SQL', f'{REPO}/migrations/20260924_fc4_gasprocessing_course.sql')
OUT = os.environ.get(
    'FC4_GOLIVE_OUT', f'{REPO}/migrations/20260924_fc4_gasprocessing_go_live.sql')
SLUG = 'gasprocessing'

fields = json.load(open(f'{W}/fields.json'))
assert len(fields) == 18, f'{len(fields)} graded fields'
# THE KEYS ARE NOT UNIQUE ACROSS TIERS on this wave: `circGpm` is graded on the
# Associate as a glycol circulation and on the Professional as an amine one, by
# routes with nothing in common, which is the point of the Professional tier.
# So every map here is keyed by (TIER, KEY) and every SQL variable carries its
# tier. A flat map would have silently graded one tier against the other's
# answer.
F = {(t, k): (v, tol) for t, k, v, tol in fields}
SHORT = {'beginner': 'ass', 'intermediate': 'pro', 'advanced': 'exp'}
V = {(t, k): f'v_{SHORT[t]}_{k}' for t, k, _v, _tol in [(a, b, c, d) for a, b, c, d in fields]}
assert len(set(V.values())) == 18, 'two graded fields would share one SQL variable'


def f17(x):
    """A float literal SQL will read back as this exact double."""
    return repr(float(x))


# --------------------------------------------------------------- the inputs
# Every one of these is stated in a capstone prompt. They are written here once
# and every assertion below is built out of them, so a condition that moves
# moves the whole file rather than one line of it.
IK_P, IK_T = 880.0, 109.0
IK_GAS, IK_OUT, IK_RATIO = 47.0, 5.0, 3.6
IK_LEAN_WTPCT, IK_TABS, IK_TREB, IK_REFLUX = 99.4, 109.0, 368.0, 0.22
IK_CP, IK_LBGAL = 0.55, 9.3
IK_BTEX_PPMV, IK_BTEX_FRAC, IK_BTEX_MW = 155.0, 0.12, 92.0

OT_A, OT_STAGES, OT_SPEC = 1.85, 5.0, 0.94
OT_GAS = 71.0
OT_CO2, OT_H2S, OT_CO2_SPEC, OT_H2S_SPEC = 6.4, 0.78, 2.5, 0.0004
OT_WTPCT, OT_LEAN, OT_RICH, OT_DUTY = 33.0, 0.07, 0.38, 920.0
OT_LEAN_RETUNED = 0.03
# The DEA row of the module's own amine table. Held for the literature as a
# SET, which is why the go-live asserts nothing about where these came from and
# only that the circulation is the mole balance they close.
DEA_MW, DEA_SG = 105.14, 1.02

ES_P1, ES_P2, ES_TF, ES_SG, ES_CP = 935.0, 405.0, 87.0, 0.67, 10.2

# Constants, each one written the way the engine DERIVES it rather than the way
# anybody quotes it.
R_UNIVERSAL, STD_T_R, STD_P_PSIA = 10.7316, 519.67, 14.696
LBMOL_SCF = (R_UNIVERSAL * STD_T_R) / STD_P_PSIA
MW_WATER = 18.01528
WATER_LB_PER_GAL = 8.34
MINUTES_PER_DAY, HOURS_PER_DAY = 1440.0, 24.0
DAYS_PER_YEAR, LB_PER_SHORT_TON = 365.0, 2000.0
R_OFFSET = 459.67
# 1 Btu in psia.ft3, exact from the international-table Btu and the exact foot.
PSIA_FT3_PER_BTU = 1055.05585262 / (6894.757293168 * 0.3048 ** 3)

# Dranchuk and Abou-Kassem, and Sutton's pseudo-criticals. The coefficients are
# the published ones; nothing about z is taken from the engine.
DAK = dict(a1=0.3265, a2=-1.07, a3=-0.5339, a4=0.01569, a5=-0.05165,
           a6=0.5475, a7=-0.7361, a8=0.1844, a9=0.1056, a10=0.6134, a11=0.721)
TPC_R = 169.2 + 349.5 * ES_SG - 74.0 * ES_SG * ES_SG
PPC_PSIA = 756.8 - 131.0 * ES_SG - 3.6 * ES_SG * ES_SG


def dak_terms(tpr):
    t1 = (DAK['a1'] + DAK['a2'] / tpr + DAK['a3'] / tpr ** 3
          + DAK['a4'] / tpr ** 4 + DAK['a5'] / tpr ** 5)
    t2 = DAK['a6'] + DAK['a7'] / tpr + DAK['a8'] / tpr ** 2
    t3 = DAK['a9'] * (DAK['a7'] / tpr + DAK['a8'] / tpr ** 2)
    return t1, t2, t3


def dak_z_of(r, tpr):
    t1, t2, t3 = dak_terms(tpr)
    return (1 + t1 * r + t2 * r * r - t3 * r ** 5
            + DAK['a10'] * (1 + DAK['a11'] * r * r) * (r * r / tpr ** 3)
            * math.exp(-DAK['a11'] * r * r))


def dak_solve(ppr, tpr, tol=1e-10, maxiter=60):
    """Newton on f(rhoR) = z(rhoR) * rhoR - 0.27 ppr / tpr, SOLVED HERE.

    This is an independent solve of the same equation the engine solves, the
    way FC3's generator recomputed its pump fit rather than trusting it. What
    the SQL then carries is the ROOT and the equation, not a z.
    """
    c = 0.27 * ppr / tpr
    r = c
    for _ in range(maxiter):
        fr = dak_z_of(r, tpr) * r - c
        h = max(1e-8, abs(r) * 1e-7)
        d = ((dak_z_of(r + h, tpr) * (r + h) - c)
             - (dak_z_of(r - h, tpr) * (r - h) - c)) / (2 * h)
        if d == 0 or not math.isfinite(d):
            break
        nxt = r - fr / d
        if not nxt > 0:
            nxt = r / 2
        if abs(nxt - r) < tol:
            r = nxt
            break
        r = nxt
    return r


ES_TR = ES_TF + R_OFFSET
ES_PPR = ES_P1 / PPC_PSIA
ES_H = ES_TR * 1e-4                     # the engine's own difference step
TPR_PLUS = (ES_TR + ES_H) / TPC_R
TPR_MINUS = (ES_TR - ES_H) / TPC_R
RHO_PLUS = dak_solve(ES_PPR, TPR_PLUS)
RHO_MINUS = dak_solve(ES_PPR, TPR_MINUS)
Z_PLUS = dak_z_of(RHO_PLUS, TPR_PLUS)
Z_MINUS = dak_z_of(RHO_MINUS, TPR_MINUS)
DZDT_SOLVED = (Z_PLUS - Z_MINUS) / (2 * ES_H)


def magnus_psia(t_f):
    """The engine's saturation fit. Used here ONLY to state the fit's own
    band and never as the check: the check is the Antoine route below."""
    t_c = (t_f - 32.0) / 1.8
    return 0.61094 * math.exp((17.625 * t_c) / (t_c + 243.04)) / 6.894757293168


def antoine_psia(t_f):
    """A SECOND published vapour-pressure equation, which is what makes the
    water contents checkable at all. Restating the engine's own Magnus fit in
    SQL would be a transcription pretending to be a check."""
    t_c = (t_f - 32.0) / 1.8
    return (10.0 ** (8.07131 - 1730.63 / (233.426 + t_c))) * 0.0193367747


def content_from_psat(psat, p_psia):
    return (psat / p_psia) * (1e6 / LBMOL_SCF) * MW_WATER


# ------------------------------------------------------ the collision sweeps
course_sql = open(COURSE, encoding='utf-8').read()
PROMPT = re.compile(r"'((?:[^']|'')*)',\n\s*jsonb_build_array", re.S)
prompts = [m.group(1).replace("''", "'") for m in PROMPT.finditer(course_sql)]
assert len(prompts) == 3, f'{len(prompts)} prompts parsed out of {COURSE}'
NUM = re.compile(r'-?\d+(?:\.\d+)?')
handed = sorted({abs(float(t)) for p in prompts for t in NUM.findall(p)})

digest = open(f'{W}/digest.txt', encoding='utf-8').read()
published = sorted({abs(float(t)) for t in NUM.findall(digest)})

# THE HELD-FOR-LITERATURE QUANTITIES. Digest Section 16 names six and then two
# ABSENCES; these are the numbers the six are made of, and no graded field may
# land on one.
HELD = [
    (1000, 'the pressure the McKetta and Wehe correction is warned about above'),
    (1100, 'the water overhead the reboiler pays for, Btu a lb'),
    (9.3, 'the module\'s one glycol density, lb a gallon'),
    (8.34, 'the water density the amine gallons chain divides by'),
    (61.08, 'MEA molecular weight'), (105.14, 'DEA molecular weight'),
    (119.16, 'MDEA molecular weight'),
    (18, 'MEA typical strength'), (28, 'DEA typical strength'),
    (45, 'MDEA typical strength'),
    (0.35, 'MEA rich limit'), (0.4, 'DEA rich limit'), (0.5, 'MDEA rich limit'),
    (1.01, 'MEA solution gravity'), (1.02, 'DEA solution gravity'),
    (1.04, 'MDEA solution gravity'),
    (950, 'DEA customary duty a gallon'), (800, 'MDEA customary duty a gallon'),
    (0.15, 'the default BTEX absorbed fraction'),
    (92, 'the single BTEX molecular weight'),
    (2, 'the customary circulation band, low'),
    (5, 'the customary circulation band, high'),
]

refused = []
for tier, key, val, tol in fields:
    for h in handed:
        if abs(abs(val) - h) <= tol:
            refused.append(f'{tier}.{key} = {val} is within {tol} of {h}, handed in a prompt')
    for p in published:
        if abs(abs(val) - p) <= tol:
            refused.append(f'{tier}.{key} = {val} is within {tol} of {p}, which the digest prints')
    for h, label in HELD:
        if abs(abs(val) - h) <= tol:
            refused.append(f'{tier}.{key} = {val} is within {tol} of {h} ({label}), which is HELD')

# THE ARITHMETIC IS CHECKED HERE BEFORE IT IS EMITTED, so a go-live that cannot
# be satisfied is never written. Every identity below is the one the SQL
# asserts, computed in Python at the same tolerances.
checks = []


def near(a, b, eps, what):
    checks.append((what, abs(a - b), eps))
    if not abs(a - b) <= eps:
        refused.append(f'{what}: {a} against {b}, difference {abs(a - b)} exceeds {eps}')


def g(t, k):
    return F[(t, k)][0]


# ---- the Associate, IKOT ABASI
inlet = g('beginner', 'inletLbMMscf')
water = g('beginner', 'waterLbDay')
near(water, (inlet - IK_OUT) * IK_GAS, 1e-9,
     'the water a day is the content difference applied to the rate')
near(g('beginner', 'circGpd'), water * IK_RATIO, 1e-9,
     'the daily glycol volume is the stated ratio on that water')
near(g('beginner', 'circGpm'), water * IK_RATIO / MINUTES_PER_DAY, 1e-12,
     'the glycol circulation is that volume through the day')
near(g('beginner', 'circGpd'), g('beginner', 'circGpm') * MINUTES_PER_DAY, 1e-9,
     'the two glycol circulations are one quantity in two units')
near(g('beginner', 'sensiblePerGal'), IK_LBGAL * IK_CP * (IK_TREB - IK_TABS), 1e-9,
     'the sensible heat a gallon is the glycol mass, its heat capacity and the lift')
btex_lb_day = (IK_GAS * 1e6 * (IK_BTEX_PPMV / 1e6) / LBMOL_SCF) * IK_BTEX_FRAC * IK_BTEX_MW
near(g('beginner', 'btexTonsYear'), btex_lb_day * DAYS_PER_YEAR / LB_PER_SHORT_TON, 1e-9,
     'the BTEX a year is a mole balance on the stated fraction and weight')
# The independent route on the one Associate field the fit produces.
ANTOINE_BAND = 0.005
ik_antoine = content_from_psat(antoine_psia(IK_T), IK_P)
near(inlet / ik_antoine, 1.0, ANTOINE_BAND,
     'the inlet water content agrees with the Antoine route inside its band')

# ---- the Professional, OTUMARA
near(g('intermediate', 'fractionRemoved'),
     (OT_A ** (OT_STAGES + 1) - OT_A) / (OT_A ** (OT_STAGES + 1) - 1), 1e-15,
     'the removal is Kremser at the stated factor and stage count')
near(g('intermediate', 'stagesNeeded'),
     math.log((OT_A - OT_SPEC) / (1 - OT_SPEC)) / math.log(OT_A) - 1, 1e-12,
     'the stage count is the same relation solved for the stages')
removed_mol_pct = (OT_CO2 - OT_CO2_SPEC) + (OT_H2S - OT_H2S_SPEC)
acid = OT_GAS * 1e6 * (removed_mol_pct / 100.0) / LBMOL_SCF
near(g('intermediate', 'acidMolesDay'), acid, 1e-8,
     'the acid gas a day is a mole balance on the spec difference')


def amine_circ(lean):
    return ((acid / (OT_RICH - lean)) * DEA_MW / (OT_WTPCT / 100.0)
            / (WATER_LB_PER_GAL * DEA_SG) / MINUTES_PER_DAY)


near(g('intermediate', 'circGpm'), amine_circ(OT_LEAN), 1e-8,
     'the amine circulation closes the mole balance on the surveyed swing')
near(g('intermediate', 'reboilerMMBtuHr'),
     g('intermediate', 'circGpm') * 60.0 * OT_DUTY / 1e6, 1e-12,
     'the regenerator duty is that circulation at the stated duty a gallon')
near(g('intermediate', 'circGpmRetuned'), amine_circ(OT_LEAN_RETUNED), 1e-8,
     'the retuned circulation is the same balance on the wider swing')
near(g('intermediate', 'circGpmRetuned') * (OT_RICH - OT_LEAN_RETUNED),
     g('intermediate', 'circGpm') * (OT_RICH - OT_LEAN), 1e-8,
     'the two circulations are ONE mole balance read at two swings')

# ---- the Expert, ESCRAVOS
dzdt = g('advanced', 'dzdT')
mu = g('advanced', 'muFPerPsi')
drop = g('advanced', 'dropF')
near(dzdt, DZDT_SOLVED, 5e-13,
     'the derivative is the difference of two independently solved DAK roots')
near(dak_z_of(RHO_PLUS, TPR_PLUS) * RHO_PLUS, 0.27 * ES_PPR / TPR_PLUS, 1e-12,
     'the warm reduced density is a root of the DAK equation')
near(dak_z_of(RHO_MINUS, TPR_MINUS) * RHO_MINUS, 0.27 * ES_PPR / TPR_MINUS, 1e-12,
     'the cold reduced density is a root of the DAK equation')
near(mu, (R_UNIVERSAL / (ES_CP * PSIA_FT3_PER_BTU)) * ES_TR * ES_TR * dzdt / ES_P1, 1e-15,
     'the coefficient is the derivative through the heat capacity, exactly')
near(g('advanced', 't2F'), ES_TF - drop, 1e-12,
     'the separator temperature is the inlet less the drop')
one_step = mu * (ES_P1 - ES_P2)
march_excess = drop / one_step - 1.0
MARCH_BAND = (0.03, 0.08)
if not MARCH_BAND[0] < march_excess < MARCH_BAND[1]:
    refused.append(f'the marched drop exceeds the one-step answer by {march_excess}, '
                   f'outside the stated band {MARCH_BAND}')
near(content_from_psat(antoine_psia(ES_TF), ES_P1) and
     g('advanced', 'waterInLbMMscf') / content_from_psat(antoine_psia(ES_TF), ES_P1), 1.0,
     ANTOINE_BAND, 'the inlet water agrees with the Antoine route inside its band')
near(g('advanced', 'waterOutLbMMscf')
     / content_from_psat(antoine_psia(g('advanced', 't2F')), ES_P2), 1.0, ANTOINE_BAND,
     'the cold water agrees with the Antoine route inside its band')
if not g('advanced', 'waterOutLbMMscf') < g('advanced', 'waterInLbMMscf'):
    refused.append('the let-down did not dry the gas, which is the whole point of the skid')
# The fit's own band, so the capstone is inside what the engine stands behind.
for label, p, t in [('IKOT ABASI', IK_P, IK_T), ('ESCRAVOS inlet', ES_P1, ES_TF),
                    ('ESCRAVOS cold spot', ES_P2, g('advanced', 't2F'))]:
    if p > 1000:
        refused.append(f'{label} sits at {p} psia, above the 1000 psia the held '
                       'McKetta and Wehe correction is warned about')
    t_c = (t - 32.0) / 1.8
    if not -45 <= t_c <= 60:
        refused.append(f'{label} sits at {t_c} degC, outside the water fit band')

# ------------------------------------------------------------------ the SQL
HEADER = f"""-- ============================================================================
-- FC4 GO-LIVE (HELD): Gas Processing flips to 'available'. The FOURTH
-- Facilities course, above FC3 rotating at path_order 41, FC2 linesizing at 40
-- and FC1 separation at 39.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/gasprocessing. The 78 lessons, the teaching lab
-- (gasprocessingLab.js) and its three explorer panels (the water side, the
-- absorber and the cold end) ship in the ZIP and NOT in this database, so a flip
-- before the upload puts a live catalogue tile in front of a route that does not
-- exist. Every Facilities and Drilling wave on this programme has held its
-- go-live behind one verified upload.
--
-- EVERY DENOMINATOR BELOW IS A FLOAT, ON PURPOSE. Postgres divides integer by
-- integer as an integer. On FC1 `(7350+2480)*4/1440` truncated to 27 and lost a
-- third of a minute of retention; the Python check that proved the same
-- identity to 0.0 difference could not see it, because only SQL does this. The
-- generator that wrote this file refuses to emit a division with a bare integer
-- denominator, and refuses a malformed numeric literal, which is the other
-- thing only SQL would have caught and only on the branch that reached it.
--
-- THIRTEEN OF THE EIGHTEEN GRADED VALUES ARE REPRODUCED BY EXACT CLOSED FORM.
-- A water rate is a content difference applied to a gas rate; a circulation is
-- a stated ratio on that rate; a daily volume and a rate are one quantity in
-- two units; a sensible heat is a mass, a heat capacity and a temperature lift;
-- a BTEX mass is a mole balance on a stated fraction and molecular weight; a
-- Kremser removal and its inverse are one closed form read in two directions; an
-- acid gas load is a mole balance on the spec difference; an amine circulation
-- is that load over the loading swing through the strength and the solution
-- density; a regenerator duty is a circulation at a stated duty a gallon; a
-- Joule-Thomson coefficient is a compressibility derivative through a heat
-- capacity; and a separator temperature is an inlet less a drop. A capstone
-- quietly recut to another stream, spec, ratio, strength, loading, duty or gas
-- fails them outright.
--
-- AND THE TWO CIRCULATIONS PIN EACH OTHER. `circGpm` on the Professional and
-- `circGpmRetuned` are the SAME mole balance read at two loading swings, so
-- their product with their own swings is one number. That is the lesson of the
-- retune asserted as arithmetic rather than described.
--
-- THE FIVE THAT ARE NOT CLOSED FORM ARE ASSERTED THE ONLY HONEST WAY THERE IS.
--
--   * THE COMPRESSIBILITY TEMPERATURE DERIVATIVE is a central difference of an
--     ITERATED correlation, so it is asserted BY THE EQUATION ITS TWO
--     COMPRESSIBILITIES ARE ROOTS OF. The two reduced densities were solved in
--     the generator by Newton on the Dranchuk and Abou-Kassem relation, which
--     is an independent solve of the same equation the engine solves, and what
--     this file carries is those ROOTS. The SQL puts each one back into the
--     equation and requires the residual to vanish, reads the compressibility
--     off the same polynomial, and then requires the graded derivative to be
--     their difference over the engine's own step of the inlet temperature
--     times 1e-4. SQL cannot solve that equation; it can verify a root, which
--     is what a root deserves.
--   * THE JOULE-THOMSON COEFFICIENT is then EXACT on that derivative, so the
--     two graded values pin each other and neither can move alone.
--   * THE COOLING is a twenty-step midpoint march, so no closed form reaches
--     it. It is asserted the way the course teaches it: against the ONE-STEP
--     answer the inlet coefficient would give, which is the error the tier
--     exists to show. The march must EXCEED that answer, and by a fraction
--     inside a stated band of {MARCH_BAND[0]} to {MARCH_BAND[1]}; on this skid it exceeds it by
--     {march_excess:.6f}. THAT IS A BAND AND NOT AN IDENTITY, and saying so is the point:
--     restating the march in SQL would be a transcription pretending to be a
--     check, and a gate that restates a formula validates nothing.
--   * THE THREE WATER CONTENTS come out of a published vapour-pressure fit, so
--     they are checked against A DIFFERENT PUBLISHED EQUATION, Antoine against
--     the engine's Magnus, inside the {ANTOINE_BAND} relative band two such
--     correlations agree to. Restating Magnus here would check nothing. The
--     cold content is additionally chained to the graded separator temperature,
--     so a recut of the let-down moves it.
--
--     THESE TWO ARE BANDS AND NOT IDENTITIES, and the dry run MEASURED what
--     each one catches rather than leaving it to be discovered. Sixteen of the
--     eighteen graded values are refused at ONE PART IN 1e7. These two are not,
--     because a correlation band cannot see a move that small. waterInLbMMscf is
--     refused at 0.38 percent and not at 0.35; waterOutLbMMscf is refused at
--     0.16 percent and not at 0.15, the tighter of the two because the engine's
--     Magnus fit already sits 0.345 percent above Antoine at the cold spot and
--     has less of the band left. Both are therefore pinned to about a third of a
--     percent rather than to a part in ten million, and saying which is the point:
--     a reader is entitled to know which of the eighteen is weakly held. The
--     inlet content is pinned far more tightly than that by SECOND ROUTE, the
--     Associate water-a-day identity that depends on it, which does refuse at one
--     part in 1e7.
--
-- NOTHING GRADED DEPENDS ON A HELD-FOR-LITERATURE QUANTITY, and that is
-- asserted rather than asserted-by-comment. Digest Section 16 holds six things
-- and names two absences: the real-gas departure of the saturated water
-- content, the water overhead the reboiler pays for, the module's one glycol
-- density, the water density the amine gallons chain divides by, the three
-- amines' property set, and the BTEX absorbed fraction with its single
-- molecular weight. The capstone is built so that none of them can reach a
-- graded number: NO graded Associate field reads a reboiler duty, so the water
-- overhead cannot enter and the SENSIBLE half, made entirely of stated inputs,
-- is what is graded; NO graded Professional field reads a contactor diameter,
-- so the contactor liquid density cannot enter; OTUMARA states its own {OT_DUTY:.0f} Btu
-- a gallon rather than taking a table default; the BTEX fraction and weight are
-- stated in the prompt; and both let-downs begin below the {1000:.0f} psia the chart
-- correction is warned about. All of that is asserted below, on the labels and
-- again on the values.
--
-- EVERY REFUSAL THAT READS A GRADED VALUE NAMES THAT VALUE BY KEY, appended by
-- the generator from its own variable map rather than typed, so the dry run's
-- negative control can tell a real refusal from any other.
-- ============================================================================"""

body = []
A = body.append

A('do $$')
A('declare')
A('  v_structures int; v_questions int; v_capstones int; v_lessons int;')
A('  v_modules int; v_graded int; v_available int; v_soon int;')
A('  v_z_plus double precision; v_z_minus double precision;')
A('  v_resid double precision; v_pump double precision;')
A('  v_one_step double precision; v_excess double precision;')
A('  v_antoine double precision; v_psat double precision;')
for (t, k) in V:
    A(f'  {V[(t, k)]} double precision;')
A('begin')

# ---------------------------------------------------------------- the shape
A('''
  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures
   where app_slug = '{SLUG}' and active;
  if v_structures <> 3 then
    raise exception 'FC4 go-live refused: {SLUG} has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions from public.academy_quiz_questions where app_slug = '{SLUG}';
  if v_questions <> 396 then
    raise exception 'FC4 go-live refused: {SLUG} has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_graded from (
    select tier from public.academy_quiz_questions where app_slug = '{SLUG}'
     group by tier having count(*) <> 132) t;
  if v_graded <> 0 then
    raise exception 'FC4 go-live refused: % tier(s) do not carry exactly 132 questions', v_graded;
  end if;

  select count(*) into v_graded from (
    select tier, module_key from public.academy_quiz_questions
     where app_slug = '{SLUG}' and scope = 'module'
     group by tier, module_key having count(*) <> 15) t;
  if v_graded <> 0 then
    raise exception 'FC4 go-live refused: % module bank(s) do not carry exactly 15 questions', v_graded;
  end if;

  select count(*) into v_graded from (
    select tier from public.academy_quiz_questions
     where app_slug = '{SLUG}' and scope = 'final'
     group by tier having count(*) <> 42) t;
  if v_graded <> 0 then
    raise exception 'FC4 go-live refused: % final exam(s) do not carry exactly 42 questions', v_graded;
  end if;

  -- A question with three options, five options, or a key outside its own
  -- options is a question no learner can answer correctly.
  select count(*) into v_graded from public.academy_quiz_questions
   where app_slug = '{SLUG}'
     and (jsonb_array_length(options) <> 4
          or answer_index < 0 or answer_index > 3);
  if v_graded <> 0 then
    raise exception 'FC4 go-live refused: % question(s) do not offer four options with a key inside them', v_graded;
  end if;

  select count(*) into v_capstones from public.academy_capstones where app_slug = '{SLUG}';
  if v_capstones <> 3 then
    raise exception 'FC4 go-live refused: {SLUG} has % capstones, expected 3', v_capstones;
  end if;

  select count(*) into v_lessons from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m,
         lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = '{SLUG}' and s.active;
  if v_lessons <> 78 then
    raise exception 'FC4 go-live refused: {SLUG} carries % lesson keys, expected 78', v_lessons;
  end if;

  select count(*) into v_modules from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = '{SLUG}' and s.active;
  if v_modules <> 18 then
    raise exception 'FC4 go-live refused: {SLUG} carries % modules, expected 18 (six per tier)', v_modules;
  end if;

  -- A module bank keyed to a module the structure does not declare is a bank
  -- no learner can reach, and it counts towards the 396 either way.
  select count(*) into v_graded from public.academy_quiz_questions q
   where q.app_slug = '{SLUG}' and q.scope = 'module'
     and not exists (
       select 1 from public.academy_course_structures s,
              lateral jsonb_array_elements(s.structure->'modules') m
        where s.app_slug = q.app_slug and s.tier = q.tier and s.active
          and m->>'key' = q.module_key);
  if v_graded <> 0 then
    raise exception 'FC4 go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_graded;
  end if;

  select count(*) into v_graded from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f where c.app_slug = '{SLUG}';
  if v_graded <> 18 then
    raise exception 'FC4 go-live refused: {SLUG} has % graded capstone fields, expected 18', v_graded;
  end if;

  select count(*) into v_graded from (
    select c.tier from public.academy_capstones c,
           lateral jsonb_array_elements(c.fields) f
     where c.app_slug = '{SLUG}' group by c.tier having count(*) <> 6) t;
  if v_graded <> 0 then
    raise exception 'FC4 go-live refused: % tier(s) do not grade exactly six fields', v_graded;
  end if;

  -- ------------------------------------------------------- the catalogue row
  if not exists (select 1 from public.academy_apps
                  where slug = '{SLUG}' and module = 'facilities'
                    and path_order = 42 and prereq_slug is null) then
    raise exception 'FC4 go-live refused: the {SLUG} catalogue row is not facilities at path_order 42 with no prerequisite';
  end if;
  if exists (select 1 from public.academy_apps
              where path_order = 42 and slug <> '{SLUG}') then
    raise exception 'FC4 go-live refused: another course already holds path_order 42';
  end if;
'''.replace('{SLUG}', SLUG))

# ------------------------------------------------- the held-for-literature half
A(f'''
  -- ------------------------------------------------- held for the literature
  -- BOTH HALVES. A label that names a held quantity, and a value that lands on
  -- one. The first is what a recut of the capstone prompt would break; the
  -- second is what a recut of the ANSWER would break, and neither implies the
  -- other.
  select count(*) into v_graded from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f
   where c.app_slug = '{SLUG}'
     and (lower(f->>'label') like '%reboiler dut%'
          or lower(f->>'label') like '%contactor diameter%'
          or lower(f->>'label') like '%vessel diameter%'
          or lower(f->>'label') like '%rich glycol%'
          or lower(f->>'label') like '%real-gas%'
          or lower(f->>'label') like '%mcketta%');
  if v_graded <> 0 then
    raise exception 'FC4 go-live refused: % graded field(s) name a quantity held for the literature', v_graded;
  end if;

  -- A graded field may not be a quantity these engines cannot produce at all.
  select count(*) into v_graded from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f
   where c.app_slug = '{SLUG}'
     and (lower(f->>'label') like '%hydrate%'
          or lower(f->>'label') like '%stage efficienc%'
          or lower(f->>'label') like '%tray%'
          or lower(f->>'label') like '%phase envelope%');
  if v_graded <> 0 then
    raise exception 'FC4 go-live refused: % capstone field(s) grade a quantity this gas processing engine cannot produce', v_graded;
  end if;
''')

HELD_ROWS = ',\n'.join('                 ' + ', '.join(f'({f17(v)})' for v, _l in HELD[i:i + 5])
                       for i in range(0, len(HELD), 5))
A(f'''
  select count(*) into v_graded from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f,
         (values
{HELD_ROWS}
         ) as h(v)
   where c.app_slug = '{SLUG}'
     and abs((f->>'expected')::double precision) - h.v <= (f->>'tol')::double precision
     and h.v - abs((f->>'expected')::double precision) <= (f->>'tol')::double precision;
  if v_graded <> 0 then
    raise exception 'FC4 go-live refused: % graded field(s) land on a quantity held for the literature', v_graded;
  end if;
''')

PUB_ROWS = ',\n'.join('                 ' + ', '.join(f'({f17(v)})' for v in published[i:i + 6])
                      for i in range(0, len(published), 6))
A(f'''
  -- ------------------------------------- a graded value is not a lookup
  -- EVERY NUMBER THE TEACHING DIGEST PRINTS. A hand-picked list of headline
  -- figures is a list of the collisions somebody thought of, so this is all
  -- {len(published)} of them.
  select count(*) into v_graded from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f,
         (values
{PUB_ROWS}
         ) as d(v)
   where c.app_slug = '{SLUG}'
     and abs((f->>'expected')::double precision) - d.v <= (f->>'tol')::double precision
     and d.v - abs((f->>'expected')::double precision) <= (f->>'tol')::double precision;
  if v_graded <> 0 then
    raise exception 'FC4 go-live refused: % graded field(s) sit within their own tolerance of a value the digest publishes, which makes them a lookup rather than a calculation', v_graded;
  end if;
''')

HANDED_ROWS = ',\n'.join('                 ' + ', '.join(f'({f17(v)})' for v in handed[i:i + 6])
                         for i in range(0, len(handed), 6))
A(f'''
  select count(*) into v_graded from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f,
         (values
{HANDED_ROWS}
         ) as p(v)
   where c.app_slug = '{SLUG}'
     and abs((f->>'expected')::double precision) - p.v <= (f->>'tol')::double precision
     and p.v - abs((f->>'expected')::double precision) <= (f->>'tol')::double precision;
  if v_graded <> 0 then
    raise exception 'FC4 go-live refused: % graded field(s) land on a number the learner is handed in a prompt, which makes the field a transcription rather than a calculation', v_graded;
  end if;

  -- A capstone prompt stating another tier's graded answer hands that tier away.
  select count(*) into v_graded from public.academy_capstones c,
         (select f->>'expected' as e, c2.tier as owner
            from public.academy_capstones c2, lateral jsonb_array_elements(c2.fields) f
           where c2.app_slug = '{SLUG}') g
   where c.app_slug = '{SLUG}' and c.tier <> g.owner and c.prompt like '%' || g.e || '%';
  if v_graded <> 0 then
    raise exception 'FC4 go-live refused: % capstone prompt(s) state a graded value belonging to another tier', v_graded;
  end if;
'''.replace('{SLUG}', SLUG))

# ------------------------------------------------ load the eighteen values
A('\n  -- --------------------------------------- the eighteen graded values')
for (t, k), var in V.items():
    A(f"""  select (f->>'expected')::double precision into {var}
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = '{SLUG}' and c.tier = '{t}' and f->>'key' = '{k}';""")
A('  if ' + '\n     or '.join(f'{v} is null' for v in V.values()) + ' then')
A("    raise exception 'FC4 go-live refused: one or more of the eighteen graded fields is missing';")
A('  end if;')


def VB(k):
    return V[('beginner', k)]


def VI(k):
    return V[('intermediate', k)]


def VE(k):
    return V[('advanced', k)]


A(f'''
  -- ------------------------------------------- the Associate, IKOT ABASI
  -- The water a day is the CONTENT DIFFERENCE applied to the rate, which is the
  -- intensive-against-extensive distinction the whole tier is built on.
  if abs({VB('waterLbDay')} - ({VB('inletLbMMscf')} - {f17(IK_OUT)}) * {f17(IK_GAS)}) > 1e-09 then
    raise exception 'FC4 go-live refused: the water a day of % lb is not the content difference applied to % MMscfd', {VB('waterLbDay')}, {f17(IK_GAS)};
  end if;
  if abs({VB('circGpd')} - {VB('waterLbDay')} * {f17(IK_RATIO)}) > 1e-09 then
    raise exception 'FC4 go-live refused: the daily glycol volume of % gallons is not the stated ratio of % on that water', {VB('circGpd')}, {f17(IK_RATIO)};
  end if;
  if abs({VB('circGpm')} - {VB('circGpd')} / {f17(MINUTES_PER_DAY)}) > 1e-12 then
    raise exception 'FC4 go-live refused: the glycol circulation of % gpm and % gallons a day are not one quantity in two units', {VB('circGpm')}, {VB('circGpd')};
  end if;
  if abs({VB('sensiblePerGal')} - {f17(IK_LBGAL)} * {f17(IK_CP)} * ({f17(IK_TREB)} - {f17(IK_TABS)})) > 1e-09 then
    raise exception 'FC4 go-live refused: the sensible heat of % Btu a gallon is not the glycol mass, its heat capacity and the lift from % to % degF', {VB('sensiblePerGal')}, {f17(IK_TABS)}, {f17(IK_TREB)};
  end if;
  -- The BTEX chain is a mole balance: ppmv to lbmol a day, the stated absorbed
  -- fraction, the stated molecular weight, a year, a short ton.
  if abs({VB('btexTonsYear')} - ({f17(IK_GAS)} * 1e6 * ({f17(IK_BTEX_PPMV)} / 1e6) / {f17(LBMOL_SCF)})
         * {f17(IK_BTEX_FRAC)} * {f17(IK_BTEX_MW)} * {f17(DAYS_PER_YEAR)} / {f17(LB_PER_SHORT_TON)}) > 1e-09 then
    raise exception 'FC4 go-live refused: the BTEX of % short tons a year is not the mole balance on the stated fraction and molecular weight', {VB('btexTonsYear')};
  end if;
''')

A(f'''
  -- The one Associate value the SATURATION FIT produces, checked against a
  -- SECOND published vapour-pressure equation rather than against a restatement
  -- of the engine's own.
  v_antoine := ({f17(antoine_psia(IK_T))} / {f17(IK_P)}) * (1e6 / {f17(LBMOL_SCF)}) * {f17(MW_WATER)};
  if abs({VB('inletLbMMscf')} / v_antoine - 1.0) > {f17(ANTOINE_BAND)} then
    raise exception 'FC4 go-live refused: the inlet water content of % lb a MMscf is % from the independent Antoine route, outside the band two published vapour-pressure fits agree to', {VB('inletLbMMscf')}, {VB('inletLbMMscf')} / v_antoine - 1.0;
  end if;
''')

A(f'''
  -- ---------------------------------------- the Professional, OTUMARA
  -- Kremser, read in both directions off ONE closed form.
  if abs({VI('fractionRemoved')} - ({f17(OT_A)} ^ ({f17(OT_STAGES)} + 1.0) - {f17(OT_A)})
         / ({f17(OT_A)} ^ ({f17(OT_STAGES)} + 1.0) - 1.0)) > 1e-14 then
    raise exception 'FC4 go-live refused: the removal of % is not Kremser at an absorption factor of % over % stages', {VI('fractionRemoved')}, {f17(OT_A)}, {f17(OT_STAGES)};
  end if;
  if abs({VI('stagesNeeded')} - (ln(({f17(OT_A)} - {f17(OT_SPEC)}) / (1.0 - {f17(OT_SPEC)})) / ln({f17(OT_A)}) - 1.0)) > 1e-12 then
    raise exception 'FC4 go-live refused: the stage count of % is not the same Kremser relation solved for the stages at a removal of %', {VI('stagesNeeded')}, {f17(OT_SPEC)};
  end if;
  -- THE CEILING THE TIER EXISTS TO TEACH. Below an absorption factor of one the
  -- removal cannot exceed the factor itself, so a spec above the factor has no
  -- stage count at all. The stated factor is above the stated spec, and this
  -- asserts that rather than assuming it.
  if not ({f17(OT_A)} > {f17(OT_SPEC)}) then
    raise exception 'FC4 go-live refused: an absorption factor of % caps the removal at itself and the spec asks for %, so the graded stage count does not exist', {f17(OT_A)}, {f17(OT_SPEC)};
  end if;
  if abs({VI('acidMolesDay')} - {f17(OT_GAS)} * 1e6
         * ((({f17(OT_CO2)} - {f17(OT_CO2_SPEC)}) + ({f17(OT_H2S)} - {f17(OT_H2S_SPEC)})) / 100.0)
         / {f17(LBMOL_SCF)}) > 1e-08 then
    raise exception 'FC4 go-live refused: the acid gas of % lbmol a day is not the mole balance on the spec difference at % MMscfd', {VI('acidMolesDay')}, {f17(OT_GAS)};
  end if;
  if abs({VI('circGpm')} - ({VI('acidMolesDay')} / ({f17(OT_RICH)} - {f17(OT_LEAN)}))
         * {f17(DEA_MW)} / ({f17(OT_WTPCT)} / 100.0)
         / ({f17(WATER_LB_PER_GAL)} * {f17(DEA_SG)}) / {f17(MINUTES_PER_DAY)}) > 1e-08 then
    raise exception 'FC4 go-live refused: the amine circulation of % gpm does not close the mole balance on a swing of %', {VI('circGpm')}, {f17(OT_RICH - OT_LEAN)};
  end if;
  if abs({VI('reboilerMMBtuHr')} - {VI('circGpm')} * 60.0 * {f17(OT_DUTY)} / 1e6) > 1e-12 then
    raise exception 'FC4 go-live refused: the regenerator duty of % MMBtu an hour is not that circulation at the stated % Btu a gallon', {VI('reboilerMMBtuHr')}, {f17(OT_DUTY)};
  end if;
  if abs({VI('circGpmRetuned')} - ({VI('acidMolesDay')} / ({f17(OT_RICH)} - {f17(OT_LEAN_RETUNED)}))
         * {f17(DEA_MW)} / ({f17(OT_WTPCT)} / 100.0)
         / ({f17(WATER_LB_PER_GAL)} * {f17(DEA_SG)}) / {f17(MINUTES_PER_DAY)}) > 1e-08 then
    raise exception 'FC4 go-live refused: the retuned circulation of % gpm is not the same balance on the wider swing of %', {VI('circGpmRetuned')}, {f17(OT_RICH - OT_LEAN_RETUNED)};
  end if;
  -- ONE MOLE BALANCE, TWO SWINGS. This is the retune's whole lesson as
  -- arithmetic: neither circulation can move without the other.
  if abs({VI('circGpmRetuned')} * ({f17(OT_RICH)} - {f17(OT_LEAN_RETUNED)})
         - {VI('circGpm')} * ({f17(OT_RICH)} - {f17(OT_LEAN)})) > 1e-08 then
    raise exception 'FC4 go-live refused: the surveyed circulation of % gpm and the retuned % gpm are not one mole balance read at two swings', {VI('circGpm')}, {VI('circGpmRetuned')};
  end if;
  if not ({VI('circGpmRetuned')} < {VI('circGpm')}) then
    raise exception 'FC4 go-live refused: the retune to a leaner lean did not reduce the circulation, which is what widening the swing buys: % against %', {VI('circGpmRetuned')}, {VI('circGpm')};
  end if;
''')

# ----------------------------------------------- the Expert, by the equation
T1P, T2P, T3P = dak_terms(TPR_PLUS)
T1M, T2M, T3M = dak_terms(TPR_MINUS)


def dak_sql(rho, tpr, t1, t2, t3):
    """The DAK compressibility polynomial, as the equation the root satisfies."""
    return (f'(1.0 + {f17(t1)} * {f17(rho)} + {f17(t2)} * {f17(rho)} * {f17(rho)}'
            f' - {f17(t3)} * {f17(rho)} ^ 5.0'
            f' + {f17(DAK["a10"])} * (1.0 + {f17(DAK["a11"])} * {f17(rho)} * {f17(rho)})'
            f' * ({f17(rho)} * {f17(rho)} / {f17(tpr)} ^ 3.0)'
            f' * exp(- {f17(DAK["a11"])} * {f17(rho)} * {f17(rho)}))')


A(f'''
  -- --------------------------------------------- the Expert, ESCRAVOS
  -- THE DERIVATIVE IS ASSERTED BY THE EQUATION ITS TWO COMPRESSIBILITIES ARE
  -- ROOTS OF. The two reduced densities below were solved in the generator by
  -- Newton on the Dranchuk and Abou-Kassem relation, independently of the
  -- engine. SQL cannot solve that equation. It can put a candidate back into it
  -- and require the residual to vanish, which is what a root deserves, and it
  -- can then read the compressibility off the same polynomial and require the
  -- graded derivative to be their difference.
  v_z_plus := {dak_sql(RHO_PLUS, TPR_PLUS, T1P, T2P, T3P)};
  v_resid := v_z_plus * {f17(RHO_PLUS)} - 0.27 * {f17(ES_PPR)} / {f17(TPR_PLUS)};
  if abs(v_resid) > 1e-11 then
    raise exception 'FC4 go-live refused: the warm reduced density leaves a DAK residual of %, so it is not a root of the equation the compressibility solves', v_resid;
  end if;
  v_z_minus := {dak_sql(RHO_MINUS, TPR_MINUS, T1M, T2M, T3M)};
  v_resid := v_z_minus * {f17(RHO_MINUS)} - 0.27 * {f17(ES_PPR)} / {f17(TPR_MINUS)};
  if abs(v_resid) > 1e-11 then
    raise exception 'FC4 go-live refused: the cold reduced density leaves a DAK residual of %, so it is not a root of the equation the compressibility solves', v_resid;
  end if;
  -- Both roots must be a COMPRESSED REAL GAS rather than a number.
  if not (v_z_plus > 0.5 and v_z_plus < 1.0 and v_z_minus > 0.5 and v_z_minus < 1.0) then
    raise exception 'FC4 go-live refused: the two compressibilities are % and %, which is not a compressed real gas', v_z_plus, v_z_minus;
  end if;
  if abs({VE('dzdT')} - (v_z_plus - v_z_minus) / (2.0 * {f17(ES_H)})) > 5e-13 then
    raise exception 'FC4 go-live refused: the derivative % per degR is not the difference of those two roots over the engine''s own step of % degR', {VE('dzdT')}, {f17(ES_H)};
  end if;
  -- AND THE COEFFICIENT IS EXACT ON IT, so the two graded values pin each other
  -- and neither can move alone.
  if abs({VE('muFPerPsi')} - ({f17(R_UNIVERSAL)} / ({f17(ES_CP)} * {f17(PSIA_FT3_PER_BTU)}))
         * {f17(ES_TR)} * {f17(ES_TR)} * {VE('dzdT')} / {f17(ES_P1)}) > 1e-15 then
    raise exception 'FC4 go-live refused: the coefficient of % degF a psi is not the graded derivative through a heat capacity of % Btu a lbmol degF', {VE('muFPerPsi')}, {f17(ES_CP)};
  end if;
  if abs({VE('t2F')} - ({f17(ES_TF)} - {VE('dropF')})) > 1e-12 then
    raise exception 'FC4 go-live refused: the separator temperature of % degF is not the inlet of % less the drop', {VE('t2F')}, {f17(ES_TF)};
  end if;
  -- THE COOLING IS A MARCH, so what is asserted is the error the tier exists to
  -- show: the one-step answer the INLET coefficient would give, and the band the
  -- march stands above it by. A band and not an identity, which is said here
  -- rather than left to be discovered.
  v_one_step := {VE('muFPerPsi')} * ({f17(ES_P1)} - {f17(ES_P2)});
  v_excess := {VE('dropF')} / v_one_step - 1.0;
  if not ({VE('dropF')} > v_one_step) then
    raise exception 'FC4 go-live refused: the marched cooling of % degF does not exceed the one-step answer of % degF, so the march is not doing what the tier teaches', {VE('dropF')}, v_one_step;
  end if;
  if v_excess <= {f17(MARCH_BAND[0])} or v_excess >= {f17(MARCH_BAND[1])} then
    raise exception 'FC4 go-live refused: the marched cooling of % degF stands % above the one-step answer, outside the stated band of % to %', {VE('dropF')}, v_excess, {f17(MARCH_BAND[0])}, {f17(MARCH_BAND[1])};
  end if;
''')

A(f'''
  -- The two water contents, against the INDEPENDENT Antoine route. The cold one
  -- is taken at the GRADED separator temperature, so a recut of the let-down
  -- moves it and cannot move it quietly.
  v_antoine := ({f17(antoine_psia(ES_TF))} / {f17(ES_P1)}) * (1e6 / {f17(LBMOL_SCF)}) * {f17(MW_WATER)};
  if abs({VE('waterInLbMMscf')} / v_antoine - 1.0) > {f17(ANTOINE_BAND)} then
    raise exception 'FC4 go-live refused: the inlet water of % lb a MMscf is % from the independent Antoine route, outside the band two published vapour-pressure fits agree to', {VE('waterInLbMMscf')}, {VE('waterInLbMMscf')} / v_antoine - 1.0;
  end if;
  -- Antoine in SQL at the graded cold temperature: log10(P mmHg) = A - B/(C + T_C).
  v_psat := power(10.0, 8.07131 - 1730.63 / (233.426 + ({VE('t2F')} - 32.0) / 1.8)) * 0.0193367747;
  v_antoine := (v_psat / {f17(ES_P2)}) * (1e6 / {f17(LBMOL_SCF)}) * {f17(MW_WATER)};
  if abs({VE('waterOutLbMMscf')} / v_antoine - 1.0) > {f17(ANTOINE_BAND)} then
    raise exception 'FC4 go-live refused: the cold water of % lb a MMscf is % from the independent Antoine route taken at the graded separator temperature of % degF, outside the band two published vapour-pressure fits agree to', {VE('waterOutLbMMscf')}, {VE('waterOutLbMMscf')} / v_antoine - 1.0, {VE('t2F')};
  end if;
  if not ({VE('waterOutLbMMscf')} < {VE('waterInLbMMscf')}) then
    raise exception 'FC4 go-live refused: the gas leaves the cold separator holding % lb a MMscf against % at the inlet, so the let-down did not dry it', {VE('waterOutLbMMscf')}, {VE('waterInLbMMscf')};
  end if;
  -- BOTH LET-DOWN PRESSURES SIT BELOW the pressure the held chart correction is
  -- warned about, which is how a graded water content avoids leaning on it.
  if {f17(ES_P1)} > 1000.0 or {f17(IK_P)} > 1000.0 then
    raise exception 'FC4 go-live refused: a graded water content is taken above the 1000 psia at which the held McKetta and Wehe correction is warned about';
  end if;
''')

A(f'''
  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = '{SLUG}';
  if not exists (select 1 from public.academy_apps
                  where slug = '{SLUG}' and status = 'available') then
    raise exception 'FC4 go-live refused: {SLUG} did not reach status available';
  end if;

  select count(*) filter (where status = 'available'),
         count(*) filter (where status = 'coming_soon')
    into v_available, v_soon
    from public.academy_apps;

  raise notice 'FC4 go-live: {SLUG} available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
    v_lessons, v_questions, v_capstones, 18, v_available, v_soon;
end $$;''')

sql = HEADER + '\n\n' + '\n'.join(body) + '\n'

# ------------------------------- EVERY REFUSAL NAMES THE FIELD IT IS ABOUT
# THE VARIABLE PATTERN IS CASE-INSENSITIVE ON PURPOSE. FC3's keys were
# snake_case and its pattern was `v_[a-z0-9_]+`; FC4's field keys are
# camelCase, so that pattern matched NOTHING and the guard below reported all
# eighteen fields unnamed on the first run. A guard that fires on everything is
# as useless as one that fires on nothing, and this one was loud enough to be
# read rather than quietly green, which is the only reason it was caught.
BY_VAR = {v: f'{t}.{k}' for (t, k), v in V.items()}
RAISE = re.compile(r"raise exception '((?:[^']|'')*)'((?:[^;']|'(?:[^']|'')*')*);", re.S)


def name_the_field(m):
    """Append every graded field THE WHOLE GUARD READS, condition included.

    THE CONDITION AND NOT ONLY THE MESSAGE, and the dry run is what taught this.
    An identity between two graded values reads both, and the first version of
    this appender scanned only the `raise` statement: so moving
    `beginner/inletLbMMscf` by one part in 1e7 was CAUGHT, correctly, by the
    water-a-day identity that depends on it, and the refusal named
    `beginner.waterLbDay` and not the field that had actually moved. A reader of
    that message cannot tell which of the two is wrong, which is the same defect
    as a gate that names nothing: the trusting half of a disagreeing pair is
    exactly where a reader will not look. Every assertion now names EVERY graded
    field it reads, so a control on any one of the eighteen is refused by name.
    """
    start = m.start()
    # Back up to the `if` this raise belongs to, so the condition is scanned too.
    head = sql_draft.rfind('\n  if ', 0, start)
    alt = sql_draft.rfind('\n  elsif ', 0, start)
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
    head = max(sql.rfind('\n  if ', 0, m.start()), sql.rfind('\n  elsif ', 0, m.start()))
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
print(f'malformed-literal guard: 0 in {len(sql.splitlines())} lines')
print(f'digest literals swept: {len(published)} | handed-in-prompt values: {len(handed)} '
      f'| held quantities: {len(HELD)}')
print('graded fields colliding with any of those three lists, at their own tolerance: 0')
print(f'refusals that read a graded value: '
      f'{sum(1 for m in RAISE.finditer(sql) if "[graded field:" in m.group(1))}, '
      'every one of them naming the field by key')
print(f'DAK solved here: rhoR warm {RHO_PLUS!r} -> z {Z_PLUS!r}')
print(f'                 rhoR cold {RHO_MINUS!r} -> z {Z_MINUS!r}')
print(f'                 dzdT {DZDT_SOLVED!r} against the graded {g("advanced", "dzdT")!r}')
print(f'march against the one-step answer: {drop:.9f} degF against {one_step:.9f}, '
      f'{march_excess:.6f} above it, band {MARCH_BAND}')
print('every identity this file asserts, checked here first:')
for what, diff, eps in checks:
    print(f'  {diff:.3e} <= {eps:.0e}  {what}')
