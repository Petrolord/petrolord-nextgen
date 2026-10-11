#!/usr/bin/env bash
# Copy the QI banks of every COMPLETE tier from the wave directory into the
# NextGen repository's tools/course-banks/qi/<tier>/, as source and JSON pairs
# (the shape tools/course-banks/check-bank-sources.py reads). A tier is copied
# only when all seven of its sources run clean through the bank kit and write
# their JSON with the planned counts (15 a module bank, 42 the exam); a tier
# still being written is left out and named. Nothing is committed here.
#   sync_banks.sh [repo]      default /root/wt-qi-nextgen
set -u
HERE=$(cd "$(dirname "$0")" && pwd)
REPO=${1:-/root/wt-qi-nextgen}
for tier in beginner intermediate advanced; do
  L=$(case $tier in beginner) echo b;; intermediate) echo i;; advanced) echo a;; esac)
  ok=1
  for part in m01 m02 m03 m04 m05 m06 exam; do
    src="$HERE/banks/qi${L}_${part}.py"
    want=15; [ $part = exam ] && want=42
    out=$(cd "$HERE/banks" && python3 "$src" 2>&1) || { ok=0; echo "  $tier: qi${L}_${part}.py refuses: $(tail -1 <<<"$out")"; continue; }
    n=$(python3 -c "import json,sys; print(len(json.load(open(sys.argv[1]))))" "$HERE/banks/qi${L}_${part}.json" 2>/dev/null || echo 0)
    [ "$n" = "$want" ] || { ok=0; echo "  $tier: qi${L}_${part}.json has $n questions, planned $want"; }
  done
  if [ $ok = 1 ]; then
    mkdir -p "$REPO/tools/course-banks/qi/$tier"
    cp "$HERE/banks/qi${L}_"*.py "$HERE/banks/qi${L}_"*.json "$REPO/tools/course-banks/qi/$tier/"
    echo "SYNCED  $tier: 7 sources and 7 JSONs -> tools/course-banks/qi/$tier"
  else
    echo "PENDING $tier: not every bank is complete; nothing copied"
  fi
done
