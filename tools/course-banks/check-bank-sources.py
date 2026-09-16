#!/usr/bin/env python3
"""EVERY COMMITTED BANK MUST BE REPRODUCIBLE FROM THE SOURCE COMMITTED BESIDE IT.

A bank ships as a pair. `<prefix><tier>_<bank>.py` builds the questions and
writes `<prefix><tier>_<bank>.json`, and the JSON is what the seed migrations
carry and what a learner is served. Repair a question in the JSON alone and
everything downstream is correct, while the next person to re-cut that bank
reverts the repair and is told nothing. FC2 was in exactly that state when this
check was written: ten of its twenty one sources no longer produced their
committed JSON, twenty four questions, three of them keyed answers.

So this runs every committed source and compares the bytes it writes with the
bytes committed beside it.

WHAT IT REFUSES TO DO, because a check that quietly examines less than it was
asked to is this programme's most repeated defect:

  * a run that finds no pairs at all is a REFUSAL and never a pass;
  * a `.py` with no `.json`, or a `.json` with no `.py`, is a REFUSAL;
  * a source that will not run, or that runs and writes nothing, is a FAILURE
    rather than a skip, because a bank nobody can rebuild is worse than one
    that drifted;
  * it prints every wave, every tier, how many pairs and how many questions it
    compared, so the counts can be read against the tree.

Each source is run in a temporary directory with two rewrites: its `emit` path
points into that directory, and the wave-kit path on its first line points at
`emit_contract.py` beside this file. The second rewrite is what makes the run
identical on a CI runner, which has no wave kit, and on a wave author's machine,
which does.

    python3 tools/course-banks/check-bank-sources.py [<wave> ...]
    python3 tools/course-banks/check-bank-sources.py --selftest

Exit codes: 0 every pair reproduces, 1 at least one drifted or would not run,
2 REFUSED.
"""
import argparse
import glob
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
CONTRACT = os.path.join(HERE, 'emit_contract.py')
EMIT_RE = re.compile(r"""emit\(\s*Q\s*,\s*['"]([^'"]+)['"]""")
KITPATH_RE = re.compile(r"""sys\.path\.insert\(\s*0\s*,\s*['"]([^'"]+)['"]\s*\)""")


class Refused(Exception):
    """The check cannot do its job. Never a pass, always exit 2."""


def run_source(py_path, shim_dir, timeout=180):
    """-> (bytes written, '') or (None, why). The source is executed, never
    parsed, so anything it computes on the way is computed."""
    src = open(py_path, encoding='utf-8').read()
    m = EMIT_RE.search(src)
    if not m:
        return None, 'no emit(Q, "<path>") call, so this source writes no bank'
    if not KITPATH_RE.search(src):
        return None, 'no sys.path.insert(0, "<kit>") line, so the emit contract cannot be bound'
    work = tempfile.mkdtemp(prefix='bankcheck.')
    try:
        out_json = os.path.join(work, os.path.basename(m.group(1)))
        body = src.replace(m.group(1), out_json)
        body = KITPATH_RE.sub(lambda _m: f"sys.path.insert(0, {shim_dir!r})", body, count=1)
        run_py = os.path.join(work, os.path.basename(py_path))
        open(run_py, 'w', encoding='utf-8').write(body)
        proc = subprocess.run([sys.executable, run_py], capture_output=True, text=True,
                              timeout=timeout, cwd=work)
        if not os.path.exists(out_json):
            tail = (proc.stdout + proc.stderr).strip().splitlines()[-3:]
            return None, 'it wrote no bank: ' + ' | '.join(t.strip() for t in tail)
        return open(out_json, 'rb').read(), ''
    finally:
        shutil.rmtree(work, ignore_errors=True)


def pairs_under(root):
    """Every <wave>/<tier>/<bank> pair under a course-banks root, plus the
    orphans on either side, which are refusals rather than notes."""
    found, orphan_py, orphan_json = [], [], []
    for py in sorted(glob.glob(os.path.join(root, '*', '*', '*.py'))):
        if os.path.basename(py).startswith('_'):
            continue
        cj = py[:-3] + '.json'
        (found if os.path.exists(cj) else orphan_py).append(py)
    for cj in sorted(glob.glob(os.path.join(root, '*', '*', '*.json'))):
        if not os.path.exists(cj[:-5] + '.py'):
            orphan_json.append(cj)
    return found, orphan_py, orphan_json


def check(root, waves=None, shim_dir=None, quiet=False):
    shim_dir = shim_dir or make_shim()
    found, orphan_py, orphan_json = pairs_under(root)
    if waves:
        found = [p for p in found if os.path.basename(os.path.dirname(os.path.dirname(p))) in waves]
        if not found:
            raise Refused(f'no bank pairs under {root} for wave(s) {", ".join(waves)}. '
                          f'A check over zero banks is not a pass.')
    if not found:
        raise Refused(f'no <wave>/<tier>/*.py with a .json beside it under {root}. '
                      f'A check over zero banks is not a pass.')
    if orphan_py or orphan_json:
        bits = [f'{os.path.relpath(p, root)} has no .json beside it' for p in orphan_py]
        bits += [f'{os.path.relpath(p, root)} has no .py beside it' for p in orphan_json]
        raise Refused('a committed bank must be a PAIR, and these are not: ' + '; '.join(bits))

    drifted, broken, per_wave = [], [], {}
    for py in found:
        tier = os.path.basename(os.path.dirname(py))
        wave = os.path.basename(os.path.dirname(os.path.dirname(py)))
        name = os.path.basename(py)
        produced, why = run_source(py, shim_dir)
        if produced is None:
            broken.append((f'{wave}/{tier}/{name}', why))
            continue
        committed = open(py[:-3] + '.json', 'rb').read()
        rows = json.loads(committed.decode('utf-8'))
        slot = per_wave.setdefault(wave, {'banks': 0, 'questions': 0, 'tiers': set()})
        slot['banks'] += 1
        slot['questions'] += len(rows)
        slot['tiers'].add(tier)
        if produced == committed:
            continue
        mine = json.loads(produced.decode('utf-8'))
        qs = [i + 1 for i, (a, b) in enumerate(zip(mine, rows)) if a != b]
        if len(mine) != len(rows):
            qs.append(f'{len(mine)} question(s) against {len(rows)} committed')
        if not qs:
            qs.append('the same questions, serialised differently')
        drifted.append((f'{wave}/{tier}/{name}', qs))

    if not quiet:
        for name, qs in drifted:
            print(f'  FAIL {name} does not produce its committed .json: Q{qs}')
            print('        The JSON was edited without its source. THE NEXT RE-EMIT REVERTS '
                  'THAT EDIT, silently. Put the edit into the .py and re-emit.')
        for name, why in broken:
            print(f'  FAIL {name} could not be run at all: {why}')
        for wave in sorted(per_wave):
            s = per_wave[wave]
            print(f'  ok   {wave}: {s["banks"]} bank(s) across {len(s["tiers"])} tier(s), '
                  f'{s["questions"]} question(s) compared byte for byte')
        total_q = sum(s['questions'] for s in per_wave.values())
        print(f'[course-banks] {len(found)} committed pair(s) under {root}: '
              f'{len(found) - len(drifted) - len(broken)} reproduce, {len(drifted)} drifted, '
              f'{len(broken)} could not run, {total_q} question(s) compared')
    return drifted, broken


def make_shim():
    """A directory holding the contract under the name the bank sources import."""
    d = tempfile.mkdtemp(prefix='bankshim.')
    shutil.copy(CONTRACT, os.path.join(d, 'bankkit.py'))
    return d


def selftest():
    """The controls. A corpus copied out of the tree reproduces; the same corpus
    with ONE key repaired in the JSON alone is caught with the question named;
    putting the edit into the source returns it to clean; a source that cannot
    run FAILS; and an empty tree REFUSES."""
    shim = make_shim()
    src_root = HERE
    waves = [w for w in sorted(os.listdir(src_root))
             if os.path.isdir(os.path.join(src_root, w)) and glob.glob(
                 os.path.join(src_root, w, '*', '*.py'))]
    if not waves:
        raise Refused('the selftest found no committed waves to copy, so it would prove nothing')
    d = tempfile.mkdtemp(prefix='bankselftest.')
    root = os.path.join(d, 'course-banks')
    os.makedirs(root)
    wave = waves[0]
    shutil.copytree(os.path.join(src_root, wave), os.path.join(root, wave))
    drifted, broken = check(root, shim_dir=shim, quiet=True)
    assert not drifted and not broken, f'a copy of the committed tree was reported: {drifted}{broken}'

    # THE NEGATIVE CONTROL, and it is the live FC2 case: a key repaired in the
    # JSON and not in the source.
    target = sorted(glob.glob(os.path.join(root, wave, '*', '*.json')))[0]
    pristine = os.path.join(d, 'pristine.json')
    shutil.copy(target, pristine)
    rows = json.load(open(target, encoding='utf-8'))
    rows[2]['options'][rows[2]['answer']] = 'a key repaired in the JSON and not in the source'
    with open(target, 'w', encoding='utf-8') as fh:
        json.dump(rows, fh, indent=1, ensure_ascii=False)
    drifted, _b = check(root, shim_dir=shim, quiet=True)
    assert drifted and drifted[0][1] == [3], \
        f'a JSON edited without its source was not caught: {drifted}'

    # A WHITESPACE-ONLY EDIT must be caught too, because the bytes are what the
    # migrations are cut from.
    rows = json.load(open(pristine, encoding='utf-8'))
    with open(target, 'w', encoding='utf-8') as fh:
        json.dump(rows, fh, indent=4, ensure_ascii=False)
    drifted, _b = check(root, shim_dir=shim, quiet=True)
    assert drifted, 'a re-indented JSON was not caught, so the comparison is not byte for byte'

    # POSITIVE CONTROL: the committed bytes back in place, and it is clean.
    shutil.copy(pristine, target)
    drifted, broken = check(root, shim_dir=shim, quiet=True)
    assert not drifted and not broken, f'the corpus did not return to clean: {drifted}{broken}'

    # A SOURCE THAT CANNOT RUN IS A FAILURE, NOT A SKIP.
    py = target[:-5] + '.py'
    body = open(py, encoding='utf-8').read()
    open(py, 'w', encoding='utf-8').write(body.replace('emit(Q, ', 'raise SystemExit("no")\nemit(Q, '))
    _d, broken = check(root, shim_dir=shim, quiet=True)
    assert broken, 'a source that writes no bank was not reported'
    open(py, 'w', encoding='utf-8').write(body)

    # AN ORPHAN ON EITHER SIDE IS A REFUSAL.
    os.rename(py, py + '.parked')
    try:
        check(root, shim_dir=shim, quiet=True)
    except Refused as exc:
        assert 'has no .py' in str(exc), f'refused for the wrong reason: {exc}'
    else:
        raise AssertionError('a .json with no .py did not refuse')
    os.rename(py + '.parked', py)

    # AND AN EMPTY TREE IS NEVER A PASS.
    empty = tempfile.mkdtemp(prefix='bankempty.')
    try:
        check(empty, shim_dir=shim, quiet=True)
    except Refused:
        pass
    else:
        raise AssertionError('a tree with no bank pairs did not refuse')

    print('[course-banks] selftest OK: a copy of the committed tree reproduces, a key repaired '
          'in the JSON alone is caught with its question named, a re-indented JSON is caught so '
          'the comparison is byte for byte, restoring the bytes returns it to clean, a source '
          'that writes no bank fails rather than skipping, and an orphan half and an empty tree '
          'both refuse')
    return 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('waves', nargs='*', help='limit the run to these wave directories')
    ap.add_argument('--root', default=HERE)
    ap.add_argument('--selftest', action='store_true')
    a = ap.parse_args()
    try:
        if a.selftest:
            return selftest()
        drifted, broken = check(a.root, a.waves or None)
    except Refused as exc:
        print(f'REFUSED: {exc}')
        return 2
    return 1 if (drifted or broken) else 0


if __name__ == '__main__':
    sys.exit(main())
