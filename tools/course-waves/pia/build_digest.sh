#!/bin/sh
# TZ and LC_ALL are pinned so the digest is byte-identical wherever it is built.
# Build THROUGH A TEMP FILE, never straight into the file the gates read:
#   sh build_digest.sh > digest.tmp && mv digest.tmp digest.txt
# The generator writes NOTHING to stdout if any label-and-call or claim
# assertion fails, so a failed build leaves the previous digest intact.
#
# THIS FILE MUST BE EXECUTABLE: digestrepro.sh invokes it as ./build_digest.sh.
# EC7_WAVE_DIR and EC7_ENGINES override the default paths, which is how the
# committed mirror under tools/course-waves/pia rebuilds it.
export TZ=UTC
export LC_ALL=C
exec node "${EC7_WAVE_DIR:-/root/cat-wip-pia}/pia_dump.mjs"
