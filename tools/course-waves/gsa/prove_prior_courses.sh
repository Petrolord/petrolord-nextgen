#!/usr/bin/env bash
# PROVE THE EC8 FOUNDATION LEAVES EVERY EARLIER COURSE THAT SHARES ITS FILES
# UNCHANGED.
#
# PART 1, THE TREE. This course vendors the gasContract.js closure at d745b88
# (vendor_gsa.sh) and moves nothing else: every packages/engines path on this
# branch that differs from origin/main must be one of the eleven paths VENDOR.json
# ledgers as group ec8-gsa-course, each byte-identical to petrolord-engines
# d745b88, plus VENDOR.json itself, whose only change is those eleven ledger
# entries; engines/economics/cashflow.ts must be byte-identical to origin/main.
# Nothing under packages/engines may be left uncommitted.
#
# PART 2, THE COURSES. For each full-kit course whose digest or capstone runs a
# file this course also runs (engines/economics/cashflow.ts through the
# canonical npv, the gas royalty or calendarDays: EC7 pia, SC2 procurement, H5
# qra; and every Data & AI wave, D1 dataqc to D5 appliedai, which share the kit
# and the vendored tree), this rebuilds, from the COMMITTED kit copied to a
# fresh mktemp scratch directory, against THIS worktree's vendored engines: the
# digest (build_digest.sh), fields.json and precision.json (make_fields.mjs), and
# compares each byte for byte with the committed copy and with the sha256 pinned
# in waves.json.
#
# PART 3, THE ECONOMICS COURSES ON THE SAME ENGINE. cashflow (EC1) and fiscal
# (EC2) teach cashflow.ts; their committed kits rebuild their digests and fields
# byte-identical and match their pins.
set -euo pipefail
NG=${NG:-/root/wt-ec8-nextgen}
ENG="$NG/packages/engines"
BASE=${BASE:-origin/main}
if [ -n "${SCR:-}" ]; then
  [ -e "$SCR" ] && { echo "REFUSES: SCR=$SCR already exists; name a fresh directory"; exit 2; }
  mkdir -p "$SCR"
else
  SCR=$(mktemp -d /tmp/ec8-prior-XXXXXX)
  trap 'rm -rf "$SCR"' EXIT
fi
fail=0

echo "PART 1: packages/engines on this branch against $BASE"
ENG_CANON=${ENG_CANON:-/root/petrolord-engines}
REV=7f5d462
LEDGERED=$(python3 -c "import json,sys;print('\n'.join(sorted(e['path'] for e in json.load(open(sys.argv[1]))['knownDeviations'] if e.get('group')=='ec8-gsa-course')))" "$ENG/VENDOR.json")
nled=$(printf '%s\n' "$LEDGERED" | grep -c .)
[ "$nled" = 11 ] || { echo "  VENDOR.json ledgers $nled paths as ec8-gsa-course, expected 11"; fail=1; }
changed=$(git -C "$NG" diff --name-only "$BASE" -- packages/engines | sed 's|^packages/engines/||' || true)
untracked=$(git -C "$NG" status --porcelain -- packages/engines || true)
for p in $changed; do
  if [ "$p" = VENDOR.json ]; then continue; fi
  if printf '%s\n' "$LEDGERED" | grep -qxF "$p"; then
    a=$(git -C "$ENG_CANON" rev-parse "$REV:$p"); b=$(git hash-object "$ENG/$p")
    [ "$a" = "$b" ] && echo "  ledgered  $p  byte-identical to $REV (${a:0:10})" || { echo "  DIFFERS   $p from $REV"; fail=1; }
  else
    echo "  CHANGED   $p is not one of this wave's ledgered paths"; fail=1
  fi
done
# VENDOR.json: the only change against the base is the ec8-gsa-course ledger entries.
python3 - "$NG" "$BASE" <<'PY' || fail=1
import json, subprocess, sys
ng, base = sys.argv[1:3]
old = json.loads(subprocess.check_output(['git', '-C', ng, 'show', f'{base}:packages/engines/VENDOR.json'], text=True))
new = json.load(open(f'{ng}/packages/engines/VENDOR.json'))
strip = lambda v: {**v, 'knownDeviations': [e for e in v['knownDeviations'] if e.get('group') != 'ec8-gsa-course']}
ok = strip(new) == strip(old) and new['canonical'] == old['canonical']
print(f"  VENDOR.json: {'only the ec8-gsa-course ledger entries differ; the pin ' + new['canonical']['commit'][:7] + ' is unchanged' if ok else 'DIFFERS beyond the ec8-gsa-course entries'}")
sys.exit(0 if ok else 1)
PY
git -C "$NG" diff --quiet "$BASE" -- packages/engines/engines/economics/cashflow.ts && echo "  engines/economics/cashflow.ts byte-identical to $BASE" || { echo "  cashflow.ts CHANGED"; fail=1; }
[ -z "$untracked" ] || { echo "  UNCOMMITTED CHANGES under packages/engines:"; echo "$untracked"; fail=1; }
echo
echo "PART 2: the courses that run shared files, rebuilt from their committed kits"
specs="D1:dataqc D2:mlcore D3:facies D4:forecastml D5:appliedai H5:qra SC2:procurement EC7:pia"
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
echo "PART 3: the economics courses that teach cashflow.ts"
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
[ $fail = 0 ] && echo "PRIOR COURSES UNCHANGED: packages/engines differs from $BASE only by the eleven ec8-gsa-course paths (sha-identical to d745b88) and their ledger entries; D1 to D5, H5, SC2 procurement and EC7 pia digests, fields and precision rebuild byte-identical; cashflow and fiscal rebuild byte-identical against $ENG" || { echo "PRIOR COURSES: A DIFFERENCE"; exit 1; }
