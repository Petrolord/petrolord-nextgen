#!/usr/bin/env bash
# PROVE THE SC4 FOUNDATION LEAVES EVERY EARLIER COURSE UNCHANGED.
#
# PART 1, THE TREE. This course vendors the marineLogistics.js closure at
# engines e67e7ba (vendor_marine.sh) at its CANONICAL paths and moves nothing
# shared: every packages/engines path on this branch that differs from BASE
# must be one of the ten paths VENDOR.json ledgers as group sc4-marine-course,
# each byte-identical to petrolord-engines e67e7ba, plus VENDOR.json itself,
# whose only change against BASE is those ten ledger entries. The runtime
# paths the closure shares (lib/stats/stats.js, lib/conventions/percentile.js)
# must be byte-identical to BASE. Nothing under packages/engines may be left
# uncommitted.
#
# PART 2, THE FULL KITS. Every full-kit course that shares the kit and the
# vendored tree (D1 dataqc to D5 appliedai; H1 safetystats, H3 lopa, H4
# consequence, H5 qra; SC2 procurement; EC7 pia, EC8 gsa, EC9 joa, EC10
# farmout and EC11 prms, which read lib/stats or lib/conventions; SC3 materials,
# the supply chain app course before this one), rebuilt from its COMMITTED kit
# copied to a fresh mktemp scratch directory against THIS worktree's vendored
# engines: the digest (build_digest.sh), fields.json and precision.json
# (make_fields.mjs), each compared byte for byte with the committed copy and
# with the sha256 pinned in waves.json.
#
# PART 3, THE ECONOMICS COURSES ON cashflow.ts AND lib/stats. cashflow (EC1)
# and fiscal (EC2) teach cashflow.ts; fdp (EC6) reads its digest from the
# economics goldens; decision (EC4) and portfolio (EC5) run lib/stats. Their
# committed generators rebuild their digests (and fields) byte-identical and
# match their pins.
#
# PART 4, THE SC5 PRACTICE KIT. contracts has no engine; its PACK.md rebuilds from
# the committed passages.json and sources/SOURCES.json byte-identical, and the
# three match their pins in waves.json.
#
#   bash prove_prior_courses.sh            (NG=/root/wt-sc4-nextgen BASE=origin/main by default)
set -euo pipefail
NG=${NG:-${SC4_REPO:-/root/wt-sc4-nextgen}}
ENG="$NG/packages/engines"
BASE=${BASE:-origin/main}
ENG_CANON=${ENG_CANON:-/root/petrolord-engines}
REV=${REV:-e67e7ba}
SCR=$(mktemp -d /tmp/sc4-prior-XXXXXX); trap 'rm -rf "$SCR"' EXIT
fail=0
pin() { python3 -c "import json,sys;print(json.load(open(sys.argv[1]))[sys.argv[2]]['pins'][sys.argv[3]])" "$NG/tools/course-waves/waves.json" "$1" "$2"; }

echo "PART 1: packages/engines on this branch against $BASE"
LEDGERED=$(python3 -c "import json,sys;print('\n'.join(sorted(e['path'] for e in json.load(open(sys.argv[1]))['knownDeviations'] if e.get('group')=='sc4-marine-course')))" "$ENG/VENDOR.json")
nled=$(printf '%s\n' "$LEDGERED" | grep -c .)
[ "$nled" = 10 ] || { echo "  VENDOR.json ledgers $nled paths as sc4-marine-course, expected 10"; fail=1; }
for p in $(git -C "$NG" diff --name-only "$BASE" -- packages/engines | sed 's|^packages/engines/||'); do
  [ "$p" = VENDOR.json ] && continue
  if printf '%s\n' "$LEDGERED" | grep -qxF "$p"; then
    a=$(git -C "$ENG_CANON" rev-parse "$REV:$p"); b=$(git hash-object "$ENG/$p")
    [ "$a" = "$b" ] && echo "  ledgered  $p  byte-identical to $REV (${a:0:10})" || { echo "  DIFFERS   $p from $REV"; fail=1; }
  else echo "  CHANGED   $p is not one of this wave's ledgered paths"; fail=1; fi
done
python3 - "$NG" "$BASE" <<'PY' || fail=1
import json, subprocess, sys
ng, base = sys.argv[1:3]
old = json.loads(subprocess.check_output(['git', '-C', ng, 'show', f'{base}:packages/engines/VENDOR.json'], text=True))
new = json.load(open(f'{ng}/packages/engines/VENDOR.json'))
strip = lambda v: {**v, 'knownDeviations': [e for e in v['knownDeviations'] if e.get('group') != 'sc4-marine-course']}
ok = strip(new) == strip(old) and new['canonical'] == old['canonical']
print(f"  VENDOR.json: {'only the sc4-marine-course ledger entries differ; the pin ' + new['canonical']['commit'][:7] + ' is unchanged' if ok else 'DIFFERS beyond the sc4-marine-course entries'}")
sys.exit(0 if ok else 1)
PY
for sh in lib/stats/stats.js lib/conventions/percentile.js; do
  git -C "$NG" diff --quiet "$BASE" -- "packages/engines/$sh" && echo "  $sh byte-identical to $BASE" || { echo "  $sh CHANGED"; fail=1; }
done
u=$(git -C "$NG" status --porcelain -- packages/engines | grep -v node_modules || true)
[ -z "$u" ] || { echo "  UNCOMMITTED under packages/engines:"; echo "$u"; fail=1; }

echo; echo "PART 2: the full kits, rebuilt from their committed copies in $SCR"
for spec in D1:dataqc D2:mlcore D3:facies D4:forecastml D5:appliedai H1:safetystats H3:lopa H4:consequence H5:qra SC2:procurement EC7:pia EC8:gsa EC9:joa EC10:farmout EC11:prms SC3:materials; do
  P=${spec%%:*}; W=${spec#*:}; src="$NG/tools/course-waves/$W"; dst="$SCR/$W"; cp -rp "$src" "$dst"
  export ${P}_WAVE_DIR="$dst" ${P}_ENGINES="$ENG" ${P}_REPO="$NG" ${P}_TOLERANCE="$NG/src/components/course/panels/$W/gradedTolerance.js"
  if (cd "$dst" && sh ./build_digest.sh > digest.tmp 2> digest.err && mv digest.tmp digest.txt && node ./make_fields.mjs > fields.log 2>&1); then
    for f in digest.txt fields.json precision.json; do
      cmp -s "$src/$f" "$dst/$f" && v=IDENTICAL || { v=DIFFERS; fail=1; }
      printf '%-4s %-12s %-15s %s  sha256 %s\n' "$P" "$W" "$f" "$v" "$(sha256sum "$dst/$f" | cut -c1-16)"
    done
    for f in digest.txt fields.json; do [ "$(pin $W $f)" = "$(sha256sum "$dst/$f" | cut -d' ' -f1)" ] || { echo "$P $W $f DOES NOT MATCH its pin"; fail=1; }; done
  else echo "$P $W: rebuild FAILED"; tail -n 3 "$dst/digest.err" "$dst/fields.log"; fail=1; fi
  unset ${P}_WAVE_DIR ${P}_ENGINES ${P}_REPO ${P}_TOLERANCE
done

echo; echo "PART 3: the economics courses on cashflow.ts and lib/stats"
for W in cashflow fiscal; do
  src="$NG/tools/course-waves/$W"; dst="$SCR/$W"; cp -rp "$src" "$dst"
  if [ $W = cashflow ]; then
    (cd "$dst" && EC1_WAVE_DIR="$dst" EC1_ENGINES="$ENG" EC1_REPO="$NG" sh ./build_digest.sh > digest.tmp 2>digest.err && mv digest.tmp digest.txt && EC1_WAVE_DIR="$dst" EC1_ENGINES="$ENG" node ./ec1_fields.mjs > fields.log 2>&1) || { echo "$W FAILED"; fail=1; continue; }
  else
    (cd "$dst" && EC2_WAVE_DIR="$dst" EC2_ENGINES="$ENG" EC2_REPO="$NG" sh ./build_digest.sh > digest.tmp 2>digest.err && mv digest.tmp digest.txt && EC2_WAVE_DIR="$dst" EC2_ENGINES="$ENG" EC2_REPO="$NG" node ./ec2_fields.mjs --json > fields.log 2>&1) || { echo "$W FAILED"; fail=1; continue; }
  fi
  for f in digest.txt fields.json; do
    cmp -s "$src/$f" "$dst/$f" && v=IDENTICAL || { v=DIFFERS; fail=1; }
    [ "$(pin $W $f)" = "$(sha256sum "$dst/$f" | cut -d' ' -f1)" ] && pv="matches its pin" || { pv="DOES NOT MATCH its pin"; fail=1; }
    printf '%-4s %-12s %-15s %s, %s\n' EC $W $f "$v" "$pv"
  done
done
src="$NG/tools/course-waves/fdp"; dst="$SCR/fdp"; cp -rp "$src" "$dst"
if (cd "$dst" && env TZ=UTC LC_ALL=C EC6_ENGINES="$ENG" node ./ec6_dump.mjs > digest.tmp 2> digest.err && mv digest.tmp digest.txt); then
  cmp -s "$src/digest.txt" "$dst/digest.txt" && v=IDENTICAL || { v=DIFFERS; fail=1; }
  [ "$(pin fdp digest.txt)" = "$(sha256sum "$dst/digest.txt" | cut -d' ' -f1)" ] && pv="matches its pin" || { pv="DOES NOT MATCH its pin"; fail=1; }
  printf '%-4s %-12s %-15s %s, %s\n' EC6 fdp digest.txt "$v" "$pv"
else echo "EC6 fdp: digest FAILED"; tail -n 3 "$dst/digest.err"; fail=1; fi
for spec in EC4:decision:ec4 EC5:portfolio:ec5; do
  P=${spec%%:*}; rest=${spec#*:}; W=${rest%%:*}; e=${rest#*:}
  src="$NG/tools/course-waves/$W"; dst="$SCR/$W"; cp -rp "$src" "$dst"
  (cd "$dst" && env TZ=UTC LC_ALL=C ${P}_ENGINES="$ENG" node "./${e}_dump.mjs" > digest.tmp 2> digest.err && mv digest.tmp digest.txt) || { echo "$W: digest FAILED"; tail -n 3 "$dst/digest.err"; fail=1; continue; }
  printf "const m = await import('%s/%s_fields.mjs');\nprocess.stdout.write(JSON.stringify(m.FIELDS, null, 1) + '\\\\n');\n" "$dst" "$e" > "$dst/fields_probe.mjs"
  (cd "$dst" && env ${P}_ENGINES="$ENG" node ./fields_probe.mjs > fields.json 2> fields.err) || { echo "$W: fields FAILED"; tail -n 3 "$dst/fields.err"; fail=1; continue; }
  for f in digest.txt fields.json; do
    cmp -s "$src/$f" "$dst/$f" && v=IDENTICAL || { v=DIFFERS; fail=1; }
    [ "$(pin $W $f)" = "$(sha256sum "$dst/$f" | cut -d' ' -f1)" ] && pv="matches its pin" || { pv="DOES NOT MATCH its pin"; fail=1; }
    printf '%-4s %-10s %-11s %s, %s\n' "$P" "$W" "$f" "$v" "$pv"
  done
done
echo; echo "PART 4: the SC5 contracts practice kit (no engine), rebuilt from its committed copy"
src="$NG/tools/course-waves/contracts"; dst="$SCR/contracts"; cp -rp "$src" "$dst"
if (cd "$dst" && SC5_WAVE_DIR="$dst" python3 ./build_pack.py > pack.log 2>&1); then
  for f in PACK.md passages.json sources/SOURCES.json; do
    cmp -s "$src/$f" "$dst/$f" && v=IDENTICAL || { v=DIFFERS; fail=1; }
    [ "$(pin contracts $f)" = "$(sha256sum "$dst/$f" | cut -d' ' -f1)" ] && pv="matches its pin" || { pv="DOES NOT MATCH its pin"; fail=1; }
    printf '%-4s %-12s %-20s %s, %s\n' SC5 contracts "$f" "$v" "$pv"
  done
else echo "SC5 contracts: pack rebuild FAILED"; tail -n 3 "$dst/pack.log"; fail=1; fi

[ $fail = 0 ] && echo "PRIOR COURSES UNCHANGED: packages/engines differs from $BASE only by the ten sc4-marine-course paths (sha-identical to $REV) and their ledger entries, with the shared runtime paths byte-identical; D1 to D5, H1, H3, H4, H5, SC2, EC7, EC8, EC9, EC10, EC11 and SC3 digests, fields and precision rebuild byte-identical; cashflow, fiscal, fdp (digest), decision and portfolio rebuild byte-identical and match their pins; the SC5 contracts pack rebuilds byte-identical and matches its pins" || { echo "PRIOR COURSES: A DIFFERENCE"; exit 1; }
