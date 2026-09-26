#!/usr/bin/env python3
"""Generate the EC7 course + capstone migration AND the capstone case files from
the ENGINE'S OWN RUN, so no expected value, no setting and no data point is
retyped.

Modelled on SC2's gen_course.py (itself D5's, D4's and D3's), rewritten for
EC7 pia: the three capstones are ODOZI (Associate), NKEMDI (Professional) and
ALAKU (Expert), Ekene synthetic leases built by pia_capstone.mjs through the
vendored engines/economics/cashflow.ts.

1. THE ENGINE IS RUN HERE. `node pia_capstone.mjs --json` is executed through
   the vendored engine (EC7_ENGINES) and the one tolerance module
   (EC7_TOLERANCE), and this file REFUSES unless fields.json carries exactly
   what that run returned: the same tier, key and value to the last bit, and
   the tolerance gradedTolerance.js derives.

2. THE DATA TRAVELS AS CASE FILES. A capstone is set on a lease's terms and its
   production, capex and opex rows, which a prompt can state but a learner
   should not retype. So `pia_capstone.mjs --inputs` is rendered into one JSON
   case file per tier under src/content/capstone-cases/pia/, in the exact shape
   the ledger views of the calculator panels accept (cfg, prodRows, capexRows,
   opexRows). A self check re-reads every case file and proves it carries
   exactly the data the engine ran.

3. EVERY SETTING IS STATED. Each prompt states every term its six values were
   computed at, read from the engine's stated inputs, and a self check refuses
   a prompt that omits one. Each prompt states the Regulations base of the
   royalty by price in one plain sentence, and states the reading it uses for
   any open question the lease raises, with the sentence that no value depends
   on it (pia_capstone.mjs and discriminate.mjs prove that).

4. THE VOCABULARY AND THE COPY RULE ARE ENFORCED ON EVERY PROMPT, TITLE AND
   LABEL: no AI claim, no em or en dash, no "X, not Y" contrastive, no repair
   history.

5. THE PRECISION SENTENCE IN EACH PROMPT IS CHECKED AGAINST precision.json.
   Every EC7 class prints to six decimals, so every prompt asks for six.

THE TOLERANCES ARE READ, NEVER DECLARED. Capstone details stay out of the
lessons: gate_capstone_leak.mjs sweeps the lessons, banks and briefs for every
capstone name, label, production run, figure and value.

Usage:
   python3 gen_course.py                 the self checks only; writes nothing
   python3 gen_course.py --cases         write the three case files and index.js
   python3 gen_course.py --migration     also write the course migration
   EC7_WAVE        the wave directory (default /root/cat-wip-pia)
   EC7_REPO        the nextgen clone   (default /root/wt-ec7-nextgen)
   EC7_ENGINES     packages/engines to run the capstone through
   EC7_TOLERANCE   gradedTolerance.js
   EC7_COURSE_OUT  where to write the migration
   EC7_CASES_OUT   where to write the case files (default $EC7_REPO/src/content/capstone-cases/pia)
Importing this module runs the engine and the self checks and writes nothing.
"""
import json
import os
import re
import subprocess
import sys

W = os.environ.get('EC7_WAVE', '/root/cat-wip-pia')
REPO = os.environ.get('EC7_REPO', '/root/wt-ec7-nextgen')
ENGINES = os.environ.get('EC7_ENGINES', f'{REPO}/packages/engines')
TOLPATH = os.environ.get(
    'EC7_TOLERANCE', f'{REPO}/src/components/course/panels/pia/gradedTolerance.js')
DATE = '20261107'
OUT = os.environ.get('EC7_COURSE_OUT', f'{REPO}/migrations/{DATE}_ec7_pia_course.sql')
CASES_OUT = os.environ.get('EC7_CASES_OUT', f'{REPO}/src/content/capstone-cases/pia')

SLUG, MODULE, PATH_ORDER = 'pia', 'economics', 72
NAME = 'Petroleum Industry Act 2021 & Nigerian Fiscal Terms'
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


ENV = dict(os.environ, EC7_ENGINES=ENGINES, EC7_TOLERANCE=TOLPATH, EC7_WAVE_DIR=W, EC7_REPO=REPO, TZ='UTC', LC_ALL='C')


def node(*args, script=None):
    r = subprocess.run(['node', *([script] if script else []), *args],
                       capture_output=True, text=True, env=ENV)
    if r.returncode != 0:
        sys.exit(f'REFUSED: the engine run failed: {r.stderr.strip()[-400:]}')
    return r.stdout


ENGINE_ROWS = json.loads(node('--json', script=f'{W}/pia_capstone.mjs'))
INPUTS = json.loads(node('--inputs', script=f'{W}/pia_capstone.mjs'))
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

OD, NK, AL = INPUTS['ODOZI'], INPUTS['NKEMDI'], INPUTS['ALAKU']


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
# THE CASE FILES: the engine's own inputs, in the shape the ledger views take.
# ---------------------------------------------------------------------------
def case_of(c):
    return {'dataset': f"{c['name']} (synthetic)", 'label': c['label'], 'cfg': c['cfg'],
            'prodRows': c['prodRows'], 'capexRows': c['capexRows'], 'opexRows': c['opexRows']}


CASE_NAME = {'beginner': 'odozi_case.json', 'intermediate': 'nkemdi_case.json', 'advanced': 'alaku_case.json'}
CASE_SRC = {'beginner': OD, 'intermediate': NK, 'advanced': AL}
CASES = {t: [(CASE_NAME[t], json.dumps(case_of(CASE_SRC[t]), indent=1, ensure_ascii=False) + '\n')] for t in TIERS}
CHECKED = 0
for t in TIERS:
    got = json.loads(CASES[t][0][1])
    for k in ('cfg', 'prodRows', 'capexRows', 'opexRows'):
        if got.get(k) != CASE_SRC[t][k]:
            bad.append(f'{CASE_NAME[t]}: {k} is not what the engine ran')
        CHECKED += 1

# ---------------------------------------------------------------------------
# The eighteen graded fields.
# ---------------------------------------------------------------------------
LABELS = {
    'odozi_2028_liquids_royalty_rate': ('The crude oil and condensate production royalty rate in 2028', 'fraction'),
    'odozi_2029_production_royalty_usd': ('The production royalty on liquids and gas in 2029, at your share', 'USD'),
    'odozi_2030_hct_usd': ('The hydrocarbon tax in 2030, at your share', 'USD'),
    'odozi_2031_dev_levy_usd': ('The development levy in 2031, at your share', 'USD'),
    'odozi_total_cit_usd': ('Companies income tax over the life of the ledger, at your share', 'USD'),
    'odozi_government_take_pct': ('The government take, undiscounted', 'percent'),
    'nkemdi_2028_liquids_royalty_usd': ('The crude oil and condensate production royalty in 2028, at your share', 'USD'),
    'nkemdi_2029_production_allowance_usd': ('The production allowance in 2029, at your share', 'USD'),
    'nkemdi_2029_hct_chargeable_profit_usd': ('The hydrocarbon tax chargeable profit in 2029, at your share', 'USD'),
    'nkemdi_2031_cpr_deferred_usd': ('The cost the cost price ratio carries out of 2031, at your share', 'USD'),
    'nkemdi_cpr_forfeited_usd': ('The cost forfeited when the ledger ends, at your share', 'USD'),
    'nkemdi_total_cit_usd': ('Companies income tax over the life of the ledger, at your share', 'USD'),
    'alaku_2026_total_royalty_usd': ('The total royalty in 2026, production royalty on liquids and gas plus the royalty by price, at your share', 'USD'),
    'alaku_2026_hct_chargeable_profit_usd': ('The hydrocarbon tax chargeable profit in 2026, at your share', 'USD'),
    'alaku_2025_tet_usd': ('The tertiary education tax in 2025, at your share', 'USD'),
    'alaku_2027_dev_levy_usd': ('The development levy in 2027, at your share', 'USD'),
    'alaku_2028_cit_usd': ('Companies income tax in 2028, at your share', 'USD'),
    'alaku_total_cit_usd': ('Companies income tax over the life of the ledger, at your share', 'USD'),
}
if set(LABELS) != set(KEYS):
    bad.append('LABELS and fields.json name different fields')


# ---------------------------------------------------------------------------
# The prompts, rendered from the engine's own inputs and stated settings.
# ---------------------------------------------------------------------------
def years(c):
    ys = [r['year'] for r in c['prodRows']]
    return ys[0], ys[-1]


def common(c, t):
    k = c['cfg']
    y0, y1 = years(c)
    return (f"{c['label']}. One case file comes with this capstone: {CASE_NAME[t]} carries the terms (cfg) and "
            f"the production, capex and opex rows the engine ran, {n(y0)} to {n(y1)}; paste it into the ledger view of the "
            f"calculator. The terms: terrain {k['pia_terrain']}, licence {k['pia_license_type']}, lease {k['pia_lease_status']}, "
            f"no converted marginal field; a {n(k['pia_working_interest_pct'])} percent working interest, and every money value "
            f"is at that share; oil at {n(k['oil_price_usd_bbl'])} USD/bbl"
            + (f", condensate at {n(k['condensate_price_usd_bbl'])} USD/bbl" if k.get('condensate_price_usd_bbl') else '')
            + f", gas at {n(k['gas_price_usd_mscf'])} USD/Mscf, every price flat; opex escalating at {n(k['opex_escalator_pct'])} "
            f"percent a year from {n(k['base_year'])}; {n(k['pia_gas_in_country_share_pct'])} percent of the gas used in-country; "
            f"prior-year opex of {n(k['pia_prior_year_opex_usd'])} USD for the first year's HCDT; "
            f"{n(k['pia_prior_cumulative_oil_bbl'])} bbl produced before the ledger; the framework override auto, so each year "
            f"is read under the law of its own year. Every other term is the engine's default, which follows the texts: "
            f"companies income tax at 30 percent, the NDDC levy at 3 percent of the total annual budget, the capital allowance "
            f"over the five years the texts fix, the cost price ratio limit of 65 percent, the Sixth Schedule production "
            f"allowance, and the tertiary education tax at its statutory rate. The royalty by price is read on the Petroleum "
            f"Royalty Regulations 2022 base (the engine default).")


ODOZI_TEXT = common(OD, 'beginner')
NKEMDI_TEXT = common(NK, 'intermediate') + (
    f" The texts do not say which hydrocarbon tax rate a petroleum mining lease granted out of new acreage onshore or in "
    f"shallow water pays, so this capstone states {n(NK['cfg']['pia_new_pml_hct_rate_pct'])} percent as a stated reading; "
    f"none of the six values depends on it.")
ALAKU_TEXT = common(AL, 'advanced') + (
    f" The Nigeria Tax Act 2025 leaves the deep offshore hydrocarbon tax rate open, so this capstone states the reading "
    f"{AL['cfg']['pia_deep_offshore_hct_interpretation']}; none of the six values depends on it. A decommissioning sinking "
    f"fund collects {n(AL['cfg']['abandonment_cost_usd'])} USD at your share in equal contributions from the first year to the "
    f"last, and the escrow condition of NTA s.86 is NOT met.")

TIER = {
    'beginner': (
        'associate', f"ODOZI, an onshore lease converted from an oil mining lease, {n(years(OD)[0])} to {n(years(OD)[1])}",
        'The map of the Act on one ledger',
        ODOZI_TEXT + " Report six values: the crude oil and condensate production royalty rate in 2028, as a fraction; the "
                     "production royalty on liquids and gas in 2029; the hydrocarbon tax in 2030; the development levy in "
                     "2031; companies income tax over the life of the ledger; and the government take, undiscounted, in "
                     "percent. All six to six decimals."),
    'intermediate': (
        'professional', f"NKEMDI, a shallow water lease granted out of new acreage, {n(years(NK)[0])} to {n(years(NK)[1])}",
        'The hydrocarbon tax as a system',
        NKEMDI_TEXT + " Report six values: the crude oil and condensate production royalty in 2028; the production "
                      "allowance in 2029; the hydrocarbon tax chargeable profit in 2029; the cost the cost price ratio "
                      "carries out of 2031 into 2032; the cost forfeited when the ledger ends; and companies income tax "
                      "over the life of the ledger. All six to six decimals."),
    'advanced': (
        'expert', f"ALAKU, a deep offshore lease granted out of new acreage, {n(years(AL)[0])} to {n(years(AL)[1])}",
        'Transitions and reading an outcome',
        ALAKU_TEXT + " Report six values: the total royalty in 2026, production royalty on liquids and gas plus the royalty "
                     "by price; the hydrocarbon tax chargeable profit in 2026; the tertiary education tax in 2025; the "
                     "development levy in 2027; companies income tax in 2028; and companies income tax over the life of the "
                     "ledger. All six to six decimals."),
}
PROMPTS = {t: TIER[t][3] for t in TIERS}

# --------------------------------------------------------------- self checks
NUMS = {t: re.findall(r'(?<![\d.])\d+(?:\.\d+)?(?!\d|\.\d)', PROMPTS[t]) for t in TIERS}
for tier, c in (('beginner', OD), ('intermediate', NK), ('advanced', AL)):
    k = c['cfg']
    for key in ('pia_working_interest_pct', 'oil_price_usd_bbl', 'gas_price_usd_mscf', 'opex_escalator_pct', 'base_year',
                'pia_gas_in_country_share_pct', 'pia_prior_year_opex_usd', 'pia_prior_cumulative_oil_bbl'):
        if n(k[key]) not in NUMS[tier]:
            bad.append(f'{tier} prompt does not state {key} = {n(k[key])}, which the engine ran')
    for word in (k['pia_terrain'], k['pia_license_type'], k['pia_lease_status'], 'Regulations 2022 base', 'framework override auto'):
        if word not in PROMPTS[tier]:
            bad.append(f'{tier} prompt does not state "{word}"')
    if k.get('pia_under_nta_2025_override') != 'auto':
        bad.append(f'{tier}: the capstone does not run the auto framework its prompt states')
    for key in ('pia_tet_rate_pct', 'pia_cit_rate_pct', 'pia_nddc_levy_base', 'pia_nddc_levy_pct', 'pia_cpr_limit_pct',
                'pia_capex_recovery_years', 'pia_price_royalty_base', 'pia_hct_rate_override_pct', 'pia_legacy_pre_audit'):
        if key in k:
            bad.append(f'{tier}: the capstone sets {key}, and its prompt says every other term is the engine default')
if n(NK['cfg']['pia_new_pml_hct_rate_pct']) not in NUMS['intermediate'] or 'stated reading' not in PROMPTS['intermediate']:
    bad.append('the Professional prompt does not state its new-lease reading')
if AL['cfg']['pia_deep_offshore_hct_interpretation'] not in PROMPTS['advanced'] or 'is NOT met' not in PROMPTS['advanced']:
    bad.append('the Expert prompt does not state its deep offshore reading and the escrow condition')
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
    if re.search(r'\bused to\b|\bno longer\b|pre-audit|legacy', text, re.I):
        out.append(f'{label} frames repair history')
    if re.search('[\u2013\u2014]', text):
        out.append(f'{label} carries an en or em dash')
    if re.search(r',\s+not\s+\w', text):
        out.append(f'{label} carries an "X, not Y" contrastive')
    return out


for label, text in READ:
    bad.extend(vocabulary(label, text))
for plant, rule in (('an AI-powered ledger', 'AI claim'), ('the engine used to charge', 'repair history'),
                    ('a lease \u2014 new', 'dash'), ('the Regulations, not the Act', 'contrastive')):
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
-- EC7: Petroleum Industry Act 2021 & Nigerian Fiscal Terms joins the
-- catalogue in the Economics & Commercial module. AN ENGINE COURSE: there is no
-- Suite app; the practicals run in the course's own calculator panels.
--
-- Catalogue row (module 'economics'; path_order {PATH_ORDER}; prereq_slug NULL,
-- the lead's decision; school left at its default) plus the three capstones and
-- their eighteen graded fields, generated by tools/course-waves/pia/gen_course.py
-- from the ENGINE'S OWN RUN (pia_capstone.mjs through the vendored
-- engines/economics/cashflow.ts 3.12.0), which it refuses to write unless
-- fields.json carries exactly that run's values and the tolerance
-- gradedTolerance.js derives. Deep seeds are three separate migrations; the
-- go-live is a fifth and is HELD until a NextGen production upload carries the
-- route /dashboard/apps/pia.
--
-- WHAT IS GRADED. ODOZI (Associate) grades a weighted royalty rate, a
-- production royalty, a hydrocarbon tax, a development levy, companies income
-- tax over the life and the government take; NKEMDI (Professional) grades a
-- liquids royalty, a production allowance across the new-lease cap, a
-- hydrocarbon tax chargeable profit, a cost price ratio carry, the cost
-- forfeited at cessation and companies income tax; ALAKU (Expert) grades a
-- total royalty, a chargeable profit in the first NTA year, the tertiary
-- education tax, the development levy and companies income tax with the escrow
-- condition not met. Every value is a return value of the engine, identical
-- under every open reading of the texts, and the data it was run on is in the
-- case file the prompt names.
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


INDEX_JS = ("// The pia capstone case files, generated by tools/course-waves/pia/gen_course.py\n"
            "// from the engine's own inputs (pia_capstone.mjs --inputs). Only the capstone card\n"
            "// imports this module: no panel preloads a case, and the graded answers are not\n"
            "// stored anywhere in the app.\n")
for tier in TIERS:
    for fname, _ in CASES[tier]:
        INDEX_JS += f"import {ident(fname)} from './{fname}?raw';\n"
INDEX_JS += '\nexport const PIA_CASE_FILES = {\n'
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
    print(f'gen_course: engine run 18 of 18 fields.json values equal what pia_capstone.mjs returned through {ENGINES}, '
          f'every tolerance the one gradedTolerance.js derives; case-file data re-read and equal to the engine run: {CHECKED}; '
          f'prompt lengths {({t: len(PROMPTS[t]) for t in TIERS})}; digest numbers swept: {len(DIGEST_NUMS)}; numbers handed: {len(handed)}; '
          'handed + pairwise + digest collisions + settings + vocabulary + copy rule + precision: 0'
          + ('' if wrote else '; SELF CHECK ONLY, nothing written'))
