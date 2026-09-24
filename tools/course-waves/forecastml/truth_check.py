#!/usr/bin/env python3
"""truth-forecastml.json MUST BE THE HARVEST OF THE digest.txt BESIDE IT.

numsweep resolves lesson literals against truth-*.json, which the kit's
harvest_digest.py builds FROM the digest. A rebuilt digest with a stale truth
file makes numsweep resolve against figures the digest no longer prints (and
report perfectly resolvable ones as unresolved). This re-runs the harvester on
a scratch copy of digest.txt and wave.json and requires the committed truth
file to be byte-identical to it.

    python3 truth_check.py            check
    python3 truth_check.py --plant    THE NEGATIVE CONTROL: appends a line to the
                                      scratch digest, must exit 1
Exit 0 identical, 1 stale, 2 could not run.
"""
import os, shutil, subprocess, sys, tempfile, filecmp
HERE = os.path.dirname(os.path.abspath(__file__))
KIT = os.environ.get('D4_KIT', '/root/dc-wavekit')
truth = os.path.join(HERE, 'truth-forecastml.json')
if not os.path.exists(truth):
    print('REFUSED: no truth-forecastml.json; run harvest_digest.py'); sys.exit(2)
tmp = tempfile.mkdtemp(prefix='d4-truth-')
shutil.copy(os.path.join(HERE, 'digest.txt'), tmp)
shutil.copy(os.path.join(HERE, 'wave.json'), tmp)
if '--plant' in sys.argv:
    open(os.path.join(tmp, 'digest.txt'), 'a').write('\nA planted figure 4.217 psi.\n')
subprocess.run(['python3', os.path.join(KIT, 'harvest_digest.py'), tmp], check=True, capture_output=True)
same = filecmp.cmp(truth, os.path.join(tmp, 'truth-forecastml.json'), shallow=False)
n = len(__import__('json').load(open(truth)))
shutil.rmtree(tmp)
print(f'truth_check: truth-forecastml.json ({n} digest lines) {"IS" if same else "IS NOT"} the harvest of digest.txt')
if '--plant' in sys.argv:
    print(f'NEGATIVE CONTROL: a line was planted in the scratch digest; expected a mismatch, {"caught" if not same else "NOT CAUGHT"}')
    sys.exit(1 if not same else 2)
sys.exit(0 if same else 1)
