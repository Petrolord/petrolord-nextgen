#!/usr/bin/env bash
# VENDOR THE EC8 GSA CLOSURE (engines/economics/gasContract.js) INTO NEXTGEN,
# SHA-IDENTICAL, AND PROVE IT. Adapted from SC2's vendor_procurement.sh.
#
# The closure is WALKED FROM THE JEST SUITE AS THE ONLY SEED over a git-archive
# export of the commit (never a working tree). The suite reads its golden and
# the two ekene-gsa fixtures through a spread `read(...)` helper the walker
# cannot parse, so those, the fixture README, the fixture writer, the oracle,
# the timing script, FINDINGS and the negative control are NAMED with the
# reason they travel.
#
# gasContract.js imports engines/economics/cashflow.ts (npv,
# deriveGasRoyaltyRate, calendarDays), and cashflow.ts walks on to
# engines/economics/irrContract.js and lib/dates/dates.js.
#
# SHARED PATHS STAY WITH THEIR OWNERS. cashflow.ts is owned by the economics
# courses (the EC7 PIA re-cut brought NextGen's copy to the 006ed85 blob). It
# is NOT moved by this wave: the three functions gasContract.js calls (and the
# isLeapYear calendarDays reads) are cut out of both copies by their exported
# text and must be SOURCE-IDENTICAL, the whole-file blobs are compared and
# printed, and the gasContract suite is then run against NextGen's own copy
# and must pass every test.
#
# LEDGER MODE: THE PIN DOES NOT MOVE. New paths are ledgered as kind "extra",
# group "ec8-gsa-course", pinned to the vendored blob, and clear by the
# guard's own STALE rule when the pin moves to d745b88 or later.
#
# Four proofs per path: git blob hash, sha256, cmp, byte count.
set -euo pipefail
ENG=/root/petrolord-engines
NG=${NG:-/root/wt-ec8-nextgen}
PIN=$(python3 -c "import json,sys;print(json.load(open(sys.argv[1]))['canonical']['commit'])" "$NG/packages/engines/VENDOR.json")
# Vendored at d745b88 (engines PR #267, gasContract.js and its validation kit).
REV=${REV:-d745b88}
FULL=$(git -C "$ENG" rev-parse "$REV^{commit}")
EXP=$(mktemp -d)
LEDGER_PY=$(mktemp)
trap 'rm -rf "$EXP" "$LEDGER_PY"' EXIT
git -C "$ENG" archive "$FULL" | tar -x -C "$EXP"

# Shared paths kept at NextGen's blob, with the functions gasContract.js calls in each.
declare -A SHARED=(
  [engines/economics/cashflow.ts]='export function npv|export function deriveGasRoyaltyRate|export const calendarDays|const isLeapYear'
)

echo "PIN ${PIN:0:7}, VENDORING FROM ${FULL:0:7}"
echo
cd "$EXP"
SEED=__tests__/economics.gasContract.test.js
echo "CLOSURE WALK over an export of ${FULL:0:7}, seed: $SEED"
declare -A CLOSURE=()
declare -a QUEUE=("$SEED")
CLOSURE[$SEED]="the jest suite, the seed"
while [ ${#QUEUE[@]} -gt 0 ]; do
  cur="${QUEUE[0]}"; QUEUE=("${QUEUE[@]:1}")
  dir=$(dirname "$cur")
  while read -r spec; do
    [ -z "$spec" ] && continue
    case "$spec" in ./*|../*) ;; *) continue ;; esac
    for cand in "$spec" "$spec.js" "$spec.ts" "$spec.mjs" "$spec.cjs" "$spec/index.js"; do
      res=$(cd "$dir" && realpath -m --relative-to="$EXP" "$cand" 2>/dev/null || true)
      if [ -n "$res" ] && [ -f "$EXP/$res" ]; then
        if [ -z "${CLOSURE[$res]+x}" ]; then CLOSURE[$res]="imported by $cur"; QUEUE+=("$res"); fi
        break
      fi
    done
  done < <(grep -oE "(from|require\()\s*['\"][^'\"]+['\"]" "$cur" | grep -oE "['\"][^'\"]+['\"]" | tr -d "'\"")
done
WALKED=${#CLOSURE[@]}

for extra in \
  "test-data/economics/goldens/gascontract_cases.json:read at runtime by the suite through read('test-data','economics','goldens',...)" \
  "test-data/economics/ekene-gsa/domestic-power.json:read at runtime by the suite; the course dataset (the Ekene Power Plant GSA, synthetic)" \
  "test-data/economics/ekene-gsa/export-feed.json:read at runtime by the suite; the course dataset (the Ekene Export Feed Buyer GSA, synthetic)" \
  "test-data/economics/ekene-gsa/README.md:the fixture record (synthetic, planted situations)" \
  "tools/validation/economics/make_gsa_fixtures.py:writes the ekene-gsa fixtures" \
  "tools/validation/economics/oracle_gascontract.py:writes the golden the suite reads" \
  "tools/validation/economics/timing_gascontract.js:produced the timings table FINDINGS carries" \
  "tools/validation/economics/FINDINGS-gasContract.md:the validation record the engine header cites (sources, editions, read dates)" \
  "tools/validation/economics/negcontrol_gascontract.sh:produced the negative-control table FINDINGS carries"; do
  p="${extra%%:*}"; why="${extra#*:}"
  [ -f "$EXP/$p" ] || { echo "REFUSES: named closure member $p is not in the tree at ${FULL:0:7}"; exit 1; }
  [ -z "${CLOSURE[$p]+x}" ] && CLOSURE[$p]="NAMED, not walked: $why"
done

PATHS=$(printf '%s\n' "${!CLOSURE[@]}" | sort)
N=$(printf '%s\n' "$PATHS" | grep -c .)
echo "  closure size: $N paths ($WALKED walked, $((N - WALKED)) named)"
printf '%s\n' "$PATHS" | while read -r p; do printf '    %-58s %s\n' "$p" "${CLOSURE[$p]}"; done
echo
SC_ALL=$(git -C "$ENG" ls-tree -r --name-only "$FULL" | grep -iE 'gascontract|ekene-gsa|gsa_fixtures' | sort)
MISSED=$(comm -23 <(printf '%s\n' "$SC_ALL") <(printf '%s\n' "$PATHS") || true)
if [ -n "$MISSED" ]; then echo "REFUSES: gasContract paths in ${FULL:0:7} outside the closure: $MISSED"; exit 1; fi
echo "  every gasContract path at ${FULL:0:7} is in the closure"
echo

echo "SHARED PATHS LEFT WITH THEIR OWNERS (each function gasContract.js calls compared by its exported text):"
for p in "${!SHARED[@]}"; do
  [ -n "${CLOSURE[$p]+x}" ] || { echo "REFUSES: shared path $p is not in the closure"; exit 1; }
  blobE=$(git -C "$ENG" rev-parse "$FULL:$p"); blobN=$(git hash-object "$NG/packages/engines/$p")
  printf '  %s: file %s at %s, %s in NextGen (%s)\n' "$p" "${blobE:0:10}" "${FULL:0:7}" "${blobN:0:10}" "$([ "$blobE" = "$blobN" ] && echo 'the same blob' || echo KEPT)"
  IFS='|' read -r -a SIGS <<< "${SHARED[$p]}"
  for sig in "${SIGS[@]}"; do
    # a declaration runs to the first line that is '}' alone, or is the one line when it ends with ';'
    cutfn() { awk -v s="$sig" 'index($0,s)==1{f=1} f{print} f&&($0~/^}/||(n==0&&$0~/;$/)){exit} f{n++}' "$1"; }
    a=$(cutfn "$EXP/$p" | sha256sum | cut -c1-16); b=$(cutfn "$NG/packages/engines/$p" | sha256sum | cut -c1-16)
    n=$(cutfn "$EXP/$p" | wc -l)
    [ "$n" -ge 1 ] && [ "$(cutfn "$EXP/$p" | head -c 1 | wc -c)" -eq 1 ] || { echo "REFUSES: could not cut '$sig' out of $p"; exit 1; }
    [ "$a" = "$b" ] || { echo "REFUSES: $p: '$sig' differs between ${FULL:0:7} and NextGen"; exit 1; }
    printf '    %-42s %2d lines, sha256 %s at %s and in NextGen\n' "$sig" "$n" "$a" "${FULL:0:7}"
  done
done
echo

echo "WHAT MOVES against NextGen, closure paths only:"
printf '%s\n' "$PATHS" | while read -r p; do
  b="$NG/packages/engines/$p"
  if [ -n "${SHARED[$p]+x}" ]; then continue; fi
  if [ -f "$b" ]; then
    if [ "$(git hash-object "$b")" != "$(git -C "$ENG" rev-parse "$FULL:$p")" ]; then
      # A path this wave already ledgered (group ec8-gsa-course) may move
      # on a re-vendor; any other differing path refuses.
      if python3 -c "import json,sys;v=json.load(open(sys.argv[1]));sys.exit(0 if any(e['path']==sys.argv[2] and e.get('group')=='ec8-gsa-course' for e in v['knownDeviations']) else 1)" "$NG/packages/engines/VENDOR.json" "$p"; then
        echo "  MOVES    $p (this wave's own ledgered path)"
      else
        echo "REFUSES: $p is already vendored at a different blob and is not a declared shared path"; exit 1
      fi
    else
      echo "  same     $p"
    fi
  else
    echo "  NEW      $p"
  fi
done
echo

printf '%s\n' "$PATHS" | while read -r p; do
  [ -n "${SHARED[$p]+x}" ] && continue
  mkdir -p "$NG/packages/engines/$(dirname "$p")"
  git -C "$ENG" cat-file blob "$FULL:$p" > "$NG/packages/engines/$p"
  if [ -x "$EXP/$p" ]; then chmod 755 "$NG/packages/engines/$p"; fi
done

echo "SHA-IDENTITY, four independent proofs per path:"
printf '%-58s %-5s %-7s %-4s %-14s %s\n' PATH blob sha256 cmp bytes VERDICT
printf '%s\n' "$PATHS" | while read -r p; do
  [ -n "${SHARED[$p]+x}" ] && continue
  a="$EXP/$p"; b="$NG/packages/engines/$p"
  ba=$(git -C "$ENG" rev-parse "$FULL:$p"); bb=$(git hash-object "$b")
  sa=$(sha256sum "$a" | cut -d' ' -f1); sb=$(sha256sum "$b" | cut -d' ' -f1)
  ca=$(wc -c < "$a"); cb=$(wc -c < "$b")
  v1=$([ "$ba" = "$bb" ] && echo yes || echo NO); v2=$([ "$sa" = "$sb" ] && echo yes || echo NO)
  v3=$(cmp -s "$a" "$b" && echo yes || echo NO); v4=$([ "$ca" = "$cb" ] && echo yes || echo NO)
  verdict=IDENTICAL
  for v in "$v1" "$v2" "$v3" "$v4"; do [ "$v" = NO ] && verdict=DEVIATES; done
  printf '%-58s %-5s %-7s %-4s %-14s %s\n' "$p" "$v1" "$v2" "$v3" "$ca/$cb" "$verdict"
  [ "$verdict" = IDENTICAL ] || exit 1
done
NV=$((N - ${#SHARED[@]}))
echo
echo "$NV paths x 4 checks = $((NV*4)) proofs, all IDENTICAL against engines ${FULL:0:7}; ${#SHARED[@]} shared paths kept at NextGen's blob"

cat > "$LEDGER_PY" <<'PY'
import json, subprocess, sys
vj, man, ng, full, shared = sys.argv[1:6]
shared = set(shared.split(','))
paths = [l for l in sys.stdin.read().split('\n') if l and l not in shared]
GROUP = 'ec8-gsa-course'
canon = {}
for line in open(man):
    if line.startswith('#') or not line.strip():
        continue
    sha, p = line.rstrip('\n').split(' ', 1)
    canon[p] = sha
v = json.load(open(vj))
pin = v['canonical']['commit']
devs = v['knownDeviations']
def blob_of(p):
    return subprocess.check_output(['git', 'hash-object', f'{ng}/packages/engines/{p}'], text=True).strip()
owned = {e['path'] for e in devs if e['path'] in paths and e.get('group') != GROUP and e.get('vendoredSha') == blob_of(e['path'])}
foreign = [e['path'] for e in devs if e['path'] in paths and e.get('group') != GROUP and e['path'] not in owned]
if foreign:
    sys.exit(f'REFUSES: closure paths ledgered by another group at another blob: {foreign}')
keep = [e for e in devs if not (e['path'] in paths and e.get('group') == GROUP)]
added = []
same = 0
for p in paths:
    if p in owned:
        continue
    blob = blob_of(p)
    if p in canon and canon[p] == blob:
        same += 1
        continue
    kind = 'differing' if p in canon else 'extra'
    added.append({
        'path': p, 'kind': kind, 'group': GROUP, 'vendoredSha': blob,
        'reason': (f"EC8 gsa course: vendored sha-identical from petrolord-engines {full[:7]} "
                   f"(PR #267: engines/economics/gasContract.js, its jest suite, golden, the ekene-gsa fixtures and their writer, oracle, "
                   f"timing script, FINDINGS, negative control) by the wave's vendor_procurement.sh, 4 proofs per path. "
                   f"{'New since' if kind == 'extra' else 'Differing from'} the canonical pin {pin[:7]}, which stays: moving it "
                   f"would also move paths other courses grade. "
                   f"Clears as STALE when the pin moves to {full[:7]} or later."),
    })
v['knownDeviations'] = keep + added
open(vj, 'w').write(json.dumps(v, indent=2, ensure_ascii=False) + '\n')
print(f'  VENDOR.json: pin {pin[:7]} unchanged; {same} closure path(s) already match the manifest; group {GROUP}: {len(added)} path(s) ledgered; left with their owner group at the same blob: {sorted(owned)}; shared, kept at NextGen blob: {sorted(shared)}')
for e in added:
    print(f"    {e['kind']:<9} {e['path']}  {e['vendoredSha'][:12]}")
PY
SHARED_CSV=$(IFS=,; echo "${!SHARED[*]}")
printf '%s\n' "$PATHS" | python3 "$LEDGER_PY" "$NG/packages/engines/VENDOR.json" "$NG/packages/engines/VENDOR.manifest" "$NG" "$FULL" "$SHARED_CSV"
echo
# the guard reads the tracked tree, so the vendored paths are staged BY PATH first
printf '%s\n' "$PATHS" | grep -vxF -e engines/economics/cashflow.ts | sed 's|^|packages/engines/|' | xargs git -C "$NG" add -- packages/engines/VENDOR.json
cd "$NG" && node tools/check-vendored-engines.mjs --canonical "$ENG"
echo
echo "THE VENDORED SUITE AGAINST NEXTGEN'S OWN SHARED COPIES:"
cd "$NG/packages/engines" && npx jest __tests__/economics.gasContract.test.js 2>&1 | grep -E "^Tests:|^Test Suites:"
