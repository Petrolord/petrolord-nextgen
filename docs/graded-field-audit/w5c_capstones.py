#!/usr/bin/env python3
"""B5 FOLLOW-ON, WAVE 5 (part c): the leak re-case (pick A) and strip (pick B)
for welldata, scal, petrophysics, mbal and welltest. Writes the guarded
capstone migrations.

  python3 w5c_capstones.py [--container w5c-scratch] [--check]

Reads the live capstones from a LOCAL scratch replay in the post-W1 state
(production today: the mirror, B4, B5, the round-off and the W1 34 files;
never production) and writes

  migrations/20261028c_w5_<course>.sql   (and any per-tier file a spec names)

    pick A (re-case): the tier's capstone moves to a case no panel preloads.
      Its prompt and dataset are replaced, and every graded field is re-keyed
      to a value regenerated from the vendored engine on the new case (the
      spec's `fields_from`, written by the course's case generator). The W1
      open-book label goes, because nothing is printed any more. Every file
      that re-keys carries the attempts guard of
      20260921_lesson_leak_grader_tolerances.sql: it counts
      academy_capstone_attempts on each tier it would re-key and refuses if any
      exist, unless D5 allowlists the tier (ALLOW below: the tier and the exact
      attempt ids signed off; any other id refuses). Stored scores are never
      touched.
    pick B (strip): the lessons and panels stop printing the answers (NextGen
      zip); the keys, expected values and tolerances stay. The W1 open-book
      label goes from the brief. Prompt only, so no attempts guard.

The specs are w5c/<course>.json. Every row is content-addressed: its prompt
and dataset must hold the md5 they were generated against and its fields the
exact jsonb (it is rewritten), or its W5 form (left alone); anything else
raises and the file's transaction rolls back. Because the rewritten form is
the W1 post-state (the open-book label is in the md5), a database without W1
refuses too. Copy rule: no em or en dash, no new "X, not Y" contrastive.
`--check` regenerates in memory and fails if a committed migration differs.
"""
import argparse, decimal, glob, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from w1_capstones import (dumps, q, md5, live, wrap, check_copy,  # noqa: E402
                          LABEL_ALL, LABEL_SOME, END_A, END_B)

REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
MIG = os.path.join(REPO, 'migrations')
SPECS = os.path.join(HERE, 'w5c')
PREFIX = '20261028c_w5_'
TIERS = ('beginner', 'intermediate', 'advanced')

# D5: tiers signed off for a re-key although attempts exist, with the exact
# attempt ids expected. To sign a tier off: add 'course/tier': ['<uuid>', ...] from
# `/root/w5c-apply/apply.sh attempts` and regenerate. Any id not listed refuses.
# Signed off by the owner 2026-09-23 from `/root/w2w6-apply/apply.sh attempts`
# on production: the petrophysics beginner ids are the pioneer cohort's
# capstone attempts (3 passed, 1 failed); the welldata beginner ids are one
# run of test attempts on 2026-08-21. Stored scores and certificates are not
# touched; a retry is graded on the new case.
ALLOW = {
    'petrophysics/beginner': [
        '4d4e7c7b-5907-44fd-b79a-db381bfefb7b',
        '85712d45-1ea6-4b3e-a2fe-add4f23e8bd1',
        'fd1e594d-4963-4ddf-abdf-0bf375c9aa26',
        '6ab22d5e-b5e0-4bd6-aa92-3d529d5e175e',
    ],
    'welldata/beginner': [
        '494f7d7d-af88-48f9-abaa-683d922164a7',
        '09b0d455-b4a5-4cb8-b9c0-b22e12d2ae54',
        'dfa55a33-f21f-44ef-8d90-56bef52c47fa',
        'b8fc9345-4063-4dc8-bf4c-8e3f57a68144',
        '1d3834e3-ce9a-44ce-88c1-458e082067ad',
        'f5e4dfe0-f46d-43f2-a26c-ac5087efcc8f',
        '0a216e47-7970-4e0a-9ac6-18c7094469b6',
    ],
}

W1_LABELS = [a + b for a in (LABEL_ALL, LABEL_SOME) for b in (END_A, END_B)]


def strip_label(where, prompt):
    for lab in W1_LABELS:
        if prompt.startswith(lab + ' '):
            return prompt[len(lab) + 1:]
    sys.exit(f'REFUSED: {where}: the brief does not open with a W1 open-book label')


def load_specs(only=None):
    specs = {}
    for p in sorted(glob.glob(os.path.join(SPECS, '*.json'))):
        s = json.load(open(p))
        if only and s['course'] not in only:
            continue
        specs[s['course']] = s
    return specs


def spec_fields(spec, tier):
    t = spec['tiers'][tier]
    return json.load(open(os.path.join(HERE, t['fields_from'])), parse_float=decimal.Decimal)[tier]


def plan(caps, specs):
    rows = {}
    for course, s in sorted(specs.items()):
        for tier in TIERS:
            t = s['tiers'].get(tier)
            if not t:
                continue
            cap = caps[(course, tier)]
            where = f'{course}/{tier}'
            base = strip_label(where, cap['prompt'])
            fields = json.loads(dumps(cap['fields']), parse_float=decimal.Decimal)
            dataset = cap['dataset']
            rekeys = []
            if t['pick'] == 'A':
                prompt = t['prompt']
                check_copy(f'{where} prompt', base, prompt)
                dataset = t.get('dataset', dataset)
                check_copy(f'{where} dataset', cap['dataset'] or '', dataset or '')
                new = spec_fields(s, tier)
                if len(new) != len(fields):
                    sys.exit(f'REFUSED: {where}: {len(new)} new fields for {len(fields)} live ones')
                keys_new = [f['key'] for f in new]
                if len(set(keys_new)) != len(keys_new):
                    sys.exit(f'REFUSED: {where}: duplicate new keys')
                out = []
                for old, nf in zip(fields, new):
                    nf = {'key': nf['key'], 'tol': num(nf['tol']), 'unit': nf['unit'], 'label': nf['label'],
                          'expected': num(nf['expected'])}
                    check_copy(f'{where} label', '', nf['label'])
                    if nf['key'] not in t.get('annot', {}):
                        sys.exit(f'REFUSED: {where}: new field {nf["key"]} carries no annotation')
                    rekeys.append((dict(old), nf))
                    out.append(nf)
                fields = out
            elif t['pick'] == 'B':
                prompt = base
                for a, b in t.get('prompt_edits', []):
                    if prompt.count(a) != 1:
                        sys.exit(f'REFUSED: {where}: prompt anchor not found exactly once: {a[:90]!r}')
                    check_copy(f'{where} prompt', a, b)
                    prompt = prompt.replace(a, b)
            else:
                sys.exit(f'REFUSED: {where}: pick {t["pick"]!r} is not A or B')
            rows[(course, tier)] = {
                'file': t.get('file', f'{PREFIX}{course}.sql'), 'pick': t['pick'], 'why': t.get('why', ''),
                'd5': t.get('d5'),
                'old_prompt': cap['prompt'], 'old_dataset': cap['dataset'], 'old_fields': dumps(cap['fields']),
                'new_prompt': prompt, 'new_dataset': dataset, 'new_fields': dumps(fields),
                'rekeys': rekeys, 'moves_fields': bool(rekeys)}
    return rows


def num(x):
    """A count stays an integer in the jsonb (as the published counts are); anything else is a float."""
    return x if isinstance(x, int) else float(x)


def state_case(r, which):
    p, d, f = r[f'{which}_prompt'], r[f'{which}_dataset'], r[f'{which}_fields']
    dc = f"md5(dataset) = '{md5(d)}'" if d is not None else 'dataset is null'
    return f"md5(prompt) = '{md5(p)}' and {dc} and fields = {q(f)}::jsonb"


def file_sql(name, tiers, rows):
    tag = f'w5c {name[len(PREFIX):-4]}'
    n = len(tiers)
    guard = any(rows[k]['moves_fields'] for k in tiers)
    decl = ['  v_n        integer;', '  v_count    integer;', '  v_written  integer := 0;', '  v_ids      jsonb;',
            '  v_extra    jsonb;', '  v_idtxt    text;',
            f"  v_allow    jsonb := {q(json.dumps(ALLOW, sort_keys=True))}::jsonb;  -- D5 allowlist: 'course/tier' -> attempt ids signed off"]
    decl += [f'  v_s{i}       text;' for i in range(n)]
    body = []
    for i, k in enumerate(tiers):
        course, tier = k
        r = rows[k]
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
    raise exception '{tag} refused: {course}/{tier} matches neither its post-W1 form (prompt md5 {md5(r['old_prompt'])}) nor its W5 form (prompt md5 {md5(r['new_prompt'])}), with the dataset and fields this file was generated against';
  end if;""")
    body.append('\n  -- nothing to write: every row is already in its W5 form')
    body.append('  if ' + ' and '.join(f"v_s{i} = 'new'" for i in range(n)) + ' then')
    body.append(f"    raise notice '{tag}: 0 of {n} row(s) written, all already applied';")
    body.append('    return;')
    body.append('  end if;')
    if guard:
        body.append("""
  -- ATTEMPTS. A tier whose graded keys this file moves must hold no capstone
  -- attempt (a stored score is never re-scored, but a learner could be graded
  -- differently on a retry), unless D5 allowlists it with the exact attempt
  -- ids signed off. Any other attempt refuses.""")
        for i, k in enumerate(tiers):
            course, tier = k
            if not rows[k]['moves_fields']:
                continue
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
        raise exception '{tag} refused: {course}/{tier} holds % capstone attempt(s) (%) and this file re-keys it; sign the tier off under D5 (allowlist with these ids) or hold it', jsonb_array_length(v_ids), v_idtxt;
      end if;
    end if;
  end if;""")
    for i, k in enumerate(tiers):
        course, tier = k
        r = rows[k]
        w = f"app_slug = {q(course)} and tier = {q(tier)} and active"
        ds = q(r['new_dataset']) if r['new_dataset'] is not None else 'null'
        body.append(f"""
  if v_s{i} = 'old' then
    update public.academy_capstones
       set prompt = {q(r['new_prompt'])},
           dataset = {ds},
           fields = {q(r['new_fields'])}::jsonb
     where {w};
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception '{tag} refused: {course}/{tier} updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select ({state_case(r, 'new')}) from public.academy_capstones where {w}) is not true then
    raise exception '{tag} refused: {course}/{tier} does not read back as its W5 form';
  end if;""")
    body.append(f"\n  raise notice '{tag}: % of {n} row(s) written, % already applied', v_written, {n} - v_written;")

    lines = []
    for k in tiers:
        r = rows[k]
        lines.append(f'-- {k[1].upper()} (pick {r["pick"]}: {"re-case" if r["pick"] == "A" else "strip"})')
        if r['why']:
            lines.append(wrap(r['why'], lead='--   '))
        if r['d5']:
            lines.append(wrap('D5: ' + r['d5'], lead='--   '))
        for old, new in r['rekeys']:
            lines.append(f"--   RE-KEY {old['key']} (expected {old['expected']}, tol {old['tol']})")
            lines.append(f"--       -> {new['key']} '{new['label']}' {new['unit']}, expected {new['expected']!r}, tol {new['tol']!r}")
        if r['pick'] == 'A':
            lines.append('--   PROMPT and DATASET replaced (the new case, stated in full; the W1 open-book label goes).')
        else:
            lines.append('--   PROMPT: the W1 open-book label goes; keys, expected values and tolerances stay.')
        lines.append('--')
    moved = [f'{k[0]}/{k[1]}' for k in tiers if rows[k]['moves_fields']]
    att = (('Tiers this file re-keys: ' + ', '.join(moved) + '. Before it writes, the file counts academy_capstone_attempts '
            'on each and REFUSES if any exist, unless D5 allowlists that tier with the exact attempt ids (allowlist: '
            + (json.dumps(ALLOW) if ALLOW else 'empty') + '). Stored scores are never touched.') if guard else
           'This file moves no graded key or tolerance (prompt copy only), so no attempt can be graded differently and there is no attempts guard.')
    header = f"""-- ============================================================================
-- B5 FOLLOW-ON W5 (part c), section 3: {name[:-4]}.
--
-- Plan of record: docs/graded-field-audit/FOLLOW-ON-PROGRAMME.md section 3
-- (D4 picks A and B) and the spec docs/graded-field-audit/w5c/{tiers[0][0]}.json.
-- Owner approved D1 to D7 as recommended, 2026-09-21.
--
{chr(10).join(lines)}
-- WHAT DOES NOT MOVE. The title, status and the row itself; on a pick B tier
-- also every field (key, label, unit, expected, tol and position) and the
-- dataset.
--
{wrap('ATTEMPTS. ' + att)}
--
-- GUARDS. Each row must hold EITHER its post-W1 prompt and dataset (by md5)
-- and fields (exact jsonb), as production holds them after the W1 34 files
-- (it is rewritten), OR its W5 form (left alone). Anything else raises and the
-- whole file rolls back. Lessons and panels ship with the NextGen zip, near-
-- simultaneous with this apply. Generated by
-- docs/graded-field-audit/w5c_capstones.py. SAFE TO RE-RUN: a second run
-- writes nothing.
-- ============================================================================
"""
    header = '\n'.join(l if l.strip() != '--   ' else '--' for l in header.split('\n'))
    return header + '\ndo $$\ndeclare\n' + '\n'.join(decl) + '\nbegin' + '\n'.join(body) + '\nend $$;\n'


def build(caps, only=None):
    specs = load_specs(only)
    rows = plan(caps, specs)
    by_file = {}
    for k in sorted(rows, key=lambda k: (k[0], TIERS.index(k[1]))):
        by_file.setdefault(rows[k]['file'], []).append(k)
    return {name: file_sql(name, tiers, rows) for name, tiers in by_file.items()}, rows


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--container', default='w5c-scratch')
    ap.add_argument('--check', action='store_true', help='fail if a committed migration differs from a regeneration')
    ap.add_argument('--course', action='append', help='limit to these courses')
    ap.add_argument('--out', help='write the migrations here instead of migrations/')
    a = ap.parse_args()
    caps = live(a.container)
    if len(caps) < 100:
        sys.exit(f'REFUSED: the scratch holds {len(caps)} live capstones')
    out, rows = build(caps, a.course)
    dest = a.out or MIG
    bad = 0
    for name, sql in sorted(out.items()):
        p = os.path.join(dest, name)
        if a.check:
            if not os.path.exists(p) or open(p).read() != sql:
                print('DIFFERS', name)
                bad += 1
        else:
            open(p, 'w').write(sql)
            print('wrote', name)
    if not a.course:
        stale = set(os.path.basename(p) for p in glob.glob(os.path.join(dest, PREFIX + '*.sql'))) - set(out)
        for s in sorted(stale):
            print('STALE (not generated):', s)
            bad += 1
    print(f'{len(out)} file(s); {sum(1 for r in rows.values() if r["moves_fields"])} tier(s) re-keyed; '
          f'{sum(1 for r in rows.values() if not r["moves_fields"])} tier(s) prompt only')
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
