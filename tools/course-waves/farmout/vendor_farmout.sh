#!/usr/bin/env bash
# VENDOR THE EC10 FARMOUT CLOSURE (engines/economics/farmout.js) INTO NEXTGEN,
# SHA-IDENTICAL, AND PROVE IT. Adapted from EC9's vendor_joa.sh.
#
# The closure is WALKED FROM THE JEST SUITE AS THE ONLY SEED over a git-archive
# export of the commit (never a working tree). The suite reads its golden and
# the ekene-farmout fixture through a spread `read(...)` helper the walker
# cannot parse, so those, the fixture README, the fixture writer, the oracle,
# the timing script and the negative control are NAMED with the reason they
# travel, with FINDINGS-farmout.md, the validation record (engines #273).
# Vendored at 6626465 (engines #272 the engine, #273 and #275 FINDINGS, #276 the
# negative-carry refusal, #274 the simple
# uplift in jointVenture.carryRecovery, which farmout.developmentCarry passes
# through).
#
# farmout.js imports engines/economics/cashflow.ts (applyJV, npv),
# decisionTree.js (rollback, evpi, evii), portfolio.js (portfolioRiskMetrics),
# afe.js (calculatePartnerCosts) and jointVenture.js (carryRecovery, backIn);
# the walk carries them on to irrContract.js, lib/dates/dates.js and
# lib/stats/stats.js.
#
# WHY THE CLOSURE SITS IN ITS OWN ROOT, packages/engines/ec10-farmout/. The
# canonical paths of two of its files carry OLDER blobs in NextGen on purpose:
# engines/economics/decisionTree.js and engines/economics/portfolio.js are
# ledgered in VENDOR.json as group "4-economics-revendor", "Pull only with the
# recut in the same deploy window", and the EC4 decision and EC5 portfolio
# courses teach and grade those blobs (their digests do not rebuild on the
# engine-course blobs farmout needs: EC4 teaches a blank payoff as 0 and EC5 a pos above 1
# clamped, both refused by the newer blobs). farmout.js cannot run on the older
# decisionTree.js (it reads tiedIndices, which that blob does not return). So
# the whole runtime closure is vendored, byte for byte, under one prefix whose
# relative imports resolve among themselves, and NO canonical path moves. When
# the EC4 and EC5 recut lands, the prefix collapses into the canonical paths
# and its ledger entries are removed in the same change.
#
# Each path is ledgered in VENDOR.json as kind "extra", group
# "ec10-farmout-course", pinned to its blob, so the guard fails on any drift.
# Four proofs per path: git blob hash, sha256, cmp, byte count. For every
# runtime file the canonical NextGen path is also compared and printed.
set -euo pipefail
ENG=/root/petrolord-engines
NG=${NG:-/root/wt-ec10-nextgen}
PREFIX=ec10-farmout
REV=${REV:-6626465}
FULL=$(git -C "$ENG" rev-parse "$REV^{commit}")
PIN=$(python3 -c "import json,sys;print(json.load(open(sys.argv[1]))['canonical']['commit'])" "$NG/packages/engines/VENDOR.json")
EXP=$(mktemp -d)
LEDGER_PY=$(mktemp)
trap 'rm -rf "$EXP" "$LEDGER_PY"' EXIT
git -C "$ENG" archive "$FULL" | tar -x -C "$EXP"

echo "PIN ${PIN:0:7} (unchanged), VENDORING FROM ${FULL:0:7} INTO packages/engines/$PREFIX/"
echo
cd "$EXP"
SEED=__tests__/economics.farmout.test.js
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
  "test-data/economics/goldens/farmout_cases.json:read at runtime by the suite through read('test-data','economics','goldens',...)" \
  "test-data/economics/ekene-farmout/ekene-farmout.json:read at runtime by the suite; the course dataset (the Ekene Deep farm-out, synthetic)" \
  "test-data/economics/ekene-farmout/README.md:the fixture record (synthetic, planted situations)" \
  "tools/validation/economics/make_farmout_fixtures.py:writes the ekene-farmout fixture" \
  "tools/validation/economics/oracle_farmout.py:writes the golden the suite reads" \
  "tools/validation/economics/timing_farmout.js:times riskSharing against its work cap" \
  "tools/validation/economics/negcontrol_farmout.sh:the negative control over the suite (31 engine plants, 6 oracle plants)" \
  "tools/validation/economics/FINDINGS-farmout.md:the validation record (sources, editions, read dates, decisions, boundary table)"; do
  p="${extra%%:*}"; why="${extra#*:}"
  [ -f "$EXP/$p" ] || { echo "REFUSES: named closure member $p is not in the tree at ${FULL:0:7}"; exit 1; }
  [ -z "${CLOSURE[$p]+x}" ] && CLOSURE[$p]="NAMED, not walked: $why"
done
# the oracle imports the EC9 oracle as its jointVenture witness
grep -q "oracle_jointventure" "$EXP/tools/validation/economics/oracle_farmout.py" && {
  p=tools/validation/economics/oracle_jointventure.py
  [ -z "${CLOSURE[$p]+x}" ] && CLOSURE[$p]="NAMED, not walked: imported by oracle_farmout.py as the witness for carryRecovery and backIn"
}

PATHS=$(printf '%s\n' "${!CLOSURE[@]}" | sort)
N=$(printf '%s\n' "$PATHS" | grep -c .)
echo "  closure size: $N paths ($WALKED walked, $((N - WALKED)) named)"
printf '%s\n' "$PATHS" | while read -r p; do printf '    %-58s %s\n' "$p" "${CLOSURE[$p]}"; done
echo
SC_ALL=$(git -C "$ENG" ls-tree -r --name-only "$FULL" | grep -iE 'farmout|ekene-farmout' | sort)
MISSED=$(comm -23 <(printf '%s\n' "$SC_ALL") <(printf '%s\n' "$PATHS") || true)
if [ -n "$MISSED" ]; then echo "REFUSES: farmout paths in ${FULL:0:7} outside the closure: $MISSED"; exit 1; fi
echo "  every farmout path at ${FULL:0:7} is in the closure"
echo

echo "THE CANONICAL NEXTGEN PATHS OF THE RUNTIME FILES (none is moved by this wave):"
printf '%s\n' "$PATHS" | grep -E '^(engines|lib)/' | while read -r p; do
  blobE=$(git -C "$ENG" rev-parse "$FULL:$p")
  if [ -f "$NG/packages/engines/$p" ]; then
    blobN=$(git hash-object "$NG/packages/engines/$p")
    grp=$(python3 -c "import json,sys;v=json.load(open(sys.argv[1]));print(next((e.get('group','') for e in v['knownDeviations'] if e['path']==sys.argv[2]),'canonical'))" "$NG/packages/engines/VENDOR.json" "$p")
    printf '  %-40s %s at %s; NextGen %s (%s) %s\n' "$p" "${blobE:0:10}" "${FULL:0:7}" "${blobN:0:10}" "$grp" "$([ "$blobE" = "$blobN" ] && echo 'the same blob' || echo 'DIFFERS, kept')"
  else
    printf '  %-40s %s at %s; absent from NextGen\n' "$p" "${blobE:0:10}" "${FULL:0:7}"
  fi
done
echo

printf '%s\n' "$PATHS" | while read -r p; do
  d="$NG/packages/engines/$PREFIX/$p"
  mkdir -p "$(dirname "$d")"
  git -C "$ENG" cat-file blob "$FULL:$p" > "$d"
  if [ -x "$EXP/$p" ]; then chmod 755 "$d"; fi
done

echo "SHA-IDENTITY, four independent proofs per path:"
printf '%-72s %-5s %-7s %-4s %-14s %s\n' PATH blob sha256 cmp bytes VERDICT
printf '%s\n' "$PATHS" | while read -r p; do
  a="$EXP/$p"; b="$NG/packages/engines/$PREFIX/$p"
  ba=$(git -C "$ENG" rev-parse "$FULL:$p"); bb=$(git hash-object "$b")
  sa=$(sha256sum "$a" | cut -d' ' -f1); sb=$(sha256sum "$b" | cut -d' ' -f1)
  ca=$(wc -c < "$a"); cb=$(wc -c < "$b")
  v1=$([ "$ba" = "$bb" ] && echo yes || echo NO); v2=$([ "$sa" = "$sb" ] && echo yes || echo NO)
  v3=$(cmp -s "$a" "$b" && echo yes || echo NO); v4=$([ "$ca" = "$cb" ] && echo yes || echo NO)
  verdict=IDENTICAL
  for v in "$v1" "$v2" "$v3" "$v4"; do [ "$v" = NO ] && verdict=DEVIATES; done
  printf '%-72s %-5s %-7s %-4s %-14s %s\n' "$PREFIX/$p" "$v1" "$v2" "$v3" "$ca/$cb" "$verdict"
  [ "$verdict" = IDENTICAL ] || exit 1
done
echo
echo "$N paths x 4 checks = $((N*4)) proofs, all IDENTICAL against engines ${FULL:0:7}"

cat > "$LEDGER_PY" <<'PY'
import json, subprocess, sys
vj, ng, full, prefix = sys.argv[1:5]
paths = [f'{prefix}/{l}' for l in sys.stdin.read().split('\n') if l]
GROUP = 'ec10-farmout-course'
v = json.load(open(vj))
pin = v['canonical']['commit']
foreign = [e['path'] for e in v['knownDeviations'] if e['path'].startswith(prefix + '/') and e.get('group') != GROUP]
if foreign:
    sys.exit(f'REFUSES: paths under {prefix}/ ledgered by another group: {foreign}')
keep = [e for e in v['knownDeviations'] if e.get('group') != GROUP]
added = []
for p in paths:
    blob = subprocess.check_output(['git', 'hash-object', f'{ng}/packages/engines/{p}'], text=True).strip()
    added.append({
        'path': p, 'kind': 'extra', 'group': GROUP, 'vendoredSha': blob,
        'reason': (f"EC10 farmout course: the farmout.js closure vendored sha-identical from petrolord-engines {full[:7]} "
                   f"(PRs #272 to #276) under its own root {prefix}/ by the wave's vendor_farmout.sh, 4 proofs per path. "
                   f"Its own root because farmout.js needs the {full[:7]} decisionTree.js and portfolio.js, whose canonical "
                   f"NextGen paths are held at older blobs by group 4-economics-revendor for the EC4 and EC5 courses "
                   f"(pull only with their recut). Remove this entry, and collapse the root into the canonical paths, "
                   f"in the change that lands that recut."),
    })
v['knownDeviations'] = keep + added
open(vj, 'w').write(json.dumps(v, indent=2, ensure_ascii=False) + '\n')
print(f'  VENDOR.json: pin {pin[:7]} unchanged; group {GROUP}: {len(added)} path(s) ledgered as extra under {prefix}/')
PY
printf '%s\n' "$PATHS" | python3 "$LEDGER_PY" "$NG/packages/engines/VENDOR.json" "$NG" "$FULL" "$PREFIX"
echo
# the guard reads the tracked tree, so the vendored paths are staged BY PATH first
printf '%s\n' "$PATHS" | sed "s|^|packages/engines/$PREFIX/|" | xargs git -C "$NG" add -- packages/engines/VENDOR.json
cd "$NG" && node tools/check-vendored-engines.mjs --canonical "$ENG"
echo
echo "THE VENDORED SUITE, RUN FROM ITS OWN ROOT:"
cd "$NG/packages/engines" && npx jest "$PREFIX/__tests__/economics.farmout.test.js" 2>&1 | grep -E "^Tests:|^Test Suites:"
