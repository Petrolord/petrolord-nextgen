#!/usr/bin/env bash
# VENDOR THE D3 FACIES CLOSURE (engines/dataai/cluster.js) INTO NEXTGEN,
# SHA-IDENTICAL, AND PROVE IT. Adapted from D2's vendor_mlcore.sh.
#
# The closure is WALKED FROM THE JEST SUITE AS THE ONLY SEED over a git-archive
# export of the commit (never a working tree). The test reads its golden and
# its pins through a spread `read(...)` helper the walker cannot parse, so
# those two, Fisher's iris file the oracle parses, the oracle, the pin writer,
# the timing script, FINDINGS and the negative control are NAMED with the
# reason they travel. cluster.js imports ml.js and lib/stats; since ef4058f
# the suite imports ml.js directly as well.
#
# RE-VENDORED AT ef4058f (engines PR #254, the foundation's finding E1 and
# more; first vendored at 4dfbb29, PR #253). ml.js's scalers gained a
# `rowNoun` option whose default is 'training rows', so every D2 caller keeps
# its behaviour and wording; cluster.js passes 'rows passed' (pca, kmeans,
# silhouette, elbow, agglomerative) and kNN keeps 'training rows'. pca gained
# maxSweeps and keeps both warnings; cutTree refuses id reuse.
#
# TWO ENTRIES MOVE FROM D2's GROUP d2-mlcore-course TO d3-facies-course, each
# at its new blob, because D3's closure is why the file moved:
#   tools/validation/dataai/synthetic_wells.js  (4dfbb29: syntheticFacies
#       appended; D2's syntheticWells unchanged)
#   engines/dataai/ml.js  (ef4058f: rowNoun added, default wording unchanged)
# The ml.js move is proved harmless to D2 by rebuilding the merged D2 digest,
# fields.json and precision.json against the new ml.js byte-identically and by
# running D2's vendored ml suite (wave.json enginesVendoredAt records it). Any
# OTHER closure path ledgered by another group refuses.
#
# Four proofs per path: git blob hash, sha256, cmp, byte count.
#
# LEDGER MODE: THE PIN DOES NOT MOVE. VENDOR.json pins 54cf7c4; moving it to
# ef4058f would also move economics cashflow goldens, facilities, production,
# seismolord and wellsite paths, reopening live graded values in other
# courses. Every closure path either matches the pinned manifest (the imported
# dependencies lib/stats and lib/lp, byte-identical and already vendored), or
# is NEW since the pin and is ledgered as kind "extra", group
# "d3-facies-course", pinned to its vendored blob. The entries clear by the
# guard's own STALE rule when the pin moves to ef4058f or later. A closure
# path another group ledgers AT THE SAME BLOB would be left with its owner
# (none at ef4058f).
set -euo pipefail
ENG=/root/petrolord-engines
NG=${NG:-/root/wt-dai-d3-nextgen}
PIN=$(python3 -c "import json,sys;print(json.load(open(sys.argv[1]))['canonical']['commit'])" "$NG/packages/engines/VENDOR.json")
REV=${REV:-ef4058f}
FULL=$(git -C "$ENG" rev-parse "$REV^{commit}")
EXP=$(mktemp -d)
LEDGER_PY=$(mktemp)
trap 'rm -rf "$EXP" "$LEDGER_PY"' EXIT
git -C "$ENG" archive "$FULL" | tar -x -C "$EXP"

echo "PIN ${PIN:0:7}, VENDORING FROM ${FULL:0:7}"
echo
cd "$EXP"
SEED=__tests__/dataai.cluster.test.js
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
    for cand in "$spec" "$spec.js" "$spec.mjs" "$spec.cjs" "$spec/index.js"; do
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
  "test-data/dataai/goldens/cluster_cases.json:read at runtime by the suite through read('test-data','dataai','goldens',...)" \
  "test-data/dataai/pins/cluster_pins.json:read at runtime by the suite through read('test-data','dataai','pins',...)" \
  "test-data/dataai/iris/iris.csv:Fisher's iris (1936), the published anchor the oracle and pin writer parse" \
  "tools/validation/dataai/oracle_cluster.py:writes the golden the suite reads" \
  "tools/validation/dataai/pin_cluster.py:writes the library pins the suite reads" \
  "tools/validation/dataai/timing_cluster.mjs:produced the timings table FINDINGS carries" \
  "tools/validation/dataai/FINDINGS-cluster.md:the validation record the engine header cites" \
  "tools/validation/dataai/negcontrol_cluster.sh:produced the negative-control table FINDINGS carries"; do
  p="${extra%%:*}"; why="${extra#*:}"
  [ -f "$EXP/$p" ] || { echo "REFUSES: named closure member $p is not in the tree at ${FULL:0:7}"; exit 1; }
  [ -z "${CLOSURE[$p]+x}" ] && CLOSURE[$p]="NAMED, not walked: $why"
done

PATHS=$(printf '%s\n' "${!CLOSURE[@]}" | sort)
N=$(printf '%s\n' "$PATHS" | grep -c .)
echo "  closure size: $N paths ($WALKED walked, $((N - WALKED)) named)"
printf '%s\n' "$PATHS" | while read -r p; do printf '    %-52s %s\n' "$p" "${CLOSURE[$p]}"; done
echo
DA_ALL=$(git -C "$ENG" ls-tree -r --name-only "$FULL" | grep -E '(^|/)dataai/|dataai\.' | grep -E '(^|[/._])cluster([._]|$)|synthetic_wells|iris/' | sort)
MISSED=$(comm -23 <(printf '%s\n' "$DA_ALL") <(printf '%s\n' "$PATHS") || true)
if [ -n "$MISSED" ]; then echo "REFUSES: dataai cluster paths in ${FULL:0:7} outside the closure: $MISSED"; exit 1; fi
echo "  every dataai cluster path at ${FULL:0:7} is in the closure"
echo
echo "WHAT MOVES against the pin ${PIN:0:7}, closure paths only:"
printf '%s\n' "$PATHS" | xargs git -C "$ENG" diff --stat "$PIN" "$FULL" -- | sed 's/^/  /'
echo

printf '%s\n' "$PATHS" | while read -r p; do
  mkdir -p "$NG/packages/engines/$(dirname "$p")"
  git -C "$ENG" cat-file blob "$FULL:$p" > "$NG/packages/engines/$p"
  if [ -x "$EXP/$p" ]; then chmod 755 "$NG/packages/engines/$p"; fi
done

echo "SHA-IDENTITY, four independent proofs per path:"
printf '%-52s %-5s %-7s %-4s %-14s %s\n' PATH blob sha256 cmp bytes VERDICT
printf '%s\n' "$PATHS" | while read -r p; do
  a="$EXP/$p"; b="$NG/packages/engines/$p"
  ba=$(git -C "$ENG" rev-parse "$FULL:$p"); bb=$(git hash-object "$b")
  sa=$(sha256sum "$a" | cut -d' ' -f1); sb=$(sha256sum "$b" | cut -d' ' -f1)
  ca=$(wc -c < "$a"); cb=$(wc -c < "$b")
  v1=$([ "$ba" = "$bb" ] && echo yes || echo NO); v2=$([ "$sa" = "$sb" ] && echo yes || echo NO)
  v3=$(cmp -s "$a" "$b" && echo yes || echo NO); v4=$([ "$ca" = "$cb" ] && echo yes || echo NO)
  verdict=IDENTICAL
  for v in "$v1" "$v2" "$v3" "$v4"; do [ "$v" = NO ] && verdict=DEVIATES; done
  printf '%-52s %-5s %-7s %-4s %-14s %s\n' "$p" "$v1" "$v2" "$v3" "$ca/$cb" "$verdict"
  [ "$verdict" = IDENTICAL ] || exit 1
done
echo
echo "$N paths x 4 checks = $((N*4)) proofs, all IDENTICAL against engines ${FULL:0:7}"

cat > "$LEDGER_PY" <<'PY'
import json, subprocess, sys
vj, man, ng, full = sys.argv[1:5]
paths = [l for l in sys.stdin.read().split('\n') if l]
GROUP = 'd3-facies-course'
MOVABLE = {('tools/validation/dataai/synthetic_wells.js', 'd2-mlcore-course'), ('engines/dataai/ml.js', 'd2-mlcore-course')}
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
owned = {e['path'] for e in devs if e['path'] in paths and e.get('group') != GROUP and (e['path'], e.get('group')) not in MOVABLE and e.get('vendoredSha') == blob_of(e['path'])}
foreign = [e['path'] for e in devs if e['path'] in paths and e.get('group') != GROUP and (e['path'], e.get('group')) not in MOVABLE and e['path'] not in owned]
if foreign:
    sys.exit(f'REFUSES: closure paths ledgered by another group: {foreign}')
moved = [e['path'] for e in devs if e['path'] in paths and (e['path'], e.get('group')) in MOVABLE]
keep = [e for e in devs if not (e['path'] in paths and (e.get('group') == GROUP or (e['path'], e.get('group')) in MOVABLE))]
added = []
same = 0
for p in paths:
    if p in owned:
        continue
    blob = subprocess.check_output(['git', 'hash-object', f'{ng}/packages/engines/{p}'], text=True).strip()
    if p in canon and canon[p] == blob:
        same += 1
        continue
    kind = 'differing' if p in canon else 'extra'
    added.append({
        'path': p, 'kind': kind, 'group': GROUP, 'vendoredSha': blob,
        'reason': (f"D3 facies course: vendored sha-identical from petrolord-engines {full[:7]} "
                   f"(PRs #253 and #254: engines/dataai/cluster.js, its jest suite, golden, library pins, Fisher's iris, synthetic wells (syntheticFacies appended; D2's syntheticWells unchanged), ml.js (rowNoun added; its default 'training rows' wording, which D2 grades, unchanged), oracle, pin writer, "
                   f"timing script, FINDINGS, negative control) by the wave's vendor_facies.sh, 4 proofs per path. "
                   f"{'New since' if kind == 'extra' else 'Differing from'} the canonical pin {pin[:7]}, which stays: moving it "
                   f"would also move economics, facilities, production, seismolord and wellsite paths other courses grade. "
                   f"Clears as STALE when the pin moves to {full[:7]} or later."),
    })
v['knownDeviations'] = keep + added
open(vj, 'w').write(json.dumps(v, indent=2, ensure_ascii=False) + '\n')
print(f'  VENDOR.json: pin {pin[:7]} unchanged; {same} closure path(s) already match the manifest; group {GROUP}: {len(added)} path(s) ledgered; moved from D2: {moved}; left with their owner group at the same blob: {sorted(owned)}')
for e in added:
    print(f"    {e['kind']:<9} {e['path']}  {e['vendoredSha'][:12]}")
PY
printf '%s\n' "$PATHS" | python3 "$LEDGER_PY" "$NG/packages/engines/VENDOR.json" "$NG/packages/engines/VENDOR.manifest" "$NG" "$FULL"
echo
printf '%s\n' "$PATHS" | sed 's|^|packages/engines/|' | xargs git -C "$NG" add -- packages/engines/VENDOR.json
cd "$NG" && node tools/check-vendored-engines.mjs --canonical "$ENG"
