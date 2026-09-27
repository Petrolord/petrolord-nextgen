#!/usr/bin/env bash
# =============================================================================
# SC5 SEEDS, GENERATED FROM THE COMMITTED TREE AND NEVER FROM A WORKING TREE.
# Adapted from tools/course-waves/prms/gen_seeds.sh (EC11) for the first
# practice course: no engine, no fields, no case files.
#
# This script exports the COMMITTED tree at REF with `git archive` into a
# throwaway directory: the wave mirror tools/course-waves/contracts (wave.json,
# gen_course.py, gen_golive.py, packlib.py and the three tier headers), the 21
# bank JSONs under tools/course-banks/contracts, the three manifests, and
# migrations/ (gen_course.py checks the platform migration and path_order 79
# there). Every generator is then run from that export, pointed at that export.
# The platform migration 20261116_sc5_contracts_platform_course_types.sql is
# hand written (reviewed SQL, not generated) and is not regenerated here.
#
# It then DIFFS the four generated migrations (the course seed, the three deep
# seeds) and the go-live against the worktree and says so either way, and
# refuses any of the six that carries a transaction line of its own.
#
# Usage: gen_seeds.sh [ref] [--write]    default HEAD, compare only
#        gen_seeds.sh WORKTREE --write   the ship phase's first write, before
#                                        the bank JSONs are committed
# =============================================================================
set -eu

REF=${1:-HEAD}
WRITE=${2:-}
HERE=$(cd "$(dirname "$0")" && pwd)
if [ -d "$HERE/../../../.git" ] || [ -f "$HERE/../../../.git" ]; then
  DEFAULT_REPO=$(cd "$HERE/../../.." && pwd)
else
  DEFAULT_REPO=/root/wt-sc5-nextgen
fi
REPO=${REPO:-$DEFAULT_REPO}
KIT=${KIT:-/root/dc-wavekit}
SLUG=contracts
PREFIX=sc5
DATE=20261116

STAGE=$(mktemp -d /tmp/sc5seed.XXXXXX)
OUTDIR="$STAGE/out"
trap 'rm -rf "$STAGE"' EXIT
mkdir -p "$STAGE/repo" "$OUTDIR"

echo "repo:    $REPO"
PATHS="tools/course-waves/$SLUG tools/course-banks/$SLUG src/content/courses/$SLUG migrations"
if [ "$REF" = WORKTREE ]; then
  echo "copying the WORKING TREE (ship phase only; the committed run must agree afterwards)"
  for p in $PATHS; do mkdir -p "$STAGE/repo/$(dirname "$p")"; cp -a "$REPO/$p" "$STAGE/repo/$p"; done
else
  echo "exporting the committed tree at $REF into $STAGE"
  git -C "$REPO" archive "$REF" $PATHS | tar -x -C "$STAGE/repo"
fi
W="$STAGE/repo/tools/course-waves/$SLUG"
python3 -c "import json; p='$W/wave.json'; c=json.load(open(p)); c['repo']='$STAGE/repo'; c['prefix']='$PREFIX'; json.dump(c, open(p,'w'))"
rm -rf "$W/banks"; mkdir -p "$W/banks"
for tier in beginner intermediate advanced; do
  cp "$STAGE/repo/tools/course-banks/$SLUG/$tier/"*.json "$W/banks/"
done
echo "exported: $(ls "$W/banks"/*.json | wc -l) bank JSONs, 3 manifests, the wave mirror, migrations/"
[ "$(ls "$W/banks"/*.json | wc -l)" = 21 ] || { echo "REFUSED: 21 bank JSONs expected"; exit 2; }
echo

for tier in beginner intermediate advanced; do
  python3 "$KIT/gen_migration.py" "$tier" "$W/hdr_${tier}.txt" \
    "$OUTDIR/${DATE}_${PREFIX}_${SLUG}_${tier}_deep.sql" "$W"
done
( cd "$W" && SC5_WAVE_DIR="$W" SC5_REPO="$STAGE/repo" SC5_STAGE=final \
    SC5_COURSE_OUT="$OUTDIR/${DATE}_${PREFIX}_${SLUG}_course.sql" python3 "$W/gen_course.py" --write | tail -2 )
( cd "$W" && SC5_WAVE_DIR="$W" SC5_REPO="$STAGE/repo" \
    SC5_GOLIVE_OUT="$OUTDIR/${DATE}_${PREFIX}_${SLUG}_go_live.sql" python3 "$W/gen_golive.py" )
cp "$STAGE/repo/migrations/${DATE}_${PREFIX}_${SLUG}_platform_course_types.sql" "$OUTDIR/"
echo

# ------------------------------------------------ no transaction lines, anywhere
txlines() {  # the file's transaction lines, outside dollar-quoted bodies and comments
  perl -0pe 's/\$\$.*?\$\$//gs; s/--[^\n]*//g' "$1" | grep -niE '^[[:space:]]*(begin|start[[:space:]]+transaction|commit|rollback|end|abort)[[:space:]]*(transaction|work)?[[:space:]]*;'
}
bad=0
for f in platform_course_types course beginner_deep intermediate_deep advanced_deep go_live; do
  g="$OUTDIR/${DATE}_${PREFIX}_${SLUG}_${f}.sql"
  if txlines "$g" >/dev/null; then echo "  TRANSACTION LINE in $f:"; txlines "$g"; bad=1; fi
done
[ "$bad" = 0 ] && echo "  no transaction line of its own in any of the six files (begin, start transaction, commit, rollback, end or abort as a statement, outside dollar-quoted bodies)" || exit 2

# ------------------------------------------------------------- the comparison
for f in course beginner_deep intermediate_deep advanced_deep go_live; do
  gen="$OUTDIR/${DATE}_${PREFIX}_${SLUG}_${f}.sql"
  live="$REPO/migrations/${DATE}_${PREFIX}_${SLUG}_${f}.sql"
  if [ ! -f "$live" ]; then
    printf '  ABSENT     %-28s the worktree has no such file\n' "$f"; bad=1
    [ "$WRITE" = --write ] && cp "$gen" "$live" && echo "      (written from the $REF inputs)"
    continue
  fi
  if cmp -s "$gen" "$live"; then
    printf '  identical  %-28s %s  (%s bytes)\n' "$f" "$(sha256sum "$gen" | cut -c1-12)" "$(wc -c < "$gen")"
  else
    printf '  DIFFERS    %-28s\n' "$f"
    diff "$live" "$gen" | head -20 | cut -c1-200 | sed 's/^/      /'
    bad=1
    [ "$WRITE" = --write ] && cp "$gen" "$live" && echo "      (rewritten from the $REF inputs)"
  fi
done
echo
if [ "$bad" = 0 ]; then
  echo "AGREE: the course seed, the three deep seeds and the go-live regenerate byte for byte from the inputs at $REF."
else
  echo "DISAGREE: the migrations in the worktree are not what the inputs at $REF produce."
  [ "$WRITE" = --write ] || exit 2
fi
