#!/usr/bin/env python3
"""Generate the FC7 course + capstone migration from fields.json, precision.json
and the capstone constants, so no expected value and no condition is retyped.

Modelled on tools/course-waves/heattransfer/gen_course.py (FC6), with one
difference FC7 forces and one it chooses:

1. THE CONDITIONS ARE NOT TYPED AT ALL. FC6 wrote its three capstone briefs as
   string literals, so a condition moved in fc6_fields_capstone.mjs would have
   left the prompt stating the old one. Here the constants are read out of
   fc7_fields_capstone.mjs BY NODE, the module the capstone generator itself
   imports, and every number in every brief is formatted from them. A prompt and
   a graded value cannot disagree about what was asked.

2. THE PRECISION SENTENCE IN EACH PROMPT is checked against precision.json per
   CLASS, as on FC6: the Associate and the Professional each grade two classes
   (twelve decimals for a viscosity or a velocity, six for the rest) and ask for
   both; the Expert grades six throughout.

THE TOLERANCES ARE READ, NEVER DECLARED, and both collision sweeps run at the
tolerance fields.json ships.

Usage: python3 gen_course.py
   FC7_WAVE       the wave directory (default /root/fc-wip-producedwater)
   FC7_REPO       the nextgen clone   (default /root/wt-fc7-nextgen)
   FC7_COURSE_OUT where to write      (default $FC7_REPO/migrations/...)
"""
import json
import os
import re
import subprocess
import sys

W = os.environ.get('FC7_WAVE', '/root/fc-wip-producedwater')
REPO = os.environ.get('FC7_REPO', '/root/wt-fc7-nextgen')
OUT = os.environ.get('FC7_COURSE_OUT', f'{REPO}/migrations/20260925_fc7_producedwater_course.sql')

fields = json.load(open(f'{W}/fields.json'))
precision = json.load(open(f'{W}/precision.json'))
TIERS = ('beginner', 'intermediate', 'advanced')

# THE CAPSTONE CONSTANTS, out of the module the capstone generator imports.
C = json.loads(subprocess.run(
    ['node', '--input-type=module', '-e',
     f"import * as M from '{W}/fc7_fields_capstone.mjs';"
     "const o={};for(const[k,v]of Object.entries(M))if(typeof v!=='function')o[k]=v;"
     "process.stdout.write(JSON.stringify(o));"],
    capture_output=True, text=True, check=True).stdout)


def q(s):
    return "'" + s.replace("'", "''") + "'"


def n(x):
    """A condition as the learner reads it: the shortest exact decimal."""
    s = repr(float(x))
    return s[:-2] if s.endswith('.0') else s


# ---------------------------------------------------------------------------
# The eighteen graded fields.
# ---------------------------------------------------------------------------
LABELS = {
    ('beginner', 'ogulagha_water_viscosity_pas'):
        ('The water viscosity at the stream temperature and salinity', 'Pa.s'),
    ('beginner', 'ogulagha_water_density_kgm3'):
        ('The brine density at the stream temperature and salinity', 'kg/m3'),
    ('beginner', 'ogulagha_oil_density_kgm3'):
        ('The crude density at the stream temperature', 'kg/m3'),
    ('beginner', 'ogulagha_droplet_rise_ms'):
        ('The Stokes rise velocity of the median droplet', 'm/s'),
    ('beginner', 'ogulagha_basin_cut_micron'):
        ('The API 421 basin cut size', 'micron'),
    ('beginner', 'ogulagha_plate_cut_micron'):
        ('The plate pack cut size', 'micron'),
    ('intermediate', 'izombe_liner_turndown_ratio'):
        ('The turndown the liners run at', 'ratio'),
    ('intermediate', 'izombe_cyclone_shear_penalty'):
        ('The inlet shear penalty on the liner cut', 'ratio'),
    ('intermediate', 'izombe_cyclone_cut_micron'):
        ('The liner bank cut size, with its penalty applied', 'micron'),
    ('intermediate', 'izombe_bubble_rise_ms'):
        ('The full drag balance rise velocity of one bubble', 'm/s'),
    ('intermediate', 'izombe_gas_holdup_ratio'):
        ('The gas holdup of the swarm', 'ratio'),
    ('intermediate', 'izombe_filter_cut_micron'):
        ('The media bed cut size', 'micron'),
    ('advanced', 'tunu_plate_stage_removal_pct'):
        ('The plate pack stage removal, of the oil reaching it', 'percent'),
    ('advanced', 'tunu_cyclone_stage_removal_pct'):
        ('The liner bank stage removal, of the oil reaching it', 'percent'),
    ('advanced', 'tunu_cyclone_stage_median_micron'):
        ('The droplet median leaving the liner bank stage', 'micron'),
    ('advanced', 'tunu_train_outlet_ppm'):
        ('The train outlet concentration', 'ppm'),
    ('advanced', 'tunu_train_outlet_median_micron'):
        ('The droplet median leaving the train', 'micron'),
    ('advanced', 'tunu_coarse_droplet_reynolds'):
        ('The Reynolds number reported for the coarse droplet', 'ratio'),
}
assert set(LABELS) == {(f[0], f[1]) for f in fields}, 'labels and fields.json disagree'
assert len({k for _t, k in LABELS}) == 18, 'FC7 field keys are meant to be globally unique'

BARREL = n(C['BARREL_M3'])


def water(tag):
    w, o = C[f'{tag}_WATER'], C[f'{tag}_OIL']
    assert w['tC'] == o['tC'], f'{tag} states the water and the crude at different temperatures'
    return (f"The water is {n(C[f'{tag}_BWPD'])} bwpd, taken to m3/s with the exact barrel of "
            f"{BARREL} m3, at {n(w['tC'])} C and {n(w['tdsPpm'])} ppm of total dissolved solids, "
            f"and the crude is {n(o['apiGravity'])} degrees API at the same temperature.")


def liners(L):
    return (f"{n(L['nLiners'])} liners, each of {n(L['linerDiameterM'])} m bore and "
            f"{n(L['linerLengthM'])} m length, rated at {n(L['designFlowPerLinerM3S'])} m3/s and "
            f"{n(L['gFieldAtDesign'])} g at that flow, with the oil core taken at "
            f"{n(L['coreRadiusFraction'])} of the liner radius")


def bed(F):
    return (f"{n(F['areaM2'])} m2 and {n(F['bedDepthM'])} m deep, packed at {n(F['mediaMicron'])} "
            f"micron, with a filter coefficient of {n(F['filterCoefficientPerM'])} per m declared at a "
            f"{n(F['referenceDropletMicron'])} micron droplet")


OGI, OGB, OGP = C['OGULAGHA_INLET'], C['OGULAGHA_BASIN'], C['OGULAGHA_PLATES']
OGULAGHA = (
    "OGULAGHA, a gravity front end on a warm, moderately saline field. " + water('OGULAGHA') +
    f" The droplets arrive at {n(OGI['oiwPpm'])} ppm with a volume median of {n(OGI['d50Micron'])} "
    f"micron and a log spread sigma of {n(OGI['sigma'])}. The basin is {n(OGB['lengthM'])} m long, "
    f"{n(OGB['widthM'])} m wide and {n(OGB['depthM'])} m deep, read at a short-circuit allowance F of "
    f"{n(OGB['shortCircuitF'])}. The plate pack is {n(OGP['nPlates'])} plates of {n(OGP['plateAreaM2'])} m2 "
    f"projected area each, with {n(OGP['efficiencyFactor'])} of that area credited as settling. The "
    "water viscosity fit, the brine density fit and the crude density chain from API gravity are the "
    "module's own declared choices, and nothing else is looked up.")

IZL, IZF, IZB = C['IZOMBE_LINERS'], C['IZOMBE_FLOTATION'], C['IZOMBE_FILTER']
IZOMBE = (
    "IZOMBE, three de-oiling devices on a cooler, much more saline field. " + water('IZOMBE') +
    " The liner bank is " + liners(IZL) + ". The flotation unit is "
    f"{n(IZF['nCells'])} cells of {n(IZF['cellVolumeM3'])} m3, {n(IZF['cellDepthM'])} m deep, fed gas "
    f"at {n(IZF['gasRatio'])} times the water flow to each cell as bubbles of {n(IZF['bubbleMicron'])} "
    f"micron with a gas density of {n(IZF['gasDensityKgM3'])} kg/m3. The media bed is " + bed(IZB) +
    ". The operating envelope of a liner, the drag coefficient a bubble rises against and the loading "
    "dependence of the bed are the module's own declared choices.")

TUI, TUG = C['TUNU_INLET'], C['TUNU_GRID']
TUP, TUL, TUF = C['TUNU_PLATES'], C['TUNU_LINERS'], C['TUNU_FILTER']
TUNU = (
    "TUNU, a three stage train on a hot, fresher field. " + water('TUNU') +
    f" The inlet carries {n(TUI['oiwPpm'])} ppm of oil at a volume median of {n(TUI['d50Micron'])} "
    f"micron and a log spread sigma of {n(TUI['sigma'])}, described on {n(TUG['nBins'])} bins spanning "
    f"{n(TUG['spanSigma'])} sigma either side of the median. The train runs in this order: a plate pack "
    f"of {n(TUP['nPlates'])} plates of {n(TUP['plateAreaM2'])} m2 with {n(TUP['efficiencyFactor'])} of "
    "the projected area credited as settling; then a liner bank of " + liners(TUL) +
    "; then a media bed of " + bed(TUF) + ". Every cut size is the engine's own for its device, "
    "and no dissolved oil floor and no discharge specification is given.")

TIER = {
    'beginner': (
        'associate',
        'OGULAGHA, a produced water stream read from its fluids to a basin and a plate pack',
        'The water, the oil and the gravity front end',
        OGULAGHA + " Report six values: the water viscosity, the brine density, the crude density, "
                   "the Stokes rise velocity of a droplet at the volume median, the basin cut size "
                   "and the plate pack cut size. The viscosity in Pa.s and the rise velocity in m/s, "
                   "to twelve decimals. The two densities in kg/m3 and the two cut sizes in micron, "
                   "to six decimals."),
    'intermediate': (
        'professional',
        'IZOMBE, a liner bank run short of liners, a flotation unit and a media bed on one water',
        'The three devices whose cut does not come from gravity alone',
        IZOMBE + " Report six values: the turndown the liners run at, the inlet shear penalty on "
                 "their cut, the liner bank cut size, the rise velocity of one bubble, the gas "
                 "holdup of the swarm and the bed cut size. The turndown, the shear penalty and the "
                 "holdup as ratios and the two cut sizes in micron, to six decimals. The rise "
                 "velocity in m/s, to twelve decimals."),
    'advanced': (
        'expert',
        'TUNU, a three stage train read stage by stage and at its outlet',
        'The coupling, and a droplet outside the band',
        TUNU + f" Report six values: the removal of the plate pack stage and of the liner bank stage, "
               "each as a percentage of the oil reaching it, the droplet median leaving the liner "
               "bank stage, the train outlet concentration, the droplet median leaving the train, "
               f"and the Reynolds number the module reports for a {n(C['TUNU_COARSE_DROPLET_MICRON'])} "
               "micron droplet in this water. Removals in percent, the concentration in ppm, the "
               "medians in micron and the Reynolds number as a ratio, all to six decimals."),
}

HEADER = """-- ============================================================================
-- FC7: Produced Water Treatment joins the catalog, the SEVENTH Facilities course.
--
-- Catalog row (module 'facilities'; path_order 45, directly above FC6
-- heattransfer at 44, FC5 at 43, FC4 gasprocessing at 42, FC3 rotating at 41,
-- FC2 linesizing at 40 and FC1 separation at 39; prereq_slug NULL, the
-- carried-over answer "no hard prerequisite inside a module") plus the three
-- capstones and their eighteen graded fields, generated by
-- tools/course-waves/producedwater/gen_course.py from fields.json,
-- precision.json and the capstone constants in fc7_fields_capstone.mjs, which
-- are read by node and never retyped. Deep seeds are three separate migrations;
-- the go-live is a fifth and is HELD until a NextGen production upload carries
-- the route /dashboard/apps/producedwater, because the 78 lessons, the teaching
-- lab (producedWaterLab.js) and its three explorer panels ship in the zip and
-- not in this database.
--
-- THE ONE SENTENCE THE COURSE IS. Oil in water is a droplet size distribution
-- and not a concentration, every cut size is computed from the equipment and the
-- fluids, and a train carries the OUTLET distribution forward, so the next
-- device faces finer water than its own cut size suggests.
--
-- THE ENGINE. engines/facilities/producedWater.js (the water viscosity and the
-- brine and crude densities, the log-normal droplet grid and its interpolated
-- volume median, Stokes and the full drag balance, the API 421 basin, the plate
-- pack, the hydrocyclone on stated geometry with its operating envelope and
-- shear penalty, flotation as attachment kinetics, the media bed as inverted
-- depth filtration, and the train). It imports nothing. Vendored at engines
-- 9874d58, the FC7-1 repair, sha-identical over a walked import closure.
--
-- NOTHING GRADED DEPENDS ON A HELD QUANTITY, and each is neutralised by
-- CONSTRUCTION. No graded field reads a flotation cut, which is the one answer
-- the calibration reaches: IZOMBE grades the bubble rise and the holdup, and the
-- capstone generator moves the attachment efficiency tenfold and asserts both
-- stay identical to the last bit. Both graded beds are packed at the module's
-- own reference grain of 800 micron, where the held inverse-cube exponent
-- multiplies by exactly one. TUNU is given no dissolved oil floor and no
-- specification, so no graded concentration is floored and no graded field is a
-- verdict. OGULAGHA's basin sits under the fixed horizontal velocity limit, so
-- the missing half of that rule decides nothing. Every pinned constant a graded
-- answer reads is stated on the capstone page.
--
-- THE CAPSTONE GRADES WHAT THE COURSE TEACHES A READER TO GET RIGHT: the fluid
-- properties a cut stands on, that a basin cut is a surface loading inverted,
-- that a liner bank run short of liners is at the ceiling and carries a
-- penalty, that a bubble rises by the full drag balance and sets a holdup, that
-- a bed cut is depth filtration read backwards, and that in a train every stage
-- works on the water the stage before it left.
-- ============================================================================"""

lines = [HEADER, '',
         "insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)",
         "values ('producedwater', 'Produced Water Treatment', 'facilities', 45, 'coming_soon', null)",
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
    blocks.append(f"(\n  'producedwater', {q(tier)}, {q(cert)},\n  {q(dataset)},\n"
                  f"  {q(title)},\n  {q(prompt)},\n  jsonb_build_array(\n{objs}\n  )\n)")
lines.append(',\n'.join(blocks))
lines.append('on conflict (app_slug, tier) do nothing;')
sql = '\n'.join(lines) + '\n'
open(OUT, 'w').write(sql)

# --------------------------------------------------------------- self checks
odd = [i for i, l in enumerate(sql.splitlines(), 1)
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

# THE CAPSTONE NAMES STAY OFF THE TEACHING SIDE, which gate_capstone_leak.py
# checks of the digest; this is the same check of the prompts' own neighbours.
for name in ('OGULAGHA', 'IZOMBE', 'TUNU'):
    if name in open(f'{W}/digest.txt', encoding='utf-8').read():
        bad.append(f'the capstone stream {name} appears in the digest')

WORD_N = {'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9,
          'ten': 10, 'eleven': 11, 'twelve': 12}
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
        bad.append(f'{tier} prompt is {len(TIER[tier][3])} chars and the sweeps would not find it')

print(f'wrote {OUT}: {len(sql.splitlines())} lines, 3 capstones, {len(fields)} fields')
print('odd-quote lines:', odd, '| en/em dashes:', dashes)
print('prompt lengths:', {t: len(TIER[t][3]) for t in TIERS})
print(f'digest numbers swept: {len(digest_nums)} | handed-in-prompt values: {len(handed)}')
for b in bad:
    print('  REFUSED:', b)
print('handed-in-prompt + pairwise + digest collisions + precision:', len(bad))
sys.exit(1 if (bad or odd or dashes) else 0)
