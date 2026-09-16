#!/usr/bin/env bash
# =============================================================================
# FC2 DRY RUN, AGAINST PRODUCTION, ROLLED BACK.
#
# This is the established proof on this programme and it is the only thing
# that catches what only SQL does: Postgres integer division, a jsonb cast
# that will not cast, a constraint nobody read, an assertion that cannot
# evaluate. The whole ladder runs inside one transaction that ends in
# ROLLBACK, and the run then RE-READS production and compares it to the
# snapshot taken before, rather than assuming the rollback worked.
#
# Applying is not this script's job and never will be. The real apply is
# apply_fc2_linesizing.sh and it is the owner's to run.
#
# Usage: dryrun_fc2.sh [ref]     default HEAD
# =============================================================================
set -u

REF=${1:-HEAD}
REPO=/root/wt-fc2-nextgen
LINKED=/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen
RUN=$(mktemp -d /tmp/fc2dry.XXXXXX)

FILES="20260922_fc2_linesizing_course
20260922_fc2_linesizing_beginner_deep
20260922_fc2_linesizing_intermediate_deep
20260922_fc2_linesizing_advanced_deep
20260922_fc2_linesizing_go_live"

# ------------------------------------------------------------ the snapshot
cat > "$RUN/snap.sql" <<'SQL'
select 'catalogue' as what,
       count(*) filter (where status = 'available')::text || ' available / ' ||
       count(*) filter (where status = 'coming_soon')::text || ' coming_soon' as v
  from public.academy_apps
union all select 'apps rows',       count(*)::text from public.academy_apps
union all select 'structures rows', count(*)::text from public.academy_course_structures
union all select 'questions rows',  count(*)::text from public.academy_quiz_questions
union all select 'capstones rows',  count(*)::text from public.academy_capstones
union all select 'linesizing any',  count(*)::text from public.academy_apps where slug = 'linesizing'
union all select 'apps digest',     md5(string_agg(slug||'|'||module||'|'||path_order||'|'||status, ',' order by slug)) from public.academy_apps
union all select 'questions digest', coalesce(md5(string_agg(app_slug||'|'||tier||'|'||scope||'|'||ord, ',' order by app_slug, tier, scope, coalesce(module_key,''), ord)), '(empty)') from public.academy_quiz_questions
union all select 'capstones digest', coalesce(md5(string_agg(app_slug||'|'||tier||'|'||(fields)::text, ',' order by app_slug, tier)), '(empty)') from public.academy_capstones
order by 1;
SQL

echo "### PRODUCTION BEFORE"
( cd "$LINKED" && supabase db query --linked -f "$RUN/snap.sql" 2>/dev/null ) \
  | grep -E '"what"|"v"' | paste - - | sed 's/^/  /' | tee "$RUN/before.txt"

# ------------------------------------------------------- the ladder + rollback
{
  echo "begin;"
  for f in $FILES; do
    echo "-- ================= $f"
    if [ "$REF" = WORKTREE ]; then cat "$REPO/migrations/$f.sql"; else git -C "$REPO" show "$REF:migrations/$f.sql"; fi || exit 3
    echo
  done
  cat <<'SQL'
select 'DRY RUN' as what,
       'linesizing ' || a.status
       || ' | ' || (select count(*) from public.academy_course_structures where app_slug='linesizing' and active)::text || ' tiers'
       || ' | ' || (select count(*) from public.academy_course_structures s,
                           lateral jsonb_array_elements(s.structure->'modules') m,
                           lateral jsonb_array_elements_text(m->'lesson_keys') lk
                     where s.app_slug='linesizing' and s.active)::text || ' lessons'
       || ' | ' || (select count(*) from public.academy_quiz_questions where app_slug='linesizing')::text || ' questions ('
       || (select string_agg(n::text, '/' order by ord) from (
             select case tier when 'beginner' then 1 when 'intermediate' then 2 else 3 end ord, count(*) n
               from public.academy_quiz_questions where app_slug='linesizing' group by tier) t) || ')'
       || ' | ' || (select count(*) from public.academy_capstones where app_slug='linesizing')::text || ' capstones'
       || ' | ' || (select count(*) from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
                     where c.app_slug='linesizing')::text || ' graded'
       || ' | path_order ' || a.path_order::text || ' in ' || a.module
       || ' | catalogue ' || (select count(*) filter (where status='available') from public.academy_apps)::text
       || ' available / ' || (select count(*) filter (where status='coming_soon') from public.academy_apps)::text
       || ' coming_soon' as v
  from public.academy_apps a where a.slug = 'linesizing';
rollback;
SQL
} > "$RUN/ladder.sql" || { echo "could not resolve the SQL at $REF"; exit 3; }

echo
echo "### THE LADDER, IN ONE TRANSACTION THAT ENDS IN ROLLBACK ($(wc -l < "$RUN/ladder.sql") lines)"
( cd "$LINKED" && supabase db query --linked -f "$RUN/ladder.sql" 2>&1 ) > "$RUN/out.txt"
RC=$?
grep -E '"what"|"v"|ERROR|NOTICE|error' "$RUN/out.txt" | sed 's/^/  /'
if [ $RC -ne 0 ] || grep -qi 'ERROR' "$RUN/out.txt"; then
  echo
  echo "DRY RUN FAILED (rc $RC). Nothing was applied, and the transaction rolled back."
  sed -n '1,40p' "$RUN/out.txt"
  exit 2
fi

# --------------------------------------------- production, re-read afterwards
echo
echo "### PRODUCTION AFTER THE ROLLBACK"
( cd "$LINKED" && supabase db query --linked -f "$RUN/snap.sql" 2>/dev/null ) \
  | grep -E '"what"|"v"' | paste - - | sed 's/^/  /' > "$RUN/after.txt"
cat "$RUN/after.txt"

echo
if diff -q "$RUN/before.txt" "$RUN/after.txt" >/dev/null; then
  echo "PRODUCTION UNCHANGED: every count and every digest is what it was before the run."
else
  echo "PRODUCTION MOVED. This is the thing that must never happen:"
  diff "$RUN/before.txt" "$RUN/after.txt"
  exit 2
fi
echo "run artefacts: $RUN"
