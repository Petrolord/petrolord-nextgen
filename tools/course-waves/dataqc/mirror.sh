#!/usr/bin/env bash
# MIRROR THE D1 WAVE INPUTS INTO THE NEXTGEN REPOSITORY, byte for byte. Every
# suite under src/components/course/panels/dataqc reads the committed copy by
# default, which is what lets it run on a CI runner. The input list here is the
# list registered in tools/course-waves/waves.json; waveMirror.test.js
# byte-compares the two directories whenever this wave directory is present.
# Re-pin afterwards with: node tools/course-waves/check-wave-inputs.mjs --update
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
NG=${NG:-/root/wt-dai-d1-nextgen}
DEST="$NG/tools/course-waves/dataqc"
mkdir -p "$DEST"
INPUTS=$(node -e "const w=require('$NG/tools/course-waves/waves.json');console.log(w.dataqc.inputs.join('\n'))")
n=0
for f in $INPUTS; do
  mkdir -p "$DEST/$(dirname "$f")"
  cp -p "$HERE/$f" "$DEST/$f"
  cmp -s "$HERE/$f" "$DEST/$f" || { echo "REFUSES: $f did not copy byte for byte"; exit 1; }
  n=$((n + 1))
done
echo "mirrored $n inputs into $DEST"
