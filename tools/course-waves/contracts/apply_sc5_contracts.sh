#!/usr/bin/env bash
# =============================================================================
# SC5 contracts "Contract & Supplier Management" SEED LADDER, content-addressed.
# The owner's script. Adapted from apply_ec11_prms.sh (EC11) for the first
# PRACTICE COURSE: content pins read out of the git object store, never a
# working tree, and the same mode set (verify, dryrun, attempts, prod-status,
# prod-dryrun, apply --prod, rows, pin).
#
# WHY CONTENT PINS. This repository squash merges, so a pinned commit sha is
# wrong the moment the PR lands; file CONTENT survives a squash unchanged. Each
# of the six files is resolved with `git show` at $REF and must match the
# sha256 below, pinned to the head of feat/sc5-contracts-course, or the run
# REFUSES and names the file. Re-pin only with `pin <ref>`, never by hand.
#
# THE PLATFORM MIGRATION GOES FIRST, THEN THE COURSE SEED. The course row needs
# the course_type, review_date and sources_checked_on columns the platform
# migration adds, and the three deep seeds reference the course row (a foreign
# key on app_slug). apply --prod applies them in that order, one transaction
# each, and prod-status judges each file inside a rolled-back transaction that
# runs the files ahead of it first (a no-op once they are applied), so the
# pre-check never reports a false refusal.
#
# THE SIX FILES.
#   20261116_sc5_contracts_platform_course_types
#                        academy_apps.course_type / review_date /
#                        sources_checked_on, the engine backfill, course_type
#                        in academy_verify_certificate, NEW
#                        academy_claim_practice_certificate (NextGen product
#                        tables only)
#   20261116_sc5_contracts_course
#                        the practice catalogue row (coming_soon, module
#                        supply_chain, path_order 79, no prerequisite, review
#                        2027-09-27, sources checked 2026-09-27); NO capstone
#   20261116_sc5_contracts_{beginner,intermediate,advanced}_deep
#                        3 structures, 78 lesson keys, 396 questions (the Expert
#                        final exam is the written-case bank)
#   20261116_sc5_contracts_go_live
#                        HELD. coming_soon -> available, behind the platform,
#                        row, no-capstone, structure, bank-digest, spread and
#                        copy assertions.
#
# =========================== THE UPLOAD GATE ================================
# The 78 lessons, the practice course pages (badge, review date, the practice
# certificate card) and the course's learning page ship in the NextGen ZIP and
# not in this database. A PRACTICE COURSE: there is no engine, no Suite app and
# no Suite upload. The NextGen pages read course_type, so apply the PLATFORM
# migration before (or with) the upload. The course and deep seeds may then be
# applied (the course stays coming_soon, invisible to learners). The go-live
# runs ONLY after the deployed site serves /dashboard/apps/contracts: serve the
# built DashboardPage chunk and see `apps/contracts` in it. `apply --prod
# --go-live` reads its confirmation from stdin and will not run without it.
# ============================================================================
#
# MODES
#   verify          content pins only. Touches no database.
#   dryrun          LOCAL SCRATCH ONLY: scratch_db.sh at $REF, then the whole
#                   ladder rolled back (dryrun_sc5.sh), the ladder twice in one
#                   rolled-back transaction (idempotence), the seven negative
#                   controls, then --apply: every file applied one transaction
#                   each, applied AGAIN as a no-op, and a practice certificate
#                   claimed end to end at every tier; and the platform dry run
#                   (dryrun_platform.sh with its negative control). The scratch
#                   containers are removed afterwards.
#   attempts        PRODUCTION, READ-ONLY: every learner row that already names
#                   contracts. A new course must show 0.
#   prod-status     PRODUCTION: each file inside BEGIN ... ROLLBACK (PENDING or
#                   ALREADY-APPLIED), and the go-live state (HELD or APPLIED).
#   prod-dryrun     PRODUCTION, ROLLED BACK: the whole ladder, go-live included,
#                   in one transaction that ends in ROLLBACK, with the database
#                   snapshotted before and after and compared (dryrun_sc5.sh
#                   with TARGET=linked). Nothing commits.
#   apply --prod    PRODUCTION: prod-status, then the platform migration and
#                   the four seeds, one transaction each, in order, then
#                   prod-status.
#   apply --prod --go-live
#                   PRODUCTION: the go-live, after the confirmation, read from
#                   stdin, that the deployed site serves /dashboard/apps/contracts
#                   (type it, or pipe it: echo "apps/contracts" | ...).
#   rows            the MIGRATIONS.md rows to paste over the NOT YET APPLIED rows.
#   pin <ref>       reprint the digest table at a ref.
#
# ENV
#   REF=origin/main (before the merge: REF=origin/feat/sc5-contracts-course)
#   NG_REPO=/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen
#     (the checkout `supabase link`ed to NextGen production)
# EXIT: 0 did the thing; 2 refused or failed.
# =============================================================================
set -u

REF=${REF:-origin/main}
NG_REPO=${NG_REPO:-/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen}
HERE=$(cd "$(dirname "$0")" && pwd)
RUN=$(mktemp -d /tmp/sc5apply.XXXXXX)
SLUG=contracts

PLATFORM=20261116_sc5_contracts_platform_course_types
COURSE_SEED=20261116_sc5_contracts_course
SEEDS="$PLATFORM
$COURSE_SEED
20261116_sc5_contracts_beginner_deep
20261116_sc5_contracts_intermediate_deep
20261116_sc5_contracts_advanced_deep"
GOLIVE=20261116_sc5_contracts_go_live
FILES="$SEEDS
$GOLIVE"
digest_for() {
  case $1 in
    20261116_sc5_contracts_platform_course_types) echo a0b57fb859be26d05270ea94bab7ab50539b3af361fc08ddf2634a37928cc895 ;;
    20261116_sc5_contracts_course               ) echo 0257a9d595ec8ba308e5a3174c1b7407b05cf557ba48ba60e23a9831633b1195 ;;
    20261116_sc5_contracts_beginner_deep        ) echo 1ef5dbb5903e1d5b9528c92eca09c59648c924b66b26cbb215716a1108af7803 ;;
    20261116_sc5_contracts_intermediate_deep    ) echo 7f12316933eed50e34a62afde826b752bb64d8e91e977e2c483d91949e2b3102 ;;
    20261116_sc5_contracts_advanced_deep        ) echo 151664f55be2a3bb343cd4cb9fc0593b7a0cb1263aa00baaade82499ef0bff6c ;;
    20261116_sc5_contracts_go_live              ) echo 827048b4b72cd37f56d0ced5c39de50569a23f9e94a3004817025ed1b1e15307 ;;
    *) echo UNPINNED ;;
  esac
}

say()    { echo "$*"; }
refuse() { echo; echo "REFUSED: $*"; echo "Nothing was applied. run artefacts: $RUN"; exit 2; }
prod_q() { ( cd "$NG_REPO" && supabase db query --linked -f "$1" 2>&1 ); }
failed() { [ "$1" -ne 0 ] || grep -qE '(^|[^A-Z_])ERROR' <<<"$2"; }

txlines() {  # the file's transaction lines, outside dollar-quoted bodies and comments
  perl -0pe 's/\$\$.*?\$\$//gs; s/--[^\n]*//g' "$1" | grep -niE '^[[:space:]]*(begin|start[[:space:]]+transaction|commit|rollback|end|abort)[[:space:]]*(transaction|work)?[[:space:]]*;'
}

fetch() {
  git -C "$NG_REPO" rev-parse --git-dir >/dev/null 2>&1 || refuse "$NG_REPO is not a git checkout; set NG_REPO"
  git -C "$NG_REPO" fetch --quiet origin 2>/dev/null || say "  (fetch failed, using the objects already present)"
  SHA=$(git -C "$NG_REPO" rev-parse --verify --quiet "$REF^{commit}") || refuse "$REF does not resolve in $NG_REPO"
  say "repo $NG_REPO   ref $REF = ${SHA:0:9}"
  bad=0
  for f in $FILES; do
    want=$(digest_for "$f")
    if ! git -C "$NG_REPO" show "$SHA:migrations/$f.sql" > "$RUN/$f.sql" 2>/dev/null; then
      say "  MISSING   $f.sql is not in $REF"; bad=1; continue
    fi
    got=$(sha256sum "$RUN/$f.sql" | cut -c1-64)
    if [ "$got" = "$want" ]; then printf '  ok        %-46s %s\n' "$f" "${got:0:12}"
    else printf '  STALE     %-46s expected %s found %s\n' "$f" "${want:0:12}" "${got:0:12}"; bad=1; fi
    if txlines "$RUN/$f.sql" >/dev/null; then
      say "  TXLINE    $f.sql carries a transaction line of its own"; bad=1
    fi
  done
  [ $bad = 0 ] || refuse "the SQL at $REF is not the content this ladder was pinned to. If a later PR legitimately moved it, re-pin with: $0 pin $REF, and say in that commit which PR moved it. Never hand-edit a digest."
  say "all six files match their pinned content, none with a transaction line of its own"
}

# The hash of everything the six files write: the platform (the three columns,
# the two checks, the claim and verification functions and their grants, every
# row's course type) and every contracts row. A file inside BEGIN ... ROLLBACK
# can then say whether it would change anything.
HASH_Q="md5(coalesce((select string_agg(column_name || ':' || data_type || ':' || coalesce(column_default, ''), ',' order by column_name) from information_schema.columns where table_schema = 'public' and table_name = 'academy_apps' and column_name in ('course_type', 'review_date', 'sources_checked_on')), '')
 || coalesce((select string_agg(conname || ':' || pg_get_constraintdef(oid), ',' order by conname) from pg_constraint where conrelid = 'public.academy_apps'::regclass and conname in ('academy_apps_course_type_check', 'academy_apps_practice_dates_check')), '')
 || coalesce((select md5(pg_get_functiondef(p)) || has_function_privilege('anon', p, 'execute')::text || has_function_privilege('authenticated', p, 'execute')::text from to_regprocedure('public.academy_claim_practice_certificate(text,text)') p where p is not null), '')
 || md5(pg_get_functiondef('public.academy_verify_certificate(text)'::regprocedure))
 || coalesce((select string_agg(slug || ':' || coalesce(to_jsonb(a)->>'course_type', ''), ',' order by slug) from public.academy_apps a), '')
 || coalesce((select string_agg(md5(a::text), ',') from (select slug, name, module, path_order, prereq_slug, to_jsonb(x)->>'review_date' r, to_jsonb(x)->>'sources_checked_on' s from public.academy_apps x where slug = 'contracts') a), '')
 || coalesce((select string_agg(md5(s::text), ',' order by s.tier) from (select tier, structure, content_version, active from public.academy_course_structures where app_slug = 'contracts') s), '')
 || coalesce((select string_agg(md5(q::text), ',' order by q.tier, q.scope, q.module_key, q.ord) from (select tier, scope, module_key, ord, prompt, options, answer_index, explanation, active from public.academy_quiz_questions where app_slug = 'contracts') q), '')
 || coalesce((select string_agg(md5(c::text), ',' order by c.tier) from (select tier from public.academy_capstones where app_slug = 'contracts') c), ''))"

state_of() {  # file -> PENDING | ALREADY-APPLIED | REFUSED:<reason>
  { echo "begin;"
    # Every file ahead of this one runs first in the same rolled-back
    # transaction (the platform columns, the FK on app_slug); each is a no-op
    # once it is applied.
    for g in $SEEDS; do [ "$g" = "$1" ] && break; cat "$RUN/$g.sql"; echo; done
    echo "create temp table sc5_before on commit drop as select $HASH_Q as h;"
    cat "$RUN/$1.sql"; echo
    echo "select case when (select h from sc5_before) = $HASH_Q then 'ALREADY-APPLIED' else 'PENDING' end as sc5_state;"
    echo "rollback;"; } > "$RUN/$1.state.sql"
  out=$(prod_q "$RUN/$1.state.sql"); rc=$?
  if failed $rc "$out"; then echo "REFUSED:$(grep -m1 -oE '[A-Za-z0-9 /_.:-]*(refused|ERROR)[^"]*' <<<"$out" | cut -c1-200)"
  elif grep -q PENDING <<<"$out"; then echo PENDING
  elif grep -q ALREADY-APPLIED <<<"$out"; then echo ALREADY-APPLIED
  else echo UNKNOWN; fi
}

golive_state() {
  echo "select 'SC5|' || coalesce((select status from public.academy_apps where slug = 'contracts'), 'absent') as sc5_golive;" > "$RUN/golive.sql"
  out=$(prod_q "$RUN/golive.sql")
  case "$(grep -oE 'SC5\|[a-z_]+' <<<"$out" | head -1)" in
    'SC5|available') echo APPLIED ;;
    'SC5|coming_soon') echo HELD ;;
    'SC5|absent') echo "HELD (the course row is not seeded yet)" ;;
    *) echo UNKNOWN ;;
  esac
}

status() {
  pending=0; done_=0; bad=0
  for f in $SEEDS; do
    st=$(state_of "$f")
    case "$st" in
      PENDING) say "  PENDING          $f"; pending=$((pending + 1)) ;;
      ALREADY-APPLIED) say "  ALREADY-APPLIED  $f"; done_=$((done_ + 1)) ;;
      *) say "  $st  $f"; bad=$((bad + 1)) ;;
    esac
  done
  say "  go-live          $GOLIVE: $(golive_state)"
  say "prod-status: $pending pending, $done_ already applied, $bad refused or unknown, of 5 files (the platform migration and 4 seeds)"
  [ $bad = 0 ]
}

attempts() {
  cat > "$RUN/attempts.sql" <<'SQL'
select 'ATT|' || string_agg(t || ' ' || n, ' | ' order by t) as sc5_attempts from (
  select 'enrollments' t, count(*) n from public.academy_enrollments where app_slug = 'contracts'
  union all select 'lesson_progress', count(*) from public.academy_lesson_progress where app_slug = 'contracts'
  union all select 'quiz_attempts', count(*) from public.academy_quiz_attempts where app_slug = 'contracts'
  union all select 'capstone_attempts', count(*) from public.academy_capstone_attempts where app_slug = 'contracts'
  union all select 'certifications', count(*) from public.academy_certifications where app_slug = 'contracts') x;
SQL
  out=$(prod_q "$RUN/attempts.sql")
  line=$(grep -oE 'ATT\|[^"]+' <<<"$out" | head -1)
  [ -n "$line" ] || { echo "$out" | tail -5; refuse "could not read the attempt counts"; }
  say "  ${line#ATT|}"
  say "  A new course must show 0 everywhere. A non-zero count means contracts rows already exist in production: stop and read them before applying."
}

rows() {
  d=$(date -u +%F)
  echo "| $d | \`$PLATFORM.sql\` | SC5 PLATFORM: course_type, review_date, sources_checked_on, the engine backfill, course_type in verification, academy_claim_practice_certificate | **APPLIED $d** by the owner via tools/course-waves/contracts/apply_sc5_contracts.sh apply --prod from $REF (content pinned by sha256; scratch dry run and prod rolled-back dry run first) |"
  for f in $COURSE_SEED 20261116_sc5_contracts_beginner_deep 20261116_sc5_contracts_intermediate_deep 20261116_sc5_contracts_advanced_deep; do
    echo "| $d | \`$f.sql\` | SC5 Contract & Supplier Management (contracts), practice course seed | **APPLIED $d** by the owner via tools/course-waves/contracts/apply_sc5_contracts.sh apply --prod from $REF (content pinned by sha256; scratch dry run and prod rolled-back dry run first) |"
  done
  echo "| $d | \`$GOLIVE.sql\` | SC5 Contract & Supplier Management (contracts), GO-LIVE: coming_soon to available | **APPLIED $d** via apply_sc5_contracts.sh apply --prod --go-live, after the deployed site served /dashboard/apps/contracts |"
}

dryrun() {
  local ok=1
  REPO="$NG_REPO" bash "$HERE/scratch_db.sh" "$REF" | tail -2 || refuse "scratch_db.sh failed"
  REPO="$NG_REPO" bash "$HERE/dryrun_sc5.sh" "$REF" | tail -2 | sed 's/^/  /'; [ "${PIPESTATUS[0]}" = 0 ] || ok=0
  REPO="$NG_REPO" bash "$HERE/dryrun_sc5.sh" "$REF" --idempotent | grep -E '^IDEMPOTENT' | sed 's/^/  /'; [ "${PIPESTATUS[0]}" = 0 ] || ok=0
  REPO="$NG_REPO" bash "$HERE/dryrun_sc5.sh" "$REF" --control all | sed 's/^/  /'; [ "${PIPESTATUS[0]}" = 0 ] || ok=0
  REPO="$NG_REPO" bash "$HERE/dryrun_sc5.sh" "$REF" --apply | grep -E '^(NO-OP|  ok|APPLY)' | sed 's/^/  /'; [ "${PIPESTATUS[0]}" = 0 ] || ok=0
  docker rm -f sc5-scratch >/dev/null 2>&1 && say "  scratch container sc5-scratch removed"
  REPO="$NG_REPO" NEG=1 bash "$HERE/dryrun_platform.sh" "$REF" | grep -E '^=== ' | sed 's/^/  /'; [ "${PIPESTATUS[0]}" = 0 ] || ok=0
  [ $ok = 1 ] || refuse "the scratch dry run did not come back clean"
  say "DRYRUN OK on the local scratch database: safe to run attempts, prod-status and prod-dryrun"
}

case "${1:-verify}" in
  verify)      fetch; say "VERIFY ONLY. No database was touched." ;;
  pin)
    [ $# -ge 2 ] || { echo "usage: $0 pin <ref>"; exit 2; }
    for f in $FILES; do
      body=$(git -C "$NG_REPO" show "$2:migrations/$f.sql" 2>/dev/null) || refuse "$f.sql is not in $2 in $NG_REPO; set NG_REPO"
      printf '%s\n' "$body" | sha256sum | awk -v n="$f" '{printf "    %-44s) echo %s ;;\n", n, $1}'
    done ;;
  dryrun)      fetch; dryrun ;;
  attempts)    fetch; say "target: PRODUCTION (read-only)"; attempts ;;
  prod-status) fetch; say "target: PRODUCTION (each file rolled back)"; status || exit 2 ;;
  prod-dryrun) fetch; say "target: PRODUCTION, the whole ladder rolled back"
               TARGET=linked LINKED="$NG_REPO" REPO="$NG_REPO" bash "$HERE/dryrun_sc5.sh" "$SHA" || refuse "the production rolled-back dry run did not come back clean" ;;
  apply)
    [ "${2:-}" = "--prod" ] || refuse "apply writes PRODUCTION; pass --prod explicitly (run dryrun, attempts, prod-status and prod-dryrun first)"
    fetch
    if [ "${3:-}" = "--go-live" ]; then
      [ "$(golive_state)" = HELD ] || refuse "the go-live is not HELD on production: $(golive_state). Apply the platform migration and the four seeds first."
      say "THE GO-LIVE. Confirm you have SERVED the built DashboardPage chunk and SEEN 'apps/contracts' in it."
      printf "Type exactly  apps/contracts  to proceed (or pipe it on stdin): "; read -r answer || answer=""
      [ "$answer" = "apps/contracts" ] || refuse "upload gate not confirmed"
      { echo "begin;"; cat "$RUN/$GOLIVE.sql"; echo; echo "commit;"; } > "$RUN/golive.apply.sql"
      out=$(prod_q "$RUN/golive.apply.sql"); rc=$?
      if failed $rc "$out"; then echo "$out" | grep -E 'ERROR|refused' | head -3; refuse "the go-live failed and rolled back"; fi
      say "  applied $GOLIVE"; say "  go-live: $(golive_state)"
      say "Now run: $0 rows, and paste the go-live row over its NOT YET APPLIED row in MIGRATIONS.md"
      exit 0
    fi
    say "pre-check:"; status || refuse "prod-status shows refusals; nothing applied"
    for f in $SEEDS; do
      { echo "begin;"; cat "$RUN/$f.sql"; echo; echo "commit;"; } > "$RUN/$f.apply.sql"
      out=$(prod_q "$RUN/$f.apply.sql"); rc=$?
      if failed $rc "$out"; then echo "$out" | grep -E 'ERROR|refused' | head -3; refuse "$f failed and rolled back; earlier files stay applied (re-running is safe)"; fi
      say "  applied $f"
    done
    say "post-check:"; status || refuse "the post-check shows refusals"
    say; say "APPLIED: the platform migration and the four seeds. contracts is coming_soon and no learner can reach it."
    say "Now run: $0 rows, and paste the five rows over their NOT YET APPLIED rows in MIGRATIONS.md."
    say "The go-live stays HELD until the deployed site serves /dashboard/apps/contracts." ;;
  rows)        rows ;;
  *) refuse "unknown mode '${1:-}' (verify | dryrun | attempts | prod-status | prod-dryrun | apply --prod [--go-live] | rows | pin <ref>)" ;;
esac
