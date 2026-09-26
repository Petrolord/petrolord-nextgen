#!/usr/bin/env python3
"""Generate the SC2 course + capstone migration AND the capstone case files from
the ENGINE'S OWN RUN, so no expected value, no setting and no data point is
retyped.

Modelled on tools/course-waves/appliedai/gen_course.py (D5), itself D4's and
D3's, rewritten for SC2 procurement: the three capstones are ONITSHA
(Associate), UMUAHIA (Professional) and OKIGWE (Expert), built by
sc2_capstone.mjs through the vendored engines/supplychain/tender.js.

1. THE ENGINE IS RUN HERE. `node sc2_capstone.mjs --json` is executed through
   the vendored tender engine (SC2_ENGINES) and the one tolerance module
   (SC2_TOLERANCE), and this file REFUSES unless fields.json carries exactly
   what that run returned: the same tier, key and value to the last bit, and
   the tolerance gradedTolerance.js derives.

2. THE DATA TRAVELS AS CASE FILES. An SC2 capstone is set on a tender (its
   criteria, bids, bills, completion weeks, life-cycle costs and content
   records) or on a job (its activity programme, cost items and partners),
   which no prompt can carry readably. So `sc2_capstone.mjs --inputs` is
   rendered into one JSON case file per tier under
   src/content/capstone-cases/procurement/ (the dataqc, mlcore, facies,
   forecastml and appliedai pattern: the capstone card offers them for
   download and no panel preloads them). A self check re-reads every case file
   and proves it carries exactly the data the engine ran, value for value and
   in order.

3. EVERY SETTING IS STATED. Each prompt states every setting its six values
   were computed at (the pass mark, the omission rule, the schedule, the life
   cycle, the award basis, the technical weight, the price and technical
   methods, the s.14 reading of each lead, the ALB approach, the Monte Carlo
   seed and iterations, the plan, the should-cost NPT, contingency and band),
   read from the engine's stated inputs, and a self check refuses a prompt
   that omits one.

4. THE VOCABULARY AND THE COPY RULE (digest section 25, BRIEF.md) ARE ENFORCED
   ON EVERY PROMPT, TITLE AND LABEL: no AI claim, no em or en dash, no "X, not
   Y" contrastive, and a cost P90 is named as the LOW cost.

5. THE PRECISION SENTENCE IN EACH PROMPT IS CHECKED AGAINST precision.json.
   Every SC2 class prints to six decimals, so every prompt asks for six.

THE TOLERANCES ARE READ, NEVER DECLARED. Capstone details stay out of the
lessons: gate_capstone_leak.mjs sweeps the lessons, banks and briefs for every
capstone name, bid code, input and value.

Usage:
   python3 gen_course.py                 the self checks only; writes nothing
   python3 gen_course.py --cases         write the three case files and index.js
   python3 gen_course.py --migration     also write the course migration
   SC2_WAVE        the wave directory (default /root/cat-wip-procurement)
   SC2_REPO        the nextgen clone   (default /root/wt-sc2-nextgen)
   SC2_ENGINES     packages/engines to run the capstone through
   SC2_TOLERANCE   gradedTolerance.js
   SC2_COURSE_OUT  where to write the migration
   SC2_CASES_OUT   where to write the case files (default $SC2_REPO/src/content/capstone-cases/procurement)
Importing this module runs the engine and the self checks and writes nothing.
"""
import json
import os
import re
import subprocess
import sys

W = os.environ.get('SC2_WAVE', '/root/cat-wip-procurement')
REPO = os.environ.get('SC2_REPO', '/root/wt-sc2-nextgen')
ENGINES = os.environ.get('SC2_ENGINES', f'{REPO}/packages/engines')
TOLPATH = os.environ.get(
    'SC2_TOLERANCE', f'{REPO}/src/components/course/panels/procurement/gradedTolerance.js')
DATE = '20261106'
OUT = os.environ.get('SC2_COURSE_OUT', f'{REPO}/migrations/{DATE}_sc2_procurement_course.sql')
CASES_OUT = os.environ.get('SC2_CASES_OUT', f'{REPO}/src/content/capstone-cases/procurement')

SLUG, MODULE, PATH_ORDER = 'procurement', 'supply_chain', 71
NAME = 'Procurement, Tendering & Contracting'
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


# ---------------------------------------------------------------------------
# THE ENGINE RUN, through the vendored engine the committed tree carries.
# ---------------------------------------------------------------------------
ENV = dict(os.environ, SC2_ENGINES=ENGINES, SC2_TOLERANCE=TOLPATH, SC2_WAVE_DIR=W, TZ='UTC', LC_ALL='C')


def node(*args, script=None):
    r = subprocess.run(['node', *([script] if script else []), *args],
                       capture_output=True, text=True, env=ENV)
    if r.returncode != 0:
        sys.exit(f'REFUSED: the engine run failed: {r.stderr.strip()[-400:]}')
    return r.stdout


ENGINE_ROWS = json.loads(node('--json', script=f'{W}/sc2_capstone.mjs'))
INPUTS = json.loads(node('--inputs', script=f'{W}/sc2_capstone.mjs'))
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

ON, UM, OK = INPUTS['ONITSHA'], INPUTS['UMUAHIA'], INPUTS['OKIGWE']
OKC, OKS, OKT = OK['contracting'], OK['shouldCost'], OK['tender']


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


def span(rows, key='id'):
    xs = [r[key] for r in rows]
    return f'{xs[0]} to {xs[-1]}'


# ---------------------------------------------------------------------------
# THE CASE FILES, rendered from the engine's own inputs: one JSON file a tier,
# in the order the engine ran every list. Settings are stated in the prompt.
# ---------------------------------------------------------------------------
def onitsha_case():
    return {'dataset': 'ONITSHA (synthetic)', 'tender': ON['tender'], 'scope': ON['scope'],
            'criteria': ON['criteria'], 'bids': ON['bids']}


def umuahia_case():
    return {'dataset': 'UMUAHIA (synthetic)', 'tender': UM['tender'], 'scope': UM['scope'],
            'criteria': UM['criteria'], 'contentItems': UM['ncItems'], 'bids': UM['bids']}


def okigwe_case():
    return {'dataset': 'OKIGWE (synthetic)', 'scope': OK['scope'],
            'program': OKC['duration']['program'],
            'costItems': OKS['items'], 'partners': OKS['partners'],
            'criteria': OKT['criteria'], 'bids': OKT['bids']}


CASE_NAME = {'beginner': 'onitsha_case.json', 'intermediate': 'umuahia_case.json', 'advanced': 'okigwe_case.json'}
CASE_OBJ = {'beginner': onitsha_case(), 'intermediate': umuahia_case(), 'advanced': okigwe_case()}
CASES = {t: [(CASE_NAME[t], json.dumps(CASE_OBJ[t], indent=1, ensure_ascii=False) + '\n')] for t in TIERS}

# EVERY DATA POINT THE ENGINE RAN IS IN ITS CASE FILE, value for value and in order.
CHECKED = 0
for t, pairs in (('beginner', [('criteria', ON['criteria']), ('bids', ON['bids'])]),
                 ('intermediate', [('criteria', UM['criteria']), ('contentItems', UM['ncItems']), ('bids', UM['bids'])]),
                 ('advanced', [('program', OKC['duration']['program']), ('program', OKS['program']), ('costItems', OKS['items']),
                               ('partners', OKS['partners']), ('criteria', OKT['criteria']), ('bids', OKT['bids'])])):
    got = json.loads(CASES[t][0][1])
    for k, v in pairs:
        if got.get(k) != v:
            bad.append(f'{CASE_NAME[t]}: {k} is not what the engine ran')
        CHECKED += 1

# ---------------------------------------------------------------------------
# The eighteen graded fields.
# ---------------------------------------------------------------------------
LABELS = {
    'onitsha_on3_technical_percent': ("ON3's technical percentage", 'percent'),
    'onitsha_on2_corrected_price': ("ON2's corrected price", 'money'),
    'onitsha_on3_omission_amount': ("The amount added for ON3's omitted item", 'money'),
    'onitsha_on1_evaluated_cost': ("ON1's evaluated cost", 'money'),
    'onitsha_on2_commercial_score': ("ON2's commercial score", 'points out of 100'),
    'onitsha_top_combined_score': ('The combined score of the most advantageous bid', 'points out of 100'),
    'umuahia_um2_life_cycle_cost': ("UM2's life-cycle cost", 'money'),
    'umuahia_um4_evaluated_cost': ("UM4's evaluated cost", 'money'),
    'umuahia_alb_limit': ('The relative ALB limit, the mean less one population standard deviation', 'money'),
    'umuahia_um3_overall_content': ("UM3's overall Nigerian content", 'percent'),
    'umuahia_s14_lead_points': ('The s.14 lead, read as percentage points', 'percentage points'),
    'umuahia_s14_lead_relative': ("The s.14 lead, read as percent of the runner-up's content", 'percent'),
    'okigwe_dayrate_mean_cost': ("The day rate's mean company cost", 'money'),
    'okigwe_reimbursable_p90_cost': ("The reimbursable contract's P90 company cost, the LOW cost", 'money'),
    'okigwe_dayrate_company_pays': ('What the company pays of the overrun under the day rate', 'money'),
    'okigwe_should_cost_estimate': ('The should-cost estimate', 'money'),
    'okigwe_operator_amount': ("The operator's share of the estimate", 'money'),
    'okigwe_award_ratio': ("The awarded bid's evaluated cost over the estimate", 'ratio'),
}
if set(LABELS) != set(KEYS):
    bad.append('LABELS and fields.json name different fields')

# ---------------------------------------------------------------------------
# The prompts, rendered from the engine's own inputs and stated settings.
# ---------------------------------------------------------------------------
TIEBREAK = 'ties at twelve significant digits go to the lower evaluated cost, then the earlier receipt, then the bidder id'
ONS, UMS = ON['schedule'], UM['schedule']
ONITSHA_TEXT = (
    f"ONITSHA is a synthetic two-envelope tender, {ON['tender']}: {ON['scope']}, with {n(len(ON['bids']))} bids, "
    f"{span(ON['bids'])}. One case file comes with this capstone. {CASE_NAME['beginner']} carries the criteria "
    f"(id, weight and maxScore), and each bid's receipt time, mandatory requirements, scores, priced bill lines "
    f"(quantity, unit rate, quoted amount, and a decimalMisplaced flag where the evaluator recorded one), discount, "
    f"priced deviations, omitted items and completion weeks. The settings: the pass mark {n(ON['passMark'])}; "
    f"the arithmetic tolerance at the engine default; an omitted item priced at the {ON['omissionRule']} of the "
    f"corrected amounts the other responsive bids quote; completion beyond minWeeks {n(ONS['minWeeks'])} adds "
    f"ratePerWeek {n(ONS['ratePerWeek'])} of the corrected price less the discount a week, no credit is given for "
    f"earlier completion and beyond maxWeeks {n(ONS['maxWeeks'])} a bid is rejected; the award is {ON['award']} at "
    f"technical weight {n(ON['technicalWeight'])}, with the {ON['priceMethod']} commercial score and the "
    f"{ON['technicalMethod']} technical score; {TIEBREAK}.")
UMUAHIA_TEXT = (
    f"UMUAHIA is a synthetic materials tender, {UM['tender']}: {UM['scope']}, with {n(len(UM['bids']))} bids, "
    f"{span(UM['bids'])}. One case file comes with this capstone. {CASE_NAME['intermediate']} carries the "
    f"criteria, each bid's receipt time, mandatory requirements, scores, bill lines, omitted items, delivery "
    f"weeks, annual valve maintenance costs (years 1 to {n(UM['lifeCycle']['years'])}), residual value where one "
    f"is stated, and Nigerian content by item, and the content items with the line of the 2010 Schedule each "
    f"falls under. The settings: the pass mark {n(UM['passMark'])}; an omitted item priced at the "
    f"{UM['omissionRule']} of the other responsive bids; delivery beyond minWeeks {n(UMS['minWeeks'])} adds "
    f"ratePerWeek {n(UMS['ratePerWeek'])} a week, beyond maxWeeks {n(UMS['maxWeeks'])} rejected; the life cycle "
    f"{n(UM['lifeCycle']['years'])} years at a discountRate of {n(UM['lifeCycle']['discountRate'])}, end-of-year "
    f"discounting, the residual value credited in the last year; the award is the lowest evaluated cost; "
    f"{TIEBREAK}. Each bid's overall Nigerian content weights its items by {UM['ncWeights']}. The abnormally low "
    f"bid test runs on the evaluated costs of the substantially responsive bids. Section 14 of the Act is read "
    f"with its group as the bids within 1 percent of the lowest evaluated cost and the closest competitor as the "
    f"next-highest content in the group.")
OKIGWE_TEXT = (
    f"OKIGWE is a synthetic job: {OK['scope']}. One case file comes with this capstone. "
    f"{CASE_NAME['advanced']} carries the activity programme, the company's cost items and its partners with "
    f"their working interests, and a tender for the job: its criteria and {n(len(OKT['bids']))} bids, "
    f"{span(OKT['bids'])}. The contract settings: the NPT fraction triangular with min "
    f"{n(OKC['duration']['nptFrac']['min'])}, mode {n(OKC['duration']['nptFrac']['mode'])} and max "
    f"{n(OKC['duration']['nptFrac']['max'])} (days are the programme's productive days times one plus the NPT "
    f"fraction); the contractor's daily cost triangular with min {n(OKC['dailyCost']['min'])}, mode "
    f"{n(OKC['dailyCost']['mode'])} and max {n(OKC['dailyCost']['max'])}; the fixed cost {n(OKC['fixedCost'])}; "
    f"the lump sum {n(OKC['lumpSum']['price'])}; the day rate {n(OKC['dayRate']['rate'])} a day plus a "
    f"mobilisation fee of {n(OKC['dayRate']['mobilisationFee'])}; the reimbursable contract at cost plus "
    f"{n(OKC['reimbursable']['feeFraction'])} of cost; the plan at the modes; {n(OKC['iterations'])} iterations "
    f"on seed {n(OKC['seed'])}. The should-cost settings: the NPT fraction {n(OKS['nptFrac'])}, contingency "
    f"{n(OKS['contingencyFrac'])} of the base, the band from {n(OKS['band']['low'])} to "
    f"{n(OKS['band']['high'])}. The tender settings: the pass mark {n(OKT['passMark'])}; an omitted item priced "
    f"at the {OKT['omissionRule']}; completion beyond minWeeks {n(OKT['schedule']['minWeeks'])} adds ratePerWeek "
    f"{n(OKT['schedule']['ratePerWeek'])} a week, beyond maxWeeks {n(OKT['schedule']['maxWeeks'])} rejected; the "
    f"award is {OKT['award']} at technical weight {n(OKT['technicalWeight'])}, with the {OKT['priceMethod']} "
    f"commercial score and the {OKT['technicalMethod']} technical score; {TIEBREAK}.")

TIER = {
    'beginner': (
        'associate',
        f"ONITSHA, {n(len(ON['bids']))} well services bids in two envelopes",
        'Two envelopes, by hand',
        ONITSHA_TEXT + " Report six values: ON3's technical percentage; ON2's corrected price after arithmetic "
                       "correction; the amount added to ON3 for the item it omits; ON1's evaluated cost; ON2's "
                       "commercial score; and the combined score of the most advantageous bid. All six to six decimals."),
    'intermediate': (
        'professional',
        f"UMUAHIA, {n(len(UM['bids']))} materials bids, a life cycle and the content Act",
        'The lowest evaluated cost and the content Act',
        UMUAHIA_TEXT + " Report six values: UM2's life-cycle cost; UM4's evaluated cost; the limit of the "
                       "abnormally low bid test (the mean of the responsive bids' evaluated costs less one "
                       "population standard deviation); UM3's overall Nigerian content; the s.14 lead of the "
                       "highest content in the group over its closest competitor read as percentage points; and "
                       "the same lead read as a percent of the closest competitor's content. All six to six decimals."),
    'advanced': (
        'expert',
        'OKIGWE, one workover under three contract types, its should-cost and its tender',
        'Contracts, should-cost and the whole tender',
        OKIGWE_TEXT + " Report six values: the day rate's mean company cost; the reimbursable contract's P90 "
                      "company cost, where P90 means a 90 percent probability the cost meets or exceeds the value, "
                      "so it is the LOW cost; what the company pays of the expected overrun under the day rate; the "
                      "should-cost estimate; the operator's share of it; and the ratio of the awarded bid's evaluated "
                      "cost to the estimate. All six to six decimals."),
}
PROMPTS = {t: TIER[t][3] for t in TIERS}

# --------------------------------------------------------------- self checks
NUMS = {t: re.findall(r'(?<![\d.])\d+(?:\.\d+)?(?!\d|\.\d)', PROMPTS[t]) for t in TIERS}
for tier, pairs in (('beginner', [('passMark', ON['passMark']), ('minWeeks', ONS['minWeeks']), ('maxWeeks', ONS['maxWeeks']),
                                  ('ratePerWeek', ONS['ratePerWeek']), ('technicalWeight', ON['technicalWeight'])]),
                    ('intermediate', [('passMark', UM['passMark']), ('minWeeks', UMS['minWeeks']), ('maxWeeks', UMS['maxWeeks']),
                                      ('ratePerWeek', UMS['ratePerWeek']), ('years', UM['lifeCycle']['years']),
                                      ('discountRate', UM['lifeCycle']['discountRate'])]),
                    ('advanced', [('npt min', OKC['duration']['nptFrac']['min']), ('npt mode', OKC['duration']['nptFrac']['mode']),
                                  ('npt max', OKC['duration']['nptFrac']['max']), ('daily min', OKC['dailyCost']['min']),
                                  ('daily mode', OKC['dailyCost']['mode']), ('daily max', OKC['dailyCost']['max']),
                                  ('fixedCost', OKC['fixedCost']), ('lumpSum', OKC['lumpSum']['price']),
                                  ('dayRate', OKC['dayRate']['rate']), ('mobilisation', OKC['dayRate']['mobilisationFee']),
                                  ('feeFraction', OKC['reimbursable']['feeFraction']), ('iterations', OKC['iterations']),
                                  ('seed', OKC['seed']), ('sc npt', OKS['nptFrac']), ('contingency', OKS['contingencyFrac']),
                                  ('band low', OKS['band']['low']), ('band high', OKS['band']['high']),
                                  ('tender passMark', OKT['passMark']), ('tender technicalWeight', OKT['technicalWeight'])])):
    for k, v in pairs:
        if n(v) not in NUMS[tier]:
            bad.append(f'{tier} prompt does not state {k} = {n(v)}, which the engine ran')
for tier, words in (('beginner', [ON['omissionRule'], ON['priceMethod'], ON['technicalMethod'], 'no credit', TIEBREAK]),
                    ('intermediate', [UM['omissionRule'], 'residual value credited in the last year', 'population standard deviation',
                                      'percentage points', "closest competitor's content", 'within 1 percent', UM['ncWeights']]),
                    ('advanced', ['plan at the modes', 'the LOW cost', OKT['priceMethod'], OKT['technicalMethod'], TIEBREAK])):
    for w in words:
        if w not in PROMPTS[tier]:
            bad.append(f'{tier} prompt does not state "{w}"')
if OKS['nptFrac'] != OKC['duration']['nptFrac']['mode'] or OKS['program'] != OKC['duration']['program']:
    bad.append('OKIGWE: the should-cost does not run the contract programme at the NPT mode, as the prompt implies')
for tier in TIERS:
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
    if re.search(r'\bP90\b[^.]{0,40}\b(?:high|highest|upper)\b(?! cost is P10)', text) and 'LOW' not in text:
        out.append(f'{label} reads a cost P90 as the high cost')
    if re.search('[–—]', text):
        out.append(f'{label} carries an en or em dash')
    if re.search(r',\s+not\s+\w', text):
        out.append(f'{label} carries an "X, not Y" contrastive')
    return out


for label, text in READ:
    bad.extend(vocabulary(label, text))
for plant, rule in (('an AI-powered tender', 'AI claim'), ('the P90 is the high cost', 'reversed P90'),
                    ('a bid — late', 'dash'), ('the evaluated cost, not the price', 'contrastive')):
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
DIGEST_NUMS = sorted({abs(float(tok)) for tok in NUM.findall(open(f'{W}/digest.txt', encoding='utf-8').read())})
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
-- SC2: Procurement, Tendering & Contracting joins the catalogue, the SECOND
-- course of the Supply Chain module. AN ENGINE COURSE: there is no Suite app;
-- the practicals run in the course's own calculator panels.
--
-- Catalogue row (module 'supply_chain'; path_order {PATH_ORDER}; prereq_slug
-- NULL, the lead's decision; school left at its default) plus the three
-- capstones and their eighteen graded fields, generated by
-- tools/course-waves/procurement/gen_course.py from the ENGINE'S OWN RUN
-- (sc2_capstone.mjs through the vendored engines/supplychain/tender.js), which
-- it refuses to write unless fields.json carries exactly that run's values
-- and the tolerance gradedTolerance.js derives. Deep seeds are three separate
-- migrations; the go-live is a fifth and is HELD until a NextGen production
-- upload carries the route /dashboard/apps/procurement.
--
-- WHAT IS GRADED. ONITSHA (Associate) grades a technical percentage, a
-- corrected price, an omission at the average, an evaluated cost, a commercial
-- score and the top combined score; UMUAHIA (Professional) grades a
-- life-cycle cost, an evaluated cost, the relative ALB limit, an overall
-- Nigerian content and the s.14 lead under both readings; OKIGWE (Expert)
-- grades the day-rate mean cost, the reimbursable P90 cost (the LOW cost),
-- the company's part of the overrun, the should-cost estimate, the operator's
-- share and the award's ratio to the estimate. Every value is a return value
-- of the engine, and the data it was run on is in the case file the prompt
-- names.
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


INDEX_JS = ("// The procurement capstone case files, generated by tools/course-waves/procurement/gen_course.py\n"
            "// from the engine's own inputs (sc2_capstone.mjs --inputs). Only the capstone card\n"
            "// imports this module: no panel preloads a case, and the graded answers are not\n"
            "// stored anywhere in the app.\n")
for tier in TIERS:
    for fname, _ in CASES[tier]:
        INDEX_JS += f"import {ident(fname)} from './{fname}?raw';\n"
INDEX_JS += '\nexport const PROCUREMENT_CASE_FILES = {\n'
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
    print(f'gen_course: engine run 18 of 18 fields.json values equal what sc2_capstone.mjs returned through {ENGINES}, '
          f'every tolerance the one gradedTolerance.js derives; case-file data re-read and equal to the engine run: {CHECKED}; '
          f'prompt lengths {({t: len(PROMPTS[t]) for t in TIERS})}; digest numbers swept: {len(DIGEST_NUMS)}; numbers handed: {len(handed)}; '
          'handed + pairwise + digest collisions + settings + vocabulary + copy rule + precision: 0'
          + ('' if wrote else '; SELF CHECK ONLY, nothing written'))
