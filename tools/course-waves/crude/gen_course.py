#!/usr/bin/env python3
"""Generate the crude course + capstone migration from fields.json,
precision.json and capstone.json, so no expected value, tolerance, condition
or prompt is retyped.

Modelled on tools/course-waves/supply/gen_course.py (MD3, NextGen #165), and
through it on compliance (#161), with the differences this wave forces:

1. THE PROMPTS ARE capstone.json's, VERBATIM, and they are RE-RENDERED HERE.
   crude_capstone.mjs writes the three prompts out of the capstone records in
   crude_fields_capstone.mjs into capstone.json, and every capstone gate on
   this wave (promptleak, capstone leak, copy rule) ran on exactly that text.
   This generator types no prompt: it imports crude_capstone.mjs, which
   renders PROMPTS from the records again through the vendored engines, and
   refuses unless the rendering equals capstone.json byte for byte. The records
   the go-live's second route reads are that same import's records, so the
   route cannot be computed over a record the learner never saw.

2. EVERY GRADED FIELD IS A FOUR-DECIMAL FLOAT GRADED AT HALF A UNIT IN THE
   FOURTH PLACE, and THE TOLERANCE COMES FROM precision.json, never from a
   literal here. precision.json declares each class's decimals; the wave's one
   rule (crude_capstone.mjs DECIMALS and TOLERANCE) makes the tolerance of a
   class of N decimals 5 / 10^(N + 1), which is 5e-5 at four. fields.json must
   carry exactly that for every field, and a tolerance tighter than
   gradeprecision.py's half unit (0.5 * 10^-N) is refused as well, because a
   tolerance below it grades a correctly read figure wrong. The grader
   (academy_submit_capstone) casts expected, tol and answer to numeric and
   accepts |answer - expected| <= tol. The whole-number and 0.5 logic of the
   compliance ladder is gone.

3. THE ENGINE IS RUN HERE, not remembered, and it is run TWICE. `node
   crude_capstone.mjs --json` re-derives all eighteen values through the
   vendored engines, once on the machine clock and once under the wave's
   fakeclock.mjs with the clock moved 900 days, and the two runs must be
   byte-identical (gate_clock.sh proves the source half: no Date, clock or
   Math.random read in the three engine files or the four generators).
   fields.json must equal the run field for field, at full precision. No as-of
   date: these engines read no date, and no prompt states one.

4. THE COLLISION AND LEAK SWEEPS ARE THIS WAVE'S OWN, mirrored from its gates:
   gate_collisions.py (no graded value within its tolerance of the absolute
   value of ANY number token the digest prints, and no two graded values within
   the looser of their tolerances) and gate_promptleak.py, whose DERIVED list
   of engine intermediates is IMPORTED, not copied (no graded value of any tier
   in any prompt within its tolerance, and no token with a decimal that is a
   rounding of a graded value or of any of those intermediates). The labels,
   datasets and titles this generator writes are held to the same sweep.

5. NOTHING HELD IS GRADED. FINDINGS C12 (Refutas viscosity, blended on mass)
   and C13 (Watson K on T50) are taught as stated limits. No graded key, label,
   unit or engine source may name viscosity, Refutas or Watson, and no graded
   value may sit within its tolerance of the engine's held figures on the
   capstone records (the IDAMA blend viscosity, the IDAMA and OGBELE Watson K
   at T50), so a held figure cannot be graded under another name.

6. THE PROMPT STATES EVERY CONDITION. Every number the capstone records feed
   into a graded field (barrels, gravities, per-mass properties, SARA, every
   curve point, the shares, every cut bound and price, the costs and losses,
   every pool property and availability, the target and every limit) must be a
   number token of its tier's prompt, and the Expert prompt must state that the
   alkylate tank is typed as 0 bbl and ask for relief AT THE MARGIN.

Usage: python3 gen_course.py
   CR_WAVE        the wave directory (default /root/md-wip-crude)
   CR_REPO        the nextgen clone   (default /root/wt-md-crude-nextgen)
   CR_ENGINES     packages/engines to run the capstone through
                  (default $CR_REPO/packages/engines)
   CR_COURSE_OUT  where to write      (default $CR_REPO/migrations/...)
"""
import json
import os
import re
import subprocess
import sys

W = os.environ.get('CR_WAVE', '/root/md-wip-crude')
REPO = os.environ.get('CR_REPO', '/root/wt-md-crude-nextgen')
ENGINES = os.environ.get('CR_ENGINES', f'{REPO}/packages/engines')
OUT = os.environ.get('CR_COURSE_OUT', f'{REPO}/migrations/20261010_cr_crude_course.sql')
SLUG, NAME, MODULE, PATH_ORDER = 'crude', 'Crude Assay & Blending', 'commercial_trading', 48
# The two courses cut in the same wave: refinery in this module, supply in its own.
SIBLINGS = (('refinery', 49), ('supply', 50))
TIERS = ('beginner', 'intermediate', 'advanced')

fields = json.load(open(f'{W}/fields.json'))
precision = json.load(open(f'{W}/precision.json'))
capstone = json.load(open(f'{W}/capstone.json'))
wave = json.load(open(f'{W}/wave.json'))
PROMPTS = {t: capstone['tiers'][t]['prompt'] for t in TIERS}
bad = []

os.environ['MD_ENGINES'] = ENGINES
ENV = {**os.environ, 'MD_ENGINES': ENGINES, 'TZ': 'UTC'}


def q(s):
    return "'" + s.replace("'", "''") + "'"


def run(args, env=None, what='the engine run'):
    r = subprocess.run(args, capture_output=True, text=True, cwd=W, env=env or ENV)
    if r.returncode != 0:
        sys.exit(f'REFUSED: {what} failed: ' + r.stderr[-800:])
    return r.stdout


# ---------------------------------------------------------------------------
# THE ENGINE RUN, twice: the machine clock, then a clock moved 900 days.
# Byte-identical or refused.
# ---------------------------------------------------------------------------
_plain = run(['node', os.path.join(W, 'crude_capstone.mjs'), '--json'])
_moved = run(['node', '--import', os.path.join(W, 'fakeclock.mjs'), os.path.join(W, 'crude_capstone.mjs'), '--json'],
             env={**ENV, 'FAKE_CLOCK_DAYS': '900'}, what='the engine run under the fake clock')
if _plain != _moved:
    bad.append('the engine run moved when the clock moved 900 days')
_run = json.loads(_plain)
ENGINE = {f['key']: f['value'] for f in _run}
ENGINE_TOL = {f['key']: f['tol'] for f in _run}

# The engine-derived intermediates, from the wave's own promptleak gate.
sys.path.insert(0, W)
import gate_promptleak as _PL  # noqa: E402  (importable: its main is guarded)
DERIVED = {name: v for name, v in _PL.DERIVED}

# The records, the prompts, the wave's DECIMALS and TOLERANCE, and the held
# figures, rendered again from the same import.
_side = json.loads(run(['node', '--input-type=module', '-e', """
const C = await import(%(caps)s);
const K = await import(%(recs)s);
const A = await import(process.env.MD_ENGINES + '/engines/downstream/crudeAssay.js');
const records = {};
for (const [k, v] of Object.entries(K)) if (typeof v !== 'function' && k !== 'FIELD_SOURCES') records[k] = v;
const idama = A.blendCrudes(K.IDAMA_CRUDES.map((c) => ({ ...c, volumeFraction: K.IDAMA_BARRELS[c.id] })));
const idCurve = A.blendDistillationCurves(K.IDAMA_CRUDES, idama.fractions.map((f) => f.volumeFraction));
const og = A.blendCrudes(K.OGBELE_CRUDES.map((c) => ({ ...c, volumeFraction: K.OGBELE_SHARES[c.id] })));
const ogCurve = A.blendDistillationCurves(K.OGBELE_CRUDES, og.fractions.map((f) => f.volumeFraction));
const held = {
  idama_blend_viscosity_cst_C12: idama.properties.viscosityCSt,
  idama_watson_k_at_t50_C13: A.watsonK({ meanBoilingPointF: A.temperatureAtVolumePercent(idCurve, 50), sg: idama.properties.sg }),
  ogbele_watson_k_at_t50_C13: A.watsonK({ meanBoilingPointF: A.temperatureAtVolumePercent(ogCurve, 50), sg: og.properties.sg }),
};
console.log(JSON.stringify({ prompts: C.PROMPTS, records, sources: K.FIELD_SOURCES,
  decimals: C.DECIMALS, tolerance: C.TOLERANCE, held }));
""" % {'caps': json.dumps(os.path.join(W, 'crude_capstone.mjs')),
       'recs': json.dumps(os.path.join(W, 'crude_fields_capstone.mjs'))}], what='the record export'))
RECORDS = _side['records']
SOURCES = _side['sources']
HELD = _side['held']
for t in TIERS:
    if _side['prompts'][t] != PROMPTS[t]:
        bad.append(f'the {t} prompt crude_capstone.mjs renders from the records is not capstone.json\'s')

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
# tolerance is the wave's half unit in that class's last place, 5 / 10^(N+1),
# and never tighter than gradeprecision.py's half unit 0.5 * 10^-N.
# ---------------------------------------------------------------------------
CLASS_OF, DECIMALS = {}, {}
for ft, k, v, tol in fields:
    cls = [c for c, sp in precision.items() if re.search(sp['match'], k)]
    if len(cls) != 1:
        bad.append(f'{k} matches {len(cls)} precision classes, not exactly one')
        continue
    dec = precision[cls[0]]['decimals']
    want = 5 / 10 ** (dec + 1)
    CLASS_OF[k], DECIMALS[k] = cls[0], dec
    if dec != _side['decimals'] or want != _side['tolerance']:
        bad.append(f'{k}: precision.json class {cls[0]} is {dec} decimals, and crude_capstone.mjs grades '
                   f'{_side["decimals"]} decimals at {_side["tolerance"]!r}')
    if isinstance(tol, bool) or not isinstance(tol, (int, float)) or tol != want:
        bad.append(f'{k} is graded at {tol!r}, and precision.json class {cls[0]} ({dec} decimals) grades it at {want!r}')
    if tol < 0.5 * (10 ** -dec):
        bad.append(f'{k} is graded at {tol!r}, tighter than half a unit in its declared place ({dec} decimals): '
                   'gradeprecision.py refuses it')
    if isinstance(v, bool) or not isinstance(v, (int, float)) or v != v or v in (float('inf'), float('-inf')):
        bad.append(f'{k} = {v!r} is not a finite number, and the grader compares numbers')
for cls, sp in precision.items():
    if not any(CLASS_OF.get(k) == cls for k in KEYS):
        bad.append(f'precision.json class {cls} matches no graded field')

# ---------------------------------------------------------------------------
# The eighteen graded fields. Each label names the record and the quantity,
# never the answer. Units are what the number counts.
# ---------------------------------------------------------------------------
LABELS = {
    ('beginner', 'idama_blend_api'): ('API gravity of the IDAMA cargo', 'degrees API'),
    ('beginner', 'idama_blend_sulfur_wtpct'): ('Sulfur content of the cargo', 'wt%'),
    ('beginner', 'idama_blend_vanadium_ppm'): ('Vanadium content of the cargo', 'ppm'),
    ('beginner', 'idama_abiteye_mass_share_pct'): ("Abiteye Heavy's share of the cargo by mass", 'percent'),
    ('beginner', 'idama_blend_cii'): ('Colloidal instability index of the cargo', 'index'),
    ('beginner', 'idama_opuama_kerosene_yield_pct'): ('Kerosene / Jet yield of Opuama Medium alone', 'volume percent'),
    ('intermediate', 'ogbele_blend_t50_f'): ("Temperature at which the blend's own TBP curve reaches half distilled", 'F'),
    ('intermediate', 'ogbele_blend_kerosene_yield_pct'): ('Kerosene / DPK yield of the blend', 'volume percent'),
    ('intermediate', 'ogbele_blend_diesel_yield_pct'): ('Diesel / AGO yield of the blend', 'volume percent'),
    ('intermediate', 'ogbele_gross_value_per_bbl'): ('Gross product value per bbl of blend', 'dollars per bbl'),
    ('intermediate', 'ogbele_loss_value_per_bbl'): ('Value lost to losses per bbl of blend', 'dollars per bbl'),
    ('intermediate', 'ogbele_netback_per_bbl'): ('Netback per bbl of blend', 'dollars per bbl'),
    ('advanced', 'onne_total_cost_usd'): ('Least total cost of the cargo', 'dollars'),
    ('advanced', 'onne_fcc_volume_bbl'): ('FCC gasoline in the least-cost recipe', 'bbl'),
    ('advanced', 'onne_butane_volume_bbl'): ('Butane in the least-cost recipe', 'bbl'),
    ('advanced', 'onne_sulfur_relief_usd_per_ppm'): ('Value of relief on the sulfur limit, at the margin', 'dollars per ppm'),
    ('advanced', 'onne_rvp_relief_usd_per_psi'): ('Value of relief on the RVP limit, at the margin', 'dollars per psi'),
    ('advanced', 'onne_ron_relief_usd_per_octane'): ('Value of relief on the RON minimum, at the margin', 'dollars per octane number'),
}
assert set(LABELS) == {(f[0], f[1]) for f in fields}, 'labels and fields.json disagree'
assert len({k for _t, k in LABELS}) == 18, 'crude field keys are meant to be globally unique'

TIER = {
    'beginner': (
        'associate',
        'IDAMA, an invented export terminal commingling three invented field streams into one cargo',
        'Three streams, one cargo'),
    'intermediate': (
        'professional',
        'OGBELE, an invented modular refinery valuing a blend of two invented crudes on its own cut set',
        'The blended barrel and its netback'),
    'advanced': (
        'expert',
        'ONNE, an invented blending terminal making a PMS cargo at least cost, one component tank typed as empty',
        'The least-cost recipe and the value of relief'),
}

HEADER = """-- ============================================================================
-- crude: Crude Assay & Blending joins the catalogue, the FIRST course of the
-- Commercial & Trading module.
--
-- Catalogue row (module 'commercial_trading', the academy module the lead
-- ruled for it on 2026-09-19; path_order 48, directly below the two courses cut
-- in the same wave, refinery at 49 in this module and supply at 50 in
-- supply_chain; prereq_slug NULL, the carried-over answer "no hard
-- prerequisite inside a module"; school left at its default, as every
-- Facilities, Economics, Assurance and Supply Chain course leaves it, so the
-- fees are the published school-level rows) plus the three capstones and their
-- eighteen graded fields, generated by tools/course-waves/crude/gen_course.py
-- from fields.json, precision.json and capstone.json, which crude_capstone.mjs
-- writes from the capstone records in crude_fields_capstone.mjs through the
-- vendored engines. The three tier structures (78 lesson keys) and the 396
-- questions are the three deep seeds; the go-live is a fifth migration and is
-- HELD until a NextGen production upload carries the route /dashboard/apps/crude
-- AND the Suite production upload carrying Suite main 1a71d9c90 is live (the
-- first Suite main that carries both the Crude Assay and Blend Optimizer page
-- repairs this course teaches, Suite #532 at 3e5506561, and the engines at
-- e4d3b10 and 13f0936 those pages run on). This file does not depend on
-- refinery or supply: any of the three may be seeded first.
--
-- THE ONE SENTENCE THE COURSE IS. Every property of a blend is computed on its
-- own basis (gravity through specific gravity on volume, sulfur and the other
-- per-mass properties on mass, viscosity through an index, yields on volume off
-- the curve), and every least-cost recipe is a linear programme whose binding
-- specifications, value of relief and infeasibility are answers in their own
-- right.
--
-- THE ENGINES. engines/downstream/crudeAssay.js, productBlending.js and
-- lib/lp/simplex.js, vendored sha-identical with engines 13f0936; the recon
-- findings on the graded paths were repaired upstream in MD1-0 and MD1-1.
--
-- EVERY GRADED FIELD IS A NUMBER THE ENGINE RETURNS, at full precision, graded
-- at HALF A UNIT IN THE FOURTH DECIMAL PLACE, 5e-5, the place every prompt asks
-- for and the digest prints to. The one piece of arithmetic on an engine return
-- is the mass share, the engine's mass fraction times 100. The grader
-- (academy_submit_capstone) casts expected, tol and answer to numeric and
-- accepts |answer - expected| <= tol. No verdict, basis word, band or status is
-- graded, and nothing HELD is: not the Refutas viscosity (FINDINGS C12) and not
-- Watson K (C13). No field reads a date or a clock.
--
-- THE PROMPTS are capstone.json's, verbatim: every condition a field needs and
-- the precision it is graded at, the Expert alkylate tank typed as 0 bbl, relief
-- asked for at the margin, and nothing that hands over an answer. No graded
-- value of any tier is a number in any prompt, within its tolerance or as its
-- own rounding, and none of the engine-derived intermediates (the blends'
-- specific gravities and fractions, the blended curve, the other cut yields,
-- the other recipe volumes and achieved properties, the row prices) is printed
-- in any rounding. No graded value is within its tolerance of any number the
-- teaching digest prints, and no two graded values are within the looser of
-- their tolerances.
-- ============================================================================"""


def num_lit(x):
    """A graded number as the SQL/JSON literal the grader reads, full precision."""
    if isinstance(x, int):
        return str(x)
    return repr(float(x))


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
    if 'Give six numbers, each to four decimals.' not in prompt:
        bad.append(f'the {tier} prompt does not ask for six numbers, each to four decimals')
    if 'Every figure is invented and illustrative.' not in prompt:
        bad.append(f'the {tier} prompt does not say its figures are invented')
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

# 0. THE PROMPT STATES THE PRECISION OF EVERY FIELD, and lists six answers.
PHRASE = {4: 'each to four decimals'}
for tier in TIERS:
    head, _, tail = PROMPTS[tier].partition('Give six numbers')
    lead = tail.split('(1)', 1)[0]
    items = dict(re.findall(r'\((\d)\) (.*?)(?= \(\d\) |$)', tail))
    if sorted(items) != ['1', '2', '3', '4', '5', '6']:
        bad.append(f'the {tier} prompt does not list six numbered answers: {sorted(items)}')
        continue
    for n, (_t, k, _v, _tol) in enumerate([f for f in fields if f[0] == tier], 1):
        dec = DECIMALS.get(k)
        if dec not in PHRASE:
            bad.append(f'{k}: no phrase for {dec} decimals')
            continue
        if PHRASE[dec] not in items[str(n)] and PHRASE[dec] not in lead:
            bad.append(f'the {tier} prompt does not ask for {k} (item {n}) {PHRASE[dec]}')
    if tier == 'advanced':
        for n in ('4', '5', '6'):
            if n == '4' and 'at the margin' not in items[n]:
                bad.append('the advanced prompt does not ask for the sulfur relief at the margin')
            if n in ('5', '6') and not items[n].startswith('The same for'):
                bad.append(f'advanced item {n} does not carry item 4\'s definition of relief at the margin')

# 0b. EVERY CONDITION IS STATED. Each number the records feed into a graded
#     field is a number token of its tier's prompt, as JavaScript prints it.
PNUM = re.compile(r'(?<![\w.])-?\d+(?:\.\d+)?(?![\w])')


def js(x):
    return str(int(x)) if float(x).is_integer() else repr(float(x))


def conditions(tier):
    R = RECORDS
    out = []
    if tier == 'beginner':
        for c in R['IDAMA_CRUDES']:
            out += [('barrels ' + c['name'], R['IDAMA_BARRELS'][c['id']]), ('API ' + c['name'], c['api']),
                    ('sulfur ' + c['name'], c['sulfurWtPct']), ('vanadium ' + c['name'], c['vanadiumPpm'])]
            out += [(f'SARA {s} {c["name"]}', c['sara'][s]) for s in ('saturates', 'aromatics', 'resins', 'asphaltenes')]
            if c['id'] == R['IDAMA_CUT']['crude']:
                out += [(f'curve {c["name"]} {p["volumePercent"]}', p['temperatureF']) for p in c['curve']]
                out += [(f'curve {c["name"]} at {p["temperatureF"]}', p['volumePercent']) for p in c['curve']]
        out += [('cut from', R['IDAMA_CUT']['cut']['fromF']), ('cut to', R['IDAMA_CUT']['cut']['toF'])]
    elif tier == 'intermediate':
        for c in R['OGBELE_CRUDES']:
            out += [('share ' + c['name'], R['OGBELE_SHARES'][c['id']]), ('API ' + c['name'], c['api'])]
            out += [(f'curve {c["name"]} {p["volumePercent"]}', p['temperatureF']) for p in c['curve']]
            out += [(f'curve {c["name"]} at {p["temperatureF"]}', p['volumePercent']) for p in c['curve']]
        for c in R['OGBELE_CUTS']:
            out += [(f'{c["name"]} {b}', c[b]) for b in ('fromF', 'toF') if c[b] is not None]
            out += [(f'price {c["name"]}', R['OGBELE_VALUATION']['prices'][c['id']])]
        v = R['OGBELE_VALUATION']
        out += [('processing', v['processingCostPerBbl']), ('freight', v['freightPerBbl']), ('losses', v['lossPercent'])]
    else:
        for c in R['ONNE_POOL']:
            out += [(f'{p} {c["name"]}', c[p]) for p in ('cost', 'sg', 'density', 'ron', 'mon', 'sulfurPpm', 'rvp', 'maxVolume')]
        out += [('target', R['ONNE_TARGET'])]
        for s in R['ONNE_SPECS']:
            out += [(f'{s["name"]} {b}', s[b]) for b in ('min', 'max') if s.get(b) is not None]
    return out


COND_COUNT = 0
for tier in TIERS:
    toks = set(PNUM.findall(PROMPTS[tier]))
    for what, v in conditions(tier):
        COND_COUNT += 1
        if js(v) not in toks:
            bad.append(f'the {tier} prompt does not state the condition {what} = {js(v)}')
alk = [c for c in RECORDS['ONNE_POOL'] if c['id'] == 'alk']
ALK_SENTENCE = None
if len(alk) != 1 or alk[0]['maxVolume'] != 0:
    bad.append('the ONNE record no longer types the alkylate tank as 0 bbl')
else:
    m = re.search(r'Alkylate: [^:]*?tank typed as 0 bbl available\.', PROMPTS['advanced'])
    if not m or PROMPTS['advanced'].count('typed as 0 bbl') != 1:
        bad.append('the advanced prompt does not state, once, that the alkylate tank is typed as 0 bbl')
    else:
        ALK_SENTENCE = m.group(0)

# 1. THE PROMPTS (gate_promptleak.py): no graded value of any tier within its
#    tolerance of any number token, and no token with a decimal that is a
#    rounding of a graded value or of an engine-derived intermediate. The
#    datasets, titles and labels are read beside the prompt and held to the same.
# The token regex the go-live's SQL sweep uses, which Postgres can read. Both
# must see the same number of tokens in the prompts.
SQLNUM_SRC = r'(?:^|[^A-Za-z0-9_.])(-?[0-9]+(?:\.[0-9]+)?)(?![A-Za-z0-9_])'
SQLNUM = re.compile(SQLNUM_SRC)


def ndec(tok):
    return len(tok.split('.')[1]) if '.' in tok else 0


def is_rounding(tok, value):
    return abs(abs(float(tok)) - abs(value)) <= 0.5 * 10 ** -ndec(tok)


def leaks(text, where):
    out = []
    for tok in PNUM.findall(text):
        for _t, k, v, tol in fields:
            if abs(abs(float(tok)) - abs(v)) <= tol or (ndec(tok) >= 1 and is_rounding(tok, v)):
                out.append(f'{where} prints {tok}, the graded value of {k}')
        for k, v in DERIVED.items():
            if ndec(tok) >= 1 and is_rounding(tok, v):
                out.append(f'{where} prints {tok}, the engine-derived {k}')
    return out


prompt_tokens = 0
sql_tokens = 0
for tier in TIERS:
    prompt_tokens += len(PNUM.findall(PROMPTS[tier]))
    sql_tokens += len(SQLNUM.findall(PROMPTS[tier]))
    bad.extend(leaks(PROMPTS[tier], f'the {tier} prompt'))
    for text in (TIER[tier][1], TIER[tier][2]) + tuple(v for (t, k), vv in LABELS.items() if t == tier for v in vv):
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

# 5. NOTHING HELD IS GRADED (C12 Refutas viscosity, C13 Watson K).
HELD_WORDS = re.compile(r'visc|refutas|watson|cst\b|blendindex', re.I)
for t, k, v, tol in fields:
    for what, text in (('key', k), ('label', LABELS[(t, k)][0]), ('unit', LABELS[(t, k)][1]),
                       ('engine source', SOURCES.get(k, ''))):
        if HELD_WORDS.search(text):
            bad.append(f'{k}: its {what} names a HELD quantity ({text!r})')
    for hk, hv in HELD.items():
        if hv is None or abs(abs(v) - abs(hv)) <= tol:
            bad.append(f'{k} = {v} is the held figure {hk} = {hv}')
if len(HELD) != 3 or any(h is None for h in HELD.values()):
    bad.append(f'the held figures could not all be formed: {HELD}')

# 6. THE CATALOGUE ROW against wave.json, and the siblings' slots.
for what, got, want in (('slug', SLUG, wave['slug']), ('name', NAME, wave['name']),
                        ('module', MODULE, wave['module']), ('path_order', PATH_ORDER, wave['pathOrder']),
                        ('prerequisite', None, wave['prerequisite']),
                        ('prefix', 'cr', wave['prefix']),
                        ('siblings', list(SIBLINGS), [(s['slug'], s['pathOrder']) for s in wave['siblings']])):
    if got != want:
        bad.append(f'catalogue {what}: {got!r} here and {want!r} in wave.json')

# The sweeps must be able to fire.
if prompt_tokens < 60 or len(digest_nums) < 200 or len(DERIVED) < 40 or COND_COUNT < 100:
    bad.append(f'the sweeps read {prompt_tokens} prompt tokens, {len(digest_nums)} digest numbers, '
               f'{len(DERIVED)} intermediates and {COND_COUNT} conditions, so a sweep is reading the wrong thing')

if __name__ == '__main__':
    if bad or unclosed or dashes:
        print('REFUSED, nothing written:')
        for b in bad:
            print('  ', b)
        print('unclosed literal:', bool(unclosed), '| en/em dashes:', dashes)
        sys.exit(1)
    open(OUT, 'w').write(sql)
    print(f'wrote {OUT}: {len(sql.splitlines())} lines, 3 capstones, {len(fields)} fields')
    print('engine run: 18 of 18 fields.json values equal crude_capstone.mjs --json through the vendored engines, '
          'byte-identical with the clock moved 900 days')
    print('tolerances: 18 of 18 are precision.json\'s four decimals at 5 / 10^5 = 5e-5, none tighter than '
          'gradeprecision.py\'s half unit; every prompt asks for four decimals')
    print('prompts: 3 of 3 re-rendered from the records equal capstone.json; lengths',
          {t: len(PROMPTS[t]) for t in TIERS})
    print(f'conditions stated: {COND_COUNT} of {COND_COUNT} record numbers are prompt tokens; alkylate typed 0 bbl stated once')
    print(f'held: no key, label, unit or source names C12/C13, and no graded value is a held figure {HELD}')
    print(f'prompt number tokens swept: {prompt_tokens} | engine-derived intermediates: {len(DERIVED)} '
          f'| digest numbers: {len(digest_nums)}')
    print('prompt + intermediate + digest + pairwise + precision + copy + held + catalogue refusals: 0')
