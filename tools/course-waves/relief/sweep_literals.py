#!/usr/bin/env python3
"""FULL literal sweep for FC5 Relief & Flare Systems: EVERY numeric literal in
a bank or a lesson must appear in digest.txt, or be a constant wave.json
declares.

WHY THIS EXISTS BESIDE numsweep. numsweep skips every literal whose significant
figures fall below seven once TRAILING ZEROS are stripped, which on a digest
rendered to six and twelve decimals is most of the round figures in it. On FC4's
own probe run numsweep checked 63 literals and SKIPPED 56, so a green numsweep
is roughly half a sweep. This one has no significant-figure floor at all and
matches on FLOAT VALUE, so 880 resolves against the digest's 880.000000 and
1500 resolves against the digest's bisected 1500.000000000007.

FC5 HAS NO BANKS AND NO LESSONS YET, so this file carries no probe figure of
its own. It will carry one the day the first bank lands, measured rather than
copied from FC4.

Run BOTH. Report BOTH counts. A gate going green and a gate examining your
files are two separate claims.

WHAT IT READS IN EVERY QUESTION: the PROMPT, the EXPLANATION and every OPTION.
The version this was adapted from swept OPTIONS ONLY, about 45 percent of the
corpus, and reported a clean count over it. See `sweep_banks` and `selftest`.

Usage: sweep_literals.py [wave_dir] [filter]                 sweeps banks/
       sweep_literals.py [wave_dir] [filter] --lessons DIR    sweeps lessons
       sweep_literals.py --selftest
       FC5_WAVE overrides the default wave directory.
"""
import json, re, sys, io, os

WAVE_DEFAULT = os.environ.get('FC5_WAVE', '/root/fc-wip-relief')
FILTER_DEFAULT = 'fc5'

NUM = re.compile(r'-?\d{1,3}(?:,\d{3})+(?:\.\d+)?|-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?')

# THE FIELDS OF A QUESTION THIS GATE READS. Named here so the list is one thing
# in one place and a bank shape it cannot read is a REFUSAL rather than a field
# quietly skipped.
QUESTION_TEXT_FIELDS = ('prompt', 'explanation')


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
    if not os.path.exists(path):
        return None, ''
    txt = io.open(path, encoding='utf-8').read()
    vals = set()
    for raw, v in literals(txt):
        vals.add(round(v, 10))
        vals.add(round(abs(v), 10))
    return vals, txt


def declared_constants(wave):
    """DECLARED CONSTANTS ARE NOT UNRESOLVED LITERALS. A course may quote 14.7
    or 1500 whether or not the digest prints it, and wave.json says which.

    FC5 ADAPTATION. FC4's constants keys were single numbers, so the key itself
    was the constant. FC5 declares COMPOSITE keys: "0.1906 / 0.2292 / 1000 /
    1061" for the four Napier coefficients, "1.58 / 4.73 / 6.31 / 9.46" for the
    allowable intensities, "24 / 3 / 0.34" for the drag terms. Reading the key
    as one number would have left every one of those figures unresolved, so
    EVERY number in a key is a declared constant and the count of them is
    printed.
    """
    consts = set()
    keys = 0
    cfg_path = os.path.join(wave, 'wave.json')
    if os.path.exists(cfg_path):
        block = json.load(io.open(cfg_path, encoding='utf-8')).get('constants') or {}
        for k in block:
            if str(k).startswith('$'):
                continue
            keys += 1
            consts.add(str(k))
            for raw, v in literals(str(k)):
                consts.add(raw)
                consts.add(round(v, 10))
    return consts, keys


def lesson_files(root, filt):
    out = []
    for dirpath, _, names in os.walk(root):
        for n in sorted(names):
            if n.endswith('.md') and filt in os.path.join(dirpath, n):
                out.append(os.path.join(dirpath, n))
    return out


def sweep_lessons(wave, filt, content):
    dig, _ = digest_values(os.path.join(wave, 'digest.txt'))
    if dig is None:
        print(f'   REFUSES: no digest.txt in {wave}, so there is nothing to resolve literals against')
        return 2
    consts, ckeys = declared_constants(wave)
    print(f'  digest: {os.path.join(wave, "digest.txt")}, {len(dig)} distinct values; '
          f'{ckeys} declared constant keys in wave.json')
    files = lesson_files(content, filt)
    total, as_const, bad = 0, 0, []
    for f in files:
        txt = io.open(f, encoding='utf-8').read()
        n = 0
        for raw, v in literals(txt):
            n += 1
            total += 1
            if round(v, 10) in dig or round(abs(v), 10) in dig:
                continue
            if raw in consts or round(v, 10) in consts:
                as_const += 1
                continue
            bad.append((os.path.relpath(f, content), 0, raw, txt[:0]))
        print(f'  {os.path.relpath(f, content)}: {n} literals swept')
    print(f'\nLESSON FILES SWEPT: {len(files)} from {content} matching "{filt}"   '
          f'TOTAL literals: {total}   resolved as a declared constant: {as_const}   '
          f'UNRESOLVED: {len(bad)}')
    for b, _i, raw, _c in bad:
        print(f'   UNRESOLVED {b}: "{raw}"')
    if not files:
        print(f'   REFUSES: no .md lesson under {content} matched "{filt}", and a sweep of zero '
              'files is not a pass')
        return 2
    if total == 0:
        print('   REFUSES: the lessons matched carried no literals at all, which is not a pass')
        return 2
    return 1 if bad else 0


def sweep_banks(wave, filt):
    """(exit code, literals swept, unresolved). A sweep of zero banks REFUSES."""
    dig, dtxt = digest_values(os.path.join(wave, 'digest.txt'))
    if dig is None:
        print(f'   REFUSES: no digest.txt in {wave}, so there is nothing to resolve literals against')
        return 2, 0, []
    consts, ckeys = declared_constants(wave)
    as_const = 0
    bankdir = os.path.join(wave, 'banks')
    print(f'  digest: {os.path.join(wave, "digest.txt")}, {len(dig)} distinct values; '
          f'{ckeys} declared constant keys in wave.json; reading banks from {bankdir}')
    if not os.path.isdir(bankdir) or not os.listdir(bankdir):
        print(f'   REFUSES: no banks to sweep under {bankdir}, and a sweep of zero files is not '
              'a pass. FC5 has no banks yet, so this is the expected answer today and a green '
              'exit here would be the defect')
        return 2, 0, []
    banks = sorted(f for f in os.listdir(bankdir)
                   if f.endswith('.json') and filt in f)
    total = 0
    fields_read = 0
    bad = []
    for b in banks:
        rows = json.load(io.open(os.path.join(wave, 'banks', b), encoding='utf-8'))
        n = 0
        for i, q in enumerate(rows):
            # THIS WAS `['prompt', 'explanation'] + q['options']`, a list of the two
            # field NAMES as strings, so the words "prompt" and "explanation" were
            # what got swept and neither carries a digit. THE GATE READ OPTIONS ONLY,
            # about 45 percent of the corpus, and reported a clean count over it.
            #
            # A BANK SHAPE THIS GATE CANNOT READ IS A REFUSAL. A question with no
            # `explanation` key used to raise KeyError halfway through a sweep whose
            # earlier counts had already printed, so the run looked partly done.
            missing = [f for f in QUESTION_TEXT_FIELDS if not isinstance(q.get(f), str)]
            if missing or not isinstance(q.get('options'), list):
                print(f'   REFUSES: {b} Q{i + 1} carries no readable '
                      f'{", ".join(missing) or "options"}, so this gate cannot claim to have swept '
                      'it. Fix the bank shape rather than sweeping the fields that happen to parse')
                return 2, 0, []
            fields = [q[f] for f in QUESTION_TEXT_FIELDS] + [str(o) for o in q['options']]
            fields_read += len(fields)
            for field in fields:
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
          f'"{filt}"   FIELDS read: {fields_read} '
          f'({" + ".join(QUESTION_TEXT_FIELDS)} + every option)   '
          f'TOTAL literals swept: {total}   '
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

    FC5 ADDS THREE CONTROLS: a composite constants key such as
    "0.1906 / 0.2292 / 1000 / 1061" must resolve each of its figures, a bank
    whose question has no explanation must REFUSE rather than crash part way
    through, and an empty banks directory must refuse.
    """
    import tempfile
    d = tempfile.mkdtemp()
    os.makedirs(os.path.join(d, 'banks'))
    io.open(os.path.join(d, 'digest.txt'), 'w', encoding='utf-8').write(
        'the line runs 880.000000 ft at 30.000000 psi\n')
    json.dump({'constants': {'0.1906 / 0.2292 / 1000 / 1061': 'the Napier fit, DECLARED'}},
              io.open(os.path.join(d, 'wave.json'), 'w', encoding='utf-8'))
    q = {'prompt': 'It runs 880 ft.', 'options': ['30', 'b', 'c', 'd'], 'answer': 0,
         'explanation': 'At 30.000000 psi.'}
    bank = os.path.join(d, 'banks', 'zzb_m01.json')
    json.dump([q], io.open(bank, 'w', encoding='utf-8'))
    rc, total, bad = sweep_banks(d, 'zzb')
    assert rc == 0 and not bad, f'a clean bank failed: {bad}'
    assert total == 3, (
        f'a clean bank swept {total} literals where 3 exist (one in the prompt, one in an option, '
        f'one in the explanation), so a whole field was skipped')

    for where, planted in (('prompt', dict(q, prompt='It runs 987654.321 ft.')),
                           ('explanation', dict(q, explanation='At 987654.321 psi.')),
                           ('option', dict(q, options=['987654.321', 'b', 'c', 'd']))):
        json.dump([planted], io.open(bank, 'w', encoding='utf-8'))
        rc, total, bad = sweep_banks(d, 'zzb')
        assert rc == 1 and [b[2] for b in bad] == ['987654.321'], (
            f'a literal planted in the {where} was NOT swept: rc={rc} total={total} bad={bad}')
        print(f'   control FIRED in the {where}: {bad[0][0]} Q{bad[0][1]} "{bad[0][2]}" '
              f'over {total} literals swept')

    # a figure inside a COMPOSITE constants key resolves AS A CONSTANT, in the
    # prompt and in the explanation as well as in an option
    composite = dict(q, prompt='The numerator slope is 0.1906.',
                     explanation='The denominator intercept is 1061.',
                     options=['0.2292', 'b', 'c', 'd'])
    json.dump([composite], io.open(bank, 'w', encoding='utf-8'))
    rc, total, bad = sweep_banks(d, 'zzb')
    assert rc == 0 and not bad, f'a composite declared constant was reported unresolved: {bad}'
    print('   control FIRED on a composite constants key: 0.1906, 1061 and 0.2292 all resolved '
          'as declared constants out of one key')

    # a bank this gate cannot read is a REFUSAL, never a partial sweep
    json.dump([{'prompt': 'no explanation here', 'options': ['1', 'b', 'c', 'd']}],
              io.open(bank, 'w', encoding='utf-8'))
    rc, total, bad = sweep_banks(d, 'zzb')
    assert rc == 2, f'a question with no explanation did not refuse: rc={rc}'
    print('   control FIRED on an unreadable bank shape: a question with no explanation REFUSES')

    # and a sweep that matches no bank at all is a REFUSAL, never a clean zero
    json.dump([q], io.open(bank, 'w', encoding='utf-8'))
    rc, total, bad = sweep_banks(d, 'nothing-matches-this')
    assert rc == 2, 'a sweep of zero banks did not refuse'
    os.remove(bank)
    rc, total, bad = sweep_banks(d, 'zzb')
    assert rc == 2, 'a sweep of an EMPTY banks directory did not refuse'
    print('   control FIRED on an empty sweep: no bank matched and an empty banks directory both '
          'REFUSE with exit 2')

    # a digest that is not there is a refusal too, because a sweep with nothing
    # to resolve against cannot report a clean pass
    os.remove(os.path.join(d, 'digest.txt'))
    rc, total, bad = sweep_banks(d, 'zzb')
    assert rc == 2, 'a sweep with no digest to resolve against did not refuse'
    print('   control FIRED on a missing digest: exit 2')

    print('[sweep_literals] selftest OK: a literal planted in a prompt, in an explanation and in '
          'an option is caught, the clean count covers every field, a composite constants key '
          'resolves every figure in it, an unreadable bank refuses, and a sweep of zero banks '
          'refuses')
    return 0


def main():
    if '--selftest' in sys.argv:
        return selftest()
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    if '--lessons' in sys.argv:
        content = sys.argv[sys.argv.index('--lessons') + 1] if len(sys.argv) > sys.argv.index('--lessons') + 1 else None
        if not content:
            print('REFUSED: --lessons needs a directory. Refusing rather than running as if it had one.')
            return 2
        args = [a for a in args if a != content]
        wave = args[0] if args else WAVE_DEFAULT
        filt = args[1] if len(args) > 1 else FILTER_DEFAULT
        print(f'sweep_literals: wave {wave}, filter "{filt}", lessons {content}')
        return sweep_lessons(wave, filt, content)
    wave = args[0] if args else WAVE_DEFAULT
    filt = args[1] if len(args) > 1 else FILTER_DEFAULT
    print(f'sweep_literals: wave {wave}, filter "{filt}"')
    rc, total, bad = sweep_banks(wave, filt)
    return rc


sys.exit(main())
