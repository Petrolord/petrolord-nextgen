#!/bin/sh
# GATE: the digest and the graded fields read no clock. Four checks, each
# printing what it did.
#  1. THE SOURCES. The six engine files in scope and the wave's generators
#     contain no Date, Date.now, performance.now or Math.random at all.
#  2. THE FAKE CLOCK FIRES. The detector must actually move a clock read, or a
#     green run in check 3 proves nothing.
#  3. THE DIGEST DOES NOT MOVE. Built with the machine clock moved 400 days
#     back and 900 days forward, the digest is byte-identical to digest.txt.
#  4. THE GRADED FIELDS DO NOT MOVE. The capstone generator's --json output is
#     identical under the same two fake clocks.
W=/root/et-wip-gasvalue
E=${ET_ENGINES:-/root/wt-et-gasvalue-nextgen/packages/engines}
T=$W/scratch/clock.$$
fail=0
hits=$(grep -nE '\bDate\b|performance\.now|Math\.random' $E/engines/downstream/flareToValue.js $E/engines/downstream/lpgCng.js $E/engines/downstream/modularRefinery.js $E/engines/downstream/terminalDepot.js $E/engines/production/gasProperties.js $E/engines/facilities/compression.js $W/gasvalue_dump.mjs $W/gasvalue_fields.mjs $W/gasvalue_fields_capstone.mjs $W/gasvalue_capstone.mjs | grep -v '^\s*//' | grep -vE ':[0-9]+:\s*(//|\*)' | grep -v 'modularRefinery.js:[0-9]*:export const feasibilityEconomics = ' )
# ONE KNOWN READ, OFF THIS COURSE'S PATH, NAMED RATHER THAN HIDDEN:
# modularRefinery.feasibilityEconomics defaults startYear to the machine year
# (the refinery wave's RECON records it). This course imports only scaleCapex
# and SCALING_EXPONENT from that module, never feasibilityEconomics; the check
# below proves that by grepping every generator for the name.
known=$(grep -c 'export const feasibilityEconomics = .*new Date()' $E/engines/downstream/modularRefinery.js)
uses=$(grep -l 'feasibilityEconomics' $W/gasvalue_dump.mjs $W/gasvalue_fields.mjs $W/gasvalue_fields_capstone.mjs $W/gasvalue_capstone.mjs $E/engines/downstream/flareToValue.js $E/engines/downstream/lpgCng.js 2>/dev/null)
if [ "$known" = 1 ] && [ -z "$uses" ]; then echo "  known off-path read: modularRefinery.feasibilityEconomics defaults startYear to the machine year; nothing in this wave or its two engines calls it"; else echo "  the known modularRefinery clock read moved or is now called: known=$known uses=$uses"; fail=1; fi
if [ -z "$hits" ]; then echo "  sources: apart from that one named read, no Date, performance.now or Math.random in the 6 engine files the two modules run (flareToValue, lpgCng, modularRefinery, terminalDepot, gasProperties, compression) and 4 generators"; else echo "  sources: CLOCK OR RANDOM READ FOUND:"; echo "$hits"; fail=1; fi
real=$(node -e 'console.log(new Date().getFullYear())')
moved=$(FAKE_CLOCK_DAYS=900 node --import $W/fakeclock.mjs -e 'console.log(new Date().getFullYear())')
if [ "$real" != "$moved" ]; then echo "  fake clock fires: the year reads $real on the machine clock and $moved under it"; else echo "  fake clock did NOT move a clock read"; fail=1; fi
node $W/gasvalue_capstone.mjs --json > $T.f0
for d in -400 900; do
  FAKE_CLOCK_DAYS=$d TZ=UTC node --import $W/fakeclock.mjs $W/gasvalue_dump.mjs 2>/dev/null > $T
  if cmp -s $T $W/digest.txt; then echo "  clock moved $d days: digest byte-identical ($(wc -l < $W/digest.txt) lines)"; else echo "  clock moved $d days: DIGEST DIFFERS"; fail=1; fi
  FAKE_CLOCK_DAYS=$d node --import $W/fakeclock.mjs $W/gasvalue_capstone.mjs --json > $T.f1
  if cmp -s $T.f0 $T.f1; then echo "  clock moved $d days: the eighteen graded values identical"; else echo "  clock moved $d days: GRADED VALUES DIFFER"; fail=1; fi
done
rm -f $T $T.f0 $T.f1
[ $fail -eq 0 ] && echo "gate_clock: PASS" || echo "gate_clock: FAIL"
exit $fail
