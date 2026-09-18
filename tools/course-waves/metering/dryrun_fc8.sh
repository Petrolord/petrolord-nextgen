#!/usr/bin/env bash
# =============================================================================
# FC8 DRY RUN: THE WHOLE LADDER, ROLLED BACK, AGAINST A SCRATCH DATABASE.
#
# Modelled on dryrun_fc6.sh with ONE deliberate difference: FC6 ran its
# rolled-back ladder against the LINKED project, which for petrolord-nextgen is
# production. This one runs against the local container scratch_db.sh builds
# (fc8-scratch: the four academy tables from the repository's own DDL, plus
# every committed Facilities course row), and it never opens a connection to
# production at all.
#
# It reads the SQL the way Postgres will, which nothing in Python can:
# integer division, a jsonb cast that will not cast, a constraint nobody read,
# a VALUES separator emitted inside a comment, an assertion that cannot
# evaluate, a held gate refusing the very field that proves the hold.
#
# All five migrations run inside ONE transaction that ends in ROLLBACK, and the
# run then RE-READS the database and compares it to the snapshot taken before,
# rather than assuming the rollback worked.
#
# THE NEGATIVE CONTROL. With --control, one graded field is moved by ONE PART IN
# 1e7 inside the same rolled-back transaction, and the go-live must REFUSE it BY
# NAME. The default field is the SMALLEST graded value on the wave, the bottom
# course at 0.341091 in, where one part in 1e7 is an absolute move of about
# 3.4e-8: under a fourteenth of the field's own 5e-7 tolerance, so it would pass
# a grader, and it must still be refused here.
#
# Usage: dryrun_fc8.sh [ref|WORKTREE] [--control [<tier>] [<field key>] [<multiplier>]]
# =============================================================================
set -u

REF=${1:-HEAD}
CONTROL=${2:-}
TIER=${3:-advanced}
FIELD=${4:-saghara_bottom_course_required_in}
MULT=${5:-1.0000001}
HERE=$(cd "$(dirname "$0")" && pwd)
if up=$(cd "$HERE/../../.." 2>/dev/null && pwd) && { [ -d "$up/.git" ] || [ -f "$up/.git" ]; }; then
  REPO=${REPO:-$up}
else
  REPO=${REPO:-/root/wt-fc8-nextgen}
fi
C=${SCRATCH:-fc8-scratch}
docker exec "$C" pg_isready -U postgres >/dev/null 2>&1 \
  || { echo "REFUSED: scratch container $C is not running; run scratch_db.sh first"; exit 3; }
RUN=$(mktemp -d /tmp/fc8dry.XXXXXX)
Q() { docker exec -i "$C" psql -U postgres -At -F ' | ' "$@"; }

FILES="20260925_fc8_metering_course
20260925_fc8_metering_beginner_deep
20260925_fc8_metering_intermediate_deep
20260925_fc8_metering_advanced_deep
20260925_fc8_metering_go_live"

cat > "$RUN/snap.sql" <<'SQL'
select 'catalogue',
       count(*) filter (where status = 'available')::text || ' available / ' ||
       count(*) filter (where status = 'coming_soon')::text || ' coming_soon'
  from public.academy_apps
union all select 'apps rows',          count(*)::text from public.academy_apps
union all select 'facilities rows',    count(*)::text from public.academy_apps where module = 'facilities'
union all select 'path_order 46 held', count(*)::text from public.academy_apps where path_order = 46
union all select 'structures rows',    count(*)::text from public.academy_course_structures
union all select 'questions rows',     count(*)::text from public.academy_quiz_questions
union all select 'capstones rows',     count(*)::text from public.academy_capstones
union all select 'metering any',       count(*)::text from public.academy_apps where slug = 'metering'
union all select 'apps digest',        md5(string_agg(slug||'|'||module||'|'||path_order||'|'||status, ',' order by slug)) from public.academy_apps
union all select 'questions digest',   coalesce(md5(string_agg(app_slug||'|'||tier||'|'||scope||'|'||ord, ',' order by app_slug, tier, scope, coalesce(module_key,''), ord)), '(empty)') from public.academy_quiz_questions
union all select 'capstones digest',   coalesce(md5(string_agg(app_slug||'|'||tier||'|'||(fields)::text, ',' order by app_slug, tier)), '(empty)') from public.academy_capstones
order by 1;
SQL

echo "repo: $REPO   ref: $REF   database: docker container $C (scratch, never production)"
echo "### THE DATABASE BEFORE"
Q < "$RUN/snap.sql" | sed 's/^/  /' | tee "$RUN/before.txt"

{
  echo '\set ON_ERROR_STOP on'
  echo "begin;"
  for f in $FILES; do
    echo "-- ================= $f"
    if [ "$REF" = WORKTREE ]; then cat "$REPO/migrations/$f.sql"; else git -C "$REPO" show "$REF:migrations/$f.sql"; fi || exit 3
    echo
    if [ "$CONTROL" = --control ] && [ "$f" = 20260925_fc8_metering_advanced_deep ]; then
      cat <<CTL
-- ================= NEGATIVE CONTROL: move $TIER/$FIELD by a factor of $MULT
update public.academy_capstones c
   set fields = (
     select jsonb_agg(case when f->>'key' = '$FIELD'
                           then jsonb_set(f, '{expected}',
                                to_jsonb(((f->>'expected')::numeric) * $MULT))
                           else f end)
       from jsonb_array_elements(c.fields) f)
 where c.app_slug = 'metering'
   and c.tier = '$TIER'
   and exists (select 1 from jsonb_array_elements(c.fields) f where f->>'key' = '$FIELD');
CTL
    fi
  done
  cat <<'SQL'
select 'DRY RUN',
       'metering ' || a.status
       || ' | ' || (select count(*) from public.academy_course_structures where app_slug='metering' and active)::text || ' tiers'
       || ' | ' || (select count(*) from public.academy_course_structures s,
                           lateral jsonb_array_elements(s.structure->'modules') m,
                           lateral jsonb_array_elements_text(m->'lesson_keys') lk
                     where s.app_slug='metering' and s.active)::text || ' lessons'
       || ' | ' || (select count(*) from public.academy_quiz_questions where app_slug='metering')::text || ' questions ('
       || (select string_agg(n::text, '/' order by ord) from (
             select case tier when 'beginner' then 1 when 'intermediate' then 2 else 3 end ord, count(*) n
               from public.academy_quiz_questions where app_slug='metering' group by tier) t) || ')'
       || ' | ' || (select count(*) from public.academy_capstones where app_slug='metering')::text || ' capstones'
       || ' | ' || (select count(*) from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
                     where c.app_slug='metering')::text || ' graded'
       || ' | path_order ' || a.path_order::text || ' in ' || a.module
  from public.academy_apps a where a.slug = 'metering';
rollback;
SQL
} > "$RUN/ladder.sql" || { echo "could not resolve the SQL at $REF"; exit 3; }

echo
echo "### THE LADDER, IN ONE TRANSACTION THAT ENDS IN ROLLBACK ($(wc -l < "$RUN/ladder.sql") lines)"
[ "$CONTROL" = --control ] && echo "### WITH THE NEGATIVE CONTROL ON $TIER/$FIELD, moved by a factor of $MULT"
Q < "$RUN/ladder.sql" > "$RUN/out.txt" 2>&1
RC=$?
grep -E 'DRY RUN|NOTICE|ERROR|refused' "$RUN/out.txt" | sed 's/^/  /'
FAILED=0
if [ $RC -ne 0 ] || grep -q 'ERROR' "$RUN/out.txt"; then FAILED=1; fi
# A rollback that follows a failed statement is still a rollback, but the
# session must be seen to END in one either way.
if [ $FAILED = 1 ] && docker exec "$C" psql -U postgres -Atc "select count(*) from pg_stat_activity where state like 'idle in transaction%'" | grep -qv '^0$'; then
  echo "A TRANSACTION WAS LEFT OPEN"; exit 2
fi

echo
echo "### THE DATABASE AFTER THE ROLLBACK"
Q < "$RUN/snap.sql" | sed 's/^/  /' > "$RUN/after.txt"
cat "$RUN/after.txt"
echo
if diff -q "$RUN/before.txt" "$RUN/after.txt" >/dev/null; then
  echo "UNCHANGED: every count and every digest is what it was before the run."
else
  echo "THE DATABASE MOVED. This is the thing that must never happen:"
  diff "$RUN/before.txt" "$RUN/after.txt"
  exit 2
fi

echo
if [ "$CONTROL" = --control ]; then
  if [ $FAILED = 1 ] && grep -q "$FIELD" "$RUN/out.txt"; then
    echo "CONTROL FIRED: the go-live refused, and named $TIER/$FIELD."
    grep -oE "FC8 go-live refused[^\"]*" "$RUN/out.txt" | head -2 | sed 's/^/    /'
    exit 0
  fi
  echo "CONTROL DID NOT FIRE. A move of $MULT on $TIER/$FIELD passed the go-live."
  exit 2
fi
if [ $FAILED = 1 ]; then
  echo "DRY RUN FAILED (rc $RC). Nothing was applied, and the transaction rolled back."
  sed -n '1,60p' "$RUN/out.txt"
  exit 2
fi
echo "DRY RUN CLEAN: all five migrations ran, the go-live's assertions all passed, and the transaction rolled back."
echo "run artefacts: $RUN"
