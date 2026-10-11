#!/usr/bin/env python3
"""RUN EVERY QI GATE, WITH ITS NEGATIVE CONTROL, AND PIN WHAT RAN.

Adapted from SC4 marine's run_gates.py. /root/dc-wavekit is not a git
repository, so "the gates passed" means nothing unless the md5 of every gate
that ran is recorded beside the result it gave. This runs each gate and each
negative control, requires the expected exit code of each (0 for a gate, 1 for
a control that must fire), and writes the md5 of the gate file, the command,
the exit code and the gate's last summary line into wave.json under "gates".
It also re-derives the digest and fields blocks of wave.json from the files.

    python3 run_gates.py            run, and write wave.json only if every gate met its expectation
    python3 run_gates.py --dry      run and report, write nothing
    QI_STAGE=lessons python3 run_gates.py   once Associate lesson prose exists
    QI_STAGE=banks python3 run_gates.py     and every bank gate over the banks that exist
    QI_STAGE=final python3 run_gates.py     and the seed ladder checks

QI_TIERS names the tiers whose lessons and banks are gated (default
"beginner"; "beginner,intermediate,advanced" once all three are written).

THE STAGE. At the FOUNDATION the 78 lessons are stubs, so numsweep and lengths
cannot pass and must not be allowed to: each is EXPECTED to exit with its stub
reason (a regex below). And while the Professional and Expert digest sections
do not exist, digestpromise is EXPECTED to name exactly one problem, the
missing sections running to 59 (QI_DIGEST=complete makes it expect 0).

Exit 0 when every gate and every control met its expectation, 1 otherwise.
"""
import hashlib
import json
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
KIT = '/root/dc-wavekit'
REPO = os.environ.get('QI_REPO', '/root/wt-qi-nextgen')
STAGE = os.environ.get('QI_STAGE', 'foundation')
TIERS_GATED = [t for t in os.environ.get('QI_TIERS', 'beginner').split(',') if t]
DIGEST_COMPLETE = os.environ.get('QI_DIGEST') == 'complete'
FOUNDATION = STAGE == 'foundation'
# At the foundation, the stub reason each lesson gate must print to count as met.
STUB_REASON = {
    'numsweep_qi.mjs': r'held NOT ONE literal of seven or more significant figures',
    # Every one of the 78 stubs is under its own floor. The count of tiers whose
    # stub means happen not to rise with est_minutes is title noise, so the
    # reason is the 78 UNDER lines, counted, and not the out-of-band total.
    'lengths.py': (r'UNDER ITS OWN FLOOR', 78),
}
PY_ORACLE = 'python3'  # the QI oracle check is standard library only
# Until the Professional and Expert sections exist, digestpromise must name
# exactly the missing sections, and nothing else.
PENDING_SECTIONS = r'section numbers missing entirely: \[\d+(?:, \d+)*, 59\]\n  => 1 completeness problem'


def md5(p):
    return hashlib.md5(open(p, 'rb').read()).hexdigest()


def sha256(p):
    return hashlib.sha256(open(p, 'rb').read()).hexdigest()


# (name, gate file, command, expected exit)
RUNS = [
    ('structure.py', f'{HERE}/structure.py', ['python3', f'{HERE}/structure.py'], 0),
    ('scaffold.py --check', f'{HERE}/scaffold.py', ['python3', f'{HERE}/scaffold.py', '--check'], 0),
    ('vendor_qi.sh (the closure re-proved, four proofs a path)', f'{HERE}/vendor_qi.sh', ['bash', f'{HERE}/vendor_qi.sh'], 0),
    ('qi_capstone.mjs', f'{HERE}/qi_capstone.mjs', ['node', f'{HERE}/qi_capstone.mjs'], 0),
    ('make_fields.mjs', f'{HERE}/make_fields.mjs', ['node', f'{HERE}/make_fields.mjs'], 0),
    ('make_fields.mjs NEGATIVE CONTROL', f'{HERE}/make_fields.mjs', ['node', f'{HERE}/make_fields.mjs', '--bare-stated-tolerances'], 1),
    ('oracle_check.py', f'{HERE}/oracle_check.py', [PY_ORACLE, '-I', f'{HERE}/oracle_check.py'], 0),
    ('oracle_check.py NEGATIVE CONTROL', f'{HERE}/oracle_check.py', [PY_ORACLE, '-I', f'{HERE}/oracle_check.py', '--plant'], 1),
    ('discriminate.mjs', f'{HERE}/discriminate.mjs', ['node', f'{HERE}/discriminate.mjs'], 0),
    ('discriminate.mjs NEGATIVE CONTROL', f'{HERE}/discriminate.mjs', ['node', f'{HERE}/discriminate.mjs', '--slack-tolerances'], 1),
    ('digestrepro.sh', f'{KIT}/digestrepro.sh', [f'{KIT}/digestrepro.sh', HERE, REPO], 0),
    ('digestprose.mjs', f'{KIT}/digestprose.mjs', ['node', f'{KIT}/digestprose.mjs', f'{HERE}/digest.txt', '--rules', HERE], 0),
    ('digestprose.mjs --selftest', f'{KIT}/digestprose.mjs', ['node', f'{KIT}/digestprose.mjs', '--selftest'], 0),
    ('digestfigures.py', f'{KIT}/digestfigures.py', ['python3', f'{KIT}/digestfigures.py', HERE], 0),
    ('digestfigures.py --selftest', f'{KIT}/digestfigures.py', ['python3', f'{KIT}/digestfigures.py', '--selftest'], 0),
    ('digestpromise_qi.py', f'{HERE}/digestpromise_qi.py', ['python3', f'{HERE}/digestpromise_qi.py'], 0 if DIGEST_COMPLETE else 1),
    ('digestpromise_qi.py NEGATIVE CONTROL', f'{HERE}/digestpromise_qi.py', ['python3', f'{HERE}/digestpromise_qi.py', '--plant'], 1),
    ('digestpromise.py --selftest', f'{KIT}/digestpromise.py', ['python3', f'{KIT}/digestpromise.py', '--selftest'], 0),
    ('digestleak.py', f'{KIT}/digestleak.py', ['python3', f'{KIT}/digestleak.py', HERE], 0),
    ('collisions_qi.py (the kit check() on the tiers present)', f'{HERE}/collisions_qi.py', ['python3', f'{HERE}/collisions_qi.py'], 0),
    ('collisions_qi.py NEGATIVE CONTROL', f'{HERE}/collisions_qi.py', ['python3', f'{HERE}/collisions_qi.py', '--plant'], 1),
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
    ('gate_copy_rule.py NEGATIVE CONTROL bank', f'{HERE}/gate_copy_rule.py', ['python3', f'{HERE}/gate_copy_rule.py', '--plant-bank'], 1),
    ('gate_vocabulary.py', f'{HERE}/gate_vocabulary.py', ['python3', f'{HERE}/gate_vocabulary.py'], 0),
    ('gate_vocabulary.py NEGATIVE CONTROL', f'{HERE}/gate_vocabulary.py', ['python3', f'{HERE}/gate_vocabulary.py', '--plant'], 1),
    ('gate_vocabulary.py NEGATIVE CONTROL licensed', f'{HERE}/gate_vocabulary.py', ['python3', f'{HERE}/gate_vocabulary.py', '--plant-licensed'], 1),
    ('truth_check.py', f'{HERE}/truth_check.py', ['python3', f'{HERE}/truth_check.py'], 0),
    ('truth_check.py NEGATIVE CONTROL', f'{HERE}/truth_check.py', ['python3', f'{HERE}/truth_check.py', '--plant'], 1),
    ('numsweep_qi.mjs --selftest', f'{HERE}/numsweep_qi.mjs', ['node', f'{HERE}/numsweep_qi.mjs', '--selftest'], 0),
    ('lengths.py --selftest', f'{HERE}/lengths.py', ['python3', f'{HERE}/lengths.py', '--selftest'], 0),
    ('gate_claims.mjs', f'{HERE}/gate_claims.mjs', ['node', f'{HERE}/gate_claims.mjs'], 0),
    ('gate_claims.mjs NEGATIVE CONTROL', f'{HERE}/gate_claims.mjs', ['node', f'{HERE}/gate_claims.mjs', '--plant-a-recon-figure'], 1),
]
for tier in TIERS_GATED:
    RUNS.append((f'numsweep_qi.mjs --tier {tier}', f'{HERE}/numsweep_qi.mjs', ['node', f'{HERE}/numsweep_qi.mjs', '--tier', tier], 1 if FOUNDATION else 0))
    RUNS.append((f'lengths.py --tier {tier}', f'{HERE}/lengths.py', ['python3', f'{HERE}/lengths.py', '--tier', tier], 1 if FOUNDATION else 0))
STUB_REASON = {f'numsweep_qi.mjs --tier {t}': STUB_REASON['numsweep_qi.mjs'] for t in TIERS_GATED}
STUB_REASON.update({f'lengths.py --tier {t}': (r'UNDER ITS OWN FLOOR', 26) for t in TIERS_GATED})
if not DIGEST_COMPLETE:
    STUB_REASON['digestpromise_qi.py'] = PENDING_SECTIONS

# THE LESSON STAGE adds the kit's lesson sweeps: every lesson literal against
# the digest by tier range (no forward reach), and the graded-answer leakage
# audit per tier.
if STAGE in ('lessons', 'banks', 'full', 'final'):
    LESSONS = f'{REPO}/src/content/courses/qi'
    RUNS.append(('gate_capstone_leak.mjs (lessons)', f'{HERE}/gate_capstone_leak.mjs', ['node', f'{HERE}/gate_capstone_leak.mjs', '--no-banks'], 0))
    for tier in TIERS_GATED:
        RUNS.append((f'litsweep.py --lessons-only {tier}', f'{KIT}/litsweep.py', ['python3', f'{KIT}/litsweep.py', HERE, '--lessons', f'{LESSONS}/{tier}', '--lessons-only'], 0))
        RUNS.append((f'leakage.mjs lessons {tier}', f'{KIT}/leakage.mjs', ['node', f'{KIT}/leakage.mjs', HERE, '--tier', tier], 0))

# THE BANK STAGE. QI_STAGE=banks (or full) runs everything above AND every bank
# gate over the 21 banks: each bank source re-emitted (bankkit gates inside),
# the repository's check-bank-sources, and per prefix the length tails, the
# near-duplicate audit at Jaccard 0.45, the literal sweep and the leakage audit,
# plus the numsweep and capstone-leak gates with the banks read.
BANKS = STAGE in ('banks', 'full', 'final')
if BANKS:
    BK = f'{HERE}/banks'
    PRE = {'beginner': 'qib', 'intermediate': 'qii', 'advanced': 'qia'}
    for tier in TIERS_GATED:
        pre = PRE[tier]
        for b in ['m01', 'm02', 'm03', 'm04', 'm05', 'm06', 'exam']:
            RUNS.append((f'bank {pre}_{b}.py', f'{BK}/{pre}_{b}.py', ['python3', f'{BK}/{pre}_{b}.py'], 0))
        RUNS.append((f'lengthtails.py {pre}', f'{KIT}/lengthtails.py', ['python3', f'{KIT}/lengthtails.py', BK, '--prefix', pre], 0))
        RUNS.append((f'dupaxes.py {pre}', f'{KIT}/dupaxes.py', ['python3', f'{KIT}/dupaxes.py', BK, '--prefix', pre, '--threshold', '0.45'], 0))
        RUNS.append((f'litsweep.py {pre}', f'{KIT}/litsweep.py', ['python3', f'{KIT}/litsweep.py', HERE, '--prefix', pre], 0))
        RUNS.append((f'leakage.mjs {tier}', f'{KIT}/leakage.mjs', ['node', f'{KIT}/leakage.mjs', HERE, '--banks', BK, '--tier', tier], 0))
        RUNS.append((f'numsweep_qi.mjs --banks {tier}', f'{HERE}/numsweep_qi.mjs', ['node', f'{HERE}/numsweep_qi.mjs', '--banks', BK, '--tier', tier], 0))
    RUNS += [
        ('check-bank-sources.py', f'{REPO}/tools/course-banks/check-bank-sources.py', ['python3', f'{REPO}/tools/course-banks/check-bank-sources.py'], 0),
        ('gate_capstone_leak.mjs --banks', f'{HERE}/gate_capstone_leak.mjs', ['node', f'{HERE}/gate_capstone_leak.mjs', '--banks', BK], 0),
    ]


# THE FINAL (SHIP) STAGE: the seed ladder regenerated from the COMMITTED tree
# (gen_seeds.sh, byte for byte), verify_sql.py field by field with its four
# canaries, the course and go-live generators' self checks, promptleak over the
# course migration, and the migration files' own shape (no transaction lines).
if STAGE == 'final':
    NAMES = json.load(open(os.path.join(HERE, 'ship_names.json')))
    MIG = f"{REPO}/migrations/{NAMES['course']}.sql"
    RUNS += [
        ('gen_seeds.sh HEAD', f'{HERE}/gen_seeds.sh', ['bash', f'{HERE}/gen_seeds.sh', 'HEAD'], 0),
        ('verify_sql.py HEAD', f'{HERE}/verify_sql.py', ['python3', f'{HERE}/verify_sql.py', 'HEAD'], 0),
        ('verify_sql.py CANARY text', f'{HERE}/verify_sql.py', ['python3', f'{HERE}/verify_sql.py', 'HEAD', '--canary'], 2),
        ('verify_sql.py CANARY key', f'{HERE}/verify_sql.py', ['python3', f'{HERE}/verify_sql.py', 'HEAD', '--canary-key'], 2),
        ('verify_sql.py CANARY field', f'{HERE}/verify_sql.py', ['python3', f'{HERE}/verify_sql.py', 'HEAD', '--canary-field'], 2),
        ('verify_sql.py CANARY lesson', f'{HERE}/verify_sql.py', ['python3', f'{HERE}/verify_sql.py', 'HEAD', '--canary-lesson'], 2),
        ('gen_course.py (self checks)', f'{HERE}/gen_course.py', ['python3', f'{HERE}/gen_course.py'], 0),
        ('gen_golive.py (self checks)', f'{HERE}/gen_golive.py', ['python3', '-c', f'import sys; sys.argv=["x"]; sys.path.insert(0, "{HERE}"); import gen_golive as G; sys.exit(1 if G.refused else 0)'], 0),
        ('promptleak.py --sql', f'{KIT}/promptleak.py', ['python3', f'{KIT}/promptleak.py', '--sql', MIG, '--course', 'qi'], 0),
        ('no transaction lines in any QI migration', '/usr/bin/grep', ['bash', '-c', f"! grep -niE '^\\s*(begin|commit|rollback)\\s*;' {REPO}/migrations/*_qi_*.sql"], 0),
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
        if name in STUB_REASON and (FOUNDATION or name == 'digestpromise_qi.py'):
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
            **({'stage': 'expected to refuse for the stated reason (stub lessons, or digest sections still pending)'} if name in STUB_REASON and (FOUNDATION or name == 'digestpromise_qi.py') else {}),
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
