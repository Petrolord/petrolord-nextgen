#!/usr/bin/env bash
# =============================================================================
# gasvalue SCRATCH DATABASE. A local Postgres 16 the ladder is iterated on
# BEFORE the rolled-back production dry run, so a go-live that cannot pass is
# found here and never against production.
#
# The four academy tables the ladder writes, from the NextGen repository's own
# DDL (copied verbatim from tools/course-waves/supply/scratch_db.sh, and
# through it from compliance's and producedwater's, which cite the migrations
# each statement comes from), then production's neighbours as the merged
# ladders leave them on 2026-09-19: fifty-eight available courses at
# path_order 1 to 50 and 53 to 60, with the three live Commercial & Trading
# and Supply Chain courses named in their own slots (crude 48, refinery 49,
# supply 50), and the wave sibling as its own ladder seeds it, carbon at 52,
# energy_transition, coming_soon, so the go-live's path_order and catalogue
# checks read something like the table they will meet.
#
# What this cannot prove, said plainly: that production's rows match. That is
# what dryrun_gv.sh is for, and the owner's apply script re-runs every
# assertion against production inside the transaction that flips the course.
#
# Usage: scratch_db.sh          (re)creates container gv-scratch
#        GV_NO_SIBLING=1 scratch_db.sh   the same, without the carbon row
# =============================================================================
set -eu
C=gv-scratch
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

P <<SQL
set gv.no_sibling = '${GV_NO_SIBLING:-0}';
insert into public.academy_apps (slug, name, module, path_order, status)
select case g when 48 then 'crude' when 49 then 'refinery' when 50 then 'supply' else 'neighbour' || g end,
       'Neighbour ' || g,
       case when g in (48, 49) then 'commercial_trading' when g = 50 then 'supply_chain'
            when g between 53 and 58 then 'economics' when g in (59, 60) then 'assurance' else 'other' end,
       g, 'available'
  from generate_series(1, 60) g where g <= 50 or g >= 53;
-- The sibling, as its own ladder seeds it: carbon at 52, Energy Transition,
-- coming_soon. Either may land first, so the dry run is also taken without it
-- (GV_NO_SIBLING=1).
insert into public.academy_apps (slug, name, module, path_order, status)
select 'carbon', 'Carbon & Energy Efficiency', 'energy_transition', 52, 'coming_soon'
 where coalesce(current_setting('gv.no_sibling', true), '') <> '1';
SQL
echo "gv-scratch ready: 4 academy tables, $(P -Atc "select count(*) from public.academy_apps") catalogue rows ($(P -Atc "select count(*) filter (where status = 'available') || ' available / ' || count(*) filter (where status = 'coming_soon') || ' coming_soon' from public.academy_apps")), $(P -Atc "select count(*) from public.academy_apps where slug = 'carbon'") of them the sibling carbon"
