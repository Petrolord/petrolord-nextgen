#!/usr/bin/env bash
# =============================================================================
# gasvalue DRY RUN: THE WHOLE LADDER, ROLLED BACK.
#
# All five migrations run inside ONE transaction that ends in ROLLBACK. Against
# the linked project the run then RE-READS the database and compares it to the
# snapshot taken before, rather than assuming the rollback worked.
#
# APPLYING IS NOT THIS SCRIPT'S JOB. The real apply is apply_gv_gasvalue.sh and
# it is the owner's to run. The go-live is HELD and is dry-run here only.
#
# TARGETS.
#   TARGET=scratch  the local gv-scratch container (scratch_db.sh). The
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
#   engine     moves eriemu_flare_ch4_t by two tolerances; the engine check
#              must refuse it by name.
#   route      moves adibawa_value_per_mscf by three tolerances with the
#              engine block cut out; the second route in SQL must refuse it.
#   oracle     moves asaba_bank_mass_kg, one of the two fields with no SQL
#              route, by three tolerances with the engine and route blocks cut
#              out; the oracle must refuse it.
#   trap       the engine, route and oracle blocks cut out, and
#              asaba_payback_years set to the reading of its closest trap (the
#              extra maintenance left out of the saving), which discriminate.mjs
#              ran through the engine; the trap must refuse it.
#   prompt     the ERIEMU flare volume edited in the shipped beginner prompt;
#              the go-live must refuse because it is not capstone.json's prompt.
#   derived    an engine-derived intermediate (the vaporizer's duty before its
#              margin, 102.91 kW) printed in the intermediate capstone's dataset.
#   count      a derived count (the 48 taxis the cascade fills before
#              recharge) printed as a whole number in the beginner dataset.
#   leak       a graded value (the ERIEMU flare CO2e to two decimals) printed
#              in the advanced capstone's dataset line.
#   digest     one graded value moved onto a number the digest prints (EGBEMA's
#              heating value, gate_collisions.py's plant).
#   precision  one tolerance widened to twice what precision.json gives it.
#   sibling    the carbon slot (52) held by another course.
#   neighbour  the supply slot (50) held by another course.
# Every moved value was checked clear of the digest, the prompts and the other
# graded values first, so no earlier sweep can fire in the control's place.
#
# Usage: dryrun_gv.sh [ref|WORKTREE] [--control <name>]     default HEAD
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
  REPO=${REPO:-/root/wt-et-gasvalue-nextgen}
fi
LINKED=${LINKED:-/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen}
RUN=$(mktemp -d /tmp/gvdry.XXXXXX)
SLUG=gasvalue
GOLIVE=${GOLIVE:-1}
FILES="20261013_gv_gasvalue_course
20261013_gv_gasvalue_beginner_deep
20261013_gv_gasvalue_intermediate_deep
20261013_gv_gasvalue_advanced_deep
20261013_gv_gasvalue_go_live"

if [ -n "$CONTROL" ] && [ "$TARGET" != scratch ]; then
  echo "the negative controls run on the scratch database only"; exit 2
fi

runsql() {
  if [ "$TARGET" = linked ]; then
    ( cd "$LINKED" && supabase db query --linked -f "$1" 2>&1 )
  else
    docker exec -i gv-scratch psql -U postgres -v ON_ERROR_STOP=1 -q -At < "$1" 2>&1
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
union all select 'path_order 50 held', count(*)::text from public.academy_apps where path_order = 50
union all select 'path_order 52 held', count(*)::text from public.academy_apps where path_order = 52
union all select 'structures rows',    count(*)::text from public.academy_course_structures
union all select 'questions rows',     count(*)::text from public.academy_quiz_questions
union all select 'capstones rows',     count(*)::text from public.academy_capstones
union all select 'path_order 51 held', count(*)::text from public.academy_apps where path_order = 51
union all select 'gasvalue apps',      count(*)::text from public.academy_apps where slug = 'gasvalue'
union all select 'gasvalue any',       (select count(*) from public.academy_course_structures where app_slug = 'gasvalue')
                                     + (select count(*) from public.academy_quiz_questions where app_slug = 'gasvalue')
                                     + (select count(*) from public.academy_capstones where app_slug = 'gasvalue') || ''
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
    # 1440.251 to 1440.271, two tolerances.
    move eriemu_flare_ch4_t beginner 1440.271 ;;
  --control:route)
    # 5.689023 to 5.689323, three tolerances.
    move adibawa_value_per_mscf intermediate 5.689323
    GOLIVE_EDIT="python3 $HERE/cut_block.py engine" ;;
  --control:oracle)
    # 630.12764 to 630.12794, three tolerances.
    move asaba_bank_mass_kg advanced 630.12794
    GOLIVE_EDIT="python3 $HERE/cut_block.py engine route" ;;
  --control:trap)
    # The closest trap on this field leaves the extra maintenance out of the
    # saving: 0.389232 years, which discriminate.mjs ran through the engine as
    # extra_maintenance_left_out. 0.389232 is no other graded value, no number
    # the digest prints and no number in a prompt.
    move asaba_payback_years advanced 0.389232
    GOLIVE_EDIT="python3 $HERE/cut_block.py engine route oracle" ;;
  --control:prompt)
    PRE_GOLIVE="update public.academy_capstones set prompt = replace(prompt, 'flares 12.4 MMscfd', 'flares 12.5 MMscfd')
 where app_slug = '$SLUG' and tier = 'beginner';" ;;
  --control:derived)
    # The vaporizer's duty before its margin, 102.91266 kW, which the prompt
    # never prints.
    PRE_GOLIVE="update public.academy_capstones set dataset = dataset || ' (about 102.91 kW before margin)'
 where app_slug = '$SLUG' and tier = 'intermediate';" ;;
  --control:count)
    # The fills before recharge, 48, as a whole number.
    PRE_GOLIVE="update public.academy_capstones set dataset = dataset || ' (48 taxis a recharge)'
 where app_slug = '$SLUG' and tier = 'beginner';" ;;
  --control:leak)
    # The ERIEMU flare CO2e, 339138.908, to two decimals.
    PRE_GOLIVE="update public.academy_capstones set dataset = dataset || ' (about 339138.91 t)'
 where app_slug = '$SLUG' and tier = 'advanced';" ;;
  --control:digest)
    # 1248.411 is EGBEMA's heating value, which the digest prints
    # (gate_collisions.py's own plant).
    move eriemu_ghv_btu_scf beginner 1248.411 ;;
  --control:precision)
    PRE_GOLIVE="update public.academy_capstones c
   set fields = (select jsonb_agg(case when f->>'key' = 'eriemu_ghv_btu_scf' then jsonb_set(f, '{tol}', to_jsonb(0.0002)) else f end order by o)
                   from jsonb_array_elements(c.fields) with ordinality x(f, o))
 where c.app_slug = '$SLUG' and c.tier = 'beginner';" ;;
  --control:sibling)
    PRE_GOLIVE="delete from public.academy_apps where slug = 'carbon';
insert into public.academy_apps (slug, name, module, path_order, status) values ('intruder', 'Intruder', 'other', 52, 'coming_soon');" ;;
  --control:neighbour)
    PRE_GOLIVE="update public.academy_apps set slug = 'intruder' where slug = 'supply';" ;;
  *) echo "unknown control $CTL"; exit 2 ;;
esac

{
  echo "begin;"
  for f in $FILES; do
    echo "-- ================= $f"
    if [ "$f" = 20261013_gv_gasvalue_go_live ]; then
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
       'gasvalue ' || a.status
       || ' | ' || (select count(*) from public.academy_course_structures where app_slug='gasvalue' and active)::text || ' tiers'
       || ' | ' || (select count(*) from public.academy_course_structures s,
                           lateral jsonb_array_elements(s.structure->'modules') m,
                           lateral jsonb_array_elements_text(m->'lesson_keys') lk
                     where s.app_slug='gasvalue' and s.active)::text || ' lessons'
       || ' | ' || (select count(*) from public.academy_quiz_questions where app_slug='gasvalue')::text || ' questions ('
       || (select string_agg(n::text, '/' order by ord) from (
             select case tier when 'beginner' then 1 when 'intermediate' then 2 else 3 end ord, count(*) n
               from public.academy_quiz_questions where app_slug='gasvalue' group by tier) t) || ')'
       || ' | ' || (select count(*) from public.academy_capstones where app_slug='gasvalue')::text || ' capstones'
       || ' | ' || (select count(*) from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
                     where c.app_slug='gasvalue')::text || ' graded'
       || ' | path_order ' || a.path_order::text || ' in ' || a.module
       || ' | catalogue ' || (select count(*) filter (where status='available') from public.academy_apps)::text
       || ' available / ' || (select count(*) filter (where status='coming_soon') from public.academy_apps)::text
       || ' coming_soon' as v
  from public.academy_apps a where a.slug = 'gasvalue';
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
    engine) WANT="the engine returned through gasvalue_capstone.mjs" ;;
    route) WANT="the second route in SQL gives" ;;
    oracle) WANT="the oracle gives" ;;
    trap) WANT="so the field does not discriminate the trap" ;;
    prompt) WANT="is not the prompt capstone.json carries" ;;
    derived) WANT="engine-derived intermediate" ;;
    count) WANT="engine-derived count(s) are printed as a whole number" ;;
    leak) WANT="graded field(s) are printed in a capstone a learner reads" ;;
    digest) WANT="a number the digest prints" ;;
    precision) WANT="at their precision.json tolerance" ;;
    sibling) WANT="the slot of the wave sibling carbon" ;;
    neighbour) WANT="the slot of the live course supply" ;;
  esac
  # The control must fire THROUGH THE CHECK IT IS FOR. A refusal from some
  # other check (the pairwise sweep, say) proves nothing about this one.
  if [ $FAILED = 1 ] && grep -qF "gasvalue go-live refused" "$RUN/out.txt" && grep -F "gasvalue go-live refused" "$RUN/out.txt" | grep -qF "$WANT"; then
    echo "CONTROL $CTL FIRED:"
    grep -oE "gasvalue go-live refused[^\"]*" "$RUN/out.txt" | head -2 | cut -c1-300 | sed 's/^/    /'
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
