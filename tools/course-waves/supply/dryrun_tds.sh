#!/usr/bin/env bash
# =============================================================================
# supply DRY RUN: THE WHOLE LADDER, ROLLED BACK.
#
# All five migrations run inside ONE transaction that ends in ROLLBACK. Against
# the linked project the run then RE-READS the database and compares it to the
# snapshot taken before, rather than assuming the rollback worked.
#
# APPLYING IS NOT THIS SCRIPT'S JOB. The real apply is apply_tds_supply.sh and
# it is the owner's to run. The go-live is HELD and is dry-run here only.
#
# TARGETS.
#   TARGET=scratch  the local tds-scratch container (scratch_db.sh). The
#                   default, and the only target the negative controls run on.
#   TARGET=linked   the linked NextGen project, which is PRODUCTION, from the
#                   linked checkout. Clean run only, rolled back, with the
#                   before and after snapshot compared.
#   GOLIVE=0        stop after the four seeds, so the catalogue counts are read
#                   with the course seeded and the go-live NOT run.
#
# THE NEGATIVE CONTROLS (scratch only). A dry run that passes proves nothing
# unless the same run can be made to fail, and each of the go-live's checks has
# to be shown to fire ON ITS OWN, through its own refusal text:
#   engine     moves okomu_unaccounted_m3 by two tolerances; the engine check
#              must refuse it by name.
#   route      moves ogwashi_rack_mean_wait_min by three tolerances with the
#              engine block cut out; the second route in SQL must refuse it.
#   oracle     moves oron_breakeven_fx, the one field with no SQL route, by
#              three tolerances with the engine and route blocks cut out; the
#              oracle must refuse it.
#   trap       the engine, route and oracle blocks cut out, and
#              okomu_expected_closing_m3 set to the reading of its trap (the
#              known loss left out of the day); the trap must refuse it.
#   prompt     the OK-1 dip edited in the shipped beginner prompt; the go-live
#              must refuse because it is not capstone.json's prompt.
#   derived    an engine-derived intermediate (the lane's cycle in hours)
#              printed in the intermediate capstone's dataset line.
#   leak       a graded value (the pump price to two decimals) printed in the
#              advanced capstone's dataset line.
#   digest     one graded value moved onto a number the digest prints (the
#              IBAFO rack's probability of waiting, gate_collisions.py's plant).
#   precision  one tolerance widened to twice what precision.json gives it.
# Every moved value was checked clear of the digest, the prompts and the other
# graded values first, so no earlier sweep can fire in the control's place.
#
# Usage: dryrun_tds.sh [ref|WORKTREE] [--control <name>]     default HEAD
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
  REPO=${REPO:-/root/wt-md-supply-nextgen}
fi
LINKED=${LINKED:-/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen}
RUN=$(mktemp -d /tmp/tdsdry.XXXXXX)
SLUG=supply
GOLIVE=${GOLIVE:-1}
FILES="20261012_tds_supply_course
20261012_tds_supply_beginner_deep
20261012_tds_supply_intermediate_deep
20261012_tds_supply_advanced_deep
20261012_tds_supply_go_live"

if [ -n "$CONTROL" ] && [ "$TARGET" != scratch ]; then
  echo "the negative controls run on the scratch database only"; exit 2
fi

runsql() {
  if [ "$TARGET" = linked ]; then
    ( cd "$LINKED" && supabase db query --linked -f "$1" 2>&1 )
  else
    docker exec -i tds-scratch psql -U postgres -v ON_ERROR_STOP=1 -q -At < "$1" 2>&1
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
union all select 'supply_chain rows',  count(*)::text from public.academy_apps where module = 'supply_chain'
union all select 'path_order 48 held', count(*)::text from public.academy_apps where path_order = 48
union all select 'path_order 49 held', count(*)::text from public.academy_apps where path_order = 49
union all select 'structures rows',    count(*)::text from public.academy_course_structures
union all select 'questions rows',     count(*)::text from public.academy_quiz_questions
union all select 'capstones rows',     count(*)::text from public.academy_capstones
union all select 'path_order 50 held', count(*)::text from public.academy_apps where path_order = 50
union all select 'supply apps',        count(*)::text from public.academy_apps where slug = 'supply'
union all select 'supply any',         (select count(*) from public.academy_course_structures where app_slug = 'supply')
                                     + (select count(*) from public.academy_quiz_questions where app_slug = 'supply')
                                     + (select count(*) from public.academy_capstones where app_slug = 'supply') || ''
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
move() { # field tier new-value
  PRE_GOLIVE="update public.academy_capstones c
   set fields = (select jsonb_agg(case when f->>'key' = '$1' then jsonb_set(f, '{expected}', to_jsonb($3::numeric)) else f end order by o)
                   from jsonb_array_elements(c.fields) with ordinality x(f, o))
 where c.app_slug = '$SLUG' and c.tier = '$2';"
}
case "$CONTROL:$CTL" in
  :) ;;
  --control:engine)
    # -5.221841342000062 to -5.241841342000062, two tolerances.
    move okomu_unaccounted_m3 beginner -5.241841342000062 ;;
  --control:route)
    # 17.735762407837736 to 17.765762407837736, three tolerances.
    move ogwashi_rack_mean_wait_min intermediate 17.765762407837736
    GOLIVE_EDIT="python3 $HERE/cut_block.py engine" ;;
  --control:oracle)
    # 1682.8320980072021 to 1682.8620980072021, three tolerances.
    move oron_breakeven_fx advanced 1682.8620980072021
    GOLIVE_EDIT="python3 $HERE/cut_block.py engine route" ;;
  --control:trap)
    # The trap on this field leaves the known loss out of the day:
    # 2498.45 + 1180 - 1352.6 = 2325.85, which discriminate.mjs ran through the
    # engine as known_loss_left_out. 2325.85 is no other graded value, no
    # number the digest prints and no number in a prompt.
    move okomu_expected_closing_m3 beginner 2325.85
    GOLIVE_EDIT="python3 $HERE/cut_block.py engine route oracle" ;;
  --control:prompt)
    PRE_GOLIVE="update public.academy_capstones set prompt = replace(prompt, 'Dip 8437 mm', 'Dip 8438 mm')
 where app_slug = '$SLUG' and tier = 'beginner';" ;;
  --control:derived)
    # The lane's cycle, 16.57 hours, which the prompt never prints.
    PRE_GOLIVE="update public.academy_capstones set dataset = dataset || ' (a cycle of 16.57 h)'
 where app_slug = '$SLUG' and tier = 'intermediate';" ;;
  --control:leak)
    # The pump price, 1243.7216, to two decimals.
    PRE_GOLIVE="update public.academy_capstones set dataset = dataset || ' (about 1243.72 a litre)'
 where app_slug = '$SLUG' and tier = 'advanced';" ;;
  --control:digest)
    # 0.787753 is the IBAFO rack's probability of waiting, which the digest
    # prints (gate_collisions.py's own plant).
    move ogwashi_rack_probability_of_waiting intermediate 0.787753 ;;
  --control:precision)
    PRE_GOLIVE="update public.academy_capstones c
   set fields = (select jsonb_agg(case when f->>'key' = 'okomu_tolerance_m3' then jsonb_set(f, '{tol}', to_jsonb(0.02)) else f end order by o)
                   from jsonb_array_elements(c.fields) with ordinality x(f, o))
 where c.app_slug = '$SLUG' and c.tier = 'beginner';" ;;
  *) echo "unknown control $CTL"; exit 2 ;;
esac

{
  echo "begin;"
  for f in $FILES; do
    echo "-- ================= $f"
    if [ "$f" = 20261012_tds_supply_go_live ]; then
      [ "$GOLIVE" = 0 ] && { echo "-- ================= go-live NOT run (GOLIVE=0)"; continue; }
      [ -n "$PRE_GOLIVE" ] && { echo "-- ================= NEGATIVE CONTROL $CTL"; echo "$PRE_GOLIVE"; }
      fetch "$f" | $GOLIVE_EDIT || exit 3
    else
      fetch "$f" || exit 3
    fi
    echo
  done
  cat <<'SQL'
select 'DRY RUN' as what,
       'supply ' || a.status
       || ' | ' || (select count(*) from public.academy_course_structures where app_slug='supply' and active)::text || ' tiers'
       || ' | ' || (select count(*) from public.academy_course_structures s,
                           lateral jsonb_array_elements(s.structure->'modules') m,
                           lateral jsonb_array_elements_text(m->'lesson_keys') lk
                     where s.app_slug='supply' and s.active)::text || ' lessons'
       || ' | ' || (select count(*) from public.academy_quiz_questions where app_slug='supply')::text || ' questions ('
       || (select string_agg(n::text, '/' order by ord) from (
             select case tier when 'beginner' then 1 when 'intermediate' then 2 else 3 end ord, count(*) n
               from public.academy_quiz_questions where app_slug='supply' group by tier) t) || ')'
       || ' | ' || (select count(*) from public.academy_capstones where app_slug='supply')::text || ' capstones'
       || ' | ' || (select count(*) from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
                     where c.app_slug='supply')::text || ' graded'
       || ' | path_order ' || a.path_order::text || ' in ' || a.module
       || ' | catalogue ' || (select count(*) filter (where status='available') from public.academy_apps)::text
       || ' available / ' || (select count(*) filter (where status='coming_soon') from public.academy_apps)::text
       || ' coming_soon' as v
  from public.academy_apps a where a.slug = 'supply';
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
    engine) WANT="the engine returned through supply_capstone.mjs" ;;
    route) WANT="the second route in SQL gives" ;;
    oracle) WANT="the oracle gives" ;;
    trap) WANT="so the field does not discriminate the trap" ;;
    prompt) WANT="is not the prompt capstone.json carries" ;;
    derived) WANT="engine-derived intermediate" ;;
    leak) WANT="graded field(s) are printed in a capstone a learner reads" ;;
    digest) WANT="a number the digest prints" ;;
    precision) WANT="at their precision.json tolerance" ;;
  esac
  # The control must fire THROUGH THE CHECK IT IS FOR. A refusal from some
  # other check (the pairwise sweep, say) proves nothing about this one.
  if [ $FAILED = 1 ] && grep -qF "supply go-live refused" "$RUN/out.txt" && grep -F "supply go-live refused" "$RUN/out.txt" | grep -qF "$WANT"; then
    echo "CONTROL $CTL FIRED:"
    grep -oE "supply go-live refused[^\"]*" "$RUN/out.txt" | head -2 | cut -c1-300 | sed 's/^/    /'
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
if [ "$GOLIVE" = 0 ]; then echo "DRY RUN CLEAN: the four seeds ran (go-live NOT run), and the transaction rolled back."; else echo "DRY RUN CLEAN: all five migrations ran, the go-live's assertions all passed, and the transaction rolled back."; fi
echo "run artefacts: $RUN"
