#!/usr/bin/env python3
"""GATE (promptleak): nothing the ec45 recut migration writes hands a learner a
graded capstone answer, and no question row names a capstone case.

Swept: every NEW text the migration writes (the 321 question rows' prompt, four
options and explanation; the two new Expert dataset lines) and the capstone
prompts the migration guards on (decision and portfolio Expert, pre- and post-W3
forms), read through gen_ec45_migration.py, the migration's own generator.
Graded values: the 18 fields of each course (tools/course-waves/<course>/fields.json).

A number token leaks when it is within the field's tolerance of the value's
magnitude (two or more significant figures), or when it is the value ROUNDED to
the decimals the token prints (three or more significant figures). A question
row leaks a case when it names ABALAMA (decision), IDOHO (portfolio) or IDUMU
(joa), the capstone datasets. It prints what it swept and refuses an empty sweep.
Negative control: --plant appends one graded value to a row and one case name
to another, and the gate must name both.
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
sys.path.insert(0, HERE)
import gen_ec45_migration as G  # noqa: E402

NUM = re.compile(r'(?<![\w.])-?\d+(?:\.\d+)?(?![\w])')
CASE = {'decision': 'ABALAMA', 'portfolio': 'IDOHO', 'joa': 'IDUMU'}


def sig(tok):
    return len(tok.lstrip('-').replace('.', '').lstrip('0'))


def is_rounding(tok, value):
    dec = len(tok.split('.')[1]) if '.' in tok else 0
    return abs(abs(float(tok)) - abs(value)) <= 0.5 * 10 ** -dec + 1e-12


def main():
    graded = {c: [(t, k, v, tol) for t, k, v, tol in json.load(open(os.path.join(REPO, 'tools/course-waves', c, 'fields.json')))]
              for c in G.COURSES}
    texts = []  # (course, where, text, is_question_row)
    for c, rows in G.ROWS.items():
        for t, s, m, o, old, new in rows:
            where = f"{c} {t} {'final' if s == 'final' else m} ord {o}"
            texts.append((c, where + ' prompt', new['prompt'], True))
            for i, x in enumerate(new['options']):
                texts.append((c, where + f' option {i}', x, True))
            texts.append((c, where + ' explanation', new['explanation'] or '', True))
    for x in G.CAPS:
        texts.append((x['course'], f"{x['course']} Expert dataset (new)", x['new'], False))
    for d in (G.DEC, G.POR):
        for x in d['capstones']:
            for form in ('pre_w3', 'post_w3'):
                texts.append((x['slug'], f"{x['slug']} Expert prompt ({form})", x['prompt_unchanged'][form], False))
    if '--plant' in sys.argv:
        t, k, v, tol = graded['portfolio'][4]
        c0, w0, s0, q0 = texts[0]
        texts[0] = (c0, w0, s0 + f' For reference: {v:.4f}.', q0)
        c1, w1, s1, q1 = texts[-len(G.CAPS) - 5]
        texts[-len(G.CAPS) - 5] = (c1, w1, s1 + ' As on IDOHO.', True)
    bad, tokens = [], 0
    for c, where, text, is_row in texts:
        for tok in NUM.findall(text):
            tokens += 1
            v = float(tok)
            for gc in G.COURSES:
                for t, k, val, tol in graded[gc]:
                    if (sig(tok) >= 2 and abs(abs(v) - abs(val)) <= tol) or (sig(tok) >= 3 and is_rounding(tok, val)):
                        bad.append(f'{where} prints {tok}, the graded value of {gc}/{t}.{k} ({val})')
        if is_row:
            for gc, name in CASE.items():
                if name.lower() in text.lower():
                    bad.append(f'{where} names {name}, the {gc} capstone case')
    n_rows = sum(len(r) for r in G.ROWS.values())
    n_graded = sum(len(v) for v in graded.values())
    print(f'  texts swept: {len(texts)} ({n_rows} question rows, {len(G.CAPS)} datasets, 4 prompt forms); '
          f'number tokens read: {tokens}; graded values: {n_graded}')
    for b in bad:
        print(f'  LEAK {b}')
    if n_rows != 321 or n_graded != 54 or tokens < 500:
        print('  GATE REFUSES: it examined too little to have checked anything')
        return 2
    print(f'  leaks: {len(bad)}')
    return 1 if bad else 0


sys.exit(main())
