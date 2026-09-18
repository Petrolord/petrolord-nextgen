#!/usr/bin/env bash
# =============================================================================
# riskchange DRY RUN: THE WHOLE LADDER, ROLLED BACK.
#
# All five migrations run inside ONE transaction that ends in ROLLBACK. Against
# the linked project the run then RE-READS the database and compares it to the
# snapshot taken before, rather than assuming the rollback worked.
#
# APPLYING IS NOT THIS SCRIPT'S JOB. The real apply is apply_asrc_riskchange.sh
# and it is the owner's to run. The go-live is HELD and is dry-run here only.
#
# TARGETS.
#   TARGET=scratch  the local asrc-scratch container (scratch_db.sh). The
#                   default, and the only target the negative controls run on.
#   TARGET=linked   the linked NextGen project, which is PRODUCTION, from the
#                   linked checkout. Clean run only, rolled back, with the
#                   before and after snapshot compared.
#
# THE NEGATIVE CONTROLS (scratch only). A dry run that passes proves nothing
# unless the same run can be made to fail, and each of the go-live's three
# independent checks has to be shown to fire ON ITS OWN:
#   ledger     moves one graded value by one whole unit; the engine-ledger
#              check must refuse it by name.
#   route      the same move with the ledger block cut out of the go-live; the
#              second route in SQL must refuse it by name.
#   trap       the ledger and second-route blocks cut out, and the graded value
#              set to the wrong reading the trap computes; the trap must refuse.
#   record     one record line in the shipped prompt edited; the go-live must
#              refuse because the second route's records are not the learner's.
#   selection  the selection date printed a second time in a prompt.
#
# Usage: dryrun_asrc.sh [ref|WORKTREE] [--control <name>]     default HEAD
# =============================================================================
set -u
REF=${1:-HEAD}
CONTROL=${2:-}
CTL=${3:-}
TARGET=${TARGET:-scratch}
HERE=$(cd "$(dirname "$0")" && pwd)
if up=$(cd "$HERE/../../.." 2>/dev/null && pwd) && { [ -d "$up/.git" ] || [ -f "$up/.git" ]; }; then
  REPO=${REPO:-$up}
else
  REPO=${REPO:-/root/wt-as-riskchange-nextgen}
fi
LINKED=${LINKED:-/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen}
RUN=$(mktemp -d /tmp/asrcdry.XXXXXX)
SLUG=riskchange
FILES="20261001_asrc_riskchange_course
20261001_asrc_riskchange_beginner_deep
20261001_asrc_riskchange_intermediate_deep
20261001_asrc_riskchange_advanced_deep
20261001_asrc_riskchange_go_live"

if [ -n "$CONTROL" ] && [ "$TARGET" != scratch ]; then
  echo "the negative controls run on the scratch database only"; exit 2
fi

runsql() {
  if [ "$TARGET" = linked ]; then
    ( cd "$LINKED" && supabase db query --linked -f "$1" 2>&1 )
  else
    docker exec -i asrc-scratch psql -U postgres -v ON_ERROR_STOP=1 -q -At < "$1" 2>&1
  fi
}

fetch() {
  if [ "$REF" = WORKTREE ]; then cat "$REPO/migrations/$1.sql"; else git -C "$REPO" show "$REF:migrations/$1.sql"; fi
}

cat > "$RUN/snap.sql" <<'SQL'
select 'catalogue' as what,
       count(*) filter (where status = 'available')::text || ' available / ' ||
       count(*) filter (where status = 'coming_soon')::text || ' coming_soon' as v
  from public.academy_apps
union all select 'apps rows',          count(*)::text from public.academy_apps
union all select 'assurance rows',     count(*)::text from public.academy_apps where module = 'assurance'
union all select 'path_order 59 held', count(*)::text from public.academy_apps where path_order = 59
union all select 'structures rows',    count(*)::text from public.academy_course_structures
union all select 'questions rows',     count(*)::text from public.academy_quiz_questions
union all select 'capstones rows',     count(*)::text from public.academy_capstones
union all select 'riskchange apps',    count(*)::text from public.academy_apps where slug = 'riskchange'
union all select 'riskchange any',     (select count(*) from public.academy_course_structures where app_slug = 'riskchange')
                                     + (select count(*) from public.academy_quiz_questions where app_slug = 'riskchange')
                                     + (select count(*) from public.academy_capstones where app_slug = 'riskchange') || ''
union all select 'apps digest',        md5(string_agg(slug||'|'||module||'|'||path_order||'|'||status, ',' order by slug)) from public.academy_apps
union all select 'questions digest',   coalesce(md5(string_agg(app_slug||'|'||tier||'|'||scope||'|'||ord, ',' order by app_slug, tier, scope, coalesce(module_key,''), ord)), '(empty)') from public.academy_quiz_questions
union all select 'capstones digest',   coalesce(md5(string_agg(app_slug||'|'||tier||'|'||(fields)::text, ',' order by app_slug, tier)), '(empty)') from public.academy_capstones
order by 1;
SQL

snap() {
  if [ "$TARGET" = linked ]; then
    runsql "$RUN/snap.sql" | grep -E '"what"|"v"' | paste - - | sed 's/^ *//'
  else
    runsql "$RUN/snap.sql"
  fi
}

echo "repo: $REPO   ref: $REF   target: $TARGET"
echo "### THE DATABASE BEFORE"
snap | sed 's/^/  /' | tee "$RUN/before.txt"

# ------------------------------------------------------- the controls' edits
GOLIVE_EDIT=cat
PRE_GOLIVE=""
case "$CONTROL:$CTL" in
  :) ;;
  --control:ledger|--control:route|--control:trap)
    if [ "$CTL" = trap ]; then
      # The trap on this field counts the age from the record's created_at,
      # 2026-04-14, instead of its event date, 2026-04-11: 170 days. That wrong
      # reading is set as the graded answer with the ledger and the second route
      # cut out, so ONLY the trap can object. 170 collides with no other graded
      # value and is not an integer the digest prints, so no earlier check can
      # fire in its place.
      FIELD=etim_lesson_age_days; TIER=advanced; MOVE="to_jsonb(170)"
    else
      # A move to 16, a value no other field carries, and under 25 so the
      # pairwise and digest sweeps cannot fire in its place.
      FIELD=okomu_register_expired; TIER=intermediate; MOVE="to_jsonb(16)"
    fi
    PRE_GOLIVE="update public.academy_capstones c
   set fields = (select jsonb_agg(case when f->>'key' = '$FIELD' then jsonb_set(f, '{expected}', $MOVE) else f end)
                   from jsonb_array_elements(c.fields) f)
 where c.app_slug = '$SLUG' and c.tier = '$TIER';"
    case $CTL in
      route) GOLIVE_EDIT="python3 $HERE/cut_block.py ledger" ;;
      trap)  GOLIVE_EDIT="python3 $HERE/cut_block.py ledger route" ;;
    esac
    ;;
  --control:record)
    PRE_GOLIVE="update public.academy_capstones set prompt = replace(prompt, 'residual likelihood 2 | residual impact blank', 'residual likelihood 2 | residual impact 5')
 where app_slug = '$SLUG' and tier = 'beginner';" ;;
  --control:selection)
    PRE_GOLIVE="update public.academy_capstones set prompt = prompt || E'\\n\\nA note dated 2026-08-19.'
 where app_slug = '$SLUG' and tier = 'intermediate';" ;;
  *) echo "unknown control $CTL"; exit 2 ;;
esac

{
  echo "begin;"
  for f in $FILES; do
    echo "-- ================= $f"
    if [ "$f" = 20261001_asrc_riskchange_go_live ]; then
      [ -n "$PRE_GOLIVE" ] && { echo "-- ================= NEGATIVE CONTROL $CTL"; echo "$PRE_GOLIVE"; }
      fetch "$f" | $GOLIVE_EDIT || exit 3
    else
      fetch "$f" || exit 3
    fi
    echo
  done
  cat <<'SQL'
select 'DRY RUN' as what,
       'riskchange ' || a.status
       || ' | ' || (select count(*) from public.academy_course_structures where app_slug='riskchange' and active)::text || ' tiers'
       || ' | ' || (select count(*) from public.academy_course_structures s,
                           lateral jsonb_array_elements(s.structure->'modules') m,
                           lateral jsonb_array_elements_text(m->'lesson_keys') lk
                     where s.app_slug='riskchange' and s.active)::text || ' lessons'
       || ' | ' || (select count(*) from public.academy_quiz_questions where app_slug='riskchange')::text || ' questions ('
       || (select string_agg(n::text, '/' order by ord) from (
             select case tier when 'beginner' then 1 when 'intermediate' then 2 else 3 end ord, count(*) n
               from public.academy_quiz_questions where app_slug='riskchange' group by tier) t) || ')'
       || ' | ' || (select count(*) from public.academy_capstones where app_slug='riskchange')::text || ' capstones'
       || ' | ' || (select count(*) from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
                     where c.app_slug='riskchange')::text || ' graded'
       || ' | path_order ' || a.path_order::text || ' in ' || a.module
       || ' | catalogue ' || (select count(*) filter (where status='available') from public.academy_apps)::text
       || ' available / ' || (select count(*) filter (where status='coming_soon') from public.academy_apps)::text
       || ' coming_soon' as v
  from public.academy_apps a where a.slug = 'riskchange';
rollback;
SQL
} > "$RUN/ladder.sql" || { echo "could not resolve the SQL at $REF"; exit 3; }

echo
echo "### THE LADDER, IN ONE TRANSACTION THAT ENDS IN ROLLBACK ($(wc -l < "$RUN/ladder.sql") lines)"
[ -n "$CONTROL" ] && echo "### WITH THE NEGATIVE CONTROL: $CTL"
runsql "$RUN/ladder.sql" > "$RUN/out.txt"; RC=$?
grep -E '"what"|"v"|DRY RUN|ERROR|NOTICE|refused|error' "$RUN/out.txt" | cut -c1-400 | sed 's/^/  /'
FAILED=0
if [ $RC -ne 0 ] || grep -qi 'ERROR' "$RUN/out.txt"; then FAILED=1; fi

echo
echo "### THE DATABASE AFTER THE ROLLBACK"
snap | sed 's/^/  /' > "$RUN/after.txt"
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
if [ -n "$CONTROL" ]; then
  case $CTL in
    ledger) WANT="the engine returned in capstone_calls.json" ;;
    route) WANT="the second route in SQL gives" ;;
    trap) WANT="so the field does not discriminate the trap" ;;
    record) WANT="are not in the shipped prompt" ;;
    selection) WANT="the selection date" ;;
  esac
  # The control must fire THROUGH THE CHECK IT IS FOR. A refusal from some
  # other check (the pairwise sweep, say) proves nothing about this one.
  if [ $FAILED = 1 ] && grep -q "riskchange go-live refused.*$WANT" "$RUN/out.txt"; then
    echo "CONTROL $CTL FIRED:"
    grep -oE "riskchange go-live refused[^\"]*" "$RUN/out.txt" | head -2 | cut -c1-300 | sed 's/^/    /'
    exit 0
  fi
  echo "CONTROL $CTL DID NOT FIRE through its own check ($WANT)."
  sed -n '1,20p' "$RUN/out.txt"
  exit 2
fi
if [ $FAILED = 1 ]; then
  echo "DRY RUN FAILED (rc $RC). Nothing was applied, and the transaction rolled back."
  grep -E 'ERROR|refused' "$RUN/out.txt" | head -5 | cut -c1-400
  exit 2
fi
echo "DRY RUN CLEAN: all five migrations ran, the go-live's assertions all passed, and the transaction rolled back."
echo "run artefacts: $RUN"
