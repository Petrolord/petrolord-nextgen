#!/usr/bin/env python3
"""Generate the carbon course + capstone migration from fields.json,
precision.json and capstone.json, so no expected value, tolerance, condition
or prompt is retyped.

Modelled on tools/course-waves/supply/gen_course.py (MD3, NextGen #165, applied
live 2026-09-19) and crude's (#167), with the differences this wave forces:

1. THE PROMPTS ARE capstone.json's, VERBATIM, and they are RE-RENDERED HERE.
   carbon_capstone.mjs writes the three prompts out of the capstone records in
   carbon_fields_capstone.mjs into capstone.json, and every capstone gate on
   this wave (promptleak, capstone leak, copy rule) ran on exactly that text.
   This generator types no prompt: it imports carbon_capstone.mjs, which
   renders PROMPTS from the records again through the vendored engines, and
   refuses unless the rendering equals capstone.json byte for byte. The records
   the go-live's second route reads are that same import's records, so the
   route cannot be computed over a record the learner never saw. A prompt that
   carries a newline, does not ask for six numbers, or does not state the
   precision each field is graded at, is refused.

2. EVERY GRADED FIELD IS A FLOAT GRADED AT ONE UNIT IN THE LAST PLACE THE
   PROMPT ASKS FOR, and THE TOLERANCE COMES FROM precision.json, never from a
   literal here. The grader (academy_submit_capstone) casts expected, tol and
   answer to numeric and accepts |answer - expected| <= tol. A class of N
   decimals is graded at 10^-N, with no exception: the one class of 0 decimals
   (the fuel saved by tuning, asked to the WHOLE GJ) is graded at 10^0 = 1 GJ,
   and its expected value is NOT a whole number (7771.999995). That is the
   wave's ruling (wave.json grading.tolerance; CLASSES in carbon_capstone.mjs):
   the saving is the ratio of two efficiencies the ENGINE ROUNDS TO SIX
   DECIMALS before it divides, so the stored figure sits a few millionths off
   the integer a learner reads, and a learner who carries the two efficiencies
   at the four decimals the course prints lands up to about half a GJ away. At
   1 GJ both 7772 and a half-GJ drift grade right; the closest wrong route (the
   HHV efficiencies) is 18 tolerances out. The supply ladder's 0.5 "exactly one
   integer" rule would grade the correct 7772 against a stored 7771.999995 and
   still pass, but it would refuse a learner half a GJ off for carrying four
   decimals, which is the error the ruling exists to admit. fields.json must
   carry exactly that tolerance for every field (anything else is refused), and
   a tolerance tighter than half a unit in the declared place is refused as
   well, because that is the rule the kit's gradeprecision.py enforces: a
   tolerance below it grades a correctly read figure wrong.

3. THE ENGINE IS RUN HERE, not remembered, and it is run TWICE. `node
   carbon_capstone.mjs --json` re-derives all eighteen values through the
   vendored engines, once on the machine clock and once under the wave's
   fakeclock.mjs with the clock moved 900 days and Math.random pinned, and the
   two runs must be byte-identical (neither engine reads a clock or a random
   number; gate_clock.sh proves the source half). fields.json must equal the
   run field for field, at full precision. No as-of date: these engines read
   no date, and no prompt states one.

4. THE COLLISION AND LEAK SWEEPS ARE THIS WAVE'S OWN, mirrored from its gates:
   gate_collisions.py (no graded value within its tolerance of the absolute
   value of ANY number token the digest prints, and no two graded values within
   the looser of their tolerances) and gate_promptleak.py (no graded value of
   any tier in any prompt, within tolerance or as its own rounding at two or
   more significant figures, and none of the engine-derived intermediates at
   three or more). The labels, datasets and titles this generator writes are
   held to the same sweep, because a learner reads them beside the prompt.

5. NOTHING HELD IS GRADED, AND THE GWP SET IS NAMED. FINDINGS-carbon H1 (which
   IPCC report to file on), H2 (the typical methane heating value pair), H3
   (escaped carbon counted as methane) and H4 (combustion N2O) are taught as
   stated limits. No graded key, label, unit or engine source names N2O, a
   non-fossil potential or AR5, and no graded value is within its tolerance of
   the same field computed on any of the three OTHER sets the course prints
   (AR6 non-fossil, AR5 fossil, AR5 non-fossil): the choice of report is never
   graded, the declared set is. Every prompt that grades a figure the GWP set
   moves (Associate and Expert) names the set, its report, its horizon and the
   methane value; H3 is stated in the Associate prompt as the rule it grades on.

Usage: python3 gen_course.py
   CEF_WAVE        the wave directory (default /root/et-wip-carbon)
   CEF_REPO        the nextgen clone   (default /root/wt-et-carbon-nextgen)
   CEF_ENGINES     packages/engines to run the capstone through
                   (default $CEF_REPO/packages/engines)
   CEF_COURSE_OUT  where to write      (default $CEF_REPO/migrations/...)
"""
import json
import os
import re
import subprocess
import sys

W = os.environ.get('CEF_WAVE', '/root/et-wip-carbon')
REPO = os.environ.get('CEF_REPO', '/root/wt-et-carbon-nextgen')
ENGINES = os.environ.get('CEF_ENGINES', f'{REPO}/packages/engines')
OUT = os.environ.get('CEF_COURSE_OUT', f'{REPO}/migrations/20261014_cef_carbon_course.sql')
SLUG, NAME, MODULE, PATH_ORDER, PREFIX = 'carbon', 'Carbon & Energy Efficiency', 'energy_transition', 52, 'cef'
# The Energy Transition sibling cut in the same wave, in the same module.
SIBLINGS = (('gasvalue', 51),)
# The Commercial & Trading and Supply Chain courses live since 2026-09-19,
# whose slots sit directly below this module's.
LIVE_NEIGHBOURS = (('crude', 48), ('refinery', 49), ('supply', 50))
TIERS = ('beginner', 'intermediate', 'advanced')

fields = json.load(open(f'{W}/fields.json'))
precision = json.load(open(f'{W}/precision.json'))
capstone = json.load(open(f'{W}/capstone.json'))
wave = json.load(open(f'{W}/wave.json'))
PROMPTS = {t: capstone['tiers'][t]['prompt'] for t in TIERS}
bad = []

ENV = {**os.environ, 'MD_ENGINES': ENGINES, 'TZ': 'UTC'}


def q(s):
    return "'" + s.replace("'", "''") + "'"


def run(args, env=None, what='the engine run'):
    r = subprocess.run(args, capture_output=True, text=True, cwd=W, env=env or ENV)
    if r.returncode != 0:
        sys.exit(f'REFUSED: {what} failed: ' + r.stderr[-800:])
    return r.stdout


# ---------------------------------------------------------------------------
# THE ENGINE RUN, twice: the machine clock, then a clock moved 900 days with
# Math.random pinned. Byte-identical or refused.
# ---------------------------------------------------------------------------
_plain = run(['node', os.path.join(W, 'carbon_capstone.mjs'), '--json'])
_moved = run(['node', '--import', os.path.join(W, 'fakeclock.mjs'), os.path.join(W, 'carbon_capstone.mjs'), '--json'],
             env={**ENV, 'FAKE_CLOCK_DAYS': '900', 'FAKE_RANDOM': '0.37'}, what='the engine run under the fake clock')
if _plain != _moved:
    bad.append('the engine run moved when the clock moved 900 days and Math.random was pinned')
_run = json.loads(_plain)
ENGINE = {f['key']: f['value'] for f in _run['fields']}
ENGINE_TOL = {f['key']: f['tol'] for f in _run['fields']}
DERIVED = _run['derived']

# The records, the prompts, the engine reference figures the SQL route reads
# (the IGRITA fuel's atom counts, the oxygen in dry air, the atomic weights the
# molar masses are built from), and the HELD figures, rendered again from the
# same import. The held figures are every GWP-dependent graded field computed on
# the three sets the course prints and does NOT grade on (H1).
_side = json.loads(run(['node', '--input-type=module', '-e', """
const C = await import(%(caps)s);
const K = await import(%(recs)s);
const CA = await import(process.env.MD_ENGINES + '/engines/downstream/carbonAbatement.js');
const EE = await import(process.env.MD_ENGINES + '/engines/downstream/energyEfficiency.js');
const records = {};
for (const [k, v] of Object.entries(K)) if (typeof v !== 'function' && k !== 'FIELD_SOURCES') records[k] = v;
records.IGRITA_ATOMS = K.IGRITA_FUEL.map(([code, y]) => {
  const r = EE.FUEL_REFERENCE.find((x) => x.code === code);
  return { code, y, c: r.c, h: r.h, o: r.o, s: r.s, n: r.n };
});
records.AIR_O2_FRACTION = EE.O2_MOLE_FRACTION_DRY_AIR;
records.ATOMIC_WEIGHT = { ...EE.ATOMIC_WEIGHT };
records.ENGINE_MOLAR_MASS = { CO2: CA.MW_CO2, CH4: CA.MW_CH4, C: CA.MW_C };
const held = {};
for (const [name, alt] of Object.entries(K.ALT_GWP)) {
  const g = C.gwpSet({ ...K.CAP_GWP.values, ...alt }, 'held ' + name);
  const inv = C.owazaInventory(g);
  held['owaza_flare_ch4_tco2e_on_' + name] = inv.lines.find((l) => l.label === 'Flaring (unburned CH4)').tCo2e;
  held['owaza_scope1_tco2e_on_' + name] = inv.scope1Tonnes;
  held['owaza_total_tco2e_on_' + name] = inv.totalTonnes;
  held['ikorodu_path_final_gap_t_on_' + name] = C.ikoroduPath(C.ikoroduInventory(g).totalTonnes).finalGapTonnes;
}
console.log(JSON.stringify({ prompts: C.PROMPTS, records, sources: K.FIELD_SOURCES, held, gwp: K.CAP_GWP, classes: Object.fromEntries(Object.entries(C.CLASSES).map(([k, c]) => [k, { decimals: c.decimals, tol: c.tol }])) }));
""" % {'caps': json.dumps(os.path.join(W, 'carbon_capstone.mjs')),
       'recs': json.dumps(os.path.join(W, 'carbon_fields_capstone.mjs'))}], what='the record export'))
RECORDS = _side['records']
SOURCES = _side['sources']
HELD = _side['held']
GWP = _side['gwp']
for t in TIERS:
    if _side['prompts'][t] != PROMPTS[t]:
        bad.append(f'the {t} prompt carbon_capstone.mjs renders from the records is not capstone.json\'s')
# The SQL route builds the molar masses from the atomic weights; they must be
# the engine's own to the last figure, or the route is reading other physics.
_aw = RECORDS['ATOMIC_WEIGHT']
for gas, built in (('CO2', _aw['C'] + 2 * _aw['O']), ('CH4', _aw['C'] + 4 * _aw['H']), ('C', _aw['C'])):
    if round(built, 3) != RECORDS['ENGINE_MOLAR_MASS'][gas]:
        bad.append(f'MW_{gas} built from the atomic weights is {built} and the engine carries {RECORDS["ENGINE_MOLAR_MASS"][gas]}')

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
# tolerance is one unit in that class's last place (1 GJ for the one class of 0
# decimals, the wave's ruling), never tighter than half a unit there
# (gradeprecision.py's rule), and equal to the tolerance CLASSES in
# carbon_capstone.mjs declares for the class (the one derivation).
# ---------------------------------------------------------------------------
CLASS_OF, DECIMALS, WANT_TOL = {}, {}, {}
for ft, k, v, tol in fields:
    cls = [c for c, sp in precision.items() if re.search(sp['match'], k)]
    if len(cls) != 1:
        bad.append(f'{k} matches {len(cls)} precision classes, not exactly one')
        continue
    dec = precision[cls[0]]['decimals']
    want = float(10 ** -dec) if dec else 1
    if _side['classes'].get(cls[0]) != {'decimals': dec, 'tol': want}:
        bad.append(f'precision.json class {cls[0]} ({dec} decimals, tol {want!r}) is not CLASSES in carbon_capstone.mjs: '
                   f'{_side["classes"].get(cls[0])!r}')
    CLASS_OF[k], DECIMALS[k], WANT_TOL[k] = cls[0], dec, want
    if isinstance(tol, bool) or not isinstance(tol, (int, float)) or tol != want:
        bad.append(f'{k} is graded at {tol!r}, and precision.json class {cls[0]} ({dec} decimals) grades it at {want!r}')
    if tol < 0.5 * 10 ** -dec:
        bad.append(f'{k} is graded at {tol!r}, tighter than half a unit in its declared place ({dec} decimals): '
                   'gradeprecision.py refuses it')
    if isinstance(v, bool) or not isinstance(v, (int, float)) or v != v or v in (float('inf'), float('-inf')):
        bad.append(f'{k} = {v!r} is not a finite number, and the grader compares numbers')
    if dec == 0 and k != 'igrita_tuning_saving_gj':
        bad.append(f'{k} is in a class of 0 decimals, and the wave rules only the tuning saving to the whole GJ')
for cls, sp in precision.items():
    if not any(CLASS_OF.get(k) == cls for k in KEYS):
        bad.append(f'precision.json class {cls} matches no graded field')

# ---------------------------------------------------------------------------
# The eighteen graded fields. Each label names the record and the quantity,
# never the answer; the sign convention of the signed fields (a measure that
# pays for itself has a negative cost per tonne) is the prompt's own. Units
# are what the number counts.
LABELS = {
    ('beginner', 'owaza_heater_co2_t'): ('Fired heaters\' CO2', 't CO2'),
    ('beginner', 'owaza_flare_co2_t'): ('Flare CO2', 't CO2'),
    ('beginner', 'owaza_flare_ch4_t'): ('Flare methane', 't CH4'),
    ('beginner', 'owaza_flare_ch4_tco2e'): ('Flare methane line on the stated GWP set', 'tCO2e'),
    ('beginner', 'owaza_scope1_tco2e'): ('Scope 1', 'tCO2e'),
    ('beginner', 'owaza_total_tco2e'): ('Inventory total, Scope 1 and Scope 2', 'tCO2e'),
    ('intermediate', 'igrita_excess_air_pct'): ('Excess air at the current oxygen', 'percent'),
    ('intermediate', 'igrita_efficiency_lhv_pct'): ('Heater efficiency on LHV at the current oxygen', 'percent'),
    ('intermediate', 'igrita_tuning_saving_gj'): ('Fuel saved a year by tuning to the target oxygen', 'GJ a year'),
    ('intermediate', 'igrita_trap_t_per_yr'): ('Steam lost through the failed trap', 't a year'),
    ('intermediate', 'igrita_pinch_hot_utility_kw'): ('Minimum hot utility', 'kW'),
    ('intermediate', 'igrita_pinch_cold_utility_kw'): ('Minimum cold utility', 'kW'),
    ('advanced', 'ikorodu_boiler_tuning_cost_per_t_usd'): ('Cost per tonne of Tune the boilers', 'USD per tCO2e'),
    ('advanced', 'ikorodu_waste_heat_cost_per_t_usd'): ('Cost per tonne of the waste heat recovery', 'USD per tCO2e'),
    ('advanced', 'ikorodu_flare_recovery_net_annual_cost_usd'): ('Net annual cost of the flare gas recovery compressor', 'USD a year'),
    ('advanced', 'ikorodu_curve_weighted_average_usd_per_t'): ('Weighted average cost per tonne of the curve', 'USD per tCO2e'),
    ('advanced', 'ikorodu_path_final_gap_t'): ('Unabated gap in the end year', 'tCO2e'),
    ('advanced', 'ikorodu_saving_cost_per_t_usd'): ('Economiser cost per tonne of CO2e', 'USD per tCO2e'),
}
assert set(LABELS) == {(f[0], f[1]) for f in fields}, 'labels and fields.json disagree'
assert len({k for _t, k in LABELS}) == 18, 'carbon field keys are meant to be globally unique'

TIER = {
    'beginner': (
        'associate',
        'OWAZA, a flow station of an invented operator: its fired heaters, its flare, its vented methane and the power it buys, as one inventory',
        'The atoms, the flare and the inventory'),
    'intermediate': (
        'professional',
        'IGRITA, a gas conditioning plant of an invented operator: one fired heater and its fuel gas, a failed steam trap and four process streams',
        'The heater, the trap and the pinch'),
    'advanced': (
        'expert',
        'IKORODU, a gas distribution and power complex of an invented operator: six measures, a target and a path, and one saving priced twice',
        'The curve, the path and the saving'),
}

HEADER = """-- ============================================================================
-- carbon: Carbon & Energy Efficiency joins the catalogue, the SECOND course of
-- the Energy Transition module.
--
-- Catalogue row (module 'energy_transition', the academy module the lead ruled
-- for the two Energy Transition courses; path_order 52, directly above its
-- wave sibling gasvalue at 51 and the live Commercial & Trading and Supply
-- Chain courses at 48, 49 and 50; prereq_slug NULL, the carried-over answer
-- "no hard prerequisite inside a module"; school left at its default, as every
-- Facilities, Economics, Assurance and Commercial & Trading course leaves it,
-- so the fees are the published school-level rows) plus the three capstones
-- and their eighteen graded fields, generated by
-- tools/course-waves/carbon/gen_course.py from fields.json, precision.json and
-- capstone.json, which carbon_capstone.mjs writes from the capstone records in
-- carbon_fields_capstone.mjs through the vendored engines. The three tier
-- structures (78 lesson keys) and the 396 questions are the three deep seeds;
-- the go-live is a fifth migration and is HELD until a NextGen production
-- upload carries the route /dashboard/apps/carbon AND the Suite production
-- upload carrying Suite main 06aef5d63 (Suite #543 MD5-0, #545 MD4-0 and #546
-- MD45-1: the Carbon Studio and Efficiency Studio page repairs this course
-- teaches, on the engines at df31f53) is live. This file does not depend on
-- gasvalue: either may be seeded first.
--
-- THE ONE SENTENCE THE COURSE IS. A tonne of CO2e is carbon counted atom by
-- atom, weighted by a declared GWP set and carried on a record that says where
-- every factor came from, and a tonne saved is priced over the life of the
-- measure that saves it; the engines refuse or name every box nobody filled
-- instead of reading it as the best case.
--
-- THE ENGINES. engines/downstream/carbonAbatement.js and energyEfficiency.js,
-- vendored sha-identical with engines df31f53 (engines #228, MD45-1); the recon
-- findings F1 to F9 were repaired upstream in MD5-0 and MD45-1.
--
-- EVERY GRADED FIELD IS A NUMBER THE ENGINE RETURNS, at full precision, graded
-- at ONE UNIT IN THE LAST PLACE THE PROMPT ASKS FOR: tonnes, tCO2e, kW and
-- dollars to two decimals at 0.01; the excess air and the efficiency to four at
-- 0.0001; the fuel saved by tuning to the WHOLE GJ at 1. That one is the wave's
-- ruling: the saving is the ratio of two efficiencies the engine rounds to six
-- decimals, so the stored figure is a few millionths off a whole number, and a
-- learner who carries the efficiencies at the four decimals the course prints
-- lands up to about half a GJ away. The grader (academy_submit_capstone) casts
-- expected, tol and answer to numeric and accepts |answer - expected| <= tol.
-- No verdict, direction or refusal is graded, nothing HELD (FINDINGS-carbon H1
-- to H4) is graded, and no field reads a date or a clock.
--
-- THE GWP SET. Every inventory is computed on IPCC AR6 GWP100 with fossil
-- methane (CH4 29.8, N2O 273), named in the Associate and Expert prompts with
-- its report and horizon. Which report to file on is H1 and is never graded.
--
-- THE PROMPTS are capstone.json's, verbatim: every condition a field needs and
-- the precision it is graded at, and nothing that hands over an answer. No
-- graded value of any tier is a number in any prompt, within its tolerance or
-- as its own rounding, and none of the engine-derived intermediates (the
-- heater methane, the carbon kilomoles, the oxygen demand, the target
-- efficiency, the absolute trap pressure, the pinch temperature, the baseline,
-- the end-year target, the capital recovery factor) is printed in any rounding
-- of three or more significant figures. No graded value is within its
-- tolerance of any number the teaching digest prints, and no two graded values
-- are within the looser of their tolerances.
-- ============================================================================"""


def num_lit(x):
    """A graded number as the SQL/JSON literal the grader reads, full precision."""
    if isinstance(x, int):
        return str(x)
    r = repr(float(x))
    return r


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
    if 'Give six numbers' not in prompt:
        bad.append(f'the {tier} prompt does not ask for six numbers')
    if 'an invented record' not in prompt:
        bad.append(f'the {tier} prompt does not say its record is invented')
    if tier in ('beginner', 'advanced'):
        for need in (GWP['label'], 'IPCC Sixth Assessment Report, 100-year horizon', f"methane {GWP['values']['CH4']}"):
            if need not in prompt:
                bad.append(f'the {tier} prompt grades a figure the GWP set moves and does not name {need!r}')
    objs = ',\n'.join(
        f"    jsonb_build_object('key',{q(k)}, 'label',{q(LABELS[(t, k)][0])},"
        f" 'unit',{q(LABELS[(t, k)][1])}, 'expected',{num_lit(v)}, 'tol',{num_lit(tol)})"
        for t, k, v, tol in fl)
    blocks.append(f"(\n  {q(SLUG)}, {q(tier)}, {q(cert)},\n  {q(dataset)},\n"
                  f"  {q(title)},\n  {q(prompt)},\n  jsonb_build_array(\n{objs}\n  )\n)")
if 'Carbon that escapes a burner or the flare is counted as methane' not in PROMPTS['beginner']:
    bad.append('the beginner prompt does not state H3, the rule its methane fields are graded on')
if len(blocks) != 3:
    bad.append(f'{len(blocks)} capstone rows were built, not 3')
lines.append(',\n'.join(blocks))
lines.append('on conflict (app_slug, tier) do nothing;')
sql = '\n'.join(lines) + '\n'

# --------------------------------------------------------------- self checks
code = '\n'.join(l for l in sql.splitlines() if not l.lstrip().startswith('--'))
unclosed = code.replace("''", '').count("'") % 2
dashes = len(re.findall('[–—]', sql))

# 0. THE PROMPT STATES THE PRECISION OF EVERY FIELD. The answer list is
#    "(1) ... (6) ..."; field n's own item, or the sentence that opens the
#    list, must name the precision the field is graded at.
PHRASE = {0: 'the nearest whole GJ', 2: 'two decimals', 4: 'four decimals'}
for tier in TIERS:
    head, _, tail = PROMPTS[tier].partition('Give six numbers')
    lead = tail.split('(1)', 1)[0]
    items = dict(re.findall(r'\((\d)\) ([^()]*?)(?= \(\d\)|$)', tail))
    if sorted(items) != ['1', '2', '3', '4', '5', '6']:
        bad.append(f'the {tier} prompt does not list six numbered answers: {sorted(items)}')
        continue
    for n, (_t, k, _v, _tol) in enumerate([f for f in fields if f[0] == tier], 1):
        dec = DECIMALS.get(k)
        if dec not in PHRASE:
            bad.append(f'{k}: no phrase for {dec} decimals')
            continue
        if PHRASE[dec] not in items[str(n)] and PHRASE[dec] not in lead:
            bad.append(f'the {tier} prompt does not ask for {k} (item {n}) to {PHRASE[dec]}')

# 1. THE PROMPTS (gate_promptleak.py): no graded value of any tier as a number
#    token, within tolerance or as its own rounding at two or more significant
#    figures; no engine-derived intermediate at three or more. The datasets,
#    titles and labels are read beside the prompt and held to the same.
PNUM = re.compile(r'(?<![\w.])-?\d+(?:\.\d+)?(?![\w])')
# The token regex the go-live's SQL sweep uses, which Postgres can read. Both
# must see the same number of tokens in the prompts.
SQLNUM_SRC = r'(?:^|[^A-Za-z0-9_.])(-?[0-9]+(?:\.[0-9]+)?)(?![A-Za-z0-9_])'
SQLNUM = re.compile(SQLNUM_SRC)


def sig(tok):
    return len(tok.lstrip('-').replace('.', '').lstrip('0'))


def is_rounding(tok, value):
    dec = len(tok.split('.')[1]) if '.' in tok else 0
    return abs(abs(float(tok)) - abs(value)) <= 0.5 * 10 ** -dec + 1e-12


def leaks(text, where):
    out = []
    for tok in PNUM.findall(text):
        for _t, k, v, tol in fields:
            if abs(abs(float(tok)) - abs(v)) <= tol or (sig(tok) >= 2 and is_rounding(tok, v)):
                out.append(f'{where} prints {tok}, the graded value of {k}')
        for k, v in DERIVED.items():
            if sig(tok) >= 3 and is_rounding(tok, v):
                out.append(f'{where} prints {tok}, the engine-derived {k}')
    return out


prompt_tokens = 0
sql_tokens = 0
for tier in TIERS:
    prompt_tokens += len(PNUM.findall(PROMPTS[tier]))
    sql_tokens += len(SQLNUM.findall(PROMPTS[tier]))
    bad.extend(leaks(PROMPTS[tier], f'the {tier} prompt'))
    for text in (TIER[tier][1], TIER[tier][2]) + tuple(LABELS[(t, k)][0] for t, k in LABELS if t == tier):
        bad.extend(leaks(text, f'"{text}"'))
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

# 5. NOTHING HELD IS GRADED (H1 the report, H2 the heating value pair, H3
#    escaped carbon as methane, H4 combustion N2O).
HELD_WORDS = re.compile(r'n2o|nitrous|non.?fossil|\bar5\b|heating value pair', re.I)
for t, k, v, tol in fields:
    for what, text in (('key', k), ('label', LABELS[(t, k)][0]), ('unit', LABELS[(t, k)][1]),
                       ('engine source', SOURCES.get(k, ''))):
        if HELD_WORDS.search(text):
            bad.append(f'{k}: its {what} names a HELD quantity ({text!r})')
    for hk, hv in HELD.items():
        if hv is None or abs(abs(v) - abs(hv)) <= tol:
            bad.append(f'{k} = {v} is the held figure {hk} = {hv}')
if len(HELD) != 12 or any(h is None for h in HELD.values()):
    bad.append(f'the held figures could not all be formed: {HELD}')

# 6. THE CATALOGUE ROW against wave.json, and the siblings' slots.
for what, got, want in (('slug', SLUG, wave['slug']), ('name', NAME, wave['name']),
                        ('module', MODULE, wave['module']), ('path_order', PATH_ORDER, wave['pathOrder']),
                        ('prerequisite', None, wave['prerequisite']),
                        ('prefix', PREFIX, wave['prefix']),
                        ('siblings', list(SIBLINGS), [(s['slug'], s['pathOrder']) for s in wave['siblings']])):
    if got != want:
        bad.append(f'catalogue {what}: {got!r} here and {want!r} in wave.json')

# The sweeps must be able to fire.
if prompt_tokens < 60 or len(digest_nums) < 200 or len(DERIVED) < 10:
    bad.append(f'the sweeps read {prompt_tokens} prompt tokens, {len(digest_nums)} digest numbers and '
               f'{len(DERIVED)} intermediates, so a sweep is reading the wrong thing')

if __name__ == '__main__':
    if bad or unclosed or dashes:
        print('REFUSED, nothing written:')
        for b in bad:
            print('  ', b)
        print('unclosed literal:', bool(unclosed), '| en/em dashes:', dashes)
        sys.exit(1)
    open(OUT, 'w').write(sql)
    print(f'wrote {OUT}: {len(sql.splitlines())} lines, 3 capstones, {len(fields)} fields')
    print('engine run: 18 of 18 fields.json values equal carbon_capstone.mjs --json through the vendored engines, '
          'byte-identical with the clock moved 900 days and Math.random pinned')
    print('tolerances: 18 of 18 are precision.json\'s one unit in the last place (1 GJ for the tuning saving, the wave\'s ruling), '
          'each equal to CLASSES in carbon_capstone.mjs, none tighter than gradeprecision.py\'s half unit; every prompt states each field\'s precision')
    print(f'held: no key, label, unit or source names H1 to H4, and no graded value is one of the {len(HELD)} figures on the three unstated GWP sets; '
          'the Associate and Expert prompts name the set, its report, its horizon and methane 29.8')
    print('prompts: 3 of 3 re-rendered from the records equal capstone.json; lengths',
          {t: len(PROMPTS[t]) for t in TIERS})
    print(f'prompt number tokens swept: {prompt_tokens} | engine-derived intermediates: {len(DERIVED)} '
          f'| digest numbers: {len(digest_nums)}')
    print('prompt + intermediate + digest + pairwise + precision + copy + held + catalogue refusals: 0')
