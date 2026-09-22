#!/usr/bin/env python3
"""B5 FOLLOW-ON, WAVE 5 (leak re-case and strip). Writes the guarded capstone migrations.

  python3 w5_capstones.py [--container w5a-scratch] [--course C ...] [--check]

Reads the live capstones from a LOCAL scratch replay in the post-W1 state
(production mirror + B4 length + B4 fixes/B5 + round-off + W1; never production)
and writes one migration per course spec in w5/<course>.json (the file name is
the spec's `migration`). Section 3 of FOLLOW-ON-PROGRAMME.md, decisions D4 and D5.

A tier's spec is one of two kinds.

  pick A (re-case). The capstone moves onto a case of its own that no panel
      preloads and no lesson works. `fields_file` (a JSON list written by the
      course's engine generator, never by hand) holds the new graded fields in
      capstone order; `rekey` names the LIVE keys they replace, position by
      position, and must equal the live key list exactly. The prompt, and
      optionally the title and dataset, are replaced whole, which also drops the
      W1 open-book label (D4 C). Every field moves, so the file carries the
      attempts guard.
  pick B (strip). The keys stay. `prompt_edits` ([old, new] pairs, each old
      found exactly once) take the open-book label out of the brief once the
      lessons and panels stop printing the answers. No key, expected value or
      tolerance moves, so there is no attempts guard.

Every row is content-addressed: prompt, title and dataset by md5 and fields by
exact jsonb. It must hold its post-W1 form (it is rewritten) or its W5 form
(left alone); anything else raises and the file's transaction rolls back. A
file that moves a key or tolerance counts academy_capstone_attempts on each
tier it would write and refuses if any exist, unless D5 allowlists the tier
(ALLOW below: the tier and the exact attempt ids signed off; any other id
refuses). Stored scores are never touched. Copy rule: no em or en dash, no new
"X, not Y" contrastive. `--check` regenerates in memory and fails if a
committed migration differs.
"""
import argparse, decimal, glob, hashlib, json, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
MIG = os.path.join(REPO, 'migrations')
SPECS = os.path.join(HERE, 'w5')
TIERS = ('beginner', 'intermediate', 'advanced')

DASH = re.compile('[–—]')
CONTRAST = re.compile(r',\s*not\b(?!-)')

# D5: tiers signed off for a re-key although attempts exist, with the exact
# attempt ids expected. EMPTY unless the lead passes owner-signed ids. To sign a
# tier off: add ('course/tier', ['<uuid>', ...]) and regenerate.
ALLOW = {}


def dumps(v):
    """jsonb text that keeps every published number exactly as stored."""
    if isinstance(v, decimal.Decimal):
        return str(v)
    if isinstance(v, bool):
        return 'true' if v else 'false'
    if isinstance(v, float):
        return repr(v)
    if isinstance(v, dict):
        return '{' + ', '.join(json.dumps(k) + ': ' + dumps(x) for k, x in v.items()) + '}'
    if isinstance(v, list):
        return '[' + ', '.join(dumps(x) for x in v) + ']'
    return json.dumps(v, ensure_ascii=False)


def q(s):
    return 'null' if s is None else "'" + s.replace("'", "''") + "'"


def md5(s):
    return hashlib.md5((s or '').encode()).hexdigest()


def live(container):
    sql = ("select coalesce(json_agg(json_build_object('app', app_slug, 'tier', tier, 'title', title, 'prompt', prompt, "
           "'dataset', dataset, 'fields', fields::text) order by app_slug, tier), '[]') "
           "from public.academy_capstones where active")
    out = subprocess.run(['docker', 'exec', container, 'psql', '-U', 'postgres', '-tAc', sql],
                         capture_output=True, text=True, check=True).stdout
    caps = {}
    for c in json.loads(out):
        c['fields'] = json.loads(c['fields'], parse_float=decimal.Decimal)
        caps[(c['app'], c['tier'])] = c
    return caps


def wrap(text, width=76, lead='-- '):
    out, line = [], ''
    for w in text.split():
        if len(line) + len(w) + 1 > width:
            out.append(line)
            line = w
        else:
            line = (line + ' ' + w).strip()
    if line:
        out.append(line)
    return '\n'.join(lead + l for l in out)


def check_copy(where, old, new):
    if DASH.search(new or ''):
        sys.exit(f'REFUSED: {where}: em or en dash in new copy {new[:80]!r}')
    if len(CONTRAST.findall(new or '')) > len(CONTRAST.findall(old or '')):
        sys.exit(f'REFUSED: {where}: new "X, not Y" contrastive in {new[:120]!r}')


def load_specs(courses=None):
    specs = {}
    for p in sorted(glob.glob(os.path.join(SPECS, '*.json'))):
        s = json.load(open(p))
        if courses and s['course'] not in courses:
            continue
        specs[s['course']] = s
    return specs


def new_fields(spec, tier):
    """The re-cased tier's graded fields, from the engine generator's output."""
    rows = json.load(open(os.path.join(REPO, spec['fields_file'])))
    out = []
    for r in rows:
        if r['tier'] != tier:
            continue
        out.append({'key': r['key'], 'tol': float(r['tol']), 'unit': r['unit'], 'label': r['label'],
                    'expected': r['expected'] if isinstance(r['expected'], int) else float(r['expected'])})
    return out


def plan(caps, spec):
    course = spec['course']
    rows = {}
    for tier in TIERS:
        t = spec['tiers'].get(tier)
        if not t:
            continue
        cap = caps[(course, tier)]
        base = {'prompt': cap['prompt'], 'title': cap['title'], 'dataset': cap['dataset'], 'fields': dumps(cap['fields'])}
        live_keys = [f['key'] for f in cap['fields']]
        new = dict(base)
        rekeys = []
        if t['pick'] == 'A':
            if t['rekey'] != live_keys:
                sys.exit(f'REFUSED: {course}/{tier}: rekey {t["rekey"]} is not the live key list {live_keys}')
            nf = new_fields(spec, tier)
            if len(nf) != len(live_keys):
                sys.exit(f'REFUSED: {course}/{tier}: {len(nf)} new fields for {len(live_keys)} live ones')
            for i, f in enumerate(nf):
                check_copy(f'{course}/{tier} label', '', f['label'])
                if f['key'] in live_keys and f['key'] != live_keys[i]:
                    sys.exit(f'REFUSED: {course}/{tier}: new key {f["key"]} collides with another live key')
                old = {k: cap['fields'][i][k] for k in ('key', 'label', 'unit', 'expected', 'tol')}
                rekeys.append((old, f))
            new['fields'] = dumps(nf)
            check_copy(f'{course}/{tier} prompt', '', t['prompt'])
            new['prompt'] = t['prompt']
            if 'Open book' in new['prompt']:
                sys.exit(f'REFUSED: {course}/{tier}: a re-cased brief still carries the open-book label')
            for k in ('title', 'dataset'):
                if t.get(k):
                    check_copy(f'{course}/{tier} {k}', base[k], t[k])
                    new[k] = t[k]
        elif t['pick'] == 'B':
            p = base['prompt']
            for a, b in t.get('prompt_edits', []):
                if p.count(a) != 1:
                    sys.exit(f'REFUSED: {course}/{tier}: prompt anchor not found exactly once: {a[:90]!r}')
                check_copy(f'{course}/{tier} prompt', a, b)
                p = p.replace(a, b)
            new['prompt'] = p
        else:
            sys.exit(f'REFUSED: {course}/{tier}: pick {t["pick"]!r} is not A or B')
        if new == base:
            sys.exit(f'REFUSED: {course}/{tier}: the spec changes nothing')
        rows[tier] = {'base': base, 'new': new, 'rekeys': rekeys, 'pick': t['pick'], 'why': t.get('why', ''),
                      'moves': bool(rekeys)}
    return rows


def form_sql(f):
    return (f"md5(prompt) = '{md5(f['prompt'])}' and md5(coalesce(title, '')) = '{md5(f['title'])}' "
            f"and md5(coalesce(dataset, '')) = '{md5(f['dataset'])}' and fields = {q(f['fields'])}::jsonb")


def file_sql(spec, rows):
    course = spec['course']
    tag = f"{spec['wave']} {course}"
    tiers = [t for t in TIERS if t in rows]
    n = len(tiers)
    guard = any(rows[t]['moves'] for t in tiers)
    lines = []
    for t in tiers:
        r = rows[t]
        lines.append(f"-- {t.upper()}: pick {r['pick']} ({'re-case' if r['pick'] == 'A' else 'strip'})")
        if r['why']:
            lines.append(wrap(r['why'], lead='--   '))
        for old, new in r['rekeys']:
            lines.append(f"--   {old['key']} ({old['expected']}, tol {old['tol']})")
            lines.append(f"--       -> {new['key']} '{new['label']}' {new['unit']}, expected {new['expected']!r}, tol {new['tol']!r}")
        for k in ('title', 'dataset'):
            if r['new'][k] != r['base'][k]:
                lines.append(wrap(f"{k.upper()} was: {r['base'][k]}", lead='--   '))
                lines.append(wrap(f"{k.upper()} now: {r['new'][k]}", lead='--   '))
        if r['new']['prompt'] != r['base']['prompt']:
            lines.append(wrap('PROMPT now: ' + r['new']['prompt'], lead='--   '))
        lines.append('--')
    moved = [f'{course}/{t}' for t in tiers if rows[t]['moves']]
    attempts = (('Tiers whose graded keys move: ' + ', '.join(moved) + '. Before it writes, the file counts '
                 'academy_capstone_attempts on each and REFUSES if any exist, unless D5 allowlists that tier with the '
                 'exact attempt ids (allowlist: ' + (json.dumps(ALLOW) if ALLOW else 'empty') + '). Stored scores are '
                 'never touched.') if guard else
                'This file moves no graded key or tolerance (prompt copy only), so no attempt can be graded '
                'differently and there is no attempts guard.')
    header = f"""-- ============================================================================
-- B5 FOLLOW-ON {spec['wave'].upper()} (leak re-case and strip): {course}.
--
-- Plan of record: docs/graded-field-audit/FOLLOW-ON-PROGRAMME.md section 3
-- (D4 A and B, D5). Spec: docs/graded-field-audit/w5/{course}.json. The new
-- keys come from {spec['fields_file']},
-- written by the course's engine generator and re-checked in CI.
--
{chr(10).join(lines)}
{wrap('ATTEMPTS. ' + attempts)}
--
-- GUARDS. Each row must hold EITHER its post-W1 form (prompt, title and
-- dataset by md5, fields as exact jsonb), which is rewritten, OR its W5 form,
-- which is left alone. Anything else raises and the whole file rolls back.
-- Generated by docs/graded-field-audit/w5_capstones.py. SAFE TO RE-RUN: a
-- second run writes nothing.
--
-- NOT A DB STEP. The lessons and panels that go with this file ship in the
-- NextGen zip, which must go live at nearly the same time as this apply.
-- ============================================================================
"""
    decl = ['  v_n        integer;', '  v_count    integer;', '  v_written  integer := 0;', '  v_ids      jsonb;',
            '  v_extra    jsonb;', '  v_idtxt    text;',
            f"  v_allow    jsonb := {q(json.dumps(ALLOW, sort_keys=True))}::jsonb;  -- D5 allowlist: 'course/tier' -> attempt ids signed off"]
    decl += [f'  v_s{i}       text;' for i in range(n)]
    body = []
    for i, t in enumerate(tiers):
        w = f"app_slug = {q(course)} and tier = {q(t)} and active"
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
    raise exception '{tag} refused: {course}/{t} matches neither its post-W1 form (prompt md5 {md5(b['prompt'])}) nor its W5 form (prompt md5 {md5(nw['prompt'])}), with the fields this file was generated against';
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
        for i, t in enumerate(tiers):
            if not rows[t]['moves']:
                continue
            ct = f'{course}/{t}'
            body.append(f"""  if v_s{i} = 'old' then
    select coalesce(jsonb_agg(a.id::text order by a.created_at, a.id), '[]'::jsonb) into v_ids
      from public.academy_capstone_attempts a where a.app_slug = {q(course)} and a.tier = {q(t)};
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
        w = f"app_slug = {q(course)} and tier = {q(t)} and active"
        nw = rows[t]['new']
        body.append(f"""
  if v_s{i} = 'old' then
    update public.academy_capstones
       set prompt = {q(nw['prompt'])},
           title = {q(nw['title'])},
           dataset = {q(nw['dataset'])},
           fields = {q(nw['fields'])}::jsonb
     where {w};
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception '{tag} refused: {course}/{t} updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select ({form_sql(nw)}) from public.academy_capstones where {w}) is not true then
    raise exception '{tag} refused: {course}/{t} does not read back as its W5 form';
  end if;""")
    body.append(f"\n  raise notice '{tag}: % of {n} row(s) written, % already applied', v_written, {n} - v_written;")
    return header + '\ndo $$\ndeclare\n' + '\n'.join(decl) + '\nbegin' + '\n'.join(body) + '\nend $$;\n'


def build(caps, specs):
    out, plans = {}, {}
    for course, spec in sorted(specs.items()):
        rows = plan(caps, spec)
        plans[course] = rows
        out[spec['migration']] = file_sql(spec, rows)
    return out, plans


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--container', default='w5a-scratch')
    ap.add_argument('--course', action='append', help='only these courses (default: every spec in w5/)')
    ap.add_argument('--check', action='store_true', help='fail if a committed migration differs from a regeneration')
    a = ap.parse_args()
    caps = live(a.container)
    if len(caps) < 100:
        sys.exit(f'REFUSED: the scratch holds {len(caps)} live capstones')
    specs = load_specs(a.course)
    out, plans = build(caps, specs)
    bad = 0
    for name, sql in sorted(out.items()):
        p = os.path.join(MIG, name)
        if a.check:
            if not os.path.exists(p) or open(p).read() != sql:
                print('DIFFERS', name)
                bad += 1
            else:
                print('same', name)
        else:
            open(p, 'w').write(sql)
            print('wrote', name)
    moved = sum(1 for r in plans.values() for t in r.values() if t['moves'])
    print(f'{len(out)} file(s); {moved} tier(s) re-keyed; {sum(len(r) for r in plans.values())} tier(s) written')
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
