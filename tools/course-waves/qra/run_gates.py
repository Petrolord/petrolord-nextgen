#!/usr/bin/env python3
"""RUN EVERY H5 FOUNDATION GATE, WITH ITS NEGATIVE CONTROL, AND PIN WHAT RAN.

The kit README: /root/dc-wavekit is not a git repository, so "the gates passed"
means nothing unless the md5 of every gate that ran is recorded beside the
result it gave. This runs each gate and each negative control, requires the
expected exit code of each (0 for a gate, 1 for a control that must fire),
and writes the md5 of the gate file, the command, the exit code and the gate's
last summary line into wave.json under "gates". It also re-derives the digest
and fields blocks of wave.json from the files, so wave.json cannot claim a line
count the digest does not have.

    python3 run_gates.py            run, and write wave.json only if every gate met its expectation
    python3 run_gates.py --dry      run and report, write nothing

Exit 0 when every gate and every control met its expectation, 1 otherwise.
"""
import hashlib
import json
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
KIT = '/root/dc-wavekit'


def md5(p):
    return hashlib.md5(open(p, 'rb').read()).hexdigest()


def sha256(p):
    return hashlib.sha256(open(p, 'rb').read()).hexdigest()


NG = os.environ.get('H5_REPO', '/root/wt-h5-nextgen')
PY_ORACLE = os.environ.get('H5_ORACLE_PYTHON', '/root/hseenv/bin/python')
LEAK = ['node', f'{HERE}/gate_capstone_leak.mjs', '--no-banks']

# (name, gate file, command, expected exit)
RUNS = [
    ('structure.py', f'{HERE}/structure.py', ['python3', f'{HERE}/structure.py'], 0),
    ('h5_capstone.mjs', f'{HERE}/h5_capstone.mjs', ['node', f'{HERE}/h5_capstone.mjs', '--json'], 0),
    ('vendor_qra.sh', f'{HERE}/vendor_qra.sh', [f'{HERE}/vendor_qra.sh'], 0),
    ('make_fields.mjs', f'{HERE}/make_fields.mjs', ['node', f'{HERE}/make_fields.mjs'], 0),
    ('make_fields.mjs NEGATIVE CONTROL', f'{HERE}/make_fields.mjs', ['node', f'{HERE}/make_fields.mjs', '--bare-stated-tolerances'], 1),
    ('oracle_check.py', f'{HERE}/oracle_check.py', [PY_ORACLE, f'{HERE}/oracle_check.py'], 0),
    ('oracle_check.py NEGATIVE CONTROL', f'{HERE}/oracle_check.py', [PY_ORACLE, f'{HERE}/oracle_check.py', '--plant'], 1),
    ('discriminate.mjs', f'{HERE}/discriminate.mjs', ['node', f'{HERE}/discriminate.mjs'], 0),
    ('discriminate.mjs NEGATIVE CONTROL', f'{HERE}/discriminate.mjs', ['node', f'{HERE}/discriminate.mjs', '--slack-tolerances'], 1),
    ('digestrepro.sh', f'{KIT}/digestrepro.sh', [f'{KIT}/digestrepro.sh', HERE], 0),
    ('digestprose.mjs', f'{KIT}/digestprose.mjs', ['node', f'{KIT}/digestprose.mjs', f'{HERE}/digest.txt', '--rules', HERE], 0),
    ('digestprose.mjs --selftest', f'{KIT}/digestprose.mjs', ['node', f'{KIT}/digestprose.mjs', '--selftest'], 0),
    ('digestfigures.py', f'{KIT}/digestfigures.py', ['python3', f'{KIT}/digestfigures.py', HERE], 0),
    ('digestfigures.py --selftest', f'{KIT}/digestfigures.py', ['python3', f'{KIT}/digestfigures.py', '--selftest'], 0),
    ('digestpromise.py', f'{KIT}/digestpromise.py', ['python3', f'{KIT}/digestpromise.py', HERE], 0),
    ('digestpromise.py --selftest', f'{KIT}/digestpromise.py', ['python3', f'{KIT}/digestpromise.py', '--selftest'], 0),
    ('digestleak.py', f'{KIT}/digestleak.py', ['python3', f'{KIT}/digestleak.py', HERE], 0),
    ('collisions.py', f'{KIT}/collisions.py', ['python3', f'{KIT}/collisions.py', HERE], 0),
    ('gradeprecision.py', f'{KIT}/gradeprecision.py', ['python3', f'{KIT}/gradeprecision.py', HERE], 0),
    ('briefleak.py', f'{KIT}/briefleak.py', ['python3', f'{KIT}/briefleak.py', HERE], 0),
    ('briefcheck.py', f'{KIT}/briefcheck.py', ['python3', f'{KIT}/briefcheck.py', HERE], 0),
    ('gate_capstone_leak.mjs', f'{HERE}/gate_capstone_leak.mjs', LEAK + ['--no-lessons'], 0),
    ('gate_capstone_leak.mjs NEGATIVE CONTROL value', f'{HERE}/gate_capstone_leak.mjs', LEAK + ['--no-lessons', '--plant-value'], 1),
    ('gate_capstone_leak.mjs NEGATIVE CONTROL input', f'{HERE}/gate_capstone_leak.mjs', LEAK + ['--no-lessons', '--plant-input'], 1),
    ('gate_capstone_leak.mjs NEGATIVE CONTROL name', f'{HERE}/gate_capstone_leak.mjs', LEAK + ['--no-lessons', '--plant-name'], 1),
    ('gate_capstone_leak.mjs NEGATIVE CONTROL lesson', f'{HERE}/gate_capstone_leak.mjs', LEAK + ['--plant-lesson'], 1),
    ('gate_capstone_leak.mjs NEGATIVE CONTROL seam', f'{HERE}/gate_capstone_leak.mjs', LEAK + ['--no-lessons', '--plant-seam'], 1),
    ('gate_copy_rule.py', f'{HERE}/gate_copy_rule.py', ['python3', f'{HERE}/gate_copy_rule.py'], 0),
    ('gate_copy_rule.py NEGATIVE CONTROL', f'{HERE}/gate_copy_rule.py', ['python3', f'{HERE}/gate_copy_rule.py', '--plant'], 1),
    ('gate_vocabulary.py', f'{HERE}/gate_vocabulary.py', ['python3', f'{HERE}/gate_vocabulary.py'], 0),
    ('gate_vocabulary.py NEGATIVE CONTROL', f'{HERE}/gate_vocabulary.py', ['python3', f'{HERE}/gate_vocabulary.py', '--plant'], 1),
    ('gate_claims.mjs', f'{HERE}/gate_claims.mjs', ['node', f'{HERE}/gate_claims.mjs'], 0),
    ('gate_claims.mjs NEGATIVE CONTROL', f'{HERE}/gate_claims.mjs', ['node', f'{HERE}/gate_claims.mjs', '--plant-a-recon-figure'], 1),
    ('lengths.py --selftest', f'{HERE}/lengths.py', ['python3', f'{HERE}/lengths.py', '--selftest'], 0),
    ('scaffold.py --dry-run', f'{HERE}/scaffold.py', ['python3', f'{HERE}/scaffold.py', '--dry-run'], 0),
    ('check-vendored-engines.mjs', f'{NG}/tools/check-vendored-engines.mjs', ['node', f'{NG}/tools/check-vendored-engines.mjs'], 0),
]


def last_line(out):
    lines = [l for l in out.strip().split('\n') if l.strip()]
    return lines[-1].strip()[:220] if lines else ''


def write_blocks():
    """The digest and fields blocks are DERIVED FROM THE FILES, before any gate
    runs, because gate_claims.mjs checks wave.json's claims against them."""
    dpath = os.path.join(HERE, 'digest.txt')
    digest = open(dpath, encoding='utf-8').read()
    w = json.load(open(os.path.join(HERE, 'wave.json')))
    w['digest'] = {
        'lines': len(digest.rstrip('\n').split('\n')),
        'sections': sum(1 for l in digest.split('\n') if l.startswith('# SECTION ')),
        'md5': md5(dpath), 'sha256': sha256(dpath),
    }
    fields = json.load(open(os.path.join(HERE, 'fields.json')))
    w['fields'] = {
        'count': len(fields), 'sha256': sha256(os.path.join(HERE, 'fields.json')),
        'keys': [f[1] for f in fields],
    }
    return w


def save(w):
    json.dump(w, open(os.path.join(HERE, 'wave.json'), 'w'), indent=1, ensure_ascii=False)
    open(os.path.join(HERE, 'wave.json'), 'a').write('\n')


def main():
    dry = '--dry' in sys.argv
    if not dry:
        save(write_blocks())
    results = {}
    ok = True
    for name, gate, cmd, want in RUNS:
        p = subprocess.run(cmd, capture_output=True, text=True, cwd=HERE)
        met = p.returncode == want
        ok = ok and met
        results[name] = {
            'md5': md5(gate), 'command': ' '.join(os.path.basename(c) if c.startswith(HERE) else c for c in cmd),
            'expected': want, 'exit': p.returncode, 'summary': last_line(p.stdout + '\n' + p.stderr),
        }
        print(f'  {"ok  " if met else "FAIL"} exit {p.returncode} (want {want})  {name}  md5 {results[name]["md5"][:12]}')
        if not met:
            print('     ' + '\n     '.join((p.stdout + p.stderr).strip().split('\n')[-12:]))
    print(f'run_gates: {len(RUNS)} runs, {"all met their expectation" if ok else "SOME DID NOT"}')
    if dry or not ok:
        return 0 if ok else 1
    w = write_blocks()
    w['gates'] = results
    save(w)
    print('  wave.json: digest, fields and gates blocks written')
    return 0


sys.exit(main())
