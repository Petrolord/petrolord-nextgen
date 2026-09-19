#!/usr/bin/env python3
"""Generate the gasvalue course + capstone migration from fields.json,
precision.json and capstone.json, so no expected value, tolerance, condition
or prompt is retyped.

Modelled on tools/course-waves/supply/gen_course.py (MD3, NextGen #165, applied
live 2026-09-19) and crude's (#167), with the differences this wave forces:

1. THE PROMPTS ARE capstone.json's, VERBATIM, and they are RE-RENDERED HERE.
   gasvalue_capstone.mjs writes the three prompts out of the capstone records
   in gasvalue_fields_capstone.mjs into capstone.json, and every capstone gate
   on this wave (promptleak, capstone leak, copy rule) ran on exactly that text.
   This generator types no prompt: it imports gasvalue_capstone.mjs, which
   renders PROMPTS from the records again through the vendored engines, and
   refuses unless the rendering equals capstone.json byte for byte. The records
   the go-live's second route reads are that same import's records, with each
   gas row carried with the engine reference figures the prompt prints, so the
   route cannot be computed over a figure the learner never saw. A prompt that
   carries a newline, does not ask for six numbers, does not say its figures
   are invented, or does not state the precision each field is graded at, is
   refused.

2. EVERY GRADED FIELD IS A FLOAT, AND ITS TOLERANCE COMES FROM precision.json,
   never from a literal here. The grader (academy_submit_capstone) casts
   expected, tol and answer to numeric and accepts |answer - expected| <= tol.
   A class of N decimals is graded at ONE UNIT in its last place, 10^-N, with
   ONE declared exception, which is the wave's own ruling and not this file's:
   TONNES A YEAR OF A FLARE OR AN ABATEMENT are printed to three decimals and
   graded at TEN units, 0.01 t, because the engine's LB_PER_KG = 2.20462262 is
   the exact pound's reciprocal to nine figures only and on a flare of
   300,000 t a year the oracle and the engine part by up to about 1.1e-3 t
   (wave.json grading.tolerance; CLASSES in gasvalue_capstone.mjs). No class
   of 0 decimals exists on this wave: no count is graded. fields.json must carry
   exactly that tolerance for every field (anything else is refused), and a
   tolerance tighter than half a unit in the declared place is refused as well,
   because that is the rule the kit's gradeprecision.py enforces: a tolerance
   below it grades a correctly read figure wrong. The whole-number and 0.5 logic
   of the compliance ladder is gone.

3. THE ENGINE IS RUN HERE, not remembered, and it is run TWICE. `node
   gasvalue_capstone.mjs --json` re-derives all eighteen values through the
   vendored engines, once on the machine clock and once under the wave's
   fakeclock.mjs with the clock moved 900 days, and the two runs must be
   byte-identical (neither engine on this path reads a clock; gate_clock.sh
   proves the source half and names the one off-path read in
   modularRefinery.feasibilityEconomics, which nothing here calls).
   fields.json must equal the run field for field, at full precision. No as-of
   date: these engines read no date, and no prompt states one.

4. THE COLLISION AND LEAK SWEEPS ARE THIS WAVE'S OWN, mirrored from its gates:
   gate_collisions.py (no graded value within its tolerance of the absolute
   value of ANY number token the digest prints, and no two graded values within
   the looser of their tolerances) and gate_promptleak.py, IMPORTED rather than
   restated: its sweep() runs on the three prompts, and its DERIVED and
   INTEGERS (every engine-derived intermediate on the way to a graded field, and
   the two derived counts) are read from it. Its rule: no decimal token that is
   a rounding of any graded value of any tier or of any intermediate, and no
   whole-number token equal to a derived count. On top of it, as the supply
   ladder does, no token within a graded field's own tolerance of its value.
   The labels, datasets and titles this generator writes are held to the same
   sweep, because a learner reads them beside the prompt.

Usage: python3 gen_course.py
   GV_WAVE        the wave directory (default /root/et-wip-gasvalue)
   GV_REPO        the nextgen clone   (default /root/wt-et-gasvalue-nextgen)
   GV_ENGINES     packages/engines to run the capstone through
                  (default $GV_REPO/packages/engines)
   GV_COURSE_OUT  where to write      (default $GV_REPO/migrations/...)
"""
import importlib.util
import json
import os
import re
import subprocess
import sys

W = os.environ.get('GV_WAVE', '/root/et-wip-gasvalue')
REPO = os.environ.get('GV_REPO', '/root/wt-et-gasvalue-nextgen')
ENGINES = os.environ.get('GV_ENGINES', f'{REPO}/packages/engines')
OUT = os.environ.get('GV_COURSE_OUT', f'{REPO}/migrations/20261013_gv_gasvalue_course.sql')
SLUG, NAME, MODULE, PATH_ORDER, PREFIX = 'gasvalue', 'Flare Gas to Value & LPG/CNG', 'energy_transition', 51, 'gv'
# The Energy Transition sibling cut in the same wave, in the same module.
SIBLINGS = (('carbon', 52),)
# The Commercial & Trading and Supply Chain courses live since 2026-09-19,
# whose slots sit directly below this one.
LIVE_NEIGHBOURS = (('crude', 48), ('refinery', 49), ('supply', 50))
TIERS = ('beginner', 'intermediate', 'advanced')

fields = json.load(open(f'{W}/fields.json'))
precision = json.load(open(f'{W}/precision.json'))
capstone = json.load(open(f'{W}/capstone.json'))
wave = json.load(open(f'{W}/wave.json'))
PROMPTS = {t: capstone['tiers'][t]['prompt'] for t in TIERS}
bad = []

# Every node child reads the engines from ET_ENGINES (the wave's convention).
os.environ['ET_ENGINES'] = ENGINES
ENV = {**os.environ, 'ET_ENGINES': ENGINES, 'TZ': 'UTC'}


def q(s):
    return "'" + s.replace("'", "''") + "'"


def run(args, env=None, what='the engine run'):
    r = subprocess.run(args, capture_output=True, text=True, cwd=W, env=env or ENV)
    if r.returncode != 0:
        sys.exit(f'REFUSED: {what} failed: ' + r.stderr[-800:])
    return r.stdout


# ---------------------------------------------------------------------------
# THE ENGINE RUN, twice: the machine clock, then a clock moved 900 days.
# Byte-identical or refused.
# ---------------------------------------------------------------------------
_plain = run(['node', os.path.join(W, 'gasvalue_capstone.mjs'), '--json'])
_moved = run(['node', '--import', os.path.join(W, 'fakeclock.mjs'), os.path.join(W, 'gasvalue_capstone.mjs'), '--json'],
             env={**ENV, 'FAKE_CLOCK_DAYS': '900'}, what='the engine run under the fake clock')
if _plain != _moved:
    bad.append('the engine run moved when the clock moved 900 days')
_run = json.loads(_plain)
ENGINE = {f['key']: f['value'] for f in _run}
ENGINE_TOL = {f['key']: f['tol'] for f in _run}

# gate_promptleak.py, imported: its DERIVED intermediates, its INTEGERS and
# its sweep() are the leak rule, so the generator cannot drift from the gate.
_spec = importlib.util.spec_from_file_location('gv_promptleak', os.path.join(W, 'gate_promptleak.py'))
GP = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(GP)
DERIVED = {name: v for name, v in GP.DERIVED}
INTEGERS = {name: v for name, v in GP.INTEGERS}
if len(DERIVED) != len(GP.DERIVED):
    bad.append('gate_promptleak.py names two intermediates alike, so a leak could be reported under the wrong name')

# The records and the prompts, rendered again from the same import. Each gas
# row is carried with the engine reference figures the prompt prints for it
# (components() in gasvalue_capstone.mjs), and the handful of engine constants
# the prompts print are carried by name, so the go-live's second route reads
# exactly the figures a learner reads.
_side = json.loads(run(['node', '--input-type=module', '-e', """
const C = await import(%(caps)s);
const K = await import(%(recs)s);
const E = process.env.ET_ENGINES;
const F = await import(E + '/engines/downstream/flareToValue.js');
const L = await import(E + '/engines/downstream/lpgCng.js');
const M = await import(E + '/engines/downstream/modularRefinery.js');
const records = {};
for (const [k, v] of Object.entries(K)) if (typeof v !== 'function' && k !== 'FIELD_SOURCES') records[k] = v;
records.ERIEMU_COMPONENTS = C.components(K.ERIEMU_GAS);
records.ADIBAWA_COMPONENTS = C.components(K.ADIBAWA_GAS);
records.CONSTANTS = {
  scfPerLbmol: F.SCF_PER_LBMOL, lbPerKg: F.LB_PER_KG,
  co2MolarMass: C.flareMolarMass('CO2'), ch4MolarMass: C.flareMolarMass('C1'),
  modularExponent: M.SCALING_EXPONENT.MODULAR, waterKgM3: L.WATER_KG_M3,
};
console.log(JSON.stringify({ prompts: C.PROMPTS, records }));
""" % {'caps': json.dumps(os.path.join(W, 'gasvalue_capstone.mjs')),
       'recs': json.dumps(os.path.join(W, 'gasvalue_fields_capstone.mjs'))}], what='the record export'))
RECORDS = _side['records']
for t in TIERS:
    if _side['prompts'][t] != PROMPTS[t]:
        bad.append(f'the {t} prompt gasvalue_capstone.mjs renders from the records is not capstone.json\'s')

KEYS = [k for _t, k, _v, _tol in fields]
TIER_OF = {k: t for t, k, _v, _tol in fields}
F = {k: v for _t, k, v, _tol in fields}
TOL = {k: tol for _t, k, _v, tol in fields}
if set(ENGINE) != set(KEYS) or len(KEYS) != 18:
    bad.append(f'the engine run and fields.json name different fields: {sorted(set(ENGINE) ^ set(KEYS))}')
for k in KEYS:
    if ENGINE.get(k) != F[k]:
        bad.append(f'{k}: fields.json says {F[k]!r} and the engine returns {ENGINE.get(k)!r}')
    if ENGINE_TOL.get(k) != TOL[k]:
        bad.append(f'{k}: fields.json grades at {TOL[k]!r} and the capstone generator at {ENGINE_TOL.get(k)!r}')
for t in TIERS:
    if [f['key'] for f in capstone['tiers'][t]['fields']] != [k for tt, k, _v, _tol in fields if tt == t]:
        bad.append(f'capstone.json and fields.json list the {t} fields differently')

# ---------------------------------------------------------------------------
# PRECISION. Every field matches exactly one class of precision.json; its
# tolerance is one unit in that class's last place, except the tonnes class,
# which the wave rules at ten units (TEN_UNIT_CLASSES), and never tighter than
# half a unit there (gradeprecision.py's rule).
# ---------------------------------------------------------------------------
TEN_UNIT_CLASSES = {'tonnes'}
if wave['grading']['tolerance'].find('0.01 t (ten units)') < 0:
    bad.append('wave.json no longer rules the tonnes at ten units, and this generator still grades them there')
CLASS_OF, DECIMALS, WANT_TOL = {}, {}, {}
for ft, k, v, tol in fields:
    cls = [c for c, sp in precision.items() if re.search(sp['match'], k)]
    if len(cls) != 1:
        bad.append(f'{k} matches {len(cls)} precision classes, not exactly one')
        continue
    dec = precision[cls[0]]['decimals']
    if dec == 0:
        bad.append(f'{k} is in a class of 0 decimals, and this wave grades no count')
        continue
    units = 10 if cls[0] in TEN_UNIT_CLASSES else 1
    want = float(f'{units}e-{dec}') if units == 1 else float(f'1e-{dec - 1}')
    CLASS_OF[k], DECIMALS[k], WANT_TOL[k] = cls[0], dec, want
    if isinstance(tol, bool) or not isinstance(tol, (int, float)) or tol != want:
        bad.append(f'{k} is graded at {tol!r}, and precision.json class {cls[0]} ({dec} decimals, {units} unit(s)) grades it at {want!r}')
    if tol < 0.5 * 10 ** -dec:
        bad.append(f'{k} is graded at {tol!r}, tighter than half a unit in its declared place ({dec} decimals): '
                   'gradeprecision.py refuses it')
    if isinstance(v, bool) or not isinstance(v, (int, float)) or v != v or v in (float('inf'), float('-inf')):
        bad.append(f'{k} = {v!r} is not a finite number, and the grader compares numbers')
for cls, sp in precision.items():
    if not any(CLASS_OF.get(k) == cls for k in KEYS):
        bad.append(f'precision.json class {cls} matches no graded field')

# ---------------------------------------------------------------------------
# The eighteen graded fields. Each label names the record and the quantity,
# never the answer. Units are what the number counts.
# ---------------------------------------------------------------------------
LABELS = {
    ('beginner', 'eriemu_ghv_btu_scf'): ('Gross heating value of the gas', 'Btu/scf'),
    ('beginner', 'eriemu_gpm_c3plus'): ('Liquids content, propane and heavier', 'gal/Mscf'),
    ('beginner', 'eriemu_c3plus_kg_per_mscf'): ('Mass of propane and heavier in one Mscf', 'kg/Mscf'),
    ('beginner', 'eriemu_flare_co2_t'): ('Flare CO2 a year', 'tonnes a year'),
    ('beginner', 'eriemu_flare_ch4_t'): ('Flare methane a year', 'tonnes a year'),
    ('beginner', 'eriemu_flare_co2e_t'): ('Flare CO2e a year', 'tonnes a year'),
    ('intermediate', 'adibawa_capital_usd'): ('Capital cost of the CNG plant', 'USD'),
    ('intermediate', 'adibawa_cng_kg_per_year'): ('CNG made a year', 'kg a year'),
    ('intermediate', 'adibawa_value_per_mscf'): ('Gross margin per Mscf of the parcel', 'USD per Mscf'),
    ('intermediate', 'adibawa_avoided_co2e_t'): ('Flare CO2e the plant avoids', 'tonnes a year'),
    ('intermediate', 'adibawa_net_abatement_t'): ('Net abatement against the declared counterfactual', 'tonnes a year'),
    ('intermediate', 'adibawa_breakeven_credit_usd_per_t'): ('Credit price at which the route just clears the hurdle', 'USD per tonne'),
    ('advanced', 'asaba_usable_lpg_t'): ('Usable LPG in the vessel', 'tonnes'),
    ('advanced', 'asaba_vaporizer_design_kw'): ('Design duty of the vaporizer', 'kW'),
    ('advanced', 'asaba_carousel_wait_min'): ('Average wait of a cylinder for a position', 'minutes'),
    ('advanced', 'asaba_bank_mass_kg'): ('Gas in the storage bank', 'kg'),
    ('advanced', 'asaba_left_in_banks_kg'): ('Gas left in the cascade when the next taxi cannot be filled', 'kg'),
    ('advanced', 'asaba_payback_years'): ('Simple payback of the taxi conversion, undiscounted', 'years'),
}
assert set(LABELS) == {(f[0], f[1]) for f in fields}, 'labels and fields.json disagree'
assert len({k for _t, k in LABELS}) == 18, 'gasvalue field keys are meant to be globally unique'

TIER = {
    'beginner': (
        'associate',
        'ERIEMU, a flow station of an invented operator flaring its associated gas: the laboratory sheet and the flare study',
        'The gas by the mole and the flare by the rule'),
    'intermediate': (
        'professional',
        'ADIBAWA, an invented flared parcel bid as CNG: the plant, its year, the counterfactual and the credit test',
        'The route, the recovered share and the credit'),
    'advanced': (
        'expert',
        'ASABA, an invented energy hub where an LPG depot and a CNG station share a site',
        'The vessel, the carousel, the cascade and the taxi'),
}

HEADER = """-- ============================================================================
-- gasvalue: Flare Gas to Value & LPG/CNG joins the catalogue, the FIRST course
-- of the Energy Transition module.
--
-- Catalogue row (module 'energy_transition', the academy module the lead ruled
-- for the two Energy Transition courses; path_order 51, directly above the three
-- Commercial & Trading and Supply Chain courses live since 2026-09-19, crude at
-- 48, refinery at 49 and supply at 50, and directly below its wave sibling
-- carbon at 52; prereq_slug NULL, the carried-over answer "no hard prerequisite
-- inside a module"; school left at its default, as every Facilities, Economics,
-- Assurance and Commercial & Trading course leaves it, so the fees are the
-- published school-level rows) plus the three capstones and their eighteen
-- graded fields, generated by tools/course-waves/gasvalue/gen_course.py from
-- fields.json, precision.json and capstone.json, which gasvalue_capstone.mjs
-- writes from the capstone records in gasvalue_fields_capstone.mjs through the
-- vendored engines. The three tier structures (78 lesson keys) and the 396
-- questions are the three deep seeds; the go-live is a fifth migration and is
-- HELD until a NextGen production upload carries the route
-- /dashboard/apps/gasvalue AND the Suite production upload carrying Suite main
-- 06aef5d63 (Suite #543 MD5-0, #545 MD4-0, #546 MD45-1: the Flare Gas to Value
-- and LPG & CNG Rollout page repairs this course teaches) is live. This file
-- does not depend on carbon: either may be seeded first.
--
-- THE ONE SENTENCE THE COURSE IS. A flare is a measured gas before it is an
-- emission or a product: its heating value, its liquids and its carbon come
-- from the analysis by the mole, the flare's CO2 and methane follow the rule's
-- two efficiencies, a route is credited only for the share it recovers against
-- a declared counterfactual, and the LPG vessel, the vaporizer, the carousel,
-- the CNG bank and the cascade are each sized on the basis the engine states.
--
-- THE ENGINES. engines/downstream/flareToValue.js and lpgCng.js (with
-- scaleCapex and SCALING_EXPONENT from modularRefinery.js), vendored
-- sha-identical with engines df31f53 (MD45-1, after MD4-0 and MD5-0); the recon
-- findings on the graded paths were repaired upstream in MD4-0 and MD45-1.
--
-- EVERY GRADED FIELD IS A NUMBER THE ENGINE RETURNS, at full precision, graded
-- at ONE UNIT IN THE LAST PLACE THE PROMPT ASKS FOR: the heating value, the
-- liquids, the C3+ mass, the CNG a year, the margin per Mscf, the breakeven
-- credit price, the usable LPG, the vaporizer duty, the carousel wait, the bank
-- mass and the payback to four decimals at 0.0001; the capital cost to two at
-- 0.01 dollars; the gas left in the cascade to three at 0.001 kg. THE ONE
-- EXCEPTION: tonnes a year of a flare or an abatement are asked to three
-- decimals and graded at 0.01 t, ten units, because the engine's LB_PER_KG is
-- the exact pound's reciprocal to nine figures only and on a flare of 300,000
-- t a year the oracle and the engine part by up to about 1.1e-3 t. The grader
-- (academy_submit_capstone) casts expected, tol and answer to numeric and
-- accepts |answer - expected| <= tol. No verdict, basis word, richness band,
-- refusal or count is graded. No field reads a date or a clock.
--
-- THE PROMPTS are capstone.json's, verbatim: every condition a field needs and
-- the precision it is graded at, and nothing that hands over an answer. No
-- graded value of any tier is printed in any prompt as its own rounding or
-- within its tolerance, none of the engine-derived intermediates (the
-- normalised fractions, the carbon per mole, the scf a year, the margin, the
-- blend's density and latent heat, the arrival rate, the absolute pressures,
-- Z, the kg per fill, the derived CNG consumption) is printed as its own
-- rounding, and neither derived count (the positions wholly working, the fills
-- before recharge) is printed as a whole number. No graded value is within its
-- tolerance of any number the teaching digest prints, and no two graded values
-- are within the looser of their tolerances.
-- ============================================================================"""


def num_lit(x):
    """A graded number as the SQL/JSON literal the grader reads, full precision."""
    if isinstance(x, int):
        return str(x)
    return repr(float(x))


lines = [HEADER, '',
         "insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)",
         f"values ({q(SLUG)}, {q(NAME)}, {q(MODULE)}, {PATH_ORDER}, 'coming_soon', null)",
         'on conflict (slug) do nothing;',
         '',
         'insert into public.academy_capstones',
         '    (app_slug, tier, cert_tier, dataset, title, prompt, fields)',
         'values']
blocks = []
for tier in TIERS:
    cert, dataset, title = TIER[tier]
    prompt = PROMPTS[tier]
    fl = [f for f in fields if f[0] == tier]
    if len(fl) != 6:
        bad.append(f'{tier} has {len(fl)} fields')
    if '\n' in prompt:
        bad.append(f'the {tier} prompt carries a newline')
    if 'Give six numbers.' not in prompt:
        bad.append(f'the {tier} prompt does not ask for six numbers')
    if 'Every figure is invented and illustrative.' not in prompt:
        bad.append(f'the {tier} prompt does not say its figures are invented')
    objs = ',\n'.join(
        f"    jsonb_build_object('key',{q(k)}, 'label',{q(LABELS[(t, k)][0])},"
        f" 'unit',{q(LABELS[(t, k)][1])}, 'expected',{num_lit(v)}, 'tol',{num_lit(tol)})"
        for t, k, v, tol in fl)
    blocks.append(f"(\n  {q(SLUG)}, {q(tier)}, {q(cert)},\n  {q(dataset)},\n"
                  f"  {q(title)},\n  {q(prompt)},\n  jsonb_build_array(\n{objs}\n  )\n)")
lines.append(',\n'.join(blocks))
lines.append('on conflict (app_slug, tier) do nothing;')
sql = '\n'.join(lines) + '\n'

# --------------------------------------------------------------- self checks
code = '\n'.join(l for l in sql.splitlines() if not l.lstrip().startswith('--'))
unclosed = code.replace("''", '').count("'") % 2
dashes = len(re.findall('[–—]', sql))

# 0. THE PROMPT STATES THE PRECISION OF EVERY FIELD. The answer list is
#    "(1) ... (6) ..."; field n's own item must say "to D decimals", or a
#    closing sentence "Quote (a) to (b) to D decimals and (c) to (d) to E."
#    must cover n with the field's D.
for tier in TIERS:
    tail = PROMPTS[tier].partition('Give six numbers.')[2]
    body, _, quote = tail.partition(' Quote ')
    items = dict(re.findall(r'\((\d)\) ([^()]*?)(?= \(\d\)|$)', body))
    if sorted(items) != ['1', '2', '3', '4', '5', '6']:
        bad.append(f'the {tier} prompt does not list six numbered answers: {sorted(items)}')
        continue
    ranges = [(int(a), int(b), int(d)) for a, b, d in re.findall(r'\((\d)\) to \((\d)\) to (\d+)', quote)]
    for n, (_t, k, _v, _tol) in enumerate([f for f in fields if f[0] == tier], 1):
        dec = DECIMALS.get(k)
        stated = {int(d) for d in re.findall(r'to (\d+) decimals', items[str(n)])}
        stated |= {d for a, b, d in ranges if a <= n <= b}
        if stated != {dec}:
            bad.append(f'the {tier} prompt states {sorted(stated) or "no"} decimals for {k} (item {n}), '
                       f'and precision.json asks for {dec}')

# 1. THE PROMPTS (gate_promptleak.py, imported). Its sweep on the prompts, and
#    the same rule on the datasets, titles and labels, plus supply's rule that
#    no token lies within a graded field's own tolerance of its value.
PNUM = GP.NUM
# The token regex the go-live's SQL sweep uses, which Postgres can read. Both
# must see the same number of tokens in the prompts.
SQLNUM_SRC = r'(?:^|[^A-Za-z0-9_.])(-?[0-9]+(?:\.[0-9]+)?)(?![A-Za-z0-9_])'
SQLNUM = re.compile(SQLNUM_SRC)


def leaks(text, where):
    out, _ = GP.sweep({where: text}, fields)
    for tok in PNUM.findall(text):
        for _t, k, v, tol in fields:
            if abs(abs(float(tok)) - abs(v)) <= tol:
                out.append(f'{where} prints {tok}, within tolerance of the graded value of {k}')
    return out


prompt_tokens = 0
sql_tokens = 0
for tier in TIERS:
    prompt_tokens += len(PNUM.findall(PROMPTS[tier]))
    sql_tokens += len(SQLNUM.findall(PROMPTS[tier]))
    bad.extend(leaks(PROMPTS[tier], f'the {tier} prompt'))
    for text in (TIER[tier][1], TIER[tier][2]) + tuple(LABELS[(t, k)][0] for t, k in LABELS if t == tier):
        bad.extend(leaks(text, f'"{text}"'))
_gate_bad, _gate_tokens = GP.sweep(PROMPTS, fields)
if _gate_bad or _gate_tokens != prompt_tokens:
    bad.append(f'gate_promptleak.py\'s own sweep reads {_gate_tokens} tokens and {len(_gate_bad)} leaks')
if prompt_tokens != sql_tokens:
    bad.append(f'the SQL token regex reads {sql_tokens} prompt tokens and gate_promptleak.py\'s reads {prompt_tokens}')

# 2. THE DIGEST (gate_collisions.py): every token -?\d+\.?\d*, made absolute.
DNUM = re.compile(r'-?\d+\.?\d*')
digest_nums = set()
for tok in DNUM.findall(open(f'{W}/digest.txt', encoding='utf-8').read()):
    try:
        digest_nums.add(abs(float(tok)))
    except ValueError:
        pass
for ft, k, v, tol in fields:
    for d in digest_nums:
        if abs(abs(v) - d) <= tol:
            bad.append(f'{ft}.{k} = {v} is within {tol} of {d:g}, which the digest prints')

# 3. PAIRWISE.
for i in range(len(fields)):
    for j in range(i + 1, len(fields)):
        if abs(abs(fields[i][2]) - abs(fields[j][2])) <= max(fields[i][3], fields[j][3]):
            bad.append(f'pairwise: {fields[i][0]}.{fields[i][1]} and {fields[j][0]}.{fields[j][1]}')

# 4. THE COPY RULE on everything this generator wrote that a learner reads.
for tier in TIERS:
    for text in (TIER[tier][1], TIER[tier][2]) + tuple(LABELS[(t, k)][0] for t, k in LABELS if t == tier):
        if re.search(r',\s*not\b', text) or re.search('[–—]', text):
            bad.append(f'copy rule: "{text}"')

# 5. THE CATALOGUE ROW against wave.json, and the siblings' slots.
for what, got, want in (('slug', SLUG, wave['slug']), ('name', NAME, wave['name']),
                        ('module', MODULE, wave['module']), ('path_order', PATH_ORDER, wave['pathOrder']),
                        ('prerequisite', None, wave['prerequisite']),
                        ('prefix', PREFIX, wave['prefix']),
                        ('siblings', list(SIBLINGS), [(s['slug'], s['pathOrder']) for s in wave['siblings']])):
    if got != want:
        bad.append(f'catalogue {what}: {got!r} here and {want!r} in wave.json')
if any(s['module'] != MODULE for s in wave['siblings']):
    bad.append('a wave sibling sits in another module')

# The sweeps must be able to fire.
if prompt_tokens < 60 or len(digest_nums) < 200 or len(DERIVED) < 60 or len(INTEGERS) < 2:
    bad.append(f'the sweeps read {prompt_tokens} prompt tokens, {len(digest_nums)} digest numbers, '
               f'{len(DERIVED)} intermediates and {len(INTEGERS)} counts, so a sweep is reading the wrong thing')

if __name__ == '__main__':
    if bad or unclosed or dashes:
        print('REFUSED, nothing written:')
        for b in bad:
            print('  ', b)
        print('unclosed literal:', bool(unclosed), '| en/em dashes:', dashes)
        sys.exit(1)
    open(OUT, 'w').write(sql)
    print(f'wrote {OUT}: {len(sql.splitlines())} lines, 3 capstones, {len(fields)} fields')
    print('engine run: 18 of 18 fields.json values equal gasvalue_capstone.mjs --json through the vendored engines, '
          'byte-identical with the clock moved 900 days')
    print('tolerances: 18 of 18 are precision.json\'s (one unit in the last place; the five tonnes at ten units, '
          'the wave\'s ruling), none tighter than gradeprecision.py\'s half unit; every prompt states each field\'s precision')
    print('prompts: 3 of 3 re-rendered from the records equal capstone.json; lengths',
          {t: len(PROMPTS[t]) for t in TIERS})
    print(f'prompt number tokens swept: {prompt_tokens} | engine-derived intermediates: {len(DERIVED)} '
          f'| derived counts: {len(INTEGERS)} | digest numbers: {len(digest_nums)}')
    print('prompt + intermediate + count + digest + pairwise + precision + copy + catalogue refusals: 0')
