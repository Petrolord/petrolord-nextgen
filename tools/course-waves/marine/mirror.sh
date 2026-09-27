#!/usr/bin/env bash
# MIRROR THE SC4 WAVE INPUTS INTO THE NEXTGEN REPOSITORY, byte for byte. Every
# suite under src/components/course/panels/marine reads the committed copy by
# default, which is what lets it run on a CI runner. The input list here is the
# list registered in tools/course-waves/waves.json; waveMirror.test.js
# byte-compares the two directories whenever this wave directory is present.
# Re-pin afterwards with: node tools/course-waves/check-wave-inputs.mjs --update
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
NG=${NG:-/root/wt-sc4-nextgen}
DEST="$NG/tools/course-waves/marine"
mkdir -p "$DEST"
INPUTS=$(node -e "const w=require('$NG/tools/course-waves/waves.json');console.log(w.marine.inputs.join('\n'))")
n=0
for f in $INPUTS; do
  mkdir -p "$DEST/$(dirname "$f")"
  cp -p "$HERE/$f" "$DEST/$f"
  cmp -s "$HERE/$f" "$DEST/$f" || { echo "REFUSES: $f did not copy byte for byte"; exit 1; }
  n=$((n + 1))
done
echo "mirrored $n inputs into $DEST"
# The 21 banks (each generator and the JSON it emits) into the per-tier bank
# tree the seed generator reads, byte for byte.
nb=0
for tier in b:beginner i:intermediate a:advanced; do
  L=${tier%%:*}; T=${tier#*:}; BD="$NG/tools/course-banks/marine/$T"; mkdir -p "$BD"
  for part in m01 m02 m03 m04 m05 m06 exam; do
    for ext in py json; do
      f="sc4${L}_${part}.${ext}"
      cp -p "$HERE/banks/$f" "$BD/$f"
      cmp -s "$HERE/banks/$f" "$BD/$f" || { echo "REFUSES: banks/$f did not copy byte for byte"; exit 1; }
      nb=$((nb + 1))
    done
  done
done
echo "mirrored $nb bank files (21 generators and their JSON) into $NG/tools/course-banks/marine"
