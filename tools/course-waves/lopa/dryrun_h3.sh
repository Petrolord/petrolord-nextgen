#!/usr/bin/env bash
# =============================================================================
# H3 DRY RUN: THE WHOLE LADDER, ROLLED BACK.
#
# All five migrations run inside ONE transaction that ends in ROLLBACK. The run
# then RE-READS the database and compares it with the snapshot taken before,
# rather than assuming the rollback worked.
#
# APPLYING IS NOT THIS SCRIPT'S JOB. The real apply is apply_h3_lopa.sh
# and it is the owner's to run. The go-live is HELD and is dry-run here only.
#
# TARGETS.
#   TARGET=scratch  the local h3-scratch container (scratch_db.sh). The default,
#                   and the only target the negative controls run on.
#   TARGET=linked   the linked NextGen project, which is PRODUCTION, from the
#                   linked checkout. Clean run only, rolled back, with the
#                   before and after snapshot compared. Nothing may commit.
#
# THE NEGATIVE CONTROLS (scratch only). A dry run that passes proves nothing
# unless the same run can be made to fail, and each of the go-live's
# independent checks has to be shown to fire ON ITS OWN:
#   ledger [field] [mult]  moves one graded value by a factor (default
#                          usan_mitigated_frequency_with_sif_per_yr, the
#                          SMALLEST graded value, by 1.0000001: an absolute move
#                          of 4.4e-14, under a tenth of its 5e-13 tolerance, so
#                          a grader would pass it); the engine-ledger check must
#                          refuse it by name.
#   route [field] [mult]   the same move with the ledger block cut out of the
#                          go-live; the second route in SQL must refuse it and
#                          name the field.
#   trap                   the ledger and second-route blocks cut out, and the
#                          Associate separator row's required RRF set to what
#                          crediting its NON-INDEPENDENT trip as well gives;
#                          the trap for that field must refuse.
#   prompt                 the single valve's lifetime edited in the shipped
#                          Expert prompt; the go-live must refuse the prompt.
#   leak                   the Professional SIF RRF, to six decimals, planted in
#                          an Associate label; the SQL promptleak must refuse.
#   sweep                  ledger AND route at one part in 1e7 on EVERY one of
#                          the eighteen fields, one rolled-back run each.
#
# Usage: dryrun_h3.sh [ref|WORKTREE] [--control <name> [field] [mult]]   default HEAD
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
  REPO=${REPO:-/root/wt-h3-nextgen}
fi
LINKED=${LINKED:-/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen}
C=${SCRATCH:-h3-scratch}
RUN=$(mktemp -d /tmp/h3dry.XXXXXX)
SLUG=lopa
GOLIVE=20261005_h3_lopa_go_live
FILES="20261005_h3_lopa_course
20261005_h3_lopa_beginner_deep
20261005_h3_lopa_intermediate_deep
20261005_h3_lopa_advanced_deep
$GOLIVE"
KEYS="akpo_separator_unmitigated_frequency_per_yr:beginner akpo_separator_required_rrf:beginner akpo_tank_mitigated_frequency_without_sif_per_yr:beginner
akpo_tank_required_sif_pfdavg:beginner akpo_compressor_mitigated_frequency_with_sif_per_yr:beginner akpo_export_catalogue_sif_mitigated_frequency_per_yr:beginner
usan_transmitters_2oo3_pfdavg:intermediate usan_logic_solver_1oo1_pfdavg:intermediate usan_valves_1oo2_pfdavg:intermediate
usan_sif_rrf:intermediate usan_proposed_2oo2_transmitters_pfdavg:intermediate usan_mitigated_frequency_with_sif_per_yr:intermediate
yoho_valves_1oo2_max_interval_hours:advanced yoho_valve_1oo1_ptc_pfdavg:advanced yoho_valve_1oo1_ptc_max_interval_hours:advanced
yoho_transmitter_ptc_floor_pfdavg:advanced yoho_sif_rrf_at_three_year_interval:advanced yoho_transmitters_2oo3_max_interval_hours:advanced"
tier_of() { for kt in $KEYS; do [ "${kt%%:*}" = "$1" ] && { echo "${kt##*:}"; return; }; done; echo ""; }

if [ -n "$CONTROL" ] && [ "$TARGET" != scratch ]; then
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
union all select 'hse rows',           count(*)::text from public.academy_apps where module = 'hse'
union all select 'path_order 63 held', count(*)::text from public.academy_apps where path_order = 63
union all select 'structures rows',    count(*)::text from public.academy_course_structures
union all select 'questions rows',     count(*)::text from public.academy_quiz_questions
union all select 'capstones rows',     count(*)::text from public.academy_capstones
union all select 'lopa apps',   count(*)::text from public.academy_apps where slug = 'lopa'
union all select 'lopa any',    (select count(*) from public.academy_course_structures where app_slug = 'lopa')
                                     + (select count(*) from public.academy_quiz_questions where app_slug = 'lopa')
                                     + (select count(*) from public.academy_capstones where app_slug = 'lopa') || ''
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
WANT=""
FIELD=""
case "$CONTROL:$CTL" in
  :) ;;
  --control:ledger|--control:route)
    FIELD=${FIELD_ARG:-usan_mitigated_frequency_with_sif_per_yr}
    TIER=$(tier_of "$FIELD"); [ -n "$TIER" ] || { echo "unknown field $FIELD"; exit 2; }
    PRE_GOLIVE=$(move_sql "$FIELD" "$TIER" "$MULT")
    if [ "$CTL" = ledger ]; then
      WANT="the engine returned \[graded field: $TIER/$FIELD\]"
    else
      GOLIVE_EDIT="python3 $HERE/cut_block.py ledger"
      WANT="\[graded field: [^]]*$TIER/$FIELD"
    fi
    ;;
  --control:trap)
    # The separator row's required RRF with its non-independent BPCS trip
    # credited as well, computed in the engine's operation order, the first
    # wrong method discriminate.mjs aims at it, with the ledger and the second
    # route cut out so ONLY the trap can object.
    FIELD=akpo_separator_required_rrf; TIER=beginner
    WRONG=$(python3 -c "print(repr(((((0.37 * (1.0 * 0.23)) * ((1.0 * 0.42) * 0.18)) * ((1.0 * 0.1) * 0.1)) / 1e-05)))")
    PRE_GOLIVE="update public.academy_capstones c
   set fields = (select jsonb_agg(case when f->>'key' = '$FIELD' then jsonb_set(f, '{expected}', to_jsonb($WRONG::numeric)) else f end)
                   from jsonb_array_elements(c.fields) f)
 where c.app_slug = '$SLUG' and c.tier = '$TIER';"
    GOLIVE_EDIT="python3 $HERE/cut_block.py ledger route"
    WANT="the non independent ipl credited gives .*so the field does not discriminate the trap"
    ;;
  --control:prompt)
    PRE_GOLIVE="update public.academy_capstones set prompt = replace(prompt, 'a lifetime of 105120 hours', 'a lifetime of 105130 hours')
 where app_slug = '$SLUG' and tier = 'advanced';"
    WANT="the advanced prompt is not the prompt gen_course.py rendered"
    ;;
  --control:leak)
    PRE_GOLIVE="update public.academy_capstones c
   set fields = (select jsonb_agg(case when f->>'key' = 'akpo_separator_unmitigated_frequency_per_yr'
                                       then jsonb_set(f, '{label}', to_jsonb((f->>'label') || ', against a benchmark of 629.698020'))
                                       else f end)
                   from jsonb_array_elements(c.fields) f)
 where c.app_slug = '$SLUG' and c.tier = 'beginner';"
    WANT="intermediate/usan_sif_rrf in the beginner capstone text"
    ;;
  --control:sweep)
    fails=0
    for kt in $KEYS; do
      for mode in ledger route; do
        OUT=$("$0" "$REF" --control "$mode" "${kt%%:*}" "$MULT" 2>&1)
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
  *) echo "unknown control $CTL"; exit 2 ;;
esac

echo "repo: $REPO   ref: $REF   target: $TARGET"
echo "### THE DATABASE BEFORE"
snap | sed 's/^/  /' | tee "$RUN/before.txt"

{
  [ "$TARGET" = scratch ] && echo '\set ON_ERROR_STOP on'
  echo "begin;"
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
  cat <<'SQL'
select 'DRY RUN' as what,
       'lopa ' || a.status
       || ' | ' || (select count(*) from public.academy_course_structures where app_slug='lopa' and active)::text || ' tiers'
       || ' | ' || (select count(*) from public.academy_course_structures s,
                           lateral jsonb_array_elements(s.structure->'modules') m,
                           lateral jsonb_array_elements_text(m->'lesson_keys') lk
                     where s.app_slug='lopa' and s.active)::text || ' lessons'
       || ' | ' || (select count(*) from public.academy_quiz_questions where app_slug='lopa')::text || ' questions ('
       || (select string_agg(n::text, '/' order by ord) from (
             select case tier when 'beginner' then 1 when 'intermediate' then 2 else 3 end ord, count(*) n
               from public.academy_quiz_questions where app_slug='lopa' group by tier) t) || ')'
       || ' | ' || (select count(*) from public.academy_capstones where app_slug='lopa')::text || ' capstones'
       || ' | ' || (select count(*) from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
                     where c.app_slug='lopa')::text || ' graded'
       || ' | path_order ' || a.path_order::text || ' in ' || a.module
       || ' | catalogue ' || (select count(*) filter (where status='available') from public.academy_apps)::text
       || ' available / ' || (select count(*) filter (where status='coming_soon') from public.academy_apps)::text
       || ' coming_soon' as v
  from public.academy_apps a where a.slug = 'lopa';
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
if [ -n "$CONTROL" ]; then
  # The control must fire THROUGH THE CHECK IT IS FOR. A refusal from some
  # other check (the pairwise sweep, say) proves nothing about this one.
  if [ $FAILED = 1 ] && grep -qE "H3 go-live refused.*$WANT" "$RUN/out.txt"; then
    echo "CONTROL $CTL FIRED:"
    grep -oE "H3 go-live refused[^\"]*" "$RUN/out.txt" | head -2 | cut -c1-400 | sed 's/^/    /'
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
grep -q 'lopa available | 3 tiers | 78 lessons | 396 questions' "$RUN/out.txt" \
  || { echo "DRY RUN DID NOT READ BACK the flipped course"; exit 2; }
echo "DRY RUN CLEAN: all five migrations ran, the go-live's assertions all passed, and the transaction rolled back."
echo "run artefacts: $RUN"
