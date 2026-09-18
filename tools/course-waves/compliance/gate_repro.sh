#!/bin/sh
# GATE: the digest reproduces from its generators, byte for byte, twice in a
# row and under three time zones. Prints every comparison it made.
W=/root/as-wip-compliance
fail=0
for z in UTC UTC Africa/Lagos Pacific/Kiritimati America/Los_Angeles Pacific/Pago_Pago; do
  DIGEST_TZ=$z $W/build_digest.sh 2>/dev/null > /tmp/cq-repro.$$
  off=$(TZ=$z date +%z)
  if cmp -s /tmp/cq-repro.$$ $W/digest.txt; then echo "  TZ=$z (offset $off): byte-identical, $(wc -l < /tmp/cq-repro.$$) lines, md5 $(md5sum < /tmp/cq-repro.$$ | cut -c1-12)"; else echo "  TZ=$z (offset $off): DIFFERS"; fail=1; fi
done
# NEGATIVE CONTROL: the as-of date built by a UTC parse must move the digest
# west of Greenwich, or the zone sweep above could not have seen that defect.
CQ_PLANT_UTC=1 DIGEST_TZ=America/Los_Angeles $W/build_digest.sh 2>/dev/null > /tmp/cq-repro.$$
if cmp -s /tmp/cq-repro.$$ $W/digest.txt; then echo "  control: a UTC-parsed as-of date under TZ=America/Los_Angeles did NOT move the digest"; fail=1; else echo "  control: a UTC-parsed as-of date under TZ=America/Los_Angeles moves $(diff /tmp/cq-repro.$$ $W/digest.txt | grep -c '^<') lines, so the sweep can see the defect"; fi
rm -f /tmp/cq-repro.$$
[ -x $W/build_digest.sh ] && echo "  build_digest.sh is executable" || { echo "  build_digest.sh is NOT executable"; fail=1; }
[ $fail -eq 0 ] && echo "gate_repro: PASS" || echo "gate_repro: FAIL"
exit $fail
