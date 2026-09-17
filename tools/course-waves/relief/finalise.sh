#!/usr/bin/env bash
# RE-PIN THE WAVE AFTER A REBUILD, IN ONE STEP.
#
# The digest's md5 and line count are CLAIMS in wave.json and gate_wavejson.mjs
# checks them against the file. That is deliberate: a re-cut digest has to
# re-pin where a reviewer can see it. This script does the two mechanical halves
# of that, re-verifies reproducibility, and leaves the gates to be run.
set -euo pipefail
cd /root/fc-wip-relief
sh build_digest.sh > digest.tmp && mv digest.tmp digest.txt
A=$(mktemp); B=$(mktemp)
sh build_digest.sh > "$A" 2>/dev/null; sh build_digest.sh > "$B" 2>/dev/null
cmp -s "$A" "$B" || { echo "NOT REPRODUCIBLE across two rebuilds"; exit 1; }
cmp -s "$A" digest.txt || { echo "the committed digest is not what the generator emits"; exit 1; }
for tz in Pacific/Kiritimati UTC Pacific/Niue America/Sao_Paulo; do
  TZ=$tz node fc5_dump.mjs 2>/dev/null > "$B"
  cmp -s "$A" "$B" || { echo "NOT REPRODUCIBLE under TZ=$tz"; exit 1; }
done
for lc in C de_DE.UTF-8 tr_TR.UTF-8; do
  LC_ALL=$lc node fc5_dump.mjs 2>/dev/null > "$B"
  cmp -s "$A" "$B" || { echo "NOT REPRODUCIBLE under LC_ALL=$lc"; exit 1; }
done
rm -f "$A" "$B"
MD5=$(md5sum digest.txt | cut -d' ' -f1)
SHA=$(sha256sum digest.txt | cut -d' ' -f1)
L=$(wc -l < digest.txt)
python3 - "$MD5" "$SHA" "$L" <<'PY'
import json, io, re, sys
md5, sha, lines = sys.argv[1], sys.argv[2], int(sys.argv[3])
p = '/root/fc-wip-relief/wave.json'
d = json.load(io.open(p, encoding='utf-8'))
d['digest']['md5'] = md5
d['digest']['sha256'] = sha
d['digest']['lines'] = lines
d['gates']['digest reproducibility'] = (
    'byte-identical across two consecutive rebuilds, four timezones (Pacific/Kiritimati, UTC, '
    'Pacific/Niue, America/Sao_Paulo) and three locales (C, de_DE.UTF-8, tr_TR.UTF-8). '
    f'md5 {md5} over {lines} lines. finalise.sh re-verifies all nine and re-pins.')
for k, v in list(d['gates'].items()):
    if isinstance(v, str):
        # Re-pin every restated digest line count. This used to be \b98[0-9],
        # which silently stopped matching the moment the digest left the 980s
        # and would have left a stale count behind with nothing saying so.
        # gate_wavejson.mjs checks these, so a miss here is a red gate rather
        # than a quiet drift, but the regex should not need a person to widen
        # it on every rebuild.
        d['gates'][k] = re.sub(r'(?<![\d.])\d{3,5}(?= lines?\b)', str(lines), v)
io.open(p, 'w', encoding='utf-8').write(json.dumps(d, indent=1, ensure_ascii=False) + '\n')
print(f'wave.json re-pinned: md5 {md5}, {lines} lines')
PY
node make_fields.mjs > /dev/null
python3 /root/dc-wavekit/harvest_digest.py . > /dev/null
echo "re-pinned and reproducible over nine builds"
