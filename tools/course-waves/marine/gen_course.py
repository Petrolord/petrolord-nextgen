#!/usr/bin/env python3
"""Generate the SC4 course + capstone migration AND the capstone case files from
the ENGINE'S OWN RUN, so no expected value, no setting and no data point is
retyped.

Modelled on EC11's gen_course.py (itself EC10's, EC9's, EC8's, EC7's, SC2's,
D5's, D4's and D3's), rewritten for SC4 marine: the three capstones are NKEREFI
(Associate), AKOKWA (Professional) and MGBIDI (Expert), Ekene synthetic
clusters built by marine_capstone.mjs through the vendored
engines/supplychain/marineLogistics.js.

1. THE ENGINE IS RUN HERE. `node marine_capstone.mjs --json` is executed
   through the vendored engine (SC4_ENGINES) and the one tolerance module
   (SC4_TOLERANCE), and this file REFUSES unless fields.json carries exactly
   what that run returned: the same tier, key and value to the last bit, and
   the tolerance gradedTolerance.js derives.

2. THE DATA TRAVELS AS CASE FILES. A capstone is set on a vessel, products,
   installations with their cargo or demand, routes, deck items and base
   terms, which a prompt can state in part but a learner should not retype.
   So `marine_capstone.mjs --inputs` is rendered into one JSON case file per
   tier under src/content/capstone-cases/marine/, keyed the way the calculator
   views read a pasted case: a view reads the block named after it, or after
   it and a colon and a name (voyagePlan:milk-run, voyagePlan:dedicated;
   fleetSize, deckPlan; shoreBase:mmc, shoreBase:mdc, fleetVariability). A self
   check re-reads every case file and proves it carries exactly the data the
   engine ran.

3. EVERY SETTING IS STATED. Each prompt states the terms its six values were
   computed at, read from the engine's stated inputs, and a self check refuses
   a prompt that omits one: the vessel's speed, deck, usable fraction, deck
   load, deadweight, tanks and fuel burns; the products' densities; the legs,
   stops and distances; the port hours; the weather factor AND the activities
   it slows; the fuel price; the period, the available days and BOTH rounding
   rules; the deck, the voyages and the PACKING RULE; the berths, arrivals,
   working day, service terms, the concurrent choice, the QUEUE MODEL and the
   target. Each prompt says that no value depends on a reading the engine
   states (marine_capstone.mjs and discriminate.mjs prove that) or on a Monte
   Carlo draw.

4. THE VOCABULARY AND THE COPY RULE ARE ENFORCED ON EVERY PROMPT, TITLE AND
   LABEL: no AI claim, no em or en dash, no "X, not Y" contrastive (nor
   "rather than", ", never", "instead of", "and not", "and never"), no repair
   history.

5. THE PRECISION SENTENCE IN EACH PROMPT IS CHECKED AGAINST precision.json.
   Every SC4 class prints to six decimals, so every prompt asks for six.

THE TOLERANCES ARE READ, NEVER DECLARED. Capstone details stay out of the
lessons: gate_capstone_leak.mjs sweeps the lessons, banks and briefs for every
capstone name, label, index run, figure and value.

Usage:
   python3 gen_course.py                 the self checks only; writes nothing
   python3 gen_course.py --cases         write the three case files and index.js
   python3 gen_course.py --migration     also write the course migration
   SC4_WAVE        the wave directory (default /root/cat-wip-marine)
   SC4_REPO        the nextgen clone   (default /root/wt-sc4-nextgen)
   SC4_ENGINES     packages/engines to run the capstone through
   SC4_TOLERANCE   gradedTolerance.js
   SC4_COURSE_OUT  where to write the migration
   SC4_CASES_OUT   where to write the case files (default $SC4_REPO/src/content/capstone-cases/marine)
Importing this module runs the engine and the self checks and writes nothing.
"""
import json
import os
import re
import subprocess
import sys

W = os.environ.get('SC4_WAVE', '/root/cat-wip-marine')
REPO = os.environ.get('SC4_REPO', '/root/wt-sc4-nextgen')
ENGINES = os.environ.get('SC4_ENGINES', f'{REPO}/packages/engines')
TOLPATH = os.environ.get(
    'SC4_TOLERANCE', f'{REPO}/src/components/course/panels/marine/gradedTolerance.js')
DATE = '20261115'
OUT = os.environ.get('SC4_COURSE_OUT', f'{REPO}/migrations/{DATE}_sc4_marine_course.sql')
CASES_OUT = os.environ.get('SC4_CASES_OUT', f'{REPO}/src/content/capstone-cases/marine')

SLUG, MODULE, PATH_ORDER = 'marine', 'supply_chain', 78
NAME = 'Offshore & Marine Logistics'
TIERS = ('beginner', 'intermediate', 'advanced')

fields = json.load(open(f'{W}/fields.json'))
precision = json.load(open(f'{W}/precision.json'))
wave = json.load(open(f'{W}/wave.json'))
bad = []

for what, got, want in (('slug', wave['slug'], SLUG), ('module', wave['module'], MODULE),
                        ('pathOrder', wave['pathOrder'], PATH_ORDER), ('name', wave['name'], NAME),
                        ('prerequisite', wave['prerequisite'], None)):
    if got != want:
        bad.append(f'wave.json {what} is {got!r}, and this generator writes {want!r}')


def q(s):
    return "'" + s.replace("'", "''") + "'"


ENV = dict(os.environ, SC4_ENGINES=ENGINES, SC4_TOLERANCE=TOLPATH, SC4_WAVE_DIR=W, SC4_REPO=REPO, TZ='UTC', LC_ALL='C')


def node(*args, script=None):
    r = subprocess.run(['node', *([script] if script else []), *args],
                       capture_output=True, text=True, env=ENV)
    if r.returncode != 0:
        sys.exit(f'REFUSED: the engine run failed: {r.stderr.strip()[-400:]}')
    return r.stdout


ENGINE_ROWS = json.loads(node('--json', script=f'{W}/marine_capstone.mjs'))
INPUTS = json.loads(node('--inputs', script=f'{W}/marine_capstone.mjs'))
TOLS = json.loads(node('--input-type=module', '-e',
                       'const M = await import(%s); console.log(JSON.stringify(Object.fromEntries('
                       'M.GRADED_FIELDS.map(([, k]) => [k, M.gradedTolerance(k)]))));' % json.dumps(TOLPATH)))

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
if len(set(KEYS)) != 18:
    bad.append('two graded fields share a key')

NK, AK, MG = INPUTS['NKEREFI'], INPUTS['AKOKWA'], INPUTS['MGBIDI']


def n(x):
    """A number as the prompt writes it: the shortest decimal that reads back to
    the value the engine ran, a whole number without a point."""
    if x is None:
        return 'null'
    if isinstance(x, bool):
        return 'true' if x else 'false'
    if isinstance(x, int) or float(x).is_integer():
        return str(int(x))
    s = repr(float(x))
    if 'e' in s or float(s) != x:
        sys.exit(f'REFUSED: {x!r} does not print as a plain decimal that reads back to itself')
    return s


# ---------------------------------------------------------------------------
# THE CASE FILES: the engine's own inputs, keyed the way the views read them.
# ---------------------------------------------------------------------------
KEYS_OF = {'beginner': ('voyagePlan:milk-run', 'voyagePlan:dedicated'),
           'intermediate': ('fleetSize', 'deckPlan'),
           'advanced': ('shoreBase:mmc', 'shoreBase:mdc', 'fleetVariability')}


def case_of(c, t):
    out = {'dataset': f"{c['name']} (synthetic)", 'label': c['label']}
    for k in KEYS_OF[t]:
        out[k] = c[k]
    return out


CASE_NAME = {'beginner': 'nkerefi_case.json', 'intermediate': 'akokwa_case.json', 'advanced': 'mgbidi_case.json'}
CASE_SRC = {'beginner': NK, 'intermediate': AK, 'advanced': MG}
CASES = {t: [(CASE_NAME[t], json.dumps(case_of(CASE_SRC[t], t), indent=1, ensure_ascii=False) + '\n')] for t in TIERS}
CHECKED = 0
for t in TIERS:
    got = json.loads(CASES[t][0][1])
    if set(CASE_SRC[t]) - {'name', 'label'} != set(KEYS_OF[t]):
        bad.append(f'{CASE_NAME[t]}: the capstone carries keys {sorted(set(CASE_SRC[t]) - {"name", "label"})} and the case file {sorted(KEYS_OF[t])}')
    for k in KEYS_OF[t]:
        if got.get(k) != CASE_SRC[t][k]:
            bad.append(f'{CASE_NAME[t]}: {k} is not what the engine ran')
        CHECKED += 1

# ---------------------------------------------------------------------------
# The eighteen graded fields.
# ---------------------------------------------------------------------------
LABELS = {
    'nkerefi_milkrun_hours': ("The milk run's total hours, with the weather factor on the stated activities", 'hours'),
    'nkerefi_milkrun_fuel_t': ("The milk run's fuel", 't'),
    'nkerefi_milkrun_fuel_cost': ("The milk run's fuel cost", 'USD'),
    'nkerefi_milkrun_deadweight_t': ("The milk run's deadweight load", 't'),
    'nkerefi_binding_utilisation': ("The utilisation of the milk run's binding constraint", 'fraction'),
    'nkerefi_dedicated_days': ('The total days of the three dedicated voyages', 'days'),
    'akokwa_voyages_exact': ("The milk run's voyages of demand before rounding", 'voyages'),
    'akokwa_vessel_days': ('The vessel-days the week needs', 'vessel-days'),
    'akokwa_vessels_exact': ('The vessels before rounding', 'vessels'),
    'akokwa_spare_vessel_days': ('The spare vessel-days', 'vessel-days'),
    'akokwa_ffd_v1_area_m2': ("The first voyage's deck area, first-fit decreasing", 'm2'),
    'akokwa_ffd_v2_load_utilisation': ("The second voyage's deck load utilisation, first-fit decreasing", 'fraction'),
    'mgbidi_mmc_wait_hours': ('The M/M/c mean wait', 'hours'),
    'mgbidi_mmc_probability_wait': ('The M/M/c probability of waiting', 'probability'),
    'mgbidi_mmc_time_at_base_hours': ('The M/M/c mean time at the base', 'hours'),
    'mgbidi_mdc_wait_hours': ('The M/D/c mean wait', 'hours'),
    'mgbidi_mdc_mean_queue': ('The M/D/c mean queue', 'vessels'),
    'mgbidi_target_wait_hours': ('The M/M/c mean wait at the fewest berths that meet the target', 'hours'),
}
if set(LABELS) != set(KEYS):
    bad.append('LABELS and fields.json name different fields')


# ---------------------------------------------------------------------------
# The prompts, rendered from the engine's own inputs and stated settings.
# ---------------------------------------------------------------------------
FREE = ("No value depends on any of the readings the engine states (a load exactly at a capacity, the binding tie, the twelve-digit key a "
        "count is rounded on, halves to the nearest vessel, a tie of demand and minimum visits, a tie of equal footprints, an exact deck fit, "
        "a berth target met exactly, short at equality, the P90 of a requirement) or on a Monte Carlo draw; every choice a value rests on is "
        "stated here, and every input a value needs is in the case file: the engine holds no default for any of them.")

MR, DD = NK['voyagePlan:milk-run'], NK['voyagePlan:dedicated']
FS, DP = AK['fleetSize'], AK['deckPlan']
BM, BD, FV = MG['shoreBase:mmc'], MG['shoreBase:mdc'], MG['fleetVariability']


def vessel_text(v, ps):
    f = v['fuelTPerHour']
    return (f"{v['name']}: {n(v['speedKnots'])} knots; a deck of {n(v['deckAreaM2'])} m2 with a usable fraction of {n(v['deckUsableFraction'])}; "
            f"a deck load of {n(v['deckLoadT'])} t; a cargo deadweight of {n(v['deadweightT'])} t; tanks "
            + ', '.join(f"{p['id']} {n(v['tanks'][p['id']])} m3" for p in ps)
            + f"; fuel {n(f['sailing'])} t an hour sailing, {n(f['port'])} in port and {n(f['field'])} at the field")


def products_text(ps):
    return 'products ' + ', '.join(f"{p['id']} ({p['kind']}, {n(p['densityTPerM3'])} t a m3)" for p in ps)


def weather_text(w):
    return f"a weather factor of {n(w['factor'])} on {' and '.join(w['appliesTo'])} time (and on no other activity)"


NK_TEXT = (f"{NK['label']}. One case file comes with this capstone: {CASE_NAME['beginner']} carries two calls under the keys voyagePlan:milk-run and "
           f"voyagePlan:dedicated; paste it into the voyage and fleet calculator's voyage plan view and choose the block each value needs. "
           f"The vessel is the {vessel_text(MR['vessel'], MR['products'])}. The {products_text(MR['products'])}. "
           f"The installations and their field hours: " + ', '.join(f"{x['id']} {n(x['fieldHours'])} hours" for x in MR['installations'])
           + f"; each installation's cargo for one voyage is in the case file. The milk run sails {', '.join(MR['route']['stops'])} in that order on legs of "
           + ', '.join(n(l) for l in MR['route']['legsNm']) + " NM; the dedicated voyages go out and back at "
           + ', '.join(f"{x['id']} {n(x['distanceFromBaseNm'])} NM" for x in DD['installations'])
           + f" from the base. Both plans state {n(MR['portHours'])} port hours a voyage, {weather_text(MR['weather'])} and fuel at {n(MR['fuelPricePerT'])} a tonne. {FREE}")
AK_TEXT = (f"{AK['label']}. One case file comes with this capstone: {CASE_NAME['intermediate']} carries two calls under the keys fleetSize and deckPlan; "
           f"paste it into the voyage and fleet calculator's fleet sizing view for the first four values and into the deck calculator for the last two. "
           f"The vessel is the {vessel_text(FS['vessel'], FS['products'])}. The {products_text(FS['products'])}. "
           f"The installations, their field hours and minimum visits in the week: " + ', '.join(f"{x['id']} {n(x['fieldHours'])} hours and {n(x['minVisits'])} visit{'' if x['minVisits'] == 1 else 's'}" for x in FS['installations'])
           + f"; each installation's demand for the week is in the case file. The milk run sails {', '.join(FS['route']['stops'])} in that order on legs of "
           + ', '.join(n(l) for l in FS['route']['legsNm']) + f" NM, with {n(FS['portHours'])} port hours a voyage, {weather_text(FS['weather'])} and fuel at "
           f"{n(FS['fuelPricePerT'])} a tonne. The period is {n(FS['periodDays'])} days with {n(FS['vesselAvailableDays'])} days available a vessel; voyageRounding "
           f"{FS['voyageRounding']} and vesselRounding {FS['vesselRounding']}. The deck plan packs the item lines in the case file onto {n(DP['voyages'])} voyages "
           f"of a deck of {n(DP['deck']['areaM2'])} m2 at a usable fraction of {n(DP['deck']['usableFraction'])} and a deck load of {n(DP['deck']['loadT'])} t by the rule "
           f"{DP['rule']}. {FREE}")
AK_TEXT_ITEMS = ', '.join(f"{x['id']} {n(x['lengthM'])} m by {n(x['widthM'])} m at {n(x['weightT'])} t, quantity {n(x['quantity'])}" for x in DP['items'])
AK_TEXT = AK_TEXT.replace(' by the rule ', f' ({AK_TEXT_ITEMS}) by the rule ')
S = BM['service']
MG_TEXT = (f"{MG['label']}. One case file comes with this capstone: {CASE_NAME['advanced']} carries three calls under the keys shoreBase:mmc, shoreBase:mdc "
           f"and fleetVariability; paste it into the shore base calculator and choose the block each value needs. The base has {n(BM['berths'])} berths and "
           f"{n(BM['arrivalsPerDay'])} arrivals a day over a {n(BM['workingHoursPerDay'])}-hour working day; a call needs {n(S['fixedHours'])} fixed hours, "
           f"{n(S['lifts'])} lifts at {n(S['liftsPerHour'])} an hour and {n(S['bulkM3'])} m3 of bulk at {n(S['bulkM3PerHour'])} m3 an hour, with concurrent "
           f"{n(S['concurrent'])} (the lifts and the bulk at the same time). The block shoreBase:mmc states the model {BM['model']} and a target mean wait of "
           f"{n(BM['targetMeanWaitHours'])} hours; the block shoreBase:mdc states the model {BD['model']}. The block fleetVariability runs the seeded Monte Carlo "
           f"(seed {n(FV['seed'])}, {n(FV['iterations'])} draws) in the variability calculator: report what it returns with its seed and draws in your plan; "
           f"none of its figures is graded. {FREE}")

TIER = {
    'beginner': ('associate', 'NKEREFI, one PSV serving the Nkerefi cluster (synthetic)', 'Voyages, capacity and the binding constraint',
                 NK_TEXT + " Report six values: the milk run's total hours; the milk run's fuel, in tonnes; the milk run's fuel cost; the milk run's deadweight load, in tonnes; the utilisation of the milk run's binding constraint, as a fraction; and the total days of the three dedicated voyages. All six to six decimals."),
    'intermediate': ('professional', 'AKOKWA, a week of supply and one voyage of deck cargo for the Akokwa cluster (synthetic)', 'Fleet sizing and deck planning',
                     AK_TEXT + " Report six values: the milk run's voyages of demand before rounding; the vessel-days the week needs; the vessels before rounding; the spare vessel-days; the first voyage's deck area in the deck plan, in m2; and the second voyage's deck load utilisation, as a fraction. All six to six decimals."),
    'advanced': ('expert', 'MGBIDI, the Mgbidi supply base and its fleet (synthetic)', 'Shore base queues, variability and the limits',
                 MG_TEXT + " Report six values: the M/M/c mean wait, in hours; the M/M/c probability of waiting; the M/M/c mean time at the base, in hours; the M/D/c mean wait, in hours; the M/D/c mean queue; and the M/M/c mean wait at the fewest berths that meet the target, in hours. All six to six decimals."),
}
PROMPTS = {t: TIER[t][3] for t in TIERS}

# --------------------------------------------------------------- self checks
NUMS = {t: re.findall(r'(?<![\d.])\d+(?:\.\d+)?(?!\d|\.\d)', PROMPTS[t]) for t in TIERS}


def vessel_nums(v, ps):
    return [v['speedKnots'], v['deckAreaM2'], v['deckUsableFraction'], v['deckLoadT'], v['deadweightT']] + [v['tanks'][p['id']] for p in ps] + list(v['fuelTPerHour'].values())


STATED = {
    'beginner': vessel_nums(MR['vessel'], MR['products']) + [p['densityTPerM3'] for p in MR['products']] + [x['fieldHours'] for x in MR['installations']]
                + MR['route']['legsNm'] + [x['distanceFromBaseNm'] for x in DD['installations']] + [MR['portHours'], MR['weather']['factor'], MR['fuelPricePerT']],
    'intermediate': vessel_nums(FS['vessel'], FS['products']) + [p['densityTPerM3'] for p in FS['products']] + [x['fieldHours'] for x in FS['installations']]
                    + [x['minVisits'] for x in FS['installations']] + FS['route']['legsNm'] + [FS['portHours'], FS['weather']['factor'], FS['fuelPricePerT'],
                    FS['periodDays'], FS['vesselAvailableDays'], DP['voyages'], DP['deck']['areaM2'], DP['deck']['usableFraction'], DP['deck']['loadT']]
                    + [x[k] for x in DP['items'] for k in ('lengthM', 'widthM', 'weightT', 'quantity')],
    'advanced': [BM['berths'], BM['arrivalsPerDay'], BM['workingHoursPerDay'], S['fixedHours'], S['lifts'], S['liftsPerHour'], S['bulkM3'], S['bulkM3PerHour'],
                 BM['targetMeanWaitHours'], FV['seed'], FV['iterations']],
}
for tier, vals in STATED.items():
    for v in vals:
        if n(v) not in NUMS[tier]:
            bad.append(f'{tier} prompt does not state {n(v)}, which the engine ran')
WORDS = {
    'beginner': [MR['route']['mode'], 'dedicated'] + MR['weather']['appliesTo'] + MR['route']['stops'] + ['(and on no other activity)'],
    'intermediate': ['voyageRounding up', 'vesselRounding up', DP['rule'], 'minimum visits'] + FS['weather']['appliesTo'] + ['(and on no other activity)'],
    'advanced': [BM['model'], BD['model'], 'concurrent true', 'none of its figures is graded', 'seed'],
}
for tier, words in WORDS.items():
    for word in words:
        if word not in PROMPTS[tier]:
            bad.append(f'{tier} prompt does not state "{word}"')
for tier in TIERS:
    if FREE not in PROMPTS[tier]:
        bad.append(f'{tier} prompt does not say that no value depends on a stated reading')
    for fname, _ in CASES[tier]:
        if PROMPTS[tier].count(fname) != 1:
            bad.append(f'{tier} prompt does not name the case file {fname} exactly once')

READ = [(f'{t} prompt', PROMPTS[t]) for t in TIERS] + \
       [(f'{t} dataset', TIER[t][1]) for t in TIERS] + [(f'{t} title', TIER[t][2]) for t in TIERS] + \
       [(f'{k} label', LABELS[k][0] + ' ' + LABELS[k][1]) for k in KEYS]


def vocabulary(label, text):
    out = []
    if re.search(r'\bAI\b|AI-powered|artificial intelligence', text, re.I):
        out.append(f'{label} carries an AI claim')
    if re.search(r'\bused to\b|\bno longer\b|pre-audit|legacy', text, re.I):
        out.append(f'{label} frames repair history')
    if re.search('[–—]', text):
        out.append(f'{label} carries an en or em dash')
    if re.search(r',\s+not\s+\w|\brather than\b|,\s+never\b|\binstead of\b|\band not\b|\band never\b', text, re.I):
        out.append(f'{label} carries a contrastive')
    return out


for label, text in READ:
    bad.extend(vocabulary(label, text))
for plant, rule in (('an AI-powered fleet', 'AI claim'), ('the engine used to round', 'repair history'),
                    ('a voyage — new', 'dash'), ('the low figure, not the high', 'contrastive'), ('the P90 rather than the P10', 'rather than'),
                    ('stated and not assumed', 'and not')):
    if not vocabulary('plant', plant):
        bad.append(f'the vocabulary sweep does not catch a planted {rule}')
for tier in TIERS:
    if PROMPTS[tier].count('Report six values') != 1:
        bad.append(f'{tier} prompt does not say "Report six values" exactly once')

# NUMBERS HANDED TO A LEARNER: every prompt, dataset, title, label and case
# file, against every graded value of EVERY tier, at the shipped tolerance.
NUM = re.compile(r'-?\d+(?:\.\d+)?')
handed = [(t, abs(float(tok))) for t in TIERS for tok in NUM.findall(PROMPTS[t])]
handed += [(t, abs(float(tok))) for t in TIERS for tok in NUM.findall(TIER[t][1] + ' ' + TIER[t][2])]
handed += [(TIER_OF[k], abs(float(tok))) for k in KEYS for tok in NUM.findall(' '.join(LABELS[k]))]
handed += [(t, abs(float(tok))) for t in TIERS for _f, text in CASES[t] for tok in NUM.findall(text)]
for ftier, key, val, tol in fields:
    for htier, h in handed:
        if abs(abs(val) - h) <= tol:
            bad.append(f'{ftier}.{key} = {val} is within {tol} of {h}, handed in the {htier} capstone text or case files')
for a in range(len(fields)):
    for b in range(a + 1, len(fields)):
        if abs(abs(fields[a][2]) - abs(fields[b][2])) <= max(fields[a][3], fields[b][3]):
            bad.append(f'pairwise: {fields[a][1]} and {fields[b][1]}')

# EVERY NUMBER THE DIGEST PRINTS.
DIGEST_NUMS = sorted({abs(float(tok)) for tok in NUM.findall(re.sub(r'(\d),(?=\d{3}(?!\d))', r'\1', open(f'{W}/digest.txt', encoding='utf-8').read()))})
if len(DIGEST_NUMS) < 300:
    bad.append(f'only {len(DIGEST_NUMS)} digest numbers were read')
for ftier, key, val, tol in fields:
    for d in DIGEST_NUMS:
        if abs(abs(val) - d) <= tol:
            bad.append(f'{ftier}.{key} = {val} is within {tol} of {d}, which the digest prints')

# THE PROMPT MUST ASK FOR EXACTLY THE DECIMALS ITS FIELDS ARE GRADED TO.
WORD_N = {'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8}
for tier in TIERS:
    asked = sorted({WORD_N[w] for w in re.findall(r'to (\w+) decimals', PROMPTS[tier]) if w in WORD_N})
    needed = set()
    for ftier, key, val, tol in fields:
        if ftier != tier:
            continue
        cls = [c for c, sp in precision.items() if re.search(sp['match'], key)]
        if len(cls) != 1:
            bad.append(f'{key} matches {len(cls)} precision classes')
            continue
        dp = precision[cls[0]]['decimals']
        needed.add(dp)
        if tol < 0.5 * 10 ** -dp * (1 - 1e-12):
            bad.append(f'{tier}.{key} is graded at {tol}, below the half unit of the {dp} decimals its class prints')
    if asked != sorted(needed):
        bad.append(f'{tier} prompt asks for {asked} decimals and its fields are graded to {sorted(needed)}')

HEADER = f"""-- ============================================================================
-- SC4: Offshore & Marine Logistics joins the catalogue in the Supply Chain &
-- Logistics module. AN APP COURSE: the Suite app is the Marine Logistics
-- Planner (Suite #741), which runs the same engine; the practicals also run
-- in the course's own four calculator panels.
--
-- Catalogue row (module 'supply_chain'; path_order {PATH_ORDER}; prereq_slug NULL,
-- the lead's decision; school left at its default) plus the three capstones and
-- their eighteen graded fields, generated by tools/course-waves/marine/gen_course.py
-- from the ENGINE'S OWN RUN (marine_capstone.mjs through the vendored
-- engines/supplychain/marineLogistics.js, petrolord-engines 110f0a0), which it
-- refuses to write unless fields.json carries exactly that run's values and the
-- tolerance gradedTolerance.js derives. Deep seeds are three separate
-- migrations; the go-live is a fifth and is HELD until a NextGen production
-- upload carries the route /dashboard/apps/marine.
--
-- WHAT IS GRADED. NKEREFI (Associate) grades a PSV milk run's hours, fuel,
-- fuel cost, deadweight load and binding utilisation and the days of three
-- dedicated voyages; AKOKWA (Professional) grades a week's voyages of demand
-- before rounding, vessel-days, vessels before rounding and spare vessel-days,
-- and a first-fit decreasing deck plan's first-voyage area and second-voyage
-- load utilisation; MGBIDI (Expert) grades a shore base's M/M/c mean wait,
-- probability of waiting and mean time at the base, its M/D/c mean wait and
-- mean queue, and the M/M/c mean wait at the fewest berths meeting a target.
-- Every value is a return value of the engine, identical under every reading
-- the engine states and never a Monte Carlo draw, and the data it was run on
-- is in the case file the prompt names.
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
odd = [ln for ln, l in enumerate(SQL.splitlines(), 1)
       if not l.lstrip().startswith('--') and l.split('--', 1)[0].count("'") % 2]
if odd:
    bad.append(f'odd-quote code lines {odd}')


def ident(fname):
    return re.sub(r'[^a-z0-9]', '_', fname.rsplit('.', 1)[0])


INDEX_JS = ("// The marine capstone case files, generated by tools/course-waves/marine/gen_course.py\n"
            "// from the engine's own inputs (marine_capstone.mjs --inputs). Only the capstone card\n"
            "// imports this module: no panel preloads a case, and the graded answers are not\n"
            "// stored anywhere in the app.\n")
for tier in TIERS:
    for fname, _ in CASES[tier]:
        INDEX_JS += f"import {ident(fname)} from './{fname}?raw';\n"
INDEX_JS += '\nexport const MARINE_CASE_FILES = {\n'
for tier in TIERS:
    INDEX_JS += f'  {tier}: [\n'
    for fname, _ in CASES[tier]:
        INDEX_JS += f"    {{ name: '{fname}', text: {ident(fname)} }},\n"
    INDEX_JS += '  ],\n'
INDEX_JS += '};\n'

if __name__ == '__main__':
    if bad:
        for b in bad:
            print('  REFUSED:', b)
        print('NOTHING WRITTEN.')
        sys.exit(1)
    wrote = []
    if '--cases' in sys.argv or '--migration' in sys.argv:
        os.makedirs(CASES_OUT, exist_ok=True)
        for tier in TIERS:
            for fname, text in CASES[tier]:
                open(f'{CASES_OUT}/{fname}', 'w').write(text)
        open(f'{CASES_OUT}/index.js', 'w').write(INDEX_JS)
        wrote.append(f'{CASES_OUT}: {sum(len(v) for v in CASES.values())} case files and index.js')
    if '--migration' in sys.argv:
        os.makedirs(os.path.dirname(OUT), exist_ok=True)
        open(OUT, 'w').write(SQL)
        wrote.append(f'{OUT}: {len(SQL.splitlines())} lines, 3 capstones, {len(fields)} fields')
    for x in wrote:
        print(f'wrote {x}')
    print(f'gen_course: engine run 18 of 18 fields.json values equal what marine_capstone.mjs returned through {ENGINES}, '
          f'every tolerance the one gradedTolerance.js derives; case-file data re-read and equal to the engine run: {CHECKED}; '
          f'prompt lengths {({t: len(PROMPTS[t]) for t in TIERS})}; digest numbers swept: {len(DIGEST_NUMS)}; numbers handed: {len(handed)}; '
          'handed + pairwise + digest collisions + settings + vocabulary + copy rule + precision: 0'
          + ('' if wrote else '; SELF CHECK ONLY, nothing written'))
