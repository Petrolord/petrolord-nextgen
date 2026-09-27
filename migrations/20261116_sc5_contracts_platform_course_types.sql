-- ============================================================================
-- SC5 PLATFORM: three course types on the catalogue row, and the certificate
-- path for a practice course (lead decisions 1 and 2, 2026-09-27; Suite
-- docs/scope/NextGen-Catalog-Regroup-PLAN.md section 3).
--
-- The plan of record amends "one app = one course" into three course types:
--   'app'      a Suite app over a petrolord-engines engine, the default and
--              what every course was until SC2;
--   'engine'   a validated engine reached through course calculator panels,
--              with no Suite app (procurement, pia, gsa, joa, farmout, prms);
--   'practice' no engine: a dated, cited source pack, scenario banks audited
--              against it, no numeric capstone, a visible "Practice course"
--              badge and a review date. SC5 contracts is the first.
--
-- WHAT THIS FILE DOES, and nothing else:
--   1. academy_apps gains course_type (text, not null, default 'app', checked
--      to the three values), review_date (date) and sources_checked_on
--      (date). A practice row must carry both dates, with the review date
--      after the check date (a named check constraint).
--   2. Backfill: every existing row keeps the default 'app'; the six engine
--      courses are set to 'engine' where their row exists (prms may land
--      later; its own course migration, or a re-run of this idempotent file,
--      sets it). No practice row exists yet: SC5's own course migration
--      inserts 'contracts' with course_type 'practice' and both dates.
--   3. academy_verify_certificate(text) gains one key, course_type, read from
--      academy_apps, so the public verification page can name a practice
--      course as one. Signature, return type, SECURITY DEFINER, search_path
--      and the anon + authenticated grant are unchanged; every other key is
--      returned exactly as 20261105_catalog_course_titles.sql returns it.
--   4. academy_claim_practice_certificate(p_app, p_tier): the certificate path
--      for a course with no numeric capstone. It issues the SAME ladder
--      (beginner -> associate, intermediate -> professional, advanced ->
--      expert) from the tier's final exam, passed at the existing pass mark
--      (academy_final_exam_pass_pct, graded by academy_grade_quiz; this file
--      changes neither). The Expert tier's final exam is the written-case
--      bank. It refuses any course whose course_type is not 'practice', so an
--      app or engine course still certifies through academy_submit_capstone
--      and nothing else. There is no reviewer-door bypass here: a practice
--      certificate always rests on a passed exam. The renewal rule is the one
--      academy_submit_capstone applies (Q2, 2026-07-16).
--
-- NOT CHANGED: academy_submit_capstone, academy_course_progress,
-- academy_grade_quiz, academy_get_final_exam, the bridge trigger, fees, any
-- shared Suite table. NextGen product tables only.
--
-- Idempotent (add column if not exists, a guarded constraint, create or
-- replace, updates that touch a row only while it differs). No transaction
-- lines of its own: the apply script wraps it. The assert block at the end
-- raises, aborting the wrapping transaction, when the columns, the
-- constraints or the backfill are not what this header says.
-- ============================================================================

-- ------------------------------------------------------------ 1. columns

alter table public.academy_apps
  add column if not exists course_type text not null default 'app';
alter table public.academy_apps
  add column if not exists review_date date;
alter table public.academy_apps
  add column if not exists sources_checked_on date;

do $$
begin
  if not exists (select 1 from pg_constraint
                  where conname = 'academy_apps_course_type_check'
                    and conrelid = 'public.academy_apps'::regclass) then
    alter table public.academy_apps
      add constraint academy_apps_course_type_check
      check (course_type in ('app', 'engine', 'practice'));
  end if;
  if not exists (select 1 from pg_constraint
                  where conname = 'academy_apps_practice_dates_check'
                    and conrelid = 'public.academy_apps'::regclass) then
    alter table public.academy_apps
      add constraint academy_apps_practice_dates_check
      check (course_type <> 'practice'
             or (review_date is not null
                 and sources_checked_on is not null
                 and review_date > sources_checked_on));
  end if;
end $$;

comment on column public.academy_apps.course_type is
  'Course type (Catalog Regroup plan section 3, 2026-09-26): app = a Suite app over an engine (default); engine = a validated engine through course calculator panels, no Suite app; practice = no engine, a dated cited source pack, scenario banks, no numeric capstone, certificates from the tier final exams (academy_claim_practice_certificate).';
comment on column public.academy_apps.review_date is
  'The date after which the course is re-read against its sources. Required for a practice course (academy_apps_practice_dates_check); shown on the course page.';
comment on column public.academy_apps.sources_checked_on is
  'The date the course''s source pack (Acts, regulations, guidance) was last checked. Required for a practice course.';

-- ------------------------------------------------------------ 2. backfill

update public.academy_apps
   set course_type = 'engine'
 where slug in ('procurement', 'pia', 'gsa', 'joa', 'farmout', 'prms')
   and course_type is distinct from 'engine';

-- ------------------------------------------- 3. public verification, + type

create or replace function public.academy_verify_certificate(p_verify_code text)
returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'certificate_number', c.certificate_number,
    'holder', coalesce(nullif(case when p.display_name like '%@%' then null
                                   else btrim(p.display_name) end, ''),
                       'Registered learner'),
    'app_slug', c.app_slug,
    'course_name', a.name,
    'course_type', coalesce(a.course_type, 'app'),
    'tier', c.tier,
    'issued_at', c.issued_at,
    'valid_until', c.valid_until,
    'status', case when c.revoked_at is not null then 'revoked'
                   when now() >= c.valid_until then 'expired'
                   else 'valid' end)
  from public.academy_certifications c
  left join public.profiles p on p.id = c.user_id
  left join public.academy_apps a on a.slug = c.app_slug
  where c.verify_code = p_verify_code;
$$;
revoke all on function public.academy_verify_certificate(text) from public;
grant execute on function public.academy_verify_certificate(text) to anon, authenticated;

-- ------------------------------------ 4. the practice course certificate path

create or replace function public.academy_claim_practice_certificate(
    p_app  text,
    p_tier text)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_uid       uuid := auth.uid();
  v_app       public.academy_apps;
  v_enr       public.academy_enrollments;
  v_struct    public.academy_course_structures;
  v_cert_tier text;
  v_cert      public.academy_certifications;
  v_prev      public.academy_certifications;
  v_renewed   boolean := false;
begin
  if v_uid is null then raise exception 'authentication required'; end if;

  select * into v_app from public.academy_apps where slug = p_app;
  if v_app.slug is null then
    raise exception 'unknown course %', p_app;
  end if;
  if v_app.course_type is distinct from 'practice' then
    raise exception 'course % is an % course: its certificate is issued by its capstone', p_app, v_app.course_type;
  end if;

  v_cert_tier := case p_tier
                   when 'beginner' then 'associate'
                   when 'intermediate' then 'professional'
                   when 'advanced' then 'expert'
                 end;
  if v_cert_tier is null then
    raise exception 'tier must be beginner, intermediate or advanced';
  end if;

  if not public.academy_has_scope(p_app, 'learning') then
    raise exception 'enroll and activate Learning Mode before claiming a certificate';
  end if;

  select * into v_enr from public.academy_enrollments
   where user_id = v_uid and app_slug = p_app
     and course_tier = p_tier and status = 'active'
   order by created_at desc limit 1;
  if v_enr.id is null then
    raise exception 'an active % enrollment in this course is required for this certificate', p_tier;
  end if;

  v_struct := public.academy_deep_structure(p_app, p_tier);
  if v_struct.app_slug is null then
    raise exception 'no course structure for % (%)', p_app, p_tier;
  end if;

  if not public.academy_quiz_passed(v_uid, p_app, p_tier, 'final', null) then
    raise exception 'complete all modules and pass the final exam before the certificate is issued';
  end if;

  -- Renewal, as academy_submit_capstone applies it (Q2, 2026-07-16): a live
  -- certificate more than 60 days from expiry is left alone; one inside its
  -- renewal window is superseded; an expired one simply re-issues.
  select * into v_prev from public.academy_certifications
   where user_id = v_uid and app_slug = p_app
     and tier = v_cert_tier
     and revoked_at is null and now() < valid_until
   order by valid_until desc limit 1;

  if v_prev.id is not null then
    if now() < v_prev.valid_until - interval '60 days' then
      return jsonb_build_object('passed', true, 'basis', 'final_exam',
        'course_type', 'practice', 'tier', v_prev.tier,
        'already_certified', true);
    end if;
    update public.academy_certifications
       set revoked_at = now()
     where id = v_prev.id;
    v_renewed := true;
  end if;

  insert into public.academy_certifications
      (user_id, course_id, app_slug, tier)
  values (v_uid, public.academy_course_for_app(p_app), p_app, v_cert_tier)
  returning * into v_cert;

  return jsonb_build_object('passed', true, 'basis', 'final_exam',
    'course_type', 'practice',
    'certificate_number', v_cert.certificate_number,
    'verify_code', v_cert.verify_code,
    'tier', v_cert.tier,
    'valid_until', v_cert.valid_until,
    'renewed', v_renewed);
end $$;

revoke all on function public.academy_claim_practice_certificate(text, text) from public, anon;
grant execute on function public.academy_claim_practice_certificate(text, text) to authenticated;

-- ----------------------------------------------------------------- assert

do $$
declare
  v_cols    integer;
  v_bad     text;
  v_engine  integer;
begin
  select count(*) into v_cols
    from information_schema.columns
   where table_schema = 'public' and table_name = 'academy_apps'
     and column_name in ('course_type', 'review_date', 'sources_checked_on');
  if v_cols <> 3 then
    raise exception 'course types: academy_apps carries % of the 3 new columns', v_cols;
  end if;
  if (select count(*) from pg_constraint
       where conrelid = 'public.academy_apps'::regclass
         and conname in ('academy_apps_course_type_check', 'academy_apps_practice_dates_check')) <> 2 then
    raise exception 'course types: a named check constraint is missing';
  end if;

  select string_agg(slug, ', ' order by slug) into v_bad
    from public.academy_apps
   where slug in ('procurement', 'pia', 'gsa', 'joa', 'farmout', 'prms')
     and course_type <> 'engine';
  if v_bad is not null then
    raise exception 'course types: engine courses not backfilled: %', v_bad;
  end if;

  select count(*) into v_engine from public.academy_apps where course_type = 'engine';

  raise notice 'course types: % app, % engine, % practice',
    (select count(*) from public.academy_apps where course_type = 'app'),
    v_engine,
    (select count(*) from public.academy_apps where course_type = 'practice');
end $$;
