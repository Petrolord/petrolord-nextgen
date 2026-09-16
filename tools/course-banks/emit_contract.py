"""THE BANK SERIALISATION CONTRACT, and deliberately nothing else.

A committed bank is a PAIR: a `.py` that calls `emit()`, and the `.json` it
writes, which is what the seed migrations carry and what a learner is served.
When a reviewer repairs a question by editing the JSON and leaving the source
alone, everything downstream is correct and THE NEXT RE-EMIT REVERTS THE REPAIR
IN SILENCE. FC2 shipped in that state: ten of its twenty one bank sources no
longer produced their committed JSON, twenty four questions in all, three of
them keyed answers, and nothing in this repository said so.

`check-bank-sources.py` runs every committed source against this module and
compares the bytes it writes with the bytes committed beside it.

This module is the two steps that decide those bytes and no more: the option
assembly and the `json.dump`, as `bankkit.assemble` and `bankkit.emit` in the
wave kit perform them, plus the `expect_n` count gate, which refuses a bank
whose size is whatever it happens to be. The kit's answer-shape gates are NOT
here, because the question this guard asks is what a source WRITES rather than
whether the bank is well formed. Those gates run where a bank is cut. If this
contract and the kit's ever diverge, a re-cut bank stops matching its committed
JSON and this guard says so by name on the next pull request.
"""
import json


def assemble(Q):
    """Each question is (target, prompt, correct, [three distractors], why).
    The key is INSERTED at its target index, so the committed option order is
    a function of the source and not of a shuffle."""
    out = []
    for i, row in enumerate(Q):
        if len(row) != 5:
            raise SystemExit(f'question {i + 1} carries {len(row)} fields where 5 are needed')
        target, prompt, correct, ds, expl = row
        if len(ds) != 3:
            raise SystemExit(f'question {i + 1} carries {len(ds)} distractors where 3 are '
                             f'needed: {prompt[:60]}')
        if not isinstance(target, int) or not 0 <= target < 4:
            raise SystemExit(f'question {i + 1} keys index {target!r}, which is not one of 0..3')
        opts = list(ds)
        opts.insert(target, correct)
        out.append({"prompt": prompt, "options": opts, "answer": target, "explanation": expl})
    return out


def emit(Q, path, label=None, expect_n=None):
    out = assemble(Q)
    if expect_n is None:
        raise SystemExit('emit() was called with no expect_n, so the count check would compare '
                         'the bank against itself. Pass the number this bank is planned to serve.')
    if len(out) != expect_n:
        raise SystemExit(f'{len(out)} question(s) against a declared expect_n={expect_n}')
    with open(path, 'w', encoding='utf-8') as fh:
        json.dump(out, fh, indent=1, ensure_ascii=False)
    return out


def finish():
    """The wave kit exits non-zero here when a bank was refused. A source run
    under this contract cannot be half written: a refusal raises."""
    return None
