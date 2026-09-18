#!/usr/bin/env python3
"""Compare the three FC5 deep seeds against the 21 bank JSONs, FIELD BY FIELD.

WHY A CHARACTER-LEVEL PARSER AND NOT A REGEX. The rows of a deep seed are a SQL
VALUES list, and the obvious way to split one is on `), (`. That works until an
explanation contains those three characters, and then the split silently merges
two rows and every field after it compares against the wrong question. Worse, a
merged row usually still "matches" nothing and the run reports a diff the reader
cannot interpret. So this walks the VALUES list one character at a time, in and
out of single-quoted literals, treating `''` as an escaped quote, and hands back
exactly nine columns per row or refuses.

BOTH SIDES COME OUT OF THE GIT OBJECT STORE. The banks are read with `git show`
at a ref and so is the SQL, so this compares what is COMMITTED against what is
COMMITTED. A working-tree bank repaired after the seed was cut is the defect
this is here to catch, and reading either side off disk would hide it.

THE CANARY. --canary flips ONE CHARACTER in one bank answer before comparing.
A verifier that cannot be made to fail proves nothing, so the canary run must
print DISAGREE and exit 2. That is asserted by the caller, not hoped for.

Usage: verify_sql.py [ref] [--canary]
   REPO=<path>  a clone or worktree of petrolord-nextgen
"""
import io
import json
import os
import subprocess
import sys

REF = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith('--') else 'HEAD'
CANARY = '--canary' in sys.argv
HERE = os.path.dirname(os.path.abspath(__file__))
UP = os.path.abspath(os.path.join(HERE, '../../..'))
REPO = os.environ.get(
    'REPO', UP if os.path.exists(os.path.join(UP, '.git')) else '/root/wt-fc5-nextgen')
SLUG, PREFIX, DATE = 'relief', 'fc5', '20260925'
TIERS = (('beginner', 'b'), ('intermediate', 'i'), ('advanced', 'a'))
PARTS = ('m01', 'm02', 'm03', 'm04', 'm05', 'm06', 'exam')


def show(path):
    r = subprocess.run(['git', '-C', REPO, 'show', f'{REF}:{path}'],
                       capture_output=True, text=True)
    if r.returncode != 0:
        sys.exit(f'REFUSED: cannot read {path} at {REF}: {r.stderr.strip()}')
    return r.stdout


def split_rows(values_text):
    """The VALUES list, one character at a time.

    Returns a list of rows, each a list of raw column tokens. A single-quoted
    literal is opaque to every delimiter, which is the entire point: a comma, a
    bracket or the sequence `), (` inside an explanation is text and not
    structure.
    """
    rows, row, tok = [], [], []
    depth, i, in_str = 0, 0, False
    n = len(values_text)
    while i < n:
        ch = values_text[i]
        if in_str:
            tok.append(ch)
            if ch == "'":
                if i + 1 < n and values_text[i + 1] == "'":
                    tok.append("'")
                    i += 2
                    continue
                in_str = False
            i += 1
            continue
        if ch == "'":
            in_str = True
            tok.append(ch)
            i += 1
            continue
        if ch == '(':
            depth += 1
            if depth == 1:
                row, tok = [], []
                i += 1
                continue
        elif ch == ')':
            depth -= 1
            if depth == 0:
                row.append(''.join(tok).strip())
                rows.append(row)
                row, tok = [], []
                i += 1
                continue
        elif ch == ',' and depth == 1:
            row.append(''.join(tok).strip())
            tok = []
            i += 1
            continue
        tok.append(ch)
        i += 1
    if in_str or depth != 0:
        sys.exit(f'REFUSED: the VALUES list does not close (depth {depth}, in a literal: {in_str}). '
                 'This is what a regex split would have silently got wrong.')
    return rows


def unquote(tok):
    tok = tok.strip()
    if tok.endswith('::jsonb'):
        tok = tok[:-len('::jsonb')].strip()
    if tok == 'null':
        return None
    if not (tok.startswith("'") and tok.endswith("'")):
        return tok
    return tok[1:-1].replace("''", "'")


compared = 0
disagree = []

for tier, letter in TIERS:
    sql = show(f'migrations/{DATE}_{PREFIX}_{SLUG}_{tier}_deep.sql')
    marker = 'insert into public.academy_quiz_questions'
    if marker not in sql:
        sys.exit(f'REFUSED: {tier} seed carries no question insert')
    tail = sql.split(marker, 1)[1]
    values_text = tail.split('values', 1)[1]
    rows = split_rows(values_text)
    if len(rows) != 132:
        sys.exit(f'REFUSED: the {tier} seed parsed to {len(rows)} rows, expected 132')

    # The banks, in the order the generator lays them down: six module banks
    # then the exam.
    want = []
    for part in PARTS[:-1]:
        bank = json.loads(show(f'tools/course-banks/{SLUG}/{tier}/{PREFIX}{letter}_{part}.json'))
        for ord_, item in enumerate(bank, 1):
            want.append(('module', ord_, item))
    exam = json.loads(show(f'tools/course-banks/{SLUG}/{tier}/{PREFIX}{letter}_exam.json'))
    for ord_, item in enumerate(exam, 1):
        want.append(('final', ord_, item))
    if CANARY and tier == 'intermediate':
        # ONE CHARACTER, in one explanation. Not a whole field, because the
        # thing being proved is that a single character cannot slip through.
        scope, ord_, item = want[40]
        item = dict(item)
        item['explanation'] = item['explanation'][:17] + ('X' if item['explanation'][17] != 'X' else 'Y') \
            + item['explanation'][18:]
        want[40] = (scope, ord_, item)

    if len(want) != 132:
        sys.exit(f'REFUSED: the {tier} banks carry {len(want)} questions, expected 132')

    for idx, (row, (scope, ord_, item)) in enumerate(zip(rows, want)):
        if len(row) != 9:
            sys.exit(f'REFUSED: {tier} row {idx + 1} parsed to {len(row)} columns, expected 9')
        got_slug, got_tier, got_scope, got_mk, got_ord, got_prompt, got_opts, got_ans, got_expl = row
        where = f'{tier}/{scope}/{ord_}'

        def cmp(name, a, b):
            global compared
            compared += 1
            if a != b:
                disagree.append(f'{where} {name}: seed {a!r} against bank {b!r}')

        cmp('app_slug', unquote(got_slug), SLUG)
        cmp('tier', unquote(got_tier), tier)
        cmp('scope', unquote(got_scope), scope)
        cmp('ord', got_ord.strip(), str(ord_))
        cmp('prompt', unquote(got_prompt), item['prompt'])
        cmp('answer_index', got_ans.strip(), str(item['answer']))
        cmp('explanation', unquote(got_expl), item['explanation'])
        opts = json.loads(unquote(got_opts))
        if len(opts) != len(item['options']):
            disagree.append(f'{where} options: {len(opts)} against {len(item["options"])}')
        else:
            for oi, (a, b) in enumerate(zip(opts, item['options'])):
                cmp(f'option {oi}', a, b)
        # module_key is structural rather than a bank field, and it is checked
        # against the scope it belongs to.
        compared += 1
        mk = unquote(got_mk)
        if scope == 'final' and mk is not None:
            disagree.append(f'{where} module_key: an exam row carries {mk!r}')
        if scope == 'module' and not mk:
            disagree.append(f'{where} module_key: a module row carries none')

print(f'ref {REF}, repo {REPO}')
print(f'fields compared verbatim, both sides out of the git object store: {compared}')
if CANARY:
    print('CANARY RUN: one character was flipped in one intermediate explanation.')
if disagree:
    print(f'DISAGREE: {len(disagree)} field(s) differ.')
    for d in disagree[:10]:
        print('  ', d)
    sys.exit(2)
print('AGREE: every field in all 396 questions is byte for byte what the committed banks carry.')
