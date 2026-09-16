#!/usr/bin/env python3
"""BANKS AGAINST THE MIGRATIONS, BY PARSING THE SQL, BOTH SIDES OUT OF GIT.

The generator is not what is being checked here; the generator is what is being
checked AGAINST. This reads the emitted .sql back, TOKENISES IT AS SQL with a
character-level scanner rather than a regexp over the whole file, and compares
every field of every question, verbatim, with the committed bank JSON: the slug,
the tier, the scope, the module key, the ordinal, the prompt, all four options IN
ORDER, the answer index and the explanation. Twelve comparisons per question,
1,584 per tier, 4,752 across the course, plus the structure row rebuilt from the
tier's manifest and the 36 expected values and tolerances of the capstone rows.

WHY A SCANNER AND NOT A REGEXP. A row separator is `), (`, and an explanation
that contains `), (` is ordinary prose. A regexp split on it stops checking the
moment a writer uses the phrase, and reports a clean result for a corpus it never
read.

WHY BOTH SIDES COME OUT OF THE GIT OBJECT STORE. A bank repaired in a wave
directory and never committed, and a bank committed and never copied back, both
produce a comparison that proves nothing about what a reviewer can read. This
resolves every file with `git show <ref>:<path>`, so neither side can be a file
somebody edited after the commit it is named for. WORKTREE is available for the
author's own pre-commit loop and the report says so out loud when it is used.

THE DRIFT CONTROL. Run with --canary and ONE CHARACTER of one option of one
question is changed before the comparison. A gate that cannot fail has not
passed: this one prints DISAGREE and exits 2 when it is run that way.

Usage:
  python3 verify_sql.py [ref]            default HEAD
  python3 verify_sql.py [ref] --canary   the one-character negative control
"""
import io
import json
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))


def default_repo():
    """The repository this file is committed in, when it is running from the
    committed mirror, so a fresh clone needs no environment at all."""
    up = os.path.abspath(os.path.join(HERE, '../../..'))
    if os.path.exists(os.path.join(up, '.git')):
        return up
    return '/root/wt-fc4-nextgen'


REPO = os.environ.get('FC4_REPO', default_repo())
SLUG = 'gasprocessing'
PREFIX = 'fc4'
DATE = '20260924'
TIERS = ('beginner', 'intermediate', 'advanced')
LETTER = {'beginner': 'b', 'intermediate': 'i', 'advanced': 'a'}
PARTS = ('m01', 'm02', 'm03', 'm04', 'm05', 'm06', 'exam')

ref = 'HEAD'
canary = False
for a in sys.argv[1:]:
    if a == '--canary':
        canary = True
    else:
        ref = a


def show(path):
    if ref == 'WORKTREE':
        return io.open(os.path.join(REPO, path), encoding='utf-8').read()
    r = subprocess.run(['git', '-C', REPO, 'show', f'{ref}:{path}'],
                       capture_output=True, text=True)
    if r.returncode != 0:
        print(f'REFUSED: {path} is not in {ref}\n  {r.stderr.strip()}')
        sys.exit(2)
    return r.stdout


# --------------------------------------------------------------- the scanner
def sql_string(s, i):
    """Read the single-quoted SQL literal at s[i]. Returns (value, next index).
    Two quotes in a row are one quote, which is the only escape this dialect
    uses and the only thing standing between this and a regexp."""
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


def parse_rows(sql, marker, ncols):
    k = sql.index(marker) + len(marker)
    body = sql[k:]
    rows = []
    i, n = 0, len(body)
    while i < n:
        while i < n and body[i] in ' \n\t,':
            i += 1
        if i >= n or body[i] == ';':
            break
        # An insert's VALUES list ends where the next clause begins: `on
        # conflict` for the structure row, a semicolon for the question rows.
        # Stopping on anything that is not an open bracket is what lets one
        # scanner read both, and it is a stop rather than an assertion because
        # the clause that follows is not a malformed row.
        if body[i] != '(':
            break
        i += 1
        vals = []
        while True:
            while body[i] in ' \n\t':
                i += 1
            if body[i] == "'":
                v, i = sql_string(body, i)
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
        assert len(vals) == ncols, vals
        rows.append(vals)
    return rows


QUESTION_MARKER = ('insert into public.academy_quiz_questions\n'
                   '    (app_slug, tier, scope, module_key, ord, prompt, options, answer_index, explanation)\n'
                   'values\n')
STRUCTURE_MARKER = ('insert into public.academy_course_structures\n'
                    '    (app_slug, tier, structure, content_version)\n'
                    'values ')

compared = 0
disagree = []
counts = {}

for tier in TIERS:
    sql = show(f'migrations/{DATE}_{PREFIX}_{SLUG}_{tier}_deep.sql')
    rows = parse_rows(sql, QUESTION_MARKER, 9)
    srow = parse_rows(sql, STRUCTURE_MARKER, 4)[0]
    structure = srow[2]
    if srow[0] != SLUG or srow[1] != tier:
        disagree.append(f'{tier}: the structure row is {srow[0]}/{srow[1]}')

    banks = {p: json.loads(show(f'tools/course-banks/{SLUG}/{tier}/{PREFIX}{LETTER[tier]}_{p}.json'))
             for p in PARTS}

    if canary and tier == 'intermediate':
        b = banks['m03'][7]
        old = b['options'][2]
        b['options'][2] = old[:11] + ('x' if old[11] != 'x' else 'y') + old[12:]
        print(f'CANARY: one character changed in {PREFIX}i_m03 Q8 option 3')

    # The structure row is rebuilt from the tier's manifest rather than trusted.
    man = json.loads(show(f'src/content/courses/{SLUG}/{tier}/manifest.json'))
    want = {'modules': [{'key': m['key'], 'title': m['title'],
                         'lesson_keys': [x['key'] for x in m['lessons']]}
                        for m in sorted(man['modules'], key=lambda m: m['order'])]}
    compared += 1
    if structure != want:
        disagree.append(f'{tier}: the structure row disagrees with {tier}/manifest.json')
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
        for got, want_, what in (
            (r[0], slug, 'app_slug'), (r[1], t, 'tier'), (r[2], scope, 'scope'),
            (r[3], mk, 'module_key'), (r[4], ord_, 'ord'),
            (r[5], it['prompt'], 'prompt'),
            (r[7], it['answer'], 'answer_index'),
            (r[8], it['explanation'], 'explanation'),
        ):
            compared += 1
            if got != want_:
                disagree.append(f'DISAGREE {tag} {what}:\n     sql  {got!r}\n     bank {want_!r}')
        if len(r[6]) != 4:
            disagree.append(f'DISAGREE {tag} options: the migration offers {len(r[6])}')
        for oi, (got, want_) in enumerate(zip(r[6], it['options'])):
            compared += 1
            if got != want_:
                disagree.append(f'DISAGREE {tag} option {oi}:\n     sql  {got!r}\n     bank {want_!r}')

# --------------------------------------------------- the capstone migration
course = show(f'migrations/{DATE}_{PREFIX}_{SLUG}_course.sql')
fields = json.loads(show(f'tools/course-waves/{SLUG}/fields.json'))
# THE CAPSTONE KEYS ARE NOT UNIQUE ACROSS TIERS on this wave, so the SQL side is
# read PER CAPSTONE ROW and compared against (tier, key). Flattening by key
# alone would have compared the Associate glycol circulation against the
# Professional amine one and called them equal or unequal for the wrong reason.
sqlf = []
i = 0
while True:
    j = course.find("  'gasprocessing', '", i)
    if j < 0:
        break
    tier, k = sql_string(course, course.index("'", j + len("  'gasprocessing'") + 1))
    nxt = course.find("  'gasprocessing', '", j + 1)
    block = course[j:nxt if nxt > 0 else len(course)]
    m = 0
    while True:
        jj = block.find("jsonb_build_object('key',", m)
        if jj < 0:
            break
        key, kk = sql_string(block, jj + len("jsonb_build_object('key',"))
        kk = block.index("'expected',", kk) + len("'expected',")
        end = block.index(", 'tol',", kk)
        exp = float(block[kk:end])
        kk = end + len(", 'tol',")
        tol = float(block[kk:block.index(')', kk)])
        sqlf.append((tier, key, exp, tol))
        m = jj + 1
    i = j + 1

counts['capstone fields'] = (len(sqlf), len(fields))
if len(sqlf) != 18:
    disagree.append(f'the course migration carries {len(sqlf)} graded fields, expected 18')
by_key = {(t, k): (v, tol) for t, k, v, tol in fields}
for tier, key, exp, tol in sqlf:
    compared += 2
    if (tier, key) not in by_key:
        disagree.append(f'DISAGREE capstone field {tier}/{key} is in the SQL and not in fields.json')
        continue
    if repr(exp) != repr(float(by_key[(tier, key)][0])):
        disagree.append(f'DISAGREE capstone {tier}/{key} expected: sql {exp!r} fields.json {by_key[(tier, key)][0]!r}')
    if repr(tol) != repr(float(by_key[(tier, key)][1])):
        disagree.append(f'DISAGREE capstone {tier}/{key} tol: sql {tol!r} fields.json {by_key[(tier, key)][1]!r}')

CATALOGUE = ("values ('gasprocessing', 'Gas Processing', 'facilities', 42, "
             "'coming_soon', null)")
compared += 1
if CATALOGUE not in course:
    disagree.append('DISAGREE the catalogue row is not gasprocessing/facilities/42/coming_soon with no prerequisite')

# ------------------------------------------------------------------ report
print(f'ref: {ref}' + ('   (A WORKING TREE, not the object store)' if ref == 'WORKTREE' else ''))
print(f'repo: {REPO}')
for k, (a, b) in counts.items():
    print(f'  {k:16s} migration {a:4d}   banks/fields {b:4d}   {"match" if a == b else "MISMATCH"}')
print(f'fields compared verbatim, SQL against bank: {compared}')
if disagree:
    print(f'\nDISAGREE: {len(disagree)}')
    for d in disagree[:20]:
        print('  ', d)
    sys.exit(2)
if canary:
    print('\nTHE CANARY DID NOT FIRE. One character was changed and this gate '
          'reported agreement, so it is not comparing what it says it compares.')
    sys.exit(2)
print('AGREE: every question row in every migration is its committed bank row, '
      'field for field, and every graded field is its committed fields.json row.')
