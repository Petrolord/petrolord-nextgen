#!/usr/bin/env bash
# =============================================================================
# H1 SCRATCH DATABASE. A local Postgres 16 the ladder is iterated on BEFORE any
# rolled-back run against the linked project, so a go-live that cannot pass is
# found here and never against production (the NextGen linked project,
# txcsbtvcdaqmkjjbhbeg, IS production).
#
# The four academy tables the ladder writes, from the NextGen repository's own
# DDL (copied verbatim from tools/course-waves/riskchange/scratch_db.sh, which
# copies tools/course-waves/producedwater/scratch_db.sh, which cites the
# migrations each statement comes from). Then production's shape as of
# 2026-09-19: the forty-four available courses as neighbours at path_order 1 to
# 38 and 53 to 58, and the eleven seeded coming_soon courses read out of the
# COMMITTED course migrations at REF (FC1 to FC9 at 39 to 47, riskchange at 59,
# compliance at 60), so the path_order, catalogue and prompt-sweep checks meet
# real neighbours and real capstone rows of other courses.
#
# What this cannot prove, said plainly: that production's rows match. That is
# what `dryrun_h1.sh` with TARGET=linked is for (rolled back, snapshotted
# before and after), and the owner's apply script re-runs every assertion
# against production inside the transaction that flips the course.
#
# Usage: scratch_db.sh [ref]     (re)creates container h1-scratch; default HEAD
# =============================================================================
set -eu
REF=${1:-HEAD}
HERE=$(cd "$(dirname "$0")" && pwd)
if up=$(cd "$HERE/../../.." 2>/dev/null && pwd) && { [ -d "$up/.git" ] || [ -f "$up/.git" ]; }; then
  REPO=${REPO:-$up}
else
  REPO=${REPO:-/root/wt-h1-nextgen}
fi
C=${SCRATCH:-h1-scratch}
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
           | grep -E '_(fc[0-9]+_[a-z]+|asrc_riskchange|cq_compliance)_course\.sql$'); do
  git -C "$REPO" show "$REF:$f" | P
  n=$((n + 1))
done
[ "$n" = 11 ] || { echo "REFUSED: expected the 11 seeded course migrations at $REF, found $n"; exit 2; }
echo "$C ready: 4 academy tables, $n committed course migrations loaded at $REF"
P -Atc "select count(*) filter (where status='available') || ' available / ' || count(*) filter (where status='coming_soon') || ' coming_soon, ' || (select count(*) from public.academy_capstones) || ' capstones' from public.academy_apps"
