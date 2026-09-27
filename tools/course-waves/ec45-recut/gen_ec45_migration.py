#!/usr/bin/env python3
"""Generate migrations/20261113_ec45_recut_decision_portfolio_joa.sql from the
committed edits manifests:

  docs/ec45-recut/decision_edits.json    141 question rows + the Expert dataset line
  docs/ec45-recut/portfolio_edits.json   178 question rows + the Expert dataset line
  docs/ec45-recut/joa_edits.json         2 question rows (one field each; the full
                                         new row is the committed bank source JSON
                                         under tools/course-banks/joa)

Adapted from tools/course-waves/pia-recut/gen_ec7_migration.py (the EC7 recut).
Never hand-edit the SQL: edit the manifests and re-run
    python3 tools/course-waves/ec45-recut/gen_ec45_migration.py
--check exits 1 if the committed SQL differs from what this would write.
"""
import hashlib, json, os, sys

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
NAME = '20261113_ec45_recut_decision_portfolio_joa'
OUT = os.path.join(REPO, 'migrations', NAME + '.sql')
DEC = json.load(open(os.path.join(REPO, 'docs/ec45-recut/decision_edits.json'), encoding='utf-8'))
POR = json.load(open(os.path.join(REPO, 'docs/ec45-recut/portfolio_edits.json'), encoding='utf-8'))
JOA = json.load(open(os.path.join(REPO, 'docs/ec45-recut/joa_edits.json'), encoding='utf-8'))
TIERS = ('beginner', 'intermediate', 'advanced')
LETTER = {'beginner': 'b', 'intermediate': 'i', 'advanced': 'a'}
F = ('prompt', 'options', 'answer_index', 'explanation')
COURSES = ('decision', 'portfolio', 'joa')


def lit(s):
    if s is None:
        return 'null'
    return "'" + str(s).replace("'", "''") + "'"


def jlit(o):
    return lit(json.dumps(o, ensure_ascii=False)) + '::jsonb'


def canon_sql(expr):
    # One canonical text for a capstone fields array: key|label|unit|expected|tol in order,
    # numbers compared as float8 so the literal's spelling of a number never matters.
    return ("(select string_agg((e.f->>'key') || '|' || coalesce(e.f->>'label', '') || '|' || coalesce(e.f->>'unit', '') || '|' "
            "|| ((e.f->>'expected')::float8)::text || '|' || ((e.f->>'tol')::float8)::text, ',' order by e.n) "
            f"from jsonb_array_elements({expr}) with ordinality as e(f, n))")


def row(d):
    return {k: d[k] for k in F}


# ------------------------------------------------------------------ the rows
def decision_rows():
    out = []
    for q in DEC['questions']:
        assert q['old_pre_w3'] is None and q['w3_differs'] is False
        out.append((q['tier'], q['scope'], q['module_key'], q['ord'], row(q['old']), row(q['new'])))
    return out


def portfolio_rows():
    out = []
    for q in POR['questions']:
        assert q['old_pre_w3'] == q['old_post_w3'], ('W3 moved a portfolio question', q['tier'], q['ord'])
        out.append((q['tier'], q['scope'], q['module_key'], q['ord'], row(q['old_post_w3']), row(q['new'])))
    return out


def joa_rows():
    out = []
    for e in JOA['edits']:
        assert e['course'] == 'joa'
        bank = 'exam' if e['scope'] == 'final' else e['module_key'][:3]
        src = json.load(open(os.path.join(REPO, 'tools/course-banks/joa', e['tier'], f"ec9{LETTER[e['tier']]}_{bank}.json"), encoding='utf-8'))
        b = src[e['ord'] - 1]
        new = {'prompt': b['prompt'], 'options': b['options'], 'answer_index': b['answer'], 'explanation': b['explanation']}
        assert new[e['field']] == e['new'], ('joa bank source differs from joa_edits.json', e['tier'], e['ord'])
        if 'answer_index' in e:
            assert e['answer_index'] == new['answer_index']
        old = dict(new)
        old[e['field']] = e['old']
        out.append((e['tier'], e['scope'], e['module_key'], e['ord'], old, new))
    return out


ROWS = {'decision': decision_rows(), 'portfolio': portfolio_rows(), 'joa': joa_rows()}
for c, rows in ROWS.items():
    keys = [(t, s, m, o) for t, s, m, o, _, _ in rows]
    assert len(keys) == len(set(keys)), f'{c}: a row is given twice'
    for t, s, m, o, old, new in rows:
        assert old != new, f'{c} {t} {s} {m} {o}: changes nothing'
        assert len(new['options']) == 4 and len(set(new['options'])) == 4

CAPS = []
for c, d in (('decision', DEC), ('portfolio', POR)):
    assert len(d['capstones']) == 1
    x = d['capstones'][0]
    assert x['changed'] == ['dataset'] and x['tier'] == 'advanced'
    pu = x['prompt_unchanged']
    assert hashlib.md5(pu['pre_w3'].encode()).hexdigest() == pu['pre_w3_md5']
    assert hashlib.md5(pu['post_w3'].encode()).hexdigest() == pu['post_w3_md5']
    CAPS.append({'course': c, 'tier': x['tier'], 'cert_tier': x['cert_tier'], 'title': x['title'],
                 'old': x['old']['dataset'], 'new': x['new']['dataset'], 'fields': x['fields'],
                 'pre_md5': pu['pre_w3_md5'], 'post_md5': pu['post_w3_md5']})


def counts(rows):
    c = {t: 0 for t in TIERS}
    for r in rows:
        c[r[0]] += 1
    return c


TOTAL = sum(len(r) for r in ROWS.values())
MOVED = sum(1 for c in ROWS for r in ROWS[c] if r[4]['answer_index'] != r[5]['answer_index'])
assert MOVED == DEC['keys_moved'] and all(r[4]['answer_index'] == r[5]['answer_index'] for c in ('portfolio', 'joa') for r in ROWS[c])
L = []
w = L.append

w('-- ============================================================================')
w('-- EC45 RECUT: Decision Analysis (decision, EC4), Capital Portfolio (portfolio,')
w('-- EC5) and Joint Ventures (joa, EC9) question banks brought onto the current')
w('-- engines (petrolord-engines fb5a363 for decisionTree.js, voi.js, portfolio.js')
w('-- and afe.js; engines #274 jointVenture.js on its canonical path).')
w('--')
w(f'-- GENERATED by tools/course-waves/ec45-recut/gen_ec45_migration.py from')
w('-- docs/ec45-recut/decision_edits.json, portfolio_edits.json and joa_edits.json')
w('-- (with the joa bank sources under tools/course-banks/joa). Never hand-edit.')
w('--')
w('-- WHAT MOVES.')
for c in COURSES:
    k = counts(ROWS[c])
    w(f"--   {c} questions: {len(ROWS[c])} rows (beginner {k['beginner']}, intermediate {k['intermediate']}, advanced {k['advanced']})")
w(f'--   {TOTAL} question rows in all. {MOVED} of them (decision only) carry a re-derived')
w('--   answer_index: the key the current engine gives, checked by engine call')
w('--   (tools/course-waves/decision/recut/keytruth.mjs); portfolio and joa move no key.')
for x in CAPS:
    w(f"--   {x['course']} Expert capstone: the dataset line only (\"repaired\" goes):")
    w(f"--     {x['old']!r}")
    w(f"--     -> {x['new']!r}")
w('-- WHAT DOES NOT MOVE. No ord, module key, scope or row count, and no key outside')
w('-- those decision rows; each course keeps 396 active questions (132 a tier) and')
w('-- 3 capstones of 6 fields.')
w('-- No capstone prompt, title, cert tier or graded field (key, label, unit,')
w('-- expected, tolerance, order) moves. No other table is touched: capstone')
w('-- attempts and certifications stand as issued and are asserted byte-identical')
w('-- after the file. Lessons, labs and panels ship in the NextGen site build.')
w('--')
w('-- W3. 20261026_w3_decision and 20261026_w3_portfolio appended one sentence to')
w('-- capstone prompts and wrote no question row. This file applies whether or not')
w('-- W3 is applied: every question row has one served text either way, and each')
w('-- capstone guard accepts the prompt in its pre-W3 or its post-W3 form (by md5).')
w('-- W3 guards on prompt and fields only, so it still applies after this file.')
w('--')
w('-- GUARDS. Each question row is addressed by (app_slug, tier, scope, module_key,')
w('-- ord) among active rows and must carry EITHER its served prompt, options,')
w('-- answer_index and explanation exactly (it is updated, then read back) OR the')
w('-- recut ones exactly (already applied, left alone). Anything else raises naming')
w('-- the row and, run in a transaction, the whole file rolls back. Every update')
w('-- touches exactly 1 row.')
w('--')
w('-- TRANSACTION. Like every migration in this repository the file carries no')
w('-- transaction lines of its own: the owner\'s apply script')
w('-- (tools/course-waves/ec45-recut/apply_ec45_recut.sh) wraps it in one.')
w('-- SAFE TO RE-RUN: a second run finds every row recut and writes nothing.')
w('-- ============================================================================')
w('')

SLUGS = ', '.join(lit(c) for c in COURSES)
SNAP = (f"md5(coalesce((select string_agg(md5(a::text), ',' order by a.id) from public.academy_capstone_attempts a where a.app_slug in ({SLUGS})), '')"
        f" || '#' || coalesce((select string_agg(md5(c::text), ',' order by md5(c::text)) from public.academy_certifications c where c.app_slug in ({SLUGS})), ''))")
w('-- ----------------------------------------------------------------------------')
w('-- 0. The attempts and certifications that stand as issued (snapshot).')
w('-- ----------------------------------------------------------------------------')
w('do $$')
w('declare')
w('  r record;')
w('begin')
w('  for r in')
w('    select app_slug, tier, count(*) as n from public.academy_capstone_attempts')
w(f'     where app_slug in ({SLUGS}) group by 1, 2 order by 1, 2')
w('  loop')
w("    raise notice 'ec45 recut: % attempt(s) on %/% stand as graded (no graded field moves)', r.n, r.app_slug, r.tier;")
w('  end loop;')
w(f"  perform set_config('ec45.snapshot', {SNAP}, false);")
w('end $$;')
w('')


def qblock(n, course, rows):
    rows = sorted(rows, key=lambda r: (TIERS.index(r[0]), r[1], r[2] or '', r[3]))
    k = counts(rows)
    w('-- ----------------------------------------------------------------------------')
    w(f"-- {n}. {course}: {len(rows)} question rows (beginner {k['beginner']}, intermediate {k['intermediate']}, advanced {k['advanced']}).")
    w('-- ----------------------------------------------------------------------------')
    w('do $$')
    w('declare')
    w('  r         record;')
    w('  v_state   text;')
    w('  v_count   integer;')
    w('  v_updated integer := 0;')
    w('  v_done    integer := 0;')
    w('begin')
    w('  for r in')
    w('    select * from (values')
    vals = []
    for t, s, m, o, old, new in rows:
        vals.append('      (' + ', '.join([lit(t), lit(s), lit(m) + '::text', str(o),
                    lit(old['prompt']), jlit(old['options']), str(old['answer_index']), lit(old['explanation']) + '::text',
                    lit(new['prompt']), jlit(new['options']), str(new['answer_index']), lit(new['explanation']) + '::text']) + ')')
    w(',\n'.join(vals))
    w('    ) as t(tier, scope, module_key, ord, old_prompt, old_options, old_answer, old_expl, new_prompt, new_options, new_answer, new_expl)')
    w('  loop')
    w('    select case')
    w("             when q.prompt = r.old_prompt and q.options = r.old_options and q.answer_index = r.old_answer and q.explanation is not distinct from r.old_expl then 'old'")
    w("             when q.prompt = r.new_prompt and q.options = r.new_options and q.answer_index = r.new_answer and q.explanation is not distinct from r.new_expl then 'new'")
    w("             else 'other' end")
    w('      into v_state')
    w('      from public.academy_quiz_questions q')
    w(f"     where q.app_slug = '{course}' and q.active and q.tier = r.tier and q.scope = r.scope")
    w('       and q.module_key is not distinct from r.module_key and q.ord = r.ord;')
    w('    get diagnostics v_count = row_count;')
    w('    if v_count <> 1 then')
    w(f"      raise exception 'ec45 recut refused: {course}/%/%/%/ord % matched % active rows, expected 1', r.tier, r.scope, coalesce(r.module_key, 'final'), r.ord, v_count;")
    w('    end if;')
    w("    if v_state = 'other' then")
    w(f"      raise exception 'ec45 recut refused: {course}/%/%/%/ord % carries neither its served text nor the recut text', r.tier, r.scope, coalesce(r.module_key, 'final'), r.ord;")
    w('    end if;')
    w("    if v_state = 'old' then")
    w('      update public.academy_quiz_questions q')
    w('         set prompt = r.new_prompt, options = r.new_options, answer_index = r.new_answer, explanation = r.new_expl')
    w(f"       where q.app_slug = '{course}' and q.active and q.tier = r.tier and q.scope = r.scope")
    w('         and q.module_key is not distinct from r.module_key and q.ord = r.ord')
    w('         and q.answer_index = r.old_answer;')
    w('      get diagnostics v_count = row_count;')
    w('      if v_count <> 1 then')
    w(f"        raise exception 'ec45 recut refused: {course}/%/%/%/ord % update touched % rows', r.tier, r.scope, coalesce(r.module_key, 'final'), r.ord, v_count;")
    w('      end if;')
    w('      v_updated := v_updated + 1;')
    w('    else')
    w('      v_done := v_done + 1;')
    w('    end if;')
    w('    perform 1 from public.academy_quiz_questions q')
    w(f"     where q.app_slug = '{course}' and q.active and q.tier = r.tier and q.scope = r.scope")
    w('       and q.module_key is not distinct from r.module_key and q.ord = r.ord')
    w('       and q.prompt = r.new_prompt and q.options = r.new_options and q.answer_index = r.new_answer')
    w('       and q.explanation is not distinct from r.new_expl;')
    w('    if not found then')
    w(f"      raise exception 'ec45 recut refused: {course}/%/%/%/ord % does not read back as the recut text', r.tier, r.scope, coalesce(r.module_key, 'final'), r.ord;")
    w('    end if;')
    w('  end loop;')
    w(f'  if v_updated + v_done <> {len(rows)} then')
    w(f"    raise exception 'ec45 recut refused: {course} accounted for % rows, expected {len(rows)}', v_updated + v_done;")
    w('  end if;')
    w(f"  perform set_config('ec45.rows_{course}', (v_updated + v_done)::text, false);")
    w(f"  raise notice 'ec45 recut: {course} questions, % updated, % already recut, of {len(rows)}', v_updated, v_done;")
    w('end $$;')
    w('')


for i, c in enumerate(COURSES, 1):
    qblock(i, c, ROWS[c])


def capblock(n, x):
    c, t = x['course'], x['tier']
    head = f"c.title = {lit(x['title'])} and c.cert_tier = {lit(x['cert_tier'])} and md5(c.prompt) in ({lit(x['pre_md5'])}, {lit(x['post_md5'])}) and {canon_sql('c.fields')} = {canon_sql(jlit(x['fields']))}"
    w('-- ----------------------------------------------------------------------------')
    w(f"-- {n}. {c} {t} capstone: the dataset line only. Title, cert tier and fields")
    w(f"--    must be exactly the served ones and the prompt its pre-W3 (md5 {x['pre_md5']})")
    w(f"--    or post-W3 (md5 {x['post_md5']}) form; none of them is written.")
    w('-- ----------------------------------------------------------------------------')
    w('do $$')
    w('declare')
    w('  v_state text;')
    w('  v_count integer;')
    w('begin')
    w('  select case')
    w(f"           when not ({head}) then 'other'")
    w(f"           when c.dataset = {lit(x['old'])} then 'old'")
    w(f"           when c.dataset = {lit(x['new'])} then 'new'")
    w("           else 'other' end")
    w('    into v_state')
    w(f"    from public.academy_capstones c where c.app_slug = '{c}' and c.tier = '{t}' and c.active;")
    w('  get diagnostics v_count = row_count;')
    w('  if v_count <> 1 then')
    w(f"    raise exception 'ec45 recut refused: {c}/{t} has % active capstones, expected 1', v_count;")
    w('  end if;')
    w("  if v_state = 'other' then")
    w(f"    raise exception 'ec45 recut refused: the {c}/{t} capstone carries neither its served title, cert tier, prompt (pre- or post-W3), fields and dataset nor the recut dataset';")
    w('  end if;')
    w("  if v_state = 'old' then")
    w(f"    update public.academy_capstones set dataset = {lit(x['new'])}")
    w(f"     where app_slug = '{c}' and tier = '{t}' and active and dataset = {lit(x['old'])};")
    w('    get diagnostics v_count = row_count;')
    w('    if v_count <> 1 then')
    w(f"      raise exception 'ec45 recut refused: the {c}/{t} capstone update touched % rows', v_count;")
    w('    end if;')
    w('  end if;')
    w(f"  perform 1 from public.academy_capstones c where c.app_slug = '{c}' and c.tier = '{t}' and c.active and c.dataset = {lit(x['new'])} and {head};")
    w('  if not found then')
    w(f"    raise exception 'ec45 recut refused: the {c}/{t} capstone does not read back as the recut dataset with its prompt and fields unchanged';")
    w('  end if;')
    w(f"  raise notice 'ec45 recut: {c}/{t} capstone dataset %', case when v_state = 'old' then 'recut' else 'already recut' end;")
    w('end $$;')
    w('')


for i, x in enumerate(CAPS, len(COURSES) + 1):
    capblock(i, x)

n = len(COURSES) + len(CAPS) + 1
w('-- ----------------------------------------------------------------------------')
w(f'-- {n}. Closing assertions: the row counts this file accounted for ({TOTAL} question')
w('--    rows), 396 active questions (132 a tier) and 3 capstones of 6 fields per')
w('--    course, and the attempts and certifications untouched.')
w('-- ----------------------------------------------------------------------------')
w('do $$')
w('declare')
w('  v_count integer;')
w('  v_c     text;')
w('  v_t     text;')
w('begin')
for c in COURSES:
    w(f"  if coalesce(current_setting('ec45.rows_{c}', true), '') <> '{len(ROWS[c])}' then")
    w(f"    raise exception 'ec45 recut refused: the {c} block accounted for % rows, expected {len(ROWS[c])}', current_setting('ec45.rows_{c}', true);")
    w('  end if;')
w(f"  foreach v_c in array array[{SLUGS}] loop")
w("    foreach v_t in array array['beginner', 'intermediate', 'advanced'] loop")
w('      select count(*) into v_count from public.academy_quiz_questions where app_slug = v_c and active and tier = v_t;')
w('      if v_count <> 132 then')
w("        raise exception 'ec45 recut refused: %/% holds % active questions, expected 132', v_c, v_t, v_count;")
w('      end if;')
w('    end loop;')
w('    select count(*) into v_count from public.academy_quiz_questions where app_slug = v_c and active;')
w('    if v_count <> 396 then')
w("      raise exception 'ec45 recut refused: % holds % active questions, expected 396', v_c, v_count;")
w('    end if;')
w('    select count(*) into v_count from public.academy_capstones where app_slug = v_c and active;')
w('    if v_count <> 3 then')
w("      raise exception 'ec45 recut refused: % has % active capstones, expected 3', v_c, v_count;")
w('    end if;')
w('    select count(*) into v_count from public.academy_capstones k, lateral jsonb_array_elements(k.fields) f where k.app_slug = v_c and k.active;')
w('    if v_count <> 18 then')
w("      raise exception 'ec45 recut refused: % capstones carry % graded fields, expected 18', v_c, v_count;")
w('    end if;')
w('  end loop;')
w(f"  if current_setting('ec45.snapshot', true) is distinct from {SNAP} then")
w("    raise exception 'ec45 recut refused: a stored capstone attempt or certification of decision, portfolio or joa changed';")
w('  end if;')
w(f"  raise notice 'ec45 recut: done; {TOTAL} question rows and 2 capstone datasets in their recut form; attempts and certifications untouched';")
w('end $$;')

sql = '\n'.join(L) + '\n'
low = sql.lower()
for bad in ('\nbegin;', '\ncommit;', '\nrollback;', 'start transaction'):
    assert bad not in low, f'the generated file carries a transaction line: {bad!r}'


def main():
    if '--check' in sys.argv:
        cur = open(OUT, encoding='utf-8').read() if os.path.exists(OUT) else ''
        if cur != sql:
            print(f'DIFFERS: migrations/{NAME}.sql is not what the generator writes'); sys.exit(1)
        print('generator check: the committed migration is what the manifests produce'); sys.exit(0)
    open(OUT, 'w', encoding='utf-8').write(sql)
    print(f"wrote migrations/{NAME}.sql: {len(sql)} bytes, sha256 {hashlib.sha256(sql.encode()).hexdigest()}; "
          + ', '.join(f"{c} {len(ROWS[c])} {counts(ROWS[c])}" for c in COURSES) + f"; {len(CAPS)} capstone datasets")


if __name__ == '__main__':
    main()
