#!/bin/bash
# Run every foundation gate and every negative control, and pin the md5 of each
# gate beside its result in wave.json (the kit README's rule: a green run is
# reproducible only if the gate that gave it is named by its bytes).
W=/root/md-wip-crude
R=/root/wt-md-crude-nextgen
cd $W
export TZ=UTC
LOG=$W/gates.log; : > $LOG
fail=0
run() { # name expect(0|nonzero|N) cmd...
  local name=$1 expect=$2; shift 2
  local out; out=$("$@" 2>&1); local rc=$?
  local ok=0
  case "$expect" in
    0) [ $rc -eq 0 ] && ok=1 ;;
    nonzero) [ $rc -ne 0 ] && ok=1 ;;
    *) [ $rc -eq "$expect" ] && ok=1 ;;
  esac
  printf '%s\n%s\n(exit %s, expected %s)\n\n' "== $name" "$out" "$rc" "$expect" >> $LOG
  if [ $ok = 1 ]; then echo "PASS $name (exit $rc)"; else echo "FAIL $name (exit $rc, expected $expect)"; fail=1; fi
  echo "$name|$rc|$(echo "$out" | grep -v '^\s*$' | tail -1)" >> $W/.gates.tsv
}
: > $W/.gates.tsv
run structure 0 python3 structure.py
run vendor 0 ./gate_vendor.sh
run engine-jest 0 bash -c "cd $R/packages/engines && npx jest __tests__/downstream.crudeAssay __tests__/downstream.productBlending __tests__/lp.simplex 2>&1 | grep -E '^Tests:|^Test Suites:' ; exit \${PIPESTATUS[0]}"
run digest-repro 0 ./gate_repro.sh
run kit-digestrepro 0 /root/dc-wavekit/digestrepro.sh $W $R
run clock 0 ./gate_clock.sh
run kit-digestprose 0 node /root/dc-wavekit/digestprose.mjs $W/digest.txt --rules $W
run kit-digestfigures 0 python3 /root/dc-wavekit/digestfigures.py $W
run capstone-generator 0 node crude_capstone.mjs
run oracle-check 0 python3 oracle_check.py
run oracle-check-CONTROL nonzero python3 oracle_check.py --plant
run discriminate 0 node discriminate.mjs
run discriminate-CONTROL nonzero node discriminate.mjs --plant
run collisions 0 python3 gate_collisions.py
run collisions-CONTROL nonzero python3 gate_collisions.py --plant
run promptleak 0 python3 gate_promptleak.py
run promptleak-CONTROL nonzero python3 gate_promptleak.py --plant
run capstone-leak 0 python3 gate_capstone_leak.py
run capstone-leak-CONTROL nonzero python3 gate_capstone_leak.py --plant
# leakage.mjs over the teaching road: the 78 written lessons, and the digest
# (which every lesson quotes) in the BEGINNER tier's place, the strictest seat:
# any graded value of any tier found there is a leak.
mkdir -p $W/scratch/digest-as-content/beginner/m00 && cp $W/digest.txt $W/scratch/digest-as-content/beginner/m00/l00-digest.md
run kit-leakage-lessons 0 node /root/dc-wavekit/leakage.mjs $W --content-root $R/src/content/courses/crude
run kit-leakage-digest 0 node /root/dc-wavekit/leakage.mjs $W --content-root $W/scratch/digest-as-content
run kit-leakage-CONTROL 0 node /root/dc-wavekit/leakage.mjs --selftest
run copy-rule 0 python3 gate_copy_rule.py
run copy-rule-CONTROL nonzero python3 gate_copy_rule.py --plant
run kit-gradeprecision 0 python3 /root/dc-wavekit/gradeprecision.py $W
run kit-gradeprecision-CONTROL 0 python3 /root/dc-wavekit/gradeprecision.py --selftest
run kit-sourceprose 0 node /root/dc-wavekit/sourceprose.mjs $W/crude_dump.mjs $W/crude_fields.mjs $W/crude_capstone.mjs $W/crude_fields_capstone.mjs --rules $W
python3 - <<'PY'
import hashlib, json
W = '/root/md-wip-crude'
files = {'structure': 'structure.py', 'vendor': 'gate_vendor.sh', 'engine-jest': 'gate_vendor.sh', 'digest-repro': 'gate_repro.sh',
 'kit-digestrepro': '/root/dc-wavekit/digestrepro.sh', 'clock': 'gate_clock.sh', 'kit-digestprose': '/root/dc-wavekit/digestprose.mjs',
 'kit-digestfigures': '/root/dc-wavekit/digestfigures.py', 'capstone-generator': 'crude_capstone.mjs', 'oracle-check': 'oracle_check.py',
 'discriminate': 'discriminate.mjs', 'collisions': 'gate_collisions.py', 'promptleak': 'gate_promptleak.py',
 'capstone-leak': 'gate_capstone_leak.py', 'copy-rule': 'gate_copy_rule.py',
 'kit-gradeprecision': '/root/dc-wavekit/gradeprecision.py', 'kit-sourceprose': '/root/dc-wavekit/sourceprose.mjs',
 'kit-leakage-lessons': '/root/dc-wavekit/leakage.mjs', 'kit-leakage-digest': '/root/dc-wavekit/leakage.mjs', 'kit-leakage': '/root/dc-wavekit/leakage.mjs'}
gates = {}
for line in open(f'{W}/.gates.tsv'):
    name, rc, last = line.rstrip('\n').split('|', 2)
    base = name.replace('-CONTROL', '')
    p = files[base] if files[base].startswith('/') else f'{W}/{files[base]}'
    gates.setdefault(base, {'file': files[base], 'md5': hashlib.md5(open(p, 'rb').read()).hexdigest()})
    gates[base]['control' if name.endswith('CONTROL') else 'result'] = f'exit {rc}: {last.strip()}'
w = json.load(open(f'{W}/wave.json'))
w['gates'] = gates
w['digest']['lines'] = sum(1 for _ in open(f'{W}/digest.txt'))
json.dump(w, open(f'{W}/wave.json', 'w'), indent=1, ensure_ascii=False)
open(f'{W}/wave.json', 'a').write('\n')
PY
rm -f $W/.gates.tsv
[ $fail = 0 ] && echo "ALL GATES AND CONTROLS AS EXPECTED" || echo "SOME GATE FAILED: see gates.log"
exit $fail
