-- ============================================================================
-- Sponsor learner progress (owner decision 2026-09-23).
--
-- Training leads asked to supervise the learners they sponsor: how far each
-- one is through the assigned course, and how they are scoring. The Sponsor
-- console's pool report (academy_sponsor_pool_report) shows assignment and
-- certification only. This adds ONE read-only function behind the same
-- permission check, academy_sponsor_can_manage (the sponsor's training leads
-- and Petrolord admins).
--
-- What a sponsor sees, per assignment in the pool:
--   progress  lessons read and modules complete in the ASSIGNED course and
--             tier (the course's current state; lesson progress persists by
--             design, so reading done before the seat counts)
--   scores    module quizzes, final exam and capstone: attempts, best score,
--             passed; counted only for attempts made while the seat was
--             active (from assigned_at to cancelled_at, or now)
--   cert      the certificate for that tier (number, issued, valid until)
--   activity  the latest lesson read, quiz submitted or capstone submitted
--             in that window
-- What a sponsor never sees: answers (what the learner typed or picked),
-- questions, other courses or tiers the learner holds, devices, sessions or
-- IP addresses. A CANCELLED assignment returns its row with no progress or
-- scores: the sponsorship has ended.
--
-- Disclosed to learners in the privacy policy (section 6, sponsored
-- learning). No table changes; SAFE TO RE-RUN.
-- ============================================================================

create or replace function public.academy_sponsor_learner_progress(p_pool_id uuid)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_sponsor uuid;
  v_out     jsonb := '[]'::jsonb;
  a         record;
  v_struct  public.academy_course_structures;
  v_from    timestamptz;
  v_to      timestamptz;
  v_modules jsonb;
  v_ltotal  integer;
  v_lread   integer;
  v_mdone   integer;
  v_final   jsonb;
  v_cap     jsonb;
  v_cert    jsonb;
  v_last    timestamptz;
  m         record;
begin
  select sponsor_id into v_sponsor from public.academy_sponsor_pools where id = p_pool_id;
  if v_sponsor is null then
    raise exception 'unknown pool';
  end if;
  if not public.academy_sponsor_can_manage(v_sponsor) then
    raise exception 'insufficient privileges';
  end if;

  for a in
    select sa.*, p.display_name, p.email, ap.name as course_name
      from public.academy_sponsor_assignments sa
      left join public.profiles p on p.id = sa.user_id
      left join public.academy_apps ap on ap.slug = sa.app_slug
     where sa.pool_id = p_pool_id
     order by sa.assigned_at desc
  loop
    if a.status <> 'active' then
      v_out := v_out || jsonb_build_object(
        'assignment_id', a.id, 'user_id', a.user_id,
        'display_name', a.display_name, 'email', a.email,
        'app_slug', a.app_slug, 'course_name', a.course_name, 'course_tier', a.course_tier,
        'status', a.status, 'assigned_at', a.assigned_at, 'cancelled_at', a.cancelled_at);
      continue;
    end if;

    v_from := a.assigned_at;
    v_to   := now();
    v_struct := public.academy_deep_structure(a.app_slug, a.course_tier);
    v_modules := '[]'::jsonb;
    v_ltotal := 0; v_lread := 0; v_mdone := 0;

    if v_struct.app_slug is not null then
      for m in
        select value, ordinality from jsonb_array_elements(v_struct.structure->'modules') with ordinality
      loop
        v_modules := v_modules || (
          select jsonb_build_object(
                   'key', m.value->>'key',
                   'title', m.value->>'title',
                   'lessons_total', jsonb_array_length(m.value->'lesson_keys'),
                   'lessons_read', public.academy_module_lessons_read(a.user_id, a.app_slug, a.course_tier, m.value),
                   'complete', public.academy_module_complete(a.user_id, a.app_slug, a.course_tier, m.value),
                   'quiz_attempts', count(q.id),
                   'quiz_best_score', max(q.score),
                   'quiz_max_score', max(q.max_score),
                   'quiz_passed', coalesce(bool_or(q.passed), false))
            from public.academy_quiz_attempts q
           where q.user_id = a.user_id and q.app_slug = a.app_slug and q.tier = a.course_tier
             and q.scope = 'module' and q.module_key = m.value->>'key'
             and q.status = 'submitted'
             and q.submitted_at >= v_from and q.submitted_at <= v_to);
        v_ltotal := v_ltotal + jsonb_array_length(m.value->'lesson_keys');
        v_lread  := v_lread + public.academy_module_lessons_read(a.user_id, a.app_slug, a.course_tier, m.value);
        if public.academy_module_complete(a.user_id, a.app_slug, a.course_tier, m.value) then
          v_mdone := v_mdone + 1;
        end if;
      end loop;
    end if;

    select jsonb_build_object(
             'attempts', count(q.id), 'best_score', max(q.score), 'max_score', max(q.max_score),
             'passed', coalesce(bool_or(q.passed), false), 'last_at', max(q.submitted_at))
      into v_final
      from public.academy_quiz_attempts q
     where q.user_id = a.user_id and q.app_slug = a.app_slug and q.tier = a.course_tier
       and q.scope = 'final' and q.status = 'submitted'
       and q.submitted_at >= v_from and q.submitted_at <= v_to;

    select jsonb_build_object(
             'attempts', count(c.id), 'best_score', max(c.score), 'max_score', max(c.max_score),
             'passed', coalesce(bool_or(c.passed), false), 'last_at', max(c.created_at))
      into v_cap
      from public.academy_capstone_attempts c
     where c.user_id = a.user_id and c.app_slug = a.app_slug and c.tier = a.course_tier
       and c.created_at >= v_from and c.created_at <= v_to;

    select jsonb_build_object('certificate_number', c.certificate_number,
                              'issued_at', c.issued_at, 'valid_until', c.valid_until)
      into v_cert
      from public.academy_certifications c
     where c.user_id = a.user_id and c.app_slug = a.app_slug
       and c.tier = case a.course_tier when 'beginner' then 'associate'
                                       when 'intermediate' then 'professional'
                                       else 'expert' end
       and c.revoked_at is null
     order by c.valid_until desc
     limit 1;

    select max(t) into v_last from (
      select max(lp.first_read_at) as t from public.academy_lesson_progress lp
       where lp.user_id = a.user_id and lp.app_slug = a.app_slug and lp.tier = a.course_tier
         and lp.first_read_at >= v_from and lp.first_read_at <= v_to
      union all
      select max(q.submitted_at) from public.academy_quiz_attempts q
       where q.user_id = a.user_id and q.app_slug = a.app_slug and q.tier = a.course_tier
         and q.status = 'submitted' and q.submitted_at >= v_from and q.submitted_at <= v_to
      union all
      select max(c.created_at) from public.academy_capstone_attempts c
       where c.user_id = a.user_id and c.app_slug = a.app_slug and c.tier = a.course_tier
         and c.created_at >= v_from and c.created_at <= v_to) x;

    v_out := v_out || jsonb_build_object(
      'assignment_id', a.id, 'user_id', a.user_id,
      'display_name', a.display_name, 'email', a.email,
      'app_slug', a.app_slug, 'course_name', a.course_name, 'course_tier', a.course_tier,
      'status', a.status, 'assigned_at', a.assigned_at, 'cancelled_at', a.cancelled_at,
      'deep', v_struct.app_slug is not null,
      'lessons_total', v_ltotal, 'lessons_read', v_lread,
      'modules_total', jsonb_array_length(v_modules), 'modules_complete', v_mdone,
      'modules', v_modules,
      'final_exam', v_final,
      'capstone', v_cap,
      'certificate', v_cert,
      'last_active_at', v_last);
  end loop;

  return v_out;
end $$;

comment on function public.academy_sponsor_learner_progress(uuid) is
    'Sponsor console progress view (2026-09-23): per assignment in a pool, progress through the assigned course-tier, scores (attempts, best, passed) for attempts made while the seat was active, the tier''s certificate and last activity. Never answers, questions, other courses, devices or sessions. Cancelled assignments carry no progress. Training leads of the pool''s sponsor and Petrolord admins only (academy_sponsor_can_manage).';

revoke all on function public.academy_sponsor_learner_progress(uuid) from public, anon;
grant execute on function public.academy_sponsor_learner_progress(uuid) to authenticated;
