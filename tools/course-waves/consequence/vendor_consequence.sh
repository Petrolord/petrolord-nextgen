#!/usr/bin/env bash
# VENDOR THE H4 CONSEQUENCE CLOSURE AT ENGINES 16fd6c9 AND PROVE IT.
# Adapted from H3 vendor_lopa.sh.
#
# NextGen main fdca1bf40 already carried the consequence closure at the
# canonical pin df31f53 (the Commercial & Trading vendor, nextgen #165). Engines
# PR #231 (own-property preset lookups, merged as 16fd6c9) then touched two
# closure paths, engines/hse/consequence.js and FINDINGS-consequence.md, with no
# golden or numeric output moved. `--copy` writes every closure path from $REV
# (the two changed paths are the only ones that differ); without it the script
# only WALKS the closure from the jest suite, as the H3 vendor did, and runs the
# four proofs a path against $REV. The canonical pin stays at df31f53 and the
# two paths are ledgered in VENDOR.json as differing, group
# 8-h4-consequence-revendor, each pinned to its vendored blob.
#
# Four independent proofs per path: the git blob hash, a sha256 over the bytes,
# a byte-for-byte cmp, and a byte COUNT on both sides.
set -euo pipefail
ENG=${H4_ENGINES_SRC:-/root/petrolord-engines}
NG=${H4_NEXTGEN:-/root/wt-h4-nextgen}
REV=${H4_ENGINES_REV:-16fd6c9}
COPY=0
[ "${1:-}" = "--copy" ] && COPY=1

cd "$ENG"

# ---- the walk ------------------------------------------------------------
SEED=__tests__/hse.consequence.test.js
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
  "tools/validation/hse/oracle_consequence.py:writes the golden the suite reads (numpy and scipy, routes A and B)" \
  "tools/validation/hse/FINDINGS-consequence.md:the record of sources, published goldens, errata, judgement calls, dropped scope and doubts" \
  "tools/validation/hse/negcontrol_consequence.sh:the negative controls FINDINGS section 8 reports (mode 755 upstream, kept)"; do
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
[ "$COPY" = 1 ] && printf '%s\n' "$PATHS" | while read -r p; do
  mkdir -p "$NG/packages/engines/$(dirname "$p")"
  git cat-file blob "$REV:$p" > "$NG/packages/engines/$p"
  mode=$(git ls-tree "$REV" -- "$p" | cut -d' ' -f1)
  if [ "$mode" = 100755 ]; then chmod 755 "$NG/packages/engines/$p"; else chmod 644 "$NG/packages/engines/$p"; fi
done

echo "SHA-IDENTITY, four independent proofs per path:"
printf '%-58s %-10s %-10s %-5s %-10s %s\n' PATH blob sha256 cmp bytes VERDICT
printf '%s\n' "$PATHS" | while read -r p; do
  a=$(mktemp); git -C "$ENG" cat-file blob "$REV:$p" > "$a"; b="$NG/packages/engines/$p"
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
