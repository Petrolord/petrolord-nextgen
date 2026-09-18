#!/bin/sh
# THE REPRODUCIBILITY GATE (brief rule 2). The digest AND the engine-call ledger
# must be byte-identical across two consecutive rebuilds and across three time
# zones the brief names, UTC, Africa/Lagos (UTC+1, the operating context) and
# Pacific/Kiritimati (UTC+14), AND a fourth west of Greenwich,
# Pacific/Pago_Pago (UTC-11). All three named zones sit at or east of UTC, and
# the one date defect this family has shipped (RS-1, a date read as a UTC
# instant) is visible only WEST of it, so without the fourth zone the gate
# could not see the class it exists for. RC_NEGATIVE=utc proves it can.
# Every date in this wave is a calendar date read at local midnight, so a line
# that silently fell back to the clock, or parsed a date as a UTC instant,
# differs here.
set -eu
W=/root/as-wip-riskchange
T=$(mktemp -d)
trap 'rm -rf "$T"' EXIT
[ -x "$W/build_digest.sh" ] || { echo "REPRO REFUSES: build_digest.sh is not executable"; exit 2; }
RC_NEGATIVE="${RC_NEGATIVE:-}" RC_CALLS_OUT="$T/c1.json" "$W/build_digest.sh" > "$T/b1.txt" 2>/dev/null
RC_NEGATIVE="${RC_NEGATIVE:-}" RC_CALLS_OUT="$T/c2.json" "$W/build_digest.sh" > "$T/b2.txt" 2>/dev/null
for z in UTC Africa/Lagos Pacific/Kiritimati Pacific/Pago_Pago; do
  n=$(echo "$z" | tr '/' '_')
  TZ=$z RC_NEGATIVE="${RC_NEGATIVE:-}" RC_CALLS_OUT="$T/c_$n.json" node "$W/riskchange_dump.mjs" > "$T/z_$n.txt" 2>/dev/null
  off=$(TZ=$z node -e 'process.stdout.write(String(new Date(2026,9,1).getTimezoneOffset()))')
  echo "  zone $z (offset $off minutes on the as-of date)"
done
[ -s "$T/b1.txt" ] || { echo "REPRO REFUSES: the build printed nothing"; exit 2; }
fail=0
for f in b2 z_UTC z_Africa_Lagos z_Pacific_Kiritimati z_Pacific_Pago_Pago; do
  cmp -s "$T/b1.txt" "$T/$f.txt" && echo "  ok   digest $f identical" || { echo "  FAIL digest $f differs"; diff "$T/b1.txt" "$T/$f.txt" | head -10; fail=1; }
done
for f in c2 c_UTC c_Africa_Lagos c_Pacific_Kiritimati c_Pacific_Pago_Pago; do
  cmp -s "$T/c1.json" "$T/$f.json" && echo "  ok   ledger $f identical" || { echo "  FAIL ledger $f differs"; fail=1; }
done
if [ -f "$W/digest.txt" ]; then
  cmp -s "$T/b1.txt" "$W/digest.txt" && echo "  ok   digest.txt on disk is what the generator emits" || { echo "  FAIL digest.txt on disk has DRIFTED from its generator"; fail=1; }
fi
echo "  $(wc -l < "$T/b1.txt") lines, $(grep -c '^# SECTION' "$T/b1.txt") sections, sha256 $(sha256sum "$T/b1.txt" | cut -c1-16)"
exit $fail
