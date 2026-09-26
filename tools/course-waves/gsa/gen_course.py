#!/usr/bin/env python3
"""Generate the EC8 course + capstone migration AND the capstone case files from
the ENGINE'S OWN RUN, so no expected value, no setting and no data point is
retyped.

Modelled on EC7's gen_course.py (itself SC2's, D5's, D4's and D3's), rewritten
for EC8 gsa: the three capstones are OZUBU (Associate), IFEYI (Professional)
and NWAKA (Expert), Ekene synthetic gas sales agreements built by
gsa_capstone.mjs through the vendored engines/economics/gasContract.js.

1. THE ENGINE IS RUN HERE. `node gsa_capstone.mjs --json` is executed through
   the vendored engine (EC8_ENGINES) and the one tolerance module
   (EC8_TOLERANCE), and this file REFUSES unless fields.json carries exactly
   what that run returned: the same tier, key and value to the last bit, and
   the tolerance gradedTolerance.js derives.

2. THE DATA TRAVELS AS CASE FILES. A capstone is set on contract terms, a
   fortnight of days and a monthly index series, which a prompt can state in
   part but a learner should not retype. So `gsa_capstone.mjs --inputs` is
   rendered into one JSON case file per tier under
   src/content/capstone-cases/gsa/, keyed the way the calculator views read a
   pasted case (energy, quantities, fortnight, year; price, pricing, contract,
   dgdo; royalty, discountRate, baseYear). A self check re-reads every case file
   and proves it carries exactly the data the engine ran.

3. EVERY SETTING IS STATED. Each prompt states the terms its six values were
   computed at, read from the engine's stated inputs, and a self check refuses
   a prompt that omits one: the recovery order, the make-up period, the end of
   the term, the carry-forward terms, the price formula with its averaging,
   lag, reset and rounding, the price basis of the ledger. Each prompt says
   that no value depends on a reading the engine states (gsa_capstone.mjs and
   discriminate.mjs prove that) and that no value uses the domestic base
   price.

4. THE VOCABULARY AND THE COPY RULE ARE ENFORCED ON EVERY PROMPT, TITLE AND
   LABEL: no AI claim, no em or en dash, no "X, not Y" contrastive, no repair
   history.

5. THE PRECISION SENTENCE IN EACH PROMPT IS CHECKED AGAINST precision.json.
   Every EC8 class prints to six decimals, so every prompt asks for six.

THE TOLERANCES ARE READ, NEVER DECLARED. Capstone details stay out of the
lessons: gate_capstone_leak.mjs sweeps the lessons, banks and briefs for every
capstone name, label, index run, figure and value.

Usage:
   python3 gen_course.py                 the self checks only; writes nothing
   python3 gen_course.py --cases         write the three case files and index.js
   python3 gen_course.py --migration     also write the course migration
   EC8_WAVE        the wave directory (default /root/cat-wip-gsa)
   EC8_REPO        the nextgen clone   (default /root/wt-ec8-nextgen)
   EC8_ENGINES     packages/engines to run the capstone through
   EC8_TOLERANCE   gradedTolerance.js
   EC8_COURSE_OUT  where to write the migration
   EC8_CASES_OUT   where to write the case files (default $EC8_REPO/src/content/capstone-cases/gsa)
Importing this module runs the engine and the self checks and writes nothing.
"""
import json
import os
import re
import subprocess
import sys

W = os.environ.get('EC8_WAVE', '/root/cat-wip-gsa')
REPO = os.environ.get('EC8_REPO', '/root/wt-ec8-nextgen')
ENGINES = os.environ.get('EC8_ENGINES', f'{REPO}/packages/engines')
TOLPATH = os.environ.get(
    'EC8_TOLERANCE', f'{REPO}/src/components/course/panels/gsa/gradedTolerance.js')
DATE = '20261109'
OUT = os.environ.get('EC8_COURSE_OUT', f'{REPO}/migrations/{DATE}_ec8_gsa_course.sql')
CASES_OUT = os.environ.get('EC8_CASES_OUT', f'{REPO}/src/content/capstone-cases/gsa')

SLUG, MODULE, PATH_ORDER = 'gsa', 'economics', 73
NAME = 'Gas Commercialisation & Gas Sales Agreements'
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


ENV = dict(os.environ, EC8_ENGINES=ENGINES, EC8_TOLERANCE=TOLPATH, EC8_WAVE_DIR=W, EC8_REPO=REPO, TZ='UTC', LC_ALL='C')


def node(*args, script=None):
    r = subprocess.run(['node', *([script] if script else []), *args],
                       capture_output=True, text=True, env=ENV)
    if r.returncode != 0:
        sys.exit(f'REFUSED: the engine run failed: {r.stderr.strip()[-400:]}')
    return r.stdout


ENGINE_ROWS = json.loads(node('--json', script=f'{W}/gsa_capstone.mjs'))
INPUTS = json.loads(node('--inputs', script=f'{W}/gsa_capstone.mjs'))
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

OZ, IF, NW = INPUTS['OZUBU'], INPUTS['IFEYI'], INPUTS['NWAKA']


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
KEYS_OF = {'beginner': ('energy', 'quantities', 'fortnight', 'year'),
           'intermediate': ('price', 'pricing', 'contract', 'dgdo'),
           'advanced': ('price', 'pricing', 'contract', 'royalty', 'discountRate', 'baseYear')}


def case_of(c, t):
    out = {'dataset': f"{c['name']} (synthetic)", 'label': c['label']}
    for k in KEYS_OF[t]:
        out[k] = c[k]
    return out


CASE_NAME = {'beginner': 'ozubu_case.json', 'intermediate': 'ifeyi_case.json', 'advanced': 'nwaka_case.json'}
CASE_SRC = {'beginner': OZ, 'intermediate': IF, 'advanced': NW}
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
    'ozubu_march_2028_mmbtu': ('The metered March 2028 volume in energy', 'MMBtu'),
    'ozubu_2028_acq': ('The ACQ of the 2028 contract year', 'MMBtu'),
    'ozubu_effective_swing': ('The effective swing', 'ratio'),
    'ozubu_fortnight_buyer_shortfall': ('The buyer shortfall over the fortnight', 'MMBtu'),
    'ozubu_fortnight_seller_shortfall': ('The seller shortfall over the fortnight', 'MMBtu'),
    'ozubu_2029_deficiency_payment': ('The deficiency payment for 2029', 'USD'),
    'ifeyi_2030_average_price': ('The annual average contract price of 2030', 'USD/MMBtu'),
    'ifeyi_2028_deficiency_payment': ('The deficiency payment for 2028', 'USD'),
    'ifeyi_2031_make_up_taken': ('The make-up gas taken in 2031', 'MMBtu'),
    'ifeyi_2031_make_up_expired': ('The make-up that expires unrecovered at the end of 2031', 'MMBtu'),
    'ifeyi_total_net_to_seller': ('The net to the seller over the term', 'USD'),
    'ifeyi_2031_dgdo_penalty': ('The Domestic Gas Delivery Obligation penalty for 2031', 'USD'),
    'nwaka_july_2029_price': ('The contract price of July 2029', 'USD/MMBtu'),
    'nwaka_2034_average_price': ('The annual average contract price of 2034', 'USD/MMBtu'),
    'nwaka_2030_carry_forward_credit': ('The carry-forward credit applied in 2030', 'MMBtu'),
    'nwaka_2035_refund': ('The end-of-term refund in 2035', 'USD'),
    'nwaka_npv_seller_revenue': ('The NPV of the seller revenue', 'USD'),
    'nwaka_2032_royalty': ('The gas royalty in 2032', 'USD'),
}
if set(LABELS) != set(KEYS):
    bad.append('LABELS and fields.json name different fields')


# ---------------------------------------------------------------------------
# The prompts, rendered from the engine's own inputs and stated settings.
# ---------------------------------------------------------------------------
ORDER_WORDS = {'after-adjusted-acq': "only after the year's Adjusted ACQ is taken (after-adjusted-acq)",
               'after-top-quantity': "only after the year's take-or-pay quantity is taken (after-top-quantity)",
               'first': 'in priority, before the year\'s own quantity (first)'}
BASIS_WORDS = {'annual-average': 'the annual average of its monthly prices (annual-average)', 'last-month': "its last month's price (last-month)"}
FREE = ("Every contract year states its permitted reduction (0 where the contract permits none). No value depends on any of the four readings the engine states, and no value uses the domestic base price "
        "or the price control of PIA s.167 (priceControlApplies): no call of this case prices gas under s.167 or s.168.")


def price_text(p):
    f = p['price']['formula']
    s = f"The price is {n(f['constant'])} + {n(f['slope'])} x the synthetic oil index in the case file, averaged over {n(p['price']['averagingMonths'])} months ending {n(p['price']['lagMonths'])} month{'' if p['price']['lagMonths'] == 1 else 's'} before the priced month, reset every {n(p['price']['resetMonths'])} months from {p['price']['from']}, rounding {p['price']['rounding']}"
    if 'sCurve' in f:
        c = f['sCurve']
        s += f", with an S-curve at {n(c['lowKink'])} and {n(c['highKink'])} US$ per barrel, slope {n(c['lowSlope'])} below and {n(c['highSlope'])} above"
    if 'floor' in f:
        s += f", floor {n(f['floor'])} and ceiling {n(f['ceiling'])}"
    s += f", priced {p['price']['from']} to {p['price']['to']}. Each year's contract price is {BASIS_WORDS[p['pricing']['contractPrice']]} and its take-or-pay price {BASIS_WORDS[p['pricing']['topPrice']]}; make-up gas is invoiced at {n(p['pricing']['makeUpPrice'])} US$ per MMBtu."
    return s


def contract_text(c):
    k = c['contract']
    s = (f"Take-or-pay {n(k['topPct'])} percent of the Adjusted ACQ; make-up for {n(k['makeUp']['periodYears'])} contract years, "
         f"taken {ORDER_WORDS[k['makeUp']['order']]}, the rest {'refunded' if k['makeUp']['endOfTerm'] == 'refund' else 'forfeited'} at the end of the term ({k['makeUp']['endOfTerm']}).")
    if 'carryForward' in k:
        cf = k['carryForward']
        s += f" Carry-forward of takes above the {'take-or-pay quantity' if cf['base'] == 'top-quantity' else 'Adjusted ACQ'} ({cf['base']}) for {n(cf['periodYears'])} contract years, at most {n(cf['capPct'])} percent of a year's deficiency."
    else:
        s += ' No carry-forward.'
    return s


OZ_TEXT = (f"{OZ['label']}. One case file comes with this capstone: {CASE_NAME['beginner']} carries four calls under the keys energy, quantities, fortnight and year; paste it into the quantity calculator, whose views each read the key they need. "
           f"The metered volume is {n(OZ['energy']['quantity'])} {OZ['energy']['quantityUnit']} at a {OZ['energy']['heatingValueBasis']} heating value of {n(OZ['energy']['heatingValue'])} {OZ['energy']['heatingValueUnit']}. "
           f"The DCQ is {n(OZ['quantities']['dcq'])} MMBtu per day, the 2028 contract year runs {OZ['quantities']['period']['start']} up to {OZ['quantities']['period']['end']}, MaxDCQ is {n(OZ['quantities']['maxDcqPct'])} percent and take-or-pay {n(OZ['quantities']['topPct'])} percent. "
           f"The fortnight in February 2029 carries a delivery tolerance of {n(OZ['fortnight']['deliveryTolerance'])} MMBtu. "
           f"The 2029 take-or-pay year states its reductions, its take and its prices in the case file, with make-up for {n(OZ['year']['makeUp']['periodYears'])} contract years taken {ORDER_WORDS[OZ['year']['makeUp']['order']]}. {FREE}")
IF_TEXT = (f"{IF['label']}. One case file comes with this capstone: {CASE_NAME['intermediate']} carries the price series and formula (price), the price basis of the ledger (pricing), the contract years (contract) and the lessee's delivery obligation for 2031 (dgdo); paste it into the ledger calculator. "
           + price_text(IF) + ' ' + contract_text(IF)
           + f" The delivery obligation states voluntary contracts, two excuses and a signed agreement rate of {n(IF['dgdo']['agreementPenaltyRate'])} US$ per MMBtu. {FREE}")
NW_TEXT = (f"{NW['label']}. One case file comes with this capstone: {CASE_NAME['advanced']} carries the price series and formula (price), the price basis (pricing), the contract years (contract), the royalty terms (royalty), the discount rate and the base year; paste it into the contract calculator. "
           + price_text(NW) + ' ' + contract_text(NW)
           + f" Royalty {NW['royalty']['terrain']}, {n(NW['royalty']['inCountrySharePct'])} percent of the gas utilised in-country; NPV at a discount rate of {n(NW['discountRate'])} to {n(NW['baseYear'])}, year-end flows. {FREE}")

TIER = {
    'beginner': ('associate', 'OZUBU, Ekene gas to the Ozubu Tile Works (synthetic)', 'Quantities and one contract year',
                 OZ_TEXT + " Report six values: the metered volume in MMBtu; the ACQ of the 2028 contract year; the effective swing; the buyer shortfall and the seller shortfall over the fortnight; and the deficiency payment for 2029. All six to six decimals."),
    'intermediate': ('professional', 'IFEYI, Ekene gas to the Ifeyi Glass Cluster (synthetic), 2028 to 2033', 'The ledger, the price and the Nigerian rules',
                     IF_TEXT + " Report six values: the annual average contract price of 2030; the deficiency payment for 2028; the make-up gas taken in 2031; the make-up that expires unrecovered at the end of 2031; the net to the seller over the term; and the delivery obligation penalty for 2031. All six to six decimals."),
    'advanced': ('expert', 'NWAKA, Ekene gas to the Nwaka Methanol Plant (synthetic), 2029 to 2035', 'Parity, the whole contract and reading the engine',
                 NW_TEXT + " Report six values: the contract price of July 2029; the annual average contract price of 2034; the carry-forward credit applied in 2030; the end-of-term refund in 2035; the NPV of the seller revenue; and the gas royalty in 2032. All six to six decimals."),
}
PROMPTS = {t: TIER[t][3] for t in TIERS}

# --------------------------------------------------------------- self checks
NUMS = {t: re.findall(r'(?<![\d.])\d+(?:\.\d+)?(?!\d|\.\d)', PROMPTS[t]) for t in TIERS}
for tier, c in (('intermediate', IF), ('advanced', NW)):
    k = c['contract']
    for v in (k['topPct'], k['makeUp']['periodYears'], c['price']['averagingMonths'], c['price']['lagMonths'], c['price']['resetMonths'], c['pricing']['makeUpPrice'], c['price']['formula']['slope'], c['price']['formula']['constant']):
        if n(v) not in NUMS[tier]:
            bad.append(f'{tier} prompt does not state {n(v)}, which the engine ran')
    for word in (k['makeUp']['order'], k['makeUp']['endOfTerm'], c['pricing']['contractPrice'], c['pricing']['topPrice'], c['price']['rounding']):
        if word not in PROMPTS[tier]:
            bad.append(f'{tier} prompt does not state "{word}"')
for v in (OZ['quantities']['dcq'], OZ['quantities']['maxDcqPct'], OZ['quantities']['topPct'], OZ['fortnight']['deliveryTolerance'], OZ['energy']['heatingValue'], OZ['energy']['quantity']):
    if n(v) not in NUMS['beginner']:
        bad.append(f'beginner prompt does not state {n(v)}')
if 'carryForward' in NW['contract'] and n(NW['contract']['carryForward']['capPct']) not in NUMS['advanced']:
    bad.append('the Expert prompt does not state the carry-forward cap')
for tier, c in (('beginner', OZ), ('intermediate', IF), ('advanced', NW)):
    yrs = (c.get('year') or c.get('contract'))['years']
    if not all('permittedReduction' in y for y in yrs):
        bad.append(f'{tier}: a contract year does not state permittedReduction')
    if 'permitted reduction' not in PROMPTS[tier] or 'priceControlApplies' not in PROMPTS[tier]:
        bad.append(f'{tier} prompt does not state the permitted reduction and the price control')
    if 'domestic' in c:
        bad.append(f'{tier}: a capstone case prices gas under s.167, which its prompt says none does')
for tier in TIERS:
    if FREE not in PROMPTS[tier]:
        bad.append(f'{tier} prompt does not say that no value depends on a stated reading or the domestic base price')
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
                    ('a contract — new', 'dash'), ('the take, not the ACQ', 'contrastive'), ('the take rather than the ACQ', 'rather than')):
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
-- EC8: Gas Commercialisation & Gas Sales Agreements joins the catalogue in the
-- Economics & Commercial module. AN ENGINE COURSE: there is no Suite app; the
-- practicals run in the course's own calculator panels.
--
-- Catalogue row (module 'economics'; path_order {PATH_ORDER}; prereq_slug NULL,
-- the lead's decision; school left at its default) plus the three capstones and
-- their eighteen graded fields, generated by tools/course-waves/gsa/gen_course.py
-- from the ENGINE'S OWN RUN (gsa_capstone.mjs through the vendored
-- engines/economics/gasContract.js, petrolord-engines d745b88), which it
-- refuses to write unless fields.json carries exactly that run's values and the
-- tolerance gradedTolerance.js derives. Deep seeds are three separate
-- migrations; the go-live is a fifth and is HELD until a NextGen production
-- upload carries the route /dashboard/apps/gsa.
--
-- WHAT IS GRADED. OZUBU (Associate) grades a metered volume in MMBtu, a leap
-- year ACQ, the effective swing, a fortnight's buyer and seller shortfall and
-- one year's deficiency payment; IFEYI (Professional) grades an annual average
-- oil-indexed price, a deficiency payment, make-up taken and expired, the net
-- to the seller and a delivery obligation penalty; NWAKA (Expert) grades an
-- S-curve price, an annual average price, a carry-forward credit, the
-- end-of-term refund, an NPV and a gas royalty. Every value is a return value
-- of the engine, identical under every reading the engine states, independent
-- of the domestic base price, and the data it was run on is in the case file
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


INDEX_JS = ("// The gsa capstone case files, generated by tools/course-waves/gsa/gen_course.py\n"
            "// from the engine's own inputs (gsa_capstone.mjs --inputs). Only the capstone card\n"
            "// imports this module: no panel preloads a case, and the graded answers are not\n"
            "// stored anywhere in the app.\n")
for tier in TIERS:
    for fname, _ in CASES[tier]:
        INDEX_JS += f"import {ident(fname)} from './{fname}?raw';\n"
INDEX_JS += '\nexport const GSA_CASE_FILES = {\n'
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
    print(f'gen_course: engine run 18 of 18 fields.json values equal what gsa_capstone.mjs returned through {ENGINES}, '
          f'every tolerance the one gradedTolerance.js derives; case-file data re-read and equal to the engine run: {CHECKED}; '
          f'prompt lengths {({t: len(PROMPTS[t]) for t in TIERS})}; digest numbers swept: {len(DIGEST_NUMS)}; numbers handed: {len(handed)}; '
          'handed + pairwise + digest collisions + settings + vocabulary + copy rule + precision: 0'
          + ('' if wrote else '; SELF CHECK ONLY, nothing written'))
