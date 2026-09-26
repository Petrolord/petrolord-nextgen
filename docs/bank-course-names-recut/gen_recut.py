#!/usr/bin/env python3
"""BANK COURSE-NAMES RECUT: question text brought to the 2026-09-26 names.

Owner decisions 2026-09-26: a course is named for its skill (Seismic
Interpretation, Reservoir Volumetrics, Well Data Management, Subsurface
Mapping), and the academy modules are relabelled (economics is Economics &
Commercial). The LIVE question banks still name the old COURSES and the old
MODULE in 21 rows across five courses. Suite app names stay where the text
means the app.

Inputs:
  served.json  the SERVED rows of the five courses, read from a local scratch
               Postgres that replays every migration writing their banks
               (tools/catalog-titles/scratch_bank_names.sh --dump writes it;
               never production);
  edits.json   one object per substring edit: {app_slug, tier, scope,
               module_key, ord, field (prompt|explanation|option), option
               ('key' or an index, for field=option), old, new}. `old` must
               occur exactly once in the served text.

It REFUSES any edit whose old text is not found exactly once, any change to
answer_index or option order, and for the two courses with committed bank
sources (hygiene, refinery) it requires every committed bank to equal the
recut rows byte for byte. It writes:

  docs/bank-course-names-recut/RECUT.json            every OLD and NEW row
  migrations/20261105_catalog_bank_course_names.sql  the guarded migration

Usage: gen_recut.py <served.json> [--check]   (--check writes nothing, fails on drift)
"""
import json, os, sys, collections

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
MIG = os.path.join(REPO, 'migrations', '20261105_catalog_bank_course_names.sql')
OUT = os.path.join(HERE, 'RECUT.json')
LETTER = {'beginner': 'b', 'intermediate': 'i', 'advanced': 'a'}
BANK_PREFIX = {'hygiene': 'h2', 'refinery': 'rf'}
COUNT = 396


def q(s):
    return "'" + s.replace("'", "''") + "'"


def key(r):
    return (r['app_slug'], r['tier'], r['scope'], r['module_key'], int(r['ord']))


def where(k):
    slug, tier, scope, mk, o = k
    mkx = f"{q(mk)}::text" if mk else 'null::text'
    return (f"app_slug = {q(slug)} and tier = {q(tier)} and scope = {q(scope)} "
            f"and module_key is not distinct from {mkx} and ord = {o} and active")


def opts(r):
    return q(json.dumps(r['options'], ensure_ascii=False)) + '::jsonb'


def match(r):
    return (f"prompt = {q(r['prompt'])} and options = {opts(r)} and answer_index = {r['answer_index']} "
            f"and explanation is not distinct from {q(r['explanation'])}")


def label(k):
    slug, tier, scope, mk, o = k
    return f"{slug} {tier} {'final' if scope == 'final' else 'module ' + mk} ord {o}"


def main():
    served_path = sys.argv[1]
    check = '--check' in sys.argv
    served = {key(r): r for r in json.load(open(served_path)) if r.get('active', True)}
    edits = json.load(open(os.path.join(HERE, 'edits.json')))
    new = {}
    fields = collections.defaultdict(list)
    for e in edits:
        k = (e['app_slug'], e['tier'], e['scope'], e['module_key'], int(e['ord']))
        if k not in served:
            sys.exit(f'REFUSED: no served row for {label(k)}')
        r = new.setdefault(k, json.loads(json.dumps(served[k])))
        if e['field'] == 'option':
            i = r['answer_index'] if e['option'] == 'key' else int(e['option'])
            if r['options'][i].count(e['old']) != 1:
                sys.exit(f'REFUSED: {label(k)} option {i} does not hold "{e["old"]}" exactly once')
            r['options'][i] = r['options'][i].replace(e['old'], e['new'])
            fields[k].append(f"option {i}{' (keyed)' if i == r['answer_index'] else ''}")
        else:
            if (r[e['field']] or '').count(e['old']) != 1:
                sys.exit(f'REFUSED: {label(k)} {e["field"]} does not hold "{e["old"]}" exactly once')
            r[e['field']] = r[e['field']].replace(e['old'], e['new'])
            fields[k].append(e['field'])
    for k, r in new.items():
        o = served[k]
        if r['answer_index'] != o['answer_index'] or len(r['options']) != len(o['options']):
            sys.exit(f'REFUSED: {label(k)} moved its answer index or option count')
        if len(set(r['options'])) != len(r['options']):
            sys.exit(f'REFUSED: {label(k)} options are no longer distinct')
        for t in [r['prompt'], r['explanation'] or ''] + r['options']:
            if '—' in t or '–' in t:
                sys.exit(f'REFUSED: {label(k)} carries an em or en dash')

    # committed bank sources must already carry the recut text
    for slug, pre in BANK_PREFIX.items():
        for tier, L in LETTER.items():
            man = json.load(open(os.path.join(REPO, 'src/content/courses', slug, tier, 'manifest.json')))
            files = [(f"{pre}{L}_{m['key'].split('-')[0]}.json", 'module', m['key']) for m in man['modules']]
            files.append((f'{pre}{L}_exam.json', 'final', None))
            for fn, scope, mk in files:
                bank = json.load(open(os.path.join(REPO, 'tools/course-banks', slug, tier, fn)))
                for i, it in enumerate(bank, 1):
                    k = (slug, tier, scope, mk, i)
                    r = new.get(k, served[k])
                    if (r['prompt'], r['options'], r['answer_index'], r['explanation']) != \
                            (it['prompt'], it['options'], it['answer'], it['explanation']):
                        sys.exit(f'REFUSED: committed bank {slug}/{tier}/{fn} #{i} differs from the recut row')

    keys = sorted(new, key=lambda k: (k[0], ['beginner', 'intermediate', 'advanced'].index(k[1]), k[2], k[3] or '', k[4]))
    per = collections.Counter(k[0] for k in keys)
    L = [
        '-- ==========================================================================',
        '-- BANK COURSE-NAMES RECUT: question text names the renamed courses and the',
        '-- relabelled academy module (owner decisions 2026-09-26). TEXT ONLY.',
        '--',
        '-- Courses named for the skill: Seismolord -> Seismic Interpretation,',
        '-- ReservoirCalc -> Reservoir Volumetrics, Well Data Manager -> Well Data',
        '-- Management, Mapping -> Subsurface Mapping. The academy module economics',
        '-- is Economics & Commercial. Where a question means the Suite app (the Well',
        '-- Data Manager QC panel, the ReservoirCalc chain or ladder) the app keeps',
        '-- its name.',
        '--',
        f'-- WHAT MOVES. {len(keys)} rows: ' + ', '.join(f'{c} {n}' for c, n in sorted(per.items())) + '.',
        '-- No answer_index, option order, ord, module key, scope or row count moves,',
        '-- so every question id and every learner attempt survives. Four rows change',
        '-- a keyed option\'s text; one distractor (rockphysics advanced m05 ord 9,',
        '-- option 2) is lengthened so that row keeps its length rank. Every bank',
        '-- touched stays inside the 12 to 40 percent length-rank band.',
        '-- Rows (fields):',
    ]
    for k in keys:
        L.append(f'--   {label(k)}: {", ".join(fields[k])}')
    L += [
        '--',
        '-- GUARDS. Each row is addressed by (app_slug, tier, scope, module_key, ord)',
        '-- among ACTIVE rows and must match EITHER its served text exactly (prompt,',
        '-- options, answer_index, explanation), in which case it is updated, OR its',
        '-- recut text exactly, in which case it is already applied and left alone.',
        '-- Anything else raises and the transaction rolls back. Every update must',
        f'-- touch exactly 1 row, and each course must still hold {COUNT} active questions.',
        '--',
        '-- The served text is what the applied migrations leave (deep seeds, B3, DG,',
        '-- B4 length and fix files, round-off banks, W6), replayed on a scratch',
        '-- database. Written by docs/bank-course-names-recut/gen_recut.py from',
        '-- edits.json; every OLD and NEW row is in RECUT.json.',
        '--',
        '-- SAFE TO RE-RUN. A second run finds every row already recut and updates',
        '-- nothing.',
        '-- ==========================================================================',
        '',
        'do $$',
        'declare',
        '  v_state   text;',
        '  v_count   integer;',
        '  v_updated integer := 0;',
        'begin',
    ]
    lab = 'bank course-names recut'
    for k in keys:
        w = where(k)
        L += [
            '',
            f'  -- {label(k)}: {", ".join(fields[k])}',
            '  select case',
            f"           when {match(served[k])} then 'old'",
            f"           when {match(new[k])} then 'new'",
            "           else 'other' end",
            '    into v_state',
            f'    from public.academy_quiz_questions where {w};',
            f"  if v_state is null then raise exception '{lab} refused: no active row for {label(k)}'; end if;",
            f"  if v_state = 'other' then raise exception '{lab} refused: {label(k)} matches neither its served nor its recut text'; end if;",
            "  if v_state = 'old' then",
            '    update public.academy_quiz_questions',
            f"       set prompt = {q(new[k]['prompt'])}, options = {opts(new[k])}, explanation = {q(new[k]['explanation'])}",
            f'     where {w};',
            '    get diagnostics v_count = row_count;',
            f"    if v_count <> 1 then raise exception '{lab} refused: {label(k)} updated % rows', v_count; end if;",
            '    v_updated := v_updated + 1;',
            '  end if;',
        ]
    L.append('')
    for c in sorted(per):
        L += [
            f"  select count(*) into v_count from public.academy_quiz_questions where app_slug = {q(c)} and active;",
            f"  if v_count <> {COUNT} then raise exception '{lab} refused: {c} holds % active questions, expected {COUNT}', v_count; end if;",
        ]
    L += [
        f"  raise notice '{lab}: % of {len(keys)} rows updated, % already recut', v_updated, {len(keys)} - v_updated;",
        'end',
        '$$;',
        '',
    ]
    sql = '\n'.join(L)
    doc = json.dumps([{'row': label(k), 'fields': fields[k], 'old': served[k], 'new': new[k]} for k in keys],
                     indent=1, ensure_ascii=False) + '\n'
    if check:
        drift = [p for p, s in [(MIG, sql), (OUT, doc)] if not os.path.exists(p) or open(p).read() != s]
        if drift:
            sys.exit('DRIFT: ' + ', '.join(drift))
        print(f'check ok: {len(keys)} rows')
        return
    open(MIG, 'w').write(sql)
    open(OUT, 'w').write(doc)
    print(f'wrote {len(keys)} rows: ' + ', '.join(f'{c} {n}' for c, n in sorted(per.items())))


if __name__ == '__main__':
    main()
