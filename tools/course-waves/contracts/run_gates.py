#!/usr/bin/env python3
"""RUN EVERY SC5 FOUNDATION GATE, WITH ITS NEGATIVE CONTROL, AND PIN WHAT RAN.

Adapted from the EC11 prms runner for the first PRACTICE COURSE. There is no
engine, so there is no digest, no graded field, no oracle, no numsweep and no
capstone leak gate. What a practice foundation is gated on:

  structure and scaffold    structure.py (78 lessons, no panel, 21 banks);
                            scaffold.py --check (manifests and stubs);
  the pack                  curate_pack.py --check and build_pack.py --check
                            (the pack reproduces from its drafts and its
                            curation decisions); gate_quotes.py (every quotation
                            word for word, only quotable texts quoted);
                            gate_source_trace.py (sources dated and pinned by
                            sha256, no invented figure, Nigerian law by section,
                            the lesson and key trace, no passage id in learner
                            text);
  the copy                  gate_copy_rule.py (dashes and contrastives over the
                            pack, lessons, manifests, banks and the practice
                            pages); gate_vocabulary.py (repair history, a
                            reading called the law, a licensed text quoted, a
                            computation claimed, an AI claim);
                            gate_licensed_prose.py (no eight-word run of a
                            licensed text held); gate_brief_claims.py (every
                            figure in the five briefs is the pack's);
  lengths                   lengths.py, which at the foundation must refuse
                            with exactly the 78 stub lessons under their floor;
  the banks                 gate_banks.py (21 stubs, literal emit paths, the
                            declared counts, one trace per question, empty at
                            the foundation) and the wave kit's bank audits'
                            own self tests (dupaxes, lengthtails, bankrepro,
                            crosspair, bankleak), which prove the audits the
                            banks will face fire;
  the platform              dryrun_platform.sh (the platform migration on a
                            local scratch Postgres, with its negative control);
  prior courses             prove_prior_courses.sh;
  the course row            gen_course.py (self checks; no capstone).

Each negative control is run beside its gate and must exit 1. The md5 of every
gate file, the command, the exit code and the last summary line are written
into wave.json under "gates", with the pack's own block (sections, passages,
sources and the sha256 of PACK.md), only when every run met its expectation.

    python3 run_gates.py            run, and write wave.json only if all met
    python3 run_gates.py --dry      run and report, write nothing
    SC5_STAGE=lessons|banks python3 run_gates.py

Exit 0 when every gate and control met its expectation, 1 otherwise.
"""
import hashlib
import json
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
KIT = '/root/dc-wavekit'
STAGE = os.environ.get('SC5_STAGE', 'foundation')
FOUNDATION = STAGE == 'foundation'
STUB_REASON = {'lengths.py': (r'UNDER ITS OWN FLOOR', 78)}


def md5(p):
    return hashlib.md5(open(p, 'rb').read()).hexdigest()


def sha256(p):
    return hashlib.sha256(open(p, 'rb').read()).hexdigest()


def py(f, *a, want=0, name=None):
    return (name or ' '.join((f,) + a), f'{HERE}/{f}', ['python3', f'{HERE}/{f}', *a], want)


RUNS = [
    py('structure.py'),
    py('scaffold.py', '--check'),
    py('curate_pack.py', '--check'),
    py('build_pack.py', '--check'),
    py('gate_quotes.py'),
    py('gate_quotes.py', '--plant', want=1, name='gate_quotes.py NEGATIVE CONTROL'),
    py('gate_source_trace.py'),
    py('gate_source_trace.py', '--plant-figure', want=1, name='gate_source_trace.py NEGATIVE CONTROL figure'),
    py('gate_source_trace.py', '--plant-trace', want=1, name='gate_source_trace.py NEGATIVE CONTROL trace'),
    py('gate_source_trace.py', '--plant-leak', want=1, name='gate_source_trace.py NEGATIVE CONTROL leak'),
    py('gate_source_trace.py', '--plant-sha', want=1, name='gate_source_trace.py NEGATIVE CONTROL sha'),
    py('gate_copy_rule.py'),
    py('gate_copy_rule.py', '--plant', want=1, name='gate_copy_rule.py NEGATIVE CONTROL'),
    py('gate_copy_rule.py', '--plant-bank', want=1, name='gate_copy_rule.py NEGATIVE CONTROL bank'),
    py('gate_vocabulary.py'),
    py('gate_vocabulary.py', '--plant', want=1, name='gate_vocabulary.py NEGATIVE CONTROL'),
    py('gate_vocabulary.py', '--plant-licensed', want=1, name='gate_vocabulary.py NEGATIVE CONTROL licensed'),
    py('gate_licensed_prose.py'),
    py('gate_licensed_prose.py', '--plant', want=1, name='gate_licensed_prose.py NEGATIVE CONTROL'),
    py('gate_licensed_prose.py', '--plant-lesson', want=1, name='gate_licensed_prose.py NEGATIVE CONTROL lesson'),
    py('gate_brief_claims.py'),
    py('gate_brief_claims.py', '--plant', want=1, name='gate_brief_claims.py NEGATIVE CONTROL'),
    py('lengths.py', want=1 if FOUNDATION else 0),
    py('lengths.py', '--selftest'),
    py('gate_banks.py'),
    py('gate_banks.py', '--plant', want=1, name='gate_banks.py NEGATIVE CONTROL'),
    ('dupaxes.py --selftest', f'{KIT}/dupaxes.py', ['python3', f'{KIT}/dupaxes.py', '--selftest'], 0),
    ('lengthtails.py --selftest', f'{KIT}/lengthtails.py', ['python3', f'{KIT}/lengthtails.py', '--selftest'], 0),
    ('bankrepro.py --selftest', f'{KIT}/bankrepro.py', ['python3', f'{KIT}/bankrepro.py', '--selftest'], 0),
    ('crosspair.py --selftest', f'{KIT}/crosspair.py', ['python3', f'{KIT}/crosspair.py', '--selftest'], 0),
    ('bankleak.py --selftest', f'{KIT}/bankleak.py', ['python3', f'{KIT}/bankleak.py', '--selftest'], 0),
    ('dryrun_platform.sh (scratch Postgres, with its negative control)', f'{HERE}/dryrun_platform.sh', ['env', 'NEG=1', 'bash', f'{HERE}/dryrun_platform.sh'], 0),
    ('prove_prior_courses.sh', f'{HERE}/prove_prior_courses.sh', ['bash', f'{HERE}/prove_prior_courses.sh'], 0),
    py('gen_course.py', name='gen_course.py (self checks)'),
]

# THE BANK STAGE adds the kit's audits over the 21 filled banks.
if STAGE in ('banks', 'final'):
    BK = f'{HERE}/banks'
    for pre in ('sc5b', 'sc5i', 'sc5a'):
        RUNS.append((f'lengthtails.py {pre}', f'{KIT}/lengthtails.py', ['python3', f'{KIT}/lengthtails.py', BK, '--prefix', pre], 0))
        RUNS.append((f'dupaxes.py {pre}', f'{KIT}/dupaxes.py', ['python3', f'{KIT}/dupaxes.py', BK, '--prefix', pre, '--threshold', '0.45'], 0))


def last_line(out):
    lines = [l for l in out.strip().split('\n') if l.strip()]
    return lines[-1].strip()[:220] if lines else ''


def pack_block():
    pack = open(os.path.join(HERE, 'PACK.md'), encoding='utf-8').read()
    ps = json.load(open(os.path.join(HERE, 'passages.json'), encoding='utf-8'))['passages']
    srcs = json.load(open(os.path.join(HERE, 'sources', 'SOURCES.json'), encoding='utf-8'))
    return {
        'lines': len(pack.rstrip('\n').split('\n')),
        'sections': len(re.findall(r'(?m)^# SECTION ', pack)),
        'passages': len(ps), 'quoted': sum(1 for p in ps if p['mode'] == 'quote'),
        'sources': len(srcs), 'sha256': sha256(os.path.join(HERE, 'PACK.md')),
    }


def main():
    dry = '--dry' in sys.argv
    results, ok = {}, True
    env = dict(os.environ, SC5_STAGE=STAGE)
    for name, gate, cmd, want in RUNS:
        p = subprocess.run(cmd, capture_output=True, text=True, cwd=HERE, env=env)
        met = p.returncode == want
        key = name.split(' ')[0] if name.split(' ')[0] in STUB_REASON and len(name.split(' ')) == 1 else name
        if FOUNDATION and key in STUB_REASON:
            rx, count = STUB_REASON[key]
            met = met and len(re.findall(rx, p.stdout + p.stderr)) == count
        ok = ok and met
        results[name] = {
            'md5': md5(gate), 'command': ' '.join(os.path.basename(c) if c.startswith(HERE) or c.startswith(KIT) else c for c in cmd),
            'expected': want, 'exit': p.returncode, 'summary': last_line(p.stdout + '\n' + p.stderr),
            **({'stage': 'foundation: expected to refuse on the 78 stubs for the stated reason'} if FOUNDATION and key in STUB_REASON else {}),
        }
        print(f'  {"ok  " if met else "FAIL"} exit {p.returncode} (want {want})  {name}  md5 {results[name]["md5"][:12]}')
        if not met:
            print('     ' + '\n     '.join((p.stdout + p.stderr).strip().split('\n')[-12:]))
    print(f'run_gates: {len(RUNS)} runs at the {STAGE} stage, {"all met their expectation" if ok else "SOME DID NOT"}')
    if dry or not ok:
        return 0 if ok else 1
    w = json.load(open(os.path.join(HERE, 'wave.json'), encoding='utf-8'))
    w['stage'] = STAGE
    w['pack'] = pack_block()
    w['gates'] = results
    json.dump(w, open(os.path.join(HERE, 'wave.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    open(os.path.join(HERE, 'wave.json'), 'a').write('\n')
    print('  wave.json: pack and gates blocks written')
    return 0


sys.exit(main())
