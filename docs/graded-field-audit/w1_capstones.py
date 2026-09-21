#!/usr/bin/env python3
"""B5 FOLLOW-ON, WAVE 1 (grade integrity). Writes the guarded capstone migrations.

  python3 w1_capstones.py [--container w1-scratch] [--check]

Reads the live capstones from a LOCAL scratch replay in the post-20261023 state
(main + the B4 fixes batch + 20261022 + the round-off batch 20261023*; never
production) and writes

  migrations/20261024a_w1_<course>.sql
      the W1 re-keys (a guessable or answer-by-construction field replaced by a
      measured one), the eight held tightenings (D6) and the prompt copy that
      goes with them (a planted value taken out of a prompt, a roster
      published). Every file that moves a live `expected`, key or `tol` carries
      the attempts guard of 20260921_lesson_leak_grader_tolerances.sql: it
      counts academy_capstone_attempts on each tier it would write and refuses
      if any exist, unless D5 allowlists the tier (ALLOW below: the tier and
      the exact attempt ids signed off; any other id refuses). Stored scores
      are never touched.
  migrations/20261024b_w1_openbook_<course>.sql
      D4 part C: the honest open-book label on the capstone brief of every tier
      whose answers a lesson or a panel's opening view prints (57 tiers in 21
      courses: the 56 of FOLLOW-ON-PROGRAMME.md section 3 and seismolord intermediate, found by the W1 build). Prompt only; `fields` must
      equal the post-20261024a value exactly, before and after.

The specs are w1/<course>.json (one per course with a re-key or prompt edit),
TIGHTEN and OPENBOOK below. Every row is content-addressed: its prompt must
hold the md5 it was generated against and its fields the exact jsonb (it is
rewritten), or its W1 form (left alone); anything else raises and the file's
transaction rolls back. A file that will write also checks the round-off
post-state (SENTINELS) and refuses without it. Copy rule: no em or en dash, no
new "X, not Y" contrastive. `--check` regenerates in memory and fails if a
committed migration differs.
"""
import argparse, decimal, glob, hashlib, json, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
MIG = os.path.join(REPO, 'migrations')
SPECS = os.path.join(HERE, 'w1')

DASH = re.compile('[–—]')
CONTRAST = re.compile(r',\s*not\b(?!-)')  # a roster status 'not-verified' is data

# D6: the eight held tightenings. (course, tier, key, old tol, new tol, why)
TIGHTEN = [
    ('petrophysics', 'intermediate', 'phind_avg_sand_a', 0.005, 0.002,
     'the Root mean square combine one click away prints 0.1805, 0.0043 off, and passed at 0.005'),
    ('petrophysics', 'intermediate', 'phiw_avg_sand_a', 0.005, 0.002,
     'the density porosity mean printed beside it, 0.2022, is 0.0047 off and passed at 0.005'),
    ('petrophysics', 'advanced', 'rw_arps', 0.0005, 0.00005,
     'the given Rw 0.05 and the Pickett fit 0.0500 sit 0.00009 off and passed with no Arps work; the printed 0.0499 still passes'),
    ('petrophysics', 'advanced', 'rwe_ssp', 0.0005, 0.00005,
     'the known Rw 0.0500 sits 0.00017 off and passed; the printed 0.0498 still passes'),
    ('petrophysics', 'advanced', 'sw_waterleg_mean', 0.005, 0.0005,
     'the textbook "about 1" passed at 0.005 (0.0009 off); the printed 0.9991 still passes'),
    ('mbal', 'intermediate', 'pot_r2', 0.002, 0.0001,
     'a blind 1 or 0.999 passed at 0.002; the tile prints 12 significant figures'),
    ('earthmodel', 'advanced', 'krige_probe', 0.001, 0.0002,
     'the naive mean 0.290516 shown by default sits 0.00091 off and passed; the new probe tile prints 6 decimals'),
    ('waterflood', 'intermediate', 'hall_ratio_e4', 0.002, 0.0005,
     'the Stiles capacity ratio tile 1.4304 on the default Design view sits 0.0018 off and passed; the exact 10/7 route is untouched'),
]

# D5: tiers signed off for a re-key or tightening although attempts exist,
# with the exact attempt ids expected. W1 re-keys no tier known to hold
# attempts (welldata beginner is not re-keyed in W1), so it is empty. To sign a
# tier off: add ('course/tier', ['<uuid>', ...]) from `apply.sh attempts` and
# regenerate. Any attempt id not listed refuses.
ALLOW = {}

# D4 C: section 3 pick per tier (A re-case, B strip). Tiers not listed are not leaking.
PICK_B = {('seismolord', 'intermediate'),  # found by the W1 build: see w1/seismolord.json leak_note
          ('scal', 'intermediate'), ('scal', 'advanced'), ('mbal', 'intermediate'), ('mbal', 'advanced'),
          ('welltest', 'intermediate'), ('welltest', 'advanced'), ('seismolord', 'advanced'),
          ('welldesign', 'beginner'), ('welldesign', 'intermediate'), ('welldesign', 'advanced'),
          ('perfsand', 'advanced'), ('completion', 'beginner'), ('wellcontrol', 'beginner')}

LABEL_ALL = ('Open book: the figures this capstone grades can be read in this tier\'s lessons or on a panel as it opens, '
             'so for now it checks that you can find, read and report each one correctly.')
LABEL_SOME = ('Open book, in part: some of the figures this capstone grades can be read in this tier\'s lessons or on a '
              'panel as it opens, so for now those check that you can find, read and report them correctly.')
END_A = ' A later update moves it to a case of its own.'
END_B = ' A later update takes them out of the lessons and panels.'


def dumps(v):
    """jsonb text that keeps every published number exactly as stored."""
    if isinstance(v, decimal.Decimal):
        return str(v)
    if isinstance(v, float):
        return repr(v)
    if isinstance(v, dict):
        return '{' + ', '.join(json.dumps(k) + ': ' + dumps(x) for k, x in v.items()) + '}'
    if isinstance(v, list):
        return '[' + ', '.join(dumps(x) for x in v) + ']'
    return json.dumps(v, ensure_ascii=False)


def q(s):
    return "'" + s.replace("'", "''") + "'"


def md5(s):
    return hashlib.md5(s.encode()).hexdigest()


def live(container):
    sql = ("select coalesce(json_agg(json_build_object('app', app_slug, 'tier', tier, 'prompt', prompt, "
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
    if DASH.search(new):
        sys.exit(f'REFUSED: {where}: em or en dash in new copy {new[:80]!r}')
    if len(CONTRAST.findall(new)) > len(CONTRAST.findall(old)):
        sys.exit(f'REFUSED: {where}: new "X, not Y" contrastive in {new[:120]!r}')


def load_specs():
    specs = {}
    for p in sorted(glob.glob(os.path.join(SPECS, '*.json'))):
        s = json.load(open(p))
        specs[s['course']] = s
    return specs


def plan(caps, specs):
    """Per tier: base (post-20261023), after a (W1 fixes), after b (open-book label)."""
    tiers = {}
    for course, s in specs.items():
        for tier, t in s['tiers'].items():
            tiers.setdefault((course, tier), {'edits': [], 'fields': {}, 'why': [], 'tighten': []})
            e = tiers[(course, tier)]
            e['edits'] += [tuple(x) for x in t.get('prompt_edits', [])]
            e['fields'].update(t.get('fields', {}))
            if t.get('why'):
                e['why'].append(t['why'])
    for course, tier, key, old, new, why in TIGHTEN:
        e = tiers.setdefault((course, tier), {'edits': [], 'fields': {}, 'why': [], 'tighten': []})
        e['tighten'].append((key, old, new, why))
    rows = {}
    for (course, tier), e in sorted(tiers.items()):
        cap = caps[(course, tier)]
        prompt = cap['prompt']
        for a, b in e['edits']:
            if prompt.count(a) != 1:
                sys.exit(f'REFUSED: {course}/{tier}: prompt anchor not found exactly once: {a[:90]!r}')
            check_copy(f'{course}/{tier} prompt', a, b)
            prompt = prompt.replace(a, b)
        fields = json.loads(dumps(cap['fields']), parse_float=decimal.Decimal)
        keys = [f['key'] for f in fields]
        rekeys, tights = [], []
        for old_key, nf in e['fields'].items():
            if keys.count(old_key) != 1:
                sys.exit(f'REFUSED: {course}/{tier}: field {old_key} not live exactly once')
            i = keys.index(old_key)
            nf = {'key': nf['key'], 'tol': float(nf['tol']), 'unit': nf['unit'], 'label': nf['label'],
                  'expected': float(nf['expected'])}
            check_copy(f'{course}/{tier} label', '', nf['label'])
            if nf['key'] != old_key and nf['key'] in keys:
                sys.exit(f'REFUSED: {course}/{tier}: new key {nf["key"]} already live')
            rekeys.append((dict(fields[i]), nf))
            fields[i] = {k: nf[k] for k in ('key', 'tol', 'unit', 'label', 'expected')}
        for key, old, new, why in e['tighten']:
            if keys.count(key) != 1:
                sys.exit(f'REFUSED: {course}/{tier}: tightened field {key} not live exactly once')
            i = keys.index(key)
            if float(fields[i]['tol']) != old:
                sys.exit(f'REFUSED: {course}/{tier}.{key} carries tol {fields[i]["tol"]}, not the published {old}')
            if not new < old:
                sys.exit(f'REFUSED: {course}/{tier}.{key}: {old} -> {new} is not a tightening')
            fields[i] = dict(fields[i])
            fields[i]['tol'] = new
            tights.append((key, old, new, float(fields[i]['expected']), why))
        rows[(course, tier)] = {'base_prompt': cap['prompt'], 'base_fields': dumps(cap['fields']),
                                'a_prompt': prompt, 'a_fields': dumps(fields), 'edits': e['edits'],
                                'rekeys': rekeys, 'tights': tights, 'why': e['why'],
                                'moves_fields': bool(rekeys or tights)}
    return rows


def leak_tiers(specs):
    """Tiers whose answers print before the learner works, after W1: fields.json `leak`,
    with every W1 re-keyed field replaced by its spec's own `default_state_prints`."""
    rows = json.load(open(os.path.join(HERE, 'fields.json')))
    replaced = {}
    for course, s in specs.items():
        for tier, t in s['tiers'].items():
            for old_key, nf in t.get('fields', {}).items():
                a = t.get('annot', {}).get(nf['key'], {})
                replaced[(course, tier, old_key)] = bool(a.get('default_state_prints') or a.get('lesson_prints'))
            # a leak the W1 build found that the B5 sweep did not record (keyed by the live key)
            for key, v in t.get('leak_updates', {}).items():
                old = next((o for o, nf in t.get('fields', {}).items() if nf['key'] == key), key)
                replaced[(course, tier, old)] = bool(v)
    out = {}
    for r in rows:
        k = (r['course'], r['tier'])
        leak = replaced.get((r['course'], r['tier'], r['key']), r.get('leak'))
        out.setdefault(k, []).append(bool(leak))
    return {k: all(v) for k, v in out.items() if any(v)}


def label_for(course, tier, every):
    return (LABEL_ALL if every else LABEL_SOME) + (END_B if (course, tier) in PICK_B else END_A)


SENTINEL_SQL = """
  -- the round-off batch (20261023*) must be applied first: its rows are this file's base
  if exists (select 1 from public.academy_capstones where app_slug = 'cementing' and tier = 'advanced' and active and md5(prompt) <> '{cem}')
     or exists (select 1 from public.academy_capstones where app_slug = 'casingtubing' and tier = 'advanced' and active and md5(prompt) <> '{cas}')
     or exists (select 1 from public.academy_capstones where app_slug = 'gaswell' and tier = 'advanced' and active and md5(prompt) <> '{gas}')
     or exists (select 1 from public.academy_capstones where app_slug = 'wellcontrol' and tier = 'beginner' and active and md5(dataset) <> '{wcd}')
     or exists (select 1 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
                 where c.app_slug = 'fiscal' and c.tier = 'intermediate' and c.active and f->>'key' = 'psc_npv_musd'
                   and (f->>'tol')::float8 <> 0.05) then
    raise exception '{tag} refused: the round-off batch (20261023*) is not applied on this database; apply it first (/root/roundoff-apply/apply.sh apply --prod)';
  end if;"""


def sentinel_md5s(caps):
    return {'cem': md5(caps[('cementing', 'advanced')]['prompt']),
            'cas': md5(caps[('casingtubing', 'advanced')]['prompt']),
            'gas': md5(caps[('gaswell', 'advanced')]['prompt']),
            'wcd': md5(caps[('wellcontrol', 'beginner')]['dataset'])}


def later_sql(later, how='when'):
    """A row already carried past this file by a later W1 file (the open-book label) counts as applied."""
    out = ''
    for p, f in later:
        c = f"md5(prompt) = '{md5(p)}' and fields = {q(f)}::jsonb"
        out += f"\n              when {c} then 'new'" if how == 'when' else f"\n        or ({c})"
    return out


def file_sql(tag, header, tiers, sent, guard):
    """tiers: list of (course, tier, old_prompt, old_fields_text, new_prompt, new_fields_text, moves_fields)."""
    n = len(tiers)
    decl = ['  v_n        integer;', '  v_count    integer;', '  v_written  integer := 0;', '  v_ids      jsonb;',
            '  v_extra    jsonb;', f"  v_allow    jsonb := {q(json.dumps(ALLOW, sort_keys=True))}::jsonb;  -- D5 allowlist: 'course/tier' -> attempt ids signed off"]
    decl += [f'  v_s{i}       text;' for i in range(n)]
    body = []
    for i, (course, tier, op, of, np_, nf, mv, later) in enumerate(tiers):
        w = f"app_slug = {q(course)} and tier = {q(tier)} and active"
        body.append(f"""
  -- {course} / {tier}
  select count(*) into v_n from public.academy_capstones where {w};
  if v_n <> 1 then raise exception '{tag} refused: {course}/{tier} has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '{md5(op)}' and fields = {q(of)}::jsonb then 'old'
              when md5(prompt) = '{md5(np_)}' and fields = {q(nf)}::jsonb then 'new'{later_sql(later)}
              else 'other' end
    into v_s{i} from public.academy_capstones where {w};
  if v_s{i} = 'other' then
    raise exception '{tag} refused: {course}/{tier} matches neither its published form (prompt md5 {md5(op)}) nor its W1 form (prompt md5 {md5(np_)}), with the fields this file was generated against';
  end if;""")
    body.append('\n  -- nothing to write: every row is already in its W1 form')
    body.append('  if ' + ' and '.join(f"v_s{i} = 'new'" for i in range(n)) + ' then')
    body.append(f"    raise notice '{tag}: 0 of {n} row(s) written, all already applied';")
    body.append('    return;')
    body.append('  end if;')
    body.append(SENTINEL_SQL.format(tag=tag, **sent))
    if guard:
        body.append("""
  -- ATTEMPTS. A tier whose graded key or tolerance this file moves must hold no
  -- capstone attempt (a stored score is never re-scored, but a learner could be
  -- graded differently on a retry of the same brief), unless D5 allowlists it
  -- with the exact attempt ids signed off. Any other attempt refuses.""")
        for i, (course, tier, op, of, np_, nf, mv, later) in enumerate(tiers):
            if not mv:
                continue
            body.append(f"""  if v_s{i} = 'old' then
    select coalesce(jsonb_agg(a.id::text order by a.created_at, a.id), '[]'::jsonb) into v_ids
      from public.academy_capstone_attempts a where a.app_slug = {q(course)} and a.tier = {q(tier)};
    if jsonb_array_length(v_ids) > 0 then
      if v_allow ? '{course}/{tier}' then
        select coalesce(jsonb_agg(x), '[]'::jsonb) into v_extra
          from jsonb_array_elements(v_ids) x where not (v_allow->'{course}/{tier}') @> jsonb_build_array(x);
        if jsonb_array_length(v_extra) > 0 then
          raise exception '{tag} refused: {course}/{tier} holds % attempt(s) outside its D5 allowlist: %', jsonb_array_length(v_extra), v_extra;
        end if;
        raise notice '{tag}: {course}/{tier} holds % allowlisted attempt(s) (D5 sign-off); their stored scores are not touched', jsonb_array_length(v_ids);
      else
        raise exception '{tag} refused: {course}/{tier} holds % capstone attempt(s) (%) and this file moves its graded key or tolerance; sign the tier off under D5 (allowlist with these ids) or hold it', jsonb_array_length(v_ids), v_ids;
      end if;
    end if;
  end if;""")
    for i, (course, tier, op, of, np_, nf, mv, later) in enumerate(tiers):
        w = f"app_slug = {q(course)} and tier = {q(tier)} and active"
        body.append(f"""
  if v_s{i} = 'old' then
    update public.academy_capstones
       set prompt = {q(np_)},
           fields = {q(nf)}::jsonb
     where {w};
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception '{tag} refused: {course}/{tier} updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '{md5(np_)}' and fields = {q(nf)}::jsonb){later_sql(later, 'or')} from public.academy_capstones where {w}) is not true then
    raise exception '{tag} refused: {course}/{tier} does not read back as its W1 form';
  end if;""")
    body.append(f"\n  raise notice '{tag}: % of {n} row(s) written, % already applied', v_written, {n} - v_written;")
    return header + '\ndo $$\ndeclare\n' + '\n'.join(decl) + '\nbegin' + '\n'.join(body) + '\nend $$;\n'


def rekey_file(course, rows, sent, blab):
    tiers = sorted([k for k in rows if k[0] == course], key=lambda k: ('beginner', 'intermediate', 'advanced').index(k[1]))
    tag = f'w1 {course}'
    lines = []
    guard = any(rows[k]['moves_fields'] for k in tiers)
    for k in tiers:
        r = rows[k]
        lines.append(f'-- {k[1].upper()}')
        for w in r['why']:
            lines.append(wrap(w, lead='--   '))
        for old, new in r['rekeys']:
            if old['key'] == new['key'] and float(old['expected']) == new['expected']:
                continue
            lines.append(f"--   RE-KEY {old['key']} (expected {old['expected']}, tol {old['tol']})")
            lines.append(f"--       -> {new['key']} '{new['label']}' {new['unit']}, expected {new['expected']!r}, tol {new['tol']!r}")
        for key, old, new, exp, why in r['tights']:
            lines.append(f'--   TIGHTEN {key} (expected {exp!r}) tol {old:g} -> {new:g}:')
            lines.append(wrap(why, lead='--       '))
        for a, b in r['edits']:
            lines.append(wrap('PROMPT was: ' + a, lead='--   '))
            lines.append(wrap('PROMPT now: ' + b, lead='--   '))
        lines.append('--')
    moved = [f'{k[0]}/{k[1]}' for k in tiers if rows[k]['moves_fields']]
    header = f"""-- ============================================================================
-- B5 FOLLOW-ON W1 (grade integrity): {course}.
--
-- Plan of record: docs/graded-field-audit/FOLLOW-ON-PROGRAMME.md section 4 and
-- the annotations in docs/graded-field-audit/annot/{course}.json. Owner
-- approved D1 to D7 as recommended, 2026-09-21.
--
{chr(10).join(lines)}
-- WHAT DOES NOT MOVE. Every other field (key, label, unit, expected, tol and
-- position), the title, dataset, status and the row itself.
--
-- ATTEMPTS. {('Tiers whose graded key or tolerance moves: ' + ', '.join(moved) + '. Before it writes, the file counts academy_capstone_attempts on each and REFUSES if any exist, unless D5 allowlists that tier with the exact attempt ids (allowlist: ' + (json.dumps(ALLOW) if ALLOW else 'empty') + '). Stored scores are never touched.') if guard else 'This file moves no graded key or tolerance (prompt copy only), so no attempt can be graded differently and there is no attempts guard.'}
--
-- GUARDS. Each row must hold EITHER its published prompt (by md5) and fields
-- (exact jsonb) as the post-20261023 scratch replay has them (it is
-- rewritten), OR its W1 form (left alone). Anything else raises and the whole
-- file rolls back. A file that will write first checks the round-off
-- post-state (20261023*) and refuses without it. Generated by
-- docs/graded-field-audit/w1_capstones.py. SAFE TO RE-RUN: a second run
-- writes nothing.
-- ============================================================================
"""
    header = '\n'.join(l if l.strip() != '--   ' else '--' for l in header.split('\n'))
    header = re.sub(r'^-- (ATTEMPTS\..*)$', lambda m: wrap(m.group(1)), header, flags=re.M)
    t = [(k[0], k[1], rows[k]['base_prompt'], rows[k]['base_fields'], rows[k]['a_prompt'], rows[k]['a_fields'],
          rows[k]['moves_fields'], [(blab[k], rows[k]['a_fields'])] if k in blab else []) for k in tiers]
    return file_sql(tag, header, t, sent, guard)


def openbook_file(course, labels, sent):
    tag = f'w1 open-book {course}'
    tiers = sorted(labels, key=lambda k: ('beginner', 'intermediate', 'advanced').index(k[1]))
    lines = []
    for k in tiers:
        lines.append(f"-- {k[1]}: {'every' if labels[k]['every'] else 'some'} graded figure(s) printed; section 3 pick {'B (strip)' if k in PICK_B else 'A (re-case)'}")
    label_lines = sorted({labels[k]['label'] for k in tiers})
    header = f"""-- ============================================================================
-- B5 FOLLOW-ON W1, D4 PART C: the open-book label on the {course} capstone
-- brief.
--
-- WHY. A lesson or a panel's opening view prints the answers these capstones
-- grade (docs/graded-field-audit/README.md finding 3; FOLLOW-ON-PROGRAMME.md
-- section 3). Until W5 re-cases or strips them, the brief says so. The label is
-- the brief's first sentence; the rest of the prompt is unchanged. The same
-- note heads the tier's capstone lesson (NextGen zip).
--
{chr(10).join(lines)}
--
-- THE LABEL:
{chr(10).join(wrap(l, lead='--   ') for l in label_lines)}
--
-- WHAT DOES NOT MOVE. `fields` (every key, label, unit, expected and
-- tolerance), title, dataset, status and the row. The guard requires `fields`
-- to equal its post-20261024a value exactly, before and after, so no answer
-- grades differently and no attempt guard is needed.
--
-- GUARDS. Each prompt must hold its post-20261024a text (md5, rewritten) or
-- its labelled text (left alone). Anything else raises and the file rolls
-- back. Runs after 20261024a_w1_*. Generated by
-- docs/graded-field-audit/w1_capstones.py. SAFE TO RE-RUN.
-- ============================================================================
"""
    t = [(k[0], k[1], labels[k]['a_prompt'], labels[k]['a_fields'], labels[k]['b_prompt'], labels[k]['a_fields'], False, [])
         for k in tiers]
    return file_sql(tag, header, t, sent, False)


def build(caps):
    specs = load_specs()
    rows = plan(caps, specs)
    sent = sentinel_md5s(caps)
    out = {}
    leaks = leak_tiers(specs)
    by_course, blab = {}, {}
    for (course, tier), every in sorted(leaks.items()):
        r = rows.get((course, tier))
        a_prompt = r['a_prompt'] if r else caps[(course, tier)]['prompt']
        a_fields = r['a_fields'] if r else dumps(caps[(course, tier)]['fields'])
        label = label_for(course, tier, every)
        check_copy(f'{course}/{tier} label', '', label)
        by_course.setdefault(course, {})[(course, tier)] = {
            'every': every, 'label': label, 'a_prompt': a_prompt, 'a_fields': a_fields,
            'b_prompt': label + ' ' + a_prompt}
        blab[(course, tier)] = label + ' ' + a_prompt
    for course in sorted({k[0] for k in rows}):
        out[f'20261024a_w1_{course}.sql'] = rekey_file(course, rows, sent, blab)
    for course, labels in by_course.items():
        out[f'20261024b_w1_openbook_{course}.sql'] = openbook_file(course, labels, sent)
    return out, rows, by_course


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--container', default='w1-scratch')
    ap.add_argument('--check', action='store_true', help='fail if a committed migration differs from a regeneration')
    ap.add_argument('--part', choices=('a', 'b', 'all'), default='all',
                    help='a: the 20261024a re-key files; b: the 20261024b open-book files')
    ap.add_argument('--labels', help='write the per-tier labels as JSON here (for the lesson notes)')
    a = ap.parse_args()
    caps = live(a.container)
    if len(caps) < 100:
        sys.exit(f'REFUSED: the scratch holds {len(caps)} live capstones')
    out, rows, labels = build(caps)
    if a.part != 'all':
        out = {k: v for k, v in out.items() if k.startswith(f'20261024{a.part}_')}
    if a.labels:
        json.dump({f'{c}/{t}': v['label'] for lab in labels.values() for (c, t), v in lab.items()},
                  open(a.labels, 'w'), indent=1, sort_keys=True)
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
    pat = '20261024*_w1_*.sql' if a.part == 'all' else f'20261024{a.part}_w1_*.sql'
    stale = set(os.path.basename(p) for p in glob.glob(os.path.join(MIG, pat))) - set(out)
    for s in sorted(stale):
        print('STALE (not generated):', s)
        bad += 1
    print(f'{len(out)} file(s); {sum(1 for r in rows.values() if r["moves_fields"])} tier(s) with a moved key or tol; '
          f'{sum(len(v) for v in labels.values())} labelled tier(s) in {len(labels)} course(s)')
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
