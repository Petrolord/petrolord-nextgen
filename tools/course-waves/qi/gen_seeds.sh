#!/usr/bin/env bash
# =============================================================================
# QI SEEDS, GENERATED FROM THE COMMITTED TREE AND NEVER FROM A WORKING TREE.
# Adapted from SC4 marine's gen_seeds.sh.
#
# Exports the COMMITTED tree at REF with `git archive` into a throwaway
# directory: the wave mirror tools/course-waves/qi (generators, fields.json,
# precision.json, digest.txt, ship_names.json, the capstone generators, the
# tier headers, the oracle check and the discriminate sweep), the bank JSONs
# under tools/course-banks/qi, the three manifests, the teaching lab and its
# pack (src/components/course/panels/qi), the capstone case files, the whole of
# packages/engines and the root package.json. Every generator then runs from
# that export, pointed at that export, so the answer key the migrations carry
# is what the COMMITTED engines return on the COMMITTED case files.
#
# WHAT IT WRITES depends on what is committed:
#   course            always (the catalogue row and the Associate capstone)
#   <tier>_deep       for every tier whose seven bank JSONs are committed
#   <tier>_capstone   for the Professional and Expert tiers once their six
#                     fields are declared in gradedTolerance.js (stamped names)
#   go_live           always; it refuses at run time while any tier lacks its
#                     capstone, structure or questions
# It then DIFFS each generated file against the worktree and says so.
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
  DEFAULT_REPO=/root/wt-qi-nextgen
fi
REPO=${REPO:-$DEFAULT_REPO}
KIT=${KIT:-/root/dc-wavekit}
SLUG=qi

STAGE=$(mktemp -d /tmp/qiseed.XXXXXX)
OUTDIR="$STAGE/out"
trap 'rm -rf "$STAGE"' EXIT
mkdir -p "$STAGE/repo" "$OUTDIR"

echo "repo:    $REPO"
echo "exporting the committed tree at $REF into $STAGE"
git -C "$REPO" archive "$REF" \
  "tools/course-waves/$SLUG" "src/content/courses/$SLUG" "src/components/course/panels/$SLUG" \
  "src/content/capstone-cases/$SLUG" packages/engines package.json \
  | tar -x -C "$STAGE/repo"
if git -C "$REPO" cat-file -e "$REF:tools/course-banks/$SLUG" 2>/dev/null; then
  git -C "$REPO" archive "$REF" "tools/course-banks/$SLUG" | tar -x -C "$STAGE/repo"
fi
W="$STAGE/repo/tools/course-waves/$SLUG"
python3 -c "import json; p='$W/wave.json'; c=json.load(open(p)); c['repo']='$STAGE/repo'; json.dump(c, open(p,'w'))"
ln -s "$REPO/node_modules" "$STAGE/repo/node_modules"
NAME() { python3 -c "import json,sys; v=json.load(open('$W/ship_names.json'))[sys.argv[1]]; print(v or '')" "$1"; }

export QI_WAVE="$W" QI_WAVE_DIR="$W" QI_REPO="$STAGE/repo" QI_ENGINES="$STAGE/repo/packages/engines" \
       QI_TOLERANCE="$STAGE/repo/src/components/course/panels/$SLUG/gradedTolerance.js" \
       QI_CASES="$STAGE/repo/src/content/capstone-cases/$SLUG" QI_COURSE_OUT="$OUTDIR"

# The deep seeds, off the exported banks and manifests, for every tier whose
# seven banks are committed.
mkdir -p "$W/banks"
GEN=""
for tier in beginner intermediate advanced; do
  L=$(case $tier in beginner) echo b;; intermediate) echo i;; advanced) echo a;; esac)
  have=$(ls "$STAGE/repo/tools/course-banks/$SLUG/$tier/qi${L}_"*.json 2>/dev/null | wc -l || true)
  if [ "$have" = 7 ]; then
    cp "$STAGE/repo/tools/course-banks/$SLUG/$tier/"*.json "$W/banks/"
    python3 "$KIT/gen_migration.py" "$tier" "$W/hdr_${tier}.txt" "$OUTDIR/$(NAME ${tier}_deep).sql" "$W" | sed 's/^/  /'
    GEN="$GEN ${tier}_deep"
  else
    echo "  PENDING   ${tier}_deep: $have of 7 bank JSONs committed"
  fi
done

# The course migration and any later capstone migration, off the exported
# fields, case files and ENGINES.
( cd "$W" && python3 "$W/gen_course.py" --migration | sed 's/^/  /' )
GEN="$GEN course"
for t in intermediate advanced; do [ -n "$(NAME ${t}_capstone)" ] && [ -f "$OUTDIR/$(NAME ${t}_capstone).sql" ] && GEN="$GEN ${t}_capstone"; done

# The go-live, off the course migration this run just emitted.
( cd "$W" && QI_COURSE_SQL="$OUTDIR/$(NAME course).sql" QI_GOLIVE_OUT="$OUTDIR/$(NAME go_live).sql" \
    python3 "$W/gen_golive.py" | sed 's/^/  /' )
[ -s "$OUTDIR/$(NAME go_live).sql" ] || { echo "REFUSED: the go-live generator wrote nothing"; exit 2; }
GEN="$GEN go_live"
echo

bad=0
for f in $GEN; do
  n=$(NAME "$f")
  gen="$OUTDIR/$n.sql"; live="$REPO/migrations/$n.sql"
  if [ ! -f "$live" ]; then
    printf '  ABSENT     %-40s the worktree has no such file\n' "$n"; bad=1
    [ "$WRITE" = --write ] && cp "$gen" "$live" && echo "      (written from the committed inputs)"
    continue
  fi
  if cmp -s "$gen" "$live"; then
    printf '  identical  %-40s %s  (%s bytes)\n' "$n" "$(sha256sum "$gen" | cut -c1-12)" "$(wc -c < "$gen")"
  else
    printf '  DIFFERS    %-40s\n' "$n"
    diff "$live" "$gen" | head -12 | sed 's/^/      /'
    bad=1
    [ "$WRITE" = --write ] && cp "$gen" "$live" && echo "      (rewritten from the committed inputs)"
  fi
done
echo
if [ "$bad" = 0 ]; then
  echo "AGREE: every QI migration the committed inputs produce ($GEN ) regenerates byte for byte at $REF."
else
  echo "DISAGREE: the migrations in the worktree are not what the committed inputs produce."
  [ "$WRITE" = --write ] || exit 2
fi
