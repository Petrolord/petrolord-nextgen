#!/usr/bin/env bash
# VENDOR THE H5 QRA CLOSURE INTO NEXTGEN, SHA-IDENTICAL, AND PROVE IT.
# Adapted from H3 vendor_lopa.sh. Engines 16fd6c9 is petrolord-engines main
# after PR #230 (engines/hse/qra.js, merged as abb41c3) and PR #231 (own
# property preset lookups). The six qra paths are byte-identical between
# abb41c3 and 16fd6c9 (checked by blob hash when this wave was cut).
#
# THE CANONICAL PIN IS 16fd6c9. This wave first ledgered the six qra paths as
# extras against main's older pin df31f53; nextgen #176 then moved the pin to
# 16fd6c9, which carries them canonically, and the merge took main's
# VENDOR.json whole. Re-run now, this script COPIES the six qra paths (a no-op
# when they are already vendored, proved byte for byte) and PROVES the other
# eight closure paths are vendored at the same blob as 16fd6c9 and the pin.
#
# RE-PINNED TO e972ae7 (engines #232, nextgen b3 re-vendor, 2026-09-21). #232
# changes engines/hse/qra.js (the occupancy refusal names the field typed),
# the suite and FINDINGS-qra.md, and moves no qra graded value. Run at
# 16fd6c9 this script would copy the older qra.js back over the vendored one,
# so REV and PIN follow the canonical pin in VENDOR.json.
#
# The engines clone is read-only: the tree is read from a `git archive`
# export of REV into a throwaway directory, and the blob hashes from the clone.
#
# Four independent proofs per copied path, because one hash function agreeing
# with itself is one proof repeated: the git blob hash, a sha256 over the
# bytes, a byte-for-byte cmp, and a byte COUNT on both sides.
set -euo pipefail
GITDIR=${H5_ENGINES_GIT:-/root/petrolord-engines}
if [ -n "${H5_ENGINES_SRC:-}" ]; then ENG=$H5_ENGINES_SRC; else
  ENG=$(mktemp -d /tmp/h5eng.XXXXXX); trap 'rm -rf "$ENG"' EXIT
  git -C "$GITDIR" archive e972ae755ed8599031e430968b95853a9e163f86 | tar -x -C "$ENG"
fi
NG=${H5_NEXTGEN:-/root/wt-h5-nextgen}
REV=e972ae755ed8599031e430968b95853a9e163f86
PIN=e972ae755ed8599031e430968b95853a9e163f86
COPY="__tests__/hse.qra.test.js engines/hse/qra.js test-data/hse/goldens/qra_cases.json tools/validation/hse/oracle_qra.py tools/validation/hse/FINDINGS-qra.md tools/validation/hse/negcontrol_qra.sh"

cd "$ENG"

# ---- the walk ------------------------------------------------------------
SEED=__tests__/hse.qra.test.js
echo "CLOSURE WALK, seed: $SEED"
declare -A CLOSURE=()
declare -a QUEUE=("$SEED")
CLOSURE[$SEED]="the jest suite, the seed"
while [ ${#QUEUE[@]} -gt 0 ]; do
  cur="${QUEUE[0]}"; QUEUE=("${QUEUE[@]:1}")
  dir=$(dirname "$cur")
  # ES imports and CJS requires with a relative specifier
  while read -r spec; do
    [ -z "$spec" ] && continue
    case "$spec" in ./*|../*) ;; *) continue ;; esac
    for cand in "$spec" "$spec.js" "$spec.ts" "$spec.mjs" "$spec.cjs" "$spec/index.js"; do
      res=$(cd "$dir" && realpath -m --relative-to="$ENG" "$cand" 2>/dev/null || true)
      if [ -n "$res" ] && [ -f "$ENG/$res" ]; then
        if [ -z "${CLOSURE[$res]+x}" ]; then
          CLOSURE[$res]="imported by $cur"; QUEUE+=("$res")
        fi
        break
      fi
    done
  done < <(grep -oE "(from|require\()\s*['\"][^'\"]+['\"]" "$cur" | grep -oE "['\"][^'\"]+['\"]" | tr -d "'\"")
  # runtime file reads: path.join(__dirname, '..', 'a', 'b') and plain strings
  while read -r joined; do
    [ -z "$joined" ] && continue
    res=$(cd "$dir" && realpath -m --relative-to="$ENG" "$joined" 2>/dev/null || true)
    if [ -n "$res" ] && [ -f "$ENG/$res" ] && [ -z "${CLOSURE[$res]+x}" ]; then
      CLOSURE[$res]="read at runtime by $cur"; QUEUE+=("$res")
    fi
  done < <(python3 - "$cur" <<'PY'
import re, sys
src = open(sys.argv[1], encoding='utf-8').read()
# every path.join(...) argument list made only of __dirname and string literals
for m in re.finditer(r'path\.join\(\s*__dirname\s*,([^)]*)\)', src, re.S):
    parts = re.findall(r"'([^']*)'|\"([^\"]*)\"", m.group(1))
    segs = [a or b for a, b in parts]
    if segs:
        print('/'.join(segs))
PY
)
done

# The repair's own record travels with the closure: the oracle that writes the
# golden, and the two markdown records that say what the repair did and found.
# They are not IMPORTED by anything, so the walk cannot reach them; they are
# named here with the reason, which is the honest way to add to a closure.
for extra in \
  "tools/validation/hse/oracle_qra.py:writes the golden the suite reads (route A floats and exact Fractions, route B grids, closed forms and a seeded Monte Carlo sanity check)" \
  "tools/validation/hse/FINDINGS-qra.md:the record of sources, published goldens, errata, judgement calls, fail-opens and doubts the suite header cites" \
  "tools/validation/hse/negcontrol_qra.sh:the negative controls FINDINGS section 8 reports (mode 755 upstream, kept)"; do
  p="${extra%%:*}"; why="${extra#*:}"
  [ -f "$ENG/$p" ] || { echo "REFUSES: named closure member $p is not in the engines tree"; exit 1; }
  [ -z "${CLOSURE[$p]+x}" ] && CLOSURE[$p]="NAMED, not walked: $why"
done

PATHS=$(printf '%s\n' "${!CLOSURE[@]}" | sort)
N=$(printf '%s\n' "$PATHS" | grep -c .)
echo "  closure size: $N paths"
printf '%s\n' "$PATHS" | while read -r p; do printf '    %-58s %s\n' "$p" "${CLOSURE[$p]}"; done
echo

# ---- copy and prove -----------------------------------------------------
for p in $COPY; do
  [ -n "${CLOSURE[$p]+x}" ] || { echo "REFUSES: $p is to be copied and the walk did not reach it"; exit 1; }
  mkdir -p "$NG/packages/engines/$(dirname "$p")"
  git -C "$GITDIR" cat-file blob "$REV:$p" > "$NG/packages/engines/$p"
  mode=$(git -C "$GITDIR" ls-tree "$REV" -- "$p" | cut -d' ' -f1)
  if [ "$mode" = 100755 ]; then chmod 755 "$NG/packages/engines/$p"; else chmod 644 "$NG/packages/engines/$p"; fi
done

echo "SHA-IDENTITY OF THE SIX COPIED PATHS, four independent proofs per path:"
printf '%-58s %-5s %-6s %-5s %-12s %s\n' PATH blob sha256 cmp bytes VERDICT
COPIED=0
for p in $COPY; do
  a="$ENG/$p"; b="$NG/packages/engines/$p"
  ba=$(git -C "$GITDIR" rev-parse "$REV:$p")
  bb=$(git hash-object "$b")
  sa=$(sha256sum "$a" | cut -d' ' -f1); sb=$(sha256sum "$b" | cut -d' ' -f1)
  ca=$(wc -c < "$a"); cb=$(wc -c < "$b")
  v1=$([ "$ba" = "$bb" ] && echo yes || echo NO)
  v2=$([ "$sa" = "$sb" ] && echo yes || echo NO)
  v3=$(cmp -s "$a" "$b" && echo yes || echo NO)
  v4=$([ "$ca" = "$cb" ] && echo yes || echo NO)
  verdict=IDENTICAL
  for v in "$v1" "$v2" "$v3" "$v4"; do [ "$v" = NO ] && verdict=DEVIATES; done
  printf '%-58s %-5s %-6s %-5s %-12s %s\n' "$p" "$v1" "$v2" "$v3" "$ca/$cb" "$verdict"
  [ "$verdict" = IDENTICAL ] || exit 1
  mu=$(git -C "$GITDIR" ls-tree "$REV" -- "$p" | cut -d' ' -f1)
  mv=$([ -x "$b" ] && echo 100755 || echo 100644)
  [ "$mu" = "$mv" ] || { echo "REFUSES: mode of $p is $mv, upstream $mu"; exit 1; }
  COPIED=$((COPIED + 1))
done
echo "  $COPIED paths x 4 proofs = $((COPIED * 4)), all IDENTICAL against engines $REV, modes as upstream"
echo

echo "THE REST OF THE CLOSURE, NOT COPIED, proved against what NextGen already vendors:"
REST_SAME=0; REST_DIFF=0
while read -r p; do
  case " $COPY " in *" $p "*) continue ;; esac
  v=$(git hash-object "$NG/packages/engines/$p" 2>/dev/null || echo ABSENT)
  up=$(git -C "$GITDIR" rev-parse "$REV:$p")
  pin=$(git -C "$GITDIR" rev-parse "$PIN:$p" 2>/dev/null || echo ABSENT)
  if [ "$v" = "$up" ]; then
    printf '    %-50s vendored = %s, %s\n' "$p" "${REV:0:7}" "$([ "$v" = "$pin" ] && echo 'the same blob as the pin' || echo 'NOT the pin')"
    REST_SAME=$((REST_SAME + 1))
  elif [ "$v" = "$pin" ]; then
    printf '    %-50s vendored = the pin %s; %s differs (%s)\n' "$p" "${PIN:0:7}" "${REV:0:7}" "$(git -C "$GITDIR" log --oneline -1 "$PIN..$REV" -- "$p" | cut -c1-60)"
    REST_DIFF=$((REST_DIFF + 1))
  else
    echo "REFUSES: $p is vendored at $v, which is neither $REV ($up) nor the pin ($pin)"; exit 1
  fi
done < <(printf '%s\n' "$PATHS")
echo "  $REST_SAME closure paths already vendored at $REV, $REST_DIFF at the pin only (named above)"
