#!/bin/sh
# GATE: the digest reproduces from its generators, byte for byte, twice in a
# row and under four time zones (the brief's UTC, Africa/Lagos,
# Pacific/Kiritimati, UTC+14, and Pacific/Pago_Pago, UTC-11, the widest spread
# there is). Prints every comparison it made.
#
# NEGATIVE CONTROL: MD_PLANT_TZ=1 makes the generator print one line that reads
# the local time zone offset (the plant lives in crude_dump.mjs and is never set
# in a build). The sweep must see it move, or it could not have seen a real one.
W=/root/md-wip-crude
T=$W/scratch/repro.$$
fail=0
for z in UTC UTC Africa/Lagos Pacific/Kiritimati Pacific/Pago_Pago; do
  DIGEST_TZ=$z $W/build_digest.sh 2>/dev/null > $T
  off=$(TZ=$z date +%z)
  if cmp -s $T $W/digest.txt; then echo "  TZ=$z (offset $off): byte-identical, $(wc -l < $T) lines, md5 $(md5sum < $T | cut -c1-12)"; else echo "  TZ=$z (offset $off): DIFFERS"; fail=1; fi
done
MD_PLANT_TZ=1 DIGEST_TZ=UTC $W/build_digest.sh 2>/dev/null > $T.utc
for z in Africa/Lagos Pacific/Kiritimati Pacific/Pago_Pago; do
  MD_PLANT_TZ=1 DIGEST_TZ=$z $W/build_digest.sh 2>/dev/null > $T
  if cmp -s $T $T.utc; then echo "  control: with a planted zone read, TZ=$z builds the SAME bytes as UTC, so the sweep could not see one"; fail=1; else echo "  control: with a planted zone read, TZ=$z differs from UTC in $(diff $T $T.utc | grep -c '^<') line(s), so the sweep can see the defect"; fi
done
rm -f $T.utc
rm -f $T
[ -x $W/build_digest.sh ] && echo "  build_digest.sh is executable" || { echo "  build_digest.sh is NOT executable"; fail=1; }
[ $fail -eq 0 ] && echo "gate_repro: PASS" || echo "gate_repro: FAIL"
exit $fail
