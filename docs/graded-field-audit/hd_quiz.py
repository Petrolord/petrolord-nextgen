#!/usr/bin/env python3
"""HELD DECISIONS (HD), 2026-09-22: the guarded quiz re-cut migrations.

  python3 hd_quiz.py [--container hdd-scratch] [--pin] [--check]

A spec hd/quiz/<course>.json (kind `quiz`) lists served questions whose text
prints a figure or a claim the vendored engine no longer supports. Each row
names its slot (tier, scope, module_key, ord), the content hash of the row it
replaces (`replaces`, md5(prompt | options | answer_index | explanation), the
W6 hash) and `edits`: exact passages of the live text, each found exactly once
across the prompt, options and explanation, with their replacements. A
replacement may carry {{name}}, rendered from the JSON the spec's `figures`
script prints (it calls the vendored engine), so no figure is typed by hand.

The file uses the W6 slot pattern (tools/finals-transfer/w6.py sql): when the
active row at the slot carries its published hash it is RETIRED (active =
false, text untouched, id kept, so every stored attempt still grades and
reviews against what it was served; stored scores are never recomputed) and
the re-cut question is inserted at the same slot with the same answer_index.
When the active row already IS the re-cut question and the published row sits
retired beside it, the slot is left alone. Anything else raises and the whole
file rolls back. Every touched quiz keeps its active count. SAFE TO RE-RUN.

  --pin    fill each row's `replaces` from the scratch (the post-W2-W6 state)
  --check  regenerate in memory and fail if the committed migration differs
Copy rule: no em or en dash and no new "X, not Y" contrastive in any new text.
"""
import argparse, glob, json, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
MIG = os.path.join(REPO, 'migrations')
SPECS = os.path.join(HERE, 'hd')
HASH_SQL = "md5(prompt || chr(31) || options::text || chr(31) || answer_index::text || chr(31) || coalesce(explanation, ''))"
DASH = re.compile('[–—]')
CONTRAST = re.compile(r',\s*not\b', re.I)
PLACEHOLDER = re.compile(r'\{\{([A-Za-z0-9_]+)\}\}')


def q(s):
    return "'" + s.replace("'", "''") + "'"


def psql_json(container, sql):
    r = subprocess.run(['docker', 'exec', container, 'psql', '-U', 'postgres', '-tAc', sql], capture_output=True, text=True)
    if r.returncode != 0:
        sys.exit(f'REFUSED: psql on {container}: {r.stderr.strip()[:300]}')
    return json.loads(r.stdout)


def figures(spec):
    vn = os.path.join(REPO, 'node_modules', '.bin', 'vite-node')
    r = subprocess.run([vn, '-c', os.path.join(REPO, 'vitest.config.js'), os.path.join(REPO, spec['figures'])],
                       capture_output=True, text=True, cwd=REPO, timeout=600)
    if r.returncode != 0:
        sys.exit(f'REFUSED: {spec["figures"]} failed: {r.stderr.strip()[-600:]}')
    out = r.stdout.strip()
    return json.loads(out[out.index('{'):])['figures']


def where_of(course, row):
    mk = f"module_key = {q(row['module_key'])}" if row['module_key'] else 'module_key is null'
    return (f"app_slug = {q(course)} and tier = {q(row['tier'])} and scope = {q(row['scope'])} and {mk} "
            f"and ord = {row['ord']}")


def label(row):
    return f"{row['tier']} {row['module_key'] or 'final'} ord {row['ord']}"


def live_row(container, course, row):
    rows = psql_json(container, "select coalesce(json_agg(json_build_object('prompt',prompt,'options',options,"
                     f"'answer_index',answer_index,'explanation',explanation,'h',{HASH_SQL})),'[]') "
                     f"from academy_quiz_questions where {where_of(course, row)} and active")
    if len(rows) != 1:
        sys.exit(f'REFUSED: {label(row)} holds {len(rows)} active rows on the scratch')
    return rows[0]


def published_row(container, course, row):
    rows = psql_json(container, "select coalesce(json_agg(json_build_object('prompt',prompt,'options',options,"
                     f"'answer_index',answer_index,'explanation',explanation,'h',{HASH_SQL})),'[]') "
                     f"from academy_quiz_questions where {where_of(course, row)} and {HASH_SQL} = {q(row['replaces'])}")
    if len(rows) != 1:
        sys.exit(f'REFUSED: {label(row)}: the scratch holds {len(rows)} rows with the pinned hash {row["replaces"]}')
    return rows[0]


def recut(row, live, figs):
    parts = {'prompt': live['prompt'], 'explanation': live['explanation'] or ''}
    opts = list(live['options'])

    def render(s):
        def sub(m):
            if m.group(1) not in figs:
                sys.exit(f'REFUSED: {label(row)}: no figure {m.group(1)}')
            return figs[m.group(1)]
        return PLACEHOLDER.sub(sub, s)

    for old, new in row['edits']:
        new = render(new)
        for rx, why in ((DASH, 'a dash'), (CONTRAST, 'an "X, not Y" contrastive')):
            if rx.search(new) and not rx.search(old):
                sys.exit(f'REFUSED: {label(row)}: the replacement adds {why}: {new!r}')
        hits = [k for k, v in parts.items() if v.count(old)] + [i for i, o in enumerate(opts) if o.count(old)]
        total = sum(v.count(old) for v in parts.values()) + sum(o.count(old) for o in opts)
        if total != 1:
            sys.exit(f'REFUSED: {label(row)}: passage found {total} times: {old!r}')
        k = hits[0]
        if isinstance(k, int):
            opts[k] = opts[k].replace(old, new)
        else:
            parts[k] = parts[k].replace(old, new)
    if len(set(opts)) != len(opts):
        sys.exit(f'REFUSED: {label(row)}: the re-cut options are not distinct')
    return {'prompt': parts['prompt'], 'options': opts, 'answer_index': live['answer_index'],
            'explanation': parts['explanation']}


def file_sql(spec, rows):
    course = spec['course']
    tag = f'hd {course} quiz'
    head = [
        '-- ============================================================================',
        f'-- HELD DECISIONS (HD): {spec["migration"][:-4]}.',
        '--',
    ]
    words, line = spec['decision'].split(), '--'
    for w in words:
        if len(line) + len(w) + 1 > 78:
            head.append(line)
            line = '--'
        line += ' ' + w
    head.append(line)
    head += [
        '--',
        f'-- Spec: docs/graded-field-audit/hd/quiz/{os.path.basename(spec["_path"])}; every figure from',
        f'-- {spec["figures"]} (the vendored engine).',
        '-- Generated by docs/graded-field-audit/hd_quiz.py. Applies AFTER the whole',
        '-- W2-W6 batch.',
        '--',
        '-- SLOTS (retire the published row, insert the re-cut at the same slot and',
        '-- answer_index):',
    ]
    for row, new in rows:
        head.append(f"--   {label(row)}: replaces {row['replaces']}")
    head += [
        '--',
        '-- REPLACEMENT. Each slot holds ONE active row. When that row carries its',
        '-- published content hash, md5(prompt | options | answer_index | explanation),',
        '-- it is RETIRED (active = false, text untouched) and the re-cut question is',
        '-- inserted at the same slot. A retired row keeps its id, so every stored',
        '-- attempt, open or submitted, still grades and reviews against the question',
        '-- it was served. Stored scores are never recomputed. When the active row',
        '-- already IS the re-cut question and the published row sits retired beside',
        '-- it, the slot is left alone. ANYTHING ELSE RAISES and the transaction rolls',
        '-- back (drift). Every touched quiz keeps its active count. SAFE TO RE-RUN.',
        '-- No capstone is touched.',
        '-- ============================================================================',
        '',
        'do $$',
        'declare',
        '  v_n        integer;',
        '  v_pub      integer;',
        '  v_new      integer;',
        '  v_written  integer := 0;',
        '  v_total    integer;',
        "  v_counts   jsonb := '{}'::jsonb;",
        'begin',
    ]
    body = []
    quizzes = sorted({(r['tier'], r['scope'], r['module_key']) for r, _ in rows}, key=lambda x: (x[0], x[1], x[2] or ''))
    for t, sc, mk in quizzes:
        mks = f"module_key = {q(mk)}" if mk else 'module_key is null'
        body.append(f"  select count(*) into v_total from public.academy_quiz_questions where app_slug = {q(course)} and tier = {q(t)} and scope = {q(sc)} and {mks} and active;")
        body.append(f"  v_counts := v_counts || jsonb_build_object({q(f'{t}/{sc}/{mk}')}, v_total);")
    for row, new in rows:
        where = where_of(course, row)
        opts = json.dumps(new['options'], ensure_ascii=False)
        newc = (f"prompt = {q(new['prompt'])} and options = {q(opts)}::jsonb"
                f" and answer_index = {new['answer_index']} and explanation = {q(new['explanation'])}")
        lab = label(row)
        mk = q(row['module_key']) if row['module_key'] else 'null'
        body += [
            '',
            f"  -- {lab}: replaces {row['replaces']}",
            f"  select count(*) filter (where active), count(*) filter (where active and {HASH_SQL} = '{row['replaces']}'),",
            f'         count(*) filter (where active and {newc})',
            '    into v_n, v_pub, v_new',
            f'    from public.academy_quiz_questions where {where};',
            f"  if v_n <> 1 then raise exception '{tag} refused: {lab} holds % active rows, expected 1', v_n; end if;",
            '  if v_pub = 1 then',
            f"    update public.academy_quiz_questions set active = false where {where} and active and {HASH_SQL} = '{row['replaces']}';",
            '    insert into public.academy_quiz_questions (app_slug, tier, scope, module_key, ord, prompt, options, answer_index, explanation, active)',
            f"    values ({q(course)}, {q(row['tier'])}, {q(row['scope'])}, {mk}, {row['ord']}, {q(new['prompt'])},",
            f"            {q(opts)}::jsonb, {new['answer_index']}, {q(new['explanation'])}, true);",
            '    v_written := v_written + 1;',
            '  elsif v_new = 1 then',
            f"    if not exists (select 1 from public.academy_quiz_questions where {where} and not active and {HASH_SQL} = '{row['replaces']}') then",
            f"      raise exception '{tag} refused: {lab} carries the re-cut question but its published row is not retired beside it';",
            '    end if;',
            '  else',
            f"    raise exception '{tag} refused: {lab} matches neither its published content hash nor its re-cut form (drift)';",
            '  end if;',
        ]
    body.append('')
    for t, sc, mk in quizzes:
        mks = f"module_key = {q(mk)}" if mk else 'module_key is null'
        k = f'{t}/{sc}/{mk}'
        body.append(f"  select count(*) into v_total from public.academy_quiz_questions where app_slug = {q(course)} and tier = {q(t)} and scope = {q(sc)} and {mks} and active;")
        body.append(f"  if v_total <> (v_counts->>{q(k)})::integer then raise exception '{tag} refused: {k} changed its active count to %', v_total; end if;")
    body += [
        f"  raise notice '{tag}: % of {len(rows)} slots written, the rest already carried the re-cut question', v_written;",
        'end $$;',
        '',
    ]
    return '\n'.join(head + body)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--container', default='hdd-scratch')
    ap.add_argument('--pin', action='store_true')
    ap.add_argument('--check', action='store_true')
    a = ap.parse_args()
    bad = 0
    for p in sorted(glob.glob(os.path.join(SPECS, 'quiz', '*.json'))):
        spec = json.load(open(p))
        spec['_path'] = p
        if spec.get('kind') != 'quiz':
            sys.exit(f'REFUSED: {p}: kind must be quiz')
        figs = figures(spec)
        rows = []
        for row in spec['rows']:
            if a.pin:
                live = live_row(a.container, spec['course'], row)
                row['replaces'] = live['h']
            else:
                # the published row by its pinned hash, active (before the file) or
                # retired beside the re-cut (after it)
                live = published_row(a.container, spec['course'], row)
            rows.append((row, recut(row, live, figs)))
        if a.pin:
            s = open(p).read()
            for row in spec['rows']:
                pat = (f'"module_key": {json.dumps(row["module_key"])}, "ord": {row["ord"]}, "replaces": ')
                i = s.index(pat) + len(pat)
                j = s.index(',', i)
                s = s[:i] + json.dumps(row['replaces']) + s[j:]
            open(p, 'w').write(s)
            print('pinned', os.path.relpath(p, REPO))
            continue
        sql = file_sql(spec, rows)
        out = os.path.join(MIG, spec['migration'])
        if a.check:
            same = os.path.exists(out) and open(out).read() == sql
            print('same' if same else 'DIFFERS', spec['migration'])
            bad += not same
        else:
            open(out, 'w').write(sql)
            print('wrote', spec['migration'], f'({len(rows)} slots)')
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
