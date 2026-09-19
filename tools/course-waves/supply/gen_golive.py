#!/usr/bin/env python3
"""Generate the supply go-live migration.

NOTHING HERE IS RETYPED. The eighteen graded values are read out of the
CAPSTONE ROWS THE LADDER ITSELF SEEDED, by key, inside the same transaction.
They are then checked four ways, and none of the four is a restatement of the
generator that wrote them:

1. AGAINST THE ENGINE. gen_course.py runs `node supply_capstone.mjs --json`
   through the vendored engines when this file is generated (twice, the second
   time under a clock moved 900 days), and refuses if fields.json disagrees with
   that run. The values the go-live compares the seeded rows to are that run's,
   at full precision, so a capstone row left behind by an earlier seed (the
   course migration inserts with `on conflict do nothing`) is refused here by
   name.

2. BY A SECOND ROUTE IN SQL, for every field with a closed form, over the
   capstone records the prompts were rendered from: seventeen of the eighteen.
   Postgres recomputes them in exact numeric with the rules written out in SQL:
   linear interpolation between the two strapping entries either side of a
   height, the water cut through the same table and taken off, the gross times
   the typed VCF, the day closed from yesterday's closing stock with the
   tolerance on receipts plus deliveries; Erlang C by the FACTORIAL form (the
   engine builds it from the Erlang B recursion, so this is a different
   algorithm, not a transcription); pumpable stock tank by tank and cover on
   the liftings; the lane's cycle, its trips, its per-trip costs and its cost
   per litre delivered, and the fleet as a ceiling on the engine's six-decimal
   trips; the cargo quantities at the engine's roundings, C&F, CIF with the
   percent-of-CIF insurance solved in closed form, every landed line on its own
   basis, the total, the cost per outturn litre in naira at four decimals; and
   the pump build-up walked element by element from that landed cost, with the
   Government lines summed. Each must lie within the field's own tolerance of
   the seeded value: that is the grader's own test, so the second route's
   answer, typed by a learner, would be graded right. It is an oracle in a
   second language, and the dry run is what proves it agrees.

   THE ONE FIELD WITHOUT A SQL ROUTE is the exchange rate at which the pump
   price meets the cap: the engine finds it by bisection over the whole chain
   re-priced at each rate, with the landed cost rounded to four decimals at
   every step. Its second route is the ORACLE's closed form (below), which
   solves it by linearity on the oracle's own invoice() and pump().

   AND THE RECORDS IT READS ARE THE RECORDS THE LEARNER READS. Each shipped
   prompt must equal capstone.json's prompt byte for byte, and gen_course.py
   refuses unless supply_capstone.mjs renders exactly that prompt from the same
   record objects that are embedded below.

3. BY THE ORACLE, for all eighteen. oracle_check.py's exact run (the vendored
   stdlib Python oracles oracle_terminaldepot.py and oracle_fuelpricing.py,
   written from the rules and not from the JavaScript, in exact rationals where
   they can be) is written in here by value when this file is generated, and
   each seeded value must lie within its tolerance of the oracle's.

4. BY THE TRAPS THE COURSE IS BUILT ON, which must BITE. For every one of the
   eighteen fields, the wrong route discriminate.mjs swept through the ENGINE
   that lands CLOSEST to the graded value is written in by value, and the seeded
   value must lie outside the field's tolerance of it.

WHAT IT REFUSES TO WRITE: a refusal that reads a graded value and does not name
it; a division with a bare integer denominator; an unclosed literal; an em or
en dash; a go-live whose engine run and fields.json disagree; an oracle or a
trap the generator's own check finds on the wrong side of a tolerance.

Usage: python3 gen_golive.py
   TDS_WAVE        the wave directory (default /root/md-wip-supply)
   TDS_REPO        the nextgen clone   (default /root/wt-md-supply-nextgen)
   TDS_ENGINES     packages/engines to run the capstone through
   TDS_COURSE_SQL  the course migration this ladder emits, for the prompt checks
   TDS_GOLIVE_OUT  where to write
"""
import json
import os
import re
import subprocess
import sys

W = os.environ.get('TDS_WAVE', '/root/md-wip-supply')
REPO = os.environ.get('TDS_REPO', '/root/wt-md-supply-nextgen')
COURSE = os.environ.get('TDS_COURSE_SQL', f'{REPO}/migrations/20261012_tds_supply_course.sql')
OUT = os.environ.get('TDS_GOLIVE_OUT', f'{REPO}/migrations/20261012_tds_supply_go_live.sql')

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ['TDS_WAVE'] = W
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
assert len(set(KEYS)) == 18, 'two graded fields share a key'
refused = list(GC.bad)

# The course migration this ladder ships must carry the prompts verbatim.
course_sql = open(COURSE, encoding='utf-8').read()
for t in GC.TIERS:
    if GC.q(GC.PROMPTS[t]) not in course_sql:
        refused.append(f'the course migration at {COURSE} does not carry the {t} prompt of capstone.json')

# ------------------------------------------ the oracle and the wrong routes
ORACLE = json.loads(GC.run(['python3', os.path.join(W, 'oracle_check.py'), '--json'], what='oracle_check.py --json'))
WRONG = json.loads(GC.run(['node', os.path.join(W, 'discriminate.mjs'), '--json'], what='discriminate.mjs --json'))
if set(ORACLE) != set(KEYS):
    refused.append(f'the oracle computes {sorted(ORACLE)} and fields.json grades {KEYS}')
if set(WRONG) != set(KEYS):
    refused.append('discriminate.mjs sweeps a different set of fields from fields.json')
TRAPS = {}
for k in KEYS:
    o = ORACLE.get(k, {}).get('value')
    if o is None or abs(o - F[k]) > TOL[k]:
        refused.append(f'{k}: the oracle gives {o!r}, not within {TOL[k]} of the engine\'s {F[k]!r}')
    w = WRONG.get(k)
    if not w:
        continue
    if w['truth'] != F[k]:
        refused.append(f'{k}: discriminate.mjs computes {w["truth"]!r} and fields.json carries {F[k]!r}')
    name_, val = min(w['routes'].items(), key=lambda kv: abs(kv[1] - F[k]))
    if abs(val - F[k]) <= TOL[k]:
        refused.append(f'{k}: the closest wrong route {name_} lands inside the tolerance')
    TRAPS[k] = (name_, val)


def lit(s):
    return "'" + s.replace("'", "''") + "'"


def jlit(obj):
    return lit(json.dumps(obj, ensure_ascii=False, separators=(',', ':'))) + '::jsonb'


def num(x):
    return GC.num_lit(x) if isinstance(x, int) else repr(float(x))


V = {k: f'v_g_{k}' for k in KEYS}


def name(*keys):
    """The graded fields a refusal reads, spelled tier/key."""
    for k in keys:
        assert k in V, k
    return ' [graded field: ' + ', '.join(f'{TIER_OF[k]}/{k}' for k in keys) + ']'


GL = 'supply go-live refused'

# ---------------------------------------------------------------------------
# THE SQL
# ---------------------------------------------------------------------------
HEADER = f"""-- ============================================================================
-- supply GO-LIVE (HELD): Terminals, Depots & Fuel Supply flips to 'available',
-- the first course of the Supply Chain & Logistics module, at path_order 50.
--
-- DEPLOY GATE, TWO UPLOADS. Do NOT run this until BOTH are live:
--   1. a NextGen production upload that carries the route /dashboard/apps/supply.
--      The 78 lessons, the teaching lab and its three explorer panels (tank,
--      depot and price) ship in the ZIP and NOT in this database, so a flip
--      before the upload puts a live catalogue tile in front of a route that
--      does not exist;
--   2. the Suite production upload carrying Suite main 1a71d9c90 (Suite #540,
--      fix/md3-0-supply-apps: the Terminal & Depot page repairs this course
--      teaches, an opening stock input so a day's reconciliation can show a
--      gap, days of cover on liftings and only a loss counted to air, with the
--      engines at 13f0936 that page and the Fuel Pricing page run on). Until
--      it is uploaded the live Terminal & Depot page a learner opens beside the
--      course still takes the opening stock from today's own dip, so every day
--      balances: the trap the course teaches.
-- This file is written, dry-run and left unapplied on purpose.
--
-- EVERY GRADED VALUE IS CHECKED FOUR WAYS, and none restates the generator:
--
--   1. against the ENGINE, run through the vendored engines when this file was
--      generated (supply_capstone.mjs --json, twice, the second time under a
--      clock moved 900 days), so a capstone row an earlier seed left behind is
--      refused by name;
--   2. by a SECOND ROUTE IN SQL over the capstone records the prompts were
--      rendered from, for the seventeen fields with a closed form. The go-live
--      first proves each shipped prompt is the rendered one byte for byte.
--      Route per field:
--        SQL closed form  okomu_t1_gross_m3, okomu_t1_standard_m3,
--                         okomu_t2_standard_m3, okomu_expected_closing_m3,
--                         okomu_unaccounted_m3, okomu_tolerance_m3,
--                         ogwashi_rack_probability_of_waiting and
--                         ogwashi_rack_mean_wait_min (Erlang C by the factorial
--                         form, not the engine's recursion),
--                         ogwashi_pumpable_stock_m3, ogwashi_days_of_cover,
--                         ogwashi_cost_per_litre_delivered_ngn,
--                         ogwashi_trucks_required, oron_cif_usd,
--                         oron_landed_total_usd, oron_landed_per_litre_ngn,
--                         oron_pump_price_ngn, oron_government_share_ngn;
--        the ORACLE       oron_breakeven_fx, which the engine finds by bisection
--                         over the whole chain re-priced at each rate, so it is
--                         not re-solved here: its second route is the oracle's
--                         closed form by linearity (route 3);
--   3. by the ORACLE for all eighteen: oracle_check.py's run of the vendored
--      Python oracles (oracle_terminaldepot.py, oracle_fuelpricing.py, exact
--      rationals where they can be), written in by value;
--   4. by the TRAPS the course is built on, one for every field: the wrong
--      route discriminate.mjs swept through the engine that lands closest to
--      the graded value, which must lie outside the field's tolerance.
-- Routes 2 and 3 must each lie within the field's own tolerance of the seeded
-- value, which is the grader's own test.
--
-- NO DATE. Neither engine reads a clock or a date, and nothing here does:
-- this file gives the same verdict on whatever day it is run.
--
-- THE GRADER IS NUMERIC. academy_submit_capstone casts expected, tol and the
-- answer to numeric. Every field must carry a numeric expected value at the
-- tolerance precision.json gives its class (one unit in the last place the
-- prompt asks for, 0.5 for the one whole number, which must be whole), with a
-- label and a unit, and all of it is asserted here, on the rows as seeded.
--
-- EVERY REFUSAL THAT READS A GRADED VALUE NAMES IT as tier/key.
-- ============================================================================"""

B = []
A = B.append

A('do $$')
A('declare')
A('  v_structures int; v_questions int; v_capstones int; v_lessons int;')
A('  v_modules int; v_graded int; v_available int; v_soon int; v_n int;')
A('  v_names text; v_prompt text; v_worst numeric := 0; v_worst_key text := \'(none)\';')
A('  v_e jsonb; v_amt numeric; v_rate numeric; v_basis text; v_sum_cif numeric;')
A('  v_a numeric; v_c int; v_mu numeric; v_s numeric; v_t numeric; v_k int;')
A('  v_cycle numeric; v_trips_day numeric; v_trips_year numeric; v_cost numeric; v_deliv numeric;')
A('  v_m3 numeric; v_q_m3 numeric; v_q_l numeric; v_q_t numeric; v_fob numeric; v_cf numeric; v_cif numeric;')
A('  v_run numeric; v_outturn numeric; v_landed numeric; v_line numeric; v_gov numeric;')
for k in KEYS:
    A(f'  {V[k]} numeric; v_s_{k} numeric;')
for rname, rec in REC.items():
    A(f'  v_{rname.lower()} jsonb := {jlit(rec)};')
A(f'  v_tol_of jsonb := {jlit({k: TOL[k] for k in KEYS})};')
A('begin')

A(f'''
  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures
   where app_slug = '{SLUG}' and active;
  if v_structures <> 3 then
    raise exception '{GL}: {SLUG} has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions from public.academy_quiz_questions where app_slug = '{SLUG}';
  if v_questions <> 396 then
    raise exception '{GL}: {SLUG} has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_n from (
    select tier from public.academy_quiz_questions where app_slug = '{SLUG}'
     group by tier having count(*) <> 132) t;
  if v_n <> 0 then
    raise exception '{GL}: % tier(s) do not carry exactly 132 questions', v_n;
  end if;

  select count(*) into v_n from (
    select tier, module_key from public.academy_quiz_questions
     where app_slug = '{SLUG}' and scope = 'module'
     group by tier, module_key having count(*) <> 15) t;
  if v_n <> 0 then
    raise exception '{GL}: % module bank(s) do not carry exactly 15 questions', v_n;
  end if;

  select count(*) into v_n from (
    select tier from public.academy_quiz_questions
     where app_slug = '{SLUG}' and scope = 'final'
     group by tier having count(*) <> 42) t;
  if v_n <> 0 then
    raise exception '{GL}: % final exam(s) do not carry exactly 42 questions', v_n;
  end if;

  -- A key outside its own options is unanswerable, and a count of rows cannot
  -- see it.
  select count(*) into v_n from public.academy_quiz_questions
   where app_slug = '{SLUG}'
     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);
  if v_n <> 0 then
    raise exception '{GL}: % question(s) do not offer four options with a key inside them', v_n;
  end if;

  select count(*) into v_lessons
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m,
         lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = '{SLUG}' and s.active;
  if v_lessons <> 78 then
    raise exception '{GL}: {SLUG} carries % lesson keys, expected 78', v_lessons;
  end if;

  select count(*) into v_modules
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = '{SLUG}' and s.active;
  if v_modules <> 18 then
    raise exception '{GL}: {SLUG} carries % modules, expected 18 (six per tier)', v_modules;
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
    raise exception '{GL}: % module bank(s) are keyed to a module the structure does not declare', v_n;
  end if;

  select count(*) into v_capstones from public.academy_capstones where app_slug = '{SLUG}';
  if v_capstones <> 3 then
    raise exception '{GL}: {SLUG} has % capstones, expected 3', v_capstones;
  end if;

  select count(*) into v_graded from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f where c.app_slug = '{SLUG}';
  if v_graded <> 18 then
    raise exception '{GL}: {SLUG} has % graded capstone fields, expected 18', v_graded;
  end if;

  select count(*) into v_n from (
    select c.tier from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug = '{SLUG}' group by c.tier having count(*) <> 6) t;
  if v_n <> 0 then
    raise exception '{GL}: % tier(s) do not grade exactly six fields', v_n;
  end if;

  -- ------------------------------------------------------------ catalogue
  if not exists (select 1 from public.academy_apps
                  where slug = '{SLUG}' and module = '{MODULE}'
                    and path_order = {PATH_ORDER} and prereq_slug is null) then
    raise exception '{GL}: the {SLUG} catalogue row is not {MODULE} at path_order {PATH_ORDER} with no prerequisite';
  end if;

  if exists (select 1 from public.academy_apps where path_order = {PATH_ORDER} and slug <> '{SLUG}') then
    raise exception '{GL}: another course already holds path_order {PATH_ORDER}';
  end if;
''')
for sslug, sorder in GC.SIBLINGS:
    A(f'''  if exists (select 1 from public.academy_apps where path_order = {sorder} and slug <> '{sslug}') then
    raise exception '{GL}: path_order {sorder}, the slot of the wave sibling {sslug}, is held by another course';
  end if;''')

A(f'''
  -- ------------------------------------------------- the grader is numeric
  -- Exactly the eighteen keys, each a number at the tolerance precision.json
  -- gives its class, with a label and a unit; the one field graded at 0.5 is
  -- a whole number.
  select count(*), string_agg(c.tier || '/' || coalesce(f->>'key', '(no key)'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = '{SLUG}'
     and (jsonb_typeof(f->'expected') is distinct from 'number' or jsonb_typeof(f->'tol') is distinct from 'number'
          or not (v_tol_of ? coalesce(f->>'key', ''))
          or (f->>'tol')::numeric <> (v_tol_of->>(f->>'key'))::numeric
          or ((f->>'tol')::numeric = 0.5 and (f->>'expected')::numeric <> round((f->>'expected')::numeric))
          or coalesce(f->>'label', '') = '' or coalesce(f->>'unit', '') = '');
  if v_n <> 0 then
    raise exception '{GL}: % graded field(s) are not a number at their precision.json tolerance with a label and a unit: %', v_n, v_names;
  end if;

  select count(distinct f->>'key') into v_n
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = '{SLUG}';
  if v_n <> 18 then
    raise exception '{GL}: the capstones grade % distinct keys, expected the 18 precision.json classifies', v_n;
  end if;
''')

# ------------------------------------------------------------ the prompts
A('\n  -- ---------------------------------------- the prompts the learner reads')
A("  -- Each shipped prompt is capstone.json's, byte for byte, which")
A('  -- supply_capstone.mjs rendered from the records the second route reads.')
for tier in GC.TIERS:
    A(f'''  select prompt into v_prompt from public.academy_capstones where app_slug = '{SLUG}' and tier = '{tier}';
  if v_prompt is distinct from {lit(GC.PROMPTS[tier])} then
    raise exception '{GL}: the {tier} prompt is not the prompt capstone.json carries, so the second route may be reading records the learner never saw';
  end if;''')

# ------------------------------------------------ load the eighteen values
A('\n  -- --------------------------------------- the eighteen graded values')
for k in KEYS:
    A(f"""  select (f->>'expected')::numeric into {V[k]}
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = '{SLUG}' and c.tier = '{TIER_OF[k]}' and f->>'key' = '{k}';""")
A('  if ' + '\n     or '.join(f'{V[k]} is null' for k in KEYS) + ' then')
A(f"    raise exception '{GL}: one or more of the eighteen graded fields is missing';")
A('  end if;')

# --------------------------------------------------------- the leak sweep
SQLNUM = GC.SQLNUM_SRC  # standard_conforming_strings: a backslash in a literal is itself
TEXT = ("p.prompt || ' ' || p.dataset || ' ' || p.title || ' ' || "
        "coalesce((select string_agg(x->>'label', ' ') from jsonb_array_elements(p.fields) x), '')")
SIG = "length(ltrim(replace(replace(m[1], '-', ''), '.', ''), '0'))"
DEC = "(case when strpos(m[1], '.') > 0 then length(split_part(m[1], '.', 2)) else 0 end)"
DERIVED = GC.DERIVED
A(f'''
  -- LEAKS (gate_promptleak.py in SQL). No graded value of any tier is a number
  -- token in any prompt, dataset, title or label: not within its tolerance, and
  -- not as its own rounding at two or more significant figures. None of the
  -- {len(DERIVED)} engine-derived intermediates on the way to a graded field is
  -- printed as its own rounding at three or more.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key') || ' in the ' || p.tier || ' capstone as ' || m[1], ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         public.academy_capstones p,
         lateral regexp_matches({TEXT}, '{SQLNUM}', 'g') as m
   where c.app_slug = '{SLUG}' and p.app_slug = '{SLUG}'
     and (abs(abs((m[1])::numeric) - abs((f->>'expected')::numeric)) <= (f->>'tol')::numeric
          or ({SIG} >= 2
              and abs(abs((m[1])::numeric) - abs((f->>'expected')::numeric)) <= 0.5 * power(10::numeric, -{DEC}) + 1e-12));
  if v_n <> 0 then
    raise exception '{GL}: % graded field(s) are printed in a capstone a learner reads: %', v_n, v_names;
  end if;

  select count(*), string_agg(distinct d.k || ' in the ' || p.tier || ' capstone as ' || m[1], ', ')
    into v_n, v_names
    from public.academy_capstones p,
         lateral regexp_matches({TEXT}, '{SQLNUM}', 'g') as m,
         jsonb_each_text({jlit(DERIVED)}) d(k, v)
   where p.app_slug = '{SLUG}'
     and {SIG} >= 3
     and abs(abs((m[1])::numeric) - abs(d.v::numeric)) <= 0.5 * power(10::numeric, -{DEC}) + 1e-12;
  if v_n <> 0 then
    raise exception '{GL}: % engine-derived intermediate(s) are printed in a capstone a learner reads: %', v_n, v_names;
  end if;

  -- The sweep must be able to fire: Postgres must read exactly the number
  -- tokens gen_course.py read out of the same three prompts ({GC.sql_tokens}), or
  -- the regex above is reading something else and its 0 means nothing.
  select count(*) into v_n
    from public.academy_capstones p,
         lateral regexp_matches(p.prompt, '{SQLNUM}', 'g') as m
   where p.app_slug = '{SLUG}';
  if v_n <> {GC.sql_tokens} then
    raise exception '{GL}: the prompt sweep read % number tokens, and gen_course.py read {GC.sql_tokens} from the same prompts', v_n;
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
    raise exception '{GL}: % pair(s) of graded fields are within the looser of their two tolerances: %', v_n, v_names;
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
if len(DIGEST_NUMS) < 200:
    refused.append(f'the digest sweep read {len(DIGEST_NUMS)} numbers, so it is reading the wrong thing')


def dlit(x):
    return str(int(x)) if float(x).is_integer() else repr(x)


A(f'''
  -- ------------------------------------------------------- the digest sweep
  -- No graded value is within its tolerance of the absolute value of ANY number
  -- token the teaching digest prints ({len(DIGEST_NUMS)} distinct values, read by
  -- the regex -?[0-9]+[.]?[0-9]*): a graded field that is a figure the digest
  -- prints is a lookup rather than a calculation.
  select count(*), string_agg(c.tier || '/' || (f->>'key') || ' = ' || (f->>'expected'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = '{SLUG}'
     and exists (select 1 from unnest(array[{', '.join(dlit(x) for x in DIGEST_NUMS)}]::numeric[]) d
                  where abs(abs((f->>'expected')::numeric) - d) <= (f->>'tol')::numeric);
  if v_n <> 0 then
    raise exception '{GL}: % graded field(s) are within tolerance of a number the digest prints: %', v_n, v_names;
  end if;
''')

# ------------------------------------------------------- 1. the engine
A('\n  -- ---------------------------------------------------- 1. against the engine')
A('  -- The seeded value is the engine\'s return at full precision, exactly.')
for k in KEYS:
    A(f'''  if {V[k]} <> {num(ENGINE[k])} then
    raise exception '{GL}: the seeded value % is not the {num(ENGINE[k])} the engine returned through supply_capstone.mjs{name(k)}', {V[k]};
  end if;''')


# ------------------------------------------------ 2. the second route in SQL
def n(rec, key):
    return f"(v_{rec.lower()}->>{lit(key)})::numeric"


def interp(table, h):
    """Linear interpolation between the strapping entries either side of h."""
    row = ("(select (e->>'heightMm')::numeric h, (e->>'volumeM3')::numeric v"
           f" from jsonb_array_elements(v_{table.lower()}) e where (e->>'heightMm')::numeric {{op}} {h}"
           " order by 1 {dir} limit 1)")
    return (f"(select case when hi.h = lo.h then lo.v else lo.v + ({h} - lo.h) * (hi.v - lo.v) / (hi.h - lo.h) end"
            f" from {row.format(op='<=', dir='desc')} lo, {row.format(op='>=', dir='asc')} hi)")


def gross(tank, table):
    return f"({interp(table, n(tank, 'dipMm'))} - {interp(table, n(tank, 'waterMm'))})"


STD1 = f"({gross('OKOMU_T1', 'OKOMU_T1_TABLE')} * {n('OKOMU_T1', 'vcfTyped')})"
STD2 = f"({gross('OKOMU_T2', 'OKOMU_T2_TABLE')} * {n('OKOMU_T2', 'vcfTyped')})"
EXPECTED = (f"({n('OKOMU_DAY', 'openingM3')} + {n('OKOMU_DAY', 'receiptsM3')} - {n('OKOMU_DAY', 'deliveriesM3')}"
            f" - {n('OKOMU_DAY', 'knownLossM3')})")
LANE = lambda key: n('OGWASHI_LANE', key)  # noqa: E731
CARGO = lambda key: n('ORON_CARGO', key)  # noqa: E731

if REC['ORON_CARGO']['quantityUnit'] != 'tonne' or REC['ORON_CARGO']['fobBasis'] != 'per_tonne':
    refused.append('the SQL route reads the ORON cargo in tonnes with FOB per tonne, and the record says otherwise')
if REC['ORON_INSURANCE_BASIS'] != 'percent_of_cif':
    refused.append('the SQL route solves insurance on CIF, and the record quotes it otherwise')

AMOUNT = ("(case v_basis when 'per_tonne' then v_rate * v_q_t when 'per_m3' then v_rate * v_q_m3"
          " when 'per_litre' then v_rate * v_q_l when 'per_cargo' then v_rate"
          " when 'percent_of_fob' then v_rate / 100.0 * v_fob when 'percent_of_cf' then v_rate / 100.0 * v_cf"
          " when 'percent_of_cif' then v_rate / 100.0 * v_cif end)")
BASIS = ("(case when v_e->>'id' = 'insurance' then v_oron_insurance_basis #>> '{}' else v_e->>'basis' end)")
RATE = "(v_oron_rates->>(v_e->>'id'))::numeric"

A(f'''
  -- ----------------------------------------------- 2. the second route in SQL
  -- ASSOCIATE, OKOMU. A height is read between the two strapping entries either
  -- side of it, linearly; the water cut is read through the same table and
  -- taken off; the gross times the VCF typed off the depot's own tables is the
  -- standard volume. The day closes from yesterday's closing stock: expected =
  -- opening + receipts - deliveries - known losses; the closing dip is the two
  -- standard volumes together; unaccounted = dipped - expected; the tolerance
  -- is the stated percent of receipts plus deliveries.
  v_s_okomu_t1_gross_m3 := {gross('OKOMU_T1', 'OKOMU_T1_TABLE')};
  v_s_okomu_t1_standard_m3 := {STD1};
  v_s_okomu_t2_standard_m3 := {STD2};
  v_s_okomu_expected_closing_m3 := {EXPECTED};
  v_s_okomu_unaccounted_m3 := ({STD1} + {STD2}) - {EXPECTED};
  v_s_okomu_tolerance_m3 := ({n('OKOMU_DAY', 'receiptsM3')} + {n('OKOMU_DAY', 'deliveriesM3')})
                            * abs({n('OKOMU_DAY', 'tolerancePercentOfThroughput')}) / 100.0;

  -- PROFESSIONAL, OGWASHI. Erlang C by the FACTORIAL form, a different algorithm
  -- from the engine's Erlang B recursion: offered load A = lambda / mu, with
  -- mu = 60 / load minutes a bay an hour; P(wait) = [A^c / c! * c / (c - A)] /
  -- [sum over k < c of A^k / k! + A^c / c! * c / (c - A)]; the mean wait is
  -- P(wait) / (c mu - lambda) hours, in minutes.
  v_mu := 60.0 / {n('OGWASHI_RACK', 'loadMinutes')};
  v_a := {n('OGWASHI_RACK', 'arrivalsPerHour')} / v_mu;
  v_c := ({n('OGWASHI_RACK', 'bays')})::int;
  v_s := 0;
  for v_k in 0 .. v_c - 1 loop
    v_s := v_s + power(v_a, v_k) / factorial(v_k);
  end loop;
  v_t := power(v_a, v_c) / factorial(v_c) * v_c / (v_c - v_a);
  v_s_ogwashi_rack_probability_of_waiting := v_t / (v_s + v_t);
  v_s_ogwashi_rack_mean_wait_min := v_s_ogwashi_rack_probability_of_waiting
                                    / (v_c * v_mu - {n('OGWASHI_RACK', 'arrivalsPerHour')}) * 60.0;

  -- Pumpable stock is tank by tank: a tank below its heel lends nothing to
  -- another. Days of cover are that stock over the LIFTINGS.
  select sum(greatest(0, (t->>'stockM3')::numeric - (t->>'heelM3')::numeric))
    into v_s_ogwashi_pumpable_stock_m3 from jsonb_array_elements(v_ogwashi_tanks) t;
  v_s_ogwashi_days_of_cover := v_s_ogwashi_pumpable_stock_m3 / (v_ogwashi_liftings_m3 #>> '{{}}')::numeric;

  -- The lane. The cycle is the round trip at the average speed plus loading,
  -- discharge and queueing; the trips a truck makes a day are the working hours
  -- over the cycle; depreciation is spread over the trips a year the cycle
  -- gives; the trip costs diesel on the round trip, the driver, maintenance and
  -- tyres on the round trip, tolls and levies, overhead and depreciation; the
  -- litres delivered are the payload less the transit loss; the engine rounds
  -- the cost per litre to six decimals and the trips a day to six, and the fleet
  -- is the ceiling of the trips needed over those trips.
  v_cycle := 2 * {LANE('distanceKm')} / {LANE('averageSpeedKmh')} + {LANE('loadHours')} + {LANE('dischargeHours')} + {LANE('queueHours')};
  v_trips_day := {LANE('workingHoursPerDay')} / v_cycle;
  v_trips_year := v_trips_day * {LANE('workingDaysPerYear')};
  v_cost := {LANE('fuelConsumptionLPer100Km')} / 100.0 * 2 * {LANE('distanceKm')} * {LANE('dieselPricePerLitre')}
            + {LANE('driverCostPerTrip')}
            + ({LANE('maintenancePerKm')} + {LANE('tyresPerKm')}) * 2 * {LANE('distanceKm')}
            + {LANE('tollsAndLeviesPerTrip')} + {LANE('overheadPerTrip')}
            + {LANE('truckCapitalCost')} / ({LANE('truckLifeYears')} * v_trips_year);
  v_deliv := {LANE('payloadLitres')} * (1 - {LANE('transitLossPercent')} / 100.0);
  v_s_ogwashi_cost_per_litre_delivered_ngn := round(v_cost / v_deliv, 6);
  v_s_ogwashi_trucks_required := ceil(((v_ogwashi_demand_l_per_day #>> '{{}}')::numeric / {LANE('payloadLitres')}) / round(v_trips_day, 6));

  -- EXPERT, ORON. The cargo every way at the engine's roundings (m3 to four,
  -- litres to two, tonnes to four); FOB on the tonnes; freight builds C&F;
  -- insurance quoted on CIF is part of the value it is charged on, so CIF =
  -- C&F / (1 - the CIF rates); every landed line on its own basis, the
  -- percent-of-CIF lines on that CIF; the cost per litre sold is the total over
  -- the OUTTURN litres (the bill of lading less the ocean loss), in naira at the
  -- exchange rate, to four decimals as the app carries it.
  v_m3 := {CARGO('quantity')} * 1000.0 / {CARGO('densityKgM3')};
  v_q_m3 := round(v_m3, 4);
  v_q_l := round(v_m3 * 1000, 2);
  v_q_t := round(v_m3 * {CARGO('densityKgM3')} / 1000.0, 4);
  v_fob := {CARGO('fobPrice')} * v_q_t;
  v_cf := v_fob; v_cif := v_fob; v_run := v_fob;
  for v_e in select e from jsonb_array_elements(v_import_template) e where e->>'stage' = 'freight' loop
    v_basis := {BASIS}; v_rate := {RATE};
    v_run := v_run + {AMOUNT};
  end loop;
  v_cf := v_run; v_cif := v_run;
  v_sum_cif := 0;
  for v_e in select e from jsonb_array_elements(v_import_template) e where e->>'stage' = 'insurance' loop
    v_basis := {BASIS}; v_rate := {RATE};
    if v_basis = 'percent_of_cif' then
      v_sum_cif := v_sum_cif + v_rate / 100.0;
    else
      v_run := v_run + {AMOUNT};
    end if;
  end loop;
  v_run := v_run / (1 - v_sum_cif);
  v_cif := v_run;
  for v_e in select e from jsonb_array_elements(v_import_template) e where coalesce(e->>'stage', 'landed') = 'landed' loop
    v_basis := {BASIS}; v_rate := {RATE};
    v_run := v_run + {AMOUNT};
  end loop;
  v_s_oron_cif_usd := v_cif;
  v_s_oron_landed_total_usd := v_run;
  v_outturn := v_q_l * (1 - {CARGO('oceanLossPercent')} / 100.0);
  v_landed := round(v_run / v_outturn * {CARGO('fxRate')}, 4);
  v_s_oron_landed_per_litre_ngn := v_landed;

  -- The pump build-up starts from that landed cost per litre and adds each
  -- element in order: a per-litre element as it stands, a percent-of-running
  -- element on everything below it. The engine rounds each line to four
  -- decimals and the price to four, and the Government share is the sum of the
  -- rounded Government lines.
  v_run := v_landed; v_gov := 0;
  for v_e in select e from jsonb_array_elements(v_pump_template) e loop
    v_rate := (v_oron_elements->>(v_e->>'id'))::numeric;
    v_line := case v_e->>'basis' when 'percent_of_running' then v_rate / 100.0 * v_run
                                 when 'percent_of_landed' then v_rate / 100.0 * v_landed
                                 else v_rate end;
    v_run := v_run + v_line;
    if v_e->>'recipient' = 'Government' then v_gov := v_gov + round(v_line, 4); end if;
  end loop;
  v_s_oron_pump_price_ngn := round(v_run, 4);
  v_s_oron_government_share_ngn := round(v_gov, 4);
''')
SQL_ROUTE = [k for k in KEYS if k != 'oron_breakeven_fx']
for k in SQL_ROUTE:
    assert f'v_s_{k} :=' in '\n'.join(B) or f'into v_s_{k}' in '\n'.join(B), f'no SQL route for {k}'
for k in SQL_ROUTE:
    A(f'''  if v_s_{k} is null or abs(v_s_{k} - {V[k]}) > {num(TOL[k])} then
    raise exception 'supply go-live refused: the second route in SQL gives % over the capstone records, not within {num(TOL[k])} of the seeded %{name(k)}', v_s_{k}, {V[k]};
  end if;
  if abs(v_s_{k} - {V[k]}) / {num(TOL[k])} > v_worst then
    v_worst := abs(v_s_{k} - {V[k]}) / {num(TOL[k])}; v_worst_key := '{TIER_OF[k]}/{k}';
  end if;''')
A("  raise notice 'supply go-live: second route in SQL, 17 fields, largest disagreement % of a tolerance (%)', round(v_worst, 6), v_worst_key;")

# ------------------------------------------------------- 3. the oracle
A('\n  -- ---------------------------------------------------- 3. against the oracle')
A('  -- oracle_check.py --json, run when this file was generated. The value and the')
A('  -- oracle function it came from are written in; oron_breakeven_fx has no')
A('  -- other second route.')
A("  v_worst := 0; v_worst_key := '(none)';")
for k in KEYS:
    o = ORACLE[k]
    A(f'''  -- {k}: {o['method']}
  if abs({num(o['value'])} - {V[k]}) > {num(TOL[k])} then
    raise exception 'supply go-live refused: the oracle gives {num(o['value'])}, not within {num(TOL[k])} of the seeded %{name(k)}', {V[k]};
  end if;
  if abs({num(o['value'])} - {V[k]}) / {num(TOL[k])} > v_worst then
    v_worst := abs({num(o['value'])} - {V[k]}) / {num(TOL[k])}; v_worst_key := '{TIER_OF[k]}/{k}';
  end if;''')
A("  raise notice 'supply go-live: the oracle, 18 fields, largest disagreement % of a tolerance (%)', round(v_worst, 6), v_worst_key;")

# ------------------------------------------------------ 4. the traps bite
A('\n  -- ------------------------------------------------- 4. the traps bite')
A('  -- Each is the wrong route discriminate.mjs swept through the engine that')
A('  -- lands CLOSEST to the graded value. It must lie outside the tolerance, or')
A('  -- the field does not discriminate the trap it is for.')
for k in KEYS:
    rname, val = TRAPS[k]
    why = rname.replace('_', ' ')
    A(f'''  if abs({num(val)} - {V[k]}) <= {num(TOL[k])} then
    raise exception 'supply go-live refused: the trap ({why}) reads {num(val)}, inside the tolerance of the seeded %, so the field does not discriminate the trap{name(k)}', {V[k]};
  end if;''')

A(f'''
  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = '{SLUG}';
  if not exists (select 1 from public.academy_apps where slug = '{SLUG}' and status = 'available') then
    raise exception '{GL}: {SLUG} did not reach status available';
  end if;

  select count(*) filter (where status = 'available'), count(*) filter (where status = 'coming_soon')
    into v_available, v_soon
    from public.academy_apps;

  raise notice 'supply go-live: {SLUG} available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
    v_lessons, v_questions, v_capstones, v_graded, v_available, v_soon;
end $$;''')

sql = HEADER + '\n\n' + '\n'.join(B) + '\n'

# ----------------------------------------------------------- self checks
named = set(re.findall(r'\[graded field: ([^\]]*)\]', sql))
named = {x.strip() for nm in named for x in nm.split(',')}
unnamed = [f'{TIER_OF[k]}/{k} is graded and no refusal names it' for k in KEYS
           if f'{TIER_OF[k]}/{k}' not in named]
# Every raise that reads a v_g_ or v_s_ variable must name the field.
for m in re.finditer(r"raise exception '((?:[^']|'')*)'([^;]*);", sql):
    reads = set(re.findall(r'v_[gs]_(\w+)', m.group(2)))
    for r in reads:
        if f'/{r}' not in m.group(1):
            unnamed.append(f'a refusal reads {r} and does not name it: {m.group(1)[:70]}')
code = '\n'.join(l.split('--', 1)[0] if not l.lstrip().startswith('--') else '' for l in sql.splitlines())
intdiv = [l.strip()[:90] for l in code.splitlines() if re.search(r'/\s*\d+(?![\d.eE])', l)]
unclosed = code.replace("''", '').count("'") % 2
dashes = len(re.findall('[–—]', sql))
if len(TRAPS) != 18:
    refused.append('the traps do not cover all eighteen fields')

if refused or unnamed or intdiv or unclosed or dashes:
    print('REFUSED, nothing written:')
    for b in refused + unnamed + intdiv:
        print('  ', b)
    print('unclosed literal:', bool(unclosed), '| en/em dashes:', dashes)
    sys.exit(1)

open(OUT, 'w').write(sql)
print(f'wrote {OUT}: {len(sql.splitlines())} lines')
print('engine: 18 of 18 fields.json values equal supply_capstone.mjs --json through the vendored engines')
print(f'second route in SQL: {len(SQL_ROUTE)} closed-form fields; oron_breakeven_fx by the oracle')
worst = max(KEYS, key=lambda k: abs(ORACLE[k]['value'] - F[k]) / TOL[k])
print(f'oracle: 18 of 18 within tolerance at generation; largest {abs(ORACLE[worst]["value"] - F[worst]) / TOL[worst]:.4f} '
      f'of a tolerance ({worst})')
closest = min(KEYS, key=lambda k: abs(TRAPS[k][1] - F[k]) / TOL[k])
print(f'traps that must bite: {len(TRAPS)}, the closest {closest} by {TRAPS[closest][0]}, '
      f'{abs(TRAPS[closest][1] - F[closest]) / TOL[closest]:.1f} tolerances out')
print(f'digest sweep: {len(DIGEST_NUMS)} distinct numbers | intermediates: {len(DERIVED)} | prompt tokens: {GC.sql_tokens}')
print(f'graded fields named by at least one refusal: {len(named & {f"{TIER_OF[k]}/{k}" for k in KEYS})} of 18')
print('integer-division guard: 0 | unclosed literals: 0 | en/em dashes: 0')
