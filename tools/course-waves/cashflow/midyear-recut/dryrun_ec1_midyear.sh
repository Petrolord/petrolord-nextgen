#!/usr/bin/env bash
# =============================================================================
# EC1 MID-YEAR RECUT: LOCAL SCRATCH DRY RUN of
# migrations/20261014090000_ec1_midyear_recut_cashflow.sql. No production access.
#
# A Postgres 16 container of our own (ec1-midyear-scratch, removed on exit) is
# seeded with the SERVED cashflow course: the 396 bank rows and three capstones
# as committed at BASE (nextgen d2f15b28f, matched row for row against a
# read-only production dump on 2026-10-14). One quiz attempt holding the ids of
# every row the recut changes, one capstone attempt on the Professional tier and
# one certification are planted, so the attempts guard has something to guard.
# Then:
#   1. APPLY 1 inside one transaction: must succeed; the rows must equal
#      edits.json NEW, the capstone must equal capstones.json, nothing else may
#      move, every row keeps its id, and the planted attempts are byte-identical;
#   2. APPLY 2: must succeed and change nothing;
#   3. NEGATIVE CONTROL 1: one target question given a third text; the file
#      must raise and leave the database byte-identical;
#   4. NEGATIVE CONTROL 2: the same on the Professional capstone prompt;
#   5. NEGATIVE CONTROL 3: the planted quiz attempt rescored inside the file's
#      transaction (appended statement); the closing snapshot assertion must raise.
# Usage: bash dryrun_ec1_midyear.sh
# =============================================================================
set -uo pipefail
HERE=$(cd "$(dirname "$0")" && pwd); NG=${NG:-$(cd "$HERE/../../../.." && pwd)}
MIG="$NG/migrations/20261014090000_ec1_midyear_recut_cashflow.sql"
BASE=${MY_BASE:-d2f15b28f19aca34984943eef988694f59a2c052}
C=${SCRATCH:-ec1-midyear-scratch}
W=$(mktemp -d /tmp/ec1mid-dryrun-XXXXXX)
trap 'docker rm -f $C >/dev/null 2>&1 || true; rm -rf "$W"' EXIT
docker rm -f $C >/dev/null 2>&1 || true
docker run -d --name $C -e POSTGRES_PASSWORD=scratch postgres:16-alpine >/dev/null
until docker exec $C pg_isready -U postgres >/dev/null 2>&1; do sleep 1; done; sleep 2
P() { docker exec -i $C psql -U postgres -v ON_ERROR_STOP=1 -q "$@"; }
fail=0
P <<'SQL'
create table public.academy_quiz_questions (id uuid primary key default gen_random_uuid(), app_slug text not null, tier text not null,
  scope text not null, module_key text, ord integer not null default 0, prompt text not null, options jsonb not null,
  answer_index integer not null, explanation text, active boolean not null default true, created_at timestamptz not null default now());
create table public.academy_capstones (app_slug text not null, tier text not null, cert_tier text not null, dataset text not null,
  title text not null, prompt text not null, fields jsonb not null, active boolean not null default true, primary key (app_slug, tier));
create table public.academy_capstone_attempts (id uuid primary key default gen_random_uuid(), user_id uuid not null, app_slug text not null,
  tier text not null, score integer not null, max_score integer not null, passed boolean not null, answers jsonb, created_at timestamptz not null default now());
create table public.academy_quiz_attempts (id uuid primary key default gen_random_uuid(), user_id uuid not null, app_slug text not null,
  tier text not null, scope text not null, module_key text, question_ids uuid[] not null, answers jsonb, score integer, max_score integer,
  passed boolean, status text not null default 'open', created_at timestamptz not null default now(), submitted_at timestamptz);
create table public.academy_certifications (id uuid primary key default gen_random_uuid(), user_id uuid not null, app_slug text not null,
  tier text not null, certificate_number text not null, issued_at timestamptz not null default now(), revoked_at timestamptz);
SQL
python3 - "$NG" "$BASE" > "$W/seed.sql" <<'PY'
import json, subprocess, sys
ng, base = sys.argv[1:]
def show(rel): return subprocess.run(['git', 'show', f'{base}:{rel}'], cwd=ng, capture_output=True, text=True, check=True).stdout
lit = lambda s: 'null' if s is None else "'" + str(s).replace("'", "''") + "'"
T = {'b': 'beginner', 'i': 'intermediate', 'a': 'advanced'}
out = []
for tl, tier in T.items():
    man = json.loads(show(f'src/content/courses/cashflow/{tier}/manifest.json'))
    mk = {m['key'].split('-')[0]: m['key'] for m in man['modules']}
    for bank in ['m01', 'm02', 'm03', 'm04', 'm05', 'm06', 'exam']:
        rows = json.loads(show(f'tools/course-banks/cashflow/{tier}/ec1{tl}_{bank}.json'))
        for i, q in enumerate(rows, 1):
            scope = 'final' if bank == 'exam' else 'module'
            out.append(f"insert into public.academy_quiz_questions (app_slug, tier, scope, module_key, ord, prompt, options, answer_index, explanation) values "
                       f"('cashflow', '{tier}', '{scope}', {lit(None if bank == 'exam' else mk[bank])}, {i}, {lit(q['prompt'])}, "
                       f"{lit(json.dumps(q['options'], ensure_ascii=False))}::jsonb, {q['answer']}, {lit(q['explanation'])});")
for c in json.loads(show('tools/course-waves/cashflow/capstones.json')):
    out.append(f"insert into public.academy_capstones (app_slug, tier, cert_tier, dataset, title, prompt, fields) values "
               f"('cashflow', {lit(c['tier'])}, {lit(c['cert_tier'])}, {lit(c['dataset'])}, {lit(c['title'])}, {lit(c['prompt'])}, "
               f"{lit(json.dumps(c['fields'], ensure_ascii=False))}::jsonb);")
print('\n'.join(out))
PY
P < "$W/seed.sql" || { echo "SEED FAILED"; exit 1; }
echo "seed ok: $(P -At -c "select count(*) from public.academy_quiz_questions") questions, $(P -At -c "select count(*) from public.academy_capstones") capstones (BASE ${BASE:0:9})"
# The planted attempts: a submitted quiz attempt whose served set is every row this recut changes, a capstone attempt, a certificate.
P <<'SQL'
insert into public.academy_quiz_attempts (user_id, app_slug, tier, scope, question_ids, answers, score, max_score, passed, status, submitted_at)
select gen_random_uuid(), 'cashflow', 'intermediate', 'final', array_agg(id order by scope, module_key, ord), '{"planted": true}', 17, 21, true, 'submitted', now()
  from public.academy_quiz_questions where tier = 'intermediate';
insert into public.academy_capstone_attempts (user_id, app_slug, tier, score, max_score, passed, answers)
values (gen_random_uuid(), 'cashflow', 'intermediate', 6, 6, true, '{"jv_npv_mid_year_usd": 20030970.83}');
insert into public.academy_certifications (user_id, app_slug, tier, certificate_number) values (gen_random_uuid(), 'cashflow', 'professional', 'PLA-SCRATCH-EC1MID');
SQL
DIGEST="select md5(coalesce((select string_agg(md5(q::text), ',' order by q.id) from public.academy_quiz_questions q), '') || coalesce((select string_agg(md5(c::text), ',' order by c.tier) from public.academy_capstones c), '') || coalesce((select string_agg(md5(a::text), ',' order by a.id) from public.academy_capstone_attempts a), '') || coalesce((select string_agg(md5(a::text), ',' order by a.id) from public.academy_quiz_attempts a), '') || coalesce((select string_agg(md5(x::text), ',' order by x.id) from public.academy_certifications x), ''))"
ATT="select md5(coalesce((select string_agg(md5(a::text), ',' order by a.id) from public.academy_capstone_attempts a), '') || coalesce((select string_agg(md5(a::text), ',' order by a.id) from public.academy_quiz_attempts a), '') || coalesce((select string_agg(md5(x::text), ',' order by x.id) from public.academy_certifications x), ''))"
P -At -c "select json_agg(q) from (select id, tier, scope, module_key, ord, prompt, options, answer_index, explanation from public.academy_quiz_questions) q" > "$W/before.json"
d0=$(P -At -c "$DIGEST"); a0=$(P -At -c "$ATT")
{ echo "begin;"; cat "$MIG"; echo; echo "commit;"; } > "$W/apply.sql"
if P < "$W/apply.sql" > "$W/apply1.log" 2>&1; then echo "APPLY 1 ok"; grep NOTICE "$W/apply1.log" | sed 's/^.*NOTICE:  /  /'; else echo "APPLY 1 FAILED: $(grep -m1 ERROR "$W/apply1.log")"; fail=1; fi
P -At -c "select json_agg(q) from (select id, tier, scope, module_key, ord, prompt, options, answer_index, explanation from public.academy_quiz_questions) q" > "$W/after.json"
P -At -c "select json_agg(c) from (select tier, cert_tier, title, dataset, prompt, fields from public.academy_capstones) c" > "$W/caps.json"
python3 - "$HERE/edits.json" "$W/before.json" "$W/after.json" "$W/caps.json" "$NG/tools/course-waves/cashflow/capstones.json" <<'PY' || fail=1
import json, sys
ed, bf, af, cf, kf = sys.argv[1:]
E = json.load(open(ed)); B = {r['id']: r for r in json.load(open(bf))}; A = {r['id']: r for r in json.load(open(af))}
F = ('prompt', 'options', 'answer_index', 'explanation')
addr = {(r['tier'], r['scope'], r['module_key'], r['ord']): i for i, r in A.items()}
bad = 0; touched = set()
if set(B) != set(A): bad += 1; print('  ROW IDS MOVED')
for e in E['questions']:
    i = addr[(e['tier'], e['scope'], e['module_key'], e['ord'])]; touched.add(i)
    if any(B[i][f] != e['old'][f] for f in F): bad += 1; print('  OLD MISMATCH', e['bank'], e['ord'])
    if any(A[i][f] != e['new'][f] for f in F): bad += 1; print('  NEW MISMATCH', e['bank'], e['ord'])
moved = [i for i in A if i not in touched and any(A[i][f] != B[i][f] for f in F)]
if moved: bad += 1; print('  UNEXPECTED MOVE', len(moved))
caps = {c['tier']: c for c in json.load(open(cf))}; kit = {c['tier']: c for c in json.load(open(kf))}
for t, k in kit.items():
    g = caps[t]
    if any(g[x] != k[x] for x in ('cert_tier', 'title', 'dataset', 'prompt')): bad += 1; print('  CAPSTONE TEXT', t)
    if [(f['key'], f['label'], f['unit'], float(f['expected']), float(f['tol'])) for f in g['fields']] != \
       [(f['key'], f['label'], f['unit'], float(f['expected']), float(f['tol'])) for f in k['fields']]: bad += 1; print('  CAPSTONE FIELDS', t)
print(f"  {len(touched)} rows recut, {len(A) - len(touched)} untouched, ids kept, capstones equal capstones.json: {'MATCH' if bad == 0 else f'{bad} PROBLEM(S)'}")
sys.exit(1 if bad else 0)
PY
a1=$(P -At -c "$ATT"); [ "$a0" = "$a1" ] && echo "  planted quiz attempt, capstone attempt and certificate byte-identical" || { echo "  ATTEMPTS MOVED"; fail=1; }
d1=$(P -At -c "$DIGEST"); [ "$d0" != "$d1" ] || { echo "APPLY 1 changed nothing"; fail=1; }
if P < "$W/apply.sql" > "$W/apply2.log" 2>&1; then
  d2=$(P -At -c "$DIGEST"); [ "$d1" = "$d2" ] && echo "APPLY 2 (idempotence): ok, byte-identical" || { echo "APPLY 2 CHANGED THE DATABASE"; fail=1; }
  grep NOTICE "$W/apply2.log" | grep -E 'updated|capstone' | sed 's/^.*NOTICE:  /  /'
else echo "APPLY 2 FAILED: $(grep -m1 ERROR "$W/apply2.log")"; fail=1; fi
neg() {  # $1 label, $2 tamper sql, $3 undo sql, $4 sql run INSIDE the file, after its snapshot (section 0) and before section 1
  [ -n "$2" ] && P -c "$2"
  dn=$(P -At -c "$DIGEST")
  { echo "begin;"; sed '/^-- 1\. cashflow:/,$d' "$MIG"; echo "$4"; sed -n '/^-- 1\. cashflow:/,$p' "$MIG"; echo "commit;"; } > "$W/neg.sql"
  if P < "$W/neg.sql" > "$W/neg.log" 2>&1; then echo "NEGATIVE CONTROL $1 DID NOT RAISE"; fail=1
  else da=$(P -At -c "$DIGEST"); [ "$dn" = "$da" ] && echo "NEGATIVE CONTROL $1: raised, database untouched: $(grep -m1 -o 'ec1 midyear recut refused[^"]*' "$W/neg.log")" || { echo "NEGATIVE CONTROL $1 raised but the database moved"; fail=1; }; fi
  [ -n "$3" ] && P -c "$3"
}
neg "1 (intermediate m01-why-time-matters ord 9 given a third text)" \
  "update public.academy_quiz_questions set prompt = prompt || ' (planted)' where tier = 'intermediate' and module_key = 'm01-why-time-matters' and ord = 9" \
  "update public.academy_quiz_questions set prompt = replace(prompt, ' (planted)', '') where tier = 'intermediate' and module_key = 'm01-why-time-matters' and ord = 9" ""
neg "2 (Professional capstone prompt given a third text)" \
  "update public.academy_capstones set prompt = prompt || ' x' where tier = 'intermediate'" \
  "update public.academy_capstones set prompt = left(prompt, length(prompt) - 2) where tier = 'intermediate'" ""
neg "3 (a stored quiz attempt rescored inside the transaction)" "" "" \
  "update public.academy_quiz_attempts set score = 21;"
[ "$(P -At -c "$DIGEST")" = "$d1" ] || { echo "the database is not back at the recut state after the negative controls"; fail=1; }
[ $fail = 0 ] && echo "DRY RUN OK: seed, apply, idempotent re-apply, three negative controls" || { echo "DRY RUN FAILED"; exit 1; }
