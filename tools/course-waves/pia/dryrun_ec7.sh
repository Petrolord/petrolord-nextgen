#!/usr/bin/env bash
# =============================================================================
# EC7 DRY RUN: THE WHOLE LADDER, ROLLED BACK. Adapted from SC2's dryrun_sc2.sh.
#
# All five migrations run inside ONE transaction that ends in ROLLBACK. The run
# then RE-READS the database and compares it with the snapshot taken before,
# rather than assuming the rollback worked.
#
# APPLYING IS NOT THIS SCRIPT'S JOB. The real apply is apply_ec7_pia.sh
# and it is the owner's to run. The go-live is HELD and is dry-run here only.
#
# TARGETS.
#   TARGET=scratch  the local ec7-scratch container (scratch_db.sh). The default,
#                   and the only target the negative controls run on.
#   TARGET=linked   the linked NextGen project, which is PRODUCTION, from the
#                   linked checkout. Clean run only, rolled back, with the
#                   before and after snapshot compared. Nothing may commit.
#                   The owner's to run (apply_ec7_pia.sh prod-dryrun).
#
# THE NEGATIVE CONTROLS (scratch only). A dry run that passes proves nothing
# unless the same run can be made to fail, and each of the go-live's
# independent checks has to be shown to fire ON ITS OWN:
#   ledger [field] [mult]  moves one graded value by a factor (default
#                          odozi_2028_liquids_royalty_rate, the SMALLEST graded
#                          value, by 1.0000001: an absolute move far inside its
#                          5e-7 tolerance, so a grader would pass it); the
#                          engine-ledger check must refuse it by name.
#   route [field] [mult]   the same move with the ledger block cut out of the
#                          go-live; the second route in SQL must refuse it and
#                          name the field.
#   oracle                 nkemdi_2031_cpr_deferred_usd moved by ten tolerances
#                          with the ledger and second-route blocks cut out; the
#                          oracle check must refuse it by name.
#   trap                   the ledger, second-route and oracle blocks cut out,
#                          and the Professional carry set to the cost price
#                          ratio read on gross revenue, read from
#                          discriminate.mjs --json; its trap must refuse.
#   prompt                 the escrow statement edited in the shipped Expert
#                          prompt; the go-live must refuse the prompt.
#   leak                   the Professional carry, to six decimals, planted in
#                          an Associate label; the SQL prompt sweep must refuse.
#   sweep                  ledger AND route at one part in 1e7 on EVERY one of
#                          the eighteen fields, one rolled-back run each.
#
# --idempotent runs the WHOLE LADDER TWICE in the one rolled-back transaction
# and requires the second pass to leave every count and digest where the first
# left it, so a re-run of any file changes nothing.
#
# Usage: dryrun_ec7.sh [ref|WORKTREE] [--control <name> [field] [mult] | --idempotent]   default HEAD
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
  REPO=${REPO:-/root/wt-ec7-nextgen}
fi
LINKED=${LINKED:-/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen}
C=${SCRATCH:-ec7-scratch}
RUN=$(mktemp -d /tmp/ec7dry.XXXXXX)
SLUG=pia
GOLIVE=20261107_ec7_pia_go_live
FILES="20261107_ec7_pia_course
20261107_ec7_pia_beginner_deep
20261107_ec7_pia_intermediate_deep
20261107_ec7_pia_advanced_deep
$GOLIVE"
KEYS="odozi_2028_liquids_royalty_rate:beginner odozi_2029_production_royalty_usd:beginner odozi_2030_hct_usd:beginner odozi_2031_dev_levy_usd:beginner odozi_total_cit_usd:beginner odozi_government_take_pct:beginner nkemdi_2028_liquids_royalty_usd:intermediate nkemdi_2029_production_allowance_usd:intermediate nkemdi_2029_hct_chargeable_profit_usd:intermediate nkemdi_2031_cpr_deferred_usd:intermediate nkemdi_cpr_forfeited_usd:intermediate nkemdi_total_cit_usd:intermediate alaku_2026_total_royalty_usd:advanced alaku_2026_hct_chargeable_profit_usd:advanced alaku_2025_tet_usd:advanced alaku_2027_dev_levy_usd:advanced alaku_2028_cit_usd:advanced alaku_total_cit_usd:advanced"
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
union all select 'economics rows',     count(*)::text from public.academy_apps where module = 'economics'
union all select 'path_order 72 held', count(*)::text from public.academy_apps where path_order = 72
union all select 'structures rows',    count(*)::text from public.academy_course_structures
union all select 'questions rows',     count(*)::text from public.academy_quiz_questions
union all select 'capstones rows',     count(*)::text from public.academy_capstones
union all select 'pia apps',        count(*)::text from public.academy_apps where slug = 'pia'
union all select 'pia any',         (select count(*) from public.academy_course_structures where app_slug = 'pia')
                                     + (select count(*) from public.academy_quiz_questions where app_slug = 'pia')
                                     + (select count(*) from public.academy_capstones where app_slug = 'pia') || ''
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
    FIELD=${FIELD_ARG:-odozi_2028_liquids_royalty_rate}
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
    FIELD=nkemdi_2031_cpr_deferred_usd; TIER=intermediate
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
    # The Professional carry with the cost price ratio cap read on gross
    # revenue (gas included), read from the engine's own wrong-method sweep,
    # with the ledger, the second route and the oracle cut out so ONLY a trap
    # can object.
    FIELD=nkemdi_2031_cpr_deferred_usd; TIER=intermediate
    WRONG=$(EC7_WAVE_DIR=$HERE node "$HERE/discriminate.mjs" --json 2>/dev/null | python3 -c "import json,sys; print(repr(json.load(sys.stdin)['$FIELD']['wrong']['cpr_on_gross_revenue']))")
    [ -n "$WRONG" ] || { echo "could not read the trap value"; exit 2; }
    PRE_GOLIVE="update public.academy_capstones c
   set fields = (select jsonb_agg(case when f->>'key' = '$FIELD' then jsonb_set(f, '{expected}', to_jsonb($WRONG::numeric)) else f end)
                   from jsonb_array_elements(c.fields) f)
 where c.app_slug = '$SLUG' and c.tier = '$TIER';"
    GOLIVE_EDIT="python3 $HERE/cut_block.py ledger route oracle"
    WANT="the trap \\(cpr on gross revenue\\) reads .*so the field does not discriminate the trap \\[graded field: $TIER/$FIELD\\]"
    ;;
  --control:prompt)
    PRE_GOLIVE="update public.academy_capstones set prompt = replace(prompt, 'is NOT met.', 'is met.')
 where app_slug = '$SLUG' and tier = 'advanced';"
    WANT="the advanced prompt is not the prompt gen_course.py rendered"
    ;;
  --control:leak)
    PLANT=$(python3 -c "import json; f=[x for x in json.load(open('$HERE/fields.json')) if x[1]=='nkemdi_2031_cpr_deferred_usd'][0]; print(f'{f[2]:.6f}')")
    PRE_GOLIVE="update public.academy_capstones c
   set fields = (select jsonb_agg(case when f->>'key' = 'odozi_2030_hct_usd'
                                       then jsonb_set(f, '{label}', to_jsonb((f->>'label') || ', against a benchmark of $PLANT'))
                                       else f end)
                   from jsonb_array_elements(c.fields) f)
 where c.app_slug = '$SLUG' and c.tier = 'beginner';"
    WANT="intermediate/nkemdi_2031_cpr_deferred_usd in the beginner capstone text"
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
    echo "create temp table ec7_pass1 as select * from ($(tr '\n' ' ' < "$RUN/snap.sql" | sed 's/;[[:space:]]*$//')) s;"
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
    echo "do \$\$ declare v_n int; begin select count(*) into v_n from ((select * from ec7_pass1 except select * from ($(tr '\n' ' ' < "$RUN/snap.sql" | sed 's/;[[:space:]]*$//')) s) union all (select * from ($(tr '\n' ' ' < "$RUN/snap.sql" | sed 's/;[[:space:]]*$//')) s except select * from ec7_pass1)) d; if v_n <> 0 then raise exception 'EC7 go-live refused: IDEMPOTENCE, the second pass of the ladder moved % snapshot row(s)', v_n; end if; raise notice 'IDEMPOTENT: the second pass left every count and digest where the first left it'; end \$\$;"
  fi
  done
  cat <<'SQL'
select 'DRY RUN' as what,
       'pia ' || a.status
       || ' | ' || (select count(*) from public.academy_course_structures where app_slug='pia' and active)::text || ' tiers'
       || ' | ' || (select count(*) from public.academy_course_structures s,
                           lateral jsonb_array_elements(s.structure->'modules') m,
                           lateral jsonb_array_elements_text(m->'lesson_keys') lk
                     where s.app_slug='pia' and s.active)::text || ' lessons'
       || ' | ' || (select count(*) from public.academy_quiz_questions where app_slug='pia')::text || ' questions ('
       || (select string_agg(n::text, '/' order by ord) from (
             select case tier when 'beginner' then 1 when 'intermediate' then 2 else 3 end ord, count(*) n
               from public.academy_quiz_questions where app_slug='pia' group by tier) t) || ')'
       || ' | ' || (select count(*) from public.academy_capstones where app_slug='pia')::text || ' capstones'
       || ' | ' || (select count(*) from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
                     where c.app_slug='pia')::text || ' graded'
       || ' | path_order ' || a.path_order::text || ' in ' || a.module
       || ' | catalogue ' || (select count(*) filter (where status='available') from public.academy_apps)::text
       || ' available / ' || (select count(*) filter (where status='coming_soon') from public.academy_apps)::text
       || ' coming_soon' as v
  from public.academy_apps a where a.slug = 'pia';
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
  if [ $FAILED = 1 ] && grep -qE "EC7 go-live refused.*$WANT" "$RUN/out.txt"; then
    echo "CONTROL $CTL FIRED:"
    grep -oE "EC7 go-live refused[^\"]*" "$RUN/out.txt" | head -2 | cut -c1-400 | sed 's/^/    /'
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
grep -q 'pia available | 3 tiers | 78 lessons | 396 questions' "$RUN/out.txt" \
  || { echo "DRY RUN DID NOT READ BACK the flipped course"; exit 2; }
if [ "$IDEMPOTENT" = 1 ]; then grep -q 'IDEMPOTENT: the second pass' "$RUN/out.txt" || { echo "THE IDEMPOTENCE CHECK DID NOT RUN"; exit 2; }; echo "IDEMPOTENT: the whole ladder ran twice in one rolled-back transaction and the second pass moved nothing."; fi
echo "DRY RUN CLEAN: all five migrations ran, the go-live's assertions all passed, and the transaction rolled back."
echo "run artefacts: $RUN"
