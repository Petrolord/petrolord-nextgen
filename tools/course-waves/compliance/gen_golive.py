#!/usr/bin/env python3
"""Generate the compliance go-live migration.

NOTHING HERE IS RETYPED. The eighteen graded values are read out of the
CAPSTONE ROWS THE LADDER ITSELF SEEDED, by key, inside the same transaction.
They are then checked three ways, and none of the three is a restatement of the
generator that wrote them:

1. AGAINST THE ENGINE. gen_course.py runs `node compliance_capstone.mjs --json`
   through the vendored engines under the clock guard when this file is
   generated, and refuses if fields.json disagrees with that run. The values
   the go-live compares the seeded rows to are that run's, so a capstone row
   left behind by an earlier seed (the course migration inserts with
   `on conflict do nothing`) is refused here by name.

2. BY A SECOND ROUTE IN SQL, over the capstone records the prompts were written
   from. Every graded value is recomputed by Postgres with the engine's rules
   written out in SQL: the earlier of the due date and the permit expiry, the
   schedule rolled by the frequency's months with the month-end pulled back
   (Postgres date + interval does exactly that), a review date from the ISSUE
   date, the resolved statuses of an inspection point, the six requests decided
   by canRemoveCheckpoint's and canDecideCheckpoint's rules in the order they
   arrive, the open NCR statuses and Math.round of the mean, an answered
   checklist question (a Not applicable needs its reason), a delivered audit
   (Reported or Closed), and coverage by an INTERNAL audit that is Reported or
   Closed, examined inside the certification cycle, with a Not examined row
   counting for nothing. It is an oracle in a second language, and the dry run
   is what proves it agrees with the engine on these records.

   AND THE RECORDS IT READS ARE THE RECORDS THE LEARNER READS. Each shipped
   prompt must equal capstone.json's prompt byte for byte, and that prompt is
   rendered by compliance_capstone.mjs from the same record objects embedded
   below. The requests the second route decides must come out exactly as the
   engine decided them in capstone.json's request log.

3. BY THE TRAPS THE COURSE IS BUILT ON, which must BITE on these records. For
   every one of the eighteen fields the go-live computes a reading a learner
   who missed the lesson would give, each one a route discriminate.mjs already
   swept with the ENGINE, and refuses unless it differs from the graded value.

WHAT IT REFUSES TO WRITE: a refusal that reads a graded value and does not name
it; a division with a bare integer denominator; an unclosed literal; an em or
en dash; a go-live whose engine run and fields.json disagree.

Usage: python3 gen_golive.py
   CQ_WAVE        the wave directory (default /root/as-wip-compliance)
   CQ_REPO        the nextgen clone   (default /root/wt-as-compliance-nextgen)
   CQ_ENGINES     packages/engines to run the capstone through
   CQ_COURSE_SQL  the course migration this ladder emits, for the prompt checks
   CQ_GOLIVE_OUT  where to write
"""
import json
import os
import re
import sys

W = os.environ.get('CQ_WAVE', '/root/as-wip-compliance')
REPO = os.environ.get('CQ_REPO', '/root/wt-as-compliance-nextgen')
COURSE = os.environ.get('CQ_COURSE_SQL', f'{REPO}/migrations/20261002_cq_compliance_course.sql')
OUT = os.environ.get('CQ_GOLIVE_OUT', f'{REPO}/migrations/20261002_cq_compliance_go_live.sql')

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ['CQ_WAVE'] = W
import gen_course as GC  # noqa: E402  (runs the engine; writes nothing on import)

SLUG, MODULE, PATH_ORDER = GC.SLUG, GC.MODULE, GC.PATH_ORDER
AS_OF = GC.AS_OF
fields = GC.fields
assert len(fields) == 18, f'{len(fields)} graded fields'
KEYS = GC.KEYS
TIER_OF = GC.TIER_OF
F = GC.F
ENGINE = GC.ENGINE
REC = GC.RECORDS
assert len(set(KEYS)) == 18, 'two graded fields share a key'
refused = list(GC.bad)

# The course migration this ladder ships must carry the prompts verbatim.
course_sql = open(COURSE, encoding='utf-8').read()
for t in GC.TIERS:
    if GC.q(GC.PROMPTS[t]) not in course_sql:
        refused.append(f'the course migration at {COURSE} does not carry the {t} prompt of capstone.json')

REQUEST_LOG = [bool(r['ok']) for r in GC.capstone['requestLog']]
if len(REQUEST_LOG) != len(REC['UTAPATE_REQUESTS']):
    refused.append('capstone.json logs a different number of requests from the records')


def lit(s):
    return "'" + s.replace("'", "''") + "'"


def jlit(obj):
    return lit(json.dumps(obj, ensure_ascii=False, separators=(',', ':'))) + '::jsonb'


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
-- compliance GO-LIVE (HELD): Compliance, Audit & Quality flips to 'available',
-- the second course of the Assurance module, at path_order 60.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/compliance. The 78 lessons, the teaching lab
-- (complianceLab.js) and its three explorer panels (register, plan and
-- readiness) ship in the ZIP and NOT in this database, so a flip before the
-- upload puts a live catalogue tile in front of a route that does not exist.
-- This file is written, dry-run and left unapplied on purpose.
--
-- EVERY GRADED VALUE IS CHECKED THREE WAYS, and none restates the generator:
--
--   1. against the ENGINE, run through the vendored engines when this file was
--      generated (compliance_capstone.mjs --json), so a capstone row an earlier
--      seed left behind is refused by name;
--   2. by a SECOND ROUTE IN SQL over the capstone records the prompts were
--      rendered from: the go-live first proves each shipped prompt is the
--      rendered one byte for byte, then recomputes all eighteen values from
--      those records with the engine rules written out in SQL, including the
--      six requests decided in order by the checkpoint rules;
--   3. by the TRAPS the course is built on, one for every field, each of which
--      must bite on these records: the reading a learner who missed the lesson
--      would give is computed and refused if it equals the graded value.
--
-- THE AS-OF DATE IS {AS_OF}, the one date every capstone prompt states. It is a
-- literal below and never current_date, so this file gives the same verdict on
-- whatever day it is run.
--
-- THE GRADER IS NUMERIC. academy_submit_capstone casts expected, tol and the
-- answer to numeric. Every field must carry a whole-number expected value at
-- tolerance 0.5 with a label and a unit, and all of it is asserted here, on
-- the rows as seeded.
--
-- EVERY REFUSAL THAT READS A GRADED VALUE NAMES IT as tier/key.
-- ============================================================================"""

B = []
A = B.append

A('do $$')
A('declare')
A('  v_structures int; v_questions int; v_capstones int; v_lessons int;')
A('  v_modules int; v_graded int; v_available int; v_soon int; v_n int;')
A('  v_names text; v_prompt text; v_wrong numeric;')
A('  v_rq jsonb; v_cp jsonb; v_next jsonb; v_ok boolean; v_ver boolean;')
A("  v_log jsonb := '[]'::jsonb; v_pts jsonb; v_pts_sent jsonb; v_cutoff date;")
A(f"  v_asof date := date '{AS_OF}';")
for k in KEYS:
    A(f'  {V[k]} numeric; v_s_{k} numeric;')
for name_, recs in REC.items():
    A(f'  v_{name_.lower()} jsonb := {jlit(recs)};')
A(f'  v_request_log jsonb := {jlit(REQUEST_LOG)};')
A('begin')

# ------------------------------------------------------------------ shape
A(f'''
  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures
   where app_slug = '{SLUG}' and active;
  if v_structures <> 3 then
    raise exception 'compliance go-live refused: {SLUG} has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions from public.academy_quiz_questions where app_slug = '{SLUG}';
  if v_questions <> 396 then
    raise exception 'compliance go-live refused: {SLUG} has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_n from (
    select tier from public.academy_quiz_questions where app_slug = '{SLUG}'
     group by tier having count(*) <> 132) t;
  if v_n <> 0 then
    raise exception 'compliance go-live refused: % tier(s) do not carry exactly 132 questions', v_n;
  end if;

  select count(*) into v_n from (
    select tier, module_key from public.academy_quiz_questions
     where app_slug = '{SLUG}' and scope = 'module'
     group by tier, module_key having count(*) <> 15) t;
  if v_n <> 0 then
    raise exception 'compliance go-live refused: % module bank(s) do not carry exactly 15 questions', v_n;
  end if;

  select count(*) into v_n from (
    select tier from public.academy_quiz_questions
     where app_slug = '{SLUG}' and scope = 'final'
     group by tier having count(*) <> 42) t;
  if v_n <> 0 then
    raise exception 'compliance go-live refused: % final exam(s) do not carry exactly 42 questions', v_n;
  end if;

  -- A key outside its own options is unanswerable, and a count of rows cannot
  -- see it.
  select count(*) into v_n from public.academy_quiz_questions
   where app_slug = '{SLUG}'
     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);
  if v_n <> 0 then
    raise exception 'compliance go-live refused: % question(s) do not offer four options with a key inside them', v_n;
  end if;

  select count(*) into v_lessons
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m,
         lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = '{SLUG}' and s.active;
  if v_lessons <> 78 then
    raise exception 'compliance go-live refused: {SLUG} carries % lesson keys, expected 78', v_lessons;
  end if;

  select count(*) into v_modules
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = '{SLUG}' and s.active;
  if v_modules <> 18 then
    raise exception 'compliance go-live refused: {SLUG} carries % modules, expected 18 (six per tier)', v_modules;
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
    raise exception 'compliance go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_n;
  end if;

  select count(*) into v_capstones from public.academy_capstones where app_slug = '{SLUG}';
  if v_capstones <> 3 then
    raise exception 'compliance go-live refused: {SLUG} has % capstones, expected 3', v_capstones;
  end if;

  select count(*) into v_graded from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f where c.app_slug = '{SLUG}';
  if v_graded <> 18 then
    raise exception 'compliance go-live refused: {SLUG} has % graded capstone fields, expected 18', v_graded;
  end if;

  select count(*) into v_n from (
    select c.tier from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug = '{SLUG}' group by c.tier having count(*) <> 6) t;
  if v_n <> 0 then
    raise exception 'compliance go-live refused: % tier(s) do not grade exactly six fields', v_n;
  end if;

  if not exists (select 1 from public.academy_apps
                  where slug = '{SLUG}' and module = '{MODULE}'
                    and path_order = {PATH_ORDER} and prereq_slug is null) then
    raise exception 'compliance go-live refused: the {SLUG} catalogue row is not {MODULE} at path_order {PATH_ORDER} with no prerequisite';
  end if;

  if exists (select 1 from public.academy_apps where path_order = {PATH_ORDER} and slug <> '{SLUG}') then
    raise exception 'compliance go-live refused: another course already holds path_order {PATH_ORDER}';
  end if;

  if exists (select 1 from public.academy_apps where path_order = {GC.SIBLING_PATH_ORDER} and slug <> '{GC.SIBLING_SLUG}') then
    raise exception 'compliance go-live refused: path_order {GC.SIBLING_PATH_ORDER}, the Assurance sibling slot, is held by a course other than {GC.SIBLING_SLUG}';
  end if;

  -- ------------------------------------------------- the grader is numeric
  -- Every field a whole number at 0.5, with a label and a unit.
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = '{SLUG}'
     and (jsonb_typeof(f->'expected') <> 'number' or jsonb_typeof(f->'tol') <> 'number'
          or (f->>'expected')::numeric <> round((f->>'expected')::numeric)
          or (f->>'tol')::numeric <> 0.5
          or coalesce(f->>'label', '') = '' or coalesce(f->>'unit', '') = '');
  if v_n <> 0 then
    raise exception 'compliance go-live refused: % graded field(s) are not a whole number at tolerance 0.5 with a label and a unit: %', v_n, v_names;
  end if;
''')

# ------------------------------------------------------------ the prompts
A('\n  -- ---------------------------------------- the prompts the learner reads')
A('  -- Each shipped prompt is capstone.json\'s, byte for byte, which')
A('  -- compliance_capstone.mjs rendered from the records the second route reads.')
for tier in GC.TIERS:
    A(f'''  select prompt into v_prompt from public.academy_capstones where app_slug = '{SLUG}' and tier = '{tier}';
  if v_prompt is distinct from {lit(GC.PROMPTS[tier])} then
    raise exception 'compliance go-live refused: the {tier} prompt is not the prompt capstone.json carries, so the second route may be reading records the learner never saw';
  end if;''')

# ------------------------------------------------ load the eighteen values
A('\n  -- --------------------------------------- the eighteen graded values')
for k in KEYS:
    A(f"""  select (f->>'expected')::numeric into {V[k]}
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = '{SLUG}' and c.tier = '{TIER_OF[k]}' and f->>'key' = '{k}';""")
A('  if ' + '\n     or '.join(f'{V[k]} is null' for k in KEYS) + ' then')
A("    raise exception 'compliance go-live refused: one or more of the eighteen graded fields is missing';")
A('  end if;')

DERIVED = GC.DERIVED
A(f'''
  -- PROMPTS. No graded value of any tier is a number token in any prompt once
  -- its YYYY-MM-DD conditions are taken out, signed or absolute, and none of
  -- the five dates the engine derives on the way to a graded day count is
  -- printed in any prompt, label, dataset or title.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key') || ' in the ' || p.tier || ' prompt', ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         public.academy_capstones p,
         lateral regexp_matches(
           regexp_replace(p.prompt, '[0-9]{{4}}-[0-9]{{2}}-[0-9]{{2}}', ' ', 'g'),
           '(?:^|[^A-Za-z0-9_.-])(-?[0-9]+(\\.[0-9]+)?)(?![A-Za-z0-9_.])', 'g') as m
   where c.app_slug = '{SLUG}' and p.app_slug = '{SLUG}'
     and abs(abs((f->>'expected')::numeric) - abs((m[1])::numeric)) <= (f->>'tol')::numeric;
  if v_n <> 0 then
    raise exception 'compliance go-live refused: % graded field(s) are printed in a prompt: %', v_n, v_names;
  end if;

  -- The sweep must be able to fire: Postgres must read exactly the number
  -- tokens gen_course.py read out of the same three prompts ({GC.prompt_tokens}), or
  -- the regex above is reading something else and its 0 means nothing.
  select count(*) into v_n
    from public.academy_capstones p,
         lateral regexp_matches(
           regexp_replace(p.prompt, '[0-9]{{4}}-[0-9]{{2}}-[0-9]{{2}}', ' ', 'g'),
           '(?:^|[^A-Za-z0-9_.-])(-?[0-9]+(\\.[0-9]+)?)(?![A-Za-z0-9_.])', 'g') as m
   where p.app_slug = '{SLUG}';
  if v_n <> {GC.prompt_tokens} then
    raise exception 'compliance go-live refused: the prompt sweep read % number tokens, and gen_course.py read {GC.prompt_tokens} from the same prompts', v_n;
  end if;

  select count(*), string_agg(d || ' in the ' || p.tier || ' capstone', ', ')
    into v_n, v_names
    from public.academy_capstones p,
         unnest(array[{', '.join(lit(d) for d in DERIVED)}]) d
   where p.app_slug = '{SLUG}'
     and strpos(p.prompt || ' ' || p.dataset || ' ' || p.title || ' ' || p.fields::text, d) > 0;
  if v_n <> 0 then
    raise exception 'compliance go-live refused: % engine-derived date(s) are printed in a capstone: %', v_n, v_names;
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
    raise exception 'compliance go-live refused: % pair(s) of graded fields are within the looser of their two tolerances: %', v_n, v_names;
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


def num_lit(x):
    return str(int(x)) if float(x).is_integer() else repr(x)


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
     and exists (select 1 from unnest(array[{', '.join(num_lit(x) for x in DIGEST_NUMS)}]::numeric[]) d
                  where abs(abs((f->>'expected')::numeric) - d) <= (f->>'tol')::numeric);
  if v_n <> 0 then
    raise exception 'compliance go-live refused: % graded field(s) are within tolerance of a number the digest prints: %', v_n, v_names;
  end if;
''')

# ------------------------------------------------------- 1. the engine
A('\n  -- ---------------------------------------------------- 1. against the engine')
for k in KEYS:
    A(f'''  if {V[k]} <> {ENGINE[k]} then
    raise exception 'compliance go-live refused: the seeded value % is not the {ENGINE[k]} the engine returned through compliance_capstone.mjs{name(k)}', {V[k]};
  end if;''')

# ------------------------------------------------ 2. the second route in SQL
MONTHS = ("(case {f} when 'Monthly' then 1 when 'Quarterly' then 3 when 'Semi-annual' then 6"
          " when 'Annual' then 12 when 'Biennial' then 24 end)")


def months_of(expr):
    return MONTHS.format(f=expr)


def add_months(date_expr, months_expr):
    """The engine's month step with the month-end pulled back. Postgres date +
    interval clamps to the last day of the target month, which is exactly the
    engine's setDate(0) pull-back."""
    return f"(({date_expr}) + make_interval(months => {months_expr}))::date"


def next_action(due, expiry):
    """nextActionDate: the earlier of the two when both are set."""
    return f"(case when {due} is not null and {expiry} is not null then least({due}, {expiry}) else coalesce({due}, {expiry}) end)"


def half_up(n, d):
    """halfUpPercent: floor((200n + d) / 2d), in numeric so nothing truncates."""
    return f"floor((200 * ({n}) + ({d}))::numeric / (2 * ({d}))::numeric)"


OB = "(select o from jsonb_array_elements(v_ekpe_obligations) o where o->>'code' = {c})"
DOC = "(select d from jsonb_array_elements(v_ekpe_documents) d where d->>'document_number' = {c})"
ob = {r['id']: r['code'] for r in REC['EKPE_OBLIGATIONS']}
docs = [d['document_number'] for d in REC['EKPE_DOCUMENTS']]
e1, e2, e3, e4 = (OB.format(c=lit(ob[i])) for i in ('e1', 'e2', 'e3', 'e4'))
d1, d2 = (DOC.format(c=lit(c)) for c in docs)
dt = lambda rec, col: f"(({rec})->>{lit(col)})::date"  # noqa: E731

RESOLVED = "('Passed', 'Waived', 'Not applicable')"
NCR_OPEN = "('Open', 'Under investigation', 'Disposition agreed', 'Actions in progress', 'Verification')"
FINDING_OPEN = "('Open', 'Correction proposed', 'Action in progress', 'Verification')"
EXAMINED = "('Conformant', 'Nonconformant', 'Observation', 'Not applicable')"
CLAIMS = "('Conformant', 'Partially conformant')"
ANSWERED = "('Conformant', 'Nonconformant', 'Observation', 'Not applicable')"


def last_examined(clause_ref, types="('Internal')", statuses="('Reported', 'Closed')", results=EXAMINED):
    return (f"(select max(coalesce((r->>'examined_on')::date, (a->>'actual_end')::date))"
            f" from jsonb_array_elements(v_obeakpu_audit_clauses) r"
            f" join jsonb_array_elements(v_obeakpu_audits) a on a->>'id' = r->>'audit_id'"
            f" join jsonb_array_elements(v_obeakpu_clauses) c on c->>'id' = r->>'clause_id'"
            f" where c->>'clause_ref' = {lit(clause_ref)} and r->>'result' in {results}"
            f" and a->>'audit_type' in {types} and a->>'status' in {statuses})")


def covered(types="('Internal')", statuses="('Reported', 'Closed')", results=EXAMINED, cutoff='v_cutoff'):
    return (f"(select count(*) from jsonb_array_elements(v_obeakpu_clauses) c"
            f" where coalesce(c->>'applicability', '') <> 'Not applicable'"
            f" and (select max(coalesce((r->>'examined_on')::date, (a->>'actual_end')::date))"
            f" from jsonb_array_elements(v_obeakpu_audit_clauses) r"
            f" join jsonb_array_elements(v_obeakpu_audits) a on a->>'id' = r->>'audit_id'"
            f" where r->>'clause_id' = c->>'id' and r->>'result' in {results}"
            f" and a->>'audit_type' in {types} and a->>'status' in {statuses}) >= {cutoff})")


HAS_EVIDENCE = ("(btrim(coalesce(c->>'evidence_reference', '')) <> '' and coalesce(c->>'assessed_date', '') <> ''"
                " and (coalesce(c->>'assessed_by', '') <> '' or btrim(coalesce(c->>'assessor_name', '')) <> ''))")
APPLICABLE = "coalesce(c->>'applicability', '') <> 'Not applicable'"
of1 = next(f for f in REC['OBEAKPU_FINDINGS'] if f['id'] == 'of1')['finding_code']
FIND = f"(select f from jsonb_array_elements(v_obeakpu_findings) f where f->>'finding_code' = {lit(of1)})"
N_ITEMS = "jsonb_array_length(v_utapate_items)"


def answered(extra_ok='false'):
    return (f"(select count(*) from jsonb_array_elements(v_utapate_items) i"
            f" join jsonb_array_elements(v_utapate_responses) r on r->>'item_id' = i->>'id'"
            f" where r->>'result' in {ANSWERED}"
            f" and (r->>'result' <> 'Not applicable' or btrim(coalesce(r->>'note', '')) <> '' or {extra_ok}))")


def resolved_in(pts):
    return f"(select count(*) from jsonb_array_elements({pts}) p where p->>'status' in {RESOLVED})"


A(f'''
  -- ----------------------------------------------- 2. the second route in SQL
  -- ASSOCIATE, EKPE. The next action date is the earlier of the due date and
  -- the permit expiry. A filing rolls the schedule forward from the date that
  -- was DUE by the frequency's months, and the month-end is pulled back (date +
  -- interval in Postgres). The period a filing must fall in starts the same
  -- months back. A document's review date runs from its ISSUE date, never from
  -- a correction. Whole days are a date minus the as-of date.
  v_s_ekpe_emissions_permit_next_action_days := {next_action(dt(e1, 'due_date'), dt(e1, 'expiry_date'))} - v_asof;
  v_s_ekpe_community_report_next_due_days :=
    {add_months(dt(e2, 'due_date'), months_of(f"({e2})->>'frequency'"))} - v_asof;
  v_s_ekpe_waste_return_period_start_days :=
    {add_months(dt(e3, 'due_date'), '-' + months_of(f"({e3})->>'frequency'"))} - v_asof;
  v_s_ekpe_abstraction_next_action_after_filing_days :=
    {next_action(add_months(dt(e4, 'due_date'), months_of(f"({e4})->>'frequency'")), dt(e4, 'expiry_date'))} - v_asof;
  v_s_ekpe_slug_catcher_procedure_review_days :=
    {add_months(dt(d1, 'issue_date'), f"(({d1})->>'review_period_months')::int")} - v_asof;
  v_s_ekpe_emergency_plan_review_days :=
    {add_months(dt(d2, 'issue_date'), f"(({d2})->>'review_period_months')::int")} - v_asof;

  -- PROFESSIONAL, UTAPATE. A point is resolved when it is Passed, Waived or Not
  -- applicable; Failed is the most outstanding thing on a plan. Every percent
  -- is floor((200n + d) / 2d). The six requests are decided IN ORDER by the
  -- engine's rules: a point is removed only while nothing is recorded on it and,
  -- once the plan has left Draft, never a hold point; Passed, Failed and Waived
  -- need a date and a verifier; Waived needs a reason; a hold point set Not
  -- applicable needs the date, the verifier and the reason. A refused request
  -- changes nothing. v_pts_sent applies every request as sent, for the trap.
  v_s_utapate_itp_progress_pct := {half_up(resolved_in('v_utapate_checkpoints'), 'jsonb_array_length(v_utapate_checkpoints)')};
  v_pts := v_utapate_checkpoints;
  v_pts_sent := v_utapate_checkpoints;
  for v_rq in select e.value from jsonb_array_elements(v_utapate_requests) with ordinality e(value, o) order by e.o loop
    select p into v_cp from jsonb_array_elements(v_pts) p where p->>'id' = v_rq->>'item';
    if v_rq->>'kind' = 'remove' then
      v_ok := v_utapate_plan->>'status' not in ('Superseded', 'Closed', 'Cancelled')
              and coalesce(v_cp->>'status', 'Pending') in ('Pending', 'Notified', 'In progress')
              and coalesce(v_cp->>'result_date', '') = ''
              and not (v_cp->>'point_type' = 'Hold point' and v_utapate_plan->>'status' <> 'Draft');
      if v_ok then
        select coalesce(jsonb_agg(e.p order by e.o), '[]'::jsonb) into v_pts
          from jsonb_array_elements(v_pts) with ordinality e(p, o) where e.p->>'id' <> v_rq->>'item';
      end if;
      select coalesce(jsonb_agg(e.p order by e.o), '[]'::jsonb) into v_pts_sent
        from jsonb_array_elements(v_pts_sent) with ordinality e(p, o) where e.p->>'id' <> v_rq->>'item';
    else
      v_next := v_cp || coalesce(v_rq->'patch', '{{}}'::jsonb) || jsonb_build_object('status', v_rq->>'status');
      v_ver := coalesce(v_next->>'result_date', '') <> ''
               and (coalesce(v_next->>'verified_by', '') <> '' or btrim(coalesce(v_next->>'verifier_name', '')) <> '');
      v_ok := not (v_next->>'status' in ('Passed', 'Failed', 'Waived') and not v_ver)
              and not (v_next->>'status' = 'Not applicable' and v_next->>'point_type' = 'Hold point'
                       and (not v_ver or btrim(coalesce(v_next->>'remarks', '')) = ''))
              and not (v_next->>'status' = 'Waived' and btrim(coalesce(v_next->>'remarks', '')) = '');
      if v_ok then
        select jsonb_agg(case when e.p->>'id' = v_rq->>'item' then v_next else e.p end order by e.o) into v_pts
          from jsonb_array_elements(v_pts) with ordinality e(p, o);
      end if;
      select jsonb_agg(case when e.p->>'id' = v_rq->>'item'
                            then e.p || coalesce(v_rq->'patch', '{{}}'::jsonb) || jsonb_build_object('status', v_rq->>'status')
                            else e.p end order by e.o) into v_pts_sent
        from jsonb_array_elements(v_pts_sent) with ordinality e(p, o);
    end if;
    v_log := v_log || to_jsonb(v_ok);
  end loop;
  if v_log <> v_request_log then
    raise exception 'compliance go-live refused: the checkpoint rules in SQL decide the six requests as %, and the engine decided them as % in capstone.json{name('utapate_itp_progress_after_requests_pct')}', v_log, v_request_log;
  end if;
  v_s_utapate_itp_progress_after_requests_pct := {half_up(resolved_in('v_pts'), 'jsonb_array_length(v_pts)')};

  -- An NCR is open in five statuses; a closed or voided one stops ageing. The
  -- mean is Math.round of the mean, half up.
  select max(v_asof - (n->>'raised_date')::date), floor(avg(v_asof - (n->>'raised_date')::date) + 0.5)
    into v_s_utapate_oldest_open_ncr_days, v_s_utapate_mean_open_ncr_age_days
    from jsonb_array_elements(v_utapate_ncrs) n where n->>'status' in {NCR_OPEN};

  -- A question is answered by a recorded result, and a Not applicable only with
  -- its written reason. A delivered audit is Reported or Closed; a cancellation,
  -- with or without its reason, is not a delivered audit.
  v_s_utapate_checklist_progress_pct := {half_up(answered(), N_ITEMS)};
  v_s_utapate_programme_delivered_pct := {half_up("(select count(*) from jsonb_array_elements(v_utapate_audits) a where a->>'status' in ('Reported', 'Closed'))", 'jsonb_array_length(v_utapate_audits)')};

  -- EXPERT, OBEAKPU. An examination counts towards coverage only from an
  -- INTERNAL audit that is Reported or Closed, only when its result is an
  -- examination (a Not examined row is nothing), dated by its own examined_on
  -- and else the audit's actual end. A clause is covered when its last counting
  -- examination is on or after the same day cycle_years back (month-end pulled
  -- back). An evidenced claim is an applicable clause claiming Conformant or
  -- Partially conformant with an evidence reference, an assessed date and an
  -- assessor. A closed finding stops ageing at its closed date.
  v_cutoff := (v_asof - make_interval(years => coalesce((v_obeakpu_standard->>'cycle_years')::int, 3)))::date;
  v_s_obeakpu_clause_812_last_examined_days := {last_examined('8.1.2')} - v_asof;
  v_s_obeakpu_clause_93_last_examined_days := {last_examined('9.3')} - v_asof;
  select greatest(0, case when f->>'status' not in {FINDING_OPEN} and coalesce(f->>'closed_date', '') <> ''
                          then (f->>'closed_date')::date else v_asof end - (f->>'raised_date')::date)
    into v_s_obeakpu_closed_major_finding_age_days from {FIND} x(f);
  select count(*) into v_s_obeakpu_evidenced_claims from jsonb_array_elements(v_obeakpu_clauses) c
   where {APPLICABLE} and c->>'status' in {CLAIMS} and {HAS_EVIDENCE};
  v_s_obeakpu_certificate_days := (v_obeakpu_standard->>'certificate_expires')::date - v_asof;
  v_s_obeakpu_clauses_covered := {covered()};
''')
for k in KEYS:
    A(f'''  if v_s_{k} is distinct from {V[k]} then
    raise exception 'compliance go-live refused: the second route in SQL gives % over the capstone records, against the seeded %{name(k)}', v_s_{k}, {V[k]};
  end if;''')

# ------------------------------------------------------ 3. the traps bite
fil = REC['EKPE_FILINGS']
TRAPS = [
    ('ekpe_emissions_permit_next_action_days',
     'counting to the due date and missing the permit that expires first',
     f"select {dt(e1, 'due_date')} - v_asof"),
    ('ekpe_community_report_next_due_days',
     'rolling the schedule forward from the filing date instead of the date that was due',
     f"select {add_months(f'date {lit(fil['e2'])}', months_of(f'({e2})->>' + lit('frequency')))} - v_asof"),
    ('ekpe_waste_return_period_start_days',
     'taking the last filing as the start of the period',
     f"select {dt(e3, 'last_submitted_date')} - v_asof"),
    ('ekpe_abstraction_next_action_after_filing_days',
     'leaving the filed return unrolled',
     f"select {next_action(dt(e4, 'due_date'), dt(e4, 'expiry_date'))} - v_asof"),
    ('ekpe_slug_catcher_procedure_review_days',
     'counting the review period from the correction instead of the issue',
     f"select {add_months(dt(d1, 'corrected_on'), f'(({d1})->>' + lit('review_period_months') + ')::int')} - v_asof"),
    ('ekpe_emergency_plan_review_days',
     'the default 24 month review period used instead of the document\'s own',
     f"select {add_months(dt(d2, 'issue_date'), '24')} - v_asof"),
    ('utapate_itp_progress_pct',
     'a failed point counted as done',
     f"select {half_up(f'(select count(*) from jsonb_array_elements(v_utapate_checkpoints) p where p->>{lit(chr(115) + 'tatus')} in ({RESOLVED[1:-1]}, {lit('Failed')}))', 'jsonb_array_length(v_utapate_checkpoints)')}"),
    ('utapate_itp_progress_after_requests_pct',
     'every request applied as sent, the refused ones included',
     f"select {half_up(resolved_in('v_pts_sent'), 'jsonb_array_length(v_pts_sent)')}"),
    ('utapate_oldest_open_ncr_days',
     'the voided and closed NCRs aged to the as-of date',
     "select max(v_asof - (n->>'raised_date')::date) from jsonb_array_elements(v_utapate_ncrs) n"),
    ('utapate_mean_open_ncr_age_days',
     'the closed and voided NCRs averaged in at their closed dates',
     "select floor(avg(coalesce(case when n->>'status' in " + NCR_OPEN + " then v_asof end, (n->>'closed_date')::date, v_asof)"
     " - (n->>'raised_date')::date) + 0.5) from jsonb_array_elements(v_utapate_ncrs) n"),
    ('utapate_checklist_progress_pct',
     'a Not applicable with its reason left blank counted as answered',
     f"select {half_up(answered('true'), N_ITEMS)}"),
    ('utapate_programme_delivered_pct',
     'the cancelled audits counted as delivered',
     f"select {half_up(chr(40) + 'select count(*) from jsonb_array_elements(v_utapate_audits) a where a->>' + lit('status') + ' in (' + lit('Reported') + ', ' + lit('Closed') + ', ' + lit('Cancelled') + '))', 'jsonb_array_length(v_utapate_audits)')}"),
    ('obeakpu_clause_812_last_examined_days',
     'the examination in the audit still In progress counted',
     f"select {last_examined('8.1.2', statuses=chr(40) + lit('Reported') + ', ' + lit('Closed') + ', ' + lit('In progress') + ')')} - v_asof"),
    ('obeakpu_clause_93_last_examined_days',
     'the Not examined row counted as an examination',
     f"select {last_examined('9.3', results=chr(40) + EXAMINED[1:-1] + ', ' + lit('Not examined') + ')')} - v_asof"),
    ('obeakpu_closed_major_finding_age_days',
     'the closed finding aged to the as-of date',
     f"select v_asof - (f->>'raised_date')::date from {FIND} x(f)"),
    ('obeakpu_evidenced_claims',
     'every conformity claim counted whether or not its evidence record is whole',
     f"select count(*) from jsonb_array_elements(v_obeakpu_clauses) c where {APPLICABLE} and c->>'status' in {CLAIMS}"),
    ('obeakpu_certificate_days',
     'the days since the certificate expired given as a positive count',
     "select abs((v_obeakpu_standard->>'certificate_expires')::date - v_asof)"),
    ('obeakpu_clauses_covered',
     'the certification body\'s surveillance audit counted as internal audit coverage',
     f"select {covered(types=chr(40) + lit('Internal') + ', ' + lit('Surveillance') + ')')}"),
]
A('\n  -- ------------------------------------------------- 3. the traps bite')
A('  -- Each wrong reading is computed over the same records and must MISS the')
A('  -- graded value, or the field does not discriminate the trap it is for.')
for k, why, q_ in TRAPS:
    A(f'''  {q_} into v_wrong;
  if v_wrong is null or v_wrong = {V[k]} then
    raise exception 'compliance go-live refused: {why.replace("'", "''")} gives %, so the field does not discriminate the trap{name(k)}', v_wrong;
  end if;''')

A(f'''
  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = '{SLUG}';
  if not exists (select 1 from public.academy_apps where slug = '{SLUG}' and status = 'available') then
    raise exception 'compliance go-live refused: {SLUG} did not reach status available';
  end if;

  select count(*) filter (where status = 'available'), count(*) filter (where status = 'coming_soon')
    into v_available, v_soon
    from public.academy_apps;

  raise notice 'compliance go-live: {SLUG} available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
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
intdiv = [l.strip()[:90] for l in code.splitlines() if re.search(r'/\s*\d+(?![\d.eE])', l)]
unclosed = code.replace("''", '').count("'") % 2
dashes = len(re.findall('[–—]', sql))
if len(TRAPS) != 18 or {k for k, _w, _q in TRAPS} != set(KEYS):
    refused.append('the traps do not cover all eighteen fields')

if refused or unnamed or intdiv or unclosed or dashes:
    print('REFUSED, nothing written:')
    for b in refused + unnamed + intdiv:
        print('  ', b)
    print('unclosed literal:', bool(unclosed), '| en/em dashes:', dashes)
    sys.exit(1)

open(OUT, 'w').write(sql)
print(f'wrote {OUT}: {len(sql.splitlines())} lines')
print('engine: 18 of 18 fields.json values equal compliance_capstone.mjs --json through the vendored engines')
print(f'second route in SQL: 18 fields, the six requests decided in SQL and matched to the engine log {REQUEST_LOG}')
print(f'traps that must bite: {len(TRAPS)} over {len({k for k, _w, _q in TRAPS})} fields')
print(f'digest sweep: {len(DIGEST_NUMS)} distinct numbers the digest prints | engine-derived dates: {len(DERIVED)}')
print(f'graded fields named by at least one refusal: {len(named & {f"{TIER_OF[k]}/{k}" for k in KEYS})} of 18')
print('integer-division guard: 0 | unclosed literals: 0 | en/em dashes: 0')
