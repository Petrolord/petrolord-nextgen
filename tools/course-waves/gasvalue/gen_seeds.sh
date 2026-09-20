#!/usr/bin/env bash
# =============================================================================
# gasvalue SEEDS, GENERATED FROM THE COMMITTED TREE AND NEVER FROM A WORKING TREE.
#
# WHY. Every generator in this kit resolves its banks, its manifests, its
# fields.json and its digest to a directory on disk, and a directory on disk is
# whatever somebody last saved there. A bank repaired in the wave dir and never
# committed, and a bank committed and never copied back, both produce a seed
# that matches nothing a reviewer can read. This wave ran three tier key-truth
# audits that made their repairs IN THE REPOSITORY (the AUDIT-*.md records in
# the wave dir), so the working tree is exactly the copy that can be behind.
# (FC1's first apply read a stale worktree and would have seeded the
# unrepaired questions; this is that hole, closed.)
#
# So this script stages the COMMITTED tree first: wave.json, fields.json,
# precision.json, capstone.json, digest.txt, the capstone records and generator,
# the fake clock, the prompt-leak gate (gen_course.py imports its intermediates
# and its sweep), the oracle cross-check and the discriminate sweep (the go-live
# writes the oracle's answers and the closest wrong routes in by value from
# these two), every manifest.json, all 21 bank JSONs AND the vendored engines
# (engines/ and lib/ whole, because lpgCng.js reaches production/gasProperties.js
# and facilities/compression.js and modularRefinery.js reaches
# economics/screening.js) with the downstream Python oracles are pulled out of
# the git object store at REF into a throwaway directory, and all three
# generators are pointed at that. discriminate.mjs also calls the PRE-MD4-0
# engines, petrolord-engines 13f0936, to model the defects MD4-0 repaired; they
# are not vendored in this repository, so they are pulled out of the ENGINES
# repository's object store at that commit (git archive, content-addressed by
# the commit, so nothing on disk can stand in for them). Nothing the generators
# read can have been edited after the commit it is named for, and every engine
# and oracle run gen_course.py and gen_golive.py make is a run of the COMMITTED
# engines and oracles.
#
# It then DIFFS what it generated against the five files in the worktree and
# says so either way, because a generator that writes over its own evidence
# proves nothing.
#
# Usage: gen_seeds.sh [ref] [--write]    default HEAD, compare only
#   REPO=<path>  a clone or worktree of petrolord-nextgen. The default is
#                resolved from THIS SCRIPT'S OWN LOCATION when it is running out
#                of the committed tree, so a fresh clone needs no argument.
#   ENGINES_REPO=<path>  a clone of petrolord-engines holding commit 13f0936
#                (default /root/petrolord-engines), for discriminate.mjs.
# =============================================================================
set -eu

REF=${1:-HEAD}
WRITE=${2:-}
HERE=$(cd "$(dirname "$0")" && pwd)
if [ -d "$HERE/../../../.git" ] || [ -f "$HERE/../../../.git" ]; then
  DEFAULT_REPO=$(cd "$HERE/../../.." && pwd)
else
  DEFAULT_REPO=/root/wt-et-gasvalue-nextgen
fi
REPO=${REPO:-$DEFAULT_REPO}
KIT=${KIT:-/root/dc-wavekit}
SLUG=gasvalue
PREFIX=gv
DATE=20261013
ENGINES_REPO=${ENGINES_REPO:-/root/petrolord-engines}
OLD_ENGINES=13f09364a16b533f0136cb835b530c8d545a4838

STAGE=$(mktemp -d /tmp/gvseed.XXXXXX)
OUTDIR="$STAGE/out"
trap 'rm -rf "$STAGE"' EXIT
mkdir -p "$STAGE/banks" "$OUTDIR" "$STAGE/repo/src/content/courses/$SLUG" "$STAGE/repo/packages/engines" "$STAGE/engines-13f0936"

echo "repo:    $REPO"
echo "staging the committed tree at $REF into $STAGE"

# wave.json, with its repo pointed at the staged content so nothing the
# generators read can resolve back out to a working tree.
git -C "$REPO" show "$REF:tools/course-waves/$SLUG/wave.json" \
  | python3 -c "import json,sys; c=json.load(sys.stdin); c['repo']='$STAGE/repo'; json.dump(c, open('$STAGE/wave.json','w'))"

for f in fields.json precision.json capstone.json digest.txt \
         gasvalue_capstone.mjs gasvalue_fields_capstone.mjs gasvalue_fields.mjs fakeclock.mjs \
         gate_promptleak.py oracle_check.py discriminate.mjs gen_course.py gen_golive.py \
         hdr_beginner.txt hdr_intermediate.txt hdr_advanced.txt; do
  git -C "$REPO" show "$REF:tools/course-waves/$SLUG/$f" > "$STAGE/$f"
done

# The vendored engines the capstone generator runs through (engines/ and lib/
# whole, for the cross-domain imports), and the downstream Python oracles
# oracle_check.py imports, from the object store.
git -C "$REPO" archive "$REF" packages/engines/package.json packages/engines/engines packages/engines/lib \
    packages/engines/tools/validation/downstream \
  | tar -x -C "$STAGE/repo"
# The pre-MD4-0 engines discriminate.mjs calls, from the engines repository at
# the commit, read-only: a module package, as the wave directory unpacks them.
git -C "$ENGINES_REPO" cat-file -e "$OLD_ENGINES^{commit}" 2>/dev/null \
  || { echo "REFUSED: $ENGINES_REPO does not hold petrolord-engines $OLD_ENGINES (set ENGINES_REPO)"; exit 3; }
git -C "$ENGINES_REPO" archive "$OLD_ENGINES" engines lib | tar -x -C "$STAGE/engines-13f0936"
echo '{"type":"module"}' > "$STAGE/engines-13f0936/package.json"

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
echo "staged: $(ls "$STAGE/banks" | wc -l) banks, 3 manifests, 3 headers, fields.json, precision.json, capstone.json, digest.txt, the capstone generator and records, the prompt-leak gate, the oracle check, the discriminate sweep and the two generators, $(find "$STAGE/repo/packages/engines/engines" -name '*.js' | wc -l) vendored engine files, $(ls "$STAGE/repo/packages/engines/tools/validation/downstream" | grep -c '^oracle_') downstream oracles, $(find "$STAGE/engines-13f0936" -name '*.js' | wc -l) pre-MD4-0 engine files at ${OLD_ENGINES:0:7}"
echo

# The three deep seeds, off the staged banks and the staged manifests.
for tier in beginner intermediate advanced; do
  python3 "$KIT/gen_migration.py" "$tier" "$STAGE/hdr_${tier}.txt" \
    "$OUTDIR/${DATE}_${PREFIX}_${SLUG}_${tier}_deep.sql" "$STAGE"
done

# The course and capstone migration, off the staged inputs and the staged
# engines, by the COMMITTED generator.
export ET_ENGINES="$STAGE/repo/packages/engines" ET_OLD_ENGINES="$STAGE/engines-13f0936"
GV_WAVE="$STAGE" GV_ENGINES="$STAGE/repo/packages/engines" \
  GV_COURSE_OUT="$OUTDIR/${DATE}_${PREFIX}_${SLUG}_course.sql" \
  python3 "$STAGE/gen_course.py" || exit 3

# The go-live, off the same staged inputs and the COURSE MIGRATION THIS RUN
# JUST EMITTED, so the prompts it checks are the prompts it ships.
GV_WAVE="$STAGE" GV_ENGINES="$STAGE/repo/packages/engines" \
  GV_COURSE_SQL="$OUTDIR/${DATE}_${PREFIX}_${SLUG}_course.sql" \
  GV_GOLIVE_OUT="$OUTDIR/${DATE}_${PREFIX}_${SLUG}_go_live.sql" \
  python3 "$STAGE/gen_golive.py" || exit 3
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
