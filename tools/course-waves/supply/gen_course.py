#!/usr/bin/env python3
"""Generate the supply course + capstone migration from fields.json,
precision.json and capstone.json, so no expected value, tolerance, condition
or prompt is retyped.

Modelled on tools/course-waves/compliance/gen_course.py (AS-CQ, NextGen #161)
and its sibling riskchange (#160), with the differences this wave forces:

1. THE PROMPTS ARE capstone.json's, VERBATIM, and they are RE-RENDERED HERE.
   supply_capstone.mjs writes the three prompts out of the capstone records in
   supply_fields_capstone.mjs into capstone.json, and every capstone gate on
   this wave (promptleak, capstone leak, copy rule) ran on exactly that text.
   This generator types no prompt: it imports supply_capstone.mjs, which
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
   decimals is graded at 10^-N, and the one whole number (the truck count, a
   class of 0 decimals) at 0.5, which admits exactly one integer. fields.json
   must carry exactly that tolerance for every field (anything else is
   refused), and a tolerance tighter than half a unit in the declared place is
   refused as well, because that is the rule the kit's gradeprecision.py
   enforces: a tolerance below it grades a correctly read figure wrong. The
   whole-number and 0.5 logic of the compliance ladder is gone.

3. THE ENGINE IS RUN HERE, not remembered, and it is run TWICE. `node
   supply_capstone.mjs --json` re-derives all eighteen values through the
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

Usage: python3 gen_course.py
   TDS_WAVE        the wave directory (default /root/md-wip-supply)
   TDS_REPO        the nextgen clone   (default /root/wt-md-supply-nextgen)
   TDS_ENGINES     packages/engines to run the capstone through
                   (default $TDS_REPO/packages/engines)
   TDS_COURSE_OUT  where to write      (default $TDS_REPO/migrations/...)
"""
import json
import os
import re
import subprocess
import sys

W = os.environ.get('TDS_WAVE', '/root/md-wip-supply')
REPO = os.environ.get('TDS_REPO', '/root/wt-md-supply-nextgen')
ENGINES = os.environ.get('TDS_ENGINES', f'{REPO}/packages/engines')
OUT = os.environ.get('TDS_COURSE_OUT', f'{REPO}/migrations/20261012_tds_supply_course.sql')
SLUG, NAME, MODULE, PATH_ORDER = 'supply', 'Terminals, Depots & Fuel Supply', 'supply_chain', 50
# The two Commercial & Trading courses cut in the same wave, in their own module.
SIBLINGS = (('crude', 48), ('refinery', 49))
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
_plain = run(['node', os.path.join(W, 'supply_capstone.mjs'), '--json'])
_moved = run(['node', '--import', os.path.join(W, 'fakeclock.mjs'), os.path.join(W, 'supply_capstone.mjs'), '--json'],
             env={**ENV, 'FAKE_CLOCK_DAYS': '900', 'FAKE_RANDOM': '0.37'}, what='the engine run under the fake clock')
if _plain != _moved:
    bad.append('the engine run moved when the clock moved 900 days and Math.random was pinned')
_run = json.loads(_plain)
ENGINE = {f['key']: f['value'] for f in _run['fields']}
ENGINE_TOL = {f['key']: f['tol'] for f in _run['fields']}
DERIVED = _run['derived']

# The records and the prompts, rendered again from the same import.
_side = json.loads(run(['node', '--input-type=module', '-e', """
const C = await import(%(caps)s);
const K = await import(%(recs)s);
const FP = await import(process.env.MD_ENGINES + '/engines/downstream/fuelPricing.js');
const records = {};
for (const [k, v] of Object.entries(K)) if (typeof v !== 'function' && k !== 'FIELD_SOURCES') records[k] = v;
records.IMPORT_TEMPLATE = FP.IMPORT_TEMPLATE.map(({ id, label, basis, stage }) => ({ id, label, basis, stage }));
records.PUMP_TEMPLATE = FP.PUMP_TEMPLATE.map(({ id, label, basis, recipient }) => ({ id, label, basis, recipient }));
console.log(JSON.stringify({ prompts: C.PROMPTS, records }));
""" % {'caps': json.dumps(os.path.join(W, 'supply_capstone.mjs')),
       'recs': json.dumps(os.path.join(W, 'supply_fields_capstone.mjs'))}], what='the record export'))
RECORDS = _side['records']
for t in TIERS:
    if _side['prompts'][t] != PROMPTS[t]:
        bad.append(f'the {t} prompt supply_capstone.mjs renders from the records is not capstone.json\'s')

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
# tolerance is one unit in that class's last place (0.5 for 0 decimals), and
# never tighter than half a unit there (gradeprecision.py's rule).
# ---------------------------------------------------------------------------
CLASS_OF, DECIMALS, WANT_TOL = {}, {}, {}
for ft, k, v, tol in fields:
    cls = [c for c, sp in precision.items() if re.search(sp['match'], k)]
    if len(cls) != 1:
        bad.append(f'{k} matches {len(cls)} precision classes, not exactly one')
        continue
    dec = precision[cls[0]]['decimals']
    want = 0.5 if dec == 0 else float(f'1e-{dec}')
    CLASS_OF[k], DECIMALS[k], WANT_TOL[k] = cls[0], dec, want
    if isinstance(tol, bool) or not isinstance(tol, (int, float)) or tol != want:
        bad.append(f'{k} is graded at {tol!r}, and precision.json class {cls[0]} ({dec} decimals) grades it at {want!r}')
    if tol < 0.5 * 10 ** -dec:
        bad.append(f'{k} is graded at {tol!r}, tighter than half a unit in its declared place ({dec} decimals): '
                   'gradeprecision.py refuses it')
    if isinstance(v, bool) or not isinstance(v, (int, float)) or v != v or v in (float('inf'), float('-inf')):
        bad.append(f'{k} = {v!r} is not a finite number, and the grader compares numbers')
    if dec == 0 and (not isinstance(v, int) or isinstance(v, bool)):
        bad.append(f'{k} is in a class of 0 decimals and {v!r} is not a whole number')
for cls, sp in precision.items():
    if not any(CLASS_OF.get(k) == cls for k in KEYS):
        bad.append(f'precision.json class {cls} matches no graded field')

# ---------------------------------------------------------------------------
# The eighteen graded fields. Each label names the record and the quantity,
# never the answer; the sign convention of the one signed field is the
# prompt's own. Units are what the number counts.
# ---------------------------------------------------------------------------
LABELS = {
    ('beginner', 'okomu_t1_gross_m3'): ('OK-1 gross observed volume', 'm3'),
    ('beginner', 'okomu_t1_standard_m3'): ('OK-1 standard volume', 'm3'),
    ('beginner', 'okomu_t2_standard_m3'): ('OK-2 standard volume', 'm3'),
    ('beginner', 'okomu_expected_closing_m3'): ('Expected closing stock of the day', 'm3'),
    ('beginner', 'okomu_unaccounted_m3'): ('Unaccounted figure of the day, a loss as a negative number', 'm3'),
    ('beginner', 'okomu_tolerance_m3'): ('Tolerance of the day', 'm3'),
    ('intermediate', 'ogwashi_rack_probability_of_waiting'): ('Probability that an arriving truck waits for a bay', 'probability'),
    ('intermediate', 'ogwashi_rack_mean_wait_min'): ('Mean wait for a bay', 'minutes'),
    ('intermediate', 'ogwashi_pumpable_stock_m3'): ('Pumpable stock of the farm', 'm3'),
    ('intermediate', 'ogwashi_days_of_cover'): ('Days of cover on the liftings', 'days'),
    ('intermediate', 'ogwashi_cost_per_litre_delivered_ngn'): ('Cost of the lane per litre delivered', 'naira a litre'),
    ('intermediate', 'ogwashi_trucks_required'): ('Trucks the lane needs', 'trucks'),
    ('advanced', 'oron_cif_usd'): ('CIF value of the cargo', 'USD'),
    ('advanced', 'oron_landed_total_usd'): ('Landed total of the cargo', 'USD'),
    ('advanced', 'oron_landed_per_litre_ngn'): ('Landed cost per litre sold', 'naira a litre'),
    ('advanced', 'oron_pump_price_ngn'): ('Pump price', 'naira a litre'),
    ('advanced', 'oron_government_share_ngn'): ('Government share of the pump price', 'naira a litre'),
    ('advanced', 'oron_breakeven_fx'): ('Exchange rate at which the pump price meets the cap', 'naira to the dollar'),
}
assert set(LABELS) == {(f[0], f[1]) for f in fields}, 'labels and fields.json disagree'
assert len({k for _t, k in LABELS}) == 18, 'supply field keys are meant to be globally unique'

TIER = {
    'beginner': (
        'associate',
        'OKOMU, an inland depot of an invented operator: two tanks dipped one morning, and the day they close',
        'Two dips and the day closed'),
    'intermediate': (
        'professional',
        'OGWASHI, a depot of an invented operator: its loading rack, its tank farm, and the truck lane to its stations',
        'The rack, the farm and the lane'),
    'advanced': (
        'expert',
        'ORON, an AGO cargo landed at an invented jetty and priced to the nozzle against a price cap',
        'The cargo, the litre and the cap'),
}

HEADER = """-- ============================================================================
-- supply: Terminals, Depots & Fuel Supply joins the catalogue, the FIRST course
-- of the Supply Chain & Logistics module.
--
-- Catalogue row (module 'supply_chain', the academy module the lead ruled for
-- it on 2026-09-19; path_order 50, directly above the two Commercial & Trading
-- courses cut in the same wave, crude at 48 and refinery at 49; prereq_slug
-- NULL, the carried-over answer "no hard prerequisite inside a module"; school
-- left at its default, as every Facilities, Economics and Assurance course
-- leaves it, so the fees are the published school-level rows) plus the three
-- capstones and their eighteen graded fields, generated by
-- tools/course-waves/supply/gen_course.py from fields.json, precision.json and
-- capstone.json, which supply_capstone.mjs writes from the capstone records in
-- supply_fields_capstone.mjs through the vendored engines. The three tier
-- structures (78 lesson keys) and the 396 questions are the three deep seeds;
-- the go-live is a fifth migration and is HELD until a NextGen production
-- upload carries the route /dashboard/apps/supply AND the Suite production
-- upload carrying Suite main 1a71d9c90 (Suite #540: the Terminal & Depot page
-- repairs this course teaches, and the engines at 13f0936 that page and the
-- Fuel Pricing page run on) is live. This file does not depend on crude or
-- refinery: any of the three may be seeded first.
--
-- THE ONE SENTENCE THE COURSE IS. A terminal's stock, a cargo's cost and a
-- litre's pump price are each a chain of measured inputs walked in a stated
-- order, and the engine refuses or names every link nobody measured instead of
-- assuming it, because a figure that cannot come out wrong proves nothing.
--
-- THE ENGINES. engines/downstream/terminalDepot.js and fuelPricing.js,
-- vendored sha-identical with engines 13f0936 (MD3-2); the recon findings on
-- the graded paths were repaired upstream in MD3-0 and MD3-1.
--
-- EVERY GRADED FIELD IS A NUMBER THE ENGINE RETURNS, at full precision, graded
-- at ONE UNIT IN THE LAST PLACE THE PROMPT ASKS FOR: m3, minutes, days, dollars
-- and the exchange rate to two decimals at 0.01; the probability of waiting and
-- the naira-a-litre figures to four at 0.0001; the truck count, the one whole
-- number, at 0.5. The engine itself rounds CIF and the landed total to the cent
-- and the per-litre prices to four decimals, so a correct reading can sit half
-- a unit from the stored value on each side. The grader
-- (academy_submit_capstone) casts expected, tol and answer to numeric and
-- accepts |answer - expected| <= tol. No verdict, direction or refusal is
-- graded. No field reads a date or a clock.
--
-- THE PROMPTS are capstone.json's, verbatim: every condition a field needs and
-- the precision it is graded at, and nothing that hands over an answer. No
-- graded value of any tier is a number in any prompt, within its tolerance or
-- as its own rounding, and none of the engine-derived intermediates (the water
-- volumes, the closing dip, the offered load, the cycle, the trips a day, C&F,
-- the outturn, the dollar cost a litre) is printed in any rounding of three or
-- more significant figures. No graded value is within its tolerance of any
-- number the teaching digest prints, and no two graded values are within the
-- looser of their tolerances.
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
    if '(an invented record)' not in prompt:
        bad.append(f'the {tier} prompt does not say its record is invented')
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
#    "(1) ... (6) ..."; field n's own item, or the sentence that opens the
#    list, must name the precision the field is graded at.
PHRASE = {0: 'a whole number', 2: 'two decimals', 4: 'four decimals'}
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

# 5. THE CATALOGUE ROW against wave.json, and the siblings' slots.
for what, got, want in (('slug', SLUG, wave['slug']), ('name', NAME, wave['name']),
                        ('module', MODULE, wave['module']), ('path_order', PATH_ORDER, wave['pathOrder']),
                        ('prerequisite', None, wave['prerequisite']),
                        ('prefix', 'tds', wave['prefix']),
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
    print('engine run: 18 of 18 fields.json values equal supply_capstone.mjs --json through the vendored engines, '
          'byte-identical with the clock moved 900 days and Math.random pinned')
    print('tolerances: 18 of 18 are precision.json\'s one unit in the last place (0.5 for the whole number), '
          'none tighter than gradeprecision.py\'s half unit; every prompt states each field\'s precision')
    print('prompts: 3 of 3 re-rendered from the records equal capstone.json; lengths',
          {t: len(PROMPTS[t]) for t in TIERS})
    print(f'prompt number tokens swept: {prompt_tokens} | engine-derived intermediates: {len(DERIVED)} '
          f'| digest numbers: {len(digest_nums)}')
    print('prompt + intermediate + digest + pairwise + precision + copy + catalogue refusals: 0')
