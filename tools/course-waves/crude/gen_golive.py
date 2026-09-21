#!/usr/bin/env python3
"""Generate the crude go-live migration.

NOTHING HERE IS RETYPED. The eighteen graded values are read out of the
CAPSTONE ROWS THE LADDER ITSELF SEEDED, by key, inside the same transaction.
They are then checked four ways, and none of the four is a restatement of the
generator that wrote them:

1. AGAINST THE ENGINE. gen_course.py runs `node crude_capstone.mjs --json`
   through the vendored engines when this file is generated (twice, the second
   time under a clock moved 900 days), and refuses if fields.json disagrees with
   that run. The values the go-live compares the seeded rows to are that run's,
   at full precision, so a capstone row left behind by an earlier seed (the
   course migration inserts with `on conflict do nothing`) is refused here by
   name.

2. BY A SECOND ROUTE IN SQL, for every field with a closed form, over the
   capstone records the prompts were rendered from: the twelve Associate and
   Professional fields. Postgres recomputes them in exact numeric with the
   rules written out in SQL, by a route that is not the engine's:
     IDAMA  each stream loaded in BARRELS and barrels x SG (never a fraction):
            SG = 141.5 / (API + 131.5); the cargo's SG is its mass over its
            barrels and its API is 141.5 / SG - 131.5; sulfur and vanadium are
            the per-mass properties weighted by barrels x SG; the Abiteye share
            is its barrels x SG over the cargo's; the CII is the mass-weighted
            (saturates + asphaltenes) over the mass-weighted (aromatics +
            resins), with no blended SARA formed; the Opuama kerosene is the
            curve read by linear interpolation at the upper bound less at the
            lower.
     OGBELE each cut yield is EACH CRUDE'S OWN YIELD blended on volume (the
            engine instead cuts the blended curve; the two agree because both
            curves are piecewise linear on the union of the measured
            temperatures, and the dry run is what proves it). T50 is read off
            the blended curve formed at that union of temperatures by linear
            interpolation. Gross = sum of yield / 100 x price over all five
            cuts; losses are that gross times the loss percent; netback = gross
            - losses - processing - freight.
   Each must lie within the field's own tolerance of the seeded value: that is
   the grader's own test, so the second route's answer, typed by a learner,
   would be graded right.

   THE SIX EXPERT FIELDS HAVE NO SQL ROUTE. The least total cost, the two
   recipe volumes and the three values of relief at the margin come from a
   linear programme; re-solving it in SQL would be a third simplex, not a
   check. Their second route is the ORACLE's exact rational solution (route 3):
   oracle_productblending solves ONNE by exact vertex enumeration on physically
   built rows, and finds each relief by exact re-solve with the limit moved
   1e-7 either way. Each seeded relief must lie between the oracle's two
   one-sided quotients (widened by 1e-9 of its size, the LP's relative
   precision), and the two quotients must agree within twice the tolerance,
   which proves the row is not dual degenerate at this optimum.

   AND THE RECORDS IT READS ARE THE RECORDS THE LEARNER READS. Each shipped
   prompt must equal capstone.json's prompt byte for byte, and gen_course.py
   refuses unless crude_capstone.mjs renders exactly that prompt from the same
   record objects that are embedded below.

3. BY THE ORACLE, for all eighteen. oracle_check.py's exact run (the vendored
   stdlib Python oracles oracle_crudeassay.py and oracle_productblending.py,
   written from the rules and not from the JavaScript) is written in here by
   value when this file is generated, and each seeded value must lie within its
   tolerance of the oracle's.

4. BY THE TRAPS THE COURSE IS BUILT ON, which must BITE. For every one of the
   eighteen fields, the wrong route discriminate.mjs swept through the ENGINE
   that lands CLOSEST to the graded value is written in by value, and the seeded
   value must lie outside the field's tolerance of it.

It also asserts that NOTHING HELD IS GRADED (no key, label or unit names
viscosity, Refutas or Watson, and no graded value is within its tolerance of
the engine's held figures on the capstone records) and that the Expert prompt
states the alkylate tank typed as 0 bbl.

WHAT IT REFUSES TO WRITE: a refusal that reads a graded value and does not name
it; a division with a bare integer denominator; an unclosed literal; an em or
en dash; a go-live whose engine run and fields.json disagree; an oracle or a
trap the generator's own check finds on the wrong side of a tolerance.

Usage: python3 gen_golive.py
   CR_WAVE        the wave directory (default /root/md-wip-crude)
   CR_REPO        the nextgen clone   (default /root/wt-md-crude-nextgen)
   CR_ENGINES     packages/engines to run the capstone through
   CR_COURSE_SQL  the course migration this ladder emits, for the prompt checks
   CR_GOLIVE_OUT  where to write
"""
import json
import os
import re
import sys

W = os.environ.get('CR_WAVE', '/root/md-wip-crude')
REPO = os.environ.get('CR_REPO', '/root/wt-md-crude-nextgen')
COURSE = os.environ.get('CR_COURSE_SQL', f'{REPO}/migrations/20261010_cr_crude_course.sql')
OUT = os.environ.get('CR_GOLIVE_OUT', f'{REPO}/migrations/20261010_cr_crude_go_live.sql')

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ['CR_WAVE'] = W
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
RELIEF = [k for k in KEYS if 'relax' in ORACLE.get(k, {})]
if sorted(RELIEF) != sorted(k for k in KEYS if '_relief_' in k) or len(RELIEF) != 3:
    refused.append(f'the oracle gives one-sided quotients for {RELIEF}, and the three relief fields are graded')


def rel_eps(v):
    """The LP's relative precision, 1e-9 of the value's size."""
    return 1e-9 * max(1.0, abs(v))


TRAPS = {}
for k in KEYS:
    o = ORACLE.get(k, {}).get('value')
    if o is None or abs(o - F[k]) > TOL[k]:
        refused.append(f'{k}: the oracle gives {o!r}, not within {TOL[k]} of the engine\'s {F[k]!r}')
    if k in RELIEF:
        lo, hi = sorted((ORACLE[k]['relax'], ORACLE[k]['tighten']))
        if not (lo - rel_eps(F[k]) <= F[k] <= hi + rel_eps(F[k])):
            refused.append(f'{k}: the engine\'s {F[k]!r} is not between the oracle\'s quotients {lo!r} and {hi!r}')
        if hi - lo > 2 * TOL[k]:
            refused.append(f'{k}: the oracle\'s two quotients differ by {hi - lo}, more than twice the tolerance')
    w = WRONG.get(k)
    if not w:
        continue
    if w['truth'] != F[k]:
        refused.append(f'{k}: discriminate.mjs computes {w["truth"]!r} and fields.json carries {F[k]!r}')
    if len(w['routes']) < 3:
        refused.append(f'{k}: discriminate.mjs aims fewer than three numeric wrong routes at it')
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


GL = 'crude go-live refused'

# ---------------------------------------------------------------------------
# THE SQL
# ---------------------------------------------------------------------------
SQL_ROUTE = [k for k in KEYS if TIER_OF[k] in ('beginner', 'intermediate')]
ORACLE_ONLY = [k for k in KEYS if k not in SQL_ROUTE]


def wrap(keys, indent):
    out, line = [], ''
    for k in keys:
        piece = k + ', '
        if len(indent) + len(line) + len(piece) > 79:
            out.append(indent + line.rstrip())
            line = ''
        line += piece
    out.append(indent + line.rstrip().rstrip(','))
    return '\n'.join(out)


HEADER = f"""-- ============================================================================
-- crude GO-LIVE (HELD): Crude Assay & Blending flips to 'available', the first
-- course of the Commercial & Trading module, at path_order 48.
--
-- DEPLOY GATE, TWO UPLOADS. Do NOT run this until BOTH are live:
--   1. a NextGen production upload that carries the route /dashboard/apps/crude.
--      The 78 lessons, the teaching lab and its three explorer panels (assay,
--      valuation and recipe) ship in the ZIP and NOT in this database, so a
--      flip before the upload puts a live catalogue tile in front of a route
--      that does not exist;
--   2. the Suite production upload carrying Suite main 1a71d9c90, the first
--      Suite main that carries everything this course teaches on the live
--      Crude Assay & Blending Studio and Product Blending Optimizer pages:
--      Suite #532 (3e5506561, fix/md1-0-crude-blend-app: the MD1-0 page
--      repairs, a blank box sent as absent, the stability band, the netback's
--      named gaps, the optimizer's price per unit and binding rows) and the
--      engines at e4d3b10 (MD1-1: a cut with no yield named, a property a
--      stream lacks left unformed, the partial-SARA message) and 13f0936, which
--      reached Suite main only inside #540. Suite production was e36846604
--      when this ladder was cut, which carries none of them.
-- This file is written, dry-run and left unapplied on purpose.
--
-- EVERY GRADED VALUE IS CHECKED FOUR WAYS, and none restates the generator:
--
--   1. against the ENGINE, run through the vendored engines when this file was
--      generated (crude_capstone.mjs --json, twice, the second time under a
--      clock moved 900 days), so a capstone row an earlier seed left behind is
--      refused by name;
--   2. by a SECOND ROUTE, over the capstone records the prompts were rendered
--      from. The go-live first proves each shipped prompt is the rendered one
--      byte for byte. Route per field:
--        SQL closed form
{wrap(SQL_ROUTE, '--                         ')}
--                         (barrels and barrels x SG for the cargo; each
--                         crude's own yield blended on volume; T50 off the
--                         blended curve on the union of measured temperatures;
--                         the netback walked cut by cut);
--        the ORACLE's exact rational solution
{wrap(ORACLE_ONLY, '--                         ')}
--                         (an LP optimum is not re-solved in SQL: exact vertex
--                         enumeration, and relief by exact re-solve with the
--                         limit moved 1e-7 either way; each seeded relief must
--                         lie between the two one-sided quotients, and the two
--                         must agree within twice the tolerance);
--   3. by the ORACLE for all eighteen: oracle_check.py's run of the vendored
--      Python oracles (oracle_crudeassay.py, oracle_productblending.py),
--      written in by value;
--   4. by the TRAPS the course is built on, one for every field: the wrong
--      route discriminate.mjs swept through the engine that lands closest to
--      the graded value, which must lie outside the field's tolerance.
-- Routes 2 and 3 must each lie within the field's own tolerance of the seeded
-- value, which is the grader's own test.
--
-- NOTHING HELD IS GRADED. No graded key, label or unit names viscosity,
-- Refutas or Watson (FINDINGS C12 and C13, taught as limits), and no graded
-- value is within its tolerance of the engine's held figures on the capstone
-- records. The Expert prompt states the alkylate tank typed as 0 bbl.
--
-- NO DATE. Neither engine reads a clock or a date, and nothing here does:
-- this file gives the same verdict on whatever day it is run.
--
-- THE GRADER IS NUMERIC. academy_submit_capstone casts expected, tol and the
-- answer to numeric. Every field must carry a numeric expected value at the
-- tolerance precision.json gives its class (four decimals, graded at 5e-5),
-- with a label and a unit, and all of it is asserted here, on the rows as
-- seeded.
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
A('  v_e jsonb; v_y numeric; v_vol numeric; v_mass numeric; v_share_total numeric;')
A('  v_gross numeric; v_loss numeric;')
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

HELD_RE = GC.HELD_WORDS.pattern
A(f'''
  -- ------------------------------------------------- the grader is numeric
  -- Exactly the eighteen keys, each a number at the tolerance precision.json
  -- gives its class (four decimals, 5e-5), with a label and a unit.
  select count(*), string_agg(c.tier || '/' || coalesce(f->>'key', '(no key)'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = '{SLUG}'
     and (jsonb_typeof(f->'expected') is distinct from 'number' or jsonb_typeof(f->'tol') is distinct from 'number'
          or not (v_tol_of ? coalesce(f->>'key', ''))
          or (f->>'tol')::numeric <> (v_tol_of->>(f->>'key'))::numeric
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

  -- ------------------------------------------------- nothing HELD is graded
  -- FINDINGS C12 (the Refutas viscosity index blended on mass) and C13 (Watson
  -- K on T50) are taught as limits. No graded key, label or unit may name them.
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = '{SLUG}'
     and (f->>'key' ~* {lit(HELD_RE)} or f->>'label' ~* {lit(HELD_RE)} or f->>'unit' ~* {lit(HELD_RE)});
  if v_n <> 0 then
    raise exception '{GL}: % graded field(s) name a HELD quantity (Refutas viscosity C12, Watson K C13): %', v_n, v_names;
  end if;

  -- Nor may a graded value BE one of the engine's held figures on these
  -- records under another name: {', '.join(f'{k} {v!r}' for k, v in GC.HELD.items())}.
  select count(*), string_agg(c.tier || '/' || (f->>'key') || ' = ' || (f->>'expected') || ' is ' || h.k, ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         jsonb_each_text({jlit(GC.HELD)}) h(k, v)
   where c.app_slug = '{SLUG}'
     and abs(abs((f->>'expected')::numeric) - abs(h.v::numeric)) <= (f->>'tol')::numeric;
  if v_n <> 0 then
    raise exception '{GL}: % graded field(s) are a HELD figure: %', v_n, v_names;
  end if;
''')

# ------------------------------------------------------------ the prompts
A('\n  -- ---------------------------------------- the prompts the learner reads')
A('  -- The Expert prompt states the alkylate tank typed as 0 bbl, once, and the')
A('  -- record the second route reads types it so: a typed zero read as unlimited')
A('  -- is a trap the course grades, and a prompt that hid the zero would grade a')
A('  -- learner on a condition nobody stated.')
A(f'''  select prompt into v_prompt from public.academy_capstones where app_slug = '{SLUG}' and tier = 'advanced';
  if strpos(v_prompt, {lit(GC.ALK_SENTENCE)}) = 0
     or length(v_prompt) - length(replace(v_prompt, 'typed as 0 bbl', '')) <> length('typed as 0 bbl') then
    raise exception '{GL}: the advanced prompt does not state, once, that the alkylate tank is typed as 0 bbl';
  end if;
  if (select count(*) from jsonb_array_elements(v_onne_pool) e
       where e->>'name' = 'Alkylate' and (e->>'maxVolume')::numeric = 0) <> 1 then
    raise exception '{GL}: the ONNE record does not type the alkylate tank as 0 bbl';
  end if;''')
A("  -- Each shipped prompt is capstone.json's, byte for byte, which")
A('  -- crude_capstone.mjs rendered from the records the second route reads.')
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
        "coalesce((select string_agg((x->>'label') || ' ' || (x->>'unit'), ' ') from jsonb_array_elements(p.fields) x), '')")
DEC = "(case when strpos(m[1], '.') > 0 then length(split_part(m[1], '.', 2)) else 0 end)"
DERIVED = GC.DERIVED
A(f'''
  -- LEAKS (gate_promptleak.py in SQL). No graded value of any tier is within
  -- its tolerance of a number token in any prompt, dataset, title, label or
  -- unit, and no token with a decimal is a rounding of one. No token with a
  -- decimal is a rounding of any of the {len(DERIVED)} engine-derived
  -- intermediates gate_promptleak.py lists. (A token with no decimal is a
  -- stated condition, and at most the integer part of a four-decimal answer
  -- graded at 5e-5, which hands over nothing a grader accepts.)
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key') || ' in the ' || p.tier || ' capstone as ' || m[1], ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         public.academy_capstones p,
         lateral regexp_matches({TEXT}, '{SQLNUM}', 'g') as m
   where c.app_slug = '{SLUG}' and p.app_slug = '{SLUG}'
     and (abs(abs((m[1])::numeric) - abs((f->>'expected')::numeric)) <= (f->>'tol')::numeric
          or ({DEC} >= 1
              and abs(abs((m[1])::numeric) - abs((f->>'expected')::numeric)) <= 0.5 * power(10::numeric, -{DEC})));
  if v_n <> 0 then
    raise exception '{GL}: % graded field(s) are printed in a capstone a learner reads: %', v_n, v_names;
  end if;

  select count(*), string_agg(distinct d.k || ' in the ' || p.tier || ' capstone as ' || m[1], ', ')
    into v_n, v_names
    from public.academy_capstones p,
         lateral regexp_matches({TEXT}, '{SQLNUM}', 'g') as m,
         jsonb_each_text({jlit(DERIVED)}) d(k, v)
   where p.app_slug = '{SLUG}'
     and {DEC} >= 1
     and abs(abs((m[1])::numeric) - abs(d.v::numeric)) <= 0.5 * power(10::numeric, -{DEC});
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
    raise exception '{GL}: the seeded value % is not the {num(ENGINE[k])} the engine returned through crude_capstone.mjs{name(k)}', {V[k]};
  end if;''')


# ------------------------------------------------ 2. the second route in SQL
def vp(curve, t):
    """A TBP curve read at temperature t: linear between measured points; below
    a first point at 0 percent nothing has distilled, above a last point at 100
    percent everything has, and anywhere else outside the curve it is NULL."""
    pts = ("(select (_p->>'temperatureF')::numeric t, (_p->>'volumePercent')::numeric v"
           f" from jsonb_array_elements({curve}) _p)")
    return (f"(select case when ({t}) < min(_x.t) then (case when (array_agg(_x.v order by _x.t))[1] = 0 then 0::numeric end)"
            f" when ({t}) > max(_x.t) then (case when (array_agg(_x.v order by _x.t desc))[1] = 100 then 100::numeric end)"
            f" else (select case when _hi.t = _lo.t then _lo.v else _lo.v + (({t}) - _lo.t) * (_hi.v - _lo.v) / (_hi.t - _lo.t) end"
            f" from (select * from {pts} _y where _y.t <= ({t}) order by _y.t desc limit 1) _lo,"
            f" (select * from {pts} _y where _y.t >= ({t}) order by _y.t asc limit 1) _hi) end"
            f" from {pts} _x)")


def n(rec, *path):
    return f"(v_{rec.lower()} #>> {lit('{' + ','.join(path) + '}')})::numeric"


ABH = [c['id'] for c in REC['IDAMA_CRUDES'] if c['name'] == 'Abiteye Heavy']
assert len(ABH) == 1, 'the mass share field names Abiteye Heavy'
CUT_OF = {'ogbele_blend_kerosene_yield_pct': 'kerosene', 'ogbele_blend_diesel_yield_pct': 'diesel'}
for k, cid in CUT_OF.items():
    if cid not in [c['id'] for c in REC['OGBELE_CUTS']]:
        refused.append(f'{k}: the OGBELE cut set has no {cid} cut')
if REC['IDAMA_CUT']['crude'] not in [c['id'] for c in REC['IDAMA_CRUDES']]:
    refused.append('the IDAMA cut names a crude the cargo does not carry')

OPM_CURVE = "(select _c->'curve' from jsonb_array_elements(v_idama_crudes) _c where _c->>'id' = v_idama_cut->>'crude')"
BLEND_ROWS = ("(select (v_ogbele_shares->>(cc->>'id'))::numeric / v_share_total f, cc->'curve' crv"
              " from jsonb_array_elements(v_ogbele_crudes) cc)")
def BOUND(side, other):
    t = "(v_e->>'%s')::numeric" % side
    return f"(case when v_e->>'{side}' is null then {other}::numeric else {vp('z.crv', t)} end)"

A(f'''
  -- ----------------------------------------------- 2. the second route in SQL
  -- ASSOCIATE, IDAMA. Each stream is loaded in BARRELS and in barrels x SG, a
  -- quantity proportional to its mass; no fraction is formed. SG = 141.5 /
  -- (API + 131.5). The cargo's SG is its barrels x SG over its barrels and its
  -- API is 141.5 / SG - 131.5 (API is never averaged). Sulfur and vanadium are
  -- per-mass properties weighted by barrels x SG; Abiteye Heavy's share by mass
  -- is its barrels x SG over the cargo's, in percent; the CII is the
  -- mass-weighted (saturates + asphaltenes) over the mass-weighted (aromatics +
  -- resins), with no blended SARA formed.
  select sum(x.b), sum(x.b * x.sg),
         sum(x.b * x.sg * x.s) / sum(x.b * x.sg),
         sum(x.b * x.sg * x.vn) / sum(x.b * x.sg),
         100.0 * sum(case when x.id = {lit(ABH[0])} then x.b * x.sg else 0 end) / sum(x.b * x.sg),
         sum(x.b * x.sg * (x.sat + x.asph)) / sum(x.b * x.sg * (x.aro + x.res))
    into v_vol, v_mass, v_s_idama_blend_sulfur_wtpct, v_s_idama_blend_vanadium_ppm,
         v_s_idama_abiteye_mass_share_pct, v_s_idama_blend_cii
    from (select c->>'id' id, (v_idama_barrels->>(c->>'id'))::numeric b,
                 141.5 / ((c->>'api')::numeric + 131.5) sg,
                 (c->>'sulfurWtPct')::numeric s, (c->>'vanadiumPpm')::numeric vn,
                 (c#>>'{{sara,saturates}}')::numeric sat, (c#>>'{{sara,aromatics}}')::numeric aro,
                 (c#>>'{{sara,resins}}')::numeric res, (c#>>'{{sara,asphaltenes}}')::numeric asph
            from jsonb_array_elements(v_idama_crudes) c) x;
  v_s_idama_blend_api := 141.5 / (v_mass / v_vol) - 131.5;

  -- The Opuama Medium kerosene: the crude's own curve read at the cut's upper
  -- bound, less the reading at its lower bound, each by linear interpolation
  -- between the measured points either side.
  v_s_idama_opuama_kerosene_yield_pct :=
    {vp(OPM_CURVE, n('IDAMA_CUT', 'cut', 'toF'))}
    - {vp(OPM_CURVE, n('IDAMA_CUT', 'cut', 'fromF'))};

  -- PROFESSIONAL, OGBELE. The shares are volume shares of their sum.
  select sum(value::numeric) into v_share_total from jsonb_each_text(v_ogbele_shares);

  -- T50 off the blended curve: at every temperature either crude measured, the
  -- blend has distilled the volume-weighted sum of the two readings (a
  -- temperature at which a crude's curve says nothing is left out); the first
  -- point at 50 percent, else the first segment that crosses it, read linearly.
  with tg as (
    select distinct (p->>'temperatureF')::numeric t
      from jsonb_array_elements(v_ogbele_crudes) cc0, jsonb_array_elements(cc0->'curve') p),
  bc as (
    select tg.t, (select case when bool_or(zz.r is null) then null else sum(zz.f * zz.r) end
                    from (select z.f, {vp('z.crv', 'tg.t')} r from {BLEND_ROWS} z) zz) b
      from tg),
  seg as (
    select t, b, lead(t) over (order by t) t2, lead(b) over (order by t) b2 from bc where b is not null)
  select coalesce((select min(t) from seg where b = 50),
                  (select t + (50 - b) * (t2 - t) / (b2 - b) from seg where b < 50 and b2 > 50 order by t limit 1))
    into v_s_ogbele_blend_t50_f;

  -- Every cut's yield is EACH CRUDE'S OWN YIELD (its curve at the upper bound
  -- less at the lower, an open bound reading 0 or 100) blended on volume. The
  -- gross is the sum of yield / 100 x price over all five cuts; the losses are
  -- that gross times the loss percent, on the product side; the netback is the
  -- gross less the losses, processing and freight.
  v_gross := 0;
  for v_e in select e from jsonb_array_elements(v_ogbele_cuts) e loop
    select case when bool_or(zz.y is null) then null else sum(zz.f * zz.y) end into v_y
      from (select z.f, {BOUND('toF', 100)} - {BOUND('fromF', 0)} y from {BLEND_ROWS} z) zz;
    if v_y is null then
      raise exception '{GL}: the SQL route cannot read the OGBELE cut % off both curves', v_e->>'name';
    end if;
    v_gross := v_gross + v_y / 100.0 * (v_ogbele_valuation #>> array['prices', v_e->>'id'])::numeric;''')
for k, cid in CUT_OF.items():
    A(f"    if v_e->>'id' = {lit(cid)} then v_s_{k} := v_y; end if;")
A(f'''  end loop;
  v_loss := v_gross * {n('OGBELE_VALUATION', 'lossPercent')} / 100.0;
  v_s_ogbele_gross_value_per_bbl := v_gross;
  v_s_ogbele_loss_value_per_bbl := v_loss;
  v_s_ogbele_netback_per_bbl := v_gross - v_loss - {n('OGBELE_VALUATION', 'processingCostPerBbl')}
                                - {n('OGBELE_VALUATION', 'freightPerBbl')};
''')
_joined = '\n'.join(B)
for k in SQL_ROUTE:
    assert f'v_s_{k} :=' in _joined or f'v_s_{k},' in _joined or f'v_s_{k}\n' in _joined \
        or f'v_s_{k};' in _joined, f'no SQL route for {k}'
for k in SQL_ROUTE:
    A(f'''  if v_s_{k} is null or abs(v_s_{k} - {V[k]}) > {num(TOL[k])} then
    raise exception '{GL}: the second route in SQL gives % over the capstone records, not within {num(TOL[k])} of the seeded %{name(k)}', v_s_{k}, {V[k]};
  end if;
  if abs(v_s_{k} - {V[k]}) / {num(TOL[k])} > v_worst then
    v_worst := abs(v_s_{k} - {V[k]}) / {num(TOL[k])}; v_worst_key := '{TIER_OF[k]}/{k}';
  end if;''')
A(f"  raise notice 'crude go-live: second route in SQL, {len(SQL_ROUTE)} fields, largest disagreement % of a tolerance (%)', round(v_worst, 6), v_worst_key;")

# ------------------------------------------------------- 3. the oracle
A('\n  -- ---------------------------------------------------- 3. against the oracle')
A('  -- oracle_check.py --json, run when this file was generated. The value and the')
A('  -- oracle function it came from are written in; for the six Expert fields it is')
A('  -- the only second route.')
A("  v_worst := 0; v_worst_key := '(none)';")
for k in KEYS:
    o = ORACLE[k]
    A(f'''  -- {k}: {o['method']}
  if abs({num(o['value'])} - {V[k]}) > {num(TOL[k])} then
    raise exception '{GL}: the oracle gives {num(o['value'])}, not within {num(TOL[k])} of the seeded %{name(k)}', {V[k]};
  end if;
  if abs({num(o['value'])} - {V[k]}) / {num(TOL[k])} > v_worst then
    v_worst := abs({num(o['value'])} - {V[k]}) / {num(TOL[k])}; v_worst_key := '{TIER_OF[k]}/{k}';
  end if;''')
    if k in RELIEF:
        lo, hi = sorted((o['relax'], o['tighten']))
        eps = rel_eps(F[k])
        A(f'''  -- The value of relief AT THE MARGIN lies between the oracle's two exact
  -- one-sided quotients (relax {num(o['relax'])}, tighten {num(o['tighten'])}),
  -- widened by {eps:.3g}, 1e-9 of its size; and the two agree within twice the
  -- tolerance, so the row is not dual degenerate and one answer is right.
  if {V[k]} < {num(lo)} - {num(eps)} or {V[k]} > {num(hi)} + {num(eps)} then
    raise exception '{GL}: the seeded relief % is not between the oracle''s one-sided quotients {num(lo)} and {num(hi)}{name(k)}', {V[k]};
  end if;
  if {num(hi)} - {num(lo)} > 2 * {num(TOL[k])} then
    raise exception '{GL}: the oracle''s one-sided quotients differ by more than twice the tolerance, so the row is dual degenerate{name(k)}';
  end if;''')
A("  raise notice 'crude go-live: the oracle, 18 fields, largest disagreement % of a tolerance (%)', round(v_worst, 6), v_worst_key;")

# ------------------------------------------------------ 4. the traps bite
A('\n  -- ------------------------------------------------- 4. the traps bite')
A('  -- Each is the wrong route discriminate.mjs swept through the engine that')
A('  -- lands CLOSEST to the graded value. It must lie outside the tolerance, or')
A('  -- the field does not discriminate the trap it is for.')
for k in KEYS:
    rname, val = TRAPS[k]
    why = rname.replace('_', ' ')
    A(f'''  if abs({num(val)} - {V[k]}) <= {num(TOL[k])} then
    raise exception '{GL}: the trap ({why}) reads {num(val)}, inside the tolerance of the seeded %, so the field does not discriminate the trap{name(k)}', {V[k]};
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

  raise notice 'crude go-live: {SLUG} available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
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
if GC.ALK_SENTENCE is None:
    refused.append('no alkylate sentence to assert')

if refused or unnamed or intdiv or unclosed or dashes:
    print('REFUSED, nothing written:')
    for b in refused + unnamed + intdiv:
        print('  ', b)
    print('unclosed literal:', bool(unclosed), '| en/em dashes:', dashes)
    sys.exit(1)

open(OUT, 'w').write(sql)
print(f'wrote {OUT}: {len(sql.splitlines())} lines')
print('engine: 18 of 18 fields.json values equal crude_capstone.mjs --json through the vendored engines')
print(f'second route in SQL: {len(SQL_ROUTE)} closed-form fields; the {len(ORACLE_ONLY)} Expert LP fields by the oracle\'s exact solution')
worst = max(KEYS, key=lambda k: abs(ORACLE[k]['value'] - F[k]) / TOL[k])
print(f'oracle: 18 of 18 within tolerance at generation; largest {abs(ORACLE[worst]["value"] - F[worst]) / TOL[worst]:.4f} '
      f'of a tolerance ({worst}); 3 of 3 reliefs between the one-sided quotients')
closest = min(KEYS, key=lambda k: abs(TRAPS[k][1] - F[k]) / TOL[k])
print(f'traps that must bite: {len(TRAPS)}, the closest {closest} by {TRAPS[closest][0]}, '
      f'{abs(TRAPS[closest][1] - F[closest]) / TOL[closest]:.1f} tolerances out')
print(f'digest sweep: {len(DIGEST_NUMS)} distinct numbers | intermediates: {len(DERIVED)} | prompt tokens: {GC.sql_tokens}')
print(f'graded fields named by at least one refusal: {len(named & {f"{TIER_OF[k]}/{k}" for k in KEYS})} of 18')
print('integer-division guard: 0 | unclosed literals: 0 | en/em dashes: 0')
