#!/usr/bin/env bash
# =============================================================================
# EC8 SEEDS AND CASE FILES, GENERATED FROM THE COMMITTED TREE AND NEVER FROM A
# WORKING TREE. Adapted from tools/course-waves/pia/gen_seeds.sh (EC7).
#
# This script exports the COMMITTED tree at REF with `git archive` into a
# throwaway directory: the wave mirror tools/course-waves/gsa (the
# generators, fields.json, precision.json, digest.txt, the capstone generator,
# the three tier headers, the oracle check and the discriminate sweep), the 21
# bank JSONs under tools/course-banks/gsa, the three manifests, the
# tolerance module gradedTolerance.js and the whole of packages/engines (the
# vendored gasContract.js with the cashflow.ts it imports, and
# the vendored stdlib oracle), and the root package.json, whose "type":
# "module" makes Node read gradedTolerance.js as the ES module it is. Every generator is then run from that export,
# pointed at that export. The ENGINE the course generator runs is the committed
# one, so the answer key the migrations carry is what the committed engine
# returns.
#
# It then DIFFS what it generated (the five migrations AND the three case files
# with their index) against the worktree and says so either way.
#
# Usage: gen_seeds.sh [ref] [--write]    default HEAD, compare only
# =============================================================================
set -eu

REF=${1:-HEAD}
WRITE=${2:-}
HERE=$(cd "$(dirname "$0")" && pwd)
if [ -d "$HERE/../../../.git" ] || [ -f "$HERE/../../../.git" ]; then
  DEFAULT_REPO=$(cd "$HERE/../../.." && pwd)
else
  DEFAULT_REPO=/root/wt-ec8-nextgen
fi
REPO=${REPO:-$DEFAULT_REPO}
KIT=${KIT:-/root/dc-wavekit}
SLUG=gsa
PREFIX=ec8
DATE=20261109

STAGE=$(mktemp -d /tmp/ec8seed.XXXXXX)
OUTDIR="$STAGE/out"
trap 'rm -rf "$STAGE"' EXIT
mkdir -p "$STAGE/repo" "$OUTDIR/cases"

echo "repo:    $REPO"
echo "exporting the committed tree at $REF into $STAGE"
git -C "$REPO" archive "$REF" \
  "tools/course-waves/$SLUG" "tools/course-banks/$SLUG" "src/content/courses/$SLUG" \
  "src/components/course/panels/$SLUG/gradedTolerance.js" packages/engines package.json \
  | tar -x -C "$STAGE/repo"
W="$STAGE/repo/tools/course-waves/$SLUG"
# wave.json, with its repo pointed at the export so nothing the generators read
# can resolve back out to a working tree.
python3 -c "import json; p='$W/wave.json'; c=json.load(open(p)); c['repo']='$STAGE/repo'; json.dump(c, open(p,'w'))"
# esbuild, which ts_loader.mjs uses to strip the types from cashflow.ts, is a
# build tool and no course input: it is borrowed from the repository's
# installed node_modules by a symlink, never copied into the export.
ln -s "$REPO/node_modules" "$STAGE/repo/node_modules"
mkdir -p "$W/banks"
for tier in beginner intermediate advanced; do
  cp "$STAGE/repo/tools/course-banks/$SLUG/$tier/"*.json "$W/banks/"
done
echo "exported: $(ls "$W/banks"/*.json | wc -l) bank JSONs, 3 manifests, the wave mirror, gradedTolerance.js and packages/engines"
echo

# The three deep seeds, off the exported banks and the exported manifests.
for tier in beginner intermediate advanced; do
  python3 "$KIT/gen_migration.py" "$tier" "$W/hdr_${tier}.txt" \
    "$OUTDIR/${DATE}_${PREFIX}_${SLUG}_${tier}_deep.sql" "$W"
done

# The course and capstone migration and the case files, off the exported
# fields and the EXPORTED ENGINE, which the course generator runs.
export EC8_WAVE="$W" EC8_WAVE_DIR="$W" EC8_REPO="$STAGE/repo" EC8_ENGINES="$STAGE/repo/packages/engines" \
       EC8_TOLERANCE="$STAGE/repo/src/components/course/panels/$SLUG/gradedTolerance.js"
( cd "$W" && EC8_COURSE_OUT="$OUTDIR/${DATE}_${PREFIX}_${SLUG}_course.sql" EC8_CASES_OUT="$OUTDIR/cases" \
    python3 "$W/gen_course.py" --cases --migration | tail -1 )

# The go-live, off the same exported inputs and the COURSE MIGRATION THIS RUN
# JUST EMITTED, so the prompts it checks are the prompts it ships.
( cd "$W" && EC8_COURSE_SQL="$OUTDIR/${DATE}_${PREFIX}_${SLUG}_course.sql" \
    EC8_GOLIVE_OUT="$OUTDIR/${DATE}_${PREFIX}_${SLUG}_go_live.sql" \
    python3 "$W/gen_golive.py" | head -5 )
[ -s "$OUTDIR/${DATE}_${PREFIX}_${SLUG}_go_live.sql" ] || { echo "REFUSED: the go-live generator wrote nothing"; exit 2; }
echo

# ------------------------------------------------------------- the comparison
bad=0
for f in course beginner_deep intermediate_deep advanced_deep go_live; do
  gen="$OUTDIR/${DATE}_${PREFIX}_${SLUG}_${f}.sql"
  live="$REPO/migrations/${DATE}_${PREFIX}_${SLUG}_${f}.sql"
  if [ ! -f "$live" ]; then
    printf '  ABSENT     %-28s the worktree has no such file\n' "$f"; bad=1
    [ "$WRITE" = --write ] && cp "$gen" "$live" && echo "      (written from the committed inputs)"
    continue
  fi
  if cmp -s "$gen" "$live"; then
    printf '  identical  %-28s %s  (%s bytes)\n' "$f" "$(sha256sum "$gen" | cut -c1-12)" "$(wc -c < "$gen")"
  else
    printf '  DIFFERS    %-28s\n' "$f"
    diff "$live" "$gen" | head -20 | sed 's/^/      /'
    bad=1
    [ "$WRITE" = --write ] && cp "$gen" "$live" && echo "      (rewritten from the committed inputs)"
  fi
done

for g in "$OUTDIR/cases"/*; do
  fn=$(basename "$g"); live="$REPO/src/content/capstone-cases/$SLUG/$fn"
  if [ -f "$live" ] && cmp -s "$g" "$live"; then
    printf '  identical  %-28s %s\n' "case $fn" "$(sha256sum "$g" | cut -c1-12)"
  else
    printf '  DIFFERS    %-28s\n' "case $fn"; bad=1
    [ "$WRITE" = --write ] && mkdir -p "$(dirname "$live")" && cp "$g" "$live" && echo "      (rewritten from the committed inputs)"
  fi
done

echo
if [ "$bad" = 0 ]; then
  echo "AGREE: all five migrations and the three case files and their index regenerate byte for byte from the committed inputs at $REF."
else
  echo "DISAGREE: the migrations in the worktree are not what the committed inputs produce."
  [ "$WRITE" = --write ] || exit 2
fi
