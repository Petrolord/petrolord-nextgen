#!/usr/bin/env python3
"""Generate the EC10 course + capstone migration AND the capstone case files from
the ENGINE'S OWN RUN, so no expected value, no setting and no data point is
retyped.

Modelled on EC9's gen_course.py (itself EC8's, EC7's, SC2's, D5's, D4's and
D3's), rewritten for EC10 farmout: the three capstones are OGBAKU (Associate),
UMUNZE (Professional) and AKPUGO (Expert), Ekene synthetic deals built by
farmout_capstone.mjs through the vendored engines/economics/farmout.js.

1. THE ENGINE IS RUN HERE. `node farmout_capstone.mjs --json` is executed
   through the vendored engine (EC10_ENGINES) and the one tolerance module
   (EC10_TOLERANCE), and this file REFUSES unless fields.json carries exactly
   what that run returned: the same tier, key and value to the last bit, and
   the tolerance gradedTolerance.js derives.

2. THE DATA TRAVELS AS CASE FILES. A capstone is set on deal terms, wells,
   prospects, signals, prices and years of costs and entitlement, which a
   prompt can state in part but a learner should not retype. So
   `farmout_capstone.mjs --inputs` is rendered into one JSON case file per tier
   under src/content/capstone-cases/farmout/, keyed the way the calculator
   views read a pasted case (earning; earning, deal, fee; information, price,
   devCarry, backIn). A self check re-reads every case file and proves it
   carries exactly the data the engine ran.

3. EVERY SETTING IS STATED. Each prompt states the terms its six values were
   computed at, read from the engine's stated inputs, and a self check refuses
   a prompt that omits one: the parties and interests, each event's cost,
   share paid, interest earned and cap, the overrun rule, the vesting rule, the
   bonus and the past costs, the chance and the well costs, the success-case
   value, the signals and their cost, the price and its basis, the carry's
   share, uplift and recovery share, the back-in target and refundable kinds,
   the value of the transaction and its dates. Each prompt says that no value
   depends on a reading the engine states (farmout_capstone.mjs and
   discriminate.mjs prove that) or on a Monte Carlo draw.

4. THE VOCABULARY AND THE COPY RULE ARE ENFORCED ON EVERY PROMPT, TITLE AND
   LABEL: no AI claim, no em or en dash, no "X, not Y" contrastive, no repair
   history.

5. THE PRECISION SENTENCE IN EACH PROMPT IS CHECKED AGAINST precision.json.
   Every EC10 class prints to six decimals, so every prompt asks for six.

THE TOLERANCES ARE READ, NEVER DECLARED. Capstone details stay out of the
lessons: gate_capstone_leak.mjs sweeps the lessons, banks and briefs for every
capstone name, label, index run, figure and value.

Usage:
   python3 gen_course.py                 the self checks only; writes nothing
   python3 gen_course.py --cases         write the three case files and index.js
   python3 gen_course.py --migration     also write the course migration
   EC10_WAVE        the wave directory (default /root/cat-wip-farmout)
   EC10_REPO        the nextgen clone   (default /root/wt-ec10-nextgen)
   EC10_ENGINES     packages/engines to run the capstone through
   EC10_TOLERANCE   gradedTolerance.js
   EC10_COURSE_OUT  where to write the migration
   EC10_CASES_OUT   where to write the case files (default $EC10_REPO/src/content/capstone-cases/farmout)
Importing this module runs the engine and the self checks and writes nothing.
"""
import json
import os
import re
import subprocess
import sys

W = os.environ.get('EC10_WAVE', '/root/cat-wip-farmout')
REPO = os.environ.get('EC10_REPO', '/root/wt-ec10-nextgen')
ENGINES = os.environ.get('EC10_ENGINES', f'{REPO}/packages/engines')
TOLPATH = os.environ.get(
    'EC10_TOLERANCE', f'{REPO}/src/components/course/panels/farmout/gradedTolerance.js')
DATE = '20261111'
OUT = os.environ.get('EC10_COURSE_OUT', f'{REPO}/migrations/{DATE}_ec10_farmout_course.sql')
CASES_OUT = os.environ.get('EC10_CASES_OUT', f'{REPO}/src/content/capstone-cases/farmout')

SLUG, MODULE, PATH_ORDER = 'farmout', 'economics', 75
NAME = 'Farm-ins, Farm-outs & Asset Valuation'
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


ENV = dict(os.environ, EC10_ENGINES=ENGINES, EC10_TOLERANCE=TOLPATH, EC10_WAVE_DIR=W, EC10_REPO=REPO, TZ='UTC', LC_ALL='C')


def node(*args, script=None):
    r = subprocess.run(['node', *([script] if script else []), *args],
                       capture_output=True, text=True, env=ENV)
    if r.returncode != 0:
        sys.exit(f'REFUSED: the engine run failed: {r.stderr.strip()[-400:]}')
    return r.stdout


ENGINE_ROWS = json.loads(node('--json', script=f'{W}/farmout_capstone.mjs'))
INPUTS = json.loads(node('--inputs', script=f'{W}/farmout_capstone.mjs'))
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

OG, UM, AK = INPUTS['OGBAKU'], INPUTS['UMUNZE'], INPUTS['AKPUGO']


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
KEYS_OF = {'beginner': ('earning',),
           'intermediate': ('earning', 'deal', 'fee'),
           'advanced': ('information', 'price', 'devCarry', 'backIn')}


def case_of(c, t):
    out = {'dataset': f"{c['name']} (synthetic)", 'label': c['label']}
    for k in KEYS_OF[t]:
        out[k] = c[k]
    return out


CASE_NAME = {'beginner': 'ogbaku_case.json', 'intermediate': 'umunze_case.json', 'advanced': 'akpugo_case.json'}
CASE_SRC = {'beginner': OG, 'intermediate': UM, 'advanced': AK}
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
    'ogbaku_ihe_well_payment': ("What IHE pays of the Ogbaku-1 well", 'USD'),
    'ogbaku_ogb_well_payment': ("What OGB pays of the Ogbaku-1 well", 'USD'),
    'ogbaku_promote_ratio': ('The promote ratio of the Ogbaku-1 event', 'ratio'),
    'ogbaku_carry': ('The carry of the Ogbaku-1 event', 'USD'),
    'ogbaku_consideration': ('The consideration to OGB', 'USD'),
    'ogbaku_equivalent_wi_pct': ("IHE's equivalent working interest", 'percent'),
    'umunze_well1_amg_payment': ('What AMG pays of the Umunze-1 well', 'USD'),
    'umunze_well2_umz_payment': ('What UMZ pays of the Umunze-2 well', 'USD'),
    'umunze_amg_emv': ("AMG's EMV farming in on the Umunze prospect", 'USD'),
    'umunze_breakeven_share_pct': ("The share of the well AMG can pay at its break-even promote", 'percent'),
    'umunze_amg_breakeven_chance_pct': ("AMG's break-even chance of success", 'percent'),
    'umunze_consent_fee': ('The consent fee on the Umunze assignment', 'USD'),
    'akpugo_ezi_evii': ("The survey's EVII to EZI", 'USD'),
    'akpugo_strong_posterior_pct': ('The chance of success after the strong amplitude signal', 'percent'),
    'akpugo_risked_value_per_pct': ('The risked value per percent of working interest', 'USD'),
    'akpugo_price_to_value': ('The stated price over the risked value, per percent', 'ratio'),
    'akpugo_2035_carry_balance': ('The development carry balance carried out of 2035', 'USD'),
    'akpugo_backin_refund_to_obr': ('The back-in refund OBR receives', 'USD'),
}
if set(LABELS) != set(KEYS):
    bad.append('LABELS and fields.json name different fields')


# ---------------------------------------------------------------------------
# The prompts, rendered from the engine's own inputs and stated settings.
# ---------------------------------------------------------------------------
FREE = ("No value depends on any of the readings the engine states (every cost at the valuation date, the day count of reg. 19(7), "
        "the ninetieth surcharge day, how a simple-interest uplift is paid) or on a Monte Carlo draw, and every term a value needs is "
        "stated in the case file: the engine holds no default for any of them.")


def parties_text(ps):
    return ', '.join(f"{p['id']} {n(p['participatingPct'])} percent" for p in ps)


def cap_text(c):
    if c['on'] == 'none':
        return 'no cap (cap none)'
    if c['on'] == 'gross-cost':
        rule = 'the post-deal interests' if c['overrunRule'] == 'post-deal-interests' else 'the farmor side alone'
        return f"the promote applies to the first {n(c['amount'])} of cost (cap gross-cost), the excess paid by {rule} (overrunRule {c['overrunRule']})"
    return f"the carry is held at {n(c['amount'])} (cap carry-amount)"


def events_text(e):
    return '; '.join(f"{ev['name']}: gross cost {n(ev['grossCost'])}, {e['farminee']['id']} pays {n(ev['farmineePaysPct'])} percent to earn {n(ev['earnedPct'])} percent, {cap_text(ev['cap'])}"
                     for ev in e['events'])


def earning_text(e):
    return (f"The parties are {parties_text(e['parties'])}; {e['farmor']} is the farmor and {e['farminee']['id']} ({e['farminee']['name']}) the farminee. "
            f"The earning events: {events_text(e)}. Vesting is {e['vesting']} and {n(e['eventsCompleted'])} of {len(e['events'])} event{'s are' if e['eventsCompleted'] != 1 else ' is'} completed (eventsCompleted). "
            f"{e['farminee']['id']} pays a cash bonus of {n(e['cashBonus'])} and reimburses {n(e['pastCosts']['reimbursedPct'])} percent of {n(e['pastCosts']['amount'])} of past costs (pastCosts).")


def project_text(p):
    return (f"a chance of success of {n(p['chanceOfSuccessPct'])} percent, an exploration well of {n(p['wellCost']['success'])} on a success and {n(p['wellCost']['dry'])} as a dry hole, "
            f"and a success-case value of {n(p['successValue']['npv'])} at 100 percent, stated at the valuation date (successValue npv)")


def deal_text(d):
    return (f"{d['farminee']['id'] if 'farminee' in d else ''} pays {n(d['deal']['farmineePaysPct'])} percent of the well to earn {n(d['deal']['earnedPct'])} percent; {cap_text(d['deal']['cap'])}; "
            f"a cash bonus of {n(d['deal']['cashBonus'])}; {n(d['deal']['pastCosts']['reimbursedPct'])} percent of {n(d['deal']['pastCosts']['amount'])} of past costs reimbursed; "
            f"the farmor pays assignor fees of {n(d['deal']['assignorFees'])} (assignorFees)")


UE, UD, UF = UM['earning'], UM['deal'], UM['fee']
AI_, AP, AC, AB = AK['information'], AK['price'], AK['devCarry'], AK['backIn']
OG_TEXT = (f"{OG['label']}. One case file comes with this capstone: {CASE_NAME['beginner']} carries one call under the key earning; "
           f"paste it into the earning calculator. {earning_text(OG['earning'])} {FREE}")
UM_TEXT = (f"{UM['label']}. One case file comes with this capstone: {CASE_NAME['intermediate']} carries three calls under the keys earning, deal and fee; "
           f"paste it into the deal calculator, whose views each read the key they need. {earning_text(UE)} "
           f"The deal is valued on the Umunze prospect with {project_text(UD['project'])}: {deal_text(UD)}. "
           f"The assignment is of a {UF['licence']} under basis {UF['basis']}, intraGroup {n(UF['intraGroup'])}, on a value of the transaction of {n(UF['transactionValue'])} "
           f"({UF['valueSource']}), notified on {UF['payment']['notifiedOn']} and paid on {UF['payment']['paidOn']}. {FREE}")
AK_TEXT = (f"{AK['label']}. One case file comes with this capstone: {CASE_NAME['advanced']} carries four calls under the keys information, price, devCarry and backIn; "
           f"paste it into the valuation calculator. The parties are {parties_text(AI_['parties'])}; {AI_['farmor']} is the farmor and {AI_['farminee']['id']} the farminee. "
           f"The Akpugo prospect has {project_text(AI_['project'])}; the deal: {deal_text(AI_)}. "
           f"A seismic survey costing {n(AI_['information']['cost'])} returns one of two signals: "
           + '; '.join(f"{s['label']} with a {n(s['likelihoodsPct'][0])} percent chance given success and {n(s['likelihoodsPct'][1])} percent given a dry hole" for s in AI_['information']['signals'])
           + f"; the side valued is the {AI_['side']}. "
           f"A {n(AP['interestPct'])} percent interest is priced on the {AP['valueBasis']} basis at a stated price of {n(AP['transaction']['price'])}. "
           f"After a farm-in of {n(AC['earnedPct'])} percent, {AI_['farminee']['id']} carries {n(AC['carriedPct'])} percent of {AC['farmor']}'s development cost share, with a compound uplift of {n(AC['uplift']['ratePctPerYear'])} percent a year (uplift {AC['uplift']['type']}), "
           f"recovered from {n(AC['recoverFromPct'])} percent of {AC['farmor']}'s share of each year's entitlement (recoverFromPct); flows are discounted at {n(AC['discountRate'])} to {n(AC['baseYear'])}. "
           f"{AB['backIn']['party']} holds a back-in to {n(AB['backIn']['targetPct'])} percent after the same farm-in, basis {AB['backIn']['basis']}, refunding only the {' and '.join(AB['backIn']['refundableKinds'])} costs (refundableKinds), paid {AB['backIn']['refundForm']} (refundForm). {FREE}")

TIER = {
    'beginner': ('associate', 'OGBAKU, a farm-out on the Ogbaku licence (synthetic)', 'The deal and what it costs',
                 OG_TEXT + " Report six values: what IHE pays of the Ogbaku-1 well; what OGB pays of it; the promote ratio of the event; the carry; the consideration to OGB; and IHE's equivalent working interest in percent. All six to six decimals."),
    'intermediate': ('professional', 'UMUNZE, a drill-to-earn farm-out on the Umunze licence (synthetic)', 'Caps, vesting, value and the fee',
                     UM_TEXT + " Report six values: what AMG pays of the Umunze-1 well; what UMZ pays of the Umunze-2 well; AMG's EMV farming in on the Umunze prospect; the share of the well AMG can pay at its break-even promote, in percent; AMG's break-even chance of success, in percent; and the consent fee. All six to six decimals."),
    'advanced': ('expert', 'AKPUGO, a farm-out on the Akpugo licence (synthetic)', 'Information, price and after the farm-in',
                 AK_TEXT + " Report six values: the survey's EVII to EZI; the chance of success after the strong amplitude signal, in percent; the risked value per percent of working interest; the stated price over the risked value, per percent; the development carry balance carried out of 2035; and the back-in refund OBR receives. All six to six decimals."),
}
PROMPTS = {t: TIER[t][3] for t in TIERS}

# --------------------------------------------------------------- self checks
NUMS = {t: re.findall(r'(?<![\d.])\d+(?:\.\d+)?(?!\d|\.\d)', PROMPTS[t]) for t in TIERS}
def ev_nums(e):
    return [p['participatingPct'] for p in e['parties']] + [x for ev in e['events'] for x in (ev['grossCost'], ev['farmineePaysPct'], ev['earnedPct'])] \
        + [ev['cap']['amount'] for ev in e['events'] if 'amount' in ev['cap']] + [e['cashBonus'], e['pastCosts']['amount'], e['pastCosts']['reimbursedPct'], e['eventsCompleted']]


STATED = {
    'beginner': ev_nums(OG['earning']),
    'intermediate': ev_nums(UE) + [UD['project']['chanceOfSuccessPct'], UD['project']['wellCost']['success'], UD['project']['wellCost']['dry'], UD['project']['successValue']['npv'],
                                   UD['deal']['farmineePaysPct'], UD['deal']['earnedPct'], UD['deal']['cap']['amount'], UD['deal']['cashBonus'], UD['deal']['pastCosts']['amount'],
                                   UD['deal']['pastCosts']['reimbursedPct'], UD['deal']['assignorFees'], UF['transactionValue']],
    'advanced': [p['participatingPct'] for p in AI_['parties']] + [AI_['project']['chanceOfSuccessPct'], AI_['project']['wellCost']['success'], AI_['project']['wellCost']['dry'],
                 AI_['project']['successValue']['npv'], AI_['deal']['farmineePaysPct'], AI_['deal']['earnedPct'], AI_['deal']['cashBonus'], AI_['deal']['pastCosts']['amount'],
                 AI_['deal']['pastCosts']['reimbursedPct'], AI_['deal']['assignorFees'], AI_['information']['cost']]
                + [x for s in AI_['information']['signals'] for x in s['likelihoodsPct']]
                + [AP['interestPct'], AP['transaction']['price'], AC['earnedPct'], AC['carriedPct'], AC['uplift']['ratePctPerYear'], AC['recoverFromPct'], AC['discountRate'], AC['baseYear'], AB['backIn']['targetPct']],
}
for tier, vals in STATED.items():
    for v in vals:
        if n(v) not in NUMS[tier]:
            bad.append(f'{tier} prompt does not state {n(v)}, which the engine ran')
WORDS = {
    'beginner': [OG['earning']['vesting'], OG['earning']['farmor'], OG['earning']['farminee']['id'], 'cap none'],
    'intermediate': [UE['vesting'], UE['events'][0]['cap']['overrunRule'], 'cap gross-cost', 'cap carry-amount', UF['licence'], UF['basis'], UF['valueSource'],
                     UF['payment']['notifiedOn'], UF['payment']['paidOn'], 'assignorFees', 'successValue npv'],
    'advanced': [AI_['side'], AP['valueBasis'], AC['uplift']['type'], AB['backIn']['basis'], AB['backIn']['refundForm'], 'refundableKinds', 'recoverFromPct']
                + [s['label'] for s in AI_['information']['signals']],
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
for plant, rule in (('an AI-powered deal', 'AI claim'), ('the engine used to charge', 'repair history'),
                    ('a promote — new', 'dash'), ('the risked value, not the success case', 'contrastive'), ('the risked rather than the success case', 'rather than')):
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
-- EC10: Farm-ins, Farm-outs & Asset Valuation joins the catalogue in the
-- Economics & Commercial module. AN ENGINE COURSE: there is no Suite app; the
-- practicals run in the course's own calculator panels.
--
-- Catalogue row (module 'economics'; path_order {PATH_ORDER}; prereq_slug NULL,
-- the lead's decision; school left at its default) plus the three capstones and
-- their eighteen graded fields, generated by tools/course-waves/farmout/gen_course.py
-- from the ENGINE'S OWN RUN (farmout_capstone.mjs through the vendored
-- engines/economics/farmout.js, petrolord-engines 6626465), which it refuses to
-- write unless fields.json carries exactly that run's values and the tolerance
-- gradedTolerance.js derives. Deep seeds are three separate migrations; the
-- go-live is a fifth and is HELD until a NextGen production upload carries the
-- route /dashboard/apps/farmout.
--
-- WHAT IS GRADED. OGBAKU (Associate) grades what the farminee and the farmor
-- pay for one well, the promote ratio, the carry, the consideration and the
-- equivalent working interest; UMUNZE (Professional) grades a payment under a
-- gross-cost cap exceeded, a payment under a carry cap exceeded, the
-- farminee's EMV, the break-even share and chance and the consent fee; AKPUGO
-- (Expert) grades the survey's EVII, a posterior chance of success, the risked
-- value per percent, a price-to-value ratio, a development carry balance and a
-- back-in refund. Every value is a return value of the engine, identical under
-- every reading the engine states and never a Monte Carlo draw, and the data it
-- was run on is in the case file the prompt names.
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


INDEX_JS = ("// The farmout capstone case files, generated by tools/course-waves/farmout/gen_course.py\n"
            "// from the engine's own inputs (farmout_capstone.mjs --inputs). Only the capstone card\n"
            "// imports this module: no panel preloads a case, and the graded answers are not\n"
            "// stored anywhere in the app.\n")
for tier in TIERS:
    for fname, _ in CASES[tier]:
        INDEX_JS += f"import {ident(fname)} from './{fname}?raw';\n"
INDEX_JS += '\nexport const FARMOUT_CASE_FILES = {\n'
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
    print(f'gen_course: engine run 18 of 18 fields.json values equal what farmout_capstone.mjs returned through {ENGINES}, '
          f'every tolerance the one gradedTolerance.js derives; case-file data re-read and equal to the engine run: {CHECKED}; '
          f'prompt lengths {({t: len(PROMPTS[t]) for t in TIERS})}; digest numbers swept: {len(DIGEST_NUMS)}; numbers handed: {len(handed)}; '
          'handed + pairwise + digest collisions + settings + vocabulary + copy rule + precision: 0'
          + ('' if wrote else '; SELF CHECK ONLY, nothing written'))
