#!/usr/bin/env python3
"""Generate the refinery go-live migration.

NOTHING HERE IS RETYPED. The eighteen graded values are read out of the
CAPSTONE ROWS THE LADDER ITSELF SEEDED, by key, inside the same transaction.
They are then checked four ways, and none of the four is a restatement of the
generator that wrote them:

1. AGAINST THE ENGINE. gen_course.py runs `node refinery_capstone.mjs --json`
   through the vendored engines under the clock guard when this file is
   generated, and refuses if fields.json disagrees with that run. The values
   the go-live compares the seeded rows to are that run's, so a capstone row
   left behind by an earlier seed (the course migration inserts with
   `on conflict do nothing`) is refused here by name.

2. BY A SECOND ROUTE IN SQL, WHERE THE FIELD IS CLOSED FORM. Postgres
   recomputes, over the capstone records the prompts were rendered from and the
   engine's published constants (the configurations' screening yields, the
   supply scenarios, the two scaling exponents):
     - all six IKARAMA fields (the modular screen: a power law, a slate sum,
       days x capacity x utilisation, a margin per barrel, a first year's
       revenue);
     - the four KOLOAMA variance fields, from the actuals and a plan ledger of
       the ORACLE's exact plan (never the engine's), line by line, each line
       signed by its direction on margin;
     - the two KOLOAMA tax fields, the expansion's accounts in millions year by
       year with the construction losses pooled and carried forward;
     - and, over the oracle's AMASSOMA plan, the four AMASSOMA fields that are
       arithmetic on a plan (crude run, crude unit utilisation, margin, margin
       per barrel), after proving that plan FEASIBLE in SQL (every bound, every
       stream balance, the crude unit carrying every barrel).

3. BY THE ORACLE'S EXACT RUN, FOR EVERY FIELD. An LP optimum is NOT re-solved
   in SQL. For the two AMASSOMA stream values (and as a cross-check on the
   other sixteen) the second route is the value oracle_check.py computes with
   the engines repo's stdlib Python oracles (oracle_refineryplanning.py on the
   exact rational simplex, accepted only with a duality certificate;
   oracle_modularrefinery.py with a dated tax-loss ledger), a different
   implementation in a different language. Those values are WRITTEN INTO THIS
   GENERATOR below (ORACLE, ORACLE_PLANS), and this generator re-runs the
   oracle (oracle_check.py's own code, its last line removed) and refuses
   unless the fresh run gives every one of them exactly.

4. BY THE TRAPS THE COURSE IS BUILT ON, which must BITE on these records. For
   every one of the eighteen fields the go-live carries the CLOSEST MISS among
   discriminate.mjs's wrong routes, each evaluated through the ENGINE by
   discriminate.mjs's own code, and refuses unless it lies outside the field's
   tolerance of the graded value.

The seeded value must agree with routes 1 to 3 to a THOUSANDTH of its
tolerance (route 1 exactly), which is far tighter than the grader; a trap must
miss by more than the whole tolerance.

NO NPV AND NO IRR IS GRADED: the go-live refuses a graded key, label or unit
that names either.

WHAT IT REFUSES TO WRITE: a refusal that reads a graded value and does not name
it; a division with a bare integer denominator; an unclosed literal; an em or
en dash; a go-live whose engine run, oracle run and fields.json disagree.

Usage: python3 gen_golive.py
   RF_WAVE        the wave directory (default /root/md-wip-refinery)
   RF_REPO        the nextgen clone   (default /root/wt-md-refinery-nextgen)
   RF_ENGINES     packages/engines to run the capstone and the oracles through
   RF_COURSE_SQL  the course migration this ladder emits, for the prompt checks
   RF_GOLIVE_OUT  where to write
"""
import ast
import json
import os
import re
import subprocess
import sys
import tempfile

W = os.environ.get('RF_WAVE', '/root/md-wip-refinery')
REPO = os.environ.get('RF_REPO', '/root/wt-md-refinery-nextgen')
COURSE = os.environ.get('RF_COURSE_SQL', f'{REPO}/migrations/20261011_rf_refinery_course.sql')
OUT = os.environ.get('RF_GOLIVE_OUT', f'{REPO}/migrations/20261011_rf_refinery_go_live.sql')

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ['RF_WAVE'] = W
import gen_course as GC  # noqa: E402  (runs the engine; writes nothing on import)

SLUG, MODULE, PATH_ORDER = GC.SLUG, GC.MODULE, GC.PATH_ORDER
fields = GC.fields
assert len(fields) == 18, f'{len(fields)} graded fields'
KEYS = GC.KEYS
TIER_OF = GC.TIER_OF
F = GC.F
TOL = GC.TOL
ENGINE = GC.ENGINE
REC = GC.RECORDS
CONST = GC.CONSTANTS
assert len(set(KEYS)) == 18, 'two graded fields share a key'
refused = list(GC.bad)

# ---------------------------------------------------------------------------
# THE ORACLE'S EXACT RUN, written in. oracle_check.py on the capstone records
# (engines 13f0936, tools/validation/downstream), every value as the oracle
# returns it. The plans are the oracle's exact simplex optima, in the order of
# the records' crudes, units and products.
# ---------------------------------------------------------------------------
ORACLE = {
    'ikarama_modular_capex_usd': 104137974.39924105,
    'ikarama_stick_built_capex_usd': 117607902.25246735,
    'ikarama_gross_value_per_bbl': 92.42,
    'ikarama_annual_throughput_bbl': 2010000.0,
    'ikarama_gross_margin_per_bbl': 14.32,
    'ikarama_first_year_revenue_usd': 185764200.0,
    'amassoma_crude_run_bbl': 1880000.0,
    'amassoma_cdu_utilisation_pct': 81.73913043478261,
    'amassoma_plan_margin_usd': 8170744.0,
    'amassoma_gross_margin_per_bbl': 4.346140425531915,
    'amassoma_naphtha_value_per_bbl': 91.32,
    'amassoma_gasoil_value_per_bbl': 88.06733333333334,
    'koloama_usan_price_variance_usd': 654500.0000000027,
    'koloama_diesel_volume_variance_usd': 661826.6666666646,
    'koloama_margin_variance_usd': -2738869.4444444505,
    'koloama_cost_variance_usd': 2184380.000000003,
    'koloama_first_tax_mm': 0.9071033583782673,
    'koloama_lifetime_tax_mm': 46.71901195837832,
}
ORACLE_PLANS = {
    'AMASSOMA': {'crudeRuns': [680000.0, 1200000.0, 0.0], 'unitRuns': [1880000.0, 367200.0, 600000.0],
                 'productMakes': [315792.0, 0.0, 276800.0, 582000.0, 0.0, 591600.0], 'margin': 8170744.0},
    'KOLOAMA': {'crudeRuns': [900000.0, 222222.22222222222], 'unitRuns': [1122222.2222222222, 240000.0],
                'productMakes': [208800.0, 161555.55555555556, 354666.6666666667, 332333.3333333333],
                'margin': 5339884.444444444},
}


def oracle_run():
    """oracle_check.py's own code with its last line (sys.exit(main())) removed."""
    path = os.path.join(W, 'oracle_check.py')
    tree = ast.parse(open(path, encoding='utf-8').read())
    last = tree.body[-1]
    if not (isinstance(last, ast.Expr) and ast.unparse(last) == 'sys.exit(main())'):
        sys.exit('REFUSED: oracle_check.py no longer ends in sys.exit(main()), so it cannot be run as a library')
    tree.body = tree.body[:-1]
    ns = {'__file__': path, '__name__': 'oracle_check_as_library'}
    old = os.environ.get('MD_ENGINES')
    os.environ['MD_ENGINES'] = GC.ENGINES
    try:
        exec(compile(tree, path, 'exec'), ns)
        values = ns['oracle_fields']()
        plans = {}
        for c in ('AMASSOMA', 'KOLOAMA'):
            r = ns['plan_of'](ns['K'][c])
            if r['status'] != 'optimal':
                sys.exit(f'REFUSED: the oracle finds the {c} plan {r["status"]}')
            plans[c] = {k: r[k] for k in ('crudeRuns', 'unitRuns', 'productMakes', 'margin')}
    finally:
        if old is None:
            os.environ.pop('MD_ENGINES', None)
        else:
            os.environ['MD_ENGINES'] = old
    return values, plans


_ov, _op = oracle_run()
if set(_ov) != set(ORACLE):
    refused.append(f'the oracle run names different fields: {sorted(set(_ov) ^ set(ORACLE))}')
for k, v in ORACLE.items():
    if _ov.get(k) != v:
        refused.append(f'the oracle run gives {k} = {_ov.get(k)!r} and this generator carries {v!r}')
if _op != ORACLE_PLANS:
    refused.append(f'the oracle plans differ from the ones this generator carries: {_op}')
for k in KEYS:
    if abs(ORACLE[k] - F[k]) > TOL[k] / 1000:
        refused.append(f'{k}: the oracle gives {ORACLE[k]!r} and the engine {F[k]!r}, more than a thousandth of a tolerance apart')


# ---------------------------------------------------------------------------
# THE TRAPS: discriminate.mjs's WRONG table, by its own code (everything above
# its sweep loop), each route evaluated through the ENGINE; the closest miss of
# each field is the trap the go-live carries.
# ---------------------------------------------------------------------------
def discriminate_routes():
    src = open(os.path.join(W, 'discriminate.mjs'), encoding='utf-8').read()
    cut = src.find('// NEGATIVE CONTROL: --plant')
    if cut < 0 or "const HERE = new URL('.', import.meta.url).pathname;" not in src:
        sys.exit('REFUSED: discriminate.mjs has changed shape; the trap extraction cannot find its WRONG table')
    body = src[:cut]
    body = body.replace("const HERE = new URL('.', import.meta.url).pathname;", f'const HERE = {json.dumps(W + "/")};')
    body = body.replace("from './refinery_fields_capstone.mjs'", f"from {json.dumps(os.path.join(W, 'refinery_fields_capstone.mjs'))}")
    body = body.replace("from './clockguard.mjs'", f"from {json.dumps(os.path.join(W, 'clockguard.mjs'))}")
    body += '\nconsole.log(JSON.stringify(Object.fromEntries(Object.entries(WRONG).map(([k, w]) => [k, w]))));\n'
    with tempfile.TemporaryDirectory() as d:
        p = os.path.join(d, 'discriminate_routes.mjs')
        open(p, 'w').write(body)
        r = subprocess.run(['node', p], capture_output=True, text=True, env=GC.ENV)
    if r.returncode != 0:
        sys.exit('REFUSED: the discriminate routes failed: ' + r.stderr[-600:])
    return json.loads(r.stdout)


WRONG = discriminate_routes()
TRAPS = {}
for k in KEYS:
    w = WRONG.get(k)
    if not w:
        refused.append(f'discriminate.mjs has no wrong routes for {k}')
        continue
    if abs(w['truth'] - F[k]) > TOL[k] / 1000:
        refused.append(f'discriminate.mjs computes {k} as {w["truth"]} and fields.json carries {F[k]}')
    name_, val = min(w['routes'].items(), key=lambda kv: abs(kv[1] - F[k]))
    TRAPS[k] = (name_.replace('_', ' '), val)
    if abs(val - F[k]) <= TOL[k]:
        refused.append(f'{k}: the route "{name_}" lands within tolerance ({val}), so the field does not discriminate it')


def lit(s):
    return "'" + s.replace("'", "''") + "'"


def jlit(obj):
    return lit(json.dumps(obj, ensure_ascii=False, separators=(',', ':'))) + '::jsonb'


def num(x):
    """A numeric literal Postgres reads exactly as Python printed it."""
    if isinstance(x, int) or float(x).is_integer():
        return str(int(x))
    s = repr(float(x))
    if 'e' in s or 'E' in s:
        s = format(float(x), '.20f').rstrip('0')
    return s


V = {k: f'v_g_{k}' for k in KEYS}


def name(*keys):
    """The graded fields a refusal reads, spelled tier/key."""
    for k in keys:
        assert k in V, k
    return ' [graded field: ' + ', '.join(f'{TIER_OF[k]}/{k}' for k in keys) + ']'


# ---------------------------------------------------------------------------
# THE SQL
# ---------------------------------------------------------------------------
HEADER = f"""-- ============================================================================
-- refinery GO-LIVE (HELD): Refinery Feasibility & Planning flips to 'available',
-- the second course of the Commercial & Trading module, at path_order 49.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/refinery. The 78 lessons, the teaching lab
-- (refineryLab.js) and its three explorer panels (screen, plan and variance)
-- ship in the ZIP and NOT in this database, so a flip before the upload puts a
-- live catalogue tile in front of a route that does not exist. This file is
-- written, dry-run and left unapplied on purpose.
--
-- EVERY GRADED VALUE IS CHECKED FOUR WAYS, and none restates the generator:
--
--   1. against the ENGINE, run through the vendored engines when this file was
--      generated (refinery_capstone.mjs --json), exactly, so a capstone row an
--      earlier seed left behind is refused by name;
--   2. by a SECOND ROUTE IN SQL wherever the field is closed form, over the
--      capstone records the prompts were rendered from (the go-live first
--      proves each shipped prompt is the rendered one byte for byte):
--        IKARAMA, all six fields: the scaling laws, the slate, the throughput,
--          the margin per barrel and the first year's revenue;
--        KOLOAMA, the four variance fields: line by line from the actuals and
--          a plan ledger of the ORACLE's plan, each line signed on margin;
--        KOLOAMA, the two tax fields: the expansion's accounts year by year,
--          construction losses pooled and carried forward;
--        AMASSOMA, crude run, crude unit utilisation, margin and margin per
--          barrel as arithmetic on the ORACLE's plan, after that plan is
--          proved feasible in SQL;
--   3. against the ORACLE's exact run for all eighteen, and this is the second
--      route of the two AMASSOMA stream values: an LP optimum is NOT re-solved
--      in SQL. oracle_check.py (the engines repo's Python oracles, the plan on
--      an exact rational simplex accepted only with a duality certificate)
--      computed these values; they are written into gen_golive.py, which
--      refuses to generate unless a fresh oracle run gives every one exactly;
--   4. by the TRAPS the course is built on: for every field the closest miss
--      among discriminate.mjs's wrong routes, run through the engine, must lie
--      outside the field's tolerance.
--   Routes 2 and 3 must agree with the seeded value to a thousandth of its
--   tolerance.
--
-- NO AS-OF DATE. The one date is the Expert plan's period, 2027-03-01 for 31
-- days, which the Expert prompt states; no graded value moves with it. This
-- file reads no clock and gives the same verdict on whatever day it is run.
--
-- THE GRADER IS NUMERIC. academy_submit_capstone casts expected, tol and the
-- answer to numeric. Every field must carry a numeric expected value at its
-- precision class's tolerance (precision.json), with at most six places past
-- the graded place, a label and a unit. NO NPV AND NO IRR IS GRADED.
--
-- EVERY REFUSAL THAT READS A GRADED VALUE NAMES IT as tier/key.
-- ============================================================================"""

B = []
A = B.append
PNUM_SQL = "'(?:^|[^A-Za-z0-9_.-])(-?[0-9]+(\\.[0-9]+)?)(?![A-Za-z0-9_])'"
UNDATED = "regexp_replace({t}, '[0-9]{{4}}-[0-9]{{2}}-[0-9]{{2}}', ' ', 'g')"

A('do $$')
A('declare')
A('  v_structures int; v_questions int; v_capstones int; v_lessons int;')
A('  v_modules int; v_graded int; v_available int; v_soon int; v_n int;')
A('  v_names text; v_prompt text; v_wrong numeric;')
A('  v_y int; v_build int; v_life int; v_pool numeric; v_inc numeric; v_tax numeric;')
A('  v_bbl numeric; v_val numeric; v_capex numeric; v_crude numeric;')
for k in KEYS:
    A(f'  {V[k]} numeric; v_s_{k} numeric;')
A(f"  v_ikarama jsonb := {jlit(REC['IKARAMA'])};")
A(f"  v_amassoma jsonb := {jlit(REC['AMASSOMA'])};")
A(f"  v_koloama jsonb := {jlit(REC['KOLOAMA'])};")
A(f"  v_const jsonb := {jlit(CONST)};")
A(f"  v_oplan_a jsonb := {jlit(ORACLE_PLANS['AMASSOMA'])};")
A(f"  v_oplan_k jsonb := {jlit(ORACLE_PLANS['KOLOAMA'])};")
A('begin')

TOL_CASE = 'case ' + ' '.join(f"when f->>'key' = {lit(k)} then {num(TOL[k])}" for k in KEYS) + ' end'
PLACES_CASE = 'case ' + ' '.join(f"when f->>'key' = {lit(k)} then {GC.GRADED_PLACES[k] + 6}" for k in KEYS) + ' end'

# ------------------------------------------------------------------ shape
A(f'''
  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures
   where app_slug = '{SLUG}' and active;
  if v_structures <> 3 then
    raise exception 'refinery go-live refused: {SLUG} has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions from public.academy_quiz_questions where app_slug = '{SLUG}';
  if v_questions <> 396 then
    raise exception 'refinery go-live refused: {SLUG} has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_n from (
    select tier from public.academy_quiz_questions where app_slug = '{SLUG}'
     group by tier having count(*) <> 132) t;
  if v_n <> 0 then
    raise exception 'refinery go-live refused: % tier(s) do not carry exactly 132 questions', v_n;
  end if;

  select count(*) into v_n from (
    select tier, module_key from public.academy_quiz_questions
     where app_slug = '{SLUG}' and scope = 'module'
     group by tier, module_key having count(*) <> 15) t;
  if v_n <> 0 then
    raise exception 'refinery go-live refused: % module bank(s) do not carry exactly 15 questions', v_n;
  end if;

  select count(*) into v_n from (
    select tier from public.academy_quiz_questions
     where app_slug = '{SLUG}' and scope = 'final'
     group by tier having count(*) <> 42) t;
  if v_n <> 0 then
    raise exception 'refinery go-live refused: % final exam(s) do not carry exactly 42 questions', v_n;
  end if;

  -- A key outside its own options is unanswerable, and a count of rows cannot
  -- see it.
  select count(*) into v_n from public.academy_quiz_questions
   where app_slug = '{SLUG}'
     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);
  if v_n <> 0 then
    raise exception 'refinery go-live refused: % question(s) do not offer four options with a key inside them', v_n;
  end if;

  select count(*) into v_lessons
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m,
         lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = '{SLUG}' and s.active;
  if v_lessons <> 78 then
    raise exception 'refinery go-live refused: {SLUG} carries % lesson keys, expected 78', v_lessons;
  end if;

  select count(*) into v_modules
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = '{SLUG}' and s.active;
  if v_modules <> 18 then
    raise exception 'refinery go-live refused: {SLUG} carries % modules, expected 18 (six per tier)', v_modules;
  end if;

  select count(*) into v_n from (
    select distinct qq.tier, qq.module_key from public.academy_quiz_questions qq
     where qq.app_slug = '{SLUG}' and qq.scope = 'module'
       and not exists (
         select 1 from public.academy_course_structures s,
              lateral jsonb_array_elements(s.structure->'modules') m
          where s.app_slug = qq.app_slug and s.tier = qq.tier and s.active
            and m->>'key' = qq.module_key)) t;
  if v_n <> 0 then
    raise exception 'refinery go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_n;
  end if;

  select count(*) into v_capstones from public.academy_capstones where app_slug = '{SLUG}';
  if v_capstones <> 3 then
    raise exception 'refinery go-live refused: {SLUG} has % capstones, expected 3', v_capstones;
  end if;

  select count(*) into v_graded from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f where c.app_slug = '{SLUG}';
  if v_graded <> 18 then
    raise exception 'refinery go-live refused: {SLUG} has % graded capstone fields, expected 18', v_graded;
  end if;

  select count(*) into v_n from (
    select c.tier from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug = '{SLUG}' group by c.tier having count(*) <> 6) t;
  if v_n <> 0 then
    raise exception 'refinery go-live refused: % tier(s) do not grade exactly six fields', v_n;
  end if;

  if not exists (select 1 from public.academy_apps
                  where slug = '{SLUG}' and module = '{MODULE}'
                    and path_order = {PATH_ORDER} and prereq_slug is null) then
    raise exception 'refinery go-live refused: the {SLUG} catalogue row is not {MODULE} at path_order {PATH_ORDER} with no prerequisite';
  end if;

  if exists (select 1 from public.academy_apps where path_order = {PATH_ORDER} and slug <> '{SLUG}') then
    raise exception 'refinery go-live refused: another course already holds path_order {PATH_ORDER}';
  end if;
''')
for s_slug, s_order, _s_module in GC.SIBLINGS:
    A(f'''  if exists (select 1 from public.academy_apps where path_order = {s_order} and slug <> '{s_slug}') then
    raise exception 'refinery go-live refused: path_order {s_order}, the sibling slot of {s_slug}, is held by another course';
  end if;''')

A(f'''
  -- ------------------------------------------------- the grader is numeric
  -- NO NPV AND NO IRR IS GRADED: the Economics courses grade those.
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = '{SLUG}'
     and (coalesce(f->>'key', '') || ' ' || coalesce(f->>'label', '') || ' ' || coalesce(f->>'unit', ''))
         ~* '(npv|irr|net present|internal rate)';
  if v_n <> 0 then
    raise exception 'refinery go-live refused: % graded field(s) name an NPV or an IRR, which this course does not grade: %', v_n, v_names;
  end if;

  -- Every field numeric at its precision class's tolerance (precision.json),
  -- no more than six places past the graded place, with a label and a unit.
  select count(*), string_agg(c.tier || '/' || coalesce(f->>'key', '?'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = '{SLUG}'
     and (jsonb_typeof(f->'expected') <> 'number' or jsonb_typeof(f->'tol') <> 'number'
          or ({TOL_CASE}) is null
          or (f->>'tol')::numeric <> ({TOL_CASE})
          or (f->>'expected')::numeric <> round((f->>'expected')::numeric, {PLACES_CASE})
          or coalesce(f->>'label', '') = '' or coalesce(f->>'unit', '') = '');
  if v_n <> 0 then
    raise exception 'refinery go-live refused: % graded field(s) are not a number at their precision class tolerance with a label and a unit: %', v_n, v_names;
  end if;
''')

# ------------------------------------------------------------ the prompts
A('\n  -- ---------------------------------------- the prompts the learner reads')
A("  -- Each shipped prompt is capstone.json's, byte for byte, which")
A('  -- refinery_capstone.mjs rendered from the records the second route reads.')
for tier in GC.TIERS:
    A(f'''  select prompt into v_prompt from public.academy_capstones where app_slug = '{SLUG}' and tier = '{tier}';
  if v_prompt is distinct from {lit(GC.PROMPTS[tier])} then
    raise exception 'refinery go-live refused: the {tier} prompt is not the prompt capstone.json carries, so the second route may be reading records the learner never saw';
  end if;''')
A(f'''  if strpos(v_prompt, {lit(GC.PERIOD_PHRASE)}) = 0 then
    raise exception 'refinery go-live refused: the advanced prompt does not state the planning period ({GC.PERIOD_PHRASE})';
  end if;''')

# ------------------------------------------------ load the eighteen values
A('\n  -- --------------------------------------- the eighteen graded values')
for k in KEYS:
    A(f"""  select (f->>'expected')::numeric into {V[k]}
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = '{SLUG}' and c.tier = '{TIER_OF[k]}' and f->>'key' = '{k}';""")
A('  if ' + '\n     or '.join(f'{V[k]} is null' for k in KEYS) + ' then')
A("    raise exception 'refinery go-live refused: one or more of the eighteen graded fields is missing';")
A('  end if;')

DERIVED = GC.DERIVED
A(f'''
  -- PROMPTS. No graded value of any tier is a number token in any prompt once
  -- its YYYY-MM-DD conditions are taken out, signed or absolute, read as it
  -- stands, x1e6 or /1e6 (the prompts state money in millions).
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key') || ' in the ' || p.tier || ' prompt', ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         public.academy_capstones p,
         lateral regexp_matches({UNDATED.format(t='p.prompt')}, {PNUM_SQL}, 'g') as m,
         unnest(array[1, 1e6, 0.000001]::numeric[]) sh
   where c.app_slug = '{SLUG}' and p.app_slug = '{SLUG}'
     and abs(abs((m[1])::numeric) * sh - abs((f->>'expected')::numeric)) <= (f->>'tol')::numeric;
  if v_n <> 0 then
    raise exception 'refinery go-live refused: % graded field(s) are printed in a prompt: %', v_n, v_names;
  end if;

  -- The sweep must be able to fire: Postgres must read exactly the number
  -- tokens gen_course.py read out of the same three prompts ({GC.prompt_tokens}), or
  -- the regex above is reading something else and its 0 means nothing.
  select count(*) into v_n
    from public.academy_capstones p,
         lateral regexp_matches({UNDATED.format(t='p.prompt')}, {PNUM_SQL}, 'g') as m
   where p.app_slug = '{SLUG}';
  if v_n <> {GC.prompt_tokens} then
    raise exception 'refinery go-live refused: the prompt sweep read % number tokens, and gen_course.py read {GC.prompt_tokens} from the same prompts', v_n;
  end if;

  -- The dataset lines, titles and labels are read beside the prompt.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key') || ' beside the ' || p.tier || ' prompt', ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         public.academy_capstones p,
         lateral regexp_matches({UNDATED.format(t="p.dataset || ' ' || p.title || ' ' || (select string_agg(g->>'label', ' ') from jsonb_array_elements(p.fields) g)")}, {PNUM_SQL}, 'g') as m
   where c.app_slug = '{SLUG}' and p.app_slug = '{SLUG}'
     and abs(abs((m[1])::numeric) - abs((f->>'expected')::numeric)) <= (f->>'tol')::numeric;
  if v_n <> 0 then
    raise exception 'refinery go-live refused: % graded field(s) are printed in a dataset line, title or label: %', v_n, v_names;
  end if;

  -- DERIVED FIGURES. None of the {len(DERIVED)} figures the engine derives on the way
  -- to a graded field that are not themselves stated conditions (a scaled
  -- capital cost, the annual throughput, each plan volume and ledger value) is
  -- a number in any prompt, dataset line, title or label.
  select count(*), string_agg(distinct d::text || ' in the ' || p.tier || ' capstone', ', ')
    into v_n, v_names
    from public.academy_capstones p,
         lateral regexp_matches({UNDATED.format(t="p.prompt || ' ' || p.dataset || ' ' || p.title || ' ' || (select string_agg(g->>'label', ' ') from jsonb_array_elements(p.fields) g)")}, {PNUM_SQL}, 'g') as m,
         unnest(array[{', '.join(num(d) for d in DERIVED)}]::numeric[]) d
   where p.app_slug = '{SLUG}'
     and abs((m[1])::numeric) >= 1 and abs(abs((m[1])::numeric) - d) <= 0.5;
  if v_n <> 0 then
    raise exception 'refinery go-live refused: % engine-derived figure(s) are printed in a capstone: %', v_n, v_names;
  end if;

  -- PAIRWISE. Two graded answers within the looser of their two tolerances
  -- cannot be told apart by a grader, so one of them grades nothing.
  select count(*), string_agg(a.tier || '/' || a.k || ' and ' || b.tier || '/' || b.k, ', ')
    into v_n, v_names
    from (select c.tier, f->>'key' k, (f->>'expected')::numeric e, (f->>'tol')::numeric t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = '{SLUG}') a,
         (select c.tier, f->>'key' k, (f->>'expected')::numeric e, (f->>'tol')::numeric t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = '{SLUG}') b
   where (a.tier, a.k) < (b.tier, b.k)
     and abs(abs(a.e) - abs(b.e)) <= greatest(a.t, b.t);
  if v_n <> 0 then
    raise exception 'refinery go-live refused: % pair(s) of graded fields are within the looser of their two tolerances: %', v_n, v_names;
  end if;
''')

# ------------------------------------------------------ the digest sweep
DNUM = re.compile(r'-?\d+\.?\d*')
digest = open(f'{W}/digest.txt', encoding='utf-8').read()
DIGEST_NUMS = set()
for tok in DNUM.findall(digest):
    try:
        DIGEST_NUMS.add(abs(float(tok)))
    except ValueError:
        pass
DIGEST_NUMS = sorted(DIGEST_NUMS)
if len(DIGEST_NUMS) < 50:
    refused.append(f'the digest sweep read {len(DIGEST_NUMS)} numbers, so it is reading the wrong thing')

A(f'''
  -- ------------------------------------------------------- the digest sweep
  -- No graded value is within its tolerance of the absolute value of ANY number
  -- token the teaching digest prints ({len(DIGEST_NUMS)} distinct values, dates
  -- included, read by the regex -?[0-9]+[.]?[0-9]*): a graded field that is a
  -- figure the digest prints is a lookup rather than a calculation.
  select count(*), string_agg(c.tier || '/' || (f->>'key') || ' = ' || (f->>'expected'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = '{SLUG}'
     and exists (select 1 from unnest(array[{', '.join(num(x) for x in DIGEST_NUMS)}]::numeric[]) d
                  where abs(abs((f->>'expected')::numeric) - d) <= (f->>'tol')::numeric);
  if v_n <> 0 then
    raise exception 'refinery go-live refused: % graded field(s) are within tolerance of a number the digest prints: %', v_n, v_names;
  end if;
''')

# ------------------------------------------------------- 1. the engine
A('\n  -- ---------------------------------------------------- 1. against the engine')
for k in KEYS:
    A(f'''  if {V[k]} <> {num(ENGINE[k])} then
    raise exception 'refinery go-live refused: the seeded value % is not the {num(ENGINE[k])} the engine returned through refinery_capstone.mjs{name(k)}', {V[k]};
  end if;''')

# ------------------------------------------------ 2. the second route in SQL
IK = 'v_ikarama'
I_SCEN = f"(select s from jsonb_array_elements(v_const->'SUPPLY_SCENARIOS') s where s->>'id' = {IK}->>'scenarioId')"
I_YIELDS = f"(v_const->'CONFIGURATIONS'->({IK}->>'configurationId'))"


def slate(rec):
    yl = f"(v_const->'CONFIGURATIONS'->({rec}->>'configurationId'))"
    return (f"(select sum(y.value::numeric * ({rec}->'prices'->>y.key)::numeric)"
            f" from jsonb_each_text({yl}) y where y.key <> 'loss' and ({rec}->'prices') ? y.key)")


def capex(rec, exponent):
    return (f"(({rec}->>'baseCost')::numeric * power(({rec}->>'capacityBpd')::numeric"
            f" / ({rec}->>'baseCapacity')::numeric, {exponent}))")


def scen_of(rec, col):
    return (f"(select (s->>{lit(col)})::numeric from jsonb_array_elements(v_const->'SUPPLY_SCENARIOS') s"
            f" where s->>'id' = {rec}->>'scenarioId')")


I_ANNUAL = f"(({IK}->>'capacityBpd')::numeric * ({IK}->>'onstreamDays')::numeric * {scen_of(IK, 'utilisation')})"


def plan_ledger(rec, oplan):
    """The plan ledger of an ORACLE plan: (material, type, quantity, value), every line with a positive quantity."""
    return f"""select c.c->>'id' m, 'receipt' t, x.x::numeric q, x.x::numeric * (c.c->>'cost')::numeric v
        from jsonb_array_elements({rec}->'crudes') with ordinality c(c, i)
        join jsonb_array_elements_text({oplan}->'crudeRuns') with ordinality x(x, i) using (i)
       where x.x::numeric > 0
      union all
      select u.u->>'id', 'unit_run', x.x::numeric, x.x::numeric * (u.u->>'opex')::numeric
        from jsonb_array_elements({rec}->'units') with ordinality u(u, i)
        join jsonb_array_elements_text({oplan}->'unitRuns') with ordinality x(x, i) using (i)
       where x.x::numeric > 0
      union all
      select p.p->>'id', 'delivery', x.x::numeric, x.x::numeric * (p.p->>'price')::numeric
        from jsonb_array_elements({rec}->'products') with ordinality p(p, i)
        join jsonb_array_elements_text({oplan}->'productMakes') with ordinality x(x, i) using (i)
       where x.x::numeric > 0"""


A(f'''
  -- ----------------------------------------------- 2. the second route in SQL
  -- ASSOCIATE, IKARAMA: the modular screen, closed form. Capital by a power
  -- law from the quotation (the engine's two exponents), the slate as the sum
  -- of each screening yield times its price (the loss is sold for nothing),
  -- the year's barrels as capacity x on-stream days x the scenario's
  -- utilisation, the margin per barrel as the slate less the crude with the
  -- scenario's premium and the variable cost, the first operating year's
  -- revenue as its barrels times the slate.
  v_s_ikarama_modular_capex_usd := {capex(IK, "(v_const->'SCALING_EXPONENT'->>'MODULAR')::numeric")};
  v_s_ikarama_stick_built_capex_usd := {capex(IK, "(v_const->'SCALING_EXPONENT'->>'STICK_BUILT')::numeric")};
  v_s_ikarama_gross_value_per_bbl := {slate(IK)};
  v_s_ikarama_annual_throughput_bbl := {I_ANNUAL};
  v_s_ikarama_gross_margin_per_bbl := v_s_ikarama_gross_value_per_bbl
    - (({IK}->>'crudeCostPerBbl')::numeric + {scen_of(IK, 'crudePremium')}) - ({IK}->>'variableOpexPerBbl')::numeric;
  v_s_ikarama_first_year_revenue_usd := v_s_ikarama_annual_throughput_bbl * v_s_ikarama_gross_value_per_bbl;

  -- PROFESSIONAL, AMASSOMA. The LP is not re-solved here. The ORACLE's plan is
  -- first proved FEASIBLE on the records (every crude within its availability,
  -- every unit within its capacity, every product within its demand, nothing
  -- negative, every stream balance closing with nothing drawn that was not
  -- made, and the crude unit carrying every barrel of crude), then crude run,
  -- utilisation, margin and margin per barrel are read off it as arithmetic.
  select count(*) into v_n from (
    select 1 from jsonb_array_elements(v_amassoma->'crudes') with ordinality c(c, i)
      join jsonb_array_elements_text(v_oplan_a->'crudeRuns') with ordinality x(x, i) using (i)
     where x.x::numeric < 0 or x.x::numeric > (c.c->>'available')::numeric
    union all
    select 1 from jsonb_array_elements(v_amassoma->'units') with ordinality u(u, i)
      join jsonb_array_elements_text(v_oplan_a->'unitRuns') with ordinality x(x, i) using (i)
     where x.x::numeric < 0 or x.x::numeric > (u.u->>'capacity')::numeric
    union all
    select 1 from jsonb_array_elements(v_amassoma->'products') with ordinality p(p, i)
      join jsonb_array_elements_text(v_oplan_a->'productMakes') with ordinality x(x, i) using (i)
     where x.x::numeric < (p.p->>'minDemand')::numeric or x.x::numeric > (p.p->>'maxDemand')::numeric
    union all
    select 1 from jsonb_array_elements_text(v_amassoma->'streams') s(s)
     where (select coalesce(sum(x.x::numeric * coalesce((c.c->'yields'->>s.s)::numeric, 0)), 0)
              from jsonb_array_elements(v_amassoma->'crudes') with ordinality c(c, i)
              join jsonb_array_elements_text(v_oplan_a->'crudeRuns') with ordinality x(x, i) using (i))
         + (select coalesce(sum(x.x::numeric * (coalesce((u.u->'yields'->>s.s)::numeric, 0)
                                             - case when u.u->>'feed' = s.s then 1 else 0 end)), 0)
              from jsonb_array_elements(v_amassoma->'units') with ordinality u(u, i)
              join jsonb_array_elements_text(v_oplan_a->'unitRuns') with ordinality x(x, i) using (i))
         - (select coalesce(sum(x.x::numeric * coalesce((p.p->'recipe'->>s.s)::numeric, 0)), 0)
              from jsonb_array_elements(v_amassoma->'products') with ordinality p(p, i)
              join jsonb_array_elements_text(v_oplan_a->'productMakes') with ordinality x(x, i) using (i))
         < -0.000001) t;
  if v_n <> 0 then
    raise exception 'refinery go-live refused: the oracle AMASSOMA plan breaks % bound(s) or stream balance(s) on the records{name('amassoma_crude_run_bbl', 'amassoma_plan_margin_usd')}', v_n;
  end if;
  select sum(x.x::numeric) into v_s_amassoma_crude_run_bbl
    from jsonb_array_elements_text(v_oplan_a->'crudeRuns') x(x);
  select x.x::numeric / (u.u->>'capacity')::numeric * 100 into v_s_amassoma_cdu_utilisation_pct
    from jsonb_array_elements(v_amassoma->'units') with ordinality u(u, i)
    join jsonb_array_elements_text(v_oplan_a->'unitRuns') with ordinality x(x, i) using (i)
   where coalesce(u.u->>'feed', '') = '';
  select x.x::numeric into v_wrong
    from jsonb_array_elements(v_amassoma->'units') with ordinality u(u, i)
    join jsonb_array_elements_text(v_oplan_a->'unitRuns') with ordinality x(x, i) using (i)
   where coalesce(u.u->>'feed', '') = '';
  if v_wrong is null or abs(v_wrong - v_s_amassoma_crude_run_bbl) > 0.000001 then
    raise exception 'refinery go-live refused: the oracle plan runs % barrels through the crude unit and % of crude{name('amassoma_crude_run_bbl')}', v_wrong, v_s_amassoma_crude_run_bbl;
  end if;
  select sum(case t when 'delivery' then v else -v end) into v_s_amassoma_plan_margin_usd
    from ({plan_ledger('v_amassoma', 'v_oplan_a')}) l;
  if abs(v_s_amassoma_plan_margin_usd - (v_oplan_a->>'margin')::numeric) > 0.0005 then
    raise exception 'refinery go-live refused: the oracle AMASSOMA plan is worth % on the records and the oracle says %{name('amassoma_plan_margin_usd')}', v_s_amassoma_plan_margin_usd, v_oplan_a->>'margin';
  end if;
  v_s_amassoma_gross_margin_per_bbl := v_s_amassoma_plan_margin_usd / v_s_amassoma_crude_run_bbl;
  -- The two stream values are an LP's shadow prices: their second route is the
  -- oracle's exact run (block 3), never an SQL re-solve, so this block does not
  -- check them.

  -- EXPERT, KOLOAMA, the month. The plan ledger is the ORACLE's plan: each
  -- crude received at its cost, each unit run at its operating cost, each
  -- product lifted at its price (a delivery's value is what it sold for). A
  -- line is a material and type present in both ledgers (the unplanned sale is
  -- no line). Volume variance = (actual - plan quantity) x plan unit value;
  -- price variance = (actual - plan unit value) x actual quantity; the total
  -- on margin signs each line by its direction (a delivery as it stands, a
  -- cost reversed); the cost total adds the cost lines as recorded.
  with plan as ({plan_ledger('v_koloama', 'v_oplan_k')}),
       act as (select a->>'materialId' m, a->>'type' t, (a->>'quantity')::numeric q, (a->>'cost')::numeric v
                 from jsonb_array_elements(v_koloama->'actuals') a),
       lines as (select p.m, p.t, p.q pq, p.v pv, a.q aq, a.v av,
                        (a.q - p.q) * (p.v / p.q) vol, (a.v / a.q - p.v / p.q) * a.q price, a.v - p.v total,
                        case when p.t = 'delivery' then 1 else -1 end sgn
                   from plan p join act a using (m, t))
  select (select price from lines where m = 'usan' and t = 'receipt'),
         (select vol from lines where m = 'diesel' and t = 'delivery'),
         (select sum(sgn * total) from lines),
         (select sum(total) from lines where sgn = -1)
    into v_s_koloama_usan_price_variance_usd, v_s_koloama_diesel_volume_variance_usd,
         v_s_koloama_margin_variance_usd, v_s_koloama_cost_variance_usd;

  -- EXPERT, KOLOAMA, the expansion's tax. Its accounts in millions, year by
  -- year: construction years spend the modular capital in equal parts and sell
  -- nothing; each operating year sells its barrels at the slate and pays the
  -- crude (with the scenario's premium), the fixed and the variable cost.
  -- Capital is expensed in the year it is spent. A loss is pooled and set
  -- against later income before the rate applies (the refinery's loss carry
  -- forward); no royalty.
  v_build := (v_koloama->'expansion'->>'constructionYears')::int;
  v_life := (v_koloama->'expansion'->>'projectLife')::int;
  v_bbl := (v_koloama->'expansion'->>'capacityBpd')::numeric * (v_koloama->'expansion'->>'onstreamDays')::numeric
           * {scen_of("(v_koloama->'expansion')", 'utilisation')};
  v_val := {slate("(v_koloama->'expansion')")};
  v_capex := {capex("(v_koloama->'expansion')", "(v_koloama->'expansion'->>'modularExponent')::numeric")};
  v_crude := (v_koloama->'expansion'->>'crudeCostPerBbl')::numeric + {scen_of("(v_koloama->'expansion')", 'crudePremium')};
  v_pool := 0; v_s_koloama_lifetime_tax_mm := 0; v_s_koloama_first_tax_mm := null;
  for v_y in 0 .. v_build + v_life - 1 loop
    if v_y < v_build then
      v_inc := -(v_capex / v_build) / 1e6;
    else
      v_inc := (v_bbl * v_val - v_bbl * v_crude - (v_koloama->'expansion'->>'fixedOpexPerYear')::numeric
                - v_bbl * (v_koloama->'expansion'->>'variableOpexPerBbl')::numeric) / 1e6;
    end if;
    v_inc := v_inc - v_pool;
    v_pool := greatest(-v_inc, 0);
    v_tax := greatest(v_inc, 0) * (v_koloama->'expansion'->>'taxRate')::numeric / 100.0;
    if v_tax > 0 and v_s_koloama_first_tax_mm is null then
      v_s_koloama_first_tax_mm := v_tax;
    end if;
    v_s_koloama_lifetime_tax_mm := v_s_koloama_lifetime_tax_mm + v_tax;
  end loop;
''')
ORACLE_ONLY = ('amassoma_naphtha_value_per_bbl', 'amassoma_gasoil_value_per_bbl')
ROUTE_KEYS = [k for k in KEYS if k not in ORACLE_ONLY]
for k in ROUTE_KEYS:
    A(f'''  if v_s_{k} is null or abs(v_s_{k} - {V[k]}) > {num(TOL[k])} / 1000.0 then
    raise exception 'refinery go-live refused: the second route in SQL gives % over the capstone records, against the seeded %{name(k)}', v_s_{k}, {V[k]};
  end if;''')

# ------------------------------------------------ 3. the oracle's exact run
A('\n  -- ------------------------------------------------ 3. the oracle\'s exact run')
A("  -- oracle_check.py's values, written into gen_golive.py and re-run there")
A('  -- before this file was written. The two AMASSOMA stream values have no')
A('  -- other second route: an LP optimum is not re-solved in SQL.')
for k in KEYS:
    A(f'''  if abs({V[k]} - {num(ORACLE[k])}) > {num(TOL[k])} / 1000.0 then
    raise exception 'refinery go-live refused: the oracle gives {num(ORACLE[k])}, against the seeded %{name(k)}', {V[k]};
  end if;''')

# ------------------------------------------------------ 4. the traps bite
A('\n  -- ------------------------------------------------- 4. the traps bite')
A("  -- For each field the closest miss among discriminate.mjs's wrong routes,")
A('  -- run through the engine, must lie OUTSIDE the tolerance, or the field')
A('  -- does not discriminate the trap it is for.')
for k in KEYS:
    why, val = TRAPS[k]
    A(f'''  v_wrong := {num(val)};
  if abs(v_wrong - {V[k]}) <= {num(TOL[k])} then
    raise exception 'refinery go-live refused: {why.replace("'", "''")} gives %, so the field does not discriminate the trap{name(k)}', v_wrong;
  end if;''')

A(f'''
  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = '{SLUG}';
  if not exists (select 1 from public.academy_apps where slug = '{SLUG}' and status = 'available') then
    raise exception 'refinery go-live refused: {SLUG} did not reach status available';
  end if;

  select count(*) filter (where status = 'available'), count(*) filter (where status = 'coming_soon')
    into v_available, v_soon
    from public.academy_apps;

  raise notice 'refinery go-live: {SLUG} available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
    v_lessons, v_questions, v_capstones, v_graded, v_available, v_soon;
end $$;''')

sql = HEADER + '\n\n' + '\n'.join(B) + '\n'

# ----------------------------------------------------------- self checks
named = set(re.findall(r'\[graded field: ([^\]]*)\]', sql))
named = {x.strip() for n in named for x in n.split(',')}
unnamed = [f'{TIER_OF[k]}/{k} is graded and no refusal names it' for k in KEYS
           if f'{TIER_OF[k]}/{k}' not in named]
# Every raise that reads a v_g_ or v_s_ variable must name the field.
for m in re.finditer(r"raise exception '((?:[^']|'')*)'([^;]*);", sql):
    reads = set(re.findall(r'v_[gs]_(\w+)', m.group(2)))
    for r in reads:
        if f'/{r}' not in m.group(1):
            unnamed.append(f'a refusal reads {r} and does not name it: {m.group(1)[:70]}')
code = '\n'.join(l.split('--', 1)[0] if not l.lstrip().startswith('--') else '' for l in sql.splitlines())
code_nolit = re.sub(r"'(?:[^']|'')*'", "''", code)
intdiv = [l.strip()[:90] for l in code_nolit.splitlines() if re.search(r'/\s*\d+(?![\d.eE])', l)]
unclosed = code.replace("''", '').count("'") % 2
dashes = len(re.findall('[–—]', sql))
if len(TRAPS) != 18 or set(TRAPS) != set(KEYS):
    refused.append('the traps do not cover all eighteen fields')

if __name__ == '__main__':
    if refused or unnamed or intdiv or unclosed or dashes:
        print('REFUSED, nothing written:')
        for b in refused + unnamed + intdiv:
            print('  ', b)
        print('unclosed literal:', bool(unclosed), '| en/em dashes:', dashes)
        sys.exit(1)
    open(OUT, 'w').write(sql)
    print(f'wrote {OUT}: {len(sql.splitlines())} lines')
    print('engine: 18 of 18 fields.json values equal refinery_capstone.mjs --json through the vendored engines')
    print('oracle: a fresh oracle_check.py run gives all 18 values and both plans exactly as written into this generator')
    print('second route in SQL: 16 fields closed form (IKARAMA 6, AMASSOMA 4 over the oracle plan, KOLOAMA 6); '
          'the 2 AMASSOMA stream values by the oracle only')
    print('traps (closest miss per field, in tolerances):')
    for k in KEYS:
        why, val = TRAPS[k]
        print(f'   {k:<38} {why:<45} {abs(val - F[k]) / TOL[k]:>12.1f}')
    print(f'digest sweep: {len(DIGEST_NUMS)} distinct numbers | derived figures swept: {len(DERIVED)}')
    print(f'graded fields named by at least one refusal: {len(named & {f"{TIER_OF[k]}/{k}" for k in KEYS})} of 18')
    print('integer-division guard: 0 | unclosed literals: 0 | en/em dashes: 0')
