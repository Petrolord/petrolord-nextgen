#!/bin/bash
# Run every foundation gate and every negative control, and pin the md5 of each
# gate beside its result in wave.json (the kit README's rule: a green run is
# reproducible only if the gate that gave it is named by its bytes).
W=/root/md-wip-supply
REPO=/root/wt-md-supply-nextgen
cd $W
export TZ=UTC
LOG=$W/gates.log; : > $LOG
fail=0
run() { # name expect(0|nonzero|2) cmd...
  local name=$1 expect=$2; shift 2
  local out; out=$("$@" 2>&1); local rc=$?
  local ok=0
  case "$expect" in
    0) [ $rc -eq 0 ] && ok=1 ;;
    2) [ $rc -eq 2 ] && ok=1 ;;
    *) [ $rc -ne 0 ] && ok=1 ;;
  esac
  printf '%s\n%s\n(exit %s, expected %s)\n\n' "== $name" "$out" "$rc" "$expect" >> $LOG
  if [ $ok = 1 ]; then echo "PASS $name (exit $rc)"; else echo "FAIL $name (exit $rc, expected $expect)"; fail=1; fi
  echo "$name|$rc|$(echo "$out" | grep -v '^\s*$' | tail -1)" >> $W/.gates.tsv
}
: > $W/.gates.tsv
run structure 0 python3 structure.py
run engine-suites 0 sh -c "cd $REPO/packages/engines && npx jest __tests__/downstream.supply.golden.test.js __tests__/downstream.terminalDepot.test.js __tests__/downstream.fuelPricing.test.js > $W/scratch/jest.log 2>&1; rc=\$?; grep -E '^Tests:' $W/scratch/jest.log; exit \$rc"
run digest-repro 0 ./gate_repro.sh
run kit-digestrepro 0 /root/dc-wavekit/digestrepro.sh $W $REPO
run clock 0 ./gate_clock.sh
run kit-digestprose 0 node /root/dc-wavekit/digestprose.mjs $W/digest.txt --rules $W
run kit-digestfigures 0 python3 /root/dc-wavekit/digestfigures.py $W
run capstone-generator 0 node supply_capstone.mjs
run oracle-check 0 python3 oracle_check.py
run oracle-check-CONTROL 1 python3 oracle_check.py --plant
run discriminate 0 node discriminate.mjs
run discriminate-CONTROL 1 node discriminate.mjs --plant
run collisions 0 python3 gate_collisions.py
run collisions-CONTROL 1 python3 gate_collisions.py --plant
run kit-collisions 0 python3 /root/dc-wavekit/collisions.py $W
run promptleak 0 python3 gate_promptleak.py
run promptleak-CONTROL 1 python3 gate_promptleak.py --plant
run capstone-leak 0 python3 gate_capstone_leak.py
run capstone-leak-CONTROL 1 python3 gate_capstone_leak.py --plant
run leakage-digest 0 ./gate_leakage_digest.sh
run leakage-digest-CONTROL 1 ./gate_leakage_digest.sh --plant
# The lesson sweep over the 78 written lessons (the foundation expected a
# refusal here, exit 2, while the lessons were placeholders).
run kit-leakage-lessons 0 node /root/dc-wavekit/leakage.mjs $W --integers --content-root $REPO/src/content/courses/supply
run copy-rule 0 python3 gate_copy_rule.py
run copy-rule-CONTROL 1 python3 gate_copy_rule.py --plant
run kit-gradeprecision 0 python3 /root/dc-wavekit/gradeprecision.py $W
run kit-sourceprose 0 node /root/dc-wavekit/sourceprose.mjs $W/supply_dump.mjs $W/supply_fields.mjs $W/supply_capstone.mjs $W/supply_fields_capstone.mjs --rules $W
python3 - <<'PY'
import hashlib, json
W = '/root/md-wip-supply'
files = {'structure': 'structure.py', 'engine-suites': 'run_gates.sh', 'digest-repro': 'gate_repro.sh',
 'kit-digestrepro': '/root/dc-wavekit/digestrepro.sh', 'clock': 'gate_clock.sh', 'kit-digestprose': '/root/dc-wavekit/digestprose.mjs',
 'kit-digestfigures': '/root/dc-wavekit/digestfigures.py', 'capstone-generator': 'supply_capstone.mjs', 'oracle-check': 'oracle_check.py',
 'discriminate': 'discriminate.mjs', 'collisions': 'gate_collisions.py', 'kit-collisions': '/root/dc-wavekit/collisions.py',
 'promptleak': 'gate_promptleak.py', 'capstone-leak': 'gate_capstone_leak.py', 'leakage-digest': 'gate_leakage_digest.sh',
 'kit-leakage-lessons': '/root/dc-wavekit/leakage.mjs', 'copy-rule': 'gate_copy_rule.py',
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
json.dump(w, open(f'{W}/wave.json', 'w'), indent=1, ensure_ascii=False)
open(f'{W}/wave.json', 'a').write('\n')
PY
rm -f $W/.gates.tsv
[ $fail = 0 ] && echo "ALL GATES AND CONTROLS AS EXPECTED" || echo "SOME GATE FAILED: see gates.log"
exit $fail
