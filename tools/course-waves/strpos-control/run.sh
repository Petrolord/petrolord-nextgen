#!/usr/bin/env bash
# =============================================================================
# THE HELD-NAME GATE CONTROL, on a LOCAL scratch Postgres and never production.
#
# The held-name gates of the FC6-FC9 go-lives matched a fragment with LIKE, in
# which an underscore is a one-character wildcard, so a held fragment such as
# fan_hp also refused a key spelling fanxhp. FC5's dry run caught the same form
# (kw_ against kwm) and moved to strpos; FC6-FC9 now follow it.
#
# For each wave this lifts the two held-NAME gates VERBATIM out of the go-live,
# loads the wave's course migration, replaces the Associate capstone's fields
# with one synthetic key, and runs the gates, all in a transaction that rolls
# back. Two keys per wave:
#   the look-alike  the fragment with its underscore swapped for x: must PASS
#   the real one    the fragment itself:                           must REFUSE
# With REF_OLD set (a ref from before the fix) the old go-live is run too, and
# the look-alike must REFUSE there, which is the false match being removed.
#
# Usage: run.sh            (worktree go-lives)
#        REF_OLD=975a15f3 run.sh
# =============================================================================
set -u
HERE=$(cd "$(dirname "$0")" && pwd)
REPO=$(cd "$HERE/../../.." && pwd)
export SCRATCH=${SCRATCH:-strpos-control-scratch} REPO
FAIL=0
for p in 6:heattransfer:fan_hp 7:producedwater:grain_exponent 8:metering:vent_scfh 9:corrosion:mass_transfer; do
  IFS=: read -r n s frag <<<"$p"
  EXCLUDE=fc${n}_ bash "$HERE/scratch_db.sh" HEAD >/dev/null 2>&1 || { echo "scratch database did not come up"; exit 3; }
  look="synthetic_${frag//_/x}_probe"; real="synthetic_${frag}_probe"
  course="$REPO/migrations/20260925_fc${n}_${s}_course.sql"
  run() { python3 "$HERE/held_name_gate.py" "$1" "$course" "$s" "$2" \
            | docker exec -i "$SCRATCH" psql -U postgres -q 2>&1 \
            | grep -oE "GATE PASSED|go-live refused" | head -1; }
  expect() { local got; got=$(run "$1" "$2"); echo "FC$n $3 $2 -> ${got:-NO RESULT} (want $4)"; [ "$got" = "$4" ] || FAIL=1; }
  new="$REPO/migrations/20260925_fc${n}_${s}_go_live.sql"
  expect "$new" "$look" new "GATE PASSED"
  expect "$new" "$real" new "go-live refused"
  if [ -n "${REF_OLD:-}" ]; then
    old=$(mktemp); git -C "$REPO" show "$REF_OLD:migrations/20260925_fc${n}_${s}_go_live.sql" > "$old"
    expect "$old" "$look" old "go-live refused"
    rm -f "$old"
  fi
done
docker rm -f "$SCRATCH" >/dev/null 2>&1
[ $FAIL = 0 ] && echo "CONTROL HOLDS on every wave." || { echo "CONTROL FAILED"; exit 2; }
