#!/bin/sh
# EC1 Cash Flow & NPV. ONE generator writes the whole digest to stdout. Never
# hand-edit digest.txt: edit ec1_dump.mjs and rebuild, through a temp file:
#     sh build_digest.sh > digest.tmp && mv digest.tmp digest.txt
# The engine is TypeScript (it is deployed as a Supabase edge function), so it
# is bundled first with the esbuild the academy already carries; the bundle is
# a build artefact under scratch/ and never edited.
# EC1_WAVE_DIR (this kit), EC1_ENGINES (<repo>/packages/engines) and EC1_REPO
# (the NextGen checkout whose esbuild bundles it) override the defaults.
set -e
export TZ=UTC LC_ALL=C
HERE="${EC1_WAVE_DIR:-$(cd "$(dirname "$0")" && pwd)}"
ROOT="${EC1_ENGINES:-/root/wt-ec7-recut/packages/engines}"
NG="${EC1_REPO:-$(cd "$ROOT/../.." && pwd)}"
mkdir -p "$HERE/scratch"
"$NG/node_modules/.bin/esbuild" "$ROOT/engines/economics/cashflow.ts" --bundle --format=esm --platform=node \
  --outfile="$HERE/scratch/cashflow.mjs" --log-level=warning
EC1_WAVE_DIR="$HERE" EC1_ENGINES="$ROOT" exec node "$HERE/ec1_dump.mjs"
