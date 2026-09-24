#!/usr/bin/env bash
# PROVE THE D4 VENDORING LEAVES D1, D2 AND D3 UNCHANGED. The D4 closure moves
# one shared path (tools/validation/dataai/synthetic_wells.js, syntheticProduction
# appended). For each prior Data & AI course this rebuilds, from the COMMITTED
# kit copied to a scratch directory, against THIS worktree's vendored engines:
# the digest (build_digest.sh), fields.json and precision.json (make_fields.mjs,
# which runs the capstone generator), and compares each byte for byte with the
# committed copy and with the sha256 pinned in waves.json.
set -euo pipefail
NG=${NG:-/root/wt-dai-d4-nextgen}
ENG="$NG/packages/engines"
SCR=${SCR:-/root/dai-wip-forecastml/scratch/prior}
rm -rf "$SCR"; mkdir -p "$SCR"
fail=0
for spec in "D1:dataqc" "D2:mlcore" "D3:facies"; do
  P=${spec%%:*}; W=${spec#*:}
  src="$NG/tools/course-waves/$W"; dst="$SCR/$W"
  cp -rp "$src" "$dst"
  export ${P}_WAVE_DIR="$dst" ${P}_ENGINES="$ENG" ${P}_REPO="$NG" \
         ${P}_TOLERANCE="$NG/src/components/course/panels/$W/gradedTolerance.js"
  (cd "$dst" && sh ./build_digest.sh > "$dst/digest.tmp" 2>"$dst/digest.err") || { echo "$P $W: digest build FAILED"; cat "$dst/digest.err" | tail -3; fail=1; continue; }
  mv "$dst/digest.tmp" "$dst/digest.txt"
  (cd "$dst" && node ./make_fields.mjs > "$dst/fields.log" 2>&1) || { echo "$P $W: make_fields FAILED"; tail -3 "$dst/fields.log"; fail=1; continue; }
  for f in digest.txt fields.json precision.json; do
    if cmp -s "$src/$f" "$dst/$f"; then v=IDENTICAL; else v=DIFFERS; fail=1; fi
    printf '%s %-7s %-15s %s  sha256 %s\n' "$P" "$W" "$f" "$v" "$(sha256sum "$dst/$f" | cut -c1-16)"
  done
  for f in digest.txt fields.json; do
    pin=$(python3 -c "import json,sys;print(json.load(open(sys.argv[1]))[sys.argv[2]]['pins'][sys.argv[3]])" "$NG/tools/course-waves/waves.json" "$W" "$f")
    got=$(sha256sum "$dst/$f" | cut -d' ' -f1)
    [ "$pin" = "$got" ] && echo "$P $W $f matches its waves.json pin ${pin:0:16}" || { echo "$P $W $f DOES NOT MATCH its waves.json pin"; fail=1; }
  done
  unset ${P}_WAVE_DIR ${P}_ENGINES ${P}_REPO ${P}_TOLERANCE
done
[ $fail = 0 ] && echo "PRIOR COURSES UNCHANGED: D1, D2, D3 digests, fields and precision rebuild byte-identical against $ENG" || { echo "PRIOR COURSES: A DIFFERENCE"; exit 1; }
