-- N3.1 — Academy entitlement + certification spine
-- (petrolord-suite docs/scope/NextGen-Academy-PLAN.md, approved as
-- drafted 2026-07-15; owner doctrine §1: the spine is built FIRST,
-- before any app is ported).
--
-- Commercial records (enrollments / certifications / entitlements):
-- RLS deny-by-default for writes — learners can only SELECT their own
-- rows; every write path is service-role or a SECURITY DEFINER
-- function added by later phases (doors at N3.2, overrides UI later).
-- Enforcement is server-side through RLS, never client-only.
--
-- Locked decisions baked in:
--   Q1: certification validity = 12 months from issue (renewable by
--       re-certification or subscription — the spine stores validity
--       either way).
--   Unlock ladder: enrollment→learning, associate→working,
--       professional→advanced, expert→full.
--   Doors: self / campus / residency / sponsored — enrollment
--       attributes, not roles.

-- ---------------------------------------------------------------- codes

create table if not exists public.academy_codes (
    id              uuid primary key default gen_random_uuid(),
    kind            text not null check (kind in ('cohort', 'sponsorship')),
    code            text not null unique,
    issuer          text,                      -- liaison / employer name
    organization    text,                      -- university / company
    app_slugs       text[] not null default '{}',  -- empty = any course
    max_redemptions integer,
    redeemed_count  integer not null default 0,
    valid_from      timestamptz not null default now(),
    valid_until     timestamptz,
    created_by      uuid references auth.users (id),
    created_at      timestamptz not null default now()
);
comment on table public.academy_codes is
    'Cohort (Campus) and sponsorship (employer) entry codes — commercial records. No learner read access; redemption happens through a SECURITY DEFINER door function (N3.2).';

-- ----------------------------------------------------------- enrollments

create table if not exists public.academy_enrollments (
    id           uuid primary key default gen_random_uuid(),
    user_id      uuid not null references auth.users (id) on delete cascade,
    course_id    uuid references public.courses (id) on delete set null,
    app_slug     text not null,
    course_tier  text not null default 'beginner'
                 check (course_tier in ('beginner', 'intermediate', 'advanced')),
    door         text not null
                 check (door in ('self', 'campus', 'residency', 'sponsored')),
    code_id      uuid references public.academy_codes (id),
    payment_ref  text,                          -- Paystack reference (self door)
    status       text not null default 'active'
                 check (status in ('pending', 'active', 'completed', 'cancelled')),
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now()
);
comment on table public.academy_enrollments is
    'One row per learner per course tier — the payer/door varies, the spine does not (doctrine: one identity, four doors). Commercial record: learner SELECT-own only.';
create index if not exists academy_enrollments_user_idx
    on public.academy_enrollments (user_id, app_slug);

-- -------------------------------------------------------- certifications

create sequence if not exists public.academy_cert_seq;

create table if not exists public.academy_certifications (
    id                 uuid primary key default gen_random_uuid(),
    user_id            uuid not null references auth.users (id) on delete cascade,
    course_id          uuid references public.courses (id) on delete set null,
    app_slug           text not null,
    tier               text not null
                       check (tier in ('associate', 'professional', 'expert')),
    certificate_number text not null unique
                       default 'PLA-' || to_char(now(), 'YYYY') || '-'
                               || lpad(nextval('public.academy_cert_seq')::text, 6, '0'),
    verify_code        text not null unique
                       default md5(gen_random_uuid()::text || clock_timestamp()::text),
    issued_at          timestamptz not null default now(),
    valid_until        timestamptz not null
                       default now() + interval '12 months',   -- Q1 locked
    revoked_at         timestamptz,
    created_at         timestamptz not null default now()
);
comment on table public.academy_certifications is
    'Associate/Professional/Expert certifications. verify_code backs the public verification page (N3.4) via academy_verify_certificate(). Validity 12 months from issue (plan §6 Q1); renewal = re-certification or subscription.';
create index if not exists academy_certifications_user_idx
    on public.academy_certifications (user_id, app_slug);

-- ---------------------------------------------------------- entitlements

create table if not exists public.academy_entitlements (
    id          uuid primary key default gen_random_uuid(),
    user_id     uuid not null references auth.users (id) on delete cascade,
    app_slug    text not null,
    scope       text not null
                check (scope in ('learning', 'working', 'advanced', 'full')),
    granted_by  text not null
                check (granted_by in ('enrollment', 'certification',
                                      'instructor_override', 'sponsorship')),
    source_id   uuid,                    -- enrollment / certification / code id
    valid_from  timestamptz not null default now(),
    valid_until timestamptz,             -- null = follows the source (enrollment)
    note        text,                    -- required context for overrides
    created_by  uuid references auth.users (id),
    created_at  timestamptz not null default now()
);
comment on table public.academy_entitlements is
    'The unlock ladder (doctrine: scope, not switch). Effective scope = highest active row. Read by RLS on every ported app table and by frontend flags; written only by triggers/definer functions. Instructor overrides must be time-boxed (valid_until set) and carry a note.';
create index if not exists academy_entitlements_user_app_idx
    on public.academy_entitlements (user_id, app_slug);

-- --------------------------------------------------------------- quotas

create table if not exists public.academy_scope_quotas (
    app_slug text not null,              -- '*' = default for all apps
    scope    text not null
             check (scope in ('learning', 'working', 'advanced', 'full')),
    quotas   jsonb not null,
    primary key (app_slug, scope)
);
comment on table public.academy_scope_quotas is
    'Per-scope capability quotas (Suite live-computed quota pattern). App-specific row wins over the ''*'' default. Numbers are plan §6 Q5 proposals — owner tunes.';

insert into public.academy_scope_quotas (app_slug, scope, quotas) values
  ('*', 'learning', '{"own_data_upload": false, "storage_mb": 100,  "max_projects": 3,  "export_watermark": true,  "export_formats": ["png"]}'),
  ('*', 'working',  '{"own_data_upload": true,  "storage_mb": 1024, "max_projects": 10, "export_watermark": false, "export_formats": ["png", "csv"]}'),
  ('*', 'advanced', '{"own_data_upload": true,  "storage_mb": 5120, "max_projects": 25, "export_watermark": false, "export_formats": ["png", "csv", "las", "xlsx"]}'),
  ('*', 'full',     '{"own_data_upload": true,  "storage_mb": 20480,"max_projects": 100,"export_watermark": false, "export_formats": ["png", "csv", "las", "xlsx", "segy"]}')
on conflict (app_slug, scope) do nothing;

-- ------------------------------------------------------------- functions

-- Highest active scope for a user on an app (ladder order).
create or replace function public.academy_scope(p_user uuid, p_app text)
returns text
language sql stable security definer set search_path = public as $$
  select scope from public.academy_entitlements
   where user_id = p_user and app_slug = p_app
     and now() >= valid_from
     and (valid_until is null or now() < valid_until)
   order by array_position(array['learning','working','advanced','full'], scope) desc
   limit 1;
$$;

-- RLS predicate for ported app tables: does the CALLER hold at least
-- p_min scope on p_app?
create or replace function public.academy_has_scope(p_app text, p_min text)
returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(
    array_position(array['learning','working','advanced','full'],
                   public.academy_scope(auth.uid(), p_app))
    >= array_position(array['learning','working','advanced','full'], p_min),
    false);
$$;

-- Effective quotas for a user on an app (app-specific row wins).
create or replace function public.academy_quota(p_user uuid, p_app text)
returns jsonb
language sql stable security definer set search_path = public as $$
  select q.quotas from public.academy_scope_quotas q
   where q.scope = public.academy_scope(p_user, p_app)
     and q.app_slug in (p_app, '*')
   order by (q.app_slug = p_app) desc
   limit 1;
$$;

-- Public certificate verification (backs the N3.4 page; anon-safe:
-- returns only what the verification page shows).
create or replace function public.academy_verify_certificate(p_verify_code text)
returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'certificate_number', c.certificate_number,
    'holder', coalesce(p.display_name, 'Registered learner'),
    'app_slug', c.app_slug,
    'tier', c.tier,
    'issued_at', c.issued_at,
    'valid_until', c.valid_until,
    'status', case when c.revoked_at is not null then 'revoked'
                   when now() >= c.valid_until then 'expired'
                   else 'valid' end)
  from public.academy_certifications c
  left join public.profiles p on p.id = c.user_id
  where c.verify_code = p_verify_code;
$$;
revoke all on function public.academy_verify_certificate(text) from public;
grant execute on function public.academy_verify_certificate(text) to anon, authenticated;

-- -------------------------------------------------------------- triggers

-- Certification -> entitlement (the doctrine's trigger): associate ->
-- working, professional -> advanced, expert -> full; window follows
-- the certificate's validity.
create or replace function public.academy_certification_entitlement()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.academy_entitlements
      (user_id, app_slug, scope, granted_by, source_id, valid_from, valid_until)
  values (new.user_id, new.app_slug,
          case new.tier when 'associate' then 'working'
                        when 'professional' then 'advanced'
                        else 'full' end,
          'certification', new.id, new.issued_at, new.valid_until);
  return new;
end $$;
drop trigger if exists trg_academy_certification_entitlement on public.academy_certifications;
create trigger trg_academy_certification_entitlement
  after insert on public.academy_certifications
  for each row execute function public.academy_certification_entitlement();

-- Certification revocation expires its entitlement.
create or replace function public.academy_certification_revoke()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.revoked_at is not null and old.revoked_at is null then
    update public.academy_entitlements
       set valid_until = new.revoked_at
     where source_id = new.id and granted_by = 'certification'
       and (valid_until is null or valid_until > new.revoked_at);
  end if;
  return new;
end $$;
drop trigger if exists trg_academy_certification_revoke on public.academy_certifications;
create trigger trg_academy_certification_revoke
  after update on public.academy_certifications
  for each row execute function public.academy_certification_revoke();

-- Active enrollment -> Learning Mode entitlement (open-ended: it
-- follows the enrollment, expired by the status trigger below).
create or replace function public.academy_enrollment_entitlement()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'active' then
    insert into public.academy_entitlements
        (user_id, app_slug, scope, granted_by, source_id)
    values (new.user_id, new.app_slug, 'learning', 'enrollment', new.id);
  end if;
  return new;
end $$;
drop trigger if exists trg_academy_enrollment_entitlement on public.academy_enrollments;
create trigger trg_academy_enrollment_entitlement
  after insert on public.academy_enrollments
  for each row execute function public.academy_enrollment_entitlement();

-- Enrollment leaving 'active' expires its Learning entitlement;
-- re-activation grants a fresh one.
create or replace function public.academy_enrollment_status()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if old.status = 'active' and new.status <> 'active' then
    update public.academy_entitlements
       set valid_until = now()
     where source_id = new.id and granted_by = 'enrollment'
       and (valid_until is null or valid_until > now());
  elsif old.status <> 'active' and new.status = 'active' then
    insert into public.academy_entitlements
        (user_id, app_slug, scope, granted_by, source_id)
    values (new.user_id, new.app_slug, 'learning', 'enrollment', new.id);
  end if;
  return new;
end $$;
drop trigger if exists trg_academy_enrollment_status on public.academy_enrollments;
create trigger trg_academy_enrollment_status
  after update on public.academy_enrollments
  for each row execute function public.academy_enrollment_status();

-- ------------------------------------------------------------------- RLS

alter table public.academy_codes          enable row level security;
alter table public.academy_enrollments    enable row level security;
alter table public.academy_certifications enable row level security;
alter table public.academy_entitlements   enable row level security;
alter table public.academy_scope_quotas   enable row level security;

-- Learners read their own commercial records; nobody writes from the
-- client (no insert/update/delete policies exist — deny by default).
drop policy if exists "academy_enrollments_select_own" on public.academy_enrollments;
create policy "academy_enrollments_select_own"
    on public.academy_enrollments for select using (auth.uid() = user_id);

drop policy if exists "academy_certifications_select_own" on public.academy_certifications;
create policy "academy_certifications_select_own"
    on public.academy_certifications for select using (auth.uid() = user_id);

drop policy if exists "academy_entitlements_select_own" on public.academy_entitlements;
create policy "academy_entitlements_select_own"
    on public.academy_entitlements for select using (auth.uid() = user_id);

-- Quota matrix is public app metadata (the UI shows scope ladders).
drop policy if exists "academy_scope_quotas_read" on public.academy_scope_quotas;
create policy "academy_scope_quotas_read"
    on public.academy_scope_quotas for select to authenticated using (true);

-- academy_codes: NO client policies at all — liaison/admin tooling and
-- the redemption door functions (N3.2) are the only access paths.
