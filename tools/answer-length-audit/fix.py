#!/usr/bin/env python3
"""B4 follow-on: question-content fixes over the POST-B4 served rows.

  fix.py show <course> <tier> <scope> <module_key|-> <ord> [--container C]
  fix.py validate <group> [--container C]
  fix.py sql <group> [--container C]            writes migrations/<file> named in the group
  fix.py report <group>                         markdown table of every item

A GROUP is tools/answer-length-audit/fixes/<group>.json:

  {"migration": "20261021b_b4_fix_cementing.sql",
   "title": "...one line...",
   "items": [
     {"app_slug": "cementing", "tier": "beginner", "scope": "final", "module_key": null, "ord": 22,
      "category": "double-key" | "defect" | "duplicate" | "tighten" | "other" | "number-options",
      "flag": "what the editor or the audit said about it",
      "verdict": "fixed" | "judged fine" | "owner decision",
      "reason": "one line",
      "changes": {"prompt": {"old": "...", "new": "..."},
                  "explanation": {"old": "...", "new": "..."},
                  "options": {"2": {"old": "...", "new": "..."}},
                  "answer_index": {"old": 3, "new": 3}},
      "correct_change_reason": "required when the correct option changes"}
   ],
   "inserts": [
     {"app_slug": "...", "tier": "...", "scope": "final", "module_key": null, "ord": 41,
      "prompt": "...", "options": ["...", "...", "...", "..."], "answer_index": 2,
      "explanation": "...", "reason": "tier parity"}
   ]}

`old` is always the text served NOW (post-B4, plus any earlier group already
applied in the container), so a stale edit is refused rather than applied.

RULES (a violation refuses the group):
  - a verdict of "fixed" needs changes; any other verdict must carry none;
  - the correct option may change only with correct_change_reason, and
    answer_index only with answer_index.reason;
  - no em or en dash, no NEW "X, not Y" contrastive, no internal-source wording;
  - a numeric token new to a field must be printed somewhere in that course's
    lesson content (src/content/courses/<course>), so no edit invents a figure
    or leaks a graded value that the course never shows;
  - the four options stay distinct, and on every changed or inserted question
    no distractor ties the correct option in length;
  - no two questions of a course share a prompt after the fix (normalised);
  - every bank of every touched course stays inside the answer-length band.

The migration guards each changed row by its full OLD tuple (md5 of prompt,
explanation and options, and answer_index): old -> updated, already new ->
left, anything else raises and rolls back. Inserts are guarded the same way
by (app_slug, tier, scope, module_key, ord). Course question counts are
asserted. Re-running writes nothing.
"""
import argparse, glob, hashlib, json, os, re, subprocess, sys
from collections import defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, HERE)
import audit  # noqa: E402

NUM = re.compile(r'\d+(?:[.,]\d+)*')
INTERNAL = [re.compile(r'digest', re.I), re.compile(r'\bSECTIONS? \d'), re.compile(r'\bgenerator\b', re.I)]
CONTRAST = re.compile(r',\s*not\b')
DASH = re.compile('[–—]')


def q(s):
    return "'" + s.replace("'", "''") + "'"


def md5(s):
    return hashlib.md5((s or '').encode('utf-8')).hexdigest()


def served(container, courses):
    lst = ','.join(q(c) for c in sorted(courses))
    sql = ("select coalesce(json_agg(json_build_object('app_slug',app_slug,'tier',tier,'scope',scope,"
           "'module_key',module_key,'ord',ord,'prompt',prompt,'options',options,'answer_index',answer_index,"
           "'explanation',explanation) order by app_slug,tier,scope,module_key,ord),'[]') from academy_quiz_questions "
           f"where active and app_slug in ({lst})")
    res = subprocess.run(['docker', 'exec', container, 'psql', '-U', 'postgres', '-tAc', sql],
                         capture_output=True, text=True, check=True)
    return json.loads(res.stdout)


def key(r):
    return (r['app_slug'], r['tier'], r['scope'], r.get('module_key') or '', int(r['ord']))


def label(k):
    return f"{k[0]} {k[1]} {k[2]} {k[3] or '-'} ord {k[4]}"


_lesson_cache = {}


def lesson_numbers(course):
    if course not in _lesson_cache:
        nums = set()
        for p in glob.glob(os.path.join(REPO, 'src', 'content', 'courses', course, '**', '*'), recursive=True):
            if os.path.isfile(p):
                nums |= set(NUM.findall(open(p, encoding='utf-8', errors='ignore').read()))
        _lesson_cache[course] = nums
    return _lesson_cache[course]


def norm(s):
    return re.sub(r'[^a-z0-9 ]', '', s.lower()).strip()


def load_group(g):
    return json.load(open(os.path.join(HERE, 'fixes', f'{g}.json')))


def text_checks(tag, old, new, course, errs):
    if new != new.strip() or '  ' in new:
        errs.append(f'{tag}: stray whitespace')
    if DASH.search(new):
        errs.append(f'{tag}: em or en dash')
    if CONTRAST.search(new) and not CONTRAST.search(old or ''):
        errs.append(f'{tag}: adds an "X, not Y" contrastive')
    if any(p.search(new) for p in INTERNAL):
        errs.append(f'{tag}: internal-source wording')
    extra = set(NUM.findall(new)) - set(NUM.findall(old or '')) - lesson_numbers(course)
    if extra:
        errs.append(f'{tag}: numeric token(s) {sorted(extra)} appear in neither the old text nor the course lessons')


def apply(rows, grp):
    idx = {key(r): r for r in rows}
    new = {k: dict(r, options=list(r['options'])) for k, r in idx.items()}
    errs, touched, seen = [], set(), set()
    for it in grp.get('items', []):
        k = key(it)
        tag = label(k)
        if k in seen:
            errs.append(f'{tag}: listed twice'); continue
        seen.add(k)
        if it.get('verdict') not in ('fixed', 'judged fine', 'owner decision'):
            errs.append(f'{tag}: verdict must be fixed / judged fine / owner decision')
        if not it.get('reason'):
            errs.append(f'{tag}: no reason')
        ch = it.get('changes') or {}
        if (it.get('verdict') == 'fixed') != bool(ch):
            errs.append(f'{tag}: a "fixed" verdict needs changes and any other verdict must carry none')
        r = idx.get(k)
        if r is None:
            errs.append(f'{tag}: no such served row'); continue
        if not ch:
            continue
        touched.add(k)
        n = new[k]
        course = k[0]
        a_old = r['answer_index']
        if 'answer_index' in ch:
            c = ch['answer_index']
            if c.get('old') != a_old:
                errs.append(f'{tag}: stale answer_index')
            if not c.get('reason'):
                errs.append(f'{tag}: answer_index moves without a reason')
            n['answer_index'] = c['new']
        for f in ('prompt', 'explanation'):
            if f in ch:
                c = ch[f]
                if (r[f] or '') != c['old']:
                    errs.append(f'{tag}: stale {f}'); continue
                if c['new'] == c['old']:
                    errs.append(f'{tag}: {f} unchanged')
                text_checks(f'{tag} {f}', c['old'], c['new'], course, errs)
                n[f] = c['new']
        for j, c in (ch.get('options') or {}).items():
            j = int(j)
            if r['options'][j] != c['old']:
                errs.append(f'{tag}: stale option {j}'); continue
            if c['new'] == c['old']:
                errs.append(f'{tag}: option {j} unchanged')
            if j == a_old and not it.get('correct_change_reason'):
                errs.append(f'{tag}: the CORRECT option changes without correct_change_reason')
            text_checks(f'{tag} option {j}', c['old'], c['new'], course, errs)
            n['options'][j] = c['new']
    for ins in grp.get('inserts', []):
        k = key(ins)
        tag = label(k) + ' (insert)'
        if k in new and not all(new[k][f] == ins[f] for f in ('prompt', 'options', 'answer_index', 'explanation')):
            errs.append(f'{tag}: that slot is already taken by a different question'); continue
        if len(ins['options']) != 4 or not (0 <= ins['answer_index'] < 4):
            errs.append(f'{tag}: needs four options and an answer_index in 0..3')
        for f in ('prompt', 'explanation'):
            text_checks(f'{tag} {f}', '', ins[f], k[0], errs)
        for j, o in enumerate(ins['options']):
            text_checks(f'{tag} option {j}', '', o, k[0], errs)
        new[k] = dict(app_slug=k[0], tier=k[1], scope=k[2], module_key=ins.get('module_key'), ord=k[4],
                      prompt=ins['prompt'], options=list(ins['options']), answer_index=ins['answer_index'],
                      explanation=ins['explanation'])
        touched.add(k)
    for k in touched:
        o, a = new[k]['options'], new[k]['answer_index']
        if len(set(o)) != len(o):
            errs.append(f'{label(k)}: duplicate option text')
        if any(len(o[j]) == len(o[a]) for j in range(len(o)) if j != a):
            errs.append(f'{label(k)}: a distractor ties the correct option in length')
    by = defaultdict(list)
    for k, r in new.items():
        by[(k[0], norm(r['prompt']))].append(k)
    for (c, _), ks in by.items():
        if len(ks) > 1 and any(k in touched for k in ks):
            errs.append(f'duplicate prompt after the fix: {", ".join(label(k) for k in ks)}')
    return idx, new, touched, errs


def courses_of(grp):
    return {i['app_slug'] for i in grp.get('items', [])} | {i['app_slug'] for i in grp.get('inserts', [])}


def validate(g, container, quiet=False):
    grp = load_group(g)
    cs = courses_of(grp)
    if not cs:
        print(f'REFUSED: group {g} names no questions'); sys.exit(2)
    rows = served(container, cs)
    if not rows:
        print(f'REFUSED: no served rows for {sorted(cs)}'); sys.exit(2)
    idx, new, touched, errs = apply(rows, grp)
    res = audit.audit(list(new.values()))
    failing = [b for b in res if not b['pass']]
    items = grp.get('items', [])
    tally = defaultdict(int)
    for i in items:
        tally[i.get('verdict')] += 1
    print(f"{g}: courses {','.join(sorted(cs))}; items {len(items)} "
          f"({', '.join(f'{v} {n}' for v, n in sorted(tally.items()))}); inserts {len(grp.get('inserts', []))}; "
          f"rows changed {len(touched)}; banks failing {len(failing)}; errors {len(errs)}")
    if not quiet:
        for x in errs: print('  ERROR', x)
        for b in failing: print(f"  OUT OF BAND {b['app_slug']} {b['tier']} {b['scope']} {b['module_key'] or '-'}: {b['fails']}")
    return grp, idx, new, touched, errs, failing


def sql(g, container):
    grp, idx, new, touched, errs, failing = validate(g, container, quiet=True)
    if errs or failing:
        print('REFUSED: the group does not validate; run `validate` for the list'); sys.exit(2)
    cs = sorted(courses_of(grp))
    counts = defaultdict(int)
    for k in idx:
        counts[k[0]] += 1
    ins_keys = {key(i) for i in grp.get('inserts', [])}
    tag = f'B4 fix {g}'
    L = [
        '-- ==========================================================================',
        f'-- B4 FOLLOW-ON FIX ({g}): {grp.get("title", "")}',
        '--',
        f'-- Courses: {", ".join(cs)}. Rows changed: {len(touched - ins_keys)}; rows inserted: {len(ins_keys)}.',
        f'-- Source: tools/answer-length-audit/fixes/{g}.json (every item, its verdict and',
        '-- its reason, old and new text side by side); generated by',
        f'-- tools/answer-length-audit/fix.py sql {g}. Runs AFTER the 29 B4 length files',
        '-- and any earlier fix file: every guard below is the text those leave behind.',
        '--',
        '-- GUARDS. Each changed row must match its OLD prompt, explanation and options',
        '-- (md5) and answer_index exactly (then it is updated) or its NEW ones (already',
        '-- applied, left alone). Anything else raises and the transaction rolls back.',
        '-- Each insert must be absent (inserted) or present with the same text (left).',
        '-- Each course ends at its asserted question count. SAFE TO RE-RUN.',
        '-- ==========================================================================',
        '',
        'do $$',
        'declare',
        '  v_state   text;',
        '  v_count   integer;',
        '  v_updated integer := 0;',
        '  v_total   integer;',
        'begin',
    ]
    for k in sorted(touched - ins_keys):
        o, n = idx[k], new[k]
        where = (f"app_slug = {q(k[0])} and tier = {q(k[1])} and scope = {q(k[2])} and module_key is not distinct from "
                 f"{q(k[3]) if k[3] else 'null'} and ord = {k[4]} and active")
        lab = label(k)
        def cond(r):
            return (f"md5(prompt) = '{md5(r['prompt'])}' and md5(coalesce(explanation, '')) = '{md5(r.get('explanation'))}'"
                    f" and md5(options::text) = md5({q(json.dumps(r['options'], ensure_ascii=False))}::jsonb::text)"
                    f" and answer_index = {r['answer_index']}")
        L += [
            '',
            f'  -- {lab}',
            f"  select case when {cond(o)} then 'old'",
            f"              when {cond(n)} then 'new'",
            "              else 'other' end",
            '    into v_state',
            f'    from public.academy_quiz_questions where {where};',
            f"  if v_state is null then raise exception '{tag} refused: no row for {lab}'; end if;",
            f"  if v_state = 'other' then raise exception '{tag} refused: {lab} matches neither its current nor its fixed form'; end if;",
            "  if v_state = 'old' then",
            f"    update public.academy_quiz_questions set prompt = {q(n['prompt'])}, options = {q(json.dumps(n['options'], ensure_ascii=False))}::jsonb,",
            f"           answer_index = {n['answer_index']}, explanation = {q(n.get('explanation') or '')}",
            f'     where {where};',
            '    get diagnostics v_count = row_count;',
            f"    if v_count <> 1 then raise exception '{tag} refused: {lab} updated % rows', v_count; end if;",
            '    v_updated := v_updated + 1;',
            '  end if;',
        ]
    for k in sorted(ins_keys):
        n = new[k]
        where = (f"app_slug = {q(k[0])} and tier = {q(k[1])} and scope = {q(k[2])} and module_key is not distinct from "
                 f"{q(k[3]) if k[3] else 'null'} and ord = {k[4]}")
        lab = label(k)
        L += [
            '',
            f'  -- INSERT {lab}',
            "  select case when count(*) = 0 then 'absent'",
            f"              when count(*) = 1 and bool_and(prompt = {q(n['prompt'])} and options = {q(json.dumps(n['options'], ensure_ascii=False))}::jsonb"
            f" and answer_index = {n['answer_index']} and explanation = {q(n['explanation'])} and active) then 'new'",
            "              else 'other' end",
            '    into v_state',
            f'    from public.academy_quiz_questions where {where};',
            f"  if v_state = 'other' then raise exception '{tag} refused: slot {lab} holds a different question'; end if;",
            "  if v_state = 'absent' then",
            '    insert into public.academy_quiz_questions (app_slug, tier, scope, module_key, ord, prompt, options, answer_index, explanation, active)',
            f"    values ({q(k[0])}, {q(k[1])}, {q(k[2])}, {q(k[3]) if k[3] else 'null'}, {k[4]}, {q(n['prompt'])},",
            f"            {q(json.dumps(n['options'], ensure_ascii=False))}::jsonb, {n['answer_index']}, {q(n['explanation'])}, true);",
            '    v_updated := v_updated + 1;',
            '  end if;',
        ]
    L.append('')
    for c in cs:
        want = counts[c] + sum(1 for k in ins_keys if k[0] == c)
        L += [f"  select count(*) into v_total from public.academy_quiz_questions where app_slug = {q(c)} and active;",
              f"  if v_total <> {want} then raise exception '{tag} refused: {c} holds % active questions, expected {want}', v_total; end if;"]
    L += [f"  raise notice '{tag}: % of {len(touched)} rows written, the rest already carried the fixed text', v_updated;",
          'end $$;', '']
    out = os.path.join(REPO, 'migrations', grp['migration'])
    open(out, 'w').write('\n'.join(L))
    print(f'wrote {out} ({len(touched)} rows)')


def show(a):
    rows = served(a.container, {a.course})
    mk = '' if a.module_key == '-' else a.module_key
    for r in rows:
        if (r['tier'], r['scope'], r['module_key'] or '', int(r['ord'])) == (a.tier, a.scope, mk, int(a.ord)):
            print(json.dumps(r, indent=1, ensure_ascii=False))
            for j, o in enumerate(r['options']):
                print(f"{'*' if j == r['answer_index'] else ' '}{j} [{len(o)}] {o}")
            return
    print('no such row'); sys.exit(1)


def report(g):
    grp = load_group(g)
    print('| Course | Question | Category | Verdict | Reason |')
    print('|---|---|---|---|---|')
    for i in grp.get('items', []):
        k = key(i)
        print(f"| {k[0]} | {k[1]} {k[2]} {k[3] or ''} ord {k[4]} | {i.get('category')} | {i.get('verdict')} | {i.get('reason')} |")
    for i in grp.get('inserts', []):
        k = key(i)
        print(f"| {k[0]} | {k[1]} {k[2]} {k[3] or ''} ord {k[4]} | insert | fixed | {i.get('reason')} |")


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest='cmd', required=True)
    for c in ('validate', 'sql', 'report'):
        p = sub.add_parser(c); p.add_argument('group'); p.add_argument('--container', default='b4-post')
    p = sub.add_parser('show')
    for x in ('course', 'tier', 'scope', 'module_key', 'ord'):
        p.add_argument(x)
    p.add_argument('--container', default='b4-post')
    a = ap.parse_args()
    if a.cmd == 'validate':
        _, _, _, _, errs, failing = validate(a.group, a.container)
        sys.exit(1 if errs or failing else 0)
    if a.cmd == 'sql':
        sql(a.group, a.container)
    if a.cmd == 'report':
        report(a.group)
    if a.cmd == 'show':
        show(a)


if __name__ == '__main__':
    main()
