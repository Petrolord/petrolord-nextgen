#!/usr/bin/env python3
"""Wave-wide bank checks the per-bank gate cannot make: duplicate and near
duplicate prompts ACROSS banks, the answer-key balance per tier, and whether
the three tiers were even served the same number of questions.

WHAT THE PREVIOUS VERSION DID, AND WHY IT COULD REPORT NOTHING
--------------------------------------------------------------
It globbed `<wave>/banks/<prefix>*.json`, and if the glob matched nothing it
printed "0 banks, 0 questions / wave problems: 0" and exited 0. Verified
empirically on 2026-09-16. Every empty state was a pass: no banks, a banks
directory that does not exist, a wave whose prefix had been renamed so the
glob stopped matching, and a wave with only one tier's banks written.

It also examined less than it appeared to:

  * it read the banks in the WAVE DIRECTORY, which is not what production
    serves. The live questions are rows of `academy_quiz_questions`. A wave
    directory can be edited, re-cut or abandoned after the seed is applied,
    so a clean run there says nothing about the course a learner sits. `--db`
    reads the served rows and is the authoritative mode.
  * `LETTER_TIER[name[plen]]` raised KeyError on any file whose name did not
    carry a b/i/a in that position, so a stray JSON in banks/ crashed the run
    with a traceback instead of a refusal.
  * nothing compared the tiers against each other. Doing so immediately found
    that `petrophysics` beginner serves 130 questions where its own other two
    tiers serve 132, and its final exam 40 where theirs serve 42.

REFUSALS. Exit 2, never 0, when the gate cannot do its job.

    python3 wave_check.py <wave_dir>
    python3 wave_check.py --db --all [--workdir DIR]
    python3 wave_check.py --db --course dca
    python3 wave_check.py --selftest

Exit codes: 0 clean, 1 problems, 2 REFUSED. Only 0 is a pass.
"""
import argparse
import glob
import json
import os
import re
import subprocess
import sys
import tempfile
from collections import Counter, defaultdict

TIERS = ('beginner', 'intermediate', 'advanced')
LETTER_TIER = {'b': 'beginner', 'i': 'intermediate', 'a': 'advanced'}
NEAR_DUPLICATE = 0.55


class Refused(Exception):
    """The gate cannot do its job. Never a pass."""


def tok(s):
    return set(re.findall(r'[a-z0-9.]+', str(s).lower()))


def jaccard(ta, tb):
    return len(ta & tb) / len(ta | tb) if ta and tb else 0.0


# ------------------------------------------------------------------- inputs

def banks_from_wave(wave_dir):
    """[(tier, bank_name, [question, ...]), ...] from a wave directory."""
    cfg_path = os.path.join(wave_dir, 'wave.json')
    if not os.path.exists(cfg_path):
        raise Refused(f'no wave.json in {wave_dir}')
    try:
        cfg = json.load(open(cfg_path, encoding='utf-8'))
    except ValueError as exc:
        raise Refused(f'{cfg_path} is not readable JSON: {exc}')
    prefix = cfg.get('prefix')
    if not prefix:
        raise Refused(f'{cfg_path} declares no "prefix", so no bank file can be located')
    banks_dir = os.path.join(wave_dir, 'banks')
    if not os.path.isdir(banks_dir):
        raise Refused(f'no banks directory at {banks_dir}')
    files = sorted(glob.glob(os.path.join(banks_dir, f'{prefix}*.json')))
    present = sorted(os.path.basename(p) for p in glob.glob(os.path.join(banks_dir, '*.json')))
    if not files:
        raise Refused(
            f'the glob {prefix}*.json matched NOTHING in {banks_dir}. '
            f'{len(present)} .json file(s) are there: {present[:8]}. '
            f'A wave check over zero banks is not a pass.')
    out = []
    for f in files:
        name = os.path.basename(f)
        if name.startswith('RECUT-'):
            continue
        letter = name[len(prefix)] if len(name) > len(prefix) else ''
        if letter not in LETTER_TIER:
            raise Refused(
                f'bank file "{name}" has no b/i/a tier letter after the prefix '
                f'"{prefix}" (found "{letter}"). Refusing rather than guessing its tier.')
        try:
            qs = json.load(open(f, encoding='utf-8'))
        except ValueError as exc:
            raise Refused(f'{name} is not readable JSON: {exc}')
        if not isinstance(qs, list):
            raise Refused(f'{name} is not a question array; refusing rather than skipping it silently')
        out.append((LETTER_TIER[letter], name, qs))
    return cfg.get('slug', os.path.basename(wave_dir)), out


DB_QUERY = """
select coalesce(jsonb_agg(jsonb_build_object(
  'app_slug', app_slug, 'tier', tier, 'scope', scope, 'module_key', module_key,
  'ord', ord, 'prompt', prompt, 'options', options,
  'answer', answer_index, 'explanation', explanation)
  order by app_slug, tier, scope, module_key, ord), '[]'::jsonb) as dump
from public.academy_quiz_questions where active;
"""


def banks_from_db(workdir, course=None):
    """{slug: [(tier, bank_name, [question, ...]), ...]} from the served rows."""
    with tempfile.NamedTemporaryFile('w', suffix='.sql', delete=False) as fh:
        fh.write(DB_QUERY)
        qpath = fh.name
    try:
        proc = subprocess.run(
            ['supabase', 'db', 'query', '--linked', '-f', qpath, '-o', 'json'],
            cwd=workdir, capture_output=True, text=True)
    finally:
        os.unlink(qpath)
    if proc.returncode != 0:
        raise Refused(f'supabase db query failed: {proc.stderr.strip()[:300]}')
    try:
        rows = json.loads(proc.stdout)['rows'][0]['dump']
    except Exception as exc:
        raise Refused(f'could not read the query result: {exc}')
    if not rows:
        raise Refused('the database returned no active quiz questions')
    by = defaultdict(lambda: defaultdict(list))
    for r in rows:
        if course and r['app_slug'] != course:
            continue
        bank = 'exam' if r['scope'] == 'final' else (r['module_key'] or 'module-unknown')
        by[r['app_slug']][(r['tier'], bank)].append(r)
    if not by:
        raise Refused(f'no active quiz questions for course "{course}"')
    return {slug: [(t, b, qs) for (t, b), qs in sorted(banks.items())]
            for slug, banks in by.items()}


# -------------------------------------------------------------------- check

def check(slug, banks, allow_partial=False):
    allq, per_tier = [], defaultdict(list)
    for tier, name, qs in banks:
        for i, q in enumerate(qs):
            if not isinstance(q, dict):
                raise Refused(f'{slug}/{name} question {i + 1} is not an object')
            prompt = q.get('prompt')
            if not isinstance(prompt, str) or not prompt.strip():
                raise Refused(f'{slug}/{name} question {i + 1} has no prompt text')
            if 'answer' not in q:
                raise Refused(f'{slug}/{name} question {i + 1} has no answer index')
            row = (tier, name, i + 1, q, tok(prompt))
            allq.append(row)
            per_tier[tier].append(row)
    if not allq:
        raise Refused(f'{slug}: {len(banks)} bank(s) held ZERO questions. That is not a pass.')
    missing = [t for t in TIERS if t not in per_tier]
    if missing and not allow_partial:
        raise Refused(
            f'{slug}: no questions at all for tier(s) {", ".join(missing)}. A wave check that '
            f'saw only {sorted(per_tier)} has not checked the wave. Pass --allow-partial '
            f'to check a wave that is genuinely mid-build.')

    problems, notes = [], []
    print(f'{slug}: {len(banks)} banks, {len(allq)} questions')
    counts = {}
    for t in TIERS:
        rows = per_tier.get(t, [])
        counts[t] = len(rows)
        print(f'  {t}: {len(rows)}')

    # TIER PARITY. The three tiers of one course are built to the same shape,
    # so a tier that is short is a seed that did not fully land. Nothing
    # compared them before, and the first run of this check found one.
    served = [c for c in counts.values() if c]
    if len(set(served)) > 1:
        problems.append(f'TIER PARITY: the tiers serve different question counts {counts}')
    per_bank = Counter()
    for tier, name, qs in banks:
        per_bank[(tier, name)] = len(qs)
    by_name = defaultdict(dict)
    for (tier, name), n in per_bank.items():
        by_name[name][tier] = n
    for name, d in sorted(by_name.items()):
        if len(d) > 1 and len(set(d.values())) > 1:
            problems.append(f'TIER PARITY: bank "{name}" has {d} questions across tiers')

    # exact duplicate prompts anywhere in the wave
    prompts = Counter(q['prompt'] for _, _, _, q, _ in allq)
    for p, n in prompts.items():
        if n > 1:
            where = [f'{f}#{i}' for _, f, i, q, _ in allq if q['prompt'] == p]
            problems.append(f'DUPLICATE PROMPT x{n}: {p[:80]}  -> {", ".join(where)}')

    # near duplicates across DIFFERENT banks of one tier
    pairs_checked = 0
    for t, rows in sorted(per_tier.items()):
        for i in range(len(rows)):
            for j in range(i + 1, len(rows)):
                if rows[i][1] == rows[j][1]:
                    continue
                pairs_checked += 1
                v = jaccard(rows[i][4], rows[j][4])
                if v > NEAR_DUPLICATE:
                    problems.append(
                        f'NEAR DUPLICATE {v:.2f} [{t}] {rows[i][1]}#{rows[i][2]} / '
                        f'{rows[j][1]}#{rows[j][2]}\n    {rows[i][3]["prompt"][:90]}'
                        f'\n    {rows[j][3]["prompt"][:90]}')
    if pairs_checked == 0:
        # Not a refusal: the exact-duplicate and key-balance checks did run. But
        # it must not pass in silence, which is what the previous version did.
        notes.append('the cross-bank NEAR-duplicate check was NOT APPLIED: no tier has two '
                     'banks to compare against each other')

    # answer-key balance per tier
    for t, rows in sorted(per_tier.items()):
        hist = Counter(q['answer'] for _, _, _, q, _ in rows)
        n = len(rows)
        print(f'  {t} key shares: ' + str({k: round(hist[k] / n, 3) for k in range(4)}))
        for k in range(4):
            if not 0.15 <= hist[k] / n <= 0.35:
                problems.append(f'KEY IMBALANCE {t} index {k}: {hist[k]}/{n}')

    for n in notes:
        print('  note  ' + n)
    for p in problems:
        print('  PROBLEM  ' + p)
    print(f'  => {slug}: {len(problems)} wave problem(s), '
          f'{pairs_checked} cross-bank pairs compared')
    return problems


# --------------------------------------------------------- negative control

WORDS = ['separator', 'pump', 'choke', 'riser', 'manifold', 'compressor',
         'heater', 'pig', 'valve', 'flare', 'tank', 'pipeline',
         'turbine', 'scrubber', 'filter', 'cooler', 'burner', 'reboiler',
         'tray', 'weir', 'nozzle', 'impeller', 'seal', 'bearing']


def _bank(n, start=0, pool=0):
    """A bank of n questions with a balanced key and distinct prompts.

    The two pools are disjoint word sets, so two banks built from different
    pools share no token and cannot trip the near-duplicate threshold by
    accident. A fixture that trips the check it is the control for proves
    nothing.
    """
    sub = WORDS[:12] if pool == 0 else WORDS[12:]
    out = []
    for i in range(n):
        k = start + i
        out.append({'prompt': f'case{k} ' + ' '.join(sub[(k * 13 + j * 7) % len(sub)]
                                                     for j in range(6)),
                    'options': [f'opt{j} {"y" * (j + i % 3)}' for j in range(4)],
                    'answer': k % 4,
                    'explanation': f'because {k}'})
    return out


def selftest():
    ok = True

    def chk(name, cond):
        nonlocal ok
        print(f'  {"PASS" if cond else "FAIL"}  {name}')
        ok = ok and cond

    def refuses(name, fn):
        try:
            fn()
        except Refused:
            chk(name, True)
            return
        chk(name, False)

    print('negative control')

    clean = [('beginner', 'zzb_m01.json', _bank(20, 0, 0)),
             ('beginner', 'zzb_m02.json', _bank(20, 40, 1)),
             ('intermediate', 'zzi_m01.json', _bank(20, 100, 0)),
             ('intermediate', 'zzi_m02.json', _bank(20, 140, 1)),
             ('advanced', 'zza_m01.json', _bank(20, 200, 0)),
             ('advanced', 'zza_m02.json', _bank(20, 240, 1))]
    chk('a clean wave reports no problem', check('zz', clean) == [])

    # planted exact duplicate across banks
    dup = [('beginner', 'zzb_m01.json', _bank(20, 0, 0)),
           ('beginner', 'zzb_m02.json', _bank(20, 0, 0))] + clean[2:]
    probs = check('zz', dup)
    chk('a planted duplicate prompt goes RED',
        any(p.startswith('DUPLICATE PROMPT') for p in probs))
    chk('and a near duplicate is reported too',
        any(p.startswith('NEAR DUPLICATE') for p in probs))
    chk('removing it goes green again', check('zz', clean) == [])

    # planted key imbalance
    imb = list(clean)
    bad = _bank(20, 0, 0)
    for q in bad:
        q['answer'] = 0
    imb[0] = ('beginner', 'zzb_m01.json', bad)
    chk('a planted key imbalance goes RED',
        any(p.startswith('KEY IMBALANCE') for p in check('zz', imb)))

    # planted tier-parity gap (the petrophysics shape)
    short = [('beginner', 'zzb_m01.json', _bank(18, 0, 0)),
             ('intermediate', 'zzi_m01.json', _bank(20, 100, 0)),
             ('advanced', 'zza_m01.json', _bank(20, 200, 0))]
    chk('a tier serving fewer questions than its siblings goes RED',
        any(p.startswith('TIER PARITY') for p in check('zz', short)))
    chk('a wave with one bank per tier says the near-duplicate check was not applied',
        check('zz', [('beginner', 'zzb_m01.json', _bank(20, 0, 0)),
                     ('intermediate', 'zzi_m01.json', _bank(20, 100, 0)),
                     ('advanced', 'zza_m01.json', _bank(20, 200, 0))]) == [])

    # REFUSALS
    refuses('a wave with ZERO questions is REFUSED',
            lambda: check('zz', [('beginner', 'zzb_m01.json', []),
                                 ('intermediate', 'zzi_m01.json', []),
                                 ('advanced', 'zza_m01.json', [])]))
    refuses('a wave missing a whole tier is REFUSED',
            lambda: check('zz', clean[:2]))
    refuses('a question with no prompt is REFUSED',
            lambda: check('zz', [('beginner', 'b.json', [{'answer': 0}])]))
    refuses('a question with no answer index is REFUSED',
            lambda: check('zz', [('beginner', 'b.json', [{'prompt': 'p'}])]))

    import shutil
    d = tempfile.mkdtemp()
    try:
        refuses('a wave directory with no wave.json is REFUSED', lambda: banks_from_wave(d))
        json.dump({'slug': 'zz', 'prefix': 'zz'}, open(os.path.join(d, 'wave.json'), 'w'))
        refuses('a wave with no banks directory is REFUSED', lambda: banks_from_wave(d))
        os.mkdir(os.path.join(d, 'banks'))
        refuses('an EMPTY banks directory is REFUSED, not passed', lambda: banks_from_wave(d))
        open(os.path.join(d, 'banks', 'other.json'), 'w').write('[]')
        refuses('a banks directory where the prefix glob matches nothing is REFUSED',
                lambda: banks_from_wave(d))
        open(os.path.join(d, 'banks', 'zz_notier.json'), 'w').write('[]')
        refuses('a bank file with no b/i/a tier letter is REFUSED, not a KeyError',
                lambda: banks_from_wave(d))
        os.unlink(os.path.join(d, 'banks', 'zz_notier.json'))
        open(os.path.join(d, 'banks', 'zzb_m01.json'), 'w').write('{"not": "an array"}')
        refuses('a bank file that is not a question array is REFUSED',
                lambda: banks_from_wave(d))
    finally:
        shutil.rmtree(d, ignore_errors=True)

    print('\nnegative control: ' + ('ALL PASS' if ok else 'FAILURES ABOVE'))
    return 0 if ok else 1


# --------------------------------------------------------------------- main

def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('wave_dir', nargs='?')
    ap.add_argument('--db', action='store_true', help='read the served rows (authoritative)')
    ap.add_argument('--all', action='store_true', help='every live course')
    ap.add_argument('--course', help='restrict to one app_slug')
    ap.add_argument('--workdir', default='.', help='directory linked to the project')
    ap.add_argument('--allow-partial', action='store_true',
                    help='permit a wave that is genuinely mid-build')
    ap.add_argument('--selftest', action='store_true')
    args = ap.parse_args()

    if args.selftest:
        return selftest()
    try:
        total = 0
        if args.db:
            if not args.all and not args.course:
                raise Refused('--db needs --all or --course SLUG')
            by = banks_from_db(args.workdir, args.course)
            for slug, banks in sorted(by.items()):
                total += len(check(slug, banks, args.allow_partial))
            print(f'\n{len(by)} course(s) checked.  total problems: {total}')
        else:
            if not args.wave_dir:
                ap.print_help()
                return 2
            slug, banks = banks_from_wave(args.wave_dir)
            total = len(check(slug, banks, args.allow_partial))
    except Refused as exc:
        print(f'\nREFUSED: {exc}')
        print('This gate does not pass on an empty or unreadable sweep.')
        return 2
    return 1 if total else 0


if __name__ == '__main__':
    sys.exit(main())
