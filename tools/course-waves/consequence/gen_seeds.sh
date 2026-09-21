#!/usr/bin/env bash
# =============================================================================
# H4 SEEDS, GENERATED FROM THE COMMITTED TREE AND NEVER FROM A WORKING TREE.
#
# WHY. Every generator in this kit resolves its banks, its manifests, its
# fields.json, its digest and its engine to a path on disk, and a path on disk
# is whatever somebody last saved there. A bank repaired in the wave dir and
# never committed, and a bank committed and never copied back, both produce a
# seed that matches nothing a reviewer can read. H4's three key-truth audits run
# on the banks while this ladder is being written, so the same holds here and
# harder: the answer to "what do the migrations say" has to be a function of the
# COMMITTED TREE at a ref, and of nothing else.
#
# So this script stages the COMMITTED tree first: wave.json, fields.json,
# precision.json, digest.txt, the capstone generator, the three tier headers,
# every manifest.json, all 21 bank JSONs, the vendored engine
# engines/hse/consequence.js and the one tolerance module gradedTolerance.js are
# pulled out of the git object store at REF with `git show` into a throwaway
# directory, and all three generators are pointed at that. The ENGINE the course
# generator runs is the committed one, so the answer key the migrations carry is
# what the committed engine returns.
#
# It then DIFFS what it generated against the five files in the worktree and
# says so either way, because a generator that writes over its own evidence
# proves nothing.
#
# Usage: gen_seeds.sh [ref|WORKTREE] [--write]    default HEAD, compare only
#   REPO=<path>  a clone or worktree of petrolord-nextgen. The default is
#                resolved from THIS SCRIPT'S OWN LOCATION when it is running out
#                of the committed tree, so a fresh clone needs no argument.
#
# THE ONE ESCAPE HATCH, AND WHY IT EXISTS. `gen_seeds.sh WORKTREE` stages the
# same file list out of the WORKING TREE instead of the object store. It is for
# the one window in which this ladder is written: the wave inputs and the
# generators are mirrored into tools/course-waves/consequence and not yet committed,
# so there is no ref that carries them. It proves the five migrations are a
# function of those files and nothing else, which is most of the point, and it
# does NOT prove they are a function of the committed tree. `gen_seeds.sh HEAD`
# with no --write is the check that does, and it is the one to re-run after the
# commit and again after the squash merge. A WORKTREE run says so in its own
# output, so a green line can never be mistaken for the committed-tree one.
# =============================================================================
set -eu

REF=${1:-HEAD}
WRITE=${2:-}
HERE=$(cd "$(dirname "$0")" && pwd)
if [ -d "$HERE/../../../.git" ] || [ -f "$HERE/../../../.git" ]; then
  DEFAULT_REPO=$(cd "$HERE/../../.." && pwd)
else
  DEFAULT_REPO=/root/wt-h4-nextgen
fi
REPO=${REPO:-$DEFAULT_REPO}
KIT=${KIT:-/root/dc-wavekit}
SLUG=consequence
PREFIX=h4
DATE=20261006

show() {  # one committed path, from the object store at REF or from the worktree
  if [ "$REF" = WORKTREE ]; then cat "$REPO/$1"; else git -C "$REPO" show "$REF:$1"; fi
}

STAGE=$(mktemp -d /tmp/h4seed.XXXXXX)
OUTDIR="$STAGE/out"
trap 'rm -rf "$STAGE"' EXIT
mkdir -p "$STAGE/banks" "$OUTDIR" "$STAGE/repo/src/content/courses/$SLUG" "$STAGE/engines/engines/hse" "$STAGE/engines/engines/facilities" "$STAGE/engines/lib/stats"

echo "repo:    $REPO"
echo "staging the committed tree at $REF into $STAGE"

# wave.json, with its repo pointed at the staged content so nothing the
# generators read can resolve back out to a working tree.
show "tools/course-waves/$SLUG/wave.json" \
  | python3 -c "import json,sys; c=json.load(sys.stdin); c['repo']='$STAGE/repo'; json.dump(c, open('$STAGE/wave.json','w'))"

for f in fields.json precision.json digest.txt h4_capstone.mjs discriminate.mjs structure.py hdr_beginner.txt hdr_intermediate.txt hdr_advanced.txt; do
  show "tools/course-waves/$SLUG/$f" > "$STAGE/$f"
done
for p in engines/hse/consequence.js engines/facilities/relief.js engines/facilities/spacing.js lib/stats/stats.js; do
  show "packages/engines/$p" > "$STAGE/engines/$p"
done
show "src/components/course/panels/$SLUG/gradedTolerance.js" > "$STAGE/gradedTolerance.js"
# The engine and the tolerance module are ES modules. In the repository their
# package.json says so; in the stage, this one does, or Node reads them as
# CommonJS and the engine never runs.
echo '{"type": "module"}' > "$STAGE/package.json"

for tier in beginner intermediate advanced; do
  case $tier in beginner) L=b;; intermediate) L=i;; advanced) L=a;; esac
  mkdir -p "$STAGE/repo/src/content/courses/$SLUG/$tier"
  show "src/content/courses/$SLUG/$tier/manifest.json" \
    > "$STAGE/repo/src/content/courses/$SLUG/$tier/manifest.json"
  for part in m01 m02 m03 m04 m05 m06 exam; do
    show "tools/course-banks/$SLUG/$tier/${PREFIX}${L}_${part}.json" \
      > "$STAGE/banks/${PREFIX}${L}_${part}.json"
  done
done
echo "staged: $(ls "$STAGE/banks" | wc -l) banks, 3 manifests, 3 headers, fields.json, precision.json, digest.txt, h4_capstone.mjs, discriminate.mjs, the engine and gradedTolerance.js"
echo

# The three deep seeds, off the staged banks and the staged manifests.
for tier in beginner intermediate advanced; do
  python3 "$KIT/gen_migration.py" "$tier" "$STAGE/hdr_${tier}.txt" \
    "$OUTDIR/${DATE}_${PREFIX}_${SLUG}_${tier}_deep.sql" "$STAGE"
done

# The course and capstone migration, off the staged fields and the STAGED
# ENGINE, which the course generator runs.
export H4_WAVE="$STAGE" H4_ENGINES="$STAGE/engines" H4_TOLERANCE="$STAGE/gradedTolerance.js"
H4_COURSE_OUT="$OUTDIR/${DATE}_${PREFIX}_${SLUG}_course.sql" python3 "$HERE/gen_course.py"

# The go-live, off the same staged inputs and the COURSE MIGRATION THIS RUN
# JUST EMITTED, so the prompts it checks are the prompts it ships.
H4_COURSE_SQL="$OUTDIR/${DATE}_${PREFIX}_${SLUG}_course.sql" \
  H4_GOLIVE_OUT="$OUTDIR/${DATE}_${PREFIX}_${SLUG}_go_live.sql" \
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

echo
if [ "$bad" = 0 ]; then
  if [ "$REF" = WORKTREE ]; then
    echo "AGREE: all five migrations regenerate byte for byte from the WORKING TREE inputs."
    echo "       This is NOT the committed-tree check. Re-run 'gen_seeds.sh HEAD' after the commit."
  else
    echo "AGREE: all five migrations regenerate byte for byte from the committed inputs at $REF."
  fi
else
  echo "DISAGREE: the migrations in the worktree are not what the committed inputs produce."
  [ "$WRITE" = --write ] || exit 2
fi
