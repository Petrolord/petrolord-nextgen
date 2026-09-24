#!/usr/bin/env bash
# SHIP PHASE, NOT YET D4. Carried from D3 (tools/course-waves/facies) at the D4
# foundation with names rewritten only; its D3 content (migration names, dates,
# content pins) is rewritten for D4 at the ship phase. Do not run it for D4 yet.
# =============================================================================
# D3 SEEDS AND CASE FILES, GENERATED FROM THE COMMITTED TREE AND NEVER FROM A
# WORKING TREE. Adapted from tools/course-waves/mlcore/gen_seeds.sh (D2).
#
# This script stages the COMMITTED tree first: wave.json, fields.json,
# precision.json, digest.txt, the capstone generator d4_capstone.mjs, the three
# tier headers, every manifest.json, all 21 bank JSONs, the vendored engine
# closure (engines/dataai/cluster.js, ml.js and the two files they import) and the one
# tolerance module gradedTolerance.js are pulled out of the git object store at
# REF with `git show` into a throwaway directory, and all three generators are
# pointed at that. The ENGINE the course generator runs is the committed one,
# so the answer key the migrations carry is what the committed engine returns.
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
  DEFAULT_REPO=/root/wt-dai-d4-nextgen
fi
REPO=${REPO:-$DEFAULT_REPO}
KIT=${KIT:-/root/dc-wavekit}
SLUG=facies
PREFIX=d3
DATE=20261102

STAGE=$(mktemp -d /tmp/d2seed.XXXXXX)
OUTDIR="$STAGE/out"
trap 'rm -rf "$STAGE"' EXIT
mkdir -p "$STAGE/banks" "$OUTDIR" "$OUTDIR/cases" "$STAGE/repo/src/content/courses/$SLUG" "$STAGE/engines/engines/dataai" "$STAGE/engines/lib/stats" "$STAGE/engines/lib/lp"

echo "repo:    $REPO"
echo "staging the committed tree at $REF into $STAGE"

# wave.json, with its repo pointed at the staged content so nothing the
# generators read can resolve back out to a working tree.
git -C "$REPO" show "$REF:tools/course-waves/$SLUG/wave.json" \
  | python3 -c "import json,sys; c=json.load(sys.stdin); c['repo']='$STAGE/repo'; json.dump(c, open('$STAGE/wave.json','w'))"

for f in fields.json precision.json digest.txt d4_capstone.mjs hdr_beginner.txt hdr_intermediate.txt hdr_advanced.txt; do
  git -C "$REPO" show "$REF:tools/course-waves/$SLUG/$f" > "$STAGE/$f"
done
for e in engines/dataai/cluster.js engines/dataai/ml.js lib/stats/stats.js lib/lp/simplex.js; do
  git -C "$REPO" show "$REF:packages/engines/$e" > "$STAGE/engines/$e"
done
git -C "$REPO" show "$REF:src/components/course/panels/$SLUG/gradedTolerance.js" > "$STAGE/gradedTolerance.js"
# The engine and the tolerance module are ES modules. In the repository their
# package.json says so; in the stage, this one does, or Node reads them as
# CommonJS and the engine never runs.
echo '{"type": "module"}' > "$STAGE/package.json"

for tier in beginner intermediate advanced; do
  case $tier in beginner) L=b;; intermediate) L=i;; advanced) L=a;; esac
  mkdir -p "$STAGE/repo/src/content/courses/$SLUG/$tier"
  git -C "$REPO" show "$REF:src/content/courses/$SLUG/$tier/manifest.json" \
    > "$STAGE/repo/src/content/courses/$SLUG/$tier/manifest.json"
  for part in m01 m02 m03 m04 m05 m06 exam; do
    git -C "$REPO" show "$REF:tools/course-banks/$SLUG/$tier/${PREFIX}${L}_${part}.json" \
      > "$STAGE/banks/${PREFIX}${L}_${part}.json"
  done
done
echo "staged: $(ls "$STAGE/banks" | wc -l) banks, 3 manifests, 3 headers, fields.json, precision.json, digest.txt, d4_capstone.mjs, the engine closure and gradedTolerance.js"
echo

# The three deep seeds, off the staged banks and the staged manifests.
for tier in beginner intermediate advanced; do
  python3 "$KIT/gen_migration.py" "$tier" "$STAGE/hdr_${tier}.txt" \
    "$OUTDIR/${DATE}_${PREFIX}_${SLUG}_${tier}_deep.sql" "$STAGE"
done

# The course and capstone migration, off the staged fields and the STAGED
# ENGINE, which the course generator runs.
export D4_WAVE="$STAGE" D4_ENGINES="$STAGE/engines" D4_TOLERANCE="$STAGE/gradedTolerance.js"
D4_COURSE_OUT="$OUTDIR/${DATE}_${PREFIX}_${SLUG}_course.sql" D4_CASES_OUT="$OUTDIR/cases" python3 "$HERE/gen_course.py"

# The go-live, off the same staged inputs and the COURSE MIGRATION THIS RUN
# JUST EMITTED, so the prompts it checks are the prompts it ships.
D4_COURSE_SQL="$OUTDIR/${DATE}_${PREFIX}_${SLUG}_course.sql" \
  D4_GOLIVE_OUT="$OUTDIR/${DATE}_${PREFIX}_${SLUG}_go_live.sql" \
  python3 "$HERE/gen_golive.py" | head -5
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
  echo "AGREE: all five migrations and the four case-file outputs regenerate byte for byte from the committed inputs at $REF."
else
  echo "DISAGREE: the migrations in the worktree are not what the committed inputs produce."
  [ "$WRITE" = --write ] || exit 2
fi
