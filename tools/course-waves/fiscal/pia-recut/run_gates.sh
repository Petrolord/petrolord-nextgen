#!/bin/sh
# Every fiscal PIA re-cut gate, from the repository root. Non-zero exit on the first red gate.
set -e
K=tools/course-waves/fiscal/pia-recut
KIT=${DC_WAVEKIT:-/root/dc-wavekit}
python3 $K/build.py --check
python3 $K/defects_left.py | tail -1
node $K/keytruth.mjs
node $K/keytruth.mjs --plant
for t in beginner intermediate advanced; do node $KIT/numsweep.mjs $K --content src/content/courses/fiscal/$t | tail -1; done
node $KIT/numsweep.mjs $K --banks | tail -1
python3 $K/lengths.py | tail -1
n=$(grep -rnE "[—–]|,\s+not\s+[A-Za-z]" src/content/courses/fiscal src/components/course/panels/fiscal/*.jsx | wc -l); echo "copy rule, lessons and panels: $n"; [ "$n" = 0 ]
n=$(cat $K/banks/*.json | grep -cE "[—–]|,\s+not\s+[A-Za-z]" || true); echo "copy rule, banks: $n"; [ "$n" = 0 ]
for p in ec2b ec2i ec2a; do python3 $KIT/lengthtails.py $K/banks --prefix $p | tail -1; done
for t in beginner intermediate advanced; do python3 $K/dupdelta.py $t | tail -1; done
git diff --quiet 08f17b61d -- tools/course-waves/fiscal/fields.json && echo "fields.json byte-identical to main"
