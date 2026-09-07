-- ============================================================================
-- Sponsor pools (Breeze Energy onboarding, 2026-09-07).
--
-- An employer buys a BLOCK of enrolments once (Starter 20 / Standard 50 /
-- Programme 100), and its own training or technical lead assigns them as
-- development plans require, reassigns them when roles change, and applies
-- them to new joiners, with no Petrolord admin in the loop and nothing to
-- renegotiate. One budget line, set once, covering the year.
--
-- Design (doctrine-conformant, RLS-only, definer functions are the only
-- write path):
--   * academy_sponsors           the employer (a commercial record).
--   * academy_sponsor_leads      which learner accounts may run a sponsor's
--                                pools. A MEMBERSHIP, not a profiles.role:
--                                doors and duties are attributes, the base
--                                identity stays 'learner' (N3.2 doctrine).
--   * academy_sponsor_pools      the block: seats, price paid, validity,
--                                optional course and tier allow-lists.
--   * academy_sponsor_assignments a seat given to a named learner for one
--                                course tier; it creates the sponsored
--                                enrolment the existing spine already
--                                understands (door 'sponsored', active at
--                                once, Learning entitlement by trigger).
--   * Cancelling an assignment cancels the enrolment (the status trigger
--                                expires the entitlement) and returns the
--                                seat to the pool UNLESS the learner has
--                                already earned the certification for that
--                                tier: a finished course is consumed.
--   * The prerequisite and tier-progression triggers stay fully in force:
--                                a lead cannot assign Expert to someone who
--                                has not earned Professional; the refusal
--                                is reported, not forced.
--   * Self-enrolment coexists: the one-open-enrolment rule is per learner,
--                                app and tier, so a young professional keeps
--                                the liberty to buy extra courses.
-- ============================================================================

-- ------------------------------------------------------------------ tables

create table if not exists public.academy_sponsors (
    id            uuid primary key default gen_random_uuid(),
    name          text not null unique,
    contact_name  text,
    contact_email text,
    notes         text,
    created_by    uuid references auth.users (id),
    created_at    timestamptz not null default now()
);
comment on table public.academy_sponsors is
    'Employers that sponsor learners through enrolment pools (2026-09-07). Commercial record: read by the sponsor''s leads and admins, written only by admin definer functions.';

create table if not exists public.academy_sponsor_leads (
    sponsor_id uuid not null references public.academy_sponsors (id) on delete cascade,
    user_id    uuid not null references auth.users (id) on delete cascade,
    added_by   uuid references auth.users (id),
    created_at timestamptz not null default now(),
    primary key (sponsor_id, user_id)
);
comment on table public.academy_sponsor_leads is
    'Learner accounts allowed to assign, reassign and report on a sponsor''s pools. A membership, never a profiles.role.';

create table if not exists public.academy_sponsor_pools (
    id           uuid primary key default gen_random_uuid(),
    sponsor_id   uuid not null references public.academy_sponsors (id) on delete cascade,
    name         text not null,
    seats        integer not null check (seats > 0),
    seats_used   integer not null default 0 check (seats_used >= 0),
    price_minor  bigint,
    currency     text not null default 'NGN',
    payment_ref  text,
    app_slugs    text[] not null default '{}',     -- empty = any available course
    tiers        text[] not null default '{}',     -- empty = any tier
    valid_from   timestamptz not null default now(),
    valid_until  timestamptz not null,
    status       text not null default 'active' check (status in ('active', 'closed')),
    notes        text,
    created_by   uuid references auth.users (id),
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now(),
    constraint academy_sponsor_pools_seats_ck check (seats_used <= seats),
    constraint academy_sponsor_pools_validity_ck check (valid_until > valid_from)
);
comment on table public.academy_sponsor_pools is
    'A block of enrolments bought once by a sponsor: seats, price paid, validity window, course and tier allow-lists. seats_used is maintained by the assign and cancel functions only.';
create index if not exists academy_sponsor_pools_sponsor_idx on public.academy_sponsor_pools (sponsor_id);

create table if not exists public.academy_sponsor_assignments (
    id            uuid primary key default gen_random_uuid(),
    pool_id       uuid not null references public.academy_sponsor_pools (id) on delete cascade,
    sponsor_id    uuid not null references public.academy_sponsors (id) on delete cascade,
    user_id       uuid not null references auth.users (id) on delete cascade,
    app_slug      text not null,
    course_tier   text not null check (course_tier in ('beginner', 'intermediate', 'advanced')),
    enrollment_id uuid references public.academy_enrollments (id) on delete set null,
    status        text not null default 'active' check (status in ('active', 'cancelled')),
    seat_returned boolean not null default false,
    note          text,
    assigned_by   uuid references auth.users (id),
    assigned_at   timestamptz not null default now(),
    cancelled_by  uuid references auth.users (id),
    cancelled_at  timestamptz,
    cancel_reason text
);
comment on table public.academy_sponsor_assignments is
    'One seat of a pool given to a named learner for one course tier. Creates the sponsored enrolment; cancelling returns the seat unless the certification was already earned.';
create index if not exists academy_sponsor_assignments_pool_idx on public.academy_sponsor_assignments (pool_id, status);
create index if not exists academy_sponsor_assignments_user_idx on public.academy_sponsor_assignments (user_id);

alter table public.academy_enrollments
    add column if not exists pool_id uuid references public.academy_sponsor_pools (id) on delete set null;
comment on column public.academy_enrollments.pool_id is
    'Set when the enrolment was assigned from a sponsor pool (door sponsored, code_id null).';

-- --------------------------------------------------------------- helpers

create or replace function public.academy_is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles
                  where id = auth.uid() and role in ('admin', 'super_admin'));
$$;

create or replace function public.academy_is_sponsor_lead(p_sponsor_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.academy_sponsor_leads
                  where sponsor_id = p_sponsor_id and user_id = auth.uid());
$$;

create or replace function public.academy_sponsor_can_manage(p_sponsor_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.academy_is_admin() or public.academy_is_sponsor_lead(p_sponsor_id);
$$;

revoke all on function public.academy_is_admin() from public, anon;
revoke all on function public.academy_is_sponsor_lead(uuid) from public, anon;
revoke all on function public.academy_sponsor_can_manage(uuid) from public, anon;
grant execute on function public.academy_is_admin() to authenticated;
grant execute on function public.academy_is_sponsor_lead(uuid) to authenticated;
grant execute on function public.academy_sponsor_can_manage(uuid) to authenticated;

-- ------------------------------------------------------------------- RLS

alter table public.academy_sponsors            enable row level security;
alter table public.academy_sponsor_leads       enable row level security;
alter table public.academy_sponsor_pools       enable row level security;
alter table public.academy_sponsor_assignments enable row level security;

-- Read: a sponsor's leads and Petrolord admins. Learners also see the
-- assignments made for them. No client writes anywhere (deny by default).
drop policy if exists "academy_sponsors_select_manage" on public.academy_sponsors;
create policy "academy_sponsors_select_manage"
    on public.academy_sponsors for select
    using (public.academy_sponsor_can_manage(id));

drop policy if exists "academy_sponsor_leads_select_manage" on public.academy_sponsor_leads;
create policy "academy_sponsor_leads_select_manage"
    on public.academy_sponsor_leads for select
    using (public.academy_sponsor_can_manage(sponsor_id));

drop policy if exists "academy_sponsor_pools_select_manage" on public.academy_sponsor_pools;
create policy "academy_sponsor_pools_select_manage"
    on public.academy_sponsor_pools for select
    using (public.academy_sponsor_can_manage(sponsor_id));

drop policy if exists "academy_sponsor_assignments_select" on public.academy_sponsor_assignments;
create policy "academy_sponsor_assignments_select"
    on public.academy_sponsor_assignments for select
    using (public.academy_sponsor_can_manage(sponsor_id) or user_id = auth.uid());

-- ---------------------------------------------------- admin: sponsor setup

create or replace function public.academy_admin_upsert_sponsor(
    p_name          text,
    p_contact_name  text default null,
    p_contact_email text default null,
    p_notes         text default null)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_row public.academy_sponsors;
begin
  if not public.academy_is_admin() then
    raise exception 'insufficient privileges';
  end if;
  if nullif(trim(coalesce(p_name, '')), '') is null then
    raise exception 'a sponsor needs a name';
  end if;
  insert into public.academy_sponsors (name, contact_name, contact_email, notes, created_by)
  values (trim(p_name), nullif(trim(coalesce(p_contact_name, '')), ''),
          nullif(lower(trim(coalesce(p_contact_email, ''))), ''), p_notes, auth.uid())
  on conflict (name) do update
     set contact_name  = coalesce(excluded.contact_name, academy_sponsors.contact_name),
         contact_email = coalesce(excluded.contact_email, academy_sponsors.contact_email),
         notes         = coalesce(excluded.notes, academy_sponsors.notes)
  returning * into v_row;
  return to_jsonb(v_row);
end $$;

create or replace function public.academy_admin_add_sponsor_lead(
    p_sponsor_id uuid,
    p_email      text)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_user uuid;
  v_name text;
begin
  if not public.academy_is_admin() then
    raise exception 'insufficient privileges';
  end if;
  if not exists (select 1 from public.academy_sponsors where id = p_sponsor_id) then
    raise exception 'unknown sponsor';
  end if;
  select id, display_name into v_user, v_name from public.profiles
   where lower(email) = lower(trim(coalesce(p_email, '')))
   limit 1;
  if v_user is null then
    raise exception 'no NextGen account for %: ask them to register first', p_email;
  end if;
  insert into public.academy_sponsor_leads (sponsor_id, user_id, added_by)
  values (p_sponsor_id, v_user, auth.uid())
  on conflict do nothing;
  return jsonb_build_object('sponsor_id', p_sponsor_id, 'user_id', v_user, 'display_name', v_name, 'email', lower(trim(p_email)));
end $$;

create or replace function public.academy_admin_remove_sponsor_lead(
    p_sponsor_id uuid,
    p_user_id    uuid)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_n int;
begin
  if not public.academy_is_admin() then
    raise exception 'insufficient privileges';
  end if;
  delete from public.academy_sponsor_leads where sponsor_id = p_sponsor_id and user_id = p_user_id;
  get diagnostics v_n = row_count;
  return jsonb_build_object('removed', v_n);
end $$;

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
    p_notes       text    default null)
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
      (sponsor_id, name, seats, price_minor, currency, payment_ref, app_slugs, tiers, valid_until, notes, created_by)
  values (p_sponsor_id, trim(p_name), p_seats, p_price_minor, coalesce(nullif(upper(trim(p_currency)), ''), 'NGN'),
          nullif(trim(coalesce(p_payment_ref, '')), ''), coalesce(p_app_slugs, '{}'), coalesce(p_tiers, '{}'),
          p_valid_until, p_notes, auth.uid())
  returning * into v_row;
  return to_jsonb(v_row);
end $$;

create or replace function public.academy_admin_close_pool(p_pool_id uuid)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_row public.academy_sponsor_pools;
begin
  if not public.academy_is_admin() then
    raise exception 'insufficient privileges';
  end if;
  update public.academy_sponsor_pools
     set status = 'closed', updated_at = now()
   where id = p_pool_id
  returning * into v_row;
  if v_row.id is null then
    raise exception 'unknown pool';
  end if;
  return to_jsonb(v_row);
end $$;

-- ------------------------------------------------- lead: assign and cancel

create or replace function public.academy_sponsor_assign(
    p_pool_id  uuid,
    p_email    text,
    p_app_slug text,
    p_tier     text default 'beginner',
    p_note     text default null)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_pool public.academy_sponsor_pools;
  v_user uuid;
  v_name text;
  v_open public.academy_enrollments;
  v_enr  public.academy_enrollments;
  v_asg  public.academy_sponsor_assignments;
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
  if v_pool.seats_used >= v_pool.seats then
    raise exception 'no seats left in this pool (% of % used)', v_pool.seats_used, v_pool.seats;
  end if;
  if p_tier not in ('beginner', 'intermediate', 'advanced') then
    raise exception 'unknown course tier %', p_tier;
  end if;
  if not exists (select 1 from public.academy_apps where slug = p_app_slug and status = 'available') then
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

  select * into v_open from public.academy_enrollments
   where user_id = v_user and app_slug = p_app_slug and course_tier = p_tier
     and status in ('pending', 'active')
   limit 1;
  if v_open.id is not null then
    raise exception '% already has an open enrollment for % (%) via the % door', coalesce(v_name, p_email), p_app_slug, p_tier, v_open.door;
  end if;

  -- The sponsored enrolment. The prerequisite and tier-progression triggers
  -- run here and refuse a tier the learner has not earned; their message
  -- surfaces to the lead unchanged.
  insert into public.academy_enrollments
      (user_id, app_slug, course_tier, door, code_id, pool_id, payment_ref, status)
  values (v_user, p_app_slug, p_tier, 'sponsored', null, v_pool.id, 'sponsor-pool:' || v_pool.id::text, 'active')
  returning * into v_enr;

  insert into public.academy_sponsor_assignments
      (pool_id, sponsor_id, user_id, app_slug, course_tier, enrollment_id, note, assigned_by)
  values (v_pool.id, v_pool.sponsor_id, v_user, p_app_slug, p_tier, v_enr.id, p_note, auth.uid())
  returning * into v_asg;

  update public.academy_sponsor_pools
     set seats_used = seats_used + 1, updated_at = now()
   where id = v_pool.id;

  return jsonb_build_object(
    'assignment_id', v_asg.id, 'enrollment_id', v_enr.id, 'user_id', v_user,
    'display_name', v_name, 'app_slug', p_app_slug, 'course_tier', p_tier,
    'seats_used', v_pool.seats_used + 1, 'seats', v_pool.seats);
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

  -- A finished course is consumed: the seat comes back only when the
  -- learner has not earned the certification for this tier.
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
       where id = v_enr.id;   -- the status trigger expires the Learning entitlement
    end if;
  end if;

  if not v_cert then
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
                            'certified', v_cert);
end $$;

-- ------------------------------------------------------------ lead: views

-- The caller's sponsors with their pools and seat counts (admins: all).
create or replace function public.academy_my_sponsor_pools()
returns jsonb
language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object(
           'sponsor', to_jsonb(s),
           'is_admin', public.academy_is_admin(),
           'leads', (select coalesce(jsonb_agg(jsonb_build_object('user_id', l.user_id, 'display_name', p.display_name, 'email', p.email, 'created_at', l.created_at) order by l.created_at), '[]'::jsonb)
                       from public.academy_sponsor_leads l left join public.profiles p on p.id = l.user_id
                      where l.sponsor_id = s.id),
           'pools', (select coalesce(jsonb_agg(to_jsonb(pl) order by pl.created_at desc), '[]'::jsonb)
                       from public.academy_sponsor_pools pl where pl.sponsor_id = s.id)
         ) order by s.name), '[]'::jsonb)
    from public.academy_sponsors s
   where public.academy_sponsor_can_manage(s.id);
$$;

-- Every assignment of a pool with the learner, the enrolment state and
-- whether the certification for that tier has been earned.
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
             'status', a.status, 'seat_returned', a.seat_returned, 'note', a.note,
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

revoke all on function public.academy_admin_upsert_sponsor(text, text, text, text) from public, anon;
revoke all on function public.academy_admin_add_sponsor_lead(uuid, text) from public, anon;
revoke all on function public.academy_admin_remove_sponsor_lead(uuid, uuid) from public, anon;
revoke all on function public.academy_admin_create_pool(uuid, text, integer, timestamptz, bigint, text, text[], text[], text, text) from public, anon;
revoke all on function public.academy_admin_close_pool(uuid) from public, anon;
revoke all on function public.academy_sponsor_assign(uuid, text, text, text, text) from public, anon;
revoke all on function public.academy_sponsor_cancel(uuid, text) from public, anon;
revoke all on function public.academy_my_sponsor_pools() from public, anon;
revoke all on function public.academy_sponsor_pool_report(uuid) from public, anon;
grant execute on function public.academy_admin_upsert_sponsor(text, text, text, text) to authenticated;
grant execute on function public.academy_admin_add_sponsor_lead(uuid, text) to authenticated;
grant execute on function public.academy_admin_remove_sponsor_lead(uuid, uuid) to authenticated;
grant execute on function public.academy_admin_create_pool(uuid, text, integer, timestamptz, bigint, text, text[], text[], text, text) to authenticated;
grant execute on function public.academy_admin_close_pool(uuid) to authenticated;
grant execute on function public.academy_sponsor_assign(uuid, text, text, text, text) to authenticated;
grant execute on function public.academy_sponsor_cancel(uuid, text) to authenticated;
grant execute on function public.academy_my_sponsor_pools() to authenticated;
grant execute on function public.academy_sponsor_pool_report(uuid) to authenticated;
