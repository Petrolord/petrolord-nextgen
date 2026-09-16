#!/usr/bin/env bash
# =============================================================================
# FC4 DRY RUN: THE WHOLE LADDER, ROLLED BACK.
#
# This is the established proof on this programme and it is the only thing that
# reads the SQL the way Postgres will. It catches what nothing in Python can:
# integer division, a jsonb cast that will not cast, a constraint nobody read, a
# VALUES separator emitted inside a comment, an assertion that cannot evaluate,
# and a held-for-literature gate refusing the very field that proves the hold.
# FC2's dry run caught the last two.
#
# All five migrations run inside ONE transaction that ends in ROLLBACK, and the
# run then RE-READS the database and compares it to the snapshot taken before,
# rather than assuming the rollback worked.
#
# APPLYING IS NOT THIS SCRIPT'S JOB AND NEVER WILL BE. The real apply is
# apply_fc4_gasprocessing.sh and it is the owner's to run.
#
# THE NEGATIVE CONTROL. With --control, one graded field is moved by ONE PART IN
# 1e7 inside the same rolled-back transaction, and the go-live must REFUSE it BY
# NAME. A dry run that passes proves nothing unless the same run can be made to
# fail. FC4's field keys are not unique across tiers, so the control names a TIER
# as well as a key.
#
# Usage: dryrun_fc4.sh [ref] [--control [<tier>] [<field key>] [<multiplier>]]
#        default HEAD
# =============================================================================
set -u

REF=${1:-HEAD}
CONTROL=${2:-}
TIER=${3:-advanced}
FIELD=${4:-dzdT}
# The size of the move. One part in 1e7 by default. ONE FIELD IS NOT ASSERTED TO
# THAT PRECISION and says so: the marched cooling is asserted to a BAND against
# the one-step answer, because a twenty-step midpoint march has no closed form.
# Passing a larger multiplier measures what that band does catch, which is the
# honest way to state a weaker assertion.
MULT=${5:-1.0000001}
HERE=$(cd "$(dirname "$0")" && pwd)
if up=$(cd "$HERE/../../.." 2>/dev/null && pwd) && { [ -d "$up/.git" ] || [ -f "$up/.git" ]; }; then
  REPO=${REPO:-$up}
else
  REPO=${REPO:-/root/wt-fc4-nextgen}
fi
LINKED=${LINKED:-/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen}
RUN=$(mktemp -d /tmp/fc4dry.XXXXXX)

FILES="20260924_fc4_gasprocessing_course
20260924_fc4_gasprocessing_beginner_deep
20260924_fc4_gasprocessing_intermediate_deep
20260924_fc4_gasprocessing_advanced_deep
20260924_fc4_gasprocessing_go_live"

# ------------------------------------------------------------ the snapshot
cat > "$RUN/snap.sql" <<'SQL'
select 'catalogue' as what,
       count(*) filter (where status = 'available')::text || ' available / ' ||
       count(*) filter (where status = 'coming_soon')::text || ' coming_soon' as v
  from public.academy_apps
union all select 'apps rows',        count(*)::text from public.academy_apps
union all select 'facilities rows',  count(*)::text from public.academy_apps where module = 'facilities'
union all select 'structures rows',  count(*)::text from public.academy_course_structures
union all select 'questions rows',   count(*)::text from public.academy_quiz_questions
union all select 'capstones rows',   count(*)::text from public.academy_capstones
union all select 'gasprocessing any', count(*)::text from public.academy_apps where slug = 'gasprocessing'
union all select 'apps digest',      md5(string_agg(slug||'|'||module||'|'||path_order||'|'||status, ',' order by slug)) from public.academy_apps
union all select 'questions digest', coalesce(md5(string_agg(app_slug||'|'||tier||'|'||scope||'|'||ord, ',' order by app_slug, tier, scope, coalesce(module_key,''), ord)), '(empty)') from public.academy_quiz_questions
union all select 'capstones digest', coalesce(md5(string_agg(app_slug||'|'||tier||'|'||(fields)::text, ',' order by app_slug, tier)), '(empty)') from public.academy_capstones
order by 1;
SQL

echo "repo: $REPO   ref: $REF"
echo "### THE DATABASE BEFORE"
( cd "$LINKED" && supabase db query --linked -f "$RUN/snap.sql" 2>/dev/null ) \
  | grep -E '"what"|"v"' | paste - - | sed 's/^/  /' | tee "$RUN/before.txt"

# ------------------------------------------------- the ladder, then rollback
{
  echo "begin;"
  for f in $FILES; do
    echo "-- ================= $f"
    if [ "$REF" = WORKTREE ]; then cat "$REPO/migrations/$f.sql"; else git -C "$REPO" show "$REF:migrations/$f.sql"; fi || exit 3
    echo
    if [ "$CONTROL" = --control ] && [ "$f" = 20260924_fc4_gasprocessing_advanced_deep ]; then
      # THE NEGATIVE CONTROL, injected AFTER the seeds and BEFORE the go-live, so
      # the go-live reads a capstone that has been moved by a factor of $MULT and
      # by nothing else. A factor rather than a round number: the point is that a
      # tiny move is caught, not a visible one. SCOPED TO ONE TIER, because
      # `circGpm` is graded on two of them.
      cat <<CTL
-- ================= NEGATIVE CONTROL: move $TIER/$FIELD by one part in 1e7
update public.academy_capstones c
   set fields = (
     select jsonb_agg(case when f->>'key' = '$FIELD'
                           then jsonb_set(f, '{expected}',
                                to_jsonb(((f->>'expected')::numeric) * $MULT))
                           else f end)
       from jsonb_array_elements(c.fields) f)
 where c.app_slug = 'gasprocessing'
   and c.tier = '$TIER'
   and exists (select 1 from jsonb_array_elements(c.fields) f where f->>'key' = '$FIELD');
CTL
    fi
  done
  cat <<'SQL'
select 'DRY RUN' as what,
       'gasprocessing ' || a.status
       || ' | ' || (select count(*) from public.academy_course_structures where app_slug='gasprocessing' and active)::text || ' tiers'
       || ' | ' || (select count(*) from public.academy_course_structures s,
                           lateral jsonb_array_elements(s.structure->'modules') m,
                           lateral jsonb_array_elements_text(m->'lesson_keys') lk
                     where s.app_slug='gasprocessing' and s.active)::text || ' lessons'
       || ' | ' || (select count(*) from public.academy_quiz_questions where app_slug='gasprocessing')::text || ' questions ('
       || (select string_agg(n::text, '/' order by ord) from (
             select case tier when 'beginner' then 1 when 'intermediate' then 2 else 3 end ord, count(*) n
               from public.academy_quiz_questions where app_slug='gasprocessing' group by tier) t) || ')'
       || ' | ' || (select count(*) from public.academy_capstones where app_slug='gasprocessing')::text || ' capstones'
       || ' | ' || (select count(*) from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
                     where c.app_slug='gasprocessing')::text || ' graded'
       || ' | path_order ' || a.path_order::text || ' in ' || a.module
       || ' | catalogue ' || (select count(*) filter (where status='available') from public.academy_apps)::text
       || ' available / ' || (select count(*) filter (where status='coming_soon') from public.academy_apps)::text
       || ' coming_soon' as v
  from public.academy_apps a where a.slug = 'gasprocessing';
rollback;
SQL
} > "$RUN/ladder.sql" || { echo "could not resolve the SQL at $REF"; exit 3; }

echo
echo "### THE LADDER, IN ONE TRANSACTION THAT ENDS IN ROLLBACK ($(wc -l < "$RUN/ladder.sql") lines)"
[ "$CONTROL" = --control ] && echo "### WITH THE NEGATIVE CONTROL ON $TIER/$FIELD, moved by a factor of $MULT"
( cd "$LINKED" && supabase db query --linked -f "$RUN/ladder.sql" 2>&1 ) > "$RUN/out.txt"
RC=$?
grep -E '"what"|"v"|ERROR|NOTICE|refused|error' "$RUN/out.txt" | sed 's/^/  /'
FAILED=0
if [ $RC -ne 0 ] || grep -qi 'ERROR' "$RUN/out.txt"; then FAILED=1; fi

# --------------------------------------------- the database, re-read after
echo
echo "### THE DATABASE AFTER THE ROLLBACK"
( cd "$LINKED" && supabase db query --linked -f "$RUN/snap.sql" 2>/dev/null ) \
  | grep -E '"what"|"v"' | paste - - | sed 's/^/  /' > "$RUN/after.txt"
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
    grep -oE "refused[^\"]*" "$RUN/out.txt" | head -2 | sed 's/^/    /'
    exit 0
  fi
  echo "CONTROL DID NOT FIRE. A move of $MULT on $TIER/$FIELD passed the go-live, so the go-live does not catch a move that size on that field."
  exit 2
fi
if [ $FAILED = 1 ]; then
  echo "DRY RUN FAILED (rc $RC). Nothing was applied, and the transaction rolled back."
  sed -n '1,60p' "$RUN/out.txt"
  exit 2
fi
echo "DRY RUN CLEAN: all five migrations ran, the go-live's assertions all passed, and the transaction rolled back."
echo "run artefacts: $RUN"
