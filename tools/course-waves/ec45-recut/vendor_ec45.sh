#!/usr/bin/env bash
# RE-VENDOR THE EC4 (decision) AND EC5 (portfolio) ENGINES AT petrolord-engines
# origin/main, SHA-IDENTICAL, AND COLLAPSE-READY THE EC10 FARMOUT ROOT.
#
# WHAT MOVES. The canonical NextGen paths of the EC4 and EC5 engines, held at
# older blobs by VENDOR.json group "4-economics-revendor" ("pull only with the
# recut"), with their suites, goldens, oracles and FINDINGS (group
# "6-test-layer-drift"): decisionTree.js, voi.js, portfolio.js, afe.js. At
# origin/main every one of these equals the canonical pin 54cf7c4 blob, so
# their ledger entries are REMOVED (the paths are clean against the pin).
# The farmout.js closure (EC10, today in its own root ec10-farmout/) and the
# newer jointVenture.js closure it needs (engines #274, the simple uplift) land
# on their canonical paths; both are new since the pin, so they are ledgered as
# kind "extra" / "differing" in group "ec45-decision-portfolio-recut".
#
# WHAT DOES NOT MOVE. The rest of group 4 (montecarlo.ts, screening.js,
# fdp/*): they carry the EC3 and EC6 courses and MD2 refinery, not EC4/EC5.
# The pin stays at 54cf7c4 (repo convention).
#
# Four proofs per path (git blob, sha256, cmp, bytes), and every path of the
# runtime closure walked from the five jest suites must be identical to REV.
set -euo pipefail
ENG=/root/petrolord-engines
NG=${NG:-/root/wt-ec45-recut}
REV=${REV:-origin/main}
FULL=$(git -C "$ENG" rev-parse "$REV^{commit}")
V="$NG/packages/engines"
EXP=$(mktemp -d); LEDGER_PY=$(mktemp)
trap 'rm -rf "$EXP" "$LEDGER_PY"' EXIT
git -C "$ENG" archive "$FULL" | tar -x -C "$EXP"
PIN=$(python3 -c "import json,sys;print(json.load(open(sys.argv[1]))['canonical']['commit'])" "$V/VENDOR.json")
echo "PIN ${PIN:0:7} (unchanged), VENDORING FROM ${FULL:0:7}"

PATHS=$(cat <<'P'
engines/economics/decisionTree.js
engines/economics/voi.js
engines/economics/portfolio.js
engines/economics/afe.js
engines/economics/jointVenture.js
engines/economics/farmout.js
__tests__/economics.decision.test.js
__tests__/economics.portfolio.test.js
__tests__/economics.afe.test.js
__tests__/economics.jointVenture.test.js
__tests__/economics.farmout.test.js
test-data/economics/goldens/decision_cases.json
test-data/economics/goldens/portfolio_cases.json
test-data/economics/goldens/afe_cases.json
test-data/economics/goldens/jointventure_cases.json
test-data/economics/goldens/farmout_cases.json
test-data/economics/ekene-farmout/README.md
test-data/economics/ekene-farmout/ekene-farmout.json
tools/validation/economics/FINDINGS-decision.md
tools/validation/economics/FINDINGS-jointVenture.md
tools/validation/economics/FINDINGS-farmout.md
tools/validation/economics/oracle_decision.py
tools/validation/economics/oracle_portfolio.py
tools/validation/economics/oracle_afe.py
tools/validation/economics/oracle_jointventure.py
tools/validation/economics/oracle_farmout.py
tools/validation/economics/negcontrol_jointventure.sh
tools/validation/economics/negcontrol_farmout.sh
tools/validation/economics/make_farmout_fixtures.py
tools/validation/economics/timing_farmout.js
P
)
N=$(printf '%s\n' "$PATHS" | grep -c .)
printf '%s\n' "$PATHS" | while read -r p; do
  [ -f "$EXP/$p" ] || { echo "REFUSES: $p not in the tree at ${FULL:0:7}"; exit 1; }
  mkdir -p "$(dirname "$V/$p")"
  git -C "$ENG" cat-file blob "$FULL:$p" > "$V/$p"
  if [ -x "$EXP/$p" ]; then chmod 755 "$V/$p"; else chmod 644 "$V/$p"; fi
done

echo "SHA-IDENTITY, four proofs per path:"
printf '%s\n' "$PATHS" | while read -r p; do
  a="$EXP/$p"; b="$V/$p"
  ba=$(git -C "$ENG" rev-parse "$FULL:$p"); bb=$(git hash-object "$b")
  v=IDENTICAL
  [ "$ba" = "$bb" ] || v=DEVIATES
  [ "$(sha256sum < "$a")" = "$(sha256sum < "$b")" ] || v=DEVIATES
  cmp -s "$a" "$b" || v=DEVIATES
  [ "$(wc -c < "$a")" = "$(wc -c < "$b")" ] || v=DEVIATES
  pinb=$(git -C "$ENG" rev-parse "$PIN:$p" 2>/dev/null || echo absent)
  printf '  %-58s %s %s  pin:%s\n' "$p" "${ba:0:10}" "$v" "$([ "$pinb" = "$ba" ] && echo same || { [ "$pinb" = absent ] && echo absent || echo differs; })"
  [ $v = IDENTICAL ] || exit 1
done
echo "  $N paths x 4 checks, all IDENTICAL against ${FULL:0:7}"

echo "RUNTIME CLOSURE, walked from the five suites over an export of ${FULL:0:7}:"
declare -A SEEN=(); QUEUE=(__tests__/economics.decision.test.js __tests__/economics.portfolio.test.js __tests__/economics.afe.test.js __tests__/economics.jointVenture.test.js __tests__/economics.farmout.test.js)
for s in "${QUEUE[@]}"; do SEEN[$s]=1; done
while [ ${#QUEUE[@]} -gt 0 ]; do
  cur="${QUEUE[0]}"; QUEUE=("${QUEUE[@]:1}"); dir=$(dirname "$cur")
  while read -r spec; do
    case "$spec" in ./*|../*) ;; *) continue ;; esac
    for cand in "$spec" "$spec.js" "$spec.ts"; do
      res=$(cd "$EXP/$dir" && realpath -m --relative-to="$EXP" "$cand")
      if [ -f "$EXP/$res" ]; then [ -z "${SEEN[$res]+x}" ] && { SEEN[$res]=1; QUEUE+=("$res"); }; break; fi
    done
  done < <(grep -oE "(from|import|require\()\s*['\"][^'\"]+['\"]" "$EXP/$cur" | grep -oE "['\"][^'\"]+['\"]" | tr -d "'\"")
done
bad=0
for p in $(printf '%s\n' "${!SEEN[@]}" | sort); do
  a=$(git -C "$ENG" rev-parse "$FULL:$p"); b=$(git hash-object "$V/$p" 2>/dev/null || echo absent)
  printf '  %-50s %s\n' "$p" "$([ "$a" = "$b" ] && echo identical || echo DIFFERS)"; [ "$a" = "$b" ] || bad=1
done
[ $bad = 0 ] || { echo "REFUSES: a runtime closure path differs from ${FULL:0:7}"; exit 1; }

cat > "$LEDGER_PY" <<'PY'
import json, subprocess, sys
vj, eng, pin, full = sys.argv[1:5]
paths = [l for l in sys.stdin.read().split('\n') if l]
GROUP = 'ec45-decision-portfolio-recut'
v = json.load(open(vj))
def blob(rev, p):
    r = subprocess.run(['git', '-C', eng, 'rev-parse', f'{rev}:{p}'], capture_output=True, text=True)
    return r.stdout.strip() if r.returncode == 0 else None
keep, removed, added = [], [], []
for e in v['knownDeviations']:
    if e['path'] in paths or e.get('group') == GROUP:
        removed.append(f"{e.get('group')}:{e['path']}")
    else:
        keep.append(e)
for p in paths:
    b, pb = blob(full, p), blob(pin, p)
    if b == pb:
        continue
    added.append({'path': p, 'kind': 'extra' if pb is None else 'differing', 'group': GROUP, 'vendoredSha': b,
        'reason': (f"EC4/EC5 decision and portfolio recut: vendored sha-identical from petrolord-engines {full[:7]} "
                   f"by tools/course-waves/ec45-recut/vendor_ec45.sh (4 proofs per path). New since the canonical pin "
                   f"{pin[:7]}, which stays: the farmout.js closure (EC10) and the jointVenture.js closure it needs "
                   f"(engines #274 simple uplift) now sit on their canonical paths, byte-identical to the "
                   f"ec10-farmout/ root copies, so that root collapses. Clears as STALE when the pin moves to {full[:7]} or later.")})
v['knownDeviations'] = keep + added
open(vj, 'w').write(json.dumps(v, indent=2, ensure_ascii=False) + '\n')
print(f'  VENDOR.json: pin {pin[:7]} unchanged; {len(removed)} entr(ies) removed, {len(added)} added as {GROUP}')
for r in removed: print('    removed', r)
PY
printf '%s\n' "$PATHS" | python3 "$LEDGER_PY" "$V/VENDOR.json" "$ENG" "$PIN" "$FULL"
printf '%s\n' "$PATHS" | sed 's|^|packages/engines/|' | xargs git -C "$NG" add -- packages/engines/VENDOR.json
cd "$NG" && node tools/check-vendored-engines.mjs --canonical "$ENG" --quiet && echo "check-vendored-engines: clean"
