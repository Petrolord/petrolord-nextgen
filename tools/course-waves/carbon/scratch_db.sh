#!/usr/bin/env bash
# =============================================================================
# carbon SCRATCH DATABASE. A local Postgres 16 the ladder is iterated on
# BEFORE the rolled-back production dry run, so a go-live that cannot pass is
# found here and never against production.
#
# The four academy tables the ladder writes, from the NextGen repository's own
# DDL (copied verbatim from tools/course-waves/supply/scratch_db.sh, and
# through it from compliance's and producedwater's, which cite the migrations
# each statement comes from), then production's catalogue as it stood on
# 2026-09-19 (read from the linked project): fifty-five available courses at
# path_order 1 to 47 and 53 to 60, the three Commercial & Trading and Supply
# Chain courses LIVE at 48 (crude), 49 (refinery) and 50 (supply), 58 available
# and 0 coming_soon in all, and the wave sibling as its own ladder seeds it,
# gasvalue at 51, Energy Transition, coming_soon, so the go-live's path_order
# and catalogue checks read something like the table they will meet.
#
# What this cannot prove, said plainly: that production's rows match. That is
# what dryrun_tds.sh is for, and the owner's apply script re-runs every
# assertion against production inside the transaction that flips the course.
#
# Usage: scratch_db.sh          (re)creates container cef-scratch
#        CEF_NO_SIBLING=1 scratch_db.sh   the same, without the gasvalue row
# =============================================================================
set -eu
C=cef-scratch
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
set cef.no_sibling = '${CEF_NO_SIBLING:-0}';
insert into public.academy_apps (slug, name, module, path_order, status)
select 'neighbour' || g, 'Neighbour ' || g,
       case when g between 53 and 58 then 'economics' when g in (59, 60) then 'assurance' else 'other' end, g, 'available'
  from generate_series(1, 60) g where g <= 47 or g >= 53;
-- The three courses live since 2026-09-19, at their production slots.
insert into public.academy_apps (slug, name, module, path_order, status)
values ('crude', 'Crude Assay & Blending', 'commercial_trading', 48, 'available'),
       ('refinery', 'Refinery Feasibility & Planning', 'commercial_trading', 49, 'available'),
       ('supply', 'Terminals, Depots & Fuel Supply', 'supply_chain', 50, 'available');
-- The sibling, as its own ladder seeds it: gasvalue at 51, Energy Transition,
-- coming_soon. Either may land first, so the dry run is also taken without it
-- (CEF_NO_SIBLING=1).
insert into public.academy_apps (slug, name, module, path_order, status)
select 'gasvalue', 'Flare Gas to Value & LPG/CNG', 'energy_transition', 51, 'coming_soon'
 where coalesce(current_setting('cef.no_sibling', true), '') <> '1';
SQL
echo "cef-scratch ready: 4 academy tables, $(P -Atc "select count(*) from public.academy_apps") catalogue rows ($(P -Atc "select count(*) filter (where status='available') || ' available / ' || count(*) filter (where status='coming_soon') || ' coming_soon' from public.academy_apps")), $(P -Atc "select count(*) from public.academy_apps where slug = 'gasvalue'") of them the sibling gasvalue"
