#!/usr/bin/env python3
"""B5 FOLLOW-ON, WAVE 4 PART B (typed "your case" panel modes). Writes the prompt pointers.

  python3 w4b_capstones.py [--container w4b-scratch] [--check]

W4 route (b) of FOLLOW-ON-PROGRAMME.md section 1 gives a tier's panel a typed
"your case" mode that prints every graded value at the graded precision, with
no capstone preset. The panels reach learners with a NextGen zip. What reaches
them through the database is one sentence per capstone brief that says where
the case can be typed. That sentence is the only thing these files write.

Reads the live capstones from a LOCAL scratch replay in the post-W1 state
(production today: mirror + B4 + B5 + round-off + W1; never production) and
writes

  migrations/20261027b_w4_<course>.sql
      prompt only: the pointer sentence appended to the brief of each tier the
      spec names. `fields` must equal its live value exactly, before and after,
      so no answer grades differently and there is no attempts guard (D5 does
      not apply: nothing is re-keyed or tightened).

The specs are w4b/<course>.json: per tier, the pointer and, per graded key, the
panel file, the mode value, the line that prints it, the decimals printed and
the test that proves the typed prompt case reads the graded value. normalize.py
folds the per-key part into annot/ (the field moves to source `nextgen-panel`,
class `none`), and audit.py checks that every named panel still carries its
mode and every named test still exists.

Every row is content-addressed: its prompt must hold the md5 it was generated
against and its fields the exact jsonb (it is rewritten), or its W4 form (left
alone); anything else raises and the file's transaction rolls back. A file that
will write first checks the W1 post-state and refuses without it. Copy rule:
no em or en dash, no new "X, not Y" contrastive. `--check` regenerates in
memory and fails if a committed migration differs.
"""
import argparse, glob, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from w1_capstones import dumps, q, md5, wrap, check_copy, live  # noqa: E402

REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
MIG = os.path.join(REPO, 'migrations')
SPECS = os.path.join(HERE, 'w4b')
PREFIX = '20261027b_w4_'
TIERS = ('beginner', 'intermediate', 'advanced')

# W1 must be applied first (its re-keys and tightenings are this batch's base).
# Two W1 moves that no later wave reverts: the mbal advanced re-key and the
# petrophysics advanced rw_arps tightening.
SENTINEL_SQL = """
  -- W1 (20261024*) must be applied first: its post-state is this file's base
  if not exists (select 1 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
                  where c.app_slug = 'mbal' and c.tier = 'advanced' and c.active and f->>'key' = 'a111_ddi')
     or not exists (select 1 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
                     where c.app_slug = 'petrophysics' and c.tier = 'advanced' and c.active and f->>'key' = 'rw_arps'
                       and (f->>'tol')::float8 = 0.00005) then
    raise exception '{tag} refused: W1 (20261024*) is not applied on this database; apply it first (/root/w1-apply/apply.sh apply --prod)';
  end if;"""


def load_specs():
    specs = {}
    for p in sorted(glob.glob(os.path.join(SPECS, '*.json'))):
        s = json.load(open(p))
        specs[s['course']] = s
    return specs


def plan(caps, specs):
    rows = {}
    for course, s in sorted(specs.items()):
        for tier, t in s['tiers'].items():
            cap = caps.get((course, tier))
            if cap is None:
                sys.exit(f'REFUSED: {course}/{tier} has no live capstone')
            ptr = t['pointer'].strip()
            check_copy(f'{course}/{tier} pointer', '', ptr)
            if ptr in cap['prompt']:
                sys.exit(f'REFUSED: {course}/{tier}: the live prompt already carries the pointer (regenerate from the pre-W4 state)')
            keys = [f['key'] for f in cap['fields']]
            for k in t.get('keys', {}):
                if keys.count(k) != 1:
                    sys.exit(f'REFUSED: {course}/{tier}: spec names {k}, which is not live exactly once')
            rows[(course, tier)] = {'old': cap['prompt'], 'new': cap['prompt'].rstrip() + ' ' + ptr,
                                    'fields': dumps(cap['fields']), 'pointer': ptr, 'keys': sorted(t.get('keys', {}))}
    return rows


def file_sql(course, rows):
    tag = f'w4b {course}'
    tiers = sorted([k for k in rows if k[0] == course], key=lambda k: TIERS.index(k[1]))
    n = len(tiers)
    lines = []
    for k in tiers:
        r = rows[k]
        lines.append(wrap(f'{k[1].upper()} ({len(r["keys"])} graded field(s) now read in a typed panel mode: {", ".join(r["keys"])})'))
        lines.append(wrap('POINTER appended: ' + r['pointer'], lead='--   '))
    header = f"""-- ============================================================================
-- B5 FOLLOW-ON W4 PART B (typed "your case" panel modes): {course}.
--
-- Plan of record: docs/graded-field-audit/FOLLOW-ON-PROGRAMME.md section 1,
-- route (b), and decision D2 (a panel may reach the capstone case when the
-- learner types it; no panel DEFAULT state lands on a graded answer). Owner
-- approved D1 to D7 as recommended, 2026-09-21. The panels ship with the
-- NextGen zip; this file adds one sentence to each brief saying where the case
-- can be typed.
--
{chr(10).join(lines)}
--
-- WHAT DOES NOT MOVE. `fields` (every key, label, unit, expected and
-- tolerance), title, dataset, status and the row. The guard requires `fields`
-- to equal its live value exactly, before and after, so no answer grades
-- differently and no attempts guard is needed.
--
-- GUARDS. Each prompt must hold its post-W1 text (md5, rewritten) or its W4
-- text (left alone). Anything else raises and the file rolls back. A file that
-- will write first checks the W1 post-state and refuses without it. Generated
-- by docs/graded-field-audit/w4b_capstones.py from w4b/{course}.json. SAFE TO
-- RE-RUN: a second run writes nothing.
-- ============================================================================
"""
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
    raise exception '{tag} refused: {c}/{t} matches neither its published form (prompt md5 {md5(r['old'])}) nor its W4 form (prompt md5 {md5(r['new'])}), with the fields this file was generated against';
  end if;""")
    body.append('\n  -- nothing to write: every row is already in its W4 form')
    body.append('  if ' + ' and '.join(f"v_s{i} = 'new'" for i in range(n)) + ' then')
    body.append(f"    raise notice '{tag}: 0 of {n} row(s) written, all already applied';")
    body.append('    return;')
    body.append('  end if;')
    body.append(SENTINEL_SQL.format(tag=tag))
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
    raise exception '{tag} refused: {c}/{t} does not read back as its W4 form';
  end if;""")
    body.append(f"\n  raise notice '{tag}: % of {n} row(s) written, % already applied', v_written, {n} - v_written;")
    return header + '\ndo $$\ndeclare\n' + '\n'.join(decl) + '\nbegin' + '\n'.join(body) + '\nend $$;\n'


def build(caps):
    specs = load_specs()
    rows = plan(caps, specs)
    return {f'{PREFIX}{c}.sql': file_sql(c, rows) for c in sorted({k[0] for k in rows})}, rows


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--container', default='w4b-scratch')
    ap.add_argument('--check', action='store_true', help='fail if a committed migration differs from a regeneration')
    a = ap.parse_args()
    caps = live(a.container)
    if len(caps) < 100:
        sys.exit(f'REFUSED: the scratch holds {len(caps)} live capstones')
    out, rows = build(caps)
    if not out:
        sys.exit('REFUSED: no w4b spec names a tier (an empty batch is not a pass)')
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
    mine = {f'{PREFIX}{c}.sql' for c in load_specs()}
    stale = {os.path.basename(p) for p in glob.glob(os.path.join(MIG, PREFIX + '*.sql'))} & mine - set(out)
    for s in sorted(stale):
        print('STALE (not generated):', s)
        bad += 1
    print(f'{len(out)} file(s); {len(rows)} tier(s) carry a pointer')
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
