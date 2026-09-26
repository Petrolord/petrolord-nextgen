#!/usr/bin/env bash
# PROVE THE SC2 VENDORING LEAVES EVERY EARLIER COURSE THAT SHARES ITS FILES
# UNCHANGED.
#
# PART 1, THE TREE. The SC2 closure moves no shared path: tender.js, its
# suite, golden, fixtures and tools are NEW; lib/stats, percentile.js,
# wellCost.js, irrContract.js and lib/dates already match; cashflow.ts and
# afe.js are deliberately LEFT at NextGen's blobs (vendor_procurement.sh). So
# every packages/engines path that exists on origin/main must be byte-identical
# on this branch, VENDOR.json (the ledger) excepted, and every path this branch
# adds must be a supply chain path. This part proves exactly that with git.
#
# PART 2, THE COURSES. For each full-kit course whose digest or capstone runs a
# file the tender closure also runs (lib/stats and lib/conventions/percentile.js:
# D1 dataqc, D2 mlcore, D3 facies, D4 forecastml, D5 appliedai, H4 consequence;
# engines/economics/cashflow.ts npv: H5 qra), this rebuilds, from the
# COMMITTED kit copied to a scratch directory, against THIS worktree's vendored
# engines: the digest (build_digest.sh), fields.json and precision.json
# (make_fields.mjs, which runs the capstone generator), and compares each byte
# for byte with the committed copy and with the sha256 pinned in waves.json.
# EC1 cashflow and EC2 fiscal, re-cut at main e8fb6fa8c, rebuild their digest
# and fields.json from their committed kits too. The other economics courses
# that share cashflow.ts and afe.js (EC3 uncertainty, EC5 portfolio) are
# "inputs" kits that cannot be rebuilt from the repository; part 1 proves the
# files they run did not move.
set -euo pipefail
NG=${NG:-/root/wt-sc2-nextgen}
ENG="$NG/packages/engines"
BASE=${BASE:-origin/main}
# A FRESH SCRATCH DIRECTORY PER RUN (mktemp -d), removed on exit, so two runs at
# once (three lesson writers run the gates together) never delete each other's
# rebuilds or logs. SCR=<dir> keeps a named one for inspection; it must not
# exist yet, so it is never shared either.
if [ -n "${SCR:-}" ]; then
  [ -e "$SCR" ] && { echo "REFUSES: SCR=$SCR already exists; name a fresh directory"; exit 2; }
  mkdir -p "$SCR"
else
  SCR=$(mktemp -d /tmp/sc2-prior-XXXXXX)
  trap 'rm -rf "$SCR"' EXIT
fi
fail=0

echo "PART 1: packages/engines on this branch against $BASE"
changed=$(git -C "$NG" diff --name-status "$BASE" -- packages/engines | grep -v '^A' | awk '{print $2}' || true)
added=$(git -C "$NG" diff --name-status "$BASE" -- packages/engines | grep '^A' | awk '{print $2}' || true)
untracked=$(git -C "$NG" status --porcelain -- packages/engines | grep -v '^A ' || true)
for p in $changed; do
  if [ "$p" = "packages/engines/VENDOR.json" ]; then echo "  modified  $p (the ledger: new sc2-procurement-course entries only)"; else echo "  MODIFIED  $p"; fail=1; fi
done
for p in $added; do
  case "$p" in
    *supplychain*) echo "  added     $p" ;;
    *) echo "  ADDED OUTSIDE SUPPLY CHAIN  $p"; fail=1 ;;
  esac
done
[ -z "$untracked" ] || { echo "  UNCOMMITTED CHANGES under packages/engines:"; echo "$untracked"; fail=1; }
# the ledger may only gain sc2-procurement-course entries
python3 - "$NG" "$BASE" <<'PY' || fail=1
import json, subprocess, sys
ng, base = sys.argv[1:3]
old = json.loads(subprocess.check_output(['git', '-C', ng, 'show', f'{base}:packages/engines/VENDOR.json'], text=True))
new = json.load(open(f'{ng}/packages/engines/VENDOR.json'))
od = [e for e in old['knownDeviations']]
nd = [e for e in new['knownDeviations'] if e.get('group') != 'sc2-procurement-course']
same = od == nd and {k: v for k, v in old.items() if k != 'knownDeviations'} == {k: v for k, v in new.items() if k != 'knownDeviations'}
print(f"  VENDOR.json: every entry outside group sc2-procurement-course and every other key unchanged: {'yes' if same else 'NO'}")
sys.exit(0 if same else 1)
PY
[ $fail = 0 ] && echo "  every pre-existing vendored path is byte-identical to $BASE"

echo
echo "PART 2: the courses that run shared files, rebuilt from their committed kits"
for spec in "D1:dataqc" "D2:mlcore" "D3:facies" "D4:forecastml" "D5:appliedai" "H4:consequence" "H5:qra"; do
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
# EC1 cashflow and EC2 fiscal, re-cut onto the PIA 2021 / NTA 2025 repair at
# main e8fb6fa8c (#266), run cashflow.ts itself (and fiscal afe.js), the two
# shared files vendor_procurement.sh leaves with their owners. Their kits now
# rebuild from the repository, the way their own
# tools/course-waves/cashflow/prove_prior_courses.sh does it.
for W in cashflow fiscal; do
  src="$NG/tools/course-waves/$W"; dst="$SCR/$W"; cp -rp "$src" "$dst"
  if [ $W = cashflow ]; then
    (cd "$dst" && EC1_WAVE_DIR="$dst" EC1_ENGINES="$ENG" EC1_REPO="$NG" sh ./build_digest.sh > digest.tmp 2>digest.err && mv digest.tmp digest.txt \
      && EC1_WAVE_DIR="$dst" EC1_ENGINES="$ENG" node ./ec1_fields.mjs > fields.log 2>&1) || { echo "EC1 $W: rebuild FAILED"; tail -3 "$dst/digest.err" "$dst/fields.log"; fail=1; continue; }
  else
    (cd "$dst" && EC2_WAVE_DIR="$dst" EC2_ENGINES="$ENG" EC2_REPO="$NG" sh ./build_digest.sh > digest.tmp 2>digest.err && mv digest.tmp digest.txt \
      && EC2_WAVE_DIR="$dst" EC2_ENGINES="$ENG" EC2_REPO="$NG" node ./ec2_fields.mjs --json > fields.log 2>&1) || { echo "EC2 $W: rebuild FAILED"; tail -3 "$dst/digest.err" "$dst/fields.log"; fail=1; continue; }
  fi
  for f in digest.txt fields.json; do
    if cmp -s "$src/$f" "$dst/$f"; then v=IDENTICAL; else v=DIFFERS; fail=1; fi
    pin=$(python3 -c "import json,sys;print(json.load(open(sys.argv[1]))[sys.argv[2]]['pins'][sys.argv[3]])" "$NG/tools/course-waves/waves.json" "$W" "$f")
    got=$(sha256sum "$dst/$f" | cut -d' ' -f1); [ "$pin" = "$got" ] && pv="matches its waves.json pin" || { pv="DOES NOT MATCH its waves.json pin"; fail=1; }
    printf 'EC %-12s %-15s %s, %s  sha256 %s\n' "$W" "$f" "$v" "$pv" "${got:0:16}"
  done
done
[ $fail = 0 ] && echo "PRIOR COURSES UNCHANGED: no shared vendored path moved; D1, D2, D3, D4, D5, H4, H5, EC1 cashflow and EC2 fiscal digests and fields rebuild byte-identical against $ENG" || { echo "PRIOR COURSES: A DIFFERENCE"; exit 1; }
