#!/usr/bin/env bash
# PROVE THE EC7 FOUNDATION LEAVES EVERY EARLIER COURSE THAT SHARES ITS FILES
# UNCHANGED.
#
# PART 1, THE TREE. This course vendors NOTHING: it runs the cashflow.ts
# (3.12.0), fiscalConventions.js, the pia2021 golden and the pia2021 oracle that
# the cashflow and fiscal re-cut already vendored (NextGen #266). So every
# packages/engines path on this branch must be byte-identical to origin/main,
# VENDOR.json included, and nothing under packages/engines may be added or left
# uncommitted. This part proves exactly that with git.
#
# PART 2, THE COURSES. For each full-kit course whose digest or capstone runs a
# file this course also runs (engines/economics/cashflow.ts, directly or through
# a canonical npv import: H5 qra, SC2 procurement where it is committed; and
# every Data & AI wave, D1 dataqc to D5 appliedai, which share the kit and the
# lib/stats and percentile files beside it), this rebuilds, from the COMMITTED kit
# copied to a fresh mktemp scratch directory, against THIS worktree's vendored
# engines: the digest (build_digest.sh), fields.json and precision.json
# (make_fields.mjs), and compares each byte for byte with the committed copy and
# with the sha256 pinned in waves.json.
#
# PART 3, THE RE-CUT ECONOMICS COURSES. cashflow (EC1) and fiscal (EC2) teach
# the same engine; their committed kits (tools/course-waves/cashflow and
# fiscal) rebuild their digests and fields byte-identical and match their pins.
set -euo pipefail
NG=${NG:-/root/wt-ec7-nextgen}
ENG="$NG/packages/engines"
BASE=${BASE:-origin/main}
if [ -n "${SCR:-}" ]; then
  [ -e "$SCR" ] && { echo "REFUSES: SCR=$SCR already exists; name a fresh directory"; exit 2; }
  mkdir -p "$SCR"
else
  SCR=$(mktemp -d /tmp/ec7-prior-XXXXXX)
  trap 'rm -rf "$SCR"' EXIT
fi
fail=0

echo "PART 1: packages/engines on this branch against $BASE"
changed=$(git -C "$NG" diff --name-status "$BASE" -- packages/engines | awk '{print $2}' || true)
untracked=$(git -C "$NG" status --porcelain -- packages/engines || true)
for p in $changed; do echo "  CHANGED  $p"; fail=1; done
[ -z "$untracked" ] || { echo "  UNCOMMITTED CHANGES under packages/engines:"; echo "$untracked"; fail=1; }
[ $fail = 0 ] && echo "  every packages/engines path, VENDOR.json included, is byte-identical to $BASE; nothing added"

echo
echo "PART 2: the courses that run shared files, rebuilt from their committed kits"
specs="D1:dataqc D2:mlcore D3:facies D4:forecastml D5:appliedai H5:qra"
[ -d "$NG/tools/course-waves/procurement" ] && specs="$specs SC2:procurement"
for spec in $specs; do
  P=${spec%%:*}; W=${spec#*:}
  src="$NG/tools/course-waves/$W"; dst="$SCR/$W"
  cp -rp "$src" "$dst"
  export ${P}_WAVE_DIR="$dst" ${P}_ENGINES="$ENG" ${P}_REPO="$NG" \
         ${P}_TOLERANCE="$NG/src/components/course/panels/$W/gradedTolerance.js"
  (cd "$dst" && sh ./build_digest.sh > "$dst/digest.tmp" 2>"$dst/digest.err") || { echo "$P $W: digest build FAILED"; tail -3 "$dst/digest.err"; fail=1; continue; }
  mv "$dst/digest.tmp" "$dst/digest.txt"
  (cd "$dst" && node ./make_fields.mjs > "$dst/fields.log" 2>&1) || { echo "$P $W: make_fields FAILED"; tail -3 "$dst/fields.log"; fail=1; continue; }
  for f in digest.txt fields.json precision.json; do
    if cmp -s "$src/$f" "$dst/$f"; then v=IDENTICAL; else v=DIFFERS; fail=1; fi
    printf '%s %-12s %-15s %s  sha256 %s\n' "$P" "$W" "$f" "$v" "$(sha256sum "$dst/$f" | cut -c1-16)"
  done
  for f in digest.txt fields.json; do
    pin=$(python3 -c "import json,sys;print(json.load(open(sys.argv[1]))[sys.argv[2]]['pins'][sys.argv[3]])" "$NG/tools/course-waves/waves.json" "$W" "$f")
    got=$(sha256sum "$dst/$f" | cut -d' ' -f1)
    [ "$pin" = "$got" ] && echo "$P $W $f matches its waves.json pin ${pin:0:16}" || { echo "$P $W $f DOES NOT MATCH its waves.json pin"; fail=1; }
  done
  unset ${P}_WAVE_DIR ${P}_ENGINES ${P}_REPO ${P}_TOLERANCE
done

echo
echo "PART 3: the re-cut economics courses that teach the same engine"
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
[ $fail = 0 ] && echo "PRIOR COURSES UNCHANGED: packages/engines identical to $BASE; D1 to D5, H5 and SC2 (where committed) digests, fields and precision rebuild byte-identical; cashflow and fiscal rebuild byte-identical against $ENG" || { echo "PRIOR COURSES: A DIFFERENCE"; exit 1; }
