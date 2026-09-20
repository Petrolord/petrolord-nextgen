#!/usr/bin/env bash
# VENDOR THE H1 SAFETYSTATS CLOSURE INTO NEXTGEN, SHA-IDENTICAL, AND PROVE IT.
#
# Adapted from FC9's vendor_corrosion.sh. The closure is WALKED FROM THE JEST
# SUITE AS THE ONLY SEED, not listed from expectation, and the paths the walk
# cannot reach (the oracle that writes the golden, the FINDINGS record and the
# negative-control script that produced the FINDINGS table) are NAMED with the
# reason they travel.
#
# THE WALK RUNS OVER AN EXPORT OF THE COMMIT, never over a working tree:
# /root/petrolord-engines is a shared clone whose checked-out branch is whatever
# the last session left it on, so reading files from it would vendor a branch
# rather than a commit. `git archive $REV` is the commit and nothing else.
#
# Four independent proofs per path: the git blob hash, a sha256 over the bytes,
# a byte-for-byte cmp, and a byte COUNT on both sides.
#
# TWO PASSES, TWO LEDGER MODES.
#   Pass 1 (engines PR #216, f123a57) MOVED THE PIN 5cbdca5 -> f123a57: that
#   canonical move changed only README.md (ledgered group 7) and the six new
#   hse paths, so no live course's graded value moved.
#   Pass 2 (engines PR #222, 980199e) DOES NOT MOVE THE PIN. f123a57..980199e
#   also carries engines/economics/screening.js, the downstream engines and the
#   H2/H3 hse engines; moving the pin would reopen live graded economics values
#   and ledger other branches' paths. So the closure is vendored sha-identical
#   from REV while the pin stays where VENDOR.json has it, and every closure
#   path whose blob now differs from the pinned manifest is ledgered in
#   VENDOR.json as kind "differing", group "h1-safetystats-course", pinned to
#   its vendored blob. Only entries in that group are touched; a closure path
#   back in step with the manifest has its entry removed, so the guard never
#   sees it STALE.
# REV=<sha> vendors another commit. When REV equals the pin the script also
# regenerates VENDOR.manifest from the clone, as pass 1 did.
set -euo pipefail
ENG=/root/petrolord-engines
NG=${NG:-/root/wt-h1-nextgen}
PIN=$(python3 -c "import json,sys;print(json.load(open(sys.argv[1]))['canonical']['commit'])" "$NG/packages/engines/VENDOR.json")
REV=${REV:-980199ed}
FULL=$(git -C "$ENG" rev-parse "$REV^{commit}")
EXP=$(mktemp -d)
trap 'rm -rf "$EXP"' EXIT
git -C "$ENG" archive "$FULL" | tar -x -C "$EXP"

echo "PIN ${PIN:0:7}, VENDORING FROM ${FULL:0:7}"
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
# Every safetyStats path in the commit must be in the closure, so nothing of
# this engine is silently left behind. Scoped to safetyStats: from 870cc8f on,
# engines/hse also holds the H2 exposure and H3 LOPA engines, which their own
# courses vendor.
SS_ALL=$(git -C "$ENG" ls-tree -r --name-only "$FULL" | grep -iE 'safetystats' | sort)
MISSED=$(comm -23 <(printf '%s\n' "$SS_ALL") <(printf '%s\n' "$PATHS") || true)
if [ -n "$MISSED" ]; then echo "REFUSES: safetyStats paths in ${FULL:0:7} outside the closure: $MISSED"; exit 1; fi
echo "  every safetyStats path at ${FULL:0:7} is in the closure"
echo
echo "WHAT MOVES against the pin ${PIN:0:7}, closure paths only:"
printf '%s\n' "$PATHS" | xargs git -C "$ENG" diff --stat "$PIN" "$FULL" -- | sed 's/^/  /'
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

# ---- the ledger ------------------------------------------------------------
if [ "$FULL" = "$PIN" ]; then
  {
    printf '# Canonical petrolord-engines tree at the commit pinned in VENDOR.json.\n'
    printf '# Generated, do not hand edit: node tools/check-vendored-engines.mjs --canonical <clone> verifies it.\n'
    printf '# commit %s\n' "$FULL"
    git -C "$ENG" ls-tree -r "$FULL" | awk '{print $3" "$4}'
  } > "$NG/packages/engines/VENDOR.manifest"
  echo "  VENDOR.manifest regenerated at ${FULL:0:7}: $(grep -vc '^#' "$NG/packages/engines/VENDOR.manifest") paths"
fi
LEDGER_PY=$(mktemp)
trap 'rm -rf "$EXP" "$LEDGER_PY"' EXIT
cat > "$LEDGER_PY" <<'PY'
import json, subprocess, sys
vj, man, ng, full = sys.argv[1:5]
paths = [l for l in sys.stdin.read().split('\n') if l]
GROUP = 'h1-safetystats-course'
canon = {}
for line in open(man):
    if line.startswith('#') or not line.strip():
        continue
    sha, p = line.rstrip('\n').split(' ', 1)
    canon[p] = sha
v = json.load(open(vj))
pin = v['canonical']['commit']
devs = v['knownDeviations']
foreign = [e['path'] for e in devs if e['path'] in paths and e.get('group') != GROUP]
if foreign:
    sys.exit(f'REFUSES: closure paths ledgered by another group: {foreign}')
keep = [e for e in devs if not (e.get('group') == GROUP and e['path'] in paths)]
added = []
for p in paths:
    blob = subprocess.check_output(['git', 'hash-object', f'{ng}/packages/engines/{p}'], text=True).strip()
    if p not in canon:
        sys.exit(f'REFUSES: {p} is not in the pinned manifest; this script ledgers differing paths only')
    if canon[p] == blob:
        continue
    added.append({
        'path': p, 'kind': 'differing', 'group': GROUP, 'vendoredSha': blob,
        'reason': (f"H1 safetystats course: vendored sha-identical from petrolord-engines {full[:7]} "
                   f"(PR #222: pseRate base hint, Garwood upper-tail rationale, 16 tiny-q golden cases) by the wave's "
                   f"vendor_safetystats.sh, 4 proofs per path. Differing only because the canonical pin stays at {pin[:7]}: "
                   f"moving it would also move engines/economics/screening.js and other domains. Clears as STALE when the "
                   f"pin moves to {full[:7]} or later."),
    })
v['knownDeviations'] = keep + added
open(vj, 'w').write(json.dumps(v, indent=2, ensure_ascii=False) + '\n')
print(f'  VENDOR.json: pin {pin[:7]} unchanged; group {GROUP}: {len(added)} differing path(s) ledgered')
for e in added:
    print(f"    {e['path']}  {e['vendoredSha'][:12]}")
PY
printf '%s\n' "$PATHS" | python3 "$LEDGER_PY" "$NG/packages/engines/VENDOR.json" "$NG/packages/engines/VENDOR.manifest" "$NG" "$FULL"
echo
# The guard reads blobs from the INDEX (git ls-files -s), so the closure and the
# ledger are staged by path first; nothing outside them is touched.
printf '%s\n' "$PATHS" | sed 's|^|packages/engines/|' | xargs git -C "$NG" add -- packages/engines/VENDOR.json packages/engines/VENDOR.manifest
cd "$NG" && node tools/check-vendored-engines.mjs --canonical "$ENG"
