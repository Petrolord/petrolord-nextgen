#!/usr/bin/env bash
# =============================================================================
# H5 qra "Quantitative Risk Assessment" SEED LADDER,
# content-addressed.
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
# H5 HAS ONE EXTRA REASON TO BE CONTENT-ADDRESSED. Three key-truth audits ran
# on the 21 banks while this ladder was written, and the three deep seeds are a
# function of those banks. If an audit lands after the seeds were cut, the deep
# seeds MUST be regenerated with `gen_seeds.sh <ref> --write` and RE-PINNED here
# in the same commit. The pins below make that impossible to forget: a stale
# seed refuses instead of seeding yesterday's questions.
#
# THE TWO STEPS.
#
#   seed      Step 1. Catalogue row goes in as `coming_soon` at path_order 65,
#             module `hse`, so no learner can reach any of it. Three tier
#             structures, 78 lesson keys, 396 questions, three capstones with
#             eighteen graded fields.
#   go-live   Step 2. HELD. `coming_soon` -> `available`, behind the go-live's
#             assertions (shape, the numeric grader, the prompts, the engine
#             ledger, a second route in SQL and the traps) and a typed
#             confirmation of the upload.
#
# =========================== THE UPLOAD GATE ================================
# DO NOT RUN `go-live` UNTIL A PRODUCTION UPLOAD CARRIES /dashboard/apps/qra.
#
# The 78 lessons, the teaching lab (qraLab.js) and its three explorer
# panels ship in the ZIP and not in this database. This database holds the
# catalogue row, the lesson KEYS, the questions and the capstones. Flip before
# the upload and a live HSE tile points at a route that does not exist.
#
# Verify the upload by CHUNK CONTENT and not by hash: serve the built
# DashboardPage chunk and confirm it carries `apps/qra`. `go-live`
# below will not run until you confirm that in writing.
# ============================================================================
#
# MIGRATIONS.md. This ladder is HELD, so the go-live is logged when it is
# APPLIED and not before. Both steps below tell you exactly what to log and when.
#
# USAGE
#   ./apply_h5_qra.sh verify          content check only, no database
#   ./apply_h5_qra.sh seed            step 1
#   ./apply_h5_qra.sh go-live        step 2, ONLY after the upload
#   ./apply_h5_qra.sh pin <ref>       reprint the digest table
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
20261007_h5_qra_course
20261007_h5_qra_beginner_deep
20261007_h5_qra_intermediate_deep
20261007_h5_qra_advanced_deep
20261007_h5_qra_go_live
"
digest_for() {
  case $1 in
    20261007_h5_qra_course           ) echo 6fc6b28ff0531dfc73e282ef6a192ab69d274af0ccb6234c13eb95cf2d438a23 ;;
    20261007_h5_qra_beginner_deep    ) echo 7f555dc0c28a5101f312292cc54e3e88d45cad4f122cb3c7ab72a033fd19dcf2 ;;
    20261007_h5_qra_intermediate_deep) echo 7cd80890e4174460bc52321874dd70dbabd526d4b40f615ede7223d66fb7c923 ;;
    20261007_h5_qra_advanced_deep    ) echo 87fec3be4a4788b4952623d27a6337042adb5d2f2ab31d1b7ed7ed1ff5674369 ;;
    20261007_h5_qra_go_live          ) echo f695cc8b2ee3809a46ce7b596faaac534357741756ffef168ffabbc81e5de349 ;;
    *) echo UNPINNED ;;
  esac
}
SEEDS="20261007_h5_qra_course
20261007_h5_qra_beginner_deep
20261007_h5_qra_intermediate_deep
20261007_h5_qra_advanced_deep"
GOLIVE=20261007_h5_qra_go_live

RUN=$(mktemp -d /tmp/h5apply.XXXXXX)
HERE=$(cd "$(dirname "$0")" && pwd)

refuse() { echo; echo "REFUSED: $*"; echo "Nothing was applied."; exit 2; }

find_repo() {
  if [ -n "${REPO:-}" ]; then echo "$REPO"; return; fi
  # The repository this script is committed in, when it is running from
  # tools/course-waves/qra.
  up=$(cd "$HERE/../../.." 2>/dev/null && pwd)
  if [ -n "$up" ] && { [ -d "$up/.git" ] || [ -f "$up/.git" ]; }; then echo "$up"; return; fi
  for c in /root/wt-h5-nextgen \
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
  Either $REF does not yet carry the H5 qra course PR, or a later change moved a seed.
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
select 'course' as what, status as v from public.academy_apps where slug = 'qra'
union all select 'tiers', count(*)::text from public.academy_course_structures where app_slug = 'qra' and active
union all select 'lessons', count(*)::text from public.academy_course_structures s,
       lateral jsonb_array_elements(s.structure->'modules') m,
       lateral jsonb_array_elements_text(m->'lesson_keys') lk
 where s.app_slug = 'qra' and s.active
union all select 'questions', count(*)::text from public.academy_quiz_questions where app_slug = 'qra'
union all select 'capstones', count(*)::text from public.academy_capstones where app_slug = 'qra'
union all select 'graded', count(*)::text from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
 where c.app_slug = 'qra'
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
    echo "STEP 1: seeding qra HIDDEN as coming_soon."
    for f in $SEEDS; do run_file "$f"; done
    echo
    state
    echo
    echo "Seeded. The course is coming_soon and no learner can reach it."
    echo "LOG THE FOUR APPLIED MIGRATIONS IN MIGRATIONS.md NOW, with today's date:"
    for f in $SEEDS; do echo "    migrations/$f.sql"; done
    echo "DO NOT run go-live until an upload carries /dashboard/apps/qra."
    ;;

  go-live)
    resolve
    echo
    echo "STEP 2: the GO-LIVE, which is gated on a verified production upload."
    echo "Confirm you have SERVED the built DashboardPage chunk and SEEN"
    echo "'apps/qra' in it. Checking a hash is not this check."
    printf "Type exactly  apps/qra  to proceed: "
    read -r answer
    [ "$answer" = "apps/qra" ] || refuse "upload gate not confirmed"
    run_file "$GOLIVE"
    echo
    state
    echo
    echo "qra is available. HSE now carries its fifth course."
    echo "LOG THE FIFTH MIGRATION IN MIGRATIONS.md with today's date:"
    echo "    migrations/$GOLIVE.sql"
    echo "All five of this ladder should now be logged there."
    ;;

  *)
    echo "usage: $0 [verify|seed|go-live|pin <ref>]"; exit 2 ;;
esac
