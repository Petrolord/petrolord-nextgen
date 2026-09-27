#!/usr/bin/env python3
"""Generate the SC3 go-live migration.

NOTHING HERE IS RETYPED. The eighteen graded values are read out of the
CAPSTONE ROWS THE LADDER ITSELF SEEDED, by key, inside the same transaction,
and checked four ways, none of which restates the generator that wrote them.
Modelled on EC11's gen_golive.py (itself EC10's, EC9's, EC8's, EC7's and SC2's).

1. AGAINST THE ENGINE LEDGER. gen_course.py runs `node materials_capstone.mjs
   --json` through the vendored engines/supplychain/inventory.js when this
   file is generated, and refuses unless fields.json carries exactly what that
   run returned. The go-live compares the seeded rows to THAT RUN'S values, to
   the last bit.

2. BY A SECOND ROUTE IN SQL over the case files the learner is handed:
   golive_helpers.sql rebuilds the weighted criticality score, the cumulative
   ABC share, the EOQ with its rounded quantity, relevant cost and penalty,
   the banded write-down, the quantity-discount order and its total cost, the
   normal safety stock, fill-rate safety factor and order-up-to level (a
   Taylor-series normal CDF and plain bisection, none of the engine's
   numerics), the Poisson units short in closed form and the one-for-one
   insurance spares in plpgsql with no engine code. Each must agree with the
   seeded value to 1e-9 relative.

3. BY THE ORACLE. oracle_check.py --json, the vendored stdlib Python oracle
   (tools/validation/supplychain/oracle_inventory.py), run
   when this file is generated and written in by value; each seeded value must
   lie within its own tolerance of the oracle's.

4. BY THE TRAPS THE COURSE IS BUILT ON, which must BITE. Every wrong method
   discriminate.mjs swept through the ENGINE for a field is written in by
   value, and the go-live refuses unless each misses the seeded value by more
   than the field's tolerance.

And, before any of it: the shape of the ladder, the catalogue row (supply_chain,
path_order 77, no prerequisite) with no other course at 77, the numeric grader
simulated on every field, each prompt byte for byte (md5) with every stated
term and case file named, and a prompt sweep.

NO BEGIN OR COMMIT. The file carries no transaction lines of its own:
apply_sc3_materials.sh wraps each file in one transaction, and a dry run wraps the
whole ladder in one that ends in ROLLBACK.

Usage: python3 gen_golive.py
   SC3_WAVE, SC3_REPO, SC3_ENGINES, SC3_TOLERANCE as gen_course.py
   SC3_COURSE_SQL  the course migration this ladder emits
   SC3_GOLIVE_OUT  where to write
"""
import hashlib
import json
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
W = os.environ.get('SC3_WAVE', '/root/cat-wip-materials')
REPO = os.environ.get('SC3_REPO', '/root/wt-sc3-nextgen')
sys.path.insert(0, HERE)
os.environ['SC3_WAVE'] = W
import gen_course as GC  # noqa: E402  (runs the engine; writes nothing on import)

DATE = GC.DATE
COURSE = os.environ.get('SC3_COURSE_SQL', f'{REPO}/migrations/{DATE}_sc3_materials_course.sql')
OUT = os.environ.get('SC3_GOLIVE_OUT', f'{REPO}/migrations/{DATE}_sc3_materials_go_live.sql')
SLUG, MODULE, PATH_ORDER = GC.SLUG, GC.MODULE, GC.PATH_ORDER
fields = GC.fields
KEYS, TIER_OF = GC.KEYS, GC.TIER_OF
F = {k: v for _t, k, v, _tol in fields}
TOL = {k: tol for _t, k, _v, tol in fields}
ENGINE = {r['key']: r['value'] for r in GC.ENGINE_ROWS}
refused = list(GC.bad)
TAG = 'SC3 go-live refused'

course_sql = open(COURSE, encoding='utf-8').read() if os.path.exists(COURSE) else None
if course_sql != GC.SQL:
    refused.append(f'the course migration at {COURSE} is not the one gen_course.py renders now')
TOL6 = 5e-7
for k in KEYS:
    if TOL[k] < TOL6:
        refused.append(f'{k} is graded at {TOL[k]}, below the six-decimal floor {TOL6}')


def run(cmd, what):
    env = dict(os.environ, SC3_WAVE_DIR=W, SC3_ENGINES=GC.ENGINES, SC3_TOLERANCE=GC.TOLPATH, SC3_REPO=GC.REPO, TZ='UTC', LC_ALL='C')
    r = subprocess.run(cmd, capture_output=True, text=True, env=env)
    if r.returncode != 0:
        sys.exit(f'REFUSED: {what} failed (exit {r.returncode}): {(r.stdout + r.stderr).strip()[-400:]}')
    return r.stdout


ORACLE = json.loads(run(['python3', os.path.join(W, 'oracle_check.py'), '--json'], 'oracle_check.py --json'))
WRONG = json.loads(run(['node', os.path.join(W, 'discriminate.mjs'), '--json'], 'discriminate.mjs --json'))
if set(ORACLE) != set(KEYS):
    refused.append(f'the oracle computes {sorted(ORACLE)} and fields.json grades {KEYS}')
if set(WRONG) != set(KEYS):
    refused.append('discriminate.mjs sweeps a different set of fields from fields.json')
for k in KEYS:
    o = ORACLE.get(k, {}).get('value')
    if o is None or abs(o - F[k]) > TOL[k]:
        refused.append(f'{k}: the oracle gives {o!r}, not within {TOL[k]} of the engine\'s {F[k]!r}')
    w_ = WRONG.get(k)
    if w_ is None or w_['truth'] != F[k]:
        refused.append(f'{k}: discriminate.mjs computes {None if w_ is None else w_["truth"]!r} and fields.json carries {F[k]!r}')
    elif len(w_['wrong']) < 2:
        refused.append(f'{k}: discriminate.mjs aims {len(w_["wrong"])} wrong method(s) at it; two or more are required')


def fl(x):
    """A float literal SQL reads back as this exact double."""
    return repr(float(x)) + '::double precision'


def lit(s):
    return "'" + s.replace("'", "''") + "'"


def jlit(o):
    return lit(json.dumps(o, ensure_ascii=False, separators=(',', ':'))) + '::jsonb'


def num(x):
    return repr(float(x))


def name(*keys):
    for k in keys:
        assert k in KEYS, k
    return ' [graded field: ' + ', '.join(f'{TIER_OF[k]}/{k}' for k in keys) + ']'


P = []  # the body
w = P.append
COUNT = {'ledger': set(), 'route': set(), 'oracle': set(), 'trap': {}}
V = {k: f'v_g_{k}' for k in KEYS}


def route(key, expr_lines):
    """expr_lines compute v_s; then compare with the seeded value."""
    COUNT['route'].add(key)
    for l in expr_lines:
        w('  ' + l)
    w(f'  if v_s is null or abs(v_s - {V[key]}) > 1e-9 * abs({V[key]}) then')
    w(f"    raise exception '{TAG}: the second route in SQL gives %, and the seeded value is %{name(key)}', v_s, {V[key]};")
    w('  end if;')


# ------------------------------------------------------------------- header
HEADER = f"""-- ============================================================================
-- SC3 GO-LIVE (HELD): Materials, Spares & Inventory Management flips to
-- 'available' in the Supply Chain module, at path_order {PATH_ORDER}.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/materials. The 78 lessons, the teaching lab
-- (materialsLab.js), its three calculator panels (register, stock and spares)
-- and the three capstone case files ship in the ZIP and NOT in this database,
-- so a flip before the upload puts a live catalogue tile in front of a route
-- that does not exist. AN APP COURSE: the Suite app is the Materials & Spares
-- Planner (Suite #740, its tile migrations held for the owner separately), and
-- the course's own calculator panels carry every practical, so this go-live
-- waits on the NextGen upload only and reads nothing of the Suite. This file
-- is written, dry-run and left unapplied on purpose.
--
-- EVERY GRADED VALUE IS CHECKED FOUR WAYS, and none restates the generator:
--
--   1. against the ENGINE LEDGER: the values materials_capstone.mjs returned
--      through the vendored engines/supplychain/inventory.js (petrolord-engines
--      110f0a0) when this file was generated, to the last bit;
--   2. by a SECOND ROUTE IN SQL: the stated arithmetic rebuilt in plpgsql over
--      the case files the learner is handed; each to 1e-9 relative;
--   3. by the ORACLE: oracle_check.py's run of the vendored stdlib Python
--      oracle (tools/validation/supplychain/oracle_inventory.py), written in by
--      value, each seeded value within its tolerance of the oracle's;
--   4. by the TRAPS the course is built on: every wrong method
--      discriminate.mjs swept through the engine for a field, written in by
--      value, must miss the seeded value by more than the field's tolerance.
--
-- THE HELPERS are temporary functions (pg_temp), created with create or
-- replace and gone when the session ends. Nothing is created in any schema.
--
-- NO BEGIN OR COMMIT. Like every course migration in this repository, the
-- file carries no transaction lines of its own; apply_sc3_materials.sh wraps it
-- in one transaction.
--
-- THE GRADER IS NUMERIC. academy_submit_capstone casts expected, tol and the
-- answer to numeric and passes abs(answer - expected) <= tol. Every field must
-- carry a non-zero, non-whole expected value at its own shipped tolerance
-- (never below the six-decimal floor 5e-7) with a label and a unit, the
-- six-decimal answer the prompt asks for must pass, and one unit either side
-- of it in the sixth decimal must fail.
--
-- EVERY DENOMINATOR BELOW IS A FLOAT, ON PURPOSE.
--
-- EVERY REFUSAL THAT READS A GRADED VALUE NAMES IT as tier/key.
-- ============================================================================
"""

HELPERS = open(os.path.join(HERE, 'golive_helpers.sql'), encoding='utf-8').read()

decl = ['do $$', '#variable_conflict use_column', 'declare',
        '  v_structures int; v_questions int; v_capstones int; v_lessons int;',
        '  v_modules int; v_graded int; v_available int; v_soon int; v_n int;',
        '  v_names text; v_prompt text; v_s double precision; v_wrong double precision;',
        ]
for k in KEYS:
    decl.append(f'  {V[k]} double precision;')
decl += [
    f"  v_case_b jsonb := {jlit(json.loads(GC.CASES['beginner'][0][1]))};",
    f"  v_case_i jsonb := {jlit(json.loads(GC.CASES['intermediate'][0][1]))};",
    f"  v_case_a jsonb := {jlit(json.loads(GC.CASES['advanced'][0][1]))};",
    'begin', '']

S = SLUG
# ------------------------------------------------------------------- shape
w('  -- ---------------------------------------------------------------- shape')
w(f"  select count(*) into v_structures from public.academy_course_structures where app_slug = '{S}' and active;")
w("  if v_structures <> 3 then")
w(f"    raise exception '{TAG}: {S} has % active deep structures, expected 3', v_structures;")
w('  end if;')
w(f"  select count(*) into v_questions from public.academy_quiz_questions where app_slug = '{S}';")
w('  if v_questions <> 396 then')
w(f"    raise exception '{TAG}: {S} has % quiz questions, expected 396', v_questions;")
w('  end if;')
for cond, msg in ((f"select tier from public.academy_quiz_questions where app_slug = '{S}' group by tier having count(*) <> 132",
                   '% tier(s) do not carry exactly 132 questions'),
                  (f"select tier, module_key from public.academy_quiz_questions where app_slug = '{S}' and scope = 'module' group by tier, module_key having count(*) <> 15",
                   '% module bank(s) do not carry exactly 15 questions'),
                  (f"select tier from public.academy_quiz_questions where app_slug = '{S}' and scope = 'final' group by tier having count(*) <> 42",
                   '% final exam(s) do not carry exactly 42 questions')):
    w(f'  select count(*) into v_n from ({cond}) t;')
    w('  if v_n <> 0 then')
    w(f"    raise exception '{TAG}: {msg}', v_n;")
    w('  end if;')
w(f"  select count(*) into v_n from public.academy_quiz_questions where app_slug = '{S}'")
w('     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);')
w('  if v_n <> 0 then')
w(f"    raise exception '{TAG}: % question(s) do not offer four options with a key inside them', v_n;")
w('  end if;')
w('  select count(*) into v_lessons from public.academy_course_structures s,')
w("         lateral jsonb_array_elements(s.structure->'modules') m, lateral jsonb_array_elements_text(m->'lesson_keys') lk")
w(f"   where s.app_slug = '{S}' and s.active;")
w('  if v_lessons <> 78 then')
w(f"    raise exception '{TAG}: {S} carries % lesson keys, expected 78', v_lessons;")
w('  end if;')
w("  select count(*) into v_modules from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m")
w(f"   where s.app_slug = '{S}' and s.active;")
w('  if v_modules <> 18 then')
w(f"    raise exception '{TAG}: {S} carries % modules, expected 18 (six per tier)', v_modules;")
w('  end if;')
w('  select count(*) into v_n from (select distinct qq.tier, qq.module_key from public.academy_quiz_questions qq')
w(f"     where qq.app_slug = '{S}' and qq.scope = 'module' and not exists (")
w("       select 1 from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m")
w("        where s.app_slug = qq.app_slug and s.tier = qq.tier and s.active and m->>'key' = qq.module_key)) t;")
w('  if v_n <> 0 then')
w(f"    raise exception '{TAG}: % module bank(s) are keyed to a module the structure does not declare', v_n;")
w('  end if;')
w(f"  select count(*) into v_capstones from public.academy_capstones where app_slug = '{S}';")
w('  if v_capstones <> 3 then')
w(f"    raise exception '{TAG}: {S} has % capstones, expected 3', v_capstones;")
w('  end if;')
w(f"  select count(*) into v_graded from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = '{S}';")
w('  if v_graded <> 18 then')
w(f"    raise exception '{TAG}: {S} has % graded capstone fields, expected 18', v_graded;")
w('  end if;')
w(f"  select count(*) into v_n from (select c.tier from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = '{S}' group by c.tier having count(*) <> 6) t;")
w('  if v_n <> 0 then')
w(f"    raise exception '{TAG}: % tier(s) do not grade exactly six fields', v_n;")
w('  end if;')
w(f"  if not exists (select 1 from public.academy_apps where slug = '{S}' and module = '{MODULE}' and path_order = {PATH_ORDER} and prereq_slug is null) then")
w(f"    raise exception '{TAG}: the {S} catalogue row is not {MODULE} at path_order {PATH_ORDER} with no prerequisite';")
w('  end if;')
w(f"  if exists (select 1 from public.academy_apps where path_order = {PATH_ORDER} and slug <> '{S}') then")
w(f"    raise exception '{TAG}: another course already holds path_order {PATH_ORDER}';")
w('  end if;')
w('')
# ------------------------------------------------------------ the grader
w('  -- ------------------------------------------------- the grader is numeric')
TOL_ROWS = ', '.join(f"({lit(TIER_OF[k])}, {lit(k)}, {TOL[k]!r}::numeric)" for k in KEYS)
w("  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ') into v_n, v_names")
w('    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f')
w(f"   where c.app_slug = '{S}'")
w("     and (jsonb_typeof(f->'expected') <> 'number' or jsonb_typeof(f->'tol') <> 'number'")
w("          or abs((f->>'expected')::numeric) <= 0.001")
w("          or abs((f->>'expected')::numeric - round((f->>'expected')::numeric)) <= 0.001")
w(f"          or (f->>'tol')::numeric is distinct from (select t.tol from (values {TOL_ROWS}) t(tier, k, tol) where t.tier = c.tier and t.k = f->>'key')")
w("          or coalesce(f->>'label', '') = '' or coalesce(f->>'unit', '') = '');")
w('  if v_n <> 0 then')
w(f"    raise exception '{TAG}: % graded field(s) are not a non-zero, non-whole number at the tolerance gradedTolerance.js derives, with a label and a unit: %', v_n, v_names;")
w('  end if;')
w("  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ') into v_n, v_names")
w('    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f')
w(f"   where c.app_slug = '{S}'")
w("     and (abs(round((f->>'expected')::numeric, 6) - (f->>'expected')::numeric) > (f->>'tol')::numeric")
w("          or ((f->>'tol')::numeric = 0.0000005")
w("              and (abs(round((f->>'expected')::numeric, 6) + 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric")
w("                   or abs(round((f->>'expected')::numeric, 6) - 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric)));")
w('  if v_n <> 0 then')
w(f"    raise exception '{TAG}: % graded field(s) either fail the six-decimal answer the prompt asks for or, at the six-decimal floor, pass one a unit off in the sixth decimal: %', v_n, v_names;")
w('  end if;')
w('')

# ------------------------------------------------------------ the prompts
w('  -- ---------------------------------------- the prompts the learner reads')
n = GC.n
STATED = {t: [str(x) for x in GC.WORDS[t]] + [f for f, _ in GC.CASES[t]] + [GC.FREE] for t in GC.TIERS}
for tier in GC.TIERS:
    cert, dataset, title, prompt = GC.TIER[tier]
    for s_ in STATED[tier]:
        if s_ not in prompt:
            refused.append(f'{tier} prompt does not carry the stated setting "{s_}"')
    md5 = hashlib.md5(prompt.encode('utf-8')).hexdigest()
    w(f"  select prompt into v_prompt from public.academy_capstones where app_slug = '{S}' and tier = '{tier}';")
    w(f"  if v_prompt is null or md5(v_prompt) <> '{md5}' then")
    w(f"    raise exception '{TAG}: the {tier} prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);")
    w('  end if;')
    w(f"  if not exists (select 1 from public.academy_capstones where app_slug = '{S}' and tier = '{tier}'")
    w(f"                    and cert_tier = '{cert}' and dataset = {lit(dataset)} and title = {lit(title)}) then")
    w(f"    raise exception '{TAG}: the {tier} capstone does not carry the certificate tier, dataset and title gen_course.py rendered';")
    w('  end if;')
    w("  select count(*), string_agg(l, ' / ') into v_n, v_names")
    w(f"    from unnest(array[{', '.join(lit(s_) for s_ in STATED[tier])}]) l where strpos(v_prompt, l) = 0;")
    w('  if v_n <> 0 then')
    w(f"    raise exception '{TAG}: % stated setting(s) or case file(s) are not named in the shipped {tier} prompt: %', v_n, v_names;")
    w('  end if;')
w('  -- No number handed in any capstone text of this course may sit within its')
w('  -- tolerance of any graded value of any tier.')
w("  select count(*), string_agg(g.ftier || '/' || g.k || ' in the ' || h.ctier || ' capstone text', ', ') into v_n, v_names")
w("    from (select c.tier as ctier, m[1]::double precision as x")
w("            from public.academy_capstones c,")
w("                 lateral regexp_matches(c.prompt || ' ' || c.dataset || ' ' || c.title || ' ' ||")
w("                   (select string_agg((f->>'label') || ' ' || (f->>'unit'), ' ') from jsonb_array_elements(c.fields) f),")
w("                   '(-?[0-9]+(?:[.][0-9]+)?)', 'g') m")
w(f"           where c.app_slug = '{S}') h,")
w("         (select c.tier as ftier, f->>'key' as k, (f->>'expected')::double precision as v, (f->>'tol')::double precision as t")
w(f"            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = '{S}') g")
w('   where abs(abs(h.x) - abs(g.v)) <= g.t;')
w('  if v_n <> 0 then')
w(f"    raise exception '{TAG}: % graded value(s) are handed in capstone text: %', v_n, v_names;")
w('  end if;')
w('')
# ---------------------------------------------------- the graded values
w('  -- --------------------------------------- the eighteen graded values')
for k in KEYS:
    w(f"  select (f->>'expected')::double precision into {V[k]}")
    w('    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f')
    w(f"   where c.app_slug = '{S}' and c.tier = '{TIER_OF[k]}' and f->>'key' = '{k}';")
    w(f'  if {V[k]} is null then')
    w(f"    raise exception '{TAG}: the seeded rows carry no value{name(k)}';")
    w('  end if;')
w('')

# ------------------------------------------------------ 1. the ledger
w('  -- ------------------------------------------ 1. against the engine ledger')
for k in KEYS:
    COUNT['ledger'].add(k)
    w(f'  if {V[k]} <> {fl(ENGINE[k])} then')
    w(f"    raise exception '{TAG}: the seeded value is %, and the engine returned {num(ENGINE[k])}{name(k)}', {V[k]};")
    w('  end if;')
w('')

# ------------------------------------------------- 2. the second route
w('  -- ----------------------------------------------- 2. the second route in SQL')
SECOND = {
    'igbariam_trim_weighted_score': "pg_temp.sc3_crit(v_case_b->'criticality', 'IGB-V204')",
    'igbariam_inhibitor_cumulative_pct': "pg_temp.sc3_abc_cum(v_case_b->'abcClassification', 'IGB-C515')",
    'igbariam_inhibitor_eoq': "pg_temp.sc3_eoq(v_case_b->'eoq', 'eoq')",
    'igbariam_inhibitor_relevant_cost': "pg_temp.sc3_eoq(v_case_b->'eoq', 'cost')",
    'igbariam_inhibitor_rounding_penalty_pct': "pg_temp.sc3_eoq(v_case_b->'eoq', 'penalty')",
    'igbariam_total_write_down': "pg_temp.sc3_write_down(v_case_b->'slowMoving')",
    'ogidi_tubing_discount_quantity': "pg_temp.sc3_disc(v_case_i->'quantityDiscount', 'quantity')",
    'ogidi_tubing_discount_total_cost': "pg_temp.sc3_disc(v_case_i->'quantityDiscount', 'total')",
    'ogidi_filter_csl_safety_stock': "pg_temp.sc3_ss(v_case_i->'safetyStock:cycle-service', 'safety')",
    'ogidi_filter_fill_rate_k': "pg_temp.sc3_ss(v_case_i->'safetyStock:fill-rate', 'k')",
    'ogidi_filter_periodic_level': "pg_temp.sc3_ss(v_case_i->'safetyStock:periodic', 'level')",
    'ogidi_kit_poisson_short': "pg_temp.sc3_pois(v_case_i->'poissonStock', 'short')",
    'umuchu_motor_total_cost': "pg_temp.sc3_spares(v_case_a->'insuranceSpares', 'total')",
    'umuchu_motor_downtime_cost': "pg_temp.sc3_spares(v_case_a->'insuranceSpares', 'downtime')",
    'umuchu_motor_no_shortage': "pg_temp.sc3_spares(v_case_a->'insuranceSpares', 'noshort')",
    'umuchu_motor_fill_rate': "pg_temp.sc3_spares(v_case_a->'insuranceSpares', 'fill')",
    'umuchu_seal_poisson_short': "pg_temp.sc3_pois(v_case_a->'poissonStock', 'short')",
    'umuchu_seal_poisson_fill_rate': "pg_temp.sc3_pois(v_case_a->'poissonStock', 'fill')",
}
if set(SECOND) != set(KEYS):
    refused.append('the second route does not cover exactly the eighteen graded fields')
for k in KEYS:
    route(k, [f'v_s := {SECOND[k]};'])
w('')

w('  -- ---------------------------------------------------- 3. against the oracle')
w('  -- oracle_check.py --json, run when this file was generated: the value the')
w('  -- vendored stdlib oracle computed, written in, with the module it came from.')
for k in KEYS:
    COUNT['oracle'].add(k)
    o = ORACLE[k]
    w(f"  -- {k}: {o['oracle']}")
    w(f'  if abs({V[k]} - {fl(o["value"])}) > {fl(TOL[k])} then')
    w(f"    raise exception '{TAG}: the oracle gives {num(o['value'])}, not within {num(TOL[k])} of the seeded %{name(k)}', {V[k]};")
    w('  end if;')
w('')

# ------------------------------------------------------------- 4. the traps
w('  -- ------------------------------------------------------------- 4. the traps')
w('  -- Every wrong method discriminate.mjs swept through the engine for a field,')
w('  -- by value: each must miss the seeded value by more than the tolerance, or')
w('  -- the field does not discriminate the trap it is for.')
for k in KEYS:
    for why, val in WRONG[k]['wrong'].items():
        if val is None:
            continue  # the wrong method returns no value at all (a status without a figure): nothing to compare
        label = why.replace('_', ' ')
        assert "'" not in label, label
        COUNT['trap'][k] = COUNT['trap'].get(k, 0) + 1
        w(f'  v_wrong := {fl(val)};')
        w(f'  if abs(v_wrong - {V[k]}) <= {fl(TOL[k])} then')
        w(f"    raise exception '{TAG}: the trap ({label}) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap{name(k)}', v_wrong, {V[k]};")
        w('  end if;')
w('')

# ------------------------------------------------------------ the flip
w('  -- ------------------------------------------------------------- the flip')
w(f"  update public.academy_apps set status = 'available' where slug = '{S}';")
w(f"  if not exists (select 1 from public.academy_apps where slug = '{S}' and status = 'available') then")
w(f"    raise exception '{TAG}: {S} did not reach status available';")
w('  end if;')
w("  select count(*) filter (where status = 'available'), count(*) filter (where status = 'coming_soon')")
w('    into v_available, v_soon from public.academy_apps;')
w(f"  raise notice 'SC3 go-live: {S} available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',")
w('    v_lessons, v_questions, v_capstones, v_graded, v_available, v_soon;')
w('end $$;')

SQL = HEADER + HELPERS + '\n' + '\n'.join(decl) + '\n' + '\n'.join(P) + '\n'

# ------------------------------------------------------------ self checks
for k in KEYS:
    for what in ('ledger', 'route', 'oracle'):
        if k not in COUNT[what]:
            refused.append(f'{k} has no {what} check')
    if COUNT['trap'].get(k, 0) < 2:
        refused.append(f'{k} has {COUNT["trap"].get(k, 0)} trap(s); two or more are required')
code = '\n'.join(l.split('--', 1)[0] if not l.lstrip().startswith('raise') else '' for l in SQL.splitlines()
                 if not l.lstrip().startswith('--') and not re.match(r"\s*v_case_[bia] jsonb", l))
bare = re.findall(r'/\s*(?:\d+(?![\d.])|count\([^)]*\)(?!::double precision)|cardinality\([^)]*\)(?!::double precision)|array_length\([^)]*\)(?!::double precision))', code)
if bare:
    refused.append(f'bare integer denominator(s): {bare[:5]}')
odd = [ln for ln, l in enumerate(SQL.splitlines(), 1)
       if not l.lstrip().startswith('--') and l.split('--', 1)[0].count("'") % 2
       and not re.match(r"\s*v_case_[bia] jsonb", l)]
if odd:
    refused.append(f'odd-quote code lines {odd[:5]}')
if re.search('[–—]', SQL):
    refused.append('an en or em dash in the go-live')
if re.search(r'(?im)^\s*(begin|commit|rollback)\s*;', SQL):
    refused.append('a transaction line of its own in the go-live; the apply script wraps it')
for ln in SQL.splitlines():
    if 'raise exception' in ln and 'v_g_' in ln and '[graded field:' not in ln:
        refused.append(f'a refusal reads a graded value and names none: {ln.strip()[:120]}')
for b in ('-- ------------------------------------------ 1. against the engine ledger',
          '-- ----------------------------------------------- 2. the second route in SQL',
          '-- ---------------------------------------------------- 3. against the oracle',
          '-- ------------------------------------------------------------- 4. the traps'):
    if SQL.count(b) != 1:
        refused.append(f'the banner "{b}" is not in the go-live exactly once')

if __name__ == '__main__':
    if refused:
        for r in refused:
            print('  REFUSED:', r)
        print('NOTHING WRITTEN.')
        sys.exit(1)
    open(OUT, 'w').write(SQL)
    print(f'wrote {OUT}: {len(SQL.splitlines())} lines')
    print(f"ledger 18, second route in SQL 18, oracle 18, traps {sum(COUNT['trap'].values())} over 18 fields "
          f"(min {min(COUNT['trap'].values())}), prompt md5 3, stated settings {sum(len(v) for v in STATED.values())}")
