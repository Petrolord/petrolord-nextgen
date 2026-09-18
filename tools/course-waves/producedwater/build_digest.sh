#!/bin/sh
# Builds the FC7 teaching digest. TZ is pinned so the digest is byte-identical
# wherever and whenever it is built, and the generator reads no clock anyway.
#
# BUILD THROUGH A TEMP FILE, never straight into the file the gates read:
#   sh build_digest.sh > digest.tmp && mv digest.tmp digest.txt
#
# CHECK THE MODE OF THIS FILE. FC4's copy was committed non-executable, so its
# reproducibility gate, which invokes it as a program, had never once run and
# reported nothing for weeks. `ls -l` on this file is part of the evidence:
# it must be 755.
export TZ=UTC
node /root/fc-wip-producedwater/fc7_dump.mjs
