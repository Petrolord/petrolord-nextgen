#!/usr/bin/env python3
"""Generate the SC2 go-live migration.

NOTHING HERE IS RETYPED. The eighteen graded values are read out of the
CAPSTONE ROWS THE LADDER ITSELF SEEDED, by key, inside the same transaction,
and checked four ways, none of which restates the generator that wrote them.
Modelled on tools/course-waves/appliedai/gen_golive.py (D5) and
tools/course-waves/supply/gen_golive.py (the first Supply Chain course).

1. AGAINST THE ENGINE LEDGER. gen_course.py runs `node sc2_capstone.mjs
   --json` through the vendored engines/supplychain/tender.js when this file
   is generated, and refuses unless fields.json carries exactly what that run
   returned. The go-live compares the seeded rows to THAT RUN'S values, to the
   last bit, so a capstone row an earlier seed left behind (the course
   migration inserts with `on conflict do nothing`) is refused by name, and so
   is a move of one part in 1e7.

2. BY A SECOND ROUTE IN SQL over the data the learner is handed in the case
   files, with every setting the prompts state. Every graded value is
   recomputed by Postgres with no engine code: the technical percentage, the
   ITB 35.1 arithmetic correction, the evaluated cost with the ITB 34.1
   average for an omission, the schedule adjustment and the life-cycle net
   present cost, the combined score, the Nigerian content weighted by spend,
   the s.14 lead under both readings, the ALB limit with the population
   standard deviation, the Monte Carlo on the mulberry32 stream rebuilt in
   64-bit integer arithmetic with the triangular inverse CDF and the lib/stats
   floor-index percentile, the wellCost duration forms, the AFE rollup and the
   partner split, and the OKIGWE tender evaluated again for its award. Each
   must agree with the seeded value to 1e-9 relative.

3. BY THE ORACLE. oracle_check.py --json, the vendored stdlib Python oracle
   (tools/validation/supplychain/oracle_tender.py, exact Fractions where it
   can), run when this file is generated and written in by value; each seeded
   value must lie within its own tolerance of the oracle's.

4. BY THE TRAPS THE COURSE IS BUILT ON, which must BITE. Every wrong method
   discriminate.mjs swept through the ENGINE for a field (85 over the 18
   fields, four or five a field) is written in by value, and the go-live
   refuses unless each misses the seeded value by more than the field's
   tolerance.

And, before any of it: the shape of the ladder (3 structures, 78 lesson keys,
18 modules, 396 questions, 132 a tier, 15 a module bank, 42 an exam, four
options with a key inside them, 3 capstones, 18 fields, 6 a tier), the catalogue
row (supply_chain, path_order 71, no prerequisite) with no other course at 71,
the numeric grader simulated on every field at its own shipped tolerance, each
prompt byte for byte (md5) as gen_course.py rendered it with every stated
setting and case file named, and a prompt sweep: no number handed in any
capstone text sits within its tolerance of any graded value.

THE HELPERS ARE TEMPORARY FUNCTIONS, read from golive_helpers.sql beside this
file and created in pg_temp at the head of the go-live (create or replace, so a
second run in one session changes nothing). They vanish with the session and
create nothing in any schema a learner or another migration can see.

NO BEGIN OR COMMIT. Like every course migration in this repository, the file
carries no transaction lines of its own: apply_sc2_procurement.sh wraps each
file in one transaction, and dryrun_sc2.sh wraps the whole ladder in one that
ends in ROLLBACK.

WHAT IT REFUSES TO WRITE: a refusal that reads a graded value and does not name
it; a graded field without a ledger check, a second route, an oracle check and
two traps; a division by a bare integer; an unclosed literal; an em or en dash.

Usage: python3 gen_golive.py
   SC2_WAVE, SC2_REPO, SC2_ENGINES, SC2_TOLERANCE as gen_course.py
   SC2_COURSE_SQL  the course migration this ladder emits, for the prompt checks
   SC2_GOLIVE_OUT  where to write
"""
import hashlib
import json
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
W = os.environ.get('SC2_WAVE', '/root/cat-wip-procurement')
REPO = os.environ.get('SC2_REPO', '/root/wt-sc2-nextgen')
sys.path.insert(0, HERE)
os.environ['SC2_WAVE'] = W
import gen_course as GC  # noqa: E402  (runs the engine; writes nothing on import)

DATE = GC.DATE
COURSE = os.environ.get('SC2_COURSE_SQL', f'{REPO}/migrations/{DATE}_sc2_procurement_course.sql')
OUT = os.environ.get('SC2_GOLIVE_OUT', f'{REPO}/migrations/{DATE}_sc2_procurement_go_live.sql')
SLUG, MODULE, PATH_ORDER = GC.SLUG, GC.MODULE, GC.PATH_ORDER
fields = GC.fields
KEYS, TIER_OF = GC.KEYS, GC.TIER_OF
F = {k: v for _t, k, v, _tol in fields}
TOL = {k: tol for _t, k, _v, tol in fields}
ENGINE = {r['key']: r['value'] for r in GC.ENGINE_ROWS}
ON, UM, OK = GC.ON, GC.UM, GC.OK
OKC, OKS, OKT = GC.OKC, GC.OKS, GC.OKT
CASE = GC.CASE_OBJ
refused = list(GC.bad)
TAG = 'SC2 go-live refused'

course_sql = open(COURSE, encoding='utf-8').read() if os.path.exists(COURSE) else None
if course_sql != GC.SQL:
    refused.append(f'the course migration at {COURSE} is not the one gen_course.py renders now')
TOL6 = 5e-7
for k in KEYS:
    if TOL[k] < TOL6:
        refused.append(f'{k} is graded at {TOL[k]}, below the six-decimal floor {TOL6}')


def run(cmd, what):
    env = dict(os.environ, SC2_WAVE_DIR=W, SC2_ENGINES=GC.ENGINES, SC2_TOLERANCE=GC.TOLPATH, TZ='UTC', LC_ALL='C')
    r = subprocess.run(cmd, capture_output=True, text=True, env=env)
    if r.returncode != 0:
        sys.exit(f'REFUSED: {what} failed (exit {r.returncode}): {(r.stdout + r.stderr).strip()[-400:]}')
    return r.stdout


# ------------------------------------------ the oracle and the wrong routes
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
    if w_ is None or abs(w_['truth'] - F[k]) > 1e-12 * abs(F[k]):
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
-- SC2 GO-LIVE (HELD): Procurement, Tendering & Contracting flips to
-- 'available', the SECOND course of the Supply Chain module, at path_order
-- {PATH_ORDER}.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/procurement. The 78 lessons, the teaching lab
-- (tenderLab.js), its three calculator panels (envelope, award and contract)
-- and the three capstone case files ship in the ZIP and NOT in this database,
-- so a flip before the upload puts a live catalogue tile in front of a route
-- that does not exist. AN ENGINE COURSE: there is no Suite app and no Suite
-- upload to wait for. This file is written, dry-run and left unapplied on
-- purpose.
--
-- EVERY GRADED VALUE IS CHECKED FOUR WAYS, and none restates the generator:
--
--   1. against the ENGINE LEDGER: the values sc2_capstone.mjs returned through
--      the vendored engines/supplychain/tender.js when this file was
--      generated, to the last bit, so a capstone row an earlier seed left
--      behind, or a move of one part in 1e7, is refused by name;
--   2. by a SECOND ROUTE IN SQL over the data in the case files and the
--      settings the prompts state: the technical percentage, the ITB 35.1
--      arithmetic correction, the evaluated cost (discount, deviations, the
--      ITB 34.1 average for an omission, the schedule adjustment, the
--      life-cycle net present cost), the combined score, the Nigerian content
--      weighted by spend, the s.14 lead under both readings, the ALB limit
--      with the population standard deviation, the Monte Carlo on the
--      mulberry32 stream rebuilt in 64-bit integer arithmetic with the
--      triangular inverse CDF and the floor-index percentile, the wellCost
--      duration forms, the AFE rollup, the partner split, and the OKIGWE
--      tender evaluated again for its award; each to 1e-9 relative;
--   3. by the ORACLE: oracle_check.py's run of the vendored stdlib Python
--      oracle (tools/validation/supplychain/oracle_tender.py), written in by
--      value, each seeded value within its tolerance of the oracle's;
--   4. by the TRAPS the course is built on: every wrong method
--      discriminate.mjs swept through the engine for a field, written in by
--      value, must miss the seeded value by more than the field's tolerance.
--
-- THE HELPERS are temporary functions (pg_temp), created with create or
-- replace and gone when the session ends. Nothing is created in any schema.
--
-- NO BEGIN OR COMMIT. Like every course migration in this repository, the
-- file carries no transaction lines of its own; apply_sc2_procurement.sh wraps
-- it in one transaction.
--
-- THE GRADER IS NUMERIC. academy_submit_capstone casts expected, tol and the
-- answer to numeric and passes abs(answer - expected) <= tol. Every field must
-- carry a non-zero, non-whole expected value at its own shipped tolerance
-- (the one gradedTolerance.js derives, never below the six-decimal floor
-- 5e-7) with a label and a unit, the six-decimal answer the prompt asks for
-- must pass, and at the six-decimal floor one unit either side of it in the
-- sixth decimal must fail.
--
-- EVERY DENOMINATOR BELOW IS A FLOAT, ON PURPOSE. Postgres divides integer by
-- integer as an integer, and the generator refuses a bare integer denominator.
--
-- EVERY REFUSAL THAT READS A GRADED VALUE NAMES IT as tier/key.
-- ============================================================================
"""

HELPERS = open(os.path.join(HERE, 'golive_helpers.sql'), encoding='utf-8').read()

# -------------------------------------------------------------- declarations
decl = ['do $$', '#variable_conflict use_column', 'declare',
        '  v_structures int; v_questions int; v_capstones int; v_lessons int;',
        '  v_modules int; v_graded int; v_available int; v_soon int; v_n int;',
        '  v_names text; v_prompt text; v_s double precision; v_wrong double precision;',
        '  v_open jsonb; v_th double precision; v_cmin double precision; v_top text; v_k double precision[];',
        '  v_costs double precision[]; v_ids text[]; v_nc double precision[]; v_pd double precision;']
for k in KEYS:
    decl.append(f'  {V[k]} double precision;')
decl += [
    f"  v_on jsonb := {jlit(CASE['beginner'])};",
    f"  v_um jsonb := {jlit(CASE['intermediate'])};",
    f"  v_ok jsonb := {jlit(CASE['advanced'])};",
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
ONS, UMS, OKSCH = ON['schedule'], UM['schedule'], OKT['schedule']
STATED = {
    'beginner': [f"pass mark {n(ON['passMark'])}", f"minWeeks {n(ONS['minWeeks'])}", f"ratePerWeek {n(ONS['ratePerWeek'])}",
                 f"maxWeeks {n(ONS['maxWeeks'])}", f"technical weight {n(ON['technicalWeight'])}",
                 f"{ON['omissionRule']} of the corrected amounts", f"{ON['priceMethod']} commercial score",
                 f"{ON['technicalMethod']} technical score", 'no credit is given', GC.TIEBREAK]
                + [f for f, _ in GC.CASES['beginner']],
    'intermediate': [f"pass mark {n(UM['passMark'])}", f"minWeeks {n(UMS['minWeeks'])}", f"ratePerWeek {n(UMS['ratePerWeek'])}",
                     f"maxWeeks {n(UMS['maxWeeks'])}", f"discountRate of {n(UM['lifeCycle']['discountRate'])}",
                     f"{n(UM['lifeCycle']['years'])} years", 'residual value credited in the last year', UM['ncWeights'],
                     'population standard deviation', 'within 1 percent of the lowest evaluated cost', 'percentage points',
                     "closest competitor's content", GC.TIEBREAK]
                    + [f for f, _ in GC.CASES['intermediate']],
    'advanced': [f"min {n(OKC['duration']['nptFrac']['min'])}, mode {n(OKC['duration']['nptFrac']['mode'])} and max {n(OKC['duration']['nptFrac']['max'])}",
                 f"min {n(OKC['dailyCost']['min'])}, mode {n(OKC['dailyCost']['mode'])} and max {n(OKC['dailyCost']['max'])}",
                 f"fixed cost {n(OKC['fixedCost'])}", f"lump sum {n(OKC['lumpSum']['price'])}",
                 f"day rate {n(OKC['dayRate']['rate'])} a day plus a mobilisation fee of {n(OKC['dayRate']['mobilisationFee'])}",
                 f"cost plus {n(OKC['reimbursable']['feeFraction'])} of cost", 'the plan at the modes',
                 f"{n(OKC['iterations'])} iterations on seed {n(OKC['seed'])}", f"NPT fraction {n(OKS['nptFrac'])}",
                 f"contingency {n(OKS['contingencyFrac'])}", f"pass mark {n(OKT['passMark'])}",
                 f"minWeeks {n(OKSCH['minWeeks'])}", f"ratePerWeek {n(OKSCH['ratePerWeek'])}", f"maxWeeks {n(OKSCH['maxWeeks'])}",
                 f"technical weight {n(OKT['technicalWeight'])}", 'the LOW cost', GC.TIEBREAK]
                + [f for f, _ in GC.CASES['advanced']],
}
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
TOLA = fl(0.005)  # the arithmetic tolerance at the engine default, half a cent
TOLA_ENGINE = json.loads(run(['node', '--input-type=module', '-e',
                              f"const {{ T }} = await import({json.dumps(W + '/tender_engine.mjs')}); "
                              'console.log(JSON.stringify(T.DEFAULTS.ARITHMETIC_TOLERANCE));'], 'the engine default tolerance'))
if TOLA_ENGINE != 0.005:
    refused.append(f'the engine default arithmetic tolerance is {TOLA_ENGINE}, and the second route uses 0.005')


def tender(var, t, tag):
    """Open the envelopes of one case: v_open, v_th (Thigh), the responsive
    rows' ids and evaluated costs, v_cmin."""
    sch = t.get('schedule')
    lc = t.get('lifeCycle')
    w(f"  v_open := pg_temp.sc2_open({var}->'criteria', {var}->'bids', {fl(t['passMark'])});")
    w(f"  v_th := (select max(pg_temp.sc2_tech_pct({var}->'criteria', e)) from jsonb_array_elements(v_open) e);")
    args = (f"v_open, {lit(t['omissionRule'])}, {fl(sch['minWeeks'])}, {fl(sch['maxWeeks'])}, {fl(sch['ratePerWeek'])}, "
            f"{fl(lc['discountRate']) if lc else 'null'}, {TOLA}")
    w(f"  select array_agg(c.id order by c.ord), array_agg(c.cost order by c.ord) into v_ids, v_costs from pg_temp.sc2_costs({args}) c;")
    w('  v_cmin := (select min(x) from unnest(v_costs) x);')
    return args


def bid(var, bid_id):
    return f"(select e from jsonb_array_elements({var}->'bids') e where e->>'id' = {lit(bid_id)})"


# ONITSHA
ON_ARGS = tender('v_on', ON, 'ONITSHA')
route('onitsha_on3_technical_percent', [f"v_s := pg_temp.sc2_tech_pct(v_on->'criteria', {bid('v_on', 'ON3')});"])
route('onitsha_on2_corrected_price', [f"v_s := pg_temp.sc2_price({bid('v_on', 'ON2')}, {TOLA});"])
route('onitsha_on3_omission_amount', [f"v_s := (select c.omission from pg_temp.sc2_costs({ON_ARGS}) c where c.id = 'ON3');"])
route('onitsha_on1_evaluated_cost', [f"v_s := (select c.cost from pg_temp.sc2_costs({ON_ARGS}) c where c.id = 'ON1');"])
TW = fl(ON['technicalWeight'])
route('onitsha_on2_commercial_score', [f"v_s := (pg_temp.sc2_combined(pg_temp.sc2_tech_pct(v_on->'criteria', {bid('v_on', 'ON2')}),",
                                       f"          v_costs[array_position(v_ids, 'ON2')], v_th, v_cmin, {TW}))[1];"])
route('onitsha_top_combined_score', ['v_s := (select max((pg_temp.sc2_combined(pg_temp.sc2_tech_pct(v_on->\'criteria\', e),',
                                     f"          v_costs[array_position(v_ids, e->>'id')], v_th, v_cmin, {TW}))[2])",
                                     "          from jsonb_array_elements(v_on->'bids') e where e->>'id' = any(v_ids));"])

# UMUAHIA
UM_ARGS = tender('v_um', UM, 'UMUAHIA')
NC_ITEMS = [it['id'] for it in CASE['intermediate']['contentItems']]
NC_ARR = 'array[' + ', '.join(lit(x) for x in NC_ITEMS) + ']::text[]'
w(f"  v_nc := array(select pg_temp.sc2_content((select e from jsonb_array_elements(v_um->'bids') e where e->>'id' = i), {NC_ARR})")
w('                  from unnest(v_ids) with ordinality u(i, o) order by o);')
route('umuahia_um2_life_cycle_cost', [f"v_s := (select c.lcc from pg_temp.sc2_costs({UM_ARGS}) c where c.id = 'UM2');"])
route('umuahia_um4_evaluated_cost', ["v_s := v_costs[array_position(v_ids, 'UM4')];"])
route('umuahia_alb_limit', ['v_s := pg_temp.sc2_alb(v_costs);'])
route('umuahia_um3_overall_content', [f"v_s := pg_temp.sc2_content({bid('v_um', 'UM3')}, {NC_ARR});"])
route('umuahia_s14_lead_points', ['v_s := (pg_temp.sc2_s14(v_costs, v_nc))[1];'])
route('umuahia_s14_lead_relative', ['v_s := (pg_temp.sc2_s14(v_costs, v_nc))[2];'])

# OKIGWE
NPT, DC = OKC['duration']['nptFrac'], OKC['dailyCost']
if OKC['duration']['program'] != CASE['advanced']['program'] or OKS['program'] != CASE['advanced']['program']:
    refused.append('OKIGWE: the programme the engine ran is not the one the case file hands the learner')
if 'feeFraction' not in OKC['reimbursable']:
    refused.append('OKIGWE: the second route prices a reimbursable at cost plus a fraction, and the engine ran another form')
w("  v_pd := pg_temp.sc2_days(v_ok->'program', 0.0::double precision);")
MC = (f"pg_temp.sc2_mc(v_pd, {fl(NPT['min'])}, {fl(NPT['mode'])}, {fl(NPT['max'])}, {fl(DC['min'])}, {fl(DC['mode'])}, {fl(DC['max'])},"
      f" {fl(OKC['fixedCost'])}, {fl(OKC['dayRate']['mobilisationFee'])}, {fl(OKC['dayRate']['rate'])},"
      f" {fl(OKC['reimbursable']['feeFraction'])}, {int(OKC['iterations'])}, {int(OKC['seed'])})")
w(f'  v_k := {MC};')
route('okigwe_dayrate_mean_cost', ['v_s := v_k[1];'])
route('okigwe_reimbursable_p90_cost', ['v_s := v_k[2];'])
route('okigwe_dayrate_company_pays', ['v_s := v_k[3];'])
w(f"  v_k := pg_temp.sc2_should(v_ok->'program', {fl(OKS['nptFrac'])}, v_ok->'costItems', {fl(OKS['contingencyFrac'])}, v_ok->'partners');")
route('okigwe_should_cost_estimate', ['v_s := v_k[1];'])
route('okigwe_operator_amount', ['v_s := v_k[2];'])
OK_ARGS = tender('v_ok', OKT, 'OKIGWE')
TWK = fl(OKT['technicalWeight'])
w("  select e->>'id' into v_top from jsonb_array_elements(v_ok->'bids') e where e->>'id' = any(v_ids)")
w(f"   order by (pg_temp.sc2_combined(pg_temp.sc2_tech_pct(v_ok->'criteria', e), v_costs[array_position(v_ids, e->>'id')], v_th, v_cmin, {TWK}))[2] desc limit 1;")
route('okigwe_award_ratio', ["v_s := v_costs[array_position(v_ids, v_top)] / v_k[1];"])
w('')

# ------------------------------------------------------------ 3. the oracle
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
w(f"  raise notice 'SC2 go-live: {S} available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',")
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
                 if not l.lstrip().startswith('--') and not re.match(r"\s*v_(on|um|ok) jsonb", l))
bare = re.findall(r'/\s*(?:\d+(?![\d.])|count\([^)]*\)(?!::double precision)|cardinality\([^)]*\)(?!::double precision)|array_length\([^)]*\)(?!::double precision))', code)
if bare:
    refused.append(f'bare integer denominator(s): {bare[:5]}')
odd = [ln for ln, l in enumerate(SQL.splitlines(), 1)
       if not l.lstrip().startswith('--') and l.split('--', 1)[0].count("'") % 2
       and not re.match(r"\s*v_(on|um|ok) jsonb", l)]
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
