#!/bin/sh
# Build the gasvalue teaching digest to stdout. Build THROUGH A TEMP FILE, never
# straight into the file the gates read:
#   sh build_digest.sh > digest.tmp && mv digest.tmp digest.txt
#
# TZ is pinned to UTC so the committed digest is built one way. DIGEST_TZ
# overrides it for the reproducibility gate, which rebuilds the digest under
# UTC, Africa/Lagos, Pacific/Kiritimati and Pacific/Pago_Pago and demands the
# same bytes. Nothing in this course reads a date, so a zone that moves a byte
# is a defect.
#
# Committed EXECUTABLE: FC4's build_digest.sh was not, and its reproducibility
# gate had therefore never run.
export TZ="${DIGEST_TZ:-UTC}"
exec node /root/et-wip-gasvalue/gasvalue_dump.mjs "$@"
