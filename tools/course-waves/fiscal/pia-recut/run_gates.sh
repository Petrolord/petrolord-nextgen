#!/bin/sh
# Every fiscal PIA re-cut gate, from the repository root. Non-zero exit on the first red gate.
set -e
fail() { echo "RED: $1"; exit 1; }
K=tools/course-waves/fiscal/pia-recut
KIT=${DC_WAVEKIT:-/root/dc-wavekit}
python3 $K/build.py --check
python3 $K/defects_left.py > /tmp/fiscal_dl.txt || { cat /tmp/fiscal_dl.txt; fail defects_left; }; tail -1 /tmp/fiscal_dl.txt
node $K/keytruth.mjs
node $K/keytruth.mjs --plant
for t in beginner intermediate advanced; do node $KIT/numsweep.mjs $K --content src/content/courses/fiscal/$t > /tmp/fiscal_ns.txt || { cat /tmp/fiscal_ns.txt; fail numsweep; }; tail -1 /tmp/fiscal_ns.txt; done
node $KIT/numsweep.mjs $K --banks > /tmp/fiscal_ns.txt || { cat /tmp/fiscal_ns.txt; fail numsweep-banks; }; tail -1 /tmp/fiscal_ns.txt
python3 $K/lengths.py > /tmp/fiscal_len.txt; tail -1 /tmp/fiscal_len.txt; grep -q "out of band: 0" /tmp/fiscal_len.txt || fail lengths
n=$(grep -rnE "[—–]|,\s+not\s+[A-Za-z]" src/content/courses/fiscal src/components/course/panels/fiscal/*.jsx | wc -l); echo "copy rule, lessons and panels: $n"; [ "$n" = 0 ]
n=$(cat $K/banks/*.json | grep -cE "[—–]|,\s+not\s+[A-Za-z]" || true); echo "copy rule, banks: $n"; [ "$n" = 0 ]
for p in ec2b ec2i ec2a; do python3 $KIT/lengthtails.py $K/banks --prefix $p > /tmp/fiscal_lt.txt || fail lengthtails; tail -1 /tmp/fiscal_lt.txt; done
for t in beginner intermediate advanced; do o=$(python3 $K/dupdelta.py $t | tail -1); echo "$o"; case "$o" in *"new or worse 0") ;; *) fail dupdelta;; esac; done
git show 08f17b61d:tools/course-waves/fiscal/fields.json > /tmp/fiscal_fields_main.json
python3 - <<'PY'
import json
a = json.load(open('/tmp/fiscal_fields_main.json')); b = json.load(open('tools/course-waves/fiscal/fields.json'))
assert [x[:3] for x in a] == [x[:3] for x in b], 'a graded value or key moved'
diff = [(x[1], x[3], y[3]) for x, y in zip(a, b) if x[3] != y[3]]
assert diff == [('con_payback_year_cum_ncf_musd', 0.001, 0.0003)], diff
gap = abs(14.739655314252133 - b[4][2])
assert b[4][1] == 'con_payback_year_cum_ncf_musd' and gap > b[4][3]
print(f"fields.json: 18 graded values unchanged; only con_payback_year_cum_ncf_musd narrowed 0.001 -> 0.0003; "
      f"the PIA template's year 2 royalty is {gap:.6f} away, {gap / b[4][3]:.2f} bands, outside the band")
PY
npx vitest run src/components/course/panels/fiscal > /tmp/fiscal_vt.txt 2>&1 || fail vitest; grep -E "Tests " /tmp/fiscal_vt.txt
