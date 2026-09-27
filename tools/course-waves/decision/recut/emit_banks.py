#!/usr/bin/env python3
"""Emit every EC4 decision bank source to the JSON beside it, through the
course-banks serialisation contract (tools/course-banks/emit_contract.py), the
exact bytes check-bank-sources.py compares. The wave kit's answer-shape audit
(bankkit) is run separately by run_gates.py and reported per bank.

    python3 emit_banks.py
"""
import glob, os, re, subprocess, sys, tempfile, shutil

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..'))
ROOT = os.path.join(REPO, 'tools/course-waves/ec45-recut/banks/decision')
CONTRACT_DIR = os.path.join(REPO, 'tools/course-banks')
KIT = re.compile(r"""sys\.path\.insert\(\s*0\s*,\s*['"]([^'"]+)['"]\s*\)""")
srcs = sorted(glob.glob(os.path.join(ROOT, '*', '*.py')))
if len(srcs) != 21:
    sys.exit(f'REFUSED: {len(srcs)} decision bank sources, expected 21')
shim = tempfile.mkdtemp(prefix='ec4emit.')
shutil.copy(os.path.join(CONTRACT_DIR, 'emit_contract.py'), os.path.join(shim, 'bankkit.py'))
n = 0
for p in srcs:
    body = KIT.sub(lambda _m: f"sys.path.insert(0, {shim!r})", open(p, encoding='utf-8').read(), count=1)
    r = subprocess.run([sys.executable, '-'], input=body, text=True, capture_output=True)
    if r.returncode != 0:
        sys.exit(f'FAILED {p}: {r.stderr.strip()[-400:]}')
    n += 1
shutil.rmtree(shim, ignore_errors=True)
print(f'emitted {n} banks under {os.path.relpath(ROOT, REPO)}')
