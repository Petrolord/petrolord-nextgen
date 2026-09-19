#!/usr/bin/env python3
"""Generate the refinery course + capstone migration from fields.json,
precision.json and capstone.json, so no expected value, tolerance, condition or
prompt is retyped.

Modelled on tools/course-waves/compliance/gen_course.py (AS-CQ, NextGen #161),
with the differences this wave forces:

1. THE PROMPTS ARE capstone.json's, VERBATIM. refinery_capstone.mjs writes the
   three prompts out of the capstone records (refinery_fields_capstone.mjs)
   into capstone.json, and every capstone gate on this wave (promptleak,
   capstone leak, copy rule) was run on exactly that text. So this generator
   types no prompt at all: it reads capstone.json and refuses a prompt that
   carries a newline, does not ask for six numbers, or asks for a precision
   other than the one its fields are graded at.

2. THE GRADED FIELDS ARE FLOATS, graded at their CLASS's tolerance. The grader
   (academy_submit_capstone) casts expected, tol and the answer to numeric and
   accepts |answer - expected| <= tol. The whole-number rule of the Assurance
   waves is gone. Each field's tolerance is TAKEN FROM precision.json: the one
   class whose `match` names the field, and that class's tolerance is the
   CLASSES table the capstone generator itself grades with (dollars and barrels
   0.5, dollars a barrel and percent 0.005, millions 0.00005). A tolerance in
   fields.json that is not its class's is refused, a class that is not in
   precision.json is refused, a tolerance TIGHTER than half a unit of the places
   precision.json says the digest prints the class to is refused (the half-ULP
   rule), and the kit's own gradeprecision.py is run on the same inputs and
   must pass. A stored value carries at most six places past the graded place.

3. NO AS-OF DATE. These engines read no date except the schedule's period
   start and the screening engine's start year, and the clock guard
   (clockguard.mjs) refuses any call that would read the machine clock. The
   Expert prompt states the planning period (the 31-day period starting
   2027-03-01) because its plan ledger is cascaded over it. This generator also
   PROBES whether any graded value depends on the period, by re-running the
   Expert month's reconciliation over three other periods through the raw
   engine, and prints the result.

4. NO NPV AND NO IRR IS GRADED. The Economics courses grade those. A graded key,
   label or unit that names either is refused.

5. THE ENGINE IS RUN HERE, not remembered. `node refinery_capstone.mjs --json`
   re-derives all eighteen values through the vendored engines under the clock
   guard, and this refuses if fields.json disagrees with it by so much as one
   field. The same run yields the capstone records and the figures the engine
   DERIVES on the way to a graded field (a scaled capital cost, a plan volume, a
   plan ledger value), which gate_promptleak.py forbids in any prompt;
   gen_golive.py imports all of it from here.

6. THE COLLISION SWEEPS ARE THIS WAVE'S OWN, mirrored from its gates:
   gate_collisions.py (no graded value within its tolerance of the absolute
   value of ANY number token the digest prints, and no two graded values within
   the looser of their tolerances) and gate_promptleak.py (no graded value of
   any tier as a number token in any prompt, read as it stands, x1e6 and /1e6,
   and no engine-derived figure that is not itself a stated condition).

Usage: python3 gen_course.py
   RF_WAVE        the wave directory (default /root/md-wip-refinery)
   RF_REPO        the nextgen clone   (default /root/wt-md-refinery-nextgen)
   RF_ENGINES     packages/engines to run the capstone through
                  (default $RF_REPO/packages/engines)
   RF_COURSE_OUT  where to write      (default $RF_REPO/migrations/...)
   RF_KIT         the wave kit        (default /root/dc-wavekit)
"""
import json
import os
import re
import subprocess
import sys

W = os.environ.get('RF_WAVE', '/root/md-wip-refinery')
REPO = os.environ.get('RF_REPO', '/root/wt-md-refinery-nextgen')
ENGINES = os.environ.get('RF_ENGINES', f'{REPO}/packages/engines')
KIT = os.environ.get('RF_KIT', '/root/dc-wavekit')
OUT = os.environ.get('RF_COURSE_OUT', f'{REPO}/migrations/20261011_rf_refinery_course.sql')
SLUG, NAME, MODULE, PATH_ORDER = 'refinery', 'Refinery Feasibility & Planning', 'commercial_trading', 49
SIBLINGS = (('crude', 48, 'commercial_trading'), ('supply', 50, 'supply_chain'))
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


def node(js):
    r = subprocess.run(['node', '--input-type=module', '-e', js], capture_output=True, text=True, cwd=W, env=ENV)
    if r.returncode != 0:
        sys.exit('REFUSED: the engine run failed: ' + r.stderr[-800:])
    return json.loads(r.stdout)


# ---------------------------------------------------------------------------
# THE ENGINE RUN. The eighteen values, the records, the classes, the derived
# figures and the period probe.
# ---------------------------------------------------------------------------
_r = subprocess.run(['node', os.path.join(W, 'refinery_capstone.mjs'), '--json'],
                    capture_output=True, text=True, cwd=W, env=ENV)
if _r.returncode != 0:
    sys.exit('REFUSED: refinery_capstone.mjs --json failed: ' + _r.stderr[-800:])
ENGINE = {f['key']: f['value'] for f in json.loads(_r.stdout)}

_side = node("""
const K = await import(%(caps)s);
const { loadGuarded } = await import(%(guard)s);
const E = process.env.MD_ENGINES;
const { RAW, G } = await loadGuarded(E, { periodStart: K.PERIOD_START, startYears: [K.START_YEAR] });
const RP = G.refineryPlanning, MR = G.modularRefinery, SM = G.streamModel;
const I = K.IKARAMA, A = K.AMASSOMA, KO = K.KOLOAMA;
// The figures the engine derives on the way to a graded field (gate_promptleak.py's list, by the same code).
const derived = [];
for (const e of [0.9, 0.6]) derived.push(MR.scaleCapex({ baseCost: I.baseCost, baseCapacity: I.baseCapacity, capacity: I.capacityBpd, exponent: e }).cost);
const s = RAW.modularRefinery.SUPPLY_SCENARIOS.find((x) => x.id === I.scenarioId);
derived.push(I.capacityBpd * I.onstreamDays * s.utilisation);
for (const c of [A, KO]) {
  const p = RP.planRefinery({ streams: c.streams, crudes: c.crudes, units: c.units, products: c.products });
  derived.push(p.totalCrude, p.margin, p.revenue, p.crudeCost, p.unitCost);
  for (const r of p.crudeRuns) derived.push(r.volume, r.cost);
  for (const r of p.unitRuns) derived.push(r.throughput, r.cost);
  for (const r of p.productMakes) derived.push(r.volume, r.revenue);
}
// THE PERIOD PROBE, through the RAW engine with the period passed explicitly
// (so no clock is read): the four Expert variance fields over other periods.
const kp = RP.planRefinery({ streams: KO.streams, crudes: KO.crudes, units: KO.units, products: KO.products });
const act = KO.actuals.map((a, i) => SM.makeEvent({ id: `a${i}`, ledger: 'actual', type: a.type, materialId: a.materialId, quantity: a.quantity, cost: a.cost }));
const probe = [[K.PERIOD_START, K.PERIOD_DAYS], ['2027-03-01', 30], ['2027-02-01', 28], ['2027-11-01', 7]].map(([ps, pd]) => {
  const sch = RAW.refineryPlanning.cascadeToSchedule({ plan: kp, periodStart: ps, periodDays: pd, cargoSize: KO.cargoSize });
  const r = RAW.refineryPlanning.reconcilePeriod({ planEvents: sch.events, actualEvents: act, plan: kp });
  const l = (m, t) => r.lines.find((x) => x.materialId === m && x.type === t);
  return { period: `${ps}+${pd}`, events: sch.events.length, v: [l('usan', 'receipt').priceVariance, l('diesel', 'delivery').volumeVariance, r.total.totalVariance, r.total.cost.totalVariance] };
});
const CLASSES = Object.fromEntries(Object.entries(K.CLASSES).map(([k, c]) => [k, { decimals: c.decimals, tol: c.tol, suffix: c.suffix.source }]));
console.log(JSON.stringify({
  derived: derived.filter((v) => Math.abs(v) >= 1), probe, CLASSES,
  periodStart: K.PERIOD_START, periodDays: K.PERIOD_DAYS, startYear: K.START_YEAR,
  records: { IKARAMA: I, AMASSOMA: A, KOLOAMA: KO },
  constants: {
    SCALING_EXPONENT: RAW.modularRefinery.SCALING_EXPONENT,
    CONFIGURATIONS: Object.fromEntries(Object.entries(RAW.modularRefinery.CONFIGURATIONS).map(([k, c]) => [k, c.productYields])),
    SUPPLY_SCENARIOS: RAW.modularRefinery.SUPPLY_SCENARIOS.map((x) => ({ id: x.id, name: x.name, utilisation: x.utilisation, crudePremium: x.crudePremium })),
  },
}));
""" % {'caps': json.dumps(os.path.join(W, 'refinery_fields_capstone.mjs')),
       'guard': json.dumps(os.path.join(W, 'clockguard.mjs'))})
RECORDS = _side['records']
CONSTANTS = _side['constants']
CLASSES = _side['CLASSES']
PERIOD_START, PERIOD_DAYS, START_YEAR = _side['periodStart'], _side['periodDays'], _side['startYear']
PROBE = _side['probe']

KEYS = [k for _t, k, _v, _tol in fields]
TIER_OF = {k: t for t, k, _v, _tol in fields}
F = {k: v for _t, k, v, _tol in fields}
TOL = {k: tol for _t, k, _v, tol in fields}
if set(ENGINE) != set(KEYS):
    bad.append(f'the engine run and fields.json name different fields: {sorted(set(ENGINE) ^ set(KEYS))}')
for k in KEYS:
    if ENGINE.get(k) != F[k]:
        bad.append(f'{k}: fields.json says {F[k]} and the engine returns {ENGINE.get(k)}')
for t in TIERS:
    if [f['key'] for f in capstone['tiers'][t]['fields']] != [k for tt, k, _v, _tol in fields if tt == t]:
        bad.append(f'capstone.json and fields.json list the {t} fields differently')
for t in TIERS:
    for f in capstone['tiers'][t]['fields']:
        if f['tol'] != TOL.get(f['key']):
            bad.append(f'capstone.json grades {f["key"]} at {f["tol"]} and fields.json at {TOL.get(f["key"])}')

# ---------------------------------------------------------------------------
# THE PERIOD. Stated in the Expert prompt, and the same period everywhere.
# ---------------------------------------------------------------------------
for what, got in (('capstone.json', capstone.get('periodStart')), ('wave.json', wave.get('periodStart'))):
    if got != PERIOD_START:
        bad.append(f'the period starts {got} in {what} and {PERIOD_START} in the capstone records')
if wave.get('periodDays') != PERIOD_DAYS or wave.get('startYear') != START_YEAR:
    bad.append('wave.json and the capstone records disagree on the period length or the start year')
PERIOD_PHRASE = f'the {PERIOD_DAYS}-day period starting {PERIOD_START}'
if PERIOD_PHRASE not in PROMPTS['advanced']:
    bad.append(f'the advanced prompt does not state "{PERIOD_PHRASE}"')
_PK = ('koloama_usan_price_variance_usd', 'koloama_diesel_volume_variance_usd',
       'koloama_margin_variance_usd', 'koloama_cost_variance_usd')
# Float noise is not dependence: a field depends on the period when another
# period moves it by more than a thousandth of its tolerance.
PERIOD_DEPENDS = any(abs(a - b) > TOL[k] / 1000 for p in PROBE[1:] for k, a, b in zip(_PK, p['v'], PROBE[0]['v']))

# ---------------------------------------------------------------------------
# TOLERANCES, from precision.json, and nothing else.
# ---------------------------------------------------------------------------
CLASS_OF = {}
for k in KEYS:
    hits = [c for c, sp in precision.items() if re.search(sp['match'], k)]
    if len(hits) != 1:
        bad.append(f'{k} matches {len(hits)} precision classes in precision.json, not exactly one')
        continue
    CLASS_OF[k] = hits[0]
for c, sp in precision.items():
    if c not in CLASSES:
        bad.append(f'precision.json declares class {c}, which the capstone generator does not grade with')
        continue
    if sp['decimals'] != CLASSES[c]['decimals']:
        bad.append(f'class {c} prints to {sp["decimals"]} decimals in precision.json and {CLASSES[c]["decimals"]} in CLASSES')
    # The half-ULP rule (gradeprecision.py): never tighter than half a unit in
    # the last place the digest prints the class to.
    if CLASSES[c]['tol'] < 0.5 * 10 ** -sp['decimals'] - 1e-15:
        bad.append(f'class {c} is graded at {CLASSES[c]["tol"]}, tighter than half a unit of its {sp["decimals"]} printed decimals')
GRADED_PLACES = {}
for k in KEYS:
    c = CLASS_OF.get(k)
    if c is None:
        continue
    want = CLASSES[c]['tol']
    if TOL[k] != want:
        bad.append(f'{k} is graded at {TOL[k]} and its precision.json class {c} at {want}; no other tolerance is accepted')
    if not re.search(CLASSES[c]['suffix'], k):
        bad.append(f'{k} is in precision class {c} and does not carry its suffix /{CLASSES[c]["suffix"]}/')
    places = round(-__import__('math').log10(want * 2))
    GRADED_PLACES[k] = places
    v = F[k]
    if isinstance(v, bool) or not isinstance(v, (int, float)):
        bad.append(f'{k} = {v!r} is not a number, and the grader compares numbers')
    elif round(v, places + 6) != v:
        bad.append(f'{k} = {v!r} carries more than six places past its graded place ({places})')
_gp = subprocess.run(['python3', f'{KIT}/gradeprecision.py', W], capture_output=True, text=True)
GRADEPRECISION = (_gp.stdout.strip().splitlines() or [''])[-1]
if _gp.returncode != 0:
    bad.append(f'the kit gradeprecision.py refuses these inputs (exit {_gp.returncode}): {GRADEPRECISION}')

# The prompt asks for each answer at the precision it is graded at.
ASK = {0.5: re.compile(r'to the whole (?:dollar|barrel)'), 0.005: re.compile(r'to the cent|percent to two decimals'),
       0.00005: re.compile(r'to four decimals')}
for t in TIERS:
    for tol, rx in ASK.items():
        n_fields = sum(1 for tt, _k, _v, tl in fields if tt == t and tl == tol)
        n_asked = len(rx.findall(PROMPTS[t]))
        if n_fields != n_asked:
            bad.append(f'the {t} prompt asks {n_asked} time(s) for the precision of tolerance {tol} and grades {n_fields} field(s) there')

# ---------------------------------------------------------------------------
# The eighteen graded fields. Each label names the record and the quantity,
# never the answer and never its sign. Units are what the number counts.
# ---------------------------------------------------------------------------
LABELS = {
    ('beginner', 'ikarama_modular_capex_usd'): ('Capital cost by the modular scaling law', 'US dollars'),
    ('beginner', 'ikarama_stick_built_capex_usd'): ('Capital cost by the stick-built scaling law', 'US dollars'),
    ('beginner', 'ikarama_gross_value_per_bbl'): ('Gross value of the product slate per barrel of crude', 'US dollars a barrel'),
    ('beginner', 'ikarama_annual_throughput_bbl'): ('Annual crude throughput under the scenario', 'barrels'),
    ('beginner', 'ikarama_gross_margin_per_bbl'): ('Gross margin per barrel of crude under the scenario', 'US dollars a barrel'),
    ('beginner', 'ikarama_first_year_revenue_usd'): ('Revenue in the first operating year', 'US dollars'),
    ('intermediate', 'amassoma_crude_run_bbl'): ('Total crude run of the optimal plan', 'barrels'),
    ('intermediate', 'amassoma_cdu_utilisation_pct'): ('Utilisation of the crude unit', 'percent'),
    ('intermediate', 'amassoma_plan_margin_usd'): ('Plan margin for the month', 'US dollars'),
    ('intermediate', 'amassoma_gross_margin_per_bbl'): ('Gross margin per barrel of crude', 'US dollars a barrel'),
    ('intermediate', 'amassoma_naphtha_value_per_bbl'): ('Value to the plan of one more barrel of naphtha', 'US dollars a barrel'),
    ('intermediate', 'amassoma_gasoil_value_per_bbl'): ('Value to the plan of one more barrel of gasoil', 'US dollars a barrel'),
    ('advanced', 'koloama_usan_price_variance_usd'): ('Price variance on the Usan crude receipts', 'US dollars'),
    ('advanced', 'koloama_diesel_volume_variance_usd'): ('Volume variance on the diesel lifts', 'US dollars'),
    ('advanced', 'koloama_margin_variance_usd'): ('Total variance on margin across the matched lines', 'US dollars'),
    ('advanced', 'koloama_cost_variance_usd'): ('Total variance on the cost lines as recorded', 'US dollars'),
    ('advanced', 'koloama_first_tax_mm'): ('Expansion tax in the first year it pays any', 'millions of US dollars'),
    ('advanced', 'koloama_lifetime_tax_mm'): ('Expansion tax over its life', 'millions of US dollars'),
}
assert set(LABELS) == {(f[0], f[1]) for f in fields}, 'labels and fields.json disagree'
assert len({k for _t, k in LABELS}) == 18, 'refinery field keys are meant to be globally unique'
UNIT_OF_CLASS = {'usd': 'US dollars', 'bbl': 'barrels', 'per_bbl': 'US dollars a barrel', 'pct': 'percent',
                 'mm': 'millions of US dollars'}
for (t, k), (_label, unit) in LABELS.items():
    if CLASS_OF.get(k) and UNIT_OF_CLASS[CLASS_OF[k]] != unit:
        bad.append(f'{k} is labelled in {unit} and graded in class {CLASS_OF[k]}')

NPV_IRR = re.compile(r'npv|irr|net present|internal rate', re.I)
for (t, k), (label, unit) in LABELS.items():
    if NPV_IRR.search(k) or NPV_IRR.search(label) or NPV_IRR.search(unit):
        bad.append(f'{t}/{k} names an NPV or an IRR, which the Economics courses grade and this course does not')

TIER = {
    'beginner': (
        'associate',
        'IKARAMA, a conversion modular refinery screened on a vendor quotation under tight crude supply',
        'The modular screen: capital, slate, throughput and margin'),
    'intermediate': (
        'professional',
        'AMASSOMA, one month of a refinery plan: three crudes, a crude unit, a reformer, a diesel hydrotreater and six products',
        'The optimal plan and what its streams are worth'),
    'advanced': (
        'expert',
        'KOLOAMA, a month of plan against actuals and a hydroskimming expansion screened for tax',
        'Variance on margin and the tax of an expansion'),
}

HEADER = f"""-- ============================================================================
-- refinery: Refinery Feasibility & Planning joins the catalogue, the SECOND
-- course of the Commercial & Trading module.
--
-- Catalogue row (module 'commercial_trading'; path_order 49, between its
-- Commercial & Trading sibling crude, Crude Assay & Blending, at 48 and the
-- Supply Chain course supply, Terminals, Depots & Fuel Supply, at 50;
-- prereq_slug NULL, the carried-over answer "no hard prerequisite inside a
-- module"; school left at its default, as every Facilities, Economics and
-- Assurance course leaves it, so the fees are the published school-level rows)
-- plus the three capstones and their eighteen graded fields, generated by
-- tools/course-waves/refinery/gen_course.py from fields.json, precision.json
-- and capstone.json, which refinery_capstone.mjs writes from the capstone
-- records in refinery_fields_capstone.mjs through the vendored engines. The
-- three tier structures (78 lesson keys) and the 396 questions are the three
-- deep seeds; the go-live is a fifth migration and is HELD until a NextGen
-- production upload carries the route /dashboard/apps/refinery, because the 78
-- lessons, the teaching lab (refineryLab.js) and its three explorer panels ship
-- in the zip and not in this database. This file does not depend on crude or
-- supply: any of the three may be seeded first.
--
-- THE ONE SENTENCE THE COURSE IS. A refinery is judged on its margin per barrel
-- of crude: the screen prices that barrel before any capital is spent, the
-- plan finds it with every barrel run through the crude unit, the schedule
-- dates it, and the actuals are read against it line by line on what each gap
-- did to margin.
--
-- THE ENGINES. engines/downstream/refineryPlanning.js, streamModel.js and
-- modularRefinery.js, engines/economics/screening.js and lib/lp/simplex.js,
-- vendored from engines 13f0936 (engines #225).
--
-- THE GRADED FIELDS ARE FLOATS AT THEIR CLASS'S TOLERANCE. The grader
-- (academy_submit_capstone) casts expected, tol and the answer to numeric and
-- accepts |answer - expected| <= tol. Each tolerance is its precision.json
-- class's: US dollars and barrels 0.5 (the whole unit), US dollars a barrel and
-- percent 0.005 (the cent, two decimals), the screening engine's millions
-- 0.00005 (four decimals); each is at least half a unit of the places the
-- teaching digest prints the class to, and each prompt asks for exactly that
-- precision. The stored value is the engine's figure to six places past the
-- graded place. No NPV and no IRR is graded: the Economics courses grade those.
--
-- NO AS-OF DATE. The Expert prompt states the planning period ({PERIOD_PHRASE}),
-- the one date the schedule is cascaded over; the clock guard refuses any
-- engine call that would read the machine clock. No graded value moves with
-- the period (probed over four periods when this file was generated).
--
-- THE PROMPTS are capstone.json's, verbatim: every condition a field needs and
-- nothing that hands over an answer. No graded value of any tier is a number in
-- any prompt (as it stands, x1e6 or /1e6), and no figure the engine derives on
-- the way to a graded field (a scaled capital cost, a plan volume, a plan
-- ledger value) is printed in any prompt unless it is itself a stated
-- condition. No graded value is within its tolerance of any number the teaching
-- digest prints, and no two graded values are within the looser of their
-- tolerances.
-- ============================================================================"""

lines = [HEADER, '',
         "insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)",
         f"values ({q(SLUG)}, {q(NAME)}, {q(MODULE)}, {PATH_ORDER}, 'coming_soon', null)",
         'on conflict (slug) do nothing;',
         '',
         'insert into public.academy_capstones',
         '    (app_slug, tier, cert_tier, dataset, title, prompt, fields)',
         'values']


def num_lit(v):
    """A JSON number literal Postgres reads back exactly: never an exponent."""
    if isinstance(v, int) or float(v).is_integer():
        return str(int(v))
    s = repr(float(v))
    if 'e' in s or 'E' in s:
        s = format(float(v), 'f').rstrip('0')
    return s


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

# 1. THE PROMPTS (gate_promptleak.py): no graded value of any tier as a number
#    token, in the unit shifts a prompt uses; no derived figure that is not a
#    stated condition.
PNUM = re.compile(r'(?<![\w.-])-?\d+(?:\.\d+)?(?![\w])')
SHIFTS = (1, 1e6, 1e-6)
prompt_tokens = 0
conditions = set()
for tier in TIERS:
    for tok in PNUM.findall(re.sub(r'\d{4}-\d{2}-\d{2}', ' ', PROMPTS[tier])):
        conditions.add(abs(float(tok)))
DERIVED = sorted({round(abs(d), 6) for d in _side['derived']
                  if not any(abs(abs(d) - c) < 1e-6 for c in conditions)})
DERIVED_ALL = len(_side['derived'])


def sweep_text(where, text, count=False):
    global prompt_tokens
    for tok in PNUM.findall(re.sub(r'\d{4}-\d{2}-\d{2}', ' ', text)):
        if count:
            prompt_tokens += 1
        t = abs(float(tok))
        for ft, k, v, tol in fields:
            for sh in SHIFTS:
                if abs(t * sh - abs(v)) <= tol:
                    bad.append(f'{where} prints {tok}, the graded value of {ft}.{k} (read x{sh:g})')
        for d in DERIVED:
            if t >= 1 and abs(t - d) <= 0.5:
                bad.append(f'{where} prints {tok}, a figure the engine derives ({d})')


for tier in TIERS:
    sweep_text(f'the {tier} prompt', PROMPTS[tier], count=True)
    # The labels and titles are read beside the prompt, so they are held to it.
    for text in (TIER[tier][1], TIER[tier][2]) + tuple(LABELS[(t, k)][0] for t, k in LABELS if t == tier):
        sweep_text(f'"{text}"', text)

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
sib = {s['slug']: s for s in wave.get('siblings', [])}
for what, got, want in (('slug', SLUG, wave['slug']), ('name', NAME, wave['name']),
                        ('module', MODULE, wave['module']), ('path_order', PATH_ORDER, wave['pathOrder']),
                        ('prerequisite', None, wave['prerequisite'])):
    if got != want:
        bad.append(f'catalogue {what}: {got!r} here and {want!r} in wave.json')
for s_slug, s_order, s_module in SIBLINGS:
    w = sib.get(s_slug)
    if not w or w.get('pathOrder') != s_order or w.get('module') != s_module:
        bad.append(f'sibling {s_slug}: {s_order}/{s_module} here and {w} in wave.json')

# The sweeps must be able to fire.
if prompt_tokens < 60 or len(digest_nums) < 50 or DERIVED_ALL < 30:
    bad.append(f'the sweeps read {prompt_tokens} prompt tokens, {len(digest_nums)} digest numbers and '
               f'{DERIVED_ALL} derived figures, so a sweep is reading the wrong thing')

if __name__ == '__main__':
    if bad or unclosed or dashes:
        print('REFUSED, nothing written:')
        for b in bad:
            print('  ', b)
        print('unclosed literal:', bool(unclosed), '| en/em dashes:', dashes)
        sys.exit(1)
    open(OUT, 'w').write(sql)
    print(f'wrote {OUT}: {len(sql.splitlines())} lines, 3 capstones, {len(fields)} fields')
    print('engine run: 18 of 18 fields.json values equal refinery_capstone.mjs --json through the vendored engines')
    print('tolerances from precision.json:', {c: CLASSES[c]['tol'] for c in precision},
          '| gradeprecision:', GRADEPRECISION[:90])
    print('prompt lengths:', {t: len(PROMPTS[t]) for t in TIERS})
    print(f'prompt number tokens swept: {prompt_tokens} | engine-derived figures: {DERIVED_ALL}, '
          f'{DERIVED_ALL - len(DERIVED)} of them stated conditions | digest numbers: {len(digest_nums)}')
    print(f'period: "{PERIOD_PHRASE}" stated in the advanced prompt; a graded value depends on it: {PERIOD_DEPENDS} '
          f'(probed over {len(PROBE)} periods)')
    print('prompt + derived + digest + pairwise + precision + npv/irr + copy + catalogue refusals: 0')
