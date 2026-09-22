#!/usr/bin/env python3
"""HELD DECISIONS (HD, 2026-09-22). Writes the guarded capstone re-key migrations.

  python3 hd_capstones.py [--container hdb-scratch] [--course C ...] [--check]

Reads the live capstones from a LOCAL scratch replay in the post-W2-W6 state
(/root/w2w6-post-restore.sh; never production) and writes one migration per
course spec in hd/<course>.json (the file name is the spec's `migration`). The
file joins the W2-W6 batch and applies after every W2-W6 file.

A tier's spec re-keys named fields in place:

  rekey         {live key: new key}. The new field (key, label, unit, expected,
                tol) is read from `fields_file`, which the course's engine
                generator writes (never by hand); it takes the old field's
                position. Every other field is carried over exactly.
  prompt_edits  [old, new] pairs, each old found exactly once in the live brief.

Every row is content-addressed: prompt, title and dataset by md5 and fields by
exact jsonb. It must hold its post-W2-W6 form (it is rewritten) or its HD form
(left alone); anything else raises and the file's transaction rolls back. A
file that will write also checks that the tier named by the spec's `after`
holds its live (post-W2-W6) form, so it refuses on a database the batch has
not reached. A re-key moves a graded key, so the file counts
academy_capstone_attempts on each tier it would write and refuses if any
exist, unless D5 allowlists the tier (ALLOW below: EMPTY). Stored scores are
never touched. Copy rule: no em or en dash, no new "X, not Y" contrastive.
`--check` regenerates in memory and fails if a committed migration differs.
"""
import argparse, glob, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import w5_capstones as w5  # noqa: E402  (shared helpers: dumps, q, md5, live, wrap, check_copy)

REPO = w5.REPO
MIG = w5.MIG
SPECS = os.path.join(HERE, 'hd')
TIERS = w5.TIERS

# D5: tiers signed off for a re-key although attempts exist. EMPTY.
ALLOW = {}


def load_specs(courses=None):
    specs = {}
    for p in sorted(glob.glob(os.path.join(SPECS, '*.json'))):
        s = json.load(open(p))
        if s.get('builder') != 'hdb':   # one generator per HD unit, as the waves do
            continue
        if courses and s['course'] not in courses:
            continue
        specs[s['course']] = s
    return specs


def engine_field(spec, tier, key):
    rows = [r for r in json.load(open(os.path.join(REPO, spec['fields_file']))) if r['tier'] == tier and r['key'] == key]
    if len(rows) != 1:
        sys.exit(f'REFUSED: {spec["course"]}/{tier}: {key} is in {spec["fields_file"]} {len(rows)} times')
    r = rows[0]
    return {'key': r['key'], 'tol': float(r['tol']), 'unit': r['unit'], 'label': r['label'],
            'expected': r['expected'] if isinstance(r['expected'], int) else float(r['expected'])}


def plan(caps, spec):
    course = spec['course']
    rows = {}
    for tier in TIERS:
        t = spec['tiers'].get(tier)
        if not t:
            continue
        cap = caps[(course, tier)]
        base = {'prompt': cap['prompt'], 'title': cap['title'], 'dataset': cap['dataset'], 'fields': w5.dumps(cap['fields'])}
        live_keys = [f['key'] for f in cap['fields']]
        fields = [dict(f) for f in cap['fields']]
        rekeys = []
        for old_key, new_key in t['rekey'].items():
            if old_key not in live_keys:
                sys.exit(f'REFUSED: {course}/{tier}: {old_key} is not a live key ({live_keys})')
            if new_key in live_keys:
                sys.exit(f'REFUSED: {course}/{tier}: new key {new_key} is already live')
            nf = engine_field(spec, tier, new_key)
            w5.check_copy(f'{course}/{tier} label', '', nf['label'])
            i = live_keys.index(old_key)
            old = {k: cap['fields'][i][k] for k in ('key', 'label', 'unit', 'expected', 'tol')}
            rekeys.append((old, nf))
            fields[i] = nf
        p = base['prompt']
        for a, b in t.get('prompt_edits', []):
            if p.count(a) != 1:
                sys.exit(f'REFUSED: {course}/{tier}: prompt anchor not found exactly once: {a[:90]!r}')
            w5.check_copy(f'{course}/{tier} prompt', a, b)
            p = p.replace(a, b)
        new = dict(base, prompt=p, fields=w5.dumps(fields))
        if new == base:
            sys.exit(f'REFUSED: {course}/{tier}: the spec changes nothing')
        rows[tier] = {'base': base, 'new': new, 'rekeys': rekeys, 'why': t.get('why', ''), 'moves': bool(rekeys)}
    return rows


def form_sql(f):
    return w5.form_sql(f)


def file_sql(spec, rows, caps):
    course = spec['course']
    tag = f"hd {course}"
    tiers = [t for t in TIERS if t in rows]
    n = len(tiers)
    after = caps[(course, spec['after']['tier'])]
    after_form = {'prompt': after['prompt'], 'title': after['title'], 'dataset': after['dataset'],
                  'fields': w5.dumps(after['fields'])}
    lines = []
    for t in tiers:
        r = rows[t]
        lines.append(f"-- {t.upper()}")
        lines.append(w5.wrap(r['why'], lead='--   '))
        for old, new in r['rekeys']:
            lines.append(f"--   RE-KEY {old['key']} (expected {old['expected']}, tol {old['tol']})")
            lines.append(f"--       -> {new['key']} '{new['label']}' {new['unit']}, expected {new['expected']!r}, tol {new['tol']!r}")
        for a, b in spec['tiers'][t].get('prompt_edits', []):
            lines.append(w5.wrap('PROMPT was: ' + a, lead='--   '))
            lines.append(w5.wrap('PROMPT now: ' + b, lead='--   '))
        lines.append('--')
    moved = [f'{course}/{t}' for t in tiers if rows[t]['moves']]
    header = f"""-- ============================================================================
-- HELD DECISIONS (HD, 2026-09-22): {course}.
--
-- Spec: docs/graded-field-audit/hd/{course}.json. The new keys come from
-- {spec['fields_file']},
-- written by the course's engine generator and re-checked in CI.
--
{chr(10).join(lines)}
-- WHAT DOES NOT MOVE. Every other field (key, label, unit, expected, tol and
-- position), the title, dataset, status and the row itself.
--
{w5.wrap('ATTEMPTS. Tiers whose graded keys move: ' + ', '.join(moved) + '. Before it writes, the file counts academy_capstone_attempts on each and REFUSES if any exist, unless D5 allowlists that tier with the exact attempt ids (allowlist: ' + (json.dumps(ALLOW) if ALLOW else 'empty') + '). Stored scores are never touched.')}
--
{w5.wrap('GUARDS. Each row must hold EITHER its post-W2-W6 form (prompt, title and dataset by md5, fields as exact jsonb), which is rewritten, OR its HD form, which is left alone. Anything else raises and the whole file rolls back. A file that will write first checks ' + course + '/' + spec['after']['tier'] + ' holds its post-W2-W6 form (' + spec['after']['why'] + ') and refuses without it. Generated by docs/graded-field-audit/hd_capstones.py. SAFE TO RE-RUN: a second run writes nothing.')}
--
-- NOT A DB STEP. The lessons that go with this file ship in the NextGen zip,
-- which must go live at nearly the same time as this apply.
-- ============================================================================
"""
    decl = ['  v_n        integer;', '  v_count    integer;', '  v_written  integer := 0;', '  v_ids      jsonb;',
            '  v_extra    jsonb;', '  v_idtxt    text;',
            f"  v_allow    jsonb := {w5.q(json.dumps(ALLOW, sort_keys=True))}::jsonb;  -- D5 allowlist: 'course/tier' -> attempt ids signed off"]
    decl += [f'  v_s{i}       text;' for i in range(n)]
    body = []
    for i, t in enumerate(tiers):
        w = f"app_slug = {w5.q(course)} and tier = {w5.q(t)} and active"
        b, nw = rows[t]['base'], rows[t]['new']
        body.append(f"""
  -- {course} / {t}
  select count(*) into v_n from public.academy_capstones where {w};
  if v_n <> 1 then raise exception '{tag} refused: {course}/{t} has % active capstone rows, expected 1', v_n; end if;
  select case when {form_sql(b)} then 'old'
              when {form_sql(nw)} then 'new'
              else 'other' end
    into v_s{i} from public.academy_capstones where {w};
  if v_s{i} = 'other' then
    raise exception '{tag} refused: {course}/{t} matches neither its post-W2-W6 form (prompt md5 {w5.md5(b['prompt'])}) nor its HD form (prompt md5 {w5.md5(nw['prompt'])}), with the fields this file was generated against';
  end if;""")
    body.append('\n  -- nothing to write: every row is already in its HD form')
    body.append('  if ' + ' and '.join(f"v_s{i} = 'new'" for i in range(n)) + ' then')
    body.append(f"    raise notice '{tag}: 0 of {n} row(s) written, all already applied';")
    body.append('    return;')
    body.append('  end if;')
    aw = f"app_slug = {w5.q(course)} and tier = {w5.q(spec['after']['tier'])} and active"
    body.append(f"""
  -- the W2-W6 batch must be applied first: this file joins it and applies after it
  if not exists (select 1 from public.academy_capstones where {aw} and {form_sql(after_form)}) then
    raise exception '{tag} refused: {course}/{spec['after']['tier']} is not in its post-W2-W6 form (prompt md5 {w5.md5(after_form['prompt'])}); apply the W2-W6 batch first';
  end if;""")
    body.append("""
  -- ATTEMPTS. A tier whose graded keys this file moves must hold no capstone
  -- attempt (a stored score is never re-scored, but a learner could be graded
  -- differently on a retry), unless D5 allowlists it with the exact attempt
  -- ids signed off. Any other attempt refuses.""")
    for i, t in enumerate(tiers):
        if not rows[t]['moves']:
            continue
        ct = f'{course}/{t}'
        body.append(f"""  if v_s{i} = 'old' then
    select coalesce(jsonb_agg(a.id::text order by a.created_at, a.id), '[]'::jsonb) into v_ids
      from public.academy_capstone_attempts a where a.app_slug = {w5.q(course)} and a.tier = {w5.q(t)};
    if jsonb_array_length(v_ids) > 0 then
      if v_allow ? '{ct}' then
        select coalesce(jsonb_agg(x), '[]'::jsonb) into v_extra
          from jsonb_array_elements(v_ids) x where not (v_allow->'{ct}') @> jsonb_build_array(x);
        if jsonb_array_length(v_extra) > 0 then
          select string_agg(x #>> '{{}}', ', ') into v_idtxt from jsonb_array_elements(v_extra) x;
          raise exception '{tag} refused: {ct} holds % attempt(s) outside its D5 allowlist: %', jsonb_array_length(v_extra), v_idtxt;
        end if;
        raise notice '{tag}: {ct} holds % allowlisted attempt(s) (D5 sign-off); their stored scores are not touched', jsonb_array_length(v_ids);
      else
        select string_agg(x #>> '{{}}', ', ') into v_idtxt from jsonb_array_elements(v_ids) x;
        raise exception '{tag} refused: {ct} holds % capstone attempt(s) (%) and this file moves its graded keys; sign the tier off under D5 (allowlist with these ids) or hold it', jsonb_array_length(v_ids), v_idtxt;
      end if;
    end if;
  end if;""")
    for i, t in enumerate(tiers):
        w = f"app_slug = {w5.q(course)} and tier = {w5.q(t)} and active"
        nw = rows[t]['new']
        body.append(f"""
  if v_s{i} = 'old' then
    update public.academy_capstones
       set prompt = {w5.q(nw['prompt'])},
           fields = {w5.q(nw['fields'])}::jsonb
     where {w};
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception '{tag} refused: {course}/{t} updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select ({form_sql(nw)}) from public.academy_capstones where {w}) is not true then
    raise exception '{tag} refused: {course}/{t} does not read back as its HD form';
  end if;""")
    body.append(f"\n  raise notice '{tag}: % of {n} row(s) written, % already applied', v_written, {n} - v_written;")
    return header + '\ndo $$\ndeclare\n' + '\n'.join(decl) + '\nbegin' + '\n'.join(body) + '\nend $$;\n'


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--container', default='hdb-scratch')
    ap.add_argument('--course', action='append')
    ap.add_argument('--check', action='store_true')
    a = ap.parse_args()
    caps = w5.live(a.container)
    if len(caps) < 100:
        sys.exit(f'REFUSED: the scratch holds {len(caps)} live capstones')
    bad = 0
    for course, spec in sorted(load_specs(a.course).items()):
        sql = file_sql(spec, plan(caps, spec), caps)
        p = os.path.join(MIG, spec['migration'])
        if a.check:
            same = os.path.exists(p) and open(p).read() == sql
            print('same' if same else 'DIFFERS', spec['migration'])
            bad += not same
        else:
            open(p, 'w').write(sql)
            print('wrote', spec['migration'])
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
