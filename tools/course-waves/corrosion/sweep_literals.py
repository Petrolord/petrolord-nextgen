#!/usr/bin/env python3
"""GATE: every numeric literal in an FC9 bank question RESOLVES against the
digest, the answer key, the declared constants or the wave's stated inputs.

WRITTEN FRESH FOR THIS WAVE, AND NOT COPIED FROM A SIBLING WAVE DIRECTORY.
The original per-wave copy of this gate iterated

    for field in ['prompt', 'explanation'] + q['options']:

which is a list of the two field NAMES AS STRINGS followed by the option texts,
so the words "prompt" and "explanation" were what got swept and neither carries
a digit. Measured on a live merged course: 505 literals swept where 911 exist,
299 where 608, 283 where 617. ROUGHLY 45 PERCENT OF THE CORPUS, EVERY PROMPT AND
EVERY EXPLANATION IN A LIVE COURSE, WAS NEVER EXAMINED. This file sweeps all
three, it says how many of each, and its --selftest plants a literal in a
PROMPT, in an EXPLANATION and in an OPTION and requires all three to be found.

WHAT RESOLVES A LITERAL:
  1. the digest, at any of the precisions the digest prints;
  2. the wave's declared constants, from wave.json's constants block;
  3. a stated input of the bank's own tier, which a question is allowed to
     restate;
  4. a small integer or an ordinal, which carries no engine claim.

WHAT DOES NOT RESOLVE A LITERAL, and this is the point:
  * a graded capstone answer. That is a LEAK and it is reported separately and
    fatally, whatever else the literal might have matched.

REFUSALS. No banks, a filter matching no bank, or a run that swept zero literals
is exit 2 and never 0. A gate that reports a clean zero over a corpus it could
not read has checked nothing.

    python3 sweep_literals.py [--banks DIR] [--tier TIER]
    python3 sweep_literals.py --selftest        THE NEGATIVE CONTROL
"""
import io, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
BANKS = os.environ.get('FC9_BANKS', os.path.join(HERE, 'banks'))
TIER = None
args = sys.argv[1:]
if '--banks' in args:
    BANKS = args[args.index('--banks') + 1]
if '--tier' in args:
    TIER = args[args.index('--tier') + 1]
SELFTEST = '--selftest' in args
for a in args:
    if a.startswith('--') and a not in ('--banks', '--tier', '--selftest'):
        print(f'  GATE REFUSES: unknown option {a}. An option whose argument is discarded is how a '
              'sibling gate swept somebody else\'s corpus and reported it as this one.')
        sys.exit(2)

# A NUMERIC LITERAL, AND THE ONE THING THIS REGEX HAD WRONG.
#
# The obvious form, r'(?<![\w.])-?\d+(?:\.\d+)?(?![\w.])', REJECTS EVERY NUMBER AT
# THE END OF A SENTENCE: a trailing full stop satisfies the [\w.] lookahead, so
# "a factor of 316.227766." matched nothing at all. A sibling gate in this wave
# found that on its own first real run, by reporting a figure as absent from the
# digest that the digest plainly printed. A sentence-final number is the commonest
# shape a writer produces, so the gap was not a corner case. The trailing guard is
# therefore TWO negatives: not a word character, and not a period followed by a
# digit.
NUM = re.compile(r'(?<![\w.])-?\d+(?:\.\d+)?(?!\w)(?!\.\d)')


def load(name, what):
    p = os.path.join(HERE, name)
    if not os.path.exists(p):
        print(f'  GATE REFUSES: no {what} at {p}')
        sys.exit(2)
    return io.open(p, encoding='utf-8').read()


DIGEST = load('digest.txt', 'digest')
FIELDS = json.loads(load('fields.json', 'answer key'))
WAVE = json.loads(load('wave.json', 'wave manifest'))

# Every rendering of every number the digest prints, at the digest's own
# precisions plus the trimmed form, so a question quoting a digest figure at a
# shorter precision still resolves.
def renderings(s):
    out = {s}
    try:
        v = float(s)
    except ValueError:
        return out
    for dp in (0, 1, 2, 3, 4, 6, 12):
        out.add(f'{v:.{dp}f}')
        out.add(f'{v:.{dp}f}'.rstrip('0').rstrip('.'))
    for sig in (3, 4, 6, 9, 12):
        out.add(f'{v:.{sig}g}')
    return {x for x in out if x}


DIGEST_OK = set()
for m in NUM.finditer(DIGEST):
    DIGEST_OK |= renderings(m.group(0))

CONSTANTS_OK = set()
for k in WAVE.get('constants', {}):
    for m in NUM.finditer(k):
        CONSTANTS_OK |= renderings(m.group(0))

SMALL = {str(i) for i in range(0, 31)} | {f'{i}.0' for i in range(0, 31)}

# THE LEAK SET. Every rendering of every graded answer, which no bank question may
# carry at all. Four shapes, because a nine-digit-only matcher provably misses the
# full double.
LEAKS = {}
for tier, key, value, tol in FIELDS:
    shapes = {repr(value), f'{value:.12g}', f'{value:.9g}', f'{value:.6f}', f'{value:.4f}'}
    for s in list(shapes):
        if '.' in s:
            shapes.add(s.rstrip('0').rstrip('.'))
    for s in shapes:
        if 'e' in s or '.' not in s or len(s) < 6:
            continue
        LEAKS.setdefault(s, []).append((tier, key))


def sweep_question(q, where, tier):
    """Sweep the PROMPT, the EXPLANATION and EVERY OPTION. Three field kinds, and
    the counts are returned separately so a run that missed one is visible."""
    fields = [('prompt', q.get('prompt', '')), ('explanation', q.get('explanation', ''))]
    fields += [(f'option{j}', o) for j, o in enumerate(q.get('options', []))]
    per_kind = {'prompt': 0, 'explanation': 0, 'option': 0}
    unresolved, leaks = [], []
    for field, text in fields:
        kind = 'option' if field.startswith('option') else field
        for m in NUM.finditer(str(text)):
            lit = m.group(0)
            per_kind[kind] += 1
            for leak, owners in LEAKS.items():
                if leak in str(text):
                    leaks.append(f'{where} {field}: carries the graded answer {leak} '
                                 f'({", ".join(k for _t, k in owners)})')
            if lit in SMALL or lit in DIGEST_OK or lit in CONSTANTS_OK:
                continue
            unresolved.append(f'{where} {field}: {lit}')
    return per_kind, unresolved, leaks


def selftest():
    """THE NEGATIVE CONTROL. A literal planted in a PROMPT, in an EXPLANATION and
    in an OPTION must each be found. The sibling gate this replaces would have
    found none of the three, because it swept the field NAMES."""
    planted = '987654.321987'
    cases = [
        ('prompt', {'prompt': f'What is {planted} here', 'explanation': 'nothing', 'options': ['a', 'b', 'c', 'd']}),
        ('explanation', {'prompt': 'nothing', 'explanation': f'Because it is {planted}', 'options': ['a', 'b', 'c', 'd']}),
        ('option', {'prompt': 'nothing', 'explanation': 'nothing', 'options': ['a', f'{planted}', 'c', 'd']}),
    ]
    ok = []
    for kind, q in cases:
        per_kind, unresolved, _ = sweep_question(q, 'selftest', 'beginner')
        found = [u for u in unresolved if planted in u]
        ok.append((kind, bool(found), per_kind))
    # And a graded answer planted in each of the three must be reported as a LEAK.
    leak_value = FIELDS[0][2]
    leak_text = repr(leak_value)
    leaked = []
    for kind, q in [('prompt', {'prompt': leak_text, 'explanation': '', 'options': ['a', 'b', 'c', 'd']}),
                    ('explanation', {'prompt': '', 'explanation': leak_text, 'options': ['a', 'b', 'c', 'd']}),
                    ('option', {'prompt': '', 'explanation': '', 'options': [leak_text, 'b', 'c', 'd']})]:
        _pk, _un, lk = sweep_question(q, 'selftest', 'beginner')
        leaked.append((kind, bool(lk)))
    print(f'  SELFTEST, the unresolved literal {planted} planted in each field kind:')
    for kind, found, per_kind in ok:
        print(f'    in a {kind:12s} found: {found}   literals seen by kind: {per_kind}')
    print(f'  SELFTEST, the graded answer {leak_text} planted in each field kind:')
    for kind, found in leaked:
        print(f'    in a {kind:12s} reported as a leak: {found}')
    bad = [k for k, f, _ in ok if not f] + [k for k, f in leaked if not f]
    if bad:
        print(f'  SELFTEST FAILED: not found in {bad}. THIS IS THE DEFECT THE SIBLING GATE HAD: it '
              'swept the field NAMES rather than the field TEXTS, so roughly forty five percent of a '
              'live corpus was never examined.')
        return 1
    print('  SELFTEST PASSED: all three field kinds are swept for unresolved literals and for graded '
          'answer leaks, six plants in all.')
    return 0


def main():
    if SELFTEST:
        return selftest()
    if not os.path.isdir(BANKS):
        print(f'  GATE REFUSES: no bank directory at {BANKS}. This gate runs once the banks are '
              'written; it will not report a clean sweep of nothing.')
        return 2
    files, total, per_kind = [], 0, {'prompt': 0, 'explanation': 0, 'option': 0}
    unresolved, leaks = [], []
    for root, _dirs, names in os.walk(BANKS):
        for n in sorted(names):
            if not n.endswith('.json'):
                continue
            if TIER and TIER not in n:
                continue
            p = os.path.join(root, n)
            files.append(p)
            data = json.load(io.open(p, encoding='utf-8'))
            qs = data.get('questions', data if isinstance(data, list) else [])
            for i, q in enumerate(qs, 1):
                pk, un, lk = sweep_question(q, f'{n} Q{i}', TIER or '')
                for k, v in pk.items():
                    per_kind[k] += v
                total += sum(pk.values())
                unresolved += un
                leaks += lk
    print(f'  bank directory swept: {BANKS}')
    for p in files:
        print(f'   read {p}')
    print(f'  bank files: {len(files)}   literals swept: {total}')
    print(f'  literals by field kind: prompts {per_kind["prompt"]}, explanations '
          f'{per_kind["explanation"]}, options {per_kind["option"]}')
    print(f'  resolving sets: {len(DIGEST_OK)} digest renderings, {len(CONSTANTS_OK)} declared '
          f'constant renderings, {len(SMALL)} small integers')
    print(f'  UNRESOLVED: {len(unresolved)}')
    for u in unresolved[:40]:
        print(f'   {u}')
    print(f'  GRADED ANSWER LEAKS: {len(leaks)}')
    for l in leaks:
        print(f'   {l}')
    if TIER and not files:
        print(f'  GATE REFUSES: --tier {TIER} matched no bank file. A filter matching nothing is not '
              'a clean sweep.')
        return 2
    if not files or total == 0:
        print('  GATE REFUSES: it swept zero literals, so its question was never asked.')
        return 2
    return 1 if (unresolved or leaks) else 0


sys.exit(main())
