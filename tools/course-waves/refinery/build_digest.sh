#!/bin/sh
# Build the refinery teaching digest to stdout. Build THROUGH A TEMP FILE,
# never straight into the file the gates read:
#   sh build_digest.sh > digest.tmp && mv digest.tmp digest.txt
#
# TZ is pinned to UTC so the committed digest is built one way. DIGEST_TZ
# overrides it for the reproducibility gate, which rebuilds the digest under
# seven zones and demands the same bytes: the schedule is dated from a period
# start string the engine reads as a UTC calendar day, and a zone that moves a
# date is a defect.
#
# Committed EXECUTABLE: FC4's build_digest.sh was not, and its reproducibility
# gate had therefore never run.
export TZ="${DIGEST_TZ:-UTC}"
exec node /root/md-wip-refinery/refinery_dump.mjs "$@"
