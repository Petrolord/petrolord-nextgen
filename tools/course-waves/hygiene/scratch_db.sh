#!/usr/bin/env bash
# =============================================================================
# H2 SCRATCH DATABASE. A local Postgres 16 the ladder is iterated on, and THE
# ONLY DATABASE THIS WAVE'S LADDER IS EVER RUN AGAINST while it is being
# written. The NextGen linked project (txcsbtvcdaqmkjjbhbeg) IS PRODUCTION, and
# `supabase db query --linked` points at it, so no step of this wave runs
# supabase with any flag: the production dry run is handed to the OWNER in the
# pull request body and run by the owner.
#
# The four academy tables the ladder writes, from the NextGen repository's own
# DDL (copied verbatim from tools/course-waves/safetystats/scratch_db.sh, which
# copies riskchange, which copies producedwater, which cites the migrations each
# statement comes from).
#
# Then the CATALOGUE ITSELF, and not a stand-in for it: every committed
# `*_course.sql` migration at REF is loaded, in path order, so the neighbours,
# the path_orders, the modules and the capstone rows of other courses are the
# real ones. At origin/main that is 59 course migrations (the Geoscience,
# Reservoir, Drilling, Production, Economics, Facilities, Assurance,
# Commercial & Trading and Energy Transition courses). H1 safetystats is NOT
# among them, because it is unmerged, so path_order 61 and 62 are both free
# here exactly as they are on main. The count is ASSERTED against what the ref
# actually carries rather than copied from a sibling wave, and the assertion
# prints the number it found when it fails.
#
# Each course seeds itself as coming_soon, which is how its own migration writes
# it; production has since flipped most of them. So the available/coming_soon
# line this database prints is NOT production's. What it does carry, and what
# the go-live's checks need, is the real set of slugs, modules, path_orders,
# prompts and graded capstone fields of every other course.
#
# What this cannot prove, said plainly: that production's rows match. That is
# what the owner's production dry run is for, and the owner's apply script
# re-runs every assertion against production inside the transaction that flips
# the course.
#
# Usage: scratch_db.sh [ref]     (re)creates container h2-scratch; default
#                                origin/main, because that is the tree this
#                                course lands on.
# =============================================================================
set -eu
REF=${1:-origin/main}
HERE=$(cd "$(dirname "$0")" && pwd)
if up=$(cd "$HERE/../../.." 2>/dev/null && pwd) && { [ -d "$up/.git" ] || [ -f "$up/.git" ]; }; then
  REPO=${REPO:-$up}
else
  REPO=${REPO:-/root/wt-h2-nextgen}
fi
C=${SCRATCH:-h2-scratch}
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
-- Two stubs, and only because ONE committed course migration needs them.
-- 20260715_ng1_welldata_course.sql defines the prerequisite trigger on
-- academy_enrollments and reads academy_certifications inside it, so without
-- these the FIRST course migration refuses to load and the catalogue this
-- ladder is checked against would silently be 58 courses instead of 59. The
-- ladder writes to neither table.
create table if not exists public.academy_enrollments (
    user_id   uuid not null,
    app_slug  text not null,
    tier      text,
    primary key (user_id, app_slug)
);
create table if not exists public.academy_certifications (
    user_id     uuid not null,
    app_slug    text not null,
    tier        text,
    revoked_at  timestamptz,
    valid_until timestamptz
);
SQL

# THE SIX ORIGINAL CATALOGUE ROWS. The nine Geoscience course migrations do not
# insert their own academy_apps row: those six rows were seeded once by
# 20260715_n32_four_doors.sql, and ng1 then points the other five at welldata as
# a prerequisite. So exactly ONE statement of that migration is lifted here, its
# `insert into public.academy_apps ... values ...;`, read out of the object store
# at REF and never typed. The rest of n32 is the four-doors commerce machinery
# (fees, payments, codes, residency, the profile triggers), which reaches into
# auth.users and public.profiles and which this ladder touches nowhere.
git -C "$REPO" show "$REF:migrations/20260715_n32_four_doors.sql" \
  | awk '/^insert into public.academy_apps/{f=1} f{print} f&&/;[[:space:]]*$/{exit}' \
  | P
[ "$(P -Atc "select count(*) from public.academy_apps")" -ge 6 ] \
  || { echo "REFUSED: the six original catalogue rows did not load"; exit 2; }

# EVERY committed course migration at REF, so the catalogue this ladder meets is
# the real one. The expected count is read off the ref itself and then asserted
# against what actually loaded, so a course added upstream moves the number
# rather than breaking the run silently.
WANT=$(git -C "$REPO" ls-tree --name-only "$REF" migrations/ | grep -cE '_course\.sql$')
n=0
for f in $(git -C "$REPO" ls-tree --name-only "$REF" migrations/ | grep -E '_course\.sql$' | sort); do
  git -C "$REPO" show "$REF:$f" | P
  n=$((n + 1))
done
[ "$n" = "$WANT" ] || { echo "REFUSED: $REF carries $WANT course migrations and $n loaded"; exit 2; }
if [ "$(P -Atc "select count(*) from public.academy_apps where path_order = 62")" != 0 ]; then
  echo "REFUSED: something at $REF already holds path_order 62, which is this course's slot"; exit 2
fi
echo "$C ready: 4 academy tables, $n committed course migrations loaded at $REF, path_order 62 free"
P -Atc "select count(*) filter (where status='available') || ' available / ' || count(*) filter (where status='coming_soon') || ' coming_soon, ' || (select count(*) from public.academy_capstones) || ' capstones, ' || (select count(*) from public.academy_course_structures) || ' structures' from public.academy_apps"
