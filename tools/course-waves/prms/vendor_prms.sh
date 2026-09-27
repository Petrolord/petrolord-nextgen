#!/usr/bin/env bash
# VENDOR THE EC11 PRMS CLOSURE (engines/economics/prms.js) INTO NEXTGEN,
# SHA-IDENTICAL, AND PROVE IT. Adapted from EC8's vendor_gsa.sh.
#
# The closure is WALKED FROM THE JEST SUITE AS THE ONLY SEED over a git-archive
# export of the commit (never a working tree). The suite reads its golden and
# the ekene-prms fixture through a spread `read(...)` helper the walker cannot
# parse, so those, the fixture README, the fixture writer, the oracle, the
# timing script and the negative control are NAMED with the reason they
# travel. FINDINGS-prms.md is not in the engines tree at bb8ef5f (the lead
# commits it separately); the course's sources table is printed in the digest.
#
# prms.js imports engines/economics/cashflow.ts (computeCashFlow, applyJV),
# lib/stats/stats.js (the canonical Monte Carlo) and
# lib/conventions/percentile.js; cashflow.ts walks on to
# engines/economics/irrContract.js.
#
# CANONICAL PATHS, NO PRIVATE ROOT. Every runtime file of the closure other than
# prms.js is ALREADY vendored in NextGen at the very blob engines bb8ef5f
# carries (proved below, four proofs per path, and against the
# fix/decision-portfolio-recut branch too, which moves the shared economics
# files: the same four blobs there). So prms.js goes to its canonical path
# engines/economics/prms.js and nothing shared moves. When that recut merges,
# re-run this script on the rebased branch: it refuses if any shared blob moved.
#
# LEDGER MODE: THE PIN DOES NOT MOVE. New paths are ledgered as kind "extra",
# group "ec11-prms-course", pinned to the vendored blob, and clear by the
# guard's own STALE rule when the pin moves to bb8ef5f or later.
#
# Four proofs per path: git blob hash, sha256, cmp, byte count.
set -euo pipefail
ENG=/root/petrolord-engines
NG=${NG:-/root/wt-ec11-nextgen}
RECUT=${RECUT:-origin/fix/decision-portfolio-recut}
PIN=$(python3 -c "import json,sys;print(json.load(open(sys.argv[1]))['canonical']['commit'])" "$NG/packages/engines/VENDOR.json")
# Vendored at bb8ef5f (engines PR #278, prms.js and its validation kit).
REV=${REV:-bb8ef5f}
FULL=$(git -C "$ENG" rev-parse "$REV^{commit}")
EXP=$(mktemp -d)
LEDGER_PY=$(mktemp)
trap 'rm -rf "$EXP" "$LEDGER_PY"' EXIT
git -C "$ENG" archive "$FULL" | tar -x -C "$EXP"

# Shared runtime paths: each must already be vendored at the SAME blob (never moved here).
SHAREDLIST="engines/economics/cashflow.ts engines/economics/irrContract.js lib/stats/stats.js lib/conventions/percentile.js"
declare -A SHARED=()

echo "PIN ${PIN:0:7}, VENDORING FROM ${FULL:0:7}"
echo
cd "$EXP"
SEED=__tests__/economics.prms.test.js
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
  "test-data/economics/goldens/prms_cases.json:read at runtime by the suite through read('test-data','economics','goldens',...)" \
  "test-data/economics/ekene-prms/ekene-prms.json:read at runtime by the suite; the course dataset (the Ekene field reserves and resources, synthetic)" \
  "test-data/economics/ekene-prms/README.md:the fixture record (synthetic, the eight projects and the stated cases)" \
  "tools/validation/economics/make_prms_fixtures.py:writes the ekene-prms fixture" \
  "tools/validation/economics/oracle_prms.py:writes the golden the suite reads" \
  "tools/validation/economics/timing_prms.js:times aggregate against its work cap" \
  "tools/validation/economics/negcontrol_prms.sh:the negative control over the suite (34 engine plants, 6 oracle plants)"; do
  p="${extra%%:*}"; why="${extra#*:}"
  [ -f "$EXP/$p" ] || { echo "REFUSES: named closure member $p is not in the tree at ${FULL:0:7}"; exit 1; }
  [ -z "${CLOSURE[$p]+x}" ] && CLOSURE[$p]="NAMED, not walked: $why"
done

PATHS=$(printf '%s\n' "${!CLOSURE[@]}" | sort)
N=$(printf '%s\n' "$PATHS" | grep -c .)
echo "  closure size: $N paths ($WALKED walked, $((N - WALKED)) named)"
printf '%s\n' "$PATHS" | while read -r p; do printf '    %-58s %s\n' "$p" "${CLOSURE[$p]}"; done
echo
SC_ALL=$(git -C "$ENG" ls-tree -r --name-only "$FULL" | grep -iE 'prms' | sort)
MISSED=$(comm -23 <(printf '%s\n' "$SC_ALL") <(printf '%s\n' "$PATHS") || true)
if [ -n "$MISSED" ]; then echo "REFUSES: prms paths in ${FULL:0:7} outside the closure: $MISSED"; exit 1; fi
echo "  every prms path at ${FULL:0:7} is in the closure"
echo

echo "SHARED RUNTIME PATHS: already vendored at the bb8ef5f blob in NextGen main AND on $RECUT (nothing moves):"
for p in $SHAREDLIST; do
  [ -n "${CLOSURE[$p]+x}" ] || { echo "REFUSES: shared path $p is not in the closure"; exit 1; }
  blobE=$(git -C "$ENG" rev-parse "$FULL:$p"); blobN=$(git hash-object "$NG/packages/engines/$p")
  blobR=$(git -C "$NG" rev-parse "$RECUT:packages/engines/$p" 2>/dev/null || echo absent)
  shaE=$(sha256sum "$EXP/$p" | cut -c1-16); shaN=$(sha256sum "$NG/packages/engines/$p" | cut -c1-16)
  printf '  %-36s engines %s  NextGen %s  recut %s  sha256 %s/%s\n' "$p" "${blobE:0:10}" "${blobN:0:10}" "${blobR:0:10}" "$shaE" "$shaN"
  [ "$blobE" = "$blobN" ] && [ "$shaE" = "$shaN" ] && cmp -s "$EXP/$p" "$NG/packages/engines/$p" || { echo "REFUSES: $p differs from engines ${FULL:0:7} in NextGen"; exit 1; }
  [ "$blobE" = "$blobR" ] || { echo "REFUSES: $p differs on $RECUT: rebase and re-prove"; exit 1; }
done
echo

echo "WHAT MOVES against NextGen, closure paths only:"
printf '%s\n' "$PATHS" | while read -r p; do
  b="$NG/packages/engines/$p"
  if [ -n "${SHARED[$p]+x}" ]; then continue; fi
  if [ -f "$b" ]; then
    if [ "$(git hash-object "$b")" != "$(git -C "$ENG" rev-parse "$FULL:$p")" ]; then
      # A path this wave already ledgered (group ec11-prms-course) may move
      # on a re-vendor; any other differing path refuses.
      if python3 -c "import json,sys;v=json.load(open(sys.argv[1]));sys.exit(0 if any(e['path']==sys.argv[2] and e.get('group')=='ec11-prms-course' for e in v['knownDeviations']) else 1)" "$NG/packages/engines/VENDOR.json" "$p"; then
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
GROUP = 'ec11-prms-course'
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
        'reason': (f"EC11 prms course: vendored sha-identical from petrolord-engines {full[:7]} "
                   f"(PR #278: engines/economics/prms.js, its jest suite, golden, the ekene-prms fixture and its writer, oracle, "
                   f"timing script, negative control) by the wave's vendor_prms.sh, 4 proofs per path; its runtime imports "
                   f"(cashflow.ts, irrContract.js, lib/stats, lib/conventions/percentile.js) were already vendored at the same blobs. "
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
printf '%s\n' "$PATHS" | sed 's|^|packages/engines/|' | xargs git -C "$NG" add -- packages/engines/VENDOR.json
cd "$NG" && node tools/check-vendored-engines.mjs --canonical "$ENG"
echo
echo "THE VENDORED SUITE AGAINST NEXTGEN'S OWN SHARED COPIES:"
cd "$NG/packages/engines" && npx jest __tests__/economics.prms.test.js 2>&1 | grep -E "^Tests:|^Test Suites:"
