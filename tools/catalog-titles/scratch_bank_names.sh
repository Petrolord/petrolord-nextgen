#!/usr/bin/env bash
# =============================================================================
# SCRATCH DRY RUN for migrations/20261105_catalog_bank_course_names.sql.
#
# A local Postgres 16 in its own container (bank-names-scratch), removed at the
# end. No production access. It replays, in file order, every migration that
# writes the question banks of the five courses the recut touches (deep seeds,
# B3 and DG recuts, the B4 length and fix files, the round-off banks, W6), so
# the rows it starts from are the rows those applied files leave. Every one of
# their own guards runs and must pass. Then it proves:
#
#   1. the recut updates exactly the 21 rows in RECUT.json, each to its NEW
#      text, and no other question row changes;
#   2. a second run updates nothing and leaves the table byte-identical;
#   3. NEGATIVE CONTROL: one target row given a third text makes the file raise
#      and, run in one transaction, leaves the table untouched.
#
# Usage: tools/catalog-titles/scratch_bank_names.sh          run the proof
#        tools/catalog-titles/scratch_bank_names.sh --dump F  replay only, write
#            the served rows of the five courses to F (gen_recut.py's input)
# =============================================================================
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
REPO=$(cd "$HERE/../.." && pwd)
MIG=$REPO/migrations/20261105_catalog_bank_course_names.sql
RECUT=$REPO/docs/bank-course-names-recut/RECUT.json
C=${SCRATCH:-bank-names-scratch}
trap 'docker rm -f $C >/dev/null 2>&1 || true' EXIT
REPLAY="
  20260823_dc5_welldata_beginner_deep.sql
  20260824_dc10_rockphysics_beginner_deep.sql
  20260824_dc10_rockphysics_bank_reseed.sql
  20260824_dc12_earthmodel_beginner_deep.sql
  20260824_dc14_welldata_professional_deep.sql
  20260824_dc17_welldata_expert_deep.sql
  20260825_dc24_rockphysics_professional_deep.sql
  20260825_dc25_rockphysics_expert_deep.sql
  20260825_dc28_earthmodel_professional_deep.sql
  20260825_dc29_earthmodel_expert_deep.sql
  20261004_h2_hygiene_beginner_deep.sql
  20261004_h2_hygiene_intermediate_deep.sql
  20261004_h2_hygiene_advanced_deep.sql
  20261011_rf_refinery_beginner_deep.sql
  20261011_rf_refinery_intermediate_deep.sql
  20261011_rf_refinery_advanced_deep.sql
  20261015_b3_recut_refinery_intermediate.sql
  20261015_dg_recut_refinery.sql
  20261020_b4_len_earthmodel.sql
  20261020_b4_len_rockphysics.sql
  20261020_b4_len_welldata.sql
  20261021b_b4_fix_earthmodel.sql
  20261021b_b4_fix_rockphysics.sql
  20261021b_b4_fix_welldata.sql
  20261023a_ro_bank_earthmodel.sql
  20261023a_ro_bank_hygiene.sql
  20261029_w6_rockphysics.sql
"
docker rm -f $C >/dev/null 2>&1 || true
docker run -d --name $C -e POSTGRES_PASSWORD=scratch postgres:16-alpine >/dev/null
until docker exec $C pg_isready -U postgres >/dev/null 2>&1; do sleep 1; done
sleep 2
P() { docker exec -i $C psql -U postgres -v ON_ERROR_STOP=1 -q "$@"; }
SEED=$(node -e '
const fs=require("fs"),path=require("path");const d=process.argv[1];const n={};
for(const f of fs.readdirSync(d).filter(f=>f.endsWith(".sql")).sort()){
  const s=fs.readFileSync(path.join(d,f),"utf8");
  const re=/insert into public\.academy_apps\s*\(([^)]*)\)\s*values([\s\S]*?)(on conflict[^;]*;|;)/gi;let m;
  while((m=re.exec(s)))for(const r of m[2].matchAll(/\(\s*\x27([a-z0-9_]+)\x27\s*,\s*\x27((?:[^\x27]|\x27\x27)*)\x27/g))if(!(r[1] in n))n[r[1]]=r[2];}
let i=0;console.log(Object.entries(n).map(([s,v])=>`(\x27${s}\x27,\x27${v}\x27,\x27x\x27,${++i})`).join(",\n"));' "$REPO/migrations")
P <<SQL
create table public.academy_apps (slug text primary key, name text not null, module text not null, path_order int not null,
  status text not null default 'coming_soon', prereq_slug text, bonus_tiers text[] default '{}', school text default 'subsurface');
insert into public.academy_apps (slug, name, module, path_order) values
$SEED;
create table public.academy_capstones (app_slug text not null, tier text not null, cert_tier text not null, dataset text not null,
  title text not null, prompt text not null, fields jsonb not null, active boolean not null default true, primary key (app_slug, tier));
SQL
sed -n '/^create table if not exists public.academy_course_structures/,/^);/p;/^create table if not exists public.academy_quiz_questions/,/^);/p' \
  "$REPO/migrations/20260822_dc1_deep_course_chassis.sql" | P
for f in $REPLAY; do
  P -1 -f - < "$REPO/migrations/$f" >/dev/null 2>&1 || { echo "REPLAY FAILED: $f"; exit 1; }
done
echo "replayed $(echo $REPLAY | wc -w) migrations, every guard passed"
Q() { docker exec -i $C psql -U postgres -tAc "$1"; }
if [ "${1:-}" = "--dump" ]; then
  Q "select coalesce(json_agg(json_build_object('app_slug',app_slug,'tier',tier,'scope',scope,'module_key',module_key,'ord',ord,'prompt',prompt,'options',options,'answer_index',answer_index,'explanation',explanation,'active',active) order by app_slug,tier,scope,module_key,ord),'[]') from academy_quiz_questions" > "$2"
  echo "served rows written to $2"; exit 0
fi

TABLE_MD5="select md5(string_agg(id::text||prompt||options::text||answer_index||coalesce(explanation,'')||active, '|' order by id)) from public.academy_quiz_questions"
Q "create table snap as select * from public.academy_quiz_questions" >/dev/null
fail=0
check() { if [ "$2" = "$3" ]; then echo "PASS $1"; else echo "FAIL $1: got [$2] want [$3]"; fail=1; fi; }

echo "--- run 1"; P -1 -f - < "$MIG" 2>&1 | sed 's/^/    /'
check "rows changed" "$(Q "select count(*) from public.academy_quiz_questions a join snap s using (id) where (a.prompt, a.options, a.answer_index, a.explanation) is distinct from (s.prompt, s.options, s.answer_index, s.explanation)")" "21"
# every changed row equals its NEW text in RECUT.json
docker cp "$RECUT" $C:/tmp/recut.json
check "every changed row carries its recut text" "$(Q "
  with r as (select e->'new' n from jsonb_array_elements(pg_read_file('/tmp/recut.json')::jsonb) e)
  select count(*) from r join public.academy_quiz_questions a
    on a.app_slug = n->>'app_slug' and a.tier = n->>'tier' and a.scope = n->>'scope'
   and a.module_key is not distinct from n->>'module_key' and a.ord = (n->>'ord')::int and a.active
   and a.prompt = n->>'prompt' and a.options = n->'options' and a.answer_index = (n->>'answer_index')::int
   and a.explanation = n->>'explanation'")" "21"
check "answer indexes unchanged" "$(Q "select count(*) from public.academy_quiz_questions a join snap s using (id) where a.answer_index <> s.answer_index or a.ord <> s.ord or a.active <> s.active")" "0"
after1=$(Q "$TABLE_MD5")
echo "--- run 2 (idempotency)"; P -1 -f - < "$MIG" 2>&1 | sed 's/^/    /'
check "second run changes nothing" "$(Q "$TABLE_MD5")" "$after1"

echo "--- NEGATIVE CONTROL: a target row carries a third text"
Q "update public.academy_quiz_questions set prompt = prompt || ' (edited elsewhere)' where app_slug = 'welldata' and tier = 'beginner' and scope = 'final' and ord = 37 and active" >/dev/null
Q "update public.academy_quiz_questions a set prompt = s.prompt, options = s.options, explanation = s.explanation from snap s where s.id = a.id and s.app_slug <> 'welldata'" >/dev/null
before=$(Q "$TABLE_MD5")
if out=$(P -1 -f - < "$MIG" 2>&1); then echo "FAIL control: the file passed on a tampered row"; fail=1
else echo "    $(echo "$out" | grep -o 'ERROR.*')"; echo "PASS control raised"; fi
check "control left the table untouched" "$(Q "$TABLE_MD5")" "$before"

[ $fail = 0 ] && echo "ALL CHECKS PASSED" || { echo "SOME CHECKS FAILED"; exit 1; }
