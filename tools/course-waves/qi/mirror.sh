#!/usr/bin/env bash
# MIRROR THE QI WAVE KIT INTO THE NEXTGEN REPOSITORY, byte for byte, and
# REGISTER IT. Every suite under src/components/course/panels/qi reads the
# committed copy by default (tools/course-waves/waveInputs.mjs), which is what
# lets it run on a CI runner. The kit is "full": everything the wave is rebuilt
# and gated from (the digest and its generators, the teaching-pack cut and its
# interpretation-row source, the case and capstone generators, the fields and
# their precision, every gate with its negative control, the briefs, the
# structure and the scaffold, the vendor script), plus every bank source and
# its JSON once the banks exist.
#
# THE INPUT LIST IS DERIVED FROM THE WAVE DIRECTORY BY PATTERN, written into
# waves.json, copied, cmp-checked, and then re-pinned with
# check-wave-inputs.mjs --update, so a new gate file cannot be forgotten.
# Scratch, logs and proofs (vendor-proof/, vendor_run.txt, __pycache__) are not
# kit and are left out.
#
#   bash mirror.sh          mirror, register and re-pin
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
NG=${NG:-/root/wt-qi-nextgen}
DEST="$NG/tools/course-waves/qi"
cd "$HERE"
INPUTS=$( (ls -1 digest.txt fields.json precision.json wave.json truth-qi.json ship_names.json golive_helpers.sql ./hdr_*.txt ./*.md ./*.py ./*.mjs ./*.sh sources/kit_truth_rows.json 2>/dev/null || true) | sed 's#^\./##' | sort -u)
if [ -d banks ]; then INPUTS="$INPUTS
$( (ls -1 banks/qi[bia]_*.py banks/qi[bia]_*.json 2>/dev/null || true) | sort)"; fi
for must in digest.txt fields.json wave.json build_digest.sh qi_dump.mjs qi_dump_a.mjs qi_capstone.mjs qi_cases.mjs structure.py run_gates.py; do
  printf '%s\n' "$INPUTS" | grep -qx "$must" || { echo "REFUSES: the kit input $must is missing from $HERE"; exit 1; }
done
rm -rf "$DEST"
mkdir -p "$DEST"
n=0
while read -r f; do
  [ -z "$f" ] && continue
  mkdir -p "$DEST/$(dirname "$f")"
  cp -p "$HERE/$f" "$DEST/$f"
  cmp -s "$HERE/$f" "$DEST/$f" || { echo "REFUSES: $f did not copy byte for byte"; exit 1; }
  n=$((n + 1))
done <<< "$INPUTS"
echo "mirrored $n inputs into $DEST"
INPUTS_JSON=$(printf '%s\n' "$INPUTS" | python3 -c 'import json,sys; print(json.dumps([l for l in sys.stdin.read().split("\n") if l]))')
python3 - "$NG/tools/course-waves/waves.json" "$INPUTS_JSON" <<'PY'
import json, sys
p, inputs = sys.argv[1], json.loads(sys.argv[2])
w = json.load(open(p))
e = w.get('qi', {})
e.update({
    'course': 'QI',
    'live': '/root/qi-wip-qi',
    'kit': 'full',
    'kitNote': ('Full kit, committed at the foundation and re-mirrored by mirror.sh, which derives the input list from the wave '
                'directory by pattern. It carries the teaching digest and its generators (qi_dump.mjs with one part per tier, '
                'printed from the NextGen teaching lab qiLab.js through qi_loader.mjs and qi_engine.mjs), the teaching-pack cut '
                '(cut_pack.py, kit_truth_rows.mjs and the interpretation rows it wrote), the held-out case generator and the '
                'capstone generator, the graded fields with their precision (tolerances from gradedTolerance.js), the '
                'discriminate sweep, the independent standard-library oracle check, every wave gate with its negative control '
                'and the runner that pins their md5s into wave.json, the briefs, the structure, the scaffold and the vendor '
                'script; the banks once they exist. Fields carry the tiers whose graders exist (Associate first).'),
    'inputs': inputs,
})
present = {f[0] for f in json.load(open('fields.json'))}
e['fieldsPendingTiers'] = [t for t in ('beginner', 'intermediate', 'advanced') if t not in present]
w['qi'] = e
json.dump(w, open(p, 'w'), indent=2, ensure_ascii=False)
open(p, 'a').write('\n')
print(f"registered {len(inputs)} inputs for qi in waves.json")
PY
node "$NG/tools/course-waves/check-wave-inputs.mjs" --update > /dev/null
node "$NG/tools/course-waves/check-wave-inputs.mjs" | sed -n '/^--- qi /,/^---/p' | tail -8
