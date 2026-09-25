#!/usr/bin/env python3
"""Compare the D4 forecastml seed ladder against its committed sources, FIELD BY FIELD:
the three deep seeds against the 21 bank JSONs (every prompt, option, answer key
and explanation of all 396 questions), the three structure rows against the
three manifests (every module key, title and lesson key, 78 in all), the course
migration's capstones against fields.json (every graded key, expected value and
tolerance, 18 in all, each field at its own tolerance), and its catalogue row against wave.json.

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

THE CANARIES. A verifier that cannot be made to fail proves nothing, so each
canary run must print DISAGREE and exit 2:
  --canary        flips ONE CHARACTER in one intermediate explanation;
  --canary-key    moves one advanced answer key by one option;
  --canary-field  moves one graded expected value by one part in 1e7;
  --canary-lesson renames one lesson key in one manifest.

Usage: verify_sql.py [ref] [--canary]
   REPO=<path>  a clone or worktree of petrolord-nextgen
"""
import io
import re
import json
import os
import subprocess
import sys

REF = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith('--') else 'HEAD'
CANARY = '--canary' in sys.argv
CANARY_KEY = '--canary-key' in sys.argv
CANARY_FIELD = '--canary-field' in sys.argv
CANARY_LESSON = '--canary-lesson' in sys.argv
HERE = os.path.dirname(os.path.abspath(__file__))
UP = os.path.abspath(os.path.join(HERE, '../../..'))
REPO = os.environ.get(
    'REPO', UP if os.path.exists(os.path.join(UP, '.git')) else '/root/wt-dai-d4-nextgen')
SLUG, PREFIX, DATE = 'forecastml', 'd4', '20261103'
WAVE = f'tools/course-waves/{SLUG}'
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
    if CANARY_KEY and tier == 'advanced':
        scope, ord_, item = want[77]
        item = dict(item)
        item['answer'] = (item['answer'] + 1) % 4
        want[77] = (scope, ord_, item)

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


# ------------------------------------------------ the three structure rows
lesson_keys = 0
for tier, _letter in TIERS:
    sql = show(f'migrations/{DATE}_{PREFIX}_{SLUG}_{tier}_deep.sql')
    m = re.search(r"insert into public\.academy_course_structures\s+\(app_slug, tier, structure, content_version\)\s+"
                  r"values \('([a-z]+)', '([a-z]+)', '((?:[^']|'')*)'::jsonb, 1\)", sql)
    if not m:
        sys.exit(f'REFUSED: the {tier} seed carries no structure row')
    got = json.loads(m.group(3).replace("''", "'"))
    man = json.loads(show(f'src/content/courses/{SLUG}/{tier}/manifest.json'))
    want = [{'key': mm['key'], 'title': mm['title'], 'lesson_keys': [l['key'] for l in mm['lessons']]}
            for mm in sorted(man['modules'], key=lambda mm: mm['order'])]
    if CANARY_LESSON and tier == 'beginner':
        want[2]['lesson_keys'][1] = want[2]['lesson_keys'][1] + 'x'
    compared += 2
    if m.group(1) != SLUG or m.group(2) != tier:
        disagree.append(f'{tier} structure row is for {m.group(1)}/{m.group(2)}')
    if len(got['modules']) != 6:
        disagree.append(f'{tier} structure carries {len(got["modules"])} modules, expected 6')
    for gm, wm in zip(got['modules'], want):
        for k in ('key', 'title'):
            compared += 1
            if gm[k] != wm[k]:
                disagree.append(f'{tier} module {wm["key"]} {k}: seed {gm[k]!r} against manifest {wm[k]!r}')
        compared += 1
        if gm['lesson_keys'] != wm['lesson_keys']:
            disagree.append(f'{tier} module {wm["key"]} lesson keys differ from the manifest')
        lesson_keys += len(gm['lesson_keys'])
    if len(got['modules']) != len(want):
        disagree.append(f'{tier}: {len(got["modules"])} modules in the seed, {len(want)} in the manifest')
if lesson_keys != 78:
    disagree.append(f'the three structures carry {lesson_keys} lesson keys, expected 78')

# ------------------------------------ the capstones against fields.json
course = show(f'migrations/{DATE}_{PREFIX}_{SLUG}_course.sql')
fields = json.loads(show(f'{WAVE}/fields.json'))
if CANARY_FIELD:
    fields[9] = [fields[9][0], fields[9][1], fields[9][2] * 1.0000001, fields[9][3]]
# A graded value or a tolerance may be written with an exponent (the six-decimal
# floor is repr 5e-07), so the number pattern reads one.
NUMTOK = r'(-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?)'
FIELD = re.compile(r"jsonb_build_object\('key','([a-z0-9_]+)', 'label','((?:[^']|'')*)', 'unit','((?:[^']|'')*)',"
                   r" 'expected'," + NUMTOK + r", 'tol'," + NUMTOK + r"\)")
cap_rows = re.split(r"\n\(\n  'forecastml', ", course.split('insert into public.academy_capstones', 1)[1])[1:]
got_fields = []
for row in cap_rows:
    tier = row.split("'", 2)[1]
    for fm in FIELD.finditer(row):
        got_fields.append([tier, fm.group(1), json.loads(fm.group(4)), json.loads(fm.group(5))])
compared += 1
if len(got_fields) != 18 or len(fields) != 18:
    disagree.append(f'the course migration grades {len(got_fields)} fields and fields.json carries {len(fields)}; expected 18 and 18')
for g, w in zip(got_fields, fields):
    for i, what in enumerate(('tier', 'key', 'expected', 'tol')):
        compared += 1
        if g[i] != w[i] or type(g[i]) is not type(w[i]):
            disagree.append(f'capstone field {w[1]} {what}: seed {g[i]!r} against fields.json {w[i]!r}')

# ------------------------------------------- the catalogue row against wave.json
wave = json.loads(show(f'{WAVE}/wave.json'))
cat = re.search(r"insert into public\.academy_apps \(slug, name, module, path_order, status, prereq_slug\)\s+"
                r"values \('([a-z]+)', '((?:[^']|'')*)', '([a-z_]+)', (\d+), '([a-z_]+)', (null|'[a-z]+')\)", course)
if not cat:
    sys.exit('REFUSED: the course migration carries no catalogue row')
for what, got, want in (('slug', cat.group(1), wave['slug']), ('name', cat.group(2).replace("''", "'"), wave['name']),
                        ('module', cat.group(3), wave['module']), ('path_order', int(cat.group(4)), wave['pathOrder']),
                        ('status', cat.group(5), 'coming_soon'),
                        ('prereq_slug', None if cat.group(6) == 'null' else cat.group(6).strip("'"), wave['prerequisite'])):
    compared += 1
    if got != want:
        disagree.append(f'catalogue {what}: seed {got!r} against {want!r}')

print(f'ref {REF}, repo {REPO}')
print(f'fields compared verbatim, both sides out of the git object store: {compared}')
for flag, what in ((CANARY, 'one character flipped in one intermediate explanation'),
                   (CANARY_KEY, 'one advanced answer key moved by one option'),
                   (CANARY_FIELD, 'one graded expected value moved by one part in 1e7'),
                   (CANARY_LESSON, 'one beginner lesson key renamed')):
    if flag:
        print(f'CANARY RUN: {what}.')
if disagree:
    print(f'DISAGREE: {len(disagree)} field(s) differ.')
    for d in disagree[:10]:
        print('  ', d)
    sys.exit(2)
print(f'AGREE: all 396 questions (prompt, options, answer key, explanation), {lesson_keys} lesson keys in 18 modules, '
      f'{len(got_fields)} graded fields (key, expected, tolerance) and the catalogue row are byte for byte what the '
      'committed banks, manifests, fields.json and wave.json carry.')
