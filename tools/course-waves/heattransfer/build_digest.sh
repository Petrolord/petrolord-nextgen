#!/bin/sh
# TZ is pinned so the digest is byte-identical wherever it is built. Build
# THROUGH A TEMP FILE, never straight into the file the gates read:
#   sh build_digest.sh > digest.tmp && mv digest.tmp digest.txt
#
# AND CHECK THE FILE MODE. FC4's build_digest.sh was never executable, so the
# reproducibility gate that invokes it as a program had never once run on that
# wave. This file is committed with its executable bit set and digestrepro.sh
# is run as a program rather than through a shell.
export TZ=UTC
node /root/fc-wip-heattransfer/fc6_dump.mjs
