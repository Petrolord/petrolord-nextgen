#!/usr/bin/env python3
"""Generate the FC8 course + capstone migration from fields.json and the
capstone constants in fc8_capstone.mjs, so no expected value is retyped.

Modelled on tools/course-waves/heattransfer/gen_course.py (FC6). The eighteen
expected values and tolerances are READ from fields.json, which make_fields.mjs
writes from fc8_capstone.mjs; nothing here types a graded number.

THE CONDITIONS ARE THE CAPSTONE'S OWN. Every quantity fc8_capstone.mjs passes
to the engine for a graded field is stated in the prompt, and the check at the
bottom of this file REFUSES a prompt that omits one: it reads the constants
straight out of fc8_capstone.mjs (KRAKAMA, UTONANA, SAGHARA) and requires each
to appear in its tier's prompt. A prompt that leaned on an engine default would
grade a learner on a number nobody stated, which is exactly the class the
capstone's clearance report exists to rule out.

THE PRECISION SENTENCE IN EACH PROMPT IS CHECKED AGAINST precision.json per
class, so a learner told to quote six decimals is never graded to nine.

Usage: python3 gen_course.py
   FC8_WAVE       the wave directory (default /root/fc-wip-metering)
   FC8_REPO       the nextgen clone   (default /root/wt-fc8-nextgen)
   FC8_COURSE_OUT where to write      (default $FC8_REPO/migrations/...)
"""
import json
import os
import re
import sys

W = os.environ.get('FC8_WAVE', '/root/fc-wip-metering')
REPO = os.environ.get('FC8_REPO', '/root/wt-fc8-nextgen')
OUT = os.environ.get('FC8_COURSE_OUT', f'{REPO}/migrations/20260925_fc8_metering_course.sql')

fields = json.load(open(f'{W}/fields.json'))
precision = json.load(open(f'{W}/precision.json'))
TIERS = ('beginner', 'intermediate', 'advanced')


def q(s):
    return "'" + s.replace("'", "''") + "'"


LABELS = {
    # Associate: what the meter run measures, and how well.
    ('beginner', 'krakama_beta_ratio'):
        ('The beta ratio of the orifice run', 'ratio'),
    ('beginner', 'krakama_differential_psi'):
        ('The design differential, in psi', 'psi'),
    ('beginner', 'krakama_transmitter_uncertainty_pct'):
        ('The transmitter uncertainty as a percent of the design reading', 'percent of reading'),
    ('beginner', 'krakama_flow_turndown_ratio'):
        ('The flow turndown at the design reading', 'ratio'),
    ('beginner', 'krakama_total_uncertainty_pct'):
        ('The total uncertainty of the mass flow', 'percent of flow'),
    ('beginner', 'krakama_turbine_gross_bbl'):
        ('The gross volume the turbine meter recorded', 'bbl'),
    # Professional: the choking boundary and what sits either side of it.
    ('intermediate', 'utonana_ff_critical_ratio'):
        ('The liquid critical pressure ratio factor FF', 'ratio'),
    ('intermediate', 'utonana_allowable_drop_psi'):
        ('The allowable pressure drop the valve can use', 'psi'),
    ('intermediate', 'utonana_liquid_cv'):
        ('The liquid valve coefficient the service needs', 'Cv'),
    ('intermediate', 'utonana_cavitation_sigma'):
        ('The cavitation index on the drop the valve uses', 'ratio'),
    ('intermediate', 'utonana_valve_authority'):
        ('The valve authority at design flow', 'ratio'),
    ('intermediate', 'utonana_normal_travel_pct'):
        ('The travel at the normal duty', 'percent open'),
    # Expert: the tank farm, read on the engine's own verdicts.
    ('advanced', 'saghara_bottom_course_required_in'):
        ('The required thickness of the bottom course', 'in'),
    ('advanced', 'saghara_sg_at_which_test_governs'):
        ('The product gravity below which the water test takes the bottom course', 'specific gravity'),
    ('advanced', 'saghara_inbreathing_scfh'):
        ('The total inbreathing at the stated rates', 'scfh'),
    ('advanced', 'saghara_vacuum_governing_draw_bblhr'):
        ('The draw rate above which vacuum governs the venting', 'bbl/hr'),
    ('advanced', 'saghara_working_capacity_bbl'):
        ('The working capacity to the design liquid level', 'bbl'),
    ('advanced', 'saghara_recovery_saved_lb_yr'):
        ('The annual loss the recovery unit saves', 'lb/yr'),
}
assert set(LABELS) == {(f[0], f[1]) for f in fields}, 'labels and fields.json disagree'
assert len({k for _t, k in LABELS}) == 18, 'FC8 field keys are meant to be globally unique'

KRAKAMA = (
    "KRAKAMA, the gas export meter run on a flow station. A flange-tapped orifice plate with a "
    "bore of 3.8747 inches sits in a line of 7.981 inches inside diameter. The differential "
    "transmitter is spanned at 425 inches of water with an accuracy of 0.072 percent of span, and "
    "at design it reads 87.43 inches of water. The gas crosses the plate at a static pressure of "
    "614.7 psia with a flowing density of 3.1642 lb per ft3, a viscosity of 0.0134 cP and a specific "
    "heat ratio of 1.29. The uncertainty budget states every term rather than taking a default: "
    "0.47 percent on the discharge coefficient, 0.18 percent on the expansibility, 0.043 percent on "
    "the orifice bore, 0.11 percent on the pipe bore and 0.28 percent on the density, with the "
    "differential term taken from the transmitter at the design reading. On the liquid side of the "
    "same station a turbine meter counted 4187233 pulses over the proving period against a K factor "
    "of 912.47 pulses per bbl, and the proving run returned a meter factor of 1.0034.")

UTONANA = (
    "UTONANA, the control valve on a hot condensate transfer. It passes 742.6 US gallons a minute "
    "of a liquid with a specific gravity of 0.7134, from an inlet at 428.3 psia to an outlet at "
    "72.4 psia. The liquid's true vapour pressure at its flowing temperature is 41.62 psia and its "
    "critical pressure is 566.8 psia. The trim's certified liquid pressure recovery factor FL is "
    "0.93, stated by the vendor and used in place of any table value, there is no piping geometry "
    "correction, and the service is fully turbulent. The system around the valve takes a total "
    "pressure drop of 452.8 psi at design flow, and the valve's own share of it is the drop from its "
    "inlet to its outlet. The trim is equal percentage with a rated coefficient of 88 and a "
    "rangeability of 42.5, and the coefficients the three duties require are 11.85 at the minimum, "
    "34.62 at the normal and 47.3 at the maximum.")

SAGHARA = (
    "SAGHARA, a fixed-roof tank on a crude terminal. The shell is 78.4 ft in diameter and 44 ft "
    "high, built in 8 ft courses, with a design liquid level of 42.6 ft. It is designed by the "
    "one-foot method at a design allowable stress of 25300 psi and a hydrostatic test allowable "
    "stress of 27000 psi, with a corrosion allowance of 0.0625 inch added to the design condition "
    "only, and the minimum plate thickness in force is stated at 0.25 inch. The product has a "
    "specific gravity of 0.8312. The tank is uninsulated and holds a low volatility product, and its "
    "venting is stated rather than defaulted: a thermal rate of 1.12 scfh of air per barrel of "
    "nominal capacity, a latitude factor of 1.08, a low-volatility outbreathing factor of 0.58, and "
    "a capacity of 41500 bbl above which proportionality is no longer claimed. It is filled at 4820 "
    "bbl an hour and drawn at 1150 bbl an hour. The terminal's own measured inventory record puts "
    "the uncontrolled evaporative loss at 214860 lb a year, and the vapour recovery unit proposed "
    "for it is quoted at 93.4 percent.")

TIER = {
    'beginner': (
        'associate',
        'KRAKAMA, a gas export meter run read as a measurement and as a budget',
        'What the meter run measures, and how well',
        KRAKAMA + " Report six values: the beta ratio of the orifice run, the design differential "
                  "in psi, the transmitter uncertainty as a percent of the design reading, the flow "
                  "turndown at the design reading, the total uncertainty of the mass flow as a "
                  "percent, and the gross volume the turbine meter recorded. The volume in bbl, to "
                  "four decimals. The ratios, the differential and the percentages to six "
                  "decimals."),
    'intermediate': (
        'professional',
        'UTONANA, a control valve on a hot condensate transfer, sized either side of its choking boundary',
        'The choking boundary and what sits either side of it',
        UTONANA + " Report six values: the liquid critical pressure ratio factor FF, the allowable "
                  "pressure drop in psi, the liquid valve coefficient the service needs, the "
                  "cavitation index on the drop the valve uses, the valve authority at design "
                  "flow, and the travel at the normal duty in percent open. All six to six "
                  "decimals."),
    'advanced': (
        'expert',
        'SAGHARA, a fixed-roof tank read on its shell, its venting and its losses',
        'The tank farm, read on the engine\'s own verdicts',
        SAGHARA + " Report six values: the required thickness of the bottom course in inches, the "
                  "product specific gravity below which the hydrostatic test would take the bottom "
                  "course instead, the total inbreathing in scfh at the stated rates, the draw rate "
                  "in bbl an hour above which vacuum would govern the venting, the working capacity "
                  "in bbl to the design liquid level, and the annual loss in lb that the recovery "
                  "unit saves. The thickness and the gravity to six decimals. The inbreathing, the "
                  "draw rate, the capacity and the saving to four decimals."),
}

HEADER = """-- ============================================================================
-- FC8: Metering, Control Valves & Storage joins the catalog, a Facilities
-- course at path_order 46.
--
-- Catalog row (module 'facilities'; path_order 46 in the Facilities block that
-- runs from FC1 separation at 39; prereq_slug NULL, the carried-over answer "no
-- hard prerequisite inside a module") plus the three capstones and their
-- eighteen graded fields, generated by tools/course-waves/metering/gen_course.py
-- from fields.json, precision.json and the capstone constants in
-- fc8_capstone.mjs. Deep seeds are three separate migrations; the go-live is a
-- fifth and is HELD until a NextGen production upload carries the route
-- /dashboard/apps/metering, because the 78 lessons, the teaching lab
-- (meteringLab.js) and its four explorer panels ship in the zip and not in this
-- database.
--
-- THE ONE SENTENCE THE COURSE IS. A meter run, a control valve and a tank are
-- the three places on a facility where a number that looks like a measurement
-- is a design judgement with a standard behind it, and where the behaviour that
-- matters lives at a boundary the ordinary equation walks straight past.
--
-- THE ENGINES. engines/facilities/metering.js, controlValve.js and
-- storageTank.js, vendored from engines main 9874d583 with the FC8-0 repair,
-- byte-identical and proved three independent ways (tools/course-waves/metering
-- vendor/closure.json).
--
-- NOTHING GRADED RESTS ON A HELD, UNCITED OR WITHHELD ITEM. The three engines
-- name fifteen, and two are outright refusals: the straight run for two elbows
-- in different planes, and the relation that turns a fire duty into a required
-- vent capacity. Neither is graded anywhere. Where a capstone needs a value an
-- engine calls its own stated data, the capstone STATES it: UTONANA states its
-- certified FL, SAGHARA its allowable stresses, its minimum plate, its thermal
-- rate, its latitude factor, its low-volatility factor and its proportional
-- limit, and KRAKAMA every term of its uncertainty budget. SAGHARA's annual
-- loss is stated off a measured record, so AP-42 and its turnover factor are
-- not called. fc8_capstone.mjs measures each clearance rather than asserting
-- it, and the go-live asserts all eighteen again by closed form.
--
-- All eighteen graded values were swept against every number the digest
-- prints and against every number handed to a learner in a prompt, at each
-- field's own shipped tolerance: 0 collisions, and 0 pairwise.
-- ============================================================================"""

lines = [HEADER, '',
         "insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)",
         "values ('metering', 'Metering, Control Valves & Storage', 'facilities', 46, 'coming_soon', null)",
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
    blocks.append(f"(\n  'metering', {q(tier)}, {q(cert)},\n  {q(dataset)},\n"
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
bad = []

# EVERY STATED CONDITION IS IN ITS PROMPT. Read the constants out of the
# capstone file itself, so a condition added there and forgotten here refuses.
cap = open(f'{W}/fc8_capstone.mjs', encoding='utf-8').read()
CASE_TIER = {'KRAKAMA': 'beginner', 'UTONANA': 'intermediate', 'SAGHARA': 'advanced'}
stated_total = 0
for case, tier in CASE_TIER.items():
    m = re.search(r'const ' + case + r' = Object\.freeze\(\{(.*?)\}\);', cap, re.S)
    if not m:
        bad.append(f'{case} constants not found in fc8_capstone.mjs')
        continue
    prompt_nums = set()
    for tok in NUM.findall(TIER[tier][3]):
        prompt_nums.add(float(tok))
    for name, raw in re.findall(r'(\w+):\s*([0-9_.]+)', m.group(1)):
        val = float(raw.replace('_', ''))
        stated_total += 1
        if val not in prompt_nums:
            bad.append(f'{case}.{name} = {val} is passed to the engine and is not stated in the {tier} prompt')

handed = []
for tier in TIERS:
    for tok in NUM.findall(TIER[tier][3]):
        try:
            handed.append((tier, abs(float(tok))))
        except ValueError:
            pass
for ftier, key, val, tol in fields:
    for htier, h in handed:
        if abs(abs(val) - h) <= tol:
            bad.append(f'{ftier}.{key} = {val} is within {tol} of {h}, handed in the {htier} prompt')
for i in range(len(fields)):
    for j in range(i + 1, len(fields)):
        if abs(abs(fields[i][2]) - abs(fields[j][2])) <= max(fields[i][3], fields[j][3]):
            bad.append(f'pairwise: {fields[i][0]}.{fields[i][1]} and {fields[j][0]}.{fields[j][1]}')

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
print(f'capstone constants required in their prompts: {stated_total}')
print(f'digest numbers swept: {len(digest_nums)} | handed-in-prompt values: {len(handed)}')
for b in bad:
    print('  REFUSED:', b)
print('stated-condition + handed-in-prompt + pairwise + digest collisions + precision:', len(bad))
sys.exit(1 if (bad or odd or dashes) else 0)
