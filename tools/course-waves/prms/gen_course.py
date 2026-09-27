#!/usr/bin/env python3
"""Generate the EC11 course + capstone migration AND the capstone case files from
the ENGINE'S OWN RUN, so no expected value, no setting and no data point is
retyped.

Modelled on EC10's gen_course.py (itself EC9's, EC8's, EC7's, SC2's, D5's, D4's
and D3's), rewritten for EC11 prms: the three capstones are ABAGANA
(Associate), AWKUZU (Professional) and ISUOFIA (Expert), Ekene synthetic fields
built by prms_capstone.mjs through the vendored engines/economics/prms.js.

1. THE ENGINE IS RUN HERE. `node prms_capstone.mjs --json` is executed
   through the vendored engine (EC11_ENGINES) and the one tolerance module
   (EC11_TOLERANCE), and this file REFUSES unless fields.json carries exactly
   what that run returned: the same tier, key and value to the last bit, and
   the tolerance gradedTolerance.js derives.

2. THE DATA TRAVELS AS CASE FILES. A capstone is set on facts, chances,
   estimates, three technical forecasts year by year, prices, costs,
   distributions and movements, which a prompt can state in part but a learner
   should not retype. So `prms_capstone.mjs --inputs` is rendered into one JSON
   case file per tier under src/content/capstone-cases/prms/, keyed the way the
   calculator views read a pasted case: a view reads the block named after it,
   or after it and a colon and a name (classify:prospect, classify:lead,
   categorize:reserves, categorize:contingent; economicLimit;
   aggregate:reserves, aggregate:contingent, reconcile). A self check re-reads
   every case file and proves it carries exactly the data the engine ran.

3. EVERY SETTING IS STATED. Each prompt states the terms its six values were
   computed at, read from the engine's stated inputs, and a self check refuses
   a prompt that omits one: each project's facts and chances, each category
   set's class, method, unit and estimates, the economic-limit scalars (the
   effective year, the royalty and its form, the tax, the working interest, the
   licence, the basis, the discount rate, the BOE factor, the abandonment) with
   the forecasts, prices and costs in the case file, each project's
   distribution and chance, the correlation, the seed and the draws, and the
   reconciliation's opening, movements, stated closing and tolerance. Each
   prompt says that no value depends on a reading the engine states
   (prms_capstone.mjs and discriminate.mjs prove that) or on a Monte Carlo
   draw.

4. THE VOCABULARY AND THE COPY RULE ARE ENFORCED ON EVERY PROMPT, TITLE AND
   LABEL: no AI claim, no em or en dash, no "X, not Y" contrastive, no repair
   history.

5. THE PRECISION SENTENCE IN EACH PROMPT IS CHECKED AGAINST precision.json.
   Every EC11 class prints to six decimals, so every prompt asks for six.

THE TOLERANCES ARE READ, NEVER DECLARED. Capstone details stay out of the
lessons: gate_capstone_leak.mjs sweeps the lessons, banks and briefs for every
capstone name, label, index run, figure and value.

Usage:
   python3 gen_course.py                 the self checks only; writes nothing
   python3 gen_course.py --cases         write the three case files and index.js
   python3 gen_course.py --migration     also write the course migration
   EC11_WAVE        the wave directory (default /root/cat-wip-prms)
   EC11_REPO        the nextgen clone   (default /root/wt-ec11-nextgen)
   EC11_ENGINES     packages/engines to run the capstone through
   EC11_TOLERANCE   gradedTolerance.js
   EC11_COURSE_OUT  where to write the migration
   EC11_CASES_OUT   where to write the case files (default $EC11_REPO/src/content/capstone-cases/prms)
Importing this module runs the engine and the self checks and writes nothing.
"""
import json
import os
import re
import subprocess
import sys

W = os.environ.get('EC11_WAVE', '/root/cat-wip-prms')
REPO = os.environ.get('EC11_REPO', '/root/wt-ec11-nextgen')
ENGINES = os.environ.get('EC11_ENGINES', f'{REPO}/packages/engines')
TOLPATH = os.environ.get(
    'EC11_TOLERANCE', f'{REPO}/src/components/course/panels/prms/gradedTolerance.js')
DATE = '20261112'
OUT = os.environ.get('EC11_COURSE_OUT', f'{REPO}/migrations/{DATE}_ec11_prms_course.sql')
CASES_OUT = os.environ.get('EC11_CASES_OUT', f'{REPO}/src/content/capstone-cases/prms')

SLUG, MODULE, PATH_ORDER = 'prms', 'economics', 76
NAME = 'Reserves & Resources under SPE-PRMS 2018'
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


ENV = dict(os.environ, EC11_ENGINES=ENGINES, EC11_TOLERANCE=TOLPATH, EC11_WAVE_DIR=W, EC11_REPO=REPO, TZ='UTC', LC_ALL='C')


def node(*args, script=None):
    r = subprocess.run(['node', *([script] if script else []), *args],
                       capture_output=True, text=True, env=ENV)
    if r.returncode != 0:
        sys.exit(f'REFUSED: the engine run failed: {r.stderr.strip()[-400:]}')
    return r.stdout


ENGINE_ROWS = json.loads(node('--json', script=f'{W}/prms_capstone.mjs'))
INPUTS = json.loads(node('--inputs', script=f'{W}/prms_capstone.mjs'))
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

AB, AW, IS = INPUTS['ABAGANA'], INPUTS['AWKUZU'], INPUTS['ISUOFIA']


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
KEYS_OF = {'beginner': ('classify:prospect', 'classify:lead', 'categorize:reserves', 'categorize:contingent'),
           'intermediate': ('economicLimit',),
           'advanced': ('aggregate:reserves', 'aggregate:contingent', 'reconcile')}


def case_of(c, t):
    out = {'dataset': f"{c['name']} (synthetic)", 'label': c['label']}
    for k in KEYS_OF[t]:
        out[k] = c[k]
    return out


CASE_NAME = {'beginner': 'abagana_case.json', 'intermediate': 'awkuzu_case.json', 'advanced': 'isuofia_case.json'}
CASE_SRC = {'beginner': AB, 'intermediate': AW, 'advanced': IS}
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
    'abagana_prospect_pc_pct': ('The chance of commerciality of the Abagana Deep prospect', 'percent'),
    'abagana_lead_pc_pct': ('The chance of commerciality of the Abagana Shallow lead', 'percent'),
    'abagana_reserves_p2': ('The Probable (P2) increment of the Abagana Reserves', 'MMbbl'),
    'abagana_reserves_p3': ('The Possible (P3) increment of the Abagana Reserves', 'MMbbl'),
    'abagana_contingent_2c': ('The 2C of the Abagana Contingent Resources', 'MMboe'),
    'abagana_contingent_3c': ('The 3C of the Abagana Contingent Resources', 'MMboe'),
    'awkuzu_best_ncf_share': ("The best case's undiscounted net cash flow at the working interest", 'USD'),
    'awkuzu_best_npv_share': ("The best case's NPV at the working interest", 'USD'),
    'awkuzu_2p_net_oil': ('The 2P oil on the net-entitlement basis', 'bbl'),
    'awkuzu_p2_boe': ('The Probable (P2) increment in BOE', 'BOE'),
    'awkuzu_p3_boe': ('The Possible (P3) increment in BOE', 'BOE'),
    'awkuzu_high_beyond_licence_oil': ("The high case's oil beyond the licence, gross", 'bbl'),
    'isuofia_reserves_arith_1p': ('The arithmetic 1P of the Isuofia Reserves projects', 'MMbbl'),
    'isuofia_reserves_arith_3p': ('The arithmetic 3P of the Isuofia Reserves projects', 'MMbbl'),
    'isuofia_contingent_risked_mean': ('The risked mean of the Isuofia Contingent Resources', 'MMboe'),
    'isuofia_closing_1p': ('The computed closing 1P of the Isuofia reconciliation', 'MMbbl'),
    'isuofia_closing_3p': ('The computed closing 3P of the Isuofia reconciliation', 'MMbbl'),
    'isuofia_difference_2p': ('The 2P difference, the stated closing less the computed', 'MMbbl'),
}
if set(LABELS) != set(KEYS):
    bad.append('LABELS and fields.json name different fields')


# ---------------------------------------------------------------------------
# The prompts, rendered from the engine's own inputs and stated settings.
# ---------------------------------------------------------------------------
FREE = ("No value depends on any of the readings the engine states (the five-year benchmark, the economic test at exactly 0 and with "
        "abandonment, the economic-limit rule, the replacement ratio, the life index, the tolerance at its boundary, the Monte Carlo low) "
        "or on a Monte Carlo draw, and every input a value needs is stated in the case file: the engine holds no default for any of them.")

PR, LD, CR, CC = AB['classify:prospect'], AB['classify:lead'], AB['categorize:reserves'], AB['categorize:contingent']
EL = AW['economicLimit']
AR, AC, RC = IS['aggregate:reserves'], IS['aggregate:contingent'], IS['reconcile']


def chances_text(c):
    return f"a chance of geologic discovery of {n(c['chances']['geologicDiscoveryPct'])} percent and a chance of development of {n(c['chances']['developmentPct'])} percent"


def est_text(e):
    return ', '.join(f"{k} {n(v)}" for k, v in e.items())


def dist_text(p):
    d = p['distribution']
    if d['type'] == 'triangular':
        s = f"a triangular with min {n(d['min'])}, mode {n(d['mode'])} and max {n(d['max'])}"
    else:
        s = f"a {d['type']} with mean {n(d['mean'])} and standard deviation {n(d['stdDev'])}"
    if 'chanceOfCommercialityPct' in p:
        s += f", chance of commerciality {n(p['chanceOfCommercialityPct'])} percent"
    return f"{p['id']}: {s}"


def move_text(m):
    if m['type'] == 'production':
        return f"production of {n(m['quantity'])}"
    return f"{m['type']} of {n(m['low'])}, {n(m['best'])} and {n(m['high'])}"


AB_TEXT = (f"{AB['label']}. One case file comes with this capstone: {CASE_NAME['beginner']} carries four calls under the keys classify:prospect, classify:lead, "
           f"categorize:reserves and categorize:contingent; paste it into the classification calculator and choose the block each value needs. "
           f"The Abagana Deep prospect is undiscovered, with a project of established technology, sub-class {PR['subClass']}, and {chances_text(PR)}. "
           f"The Abagana Shallow lead is undiscovered, with a project of established technology, sub-class {LD['subClass']}, and {chances_text(LD)}. "
           f"The Abagana Reserves are stated {CR['method']}ly in {CR['unit']}: {est_text(CR['estimates'])}. "
           f"The Abagana Contingent Resources are stated {CC['method']}ly in {CC['unit']}: {est_text(CC['estimates'])}. {FREE}")
AW_TEXT = (f"{AW['label']}. One case file comes with this capstone: {CASE_NAME['intermediate']} carries one call under the key economicLimit; paste it into the reserves "
           f"calculator's economic limit view. The three technical forecasts (oil in barrels and gas in Mscf, one row a year from {n(EL['effectiveYear'])} to "
           f"{n(EL['forecasts']['low'][-1]['year'])}), the prices and the opex and capex rows are in the case file. Effective year {n(EL['effectiveYear'])}; "
           f"a royalty of {n(EL['royalty']['ratePct'])} percent as a {EL['royalty']['form']}; tax at {n(EL['tax']['ratePct'])} percent with "
           f"{n(EL['tax']['depreciationYears'])}-year straight-line allowances and lossCarryforward {n(EL['tax']['lossCarryforward'])}; a working interest of "
           f"{n(EL['workingInterestPct'])} percent; a licence expiring in {n(EL['licence']['expiryYear'])} with renewalExpected {n(EL['licence']['renewalExpected'])}; "
           f"the {EL['reportingBasis']} basis; a discount rate of {n(EL['discountRatePct'])} percent; {n(EL['mscfPerBoe'])} Mscf per BOE; an abandonment cost of "
           f"{n(EL['costs']['abandonment'])}. The undiscounted net cash flow is after tax and abandonment. {FREE}")
IS_TEXT = (f"{IS['label']}. One case file comes with this capstone: {CASE_NAME['advanced']} carries three calls under the keys aggregate:reserves, aggregate:contingent "
           f"and reconcile; paste it into the aggregation calculator and choose the block each value needs. The Reserves projects, aggregated at the {AR['level']} "
           f"level in {AR['unit']}: " + '; '.join(dist_text(p) for p in AR['projects']) + f"; a uniform correlation of {n(AR['correlation']['rho'])}, seed "
           f"{n(AR['seed'])}, {n(AR['iterations'])} draws. The Contingent Resources projects in {AC['unit']}: " + '; '.join(dist_text(p) for p in AC['projects'])
           + f"; a uniform correlation of {n(AC['correlation']['rho'])}, seed {n(AC['seed'])}, {n(AC['iterations'])} draws. The reconciliation of the Reserves in "
           f"{RC['unit']} over {n(RC['periodYears'])} year: opening {est_text(RC['opening'])}; movements " + '; '.join(move_text(m) for m in RC['movements'])
           + f"; stated closing {est_text(RC['closing'])}; tolerance {n(RC['tolerance'])}. {FREE}")

TIER = {
    'beginner': ('associate', 'ABAGANA, the resources of the Abagana licence (synthetic)', 'Classes, categories and the low estimate',
                 AB_TEXT + " Report six values: the chance of commerciality of the Abagana Deep prospect, in percent; the chance of commerciality of the Abagana Shallow lead, in percent; the Probable (P2) increment of the Reserves; the Possible (P3) increment of the Reserves; the 2C of the Contingent Resources; and the 3C of the Contingent Resources. All six to six decimals."),
    'intermediate': ('professional', 'AWKUZU, the economic limit of the Awkuzu field (synthetic)', 'Maturity, commerciality and the economic limit',
                     AW_TEXT + " Report six values: the best case's undiscounted net cash flow at the working interest; the best case's NPV at the working interest; the 2P oil on the net-entitlement basis; the Probable (P2) increment in BOE; the Possible (P3) increment in BOE; and the high case's oil beyond the licence, gross. All six to six decimals."),
    'advanced': ('expert', 'ISUOFIA, the aggregation and reconciliation of the Isuofia field (synthetic)', 'Aggregation, reconciliation and the limits',
                 IS_TEXT + " Report six values: the arithmetic 1P of the Reserves projects; the arithmetic 3P of the Reserves projects; the risked mean of the Contingent Resources; the computed closing 1P of the reconciliation; the computed closing 3P; and the 2P difference, the stated closing less the computed. All six to six decimals."),
}
PROMPTS = {t: TIER[t][3] for t in TIERS}

# --------------------------------------------------------------- self checks
NUMS = {t: re.findall(r'(?<![\d.])\d+(?:\.\d+)?(?!\d|\.\d)', PROMPTS[t]) for t in TIERS}
STATED = {
    'beginner': [PR['chances']['geologicDiscoveryPct'], PR['chances']['developmentPct'], LD['chances']['geologicDiscoveryPct'], LD['chances']['developmentPct']]
                + list(CR['estimates'].values()) + list(CC['estimates'].values()),
    'intermediate': [EL['effectiveYear'], EL['royalty']['ratePct'], EL['tax']['ratePct'], EL['tax']['depreciationYears'], EL['workingInterestPct'],
                     EL['licence']['expiryYear'], EL['discountRatePct'], EL['mscfPerBoe'], EL['costs']['abandonment']],
    'advanced': [x for p in AR['projects'] + AC['projects'] for k, x in p['distribution'].items() if k != 'type']
                + [p['chanceOfCommercialityPct'] for p in AC['projects']] + [AR['correlation']['rho'], AR['seed'], AR['iterations'], AC['correlation']['rho'], AC['seed'], AC['iterations']]
                + list(RC['opening'].values()) + list(RC['closing'].values()) + [RC['tolerance'], RC['periodYears']]
                + [m.get('quantity') for m in RC['movements'] if 'quantity' in m] + [abs(m[k]) for m in RC['movements'] if 'low' in m for k in ('low', 'best', 'high')],
}
for tier, vals in STATED.items():
    for v in vals:
        if n(v) not in NUMS[tier]:
            bad.append(f'{tier} prompt does not state {n(v)}, which the engine ran')
WORDS = {
    'beginner': [PR['subClass'], LD['subClass'], CR['method'], CC['method'], CR['unit'], CC['unit'], 'undiscovered', 'established technology'],
    'intermediate': [EL['royalty']['form'], EL['reportingBasis'], 'lossCarryforward', 'renewalExpected', 'after tax and abandonment'],
    'advanced': [AR['level'], AR['unit'], AC['unit'], RC['unit'], 'uniform correlation'] + [p['distribution']['type'] for p in AR['projects'] + AC['projects']]
                + [m['type'] for m in RC['movements']],
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
    if re.search(r',\s+not\s+\w|\brather than\b|,\s+never\b|\binstead of\b', text, re.I):
        out.append(f'{label} carries a contrastive')
    return out


for label, text in READ:
    bad.extend(vocabulary(label, text))
for plant, rule in (('an AI-powered estimate', 'AI claim'), ('the engine used to book', 'repair history'),
                    ('a reserve — new', 'dash'), ('the low estimate, not the high', 'contrastive'), ('the P90 rather than the P10', 'rather than')):
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
-- EC11: Reserves & Resources under SPE-PRMS 2018 joins the catalogue in the
-- Economics & Commercial module. AN ENGINE COURSE: there is no Suite app; the
-- practicals run in the course's own calculator panels.
--
-- Catalogue row (module 'economics'; path_order {PATH_ORDER}; prereq_slug NULL,
-- the lead's decision; school left at its default) plus the three capstones and
-- their eighteen graded fields, generated by tools/course-waves/prms/gen_course.py
-- from the ENGINE'S OWN RUN (prms_capstone.mjs through the vendored
-- engines/economics/prms.js, petrolord-engines bb8ef5f), which it refuses to
-- write unless fields.json carries exactly that run's values and the tolerance
-- gradedTolerance.js derives. Deep seeds are three separate migrations; the
-- go-live is a fifth and is HELD until a NextGen production upload carries the
-- route /dashboard/apps/prms.
--
-- WHAT IS GRADED. ABAGANA (Associate) grades the chance of commerciality of a
-- prospect and of a lead, the Probable and Possible increments of a Reserves
-- set and the 2C and 3C of a Contingent Resources set; AWKUZU (Professional)
-- grades the best case's undiscounted net cash flow and NPV at the working
-- interest, the 2P net entitlement oil, the P2 and P3 increments in BOE with
-- the low case failing, and the high case's oil beyond the licence; ISUOFIA
-- (Expert) grades the arithmetic 1P and 3P of three Reserves projects, the
-- risked mean of three Contingent Resources projects and a reconciliation's
-- computed closing 1P and 3P and 2P difference. Every value is a return value
-- of the engine, identical under every reading the engine states and never a
-- Monte Carlo draw, and the data it was run on is in the case file the prompt
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


INDEX_JS = ("// The prms capstone case files, generated by tools/course-waves/prms/gen_course.py\n"
            "// from the engine's own inputs (prms_capstone.mjs --inputs). Only the capstone card\n"
            "// imports this module: no panel preloads a case, and the graded answers are not\n"
            "// stored anywhere in the app.\n")
for tier in TIERS:
    for fname, _ in CASES[tier]:
        INDEX_JS += f"import {ident(fname)} from './{fname}?raw';\n"
INDEX_JS += '\nexport const PRMS_CASE_FILES = {\n'
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
    print(f'gen_course: engine run 18 of 18 fields.json values equal what prms_capstone.mjs returned through {ENGINES}, '
          f'every tolerance the one gradedTolerance.js derives; case-file data re-read and equal to the engine run: {CHECKED}; '
          f'prompt lengths {({t: len(PROMPTS[t]) for t in TIERS})}; digest numbers swept: {len(DIGEST_NUMS)}; numbers handed: {len(handed)}; '
          'handed + pairwise + digest collisions + settings + vocabulary + copy rule + precision: 0'
          + ('' if wrote else '; SELF CHECK ONLY, nothing written'))
