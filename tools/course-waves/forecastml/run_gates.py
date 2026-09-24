#!/usr/bin/env python3
"""RUN EVERY D4 FOUNDATION GATE, WITH ITS NEGATIVE CONTROL, AND PIN WHAT RAN.

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
    D4_STAGE=lessons python3 run_gates.py   the same, once lesson prose exists
    D4_STAGE=banks python3 run_gates.py     and every bank gate over the 21 banks

THE STAGE. At the FOUNDATION the 78 lessons are stubs (an H1 and a panel line),
so the two lesson gates cannot pass and must not be allowed to: numsweep
REFUSES because no stub quotes a figure, and lengths is out of band on every
lesson. At the foundation each is therefore EXPECTED to exit 1, AND its
output must show exactly that stub reason (a regex below), so a refusal for
any other reason still fails the run. D4_STAGE=lessons makes both expect 0.

Exit 0 when every gate and every control met its expectation, 1 otherwise.
"""
import hashlib
import json
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
KIT = '/root/dc-wavekit'
REPO = os.environ.get('D4_REPO', '/root/wt-dai-d4-nextgen')
STAGE = os.environ.get('D4_STAGE', 'foundation')
FOUNDATION = STAGE == 'foundation'
# At the foundation, the stub reason each lesson gate must print to count as met.
STUB_REASON = {
    'numsweep_forecastml.mjs': r'held NOT ONE literal of seven or more significant figures',
    # Every one of the 78 stubs is under its own floor. The count of tiers whose
    # stub means happen not to rise with est_minutes is title noise, so the
    # reason is the 78 UNDER lines, counted, and not the out-of-band total.
    'lengths.py': (r'UNDER ITS OWN FLOOR', 78),
}
PY_ORACLE = 'python3'  # the D4 oracle is standard library only


def md5(p):
    return hashlib.md5(open(p, 'rb').read()).hexdigest()


def sha256(p):
    return hashlib.sha256(open(p, 'rb').read()).hexdigest()


# (name, gate file, command, expected exit)
RUNS = [
    ('structure.py', f'{HERE}/structure.py', ['python3', f'{HERE}/structure.py'], 0),
    ('scaffold.py --check', f'{HERE}/scaffold.py', ['python3', f'{HERE}/scaffold.py', '--check'], 0),
    ('d4_capstone.mjs', f'{HERE}/d4_capstone.mjs', ['node', f'{HERE}/d4_capstone.mjs'], 0),
    ('make_fields.mjs', f'{HERE}/make_fields.mjs', ['node', f'{HERE}/make_fields.mjs'], 0),
    ('make_fields.mjs NEGATIVE CONTROL', f'{HERE}/make_fields.mjs', ['node', f'{HERE}/make_fields.mjs', '--bare-stated-tolerances'], 1),
    ('oracle_check.py', f'{HERE}/oracle_check.py', [PY_ORACLE, f'{HERE}/oracle_check.py'], 0),
    ('oracle_check.py NEGATIVE CONTROL', f'{HERE}/oracle_check.py', [PY_ORACLE, f'{HERE}/oracle_check.py', '--plant'], 1),
    ('discriminate.mjs', f'{HERE}/discriminate.mjs', ['node', f'{HERE}/discriminate.mjs'], 0),
    ('discriminate.mjs NEGATIVE CONTROL', f'{HERE}/discriminate.mjs', ['node', f'{HERE}/discriminate.mjs', '--slack-tolerances'], 1),
    ('digestrepro.sh', f'{KIT}/digestrepro.sh', [f'{KIT}/digestrepro.sh', HERE, REPO], 0),
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
    ('gate_capstone_leak.mjs', f'{HERE}/gate_capstone_leak.mjs', ['node', f'{HERE}/gate_capstone_leak.mjs', '--no-banks'], 0),
    ('gate_capstone_leak.mjs NEGATIVE CONTROL value', f'{HERE}/gate_capstone_leak.mjs', ['node', f'{HERE}/gate_capstone_leak.mjs', '--no-banks', '--plant-value'], 1),
    ('gate_capstone_leak.mjs NEGATIVE CONTROL input', f'{HERE}/gate_capstone_leak.mjs', ['node', f'{HERE}/gate_capstone_leak.mjs', '--no-banks', '--plant-input'], 1),
    ('gate_capstone_leak.mjs NEGATIVE CONTROL name', f'{HERE}/gate_capstone_leak.mjs', ['node', f'{HERE}/gate_capstone_leak.mjs', '--no-banks', '--plant-name'], 1),
    ('gate_capstone_leak.mjs NEGATIVE CONTROL lesson', f'{HERE}/gate_capstone_leak.mjs', ['node', f'{HERE}/gate_capstone_leak.mjs', '--no-banks', '--plant-lesson'], 1),
    ('gate_copy_rule.py', f'{HERE}/gate_copy_rule.py', ['python3', f'{HERE}/gate_copy_rule.py'], 0),
    ('gate_copy_rule.py NEGATIVE CONTROL', f'{HERE}/gate_copy_rule.py', ['python3', f'{HERE}/gate_copy_rule.py', '--plant'], 1),
    ('gate_typed_literals.py', f'{HERE}/gate_typed_literals.py', ['python3', f'{HERE}/gate_typed_literals.py'], 0),
    ('gate_typed_literals.py NEGATIVE CONTROL', f'{HERE}/gate_typed_literals.py', ['python3', f'{HERE}/gate_typed_literals.py', '--plant'], 1),
    ('gate_vocabulary.py', f'{HERE}/gate_vocabulary.py', ['python3', f'{HERE}/gate_vocabulary.py'], 0),
    ('gate_vocabulary.py NEGATIVE CONTROL', f'{HERE}/gate_vocabulary.py', ['python3', f'{HERE}/gate_vocabulary.py', '--plant'], 1),
    ('truth_check.py', f'{HERE}/truth_check.py', ['python3', f'{HERE}/truth_check.py'], 0),
    ('truth_check.py NEGATIVE CONTROL', f'{HERE}/truth_check.py', ['python3', f'{HERE}/truth_check.py', '--plant'], 1),
    ('numsweep_forecastml.mjs', f'{HERE}/numsweep_forecastml.mjs', ['node', f'{HERE}/numsweep_forecastml.mjs'], 1 if FOUNDATION else 0),
    ('numsweep_forecastml.mjs --selftest', f'{HERE}/numsweep_forecastml.mjs', ['node', f'{HERE}/numsweep_forecastml.mjs', '--selftest'], 0),
    ('lengths.py', f'{HERE}/lengths.py', ['python3', f'{HERE}/lengths.py'], 1 if FOUNDATION else 0),
    ('lengths.py --selftest', f'{HERE}/lengths.py', ['python3', f'{HERE}/lengths.py', '--selftest'], 0),
    ('gate_claims.mjs', f'{HERE}/gate_claims.mjs', ['node', f'{HERE}/gate_claims.mjs'], 0),
    ('gate_claims.mjs NEGATIVE CONTROL', f'{HERE}/gate_claims.mjs', ['node', f'{HERE}/gate_claims.mjs', '--plant-a-recon-figure'], 1),
]

# THE BANK STAGE. D4_STAGE=banks (or full) runs everything above AND every bank
# gate over the 21 banks: each bank source re-emitted (bankkit gates inside),
# the repository's check-bank-sources, and per prefix the length tails, the
# near-duplicate audit at Jaccard 0.45, the literal sweep and the leakage audit,
# plus the numsweep and capstone-leak gates with the banks read.
BANKS = STAGE in ('banks', 'full')
if BANKS:
    BK = f'{HERE}/banks'
    TIERS = [('d3b', 'beginner'), ('d3i', 'intermediate'), ('d3a', 'advanced')]
    for pre, tier in TIERS:
        for b in ['m01', 'm02', 'm03', 'm04', 'm05', 'm06', 'exam']:
            RUNS.append((f'bank {pre}_{b}.py', f'{BK}/{pre}_{b}.py', ['python3', f'{BK}/{pre}_{b}.py'], 0))
        RUNS.append((f'lengthtails.py {pre}', f'{KIT}/lengthtails.py', ['python3', f'{KIT}/lengthtails.py', BK, '--prefix', pre], 0))
        RUNS.append((f'dupaxes.py {pre}', f'{KIT}/dupaxes.py', ['python3', f'{KIT}/dupaxes.py', BK, '--prefix', pre, '--threshold', '0.45'], 0))
        RUNS.append((f'litsweep.py {pre}', f'{KIT}/litsweep.py', ['python3', f'{KIT}/litsweep.py', HERE, '--prefix', pre], 0))
        RUNS.append((f'leakage.mjs {tier}', f'{KIT}/leakage.mjs', ['node', f'{KIT}/leakage.mjs', HERE, '--banks', BK, '--tier', tier], 0))
    RUNS += [
        ('check-bank-sources.py', f'{REPO}/tools/course-banks/check-bank-sources.py', ['python3', f'{REPO}/tools/course-banks/check-bank-sources.py'], 0),
        ('numsweep_forecastml.mjs --banks', f'{HERE}/numsweep_forecastml.mjs', ['node', f'{HERE}/numsweep_forecastml.mjs', '--banks', BK], 0),
        ('numsweep.mjs (kit) --banks', f'{KIT}/numsweep.mjs', ['node', f'{KIT}/numsweep.mjs', HERE, '--banks', BK], 0),
        ('gate_capstone_leak.mjs --banks', f'{HERE}/gate_capstone_leak.mjs', ['node', f'{HERE}/gate_capstone_leak.mjs', '--banks', BK], 0),
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
        if FOUNDATION and name in STUB_REASON:
            import re
            want = STUB_REASON[name]
            if isinstance(want, tuple):
                met = met and len(re.findall(want[0], p.stdout + p.stderr)) == want[1]
            else:
                met = met and re.search(want, p.stdout + p.stderr) is not None
        ok = ok and met
        results[name] = {
            'md5': md5(gate), 'command': ' '.join(os.path.basename(c) if c.startswith(HERE) else c for c in cmd),
            'expected': want, 'exit': p.returncode, 'summary': last_line(p.stdout + '\n' + p.stderr),
            **({'stage': 'foundation: expected to refuse on the 78 stubs for the stated reason'} if FOUNDATION and name in STUB_REASON else {}),
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
