#!/usr/bin/env bash
# =============================================================================
# FC1 "Separation & Slug Catching" SEED LADDER, content-addressed.
#
# WHY THIS SCRIPT EXISTS, AND WHAT IT REPLACES
# --------------------------------------------
# The first apply script read its SQL from a fixed worktree path:
#
#     M=/root/wt-fc1-nextgen/migrations
#
# That worktree sits on the PRE-REPAIR branch. PR #145 re-angled 31 duplicate
# questions and regenerated all three deep seeds, and none of that reached
# that path. Run the old script after the merge and it seeds the UNREPAIRED
# questions, reports success, and the whole repair is lost silently at apply
# time. A ladder that cannot tell it is reading stale SQL is the same class of
# defect as a gate that cannot fail.
#
# This script removes the dependency rather than documenting it. It never
# reads a working tree. It resolves each file out of the git OBJECT STORE at a
# ref (origin/main by default) with `git show`, and then REFUSES unless every
# file's sha256 matches the pinned digest below.
#
# WHY DIGESTS AND NOT A COMMIT SHA. This repository squash merges, so the
# commits on the branch do not survive into main and a pinned commit sha would
# be wrong the moment the PR lands. File CONTENT does survive a squash
# unchanged, so the content digest is the thing worth pinning. It is also
# immune to which clone, worktree or branch the SQL is fetched from, which is
# the failure this script exists to make impossible.
#
# THE TWO STEPS, unchanged in shape from the ladder this replaces.
#
#   seed      Step 1. Catalog row goes in as `coming_soon`, so no learner can
#             reach any of it. Three tier structures, 396 questions, three
#             capstones with eighteen graded fields.
#   go-live   Step 2. HELD. `coming_soon` -> `available`.
#
# =========================== THE UPLOAD GATE ================================
# DO NOT RUN `go-live` UNTIL A PRODUCTION UPLOAD CARRIES /dashboard/apps/separation.
#
# The 78 lessons, the teaching lab (separationLab.js) and its three explorer
# panels ship in the ZIP and not in this database. This database holds the
# catalog row, the lesson KEYS, the questions and the capstones. Flip before
# the upload and a live Facilities tile points at a route that does not exist.
#
# Verify the upload by CHUNK CONTENT and not by hash: serve the built
# DashboardPage chunk and confirm it carries `apps/separation`. `go-live`
# below will not run until you confirm that in writing.
# ============================================================================
#
# USAGE
#   ./apply_fc1_separation.sh verify            content check only, no database
#   ./apply_fc1_separation.sh seed              step 1
#   ./apply_fc1_separation.sh go-live           step 2, ONLY after the upload
#   ./apply_fc1_separation.sh pin <ref>         reprint the digest table
#
#   REPO=<path>  a git clone or worktree of petrolord-nextgen (any branch)
#   REF=<ref>    the ref to resolve the SQL from. Default origin/main.
#
# EXIT CODES. 0 did the thing. 2 REFUSED. Nothing else returns 0.
# =============================================================================
set -u

REF=${REF:-origin/main}

# The five files, and the sha256 of each one's content as merged. Reprint with
# `pin <ref>` if a later PR legitimately changes a seed, and say in the commit
# which PR moved it.
FILES="
20260921_fc1_separation_course
20260921_fc1_separation_beginner_deep
20260921_fc1_separation_intermediate_deep
20260921_fc1_separation_advanced_deep
20260921_fc1_separation_go_live
"
digest_for() {
  case $1 in
    20260921_fc1_separation_course)            echo 93357787f2fd988a15a630749ab7289be47e9037cd3a05491bf51f5755141553 ;;
    20260921_fc1_separation_beginner_deep)     echo b0c92a5b5ecf69a50cb22bad9725e87c9a3d33f23c53e7018bd607e369b1c01a ;;
    20260921_fc1_separation_intermediate_deep) echo a6401bf273171aaf340b95f9c7dcb8221e311cb91831ebbff85d4452056ef025 ;;
    20260921_fc1_separation_advanced_deep)     echo 1fdd7a6322d2a7ec91af17284b4f76e2566b8fc7afadcfce881252c628fb2def ;;
    20260921_fc1_separation_go_live)           echo ea9eb73e9b101132ccc77581f5f10139d45f234dacd31d5a81e187fa96f72e70 ;;
    *) echo UNPINNED ;;
  esac
}
SEEDS="20260921_fc1_separation_course
20260921_fc1_separation_beginner_deep
20260921_fc1_separation_intermediate_deep
20260921_fc1_separation_advanced_deep"
GOLIVE=20260921_fc1_separation_go_live

RUN=$(mktemp -d /tmp/fc1apply.XXXXXX)

refuse() { echo; echo "REFUSED: $*"; echo "Nothing was applied."; exit 2; }

find_repo() {
  if [ -n "${REPO:-}" ]; then echo "$REPO"; return; fi
  for c in /root/wt-fc1r-nextgen /root/wt-fc1-nextgen \
           /opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen; do
    [ -d "$c/.git" ] || [ -f "$c/.git" ] || continue
    echo "$c"; return
  done
  echo ""
}

# ---------------------------------------------------------------- resolve
# Fetch, then pull each file straight out of the object store at REF. The
# working tree of whatever clone this is is never read, so a clone parked on a
# stale branch cannot poison the run.
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
      printf "  ok        %-42s %s\n" "$f" "${got:0:12}"
    else
      printf "  STALE     %-42s\n" "$f"
      printf "              expected %s\n" "$want"
      printf "              found    %s\n" "$got"
      bad=1
    fi
  done
  [ "$bad" = 0 ] || refuse "the SQL at $REF is not the content this ladder was pinned to.
  Either $REF does not yet carry PR #145, or a later change moved a seed.
  If a later PR legitimately moved it, re-pin with:  $0 pin $REF
  and say in that commit which PR moved it. Do not edit a digest to make a run pass."
  echo
  echo "All five files match the pinned content. $RUN holds the verified SQL."

  # The dead session's script hard-codes this path and does NO verification of
  # its own, so if that path still holds stale SQL, anyone who runs the old
  # script loses the repair silently. Say so here, where somebody is looking.
  legacy=/root/wt-fc1-nextgen/migrations
  if [ -d "$legacy" ]; then
    lbad=0
    for f in $FILES; do
      [ -n "$f" ] || continue
      if [ ! -f "$legacy/$f.sql" ]; then lbad=1; continue; fi
      [ "$(sha256sum "$legacy/$f.sql" | cut -d' ' -f1)" = "$(digest_for "$f")" ] || lbad=1
    done
    echo
    if [ "$lbad" = 0 ]; then
      echo "  legacy path $legacy also matches. The old unverified script is safe today."
    else
      echo "  WARNING: $legacy does NOT match the pinned content."
      echo "  A dead session's apply script hard-codes that path and verifies nothing,"
      echo "  so running it would seed the wrong questions and report success."
      echo "  Point that worktree at the merged main before anyone uses it."
    fi
  fi
}

run_file() {
  f=$1
  { echo "begin;"; cat "$RUN/$f.sql"; echo; echo "commit;"; } > "$RUN/$f.wrapped.sql"
  OUT=$(supabase db query --linked -f "$RUN/$f.wrapped.sql" 2>&1); RC=$?
  if [ $RC -ne 0 ] || grep -q 'ERROR' <<<"$OUT"; then
    echo "FAILED at $f (rc $RC):"
    grep -E 'ERROR|refused' <<<"$OUT" | head -5
    exit 2
  fi
  echo "applied $f"
}

state() {
  cat > "$RUN/state.sql" <<'SQL'
select 'course' as what, status as v from public.academy_courses where app_slug = 'separation'
union all select 'tiers', count(*)::text from public.academy_course_structures where app_slug = 'separation'
union all select 'questions', count(*)::text from public.academy_quiz_questions where app_slug = 'separation'
union all select 'capstones', count(*)::text from public.academy_capstones where app_slug = 'separation';
SQL
  supabase db query --linked -f "$RUN/state.sql" 2>&1 | grep -E '"(what|v)"'
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
        | awk -v n="$f" '{printf "    %-42s) echo %s ;;\n", n, $1}'
    done
    ;;

  seed)
    resolve
    echo
    echo "STEP 1: seeding FC1 HIDDEN as coming_soon."
    for f in $SEEDS; do run_file "$f"; done
    echo
    state
    echo
    echo "Seeded. The course is coming_soon and no learner can reach it."
    echo "Log the four applied migrations in MIGRATIONS.md now, with today's date."
    echo "DO NOT run go-live until an upload carries /dashboard/apps/separation."
    ;;

  go-live)
    resolve
    echo
    echo "STEP 2: the GO-LIVE, which is gated on a verified production upload."
    echo "Confirm you have SERVED the built DashboardPage chunk and SEEN"
    echo "'apps/separation' in it. Checking a hash is not this check."
    printf "Type exactly  apps/separation  to proceed: "
    read -r answer
    [ "$answer" = "apps/separation" ] || refuse "upload gate not confirmed"
    run_file "$GOLIVE"
    echo
    state
    echo
    echo "FC1 is available. Log the go-live in MIGRATIONS.md with today's date."
    ;;

  *)
    echo "usage: $0 [verify|seed|go-live|pin <ref>]"; exit 2 ;;
esac
