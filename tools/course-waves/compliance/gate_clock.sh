#!/bin/sh
# GATE: the digest reads no clock. Three checks, each printing what it did.
#  1. THE PLANT. The generator's own clock gate must refuse one deliberate bare
#     call (compliance_dump.mjs --plant-clock).
#  2. THE FAKE CLOCK FIRES. The detector must actually move a clock read, or a
#     green run in check 3 proves nothing.
#  3. THE DIGEST DOES NOT MOVE. Built with the machine clock moved 400 days
#     back and 900 days forward, the digest is byte-identical to digest.txt.
W=/root/as-wip-compliance
fail=0
out=$(TZ=UTC node $W/compliance_dump.mjs --plant-clock 2>&1 >/dev/null); rc=$?
if [ $rc -ne 0 ] && echo "$out" | grep -q 'CLOCK GATE: documentControl.reviewState was called without the as-of date'; then
  echo "  plant: the generator REFUSED the bare call (exit $rc), as it must"
else
  echo "  plant: FAILED, the bare call was not refused (exit $rc)"; fail=1
fi
real=$(node -e 'console.log(new Date().getFullYear())')
moved=$(FAKE_CLOCK_DAYS=900 node --import $W/fakeclock.mjs -e 'console.log(new Date().getFullYear())')
if [ "$real" != "$moved" ]; then echo "  fake clock fires: the year reads $real on the machine clock and $moved under it"; else echo "  fake clock did NOT move a clock read"; fail=1; fi
for d in -400 900; do
  FAKE_CLOCK_DAYS=$d TZ=UTC node --import $W/fakeclock.mjs $W/compliance_dump.mjs 2>/dev/null > /tmp/cq-fake.$$ 
  if cmp -s /tmp/cq-fake.$$ $W/digest.txt; then echo "  clock moved $d days: digest byte-identical ($(wc -l < $W/digest.txt) lines)"; else echo "  clock moved $d days: DIGEST DIFFERS"; fail=1; fi
done
rm -f /tmp/cq-fake.$$
# 4. THE ONLY UNGUARDED CALLS ARE THE DECLARED ONES. RAW is the engine
#    without the clock gate. The dump may call it only inside the block that
#    shows what an unreadable today does, whose four calls pass a bad date on
#    purpose; the capstone generator and the discriminate sweep may not call it.
raw=$(python3 - <<'PY'
import re
bad = []
src = open('/root/as-wip-compliance/compliance_dump.mjs').read().split('\n')
lo = next(i for i, l in enumerate(src) if 'const bad = new Date(NaN);' in l)
hi = next(i for i, l in enumerate(src) if i > lo and l.strip() == '}')
n = 0
for i, l in enumerate(src):
    for _ in re.finditer(r'RAW\.[a-zA-Z]+\.[a-zA-Z]+\(', l):
        n += 1
        if not (lo < i < hi):
            bad.append(f'compliance_dump.mjs:{i + 1}')
for f in ('compliance_capstone.mjs', 'discriminate.mjs'):
    for i, l in enumerate(open('/root/as-wip-compliance/' + f).read().split('\n')):
        if re.search(r'\bRAW\b', l):
            bad.append(f'{f}:{i + 1}')
print(n, ' '.join(bad))
PY
)
set -- $raw
if [ "$1" = "4" ] && [ -z "$2" ]; then echo "  unguarded calls: 4, all inside the declared unreadable-today block"; else echo "  unguarded calls: $1, outside the declared block: ${2:-none}"; fail=1; fi
[ $fail -eq 0 ] && echo "gate_clock: PASS" || echo "gate_clock: FAIL"
exit $fail
