#!/bin/sh
# TZ is pinned so the digest is byte-identical wherever it is built. Build
# THROUGH A TEMP FILE, never straight into the file the gates read:
#   sh build_digest.sh > digest.tmp && mv digest.tmp digest.txt
# The generator writes NOTHING to stdout if any label-and-call assertion
# fails, so a failed build leaves the previous digest intact.
export TZ=UTC
export LC_ALL=C
node /root/fc-wip-relief/fc5_dump.mjs
