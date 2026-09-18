#!/usr/bin/env bash
# =============================================================================
# FC8 SCRATCH DATABASE. The dry run's target, and never production.
#
# The FC6 dry run ran its rolled-back ladder against the LINKED project, which
# for petrolord-nextgen is production (txcsbtvcdaqmkjjbhbeg). This wave's brief
# forbids that, so the ladder is proved against a local Postgres 16 instead:
# the four academy tables the ladder writes, built from the NextGen
# repository's OWN DDL (migrations/20260715_n32_four_doors.sql,
# 20260715_published_fees.sql, 20260715_ng1_welldata_course.sql,
# 20260908_wdm_prereq_waiver.sql, 20260715_n4_petrophysics_capstone.sql and
# 20260822_dc1_deep_course_chassis.sql, the create-table and add-column
# statements only, copied verbatim), then the catalogue and capstone rows of
# every COMMITTED Facilities course migration at the given ref, so the
# path_order and slug collisions the go-live checks are exercised against real
# neighbours rather than an empty table.
#
# What this cannot prove, said plainly: that production's rows match the
# repository's. The owner's apply script re-runs every one of the go-live's
# assertions against production at apply time, inside the same transaction as
# the flip, so a production-only collision refuses there.
#
# Usage: scratch_db.sh [ref]     (re)creates container fc8-scratch
# =============================================================================
set -eu
REF=${1:-HEAD}
REPO=${REPO:-/root/wt-fc8-nextgen}
C=fc8-scratch
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
n=0
for f in $(git -C "$REPO" ls-tree --name-only "$REF" migrations/ | grep -E '_fc[0-9]+_[a-z]+_course\.sql$' | grep -v fc8_); do
  git -C "$REPO" show "$REF:$f" | P
  n=$((n + 1))
done
echo "fc8-scratch ready: 4 academy tables from the repository's own DDL, $n committed Facilities course migrations loaded at $REF"
P -Atc "select slug||' '||module||' '||path_order||' '||status from public.academy_apps order by path_order"
