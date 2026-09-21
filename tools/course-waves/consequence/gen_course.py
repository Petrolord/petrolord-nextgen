#!/usr/bin/env python3
"""Generate the H4 course + capstone migration from the ENGINE'S OWN RUN, so no
expected value and no condition is retyped.

Modelled on tools/course-waves/lopa/gen_course.py (H3), with the differences
H4 forces:

1. THE ENGINE IS RUN HERE. `node h4_capstone.mjs --json` is executed through the
   vendored engines/hse/consequence.js (H4_ENGINES) and the one tolerance module
   (H4_TOLERANCE), and this file REFUSES unless fields.json carries exactly what
   that run returned: the same tier, key and value to the last bit, and the
   tolerance gradedTolerance.js derives. gen_golive.py imports this module and
   takes its engine values from THIS run.

2. THE CONDITIONS ARE READ OUT OF THE SAME GENERATOR. `h4_capstone.mjs --inputs`
   prints the three frozen facilities the engine was run on (OKAN, YOKRI,
   PENNINGTON), and every prompt below is RENDERED from them. A self check then
   proves every number and every name the engine ran on is stated in its own
   tier's prompt, as a learner reads it.

3. THE VOCABULARY THIS WAVE LEGISLATED (digest section 34) AND THE SEAMS
   (section 22) ARE ENFORCED ON EVERY PROMPT, TITLE AND LABEL: no bare flux,
   beta, dose or radiation; never severity or likelihood; no point source, no
   setback, no risk measure and no emission. The copy rule too: no em or en
   dash and no "X, not Y" contrastive. Every rule is planted once and must be
   caught.

4. TWO PRECISIONS. Six decimals for every class but the view factor, which is
   graded at twelve (precision.json). Each prompt asks for exactly the decimals
   its fields are graded to.

PROPERTIES ARE ILLUSTRATIVE, and every prompt says so.

Usage: python3 gen_course.py
   H4_WAVE        the wave directory (default /root/hse-wip-consequence)
   H4_REPO        the nextgen clone   (default /root/wt-h4-nextgen)
   H4_ENGINES     packages/engines to run the capstone through
   H4_TOLERANCE   gradedTolerance.js
   H4_COURSE_OUT  where to write
Importing this module runs the engine and the self checks and writes nothing;
only running it as a script writes the migration.
"""
import json
import os
import re
import subprocess
import sys

W = os.environ.get('H4_WAVE', '/root/hse-wip-consequence')
REPO = os.environ.get('H4_REPO', '/root/wt-h4-nextgen')
ENGINES = os.environ.get('H4_ENGINES', f'{REPO}/packages/engines')
TOLPATH = os.environ.get(
    'H4_TOLERANCE', f'{REPO}/src/components/course/panels/consequence/gradedTolerance.js')
OUT = os.environ.get('H4_COURSE_OUT', f'{REPO}/migrations/20261006_h4_consequence_course.sql')

SLUG, MODULE, PATH_ORDER = 'consequence', 'hse', 64
NAME = 'Consequence Modelling'
TIERS = ('beginner', 'intermediate', 'advanced')

fields = json.load(open(f'{W}/fields.json'))
precision = json.load(open(f'{W}/precision.json'))
wave = json.load(open(f'{W}/wave.json'))
bad = []

for what, got, want in (('slug', wave.get('slug'), SLUG), ('module', wave.get('module'), MODULE),
                        ('pathOrder', wave.get('pathOrder'), PATH_ORDER), ('name', wave.get('name'), NAME),
                        ('prerequisite', wave.get('prerequisite', 'MISSING'), None)):
    if got != want:
        bad.append(f'wave.json {what} is {got!r}, and this generator writes {want!r}')


def q(s):
    return "'" + s.replace("'", "''") + "'"


# ---------------------------------------------------------------------------
# THE ENGINE RUN, through the vendored engine the committed tree carries; the
# environment is passed explicitly so a run staged by gen_seeds.sh cannot reach
# back out to a working tree.
# ---------------------------------------------------------------------------
ENV = dict(os.environ, H4_ENGINES=ENGINES, H4_TOLERANCE=TOLPATH, TZ='UTC', LC_ALL='C')


def node(*args, script=None):
    r = subprocess.run(['node', *([script] if script else []), *args],
                       capture_output=True, text=True, env=ENV)
    if r.returncode != 0:
        sys.exit(f'REFUSED: the engine run failed: {r.stderr.strip()[-400:]}')
    return r.stdout


ENGINE_ROWS = json.loads(node('--json', script=f'{W}/h4_capstone.mjs'))
INPUTS = json.loads(node('--inputs', script=f'{W}/h4_capstone.mjs'))
TOLS = json.loads(node('--input-type=module', '-e',
                       'const M = await import(%s); console.log(JSON.stringify(Object.fromEntries('
                       'M.GRADED_FIELDS.map(([, k]) => [k, M.gradedTolerance(k)]))));' % json.dumps(TOLPATH)))

ENGINE = {(r['tier'], r['key']): r['value'] for r in ENGINE_ROWS}
if len(ENGINE_ROWS) != 18 or len(fields) != 18:
    bad.append(f'the engine returned {len(ENGINE_ROWS)} rows and fields.json carries {len(fields)}; expected 18 and 18')
for (t, k, v, tol), r in zip(fields, ENGINE_ROWS):
    if (t, k) != (r['tier'], r['key']):
        bad.append(f'fields.json row {t}/{k} sits where the engine returned {r["tier"]}/{r["key"]}')
    elif v != r['value'] or type(v) is not float:
        bad.append(f'{t}/{k}: fields.json says {v!r} and the engine returned {r["value"]!r}')
    if tol != TOLS.get(k):
        bad.append(f'{t}/{k}: fields.json grades at {tol!r} and gradedTolerance.js derives {TOLS.get(k)!r}')
KEYS = [k for _t, k, _v, _tol in fields]
TIER_OF = {k: t for t, k, _v, _tol in fields}
F = {k: v for _t, k, v, _tol in fields}
TOL = {k: tol for _t, k, _v, tol in fields}
if len(set(KEYS)) != 18:
    bad.append('two graded fields share a key')

OK, YK, PE = INPUTS['OKAN'], INPUTS['YOKRI'], INPUTS['PENNINGTON']


def n(x):
    """A number as a learner reads it and as the digest prints stated inputs: a
    whole number with no separators; anything else as its shortest decimal, a
    very small one in exponent form with no padded exponent (1.48e-5)."""
    if isinstance(x, bool):
        sys.exit(f'REFUSED: {x!r} is a flag, not a number')
    if isinstance(x, int) or float(x).is_integer():
        return str(int(x))
    s_ = repr(float(x))
    m = re.fullmatch(r'(\d(?:\.\d+)?)e-0?(\d+)', s_)
    if m:
        return f'{m.group(1)}e-{m.group(2)}'
    return s_


# ---------------------------------------------------------------------------
# The eighteen graded fields. Each label names the quantity and, where a tier
# grades two of the same unit, WHICH one.
# ---------------------------------------------------------------------------
LABELS = {
    'okan_condensate_leak_mass_rate_kg_s': ('The condensate line mass rate', 'kg/s'),
    'okan_gas_riser_choked_mass_rate_kg_s': ('The gas riser mass rate', 'kg/s'),
    'okan_vent_subsonic_mass_rate_kg_s': ('The flash gas vent mass rate', 'kg/s'),
    'okan_deck_spill_equivalent_diameter_m': ('The deck spill pool equivalent diameter', 'm'),
    'okan_plume_receptor_concentration_ppm': ('The concentration at the receptor', 'ppm'),
    'okan_plume_far_distance_m': ('The far distance at which the stated concentration is met', 'm'),
    'yokri_flame_length_with_wind_m': ('The flame length with wind', 'm'),
    'yokri_flame_tilt_deg': ('The flame tilt from the vertical', 'degrees'),
    'yokri_surface_emissive_power_mudan_w_m2': ('The surface emissive power from the diameter', 'W/m2'),
    'yokri_surface_emissive_power_actual_w_m2': ('The surface emissive power from the radiative fraction with soot', 'W/m2'),
    'yokri_view_factor_max': ('The maximum view factor at the target', 'dimensionless'),
    'yokri_solid_flame_heat_flux_w_m2': ('The heat flux at the target', 'W/m2'),
    'pennington_blast_overpressure_pa': ('The peak side-on overpressure at the control room', 'Pa'),
    'pennington_blast_distance_for_overpressure_m': ('The distance at which the stated overpressure is reached', 'm'),
    'pennington_overpressure_fatality_probability': ('The overpressure fatality probability in the workshop', 'probability'),
    'pennington_thermal_lethality_probability': ('The thermal lethality probability', 'probability'),
    'pennington_toxic_lethality_probability': ('The chlorine lethality probability', 'probability'),
    'pennington_ammonia_lethality_probability': ('The ammonia lethality probability', 'probability'),
}
if set(LABELS) != set(KEYS):
    bad.append('LABELS and fields.json name different fields')

# ---------------------------------------------------------------------------
# The prompts, rendered from the engine's own inputs, one fragment per input.
# gen_golive.py checks every fragment is in the shipped prompt with strpos.
# ---------------------------------------------------------------------------
C_, R_, V_, S_, P_, Q_ = OK['condensate'], OK['riser'], OK['vent'], OK['spill'], OK['plume'], OK['reach']
TH, TX, NH = PE['thermal'], PE['toxic'], PE['ammonia']
FRAG = {
    'beginner': [
        'OKAN, a gas and condensate platform, on a loss of containment day. The properties below are '
        'illustrative, chosen for this exercise. Every pressure is absolute, and ambient is 101325 Pa.',
        f"CONDENSATE: a hole of {n(C_['holeDiameterM'])} m diameter in the stabiliser bottoms line, discharge "
        f"coefficient {n(C_['dischargeCoefficient'])}, condensate density {n(C_['liquidDensityKgM3'])} kg/m3, "
        f"{n(C_['liquidHeadM'])} m of liquid above the hole and {n(C_['pressureAboveLiquidPa'])} Pa above the liquid.",
        f"RISER: a hole of {n(R_['holeDiameterM'])} m diameter in the gas riser, discharge coefficient "
        f"{n(R_['dischargeCoefficient'])}, gas at {n(R_['upstreamPressurePa'])} Pa and {n(R_['upstreamTemperatureK'])} K, "
        f"molar mass {n(R_['molarMassKgMol'])} kg/mol, heat capacity ratio {n(R_['heatCapacityRatio'])}.",
        f"VENT: the flash gas vent, the same gas through a hole of the same {n(V_['holeDiameterM'])} m and the same "
        f"discharge coefficient {n(V_['dischargeCoefficient'])}, at {n(V_['upstreamPressurePa'])} Pa and "
        f"{n(V_['upstreamTemperatureK'])} K, molar mass {n(V_['molarMassKgMol'])} kg/mol, heat capacity ratio "
        f"{n(V_['heatCapacityRatio'])}.",
        f"DECK SPILL: {n(S_['spillVolumeM3'])} m3 spilled on an open deck with no bund, spreading to a stated "
        f"thickness of {n(S_['poolThicknessM'])} m.",
        f"PLUME: a sustained release of hydrogen sulphide (molar mass {n(P_['molarMassGMol'])} g/mol) at "
        f"{n(P_['massRateKgS'])} kg/s from a vent stack {n(P_['releaseHeightM'])} m high, in a {n(P_['windSpeedMS'])} m/s "
        f"wind, Pasquill-Gifford class {P_['stabilityClass']}, Briggs rural sigmas. The receptor is "
        f"{n(P_['downwindDistanceM'])} m downwind, {n(P_['crosswindDistanceM'])} m off the centreline and "
        f"{n(P_['receptorHeightM'])} m above the ground; convert at 25 C and 101325 Pa.",
        f"REACH: the same {n(Q_['massRateKgS'])} kg/s release from the same {n(Q_['releaseHeightM'])} m stack in the "
        f"same {n(Q_['windSpeedMS'])} m/s wind at night, class {Q_['stabilityClass']}, read on the centreline "
        f"{n(Q_['receptorHeightM'])} m above the ground, against a stated concentration of "
        f"{n(Q_['targetConcentrationMgM3'])} mg/m3.",
    ],
    'intermediate': [
        'YOKRI, a bund fire in a tank farm on a windy afternoon, worked through the solid flame model. The '
        'properties below are illustrative, chosen for this exercise.',
        f"THE POOL: {n(YK['poolDiameterM'])} m diameter, {YK['fuel']}, its burning flux from the Babrauskas table "
        f"the engine carries; heat of combustion {n(YK['heatOfCombustionJKg'])} J/kg.",
        f"THE AIR: wind at 10 m {n(YK['windSpeed10mMS'])} m/s, air density {n(YK['airDensityKgM3'])} kg/m3, air "
        f"kinematic viscosity {n(YK['airKinematicViscosityM2S'])} m2/s. Take the flame length by Thomas with wind and "
        'the tilt from the wind, the flame base radius half the pool diameter.',
        f"THE FLAME SURFACE: compute the surface emissive power two ways, from the diameter (Mudan) and from a "
        f"radiative fraction of {n(YK['radiativeFraction'])} with a soot fraction of {n(YK['sootFraction'])} and the "
        'engine\'s default soot emissive power; the heat flux uses the second.',
        f"THE TARGET: at ground level {n(YK['targetDistanceFromCentreM'])} m downwind of the pool centre, the flame "
        f"leaning toward it, with a stated atmospheric transmissivity of {n(YK['transmissivity'])}.",
    ],
    'advanced': [
        'PENNINGTON, a storage terminal, and the harm a vapour cloud explosion, a fire and two toxic releases '
        'do to the people nearby. The properties below are illustrative, chosen for this exercise. Ambient is '
        '101325 Pa.',
        f"BLAST: the cloud is stated as {n(PE['tntMassKg'])} kg of TNT, a free air burst, Kinney and Graham. The "
        f"control room is {n(PE['distanceM'])} m away. Find also the distance at which the peak side-on "
        f"overpressure is {n(PE['targetOverpressurePa'])} Pa. A workshop takes {n(PE['buildingOverpressurePa'])} Pa; "
        'use the HSC overpressure fatality probit.',
        f"FIRE: a heat flux of {n(TH['heatFluxWM2'])} W/m2 for {n(TH['exposureTimeS'])} s, the {TH['coefficients']} "
        'thermal probit.',
        f"CHLORINE: {n(TX['concentrationPpm'])} ppm for {n(TX['exposureMinutes'])} minutes, the {TX['coefficients']} "
        'toxic probit.',
        f"AMMONIA: {n(NH['concentrationMgM3'])} mg/m3 for {n(NH['exposureMinutes'])} minutes, the {NH['coefficients']} "
        f"toxic probit, molar mass {n(NH['molarMassGMol'])} g/mol, the air at {n(NH['temperatureK'])} K and 101325 Pa.",
    ],
}

ASK = {
    'beginner': (
        ' Report six values: the condensate line mass rate, the gas riser mass rate and the flash gas vent mass '
        'rate, each in kg/s; the deck spill pool equivalent diameter in m; the concentration at the receptor in '
        'ppm; and the far distance, beyond the peak, at which the night plume meets the stated concentration, in '
        'm. Every value to six decimals.'),
    'intermediate': (
        ' Report six values: the flame length with wind in m; the flame tilt from the vertical in degrees; the '
        'surface emissive power from the diameter and the surface emissive power from the radiative fraction '
        'with soot, each in W/m2; the maximum view factor at the target; and the heat flux at the target in W/m2. '
        'The view factor to twelve decimals, every other value to six decimals.'),
    'advanced': (
        ' Report six values: the peak side-on overpressure at the control room in Pa; the distance at which the '
        'stated overpressure is reached, in m; the overpressure fatality probability in the workshop; the thermal '
        'lethality probability; the chlorine lethality probability; and the ammonia lethality probability. Every '
        'value to six decimals.'),
}
PROMPTS = {t: ' '.join(FRAG[t]) + ASK[t] for t in TIERS}

TIER = {
    'beginner': ('associate', 'OKAN, a gas and condensate platform loss of containment day',
                 'How much gets out, and where it goes', PROMPTS['beginner']),
    'intermediate': ('professional', 'YOKRI, a tank farm bund fire on a windy afternoon',
                     'What the fire radiates, step by step', PROMPTS['intermediate']),
    'advanced': ('expert', 'PENNINGTON, a storage terminal and the harm three hazards do',
                 'Who is hurt, and with what probability', PROMPTS['advanced']),
}

HEADER = """-- ============================================================================
-- H4: Consequence Modelling joins the catalogue, the FOURTH course of the HSE
-- module.
--
-- Catalogue row (module 'hse'; path_order 64, directly above H3 lopa at 63;
-- prereq_slug NULL, the carried-over answer "no hard prerequisite inside a
-- module"; school left at its default, as every HSE course leaves it) plus the
-- three capstones and their eighteen graded fields, generated by
-- tools/course-waves/consequence/gen_course.py from the ENGINE'S OWN RUN
-- (h4_capstone.mjs through the vendored engines/hse/consequence.js), which it
-- refuses to write unless fields.json carries exactly that run's values and the
-- tolerance gradedTolerance.js derives. Deep seeds are three separate
-- migrations; the go-live is a fifth and is HELD until a NextGen production
-- upload carries the route /dashboard/apps/consequence, because the 78 lessons,
-- the teaching lab (consequenceLab.js) and its three explorer panels ship in the
-- zip and not in this database.
--
-- THE ONE SENTENCE THE COURSE IS. A consequence model turns a loss of
-- containment into physical effects, so the course teaches how much gets out
-- and where it goes (Associate), what a pool fire radiates (Professional) and
-- who is hurt by a fire, a blast or a toxic cloud, with what the engine does not
-- model (Expert), and grades each tier on its own question with numbers the
-- engine returns.
--
-- THE ENGINE. engines/hse/consequence.js, vendored sha-identical with
-- petrolord-engines 16fd6c9. Every input carries its unit in its name; every
-- result carries its model and source or a refusal naming its field; choked at
-- or below the critical pressure ratio; no spreading model; the plume reflects
-- at the ground; the solid flame of radius D/2 with the overhang refused;
-- Kinney and Graham over a judged range; every probit preset named by source.
--
-- WHAT IS GRADED. OKAN (Associate) grades three outflows, a pool diameter, a
-- plume concentration and a distance to a concentration; YOKRI (Professional)
-- grades the solid flame chain to a heat flux with a stated transmissivity;
-- PENNINGTON (Expert) grades a blast forward and inverse and four
-- probabilities, each on a preset an independent published check stands
-- behind. No single route quantity, no inverse of the normal CDF and no point
-- source heat radiation is graded.
--
-- All eighteen graded values were swept against every number the digest
-- prints and against every number handed to a learner in a prompt, at each
-- field's own shipped tolerance: 0 collisions, and 0 pairwise. No prompt
-- states another tier's graded value.
-- ============================================================================"""

lines = [HEADER, '',
         'insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)',
         f"values ({q(SLUG)}, {q(NAME)}, {q(MODULE)}, {PATH_ORDER}, 'coming_soon', null)",
         'on conflict (slug) do nothing;',
         '',
         'insert into public.academy_capstones',
         '    (app_slug, tier, cert_tier, dataset, title, prompt, fields)',
         'values']
blocks = []
for tier in TIERS:
    cert, dataset, title, prompt = TIER[tier]
    fl = [f for f in fields if f[0] == tier]
    if len(fl) != 6:
        bad.append(f'{tier} has {len(fl)} fields')
    objs = ',\n'.join(
        f"    jsonb_build_object('key',{q(k)}, 'label',{q(LABELS[k][0])},"
        f" 'unit',{q(LABELS[k][1])}, 'expected',{repr(v)}, 'tol',{repr(tol)})"
        for _t, k, v, tol in fl)
    blocks.append(f"(\n  {q(SLUG)}, {q(tier)}, {q(cert)},\n  {q(dataset)},\n"
                  f"  {q(title)},\n  {q(prompt)},\n  jsonb_build_array(\n{objs}\n  )\n)")
lines.append(',\n'.join(blocks))
lines.append('on conflict (app_slug, tier) do nothing;')
SQL = '\n'.join(lines) + '\n'

# --------------------------------------------------------------- self checks
odd = [ln for ln, l in enumerate(SQL.splitlines(), 1)
       if not l.lstrip().startswith('--') and l.split('--', 1)[0].count("'") % 2]
if odd:
    bad.append(f'odd-quote code lines {odd}')
for t in TIERS:
    for fr in FRAG[t]:
        if fr not in PROMPTS[t]:
            bad.append(f'{t}: a rendered fragment is missing from its own prompt')

# EVERY CONDITION THE ENGINE RAN IS STATED IN ITS OWN TIER'S PROMPT, as a learner
# reads it: every number (as a whole token), every name, and every IPL with its
# flag beside it.
NUMTOK = re.compile(r'(?<![\w.])\d+(?:\.\d+)?(?:e-\d+)?(?![\w.]*\d)')


def walk(obj, path=''):
    if isinstance(obj, dict):
        for k, v in obj.items():
            yield from walk(v, f'{path}.{k}')
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            yield from walk(v, f'{path}[{i}]')
    else:
        yield path, obj


INPUT_COUNT = 0
for tier, obj in (('beginner', OK), ('intermediate', YK), ('advanced', PE)):
    toks = set(NUMTOK.findall(PROMPTS[tier]))
    for path, v in walk(obj):
        INPUT_COUNT += 1
        if isinstance(v, bool):
            continue
        if isinstance(v, str):
            if v not in PROMPTS[tier]:
                bad.append(f'{tier} prompt does not state {path} = {v!r}, which the engine ran')
        elif n(v) not in toks:
            bad.append(f'{tier} prompt does not state {path} = {n(v)}, which the engine ran')

# THE VOCABULARY (digest section 32) AND THE COPY RULE, over every prompt,
# dataset, title and label a learner reads.
READ = [(f'{t} prompt', PROMPTS[t]) for t in TIERS] + \
       [(f'{t} dataset', TIER[t][1]) for t in TIERS] + [(f'{t} title', TIER[t][2]) for t in TIERS] + \
       [(f'{k} label', LABELS[k][0] + ' ' + LABELS[k][1]) for k in KEYS]


def vocabulary(label, text):
    out = []
    rules = [
        ('bare "flux"', r'(?<!heat )(?<!burning )(?<!evaporation )(?<!mass )\bflux(es)?\b'),
        ('bare "beta"', r'(?<!k )\bbeta\b'),
        ('bare "dose"', r'(?<!thermal )(?<!toxic )(?<!lethal )\bdoses?\b'),
        ('"severity"', r'\bseverity\b'),
        ('"likelihood"', r'\blikelihood\b'),
        ('bare "radiation"', r'(?<!heat )(?<!thermal )\bradiation\b'),
        ('a seam word', r'\bpoint source\b|\bsetbacks?\b|\bAPI 521\b|\bindividual risk\b|\bPLL\b|\bF-?N\b|\bALARP\b|\brisk matri|\bemissions?\b'),
    ]
    for name, rx in rules:
        if re.search(rx, text, re.I):
            out.append(f'{label} carries {name}')
    if re.search('[\u2013\u2014]', text):
        out.append(f'{label} carries an en or em dash')
    if re.search(r',\s+not\s+\w', text):
        out.append(f'{label} carries an "X, not Y" contrastive')
    return out


for label, text in READ:
    bad.extend(vocabulary(label, text))
# The guard must be able to fire: every rule is planted once and must be caught.
for plant, rule in (('the flux at the target', 'flux'), ('a beta of 0.1', 'beta'), ('the dose they took', 'dose'),
                    ('the severity of it', 'severity'), ('a likelihood score', 'likelihood'),
                    ('the radiation at the fence', 'radiation'), ('a point source estimate', 'seam'),
                    ('a band \u2014 pooled', 'dash'), ('the heat flux, not the view factor', 'contrastive')):
    if not vocabulary('plant', plant):
        bad.append(f'the vocabulary sweep does not catch a planted {rule}')
for clean in ('the heat flux and the burning flux', 'a k beta product', 'a thermal dose and a toxic load',
              'the heat radiation from the flame'):
    if vocabulary('clean', clean):
        bad.append(f'the vocabulary sweep fires on clean text: {clean!r}')

for tier in TIERS:
    if not PROMPTS[tier].count('Report six values') == 1:
        bad.append(f'{tier} prompt does not say "Report six values" exactly once')
    if 'illustrative' not in PROMPTS[tier]:
        bad.append(f'{tier} prompt carries properties and does not say they are illustrative')

# NUMBERS HANDED TO A LEARNER, every tier's prompt against every graded value
# of EVERY tier, at the shipped tolerance. A different tier is a leak; the same
# tier is a transcription. Exponent spellings are read as the numbers they are.
NUM = re.compile(r'\d+(?:\.\d+)?(?:e-\d+)?')
handed = [(t, float(tok)) for t in TIERS for tok in NUM.findall(PROMPTS[t].replace(',', ''))]
handed += [(t, float(tok)) for t in TIERS for tok in NUM.findall((TIER[t][1] + ' ' + TIER[t][2]).replace(',', ''))]
handed += [(TIER_OF[k], float(tok)) for k in KEYS for tok in NUM.findall(' '.join(LABELS[k]).replace(',', ''))]
for ftier, key, val, tol in fields:
    for htier, h in handed:
        if abs(abs(val) - h) <= tol:
            bad.append(f'{ftier}.{key} = {val} is within {tol} of {h}, handed in the {htier} capstone text')
for a in range(len(fields)):
    for b in range(a + 1, len(fields)):
        if abs(abs(fields[a][2]) - abs(fields[b][2])) <= max(fields[a][3], fields[b][3]):
            bad.append(f'pairwise: {fields[a][1]} and {fields[b][1]}')

# EVERY NUMBER THE DIGEST PRINTS. A graded field within its own tolerance of one
# of them is a lookup rather than a calculation.
DNUM = re.compile(r'\d+(?:\.\d+)?(?:[eE][-+]?\d+)?')
DIGEST_NUMS = sorted({float(tok) for tok in DNUM.findall(open(f'{W}/digest.txt', encoding='utf-8').read())})
if len(DIGEST_NUMS) < 300:
    bad.append(f'only {len(DIGEST_NUMS)} digest numbers were read, so the digest sweep is reading the wrong thing')
for ftier, key, val, tol in fields:
    for d in DIGEST_NUMS:
        if abs(abs(val) - d) <= tol:
            bad.append(f'{ftier}.{key} = {val} is within {tol} of {d}, which the digest prints')

# THE PROMPT MUST ASK FOR EXACTLY THE DECIMALS ITS FIELDS ARE GRADED TO.
WORD_N = {'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
          'eleven': 11, 'twelve': 12}
DP = {}
for tier in TIERS:
    asked = sorted({WORD_N[w] for w in re.findall(r'to (\w+) decimals', PROMPTS[tier]) if w in WORD_N})
    needed = set()
    for ftier, key, val, tol in fields:
        if ftier != tier:
            continue
        cls = [c for c, sp in precision.items() if re.search(sp['match'], key)]
        if len(cls) != 1:
            bad.append(f'{key} matches {len(cls)} precision classes, not exactly one')
            continue
        dp = precision[cls[0]]['decimals']
        DP[key] = dp
        needed.add(dp)
        if tol < 0.5 * 10 ** -dp * (1 - 1e-12):
            bad.append(f'{tier}.{key} is graded at {tol}, below the half unit of the {dp} decimals its class prints')
    if asked != sorted(needed):
        bad.append(f'{tier} prompt asks for {asked} decimals and its fields are graded to {sorted(needed)}')

RENDERED = SQL

if __name__ == '__main__':
    if bad:
        for b in bad:
            print('  REFUSED:', b)
        print('NOTHING WRITTEN.')
        sys.exit(1)
    open(OUT, 'w').write(SQL)
    print(f'wrote {OUT}: {len(SQL.splitlines())} lines, 3 capstones, {len(fields)} fields')
    print(f'engine run: 18 of 18 fields.json values equal what h4_capstone.mjs returned through {ENGINES}, '
          'and every tolerance is the one gradedTolerance.js derives')
    print('prompt lengths:', {t: len(PROMPTS[t]) for t in TIERS})
    print(f'engine conditions found in their own prompts: {INPUT_COUNT} inputs (numbers, names and flags)')
    print(f'digest numbers swept: {len(DIGEST_NUMS)} | numbers handed in the capstone text: {len(handed)}')
    print('handed + pairwise + digest collisions + precision + vocabulary + copy rule: 0')
