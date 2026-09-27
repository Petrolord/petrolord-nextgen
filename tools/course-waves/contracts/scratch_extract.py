#!/usr/bin/env python3
"""THE REAL ACADEMY DDL FOR THE SC5 SCRATCH DATABASE, read out of the committed
migrations at a ref (never a working tree, never hand typed).

For each table named below, the LAST migration (in file name order, which is
apply order) that creates it gives its `create table if not exists` block; for
each function, the LAST migration that defines it gives its `create or replace
function` block, so the scratch database carries the definitions production
carries after every migration on the ref. The deep-course tunables come from
the chassis migration's own insert.

    python3 scratch_extract.py <repo> <ref>     prints the SQL on stdout

Exit 2 when a table, a function or the tunables cannot be found: a scratch
database missing a real definition would prove nothing about production.
"""
import re
import subprocess
import sys

TABLES = ['academy_course_structures', 'academy_lesson_progress', 'academy_quiz_questions',
          'academy_quiz_attempts', 'academy_prereq_waivers']
# In dependency order (a SQL function body is checked at creation).
FUNCTIONS = ['academy_setting_int', 'academy_deep_structure', 'academy_deep_setting_int',
             'academy_module_lessons_read', 'academy_quiz_passed', 'academy_module_complete',
             'academy_module_unlocked', 'academy_all_modules_complete', 'academy_quiz_lock_until',
             'academy_deep_guard', 'academy_has_prereq_waiver', 'academy_serve_quiz', 'academy_grade_quiz',
             'academy_mark_lesson_read', 'academy_get_module_quiz', 'academy_submit_module_quiz',
             'academy_get_final_exam', 'academy_submit_final_exam']


def git(repo, *a):
    return subprocess.run(['git', '-C', repo, *a], capture_output=True, text=True, check=True).stdout


def main():
    repo, ref = sys.argv[1], sys.argv[2]
    files = sorted(f for f in git(repo, 'ls-tree', '--name-only', ref, 'migrations/').split()
                   if f.endswith('.sql'))
    texts = {f: git(repo, 'show', f'{ref}:{f}') for f in files}
    out, missing = [], []

    for t in TABLES:
        found = None
        for f in files:
            lines = texts[f].split('\n')
            for i, l in enumerate(lines):
                if re.match(rf'\s*create table if not exists public\.{t}\s*\(', l, re.I):
                    j = i
                    while not re.match(r'^\);\s*$', lines[j]):
                        j += 1
                    found = (f, '\n'.join(lines[i:j + 1]))
        if not found:
            missing.append(f'table {t}')
            continue
        out.append(f'-- table {t}: {found[0]}\n{found[1]}\n')
        # a later migration may widen a check constraint on it
        for f in files:
            for m in re.finditer(rf'alter table public\.{t} drop constraint if exists [a-z_]+;\s*\n'
                                 rf'alter table public\.{t}\s*\n\s*add constraint [^;]+;', texts[f], re.I):
                out.append(f'-- widened by {f}\n{m.group(0)}\n')

    for fn in FUNCTIONS:
        found = None
        for f in files:
            lines = texts[f].split('\n')
            for i, l in enumerate(lines):
                if re.match(rf'\s*create or replace function public\.{fn}\s*\(', l, re.I):
                    j = i + 1
                    while not re.search(r'\$\$\s*;\s*$', lines[j]):
                        j += 1
                    found = (f, '\n'.join(lines[i:j + 1]))
        if not found:
            missing.append(f'function {fn}')
            continue
        out.append(f'-- function {fn}: {found[0]}\n{found[1]}\n')

    tun = None
    for f in files:
        m = re.search(r"insert into public\.system_settings[\s\S]*?'academy_final_exam_pass_pct'[\s\S]*?;", texts[f])
        if m:
            tun = (f, m.group(0))
    if not tun:
        missing.append('the deep-course tunables')
    else:
        out.append(f'-- tunables: {tun[0]}\n{tun[1]}\n')

    if missing:
        print('scratch_extract REFUSES: not found at ' + ref + ': ' + ', '.join(missing), file=sys.stderr)
        return 2
    sys.stdout.write('\n'.join(out))
    return 0


sys.exit(main())
