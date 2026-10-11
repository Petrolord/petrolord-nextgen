#!/usr/bin/env bash
# =============================================================================
# QI SCRATCH DATABASE. A local Postgres 16 the QI ladder is iterated on BEFORE
# the owner's rolled-back run against the linked project (the NextGen linked
# project IS production). Adapted from SC4 marine's scratch_db.sh.
#
# The four academy tables the ladder writes, from the NextGen repository's own
# DDL, with the two catalogue columns production has since carried
# (course_type from 20261116_sc5_contracts_platform_course_types, default
# 'app', and suite_module from 20261117_bridge_suite_module), then production's
# catalogue shape: the thirty four committed course migrations the marine
# scratch loads plus SC4 marine itself (78), read out of the COMMITTED tree at
# REF, so the path_order, catalogue and prompt checks meet real neighbours and
# real capstone rows; then a stand-in for every path_order from 1 to 79 still
# empty, one of them the prerequisite course 'welldata' (its row in production
# predates this repository's course migrations). Every path_order from 1 to 79
# is asserted occupied. QI joins at 80.
#
# What this cannot prove: that production's rows match. That is what the
# owner's prod-dryrun is for (rolled back, snapshotted before and after).
#
# Usage: scratch_db.sh [ref]     (re)creates container qi-scratch; default HEAD
#        (remove it afterwards with: docker rm -f qi-scratch)
# =============================================================================
set -eu
REF=${1:-HEAD}
HERE=$(cd "$(dirname "$0")" && pwd)
if up=$(cd "$HERE/../../.." 2>/dev/null && pwd) && { [ -d "$up/.git" ] || [ -f "$up/.git" ]; }; then
  REPO=${REPO:-$up}
else
  REPO=${REPO:-/root/wt-qi-nextgen}
fi
C=${SCRATCH:-qi-scratch}
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
alter table public.academy_apps
  add column if not exists course_type text not null default 'app'
  check (course_type in ('app', 'engine', 'practice'));
alter table public.academy_apps
  add column if not exists suite_module text;
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
for f in $(git -C "$REPO" ls-tree --name-only "$REF" migrations/ \
           | grep -E '_(fc[0-9]+_[a-z]+|cr_crude|rf_refinery|tds_supply|gv_gasvalue|cef_carbon|asrc_riskchange|cq_compliance|h[1-5]_[a-z]+|d1_dataqc|d2_mlcore|d3_facies|d4_forecastml|d5_appliedai|sc2_procurement|ec7_pia|ec8_gsa|ec9_joa|ec10_farmout|ec11_prms|sc3_materials|sc4_marine)_course\.sql$'); do
  git -C "$REPO" show "$REF:$f" | P
  n=$((n + 1))
done
[ "$n" = 34 ] || { echo "REFUSED: expected the 34 seeded course migrations at $REF, found $n"; exit 2; }
# The prerequisite, then a stand-in at every empty path_order from 1 to 79.
P <<'SQL'
insert into public.academy_apps (slug, name, module, path_order, status)
select 'welldata', 'Well Data Management', 'geoscience',
       (select min(g) from generate_series(1, 79) g where not exists (select 1 from public.academy_apps a where a.path_order = g)), 'available'
 where not exists (select 1 from public.academy_apps where slug = 'welldata');
insert into public.academy_apps (slug, name, module, path_order, status)
select 'neighbour' || g, 'Neighbour ' || g, 'other', g, 'available'
  from generate_series(1, 79) g where not exists (select 1 from public.academy_apps a where a.path_order = g);
SQL
# No hole: every path_order 1..79 must hold a row, stand-in or real, so a
# neighbour course the pattern above misses refuses instead of passing short.
holes=$(P -Atc "select coalesce(string_agg(g::text, ',' order by g), '') from generate_series(1, 79) g where not exists (select 1 from public.academy_apps a where a.path_order = g)")
[ -z "$holes" ] || { echo "REFUSED: path_order hole(s) in the neighbour catalogue at $REF: $holes"; exit 2; }
echo "$C ready: 4 academy tables, $n committed course migrations loaded at $REF"
P -Atc "select count(*) filter (where status='available') || ' available / ' || count(*) filter (where status='coming_soon') || ' coming_soon, ' || (select count(*) from public.academy_capstones) || ' capstones' from public.academy_apps"
