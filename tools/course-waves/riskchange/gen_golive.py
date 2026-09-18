#!/usr/bin/env python3
"""Generate the riskchange go-live migration.

NOTHING HERE IS RETYPED. The eighteen graded values are read out of the
CAPSTONE ROWS THE LADDER ITSELF SEEDED, by key, inside the same transaction.
They are then checked three ways, and none of the three is a restatement of the
generator that wrote them:

1. AGAINST THE ENGINE'S OWN LEDGER. capstone_calls.json is the record of every
   engine call riskchange_capstone.mjs made, with its result, and it is what
   oracle_bridge.py replays through the Python oracles. The expected values the
   go-live compares the seeded rows to are taken off THAT ledger, and the
   generator refuses if fields.json disagrees with it. A capstone row left
   behind by an earlier seed (the course migration inserts with `on conflict do
   nothing`) is refused here by name.

2. BY A SECOND ROUTE IN SQL, over the records the learner is handed. Every
   graded value is recomputed by Postgres from the capstone records with the
   engine's rules written out in SQL: the per-axis residual fallback and the
   whole-level scale, the four bands by their lower edges, whole calendar days,
   the expiry lead counted inclusively and only while a change is in effect,
   the seven-day ratification window from the actual implementation date with
   no date failing closed, actions on a finished change skipped, the two
   blocking severities with three resolved statuses, an application that
   changed something, the age from the event date, and the review lead of 30
   days on a visible lesson. It is an oracle in a second language, and the dry
   run is what proves it agrees with the engine on these records (plan section
   11: the assertions are written from the engine's output, and the dry run is
   the check that they were).

   AND THE RECORDS IT READS ARE THE RECORDS THE LEARNER READS. The go-live
   asserts that every record line gen_course.py rendered is in the shipped
   prompt of its tier, and that the prompt carries no other record line, so the
   second route cannot be computed over a register the learner never saw.

3. BY THE TRAPS THE COURSE IS BUILT ON, which must BITE on these records. For
   each trap the go-live computes the reading a learner who missed it would
   give and refuses unless it differs from the graded value: the blank residual
   axis, the population, the sign of a passed date, the inclusive lead, the
   finished change's actions, Responded and Rejected still blocking, the
   rejection that applies nothing and is dated later, and the review lead that
   only a visible lesson has. Each wrong reading is one discriminate.mjs
   already computed with the ENGINE; the SQL recomputes it here so the database
   proves it rather than a generator promising it.

WHAT IT REFUSES TO WRITE: a refusal that reads a graded value and does not name
it; a division with a bare integer denominator; an unclosed literal; an em or
en dash; a go-live whose engine ledger and fields.json disagree.

Usage: python3 gen_golive.py
   RC_WAVE        the wave directory (default /root/as-wip-riskchange)
   RC_REPO        the nextgen clone   (default /root/wt-as-riskchange-nextgen)
   RC_COURSE_SQL  the course migration this ladder emits, for the prompt checks
   RC_GOLIVE_OUT  where to write
"""
import json
import os
import re
import sys

W = os.environ.get('RC_WAVE', '/root/as-wip-riskchange')
REPO = os.environ.get('RC_REPO', '/root/wt-as-riskchange-nextgen')
COURSE = os.environ.get('RC_COURSE_SQL', f'{REPO}/migrations/20261001_asrc_riskchange_course.sql')
OUT = os.environ.get('RC_GOLIVE_OUT', f'{REPO}/migrations/20261001_asrc_riskchange_go_live.sql')

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ['RC_WAVE'] = W
import gen_course as GC  # noqa: E402  (renders the prompts; writes nothing on import)

SLUG, MODULE, PATH_ORDER = GC.SLUG, GC.MODULE, GC.PATH_ORDER
AS_OF = GC.CAP['asOf']
fields = GC.fields
assert len(fields) == 18, f'{len(fields)} graded fields'
F = {(t, k): v for t, k, v, _tol in fields}
KEYS = [k for _t, k, _v, _tol in fields]
TIER_OF = {k: t for t, k, _v, _tol in fields}
assert len(set(KEYS)) == 18, 'two graded fields share a key'
refused = list(GC.bad)

# ---------------------------------------------------------------------------
# 1. THE ENGINE LEDGER, and fields.json against it.
# ---------------------------------------------------------------------------
ledger = json.load(open(f'{W}/capstone_calls.json'))
if ledger['asOf'] != AS_OF:
    refused.append(f'the capstone ledger is dated {ledger["asOf"]} against the as-of date {AS_OF}')
calls = ledger['calls']


def res(fn, n=0):
    hits = [c for c in calls if f'{c["m"]}.{c["fn"]}' == fn]
    if len(hits) <= n:
        refused.append(f'the ledger carries no call {n + 1} of {fn}')
        return {}
    return hits[n]['result']


ymd = lambda s: int(s.replace('-', ''))  # noqa: E731
ENGINE = {
    'igbara_i03_inherent_score': res('riskScoring.deriveRiskFields', 0).get('inherentScore'),
    'igbara_i03_residual_score': res('riskScoring.deriveRiskFields', 1).get('residualScore'),
    'igbara_live_residual_critical': res('riskScoring.countByBand', 0).get('Critical'),
    'igbara_live_inherent_high': res('riskScoring.countByBand', 1).get('High'),
    'igbara_i06_days_to_review': res('calendar.daysUntil', 0),
    'igbara_i12_days_to_review': res('calendar.daysUntil', 1),
    'okomu_ok01_ratify_due_yyyymmdd': ymd(res('managementOfChange.ratificationState').get('dueDate', '0')),
    'okomu_register_expiring_soon': res('managementOfChange.summarise').get('expiringSoon'),
    'okomu_register_expired': res('managementOfChange.summarise').get('expired'),
    'okomu_register_open_actions': res('managementOfChange.summarise').get('openActions'),
    'okomu_register_overdue_actions': res('managementOfChange.summarise').get('overdueActions'),
    'okomu_register_ratification_overdue': res('managementOfChange.summarise').get('ratificationOverdue'),
    'etim_review_blocking': len(res('peerReview.canClose').get('blocking', [])),
    'etim_review_open_comments': res('peerReview.summarise').get('openComments'),
    'etim_lesson_applied': res('lessonsLearned.reuseRecord').get('applied'),
    'etim_lesson_last_applied_yyyymmdd': ymd(res('lessonsLearned.reuseRecord').get('lastAppliedOn', '0')),
    'etim_lesson_age_days': res('lessonsLearned.lessonAgeDays'),
    'etim_register_reviews_due_soon': res('lessonsLearned.summarise').get('reviewsDueSoon'),
}
assert set(ENGINE) == set(KEYS), 'ENGINE and fields.json name different fields'
for k in KEYS:
    if ENGINE[k] != F[(TIER_OF[k], k)]:
        refused.append(f'{k}: fields.json says {F[(TIER_OF[k], k)]} and the engine ledger says {ENGINE[k]}')

# The records the second route reads, straight out of the capstone module. The
# prompt lines were rendered from the same objects by gen_course.py.
TABLES = {name: recs for tier in GC.TIERS for name, _cols, recs in GC.CAP['tables'][tier]}
LIVE = GC.CAP['live']
ETIM_REVIEW_STAGE = 'Verification'  # ETIM_REVIEW.stage; checked against the module below
import subprocess  # noqa: E402
_rv = subprocess.run(['node', '--input-type=module', '-e',
                      'const M = await import(%s); console.log(JSON.stringify(M.ETIM_REVIEW));'
                      % json.dumps(os.path.join(W, 'riskchange_fields_capstone.mjs'))],
                     capture_output=True, text=True)
ETIM_REVIEW = json.loads(_rv.stdout) if _rv.returncode == 0 else {}
if ETIM_REVIEW.get('stage') != ETIM_REVIEW_STAGE or ETIM_REVIEW.get('id') != 'ET-R1':
    refused.append(f'ETIM_REVIEW is {ETIM_REVIEW}, and the second route assumes ET-R1 in {ETIM_REVIEW_STAGE}')


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
-- riskchange GO-LIVE (HELD): Risk, Change & Learning flips to 'available', the
-- first course of the Assurance module, at path_order 59.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/riskchange. The 78 lessons, the teaching lab
-- (riskchangeLab.js) and its three explorer panels (risk, change and review)
-- ship in the ZIP and NOT in this database, so a flip before the upload puts a
-- live catalogue tile in front of a route that does not exist. This file is
-- written, dry-run and left unapplied on purpose.
--
-- EVERY GRADED VALUE IS CHECKED THREE WAYS, and none restates the generator:
--
--   1. against the ENGINE'S OWN CALL LEDGER (capstone_calls.json, the calls
--      oracle_bridge.py replays through the Python oracles), so a capstone row
--      an earlier seed left behind is refused by name;
--   2. by a SECOND ROUTE IN SQL over the very records the learner is handed:
--      the go-live first proves every rendered record line is in the shipped
--      prompt of its tier, then recomputes all eighteen values from those
--      records with the engine rules written out in SQL;
--   3. by the TRAPS the course is built on, each of which must bite on these
--      records: the reading a learner who missed the trap would give is
--      computed and refused if it equals the graded value.
--
-- THE AS-OF DATE IS {AS_OF}, the one date every capstone prompt states. It is a
-- literal below and never current_date, so this file gives the same verdict on
-- whatever day it is run.
--
-- THE GRADER IS NUMERIC. academy_submit_capstone casts expected, tol and the
-- answer to numeric. Every field must carry a whole-number expected value at
-- tolerance 0.5, and the two date fields must be real calendar dates written
-- YYYYMMDD. All of it is asserted here, on the rows as seeded.
--
-- EVERY REFUSAL THAT READS A GRADED VALUE NAMES IT as tier/key.
-- ============================================================================"""

B = []
A = B.append

A('do $$')
A('declare')
A('  v_structures int; v_questions int; v_capstones int; v_lessons int;')
A('  v_modules int; v_graded int; v_available int; v_soon int; v_n int;')
A('  v_names text; v_prompt text; v_prose text; v_wrong numeric;')
A(f"  v_asof date := date '{AS_OF}';")
for k in KEYS:
    A(f'  {V[k]} numeric; v_s_{k} numeric;')
for name_, recs in TABLES.items():
    A(f'  v_{name_.lower()} jsonb := {jlit(list(recs))};')
A(f'  v_igbara_live text[] := array[{", ".join(lit(s) for s in LIVE)}];')
A('begin')

# ------------------------------------------------------------------ shape
A(f'''
  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures
   where app_slug = '{SLUG}' and active;
  if v_structures <> 3 then
    raise exception 'riskchange go-live refused: {SLUG} has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions from public.academy_quiz_questions where app_slug = '{SLUG}';
  if v_questions <> 396 then
    raise exception 'riskchange go-live refused: {SLUG} has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_n from (
    select tier from public.academy_quiz_questions where app_slug = '{SLUG}'
     group by tier having count(*) <> 132) t;
  if v_n <> 0 then
    raise exception 'riskchange go-live refused: % tier(s) do not carry exactly 132 questions', v_n;
  end if;

  select count(*) into v_n from (
    select tier, module_key from public.academy_quiz_questions
     where app_slug = '{SLUG}' and scope = 'module'
     group by tier, module_key having count(*) <> 15) t;
  if v_n <> 0 then
    raise exception 'riskchange go-live refused: % module bank(s) do not carry exactly 15 questions', v_n;
  end if;

  select count(*) into v_n from (
    select tier from public.academy_quiz_questions
     where app_slug = '{SLUG}' and scope = 'final'
     group by tier having count(*) <> 42) t;
  if v_n <> 0 then
    raise exception 'riskchange go-live refused: % final exam(s) do not carry exactly 42 questions', v_n;
  end if;

  -- A key outside its own options is unanswerable, and a count of rows cannot
  -- see it.
  select count(*) into v_n from public.academy_quiz_questions
   where app_slug = '{SLUG}'
     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);
  if v_n <> 0 then
    raise exception 'riskchange go-live refused: % question(s) do not offer four options with a key inside them', v_n;
  end if;

  select count(*) into v_lessons
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m,
         lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = '{SLUG}' and s.active;
  if v_lessons <> 78 then
    raise exception 'riskchange go-live refused: {SLUG} carries % lesson keys, expected 78', v_lessons;
  end if;

  select count(*) into v_modules
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = '{SLUG}' and s.active;
  if v_modules <> 18 then
    raise exception 'riskchange go-live refused: {SLUG} carries % modules, expected 18 (six per tier)', v_modules;
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
    raise exception 'riskchange go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_n;
  end if;

  select count(*) into v_capstones from public.academy_capstones where app_slug = '{SLUG}';
  if v_capstones <> 3 then
    raise exception 'riskchange go-live refused: {SLUG} has % capstones, expected 3', v_capstones;
  end if;

  select count(*) into v_graded from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f where c.app_slug = '{SLUG}';
  if v_graded <> 18 then
    raise exception 'riskchange go-live refused: {SLUG} has % graded capstone fields, expected 18', v_graded;
  end if;

  select count(*) into v_n from (
    select c.tier from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug = '{SLUG}' group by c.tier having count(*) <> 6) t;
  if v_n <> 0 then
    raise exception 'riskchange go-live refused: % tier(s) do not grade exactly six fields', v_n;
  end if;

  if not exists (select 1 from public.academy_apps
                  where slug = '{SLUG}' and module = '{MODULE}'
                    and path_order = {PATH_ORDER} and prereq_slug is null) then
    raise exception 'riskchange go-live refused: the {SLUG} catalogue row is not {MODULE} at path_order {PATH_ORDER} with no prerequisite';
  end if;

  if exists (select 1 from public.academy_apps where path_order = {PATH_ORDER} and slug <> '{SLUG}') then
    raise exception 'riskchange go-live refused: another course already holds path_order {PATH_ORDER}';
  end if;

  -- ------------------------------------------------- the grader is numeric
  -- Every field a whole number at 0.5, with a label and a unit, and the two
  -- date fields real calendar dates written YYYYMMDD.
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = '{SLUG}'
     and (jsonb_typeof(f->'expected') <> 'number' or jsonb_typeof(f->'tol') <> 'number'
          or (f->>'expected')::numeric <> round((f->>'expected')::numeric)
          or (f->>'tol')::numeric <> 0.5
          or coalesce(f->>'label', '') = '' or coalesce(f->>'unit', '') = '');
  if v_n <> 0 then
    raise exception 'riskchange go-live refused: % graded field(s) are not a whole number at tolerance 0.5 with a label and a unit: %', v_n, v_names;
  end if;

  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = '{SLUG}' and f->>'key' like '%yyyymmdd'
     and (f->>'expected' !~ '^20[0-9]{{6}}$'
          or to_char(to_date(f->>'expected', 'YYYYMMDD'), 'YYYYMMDD') <> f->>'expected');
  if v_n <> 0 then
    raise exception 'riskchange go-live refused: % date field(s) are not a real calendar date written YYYYMMDD: %', v_n, v_names;
  end if;
''')

# ------------------------------------------------------------ the prompts
PROMPT_BLOCKS = []
for tier in GC.TIERS:
    prompt, rec_lines = GC.RENDERED[tier]
    arr = ',\n      '.join(lit(l) for _n, _i, l in rec_lines)
    ids = ', '.join(lit(i) for _n, i, _l in rec_lines)
    PROMPT_BLOCKS.append(f'''
  -- {tier}: the prose verbatim, every record line present, and no other.
  select prompt into v_prompt from public.academy_capstones where app_slug = '{SLUG}' and tier = '{tier}';
  if split_part(v_prompt, E'\\n\\n', 1) <> {lit(GC.CAP['prompts'][tier])} then
    raise exception 'riskchange go-live refused: the {tier} prompt prose is not the prose PROMPTS carries';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array[
      {arr}]) l
   where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'riskchange go-live refused: % {tier} record line(s) the second route reads are not in the shipped prompt: %', v_n, v_names;
  end if;
  select count(*) into v_n
    from regexp_split_to_table(v_prompt, E'\\n') l
   where l ~ '^[A-Z]{{2}}-[A-Z]?[0-9]+ [|]';
  if v_n <> {len(rec_lines)} then
    raise exception 'riskchange go-live refused: the {tier} prompt carries % record lines, expected {len(rec_lines)}', v_n;
  end if;
''')
A('\n  -- ---------------------------------------- the prompts the learner reads')
for b in PROMPT_BLOCKS:
    A(b)

SELECTION = {'etim_lesson_last_applied_yyyymmdd': 'applied on '}

# ------------------------------------------------ load the eighteen values
A('\n  -- --------------------------------------- the eighteen graded values')
for k in KEYS:
    A(f"""  select (f->>'expected')::numeric into {V[k]}
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = '{SLUG}' and c.tier = '{TIER_OF[k]}' and f->>'key' = '{k}';""")
A('  if ' + '\n     or '.join(f'{V[k]} is null' for k in KEYS) + ' then')
A("    raise exception 'riskchange go-live refused: one or more of the eighteen graded fields is missing';")
A('  end if;')

A(f'''
  -- PROSE. No graded value of any tier in any prompt's first paragraph, once
  -- record ids and the as-of date are taken out.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key') || ' in the ' || p.tier || ' prose', ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         public.academy_capstones p,
         lateral regexp_matches(
           replace(regexp_replace(split_part(p.prompt, E'\\n\\n', 1), '[A-Z]{{2}}-[A-Z]?[0-9]+', ' ', 'g'), '{AS_OF}', ' '),
           '(-?[0-9]+(\\.[0-9]+)?)', 'g') as m
   where c.app_slug = '{SLUG}' and p.app_slug = '{SLUG}'
     and abs((f->>'expected')::numeric - (m[1])::numeric) <= (f->>'tol')::numeric;
  if v_n <> 0 then
    raise exception 'riskchange go-live refused: % graded field(s) are stated in a prompt''s prose: %', v_n, v_names;
  end if;

  -- DATES. A graded date appears in no prompt in either spelling, except the
  -- one selection date, exactly once, in its declared column.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key') || ' in the ' || p.tier || ' prompt', ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         public.academy_capstones p
   where c.app_slug = '{SLUG}' and p.app_slug = '{SLUG}' and f->>'key' like '%yyyymmdd'
     and f->>'key' <> 'etim_lesson_last_applied_yyyymmdd'
     and (strpos(p.prompt, f->>'expected') > 0
          or strpos(p.prompt, to_char(to_date(f->>'expected', 'YYYYMMDD'), 'YYYY-MM-DD')) > 0);
  if v_n <> 0 then
    raise exception 'riskchange go-live refused: % graded date(s) are printed in a prompt: %', v_n, v_names;
  end if;

  select count(*) into v_n
    from public.academy_capstones p,
         lateral regexp_matches(p.prompt, to_char(to_date({V['etim_lesson_last_applied_yyyymmdd']}::text, 'YYYYMMDD'), 'YYYY-MM-DD'), 'g') m
   where p.app_slug = '{SLUG}';
  if v_n <> 1 or strpos((select prompt from public.academy_capstones where app_slug = '{SLUG}' and tier = 'advanced'),
                        '{SELECTION['etim_lesson_last_applied_yyyymmdd']}' || to_char(to_date({V['etim_lesson_last_applied_yyyymmdd']}::text, 'YYYYMMDD'), 'YYYY-MM-DD')) = 0
     or strpos((select string_agg(prompt, ' ') from public.academy_capstones where app_slug = '{SLUG}'),
               {V['etim_lesson_last_applied_yyyymmdd']}::text) > 0 then
    raise exception 'riskchange go-live refused: the selection date % is printed % time(s) across the prompts, and must appear exactly once, in the advanced applications table as its applied on date, and never as eight digits{name('etim_lesson_last_applied_yyyymmdd')}', {V['etim_lesson_last_applied_yyyymmdd']}, v_n;
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
    raise exception 'riskchange go-live refused: % pair(s) of graded fields are within the looser of their two tolerances: %', v_n, v_names;
  end if;
''')

# ------------------------------------------------------ the digest sweep
digest = open(f'{W}/digest.txt', encoding='utf-8').read()
DIGEST_INTS = sorted({int(m.group()) for m in re.finditer(r'(?<![\w.-])-?\d+(?![\w.])', digest)
                      if len(m.group().lstrip('-')) <= 9})
DIGEST_DATES = sorted(set(re.findall(r'\b\d{4}-\d{2}-\d{2}\b', digest))
                      | {f'{s[:4]}-{s[4:6]}-{s[6:]}' for s in re.findall(r'\b20\d{6}\b', digest)})
# The sweep must be able to fire: the digest prints small integers and dates.
if len(DIGEST_INTS) < 50 or len(DIGEST_DATES) < 20:
    refused.append(f'the digest sweep read {len(DIGEST_INTS)} integers and {len(DIGEST_DATES)} dates, '
                   'so it is reading the wrong thing')
for k in KEYS:
    v = F[(TIER_OF[k], k)]
    if k.endswith('_yyyymmdd'):
        if f'{str(v)[:4]}-{str(v)[4:6]}-{str(v)[6:]}' in DIGEST_DATES:
            refused.append(f'graded date {k} = {v} is a date the digest prints')
    elif (v < 0 or v >= 25) and v in DIGEST_INTS:
        refused.append(f'distinctive graded integer {k} = {v} is printed in the digest')
A(f'''
  -- ------------------------------------------------------- the digest sweep
  -- No graded date is a date the teaching digest prints, and no DISTINCTIVE
  -- graded integer (below 0, or 25 and above) is an integer it prints. A small
  -- count is exempt by construction: the digest prints the numeral 2 many times
  -- over, and a count of two is not a lookup of any of them.
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = '{SLUG}'
     and ((f->>'key' like '%yyyymmdd'
           and to_char(to_date(f->>'expected', 'YYYYMMDD'), 'YYYY-MM-DD') = any (array[{', '.join(lit(d) for d in DIGEST_DATES)}]))
       or (f->>'key' not like '%yyyymmdd'
           and ((f->>'expected')::numeric < 0 or (f->>'expected')::numeric >= 25)
           and (f->>'expected')::numeric = any (array[{', '.join(str(i) for i in DIGEST_INTS)}]::numeric[])));
  if v_n <> 0 then
    raise exception 'riskchange go-live refused: % graded field(s) are a date or a distinctive integer the digest prints: %', v_n, v_names;
  end if;
''')

# ------------------------------------------------------- 1. the engine ledger
A('\n  -- ------------------------------------ 1. against the engine call ledger')
for k in KEYS:
    A(f'''  if {V[k]} <> {ENGINE[k]} then
    raise exception 'riskchange go-live refused: the seeded value % is not the {ENGINE[k]} the engine returned in capstone_calls.json{name(k)}', {V[k]};
  end if;''')

# ------------------------------------------------ 2. the second route in SQL
# SQL helpers, inlined as expressions over a jsonb record r.
#   level(x): a whole level from 1 to 5, else null (the engine's clampLevel:
#   Number(x) must be an integer on the scale; a string, a fraction or an
#   off-scale number is unscored).
def level(x):
    return (f"(case when jsonb_typeof({x}) = 'number' and ({x})::text::numeric = trunc(({x})::text::numeric)"
            f" and ({x})::text::numeric between 1 and 5 then ({x})::text::numeric end)")


def assessed_or(res_, inh):
    """The engine's `assessed(residual) ?? inherent`: a JSON null, an absent
    key and an empty string all fall back to the inherent axis."""
    return (f"(case when r->{res_} is null or jsonb_typeof(r->{res_}) = 'null' or r->>{res_} = ''"
            f" then r->{inh} else r->{res_} end)")


INHERENT = f"coalesce({level(chr(114) + '->' + lit('likelihood'))} * {level(chr(114) + '->' + lit('impact'))}, 0)"
RESIDUAL = (f"coalesce({level(assessed_or(lit('residual_likelihood'), lit('likelihood')))}"
            f" * {level(assessed_or(lit('residual_impact'), lit('impact')))}, 0)")
BAND = lambda s: (f"(case when {s} >= 15 then 'Critical' when {s} >= 10 then 'High'"  # noqa: E731
                  f" when {s} >= 5 then 'Medium' when {s} >= 1 then 'Low' else 'None' end)")
DAYS = lambda col: f"((r->>{lit(col)})::date - v_asof)"  # noqa: E731

A(f'''
  -- ----------------------------------------------- 2. the second route in SQL
  -- ASSOCIATE, IGBARA. A level is a whole number from 1 to 5 or it is unscored;
  -- a score is the product of two levels, or 0 when either is unscored; the
  -- residual falls back to the inherent level ONE AXIS AT A TIME when its own
  -- cell is blank or null; a band is found by its lower edge alone.
  select {INHERENT}, {RESIDUAL}
    into v_s_igbara_i03_inherent_score, v_s_igbara_i03_residual_score
    from jsonb_array_elements(v_igbara_risks) r where r->>'id' = 'IG-03';
  select count(*) filter (where {BAND(RESIDUAL)} = 'Critical'),
         count(*) filter (where {BAND(INHERENT)} = 'High')
    into v_s_igbara_live_residual_critical, v_s_igbara_live_inherent_high
    from jsonb_array_elements(v_igbara_risks) r where r->>'status' = any (v_igbara_live);
  select {DAYS('next_review_date')} into v_s_igbara_i06_days_to_review
    from jsonb_array_elements(v_igbara_risks) r where r->>'id' = 'IG-06';
  select {DAYS('next_review_date')} into v_s_igbara_i12_days_to_review
    from jsonb_array_elements(v_igbara_risks) r where r->>'id' = 'IG-12';

  -- PROFESSIONAL, OKOMU. Expiry is read only for a Temporary or Emergency
  -- change IN EFFECT and not closed out, with the 14-day lead counted
  -- inclusively. Ratification is owed by an Emergency change in effect whose
  -- approval levels are not all signed without a rejection; it is due seven
  -- days after the ACTUAL implementation date, and with no such date it is
  -- overdue because the window cannot be shown open. Actions on a change in a
  -- terminal stage are not open work; an action on a change the register does
  -- not hold still is.
  select to_char((r->>'actual_implementation_date')::date + 7, 'YYYYMMDD')::numeric
    into v_s_okomu_ok01_ratify_due_yyyymmdd
    from jsonb_array_elements(v_okomu_mocs) r where r->>'id' = 'OK-01';
  select count(*) filter (where d between 0 and 14), count(*) filter (where d < 0)
    into v_s_okomu_register_expiring_soon, v_s_okomu_register_expired
    from (select {DAYS('expiry_date')} d from jsonb_array_elements(v_okomu_mocs) r
           where r->>'type' in ('Temporary', 'Emergency') and r->>'stage' = 'Implementation'
             and r->>'expiry_date' is not null) t;
  select count(*) filter (where true),
         count(*) filter (where {DAYS('due_date')} < 0)
    into v_s_okomu_register_open_actions, v_s_okomu_register_overdue_actions
    from jsonb_array_elements(v_okomu_actions) r
   where r->>'status' not in ('Complete', 'Cancelled')
     and not exists (select 1 from jsonb_array_elements(v_okomu_mocs) m
                      where m->>'id' = r->>'moc_id' and m->>'stage' in ('Closed', 'Rejected', 'Cancelled'));
  select count(*) into v_s_okomu_register_ratification_overdue
    from jsonb_array_elements(v_okomu_mocs) m
   where m->>'type' = 'Emergency' and m->>'stage' in ('Implementation', 'Closed')
     and not (
       exists (select 1 from jsonb_array_elements(v_okomu_approvals) a where a->>'moc_id' = m->>'id')
       and not exists (select 1 from jsonb_array_elements(v_okomu_approvals) a
                        where a->>'moc_id' = m->>'id' and a->>'status' = 'Rejected')
       and not exists (
         select 1 from (select distinct coalesce((a->>'level')::int, 1) lvl
                          from jsonb_array_elements(v_okomu_approvals) a where a->>'moc_id' = m->>'id') l
          where not exists (select 1 from jsonb_array_elements(v_okomu_approvals) a
                             where a->>'moc_id' = m->>'id' and coalesce((a->>'level')::int, 1) = l.lvl
                               and a->>'status' = 'Approved')))
     and (m->>'actual_implementation_date' is null
          or (m->>'actual_implementation_date')::date + 7 < v_asof);

  -- EXPERT, ETIM. A comment blocks when its severity is Critical or Major and
  -- it is not Verified, Closed or Withdrawn; it is open when it is none of
  -- those three and its review (ET-R1, in {ETIM_REVIEW_STAGE}) is not finished.
  -- An application changed something when it was Adopted or Adapted. The age
  -- runs from the event date. A review is due soon on a Published or Embedded
  -- lesson whose review date is 0 to 30 days away, both ends counted.
  select count(*) filter (where r->>'severity' in ('Critical', 'Major')
                            and r->>'status' not in ('Verified', 'Closed', 'Withdrawn')),
         count(*) filter (where r->>'status' not in ('Verified', 'Closed', 'Withdrawn')
                            and '{ETIM_REVIEW_STAGE}' not in ('Closed', 'Cancelled'))
    into v_s_etim_review_blocking, v_s_etim_review_open_comments
    from jsonb_array_elements(v_etim_comments) r where r->>'review_id' = 'ET-R1';
  select count(*), to_char(max((r->>'applied_on')::date), 'YYYYMMDD')::numeric
    into v_s_etim_lesson_applied, v_s_etim_lesson_last_applied_yyyymmdd
    from jsonb_array_elements(v_etim_applications) r
   where r->>'lesson_id' = 'EL-01' and r->>'outcome' in ('Adopted', 'Adapted');
  select greatest(0, v_asof - (r->>'event_date')::date) into v_s_etim_lesson_age_days
    from jsonb_array_elements(v_etim_lessons) r where r->>'id' = 'EL-01';
  select count(*) into v_s_etim_register_reviews_due_soon
    from jsonb_array_elements(v_etim_lessons) r
   where r->>'status' in ('Published', 'Embedded') and r->>'review_due' is not null
     and {DAYS('review_due')} between 0 and 30;
''')
for k in KEYS:
    A(f'''  if v_s_{k} is distinct from {V[k]} then
    raise exception 'riskchange go-live refused: the second route in SQL gives % over the records in the prompt, against the seeded %{name(k)}', v_s_{k}, {V[k]};
  end if;''')

# ------------------------------------------------------ 3. the traps bite
TRAPS = [
    ('igbara_i03_residual_score',
     'a blank residual impact read as unscored rather than falling back to the inherent impact',
     "select 0::numeric"),
    ('igbara_i03_residual_score',
     'the residual read as the inherent score',
     f"select {INHERENT} from jsonb_array_elements(v_igbara_risks) r where r->>'id' = 'IG-03'"),
    ('igbara_live_residual_critical',
     'the Critical residual count taken over every record instead of the live ones',
     f"select count(*) filter (where {BAND(RESIDUAL)} = 'Critical') from jsonb_array_elements(v_igbara_risks) r"),
    ('igbara_live_residual_critical',
     'the Critical count taken on the inherent score instead of the residual',
     f"select count(*) filter (where {BAND(INHERENT)} = 'Critical') from jsonb_array_elements(v_igbara_risks) r"
     " where r->>'status' = any (v_igbara_live)"),
    ('igbara_live_inherent_high',
     'the High inherent count taken over every record instead of the live ones',
     f"select count(*) filter (where {BAND(INHERENT)} = 'High') from jsonb_array_elements(v_igbara_risks) r"),
    ('igbara_i12_days_to_review',
     'a passed review date read as a distance without its sign',
     f"select abs({DAYS('next_review_date')}) from jsonb_array_elements(v_igbara_risks) r where r->>'id' = 'IG-12'"),
    ('okomu_register_expiring_soon',
     'the 14-day lead counted exclusively',
     f"select count(*) from jsonb_array_elements(v_okomu_mocs) r where r->>'type' in ('Temporary', 'Emergency')"
     f" and r->>'stage' = 'Implementation' and r->>'expiry_date' is not null and {DAYS('expiry_date')} between 0 and 13"),
    ('okomu_register_expired',
     'expiry read on every Temporary or Emergency change whatever its stage',
     f"select count(*) from jsonb_array_elements(v_okomu_mocs) r where r->>'type' in ('Temporary', 'Emergency')"
     f" and r->>'expiry_date' is not null and {DAYS('expiry_date')} < 0"),
    ('okomu_register_open_actions',
     'actions on a finished change counted as open work',
     "select count(*) from jsonb_array_elements(v_okomu_actions) r where r->>'status' not in ('Complete', 'Cancelled')"),
    ('okomu_register_overdue_actions',
     'overdue actions counted including those on a finished change',
     f"select count(*) from jsonb_array_elements(v_okomu_actions) r where r->>'status' not in ('Complete', 'Cancelled')"
     f" and {DAYS('due_date')} < 0"),
    ('okomu_register_ratification_overdue',
     'an emergency change with no implementation date left out of the overdue count',
     f"select v_s_okomu_register_ratification_overdue - count(*) from jsonb_array_elements(v_okomu_mocs) m"
     f" where m->>'type' = 'Emergency' and m->>'stage' = 'Implementation' and m->>'actual_implementation_date' is null"),
    ('etim_review_blocking',
     'only the Open comments read as blocking',
     "select count(*) from jsonb_array_elements(v_etim_comments) r where r->>'severity' in ('Critical', 'Major')"
     " and r->>'status' = 'Open'"),
    ('etim_review_open_comments',
     'only the comments whose status is Open counted as open',
     "select count(*) from jsonb_array_elements(v_etim_comments) r where r->>'status' = 'Open'"),
    ('etim_lesson_applied',
     'every application counted, the rejections included',
     "select count(*) from jsonb_array_elements(v_etim_applications) r where r->>'lesson_id' = 'EL-01'"),
    ('etim_lesson_last_applied_yyyymmdd',
     'the latest application of any outcome, a rejection included',
     "select to_char(max((r->>'applied_on')::date), 'YYYYMMDD')::numeric from jsonb_array_elements(v_etim_applications) r"
     " where r->>'lesson_id' = 'EL-01'"),
    ('etim_lesson_age_days',
     'the age counted from the date the record was created instead of the event date',
     "select v_asof - (r->>'created_at')::date from jsonb_array_elements(v_etim_lessons) r where r->>'id' = 'EL-01'"),
    ('etim_register_reviews_due_soon',
     'review due soon read on every lesson whatever its status',
     f"select count(*) from jsonb_array_elements(v_etim_lessons) r where r->>'review_due' is not null"
     f" and {DAYS('review_due')} between 0 and 30"),
]
A('\n  -- ------------------------------------------------- 3. the traps bite')
A('  -- Each wrong reading is computed over the same records and must MISS the')
A('  -- graded value, or the field does not discriminate the trap it is for.')
for k, why, q_ in TRAPS:
    A(f'''  {q_} into v_wrong;
  if v_wrong is not distinct from {V[k]} then
    raise exception 'riskchange go-live refused: {why.replace("'", "''")} also gives %, so the field does not discriminate the trap{name(k)}', v_wrong;
  end if;''')

A(f'''
  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = '{SLUG}';
  if not exists (select 1 from public.academy_apps where slug = '{SLUG}' and status = 'available') then
    raise exception 'riskchange go-live refused: {SLUG} did not reach status available';
  end if;

  select count(*) filter (where status = 'available'), count(*) filter (where status = 'coming_soon')
    into v_available, v_soon
    from public.academy_apps;

  raise notice 'riskchange go-live: {SLUG} available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
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
if len(TRAPS) < 17 or {k for k, _w, _q in TRAPS} != set(KEYS) - {
        'igbara_i03_inherent_score', 'igbara_i06_days_to_review', 'okomu_ok01_ratify_due_yyyymmdd'}:
    refused.append('the traps do not cover every field that has one')

if refused or unnamed or intdiv or unclosed or dashes:
    print('REFUSED, nothing written:')
    for b in refused + unnamed + intdiv:
        print('  ', b)
    print('unclosed literal:', bool(unclosed), '| en/em dashes:', dashes)
    sys.exit(1)

open(OUT, 'w').write(sql)
print(f'wrote {OUT}: {len(sql.splitlines())} lines')
print(f'engine ledger: 18 of 18 fields.json values equal the engine call results in capstone_calls.json')
print(f'second route in SQL: 18 fields | traps that must bite: {len(TRAPS)} over '
      f'{len({k for k, _w, _q in TRAPS})} fields')
print(f'record lines the go-live requires in the prompts: '
      f'{ {t: len(GC.RENDERED[t][1]) for t in GC.TIERS} }')
print(f'digest sweep: {len(DIGEST_INTS)} integers and {len(DIGEST_DATES)} dates the digest prints')
print(f'graded fields named by at least one refusal: {len(named & {f"{TIER_OF[k]}/{k}" for k in KEYS})} of 18')
print('integer-division guard: 0 | unclosed literals: 0 | en/em dashes: 0')
