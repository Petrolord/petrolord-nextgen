#!/usr/bin/env bash
# =============================================================================
# carbon DRY RUN: THE WHOLE LADDER, ROLLED BACK.
#
# All five migrations run inside ONE transaction that ends in ROLLBACK. Against
# the linked project the run then RE-READS the database and compares it to the
# snapshot taken before, rather than assuming the rollback worked.
#
# APPLYING IS NOT THIS SCRIPT'S JOB. The real apply is apply_cef_carbon.sh and
# it is the owner's to run. The go-live is HELD and is dry-run here only.
#
# TARGETS.
#   TARGET=scratch  the local cef-scratch container (scratch_db.sh). The
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
#   engine     moves owaza_scope1_tco2e by two tolerances; the engine check
#              must refuse it by name.
#   route      moves igrita_trap_t_per_yr by three tolerances with the engine
#              block cut out; the second route in SQL must refuse it.
#   oracle     moves igrita_tuning_saving_gj, one of the two fields with no SQL
#              route, by three tolerances (3 GJ) with the engine and route
#              blocks cut out; the oracle must refuse it.
#   trap       the engine, route and oracle blocks cut out, and
#              igrita_pinch_cold_utility_kw set to the reading of its trap (the
#              energy balance alone, 172.54 kW, which discriminate.mjs ran
#              through the engine); the trap must refuse it.
#   prompt     the heaters' fuel edited in the shipped beginner prompt; the
#              go-live must refuse because it is not capstone.json's prompt.
#   gwp        the methane potential edited in the shipped advanced prompt
#              (29.8 to 30); the go-live must refuse because the prompt no
#              longer names the set its figures are graded on.
#   held       owaza_total_tco2e set to the same total on AR5 fossil methane,
#              a set the course prints and never grades on (H1); the held
#              check must refuse it.
#   derived    an engine-derived intermediate (the trap's absolute pressure,
#              8.213 bar a) printed in the intermediate capstone's dataset line.
#   leak       a graded value (the heater efficiency to two decimals) printed
#              in the intermediate capstone's dataset line.
#   digest     one graded value moved onto a number the digest prints (the
#              ISIOKPO heater's excess air, gate_collisions.py's own plant).
#   precision  one tolerance widened to twice what precision.json gives it.
# Every moved value was checked clear of the digest, the prompts, the held
# figures and the other graded values first, so no earlier sweep can fire in
# the control's place.
#
# Usage: dryrun_cef.sh [ref|WORKTREE] [--control <name>]     default HEAD
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
  REPO=${REPO:-/root/wt-et-carbon-nextgen}
fi
LINKED=${LINKED:-/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen}
RUN=$(mktemp -d /tmp/cefdry.XXXXXX)
SLUG=carbon
GOLIVE=${GOLIVE:-1}
FILES="20261014_cef_carbon_course
20261014_cef_carbon_beginner_deep
20261014_cef_carbon_intermediate_deep
20261014_cef_carbon_advanced_deep
20261014_cef_carbon_go_live"

if [ -n "$CONTROL" ] && [ "$TARGET" != scratch ]; then
  echo "the negative controls run on the scratch database only"; exit 2
fi

runsql() {
  if [ "$TARGET" = linked ]; then
    ( cd "$LINKED" && supabase db query --linked -f "$1" 2>&1 )
  else
    docker exec -i cef-scratch psql -U postgres -v ON_ERROR_STOP=1 -q -At < "$1" 2>&1
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
union all select 'energy_transition rows', count(*)::text from public.academy_apps where module = 'energy_transition'
union all select 'path_order 48 held', count(*)::text from public.academy_apps where path_order = 48
union all select 'path_order 49 held', count(*)::text from public.academy_apps where path_order = 49
union all select 'path_order 50 held', count(*)::text from public.academy_apps where path_order = 50
union all select 'path_order 51 held', count(*)::text from public.academy_apps where path_order = 51
union all select 'structures rows',    count(*)::text from public.academy_course_structures
union all select 'questions rows',     count(*)::text from public.academy_quiz_questions
union all select 'capstones rows',     count(*)::text from public.academy_capstones
union all select 'path_order 52 held', count(*)::text from public.academy_apps where path_order = 52
union all select 'carbon apps',        count(*)::text from public.academy_apps where slug = 'carbon'
union all select 'carbon any',         (select count(*) from public.academy_course_structures where app_slug = 'carbon')
                                     + (select count(*) from public.academy_quiz_questions where app_slug = 'carbon')
                                     + (select count(*) from public.academy_capstones where app_slug = 'carbon') || ''
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
    # 24862.76158 to 24862.78158, two tolerances.
    move owaza_scope1_tco2e beginner 24862.78158 ;;
  --control:route)
    # 469.68800466 to 469.71800466, three tolerances.
    move igrita_trap_t_per_yr intermediate 469.71800466
    GOLIVE_EDIT="python3 $HERE/cut_block.py engine" ;;
  --control:oracle)
    # 7771.999995 to 7774.999995, three tolerances of 1 GJ.
    move igrita_tuning_saving_gj intermediate 7774.999995
    GOLIVE_EDIT="python3 $HERE/cut_block.py engine route" ;;
  --control:trap)
    # The trap on this field is the energy balance alone, hot duty less cold
    # duty with no heat recovery constraint: 172.54 kW, which discriminate.mjs
    # ran through the engine as the_energy_balance_alone. 172.54 is no other
    # graded value, no held figure, no number the digest prints and no number
    # in a prompt.
    move igrita_pinch_cold_utility_kw intermediate 172.54
    GOLIVE_EDIT="python3 $HERE/cut_block.py engine route oracle" ;;
  --control:prompt)
    PRE_GOLIVE="update public.academy_capstones set prompt = replace(prompt, 'burn 356000 kmol', 'burn 356001 kmol')
 where app_slug = '$SLUG' and tier = 'beginner';" ;;
  --control:gwp)
    PRE_GOLIVE="update public.academy_capstones set prompt = replace(prompt, 'methane 29.8', 'methane 30')
 where app_slug = '$SLUG' and tier = 'advanced';" ;;
  --control:held)
    # The same total on AR5 fossil methane (30), which gen_course.py formed as
    # the held figure owaza_total_tco2e_on_ar5Fossil.
    move owaza_total_tco2e beginner 32016.393017 ;;
  --control:derived)
    # The trap's absolute pressure, 8.213 bar a, which the prompt never prints.
    PRE_GOLIVE="update public.academy_capstones set dataset = dataset || ' (upstream at 8.213 bar a)'
 where app_slug = '$SLUG' and tier = 'intermediate';" ;;
  --control:leak)
    # The heater efficiency, 85.021597, to two decimals.
    PRE_GOLIVE="update public.academy_capstones set dataset = dataset || ' (about 85.02 percent)'
 where app_slug = '$SLUG' and tier = 'intermediate';" ;;
  --control:digest)
    # 32.1223 is the ISIOKPO heater's excess air, which the digest prints
    # (gate_collisions.py's own plant).
    move igrita_excess_air_pct intermediate 32.1223 ;;
  --control:precision)
    PRE_GOLIVE="update public.academy_capstones c
   set fields = (select jsonb_agg(case when f->>'key' = 'owaza_heater_co2_t' then jsonb_set(f, '{tol}', to_jsonb(0.02)) else f end order by o)
                   from jsonb_array_elements(c.fields) with ordinality x(f, o))
 where c.app_slug = '$SLUG' and c.tier = 'beginner';" ;;
  *) echo "unknown control $CTL"; exit 2 ;;
esac

{
  echo "begin;"
  for f in $FILES; do
    echo "-- ================= $f"
    if [ "$f" = 20261014_cef_carbon_go_live ]; then
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
       'carbon ' || a.status
       || ' | ' || (select count(*) from public.academy_course_structures where app_slug='carbon' and active)::text || ' tiers'
       || ' | ' || (select count(*) from public.academy_course_structures s,
                           lateral jsonb_array_elements(s.structure->'modules') m,
                           lateral jsonb_array_elements_text(m->'lesson_keys') lk
                     where s.app_slug='carbon' and s.active)::text || ' lessons'
       || ' | ' || (select count(*) from public.academy_quiz_questions where app_slug='carbon')::text || ' questions ('
       || (select string_agg(n::text, '/' order by ord) from (
             select case tier when 'beginner' then 1 when 'intermediate' then 2 else 3 end ord, count(*) n
               from public.academy_quiz_questions where app_slug='carbon' group by tier) t) || ')'
       || ' | ' || (select count(*) from public.academy_capstones where app_slug='carbon')::text || ' capstones'
       || ' | ' || (select count(*) from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
                     where c.app_slug='carbon')::text || ' graded'
       || ' | path_order ' || a.path_order::text || ' in ' || a.module
       || ' | catalogue ' || (select count(*) filter (where status='available') from public.academy_apps)::text
       || ' available / ' || (select count(*) filter (where status='coming_soon') from public.academy_apps)::text
       || ' coming_soon' as v
  from public.academy_apps a where a.slug = 'carbon';
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
    engine) WANT="the engine returned through carbon_capstone.mjs" ;;
    route) WANT="the second route in SQL gives" ;;
    oracle) WANT="the oracle gives" ;;
    trap) WANT="so the field does not discriminate the trap" ;;
    prompt) WANT="is not the prompt capstone.json carries" ;;
    gwp) WANT="does not name the GWP set its figures are graded on" ;;
    held) WANT="are a HELD figure" ;;
    derived) WANT="engine-derived intermediate" ;;
    leak) WANT="graded field(s) are printed in a capstone a learner reads" ;;
    digest) WANT="a number the digest prints" ;;
    precision) WANT="at their precision.json tolerance" ;;
  esac
  # The control must fire THROUGH THE CHECK IT IS FOR. A refusal from some
  # other check (the pairwise sweep, say) proves nothing about this one.
  if [ $FAILED = 1 ] && grep -qF "carbon go-live refused" "$RUN/out.txt" && grep -F "carbon go-live refused" "$RUN/out.txt" | grep -qF "$WANT"; then
    echo "CONTROL $CTL FIRED:"
    grep -oE "carbon go-live refused[^\"]*" "$RUN/out.txt" | head -2 | cut -c1-300 | sed 's/^/    /'
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
