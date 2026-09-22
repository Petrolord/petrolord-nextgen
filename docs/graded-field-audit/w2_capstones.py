#!/usr/bin/env python3
"""B5 FOLLOW-ON, WAVE 2 (publish inputs in prompts and lessons). Writes the guarded prompt migrations.

  python3 w2_capstones.py [--container w2-scratch] [--check]

Reads the live capstones from a LOCAL scratch replay in the production state
of 2026-09-22 (the mirror plus the B4, B5, round-off and W1 files; never
production) and the specs w2/<course>.json that w2/build_specs.mjs writes
from each capstone's own fixture and the vendored engines. For every course
whose spec edits a prompt it writes

  migrations/20261025a_w2_<course>.sql
      the prompt copy that publishes the inputs (rosters, rows, the case, the
      tubing constants, z per station, E x I, the two pressures, the yard, the
      reference temperature). PROMPT ONLY: every row's `fields` must equal its
      live value exactly, before and after, so no key, expected value or
      tolerance moves, nobody is re-scored and there is no attempts guard.

normalize.py records each spec's prompt edits on the fields they unlock, so
`audit.py --post --wave w2` checks the published text is in every W2 prompt.

Every row is content-addressed: its prompt must hold the md5 it was generated
against and its fields the exact jsonb (it is rewritten), or its W2 form (left
alone); anything else raises and the file's transaction rolls back. A file that
will write first checks that W1 is applied (SENTINELS). Each spec's expected
values must equal the live keys. Copy rule: no em or en dash, no new
"X, not Y" contrastive. `--check` regenerates in memory and fails if a
committed file differs.
"""
import argparse, glob, json, os, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import w1_capstones as w1  # live(), dumps(), q(), md5(), wrap(), check_copy(): the W1 pattern, reused

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
MIG = os.path.join(REPO, 'migrations')
SPECS = os.path.join(HERE, 'w2')
ORDER = ('beginner', 'intermediate', 'advanced')

# W1 must be applied first: production holds it (2026-09-22) and the W2 apply
# script checks all 34 files. The in-file sentinel reads two W1 rows: the
# integrity beginner prompt (20261024a, rosters published) and the welldata
# beginner prompt (20261024b, the open-book label).
SENTINEL_TIERS = (('integrity', 'beginner'), ('welldata', 'beginner'))


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
            live_fields = {f['key']: f for f in cap['fields']}
            for key, e in t.get('expected', {}).items():
                f = live_fields.get(key)
                if f is None:
                    sys.exit(f'REFUSED: {course}/{tier}: spec field {key} is not live')
                if float(f['expected']) != float(e['expected']):
                    sys.exit(f'REFUSED: {course}/{tier}.{key}: spec expected {e["expected"]} is not the live {f["expected"]}')
                if float(e['tol']) > float(f['tol']):
                    sys.exit(f'REFUSED: {course}/{tier}.{key}: spec reproduces to {e["tol"]}, looser than the live tol {f["tol"]}')
            edits = [tuple(x) for x in t.get('prompt_edits', [])]
            if not edits:
                continue
            prompt = cap['prompt']
            for a, b in edits:
                if prompt.count(a) != 1:
                    sys.exit(f'REFUSED: {course}/{tier}: prompt anchor not found exactly once: {a[:90]!r}')
                w1.check_copy(f'{course}/{tier} prompt', a, b)
                prompt = prompt.replace(a, b)
            rows[(course, tier)] = {'base': cap['prompt'], 'new': prompt, 'fields': w1.dumps(cap['fields']),
                                    'edits': edits, 'why': t.get('why', '')}
    return rows


def file_sql(course, tiers, rows, sent):
    tag = f'w2 {course}'
    lines = []
    for k in tiers:
        r = rows[k]
        lines.append(f'-- {k[1].upper()}')
        lines.append(w1.wrap(r['why'], lead='--   '))
        for a, b in r['edits']:
            lines.append(w1.wrap('PROMPT was: ' + a, lead='--   '))
            lines.append(w1.wrap('PROMPT now: ' + b, lead='--   '))
        lines.append('--')
    header = f"""-- ============================================================================
-- B5 FOLLOW-ON W2 (publish inputs in prompts and lessons): {course}.
--
-- Plan of record: docs/graded-field-audit/FOLLOW-ON-PROGRAMME.md section 1,
-- route (a), and the spec docs/graded-field-audit/w2/{course}.json (the
-- inputs, where each came from, and the key each reproduces through the
-- vendored engines). Owner approved D1 to D7 as recommended, 2026-09-21.
--
{chr(10).join(lines)}
-- WHAT DOES NOT MOVE. `fields` (every key, label, unit, expected value and
-- tolerance), title, dataset, status and the row. The guard requires `fields`
-- to equal its live value exactly, before and after, so no answer grades
-- differently, nobody is re-scored and no attempts guard is needed.
--
-- GUARDS. Each row must hold EITHER its published prompt (by md5) with its
-- live fields (exact jsonb), as production holds it after W1 (it is
-- rewritten), OR its W2 prompt with the same fields (left alone). Anything
-- else raises and the whole file rolls back. A file that will write first
-- checks the W1 post-state and refuses without it. Generated by
-- docs/graded-field-audit/w2_capstones.py. SAFE TO RE-RUN: a second run
-- writes nothing.
-- ============================================================================
"""
    n = len(tiers)
    decl = ['  v_n        integer;', '  v_count    integer;', '  v_written  integer := 0;']
    decl += [f'  v_s{i}       text;' for i in range(n)]
    body = []
    for i, k in enumerate(tiers):
        course_, tier = k
        r = rows[k]
        w = f"app_slug = {w1.q(course_)} and tier = {w1.q(tier)} and active"
        body.append(f"""
  -- {course_} / {tier}
  select count(*) into v_n from public.academy_capstones where {w};
  if v_n <> 1 then raise exception '{tag} refused: {course_}/{tier} has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '{w1.md5(r['base'])}' and fields = {w1.q(r['fields'])}::jsonb then 'old'
              when md5(prompt) = '{w1.md5(r['new'])}' and fields = {w1.q(r['fields'])}::jsonb then 'new'
              else 'other' end
    into v_s{i} from public.academy_capstones where {w};
  if v_s{i} = 'other' then
    raise exception '{tag} refused: {course_}/{tier} matches neither its published form (prompt md5 {w1.md5(r['base'])}) nor its W2 form (prompt md5 {w1.md5(r['new'])}), with the fields this file was generated against';
  end if;""")
    body.append('\n  -- nothing to write: every row is already in its W2 form')
    body.append('  if ' + ' and '.join(f"v_s{i} = 'new'" for i in range(n)) + ' then')
    body.append(f"    raise notice '{tag}: 0 of {n} row(s) written, all already applied';")
    body.append('    return;')
    body.append('  end if;')
    conds = '\n     or '.join(
        f"exists (select 1 from public.academy_capstones where app_slug = {w1.q(c)} and tier = {w1.q(t)} and active and md5(prompt) <> '{sent[(c, t)]}')"
        for c, t in SENTINEL_TIERS)
    body.append(f"""
  -- W1 (20261024a/b) must be applied first: production holds it, and the W2
  -- apply script checks all 34 files; this reads two of its rows
  if {conds} then
    raise exception '{tag} refused: W1 (20261024*) is not applied on this database; apply it first (/root/w1-apply/apply.sh apply --prod)';
  end if;""")
    for i, k in enumerate(tiers):
        course_, tier = k
        r = rows[k]
        w = f"app_slug = {w1.q(course_)} and tier = {w1.q(tier)} and active"
        body.append(f"""
  if v_s{i} = 'old' then
    update public.academy_capstones
       set prompt = {w1.q(r['new'])}
     where {w} and md5(prompt) = '{w1.md5(r['base'])}';
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception '{tag} refused: {course_}/{tier} updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '{w1.md5(r['new'])}' and fields = {w1.q(r['fields'])}::jsonb) from public.academy_capstones where {w}) is not true then
    raise exception '{tag} refused: {course_}/{tier} does not read back as its W2 form';
  end if;""")
    body.append(f"\n  raise notice '{tag}: % of {n} row(s) written, % already applied', v_written, {n} - v_written;")
    return header + '\ndo $$\ndeclare\n' + '\n'.join(decl) + '\nbegin' + '\n'.join(body) + '\nend $$;\n'


def build(caps):
    specs = load_specs()
    rows = plan(caps, specs)
    sent = {k: w1.md5(caps[k]['prompt']) for k in SENTINEL_TIERS}
    out = {}
    for course in sorted({k[0] for k in rows}):
        tiers = sorted([k for k in rows if k[0] == course], key=lambda k: ORDER.index(k[1]))
        out[f'20261025a_w2_{course}.sql'] = file_sql(course, tiers, rows, sent)
    return out, rows, specs


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--container', default='w2-scratch')
    ap.add_argument('--check', action='store_true', help='fail if a committed file differs from a regeneration')
    a = ap.parse_args()
    caps = w1.live(a.container)
    if len(caps) < 100:
        sys.exit(f'REFUSED: the scratch holds {len(caps)} live capstones')
    out, rows, specs = build(caps)
    files = {os.path.join(MIG, k): v for k, v in out.items()}
    bad = 0
    for p, text in sorted(files.items()):
        if a.check:
            if not os.path.exists(p) or open(p).read() != text:
                print('DIFFERS', os.path.relpath(p, REPO))
                bad += 1
        else:
            open(p, 'w').write(text)
            print('wrote', os.path.relpath(p, REPO))
    stale = set(os.path.basename(p) for p in glob.glob(os.path.join(MIG, '20261025a_w2_*.sql'))) - set(out)
    for s in sorted(stale):
        print('STALE (not generated):', s)
        bad += 1
    nf = sum(len(t.get('expected', {})) for s in specs.values() for t in s['tiers'].values())
    print(f'{len(out)} migration(s) over {len(rows)} prompt(s); {len(specs)} spec(s) covering {nf} graded field(s), every expected equal to the live key')
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
