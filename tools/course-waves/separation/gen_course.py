#!/usr/bin/env python3
"""Generate the FC1 course + capstone migration from fields.json and the
capstone constants, so no expected value or condition is retyped.

Modelled on /root/ec-wip-uncertainty/gen_course.py (EC3), with two
differences forced by what FC1 is:

1. FC1's three tiers do NOT chain. EC3 ran one field through three engines
   and each tier restated the tier below. Here the Associate sizes EJULEBE-1,
   the Professional sizes EJULEBE-2 with its slug catcher and the ODEAMA
   duties, and the Expert takes EJULEBE-3, EJULEBE-4 and the ADANGA yard.
   No prompt needs to restate another tier's conditions, so the cross-tier
   leak surface is zero by construction rather than by careful wording.

2. The prompts say "Report", not "Read". promptleak.py only considers a
   quoted literal a prompt when it is at least 400 characters AND contains
   the word "Report". EC3's prompts say "Read six values", so that gate swept
   nothing at all there and reported a clean 0 of 0. Worded this way it
   actually sweeps.

EVERY TIER STATES ITS OWN VENDOR K, so nothing graded depends on the K
pressure derating or the 0.12 floor, both of which are HELD FOR LITERATURE.

Usage: python3 /root/fc-wip-separation/gen_course.py
"""
import json, re, math, sys

W = '/root/fc-wip-separation'
REPO = '/root/wt-fc1-nextgen'
OUT = f'{REPO}/migrations/20260921_fc1_separation_course.sql'

fields = json.load(open(f'{W}/fields.json'))


def q(s):
    return "'" + s.replace("'", "''") + "'"


# ---------------------------------------------------------------------------
# The eighteen graded fields. Labels name the REQUIREMENT each answer came
# from, because that is the discipline the course teaches: a separator is
# sized by asking which requirement binds first.
# ---------------------------------------------------------------------------
LABELS = {
    # Associate: the gas, the settling and the vertical vessel at EJULEBE-1.
    'ejulebe1_gas_density_lbft3':        ('Gas density at separator conditions', 'lb/ft3'),
    'ejulebe1_gas_actual_ft3s':          ('Gas rate at separator conditions, the rate the vessel actually sees', 'ft3/s'),
    'ejulebe1_terminal_velocity_fts':    ('Souders-Brown terminal settling velocity at the vendor K', 'ft/s'),
    'ejulebe1_gas_diameter_ft':          ('The diameter the gas demands', 'ft'),
    'ejulebe1_height_ft':                ('Vessel height at the vendor diameter, retention plus allowance', 'ft'),
    'ejulebe1_velocity_margin':          ('Velocity margin at the vendor diameter', 'dimensionless'),
    # Professional: the horizontal vessel, the slug catcher, the setbacks.
    'ejulebe2_liquid_length_ft':         ('The length the liquid retention demands', 'ft'),
    'ejulebe2_gas_velocity_fts':         ('Gas velocity in the gas space', 'ft/s'),
    'ejulebe_slug_vessel_diameter_ft':   ('Slug catcher vessel diameter at the stated L/D', 'ft'),
    'ejulebe_finger_length_ft':          ('Length of each finger in the harp', 'ft'),
    'odeama_flare_setback_m':            ('Flare setback, computed from its own duty', 'm'),
    'odeama_pool_setback_edge_m':        ('Pool fire setback measured from the pool edge', 'm'),
    # Expert: the interface, the two droplet times, the preferred vessel,
    # and the two layout rankings.
    'ejulebe3_interface_height_ft':      ('Oil-water interface at its exact height', 'ft'),
    'ejulebe3_water_drop_fall_s':        ('Time for the specified water droplet to cross the oil layer', 's'),
    'ejulebe3_oil_drop_rise_s':          ('Time for the specified oil droplet to rise through the water layer', 's'),
    'ejulebe4_preferred_height_ft':      ('Height of the preferred vessel in the family', 'ft'),
    'adanga_worst_absolute_shortfall_m': ('Worst absolute shortfall on the layout', 'm'),
    'adanga_worst_relative_fraction':    ('Worst relative shortfall on the layout, as a fraction of the requirement', 'fraction'),
}
assert set(LABELS) == {f[1] for f in fields}, 'labels and fields.json disagree'

# ---------------------------------------------------------------------------
# The conditions, written out of fc1_fields_capstone.mjs. Every quantity that
# changes an answer is stated; nothing that IS an answer is.
# ---------------------------------------------------------------------------
EJULEBE_1 = (
    "EJULEBE-1, the vertical two-phase inlet separator on a field the lessons never use: "
    "gas 31 MMscfd at 740 psig and 105 degF with a gas gravity of 0.71; oil 7350 bopd at 29 degrees API; "
    "water 2480 bpd at a specific gravity of 1.06; liquid retention 4 minutes; an allowance of 6.5 ft above "
    "the liquid; and a vendor K of 0.33 quoted for the mist extractor, which the engine takes as typed and "
    "never derates. The vessel the vendor offered is 6.4 ft in diameter.")

EJULEBE_2 = (
    "EJULEBE-2, the horizontal production separator: gas 46 MMscfd at 415 psig and 118 degF with a gas "
    "gravity of 0.66; oil 15500 bopd at 31 degrees API; water 4300 bpd at a specific gravity of 1.03; "
    "liquid retention 6 minutes; a vendor K of 0.4; a diameter of 9 ft; and a liquid level at 0.45 of the "
    "diameter. The slug catcher behind it takes a 620 bbl slug with 19800 bpd still arriving over an 8 "
    "minute hold, filled to 0.65 of the vessel, at an L/D of 5; the same slug is also laid out as a harp of "
    "7 fingers of 26 inch inside diameter filled to 0.75. The ODEAMA flow station states two radiation "
    "duties: a flare relieving 27 kg/s of a gas of 47500 kJ/kg, radiating a fraction 0.28 at a "
    "transmissivity of 0.95 against an allowable 6.31 kW/m2; and a slop tank pool fire 24 m across burning "
    "at 0.048 kg/m2 per second, 41500 kJ/kg, radiating 0.32 at a transmissivity of 1 against an allowable "
    "4.73 kW/m2.")

EJULEBE_3 = (
    "EJULEBE-3, the three-phase separator: gas 21 MMscfd at 290 psig and 124 degF with a gas gravity of "
    "0.73; oil 9600 bopd at a specific gravity of 0.8762 and a viscosity of 6.5 cP; water 7200 bpd at a "
    "specific gravity of 1.07 and a viscosity of 0.75 cP; oil retention 7 minutes and water retention 9 "
    "minutes; a water droplet specification of 350 micron and an oil droplet specification of 150 micron; a "
    "vendor K of 0.37; a diameter of 11 ft; and a liquid level at 0.55 of the diameter. "
    "EJULEBE-4, the vertical scrubber downstream of the compressor: gas 70 MMscfd at 620 psig and 96 degF "
    "with a gas gravity of 0.69; oil 1900 bopd at 30 degrees API; water 350 bpd at a specific gravity of "
    "1.05; retention 3 minutes; an allowance of 7 ft; a vendor K of 0.31; offered at 3, 3.5, 4, 4.5, 5 and "
    "6 ft against an L/D band of 2 to 4. "
    "The ADANGA manifold yard, judged in the Facility Layout Mapper against the site's own stated setbacks: "
    "the yard flare at 100 m to 6.31 kW/m2 and the slop tank pool fire at 47 m to 4.73 kW/m2, with a "
    "portable flare that was never placed and a second slop tank carrying no coordinates.")

TIER = {
    'beginner': (
        'associate',
        'EJULEBE-1, a vertical two-phase inlet separator on a field the lessons never use',
        'Size one vessel from its stream',
        EJULEBE_1 + " Report six values from the gas at conditions, the settling and the vertical vessel. "
                    "Densities in lb/ft3, rates in ft3/s, velocities in ft/s and lengths in ft, to four decimals."),
    'intermediate': (
        'professional',
        'EJULEBE-2, the slug catcher behind it, and the ODEAMA flow stationptwo radiation duties',
        'The horizontal vessel, the slug and the setbacks',
        EJULEBE_2 + " Report six values from the sized vessel, the two slug catcher layouts and the two "
                    "computed setbacks. Lengths in ft, velocities in ft/s and distances in m, to four decimals."),
    'advanced': (
        'expert',
        'EJULEBE-3, the EJULEBE-4 scrubber family, and the ADANGA manifold yard judged against its own setbacks',
        'The interface, the family and the judgement',
        EJULEBE_3 + " Report six values from the three-phase split, the two droplet crossings, the preferred "
                    "vessel of the family and the two layout rankings. Lengths in ft, times in s, distances "
                    "in m and the fraction as a fraction, to four decimals or better."),
}
# the dataset line above must not carry a stray apostrophe artefact
TIER['intermediate'] = (
    'professional',
    "EJULEBE-2, the slug catcher behind it, and the ODEAMA flow station's two radiation duties",
    'The horizontal vessel, the slug and the setbacks',
    TIER['intermediate'][3])

HEADER = """-- ============================================================================
-- FC1: Separation & Slug Catching joins the catalog, the FIRST Facilities
-- course and the first row the `facilities` module has ever had.
--
-- Catalog row (module 'facilities'; path_order 39, the first free slot above
-- Production's 38 and below Economics' 53; prereq_slug NULL, the carried-over
-- answer "no hard prerequisite inside a module") plus the three capstones and
-- their eighteen graded fields, generated by
-- /root/fc-wip-separation/gen_course.py from fields.json and the capstone
-- constants in fc1_fields_capstone.mjs. Deep seeds are three separate
-- migrations; the go-live is a fifth and is HELD until a NextGen production
-- upload carries the route /dashboard/apps/separation, because the 78
-- lessons, the teaching lab and its three explorer panels ship in the zip and
-- not in this database.
--
-- THE ONE SENTENCE THE COURSE IS. A separator is sized by asking which of
-- several competing requirements binds first, and the discipline is knowing
-- which requirement each dimension came from, which verdict the vessel has to
-- survive, and which number on the page is a calculation rather than a table
-- somebody copied.
--
-- THE ENGINES. engines/facilities/separatorSizing.js (the Separator & Slug
-- Catcher Designer: the DAK z factor inside its range, K with its published
-- derating, Souders-Brown settling, vertical and horizontal two-phase sizing,
-- three-phase sizing with an exact oil-water interface and two droplet
-- verdicts, and the L/D family with feasibility, reasons and a preferred row)
-- and engines/facilities/spacing.js (the Facility Layout Mapper's missing
-- half: the spacing table, haversine distances, computed flare and pool fire
-- setbacks, and the layout check with its completeness reading), as repaired
-- in FC1-0 (engines #188) and then in engines #195, which added the nearFloor
-- flag beside floored and gave both floor comparisons 1e-9 of slack.
--
-- NOTHING GRADED DEPENDS ON A HELD-FOR-LITERATURE QUANTITY. The K derating of
-- 0.01 per 100 psi and the 0.12 floor are the customary rule of thumb as this
-- module records it, unchecked against the source, so every tier states its
-- own VENDOR K and the engine is called with kOverride. For the same reason
-- the Expert layout is handed the site's own setbacks and is graded on
-- radiation shortfalls only, never on a spacing TABLE figure.
--
-- THE CAPSTONE GRADES WHAT THE COURSE TEACHES A READER TO GET RIGHT: which
-- requirement each dimension came from (the diameter from the gas, the height
-- from the liquid), the verdicts a sized vessel has to survive, the exact
-- interface against the retired chord rule, the smallest FEASIBLE vessel in
-- band rather than the smallest vessel, and two layout rankings that name
-- different pairs. All eighteen graded values were swept against every number
-- the digest and the goldens publish and against every number handed to a
-- learner in a prompt, at each field's own tolerance: 0 collisions, and 0
-- pairwise.
-- ============================================================================"""

lines = [HEADER, '',
         "insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)",
         "values ('separation', 'Separation & Slug Catching', 'facilities', 39, 'coming_soon', null)",
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
    blocks.append(f"(\n  'separation', {q(tier)}, {q(cert)},\n  {q(dataset)},\n  {q(title)},\n  {q(prompt)},\n  jsonb_build_array(\n{objs}\n  )\n)")
lines.append(',\n'.join(blocks))
lines.append('on conflict (app_slug, tier) do nothing;')
sql = '\n'.join(lines) + '\n'
open(OUT, 'w').write(sql)

# --------------------------------------------------------------- self checks
odd = [n for n, l in enumerate(sql.splitlines(), 1)
       if not l.lstrip().startswith('--') and l.split('--', 1)[0].count("'") % 2]
dashes = len(re.findall('[–—]', sql))

# A graded value may not be a number the learner is handed in its own prompt,
# nor in any other tier's prompt. Run the gate here, in Python, before it is
# run in SQL and before promptleak runs it on the emitted file.
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

print(f'wrote {OUT}: {len(sql.splitlines())} lines, 3 capstones, {len(fields)} fields')
print('odd-quote lines:', odd, '| en/em dashes:', dashes)
print('prompt lengths:', {t: len(TIER[t][3]) for t in TIER})
for b in bad:
    print('  REFUSED:', b)
print('handed-in-prompt + pairwise collisions:', len(bad))
sys.exit(1 if (bad or odd or dashes) else 0)
