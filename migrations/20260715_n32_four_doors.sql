-- N3.2 — One identity, four doors
-- (petrolord-suite docs/scope/NextGen-Academy-PLAN.md §3, approved as
-- drafted 2026-07-15. Doctrine §1: four entry paths — self / campus /
-- residency / sponsored — on ONE account and enrollment spine; the
-- primary identity is a PERSONAL email; the university email is a
-- verification attribute on Campus learners; only the payer differs.)
--
-- Ships:
--   * academy_apps       — the enrollable app catalog (one app = one course)
--   * academy_fees       — published fees, server-side amount source of
--                          truth (client NEVER sends an amount)
--   * academy_payments   — Paystack payment records (course fee /
--                          registration fee), activation is service-role only
--   * academy_residency_applications — door 3's intake queue
--   * SECURITY DEFINER door functions (codes stay client-invisible):
--       academy_start_self_enrollment / academy_redeem_code /
--       academy_apply_residency / academy_decide_residency /
--       academy_issue_code / academy_apply_successful_payment
--   * Role model rework: 'learner' is the base identity (doctrine:
--     campus/residency/sponsored are enrollment attributes, NOT roles);
--     handle_new_user hardened (privileged roles only from
--     raw_app_meta_data — was a live escalation hole: any anon caller
--     could sign up with role=super_admin in user metadata);
--     profiles role-change guard trigger (second live hole: the
--     update-own-profile RLS policy let a user set their own role).
--
-- Commercial-records discipline: learners SELECT their own rows only;
-- ZERO client write policies — every write path is a definer function
-- or service role. Enforcement server-side through RLS, never client-only.

-- ------------------------------------------------------------ app catalog

create table if not exists public.academy_apps (
    slug        text primary key,
    name        text not null,
    module      text not null,
    path_order  integer not null,          -- learning-path (daily-loop) order
    status      text not null default 'coming_soon'
                check (status in ('available', 'coming_soon')),
    created_at  timestamptz not null default now()
);
comment on table public.academy_apps is
    'Enrollable app catalog (doctrine: the catalog is the app catalog; one app = one course, three tiers each). path_order = the module daily-loop learning-path sequence.';

insert into public.academy_apps (slug, name, module, path_order, status) values
  ('welldata',        'Well Data Manager',   'geoscience', 1, 'coming_soon'),
  ('petrophysics',    'Petrophysics',        'geoscience', 2, 'available'),
  ('wellcorrelation', 'Well Correlation',    'geoscience', 3, 'coming_soon'),
  ('seismolord',      'Seismolord',          'geoscience', 4, 'coming_soon'),
  ('mapping',         'Mapping',             'geoscience', 5, 'coming_soon'),
  ('reservoircalc',   'ReservoirCalc Pro',   'geoscience', 6, 'coming_soon')
on conflict (slug) do nothing;

-- ---------------------------------------------------------------- fees

-- Published fees in MINOR units (kobo). PLACEHOLDER amounts — fee
-- levels are an owner/commercial decision (plan §5); the spine only
-- needs the shape. '*' = default for all apps; app-specific row wins.
create table if not exists public.academy_fees (
    app_slug    text not null,             -- '*' = any app
    course_tier text not null,             -- beginner/intermediate/advanced, '*' for registration
    kind        text not null check (kind in ('course', 'registration')),
    amount_minor integer not null check (amount_minor >= 0),
    currency    text not null default 'NGN',
    active      boolean not null default true,
    primary key (app_slug, course_tier, kind)
);
comment on table public.academy_fees is
    'Published fees (minor units / kobo). Server-side amount source of truth for Paystack — the client never sends an amount. Seeded amounts are PLACEHOLDERS; owner tunes.';

insert into public.academy_fees (app_slug, course_tier, kind, amount_minor, currency) values
  ('*', 'beginner',     'course',       10000000, 'NGN'),   -- ₦100,000 PLACEHOLDER
  ('*', 'intermediate', 'course',       15000000, 'NGN'),   -- ₦150,000 PLACEHOLDER
  ('*', 'advanced',     'course',       20000000, 'NGN'),   -- ₦200,000 PLACEHOLDER
  ('*', '*',            'registration',  1000000, 'NGN')    -- ₦10,000  PLACEHOLDER (Campus personal registration fee)
on conflict (app_slug, course_tier, kind) do nothing;

-- -------------------------------------------------------------- payments

create table if not exists public.academy_payments (
    id            uuid primary key default gen_random_uuid(),
    user_id       uuid not null references auth.users (id) on delete cascade,
    enrollment_id uuid references public.academy_enrollments (id) on delete set null,
    purpose       text not null check (purpose in ('course_fee', 'registration_fee')),
    reference     text not null unique,    -- Paystack reference (ACAD-…)
    amount_minor  integer not null check (amount_minor > 0),
    currency      text not null default 'NGN',
    status        text not null default 'pending'
                  check (status in ('pending', 'success', 'failed')),
    paystack_status  text,                 -- provider-reported status / mismatch marker
    authorization_url text,                -- cached hosted-checkout link (idempotent re-init)
    paid_at       timestamptz,
    raw           jsonb,                   -- provider verify payload snapshot
    created_at    timestamptz not null default now(),
    updated_at    timestamptz not null default now()
);
comment on table public.academy_payments is
    'Paystack payments for the self door (course fee) and the campus door (personal registration fee). Success is decided ONLY by the server-side Paystack verify + academy_apply_successful_payment (service role); amount AND currency are checked against this row.';
create index if not exists academy_payments_user_idx
    on public.academy_payments (user_id);
create index if not exists academy_payments_enrollment_idx
    on public.academy_payments (enrollment_id);

-- --------------------------------------------------- residency applications

create table if not exists public.academy_residency_applications (
    id            uuid primary key default gen_random_uuid(),
    user_id       uuid not null references auth.users (id) on delete cascade,
    app_slug      text not null references public.academy_apps (slug),
    motivation    text not null,
    status        text not null default 'pending'
                  check (status in ('pending', 'accepted', 'rejected')),
    decided_by    uuid references auth.users (id),
    decided_at    timestamptz,
    decision_note text,
    created_at    timestamptz not null default now()
);
comment on table public.academy_residency_applications is
    'Residency door intake: application → selection creates the enrollment. Insert via academy_apply_residency(); decisions via academy_decide_residency() (admin/super_admin).';
create index if not exists academy_residency_user_idx
    on public.academy_residency_applications (user_id);

-- -------------------------------------------- one open enrollment per course

-- Guard: a learner holds at most ONE open (pending/active) enrollment
-- per app+tier, whatever the door. (Spine tables are empty pre-N3.2 —
-- verified 2026-07-15 — so this index creates clean.)
create unique index if not exists academy_enrollments_one_open_uq
    on public.academy_enrollments (user_id, app_slug, course_tier)
    where status in ('pending', 'active');

-- ------------------------------------------------- identity: role model

-- University email = verification attribute on Campus learners
-- (doctrine: personal email is the account). Verification flow is N3.3;
-- the attribute is captured at cohort redemption.
alter table public.profiles add column if not exists university_email text;
alter table public.profiles add column if not exists university_email_verified boolean not null default false;

-- 'learner' inherits the student permission set (role_permissions is
-- currently unread by the frontend, but keep the table coherent).
insert into public.role_permissions (role, permission, resource)
select 'learner', rp.permission, rp.resource
  from public.role_permissions rp
 where rp.role = 'student'
   and not exists (select 1 from public.role_permissions x
                    where x.role = 'learner'
                      and x.permission = rp.permission
                      and x.resource is not distinct from rp.resource);

-- HARDENED signup trigger. Previously v_role := raw_user_meta_data->>'role'
-- verbatim — user metadata is CLIENT-SETTABLE at /auth/v1/signup, so any
-- anon caller could register as super_admin. Now: privileged roles come
-- only from raw_app_meta_data (server/admin API only); user metadata may
-- claim at most the legacy unprivileged import roles; default is the
-- doctrine base identity 'learner'.
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v_role text;
  v_display_name text;
  v_phase integer;
begin
  v_role := new.raw_app_meta_data->>'role';               -- server-set only
  if v_role is null then
    if new.raw_user_meta_data->>'role' in ('student', 'lecturer') then
      v_role := new.raw_user_meta_data->>'role';          -- legacy admin import
    else
      v_role := 'learner';                                -- base identity
    end if;
  end if;

  v_display_name := coalesce(new.raw_user_meta_data->>'display_name',
                             split_part(new.email, '@', 1));
  begin
    v_phase := (new.raw_user_meta_data->>'phase')::integer;
  exception when others then
    v_phase := 1;
  end;
  v_phase := coalesce(v_phase, 1);

  insert into public.profiles
      (id, email, display_name, role, phase, created_at, status, updated_at)
  values
      (new.id, new.email, v_display_name, v_role, v_phase,
       coalesce(new.created_at, now()), 'active', now())
  on conflict (id) do update set
      email = excluded.email,
      role = v_role,
      status = 'active',
      updated_at = now();

  return new;
exception when others then
  raise warning 'Error in handle_new_user trigger: %', sqlerrm;
  return new;
end $$;

-- Role-change guard. The "update own profile" RLS policy has no column
-- restriction, so without this a user could set their own role to
-- super_admin through PostgREST. Server-side paths (auth signup trigger,
-- service role) have auth.uid() IS NULL and pass through.
create or replace function public.profiles_role_guard()
returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v_caller text;
begin
  if auth.uid() is null then
    return new;
  end if;
  select role into v_caller from public.profiles where id = auth.uid();
  if v_caller in ('admin', 'super_admin') then
    return new;
  end if;
  if tg_op = 'INSERT' then
    if coalesce(new.role, 'learner') not in ('learner', 'user', 'student') then
      new.role := 'learner';
    end if;
  elsif new.role is distinct from old.role then
    raise exception 'changing role is not permitted';
  end if;
  return new;
end $$;

drop trigger if exists trg_profiles_role_guard on public.profiles;
create trigger trg_profiles_role_guard
  before insert or update on public.profiles
  for each row execute function public.profiles_role_guard();

-- ------------------------------------------------------------ fee lookup

-- Effective published fee (app-specific row wins over '*').
create or replace function public.academy_fee(p_app text, p_tier text, p_kind text)
returns public.academy_fees
language sql stable security definer set search_path = public as $$
  select f.* from public.academy_fees f
   where f.kind = p_kind and f.active
     and f.app_slug in (p_app, '*')
     and f.course_tier in (p_tier, '*')
   order by (f.app_slug = p_app) desc, (f.course_tier = p_tier) desc
   limit 1;
$$;

-- ------------------------------------------------------ door 1: self-enroll

-- Creates (or resumes) a pending self enrollment plus its pending
-- payment row; the academy-checkout edge function initializes Paystack
-- from the payment ROW (reference + server-side amount), never from
-- client input. Activation happens only via
-- academy_apply_successful_payment (service role).
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
    v_fee := public.academy_fee(p_app_slug, p_tier, 'course');
    if v_fee.amount_minor is null then
      raise exception 'no published fee for % (%)', p_app_slug, p_tier;
    end if;
    v_ref := 'ACAD-' || replace(gen_random_uuid()::text, '-', '');
    insert into public.academy_payments
        (user_id, enrollment_id, purpose, reference, amount_minor, currency)
    values (v_uid, v_enr.id, 'course_fee', v_ref, v_fee.amount_minor, v_fee.currency);
  end if;

  return (select jsonb_build_object(
            'enrollment_id', v_enr.id,
            'reference', p.reference,
            'amount_minor', p.amount_minor,
            'currency', p.currency,
            'status', 'pending_payment')
          from public.academy_payments p where p.reference = v_ref);
end $$;

-- ---------------------------------------- doors 2 & 4: cohort / sponsorship

-- Redeems a Campus cohort code or an employer sponsorship code.
-- Codes are never client-readable (academy_codes has zero client
-- policies); this definer function is the only redemption path.
-- Campus: the learner pays the modest personal registration fee once
-- per account — the enrollment stays pending until it clears.
-- Sponsored: the sponsor is billed off-platform; activates immediately.
create or replace function public.academy_redeem_code(
    p_code             text,
    p_app_slug         text,
    p_tier             text default 'beginner',
    p_university_email text default null)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_uid   uuid := auth.uid();
  v_code  public.academy_codes;
  v_door  text;
  v_paid_reg boolean;
  v_status text;
  v_enr   public.academy_enrollments;
  v_fee   public.academy_fees;
  v_ref   text;
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

  select * into v_code from public.academy_codes
   where upper(code) = upper(trim(p_code))
   for update;

  if v_code.id is null then
    raise exception 'invalid code';
  end if;
  if now() < v_code.valid_from
     or (v_code.valid_until is not null and now() >= v_code.valid_until) then
    raise exception 'this code is not currently valid';
  end if;
  if v_code.max_redemptions is not null
     and v_code.redeemed_count >= v_code.max_redemptions then
    raise exception 'this code has reached its redemption limit';
  end if;
  if array_length(v_code.app_slugs, 1) is not null
     and not (p_app_slug = any (v_code.app_slugs)) then
    raise exception 'this code does not cover %', p_app_slug;
  end if;

  v_door := case v_code.kind when 'cohort' then 'campus' else 'sponsored' end;

  if v_door = 'campus' then
    if nullif(trim(coalesce(p_university_email, '')), '') is null then
      raise exception 'university email is required for campus enrollment';
    end if;
    update public.profiles
       set university_email = trim(p_university_email),
           university_email_verified = case
             when university_email is distinct from trim(p_university_email)
             then false else university_email_verified end,
           updated_at = now()
     where id = v_uid;
  end if;

  if exists (select 1 from public.academy_enrollments
              where user_id = v_uid and app_slug = p_app_slug
                and course_tier = p_tier and status in ('pending', 'active')) then
    raise exception 'an enrollment for % (%) already exists', p_app_slug, p_tier;
  end if;

  v_paid_reg := exists (select 1 from public.academy_payments
                         where user_id = v_uid and purpose = 'registration_fee'
                           and status = 'success');
  v_status := case when v_door = 'sponsored' or v_paid_reg
                   then 'active' else 'pending' end;

  insert into public.academy_enrollments
      (user_id, app_slug, course_tier, door, code_id, status)
  values (v_uid, p_app_slug, p_tier, v_door, v_code.id, v_status)
  returning * into v_enr;

  update public.academy_codes
     set redeemed_count = redeemed_count + 1
   where id = v_code.id;

  if v_status = 'active' then
    return jsonb_build_object('enrollment_id', v_enr.id, 'status', 'active',
                              'door', v_door);
  end if;

  v_fee := public.academy_fee(p_app_slug, p_tier, 'registration');
  if v_fee.amount_minor is null then
    raise exception 'no published registration fee';
  end if;
  v_ref := 'ACAD-' || replace(gen_random_uuid()::text, '-', '');
  insert into public.academy_payments
      (user_id, enrollment_id, purpose, reference, amount_minor, currency)
  values (v_uid, v_enr.id, 'registration_fee', v_ref, v_fee.amount_minor, v_fee.currency);

  return jsonb_build_object('enrollment_id', v_enr.id, 'status', 'pending_payment',
                            'door', v_door, 'reference', v_ref,
                            'amount_minor', v_fee.amount_minor,
                            'currency', v_fee.currency);
end $$;

-- --------------------------------------------------------- door 3: residency

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

-- Selection creates the enrollment (admin / super_admin only).
create or replace function public.academy_decide_residency(
    p_application uuid,
    p_decision    text,
    p_note        text default null)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_caller text;
  v_app    public.academy_residency_applications;
  v_enr_id uuid;
begin
  select role into v_caller from public.profiles where id = auth.uid();
  if v_caller is null or v_caller not in ('admin', 'super_admin') then
    raise exception 'insufficient privileges';
  end if;
  if p_decision not in ('accepted', 'rejected') then
    raise exception 'decision must be accepted or rejected';
  end if;

  select * into v_app from public.academy_residency_applications
   where id = p_application for update;
  if v_app.id is null then
    raise exception 'application not found';
  end if;
  if v_app.status <> 'pending' then
    raise exception 'application already decided (%)', v_app.status;
  end if;

  update public.academy_residency_applications
     set status = p_decision, decided_by = auth.uid(),
         decided_at = now(), decision_note = p_note
   where id = p_application;

  if p_decision = 'accepted'
     and not exists (select 1 from public.academy_enrollments
                      where user_id = v_app.user_id and app_slug = v_app.app_slug
                        and course_tier = 'beginner'
                        and status in ('pending', 'active')) then
    insert into public.academy_enrollments
        (user_id, app_slug, course_tier, door, status)
    values (v_app.user_id, v_app.app_slug, 'beginner', 'residency', 'active')
    returning id into v_enr_id;
  end if;

  return jsonb_build_object('application_id', p_application,
                            'status', p_decision, 'enrollment_id', v_enr_id);
end $$;

-- ------------------------------------------------------------- code issuing

-- Liaison/employer codes are created by Petrolord admins (admin /
-- super_admin). Codes are stored uppercase; auto-generated when not given.
create or replace function public.academy_issue_code(
    p_kind            text,
    p_organization    text,
    p_issuer          text default null,
    p_app_slugs       text[] default '{}',
    p_max_redemptions integer default null,
    p_valid_until     timestamptz default null,
    p_code            text default null)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_caller text;
  v_code   text;
  v_row    public.academy_codes;
  v_slug   text;
begin
  select role into v_caller from public.profiles where id = auth.uid();
  if v_caller is null or v_caller not in ('admin', 'super_admin') then
    raise exception 'insufficient privileges';
  end if;
  if p_kind not in ('cohort', 'sponsorship') then
    raise exception 'kind must be cohort or sponsorship';
  end if;
  foreach v_slug in array coalesce(p_app_slugs, '{}') loop
    if not exists (select 1 from public.academy_apps where slug = v_slug) then
      raise exception 'unknown app slug %', v_slug;
    end if;
  end loop;

  v_code := upper(coalesce(nullif(trim(p_code), ''),
              (case p_kind when 'cohort' then 'CMP-' else 'SPN-' end)
              || substr(md5(gen_random_uuid()::text), 1, 8)));

  insert into public.academy_codes
      (kind, code, issuer, organization, app_slugs,
       max_redemptions, valid_until, created_by)
  values (p_kind, v_code, p_issuer, p_organization, coalesce(p_app_slugs, '{}'),
          p_max_redemptions, p_valid_until, auth.uid())
  returning * into v_row;

  return jsonb_build_object('id', v_row.id, 'code', v_row.code,
                            'kind', v_row.kind, 'organization', v_row.organization);
end $$;

-- ----------------------------------------------------- payment activation

-- Service-role ONLY (called by the academy-verify edge function and the
-- Paystack webhook after a server-side verify against Paystack).
-- Validates amount AND currency against the stored payment row — a
-- deliberate hardening over the Suite pattern, which skips this check.
-- Idempotent: re-running a processed reference is a no-op.
create or replace function public.academy_apply_successful_payment(
    p_reference    text,
    p_amount_minor integer,
    p_currency     text,
    p_success      boolean,
    p_raw          jsonb default null)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_pay public.academy_payments;
begin
  select * into v_pay from public.academy_payments
   where reference = p_reference for update;
  if v_pay.id is null then
    return jsonb_build_object('status', 'not_found');
  end if;
  if v_pay.status = 'success' then
    return jsonb_build_object('status', 'already_processed',
                              'enrollment_id', v_pay.enrollment_id);
  end if;

  if not p_success then
    update public.academy_payments
       set status = 'failed', paystack_status = 'failed',
           raw = coalesce(p_raw, raw), updated_at = now()
     where id = v_pay.id;
    return jsonb_build_object('status', 'failed');
  end if;

  if p_amount_minor is distinct from v_pay.amount_minor
     or upper(coalesce(p_currency, '')) <> upper(v_pay.currency) then
    update public.academy_payments
       set paystack_status = 'amount_mismatch',
           raw = coalesce(p_raw, raw), updated_at = now()
     where id = v_pay.id;
    return jsonb_build_object('status', 'amount_mismatch',
                              'expected_minor', v_pay.amount_minor,
                              'expected_currency', v_pay.currency,
                              'got_minor', p_amount_minor,
                              'got_currency', p_currency);
  end if;

  update public.academy_payments
     set status = 'success', paystack_status = 'success',
         paid_at = now(), raw = coalesce(p_raw, raw), updated_at = now()
   where id = v_pay.id;

  if v_pay.enrollment_id is not null then
    update public.academy_enrollments
       set status = 'active',
           payment_ref = p_reference,
           updated_at = now()
     where id = v_pay.enrollment_id and status = 'pending';
  end if;

  -- The registration fee is once per ACCOUNT: clearing it activates
  -- every pending campus enrollment the learner holds.
  if v_pay.purpose = 'registration_fee' then
    update public.academy_enrollments
       set status = 'active',
           payment_ref = coalesce(payment_ref, p_reference),
           updated_at = now()
     where user_id = v_pay.user_id and door = 'campus' and status = 'pending';
  end if;

  return jsonb_build_object('status', 'success',
                            'enrollment_id', v_pay.enrollment_id);
end $$;

-- ------------------------------------------------------------- privileges

-- Door functions: authenticated learners only. Payment activation:
-- service role only. Nothing is callable by anon.
revoke all on function public.academy_fee(text, text, text) from public, anon;
grant execute on function public.academy_fee(text, text, text) to authenticated, service_role;

revoke all on function public.academy_start_self_enrollment(text, text) from public, anon;
grant execute on function public.academy_start_self_enrollment(text, text) to authenticated;

revoke all on function public.academy_redeem_code(text, text, text, text) from public, anon;
grant execute on function public.academy_redeem_code(text, text, text, text) to authenticated;

revoke all on function public.academy_apply_residency(text, text) from public, anon;
grant execute on function public.academy_apply_residency(text, text) to authenticated;

revoke all on function public.academy_decide_residency(uuid, text, text) from public, anon;
grant execute on function public.academy_decide_residency(uuid, text, text) to authenticated;

revoke all on function public.academy_issue_code(text, text, text, text[], integer, timestamptz, text) from public, anon;
grant execute on function public.academy_issue_code(text, text, text, text[], integer, timestamptz, text) to authenticated;

revoke all on function public.academy_apply_successful_payment(text, integer, text, boolean, jsonb) from public, anon, authenticated;
grant execute on function public.academy_apply_successful_payment(text, integer, text, boolean, jsonb) to service_role;

-- ------------------------------------------------------------------- RLS

alter table public.academy_apps                   enable row level security;
alter table public.academy_fees                   enable row level security;
alter table public.academy_payments               enable row level security;
alter table public.academy_residency_applications enable row level security;

-- Catalog + published fees are public metadata (pricing page, enroll UI).
drop policy if exists "academy_apps_read" on public.academy_apps;
create policy "academy_apps_read"
    on public.academy_apps for select to anon, authenticated using (true);

drop policy if exists "academy_fees_read" on public.academy_fees;
create policy "academy_fees_read"
    on public.academy_fees for select to anon, authenticated using (true);

-- Payments: learner reads own; admins read all; zero client writes.
drop policy if exists "academy_payments_select_own" on public.academy_payments;
create policy "academy_payments_select_own"
    on public.academy_payments for select using (auth.uid() = user_id);
drop policy if exists "academy_payments_select_admin" on public.academy_payments;
create policy "academy_payments_select_admin"
    on public.academy_payments for select
    using (public.get_user_role() in ('admin', 'super_admin'));

-- Residency: applicant reads own; admins read all; writes only via fns.
drop policy if exists "academy_residency_select_own" on public.academy_residency_applications;
create policy "academy_residency_select_own"
    on public.academy_residency_applications for select using (auth.uid() = user_id);
drop policy if exists "academy_residency_select_admin" on public.academy_residency_applications;
create policy "academy_residency_select_admin"
    on public.academy_residency_applications for select
    using (public.get_user_role() in ('admin', 'super_admin'));

-- Codes: admins may LIST (issue/monitor UI); learners still have zero
-- access — redemption goes through the definer function only.
drop policy if exists "academy_codes_select_admin" on public.academy_codes;
create policy "academy_codes_select_admin"
    on public.academy_codes for select
    using (public.get_user_role() in ('admin', 'super_admin'));
