#!/bin/sh
# GATE: the digest reproduces from its generators, byte for byte, twice in a
# row and under five time zones: UTC, Africa/Lagos, Pacific/Kiritimati
# (UTC+14), Pacific/Pago_Pago (UTC-11) and America/Los_Angeles. Prints every
# comparison it made.
W=/root/md-wip-supply
fail=0
mkdir -p $W/scratch; T=$(mktemp -p $W/scratch)
for z in UTC UTC Africa/Lagos Pacific/Kiritimati Pacific/Pago_Pago America/Los_Angeles; do
  DIGEST_TZ=$z $W/build_digest.sh 2>/dev/null > $T
  off=$(TZ=$z date +%z)
  if cmp -s $T $W/digest.txt; then echo "  TZ=$z (offset $off): byte-identical, $(wc -l < $T) lines, md5 $(md5sum < $T | cut -c1-12)"; else echo "  TZ=$z (offset $off): DIFFERS"; fail=1; fi
done
# NEGATIVE CONTROL: a line that reads the zone (a local midnight printed as a
# UTC instant) must move the digest between two zones, or the sweep above
# could not have seen a zone-dependent figure.
MD_PLANT_TZ=1 DIGEST_TZ=Pacific/Kiritimati $W/build_digest.sh 2>/dev/null > $T.a
MD_PLANT_TZ=1 DIGEST_TZ=Pacific/Pago_Pago $W/build_digest.sh 2>/dev/null > $T.b
if cmp -s $T.a $T.b; then echo "  control: a zone-reading line did NOT move the digest between Kiritimati and Pago Pago"; fail=1; else echo "  control: a zone-reading line moves $(diff $T.a $T.b | grep -c '^<') line(s) between Kiritimati and Pago Pago, so the sweep can see the defect"; fi
rm -f $T $T.a $T.b
[ -x $W/build_digest.sh ] && echo "  build_digest.sh is executable" || { echo "  build_digest.sh is NOT executable"; fail=1; }
[ $fail -eq 0 ] && echo "gate_repro: PASS" || echo "gate_repro: FAIL"
exit $fail
