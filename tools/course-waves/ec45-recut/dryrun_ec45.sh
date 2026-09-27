#!/usr/bin/env bash
# =============================================================================
# EC45 RECUT: LOCAL SCRATCH DRY RUN of
#   migrations/20261113_ec45_recut_decision_portfolio_joa.sql
# No production access. A Postgres 16 container of our own (removed on exit) is
# seeded by REPLAYING, in file order and each with its own guards, every applied
# migration that writes the decision, portfolio and joa question banks and
# capstones (the list replay_banks.sh uses, plus the five EC9 joa files).
#
#   W3=post (default)  the seed includes 20261026_w3_decision and _w3_portfolio
#                      (production after W3)
#   W3=pre             the seed stops before W3 (production without W3); after
#                      the recut, the two W3 files are applied on top and must
#                      still pass, then the recut re-runs as a no-op
#
# Then, per run:
#   1. the served rows before the recut must equal the manifests' OLD text
#      (321 question rows, the two Expert dataset lines, the prompt in the W3
#      form the mode names); one planted capstone attempt and certification on
#      each course;
#   2. APPLY 1 inside one transaction: must succeed; the served rows must equal
#      the manifests' NEW text and nothing else in the three courses may move
#      (every other question field, capstone prompt, title and field);
#   3. APPLY 2: must succeed and change nothing (database digest identical);
#   4. NEGATIVE CONTROLS on the recut state: a third text on one decision
#      question, one joa question and the portfolio Expert prompt; each time the
#      file must raise naming the row and leave the database byte-identical.
# Usage: W3=pre|post bash dryrun_ec45.sh     (worktree = the repository this file sits in)
# =============================================================================
set -uo pipefail
HERE=$(cd "$(dirname "$0")" && pwd); NG=${NG:-$(cd "$HERE/../../.." && pwd)}
W3=${W3:-post}
case "$W3" in pre|post) ;; *) echo "W3 must be pre or post"; exit 2 ;; esac
MIG="$NG/migrations/20261113_ec45_recut_decision_portfolio_joa.sql"
C=${SCRATCH:-ec45-recut-dryrun-$W3}
W=$(mktemp -d /tmp/ec45-dryrun-XXXXXX)
trap 'docker rm -f $C >/dev/null 2>&1 || true; rm -rf "$W"' EXIT
docker rm -f $C >/dev/null 2>&1 || true
docker run -d --name $C -e POSTGRES_PASSWORD=scratch postgres:16-alpine >/dev/null
until docker exec $C pg_isready -U postgres >/dev/null 2>&1; do sleep 1; done; sleep 2
P() { docker exec -i $C psql -U postgres -v ON_ERROR_STOP=1 -q "$@"; }
fail=0
echo "EC45 recut dry run, seed state: $W3-W3"
grep -qiE '^\s*(begin|commit|rollback)\s*;|start transaction' "$MIG" && { echo "the migration carries its own transaction line"; exit 1; }
P <<'SQL'
create table public.academy_apps (slug text primary key, name text not null default 'x', module text not null default 'x', path_order int not null default 0,
  status text not null default 'coming_soon', prereq_slug text, bonus_tiers text[] default '{}', school text default 'subsurface',
  suite_app_slug text, description text, tagline text, hero_skill text, fee_ngn int, fee_usd int, is_engine_course boolean);
create table public.academy_capstones (app_slug text not null, tier text not null, cert_tier text not null, dataset text not null,
  title text not null, prompt text not null, fields jsonb not null, active boolean not null default true, primary key (app_slug, tier));
create table public.academy_capstone_attempts (id uuid primary key default gen_random_uuid(), user_id uuid not null, app_slug text not null,
  tier text not null, score integer not null, max_score integer not null, passed boolean not null, answers jsonb, created_at timestamptz not null default now());
create table public.academy_certifications (id uuid primary key default gen_random_uuid(), user_id uuid not null, app_slug text not null,
  tier text not null, certificate_number text not null, issued_at timestamptz not null default now());
-- W1 SENTINELS: the W3 files guard on three W1 (20261024*) rows of OTHER courses,
-- which production carries; these stand-ins carry exactly those markers.
insert into public.academy_capstones (app_slug, tier, cert_tier, dataset, title, prompt, fields) values
 ('seismolord','intermediate','x','x','x','sentinel','[{"key":"corr_zero_lag"}]'),
 ('mbal','beginner','x','x','x','sentinel','[{"key":"eo_last_rb_stb"}]'),
 ('basin','beginner','x','x','x','Open book sentinel','[]');
SQL
sed -n '/^create table if not exists public.academy_course_structures/,/^);/p;/^create table if not exists public.academy_quiz_questions/,/^);/p' \
  "$NG/migrations/20260822_dc1_deep_course_chassis.sql" | P
SEEDS="20260916_ec4_decision_course.sql 20260916_ec4_decision_beginner_deep.sql 20260916_ec4_decision_intermediate_deep.sql
  20260916_ec4_decision_advanced_deep.sql 20260916_ec4_decision_go_live.sql
  20260917_ec5_portfolio_course.sql 20260917_ec5_portfolio_beginner_deep.sql 20260917_ec5_portfolio_intermediate_deep.sql
  20260917_ec5_portfolio_advanced_deep.sql 20260917_ec5_portfolio_go_live.sql
  20261015_dg_recut_portfolio.sql 20261021b_b4_fix_decision.sql"
W3FILES="20261026_w3_decision.sql 20261026_w3_portfolio.sql"
JOA="20261110_ec9_joa_course.sql 20261110_ec9_joa_beginner_deep.sql 20261110_ec9_joa_intermediate_deep.sql
  20261110_ec9_joa_advanced_deep.sql 20261110_ec9_joa_go_live.sql"
[ "$W3" = post ] && SEEDS="$SEEDS $W3FILES"
for f in $SEEDS $JOA; do
  if P < "$NG/migrations/$f" > "$W/replay.log" 2>&1; then echo "seed ok    $f"; else echo "SEED FAIL  $f: $(grep -m1 ERROR "$W/replay.log")"; fail=1; fi
done
[ $fail = 0 ] || { echo "DRY RUN: the seed replay failed"; exit 1; }
P <<'SQL'
insert into public.academy_capstone_attempts (user_id, app_slug, tier, score, max_score, passed, answers)
values (gen_random_uuid(), 'decision', 'advanced', 6, 6, true, '{"ab_three_reading_evii_musd": 1}'),
       (gen_random_uuid(), 'portfolio', 'advanced', 5, 6, true, '{"id_operator_billed_usd": 4714867}'),
       (gen_random_uuid(), 'joa', 'beginner', 6, 6, true, '{"x": 1}');
insert into public.academy_certifications (user_id, app_slug, tier, certificate_number)
values (gen_random_uuid(), 'decision', 'expert', 'PLA-SCRATCH-1'), (gen_random_uuid(), 'portfolio', 'expert', 'PLA-SCRATCH-2'),
       (gen_random_uuid(), 'joa', 'associate', 'PLA-SCRATCH-3');
SQL
DIGEST="select md5(coalesce((select string_agg(md5(q::text), ',' order by q.app_slug, q.tier, q.scope, q.module_key, q.ord) from (select app_slug, tier, scope, module_key, ord, prompt, options, answer_index, explanation, active from public.academy_quiz_questions) q), '') || coalesce((select string_agg(md5(c::text), ',' order by c.app_slug, c.tier) from public.academy_capstones c), '') || coalesce((select string_agg(md5(a::text), ',' order by a.id) from public.academy_capstone_attempts a), '') || coalesce((select string_agg(md5(x::text), ',' order by x.id) from public.academy_certifications x), '') || coalesce((select string_agg(md5(s::text), ',' order by s.app_slug, s.tier) from public.academy_course_structures s), '') || coalesce((select string_agg(md5(p::text), ',' order by p.slug) from public.academy_apps p), ''))"
dump() {
  P -At -c "select json_agg(q order by app_slug, tier, scope, module_key nulls last, ord) from (select app_slug,tier,scope,module_key,ord,prompt,options,answer_index,explanation from public.academy_quiz_questions where active and app_slug in ('decision','portfolio','joa')) q" > "$W/$1_q.json"
  P -At -c "select json_agg(c order by app_slug, tier) from (select app_slug,tier,cert_tier,title,dataset,prompt,fields,active from public.academy_capstones where app_slug in ('decision','portfolio','joa')) c" > "$W/$1_c.json"
}
check() {  # phase: old | new
  python3 - "$HERE" "$W" "$1" "$W3" <<'PY'
import json, sys, hashlib
here, w, phase, w3 = sys.argv[1:]
sys.path.insert(0, here)
import gen_ec45_migration as G
Q = {(r['app_slug'], r['tier'], r['scope'], r['module_key'], r['ord']): r for r in json.load(open(f'{w}/{phase}_q.json'))}
C = {(r['app_slug'], r['tier']): r for r in json.load(open(f'{w}/{phase}_c.json'))}
F = ('prompt', 'options', 'answer_index', 'explanation')
bad = 0; touched = set()
for c, rows in G.ROWS.items():
    for t, s, m, o, old, new in rows:
        k = (c, t, s, m, o); touched.add(k)
        want = old if phase == 'old' else new
        if k not in Q or any(Q[k][f] != want[f] for f in F): bad += 1; print('  MISMATCH', phase, k)
for x in G.CAPS:
    got = C[(x['course'], x['tier'])]
    if got['dataset'] != (x['old'] if phase == 'old' else x['new']): bad += 1; print('  DATASET', x['course'])
    md5 = hashlib.md5(got['prompt'].encode()).hexdigest()
    if md5 != (x['pre_md5'] if w3 == 'pre' else x['post_md5']): bad += 1; print('  PROMPT FORM', x['course'], md5)
    if got['fields'] != x['fields'] or got['title'] != x['title'] or got['cert_tier'] != x['cert_tier']: bad += 1; print('  CAPSTONE HEAD', x['course'])
if phase == 'new':
    B = {(r['app_slug'], r['tier'], r['scope'], r['module_key'], r['ord']): r for r in json.load(open(f'{w}/old_q.json'))}
    BC = {(r['app_slug'], r['tier']): r for r in json.load(open(f'{w}/old_c.json'))}
    if set(B) != set(Q): bad += 1; print('  ROW SET MOVED')
    moved = [k for k in Q if k not in touched and Q[k] != B.get(k)]
    if moved: bad += len(moved); print('  UNEXPECTED MOVE', moved[:5])
    for k in C:
        a, b = dict(C[k]), dict(BC[k])
        a.pop('dataset'); b.pop('dataset')
        if a != b: bad += 1; print('  CAPSTONE MOVED', k)
        if C[k]['dataset'] != BC[k]['dataset'] and k not in {(x['course'], x['tier']) for x in G.CAPS}: bad += 1; print('  DATASET MOVED', k)
counts = {}
for k in Q: counts[(k[0], k[1])] = counts.get((k[0], k[1]), 0) + 1
if len(counts) != 9 or any(v != 132 for v in counts.values()): bad += 1; print('  COUNTS', counts)
print(f"  served rows vs manifests ({phase}, {w3}-W3): {'MATCH' if bad == 0 else f'{bad} PROBLEM(S)'} on {len(touched)} question rows and {len(G.CAPS)} capstones")
sys.exit(1 if bad else 0)
PY
}
dump old; check old || fail=1
d0=$(P -At -c "$DIGEST")
{ echo "begin;"; cat "$MIG"; echo; echo "commit;"; } > "$W/apply.sql"
if P < "$W/apply.sql" > "$W/apply1.log" 2>&1; then echo "APPLY 1 ok"; grep NOTICE "$W/apply1.log" | sed 's/^.*NOTICE:  /  /'; else echo "APPLY 1 FAILED: $(grep -m1 ERROR "$W/apply1.log")"; fail=1; fi
dump new; check new || fail=1
d1=$(P -At -c "$DIGEST")
[ "$d0" != "$d1" ] || { echo "APPLY 1 changed nothing"; fail=1; }
if P < "$W/apply.sql" > "$W/apply2.log" 2>&1; then
  d2=$(P -At -c "$DIGEST")
  [ "$d1" = "$d2" ] && echo "APPLY 2 (idempotence): ok, the database is byte-identical ($d2)" || { echo "APPLY 2 CHANGED THE DATABASE"; fail=1; }
  grep NOTICE "$W/apply2.log" | grep -E 'questions|capstone' | sed 's/^.*NOTICE:  /  /'
else echo "APPLY 2 FAILED: $(grep -m1 ERROR "$W/apply2.log")"; fail=1; fi
if [ "$W3" = pre ]; then
  # W3 after the recut: both W3 files must still apply, and the recut must then read as applied.
  for f in $W3FILES; do
    if P < "$NG/migrations/$f" > "$W/w3.log" 2>&1; then echo "W3 AFTER THE RECUT: $f applies ($(grep -o 'w3 [a-z]*: [^"]*' "$W/w3.log" | head -1))"; else echo "W3 AFTER THE RECUT FAILED: $f: $(grep -m1 ERROR "$W/w3.log")"; fail=1; fi
  done
  d3=$(P -At -c "$DIGEST")
  if P < "$W/apply.sql" > "$W/apply3.log" 2>&1; then
    d4=$(P -At -c "$DIGEST")
    [ "$d3" = "$d4" ] && echo "APPLY 3 (after W3, now post-W3 prompts): ok, a no-op" || { echo "APPLY 3 CHANGED THE DATABASE"; fail=1; }
  else echo "APPLY 3 FAILED: $(grep -m1 ERROR "$W/apply3.log")"; fail=1; fi
fi
neg() {  # label, plant sql, undo sql
  P -c "$2" >/dev/null
  dn=$(P -At -c "$DIGEST")
  if P < "$W/apply.sql" > "$W/neg.log" 2>&1; then echo "NEGATIVE CONTROL ($1) DID NOT RAISE"; fail=1
  else
    da=$(P -At -c "$DIGEST")
    [ "$dn" = "$da" ] && echo "NEGATIVE CONTROL ($1): raised as it must, database untouched: $(grep -m1 -o 'ec45 recut refused[^"]*' "$W/neg.log")" || { echo "NEGATIVE CONTROL ($1) raised but the database moved"; fail=1; }
  fi
  P -c "$3" >/dev/null
}
neg "decision advanced final ord 32 given a third text" \
  "update public.academy_quiz_questions set prompt = prompt || ' (planted)' where app_slug = 'decision' and tier = 'advanced' and scope = 'final' and ord = 32" \
  "update public.academy_quiz_questions set prompt = replace(prompt, ' (planted)', '') where app_slug = 'decision' and tier = 'advanced' and scope = 'final' and ord = 32"
neg "joa beginner final ord 4 given a third text" \
  "update public.academy_quiz_questions set explanation = explanation || ' (planted)' where app_slug = 'joa' and tier = 'beginner' and scope = 'final' and ord = 4" \
  "update public.academy_quiz_questions set explanation = replace(explanation, ' (planted)', '') where app_slug = 'joa' and tier = 'beginner' and scope = 'final' and ord = 4"
neg "portfolio Expert capstone prompt given a third text" \
  "update public.academy_capstones set prompt = prompt || ' x' where app_slug = 'portfolio' and tier = 'advanced'" \
  "update public.academy_capstones set prompt = left(prompt, length(prompt) - 2) where app_slug = 'portfolio' and tier = 'advanced'"
dz=$(P -At -c "$DIGEST")
[ "$W3" = pre ] && dref=${d4:-x} || dref=$d1
[ "$dz" = "$dref" ] || { echo "the negative controls did not restore the database"; fail=1; }
[ $fail = 0 ] && echo "DRY RUN OK ($W3-W3): seed replay, apply, idempotent re-apply$([ "$W3" = pre ] && echo ', W3 after the recut, no-op re-apply'), three negative controls" || { echo "DRY RUN FAILED ($W3-W3)"; exit 1; }
