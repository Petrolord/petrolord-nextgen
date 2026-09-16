#!/usr/bin/env python3
"""FULL literal sweep: EVERY numeric literal in a bank or lesson must appear
in digest.txt.

numsweep skips every literal whose significant figures fall below seven once
TRAILING ZEROS are stripped, which on a digest rendered to six decimals is
most of the round figures in it. On this wave's own probe run numsweep
checked 63 literals and SKIPPED 56, so a green numsweep is roughly half a
sweep. This one has no significant-figure floor at all and matches on FLOAT
VALUE, so 880 resolves against the digest's 880.000000.

Run BOTH. Report BOTH counts. A gate going green and a gate examining your
files are two separate claims.

Usage: sweep_literals.py <wave_dir> <filter>          sweeps banks/
       sweep_literals.py <wave_dir> <filter> --lessons <content_dir>
"""
import json, re, sys, io, os

NUM = re.compile(r'-?\d{1,3}(?:,\d{3})+(?:\.\d+)?|-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?')

def literals(text):
    out = []
    for m in NUM.finditer(text):
        raw = m.group(0)
        # a minus sign only counts as a sign when it is not a hyphen in prose
        s = m.start()
        if raw.startswith('-') and s > 0 and text[s-1] not in ' ([{=,:\n\t':
            raw = raw[1:]
        out.append((m.group(0), float(raw.replace(',', ''))))
    return out

def digest_values(path):
    txt = io.open(path, encoding='utf-8').read()
    vals = set()
    for raw, v in literals(txt):
        vals.add(round(v, 10))
        vals.add(round(abs(v), 10))
    return vals, txt

def lesson_files(root, filt):
    out = []
    for dirpath, _, names in os.walk(root):
        for n in sorted(names):
            if n.endswith('.md') and filt in os.path.join(dirpath, n):
                out.append(os.path.join(dirpath, n))
    return out


def sweep_lessons(wave, filt, content):
    dig, _ = digest_values(os.path.join(wave, 'digest.txt'))
    files = lesson_files(content, filt)
    total, bad = 0, []
    for f in files:
        txt = io.open(f, encoding='utf-8').read()
        n = 0
        for raw, v in literals(txt):
            n += 1
            total += 1
            if round(v, 10) in dig or round(abs(v), 10) in dig:
                continue
            bad.append((os.path.relpath(f, content), 0, raw, txt[:0]))
        print(f'  {os.path.relpath(f, content)}: {n} literals swept')
    print(f'\nLESSON FILES SWEPT: {len(files)}   TOTAL literals: {total}   UNRESOLVED: {len(bad)}')
    for b, _i, raw, _c in bad:
        print(f'   UNRESOLVED {b}: "{raw}"')
    if not files:
        print('   REFUSES: a sweep of zero files is not a pass')
        return 2
    return 1 if bad else 0


def sweep_banks(wave, filt):
    """(exit code, literals swept, unresolved). A sweep of zero banks REFUSES."""
    dig, dtxt = digest_values(os.path.join(wave, 'digest.txt'))
    # DECLARED CONSTANTS ARE NOT UNRESOLVED LITERALS. A course may quote 14.7 or
    # 1440 whether or not the digest prints it, and wave.json says which. This
    # gate had no allowance for them, so on FC1's merged banks it reported 12
    # "unresolved" figures that are all declared: 1440, 5.614583333333333,
    # 459.67, 141.5 and 131.5. A gate that cries wolf on correct committed work
    # is the wrong gate, so they are resolved AS CONSTANTS and counted as such.
    consts = set()
    cfg_path = os.path.join(wave, 'wave.json')
    if os.path.exists(cfg_path):
        for k in (json.load(io.open(cfg_path, encoding='utf-8')).get('constants') or {}):
            consts.add(str(k))
            try:
                consts.add(round(float(k), 10))
            except ValueError:
                pass
    as_const = 0
    bankdir = os.path.join(wave, 'banks')
    if not os.path.isdir(bankdir) or not os.listdir(bankdir):
        print('   REFUSES: no banks to sweep, and a sweep of zero files is not a pass')
        return 2, 0, []
    banks = sorted(f for f in os.listdir(bankdir)
                   if f.endswith('.json') and filt in f)
    total = 0
    bad = []
    for b in banks:
        rows = json.load(io.open(os.path.join(wave, 'banks', b), encoding='utf-8'))
        n = 0
        for i, q in enumerate(rows):
            # THIS WAS `['prompt', 'explanation'] + q['options']`, a list of the two
            # field NAMES as strings, so the words "prompt" and "explanation" were
            # what got swept and neither carries a digit. THE GATE READ OPTIONS ONLY,
            # about 45 percent of the corpus, and reported a clean count over it.
            for field in [q['prompt'], q['explanation']] + q['options']:
                for raw, v in literals(field):
                    n += 1
                    total += 1
                    if round(v, 10) in dig or round(abs(v), 10) in dig:
                        continue
                    if raw in consts or round(v, 10) in consts:
                        as_const += 1
                        continue
                    bad.append((b, i + 1, raw, field[:80]))
        print(f'  {b}: {len(rows)} questions, {n} literals swept')
    print(f'\nBANKS SWEPT: {len(banks)} from {os.path.join(wave, "banks")} matching '
          f'"{filt}"   TOTAL literals swept: {total}   '
          f'resolved as a declared constant: {as_const}   UNRESOLVED: {len(bad)}')
    for b, i, raw, ctx in bad:
        print(f'   UNRESOLVED {b} Q{i}: "{raw}"  in: {ctx}')
    # A FILTER THAT MATCHES NOTHING USED TO PRINT "TOTAL literals swept: 0
    # UNRESOLVED: 0" AND EXIT 0, which reads exactly like a clean run. A sweep
    # of zero files, or of zero literals, is a REFUSAL.
    if not banks:
        print(f'   REFUSES: no bank matched "{filt}", and a sweep of zero files is not a pass')
        return 2, 0, []
    if total == 0:
        print('   REFUSES: the banks matched carried no literals at all, which is not a pass')
        return 2, 0, []
    return (1 if bad else 0), total, bad


def selftest():
    """THE FIELD LIST WAS A LIST OF FIELD NAMES, AND THE WORDS "prompt" AND
    "explanation" CARRY NO DIGITS, so this gate swept OPTIONS ONLY and reported
    a clean count over roughly HALF the corpus. Measured on FC2's merged banks:
    fc2b 505 literals swept where 911 exist, fc2i 608, fc2a 617. Every prompt
    and every explanation in a live course was invisible to it.

    THE CONTROL PLANTS A LITERAL IN A PROMPT AND ONE IN AN EXPLANATION and
    asserts BOTH are named. A control that plants only in an option cannot fail
    on the shipped bug, which is how the bug survived.
    """
    import tempfile
    d = tempfile.mkdtemp()
    os.makedirs(os.path.join(d, 'banks'))
    io.open(os.path.join(d, 'digest.txt'), 'w', encoding='utf-8').write(
        'the line runs 880.000000 ft at 30.000000 psi\n')
    q = {'prompt': 'It runs 880 ft.', 'options': ['30', 'b', 'c', 'd'], 'answer': 0,
         'explanation': 'At 30.000000 psi.'}
    json.dump([q], io.open(os.path.join(d, 'banks', 'zzb_m01.json'), 'w', encoding='utf-8'))
    rc, total, bad = sweep_banks(d, 'zzb')
    assert rc == 0 and not bad, f'a clean bank failed: {bad}'
    assert total == 3, (
        f'a clean bank swept {total} literals where 3 exist (one in the prompt, one in an option, '
        f'one in the explanation), so a whole field was skipped')

    for where, planted in (('prompt', dict(q, prompt='It runs 987654.321 ft.')),
                           ('explanation', dict(q, explanation='At 987654.321 psi.')),
                           ('option', dict(q, options=['987654.321', 'b', 'c', 'd']))):
        json.dump([planted], io.open(os.path.join(d, 'banks', 'zzb_m01.json'), 'w',
                                     encoding='utf-8'))
        rc, total, bad = sweep_banks(d, 'zzb')
        assert rc == 1 and [b[2] for b in bad] == ['987654.321'], (
            f'a literal planted in the {where} was NOT swept: rc={rc} total={total} bad={bad}')
        print(f'   control FIRED in the {where}: {bad[0][0]} Q{bad[0][1]} "{bad[0][2]}" '
              f'over {total} literals swept')

    # and a sweep that matches no bank at all is a REFUSAL, never a clean zero
    rc, total, bad = sweep_banks(d, 'nothing-matches-this')
    assert rc == 2, 'a sweep of zero banks did not refuse'
    print('[sweep_literals] selftest OK: a literal planted in a prompt, in an explanation and in '
          'an option is caught, the clean count covers every field, and a sweep of zero banks '
          'refuses')
    return 0


def main():
    if '--selftest' in sys.argv:
        return selftest()
    if len(sys.argv) < 3:
        print('REFUSED: usage: sweep_literals.py <wave_dir> <filter> [--lessons <content_dir>] | --selftest')
        return 2
    wave = sys.argv[1]
    if '--lessons' in sys.argv:
        return sweep_lessons(wave, sys.argv[2], sys.argv[sys.argv.index('--lessons') + 1])
    rc, total, bad = sweep_banks(wave, sys.argv[2])
    return rc

sys.exit(main())
