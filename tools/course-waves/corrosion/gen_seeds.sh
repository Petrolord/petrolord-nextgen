#!/usr/bin/env bash
# =============================================================================
# FC9 SEEDS, GENERATED FROM THE COMMITTED TREE AND NEVER FROM A WORKING TREE.
#
# WHY. Every generator in this kit resolves its banks, its manifests, its
# fields.json and its digest to a directory on disk, and a directory on disk is
# whatever somebody last saved there. A bank repaired in the wave dir and never
# committed, and a bank committed and never copied back, both produce a seed
# that matches nothing a reviewer can read. FC9 ran three tier audits that made
# their repairs IN THE REPOSITORY, so the working tree is exactly the copy that
# can be behind. FC9's three audits repaired its banks, lessons and digest in
# both places, so the same holds here.
#
# So this script stages the COMMITTED tree first: wave.json, fields.json,
# precision.json, digest.txt, every manifest.json and all 21 bank JSONs are
# pulled out of the git object store at REF with `git show` into a throwaway
# directory, and all three generators are pointed at that. Nothing they read can
# have been edited after the commit it is named for. This is the working-tree
# hole in the shared kit generator, closed.
#
# It then DIFFS what it generated against the five files in the worktree and
# says so either way, because a generator that writes over its own evidence
# proves nothing.
#
# Usage: gen_seeds.sh [ref] [--write]    default HEAD, compare only
#   REPO=<path>  a clone or worktree of petrolord-nextgen. The default is
#                resolved from THIS SCRIPT'S OWN LOCATION when it is running out
#                of the committed tree, so a fresh clone needs no argument.
# =============================================================================
set -eu

REF=${1:-HEAD}
WRITE=${2:-}
HERE=$(cd "$(dirname "$0")" && pwd)
if [ -d "$HERE/../../../.git" ] || [ -f "$HERE/../../../.git" ]; then
  DEFAULT_REPO=$(cd "$HERE/../../.." && pwd)
else
  DEFAULT_REPO=/root/wt-fc9-nextgen
fi
REPO=${REPO:-$DEFAULT_REPO}
KIT=${KIT:-/root/dc-wavekit}
SLUG=corrosion
PREFIX=fc9
DATE=20260925

STAGE=$(mktemp -d /tmp/fc9seed.XXXXXX)
OUTDIR="$STAGE/out"
trap 'rm -rf "$STAGE"' EXIT
mkdir -p "$STAGE/banks" "$OUTDIR" "$STAGE/repo/src/content/courses/$SLUG"

echo "repo:    $REPO"
echo "staging the committed tree at $REF into $STAGE"

# wave.json, with its repo pointed at the staged content so nothing the
# generators read can resolve back out to a working tree.
git -C "$REPO" show "$REF:tools/course-waves/$SLUG/wave.json" \
  | python3 -c "import json,sys; c=json.load(sys.stdin); c['repo']='$STAGE/repo'; json.dump(c, open('$STAGE/wave.json','w'))"

for f in fields.json precision.json digest.txt fc9_capstone.mjs hdr_beginner.txt hdr_intermediate.txt hdr_advanced.txt; do
  git -C "$REPO" show "$REF:tools/course-waves/$SLUG/$f" > "$STAGE/$f"
done

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
echo "staged: $(ls "$STAGE/banks" | wc -l) banks, 3 manifests, 3 headers, fields.json, precision.json, digest.txt, fc9_capstone.mjs"
echo

# The three deep seeds, off the staged banks and the staged manifests.
for tier in beginner intermediate advanced; do
  python3 "$KIT/gen_migration.py" "$tier" "$STAGE/hdr_${tier}.txt" \
    "$OUTDIR/${DATE}_${PREFIX}_${SLUG}_${tier}_deep.sql" "$STAGE"
done

# The course and capstone migration, off the staged fields, precision and digest.
FC9_WAVE="$STAGE" FC9_COURSE_OUT="$OUTDIR/${DATE}_${PREFIX}_${SLUG}_course.sql" \
  python3 "$HERE/gen_course.py"

# The go-live, off the staged fields and digest and the COURSE MIGRATION THIS RUN
# JUST EMITTED, so the prompts it sweeps for collisions are the prompts it ships.
FC9_WAVE="$STAGE" \
  FC9_COURSE_SQL="$OUTDIR/${DATE}_${PREFIX}_${SLUG}_course.sql" \
  FC9_GOLIVE_OUT="$OUTDIR/${DATE}_${PREFIX}_${SLUG}_go_live.sql" \
  python3 "$HERE/gen_golive.py"
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

echo
if [ "$bad" = 0 ]; then
  echo "AGREE: all five migrations regenerate byte for byte from the committed inputs at $REF."
else
  echo "DISAGREE: the migrations in the worktree are not what the committed inputs produce."
  [ "$WRITE" = --write ] || exit 2
fi
