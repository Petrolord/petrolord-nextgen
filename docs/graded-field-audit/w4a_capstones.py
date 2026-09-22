#!/usr/bin/env python3
"""B5 FOLLOW-ON, WAVE 4a (typed-case panel modes, drilling rows). Writes the
prompt-pointer migrations.

  python3 w4a_capstones.py [--container w4a-scratch] [--check]

Reads the live capstones from a LOCAL scratch replay at the production state of
2026-09-22 (mirror + B4 + B5 + round-off + W1; never production) and writes

  migrations/20261027a_w4_<course>.sql
      one sentence per tier that points the brief at the panel's typed "your
      case" view, from the `prompt_edits` of w4a/<course>.json. PROMPT ONLY: the
      guard requires `fields` to equal its live value exactly, before and after,
      so no key, expected or tolerance moves, no attempt can be graded
      differently, and there is no attempts guard (FOLLOW-ON-PROGRAMME.md
      rules: prompt-only changes need none, but are content-addressed).

Every row is content-addressed: its prompt must hold the md5 it was generated
against and its fields the exact jsonb (it is rewritten), or its W4a form (left
alone); anything else raises and the file rolls back. A file that will write
first checks that W1 is applied (SENTINELS) and refuses without it. Copy rule:
no em or en dash, no new "X, not Y" contrastive. `--check` regenerates in
memory and fails if a committed migration differs or is stale.
"""
import argparse, glob, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from w1_capstones import dumps, q, md5, live, wrap, check_copy  # noqa: E402

REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
MIG = os.path.join(REPO, 'migrations')
SPECS = os.path.join(HERE, 'w4a')
ORDER = ('beginner', 'intermediate', 'advanced')

# W1 must be applied first: its rows are this wave's base. The check refuses
# while a pre-W1 form is still live (so a later wave that moves the same rows
# again does not trip it): the rodpump beginner prompt as published before
# 20261024a (md5 27fc6852586864af77f23cdbbf2deacc, whose two planted figures W1
# removed) and the petrophysics advanced sw_waterleg_mean tolerance of 0.005
# (tightened to 0.0005 by W1, D6).
PRE_W1_RODPUMP_MD5 = '27fc6852586864af77f23cdbbf2deacc'
SENTINEL_SQL = """
  -- W1 (20261024a/b) must be applied first: its rows are this file's base
  if exists (select 1 from public.academy_capstones where app_slug = 'rodpump' and tier = 'beginner' and active and md5(prompt) = '{rod}')
     or exists (select 1 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
                 where c.app_slug = 'petrophysics' and c.tier = 'advanced' and c.active and f->>'key' = 'sw_waterleg_mean'
                   and (f->>'tol')::float8 = 0.005) then
    raise exception '{tag} refused: W1 (20261024a/b) is not applied on this database; apply it first (/root/w1-apply/apply.sh apply --prod)';
  end if;"""


def load_specs():
    return {s['course']: s for s in (json.load(open(p)) for p in sorted(glob.glob(os.path.join(SPECS, '*.json'))))}


def plan(caps, specs):
    rows = {}
    for course, s in specs.items():
        for tier, t in s['tiers'].items():
            edits = [tuple(x) for x in t.get('prompt_edits', [])]
            if not edits:
                continue
            cap = caps[(course, tier)]
            prompt = cap['prompt']
            for a, b in edits:
                if prompt.count(a) != 1:
                    sys.exit(f'REFUSED: {course}/{tier}: prompt anchor not found exactly once: {a[:90]!r}')
                check_copy(f'{course}/{tier} prompt', a, b)
                prompt = prompt.replace(a, b)
            rows[(course, tier)] = {'old': cap['prompt'], 'new': prompt, 'fields': dumps(cap['fields']),
                                    'edits': edits, 'why': t.get('why', '')}
    return rows


def file_sql(course, tiers, rows, sent):
    tag = f'w4a {course}'
    n = len(tiers)
    lines = []
    for k in tiers:
        r = rows[k]
        lines.append(f'-- {k[1].upper()}')
        lines.append(wrap(r['why'], lead='--   '))
        for a, b in r['edits']:
            lines.append(wrap('PROMPT was: ' + a, lead='--   '))
            lines.append(wrap('PROMPT now: ' + b, lead='--   '))
        lines.append('--')
    header = f"""-- ============================================================================
-- B5 FOLLOW-ON W4a (typed-case panel modes): {course}.
--
-- Plan of record: docs/graded-field-audit/FOLLOW-ON-PROGRAMME.md section 1
-- route (b), and docs/graded-field-audit/w4a/{course}.json. Owner approved D1
-- to D7 as recommended, 2026-09-21 (D2: the panel guard forbids a DEFAULT
-- state that lands on a graded answer; typing the case is the work).
--
{chr(10).join(lines)}
-- WHAT DOES NOT MOVE. `fields` (every key, label, unit, expected and
-- tolerance), title, dataset, status and the row. The guard requires `fields`
-- to equal its live value exactly, before and after.
--
-- ATTEMPTS. Prompt copy only: no graded key or tolerance moves, so no attempt
-- can be graded differently and there is no attempts guard.
--
-- GUARDS. Each row must hold EITHER its live prompt (by md5) and fields (exact
-- jsonb) as the W1-state scratch replay has them (it is rewritten), OR its W4a
-- form (left alone). Anything else raises and the whole file rolls back. A
-- file that will write first checks that W1 is applied and refuses without it.
-- Generated by docs/graded-field-audit/w4a_capstones.py. SAFE TO RE-RUN: a
-- second run writes nothing.
-- ============================================================================
"""
    header = '\n'.join(l.rstrip() for l in header.split('\n'))
    decl = ['  v_n        integer;', '  v_count    integer;', '  v_written  integer := 0;']
    decl += [f'  v_s{i}       text;' for i in range(n)]
    body = []
    for i, k in enumerate(tiers):
        c, t = k
        r = rows[k]
        w = f"app_slug = {q(c)} and tier = {q(t)} and active"
        body.append(f"""
  -- {c} / {t}
  select count(*) into v_n from public.academy_capstones where {w};
  if v_n <> 1 then raise exception '{tag} refused: {c}/{t} has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '{md5(r['old'])}' and fields = {q(r['fields'])}::jsonb then 'old'
              when md5(prompt) = '{md5(r['new'])}' and fields = {q(r['fields'])}::jsonb then 'new'
              else 'other' end
    into v_s{i} from public.academy_capstones where {w};
  if v_s{i} = 'other' then
    raise exception '{tag} refused: {c}/{t} matches neither its live form (prompt md5 {md5(r['old'])}) nor its W4a form (prompt md5 {md5(r['new'])}), with the fields this file was generated against';
  end if;""")
    body.append('\n  -- nothing to write: every row is already in its W4a form')
    body.append('  if ' + ' and '.join(f"v_s{i} = 'new'" for i in range(n)) + ' then')
    body.append(f"    raise notice '{tag}: 0 of {n} row(s) written, all already applied';")
    body.append('    return;')
    body.append('  end if;')
    body.append(SENTINEL_SQL.format(tag=tag, **sent))
    for i, k in enumerate(tiers):
        c, t = k
        r = rows[k]
        w = f"app_slug = {q(c)} and tier = {q(t)} and active"
        body.append(f"""
  if v_s{i} = 'old' then
    update public.academy_capstones
       set prompt = {q(r['new'])}
     where {w};
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception '{tag} refused: {c}/{t} updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '{md5(r['new'])}' and fields = {q(r['fields'])}::jsonb) from public.academy_capstones where {w}) is not true then
    raise exception '{tag} refused: {c}/{t} does not read back as its W4a form';
  end if;""")
    body.append(f"\n  raise notice '{tag}: % of {n} row(s) written, % already applied', v_written, {n} - v_written;")
    return header + '\ndo $$\ndeclare\n' + '\n'.join(decl) + '\nbegin' + '\n'.join(body) + '\nend $$;\n'


def build(caps):
    specs = load_specs()
    rows = plan(caps, specs)
    sent = {'rod': PRE_W1_RODPUMP_MD5}
    out = {}
    for course in sorted({k[0] for k in rows}):
        tiers = sorted([k for k in rows if k[0] == course], key=lambda k: ORDER.index(k[1]))
        out[f'20261027a_w4_{course}.sql'] = file_sql(course, tiers, rows, sent)
    return out, rows


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--container', default='w4a-scratch')
    ap.add_argument('--check', action='store_true', help='fail if a committed migration differs from a regeneration')
    a = ap.parse_args()
    caps = live(a.container)
    if len(caps) < 100:
        sys.exit(f'REFUSED: the scratch holds {len(caps)} live capstones')
    out, rows = build(caps)
    bad = 0
    for name, sql in sorted(out.items()):
        p = os.path.join(MIG, name)
        if a.check:
            if not os.path.exists(p) or open(p).read() != sql:
                print('DIFFERS', name)
                bad += 1
        else:
            open(p, 'w').write(sql)
            print('wrote', name)
    # only this wave's courses: another W4 builder may own other 20261027a files
    mine = {f'20261027a_w4_{c}.sql' for c in load_specs()}
    stale = {os.path.basename(p) for p in glob.glob(os.path.join(MIG, '20261027a_w4_*.sql'))} & mine - set(out)
    for s in sorted(stale):
        print('STALE (not generated):', s)
        bad += 1
    print(f'{len(out)} file(s), {len(rows)} tier(s), prompt copy only')
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
