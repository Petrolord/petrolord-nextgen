#!/usr/bin/env bash
# VENDOR THE D5 APPLIEDAI CLOSURE (engines/dataai/evaluate.js) INTO NEXTGEN,
# SHA-IDENTICAL, AND PROVE IT. Adapted from D4's vendor_appliedai.sh.
#
# The closure is WALKED FROM THE JEST SUITE AS THE ONLY SEED over a git-archive
# export of the commit (never a working tree). The suite reads its golden, its
# pins, the ekene-docs fixtures and three ekene-dynamic files through a spread
# `read(...)` helper the walker cannot parse, so those, the fixture writer, the
# oracle, the pin writer, the timing script, FINDINGS and the negative control
# are NAMED with the reason they travel. evaluate.js imports lib/stats
# (mulberry32, quantile), lib/conventions/percentile.js
# (parameterPercentileLabel) and engines/dataai/ml.js (logLoss); the suite
# imports ml.js and percentile.js directly as well.
#
# FIRST VENDORED AT 1906182 (engines PR #257, squash-merged). RE-VENDORED AT
# f50251d (engines PR #258, squash-merged: wording only, the nDCG-undefined note
# states its exact condition and WBC is anchored to Stephenson, Coelho and
# Jolliffe 2008 eq. 7; no number changes). RE-PIN with REV=<sha>: the blobs must be identical or the course
# foundation re-cuts.
#
# LEDGER MODE: THE PIN DOES NOT MOVE. Every closure path either matches the
# pinned manifest (lib/stats, percentile.js, ml.js and the ekene-dynamic files,
# byte-identical and already vendored), or is NEW since the pin and is
# ledgered as kind "extra", group "d5-appliedai-course", pinned to its
# vendored blob. The entries clear by the guard's own STALE rule when the pin
# moves to the merge commit or later.
#
# Four proofs per path: git blob hash, sha256, cmp, byte count.
set -euo pipefail
ENG=/root/petrolord-engines
NG=${NG:-/root/wt-dai-d5-nextgen}
PIN=$(python3 -c "import json,sys;print(json.load(open(sys.argv[1]))['canonical']['commit'])" "$NG/packages/engines/VENDOR.json")
REV=${REV:-f50251d}
FULL=$(git -C "$ENG" rev-parse "$REV^{commit}")
EXP=$(mktemp -d)
LEDGER_PY=$(mktemp)
trap 'rm -rf "$EXP" "$LEDGER_PY"' EXIT
git -C "$ENG" archive "$FULL" | tar -x -C "$EXP"

echo "PIN ${PIN:0:7}, VENDORING FROM ${FULL:0:7}"
echo
cd "$EXP"
SEED=__tests__/dataai.evaluate.test.js
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
  "test-data/dataai/goldens/evaluate_cases.json:read at runtime by the suite through read('test-data','dataai','goldens',...)" \
  "test-data/dataai/pins/evaluate_pins.json:read at runtime by the suite through read('test-data','dataai','pins',...)" \
  "test-data/dataai/ekene-docs/corpus.json:read at runtime by the suite through FIX(...); the course dataset" \
  "test-data/dataai/ekene-docs/queries.json:read at runtime by the suite through FIX(...); the course dataset" \
  "test-data/dataai/ekene-docs/systems.json:read at runtime by the suite through FIX(...); the course dataset" \
  "test-data/dataai/ekene-docs/extraction.json:read at runtime by the suite through FIX(...); the course dataset" \
  "test-data/dataai/ekene-docs/calibration.json:read at runtime by the suite through FIX(...); the course dataset" \
  "test-data/dataai/ekene-docs/README.md:the fixture record (synthetic, planted defects)" \
  "test-data/ekene-dynamic/mbal.json:read at runtime by the suite's Ekene consistency gate" \
  "test-data/ekene-dynamic/field.json:read at runtime by the suite's Ekene consistency gate" \
  "test-data/ekene-dynamic/rates.json:read at runtime by the suite's Ekene consistency gate" \
  "tools/validation/dataai/make_evaluate_fixtures.py:writes the ekene-docs fixtures" \
  "tools/validation/dataai/oracle_evaluate.py:writes the golden the suite reads" \
  "tools/validation/dataai/pin_evaluate.py:writes the library pins the suite reads" \
  "tools/validation/dataai/timing_evaluate.mjs:produced the timings table FINDINGS carries" \
  "tools/validation/dataai/FINDINGS-evaluate.md:the validation record the engine header cites" \
  "tools/validation/dataai/negcontrol_evaluate.sh:produced the negative-control table FINDINGS carries"; do
  p="${extra%%:*}"; why="${extra#*:}"
  [ -f "$EXP/$p" ] || { echo "REFUSES: named closure member $p is not in the tree at ${FULL:0:7}"; exit 1; }
  [ -z "${CLOSURE[$p]+x}" ] && CLOSURE[$p]="NAMED, not walked: $why"
done

PATHS=$(printf '%s\n' "${!CLOSURE[@]}" | sort)
N=$(printf '%s\n' "$PATHS" | grep -c .)
echo "  closure size: $N paths ($WALKED walked, $((N - WALKED)) named)"
printf '%s\n' "$PATHS" | while read -r p; do printf '    %-52s %s\n' "$p" "${CLOSURE[$p]}"; done
echo
DA_ALL=$(git -C "$ENG" ls-tree -r --name-only "$FULL" | grep -E '(^|/)dataai/|dataai\.' | grep -E '(^|[/._])evaluate([._]|$)|ekene-docs' | sort)
MISSED=$(comm -23 <(printf '%s\n' "$DA_ALL") <(printf '%s\n' "$PATHS") || true)
if [ -n "$MISSED" ]; then echo "REFUSES: dataai evaluate paths in ${FULL:0:7} outside the closure: $MISSED"; exit 1; fi
echo "  every dataai evaluate path at ${FULL:0:7} is in the closure"
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
GROUP = 'd5-appliedai-course'
MOVABLE = set()
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
        'reason': (f"D5 appliedai course: vendored sha-identical from petrolord-engines {full[:7]} "
                   f"(PR #257 and the wording repair #258: engines/dataai/evaluate.js, its jest suite, golden, library pins, the ekene-docs fixtures and their writer, oracle, pin writer, "
                   f"timing script, FINDINGS, negative control) by the wave's vendor_appliedai.sh, 4 proofs per path. "
                   f"{'New since' if kind == 'extra' else 'Differing from'} the canonical pin {pin[:7]}, which stays: moving it "
                   f"would also move economics, facilities, production, seismolord and wellsite paths other courses grade. "
                   f"Clears as STALE when the pin moves to {full[:7]} or later."),
    })
v['knownDeviations'] = keep + added
open(vj, 'w').write(json.dumps(v, indent=2, ensure_ascii=False) + '\n')
print(f'  VENDOR.json: pin {pin[:7]} unchanged; {same} closure path(s) already match the manifest; group {GROUP}: {len(added)} path(s) ledgered; left with their owner group at the same blob: {sorted(owned)}')
for e in added:
    print(f"    {e['kind']:<9} {e['path']}  {e['vendoredSha'][:12]}")
PY
printf '%s\n' "$PATHS" | python3 "$LEDGER_PY" "$NG/packages/engines/VENDOR.json" "$NG/packages/engines/VENDOR.manifest" "$NG" "$FULL"
echo
printf '%s\n' "$PATHS" | sed 's|^|packages/engines/|' | xargs git -C "$NG" add -- packages/engines/VENDOR.json
cd "$NG" && node tools/check-vendored-engines.mjs --canonical "$ENG"
