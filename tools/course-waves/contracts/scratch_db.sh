#!/usr/bin/env bash
# =============================================================================
# SC5 SCRATCH DATABASE. A local Postgres 16 the whole ladder (the platform
# migration, the course seed, the three deep seeds and the go-live) is iterated
# on BEFORE any rolled-back run against the linked project, so a ladder that
# cannot pass is found here and never against production (the NextGen linked
# project IS production).
#
# What it builds, from the NextGen repository's COMMITTED tree at REF:
#   * the catalogue, capstone, enrolment and certificate tables as production
#     has them before SC5 (n31 spine, n32 catalogue, published fees, prereq,
#     bonus tiers), and the verification function exactly as
#     20261105_catalog_course_titles.sql defines it;
#   * the deep-course tables and every learner function the certificate path
#     runs through (serve, grade, lesson read, module quiz, final exam), each
#     the LAST definition in the migrations (scratch_extract.py), with the
#     chassis tunables (final exam: 25 served, 70 per cent to pass);
#   * a catalogue of stand-in courses at path_order 1 to 78 with the SIX REAL
#     engine course migrations (procurement 71, pia 72, gsa 73, joa 74,
#     farmout 75, prms 76) read out of REF, so the backfill meets real rows and
#     real capstones; 77 and 78 (materials, marine) are stand-ins. Every
#     path_order 1 to 78 is asserted occupied and 79 asserted free.
# Stubbed, and said so: academy_has_scope (true for a user with an active
# enrolment in the course; the real one also checks activation and
# entitlement, which SC5 does not change), academy_course_for_app (null).
#
# Usage: scratch_db.sh [ref]    (re)creates container sc5-scratch; default HEAD
#        (remove it afterwards with: docker rm -f sc5-scratch)
# =============================================================================
set -eu
REF=${1:-HEAD}
HERE=$(cd "$(dirname "$0")" && pwd)
if up=$(cd "$HERE/../../.." 2>/dev/null && pwd) && { [ -d "$up/.git" ] || [ -f "$up/.git" ]; }; then
  REPO=${REPO:-$up}
else
  REPO=${REPO:-/root/wt-sc5-nextgen}
fi
C=${SCRATCH:-sc5-scratch}
docker rm -f $C >/dev/null 2>&1 || true
docker run -d --name $C -e POSTGRES_PASSWORD=scratch postgres:16-alpine >/dev/null
until docker exec $C pg_isready -U postgres >/dev/null 2>&1; do sleep 1; done
sleep 2
P() { docker exec -i $C psql -U postgres -v ON_ERROR_STOP=1 -q "$@"; }

P <<'SQL'
create extension if not exists pgcrypto;
do $$ begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon; end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then create role service_role; end if;
end $$;
create schema if not exists auth;
create table auth.users (id uuid primary key default gen_random_uuid(), email text);
create or replace function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
create table public.profiles (id uuid primary key references auth.users (id), display_name text, role text default 'learner');
create table public.courses (id uuid primary key default gen_random_uuid());
create table public.system_settings (
    setting_key text primary key, setting_value text, setting_type text,
    description text, group_name text);

create table public.academy_apps (
    slug        text primary key,
    name        text not null,
    module      text not null,
    path_order  integer not null,
    status      text not null default 'coming_soon'
                check (status in ('available', 'coming_soon')),
    created_at  timestamptz not null default now()
);
alter table public.academy_apps add column if not exists school text not null default 'subsurface'
  check (school in ('subsurface', 'energy_business'));
alter table public.academy_apps add column if not exists prereq_slug text references public.academy_apps (slug);
alter table public.academy_apps add column if not exists bonus_tiers text[] not null default '{}';

create table public.academy_capstones (
    app_slug text not null, tier text not null check (tier in ('beginner','intermediate','advanced')),
    cert_tier text not null check (cert_tier in ('associate','professional','expert')),
    dataset text not null, title text not null, prompt text not null, fields jsonb not null,
    active boolean not null default true, primary key (app_slug, tier));
create table public.academy_capstone_attempts (id uuid primary key default gen_random_uuid(), app_slug text not null);

create table public.academy_enrollments (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    course_id uuid references public.courses (id) on delete set null,
    app_slug text not null,
    course_tier text not null default 'beginner' check (course_tier in ('beginner', 'intermediate', 'advanced')),
    door text not null check (door in ('self', 'campus', 'residency', 'sponsored')),
    payment_ref text,
    status text not null default 'active' check (status in ('pending', 'active', 'completed', 'cancelled')),
    created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create sequence public.academy_cert_seq;
create table public.academy_certifications (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    course_id uuid references public.courses (id) on delete set null,
    app_slug text not null,
    tier text not null check (tier in ('associate', 'professional', 'expert')),
    certificate_number text not null unique default 'PLA-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.academy_cert_seq')::text, 6, '0'),
    verify_code text not null unique default md5(gen_random_uuid()::text || clock_timestamp()::text),
    issued_at timestamptz not null default now(),
    valid_until timestamptz not null default now() + interval '12 months',
    revoked_at timestamptz,
    created_at timestamptz not null default now());

create or replace function public.academy_course_for_app(p_app text) returns uuid
language sql stable as $$ select null::uuid; $$;
-- STUB (stated): the real academy_has_scope also checks activation and entitlement.
create or replace function public.academy_has_scope(p_app text, p_min text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.academy_enrollments
                  where user_id = auth.uid() and app_slug = p_app and status = 'active');
$$;
SQL

python3 "$HERE/scratch_extract.py" "$REPO" "$REF" > /tmp/sc5_extract.$$.sql || { rm -f /tmp/sc5_extract.$$.sql; echo "REFUSED: the real DDL could not be read at $REF"; exit 2; }
P < /tmp/sc5_extract.$$.sql; rm -f /tmp/sc5_extract.$$.sql

git -C "$REPO" show "$REF:migrations/20261105_catalog_course_titles.sql" \
  | sed -n '/^create or replace function public.academy_verify_certificate/,$p' | P

P <<'SQL'
insert into public.academy_apps (slug, name, module, path_order, status)
select 'neighbour' || g, 'Neighbour ' || g,
       case when g in (71, 77, 78) then 'supply_chain' else 'other' end, g, 'available'
  from generate_series(1, 78) g where g not between 71 and 76;
SQL
n=0
for f in $(git -C "$REPO" ls-tree --name-only "$REF" migrations/ \
           | grep -E '_(sc2_procurement|ec7_pia|ec8_gsa|ec9_joa|ec10_farmout|ec11_prms)_course\.sql$'); do
  git -C "$REPO" show "$REF:$f" | P
  n=$((n + 1))
done
[ "$n" = 6 ] || { echo "REFUSED: expected the 6 engine course migrations at $REF, found $n"; exit 2; }
holes=$(P -Atc "select coalesce(string_agg(g::text, ',' order by g), '') from generate_series(1, 78) g where not exists (select 1 from public.academy_apps a where a.path_order = g)")
[ -z "$holes" ] || { echo "REFUSED: path_order hole(s) in the scratch catalogue: $holes"; exit 2; }
[ "$(P -Atc "select count(*) from public.academy_apps where path_order = 79 or slug = 'contracts'")" = 0 ] \
  || { echo "REFUSED: path_order 79 or the slug contracts is already taken in the scratch catalogue"; exit 2; }
echo "$C ready at $REF: the real deep-course tables and learner functions, $n engine course migrations, path_order 1 to 78 held, 79 free"
P -Atc "select count(*) filter (where status='available') || ' available / ' || count(*) filter (where status='coming_soon') || ' coming_soon, ' || (select count(*) from public.academy_capstones) || ' capstones' from public.academy_apps"
