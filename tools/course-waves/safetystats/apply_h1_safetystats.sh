#!/usr/bin/env bash
# =============================================================================
# H1 safetystats "Safety Performance Statistics & KPIs" SEED LADDER,
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
# THE TWO STEPS.
#
#   seed      Step 1. Catalogue row goes in as `coming_soon` at path_order 61,
#             module `hse`, so no learner can reach any of it. Three tier
#             structures, 78 lesson keys, 396 questions, three capstones with
#             eighteen graded fields.
#   go-live   Step 2. HELD. `coming_soon` -> `available`, behind the go-live's
#             assertions (shape, the numeric grader, the prompts, the engine
#             ledger, a second route in SQL and the traps) and a typed
#             confirmation of the upload.
#
# =========================== THE UPLOAD GATE ================================
# DO NOT RUN `go-live` UNTIL A PRODUCTION UPLOAD CARRIES /dashboard/apps/safetystats.
#
# The 78 lessons, the teaching lab (safetystatsLab.js) and its three explorer
# panels ship in the ZIP and not in this database. This database holds the
# catalogue row, the lesson KEYS, the questions and the capstones. Flip before
# the upload and a live HSE tile points at a route that does not exist.
#
# Verify the upload by CHUNK CONTENT and not by hash: serve the built
# DashboardPage chunk and confirm it carries `apps/safetystats`. `go-live`
# below will not run until you confirm that in writing.
# ============================================================================
#
# MIGRATIONS.md. This ladder is HELD, so the go-live is logged when it is
# APPLIED and not before. Both steps below tell you exactly what to log and when.
#
# USAGE
#   ./apply_h1_safetystats.sh verify          content check only, no database
#   ./apply_h1_safetystats.sh seed            step 1
#   ./apply_h1_safetystats.sh go-live        step 2, ONLY after the upload
#   ./apply_h1_safetystats.sh pin <ref>       reprint the digest table
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
20261003_h1_safetystats_course
20261003_h1_safetystats_beginner_deep
20261003_h1_safetystats_intermediate_deep
20261003_h1_safetystats_advanced_deep
20261003_h1_safetystats_go_live
"
digest_for() {
  case $1 in
    20261003_h1_safetystats_course           ) echo 3bcf668dccef6ccde553d0fa9d22fc3a994a23d5520ff4992b9d8b19f4f71024 ;;
    20261003_h1_safetystats_beginner_deep    ) echo 9dda81fa33f4baebbb046dfd411b0d2b968fd4bdd91700bebb9663bf30ed2d62 ;;
    20261003_h1_safetystats_intermediate_deep) echo 7560737e8f9df5080a8ba37e3a104d727c799304a819ef4123398dcdf18a143f ;;
    20261003_h1_safetystats_advanced_deep    ) echo 821ffc51caf5b978c5777322086bd17dccd1b3785c0e7dd2a0655857a37166de ;;
    20261003_h1_safetystats_go_live          ) echo 7dfa0d0db3141b5a18b4be0fe0cbfbf776670a2a47960636a1a4f2a90cb1cfa4 ;;
    *) echo UNPINNED ;;
  esac
}
SEEDS="20261003_h1_safetystats_course
20261003_h1_safetystats_beginner_deep
20261003_h1_safetystats_intermediate_deep
20261003_h1_safetystats_advanced_deep"
GOLIVE=20261003_h1_safetystats_go_live

RUN=$(mktemp -d /tmp/h1apply.XXXXXX)
HERE=$(cd "$(dirname "$0")" && pwd)

refuse() { echo; echo "REFUSED: $*"; echo "Nothing was applied."; exit 2; }

find_repo() {
  if [ -n "${REPO:-}" ]; then echo "$REPO"; return; fi
  # The repository this script is committed in, when it is running from
  # tools/course-waves/safetystats.
  up=$(cd "$HERE/../../.." 2>/dev/null && pwd)
  if [ -n "$up" ] && { [ -d "$up/.git" ] || [ -f "$up/.git" ]; }; then echo "$up"; return; fi
  for c in /root/wt-h1-nextgen \
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
  Either $REF does not yet carry the H1 safetystats course PR, or a later change moved a seed.
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
select 'course' as what, status as v from public.academy_apps where slug = 'safetystats'
union all select 'tiers', count(*)::text from public.academy_course_structures where app_slug = 'safetystats' and active
union all select 'lessons', count(*)::text from public.academy_course_structures s,
       lateral jsonb_array_elements(s.structure->'modules') m,
       lateral jsonb_array_elements_text(m->'lesson_keys') lk
 where s.app_slug = 'safetystats' and s.active
union all select 'questions', count(*)::text from public.academy_quiz_questions where app_slug = 'safetystats'
union all select 'capstones', count(*)::text from public.academy_capstones where app_slug = 'safetystats'
union all select 'graded', count(*)::text from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
 where c.app_slug = 'safetystats'
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
    echo "STEP 1: seeding safetystats HIDDEN as coming_soon."
    for f in $SEEDS; do run_file "$f"; done
    echo
    state
    echo
    echo "Seeded. The course is coming_soon and no learner can reach it."
    echo "LOG THE FOUR APPLIED MIGRATIONS IN MIGRATIONS.md NOW, with today's date:"
    for f in $SEEDS; do echo "    migrations/$f.sql"; done
    echo "DO NOT run go-live until an upload carries /dashboard/apps/safetystats."
    ;;

  go-live)
    resolve
    echo
    echo "STEP 2: the GO-LIVE, which is gated on a verified production upload."
    echo "Confirm you have SERVED the built DashboardPage chunk and SEEN"
    echo "'apps/safetystats' in it. Checking a hash is not this check."
    printf "Type exactly  apps/safetystats  to proceed: "
    read -r answer
    [ "$answer" = "apps/safetystats" ] || refuse "upload gate not confirmed"
    run_file "$GOLIVE"
    echo
    state
    echo
    echo "safetystats is available. HSE now carries its first course."
    echo "LOG THE FIFTH MIGRATION IN MIGRATIONS.md with today's date:"
    echo "    migrations/$GOLIVE.sql"
    echo "All five of this ladder should now be logged there."
    ;;

  *)
    echo "usage: $0 [verify|seed|go-live|pin <ref>]"; exit 2 ;;
esac
