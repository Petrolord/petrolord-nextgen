#!/usr/bin/env python3
"""THE SC5 GO-LIVE GENERATOR: coming_soon -> available for the first practice
course, behind assertions a practice course can make.

A practice course has no engine and no capstone, so there is no engine ledger,
no second route, no oracle and no trap to check (the EC11 prms go-live's four
independent checks). What a practice go-live CAN prove, inside the transaction
that flips the course, and what this generator writes:

  1. THE PLATFORM. academy_apps carries course_type, review_date and
     sources_checked_on with their two named check constraints;
     academy_claim_practice_certificate(text, text) exists, is executable by
     authenticated and not by anon; academy_verify_certificate returns
     course_type.
  2. THE ROW. contracts is the practice row the course migration writes: name,
     module supply_chain, path_order 79 held by no other row, no prerequisite,
     course_type 'practice', the review and check dates of wave.json.
  3. NO CAPSTONE. Not one academy_capstones row names contracts.
  4. THE STRUCTURE. Each tier's active structure row is EXACTLY the structure
     the tier's manifest.json gives (jsonb equality with the literal below).
  5. THE BANKS. Each tier holds 15 questions for each of its six module keys
     and 42 final questions, 132 in all, every one active with four options,
     an answer index from 0 to 3 and an explanation; each bank's answer indices
     are spread as the bank gate spreads them (no index above 35 per cent or
     below 15 per cent of the bank); and the tier's content digest (md5 of
     every prompt, option, answer index and explanation, in order) equals the
     digest of the committed bank JSONs this generator read.
  6. THE COPY. No question text carries an em or en dash or a passage id.

Then the flip, and a read-back that the row is available. Every refusal is
raised as "SC5 go-live refused: ..." and aborts the transaction the apply
script wraps it in. No transaction lines of its own. Idempotent: a second run
finds the course available, passes every assertion and changes nothing.

    python3 gen_golive.py            print the go-live SQL
    SC5_GOLIVE_OUT=path python3 gen_golive.py    write it there

Inputs (the export gen_seeds.sh makes, or this wave directory): wave.json, the
21 bank JSONs under banks/, the three manifests under the repository's
src/content/courses/contracts/.
"""
import hashlib
import json
import os
import sys

HERE = os.environ.get('SC5_WAVE_DIR') or os.path.dirname(os.path.abspath(__file__))
W = json.load(open(os.path.join(HERE, 'wave.json'), encoding='utf-8'))
REPO = os.environ.get('SC5_REPO') or W['repo']
SLUG = W['slug']
TIERS = [('beginner', 'b'), ('intermediate', 'i'), ('advanced', 'a')]
PREFIX = W.get('prefix', 'sc5')


def lit(s):
    return "'" + s.replace("'", "''") + "'"


def md5(s):
    return hashlib.md5(s.encode('utf-8')).hexdigest()


def structure(tier):
    man = json.load(open(os.path.join(REPO, 'src/content/courses', SLUG, tier, 'manifest.json'), encoding='utf-8'))
    return {'modules': [
        {'key': m['key'], 'title': m['title'], 'lesson_keys': [l['key'] for l in m['lessons']]}
        for m in sorted(man['modules'], key=lambda m: m['order'])]}


def rows(tier, letter, st):
    out = []
    for m in st['modules']:
        bank = json.load(open(os.path.join(HERE, 'banks', f"{PREFIX}{letter}_{m['key'].split('-')[0]}.json"), encoding='utf-8'))
        assert len(bank) == 15, (tier, m['key'], len(bank))
        out += [('module', m['key'], i, q) for i, q in enumerate(bank, 1)]
    exam = json.load(open(os.path.join(HERE, 'banks', f'{PREFIX}{letter}_exam.json'), encoding='utf-8'))
    assert len(exam) == 42, (tier, len(exam))
    out += [('final', None, i, q) for i, q in enumerate(exam, 1)]
    return out


def digest(tier, rs):
    # The SQL below aggregates in this order: module rows before final rows,
    # module rows by the three-character module prefix (m01 to m06), then ord.
    key = lambda r: (0 if r[0] == 'module' else 1, (r[1] or '')[:3], r[2])
    parts = []
    for scope, mk, ord_, q in sorted(rs, key=key):
        parts.append('|'.join([tier, scope, mk or '', str(ord_), md5(q['prompt'])]
                              + [md5(o) for o in q['options']]
                              + [str(q['answer']), md5(q['explanation'])]))
    return md5(','.join(parts))


def main():
    if W.get('course_type') != 'practice':
        sys.exit('gen_golive REFUSES: wave.json is not a practice wave')
    tiers = []
    for tier, letter in TIERS:
        st = structure(tier)
        rs = rows(tier, letter, st)
        assert len(rs) == 132
        tiers.append((tier, st, digest(tier, rs), [m['key'] for m in st['modules']]))
    name = W['title']
    checks = []
    for tier, st, dg, keys in tiers:
        stj = json.dumps(st, separators=(',', ':'), ensure_ascii=False)
        checks.append(f"""
  -- ---------------------------------------------------------------- {tier}
  if not exists (select 1 from public.academy_course_structures
                  where app_slug = '{SLUG}' and tier = '{tier}' and active
                    and structure = {lit(stj)}::jsonb) then
    raise exception 'SC5 go-live refused: the {tier} structure row is missing, inactive or not the manifest''s structure';
  end if;
  select string_agg(k, ', ' order by k) into v_bad from (
    select k from unnest(array[{', '.join(lit(k) for k in keys)}]) k
     where (select count(*) from public.academy_quiz_questions q
             where q.app_slug = '{SLUG}' and q.tier = '{tier}' and q.scope = 'module'
               and q.module_key = k and q.active) <> 15) x;
  if v_bad is not null then
    raise exception 'SC5 go-live refused: {tier} module bank(s) without exactly 15 active questions: %', v_bad;
  end if;
  select count(*) into v_n from public.academy_quiz_questions
   where app_slug = '{SLUG}' and tier = '{tier}' and scope = 'final' and active;
  if v_n <> 42 then
    raise exception 'SC5 go-live refused: the {tier} final exam holds % active questions, not 42', v_n;
  end if;
  select count(*) into v_n from public.academy_quiz_questions where app_slug = '{SLUG}' and tier = '{tier}';
  if v_n <> 132 then
    raise exception 'SC5 go-live refused: the {tier} tier holds % questions, not 132', v_n;
  end if;
  select md5(string_agg(tier || '|' || scope || '|' || coalesce(module_key, '') || '|' || ord || '|' || md5(prompt)
                        || '|' || md5(options->>0) || '|' || md5(options->>1) || '|' || md5(options->>2) || '|' || md5(options->>3)
                        || '|' || answer_index || '|' || md5(coalesce(explanation, '')), ','
                        order by case scope when 'module' then 0 else 1 end, left(coalesce(module_key, ''), 3), ord))
    into v_d
    from public.academy_quiz_questions where app_slug = '{SLUG}' and tier = '{tier}';
  if v_d is distinct from '{dg}' then
    raise exception 'SC5 go-live refused: the {tier} questions are not the committed banks (content digest % where the banks give {dg})', v_d;
  end if;""")
    sql = f"""-- ============================================================================
-- SC5 GO-LIVE (HELD): {name} (contracts) flips from coming_soon to available.
--
-- DEPLOY GATE: do NOT run this until a NextGen production upload serves
-- /dashboard/apps/{SLUG} (see `apps/{SLUG}` in the served DashboardPage chunk).
-- A PRACTICE COURSE: no Suite app and no Suite upload are involved.
--
-- Generated by tools/course-waves/contracts/gen_golive.py from wave.json, the
-- three manifests and the 21 committed bank JSONs. Before the flip it asserts,
-- inside this transaction: the platform (the three columns and their two
-- checks, academy_claim_practice_certificate with its grants, course_type in
-- academy_verify_certificate); the practice row (module {W['module']}, path_order
-- {W['path_order']} unique, no prerequisite, review {W['review_date']}, sources checked
-- {W['sources_checked_on']}); no capstone row; each tier's structure exactly as its
-- manifest gives it; 90 module questions (15 a module) and 42 final questions
-- a tier, four options, answer indices 0 to 3 spread within the bank gate's
-- band, an explanation each, and a content digest equal to the committed
-- banks'; no dash or passage id in any question. A refusal raises and aborts.
-- No transaction lines of its own. Idempotent.
-- ============================================================================

do $$
declare
  v_app public.academy_apps;
  v_n   integer;
  v_bad text;
  v_d   text;
begin
  -- -------------------------------------------------------------- platform
  if (select count(*) from information_schema.columns
       where table_schema = 'public' and table_name = 'academy_apps'
         and column_name in ('course_type', 'review_date', 'sources_checked_on')) <> 3 then
    raise exception 'SC5 go-live refused: academy_apps lacks the course type columns (apply 20261116_sc5_contracts_platform_course_types.sql first)';
  end if;
  if (select count(*) from pg_constraint
       where conrelid = 'public.academy_apps'::regclass
         and conname in ('academy_apps_course_type_check', 'academy_apps_practice_dates_check')) <> 2 then
    raise exception 'SC5 go-live refused: a course type check constraint is missing';
  end if;
  if to_regprocedure('public.academy_claim_practice_certificate(text,text)') is null then
    raise exception 'SC5 go-live refused: academy_claim_practice_certificate(text, text) is missing';
  end if;
  if not has_function_privilege('authenticated', 'public.academy_claim_practice_certificate(text,text)', 'execute')
     or has_function_privilege('anon', 'public.academy_claim_practice_certificate(text,text)', 'execute') then
    raise exception 'SC5 go-live refused: the practice certificate claim is not granted to authenticated alone';
  end if;
  if position('course_type' in pg_get_functiondef('public.academy_verify_certificate(text)'::regprocedure)) = 0 then
    raise exception 'SC5 go-live refused: academy_verify_certificate does not return course_type';
  end if;

  -- ------------------------------------------------------------ the row
  select * into v_app from public.academy_apps where slug = '{SLUG}';
  if v_app.slug is null then
    raise exception 'SC5 go-live refused: the {SLUG} row is not seeded (apply 20261116_sc5_contracts_course.sql first)';
  end if;
  if v_app.name is distinct from {lit(name)} or v_app.module is distinct from '{W['module']}'
     or v_app.path_order is distinct from {W['path_order']} or v_app.prereq_slug is not null then
    raise exception 'SC5 go-live refused: the {SLUG} row is not the catalogue row the course migration writes (name %, module %, path_order %, prereq %)',
      v_app.name, v_app.module, v_app.path_order, v_app.prereq_slug;
  end if;
  if v_app.course_type is distinct from 'practice'
     or v_app.review_date is distinct from date '{W['review_date']}'
     or v_app.sources_checked_on is distinct from date '{W['sources_checked_on']}' then
    raise exception 'SC5 go-live refused: {SLUG} is not the practice row (type %, review %, checked %)',
      v_app.course_type, v_app.review_date, v_app.sources_checked_on;
  end if;
  select count(*) into v_n from public.academy_apps where path_order = {W['path_order']};
  if v_n <> 1 then
    raise exception 'SC5 go-live refused: path_order {W['path_order']} is held by % rows', v_n;
  end if;
  if exists (select 1 from public.academy_capstones where app_slug = '{SLUG}') then
    raise exception 'SC5 go-live refused: a practice course carries no capstone row';
  end if;
{''.join(checks)}

  -- ------------------------------------------------- spread and copy, all tiers
  select string_agg(b, ', ' order by b) into v_bad from (
    select q.tier || '/' || coalesce(q.module_key, 'final') || ' index ' || i.i as b
      from (select distinct tier, scope, module_key from public.academy_quiz_questions where app_slug = '{SLUG}') q
      cross join generate_series(0, 3) i(i)
     where (select count(*) filter (where x.answer_index = i.i)::numeric / count(*)
              from public.academy_quiz_questions x
             where x.app_slug = '{SLUG}' and x.tier = q.tier and x.scope = q.scope
               and x.module_key is not distinct from q.module_key) not between 0.15 and 0.35) s;
  if v_bad is not null then
    raise exception 'SC5 go-live refused: answer indices outside the 15 to 35 per cent band: %', v_bad;
  end if;
  select string_agg(tier || '/' || coalesce(module_key, 'final') || '#' || ord, ', ') into v_bad
    from public.academy_quiz_questions
   where app_slug = '{SLUG}'
     and (jsonb_array_length(options) <> 4 or answer_index not between 0 and 3
          or coalesce(btrim(explanation), '') = '' or not active
          or (prompt || options::text || coalesce(explanation, '')) ~ '[\\u2013\\u2014]'
          or (prompt || options::text || coalesce(explanation, '')) ~ '\\mP[0-9]{{3}}\\M');
  if v_bad is not null then
    raise exception 'SC5 go-live refused: question(s) malformed, inactive, dashed or carrying a passage id: %', v_bad;
  end if;

  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available'
   where slug = '{SLUG}' and status is distinct from 'available';
  if (select status from public.academy_apps where slug = '{SLUG}') <> 'available' then
    raise exception 'SC5 go-live refused: {SLUG} did not read back available';
  end if;
  raise notice 'SC5 go-live: {SLUG} available, a practice course: 3 tiers, 78 lessons, 396 questions, no capstone';
end $$;
"""
    out = os.environ.get('SC5_GOLIVE_OUT')
    if out:
        open(out, 'w', encoding='utf-8').write(sql)
        print(f'gen_golive: wrote {out}: {", ".join(t + " " + d[:12] for t, _, d, _ in tiers)}')
    else:
        sys.stdout.write(sql)
    return 0


sys.exit(main())
