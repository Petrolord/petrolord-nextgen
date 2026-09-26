#!/bin/sh
# EC2 Fiscal Regime Design. ONE generator writes the whole digest to stdout.
# Never hand-edit digest.txt: edit ec2_dump.mjs and rebuild, through a temp file:
#     sh build_digest.sh > digest.tmp && mv digest.tmp digest.txt
# The engine is plain JavaScript, so unlike EC1 there is no bundling step.
# EC2_WAVE_DIR (this kit) and EC2_ENGINES (<repo>/packages/engines) override the defaults.
set -e
export TZ=UTC LC_ALL=C
HERE="${EC2_WAVE_DIR:-$(cd "$(dirname "$0")" && pwd)}"
ROOT="${EC2_ENGINES:-/root/wt-ec7-recut/packages/engines}"
EC2_WAVE_DIR="$HERE" EC2_ENGINES="$ROOT" exec node "$HERE/ec2_dump.mjs"
