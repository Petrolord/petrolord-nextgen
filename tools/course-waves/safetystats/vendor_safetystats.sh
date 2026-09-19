#!/usr/bin/env bash
# VENDOR THE H1 SAFETYSTATS CLOSURE INTO NEXTGEN, SHA-IDENTICAL, AND PROVE IT.
#
# Adapted from FC9's vendor_corrosion.sh. The closure is WALKED FROM THE JEST
# SUITE AS THE ONLY SEED, not listed from expectation, and the paths the walk
# cannot reach (the oracle that writes the golden, the FINDINGS record and the
# negative-control script that produced the FINDINGS table) are NAMED with the
# reason they travel.
#
# THE WALK RUNS OVER AN EXPORT OF THE PINNED COMMIT, never over a working tree:
# /root/petrolord-engines is a shared clone whose checked-out branch is whatever
# the last session left it on, so reading files from it would vendor a branch
# rather than a commit. `git archive $REV` is the commit and nothing else.
#
# Four independent proofs per path: the git blob hash, a sha256 over the bytes,
# a byte-for-byte cmp, and a byte COUNT on both sides.
#
# AND THE PIN MOVES. Canonical 5cbdca5 -> f123a57 changes exactly seven paths:
# README.md (a ledgered, pinned-by-vendored-sha deviation, group 7) and the six
# new hse paths. Nothing a live course grades moves, which `git diff --stat
# 5cbdca5 f123a57` proves and this script prints before it touches anything.
set -euo pipefail
ENG=/root/petrolord-engines
NG=${NG:-/root/wt-h1-nextgen}
OLD=5cbdca5
REV=f123a57
FULL=$(git -C "$ENG" rev-parse "$REV")
EXP=$(mktemp -d)
trap 'rm -rf "$EXP"' EXIT
git -C "$ENG" archive "$FULL" | tar -x -C "$EXP"

echo "CANONICAL MOVE $OLD -> ${FULL:0:7}: every path that differs"
git -C "$ENG" diff --stat "$OLD" "$FULL" | sed 's/^/  /'
echo

cd "$EXP"
SEED=__tests__/hse.safetyStats.test.js
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
        if [ -z "${CLOSURE[$res]+x}" ]; then
          CLOSURE[$res]="imported by $cur"; QUEUE+=("$res")
        fi
        break
      fi
    done
  done < <(grep -oE "(from|require\()\s*['\"][^'\"]+['\"]" "$cur" | grep -oE "['\"][^'\"]+['\"]" | tr -d "'\"")
  while read -r joined; do
    [ -z "$joined" ] && continue
    res=$(cd "$dir" && realpath -m --relative-to="$EXP" "$joined" 2>/dev/null || true)
    if [ -n "$res" ] && [ -f "$EXP/$res" ] && [ -z "${CLOSURE[$res]+x}" ]; then
      CLOSURE[$res]="read at runtime by $cur"; QUEUE+=("$res")
    fi
  done < <(python3 - "$cur" <<'PY'
import re, sys
src = open(sys.argv[1], encoding='utf-8').read()
for m in re.finditer(r'path\.join\(\s*__dirname\s*,([^)]*)\)', src, re.S):
    parts = re.findall(r"'([^']*)'|\"([^\"]*)\"", m.group(1))
    segs = [a or b for a, b in parts]
    if segs:
        print('/'.join(segs))
PY
)
done
WALKED=${#CLOSURE[@]}

for extra in \
  "tools/validation/hse/oracle_safetystats.py:writes the golden the suite reads" \
  "tools/validation/hse/FINDINGS-safetystats.md:the validation record the engine header cites" \
  "tools/validation/hse/negcontrol_safetystats.sh:produced the negative-control table FINDINGS carries"; do
  p="${extra%%:*}"; why="${extra#*:}"
  [ -f "$EXP/$p" ] || { echo "REFUSES: named closure member $p is not in the tree at ${FULL:0:7}"; exit 1; }
  [ -z "${CLOSURE[$p]+x}" ] && CLOSURE[$p]="NAMED, not walked: $why"
done

PATHS=$(printf '%s\n' "${!CLOSURE[@]}" | sort)
N=$(printf '%s\n' "$PATHS" | grep -c .)
echo "  closure size: $N paths ($WALKED walked, $((N - WALKED)) named)"
printf '%s\n' "$PATHS" | while read -r p; do printf '    %-52s %s\n' "$p" "${CLOSURE[$p]}"; done
echo
# Every hse path in the commit must be in the closure, so nothing in the domain
# is silently left behind.
HSE_ALL=$(git -C "$ENG" ls-tree -r --name-only "$FULL" | grep -E '(^|/)hse(/|\.)' | sort)
MISSED=$(comm -23 <(printf '%s\n' "$HSE_ALL") <(printf '%s\n' "$PATHS") | grep -v '^engines/economics/' || true)
if [ -n "$MISSED" ]; then echo "REFUSES: hse paths in ${FULL:0:7} outside the closure: $MISSED"; exit 1; fi
echo "  every hse path at ${FULL:0:7} is in the closure (engines/economics/fdp/hseCalculations.js is the EC6 module, already vendored and unchanged)"
echo

# ---- copy and prove -----------------------------------------------------
printf '%s\n' "$PATHS" | while read -r p; do
  mkdir -p "$NG/packages/engines/$(dirname "$p")"
  git -C "$ENG" cat-file blob "$FULL:$p" > "$NG/packages/engines/$p"
  if [ -x "$EXP/$p" ]; then chmod 755 "$NG/packages/engines/$p"; fi
done

echo "SHA-IDENTITY, four independent proofs per path:"
printf '%-52s %-5s %-7s %-4s %-12s %s\n' PATH blob sha256 cmp bytes VERDICT
printf '%s\n' "$PATHS" | while read -r p; do
  a="$EXP/$p"; b="$NG/packages/engines/$p"
  ba=$(git -C "$ENG" rev-parse "$FULL:$p")
  bb=$(git hash-object "$b")
  sa=$(sha256sum "$a" | cut -d' ' -f1); sb=$(sha256sum "$b" | cut -d' ' -f1)
  ca=$(wc -c < "$a"); cb=$(wc -c < "$b")
  v1=$([ "$ba" = "$bb" ] && echo yes || echo NO)
  v2=$([ "$sa" = "$sb" ] && echo yes || echo NO)
  v3=$(cmp -s "$a" "$b" && echo yes || echo NO)
  v4=$([ "$ca" = "$cb" ] && echo yes || echo NO)
  verdict=IDENTICAL
  for v in "$v1" "$v2" "$v3" "$v4"; do [ "$v" = NO ] && verdict=DEVIATES; done
  printf '%-52s %-5s %-7s %-4s %-12s %s\n' "$p" "$v1" "$v2" "$v3" "$ca/$cb" "$verdict"
  [ "$verdict" = IDENTICAL ] || exit 1
done
echo
echo "$N paths x 4 checks = $((N*4)) proofs, all IDENTICAL against engines ${FULL:0:7}"

# ---- the ledger: pin and manifest ----------------------------------------
{
  printf '# Canonical petrolord-engines tree at the commit pinned in VENDOR.json.\n'
  printf '# Generated, do not hand edit: node tools/check-vendored-engines.mjs --canonical <clone> verifies it.\n'
  printf '# commit %s\n' "$FULL"
  git -C "$ENG" ls-tree -r "$FULL" | awk '{print $3" "$4}'
} > "$NG/packages/engines/VENDOR.manifest"
python3 - "$NG/packages/engines/VENDOR.json" "$FULL" <<'PY'
import json, sys
p, full = sys.argv[1], sys.argv[2]
v = json.load(open(p))
old = v['canonical']['commit']
v['canonical']['commit'] = full
open(p, 'w').write(json.dumps(v, indent=2, ensure_ascii=False) + '\n')
print(f'  VENDOR.json canonical.commit {old[:7]} -> {full[:7]}')
PY
echo "  VENDOR.manifest regenerated at ${FULL:0:7}: $(grep -vc '^#' "$NG/packages/engines/VENDOR.manifest") paths"
echo
cd "$NG" && node tools/check-vendored-engines.mjs --canonical "$ENG"
