#!/usr/bin/env python3
"""Generate the carbon go-live migration.

Modelled on tools/course-waves/supply/gen_golive.py (MD3, NextGen #165, applied
live 2026-09-19) and crude's (#167).

NOTHING HERE IS RETYPED. The eighteen graded values are read out of the
CAPSTONE ROWS THE LADDER ITSELF SEEDED, by key, inside the same transaction.
They are then checked four ways, and none of the four is a restatement of the
generator that wrote them:

1. AGAINST THE ENGINE. gen_course.py runs `node carbon_capstone.mjs --json`
   through the vendored engines when this file is generated (twice, the second
   time under a clock moved 900 days with Math.random pinned), and refuses if
   fields.json disagrees with that run. The values the go-live compares the
   seeded rows to are that run's, at full precision, so a capstone row left
   behind by an earlier seed (the course migration inserts with `on conflict
   do nothing`) is refused here by name.

2. BY A SECOND ROUTE IN SQL, for every field with a practical closed form,
   over the capstone records the prompts were rendered from: sixteen of the
   eighteen. Postgres recomputes them in exact numeric with the rules written
   out in SQL: OWAZA's heater and flare CO2 and methane from the carbon atoms
   (molar masses BUILT from the atomic weights, not the engine's constants),
   the flare's methane line in CO2e on the declared AR6 GWP100 fossil set,
   Scope 1 and the total line by line; IGRITA's excess air from the flue
   oxygen by the dry flue gas balance over the fuel's atom counts, the trap's
   steam as choked isentropic flow (choking asserted at the stated conditions:
   the gauge plus the local atmosphere upstream, that atmosphere downstream),
   and the two utilities by the problem table cascade (the cold one by the
   energy balance on the hot one, not the cascade's bottom); IKORODU's costs
   per tonne and the flare recovery's net annual cost through the capital
   recovery factor, the curve's weighted average over all six measures, the
   end-year gap from the baseline inventory and the straight-line target, and
   the economiser's cost per tonne. Each must lie within the field's own
   tolerance of the seeded value: that is the grader's own test.

   THE TWO FIELDS WITHOUT A SQL ROUTE are the heater's efficiency on LHV (a
   loss ledger over the flue gas masses, the argon-bearing atmospheric
   nitrogen, the moisture and the typical heating values) and the fuel saved
   by tuning (the ratio of two such efficiencies, which the engine rounds to
   six decimals before it divides). Their second route is the ORACLE's exact
   value (route 3): oracle_energyefficiency.efficiency on its species ledger,
   and duty_ledger on the oracle's own two efficiencies.

   AND THE RECORDS IT READS ARE THE RECORDS THE LEARNER READS. Each shipped
   prompt must equal capstone.json's prompt byte for byte, and gen_course.py
   refuses unless carbon_capstone.mjs renders exactly that prompt from the same
   record objects that are embedded below.

3. BY THE ORACLE, for all eighteen. oracle_check.py's exact run (the vendored
   stdlib Python oracles oracle_carbonabatement.py and
   oracle_energyefficiency.py, written from the rules and not from the
   JavaScript, in exact rationals where they can be) is written in here by
   value when this file is generated, and each seeded value must lie within
   its tolerance of the oracle's.

4. BY THE TRAPS THE COURSE IS BUILT ON, which must BITE. For every one of the
   eighteen fields, the wrong route discriminate.mjs swept through the ENGINE
   that lands CLOSEST to the graded value is written in by value, and the seeded
   value must lie outside the field's tolerance of it.

It also asserts that NOTHING HELD IS GRADED (no key, label or unit names H1 to
H4, and no graded value is its own field on one of the three GWP sets the
course prints and does not grade on) and that the Associate and Expert prompts
name the declared set, its report, its horizon and its methane value.

WHAT IT REFUSES TO WRITE: a refusal that reads a graded value and does not name
it; a division with a bare integer denominator; an unclosed literal; an em or
en dash; a go-live whose engine run and fields.json disagree; an oracle or a
trap the generator's own check finds on the wrong side of a tolerance.

Usage: python3 gen_golive.py
   CEF_WAVE        the wave directory (default /root/et-wip-carbon)
   CEF_REPO        the nextgen clone   (default /root/wt-et-carbon-nextgen)
   CEF_ENGINES     packages/engines to run the capstone through
   CEF_COURSE_SQL  the course migration this ladder emits, for the prompt checks
   CEF_GOLIVE_OUT  where to write
"""
import json
import os
import re
import subprocess
import sys

W = os.environ.get('CEF_WAVE', '/root/et-wip-carbon')
REPO = os.environ.get('CEF_REPO', '/root/wt-et-carbon-nextgen')
COURSE = os.environ.get('CEF_COURSE_SQL', f'{REPO}/migrations/20261014_cef_carbon_course.sql')
OUT = os.environ.get('CEF_GOLIVE_OUT', f'{REPO}/migrations/20261014_cef_carbon_go_live.sql')

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ['CEF_WAVE'] = W
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


def tnum(x):
    """A tolerance as a SQL numeric literal with a decimal point: the tuning
    saving's is 1, and a bare integer denominator is what the guard refuses."""
    return repr(float(x))


V = {k: f'v_g_{k}' for k in KEYS}


def name(*keys):
    """The graded fields a refusal reads, spelled tier/key."""
    for k in keys:
        assert k in V, k
    return ' [graded field: ' + ', '.join(f'{TIER_OF[k]}/{k}' for k in keys) + ']'


GL = 'carbon go-live refused'

# ---------------------------------------------------------------------------
# THE SQL
# ---------------------------------------------------------------------------
HEADER = f"""-- ============================================================================
-- carbon GO-LIVE (HELD): Carbon & Energy Efficiency flips to 'available', the
-- second course of the Energy Transition module, at path_order 52.
--
-- DEPLOY GATE, TWO UPLOADS. Do NOT run this until BOTH are live:
--   1. a NextGen production upload that carries the route /dashboard/apps/carbon.
--      The 78 lessons, the teaching lab and its three explorer panels
--      (inventory, efficiency and abatement) ship in the ZIP and NOT in this
--      database, so a flip before the upload puts a live catalogue tile in
--      front of a route that does not exist;
--   2. the Suite production upload carrying Suite main 06aef5d63 (Suite #543
--      MD5-0, #545 MD4-0 and #546 MD45-1: the Carbon Studio and Efficiency
--      Studio page repairs this course teaches, a blank heater efficiency
--      refused, sources in CO2e, blanks passed as missing, the partial
--      inventory warning, the verdict labels, the trap exponent and the basis
--      select, on the engines at df31f53). Until it is uploaded the pages a
--      learner opens beside the course still run the pre-MD5-0 behaviour the
--      course teaches against.
-- This file is written, dry-run and left unapplied on purpose.
--
-- EVERY GRADED VALUE IS CHECKED FOUR WAYS, and none restates the generator:
--
--   1. against the ENGINE, run through the vendored engines when this file was
--      generated (carbon_capstone.mjs --json, twice, the second time under a
--      clock moved 900 days), so a capstone row an earlier seed left behind is
--      refused by name;
--   2. by a SECOND ROUTE IN SQL over the capstone records the prompts were
--      rendered from, for the sixteen fields with a practical closed form. The
--      go-live first proves each shipped prompt is the rendered one byte for
--      byte. Route per field:
--        SQL closed form  owaza_heater_co2_t, owaza_flare_co2_t,
--                         owaza_flare_ch4_t (carbon atoms times molar masses
--                         built from the atomic weights),
--                         owaza_flare_ch4_tco2e, owaza_scope1_tco2e,
--                         owaza_total_tco2e (the declared AR6 GWP100 fossil
--                         set, line by line), igrita_excess_air_pct (the dry
--                         flue gas balance over the atom counts),
--                         igrita_trap_t_per_yr (choked isentropic flow, the
--                         choking asserted at the stated conditions),
--                         igrita_pinch_hot_utility_kw (the problem table
--                         cascade), igrita_pinch_cold_utility_kw (the energy
--                         balance on the hot utility),
--                         ikorodu_boiler_tuning_cost_per_t_usd,
--                         ikorodu_waste_heat_cost_per_t_usd,
--                         ikorodu_flare_recovery_net_annual_cost_usd (the
--                         capital recovery factor),
--                         ikorodu_curve_weighted_average_usd_per_t (all six
--                         measures), ikorodu_path_final_gap_t (the baseline
--                         inventory and the straight-line target),
--                         ikorodu_saving_cost_per_t_usd;
--        the ORACLE       igrita_efficiency_lhv_pct (a loss ledger over the
--                         flue gas masses and the typical heating values) and
--                         igrita_tuning_saving_gj (the ratio of two such
--                         efficiencies, rounded by the engine to six decimals
--                         before it divides), which are not re-derived here:
--                         their second route is the oracle's exact value
--                         (route 3);
--   3. by the ORACLE for all eighteen: oracle_check.py's run of the vendored
--      Python oracles (oracle_carbonabatement.py, oracle_energyefficiency.py,
--      exact rationals where they can be), written in by value;
--   4. by the TRAPS the course is built on, one for every field: the wrong
--      route discriminate.mjs swept through the engine that lands closest to
--      the graded value, which must lie outside the field's tolerance.
-- Routes 2 and 3 must each lie within the field's own tolerance of the seeded
-- value, which is the grader's own test.
--
-- THE TOLERANCE OF THE TUNING SAVING IS 1 GJ, and that is deliberate: the
-- prompt asks for the nearest whole GJ, the engine rounds both efficiencies to
-- six decimals before it takes their ratio, so the stored figure is a few
-- millionths off a whole number, and a learner who carries the efficiencies at
-- the four decimals the course prints lands up to about half a GJ away. Every
-- other field is graded at one unit in the last place its prompt asks for.
--
-- NOTHING HELD IS GRADED (FINDINGS-carbon H1 the report to file on, H2 the
-- typical methane heating value pair, H3 escaped carbon as methane, H4
-- combustion N2O), and the GWP set is named in every prompt whose figures it
-- moves: IPCC AR6 GWP100, fossil methane, CH4 29.8.
--
-- NO DATE. Neither engine reads a clock or a date, and nothing here does:
-- this file gives the same verdict on whatever day it is run.
--
-- THE GRADER IS NUMERIC. academy_submit_capstone casts expected, tol and the
-- answer to numeric. Every field must carry a numeric expected value at the
-- tolerance precision.json gives its class (one unit in the last place the
-- prompt asks for), with a label and a unit, and all of it is asserted here,
-- on the rows as seeded.
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
A('  v_mw_co2 numeric; v_mw_ch4 numeric; v_gwp_ch4 numeric; v_carbon numeric; v_heater_ch4 numeric; v_vent numeric;')
A('  v_ysum numeric; v_o2 numeric; v_co2 numeric; v_so2 numeric; v_fuel_n2 numeric; v_air numeric; v_dry numeric; v_f numeric;')
A('  v_p numeric; v_p2 numeric; v_k numeric; v_crit numeric; v_flux numeric; v_area numeric;')
A('  v_dt numeric; v_net numeric; v_hot_duty numeric; v_cold_duty numeric;')
A('  v_r numeric; v_base numeric; v_target_end numeric; v_abated numeric; v_tco2 numeric; v_crf numeric;')
for k in KEYS:
    A(f'  {V[k]} numeric; v_s_{k} numeric;')
# The records the second route reads. ENGINE_MOLAR_MASS is the generator's
# cross-check only: the route builds its molar masses from ATOMIC_WEIGHT.
for rname, rec in REC.items():
    if rname in ('ENGINE_MOLAR_MASS', 'ALT_GWP'):
        continue
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
  -- gives its class (1 GJ for the tuning saving, the wave's ruling), with a
  -- label and a unit.
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

# ------------------------------------------------------- nothing HELD is graded
HELD_RE = GC.HELD_WORDS.pattern.replace(r'\b', r'\y')  # Postgres ARE: \y is the word boundary, \b a backspace
A(f'''
  -- ------------------------------------------------- nothing HELD is graded
  -- FINDINGS-carbon H1 (which IPCC report to file on), H2 (the typical methane
  -- heating value pair), H3 (escaped carbon counted as methane) and H4
  -- (combustion N2O) are taught as stated limits. No graded key, label or unit
  -- may name them.
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = '{SLUG}'
     and (f->>'key' ~* {lit(HELD_RE)} or f->>'label' ~* {lit(HELD_RE)} or f->>'unit' ~* {lit(HELD_RE)});
  if v_n <> 0 then
    raise exception '{GL}: % graded field(s) name a HELD quantity (H1 to H4): %', v_n, v_names;
  end if;

  -- Nor may a graded value BE its own field on one of the three GWP sets the
  -- course prints and does not grade on (the choice of report is H1). The
  -- {len(GC.HELD)} figures, on AR6 non-fossil, AR5 fossil and AR5 non-fossil:
  -- {', '.join(sorted(GC.HELD))}.
  select count(*), string_agg(c.tier || '/' || (f->>'key') || ' = ' || (f->>'expected') || ' is ' || h.k, ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         jsonb_each_text({jlit(GC.HELD)}) h(k, v)
   where c.app_slug = '{SLUG}'
     and abs(abs((f->>'expected')::numeric) - abs(h.v::numeric)) <= (f->>'tol')::numeric;
  if v_n <> 0 then
    raise exception '{GL}: % graded field(s) are a HELD figure, a field on a GWP set the course does not grade on: %', v_n, v_names;
  end if;
''')

# ------------------------------------------------------------ the prompts
GWP_NEEDS = [GC.GWP['label'], 'IPCC Sixth Assessment Report, 100-year horizon', f"methane {GC.GWP['values']['CH4']}"]
A('\n  -- ------------------------------------------ the GWP set is named')
A('  -- Every prompt whose graded figures the GWP set moves (Associate and Expert)')
A('  -- names the declared set, its report, its horizon and its methane value.')
for tier in ('beginner', 'advanced'):
    cond = ' or '.join(f'strpos(v_prompt, {lit(x)}) = 0' for x in GWP_NEEDS)
    A(f'''  select prompt into v_prompt from public.academy_capstones where app_slug = '{SLUG}' and tier = '{tier}';
  if v_prompt is null or {cond} then
    raise exception '{GL}: the {tier} prompt does not name the GWP set its figures are graded on ({GC.GWP["label"]}, methane {GC.GWP["values"]["CH4"]})';
  end if;''')
A('\n  -- ---------------------------------------- the prompts the learner reads')
A("  -- Each shipped prompt is capstone.json's, byte for byte, which")
A('  -- carbon_capstone.mjs rendered from the records the second route reads.')
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
    raise exception '{GL}: the seeded value % is not the {num(ENGINE[k])} the engine returned through carbon_capstone.mjs{name(k)}', {V[k]};
  end if;''')


# ------------------------------------------------ 2. the second route in SQL
def n(rec, key):
    return f"(v_{rec.lower()}->>{lit(key)})::numeric"


def scalar(rec):
    return f"(v_{rec.lower()} #>> '{{}}')::numeric"


# What the route assumes about the records, checked against them here.
if REC['OWAZA_VENT']['factor']['gas'] != 'CH4' or REC['OWAZA_VENT']['scope'] != 1:
    refused.append('the SQL route reads the OWAZA vent as a Scope 1 methane line, and the record says otherwise')
if REC['OWAZA_POWER']['factor']['gas'] != 'CO2' or REC['OWAZA_POWER']['scope'] != 2:
    refused.append('the SQL route reads the OWAZA power as a Scope 2 CO2 line, and the record says otherwise')
if [[a['code'], a['y']] for a in REC['IGRITA_ATOMS']] != REC['IGRITA_FUEL']:
    refused.append('the atom counts the SQL route reads are not for the fuel the prompt prints')
if any(m['annualCost'] is None or m['capitalCost'] == 0 or m['lifeYears'] <= 0 for m in REC['IKORODU_MEASURES']):
    refused.append('the SQL route annualises every IKORODU measure with a capital recovery factor, and one has no capital or no life')
BT, WH, FG = ('Tune the boilers', 'Waste heat recovery on the gas turbine exhausts', 'Flare gas recovery compressor')
if {BT, WH, FG} - {m['label'] for m in REC['IKORODU_MEASURES']}:
    refused.append('a measure the Expert capstone grades is not in the IKORODU record')


def measure(label, what):
    """One IKORODU measure through the capital recovery factor, r(1+r)^n / ((1+r)^n - 1)."""
    crf = "(v_r * power(1 + v_r, (m->>'lifeYears')::numeric) / (power(1 + v_r, (m->>'lifeYears')::numeric) - 1))"
    net = (f"((m->>'capitalCost')::numeric * {crf} + (m->>'annualCost')::numeric - (m->>'annualSavings')::numeric)")
    val = net if what == 'net' else f"{net} / (m->>'tonnesAbatedPerYear')::numeric"
    return (f"(select {val} from jsonb_array_elements(v_ikorodu_measures) m where m->>'label' = {lit(label)})")


A(f'''
  -- ----------------------------------------------- 2. the second route in SQL
  -- ASSOCIATE, OWAZA. Every carbon atom into a burner leaves as CO2 at the
  -- destruction efficiency, and what escapes leaves as methane (H3, stated in
  -- the prompt). The molar masses are BUILT from the atomic weights here (CO2
  -- is C plus two O, CH4 is C plus four H), not read from the engine. Each
  -- methane line is its tonnes times the declared set's methane potential; the
  -- vent is its measured tonnes through a factor of one; Scope 1 is every
  -- Scope 1 line, and the total adds the purchased power at its factor.
  v_mw_co2 := (v_atomic_weight->>'C')::numeric + 2 * (v_atomic_weight->>'O')::numeric;
  v_mw_ch4 := (v_atomic_weight->>'C')::numeric + 4 * (v_atomic_weight->>'H')::numeric;
  v_gwp_ch4 := (v_cap_gwp #>> '{{values,CH4}}')::numeric;
  v_carbon := {n('OWAZA_HEATERS', 'fuelKmolPerYear')} * {n('OWAZA_HEATERS', 'carbonPerKmolFuel')};
  v_s_owaza_heater_co2_t := v_carbon * {n('OWAZA_HEATERS', 'destructionEfficiencyFraction')} * v_mw_co2 / 1000.0;
  v_heater_ch4 := v_carbon * (1 - {n('OWAZA_HEATERS', 'destructionEfficiencyFraction')}) * v_mw_ch4 / 1000.0;
  v_carbon := {n('OWAZA_FLARE', 'fuelKmolPerYear')} * {n('OWAZA_FLARE', 'carbonPerKmolFuel')};
  v_s_owaza_flare_co2_t := v_carbon * {n('OWAZA_FLARE', 'destructionEfficiencyFraction')} * v_mw_co2 / 1000.0;
  v_s_owaza_flare_ch4_t := v_carbon * (1 - {n('OWAZA_FLARE', 'destructionEfficiencyFraction')}) * v_mw_ch4 / 1000.0;
  v_s_owaza_flare_ch4_tco2e := v_s_owaza_flare_ch4_t * v_gwp_ch4;
  v_vent := {n('OWAZA_VENT', 'activity')} * (v_owaza_vent #>> '{{factor,value}}')::numeric * v_gwp_ch4;
  v_s_owaza_scope1_tco2e := v_s_owaza_heater_co2_t + v_heater_ch4 * v_gwp_ch4
                            + v_s_owaza_flare_co2_t + v_s_owaza_flare_ch4_tco2e + v_vent;
  v_s_owaza_total_tco2e := v_s_owaza_scope1_tco2e
                           + {n('OWAZA_POWER', 'activity')} * (v_owaza_power #>> '{{factor,value}}')::numeric;

  -- PROFESSIONAL, IGRITA. The oxygen a kilomole of fuel needs is the atom
  -- balance c + h/4 + s - o/2 over the mole fractions (normalised); air is
  -- that over the oxygen in dry air; the dry flue gas at stoichiometric is the
  -- CO2, the SO2, the air's nitrogen and the fuel's. Excess air E then solves
  -- E o2 / (dry + E air) = the dry stack oxygen: E = f dry / (o2 - f air).
  select sum((a->>'y')::numeric) into v_ysum from jsonb_array_elements(v_igrita_atoms) a;
  select sum((a->>'y')::numeric / v_ysum * ((a->>'c')::numeric + (a->>'h')::numeric / 4.0
                                           + (a->>'s')::numeric - (a->>'o')::numeric / 2.0)),
         sum((a->>'y')::numeric / v_ysum * (a->>'c')::numeric),
         sum((a->>'y')::numeric / v_ysum * (a->>'s')::numeric),
         sum((a->>'y')::numeric / v_ysum * (a->>'n')::numeric / 2.0)
    into v_o2, v_co2, v_so2, v_fuel_n2
    from jsonb_array_elements(v_igrita_atoms) a;
  v_air := v_o2 / {scalar('AIR_O2_FRACTION')};
  v_dry := v_co2 + v_so2 + v_air * (1 - {scalar('AIR_O2_FRACTION')}) + v_fuel_n2;
  v_f := {n('IGRITA_HEATER', 'currentO2Percent')} / 100.0;
  v_s_igrita_excess_air_pct := v_f * v_dry / (v_o2 - v_f * v_air) * 100;

  -- The trap. Upstream is the gauge reading plus the local atmosphere the
  -- prompt states; the trap vents to that atmosphere. The flow is CHOKED when
  -- the pressure ratio is at or below (2/(k+1))^(k/(k-1)), and it is asserted
  -- to be at the stated conditions; then the mass flux is
  -- Cd sqrt(k rho P (2/(k+1))^((k+1)/(k-1))) over the orifice, for the hours.
  v_p := {n('IGRITA_TRAP', 'upstreamPressureBarG')} + {n('IGRITA_TRAP', 'atmosphereBarA')};
  v_p2 := {n('IGRITA_TRAP', 'atmosphereBarA')};
  v_k := {n('IGRITA_TRAP', 'specificHeatRatio')};
  v_crit := power(2 / (v_k + 1), v_k / (v_k - 1));
  if v_p2 / v_p > v_crit then
    raise exception '{GL}: the IGRITA trap is not choked at the stated conditions (ratio % above the critical %), so its closed form does not hold [graded field: intermediate/igrita_trap_t_per_yr]', v_p2 / v_p, v_crit;
  end if;
  v_flux := {n('IGRITA_TRAP', 'dischargeCoefficient')}
            * sqrt(v_k * {n('IGRITA_TRAP', 'steamDensityKgM3')} * v_p * 100000.0 * power(2 / (v_k + 1), (v_k + 1) / (v_k - 1)));
  v_area := pi()::numeric * power({n('IGRITA_TRAP', 'orificeDiameterMm')} / 1000.0, 2) / 4.0;
  v_s_igrita_trap_t_per_yr := v_flux * v_area * 3600.0 * {n('IGRITA_TRAP', 'hoursPerYear')} / 1000.0;

  -- The problem table. Each stream is shifted by half the minimum approach (a
  -- hot one down, a cold one up); between each pair of shifted boundaries the
  -- surplus is (the hot CPs spanning it less the cold) times its width; the
  -- cascade from the top at zero reaches its most negative point, and the
  -- minimum hot utility is that deficit. The cold utility is then the energy
  -- balance on it: hot utility plus every hot stream's duty less every cold
  -- stream's.
  v_dt := {scalar('IGRITA_DTMIN')};
  with s as (
    select (e->>'supplyC')::numeric sup, (e->>'targetC')::numeric tgt, (e->>'cpKWperK')::numeric cp,
           (e->>'supplyC')::numeric > (e->>'targetC')::numeric hot
      from jsonb_array_elements(v_igrita_streams) e
     where (e->>'supplyC')::numeric <> (e->>'targetC')::numeric and (e->>'cpKWperK')::numeric <> 0),
  sh as (
    select cp, hot, sup, tgt,
           greatest(sup, tgt) + case when hot then -v_dt / 2.0 else v_dt / 2.0 end hi,
           least(sup, tgt) + case when hot then -v_dt / 2.0 else v_dt / 2.0 end lo from s),
  b as (select distinct t from sh, lateral (values (sh.hi), (sh.lo)) v(t)),
  iv as (select t top, lead(t) over (order by t desc) bot from b),
  sur as (
    select iv.top, (coalesce((select sum(cp) from sh where hot and hi >= iv.top and lo <= iv.bot), 0)
                    - coalesce((select sum(cp) from sh where not hot and hi >= iv.top and lo <= iv.bot), 0))
                   * (iv.top - iv.bot) q
      from iv where iv.bot is not null),
  cas as (select sum(q) over (order by top desc) c from sur)
  select greatest(0, -min(c)) into v_s_igrita_pinch_hot_utility_kw from cas;
  select sum(case when hot then cp * (sup - tgt) else 0 end), sum(case when hot then 0 else cp * (tgt - sup) end)
    into v_hot_duty, v_cold_duty
    from (select (e->>'supplyC')::numeric sup, (e->>'targetC')::numeric tgt, (e->>'cpKWperK')::numeric cp,
                 (e->>'supplyC')::numeric > (e->>'targetC')::numeric hot
            from jsonb_array_elements(v_igrita_streams) e) x;
  v_s_igrita_pinch_cold_utility_kw := v_s_igrita_pinch_hot_utility_kw + v_hot_duty - v_cold_duty;

  -- EXPERT, IKORODU. A measure's capital is annualised over its life by the
  -- capital recovery factor r(1+r)^n / ((1+r)^n - 1); its net annual cost is
  -- that plus its running cost less its savings; its cost per tonne is the net
  -- over its tonnes a year. The curve's weighted average is the net annual cost
  -- of all six over their tonnes. The baseline is the inventory line by line
  -- on the declared set; the target falls in a straight line to the stated
  -- percent below it in the end year; every measure with a start year at or
  -- before the end year counts in full; the gap is what is left above the
  -- target. The economiser's tonnes are its GJ times its factor, its savings
  -- its GJ times the fuel price, annualised at its own rate and life.
  v_r := {scalar('IKORODU_DISCOUNT_RATE')};
  v_s_ikorodu_boiler_tuning_cost_per_t_usd := {measure(BT, 'per_t')};
  v_s_ikorodu_waste_heat_cost_per_t_usd := {measure(WH, 'per_t')};
  v_s_ikorodu_flare_recovery_net_annual_cost_usd := {measure(FG, 'net')};
  select sum((m->>'capitalCost')::numeric * v_r * power(1 + v_r, (m->>'lifeYears')::numeric)
             / (power(1 + v_r, (m->>'lifeYears')::numeric) - 1)
             + (m->>'annualCost')::numeric - (m->>'annualSavings')::numeric)
         / sum((m->>'tonnesAbatedPerYear')::numeric)
    into v_s_ikorodu_curve_weighted_average_usd_per_t
    from jsonb_array_elements(v_ikorodu_measures) m;
  v_base := {n('IKORODU_LINES', 'boilersCo2T')} + {n('IKORODU_LINES', 'turbinesCo2T')} + {n('IKORODU_LINES', 'flareCo2T')}
            + ({n('IKORODU_LINES', 'flareCh4T')} + {n('IKORODU_LINES', 'ventCh4T')}) * v_gwp_ch4
            + {n('IKORODU_LINES', 'powerMWh')} * {n('IKORODU_LINES', 'powerFactor')};
  v_target_end := v_base * (1 - {n('IKORODU_PLAN', 'targetReductionPercentByEnd')} / 100.0
                  * (({n('IKORODU_PLAN', 'endYear')} - {n('IKORODU_PLAN', 'startYear')})
                     / ({n('IKORODU_PLAN', 'endYear')} - {n('IKORODU_PLAN', 'startYear')})));
  select coalesce(sum((m->>'tonnesAbatedPerYear')::numeric), 0) into v_abated
    from jsonb_array_elements(v_ikorodu_measures) m
   where jsonb_typeof(m->'startYear') = 'number' and (m->>'startYear')::numeric <= {n('IKORODU_PLAN', 'endYear')};
  v_s_ikorodu_path_final_gap_t := greatest(0, v_base - v_abated - v_target_end);
  v_tco2 := {n('IKORODU_SAVING', 'energySavedGJ')} * {n('IKORODU_SAVING', 'emissionFactorKgCo2ePerGJ')} / 1000.0;
  v_crf := {n('IKORODU_SAVING', 'discountRate')} * power(1 + {n('IKORODU_SAVING', 'discountRate')}, {n('IKORODU_SAVING', 'lifeYears')})
           / (power(1 + {n('IKORODU_SAVING', 'discountRate')}, {n('IKORODU_SAVING', 'lifeYears')}) - 1);
  v_s_ikorodu_saving_cost_per_t_usd := ({n('IKORODU_SAVING', 'implementationCost')} * v_crf
                                        - {n('IKORODU_SAVING', 'energySavedGJ')} * {n('IKORODU_SAVING', 'fuelCostPerGJ')}) / v_tco2;
''')
ORACLE_ONLY = ('igrita_efficiency_lhv_pct', 'igrita_tuning_saving_gj')
SQL_ROUTE = [k for k in KEYS if k not in ORACLE_ONLY]
for k in SQL_ROUTE:
    assert f'v_s_{k} :=' in '\n'.join(B) or f'into v_s_{k}' in '\n'.join(B), f'no SQL route for {k}'
for k in SQL_ROUTE:
    A(f'''  if v_s_{k} is null or abs(v_s_{k} - {V[k]}) > {tnum(TOL[k])} then
    raise exception '{GL}: the second route in SQL gives % over the capstone records, not within {tnum(TOL[k])} of the seeded %{name(k)}', v_s_{k}, {V[k]};
  end if;
  if abs(v_s_{k} - {V[k]}) / {tnum(TOL[k])} > v_worst then
    v_worst := abs(v_s_{k} - {V[k]}) / {tnum(TOL[k])}; v_worst_key := '{TIER_OF[k]}/{k}';
  end if;''')
A(f"  raise notice 'carbon go-live: second route in SQL, {len(SQL_ROUTE)} fields, largest disagreement % of a tolerance (%)', round(v_worst, 6), v_worst_key;")

# ------------------------------------------------------- 3. the oracle
A('\n  -- ---------------------------------------------------- 3. against the oracle')
A('  -- oracle_check.py --json, run when this file was generated. The value and the')
A('  -- oracle function it came from are written in; igrita_efficiency_lhv_pct and')
A('  -- igrita_tuning_saving_gj have no other second route.')
A("  v_worst := 0; v_worst_key := '(none)';")
for k in KEYS:
    o = ORACLE[k]
    A(f'''  -- {k}: {o['method']}
  if abs({num(o['value'])} - {V[k]}) > {tnum(TOL[k])} then
    raise exception 'carbon go-live refused: the oracle gives {num(o['value'])}, not within {tnum(TOL[k])} of the seeded %{name(k)}', {V[k]};
  end if;
  if abs({num(o['value'])} - {V[k]}) / {tnum(TOL[k])} > v_worst then
    v_worst := abs({num(o['value'])} - {V[k]}) / {tnum(TOL[k])}; v_worst_key := '{TIER_OF[k]}/{k}';
  end if;''')
A("  raise notice 'carbon go-live: the oracle, 18 fields, largest disagreement % of a tolerance (%)', round(v_worst, 6), v_worst_key;")

# ------------------------------------------------------ 4. the traps bite
A('\n  -- ------------------------------------------------- 4. the traps bite')
A('  -- Each is the wrong route discriminate.mjs swept through the engine that')
A('  -- lands CLOSEST to the graded value. It must lie outside the tolerance, or')
A('  -- the field does not discriminate the trap it is for.')
for k in KEYS:
    rname, val = TRAPS[k]
    why = rname.replace('_', ' ')
    A(f'''  if abs({num(val)} - {V[k]}) <= {tnum(TOL[k])} then
    raise exception 'carbon go-live refused: the trap ({why}) reads {num(val)}, inside the tolerance of the seeded %, so the field does not discriminate the trap{name(k)}', {V[k]};
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

  raise notice 'carbon go-live: {SLUG} available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
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
print('engine: 18 of 18 fields.json values equal carbon_capstone.mjs --json through the vendored engines')
print(f'second route in SQL: {len(SQL_ROUTE)} closed-form fields; {", ".join(ORACLE_ONLY)} by the oracle')
worst = max(KEYS, key=lambda k: abs(ORACLE[k]['value'] - F[k]) / TOL[k])
print(f'oracle: 18 of 18 within tolerance at generation; largest {abs(ORACLE[worst]["value"] - F[worst]) / TOL[worst]:.4f} '
      f'of a tolerance ({worst})')
closest = min(KEYS, key=lambda k: abs(TRAPS[k][1] - F[k]) / TOL[k])
print(f'traps that must bite: {len(TRAPS)}, the closest {closest} by {TRAPS[closest][0]}, '
      f'{abs(TRAPS[closest][1] - F[closest]) / TOL[closest]:.1f} tolerances out')
print(f'digest sweep: {len(DIGEST_NUMS)} distinct numbers | intermediates: {len(DERIVED)} | prompt tokens: {GC.sql_tokens}')
print(f'graded fields named by at least one refusal: {len(named & {f"{TIER_OF[k]}/{k}" for k in KEYS})} of 18')
print('integer-division guard: 0 | unclosed literals: 0 | en/em dashes: 0')
