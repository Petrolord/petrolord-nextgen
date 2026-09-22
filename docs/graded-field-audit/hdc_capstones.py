#!/usr/bin/env python3
"""HELD DECISIONS (HD), 2026-09-22. Writes the guarded capstone migrations.

  python3 hd_capstones.py [--container hdc-scratch] [--check]

Owner instruction 2026-09-22: "Proceed to implement your recommendations for
the held decisions". Each unit is a spec hd/<course>.json (wave `hd`, kind
`rekey`, its migration name `20261030<x>_hd_<course>.sql`), read against a
LOCAL scratch in the post-W2-W6 state (/root/w2w6-post-restore.sh; never
production). The file applies AFTER the whole W2-W6 batch.

A re-key replaces one live field (key, label, unit, expected, tol) in place and
edits the brief (`prompt_edits`, each an exact passage of the live prompt). The
new `expected` is the vendored engine's value: the course's guard test
compares the committed migration with the engine exactly. Every file that
moves a key, an expected or a tol carries the attempts guard of
w1_capstones.py: it counts academy_capstone_attempts on the tier and refuses if
any exist, unless D5 allowlists it (ALLOW below, empty). Stored scores are
never touched.

Every row is content-addressed: its prompt must hold the md5 it was generated
against and its dataset and fields the exact values (it is rewritten), or its
HD form (left alone); anything else raises and the file's transaction rolls
back. Copy rule: no em or en dash, no new "X, not Y" contrastive. `--check`
regenerates in memory and fails if a committed migration differs.
"""
import argparse, glob, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from w1_capstones import dumps, q, md5, live, wrap, check_copy, MIG  # noqa: E402

SPECS = os.path.join(HERE, 'hd')

# D5: tiers signed off for a re-key although attempts exist, with the exact
# attempt ids expected. HD signs nothing off, so it is empty.
ALLOW = {}


def load_specs():
    out = {}
    for p in sorted(glob.glob(os.path.join(SPECS, '*.json'))):
        s = json.load(open(p))
        out[s['course']] = s
    return out


def new_row(course, tier, t, cap):
    """The HD form of one live row: its brief with the edits, its fields with the re-keys."""
    prompt = cap['prompt']
    for a, b in t.get('prompt_edits', []):
        if prompt.count(a) != 1:
            sys.exit(f'REFUSED: {course}/{tier}: prompt passage found {prompt.count(a)} times: {a[:80]!r}')
        check_copy(f'{course}/{tier} prompt', a, b)
        prompt = prompt.replace(a, b)
    fields, seen = [], set()
    for f in cap['fields']:
        nf = t.get('fields', {}).get(f['key'])
        if nf is None:
            fields.append(f)
            continue
        seen.add(f['key'])
        check_copy(f'{course}/{tier} label', f['label'], nf['label'])
        fields.append({'key': nf['key'], 'tol': float(nf['tol']), 'unit': nf['unit'], 'label': nf['label'],
                       'expected': float(nf['expected'])})
    missing = set(t.get('fields', {})) - seen
    if missing:
        sys.exit(f'REFUSED: {course}/{tier}: the live row holds no field {sorted(missing)}')
    keys = [f['key'] for f in fields]
    if len(set(keys)) != len(keys):
        sys.exit(f'REFUSED: {course}/{tier}: a re-key duplicates a live key {keys}')
    return prompt, fields


def file_sql(course, spec, caps):
    tag = f"hd {course}"
    tiers = [t for t in ('beginner', 'intermediate', 'advanced') if t in spec['tiers']]
    lines, rows = [], []
    for i, tier in enumerate(tiers):
        t = spec['tiers'][tier]
        cap = caps[(course, tier)]
        np_, nf = new_row(course, tier, t, cap)
        of = dumps(cap['fields'])
        rows.append((tier, cap['prompt'], cap['dataset'], of, np_, dumps(nf)))
        lines.append(f'-- {tier.upper()}')
        for w in t['why']:
            lines.append(wrap(w, lead='--   '))
        for f in cap['fields']:
            n = t.get('fields', {}).get(f['key'])
            if n:
                lines.append(f"--   RE-KEY {f['key']} (expected {f['expected']}, tol {f['tol']})")
                lines.append(f"--       -> {n['key']} '{n['label']}' {n['unit']}, expected {float(n['expected'])!r}, tol {float(n['tol'])!r}")
        for a, b in t.get('prompt_edits', []):
            lines.append(wrap('PROMPT was: ' + a, lead='--   '))
            lines.append(wrap('PROMPT now: ' + b, lead='--   '))
        if t.get('lessons'):
            lines.append(wrap('LESSONS (NextGen zip): ' + ', '.join(t['lessons']), lead='--   '))
        lines.append('--')
    moved = ', '.join(f'{course}/{t}' for t in tiers)
    allow = json.dumps(ALLOW) if ALLOW else 'empty'
    header = f"""-- ============================================================================
-- HELD DECISIONS (HD): {course}.
--
{wrap(spec['decision'])}
-- Spec: docs/graded-field-audit/hd/{course}.json. Applies AFTER the whole
-- W2-W6 batch (its base row is the post-W2-W6 form).
--
{chr(10).join(lines)}
-- WHAT DOES NOT MOVE. Every other field (key, label, unit, expected, tol and
-- position), the title, dataset, status and the row itself.
--
{wrap(f'ATTEMPTS. Tiers whose graded key moves: {moved}. Before it writes, the file counts academy_capstone_attempts on each and REFUSES if any exist, unless D5 allowlists that tier with the exact attempt ids (allowlist: {allow}). Stored scores are never touched.')}
--
-- GUARDS. Each row must hold EITHER its post-W2-W6 prompt (by md5), dataset
-- and fields (exact jsonb) (it is rewritten), OR its HD form (left alone).
-- Anything else raises and the whole file rolls back. Generated by
-- docs/graded-field-audit/hd_capstones.py. SAFE TO RE-RUN: a second run
-- writes nothing.
-- ============================================================================
"""
    decl = ['  v_n        integer;', '  v_count    integer;', '  v_written  integer := 0;', '  v_ids      jsonb;',
            '  v_extra    jsonb;', '  v_idtxt    text;',
            f"  v_allow    jsonb := {q(json.dumps(ALLOW, sort_keys=True))}::jsonb;  -- D5 allowlist: 'course/tier' -> attempt ids signed off"]
    decl += [f'  v_s{i}       text;' for i in range(len(rows))]
    body = []
    for i, (tier, op, ds, of, np_, nf) in enumerate(rows):
        w = f"app_slug = {q(course)} and tier = {q(tier)} and active"
        dsc = 'dataset is null' if ds is None else f"dataset = {q(ds)}"
        body.append(f"""
  -- {course} / {tier}
  select count(*) into v_n from public.academy_capstones where {w};
  if v_n <> 1 then raise exception '{tag} refused: {course}/{tier} has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '{md5(op)}' and {dsc} and fields = {q(of)}::jsonb then 'old'
              when md5(prompt) = '{md5(np_)}' and {dsc} and fields = {q(nf)}::jsonb then 'new'
              else 'other' end
    into v_s{i} from public.academy_capstones where {w};
  if v_s{i} = 'other' then
    raise exception '{tag} refused: {course}/{tier} matches neither its post-W2-W6 form (prompt md5 {md5(op)}) nor its HD form (prompt md5 {md5(np_)}), with the dataset and fields this file was generated against';
  end if;""")
    body.append('\n  -- nothing to write: every row is already in its HD form')
    body.append('  if ' + ' and '.join(f"v_s{i} = 'new'" for i in range(len(rows))) + ' then')
    body.append(f"    raise notice '{tag}: 0 of {len(rows)} row(s) written, all already applied';")
    body.append('    return;')
    body.append('  end if;')
    body.append("""
  -- ATTEMPTS. A tier whose graded key this file moves must hold no capstone
  -- attempt (a stored score is never re-scored, but a learner could be graded
  -- differently on a retry of the same brief), unless D5 allowlists it with the
  -- exact attempt ids signed off. Any other attempt refuses.""")
    for i, (tier, *_rest) in enumerate(rows):
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
    for i, (tier, op, ds, of, np_, nf) in enumerate(rows):
        w = f"app_slug = {q(course)} and tier = {q(tier)} and active"
        dsc = 'dataset is null' if ds is None else f"dataset = {q(ds)}"
        dset = 'null' if ds is None else q(ds)
        body.append(f"""
  if v_s{i} = 'old' then
    update public.academy_capstones
       set prompt = {q(np_)},
           dataset = {dset},
           fields = {q(nf)}::jsonb
     where {w};
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception '{tag} refused: {course}/{tier} updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '{md5(np_)}' and {dsc} and fields = {q(nf)}::jsonb) from public.academy_capstones where {w}) is not true then
    raise exception '{tag} refused: {course}/{tier} does not read back as its HD form';
  end if;""")
    body.append(f"\n  raise notice '{tag}: % of {len(rows)} row(s) written, % already applied', v_written, {len(rows)} - v_written;")
    return header + '\ndo $$\ndeclare\n' + '\n'.join(decl) + '\nbegin' + '\n'.join(body) + '\nend $$;\n'


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--container', default='hdc-scratch')
    ap.add_argument('--check', action='store_true', help='fail if a committed migration differs from a regeneration')
    a = ap.parse_args()
    caps = live(a.container)
    if len(caps) < 100:
        sys.exit(f'REFUSED: the scratch holds {len(caps)} live capstones')
    bad = 0
    for course, spec in load_specs().items():
        if spec.get('kind') != 'rekey':
            sys.exit(f'REFUSED: {course}: hd_capstones.py writes kind rekey only')
        sql = file_sql(course, spec, caps)
        p = os.path.join(MIG, spec['migration'])
        if a.check:
            if not os.path.exists(p) or open(p).read() != sql:
                print('DIFFERS', spec['migration'])
                bad += 1
            else:
                print('same', spec['migration'])
        else:
            open(p, 'w').write(sql)
            print('wrote', spec['migration'])
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
