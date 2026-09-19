#!/bin/sh
# GATE: nothing this wave prints or grades reads a clock or a random number.
#  1. THE SOURCES. terminalDepot.js and fuelPricing.js, the only engine modules
#     this wave calls, contain no Date, no Math.random, no performance.now and
#     no process read. Printed with the count of lines read.
#  2. THE DETECTOR FIRES. The fake clock moves a clock read and the fake random
#     source moves a random draw, or a green run in 3 proves nothing.
#  3. NOTHING MOVES. The digest and fields.json, built with the machine clock
#     moved 400 days back and 900 days forward and with Math.random pinned at
#     two different constants, are byte-identical to the committed ones.
W=/root/md-wip-supply
E=${MD_ENGINES:-/root/wt-md-supply-nextgen/packages/engines}/engines/downstream
fail=0
for f in terminalDepot.js fuelPricing.js; do
  n=$(wc -l < $E/$f); hits=$(grep -cE '\bDate\b|Math\.random|performance\.now|process\.|hrtime' $E/$f)
  if [ "$hits" = "0" ]; then echo "  source: $f, $n lines, no clock, random or process read"; else echo "  source: $f has $hits clock, random or process read(s)"; grep -nE '\bDate\b|Math\.random|performance\.now|process\.|hrtime' $E/$f; fail=1; fi
done
real=$(node -e 'console.log(new Date().getFullYear())')
moved=$(FAKE_CLOCK_DAYS=900 node --import $W/fakeclock.mjs -e 'console.log(new Date().getFullYear())')
if [ "$real" != "$moved" ]; then echo "  fake clock fires: the year reads $real on the machine clock and $moved under it"; else echo "  fake clock did NOT move a clock read"; fail=1; fi
rnd=$(FAKE_RANDOM=0.25 node --import $W/fakeclock.mjs -e 'console.log(Math.random())')
if [ "$rnd" = "0.25" ]; then echo "  fake random fires: Math.random reads $rnd under it"; else echo "  fake random did NOT pin Math.random"; fail=1; fi
mkdir -p $W/scratch; T=$(mktemp -d -p $W/scratch)
for spec in "-400 0.1" "900 0.9"; do
  set -- $spec
  FAKE_CLOCK_DAYS=$1 FAKE_RANDOM=$2 TZ=UTC node --import $W/fakeclock.mjs $W/supply_dump.mjs 2>/dev/null > $T/digest.txt
  FAKE_CLOCK_DAYS=$1 FAKE_RANDOM=$2 MD_FIELDS_OUT=$T/fields.json MD_PRECISION_OUT=$T/precision.json MD_CAPSTONE_OUT=$T/capstone.json node --import $W/fakeclock.mjs $W/supply_capstone.mjs > /dev/null
  for f in digest.txt fields.json capstone.json precision.json; do
    if cmp -s $T/$f $W/$f; then echo "  clock moved $1 days, random pinned at $2: $f byte-identical"; else echo "  clock moved $1 days, random pinned at $2: $f DIFFERS"; fail=1; fi
  done
done
rm -rf $T
[ $fail -eq 0 ] && echo "gate_clock: PASS" || echo "gate_clock: FAIL"
exit $fail
