#!/usr/bin/env bash
# LOCAL SCRATCH REPLAY (no production access). A Postgres 16 container of our own
# (ec45-recut-scratch, removed on exit) replays, in file order, every migration that
# writes the decision (EC4) and portfolio (EC5) question banks, capstones and course
# structures, each with its own guards, then dumps the served rows to JSON in OUT:
# questions.json, capstones.json, structures.json. Adapted from the EC7 PIA recut.
set -uo pipefail
NG=${NG:-/root/wt-ec45-recut}; OUT=${OUT:-/root/cat-wip-ec45/live}
C=ec45-recut-scratch
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
create table public.academy_capstones (app_slug text not null, tier text not null, cert_tier text not null, dataset text not null,
  title text not null, prompt text not null, fields jsonb not null, active boolean not null default true, primary key (app_slug, tier));
SQL
sed -n '/^create table if not exists public.academy_course_structures/,/^);/p;/^create table if not exists public.academy_quiz_questions/,/^);/p' \
  "$NG/migrations/20260822_dc1_deep_course_chassis.sql" | P
# W1 SENTINELS. The W3 files guard on three W1 (20261024*) rows of OTHER courses
# (seismolord, mbal, basin), which production carries; the scratch holds only
# placeholder rows with those keys so the guard reads W1 as applied. No decision
# or portfolio row is touched by W1 (grep of 20261024*).
P <<SQL
insert into public.academy_capstones (app_slug, tier, cert_tier, dataset, title, prompt, fields) values
 ('seismolord','intermediate','x','x','x','sentinel','[{"key":"corr_zero_lag"}]'),
 ('mbal','beginner','x','x','x','sentinel','[{"key":"eo_last_rb_stb"}]'),
 ('basin','beginner','x','x','x','Open book sentinel','[]');
SQL
for f in 20260916_ec4_decision_course.sql 20260916_ec4_decision_beginner_deep.sql 20260916_ec4_decision_intermediate_deep.sql \
  20260916_ec4_decision_advanced_deep.sql 20260916_ec4_decision_go_live.sql \
  20260917_ec5_portfolio_course.sql 20260917_ec5_portfolio_beginner_deep.sql 20260917_ec5_portfolio_intermediate_deep.sql \
  20260917_ec5_portfolio_advanced_deep.sql 20260917_ec5_portfolio_go_live.sql \
  20261015_dg_recut_portfolio.sql 20261021b_b4_fix_decision.sql 20261026_w3_decision.sql 20261026_w3_portfolio.sql; do
  if P < "$NG/migrations/$f" > "$OUT/replay_$f.log" 2>&1; then echo "OK   $f"; else echo "FAIL $f: $(grep -m1 ERROR "$OUT/replay_$f.log")"; fi
done
P -At -c "select json_agg(q order by app_slug, tier, scope, module_key nulls last, ord) from (select app_slug,tier,scope,module_key,ord,prompt,options,answer_index,explanation from public.academy_quiz_questions where active and app_slug in ('decision','portfolio')) q" > "$OUT/questions.json"
P -At -c "select json_agg(c order by app_slug, tier) from (select * from public.academy_capstones where app_slug in ('decision','portfolio')) c" > "$OUT/capstones.json"
P -At -c "select json_agg(s) from (select * from public.academy_course_structures where app_slug in ('decision','portfolio')) s" > "$OUT/structures.json" 2>/dev/null || true
P -At -c "select app_slug, tier, scope, count(*) from public.academy_quiz_questions where active group by 1,2,3 order by 1,2,3"
