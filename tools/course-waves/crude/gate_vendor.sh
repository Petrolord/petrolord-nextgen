#!/bin/sh
# GATE: every file this wave teaches from is vendored sha-identical with the
# canonical engines commit the shared vendor commit pins (60ee266). This wave
# does not re-vendor; it proves the base it stands on. The comparison is against
# `git show 60ee266:<path>` in /root/petrolord-engines, read-only.
E=/root/petrolord-engines
V=${MD_ENGINES:-/root/wt-md-crude-nextgen/packages/engines}
PIN=60ee266
fail=0; n=0
for p in engines/downstream/crudeAssay.js engines/downstream/productBlending.js lib/lp/simplex.js \
  tools/validation/downstream/oracle_crudeassay.py tools/validation/downstream/oracle_productblending.py \
  tools/validation/downstream/oracle_lp.py tools/validation/downstream/exact_simplex.py \
  tools/validation/downstream/FINDINGS-crude.md tools/validation/downstream/negcontrol_md1.sh \
  test-data/downstream/goldens/crudeassay_cases.json test-data/downstream/goldens/productblending_cases.json \
  test-data/downstream/goldens/lp_cases.json \
  __tests__/downstream.crudeAssay.test.js __tests__/downstream.crudeAssay.golden.test.js \
  __tests__/downstream.productBlending.test.js __tests__/downstream.productBlending.golden.test.js; do
  n=$((n + 1))
  a=$(git -C $E show $PIN:$p 2>/dev/null | sha256sum | cut -c1-16)
  b=$(sha256sum < $V/$p 2>/dev/null | cut -c1-16)
  if [ -n "$a" ] && [ "$a" = "$b" ]; then :; else echo "  DIFFERS or MISSING: $p (canonical $a, vendored $b)"; fail=1; fi
done
lp=$(ls $V/__tests__/ | grep -c '^lp\.simplex')
echo "  $n paths compared against engines $PIN: $( [ $fail -eq 0 ] && echo 'all sha-identical' || echo 'NOT all identical')"
echo "  lp.simplex jest suites vendored: $lp"
[ $fail -eq 0 ] && echo "gate_vendor: PASS" || echo "gate_vendor: FAIL"
exit $fail
