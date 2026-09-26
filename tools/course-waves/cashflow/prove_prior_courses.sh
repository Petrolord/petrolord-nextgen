#!/usr/bin/env bash
# EC7 PIA RECUT PROOFS against a worktree's vendored engines (NG, default this worktree).
# 1. qra (H5), the one other course whose engine imports cashflow.ts (npv only): rebuild
#    its digest, fields.json and precision.json from the COMMITTED kit copied to a mktemp
#    dir, compare byte for byte with the committed copies and the waves.json pins.
# 2. cashflow (EC1) and fiscal (EC2), the re-cut courses: rebuild each committed digest and
#    fields.json the same way and prove the committed copies are what the kits produce.
# Usage: NG=<nextgen checkout> bash tools/course-waves/cashflow/prove_prior_courses.sh
set -euo pipefail
NG=${NG:-/root/wt-ec7-recut}
ENG="$NG/packages/engines"
SCR=$(mktemp -d /tmp/ec7-prior-XXXXXX); trap 'rm -rf "$SCR"' EXIT
fail=0
for spec in "H5:qra"; do
  P=${spec%%:*}; W=${spec#*:}
  src="$NG/tools/course-waves/$W"; dst="$SCR/$W"; cp -rp "$src" "$dst"
  export ${P}_WAVE_DIR="$dst" ${P}_ENGINES="$ENG" ${P}_REPO="$NG" \
         ${P}_TOLERANCE="$NG/src/components/course/panels/$W/gradedTolerance.js"
  (cd "$dst" && sh ./build_digest.sh > "$dst/digest.tmp" 2>"$dst/digest.err") || { echo "$P $W: digest build FAILED"; tail -3 "$dst/digest.err"; fail=1; continue; }
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
done
for W in cashflow fiscal; do
  src="$NG/tools/course-waves/$W"; dst="$SCR/$W"; cp -rp "$src" "$dst"
  if [ $W = cashflow ]; then
    (cd "$dst" && EC1_WAVE_DIR="$dst" EC1_ENGINES="$ENG" EC1_REPO="$NG" sh ./build_digest.sh > digest.tmp 2>digest.err && mv digest.tmp digest.txt \
      && EC1_WAVE_DIR="$dst" EC1_ENGINES="$ENG" node ./ec1_fields.mjs > fields.log 2>&1) || { echo "$W: rebuild FAILED"; tail -3 "$dst/digest.err" "$dst/fields.log"; fail=1; continue; }
  else
    (cd "$dst" && EC2_WAVE_DIR="$dst" EC2_ENGINES="$ENG" EC2_REPO="$NG" sh ./build_digest.sh > digest.tmp 2>digest.err && mv digest.tmp digest.txt \
      && EC2_WAVE_DIR="$dst" EC2_ENGINES="$ENG" EC2_REPO="$NG" node ./ec2_fields.mjs --json > fields.log 2>&1) || { echo "$W: rebuild FAILED"; tail -3 "$dst/digest.err" "$dst/fields.log"; fail=1; continue; }
  fi
  for f in digest.txt fields.json; do
    if cmp -s "$src/$f" "$dst/$f"; then v=IDENTICAL; else v=DIFFERS; fail=1; fi
    pin=$(python3 -c "import json,sys;print(json.load(open(sys.argv[1]))[sys.argv[2]]['pins'][sys.argv[3]])" "$NG/tools/course-waves/waves.json" "$W" "$f")
    got=$(sha256sum "$dst/$f" | cut -d' ' -f1); [ "$pin" = "$got" ] && pv="matches its pin" || { pv="DOES NOT MATCH its pin"; fail=1; }
    printf 'EC %-9s %-12s %s, %s  sha256 %s\n' "$W" "$f" "$v" "$pv" "${got:0:16}"
  done
done
[ $fail = 0 ] && echo "PROVED against $ENG: qra unchanged; cashflow and fiscal digests and fields rebuild byte-identical" || { echo "A DIFFERENCE"; exit 1; }
