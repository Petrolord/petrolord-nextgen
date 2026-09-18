#!/bin/sh
# TZ is pinned so the digest is byte-identical wherever it is built, and the
# digest is proved byte-identical under two other zones by gate_repro.sh, which
# runs the generator directly under TZ=Africa/Lagos and TZ=Pacific/Kiritimati.
# Build THROUGH A TEMP FILE, never straight into the file the gates read:
#   sh build_digest.sh > digest.tmp && mv digest.tmp digest.txt
# This file is committed with its executable bit set, because FC4's was not and
# its reproducibility gate had therefore never run.
export TZ=UTC
node /root/as-wip-riskchange/riskchange_dump.mjs
