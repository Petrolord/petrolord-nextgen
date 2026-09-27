#!/usr/bin/env bash
# MIRROR THE SC5 WAVE INPUTS INTO THE NEXTGEN REPOSITORY, byte for byte. The
# input list is the one registered in tools/course-waves/waves.json (kit
# 'practice'). The fetched source texts stay in the wave directory: they are
# pinned by sha256 in sources/SOURCES.json, and the World Bank texts among them
# are licensed for non-commercial reproduction only.
# Re-pin afterwards with: node tools/course-waves/check-wave-inputs.mjs --update
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
NG=${NG:-/root/wt-sc5-nextgen}
DEST="$NG/tools/course-waves/contracts"
mkdir -p "$DEST"
INPUTS=$(node -e "const w=require('$NG/tools/course-waves/waves.json');console.log(w.contracts.inputs.join('\n'))")
n=0
for f in $INPUTS; do
  mkdir -p "$DEST/$(dirname "$f")"
  cp -p "$HERE/$f" "$DEST/$f"
  cmp -s "$HERE/$f" "$DEST/$f" || { echo "REFUSES: $f did not copy byte for byte"; exit 1; }
  n=$((n + 1))
done
echo "mirrored $n inputs into $DEST"
