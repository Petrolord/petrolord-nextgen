#!/usr/bin/env python3
"""THE B3 RECUT GENERATOR: engines #232 (petrolord-engines e972ae7) in five LIVE courses.

For each LIVE course and tier it builds the question rows twice, exactly as the
kit's gen_migration.py writes them:

  OLD  from the banks and manifest at OLD_REF (origin/main before this PR),
       and PROVES they are the rows the APPLIED deep seed wrote: the 132
       generated VALUES lines must be, byte for byte, the VALUES block of
       migrations/<date>_<prefix>_<slug>_<tier>_deep.sql, which this PR does
       not touch (it is applied, and never edited);
  NEW  from the banks and manifest at NEW_REF (this branch, committed).

It then keys every row by its stable identity (app_slug, tier, scope,
module_key, ord), REFUSES any row whose answer index, option count or ord moved
(this recut is TEXT ONLY), reports any row whose keyed option changed its
LENGTH RANK among the four (reported, never retuned), and writes:

  docs/b3-engine-strings-recut/RECUT-<slug>.json   every OLD and NEW field
  migrations/20261015_b3_recut_<slug>_<tier>.sql   one per tier that moves

Usage: gen_recut.py [--check]     --check writes nothing and fails on drift
  OLD_REF (default origin/main) and NEW_REF (default HEAD) from the environment.
"""
import json
import os
import subprocess
import sys

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
OLD_REF = os.environ.get('OLD_REF', 'origin/main')
NEW_REF = os.environ.get('NEW_REF', 'HEAD')
CHECK = '--check' in sys.argv
DATE = '20261015'
OUT_DOCS = os.path.join(REPO, 'docs', 'b3-engine-strings-recut')
TIERS = ['beginner', 'intermediate', 'advanced']
LETTER = {'beginner': 'b', 'intermediate': 'i', 'advanced': 'a'}

COURSES = [
    # slug, bank prefix, applied deep-seed stem, course name
    ('crude', 'cr', '20261010_cr_crude', 'Crude Assay & Blending'),
    ('refinery', 'rf', '20261011_rf_refinery', 'Refinery Feasibility & Planning'),
    ('supply', 'tds', '20261012_tds_supply', 'Terminals, Depots & Fuel Supply'),
    ('gasvalue', 'gv', '20261013_gv_gasvalue', 'Flare Gas to Value & LPG/CNG'),
    ('carbon', 'cef', '20261014_cef_carbon', 'Carbon & Energy Efficiency'),
]


def git_show(ref, path):
    return subprocess.run(['git', '-C', REPO, 'show', f'{ref}:{path}'], check=True,
                          capture_output=True).stdout.decode('utf-8')


def rev(ref):
    return subprocess.run(['git', '-C', REPO, 'rev-parse', '--short=9', ref], check=True,
                          capture_output=True, text=True).stdout.strip()


def q(s):
    return "'" + s.replace("'", "''") + "'"


def rows_at(ref, slug, prefix, tier):
    man = json.loads(git_show(ref, f'src/content/courses/{slug}/{tier}/manifest.json'))
    mods = [m['key'] for m in sorted(man['modules'], key=lambda m: m['order'])]
    out = []
    for mk in mods:
        bank = json.loads(git_show(ref, f'tools/course-banks/{slug}/{tier}/{prefix}{LETTER[tier]}_{mk.split("-")[0]}.json'))
        assert len(bank) == 15, (slug, tier, mk, len(bank))
        out += [('module', mk, i, it) for i, it in enumerate(bank, 1)]
    exam = json.loads(git_show(ref, f'tools/course-banks/{slug}/{tier}/{prefix}{LETTER[tier]}_exam.json'))
    assert len(exam) == 42, (slug, tier, len(exam))
    out += [('final', None, i, it) for i, it in enumerate(exam, 1)]
    assert len(out) == 132
    return out


def values_line(slug, tier, scope, mk, ord_, it):
    opts = json.dumps(it['options'], ensure_ascii=False)
    return (f"  ({q(slug)}, {q(tier)}, {q(scope)}, "
            f"{q(mk) if mk else 'null'}, {ord_}, {q(it['prompt'])}, "
            f"{q(opts)}::jsonb, {it['answer']}, {q(it['explanation'])})")


def rank(opts, ans):
    order = sorted(range(4), key=lambda j: -len(opts[j]))
    return order.index(ans)


def sql_guard(slug, tier, scope, mk, ord_):
    mkx = f"{q(mk)}::text" if mk else 'null::text'
    return (f"app_slug = {q(slug)} and tier = {q(tier)} and scope = {q(scope)} "
            f"and module_key is not distinct from {mkx} and ord = {ord_}")


def fields_sql(it):
    return (f"prompt = {q(it['prompt'])} and options = {q(json.dumps(it['options'], ensure_ascii=False))}::jsonb "
            f"and answer_index = {it['answer']} and explanation = {q(it['explanation'])}")


def set_sql(it):
    return (f"prompt = {q(it['prompt'])}, options = {q(json.dumps(it['options'], ensure_ascii=False))}::jsonb, "
            f"answer_index = {it['answer']}, explanation = {q(it['explanation'])}")


def migration(slug, name, tier, stem, changes, old_sha, new_sha):
    label = f'B3 recut {slug} {tier}'
    n = len(changes)
    fld = {}
    for c in changes:
        for f in c['fields']:
            fld[f] = fld.get(f, 0) + 1
    keyed = sum(1 for c in changes if c['keyed_answer_text_changed'])
    lines = [
        '-- ==========================================================================',
        f'-- B3 RECUT, {tier.upper()} TIER: {name} ({slug})',
        '-- question text brought to petrolord-engines e972ae7 (engines PR #232).',
        '--',
        '-- WHY. Engines #232 recasts engine sentences that broke the owner copy rule',
        '-- (contrastives such as "X, not Y" and "rather than") and gives the queue',
        '-- its facility vocabularies (a CNG forecourt now speaks of dispensers). It',
        '-- moves no value. This LIVE bank quoted the old sentences verbatim, so the',
        '-- quotes are brought to the engine\'s words. Text only.',
        '--',
        f'-- WHAT MOVES. {n} of the 132 questions of this tier, {keyed} with a changed keyed',
        '-- answer TEXT and 0 with a changed answer INDEX. No ord, no module key, no',
        '-- scope, no option order and no row count moves, so every question id and',
        '-- every learner attempt against it survives.',
        '-- Fields rewritten: ' + ', '.join(f'{v} {k}' for k, v in sorted(fld.items())) + '.',
        '-- Rows (scope, module_key, ord):',
    ]
    for c in changes:
        lines.append(f"--   {c['scope']} {c['module_key'] or '-'} ord {c['ord']}: {', '.join(c['fields'])}")
    lines += [
        '--',
        '-- GUARDS. Each row is addressed by its stable identity (app_slug, tier, scope,',
        '-- module_key, ord) and must match EITHER its published text exactly, in which',
        '-- case it is updated, OR the recut text exactly, in which case it is already',
        '-- applied and left alone. Anything else raises and the transaction rolls back.',
        '-- Every update asserts it touched exactly 1 row, and the tier must still hold',
        '-- 132 questions at the end.',
        '--',
        f'-- The published strings are the rows migrations/{stem}_{tier}_deep.sql wrote',
        f'-- (APPLIED 2026-09-19), regenerated byte for byte from the banks at {old_sha}.',
        f'-- The recut strings are the banks at {new_sha}. Written by',
        '-- docs/b3-engine-strings-recut/gen_recut.py; see RECUT-' + slug + '.json.',
        '--',
        '-- SAFE TO RE-RUN. A second run finds every row already carrying the recut',
        '-- text and updates nothing.',
        '-- ==========================================================================',
        '',
        'do $$',
        'declare',
        '  v_state   text;',
        '  v_count   integer;',
        '  v_updated integer := 0;',
        'begin',
    ]
    for c in changes:
        g = sql_guard(slug, tier, c['scope'], c['module_key'], c['ord'])
        where = f"{c['scope']} {c['module_key'] or 'final'} ord {c['ord']}"
        lines += [
            '',
            f"  -- {where}: {', '.join(c['fields'])}{' KEYED ANSWER TEXT CHANGED' if c['keyed_answer_text_changed'] else ''}",
            '  select case',
            f"           when {fields_sql(c['_old'])} then 'old'",
            f"           when {fields_sql(c['_new'])} then 'new'",
            "           else 'other' end",
            '    into v_state',
            f'    from public.academy_quiz_questions where {g};',
            f"  if v_state is null then raise exception '{label} refused: no row for {where}'; end if;",
            f"  if v_state = 'other' then raise exception '{label} refused: {where} matches neither its published nor its recut text'; end if;",
            "  if v_state = 'old' then",
            '    update public.academy_quiz_questions',
            f"       set {set_sql(c['_new'])}",
            f'     where {g};',
            '    get diagnostics v_count = row_count;',
            f"    if v_count <> 1 then raise exception '{label} refused: {where} updated % rows', v_count; end if;",
            '    v_updated := v_updated + 1;',
            '  end if;',
        ]
    lines += [
        '',
        f"  select count(*) into v_count from public.academy_quiz_questions where app_slug = {q(slug)} and tier = {q(tier)};",
        f"  if v_count <> 132 then raise exception '{label} refused: {slug} {tier} holds % questions, expected 132', v_count; end if;",
        f"  raise notice '{label}: % of {n} rows updated, % already recut', v_updated, {n} - v_updated;",
        'end',
        '$$;',
        '',
    ]
    return '\n'.join(lines)


def main():
    old_sha, new_sha = rev(OLD_REF), rev(NEW_REF)
    drift = []
    summary = []
    for slug, prefix, stem, name in COURSES:
        doc = {
            'course': f'{name} ({slug})',
            'slug': slug,
            'engines': 'petrolord-engines e972ae7 (engines PR #232, the copy pass and the queue vocabularies)',
            'old_ref': old_sha,
            'new_ref': new_sha,
            'method': (f'OLD is the row the APPLIED deep seed migrations/{stem}_<tier>_deep.sql wrote: the generator '
                       f'rebuilds the 132 VALUES lines from the banks at {old_sha} and requires them to be that file\'s '
                       'VALUES block byte for byte. NEW is what the same generator writes from the banks at '
                       f'{new_sha}. No production access: OLD was not compared with a dump of the live rows; each '
                       'migration refuses a row matching neither OLD nor NEW, and the owner-run rolled-back dry run '
                       'is that comparison.'),
            'tiers': {},
        }
        for tier in TIERS:
            applied = f'migrations/{stem}_{tier}_deep.sql'
            applied_old = git_show(OLD_REF, applied)
            if git_show(NEW_REF, applied) != applied_old:
                sys.exit(f'REFUSED: {applied} differs between {OLD_REF} and {NEW_REF}; an applied migration was edited')
            old = rows_at(OLD_REF, slug, prefix, tier)
            new = rows_at(NEW_REF, slug, prefix, tier)
            block = ',\n'.join(values_line(slug, tier, *r) for r in old) + ';'
            if ('\nvalues\n' + block + '\n') not in applied_old:
                sys.exit(f'REFUSED: the OLD rows built from {OLD_REF} are not the VALUES block of {applied}')
            changes = []
            for (s0, m0, o0, a), (s1, m1, o1, b) in zip(old, new):
                assert (s0, m0, o0) == (s1, m1, o1)
                if a == b:
                    continue
                if a['answer'] != b['answer'] or len(a['options']) != len(b['options']):
                    sys.exit(f'REFUSED: {slug} {tier} {s0} {m0} {o0} moves its answer index or option count')
                fields = [f for f in ('prompt', 'options', 'explanation') if a[f] != b[f]]
                ra, rb = rank(a['options'], a['answer']), rank(b['options'], b['answer'])
                changes.append({
                    'scope': s0, 'module_key': m0, 'ord': o0, 'fields': fields,
                    'keyed_answer_text_changed': a['options'][a['answer']] != b['options'][b['answer']],
                    'answer_index_old': a['answer'], 'answer_index_new': b['answer'],
                    'keyed_length_rank_old': ra, 'keyed_length_rank_new': rb,
                    'length_rank_moved': ra != rb,
                    'old': {'prompt': a['prompt'], 'options': a['options'], 'explanation': a['explanation']},
                    'new': {'prompt': b['prompt'], 'options': b['options'], 'explanation': b['explanation']},
                    '_old': a, '_new': b,
                })
            out = os.path.join(REPO, 'migrations', f'{DATE}_b3_recut_{slug}_{tier}.sql')
            if changes:
                text = migration(slug, name, tier, stem, changes, old_sha, new_sha)
                if CHECK:
                    if not os.path.exists(out) or open(out, encoding='utf-8').read() != text:
                        drift.append(out)
                else:
                    open(out, 'w', encoding='utf-8').write(text)
            elif os.path.exists(out):
                drift.append(f'{out} exists but {slug} {tier} moves no row')
            doc['tiers'][tier] = [{k: v for k, v in c.items() if not k.startswith('_')} for c in changes]
            summary.append((slug, tier, len(changes), sum(len(c['fields']) for c in changes),
                            sum(c['keyed_answer_text_changed'] for c in changes),
                            [f"{c['scope']} {c['module_key'] or '-'} ord {c['ord']}" for c in changes if c['length_rank_moved']]))
        jpath = os.path.join(OUT_DOCS, f'RECUT-{slug}.json')
        jtext = json.dumps(doc, indent=1, ensure_ascii=False) + '\n'
        if CHECK:
            if not os.path.exists(jpath) or open(jpath, encoding='utf-8').read() != jtext:
                drift.append(jpath)
        else:
            open(jpath, 'w', encoding='utf-8').write(jtext)
    for s in summary:
        print(f'  {s[0]:9s} {s[1]:12s} rows {s[2]:2d}  field edits {s[3]:2d}  keyed text changed {s[4]}  length rank moved: {s[5] or "none"}')
    if drift:
        print('DRIFT:\n  ' + '\n  '.join(drift))
        sys.exit(1)
    print('check: every recut file is what the generator writes' if CHECK else 'written')


main()
