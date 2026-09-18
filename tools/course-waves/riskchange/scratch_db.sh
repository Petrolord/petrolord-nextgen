#!/usr/bin/env bash
# =============================================================================
# riskchange SCRATCH DATABASE. A local Postgres 16 the ladder is iterated on
# BEFORE the rolled-back production dry run, so a go-live that cannot pass is
# found here and never against production.
#
# The four academy tables the ladder writes, from the NextGen repository's own
# DDL (copied verbatim from tools/course-waves/producedwater/scratch_db.sh,
# which cites the migrations each statement comes from), then production's
# neighbours: the six Economics catalogue rows at path_order 53 to 58 and the
# forty-four available courses in total, so the go-live's path_order and
# catalogue checks read something like the table they will meet.
#
# What this cannot prove, said plainly: that production's rows match. That is
# what dryrun_asrc.sh is for, and the owner's apply script re-runs every
# assertion against production inside the transaction that flips the course.
#
# Usage: scratch_db.sh          (re)creates container asrc-scratch
# =============================================================================
set -eu
C=asrc-scratch
docker rm -f $C >/dev/null 2>&1 || true
docker run -d --name $C -e POSTGRES_PASSWORD=scratch postgres:16-alpine >/dev/null
until docker exec $C pg_isready -U postgres >/dev/null 2>&1; do sleep 1; done
sleep 2
P() { docker exec -i $C psql -U postgres -v ON_ERROR_STOP=1 -q "$@"; }
P <<'SQL'
create table if not exists public.academy_apps (
    slug        text primary key,
    name        text not null,
    module      text not null,
    path_order  integer not null,
    status      text not null default 'coming_soon'
                check (status in ('available', 'coming_soon')),
    created_at  timestamptz not null default now()
);
alter table public.academy_apps
  add column if not exists school text not null default 'subsurface'
  check (school in ('subsurface', 'energy_business'));
alter table public.academy_apps
  add column if not exists prereq_slug text references public.academy_apps (slug);
alter table public.academy_apps
  add column if not exists bonus_tiers text[] not null default '{}';
create table if not exists public.academy_capstones (
    app_slug   text not null,
    tier       text not null
               check (tier in ('beginner','intermediate','advanced')),
    cert_tier  text not null
               check (cert_tier in ('associate','professional','expert')),
    dataset    text not null,
    title      text not null,
    prompt     text not null,
    fields     jsonb not null,
    active     boolean not null default true,
    primary key (app_slug, tier)
);
create table if not exists public.academy_course_structures (
    app_slug        text not null references public.academy_apps (slug),
    tier            text not null
                    check (tier in ('beginner','intermediate','advanced')),
    structure       jsonb not null,
    content_version integer not null default 1,
    active          boolean not null default true,
    enforced_from   timestamptz not null default now(),
    settings        jsonb not null default '{}'::jsonb,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now(),
    primary key (app_slug, tier)
);
create table if not exists public.academy_quiz_questions (
    id           uuid primary key default gen_random_uuid(),
    app_slug     text not null,
    tier         text not null
                 check (tier in ('beginner','intermediate','advanced')),
    scope        text not null check (scope in ('module','final')),
    module_key   text,
    ord          integer not null default 0,
    prompt       text not null,
    options      jsonb not null,
    answer_index integer not null,
    explanation  text,
    active       boolean not null default true,
    created_at   timestamptz not null default now(),
    check ((scope = 'module') = (module_key is not null))
);
SQL

P <<'SQL'
insert into public.academy_apps (slug, name, module, path_order, status)
select 'neighbour' || g, 'Neighbour ' || g,
       case when g between 53 and 58 then 'economics' else 'other' end, g, 'available'
  from generate_series(1, 58) g where g <= 38 or g >= 53;
SQL
echo "asrc-scratch ready: 4 academy tables, $(P -Atc "select count(*) from public.academy_apps") catalogue rows (all available)"
