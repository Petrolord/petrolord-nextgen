#!/usr/bin/env python3
"""Generate the gasvalue go-live migration.

Modelled on tools/course-waves/supply/gen_golive.py (NextGen #165, applied live
2026-09-19) and crude's (#167, the two-upload gate).

NOTHING HERE IS RETYPED. The eighteen graded values are read out of the
CAPSTONE ROWS THE LADDER ITSELF SEEDED, by key, inside the same transaction.
They are then checked four ways, and none of the four is a restatement of the
generator that wrote them:

1. AGAINST THE ENGINE. gen_course.py runs `node gasvalue_capstone.mjs --json`
   through the vendored engines when this file is generated (twice, the second
   time under a clock moved 900 days), and refuses if fields.json disagrees
   with that run. The values the go-live compares the seeded rows to are that
   run's, at full precision, so a capstone row left behind by an earlier seed
   (the course migration inserts with `on conflict do nothing`) is refused here
   by name.

2. BY A SECOND ROUTE IN SQL, for every field with a closed form, over the
   capstone records the prompts were rendered from: sixteen of the eighteen.
   Postgres recomputes them in exact numeric with the rules written out in SQL,
   from the figures the prompt prints (the stated scf a lb-mol, the stated
   pound, the stated molar masses): the gas scaled to one and read by the mole
   for its heating value, its C3+ liquids and its C3+ mass; the flare by
   40 CFR 98.233(n), CO2 from the gas's own CO2 plus the combustion efficiency
   times the hydrocarbon carbon, methane from the methane at one less the
   destruction efficiency, CO2e at the stated GWP; the plant's year, its
   margin per Mscf and its capital by the modular power law; the recovered
   share of the flare, the net abatement against the declared counterfactual
   and the breakeven credit price in closed form; the usable LPG on the filling
   density by weight of water capacity; the vaporizer's three terms at the
   blend's latent heat on MASS fractions; the carousel's wait by Erlang C in the
   FACTORIAL form on the positions wholly working (the engine builds it from the
   Erlang B recursion, so this is a different algorithm, not a transcription);
   and the taxi's payback from energy equivalence. Each must lie within the
   field's own tolerance of the seeded value: that is the grader's own test, so
   the second route's answer, typed by a learner, would be graded right.

   THE TWO FIELDS WITHOUT A SQL ROUTE are the gas in the storage bank and the
   gas left in the cascade. Both rest on real-gas Z by Dranchuk-Abou-Kassem,
   which is a root of the DAK equation found by iteration and not a closed
   form (the bank mass m = PVM/ZRT is closed only once Z is), and the cascade
   is a sequence of equalisations each solved for a pressure. Their second
   route is the ORACLE's (route 3): oracle_lpgcng.mass solves DAK by bisection
   on reduced density where the engine uses Newton, and oracle_lpgcng.cascade
   keeps a mass ledger by false position with conservation asserted.

   AND THE RECORDS IT READS ARE THE RECORDS THE LEARNER READS. Each shipped
   prompt must equal capstone.json's prompt byte for byte, and gen_course.py
   refuses unless gasvalue_capstone.mjs renders exactly that prompt from the
   same record objects that are embedded below.

3. BY THE ORACLE, for all eighteen. oracle_check.py's exact run (the vendored
   stdlib Python oracles oracle_flaretovalue.py and oracle_lpgcng.py, written
   from the rules and not from the JavaScript, in exact rationals where they
   can be, with the exact pound) is written in here by value when this file is
   generated, and each seeded value must lie within its tolerance of the
   oracle's.

4. BY THE TRAPS THE COURSE IS BUILT ON, which must BITE. For every one of the
   eighteen fields, the wrong route discriminate.mjs swept through the ENGINE
   (or through the pre-MD4-0 engine at 13f0936, for the defects MD4-0
   repaired) that lands CLOSEST to the graded value is written in by value,
   and the seeded value must lie outside the field's tolerance of it.

WHAT IT REFUSES TO WRITE: a refusal that reads a graded value and does not name
it; a division with a bare integer denominator; an unclosed literal; an em or
en dash; a go-live whose engine run and fields.json disagree; an oracle or a
trap the generator's own check finds on the wrong side of a tolerance.

Usage: python3 gen_golive.py
   GV_WAVE        the wave directory (default /root/et-wip-gasvalue)
   GV_REPO        the nextgen clone   (default /root/wt-et-gasvalue-nextgen)
   GV_ENGINES     packages/engines to run the capstone through
   GV_COURSE_SQL  the course migration this ladder emits, for the prompt checks
   GV_GOLIVE_OUT  where to write
"""
import json
import os
import re
import sys

W = os.environ.get('GV_WAVE', '/root/et-wip-gasvalue')
REPO = os.environ.get('GV_REPO', '/root/wt-et-gasvalue-nextgen')
COURSE = os.environ.get('GV_COURSE_SQL', f'{REPO}/migrations/20261013_gv_gasvalue_course.sql')
OUT = os.environ.get('GV_GOLIVE_OUT', f'{REPO}/migrations/20261013_gv_gasvalue_go_live.sql')
SUITE_SHA = '06aef5d63'

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ['GV_WAVE'] = W
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
    if len(w['routes']) < 3:
        refused.append(f'{k}: discriminate.mjs swept {len(w["routes"])} numeric wrong routes, fewer than three')
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


GL = 'gasvalue go-live refused'
ORACLE_ONLY = ['asaba_bank_mass_kg', 'asaba_left_in_banks_kg']

# ---------------------------------------------------------------------------
# THE SQL
# ---------------------------------------------------------------------------
HEADER = f"""-- ============================================================================
-- gasvalue GO-LIVE (HELD): Flare Gas to Value & LPG/CNG flips to 'available',
-- the first course of the Energy Transition module, at path_order 51.
--
-- DEPLOY GATE, TWO UPLOADS. Do NOT run this until BOTH are live:
--   1. a NextGen production upload that carries the route
--      /dashboard/apps/gasvalue. The 78 lessons, the teaching lab and its three
--      explorer panels (flare, route and rollout) ship in the ZIP and NOT in
--      this database, so a flip before the upload puts a live catalogue tile in
--      front of a route that does not exist;
--   2. the Suite production upload carrying Suite main {SUITE_SHA} (Suite #543
--      MD5-0, #545 MD4-0, #546 MD45-1: the Flare Gas to Value and LPG & CNG
--      Rollout page repairs this course teaches, with the engines at df31f53
--      those pages run on). Until it is uploaded the live pages a learner opens
--      beside the course still count every unburned carbon as methane, credit a
--      plant with the whole flare, and read a gauge pressure as absolute: the
--      traps the course is built on.
-- This file is written, dry-run and left unapplied on purpose.
--
-- EVERY GRADED VALUE IS CHECKED FOUR WAYS, and none restates the generator:
--
--   1. against the ENGINE, run through the vendored engines when this file was
--      generated (gasvalue_capstone.mjs --json, twice, the second time under a
--      clock moved 900 days), so a capstone row an earlier seed left behind is
--      refused by name;
--   2. by a SECOND ROUTE IN SQL over the capstone records the prompts were
--      rendered from, for the sixteen fields with a closed form. The go-live
--      first proves each shipped prompt is the rendered one byte for byte.
--      Route per field:
--        SQL closed form  eriemu_ghv_btu_scf, eriemu_gpm_c3plus,
--                         eriemu_c3plus_kg_per_mscf (the gas scaled to one and
--                         read by the mole), eriemu_flare_co2_t,
--                         eriemu_flare_ch4_t, eriemu_flare_co2e_t (40 CFR
--                         98.233(n)), adibawa_capital_usd (the modular power
--                         law), adibawa_cng_kg_per_year, adibawa_value_per_mscf,
--                         adibawa_avoided_co2e_t, adibawa_net_abatement_t,
--                         adibawa_breakeven_credit_usd_per_t (closed form),
--                         asaba_usable_lpg_t (filling density on water
--                         capacity), asaba_vaporizer_design_kw (latent heat on
--                         mass fractions), asaba_carousel_wait_min (Erlang C
--                         by the factorial form, not the engine's Erlang B
--                         recursion), asaba_payback_years;
--        the ORACLE       asaba_bank_mass_kg and asaba_left_in_banks_kg, which
--                         rest on real-gas Z by Dranchuk-Abou-Kassem, a root
--                         found by iteration and not a closed form, so they
--                         are not re-solved here: their second route is the
--                         oracle's (DAK by bisection where the engine uses
--                         Newton; the cascade as a mass ledger by false
--                         position, conservation asserted; route 3);
--   3. by the ORACLE for all eighteen: oracle_check.py's run of the vendored
--      Python oracles (oracle_flaretovalue.py, oracle_lpgcng.py, exact
--      rationals where they can be, with the exact pound), written in by value;
--   4. by the TRAPS the course is built on, one for every field: the wrong
--      route discriminate.mjs swept through the engine (or the pre-MD4-0 engine
--      at 13f0936) that lands closest to the graded value, which must lie
--      outside the field's tolerance.
-- Routes 2 and 3 must each lie within the field's own tolerance of the seeded
-- value, which is the grader's own test.
--
-- NO DATE. Neither engine on this path reads a clock or a date, and nothing
-- here does: this file gives the same verdict on whatever day it is run.
--
-- THE GRADER IS NUMERIC. academy_submit_capstone casts expected, tol and the
-- answer to numeric. Every field must carry a numeric expected value at the
-- tolerance precision.json gives its class (one unit in the last place the
-- prompt asks for; the tonnes of a flare or an abatement at ten units, 0.01 t,
-- the wave's ruling on the engine's nine-figure pound), with a label and a
-- unit, and all of it is asserted here, on the rows as seeded.
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
A('  v_sum numeric; v_hc numeric; v_yco2 numeric; v_ych4 numeric; v_lbmol numeric;')
A('  v_co2 numeric; v_ch4 numeric; v_co2e numeric; v_mscf numeric; v_margin numeric;')
A('  v_vsum numeric; v_msum numeric; v_latent numeric;')
A('  v_lambda numeric; v_mu numeric; v_a numeric; v_c int; v_s numeric; v_t numeric; v_k int;')
A('  v_nc numeric; v_saving numeric;')
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
for sslug, sorder in GC.LIVE_NEIGHBOURS:
    A(f'''  if exists (select 1 from public.academy_apps where path_order = {sorder} and slug <> '{sslug}') then
    raise exception '{GL}: path_order {sorder}, the slot of the live course {sslug}, is held by another course';
  end if;''')

A(f'''
  -- ------------------------------------------------- the grader is numeric
  -- Exactly the eighteen keys, each a number at the tolerance precision.json
  -- gives its class, with a label and a unit.
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
''')

# ------------------------------------------------------------ the prompts
A('\n  -- ---------------------------------------- the prompts the learner reads')
A("  -- Each shipped prompt is capstone.json's, byte for byte, which")
A('  -- gasvalue_capstone.mjs rendered from the records the second route reads.')
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
DEC = "(case when strpos(m[1], '.') > 0 then length(split_part(m[1], '.', 2)) else 0 end)"
DERIVED = GC.DERIVED
INTEGERS = GC.INTEGERS
A(f'''
  -- LEAKS (gate_promptleak.py in SQL). No graded value of any tier is a number
  -- token in any prompt, dataset, title or label: not within its own
  -- tolerance, and not, as a token with decimals, its own rounding. None of the
  -- {len(DERIVED)} engine-derived intermediates on the way to a graded field is
  -- printed as its own rounding (a token with decimals), and neither of the
  -- derived counts is printed as a whole number.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key') || ' in the ' || p.tier || ' capstone as ' || m[1], ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         public.academy_capstones p,
         lateral regexp_matches({TEXT}, '{SQLNUM}', 'g') as m
   where c.app_slug = '{SLUG}' and p.app_slug = '{SLUG}'
     and (abs(abs((m[1])::numeric) - abs((f->>'expected')::numeric)) <= (f->>'tol')::numeric
          or ({DEC} > 0
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
     and {DEC} > 0
     and abs(abs((m[1])::numeric) - abs(d.v::numeric)) <= 0.5 * power(10::numeric, -{DEC});
  if v_n <> 0 then
    raise exception '{GL}: % engine-derived intermediate(s) are printed in a capstone a learner reads: %', v_n, v_names;
  end if;

  select count(*), string_agg(distinct d.k || ' in the ' || p.tier || ' capstone as ' || m[1], ', ')
    into v_n, v_names
    from public.academy_capstones p,
         lateral regexp_matches({TEXT}, '{SQLNUM}', 'g') as m,
         jsonb_each_text({jlit(INTEGERS)}) d(k, v)
   where p.app_slug = '{SLUG}'
     and {DEC} = 0
     and (m[1])::numeric = d.v::numeric;
  if v_n <> 0 then
    raise exception '{GL}: % engine-derived count(s) are printed as a whole number in a capstone a learner reads: %', v_n, v_names;
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
    raise exception '{GL}: the seeded value % is not the {num(ENGINE[k])} the engine returned through gasvalue_capstone.mjs{name(k)}', {V[k]};
  end if;''')


# ------------------------------------------------ 2. the second route in SQL
def n(rec, key):
    return f"(v_{rec.lower()}->>{lit(key)})::numeric"


def n2(rec, key, sub):
    return f"(v_{rec.lower()}->{lit(key)}->>{lit(sub)})::numeric"


CONST = lambda key: n('CONSTANTS', key)  # noqa: E731

# Guards on the record shapes the SQL route assumes.
if REC['ASABA_VESSEL'].get('fillRatioBasis') != 'water_capacity_mass':
    refused.append('the SQL route reads the ASABA vessel on the water-capacity basis, and the record says otherwise')
for g in ('ERIEMU', 'ADIBAWA'):
    comps = REC[f'{g}_COMPONENTS']
    if [c['code'] for c in comps] != [r[0] for r in REC[f'{g}_GAS']] or \
            [c['moleFraction'] for c in comps] != [r[1] for r in REC[f'{g}_GAS']]:
        refused.append(f'the {g} components the SQL route reads are not the {g} sheet')
    for c in comps:
        if c['code'] in ('C3', 'IC4', 'NC4', 'C5') and (not c['recoverableAsNgl'] or c['liquidDensityLbGal'] is None):
            refused.append(f'{g} {c["code"]} is read as recoverable propane-and-heavier with a density, and the reference says otherwise')
if 'flareCombustionEfficiency' not in REC['ERIEMU_FLARE'] or 'flareCombustionEfficiency' not in REC['ADIBAWA_FLARE']:
    refused.append('the SQL route reads both flare efficiencies, and a record states only one')
if 'consumptionPer100Km' in REC['ASABA_CONVERSION']['newFuel']:
    refused.append('the SQL route derives the CNG consumption from energy, and the record states a measured one')


def gas_block(g):
    """The gas scaled to one, and the hydrocarbon carbon, CO2 and methane by the mole."""
    comps = f'jsonb_array_elements(v_{g.lower()}_components) e'
    y = "(e->>'moleFraction')::numeric"
    return f'''
  select sum({y}) into v_sum from {comps};
  select sum({y} / v_sum * (e->>'c')::numeric) into v_hc from {comps}
   where not (e->>'inert')::boolean and e->>'code' <> 'CO2';
  select coalesce(sum({y} / v_sum), 0) into v_yco2 from {comps} where e->>'code' = 'CO2';
  select coalesce(sum({y} / v_sum), 0) into v_ych4 from {comps} where e->>'code' = 'C1';'''


def flare_block(g):
    fl = lambda key: n(f'{g}_FLARE', key)  # noqa: E731
    return f'''
  v_lbmol := {fl('volumeMMscfd')} * 1000000.0 * {fl('onstreamDays')} / {CONST('scfPerLbmol')};
  v_co2 := v_lbmol * ({fl('flareCombustionEfficiency')} * v_hc + v_yco2) * {CONST('co2MolarMass')} / {CONST('lbPerKg')} / 1000.0;
  v_ch4 := v_lbmol * v_ych4 * (1 - {fl('flareDestructionEfficiency')}) * {CONST('ch4MolarMass')} / {CONST('lbPerKg')} / 1000.0;
  v_co2e := v_co2 + v_ch4 * {fl('gwpMethane')};'''


C3P = "e->>'code' in ('C3', 'IC4', 'NC4', 'C5') and (e->>'recoverableAsNgl')::boolean"
Y = "(e->>'moleFraction')::numeric"
ROUTE = lambda key: n('ADIBAWA_ROUTE', key)  # noqa: E731
CF = lambda key: n('ADIBAWA_COUNTERFACTUAL', key)  # noqa: E731
VAP = lambda key: n('ASABA_VAPORIZER', key)  # noqa: E731
BOT = lambda key: n('ASABA_BOTTLING', key)  # noqa: E731
CONV = lambda key: n('ASABA_CONVERSION', key)  # noqa: E731

A(f'''
  -- ----------------------------------------------- 2. the second route in SQL
  -- ASSOCIATE, ERIEMU. The sheet is scaled to one. The heating value is the
  -- mole-weighted sum of the component heating values; a thousand scf is
  -- 1000 / (scf a lb-mol) lb-mol; the C3+ liquids are, component by component,
  -- lb-mol times mole fraction times molar mass over the liquid density in
  -- lb/gal, and the C3+ mass is the same pounds over the stated pound a kg.
  -- The flare by 40 CFR 98.233(n): the CO2 in the gas passes through, the
  -- hydrocarbon carbon burns to CO2 at the COMBUSTION efficiency, the methane
  -- escapes at one less the DESTRUCTION efficiency, and CO2e adds the methane
  -- at the stated GWP; kg by the stated pound, tonnes over 1000.
{gas_block('ERIEMU')}
  select sum({Y} / v_sum * (e->>'ghvBtuScf')::numeric) into v_s_eriemu_ghv_btu_scf
    from jsonb_array_elements(v_eriemu_components) e;
  select sum(1000.0 / {CONST('scfPerLbmol')} * {Y} / v_sum * (e->>'molarMassLbLbmol')::numeric / (e->>'liquidDensityLbGal')::numeric)
    into v_s_eriemu_gpm_c3plus from jsonb_array_elements(v_eriemu_components) e where {C3P};
  select sum(1000.0 / {CONST('scfPerLbmol')} * {Y} / v_sum * (e->>'molarMassLbLbmol')::numeric) / {CONST('lbPerKg')}
    into v_s_eriemu_c3plus_kg_per_mscf from jsonb_array_elements(v_eriemu_components) e where {C3P};
{flare_block('ERIEMU')}
  v_s_eriemu_flare_co2_t := v_co2;
  v_s_eriemu_flare_ch4_t := v_ch4;
  v_s_eriemu_flare_co2e_t := v_co2e;

  -- PROFESSIONAL, ADIBAWA. The parcel's Mscf a year; the CNG is that times the
  -- yield times the recovery; the margin is revenue less the fixed and the
  -- variable operating cost, and per Mscf it is over the parcel's Mscf; the
  -- capital scales the reference plant by (capacity / reference) to the
  -- modular exponent. The plant avoids only the share of the flare it
  -- recovers; the net abatement takes off what burning the CNG emits and adds
  -- what the displaced diesel would have; the breakeven credit price is the
  -- margin short of the hurdle over the net tonnes, in closed form.
  v_mscf := {n('ADIBAWA_FLARE', 'volumeMMscfd')} * 1000.0 * {n('ADIBAWA_FLARE', 'onstreamDays')};
  v_s_adibawa_cng_kg_per_year := v_mscf * {ROUTE('productUnitPerMscf')} * {ROUTE('recoveryFraction')};
  v_margin := v_s_adibawa_cng_kg_per_year * {ROUTE('pricePerProductUnit')}
              - ({ROUTE('fixedOpexPerYear')} + v_mscf * {ROUTE('variableOpexPerMscf')});
  v_s_adibawa_value_per_mscf := v_margin / v_mscf;
  v_s_adibawa_capital_usd := {ROUTE('referenceCapitalCost')}
      * power({n('ADIBAWA_FLARE', 'volumeMMscfd')} / {ROUTE('referenceCapacityMMscfd')}, {CONST('modularExponent')});
{gas_block('ADIBAWA')}
{flare_block('ADIBAWA')}
  v_s_adibawa_avoided_co2e_t := v_co2e * {ROUTE('recoveryFraction')};
  v_s_adibawa_net_abatement_t := v_s_adibawa_avoided_co2e_t - {CF('productCombustionTonnesCo2ePerYear')}
                                 + {CF('displacedFuelTonnesCo2ePerYear')};
  if not (v_margin < {n('ADIBAWA_CREDITS', 'hurdleMarginPerYear')} and v_s_adibawa_net_abatement_t > 0) then
    raise exception '{GL}: the SQL route finds the route standing alone or abating nothing, so its breakeven is not a price{name('adibawa_breakeven_credit_usd_per_t')}';
  end if;
  v_s_adibawa_breakeven_credit_usd_per_t := ({n('ADIBAWA_CREDITS', 'hurdleMarginPerYear')} - v_margin)
                                            / v_s_adibawa_net_abatement_t;

  -- EXPERT, ASABA. The fill limit is a filling density on the WATER capacity
  -- by weight: usable tonnes = water capacity x water density x the limit /
  -- 1000, whatever the blend. The blend's latent heat is on MASS fractions,
  -- the volume fractions carried through the component densities. The
  -- vaporizer warms the liquid to the boiling point at its pressure, boils it
  -- and superheats the vapour, kJ/h over 3600, plus the margin.
  v_s_asaba_usable_lpg_t := {n('ASABA_VESSEL', 'vesselCapacityM3')} * {CONST('waterKgM3')}
                            * {n('ASABA_VESSEL', 'maxFillRatio')} / 1000.0;
  select sum((e->>'volumeFraction')::numeric) into v_vsum from jsonb_array_elements(v_asaba_lpg) e;
  select sum((e->>'volumeFraction')::numeric / v_vsum * (e->>'liquidDensityKgM3')::numeric) into v_msum
    from jsonb_array_elements(v_asaba_lpg) e;
  select sum((e->>'volumeFraction')::numeric / v_vsum * (e->>'liquidDensityKgM3')::numeric / v_msum
             * (e->>'latentHeatKJkg')::numeric) into v_latent
    from jsonb_array_elements(v_asaba_lpg) e;
  v_s_asaba_vaporizer_design_kw := {VAP('massFlowKgHr')} * ({VAP('liquidCpKJkgK')} * ({VAP('boilingPointC')} - {VAP('inletTempC')})
                                   + v_latent + {VAP('vapourCpKJkgK')} * ({VAP('outletTempC')} - {VAP('boilingPointC')}))
                                   / 3600.0 * (1 + {VAP('designMarginPercent')} / 100.0);

  -- The carousel is a queue on the positions WHOLLY working, the floor of
  -- positions x availability. Erlang C by the FACTORIAL form, a different
  -- algorithm from the engine's Erlang B recursion: lambda = cylinders over
  -- the shift hours, mu = 60 / fill minutes, A = lambda / mu; P(wait) =
  -- [A^c / c! * c / (c - A)] / [sum over k < c of A^k / k! + A^c / c! * c /
  -- (c - A)]; the mean wait is P(wait) / (c mu - lambda) hours, in minutes.
  v_lambda := {BOT('cylindersPerDay')} / {BOT('shiftHoursPerDay')};
  v_mu := 60.0 / {BOT('fillMinutesPerCylinder')};
  v_a := v_lambda / v_mu;
  v_c := floor({BOT('positions')} * {BOT('availabilityFraction')})::int;
  if not (v_c >= 1 and v_a < v_c) then
    raise exception '{GL}: the SQL route finds the carousel with no stable queue on % positions{name('asaba_carousel_wait_min')}', v_c;
  end if;
  v_s := 0;
  for v_k in 0 .. v_c - 1 loop
    v_s := v_s + power(v_a, v_k) / factorial(v_k);
  end loop;
  v_t := power(v_a, v_c) / factorial(v_c) * v_c / (v_c - v_a);
  v_s_asaba_carousel_wait_min := v_t / (v_s + v_t) / (v_c * v_mu - v_lambda) * 60.0;

  -- The taxi. No measured consumption on CNG exists, so it follows from
  -- energy equivalence: CNG a 100 km = PMS a 100 km x PMS energy / (CNG energy
  -- x the efficiency ratio). The saving a year is the PMS cost less the CNG
  -- cost less the extra maintenance, and the simple payback is the conversion
  -- cost over it, undiscounted.
  v_nc := {n2('ASABA_CONVERSION', 'baseFuel', 'consumptionPer100Km')} * {n2('ASABA_CONVERSION', 'baseFuel', 'energyPerUnitMJ')}
          / ({n2('ASABA_CONVERSION', 'newFuel', 'energyPerUnitMJ')} * {n2('ASABA_CONVERSION', 'newFuel', 'efficiencyRatio')});
  v_saving := {n2('ASABA_CONVERSION', 'baseFuel', 'consumptionPer100Km')} / 100.0 * {CONV('annualDistanceKm')}
              * {n2('ASABA_CONVERSION', 'baseFuel', 'pricePerUnit')}
              - v_nc / 100.0 * {CONV('annualDistanceKm')} * {n2('ASABA_CONVERSION', 'newFuel', 'pricePerUnit')}
              - {CONV('annualExtraMaintenance')};
  if not (v_saving > 0) then
    raise exception '{GL}: the SQL route finds the conversion saving nothing, so there is no payback{name('asaba_payback_years')}';
  end if;
  v_s_asaba_payback_years := {CONV('conversionCost')} / v_saving;
''')
SQL_ROUTE = [k for k in KEYS if k not in ORACLE_ONLY]
_body = '\n'.join(B)
for k in SQL_ROUTE:
    if f'v_s_{k} :=' not in _body and f'into v_s_{k}' not in _body:
        refused.append(f'no SQL route for {k}')
for k in ORACLE_ONLY:
    if f'v_s_{k} :=' in _body or f'into v_s_{k}' in _body:
        refused.append(f'{k} is declared oracle-only and a SQL route writes it')
for k in SQL_ROUTE:
    A(f'''  if v_s_{k} is null or abs(v_s_{k} - {V[k]}) > {num(TOL[k])} then
    raise exception '{GL}: the second route in SQL gives % over the capstone records, not within {num(TOL[k])} of the seeded %{name(k)}', v_s_{k}, {V[k]};
  end if;
  if abs(v_s_{k} - {V[k]}) / {num(TOL[k])} > v_worst then
    v_worst := abs(v_s_{k} - {V[k]}) / {num(TOL[k])}; v_worst_key := '{TIER_OF[k]}/{k}';
  end if;''')
A(f"  raise notice '{SLUG} go-live: second route in SQL, {len(SQL_ROUTE)} fields, largest disagreement % of a tolerance (%)', round(v_worst, 6), v_worst_key;")

# ------------------------------------------------------- 3. the oracle
A('\n  -- ---------------------------------------------------- 3. against the oracle')
A('  -- oracle_check.py --json, run when this file was generated. The value and the')
A('  -- oracle function it came from are written in; asaba_bank_mass_kg and')
A('  -- asaba_left_in_banks_kg have no other second route.')
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
A(f"  raise notice '{SLUG} go-live: the oracle, 18 fields, largest disagreement % of a tolerance (%)', round(v_worst, 6), v_worst_key;")

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

  raise notice '{SLUG} go-live: {SLUG} available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
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
print('engine: 18 of 18 fields.json values equal gasvalue_capstone.mjs --json through the vendored engines')
print(f'second route in SQL: {len(SQL_ROUTE)} closed-form fields; {", ".join(ORACLE_ONLY)} by the oracle')
worst = max(KEYS, key=lambda k: abs(ORACLE[k]['value'] - F[k]) / TOL[k])
print(f'oracle: 18 of 18 within tolerance at generation; largest {abs(ORACLE[worst]["value"] - F[worst]) / TOL[worst]:.4f} '
      f'of a tolerance ({worst})')
closest = min(KEYS, key=lambda k: abs(TRAPS[k][1] - F[k]) / TOL[k])
print(f'traps that must bite: {len(TRAPS)}, the closest {closest} by {TRAPS[closest][0]}, '
      f'{abs(TRAPS[closest][1] - F[closest]) / TOL[closest]:.1f} tolerances out')
print(f'digest sweep: {len(DIGEST_NUMS)} distinct numbers | intermediates: {len(DERIVED)} | counts: {len(INTEGERS)} '
      f'| prompt tokens: {GC.sql_tokens}')
print(f'graded fields named by at least one refusal: {len(named & {f"{TIER_OF[k]}/{k}" for k in KEYS})} of 18')
print('integer-division guard: 0 | unclosed literals: 0 | en/em dashes: 0')
