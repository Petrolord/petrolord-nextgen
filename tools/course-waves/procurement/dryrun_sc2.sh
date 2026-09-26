#!/usr/bin/env bash
# =============================================================================
# SC2 DRY RUN: THE WHOLE LADDER, ROLLED BACK. Adapted from D5's dryrun_d5.sh.
#
# All five migrations run inside ONE transaction that ends in ROLLBACK. The run
# then RE-READS the database and compares it with the snapshot taken before,
# rather than assuming the rollback worked.
#
# APPLYING IS NOT THIS SCRIPT'S JOB. The real apply is apply_sc2_procurement.sh
# and it is the owner's to run. The go-live is HELD and is dry-run here only.
#
# TARGETS.
#   TARGET=scratch  the local sc2-scratch container (scratch_db.sh). The default,
#                   and the only target the negative controls run on.
#   TARGET=linked   the linked NextGen project, which is PRODUCTION, from the
#                   linked checkout. Clean run only, rolled back, with the
#                   before and after snapshot compared. Nothing may commit.
#                   The owner's to run (apply_sc2_procurement.sh prod-dryrun).
#
# THE NEGATIVE CONTROLS (scratch only). A dry run that passes proves nothing
# unless the same run can be made to fail, and each of the go-live's
# independent checks has to be shown to fire ON ITS OWN:
#   ledger [field] [mult]  moves one graded value by a factor (default
#                          okigwe_award_ratio, the SMALLEST graded value in
#                          size, by 1.0000001: an absolute move of about
#                          1.3e-7, inside its 5e-7 tolerance, so a grader would
#                          pass it); the engine-ledger check must refuse it by
#                          name.
#   route [field] [mult]   the same move with the ledger block cut out of the
#                          go-live; the second route in SQL must refuse it and
#                          name the field.
#   oracle                 umuahia_alb_limit moved by ten tolerances with the
#                          ledger and second-route blocks cut out; the oracle
#                          check must refuse it by name.
#   trap                   the ledger, second-route and oracle blocks cut out,
#                          and the Expert reimbursable P90 set to the 90th
#                          percentile of the company cost, the HIGH cost (the
#                          reading the exceedance convention rules out), read
#                          from discriminate.mjs --json; its trap must refuse.
#   prompt                 the Monte Carlo seed edited in the shipped Expert
#                          prompt; the go-live must refuse the prompt.
#   leak                   the Professional ALB limit, to six decimals, planted
#                          in an Associate label; the SQL prompt sweep must
#                          refuse.
#   sweep                  ledger AND route at one part in 1e7 on EVERY one of
#                          the eighteen fields, one rolled-back run each.
#
# --idempotent runs the WHOLE LADDER TWICE in the one rolled-back transaction
# and requires the second pass to leave every count and digest where the first
# left it, so a re-run of any file changes nothing.
#
# Usage: dryrun_sc2.sh [ref|WORKTREE] [--control <name> [field] [mult] | --idempotent]   default HEAD
# =============================================================================
set -u
REF=${1:-HEAD}
CONTROL=${2:-}
CTL=${3:-}
FIELD_ARG=${4:-}
MULT=${5:-1.0000001}
TARGET=${TARGET:-scratch}
HERE=$(cd "$(dirname "$0")" && pwd)
if up=$(cd "$HERE/../../.." 2>/dev/null && pwd) && { [ -d "$up/.git" ] || [ -f "$up/.git" ]; }; then
  REPO=${REPO:-$up}
else
  REPO=${REPO:-/root/wt-sc2-nextgen}
fi
LINKED=${LINKED:-/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen}
C=${SCRATCH:-sc2-scratch}
RUN=$(mktemp -d /tmp/sc2dry.XXXXXX)
SLUG=procurement
GOLIVE=20261106_sc2_procurement_go_live
FILES="20261106_sc2_procurement_course
20261106_sc2_procurement_beginner_deep
20261106_sc2_procurement_intermediate_deep
20261106_sc2_procurement_advanced_deep
$GOLIVE"
KEYS="onitsha_on3_technical_percent:beginner onitsha_on2_corrected_price:beginner onitsha_on3_omission_amount:beginner onitsha_on1_evaluated_cost:beginner onitsha_on2_commercial_score:beginner onitsha_top_combined_score:beginner umuahia_um2_life_cycle_cost:intermediate umuahia_um4_evaluated_cost:intermediate umuahia_alb_limit:intermediate umuahia_um3_overall_content:intermediate umuahia_s14_lead_points:intermediate umuahia_s14_lead_relative:intermediate okigwe_dayrate_mean_cost:advanced okigwe_reimbursable_p90_cost:advanced okigwe_dayrate_company_pays:advanced okigwe_should_cost_estimate:advanced okigwe_operator_amount:advanced okigwe_award_ratio:advanced"
tier_of() { for kt in $KEYS; do [ "${kt%%:*}" = "$1" ] && { echo "${kt##*:}"; return; }; done; echo ""; }

if [ -n "$CONTROL" ] && [ "$CONTROL" != --idempotent ] && [ "$TARGET" != scratch ]; then
  echo "the negative controls run on the scratch database only"; exit 2
fi
if [ "$TARGET" = scratch ]; then
  docker exec "$C" pg_isready -U postgres >/dev/null 2>&1 \
    || { echo "REFUSED: scratch container $C is not running; run scratch_db.sh first"; exit 3; }
fi

runsql() {
  if [ "$TARGET" = linked ]; then
    ( cd "$LINKED" && supabase db query --linked -f "$1" 2>&1 )
  else
    docker exec -i "$C" psql -U postgres -v ON_ERROR_STOP=1 -q -At < "$1" 2>&1
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
union all select 'path_order 71 held', count(*)::text from public.academy_apps where path_order = 71
union all select 'structures rows',    count(*)::text from public.academy_course_structures
union all select 'questions rows',     count(*)::text from public.academy_quiz_questions
union all select 'capstones rows',     count(*)::text from public.academy_capstones
union all select 'procurement apps',        count(*)::text from public.academy_apps where slug = 'procurement'
union all select 'procurement any',         (select count(*) from public.academy_course_structures where app_slug = 'procurement')
                                     + (select count(*) from public.academy_quiz_questions where app_slug = 'procurement')
                                     + (select count(*) from public.academy_capstones where app_slug = 'procurement') || ''
union all select 'apps digest',        md5(string_agg(slug||'|'||module||'|'||path_order||'|'||status, ',' order by slug)) from public.academy_apps
union all select 'structures digest',  coalesce(md5(string_agg(app_slug||'|'||tier||'|'||(structure)::text||'|'||active, ',' order by app_slug, tier)), '(empty)') from public.academy_course_structures
union all select 'questions digest',   coalesce(md5(string_agg(app_slug||'|'||tier||'|'||scope||'|'||ord||'|'||md5(prompt)||'|'||answer_index, ',' order by app_slug, tier, scope, coalesce(module_key,''), ord)), '(empty)') from public.academy_quiz_questions
union all select 'capstones digest',   coalesce(md5(string_agg(app_slug||'|'||tier||'|'||md5(prompt)||'|'||(fields)::text, ',' order by app_slug, tier)), '(empty)') from public.academy_capstones
order by 1;
SQL

snap() {
  if [ "$TARGET" = linked ]; then
    runsql "$RUN/snap.sql" | grep -E '"what"|"v"' | paste - - | sed 's/^ *//'
  else
    runsql "$RUN/snap.sql"
  fi
}

move_sql() {  # field tier multiplier
  cat <<SQL
update public.academy_capstones c
   set fields = (select jsonb_agg(case when f->>'key' = '$1'
                                       then jsonb_set(f, '{expected}', to_jsonb(((f->>'expected')::numeric) * $3))
                                       else f end)
                   from jsonb_array_elements(c.fields) f)
 where c.app_slug = '$SLUG' and c.tier = '$2';
SQL
}

# ------------------------------------------------------- the controls' edits
GOLIVE_EDIT=cat
PRE_GOLIVE=""
IDEMPOTENT=0
WANT=""
FIELD=""
case "$CONTROL:$CTL" in
  :) ;;
  --control:ledger|--control:route)
    FIELD=${FIELD_ARG:-okigwe_award_ratio}
    TIER=$(tier_of "$FIELD"); [ -n "$TIER" ] || { echo "unknown field $FIELD"; exit 2; }
    PRE_GOLIVE=$(move_sql "$FIELD" "$TIER" "$MULT")
    if [ "$CTL" = ledger ]; then
      WANT="and the engine returned [^[]*\[graded field: $TIER/$FIELD\]"
    else
      GOLIVE_EDIT="python3 $HERE/cut_block.py ledger"
      WANT="\[graded field: [^]]*$TIER/$FIELD"
    fi
    ;;
  --control:oracle)
    # Ten tolerances, so the move is past what the oracle allows, with the
    # ledger and the second route cut out so ONLY the oracle can object.
    FIELD=umuahia_alb_limit; TIER=intermediate
    PRE_GOLIVE="update public.academy_capstones c
   set fields = (select jsonb_agg(case when f->>'key' = '$FIELD'
                                       then jsonb_set(f, '{expected}', to_jsonb(((f->>'expected')::numeric) + 10 * ((f->>'tol')::numeric)))
                                       else f end)
                   from jsonb_array_elements(c.fields) f)
 where c.app_slug = '$SLUG' and c.tier = '$TIER';"
    GOLIVE_EDIT="python3 $HERE/cut_block.py ledger route"
    WANT="the oracle gives .*\[graded field: $TIER/$FIELD\]"
    ;;
  --control:trap)
    # The Expert reimbursable P90 set to the 90th percentile of the company
    # cost, the HIGH cost, read from the engine's own wrong-method sweep, with
    # the ledger, the second route and the oracle cut out so ONLY a trap can
    # object.
    FIELD=okigwe_reimbursable_p90_cost; TIER=advanced
    WRONG=$(SC2_WAVE_DIR=$HERE node "$HERE/discriminate.mjs" --json | python3 -c "import json,sys; print(repr(json.load(sys.stdin)['$FIELD']['wrong']['the_90th_percentile_quoted']))")
    [ -n "$WRONG" ] || { echo "could not read the trap value"; exit 2; }
    PRE_GOLIVE="update public.academy_capstones c
   set fields = (select jsonb_agg(case when f->>'key' = '$FIELD' then jsonb_set(f, '{expected}', to_jsonb($WRONG::numeric)) else f end)
                   from jsonb_array_elements(c.fields) f)
 where c.app_slug = '$SLUG' and c.tier = '$TIER';"
    GOLIVE_EDIT="python3 $HERE/cut_block.py ledger route oracle"
    WANT="the trap \(the 90th percentile quoted\) reads .*so the field does not discriminate the trap \[graded field: $TIER/$FIELD\]"
    ;;
  --control:prompt)
    PRE_GOLIVE="update public.academy_capstones set prompt = replace(prompt, 'on seed 70611.', 'on seed 70612.')
 where app_slug = '$SLUG' and tier = 'advanced';"
    WANT="the advanced prompt is not the prompt gen_course.py rendered"
    ;;
  --control:leak)
    PLANT=$(python3 -c "import json; f=[x for x in json.load(open('$HERE/fields.json')) if x[1]=='umuahia_alb_limit'][0]; print(f'{f[2]:.6f}')")
    PRE_GOLIVE="update public.academy_capstones c
   set fields = (select jsonb_agg(case when f->>'key' = 'onitsha_on2_corrected_price'
                                       then jsonb_set(f, '{label}', to_jsonb((f->>'label') || ', against a benchmark of $PLANT'))
                                       else f end)
                   from jsonb_array_elements(c.fields) f)
 where c.app_slug = '$SLUG' and c.tier = 'beginner';"
    WANT="intermediate/umuahia_alb_limit in the beginner capstone text"
    ;;
  --control:sweep)
    fails=0
    for kt in $KEYS; do
      for mode in ledger route; do
        OUT=$(bash "$0" "$REF" --control "$mode" "${kt%%:*}" "$MULT" 2>&1)
        if grep -q "^CONTROL $mode FIRED" <<<"$OUT"; then
          printf '  fired   %-6s %-50s %s\n' "$mode" "${kt%%:*}" "$(grep -oE '\[graded field: [^]]*\]' <<<"$OUT" | head -1)"
        else
          printf '  SILENT  %-6s %-50s\n' "$mode" "${kt%%:*}"; fails=$((fails + 1))
        fi
      done
    done
    [ $fails = 0 ] && { echo "SWEEP: all 36 controls (18 fields x ledger and route, x$MULT) fired and named their field."; exit 0; }
    echo "SWEEP: $fails control(s) did not fire."; exit 2
    ;;
  --idempotent:) IDEMPOTENT=1 ;;
  *) echo "unknown control $CTL"; exit 2 ;;
esac

echo "repo: $REPO   ref: $REF   target: $TARGET"
echo "### THE DATABASE BEFORE"
snap | sed 's/^/  /' | tee "$RUN/before.txt"

{
  [ "$TARGET" = scratch ] && echo '\set ON_ERROR_STOP on'
  echo "begin;"
  PASSES=1; [ "$IDEMPOTENT" = 1 ] && PASSES=2
  for pass in $(seq 1 $PASSES); do
  if [ "$pass" = 2 ]; then
    echo "create temp table sc2_pass1 as select * from ($(tr '\n' ' ' < "$RUN/snap.sql" | sed 's/;[[:space:]]*$//')) s;"
  fi
  for f in $FILES; do
    echo "-- ================= $f"
    if [ "$f" = "$GOLIVE" ]; then
      [ -n "$PRE_GOLIVE" ] && { echo "-- ================= NEGATIVE CONTROL $CTL $FIELD"; echo "$PRE_GOLIVE"; }
      fetch "$f" | $GOLIVE_EDIT || exit 3
    else
      fetch "$f" || exit 3
    fi
    echo
  done
  if [ "$pass" = 2 ]; then
    echo "do \$\$ declare v_n int; begin select count(*) into v_n from ((select * from sc2_pass1 except select * from ($(tr '\n' ' ' < "$RUN/snap.sql" | sed 's/;[[:space:]]*$//')) s) union all (select * from ($(tr '\n' ' ' < "$RUN/snap.sql" | sed 's/;[[:space:]]*$//')) s except select * from sc2_pass1)) d; if v_n <> 0 then raise exception 'SC2 go-live refused: IDEMPOTENCE, the second pass of the ladder moved % snapshot row(s)', v_n; end if; raise notice 'IDEMPOTENT: the second pass left every count and digest where the first left it'; end \$\$;"
  fi
  done
  cat <<'SQL'
select 'DRY RUN' as what,
       'procurement ' || a.status
       || ' | ' || (select count(*) from public.academy_course_structures where app_slug='procurement' and active)::text || ' tiers'
       || ' | ' || (select count(*) from public.academy_course_structures s,
                           lateral jsonb_array_elements(s.structure->'modules') m,
                           lateral jsonb_array_elements_text(m->'lesson_keys') lk
                     where s.app_slug='procurement' and s.active)::text || ' lessons'
       || ' | ' || (select count(*) from public.academy_quiz_questions where app_slug='procurement')::text || ' questions ('
       || (select string_agg(n::text, '/' order by ord) from (
             select case tier when 'beginner' then 1 when 'intermediate' then 2 else 3 end ord, count(*) n
               from public.academy_quiz_questions where app_slug='procurement' group by tier) t) || ')'
       || ' | ' || (select count(*) from public.academy_capstones where app_slug='procurement')::text || ' capstones'
       || ' | ' || (select count(*) from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
                     where c.app_slug='procurement')::text || ' graded'
       || ' | path_order ' || a.path_order::text || ' in ' || a.module
       || ' | catalogue ' || (select count(*) filter (where status='available') from public.academy_apps)::text
       || ' available / ' || (select count(*) filter (where status='coming_soon') from public.academy_apps)::text
       || ' coming_soon' as v
  from public.academy_apps a where a.slug = 'procurement';
rollback;
SQL
} > "$RUN/ladder.sql" || { echo "could not resolve the SQL at $REF"; exit 3; }

echo
echo "### THE LADDER, IN ONE TRANSACTION THAT ENDS IN ROLLBACK ($(wc -l < "$RUN/ladder.sql") lines)"
[ -n "$CONTROL" ] && echo "### WITH THE NEGATIVE CONTROL: $CTL $FIELD"
runsql "$RUN/ladder.sql" > "$RUN/out.txt"; RC=$?
grep -E '"what"|"v"|DRY RUN|ERROR|NOTICE|refused|error' "$RUN/out.txt" | cut -c1-400 | sed 's/^/  /'
FAILED=0
if [ $RC -ne 0 ] || grep -qi 'ERROR' "$RUN/out.txt"; then FAILED=1; fi
if [ "$TARGET" = scratch ] && docker exec "$C" psql -U postgres -Atc \
     "select count(*) from pg_stat_activity where state like 'idle in transaction%'" | grep -qv '^0$'; then
  echo "A TRANSACTION WAS LEFT OPEN"; exit 2
fi

echo
echo "### THE DATABASE AFTER THE ROLLBACK"
snap | sed 's/^/  /' > "$RUN/after.txt"
cat "$RUN/after.txt"
echo
if [ -s "$RUN/before.txt" ] && diff -q "$RUN/before.txt" "$RUN/after.txt" >/dev/null; then
  echo "UNCHANGED: every count and every digest is what it was before the run."
else
  echo "THE DATABASE MOVED, OR NO SNAPSHOT WAS READ. This is the thing that must never happen:"
  diff "$RUN/before.txt" "$RUN/after.txt"
  exit 2
fi

echo
if [ -n "$CONTROL" ] && [ "$CONTROL" != --idempotent ]; then
  # The control must fire THROUGH THE CHECK IT IS FOR. A refusal from some
  # other check (the pairwise sweep, say) proves nothing about this one.
  if [ $FAILED = 1 ] && grep -qE "SC2 go-live refused.*$WANT" "$RUN/out.txt"; then
    echo "CONTROL $CTL FIRED:"
    grep -oE "SC2 go-live refused[^\"]*" "$RUN/out.txt" | head -2 | cut -c1-400 | sed 's/^/    /'
    exit 0
  fi
  echo "CONTROL $CTL DID NOT FIRE through its own check ($WANT)."
  grep -E 'ERROR|refused' "$RUN/out.txt" | head -5 | cut -c1-400
  exit 2
fi
if [ $FAILED = 1 ]; then
  echo "DRY RUN FAILED (rc $RC). Nothing was applied, and the transaction rolled back."
  grep -E 'ERROR|refused' "$RUN/out.txt" | head -5 | cut -c1-400
  exit 2
fi
grep -q 'procurement available | 3 tiers | 78 lessons | 396 questions' "$RUN/out.txt" \
  || { echo "DRY RUN DID NOT READ BACK the flipped course"; exit 2; }
if [ "$IDEMPOTENT" = 1 ]; then grep -q 'IDEMPOTENT: the second pass' "$RUN/out.txt" || { echo "THE IDEMPOTENCE CHECK DID NOT RUN"; exit 2; }; echo "IDEMPOTENT: the whole ladder ran twice in one rolled-back transaction and the second pass moved nothing."; fi
echo "DRY RUN CLEAN: all five migrations ran, the go-live's assertions all passed, and the transaction rolled back."
echo "run artefacts: $RUN"
