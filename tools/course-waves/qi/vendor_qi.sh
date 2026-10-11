#!/usr/bin/env bash
# VENDOR THE QI CLOSURE INTO NEXTGEN, SHA-IDENTICAL, AND PROVE IT. Adapted from
# SC4's vendor_marine.sh (same walk, same four proofs, same ledger rule).
#
# The closure is WALKED FROM THE JEST SUITES AS SEEDS over a git-archive export
# of the commit (never a working tree): the QI suites (seismicQc, avo, prestack,
# prestackQc, wavelets, lfm, inversion, inversionSpread, prestackInversion,
# propertyPrediction, prospectAssessment) and the rock physics suites (elasticSet,
# granular, inclusion, modelLines, u2). The suites read their goldens through
# fs at runtime, which the walker cannot see, so every golden, its README and
# every oracle and cross-check that writes or checks one are NAMED with the
# reason they travel. lib/gridding/closure.js arrives through
# qi.prospectAssessment; its golden (closure_cases.json) and oracle
# (oracle_closure.py) are named. Its own suite (mapping.t1.test.js) is NOT a
# seed: it imports lib/gridding/gridding.js, gridmath.js and kriging.js, which
# NextGen vendors at other blobs under group 5-unaudited-difference and which
# other courses reach; moving them is not this wave's call.
#
# RE-VENDORED at 0f4ac4a (engines #352 E1b, #354 E1a, #353 E1c, #355 E2): the
# seeds are now every __tests__/qi.*.test.js except the three left out below,
# which brings the E1 golden suites and E2's moved QI Studio maths
# (angleWavelets, avoWells, inversionQc, propertyCalibration, prospectTrap,
# seismolord/wellWavelet), their goldens, oracles, negative controls and
# FINDINGS records.
#
# LEFT OUT ON PURPOSE: engines/qi/gatherStore.js (storage layout),
# engines/qi/conditioning.js (taught without a graded value) and their suites,
# and the inversion benchmark suite (slow; its golden and oracle travel named).
#
# KEPT AT NEXTGEN'S BLOB: lib/gridding/gridmath.js. closure.js and
# prospectAssessment.js import only isNull and gridXY from it; NextGen's copy
# (ledgered 5-unaudited-difference) has the same isNull and, for an unrotated
# spec, the same gridXY arithmetic (the canonical one adds rotation_deg). The
# QI course passes no rotated grid. Proved below by running
# qi.prospectAssessment against NextGen's gridmath.
# Also kept: engines/seismolord/attributes.js and manifest.js, which the walk
# reaches through rockphysics/gather.js -> seismolord/tieWarp.js (tieWarp is
# already vendored at the engines blob). gather.js uses only
# rotateConstantPhase, which needs analyticSignal and NULL_VALUE; NextGen's
# copies carry both unchanged (the canonical files add spectralTrace and the
# v4 brick manifest). The Seismic Interpretation course grades through these
# files, so they stay where they are; rockphysics.u2 runs against them below.
#
# DECLARED MOVES of paths already vendored at the canonical pin's blob: two
# rock physics engine files and one README. Both engine diffs are ADDITIVE for
# every function NextGen calls (fluids.js gains voigtMix; vsEstimate.js gains
# gcSandShaleVs and iterativeVs, and shearForWell, which NextGen never calls,
# is rewritten "identical to the last bit"). The Rock Physics course's graded
# fields are re-derived through the engine before and after
# (vendor-proof/rp-fields-*.txt) and must be byte-identical.
#
# LEDGER MODE: THE PIN DOES NOT MOVE. New paths are ledgered as kind "extra",
# moved ones as "differing", group "qi-course", pinned to the vendored blob.
#
# Four proofs per path: git blob hash, sha256, cmp, byte count.
set -euo pipefail
ENG=/root/petrolord-engines
NG=${NG:-/root/wt-qi-nextgen}
RECUT=${RECUT:-origin/main}
GROUP=qi-course
PIN=$(python3 -c "import json,sys;print(json.load(open(sys.argv[1]))['canonical']['commit'])" "$NG/packages/engines/VENDOR.json")
REV=${REV:-0f4ac4a}
FULL=$(git -C "$ENG" rev-parse "$REV^{commit}")
EXP=$(mktemp -d)
LEDGER_PY=$(mktemp)
trap 'rm -rf "$EXP" "$LEDGER_PY"' EXIT
git -C "$ENG" archive "$FULL" | tar -x -C "$EXP"

# Shared runtime paths: each must already be vendored at the SAME blob.
SHAREDLIST="lib/fft.js lib/stats/stats.js lib/waveform.js engines/seismolord/tieWarp.js engines/dataai/quality.js engines/rockphysics/avo.js engines/rockphysics/gassmann.js"
# Kept at NextGen's blob although it differs (see the header).
KEPTLIST="lib/gridding/gridmath.js engines/seismolord/attributes.js engines/seismolord/manifest.js"
# Declared moves (see the header).
MOVELIST="engines/rockphysics/fluids.js engines/rockphysics/vsEstimate.js test-data/rockphysics/README.md"
declare -A SHARED=()
for p in $KEPTLIST; do SHARED[$p]=kept; done

echo "PIN ${PIN:0:7}, VENDORING FROM ${FULL:0:7}"
echo
cd "$EXP"
SEEDS="$(cd "$EXP" && ls __tests__/qi.*.test.js | grep -vE 'qi\.(conditioning|gatherStore|inversionBenchmark)\.test\.js$' | tr '\n' ' ')__tests__/rockphysics.elasticSet.test.js __tests__/rockphysics.granular.test.js __tests__/rockphysics.inclusion.test.js __tests__/rockphysics.modelLines.test.js __tests__/rockphysics.u2.test.js"
echo "CLOSURE WALK over an export of ${FULL:0:7}, seeds: $SEEDS"
declare -A CLOSURE=()
declare -a QUEUE=()
for s in $SEEDS; do [ -f "$s" ] || { echo "REFUSES: seed $s missing"; exit 1; }; CLOSURE[$s]="a jest suite, a seed"; QUEUE+=("$s"); done
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

NAMED=()
for p in test-data/qi/*; do NAMED+=("$p:a QI golden or its README, read at runtime by the qi suites through fs (or written by the named oracle)"); done
for p in tools/validation/qi/*; do NAMED+=("$p:an independent oracle that writes a test-data/qi golden, its negative-control script or its FINDINGS record"); done
for p in test-data/rockphysics/*; do NAMED+=("$p:a rock physics golden or its README, read at runtime by the rockphysics suites through fs"); done
for p in tools/validation/rockphysics/*.py; do NAMED+=("$p:an oracle, fixture writer or cross-check behind a test-data/rockphysics golden"); done
NAMED+=("test-data/mapping/goldens/closure_cases.json:the closure golden (crest, spill, closure area, GRV) behind lib/gridding/closure.js")
NAMED+=("tools/validation/mapping/oracle_closure.py:the independent stdlib oracle that writes closure_cases.json")
for extra in "${NAMED[@]}"; do
  p="${extra%%:*}"; why="${extra#*:}"
  [ -f "$EXP/$p" ] || { echo "REFUSES: named closure member $p is not in the tree at ${FULL:0:7}"; exit 1; }
  [ -z "${CLOSURE[$p]+x}" ] && CLOSURE[$p]="NAMED, not walked: $why"
done

PATHS=$(printf '%s\n' "${!CLOSURE[@]}" | sort)
N=$(printf '%s\n' "$PATHS" | grep -c .)
echo "  closure size: $N paths ($WALKED walked, $((N - WALKED)) named)"
printf '%s\n' "$PATHS" | while read -r p; do printf '    %-58s %s\n' "$p" "${CLOSURE[$p]}"; done
echo
QI_ALL=$(git -C "$ENG" ls-tree -r --name-only "$FULL" engines/qi | sort)
MISSED=$(comm -23 <(printf '%s\n' "$QI_ALL") <(printf '%s\n' "$PATHS") || true)
[ "$MISSED" = "$(printf 'engines/qi/conditioning.js\nengines/qi/gatherStore.js')" ] || { echo "REFUSES: engines/qi paths outside the closure other than the two left out on purpose: $MISSED"; exit 1; }
echo "  every engines/qi path is in the closure except conditioning.js and gatherStore.js (left out on purpose)"
echo

echo "SHARED RUNTIME PATHS: already vendored at the ${FULL:0:7} blob in NextGen AND on $RECUT (nothing moves):"
for p in $SHAREDLIST; do
  [ -n "${CLOSURE[$p]+x}" ] || { echo "REFUSES: shared path $p is not in the closure"; exit 1; }
  blobE=$(git -C "$ENG" rev-parse "$FULL:$p"); blobN=$(git hash-object "$NG/packages/engines/$p")
  blobR=$(git -C "$NG" rev-parse "$RECUT:packages/engines/$p" 2>/dev/null || echo absent)
  shaE=$(sha256sum "$EXP/$p" | cut -c1-16); shaN=$(sha256sum "$NG/packages/engines/$p" | cut -c1-16)
  printf '  %-36s engines %s  NextGen %s  recut %s  sha256 %s/%s\n' "$p" "${blobE:0:10}" "${blobN:0:10}" "${blobR:0:10}" "$shaE" "$shaN"
  [ "$blobE" = "$blobN" ] && [ "$shaE" = "$shaN" ] && cmp -s "$EXP/$p" "$NG/packages/engines/$p" || { echo "REFUSES: $p differs from engines ${FULL:0:7} in NextGen"; exit 1; }
  [ "$blobE" = "$blobR" ] || { echo "REFUSES: $p differs on $RECUT: rebase and re-prove"; exit 1; }
done
echo "KEPT AT NEXTGEN'S BLOB (differs from engines; see the header):"
for p in $KEPTLIST; do
  [ -n "${CLOSURE[$p]+x}" ] || { echo "REFUSES: kept path $p is not in the closure"; exit 1; }
  blobN=$(git hash-object "$NG/packages/engines/$p"); blobR=$(git -C "$NG" rev-parse "$RECUT:packages/engines/$p")
  printf '  %-36s engines %s  NextGen %s (kept)\n' "$p" "$(git -C "$ENG" rev-parse "$FULL:$p" | cut -c1-10)" "${blobN:0:10}"
  [ "$blobN" = "$blobR" ] || { echo "REFUSES: kept path $p moved against $RECUT"; exit 1; }
done
echo

echo "WHAT MOVES against NextGen, closure paths only:"
printf '%s\n' "$PATHS" | while read -r p; do
  b="$NG/packages/engines/$p"
  if [ -n "${SHARED[$p]+x}" ]; then continue; fi
  if [ -f "$b" ]; then
    if [ "$(git hash-object "$b")" != "$(git -C "$ENG" rev-parse "$FULL:$p")" ]; then
      if printf ' %s ' $MOVELIST | grep -q " $p "; then
        echo "  MOVES    $p (declared move)"
      elif python3 -c "import json,sys;v=json.load(open(sys.argv[1]));sys.exit(0 if any(e['path']==sys.argv[2] and e.get('group')=='$GROUP' for e in v['knownDeviations']) else 1)" "$NG/packages/engines/VENDOR.json" "$p"; then
        echo "  MOVES    $p (this wave's own ledgered path)"
      else
        echo "REFUSES: $p is already vendored at a different blob and is not a declared move"; exit 1
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
echo "$NV paths x 4 checks = $((NV*4)) proofs, all IDENTICAL against engines ${FULL:0:7}; ${#SHARED[@]} kept path(s) at NextGen's blob"

cat > "$LEDGER_PY" <<'PY'
import json, subprocess, sys
vj, man, ng, full, shared = sys.argv[1:6]
shared = set(s for s in shared.split(',') if s)
paths = [l for l in sys.stdin.read().split('\n') if l and l not in shared]
GROUP = 'qi-course'
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
        'reason': (f"QI course (Quantitative Interpretation): vendored sha-identical from petrolord-engines {full[:7]} "
                   f"(engines/qi seismicQc, avo, prestack, prestackQc, wavelets, lfm, inversion, inversionSpread, prestackInversion, "
                   f"propertyPrediction, prospectAssessment, and from E2 angleWavelets, avoWells, inversionQc, propertyCalibration, prospectTrap with seismolord/wellWavelet; the rockphysics elasticSet, avoTrend, granular, inclusion, templates, gather, "
                   f"pseudoSonic files; lib/gridding/closure.js; their suites, goldens and oracles) by the wave's vendor_qi.sh, 4 proofs per path. "
                   f"lib/gridding/gridmath.js is kept at NextGen's blob (closure.js uses only isNull and the unrotated gridXY). "
                   + ("The move of this already vendored file is additive for every function NextGen calls; the Rock Physics "
                      "course's graded fields were re-derived through the engine before and after and are identical. " if kind == 'differing' else '')
                   + f"{'New since' if kind == 'extra' else 'Differing from'} the canonical pin {pin[:7]}, which stays: moving it "
                   f"would also move paths other courses grade. Clears as STALE when the pin moves to {full[:7]} or later."),
    })
v['knownDeviations'] = keep + added
open(vj, 'w').write(json.dumps(v, indent=2, ensure_ascii=False) + '\n')
print(f'  VENDOR.json: pin {pin[:7]} unchanged; {same} closure path(s) already match the manifest; group {GROUP}: {len(added)} path(s) ledgered; left with their owner group at the same blob: {sorted(owned)}; kept at NextGen blob: {sorted(shared)}')
for e in added:
    print(f"    {e['kind']:<9} {e['path']}  {e['vendoredSha'][:12]}")
PY
SHARED_CSV=$(IFS=,; echo "${!SHARED[*]}")
printf '%s\n' "$PATHS" | python3 "$LEDGER_PY" "$NG/packages/engines/VENDOR.json" "$NG/packages/engines/VENDOR.manifest" "$NG" "$FULL" "$SHARED_CSV"
echo
# the guard reads the tracked tree, so the vendored paths are staged BY PATH first
printf '%s\n' "$PATHS" | grep -vxF -f <(printf '%s\n' $KEPTLIST) | sed 's|^|packages/engines/|' | xargs git -C "$NG" add -- packages/engines/VENDOR.json
cd "$NG" && node tools/check-vendored-engines.mjs --canonical "$ENG"
echo
echo "THE VENDORED SUITES AGAINST NEXTGEN'S OWN SHARED COPIES (gridmath kept):"
cd "$NG/packages/engines" && npx jest $(printf '%s ' $SEEDS) 2>&1 | grep -E "^Tests:|^Test Suites:|FAIL"
