#!/usr/bin/env bash
# =============================================================================
# H2 hygiene "Occupational Hygiene: Noise, Chemical & Heat Exposure" SEED
# LADDER, content-addressed.
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
# H2 HAS ONE EXTRA REASON TO BE CONTENT-ADDRESSED. Three key-truth audits were
# running on the 21 banks while this ladder was generated, and the three deep
# seeds are a function of those banks. If an audit lands after this PR, the deep
# seeds MUST be regenerated with `gen_seeds.sh <ref> --write` and RE-PINNED
# here in the same commit. The pins below are what makes that impossible to
# forget: a stale seed refuses instead of seeding yesterday's questions.
#
# ON A MISMATCH it names exactly which files drifted, prints what it expected
# and what it found, and prints a `pin` command that reprints the whole digest
# table, SO NOBODY EVER HAND-EDITS A DIGEST TO MAKE A RUN PASS.
#
# THE TWO STEPS.
#
#   seed      Step 1. Catalogue row goes in as `coming_soon` at path_order 62,
#             module `hse`, so no learner can reach any of it. Three tier
#             structures, 78 lesson keys, 396 questions, three capstones with
#             eighteen graded fields.
#   go-live   Step 2. HELD, AND APPLIED BY NOBODY IN THE PULL REQUEST THAT
#             SHIPS IT. `coming_soon` -> `available`, behind the go-live's
#             assertions (shape, the catalogue slot, the numeric grader, the
#             prompts, the leak, pairwise and digest sweeps, the engine ledger,
#             a second route in SQL, the 56 traps and this course's own heat
#             line) and a typed confirmation of the upload.
#
# =========================== THE UPLOAD GATE ================================
# DO NOT RUN `go-live` UNTIL A PRODUCTION UPLOAD CARRIES /dashboard/apps/hygiene.
#
# The 78 lessons, the teaching lab and its three explorer panels (the noise
# dosimeter, protection and chemicals, and heat stress) ship in the ZIP and not
# in this database. This database holds the catalogue row, the lesson KEYS, the
# questions and the capstones. Flip before the upload and a live HSE tile points
# at a route that does not exist.
#
# Verify the upload by CHUNK CONTENT and not by hash: serve the built
# DashboardPage chunk and confirm it carries `apps/hygiene`. `go-live` below
# will not run until you confirm that in writing.
# ============================================================================
#
# =================== THE PRODUCTION DRY RUN, BEFORE EITHER STEP =============
# No step of this wave ran supabase against anything. The whole ladder was
# iterated against a local scratch Postgres (scratch_db.sh, dryrun_h2.sh), which
# cannot prove production's rows match. So run the ladder against production
# ONCE, rolled back, before `seed`:
#
#   ./apply_h2_hygiene.sh dryrun
#
# It wraps all five migrations in one transaction that ends in ROLLBACK, prints
# what the flipped course would read back as, and commits nothing. If it fails,
# stop: the go-live's assertions have found something about production that the
# scratch database could not.
# ============================================================================
#
# MIGRATIONS.md. This ladder is HELD, so the go-live is logged when it is
# APPLIED and not before. Both steps below tell you exactly what to log and when.
#
# USAGE
#   ./apply_h2_hygiene.sh verify        content check only, no database
#   ./apply_h2_hygiene.sh dryrun        all five, rolled back, against production
#   ./apply_h2_hygiene.sh seed          step 1
#   ./apply_h2_hygiene.sh go-live       step 2, ONLY after the upload
#   ./apply_h2_hygiene.sh pin <ref>     reprint the digest table
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

# The five files, and the sha256 of each one's content. These were taken from
# the files gen_seeds.sh emitted on the branch, before the commit: file CONTENT
# survives a squash unchanged, so they are what origin/main will carry. RE-RUN
# `verify` against origin/main AFTER the squash merge rather than assuming it,
# and record the result. Reprint with `pin <ref>` if a later PR legitimately
# changes a seed, and say in the commit which PR moved it.
#
# RE-PINNED 2026-09-21 (fix/held-copy-pass-and-231): exposure.js landed at
# engines 16fd6c9 (#231), the digest's engine line moved 708 -> 714 lines and
# its provenance to 16fd6c9, so the go-live's digest sweep reads 1631 numbers
# (was 1632) and the course file's two provenance comments name 16fd6c9. The
# three deep seeds did not move.
FILES="
20261004_h2_hygiene_course
20261004_h2_hygiene_beginner_deep
20261004_h2_hygiene_intermediate_deep
20261004_h2_hygiene_advanced_deep
20261004_h2_hygiene_go_live
"
digest_for() {
  case $1 in
    20261004_h2_hygiene_course           ) echo 2c0a21a13f829c8f4eba408557f18890f2d6effbf34eca62c5d4506e5db85835 ;;
    20261004_h2_hygiene_beginner_deep    ) echo b1920ab77cf7979a49752ea2b43cfcaff9aeee7f6c28b99a955bb6a3b793b373 ;;
    20261004_h2_hygiene_intermediate_deep) echo 156135acf05dabd09dbe2eec20562d041149c83af231bb07ca2e3147572edffa ;;
    20261004_h2_hygiene_advanced_deep    ) echo 1d26d30696e3ebbd3658e601f034d9a8979338816bfad19769d2cc77856abd36 ;;
    20261004_h2_hygiene_go_live          ) echo 772ee101b755a1a05047ed05340786248533daa3730c78d3256d9bf5dd316a5c ;;
    *) echo UNPINNED ;;
  esac
}
SEEDS="20261004_h2_hygiene_course
20261004_h2_hygiene_beginner_deep
20261004_h2_hygiene_intermediate_deep
20261004_h2_hygiene_advanced_deep"
GOLIVE=20261004_h2_hygiene_go_live

RUN=$(mktemp -d /tmp/h2apply.XXXXXX)
HERE=$(cd "$(dirname "$0")" && pwd)

refuse() { echo; echo "REFUSED: $*"; echo "Nothing was applied."; exit 2; }

find_repo() {
  if [ -n "${REPO:-}" ]; then echo "$REPO"; return; fi
  # The repository this script is committed in, when it is running from
  # tools/course-waves/hygiene.
  up=$(cd "$HERE/../../.." 2>/dev/null && pwd)
  if [ -n "$up" ] && { [ -d "$up/.git" ] || [ -f "$up/.git" ]; }; then echo "$up"; return; fi
  for c in /root/wt-h2-nextgen \
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
  Either $REF does not yet carry the H2 hygiene course PR, or a later change moved a seed.
  If a bank audit landed, regenerate with gen_seeds.sh <ref> --write and re-pin with:  $0 pin $REF
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
select 'course' as what, status as v from public.academy_apps where slug = 'hygiene'
union all select 'tiers', count(*)::text from public.academy_course_structures where app_slug = 'hygiene' and active
union all select 'lessons', count(*)::text from public.academy_course_structures s,
       lateral jsonb_array_elements(s.structure->'modules') m,
       lateral jsonb_array_elements_text(m->'lesson_keys') lk
 where s.app_slug = 'hygiene' and s.active
union all select 'questions', count(*)::text from public.academy_quiz_questions where app_slug = 'hygiene'
union all select 'capstones', count(*)::text from public.academy_capstones where app_slug = 'hygiene'
union all select 'graded', count(*)::text from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
 where c.app_slug = 'hygiene'
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

  dryrun)
    resolve
    echo
    echo "THE PRODUCTION DRY RUN: all five migrations in ONE transaction that ends"
    echo "in ROLLBACK. Nothing commits, including the go-live's flip."
    {
      echo "begin;"
      for f in $SEEDS $GOLIVE; do echo "-- ================= $f"; cat "$RUN/$f.sql"; echo; done
      cat <<'SQL'
select 'DRY RUN' as what,
       'hygiene ' || a.status
       || ' | ' || (select count(*) from public.academy_course_structures where app_slug='hygiene' and active)::text || ' tiers'
       || ' | ' || (select count(*) from public.academy_quiz_questions where app_slug='hygiene')::text || ' questions'
       || ' | ' || (select count(*) from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
                     where c.app_slug='hygiene')::text || ' graded'
       || ' | path_order ' || a.path_order::text || ' in ' || a.module as v
  from public.academy_apps a where a.slug = 'hygiene';
rollback;
SQL
    } > "$RUN/dryrun.sql"
    OUT=$(cd "$LINKED" && supabase db query --linked -f "$RUN/dryrun.sql" 2>&1); RC=$?
    echo "$OUT" | grep -E '"(what|v)"|ERROR|refused|NOTICE' | cut -c1-400
    if [ $RC -ne 0 ] || grep -q 'ERROR' <<<"$OUT"; then
      echo
      echo "DRY RUN FAILED (rc $RC). Nothing was applied and the transaction rolled back."
      echo "Do NOT run seed. Hand the refusal back to the wave."
      exit 2
    fi
    echo
    echo "DRY RUN CLEAN against production, and rolled back. Nothing changed."
    ;;

  seed)
    resolve
    echo
    echo "STEP 1: seeding hygiene HIDDEN as coming_soon."
    for f in $SEEDS; do run_file "$f"; done
    echo
    state
    echo
    echo "Seeded. The course is coming_soon and no learner can reach it."
    echo "LOG THE FOUR APPLIED MIGRATIONS IN MIGRATIONS.md NOW, with today's date:"
    for f in $SEEDS; do echo "    migrations/$f.sql"; done
    echo "DO NOT run go-live until an upload carries /dashboard/apps/hygiene."
    ;;

  go-live)
    resolve
    echo
    echo "STEP 2: the GO-LIVE, which is gated on a verified production upload."
    echo "Confirm you have SERVED the built DashboardPage chunk and SEEN"
    echo "'apps/hygiene' in it. Checking a hash is not this check."
    printf "Type exactly  apps/hygiene  to proceed: "
    read -r answer
    [ "$answer" = "apps/hygiene" ] || refuse "upload gate not confirmed"
    run_file "$GOLIVE"
    echo
    state
    echo
    echo "hygiene is available. HSE now carries its second course."
    echo "LOG THE FIFTH MIGRATION IN MIGRATIONS.md with today's date:"
    echo "    migrations/$GOLIVE.sql"
    echo "All five of this ladder should now be logged there."
    ;;

  *)
    echo "usage: $0 [verify|dryrun|seed|go-live|pin <ref>]"; exit 2 ;;
esac
