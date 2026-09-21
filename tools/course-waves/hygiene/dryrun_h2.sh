#!/usr/bin/env bash
# =============================================================================
# H2 DRY RUN: THE WHOLE LADDER, ROLLED BACK.
#
# All five migrations run inside ONE transaction that ends in ROLLBACK. The run
# then RE-READS the database and compares it with the snapshot taken before,
# rather than assuming the rollback worked.
#
# APPLYING IS NOT THIS SCRIPT'S JOB. The real apply is apply_h2_hygiene.sh and
# it is the owner's to run. The go-live is HELD and is dry-run here only.
#
# THERE IS ONE TARGET, AND IT IS LOCAL. `TARGET=scratch`, the h2-scratch
# container scratch_db.sh builds, is the only database this script will talk to.
# H1's dryrun carried a second target that ran `supabase db query --linked`, and
# the linked NextGen project IS PRODUCTION. This wave does not run supabase at
# all, with any flag, for any reason. The production dry run is the OWNER's, and
# the exact command is in the pull request body and in apply_h2_hygiene.sh.
#
# THE NEGATIVE CONTROLS. A dry run that passes proves nothing unless the same
# run can be made to fail, and each of the go-live's independent checks has to
# be shown to fire ON ITS OWN:
#   ledger [field] [mult]  moves one graded value by a factor (default
#                          amukpe_benzene_twa8h_ppm, the SMALLEST graded value,
#                          by 1.0000001: an absolute move of 5.6e-8, about a
#                          ninth of its 5e-7 tolerance, so a grader would pass
#                          it); the engine-ledger check must refuse it by name.
#   route [field] [mult]   the same move with the ledger block cut out of the
#                          go-live; the second route in SQL must refuse it and
#                          name the field.
#   trap                   the ledger and the second route cut out, and the
#                          Associate OSHA noise dose set to what the NIOSH 3 dB
#                          decibel exchange rate would give on the OSHA
#                          criterion; the trap for that field must refuse.
#   prompt                 one period's hours edited in the shipped Expert
#                          prompt; the go-live must refuse the prompt.
#   leak                   the Professional mixture index, to six decimals,
#                          planted in an Associate label; the SQL promptleak
#                          must refuse.
#   sweep                  ledger AND route at one part in 1e7 on EVERY one of
#                          the eighteen fields, one rolled-back run each.
#
# Usage: dryrun_h2.sh [ref|WORKTREE] [--control <name> [field] [mult]]
#        default WORKTREE, because the ladder is written before it is committed;
#        pass a ref once the branch carries the five files.
# =============================================================================
set -u
REF=${1:-WORKTREE}
CONTROL=${2:-}
CTL=${3:-}
FIELD_ARG=${4:-}
MULT=${5:-1.0000001}
TARGET=${TARGET:-scratch}
HERE=$(cd "$(dirname "$0")" && pwd)
if up=$(cd "$HERE/../../.." 2>/dev/null && pwd) && { [ -d "$up/.git" ] || [ -f "$up/.git" ]; }; then
  REPO=${REPO:-$up}
else
  REPO=${REPO:-/root/wt-h2-nextgen}
fi
SELF="$HERE/$(basename "$0")"   # the sweep re-enters THIS script, by absolute path
C=${SCRATCH:-h2-scratch}
RUN=$(mktemp -d /tmp/h2dry.XXXXXX)
SLUG=hygiene
GOLIVE=20261004_h2_hygiene_go_live
FILES="20261004_h2_hygiene_course
20261004_h2_hygiene_beginner_deep
20261004_h2_hygiene_intermediate_deep
20261004_h2_hygiene_advanced_deep
$GOLIVE"
KEYS="utorogu_osha_pel_dose_pct:beginner utorogu_osha_pel_twa_dba:beginner
utorogu_action_level_dose_pct:beginner utorogu_niosh_rel_dose_pct:beginner
utorogu_niosh_rel_twa_dba:beginner utorogu_pel_minutes_left_min:beginner
amukpe_lex_8h_dba:intermediate amukpe_lex_weekly_dba:intermediate
amukpe_field_derated_exposure_dba:intermediate amukpe_benzene_twa8h_ppm:intermediate
amukpe_toluene_stel_ppm:intermediate amukpe_mixture_index:intermediate
osioka_wbgt_twa_c:advanced osioka_metabolic_twa_w:advanced
osioka_extended_action_level_dba:advanced osioka_extended_action_dose_pct:advanced
osioka_adjusted_limit_ppm:advanced osioka_adjusted_mixture_index:advanced"
tier_of() { for kt in $KEYS; do [ "${kt%%:*}" = "$1" ] && { echo "${kt##*:}"; return; }; done; echo ""; }

if [ "$TARGET" != scratch ]; then
  echo "REFUSED: this script runs against the local scratch container only. The"
  echo "         production dry run is the owner's and is written out in the PR body."
  exit 2
fi
docker exec "$C" pg_isready -U postgres >/dev/null 2>&1 \
  || { echo "REFUSED: scratch container $C is not running; run scratch_db.sh first"; exit 3; }

runsql() {
  docker exec -i "$C" psql -U postgres -v ON_ERROR_STOP=1 -q -At < "$1" 2>&1
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
union all select 'path_order 62 held', count(*)::text from public.academy_apps where path_order = 62
union all select 'structures rows',    count(*)::text from public.academy_course_structures
union all select 'questions rows',     count(*)::text from public.academy_quiz_questions
union all select 'capstones rows',     count(*)::text from public.academy_capstones
union all select 'hygiene apps',       count(*)::text from public.academy_apps where slug = 'hygiene'
union all select 'hygiene any',        (select count(*) from public.academy_course_structures where app_slug = 'hygiene')
                                     + (select count(*) from public.academy_quiz_questions where app_slug = 'hygiene')
                                     + (select count(*) from public.academy_capstones where app_slug = 'hygiene') || ''
union all select 'apps digest',        md5(string_agg(slug||'|'||module||'|'||path_order||'|'||status, ',' order by slug)) from public.academy_apps
union all select 'structures digest',  coalesce(md5(string_agg(app_slug||'|'||tier||'|'||(structure)::text||'|'||active, ',' order by app_slug, tier)), '(empty)') from public.academy_course_structures
union all select 'questions digest',   coalesce(md5(string_agg(app_slug||'|'||tier||'|'||scope||'|'||ord||'|'||md5(prompt)||'|'||answer_index, ',' order by app_slug, tier, scope, coalesce(module_key,''), ord)), '(empty)') from public.academy_quiz_questions
union all select 'capstones digest',   coalesce(md5(string_agg(app_slug||'|'||tier||'|'||md5(prompt)||'|'||(fields)::text, ',' order by app_slug, tier)), '(empty)') from public.academy_capstones
order by 1;
SQL

snap() { runsql "$RUN/snap.sql"; }

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
    FIELD=${FIELD_ARG:-amukpe_benzene_twa8h_ppm}
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
    # The Associate OSHA permissible exposure limit noise dose set to what the
    # NIOSH 3 dB decibel exchange rate gives on the OSHA criterion and
    # threshold: the first wrong method the Associate tier is built against.
    # The ledger and the second route are cut out so ONLY the trap can object.
    FIELD=utorogu_osha_pel_dose_pct; TIER=beginner
    WRONG=$(python3 -c "print(repr(100.0*sum(h/(8.0/2.0**((l-90.0)/3.0)) for l,h in ((86.7,2.35),(92.4,1.6),(83.3,2.2),(96.3,0.55),(78.6,1.3)) if l>=90.0)))")
    PRE_GOLIVE="update public.academy_capstones c
   set fields = (select jsonb_agg(case when f->>'key' = '$FIELD' then jsonb_set(f, '{expected}', to_jsonb($WRONG::numeric)) else f end)
                   from jsonb_array_elements(c.fields) f)
 where c.app_slug = '$SLUG' and c.tier = '$TIER';"
    GOLIVE_EDIT="python3 $HERE/cut_block.py ledger route"
    WANT="the NIOSH 3 dB decibel exchange rate used on the OSHA criterion gives .*so the field does not discriminate the trap"
    ;;
  --control:prompt)
    PRE_GOLIVE="update public.academy_capstones set prompt = replace(prompt, 'period 1, 85.2 dBA for 3.4 hours', 'period 1, 85.2 dBA for 3.5 hours')
 where app_slug = '$SLUG' and tier = 'advanced';"
    WANT="the advanced prompt is not the prompt gen_course.py rendered"
    ;;
  --control:leak)
    PRE_GOLIVE="update public.academy_capstones c
   set fields = (select jsonb_agg(case when f->>'key' = 'utorogu_osha_pel_dose_pct'
                                       then jsonb_set(f, '{label}', to_jsonb((f->>'label') || ', against a mixture index of 0.914667'))
                                       else f end)
                   from jsonb_array_elements(c.fields) f)
 where c.app_slug = '$SLUG' and c.tier = 'beginner';"
    WANT="intermediate/amukpe_mixture_index in the beginner capstone text"
    ;;
  --control:sweep)
    fails=0
    for kt in $KEYS; do
      for mode in ledger route; do
        OUT=$(bash "$SELF" "$REF" --control "$mode" "${kt%%:*}" "$MULT" 2>&1)
        if grep -q "^CONTROL $mode FIRED" <<<"$OUT"; then
          printf '  fired   %-6s %-40s %s\n' "$mode" "${kt%%:*}" "$(grep -oE '\[graded field: [^]]*\]' <<<"$OUT" | head -1)"
        else
          printf '  SILENT  %-6s %-40s\n' "$mode" "${kt%%:*}"; fails=$((fails + 1))
        fi
      done
    done
    [ $fails = 0 ] && { echo "SWEEP: all 36 controls (18 fields x ledger and route, x$MULT) fired and named their field."; exit 0; }
    echo "SWEEP: $fails control(s) did not fire."; exit 2
    ;;
  *) echo "unknown control $CTL"; exit 2 ;;
esac

echo "repo: $REPO   ref: $REF   target: $TARGET (container $C)"
echo "### THE DATABASE BEFORE"
snap | sed 's/^/  /' | tee "$RUN/before.txt"

{
  echo '\set ON_ERROR_STOP on'
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
       'hygiene ' || a.status
       || ' | ' || (select count(*) from public.academy_course_structures where app_slug='hygiene' and active)::text || ' tiers'
       || ' | ' || (select count(*) from public.academy_course_structures s,
                           lateral jsonb_array_elements(s.structure->'modules') m,
                           lateral jsonb_array_elements_text(m->'lesson_keys') lk
                     where s.app_slug='hygiene' and s.active)::text || ' lessons'
       || ' | ' || (select count(*) from public.academy_quiz_questions where app_slug='hygiene')::text || ' questions ('
       || (select string_agg(n::text, '/' order by ord) from (
             select case tier when 'beginner' then 1 when 'intermediate' then 2 else 3 end ord, count(*) n
               from public.academy_quiz_questions where app_slug='hygiene' group by tier) t) || ')'
       || ' | ' || (select count(*) from public.academy_capstones where app_slug='hygiene')::text || ' capstones'
       || ' | ' || (select count(*) from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
                     where c.app_slug='hygiene')::text || ' graded'
       || ' | path_order ' || a.path_order::text || ' in ' || a.module
       || ' | catalogue ' || (select count(*) filter (where status='available') from public.academy_apps)::text
       || ' available / ' || (select count(*) filter (where status='coming_soon') from public.academy_apps)::text
       || ' coming_soon' as v
  from public.academy_apps a where a.slug = 'hygiene';
rollback;
SQL
} > "$RUN/ladder.sql" || { echo "could not resolve the SQL at $REF"; exit 3; }

echo
echo "### THE LADDER, IN ONE TRANSACTION THAT ENDS IN ROLLBACK ($(wc -l < "$RUN/ladder.sql") lines)"
[ -n "$CONTROL" ] && echo "### WITH THE NEGATIVE CONTROL: $CTL $FIELD"
runsql "$RUN/ladder.sql" > "$RUN/out.txt"; RC=$?
grep -E 'DRY RUN|ERROR|NOTICE|refused|error' "$RUN/out.txt" | cut -c1-400 | sed 's/^/  /'
FAILED=0
if [ $RC -ne 0 ] || grep -qi 'ERROR' "$RUN/out.txt"; then FAILED=1; fi
if docker exec "$C" psql -U postgres -Atc \
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
  # The control must fire THROUGH THE CHECK IT IS FOR. A refusal from some other
  # check (the pairwise sweep, say) proves nothing about this one.
  if [ $FAILED = 1 ] && grep -qE "H2 go-live refused.*$WANT" "$RUN/out.txt"; then
    echo "CONTROL $CTL FIRED:"
    grep -oE "H2 go-live refused[^\"]*" "$RUN/out.txt" | head -2 | cut -c1-400 | sed 's/^/    /'
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
grep -q 'hygiene available | 3 tiers | 78 lessons | 396 questions' "$RUN/out.txt" \
  || { echo "DRY RUN DID NOT READ BACK the flipped course"; exit 2; }
echo "DRY RUN CLEAN: all five migrations ran, the go-live's assertions all passed, and the transaction rolled back."
echo "run artefacts: $RUN"
