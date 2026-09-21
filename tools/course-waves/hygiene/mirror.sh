#!/bin/sh
# Mirror the H2 wave inputs into the NextGen committed copy, byte for byte.
# The list is the "inputs" list of tools/course-waves/waves.json for hygiene.
set -eu
NG=${H2_NEXTGEN:-/root/wt-h2-nextgen}
DST="$NG/tools/course-waves/hygiene"
mkdir -p "$DST"
for f in $(node -e "console.log(JSON.parse(require('fs').readFileSync('$NG/tools/course-waves/waves.json','utf8')).hygiene.inputs.join(' '))"); do
  cp -p "/root/hse-wip-hygiene/$f" "$DST/$f"
done
echo "mirrored $(ls "$DST" | wc -l) inputs into $DST"
