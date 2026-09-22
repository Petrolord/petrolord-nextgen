#!/usr/bin/env python3
"""B5 FOLLOW-ON, WAVE 3 (Suite Full precision). Writes the prompt-only capstone migrations.

  python3 w3_capstones.py [--container w3-scratch] [--check]

W3 adds a shared "Full precision" switch to the Suite apps whose product cards
round a graded quantity past its tolerance (FOLLOW-ON-PROGRAMME.md section 2 and
the section 1 Suite rows, decision D3). The switch is OFF by default, so a
learner must be told to turn it on. This script reads the live capstones from a
LOCAL scratch replay in the post-W1 state (production of 2026-09-22: the
round-off 20261023* and W1 20261024* applied; never production) and writes

  migrations/20261026_w3_<course>.sql
      one sentence appended to the capstone brief of each tier whose graded
      figures are read in a Suite app, naming the app and the switch. Prompt
      only: `fields` must equal its post-W1 value exactly, before and after, so
      no answer grades differently and there is no attempts guard.

The specs are w3/<course>.json: per tier the sentence (`append`) and why, and
per field the post-W3 annotation (`annot_updates`: where the switch prints it
and at what precision), which normalize.py folds into annot/ so audit.py moves
the field's class. Every row is content-addressed: its prompt must hold the md5
it was generated against (rewritten) or its W3 form (left alone), and its
fields the exact jsonb; anything else raises and the file rolls back. A file
that will write first checks the W1 post-state (SENTINEL) and refuses without
it. Copy rule: no em or en dash, no new "X, not Y" contrastive. `--check`
regenerates in memory and fails if a committed migration differs.

ORDER. These briefs name a switch that exists only in the Suite build carrying
the W3 Suite PRs. Apply them after that Suite zip is live (the owner script
checks the markers first).
"""
import argparse, glob, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import w1_capstones as w1  # noqa: E402  (shared helpers: dumps, q, md5, wrap, check_copy, live)

MIG = w1.MIG
SPECS = os.path.join(HERE, 'w3')
TIERS = ('beginner', 'intermediate', 'advanced')

# W1 (20261024*) must be applied first: its rows are this file's base.
SENTINEL_SQL = """
  -- W1 (20261024*) must be applied first: its rows are this file's base
  if not exists (select 1 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
                  where c.app_slug = 'seismolord' and c.tier = 'intermediate' and c.active and f->>'key' = 'corr_zero_lag')
     or not exists (select 1 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
                  where c.app_slug = 'mbal' and c.tier = 'beginner' and c.active and f->>'key' = 'eo_last_rb_stb')
     or not exists (select 1 from public.academy_capstones
                  where app_slug = 'basin' and tier = 'beginner' and active and prompt like 'Open book%') then
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
            if not t.get('append'):
                continue
            cap = caps.get((course, tier))
            if cap is None:
                sys.exit(f'REFUSED: {course}/{tier} has no live capstone')
            add = t['append'].strip()
            w1.check_copy(f'{course}/{tier} prompt', '', add)
            if 'Full precision' not in add:
                sys.exit(f'REFUSED: {course}/{tier}: the sentence does not name the Full precision switch')
            base = cap['prompt']
            if add in base:
                sys.exit(f'REFUSED: {course}/{tier}: the base prompt already carries the sentence')
            keys = [f['key'] for f in cap['fields']]
            for key in t.get('keys', []):
                if key not in keys:
                    sys.exit(f'REFUSED: {course}/{tier}: {key} is not live')
            rows[(course, tier)] = {'base_prompt': base, 'new_prompt': base.rstrip() + ' ' + add,
                                    'fields': w1.dumps(cap['fields']), 'append': add, 'why': t.get('why', ''),
                                    'keys': t.get('keys', [])}
    return rows


def file_sql(course, rows):
    tag = f'w3 {course}'
    tiers = sorted([k for k in rows if k[0] == course], key=lambda k: TIERS.index(k[1]))
    n = len(tiers)
    lines = []
    for k in tiers:
        r = rows[k]
        lines.append(f'-- {k[1].upper()}')
        lines.append(w1.wrap('Fields read with the switch on: ' + (', '.join(r['keys']) or 'none named') + '.', lead='--   '))
        if r['why']:
            lines.append(w1.wrap(r['why'], lead='--   '))
        lines.append(w1.wrap('APPENDED: ' + r['append'], lead='--   '))
        lines.append('--')
    header = f"""-- ============================================================================
-- B5 FOLLOW-ON W3 (Suite Full precision): {course} capstone brief.
--
-- Plan of record: docs/graded-field-audit/FOLLOW-ON-PROGRAMME.md section 2 and
-- the section 1 Suite rows, decision D3 (owner approved D1 to D7 as
-- recommended, 2026-09-21). The Suite app the capstone is read in gains a
-- "Full precision" switch, off by default, that prints the graded quantities
-- at the precision they are graded to. The brief now says to switch it on.
--
{chr(10).join(lines)}
-- WHAT DOES NOT MOVE. `fields` (every key, label, unit, expected and
-- tolerance, and their order), title, dataset, status and the row. The guard
-- requires `fields` to equal its post-W1 value exactly, before and after, so
-- no answer grades differently and no attempts guard is needed.
--
-- ORDER. Apply only once the Suite build carrying the W3 switch is live (the
-- brief names it). Runs after W1 (20261024*): refuses without it.
--
-- GUARDS. Each prompt must hold its post-W1 text (md5, rewritten) or its W3
-- text (left alone), with the exact fields. Anything else raises and the file
-- rolls back. Generated by docs/graded-field-audit/w3_capstones.py from
-- w3/{course}.json. SAFE TO RE-RUN: a second run writes nothing.
-- ============================================================================
"""
    header = '\n'.join(l if l.strip() != '--   ' else '--' for l in header.split('\n'))
    decl = ['  v_n        integer;', '  v_count    integer;', '  v_written  integer := 0;']
    decl += [f'  v_s{i}       text;' for i in range(n)]
    body = []
    for i, (c, tier) in enumerate(tiers):
        r = rows[(c, tier)]
        w = f"app_slug = {w1.q(c)} and tier = {w1.q(tier)} and active"
        body.append(f"""
  -- {c} / {tier}
  select count(*) into v_n from public.academy_capstones where {w};
  if v_n <> 1 then raise exception '{tag} refused: {c}/{tier} has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '{w1.md5(r['base_prompt'])}' and fields = {w1.q(r['fields'])}::jsonb then 'old'
              when md5(prompt) = '{w1.md5(r['new_prompt'])}' and fields = {w1.q(r['fields'])}::jsonb then 'new'
              else 'other' end
    into v_s{i} from public.academy_capstones where {w};
  if v_s{i} = 'other' then
    raise exception '{tag} refused: {c}/{tier} matches neither its post-W1 form (prompt md5 {w1.md5(r['base_prompt'])}) nor its W3 form (prompt md5 {w1.md5(r['new_prompt'])}), with the fields this file was generated against';
  end if;""")
    body.append('\n  -- nothing to write: every row is already in its W3 form')
    body.append('  if ' + ' and '.join(f"v_s{i} = 'new'" for i in range(n)) + ' then')
    body.append(f"    raise notice '{tag}: 0 of {n} row(s) written, all already applied';")
    body.append('    return;')
    body.append('  end if;')
    body.append(SENTINEL_SQL.format(tag=tag))
    for i, (c, tier) in enumerate(tiers):
        r = rows[(c, tier)]
        w = f"app_slug = {w1.q(c)} and tier = {w1.q(tier)} and active"
        body.append(f"""
  if v_s{i} = 'old' then
    update public.academy_capstones
       set prompt = {w1.q(r['new_prompt'])}
     where {w};
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception '{tag} refused: {c}/{tier} updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '{w1.md5(r['new_prompt'])}' and fields = {w1.q(r['fields'])}::jsonb) from public.academy_capstones where {w}) is not true then
    raise exception '{tag} refused: {c}/{tier} does not read back as its W3 form';
  end if;""")
    body.append(f"\n  raise notice '{tag}: % of {n} row(s) written, % already applied', v_written, {n} - v_written;")
    return header + '\ndo $$\ndeclare\n' + '\n'.join(decl) + '\nbegin' + '\n'.join(body) + '\nend $$;\n'


def build(caps):
    specs = load_specs()
    rows = plan(caps, specs)
    return {f'20261026_w3_{c}.sql': file_sql(c, rows) for c in sorted({k[0] for k in rows})}, rows


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--container', default='w3-scratch')
    ap.add_argument('--check', action='store_true', help='fail if a committed migration differs from a regeneration')
    a = ap.parse_args()
    caps = w1.live(a.container)
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
    stale = set(os.path.basename(p) for p in glob.glob(os.path.join(MIG, '20261026_w3_*.sql'))) - set(out)
    for s in sorted(stale):
        print('STALE (not generated):', s)
        bad += 1
    print(f'{len(out)} file(s); {len(rows)} tier(s) with the Full precision sentence')
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
