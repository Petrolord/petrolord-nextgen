#!/usr/bin/env python3
"""Generate the SC3 course + capstone migration AND the capstone case files from
the ENGINE'S OWN RUN, so no expected value, no setting and no data point is
retyped.

Modelled on EC11's gen_course.py (itself EC10's, EC9's, EC8's, EC7's, SC2's,
D5's, D4's and D3's), rewritten for SC3 materials: the three capstones are
IGBARIAM (Associate), OGIDI (Professional) and UMUCHU (Expert), Ekene-programme
synthetic registers built by materials_capstone.mjs through the vendored
engines/supplychain/inventory.js.

1. THE ENGINE IS RUN HERE. `node materials_capstone.mjs --json` is executed
   through the vendored engine (SC3_ENGINES) and the one tolerance module
   (SC3_TOLERANCE), and this file REFUSES unless fields.json carries exactly
   what that run returned: the same tier, key and value to the last bit, and
   the tolerance gradedTolerance.js derives.

2. THE DATA TRAVELS AS CASE FILES. A capstone is set on item lists, price
   schedules, bands and triangles that a learner should not retype. So
   `materials_capstone.mjs --inputs` is rendered into one JSON case file per
   tier under src/content/capstone-cases/materials/, keyed the way the
   calculator views read a pasted case: a view reads the block named after it,
   or after it and a colon and a name (criticality, abcClassification, eoq,
   slowMoving; quantityDiscount, safetyStock:cycle-service,
   safetyStock:fill-rate, safetyStock:periodic, poissonStock;
   insuranceSpares, poissonStock, leadTimeRisk). A self check re-reads every
   case file and proves it carries exactly the data the engine ran.

3. EVERY SETTING IS STATED. Each prompt states every policy input and every
   scalar its six values were computed at, read from the engine's stated
   inputs, and a self check refuses a prompt that omits one; the item lists
   are in the case file. Each prompt says that no value depends on a reading
   the engine states (materials_capstone.mjs and discriminate.mjs prove that)
   or on a Monte Carlo draw, and the Expert prompt says its lead-time Monte
   Carlo block is worked with its seed and draws and is never graded.

4. THE VOCABULARY AND THE COPY RULE ARE ENFORCED ON EVERY PROMPT, TITLE AND
   LABEL: no AI claim, no em or en dash, no "X, not Y" contrastive (nor
   "rather than", ", never", "instead of", "and not", "and never"), no repair
   history.

5. THE PRECISION SENTENCE IN EACH PROMPT IS CHECKED AGAINST precision.json.
   Every SC3 class prints to six decimals, so every prompt asks for six.

THE TOLERANCES ARE READ, NEVER DECLARED. Capstone details stay out of the
lessons: gate_capstone_leak.mjs sweeps the lessons, banks and briefs for every
capstone name, label, item id, run, figure and value.

Usage:
   python3 gen_course.py                 the self checks only; writes nothing
   python3 gen_course.py --cases         write the three case files and index.js
   python3 gen_course.py --migration     also write the course migration
   SC3_WAVE        the wave directory (default /root/cat-wip-materials)
   SC3_REPO        the nextgen clone   (default /root/wt-sc3-nextgen)
   SC3_ENGINES     packages/engines to run the capstone through
   SC3_TOLERANCE   gradedTolerance.js
   SC3_COURSE_OUT  where to write the migration
   SC3_CASES_OUT   where to write the case files (default $SC3_REPO/src/content/capstone-cases/materials)
Importing this module runs the engine and the self checks and writes nothing.
"""
import json
import os
import re
import subprocess
import sys

W = os.environ.get('SC3_WAVE', '/root/cat-wip-materials')
REPO = os.environ.get('SC3_REPO', '/root/wt-sc3-nextgen')
ENGINES = os.environ.get('SC3_ENGINES', f'{REPO}/packages/engines')
TOLPATH = os.environ.get(
    'SC3_TOLERANCE', f'{REPO}/src/components/course/panels/materials/gradedTolerance.js')
DATE = '20261114'
OUT = os.environ.get('SC3_COURSE_OUT', f'{REPO}/migrations/{DATE}_sc3_materials_course.sql')
CASES_OUT = os.environ.get('SC3_CASES_OUT', f'{REPO}/src/content/capstone-cases/materials')

SLUG, MODULE, PATH_ORDER = 'materials', 'supply_chain', 77
NAME = 'Materials, Spares & Inventory Management'
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


ENV = dict(os.environ, SC3_ENGINES=ENGINES, SC3_TOLERANCE=TOLPATH, SC3_WAVE_DIR=W, SC3_REPO=REPO, TZ='UTC', LC_ALL='C')


def node(*args, script=None):
    r = subprocess.run(['node', *([script] if script else []), *args],
                       capture_output=True, text=True, env=ENV)
    if r.returncode != 0:
        sys.exit(f'REFUSED: the engine run failed: {r.stderr.strip()[-400:]}')
    return r.stdout


ENGINE_ROWS = json.loads(node('--json', script=f'{W}/materials_capstone.mjs'))
INPUTS = json.loads(node('--inputs', script=f'{W}/materials_capstone.mjs'))
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

IG, OG, UM = INPUTS['IGBARIAM'], INPUTS['OGIDI'], INPUTS['UMUCHU']


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
KEYS_OF = {'beginner': ('criticality', 'abcClassification', 'eoq', 'slowMoving'),
           'intermediate': ('quantityDiscount', 'safetyStock:cycle-service', 'safetyStock:fill-rate', 'safetyStock:periodic', 'poissonStock'),
           'advanced': ('insuranceSpares', 'poissonStock', 'leadTimeRisk')}


def case_of(c, t):
    out = {'dataset': f"{c['name']} (synthetic)", 'label': c['label']}
    for k in KEYS_OF[t]:
        out[k] = c[k]
    return out


CASE_NAME = {'beginner': 'igbariam_case.json', 'intermediate': 'ogidi_case.json', 'advanced': 'umuchu_case.json'}
CASE_SRC = {'beginner': IG, 'intermediate': OG, 'advanced': UM}
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
    'igbariam_trim_weighted_score': ('The weighted criticality score of the separator level control valve trim, IGB-V204', 'score out of 100'),
    'igbariam_inhibitor_cumulative_pct': ('The cumulative share of annual usage value with the corrosion inhibitor, IGB-C515, included', 'percent'),
    'igbariam_inhibitor_eoq': ('The EOQ of the corrosion inhibitor, unrounded', 'drums'),
    'igbariam_inhibitor_relevant_cost': ('The relevant cost a year of the corrosion inhibitor at the quantity ordered', 'USD a year'),
    'igbariam_inhibitor_rounding_penalty_pct': ('The rounding penalty of the corrosion inhibitor order', 'percent'),
    'igbariam_total_write_down': ('The total write-down of the four banded items', 'USD'),
    'ogidi_tubing_discount_quantity': ('The order quantity of production tubing under the incremental schedule', 'joints'),
    'ogidi_tubing_discount_total_cost': ('The total cost a year of production tubing at that quantity', 'USD a year'),
    'ogidi_filter_csl_safety_stock': ('The safety stock of the filter element at the cycle service level', 'elements'),
    'ogidi_filter_fill_rate_k': ('The safety factor k of the filter element for the fill rate, unrounded', 'k'),
    'ogidi_filter_periodic_level': ('The order-up-to level of the filter element under monthly review, unrounded', 'elements'),
    'ogidi_kit_poisson_short': ('The expected units short a cycle of the valve repair kit at its level', 'kits'),
    'umuchu_motor_total_cost': ('The total cost a year of the cheapest stock of motor spares', 'USD a year'),
    'umuchu_motor_downtime_cost': ('The expected downtime cost a year at that stock', 'USD a year'),
    'umuchu_motor_no_shortage': ('The probability of no shortage at that stock', 'probability'),
    'umuchu_motor_fill_rate': ('The fill rate of the motor spares at that stock', 'probability'),
    'umuchu_seal_poisson_short': ('The expected units short a cycle of the seal cartridge at its level', 'seals'),
    'umuchu_seal_poisson_fill_rate': ('The achieved fill rate of the seal cartridge at its level', 'probability'),
}
if set(LABELS) != set(KEYS):
    bad.append('LABELS and fields.json name different fields')


# ---------------------------------------------------------------------------
# The prompts, rendered from the engine's own inputs and stated settings.
# ---------------------------------------------------------------------------
FREE = ("No value depends on any of the readings the engine states (twelve significant digits, halves upward, a minimum met at or above it, "
        "a tie to the smaller quantity or fewer spares, a Poisson target met at or above it, the cover limit exceeded strictly above it, "
        "a stockout at equality, the P90 as the low figure) or on a Monte Carlo draw, and every input a value needs is stated here or in the "
        "case file: the engine holds no default for any of them.")

CR, AB_, EQ, SM = IG['criticality'], IG['abcClassification'], IG['eoq'], IG['slowMoving']
QD, SC, SF, SP, PK = OG['quantityDiscount'], OG['safetyStock:cycle-service'], OG['safetyStock:fill-rate'], OG['safetyStock:periodic'], OG['poissonStock']
IN, PS, LT = UM['insuranceSpares'], UM['poissonStock'], UM['leadTimeRisk']


def rounding_text(r):
    return 'no rounding' if r['rule'] == 'none' else f"rounding {r['rule']} to a multiple of {n(r['multiple'])}"


def ss_text(label, c):
    s = (f"{label}: a demand of {n(c['demandMean'])} a month with a standard deviation of {n(c['demandSd'])}, a lead time of {n(c['leadTime'])} months "
         f"with a standard deviation of {n(c['leadTimeSd'])}, a review period of {n(c['reviewPeriod'])}, the {c['serviceMeasure']} measure at {n(c['serviceLevel'])}")
    if 'orderQuantity' in c:
        s += f", an order quantity of {n(c['orderQuantity'])}"
    return s + f", safety factor rounding {c['safetyFactorRounding']['rule']}, a minimum safety factor of {n(c['minimumSafetyFactor'])} and {rounding_text(c['rounding'])}"


def ps_text(label, c):
    return (f"{label}: a demand of {n(c['demandRate'])} a month, Poisson, a lead time of {n(c['leadTime'])} months and a review period of "
            f"{n(c['reviewPeriod'])}, the {c['serviceMeasure']} measure at {n(c['serviceLevel'])} with an order quantity of {n(c['orderQuantity'])}")


def tri_text(t):
    return f"a triangle with min {n(t['min'])}, mode {n(t['mode'])} and max {n(t['max'])}"


IG_TEXT = (f"{IG['label']}. One case file comes with this capstone: {CASE_NAME['beginner']} carries four calls under the keys criticality, abcClassification, "
           f"eoq and slowMoving; paste it into the register calculator and choose the block each value needs. The item lists are in the case file. "
           f"Criticality: {'; '.join(f'{c[chr(105)+chr(100)]} weight {n(c[chr(119)+chr(101)+chr(105)+chr(103)+chr(104)+chr(116)])}' for c in CR['criteria'])}; scores out of {n(CR['scoreMax'])}; "
           f"classes {', '.join(f'{c[chr(108)+chr(97)+chr(98)+chr(101)+chr(108)]} from {n(c[chr(109)+chr(105)+chr(110)+chr(83)+chr(99)+chr(111)+chr(114)+chr(101)])}' for c in CR['classes'])}; "
           f"a maximum score on {', '.join(CR['topClassOnMaxScore'])} places an item in the top class. ABC by annual usage value: cut-offs of "
           f"{n(AB_['cutoffs']['aPct'])} and {n(AB_['cutoffs']['bPct'])} percent under the {AB_['boundaryRule']} rule. The corrosion inhibitor: a demand of "
           f"{n(EQ['annualDemand'])} drums a year, an order cost of {n(EQ['orderCost'])}, a unit cost of {n(EQ['unitCost'])}, a holding rate of "
           f"{n(EQ['holdingRate'])}, {rounding_text(EQ['rounding'])}. Slow-moving bands: "
           f"{'; '.join(f'{b[chr(108)+chr(97)+chr(98)+chr(101)+chr(108)]} from {n(b[chr(109)+chr(105)+chr(110)+chr(77)+chr(111)+chr(110)+chr(116)+chr(104)+chr(115)])} months at {n(b[chr(119)+chr(114)+chr(105)+chr(116)+chr(101)+chr(68)+chr(111)+chr(119)+chr(110)+chr(80)+chr(99)+chr(116)])} percent' for b in SM['bands'])}; "
           f"excess above {n(SM['excessCoverMonths'])} months of cover. {FREE}")
OG_TEXT = (f"{OG['label']}. One case file comes with this capstone: {CASE_NAME['intermediate']} carries five calls under the keys quantityDiscount, "
           f"safetyStock:cycle-service, safetyStock:fill-rate, safetyStock:periodic and poissonStock; paste it into the stock calculator and choose the block "
           f"each value needs. Production tubing: a demand of {n(QD['annualDemand'])} joints a year, an order cost of {n(QD['orderCost'])}, a holding rate of "
           f"{n(QD['holdingRate'])}, the {QD['discountType']} schedule "
           + '; '.join(f"{n(b['unitPrice'])} from {n(b['minQuantity'])}" for b in QD['breaks'])
           + f", {rounding_text(QD['rounding'])}. The filter element, periods in months, three calls: "
           + '. '.join([ss_text('continuous review at a cycle service level', SC), ss_text('continuous review at a fill rate', SF), ss_text('monthly review', SP)])
           + '. ' + ps_text('The valve repair kit', PK) + f". {FREE}")
UM_TEXT = (f"{UM['label']}. One case file comes with this capstone: {CASE_NAME['advanced']} carries three calls under the keys insuranceSpares, poissonStock "
           f"and leadTimeRisk; paste it into the spares calculator and choose the block each value needs. The compressor motor, held as an insurance spare under "
           f"the engine's one-for-one model: {n(IN['failuresPerYear'])} failures a year, a lead time of {n(IN['leadTimeDays'])} days, {n(IN['daysPerYear'])} days a year, "
           f"a unit cost of {n(IN['unitCost'])}, a holding rate of {n(IN['holdingRate'])}, a downtime cost of {n(IN['downtimeCostPerDay'])} a day, searched from 0 to "
           f"{n(IN['maxSpares'])} spares. " + ps_text('The seal cartridge', PS) + ". The same seal's lead-time risk is in the leadTimeRisk block: a demand a day of "
           + tri_text(LT['demandPerDay']) + ', a lead time in days of ' + tri_text(LT['leadTimeDays'])
           + f", a reorder point of {n(LT['reorderPoint'])}, a service level of {n(LT['serviceLevel'])}, {n(LT['iterations'])} draws on seed {n(LT['seed'])}. "
           f"Work it and read its P90 as the low figure; it is sampled, and no value below is taken from it. {FREE}")

TIER = {
    'beginner': ('associate', 'IGBARIAM, the materials register of the Igbariam flow station (synthetic)', 'Criticality, classes and the order quantity',
                 IG_TEXT + " Report six values: the weighted criticality score of the separator level control valve trim, IGB-V204; the cumulative share of annual usage value with the corrosion inhibitor, IGB-C515, included, in percent; the EOQ of the corrosion inhibitor, unrounded; its relevant cost a year at the quantity ordered; the rounding penalty, in percent; and the total write-down of the four banded items. All six to six decimals."),
    'intermediate': ('professional', 'OGIDI, the stock policy of the Ogidi field (synthetic)', 'Service levels, safety stock and discounts',
                     OG_TEXT + " Report six values: the order quantity of production tubing under the incremental schedule; its total cost a year; the safety stock of the filter element at the cycle service level; the safety factor k for the fill rate, unrounded; the order-up-to level under monthly review, unrounded; and the expected units short a cycle of the valve repair kit at its level. All six to six decimals."),
    'advanced': ('expert', 'UMUCHU, the spares of the Umuchu compressor station (synthetic)', 'Spares, lead-time risk and the limits',
                 UM_TEXT + " Report six values: the total cost a year of the cheapest stock of motor spares; the expected downtime cost a year at that stock; the probability of no shortage at that stock; the fill rate at that stock; the expected units short a cycle of the seal cartridge at its level; and the seal's achieved fill rate at its level. All six to six decimals."),
}
PROMPTS = {t: TIER[t][3] for t in TIERS}

# --------------------------------------------------------------- self checks
NUMS = {t: re.findall(r'(?<![\d.])\d+(?:\.\d+)?(?!\d|\.\d)', PROMPTS[t]) for t in TIERS}
STATED = {
    'beginner': [c['weight'] for c in CR['criteria']] + [CR['scoreMax']] + [c['minScore'] for c in CR['classes']]
                + [AB_['cutoffs']['aPct'], AB_['cutoffs']['bPct'], EQ['annualDemand'], EQ['orderCost'], EQ['unitCost'], EQ['holdingRate'], EQ['rounding']['multiple']]
                + [b['minMonths'] for b in SM['bands']] + [b['writeDownPct'] for b in SM['bands']] + [SM['excessCoverMonths']],
    'intermediate': [QD['annualDemand'], QD['orderCost'], QD['holdingRate']] + [b[k] for b in QD['breaks'] for k in ('minQuantity', 'unitPrice')]
                    + [c[k] for c in (SC, SF, SP) for k in ('demandMean', 'demandSd', 'leadTime', 'leadTimeSd', 'reviewPeriod', 'serviceLevel', 'minimumSafetyFactor')]
                    + [SF['orderQuantity']] + [PK[k] for k in ('demandRate', 'leadTime', 'reviewPeriod', 'serviceLevel', 'orderQuantity')],
    'advanced': [IN[k] for k in ('failuresPerYear', 'leadTimeDays', 'daysPerYear', 'unitCost', 'holdingRate', 'downtimeCostPerDay', 'maxSpares')]
                + [PS[k] for k in ('demandRate', 'leadTime', 'reviewPeriod', 'serviceLevel', 'orderQuantity')]
                + [LT[d][k] for d in ('demandPerDay', 'leadTimeDays') for k in ('min', 'mode', 'max')] + [LT['reorderPoint'], LT['serviceLevel'], LT['iterations'], LT['seed']],
}
for tier, vals in STATED.items():
    for v in vals:
        if n(v) not in NUMS[tier]:
            bad.append(f'{tier} prompt does not state {n(v)}, which the engine ran')
WORDS = {
    'beginner': [c['id'] for c in CR['criteria']] + [c['label'] for c in CR['classes']] + CR['topClassOnMaxScore'] + [AB_['boundaryRule'], EQ['rounding']['rule']] + [b['label'] for b in SM['bands']],
    'intermediate': [QD['discountType'], SC['serviceMeasure'], SF['serviceMeasure'], PK['serviceMeasure'], 'Poisson', 'no rounding'],
    'advanced': ['one-for-one', PS['serviceMeasure'], 'Poisson', 'P90 as the low figure', 'no value below is taken from it'],
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
    if re.search('[\u2013\u2014]', text):
        out.append(f'{label} carries an en or em dash')
    if re.search(r',\s+not\s+\w|\brather than\b|,\s+never\b|\binstead of\b|\band not\b|\band never\b', text, re.I):
        out.append(f'{label} carries a contrastive')
    return out


for label, text in READ:
    bad.extend(vocabulary(label, text))
for plant, rule in (('an AI-powered estimate', 'AI claim'), ('the engine used to round', 'repair history'),
                    ('a spare \u2014 new', 'dash'), ('the low figure, not the high', 'contrastive'), ('the P90 rather than the P10', 'rather than'),
                    ('sampled and never graded', 'and never')):
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
-- SC3: Materials, Spares & Inventory Management joins the catalogue in the
-- Supply Chain module. AN APP COURSE: the Suite app is the Materials & Spares
-- Planner (Midstream & Downstream); the practicals also run in the course's own
-- calculator panels over the same vendored engine.
--
-- Catalogue row (module 'supply_chain'; path_order {PATH_ORDER}; prereq_slug NULL,
-- the lead's decision; school left at its default) plus the three capstones and
-- their eighteen graded fields, generated by tools/course-waves/materials/gen_course.py
-- from the ENGINE'S OWN RUN (materials_capstone.mjs through the vendored
-- engines/supplychain/inventory.js, petrolord-engines 110f0a0), which it refuses
-- to write unless fields.json carries exactly that run's values and the
-- tolerance gradedTolerance.js derives. Deep seeds are three separate
-- migrations; the go-live is a fifth and is HELD until a NextGen production
-- upload carries the route /dashboard/apps/materials.
--
-- WHAT IS GRADED. IGBARIAM (Associate) grades a weighted criticality score, a
-- cumulative ABC share, an EOQ, its relevant cost at the rounded quantity and
-- the rounding penalty, and a total write-down; OGIDI (Professional) grades an
-- incremental-discount order quantity and its total cost, a safety stock at a
-- cycle service level, a fill-rate safety factor, an order-up-to level under
-- periodic review and a Poisson slow mover's expected units short; UMUCHU
-- (Expert) grades an insurance spare's total and downtime cost, probability of
-- no shortage and fill rate, and a seal's Poisson units short and fill rate;
-- its lead-time Monte Carlo block is worked and never graded. Every value is a
-- return value of the engine, identical under every reading the engine states
-- and never a Monte Carlo draw, and the data it was run on is in the case file
-- the prompt names.
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


INDEX_JS = ("// The materials capstone case files, generated by tools/course-waves/materials/gen_course.py\n"
            "// from the engine's own inputs (materials_capstone.mjs --inputs). Only the capstone card\n"
            "// imports this module: no panel preloads a case, and the graded answers are not\n"
            "// stored anywhere in the app.\n")
for tier in TIERS:
    for fname, _ in CASES[tier]:
        INDEX_JS += f"import {ident(fname)} from './{fname}?raw';\n"
INDEX_JS += '\nexport const MATERIALS_CASE_FILES = {\n'
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
    print(f'gen_course: engine run 18 of 18 fields.json values equal what materials_capstone.mjs returned through {ENGINES}, '
          f'every tolerance the one gradedTolerance.js derives; case-file data re-read and equal to the engine run: {CHECKED}; '
          f'prompt lengths {({t: len(PROMPTS[t]) for t in TIERS})}; digest numbers swept: {len(DIGEST_NUMS)}; numbers handed: {len(handed)}; '
          'handed + pairwise + digest collisions + settings + vocabulary + copy rule + precision: 0'
          + ('' if wrote else '; SELF CHECK ONLY, nothing written'))
