#!/bin/sh
# GATE: the digest reproduces from its generators, byte for byte, twice in a
# row and under seven time zones, the four the brief names (UTC, Africa/Lagos,
# Pacific/Kiritimati, Pacific/Pago_Pago) plus America/New_York and
# America/Los_Angeles, whose spring clock change falls inside the period, and
# Europe/London. Prints every comparison it made.
W=/root/md-wip-refinery
T=$W/.repro.$$
fail=0
for z in UTC UTC Africa/Lagos Pacific/Kiritimati Pacific/Pago_Pago America/New_York America/Los_Angeles Europe/London; do
  DIGEST_TZ=$z $W/build_digest.sh 2>/dev/null > $T
  off=$(TZ=$z date +%z)
  if [ -s $T ] && cmp -s $T $W/digest.txt; then echo "  TZ=$z (offset $off): byte-identical, $(wc -l < $T) lines, md5 $(md5sum < $T | cut -c1-12)"; else echo "  TZ=$z (offset $off): DIFFERS"; fail=1; fi
done
# NEGATIVE CONTROL: the period start handed over as a Date at LOCAL midnight
# must move the digest east of Greenwich, or the zone sweep above could not
# have seen that defect.
MD_PLANT_LOCAL=1 DIGEST_TZ=Africa/Lagos $W/build_digest.sh 2>/dev/null > $T
if cmp -s $T $W/digest.txt; then echo "  control: a local-midnight period start under TZ=Africa/Lagos did NOT move the digest"; fail=1; else echo "  control: a local-midnight period start under TZ=Africa/Lagos moves $(diff $T $W/digest.txt | grep -c '^<') lines, so the sweep can see the defect"; fi
rm -f $T
[ -x $W/build_digest.sh ] && echo "  build_digest.sh is executable" || { echo "  build_digest.sh is NOT executable"; fail=1; }
[ $fail -eq 0 ] && echo "gate_repro: PASS" || echo "gate_repro: FAIL"
exit $fail
