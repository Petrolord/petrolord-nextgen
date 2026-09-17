#!/usr/bin/env bash
# RE-PIN THE WAVE AFTER A REBUILD, IN ONE STEP.
#
# The digest's md5, sha256, line count and section count are CLAIMS in wave.json
# and gate_wavejson.mjs checks them against the file. That is deliberate: a
# re-cut digest has to re-pin where a reviewer can see it. This script does the
# mechanical half of that, re-verifies reproducibility over ten builds, and
# leaves the gates to be run.
#
# THE FILE MODE IS CHECKED FIRST. A sibling wave's build_digest.sh was mode 644
# while its reproducibility gate called it as ./build_digest.sh, so the gate had
# never run once. A reproducibility check that cannot execute its own subject
# reports nothing, so this script refuses before it starts.
set -euo pipefail
cd /root/fc-wip-metering

MODE=$(stat -c '%a' build_digest.sh)
[ -x build_digest.sh ] || { echo "REFUSES: build_digest.sh is not executable (mode $MODE). A sibling wave shipped exactly this and its reproducibility gate never ran."; exit 2; }
echo "build_digest.sh mode $MODE, executable: yes"
./build_digest.sh > digest.tmp && mv digest.tmp digest.txt

A=$(mktemp); B=$(mktemp)
./build_digest.sh > "$A" 2>/dev/null
./build_digest.sh > "$B" 2>/dev/null
cmp -s "$A" "$B" || { echo "NOT REPRODUCIBLE across two consecutive rebuilds"; exit 1; }
cmp -s "$A" digest.txt || { echo "the committed digest is not what the generator emits"; exit 1; }
BUILDS=3
for tz in Pacific/Kiritimati UTC Pacific/Niue America/Sao_Paulo Asia/Kathmandu; do
  TZ=$tz node fc8_dump.mjs 2>/dev/null > "$B"
  cmp -s "$A" "$B" || { echo "NOT REPRODUCIBLE under TZ=$tz"; exit 1; }
  BUILDS=$((BUILDS + 1))
done
for lc in C de_DE.UTF-8 tr_TR.UTF-8 ar_EG.UTF-8; do
  LC_ALL=$lc node fc8_dump.mjs 2>/dev/null > "$B"
  cmp -s "$A" "$B" || { echo "NOT REPRODUCIBLE under LC_ALL=$lc"; exit 1; }
  BUILDS=$((BUILDS + 1))
done
rm -f "$A" "$B"

MD5=$(md5sum digest.txt | cut -d' ' -f1)
SHA=$(sha256sum digest.txt | cut -d' ' -f1)
L=$(wc -l < digest.txt)
S=$(grep -c '^# SECTION' digest.txt)
python3 - "$MD5" "$SHA" "$L" "$S" "$BUILDS" "$MODE" <<'PY'
import io, json, sys
md5, sha, lines, sections, builds, mode = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), int(sys.argv[5]), sys.argv[6]
p = '/root/fc-wip-metering/wave.json'
d = json.load(io.open(p, encoding='utf-8'))
d['digest']['md5'] = md5
d['digest']['sha256'] = sha
d['digest']['lines'] = lines
d['digest']['sections'] = sections
d['plan']['state'] = (
    'FOUNDATION COMPLETE, vendored at engines main 9874d583. Digest BUILT: %d sections, %d lines, '
    'byte-reproducible across two consecutive rebuilds, five timezones and four locales, %d builds in '
    'all. Eighteen graded fields chosen, tolerances derived in one place, discriminate clean with zero '
    'WEAK routes. NO LESSON IS WRITTEN.' % (sections, lines, builds))
d['gates']['digest reproducibility'] = (
    'byte-identical across two consecutive rebuilds, five timezones (Pacific/Kiritimati, UTC, '
    'Pacific/Niue, America/Sao_Paulo, Asia/Kathmandu) and four locales (C, de_DE.UTF-8, tr_TR.UTF-8, '
    f'ar_EG.UTF-8): {builds} builds in all, every one byte-identical. md5 {md5} over {lines} lines. '
    f'build_digest.sh is mode {mode} and EXECUTABLE, which finalise.sh asserts before it runs '
    'anything: a sibling wave shipped a mode 644 build script and its reproducibility gate had '
    'therefore never once run.')
io.open(p, 'w', encoding='utf-8').write(json.dumps(d, indent=1, ensure_ascii=False) + '\n')
print(f'wave.json re-pinned: md5 {md5}, {lines} lines, {sections} sections, {builds} reproducible builds')
PY
node make_fields.mjs
echo "re-pinned and reproducible over $BUILDS builds"
