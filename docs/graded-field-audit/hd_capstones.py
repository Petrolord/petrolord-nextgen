#!/usr/bin/env python3
"""Held decisions (HD), 2026-09-22: the guarded capstone migrations for the
owner's held decisions on the B5 follow-on residuals.

  python3 hd_capstones.py [--container hda-scratch] [--check] [--course mbal]

Reads the live capstones from a LOCAL scratch replay in the post-W2-W6 state
(`SCRATCH=<x> /root/w2w6-post-restore.sh`; never production) and writes, for
each spec hd/<course>.json, the file it names (migrations/20261030<x>_hd_<course>.sql).

    tighten: a field keeps its key, label, unit, expected value and position;
      only its tol moves, from `tol_old` to `tol_new`. A tightening can grade a
      retry differently, so the file carries the attempts guard of
      20260921_lesson_leak_grader_tolerances.sql: it counts
      academy_capstone_attempts on each tier it writes and refuses if any
      exist, unless D5 allowlists the tier (ALLOW below: the tier and the exact
      attempt ids signed off; any other id refuses). Stored scores are never
      touched. The prompt and dataset do not move.

Every row is content-addressed: its prompt and dataset must hold the md5 and
its fields the exact jsonb they hold after the W2-W6 batch (it is rewritten),
or its HD form (left alone); anything else raises and the file's transaction
rolls back. `--check` regenerates in memory and fails if a committed migration
differs.
"""
import argparse, decimal, glob, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from w1_capstones import dumps, q, md5, live, wrap  # noqa: E402

REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
MIG = os.path.join(REPO, 'migrations')
SPECS = os.path.join(HERE, 'hd')
TIERS = ('beginner', 'intermediate', 'advanced')

# D5: tiers signed off although attempts exist, with the exact attempt ids.
# EMPTY: no tier is signed off, so a tier holding any attempt refuses.
ALLOW = {}


def load_specs(only=None):
    specs = {}
    for p in sorted(glob.glob(os.path.join(SPECS, '*.json'))):
        s = json.load(open(p), parse_float=decimal.Decimal)
        if only and s['course'] not in only:
            continue
        specs[s['course']] = s
    return specs


def num(x):
    return x if isinstance(x, int) else float(x)


def plan(caps, s):
    course = s['course']
    rows = {}
    for tier in TIERS:
        t = s['tiers'].get(tier)
        if not t:
            continue
        where = f'{course}/{tier}'
        cap = caps[(course, tier)]
        old = json.loads(dumps(cap['fields']), parse_float=decimal.Decimal)
        new = json.loads(dumps(cap['fields']), parse_float=decimal.Decimal)
        moves = []
        for tt in t.get('tighten', []):
            hit = [f for f in new if f['key'] == tt['key']]
            if len(hit) != 1:
                sys.exit(f'REFUSED: {where}: {tt["key"]} is not a live key exactly once')
            f = hit[0]
            if decimal.Decimal(str(f['tol'])) == decimal.Decimal(str(tt['tol_new'])):
                # a scratch this file was already applied to: its pre-image is the live row at tol_old
                [o] = [x for x in old if x['key'] == tt['key']]
                o['tol'] = num(tt['tol_old'])
            elif decimal.Decimal(str(f['tol'])) != decimal.Decimal(str(tt['tol_old'])):
                sys.exit(f'REFUSED: {where}: {tt["key"]} holds tol {f["tol"]}, the spec expects {tt["tol_old"]}')
            if decimal.Decimal(str(f['expected'])) != decimal.Decimal(str(tt['expected'])):
                sys.exit(f'REFUSED: {where}: {tt["key"]} holds expected {f["expected"]}, the spec expects {tt["expected"]}')
            if not decimal.Decimal(str(tt['tol_new'])) < decimal.Decimal(str(tt['tol_old'])):
                sys.exit(f'REFUSED: {where}: {tt["key"]} tol_new is not a tightening')
            f['tol'] = num(tt['tol_new'])
            moves.append((tt['key'], f['expected'], tt['tol_old'], tt['tol_new'], tt['why']))
        rows[(course, tier)] = {'prompt': cap['prompt'], 'dataset': cap['dataset'],
                                'old_fields': dumps(old), 'new_fields': dumps(new), 'moves': moves}
    return rows


def state_case(r, which):
    dc = f"md5(dataset) = '{md5(r['dataset'])}'" if r['dataset'] is not None else 'dataset is null'
    return f"md5(prompt) = '{md5(r['prompt'])}' and {dc} and fields = {q(r[f'{which}_fields'])}::jsonb"


def file_sql(s, rows):
    name = s['file']
    tag = f'hd {s["course"]}'
    tiers = sorted(rows, key=lambda k: TIERS.index(k[1]))
    n = len(tiers)
    decl = ['  v_n        integer;', '  v_count    integer;', '  v_written  integer := 0;', '  v_ids      jsonb;',
            '  v_extra    jsonb;', '  v_idtxt    text;',
            f"  v_allow    jsonb := {q(json.dumps(ALLOW, sort_keys=True))}::jsonb;  -- D5 allowlist: 'course/tier' -> attempt ids signed off"]
    decl += [f'  v_s{i}       text;' for i in range(n)]
    body = []
    for i, (course, tier) in enumerate(tiers):
        r = rows[(course, tier)]
        w = f"app_slug = {q(course)} and tier = {q(tier)} and active"
        body.append(f"""
  -- {course} / {tier}
  select count(*) into v_n from public.academy_capstones where {w};
  if v_n <> 1 then raise exception '{tag} refused: {course}/{tier} has % active capstone rows, expected 1', v_n; end if;
  select case when {state_case(r, 'old')} then 'old'
              when {state_case(r, 'new')} then 'new'
              else 'other' end
    into v_s{i} from public.academy_capstones where {w};
  if v_s{i} = 'other' then
    raise exception '{tag} refused: {course}/{tier} matches neither its post-W2-W6 form (prompt md5 {md5(r['prompt'])}, the fields this file was generated against) nor its HD form';
  end if;""")
    body.append('\n  -- nothing to write: every row is already in its HD form')
    body.append('  if ' + ' and '.join(f"v_s{i} = 'new'" for i in range(n)) + ' then')
    body.append(f"    raise notice '{tag}: 0 of {n} row(s) written, all already applied';")
    body.append('    return;')
    body.append('  end if;')
    body.append("""
  -- ATTEMPTS. A tier whose tolerance this file tightens must hold no capstone
  -- attempt (a stored score is never re-scored, but a learner could be graded
  -- differently on a retry), unless D5 allowlists it with the exact attempt
  -- ids signed off. Any other attempt refuses.""")
    for i, (course, tier) in enumerate(tiers):
        body.append(f"""  if v_s{i} = 'old' then
    select coalesce(jsonb_agg(a.id::text order by a.created_at, a.id), '[]'::jsonb) into v_ids
      from public.academy_capstone_attempts a where a.app_slug = {q(course)} and a.tier = {q(tier)};
    if jsonb_array_length(v_ids) > 0 then
      if v_allow ? '{course}/{tier}' then
        select coalesce(jsonb_agg(x), '[]'::jsonb) into v_extra
          from jsonb_array_elements(v_ids) x where not (v_allow->'{course}/{tier}') @> jsonb_build_array(x);
        if jsonb_array_length(v_extra) > 0 then
          select string_agg(x #>> '{{}}', ', ') into v_idtxt from jsonb_array_elements(v_extra) x;
          raise exception '{tag} refused: {course}/{tier} holds % attempt(s) outside its D5 allowlist: %', jsonb_array_length(v_extra), v_idtxt;
        end if;
        raise notice '{tag}: {course}/{tier} holds % allowlisted attempt(s) (D5 sign-off); their stored scores are not touched', jsonb_array_length(v_ids);
      else
        select string_agg(x #>> '{{}}', ', ') into v_idtxt from jsonb_array_elements(v_ids) x;
        raise exception '{tag} refused: {course}/{tier} holds % capstone attempt(s) (%) and this file tightens a tolerance on it; sign the tier off under D5 (allowlist with these ids) or hold it', jsonb_array_length(v_ids), v_idtxt;
      end if;
    end if;
  end if;""")
    for i, (course, tier) in enumerate(tiers):
        r = rows[(course, tier)]
        w = f"app_slug = {q(course)} and tier = {q(tier)} and active"
        body.append(f"""
  if v_s{i} = 'old' then
    update public.academy_capstones
       set fields = {q(r['new_fields'])}::jsonb
     where {w};
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception '{tag} refused: {course}/{tier} updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select ({state_case(r, 'new')}) from public.academy_capstones where {w}) is not true then
    raise exception '{tag} refused: {course}/{tier} does not read back as its HD form';
  end if;""")
    body.append(f"\n  raise notice '{tag}: % of {n} row(s) written, % already applied', v_written, {n} - v_written;")

    lines = []
    for course, tier in tiers:
        lines.append(f'-- {tier.upper()} (tighten)')
        for key, exp, t0, t1, why in rows[(course, tier)]['moves']:
            lines.append(f'--   TIGHTEN {key} (expected {exp}): tol {t0} -> {t1}')
            lines.append(wrap(why, lead='--   '))
        lines.append('--')
    moved = ', '.join(f'{c}/{t}' for c, t in tiers)
    att = ('Tiers this file writes: ' + moved + '. Before it writes, the file counts academy_capstone_attempts on each '
           'and REFUSES if any exist, unless D5 allowlists that tier with the exact attempt ids (allowlist: '
           + (json.dumps(ALLOW) if ALLOW else 'empty') + '). Stored scores are never touched.')
    header = f"""-- ============================================================================
-- HELD DECISIONS (HD): {name[:-4]}.
--
{wrap(str(s.get('decision', '')))}
-- Spec: docs/graded-field-audit/hd/{s['course']}.json. Applies AFTER the whole
-- W2-W6 batch (/root/w2w6-apply).
--
{chr(10).join(lines)}
-- WHAT DOES NOT MOVE. The title, status, prompt and dataset, and on every
-- field the key, label, unit, expected value and position; only the named
-- tolerances move.
--
{wrap('ATTEMPTS. ' + att)}
--
-- GUARDS. Each row must hold EITHER its post-W2-W6 prompt and dataset (by md5)
-- and fields (exact jsonb), as production holds them after the W2-W6 batch
-- (it is rewritten), OR its HD form (left alone). Anything else raises and the
-- whole file rolls back. Generated by docs/graded-field-audit/hd_capstones.py.
-- SAFE TO RE-RUN: a second run writes nothing.
-- ============================================================================
"""
    header = '\n'.join(l if l.strip() != '--   ' else '--' for l in header.split('\n'))
    return name, header + '\ndo $$\ndeclare\n' + '\n'.join(decl) + '\nbegin' + '\n'.join(body) + '\nend $$;\n'


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--container', default='hda-scratch')
    ap.add_argument('--check', action='store_true', help='fail if a committed migration differs from a regeneration')
    ap.add_argument('--course', action='append', help='limit to these courses')
    ap.add_argument('--out', help='write the migrations here instead of migrations/')
    a = ap.parse_args()
    caps = live(a.container)
    if len(caps) < 100:
        sys.exit(f'REFUSED: the scratch holds {len(caps)} live capstones')
    dest = a.out or MIG
    bad = 0
    for course, s in sorted(load_specs(a.course).items()):
        name, sql = file_sql(s, plan(caps, s))
        p = os.path.join(dest, name)
        if a.check:
            if not os.path.exists(p) or open(p).read() != sql:
                print('DIFFERS', name)
                bad += 1
            else:
                print('same', name)
        else:
            open(p, 'w').write(sql)
            print('wrote', name)
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
