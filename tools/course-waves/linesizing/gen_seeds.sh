#!/usr/bin/env bash
# =============================================================================
# FC2 deep seeds, GENERATED FROM THE COMMITTED TREE AND NOT FROM A WORKING TREE.
#
# WHY. /root/dc-wavekit/gen_migration.py resolves its banks to <wave dir>/banks
# and its manifests to <repo>/src/content/courses/<slug>, both of which are
# working trees. A bank repaired in the wave dir and never committed, or
# committed and never copied back, both produce a seed that matches nothing
# anybody can review. Both directions have already bitten this programme.
#
# So this script stages the committed tree first: every manifest.json and every
# bank .json is pulled out of the git object store at REF with `git show`, into
# a throwaway directory, and gen_migration.py is pointed at that. Nothing it
# reads can have been edited after the commit it is named for.
#
# Usage: gen_seeds.sh [ref]     default HEAD
#   REPO=<path>  the clone or worktree whose object store the tree is read from.
#                It was hardcoded, so a run from any other worktree silently cut
#                the seeds from a tree the caller was not working in.
# =============================================================================
set -eu

REF=${1:-HEAD}
W=/root/fc-wip-linesizing
REPO=${REPO:-/root/wt-fc2-nextgen}
KIT=/root/dc-wavekit
SLUG=linesizing
PREFIX=fc2
DATE=20260922

STAGE=$(mktemp -d /tmp/fc2seed.XXXXXX)
trap 'rm -rf "$STAGE"' EXIT

echo "staging the committed tree at $REF into $STAGE"
mkdir -p "$STAGE/banks" "$STAGE/repo/src/content/courses/$SLUG"

# wave.json, with its repo pointed at the staged content so nothing resolves
# back out to a working tree.
git -C "$REPO" show "$REF:tools/course-waves/$SLUG/wave.json" \
  | python3 -c "import json,sys; c=json.load(sys.stdin); c['repo']='$STAGE/repo'; json.dump(c, open('$STAGE/wave.json','w'))"

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
echo "staged: $(ls "$STAGE/banks" | wc -l) banks, 3 manifests"

for tier in beginner intermediate advanced; do
  python3 "$KIT/gen_migration.py" "$tier" "$W/hdr_${tier}.txt" \
    "$REPO/migrations/${DATE}_${PREFIX}_${SLUG}_${tier}_deep.sql" "$STAGE"
done
