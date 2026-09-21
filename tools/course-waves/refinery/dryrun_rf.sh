#!/usr/bin/env bash
# =============================================================================
# refinery DRY RUN: THE WHOLE LADDER, ROLLED BACK.
#
# All five migrations run inside ONE transaction that ends in ROLLBACK. Against
# the linked project the run then RE-READS the database and compares it to the
# snapshot taken before, rather than assuming the rollback worked.
#
# APPLYING IS NOT THIS SCRIPT'S JOB. The real apply is apply_rf_refinery.sh and
# it is the owner's to run. The go-live is HELD and is dry-run here only.
#
# TARGETS.
#   TARGET=scratch  the local rf-scratch container (scratch_db.sh). The default,
#                   and the only target the negative controls run on.
#   TARGET=linked   the linked NextGen project, which is PRODUCTION, from the
#                   linked checkout. Clean run only, rolled back, with the
#                   before and after snapshot compared.
#   NO_GOLIVE=1     run the four seeds only (the catalogue counts a seed alone
#                   leaves), still rolled back.
#
# THE NEGATIVE CONTROLS (scratch only). A dry run that passes proves nothing
# unless the same run can be made to fail, and each of the go-live's checks has
# to be shown to fire ON ITS OWN, through its own message:
#   engine     moves koloama_cost_variance_usd by one dollar (twice its
#              tolerance); the engine check must refuse it by name.
#   route      the same move with the engine block cut out; the second route
#              in SQL must refuse it by name.
#   route_screen, route_plan, route_tax  the same on the three other kinds of
#              SQL route: the IKARAMA screen (ikarama_gross_margin_per_bbl by
#              one cent), the arithmetic on the oracle's AMASSOMA plan
#              (amassoma_gross_margin_per_bbl by one cent) and the KOLOAMA tax
#              ledger (koloama_first_tax_mm by 0.0001).
#   oracle     moves amassoma_naphtha_value_per_bbl by one cent (twice its
#              tolerance) with the engine block cut out: the stream value has
#              no SQL route, so the ORACLE's exact run must refuse it by name.
#   trap       the engine, second-route and oracle blocks cut out, and
#              koloama_diesel_volume_variance_usd set to the closest wrong
#              route (the lift priced at the actual price, 665420); the trap
#              must refuse.
#   prompt     the cargo size in the shipped Expert prompt edited; the go-live
#              must refuse because it is not capstone.json's prompt.
#   derived    a plan volume the engine derives (Amenam's 680000 barrels)
#              printed in a capstone's dataset line.
#   digest     one graded value moved onto a number the digest prints (ABUA's
#              margin, gate_collisions.py's own plant).
#   npv        one graded key renamed to name an NPV; the course grades none.
#   tol        one tolerance loosened off its precision class.
#
# Usage: dryrun_rf.sh [ref|WORKTREE] [--control <name>]     default HEAD
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
  REPO=${REPO:-/root/wt-md-refinery-nextgen}
fi
LINKED=${LINKED:-/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen}
RUN=$(mktemp -d /tmp/rfdry.XXXXXX)
SLUG=refinery
FILES="20261011_rf_refinery_course
20261011_rf_refinery_beginner_deep
20261011_rf_refinery_intermediate_deep
20261011_rf_refinery_advanced_deep
20261011_rf_refinery_go_live"

if [ -n "$CONTROL" ] && [ "$TARGET" != scratch ]; then
  echo "the negative controls run on the scratch database only"; exit 2
fi

runsql() {
  if [ "$TARGET" = linked ]; then
    ( cd "$LINKED" && supabase db query --linked -f "$1" 2>&1 )
  else
    docker exec -i rf-scratch psql -U postgres -v ON_ERROR_STOP=1 -q -At < "$1" 2>&1
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
union all select 'commercial rows',    count(*)::text from public.academy_apps where module = 'commercial_trading'
union all select 'path_order 48 held', count(*)::text from public.academy_apps where path_order = 48
union all select 'path_order 50 held', count(*)::text from public.academy_apps where path_order = 50
union all select 'structures rows',    count(*)::text from public.academy_course_structures
union all select 'questions rows',     count(*)::text from public.academy_quiz_questions
union all select 'capstones rows',     count(*)::text from public.academy_capstones
union all select 'path_order 49 held', count(*)::text from public.academy_apps where path_order = 49
union all select 'refinery apps',      count(*)::text from public.academy_apps where slug = 'refinery'
union all select 'refinery any',       (select count(*) from public.academy_course_structures where app_slug = 'refinery')
                                     + (select count(*) from public.academy_quiz_questions where app_slug = 'refinery')
                                     + (select count(*) from public.academy_capstones where app_slug = 'refinery') || ''
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
  --control:engine|--control:route|--control:route_screen|--control:route_plan|--control:route_tax|--control:oracle|--control:trap)
    case $CTL in
      route_screen)
        # 14.32 to 14.33, two tolerances, on the IKARAMA screen's SQL route.
        FIELD=ikarama_gross_margin_per_bbl; TIER=beginner; MOVE="to_jsonb(14.33)" ;;
      route_plan)
        # 4.34614043 to 4.35614043, on the SQL arithmetic over the oracle's AMASSOMA plan.
        FIELD=amassoma_gross_margin_per_bbl; TIER=intermediate; MOVE="to_jsonb(4.35614043)" ;;
      route_tax)
        # 0.9071033584 to 0.9072033584, on the SQL tax ledger of the KOLOAMA expansion.
        FIELD=koloama_first_tax_mm; TIER=advanced; MOVE="to_jsonb(0.9072033584)" ;;
      engine|route)
        # 2184380 to 2184381: twice the tolerance, no other field carries it,
        # the digest does not print it and no prompt does, so no earlier sweep
        # can fire in its place.
        FIELD=koloama_cost_variance_usd; TIER=advanced; MOVE="to_jsonb(2184381)" ;;
      oracle)
        # 91.32 to 91.33, two tolerances: a stream value, whose only second
        # route is the oracle.
        FIELD=amassoma_naphtha_value_per_bbl; TIER=intermediate; MOVE="to_jsonb(91.33)" ;;
      trap)
        # The closest wrong route on this field prices the diesel lifts at the
        # ACTUAL price: 665420. Set as the graded answer with the engine, the
        # second route and the oracle cut out, so ONLY the trap can object.
        FIELD=koloama_diesel_volume_variance_usd; TIER=advanced; MOVE="to_jsonb(665420)" ;;
    esac
    PRE_GOLIVE="update public.academy_capstones c
   set fields = (select jsonb_agg(case when f->>'key' = '$FIELD' then jsonb_set(f, '{expected}', $MOVE) else f end order by o)
                   from jsonb_array_elements(c.fields) with ordinality x(f, o))
 where c.app_slug = '$SLUG' and c.tier = '$TIER';"
    case $CTL in
      route|route_screen|route_plan|route_tax)  GOLIVE_EDIT="python3 $HERE/cut_block.py engine" ;;
      oracle) GOLIVE_EDIT="python3 $HERE/cut_block.py engine" ;;
      trap)   GOLIVE_EDIT="python3 $HERE/cut_block.py engine route oracle" ;;
    esac
    ;;
  --control:prompt)
    PRE_GOLIVE="update public.academy_capstones set prompt = replace(prompt, 'cargo size of 450000', 'cargo size of 460000')
 where app_slug = '$SLUG' and tier = 'advanced';" ;;
  --control:derived)
    PRE_GOLIVE="update public.academy_capstones set dataset = dataset || ' (Amenam runs 680000 barrels)'
 where app_slug = '$SLUG' and tier = 'intermediate';" ;;
  --control:digest)
    # 7077935.48 is ABUA's plan margin, which the digest prints (gate_collisions.py's own plant).
    PRE_GOLIVE="update public.academy_capstones c
   set fields = (select jsonb_agg(case when f->>'key' = 'amassoma_plan_margin_usd' then jsonb_set(f, '{expected}', to_jsonb(7077935.48)) else f end order by o)
                   from jsonb_array_elements(c.fields) with ordinality x(f, o))
 where c.app_slug = '$SLUG' and c.tier = 'intermediate';" ;;
  --control:npv)
    PRE_GOLIVE="update public.academy_capstones c
   set fields = (select jsonb_agg(case when f->>'key' = 'koloama_lifetime_tax_mm' then jsonb_set(f, '{key}', to_jsonb('koloama_npv_mm'::text)) else f end order by o)
                   from jsonb_array_elements(c.fields) with ordinality x(f, o))
 where c.app_slug = '$SLUG' and c.tier = 'advanced';" ;;
  --control:tol)
    PRE_GOLIVE="update public.academy_capstones c
   set fields = (select jsonb_agg(case when f->>'key' = 'ikarama_gross_value_per_bbl' then jsonb_set(f, '{tol}', to_jsonb(0.05)) else f end order by o)
                   from jsonb_array_elements(c.fields) with ordinality x(f, o))
 where c.app_slug = '$SLUG' and c.tier = 'beginner';" ;;
  *) echo "unknown control $CTL"; exit 2 ;;
esac

{
  echo "begin;"
  for f in $FILES; do
    echo "-- ================= $f"
    if [ "$f" = 20261011_rf_refinery_go_live ]; then
      [ -n "${NO_GOLIVE:-}" ] && { echo "-- ================= (go-live left out: NO_GOLIVE)"; continue; }
      [ -n "$PRE_GOLIVE" ] && { echo "-- ================= NEGATIVE CONTROL $CTL"; echo "$PRE_GOLIVE"; }
      fetch "$f" | $GOLIVE_EDIT || exit 3
    else
      fetch "$f" || exit 3
    fi
    echo
  done
  cat <<'SQL'
select 'DRY RUN' as what,
       'refinery ' || a.status
       || ' | ' || (select count(*) from public.academy_course_structures where app_slug='refinery' and active)::text || ' tiers'
       || ' | ' || (select count(*) from public.academy_course_structures s,
                           lateral jsonb_array_elements(s.structure->'modules') m,
                           lateral jsonb_array_elements_text(m->'lesson_keys') lk
                     where s.app_slug='refinery' and s.active)::text || ' lessons'
       || ' | ' || (select count(*) from public.academy_quiz_questions where app_slug='refinery')::text || ' questions ('
       || (select string_agg(n::text, '/' order by ord) from (
             select case tier when 'beginner' then 1 when 'intermediate' then 2 else 3 end ord, count(*) n
               from public.academy_quiz_questions where app_slug='refinery' group by tier) t) || ')'
       || ' | ' || (select count(*) from public.academy_capstones where app_slug='refinery')::text || ' capstones'
       || ' | ' || (select count(*) from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
                     where c.app_slug='refinery')::text || ' graded'
       || ' | path_order ' || a.path_order::text || ' in ' || a.module
       || ' | catalogue ' || (select count(*) filter (where status='available') from public.academy_apps)::text
       || ' available / ' || (select count(*) filter (where status='coming_soon') from public.academy_apps)::text
       || ' coming_soon' as v
  from public.academy_apps a where a.slug = 'refinery';
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
    engine) WANT="the engine returned through refinery_capstone.mjs" ;;
    route|route_screen|route_plan|route_tax) WANT="the second route in SQL gives" ;;
    oracle) WANT="the oracle gives" ;;
    trap) WANT="so the field does not discriminate the trap" ;;
    prompt) WANT="is not the prompt capstone.json carries" ;;
    derived) WANT="engine-derived figure" ;;
    digest) WANT="a number the digest prints" ;;
    npv) WANT="name an NPV or an IRR" ;;
    tol) WANT="not a number at their precision class tolerance" ;;
  esac
  # The control must fire THROUGH THE CHECK IT IS FOR. A refusal from some
  # other check (the pairwise sweep, say) proves nothing about this one.
  if [ $FAILED = 1 ] && grep -q "refinery go-live refused.*$WANT" "$RUN/out.txt"; then
    echo "CONTROL $CTL FIRED:"
    grep -oE "refinery go-live refused[^\"]*" "$RUN/out.txt" | head -2 | cut -c1-300 | sed 's/^/    /'
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
if [ -n "${NO_GOLIVE:-}" ]; then echo "DRY RUN CLEAN: the four seeds ran (no go-live), and the transaction rolled back."; else echo "DRY RUN CLEAN: all five migrations ran, the go-live's assertions all passed, and the transaction rolled back."; fi
echo "run artefacts: $RUN"
