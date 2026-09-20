#!/bin/sh
# GATE: the kit's leakage.mjs over what the lessons will quote. At the
# foundation every lesson is a title-only placeholder, and leakage.mjs REFUSES a
# sweep that sees no numbers (exit 2, correctly). So this runs it over a probe
# tree holding the DIGEST as one lesson in each tier: every figure a writer is
# allowed to quote, read by the same tier-aware sweep. After the lesson phase,
# run leakage.mjs on the real content root as well (LESSON_TASK.md).
W=/root/md-wip-refinery
P=$W/.leakprobe.$$
for t in beginner intermediate advanced; do mkdir -p $P/$t/m00-digest; cp $W/digest.txt $P/$t/m00-digest/l00-digest.md; done
node /root/dc-wavekit/leakage.mjs $W --content-root $P; rc=$?
rm -rf $P
exit $rc
