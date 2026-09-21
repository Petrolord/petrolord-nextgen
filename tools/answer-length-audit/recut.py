#!/usr/bin/env python3
"""B4 answer-length recut: validate a course's distractor edits, emit its migration.

  recut.py validate <course> --container C      check the edits, re-audit the course
  recut.py sql <course> --container C           write migrations/20261020_b4_len_<course>.sql
  recut.py worksheet <course> --container C     print the planner's moves to edit from

EDITS live in tools/answer-length-audit/edits/<course>.json, one object per
changed option: {tier, scope, module_key, ord, option, old, new}. `old` is the
served text, carried so a stale edit is refused rather than silently applied.

RULES, every one enforced here (a violation refuses the whole course):
  - only DISTRACTORS change: the correct option, answer_index, option order,
    prompt and explanation are never touched;
  - no NEW numeric token: every number in `new` already appears in that
    option's old text, so no edit can introduce a figure the course never
    printed or leak another tier's graded value;
  - no em or en dash, and no "digest" (owner copy rules);
  - the four options stay distinct;
  - no tie with the correct option (the kit's stable sort would place it by
    option order);
  - every one of the course's banks lands inside the band afterwards.
A shortening that drops text the question's explanation quotes is reported as
a WARNING for the reviewer (the explanation is never edited).

The source rows are the SERVED rows, read from a local scratch postgres that
replays main (never production).
"""
import argparse, hashlib, json, os, re, subprocess, sys
from collections import defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, HERE)
import audit, plan  # noqa: E402

NUM = re.compile(r'\d+(?:[.,]\d+)*')


def served(container, course):
    sql = ("select coalesce(json_agg(json_build_object('app_slug',app_slug,'tier',tier,'scope',scope,"
           "'module_key',module_key,'ord',ord,'prompt',prompt,'options',options,'answer_index',answer_index,"
           "'explanation',explanation) order by tier,scope,module_key,ord),'[]') from academy_quiz_questions "
           f"where active and app_slug = '{course}'")
    res = subprocess.run(['docker', 'exec', container, 'psql', '-U', 'postgres', '-tAc', sql],
                         capture_output=True, text=True, check=True)
    return json.loads(res.stdout)


def key(r):
    return (r['tier'], r['scope'], r['module_key'] or '', int(r['ord']))


def load_edits(course):
    p = os.path.join(HERE, 'edits', f'{course}.json')
    return json.load(open(p)) if os.path.exists(p) else []


def apply(rows, edits):
    """Return (new rows, errors, warnings)."""
    idx = {key(r): r for r in rows}
    new = {k: dict(r, options=list(r['options'])) for k, r in idx.items()}
    errs, warns, seen = [], [], set()
    for e in edits:
        k = key(e)
        tag = f"{k[0]} {k[1]} {k[2] or '-'} ord {k[3]} option {e['option']}"
        if (k, e['option']) in seen:
            errs.append(f'{tag}: edited twice'); continue
        seen.add((k, e['option']))
        r = idx.get(k)
        if r is None:
            errs.append(f'{tag}: no such served row'); continue
        j = e['option']
        if j == r['answer_index']:
            errs.append(f'{tag}: that is the CORRECT option; it may not be edited'); continue
        if r['options'][j] != e['old']:
            errs.append(f'{tag}: stale edit, the served text is not `old`'); continue
        t = e['new']
        if t == e['old']:
            errs.append(f'{tag}: no change'); continue
        if t != t.strip() or '  ' in t:
            errs.append(f'{tag}: stray whitespace')
        if re.search('[–—]', t):
            errs.append(f'{tag}: em or en dash')
        if re.search(r'digest', t, re.I):
            errs.append(f'{tag}: names the digest')
        extra = set(NUM.findall(t)) - set(NUM.findall(e['old']))
        if extra:
            errs.append(f'{tag}: new numeric token(s) {sorted(extra)}')
        new[k]['options'][j] = t
        if len(t) < len(e['old']):
            expl = r.get('explanation') or ''
            lost = [w for w in re.findall(r'[A-Za-z][A-Za-z\-]{5,}', e['old']) if w not in t]
            quoted = [w for w in lost if w in expl]
            if len(quoted) >= 3:
                warns.append(f'{tag}: shortening drops words the explanation uses: {", ".join(quoted[:6])}')
    for k, r in new.items():
        o = r['options']
        if len(set(o)) != 4:
            errs.append(f'{k}: duplicate option text after edit')
        a = r['answer_index']
        if sum(1 for j in range(4) if j != a and len(o[j]) == len(o[a])):
            if any(new[k]['options'][j] != idx[k]['options'][j] for j in range(4)):
                errs.append(f'{k}: an edited option ties the correct option in length')
    return list(new.values()), errs, warns


def validate(course, container, quiet=False):
    rows = served(container, course)
    if not rows:
        print(f'REFUSED: no served rows for {course}'); sys.exit(2)
    edits = load_edits(course)
    new, errs, warns = apply(rows, edits)
    res = audit.audit(new)
    failing = [b for b in res if not b['pass']]
    before = audit.audit(rows)
    rn0 = sum(b['read_nothing'] * b['n'] for b in before) / sum(b['n'] for b in before)
    rn1 = sum(b['read_nothing'] * b['n'] for b in res) / sum(b['n'] for b in res)
    changed = sum(1 for a, b in zip(sorted(rows, key=key), sorted(new, key=key)) if a['options'] != b['options'])
    print(f'{course}: {len(rows)} rows, {len(edits)} option edits over {changed} questions; '
          f'banks failing {sum(1 for b in before if not b["pass"])} -> {len(failing)}; '
          f'read-nothing {rn0:.3f} -> {rn1:.3f}; errors {len(errs)}; warnings {len(warns)}')
    if not quiet:
        for x in errs: print('  ERROR', x)
        for x in warns: print('  WARN ', x)
        for b in failing: print(f"  STILL FAILING {b['tier']} {b['scope']} {b['module_key'] or '-'}: {b['fails']}")
    return rows, new, edits, errs, failing


def q(s):
    return "'" + s.replace("'", "''") + "'"


def md5(s):
    return hashlib.md5((s or '').encode('utf-8')).hexdigest()


def sql(course, container):
    rows, new, edits, errs, failing = validate(course, container, quiet=True)
    if errs or failing:
        print('REFUSED: the course does not validate; run `validate` for the list'); sys.exit(2)
    idx = {key(r): r for r in rows}
    total = len(rows)
    touched = sorted({key(e) for e in edits})
    nw = {key(r): r for r in new}
    tag = f'answer-length recut, {course}'
    L = [
        '-- ==========================================================================',
        f'-- ANSWER-LENGTH RECUT (B4): {course}, distractor text only.',
        '--',
        '-- WHY. A learner who never reads a question could pass this course by always',
        '-- choosing the option at one length rank. Each row below lengthens or trims',
        '-- DISTRACTORS so the correct option sits at every length rank in a fair',
        '-- share (bankkit band: each rank 12 to 40 percent of a bank). The correct',
        '-- option, answer_index, option order, prompt and explanation never change,',
        '-- and no edit adds a number the option did not already carry.',
        f'-- Rows: {len(touched)} of the course\'s {total}.',
        '-- Source: tools/answer-length-audit/edits/' + course + '.json over the served rows;',
        '-- generated by tools/answer-length-audit/recut.py sql ' + course + '.',
        '--',
        '-- GUARDS. Each row is addressed by (app_slug, tier, scope, module_key, ord). Its',
        '-- prompt and explanation must match by md5 and its answer_index exactly, and its',
        '-- options must equal EITHER the published list (then it is updated) OR the recut',
        '-- list (already applied, left alone). Anything else raises and the whole',
        '-- transaction rolls back. Every update touches exactly 1 row and the course keeps',
        f'-- its {total} questions. SAFE TO RE-RUN.',
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
    for k in touched:
        o, n = idx[k], nw[k]
        where = (f"app_slug = {q(course)} and tier = {q(k[0])} and scope = {q(k[1])} and module_key is not distinct from "
                 f"{q(k[2]) if k[2] else 'null'} and ord = {k[3]}")
        label = f"{k[0]} {k[1]} {k[2] or ''} ord {k[3]}".replace('  ', ' ')
        oj = json.dumps(o['options'], ensure_ascii=False)
        nj = json.dumps(n['options'], ensure_ascii=False)
        L += [
            '',
            f'  -- {label}',
            '  select case',
            f"           when md5(prompt) <> '{md5(o['prompt'])}' or md5(coalesce(explanation, '')) <> '{md5(o.get('explanation'))}'"
            f" or answer_index <> {o['answer_index']} then 'other'",
            f'           when options = {q(oj)}::jsonb then \'old\'',
            f'           when options = {q(nj)}::jsonb then \'new\'',
            "           else 'other' end",
            '    into v_state',
            f'    from public.academy_quiz_questions where {where};',
            f"  if v_state is null then raise exception '{tag} refused: no row for {label}'; end if;",
            f"  if v_state = 'other' then raise exception '{tag} refused: {label} matches neither its published nor its recut form'; end if;",
            "  if v_state = 'old' then",
            f'    update public.academy_quiz_questions set options = {q(nj)}::jsonb',
            f'     where {where};',
            '    get diagnostics v_count = row_count;',
            f"    if v_count <> 1 then raise exception '{tag} refused: {label} updated % rows', v_count; end if;",
            '    v_updated := v_updated + 1;',
            '  end if;',
        ]
    L += [
        '',
        f"  select count(*) into v_total from public.academy_quiz_questions where app_slug = {q(course)};",
        f"  if v_total <> {total} then raise exception '{tag} refused: the course holds % questions, expected {total}', v_total; end if;",
        f"  raise notice '{tag}: % of {len(touched)} rows updated, the rest already carried the recut text', v_updated;",
        'end $$;',
        '',
    ]
    out = os.path.join(REPO, 'migrations', f'20261020_b4_len_{course}.sql')
    open(out, 'w').write('\n'.join(L))
    print(f'wrote {out} ({len(touched)} rows)')


def worksheet(course, container):
    rows = served(container, course)
    idx = {key(r): r for r in rows}
    banks = defaultdict(list)
    for r in rows:
        banks[(r['tier'], r['scope'], r['module_key'] or '')].append(r)
    done = {(key(e), e['option']) for e in load_edits(course)}
    for bk in sorted(banks):
        p = plan.plan_bank(sorted(banks[bk], key=lambda x: x['ord']))
        if not p:
            continue
        print(f"### {bk[0]} {bk[1]} {bk[2] or '-'}  n={p['n']} current {p['current']} target {p['target']}")
        for m in p['moves']:
            r = idx[(bk[0], bk[1], bk[2], m['ord'])]
            todo = [e for e in m['edits'] if ((bk[0], bk[1], bk[2], m['ord']), e['option']) not in done]
            if not todo:
                continue
            print(f"@ {bk[0]}|{bk[1]}|{bk[2]}|{m['ord']}  rank {m['current']}->{m['target']}")
            print(f"Q {r['prompt']}")
            for j, o in enumerate(r['options']):
                print(f"{'*' if j == r['answer_index'] else ' '}{j} [{len(o)}] {o}")
            for e in todo:
                lim = e.get('need_len_at_least') or e.get('need_len_at_most')
                print(f"  -> {e['direction']} {e['option']} to {'>=' if e['direction'] == 'lengthen' else '<='}{lim}")
            if r.get('explanation'):
                print(f"E {r['explanation']}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('cmd', choices=['validate', 'sql', 'worksheet'])
    ap.add_argument('course')
    ap.add_argument('--container', default='b4-scratch')
    a = ap.parse_args()
    if a.cmd == 'validate':
        _, _, _, errs, failing = validate(a.course, a.container)
        sys.exit(1 if errs or failing else 0)
    if a.cmd == 'sql':
        sql(a.course, a.container)
    if a.cmd == 'worksheet':
        worksheet(a.course, a.container)


if __name__ == '__main__':
    main()
