-- ============================================================================
-- DC1 - Deep-course chassis (owner-directed depth program, 2026-08-22).
--
-- Problem being fixed: a course is 4-6 stub lessons on one page and the
-- capstone can be passed in minutes with values the page itself displays.
-- The owner locked the remedy: real modules and lessons (repo-markdown
-- authored, see src/content/README.md), sequential unlock enforced
-- SERVER-side, a randomized module quiz per module, a final exam per
-- tier, and only then the capstone. No minimum-time gating, no calendar
-- drip (owner declined both).
--
-- This migration ships ALL machinery with ZERO structure rows seeded, so
-- behavior is byte-identical for every course until a course's seed
-- migration (DC2+) inserts its academy_course_structures rows. Presence
-- of an ACTIVE structure row for (app, tier) = that course-tier is on
-- the deep path; the capstone gate additionally grandfathers enrollments
-- created before the row's enforced_from timestamp, so paid learners
-- mid-flight finish on the path they bought.
--
-- Security model (unchanged doctrine): everything gradeable lives only
-- in tables with NO client SELECT policy (the academy_assessment_questions
-- pattern); learners touch progress exclusively through SECURITY DEFINER
-- functions; lesson prose ships in the client bundle and is deliberately
-- treated as non-secret.
--
-- New tables: academy_course_structures, academy_lesson_progress,
--             academy_quiz_questions, academy_quiz_attempts.
-- Redefined:  academy_submit_capstone (adds the final-exam gate; body
--             otherwise identical to 20260716_owner_decisions.sql, incl.
--             the Q2 renewal logic; reviewer-door enrollments by a
--             super_admin bypass the gate, mirroring the 20260821 prereq
--             exemption).
-- ============================================================================

-- ------------------------------------------------------------- tunables

insert into public.system_settings
    (setting_key, setting_value, setting_type, description, group_name)
values
  ('academy_module_quiz_serve', '10', 'number',
   'Questions served per module-quiz attempt (randomized subset of the bank).', 'academy'),
  ('academy_module_quiz_pass_pct', '75', 'number',
   'Percentage required to pass a module quiz.', 'academy'),
  ('academy_quiz_attempts_before_cooldown', '3', 'number',
   'Consecutive failed quiz/exam attempts before a cooldown lock.', 'academy'),
  ('academy_quiz_cooldown_hours', '24', 'number',
   'Cooldown after the configured number of consecutive failures.', 'academy'),
  ('academy_final_exam_serve', '25', 'number',
   'Questions served per final-exam attempt (randomized subset of the bank).', 'academy'),
  ('academy_final_exam_pass_pct', '70', 'number',
   'Percentage required to pass a tier final exam.', 'academy')
on conflict (setting_key) do nothing;

-- ------------------------------------------------- course structure registry

create table if not exists public.academy_course_structures (
    app_slug        text not null references public.academy_apps (slug),
    tier            text not null
                    check (tier in ('beginner','intermediate','advanced')),
    structure       jsonb not null,  -- {"modules":[{"key","title","lesson_keys":[...]}]}
    content_version integer not null default 1,
    active          boolean not null default true,
    enforced_from   timestamptz not null default now(),
    settings        jsonb not null default '{}'::jsonb,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now(),
    primary key (app_slug, tier)
);
comment on table public.academy_course_structures is
    'Server-side registry of each deep course''s module/lesson keys, generated FROM the repo manifest (src/content/courses/<app>/<tier>/manifest.json) by the course''s seed migration. Presence of an ACTIVE row switches (app, tier) to the deep path: sequential unlock, module quizzes, final exam before capstone. enforced_from grandfathers enrollments created earlier (they finish on the old path). settings overrides the academy_* quiz tunables per course. Module/lesson keys are permanent identifiers (progress rows reference them).';

alter table public.academy_course_structures enable row level security;
-- The structure is just the syllabus: readable by any signed-in user; no
-- client writes (seeded by migrations / service-role tooling only).
drop policy if exists "academy_course_structures_select" on public.academy_course_structures;
create policy "academy_course_structures_select"
    on public.academy_course_structures for select to authenticated using (true);

-- ---------------------------------------------------------- lesson progress

create table if not exists public.academy_lesson_progress (
    id            uuid primary key default gen_random_uuid(),
    user_id       uuid not null references auth.users (id) on delete cascade,
    app_slug      text not null,
    tier          text not null
                  check (tier in ('beginner','intermediate','advanced')),
    module_key    text not null,
    lesson_key    text not null,
    first_read_at timestamptz not null default now(),
    unique (user_id, app_slug, tier, module_key, lesson_key)
);
comment on table public.academy_lesson_progress is
    'One row per lesson a learner has marked read (explicit action at the end of the lesson; owner declined minimum-time gating). Written only by academy_mark_lesson_read(), which enforces the sequential-unlock rule server-side. Progress persists across renewals by design (renewal = re-pass exam + capstone, not re-read).';
create index if not exists academy_lesson_progress_user_course_idx
    on public.academy_lesson_progress (user_id, app_slug, tier);

alter table public.academy_lesson_progress enable row level security;
drop policy if exists "academy_lesson_progress_select_own" on public.academy_lesson_progress;
create policy "academy_lesson_progress_select_own"
    on public.academy_lesson_progress for select using (auth.uid() = user_id);
drop policy if exists "academy_lesson_progress_select_admin" on public.academy_lesson_progress;
create policy "academy_lesson_progress_select_admin"
    on public.academy_lesson_progress for select
    using (public.get_user_role() in ('lecturer','admin','super_admin'));

-- ------------------------------------------------------------- quiz banks

create table if not exists public.academy_quiz_questions (
    id           uuid primary key default gen_random_uuid(),
    app_slug     text not null,
    tier         text not null
                 check (tier in ('beginner','intermediate','advanced')),
    scope        text not null check (scope in ('module','final')),
    module_key   text,           -- required when scope='module', null for 'final'
    ord          integer not null default 0,
    prompt       text not null,
    options      jsonb not null,          -- ["A","B","C","D"]
    answer_index integer not null,        -- server-side only, never exposed
    explanation  text,                    -- shown only after a PASSED attempt
    active       boolean not null default true,
    created_at   timestamptz not null default now(),
    check ((scope = 'module') = (module_key is not null))
);
comment on table public.academy_quiz_questions is
    'Module-quiz and final-exam banks, seeded by each course''s content migration. answer_index and explanation NEVER reach the client: no client SELECT policies at all (the academy_assessment_questions pattern); questions are served by academy_get_module_quiz / academy_get_final_exam as a randomized subset without keys, and graded server-side.';
create index if not exists academy_quiz_questions_bank_idx
    on public.academy_quiz_questions (app_slug, tier, scope, module_key) where active;

alter table public.academy_quiz_questions enable row level security;
-- deliberately NO policies: unreachable from the client, even for admins
-- (the admin handbook reads prompts through academy_admin_quiz_syllabus).

-- ---------------------------------------------------------- quiz attempts

create table if not exists public.academy_quiz_attempts (
    id           uuid primary key default gen_random_uuid(),
    user_id      uuid not null references auth.users (id) on delete cascade,
    app_slug     text not null,
    tier         text not null
                 check (tier in ('beginner','intermediate','advanced')),
    scope        text not null check (scope in ('module','final')),
    module_key   text,
    question_ids uuid[] not null,         -- the served set, in served order
    answers      jsonb,
    score        integer,
    max_score    integer,
    passed       boolean,
    status       text not null default 'open'
                 check (status in ('open','submitted','expired')),
    created_at   timestamptz not null default now(),
    submitted_at timestamptz,
    check ((scope = 'module') = (module_key is not null))
);
comment on table public.academy_quiz_attempts is
    'One row per served quiz/exam attempt. An OPEN attempt pins its question set so refreshing cannot fish for an easier draw; open attempts expire after 24h without counting as failures. Cooldown: after every N consecutive submitted failures (academy_quiz_attempts_before_cooldown) the next attempt unlocks cooldown-hours after the last failure. Written only by definer functions.';
create index if not exists academy_quiz_attempts_user_idx
    on public.academy_quiz_attempts (user_id, app_slug, tier, scope, module_key, created_at desc);

alter table public.academy_quiz_attempts enable row level security;
drop policy if exists "academy_quiz_attempts_select_own" on public.academy_quiz_attempts;
create policy "academy_quiz_attempts_select_own"
    on public.academy_quiz_attempts for select using (auth.uid() = user_id);
drop policy if exists "academy_quiz_attempts_select_admin" on public.academy_quiz_attempts;
create policy "academy_quiz_attempts_select_admin"
    on public.academy_quiz_attempts for select
    using (public.get_user_role() in ('lecturer','admin','super_admin'));

-- ------------------------------------------------------- internal helpers
-- None of these are client-callable (revoked below).

-- The active structure row, or null-record when the course-tier is not on
-- the deep path.
create or replace function public.academy_deep_structure(p_app text, p_tier text)
returns public.academy_course_structures
language sql stable security definer set search_path = public as $$
  select * from public.academy_course_structures
   where app_slug = p_app and tier = p_tier and active;
$$;

-- Per-course settings override -> system_settings -> default.
create or replace function public.academy_deep_setting_int(
    p_settings jsonb, p_key text, p_default integer)
returns integer
language sql stable security definer set search_path = public as $$
  select coalesce(nullif(p_settings->>p_key,'')::integer,
                  public.academy_setting_int(p_key, p_default));
$$;

-- How many of a module's lessons the learner has read.
create or replace function public.academy_module_lessons_read(
    p_user uuid, p_app text, p_tier text, p_module jsonb)
returns integer
language sql stable security definer set search_path = public as $$
  select count(*)::integer
    from jsonb_array_elements_text(p_module->'lesson_keys') k(lesson_key)
    join public.academy_lesson_progress lp
      on lp.user_id = p_user and lp.app_slug = p_app and lp.tier = p_tier
     and lp.module_key = p_module->>'key' and lp.lesson_key = k.lesson_key;
$$;

create or replace function public.academy_quiz_passed(
    p_user uuid, p_app text, p_tier text, p_scope text, p_module_key text)
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.academy_quiz_attempts
                  where user_id = p_user and app_slug = p_app and tier = p_tier
                    and scope = p_scope
                    and (module_key = p_module_key or (module_key is null and p_module_key is null))
                    and status = 'submitted' and passed);
$$;

-- A module is complete when every lesson is read AND its quiz is passed.
create or replace function public.academy_module_complete(
    p_user uuid, p_app text, p_tier text, p_module jsonb)
returns boolean
language sql stable security definer set search_path = public as $$
  select public.academy_module_lessons_read(p_user, p_app, p_tier, p_module)
           = jsonb_array_length(p_module->'lesson_keys')
     and public.academy_quiz_passed(p_user, p_app, p_tier, 'module', p_module->>'key');
$$;

-- Module N is unlocked when it is the first module or module N-1 is
-- complete. p_index is 1-based position in the structure's modules array.
create or replace function public.academy_module_unlocked(
    p_user uuid, p_struct public.academy_course_structures, p_index integer)
returns boolean
language sql stable security definer set search_path = public as $$
  select case when p_index = 1 then true
         else public.academy_module_complete(
                p_user, p_struct.app_slug, p_struct.tier,
                p_struct.structure->'modules'->(p_index - 2))
         end;
$$;

create or replace function public.academy_all_modules_complete(
    p_user uuid, p_struct public.academy_course_structures)
returns boolean
language sql stable security definer set search_path = public as $$
  select bool_and(public.academy_module_complete(
           p_user, p_struct.app_slug, p_struct.tier, m.value))
    from jsonb_array_elements(p_struct.structure->'modules') m;
$$;

-- Cooldown check: looking at submitted attempts newest-first, count the
-- leading failure streak (a pass resets it; expired attempts never count).
-- After every N consecutive failures the learner is locked until the most
-- recent failure + cooldown hours. Returns the lock expiry, or null.
create or replace function public.academy_quiz_lock_until(
    p_user uuid, p_app text, p_tier text, p_scope text, p_module_key text,
    p_settings jsonb)
returns timestamptz
language plpgsql stable security definer set search_path = public as $$
declare
  v_n      integer := public.academy_deep_setting_int(p_settings, 'academy_quiz_attempts_before_cooldown', 3);
  v_cool   integer := public.academy_deep_setting_int(p_settings, 'academy_quiz_cooldown_hours', 24);
  v_streak integer := 0;
  v_last   timestamptz;
  r        record;
begin
  for r in
    select passed, submitted_at from public.academy_quiz_attempts
     where user_id = p_user and app_slug = p_app and tier = p_tier
       and scope = p_scope
       and (module_key = p_module_key or (module_key is null and p_module_key is null))
       and status = 'submitted'
     order by submitted_at desc
  loop
    exit when r.passed;
    v_streak := v_streak + 1;
    if v_last is null then v_last := r.submitted_at; end if;
  end loop;

  if v_streak > 0 and v_n > 0 and v_streak % v_n = 0
     and now() < v_last + make_interval(hours => v_cool) then
    return v_last + make_interval(hours => v_cool);
  end if;
  return null;
end $$;

-- Shared entry guard for the learner-facing progress RPCs: signed in,
-- Learning scope resolved (activation + entitlement), an ACTIVE
-- enrollment at exactly (app, tier), and the course-tier on the deep
-- path. Returns the structure row.
create or replace function public.academy_deep_guard(p_app text, p_tier text)
returns public.academy_course_structures
language plpgsql stable security definer set search_path = public as $$
declare v_struct public.academy_course_structures;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if not public.academy_has_scope(p_app, 'learning') then
    raise exception 'enroll and activate Learning Mode first';
  end if;
  if not exists (select 1 from public.academy_enrollments
                  where user_id = auth.uid() and app_slug = p_app
                    and course_tier = p_tier and status = 'active') then
    raise exception 'an active % enrollment in this course is required', p_tier;
  end if;
  v_struct := public.academy_deep_structure(p_app, p_tier);
  if v_struct.app_slug is null then
    raise exception 'no deep course structure for % (%)', p_app, p_tier;
  end if;
  return v_struct;
end $$;

-- Serve (or re-serve) a quiz attempt. Internal core shared by the module
-- and final RPCs; all validation done by the callers + here.
create or replace function public.academy_serve_quiz(
    p_app text, p_tier text, p_scope text, p_module_key text,
    p_settings jsonb)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_uid    uuid := auth.uid();
  v_locked timestamptz;
  v_serve  integer;
  v_att    public.academy_quiz_attempts;
  v_ids    uuid[];
  v_qs     jsonb;
begin
  v_locked := public.academy_quiz_lock_until(v_uid, p_app, p_tier, p_scope, p_module_key, p_settings);
  if v_locked is not null then
    return jsonb_build_object('locked', true, 'locked_until', v_locked);
  end if;

  -- Expire stale open attempts (they never count as failures), then
  -- re-serve a live open attempt so refreshing cannot resample the bank.
  update public.academy_quiz_attempts
     set status = 'expired'
   where user_id = v_uid and app_slug = p_app and tier = p_tier
     and scope = p_scope
     and (module_key = p_module_key or (module_key is null and p_module_key is null))
     and status = 'open' and created_at < now() - interval '24 hours';

  select * into v_att from public.academy_quiz_attempts
   where user_id = v_uid and app_slug = p_app and tier = p_tier
     and scope = p_scope
     and (module_key = p_module_key or (module_key is null and p_module_key is null))
     and status = 'open'
   order by created_at desc limit 1;

  if v_att.id is null then
    v_serve := public.academy_deep_setting_int(p_settings,
      case when p_scope = 'final' then 'academy_final_exam_serve'
           else 'academy_module_quiz_serve' end,
      case when p_scope = 'final' then 25 else 10 end);

    select array_agg(id) into v_ids from (
      select id from public.academy_quiz_questions
       where app_slug = p_app and tier = p_tier and scope = p_scope
         and (module_key = p_module_key or (module_key is null and p_module_key is null))
         and active
       order by random() limit v_serve) s;

    if v_ids is null or array_length(v_ids, 1) = 0 then
      raise exception 'no % questions seeded for % (%)', p_scope, p_app, p_tier;
    end if;

    insert into public.academy_quiz_attempts
        (user_id, app_slug, tier, scope, module_key, question_ids)
    values (v_uid, p_app, p_tier, p_scope, p_module_key, v_ids)
    returning * into v_att;
  end if;

  select jsonb_agg(jsonb_build_object(
           'id', q.id, 'prompt', q.prompt, 'options', q.options)
           order by o.ord)
    into v_qs
    from unnest(v_att.question_ids) with ordinality o(qid, ord)
    join public.academy_quiz_questions q on q.id = o.qid;

  return jsonb_build_object(
    'locked', false,
    'attempt_id', v_att.id,
    'served_at', v_att.created_at,
    'questions', coalesce(v_qs, '[]'::jsonb));
end $$;

-- Grade a submitted attempt. Only the served question_ids count; answers
-- for anything else are ignored. On pass, per-question explanations are
-- returned (never answer_index). On fail, score only: which questions
-- were missed stays server-side to protect the bank.
create or replace function public.academy_grade_quiz(p_attempt uuid, p_answers jsonb)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_uid    uuid := auth.uid();
  v_att    public.academy_quiz_attempts;
  v_struct public.academy_course_structures;
  v_max    integer;
  v_score  integer;
  v_pct    integer;
  v_pass   integer;
  v_passed boolean;
  v_locked timestamptz;
  v_expl   jsonb;
begin
  if v_uid is null then raise exception 'authentication required'; end if;

  select * into v_att from public.academy_quiz_attempts
   where id = p_attempt and user_id = v_uid;
  if v_att.id is null then raise exception 'unknown attempt'; end if;
  if v_att.status <> 'open' then raise exception 'attempt already %', v_att.status; end if;

  v_struct := public.academy_deep_structure(v_att.app_slug, v_att.tier);

  v_max := array_length(v_att.question_ids, 1);
  select count(*) into v_score
    from unnest(v_att.question_ids) qid
    join public.academy_quiz_questions q on q.id = qid
   where (p_answers->>q.id::text) ~ '^\d+$'
     and (p_answers->>q.id::text)::integer = q.answer_index;

  v_pass := public.academy_deep_setting_int(v_struct.settings,
    case when v_att.scope = 'final' then 'academy_final_exam_pass_pct'
         else 'academy_module_quiz_pass_pct' end,
    case when v_att.scope = 'final' then 70 else 75 end);
  v_pct := round(100.0 * v_score / v_max);
  v_passed := v_pct >= v_pass;

  update public.academy_quiz_attempts
     set answers = p_answers, score = v_score, max_score = v_max,
         passed = v_passed, status = 'submitted', submitted_at = now()
   where id = v_att.id;

  if v_passed then
    select jsonb_agg(jsonb_build_object('id', q.id, 'prompt', q.prompt,
             'explanation', q.explanation) order by o.ord)
      into v_expl
      from unnest(v_att.question_ids) with ordinality o(qid, ord)
      join public.academy_quiz_questions q on q.id = o.qid
     where q.explanation is not null;
    return jsonb_build_object('passed', true, 'score', v_score,
      'max_score', v_max, 'pct', v_pct, 'pass_pct', v_pass,
      'explanations', coalesce(v_expl, '[]'::jsonb));
  end if;

  v_locked := public.academy_quiz_lock_until(v_uid, v_att.app_slug, v_att.tier,
                v_att.scope, v_att.module_key, v_struct.settings);
  return jsonb_build_object('passed', false, 'score', v_score,
    'max_score', v_max, 'pct', v_pct, 'pass_pct', v_pass,
    'locked_until', v_locked);
end $$;

-- --------------------------------------------------- learner-facing RPCs

-- Mark one lesson read. Idempotent; refuses lessons in locked modules or
-- keys not present in the structure.
create or replace function public.academy_mark_lesson_read(
    p_app text, p_tier text, p_module_key text, p_lesson_key text)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_struct public.academy_course_structures;
  v_module jsonb;
  v_index  integer;
begin
  v_struct := public.academy_deep_guard(p_app, p_tier);

  select m.value, m.ordinality into v_module, v_index
    from jsonb_array_elements(v_struct.structure->'modules') with ordinality m
   where m.value->>'key' = p_module_key;
  if v_module is null then raise exception 'unknown module %', p_module_key; end if;
  if not (v_module->'lesson_keys') ? p_lesson_key then
    raise exception 'unknown lesson % in module %', p_lesson_key, p_module_key;
  end if;
  if not public.academy_module_unlocked(auth.uid(), v_struct, v_index::integer) then
    raise exception 'module % is locked: complete the previous module first', p_module_key;
  end if;

  insert into public.academy_lesson_progress
      (user_id, app_slug, tier, module_key, lesson_key)
  values (auth.uid(), p_app, p_tier, p_module_key, p_lesson_key)
  on conflict (user_id, app_slug, tier, module_key, lesson_key) do nothing;

  return jsonb_build_object(
    'module_key', p_module_key,
    'lessons_read', public.academy_module_lessons_read(auth.uid(), p_app, p_tier, v_module),
    'lessons_total', jsonb_array_length(v_module->'lesson_keys'),
    'module_complete', public.academy_module_complete(auth.uid(), p_app, p_tier, v_module));
end $$;

-- Serve the module quiz (requires the module unlocked + all its lessons
-- read). Returns {locked, locked_until} instead of questions when in
-- cooldown.
create or replace function public.academy_get_module_quiz(
    p_app text, p_tier text, p_module_key text)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_struct public.academy_course_structures;
  v_module jsonb;
  v_index  integer;
begin
  v_struct := public.academy_deep_guard(p_app, p_tier);

  select m.value, m.ordinality into v_module, v_index
    from jsonb_array_elements(v_struct.structure->'modules') with ordinality m
   where m.value->>'key' = p_module_key;
  if v_module is null then raise exception 'unknown module %', p_module_key; end if;
  if not public.academy_module_unlocked(auth.uid(), v_struct, v_index::integer) then
    raise exception 'module % is locked: complete the previous module first', p_module_key;
  end if;
  if public.academy_module_lessons_read(auth.uid(), p_app, p_tier, v_module)
       < jsonb_array_length(v_module->'lesson_keys') then
    raise exception 'read all lessons in module % before its quiz', p_module_key;
  end if;

  return public.academy_serve_quiz(p_app, p_tier, 'module', p_module_key, v_struct.settings);
end $$;

create or replace function public.academy_submit_module_quiz(
    p_attempt uuid, p_answers jsonb)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_att public.academy_quiz_attempts;
begin
  select * into v_att from public.academy_quiz_attempts
   where id = p_attempt and user_id = auth.uid();
  if v_att.id is null or v_att.scope <> 'module' then
    raise exception 'unknown module-quiz attempt';
  end if;
  return public.academy_grade_quiz(p_attempt, p_answers);
end $$;

-- Serve the tier final exam (requires every module complete).
create or replace function public.academy_get_final_exam(p_app text, p_tier text)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_struct public.academy_course_structures;
begin
  v_struct := public.academy_deep_guard(p_app, p_tier);
  if not public.academy_all_modules_complete(auth.uid(), v_struct) then
    raise exception 'complete every module (lessons and quizzes) before the final exam';
  end if;
  return public.academy_serve_quiz(p_app, p_tier, 'final', null, v_struct.settings);
end $$;

create or replace function public.academy_submit_final_exam(
    p_attempt uuid, p_answers jsonb)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_att public.academy_quiz_attempts;
begin
  select * into v_att from public.academy_quiz_attempts
   where id = p_attempt and user_id = auth.uid();
  if v_att.id is null or v_att.scope <> 'final' then
    raise exception 'unknown final-exam attempt';
  end if;
  return public.academy_grade_quiz(p_attempt, p_answers);
end $$;

-- One-round-trip progress summary for the course UI.
create or replace function public.academy_course_progress(p_app text, p_tier text)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_uid     uuid := auth.uid();
  v_struct  public.academy_course_structures;
  v_modules jsonb := '[]'::jsonb;
  v_all     boolean;
  v_final   boolean;
  m         record;
begin
  if v_uid is null then raise exception 'authentication required'; end if;
  v_struct := public.academy_deep_structure(p_app, p_tier);
  if v_struct.app_slug is null then
    return jsonb_build_object('deep', false);
  end if;

  for m in
    select value, ordinality from jsonb_array_elements(v_struct.structure->'modules') with ordinality
  loop
    v_modules := v_modules || jsonb_build_object(
      'key', m.value->>'key',
      'title', m.value->>'title',
      'lessons_total', jsonb_array_length(m.value->'lesson_keys'),
      'lessons_read', public.academy_module_lessons_read(v_uid, p_app, p_tier, m.value),
      'lesson_keys_read', coalesce((
        select jsonb_agg(lp.lesson_key)
          from public.academy_lesson_progress lp
         where lp.user_id = v_uid and lp.app_slug = p_app and lp.tier = p_tier
           and lp.module_key = m.value->>'key'), '[]'::jsonb),
      'quiz_passed', public.academy_quiz_passed(v_uid, p_app, p_tier, 'module', m.value->>'key'),
      'quiz_attempts', (
        select count(*) from public.academy_quiz_attempts
         where user_id = v_uid and app_slug = p_app and tier = p_tier
           and scope = 'module' and module_key = m.value->>'key'
           and status = 'submitted'),
      'quiz_locked_until', public.academy_quiz_lock_until(
        v_uid, p_app, p_tier, 'module', m.value->>'key', v_struct.settings),
      'unlocked', public.academy_module_unlocked(v_uid, v_struct, m.ordinality::integer),
      'complete', public.academy_module_complete(v_uid, p_app, p_tier, m.value));
  end loop;

  v_all   := public.academy_all_modules_complete(v_uid, v_struct);
  v_final := public.academy_quiz_passed(v_uid, p_app, p_tier, 'final', null);

  return jsonb_build_object(
    'deep', true,
    'content_version', v_struct.content_version,
    'modules', v_modules,
    'final_exam', jsonb_build_object(
      'unlocked', v_all,
      'passed', v_final,
      'attempts', (select count(*) from public.academy_quiz_attempts
                    where user_id = v_uid and app_slug = p_app and tier = p_tier
                      and scope = 'final' and status = 'submitted'),
      'locked_until', public.academy_quiz_lock_until(v_uid, p_app, p_tier, 'final', null, v_struct.settings)),
    'capstone', jsonb_build_object(
      'unlocked', v_final,
      'passed', exists (select 1 from public.academy_capstone_attempts
                         where user_id = v_uid and app_slug = p_app
                           and tier = p_tier and passed)));
end $$;

-- ------------------------------------------------------------ admin RPC

-- Full banks WITHOUT answer keys, for the admin course handbook.
create or replace function public.academy_admin_quiz_syllabus(p_app text, p_tier text)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  if public.get_user_role() not in ('lecturer','admin','super_admin') then
    raise exception 'admin or lecturer role required';
  end if;
  return jsonb_build_object(
    'module_banks', coalesce((
      select jsonb_agg(jsonb_build_object('module_key', module_key, 'questions', qs)
               order by module_key)
        from (
          select module_key,
                 jsonb_agg(jsonb_build_object('prompt', prompt, 'options', options)
                   order by ord, created_at) as qs
            from public.academy_quiz_questions
           where app_slug = p_app and tier = p_tier and scope = 'module' and active
           group by module_key) b), '[]'::jsonb),
    'final_bank', coalesce((
      select jsonb_agg(jsonb_build_object('prompt', prompt, 'options', options)
               order by ord, created_at)
        from public.academy_quiz_questions
       where app_slug = p_app and tier = p_tier and scope = 'final' and active),
      '[]'::jsonb));
end $$;

-- --------------------------------- capstone: require the final exam
-- Body identical to 20260716_owner_decisions.sql section 3 (incl. the Q2
-- renewal logic) plus ONE new gate after the enrollment check: when the
-- course-tier has an active structure row AND the enrollment was created
-- at/after enforced_from, a passed final exam is required (which itself
-- implies every module is complete). Reviewer-door enrollments by a
-- super_admin bypass the gate (the 20260821 exemption's contract:
-- payment_ref is unforgeable from the client; the role re-check is belt
-- and braces).

create or replace function public.academy_submit_capstone(
    p_app     text,
    p_tier    text,
    p_answers jsonb)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_uid     uuid := auth.uid();
  v_cap     public.academy_capstones;
  v_field   jsonb;
  v_key     text;
  v_exp     numeric;
  v_tol     numeric;
  v_got     numeric;
  v_total   integer := 0;
  v_pass    integer := 0;
  v_missed  text[] := '{}';
  v_passed  boolean;
  v_cert    public.academy_certifications;
  v_prev    public.academy_certifications;
  v_renewed boolean := false;
  v_enr     public.academy_enrollments;
  v_struct  public.academy_course_structures;
  v_bypass  boolean;
begin
  if v_uid is null then raise exception 'authentication required'; end if;

  -- Learning Mode required (activated + enrolled → learning scope).
  if not public.academy_has_scope(p_app, 'learning') then
    raise exception 'enroll and activate Learning Mode before attempting the capstone';
  end if;

  -- NG6: the graded tier must be the tier the learner is enrolled in —
  -- an active enrollment at exactly (app, tier). Fee integrity: each
  -- tier is a separately priced course.
  select * into v_enr from public.academy_enrollments
   where user_id = v_uid and app_slug = p_app
     and course_tier = p_tier and status = 'active'
   order by created_at desc limit 1;
  if v_enr.id is null then
    raise exception 'an active % enrollment in this course is required for this capstone', p_tier;
  end if;

  -- DC1: deep-path exam gate. Grandfather: enrollments created before
  -- the structure's enforced_from finish on the path they bought.
  v_struct := public.academy_deep_structure(p_app, p_tier);
  if v_struct.app_slug is not null
     and v_enr.created_at >= v_struct.enforced_from then
    v_bypass := v_enr.payment_ref = 'reviewer-door'
      and exists (select 1 from public.profiles
                   where id = v_uid and role = 'super_admin');
    if not coalesce(v_bypass, false)
       and not public.academy_quiz_passed(v_uid, p_app, p_tier, 'final', null) then
      raise exception 'complete all modules and pass the final exam before the capstone';
    end if;
  end if;

  select * into v_cap from public.academy_capstones
   where app_slug = p_app and tier = p_tier and active;
  if v_cap.app_slug is null then
    raise exception 'no capstone for % (%)', p_app, p_tier;
  end if;

  for v_field in select * from jsonb_array_elements(v_cap.fields) loop
    v_total := v_total + 1;
    v_key := v_field->>'key';
    v_exp := (v_field->>'expected')::numeric;
    v_tol := (v_field->>'tol')::numeric;
    begin
      v_got := (p_answers->>v_key)::numeric;
    exception when others then
      v_got := null;
    end;
    if v_got is not null and abs(v_got - v_exp) <= v_tol then
      v_pass := v_pass + 1;
    else
      v_missed := array_append(v_missed, v_key);
    end if;
  end loop;

  v_passed := (v_pass = v_total);

  insert into public.academy_capstone_attempts
      (user_id, app_slug, tier, score, max_score, passed, answers)
  values (v_uid, p_app, p_tier, v_pass, v_total, v_passed, p_answers);

  if not v_passed then
    return jsonb_build_object('passed', false, 'score', v_pass,
      'max_score', v_total, 'missed', to_jsonb(v_missed));
  end if;

  -- Q2 (locked 2026-07-16): a live certificate MORE than 60 days from
  -- expiry short-circuits (already certified); a live certificate
  -- inside its renewal window is SUPERSEDED (revoke → the N3.1/NG7
  -- triggers expire its entitlement and void its unredeemed bridge
  -- code → fresh insert grants a new 12-month window and, for Expert,
  -- a fresh bridge code); an expired certificate simply re-issues.
  select * into v_prev from public.academy_certifications
   where user_id = v_uid and app_slug = p_app
     and tier = v_cap.cert_tier
     and revoked_at is null and now() < valid_until
   order by valid_until desc limit 1;

  if v_prev.id is not null then
    if now() < v_prev.valid_until - interval '60 days' then
      return jsonb_build_object('passed', true, 'score', v_pass,
        'max_score', v_total, 'already_certified', true);
    end if;
    update public.academy_certifications
       set revoked_at = now()
     where id = v_prev.id;
    v_renewed := true;
  end if;

  insert into public.academy_certifications
      (user_id, course_id, app_slug, tier)
  values (v_uid, public.academy_course_for_app(p_app), p_app, v_cap.cert_tier)
  returning * into v_cert;

  return jsonb_build_object('passed', true, 'score', v_pass,
    'max_score', v_total,
    'certificate_number', v_cert.certificate_number,
    'verify_code', v_cert.verify_code,
    'tier', v_cert.tier,
    'valid_until', v_cert.valid_until,
    'renewed', v_renewed);
end $$;

-- --------------------------------------------------------------- grants

-- learner-facing
revoke all on function public.academy_mark_lesson_read(text, text, text, text) from public, anon;
grant execute on function public.academy_mark_lesson_read(text, text, text, text) to authenticated;
revoke all on function public.academy_get_module_quiz(text, text, text) from public, anon;
grant execute on function public.academy_get_module_quiz(text, text, text) to authenticated;
revoke all on function public.academy_submit_module_quiz(uuid, jsonb) from public, anon;
grant execute on function public.academy_submit_module_quiz(uuid, jsonb) to authenticated;
revoke all on function public.academy_get_final_exam(text, text) from public, anon;
grant execute on function public.academy_get_final_exam(text, text) to authenticated;
revoke all on function public.academy_submit_final_exam(uuid, jsonb) from public, anon;
grant execute on function public.academy_submit_final_exam(uuid, jsonb) to authenticated;
revoke all on function public.academy_course_progress(text, text) from public, anon;
grant execute on function public.academy_course_progress(text, text) to authenticated;
revoke all on function public.academy_admin_quiz_syllabus(text, text) from public, anon;
grant execute on function public.academy_admin_quiz_syllabus(text, text) to authenticated;

-- internal: not client-callable
revoke all on function public.academy_deep_structure(text, text) from public, anon, authenticated;
revoke all on function public.academy_deep_setting_int(jsonb, text, integer) from public, anon, authenticated;
revoke all on function public.academy_module_lessons_read(uuid, text, text, jsonb) from public, anon, authenticated;
revoke all on function public.academy_quiz_passed(uuid, text, text, text, text) from public, anon, authenticated;
revoke all on function public.academy_module_complete(uuid, text, text, jsonb) from public, anon, authenticated;
revoke all on function public.academy_module_unlocked(uuid, public.academy_course_structures, integer) from public, anon, authenticated;
revoke all on function public.academy_all_modules_complete(uuid, public.academy_course_structures) from public, anon, authenticated;
revoke all on function public.academy_quiz_lock_until(uuid, text, text, text, text, jsonb) from public, anon, authenticated;
revoke all on function public.academy_deep_guard(text, text) from public, anon, authenticated;
revoke all on function public.academy_serve_quiz(text, text, text, text, jsonb) from public, anon, authenticated;
revoke all on function public.academy_grade_quiz(uuid, jsonb) from public, anon, authenticated;
