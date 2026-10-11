#!/bin/sh
# TZ and LC_ALL are pinned so the digest is byte-identical wherever it is built.
# Build THROUGH A TEMP FILE, never straight into the file the gates read:
#   sh build_digest.sh > digest.tmp && mv digest.tmp digest.txt
# The generator writes NOTHING to stdout if any section throws, so a failed
# build leaves the previous digest intact.
# THIS FILE MUST BE EXECUTABLE: digestrepro.sh invokes it as ./build_digest.sh.
# QI_WAVE_DIR, QI_REPO, QI_ENGINES, QI_SUITE_SRC and QI_SUITE_COMMIT override the
# default paths, which is how the committed mirror under tools/course-waves/qi
# rebuilds it.
export TZ=UTC
export LC_ALL=C
exec node "${QI_WAVE_DIR:-/root/qi-wip-qi}/qi_dump.mjs"
