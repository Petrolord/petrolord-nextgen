#!/usr/bin/env bash
# =============================================================================
# crude DRY RUN: THE WHOLE LADDER, ROLLED BACK.
#
# All five migrations run inside ONE transaction that ends in ROLLBACK. Against
# the linked project the run then RE-READS the database and compares it to the
# snapshot taken before, rather than assuming the rollback worked.
#
# APPLYING IS NOT THIS SCRIPT'S JOB. The real apply is apply_cr_crude.sh and
# it is the owner's to run. The go-live is HELD and is dry-run here only.
#
# TARGETS.
#   TARGET=scratch  the local cr-scratch container (scratch_db.sh). The
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
#   engine     moves idama_blend_cii by two tolerances; the engine check must
#              refuse it by name.
#   route      moves ogbele_blend_t50_f by three tolerances with the engine
#              block cut out; the second route in SQL must refuse it.
#   oracle     moves onne_fcc_volume_bbl, an Expert field with no SQL route, by
#              three tolerances with the engine and route blocks cut out; the
#              oracle must refuse it.
#   bracket    moves onne_rvp_relief_usd_per_psi to 6495.117865, inside the
#              tolerance of the oracle's mean but outside its two one-sided
#              quotients, with the engine block cut out; the relief bracket
#              must refuse it.
#   trap       the engine, route and oracle blocks cut out, and
#              idama_blend_sulfur_wtpct set to the reading of its trap (sulfur
#              blended on volume); the trap must refuse it.
#   prompt     the Idama Light API edited in the shipped beginner prompt; the
#              go-live must refuse because it is not capstone.json's prompt.
#   alkylate   the alkylate tank's "typed as 0 bbl" struck from the shipped
#              Expert prompt; the alkylate check must refuse it by name.
#   derived    an engine-derived intermediate (the OGBELE blend's SG to four
#              decimals) printed in the intermediate capstone's dataset line.
#   leak       a graded value (the OGBELE netback to two decimals) printed in
#              the advanced capstone's dataset line.
#   digest     one graded value moved onto a number the digest prints (17.2,
#              gate_collisions.py's own plant, on the Abiteye mass share).
#   precision  one tolerance moved to twice what precision.json gives it.
#   held       a graded label renamed to a viscosity: nothing HELD is graded.
#   heldvalue  idama_blend_cii moved onto the IDAMA blend's Refutas viscosity,
#              7.936850956450447 cSt (C12): a held figure under another name.
#   sibling    a course other than refinery planted at path_order 49.
# Every moved value was checked clear of the digest, the prompts and the other
# graded values first, so no earlier sweep can fire in the control's place.
#
# Usage: dryrun_cr.sh [ref|WORKTREE] [--control <name>]     default HEAD
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
  REPO=${REPO:-/root/wt-md-crude-nextgen}
fi
LINKED=${LINKED:-/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen}
RUN=$(mktemp -d /tmp/crdry.XXXXXX)
SLUG=crude
GOLIVE=${GOLIVE:-1}
FILES="20261010_cr_crude_course
20261010_cr_crude_beginner_deep
20261010_cr_crude_intermediate_deep
20261010_cr_crude_advanced_deep
20261010_cr_crude_go_live"

if [ -n "$CONTROL" ] && [ "$TARGET" != scratch ]; then
  echo "the negative controls run on the scratch database only"; exit 2
fi

runsql() {
  if [ "$TARGET" = linked ]; then
    ( cd "$LINKED" && supabase db query --linked -f "$1" 2>&1 )
  else
    docker exec -i cr-scratch psql -U postgres -v ON_ERROR_STOP=1 -q -At < "$1" 2>&1
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
union all select 'commercial_trading rows', count(*)::text from public.academy_apps where module = 'commercial_trading'
union all select 'path_order 48 held', count(*)::text from public.academy_apps where path_order = 48
union all select 'path_order 49 held', count(*)::text from public.academy_apps where path_order = 49
union all select 'path_order 50 held', count(*)::text from public.academy_apps where path_order = 50
union all select 'structures rows',    count(*)::text from public.academy_course_structures
union all select 'questions rows',     count(*)::text from public.academy_quiz_questions
union all select 'capstones rows',     count(*)::text from public.academy_capstones
union all select 'crude apps',         count(*)::text from public.academy_apps where slug = 'crude'
union all select 'crude any',          (select count(*) from public.academy_course_structures where app_slug = 'crude')
                                     + (select count(*) from public.academy_quiz_questions where app_slug = 'crude')
                                     + (select count(*) from public.academy_capstones where app_slug = 'crude') || ''
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
    # 1.0443475502291177 to 1.0444475502291177, two tolerances.
    move idama_blend_cii beginner 1.0444475502291177 ;;
  --control:route)
    # 580.0450450450451 to 580.045195045045, three tolerances.
    move ogbele_blend_t50_f intermediate 580.045195045045
    GOLIVE_EDIT="python3 $HERE/cut_block.py engine" ;;
  --control:oracle)
    # 3228.160923653412 to 3228.1610736534117, three tolerances.
    move onne_fcc_volume_bbl advanced 3228.1610736534117
    GOLIVE_EDIT="python3 $HERE/cut_block.py engine route" ;;
  --control:bracket)
    # The oracle's quotients are 6495.1177905644945 (relax) and
    # 6495.117850563824 (tighten), mean 6495.11782056416. 6495.117865 is 4.4e-5
    # from the mean, inside the tolerance the generic oracle check applies, and
    # 1.4e-5 above the tighten side, outside the bracket widened by 6.5e-6.
    move onne_rvp_relief_usd_per_psi advanced 6495.117865
    GOLIVE_EDIT="python3 $HERE/cut_block.py engine" ;;
  --control:trap)
    # The trap on this field blends sulfur on VOLUME: 0.42574120603015075,
    # which discriminate.mjs ran through the engine as sulfur_blended_on_volume.
    # It is no other graded value, no number the digest prints and no number in
    # a prompt.
    move idama_blend_sulfur_wtpct beginner 0.42574120603015075
    GOLIVE_EDIT="python3 $HERE/cut_block.py engine route oracle" ;;
  --control:prompt)
    PRE_GOLIVE="update public.academy_capstones set prompt = replace(prompt, 'Idama Light: 408000 bbl, API 42.3', 'Idama Light: 408000 bbl, API 42.4')
 where app_slug = '$SLUG' and tier = 'beginner';" ;;
  --control:alkylate)
    PRE_GOLIVE="update public.academy_capstones set prompt = replace(prompt, 'tank typed as 0 bbl available', 'none available')
 where app_slug = '$SLUG' and tier = 'advanced';" ;;
  --control:derived)
    # The OGBELE blend's specific gravity, 0.8534, which the prompt never prints.
    PRE_GOLIVE="update public.academy_capstones set dataset = dataset || ' (a blend SG of 0.8534)'
 where app_slug = '$SLUG' and tier = 'intermediate';" ;;
  --control:leak)
    # The OGBELE netback, 62.2289, to two decimals.
    PRE_GOLIVE="update public.academy_capstones set dataset = dataset || ' (a netback near 62.23 a bbl)'
 where app_slug = '$SLUG' and tier = 'advanced';" ;;
  --control:digest)
    # 17.2 is a figure the digest prints (gate_collisions.py's own plant).
    move idama_abiteye_mass_share_pct beginner 17.2 ;;
  --control:precision)
    PRE_GOLIVE="update public.academy_capstones c
   set fields = (select jsonb_agg(case when f->>'key' = 'idama_blend_api' then jsonb_set(f, '{tol}', to_jsonb(0.0001)) else f end order by o)
                   from jsonb_array_elements(c.fields) with ordinality x(f, o))
 where c.app_slug = '$SLUG' and c.tier = 'beginner';" ;;
  --control:held)
    PRE_GOLIVE="update public.academy_capstones c
   set fields = (select jsonb_agg(case when f->>'key' = 'idama_blend_api' then jsonb_set(f, '{label}', to_jsonb('Viscosity of the cargo'::text)) else f end order by o)
                   from jsonb_array_elements(c.fields) with ordinality x(f, o))
 where c.app_slug = '$SLUG' and c.tier = 'beginner';" ;;
  --control:heldvalue)
    move idama_blend_cii beginner 7.936850956450447 ;;
  --control:sibling)
    PRE_GOLIVE="insert into public.academy_apps (slug, name, module, path_order, status)
 values ('cr_control_imposter', 'Imposter', 'commercial_trading', 49, 'coming_soon');" ;;
  *) echo "unknown control $CTL"; exit 2 ;;
esac

{
  echo "begin;"
  for f in $FILES; do
    echo "-- ================= $f"
    if [ "$f" = 20261010_cr_crude_go_live ]; then
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
       'crude ' || a.status
       || ' | ' || (select count(*) from public.academy_course_structures where app_slug='crude' and active)::text || ' tiers'
       || ' | ' || (select count(*) from public.academy_course_structures s,
                           lateral jsonb_array_elements(s.structure->'modules') m,
                           lateral jsonb_array_elements_text(m->'lesson_keys') lk
                     where s.app_slug='crude' and s.active)::text || ' lessons'
       || ' | ' || (select count(*) from public.academy_quiz_questions where app_slug='crude')::text || ' questions ('
       || (select string_agg(n::text, '/' order by ord) from (
             select case tier when 'beginner' then 1 when 'intermediate' then 2 else 3 end ord, count(*) n
               from public.academy_quiz_questions where app_slug='crude' group by tier) t) || ')'
       || ' | ' || (select count(*) from public.academy_capstones where app_slug='crude')::text || ' capstones'
       || ' | ' || (select count(*) from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
                     where c.app_slug='crude')::text || ' graded'
       || ' | path_order ' || a.path_order::text || ' in ' || a.module
       || ' | catalogue ' || (select count(*) filter (where status='available') from public.academy_apps)::text
       || ' available / ' || (select count(*) filter (where status='coming_soon') from public.academy_apps)::text
       || ' coming_soon' as v
  from public.academy_apps a where a.slug = 'crude';
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
    engine) WANT="the engine returned through crude_capstone.mjs" ;;
    route) WANT="the second route in SQL gives" ;;
    oracle) WANT="the oracle gives" ;;
    bracket) WANT="is not between the oracle's one-sided quotients" ;;
    trap) WANT="so the field does not discriminate the trap" ;;
    prompt) WANT="is not the prompt capstone.json carries" ;;
    alkylate) WANT="the alkylate tank is typed as 0 bbl" ;;
    derived) WANT="engine-derived intermediate" ;;
    leak) WANT="graded field(s) are printed in a capstone a learner reads" ;;
    digest) WANT="a number the digest prints" ;;
    precision) WANT="at their precision.json tolerance" ;;
    held) WANT="name a HELD quantity" ;;
    heldvalue) WANT="are a HELD figure" ;;
    sibling) WANT="the slot of the wave sibling refinery, is held by another course" ;;
  esac
  # The control must fire THROUGH THE CHECK IT IS FOR. A refusal from some
  # other check (the pairwise sweep, say) proves nothing about this one.
  if [ $FAILED = 1 ] && grep -qF "crude go-live refused" "$RUN/out.txt" && grep -F "crude go-live refused" "$RUN/out.txt" | grep -qF "$WANT"; then
    echo "CONTROL $CTL FIRED:"
    grep -oE "crude go-live refused[^\"]*" "$RUN/out.txt" | head -2 | cut -c1-300 | sed 's/^/    /'
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
