#!/usr/bin/env bash
# VENDOR THE H3 LOPA CLOSURE INTO NEXTGEN, SHA-IDENTICAL, AND PROVE IT.
# Adapted from H2 vendor_hygiene.sh. Engines 6703c00 is petrolord-engines
# main after PR #218 (engines/hse/lopa.js); the six lopa paths are
# byte-identical at every later main commit up to b43f1d9 (checked by blob
# hash when this wave was cut). The canonical pin in VENDOR.json is NOT moved:
# the six paths are ledgered as extra, group h3-lopa-course, each pinned to its
# vendored blob. H1 (safetystats) moves the pin on its own branch and H2
# (hygiene) ledgers its own extras; entries keyed by path, inserted away from
# H2's block, merge trivially with both.
#
# The closure is WALKED FROM THE JEST SUITE AS THE ONLY SEED, not listed from
# expectation. FC4's closure was ten paths where four were expected, so the walk is the authority and the expected list is only printed
# beside it.
#
# Four independent proofs per path, because one hash function agreeing with
# itself is one proof repeated: the git blob hash (sha1 over "blob <len>\0" +
# bytes), a sha256 over the bytes, a byte-for-byte cmp, and a byte COUNT on
# both sides. A copy that passes all four and a count that disagrees is
# impossible, which is the point of carrying the count.
set -euo pipefail
ENG=${H3_ENGINES_SRC:-/root/wt-h3-engines}
NG=${H3_NEXTGEN:-/root/wt-h3-nextgen}
REV=6703c00

cd "$ENG"

# ---- the walk ------------------------------------------------------------
SEED=__tests__/hse.lopa.test.js
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
    for cand in "$spec" "$spec.js" "$spec.mjs" "$spec.cjs" "$spec/index.js"; do
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
  "tools/validation/hse/oracle_lopa.py:writes the golden the suite reads (stdlib only, route A exact rationals and route B quadrature)" \
  "tools/validation/hse/FINDINGS-lopa.md:the record of sources, published goldens, inferred inputs, route B departures and doubts the suite header cites" \
  "tools/validation/hse/negcontrol_lopa.sh:the negative controls FINDINGS section 6 reports (mode 755 upstream, kept)"; do
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
OK=0; BAD=0
printf '%s\n' "$PATHS" | while read -r p; do
  mkdir -p "$NG/packages/engines/$(dirname "$p")"
  git cat-file blob "$REV:$p" > "$NG/packages/engines/$p"
  mode=$(git ls-tree "$REV" -- "$p" | cut -d' ' -f1)
  if [ "$mode" = 100755 ]; then chmod 755 "$NG/packages/engines/$p"; else chmod 644 "$NG/packages/engines/$p"; fi
done

echo "SHA-IDENTITY, four independent proofs per path:"
printf '%-58s %-10s %-10s %-5s %-10s %s\n' PATH blob sha256 cmp bytes VERDICT
printf '%s\n' "$PATHS" | while read -r p; do
  a="$ENG/$p"; b="$NG/packages/engines/$p"
  ba=$(git -C "$ENG" rev-parse "$REV:$p")
  bb=$(git hash-object "$b")
  sa=$(sha256sum "$a" | cut -d' ' -f1); sb=$(sha256sum "$b" | cut -d' ' -f1)
  ca=$(wc -c < "$a"); cb=$(wc -c < "$b")
  v1=$([ "$ba" = "$bb" ] && echo yes || echo NO)
  v2=$([ "$sa" = "$sb" ] && echo yes || echo NO)
  v3=$(cmp -s "$a" "$b" && echo yes || echo NO)
  v4=$([ "$ca" = "$cb" ] && echo yes || echo NO)
  verdict=IDENTICAL
  for v in "$v1" "$v2" "$v3" "$v4"; do [ "$v" = NO ] && verdict=DEVIATES; done
  printf '%-58s %-10s %-10s %-5s %-10s %s\n' "$p" "$v1" "$v2" "$v3" "$ca/$cb" "$verdict"
  [ "$verdict" = IDENTICAL ] || exit 1
done
echo
echo "MODE, upstream against vendored:"
printf '%s\n' "$PATHS" | while read -r p; do
  mu=$(git ls-tree "$REV" -- "$p" | cut -d' ' -f1)
  mv=$([ -x "$NG/packages/engines/$p" ] && echo 100755 || echo 100644)
  printf '    %-58s %s %s %s\n' "$p" "$mu" "$mv" "$([ "$mu" = "$mv" ] && echo same || echo DIFFERS)"
  [ "$mu" = "$mv" ] || exit 1
done
echo "$N paths x 4 checks = $((N*4)) proofs, all IDENTICAL against engines $REV"
