#!/usr/bin/env bash
# =============================================================================
# EC7 PIA RECUT: LOCAL SCRATCH DRY RUN of migrations/20261108_ec7_pia_recut_cashflow_fiscal.sql.
# No production access. A Postgres 16 container of our own (ec7-pia-scratch, removed on
# exit) is seeded by REPLAYING, in file order and each with its own guards, every applied
# migration that writes the cashflow and fiscal question banks and capstones (the deep
# seeds, the EC1/EC2 recuts and their assertions, the digest-copy and B4 fixes, the B5
# tolerance file restricted to its cashflow row (its separation and completion rows need
# courses this seed does not carry), the round-off tolerances and the W3 fiscal brief).
# Then, per run:
#   1. the served rows before the recut must equal the manifests' OLD text (the generator's
#      input), and one planted capstone attempt and certification on each course;
#   2. APPLY 1 inside one transaction: must succeed; the served rows must equal the
#      manifests' NEW text and nothing else may move;
#   3. APPLY 2: must succeed and change nothing (table digest identical);
#   4. NEGATIVE CONTROL: one target question given a third text, the file run in a
#      transaction must raise, and the table must be byte-identical afterwards;
#   5. a second NEGATIVE CONTROL on the Expert capstone prompt.
# Usage: bash dryrun_ec7.sh      (worktree = the repository this file sits in)
# =============================================================================
set -uo pipefail
HERE=$(cd "$(dirname "$0")" && pwd); NG=${NG:-$(cd "$HERE/../../.." && pwd)}
MIG="$NG/migrations/20261108_ec7_pia_recut_cashflow_fiscal.sql"
C=${SCRATCH:-ec7-pia-scratch}
W=$(mktemp -d /tmp/ec7-dryrun-XXXXXX)
trap 'docker rm -f $C >/dev/null 2>&1 || true; rm -rf "$W"' EXIT
docker rm -f $C >/dev/null 2>&1 || true
docker run -d --name $C -e POSTGRES_PASSWORD=scratch postgres:16-alpine >/dev/null
until docker exec $C pg_isready -U postgres >/dev/null 2>&1; do sleep 1; done; sleep 2
P() { docker exec -i $C psql -U postgres -v ON_ERROR_STOP=1 -q "$@"; }
fail=0
P <<'SQL'
create table public.academy_apps (slug text primary key, name text not null default 'x', module text not null default 'x', path_order int not null default 0,
  status text not null default 'coming_soon', prereq_slug text, bonus_tiers text[] default '{}', school text default 'subsurface',
  suite_app_slug text, description text, tagline text, hero_skill text, fee_ngn int, fee_usd int, is_engine_course boolean);
insert into public.academy_apps (slug, name, module, path_order) values ('cashflow','Cash Flow & NPV','economics',1),('fiscal','Fiscal Regime Design','economics',2);
create table public.academy_capstones (app_slug text not null, tier text not null, cert_tier text not null, dataset text not null,
  title text not null, prompt text not null, fields jsonb not null, active boolean not null default true, primary key (app_slug, tier));
create table public.academy_capstone_attempts (id uuid primary key default gen_random_uuid(), user_id uuid not null, app_slug text not null,
  tier text not null, score integer not null, max_score integer not null, passed boolean not null, answers jsonb, created_at timestamptz not null default now());
create table public.academy_certifications (id uuid primary key default gen_random_uuid(), user_id uuid not null, app_slug text not null,
  tier text not null, certificate_number text not null, issued_at timestamptz not null default now());
create table public.academy_enrollments (id uuid primary key default gen_random_uuid(), user_id uuid, app_slug text, tier text);
SQL
sed -n '/^create table if not exists public.academy_course_structures/,/^);/p;/^create table if not exists public.academy_quiz_questions/,/^);/p' \
  "$NG/migrations/20260822_dc1_deep_course_chassis.sql" | P
grep -v "^      ('separation'\|^      ('completion'" "$NG/migrations/20261022_b5_graded_tolerances.sql" \
  | sed "s/('cashflow',   'intermediate', 'jv_breakeven_oil_price_usd_bbl', 0.001::float8,      0.005::float8,   66.10100889205933::float8),/('cashflow',   'intermediate', 'jv_breakeven_oil_price_usd_bbl', 0.001::float8,      0.005::float8,   66.10100889205933::float8)/" \
  > "$W/b5_cashflow_only.sql"
for f in 20260908_ec1_cashflow_course.sql 20260908_ec1_cashflow_beginner_deep.sql 20260908_ec1_cashflow_intermediate_deep.sql \
  20260908_ec1_cashflow_advanced_deep.sql 20260908_ec1_cashflow_go_live.sql \
  20260913_ec2_fiscal_course.sql 20260913_ec2_fiscal_beginner_deep.sql 20260913_ec2_fiscal_intermediate_deep.sql \
  20260913_ec2_fiscal_advanced_deep.sql 20260913_ec2_fiscal_go_live.sql 20260914_ec2_share_state_banks.sql \
  20260915_ec2_metric_names.sql 20260920_ec1_recut_cashflow_capstone.sql 20260920_ec2_recut_fiscal_capstone.sql \
  20260921_ec1_recut_cashflow_beginner.sql 20260921_ec1_recut_cashflow_intermediate.sql 20260921_ec1_recut_cashflow_advanced.sql \
  20260921_ec2_recut_fiscal_beginner.sql 20260921_ec2_recut_fiscal_intermediate.sql 20260921_ec2_recut_fiscal_advanced.sql \
  20260921_ec12_recut_assertions.sql 20261015_dg_recut_cashflow.sql 20261021b_b4_fix_cashflow.sql \
  B5 20261023c_ro_fiscal_tolerances.sql W1 20261026_w3_fiscal.sql; do
  if [ "$f" = W1 ]; then
    # W3 checks that the W1 wave (20261024*) is applied by three marker rows of OTHER courses;
    # the stand-ins below carry exactly those markers and nothing else of those courses.
    P <<'SQL'
insert into public.academy_capstones (app_slug, tier, cert_tier, dataset, title, prompt, fields) values
  ('seismolord', 'intermediate', 'professional', 'stand-in', 'stand-in', 'stand-in', '[{"key": "corr_zero_lag"}]'),
  ('mbal', 'beginner', 'associate', 'stand-in', 'stand-in', 'stand-in', '[{"key": "eo_last_rb_stb"}]'),
  ('basin', 'beginner', 'associate', 'stand-in', 'stand-in', 'Open book stand-in', '[]');
SQL
    echo "seed ok    W1 markers (three stand-in rows for other courses, as 20261026_w3_fiscal.sql checks)"; continue
  fi
  src="$NG/migrations/$f"; [ "$f" = B5 ] && { src="$W/b5_cashflow_only.sql"; f="20261022_b5_graded_tolerances.sql (cashflow row)"; }
  if P < "$src" > "$W/replay.log" 2>&1; then echo "seed ok    $f"; else echo "SEED FAIL  $f: $(grep -m1 ERROR "$W/replay.log")"; fail=1; fi
done
[ $fail = 0 ] || { echo "DRY RUN: the seed replay failed"; exit 1; }
# one planted attempt and certification per course on the tiers whose grading moves
P <<'SQL'
insert into public.academy_capstone_attempts (user_id, app_slug, tier, score, max_score, passed, answers)
values (gen_random_uuid(), 'cashflow', 'advanced', 6, 6, true, '{"pia_npv_real_usd": -46086957}'),
       (gen_random_uuid(), 'fiscal', 'beginner', 5, 6, true, '{"con_payback_year_cum_ncf_musd": 14.7405}');
insert into public.academy_certifications (user_id, app_slug, tier, certificate_number)
values (gen_random_uuid(), 'cashflow', 'expert', 'PLA-SCRATCH-1'), (gen_random_uuid(), 'fiscal', 'associate', 'PLA-SCRATCH-2');
SQL
DIGEST="select md5(coalesce((select string_agg(md5(q::text), ',' order by q.app_slug, q.tier, q.scope, q.module_key, q.ord) from (select app_slug, tier, scope, module_key, ord, prompt, options, answer_index, explanation, active from public.academy_quiz_questions where app_slug in ('cashflow','fiscal')) q), '') || coalesce((select string_agg(md5(c::text), ',' order by c.app_slug, c.tier) from public.academy_capstones c where app_slug in ('cashflow','fiscal')), '') || coalesce((select string_agg(md5(a::text), ',' order by a.id) from public.academy_capstone_attempts a), '') || coalesce((select string_agg(md5(x::text), ',' order by x.id) from public.academy_certifications x), ''))"
dump() {
  P -At -c "select json_agg(q order by app_slug, tier, scope, module_key nulls last, ord) from (select app_slug,tier,scope,module_key,ord,prompt,options,answer_index,explanation from public.academy_quiz_questions where active and app_slug in ('cashflow','fiscal')) q" > "$W/$1_q.json"
  P -At -c "select json_agg(c order by app_slug, tier) from (select app_slug,tier,cert_tier,title,dataset,prompt,fields from public.academy_capstones where app_slug in ('cashflow','fiscal')) c" > "$W/$1_c.json"
}
check() {  # phase: old | new
  python3 - "$NG" "$W/$1_q.json" "$W/$1_c.json" "$1" "$W/old_q.json" <<'PY'
import json, sys
ng, qf, cf, phase, beforef = sys.argv[1:]
Q = {(r['app_slug'], r['tier'], r['scope'], r['module_key'], r['ord']): r for r in json.load(open(qf))}
B = {(r['app_slug'], r['tier'], r['scope'], r['module_key'], r['ord']): r for r in json.load(open(beforef))}
F = ('prompt', 'options', 'answer_index', 'explanation')
bad = 0; touched = set()
for c in ('cashflow', 'fiscal'):
    d = json.load(open(f'{ng}/docs/pia-recut/{c}_edits.json'))
    for e in d['questions']:
        k = (c, e['tier'], e['scope'], e['module_key'], e['ord']); touched.add(k)
        if any(Q[k][f] != e[phase][f] for f in F): bad += 1; print('  MISMATCH', phase, k)
if phase == 'new':
    moved = [k for k in Q if k not in touched and any(Q[k][f] != B[k][f] for f in F)]
    if moved: bad += len(moved); print('  UNEXPECTED MOVE', moved[:5])
counts = {}
for k in Q: counts[(k[0], k[1])] = counts.get((k[0], k[1]), 0) + 1
if any(v != 132 for v in counts.values()) or len(counts) != 6: bad += 1; print('  COUNTS', counts)
caps = {(c['app_slug'], c['tier']): c for c in json.load(open(cf))}
cfe = json.load(open(f'{ng}/docs/pia-recut/cashflow_edits.json'))
for x in cfe['capstones']:
    got = caps[('cashflow', x['tier'])]
    for k in ('prompt', 'dataset', 'title'):
        if got[k] != x[phase][k]: bad += 1; print('  CAPSTONE', x['tier'], k)
    if [(f['key'], f['label'], f['unit'], float(f['expected']), float(f['tol'])) for f in got['fields']] != \
       [(f['key'], f['label'], f['unit'], float(f['expected']), float(f['tol'])) for f in x[phase]['fields']]: bad += 1; print('  CAPSTONE FIELDS', x['tier'])
fe = json.load(open(f'{ng}/docs/pia-recut/fiscal_edits.json'))
fa = caps[('fiscal', 'advanced')]
if fa['prompt'] != fe['capstone_prompt_changes'][0][phase]: bad += 1; print('  FISCAL PROMPT')
g = fe['graded_field_changes'][0]
t = [f for f in caps[('fiscal', g['tier'])]['fields'] if f['key'] == g['key']][0]
if float(t['tol']) != (g['old_tol'] if phase == 'old' else g['new_tol']) or float(t['expected']) != g['expected']: bad += 1; print('  FISCAL TOL', t)
print(f"  served rows vs manifests ({phase}): {'MATCH' if bad == 0 else f'{bad} PROBLEM(S)'}")
sys.exit(1 if bad else 0)
PY
}
dump old; check old || fail=1
d0=$(P -At -c "$DIGEST")
{ echo "begin;"; cat "$MIG"; echo; echo "commit;"; } > "$W/apply.sql"
if P < "$W/apply.sql" > "$W/apply1.log" 2>&1; then echo "APPLY 1 ok: $(grep -c 'NOTICE' "$W/apply1.log") notices"; grep NOTICE "$W/apply1.log" | sed 's/^.*NOTICE:  /  /'; else echo "APPLY 1 FAILED: $(grep -m1 ERROR "$W/apply1.log")"; fail=1; fi
dump new; check new || fail=1
d1=$(P -At -c "$DIGEST")
if P < "$W/apply.sql" > "$W/apply2.log" 2>&1; then
  d2=$(P -At -c "$DIGEST")
  [ "$d1" = "$d2" ] && echo "APPLY 2 (idempotence): ok, the database is byte-identical ($d2)" || { echo "APPLY 2 CHANGED THE DATABASE"; fail=1; }
  grep NOTICE "$W/apply2.log" | grep -E 'updated|capstone|tolerance' | sed 's/^.*NOTICE:  /  /'
else echo "APPLY 2 FAILED: $(grep -m1 ERROR "$W/apply2.log")"; fail=1; fi
[ "$d0" != "$d1" ] || { echo "APPLY 1 changed nothing"; fail=1; }
# NEGATIVE CONTROLS on the recut state: a third text on one target question, then on the Expert
# capstone prompt; the file must raise and leave the table byte-identical.
KEY=$(python3 -c "import json;q=json.load(open('$NG/docs/pia-recut/fiscal_edits.json'))['questions'][0];print(q['tier'],q['scope'],q['module_key'] or '',q['ord'])")
set -- $KEY; T=$1; S=$2; MK=${4:+$3}; O=${4:-$3}
P -c "update public.academy_quiz_questions set prompt = prompt || ' (planted third text)' where app_slug = 'fiscal' and tier = '$T' and scope = '$S' and module_key is not distinct from nullif('$MK','') and ord = $O"
dn=$(P -At -c "$DIGEST")
if P < "$W/apply.sql" > "$W/neg1.log" 2>&1; then echo "NEGATIVE CONTROL 1 DID NOT RAISE"; fail=1
else
  da=$(P -At -c "$DIGEST")
  [ "$dn" = "$da" ] && echo "NEGATIVE CONTROL 1 (fiscal/$T/$S${MK:+/$MK}/ord $O given a third text): raised as it must, table untouched: $(grep -m1 -o 'ec7 pia recut refused[^"]*' "$W/neg1.log")" || { echo "NEGATIVE CONTROL 1 raised but the table moved"; fail=1; }
fi
P -c "update public.academy_quiz_questions set prompt = replace(prompt, ' (planted third text)', '') where app_slug = 'fiscal' and tier = '$T' and scope = '$S' and module_key is not distinct from nullif('$MK','') and ord = $O"
P -c "update public.academy_capstones set prompt = prompt || ' x' where app_slug = 'cashflow' and tier = 'advanced'"
dn=$(P -At -c "$DIGEST")
if P < "$W/apply.sql" > "$W/neg2.log" 2>&1; then echo "NEGATIVE CONTROL 2 DID NOT RAISE"; fail=1
else
  da=$(P -At -c "$DIGEST")
  [ "$dn" = "$da" ] && echo "NEGATIVE CONTROL 2 (cashflow Expert capstone prompt given a third text): raised as it must, table untouched: $(grep -m1 -o 'ec7 pia recut refused[^"]*' "$W/neg2.log")" || { echo "NEGATIVE CONTROL 2 raised but the table moved"; fail=1; }
fi
[ $fail = 0 ] && echo "DRY RUN OK: seed replay, apply, idempotent re-apply, two negative controls" || { echo "DRY RUN FAILED"; exit 1; }
