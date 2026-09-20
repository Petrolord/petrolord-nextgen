#!/bin/bash
# Run every foundation gate and every negative control, and pin the md5 of each
# gate beside its result in wave.json (the kit README's rule: a green run is
# reproducible only if the gate that gave it is named by its bytes).
W=/root/md-wip-refinery
R=/root/wt-md-refinery-nextgen
cd $W
export TZ=UTC
LOG=$W/gates.log; : > $LOG
fail=0
run() { # name expect(0|nonzero) cmd...
  local name=$1 expect=$2; shift 2
  local out; out=$("$@" 2>&1); local rc=$?
  local ok=0
  if [ "$expect" = 0 ]; then [ $rc -eq 0 ] && ok=1; else [ $rc -ne 0 ] && ok=1; fi
  printf '%s\n%s\n(exit %s, expected %s)\n\n' "== $name" "$out" "$rc" "$expect" >> $LOG
  if [ $ok = 1 ]; then echo "PASS $name (exit $rc)"; else echo "FAIL $name (exit $rc, expected $expect)"; fail=1; fi
  echo "$name|$rc|$(echo "$out" | grep -v '^\s*$' | tail -1)" >> $W/.gates.tsv
}
: > $W/.gates.tsv
run structure 0 python3 structure.py
run digest-repro 0 ./gate_repro.sh
run kit-digestrepro 0 /root/dc-wavekit/digestrepro.sh $W $R
run clock 0 ./gate_clock.sh
run kit-digestprose 0 node /root/dc-wavekit/digestprose.mjs $W/digest.txt --rules $W
run kit-digestfigures 0 python3 /root/dc-wavekit/digestfigures.py $W
run kit-digestleak 0 python3 /root/dc-wavekit/digestleak.py $W
run capstone-generator 0 node refinery_capstone.mjs
run oracle-check 0 python3 oracle_check.py
run oracle-check-CONTROL 1 python3 oracle_check.py --plant
run discriminate 0 node discriminate.mjs
run discriminate-CONTROL 1 node discriminate.mjs --plant
run kit-leakage-digest 0 ./gate_leakage_probe.sh
run collisions 0 python3 gate_collisions.py
run collisions-CONTROL 1 python3 gate_collisions.py --plant
run kit-collisions 0 python3 /root/dc-wavekit/collisions.py $W
run promptleak 0 python3 gate_promptleak.py
run promptleak-CONTROL 1 python3 gate_promptleak.py --plant
run capstone-leak 0 python3 gate_capstone_leak.py
run capstone-leak-CONTROL 1 python3 gate_capstone_leak.py --plant
run copy-rule 0 python3 gate_copy_rule.py
run copy-rule-CONTROL 1 python3 gate_copy_rule.py --plant
run kit-gradeprecision 0 python3 /root/dc-wavekit/gradeprecision.py $W
run kit-sourceprose 0 node /root/dc-wavekit/sourceprose.mjs $W/refinery_dump.mjs $W/refinery_fields.mjs $W/clockguard.mjs $W/refinery_capstone.mjs --rules $W
python3 - <<'PY'
import hashlib, json
W = '/root/md-wip-refinery'
files = {'structure': 'structure.py', 'digest-repro': 'gate_repro.sh',
 'kit-digestrepro': '/root/dc-wavekit/digestrepro.sh', 'clock': 'gate_clock.sh', 'kit-digestprose': '/root/dc-wavekit/digestprose.mjs',
 'kit-digestfigures': '/root/dc-wavekit/digestfigures.py', 'kit-digestleak': '/root/dc-wavekit/digestleak.py',
 'capstone-generator': 'refinery_capstone.mjs', 'oracle-check': 'oracle_check.py',
 'discriminate': 'discriminate.mjs', 'kit-leakage-digest': 'gate_leakage_probe.sh', 'collisions': 'gate_collisions.py',
 'kit-collisions': '/root/dc-wavekit/collisions.py', 'promptleak': 'gate_promptleak.py',
 'capstone-leak': 'gate_capstone_leak.py', 'copy-rule': 'gate_copy_rule.py',
 'kit-gradeprecision': '/root/dc-wavekit/gradeprecision.py', 'kit-sourceprose': '/root/dc-wavekit/sourceprose.mjs'}
gates = {}
for line in open(f'{W}/.gates.tsv'):
    name, rc, last = line.rstrip('\n').split('|', 2)
    base = name.replace('-CONTROL', '')
    p = files[base] if files[base].startswith('/') else f'{W}/{files[base]}'
    gates.setdefault(base, {'file': files[base], 'md5': hashlib.md5(open(p, 'rb').read()).hexdigest()})
    gates[base]['control' if name.endswith('CONTROL') else 'result'] = f'exit {rc}: {last.strip()}'
w = json.load(open(f'{W}/wave.json'))
w['gates'] = gates
d = open(f'{W}/digest.txt', encoding='utf-8').read()
w['digest']['lines'] = d.count('\n')
json.dump(w, open(f'{W}/wave.json', 'w'), indent=1, ensure_ascii=False)
open(f'{W}/wave.json', 'a').write('\n')
PY
rm -f $W/.gates.tsv
[ $fail = 0 ] && echo "ALL GATES AND CONTROLS AS EXPECTED" || echo "SOME GATE FAILED: see gates.log"
exit $fail
