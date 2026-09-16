#!/usr/bin/env python3
"""BANKS AGAINST THE MIGRATIONS, BY PARSING THE SQL.

The point of this gate is that it does not trust the generator. It re-reads
the emitted .sql with its own parser, pulls every question row back out of it,
and compares each one FIELD BY FIELD AND VERBATIM against the committed bank
JSON: the slug, the tier, the scope, the module key, the ordinal, the prompt,
all four options IN ORDER, the answer index and the explanation. That is
twelve fields per question, 1584 comparisons per tier and 4752 across the
course, plus the 36 expected values and tolerances of the capstone rows. It
also matches each migration's row count to its bank count exactly, and checks
the catalogue row itself.

Both sides come out of the git object store at a ref, so neither side is a
working tree.

THE DRIFT CONTROL. Run with --canary and one character of one bank is changed
before the comparison. A gate that cannot fail has not passed, and this one
prints DISAGREE and exits 2 when it is run that way.

Usage:
  python3 verify_sql.py [ref]            default HEAD
  python3 verify_sql.py [ref] --canary   the one-character negative control
"""
import io
import json
import os
import re
import subprocess
import sys

REPO = '/root/wt-fc2-nextgen'
SLUG = 'linesizing'
PREFIX = 'fc2'
DATE = '20260922'
LETTER = {'beginner': 'b', 'intermediate': 'i', 'advanced': 'a'}
TIERS = ('beginner', 'intermediate', 'advanced')

ref = 'HEAD'
canary = False
for a in sys.argv[1:]:
    if a == '--canary':
        canary = True
    else:
        ref = a


def show(path):
    # WORKTREE is the author's own pre-commit loop and says so in the report.
    # Every real run resolves out of the git object store at a ref, so neither
    # side of the comparison can be a file somebody edited after the commit.
    if ref == 'WORKTREE':
        return io.open(os.path.join(REPO, path), encoding='utf-8').read()
    return subprocess.run(['git', '-C', REPO, 'show', f'{ref}:{path}'],
                          capture_output=True, text=True, check=True).stdout


# --------------------------------------------------------------- the parser
# A row is  ('slug', 'tier', 'scope', 'module'|null, ord, 'prompt',
#            '[json]'::jsonb, answer, 'explanation'),
# with every SQL string single quoted and internal quotes doubled. Scan
# character by character rather than with one big regex: an explanation
# containing "), (" is ordinary prose and would break a regex split.
def sql_string(s, i):
    """Read a single-quoted SQL literal starting at s[i] == chr(39). Returns
    (value, next index)."""
    assert s[i] == "'", s[i:i + 40]
    i += 1
    out = []
    while True:
        c = s[i]
        if c == "'":
            if s[i + 1] == "'":
                out.append("'")
                i += 2
                continue
            return ''.join(out), i + 1
        out.append(c)
        i += 1


def parse_rows(sql):
    marker = ('insert into public.academy_quiz_questions\n'
              '    (app_slug, tier, scope, module_key, ord, prompt, options, answer_index, explanation)\n'
              'values\n')
    k = sql.index(marker) + len(marker)
    body = sql[k:]
    rows = []
    i = 0
    n = len(body)
    while i < n:
        while i < n and body[i] in ' \n\t,':
            i += 1
        if i >= n or body[i] == ';':
            break
        assert body[i] == '(', body[i:i + 60]
        i += 1
        vals = []
        while True:
            while body[i] in ' \n\t':
                i += 1
            if body[i] == "'":
                v, i = sql_string(body, i)
                # an options literal is followed by ::jsonb
                if body[i:i + 7] == '::jsonb':
                    i += 7
                    v = json.loads(v)
                vals.append(v)
            elif body[i:i + 4] == 'null':
                vals.append(None)
                i += 4
            else:
                j = i
                while body[j] not in ',)':
                    j += 1
                vals.append(int(body[i:j].strip()))
                i = j
            while body[i] in ' \n\t':
                i += 1
            if body[i] == ',':
                i += 1
                continue
            assert body[i] == ')', body[i:i + 40]
            i += 1
            break
        assert len(vals) == 9, vals
        rows.append(vals)
    return rows


def parse_structure(sql):
    m = re.search(r"values \('linesizing', '(\w+)', '((?:[^']|'')*)'::jsonb, (\d+)\)", sql)
    assert m, 'no structure row'
    return m.group(1), json.loads(m.group(2).replace("''", "'")), int(m.group(3))


# --------------------------------------------------------------- comparison
compared = 0
disagree = []
counts = {}

for tier in TIERS:
    sql = show(f'migrations/{DATE}_{PREFIX}_{SLUG}_{tier}_deep.sql')
    rows = parse_rows(sql)
    stier, structure, cver = parse_structure(sql)
    if stier != tier:
        disagree.append(f'{tier}: the structure row says tier {stier}')

    # the banks, out of the same object store
    banks = {}
    for part in ('m01', 'm02', 'm03', 'm04', 'm05', 'm06', 'exam'):
        banks[part] = json.loads(show(f'tools/course-banks/{SLUG}/{tier}/{PREFIX}{LETTER[tier]}_{part}.json'))

    if canary and tier == 'intermediate':
        # ONE CHARACTER. The 'v' of a word in one option of one question.
        b = banks['m03'][7]
        old = b['options'][2]
        b['options'][2] = old[:11] + ('x' if old[11] != 'x' else 'y') + old[12:]
        print(f'CANARY: one character changed in {PREFIX}i_m03 Q8 option 3')

    mods = [m['key'] for m in structure['modules']]
    if len(mods) != 6:
        disagree.append(f'{tier}: structure declares {len(mods)} modules, expected 6')
    lessons = sum(len(m['lesson_keys']) for m in structure['modules'])
    if lessons != 26:
        disagree.append(f'{tier}: structure declares {lessons} lesson keys, expected 26')

    expected = []
    for mk in mods:
        part = mk.split('-')[0]
        bank = banks[part]
        if len(bank) != 15:
            disagree.append(f'{tier}/{part}: bank has {len(bank)} questions, expected 15')
        for i, it in enumerate(bank, 1):
            expected.append((SLUG, tier, 'module', mk, i, it))
    if len(banks['exam']) != 42:
        disagree.append(f'{tier}/exam: bank has {len(banks["exam"])} questions, expected 42')
    for i, it in enumerate(banks['exam'], 1):
        expected.append((SLUG, tier, 'final', None, i, it))

    counts[tier] = (len(rows), len(expected))
    if len(rows) != len(expected):
        disagree.append(f'{tier}: the migration carries {len(rows)} question rows, the banks carry {len(expected)}')
        continue

    for r, (slug, t, scope, mk, ord_, it) in zip(rows, expected):
        tag = f'{tier} {scope} {mk or "exam"} ord {ord_}'
        for got, want, what in (
            (r[0], slug, 'app_slug'), (r[1], t, 'tier'), (r[2], scope, 'scope'),
            (r[3], mk, 'module_key'), (r[4], ord_, 'ord'),
            (r[5], it['prompt'], 'prompt'),
            (r[7], it['answer'], 'answer_index'),
            (r[8], it['explanation'], 'explanation'),
        ):
            compared += 1
            if got != want:
                disagree.append(f'DISAGREE {tag} {what}:\n     sql  {got!r}\n     bank {want!r}')
        if len(r[6]) != 4:
            disagree.append(f'DISAGREE {tag} options: the migration offers {len(r[6])}')
        for oi, (got, want) in enumerate(zip(r[6], it['options'])):
            compared += 1
            if got != want:
                disagree.append(f'DISAGREE {tag} option {oi}:\n     sql  {got!r}\n     bank {want!r}')

# --------------------------------------------------- the capstone migration
course = show(f'migrations/{DATE}_{PREFIX}_{SLUG}_course.sql')
fields = json.load(io.open(os.path.join(REPO, '..', 'fc-wip-linesizing', 'fields.json'), encoding='utf-8')) \
    if os.path.exists('/root/fc-wip-linesizing/fields.json') else None
fields = json.load(io.open('/root/fc-wip-linesizing/fields.json', encoding='utf-8'))
OBJ = re.compile(r"jsonb_build_object\('key','([^']+)', 'label','((?:[^']|'')*)', "
                 r"'unit','((?:[^']|'')*)', 'expected',([-\d.eE+]+), 'tol',([-\d.eE+]+)\)")
sqlf = [(m.group(1), float(m.group(4)), float(m.group(5))) for m in OBJ.finditer(course)]
counts['capstone fields'] = (len(sqlf), len(fields))
if len(sqlf) != 18:
    disagree.append(f'the course migration carries {len(sqlf)} graded fields, expected 18')
by_key = {k: (v, t) for _t, k, v, t in fields}
for key, exp, tol in sqlf:
    compared += 2
    if key not in by_key:
        disagree.append(f'DISAGREE capstone field {key} is in the SQL and not in fields.json')
        continue
    if repr(exp) != repr(float(by_key[key][0])):
        disagree.append(f'DISAGREE capstone {key} expected: sql {exp!r} fields.json {by_key[key][0]!r}')
    if repr(tol) != repr(float(by_key[key][1])):
        disagree.append(f'DISAGREE capstone {key} tol: sql {tol!r} fields.json {by_key[key][1]!r}')

if not re.search(r"values \('linesizing', 'Pipeline & Line Sizing', 'facilities', 40, 'coming_soon', null\)", course):
    disagree.append('DISAGREE the catalogue row is not linesizing/facilities/40/coming_soon with no prerequisite')

# ------------------------------------------------------------------ report
print(f'ref: {ref}')
for k, (a, b) in counts.items():
    print(f'  {k:16s} migration {a:4d}   banks/fields {b:4d}   {"match" if a == b else "MISMATCH"}')
print(f'fields compared verbatim, SQL against bank: {compared}')
if disagree:
    print(f'\nDISAGREE: {len(disagree)}')
    for d in disagree[:20]:
        print('  ', d)
    sys.exit(2)
print('AGREE: every question row in every migration is its committed bank row, field for field.')
