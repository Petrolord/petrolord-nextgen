#!/usr/bin/env python3
"""Generate the FC3 course + capstone migration from fields.json and the
capstone constants, so no expected value or condition is retyped.

Modelled on /root/fc-wip-separation/gen_course.py (FC1), with the differences
FC3 forces:

1. FC3's three tiers do NOT chain. The Associate solves the ESCRAVOS transfer
   pump against its own station, the Professional works the BONGA suction
   side, a speed change and a second machine, and the Expert takes the BONNY
   gas booster train. No prompt restates another tier's conditions, so the
   cross-tier leak surface is zero by construction.

2. THE PRECISION SENTENCE IN EACH PROMPT IS THE ONE THE COURSE PRINTS, and it
   is checked against precision.json rather than written by hand. FC1 said
   "to four decimals" for everything. FC3 prints pump work to six, gas work to
   four, and exponents, ratios and MMscfd to nine, and a prompt that asked for
   fewer digits than a field is graded at would fail a learner who did exactly
   as told. Every prompt is asserted to ask for at least the digits the
   tightest field in its tier needs.

3. Every held-for-literature item is neutralised by CONSTRUCTION in
   fc3_fields_capstone.mjs (no viscosity correction, no trim, no operating
   region, no NPSH margin rule, no machine screening), so the labels below
   never name one and the go-live asserts that they do not.

Usage: python3 /root/fc-wip-rotating/gen_course.py
"""
import json, os, re, sys

# THE WAVE AND THE OUTPUT ARE BOTH OVERRIDABLE, so gen_seeds.sh can point this
# at a STAGED COPY OF THE COMMITTED TREE rather than at a working tree. A
# generator that can only read a working tree cannot be re-run to prove that
# what was committed is what the committed inputs produce.
W = os.environ.get('FC3_WAVE', '/root/fc-wip-rotating')
REPO = os.environ.get('FC3_REPO', '/root/wt-fc3-nextgen')
OUT = os.environ.get('FC3_COURSE_OUT', f'{REPO}/migrations/20260923_fc3_rotating_course.sql')

fields = json.load(open(f'{W}/fields.json'))
precision = json.load(open(f'{W}/precision.json'))


def q(s):
    return "'" + s.replace("'", "''") + "'"


# ---------------------------------------------------------------------------
# The eighteen graded fields. Each label names WHERE the answer came from,
# because that is the discipline the course teaches: a rotating machine has no
# operating point until it is connected to something, and every number after
# it is a consequence of where that point landed.
# ---------------------------------------------------------------------------
LABELS = {
    # Associate: one pump against one station, end to end.
    'escravos_duty_flow_gpm':    ('Duty flow, where the pump curve and the station curve cross', 'gpm'),
    'escravos_duty_head_ft':     ('Duty head at that flow, which both curves agree on', 'ft'),
    'escravos_hydraulic_hp':     ('Hydraulic horsepower delivered to the liquid at duty', 'hp'),
    'escravos_brake_hp':         ('Brake horsepower at the shaft, the hydraulic power through the pump efficiency', 'hp'),
    'escravos_motor_input_kw':   ('Motor input power at duty', 'kW'),
    'escravos_discharge_psi':    ('The duty head expressed as a pressure on this crude', 'psi'),
    # Professional: the suction side, an exact affinity law, and a second machine.
    'bonga_pressure_head_ft':    ('Pressure head, the suction pressure over vapour pressure as a head of this liquid', 'ft'),
    'bonga_npsha_ft':            ('NPSH available on the suction side as surveyed', 'ft'),
    'bonga_npsha_raised_ft':     ('NPSH available with the suction drum padded to the proposed pressure', 'ft'),
    'bonga_speed_flow_gpm':      ('Flow of the solved duty carried to the proposed speed by the affinity laws', 'gpm'),
    'bonga_speed_head_ft':       ('Head of the solved duty carried to the proposed speed by the affinity laws', 'ft'),
    'bonga_parallel_flow_gpm':   ('Duty flow with both machines in parallel against the same station', 'gpm'),
    # Expert: the thermodynamic path and what the driver burns for it.
    'bonny_exponent_ratio':      ('The polytropic exponent ratio, from k and the polytropic efficiency', 'dimensionless'),
    'bonny_ratio_per_stage':     ('Pressure ratio per stage at the stage count the duty demands', 'dimensionless'),
    'bonny_stage1_discharge_f':  ('First stage discharge temperature, from its own inlet at that ratio', 'degF'),
    'bonny_stage1_poly_head':    ('First stage polytropic head', 'ft lbf per lbm'),
    'bonny_stage1_gas_hp':       ('First stage gas horsepower', 'hp'),
    'bonny_fuel_mmscfd':         ('Driver fuel gas for the whole train', 'MMscfd'),
}
assert set(LABELS) == {f[1] for f in fields}, 'labels and fields.json disagree'

# ---------------------------------------------------------------------------
# The conditions, written out of fc3_fields_capstone.mjs. Every quantity that
# changes an answer is stated, including the three that discriminate a stage
# count and both duty search ceilings, so no graded value rides on a default.
# Nothing that IS an answer is stated.
# ---------------------------------------------------------------------------
ESCRAVOS = (
    "ESCRAVOS P-1401, the crude transfer pump lifting to the tank farm. The vendor curve is "
    "published at 0 gpm and 486 ft, 700 gpm and 452 ft, 1400 gpm and 358 ft, and 2000 gpm and "
    "214 ft. The station stands 168 ft static and takes 214 ft of friction at 1250 gpm. The "
    "crude has a specific gravity of 0.823. The pump efficiency agreed with the vendor for this "
    "selection is 0.761 and the motor nameplate efficiency is 0.938. The duty is searched to "
    "8000 gpm.")

BONGA = (
    "BONGA P-2203, the booster station. The vendor curve is published at 0 gpm and 212 ft, "
    "450 gpm and 198 ft, 900 gpm and 160 ft, and 1300 gpm and 96 ft. The station stands 44 ft "
    "static and takes 88 ft of friction at 800 gpm. The liquid has a specific gravity of 0.79. "
    "The suction side was surveyed at 19.4 psia against a vapour pressure of 3.7 psia, with the "
    "source vessel standing 11.5 ft above the pump and 4.3 ft of friction between them. Two "
    "changes are on the table: padding the suction drum to 46.0 psia, and running the machine at "
    "0.87 of rated speed. A debottleneck would put 2 identical machines in parallel against that "
    "same station. Every duty is searched to 6000 gpm.")

BONNY = (
    "BONNY K-3101, the gas booster train. It takes 34.0 MMscfd from 138.0 psia and 96.0 degF up "
    "to 1240.0 psia. The gas gravity is 0.673 and k is 1.272. The polytropic efficiency is 0.767 "
    "and the mechanical efficiency is 0.972. The maximum ratio per stage is 3.8 and the maximum "
    "discharge temperature is 285.0 degF. The intercoolers return the gas to 96.0 degF between "
    "stages. The driver has a heat rate of 7650 Btu per hp hr and burns a fuel of 968 Btu per "
    "scf.")

TIER = {
    'beginner': (
        'associate',
        'ESCRAVOS P-1401, a crude transfer pump solved against the station it lifts into',
        'One pump, one station, one duty',
        ESCRAVOS + " Report six values from the duty the two curves reach together, the power that "
                   "duty costs and the pressure that head represents. Flows in gpm, heads in ft, "
                   "power in hp and kW, and pressure in psi, to six decimals."),
    'intermediate': (
        'professional',
        'BONGA P-2203, its surveyed suction side, a proposed speed change and a second machine',
        'The suction side, the change and the second machine',
        BONGA + " Report six values from the suction side as surveyed, the suction side as it would "
                "be with the drum padded, the solved duty carried to the proposed speed, and the two "
                "machines in parallel. Heads in ft and flows in gpm, to six decimals."),
    'advanced': (
        'expert',
        'BONNY K-3101, a gas booster train from its exponent through to what the driver burns',
        'The exponent, the staging, the first stage and the driver',
        BONNY + " Report six values from the exponent, the staging, the first stage and the driver. "
                "Temperatures in degF, heads in ft lbf per lbm and power in hp to four decimals. The "
                "exponent ratio, the ratio per stage and the fuel rate in MMscfd to nine decimals."),
}

HEADER = """-- ============================================================================
-- FC3: Rotating Equipment joins the catalog, the THIRD Facilities course.
--
-- Catalog row (module 'facilities'; path_order 41, directly above FC2
-- linesizing at 40 and below FC4 gasprocessing at 42; prereq_slug NULL, the
-- carried-over answer "no hard prerequisite inside a module") plus the three
-- capstones and their eighteen graded fields, generated by
-- /root/fc-wip-rotating/gen_course.py from fields.json and the capstone
-- constants in fc3_fields_capstone.mjs. Deep seeds are three separate
-- migrations; the go-live is a fifth and is HELD until a NextGen production
-- upload carries the route /dashboard/apps/rotating, because the 78 lessons,
-- the teaching lab (rotatingLab.js) and its three explorer panels ship in the
-- zip and not in this database.
--
-- THE PATH ORDER WAS CORRECTED BEFORE THIS WAS CUT. The wave recorded 42 on a
-- reading that nothing held 40. migrations/20260922_fc2_linesizing_course.sql
-- seeds linesizing at 40, and the gasprocessing wave directory claims 42, so
-- 42 would have collided with FC4. The Facilities ladder is 39 separation,
-- 40 linesizing, 41 rotating, 42 gasprocessing.
--
-- THE ONE SENTENCE THE COURSE IS. A rotating machine has no operating point
-- until it is connected to something, and every number that follows from it,
-- the power, the suction margin, the stage count, the discharge temperature,
-- is a consequence of where that point landed and of which limit was allowed
-- to put it there.
--
-- THE ENGINES. engines/facilities/pumps.js (the Pump Station Designer: the
-- fitted curve and its conditioning, the system curve, the duty solved as
-- their intersection, the power packagings, NPSH available, the affinity
-- laws, parallel and series machines) and engines/facilities/compression.js
-- (the Compressor Station Designer: the polytropic exponent, the stage count
-- taken as the larger of a ratio limit and a temperature limit, the stage,
-- the train and the driver's fuel), over engines/production/gasProperties.js
-- and lib/units/fieldUnits.js, as vendored at engines main 4fa37e6, the FC3-0
-- repair wave.
--
-- NOTHING GRADED DEPENDS ON A HELD-FOR-LITERATURE QUANTITY, and each one is
-- neutralised by construction rather than by hope. The Hydraulic Institute
-- viscosity correction is never called and no capstone fluid states a
-- kinematic viscosity. The trim shortfall model is never called, so the
-- Professional grades a SPEED change, where the affinity laws are exact. The
-- operating region bands are never graded and no best efficiency flow is even
-- stated. The NPSH margin rule is never graded, so the Professional grades
-- NPSH available and no required NPSH appears in any prompt. Machine
-- screening is never called. The go-live asserts all five.
--
-- THE CAPSTONE GRADES WHAT THE COURSE TEACHES A READER TO GET RIGHT: that a
-- duty is solved rather than read, that the power follows the duty, that an
-- affinity law moves a machine and leaves the station where it was, that two
-- pumps in parallel deliver far less than twice one pump, that a stage count
-- is the larger of two limits and the engine names which, and that the first
-- stage runs from the suction while every stage after it runs from the
-- intercooler. All eighteen graded values were swept against every number the
-- digest and the goldens publish and against every number handed to a learner
-- in a prompt, at each field's own tolerance: 0 collisions, and 0 pairwise.
-- ============================================================================"""

lines = [HEADER, '',
         "insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)",
         "values ('rotating', 'Rotating Equipment', 'facilities', 41, 'coming_soon', null)",
         'on conflict (slug) do nothing;',
         '',
         'insert into public.academy_capstones',
         '    (app_slug, tier, cert_tier, dataset, title, prompt, fields)',
         'values']
blocks = []
for tier in ('beginner', 'intermediate', 'advanced'):
    cert, dataset, title, prompt = TIER[tier]
    fl = [f for f in fields if f[0] == tier]
    assert len(fl) == 6, f'{tier} has {len(fl)} fields'
    objs = ',\n'.join(
        f"    jsonb_build_object('key',{q(k)}, 'label',{q(LABELS[k][0])}, 'unit',{q(LABELS[k][1])}, 'expected',{repr(v)}, 'tol',{repr(t)})"
        for _, k, v, t in fl)
    blocks.append(f"(\n  'rotating', {q(tier)}, {q(cert)},\n  {q(dataset)},\n  {q(title)},\n  {q(prompt)},\n  jsonb_build_array(\n{objs}\n  )\n)")
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
for tier in ('beginner', 'intermediate', 'advanced'):
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
            bad.append(f'pairwise: {fields[i][1]} and {fields[j][1]}')

# EVERY NUMBER THE DIGEST PRINTS. A graded field within its own tolerance of
# one of them is a lookup rather than a calculation.
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

# THE PROMPT MUST NOT ASK FOR FEWER DIGITS THAN A FIELD IS GRADED AT, which
# is the defect that started this: a learner told to quote six decimals and
# graded at 1e-9 fails by three hundred tolerances while doing exactly as told.
# The rule is per CLASS and not per prompt, because a tier may legitimately
# state two precisions: the Expert prints gas work to four and its exponent,
# its ratio per stage and its MMscfd to nine, and says both. So every distinct
# class precision a tier grades must be asked for somewhere in that tier's
# prompt, and no class may be graded finer than the request that covers it.
WORD_N = {'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9}
for tier in ('beginner', 'intermediate', 'advanced'):
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
            bad.append(f'{key} is graded at {tol}, below the half-unit of the {dp} decimals '
                       f'its class {cls[0]} prints')
    for dp, keys in sorted(needed.items()):
        if dp not in asked:
            bad.append(f'{tier} prompt asks for {asked} decimals and never for {dp}, which is '
                       f'what {", ".join(keys)} are graded to')
    for a in asked:
        if a not in needed:
            bad.append(f'{tier} prompt asks for {a} decimals, which no field it grades uses')

for tier in ('beginner', 'intermediate', 'advanced'):
    if len(TIER[tier][3]) < 400 or 'Report' not in TIER[tier][3]:
        bad.append(f'{tier} prompt is {len(TIER[tier][3])} chars and promptleak would not sweep it')

print(f'wrote {OUT}: {len(sql.splitlines())} lines, 3 capstones, {len(fields)} fields')
print('odd-quote lines:', odd, '| en/em dashes:', dashes)
print('prompt lengths:', {t: len(TIER[t][3]) for t in TIER})
print(f'digest numbers swept: {len(digest_nums)}')
for b in bad:
    print('  REFUSED:', b)
print('handed-in-prompt + pairwise + digest collisions + precision:', len(bad))
sys.exit(1 if (bad or odd or dashes) else 0)
