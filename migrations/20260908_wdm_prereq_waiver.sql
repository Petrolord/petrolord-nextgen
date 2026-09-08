-- Well Data Manager prerequisite: waiver exam + bonus tier
-- (owner decision 2026-09-08, "option 1").
--
-- Young professionals on the partnership programme objected to spending a
-- sponsor seat and weeks on Well Data Manager (WDM) before Petrophysics,
-- when they already know the material. academy_enforce_prereq required a
-- LIVE WDM Associate certification before any enrolment in the other nine
-- geoscience courses, whatever the door, and a refused sponsor assign
-- surfaced only as the raw trigger message.
--
-- WDM stays the root of the geoscience path. Two things change:
--
--  1. A FREE waiver exam. academy_get_prereq_waiver_exam(root) serves a
--     randomized set from the root course's Beginner FINAL bank through the
--     existing quiz machinery (attempt scope 'waiver', pinned set, cooldown,
--     final-exam pass mark), with no enrolment and no seat. A pass writes
--     academy_prereq_waivers (12 months, like a certificate), which
--     academy_enforce_prereq now accepts alongside the certification. The
--     trigger's message names both routes.
--  2. Bonus tiers. academy_apps.bonus_tiers lists tiers that consume NO
--     sponsor-pool seat (academy_sponsor_assign / _cancel honour it via
--     academy_sponsor_assignments.seat_consumed) and carry a zero self-enrol
--     fee (academy_start_self_enrollment activates a zero-fee enrolment at
--     once, no Paystack). WDM Beginner is the first bonus tier.
--
-- Idempotent. No data is destroyed. Pentest: docs/wdm-prereq-waiver-pentest.md.

-- ------------------------------------------------------------ bonus tiers

alter table public.academy_apps
  add column if not exists bonus_tiers text[] not null default '{}';
comment on column public.academy_apps.bonus_tiers is
  'Tiers of this course that are a BONUS: no sponsor-pool seat is consumed and the self-enrol fee is zero (a per-app academy_fees override of 0). Owner decision 2026-09-08: Well Data Manager Beginner, the prerequisite root of the geoscience path.';

update public.academy_apps set bonus_tiers = array['beginner']
 where slug = 'welldata' and not ('beginner' = any (bonus_tiers));

-- Zero course + renewal fee for the bonus tier (per-app override wins in
-- academy_fee()). amount_minor has a >= 0 check, so 0 is allowed.
insert into public.academy_fees (school, app_slug, course_tier, kind, amount_minor, amount_usd_minor, currency, active)
values ('subsurface', 'welldata', 'beginner', 'course', 0, 0, 'NGN', true)
on conflict (app_slug, course_tier, kind) where app_slug is not null
do update set amount_minor = 0, amount_usd_minor = 0, active = true;

insert into public.academy_fees (school, app_slug, course_tier, kind, amount_minor, amount_usd_minor, currency, active)
select 'subsurface', 'welldata', 'beginner', 'renewal', 0, 0, 'NGN', true
 where exists (select 1 from public.academy_fees where kind = 'renewal')
on conflict (app_slug, course_tier, kind) where app_slug is not null
do update set amount_minor = 0, amount_usd_minor = 0, active = true;

-- ---------------------------------------------------------- waiver records

create table if not exists public.academy_prereq_waivers (
    id            uuid primary key default gen_random_uuid(),
    user_id       uuid not null references auth.users (id) on delete cascade,
    app_slug      text not null references public.academy_apps (slug),
    attempt_id    uuid references public.academy_quiz_attempts (id) on delete set null,
    score         integer,
    max_score     integer,
    pct           integer,
    passed_at     timestamptz not null default now(),
    valid_until   timestamptz not null default now() + interval '12 months',
    revoked_at    timestamptz,
    revoked_by    uuid references auth.users (id),
    revoke_reason text,
    created_at    timestamptz not null default now(),
    unique (user_id, app_slug)
);
comment on table public.academy_prereq_waivers is
    'A passed FREE waiver exam on a prerequisite-root course (app_slug). Satisfies academy_enforce_prereq for the courses that name it as prereq_slug, exactly like a live Associate certification, for 12 months. Earns no certificate and no scope. Written only by academy_submit_prereq_waiver_exam; a re-pass refreshes the row.';
create index if not exists academy_prereq_waivers_user_idx
    on public.academy_prereq_waivers (user_id, app_slug);

alter table public.academy_prereq_waivers enable row level security;
drop policy if exists "academy_prereq_waivers_select_own" on public.academy_prereq_waivers;
create policy "academy_prereq_waivers_select_own"
    on public.academy_prereq_waivers for select using (auth.uid() = user_id);
drop policy if exists "academy_prereq_waivers_select_admin" on public.academy_prereq_waivers;
create policy "academy_prereq_waivers_select_admin"
    on public.academy_prereq_waivers for select using (public.academy_is_admin());
-- deliberately no client write policies

-- Attempts gain the 'waiver' scope (questions keep 'module' | 'final':
-- the waiver draws from the Beginner FINAL bank).
alter table public.academy_quiz_attempts drop constraint if exists academy_quiz_attempts_scope_check;
alter table public.academy_quiz_attempts
  add constraint academy_quiz_attempts_scope_check check (scope in ('module', 'final', 'waiver'));

-- ---------------------------------------- quiz core: waiver scope mapping

-- Same signature and behaviour as DC1; the only change is that a 'waiver'
-- attempt draws from the FINAL bank with the final-exam serve size.
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
  v_bank   text := case when p_scope = 'waiver' then 'final' else p_scope end;
begin
  v_locked := public.academy_quiz_lock_until(v_uid, p_app, p_tier, p_scope, p_module_key, p_settings);
  if v_locked is not null then
    return jsonb_build_object('locked', true, 'locked_until', v_locked);
  end if;

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
      case when v_bank = 'final' then 'academy_final_exam_serve'
           else 'academy_module_quiz_serve' end,
      case when v_bank = 'final' then 25 else 10 end);

    select array_agg(id) into v_ids from (
      select id from public.academy_quiz_questions
       where app_slug = p_app and tier = p_tier and scope = v_bank
         and (module_key = p_module_key or (module_key is null and p_module_key is null))
         and active
       order by random() limit v_serve) s;

    if v_ids is null or array_length(v_ids, 1) = 0 then
      raise exception 'no % questions seeded for % (%)', v_bank, p_app, p_tier;
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

-- Grading is unchanged except that a 'waiver' attempt uses the final-exam
-- pass mark.
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
  v_final  boolean;
begin
  if v_uid is null then raise exception 'authentication required'; end if;

  select * into v_att from public.academy_quiz_attempts
   where id = p_attempt and user_id = v_uid;
  if v_att.id is null then raise exception 'unknown attempt'; end if;
  if v_att.status <> 'open' then raise exception 'attempt already %', v_att.status; end if;

  v_struct := public.academy_deep_structure(v_att.app_slug, v_att.tier);
  v_final := v_att.scope in ('final', 'waiver');

  v_max := array_length(v_att.question_ids, 1);
  select count(*) into v_score
    from unnest(v_att.question_ids) qid
    join public.academy_quiz_questions q on q.id = qid
   where (p_answers->>q.id::text) ~ '^\d+$'
     and (p_answers->>q.id::text)::integer = q.answer_index;

  v_pass := public.academy_deep_setting_int(v_struct.settings,
    case when v_final then 'academy_final_exam_pass_pct'
         else 'academy_module_quiz_pass_pct' end,
    case when v_final then 70 else 75 end);
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

-- ------------------------------------------------------- waiver functions

-- True when the user holds a live (non-revoked, unexpired) waiver on a root.
create or replace function public.academy_has_prereq_waiver(p_user uuid, p_root text)
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.academy_prereq_waivers
                  where user_id = p_user and app_slug = p_root
                    and revoked_at is null and now() < valid_until);
$$;

-- What a learner needs before enrolling in p_app, and how far they are.
-- via: 'none' (no prerequisite), 'certification', 'waiver', 'enrolled'
-- (already in the course, the trigger lets them continue), or null when
-- nothing satisfies it yet.
create or replace function public.academy_prereq_waiver_status(p_app text)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_uid   uuid := auth.uid();
  v_app   public.academy_apps;
  v_root  public.academy_apps;
  v_w     public.academy_prereq_waivers;
  v_via   text;
  v_lock  timestamptz;
  v_bank  integer;
begin
  if v_uid is null then raise exception 'authentication required'; end if;
  select * into v_app from public.academy_apps where slug = p_app;
  if v_app.slug is null then raise exception 'unknown course %', p_app; end if;
  if v_app.prereq_slug is null then
    return jsonb_build_object('app_slug', p_app, 'required', false, 'satisfied', true, 'via', 'none');
  end if;
  select * into v_root from public.academy_apps where slug = v_app.prereq_slug;

  if exists (select 1 from public.academy_certifications
              where user_id = v_uid and app_slug = v_root.slug
                and revoked_at is null and now() < valid_until) then
    v_via := 'certification';
  elsif public.academy_has_prereq_waiver(v_uid, v_root.slug) then
    v_via := 'waiver';
  elsif exists (select 1 from public.academy_enrollments
                 where user_id = v_uid and app_slug = p_app) then
    v_via := 'enrolled';
  end if;

  select * into v_w from public.academy_prereq_waivers
   where user_id = v_uid and app_slug = v_root.slug;
  v_lock := public.academy_quiz_lock_until(v_uid, v_root.slug, 'beginner', 'waiver', null,
              (select settings from public.academy_course_structures
                where app_slug = v_root.slug and tier = 'beginner' and active));
  select count(*) into v_bank from public.academy_quiz_questions
   where app_slug = v_root.slug and tier = 'beginner' and scope = 'final' and active;

  return jsonb_build_object(
    'app_slug', p_app,
    'required', true,
    'prereq_slug', v_root.slug,
    'prereq_name', v_root.name,
    'prereq_bonus_tiers', to_jsonb(coalesce(v_root.bonus_tiers, '{}'::text[])),
    'satisfied', v_via is not null,
    'via', v_via,
    'waiver', case when v_w.id is null then null else jsonb_build_object(
                'passed_at', v_w.passed_at, 'valid_until', v_w.valid_until,
                'pct', v_w.pct, 'revoked_at', v_w.revoked_at) end,
    'exam_available', v_bank > 0,
    'locked_until', v_lock);
end $$;

-- Serve the free waiver exam for a prerequisite ROOT course (p_root, e.g.
-- 'welldata'). No enrolment, no seat, no activation gate: signed in only.
create or replace function public.academy_get_prereq_waiver_exam(p_root text)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_uid  uuid := auth.uid();
  v_root public.academy_apps;
  v_set  jsonb;
begin
  if v_uid is null then raise exception 'authentication required'; end if;
  select * into v_root from public.academy_apps where slug = p_root;
  if v_root.slug is null then raise exception 'unknown course %', p_root; end if;
  if not exists (select 1 from public.academy_apps where prereq_slug = p_root) then
    raise exception '% is not a prerequisite for any course, so there is no waiver exam for it', v_root.name;
  end if;
  if exists (select 1 from public.academy_certifications
              where user_id = v_uid and app_slug = p_root
                and revoked_at is null and now() < valid_until) then
    raise exception 'you already hold a live % certification: the prerequisite is satisfied', v_root.name;
  end if;
  if public.academy_has_prereq_waiver(v_uid, p_root) then
    raise exception 'you already hold a live % waiver: the prerequisite is satisfied', v_root.name;
  end if;
  select settings into v_set from public.academy_course_structures
   where app_slug = p_root and tier = 'beginner' and active;
  return public.academy_serve_quiz(p_root, 'beginner', 'waiver', null, coalesce(v_set, '{}'::jsonb));
end $$;

-- Grade a waiver attempt; a pass writes (or refreshes) the waiver row.
create or replace function public.academy_submit_prereq_waiver_exam(
    p_attempt uuid, p_answers jsonb)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_att public.academy_quiz_attempts;
  v_res jsonb;
  v_w   public.academy_prereq_waivers;
begin
  select * into v_att from public.academy_quiz_attempts
   where id = p_attempt and user_id = auth.uid();
  if v_att.id is null or v_att.scope <> 'waiver' then
    raise exception 'unknown waiver-exam attempt';
  end if;
  v_res := public.academy_grade_quiz(p_attempt, p_answers);
  if (v_res->>'passed')::boolean then
    insert into public.academy_prereq_waivers
        (user_id, app_slug, attempt_id, score, max_score, pct, passed_at, valid_until)
    values (auth.uid(), v_att.app_slug, v_att.id,
            (v_res->>'score')::integer, (v_res->>'max_score')::integer, (v_res->>'pct')::integer,
            now(), now() + interval '12 months')
    on conflict (user_id, app_slug) do update
      set attempt_id = excluded.attempt_id, score = excluded.score,
          max_score = excluded.max_score, pct = excluded.pct,
          passed_at = now(), valid_until = now() + interval '12 months',
          revoked_at = null, revoked_by = null, revoke_reason = null
    returning * into v_w;
    v_res := v_res || jsonb_build_object('waiver', jsonb_build_object(
      'app_slug', v_w.app_slug, 'passed_at', v_w.passed_at, 'valid_until', v_w.valid_until));
  end if;
  return v_res;
end $$;

-- Admin revoke (academic integrity). Earned certifications are untouched.
create or replace function public.academy_admin_revoke_prereq_waiver(
    p_user uuid, p_root text, p_reason text default null)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_w public.academy_prereq_waivers;
begin
  if not public.academy_is_admin() then raise exception 'insufficient privileges'; end if;
  update public.academy_prereq_waivers
     set revoked_at = now(), revoked_by = auth.uid(),
         revoke_reason = nullif(trim(coalesce(p_reason, '')), '')
   where user_id = p_user and app_slug = p_root and revoked_at is null
  returning * into v_w;
  if v_w.id is null then raise exception 'no live waiver to revoke'; end if;
  return jsonb_build_object('waiver_id', v_w.id, 'revoked_at', v_w.revoked_at);
end $$;

-- --------------------------------------------- prerequisite trigger update

create or replace function public.academy_enforce_prereq()
returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v_prereq text;
  v_name   text;
  v_need   text;
begin
  -- Reviewer-door exemption (owner-approved 2026-08-21), unchanged.
  if new.payment_ref = 'reviewer-door' and exists (
       select 1 from public.profiles
        where id = new.user_id and role = 'super_admin') then
    return new;
  end if;

  -- Tier progression FIRST (never bypassed by same-app grandfathering).
  v_need := case new.course_tier
              when 'intermediate' then 'associate'
              when 'advanced' then 'professional'
              else null end;
  if v_need is not null and not exists (
       select 1 from public.academy_certifications
        where user_id = new.user_id and app_slug = new.app_slug
          and tier = v_need and revoked_at is null) then
    raise exception 'ladder progression: a % certification on this course is required before enrolling in the % tier',
      v_need, new.course_tier;
  end if;

  -- App prerequisite (NG1: the well-registry root).
  select prereq_slug into v_prereq from public.academy_apps
   where slug = new.app_slug;
  if v_prereq is null then
    return new;
  end if;

  if exists (select 1 from public.academy_enrollments
              where user_id = new.user_id and app_slug = new.app_slug) then
    return new;
  end if;
  if exists (select 1 from public.academy_certifications
              where user_id = new.user_id and app_slug = new.app_slug
                and revoked_at is null and now() < valid_until) then
    return new;
  end if;

  -- Satisfied by a live Associate certification on the root, OR (owner
  -- decision 2026-09-08) a live passed waiver exam on the root.
  if exists (select 1 from public.academy_certifications
              where user_id = new.user_id and app_slug = v_prereq
                and revoked_at is null and now() < valid_until)
     or public.academy_has_prereq_waiver(new.user_id, v_prereq) then
    return new;
  end if;

  select name into v_name from public.academy_apps where slug = v_prereq;
  raise exception 'prerequisite not met: % (Associate) is required before this course. Either certify in it (its Beginner tier is free and takes no sponsor seat) or pass the free % waiver exam from the Enroll page.',
    coalesce(v_name, v_prereq), coalesce(v_name, v_prereq);
end $$;

-- ------------------------------------------ sponsor pools: bonus tiers

alter table public.academy_sponsor_assignments
  add column if not exists seat_consumed boolean not null default true;
comment on column public.academy_sponsor_assignments.seat_consumed is
  'False for a bonus tier (academy_apps.bonus_tiers): the assignment created the enrolment but took no seat, so cancelling returns none.';

create or replace function public.academy_sponsor_assign(
    p_pool_id  uuid,
    p_email    text,
    p_app_slug text,
    p_tier     text default 'beginner',
    p_note     text default null)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_pool  public.academy_sponsor_pools;
  v_app   public.academy_apps;
  v_bonus boolean;
  v_user  uuid;
  v_name  text;
  v_open  public.academy_enrollments;
  v_enr   public.academy_enrollments;
  v_asg   public.academy_sponsor_assignments;
begin
  if auth.uid() is null then
    raise exception 'authentication required';
  end if;
  select * into v_pool from public.academy_sponsor_pools where id = p_pool_id for update;
  if v_pool.id is null then
    raise exception 'unknown pool';
  end if;
  if not public.academy_sponsor_can_manage(v_pool.sponsor_id) then
    raise exception 'insufficient privileges';
  end if;
  if v_pool.status <> 'active' then
    raise exception 'this pool is closed';
  end if;
  if now() < v_pool.valid_from or now() >= v_pool.valid_until then
    raise exception 'this pool is outside its validity window';
  end if;
  if p_tier not in ('beginner', 'intermediate', 'advanced') then
    raise exception 'unknown course tier %', p_tier;
  end if;
  select * into v_app from public.academy_apps where slug = p_app_slug and status = 'available';
  if v_app.slug is null then
    raise exception 'course % is not open for enrollment', p_app_slug;
  end if;
  v_bonus := p_tier = any (coalesce(v_app.bonus_tiers, '{}'::text[]));
  if not v_bonus and v_pool.seats_used >= v_pool.seats then
    raise exception 'no seats left in this pool (% of % used)', v_pool.seats_used, v_pool.seats;
  end if;
  if array_length(v_pool.app_slugs, 1) is not null and not (p_app_slug = any (v_pool.app_slugs)) then
    raise exception 'this pool does not cover %', p_app_slug;
  end if;
  if array_length(v_pool.tiers, 1) is not null and not (p_tier = any (v_pool.tiers)) then
    raise exception 'this pool does not cover the % tier', p_tier;
  end if;

  select id, display_name into v_user, v_name from public.profiles
   where lower(email) = lower(trim(coalesce(p_email, '')))
   limit 1;
  if v_user is null then
    raise exception 'no NextGen account for %: ask them to register first', p_email;
  end if;

  select * into v_open from public.academy_enrollments
   where user_id = v_user and app_slug = p_app_slug and course_tier = p_tier
     and status in ('pending', 'active')
   limit 1;
  if v_open.id is not null then
    raise exception '% already has an open enrollment for % (%) via the % door', coalesce(v_name, p_email), p_app_slug, p_tier, v_open.door;
  end if;

  -- The sponsored enrolment. The prerequisite and tier-progression triggers
  -- stay fully in force; their messages surface to the lead unchanged.
  insert into public.academy_enrollments
      (user_id, app_slug, course_tier, door, code_id, pool_id, payment_ref, status)
  values (v_user, p_app_slug, p_tier, 'sponsored', null, v_pool.id,
          case when v_bonus then 'sponsor-pool-bonus:' else 'sponsor-pool:' end || v_pool.id::text, 'active')
  returning * into v_enr;

  insert into public.academy_sponsor_assignments
      (pool_id, sponsor_id, user_id, app_slug, course_tier, enrollment_id, note, assigned_by, seat_consumed)
  values (v_pool.id, v_pool.sponsor_id, v_user, p_app_slug, p_tier, v_enr.id, p_note, auth.uid(), not v_bonus)
  returning * into v_asg;

  if not v_bonus then
    update public.academy_sponsor_pools
       set seats_used = seats_used + 1, updated_at = now()
     where id = v_pool.id;
  end if;

  return jsonb_build_object(
    'assignment_id', v_asg.id, 'enrollment_id', v_enr.id, 'user_id', v_user,
    'display_name', v_name, 'app_slug', p_app_slug, 'course_tier', p_tier,
    'seat_consumed', not v_bonus,
    'seats_used', v_pool.seats_used + case when v_bonus then 0 else 1 end, 'seats', v_pool.seats);
end $$;

create or replace function public.academy_sponsor_cancel(
    p_assignment_id uuid,
    p_reason        text default null)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_asg   public.academy_sponsor_assignments;
  v_enr   public.academy_enrollments;
  v_cert  boolean;
  v_ctier text;
  v_back  boolean := false;
begin
  if auth.uid() is null then
    raise exception 'authentication required';
  end if;
  select * into v_asg from public.academy_sponsor_assignments where id = p_assignment_id for update;
  if v_asg.id is null then
    raise exception 'unknown assignment';
  end if;
  if not public.academy_sponsor_can_manage(v_asg.sponsor_id) then
    raise exception 'insufficient privileges';
  end if;
  if v_asg.status <> 'active' then
    raise exception 'this assignment is already cancelled';
  end if;

  v_ctier := case v_asg.course_tier when 'beginner' then 'associate'
                                    when 'intermediate' then 'professional'
                                    else 'expert' end;
  v_cert := exists (select 1 from public.academy_certifications
                     where user_id = v_asg.user_id and app_slug = v_asg.app_slug
                       and tier = v_ctier and revoked_at is null);

  if v_asg.enrollment_id is not null then
    select * into v_enr from public.academy_enrollments where id = v_asg.enrollment_id for update;
    if v_enr.id is not null and v_enr.status in ('pending', 'active') then
      update public.academy_enrollments
         set status = 'cancelled', updated_at = now()
       where id = v_enr.id;
    end if;
  end if;

  -- A seat comes back only if one was taken and the certification was not earned.
  if v_asg.seat_consumed and not v_cert then
    v_back := true;
    update public.academy_sponsor_pools
       set seats_used = greatest(0, seats_used - 1), updated_at = now()
     where id = v_asg.pool_id;
  end if;

  update public.academy_sponsor_assignments
     set status = 'cancelled', seat_returned = v_back, cancelled_by = auth.uid(),
         cancelled_at = now(), cancel_reason = nullif(trim(coalesce(p_reason, '')), '')
   where id = v_asg.id;

  return jsonb_build_object('assignment_id', v_asg.id, 'seat_returned', v_back,
                            'certified', v_cert, 'seat_consumed', v_asg.seat_consumed);
end $$;

create or replace function public.academy_sponsor_pool_report(p_pool_id uuid)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_sponsor uuid;
begin
  select sponsor_id into v_sponsor from public.academy_sponsor_pools where id = p_pool_id;
  if v_sponsor is null then
    raise exception 'unknown pool';
  end if;
  if not public.academy_sponsor_can_manage(v_sponsor) then
    raise exception 'insufficient privileges';
  end if;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
             'assignment_id', a.id, 'user_id', a.user_id,
             'display_name', p.display_name, 'email', p.email,
             'app_slug', a.app_slug, 'course_name', ap.name, 'course_tier', a.course_tier,
             'status', a.status, 'seat_returned', a.seat_returned, 'seat_consumed', a.seat_consumed,
             'note', a.note,
             'assigned_at', a.assigned_at, 'cancelled_at', a.cancelled_at, 'cancel_reason', a.cancel_reason,
             'enrollment_status', e.status,
             'certified', exists (select 1 from public.academy_certifications c
                                   where c.user_id = a.user_id and c.app_slug = a.app_slug
                                     and c.tier = case a.course_tier when 'beginner' then 'associate'
                                                                     when 'intermediate' then 'professional'
                                                                     else 'expert' end
                                     and c.revoked_at is null)
           ) order by a.assigned_at desc)
      from public.academy_sponsor_assignments a
      left join public.profiles p on p.id = a.user_id
      left join public.academy_apps ap on ap.slug = a.app_slug
      left join public.academy_enrollments e on e.id = a.enrollment_id
     where a.pool_id = p_pool_id), '[]'::jsonb);
end $$;

-- ------------------------------------------ self-enrolment: zero-fee path

create or replace function public.academy_start_self_enrollment(
    p_app_slug text,
    p_tier     text default 'beginner')
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_uid  uuid := auth.uid();
  v_fee  public.academy_fees;
  v_enr  public.academy_enrollments;
  v_ref  text;
  v_cert_tier text;
  v_cert public.academy_certifications;
  v_kind text := 'course';
begin
  if v_uid is null then
    raise exception 'authentication required';
  end if;
  if p_tier not in ('beginner', 'intermediate', 'advanced') then
    raise exception 'unknown course tier %', p_tier;
  end if;
  if not exists (select 1 from public.academy_apps
                  where slug = p_app_slug and status = 'available') then
    raise exception 'course % is not open for enrollment', p_app_slug;
  end if;

  v_cert_tier := case p_tier when 'beginner' then 'associate'
                             when 'intermediate' then 'professional'
                             else 'expert' end;
  select * into v_cert from public.academy_certifications
   where user_id = v_uid and app_slug = p_app_slug and tier = v_cert_tier
     and revoked_at is null
   order by valid_until desc limit 1;
  if v_cert.id is not null then
    if now() < v_cert.valid_until - interval '60 days' then
      raise exception 'already certified % (%) until % — renewal opens 60 days before expiry',
        p_app_slug, v_cert_tier, v_cert.valid_until::date;
    end if;
    v_kind := 'renewal';
  end if;

  select * into v_enr from public.academy_enrollments
   where user_id = v_uid and app_slug = p_app_slug and course_tier = p_tier
     and status in ('pending', 'active')
   limit 1;

  if v_enr.id is not null and v_enr.status = 'active' then
    raise exception 'already enrolled in % (%)', p_app_slug, p_tier;
  end if;
  if v_enr.id is not null and v_enr.door <> 'self' then
    raise exception 'an enrollment via the % door is already pending for this course', v_enr.door;
  end if;

  if v_enr.id is null then
    insert into public.academy_enrollments (user_id, app_slug, course_tier, door, status)
    values (v_uid, p_app_slug, p_tier, 'self', 'pending')
    returning * into v_enr;
  end if;

  select reference into v_ref from public.academy_payments
   where enrollment_id = v_enr.id and status = 'pending'
   order by created_at desc limit 1;

  if v_ref is null then
    v_fee := public.academy_fee(p_app_slug, p_tier, v_kind);
    if v_fee.amount_minor is null then
      raise exception 'no published % fee for % (%)', v_kind, p_app_slug, p_tier;
    end if;

    -- Bonus tier (owner decision 2026-09-08): a zero published fee
    -- activates at once. No payment row (academy_payments requires a
    -- positive amount), the enrolment carries a 'bonus:' reference.
    if v_fee.amount_minor = 0 then
      update public.academy_enrollments
         set status = 'active',
             payment_ref = 'bonus:' || p_app_slug || ':' || p_tier,
             updated_at = now()
       where id = v_enr.id;
      return jsonb_build_object(
        'enrollment_id', v_enr.id,
        'reference', null,
        'amount_minor', 0,
        'currency', v_fee.currency,
        'fee_kind', v_kind,
        'status', 'active');
    end if;

    v_ref := 'ACAD-' || replace(gen_random_uuid()::text, '-', '');
    insert into public.academy_payments
        (user_id, enrollment_id, purpose, reference, amount_minor, currency)
    values (v_uid, v_enr.id,
            case v_kind when 'renewal' then 'renewal_fee' else 'course_fee' end,
            v_ref, v_fee.amount_minor, v_fee.currency);
  end if;

  return (select jsonb_build_object(
            'enrollment_id', v_enr.id,
            'reference', p.reference,
            'amount_minor', p.amount_minor,
            'currency', p.currency,
            'fee_kind', v_kind,
            'status', 'pending_payment')
          from public.academy_payments p where p.reference = v_ref);
end $$;

-- ------------------------------------------------------------- privileges

revoke all on function public.academy_has_prereq_waiver(uuid, text) from public, anon;
grant execute on function public.academy_has_prereq_waiver(uuid, text) to authenticated, service_role;
revoke all on function public.academy_prereq_waiver_status(text) from public, anon;
grant execute on function public.academy_prereq_waiver_status(text) to authenticated;
revoke all on function public.academy_get_prereq_waiver_exam(text) from public, anon;
grant execute on function public.academy_get_prereq_waiver_exam(text) to authenticated;
revoke all on function public.academy_submit_prereq_waiver_exam(uuid, jsonb) from public, anon;
grant execute on function public.academy_submit_prereq_waiver_exam(uuid, jsonb) to authenticated;
revoke all on function public.academy_admin_revoke_prereq_waiver(uuid, text, text) from public, anon;
grant execute on function public.academy_admin_revoke_prereq_waiver(uuid, text, text) to authenticated;
