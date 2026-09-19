#!/bin/sh
# Build the supply teaching digest to stdout. Build THROUGH A TEMP FILE, never
# straight into the file the gates read:
#   sh build_digest.sh > digest.tmp && mv digest.tmp digest.txt
#
# TZ is pinned to UTC so the committed digest is built one way. DIGEST_TZ
# overrides it for the reproducibility gate, which rebuilds the digest under
# UTC, Africa/Lagos, Pacific/Kiritimati (UTC+14), Pacific/Pago_Pago (UTC-11)
# and America/Los_Angeles and demands the same bytes. Neither engine reads a
# date, so a zone that moves a byte is a defect in the generator.
#
# Committed EXECUTABLE: FC4's build_digest.sh was not, and its reproducibility
# gate had therefore never run.
export TZ="${DIGEST_TZ:-UTC}"
exec node /root/md-wip-supply/supply_dump.mjs "$@"
