#!/usr/bin/env python3
"""Generate the FC5 course + capstone migration from fields.json and the
capstone constants, so no expected value or condition is retyped.

Modelled on the FC6 generator (tools/course-waves/heattransfer/gen_course.py),
itself modelled on FC4's, with what FC5 forces:

1. FC5'S FIELD KEYS ARE GLOBALLY UNIQUE, each carrying its plant: kolocreek_,
   ogbainbiri_, gbaran_. The keying stays (TIER, KEY) and uniqueness is
   ASSERTED, so the shape does not quietly weaken on a wave that does not need
   it.

2. EVERY CONDITION THAT MOVES AN ANSWER IS STATED IN THE PROMPT, including the
   ones an engine default would otherwise supply: the 14.7 psia atmosphere the
   gas and steam routes add to a gauge set pressure, the universal gas constant
   1545.349 the blowdown inventory stands on, and the time step of the march.
   A learner who used 1545.35 would miss the graded inventory by forty
   tolerances, so the constant is handed rather than assumed.

3. THE PRECISION SENTENCE IN EACH PROMPT IS CHECKED against precision.json. The
   Associate grades six decimals throughout; the Professional and the Expert
   each grade two classes and so ask for both.

THE TOLERANCES ARE READ, NEVER DECLARED. fields.json carries what the lab
ships, derived in gradedTolerance.js. Five fields are raised to half a unit of
their printed class, and the blowdown time is STATED at 1e-4 because the exact
integral the course teaches sits 3.98e-5 s from the march; both collision
sweeps below run at the shipped tolerance.

Usage: python3 gen_course.py
   FC5_WAVE       the wave directory (default /root/fc-wip-relief)
   FC5_REPO       the nextgen clone   (default /root/wt-fc5-nextgen)
   FC5_COURSE_OUT where to write      (default $FC5_REPO/migrations/...)
"""
import json
import os
import re
import sys

# THE WAVE AND THE OUTPUT ARE BOTH OVERRIDABLE, so gen_seeds.sh can point this
# at a STAGED COPY OF THE COMMITTED TREE rather than at a working tree. A
# generator that can only read a working tree cannot be re-run to prove that
# what was committed is what the committed inputs produce.
W = os.environ.get('FC5_WAVE', '/root/fc-wip-relief')
REPO = os.environ.get('FC5_REPO', '/root/wt-fc5-nextgen')
OUT = os.environ.get('FC5_COURSE_OUT', f'{REPO}/migrations/20260925_fc5_relief_course.sql')

fields = json.load(open(f'{W}/fields.json'))
precision = json.load(open(f'{W}/precision.json'))
TIERS = ('beginner', 'intermediate', 'advanced')


def q(s):
    return "'" + s.replace("'", "''") + "'"


# ---------------------------------------------------------------------------
# The eighteen graded fields. Each label names the quantity and, where two of
# them share a unit, WHICH one it is.
# ---------------------------------------------------------------------------
LABELS = {
    # Associate: one gas plant, three fluids, and the branch the back pressure decides.
    ('beginner', 'kolocreek_critical_pressure_ratio'):
        ('The critical flow pressure ratio at the stated k', 'fraction'),
    ('beginner', 'kolocreek_gas_coefficient_c'):
        ('The gas coefficient C at the stated k', 'USC coefficient'),
    ('beginner', 'kolocreek_gas_critical_area_in2'):
        ('The required gas area against the flare header back pressure', 'in2'),
    ('beginner', 'kolocreek_gas_subcritical_area_in2'):
        ('The required gas area against the pressured header', 'in2'),
    ('beginner', 'kolocreek_liquid_area_in2'):
        ('The required liquid area', 'in2'),
    ('beginner', 'kolocreek_steam_area_in2'):
        ('The required steam area', 'in2'),
    # Professional: the geometry a fire case stands on, and the drum.
    ('intermediate', 'ogbainbiri_wetted_area_ft2'):
        ('The wetted shell area of the horizontal vessel', 'ft2'),
    ('intermediate', 'ogbainbiri_tower_wetted_area_ft2'):
        ('The wetted shell area of the vertical tower', 'ft2'),
    ('intermediate', 'ogbainbiri_liquid_area_fraction'):
        ('The fraction of the drum cross-section below the liquid level', 'fraction'),
    ('intermediate', 'ogbainbiri_vapor_velocity_fts'):
        ('The vapour velocity through the space above the level', 'ft/s'),
    ('intermediate', 'ogbainbiri_drum_length_ft'):
        ('The required drum length at the first diameter', 'ft'),
    ('intermediate', 'ogbainbiri_drum_length_wider_ft'):
        ('The required drum length at the wider diameter', 'ft'),
    # Expert: a vessel emptying itself, and the point source asked both ways.
    ('advanced', 'gbaran_initial_mass_lb'):
        ('The gas inventory at the start of the blowdown', 'lb'),
    ('advanced', 'gbaran_blowdown_time_s'):
        ('The time to reach the end pressure', 's'),
    ('advanced', 'gbaran_final_temperature_degr'):
        ('The gas temperature at the end pressure', 'degR'),
    ('advanced', 'gbaran_choked_floor_psia'):
        ('The vessel pressure below which the flow stops being choked', 'psia'),
    ('advanced', 'gbaran_radiant_intensity_kwm2'):
        ('The radiant intensity at the stated distance', 'kW/m2'),
    ('advanced', 'gbaran_setback_distance_m'):
        ('The distance at which the intensity falls to the project allowable', 'm'),
}
assert set(LABELS) == {(f[0], f[1]) for f in fields}, 'labels and fields.json disagree'
assert len({k for _t, k in LABELS}) == 18, 'FC5 field keys are meant to be globally unique'

# ---------------------------------------------------------------------------
# The conditions, written out of fc5_fields_capstone.mjs. Every quantity that
# changes an answer is stated, so no graded value rides on an engine default.
# Nothing that IS an answer is stated.
# ---------------------------------------------------------------------------
KOLO = (
    "KOLO CREEK, a gas plant with three relief cases on one train. Relieving pressures carry a 10 "
    "percent overpressure on the set pressure, and a gauge pressure becomes absolute by adding an "
    "atmosphere of 14.7 psia. THE GAS CASE: 37500 lb an hour through a conventional valve set at "
    "385 psig, relieving at 165 degF, with a molecular weight of 23.5, a compressibility of 0.89 "
    "and a k of 1.31. The vendor states Kd 0.975, and Kb and Kc are both 1. It discharges first to "
    "a flare header at 55 psia, and then the SAME load and the SAME valve are read against a "
    "header already pressured to 330 psia. THE LIQUID CASE: 640 gpm through a valve set at 295 "
    "psig against a back pressure of 65 psig, with a specific gravity of 0.79 and no viscosity "
    "correction, because the service is taken as inviscid. The vendor states Kd 0.65, and Kw and "
    "Kc are both 1. THE STEAM CASE: 78000 lb an hour of saturated steam through a valve set at 585 "
    "psig. The vendor states Kd 0.975, and Kb, Kc and KSH are all 1.")

OGBA = (
    "OGBAINBIRI, a flow station. A horizontal vessel 9.5 ft in diameter and 37 ft long holds "
    "liquid to a level of 3.4 ft, and a vertical tower 7.2 ft in diameter and 32 ft tall stands "
    "beside it with liquid to 14.5 ft. The wetted area is the SHELL only, heads ignored, and "
    "neither wetted height reaches the 25 ft limit. The flare knockout drum at the end of the "
    "header is horizontal, 8.5 ft in diameter, with its liquid level at 0.35 of the diameter. It "
    "takes 168.0 actual cubic feet of vapour a second, and its design dropout velocity is stated "
    "as 2.05 ft a second, so no droplet is sized. The drum must hold the vapour for as long as a "
    "droplet takes to fall through the vapour space above the level. Then the diameter is taken "
    "to 10.5 ft at the same vapour rate, the same dropout velocity and the same level fraction.")

GBARAN = (
    "GBARAN, a compression station. A vessel of 640 cubic feet holds gas at 1185 psia and 555 "
    "degR, with a molecular weight of 21.5, a k of 1.26 and a compressibility of 0.87 held "
    "constant throughout. The universal gas constant is 1545.349 ft lbf per lbmol degR. It "
    "depressures to 165 psia through an orifice of 1.375 inch diameter with a discharge "
    "coefficient of 0.84, against a flare back pressure of 16.5 psia. The gas in the vessel "
    "expands isentropically and the flow is taken as choked throughout, on the gas coefficient C "
    "at the stated k. The studio marches this at a time step of 0.1 s. The flare it discharges to "
    "releases 742000 kW, with a radiated fraction of 0.27 and a transmissivity of 0.91, read as a "
    "point source 118 m away. The project allowable is 5.25 kW per m2.")

TIER = {
    'beginner': (
        'associate',
        'KOLO CREEK, a gas plant sized by API 520 for gas, liquid and steam relief',
        'Three fluids, one valve train, and the branch the back pressure decides',
        KOLO + " Report six values: the critical flow pressure ratio at the stated k, the gas "
               "coefficient C, the required gas area against the 55 psia header, the required gas "
               "area against the 330 psia header, the required liquid area and the required steam "
               "area. The ratio as a fraction, C as a number and every area in square inches, all "
               "to six decimals."),
    'intermediate': (
        'professional',
        'OGBAINBIRI, a flow station read as a fire case and a flare knockout drum',
        'The geometry a fire stands on, and the drum that keeps liquid out of the header',
        OGBA + " Report six values: the wetted shell area of the horizontal vessel, the wetted "
               "shell area of the tower, the fraction of the drum cross-section that lies below "
               "the liquid level, the vapour velocity through the space above it, the required "
               "drum length at 8.5 ft and the required drum length at 10.5 ft. The two wetted areas "
               "in ft2 to four decimals. The fraction, the velocity in ft a second and both lengths "
               "in ft to six decimals."),
    'advanced': (
        'expert',
        'GBARAN, a compression station read as a blowdown and the flare it discharges to',
        'A vessel emptying itself, and the point source asked both ways',
        GBARAN + " Report six values: the gas inventory at the start in lb, the time to reach 165 "
                 "psia in seconds, the gas temperature at 165 psia in degR, the vessel pressure "
                 "below which the flow stops being choked in psia, the radiant intensity at 118 m in "
                 "kW per m2, and the distance at which the intensity falls to the project allowable "
                 "in m. The inventory to four decimals. Everything else to six decimals."),
}

HEADER = """-- ============================================================================
-- FC5: Relief & Flare Systems joins the catalog, the FIFTH Facilities course.
--
-- Catalog row (module 'facilities'; path_order 43, directly above FC4
-- gasprocessing at 42, FC3 rotating at 41, FC2 linesizing at 40 and FC1
-- separation at 39, and directly below FC6 heattransfer at 44; prereq_slug
-- NULL, the carried-over answer "no hard prerequisite inside a module") plus
-- the three capstones and their eighteen graded fields, generated by
-- tools/course-waves/relief/gen_course.py from fields.json, precision.json and
-- the capstone constants in fc5_fields_capstone.mjs. Deep seeds are three
-- separate migrations; the go-live is a fifth and is HELD until a NextGen
-- production upload carries the route /dashboard/apps/relief, because the 78
-- lessons, the teaching lab (reliefLab.js) and its three explorer panels ship
-- in the zip and not in this database.
--
-- THE ONE SENTENCE THE COURSE IS. A relief valve is sized for a stated load
-- through a stated route, and the discipline is knowing which figure the engine
-- COMPUTED, which one somebody TYPED from a published chart or table, and which
-- one nothing in this package checks at all.
--
-- THE ENGINE. engines/facilities/relief.js (the four API 520 routes for gas,
-- subcritical gas, liquid and steam with the critical ratio, C, F2, Kv and KN;
-- the API 526 orifice ladder; the API 521 fire case from the exact wetted
-- segment to the relief load; the droplet dropout velocity and the horizontal
-- knockout drum; the point-source flare radiation asked as an intensity and as
-- a distance; and the adiabatic blowdown march). Vendored at engines 3bac13cd,
-- the FC5-0 repair, sha-identical over a closure of seven paths.
--
-- NOTHING GRADED DEPENDS ON A HELD, TYPED OR LIMIT ITEM, and each one is
-- neutralised by CONSTRUCTION. The liquid case is inviscid, so Kv is exactly 1
-- and no Kv fit constant enters. The valves are conventional, so Kb is 1 by the
-- standard, and the subcritical case uses F2 and ignores Kb. The steam case
-- relieves far below the Napier threshold, so KN is exactly 1. No orifice
-- letter and no fire duty is graded. The drum states its own dropout velocity,
-- so the sphere-drag correlation never runs. Both wetted heights are under
-- 25 ft. The flare states its own project allowable, which is none of the four
-- customary values. The go-live asserts all of it, on the keys and on the
-- values.
--
-- THE CAPSTONE GRADES WHAT THE COURSE TEACHES A READER TO GET RIGHT: that the
-- back pressure chooses the gas branch, that a gauge set pressure is not an
-- absolute relieving pressure, that a liquid level sets both the vapour area
-- and the fall distance of a drum, that a blowdown's end temperature is fixed
-- by the pressure ratio alone, and that a point source asked as a distance is
-- the same model asked backwards. All eighteen graded values were swept
-- against every number the digest prints and every number handed to a learner
-- in a prompt, at each field's own shipped tolerance.
-- ============================================================================"""

lines = [HEADER, '',
         "insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)",
         "values ('relief', 'Relief & Flare Systems', 'facilities', 43, 'coming_soon', null)",
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
    blocks.append(f"(\n  'relief', {q(tier)}, {q(cert)},\n  {q(dataset)},\n"
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
