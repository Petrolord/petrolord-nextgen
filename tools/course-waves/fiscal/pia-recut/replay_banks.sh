#!/usr/bin/env bash
# LOCAL SCRATCH REPLAY (no production access): a Postgres 16 container of our own
# (ec7-recut-scratch, removed on exit) replays, in file order, every migration that
# writes the cashflow and fiscal question banks and capstones, each with its own guards,
# then dumps the served rows to JSON: questions.json and capstones.json in OUT.
set -uo pipefail
NG=${NG:-/root/wt-ec7-recut}; OUT=${OUT:-/root/cat-wip-pia/recut/live}
C=ec7-recut-scratch
mkdir -p "$OUT"
trap 'docker rm -f $C >/dev/null 2>&1 || true' EXIT
docker rm -f $C >/dev/null 2>&1 || true
docker run -d --name $C -e POSTGRES_PASSWORD=scratch postgres:16-alpine >/dev/null
until docker exec $C pg_isready -U postgres >/dev/null 2>&1; do sleep 1; done; sleep 2
P() { docker exec -i $C psql -U postgres -v ON_ERROR_STOP=1 -q "$@"; }
P <<SQL
create table public.academy_apps (slug text primary key, name text not null default 'x', module text not null default 'x', path_order int not null default 0,
  status text not null default 'coming_soon', prereq_slug text, bonus_tiers text[] default '{}', school text default 'subsurface',
  suite_app_slug text, description text, tagline text, hero_skill text, fee_ngn int, fee_usd int, is_engine_course boolean);
insert into public.academy_apps (slug, name, module, path_order) values ('cashflow','Cash Flow & NPV','economics',1),('fiscal','Fiscal Regime Design','economics',2);
create table public.academy_capstones (app_slug text not null, tier text not null, cert_tier text not null, dataset text not null,
  title text not null, prompt text not null, fields jsonb not null, active boolean not null default true, primary key (app_slug, tier));
SQL
sed -n '/^create table if not exists public.academy_course_structures/,/^);/p;/^create table if not exists public.academy_quiz_questions/,/^);/p' \
  "$NG/migrations/20260822_dc1_deep_course_chassis.sql" | P
for f in 20260908_ec1_cashflow_course.sql 20260908_ec1_cashflow_beginner_deep.sql 20260908_ec1_cashflow_intermediate_deep.sql \
  20260908_ec1_cashflow_advanced_deep.sql 20260908_ec1_cashflow_go_live.sql \
  20260913_ec2_fiscal_course.sql 20260913_ec2_fiscal_beginner_deep.sql 20260913_ec2_fiscal_intermediate_deep.sql \
  20260913_ec2_fiscal_advanced_deep.sql 20260913_ec2_fiscal_go_live.sql 20260914_ec2_share_state_banks.sql \
  20260915_ec2_metric_names.sql 20260920_ec1_recut_cashflow_capstone.sql 20260920_ec2_recut_fiscal_capstone.sql \
  20260921_ec1_recut_cashflow_beginner.sql 20260921_ec1_recut_cashflow_intermediate.sql 20260921_ec1_recut_cashflow_advanced.sql \
  20260921_ec2_recut_fiscal_beginner.sql 20260921_ec2_recut_fiscal_intermediate.sql 20260921_ec2_recut_fiscal_advanced.sql \
  20260921_ec12_recut_assertions.sql 20261015_dg_recut_cashflow.sql 20261021b_b4_fix_cashflow.sql \
  20261023c_ro_fiscal_tolerances.sql 20261026_w3_fiscal.sql; do
  if P < "$NG/migrations/$f" > "$OUT/replay_$f.log" 2>&1; then echo "OK   $f"; else echo "FAIL $f: $(grep -m1 ERROR "$OUT/replay_$f.log")"; fi
done
P -At -c "select json_agg(q order by app_slug, tier, scope, module_key nulls last, ord) from (select app_slug,tier,scope,module_key,ord,prompt,options,answer_index,explanation from public.academy_quiz_questions where active and app_slug in ('cashflow','fiscal')) q" > "$OUT/questions.json"
P -At -c "select json_agg(c order by app_slug, tier) from (select * from public.academy_capstones where app_slug in ('cashflow','fiscal')) c" > "$OUT/capstones.json"
P -At -c "select app_slug, tier, count(*) from public.academy_quiz_questions where active group by 1,2 order by 1,2"
