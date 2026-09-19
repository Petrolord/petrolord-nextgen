#!/bin/sh
# GATE: the digest and the graded fields read no clock. Five checks, each
# printing what it did.
#  1. THE PLANT. The generator's own clock gate must refuse one deliberate bare
#     call (refinery_dump.mjs --plant-clock).
#  2. THE SCAN. The clock readers are found in the engine source; the scan must
#     name the three this course meets, and every other reader it finds must be
#     one the course never calls.
#  3. THE FAKE CLOCK FIRES. The detector must actually move a clock read, and
#     must move the engine's own default when the argument is left out, or a
#     green run in check 4 proves nothing.
#  4. NOTHING MOVES. Built with the machine clock moved 400 days back and 900
#     days forward, the digest is byte-identical to digest.txt and the capstone
#     generator writes the same fields.json.
#  5. NO UNGUARDED CALL. The generators reach an engine only through the guard
#     (G.*); the one declared use of RAW is for constants and the scenario list.
W=/root/md-wip-refinery
E=${MD_ENGINES:-/root/wt-md-refinery-nextgen/packages/engines}
T=$W/.clock.$$
fail=0
out=$(TZ=UTC node $W/refinery_dump.mjs --plant-clock 2>&1 >/dev/null); rc=$?
if [ $rc -ne 0 ] && echo "$out" | grep -q 'CLOCK GATE: refineryPlanning.cascadeToSchedule was called without'; then
  echo "  plant: the generator REFUSED the bare call (exit $rc), as it must"
else
  echo "  plant: FAILED, the bare call was not refused (exit $rc)"; fail=1
fi
scan=$(node --input-type=module -e "
import fs from 'fs';
import { clockReadersOf, MODULES } from '$W/clockguard.mjs';
const found = [];
for (const [m, rel] of Object.entries(MODULES)) for (const n of clockReadersOf(fs.readFileSync('$E/' + rel, 'utf8'))) found.push(m + '.' + n);
console.log(found.join(' '));")
echo "  scan: clock readers in the engine source: $scan"
for must in refineryPlanning.cascadeToSchedule modularRefinery.feasibilityEconomics screening.calculateEconomics; do
  echo "$scan" | grep -q "$must" || { echo "  scan: MISSING $must"; fail=1; }
done
if grep -n 'expandQuickInputs' $W/refinery_dump.mjs $W/refinery_capstone.mjs $W/discriminate.mjs | grep -v '^\S*:\s*//' | grep -q '(' ; then echo "  a generator calls expandQuickInputs, a clock reader with no override"; fail=1; else echo "  expandQuickInputs, the fourth reader, is called by no generator"; fi
real=$(node -e 'console.log(new Date().getFullYear())')
moved=$(FAKE_CLOCK_DAYS=900 node --import $W/fakeclock.mjs -e 'console.log(new Date().getFullYear())')
if [ "$real" != "$moved" ]; then echo "  fake clock fires: the year reads $real on the machine clock and $moved under it"; else echo "  fake clock did NOT move a clock read"; fail=1; fi
d0=$(node --input-type=module -e "import { cascadeToSchedule, planRefinery } from '$E/engines/downstream/refineryPlanning.js'; import * as F from '$W/refinery_fields.mjs'; console.log(cascadeToSchedule({ plan: planRefinery(F.ABUA), periodDays: 31 }).events[0].date)")
d1=$(FAKE_CLOCK_DAYS=900 node --import $W/fakeclock.mjs --input-type=module -e "import { cascadeToSchedule, planRefinery } from '$E/engines/downstream/refineryPlanning.js'; import * as F from '$W/refinery_fields.mjs'; console.log(cascadeToSchedule({ plan: planRefinery(F.ABUA), periodDays: 31 }).events[0].date)")
if [ "$d0" != "$d1" ]; then echo "  fake clock moves the engine's own default: a schedule with no period start opens on $d0, and on $d1 under it"; else echo "  fake clock did NOT move the engine default"; fail=1; fi
for d in -400 900; do
  FAKE_CLOCK_DAYS=$d TZ=UTC node --import $W/fakeclock.mjs $W/refinery_dump.mjs 2>/dev/null > $T
  if [ -s $T ] && cmp -s $T $W/digest.txt; then echo "  clock moved $d days: digest byte-identical ($(wc -l < $W/digest.txt) lines)"; else echo "  clock moved $d days: DIGEST DIFFERS"; fail=1; fi
  FAKE_CLOCK_DAYS=$d MD_FIELDS_OUT=$T.f MD_PRECISION_OUT=$T.p MD_CAPSTONE_OUT=$T.c TZ=UTC node --import $W/fakeclock.mjs $W/refinery_capstone.mjs >/dev/null 2>&1
  if cmp -s $T.f $W/fields.json && cmp -s $T.c $W/capstone.json; then echo "  clock moved $d days: fields.json and capstone.json byte-identical"; else echo "  clock moved $d days: FIELDS DIFFER"; fail=1; fi
done
rm -f $T $T.f $T.p $T.c
raw=$(grep -nE 'RAW\.[a-zA-Z]+\.[a-zA-Z]+\(' $W/refinery_dump.mjs $W/refinery_capstone.mjs $W/discriminate.mjs | grep -v '\.find(' | grep -v '\.filter(' | grep -v '\.map(' | grep -v 'Object\.' )
if [ -z "$raw" ]; then echo "  unguarded engine calls: 0 (RAW is read only for constants, the scenario list and the configurations)"; else echo "  unguarded engine calls:"; echo "$raw"; fail=1; fi
[ $fail -eq 0 ] && echo "gate_clock: PASS" || echo "gate_clock: FAIL"
exit $fail
