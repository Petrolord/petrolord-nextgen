#!/usr/bin/env bash
# =============================================================================
# SCRATCH DRY RUN for migrations/20261105_catalog_course_titles.sql.
#
# A local Postgres 16 in its own container (catalog-titles-scratch), removed at
# the end. No production access. It builds the catalog the committed course
# migrations seed (all academy_apps rows, read from migrations/ at the working
# tree), the certificate table and the pre-change academy_verify_certificate
# from 20260715_n31_academy_spine.sql, then proves:
#
#   1. the five renames land and no other catalog row moves;
#   2. a second run updates nothing and passes;
#   3. the verify RPC returns course_name, keeps every earlier key, stays
#      SECURITY DEFINER with search_path=public, and anon can execute it;
#   4. the holder never prints an email address, blank reads
#      'Registered learner';
#   5. NEGATIVE CONTROL: with the facies row absent the file raises and, run
#      in one transaction, leaves the catalog untouched.
#
# Usage: tools/catalog-titles/scratch_db.sh     (exit 0 = every check passed)
# =============================================================================
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
REPO=$(cd "$HERE/../.." && pwd)
MIG=$REPO/migrations/20261105_catalog_course_titles.sql
C=${SCRATCH:-catalog-titles-scratch}
trap 'docker rm -f $C >/dev/null 2>&1 || true' EXIT
docker rm -f $C >/dev/null 2>&1 || true
docker run -d --name $C -e POSTGRES_PASSWORD=scratch postgres:16-alpine >/dev/null
until docker exec $C pg_isready -U postgres >/dev/null 2>&1; do sleep 1; done
sleep 2
P() { docker exec -i $C psql -U postgres -v ON_ERROR_STOP=1 -qAt "$@"; }

# Catalog seed: every (slug, name) the committed migrations insert, first wins.
SEED=$(node -e '
const fs=require("fs"),path=require("path");const d=process.argv[1];const n={};
for(const f of fs.readdirSync(d).filter(f=>f.endsWith(".sql")).sort()){
  if(f==="20261105_catalog_course_titles.sql")continue;
  const s=fs.readFileSync(path.join(d,f),"utf8");
  const re=/insert into public\.academy_apps\s*\(([^)]*)\)\s*values([\s\S]*?)(on conflict[^;]*;|;)/gi;let m;
  while((m=re.exec(s)))for(const r of m[2].matchAll(/\(\s*\x27([a-z0-9_]+)\x27\s*,\s*\x27((?:[^\x27]|\x27\x27)*)\x27/g))if(!(r[1] in n))n[r[1]]=r[2];}
let i=0;console.log(Object.entries(n).map(([s,v])=>`(\x27${s}\x27,\x27${v}\x27,\x27x\x27,${++i})`).join(",\n"));' "$REPO/migrations")

P <<SQL
create role anon nologin; create role authenticated nologin;
create schema auth;
create table auth.users (id uuid primary key default gen_random_uuid(), email text);
create function auth.uid() returns uuid language sql as 'select null::uuid';
create table public.profiles (id uuid primary key references auth.users(id), email text, display_name text);
create table public.academy_apps (slug text primary key, name text not null, module text not null, path_order int not null,
  status text not null default 'coming_soon');
insert into public.academy_apps (slug, name, module, path_order) values
$SEED;
create table public.courses (id uuid primary key);
SQL
# certifications table and the original verify function, cut from the spine.
sed -n '/^create sequence if not exists public.academy_cert_seq/,/^    on public.academy_certifications (user_id, app_slug);/p' \
  "$REPO/migrations/20260715_n31_academy_spine.sql" | P
sed -n '/^create or replace function public.academy_verify_certificate/,/^grant execute on function public.academy_verify_certificate/p' \
  "$REPO/migrations/20260715_n31_academy_spine.sql" | P

P <<'SQL'
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-000000000001','ada@example.com'),
  ('00000000-0000-0000-0000-000000000002','bola@example.com'),
  ('00000000-0000-0000-0000-000000000003','chi@example.com');
insert into public.profiles values
  ('00000000-0000-0000-0000-000000000001','ada@example.com','Ada Okafor'),
  ('00000000-0000-0000-0000-000000000002','bola@example.com','bola@example.com'),
  ('00000000-0000-0000-0000-000000000003','chi@example.com','   ');
insert into public.academy_certifications (user_id, app_slug, tier, verify_code) values
  ('00000000-0000-0000-0000-000000000001','seismolord','associate','v-seis'),
  ('00000000-0000-0000-0000-000000000002','welltest','professional','v-wt'),
  ('00000000-0000-0000-0000-000000000003','facies','expert','v-fac');
create table snap as select slug, name from public.academy_apps;
SQL
fail=0
check() { if [ "$2" = "$3" ]; then echo "PASS $1"; else echo "FAIL $1: got [$2] want [$3]"; fail=1; fi; }

check "catalog rows seeded" "$(P -c 'select count(*) from public.academy_apps')" "70"
check "before: verify has no course_name" "$(P -c "select public.academy_verify_certificate('v-seis') ? 'course_name'")" "f"

echo "--- run 1"; P -1 < "$MIG" 2>&1 | sed 's/^/    /'
check "five rows renamed" "$(P -c "select string_agg(a.slug||'='||a.name, '; ' order by a.slug) from public.academy_apps a join snap s using (slug) where a.name <> s.name")" \
  "facies=Electrofacies Classification; mapping=Subsurface Mapping; reservoircalc=Reservoir Volumetrics; seismolord=Seismic Interpretation; welldata=Well Data Management"
check "no other row moved" "$(P -c "select count(*) from public.academy_apps a join snap s using (slug) where a.name <> s.name and a.slug not in ('facies','mapping','reservoircalc','seismolord','welldata')")" "0"
snap2=$(P -c "select md5(string_agg(slug||name, ',' order by slug)) from public.academy_apps")
echo "--- run 2 (idempotency)"; P -1 < "$MIG" 2>&1 | sed 's/^/    /'
check "second run changes nothing" "$(P -c "select md5(string_agg(slug||name, ',' order by slug)) from public.academy_apps")" "$snap2"

check "verify course_name (seismolord)" "$(P -c "set role anon; select public.academy_verify_certificate('v-seis')->>'course_name'")" "Seismic Interpretation"
check "verify course_name (welltest)" "$(P -c "set role anon; select public.academy_verify_certificate('v-wt')->>'course_name'")" "Well Test Analysis"
check "verify keys" "$(P -c "select string_agg(k, ',' order by k) from jsonb_object_keys(public.academy_verify_certificate('v-seis')) k")" \
  "app_slug,certificate_number,course_name,holder,issued_at,status,tier,valid_until"
check "holder display name" "$(P -c "select public.academy_verify_certificate('v-seis')->>'holder'")" "Ada Okafor"
check "holder never an email" "$(P -c "select public.academy_verify_certificate('v-wt')->>'holder'")" "Registered learner"
check "holder blank" "$(P -c "select public.academy_verify_certificate('v-fac')->>'holder'")" "Registered learner"
check "unknown code is null" "$(P -c "set role anon; select public.academy_verify_certificate('nope') is null")" "t"
check "security definer + search_path" "$(P -c "select prosecdef::text||' '||array_to_string(proconfig, ',') from pg_proc where proname='academy_verify_certificate'")" "true search_path=public"
check "anon can execute" "$(P -c "select has_function_privilege('anon','public.academy_verify_certificate(text)','execute')")" "t"
check "PUBLIC has no execute grant" "$(P -c "select coalesce(bool_or(a::text like '=X%'), false) from pg_proc, unnest(proacl) a where proname='academy_verify_certificate'")" "f"

echo "--- NEGATIVE CONTROL: facies row absent"
P -c "update public.academy_apps set name = s.name from snap s where s.slug = academy_apps.slug; delete from public.academy_certifications where app_slug='facies'; delete from public.academy_apps where slug='facies';"
before=$(P -c "select md5(string_agg(slug||name, ',' order by slug)) from public.academy_apps")
if out=$(P -1 < "$MIG" 2>&1); then echo "FAIL control: the file passed without the facies row"; fail=1
else echo "    $(echo "$out" | grep -o 'ERROR.*')"; echo "PASS control raised"; fi
check "control left the catalog untouched" "$(P -c "select md5(string_agg(slug||name, ',' order by slug)) from public.academy_apps")" "$before"

[ $fail = 0 ] && echo "ALL CHECKS PASSED" || { echo "SOME CHECKS FAILED"; exit 1; }
