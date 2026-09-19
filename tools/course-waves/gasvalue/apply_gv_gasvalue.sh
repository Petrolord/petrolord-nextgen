#!/usr/bin/env bash
# =============================================================================
# gasvalue "Flare Gas to Value & LPG/CNG" SEED LADDER, content-addressed.
#
# WHY THIS SCRIPT IS SHAPED THE WAY IT IS
# ---------------------------------------
# FC1's first apply script read its SQL from a fixed worktree path. That
# worktree sat on the PRE-REPAIR branch, PR #145 re-angled 36 duplicate pairs
# and regenerated all three deep seeds, and none of it reached that path. Run
# the old script after the merge and it seeds the UNREPAIRED questions, reports
# success, and the whole repair is lost silently at apply time. A ladder that
# cannot tell it is reading stale SQL is the same class of defect as a gate that
# cannot fail.
#
# So this script never reads a working tree. It resolves each file out of the
# git OBJECT STORE at a ref (origin/main by default) with `git show`, and
# REFUSES unless every file's sha256 matches the digest pinned below.
#
# WHY DIGESTS AND NOT A COMMIT SHA. This repository squash merges, so the
# commits on a branch do not survive into main and a pinned commit sha would be
# wrong the moment the next PR lands. File CONTENT survives a squash unchanged,
# so the content digest is the thing worth pinning. It is also immune to which
# clone, worktree or branch the SQL is fetched from, which is the failure this
# script exists to make impossible. Re-run `verify` against origin/main AFTER
# this PR's squash merge, rather than assuming it, and record the result.
#
# ON A MISMATCH it names exactly which files drifted, prints what it expected
# and what it found, and prints a `pin` command that reprints the whole digest
# table, SO NOBODY EVER HAND-EDITS A DIGEST TO MAKE A RUN PASS.
#
# THE TWO STEPS.
#
#   seed      Step 1. Catalogue row goes in as `coming_soon` at path_order 51,
#             module `energy_transition`, so no learner can reach any of it. Three
#             tier structures, 78 lesson keys, 396 questions, three capstones
#             with eighteen graded fields.
#   go-live   Step 2. HELD. `coming_soon` -> `available`, behind the go-live's
#             assertions (shape, the catalogue slots, a numeric grader at the
#             precision.json tolerances, the prompts, the leak, count, pairwise
#             and digest sweeps, the engine, a second route in SQL, the oracle
#             and eighteen traps) and TWO typed confirmations, one per upload.
#             It does not need carbon (52) seeded or live first.
#
# =========================== THE UPLOAD GATE ================================
# DO NOT RUN `go-live` UNTIL BOTH OF THESE ARE LIVE:
#
#   1. A NEXTGEN PRODUCTION UPLOAD THAT CARRIES /dashboard/apps/gasvalue.
#      The 78 lessons, the teaching lab and its three explorer panels ship in
#      the ZIP and not in this database. This database holds the catalogue row,
#      the lesson KEYS, the questions and the capstones. Flip before the upload
#      and a live Energy Transition tile points at a route that does not exist.
#      Verify the upload by CHUNK CONTENT and not by hash: serve the built
#      DashboardPage chunk and confirm it carries `apps/gasvalue`.
#
#   2. THE SUITE PRODUCTION UPLOAD CARRYING SUITE MAIN 06aef5d63 (Suite #543
#      MD5-0, #545 MD4-0, #546 MD45-1, merged and NOT yet uploaded when this
#      ladder was cut). The course teaches the Suite's Flare Gas to Value and
#      LPG & CNG Rollout pages as those PRs repaired them, on the engines at
#      df31f53: the flare by 40 CFR 98.233(n) with two efficiencies, only the
#      recovered share of a flare credited, the fill limit on its stated basis,
#      the carousel on the positions wholly working, CNG pressures read as
#      absolute. Until that upload is live the pages a learner opens beside the
#      course still count every unburned carbon as methane and credit a plant
#      with the whole flare, which are the exact traps the course is built on.
#      Verify it by serving the Suite production build and confirming it is at
#      or after 06aef5d63 (the build stamp, or the Rollout Studio chunk
#      carrying the MD45-1 vaporizer outlet).
#
# `go-live` below will not run until you confirm BOTH in writing.
# ============================================================================
#
# MIGRATIONS.md. This ladder is HELD, so the go-live is logged when it is
# APPLIED and not before. Both steps below tell you exactly what to log and when.
#
# USAGE
#   ./apply_gv_gasvalue.sh verify        content check only, no database
#   ./apply_gv_gasvalue.sh seed          step 1
#   ./apply_gv_gasvalue.sh go-live       step 2, ONLY after BOTH uploads
#   ./apply_gv_gasvalue.sh pin <ref>     reprint the digest table
#
#   REPO=<path>  a git clone or worktree of petrolord-nextgen (any branch). The
#                default is resolved from THIS SCRIPT'S OWN LOCATION when it is
#                running out of the committed tree.
#   REF=<ref>    the ref to resolve the SQL from. Default origin/main.
#   LINKED=<dir> the checkout linked to the NextGen Supabase project, where the
#                SQL is run from. Default the petrolord-nextgen workspace.
#
# EXIT CODES. 0 did the thing. 2 REFUSED. Nothing else returns 0.
# =============================================================================
set -u

REF=${REF:-origin/main}
# The checkout `supabase db query --linked` runs from: the one LINKED to the
# NextGen project. A worktree of the repository is usually not linked.
LINKED=${LINKED:-/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen}

# The five files, and the sha256 of each one's content as merged. Reprint with
# `pin <ref>` if a later PR legitimately changes a seed, and say in the commit
# which PR moved it.
FILES="
20261013_gv_gasvalue_course
20261013_gv_gasvalue_beginner_deep
20261013_gv_gasvalue_intermediate_deep
20261013_gv_gasvalue_advanced_deep
20261013_gv_gasvalue_go_live
"
digest_for() {
  case $1 in
    20261013_gv_gasvalue_course                  ) echo 879cf7e79e9792e77683cedc19e789a49e306e3a0729dced7a1616c57fe4f23b ;;
    20261013_gv_gasvalue_beginner_deep           ) echo 3618a3a97f3db17f070a3c8fa49aff2660b87fa5e7e33294383a3571ef27b76b ;;
    20261013_gv_gasvalue_intermediate_deep       ) echo 26cfbeb653401c6e18721741025b77de10dcbe55d5871988b0080cd8488da67f ;;
    20261013_gv_gasvalue_advanced_deep           ) echo dd14a416a99d4ecb5e56a8bea43443947b9609c5912b875d71959f8a544cc80e ;;
    20261013_gv_gasvalue_go_live                 ) echo 7cde52365b71417edd695b87e6df108b15d8c8068609687e4f4dad1961f3d098 ;;
    *) echo UNPINNED ;;
  esac
}
SEEDS="20261013_gv_gasvalue_course
20261013_gv_gasvalue_beginner_deep
20261013_gv_gasvalue_intermediate_deep
20261013_gv_gasvalue_advanced_deep"
GOLIVE=20261013_gv_gasvalue_go_live

RUN=$(mktemp -d /tmp/gvapply.XXXXXX)
HERE=$(cd "$(dirname "$0")" && pwd)

refuse() { echo; echo "REFUSED: $*"; echo "Nothing was applied."; exit 2; }

find_repo() {
  if [ -n "${REPO:-}" ]; then echo "$REPO"; return; fi
  # The repository this script is committed in, when it is running from
  # tools/course-waves/gasvalue.
  up=$(cd "$HERE/../../.." 2>/dev/null && pwd)
  if [ -n "$up" ] && { [ -d "$up/.git" ] || [ -f "$up/.git" ]; }; then echo "$up"; return; fi
  for c in /root/wt-et-gasvalue-nextgen \
           /opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen; do
    [ -d "$c/.git" ] || [ -f "$c/.git" ] || continue
    echo "$c"; return
  done
  echo ""
}

resolve() {
  REPO_DIR=$(find_repo)
  [ -n "$REPO_DIR" ] || refuse "no petrolord-nextgen clone found; set REPO=<path>"
  git -C "$REPO_DIR" rev-parse --git-dir >/dev/null 2>&1 \
    || refuse "$REPO_DIR is not a git repository"
  echo "repo:    $REPO_DIR"
  echo "ref:     $REF"
  git -C "$REPO_DIR" fetch --quiet origin 2>/dev/null \
    || echo "  (fetch failed, using the objects already present)"
  REF_SHA=$(git -C "$REPO_DIR" rev-parse --verify --quiet "$REF^{commit}") \
    || refuse "$REF does not resolve to a commit in $REPO_DIR"
  echo "commit:  $REF_SHA"
  echo

  bad=0
  for f in $FILES; do
    [ -n "$f" ] || continue
    want=$(digest_for "$f")
    [ "$want" != UNPINNED ] || refuse "$f has no pinned digest"
    if ! git -C "$REPO_DIR" show "$REF_SHA:migrations/$f.sql" > "$RUN/$f.sql" 2>/dev/null; then
      echo "  MISSING   $f.sql is not in $REF"
      bad=1; continue
    fi
    got=$(sha256sum "$RUN/$f.sql" | cut -d' ' -f1)
    if [ "$got" = "$want" ]; then
      printf "  ok        %-46s %s\n" "$f" "${got:0:12}"
    else
      printf "  STALE     %-46s\n" "$f"
      printf "              expected %s\n" "$want"
      printf "              found    %s\n" "$got"
      bad=1
    fi
  done
  [ "$bad" = 0 ] || refuse "the SQL at $REF is not the content this ladder was pinned to.
  Either $REF does not yet carry the gasvalue course PR, or a later change moved a seed.
  If a later PR legitimately moved it, re-pin with:  $0 pin $REF
  and say in that commit which PR moved it. Do not edit a digest to make a run pass."
  echo
  echo "All five files match the pinned content. $RUN holds the verified SQL."
}

run_file() {
  f=$1
  { echo "begin;"; cat "$RUN/$f.sql"; echo; echo "commit;"; } > "$RUN/$f.wrapped.sql"
  OUT=$(cd "$LINKED" && supabase db query --linked -f "$RUN/$f.wrapped.sql" 2>&1); RC=$?
  if [ $RC -ne 0 ] || grep -q 'ERROR' <<<"$OUT"; then
    echo "FAILED at $f (rc $RC):"
    grep -E 'ERROR|refused' <<<"$OUT" | head -5
    exit 2
  fi
  echo "applied $f"
}

state() {
  cat > "$RUN/state.sql" <<'SQL'
select 'course' as what, status as v from public.academy_apps where slug = 'gasvalue'
union all select 'tiers', count(*)::text from public.academy_course_structures where app_slug = 'gasvalue' and active
union all select 'lessons', count(*)::text from public.academy_course_structures s,
       lateral jsonb_array_elements(s.structure->'modules') m,
       lateral jsonb_array_elements_text(m->'lesson_keys') lk
 where s.app_slug = 'gasvalue' and s.active
union all select 'questions', count(*)::text from public.academy_quiz_questions where app_slug = 'gasvalue'
union all select 'capstones', count(*)::text from public.academy_capstones where app_slug = 'gasvalue'
union all select 'graded', count(*)::text from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
 where c.app_slug = 'gasvalue'
union all select 'catalogue',
       count(*) filter (where status='available')::text || ' available / ' ||
       count(*) filter (where status='coming_soon')::text || ' coming_soon'
  from public.academy_apps;
SQL
  ( cd "$LINKED" && supabase db query --linked -f "$RUN/state.sql" 2>&1 ) | grep -E '"(what|v)"'
}

case "${1:-verify}" in
  verify)
    resolve
    echo
    echo "VERIFY ONLY. No database was touched."
    ;;

  pin)
    [ $# -ge 2 ] || { echo "usage: $0 pin <ref>"; exit 2; }
    R=$(find_repo); [ -n "$R" ] || refuse "no clone found; set REPO=<path>"
    echo "Digest table at $2 (paste into digest_for):"
    for f in $FILES; do
      [ -n "$f" ] || continue
      git -C "$R" show "$2:migrations/$f.sql" 2>/dev/null | sha256sum \
        | awk -v n="$f" '{printf "    %-44s) echo %s ;;\n", n, $1}'
    done
    ;;

  seed)
    resolve
    echo
    echo "STEP 1: seeding gasvalue HIDDEN as coming_soon."
    for f in $SEEDS; do run_file "$f"; done
    echo
    state
    echo
    echo "Seeded. The course is coming_soon and no learner can reach it."
    echo "LOG THE FOUR APPLIED MIGRATIONS IN MIGRATIONS.md NOW, with today's date:"
    for f in $SEEDS; do echo "    migrations/$f.sql"; done
    echo "DO NOT run go-live until BOTH are live: a NextGen upload carrying /dashboard/apps/gasvalue,"
    echo "and the Suite production upload carrying Suite main 06aef5d63 (Suite #543, #545, #546)."
    ;;

  go-live)
    resolve
    echo
    echo "STEP 2: the GO-LIVE, which is gated on TWO verified production uploads."
    echo
    echo "UPLOAD 1 of 2. Confirm you have SERVED the built NextGen DashboardPage chunk"
    echo "and SEEN 'apps/gasvalue' in it. Checking a hash is not this check."
    printf "Type exactly  apps/gasvalue  to proceed: "
    read -r answer
    [ "$answer" = "apps/gasvalue" ] || refuse "NextGen upload gate not confirmed"
    echo
    echo "UPLOAD 2 of 2. Confirm the Suite production upload carrying Suite main"
    echo "06aef5d63 (Suite #543 MD5-0, #545 MD4-0, #546 MD45-1: the Flare Gas to"
    echo "Value and LPG & CNG Rollout page repairs this course teaches) is LIVE:"
    echo "serve the Suite production build and see it at or after 06aef5d63."
    echo "Merged is not uploaded."
    printf "Type exactly  06aef5d63  to proceed: "
    read -r answer
    [ "$answer" = "06aef5d63" ] || refuse "Suite upload gate (06aef5d63, Suite #543/#545/#546) not confirmed"
    run_file "$GOLIVE"
    echo
    state
    echo
    echo "gasvalue is available in the Energy Transition module."
    echo "LOG THE FIFTH MIGRATION IN MIGRATIONS.md with today's date:"
    echo "    migrations/$GOLIVE.sql"
    echo "All five of this ladder should now be logged there."
    ;;

  *)
    echo "usage: $0 [verify|seed|go-live|pin <ref>]"; exit 2 ;;
esac
