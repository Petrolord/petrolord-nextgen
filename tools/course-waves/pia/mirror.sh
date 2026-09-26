#!/usr/bin/env bash
# MIRROR THE EC7 WAVE INPUTS INTO THE NEXTGEN REPOSITORY, byte for byte. Every
# suite under src/components/course/panels/pia reads the committed copy by
# default, which is what lets it run on a CI runner. The input list here is the
# list registered in tools/course-waves/waves.json; waveMirror.test.js
# byte-compares the two directories whenever this wave directory is present.
# Before waves.json registers the wave, MIRROR_ALL=1 copies every kit file
# (everything but the audit reports, the sources and scratch directories).
# Re-pin afterwards with: node tools/course-waves/check-wave-inputs.mjs --update
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
NG=${NG:-/root/wt-ec7-nextgen}
DEST="$NG/tools/course-waves/pia"
mkdir -p "$DEST"
if [ "${MIRROR_ALL:-0}" = 1 ]; then
  INPUTS=$(cd "$HERE" && ls -1 *.mjs *.py *.sh *.md *.json *.txt 2>/dev/null | grep -v -E '^(AUDIT-|COURSE-LINE|RECUT-)' ; cd "$HERE" && ls -1 banks/*.py 2>/dev/null || true)
else
  INPUTS=$(node -e "const w=require('$NG/tools/course-waves/waves.json');console.log(w.pia.inputs.join('\n'))")
fi
n=0
for f in $INPUTS; do
  mkdir -p "$DEST/$(dirname "$f")"
  cp -p "$HERE/$f" "$DEST/$f"
  cmp -s "$HERE/$f" "$DEST/$f" || { echo "REFUSES: $f did not copy byte for byte"; exit 1; }
  n=$((n + 1))
done
echo "mirrored $n inputs into $DEST"
