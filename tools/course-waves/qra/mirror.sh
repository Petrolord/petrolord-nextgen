#!/usr/bin/env bash
# MIRROR THE H5 WAVE INPUTS INTO THE NEXTGEN REPOSITORY, byte for byte, and
# re-pin them. Every suite under src/components/course/panels/qra reads
# the committed copy by default, which is what lets it run on a CI runner.
# The input list here is the list registered in tools/course-waves/waves.json;
# waveMirror.test.js byte-compares the two directories whenever this wave
# directory is present.
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
NG=${NG:-/root/wt-h5-nextgen}
DEST="$NG/tools/course-waves/qra"
mkdir -p "$DEST"
INPUTS=$(node -e "const w=require('$NG/tools/course-waves/waves.json');console.log(w.qra.inputs.join('\n'))")
n=0
for f in $INPUTS; do
  mkdir -p "$DEST/$(dirname "$f")"
  cp -p "$HERE/$f" "$DEST/$f"
  cmp -s "$HERE/$f" "$DEST/$f" || { echo "REFUSES: $f did not copy byte for byte"; exit 1; }
  n=$((n + 1))
done
echo "mirrored $n inputs into $DEST"
