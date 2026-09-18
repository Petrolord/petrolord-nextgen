#!/bin/sh
# Build the compliance teaching digest to stdout. Build THROUGH A TEMP FILE,
# never straight into the file the gates read:
#   sh build_digest.sh > digest.tmp && mv digest.tmp digest.txt
#
# TZ is pinned to UTC so the committed digest is built one way. DIGEST_TZ
# overrides it for the reproducibility gate, which rebuilds the digest under
# three zones (UTC, Africa/Lagos, Pacific/Kiritimati) and demands the same
# bytes, because every date in these rules is a calendar day read at local
# midnight and a zone that moves a day is a defect.
#
# Committed EXECUTABLE: FC4's build_digest.sh was not, and its reproducibility
# gate had therefore never run.
export TZ="${DIGEST_TZ:-UTC}"
exec node /root/as-wip-compliance/compliance_dump.mjs "$@"
