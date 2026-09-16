#!/bin/sh
# TZ is pinned so the digest is byte-identical wherever it is built. Build
# THROUGH A TEMP FILE, never straight into the file the gates read:
#   sh build_digest.sh > digest.tmp && mv digest.tmp digest.txt
export TZ=UTC
node /root/fc-wip-rotating/fc3_dump.mjs
