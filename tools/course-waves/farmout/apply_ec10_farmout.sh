#!/usr/bin/env bash
# =============================================================================
# EC10 farmout "Farm-ins, Farm-outs & Asset Valuation" SEED LADDER, content-addressed.
# The owner's script. Adapted from apply_sc2_procurement.sh (SC2): content pins read out of the git
# object store, never a working tree, and the same mode set (verify, dryrun,
# attempts, prod-status, prod-dryrun, apply --prod, rows).
#
# WHY CONTENT PINS. This repository squash merges, so a pinned commit sha is
# wrong the moment the PR lands; file CONTENT survives a squash unchanged. Each
# of the five files is resolved with `git show` at $REF and must match the
# sha256 below, pinned to the head of feat/ec10-farmout-course, or the run REFUSES
# and names the file. Re-pin only with `pin <ref>`, never by hand.
#
# THE COURSE SEED GOES FIRST. The three deep seeds reference the course row
# (a foreign key on app_slug), so a deep seed run alone before the course row
# exists is refused by the database. apply --prod applies the course seed
# first, and prod-status judges each deep seed inside a rolled-back
# transaction that runs the course seed ahead of it (a no-op once the course
# row exists), so the pre-check never reports a false FK refusal.
#
# THE FIVE FILES.
#   20261111_ec10_farmout_course      catalogue row (coming_soon, module
#                                         economics, path_order 75, no
#                                         prerequisite) + 3 capstones, 18
#                                         graded fields
#   20261111_ec10_farmout_{beginner,intermediate,advanced}_deep
#                                         3 structures, 78 lesson keys, 396 questions
#   20261111_ec10_farmout_go_live            HELD. coming_soon -> available, behind
#                                         the shape, grader, prompt, engine-ledger,
#                                         second-route, oracle and trap assertions.
#
# =========================== THE UPLOAD GATE ================================
# The 78 lessons, the teaching lab (farmoutLab.js), the three calculator panels
# and the three capstone case files ship in the NextGen ZIP and not in this
# database. An ENGINE COURSE: there is no Suite app and no Suite upload. Upload
# the zip FIRST. The four seeds may then be applied (the course stays
# coming_soon, invisible to learners). The go-live runs ONLY after the deployed
# site serves /dashboard/apps/farmout: serve the built DashboardPage chunk and see
# `apps/farmout` in it. `apply --prod --go-live` will not run until you type it.
# ============================================================================
#
# MODES
#   verify          content pins only. Touches no database.
#   dryrun          LOCAL SCRATCH ONLY: scratch_db.sh at $REF, then the whole
#                   ladder rolled back (dryrun_ec10.sh), the ladder run twice for
#                   idempotence, the six negative controls (ledger, route,
#                   oracle, trap, prompt, leak), and verify_sql.py with its
#                   canaries. The scratch container ec10-scratch is removed
#                   afterwards.
#   attempts        PRODUCTION, READ-ONLY: every learner row that already names
#                   farmout (enrolments, lesson progress, quiz and capstone
#                   attempts, certifications). A new course must show 0.
#   prod-status     PRODUCTION: each seed inside BEGIN ... ROLLBACK (PENDING or
#                   ALREADY-APPLIED), and the go-live state (HELD or APPLIED).
#   prod-dryrun     PRODUCTION, ROLLED BACK: the whole ladder, go-live included,
#                   in one transaction that ends in ROLLBACK, with the database
#                   snapshotted before and after and compared (dryrun_ec10.sh
#                   with TARGET=linked). Nothing commits.
#   apply --prod    PRODUCTION: prod-status, then the four seeds, one
#                   transaction each, in order, then prod-status.
#   apply --prod --go-live
#                   PRODUCTION: the go-live, after a typed confirmation that the
#                   deployed site serves /dashboard/apps/farmout.
#   rows            the MIGRATIONS.md rows to paste over the NOT YET APPLIED rows.
#   pin <ref>       reprint the digest table at a ref.
#
# ENV
#   REF=origin/main (before the merge: REF=origin/feat/ec10-farmout-course)
#   NG_REPO=/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen
#     (the checkout `supabase link`ed to NextGen production)
# EXIT: 0 did the thing; 2 refused or failed.
# =============================================================================
set -u

REF=${REF:-origin/main}
NG_REPO=${NG_REPO:-/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen}
HERE=$(cd "$(dirname "$0")" && pwd)
RUN=$(mktemp -d /tmp/ec10apply.XXXXXX)
SLUG=farmout

SEEDS="20261111_ec10_farmout_course
20261111_ec10_farmout_beginner_deep
20261111_ec10_farmout_intermediate_deep
20261111_ec10_farmout_advanced_deep"
GOLIVE=20261111_ec10_farmout_go_live
FILES="$SEEDS
$GOLIVE"
digest_for() {
  case $1 in
    20261111_ec10_farmout_course               ) echo 605f5486f7b833a898b6cfca61062fd135e0c663b944be95af8b186145530359 ;;
    20261111_ec10_farmout_beginner_deep        ) echo 49726cef046a0263587434f47b045823601db2bee5965b66c952ef6275661aaf ;;
    20261111_ec10_farmout_intermediate_deep    ) echo 2981aa4a24878d2d0c2dcb0cdd7a26cc5e92d29ab96fc59ff057ffc8410c8f60 ;;
    20261111_ec10_farmout_advanced_deep        ) echo 680250464edf90656b8218615d8b851f3b22f347eab63451e04cbf8124840e96 ;;
    20261111_ec10_farmout_go_live              ) echo 500f4496c502abb71e7314bb3157767cfd9892ecedf17481719bf3aecf26cd8f ;;
    *) echo UNPINNED ;;
  esac
}

say()    { echo "$*"; }
refuse() { echo; echo "REFUSED: $*"; echo "Nothing was applied. run artefacts: $RUN"; exit 2; }
prod_q() { ( cd "$NG_REPO" && supabase db query --linked -f "$1" 2>&1 ); }
failed() { [ "$1" -ne 0 ] || grep -qE '(^|[^A-Z_])ERROR' <<<"$2"; }

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
    if [ "$got" = "$want" ]; then printf '  ok        %-40s %s\n' "$f" "${got:0:12}"
    else printf '  STALE     %-40s expected %s found %s\n' "$f" "${want:0:12}" "${got:0:12}"; bad=1; fi
  done
  [ $bad = 0 ] || refuse "the SQL at $REF is not the content this ladder was pinned to. If a later PR legitimately moved it, re-pin with: $0 pin $REF, and say in that commit which PR moved it. Never hand-edit a digest."
  say "all five files match their pinned content"
}

# The hash of every farmout row the seeds write, so a seed inside BEGIN ... ROLLBACK
# can say whether it would change anything.
HASH_Q="md5(coalesce((select string_agg(md5(a::text), ',') from (select slug, name, module, path_order, prereq_slug from public.academy_apps where slug = 'farmout') a), '')
 || coalesce((select string_agg(md5(s::text), ',' order by s.tier) from (select tier, structure, content_version, active from public.academy_course_structures where app_slug = 'farmout') s), '')
 || coalesce((select string_agg(md5(q::text), ',' order by q.tier, q.scope, q.module_key, q.ord) from (select tier, scope, module_key, ord, prompt, options, answer_index, explanation, active from public.academy_quiz_questions where app_slug = 'farmout') q), '')
 || coalesce((select string_agg(md5(c::text), ',' order by c.tier) from (select tier, cert_tier, dataset, title, prompt, fields from public.academy_capstones where app_slug = 'farmout') c), ''))"

COURSE_SEED=20261111_ec10_farmout_course
state_of() {  # file -> PENDING | ALREADY-APPLIED | REFUSED:<reason>
  { echo "begin;"
    # A deep seed is judged with the course seed run ahead of it in the same
    # rolled-back transaction (the FK on app_slug), a no-op once it is applied.
    [ "$1" = "$COURSE_SEED" ] || { cat "$RUN/$COURSE_SEED.sql"; echo; }
    echo "create temp table ec10_before on commit drop as select $HASH_Q as h;"
    cat "$RUN/$1.sql"; echo
    echo "select case when (select h from ec10_before) = $HASH_Q then 'ALREADY-APPLIED' else 'PENDING' end as ec10_state;"
    echo "rollback;"; } > "$RUN/$1.state.sql"
  out=$(prod_q "$RUN/$1.state.sql"); rc=$?
  if failed $rc "$out"; then echo "REFUSED:$(grep -m1 -oE '[A-Za-z0-9 /_.-]*(refused|ERROR)[^"]*' <<<"$out" | cut -c1-200)"
  elif grep -q PENDING <<<"$out"; then echo PENDING
  elif grep -q ALREADY-APPLIED <<<"$out"; then echo ALREADY-APPLIED
  else echo UNKNOWN; fi
}

golive_state() {
  echo "select 'EC10|' || coalesce((select status from public.academy_apps where slug = 'farmout'), 'absent') as ec10_golive;" > "$RUN/golive.sql"
  out=$(prod_q "$RUN/golive.sql")
  case "$(grep -oE 'EC10\|[a-z_]+' <<<"$out" | head -1)" in
    'EC10|available') echo APPLIED ;;
    'EC10|coming_soon') echo HELD ;;
    'EC10|absent') echo "HELD (the course row is not seeded yet)" ;;
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
  say "prod-status: $pending pending, $done_ already applied, $bad refused or unknown, of 4 seeds"
  [ $bad = 0 ]
}

attempts() {
  cat > "$RUN/attempts.sql" <<'SQL'
select 'ATT|' || string_agg(t || ' ' || n, ' | ' order by t) as ec10_attempts from (
  select 'enrollments' t, count(*) n from public.academy_enrollments where app_slug = 'farmout'
  union all select 'lesson_progress', count(*) from public.academy_lesson_progress where app_slug = 'farmout'
  union all select 'quiz_attempts', count(*) from public.academy_quiz_attempts where app_slug = 'farmout'
  union all select 'capstone_attempts', count(*) from public.academy_capstone_attempts where app_slug = 'farmout'
  union all select 'certifications', count(*) from public.academy_certifications where app_slug = 'farmout') x;
SQL
  out=$(prod_q "$RUN/attempts.sql")
  line=$(grep -oE 'ATT\|[^"]+' <<<"$out" | head -1)
  [ -n "$line" ] || { echo "$out" | tail -5; refuse "could not read the attempt counts"; }
  say "  ${line#ATT|}"
  say "  A new course must show 0 everywhere. A non-zero count means farmout rows already exist in production: stop and read them before applying."
}

rows() {
  d=$(date -u +%F)
  for f in $SEEDS; do
    echo "| $d | \`$f.sql\` | EC10 Farm-ins, Farm-outs & Asset Valuation (farmout), seed | **APPLIED $d** by the owner via tools/course-waves/farmout/apply_ec10_farmout.sh apply --prod from $REF (content pinned by sha256; scratch dry run and prod rolled-back dry run first) |"
  done
  echo "| $d | \`$GOLIVE.sql\` | EC10 Farm-ins, Farm-outs & Asset Valuation (farmout), GO-LIVE: coming_soon to available | **APPLIED $d** via apply_ec10_farmout.sh apply --prod --go-live, after the deployed site served /dashboard/apps/farmout |"
}

dryrun() {
  local ok=1
  REPO="$NG_REPO" bash "$HERE/scratch_db.sh" "$REF" | tail -2 || refuse "scratch_db.sh failed"
  REPO="$NG_REPO" bash "$HERE/dryrun_ec10.sh" "$REF" | tail -3 | sed 's/^/  /'; [ "${PIPESTATUS[0]}" = 0 ] || ok=0
  REPO="$NG_REPO" bash "$HERE/dryrun_ec10.sh" "$REF" --idempotent | grep -E '^IDEMPOTENT' | sed 's/^/  /'; [ "${PIPESTATUS[0]}" = 0 ] || ok=0
  for c in ledger route oracle trap prompt leak; do
    REPO="$NG_REPO" bash "$HERE/dryrun_ec10.sh" "$REF" --control "$c" | grep -E '^CONTROL' | sed 's/^/  /'; [ "${PIPESTATUS[0]}" = 0 ] || ok=0
  done
  REPO="$NG_REPO" python3 "$HERE/verify_sql.py" "$REF" | tail -1 | sed 's/^/  /'; [ "${PIPESTATUS[0]}" = 0 ] || ok=0
  for c in --canary --canary-key --canary-field --canary-lesson; do
    REPO="$NG_REPO" python3 "$HERE/verify_sql.py" "$REF" "$c" >/dev/null 2>&1; rc=$?
    [ $rc = 2 ] && say "  verify_sql $c: DISAGREE as it must" || { say "  verify_sql $c did NOT disagree"; ok=0; }
  done
  docker rm -f ec10-scratch >/dev/null 2>&1 && say "  scratch container ec10-scratch removed"
  [ $ok = 1 ] || refuse "the scratch dry run did not come back clean"
  say "DRYRUN OK on the local scratch database: safe to run attempts, prod-status and prod-dryrun"
}

case "${1:-verify}" in
  verify)      fetch; say "VERIFY ONLY. No database was touched." ;;
  pin)
    [ $# -ge 2 ] || { echo "usage: $0 pin <ref>"; exit 2; }
    for f in $FILES; do
      body=$(git -C "$NG_REPO" show "$2:migrations/$f.sql" 2>/dev/null) || refuse "$f.sql is not in $2 in $NG_REPO; set NG_REPO"
      printf '%s\n' "$body" | sha256sum | awk -v n="$f" '{printf "    %-38s) echo %s ;;\n", n, $1}'
    done ;;
  dryrun)      fetch; dryrun ;;
  attempts)    fetch; say "target: PRODUCTION (read-only)"; attempts ;;
  prod-status) fetch; say "target: PRODUCTION (each seed rolled back)"; status || exit 2 ;;
  prod-dryrun) fetch; say "target: PRODUCTION, the whole ladder rolled back"
               TARGET=linked LINKED="$NG_REPO" REPO="$NG_REPO" bash "$HERE/dryrun_ec10.sh" "$SHA" || refuse "the production rolled-back dry run did not come back clean" ;;
  apply)
    [ "${2:-}" = "--prod" ] || refuse "apply writes PRODUCTION; pass --prod explicitly (run dryrun, attempts, prod-status and prod-dryrun first)"
    fetch
    if [ "${3:-}" = "--go-live" ]; then
      [ "$(golive_state)" = HELD ] || refuse "the go-live is not HELD on production: $(golive_state). Apply the four seeds first."
      say "THE GO-LIVE. Confirm you have SERVED the built DashboardPage chunk and SEEN 'apps/farmout' in it."
      printf "Type exactly  apps/farmout  to proceed: "; read -r answer
      [ "$answer" = "apps/farmout" ] || refuse "upload gate not confirmed"
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
      if failed $rc "$out"; then echo "$out" | grep -E 'ERROR|refused' | head -3; refuse "$f failed and rolled back; earlier seeds stay applied (re-running is safe)"; fi
      say "  applied $f"
    done
    say "post-check:"; status || refuse "the post-check shows refusals"
    say; say "SEEDED. farmout is coming_soon and no learner can reach it."
    say "Now run: $0 rows, and paste the four seed rows over their NOT YET APPLIED rows in MIGRATIONS.md."
    say "The go-live stays HELD until the deployed site serves /dashboard/apps/farmout." ;;
  rows)        rows ;;
  *) refuse "unknown mode '${1:-}' (verify | dryrun | attempts | prod-status | prod-dryrun | apply --prod [--go-live] | rows | pin <ref>)" ;;
esac
