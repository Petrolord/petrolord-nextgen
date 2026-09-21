#!/bin/sh
# GATE: every file this wave teaches from is vendored sha-identical with the
# canonical engines commit the re-vendor pins (e972ae7: MD45-1, after MD4-0 and
# MD5-0, with engines #229 and the #232 copy pass; the wave was cut on df31f53).
# This wave does not re-vendor; it proves the base it stands on. The
# comparison is against `git show e972ae7:<path>` in /root/petrolord-engines,
# read-only.
E=/root/petrolord-engines
V=${ET_ENGINES:-/root/wt-et-gasvalue-nextgen/packages/engines}
PIN=e972ae7
fail=0; n=0
for p in engines/downstream/flareToValue.js engines/downstream/lpgCng.js engines/downstream/modularRefinery.js \
  engines/downstream/terminalDepot.js engines/production/gasProperties.js engines/facilities/compression.js \
  tools/validation/downstream/oracle_flaretovalue.py tools/validation/downstream/oracle_lpgcng.py \
  tools/validation/downstream/FINDINGS-gasvalue.md tools/validation/downstream/negcontrol_md4.sh \
  test-data/downstream/goldens/flaretovalue_cases.json test-data/downstream/goldens/lpgcng_cases.json \
  __tests__/downstream.flareToValue.test.js __tests__/downstream.lpgCng.test.js \
  __tests__/downstream.gasvalue.golden.test.js; do
  n=$((n + 1))
  a=$(git -C $E show $PIN:$p 2>/dev/null | sha256sum | cut -c1-16)
  b=$(sha256sum < $V/$p 2>/dev/null | cut -c1-16)
  if [ -n "$a" ] && [ "$a" = "$b" ]; then :; else echo "  DIFFERS or MISSING: $p (canonical $a, vendored $b)"; fail=1; fi
done
echo "  $n paths compared against engines $PIN: $( [ $fail -eq 0 ] && echo 'all sha-identical' || echo 'NOT all identical')"
[ $fail -eq 0 ] && echo "gate_vendor: PASS" || echo "gate_vendor: FAIL"
exit $fail
