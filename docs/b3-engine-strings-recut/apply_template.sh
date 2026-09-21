#!/usr/bin/env bash
# =============================================================================
# B3 RECUT of the LIVE course @SLUG@ (@NAME@), content-addressed.
#
# Engines #232 (petrolord-engines e972ae7) recast engine sentences the LIVE
# @SLUG@ question bank quoted verbatim. These TEXT-ONLY migrations bring the
# quoted rows to the engine's words, keyed by stable question identity; no
# answer index, option order, ord or row count moves. The lessons ship with the
# NextGen upload, not with this database.
#
# This script never reads a working tree. It resolves each file out of the git
# OBJECT STORE at a ref (origin/main by default) and REFUSES unless every
# file's sha256 matches the digest pinned below. A squash merge keeps file
# CONTENT, so re-run `verify` against origin/main AFTER the merge.
#
# THE MODES.
#   verify    content check only, no database.
#   control   the NEGATIVE CONTROL: verify with one byte of the first file
#             flipped after it is fetched. It must REFUSE (exit 2), or the
#             content check could not have caught a stale file.
#   dry-run   every file inside ONE transaction that ends in ROLLBACK, against
#             the linked production project. Each migration prints how many rows
#             it updated; a row matching neither its published nor its recut
#             text raises, so this IS the comparison with the live rows.
#   apply     the same files inside one transaction that COMMITS.
#   pin <ref> reprint the digest table. Never hand-edit a digest to make a run pass.
#
# ORDER. The files touch disjoint tiers; any order works, and each is safe to
# re-run (a second run updates nothing). Log each APPLIED file in MIGRATIONS.md.
#
#   REPO=<path>  a clone or worktree of petrolord-nextgen (default: the one this
#                script is committed in).
#   REF=<ref>    default origin/main.
#   LINKED=<dir> the checkout linked to the NextGen Supabase project.
#
# EXIT CODES. 0 did the thing. 2 REFUSED.
# =============================================================================
set -u

REF=${REF:-origin/main}
LINKED=${LINKED:-/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen}

FILES="
@FILES@
"
digest_for() {
  case $1 in
@DIGESTS@
    *) echo UNPINNED ;;
  esac
}

RUN=$(mktemp -d /tmp/b3recut.XXXXXX)
HERE=$(cd "$(dirname "$0")" && pwd)

refuse() { echo; echo "REFUSED: $*"; echo "Nothing was applied."; exit 2; }

find_repo() {
  if [ -n "${REPO:-}" ]; then echo "$REPO"; return; fi
  up=$(cd "$HERE/../../.." 2>/dev/null && pwd)
  if [ -n "$up" ] && { [ -d "$up/.git" ] || [ -f "$up/.git" ]; }; then echo "$up"; return; fi
  echo /opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen
}

resolve() {
  REPO_DIR=$(find_repo)
  git -C "$REPO_DIR" rev-parse --git-dir >/dev/null 2>&1 || refuse "$REPO_DIR is not a git repository; set REPO=<path>"
  echo "repo:    $REPO_DIR"
  echo "ref:     $REF"
  git -C "$REPO_DIR" fetch --quiet origin 2>/dev/null || echo "  (fetch failed, using the objects already present)"
  REF_SHA=$(git -C "$REPO_DIR" rev-parse --verify --quiet "$REF^{commit}") || refuse "$REF does not resolve to a commit"
  echo "commit:  $REF_SHA"
  echo
  bad=0; first=1
  for f in $FILES; do
    [ -n "$f" ] || continue
    want=$(digest_for "$f")
    [ "$want" != UNPINNED ] || refuse "$f has no pinned digest"
    if ! git -C "$REPO_DIR" show "$REF_SHA:migrations/$f.sql" > "$RUN/$f.sql" 2>/dev/null; then
      echo "  MISSING   $f.sql is not in $REF"; bad=1; continue
    fi
    if [ "${CONTROL:-0}" = 1 ] && [ $first = 1 ]; then
      printf 'X' | dd of="$RUN/$f.sql" bs=1 seek=10 conv=notrunc 2>/dev/null
      echo "  (control: one byte of $f.sql flipped after the fetch)"
    fi
    first=0
    got=$(sha256sum "$RUN/$f.sql" | cut -d' ' -f1)
    if [ "$got" = "$want" ]; then
      printf "  ok        %-44s %s\n" "$f" "${got:0:12}"
    else
      printf "  STALE     %-44s\n              expected %s\n              found    %s\n" "$f" "$want" "$got"; bad=1
    fi
  done
  [ "$bad" = 0 ] || refuse "the SQL at $REF is not the content this recut was pinned to.
  Either $REF does not yet carry the B3 recut PR, or a later change moved a file.
  If a later PR legitimately moved it, re-pin with:  $0 pin $REF"
  echo
  echo "Every file matches the pinned content. $RUN holds the verified SQL."
}

run_all() {
  end=$1
  { echo "begin;"; for f in $FILES; do [ -n "$f" ] && { cat "$RUN/$f.sql"; echo; }; done; echo "$end;"; } > "$RUN/all.sql"
  OUT=$(cd "$LINKED" && supabase db query --linked -f "$RUN/all.sql" 2>&1); RC=$?
  echo "$OUT" | grep -E 'NOTICE|B3 recut' | sed 's/^/  /'
  if [ $RC -ne 0 ] || grep -q 'ERROR' <<<"$OUT"; then
    echo "FAILED (rc $RC):"; grep -E 'ERROR|refused' <<<"$OUT" | head -5
    echo "The transaction rolled back. Nothing was applied."
    exit 2
  fi
}

case "${1:-verify}" in
  verify) resolve; echo; echo "VERIFY ONLY. No database was touched." ;;
  control)
    OUT=$(CONTROL=1 "$0" verify 2>&1); RC=$?
    echo "$OUT" | grep -E 'control|STALE|REFUSED' | sed 's/^/  /'
    if [ $RC = 2 ]; then echo "NEGATIVE CONTROL: PASS (a one-byte change is refused)"; exit 0; fi
    echo "NEGATIVE CONTROL: FAIL (a flipped byte was not refused, rc $RC)"; exit 1 ;;
  dry-run)
    resolve; echo; echo "DRY RUN: one transaction, ROLLED BACK."
    run_all rollback
    echo; echo "Dry run complete; nothing was committed. Each file's NOTICE above says how many rows it would update." ;;
  apply)
    resolve; echo; echo "APPLY: one transaction, COMMITTED."
    run_all commit
    echo; echo "Applied. LOG EACH FILE IN MIGRATIONS.md with today's date:"
    for f in $FILES; do [ -n "$f" ] && echo "    migrations/$f.sql"; done
    echo "Re-running apply is safe: every file then reports 0 rows updated." ;;
  pin)
    [ $# -ge 2 ] || { echo "usage: $0 pin <ref>"; exit 2; }
    R=$(find_repo)
    echo "Digest table at $2 (paste into digest_for):"
    for f in $FILES; do
      [ -n "$f" ] || continue
      git -C "$R" show "$2:migrations/$f.sql" 2>/dev/null | sha256sum | awk -v n="$f" '{printf "    %-40s) echo %s ;;\n", n, $1}'
    done ;;
  *) echo "usage: $0 [verify|control|dry-run|apply|pin <ref>]"; exit 2 ;;
esac
