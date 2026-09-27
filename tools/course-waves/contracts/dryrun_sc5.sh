#!/usr/bin/env bash
# =============================================================================
# SC5 DRY RUN: THE WHOLE LADDER. Adapted from EC11's dryrun_ec11.sh for the
# first practice course: SIX files, the platform migration FIRST.
#
#   20261116_sc5_contracts_platform_course_types   course_type, the dates, the
#                                                   practice certificate path
#   20261116_sc5_contracts_course                   the practice catalogue row
#   20261116_sc5_contracts_{beginner,intermediate,advanced}_deep
#   20261116_sc5_contracts_go_live                  HELD in production
#
# MODES
#   (default)      all six files inside ONE transaction that ends in ROLLBACK;
#                  the database is re-read and compared with the snapshot taken
#                  before (never assumed).
#   --idempotent   the whole ladder TWICE inside the one rolled-back
#                  transaction; the second pass must leave every count and
#                  digest where the first left it.
#   --apply        SCRATCH ONLY. Each file in its own transaction, in order, as
#                  `apply --prod` runs them, then the whole ladder AGAIN, file
#                  by file: the second application must be a no-op (the
#                  snapshot after it equals the snapshot after the first).
#                  Then THE CERTIFICATE, END TO END, on each tier: a learner
#                  enrolled at the tier reads every lesson, passes every module
#                  quiz, fails the final exam once (the claim is refused), then
#                  passes it (25 questions served, 70 per cent to pass, the
#                  chassis defaults) and claims: Associate, Professional and
#                  Expert issued, verified publicly with course_type
#                  'practice', a second claim reports already_certified, and
#                  an engine course's claim is refused.
#   --control <n>  SCRATCH ONLY. A planted defect before the go-live; the
#                  go-live must refuse THROUGH THE CHECK IT IS FOR:
#                    rekey      one Expert final question's answer index moved
#                    drop       one Professional module question deleted
#                    structure  one Associate lesson key removed from its row
#                    capstone   a capstone row inserted for contracts
#                    type       the row's course_type set to 'engine'
#                    claim      academy_claim_practice_certificate dropped
#                    path       a second row moved onto path_order 79
#                  --control all runs the seven, one rolled-back run each.
#
# TARGETS. TARGET=scratch (default) is the local sc5-scratch container built by
# scratch_db.sh. TARGET=linked is the linked NextGen project, which IS
# PRODUCTION, from the linked checkout: the default mode only, rolled back and
# snapshotted before and after; the owner's to run (apply_sc5_contracts.sh
# prod-dryrun). Every file is checked to carry no transaction line of its own.
#
# Usage: dryrun_sc5.sh [ref|WORKTREE] [--idempotent | --apply | --control <name>]
# =============================================================================
set -u
REF=${1:-HEAD}
MODE=${2:-}
CTL=${3:-}
TARGET=${TARGET:-scratch}
HERE=$(cd "$(dirname "$0")" && pwd)
if up=$(cd "$HERE/../../.." 2>/dev/null && pwd) && { [ -d "$up/.git" ] || [ -f "$up/.git" ]; }; then
  REPO=${REPO:-$up}
else
  REPO=${REPO:-/root/wt-sc5-nextgen}
fi
LINKED=${LINKED:-/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen}
C=${SCRATCH:-sc5-scratch}
RUN=$(mktemp -d /tmp/sc5dry.XXXXXX)
SLUG=contracts
PLATFORM=20261116_sc5_contracts_platform_course_types
GOLIVE=20261116_sc5_contracts_go_live
FILES="$PLATFORM
20261116_sc5_contracts_course
20261116_sc5_contracts_beginner_deep
20261116_sc5_contracts_intermediate_deep
20261116_sc5_contracts_advanced_deep
$GOLIVE"

if [ "$MODE" = --control ] && [ "$CTL" = all ]; then
  fails=0
  for c in rekey drop structure capstone type claim path; do
    out=$(bash "$0" "$REF" --control "$c" 2>&1)
    if grep -q "^CONTROL $c FIRED" <<<"$out"; then
      printf '  fired   %-10s %s\n' "$c" "$(grep -oE 'SC5 go-live refused[^"]*' <<<"$out" | head -1 | cut -c1-120)"
    else
      printf '  SILENT  %-10s\n' "$c"; fails=$((fails + 1)); grep -E 'ERROR|FAILED|REFUSED' <<<"$out" | head -3
    fi
  done
  [ $fails = 0 ] && { echo "CONTROLS: all 7 planted defects refused by the go-live through their own checks."; exit 0; }
  echo "CONTROLS: $fails did not fire."; exit 2
fi
if [ -n "$MODE" ] && [ "$MODE" != --idempotent ] && [ "$TARGET" != scratch ]; then
  echo "--apply and the negative controls run on the scratch database only"; exit 2
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

# No file may open, commit or roll back a transaction of its own.
txlines() {  # the file's transaction lines, outside dollar-quoted bodies and comments
  perl -0pe 's/\$\$.*?\$\$//gs; s/--[^\n]*//g' "$1" | grep -niE '^[[:space:]]*(begin|start[[:space:]]+transaction|commit|rollback|end|abort)[[:space:]]*(transaction|work)?[[:space:]]*;'
}
for f in $FILES; do
  fetch "$f" > "$RUN/$f.sql" 2>/dev/null || { echo "REFUSED: migrations/$f.sql is not at $REF"; exit 3; }
  if txlines "$RUN/$f.sql" >/dev/null; then
    echo "REFUSED: $f.sql carries a transaction line of its own:"; txlines "$RUN/$f.sql"; exit 3
  fi
done

cat > "$RUN/snap.sql" <<'SQL'
select 'catalogue' as what,
       count(*) filter (where status = 'available')::text || ' available / ' ||
       count(*) filter (where status = 'coming_soon')::text || ' coming_soon' as v
  from public.academy_apps
union all select 'apps rows',          count(*)::text from public.academy_apps
union all select 'supply_chain rows',  count(*)::text from public.academy_apps where module = 'supply_chain'
union all select 'path_order 79 held', count(*)::text from public.academy_apps where path_order = 79
union all select 'structures rows',    count(*)::text from public.academy_course_structures
union all select 'questions rows',     count(*)::text from public.academy_quiz_questions
union all select 'capstones rows',     count(*)::text from public.academy_capstones
union all select 'contracts any',      ((select count(*) from public.academy_apps where slug = 'contracts')
                                     + (select count(*) from public.academy_course_structures where app_slug = 'contracts')
                                     + (select count(*) from public.academy_quiz_questions where app_slug = 'contracts')
                                     + (select count(*) from public.academy_capstones where app_slug = 'contracts'))::text
union all select 'apps digest',        md5(string_agg(slug||'|'||name||'|'||module||'|'||path_order||'|'||status||'|'||coalesce(prereq_slug,''), ',' order by slug)) from public.academy_apps
union all select 'course types',       coalesce((select md5(string_agg(slug||'|'||(to_jsonb(a)->>'course_type')||'|'||coalesce(to_jsonb(a)->>'review_date','')||'|'||coalesce(to_jsonb(a)->>'sources_checked_on',''), ',' order by slug)) from public.academy_apps a where to_jsonb(a) ? 'course_type'), '(no column)')
union all select 'platform functions', coalesce(md5((select pg_get_functiondef(p) from to_regprocedure('public.academy_claim_practice_certificate(text,text)') p where p is not null)), '(no claim)')
                                       || ' / ' || md5(pg_get_functiondef('public.academy_verify_certificate(text)'::regprocedure))
union all select 'structures digest',  coalesce(md5(string_agg(app_slug||'|'||tier||'|'||(structure)::text||'|'||active||'|'||content_version, ',' order by app_slug, tier)), '(empty)') from public.academy_course_structures
union all select 'questions digest',   coalesce(md5(string_agg(app_slug||'|'||tier||'|'||scope||'|'||coalesce(module_key,'')||'|'||ord||'|'||md5(prompt)||'|'||md5(options::text)||'|'||answer_index||'|'||md5(coalesce(explanation,''))||'|'||active, ',' order by app_slug, tier, scope, coalesce(module_key,''), ord)), '(empty)') from public.academy_quiz_questions
union all select 'capstones digest',   coalesce(md5(string_agg(app_slug||'|'||tier||'|'||md5(prompt)||'|'||(fields)::text, ',' order by app_slug, tier)), '(empty)') from public.academy_capstones
order by 1;
SQL
snap() {
  if [ "$TARGET" = linked ]; then runsql "$RUN/snap.sql" | grep -E '"what"|"v"' | paste - - | sed 's/^ *//'
  else runsql "$RUN/snap.sql"; fi
}
SNAPQ=$(tr '\n' ' ' < "$RUN/snap.sql" | sed 's/;[[:space:]]*$//')

READBACK="select 'READBACK' as what,
       'contracts ' || a.status || ' ' || (to_jsonb(a)->>'course_type')
       || ' | review ' || (to_jsonb(a)->>'review_date') || ' checked ' || (to_jsonb(a)->>'sources_checked_on')
       || ' | ' || (select count(*) from public.academy_course_structures where app_slug='contracts' and active)::text || ' tiers'
       || ' | ' || (select count(*) from public.academy_course_structures s,
                           lateral jsonb_array_elements(s.structure->'modules') m,
                           lateral jsonb_array_elements_text(m->'lesson_keys') lk
                     where s.app_slug='contracts' and s.active)::text || ' lessons'
       || ' | ' || (select count(*) from public.academy_quiz_questions where app_slug='contracts')::text || ' questions ('
       || (select string_agg(n::text, '/' order by o) from (
             select case tier when 'beginner' then 1 when 'intermediate' then 2 else 3 end o, count(*) n
               from public.academy_quiz_questions where app_slug='contracts' group by tier) t) || ')'
       || ' | ' || (select count(*) from public.academy_capstones where app_slug='contracts')::text || ' capstones'
       || ' | path_order ' || a.path_order::text || ' in ' || a.module as v
  from public.academy_apps a where a.slug = 'contracts';"
WANT_READBACK='contracts available practice | review 2027-09-27 checked 2026-09-27 | 3 tiers | 78 lessons | 396 questions (132/132/132) | 0 capstones | path_order 79 in supply_chain'

# ------------------------------------------------------- the controls' plants
PRE_GOLIVE=""; WANT=""
case "$MODE:$CTL" in
  --control:rekey)     PRE_GOLIVE="update public.academy_quiz_questions set answer_index = (answer_index + 1) % 4 where app_slug='contracts' and tier='advanced' and scope='final' and ord = 17;"
                       WANT="the advanced questions are not the committed banks" ;;
  --control:drop)      PRE_GOLIVE="delete from public.academy_quiz_questions where app_slug='contracts' and tier='intermediate' and scope='module' and module_key like 'm03-%' and ord = 9;"
                       WANT="intermediate module bank\\(s\\) without exactly 15 active questions: m03" ;;
  --control:structure) PRE_GOLIVE="update public.academy_course_structures set structure = jsonb_set(structure, '{modules,1,lesson_keys}', (structure->'modules'->1->'lesson_keys') - 0) where app_slug='contracts' and tier='beginner';"
                       WANT="the beginner structure row is missing, inactive or not the manifest" ;;
  --control:capstone)  PRE_GOLIVE="insert into public.academy_capstones (app_slug, tier, cert_tier, dataset, title, prompt, fields) values ('contracts','advanced','expert','x','x','x','[]');"
                       WANT="a practice course carries no capstone row" ;;
  --control:type)      PRE_GOLIVE="update public.academy_apps set course_type = 'engine' where slug = 'contracts';"
                       WANT="contracts is not the practice row" ;;
  --control:claim)     PRE_GOLIVE="drop function public.academy_claim_practice_certificate(text, text);"
                       WANT="academy_claim_practice_certificate\\(text, text\\) is missing" ;;
  --control:path)      PRE_GOLIVE="update public.academy_apps set path_order = 79 where slug = 'neighbour70';"
                       WANT="path_order 79 is held by 2 rows" ;;
  --control:*)         echo "unknown control '$CTL'"; exit 2 ;;
  --idempotent:|--apply:|:) ;;
  *) echo "unknown mode $MODE"; exit 2 ;;
esac

echo "repo: $REPO   ref: $REF   target: $TARGET   mode: ${MODE:-rolled back} $CTL"
echo "### THE DATABASE BEFORE"
snap | sed 's/^/  /' | tee "$RUN/before.txt"

# ============================================================== --apply
if [ "$MODE" = --apply ]; then
  pass_apply() {  # one transaction per file, in order, as apply --prod runs them
    for f in $FILES; do
      { echo '\set ON_ERROR_STOP on'; echo 'begin;'; cat "$RUN/$f.sql"; echo; echo 'commit;'; } > "$RUN/$f.apply.sql"
      out=$(runsql "$RUN/$f.apply.sql"); rc=$?
      if [ $rc -ne 0 ] || grep -q ERROR <<<"$out"; then echo "  APPLY FAILED $f"; echo "$out" | grep -E 'ERROR' | head -3; return 1; fi
      echo "  applied  $f  $(grep -oE '(course types|SC5 go-live):[^"]*' <<<"$out" | head -1)"
    done
  }
  echo; echo "### FIRST APPLICATION, one transaction a file"
  pass_apply || { echo "APPLY FAILED on the first pass"; exit 2; }
  snap > "$RUN/pass1.txt"
  echo "  $(runsql <(echo "$READBACK") | head -1)"
  echo; echo "### SECOND APPLICATION: every file must be a no-op"
  pass_apply || { echo "APPLY FAILED on the second pass"; exit 2; }
  snap > "$RUN/pass2.txt"
  if diff -q "$RUN/pass1.txt" "$RUN/pass2.txt" >/dev/null; then
    echo "NO-OP: the second application left every count and digest where the first left it."
  else
    echo "THE SECOND APPLICATION MOVED THE DATABASE:"; diff "$RUN/pass1.txt" "$RUN/pass2.txt"; exit 2
  fi
  rb=$(runsql <(echo "$READBACK") | head -1)
  [ "$rb" = "READBACK|$WANT_READBACK" ] || [ "$rb" = "$WANT_READBACK" ] || { echo "READBACK is not the ladder's: $rb"; exit 2; }
  echo "  $rb"

  echo; echo "### THE CERTIFICATE, END TO END, EVERY TIER"
  for spec in beginner:associate intermediate:professional advanced:expert; do
    tier=${spec%%:*}; cert=${spec##*:}
    cat > "$RUN/e2e_$tier.sql" <<SQL
\set ON_ERROR_STOP on
insert into auth.users (email) values ('e2e-$tier@scratch') returning id \gset
insert into public.profiles (id, display_name) values (:'id', 'E2E $tier');
insert into public.academy_enrollments (user_id, app_slug, course_tier, door) values (:'id', 'contracts', '$tier', 'self');
insert into public.academy_enrollments (user_id, app_slug, course_tier, door) values (:'id', 'procurement', 'beginner', 'self');
select set_config('request.jwt.claim.sub', :'id', false);
do \$\$
declare
  v_s jsonb; m jsonb; l text; r jsonb; a jsonb; ans jsonb; c jsonb; v jsonb; n_mod int := 0; n_les int := 0;
begin
  select structure into v_s from public.academy_course_structures where app_slug = 'contracts' and tier = '$tier';
  for m in select value from jsonb_array_elements(v_s->'modules') loop
    for l in select jsonb_array_elements_text(m->'lesson_keys') loop
      perform public.academy_mark_lesson_read('contracts', '$tier', m->>'key', l); n_les := n_les + 1;
    end loop;
    r := public.academy_get_module_quiz('contracts', '$tier', m->>'key');
    select jsonb_object_agg(x->>'id', (select answer_index from public.academy_quiz_questions where id = (x->>'id')::uuid))
      into ans from jsonb_array_elements(r->'questions') x;
    a := public.academy_submit_module_quiz((r->>'attempt_id')::uuid, ans);
    if not (a->>'passed')::boolean then raise exception 'E2E: module % quiz not passed with every answer right: %', m->>'key', a; end if;
    n_mod := n_mod + 1;
  end loop;

  -- the final exam, failed once: the claim must refuse
  r := public.academy_get_final_exam('contracts', '$tier');
  if jsonb_array_length(r->'questions') <> 25 then raise exception 'E2E: % final questions served, not 25', jsonb_array_length(r->'questions'); end if;
  select jsonb_object_agg(x->>'id', ((select answer_index from public.academy_quiz_questions where id = (x->>'id')::uuid) + 1) % 4)
    into ans from jsonb_array_elements(r->'questions') x;
  a := public.academy_submit_final_exam((r->>'attempt_id')::uuid, ans);
  if (a->>'passed')::boolean then raise exception 'E2E: a final exam with every answer wrong passed'; end if;
  begin
    c := public.academy_claim_practice_certificate('contracts', '$tier');
    raise exception 'E2E: a certificate was issued on a failed final: %', c;
  exception when others then
    if sqlerrm not like '%pass the final exam%' then raise; end if;
  end;

  -- passed at the chassis pass mark: 18 of 25 right is 72 per cent
  r := public.academy_get_final_exam('contracts', '$tier');
  select jsonb_object_agg(t.q->>'id', case when t.o <= 18
           then (select answer_index from public.academy_quiz_questions where id = (t.q->>'id')::uuid)
           else ((select answer_index from public.academy_quiz_questions where id = (t.q->>'id')::uuid) + 1) % 4 end)
    into ans from jsonb_array_elements(r->'questions') with ordinality t(q, o);
  a := public.academy_submit_final_exam((r->>'attempt_id')::uuid, ans);
  if not (a->>'passed')::boolean or (a->>'score')::int <> 18 or (a->>'pass_pct')::int <> 70 then
    raise exception 'E2E: the final exam at 18 of 25 did not pass at 70 per cent: %', a;
  end if;

  c := public.academy_claim_practice_certificate('contracts', '$tier');
  if c->>'tier' <> '$cert' or c->>'basis' <> 'final_exam' or c->>'course_type' <> 'practice' or (c->>'renewed')::boolean then
    raise exception 'E2E: the claim did not issue the $cert certificate: %', c;
  end if;
  v := public.academy_verify_certificate(c->>'verify_code');
  if v->>'status' <> 'valid' or v->>'course_type' <> 'practice' or v->>'tier' <> '$cert'
     or v->>'course_name' <> 'Contract & Supplier Management' or v->>'holder' <> 'E2E $tier' then
    raise exception 'E2E: verification does not read the practice certificate: %', v;
  end if;
  c := public.academy_claim_practice_certificate('contracts', '$tier');
  if not coalesce((c->>'already_certified')::boolean, false) then raise exception 'E2E: a second claim did not report already_certified: %', c; end if;
  begin
    c := public.academy_claim_practice_certificate('procurement', 'beginner');
    raise exception 'E2E: an engine course issued a practice certificate: %', c;
  exception when others then
    if sqlerrm not like '%is an engine course%' then raise; end if;
  end;
  raise notice 'E2E $tier: % lessons read, % module quizzes passed, final failed then passed 18/25 at 70 pct, $cert issued, verified as practice, second claim already certified, engine claim refused', n_les, n_mod;
end \$\$;
select count(*) from public.academy_certifications where user_id = :'id' and app_slug = 'contracts' and tier = '$cert' and revoked_at is null;
SQL
    out=$(docker exec -i "$C" psql -U postgres -q -At < "$RUN/e2e_$tier.sql" 2>&1); rc=$?
    if [ $rc -ne 0 ] || grep -q ERROR <<<"$out" || [ "$(tail -1 <<<"$out")" != 1 ]; then
      echo "  E2E FAILED on $tier:"; echo "$out" | grep -E 'ERROR|E2E' | head -5; exit 2
    fi
    grep -oE 'E2E [a-z]+: .*' <<<"$out" | sed 's/^/  ok  /'
  done
  echo
  echo "APPLY CLEAN: six files applied one transaction each (platform first), re-applied as a no-op, and a practice certificate claimed end to end at all three tiers."
  echo "run artefacts: $RUN"
  exit 0
fi

# ============================================================ rolled back
{
  [ "$TARGET" = scratch ] && echo '\set ON_ERROR_STOP on'
  echo "begin;"
  PASSES=1; [ "$MODE" = --idempotent ] && PASSES=2
  for pass in $(seq 1 $PASSES); do
    [ "$pass" = 2 ] && echo "create temp table sc5_pass1 as select * from ($SNAPQ) s;"
    for f in $FILES; do
      echo "-- ================= $f"
      if [ "$f" = "$GOLIVE" ] && [ -n "$PRE_GOLIVE" ]; then echo "-- ================= NEGATIVE CONTROL $CTL"; echo "$PRE_GOLIVE"; fi
      cat "$RUN/$f.sql"; echo
    done
    if [ "$pass" = 2 ]; then
      echo "do \$\$ declare v_n int; begin select count(*) into v_n from ((select * from sc5_pass1 except select * from ($SNAPQ) s) union all (select * from ($SNAPQ) s except select * from sc5_pass1)) d; if v_n <> 0 then raise exception 'SC5 dry run refused: IDEMPOTENCE, the second pass of the ladder moved % snapshot row(s)', v_n; end if; raise notice 'IDEMPOTENT: the second pass left every count and digest where the first left it'; end \$\$;"
    fi
  done
  echo "$READBACK"
  echo "rollback;"
} > "$RUN/ladder.sql"

echo
echo "### THE LADDER, IN ONE TRANSACTION THAT ENDS IN ROLLBACK ($(wc -l < "$RUN/ladder.sql") lines)"
runsql "$RUN/ladder.sql" > "$RUN/out.txt"; RC=$?
grep -E '"what"|"v"|READBACK|ERROR|NOTICE|refused|IDEMPOTENT|course types' "$RUN/out.txt" | cut -c1-300 | sed 's/^/  /'
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
  diff "$RUN/before.txt" "$RUN/after.txt"; exit 2
fi
echo
if [ "$MODE" = --control ]; then
  if [ $FAILED = 1 ] && grep -qE "SC5 go-live refused: .*$WANT" "$RUN/out.txt"; then
    echo "CONTROL $CTL FIRED:"; grep -oE "SC5 go-live refused[^\"]*" "$RUN/out.txt" | head -1 | cut -c1-300 | sed 's/^/    /'; exit 0
  fi
  echo "CONTROL $CTL DID NOT FIRE through its own check ($WANT)."; grep -E 'ERROR|refused' "$RUN/out.txt" | head -3 | cut -c1-300; exit 2
fi
if [ $FAILED = 1 ]; then
  echo "DRY RUN FAILED (rc $RC). Nothing was applied, and the transaction rolled back."
  grep -E 'ERROR|refused' "$RUN/out.txt" | head -5 | cut -c1-300; exit 2
fi
grep -q "$WANT_READBACK" "$RUN/out.txt" || { echo "DRY RUN DID NOT READ BACK the flipped course: $(grep READBACK "$RUN/out.txt")"; exit 2; }
if [ "$MODE" = --idempotent ]; then
  grep -q 'IDEMPOTENT: the second pass' "$RUN/out.txt" || { echo "THE IDEMPOTENCE CHECK DID NOT RUN"; exit 2; }
  echo "IDEMPOTENT: the whole ladder ran twice in one rolled-back transaction and the second pass moved nothing."
fi
echo "DRY RUN CLEAN: all six files ran (platform first), the go-live's assertions all passed, and the transaction rolled back."
echo "run artefacts: $RUN"
