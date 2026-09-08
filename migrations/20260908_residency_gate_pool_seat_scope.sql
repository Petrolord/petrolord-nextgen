-- Residency door gate + course-scope sponsor seats (owner decisions 2026-09-08).
--
-- 1. Residency intakes cannot be hosted until the new facility opens in
--    2027, yet the door accepted applications that would sit pending
--    forever, and its silence about cost let young professionals read it
--    as the cheap option. The door is now gated by an admin-editable
--    system setting (Admin > System Settings > academy group):
--      academy_residency_open   'false' until the facility is ready
--      academy_residency_notice the sentence learners see while closed
--    academy_apply_residency refuses while closed; academy_doors_status()
--    (anon + authenticated) lets the Enroll and landing pages show the
--    notice instead of the form.
--
-- 2. Sponsor pools gain seat_scope: 'tier' (one seat = one course tier,
--    the Breeze block model, unchanged default) or 'course' (one seat =
--    one course through Associate, Professional and Expert: the ladder
--    tiers of a course the learner already holds a live assignment for in
--    the same pool take no further seat). Built for the Lordsway pioneer
--    cohort: three courses of their choice, every tier, at no charge.
--
-- Idempotent. No data is destroyed. Pentest: docs/residency-gate-seat-scope-pentest.md.

-- ------------------------------------------------------- residency gate

insert into public.system_settings (setting_key, setting_value, setting_type, description, group_name)
values
  ('academy_residency_open', 'false', 'boolean',
   'Residency door: when off, the Enroll page shows the residency notice instead of the application form and academy_apply_residency refuses. Turn on when an intake can be hosted.', 'academy'),
  ('academy_residency_notice', 'Residency intakes open when the new Lordsway facility is ready in 2027. Applications are not being accepted yet. Employer-sponsored and self-enrolled learners continue as usual.', 'string',
   'The sentence learners see on the Residency door while it is closed.', 'academy')
on conflict (setting_key) do nothing;

create or replace function public.academy_doors_status()
returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'residency_open', lower(public.academy_setting_text('academy_residency_open', 'false')) = 'true',
    'residency_notice', public.academy_setting_text('academy_residency_notice',
      'Residency intakes are not open yet. Applications are not being accepted.'));
$$;

create or replace function public.academy_apply_residency(
    p_app_slug   text,
    p_motivation text)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_id  uuid;
begin
  if v_uid is null then
    raise exception 'authentication required';
  end if;
  if lower(public.academy_setting_text('academy_residency_open', 'false')) <> 'true' then
    raise exception 'residency closed: %', public.academy_setting_text('academy_residency_notice',
      'Residency intakes are not open yet. Applications are not being accepted.');
  end if;
  if not exists (select 1 from public.academy_apps
                  where slug = p_app_slug and status = 'available') then
    raise exception 'course % is not open for enrollment', p_app_slug;
  end if;
  if length(trim(coalesce(p_motivation, ''))) < 30 then
    raise exception 'please provide a short motivation (at least 30 characters)';
  end if;
  if exists (select 1 from public.academy_residency_applications
              where user_id = v_uid and app_slug = p_app_slug
                and status = 'pending') then
    raise exception 'you already have a pending residency application for %', p_app_slug;
  end if;
  if exists (select 1 from public.academy_enrollments
              where user_id = v_uid and app_slug = p_app_slug
                and status in ('pending', 'active')) then
    raise exception 'you already have an enrollment for %', p_app_slug;
  end if;

  insert into public.academy_residency_applications (user_id, app_slug, motivation)
  values (v_uid, p_app_slug, trim(p_motivation))
  returning id into v_id;

  return jsonb_build_object('application_id', v_id, 'status', 'pending');
end $$;

revoke all on function public.academy_doors_status() from public;
grant execute on function public.academy_doors_status() to anon, authenticated;

-- --------------------------------------------------- course-scope seats

alter table public.academy_sponsor_pools
  add column if not exists seat_scope text not null default 'tier'
  check (seat_scope in ('tier', 'course'));
comment on column public.academy_sponsor_pools.seat_scope is
  'tier: one seat = one course tier (default). course: one seat = one course through all three tiers; the ladder tiers of a course the learner already holds a live assignment for in this pool consume no further seat.';

drop function if exists public.academy_admin_create_pool(uuid, text, integer, timestamptz, bigint, text, text[], text[], text, text);

create or replace function public.academy_admin_create_pool(
    p_sponsor_id  uuid,
    p_name        text,
    p_seats       integer,
    p_valid_until timestamptz,
    p_price_minor bigint  default null,
    p_currency    text    default 'NGN',
    p_app_slugs   text[]  default '{}',
    p_tiers       text[]  default '{}',
    p_payment_ref text    default null,
    p_notes       text    default null,
    p_seat_scope  text    default 'tier')
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_row  public.academy_sponsor_pools;
  v_slug text;
  v_tier text;
begin
  if not public.academy_is_admin() then
    raise exception 'insufficient privileges';
  end if;
  if not exists (select 1 from public.academy_sponsors where id = p_sponsor_id) then
    raise exception 'unknown sponsor';
  end if;
  if nullif(trim(coalesce(p_name, '')), '') is null then
    raise exception 'a pool needs a name';
  end if;
  if p_seats is null or p_seats < 1 then
    raise exception 'a pool needs at least one seat';
  end if;
  if p_valid_until is null or p_valid_until <= now() then
    raise exception 'the pool must be valid until a date in the future';
  end if;
  if coalesce(p_seat_scope, 'tier') not in ('tier', 'course') then
    raise exception 'seat scope must be tier or course';
  end if;
  foreach v_slug in array coalesce(p_app_slugs, '{}') loop
    if not exists (select 1 from public.academy_apps where slug = v_slug) then
      raise exception 'unknown course %', v_slug;
    end if;
  end loop;
  foreach v_tier in array coalesce(p_tiers, '{}') loop
    if v_tier not in ('beginner', 'intermediate', 'advanced') then
      raise exception 'unknown course tier %', v_tier;
    end if;
  end loop;
  insert into public.academy_sponsor_pools
      (sponsor_id, name, seats, price_minor, currency, payment_ref, app_slugs, tiers, valid_until, notes, created_by, seat_scope)
  values (p_sponsor_id, trim(p_name), p_seats, p_price_minor, coalesce(nullif(upper(trim(p_currency)), ''), 'NGN'),
          nullif(trim(coalesce(p_payment_ref, '')), ''), coalesce(p_app_slugs, '{}'), coalesce(p_tiers, '{}'),
          p_valid_until, p_notes, auth.uid(), coalesce(p_seat_scope, 'tier'))
  returning * into v_row;
  return to_jsonb(v_row);
end $$;

revoke all on function public.academy_admin_create_pool(uuid, text, integer, timestamptz, bigint, text, text[], text[], text, text, text) from public, anon;
grant execute on function public.academy_admin_create_pool(uuid, text, integer, timestamptz, bigint, text, text[], text[], text, text, text) to authenticated;

create or replace function public.academy_sponsor_assign(
    p_pool_id  uuid,
    p_email    text,
    p_app_slug text,
    p_tier     text default 'beginner',
    p_note     text default null)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_pool   public.academy_sponsor_pools;
  v_app    public.academy_apps;
  v_bonus  boolean;
  v_ladder boolean := false;
  v_user   uuid;
  v_name   text;
  v_open   public.academy_enrollments;
  v_enr    public.academy_enrollments;
  v_asg    public.academy_sponsor_assignments;
  v_free   boolean;
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

  -- Bonus tier (2026-09-08): never a seat.
  v_bonus := p_tier = any (coalesce(v_app.bonus_tiers, '{}'::text[]));
  -- Course-scope pool: the learner's later tiers of a course they already
  -- hold a live seat for in this pool ride on that seat.
  if not v_bonus and v_pool.seat_scope = 'course' then
    v_ladder := exists (select 1 from public.academy_sponsor_assignments a
                         where a.pool_id = v_pool.id and a.user_id = v_user
                           and a.app_slug = p_app_slug and a.status = 'active'
                           and a.seat_consumed);
  end if;
  v_free := v_bonus or v_ladder;
  if not v_free and v_pool.seats_used >= v_pool.seats then
    raise exception 'no seats left in this pool (% of % used)', v_pool.seats_used, v_pool.seats;
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
          case when v_bonus then 'sponsor-pool-bonus:' when v_ladder then 'sponsor-pool-ladder:' else 'sponsor-pool:' end || v_pool.id::text,
          'active')
  returning * into v_enr;

  insert into public.academy_sponsor_assignments
      (pool_id, sponsor_id, user_id, app_slug, course_tier, enrollment_id, note, assigned_by, seat_consumed)
  values (v_pool.id, v_pool.sponsor_id, v_user, p_app_slug, p_tier, v_enr.id, p_note, auth.uid(), not v_free)
  returning * into v_asg;

  if not v_free then
    update public.academy_sponsor_pools
       set seats_used = seats_used + 1, updated_at = now()
     where id = v_pool.id;
  end if;

  return jsonb_build_object(
    'assignment_id', v_asg.id, 'enrollment_id', v_enr.id, 'user_id', v_user,
    'display_name', v_name, 'app_slug', p_app_slug, 'course_tier', p_tier,
    'seat_consumed', not v_free,
    'seat_reason', case when v_bonus then 'bonus_tier' when v_ladder then 'course_seat' else null end,
    'seats_used', v_pool.seats_used + case when v_free then 0 else 1 end, 'seats', v_pool.seats);
end $$;
