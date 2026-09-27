#!/usr/bin/env bash
# =============================================================================
# SC5 PLATFORM DRY RUN on a LOCAL scratch Postgres 16 (never the linked
# project: the NextGen linked project IS production).
#
# What it builds: the academy tables and helper functions the platform
# migration touches or calls, from the NextGen repository's own DDL (the n31
# spine, dc1 chassis, 20261105 verification), with auth.uid() read from a GUC,
# a stand-in catalogue at path_order 1 to 70 and the SIX REAL engine course
# migrations (procurement, pia, gsa, joa, farmout, prms) read from the
# committed tree at REF. Stubbed, and said so: academy_has_scope (true for a
# user with an active enrolment in the course; the real one also checks
# activation, which this file does not change), academy_course_for_app (the
# real body, null).
#
# Then:
#   1. the migration inside begin ... rollback (the dry run proper), and the
#      catalogue is byte-identical afterwards;
#   2. applied for real, TWICE (idempotency), with a snapshot of every
#      pre-existing column of academy_apps before and after (nothing else
#      moves) and the backfill counted;
#   3. the constraints: a practice row without dates, with the review date not
#      after the check date, and an unknown type, each refused; a valid
#      practice row accepted;
#   4. the certificate path: refusals for an app course, an engine course, no
#      enrolment, no passed final exam; issue on a passed final at each tier
#      with the ladder's certificate tier; already certified; renewal inside
#      60 days; grants (anon cannot execute, authenticated can);
#   5. verification: the old function's keys plus course_type and nothing
#      else, with the value per course type;
#   6. NEGATIVE CONTROL: three planted defects (a missing backfill slug, the
#      claim's course-type refusal removed, the practice-date constraint
#      removed) and each must turn this run red.
#
# Usage: dryrun_platform.sh [ref]        default HEAD of /root/wt-sc5-nextgen
#        NEG=1 dryrun_platform.sh        runs the negative control as well
# Container sc5-platform-scratch is removed at the end.
# =============================================================================
set -eu
REF=${1:-HEAD}
REPO=${REPO:-/root/wt-sc5-nextgen}
MIG=migrations/20261116_sc5_contracts_platform_course_types.sql
C=${SCRATCH:-sc5-platform-scratch}
PASS=0; FAILN=0
ok()  { PASS=$((PASS + 1)); echo "  ok   $*"; }
bad() { FAILN=$((FAILN + 1)); echo "  FAIL $*"; }

start_db() {
  docker rm -f $C >/dev/null 2>&1 || true
  docker run -d --name $C -e POSTGRES_PASSWORD=scratch postgres:16-alpine >/dev/null
  until docker exec $C pg_isready -U postgres >/dev/null 2>&1; do sleep 1; done
  sleep 2
}
P()  { docker exec -i $C psql -U postgres -v ON_ERROR_STOP=1 -q "$@"; }
Q()  { docker exec -i $C psql -U postgres -v ON_ERROR_STOP=1 -Atq -c "$1"; }
# Run SQL as a user: set the auth GUC in the same session.
AS() { docker exec -i $C psql -U postgres -v ON_ERROR_STOP=1 -Atq -c "set request.jwt.claim.sub = '$1'; $2" 2>&1; }

build_base() {
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

-- n32 + published fees + prereq + bonus tiers: the catalogue row as production has it
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

-- n31 spine
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

-- dc1 chassis
create table public.academy_course_structures (
    app_slug text not null references public.academy_apps (slug),
    tier text not null check (tier in ('beginner','intermediate','advanced')),
    structure jsonb not null, content_version integer not null default 1,
    active boolean not null default true, enforced_from timestamptz not null default now(),
    settings jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
    primary key (app_slug, tier));
create table public.academy_quiz_attempts (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    app_slug text not null, tier text not null check (tier in ('beginner','intermediate','advanced')),
    scope text not null check (scope in ('module','final')), module_key text,
    question_ids uuid[] not null, answers jsonb, score integer, max_score integer, passed boolean,
    status text not null default 'open' check (status in ('open','submitted','expired')),
    created_at timestamptz not null default now(), submitted_at timestamptz,
    check ((scope = 'module') = (module_key is not null)));

create or replace function public.academy_deep_structure(p_app text, p_tier text)
returns public.academy_course_structures
language sql stable security definer set search_path = public as $$
  select * from public.academy_course_structures where app_slug = p_app and tier = p_tier and active;
$$;
create or replace function public.academy_quiz_passed(
    p_user uuid, p_app text, p_tier text, p_scope text, p_module_key text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.academy_quiz_attempts
                  where user_id = p_user and app_slug = p_app and tier = p_tier and scope = p_scope
                    and (module_key = p_module_key or (module_key is null and p_module_key is null))
                    and status = 'submitted' and passed);
$$;
create or replace function public.academy_course_for_app(p_app text) returns uuid
language sql stable as $$ select null::uuid; $$;
-- STUB (stated): the real academy_has_scope also checks activation.
create or replace function public.academy_has_scope(p_app text, p_min text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.academy_enrollments
                  where user_id = auth.uid() and app_slug = p_app and status = 'active');
$$;
SQL
  # the verification function exactly as production has it (20261105)
  git -C "$REPO" show "$REF:migrations/20261105_catalog_course_titles.sql" \
    | sed -n '/^create or replace function public.academy_verify_certificate/,$p' | P
  P <<'SQL'
insert into public.academy_apps (slug, name, module, path_order, status)
select 'neighbour' || g, 'Neighbour ' || g, 'other', g, 'available'
  from generate_series(1, 70) g;
SQL
  local n=0
  for f in $(git -C "$REPO" ls-tree --name-only "$REF" migrations/ \
             | grep -E '_(sc2_procurement|ec7_pia|ec8_gsa|ec9_joa|ec10_farmout|ec11_prms)_course\.sql$'); do
    git -C "$REPO" show "$REF:$f" | P
    n=$((n + 1))
  done
  [ "$n" = 6 ] || { echo "REFUSED: expected the 6 engine course migrations at $REF, found $n"; exit 2; }
}

# The migration under test, from the committed tree (or a planted copy).
MIGSQL() { if [ -n "${PLANT:-}" ]; then cat "$PLANT"; else git -C "$REPO" show "$REF:$MIG"; fi; }

snapshot() { Q "select md5(string_agg(row(slug, name, module, path_order, status, school, prereq_slug, bonus_tiers, created_at)::text, '|' order by slug)) from public.academy_apps"; }

run_all() {
  start_db
  build_base
  echo "--- scratch built: $(Q "select count(*) from public.academy_apps") catalogue rows, $(Q "select count(*) from public.academy_capstones") capstones"

  # A pre-existing certificate on an engine course, read by the OLD verifier.
  U0=$(Q "insert into auth.users (email) values ('old@x') returning id")
  Q "insert into public.profiles (id, display_name) values ('$U0', 'Old Holder')" >/dev/null
  VC0=$(Q "insert into public.academy_certifications (user_id, app_slug, tier) values ('$U0', 'procurement', 'associate') returning verify_code")
  OLDKEYS=$(Q "select string_agg(k, ',' order by k) from jsonb_object_keys(public.academy_verify_certificate('$VC0')) k")
  OLDVAL=$(Q "select public.academy_verify_certificate('$VC0')::text")

  echo "--- 1. dry run: begin, the migration, rollback"
  S0=$(snapshot)
  out=$( { echo 'begin;'; MIGSQL; echo 'rollback;'; } | docker exec -i $C psql -U postgres -v ON_ERROR_STOP=1 -q 2>&1 ) \
    && ok "migration ran inside a transaction: $(echo "$out" | grep -o 'course types:.*' | head -1)" \
    || { bad "migration failed inside the dry run: $(echo "$out" | tail -3)"; }
  [ "$(snapshot)" = "$S0" ] && ok "catalogue unchanged after rollback" || bad "catalogue changed after rollback"
  [ "$(Q "select count(*) from information_schema.columns where table_name='academy_apps' and column_name='course_type'")" = 0 ] \
    && ok "no course_type column after rollback" || bad "course_type survived the rollback"

  echo "--- 2. apply twice (idempotent); every pre-existing column unchanged"
  if ! out=$( { echo 'begin;'; MIGSQL; echo 'commit;'; } | docker exec -i $C psql -U postgres -v ON_ERROR_STOP=1 -q 2>&1 ); then
    bad "first apply failed: $(echo "$out" | tail -3)"; return
  fi
  ok "first apply: $(echo "$out" | grep -o 'course types:.*' | head -1)"
  if out=$( { echo 'begin;'; MIGSQL; echo 'commit;'; } | docker exec -i $C psql -U postgres -v ON_ERROR_STOP=1 -q 2>&1 ); then
    ok "second apply: $(echo "$out" | grep -o 'course types:.*' | head -1)"
  else bad "second apply failed: $(echo "$out" | tail -3)"; fi
  [ "$(snapshot)" = "$S0" ] && ok "every pre-existing column of all $(Q "select count(*) from public.academy_apps") rows byte-identical" || bad "a pre-existing column changed"
  got=$(Q "select string_agg(slug, ',' order by slug) from public.academy_apps where course_type = 'engine'")
  [ "$got" = "farmout,gsa,joa,pia,prms,procurement" ] && ok "engine rows: $got" || bad "engine rows: $got"
  got=$(Q "select count(*) from public.academy_apps where course_type = 'app'")
  [ "$got" = 70 ] && ok "the 70 stand-in rows stay app" || bad "app rows: $got"
  got=$(Q "select count(*) from public.academy_apps where review_date is not null or sources_checked_on is not null")
  [ "$got" = 0 ] && ok "no existing row gains a date" || bad "$got rows gained a date"

  echo "--- 3. constraints"
  for case in \
    "no dates|insert into public.academy_apps (slug, name, module, path_order, course_type) values ('px1','P','supply_chain',90,'practice')" \
    "review not after check|insert into public.academy_apps (slug, name, module, path_order, course_type, review_date, sources_checked_on) values ('px2','P','supply_chain',91,'practice','2026-09-27','2026-09-27')" \
    "only a review date|insert into public.academy_apps (slug, name, module, path_order, course_type, review_date) values ('px3','P','supply_chain',92,'practice','2027-09-27')" \
    "unknown type|insert into public.academy_apps (slug, name, module, path_order, course_type) values ('px4','P','supply_chain',93,'course')" \
    "an engine row made practice without dates|update public.academy_apps set course_type = 'practice' where slug = 'gsa'"; do
    cname=${case%%|*}; csql=${case#*|}
    if Q "$csql" >/dev/null 2>&1; then bad "constraint let through: $cname"; else ok "refused: $cname"; fi
  done
  Q "insert into public.academy_apps (slug, name, module, path_order, status, course_type, review_date, sources_checked_on) values ('contracts','Contract & Supplier Management','supply_chain',79,'coming_soon','practice','2027-09-27','2026-09-27')" >/dev/null \
    && ok "a practice row with both dates accepted" || bad "a valid practice row refused"

  echo "--- 4. the certificate path"
  U=$(Q "insert into auth.users (email) values ('l@x') returning id")
  Q "insert into public.profiles (id, display_name) values ('$U', 'Learner One')" >/dev/null
  for t in beginner intermediate advanced; do
    Q "insert into public.academy_course_structures (app_slug, tier, structure) values ('contracts', '$t', '{\"modules\":[]}')" >/dev/null
  done
  Q "insert into public.academy_enrollments (user_id, app_slug, course_tier, door) values ('$U','contracts','beginner','self'), ('$U','contracts','advanced','self'), ('$U','neighbour3','beginner','self'), ('$U','procurement','beginner','self')" >/dev/null
  Q "insert into public.academy_course_structures (app_slug, tier, structure) values ('procurement','beginner','{\"modules\":[]}'), ('neighbour3','beginner','{\"modules\":[]}')" >/dev/null
  Q "insert into public.academy_quiz_attempts (user_id, app_slug, tier, scope, question_ids, status, passed) values ('$U','procurement','beginner','final','{}','submitted',true), ('$U','neighbour3','beginner','final','{}','submitted',true)" >/dev/null

  expect_err() { # name, pattern, sql-as-user
    local r; r=$(AS "$U" "$3") && { bad "$1: issued ($r)"; return; }
    echo "$r" | grep -q "$2" && ok "$1: refused ($(echo "$r" | grep -o 'ERROR:.*' | head -1 | cut -c1-110))" || bad "$1: wrong refusal: $r"
  }
  expect_err "app course" "is an app course" "select public.academy_claim_practice_certificate('neighbour3','beginner')"
  expect_err "engine course" "is an engine course" "select public.academy_claim_practice_certificate('procurement','beginner')"
  expect_err "unknown course" "unknown course" "select public.academy_claim_practice_certificate('nosuch','beginner')"
  expect_err "bad tier" "tier must be" "select public.academy_claim_practice_certificate('contracts','expert')"
  expect_err "no final exam passed" "pass the final exam" "select public.academy_claim_practice_certificate('contracts','beginner')"
  Q "insert into public.academy_quiz_attempts (user_id, app_slug, tier, scope, question_ids, status, passed) values ('$U','contracts','beginner','final','{}','submitted',false)" >/dev/null
  expect_err "a FAILED final only" "pass the final exam" "select public.academy_claim_practice_certificate('contracts','beginner')"
  Q "insert into public.academy_quiz_attempts (user_id, app_slug, tier, scope, module_key, question_ids, status, passed) values ('$U','contracts','beginner','module','m01','{}','submitted',true)" >/dev/null
  expect_err "a passed MODULE quiz only" "pass the final exam" "select public.academy_claim_practice_certificate('contracts','beginner')"
  expect_err "no enrolment at the tier" "active intermediate enrollment" "select public.academy_claim_practice_certificate('contracts','intermediate')"
  r=$(AS "" "select public.academy_claim_practice_certificate('contracts','beginner')") && bad "anonymous call issued" || ok "no user: refused"

  Q "insert into public.academy_quiz_attempts (user_id, app_slug, tier, scope, question_ids, status, passed) values ('$U','contracts','beginner','final','{}','submitted',true)" >/dev/null
  r=$(AS "$U" "select public.academy_claim_practice_certificate('contracts','beginner')")
  echo "$r" | grep -q '"tier": "associate"' && echo "$r" | grep -q '"basis": "final_exam"' && echo "$r" | grep -q '"renewed": false' \
    && ok "beginner final passed: associate issued, basis final_exam" || bad "beginner claim: $r"
  r=$(AS "$U" "select public.academy_claim_practice_certificate('contracts','beginner')")
  echo "$r" | grep -q '"already_certified": true' && ok "second claim: already certified, no new row" || bad "second claim: $r"
  [ "$(Q "select count(*) from public.academy_certifications where user_id='$U'")" = 1 ] && ok "one certificate row" || bad "certificate rows: $(Q "select count(*) from public.academy_certifications where user_id='$U'")"
  Q "update public.academy_certifications set valid_until = now() + interval '30 days' where user_id='$U'" >/dev/null
  r=$(AS "$U" "select public.academy_claim_practice_certificate('contracts','beginner')")
  echo "$r" | grep -q '"renewed": true' && ok "inside 60 days: renewed" || bad "renewal: $r"
  [ "$(Q "select count(*) from public.academy_certifications where user_id='$U' and revoked_at is not null")" = 1 ] && ok "the old certificate superseded" || bad "supersede"
  Q "insert into public.academy_quiz_attempts (user_id, app_slug, tier, scope, question_ids, status, passed) values ('$U','contracts','advanced','final','{}','submitted',true)" >/dev/null
  r=$(AS "$U" "select public.academy_claim_practice_certificate('contracts','advanced')")
  echo "$r" | grep -q '"tier": "expert"' && ok "advanced written-case final passed: expert issued" || bad "advanced claim: $r"

  [ "$(Q "select has_function_privilege('anon', 'public.academy_claim_practice_certificate(text,text)', 'execute')")" = f ] && ok "anon cannot execute the claim" || bad "anon can execute the claim"
  [ "$(Q "select has_function_privilege('authenticated', 'public.academy_claim_practice_certificate(text,text)', 'execute')")" = t ] && ok "authenticated can execute the claim" || bad "authenticated cannot execute"
  [ "$(Q "select has_function_privilege('anon', 'public.academy_verify_certificate(text)', 'execute')")" = t ] && ok "anon still verifies certificates" || bad "anon lost verification"

  echo "--- 5. verification"
  NEWKEYS=$(Q "select string_agg(k, ',' order by k) from jsonb_object_keys(public.academy_verify_certificate('$VC0')) k")
  [ "$NEWKEYS" = "$(echo "$OLDKEYS,course_type" | tr ',' '\n' | sort | paste -sd,)" ] && ok "keys: the old set plus course_type" || bad "keys changed: $OLDKEYS -> $NEWKEYS"
  same=$(Q "select (('$OLDVAL')::jsonb = (public.academy_verify_certificate('$VC0') - 'course_type'))::text")
  [ "$same" = true ] && ok "every old key returns the same value" || bad "an old key's value changed"
  t=$(Q "select public.academy_verify_certificate('$VC0')->>'course_type'"); [ "$t" = engine ] && ok "procurement certificate verifies as engine" || bad "procurement: $t"
  VCP=$(Q "select verify_code from public.academy_certifications where user_id='$U' and tier='expert'")
  t=$(Q "select public.academy_verify_certificate('$VCP')->>'course_type'"); [ "$t" = practice ] && ok "contracts certificate verifies as practice" || bad "contracts: $t"
  VCA=$(Q "insert into public.academy_certifications (user_id, app_slug, tier) values ('$U','neighbour3','associate') returning verify_code")
  t=$(Q "select public.academy_verify_certificate('$VCA')->>'course_type'"); [ "$t" = app ] && ok "an app course certificate verifies as app" || bad "app: $t"
}

run_all
echo "=== dry run: $PASS ok, $FAILN failed"
MAINFAIL=$FAILN

if [ "${NEG:-0}" = 1 ]; then
  echo
  echo "=== NEGATIVE CONTROL: each planted defect must turn the run red"
  src=$(mktemp); git -C "$REPO" show "$REF:$MIG" > "$src"
  negred=0; negtotal=0
  plant() { # name, python replacement (old -> new)
    local name=$1 old=$2 new=$3 f; f=$(mktemp)
    python3 - "$src" "$f" "$old" "$new" <<'PY'
import sys
s = open(sys.argv[1]).read(); old, new = sys.argv[3], sys.argv[4]
assert s.count(old) >= 1, 'plant target not found: ' + old
open(sys.argv[2], 'w').write(s.replace(old, new))
PY
    negtotal=$((negtotal + 1))
    PASS=0; FAILN=0
    PLANT=$f run_all > "$f.log" 2>&1 || true
    if [ "$FAILN" -gt 0 ]; then negred=$((negred + 1)); echo "  red   $name ($FAILN failures)"; else echo "  GREEN $name (the run missed the defect)"; fi
    rm -f "$f"
  }
  plant "backfill misses pia" "('procurement', 'pia', 'gsa', 'joa', 'farmout', 'prms')
   and course_type is distinct" "('procurement', 'gsa', 'joa', 'farmout', 'prms')
   and course_type is distinct"
  plant "claim accepts any course type" "if v_app.course_type is distinct from 'practice' then" "if false then"
  plant "practice dates not required" "check (course_type <> 'practice'
             or (review_date" "check (true or (review_date"
  plant "claim skips the final exam" "if not public.academy_quiz_passed(v_uid, p_app, p_tier, 'final', null) then" "if false then"
  plant "verification drops course_type" "'course_type', coalesce(a.course_type, 'app')," ""
  echo "=== negative control: $negred of $negtotal plants red"
  rm -f "$src"
  [ "$negred" = "$negtotal" ] || MAINFAIL=$((MAINFAIL + 1))
fi
docker rm -f $C >/dev/null 2>&1 || true
[ "$MAINFAIL" = 0 ]
