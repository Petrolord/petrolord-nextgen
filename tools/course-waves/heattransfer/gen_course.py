#!/usr/bin/env python3
"""Generate the FC6 course + capstone migration from fields.json and the
capstone constants, so no expected value or condition is retyped.

Modelled on tools/course-waves/gasprocessing/gen_course.py (FC4), with the two
differences FC6 forces:

1. FC6'S FIELD KEYS ARE GLOBALLY UNIQUE, because every one of them carries the
   name of the case it belongs to: amenam_, ubit_, okwori_. FC4's were not, and
   its maps had to be keyed by (TIER, KEY) to stop one tier being graded against
   another's answer. The keying is kept here anyway and ASSERTED unique, so the
   shape does not quietly weaken on the wave where it happens not to be needed.

2. THE PRECISION SENTENCE IN EACH PROMPT IS THE ONE THE COURSE PRINTS, and it is
   checked against precision.json rather than written by hand. The Associate and
   the Expert each grade two classes and so ask for both. The Professional
   grades six decimals throughout and asks for six only.

THE TOLERANCES ARE READ, NEVER DECLARED. fields.json carries the tolerances the
lab ships, which for six of the eighteen fields are WIDENED from a stated 1e-9
to 5e-7 because their class prints to six decimals and a tighter grade would be
unanswerable. Both collision sweeps below run at the tolerance in fields.json,
which is the widened one, because a sweep at the stated tolerance would pass a
collision the shipped grade would hit.

Usage: python3 gen_course.py
   FC6_WAVE       the wave directory (default /root/fc-wip-heattransfer)
   FC6_REPO       the nextgen clone   (default /root/wt-fc6-nextgen)
   FC6_COURSE_OUT where to write      (default $FC6_REPO/migrations/...)
"""
import json
import os
import re
import sys

# THE WAVE AND THE OUTPUT ARE BOTH OVERRIDABLE, so gen_seeds.sh can point this
# at a STAGED COPY OF THE COMMITTED TREE rather than at a working tree. A
# generator that can only read a working tree cannot be re-run to prove that
# what was committed is what the committed inputs produce.
W = os.environ.get('FC6_WAVE', '/root/fc-wip-heattransfer')
REPO = os.environ.get('FC6_REPO', '/root/wt-fc6-nextgen')
OUT = os.environ.get('FC6_COURSE_OUT', f'{REPO}/migrations/20260925_fc6_heattransfer_course.sql')

fields = json.load(open(f'{W}/fields.json'))
precision = json.load(open(f'{W}/precision.json'))
TIERS = ('beginner', 'intermediate', 'advanced')


def q(s):
    return "'" + s.replace("'", "''") + "'"


# ---------------------------------------------------------------------------
# The eighteen graded fields. Each label names the quantity and, where the
# course's whole discipline turns on it, WHICH of two same-unit quantities it
# is: a clean coefficient and a dirty one are both Btu/hr.ft2.F and answer
# different questions, and a design log mean and a hot-day log mean are both
# degF.
# ---------------------------------------------------------------------------
LABELS = {
    # Associate: the duty, the driving force and the surface.
    ('beginner', 'amenam_duty_btu_hr'):
        ('The duty the specified hot outlet sets', 'Btu/hr'),
    ('beginner', 'amenam_cold_outlet_f'):
        ('The cold outlet that duty implies', 'degF'),
    ('beginner', 'amenam_lmtd_f'):
        ('The counter-current log mean driving force', 'degF'),
    ('beginner', 'amenam_area_ft2'):
        ('The outside surface the duty needs', 'ft2'),
    ('beginner', 'amenam_area_per_tube_ft2'):
        ('The outside surface one tube carries', 'ft2'),
    ('beginner', 'amenam_area_margin_pct'):
        ('The surface the pass-count rounding overshoots by', 'percent'),
    # Professional: what decides the driving force and what decides the U.
    ('intermediate', 'ubit_f_correction'):
        ('The correction factor at one shell pass', 'fraction'),
    ('intermediate', 'ubit_p1_two_shells'):
        ('The equivalent single-shell P at two shells in series', 'fraction'),
    ('intermediate', 'ubit_u_clean'):
        ('The clean overall coefficient, referred to the outside tube surface', 'Btu/hr.ft2.F'),
    ('intermediate', 'ubit_u_dirty'):
        ('The dirty overall coefficient, referred to the same outside surface', 'Btu/hr.ft2.F'),
    ('intermediate', 'ubit_fouling_penalty_pct'):
        ('What the two fouling allowances cost that coefficient', 'percent'),
    ('intermediate', 'ubit_controlling_margin_pct'):
        ('How far the controlling resistance leads the next one', 'percent'),
    # Expert: rating, the hot day and the second method.
    ('advanced', 'okwori_design_lmtd_f'):
        ('The design log mean of the bay', 'degF'),
    ('advanced', 'okwori_design_effectiveness'):
        ('Effectiveness at the design point, taken from its definition', 'fraction'),
    ('advanced', 'okwori_capacity_ratio'):
        ('The capacity ratio of the bay', 'fraction'),
    ('advanced', 'okwori_ua_btu_hr_f'):
        ('The surface the bay holds on the hot day, as UA', 'Btu/hr.F'),
    ('advanced', 'okwori_hotday_ntu'):
        ('NTU at that fixed UA', 'fraction'),
    ('advanced', 'okwori_hotday_process_out_f'):
        ('Where the process actually leaves on the hot afternoon', 'degF'),
}
assert set(LABELS) == {(f[0], f[1]) for f in fields}, 'labels and fields.json disagree'
assert len({k for _t, k in LABELS}) == 18, 'FC6 field keys are meant to be globally unique'

# ---------------------------------------------------------------------------
# The conditions, written out of fc6_fields_capstone.mjs. Every quantity that
# changes an answer is stated, so no graded value rides on a table default.
# Nothing that IS an answer is stated.
# ---------------------------------------------------------------------------
AMENAM = (
    "AMENAM, the crude cooler on a flow station. The hot crude runs at 62000 lb an hour with a "
    "heat capacity of 0.58 Btu per lb degF, entering at 328 degF and specified to leave at 214 "
    "degF. The cooling water runs at 91000 lb an hour with a heat capacity of 0.97 Btu per lb "
    "degF and enters at 119 degF, and its outlet is not specified. The unit is counter-current. "
    "The study was given an overall coefficient of 126 Btu per hr ft2 degF, so no film is "
    "computed and the correction factor is 1. The bundle the fabricator quoted is 0.875 inch "
    "outside diameter tubes, 18 ft long, on a 30 degree layout in 2 tube passes, with a "
    "bundle-to-shell clearance of 2.75 inches.")

UBIT = (
    "UBIT, the shell-and-tube train. The four terminals are a hot stream entering at 405 degF and "
    "leaving at 265 degF against a cold stream entering at 135 degF and leaving at 233 degF. Read "
    "the correction factor first at ONE shell pass, then take the same duty into TWO shells in "
    "series. The coefficient is assembled from five named resistances on a tube of 0.875 inch "
    "outside diameter and 0.729 inch inside diameter. Both film coefficients are STATED as "
    "conditions of this study, 265 Btu per hr ft2 degF outside and 1120 inside, and so is the "
    "wall conductivity of 29 Btu per hr ft degF, so nothing here is looked up. The fouling "
    "allowances are 0.0015 hr ft2 degF per Btu outside and 0.0025 inside.")

OKWORI = (
    "OKWORI, the air cooler bay. It was bought on a duty of 26400000 Btu an hour, taking the "
    "process from 268 degF to 172 degF against 93 degF design ambient air that rises 27 degF, at "
    "an overall coefficient of 4.85 Btu per hr ft2 degF. It is a forced-draft bay at a barometric "
    "pressure of 13.9 psia, and it states its own machine numbers rather than taking any default: "
    "a fan static pressure of 0.78 inches of water, a fan efficiency of 0.68 and a motor "
    "efficiency of 0.94. The afternoon it is judged on is 113 degF ambient, and it is rated there "
    "at the SAME UA and the SAME air mass, with the effectiveness taken from its definition so "
    "that no arrangement and no correction factor is assumed anywhere.")

TIER = {
    'beginner': (
        'associate',
        'AMENAM, a crude cooler on a flow station read from its energy balance to its tube count',
        'One exchanger, end to end, in closed form',
        AMENAM + " Report six values: the duty the specified hot outlet sets, the cold outlet that "
                 "duty implies, the counter-current log mean, the outside surface the duty needs, "
                 "the outside surface one tube carries, and the percentage by which the whole "
                 "bundle overshoots the required surface once the count is rounded up to a whole "
                 "multiple of the passes. The duty in Btu an hour, to four decimals. Temperatures "
                 "in degF, surfaces in ft2 and the margin in percent, to six decimals."),
    'intermediate': (
        'professional',
        'UBIT, a shell-and-tube train read as a correction factor and then as five resistances',
        'What a shell buys, and which resistance is in charge',
        UBIT + " Report six values: the correction factor at one shell pass, the equivalent "
               "single-shell P at two shells in series, the clean overall coefficient, the dirty "
               "one, what the two fouling allowances cost as a percentage of the clean "
               "coefficient, and how far the controlling resistance leads the runner up as a "
               "percentage of itself. Correction factors and equivalent P as a fraction, "
               "coefficients in Btu per hr ft2 degF and both percentages in percent, all to six "
               "decimals."),
    'advanced': (
        'expert',
        'OKWORI, an air cooler bay read at its design point and again on the afternoon it is judged on',
        'The hot day, rated at fixed UA and assuming no arrangement',
        OKWORI + " Report six values: the design log mean of the bay, the effectiveness at the "
                 "design point taken from its definition, the capacity ratio, the UA the bay "
                 "holds, the NTU at that fixed UA, and where the process actually leaves on the "
                 "hot afternoon. The UA in Btu per hr degF, to four decimals. The log mean and "
                 "the process outlet in degF, and the effectiveness, the capacity ratio and the "
                 "NTU as fractions, to six decimals."),
}

HEADER = """-- ============================================================================
-- FC6: Heat Exchange & Cooling joins the catalog, the SIXTH Facilities course.
--
-- Catalog row (module 'facilities'; path_order 44, directly above FC5 at 43,
-- FC4 gasprocessing at 42, FC3 rotating at 41, FC2 linesizing at 40 and FC1
-- separation at 39; prereq_slug NULL, the carried-over answer "no hard
-- prerequisite inside a module") plus the three capstones and their eighteen
-- graded fields, generated by tools/course-waves/heattransfer/gen_course.py
-- from fields.json, precision.json and the capstone constants in
-- fc6_fields_capstone.mjs. Deep seeds are three separate migrations; the
-- go-live is a fifth and is HELD until a NextGen production upload carries the
-- route /dashboard/apps/heattransfer, because the 78 lessons, the teaching lab
-- (heattransferLab.js) and its three explorer panels ship in the zip and not in
-- this database.
--
-- THE ONE SENTENCE THE COURSE IS. An exchanger is four questions in a chain and
-- the chain is a LOOP, and the discipline is knowing which of the numbers in
-- front of you the engine COMPUTED, which one you CHOSE, and which one it
-- declined to invent.
--
-- THE ENGINE. engines/facilities/heatTransfer.js (the capacity rate, the energy
-- balance and the refusals that protect it, the log mean and its two pairings,
-- the P and R groups, Bowman's correction factor and the equivalent
-- single-shell P for shells in series, the overall coefficient assembled from
-- five named resistances with the controlling one and its margin, the area, the
-- tube count with its two roundings, effectiveness and NTU in both directions,
-- the air cooler and its hot-day rating at fixed UA). This module IMPORTS
-- NOTHING AT ALL, so its family is the engine, its golden, its jest suite, its
-- oracle and its findings record. Vendored at engines e4377b3, the FC6-0 repair
-- wave, sha-identical and proved three independent ways.
--
-- NOTHING GRADED DEPENDS ON A HELD OR FITTED QUANTITY, and each one is
-- neutralised by CONSTRUCTION rather than by hope. The five fitted constants
-- (Dittus-Boelter's 0.023, 0.8 and 0.4, the Sieder-Tate 0.14 and the laminar
-- Nusselt 3.66) live in tubeSideFilm and nowhere else, and no capstone calls
-- it: AMENAM is handed its overall coefficient and UBIT STATES both film
-- coefficients. The held bundle table sets only a bundle diameter and a shell
-- diameter, and no graded field reads either. The held cross-flow correction
-- sets only the design AREA of an air cooler, and no graded field reads it; the
-- hot day is rated from the DEFINITION of effectiveness at fixed UA and fixed
-- air mass, so it assumes no arrangement and needs no F. The held fan constant
-- sets only a fan and motor horsepower, and OKWORI states its own static
-- pressure, fan efficiency and motor efficiency so none of the three defaults
-- is even read. The held wall conductivity default names no material, and UBIT
-- states its own. The go-live asserts all of it, on the labels and again on the
-- values.
--
-- THE CAPSTONE GRADES WHAT THE COURSE TEACHES A READER TO GET RIGHT: that a
-- specified outlet makes the duty and the other outlet an ANSWER rather than a
-- condition, that a tube count rounds TWICE and the second rounding moves the
-- surface margin, that a shell pass is bought through an equivalent
-- single-shell P and not through F directly, that a controlling resistance is a
-- verdict with a MARGIN, and that a hot day is rated at fixed UA with an
-- effectiveness taken from its definition rather than from an arrangement.
-- All eighteen graded values were swept against every number the digest prints
-- and against every number handed to a learner in a prompt, at each field's own
-- shipped tolerance: 0 collisions, and 0 pairwise.
-- ============================================================================"""

lines = [HEADER, '',
         "insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)",
         "values ('heattransfer', 'Heat Exchange & Cooling', 'facilities', 44, 'coming_soon', null)",
         'on conflict (slug) do nothing;',
         '',
         'insert into public.academy_capstones',
         '    (app_slug, tier, cert_tier, dataset, title, prompt, fields)',
         'values']
blocks = []
for tier in TIERS:
    cert, dataset, title, prompt = TIER[tier]
    fl = [f for f in fields if f[0] == tier]
    assert len(fl) == 6, f'{tier} has {len(fl)} fields'
    objs = ',\n'.join(
        f"    jsonb_build_object('key',{q(k)}, 'label',{q(LABELS[(t, k)][0])},"
        f" 'unit',{q(LABELS[(t, k)][1])}, 'expected',{repr(v)}, 'tol',{repr(tol)})"
        for t, k, v, tol in fl)
    blocks.append(f"(\n  'heattransfer', {q(tier)}, {q(cert)},\n  {q(dataset)},\n"
                  f"  {q(title)},\n  {q(prompt)},\n  jsonb_build_array(\n{objs}\n  )\n)")
lines.append(',\n'.join(blocks))
lines.append('on conflict (app_slug, tier) do nothing;')
sql = '\n'.join(lines) + '\n'
open(OUT, 'w').write(sql)

# --------------------------------------------------------------- self checks
odd = [n for n, l in enumerate(sql.splitlines(), 1)
       if not l.lstrip().startswith('--') and l.split('--', 1)[0].count("'") % 2]
dashes = len(re.findall('[–—]', sql))

NUM = re.compile(r'-?\d+\.?\d*')
handed = []
for tier in TIERS:
    for tok in NUM.findall(TIER[tier][3]):
        try:
            handed.append((tier, abs(float(tok))))
        except ValueError:
            pass
bad = []
for ftier, key, val, tol in fields:
    for htier, h in handed:
        if abs(abs(val) - h) <= tol:
            bad.append(f'{ftier}.{key} = {val} is within {tol} of {h}, handed in the {htier} prompt')
for i in range(len(fields)):
    for j in range(i + 1, len(fields)):
        if abs(abs(fields[i][2]) - abs(fields[j][2])) <= max(fields[i][3], fields[j][3]):
            bad.append(f'pairwise: {fields[i][0]}.{fields[i][1]} and {fields[j][0]}.{fields[j][1]}')

# EVERY NUMBER THE DIGEST PRINTS. A graded field within its own tolerance of one
# of them is a lookup rather than a calculation.
digest_nums = set()
for tok in NUM.findall(open(f'{W}/digest.txt', encoding='utf-8').read()):
    try:
        digest_nums.add(abs(float(tok)))
    except ValueError:
        pass
for ftier, key, val, tol in fields:
    for d in digest_nums:
        if abs(abs(val) - d) <= tol:
            bad.append(f'{ftier}.{key} = {val} is within {tol} of {d}, which the digest prints')

# THE PROMPT MUST NOT ASK FOR FEWER DIGITS THAN A FIELD IS GRADED AT, which is
# the defect that started this on a sibling wave: a learner told to quote six
# decimals and graded at 1e-9 fails by three hundred tolerances while doing
# exactly as told. The rule is per CLASS and not per prompt, because a tier may
# legitimately state two precisions.
WORD_N = {'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9}
for tier in TIERS:
    asked = sorted({WORD_N[w] for w in re.findall(r'to (\w+) decimals', TIER[tier][3])
                    if w in WORD_N})
    if not asked:
        bad.append(f'{tier} prompt asks for no precision at all')
        continue
    needed = {}
    for ftier, key, val, tol in fields:
        if ftier != tier:
            continue
        cls = [c for c, sp in precision.items() if re.search(sp['match'], key)]
        if len(cls) != 1:
            bad.append(f'{key} matches {len(cls)} precision classes, not exactly one')
            continue
        dp = precision[cls[0]]['decimals']
        needed.setdefault(dp, []).append(key)
        if tol < 0.5 * 10 ** -dp:
            bad.append(f'{tier}.{key} is graded at {tol}, below the half-unit of the {dp} '
                       f'decimals its class {cls[0]} prints')
    for dp, keys in sorted(needed.items()):
        if dp not in asked:
            bad.append(f'{tier} prompt asks for {asked} decimals and never for {dp}, which is '
                       f'what {", ".join(keys)} are graded to')
    for a in asked:
        if a not in needed:
            bad.append(f'{tier} prompt asks for {a} decimals, which no field it grades uses')

for tier in TIERS:
    if len(TIER[tier][3]) < 400 or 'Report' not in TIER[tier][3]:
        bad.append(f'{tier} prompt is {len(TIER[tier][3])} chars and promptleak would not sweep it')

print(f'wrote {OUT}: {len(sql.splitlines())} lines, 3 capstones, {len(fields)} fields')
print('odd-quote lines:', odd, '| en/em dashes:', dashes)
print('prompt lengths:', {t: len(TIER[t][3]) for t in TIERS})
print(f'digest numbers swept: {len(digest_nums)} | handed-in-prompt values: {len(handed)}')
for b in bad:
    print('  REFUSED:', b)
print('handed-in-prompt + pairwise + digest collisions + precision:', len(bad))
sys.exit(1 if (bad or odd or dashes) else 0)
