#!/usr/bin/env bash
# =============================================================================
# D2 SCRATCH DATABASE. A local Postgres 16 the ladder is iterated on BEFORE any
# rolled-back run against the linked project, so a go-live that cannot pass is
# found here and never against production (the NextGen linked project IS
# production).
#
# Adapted from tools/course-waves/dataqc/scratch_db.sh (D1). The four
# academy tables the ladder writes, from the NextGen repository's own DDL, then
# production's catalogue shape: stand-ins for the courses at path_order 1 to 38
# and 53 to 58, and the TWENTY TWO FC, Commercial & Trading, Energy Transition,
# Assurance, HSE and Data & AI courses read out of the COMMITTED course migrations at REF
# (FC1 to FC9 at 39 to 47, crude, refinery and supply at 48 to 50, gasvalue and
# carbon at 51 and 52, riskchange at 59, compliance at 60, H1 to H5 at 61 to
# 65, D1 dataqc at 66), so the path_order, catalogue and prompt checks meet real
# neighbours and real capstone rows. Every path_order from 1 to 66 is asserted
# occupied, so a hole refuses rather than passing short.
#
# academy_apps.module is free text in production (no check constraint, no enum),
# which is why 'data_ai' needs no schema change; the scratch table mirrors that.
#
# What this cannot prove, said plainly: that production's rows match. That is
# what `dryrun_d2.sh` with TARGET=linked is for (rolled back, snapshotted
# before and after), and the owner's apply script re-runs every assertion
# against production inside the transaction that flips the course.
#
# Usage: scratch_db.sh [ref]     (re)creates container d2-scratch; default HEAD
# =============================================================================
set -eu
REF=${1:-HEAD}
HERE=$(cd "$(dirname "$0")" && pwd)
if up=$(cd "$HERE/../../.." 2>/dev/null && pwd) && { [ -d "$up/.git" ] || [ -f "$up/.git" ]; }; then
  REPO=${REPO:-$up}
else
  REPO=${REPO:-/root/wt-dai-d2-nextgen}
fi
C=${SCRATCH:-d2-scratch}
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
n=0
for f in $(git -C "$REPO" ls-tree --name-only "$REF" migrations/ \
           | grep -E '_(fc[0-9]+_[a-z]+|cr_crude|rf_refinery|tds_supply|gv_gasvalue|cef_carbon|asrc_riskchange|cq_compliance|h[1-5]_[a-z]+|d1_dataqc)_course\.sql$'); do
  git -C "$REPO" show "$REF:$f" | P
  n=$((n + 1))
done
[ "$n" = 22 ] || { echo "REFUSED: expected the 22 seeded course migrations at $REF, found $n"; exit 2; }
# No hole: every path_order 1..66 must hold a row, stand-in or real, so a
# neighbour course the pattern above misses refuses instead of passing short.
holes=$(P -Atc "select coalesce(string_agg(g::text, ',' order by g), '') from generate_series(1, 66) g where not exists (select 1 from public.academy_apps a where a.path_order = g)")
[ -z "$holes" ] || { echo "REFUSED: path_order hole(s) in the neighbour catalogue at $REF: $holes"; exit 2; }
echo "$C ready: 4 academy tables, $n committed course migrations loaded at $REF"
P -Atc "select count(*) filter (where status='available') || ' available / ' || count(*) filter (where status='coming_soon') || ' coming_soon, ' || (select count(*) from public.academy_capstones) || ' capstones' from public.academy_apps"
