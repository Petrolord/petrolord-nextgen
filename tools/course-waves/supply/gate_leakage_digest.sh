#!/bin/sh
# GATE: the kit's leakage.mjs, run over the TEACHING DIGEST split by the tier
# that owns each section, because at the foundation the 78 lessons are
# title-only placeholders and carry no number (leakage.mjs refuses a sweep of
# them, correctly: a sweep that saw no numbers validated nothing). Each
# section goes to the tier its heading names as owner, so a graded value
# printed in a section a LOWER tier reads is a FATAL downward leak and one in
# the tier's own sections is a SELF leak. The lesson sweep itself runs in the
# lesson phase (run_gates.sh carries it as kit-leakage-lessons).
#
# Negative control: --plant writes one graded value into an Associate section
# and the sweep must go red.
W=/root/md-wip-supply
mkdir -p $W/scratch; T=$(mktemp -d -p $W/scratch)
python3 - "$T" "$1" <<'PY'
import json, os, re, sys
T, plant = sys.argv[1], sys.argv[2] == '--plant'
W = '/root/md-wip-supply'
tiers = {'Associate': 'beginner', 'Professional': 'intermediate', 'Expert': 'advanced'}
buf = {t: [] for t in tiers.values()}
cur = None
for line in open(f'{W}/digest.txt', encoding='utf-8'):
    m = re.match(r'# SECTION \d+: .*\(owned by (\w+)', line)
    if m:
        cur = tiers[m.group(1)]
    if cur:
        buf[cur].append(line)
if plant:
    f = json.load(open(f'{W}/fields.json'))
    buf['beginner'].append(f'planted {f[12][2]:.2f}\n')
for t, lines in buf.items():
    d = os.path.join(T, t, 'm00-digest')
    os.makedirs(d)
    open(os.path.join(d, 'l00-digest.md'), 'w').write(''.join(lines))
    print(f'  {t}: {len(lines)} digest lines')
PY
node /root/dc-wavekit/leakage.mjs $W --integers --content-root $T 2>&1 | tail -6
rc=$?
rc=$(node /root/dc-wavekit/leakage.mjs $W --integers --content-root $T >/dev/null 2>&1; echo $?)
rm -rf $T
exit $rc
