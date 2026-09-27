#!/usr/bin/env python3
"""Generate the EC9 course + capstone migration AND the capstone case files from
the ENGINE'S OWN RUN, so no expected value, no setting and no data point is
retyped.

Modelled on EC8's gen_course.py (itself EC7's, SC2's, D5's, D4's and D3's),
rewritten for EC9 joa: the three capstones are IDUMU (Associate), OKWELLE
(Professional) and ABIAMA (Expert), Ekene synthetic joint ventures built by
joa_capstone.mjs through the vendored engines/economics/jointVenture.js.

1. THE ENGINE IS RUN HERE. `node joa_capstone.mjs --json` is executed through
   the vendored engine (EC9_ENGINES) and the one tolerance module
   (EC9_TOLERANCE), and this file REFUSES unless fields.json carries exactly
   what that run returned: the same tier, key and value to the last bit, and
   the tolerance gradedTolerance.js derives.

2. THE DATA TRAVELS AS CASE FILES. A capstone is set on agreement terms,
   months of cash calls, budgets, scales and years of costs and entitlement,
   which a prompt can state in part but a learner should not retype. So
   `joa_capstone.mjs --inputs` is rendered into one JSON case file per tier
   under src/content/capstone-cases/joa/, keyed the way the calculator views
   read a pasted case (interests, cashCalls, budget, overhead; carry, backIn,
   default, psc; soleRisk, buyIn). A self check re-reads every case file and
   proves it carries exactly the data the engine ran.

3. EVERY SETTING IS STATED. Each prompt states the terms its six values were
   computed at, read from the engine's stated inputs, and a self check refuses
   a prompt that omits one: the carry and its carriers, the reconciliation lag,
   the negative call rule and the threshold, the tolerances, the uplift, the
   recovery share and the basis, the interest rate, method, day basis and
   grace, the premium multiple and mode, the cost oil limit and its base, the
   discount rate and base year. Each prompt says that no value depends on a
   reading the engine states (joa_capstone.mjs and discriminate.mjs prove
   that).

4. THE VOCABULARY AND THE COPY RULE ARE ENFORCED ON EVERY PROMPT, TITLE AND
   LABEL: no AI claim, no em or en dash, no "X, not Y" contrastive, no repair
   history.

5. THE PRECISION SENTENCE IN EACH PROMPT IS CHECKED AGAINST precision.json.
   Every EC9 class prints to six decimals, so every prompt asks for six.

THE TOLERANCES ARE READ, NEVER DECLARED. Capstone details stay out of the
lessons: gate_capstone_leak.mjs sweeps the lessons, banks and briefs for every
capstone name, label, index run, figure and value.

Usage:
   python3 gen_course.py                 the self checks only; writes nothing
   python3 gen_course.py --cases         write the three case files and index.js
   python3 gen_course.py --migration     also write the course migration
   EC9_WAVE        the wave directory (default /root/cat-wip-joa)
   EC9_REPO        the nextgen clone   (default /root/wt-ec9-nextgen)
   EC9_ENGINES     packages/engines to run the capstone through
   EC9_TOLERANCE   gradedTolerance.js
   EC9_COURSE_OUT  where to write the migration
   EC9_CASES_OUT   where to write the case files (default $EC9_REPO/src/content/capstone-cases/joa)
Importing this module runs the engine and the self checks and writes nothing.
"""
import json
import os
import re
import subprocess
import sys

W = os.environ.get('EC9_WAVE', '/root/cat-wip-joa')
REPO = os.environ.get('EC9_REPO', '/root/wt-ec9-nextgen')
ENGINES = os.environ.get('EC9_ENGINES', f'{REPO}/packages/engines')
TOLPATH = os.environ.get(
    'EC9_TOLERANCE', f'{REPO}/src/components/course/panels/joa/gradedTolerance.js')
DATE = '20261110'
OUT = os.environ.get('EC9_COURSE_OUT', f'{REPO}/migrations/{DATE}_ec9_joa_course.sql')
CASES_OUT = os.environ.get('EC9_CASES_OUT', f'{REPO}/src/content/capstone-cases/joa')

SLUG, MODULE, PATH_ORDER = 'joa', 'economics', 74
NAME = 'Joint Ventures, Operating Agreements & Cost Recovery'
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


ENV = dict(os.environ, EC9_ENGINES=ENGINES, EC9_TOLERANCE=TOLPATH, EC9_WAVE_DIR=W, EC9_REPO=REPO, TZ='UTC', LC_ALL='C')


def node(*args, script=None):
    r = subprocess.run(['node', *([script] if script else []), *args],
                       capture_output=True, text=True, env=ENV)
    if r.returncode != 0:
        sys.exit(f'REFUSED: the engine run failed: {r.stderr.strip()[-400:]}')
    return r.stdout


ENGINE_ROWS = json.loads(node('--json', script=f'{W}/joa_capstone.mjs'))
INPUTS = json.loads(node('--inputs', script=f'{W}/joa_capstone.mjs'))
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

ID, OK, AB = INPUTS['IDUMU'], INPUTS['OKWELLE'], INPUTS['ABIAMA']


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
KEYS_OF = {'beginner': ('interests', 'cashCalls', 'budget', 'overhead'),
           'intermediate': ('carry', 'cashCalls', 'backIn', 'default', 'psc'),
           'advanced': ('soleRisk', 'buyIn', 'carry', 'psc', 'default')}


def case_of(c, t):
    out = {'dataset': f"{c['name']} (synthetic)", 'label': c['label']}
    for k in KEYS_OF[t]:
        out[k] = c[k]
    return out


CASE_NAME = {'beginner': 'idumu_case.json', 'intermediate': 'okwelle_case.json', 'advanced': 'abiama_case.json'}
CASE_SRC = {'beginner': ID, 'intermediate': OK, 'advanced': AB}
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
    'idumu_zed_paying_pct': ("ZED's paying interest while SNP is carried", 'percent'),
    'idumu_zed_june_call': ("ZED's cash call for June 2029", 'USD'),
    'idumu_zed_august_paid': ('What ZED pays in August 2029, its call and any arrears billing', 'USD'),
    'idumu_budget_allowed_overrun': ('The allowed overrun of the 2029 budget', 'USD'),
    'idumu_operating_overhead': ('The operating overhead charge for 2031', 'USD'),
    'idumu_development_overhead': ('The development overhead charge for 2031', 'USD'),
    'okwelle_2031_carry_balance': ('The carry balance carried out of 2031', 'USD'),
    'okwelle_backin_refund_to_pra': ('The back-in refund PRA receives', 'USD'),
    'okwelle_default_interest': ("The default interest on PRA's unpaid share", 'USD'),
    'okwelle_default_cover_oko': ("OKO's cover of the unpaid amount", 'USD'),
    'okwelle_prb_june_call': ("PRB's cash call for June 2030", 'USD'),
    'okwelle_2032_cost_recovered': ('The cost recovered in 2032 under the PSC', 'USD'),
    'abiama_spb_premium': ("SPB's non-consent premium", 'USD'),
    'abiama_spb_2036_receipt': ("What SPB receives of its share of the sidetrack's net value in 2036", 'USD'),
    'abiama_buy_in_to_spa': ("SPA's part of SNC's buy-in payment", 'USD'),
    'abiama_spa_carry_npv': ("SPA's NPV under the carry", 'USD'),
    'abiama_2035_government_profit_oil': ('The government profit oil of 2035', 'USD'),
    'abiama_abo_after_forfeiture_pct': ("ABO's participating interest if SPB's interest is assigned", 'percent'),
}
if set(LABELS) != set(KEYS):
    bad.append('LABELS and fields.json name different fields')


# ---------------------------------------------------------------------------
# The prompts, rendered from the engine's own inputs and stated settings.
# ---------------------------------------------------------------------------
FREE = ("No value depends on any of the three readings the engine states (the PSC income tax on the contractor's profit oil, "
        "interest from the due date once a grace is exceeded, the default cover by paying interest), and every term a value needs is "
        "stated in the case file: the engine holds no default for any of them.")


def parties_text(ps):
    return ', '.join(f"{p['id']} {n(p['participatingPct'])} percent" for p in ps)


def carry_text(cs):
    return '; '.join(f"{c['carried']} is carried for {n(c['carriedPct'])} percent of its cost share, "
                     f"{'pro rata by the other parties (pro-rata)' if c['carriers'] == 'pro-rata' else 'in stated shares'}" for c in cs)


def cc_text(c):
    s = (f"The cash calls run {c['months'][0]['month']} to {c['months'][-1]['month']}: the difference of a called month adjusts the call "
         f"{n(c['reconciliationLagMonths'])} month{'' if c['reconciliationLagMonths'] == 1 else 's'} later (reconciliationLagMonths {n(c['reconciliationLagMonths'])}), "
         f"an adjustment above a forecast share is {'refunded as a negative call' if c['negativeCall'] == 'refund' else 'carried to the next call'} (negativeCall {c['negativeCall']})")
    s += f", and no cash call is made in a month whose forecast is below {n(c['noCallBelow'])} (noCallBelow)." if 'noCallBelow' in c else ', and every month is called.'
    return s


def scale_text(sc):
    out = []
    for cat, s in sc.items():
        bands = ', '.join(f"{n(b['pct'])} percent up to {n(b['upTo'])}" for b in s['bands'])
        out.append(f"{cat}: {bands}, {n(s['abovePct'])} percent above")
    return '; '.join(out)


def uplift_text(u):
    if u['type'] == 'compound':
        return f"a compound uplift of {n(u['ratePctPerYear'])} percent a year on the opening balance (uplift compound)"
    if u['type'] == 'multiple':
        return f"a multiple uplift of {n(u['multiplePct'])} percent of each year's carried cost (uplift multiple)"
    return 'no uplift (uplift none)'


def interest_text(i):
    return (f"default interest at {n(i['annualRatePct'])} percent a year on a {n(i['dayBasis'])}-day basis, "
            f"{'simple' if i['interestMethod'] == 'simple' else 'compounded monthly'} (interestMethod {i['interestMethod']}), "
            f"with a grace of {n(i['graceHours'])} hours (graceHours {n(i['graceHours'])})")


def conseq_text(d):
    out = []
    for k, what in (('suspension', 'suspension'), ('forfeiture', 'forfeiture')):
        if k in d:
            c = d[k]
            out.append(f"{what} after {n(c['after'])} {c['unit'].replace('-', ' ')} ({c['unit']}) from {c['from']}")
    return ', '.join(out)


def psc_text(p):
    s = (f"The production sharing terms: royalty {n(p['royaltyPct'])} percent of gross, a cost oil limit of {n(p['costOilLimitPct'])} percent of "
         f"{'gross revenue' if p['costOilLimitBase'] == 'gross' else 'revenue after royalty'} (costOilLimitBase {p['costOilLimitBase']}), "
         f"a contractor profit share of {n(p['contractorProfitSharePct'])} percent")
    if any('contractorProfitSharePct' in y for y in p['years']):
        s += ' except where a year states its own share in the case file'
    s += f", tax {n(p['taxRatePct'])} percent, an opening cost pool of {n(p['openingCostPool'])}."
    return s


D0 = ID['budget']
ID_TEXT = (f"{ID['label']}. One case file comes with this capstone: {CASE_NAME['beginner']} carries four calls under the keys interests, cashCalls, budget and overhead; "
           f"paste it into the account calculator, whose views each read the key they need. The parties are {parties_text(ID['interests']['parties'])}; "
           f"{carry_text(ID['interests']['carries'])}. {cc_text(ID['cashCalls'])} "
           f"The 2029 budget allows each item {n(D0['itemTolerancePct'])} percent over its approval (itemTolerancePct) and the budget the lower of "
           f"{n(D0['budgetTolerance']['pct'])} percent of the approved total and {n(D0['budgetTolerance']['amount'])} (budgetTolerance), with an unbudgeted allowance of "
           f"{n(D0['unbudgetedAllowance'])}. The 2031 overhead is charged on each category's cost less its stated exclusions ({', '.join(f'{k} {n(v)}' for k, v in ID['overhead']['excluded'].items())}) "
           f"on a marginal scale: {scale_text(ID['overhead']['scale'])}. {FREE}")
OC, OB, OD = OK['carry'], OK['backIn'], OK['default']
OK_TEXT = (f"{OK['label']}. One case file comes with this capstone: {CASE_NAME['intermediate']} carries five calls under the keys carry, cashCalls, backIn, default and psc; "
           f"paste it into the recovery calculator. The parties are {parties_text(OC['parties'])}; {carry_text(OC['carries'])}. "
           f"The carry is recovered from at most {n(OC['recoverFromPct'])} percent of {OC['carried']}'s share of each year's entitlement (recoverFromPct), with {uplift_text(OC['uplift'])}, "
           f"no cap, under the contract's own terms (basis {OC['basis']}). {cc_text(OK['cashCalls'])} "
           f"{OB['backInParty']} backs in to {n(OB['targetPct'])} percent under PIA 2021 s.85(4) (basis {OB['basis']}), its refund recovered from {n(OB['recoverFromPct'])} percent of its new share of future entitlement (refundForm {OB['refundForm']}). "
           f"On the {n(OD['callTotal'])} cash call due {OD['dueDate']}, {OD['defaulters'][0]['id']} pays {n(OD['defaulters'][0]['paid'])} and cures on {OD['defaulters'][0]['curedOn']}; "
           f"{interest_text(OD['interest'])}; {conseq_text(OD)}; no carry is live on that call. {psc_text(OK['psc'])} {FREE}")
AS, AY, AC, AD = AB['soleRisk'], AB['buyIn'], AB['carry'], AB['default']
AB_TEXT = (f"{AB['label']}. One case file comes with this capstone: {CASE_NAME['advanced']} carries five calls under the keys soleRisk, buyIn, carry, psc and default; "
           f"paste it into the agreement calculator. The parties are {parties_text(AS['parties'])}. "
           f"{', '.join(p for p in [x['id'] for x in AS['parties']] if p not in AS['consenting'])} declines the {AS['operation']['name']}, and the consenting parties recover "
           f"{n(AS['premiumMultiplePct'])} percent of its proportionate share of the cost from its share of the operation's net value (mode {AS['mode']}). "
           f"{', '.join(p for p in [x['id'] for x in AY['parties']] if p not in AY['consenting'])} declines the {AY['operation']['name']} and enters it by paying "
           f"{n(AY['premiumMultiplePct'])} percent of its proportionate share (mode {AY['mode']}). {carry_text(AC['carries'])}, recovered from {n(AC['recoverFromPct'])} percent of its share of each year's entitlement "
           f"with {uplift_text(AC['uplift'])}, under the contract's own terms (basis {AC['basis']}); every party's net cash flow is discounted at {n(AC['discountRate'])} to {n(AC['baseYear'])}, year-end flows. "
           f"{psc_text(AB['psc'])} On the {n(AD['callTotal'])} cash call due {AD['dueDate']}, {AD['defaulters'][0]['id']} pays {n(AD['defaulters'][0]['paid'])} and is still in default at {AD['asOf']}; "
           f"{interest_text(AD['interest'])}; {conseq_text(AD)}. {FREE}")

TIER = {
    'beginner': ('associate', 'IDUMU, the Idumu satellite joint venture (synthetic)', 'Interests and the joint account',
                 ID_TEXT + " Report six values: ZED's paying interest while SNP is carried; ZED's cash call for June 2029; what ZED pays in August 2029; the allowed overrun of the 2029 budget; and the operating and the development overhead charges for 2031. All six to six decimals."),
    'intermediate': ('professional', 'OKWELLE, the Okwelle gas-condensate joint venture (synthetic)', 'Recovery, default and cost recovery',
                     OK_TEXT + " Report six values: the carry balance carried out of 2031; the back-in refund PRA receives; the default interest on PRA's unpaid share; OKO's cover of the unpaid amount; PRB's cash call for June 2030; and the cost recovered in 2032 under the PSC. All six to six decimals."),
    'advanced': ('expert', 'ABIAMA, the Abiama deepwater joint venture (synthetic)', 'Sole risk, the readings and reading the engine',
                 AB_TEXT + " Report six values: SPB's non-consent premium; what SPB receives of its share of the sidetrack's net value in 2036; SPA's part of SNC's buy-in payment; SPA's NPV under the carry; the government profit oil of 2035; and ABO's participating interest if SPB's interest is assigned. All six to six decimals."),
}
PROMPTS = {t: TIER[t][3] for t in TIERS}

# --------------------------------------------------------------- self checks
NUMS = {t: re.findall(r'(?<![\d.])\d+(?:\.\d+)?(?!\d|\.\d)', PROMPTS[t]) for t in TIERS}
STATED = {
    'beginner': [ID['cashCalls']['reconciliationLagMonths'], ID['cashCalls']['noCallBelow'], D0['itemTolerancePct'], D0['budgetTolerance']['pct'], D0['budgetTolerance']['amount'], D0['unbudgetedAllowance'],
                 ID['interests']['carries'][0]['carriedPct']] + [p['participatingPct'] for p in ID['interests']['parties']]
                + [b['pct'] for s in ID['overhead']['scale'].values() for b in s['bands']] + [b['upTo'] for s in ID['overhead']['scale'].values() for b in s['bands']]
                + [s['abovePct'] for s in ID['overhead']['scale'].values()] + list(ID['overhead']['excluded'].values()),
    'intermediate': [OC['recoverFromPct'], OC['uplift']['ratePctPerYear'], OK['cashCalls']['reconciliationLagMonths'], OK['cashCalls']['noCallBelow'], OB['targetPct'], OB['recoverFromPct'],
                     OD['callTotal'], OD['defaulters'][0]['paid'], OD['interest']['annualRatePct'], OD['interest']['dayBasis'], OD['interest']['graceHours'], OK['psc']['royaltyPct'], OK['psc']['costOilLimitPct'],
                     OK['psc']['contractorProfitSharePct'], OK['psc']['taxRatePct'], OK['psc']['openingCostPool']],
    'advanced': [AS['premiumMultiplePct'], AY['premiumMultiplePct'], AC['recoverFromPct'], AC['uplift']['multiplePct'], AC['discountRate'], AC['baseYear'], AB['psc']['royaltyPct'], AB['psc']['costOilLimitPct'],
                 AB['psc']['contractorProfitSharePct'], AB['psc']['taxRatePct'], AB['psc']['openingCostPool'], AD['callTotal'], AD['defaulters'][0]['paid'], AD['interest']['annualRatePct'], AD['interest']['dayBasis']],
}
for tier, vals in STATED.items():
    for v in vals:
        if n(v) not in NUMS[tier]:
            bad.append(f'{tier} prompt does not state {n(v)}, which the engine ran')
WORDS = {
    'beginner': [ID['cashCalls']['negativeCall'], 'pro-rata', 'noCallBelow', 'budgetTolerance'],
    'intermediate': [OC['uplift']['type'], OC['basis'], OK['cashCalls']['negativeCall'], OB['basis'], OB['refundForm'], OD['interest']['interestMethod'], 'graceHours', OK['psc']['costOilLimitBase'], OD['dueDate'], OD['defaulters'][0]['curedOn']],
    'advanced': [AS['mode'], AY['mode'], AC['uplift']['type'], AC['basis'], AD['interest']['interestMethod'], 'graceHours', AB['psc']['costOilLimitBase'], AD['dueDate'], AD['asOf']],
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
for plant, rule in (('an AI-powered ledger', 'AI claim'), ('the engine used to charge', 'repair history'),
                    ('a carry — new', 'dash'), ('the paying interest, not the beneficial', 'contrastive'), ('the paying rather than the beneficial', 'rather than')):
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
-- EC9: Joint Ventures, Operating Agreements & Cost Recovery joins the catalogue
-- in the Economics & Commercial module. AN ENGINE COURSE: there is no Suite
-- app; the practicals run in the course's own calculator panels.
--
-- Catalogue row (module 'economics'; path_order {PATH_ORDER}; prereq_slug NULL,
-- the lead's decision; school left at its default) plus the three capstones and
-- their eighteen graded fields, generated by tools/course-waves/joa/gen_course.py
-- from the ENGINE'S OWN RUN (joa_capstone.mjs through the vendored
-- engines/economics/jointVenture.js, petrolord-engines 3ae56e7), which it
-- refuses to write unless fields.json carries exactly that run's values and the
-- tolerance gradedTolerance.js derives. Deep seeds are three separate
-- migrations; the go-live is a fifth and is HELD until a NextGen production
-- upload carries the route /dashboard/apps/joa.
--
-- WHAT IS GRADED. IDUMU (Associate) grades a carrier's paying interest, two
-- months of one partner's cash calls, an allowed budget overrun and two
-- overhead charges on a marginal scale; OKWELLE (Professional) grades a carry
-- balance with a compound uplift, a PIA s.85(4) back-in refund, default
-- interest compounded monthly and one party's cover, a cash call in the
-- reconciliation ledger and a year's PSC cost recovered; ABIAMA (Expert)
-- grades a non-consent premium and the payout year's receipt, a buy-in part,
-- a carrier's NPV, a year's government profit oil and an interest after
-- forfeiture. Every value is a return value of the engine, identical under
-- every reading the engine states, and the data it was run on is in the case
-- file the prompt names.
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


INDEX_JS = ("// The joa capstone case files, generated by tools/course-waves/joa/gen_course.py\n"
            "// from the engine's own inputs (joa_capstone.mjs --inputs). Only the capstone card\n"
            "// imports this module: no panel preloads a case, and the graded answers are not\n"
            "// stored anywhere in the app.\n")
for tier in TIERS:
    for fname, _ in CASES[tier]:
        INDEX_JS += f"import {ident(fname)} from './{fname}?raw';\n"
INDEX_JS += '\nexport const JOA_CASE_FILES = {\n'
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
    print(f'gen_course: engine run 18 of 18 fields.json values equal what joa_capstone.mjs returned through {ENGINES}, '
          f'every tolerance the one gradedTolerance.js derives; case-file data re-read and equal to the engine run: {CHECKED}; '
          f'prompt lengths {({t: len(PROMPTS[t]) for t in TIERS})}; digest numbers swept: {len(DIGEST_NUMS)}; numbers handed: {len(handed)}; '
          'handed + pairwise + digest collisions + settings + vocabulary + copy rule + precision: 0'
          + ('' if wrote else '; SELF CHECK ONLY, nothing written'))
